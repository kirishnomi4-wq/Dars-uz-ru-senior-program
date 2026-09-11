// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/4a-Modull/NestArchPracticeLesson.jsx
//  Kompilyator: yo'q (dars uni import qilmaydi)
//  Qayta yig'ish:  node scripts/build-lms.mjs src/4a-Modull/NestArchPracticeLesson.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/4a-Modull/NestArchPracticeLesson.jsx
import React3, { useState as useState3, useEffect as useEffect4, useRef as useRef3, createContext as createContext2, useContext as useContext2, useCallback as useCallback2 } from "react";

// src/live/liveClient.js
var LIVE_API_URL = "https://dars-api.coddycamp.uz" ? String("https://dars-api.coddycamp.uz").replace(/\/+$/, "") : DEFAULT_API_URL;
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
  return new Error(msg || fallback);
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
    } catch {
      setJoinError(tr({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: "Неверный код ментора или ошибка подключения." }));
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
var _liveBadgeS = { position: "fixed", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 9998, background: LT.paper, border: `1px solid ${LT.ink3}55`, borderRadius: 99, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: LT.ink2, boxShadow: "0 2px 10px rgba(58,53,48,0.12)", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", maxWidth: "92vw" };
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

// src/4a-Modull/NestArchPracticeLesson.jsx
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
  amber: "#B45309",
  amberSoft: "#FBEBD8",
  nest: "#E0234E",
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
var ou = (o) => o && o.uz || o;
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
var LESSON_META = { lessonId: "nest-arch-practice-4a-03-v18", lessonTitle: { uz: "Praktika — KitobShop backend", ru: "Практика — бэкенд KitobShop" } };
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
  { id: "s4", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s5", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s6", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s7", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s8", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s9", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s10", type: "case", template: "custom", scored: false, scope: null },
  // PickLines challenge (nishon: shelf)
  { id: "s11", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s12", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s13", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s14", type: "case", template: "custom", scored: false, scope: null },
  { id: "s15", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s16", type: "case", template: "custom", scored: false, scope: null },
  { id: "s17", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s19", type: "case", template: "custom", scored: false, scope: null },
  // Audit challenge — yolg'on da'vo (nishon: owner)
  { id: "spf", type: "practice", template: "custom", scored: false, scope: null },
  { id: "spod", type: "stats", template: "custom", scored: false, scope: null },
  { id: "sflash", type: "flashcards", template: "custom", scored: false, scope: null },
  { id: "s20", type: "summary", template: "custom", scored: false, scope: null }
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
    const isControl = tgt && tgt.closest && tgt.closest("button, input, a, .vcard, .option, .hook-option, .swg-row, .tree-row, .pick-row, .bk, .sh, .cl-row, .lg-card");
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
var NavNext = ({ disabled, label = { uz: "Davom etish", ru: "Продолжить" }, onClick, optionalLive }) => {
  const gate = useContext2(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === "student" && live.status !== "ended" && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr2({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Ментор ещё не перешёл на эту страницу" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Подождите ментора" }) : freeRide && disabled ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2(label)}</button>;
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
  5: {
    title: { uz: "Tekshiruvchi — AI yozgach nima qilamiz", ru: "Проверяющий — что делать после кода от ИИ" },
    cards: [
      { ic: "📋", h: { uz: "Uch ish: rejalashtir, yo'naltir, tekshir", ru: "Три дела: планируй, направляй, проверяй" }, body: { uz: <>Avval <b>reja</b> tuzasiz (qaysi resurs, qaysi ustun), keyin agentga <b>aniq buyruq</b> berasiz, so'ng natijani <b>tekshirasiz</b>. Uchinchisi tushib qolsa — xato sizniki bo'lib qoladi.</>, ru: <>Сначала вы составляете <b>план</b> (какой ресурс, какие колонки), затем даёте агенту <b>чёткую команду</b>, а после <b>проверяете</b> результат. Пропустите третий шаг — и ошибка станет вашей.</> }, vis: <RcFlow items={[{ uz: "Rejalashtir", ru: "Планируй" }, { uz: "Yo'naltir", ru: "Направляй" }, { uz: "Tekshir", ru: "Проверяй" }]} /> },
      { ic: "🧾", h: { uz: "5 fayl — bitta resurs", ru: "5 файлов — один ресурс" }, body: { uz: <>Har resurs: <span className="mono">entity</span> (javon chizmasi), <span className="mono">dto</span> (anketa), <span className="mono">service</span> (omborchi), <span className="mono">controller</span> (sotuvchi), <span className="mono">module</span> (bo'lim). Beshtasi ham bormi — birinchi tekshiruv shu.</>, ru: <>У каждого ресурса: <span className="mono">entity</span> (чертёж стеллажа), <span className="mono">dto</span> (анкета), <span className="mono">service</span> (кладовщик), <span className="mono">controller</span> (продавец), <span className="mono">module</span> (отдел). Все пять на месте? — это первая проверка.</> }, vis: <RcFlow items={["entity", "dto", "service", "controller", "module"]} sep="·" /> },
      { ic: "🚪", h: { uz: "Kirish taxtasi — 404 sababi", ru: "Входная вывеска — причина 404" }, body: { uz: <>Bo'lim <span className="mono">AppModule.imports</span> ga yozilmasa, u restoranning kirish taxtasida yo'q — <b>mijoz eshikni topa olmaydi</b> (<span className="mono">404</span>). Swagger'da ko'rinyaptimi — shuni tekshiring.</>, ru: <>Если отдел не вписан в <span className="mono">AppModule.imports</span>, его нет на входной вывеске ресторана — <b>клиент не найдёт дверь</b> (<span className="mono">404</span>). Проверьте, виден ли он в Swagger.</> }, ask: { uz: "AI kod yozib berdi. Birinchi navbatda nimani tekshirasiz?", ru: "ИИ написал код. Что вы проверите в первую очередь?" } }
    ]
  },
  8: {
    title: { uz: "Eshik va qo'riqchi — public vs admin", ru: "Дверь и страж — public vs admin" },
    cards: [
      { ic: "🛡️", h: { uz: "Qo'riqchi = @UseGuards", ru: "Страж = @UseGuards" }, body: { uz: <><span className="mono">@UseGuards(AuthGuard, RolesGuard)</span> — eshikka qo'riqchi qo'yadi. <span className="mono">AuthGuard</span> tokenni tekshiradi, <span className="mono">RolesGuard</span> — rolni.</>, ru: <><span className="mono">@UseGuards(AuthGuard, RolesGuard)</span> — ставит у двери стража. <span className="mono">AuthGuard</span> проверяет токен, <span className="mono">RolesGuard</span> — роль.</> }, vis: <RcFlow items={[{ uz: "so'rov", ru: "запрос" }, { uz: "qo'riqchi", ru: "страж" }, "controller"]} /> },
      { ic: "🔑", h: { uz: "@Roles — qo'riqchining ro'yxati", ru: "@Roles — список у стража" }, body: { uz: <>🌐 <span className="mono">@Roles('public')</span> — hamma kiradi. 🔒 <span className="mono">@Roles(UserRole.ADMIN)</span> — faqat admin. Ro'yxatni <b>siz</b> yozasiz, qo'riqchi shuni bajaradi.</>, ru: <>🌐 <span className="mono">@Roles('public')</span> — входят все. 🔒 <span className="mono">@Roles(UserRole.ADMIN)</span> — только админ. Список пишете <b>вы</b>, а страж его исполняет.</> } },
      { ic: "🚫", h: { uz: "403 — qo'riqchi rad etdi", ru: "403 — страж отказал" }, body: { uz: <>Token yo'q bo'lsa — <span className="mono">401</span>. Token bor, lekin rol yetmasa — <span className="mono">403</span>. Ikkalasi ham «kirmaysiz» degani; server o'chmaydi.</>, ru: <>Нет токена — <span className="mono">401</span>. Токен есть, но роли не хватает — <span className="mono">403</span>. Оба значат «вход закрыт»; сервер при этом не падает.</> }, ask: { uz: "Oddiy mijoz POST /book qilsa nima bo'ladi?", ru: "Что будет, если обычный клиент сделает POST /book?" } }
    ]
  },
  12: {
    title: { uz: "findAll + where — tayyor retsept kitobi", ru: "findAll + where — готовая книга рецептов" },
    cards: [
      { ic: "📕", h: { uz: "BaseService — tayyor retsept kitobi", ru: "BaseService — готовая книга рецептов" }, body: { uz: <>Service <span className="mono">BaseService</span> ni <b>meros oladi</b> (ya'ni tayyor retsept kitobini qo'liga oladi) — shu zahoti <span className="mono">create / findAll / update / remove</span> tekin keladi. Ularni qaytadan yozmaysiz.</>, ru: <>Сервис <b>наследует</b> <span className="mono">BaseService</span> (то есть берёт в руки готовую книгу рецептов) — и сразу бесплатно получает <span className="mono">create / findAll / update / remove</span>. Заново их писать не нужно.</> }, vis: <RcFlow items={["BaseService", "findAll", "create"]} sep="·" /> },
      { ic: "🔎", h: { uz: "where — shart", ru: "where — условие" }, body: { uz: <>Maxsus endpoint uchun yangi CRUD yozmaysiz: <span className="mono">findAll({"{ where: { is_featured: true } }"})</span> — faqat shart berasiz.</>, ru: <>Для особого эндпоинта новый CRUD не пишут: <span className="mono">findAll({"{ where: { is_featured: true } }"})</span> — вы лишь передаёте условие.</> } },
      { ic: "🏷️", h: { uz: "relations — yorliqni ham olib kelish", ru: "relations — принести и ярлык" }, body: { uz: <><span className="mono">findAll({"{ relations: { category: true } }"})</span> — kitob bilan birga uning yorlig'i (kategoriyasi) ham qaytadi.</>, ru: <><span className="mono">findAll({"{ relations: { category: true } }"})</span> — вместе с книгой вернётся и её ярлык (категория).</> }, ask: { uz: "Faqat top kitoblarni qanday qaytaramiz?", ru: "Как вернуть только топ-книги?" } }
    ]
  },
  15: {
    title: { uz: "Debug — qo'riqchiga noto'g'ri ro'yxat", ru: "Дебаг — стражу дали не тот список" },
    cards: [
      { ic: "🧍", h: { uz: "Mijozni o'z do'koningizga kiritmaslik", ru: "Не пускать клиента в собственный магазин" }, body: { uz: <>Agent <span className="mono">POST /order</span> ga <span className="mono">@Roles(ADMIN)</span> qo'yib ketgan. Natija: <b>mijoz buyurtma bera olmaydi</b> — 403. Ochilish kuni, buyurtma yo'q.</>, ru: <>Агент оставил на <span className="mono">POST /order</span> декоратор <span className="mono">@Roles(ADMIN)</span>. Итог: <b>клиент не может оформить заказ</b> — 403. День открытия — а заказов нет.</> }, vis: <RcFlow items={[{ uz: "mijoz", ru: "клиент" }, "POST /order", "403"]} /> },
      { ic: "🔍", h: { uz: "Dalil avval, kod keyin", ru: "Сначала улики, потом код" }, body: { uz: <>Avval <b>ikki rolda</b> eshikni sinaysiz (🧍 mijoz / 🔑 admin), dalil jadvalini to'ldirasiz — <b>keyin</b> kodni ochasiz. Xato qatorni dalil ko'rsatadi.</>, ru: <>Сначала вы пробуете дверь <b>в двух ролях</b> (🧍 клиент / 🔑 админ) и заполняете таблицу улик — и <b>только потом</b> открываете код. Улики сами укажут на строку с ошибкой.</> } },
      { ic: "🔧", h: { uz: "Faqat o'sha qator tuzatiladi", ru: "Правится только эта строка" }, body: { uz: <>Guard'ni butunlay o'chirmaysiz (u holda admin eshiklari ham ochilib qoladi). Faqat <span className="mono">POST /order</span> ni <span className="mono">@Roles('public')</span> qilasiz.</>, ru: <>Стража целиком не убирают (иначе распахнутся и админские двери). Вы лишь меняете <span className="mono">POST /order</span> на <span className="mono">@Roles('public')</span>.</> }, ask: { uz: "Mijoz buyurtma berolsin desak, qatorni qanday tuzatamiz?", ru: "Как исправить строку, чтобы клиент мог оформить заказ?" } }
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
      {!reveal && answered > 0 && <p className="mstats-hidden">{tr2({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: "🙈 Кто что выбрал и число ✅/❌ скрыты — по кнопке «Открыть результат» всё появится сразу и у вас, и на экранах учеников." })}</p>}
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
              <p className="mstats-verdict-t">{tr2({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Верно только у <b>{pct}%</b> — класс эту тему не понял. Перед тем как идти дальше, стоит коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr2({ uz: "📖 Qayta tushuntirish", ru: "📖 Повторное объяснение" })} — {tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === "maybe" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr2({ uz: "📖 Qisqa takrorlash", ru: "📖 Короткое повторение" })}</button>}
            </>}
            {level === "good" && <p className="mstats-verdict-t">{tr2({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr2({ uz: "⏳ Kutilmoqda:", ru: "⏳ Ждём:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">{tr2({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Yana bir bor tushuntiring.", ru: "⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Стоит объяснить её ещё раз." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr2({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь вживую…" })}</p>}
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
var QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev, tip }) => {
  const gate = useContext2(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === "student");
  const isMentorLive = !!(live && live.mode === "mentor");
  const mountTs = useRef3(Date.now());
  const [picked, setPicked] = useState3(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState3(storedAnswer ? storedAnswer.solved ?? storedAnswer.picked === correctIdx : false);
  const { tip: _tip, rescue: _resc } = useStuckValve(solved, picked === null ? -1 : picked);
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
  return <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved && !_resc} label={isMentorLive ? mReveal ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval natijani oching", ru: "Сначала откройте результат" }) : solved ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : _resc ? tr2({ uz: "Javobni birga ko'ramiz →", ru: "Разберём ответ вместе →" }) : oneShot ? tr2({ uz: "Javob tanlang", ru: "Выберите ответ" }) : tr2({ uz: "To'g'ri javobni toping", ru: "Найдите правильный ответ" })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? "flex-start" : "center", gap: "clamp(16px,2.5vw,24px)" }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: "-8px 0 0", color: T.accent, fontWeight: 600 }}>{tr2({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: "⚡ Живой урок — одна попытка, подумайте перед нажатием!" })}</p>}
        <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 11 }}>
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
    return <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: "clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)", fontSize: "clamp(15px,1.85vw,17px)", display: "flex", alignItems: "center", gap: 12 }}>
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
            {isMentorLive ? fmtCode(tr2(explainCorrect)) : waiting ? tr2({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: "Сейчас узнаете правильный ответ." }) : wrongLocked ? fmtCode(tr2(explainWrong[picked] ?? explainWrong.default)) : solved ? fmtCode(tr2(explainCorrect)) : fmtCode(tr2(explainWrong[picked] ?? explainWrong.default))}
          </p>
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr2({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "📖 Короткое повторение — взглянуть на тему ещё раз" })}</button>}
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
        {_tip && !solved && tip && <p className="bhint fade-step">{tr2(tip)}</p>}
        {_resc && !solved && <p className="bhint calm fade-step">{tr2({ uz: "Bu savolni keyinroq birga ko'rib chiqamiz — hozir davom etsangiz bo'ladi.", ru: "Этот вопрос разберём вместе позже — сейчас можно продолжить." })}</p>}
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
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">{tr2({ uz: "to'g'ri javob", ru: "правильных ответов" })}</div></div>
    </div>;
}
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
var Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
var At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
var St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
var Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: "italic" }}>{children}</span>;
var CodeFile = ({ name, children, minH }) => <div className="editor">
    <div className="editor-bar"><span className="bb-dots"><i /><i /><i /></span><span className="editor-tab">{name}</span></div>
    <div className="editor-body" style={{ minHeight: minH }}><pre className="editor-code">{children}</pre></div>
  </div>;
var AgentCard = ({ children, title = { uz: "💬 Agentni shunday yo'naltiring", ru: "💬 Направьте агента так" } }) => <div className="agent-card"><span className="agent-lbl">{tr2(title)}</span><p className="agent-msg">{children}</p></div>;
var M_COLOR = { GET: T.blue, POST: T.success, PATCH: T.amber, DELETE: T.danger };
var SHOP_EPS = [
  { m: "POST", path: "/category", lock: true, sum: { uz: "Kategoriya qo'shish", ru: "Добавить категорию" }, resp: '{ "statusCode": 201, "data": { "id": "ct1...", "name": "Detektiv" } }' },
  { m: "GET", path: "/category", lock: false, sum: { uz: "Kategoriyalar", ru: "Категории" }, resp: '{ "statusCode": 200, "data": [ { "name": "Detektiv" }, { "name": "Ilmiy" } ] }' },
  { m: "POST", path: "/book", lock: true, sum: { uz: "Kitob qo'shish", ru: "Добавить книгу" }, resp: '{ "statusCode": 201, "data": { "title": "Sherlok Holms", "price": 45000 } }' },
  { m: "GET", path: "/book", lock: false, sum: { uz: "Barcha kitoblar", ru: "Все книги" }, resp: '{ "statusCode": 200, "data": [ { "title": "Sherlok Holms", "author": "Doyl", "price": 45000 } ] }' },
  { m: "GET", path: "/book/featured", lock: false, sum: { uz: "⭐ Top kitoblar", ru: "⭐ Топ-книги" }, resp: '{ "statusCode": 200, "data": [ { "title": "Sherlok Holms", "is_featured": true } ] }' },
  { m: "POST", path: "/order", lock: false, sum: { uz: "Buyurtma berish", ru: "Оформить заказ" }, resp: '{ "statusCode": 201, "data": { "bookId": "bk1...", "quantity": 2 } }' },
  { m: "GET", path: "/order", lock: true, sum: { uz: "Buyurtmalar", ru: "Заказы" }, resp: '{ "statusCode": 200, "data": [ { "customer_name": "Ali", "quantity": 2 } ] }' }
];
var ShopSwagger = ({ eps = SHOP_EPS, openId, onToggle, triedIds, onTry }) => <div className="swg">
    <div className="swg-top"><span className="swg-dot" /> KitobShop API <span className="swg-ver">/api/v1</span></div>
    {eps.map((e) => {
  const id = e.m + e.path;
  const open = openId === id;
  const tried = triedIds.has(id);
  return <div key={id} className="swg-row">
          <button className={`swg-head ${!tried && !open ? "tap-hint" : ""}`} onClick={() => onToggle(id)}>
            <span className="swg-m" style={{ background: M_COLOR[e.m] }}>{e.m}</span>
            <span className="swg-path">{e.path}</span>
            <span className="swg-sum">{tr2(e.sum)}</span>
            <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <span title={e.lock ? tr2({ uz: "faqat admin", ru: "только админ" }) : tr2({ uz: "ochiq", ru: "открыто" })} style={{ fontSize: 12 }}>{e.lock ? "🔒" : "🌐"}</span>
              <span className="swg-chev">{open ? "▾" : "▸"}</span>
            </span>
          </button>
          {open && <div className="swg-detail el-in">
              {!tried ? <button className="btn-soft" onClick={() => onTry(id)} style={{ alignSelf: "flex-start" }}>▶ Try it out</button> : <><div className="swg-code-lbl">{tr2({ uz: "Javob", ru: "Ответ" })} · <span style={{ color: T.success }}>{e.m === "POST" ? "201" : "200"}</span></div><pre className="json">{e.resp}</pre></>}
            </div>}
        </div>;
})}
  </div>;
var PickLines = ({ fileName, scaffoldTop, scaffoldBottom, candidates, agent, instruction, onComplete, completedInit }) => {
  const correct = candidates.filter((c) => c.correct);
  const [picked, setPicked] = useState3(() => completedInit ? new Set(correct.map((c) => c.id)) : /* @__PURE__ */ new Set());
  const [shakeId, setShakeId] = useState3(null);
  const [why, setWhy] = useState3(null);
  const done = correct.every((c) => picked.has(c.id));
  const fired = useRef3(false);
  useEffect4(() => {
    if (done && !fired.current) {
      fired.current = true;
      onComplete && onComplete();
    }
  }, [done]);
  const tap = (c) => {
    if (picked.has(c.id) || done) return;
    if (c.correct) {
      setPicked((p) => {
        const s = new Set(p);
        s.add(c.id);
        return s;
      });
      setWhy(null);
    } else {
      setShakeId(c.id);
      setWhy(c.why);
      setTimeout(() => setShakeId((x) => x === c.id ? null : x), 450);
    }
  };
  const pickedCorrect = correct.filter((c) => picked.has(c.id));
  return <Zoomable>
    <div className="split">
      <Col>
        <p className="flow-label">{fileName}</p>
        <CodeFile name={fileName} minH={120}>
          {scaffoldTop}{"\n"}
          {pickedCorrect.length === 0 ? <span className="line-empty">{"  " + tr2({ uz: "// qatorlarni o'ng tomondan tanlang →", ru: "// выберите строки справа →" })}</span> : pickedCorrect.map((c, i) => <React3.Fragment key={c.id}>{i > 0 ? "\n" : ""}{"  "}{c.node}</React3.Fragment>)}
          {"\n"}{scaffoldBottom}
        </CodeFile>
        {agent && <AgentCard>{tr2(agent)}</AgentCard>}
      </Col>
      <Col>
        <p className="flow-label">{tr2(instruction) || tr2({ uz: "Shu faylga tegishli qatorlarni tanlang", ru: "Выберите строки, относящиеся к этому файлу" })}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {candidates.map((c) => <button key={c.id} className={`pick-row ${picked.has(c.id) ? "picked" : ""} ${shakeId === c.id ? "shake" : ""}`} disabled={picked.has(c.id)} onClick={() => tap(c)}>
              <span style={{ flex: 1 }}>{c.label}</span>
              <span className="pick-plus">{picked.has(c.id) ? "✓" : "+"}</span>
            </button>)}
        </div>
        {why && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2(why)}</p></div>}
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "✓ Fayl tayyor — har qator o'z joyida.", ru: "✓ Файл готов — каждая строка на своём месте." })}</p></div>}
      </Col>
    </div>
    </Zoomable>;
};
var FileGen = ({ files, running, n }) => <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
    {files.map((file, i) => {
  const ready = i < n;
  const active = running && i === n;
  if (!ready && !active) return <div key={i} className="gen-file" style={{ opacity: 0.4 }}><span className="gen-ico">·</span><span className="mono" style={{ flex: 1 }}>{file.f}</span></div>;
  return <div key={i} className={`gen-file ${ready ? "ready" : ""} el-in`}>
          <span className="gen-ico" style={{ color: ready ? T.success : T.amber }}>{ready ? "✓" : "⏳"}</span>
          <span className="mono" style={{ flex: 1 }}>{file.f}</span>
          <span className="gen-d">{ready ? tr2(file.d) : tr2({ uz: "yozilmoqda…", ru: "пишется…" })}</span>
        </div>;
})}
  </div>;
function useFileGen(total, storedAnswer) {
  const [n, setN] = useState3(storedAnswer ? total : 0);
  const [running, setRunning] = useState3(false);
  const done = n >= total;
  useEffect4(() => {
    if (!running) return;
    if (n >= total) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setN((x) => x + 1), 560);
    return () => clearTimeout(t);
  }, [running, n, total]);
  const run = () => {
    if (running || done) return;
    setN(0);
    setRunning(true);
  };
  return { n, running, done, run };
}
var Checklist = ({ items, doneInit, onComplete }) => {
  const [seen, setSeen] = useState3(() => doneInit ? new Set(items.map((_, i) => i)) : /* @__PURE__ */ new Set());
  const done = seen.size >= items.length;
  const fired = useRef3(false);
  useEffect4(() => {
    if (done && !fired.current) {
      fired.current = true;
      onComplete && onComplete();
    }
  }, [done]);
  const tap = (i) => setSeen((prev) => {
    const s = new Set(prev);
    s.add(i);
    return s;
  });
  return <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {items.map((it, i) => {
    const on = seen.has(i);
    return <button key={i} className={`vcard ${on ? "" : "tap-hint"}`} onClick={() => tap(i)} style={{ boxShadow: on ? `inset 0 0 0 1.5px ${T.success}, 0 5px 14px -6px rgba(${T.shadowBase},0.16)` : void 0, alignItems: "flex-start" }}>
            <span className="vseen" style={{ marginLeft: 0, marginRight: 2, color: on ? T.success : T.ink3, minWidth: 18 }}>{on ? "✓" : "☐"}</span>
            <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
              <span className="vlbl" style={{ fontFamily: "'Manrope'", fontSize: 13 }}>{tr2(it.t)}</span>
              {on && <span className="role-r el-in">{tr2(it.ok)}</span>}
            </span>
          </button>;
  })}
    </div>;
};
var SHOP_FLOW = [
  { k: { uz: "Admin", ru: "Админ" }, icon: "🔒", r: "POST /book", d: { uz: "Admin token bilan yangi kitob qo'shadi (guard ruxsat beradi).", ru: "Админ добавляет новую книгу с токеном (страж пропускает)." } },
  { k: { uz: "Mijoz", ru: "Клиент" }, icon: "🌐", r: "GET /book/featured", d: { uz: "Mijoz top kitoblarni ko'radi — token kerakmas (public).", ru: "Клиент смотрит топ-книги — токен не нужен (public)." } },
  { k: { uz: "Buyurtma", ru: "Заказ" }, icon: "🛒", r: "POST /order", d: { uz: "Mijoz bookId bilan buyurtma beradi (Order → Book bog'lanishi).", ru: "Клиент оформляет заказ с bookId (связь Order → Book)." } },
  { k: { uz: "Tekshiruv", ru: "Проверка" }, icon: "📋", r: "GET /order", d: { uz: "Admin kelgan buyurtmalarni ko'radi (faqat admin).", ru: "Админ просматривает поступившие заказы (только админ)." } },
  { k: { uz: "Tayyor", ru: "Готово" }, icon: "✅", r: { uz: "KitobShop ishlaydi", ru: "KitobShop работает" }, d: { uz: "Admin + mijoz oqimi to'liq — real do'kon backendi!", ru: "Поток админа и клиента замкнулся — бэкенд настоящего магазина!" } }
];
var LEGACY = [
  { id: "l1", ic: "🍽️", t: { uz: "Restoran", ru: "Ресторан" }, s: { uz: "1-dars — ko'rdingiz", ru: "урок 1 — видели" } },
  { id: "l2", ic: "🔧", t: { uz: "Bitta bo'lim", ru: "Один отдел" }, s: { uz: "2-dars — ochdingiz", ru: "урок 2 — открыли" } },
  { id: "l3", ic: "📚", t: "KitobShop", s: { uz: "bugun — 3 bo'lim, o'zingiz", ru: "сегодня — 3 отдела, сами" } }
];
var STAFF = [{ uz: "🛡️ qo'riqchi", ru: "🛡️ страж" }, { uz: "🧾 sotuvchi", ru: "🧾 продавец" }, { uz: "📋 anketa", ru: "📋 анкета" }, { uz: "📦 omborchi", ru: "📦 кладовщик" }, { uz: "🏷️ bo'lim", ru: "🏷️ отдел" }];
var LegacyRail = ({ seen, onTap }) => <div className="lg-rail fade-up delay-2">
    {LEGACY.map((l) => {
  const on = seen.has(l.id);
  return <button key={l.id} className={`lg-card ${on ? "on" : ""} ${on ? "" : "tap-hint"}`} onClick={() => onTap(l.id)}>
          <span className="lg-ic">{l.ic}</span>
          <span className="lg-t">{tr2(l.t)}</span>
          <span className="lg-s">{tr2(l.s)}</span>
          <span className={`lg-staff ${on ? "lit" : ""}`}>{STAFF.map((s, i) => <i key={i}>{tr2(s)}</i>)}</span>
        </button>;
})}
  </div>;
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [openId, setOpenId] = useState3(null);
  const [tried, setTried] = useState3(storedAnswer ? /* @__PURE__ */ new Set(["GET/book/featured"]) : /* @__PURE__ */ new Set());
  const [picked, setPicked] = useState3(storedAnswer?.picked ?? null);
  const [lseen, setLseen] = useState3(storedAnswer ? new Set(LEGACY.map((l) => l.id)) : /* @__PURE__ */ new Set());
  const [sc, setSc] = useState3(0);
  const triedOne = tried.size >= 1;
  const OPTS = [
    { id: "a", label: { uz: "Hammasini bitta ulkan faylga yozamiz", ru: "Запишем всё в один огромный файл" } },
    { id: "b", label: { uz: "3 resurs — har biri 5 qadam, agent bilan tez quramiz", ru: "3 ресурса — по 5 шагов на каждый, быстро строим с агентом" } },
    { id: "c", label: { uz: "Bunday do'kon backendini faqat katta jamoa quradi", ru: "Такой бэкенд магазина под силу только большой команде" } }
  ];
  const toggle = (id) => {
    setOpenId((o) => o === id ? null : id);
    setSc((n) => n + 1);
  };
  const onTry = (id) => {
    setTried((prev) => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
    setSc((n) => n + 1);
  };
  const tapLegacy = (id) => {
    setLseen((prev) => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
    setSc((n) => n + 1);
  };
  const ACK = {
    a: { uz: <>Bitta ulkan fayl birinchi kunda tez tuyuladi — keyin har o'zgarish uni <b>chalkashtiradi</b>. Bugun boshqa yo'lni ko'rasiz: har resurs — <b>o'z papkasi, o'z 5 qadami</b>. Kategoriya, Kitob va Buyurtmani shunday quramiz.</>, ru: <>Один огромный файл в первый день кажется быстрым — потом каждое изменение его <b>запутывает</b>. Сегодня увидите другой путь: каждый ресурс — <b>своя папка, свои 5 шагов</b>. Так построим Категорию, Книгу и Заказ.</> },
    b: { uz: <>Aynan! Har resurs — o'sha 5 qadam sikli. Bugun <b>3 resursni</b> (Kategoriya, Kitob, Buyurtma) <b>AI yordamchi bilan</b> qurasiz: siz <b>rejalashtirasiz</b>, AI'ni <b>yo'naltirasiz</b> va natijani <b>tekshirasiz</b>.</>, ru: <>Именно! Каждый ресурс — тот самый цикл из 5 шагов. Сегодня вы построите <b>3 ресурса</b> (Категория, Книга, Заказ) <b>с ИИ-помощником</b>: вы <b>планируете</b>, <b>направляете</b> ИИ и <b>проверяете</b> результат.</> },
    c: { uz: <>Katta jamoa kerak emas — <b>tartib</b> kerak. Har resurs o'sha 5 qadamdan iborat, AI yordamchi esa yozish qismini tezlashtiradi. Bugun uchala resursni <b>o'zingiz</b> qurasiz: rejalashtirasiz, yo'naltirasiz, tekshirasiz.</>, ru: <>Нужна не большая команда, а <b>порядок</b>. Каждый ресурс — те же 5 шагов, а ИИ-помощник ускоряет саму запись кода. Сегодня вы построите все три ресурса <b>сами</b>: планируете, направляете, проверяете.</> }
  };
  const pick = (v) => {
    if (picked !== null || !triedOne) return;
    setPicked(v);
    setSc((n) => n + 1);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: v, correct: v === "b" });
  };
  return <Stage eyebrow={tr2({ uz: "Praktika · kirish", ru: "Практика · введение" })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr2({ uz: "Boshlaymiz", ru: "Начинаем" })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 880 }}>{tr2({ uz: <>Mana siz quradigan narsa — haqiqiy <span className="italic" style={{ color: T.accent }}>onlayn kitob do'koni</span>.</>, ru: <>Вот что вы построите — настоящий <span className="italic" style={{ color: T.accent }}>онлайн-магазин книг</span>.</> })}</h1>
        <Mentor>{tr2({ uz: <>Bu — <b style={{ color: T.ink }}>KitobShop</b>: admin kitob qo'shadi, mijozlar ko'radi, "Top kitoblar"ni ko'zdan kechiradi va buyurtma beradi. Ro'yxatdagi har qator — bitta <b style={{ color: T.ink }}>endpoint</b>, ya'ni <b style={{ color: T.ink }}>eshik</b>: mijoz shu manzilga so'rov yuboradi. 🔒 — faqat admin kiradi, 🌐 — hamma kiradi. Bitta eshikni ochib <b style={{ color: T.ink }}>"Try it out"</b> bilan sinab ko'ring.</>, ru: <>Это — <b style={{ color: T.ink }}>KitobShop</b>: админ добавляет книги, клиенты их смотрят, листают «Топ-книги» и делают заказы. Каждая строка в списке — один <b style={{ color: T.ink }}>эндпоинт</b>, то есть <b style={{ color: T.ink }}>дверь</b>: клиент шлёт запрос на этот адрес. 🔒 — входит только админ, 🌐 — входят все. Откройте одну дверь и попробуйте её через <b style={{ color: T.ink }}>"Try it out"</b>.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <ShopSwagger openId={openId} onToggle={toggle} triedIds={tried} onTry={onTry} />
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr2({ uz: "Bunday backendni qanday quramiz?", ru: "Как построить такой бэкенд?" })}</p>
            <div className="fade-up delay-3" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {OPTS.map((o) => {
    const on = picked === o.id;
    return <button key={o.id} className={`hook-option ${on ? "on" : ""}`} disabled={picked !== null || !triedOne} style={{ opacity: !triedOne ? 0.55 : 1 }} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr2(o.label)}</span></button>;
  })}
            </div>
            {!triedOne && <p className="small" style={{ color: T.ink3, fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Avval bitta endpointni sinang ←", ru: "Сначала попробуйте один эндпоинт ←" })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr2(ACK[picked])}</p>}
          </Col>
        </Split>
        </Zoomable>
        <p className="flow-label" style={{ marginTop: 4 }}>{tr2({ uz: "Uch dars — bitta zanjir (har birini bosib ko'ring)", ru: "Три урока — одна цепочка (нажмите на каждый)" })}</p>
        <LegacyRail seen={lseen} onTap={tapLegacy} />
        {lseen.size >= LEGACY.length && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Biznes boshqa — <b>xodimlar bir xil</b>. Restoranda ofitsiant, do'konda sotuvchi: ish bitta — so'rovni oladi, javobni qaytaradi. Kodda ikkalasi ham <span className="mono">Controller</span>. Aynan shuning uchun bu — <b>arxitektura</b>.</>, ru: <>Бизнес другой — <b>сотрудники те же</b>. В ресторане официант, в магазине продавец: работа одна — принять запрос, вернуть ответ. В коде оба — <span className="mono">Controller</span>. Именно поэтому это — <b>архитектура</b>.</> })}</p></div>}
      </div>
    </Stage>;
};
var Screen1 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const HATS = [
    { id: "plan", icon: "📋", t: { uz: "Rejalashtiruvchi", ru: "Планировщик" }, d: { uz: "Rejalashtiradi: qaysi resurs, qaysi ustun, qanday bog'lanish.", ru: "Планирует: какой ресурс, какие колонки, какие связи." } },
    { id: "guide", icon: "🤖", t: { uz: "Yo'naltiruvchi", ru: "Направляющий" }, d: { uz: "AI yordamchiga aniq topshiriq beradi (playbook prompt).", ru: "Даёт ИИ-помощнику чёткое задание (playbook-промпт)." } },
    { id: "check", icon: "🔍", t: { uz: "Tekshiruvchi", ru: "Проверяющий" }, d: { uz: "Natijani tekshiradi: to'g'ri qatlam? ulangan? himoyalangan?", ru: "Проверяет результат: слой верный? подключено? защищено?" } }
  ];
  const [seen, setSeen] = useState3(storedAnswer ? new Set(HATS.map((h) => h.id)) : /* @__PURE__ */ new Set());
  const [active, setActive] = useState3(null);
  const [sc, setSc] = useState3(0);
  const done = seen.size >= HATS.length;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, seen.size);
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
  const cur = HATS.find((h) => h.id === active);
  return <Stage eyebrow={tr2({ uz: "Qoida · 3 ish", ru: "Правило · 3 дела" })} screen={screen} scrollSignal={sc} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Boshlaymiz →", ru: "Начинаем →" }) : tr2({ uz: `3 ishni ko'ring (${seen.size}/3)`, ru: `Посмотрите 3 дела (${seen.size}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Bugun ko'p kod yozmaysiz — siz <span className="italic" style={{ color: T.accent }}>bosh dasturchisiz</span>.</>, ru: <>Сегодня вы почти не пишете код — вы <span className="italic" style={{ color: T.accent }}>главный разработчик</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>AI yordamchingiz kodni soniyalarda yozadi — siz uni <b style={{ color: T.ink }}>yo'naltirasiz</b> va natijani <b style={{ color: T.ink }}>tekshirasiz</b>. Bosh dasturchi shu uchta ishni qiladi. Har birini bosib ko'ring.</>, ru: <>Ваш ИИ-помощник пишет код за секунды — вы его <b style={{ color: T.ink }}>направляете</b> и <b style={{ color: T.ink }}>проверяете</b> результат. Главный разработчик занимается этими тремя делами. Нажмите на каждое.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {HATS.map((h) => <button key={h.id} className={`vcard ${seen.has(h.id) ? "" : "tap-hint"}`} onClick={() => tap(h.id)} style={{ boxShadow: active === h.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : void 0 }}>
                  <span className="role-ico">{h.icon}</span>
                  <span className="vlbl mono">{tr2(h.t)}</span>
                  <span className="vseen" style={{ color: seen.has(h.id) ? T.success : T.ink3 }}>{seen.has(h.id) ? "✓" : ""}</span>
                </button>)}
            </div>
          </Col>
          <Col>
            {cur ? <div className="frame fade-step" key={active}><p className="note-h"><span style={{ fontSize: 22, marginRight: 6 }}>{cur.icon}</span><span className="mono" style={{ color: T.accent }}>{tr2(cur.t)}</span></p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2(cur.d)}</p></div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Rolni bosing ←", ru: "Нажмите на роль ←" })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Sikl: <b>Rejalashtir → Yo'naltir → Tekshir</b>. Har resurs uchun shu uch qadam. Boshlaymiz — avval reja.</>, ru: <>Цикл: <b>Планируй → Направляй → Проверяй</b>. Три шага для каждого ресурса. Начинаем — сначала план.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Uch ishni birma-bir bosing — bosh dasturchi kod yozishdan tashqari yana nima qiladi?", ru: "💡 Нажмите три роли по очереди — что ещё делает главный разработчик, кроме написания кода?" })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const NODES = [
    { id: "cat", t: "Category", cols: "name", rel: null, d: { uz: "Kitob turlari: Detektiv, Ilmiy, Bolalar...", ru: "Виды книг: детектив, научные, детские..." } },
    { id: "book", t: "Book", cols: "title · author · price · is_featured", rel: "→ Category (@ManyToOne)", d: { uz: "Har kitob bitta kategoriyaga tegishli.", ru: "Каждая книга относится к одной категории." } },
    { id: "order", t: "Order", cols: "customer_name · quantity", rel: "→ Book (@ManyToOne)", d: { uz: "Har buyurtma bitta kitobga ishora qiladi.", ru: "Каждый заказ указывает на одну книгу." } }
  ];
  const [seen, setSeen] = useState3(storedAnswer ? new Set(NODES.map((n) => n.id)) : /* @__PURE__ */ new Set());
  const [active, setActive] = useState3(null);
  const [sc, setSc] = useState3(0);
  const done = seen.size >= NODES.length;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, seen.size);
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
  const cur = NODES.find((n) => n.id === active);
  return <Stage eyebrow={tr2({ uz: "Reja · ma'lumotlar", ru: "План · данные" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `3 jadvalni ko'ring (${seen.size}/3)`, ru: `Посмотрите 3 таблицы (${seen.size}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Kitob do'koni qanday <span className="italic" style={{ color: T.accent }}>ma'lumotlarni</span> saqlaydi — va ular bir-biriga qanday <span className="italic" style={{ color: T.accent }}>ulanadi</span>?</>, ru: <>Какие <span className="italic" style={{ color: T.accent }}>данные</span> хранит книжный магазин — и как они <span className="italic" style={{ color: T.accent }}>связаны</span> между собой?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>AI'ga buyruq berishdan oldin <b style={{ color: T.ink }}>reja</b> tuzamiz: do'konda 3 turdagi ma'lumot bor — kategoriyalar, kitoblar va buyurtmalar. Ular bir-biriga bog'lanadi. Har birini bosib ko'ring.</>, ru: <>Прежде чем командовать ИИ, составим <b style={{ color: T.ink }}>план</b>: в магазине 3 вида данных — категории, книги и заказы. Они связаны друг с другом. Нажмите на каждый.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {NODES.map((nd) => <React3.Fragment key={nd.id}>
                  <button className={`vcard ${seen.has(nd.id) ? "" : "tap-hint"}`} onClick={() => tap(nd.id)} style={{ boxShadow: active === nd.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : void 0, flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}><span className="vlbl mono">📦 {nd.t}</span><span className="vseen" style={{ color: seen.has(nd.id) ? T.success : T.ink3 }}>{seen.has(nd.id) ? "✓" : ""}</span></span>
                    <span className="role-r" style={{ fontFamily: "'JetBrains Mono'" }}>{nd.cols}</span>
                  </button>
                  {nd.rel && <div className="mono" style={{ fontSize: 10.5, color: T.accent, fontWeight: 700, margin: "4px 0 4px 14px" }}>↑ {nd.rel}</div>}
                </React3.Fragment>)}
            </div>
          </Col>
          <Col>
            {cur ? <div className="frame fade-step" key={active}><p className="note-h"><span className="mono" style={{ color: T.accent }}>📦 {cur.t}</span></p><p className="body" style={{ margin: "0 0 8px", color: T.ink }}>{tr2(cur.d)}</p><div className="ent-row siz">{cur.cols} <span>{tr2({ uz: "← ustunlar", ru: "← колонки" })}</span></div>{cur.rel && <div className="ent-row free el-in">{cur.rel} <span>{tr2({ uz: "← bog'lanish", ru: "← связь" })}</span></div>}</div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Jadvalni bosing ←", ru: "Нажмите на таблицу ←" })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Reja tayyor: <b>Category ← Book ← Order</b>. Endi har birini agent bilan quramiz — Category'dan boshlaymiz.</>, ru: <>План готов: <b>Category ← Book ← Order</b>. Теперь построим каждый с агентом — начнём с Category.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Har jadvalni ochib ko'ring — qaysi ma'lumot qayerda saqlanishini solishtiring.", ru: "💡 Откройте каждую таблицу — сравните, какие данные где хранятся." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var CMDS = [
  {
    id: "c1",
    label: { uz: "1-buyruq", ru: "Команда 1" },
    text: { uz: '"kategoriya qil"', ru: "«сделай категорию»" },
    wired: false,
    files: [{ f: "category.ts", d: { uz: "hammasi bitta faylda", ru: "всё в одном файле" } }],
    note: { uz: "Agent nima so'ralganini o'zi taxmin qildi — bitta chalkash fayl. Qaysi ustun? Qaysi qatlam? Noma'lum.", ru: "Агент сам догадывался, что от него хотят — один запутанный файл. Какие колонки? Какой слой? Неизвестно." }
  },
  {
    id: "c2",
    label: { uz: "2-buyruq", ru: "Команда 2" },
    text: { uz: '"category.entity.ts yoz: name ustuni."', ru: "«напиши category.entity.ts: колонка name»" },
    wired: false,
    files: [{ f: "category.entity.ts", d: "name" }],
    note: { uz: "Buyruq aniq — lekin TO'LIQ emas. Agent aynan so'ralganini yozdi: bitta fayl. DTO, service, controller, module va ulanish yo'q.", ru: "Команда чёткая — но НЕ полная. Агент написал ровно то, что просили: один файл. Ни DTO, ни service, ни controller, ни module, ни подключения." }
  },
  {
    id: "c3",
    label: { uz: "3-buyruq", ru: "Команда 3" },
    text: { uz: `"Category resursini qo'sh: Entity (name) -> DTO -> BaseService'dan service -> CRUD controller -> module va AppModule'ga ula."`, ru: "«Добавь ресурс Category: Entity (name) -> DTO -> service от BaseService -> CRUD-controller -> module и подключи к AppModule»" },
    wired: true,
    files: [{ f: "category.entity.ts", d: "name" }, { f: "create/update-category.dto.ts", d: { uz: "anketa", ru: "анкета" } }, { f: "category.service.ts", d: "BaseService" }, { f: "category.controller.ts", d: "CRUD" }, { f: "category.module.ts", d: { uz: "bo'lim", ru: "отдел" } }, { f: "AppModule.imports += CategoryModule", d: { uz: "kirish taxtasi", ru: "входная вывеска" } }],
    note: { uz: "To'liq playbook: 5 fayl + bo'lim kirish taxtasiga yozildi. Endi /category tirik.", ru: "Полный плейбук: 5 файлов + отдел вписан на входную вывеску. Теперь /category живой." }
  }
];
function useAgentRun(files, initDone) {
  const total = files.length;
  const [n, setN] = useState3(initDone ? 99 : 0);
  const [running, setRunning] = useState3(false);
  useEffect4(() => {
    if (!running) return;
    if (n >= total) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setN((x) => x + 1), 460);
    return () => clearTimeout(t);
  }, [running, n, total]);
  const start = () => {
    setN(0);
    setRunning(true);
  };
  return { n, running, done: total > 0 && n >= total, start };
}
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [pickId, setPickId] = useState3(storedAnswer ? "c3" : null);
  const [sc, setSc] = useState3(0);
  const cmd = CMDS.find((c) => c.id === pickId) || null;
  const gen = useAgentRun(cmd ? cmd.files : [], !!storedAnswer);
  const shown = !!cmd && gen.done;
  const wired = shown && cmd.wired;
  const done = pickId === "c3" && gen.done;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, (pickId ? 1 : 0) + (gen.done ? 1 : 0));
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: "c3" });
  }, [done]);
  const send = (id) => {
    if (done) return;
    setPickId(id);
    setSc((n) => n + 1);
    gen.start();
  };
  return <Stage eyebrow={tr2({ uz: "Yo'naltirish · buyruq", ru: "Направление · команда" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "To'liq playbookni yuboring", ru: "Отправьте полный плейбук" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Agent <span className="italic" style={{ color: T.accent }}>aynan</span> aytganingizni yozadi — ko'proq emas.</>, ru: <>Агент пишет <span className="italic" style={{ color: T.accent }}>ровно</span> то, что вы сказали — и не больше.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Birinchi resurs — <b style={{ color: T.ink }}>Category</b>. Uchta buyruq bor, uchalasi ham ishonarli ko'rinadi. Bittasini yuboring va o'ngda <b style={{ color: T.ink }}>oqibatini</b> ko'ring: bo'lim <b style={{ color: T.ink }}>kirish taxtasiga</b> yozilmasa, mijoz eshikni topa olmaydi.</>, ru: <>Первый ресурс — <b style={{ color: T.ink }}>Category</b>. Есть три команды, и все три звучат убедительно. Отправьте одну и посмотрите справа на <b style={{ color: T.ink }}>последствия</b>: если отдел не вписан на <b style={{ color: T.ink }}>входную вывеску</b>, клиент не найдёт дверь.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            {CMDS.map((c) => <button key={c.id} className={`vcard ${pickId === c.id ? "on" : ""} ${pickId ? "" : "tap-hint"}`} onClick={() => send(c.id)} disabled={done && c.id !== "c3"} style={{ flexDirection: "column", alignItems: "flex-start", gap: 4, boxShadow: pickId === c.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : void 0 }}>
                <span className="vlbl" style={{ fontFamily: "'Manrope'" }}>{tr2(c.label)}</span>
                <span className="agent-msg">{tr2(c.text)}</span>
              </button>)}
            {shown && <div className={wired ? "frame-success fade-step" : "frame-warn fade-step"}><p className="body" style={{ margin: 0, color: T.ink }}>{tr2(cmd.note)}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Agent yaratayotgan fayllar", ru: "Файлы, которые создаёт агент" })}</p>
            {cmd ? <FileGen files={cmd.files} running={gen.running} n={gen.n} /> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Buyruqni yuboring ←", ru: "Отправьте команду ←" })}</p></div>}
            {shown && <>
              <p className="flow-label" style={{ marginTop: 4 }}>{tr2({ uz: "🍽️ Restoran kirish taxtasi — AppModule.imports", ru: "🍽️ Входная вывеска ресторана — AppModule.imports" })}</p>
              <div className="frame" style={{ padding: 13 }}>
                <div className="ent-row free">TypeOrmModule · AuthModule <span>{tr2({ uz: "bor", ru: "есть" })}</span></div>
                {wired ? <div className="ent-row free el-in">CategoryModule <span>{tr2({ uz: "yozildi", ru: "вписан" })}</span></div> : <div className="ent-row siz">CategoryModule <span>{tr2({ uz: "yo'q", ru: "нет" })}</span></div>}
                <div className={`ev-row ${wired ? "fixed" : "hot"}`} style={{ marginTop: 8, marginBottom: 0 }}>
                  <span className="ev-m">GET</span><span style={{ flex: 1 }}>/category</span>
                  <b style={{ color: wired ? T.success : T.danger }}>{wired ? "200 ✓" : "404"}</b>
                </div>
              </div>
              {!wired && <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: <>Bo'lim taxtada yo'q — mijoz uchun bu eshik <b>mavjud emas</b>. Boshqa buyruqni sinang.</>, ru: <>Отдела нет на вывеске — для клиента этой двери <b>не существует</b>. Попробуйте другую команду.</> })}</p></div>}
              {wired && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Category tirik! Farq "aniq/noaniq"da emas edi — <b>TO'LIQmi</b> shunda edi. Endi tekshiruvchi bo'lib ko'rib chiqamiz.</>, ru: <>Category живой! Дело было не в «чёткая/нечёткая» — а в том, <b>ПОЛНАЯ ли</b> команда. Теперь пройдёмся по ней как проверяющий.</> })}</p></div>}
            </>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Buyruq agentga hamma qadamni aytyaptimi — yoki bir qismini taxminga qoldiryaptimi?", ru: "💡 Говорит ли команда агенту про все шаги — или часть оставляет на его догадку?" })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState3(!!storedAnswer);
  const { tip: _tip, rescue: _resc } = useStuckValve(done, done ? 1 : 0);
  const ITEMS = [
    { t: { uz: "5 fayl yaratildimi? (entity, dto, service, controller, module)", ru: "Созданы ли 5 файлов? (entity, dto, service, controller, module)" }, ok: { uz: "✓ Hammasi bor.", ru: "✓ Все на месте." } },
    { t: { uz: "category.module.ts AppModule imports'iga ulanganmi?", ru: "Подключён ли category.module.ts к imports в AppModule?" }, ok: { uz: "✓ Ulangan — usiz /category 404 bo'lardi.", ru: "✓ Подключён — без этого /category вернул бы 404." } },
    { t: { uz: "Service BaseService'ni meros olganmi? (meros = tayyor retsept kitobini oladi)", ru: "Наследует ли service BaseService? (наследство = готовая книга рецептов)" }, ok: { uz: "✓ Ha — create/findAll/update/remove tekin keldi, ularni yozmaymiz.", ru: "✓ Да — create/findAll/update/remove достались бесплатно, их не пишем." } },
    { t: { uz: "Swagger'da /category eshiklari (endpointlari) ko'rinyaptimi?", ru: "Видны ли двери (эндпоинты) /category в Swagger?" }, ok: { uz: "✓ Ko'rinyapti — Category tirik!", ru: "✓ Видны — Category живой!" } }
  ];
  return <Stage eyebrow={tr2({ uz: "Tekshiruv · checklist", ru: "Проверка · чек-лист" })} screen={screen} scrollSignal={done ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Har bandni tekshiring", ru: "Проверьте каждый пункт" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>AI yozib berdi — endi uni qanday <span className="italic" style={{ color: T.accent }}>tekshiramiz</span>?</>, ru: <>ИИ написал код — как теперь его <span className="italic" style={{ color: T.accent }}>проверить</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Natijani tekshirish — bosh dasturchining doimiy odati (AI yomon bo'lgani uchun emas, shunchaki dasturchilar ishi shunaqa). Mana tekshiruv ro'yxati — har bandni bosib tasdiqlang.</>, ru: <>Проверять результат — постоянная привычка главного разработчика (не потому что ИИ плох, просто работа разработчика устроена так). Вот чек-лист — нажимайте и подтверждайте каждый пункт.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <Checklist items={ITEMS} doneInit={!!storedAnswer} onComplete={() => {
    setDone(true);
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }} />
          </Col>
          <Col>
            <AgentCard title={{ uz: "🔍 Tekshiruv qoidasi", ru: "🔍 Правило проверки" }}>{tr2({ uz: "Har resurs uchun shu 4 bandni ko'rib chiqing. AI tez yozadi — siz natija to'g'riligiga ishonch hosil qilasiz.", ru: "Проходите эти 4 пункта для каждого ресурса. ИИ пишет быстро — а вы убеждаетесь, что результат верный." })}</AgentCard>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Category ✓ tasdiqlandi. 1-resurs tayyor! Endi muhim savol: <b>har kim kitob qo'sha olishi kerakmi?</b></>, ru: <>Category ✓ подтверждён. Первый ресурс готов! Теперь важный вопрос: <b>должен ли каждый уметь добавлять книги?</b></> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Ro'yxatdagi har bandni bosib tasdiqlang — AI yozganini o'zingiz ko'rib chiqasiz.", ru: "💡 Нажимайте и подтверждайте каждый пункт — вы сами проверяете то, что написал ИИ." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var Screen5 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  tip={{ uz: "💡 Dars boshida bosh dasturchining uch ishini ko'rgansiz — ulardan qaysi biri AI ishlagandan keyin keladi?", ru: "💡 В начале урока вы видели три роли главного разработчика — какая из них идёт после работы ИИ?" }}
  eyebrow={tr2({ uz: "Mashq · 1-savol", ru: "Упражнение · вопрос 1" })}
  questionText="Bosh dasturchi sifatida AI kod yozgandan keyin eng muhim vazifangiz nima?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>AI yozgach, sizning eng muhim <span className="italic" style={{ color: T.accent }}>vazifangiz</span>?</>, ru: <>ИИ написал код — ваша самая важная <span className="italic" style={{ color: T.accent }}>задача</span>?</> })}</h2></>}
  options={[{ uz: "Natijani ko'rmasdan keyingi ishga o'tish", ru: "Перейти к следующей задаче, не глядя на результат" }, { uz: "Kodni har safar o'chirib qayta yozdirish", ru: "Каждый раз стирать код и просить написать заново" }, { uz: "Natijani tekshirish — qatlam va ulanish", ru: "Проверить результат — слой и подключение" }, { uz: "Xuddi shu vazifani boshqa AI'ga berish", ru: "Отдать ту же задачу другому ИИ" }]}
  correctIdx={2}
  explainCorrect={{ uz: "To'g'ri! AI tez yozadi, siz esa natijani tekshirasiz: to'g'ri qatlam? bo'lim ulanganmi? eshik himoyalanganmi? Swagger'da ko'rinyaptimi? Bu — bosh dasturchining asosiy ishi.", ru: "Верно! ИИ пишет быстро, а вы проверяете результат: слой верный? отдел подключён? дверь защищена? видно ли в Swagger? Это — главная работа ведущего разработчика." }}
  explainWrong={{
    0: { uz: "Ko'rmasdan o'tib ketish xavfli — mayda narsa o'tkazib yuborilishi mumkin. Tekshirish shart.", ru: "Идти дальше не глядя опасно — легко пропустить мелочь. Проверка обязательна." },
    1: { uz: "Har safar qayta yozdirish shart emas — avval tekshiring, kerak bo'lsa aniq tuzating.", ru: "Переписывать каждый раз не нужно — сначала проверьте и, если надо, точечно поправьте." },
    3: { uz: "Boshqa AI ham xato qilishi mumkin. Asosiysi — natijani siz tekshirasiz.", ru: "Другой ИИ тоже может ошибиться. Главное — результат проверяете вы." },
    default: { uz: "Eng muhimi — natijani tekshirish.", ru: "Самое важное — проверить результат." }
  }}
/>;
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [guard, setGuard] = useState3(!!storedAnswer);
  const [tried, setTried] = useState3(!!storedAnswer);
  const [sc, setSc] = useState3(0);
  const done = guard;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, guard ? 1 : 0);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const tryHack = () => {
    setTried(true);
    setSc((n) => n + 1);
  };
  const addGuard = () => {
    setGuard(true);
    setSc((n) => n + 1);
  };
  return <Stage eyebrow={tr2({ uz: "Yangi · Auth", ru: "Новое · Auth" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Qo'riqchini qo'ying", ru: "Поставьте стража" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Har kim kitob qo'sha olsa — do'kon <span className="italic" style={{ color: T.accent }}>nima bo'ladi</span>?</>, ru: <>Если книги может добавлять кто угодно — <span className="italic" style={{ color: T.accent }}>что станет</span> с магазином?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Kitob qo'shish — faqat <b style={{ color: T.ink }}>admin</b> ishi. Hozir himoya yo'q: istalgan odam <span className="mono">POST /book</span> qila oladi. Avval "hujum"ni sinab ko'ring, keyin qo'riqchi (<span className="mono">guard</span>) qo'ying.</>, ru: <>Добавлять книги — дело только <b style={{ color: T.ink }}>админа</b>. Сейчас защиты нет: <span className="mono">POST /book</span> может сделать кто угодно. Сначала попробуйте «атаку», затем поставьте стража (<span className="mono">guard</span>).</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name="book.controller.ts" minH={110}>
              {guard ? <><At>@UseGuards</At>{"(AuthGuard, RolesGuard)"}{"\n"}</> : <Cm>{tr2({ uz: "// himoya yo'q!", ru: "// защиты нет!" })}{"\n"}</Cm>}
              <At>@Controller</At>{"('book') {"}{"\n"}
              {guard ? <span className="el-in" style={{ color: CODE.attr }}>{"  @Roles"}<span style={{ color: CODE.text }}>{"(UserRole.ADMIN)"}</span></span> : <span style={{ color: CODE.comment }}>{"  " + tr2({ uz: "// hamma kira oladi", ru: "// входит кто угодно" })}</span>}{"\n"}
              {"  "}<At>@Post</At>{"()  create(dto) { ... }"}{"\n"}
              {"}"}
            </CodeFile>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn-soft" onClick={tryHack} disabled={guard}>{tr2({ uz: "🕵️ Begona odam: POST /book", ru: "🕵️ Посторонний: POST /book" })}</button>
              {!guard && <button className="btn" onClick={addGuard}>{tr2({ uz: "🛡️ Guard + @Roles qo'shish", ru: "🛡️ Добавить Guard + @Roles" })}</button>}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "natija", ru: "результат" })}</p>
            {!tried && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "So'rovni sinang ←", ru: "Попробуйте запрос ←" })}</p></div>}
            {tried && !guard && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>{tr2({ uz: "✗ 201 — har kim kitob qo'shdi!", ru: "✗ 201 — книгу добавил кто угодно!" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Himoyasiz — begona odam ham do'konga kitob qo'shyapti. Bu xavfli.", ru: "Без защиты книги в ваш магазин добавляет даже посторонний. Это опасно." })}</p></div>}
            {guard && <div className="frame-success fade-step"><p className="note-h" style={{ color: T.success }}>{tr2({ uz: "✓ Endi faqat admin", ru: "✓ Теперь только админ" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <><span className="mono">AuthGuard</span> tokenni tekshiradi, <span className="mono">@Roles(ADMIN)</span> rolni. Begona odam — 401/403. Bu — Dars 1'dagi "qo'riqchi"!</>, ru: <><span className="mono">AuthGuard</span> проверяет токен, <span className="mono">@Roles(ADMIN)</span> — роль. Постороннему — 401/403. Это тот самый «страж» из урока 1!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Himoyasiz endpoint bor — uni topib, ustiga qo'riqchi qo'ying.", ru: "💡 Есть незащищённый endpoint — найдите его и поставьте стража." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var AUTH_ROWS = [
  { id: "getbook", label: "GET /book", correct: "public", hint: { uz: "Kitoblarni hamma ko'rishi kerak — ochiq (public).", ru: "Книги должны видеть все — открыто (public)." } },
  { id: "featured", label: "GET /book/featured", correct: "public", hint: { uz: "Top kitoblar — vitrina, hamma ko'radi (public).", ru: "Топ-книги — витрина, её видят все (public)." } },
  { id: "order", label: "POST /order", correct: "public", hint: { uz: "Mijoz buyurtma beradi — ro'yxatdan o'tmasdan ham (public).", ru: "Клиент делает заказ — даже без регистрации (public)." } },
  { id: "postbook", label: "POST /book", correct: "admin", hint: { uz: "Kitob qo'shish — faqat admin.", ru: "Добавлять книги — только админ." } },
  { id: "delbook", label: "DELETE /book/:id", correct: "admin", hint: { uz: "O'chirish — faqat admin.", ru: "Удалять — только админ." } },
  { id: "getorder", label: "GET /order", correct: "admin", hint: { uz: "Buyurtmalarni ko'rish — faqat admin.", ru: "Смотреть заказы — только админ." } }
];
var Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [chosen, setChosen] = useState3(storedAnswer ? Object.fromEntries(AUTH_ROWS.map((r) => [r.id, r.correct])) : {});
  const [shakeId, setShakeId] = useState3(null);
  const [hint, setHint] = useState3(null);
  const [sc, setSc] = useState3(0);
  const done = AUTH_ROWS.every((r) => chosen[r.id] === r.correct);
  const { tip: _tip, rescue: _resc } = useStuckValve(done, Object.keys(chosen).length);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const set = (row, val) => {
    if (chosen[row.id] === row.correct) return;
    if (val === row.correct) {
      setChosen((c) => ({ ...c, [row.id]: val }));
      setHint(null);
      setSc((n) => n + 1);
    } else {
      setShakeId(row.id);
      setHint({ id: row.id, txt: row.hint });
      setTimeout(() => setShakeId((x) => x === row.id ? null : x), 450);
    }
  };
  return <Stage eyebrow={tr2({ uz: "Auth · biriktirish", ru: "Auth · назначение" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Har eshikni belgilang", ru: "Отметьте каждую дверь" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Qaysi eshik <span className="italic" style={{ color: T.accent }}>ochiq</span>, qaysi biri faqat <span className="italic" style={{ color: T.accent }}>admin</span> uchun?</>, ru: <>Какая дверь <span className="italic" style={{ color: T.accent }}>открыта</span>, а какая — только для <span className="italic" style={{ color: T.accent }}>админа</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Har endpoint uchun <span className="mono">@Roles</span> ni to'g'ri tanlang: 🌐 <b style={{ color: T.ink }}>public</b> (hamma) yoki 🔒 <b style={{ color: T.ink }}>admin</b>. O'ylang: bu amalni begona odam qila olsa, xavfli emasmi?</>, ru: <>Для каждого эндпоинта выберите верный <span className="mono">@Roles</span>: 🌐 <b style={{ color: T.ink }}>public</b> (все) или 🔒 <b style={{ color: T.ink }}>admin</b>. Подумайте: если это действие сможет сделать посторонний — не опасно ли?</> })}</Mentor>
        <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {AUTH_ROWS.map((r) => {
    const val = chosen[r.id];
    const locked = val === r.correct;
    return <div key={r.id} className={`auth-row ${shakeId === r.id ? "shake" : ""}`}>
                <span className="mono" style={{ flex: 1, fontSize: 13, color: T.ink }}>{r.label}</span>
                <button className={`auth-btn ${val === "public" ? r.correct === "public" ? "ok" : "bad" : ""}`} disabled={locked} onClick={() => set(r, "public")}>🌐 public</button>
                <button className={`auth-btn ${val === "admin" ? r.correct === "admin" ? "ok" : "bad" : ""}`} disabled={locked} onClick={() => set(r, "admin")}>🔒 admin</button>
              </div>;
  })}
        </div>
        {hint && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2(hint.txt)}</p></div>}
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ Mukammal! Ko'rish/buyurtma — ochiq, qo'shish/o'chirish/buyurtmalar ro'yxati — admin. <span className="mono">@Roles('public')</span> tokenni o'tkazib yuboradi, qolgani himoyalangan.</>, ru: <>✓ Отлично! Просмотр и заказ — открыты, добавление/удаление/список заказов — админ. <span className="mono">@Roles('public')</span> пропускает без токена, остальное защищено.</> })}</p></div>}
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Har eshik uchun o'ylang: bu ishni kim qila oladi — hamma, ro'yxatdan o'tgan mijoz, yoki faqat admin?", ru: "💡 Подумайте про каждую дверь: кто может это сделать — все, зарегистрированный клиент или только админ?" })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var Screen8 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  tip={{ uz: "💡 Shu endpoint himoyalanganmi — uni dars davomida o'zingiz qo'ygansiz. Javob shundan kelib chiqadi.", ru: "💡 Защищён ли этот endpoint — вы сами ставили защиту по ходу урока. Ответ следует отсюда." }}
  eyebrow={tr2({ uz: "Mashq · 2-savol", ru: "Упражнение · вопрос 2" })}
  questionText="Oddiy mijoz (admin emas) POST /book qilsa nima bo'ladi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Mijoz <span className="mono">POST /book</span> qilsa <span className="italic" style={{ color: T.accent }}>nima</span> bo'ladi?</>, ru: <>Клиент делает <span className="mono">POST /book</span> — <span className="italic" style={{ color: T.accent }}>что</span> произойдёт?</> })}</h2></>}
  options={[{ uz: "401/403 — qo'riqchi rad etadi", ru: "401/403 — страж откажет" }, { uz: "201 — kitob baribir qo'shiladi", ru: "201 — книга всё равно добавится" }, { uz: "200 — qo'shiladi, lekin yashirin", ru: "200 — добавится, но скрыто" }, { uz: "500 — server xato berib o'chadi", ru: "500 — сервер упадёт с ошибкой" }]}
  correctIdx={0}
  explainCorrect={{ uz: "To'g'ri! `@Roles(UserRole.ADMIN)` tufayli qo'riqchi mijozni rad etadi — 403. Token umuman bo'lmasa — 401. Faqat admin kitob qo'sha oladi.", ru: "Верно! Из-за `@Roles(UserRole.ADMIN)` страж откажет клиенту — 403. Если токена нет вовсе — 401. Добавлять книги может только админ." }}
  explainWrong={{
    1: { uz: "Qo'shilmaydi — bu eshik faqat admin uchun. Mijoz 403 oladi.", ru: "Не добавится — эта дверь только для админа. Клиент получит 403." },
    2: { uz: "Yashirin ham qo'shilmaydi — qo'riqchi so'rovni butunlay to'xtatadi.", ru: "И скрыто не добавится — страж останавливает запрос полностью." },
    3: { uz: "Server o'chmaydi — qo'riqchi toza javob qaytaradi: 401 yoki 403.", ru: "Сервер не падает — страж возвращает чистый ответ: 401 или 403." },
    default: { uz: "Mijoz admin eshigiga kelsa — qo'riqchi rad etadi (401/403).", ru: "Если клиент подходит к админской двери — страж отказывает (401/403)." }
  }}
/>;
var SHELVES = [
  { id: "det", ic: "📗", t: { uz: "Detektiv", ru: "Детектив" } },
  { id: "ilm", ic: "📘", t: { uz: "Ilmiy", ru: "Научные" } },
  { id: "bol", ic: "📙", t: { uz: "Bolalar", ru: "Детские" } }
];
var SH_BOOKS = [
  { id: "k1", t: { uz: "Sherlok Holms", ru: "Шерлок Холмс" }, a: { uz: "Doyl", ru: "Дойл" }, cat: "det", hint: { uz: "Sherlok Holms — tergov va jumboq. Bu detektiv rastasi.", ru: "Шерлок Холмс — расследование и загадка. Это полка детективов." } },
  { id: "k2", t: { uz: "Sharqiy ekspress qotilligi", ru: "Убийство в «Восточном экспрессе»" }, a: { uz: "Kristi", ru: "Кристи" }, cat: "det", hint: { uz: "Kristi romani — tergov. Detektiv rastasiga.", ru: "Роман Кристи — расследование. На полку детективов." } },
  { id: "k3", t: { uz: "Koinot qisqacha tarixi", ru: "Краткая история времени" }, a: { uz: "Xoking", ru: "Хокинг" }, cat: "ilm", hint: { uz: "Xoking — fizika va koinot. Bu ilmiy rasta.", ru: "Хокинг — физика и космос. Это научная полка." } },
  { id: "k4", t: { uz: "Turlar kelib chiqishi", ru: "Происхождение видов" }, a: { uz: "Darvin", ru: "Дарвин" }, cat: "ilm", hint: { uz: "Darvin — tabiat ilmi. Ilmiy rastaga.", ru: "Дарвин — наука о природе. На научную полку." } },
  { id: "k5", t: { uz: "Kichkina shahzoda", ru: "Маленький принц" }, a: { uz: "Sent-Ekzyuperi", ru: "Сент-Экзюпери" }, cat: "bol", hint: { uz: "Bu — bolalar uchun ertak-qissa.", ru: "Это сказка-повесть для детей." } },
  { id: "k6", t: { uz: "Alisa mo'jizalar mamlakatida", ru: "Алиса в Стране чудес" }, a: { uz: "Kerroll", ru: "Кэрролл" }, cat: "bol", hint: { uz: "Bolalar ertagi — bolalar rastasiga.", ru: "Детская сказка — на детскую полку." } }
];
var Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [placed, setPlaced] = useState3(() => storedAnswer ? Object.fromEntries(SH_BOOKS.map((b) => [b.id, b.cat])) : {});
  const [sel, setSel] = useState3(null);
  const [shakeId, setShakeId] = useState3(null);
  const [note, setNote] = useState3(null);
  const [lit, setLit] = useState3(null);
  const [over, setOver] = useState3(null);
  const [caught, setCaught] = useState3(null);
  const [sc, setSc] = useState3(0);
  const shelfRefs = useRef3({});
  const nPlaced = Object.keys(placed).length;
  const done = nPlaced >= SH_BOOKS.length;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, nPlaced);
  const shown = nPlaced > 0;
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const shakeIt = (id) => {
    setShakeId(id);
    setTimeout(() => setShakeId((x) => x === id ? null : x), 450);
  };
  const busyNote = (b) => {
    const sh = SHELVES.find((s) => s.id === placed[b.id]);
    setNote({ k: "busy", txt: tr2({ uz: `Bu kitobda allaqachon yorliq bor: "${tr2(sh.t)}". Bitta kitob — bitta yorliq. Ikkinchisini taqib bo'lmaydi.`, ru: `На этой книге уже есть ярлык: «${tr2(sh.t)}». Одна книга — один ярлык. Второй не приколоть.` }) });
    setSc((n) => n + 1);
  };
  const drop = (b, sid) => {
    const sh = SHELVES.find((s) => s.id === sid);
    setPlaced((p) => ({ ...p, [b.id]: sid }));
    setSel(null);
    setCaught(sid);
    setTimeout(() => setCaught((x) => x === sid ? null : x), 430);
    setNote({ k: "ok", txt: tr2({ uz: `Yorliq kitob MUQOVASIDA paydo bo'ldi: category: ${tr2(sh.t)}. Rastada emas — kitobda!`, ru: `Ярлык появился на ОБЛОЖКЕ книги: category: ${tr2(sh.t)}. Не на полке — на книге!` }) });
    setSc((n) => n + 1);
  };
  const tapBook = (b) => {
    if (placed[b.id]) {
      setSel(null);
      setLit(null);
      shakeIt(b.id);
      busyNote(b);
      return;
    }
    setSel(b.id);
    setLit(null);
    setNote(null);
  };
  const tapShelf = (s) => {
    if (!sel) {
      if (!done) {
        setNote({ k: "pick", txt: tr2({ uz: "Avval kitobni tanlang ←", ru: "Сначала выберите книгу ←" }) });
        return;
      }
      setLit((x) => x === s.id ? null : s.id);
      setNote({ k: "rel", txt: tr2({ uz: `Rastani bosdingiz — "${tr2(s.t)}" yorlig'i taqilgan hamma kitob yondi.`, ru: `Вы нажали на полку — подсветились все книги с ярлыком «${tr2(s.t)}».` }) });
      setSc((n) => n + 1);
      return;
    }
    const b = SH_BOOKS.find((x) => x.id === sel);
    if (b.cat !== s.id) {
      shakeIt(s.id);
      setNote({ k: "wrong", txt: tr2(b.hint) });
      setSc((n) => n + 1);
      return;
    }
    drop(b, s.id);
  };
  const down = (ev, b) => {
    if (ev.button != null && ev.button !== 0) return;
    ev.preventDefault();
    const el = ev.currentTarget;
    const sx = ev.clientX, sy = ev.clientY;
    let moved = false, hov = null;
    el.style.transition = "none";
    el.style.zIndex = "30";
    el.style.willChange = "transform";
    const clear = () => {
      el.style.transition = "";
      el.style.transform = "";
      el.style.zIndex = "";
      el.style.willChange = "";
      el.classList.remove("drag");
    };
    const snapBack = (ms) => {
      el.classList.remove("drag");
      el.style.transition = `transform ${ms}ms cubic-bezier(.34,1.4,.4,1)`;
      el.style.transform = "";
      setTimeout(clear, ms + 30);
    };
    const hit = (x, y) => {
      let h = null;
      SHELVES.forEach((s) => {
        const n = shelfRefs.current[s.id];
        if (!n) return;
        const r = n.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) h = s.id;
      });
      return h;
    };
    const mv = (e) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 5) {
        moved = true;
        el.classList.add("drag");
        if (!placed[b.id]) {
          setSel(b.id);
          setLit(null);
          setNote(null);
        }
      }
      if (!moved) return;
      el.style.transform = `translate(${dx}px,${dy}px) scale(1.06) rotate(-2deg)`;
      const t = hit(e.clientX, e.clientY);
      if (t !== hov) {
        hov = t;
        setOver(t);
      }
    };
    const up = (e) => {
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      setOver(null);
      if (!moved) {
        clear();
        tapBook(b);
        return;
      }
      const t = hit(e.clientX, e.clientY);
      if (placed[b.id]) {
        snapBack(300);
        busyNote(b);
        setTimeout(() => shakeIt(b.id), 320);
        return;
      }
      if (!t) {
        snapBack(300);
        setSel(null);
        return;
      }
      if (t !== b.cat) {
        snapBack(300);
        shakeIt(t);
        setNote({ k: "wrong", txt: tr2(b.hint) });
        setSc((n) => n + 1);
        return;
      }
      snapBack(200);
      drop(b, t);
    };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };
  return <Stage eyebrow={tr2({ uz: "Yangi · Yorliq", ru: "Новое · Ярлык" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `Yorliqlarni taqing (${nPlaced}/6)`, ru: `Прикрепите ярлыки (${nPlaced}/6)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Har kitobning muqovasida bitta <span className="italic" style={{ color: T.accent }}>yorliq</span> bor.</>, ru: <>На обложке каждой книги — один <span className="italic" style={{ color: T.accent }}>ярлык</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Ko'p kitob bitta yorliqni taqishi mumkin — lekin <b style={{ color: T.ink }}>bitta kitob ikkita yorliq taqa olmaydi</b>. Kitobni bosing, so'ng rastasini bosing. Menyuda ham shunday: har taomda bitta yorliq — "Salatlar".</>, ru: <>Один ярлык могут носить много книг — но <b style={{ color: T.ink }}>одна книга не может носить два ярлыка</b>. Нажмите на книгу, затем на её полку. В меню так же: у каждого блюда один ярлык — «Салаты».</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "6 kitob — yorliqsiz", ru: "6 книг — без ярлыков" })}</p>
            <div className="bk-grid">
              {SH_BOOKS.map((b) => {
    const at = placed[b.id];
    const sh = at ? SHELVES.find((s) => s.id === at) : null;
    const isLit = lit && at === lit;
    return <button key={b.id} className={`bk ${sel === b.id ? "sel" : ""} ${at ? "done" : ""} ${isLit ? "lit" : ""} ${shakeId === b.id ? "shake" : ""} ${!at && !sel ? "tap-hint" : ""}`} onPointerDown={(e) => down(e, b)}>
                    <span className="bk-t">{tr2(b.t)}</span>
                    <span className="bk-a">{tr2(b.a)}</span>
                    {sh && <span className="bk-tag">category: {tr2(sh.t)}</span>}
                  </button>;
  })}
            </div>
            <CodeFile name="book.entity.ts" minH={100}>
              <At>@Entity</At>{"('books')"}{"\n"}
              <Jx>export class</Jx>{" BookEntity "}<Jx>extends</Jx>{" BaseEntity {"}{"\n"}
              {"  "}<At>@Column</At>{"()  title: "}<St>string</St>{";"}{"\n"}
              {shown ? <><span className="el-in" style={{ color: CODE.attr }}>{"  @ManyToOne"}<span style={{ color: CODE.text }}>{"(() => CategoryEntity)"}</span></span>{"\n"}<span className="el-in" style={{ color: CODE.text }}>{"  category: CategoryEntity;"}</span>{"\n"}</> : <><Cm>{"  " + tr2({ uz: "// yorliq hali yo'q", ru: "// ярлыка пока нет" })}</Cm>{"\n"}</>}
              {"}"}
            </CodeFile>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "3 rasta — uch xil yorliq", ru: "3 полки — три разных ярлыка" })}</p>
            {SHELVES.map((s) => {
    const mine = SH_BOOKS.filter((b) => placed[b.id] === s.id);
    return <button key={s.id} ref={(el) => shelfRefs.current[s.id] = el} className={`sh ${lit === s.id ? "on" : ""} ${over === s.id ? "over" : ""} ${caught === s.id ? "catch" : ""} ${shakeId === s.id ? "shake" : ""}`} onClick={() => tapShelf(s)}>
                  <span className="sh-h">{s.ic} {tr2(s.t)}<span className="sh-n">{mine.length}/2</span></span>
                  {mine.length > 0 && <span className="sh-b">{mine.map((b) => tr2(b.t)).join(" · ")}</span>}
                </button>;
  })}
            {note && <div className={`${note.k === "ok" || note.k === "rel" ? "frame-success" : note.k === "pick" ? "frame-wait" : "frame-warn"} fade-step`}><p className="body" style={{ margin: 0, color: T.ink }}>{note.txt}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Yorliq <b>kitobda</b> saqlanadi — rastada emas. Shuning uchun <span className="mono">@ManyToOne</span> aynan <span className="mono">book.entity.ts</span> ichida yoziladi, <span className="mono">category.entity.ts</span> da emas. Ko'p kitob → bitta yorliq.</>, ru: <>Ярлык хранится <b>на книге</b> — не на полке. Поэтому <span className="mono">@ManyToOne</span> пишется именно внутри <span className="mono">book.entity.ts</span>, а не в <span className="mono">category.entity.ts</span>. Много книг → один ярлык.</> })}</p></div>}
            {done && <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: <>Rastani bosing — o'sha yorliq taqilgan hamma kitob yonadi. Kodda bu: <span className="mono">findAll({"{ relations: { category: true } }"})</span> — kitob bilan birga yorlig'i ham qaytadi.</>, ru: <>Нажмите на полку — подсветятся все книги с этим ярлыком. В коде это: <span className="mono">findAll({"{ relations: { category: true } }"})</span> — вместе с книгой вернётся и её ярлык.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Har kitobga yorlig'ini taqing — kategoriya kitobning qaysi maydonida turadi?", ru: "💡 Прикрепите каждой книге её ярлык — в каком поле книги хранится категория?" })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState3(!!storedAnswer);
  const { tip: _tip, rescue: _resc } = useStuckValve(done, done ? 1 : 0);
  const candidates = [
    { id: "title", correct: true, label: "@Column()  title: string;", node: <><At>@Column</At>{"()  title: "}<St>string</St>{";"}</> },
    { id: "author", correct: true, label: "@Column()  author: string;", node: <><At>@Column</At>{"()  author: "}<St>string</St>{";"}</> },
    { id: "price", correct: true, label: "@Column()  price: number;", node: <><At>@Column</At>{"()  price: "}<St>number</St>{";"}</> },
    { id: "feat", correct: true, label: "@Column({ default: false })  is_featured: boolean;", node: <><At>@Column</At>{"({ default: "}<Jx>false</Jx>{" })  is_featured: "}<St>boolean</St>{";"}</> },
    { id: "rel", correct: true, label: "@ManyToOne(() => CategoryEntity)  category: CategoryEntity;", node: <><At>@ManyToOne</At>{"(() => CategoryEntity)  category;"}</> },
    { id: "isstring", correct: false, label: "@IsString()  title: string;", why: { uz: "Bu DTO qatori (validatsiya). Entity'da @Column bo'ladi, @IsString emas.", ru: "Это строка DTO (валидация). В Entity — @Column, а не @IsString." } },
    { id: "roles", correct: false, label: "@Roles(UserRole.ADMIN)", why: { uz: "Bu controller qatori (himoya). Entity jadval shaklini belgilaydi, ruxsatni emas.", ru: "Это строка контроллера (защита). Entity описывает форму таблицы, а не права доступа." } }
  ];
  return <Stage eyebrow="Book · Entity" screen={screen} scrollSignal={done ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Faylni yig'ing", ru: "Соберите файл" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Kitob jadvalini yig'ing — qaysi qator <span className="italic" style={{ color: T.accent }}>Entity'ga</span> tegishli?</>, ru: <>Соберите таблицу книг — какие строки относятся к <span className="italic" style={{ color: T.accent }}>Entity</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Agent xato qilmasin — siz Book entity'ni tekshirib yig'asiz. Ustunlar + bog'lanish (<span className="mono">@ManyToOne</span>) Entity'da. O'ngdagi begona qatorlar boshqa qatlamdan — faqat to'g'rilarini tanlang.</>, ru: <>Чтобы агент не ошибся — вы собираете Book entity сами, с проверкой. Колонки + связь (<span className="mono">@ManyToOne</span>) — в Entity. Лишние строки справа из других слоёв — выбирайте только подходящие.</> })}</Mentor>
        <PickLines
    fileName="src/core/entity/book.entity.ts"
    scaffoldTop={<><At>@Entity</At>{"('books')"}{"\n"}<Jx>export class</Jx>{" BookEntity "}<Jx>extends</Jx>{" BaseEntity {"}</>}
    scaffoldBottom={<>{"}"}</>}
    candidates={candidates}
    agent={{ uz: "book.entity.ts yoz: title, author, price, is_featured (default false) ustunlari + @ManyToOne bilan Category bog'lanishi.", ru: "Напиши book.entity.ts: колонки title, author, price, is_featured (default false) + связь с Category через @ManyToOne." }}
    instruction={{ uz: "book.entity.ts ga qaysi qatorlar tegishli?", ru: "Какие строки относятся к book.entity.ts?" }}
    completedInit={!!storedAnswer}
    onComplete={() => {
      setDone(true);
      if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
    }}
  />
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Book entity tayyor — ustunlar + Category bog'lanishi bilan. Endi "Top kitoblar" bo'limini qo'shamiz.</>, ru: <>Book entity готов — колонки + связь с Category. Теперь добавим раздел «Топ-книги».</> })}</p></div>}
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Har qatorni o'qing: u shu faylning vazifasiga tegishlimi?", ru: "💡 Прочитайте каждую строку: относится ли она к задаче этого файла?" })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [show, setShow] = useState3(!!storedAnswer);
  const [sc, setSc] = useState3(0);
  const done = show;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, show ? 1 : 0);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Book · Top kitoblar", ru: "Book · Топ-книги" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Endpointni ko'ring", ru: "Посмотрите эндпоинт" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>"Top kitoblar" bo'limi — yangi metod <span className="italic" style={{ color: T.accent }}>yozamizmi</span>?</>, ru: <>Раздел «Топ-книги» — <span className="italic" style={{ color: T.accent }}>писать ли</span> новый метод?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Bosh sahifada faqat <span className="mono">is_featured: true</span> kitoblar chiqsin. Yangi CRUD yozmaymiz — controller'ga bitta maxsus eshik qo'shamiz va <b style={{ color: T.ink }}>BaseService'ning findAll</b>'iga shart beramiz. Tugmani bosing.</>, ru: <>Пусть на главной выходят только книги с <span className="mono">is_featured: true</span>. Новый CRUD не пишем — добавим контроллеру одну особую дверь и передадим условие в <b style={{ color: T.ink }}>findAll из BaseService</b>. Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name="book.controller.ts" minH={120}>
              <At>@Roles</At>{"('public')"}{"\n"}
              <At>@Get</At>{"('featured')"}{"\n"}
              {"featured() {"}{"\n"}
              {show ? <span className="el-in" style={{ color: CODE.text }}>{"  return this.bookService.findAll("}{"\n    { where: { is_featured: "}<span style={{ color: CODE.tag }}>true</span>{" } });"}</span> : <Cm>{"  " + tr2({ uz: "// top kitoblarni qaytarish...", ru: "// вернуть топ-книги..." })}</Cm>}{"\n"}
              {"}"}
            </CodeFile>
            <button className="btn-soft" style={{ alignSelf: "flex-start" }} disabled={show} onClick={() => {
    setShow(true);
    setSc((n) => n + 1);
  }}>{show ? tr2({ uz: "✓ Ko'rdingiz", ru: "✓ Посмотрели" }) : tr2({ uz: "⭐ findAll bilan to'ldirish", ru: "⭐ Заполнить через findAll" })}</button>
            <AgentCard>{tr2({ uz: <>BookController'ga public GET /book/featured endpoint qo'sh: findAll({"{ where: { is_featured: true } }"}) qaytarsin.</>, ru: <>Добавь в BookController публичный эндпоинт GET /book/featured: пусть возвращает findAll({"{ where: { is_featured: true } }"}).</> })}</AgentCard>
          </Col>
          <Col>
            <p className="flow-label">GET /book/featured</p>
            {!show ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Endpointni to'ldiring ←", ru: "Заполните эндпоинт ←" })}</p></div> : <div className="frame fade-step"><p className="body mono" style={{ margin: 0, color: T.ink, fontSize: 12, lineHeight: 1.7 }}>[<br />&nbsp;&nbsp;{'{ title: "Sherlok Holms", is_featured: true }'},<br />&nbsp;&nbsp;{'{ title: "Hobbit", is_featured: true }'}<br />]</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Maxsus endpoint — lekin yangi CRUD kodi yo'q! <span className="mono">findAll</span> BaseService'dan, siz faqat <span className="mono">where</span> shartini berdingiz.</>, ru: <>Особый эндпоинт — а нового CRUD-кода нет! <span className="mono">findAll</span> — из BaseService, вы передали только условие <span className="mono">where</span>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Endpoint qatorini bosing — u qaysi so'rovga javob berishini ko'rsatadi.", ru: "💡 Нажмите строку endpoint — она покажет, на какой запрос он отвечает." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var Screen12 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  tip={{ uz: "💡 O'ylang: tayyor asosda shunday so'rov bormi, yoki yangi metod yozish kerakmi?", ru: "💡 Подумайте: есть ли такой запрос в готовой основе, или нужно писать новый метод?" }}
  eyebrow={tr2({ uz: "Mashq · 3-savol", ru: "Упражнение · вопрос 3" })}
  questionText="Top kitoblarni (is_featured) qaytaruvchi endpointni qanday yozamiz?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Top kitoblarni <span className="italic" style={{ color: T.accent }}>qanday</span> qaytaramiz?</>, ru: <>Топ-книги — <span className="italic" style={{ color: T.accent }}>как</span> их вернуть?</> })}</h2></>}
  options={[{ uz: "Yangi `findFeatured` metodini yozib", ru: "Написав новый метод `findFeatured`" }, { uz: "Bazaga to'g'ridan-to'g'ri SQL yozib", ru: "Написав SQL прямо в базу" }, { uz: "Hammasini olib, frontend'da filtrlab", ru: "Забрав всё и отфильтровав на фронтенде" }, { uz: "Tayyor `findAll` ga `where` berib", ru: "Передав `where` в готовый `findAll`" }]}
  correctIdx={3}
  explainCorrect={{ uz: "To'g'ri! Tayyor `findAll` shart qabul qiladi: `findAll({ where: { is_featured: true } })`. Yangi metod yozmaysiz — faqat shartni berasiz.", ru: "Верно! Готовый `findAll` принимает условие: `findAll({ where: { is_featured: true } })`. Новый метод не нужен — вы лишь передаёте условие." }}
  explainWrong={{
    0: { uz: "Yangi metod yozish shart emas — tayyor `findAll` allaqachon `where` shartini qabul qiladi.", ru: "Новый метод не нужен — готовый `findAll` уже принимает условие `where`." },
    1: { uz: "Xom SQL kerak emas — buni `findAll` va `where` hal qiladi.", ru: "Сырой SQL не нужен — это решают `findAll` и `where`." },
    2: { uz: "Frontend'da filtrlash sekin: server barcha kitobni behuda yuboradi. Shartni serverda bering.", ru: "Фильтровать на фронтенде медленно: сервер зря отправит все книги. Передайте условие на сервере." },
    default: { uz: "Top kitoblar = `findAll` ga `where` shartini berish.", ru: "Топ-книги = передать `findAll` условие `where`." }
  }}
/>;
var Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const FILES = [{ f: "order.entity.ts", d: "customer_name, quantity + @ManyToOne Book" }, { f: "create/update-order.dto.ts", d: { uz: "bookId, quantity qoidalari", ru: "правила bookId, quantity" } }, { f: "order.service.ts", d: "BaseService" }, { f: "order.controller.ts", d: "POST public, GET admin" }, { f: "order.module.ts → AppModule", d: { uz: "ulash", ru: "подключить" } }];
  const gen = useFileGen(FILES.length, storedAnswer);
  const [sc, setSc] = useState3(0);
  const done = gen.done;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, gen.done ? 1 : 0);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const run = () => {
    gen.run();
    setSc((n) => n + 1);
  };
  return <Stage eyebrow={tr2({ uz: "Order · yo'naltirish", ru: "Order · направление" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Playbookni yuboring", ru: "Отправьте плейбук" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Oxirgi resurs — <span className="italic" style={{ color: T.accent }}>Buyurtma</span>. Qaysi kitobga bog'lanadi?</>, ru: <>Последний ресурс — <span className="italic" style={{ color: T.accent }}>Заказ</span>. К какой книге он привязан?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Order <span className="mono">@ManyToOne</span> bilan Book'ga bog'lanadi (har buyurtma — bitta kitob). Buyurtma berish — <b style={{ color: T.ink }}>public</b> (mijoz), ko'rish — admin. Playbookni agentga yuboring.</>, ru: <>Order связывается с Book через <span className="mono">@ManyToOne</span> (каждый заказ — одна книга). Оформить заказ — <b style={{ color: T.ink }}>public</b> (клиент), смотреть — админ. Отправьте агенту плейбук.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="prompt-box fade-up delay-1"><span className="agent-lbl">{tr2({ uz: "💬 Agentga playbook", ru: "💬 Плейбук для агента" })}</span><p className="agent-msg" style={{ marginBottom: 0 }}>{tr2({ uz: `"Order resursini qo'sh: Entity (customer_name, quantity + @ManyToOne Book) → DTO (bookId, quantity) → BaseService service → controller (POST public, GET admin) → module va AppModule'ga ula."`, ru: "«Добавь ресурс Order: Entity (customer_name, quantity + @ManyToOne Book) → DTO (bookId, quantity) → service от BaseService → controller (POST public, GET admin) → module и подключи к AppModule.»" })}</p></div>
            <button className="btn" style={{ alignSelf: "flex-start" }} disabled={gen.running || done} onClick={run}>{done ? tr2({ uz: "✓ Yozildi", ru: "✓ Написано" }) : gen.running ? tr2({ uz: "⏳ Agent yozyapti…", ru: "⏳ Агент пишет…" }) : tr2({ uz: "▶ Playbookni yuborish", ru: "▶ Отправить плейбук" })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Agent yaratayotgan fayllar", ru: "Файлы, которые создаёт агент" })}</p>
            <FileGen files={FILES} running={gen.running} n={gen.n} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>AI Order'ni yozdi. Lekin... mijoz buyurtma bera olmayapti! Keyingi ekranda tekshiruvchi bo'lib sababini topamiz.</>, ru: <>ИИ написал Order. Но... клиент не может оформить заказ! На следующем экране найдём причину — в роли проверяющего.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Playbook tayyor — yuborish tugmasini bosing va agent fayllarni yozishini kuzating.", ru: "💡 Playbook готов — нажмите отправку и посмотрите, как агент пишет файлы." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var DOOR_ROLES = [{ id: "guest", ic: "🧍", t: { uz: "Mijoz", ru: "Клиент" } }, { id: "admin", ic: "🔑", t: { uz: "Admin", ru: "Админ" } }];
var DOORS = [
  { id: "getbook", m: "GET", p: "/book", guest: "200", admin: "200", want: "open" },
  { id: "postorder", m: "POST", p: "/order", guest: "403", admin: "201", want: "open" },
  { id: "getorder", m: "GET", p: "/order", guest: "403", admin: "200", want: "admin" }
];
var BAD_LINE = "l2";
var OC_LINES = [
  { id: "l1", why: { uz: "Bu qator faqat manzilni belgilaydi (/order). Uni olib tashlasak ham mijoz baribir 403 oladi — demak muammo bunda emas.", ru: "Эта строка лишь задаёт адрес (/order). Уберём её — клиент всё равно получит 403, значит дело не в ней." } },
  { id: "l2", why: "" },
  { id: "l3", why: { uz: "Bu qator buyurtmani qabul qiladi. U bo'lmasa 404 chiqardi, 403 emas — demak muammo bunda emas.", ru: "Эта строка принимает заказ. Без неё было бы 404, а не 403 — значит дело не в ней." } },
  { id: "l4", why: { uz: "Bu qator buyurtmalar RO'YXATI uchun — uni admin ko'rishi to'g'ri. Uni o'zgartirsak ham mijoz POST'da baribir 403 oladi.", ru: "Эта строка — для СПИСКА заказов, и его правильно видит админ. Поменяем её — клиент на POST всё равно получит 403." } },
  { id: "l5", why: { uz: "Bu — yopiluvchi qavs. Ruxsatga aloqasi yo'q.", ru: "Это закрывающая скобка. К правам отношения не имеет." } }
];
var Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [tried, setTried] = useState3(() => storedAnswer ? new Set(DOORS.flatMap((d) => ["guest:" + d.id, "admin:" + d.id])) : /* @__PURE__ */ new Set());
  const [found, setFound] = useState3(!!storedAnswer);
  const [fixed, setFixed] = useState3(!!storedAnswer);
  const [why, setWhy] = useState3(null);
  const [shakeId, setShakeId] = useState3(null);
  const [sc, setSc] = useState3(0);
  const evidence = DOORS.every((d) => tried.has("guest:" + d.id));
  const done = fixed;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, (found ? 1 : 0) + (fixed ? 1 : 0));
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const knock = (roleId, d) => {
    const k = roleId + ":" + d.id;
    if (tried.has(k)) return;
    setTried((prev) => {
      const s = new Set(prev);
      s.add(k);
      return s;
    });
    setSc((n) => n + 1);
  };
  const tapLine = (ln) => {
    if (!evidence || found) return;
    if (ln.id === BAD_LINE) {
      setFound(true);
      setWhy(null);
      setSc((n) => n + 1);
      return;
    }
    setShakeId(ln.id);
    setWhy(tr2(ln.why));
    setSc((n) => n + 1);
    setTimeout(() => setShakeId((x) => x === ln.id ? null : x), 450);
  };
  const fix = () => {
    setFixed(true);
    setSc((n) => n + 1);
  };
  const cellVal = (roleId, d) => roleId === "guest" ? fixed && d.id === "postorder" ? "201" : d.guest : d.admin;
  const cellBad = (roleId, d) => roleId === "guest" && d.want === "open" && cellVal(roleId, d) === "403";
  return <Stage eyebrow={tr2({ uz: "Debugging · mustaqil", ru: "Дебаггинг · самостоятельно" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : found ? tr2({ uz: "Endi tuzating", ru: "Теперь исправьте" }) : evidence ? tr2({ uz: "Xato qatorni toping", ru: "Найдите строку с ошибкой" }) : tr2({ uz: "Eshiklarni sinang", ru: "Испытайте двери" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Do'kon ochildi — lekin <span className="italic" style={{ color: T.accent }}>bironta buyurtma kelmayapti</span>.</>, ru: <>Магазин открылся — но <span className="italic" style={{ color: T.accent }}>не пришло ни одного заказа</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Sabab aytilmaydi — <b style={{ color: T.ink }}>o'zingiz topasiz</b>. Avval mijoz bo'lib, keyin admin bo'lib eshiklarni taqillatib ko'ring: qaysi eshik kimga ochilyapti? Dalil yig'ilgach, kodni ochamiz.</>, ru: <>Причину вам не скажут — <b style={{ color: T.ink }}>вы найдёте её сами</b>. Постучитесь в двери сначала как клиент, потом как админ: какая дверь кому открывается? Соберёте улики — откроем код.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "Eshik sinovi — ikki rolda taqillatib ko'ring", ru: "Испытание дверей — постучитесь в двух ролях" })}</p>
            <div className="dr-tbl fade-up delay-1">
              <div className="dr-head">
                <span className="dr-ep">{tr2({ uz: "Eshik", ru: "Дверь" })}</span>
                {DOOR_ROLES.map((r) => <span key={r.id} className="dr-hc">{r.ic} {tr2(r.t)}</span>)}
              </div>
              {DOORS.map((d) => <div key={d.id} className="dr-row">
                  <span className="dr-ep">{d.m} {d.p}</span>
                  {DOOR_ROLES.map((r) => {
    const k = r.id + ":" + d.id;
    const on = tried.has(k);
    const bad = on && cellBad(r.id, d);
    const rej = on && /^4/.test(String(cellVal(r.id, d)));
    return <button key={r.id} className={`dr-cell ${on ? bad ? "bad" : "ok" : ""} ${rej ? "rej" : ""} ${on ? "" : "tap-hint"}`} disabled={on} onClick={() => knock(r.id, d)}>
                        {on ? <>{r.ic} {cellVal(r.id, d)}{bad ? " ❗" : ""}</> : <>{r.ic} {tr2({ uz: "sinash", ru: "пробовать" })}</>}
                      </button>;
  })}
                </div>)}
            </div>
            {evidence && !found && <div className="frame-wait fade-step"><p className="note-h" style={{ color: T.blue }}>{tr2({ uz: "🔎 Dalil yig'ildi", ru: "🔎 Улики собраны" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Dalil: mijoz <span className="mono">POST /order</span> da <b>403</b> olyapti — bu eshik ochiq bo'lishi kerak edi. Admin esa 201 oladi. Demak muammo — <b>ruxsatda</b>. Endi kodni oching →</>, ru: <>Улика: клиент получает <b>403</b> на <span className="mono">POST /order</span> — а эта дверь должна быть открытой. Админ же получает 201. Значит, дело — <b>в правах</b>. Теперь откройте код →</> })}</p></div>}
          </Col>
          <Col>
            <div className="ai-card fade-up delay-1">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr2({ uz: "OrderController tayyor!", ru: "OrderController готов!" })}</span></div>
              <div className="ai-code" style={{ opacity: evidence ? 1 : 0.45 }}>
                <div className="ai-code-h"><span className="bb-dots"><i /><i /><i /></span><span className="ai-code-t">order.controller.ts</span></div>
                <div className={`ai-line ${shakeId === "l1" ? "shake" : ""}`} onClick={() => tapLine(OC_LINES[0])}><span style={{ color: CODE.attr }}>@Controller</span>{"('order') {"}</div>
                <div className={`ai-line ${found ? fixed ? "ok" : "bad" : ""} ${shakeId === "l2" ? "shake" : ""}`} onClick={() => tapLine(OC_LINES[1])}><span style={{ color: CODE.attr }}>@Roles</span>{fixed ? "('public')" : "(UserRole.ADMIN)"}</div>
                <div className={`ai-line ${shakeId === "l3" ? "shake" : ""}`} onClick={() => tapLine(OC_LINES[2])}><span style={{ color: CODE.attr }}>@Post</span>{"()  create(@Body() dto) { ... }"}</div>
                <div className={`ai-line ${shakeId === "l4" ? "shake" : ""}`} onClick={() => tapLine(OC_LINES[3])}><span style={{ color: CODE.attr }}>@Roles</span>{"(UserRole.ADMIN)  "}<span style={{ color: CODE.attr }}>@Get</span>{"()  findAll()"}</div>
                <div className={`ai-line ${shakeId === "l5" ? "shake" : ""}`} onClick={() => tapLine(OC_LINES[4])}>{"}"}</div>
              </div>
              {!evidence && <p className="ai-prompt">{tr2({ uz: "Avval dalil yig'ing — uch eshikni mijoz sifatida sinang ←", ru: "Сначала соберите улики — попробуйте три двери как клиент ←" })}</p>}
              {evidence && !found && <p className="ai-prompt">{tr2({ uz: "Qaysi qator mijozni to'sib qo'ygan? Bosing.", ru: "Какая строка не пускает клиента? Нажмите на неё." })}</p>}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: "flex-start" }} onClick={fix}>{tr2({ uz: "🔧 POST'ni @Roles('public') ga o'zgartirish", ru: "🔧 Поменять POST на @Roles('public')" })}</button>}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: "normal", fontWeight: 600 }}>{tr2({ uz: "✓ Tuzatildi — buyurtma endi ochiq!", ru: "✓ Исправлено — заказы снова открыты!" })}</p>}
            </div>
            {why && !found && <div className="hint fade-step"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2(why)}</p></div>}
            {found && !fixed && <div className="frame-success fade-step"><p className="note-h" style={{ color: T.success }}>{tr2({ uz: "✓ Topdingiz!", ru: "✓ Нашли!" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <><b>Qo'riqchiga noto'g'ri ro'yxat berilgan</b> — u sizning MIJOZINGIZNI do'koningizga kiritmayapti. To'g'risi: <span className="mono">@Roles('public')</span>. Chap tugma bilan tuzating →</>, ru: <><b>Стражу дали не тот список</b> — он не пускает ВАШЕГО КЛИЕНТА в ваш же магазин. Правильно: <span className="mono">@Roles('public')</span>. Исправьте кнопкой слева →</> })}</p></div>}
            {fixed && <div className="takeaway fade-step"><div className="ta-bulb">🔍</div><p className="ta-h">{tr2({ uz: "Dalil bilan topdingiz!", ru: "Нашли по уликам!" })}</p><p className="ta-sub">{tr2({ uz: "Mijoz endi buyurtma bera oladi — 201", ru: "Клиент снова может оформить заказ — 201" })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Kod qatorlarini birma-bir oching: qaysi biri bu resursga tegishli emas?", ru: "💡 Открывайте строки кода по одной: какая из них не относится к этому ресурсу?" })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var Screen15 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  tip={{ uz: "💡 Savol qo'riqchini olib tashlash haqida emas — kimga ruxsat berilishi kerakligini o'ylang.", ru: "💡 Вопрос не о том, чтобы убрать стража — подумайте, кому должен быть доступ." }}
  eyebrow={tr2({ uz: "Mashq · 4-savol", ru: "Упражнение · вопрос 4" })}
  questionText="POST /order'ga xato bilan @Roles(ADMIN) qo'yilgan. To'g'ri tuzatish qaysi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Mijoz buyurtma berolsin desak, qatorni <span className="italic" style={{ color: T.accent }}>qanday</span> tuzatamiz?</>, ru: <>Чтобы клиент мог заказать — <span className="italic" style={{ color: T.accent }}>как</span> исправить строку?</> })}</h2></>}
  options={[{ uz: "Qo'riqchini butunlay olib tashlaymiz", ru: "Полностью убрать стража" }, { uz: "`@Roles('public')` ga o'zgartiramiz", ru: "Поменять на `@Roles('public')`" }, { uz: "Har bir mijozni admin qilamiz", ru: "Сделать каждого клиента админом" }, { uz: "Tugmani frontend'da yashiramiz", ru: "Спрятать кнопку на фронтенде" }]}
  correctIdx={1}
  explainCorrect={{ uz: "To'g'ri! `POST /order` hamma uchun ochiq bo'lishi kerak — `@Roles('public')`. Qolgan eshiklar (`GET /order`) admin'da qoladi. Faqat shu qator tuzatiladi.", ru: "Верно! `POST /order` должен быть открыт для всех — `@Roles('public')`. Остальные двери (`GET /order`) остаются админскими. Правится только эта строка." }}
  explainWrong={{
    0: { uz: "Qo'riqchini olib tashlasak, admin eshiklari ham ochilib qoladi. Faqat shu qatorni public qilamiz.", ru: "Уберём стража — распахнутся и админские двери. Делаем public только эту строку." },
    2: { uz: "Har mijozni admin qilish juda xavfli — u holda ular kitob ham qo'sha oladi.", ru: "Делать каждого клиента админом очень опасно — тогда они смогут и книги добавлять." },
    3: { uz: "Frontend himoya emas — server baribir 403 beradi. Ruxsat server tomonda tuzatiladi.", ru: "Фронтенд — не защита: сервер всё равно вернёт 403. Права правятся на стороне сервера." },
    default: { uz: "To'g'ri tuzatish — `POST /order` ni `@Roles('public')` qilish.", ru: "Правильное исправление — сделать `POST /order` с `@Roles('public')`." }
  }}
/>;
var Screen16 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState3(storedAnswer ? SHOP_FLOW.length : -1);
  const [sc, setSc] = useState3(0);
  const done = step >= SHOP_FLOW.length - 1;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, step);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const adv = () => {
    setStep((s) => Math.min(s + 1, SHOP_FLOW.length - 1));
    setSc((n) => n + 1);
  };
  const cur = step >= 0 ? SHOP_FLOW[Math.min(step, SHOP_FLOW.length - 1)] : null;
  return <Stage eyebrow={tr2({ uz: "Integratsiya · stsenariy", ru: "Интеграция · сценарий" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Stsenariyni kuzating", ru: "Проследите сценарий" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Hammasi birga: bitta haqiqiy <span className="italic" style={{ color: T.accent }}>xarid</span> qanday kechadi?</>, ru: <>Всё вместе: как проходит одна настоящая <span className="italic" style={{ color: T.accent }}>покупка</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>3 resurs, auth va bog'lanish — endi birga ishlaydi. Admin kitob qo'shadi, mijoz top kitoblarni ko'rib buyurtma beradi, admin buyurtmani ko'radi. Tugmani bosib kuzating.</>, ru: <>3 ресурса, auth и связи — теперь работают вместе. Админ добавляет книгу, клиент смотрит топ-книги и делает заказ, админ видит заказ. Нажимайте кнопку и следите.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="flow-rail fade-up delay-1">
              {SHOP_FLOW.map((f, i) => {
    const lit = step >= i;
    return <div key={i} className="flow-stop" style={{ opacity: lit ? 1 : 0.35 }}>
                    <span className="flow-ico" style={{ background: lit ? T.accent : T.paper, color: lit ? "#fff" : T.ink3 }}>{f.icon}</span>
                    <span className="flow-k" style={{ color: lit ? T.ink : T.ink3 }}>{tr2(f.k)}</span>
                    {i < SHOP_FLOW.length - 1 && <span className="flow-down" style={{ color: step > i ? T.accent : T.ink3 + "66" }}>↓</span>}
                  </div>;
  })}
            </div>
          </Col>
          <Col>
            <button className="btn" style={{ alignSelf: "flex-start" }} disabled={done} onClick={adv}>{step < 0 ? tr2({ uz: "▶ Stsenariyni boshlash", ru: "▶ Начать сценарий" }) : done ? tr2({ uz: "✓ Tugadi", ru: "✓ Конец" }) : tr2({ uz: "Keyingi qadam →", ru: "Следующий шаг →" })}</button>
            {cur && <div className="sk-info fade-step" key={step}><p className="note-h"><span style={{ fontSize: 20, marginRight: 6 }}>{cur.icon}</span><span className="mono" style={{ color: T.accent }}>{tr2(cur.r)}</span> · {tr2(cur.k)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2(cur.d)}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Mana to'liq do'kon oqimi! Auth, bog'lanish, maxsus endpoint — hammasi birga ishlayapti.", ru: "Вот полный поток магазина! Auth, связи, особый эндпоинт — всё работает вместе." })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Stsenariyni oxirigacha bosib boring — har bosishda buyurtma bitta bosqichga siljiydi.", ru: "💡 Ведите сценарий до конца нажатиями — с каждым заказ сдвигается на один этап." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var Screen17 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [openId, setOpenId] = useState3(storedAnswer ? "GET/book/featured" : null);
  const [tried, setTried] = useState3(storedAnswer ? /* @__PURE__ */ new Set(["GET/book/featured", "POST/order"]) : /* @__PURE__ */ new Set());
  const [sc, setSc] = useState3(0);
  const done = tried.size >= 2;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, tried.size);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const toggle = (id) => {
    setOpenId((o) => o === id ? null : id);
    setSc((n) => n + 1);
  };
  const onTry = (id) => {
    setTried((prev) => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
    setSc((n) => n + 1);
  };
  return <Stage eyebrow={tr2({ uz: "Natija · Swagger", ru: "Результат · Swagger" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: `2 endpoint sinang (${tried.size}/2)`, ru: `Попробуйте 2 эндпоинта (${tried.size}/2)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Sizning <span className="italic" style={{ color: T.accent }}>KitobShop</span>'ingiz — to'liq tirik!</>, ru: <>Ваш <span className="italic" style={{ color: T.accent }}>KitobShop</span> — полностью живой!</> })}</h2></div>
        <Mentor>{tr2({ uz: <>3 resurs, 7 endpoint, auth himoyasi, bog'lanish — hammasi siz boshqarib qurildi. Kamida 2 ta endpointni <b style={{ color: T.ink }}>"Try it out"</b> bilan sinab ko'ring (🔒 admin, 🌐 ochiq).</>, ru: <>3 ресурса, 7 эндпоинтов, защита auth, связи — всё построено под вашим управлением. Попробуйте минимум 2 эндпоинта через <b style={{ color: T.ink }}>"Try it out"</b> (🔒 админ, 🌐 открытые).</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <ShopSwagger openId={openId} onToggle={toggle} triedIds={tried} onTry={onTry} />
          </Col>
          <Col>
            <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "🌐 Mijoz: kitoblarni ko'radi, top kitoblar, buyurtma. 🔒 Admin: kitob/kategoriya qo'shadi, buyurtmalarni ko'radi.", ru: "🌐 Клиент: смотрит книги, топ-книги, заказывает. 🔒 Админ: добавляет книги/категории, видит заказы." })}</p></div>
            {done ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "🎉 Tabriklaymiz! Siz haqiqiy, auth bilan himoyalangan, bog'langan backend qurdingiz — agentni boshqarib.", ru: "🎉 Поздравляем! Вы построили настоящий бэкенд — со связями и защитой auth — управляя агентом." })}</p></div> : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2({ uz: `Endpointni oching → "Try it out" → javobni ko'ring.`, ru: 'Откройте эндпоинт → "Try it out" → посмотрите ответ.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Ikkala endpointni ham sinang: biri ochiq, ikkinchisi qo'riqchi ostida — javoblari farq qiladi.", ru: "💡 Попробуйте оба endpoint: один открыт, второй под стражем — ответы будут разными." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
      </div>
    </Stage>;
};
var DOORLIST = [
  { id: "getbook", m: "GET", p: "/book", lock: false },
  { id: "postbook", m: "POST", p: "/book", lock: true },
  { id: "postorder", m: "POST", p: "/order", lock: false },
  { id: "delbook", m: "DELETE", p: "/book/:id", lock: false },
  { id: "getorder", m: "GET", p: "/order", lock: true }
];
var CLAIMS = [
  { id: "q1", ev: "getbook", ok: true, t: { uz: "GET /book — hamma ko'radi (public)", ru: "GET /book — видят все (public)" }, why: { uz: "Ro'yxatda: GET /book — 🌐 public. Da'vo to'g'ri, yolg'on emas.", ru: "В списке: GET /book — 🌐 public. Утверждение верное, не ложь." } },
  { id: "q2", ev: "postbook", ok: true, t: { uz: "POST /book — faqat admin", ru: "POST /book — только админ" }, why: { uz: "Ro'yxatda: POST /book — 🔒 admin. Da'vo to'g'ri, yolg'on emas.", ru: "В списке: POST /book — 🔒 admin. Утверждение верное, не ложь." } },
  { id: "q3", ev: "postorder", ok: true, t: { uz: "POST /order — mijoz o'zi bera oladi", ru: "POST /order — клиент заказывает сам" }, why: { uz: "Ro'yxatda: POST /order — 🌐 public. Da'vo to'g'ri, yolg'on emas.", ru: "В списке: POST /order — 🌐 public. Утверждение верное, не ложь." } },
  { id: "q4", ev: "delbook", ok: false, t: { uz: "DELETE /book — faqat admin", ru: "DELETE /book — только админ" }, why: "" },
  { id: "q5", ev: "getorder", ok: true, t: { uz: "GET /order — buyurtmalarni faqat admin ko'radi", ru: "GET /order — заказы видит только админ" }, why: { uz: "Ro'yxatda: GET /order — 🔒 admin. Da'vo to'g'ri, yolg'on emas.", ru: "В списке: GET /order — 🔒 admin. Утверждение верное, не ложь." } }
];
var Screen19 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [checked, setChecked] = useState3(() => /* @__PURE__ */ new Set());
  const [found, setFound] = useState3(!!storedAnswer);
  const [guarded, setGuarded] = useState3(!!storedAnswer);
  const [why, setWhy] = useState3(null);
  const [shakeId, setShakeId] = useState3(null);
  const [sc, setSc] = useState3(0);
  const done = found && guarded;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, (found ? 1 : 0) + (guarded ? 1 : 0));
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const tap = (c) => {
    if (found) return;
    if (c.ok) {
      setChecked((prev) => {
        const s = new Set(prev);
        s.add(c.id);
        return s;
      });
      setWhy(tr2(c.why));
      setShakeId(c.id);
      setSc((n) => n + 1);
      setTimeout(() => setShakeId((x) => x === c.id ? null : x), 450);
      return;
    }
    setFound(true);
    setWhy(null);
    setSc((n) => n + 1);
  };
  const addGuard = () => {
    setGuarded(true);
    setSc((n) => n + 1);
  };
  const lockOf = (d) => d.id === "delbook" ? guarded : d.lock;
  return <Stage eyebrow={tr2({ uz: "Tekshiruv · ochilish", ru: "Проверка · открытие" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Yakunga →", ru: "К финалу →" }) : found ? tr2({ uz: "Qo'riqchini qo'ying", ru: "Поставьте стража" }) : tr2({ uz: "Yolg'on da'voni toping", ru: "Найдите ложное утверждение" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Ochilishdan oldin: beshta da'vodan bittasi <span className="italic" style={{ color: T.accent }}>yolg'on</span>.</>, ru: <>Перед открытием: одно из пяти утверждений — <span className="italic" style={{ color: T.accent }}>ложь</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Bu — tasdiqlash emas, <b style={{ color: T.ink }}>tekshirish</b>. Har da'voni o'ngdagi <b style={{ color: T.ink }}>eshiklar ro'yxati</b> bilan solishtiring: 🌐 ochiq, 🔒 qulflangan. Ro'yxatga mos kelmaydigan da'voni bosing.</>, ru: <>Это не «подтвердить», а <b style={{ color: T.ink }}>проверить</b>. Сравните каждое утверждение со <b style={{ color: T.ink }}>списком дверей</b> справа: 🌐 открыта, 🔒 заперта. Нажмите на то, что не совпадает со списком.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr2({ uz: "5 da'vo — qaysi biri ro'yxatga mos emas?", ru: "5 утверждений — какое не совпадает со списком?" })}</p>
            {CLAIMS.map((c, i) => <button key={c.id} className={`cl-row ${checked.has(c.id) ? "checked" : ""} ${found && !c.ok ? "liar" : ""} ${shakeId === c.id ? "shake" : ""} ${!found && !checked.has(c.id) ? "tap-hint" : ""}`} disabled={found} onClick={() => tap(c)}>
                <span className="cl-n">{i + 1}</span>
                <span style={{ flex: 1 }}>{tr2(c.t)}</span>
                <span>{found && !c.ok ? "❗" : checked.has(c.id) ? "✓" : ""}</span>
              </button>)}
            {why && !found && <div className="hint fade-step"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr2(why)}</p></div>}
            {found && !guarded && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>{tr2({ uz: "❗ Yolg'on topildi", ru: "❗ Ложь найдена" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Ro'yxatda <span className="mono">DELETE /book/:id</span> — 🌐 <b>public</b>. Agent qo'riqchi qo'ymay ketgan: <b>har kim butun do'koningiz kitoblarini o'chirib tashlashi mumkin edi</b>.</>, ru: <>В списке <span className="mono">DELETE /book/:id</span> — 🌐 <b>public</b>. Агент забыл поставить стража: <b>любой мог удалить все книги вашего магазина</b>.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr2({ uz: "Dalil — eshiklar ro'yxati", ru: "Улики — список дверей" })}</p>
            <div className="frame" style={{ padding: 13 }}>
              {DOORLIST.map((d) => {
    const lk = lockOf(d);
    const hot = found && d.id === "delbook" && !guarded;
    const fx = guarded && d.id === "delbook";
    return <div key={d.id} className={`ev-row ${hot ? "hot" : ""} ${fx ? "fixed" : ""}`}>
                    <span className="ev-m">{d.m}</span>
                    <span style={{ flex: 1 }}>{d.p}</span>
                    <span className={`ev-tag ${lk ? "lock" : "open"}`}>{lk ? "🔒 admin" : "🌐 public"}</span>
                  </div>;
  })}
            </div>
            {found && !guarded && <button className="btn" style={{ alignSelf: "flex-start" }} onClick={addGuard}>{tr2({ uz: "🛡️ DELETE /book ga @Roles(ADMIN) qo'yish", ru: "🛡️ Поставить @Roles(ADMIN) на DELETE /book" })}</button>}
            <div className={`shop-sign ${done ? "open" : ""}`}>{done ? tr2({ uz: "🏪 KitobShop — OCHIQ", ru: "🏪 KitobShop — ОТКРЫТ" }) : tr2({ uz: "🏪 KitobShop — tekshiruvda", ru: "🏪 KitobShop — на проверке" })}</div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Qo'riqchi ikki xil xato qiladi: <b>o'zinikini kiritmaydi</b> (403) va <b>begonani kiritadi</b> (o'chirib ketadi). Ikkalasini ham <b>siz</b> tekshirasiz — bugun ikkalasini ham topdingiz.</>, ru: <>Страж ошибается двумя способами: <b>не пускает своих</b> (403) и <b>пускает чужих</b> (а те всё удаляют). Обе ошибки проверяете <b>вы</b> — и сегодня вы нашли обе.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Auditda ikki ish bor: avval yetishmayotgan joyni toping, keyin qo'riqchini qo'ying.", ru: "💡 В аудите два дела: сначала найдите пропуск, потом поставьте стража." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
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
  if (!isMentor) return null;
  if (data.players === null || data.players.length === 0) return null;
  const total = data.players.length;
  const doers = data.players.filter((p) => data.doneIds.has(p.id));
  const waiting = data.players.filter((p) => !data.doneIds.has(p.id));
  return <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{tr2({ uz: "👀 Kim bajardi", ru: "👀 Кто выполнил" })} — <b>{doers.length}</b>/{total}</div>
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
        <Mentor>{tr2({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Проходите шаги и отмечайте их. Когда закончите, нажмите <b style={{ color: T.ink }}>«Выполнил(а)»</b> — наставник наблюдает.</> })}</Mentor>
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
            <p className="flow-label">{tr2({ uz: "Bosqichlar — belgilab boring", ru: "Шаги — отмечайте по мере выполнения" })}</p>
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
              {done ? tr2({ uz: "✓ Bajarildi — ustozni kuting", ru: "✓ Выполнено — ждите наставника" }) : tr2({ uz: "✅ Bajardim", ru: "✅ Выполнил(а)" })}
            </button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Ajoyib! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: "Отлично! Задание выполнено. Наставник проверит и переведёт вас дальше." })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>;
}
var ScreenKitobShopPractice = (props) => <ScreenLivePractice
  {...props}
  title={{ uz: "KitobShop'ni o'z kompyuteringizda oching", ru: "Откройте KitobShop на своём компьютере" }}
  task={{ uz: "VS Code'da KitobShop backendini quring: Book bo'limi + yorliq bog'lanishi + eshik qo'riqchisi. So'ng Swagger'da mijoz bo'lib ham, admin bo'lib ham kirib ko'ring — ikkala eshik ham kutilganidek ishlayaptimi?", ru: "Постройте бэкенд KitobShop в VS Code: отдел Book + связь-ярлык + страж у двери. Затем зайдите в Swagger и как клиент, и как админ — обе двери работают как ожидалось?" }}
  checklist={[
    { uz: "Agentga TO'LIQ playbook yuboring: `book.entity.ts` (title, author, price, is_featured) -> DTO -> `BaseService` dan service -> controller -> `book.module.ts` va AppModule'ga ulang (kirish taxtasi!)", ru: "Отправьте агенту ПОЛНЫЙ плейбук: `book.entity.ts` (title, author, price, is_featured) -> DTO -> service от `BaseService` -> controller -> `book.module.ts` и подключите к AppModule (входная вывеска!)" },
    { uz: "Yorliqni qo'ying: `book.entity.ts` ga `@ManyToOne(() => CategoryEntity) category` — so'ng serverni qayta ishga tushiring", ru: "Прикрепите ярлык: в `book.entity.ts` добавьте `@ManyToOne(() => CategoryEntity) category` — затем перезапустите сервер" },
    { uz: "Qo'riqchini qo'ying: `book.controller.ts` ga `@UseGuards(AuthGuard, RolesGuard)` + POST va DELETE uchun `@Roles(UserRole.ADMIN)`; `GET /book` public qolsin", ru: "Поставьте стража: в `book.controller.ts` — `@UseGuards(AuthGuard, RolesGuard)` + `@Roles(UserRole.ADMIN)` для POST и DELETE; `GET /book` оставьте public" },
    { uz: "Swagger (`/api`) da ikki eshikni sinang: `GET /book` = 200 · token'siz `POST /book` = 401/403", ru: "Проверьте две двери в Swagger (`/api`): `GET /book` = 200 · `POST /book` без токена = 401/403" }
  ]}
/>;
var KITOB_FLASHCARDS = [
  { front: { uz: "Bosh dasturchi AI bilan ishlaganda qaysi uch ishni qiladi?", ru: "Какие три дела делает главный разработчик, работая с ИИ?" }, back: { uz: "Rejalashtiradi, yo'naltiradi, tekshiradi", ru: "Планирует, направляет, проверяет" }, note: { uz: "Uchinchisi tushib qolsa, xato sizniki bo'lib qoladi", ru: "Пропустите третье — ошибка станет вашей" } },
  { front: { uz: "Yangi resurs uchun nechta fayl kerak bo'ladi?", ru: "Сколько файлов нужно для нового ресурса?" }, back: "5", note: "entity · dto · service · controller · module" },
  { front: { uz: "Bo'lim AppModule.imports'ga yozilmasa, mijoz nima ko'radi?", ru: "Что увидит клиент, если отдел не вписан в AppModule.imports?" }, back: "404", note: { uz: "🚪 kirish taxtasida yo'q — eshik topilmaydi", ru: "🚪 нет на входной вывеске — дверь не найти" } },
  { front: { uz: "Eshikka qo'riqchi qo'yadigan dekorator qaysi?", ru: "Какой декоратор ставит стража у двери?" }, back: "@UseGuards()", note: { uz: "AuthGuard (token) + RolesGuard (rol)", ru: "AuthGuard (токен) + RolesGuard (роль)" } },
  { front: { uz: "Eshikka kim kira olishini qaysi dekorator aytadi?", ru: "Какой декоратор говорит, кто может войти в дверь?" }, back: "@Roles()", note: { uz: "🌐 public — hamma · 🔒 admin — faqat admin", ru: "🌐 public — все · 🔒 admin — только админ" } },
  { front: { uz: "Token bor, lekin rol yetmasa server nima qaytaradi?", ru: "Токен есть, но роли не хватает — что вернёт сервер?" }, back: "403", note: { uz: "Token umuman yo'q bo'lsa — 401", ru: "Если токена нет совсем — 401" } },
  { front: { uz: "Kitobni kategoriyaga qaysi dekorator bog'laydi?", ru: "Какой декоратор связывает книгу с категорией?" }, back: "@ManyToOne()", note: { uz: "Ko'p kitob — bitta yorliq", ru: "Много книг — один ярлык" } },
  { front: { uz: "@ManyToOne qaysi faylga yoziladi?", ru: "В какой файл пишется @ManyToOne?" }, back: "book.entity.ts", note: { uz: "Yorliq kitobda saqlanadi, rastada emas", ru: "Ярлык хранится на книге, а не на полке" } },
  { front: { uz: "Faqat top kitoblarni qanday qaytarasiz?", ru: "Как вернуть только топ-книги?" }, back: "findAll({ where: { is_featured: true } })", note: { uz: "Yangi CRUD yozilmaydi — shart beriladi", ru: "Новый CRUD не пишут — передают условие" } },
  { front: { uz: "Kitob bilan birga uning kategoriyasi ham kelsin desangiz?", ru: "Хотите, чтобы вместе с книгой пришла и её категория?" }, back: "relations: { category: true }", note: { uz: "findAll ichiga beriladi", ru: "Передаётся внутрь findAll" } },
  { front: { uz: "Muvaffaqiyatli POST qanday status kod qaytaradi?", ru: "Какой статус-код возвращает успешный POST?" }, back: "201", note: { uz: "Qo'shildi · 403 — rad etildi · 404 — eshik yo'q", ru: "Создано · 403 — отказано · 404 — двери нет" } },
  { front: { uz: "Kitoblar va buyurtmalar oxir-oqibat qayerda yotadi?", ru: "Где в итоге лежат книги и заказы?" }, back: "PostgreSQL", note: { uz: "🗄️ ombor — Service ma'lumotni shu yerga qo'yadi", ru: "🗄️ склад — Service кладёт данные туда" } }
];
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect4(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  return <Stage eyebrow={tr2({ uz: "Takrorlash", ru: "Повторение" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr2({ uz: "Yakunlash →", ru: "Завершить →" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={KITOB_FLASHCARDS} /></div>
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
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr2({ uz: "↻ O'rganilmoqda", ru: "↻ Изучается" })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr2({ uz: "✓ Bildim", ru: "✓ Знаю" })} · <b>{known}</b></span></div>
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
  shelf: { icon: "📚", name: "Shelf Master!", desc: { uz: "Javon chizmasini toza yig'dingiz", ru: "Вы чисто собрали чертёж стеллажа" } },
  guard: { icon: "🛡️", name: "Guard Up!", desc: { uz: "Qaysi eshik ochiq, qaysi biri qulf — aniq bilasiz.", ru: "Вы точно знаете, какая дверь открыта, а какая под замком." } },
  catcher: { icon: "🔍", name: "Nice Catch!", desc: { uz: "AI qo'yib yuborgan xatoni dalil bilan topdingiz.", ru: "Вы нашли ошибку ИИ по уликам." } },
  owner: { icon: "🏪", name: "Shop Owner!", desc: { uz: "Ochiq qolgan eshikni topdingiz — KitobShop ochildi!", ru: "Вы нашли незапертую дверь — KitobShop открылся!" } }
};
var ACH_TRIGGERS = { s8: "guard", s10: "shelf", s14: "catcher", s19: "owner" };
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
var Q_LABELS = { 5: { uz: "1 — Tekshiruvchi", ru: "1 — Проверяющий" }, 8: { uz: "2 — Qo'riqchi (403)", ru: "2 — Страж (403)" }, 12: "3 — findAll + where", 15: { uz: "4 — Debug (public)", ru: "4 — Дебаг (public)" } };
var INLINE_KEYS = { s5: 2, s8: 0, s12: 3, s15: 1, practice: -1 };
var QUIZ_MS = 15e3;
var QUIZ_BASE_IDX = 100;
var QUIZ_COLORS = ["#FF5A2C", "#0FA6D6", "#F5A623", "#22A05C"];
var QUIZ_SHAPES = ["▲", "◆", "●", "■"];
var QZ_BG_SHAPES = [
  { ch: "@ManyToOne", l: 5, t: 10, s: 24, c: "rgba(120,235,175,0.16)", d: 19, dl: 0 },
  { ch: "@Roles", l: 84, t: 7, s: 30, c: "rgba(80,200,255,0.14)", d: 23, dl: 1.5 },
  { ch: "@UseGuards", l: 8, t: 72, s: 24, c: "rgba(232,161,58,0.15)", d: 27, dl: 0.8 },
  { ch: "findAll", l: 80, t: 68, s: 30, c: "rgba(255,110,70,0.14)", d: 21, dl: 2.2 },
  { ch: "where", l: 44, t: 86, s: 28, c: "rgba(203,173,255,0.14)", d: 25, dl: 1.1 },
  { ch: "201", l: 62, t: 26, s: 32, c: "rgba(80,200,255,0.13)", d: 17, dl: 0.4 },
  { ch: "403", l: 26, t: 34, s: 32, c: "rgba(255,110,70,0.14)", d: 20, dl: 1.9 },
  { ch: "DTO", l: 55, t: 5, s: 30, c: "rgba(203,173,255,0.12)", d: 22, dl: 0.6 },
  { ch: "BaseService", l: 89, t: 42, s: 20, c: "rgba(232,161,58,0.13)", d: 24, dl: 1.3 },
  { ch: "Entity", l: 2, t: 45, s: 26, c: "rgba(80,200,255,0.10)", d: 26, dl: 2.6 },
  { ch: "Module", l: 36, t: 58, s: 24, c: "rgba(255,110,70,0.11)", d: 28, dl: 0.9 },
  { ch: "404", l: 70, t: 90, s: 28, c: "rgba(203,173,255,0.12)", d: 18, dl: 2 }
];
var QUIZ_BANK = [
  { q: { uz: "Yangi resurs (masalan Book) uchun nechta fayl kerak?", ru: "Сколько файлов нужно для нового ресурса (например, Book)?" }, opts: [{ uz: "2 — faqat entity va controller", ru: "2 — только entity и controller" }, { uz: "3 — entity, service va module", ru: "3 — entity, service и module" }, { uz: "5 — har qatlam uchun bitta fayl", ru: "5 — по файлу на каждый слой" }, { uz: "1 — hammasi bitta katta faylga yoziladi", ru: "1 — всё пишется в один большой файл" }], correct: 2 },
  { q: { uz: "Bo'lim AppModule'ga ulanmasa nima bo'ladi?", ru: "Что будет, если отдел не подключить к AppModule?" }, opts: [{ uz: "Eshik topilmaydi — 404 qaytadi", ru: "Дверь не найдётся — вернётся 404" }, { uz: "Server umuman ishga tushmay qoladi", ru: "Сервер вообще не запустится" }, { uz: "Ma'lumot bazaga saqlanmaydi", ru: "Данные не сохранятся в базу" }, { uz: "Swagger'da 500 xatosi chiqadi", ru: "В Swagger выйдет ошибка 500" }], correct: 0 },
  { q: { uz: "Kitobni kategoriyaga bog'lash uchun qaysi dekorator?", ru: "Какой декоратор связывает книгу с категорией?" }, opts: [{ uz: "`@Column()` (oddiy ustun uchun)", ru: "`@Column()` (для обычной колонки)" }, "`@UseGuards()`", "`@Roles()`", "`@ManyToOne()`"], correct: 3 },
  { q: { uz: "`@ManyToOne` qaysi faylga yoziladi?", ru: "В какой файл пишется `@ManyToOne`?" }, opts: ["`category.entity.ts`", "`book.entity.ts`", "`book.controller.ts`", "`app.module.ts`"], correct: 1 },
  { q: { uz: "Token'siz mijoz `POST /book` qilsa, server nima qaytaradi?", ru: "Клиент без токена делает `POST /book` — что вернёт сервер?" }, opts: [{ uz: "401/403 — qo'riqchi rad etadi", ru: "401/403 — страж откажет" }, { uz: "201 — kitob baribir qo'shiladi", ru: "201 — книга всё равно добавится" }, { uz: "404 — bunday eshik topilmadi", ru: "404 — такая дверь не найдена" }, { uz: "200 — bo'sh ro'yxat qaytadi", ru: "200 — вернётся пустой список" }], correct: 0 },
  { q: { uz: "Eshikka qo'riqchi qo'yadigan dekorator qaysi?", ru: "Какой декоратор ставит стража у двери?" }, opts: ["`@Injectable()`", "`@Entity()`", "`@UseGuards()`", "`@Controller()`"], correct: 2 },
  { q: { uz: "`GET /book` hamma uchun ochiq bo'lsin desak?", ru: "Хотим, чтобы `GET /book` был открыт для всех?" }, opts: [{ uz: "`@Roles(UserRole.ADMIN)` qo'yamiz", ru: "Поставим `@Roles(UserRole.ADMIN)`" }, { uz: "`@Roles('public')` qo'yamiz", ru: "Поставим `@Roles('public')`" }, { uz: "Qo'riqchini butunlay o'chiramiz", ru: "Совсем удалим стража" }, { uz: "Frontend'da yashirib qo'yamiz", ru: "Спрячем на фронтенде" }], correct: 1 },
  { q: { uz: "Faqat `is_featured: true` kitoblarni qanday qaytaramiz?", ru: "Как вернуть только книги с `is_featured: true`?" }, opts: [{ uz: "Yangi CRUD metodini noldan yozamiz", ru: "Напишем новый CRUD-метод с нуля" }, { uz: "Hammasini olib, frontend'da filtrlaymiz", ru: "Заберём всё и отфильтруем на фронтенде" }, { uz: "To'g'ridan-to'g'ri xom SQL yozamiz", ru: "Напишем сырой SQL напрямую" }, { uz: "`findAll` ga `where` shartini beramiz", ru: "Передадим `findAll` условие `where`" }], correct: 3 },
  { q: { uz: "`BaseService` ni meros olgan service nimani tekin oladi?", ru: "Что бесплатно получает service, унаследовавший `BaseService`?" }, opts: [{ uz: "Eshik qo'riqchisini (guard)", ru: "Стража двери (guard)" }, { uz: "Swagger hujjatini", ru: "Документацию Swagger" }, { uz: "Bazaga ulanishni", ru: "Подключение к базе" }, { uz: "Tayyor CRUD metodlarini", ru: "Готовые CRUD-методы" }], correct: 3 },
  { q: { uz: "Muvaffaqiyatli POST (qo'shildi) qaysi status kodni qaytaradi?", ru: "Какой статус-код возвращает успешный POST (добавлено)?" }, opts: ["200 OK", "201 Created", "204 No Content", "301 Moved"], correct: 1 },
  { q: { uz: "DTO nima uchun kerak?", ru: "Зачем нужен DTO?" }, opts: [{ uz: "Kiruvchi so'rovning qoidalari", ru: "Правила входящего запроса" }, { uz: "Jadval ustunlarini belgilaydi", ru: "Задаёт колонки таблицы" }, { uz: "Bo'limni AppModule'ga ulaydi", ru: "Подключает отдел к AppModule" }, { uz: "Bazaga ulanish sozlamalarini belgilaydi", ru: "Задаёт настройки подключения к базе" }], correct: 0 },
  { q: { uz: "Kitob bilan birga uning kategoriyasini ham olib kelish uchun `findAll` ga nima beriladi?", ru: "Что передать в `findAll`, чтобы вместе с книгой пришла и её категория?" }, opts: ["`order: { id: 'DESC' }`", "`select: { title: true }`", "`relations: { category: true }`", "`where: { is_featured: true, id: 1 }`"], correct: 2 }
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
    const TOK = ["@ManyToOne", "@Roles", "@UseGuards", "findAll", "where", "DTO", "BaseService", "201", "403"];
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
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr2({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее верный ответ — тем больше баллов. Серия верных ответов подряд даёт 🔥 бонус!" })}</p>
          {!solo && <div className="qz-lobby-players">
              {players.map((p) => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? "me" : ""}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr2({ uz: "O'quvchilar kutilmoqda…", ru: "Ждём учеников…" })}</span>}
            </div>}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl("q", 0)}>{tr2({ uz: "▶ Testni boshlash", ru: "▶ Начать тест" })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr2({ uz: "⏳ Mentor testni boshlashini kuting…", ru: "⏳ Подождите, пока ментор начнёт тест…" })}</p>}
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
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr2({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ""}</span></> : <span className="qz-res-t">{my ? tr2({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: "Ошибка — 0 баллов. Возьмёте на следующем! 💪" }) : tr2({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: "Время вышло — 0 баллов. Побыстрее! ⏱" })}</span>}
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
          {
    /* 141-qonun (F-0820-338): yakun-marosimi BITTA — konfetti podiumda qoladi.
       Bu yerda tasdiq: o'quvchi yakunni ko'radi, bayram takrorlanmaydi. */
  }
          <h2 className="qz-h">{tr2({ uz: "Test yakunlandi", ru: "Тест завершён" })}</h2>
          {solo ? <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr2({ uz: "ball", ru: "баллов" })} · {soloScore.ok}/{QUIZ_BANK.length} {tr2({ uz: "to'g'ri", ru: "верных" })}{soloScore.maxStreak >= 2 ? tr2({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · лучшая серия 🔥x${soloScore.maxStreak}` }) : ""}</p>
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
            <div className="frame-wait" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.", ru: "Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉." })}</p></div>
          </div> : !loaded2 ? <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr2({ uz: "Natijalar yuklanmoqda…", ru: "Результаты загружаются…" })}</p> : board.length === 0 ? <div className="frame-wait fade-up"><p className="body" style={{ margin: 0 }}>{tr2({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: "К этой сессии пока никто не присоединился." })}</p></div> : <>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr2({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верных)</> })}</p>}
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
var Screen20 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
    { uz: "3 bog'langan resursli real backend qurdingiz (Category · Book · Order)", ru: "Вы построили настоящий бэкенд с 3 связанными ресурсами (Category · Book · Order)" },
    { uz: "Bosh dasturchi sikli: Rejalashtir → Yo'naltir → Tekshir", ru: "Цикл главного разработчика: Планируй → Направляй → Проверяй" },
    { uz: "Eshik va qo'riqchi: @UseGuards + @Roles — 🌐 public (mijoz) vs 🔒 admin", ru: "Дверь и страж: @UseGuards + @Roles — 🌐 public (клиент) vs 🔒 admin" },
    { uz: "Yorliq: @ManyToOne — ko'p kitob → bitta yorliq (yorliq kitobda saqlanadi)", ru: "Ярлык: @ManyToOne — много книг → один ярлык (ярлык хранится на книге)" },
    { uz: "Kirish taxtasi: AppModule'ga ulanmagan bo'lim = 404", ru: "Входная вывеска: отдел, не подключённый к AppModule, = 404" },
    { uz: "AI yo'l qo'ygan ikki xatoni dalil bilan topdingiz (403 va ochiq qolgan eshik)", ru: "Две ошибки ИИ вы нашли по уликам (403 и незапертая дверь)" }
  ];
  const HOMEWORK = [
    { b: { uz: "O'z marketplace'ingiz", ru: "Свой маркетплейс" }, t: { uz: "— elektronika/kiyim do'koni: 3 resursni rejaga soling", ru: "— магазин электроники/одежды: распланируйте 3 ресурса" } },
    { b: "Playbook", t: { uz: "— har resurs uchun AI'ga beradigan aniq promptni yozing (5 qadam + AppModule'ga ulash)", ru: "— напишите чёткий промпт для ИИ на каждый ресурс (5 шагов + подключение к AppModule)" } },
    { b: { uz: "Tekshiruv", ru: "Проверка" }, t: { uz: "— har eshikni ikki rolda sinang: mijoz va admin", ru: "— испытайте каждую дверь в двух ролях: клиент и админ" } }
  ];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return <Stage eyebrow={tr2({ uz: "Tayyor", ru: "Готово" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Modulni yakunlash ✓", ru: "Завершить модуль ✓" })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr2({ uz: "Real backend qurdingiz", ru: "Вы построили настоящий бэкенд" })}</span><h2 className="title h-title fade-up d1">{tr2({ uz: <>Endi siz <span className="italic" style={{ color: T.accent }}>backend dasturchisi</span>siz.</>, ru: <>Теперь вы — <span className="italic" style={{ color: T.accent }}>бэкенд-разработчик</span>.</> })}</h2>{
    /* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */
  }</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? void 0 : openArena} hint={studentWait ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Подождите ментора" }) : void 0} />
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "📝 Uyga vazifa", ru: "📝 Домашнее задание" })}</div><ul>{HOMEWORK.map((h, i) => <li key={i}><b>{tr2(h.b)}</b> <span className="t">{tr2(h.t)}</span></li>)}</ul><p className="hw-note">{tr2({ uz: "🚀 Siz endi istalgan g'oyani backendga aylantira olasiz — agentni boshqarib, har eshikni tekshirib!", ru: "🚀 Теперь вы можете превратить любую идею в бэкенд — управляя агентом и проверяя каждую дверь!" })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "🏅 Nishonlaringiz", ru: "🏅 Ваши значки" })} — {achievements ? achievements.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
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
function NestArchPracticeLesson({ lang: langProp, onFinished, liveToken }) {
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
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16, Screen17, Screen19, ScreenKitobShopPractice, ScreenPodium, ScreenFlashcards, Screen20];
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
        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: default; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); }
        .tagpill { font-family: 'JetBrains Mono'; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); }

        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope'; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

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
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
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

        .h-title { font-size: clamp(22px,4vw,38px); } .h-sub { font-size: clamp(17px,2.5vw,22px); }
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

        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(15px,2.5vw,22px); box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        /* 11.6 RANG SEMANTIKASI — bir ma'no, bir rang:
           frame-warn/frame-soft = XATO-OGOHLANTIRISH (qizil) · frame-success = xulosa/muvaffaqiyat (yashil) · frame-wait = neytral DALIL/yo'riq (ko'k) */
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.dangerSoft}; border-left: 4px solid ${T.danger}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(194,54,43,0.24); }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

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
        .hint { background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono'; font-size: clamp(11.5px,1.5vw,13px); line-height: 1.55; padding: clamp(12px,2.2vw,15px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

        /* VS CODE EDITOR — oyna-chrome (yassi karta emas) */
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .editor { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .editor-bar { background: #2D2D2D; padding: 7px 11px; display: flex; align-items: center; gap: 9px; }
        .editor-tab { font-family: 'JetBrains Mono'; font-size: 11px; color: #C9D1D9; background: #1E1E1E; padding: 4px 11px; border-radius: 6px 6px 0 0; word-break: break-all; }
        .editor-body { background: ${CODE.bg}; padding: 12px 14px; }
        .editor-code { font-family: 'JetBrains Mono'; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.75; color: ${CODE.text}; white-space: pre-wrap; word-break: break-word; margin: 0; }
        .line-empty { color: ${CODE.comment}; font-style: italic; }

        /* PICK LINES */
        .pick-row { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 10px; padding: 10px 12px; cursor: pointer; transition: all 0.16s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); font-family: 'JetBrains Mono'; font-size: 11.5px; color: ${T.ink}; }
        .pick-row:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.22); }
        .pick-row.picked { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; cursor: default; }
        .pick-row:disabled { cursor: default; }
        .pick-plus { margin-left: auto; font-weight: 700; color: ${T.ink3}; } .pick-row.picked .pick-plus { color: ${T.success}; }

        /* AGENT CARD */
        .agent-card { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 10px; padding: 11px 14px; }
        .agent-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.blue}; display: block; margin-bottom: 4px; }
        .agent-msg { font-family: 'JetBrains Mono'; font-size: 12px; color: ${T.ink}; margin: 0; line-height: 1.55; }
        .prompt-box { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 10px; padding: 12px 15px; }

        /* AGENT FILE GENERATION */
        .gen-file { display: flex; align-items: center; gap: 9px; background: ${T.paper}; border-radius: 9px; padding: 9px 12px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); font-size: 12px; transition: all 0.2s; }
        .gen-file.ready { box-shadow: inset 0 0 0 1.5px ${T.success}33, 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .gen-ico { font-weight: 800; min-width: 16px; text-align: center; }
        .gen-file .mono { font-family: 'JetBrains Mono'; font-size: 11.5px; color: ${T.ink}; }
        .gen-d { font-size: 10px; color: ${T.ink2}; font-weight: 600; margin-left: auto; text-align: right; }

        /* AI DEBUG CARD */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 14px 16px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); display: flex; flex-direction: column; gap: 11px; }
        .ai-row { display: flex; gap: 8px; align-items: flex-start; }
        .ai-badge { background: ${T.nest}; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 10px; padding: 4px 8px; border-radius: 6px; flex-shrink: 0; }
        .ai-bubble { background: ${T.bg}; border-radius: 4px 12px 12px 12px; padding: 9px 12px; font-size: 13px; color: ${T.ink}; }
        .ai-code { background: ${CODE.bg}; border-radius: 10px; padding: 10px 11px; display: flex; flex-direction: column; gap: 2px; transition: opacity 0.3s ease; }
        .ai-code-h { display: flex; align-items: center; gap: 9px; margin: -10px -11px 8px; padding: 7px 11px; background: rgba(255,255,255,0.06); border-radius: 10px 10px 0 0; }
        .ai-code-t { font-family: 'JetBrains Mono'; font-size: 10.5px; font-weight: 700; color: ${CODE.punct}; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 11.5px; color: ${CODE.text}; padding: 5px 7px; border-radius: 6px; cursor: pointer; transition: all 0.16s; }
        .ai-line:hover { background: rgba(255,255,255,0.07); }
        .ai-line.bad { background: rgba(194,54,43,0.26); box-shadow: inset 0 0 0 1.5px ${T.danger}; }
        .ai-line.ok { opacity: 0.4; text-decoration: line-through; cursor: default; }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; font-style: italic; margin: 0; }
        .takeaway { background: ${T.successSoft}; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; align-items: center; gap: 3px; text-align: center; }
        .ta-bulb { font-size: 26px; } .ta-h { font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: ${T.ink}; margin: 0; } .ta-sub { font-size: 12px; color: ${T.ink2}; margin: 0; }


        /* AUTH ROW (s7) */
        .auth-row { display: flex; align-items: center; gap: 8px; background: ${T.paper}; border-radius: 10px; padding: 9px 12px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .auth-btn { font-family: 'Manrope'; font-weight: 700; font-size: 12px; padding: 7px 12px; border-radius: 8px; border: none; background: ${T.bg}; color: ${T.ink2}; cursor: pointer; transition: all 0.16s; }
        .auth-btn:hover:not(:disabled) { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.25); }
        .auth-btn:disabled { cursor: default; }
        .auth-btn.ok { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .auth-btn.bad { background: ${T.accentSoft}; color: ${T.danger}; }

        /* SWAGGER */
        .swg { border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.18); }
        .swg-top { background: #173647; color: #fff; padding: 10px 13px; font-family: 'Manrope'; font-weight: 800; font-size: 13px; display: flex; align-items: center; gap: 8px; } .swg-dot { width: 8px; height: 8px; border-radius: 50%; background: #49cc90; } .swg-ver { font-family: 'JetBrains Mono'; font-weight: 400; font-size: 11px; color: #9FB4D8; margin-left: auto; }
        .swg-row { border-bottom: 1px solid #eee; }
        .swg-head { width: 100%; display: flex; align-items: center; gap: 9px; padding: 9px 11px; background: #fff; border: none; cursor: pointer; text-align: left; }
        .swg-head:hover { background: #FBFAF7; }
        .swg-m { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 10px; color: #fff; padding: 3px 8px; border-radius: 5px; min-width: 52px; text-align: center; }
        .swg-path { font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 700; color: ${T.ink}; }
        .swg-sum { font-size: 11px; color: ${T.ink3}; margin-left: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .swg-chev { color: ${T.ink3}; font-size: 11px; }
        .swg-detail { padding: 11px; background: #F8FAFB; display: flex; flex-direction: column; gap: 8px; }
        .swg-code-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.ink2}; }
        .json { background: ${CODE.bg}; color: ${CODE.text}; border-radius: 9px; padding: 10px 12px; font-family: 'JetBrains Mono'; font-size: 11px; white-space: pre-wrap; word-break: break-word; line-height: 1.6; margin: 0; }

        /* SO'ROV YO'LI */
        .flow-rail { display: flex; flex-direction: column; gap: 2px; }
        .flow-stop { display: flex; flex-direction: column; align-items: flex-start; transition: opacity 0.3s; }
        .flow-stop > span { display: inline-flex; }
        .flow-ico { width: 34px; height: 34px; border-radius: 9px; align-items: center; justify-content: center; font-size: 17px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.2); transition: all 0.3s; }
        .flow-k { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; margin: 3px 0 0 6px; }
        .flow-down { font-size: 15px; margin: 1px 0 1px 9px; line-height: 1; transition: color 0.3s; }

        /* ENTITY ROWS */
        .ent-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-family: 'JetBrains Mono'; font-size: 11.5px; padding: 7px 10px; border-radius: 8px; margin-bottom: 5px; }
        .ent-row span { font-size: 10px; font-weight: 700; }
        .ent-row.siz { background: ${T.accentSoft}; color: ${T.ink}; } .ent-row.siz span { color: ${T.accent}; }
        .ent-row.free { background: ${T.successSoft}; color: ${T.ink}; } .ent-row.free span { color: ${T.success}; }

        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: shake 0.4s ease; }

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
        /* bosilgani ✓ bilan "muhrlanadi" — jonli progress signali */
        @keyframes tap-tick-pop { 0% { transform: scale(0) rotate(-25deg); opacity: 0; } 55% { transform: scale(1.45) rotate(6deg); opacity: 1; } 78% { transform: scale(0.92); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        .vseen.tick { display: inline-block; animation: tap-tick-pop 0.44s cubic-bezier(.34,1.56,.44,1) both; }

        /* === ♿ TINCH VARIANT — har og'ir/takrorlanuvchi harakat bilan BIRGA tug'iladi (keyin emas) === */
        @media (prefers-reduced-motion: reduce) {
          .tap-hint, .ev-row.hot, .shop-sign.open, .mstats-reveal.ready { animation: none !important; }
          .vseen.tick, .bk-tag, .sh.catch, .dr-cell.rej, .dr-cell.ok, .ev-row.fixed, .cl-row.liar, .shake { animation: none !important; }
          .bk.drag, .sh, .bk { transition: none !important; }
          .bk:hover, .sh:hover, .sh.over { transform: none; }
          .fade-up, .fade-step, .el-in { animation-duration: 0.01ms !important; }
        }


        /* === 🧵 MEROS TASMASI (Beat 0) === */
        .lg-rail { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        @media (max-width: 640px) { .lg-rail { grid-template-columns: 1fr; } }
        .lg-card { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 13px; cursor: pointer; text-align: left; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); transition: all 0.18s; }
        .lg-card:hover { transform: translateY(-1px); }
        .lg-card.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22); }
        .lg-ic { font-size: 20px; }
        .lg-t { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .lg-s { font-size: 11px; color: ${T.ink2}; font-weight: 600; }
        .lg-staff { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; opacity: 0.22; transition: opacity 0.35s ease; }
        .lg-staff.lit { opacity: 1; }
        .lg-staff i { font-style: normal; font-family: 'JetBrains Mono'; font-size: 9.5px; font-weight: 600; color: ${T.ink2}; background: ${T.bg}; border-radius: 99px; padding: 2px 7px; }

        /* === 🏷️ YORLIQ — kitoblar va rastalar (Beat 2) === */
        .bk-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        @media (max-width: 640px) { .bk-grid { grid-template-columns: repeat(2, 1fr); } }
        /* BEAT 2 — kitob (muqova + tikuv) va rasta (do'kon peshtaxtasi) */
        /* touch-action:none — barmoq bilan sudraganda sahifa SILJIMAYDI (mobil sudrash shu bilan tiriladi) */
        .bk { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; background: linear-gradient(135deg, ${T.paper} 60%, #FBF8F2); border: none; border-left: 5px solid rgba(${T.shadowBase},0.22); border-radius: 4px 10px 10px 4px; padding: 10px 10px 9px 9px; cursor: grab; text-align: left; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.18); transition: all 0.16s; min-height: 80px; touch-action: none; user-select: none; -webkit-user-select: none; }
        .bk:hover { transform: translateY(-2px); }
        .bk.sel { border-left-color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.28); }
        .bk.done { background: linear-gradient(135deg, ${T.successSoft} 60%, ${T.paper}); border-left-color: ${T.success}; cursor: pointer; }
        .bk.lit { border-left-color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}, 0 8px 22px -6px rgba(31,122,77,0.32); }
        /* qo'lda ko'tarilgan kitob — hover transform o'chadi (inline DOM-transform bilan urishmasin) */
        .bk.drag { cursor: grabbing; transition: none !important; box-shadow: 0 18px 34px -10px rgba(${T.shadowBase},0.34), inset 0 0 0 2px ${T.accent}; }
        .bk.drag:hover { transform: none; }
        .bk-t { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink}; line-height: 1.25; }
        .bk-a { font-size: 10px; color: ${T.ink3}; font-weight: 600; }
        /* 🏷️ yorliq MUQOVAGA muhrlanadi — darsning eng muhim kadri (ko'zga tashlansin) */
        .bk-tag { font-family: 'JetBrains Mono'; font-size: 9.5px; font-weight: 700; color: ${T.success}; background: ${T.paper}; border-radius: 99px; padding: 2px 7px; margin-top: auto; box-shadow: inset 0 0 0 1px ${T.success}66; animation: bk-stamp 0.52s cubic-bezier(.3,1.25,.4,1) both; }
        @keyframes bk-stamp { 0% { transform: scale(2.2) rotate(-15deg); opacity: 0; } 40% { opacity: 1; } 62% { transform: scale(0.9) rotate(3deg); opacity: 1; } 80% { transform: scale(1.06) rotate(-1deg); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        .sh { display: flex; flex-direction: column; gap: 5px; background: ${T.paper}; border: none; border-bottom: 5px solid rgba(180,83,9,0.28); border-radius: 12px 12px 5px 5px; padding: 11px 13px 10px; width: 100%; text-align: left; cursor: pointer; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); transition: all 0.16s; }
        .sh:hover { transform: translateY(-1px); }
        .sh.on { border-bottom-color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}, 0 8px 20px -6px rgba(31,122,77,0.22); }
        /* kitob ustida turibdi — rasta "og'zini ochadi" */
        .sh.over { transform: translateY(-3px) scale(1.015); border-bottom-color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 14px 28px -8px rgba(255,79,40,0.3); }
        /* rasta kitobni ushlab oldi */
        .sh.catch { animation: sh-catch 0.43s cubic-bezier(.34,1.5,.4,1); }
        @keyframes sh-catch { 0% { transform: scale(1); } 34% { transform: scale(1.045) translateY(-3px); } 68% { transform: scale(0.985) translateY(1px); } 100% { transform: scale(1); } }
        .sh-h { display: flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .sh-n { margin-left: auto; font-family: 'JetBrains Mono'; font-size: 10.5px; color: ${T.ink3}; font-weight: 700; }
        .sh-b { font-family: 'JetBrains Mono'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.5; }

        /* === 🚪 ESHIK SINOVI (Beat 3) === */
        .dr-tbl { display: flex; flex-direction: column; gap: 6px; }
        .dr-head { display: flex; align-items: center; gap: 8px; padding: 0 10px 1px; }
        .dr-head .dr-ep { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink3}; }
        .dr-hc { flex: 0 0 auto; width: 92px; text-align: center; font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .dr-row { display: flex; align-items: center; gap: 8px; background: ${T.paper}; border-radius: 10px; padding: 8px 10px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .dr-ep { font-family: 'JetBrains Mono'; font-size: 11.5px; font-weight: 700; color: ${T.ink}; flex: 1; min-width: 0; }
        .dr-cell { flex: 0 0 auto; width: 92px; box-sizing: border-box; font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; border: none; border-radius: 8px; padding: 6px 8px; background: ${T.bg}; color: ${T.ink2}; cursor: pointer; transition: all 0.16s; }
        .dr-cell:hover:not(:disabled) { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.25); }
        .dr-cell:disabled { cursor: default; }
        .dr-cell.ok { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .dr-cell.bad { background: ${T.dangerSoft}; color: ${T.danger}; box-shadow: inset 0 0 0 1.5px ${T.danger}66; }
        /* 🚪 401/403 = qo'riqchi eshikdan ORQAGA ITARADI · 200/201 = ichkariga kiritadi (oqibat ko'rinadi, o'qilmaydi) */
        .dr-cell.rej { animation: dr-reject 0.58s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes dr-reject { 0% { transform: translateX(0) scale(1); } 16% { transform: translateX(7px) scale(1.05); } 40% { transform: translateX(-8px) scale(0.96); } 60% { transform: translateX(5px); } 78% { transform: translateX(-3px); } 100% { transform: none; } }
        .dr-cell.ok:not(.rej) { animation: dr-enter 0.42s cubic-bezier(.34,1.5,.4,1) both; }
        @keyframes dr-enter { 0% { transform: scale(0.88); } 55% { transform: scale(1.07); } 100% { transform: scale(1); } }

        /* === 🔓 OCHILISH TEKSHIRUVI (Beat 4) === */
        .cl-row { display: flex; align-items: center; gap: 9px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 11px; padding: 11px 13px; cursor: pointer; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink}; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); transition: all 0.16s; }
        .cl-row:hover:not(:disabled) { transform: translateY(-1px); }
        .cl-row.checked { background: ${T.successSoft}; color: ${T.success}; }
        .cl-row.liar { background: ${T.dangerSoft}; color: ${T.danger}; box-shadow: inset 0 0 0 1.5px ${T.danger}; animation: cl-liar 0.55s cubic-bezier(.34,1.45,.4,1) both; }
        @keyframes cl-liar { 0% { transform: scale(1); } 30% { transform: scale(1.035) translateX(-2px); } 55% { transform: scale(1.01) translateX(2px); } 100% { transform: scale(1); } }
        .cl-row:disabled { cursor: default; }
        .cl-n { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 11px; color: ${T.ink3}; min-width: 16px; }
        .ev-row { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono'; font-size: 11px; padding: 7px 9px; border-radius: 8px; background: ${T.bg}; margin-bottom: 5px; transition: all 0.3s ease; }
        /* ochiq qolgan eshik SIGNAL BERADI — jim turmaydi (topilgach to'xtamaydi, qo'riqchi qo'yilguncha) */
        .ev-row.hot { background: ${T.dangerSoft}; box-shadow: inset 0 0 0 1.5px ${T.danger}66; animation: ev-alarm 1.7s ease-in-out infinite; }
        @keyframes ev-alarm { 0%, 62%, 100% { transform: translateX(0); } 68% { transform: translateX(-3px); } 74% { transform: translateX(3px); } 80% { transform: translateX(-2px); } 86% { transform: translateX(1px); } }
        .ev-row.fixed { background: ${T.successSoft}; animation: ev-lock 0.5s cubic-bezier(.34,1.5,.4,1) both; }
        @keyframes ev-lock { 0% { transform: scale(0.97); } 45% { transform: scale(1.025); } 100% { transform: scale(1); } }
        .ev-m { font-weight: 700; color: ${T.ink}; min-width: 58px; }
        /* eshik chipi: 🌐 public — ochiq (neytral-ko'k, XATO EMAS) · 🔒 admin — qulflangan (yashil = himoyalangan) */
        .ev-tag { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 99px; padding: 3px 9px; white-space: nowrap; }
        .ev-tag.open { background: ${T.blueSoft}; color: ${T.blue}; box-shadow: inset 0 0 0 1px ${T.blue}55; }
        .ev-tag.lock { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1px ${T.success}66; }
        /* BEAT 4 — peshtaxta yozuvi (yopiq: xira taxta · OCHIQ: yashil neon) */
        .shop-sign { display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: 14px; padding: 17px 14px; font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.7vw,15px); letter-spacing: 0.1em; text-transform: uppercase; background: ${T.bg}; color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.ink3}44; transition: all 0.45s ease; }
        .shop-sign.open { background: linear-gradient(160deg, ${T.successSoft}, ${T.paper}); color: ${T.success}; text-shadow: 0 0 14px rgba(31,122,77,0.35); box-shadow: inset 0 0 0 2px ${T.success}, 0 0 34px -6px rgba(31,122,77,0.55), 0 10px 26px -10px rgba(${T.shadowBase},0.3);
          animation: sign-ignite 1.15s ease-out both, sign-hum 3.6s ease-in-out 1.15s infinite; }
        /* neon peshtaxta YONADI: bir-ikki pirillaydi, so'ng barqaror nafas oladi = "KitobShop ochildi" */
        @keyframes sign-ignite { 0% { opacity: 0.45; filter: brightness(0.55) saturate(0.5); transform: scale(0.985); } 10% { opacity: 1; filter: brightness(1.55) saturate(1.1); } 17% { opacity: 0.5; filter: brightness(0.6) saturate(0.6); } 27% { opacity: 1; filter: brightness(1.45); transform: scale(1.012); } 35% { opacity: 0.62; filter: brightness(0.75); } 46% { opacity: 1; filter: brightness(1.3); } 58% { opacity: 0.85; filter: brightness(0.95); transform: scale(1); } 72%, 100% { opacity: 1; filter: none; transform: scale(1); } }
        @keyframes sign-hum { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.11); } }

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
        /* «✅ Bajardim» → mentor-gate: tugma MUHRLANADI (pop + yorug'lik supurgisi) — o'quvchi tasdiqni KO'RADI */
        .lp-done-btn.is-done { position: relative; overflow: hidden; background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; animation: lp-done-pop 0.44s cubic-bezier(.3,1.35,.5,1); }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        .lp-done-btn.is-done::after { content: ''; position: absolute; top: 0; bottom: 0; left: -60%; width: 42%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.85), transparent); transform: skewX(-18deg); animation: lp-sweep 1.05s cubic-bezier(.4,0,.2,1) 0.2s 1 both; }
        @keyframes lp-sweep { to { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done, .lp-done-btn.is-done::after { animation: none !important; } .lp-done-btn.is-done::after { display: none; } }
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }
        .bhint.bhint { margin: 0; align-self: flex-start; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 14px; box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
        .bhint.bhint.calm { color: ${T.ink2}; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; font-style: italic; }
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
        /* 11.8 — .qcode chipi qorong'i arena yuzasida: yorug' fon, oq matn (aks holda ko'rinmaydi) */
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


        /* option-wait (jonli test kutish holati) — sekin nafas pulsatsiyasi (natija ochilishini kutmoqda) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; animation: ow-breathe 1.9s ease-in-out infinite; }
        @keyframes ow-breathe { 0%,100% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3); } 50% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 30px -6px rgba(1,154,203,0.5); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

        /* === 🛠️ JONLI PRAKTIKA — mentor «kim bajardi» chiplari === */
        .lp-doer { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; color: ${T.ink2}; background: rgba(58,53,48,0.07); border-radius: 99px; padding: 4px 11px; white-space: nowrap; }
        .lp-doer.done { color: ${T.success}; background: ${T.successSoft}; }

        /* === ⚡ LIVE BADGE — sekundar UI: kerak bo'lguncha xira (L1 etalon) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={{ uz: "KitobShop praktikasi", ru: "Практика KitobShop" }} /> : <>
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
  NestArchPracticeLesson as default
};
