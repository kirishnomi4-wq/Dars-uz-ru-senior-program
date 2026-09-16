// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/2-Modull/PracticeLesson2.jsx
//  Kompilyator: yo'q (dars uni import qilmaydi)
//  Qayta yig'ish:  node scripts/build-lms.mjs src/2-Modull/PracticeLesson2.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/2-Modull/PracticeLesson2.jsx
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

// src/2-Modull/PracticeLesson2.jsx
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
var __lang = "uz";
var tr2 = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React3.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? "";
};
var LangContext = createContext2("uz");
var MentorCtx = createContext2(null);
var AchCtx = createContext2(null);
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split(/(`[^`]+`)/g).map((p, i) => p.startsWith("`") && p.endsWith("`") ? <code key={i} className="qcode">{p.slice(1, -1)}</code> : p) : s;
var useLang = () => useContext2(LangContext);
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
var LESSON_META = { lessonId: "practice-02-ai-promo-v18", lessonTitle: { uz: "Praktika 2 — AI bilan tez sayt", ru: "Практика 2 — Быстрый сайт через AI" } };
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
  { id: "s6", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s7", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s8", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s9", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s10", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s11", type: "case", template: "custom", scored: false, scope: null },
  { id: "s12", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s13", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s14", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s15", type: "test", template: "custom", scored: true, scope: "final" },
  { id: "s15b", type: "stats", template: "custom", scored: false, scope: null },
  { id: "sflash", type: "flashcard", template: "custom", scored: false, scope: null },
  { id: "s16", type: "summary", template: "custom", scored: false, scope: null }
];
var TOTAL_SCREENS = SCREEN_META.length;
var SCORED_IDX = SCREEN_META.map((m, i) => m.scored ? i : null).filter((i) => i !== null);
var Split = ({ children }) => <div className="split">{children}</div>;
var Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : void 0}>{children}</div>;
var Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, mentorCollapsible }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic;
  const padH = isMobile ? 12 : 60;
  const [mCollapsed, setMCollapsed] = useState3(false);
  const contentRef = useRef3(null);
  useEffect4(() => {
    setMCollapsed(false);
  }, [screen]);
  const setCollapsed = (v) => {
    setMCollapsed(v);
    if (v === false && contentRef.current) {
      const el = contentRef.current;
      requestAnimationFrame(() => {
        if (el) el.scrollTo({ top: 0, behavior: "auto" });
      });
    }
  };
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
            <div className="chrome-left eyebrow"><span className="dot" /><span>{tr2(eyebrow)}</span></div>
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
var RECAP_NEED_PCT = 60;
var RECAP_GOOD_PCT = 75;
var RECAP_MIN_ANSWERS = 3;
var RcFlow = ({ items, sep = "→" }) => <div className="rc-flow">{items.map((t, i) => <React3.Fragment key={i}><span className="rc-chip">{tr2(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React3.Fragment>)}</div>;
var RECAPS = {
  4: {
    title: { uz: "Yaxshi prompt nimasi bilan farq qiladi?", ru: "Чем отличается хороший промпт?" },
    cards: [
      { ic: "🎯", h: { uz: "Farqi — aniqlik", ru: "Разница — в точности" }, body: { uz: <>Yaxshi prompt AI'ga <b>aniq</b> aytadi: qanaqa sahifa (mavzu), qanday ko'rinishda (uslub), qaysi rangda va qaysi qismlar bilan. Aniq buyruq — aniq natija.</>, ru: <>Хороший промпт говорит AI <b>точно</b>: какая страница (тема), как она выглядит (стиль), какого цвета и с какими частями. Точная команда — точный результат.</> }, vis: <RcFlow items={[{ uz: "Mavzu", ru: "Тема" }, { uz: "Uslub", ru: "Стиль" }, { uz: "Rang", ru: "Цвет" }, { uz: "Qismlar", ru: "Части" }]} />, ask: { uz: "«Menga sayt yasab ber» desak — AI qaysi rangni, qaysi mavzuni tanlaydi?", ru: "Если сказать «сделай мне сайт» — какой цвет и какую тему выберет AI?" } },
      { ic: "📏", h: { uz: "Uzunlik emas, aniqlik", ru: "Не длина, а точность" }, body: { uz: <>Yaxshi prompt shunchaki <b>uzun</b> bo'lgani uchun ishlamaydi. Qisqa, lekin <b>4 ingredientli</b> aniq buyruq ham ajoyib natija beradi. Muhimi — tafsilot.</>, ru: <>Хороший промпт работает не потому, что он <b>длинный</b>. Короткая, но точная команда из <b>4 ингредиентов</b> тоже даёт отличный результат. Главное — детали.</> } },
      { ic: "🌐", h: { uz: "Til muhim emas", ru: "Язык не важен" }, body: { uz: <>Inglizcha yozish shart emas — <b>o'zbekcha</b> aniq prompt ham zo'r sahifa yasaydi. Gap tilida emas, aniqlikda: nima, uslub, rang, qismlar.</>, ru: <>Писать по-английски не обязательно — точный промпт <b>на родном языке</b> тоже делает классную страницу. Дело не в языке, а в точности: что, стиль, цвет, части.</> } }
    ]
  },
  7: {
    title: { uz: "Qaysi buyruq eng yaxshi?", ru: "Какая команда лучшая?" },
    cards: [
      { ic: "🏆", h: { uz: "Eng aniq buyruq g'olib", ru: "Побеждает самая точная команда" }, body: { uz: <>«Biror narsa qil», «Chiroyli qilib ber», «Sayt» — hammasi <b>noaniq</b>. Eng yaxshisi rang, uslub va qismlarni aytadi: <b>ko'k, zamonaviy, sarlavha, tugma, 3 karta</b>.</>, ru: <>«Сделай что-нибудь», «Сделай красиво», «Сайт» — всё это <b>размыто</b>. Лучшая команда называет цвет, стиль и части: <b>синий, современный, заголовок, кнопка, 3 карточки</b>.</> }, vis: <RcFlow items={[{ uz: "Rang", ru: "Цвет" }, { uz: "Uslub", ru: "Стиль" }, { uz: "Sarlavha", ru: "Заголовок" }, { uz: "3 karta", ru: "3 карточки" }]} />, ask: { uz: "«Chiroyli qilib ber» — chiroylini har kim boshqacha tasavvur qiladi. AI nimani chizadi?", ru: "«Сделай красиво» — красиво каждый представляет по-своему. Что нарисует AI?" } },
      { ic: "🍕", h: { uz: "Prompt = pitsa buyurtmasi", ru: "Промпт = заказ пиццы" }, body: { uz: <>«Ovqat olib kel» desangiz — nima kelishi noma'lum. «<b>Katta pepperoni pitsa, ko'p pishloq bilan</b>» desangiz — aynan xohlaganingizni olasiz. Prompt ham xuddi shunday ishlaydi.</>, ru: <>Скажете «принеси поесть» — неизвестно, что принесут. Скажете «<b>большую пепперони с двойным сыром</b>» — получите именно то, что хотели. Промпт работает так же.</> } },
      { ic: "🧩", h: { uz: "Qismlarni sanab ber", ru: "Перечислите части" }, body: { uz: <>Yaxshi buyruqda sahifaning <b>qismlari</b> aytiladi: sarlavha, tugma, 3 ta karta. AI shu qismlarni topib, joyiga terib beradi.</>, ru: <>В хорошей команде названы <b>части</b> страницы: заголовок, кнопка, 3 карточки. AI соберёт эти части и расставит по местам.</> }, vis: <RcFlow items={[{ uz: "Sarlavha", ru: "Заголовок" }, { uz: "Tugma", ru: "Кнопка" }, { uz: "3 karta", ru: "3 карточки" }]} /> }
    ]
  },
  9: {
    title: { uz: "AI birinchi urinishda mos qilmasa?", ru: "AI не попал с первого раза?" },
    cards: [
      { ic: "🔁", h: { uz: "Iteratsiya — qayta so'rash", ru: "Итерация — попросить ещё раз" }, body: { uz: <>Birinchi natija to'liq mos kelmasa, <b>tashlab ketmaysiz</b> — qayta, aniqroq so'raysiz: «tugmani kattaroq qil», «rangni ko'kroq qil». Har so'rovda natija yaxshilanadi.</>, ru: <>Если первый результат не совсем то — вы <b>не бросаете</b>, а просите снова, точнее: «сделай кнопку больше», «сделай цвет синее». С каждым запросом результат лучше.</> }, vis: <RcFlow items={[{ uz: "1-natija", ru: "1-й результат" }, { uz: "Aniqroq so'rov", ru: "Точнее запрос" }, { uz: "Yaxshiroq natija", ru: "Лучше результат" }]} />, ask: { uz: "AI sarlavhani juda kichkina qilib qo'ydi. Endi unga nima deb aytasiz?", ru: "AI сделал заголовок слишком маленьким. Что вы ему теперь скажете?" } },
      { ic: "🎨", h: { uz: "Rassomga aytgandek", ru: "Как художнику" }, body: { uz: <>Rassomga «bu yerini kattaroq chiz» desangiz — u qayta chizadi. AI bilan ham shunday: har <b>izohingiz</b> bilan sahifa asta-sekin mukammallashadi.</>, ru: <>Скажете художнику «нарисуй вот это крупнее» — он перерисует. С AI так же: с каждым вашим <b>уточнением</b> страница становится всё лучше.</> } },
      { ic: "💪", h: { uz: "Sifatni SIZ ta'minlaysiz", ru: "Качество обеспечиваете ВЫ" }, body: { uz: <>AI <b>tezlik</b> beradi, lekin <b>sifatni siz</b> nazorat qilasiz. Xafa bo'lib tashlab ketish yoki hammasini qo'lda yozish emas — aniq izoh berib, AI'ni to'g'rilaysiz.</>, ru: <>AI даёт <b>скорость</b>, но <b>качество контролируете вы</b>. Не обижаться и не переписывать всё руками — а дать точное уточнение и направить AI.</> }, vis: <RcFlow items={[{ uz: "AI = tezlik", ru: "AI = скорость" }, { uz: "Siz = sifat", ru: "Вы = качество" }]} /> }
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
        <span className="rc-tag">📖 {tr2({ uz: "Qayta tushuntirish", ru: "Повторное объяснение" })}</span>
        <span className="rc-title">{tr2(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr2(card.h)}</h2>
        <p className="rc-body">{tr2(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">🗣️ {tr2({ uz: "Sinfga savol:", ru: "Вопрос классу:" })} {tr2(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr2({ uz: "← Oldingi", ru: "← Предыдущая" })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={`${k + 1}-${tr2({ uz: "karta", ru: "карточка" })}`} />)}</div>
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
        <span className="mstats-lbl">📊 {tr2({ uz: "Jonli natija", ru: "Живой результат" })}</span>
        <span className="mstats-n">{allIn ? tr2({ uz: "✓ Hamma javob berdi", ru: "✓ Все ответили" }) : <>{tr2({ uz: "Javob berdi:", ru: "Ответили:" })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? "ready" : ""}`} onClick={onReveal}>🔓 {tr2({ uz: "Natijani ochish", ru: "Открыть результат" })}</button>}
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
      {!reveal && answered > 0 && <p className="mstats-hidden">{tr2({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: "🙈 Кто что выбрал и счёт ✅/❌ скрыты — при нажатии «Открыть результат» всё откроется сразу и у вас, и на экранах учеников." })}</p>}
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
              <p className="mstats-verdict-t">{tr2({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — класс не понял эту тему. Перед тем как продолжить, стоит коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr2({ uz: "Qayta tushuntirish", ru: "Повторное объяснение" })} — {tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === "maybe" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. Если хотите, коротко повторите перед тем, как идти дальше.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr2({ uz: "Qisqa takrorlash", ru: "Короткое повторение" })}</button>}
            </>}
            {level === "good" && <p className="mstats-verdict-t">{tr2({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === "few" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по проценту судить сложно. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr2({ uz: "Qayta tushuntirish", ru: "Повторное объяснение" })} — {tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">⏳ {tr2({ uz: "Kutilmoqda:", ru: "Ожидаем:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">{tr2({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: "⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуется объяснить ещё раз." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr2({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь вживую…" })}</p>}
    </div>;
}
var PRACTICE_DONE_BASE = 500;
function MentorPracticeOverlay({ entry, live, onClose }) {
  const [data, setData] = useState3({ players: null, rows: [] });
  const doneIdx = PRACTICE_DONE_BASE + entry.fromScreen;
  useEffect4(() => {
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, doneIdx)]);
        if (on) setData({ players, rows });
      } catch {
      }
      if (on) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [live.pin, doneIdx]);
  const total = data.players ? data.players.length : 0;
  const doneN = data.rows.length;
  const allIn = total > 0 && doneN >= total;
  const doneIds = new Set(data.rows.map((r) => r.player_id));
  return <div className="mp-overlay">
      <div className="mp-card">
        <div className="mp-eyebrow">✍️ {tr2({ uz: "Amaliyot · jonli", ru: "Практика · вживую" })}</div>
        <h2 className="mp-title">{tr2(entry.title)}</h2>
        <p className="mp-brief">{tr2(entry.brief)}</p>
        <div className="mp-flow">
          <span className="mp-step cur">{tr2({ uz: "1 · O'quvchilar o'z qurilmasida prompt yig'ib, sahifa qurmoqda", ru: "1 · Ученики собирают промпт и строят страницу на своих устройствах" })}</span>
          <span className="mp-arr">→</span>
          <span className="mp-step">{tr2({ uz: "2 · Mentor doskada namuna qurib ko'rsatadi", ru: "2 · Ментор строит образец на доске" })}</span>
        </div>
        {data.players === null ? <p className="mstats-wait">{tr2({ uz: "Ulanish…", ru: "Подключение…" })}</p> : <div className="mstats" style={{ marginTop: 2 }}>
            <div className="mstats-head">
              <span className="mstats-lbl">👨‍🎓 {tr2({ uz: "Praktikani tugatdi", ru: "Завершили практику" })}</span>
              <span className="mstats-n">{allIn ? tr2({ uz: "✓ Hamma tugatdi!", ru: "✓ Все закончили!" }) : <>{tr2({ uz: "Tugatdi:", ru: "Закончили:" })} <b>{doneN}</b> / {total}</>}</span>
            </div>
            <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? "full" : ""}`} style={{ width: `${total ? Math.round(doneN / total * 100) : 0}%` }} /></div>
            {total > 0 && <div className="mstats-waitrow" style={{ marginTop: 10 }}>
                {data.players.map((p) => <span key={p.id} className="mstats-wait-chip" style={doneIds.has(p.id) ? { background: T.successSoft, color: T.success, fontWeight: 700 } : void 0}>{doneIds.has(p.id) ? "✓ " : "✏️ "}{p.nickname}</span>)}
              </div>}
            {total === 0 && <p className="mstats-wait">{tr2({ uz: "Hali o'quvchi qo'shilmagan — ular praktikani boshlashi bilan bu yerda ✓ chiqadi…", ru: "Пока никто не подключился — как только ученики начнут практику, здесь появятся ✓…" })}</p>}
          </div>}
        <div className="mp-actions">
          <button className="mp-next" onClick={onClose} style={{ marginLeft: "auto" }}>{tr2({ uz: "Keyingi mavzuga →", ru: "К следующей теме →" })}</button>
        </div>
        <p className="mp-tip">{tr2({ uz: "💡 Ko'pchilik tugatgach, aynan shu mashqni doskada birga qurib ko'rsating — shunda o'quvchilar o'zini tekshiradi va mavzu mustahkamlanadi.", ru: "💡 Когда большинство закончит, соберите это же упражнение вместе на доске — так ученики проверят себя, и тема закрепится." })}</p>
      </div>
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
  return <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : void 0} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? mReveal ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Avval natijani oching", ru: "Сначала откройте результат" } : solved ? { uz: "Davom etish", ru: "Продолжить" } : oneShot ? { uz: "Javob tanlang", ru: "Выберите ответ" } : { uz: "To'g'ri javobni toping", ru: "Найдите правильный ответ" }} onClick={onNext} /></>}>
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
            {isMentorLive ? fmtCode(`✓ ${tr2({ uz: "To'g'ri javob:", ru: "Правильный ответ:" })} ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`) : waiting ? tr2({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? fmtCode(`${tr2({ uz: "To'g'ri javob:", ru: "Правильный ответ:" })} ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`) : solved ? tr2({ uz: "To'g'ri", ru: "Верно" }) : tr2({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {fmtCode(isMentorLive ? explainCorrect : waiting ? tr2({ uz: "Javobingiz qabul qilindi. Mentor «Natijani ochish»ni bosganda to'g'ri javob hammada birdan ko'rinadi.", ru: "Ваш ответ принят. Когда ментор нажмёт «Открыть результат», правильный ответ появится у всех сразу." }) : wrongLocked ? explainWrong[picked] ?? explainWrong.default : solved ? explainCorrect : explainWrong[picked] ?? explainWrong.default)}
          </p>
          {
    /* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
       Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */
  }
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>📖 {tr2({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — взглянуть на тему ещё раз" })}</button>}
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
var Browser = ({ url = "mening-saytim.uz", children, dark = false }) => <div className={`browser ${dark ? "browser-dark" : ""}`}>
    <div className="browser-bar">
      <span className="browser-dot" style={{ background: "#FF5F56" }} />
      <span className="browser-dot" style={{ background: "#FFBD2E" }} />
      <span className="browser-dot" style={{ background: "#27C93F" }} />
      <span className="browser-url">{url}</span>
    </div>
    <div className="browser-body">{children}</div>
  </div>;
var PROMO = {
  oyin: { tag: { uz: "O'yin", ru: "Игра" }, title: "PIXEL QUEST", sub: { uz: "Yangi sarguzasht o'yini — hoziroq sinab ko'ring", ru: "Новая приключенческая игра — попробуйте прямо сейчас" }, cta: { uz: "O'ynash", ru: "Играть" }, cards: [{ uz: "3D olam", ru: "3D-мир" }, { uz: "Reytinglar", ru: "Рейтинги" }, { uz: "100 daraja", ru: "100 уровней" }] },
  klub: { tag: { uz: "Klub", ru: "Клуб" }, title: { uz: "SHAXMAT KLUBI", ru: "ШАХМАТНЫЙ КЛУБ" }, sub: { uz: "Har shanba — bepul mashg'ulot va turnirlar", ru: "Каждую субботу — бесплатные занятия и турниры" }, cta: { uz: "Ro'yxatdan o'tish", ru: "Записаться" }, cards: [{ uz: "Murabbiy", ru: "Тренер" }, { uz: "Turnirlar", ru: "Турниры" }, { uz: "Yangi do'stlar", ru: "Новые друзья" }] },
  tadbir: { tag: { uz: "Tadbir", ru: "Событие" }, title: { uz: "TEXNO FEST", ru: "ТЕХНО ФЕСТ" }, sub: { uz: "Yilning eng katta IT festivali", ru: "Самый большой IT-фестиваль года" }, cta: { uz: "Bilet olish", ru: "Купить билет" }, cards: [{ uz: "Spikerlar", ru: "Спикеры" }, { uz: "Master-klass", ru: "Мастер-класс" }, { uz: "Sovg'alar", ru: "Подарки" }] },
  ilova: { tag: { uz: "Ilova", ru: "Приложение" }, title: "FOCUSLY", sub: { uz: "Vaqtingizni aqlli boshqaring", ru: "Управляйте временем с умом" }, cta: { uz: "Yuklab olish", ru: "Скачать" }, cards: [{ uz: "Taymer", ru: "Таймер" }, { uz: "Statistika", ru: "Статистика" }, { uz: "Eslatma", ru: "Напоминания" }] }
};
var STYLE_LABEL = { zamonaviy: { uz: "zamonaviy", ru: "современный" }, oynoqi: { uz: "o'ynoqi", ru: "игривый" }, minimal: { uz: "minimal", ru: "минималистичный" } };
var COLOR_HEX = { kok: "#2563EB", yashil: "#1F9D55", sariq: "#F59E0B", siyohrang: "#7C3AED" };
var COLOR_LABEL = { kok: { uz: "ko'k", ru: "синий" }, yashil: { uz: "yashil", ru: "зелёный" }, sariq: { uz: "to'q sariq", ru: "оранжевый" }, siyohrang: { uz: "siyohrang", ru: "фиолетовый" } };
var TOPICS = [["oyin", { uz: "O'yin", ru: "Игра" }], ["klub", { uz: "Klub", ru: "Клуб" }], ["tadbir", { uz: "Tadbir", ru: "Событие" }], ["ilova", { uz: "Ilova", ru: "Приложение" }]];
var STYLES = [["zamonaviy", { uz: "Zamonaviy", ru: "Современный" }], ["oynoqi", { uz: "O'ynoqi", ru: "Игривый" }], ["minimal", { uz: "Minimal", ru: "Минимал" }]];
var COLORS_LIST = [["kok", { uz: "Ko'k", ru: "Синий" }], ["yashil", { uz: "Yashil", ru: "Зелёный" }], ["sariq", { uz: "To'q sariq", ru: "Оранжевый" }], ["siyohrang", { uz: "Siyohrang", ru: "Фиолетовый" }]];
var SECTIONS = [["button", { uz: "Tugma", ru: "Кнопка" }], ["cards", { uz: "Kartalar", ru: "Карточки" }], ["banner", { uz: "Banner", ru: "Баннер" }]];
var TOPIC_PROMPT = { oyin: { uz: "«Pixel Quest» video-o'yini", ru: "видеоигры «Pixel Quest»" }, klub: { uz: "shaxmat klubi", ru: "шахматного клуба" }, tadbir: { uz: "«Texno Fest» festivali", ru: "фестиваля «Техно Фест»" }, ilova: { uz: "«Focusly» ilovasi", ru: "приложения «Focusly»" } };
var SECTION_PROMPT = { button: { uz: "harakat tugmasi", ru: "кнопка действия" }, cards: { uz: "3 ta xususiyat kartasi", ru: "3 карточки преимуществ" }, banner: { uz: "maxsus taklif banneri", ru: "баннер спецпредложения" } };
var sectionPromptWords = (s = {}) => Object.keys(SECTION_PROMPT).filter((k) => s[k]).map((k) => tr2(SECTION_PROMPT[k]));
var Slot = ({ val, ph }) => val ? <span className="pb-slot" key={val}>{val}</span> : <span className="pb-ph">{ph}</span>;
var PromptLine = ({ topic, style, color, sections }) => {
  const secs = sectionPromptWords(sections);
  return <div className="promptbox">
      {tr2({
    uz: <>Menga <Slot val={topic ? tr2(TOPIC_PROMPT[topic]) : null} ph="mavzu" /> uchun bir sahifali promo-landing yasab ber.{" "}
          Uslubi <Slot val={style ? tr2(STYLE_LABEL[style]) : null} ph="uslub" />, asosiy rang <Slot val={color ? tr2(COLOR_LABEL[color]) : null} ph="rang" />.{" "}
          Sahifada <Slot val={secs.length ? secs.join(", ") : null} ph="qismlar" /> bo'lsin.</>,
    ru: <>Сделай мне одностраничный промо-лендинг для <Slot val={topic ? tr2(TOPIC_PROMPT[topic]) : null} ph="тема" />.{" "}
          Стиль — <Slot val={style ? tr2(STYLE_LABEL[style]) : null} ph="стиль" />, основной цвет — <Slot val={color ? tr2(COLOR_LABEL[color]) : null} ph="цвет" />.{" "}
          На странице — <Slot val={secs.length ? secs.join(", ") : null} ph="части" />.</>
  })}
    </div>;
};
var USTABOT_FACE = "🤖";
var UstaBubble = ({ children, tone = "note", small = false }) => <div className={`usta-bubble usta-${tone}${small ? " usta-sm" : ""}`}>
    <span className="usta-face" aria-hidden>{USTABOT_FACE}</span>
    <span className="usta-say">{children}</span>
  </div>;
var AcceptanceReport = ({ checks, onRedo, redoLabel, done }) => {
  const allOk = checks.every((c) => c.ok);
  const face = done && allOk ? "🤩" : allOk ? "🙂" : "😕";
  return <div className={`accept-akt${done && allOk ? " akt-happy" : ""} fade-step`}>
      <div className="akt-head">
        <span className="akt-title">📋 {tr2({ uz: "Qabul akti", ru: "Акт приёмки" })}</span>
        <span className="akt-client" title={tr2({ uz: "Mijoz kayfiyati", ru: "Настроение клиента" })}>{face}</span>
      </div>
      <ul className="akt-list">
        {checks.map((c, i) => <li key={i} className={c.ok ? "akt-ok" : "akt-bad"}><span className="akt-mark">{c.ok ? "✓" : "✗"}</span>{tr2(c.label)}</li>)}
      </ul>
      {!allOk && onRedo && <button className="btn akt-redo" onClick={onRedo}>↻ {tr2({ uz: "Dubl 2", ru: "Дубль 2" })} — {tr2(redoLabel)}</button>}
    </div>;
};
var LandingPreview = ({ topic, style: styleIn, color: colorIn, sections = {}, noaniq = false, draft = false }) => {
  if (draft) {
    const hasTopic = !!topic, hasStyle = !!styleIn, hasColor = !!colorIn;
    const anySec = !!(sections.button || sections.cards || sections.banner);
    const p2 = hasTopic ? PROMO[topic] : null;
    const c2 = hasColor ? COLOR_HEX[colorIn] || T.accent : null;
    const minimal2 = styleIn === "minimal";
    const radius2 = styleIn === "oynoqi" ? 18 : minimal2 ? 6 : 12;
    const heroBg = hasColor ? minimal2 ? "#FFFFFF" : `linear-gradient(135deg, ${c2}, ${c2}cc)` : "repeating-linear-gradient(45deg, #ff1493 0 14px, #c6ff00 14px 28px)";
    const heroColor = hasColor ? minimal2 ? T.ink : "#fff" : "#12121a";
    const heroBorder = hasStyle ? minimal2 && hasColor ? `2px solid ${c2}` : "none" : "2.5px dashed #12121a";
    const heroTilt = hasStyle ? "none" : "rotate(-2.2deg)";
    const missing = [];
    if (!hasTopic) missing.push(tr2({ uz: "mavzu", ru: "тему" }));
    if (!hasStyle) missing.push(tr2({ uz: "uslub", ru: "стиль" }));
    const missUz = missing.join(" va ");
    const notes = missing.length ? [tr2({ uz: `${missUz.charAt(0).toUpperCase()}${missUz.slice(1)}ni aytmadingiz — o'zim to'ldirdim`, ru: `Вы не назвали ${missing.join(" и ")} — заполнил сам` })] : [];
    return <div className="lp-draft lp-live" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: heroBg, color: heroColor, borderRadius: hasStyle ? radius2 : 5, padding: "clamp(16px,3vw,22px)", border: heroBorder, textAlign: "center", transform: heroTilt, position: "relative" }}>
          {!hasColor && <span className="lp-draft-badge">{tr2({ uz: "Rangni o'zim tanladim! 🎨", ru: "Цвет выбрал сам! 🎨" })}</span>}
          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>{hasTopic ? tr2(p2.tag) : tr2({ uz: "Sayt", ru: "Сайт" })}</span>
          <h3 style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 700, fontSize: "clamp(20px,4vw,30px)", margin: "5px 0 6px", lineHeight: 1.08, transform: hasStyle ? "none" : "rotate(1.4deg)" }}>{hasTopic ? tr2(p2.title) : tr2({ uz: "SAYT", ru: "САЙТ" })}</h3>
          <p style={{ fontSize: 13, margin: 0, opacity: 0.92, fontStyle: hasTopic ? "normal" : "italic" }}>{hasTopic ? tr2(p2.sub) : tr2({ uz: "Bla-bla lorem — bu yerda matn bo'lishi kerak edi…", ru: "Бла-бла лорем — тут должен был быть текст…" })}</p>
          {sections.button && <button style={{ marginTop: 13, border: "none", borderRadius: Math.max((hasStyle ? radius2 : 5) - 4, 6), padding: "9px 18px", fontFamily: "'Manrope'", fontWeight: 700, fontSize: 13, cursor: "pointer", background: hasColor ? "#fff" : "#12121a", color: hasColor ? c2 : "#c6ff00", transform: hasStyle ? "none" : "rotate(-1.6deg)" }}>{hasTopic ? tr2(p2.cta) : tr2({ uz: "Tugma", ru: "Кнопка" })}</button>}
        </div>
        {sections.cards && p2 && <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {p2.cards.map((cd, i) => <div key={i} style={{ background: T.paper, borderRadius: 8, padding: "11px 6px", textAlign: "center", boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.16)`, transform: hasStyle ? "none" : `rotate(${i % 2 ? 2.2 : -2.2}deg)` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c2 || "#ff1493", margin: "0 auto 6px" }} />
                <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink }}>{tr2(cd)}</div>
              </div>)}
          </div>}
        {sections.banner && <div style={{ background: hasColor ? `${c2}1f` : "rgba(255,20,147,0.14)", color: hasColor ? c2 : "#ff1493", borderRadius: 8, padding: "9px 12px", fontSize: 12.5, fontWeight: 700, textAlign: "center", transform: hasStyle ? "none" : "rotate(-1deg)" }}>{tr2({ uz: "★ Maxsus taklif — faqat shu hafta!", ru: "★ Спецпредложение — только на этой неделе!" })}</div>}
        {!anySec && <div className="lp-draft-empty"><span className="lp-draft-q">?</span><span className="lp-draft-emptxt">{tr2({ uz: "Qism yo'q — bo'sh romka qoldi", ru: "Частей нет — осталась пустая рамка" })}</span></div>}
        {notes.length > 0 && <div className="lp-draft-notes">{notes.map((n, i) => <UstaBubble key={i} small>{n}</UstaBubble>)}</div>}
      </div>;
  }
  const style = styleIn || "zamonaviy";
  const color = colorIn || "kok";
  if (noaniq || !topic) {
    return <div style={{ textAlign: "center", padding: "26px 16px" }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "#E6E1D8", margin: "0 auto 10px" }} />
        <p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 17, margin: "0 0 4px", color: T.ink2 }}>{tr2({ uz: "Sayt", ru: "Сайт" })}</p>
        <p style={{ fontSize: 12.5, margin: 0, color: T.ink3, fontStyle: "italic" }}>{tr2({ uz: "Bu yerda biror narsa bo'lishi kerak edi…", ru: "Здесь должно было что-то быть…" })}</p>
      </div>;
  }
  const p = PROMO[topic];
  const c = COLOR_HEX[color] || T.accent;
  const radius = style === "oynoqi" ? 18 : style === "minimal" ? 6 : 12;
  const minimal = style === "minimal";
  return <div className="lp-live" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: minimal ? "#FFFFFF" : `linear-gradient(135deg, ${c}, ${c}cc)`, color: minimal ? T.ink : "#fff", borderRadius: radius, padding: "clamp(16px,3vw,22px)", border: minimal ? `2px solid ${c}` : "none", textAlign: minimal ? "left" : "center" }}>
        <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: minimal ? c : "rgba(255,255,255,0.9)" }}>{tr2(p.tag)}</span>
        <h3 style={{ fontFamily: "'Source Serif 4',serif", fontWeight: style === "oynoqi" ? 700 : 600, fontSize: "clamp(20px,4vw,30px)", margin: "5px 0 6px", lineHeight: 1.08 }}>{tr2(p.title)}</h3>
        <p style={{ fontSize: 13, margin: 0, opacity: minimal ? 0.75 : 0.95 }}>{tr2(p.sub)}</p>
        {sections.button && <button style={{ marginTop: 13, border: "none", borderRadius: Math.max(radius - 4, 6), padding: "9px 18px", fontFamily: "'Manrope'", fontWeight: 700, fontSize: 13, cursor: "pointer", background: minimal ? c : "#fff", color: minimal ? "#fff" : c }}>{tr2(p.cta)}</button>}
      </div>
      {sections.cards && <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {p.cards.map((cd, i) => <div key={i} style={{ background: T.paper, borderRadius: Math.max(radius - 4, 6), padding: "11px 6px", textAlign: "center", boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.16)` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, margin: "0 auto 6px" }} />
              <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink }}>{tr2(cd)}</div>
            </div>)}
        </div>}
      {sections.banner && <div style={{ background: `${c}1f`, color: c, borderRadius: Math.max(radius - 4, 6), padding: "9px 12px", fontSize: 12.5, fontWeight: 700, textAlign: "center" }}>{tr2({ uz: "★ Maxsus taklif — faqat shu hafta!", ru: "★ Спецпредложение — только на этой неделе!" })}</div>}
    </div>;
};
function useScrollIntoViewOnMobile(trigger) {
  const ref = useRef3(null);
  const first = useRef3(true);
  useEffect4(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!trigger) return;
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => {
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 160);
    return () => clearTimeout(t);
  }, [trigger]);
  return ref;
}
function useScrollIntoView(trigger) {
  const ref = useRef3(null);
  const first = useRef3(true);
  useEffect4(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!trigger) return;
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => {
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 180);
    return () => clearTimeout(t);
  }, [trigger]);
  return ref;
}
var BuildingPreview = () => <div className="build-skel">
    <div className="bs-bar bs-lg" />
    <div className="bs-bar" style={{ width: "72%" }} />
    <div className="bs-bar" style={{ width: "92%" }} />
    <div className="bs-bar" style={{ width: "60%" }} />
    <p className="build-note">{tr2({ uz: "Agent quryapti…", ru: "Агент строит…" })}</p>
  </div>;
var PromoBuilder = ({ topic, setTopic, style, setStyle, color, setColor, sec, setSec, footer }) => {
  const tog = (k) => setSec((s) => ({ ...s, [k]: !s[k] }));
  const previewRef = useRef3(null);
  const scrollToPreview = () => {
    const el = previewRef.current;
    if (!el) return;
    const t = setTimeout(() => {
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 160);
    return () => clearTimeout(t);
  };
  const firstM = useRef3(true);
  useEffect4(() => {
    if (firstM.current) {
      firstM.current = false;
      return;
    }
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    return scrollToPreview();
  }, [`${color}|${sec.button ? 1 : 0}${sec.cards ? 1 : 0}${sec.banner ? 1 : 0}`]);
  const firstD = useRef3(true);
  useEffect4(() => {
    if (firstD.current) {
      firstD.current = false;
      return;
    }
    if (!color) return;
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    return scrollToPreview();
  }, [color]);
  return <Zoomable>
    <div className="split">
      <Col>
        {
    /* PROMPT — yuqorida: tugmalarni bosgan sari shu yerda yig'iladi */
  }
        <p className="flow-label">{tr2({ uz: "Sizning buyrug'ingiz", ru: "Ваша команда" })}</p>
        <PromptLine topic={topic} style={style} color={color} sections={sec} />
        {
    /* F-0803-26 (109-qonun): 4 guruh — yorliq va tugmalar BIR qatorda. Ilgari har guruh
       ikki qator egallardi (sarlavha + tugmalar) va ustiga takroriy «pastdagi 4 guruhdan
       tanlang…» qatori bor edi — natijada 3- va 4-guruh 720px ekrandan pastga tushib,
       majburiy darvoza ko'rinmay qolardi (F-0803-19 bug-sinfi). */
  }
        <div className="pb-group"><span className="pb-glabel">{tr2({ uz: "1 · Mavzu", ru: "1 · Тема" })}</span>
          <div className="chiprow">{TOPICS.map(([v, l]) => <button key={v} className={`chip ${topic === v ? "chip-on" : ""}`} onClick={() => setTopic(v)}>{tr2(l)}</button>)}</div></div>
        <div className="pb-group"><span className="pb-glabel">{tr2({ uz: "2 · Uslub", ru: "2 · Стиль" })}</span>
          <div className="chiprow">{STYLES.map(([v, l]) => <button key={v} className={`chip ${style === v ? "chip-on" : ""}`} onClick={() => setStyle(v)}>{tr2(l)}</button>)}</div></div>
        <div className="pb-group"><span className="pb-glabel">{tr2({ uz: "3 · Rang", ru: "3 · Цвет" })}</span>
          <div className="chiprow">{COLORS_LIST.map(([v, l]) => <button key={v} className={`chip ${color === v ? "chip-on" : ""}`} onClick={() => setColor(v)}><span style={{ width: 11, height: 11, borderRadius: "50%", background: COLOR_HEX[v], display: "inline-block" }} />{tr2(l)}</button>)}</div></div>
        <div className="pb-group"><span className="pb-glabel">{tr2({ uz: "4 · Qismlar", ru: "4 · Части" })}</span>
          <div className="chiprow">{SECTIONS.map(([k, l]) => <button key={k} className={`chip ${sec[k] ? "chip-on" : ""}`} onClick={() => tog(k)}>{sec[k] ? "✓ " : "+ "}{tr2(l)}</button>)}</div></div>
        {footer}
      </Col>
      <Col>
        <p className="flow-label">{tr2({ uz: "Natija — jonli yangilanadi", ru: "Результат — обновляется вживую" })}</p>
        <div ref={previewRef}><Browser url="mening-promo.uz"><LandingPreview draft topic={topic} style={style} color={color} sections={sec} /></Browser></div>
      </Col>
    </div>
    </Zoomable>;
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
        <button type="button" className="zoom-btn" onClick={() => setBig((b) => !b)} aria-label={big ? tr2({ uz: "Kichraytirish", ru: "Свернуть" }) : tr2({ uz: "Kattalashtirish", ru: "Развернуть" })} title={big ? tr2({ uz: "Kichraytirish", ru: "Свернуть" }) : tr2({ uz: "Kattalashtirish", ru: "Развернуть" })}>{big ? "✕" : "⛶"}</button>
        {children}
      </div>
    </>;
};
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  useAudio([{ id: "s0", text: "AI'ga shunchaki «sayt yasab ber» desangiz — nima chiqadi? Noaniq buyruqni yuboring va o'ngdagi natijaga qarang: kutganingizday chiqmaydi, chunki AI miyangizni o'qiy olmaydi.", trigger: "on_mount", waits_for: null }]);
  const [phase, setPhase] = useState3(storedAnswer ? "built" : "idle");
  const [picked, setPicked] = useState3(storedAnswer?.picked ?? null);
  const timer = useRef3(null);
  useEffect4(() => () => clearTimeout(timer.current), []);
  const OPTS = [
    { id: "a", label: tr2({ uz: "AI nima xohlayotganimni bilmadi — juda kam tushuntirdim", ru: "AI не понял, чего я хочу — я слишком мало объяснил" }) },
    { id: "b", label: tr2({ uz: "AI buzilgan, shuning uchun bo'sh chiqdi", ru: "AI сломался, поэтому вышло пусто" }) },
    { id: "c", label: tr2({ uz: "Internet sekin bo'lgani uchun", ru: "Из-за медленного интернета" }) }
  ];
  const send = () => {
    clearTimeout(timer.current);
    setPhase("building");
    timer.current = setTimeout(() => setPhase("built"), 1100);
  };
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: v, correct: true });
  };
  const built = phase === "built";
  return <Stage eyebrow={{ uz: "Kirish", ru: "Введение" }} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: "Davom etish", ru: "Продолжить" }} onClick={onNext} />}>
      <div className="screen">
        {
    /* maxWidth 820 → 1000: sarlavha ikki qatordan bittaga tushadi va quyidagi savol-variantlar
       ko'rish zonasiga sig'adi (F-0803-26) */
  }
        <h1 className="title h-title fade-up">{tr2({ uz: <>AI'ga shunchaki <span className="italic" style={{ color: T.accent }}>«sayt yasab ber»</span> desangiz — nima chiqadi?</>, ru: <>Что получится, если сказать AI просто <span className="italic" style={{ color: T.accent }}>«сделай сайт»</span>?</> })}</h1>
        <Mentor>{tr2({ uz: "Quyidagi qisqa buyruqni agentga yuboring va natijaga qarang — kutganingizday chiqdimi?", ru: "Отправьте агенту короткую команду ниже и посмотрите на результат — вышло, как вы ждали?" })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label">{tr2({ uz: "Sizning buyrug'ingiz", ru: "Ваша команда" })}</p>
            <div className="promptbox">{tr2({ uz: <>Menga <span className="pb-slot">sayt</span> yasab ber.</>, ru: <>Сделай мне <span className="pb-slot">сайт</span>.</> })}</div>
            <button className="btn" onClick={send} disabled={phase === "building"} style={{ alignSelf: "flex-start" }}>{phase === "building" ? tr2({ uz: "Quryapti…", ru: "Строит…" }) : built ? tr2({ uz: "↻ Qayta yuborish", ru: "↻ Отправить заново" }) : tr2({ uz: "Agentga yuborish", ru: "Отправить агенту" })}</button>
            {
    /* F-0803-26: savol va variantlar O'NG ustunda, natija-oynasining OSTIDA turardi —
       720px ekranda ular 394px pastga tushib ketardi. O'quvchi «yuborish»ni bosgach
       faqat rasmni ko'rardi, «Davom etish» esa ochilmasdi (F-0803-19 bug-sinfi,
       foydalanuvchi 11-sahifada aynan shuni aytgan edi). Endi savol chap ustunda —
       bo'sh joyda, buyruq ostida; natija esa o'ngda, yonma-yon turadi. */
  }
            {built && <div className="fade-step">
                <p className="eyebrow" style={{ color: T.ink2, margin: "0 0 9px" }}>{tr2({ uz: "Nega natija bunchalik bo'sh?", ru: "Почему результат такой пустой?" })}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {OPTS.map((o) => {
    const on = picked === o.id;
    return <button key={o.id} className={`hook-option ${on ? "on" : ""}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                      <span className="radio">{on && <span className="radio-dot" />}</span><span>{o.label}</span>
                    </button>;
  })}
                </div>
                {picked !== null && <p className="hook-ack fade-step">{tr2({ uz: <>To'g'ri! AI tez, lekin o'ylaganingizni o'qiy olmaydi. <b>Aniq aytsangiz — aniq natija.</b></>, ru: <>Верно! AI быстрый, но мысли ваши читать не умеет. <b>Скажете точно — получите точный результат.</b></> })}</p>}
              </div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Natija", ru: "Результат" })}</p>
            <Browser url="ai-natija.uz">
              {phase === "idle" && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: "center", padding: "24px 0" }}>{tr2({ uz: "(hali yuborilmadi)", ru: "(ещё не отправлено)" })}</p>}
              {phase === "building" && <BuildingPreview />}
              {built && <div className="result-reveal"><LandingPreview draft /></div>}
            </Browser>
            {built && <UstaBubble tone="warn">So'zma-so'z bajardim — lekin kam aytdingiz!</UstaBubble>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen1 = ({ screen, onNext, onPrev }) => {
  useAudio([{ id: "s1", text: "Bugun AI bilan tez va sifatli sayt qurishni o'rganamiz: yaxshi prompt, iteratsiya va natijani tekshirish. Rejamiz bilan tanishing.", trigger: "on_mount", waits_for: null }]);
  const STEPS = [
    // F-0803-26: bu qadamda «wow» yorlig'i turardi — bu bizning ichki ish-nomimiz, o'quvchi
    // uni hech qayerda ko'rmagan va u hech nima anglatmaydi (59-bo'lim).
    { text: tr2({ uz: "AI bilan tezlik — soatlar emas, soniyalar", ru: "Скорость с AI — секунды, а не часы" }), tag: "" },
    { text: tr2({ uz: "Yaxshi PROMPT — 4 ingredient", ru: "Хороший ПРОМПТ — 4 ингредиента" }), tag: "" },
    { text: tr2({ uz: "Yomon vs yaxshi prompt", ru: "Плохой vs хороший промпт" }), tag: "" },
    { text: tr2({ uz: "Iteratsiya — qayta so'rab yaxshilash", ru: "Итерация — улучшать повторным запросом" }), tag: "" },
    { text: tr2({ uz: "Tekshirish — AI xatosini topish", ru: "Проверка — найти ошибку AI" }), tag: "" },
    { text: tr2({ uz: "O'z promo sahifangizni qurish", ru: "Построить свою промо-страницу" }), tag: "" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState3(false);
  const PreviewBlock = <Col>
      <div className="speed-quote sq-solo">
        <p className="sq-eyebrow">{tr2({ uz: "Bugungi asosiy qoida", ru: "Главное правило сегодня" })}</p>
        <p className="sq-text">{tr2({ uz: <>AI <span className="sq-fast">tezlik</span> beradi — <span className="sq-quality">sifatni</span> siz ta'minlaysiz.</>, ru: <>AI даёт <span className="sq-fast">скорость</span> — <span className="sq-quality">качество</span> обеспечиваете вы.</> })}</p>
      </div>
    </Col>;
  const StepsBlock = <Col>
      <p className="flow-label">{tr2({ uz: "Bugungi 6 qadam", ru: "Сегодня 6 шагов" })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => <li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, "0")}</span><span className="step-body"><span className="step-text">{s.text}</span>{s.tag && <span className="step-tag">{s.tag}</span>}</span></li>)}
      </ol>
    </Col>;
  return <Stage eyebrow={{ uz: "Reja", ru: "План" }} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: "Boshlaymiz →", ru: "Начинаем →" }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>AI hammasini yasaydi — unda nega <span className="italic" style={{ color: T.accent }}>biz</span> kerakmiz?</>, ru: <>AI делает всё сам — зачем тогда <span className="italic" style={{ color: T.accent }}>мы</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>AI soniyada sahifa yasaydi — lekin faqat sizning <b style={{ color: T.ink }}>so'zingiz</b> bo'yicha. Bugun <b style={{ color: T.ink }}>yaxshi prompt (buyruq)</b> yozishni o'rganamiz.</>, ru: <>AI делает страницу за секунду — но только по вашим <b style={{ color: T.ink }}>словам</b>. Сегодня учимся писать <b style={{ color: T.ink }}>хороший промпт (команду)</b>.</> })}</Mentor>
        {!isNarrow ? <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable> : !showSteps ? <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>{PreviewBlock}<button className="btn" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(true)}>{tr2({ uz: "6 qadamni ko'rish", ru: "Посмотреть 6 шагов" })}</button></div> : <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}><button className="btn-soft" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(false)}>{tr2({ uz: "↩ Qoidani ko'rish", ru: "↩ Посмотреть правило" })}</button>{StepsBlock}</div>}
      </div>
    </Stage>;
};
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: "s2", text: "Endi aniq buyruq beramiz — to'rt ingredient bilan. Yuboring va kuzating: AI butun bir sahifani bir necha soniyada yasaydi.", trigger: "on_mount", waits_for: null }]);
  const [phase, setPhase] = useState3(storedAnswer ? "built" : "idle");
  const timer = useRef3(null);
  const built = phase === "built";
  const done = built;
  useEffect4(() => () => clearTimeout(timer.current), []);
  const send = () => {
    clearTimeout(timer.current);
    setPhase("building");
    timer.current = setTimeout(() => setPhase("built"), 1300);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={{ uz: "Tezlik", ru: "Скорость" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Avval yuboring", ru: "Сначала отправьте" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Aniq buyruq bersak, AI <span className="italic" style={{ color: T.accent }}>qanchalik tez</span> quradi?</>, ru: <>Если дать точную команду — <span className="italic" style={{ color: T.accent }}>насколько быстро</span> построит AI?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Endi <b style={{ color: T.ink }}>aniq</b> buyruq — 4 ingredient bilan. Yuboring va tezlikni ko'ring.</>, ru: <>Теперь <b style={{ color: T.ink }}>точная</b> команда — с 4 ингредиентами. Отправьте и посмотрите на скорость.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Tayyor yaxshi buyruq", ru: "Готовая хорошая команда" })}</p>
            {
    /* F-0803-26 (108-qonun, bitta misol-ip): bu ekran «Texno Fest» festivalini
       qurardi, keyingilari esa shaxmat klubi va Focusly ilovasini — o'quvchi har
       uch-to'rt ekranda yangi olamga tushardi. Butun dars endi BITTA ipda:
       «Pixel Quest» o'yini (3- va 11-ekranda allaqachon shu edi). */
  }
            <PromptLine topic="oyin" style="oynoqi" color="siyohrang" sections={{ button: true, cards: true, banner: true }} />
            <button className="btn" onClick={send} disabled={phase === "building"} style={{ alignSelf: "flex-start" }}>{phase === "building" ? tr2({ uz: "Quryapti…", ru: "Строит…" }) : built ? tr2({ uz: "↻ Qayta yuborish", ru: "↻ Отправить заново" }) : tr2({ uz: "Agentga yuborish", ru: "Отправить агенту" })}</button>
            {built && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Butun sahifa — atigi bitta buyruqdan. AI bergan <b>tezlik</b> shu.</>, ru: <>Целая страница — из одной команды. Вот она — <b>скорость</b>, которую даёт AI.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Natija", ru: "Результат" })}</p>
            <Browser url="pixel-quest.uz">
              {phase === "idle" && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: "center", padding: "24px 0" }}>{tr2({ uz: "(buyruqni yuboring)", ru: "(отправьте команду)" })}</p>}
              {phase === "building" && <BuildingPreview />}
              {built && <div className="result-reveal"><LandingPreview topic="oyin" style="oynoqi" color="siyohrang" sections={{ button: true, cards: true, banner: true }} /></div>}
            </Browser>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: "s3", text: "Yaxshi buyruq to'rt ingredientdan iborat: mavzu, uslub, rang va qismlar. Buyruqdagi rangli qismlarni bosib, har birini bilib oling.", trigger: "on_mount", waits_for: null }]);
  const [part, setPart] = useState3(null);
  const [seen, setSeen] = useState3(/* @__PURE__ */ new Set());
  const done = seen.size >= 2;
  const PARTS = {
    mavzu: { color: T.blue, hex: "#5BC8EC", name: tr2({ uz: "MAVZU", ru: "ТЕМА" }), word: tr2({ uz: "«Pixel Quest» o'yini", ru: "игра «Pixel Quest»" }), desc: tr2({ uz: "Qanaqa sahifa: o'yin promo, klub, tadbir yoki ilova.", ru: "Какая страница: промо игры, клуб, событие или приложение." }) },
    uslub: { color: T.accent, hex: "#FF9777", name: tr2({ uz: "USLUB", ru: "СТИЛЬ" }), word: tr2({ uz: "o'ynoqi", ru: "игривый" }), desc: tr2({ uz: "Sahifa qanday ko'rinishda: zamonaviy, o'ynoqi yoki sodda.", ru: "Как выглядит страница: современная, игривая или простая." }) },
    rang: { color: T.success, hex: "#6FD79E", name: tr2({ uz: "RANG", ru: "ЦВЕТ" }), word: tr2({ uz: "ko'k", ru: "синий" }), desc: tr2({ uz: "Asosiy rang: ko'k, yashil, to'q sariq yoki siyohrang.", ru: "Основной цвет: синий, зелёный, оранжевый или фиолетовый." }) },
    qism: { color: "#A78BFA", hex: "#C4B5FD", name: tr2({ uz: "QISMLAR", ru: "ЧАСТИ" }), word: tr2({ uz: "tugma va kartalar", ru: "кнопка и карточки" }), desc: tr2({ uz: "Sahifada nimalar bo'lsin: harakat tugmasi, xususiyat kartalari yoki banner.", ru: "Что должно быть на странице: кнопка действия, карточки преимуществ или баннер." }) }
  };
  const tap = (k) => {
    setPart(k);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(k);
      return n;
    });
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const Span = ({ k }) => <span onClick={() => tap(k)} style={{ cursor: "pointer", color: PARTS[k].hex, fontWeight: 700, background: part === k ? PARTS[k].color + "22" : "transparent", borderRadius: 5, padding: "1px 5px", outline: part === k ? `2px solid ${PARTS[k].color}` : "none" }}>{PARTS[k].word}</span>;
  return <Stage eyebrow={{ uz: "Buyruqning 4 ingredienti", ru: "4 ингредиента команды" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Kamida 2 qismni bosing", ru: "Нажмите минимум 2 части" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Yaxshi buyruq <span className="italic" style={{ color: T.accent }}>nimalardan</span> tashkil topadi?</>, ru: <>Из чего <span className="italic" style={{ color: T.accent }}>состоит</span> хорошая команда?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Yaxshi prompt <b style={{ color: T.ink }}>4 ingredientdan</b> iborat. Buyruqdagi rangli qismlarni <b style={{ color: T.ink }}>bosib</b> ko'ring.</>, ru: <>Хороший промпт состоит из <b style={{ color: T.ink }}>4 ингредиентов</b>. <b style={{ color: T.ink }}>Нажмите</b> на цветные части команды.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="codebox" style={{ background: T.paper, color: T.ink, fontFamily: "'Manrope'", fontSize: "clamp(14px,1.9vw,16px)", lineHeight: 2.1, boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.16)` }}>
              {tr2({ uz: <>Menga <Span k="mavzu" /> uchun bir sahifali promo-landing yasab ber — <Span k="uslub" /> uslubda, <Span k="rang" /> rangli, <Span k="qism" /> bilan.</>, ru: <>Сделай мне одностраничный промо-лендинг — тема: <Span k="mavzu" />, стиль: <Span k="uslub" />, цвет: <Span k="rang" />, части: <Span k="qism" />.</> })}
            </div>
            {part ? <div className="sk-info fade-step" key={part}>
                <span className="sk-tagbig"><span className="lg-dot" style={{ background: PARTS[part].color, width: 14, height: 14 }} /><span className="sk-wordbadge" style={{ color: PARTS[part].color, background: PARTS[part].color + "22" }}>{PARTS[part].name}</span></span>
                <p className="body" style={{ color: T.ink, margin: "10px 0 0" }}>{PARTS[part].desc}</p>
              </div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Buyruqdagi 4 ta rangli qismni bosing", ru: "Нажмите на 4 цветные части команды" })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Shu buyruqning natijasi", ru: "Результат этой команды" })}</p>
            <Browser url="pixel-quest.uz"><LandingPreview topic="oyin" style="oynoqi" color="kok" sections={{ button: true, cards: true, banner: false }} /></Browser>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>4 ingredient = aniq buyruq = aniq natija. Buni eslab qoling: <b>MAVZU · USLUB · RANG · QISMLAR</b>.</>, ru: <>4 ингредиента = точная команда = точный результат. Запомните: <b>ТЕМА · СТИЛЬ · ЦВЕТ · ЧАСТИ</b>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen4 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={{ uz: "Mashq · 1-savol", ru: "Упражнение · вопрос 1" }}
  audioText="Yaxshi prompt yomonidan nimasi bilan farq qiladi? To'g'ri javobni tanlang."
  questionText="Yaxshi prompt yomonidan nimasi bilan farq qiladi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Yaxshi prompt yomonidan nimasi bilan <span className="italic" style={{ color: T.accent }}>farq qiladi?</span></>, ru: <>Чем хороший промпт <span className="italic" style={{ color: T.accent }}>отличается</span> от плохого?</> })}</h2></>}
  options={[tr2({ uz: "Aniq tafsilot beradi: nima, uslub, rang, qismlar", ru: "Даёт точные детали: что, стиль, цвет, части" }), tr2({ uz: "Shunchaki uzunroq bo'ladi", ru: "Просто длиннее" }), tr2({ uz: "Faqat inglizcha yoziladi", ru: "Пишется только по-английски" }), tr2({ uz: "Hech qanday farqi yo'q", ru: "Никакой разницы" })]}
  correctIdx={0}
  explainCorrect={tr2({ uz: "To'g'ri! Yaxshi prompt aniq aytadi: mavzu, uslub, rang va qismlar.", ru: "Верно! Хороший промпт говорит точно: тема, стиль, цвет и части." })}
  explainWrong={{
    1: tr2({ uz: "Yo'q — gap uzunlikda emas, aniqlikda. Qisqa, lekin 4 ingredientli prompt ham zo'r ishlaydi.", ru: "Нет — дело не в длине, а в точности. Короткий промпт с 4 ингредиентами тоже отлично работает." }),
    2: tr2({ uz: "Yo'q — til muhim emas. O'zbekcha aniq prompt ham ajoyib natija beradi.", ru: "Нет — язык не важен. Точный промпт на родном языке тоже даёт отличный результат." }),
    3: tr2({ uz: "Yo'q — farq katta: aniq prompt aniq natija beradi, loyqa prompt bo'sh natija.", ru: "Нет — разница огромная: точный промпт даёт точный результат, размытый — пустой." }),
    default: tr2({ uz: "Yaxshi prompt = aniq tafsilot (mavzu, uslub, rang, qismlar).", ru: "Хороший промпт = точные детали (тема, стиль, цвет, части)." })
  }}
/>;
var Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: "s5", text: "Pastdagi to'rt blokdan tanlang — buyruq jumlasi siz tanlagani sari yig'iladi, o'ngdagi sayt esa darhol o'zgaradi. Har tanlovingiz natijaga qanday ta'sir qilishini ko'ring.", trigger: "on_mount", waits_for: null }]);
  const [topic, setTopic] = useState3(storedAnswer ? "oyin" : null);
  const [style, setStyle] = useState3(storedAnswer ? "zamonaviy" : null);
  const [color, setColor] = useState3(storedAnswer ? "kok" : null);
  const [sec, setSec] = useState3(storedAnswer ? { button: true, cards: true, banner: false } : { button: false, cards: false, banner: false });
  const anySec = sec.button || sec.cards || sec.banner;
  const all4 = topic && style && color && anySec;
  const done = all4;
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={{ uz: "Prompt-quruvchi", ru: "Конструктор промпта" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "4 ingredientni tanlang", ru: "Выберите 4 ингредиента" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Har bir blok natijani <span className="italic" style={{ color: T.accent }}>qanday</span> o'zgartiradi?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>каждый</span> блок меняет результат?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>4 blokdan tanlang — buyruq <b style={{ color: T.ink }}>yig'iladi</b>, sayt esa <b style={{ color: T.ink }}>darhol</b> o'zgaradi.</>, ru: <>Выбирайте из 4 блоков — команда <b style={{ color: T.ink }}>собирается</b>, а сайт меняется <b style={{ color: T.ink }}>мгновенно</b>.</> })}</Mentor>
        <PromoBuilder topic={topic} setTopic={setTopic} style={style} setStyle={setStyle} color={color} setColor={setColor} sec={sec} setSec={setSec} />
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Sezdingizmi? Har bir blok natijani o'zgartirdi. Siz AI'ni <b>so'z bilan boshqaryapsiz</b> — mana shu prompt mahorati.</>, ru: <>Заметили? Каждый блок менял результат. Вы управляете AI <b>словами</b> — это и есть мастерство промпта.</> })}</p></div>}
      </div>
    </Stage>;
};
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: "s6", text: "Yomon promptni yaxshi prompt bilan solishtiramiz. Ikkalasini ham yuborib, natijadagi farqni o'z ko'zingiz bilan ko'ring.", trigger: "on_mount", waits_for: null }]);
  const [mode, setMode] = useState3("yomon");
  const [sent, setSent] = useState3(null);
  const [phase, setPhase] = useState3("idle");
  const [seenBuilt, setSeenBuilt] = useState3(/* @__PURE__ */ new Set());
  const timer = useRef3(null);
  const done = seenBuilt.size >= 2;
  useEffect4(() => () => clearTimeout(timer.current), []);
  const send = () => {
    clearTimeout(timer.current);
    setPhase("building");
    timer.current = setTimeout(() => {
      setSent(mode);
      setSeenBuilt((prev) => {
        const n = new Set(prev);
        n.add(mode);
        return n;
      });
      setPhase("idle");
    }, 1100);
  };
  const improve = () => {
    setMode("yaxshi");
  };
  const stale = sent !== null && sent !== mode && phase === "idle";
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={{ uz: "Yomon ⚔️ Yaxshi", ru: "Плохой ⚔️ Хороший" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Ikki buyruqni ham yuboring", ru: "Отправьте обе команды" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Nega bir maqsad <span className="italic" style={{ color: T.accent }}>ikki xil</span> natija beradi?</>, ru: <>Почему одна цель даёт <span className="italic" style={{ color: T.accent }}>два разных</span> результата?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Avval <b style={{ color: T.ink }}>loyqa</b> buyruqni yuboring, so'ng uni <b style={{ color: T.ink }}>yaxshilab</b> qayta yuboring. Ikki natijani solishtiring.</>, ru: <>Сначала отправьте <b style={{ color: T.ink }}>размытую</b> команду, потом <b style={{ color: T.ink }}>улучшите</b> её и отправьте снова. Сравните два результата.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{mode === "yomon" ? tr2({ uz: "Buyruq (loyqa)", ru: "Команда (размытая)" }) : tr2({ uz: "Buyruq (aniq, 4 ingredient)", ru: "Команда (точная, 4 ингредиента)" })}</p>
            {mode === "yaxshi" ? <PromptLine topic="oyin" style="oynoqi" color="yashil" sections={{ button: true, cards: true, banner: true }} /> : <div className="promptbox">{tr2({ uz: <>Menga <span className="pb-slot">o'yin sayti</span> yasab ber.</>, ru: <>Сделай мне <span className="pb-slot">сайт про игру</span>.</> })}</div>}
            <button className="btn" onClick={send} disabled={phase === "building"} style={{ alignSelf: "flex-start" }}>{phase === "building" ? tr2({ uz: "Quryapti…", ru: "Строит…" }) : tr2({ uz: "Agentga yuborish", ru: "Отправить агенту" })}</button>
            {sent === "yomon" && mode === "yomon" && phase === "idle" && <button className="btn-soft" onClick={improve} style={{ alignSelf: "flex-start" }}>{tr2({ uz: "Buyruqni yaxshilash →", ru: "Улучшить команду →" })}</button>}
            {stale && <p className="hook-ack fade-step" style={{ margin: 0, color: T.accent }}>{tr2({ uz: "Buyruq o'zgardi — endi qayta yuboring.", ru: "Команда изменилась — отправьте заново." })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Natija", ru: "Результат" })}</p>
            <Browser url={sent === "yaxshi" ? "pixel-quest.uz" : "ai-natija.uz"}>
              {phase === "building" && <BuildingPreview />}
              {phase === "idle" && sent === null && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: "center", padding: "24px 0" }}>{tr2({ uz: "(buyruqni yuboring)", ru: "(отправьте команду)" })}</p>}
              {phase === "idle" && sent === "yomon" && <div className="result-reveal" key="yomon"><LandingPreview draft /></div>}
              {phase === "idle" && sent === "yaxshi" && <div className="result-reveal" key="yaxshi"><LandingPreview topic="oyin" style="oynoqi" color="yashil" sections={{ button: true, cards: true, banner: true }} /></div>}
            </Browser>
            {phase === "idle" && sent === "yomon" && <UstaBubble tone="warn">Loyqa buyruq — bo'shliqlarni o'zim to'ldirdim!</UstaBubble>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Bir xil maqsad, lekin tafsilot bilan natija osmon-u yer farq qiladi. <b>Tafsilot = sifat.</b></>, ru: <>Цель одна, но с деталями результат отличается как небо и земля. <b>Детали = качество.</b></> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen7 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={{ uz: "Mashq · 2-savol", ru: "Упражнение · вопрос 2" }}
  audioText="Qaysi buyruq eng yaxshi? Eng aniqini tanlang."
  questionText="O'yin promo sahifa uchun qaysi buyruq eng yaxshi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>O'yin promo sahifa uchun qaysi buyruq <span className="italic" style={{ color: T.accent }}>eng yaxshi?</span></>, ru: <>Какая команда для промо-страницы игры <span className="italic" style={{ color: T.accent }}>самая лучшая?</span></> })}</h2></>}
  options={[tr2({ uz: "Menga biror narsa qilib ber", ru: "Сделай мне что-нибудь" }), tr2({ uz: "Ko'k rangli, zamonaviy o'yin promo sahifasi — sarlavha, tugma va 3 ta karta bilan", ru: "Синяя современная промо-страница игры — с заголовком, кнопкой и 3 карточками" }), tr2({ uz: "Chiroyli va zamonaviy qilib ber", ru: "Сделай красиво и современно" }), tr2({ uz: "O'yin haqida sayt qil", ru: "Сделай сайт про игру" })]}
  correctIdx={1}
  explainCorrect={tr2({ uz: "To'g'ri! Bunda 4 ingredient bor: o'yin promo, zamonaviy, ko'k, tugma va kartalar.", ru: "Верно! Здесь есть 4 ингредиента: промо игры, современный, синий, кнопка и карточки." })}
  explainWrong={{
    0: tr2({ uz: "Yo'q — «biror narsa» juda loyqa. AI nima qilishni bilmaydi, natija tasodifiy bo'ladi.", ru: "Нет — «что-нибудь» слишком размыто. AI не знает, что делать, результат будет случайным." }),
    2: tr2({ uz: "Yo'q — «chiroyli, zamonaviy» faqat uslub. Mavzu, rang va qismlar aytilmagan — yarmi yetishmaydi.", ru: "Нет — «красиво, современно» это только стиль. Тема, цвет и части не названы — половины не хватает." }),
    3: tr2({ uz: "Yo'q — bunda faqat mavzu bor. Uslub, rang va qismlar yo'q, AI qolganini o'zi taxmin qiladi.", ru: "Нет — здесь только тема. Стиля, цвета и частей нет — остальное AI додумает сам." }),
    default: tr2({ uz: "Eng yaxshi buyruq 4 ingredientni aniq aytadi.", ru: "Лучшая команда точно называет 4 ингредиента." })
  }}
/>;
var Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: "s8", text: "AI birinchi urinishda xohlaganingizday qilmasa — tashlab ketmaysiz, qayta va aniqroq so'raysiz. Bu iteratsiya. Natijani kamida ikki marta yaxshilang.", trigger: "on_mount", waits_for: null }]);
  const BASE = { topic: "oyin", style: "zamonaviy", color: "sariq", sec: { button: true, cards: true, banner: false } };
  const [st, setSt] = useState3(BASE);
  const [log, setLog] = useState3([]);
  const [usedIds, setUsedIds] = useState3(/* @__PURE__ */ new Set());
  const done = usedIds.size >= 2;
  const doneRef = useScrollIntoViewOnMobile(done);
  const FOLLOWS = [
    { id: "f1", label: tr2({ uz: "Rangni yashilga o'zgartir", ru: "Поменяй цвет на зелёный" }), apply: (s) => ({ ...s, color: "yashil" }) },
    { id: "f2", label: tr2({ uz: "Uslubni o'ynoqi qil", ru: "Сделай стиль игривым" }), apply: (s) => ({ ...s, style: "oynoqi" }) },
    { id: "f3", label: tr2({ uz: "Banner qo'sh", ru: "Добавь баннер" }), apply: (s) => ({ ...s, sec: { ...s.sec, banner: true } }) },
    { id: "f4", label: tr2({ uz: "Siyohrang qil", ru: "Сделай фиолетовым" }), apply: (s) => ({ ...s, color: "siyohrang" }) }
  ];
  const apply = (f) => {
    if (usedIds.has(f.id)) return;
    setSt(f.apply);
    setLog((l) => [...l, f.label]);
    setUsedIds((prev) => {
      const n = new Set(prev);
      n.add(f.id);
      return n;
    });
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={{ uz: "Iteratsiya", ru: "Итерация" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Kamida 2 marta yaxshilang", ru: "Улучшите минимум 2 раза" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>AI birinchi urinishda <span className="italic" style={{ color: T.accent }}>mukammal</span> qiladimi?</>, ru: <>Делает ли AI <span className="italic" style={{ color: T.accent }}>идеально</span> с первой попытки?</> })}</h2></div>
        {
    /* F-0803-26: uchinchi gap («Quyidagi buyruqlarni bering») yon ustundagi yorliq va nav
       tugmasi bilan takror edi — mentor 2 gapdan oshmaydi (109-qonun). */
  }
        <Mentor>{tr2({ uz: <>Birinchi natija — oxirgisi emas. Yoqmagan joyini <b style={{ color: T.ink }}>qayta so'raysiz</b>: bu — <b style={{ color: T.ink }}>iteratsiya (qayta so'rash)</b>.</>, ru: <>Первый результат — не последний. То, что не нравится, вы <b style={{ color: T.ink }}>просите снова</b>: это — <b style={{ color: T.ink }}>итерация (повторный запрос)</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Qo'shimcha buyruqlar", ru: "Дополнительные команды" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FOLLOWS.map((f) => <button key={f.id} className={`chip ${usedIds.has(f.id) ? "chip-on" : ""}`} disabled={usedIds.has(f.id)} onClick={() => apply(f)} style={{ justifyContent: "flex-start", opacity: usedIds.has(f.id) ? 0.6 : 1 }}>{usedIds.has(f.id) ? "✓ " : "+ "}{f.label}</button>)}
            </div>
            {log.length > 0 && <div className="frame" style={{ padding: "12px 14px" }}>
                <p className="flow-label" style={{ margin: "0 0 7px" }}>{tr2({ uz: "Sizning buyruqlaringiz", ru: "Ваши команды" })}</p>
                {log.map((l, i) => <div key={i} style={{ display: "flex", gap: 7, fontSize: 13, marginBottom: 3 }}><span style={{ color: T.accent, fontWeight: 700 }}>{i + 1}.</span><span>{l}</span></div>)}
              </div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Sayt — qadam-baqadam yaxshilanadi", ru: "Сайт — улучшается шаг за шагом" })}</p>
            <Browser url="pixel-quest.uz"><LandingPreview topic={st.topic} style={st.style} color={st.color} sections={st.sec} /></Browser>
            {done && <div ref={doneRef} className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Mana iteratsiya kuchi! Har bir kichik buyruq saytni yaxshilaydi.", ru: "Вот сила итерации! Каждая маленькая команда улучшает сайт." })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen9 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={{ uz: "Mashq · 3-savol", ru: "Упражнение · вопрос 3" }}
  audioText="AI birinchi urinishda xohlaganingizday qilmasa, nima qilasiz?"
  questionText="AI birinchi urinishda xohlaganingizday qilmasa, nima qilasiz?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>AI birinchi urinishda <span className="italic" style={{ color: T.accent }}>xohlaganingizday</span> qilmasa, nima qilasiz?</>, ru: <>AI с первой попытки сделал <span className="italic" style={{ color: T.accent }}>не так, как вы хотели</span> — что делать?</> })}</h2></>}
  options={[tr2({ uz: "Hammasini qo'lda qayta yozaman", ru: "Перепишу всё руками" }), tr2({ uz: "Tashlab ketaman", ru: "Брошу и уйду" }), tr2({ uz: "Qayta, aniqroq so'rayman (iteratsiya)", ru: "Попрошу снова, точнее (итерация)" }), tr2({ uz: `"AI yomon" deb xafa bo'laman`, ru: "Обижусь: «AI плохой»" })]}
  correctIdx={2}
  explainCorrect={tr2({ uz: "To'g'ri! Bu — iteratsiya. «Rangni o'zgartir», «tugma qo'sh» kabi qo'shimcha buyruqlar bilan natijani qadam-baqadam yaxshilaysiz.", ru: "Верно! Это — итерация. Дополнительными командами вроде «поменяй цвет», «добавь кнопку» вы шаг за шагом улучшаете результат." })}
  explainWrong={{
    0: tr2({ uz: "Yo'q — qo'lda qayta yozish AI tezligini yo'qotadi. Qayta so'rash (iteratsiya) ancha tez.", ru: "Нет — переписывать руками значит потерять скорость AI. Попросить снова (итерация) гораздо быстрее." }),
    1: tr2({ uz: "Yo'q — birinchi natija oxirgisi emas. Bir-ikki qo'shimcha buyruq bilan ajoyib bo'ladi.", ru: "Нет — первый результат не последний. Одна-две дополнительные команды — и будет отлично." }),
    3: tr2({ uz: "Yo'q — AI yomon emas, shunchaki aniqroq yo'naltirish kerak. Qayta so'rang.", ru: "Нет — AI не плохой, его просто нужно точнее направить. Попросите снова." }),
    default: tr2({ uz: "Yoqmasa — qayta, aniqroq so'raysiz. Bu iteratsiya.", ru: "Не нравится — просите снова, точнее. Это итерация." })
  }}
/>;
var Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: "s10", text: "AI so'rovni har doim aniq tushunadimi? Natijani buyruq bilan solishtiring: qaysi qism boshqacha chiqqan? Topib, aniqlashtiring.", trigger: "on_mount", waits_for: null }]);
  const [found, setFound] = useState3(storedAnswer ? "rang" : null);
  const [fixed, setFixed] = useState3(!!storedAnswer);
  const isFound = found === "rang";
  const done = fixed;
  const ASPECTS = [["mavzu", tr2({ uz: "Mavzu", ru: "Тема" })], ["rang", tr2({ uz: "Rang", ru: "Цвет" })], ["tugma", tr2({ uz: "Tugma", ru: "Кнопка" })], ["ok", tr2({ uz: "Hammasi joyida", ru: "Всё на месте" })]];
  const click = (a) => {
    if (isFound) return;
    setFound(a);
  };
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={{ uz: "Tekshirish", ru: "Проверка" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : isFound ? { uz: "Endi aniqlashtiring", ru: "Теперь уточните" } : { uz: "Farqni toping", ru: "Найдите отличие" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>AI so'rovni har doim <span className="italic" style={{ color: T.accent }}>aniq</span> tushunadimi?</>, ru: <>Всегда ли AI понимает запрос <span className="italic" style={{ color: T.accent }}>точно</span>?</> })}</h2></div>
        {
    /* F-0803-26: mentordagi uchinchi gap («Qaysi qism boshqacha chiqqan?») pastdagi
       yorliq bilan so'zma-so'z bir xil edi — ko'rsatma harakatga eng yaqin joyda qoladi. */
  }
        <Mentor>{tr2({ uz: <>Siz <b style={{ color: T.ink }}>ko'k</b> rangli o'yin sahifasi so'radingiz. Ustabot qurib berdi — endi buyruq bilan natijani <b style={{ color: T.ink }}>solishtiring</b>.</>, ru: <>Вы просили страницу игры в <b style={{ color: T.ink }}>синем</b> цвете. Устабот её построил — теперь <b style={{ color: T.ink }}>сверьте</b> команду с результатом.</> })}</Mentor>
        {
    /* F-0803-26: ilgari chap ustunda BUYRUQ va NATIJA ustma-ust turardi — natija 720px
       ekrandan pastga tushib ketar, o'quvchidan esa aynan shu ikkisini solishtirish
       so'ralardi. Endi ular yonma-yon; tanlov chiplari ikkisining ostida. */
  }
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Sizning buyrug'ingiz", ru: "Ваша команда" })}</p>
            <PromptLine topic="oyin" style="zamonaviy" color="kok" sections={{ button: true }} />
            {
    /* Farq topilgach qabul akti SHU YERDA — chap ustunda bo'sh joy bor. Ilgari u
       split ostida turar va «Rangni ko'kka tuzat» tugmasi 894px ga tushib ketardi. */
  }
            {isFound && <div className="col" style={{ gap: "clamp(8px,1.2vw,12px)" }}>
              {!fixed && <>
                {
    /* F-0803-26 (71-bo'lim): hukm bitta qator. Ilgari bu blok «Siz ko'k
       so'ragandingiz, Ustabot to'q sariq deb tushunibdi» deb yozardi — pastdagi
       qabul akti «Rang mos? (ko'k) ✗» bilan aynan shuni aytadi (72-qonun), va
       ikkovi birga «tuzat» tugmasini ekrandan pastga surib yuborardi. */
  }
                <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <><b style={{ color: T.accent }}>Topdingiz!</b> Ustabot <b>ko'k</b>ni <b>to'q sariq</b> deb tushunibdi.</>, ru: <><b style={{ color: T.accent }}>Нашли!</b> Устабот понял <b>синий</b> как <b>оранжевый</b>.</> })}</p></div>
                <AcceptanceReport
    checks={[{ label: { uz: "Mavzu mos? (o'yin)", ru: "Тема совпала? (игра)" }, ok: true }, { label: { uz: "Rang mos? (ko'k)", ru: "Цвет совпал? (синий)" }, ok: false }, { label: { uz: "Tugma bor?", ru: "Кнопка есть?" }, ok: true }, { label: { uz: "Ortiqcha yo'q?", ru: "Ничего лишнего?" }, ok: true }]}
    onRedo={() => setFixed(true)}
    redoLabel={{ uz: "Rangni ko'kka tuzat", ru: "Исправь цвет на синий" }}
  />
              </>}
              {fixed && <div className="takeaway fade-step"><div className="ta-bulb" style={{ fontSize: 24, fontWeight: 800, color: T.success }}>✓</div><p className="ta-h">{tr2({ uz: "Tekshirdingiz va aniqlashtirdingiz!", ru: "Вы проверили и уточнили!" })}</p><p className="ta-sub">{tr2({ uz: "Ustabot quradi, siz solishtirib aniqlik kiritasiz — ajoyib jamoa.", ru: "Устабот строит, вы сверяете и уточняете — отличная команда." })}</p></div>}
            </div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "AI natijasi", ru: "Результат AI" })}</p>
            <Browser url="pixel-quest.uz"><LandingPreview topic="oyin" style="zamonaviy" color={fixed ? "kok" : "sariq"} sections={{ button: true }} /></Browser>
          </Col>
        </div>
        </Zoomable>
        <div className="col" style={{ gap: "clamp(8px,1.2vw,12px)" }}>
            {!isFound && <>
              <p className="flow-label">{tr2({ uz: "Natijaning qaysi qismi buyruqdan farq qiladi?", ru: "Какая часть результата отличается от команды?" })}</p>
              <div className="chiprow">{ASPECTS.map(([k, l]) => <button key={k} className={`chip ${found === k ? "chip-on" : ""}`} disabled={isFound} onClick={() => click(k)}>{l}</button>)}</div>
            </>}
            {!isFound && found && found !== "rang" && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Bu qism aslida to'g'ri. Buyruqni va rangni yana solishtiring — qaysi <b>rangda</b> so'radingiz, qaysi rangda chiqdi?</>, ru: <>Эта часть на самом деле верна. Сравните команду и цвет ещё раз — какой <b>цвет</b> вы просили и какой получился?</> })}</p></div>}
            {
    /* F-0803-26: bu yerda «Buyruqdagi har bir ingredientni natija bilan solishtiring…»
       ipuchasi turardi — bir ko'rsatma to'rt joyda (mentor · yorliq · ipucha · nav
       tugmasi) takrorlanardi. Tanlov chiplarining o'zi nimani solishtirishni aytadi.
       Eski qabul-akti bloki chap ustunga ko'chdi (yuqoriga qarang). */
  }
        </div>
      </div>
    </Stage>;
};
var Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: "s11", text: "AI nimada kuchli va siz nimani tekshirasiz? Ikkala kartani bosib ko'ring: AI tezlik beradi, siz sifatni ta'minlaysiz.", trigger: "on_mount", waits_for: null }]);
  const CARDS = {
    kuch: { name: tr2({ uz: "AI nimada KUCHLI", ru: "В чём AI СИЛЁН" }), color: T.success, items: [tr2({ uz: "Tezlik — soniyalarda quradi", ru: "Скорость — строит за секунды" }), tr2({ uz: "Ko'p variant taklif qiladi", ru: "Предлагает много вариантов" }), tr2({ uz: "Dizayn va bezakda usta", ru: "Мастер дизайна и оформления" }), tr2({ uz: "Zerikarli ishlarni bajaradi", ru: "Берёт на себя скучную работу" })] },
    tekshir: { name: tr2({ uz: "Siz nimani tekshirasiz", ru: "Что проверяете вы" }), color: T.blue, items: [tr2({ uz: "So'raganim chiqdimi?", ru: "Вышло то, что я просил?" }), tr2({ uz: "Ortiqcha narsa yo'qmi?", ru: "Нет ли лишнего?" }), tr2({ uz: "Matn to'g'ri yozilganmi?", ru: "Правильно ли написан текст?" }), tr2({ uz: "Hammasi ishlayaptimi?", ru: "Всё ли работает?" })] }
  };
  const [active, setActive] = useState3(null);
  const [seen, setSeen] = useState3(/* @__PURE__ */ new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 2;
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
  return <Stage eyebrow={{ uz: "AI bilan ishlash", ru: "Работа с AI" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: `${seen.size}/2 ko'ring`, ru: `Посмотрите ${seen.size}/2` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>AI bilan eng <span className="italic" style={{ color: T.accent }}>zo'r natijani</span> qanday olamiz?</>, ru: <>Как получить с AI <span className="italic" style={{ color: T.accent }}>самый крутой результат</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Sirri oddiy: <b style={{ color: T.ink }}>birga ishlaysiz</b> — AI tez quradi, siz tekshirasiz. Ikkala kartani bosing.</>, ru: <>Секрет прост: <b style={{ color: T.ink }}>работаете вместе</b> — AI быстро строит, вы проверяете. Нажмите обе карточки.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.keys(CARDS).map((k) => <button key={k} onClick={() => tap(k)} style={{ display: "flex", alignItems: "center", gap: 13, textAlign: "left", cursor: "pointer", border: "none", borderRadius: 14, padding: "15px 16px", background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${CARDS[k].color}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: "all 0.18s" }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: CARDS[k].color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 16, color: T.ink }}>{CARDS[k].name}</span>
                  {seen.has(k) && <span style={{ marginLeft: "auto", color: T.success }}>✓</span>}
                </button>)}
            </div>
          </Col>
          <Col>
            {active ? <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span style={{ width: 14, height: 14, borderRadius: 4, background: CARDS[active].color }} /><span className="sk-wordbadge" style={{ color: CARDS[active].color, background: CARDS[active].color + "22" }}>{CARDS[active].name}</span></span>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 11 }}>
                  {CARDS[active].items.map((e, i) => <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", background: T.bg, borderRadius: 8, padding: "8px 11px" }}><span style={{ color: CARDS[active].color }}>•</span><span className="body" style={{ margin: 0, color: T.ink2 }}>{e}</span></div>)}
                </div>
              </div> : !isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Bir kartani bosing", ru: "Нажмите на карточку" })}</p></div> : null}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>AI'dan <b>tezlik</b> oling, natijani <b>o'zingiz tekshiring</b> — shunda natija doim zo'r.</>, ru: <>Берите у AI <b>скорость</b>, результат <b>проверяйте сами</b> — тогда он всегда отличный.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen12 = ({ screen, storedAnswer, onAnswer, onPracticeDone, onNext, onPrev }) => {
  useAudio([{ id: "s12", text: "Endi to'liq erkinlik sizda! Yoqtirgan mavzu, uslub, rang va qismlarni tanlab, o'zingizning promo sahifangizni quring va nashr qiling.", trigger: "on_mount", waits_for: null }]);
  const [topic, setTopic] = useState3(storedAnswer ? "tadbir" : null);
  const [style, setStyle] = useState3(storedAnswer ? "oynoqi" : null);
  const [color, setColor] = useState3(storedAnswer ? "siyohrang" : null);
  const [sec, setSec] = useState3(storedAnswer ? { button: true, cards: true, banner: true } : { button: false, cards: false, banner: false });
  const [published, setPublished] = useState3(!!storedAnswer);
  const anySec = sec.button || sec.cards || sec.banner;
  const all4 = topic && style && color && anySec;
  const done = published;
  const pubRef = useScrollIntoView(published);
  useEffect4(() => {
    if (done && storedAnswer === void 0) {
      onAnswer(screen, { correct: true, picked: true });
      if (onPracticeDone) onPracticeDone(screen);
    }
  }, [done]);
  return <Stage eyebrow={{ uz: "O'z loyihangiz", ru: "Ваш проект" }} screen={screen} mentorCollapsible navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Sahifani nashr qiling", ru: "Опубликуйте страницу" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>o'zingiz</span> qanday sayt yaratasiz?</>, ru: <>Какой сайт вы теперь создадите <span className="italic" style={{ color: T.accent }}>сами</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Endi erkinlik sizda: <b style={{ color: T.ink }}>o'z</b> promo sahifangizni quring va <b style={{ color: T.ink }}>nashr qiling</b> (deploy).</>, ru: <>Теперь свобода за вами: постройте <b style={{ color: T.ink }}>свою</b> промо-страницу и <b style={{ color: T.ink }}>опубликуйте</b> её (deploy).</> })}</Mentor>
        <PromoBuilder
    topic={topic}
    setTopic={setTopic}
    style={style}
    setStyle={setStyle}
    color={color}
    setColor={setColor}
    sec={sec}
    setSec={setSec}
    footer={<div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button className="btn" disabled={!all4 || published} onClick={() => setPublished(true)} style={{ opacity: all4 ? 1 : 0.5 }}>{published ? tr2({ uz: "✓ Nashr qilindi", ru: "✓ Опубликовано" }) : tr2({ uz: "Nashr qilish (deploy)", ru: "Опубликовать (deploy)" })}</button>
              {published && <span className="mono small" style={{ color: T.success }}>https://mening-promo.netlify.app</span>}
            </div>}
  />
        {
    /* F-0803-26: tugma yonida «avval 4 ingredientni tanlang» yozuvi ham turardi — tugmaning
       o'chiq holati va nav yorlig'i buni allaqachon aytadi (99-qonun). */
  }
        {published && <div ref={pubRef} className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Tabriklaymiz! Sahifangiz nashr qilindi — havolani endi ulashsangiz bo'ladi.", ru: "Поздравляем! Ваша страница опубликована — теперь можно делиться ссылкой." })}</p></div>}
      </div>
    </Stage>;
};
var Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: "s13", text: "Bitta usul bilan nechta xil sayt qura olasiz? Faqat mavzuni almashtirib, butunlay boshqa saytlarni yasang.", trigger: "on_mount", waits_for: null }]);
  const [topic, setTopic] = useState3("oyin");
  const [sent, setSent] = useState3(null);
  const [phase, setPhase] = useState3("idle");
  const [builtTopics, setBuiltTopics] = useState3(/* @__PURE__ */ new Set());
  const timer = useRef3(null);
  const done = builtTopics.size >= 2;
  useEffect4(() => () => clearTimeout(timer.current), []);
  const send = () => {
    clearTimeout(timer.current);
    setPhase("building");
    timer.current = setTimeout(() => {
      setSent(topic);
      setBuiltTopics((prev) => {
        const n = new Set(prev);
        n.add(topic);
        return n;
      });
      setPhase("idle");
    }, 900);
  };
  const stale = sent !== null && sent !== topic && phase === "idle";
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={{ uz: "Tez-tez", ru: "Ещё и ещё" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Kamida 2 mavzu yuboring", ru: "Отправьте минимум 2 темы" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bitta usul bilan <span className="italic" style={{ color: T.accent }}>nechta xil</span> sayt qura olasiz?</>, ru: <>Сколько <span className="italic" style={{ color: T.accent }}>разных</span> сайтов можно построить одним способом?</> })}</h2></div>
        <Mentor>{tr2({ uz: <><b style={{ color: T.ink }}>Faqat mavzuni almashtiring</b> — butunlay boshqa sayt chiqadi. Ikki xil mavzuni tanlab yuboring.</>, ru: <><b style={{ color: T.ink }}>Меняйте только тему</b> — выйдет совсем другой сайт. Отправьте две разные темы.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Mavzuni tanlang", ru: "Выберите тему" })}</p>
            <div className="chiprow fade-up delay-1">{TOPICS.map(([v, l]) => <button key={v} className={`chip ${topic === v ? "chip-on" : ""}`} onClick={() => setTopic(v)}>{tr2(l)}</button>)}</div>
            <div className="promptbox">{tr2({ uz: <>Menga <span className="pb-slot" key={topic}>{tr2(TOPIC_PROMPT[topic])}</span> uchun bir sahifali promo-landing yasab ber. Uslubi <span className="pb-slot">o'ynoqi</span>, asosiy rang <span className="pb-slot">siyohrang</span>. Sahifada <span className="pb-slot">katta sarlavha, harakat tugmasi va 3 ta karta</span> bo'lsin.</>, ru: <>Сделай мне одностраничный промо-лендинг для <span className="pb-slot" key={topic}>{tr2(TOPIC_PROMPT[topic])}</span>. Стиль — <span className="pb-slot">игривый</span>, основной цвет — <span className="pb-slot">фиолетовый</span>. На странице <span className="pb-slot">большой заголовок, кнопка действия и 3 карточки</span>.</> })}</div>
            <button className="btn" onClick={send} disabled={phase === "building"} style={{ alignSelf: "flex-start" }}>{phase === "building" ? tr2({ uz: "Quryapti…", ru: "Строит…" }) : tr2({ uz: "Agentga yuborish", ru: "Отправить агенту" })}</button>
            {stale && <p className="hook-ack fade-step" style={{ margin: 0, color: T.accent }}>{tr2({ uz: "Yangi mavzu tanlandi — yuborib ko'ring.", ru: "Выбрана новая тема — попробуйте отправить." })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Natija — har mavzuga boshqa sayt", ru: "Результат — на каждую тему свой сайт" })}</p>
            <Browser url={sent ? `${sent}.uz` : "promo.uz"} key={sent || "none"}>
              {phase === "building" && <BuildingPreview />}
              {phase === "idle" && sent === null && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: "center", padding: "24px 0" }}>{tr2({ uz: "(mavzu tanlab, yuboring)", ru: "(выберите тему и отправьте)" })}</p>}
              {phase === "idle" && sent && <div className="result-reveal"><LandingPreview topic={sent} style="oynoqi" color="siyohrang" sections={{ button: true, cards: true, banner: false }} /></div>}
            </Browser>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Ko'rdingizmi? O'yin, klub, tadbir, ilova — bitta usul bilan hammasi. Endi siz <b>istalgancha sayt</b> qura olasiz.</>, ru: <>Видели? Игра, клуб, событие, приложение — всё одним способом. Теперь вы можете построить <b>сколько угодно сайтов</b>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: "s14", text: "Antigravity — siz uyda ishlaydigan haqiqiy asbob. Demoni ishga tushirib, muhit bilan tanishing.", trigger: "on_mount", waits_for: null }]);
  const [phase, setPhase] = useState3(storedAnswer ? "done" : "idle");
  const timer = useRef3(null);
  const done = phase === "done";
  const doneRef = useScrollIntoViewOnMobile(done);
  useEffect4(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current);
    setPhase("plan");
    timer.current = setTimeout(() => {
      setPhase("building");
      timer.current = setTimeout(() => setPhase("done"), 1200);
    }, 1e3);
  };
  const PLAN = [tr2({ uz: "Sahifa strukturasini yarataman", ru: "Создам структуру страницы" }), tr2({ uz: "Sarlavha, tugma va kartalarni qo'shaman", ru: "Добавлю заголовок, кнопку и карточки" }), tr2({ uz: "Tanlangan rang va uslubni qo'llayman", ru: "Применю выбранные цвет и стиль" })];
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={{ uz: "Haqiqiy asbob", ru: "Настоящий инструмент" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "Demoni ishga tushiring", ru: "Запустите демо" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bu usulni endi <span className="italic" style={{ color: T.accent }}>haqiqiy loyihada</span> qanday ishlatamiz?</>, ru: <>Как использовать этот способ <span className="italic" style={{ color: T.accent }}>в настоящем проекте</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <><b style={{ color: T.ink }}>Antigravity</b> — haqiqiy dastur, xuddi shunday ishlaydi: siz yozasiz, agent <b style={{ color: T.ink }}>reja</b> tuzib quradi. Demoni ishga tushiring.</>, ru: <><b style={{ color: T.ink }}>Antigravity</b> — настоящая программа, работает точно так же: вы пишете, агент строит по <b style={{ color: T.ink }}>плану</b>. Запустите демо.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Siz Antigravity'ga yozasiz", ru: "Вы пишете в Antigravity" })}</p>
            <PromptLine topic="oyin" style="minimal" color="kok" sections={{ button: true, cards: true }} />
            <button className="btn" onClick={run} disabled={phase === "plan" || phase === "building"} style={{ alignSelf: "flex-start" }}>{phase === "plan" ? tr2({ uz: "Reja tuzyapti…", ru: "Составляет план…" }) : phase === "building" ? tr2({ uz: "Quryapti…", ru: "Строит…" }) : done ? tr2({ uz: "↻ Yana", ru: "↻ Ещё раз" }) : tr2({ uz: "Antigravity'ga yuborish", ru: "Отправить в Antigravity" })}</button>
            {(phase === "plan" || phase === "building" || done) && <div className="ai-card fade-step">
                <div className="ai-row"><span className="ai-badge" style={{ background: T.ink }}>Agent</span><span className="ai-bubble">{tr2({ uz: "Rejam:", ru: "Мой план:" })}</span></div>
                {PLAN.map((p, i) => <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}><span style={{ color: phase === "plan" ? T.ink3 : T.success }}>{phase === "plan" ? "○" : "✓"}</span><span>{p}</span></div>)}
              </div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Antigravity brauzeri", ru: "Браузер Antigravity" })}</p>
            <Browser url="pixel-quest.uz">
              {phase === "idle" && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: "center", padding: "24px 0" }}>{tr2({ uz: "(demoni ishga tushiring)", ru: "(запустите демо)" })}</p>}
              {(phase === "plan" || phase === "building") && <p className="small" style={{ margin: 0, opacity: 0.6, textAlign: "center", padding: "24px 0" }}>{phase === "plan" ? tr2({ uz: "Reja tuzilyapti…", ru: "Составляется план…" }) : tr2({ uz: "Quryapti…", ru: "Строит…" })}</p>}
              {done && <LandingPreview topic="oyin" style="minimal" color="kok" sections={{ button: true, cards: true }} />}
            </Browser>
            {done && <div ref={doneRef} className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Aynan shunday! Uyga vazifada shu tarzda o'z saytingizni quring.", ru: "Именно так! В домашнем задании постройте свой сайт таким же способом." })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: "s15", text: "Yakuniy amaliy mashq: to'rt ingredientni to'ldirib, o'z buyrug'ingizni tuzing va natijani ko'ring.", trigger: "on_mount", waits_for: null }]);
  const [topic, setTopic] = useState3(storedAnswer?.correct ? "tadbir" : null);
  const [style, setStyle] = useState3(storedAnswer?.correct ? "zamonaviy" : null);
  const [color, setColor] = useState3(storedAnswer?.correct ? "kok" : null);
  const [sec, setSec] = useState3(storedAnswer?.correct ? { button: true, cards: true, banner: false } : { button: false, cards: false, banner: false });
  const [passed, setPassed] = useState3(!!storedAnswer?.correct);
  const passedRef = useScrollIntoViewOnMobile(passed);
  const anySec = sec.button || sec.cards || sec.banner;
  const all4 = topic && style && color && anySec;
  useEffect4(() => {
    if (all4 && !passed) {
      setPassed(true);
      onAnswer(screen, { stage: "final", screenIdx: screen, question: "To'liq 4-ingredientli buyruq tuzish", studentAnswer: `${topic}/${style}/${color}`, correct: true, firstAttemptCorrect: true, solved: true, picked: `${topic}/${style}/${color}` });
    }
  }, [all4]);
  return <Stage eyebrow={{ uz: "Yakuniy · amaliy", ru: "Финал · практика" }} screen={screen} mentorCollapsible navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? { uz: "Davom etish", ru: "Продолжить" } : { uz: "4 ingredientni to'ldiring", ru: "Заполните 4 ингредиента" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Oxirgi sinov: <span className="italic" style={{ color: T.accent }}>to'liq</span> buyruq tuzing</>, ru: <>Последнее испытание: составьте <span className="italic" style={{ color: T.accent }}>полную</span> команду</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Vazifa: <b style={{ color: T.ink }}>maktab konsertiga promo sahifa</b>. <b style={{ color: T.ink }}>4 ingredientning hammasini</b> tanlang.</>, ru: <>Задача: <b style={{ color: T.ink }}>промо-страница школьного концерта</b>. Выберите <b style={{ color: T.ink }}>все 4 ингредиента</b>.</> })}</Mentor>
        <PromoBuilder topic={topic} setTopic={setTopic} style={style} setStyle={setStyle} color={color} setColor={setColor} sec={sec} setSec={setSec} />
        {
    /* F-0803-26: bu yerda qabul-akti (4 ta «Mavzu tanlandi?» belgisi) va uning ostida
       «4 ingredient kerak: mavzu + uslub + rang + qism» qatori turardi. Ikkalasi ham
       quruvchining O'Z tugmalari allaqachon ko'rsatayotgan holatni takrorlardi (72-qonun)
       va majburiy darvozani 720px ekrandan 341px pastga surib yuborardi (F-0803-19). */
  }
        {passed && <div ref={passedRef} className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Mukammal! To'liq buyruq — Ustabot endi aynan so'raganingizni quradi.", ru: "Идеально! Полная команда — Устабот построит именно то, что вы просили." })}</p></div>}
      </div>
    </Stage>;
};
var AI_FLASHCARDS = [
  // F-0803-23: har javob — atama + qavsda o'zbekcha izoh («Deploy (nashr qilish)» naqshi).
  // Tarjimasiz chet so'z javob bo'lolmaydi; izoh — bitta jonli misol, ta'rif emas.
  { front: { uz: "AI'ga beriladigan buyruq nima deyiladi?", ru: "Как называется команда, которую дают AI?" }, back: { uz: "Prompt (buyruq)", ru: "Промпт (команда)" }, note: { uz: "aniq buyruq — aniq natija", ru: "точная команда — точный результат" } },
  { front: { uz: "Kod yozmasdan, so'z bilan sayt qurish nima deyiladi?", ru: "Как называется создание сайта словами, без кода?" }, back: { uz: "Vibecoding (gapirib qurish)", ru: "Вайбкодинг (строить словами)" }, note: { uz: "siz aytasiz — AI quradi", ru: "вы говорите — AI строит" } },
  { front: { uz: "Yaxshi promptning 4 ingredienti qaysilar?", ru: "Какие 4 ингредиента у хорошего промпта?" }, back: { uz: "Mavzu · Uslub · Rang · Qismlar", ru: "Тема · Стиль · Цвет · Части" }, note: { uz: "masalan: o'yin · o'ynoqi · ko'k · tugma va 3 karta", ru: "например: игра · игривый · синий · кнопка и 3 карточки" } },
  { front: { uz: "Promptdagi «uslub» nimani aytadi?", ru: "О чём говорит «стиль» в промпте?" }, back: { uz: "Sahifa qanday ko'rinishini", ru: "Как выглядит страница" }, note: { uz: "zamonaviy, o'ynoqi yoki sodda", ru: "современный, игривый или простой" } },
  { front: { uz: "«Menga sayt yasab ber» — bu qanaqa prompt?", ru: "«Сделай мне сайт» — какой это промпт?" }, back: { uz: "Loyqa prompt", ru: "Размытый промпт" }, note: { uz: "aniq emas — natija ham tasodifiy", ru: "неточный — и результат случайный" } },
  { front: { uz: "Natija yoqmasa, qayta va aniqroq so'rash nima deyiladi?", ru: "Как называется повторный, более точный запрос?" }, back: { uz: "Iteratsiya (qayta so'rash)", ru: "Итерация (попросить снова)" }, note: { uz: "«rangni yashil qil», «banner qo'sh»", ru: "«сделай цвет зелёным», «добавь баннер»" } },
  { front: { uz: "AI sahifani yasab berdi — birinchi nima qilasiz?", ru: "AI сделал страницу — что делаете первым?" }, back: { uz: "Tekshirish", ru: "Проверка" }, note: { uz: "rang, mavzu, tugma — so'raganday chiqdimi?", ru: "цвет, тема, кнопка — вышло как просили?" } },
  { front: { uz: "AI nima beradi, siz nima qilasiz?", ru: "Что даёт AI, а что делаете вы?" }, back: { uz: "AI — tezlik, siz — sifat", ru: "AI — скорость, вы — качество" }, note: { uz: "birga ishlaganda natija zo'r chiqadi", ru: "вместе результат выходит отличным" } },
  { front: { uz: "Reja tuzib, sahifani o'zi quradigan AI yordamchisi?", ru: "AI-помощник, который сам составляет план и строит?" }, back: { uz: "Agent (AI yordamchi)", ru: "Агент (AI-помощник)" }, note: { uz: "avval rejasini ko'rsatadi, siz tasdiqlaysiz", ru: "сначала показывает план, вы подтверждаете" } },
  { front: { uz: "Bitta sahifadan iborat reklama sayti nima deyiladi?", ru: "Как называется рекламный сайт из одной страницы?" }, back: { uz: "Promo sahifa (promo-landing)", ru: "Промо-страница (промо-лендинг)" }, note: { uz: "sarlavha, tavsif, tugma va kartalar", ru: "заголовок, описание, кнопка и карточки" } },
  { front: { uz: "Tayyor saytni internetga chiqarish nima deyiladi?", ru: "Как называется публикация готового сайта в интернете?" }, back: { uz: "Deploy (nashr qilish)", ru: "Deploy (публикация)" }, note: { uz: "shundan keyin havolani ulashasiz", ru: "после этого делитесь ссылкой" } },
  { front: { uz: "Uyda shu usulda ishlaydigan haqiqiy AI-dastur qaysi?", ru: "В какой настоящей AI-программе можно так работать дома?" }, back: "Antigravity", note: { uz: "siz yozasiz, agent reja tuzib quradi", ru: "вы пишете, агент строит по плану" } }
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
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr2({ uz: "O'rganilmoqda", ru: "Учим" })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr2({ uz: "Bildim", ru: "Знаю" })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${known / total * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === "knew" ? "out-knew" : ""} ${exiting === "again" ? "out-again" : ""}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? "flip" : ""}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr2(card.front)}</span><span className="fc-cue">{tr2({ uz: <>Javobni o'ylang 🤔 <span className="fc-tap">bosing</span></>, ru: <>Подумайте над ответом 🤔 <span className="fc-tap">нажмите</span></> })}</span></div>
          <div className="fc-face fc-back">{fcAnswer(tr2(card.back))}{card.note && <span className="fc-note">{tr2(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped ? <div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>{tr2({ uz: "✗ Takrorlash", ru: "✗ Повторить" })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>{tr2({ uz: "✓ Bildim", ru: "✓ Знаю" })}</button></div> : <p className="fc-hint">{tr2({ uz: "👆 Kartani bosing — javobni ko'rasiz", ru: "👆 Нажмите на карточку — увидите ответ" })}</p>}
    </div>;
}
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: "sflash", text: `O'zingizni sinab ko'ring. Har kartada bir savol — javobini o'ylang, keyin kartani bosing.`, trigger: "on_mount", waits_for: null }]);
  useEffect4(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  return <Stage eyebrow={{ uz: "Takrorlash", ru: "Повторение" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={false} label={{ uz: "Yakunlash →", ru: "Завершить →" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={AI_FLASHCARDS} /></div>
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
  const RECAP = [tr2({ uz: "AI tezlik beradi — sifatni siz ta'minlaysiz", ru: "AI даёт скорость — качество обеспечиваете вы" }), tr2({ uz: "Yaxshi prompt = 4 ingredient: mavzu, uslub, rang, qismlar", ru: "Хороший промпт = 4 ингредиента: тема, стиль, цвет, части" }), tr2({ uz: "Yomon prompt = bo'sh natija; aniq prompt = chiroyli natija", ru: "Плохой промпт = пустой результат; точный промпт = красивый результат" }), tr2({ uz: "Iteratsiya — qayta so'rab natijani yaxshilash", ru: "Итерация — улучшать результат повторным запросом" }), tr2({ uz: "Doim tekshiring — AI xato qilishi mumkin", ru: "Всегда проверяйте — AI может ошибаться" })];
  const HOMEWORK = [{ b: tr2({ uz: "Antigravity'da", ru: "В Antigravity" }), t: tr2({ uz: "— 4-ingredientli buyruq bilan bitta promo sahifa qurdiring", ru: "— постройте одну промо-страницу командой из 4 ингредиентов" }) }, { b: tr2({ uz: "Iteratsiya", ru: "Итерация" }), t: tr2({ uz: "— natijani kamida 2 marta qayta so'rab yaxshilang", ru: "— улучшите результат минимум 2 повторными запросами" }) }, { b: tr2({ uz: "Tekshiring", ru: "Проверьте" }), t: tr2({ uz: "— so'raganingiz chiqdimi? Ortiqcha narsa yo'qmi?", ru: "— вышло ли то, что просили? Нет ли лишнего?" }) }];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return <Stage eyebrow={{ uz: "Tayyor", ru: "Готово" }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Yakunlash ✓", ru: "Завершить ✓" })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr2({ uz: "2-praktika tugadi", ru: "Практика 2 завершена" })}</span><h2 className="title h-title fade-up d1">{tr2({ uz: <>Endi AI bilan <span className="italic" style={{ color: T.accent }}>tez va sifatli</span> sayt qura olasiz</>, ru: <>Теперь вы можете строить с AI сайты <span className="italic" style={{ color: T.accent }}>быстро и качественно</span></> })}</h2>{
    /* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */
  }</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark stats={false} disabled={studentWait} liveOn={studentLive} onClick={studentWait ? void 0 : openArena} hint={studentWait ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : void 0} />
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "Uyga vazifa", ru: "Домашнее задание" })}</div><p className="body" style={{ margin: "0 0 10px", color: T.ink }}>{tr2({ uz: "Antigravity bilan mashq qiling:", ru: "Потренируйтесь с Antigravity:" })}</p><ul>{HOMEWORK.map((h, i) => <li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>)}</ul><p className="hw-note">{tr2({ uz: "Esda tuting: AI tezlik beradi — sifatni siz ta'minlaysiz.", ru: "Помните: AI даёт скорость — качество обеспечиваете вы." })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr2({ uz: "Nishonlaringiz", ru: "Ваши награды" })} — {achievements ? achievements.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
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
var Q_LABELS = { 4: { uz: "1 — Yaxshi prompt", ru: "1 — Хороший промпт" }, 7: { uz: "2 — Eng yaxshi buyruq", ru: "2 — Лучшая команда" }, 9: { uz: "3 — Iteratsiya", ru: "3 — Итерация" }, 15: { uz: "4 — To'liq buyruq", ru: "4 — Полная команда" } };
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
var INLINE_KEYS = { s4: 0, s7: 1, s9: 2, s15: -1 };
var ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  useAudio([{ id: "s15b", text: "Mana natijalar! Kim g'olib bo'ldi — reyting va podiumni ko'ring.", trigger: "on_mount", waits_for: null }]);
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
  return <Stage eyebrow={{ uz: "Natijalar", ru: "Результаты" }} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: "Davom etish", ru: "Продолжить" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.", ru: "Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉." })}</p></div>
          </div> : !loaded2 ? <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr2({ uz: "Natijalar yuklanmoqda…", ru: "Результаты загружаются…" })}</p> : board.length === 0 ? <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: "К этой сессии пока никто не подключился." })}</p></div> : <>
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
              <div className="card-lbl" style={{ color: T.accent }}>🏆 {tr2({ uz: "To'liq reyting", ru: "Полный рейтинг" })}</div>
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
              <div className="card-lbl" style={{ color: T.blue }}>📊 {tr2({ uz: "Savollar bo'yicha", ru: "По вопросам" })}</div>
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
              {live.mode === "mentor" && <p className="small" style={{ margin: "10px 0 0", color: T.ink2 }}>{tr2({ uz: "⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.", ru: "⚠️ — вопросы, на которых класс споткнулся. Рекомендуется объяснить ещё раз." })}</p>}
            </div>
          </>}
      </div>
    </Stage>;
};
var ACHIEVEMENTS = {
  prompt: { icon: "🎯", name: "Prompt Pro", desc: { uz: "Yaxshi promptni yomonidan ajratdingiz", ru: "Вы отличили хороший промпт от плохого" } },
  best: { icon: "🏆", name: "Best Brief", desc: { uz: "Eng aniq buyruqni tanladingiz", ru: "Вы выбрали самую точную команду" } },
  iterate: { icon: "🔁", name: "Iterator", desc: { uz: "Iteratsiya bilan natijani yaxshiladingiz", ru: "Вы улучшили результат итерацией" } },
  builder: { icon: "🚀", name: "Ship It!", desc: { uz: "O'z promo saytingizni qurib nashr qildingiz", ru: "Вы построили и опубликовали свой промо-сайт" } }
};
var ACH_TRIGGERS = { s4: "prompt", s7: "best", s9: "iterate" };
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
var QUIZ_MS = 15e3;
var QUIZ_BASE_IDX = 100;
var QUIZ_COLORS = ["#FF5A2C", "#0FA6D6", "#F5A623", "#22A05C"];
var QUIZ_SHAPES = ["▲", "◆", "●", "■"];
var QZ_BG_SHAPES = [
  { ch: "prompt", l: 6, t: 18, s: 30, c: "rgba(203,173,255,0.16)", d: 19, dl: 0 },
  { ch: { uz: "mavzu", ru: "тема" }, l: 82, t: 12, s: 26, c: "rgba(203,173,255,0.13)", d: 23, dl: 1.5 },
  { ch: { uz: "uslub", ru: "стиль" }, l: 9, t: 74, s: 30, c: "rgba(255,110,70,0.15)", d: 27, dl: 0.8 },
  { ch: { uz: "rang", ru: "цвет" }, l: 76, t: 70, s: 26, c: "rgba(203,173,255,0.11)", d: 21, dl: 2.2 },
  { ch: { uz: "qismlar", ru: "части" }, l: 46, t: 86, s: 28, c: "rgba(203,173,255,0.14)", d: 25, dl: 1.1 },
  { ch: "deploy", l: 66, t: 24, s: 22, c: "rgba(80,200,255,0.14)", d: 17, dl: 0.4 },
  { ch: { uz: "iteratsiya", ru: "итерация" }, l: 22, t: 36, s: 22, c: "rgba(203,173,255,0.12)", d: 20, dl: 1.9 },
  { ch: "agent", l: 92, t: 46, s: 24, c: "rgba(120,235,175,0.13)", d: 24, dl: 1.3 },
  { ch: { uz: "sayt", ru: "сайт" }, l: 2, t: 46, s: 24, c: "rgba(203,173,255,0.10)", d: 26, dl: 2.6 }
];
var QUIZ_BANK = [
  { q: { uz: "Vibecoding'da asosiy qoida qaysi?", ru: "Главное правило вайбкодинга?" }, opts: [{ uz: "AI hammasini o'zi hal qiladi", ru: "AI сам всё решает" }, { uz: "Kod yozish shart emas", ru: "Писать код не обязательно" }, { uz: "AI tezlik beradi — sifatni siz ta'minlaysiz", ru: "AI даёт скорость — качество обеспечиваете вы" }, { uz: "Faqat ingliz tili kerak", ru: "Нужен только английский" }], correct: 2 },
  { q: { uz: "«Prompt» nima?", ru: "Что такое «промпт»?" }, opts: [{ uz: "Saytning rangi", ru: "Цвет сайта" }, { uz: "Internet brauzeri", ru: "Интернет-браузер" }, { uz: "Fayl kengaytmasi", ru: "Расширение файла" }, { uz: "AI'ga beriladigan buyruq/ko'rsatma", ru: "Команда/инструкция для AI" }], correct: 3 },
  { q: { uz: "Yaxshi promptning 4 ingredienti qaysi?", ru: "4 ингредиента хорошего промпта?" }, opts: [{ uz: "Mavzu, uslub, rang, qismlar", ru: "Тема, стиль, цвет, части" }, { uz: "Ism, yosh, shahar, maktab", ru: "Имя, возраст, город, школа" }, "HTML, CSS, JS, PHP", { uz: "Sarlavha, rasm, video, audio", ru: "Заголовок, картинка, видео, аудио" }], correct: 0 },
  { q: { uz: "«Menga sayt yasab ber» — bu qanaqa prompt?", ru: "«Сделай мне сайт» — какой это промпт?" }, opts: [{ uz: "Aniq va sifatli", ru: "Точный и качественный" }, { uz: "Loyqa — bo'sh natija beradi", ru: "Размытый — даст пустой результат" }, { uz: "Eng yaxshi variant", ru: "Лучший вариант" }, { uz: "To'liq 4 ingredientli", ru: "Полный, из 4 ингредиентов" }], correct: 1 },
  { q: { uz: "Yaxshi prompt yomonidan nimasi bilan farq qiladi?", ru: "Чем хороший промпт отличается от плохого?" }, opts: [{ uz: "Uzunroq bo'ladi", ru: "Он длиннее" }, { uz: "Faqat inglizcha", ru: "Только по-английски" }, { uz: "Aniq tafsilot beradi", ru: "Даёт точные детали" }, { uz: "Hech qanday farqi yo'q", ru: "Никакой разницы" }], correct: 2 },
  { q: { uz: "AI natijani birinchi urinishda yoqmasa, to'g'ri yo'l qaysi?", ru: "Результат AI с первого раза не понравился — правильный путь?" }, opts: [{ uz: "Tashlab ketish", ru: "Бросить" }, { uz: "Xafa bo'lish", ru: "Обидеться" }, { uz: "Qo'lda qayta yozish", ru: "Переписать руками" }, { uz: "Qayta, aniqroq so'rash (iteratsiya)", ru: "Попросить снова, точнее (итерация)" }], correct: 3 },
  { q: { uz: "«Iteratsiya» nima?", ru: "Что такое «итерация»?" }, opts: [{ uz: "Saytni o'chirish", ru: "Удалить сайт" }, { uz: "Qadam-baqadam qayta so'rab yaxshilash", ru: "Шаг за шагом улучшать повторными запросами" }, { uz: "Rasmni kesish", ru: "Обрезать картинку" }, { uz: "Domen sotib olish", ru: "Купить домен" }], correct: 1 },
  { q: { uz: "Promptdagi «uslub» ingredienti nimani belgilaydi?", ru: "Что задаёт ингредиент «стиль» в промпте?" }, opts: [{ uz: "Qanaqa sahifa (mavzu)", ru: "Какая страница (тема)" }, { uz: "Asosiy rang", ru: "Основной цвет" }, { uz: "Sahifa qanday ko'rinishda (zamonaviy/minimal)", ru: "Как выглядит страница (современно/минимал)" }, { uz: "Qaysi qismlar bo'lishi", ru: "Какие будут части" }], correct: 2 },
  { q: { uz: "AI yasagan saytni chiqargach eng muhim qadam?", ru: "AI выдал сайт — самый важный шаг после?" }, opts: [{ uz: "Darhol nashr qilish", ru: "Сразу опубликовать" }, { uz: "Faylni o'chirish", ru: "Удалить файл" }, { uz: "Hech nima qilmaslik", ru: "Ничего не делать" }, { uz: "Natijani tekshirish (xatosini topish)", ru: "Проверить результат (найти ошибку)" }], correct: 3 },
  { q: { uz: "Promo-landing sahifada odatda nima bo'ladi?", ru: "Что обычно есть на промо-лендинге?" }, opts: [{ uz: "Katta sarlavha, tavsif, tugma, kartalar", ru: "Большой заголовок, описание, кнопка, карточки" }, { uz: "Faqat bo'sh ekran", ru: "Только пустой экран" }, { uz: "Faqat matn fayli", ru: "Только текстовый файл" }, { uz: "Excel jadval", ru: "Таблица Excel" }], correct: 0 },
  { q: { uz: "«Ko'k rangli, zamonaviy o'yin promo — sarlavha, tugma, 3 karta» — bu prompt qanaqa?", ru: "«Синяя современная промо игры — заголовок, кнопка, 3 карточки» — какой это промпт?" }, opts: [{ uz: "Noaniq", ru: "Неточный" }, { uz: "4 ingredientli, aniq va yaxshi", ru: "Из 4 ингредиентов, точный и хороший" }, { uz: "Juda qisqa va foydasiz", ru: "Слишком короткий и бесполезный" }, { uz: "Faqat rang haqida", ru: "Только про цвет" }], correct: 1 },
  { q: { uz: "Nega AI'ga aniq buyruq berish muhim?", ru: "Почему важно давать AI точную команду?" }, opts: [{ uz: "AI miyani o'qiy olmaydi — aniq aytsangiz aniq natija", ru: "AI не читает мысли — скажете точно, получите точный результат" }, { uz: "Aniqlik natijaga ta'sir qilmaydi", ru: "Точность не влияет на результат" }, { uz: "AI faqat rasm chizadi", ru: "AI только рисует картинки" }, { uz: "Buyruq qancha qisqa, shuncha yaxshi", ru: "Чем короче команда, тем лучше" }], correct: 0 }
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
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className={`cs-tok ${i % 2 ? "back" : "front"}`} style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: `clamp(9px, ${Math.round(s.s * 0.4)}px, ${Math.round(s.s * 0.6)}px)`, "--d": `${s.d}s`, animationDelay: `-${s.dl * 3}s` }}>{tr2(s.ch)}</span>)}
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
          <span className="cs-hud-i">🏆 {tr2({ uz: "PODIUM", ru: "ПОДИУМ" })}</span>
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
    const TOK = ["prompt", "AI", ".uz", "<h1>", tr2({ uz: "sayt", ru: "сайт" }), "deploy", "CTA", tr2({ uz: "rang", ru: "цвет" })];
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
      if (!window.confirm(tr2({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: "Тест ещё не завершён — если закроете, ученики останутся ждать в арене.\nПотом можно вернуться в это же место через «⚔️ Продолжить».\n\nВсё равно закрыть?" }))) return;
    }
    onClose();
  };
  return <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{tr2(s.ch)}</span>)}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>

      {
    /* QUTQARUV: jonli dars tugadi — o'quvchi osilib qolmaydi, mashq rejimida davom etadi */
  }
      {classEnded && isStudent && !solo && phase !== "done" && <div className="qz-endnote fade-step">
          <span>{tr2({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "⚠️ Живой урок завершён — продолжите тест сами:" })}</span>
          <button className="qz-btn" onClick={startPractice}>📖 {tr2({ uz: "Mashq rejimida davom etish", ru: "Продолжить в режиме тренировки" })}</button>
        </div>}

      {
    /* ===== LOBBY ===== */
  }
      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr2({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают 🔥 бонус!" })}</p>
          {solo && isStudent && <p className="qz-sub" style={{ color: "#FFC94D" }}>📖 {tr2({ uz: "Mashq rejimi — o'z tezligingizda ishlaysiz, natija faqat sizga ko'rinadi.", ru: "Режим тренировки — работаете в своём темпе, результат виден только вам." })}</p>}
          {!solo && <div className="qz-lobby-players">
              {players.map((p) => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? "me" : ""}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr2({ uz: "O'quvchilar kutilmoqda…", ru: "Ждём учеников…" })}</span>}
            </div>}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl("q", 0)}>▶ {tr2({ uz: "Testni boshlash", ru: "Начать тест" })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">⏳ {tr2({ uz: "Mentor testni boshlashini kuting…", ru: "Ждите, пока ментор начнёт тест…" })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>▶ {tr2({ uz: "Boshlash", ru: "Старт" })}</button>}
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
          {my && !isMentor && !solo && <p className="qz-waitmsg">✔ {tr2({ uz: "Javob qabul qilindi — natijani kuting…", ru: "Ответ принят — ждите результат…" })}</p>}
          {isMentor && <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">✓ {tr2({ uz: "Hamma javob berdi!", ru: "Все ответили!" })}</span>}
              <button className="qz-btn" onClick={() => ctrl("r", qi)}>⏹ {tr2({ uz: "Natijani ochish", ru: "Открыть результат" })}</button>
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
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr2({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ""}</span></> : <span className="qz-res-t">{my ? tr2({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: "Ошибка — 0 баллов. Возьмёте на следующем! 💪" }) : tr2({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: "Время вышло — 0 баллов. Быстрее! ⏱" })}</span>}
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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr2({ uz: "🏁 Natijani ko'rish", ru: "🏁 Посмотреть результат" }) : tr2({ uz: "Keyingi →", ru: "Следующий →" })}</button>}
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
              <p className="qz-sub">{tr2({ uz: "ball", ru: "баллов" })} · {soloScore.ok}/{QUIZ_BANK.length} {tr2({ uz: "to'g'ri", ru: "верно" })}{soloScore.maxStreak >= 2 ? tr2({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · лучший стрик 🔥x${soloScore.maxStreak}` }) : ""}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ {tr2({ uz: "Qayta ishlash", ru: "Пройти ещё раз" })}</button>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ {tr2({ uz: "Testni qayta ishlash — mashq (jadvalga yozilmaydi)", ru: "Пройти тест ещё раз — тренировка (в таблицу не пишется)" })}</button>}
            </>}
          <button className="qz-btn ghost" onClick={closeArena}>{tr2({ uz: "Arenani yopish", ru: "Закрыть арену" })}</button>
        </div>}
    </div>;
}
var PRACTICE_AFTER = {
  12: { title: { uz: "O'z promo sahifangiz", ru: "Ваша промо-страница" }, brief: { uz: "O'quvchilar 4 ingredientli prompt bilan o'z promo saytini qurib, nashr qilishadi (deploy).", ru: "Ученики собирают промпт из 4 ингредиентов, строят свой промо-сайт и публикуют его (deploy)." } }
};
function PracticeLesson2({ lang: langProp, onFinished, liveToken }) {
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
  const [mentorPractice, setMentorPractice] = useState3(null);
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
  const practiceDone = (fromScreen) => {
    if (live && live.mode === "student") live.submitAnswer(PRACTICE_DONE_BASE + fromScreen, `practice-${fromScreen}`, 0, true, 0);
    earn("builder");
  };
  const recordAnswer = (idx, data) => {
    setAnswers((a) => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && _m.scored && _m.scope === "final" && data && data.correct && live.mode === "student") live.submitAnswer(idx, _m.id, 0, true, 0);
    if (_m && _m.scored && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]);
  };
  const reset = () => {
    progClear(LESSON_META.lessonId);
    setAnswers({});
    setScreen(0);
    setMentorPractice(null);
    startTimeRef.current = Date.now();
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
  useEffect4(() => {
    const entry = PRACTICE_AFTER[screen];
    if (entry && live.mode === "mentor") setMentorPractice({ ...entry, fromScreen: screen });
    else setMentorPractice(null);
  }, [screen, live.mode]);
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
      answers: SCREEN_META.map((_, i) => answers[i]).filter(Boolean),
      ...buildResultDetails({ lessonId: LESSON_META.lessonId, screenMeta: SCREEN_META, answers, earned, achievements: ACHIEVEMENTS, arenaBank: QUIZ_BANK })
    };
    if (typeof onFinished === "function") onFinished(payload);
  };
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenPodium, ScreenFlashcards, Screen16];
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
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

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

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); display: flex; align-items: center; justify-content: center; }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
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

        /* === USTABOT (robot-usta pufakchasi) === */
        .usta-bubble { display: flex; align-items: flex-start; gap: 9px; margin-top: 9px; padding: 10px 13px 10px 11px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 4px 14px 14px 14px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.2); transform-origin: 14px top; animation: usta-in 0.36s cubic-bezier(.34,1.42,.5,1); }
        /* Robot pufakcha — burchakdan (yuz tomonidan) yumshoq pop, engil overshoot; qo'pol emas */
        @keyframes usta-in { 0% { opacity: 0; transform: translateY(7px) scale(0.9); } 62% { opacity: 1; transform: translateY(-1px) scale(1.015); } 100% { opacity: 1; transform: none; } }
        .usta-bubble.usta-warn { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .usta-bubble.usta-sm { margin-top: 6px; padding: 7px 11px 7px 9px; }
        .usta-face { font-size: 20px; line-height: 1.1; flex-shrink: 0; filter: drop-shadow(0 1px 2px rgba(${T.shadowBase},0.25)); animation: usta-face-pop 0.44s cubic-bezier(.34,1.6,.4,1) 0.04s both; }
        /* Robot yuzi bir zumda "gapiradi" — juda kichik pop */
        @keyframes usta-face-pop { 0% { transform: scale(0.5) rotate(-14deg); } 60% { transform: scale(1.14) rotate(5deg); } 100% { transform: scale(1) rotate(0); } }
        .usta-sm .usta-face { font-size: 16px; }
        .usta-say { font-size: 13px; font-weight: 600; color: ${T.ink}; line-height: 1.35; }
        .usta-sm .usta-say { font-size: 12px; font-weight: 500; color: ${T.ink2}; }

        /* === LANDING DRAFT (so'zma-so'z literal render) === */
        /* Chip tanlanganda o'sha qism darhol emas — SILLIQ morflashadi: qiyshiqlik to'g'rilanadi,
           rang/romka/burchak yumshoq oqib o'zgaradi (sakrash yo'q). «Dubl» tuzatishi ham shu orqali oqadi. */
        .lp-live > div, .lp-live h3, .lp-live button, .lp-live span, .lp-live p { transition: background 0.5s ease, background-color 0.5s ease, border-radius 0.45s cubic-bezier(.4,0,.2,1), border-color 0.45s ease, transform 0.48s cubic-bezier(.34,1.15,.4,1), color 0.4s ease; }
        .lp-draft-badge { position: absolute; top: 7px; right: 7px; background: #12121a; color: #c6ff00; font-size: 10px; font-weight: 800; padding: 3px 7px; border-radius: 6px; transform: rotate(4deg); box-shadow: 0 3px 8px -3px rgba(0,0,0,0.4); }
        .lp-draft-empty { display: flex; flex-direction: column; align-items: center; gap: 4px; border: 2.5px dashed ${T.ink3}; border-radius: 8px; padding: 18px 12px; }
        .lp-draft-q { font-size: 30px; font-weight: 800; color: ${T.ink3}; line-height: 1; }
        .lp-draft-emptxt { font-size: 12px; color: ${T.ink3}; font-style: italic; }
        .lp-draft-notes { display: flex; flex-direction: column; gap: 4px; margin-top: 2px; }

        /* === QABUL AKTI (acceptance report) === */
        .accept-akt { background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 13px; padding: 12px 14px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); }
        .accept-akt.akt-happy { border-color: ${T.success}; background: ${T.successSoft}; }
        .akt-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .akt-title { font-family: 'Source Serif 4',serif; font-weight: 600; font-size: 14.5px; color: ${T.ink}; }
        .akt-client { font-size: 22px; line-height: 1; transition: transform 0.2s; }
        /* Mijoz 😕→🤩 bo'lganda kichik xursand pop (aynan qabul akti "happy" holatida) */
        .akt-happy .akt-client { transform: scale(1.15); animation: client-pop 0.5s cubic-bezier(.34,1.55,.4,1); }
        @keyframes client-pop { 0% { transform: scale(0.55) rotate(-14deg); } 55% { transform: scale(1.34) rotate(7deg); } 100% { transform: scale(1.15) rotate(0); } }
        /* F-0803-26: 4 band ikki ustunda — akt balandligi yarmiga tushadi va «Dubl 2» tugmasi
           ko'rish zonasida qoladi (11-ekran, F-0803-19 sinfi) */
        .akt-list { list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 5px 14px; }
        @media (max-width: 560px) { .akt-list { grid-template-columns: 1fr; } }
        .akt-list li { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; }
        .akt-mark { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; font-size: 11px; font-weight: 800; flex-shrink: 0; }
        .akt-ok { color: ${T.ink}; } .akt-ok .akt-mark { background: ${T.successSoft}; color: ${T.success}; }
        .akt-bad { color: ${T.ink2}; } .akt-bad .akt-mark { background: ${T.accentSoft}; color: ${T.accent}; }
        .akt-redo { margin-top: 11px; align-self: flex-start; }

        /* Harakat kamaytirilsa — yangi USTABOT/draft animatsiyalari tinch (faqat oniy fade, morf/pop yo'q) */
        @media (prefers-reduced-motion: reduce) {
          .usta-bubble { animation: acu-fade 0.25s ease both; transform: none; }
          .usta-face { animation: none; }
          .lp-live > div, .lp-live h3, .lp-live button, .lp-live span, .lp-live p { transition: none; }
          .akt-happy .akt-client { animation: none; transform: scale(1.15); }
        }

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
        .num-badge { width: 30px; height: 30px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 800; font-size: 14px; flex-shrink: 0; }

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

        /* === CODEBOX === */
        .codebox { background: ${CODE.bg}; border-radius: 12px; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: clamp(12.5px,1.6vw,14.5px); color: ${CODE.text}; line-height: 1.75; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.18); overflow-x: hidden; }
        .codebox > div { white-space: pre-wrap; word-break: break-word; }

        /* === TAGPILL / AI CARD === */
        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; }

        /* === BROWSER / SAYT PREVIEW === */
        .browser { background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px -10px rgba(${T.shadowBase},0.22); border: 1px solid rgba(167,166,162,0.25); }
        .browser-bar { display: flex; align-items: center; gap: 6px; padding: 9px 12px; background: #ECEAE4; }
        .browser-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .browser-url { margin-left: 8px; flex: 1; font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; background: ${T.paper}; border-radius: 6px; padding: 4px 10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .browser-body { padding: clamp(15px,2.6vw,22px); min-height: 150px; background: ${T.paper}; color: ${T.ink}; transition: background .35s ease, color .35s ease; }
        .browser-dark .browser-bar { background: #11151C; }
        .browser-dark .browser-body { background: #161E2B; color: #E8E5DD; }
        .browser-dark .browser-url { background: #0E141D; color: #7A8699; }

        /* === MINI-SAYT === */
        .site-card { display: flex; flex-direction: column; gap: 13px; align-items: flex-start; }
        .site-ava { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, ${T.accent}, #FF9B7D); display: flex; align-items: center; justify-content: center; font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 24px; color: #fff; flex-shrink: 0; text-transform: uppercase; }
        .site-name { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(17px,2.4vw,21px); }
        .site-btn { font-family: 'Manrope'; font-weight: 600; font-size: 14px; border: none; border-radius: 10px; padding: 9px 16px; cursor: pointer; background: ${T.ink}; color: ${T.paper}; transition: all .18s; }
        .site-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .site-btn:disabled { cursor: not-allowed; }
        .site-like { display: inline-flex; align-items: center; gap: 8px; background: ${T.accentSoft}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 16px; font-family: 'Manrope'; font-weight: 700; font-size: 15px; cursor: pointer; transition: transform .15s; }
        .site-like:active { transform: scale(.94); }
        .shake { animation: shake .36s ease; }
        @keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }

        /* === FLOW (Hodisa->Reaksiya->O'zgarish) === */
        .flow { display: flex; align-items: center; justify-content: center; gap: 5px; flex-wrap: wrap; }
        .flow-node { display: flex; align-items: center; gap: 5px; background: ${T.paper}; border-radius: 9px; padding: 6px 9px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: ${T.ink2}; transition: all .25s; opacity: .45; white-space: nowrap; }
        .flow-node.on { opacity: 1; background: ${T.accent}; color: #fff; transform: translateY(-2px); box-shadow: 0 8px 18px -6px rgba(255,79,40,0.4); }
        .flow-node .flow-n { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; background: rgba(167,166,162,0.3); font-family: 'JetBrains Mono'; font-weight: 700; font-size: 9.5px; flex-shrink: 0; }
        .flow-node.on .flow-n { background: rgba(255,255,255,0.3); }
        .flow-arrow { color: ${T.ink3}; font-size: 13px; }

        /* === PROMPT-QURUVCHI === */
        .chiprow { display: flex; flex-wrap: wrap; gap: 8px; }
        /* F-0803-26: guruh yorlig'i tugmalar bilan BIR qatorda — 4 guruh ekranga sig'adi */
        .pb-group { display: flex; align-items: center; gap: 10px; }
        .pb-glabel { flex: 0 0 auto; min-width: 58px; font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink2}; }
        /* quruvchi tugmalari biroz ixcham — 4 rang bitta qatorga sig'sin */
        .pb-group .chip { padding: 8px 12px; font-size: clamp(12.5px,1.4vw,14px); }
        @media (max-width: 560px) { .pb-group { flex-direction: column; align-items: flex-start; gap: 5px; } }
        .promptbox { background: ${T.paper}; border-radius: 12px; padding: 13px 15px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-size: clamp(13px,1.6vw,14.5px); line-height: 2; color: ${T.ink}; }
        .pb-slot { display: inline-flex; align-items: center; background: ${T.accentSoft}; color: ${T.accent}; font-weight: 700; border-radius: 6px; padding: 2px 8px; margin: 0 1px; animation: slot-pop 0.34s cubic-bezier(.34,1.45,.5,1); }
        @keyframes slot-pop { 0% { transform: scale(0.5); opacity: 0; } 55% { transform: scale(1.14); } 100% { transform: scale(1); opacity: 1; } }
        .pb-ph { display: inline-flex; align-items: center; border: 1.5px dashed ${T.ink3}; color: ${T.ink3}; border-radius: 6px; padding: 1px 8px; margin: 0 1px; font-style: italic; }

        /* === SPEED QUOTE (Screen1 qora karta — yangilangan) === */
        @keyframes quote-in { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes sheen { 0% { background-position: -60% 0; } 100% { background-position: 160% 0; } }
        @keyframes sq-underline { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .speed-quote { position: relative; overflow: hidden; border-radius: 16px; padding: clamp(20px,3.2vw,30px); text-align: center; background: radial-gradient(130% 150% at 50% -10%, #262A33 0%, #15171D 58%, #0B0C10 100%); box-shadow: 0 18px 44px -14px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.07); animation: quote-in 0.5s cubic-bezier(.34,1.2,.4,1); }
        .speed-quote::after { content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.08) 50%, transparent 62%); background-size: 220% 100%; animation: sheen 3.4s ease-in-out 0.7s infinite; pointer-events: none; }
        .speed-quote .sq-eyebrow { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin: 0 0 11px; position: relative; }
        .speed-quote .sq-text { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(18px,3vw,26px); line-height: 1.3; margin: 0; color: #F4F1EA; position: relative; }
        /* F-0803-26: reja-ekranida qoida yolg'iz qoldi — ustunni to'ldirib, markazda tursin */
        .speed-quote.sq-solo { display: flex; flex-direction: column; justify-content: center; min-height: 100%; padding: clamp(26px,4vw,44px); }
        .speed-quote.sq-solo .sq-text { font-size: clamp(21px,3.6vw,32px); }
        .sq-fast { color: ${T.accent}; font-style: italic; position: relative; text-shadow: 0 0 18px rgba(255,79,40,0.45); }
        .sq-fast::after { content: ''; position: absolute; left: 0; right: 0; bottom: -3px; height: 2px; background: ${T.accent}; border-radius: 2px; transform: scaleX(0); transform-origin: left; animation: sq-underline 0.5s cubic-bezier(.4,0,.2,1) forwards 0.55s; box-shadow: 0 0 10px ${T.accent}; }
        .sq-quality { color: #FFC56B; font-style: italic; text-shadow: 0 0 18px rgba(255,197,107,0.4); }

        /* === NATIJA REVEAL + "QURYAPTI" SKELETON === */
        @keyframes result-reveal { from { opacity: 0; transform: translateY(9px) scale(0.97); } to { opacity: 1; transform: none; } }
        .result-reveal { animation: result-reveal 0.42s cubic-bezier(.34,1.18,.5,1); }
        @keyframes bs-shimmer { 0% { background-position: 180% 0; } 100% { background-position: -180% 0; } }
        .build-skel { display: flex; flex-direction: column; gap: 11px; padding: 10px 2px; }
        .build-skel .bs-bar { height: 13px; border-radius: 7px; background: linear-gradient(90deg, #ECEAE4 25%, #FAF8F3 50%, #ECEAE4 75%); background-size: 200% 100%; animation: bs-shimmer 1.15s ease-in-out infinite; }
        .build-skel .bs-lg { height: 34px; border-radius: 10px; }
        .build-note { text-align: center; font-size: 11.5px; color: ${T.ink3}; margin: 6px 0 0; font-family: 'JetBrains Mono'; letter-spacing: 0.04em; }

        /* === EVENT KARTALAR === */
        .evt-card { display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer; border: none; border-radius: 12px; padding: 13px 15px; background: ${T.paper}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: all .18s; width: 100%; }
        .evt-card:hover { transform: translateY(-1px); }
        .evt-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22); }
        .evt-card .evt-name { font-family: 'Manrope'; font-weight: 600; font-size: 14px; color: ${T.ink}; }
        .evt-card .evt-hint { font-size: 12px; color: ${T.ink2}; }

        /* === IWATCH === */
        .iwatch { display: flex; align-items: baseline; gap: 9px; background: ${T.paper}; border-radius: 12px; padding: 12px 18px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .iwatch-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink3}; }
        .iwatch-eq { font-family: 'JetBrains Mono'; font-size: 18px; color: ${T.ink2}; }
        .iwatch-num { font-family: 'Fraunces', serif; font-size: clamp(34px,7vw,52px); color: ${T.accent}; line-height: 1; }

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

        /* === MOBIL POLISH (zichroq, toza, gorizontal toshmasin) === */
        @media (max-width: 640px) {
          .stage-content { padding-bottom: clamp(14px,3vw,22px); }
          .screen { gap: 13px; }
          .browser-body { min-height: 84px; padding: 14px 15px; }
          .codebox { font-size: 12.5px; line-height: 1.6; padding: 12px 13px; }
          .mentor-msg { padding: 11px 14px; }
          .site-ava { width: 46px; height: 46px; font-size: 21px; }
          .frame { padding: 15px 16px; }
          .split { gap: 14px; }
          .flow { gap: 4px; }
          .flow-node { padding: 6px 8px; }
        }

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

        /* backtick chip (fmtCode) — test/arena savol matnidagi kod bo'lagi */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        /* === ✍️ MENTOR PRAKTIKA OVERLAY === */
        .mp-overlay { position: fixed; inset: 0; z-index: 2000; background: ${T.bg}; display: flex; align-items: center; justify-content: center; padding: clamp(16px,3vw,34px); overflow: auto; }
        .mp-card { width: 100%; max-width: 640px; background: ${T.paper}; border-radius: 22px; padding: clamp(22px,3.4vw,36px); box-shadow: 0 24px 60px -24px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 14px; animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        .mp-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; }
        .mp-title { font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(22px,3.2vw,30px); color: ${T.ink}; margin: 0; line-height: 1.15; }
        .mp-brief { margin: 0; font-size: clamp(13.5px,1.8vw,15px); line-height: 1.55; color: ${T.ink2}; }
        .mp-flow { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin: 2px 0 4px; }
        .mp-step { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.06); border-radius: 99px; padding: 6px 13px; }
        .mp-step.cur { color: ${T.success}; background: ${T.successSoft}; }
        .mp-arr { color: ${T.ink3}; font-weight: 700; }
        .mp-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
        .mp-demo { flex: 1; min-width: 200px; padding: 14px 20px; border: none; border-radius: 14px; background: ${T.ink}; color: ${T.paper}; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.4); transition: transform 0.15s; }
        .mp-demo:hover { transform: translateY(-2px); }
        .mp-next { flex: 1; min-width: 160px; padding: 14px 20px; border: 1.5px solid rgba(${T.shadowBase},0.16); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.15s; }
        .mp-next:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .mp-tip { margin: 2px 0 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink3}; }

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
        /* Quizlet uslubi: karta rangli muhr bilan chapga (✗ qizil) / o'ngga (✓ yashil) uchib ketadi */
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
        /* Aylanuvchi nur burjlari (butun ekran) */
        .acu-rays { position: absolute; top: 50%; left: 50%; width: 170vmax; height: 170vmax; transform: translate(-50%,-50%); pointer-events: none;
          background: repeating-conic-gradient(from 0deg, rgba(255,201,77,0.16) 0deg 7deg, transparent 7deg 20deg);
          -webkit-mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%); mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%);
          animation: acu-spin 16s linear infinite, acu-fade 0.6s ease-out; }
        @keyframes acu-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes acu-fade { from { opacity: 0; } to { opacity: 1; } }
        /* Markaziy yorug'lik */
        .acu-glow { position: absolute; top: 42%; left: 50%; width: 78vmin; height: 78vmin; transform: translate(-50%,-50%); pointer-events: none; filter: blur(4px);
          background: radial-gradient(circle, rgba(255,224,150,0.62) 0%, rgba(255,150,60,0.30) 38%, rgba(255,120,40,0) 68%);
          animation: acu-glow-pulse 2.2s ease-in-out infinite, acu-fade 0.5s ease-out; }
        @keyframes acu-glow-pulse { 0%,100% { opacity: 0.85; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08); } }
        /* Zarba to'lqini (halqa) */
        .acu-ring { position: absolute; top: 42%; left: 50%; width: 130px; height: 130px; border-radius: 50%; border: 3px solid rgba(255,240,200,0.85); transform: translate(-50%,-50%) scale(0.3); pointer-events: none; animation: acu-shock 1s cubic-bezier(.2,.7,.3,1) forwards; }
        .acu-ring.d2 { border-color: rgba(255,180,90,0.6); animation-delay: 0.22s; }
        @keyframes acu-shock { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.9; } 100% { transform: translate(-50%,-50%) scale(6.5); opacity: 0; } }
        /* Sahna (medal + matn) */
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
        /* Yuqori paneldagi nishon hisoblagichi */
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

        /* ===== ⚡ CODESTRIKE — CTA (dars ichida) ===== */
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

        /* ===== ⚡ ARENA — issiq CoddyCamp muhiti ===== */
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
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={{ uz: "Praktika", ru: "Практика" }} /> : <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onPracticeDone={practiceDone} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== "mentor" && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts((t) => t.filter((x) => x.k !== k))} />}
              {mentorPractice && <MentorPracticeOverlay entry={mentorPractice} live={live} onClose={() => {
    setMentorPractice(null);
    next();
  }} />}
            </>}
        </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>;
}
export {
  PracticeLesson2 as default
};
