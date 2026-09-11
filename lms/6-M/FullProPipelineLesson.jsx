// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/4c-Modull/FullProPipelineLesson.jsx
//  Kompilyator: yo'q (dars uni import qilmaydi)
//  Qayta yig'ish:  node scripts/build-lms.mjs src/4c-Modull/FullProPipelineLesson.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/4c-Modull/FullProPipelineLesson.jsx
import React3, { useState as useState3, useEffect as useEffect4, useLayoutEffect, useRef as useRef3, createContext as createContext2, useContext as useContext2, useCallback as useCallback2, useMemo } from "react";

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

// src/4c-Modull/FullProPipelineLesson.jsx
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
var LESSON_META = { lessonId: "full-pro-pipeline-4c-04-v18", lessonTitle: { uz: "Loyiha kuni: ishonchli lenta", ru: "Проектный день: надёжная лента" } };
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
  { id: "s7", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s8", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s9", type: "case", template: "custom", scored: false, scope: null },
  { id: "s10", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s11", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s12", type: "case", template: "custom", scored: false, scope: null },
  { id: "s13", type: "builder", template: "custom", scored: false, scope: null },
  { id: "s14", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
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
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr2({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Ментор ещё не открыл эту страницу" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? tr2({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите ментора" }) : freeRide && disabled ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2(label)}</button>;
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
var MSTATS_COLORS = ["#019ACB", "#8B5CF6", "#E8A13A", "#E0559A"];
var RECAP_NEED_PCT = 60;
var RECAP_GOOD_PCT = 75;
var RECAP_MIN_ANSWERS = 3;
var RcFlow = ({ items, sep = "→" }) => <div className="rc-flow">{items.map((t, i) => <React3.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React3.Fragment>)}</div>;
var INLINE_KEYS = { s4: 1, s8: 3, s10: 0, s14: 2, s15: 0, practice: -1 };
var RECAPS = {
  4: {
    title: { uz: "Matrix — parallel lentalar", ru: "Matrix — параллельные ленты" },
    cards: [
      { ic: "🧬", h: { uz: "Bir nechta muhit", ru: "Несколько сред" }, body: { uz: <>Matrix bitta yukni <b>bir necha muhitda</b> (masalan Node 18/20/22) bir vaqtda tekshiradi.</>, ru: <>Matrix проверяет один груз <b>в нескольких средах</b> (например, Node 18/20/22) одновременно.</> } },
      { ic: "🔍", h: { uz: "Muammoni oldindan topadi", ru: "Находит проблему заранее" }, body: { uz: <>Bitta muhitda yashil, boshqasida qizil bo'lishi mumkin — matrix buni <b>productiondan oldin</b> ko'rsatadi.</>, ru: <>В одной среде может быть зелёный, в другой — красный. Matrix покажет это <b>до продакшена</b>.</> } },
      { ic: "🚦", h: { uz: "Faqat singan muhit qizil", ru: "Красной становится только сломанная среда" }, body: { uz: <>Qolgan muhitlar davom etadi — aynan qaysi sharoitda singani aniq bo'ladi.</>, ru: <>Остальные среды продолжают работать — и сразу видно, в каких именно условиях всё сломалось.</> }, ask: { uz: "Matrix nechta muhitni bir vaqtda tekshiradi?", ru: "Сколько сред matrix проверяет одновременно?" } }
    ]
  },
  8: {
    title: { uz: "Cache — yaqin javon", ru: "Cache — ближняя полка" },
    cards: [
      { ic: "💨", h: { uz: "Birinchi reys sekin", ru: "Первый рейс медленный" }, body: { uz: <>Yaqin javon bo'lmasa, har reysda paketlar <b>noldan</b> yuklanadi — 40 soniya.</>, ru: <>Без ближней полки пакеты на каждом рейсе загружаются <b>с нуля</b> — 40 секунд.</> } },
      { ic: "⚡", h: { uz: "Keyingi reys tez", ru: "Следующий рейс быстрый" }, body: { uz: <>Yaqin javon bilan avvalgi paketlar saqlanadi — 8 soniya, <b>5 baravar tezroq</b>.</>, ru: <>С ближней полкой прежние пакеты сохраняются — 8 секунд, <b>в 5 раз быстрее</b>.</> } },
      { ic: "📦", h: { uz: "Nima saqlanadi", ru: "Что сохраняется" }, body: { uz: <>Odatda <span className="mono">node_modules</span> — o'zgarmagan paketlarni qayta yuklash shart emas.</>, ru: <>Обычно <span className="mono">node_modules</span> — незачем заново скачивать пакеты, которые не менялись.</> }, ask: { uz: "Yaqin javon (cache) nimani tezlashtiradi?", ru: "Что ускоряет ближняя полка (cache)?" } }
    ]
  },
  10: {
    title: { uz: "Seyf — maxfiy kalit", ru: "Сейф — секретный ключ" },
    cards: [
      { ic: "🔓", h: { uz: "Ochiq yozilsa — xavfli", ru: "Записан открыто — опасно" }, body: { uz: <>Kalit yo'l xaritasida ochiq yozilsa, repo ochiq bo'lganda <b>hamma uni ko'radi</b>.</>, ru: <>Если ключ записан в маршрутной карте открыто, то в открытом репозитории <b>его увидят все</b>.</> } },
      { ic: "🔐", h: { uz: "Seyfga qo'yilsa — xavfsiz", ru: "Лежит в сейфе — безопасно" }, body: { uz: <>Platformaning maxsus seyfiga saqlanadi, kod ichida faqat <span className="mono">{"${{ secrets.API_KEY }}"}</span> ko'rinadi.</>, ru: <>Хранится в специальном сейфе платформы, а в коде видно только <span className="mono">{"${{ secrets.API_KEY }}"}</span>.</> } },
      { ic: "🛡️", h: { uz: "Jurnalda ham yashirin", ru: "Скрыт даже в журнале" }, body: { uz: <>Seyfdagi qiymat lenta jurnalida ham yulduzchalar bilan yashiriladi.</>, ru: <>Значение из сейфа даже в журнале ленты закрывается звёздочками.</> }, ask: { uz: "Maxfiy kalit qayerda saqlanishi kerak?", ru: "Где должен храниться секретный ключ?" } }
    ]
  },
  14: {
    title: { uz: "Rollback — eski yukni qaytarish", ru: "Rollback — возврат старого багажа" },
    cards: [
      { ic: "💥", h: { uz: "Yangi yuk buzuq chiqdi", ru: "Новый багаж оказался сломанным" }, body: { uz: <>Ba'zan sinov reysida yashil bo'lgan yuk ham haqiqiy reysda kutilmagan xato beradi.</>, ru: <>Иногда даже груз, зелёный на тестовом рейсе, на настоящем рейсе выдаёт неожиданную ошибку.</> } },
      { ic: "⏪", h: { uz: "Bir bosishda qaytarish", ru: "Возврат в один клик" }, body: { uz: <>Rollback — oldingi <b>ishlaydigan</b> yukka darhol qaytish.</>, ru: <>Rollback — мгновенное возвращение к прежнему <b>рабочему</b> багажу.</> } },
      { ic: "🛡️", h: { uz: "Yo'lovchi tinch", ru: "Пассажир спокоен" }, body: { uz: <>Tez rollback qilinsa, ko'pchilik yo'lovchi muammoni sezmay ham qoladi.</>, ru: <>Если откатиться быстро, большинство пассажиров даже не заметит проблему.</> }, ask: { uz: "Eski yukni qaytarish (rollback) qachon ishlatiladi?", ru: "Когда используется возврат старого багажа (rollback)?" } }
    ]
  },
  15: {
    title: { uz: "Ishonchli lenta tartibi", ru: "Порядок надёжной ленты" },
    cards: [
      { ic: "🧬", h: { uz: "Avval — parallel tekshirish", ru: "Сначала — параллельная проверка" }, body: { uz: <>Matrix bir nechta muhitda birdan tekshiradi.</>, ru: <>Matrix проверяет сразу в нескольких средах.</> } },
      { ic: "🔐", h: { uz: "Keyin — seyfdan kalit", ru: "Потом — ключ из сейфа" }, body: { uz: <>O'rash va uchirish uchun kerakli maxfiy kalitlar seyfdan olinadi.</>, ru: <>Секретные ключи для упаковки и взлёта берутся из сейфа.</> } },
      { ic: "🛫", h: { uz: "Sinov reysi, keyin haqiqiy reys", ru: "Тестовый рейс, потом настоящий" }, body: { uz: <>Avval sinov reysida tekshiriladi, keyingina haqiqiy reysga chiqadi.</>, ru: <>Сначала проверка на тестовом рейсе, и только потом выход на настоящий рейс.</> }, vis: <RcFlow items={["🧬 Matrix", "💨 Cache", "🔐 Secret", "🛫 Staging", "✈️ Production"]} />, ask: { uz: "Sinov reysi va haqiqiy reys tartibi qanday bo'lishi kerak?", ru: "В каком порядке идут тестовый и настоящий рейсы?" } }
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
        {card.ask && <div className="rc-ask">🗣️ {tr2({ uz: "Sinfga savol:", ru: "Вопрос классу:" })} {tr2(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr2({ uz: "← Oldingi", ru: "← Предыдущая" })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={tr2({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
        {last ? <button className="rc-btn done" onClick={onClose}>{tr2({ uz: "✓ Tushunarli — davom etamiz", ru: "✓ Понятно — продолжаем" })}</button> : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr2({ uz: "Keyingisi →", ru: "Дальше →" })}</button>}
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
      {!reveal && answered > 0 && <p className="mstats-hidden">{tr2({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: "🙈 Кто что выбрал и счёт ✅/❌ скрыты — по нажатию «Открыть результат» всё откроется сразу и у вас, и на экранах учеников." })}</p>}
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
              <p className="mstats-verdict-t">{tr2({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — класс не разобрался в этой теме. Прежде чем идти дальше, стоит коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr2({ uz: "Qayta tushuntirish", ru: "Разбор ещё раз" })} — {tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === "maybe" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите, прежде чем продолжать.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr2({ uz: "📖 Qisqa takrorlash", ru: "📖 Короткое повторение" })}</button>}
            </>}
            {level === "good" && <p className="mstats-verdict-t">{tr2({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === "few" && <p className="mstats-verdict-t">{tr2({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — судить по процентам рано. Оцените сами.</> })}</p>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr2({ uz: "⏳ Kutilmoqda:", ru: "⏳ Ждём:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">{tr2({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Yana bir bor tushuntiring.", ru: "⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Стоит объяснить её ещё раз." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr2({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь в реальном времени…" })}</p>}
    </div>;
}
var QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext2(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === "student");
  const isMentorLive = !!(live && live.mode === "mentor");
  const mountTs = useRef3(Date.now());
  const ouz = (o) => o && o.uz || o;
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
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ouz), correctIndex: correctIdx, correctAnswer: ouz(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ouz(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ouz), correctIndex: correctIdx, correctAnswer: ouz(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ouz(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    if (live && live.recordAttempt) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options: options.map(ouz), picked: ouz(options[i]), correct: ouz(options[correctIdx]), lang: typeof __lang !== "undefined" && __lang === "ru" ? "ru" : "uz" });
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === "ended" || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? mReveal ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval natijani oching", ru: "Сначала откройте результат" }) : solved ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : oneShot ? tr2({ uz: "Javob tanlang", ru: "Выберите ответ" }) : tr2({ uz: "To'g'ri javobni toping", ru: "Найдите правильный ответ" })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? "flex-start" : "center", gap: "clamp(16px,2.5vw,24px)" }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: "-8px 0 0", color: T.accent, fontWeight: 600 }}>{tr2({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: "⚡ Живой урок — одна попытка, подумайте, прежде чем нажать!" })}</p>}
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
            {isMentorLive ? <>✓ {tr2({ uz: "To'g'ri javob:", ru: "Правильный ответ:" })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr2(options[correctIdx]))}</> : waiting ? tr2({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? <>{tr2({ uz: "To'g'ri javob:", ru: "Правильный ответ:" })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr2(options[correctIdx]))}</> : solved ? tr2({ uz: "To'g'ri", ru: "Верно" }) : tr2({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive ? fmtCode(tr2(explainCorrect)) : waiting ? tr2({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: "Сейчас узнаете правильный ответ." }) : wrongLocked ? fmtCode(tr2(explainWrong[picked] ?? explainWrong.default)) : solved ? fmtCode(tr2(explainCorrect)) : fmtCode(tr2(explainWrong[picked] ?? explainWrong.default))}
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
        <span className="mentor-name">{tr2({ uz: "Mentor", ru: "Ментор" })}{collapsed && <span className="mentor-cue"> · {tr2({ uz: "ko'rsatmani ochish", ru: "открыть подсказку" })} ▾</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>;
};
var At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
var St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
var Term = ({ title = "Terminal", children, minH }) => <div className="term"><div className="term-bar"><span className="bb-dots"><i /><i /><i /></span><span className="term-title">{title}</span></div><div className="term-body" style={{ minHeight: minH }}>{children}</div></div>;
var TLine = ({ cmd, out, col }) => <div className="el-in tline">{cmd ? <><span style={{ color: CODE.str }}>$</span> <span style={{ color: CODE.text }}>{cmd}</span></> : <span style={{ color: col || CODE.comment }}>{out}</span>}</div>;
var POINTS = [
  { id: "install", icon: "📦", label: { uz: "Yig'ish", ru: "Сборка" }, cmd: "npm install", d: { uz: "Kerakli paketlarni o'rnatadi — toza muhitda boshlaydi.", ru: "Устанавливает нужные пакеты — начинает в чистой среде." } },
  { id: "test", icon: "🔍", label: { uz: "Skaner", ru: "Сканер" }, cmd: "npm test", d: { uz: "Testlarni ishga tushiradi — kod to'g'ri ishlayaptimi?", ru: "Запускает тесты — правильно ли работает код?" } },
  { id: "lint", icon: "📐", label: { uz: "O'lcham ramkasi", ru: "Калибр" }, cmd: "eslint .", d: { uz: "Kod qoidalarga mos yozilganini tekshiradi.", ru: "Проверяет, что код написан по правилам." } },
  { id: "build", icon: "🎁", label: { uz: "O'rash", ru: "Упаковка" }, cmd: "npm run build", d: { uz: "Yukni internetga tayyor holatga o'raydi (optimizatsiya qiladi).", ru: "Упаковывает груз в готовый для интернета вид (оптимизирует)." } },
  { id: "deploy", icon: "✈️", label: { uz: "Uchirish", ru: "Взлёт" }, cmd: "deploy", d: { uz: "Tayyor yukni internetga — yo'lovchi qo'liga chiqaradi.", ru: "Отправляет готовый груз в интернет — в руки пассажира." } }
];
var badgeOf = (s) => s === "pass" ? "✓" : s === "fail" ? "✗" : s === "run" ? "●" : s === "skip" ? "—" : " ";
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
            {sid ? <button key={sid} className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr2(byId[sid].label)}</button> : <span className="dd-hint">{hints ? tr2(hints[i]) : tr2({ uz: "bu yerga joylang", ru: "положите сюда" })}</span>}
          </div>)}
      </div>
      <div className="dd-pool">
        {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr2({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: "Порядок неверный — нажмите на блок, верните его и разложите заново" })}</span>}
        {pool.map((id) => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, "pool")}>{tr2(byId[id].label)}</button>)}
      </div>
      {solved && <div className="dd-done">✓ {tr2(doneText || { uz: "To'g'ri tartib!", ru: "Правильный порядок!" })}</div>}
      {wrong && !solved && <div className="dd-wrong">{tr2({ uz: "⚠️ Tartib xato — qayta joylang.", ru: "⚠️ Порядок неверный — разложите заново." })}</div>}
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
    { id: "a", label: { uz: "Productionni ham xuddi shu bitta muhitga moslab qo'yaman", ru: "Подгоню продакшен под эту же единственную среду" } },
    { id: "b", label: { uz: "Bir nechta muhitda (masalan Node 18/20/22) parallel tekshiraman", ru: "Проверю параллельно в нескольких средах (например, Node 18/20/22)" } },
    { id: "c", label: { uz: "E'tibor bermayman — ilgari ham baribir ishlagan edi", ru: "Не обращу внимания — раньше же как-то работало" } }
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
  return <Stage eyebrow={tr2({ uz: "Kirish", ru: "Введение" })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr2({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 880 }}>{tr2({ uz: <>Lentangiz yashil chiqdi — lekin productionda sayt <span className="italic" style={{ color: T.accent }}>ishlamay qoldi</span>. Nega?</>, ru: <>Ваша лента зелёная — но в продакшене сайт <span className="italic" style={{ color: T.accent }}>перестал работать</span>. Почему?</> })}</h1>
        <Mentor>{tr2({ uz: <>Oldingi darslarda to'liq lentani qurdingiz: <b style={{ color: T.ink }}>Yig'ish → Skaner → O'rash → Uchirish</b>. Hammasi yashil edi. Lekin production serverda boshqa muhit ishlatilar ekan. Tugmani bosing — nima bo'lganini ko'ramiz.</>, ru: <>На прошлых уроках вы собрали полную ленту: <b style={{ color: T.ink }}>Сборка → Сканер → Упаковка → Взлёт</b>. Всё было зелёным. Но оказалось, что на продакшен-сервере другая среда. Нажмите кнопку — посмотрим, что случилось.</> })}</Mentor>
        <Zoomable><Split>
          <Col>
            <Term title={tr2({ uz: "lenta jurnali", ru: "журнал ленты" })} minH={150}>
              <TLine cmd="npm test" />
              <TLine out={tr2({ uz: "✓ testlar yashil (Node 20 muhitida)", ru: "✓ тесты зелёные (в среде Node 20)" })} col={CODE.str} />
              <TLine cmd="deploy → production" />
              {tried && <>
                <TLine out={tr2({ uz: "⚠ production Node 18'da ishlaydi", ru: "⚠ продакшен работает на Node 18" })} col="#FF8A7A" />
                <TLine out={tr2({ uz: "✗ sayt production'da xato beryapti", ru: "✗ на продакшене сайт выдаёт ошибку" })} col="#FF8A7A" />
              </>}
            </Term>
            <button className={`btn-soft ${tried ? "" : "tap-hint"}`} style={{ alignSelf: "flex-start" }} onClick={poke} disabled={tried}>{tried ? tr2({ uz: "✓ Sabab topildi", ru: "✓ Причина найдена" }) : tr2({ uz: "▶ Production serverni tekshirish", ru: "▶ Проверить продакшен-сервер" })}</button>
            {tried && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Lenta faqat <b>bitta muhitda</b> (Node 20) tekshirilgan edi. Production esa boshqa versiyada ishlar ekan — farq shu yerda chiqdi.</>, ru: <>Лента проверялась только <b>в одной среде</b> (Node 20). А продакшен работает на другой версии — вот где вылезла разница.</> })}</p></div>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr2({ uz: "Bunday holatni qanday oldini olamiz?", ru: "Как предотвратить такую ситуацию?" })}</p>
            <div className="fade-up delay-3" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {OPTS.map((o) => {
    const on = picked === o.id;
    return <button key={o.id} className={`hook-option ${on ? "on" : ""}`} disabled={picked !== null || !tried} style={{ opacity: !tried ? 0.55 : 1 }} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr2(o.label)}</span></button>;
  })}
            </div>
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Avval tugmani bosing ←", ru: "Сначала нажмите кнопку ←" })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{picked === "b" ? tr2({ uz: <>Aynan! Bugun lentangizni <b>ishonchli</b> qilamiz: parallel lentalar, yaqin javon, seyf va sinov reysi bilan.</>, ru: <>Именно! Сегодня сделаем вашу ленту <b>надёжной</b>: параллельные ленты, ближняя полка, сейф и тестовый рейс.</> }) : tr2({ uz: <>Productionni bitta muhitga moslasangiz — boshqa server kelganda yana sinadi; e'tibor bermasangiz — xatoni foydalanuvchi topib beradi. Uchinchi yo'l: <b>bir nechta muhitda parallel tekshirish</b>. Bugun shundan boshlaymiz.</>, ru: <>Подогнать продакшен под одну среду — сломается снова на другом сервере; не обращать внимания — ошибку найдёт пользователь. Третий путь: <b>проверять параллельно в нескольких средах</b>. С этого сегодня и начнём.</> })}</p>}
          </Col>
        </Split></Zoomable>
      </div>
    </Stage>;
};
var Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: { uz: "Parallel lentalar — bir nechta muhitda birdan tekshirish", ru: "Параллельные ленты — проверка сразу в нескольких средах" }, tag: "matrix" },
    { text: { uz: "Yaqin javon — paketlarni qayta yuklamaslik", ru: "Ближняя полка — не скачивать пакеты заново" }, tag: "cache" },
    { text: { uz: "Seyf — maxfiy kalitni xavfsiz saqlash", ru: "Сейф — безопасное хранение секретного ключа" }, tag: "secrets" },
    { text: { uz: "Sinov reysi — haqiqiy reysdan oldin tekshirish", ru: "Тестовый рейс — проверка перед настоящим рейсом" }, tag: "staging" },
    { text: { uz: "Eski yukni qaytarish — muammo bo'lsa bir bosishda", ru: "Возврат старого багажа — в один клик, если что-то пошло не так" }, tag: "rollback" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState3(false);
  const Preview = <Col>
      <p className="flow-label">{tr2({ uz: "Dars oxirida — shu lentani yig'asiz", ru: "К концу урока вы соберёте вот эту ленту" })}</p>
      <Belt statuses={ALL_PASS} />
      <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Bitta yuk endi <b>3 muhitda</b> birdan tekshiriladi, <b style={{ color: T.success }}>yaqin javondan</b> tez o'tadi, kalitlar <b>seyfda</b>, va avval <b>sinov reysida</b> ko'riladi.</>, ru: <>Один груз теперь проверяется сразу <b>в 3 средах</b>, быстро проходит через <b style={{ color: T.success }}>ближнюю полку</b>, ключи — <b>в сейфе</b>, и сначала всё смотрится <b>на тестовом рейсе</b>.</> })}</p></div>
    </Col>;
  const StepsB = <Col>
      <p className="flow-label">{tr2({ uz: "Bugungi 5 qadam", ru: "Сегодняшние 5 шагов" })}</p>
      <ol className="roadmap">{STEPS.map((s, i) => <li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, "0")}</span><span className="step-body"><span className="step-text">{tr2(s.text)}</span><span className="step-tag">{s.tag}</span></span></li>)}</ol>
    </Col>;
  return <Stage eyebrow={tr2({ uz: "Reja", ru: "План" })} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={tr2({ uz: "Boshlaymiz →", ru: "Начнём →" })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Lentani <span className="italic" style={{ color: T.accent }}>ishonchli</span> qanday qilamiz?</>, ru: <>Как сделать ленту <span className="italic" style={{ color: T.accent }}>надёжной</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Bugun lentangizga 4 ta yaxshilash qo'shamiz — <b style={{ color: T.ink }}>tez, xavfsiz, qaytariladigan</b> — ya'ni ISHONCHLI bo'lishi uchun. Mana natija va unga olib boradigan 5 qadam.</>, ru: <>Сегодня добавим к вашей ленте 4 улучшения — чтобы она стала <b style={{ color: T.ink }}>быстрой, безопасной и обратимой</b> — то есть НАДЁЖНОЙ. Вот результат и 5 шагов, которые к нему ведут.</> })}</Mentor>
        {!isNarrow ? <Zoomable><Split>{Preview}{StepsB}</Split></Zoomable> : !showSteps ? <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>{Preview}<button className="btn" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(true)}>{tr2({ uz: "5 qadamni ko'rish", ru: "Посмотреть 5 шагов" })}</button></div> : <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}><button className="btn-soft" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(false)}>{tr2({ uz: "↩ Lentani ko'rish", ru: "↩ Посмотреть ленту" })}</button>{StepsB}</div>}
      </div>
    </Stage>;
};
var MATRIX_ENVS = [
  { id: "node18", icon: "🟩", label: "Node 18", d: { uz: "Ba'zi eski serverlar hali shu versiyada ishlaydi — moslikni shu yerda tekshiramiz.", ru: "Некоторые старые серверы всё ещё работают на этой версии — здесь проверяем совместимость." } },
  { id: "node20", icon: "🟦", label: "Node 20", d: { uz: "Hozirgi standart versiya — asosiy ishlab chiqish shu yerda boradi.", ru: "Текущая стандартная версия — основная разработка идёт здесь." } },
  { id: "node22", icon: "🟨", label: "Node 22", d: { uz: "Eng yangi versiya — kelajakda o'tish uchun oldindan tayyorlanamiz.", ru: "Самая новая версия — заранее готовимся к будущему переходу." } }
];
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState3(storedAnswer ? new Set(MATRIX_ENVS.map((e) => e.id)) : /* @__PURE__ */ new Set());
  const [active, setActive] = useState3(null);
  const [sc, setSc] = useState3(0);
  const done = seen.size >= MATRIX_ENVS.length;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, seen.size);
  const firstUnseen = (MATRIX_ENVS.find((e) => !seen.has(e.id)) || {}).id;
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
  const cur = MATRIX_ENVS.find((e) => e.id === active);
  return <Stage eyebrow={tr2({ uz: "Tushuncha · matrix", ru: "Понятие · matrix" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : `${tr2({ uz: "3 muhitni ko'ring", ru: "Посмотрите 3 среды" })} (${seen.size}/3)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Parallel lentalar — bitta yuk, <span className="italic" style={{ color: T.accent }}>bir nechta muhit</span>.</>, ru: <>Параллельные ленты — один груз, <span className="italic" style={{ color: T.accent }}>несколько сред</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <><b style={{ color: T.ink }}>Matrix</b> — bitta yukni bir vaqtning o'zida bir necha muhitda parallel tekshiradi. Har muhitni bosing.</>, ru: <><b style={{ color: T.ink }}>Matrix</b> проверяет один груз параллельно в нескольких средах одновременно. Нажмите на каждую среду.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Qolgan muhitni bosing — har biri lentaning bitta parallel qatori.", ru: "💡 Нажмите оставшуюся среду — каждая из них отдельная параллельная линия ленты." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MATRIX_ENVS.map((e) => <button key={e.id} className={`vcard ${e.id === firstUnseen ? "tap-hint" : ""}`} onClick={() => tap(e.id)} style={{ boxShadow: active === e.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : void 0 }}>
                  <span className="role-ico">{e.icon}</span>
                  <span className="vlbl">{e.label}</span>
                  <span className="vseen" style={{ color: seen.has(e.id) ? T.success : T.ink3 }}>{seen.has(e.id) ? "✓" : ""}</span>
                </button>)}
            </div>
          </Col>
          <Col>
            {cur ? <div className="frame fade-step" key={active}><p className="note-h"><span style={{ fontSize: 18, marginRight: 6 }}>{cur.icon}</span>{cur.label}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2(cur.d)}</p></div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Muhitni bosing ←", ru: "Нажмите на среду ←" })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>3 muhit — bitta yo'l xaritasida <span className="mono">strategy: matrix</span> bilan yoziladi. Endi hammasi birga qanday aylanishini ko'ramiz.</>, ru: <>3 среды описываются в одной маршрутной карте через <span className="mono">strategy: matrix</span>. Теперь посмотрим, как всё это крутится вместе.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [status, setStatus] = useState3(() => storedAnswer ? { node18: "fail", node20: "pass", node22: "pass" } : {});
  const [running, setRunning] = useState3(false);
  const [done, setDone] = useState3(!!storedAnswer);
  const [sc, setSc] = useState3(0);
  const { tip: _tip, rescue: _resc } = useStuckValve(done, running ? 1 : 0);
  const timer = useRef3(null);
  useEffect4(() => () => clearTimeout(timer.current), []);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  const run = () => {
    if (running || done) return;
    setRunning(true);
    setSc((n) => n + 1);
    setStatus({ node18: "run", node20: "run", node22: "run" });
    timer.current = setTimeout(() => {
      setStatus({ node18: "fail", node20: "pass", node22: "pass" });
      setRunning(false);
      setDone(true);
      setSc((n) => n + 1);
    }, 900);
  };
  return <Stage eyebrow={tr2({ uz: "Payoff · matrix", ru: "Эффект · matrix" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Matrixni ishga tushiring", ru: "Запустите matrix" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>3 muhit birdan aylanadi — <span className="italic" style={{ color: T.accent }}>qaysi biri sinadi</span>?</>, ru: <>3 среды крутятся одновременно — <span className="italic" style={{ color: T.accent }}>какая из них сломается</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Endi matrixni ishga tushiramiz. Uchala muhit <b style={{ color: T.ink }}>bir vaqtda</b> ishlaydi. Bittasi qizil bersa — aynan qaysi muhitda muammo borligini darrov bilasiz.</>, ru: <>Теперь запустим matrix. Все три среды работают <b style={{ color: T.ink }}>одновременно</b>. Если одна даст красный — вы сразу узнаете, в какой именно среде проблема.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 «▶ Matrixni ishga tushirish» tugmasini bosing — uch muhit bir vaqtda aylanadi, qaysi biri qizil bo'lishini kuzating.", ru: "💡 Нажмите «▶ Запустить matrix» — три среды закрутятся одновременно, смотрите, какая станет красной." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <button className="btn" style={{ alignSelf: "flex-start" }} disabled={running || done} onClick={run}>{done ? tr2({ uz: "✓ Matrix yakunlandi", ru: "✓ Matrix завершён" }) : running ? tr2({ uz: "● Parallel ishlayapti…", ru: "● Работают параллельно…" }) : tr2({ uz: "▶ Matrixni ishga tushirish", ru: "▶ Запустить matrix" })}</button>
            <div className="cj-items fade-up delay-1">
              {MATRIX_ENVS.map((e) => <div key={e.id} className={`itm-card ${status[e.id] === "fail" ? "on" : ""}`} style={status[e.id] === "pass" ? { boxShadow: `inset 0 0 0 2px ${T.success}` } : void 0}>
                  <span className="itm-ico">{e.icon}</span>
                  <span className="itm-nm">{e.label}</span>
                  <span className="mono small" style={{ color: status[e.id] === "fail" ? T.danger : status[e.id] === "pass" ? T.success : T.ink3 }}>{status[e.id] === "run" ? tr2({ uz: "● ishlayapti", ru: "● работает" }) : status[e.id] === "pass" ? tr2({ uz: "✓ yashil", ru: "✓ зелёный" }) : status[e.id] === "fail" ? tr2({ uz: "✗ qizil", ru: "✗ красный" }) : "—"}</span>
                </div>)}
            </div>
          </Col>
          <Col>
            {done ? <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>{tr2({ uz: "🟩 Node 18 — qizil", ru: "🟩 Node 18 — красный" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Aynan Node 18'da eski funksiya ishlamayapti. Node 20 va 22 — yashil. Endi qaysi muhitda tuzatish kerakligi <b>aniq</b>.</>, ru: <>Именно на Node 18 старая функция не работает. Node 20 и 22 — зелёные. Теперь <b>точно ясно</b>, в какой среде чинить.</> })}</p></div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Tugmani bosing ←", ru: "Нажмите кнопку ←" })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Agar matrix bo'lmaganida — bu xato faqat productionda, foydalanuvchi oldida chiqqan bo'lardi.", ru: "Если бы не matrix — эта ошибка всплыла бы только в продакшене, на глазах у пользователя." })}</p></div>}
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
  questionText="Parallel lentalar (matrix) nima uchun kerak?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Parallel lentalar (matrix) <span className="italic" style={{ color: T.accent }}>nima uchun</span> kerak?</>, ru: <>Зачем нужны <span className="italic" style={{ color: T.accent }}>параллельные ленты</span> (matrix)?</> })}</h2></>}
  options={[{ uz: "Maxfiy kalitlarni xavfsiz joyda saqlab qo'yish uchun", ru: "Чтобы хранить секретные ключи в надёжном месте" }, { uz: "Bir nechta muhitda (masalan, Node versiyalarida) bir vaqtda tekshirish uchun", ru: "Чтобы проверять в нескольких средах (например, версиях Node) одновременно" }, { uz: "Faqat bitta muhitda, lekin avvalgidan tezroq tekshirish uchun", ru: "Чтобы проверять только в одной среде, но быстрее, чем раньше" }, { uz: "Productionni sinov reysisiz, tekshiruvsiz to'g'ridan-to'g'ri ishga tushirish uchun", ru: "Чтобы запускать продакшен сразу, без тестового рейса и проверок" }]}
  correctIdx={1}
  explainCorrect={{ uz: "To'g'ri! Matrix bitta yukni bir nechta muhitda bir vaqtning o'zida tekshiradi — muhitga bog'liq xatolarni productiondan oldin topib beradi.", ru: "Верно! Matrix проверяет один груз в нескольких средах одновременно — и находит ошибки, зависящие от среды, ещё до продакшена." }}
  explainWrong={{
    0: { uz: "Kalitlarni saqlash — seyf (secrets) ishi. Matrix esa turli muhitda tekshiradi.", ru: "Хранение ключей — работа сейфа (secrets). А matrix проверяет в разных средах." },
    2: { uz: "Aksincha — matrix bir emas, bir NECHTA muhitda parallel tekshiradi.", ru: "Наоборот — matrix проверяет параллельно не в одной, а в НЕСКОЛЬКИХ средах." },
    3: { uz: "Sinov reysisiz to'g'ridan-to'g'ri chiqarish — bu xavfli yo'l, matrix bunga aloqasi yo'q.", ru: "Выпускать без тестового рейса — опасный путь, и matrix тут ни при чём." },
    default: { uz: "Matrix = bir nechta muhitda bir vaqtda tekshirish.", ru: "Matrix = одновременная проверка в нескольких средах." }
  }}
/>;
var Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [ran, setRan] = useState3(!!storedAnswer);
  const [sc, setSc] = useState3(0);
  const done = ran;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, ran ? 1 : 0);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Muammo · kesh yo'q", ru: "Проблема · без кеша" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Install ishga tushiring", ru: "Запустите install" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Har push'da <span className="italic" style={{ color: T.accent }}>hamma paket qaytadan</span> yuklanadi?</>, ru: <>При каждом push <span className="italic" style={{ color: T.accent }}>все пакеты заново</span> скачиваются?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Yaqin javon bo'lmasa, lenta har safar <span className="mono">npm install</span>ni noldan bajaradi — bitta harf o'zgargan bo'lsa ham. Tugmani bosing va vaqtni kuzating.</>, ru: <>Без ближней полки лента каждый раз выполняет <span className="mono">npm install</span> с нуля — даже если изменилась одна буква. Нажмите кнопку и следите за временем.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 «▶ npm install» tugmasini bosing — o'ngdagi vaqt-chipi keshsiz reysni ko'rsatadi.", ru: "💡 Нажмите «▶ npm install» — чип времени справа покажет рейс без кеша." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <Term title={tr2({ uz: "install (keshsiz)", ru: "install (без кеша)" })} minH={90}>
              <TLine cmd="npm install" />
              {ran && <TLine out={tr2({ uz: "1247 paket yuklanmoqda… 0 tasi keshdan", ru: "1247 пакетов скачивается… 0 из кеша" })} col="#FF8A7A" />}
            </Term>
            <button className="btn" style={{ alignSelf: "flex-start" }} disabled={ran} onClick={() => {
    setRan(true);
    setSc((n) => n + 1);
  }}>{ran ? tr2({ uz: "✓ Yuklandi", ru: "✓ Загружено" }) : "▶ npm install"}</button>
          </Col>
          <Col>
            <div className="timer-row fade-up delay-2">
              <div className={`timer-chip ${ran ? "danger" : ""}`}><span className="tc-lbl">{tr2({ uz: "Keshsiz reys", ru: "Рейс без кеша" })}</span><span className="tc-val">{ran ? tr2({ uz: "40 s", ru: "40 сек" }) : "—"}</span></div>
            </div>
            {done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "40 soniya — faqat install uchun. Va bu har push'da takrorlanadi. Buni tezlashtirsak-chi?", ru: "40 секунд — только на install. И так при каждом push. А если ускорить?" })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [ran, setRan] = useState3(!!storedAnswer);
  const [sc, setSc] = useState3(0);
  const done = ran;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, ran ? 1 : 0);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Yechim · yaqin javon", ru: "Решение · ближняя полка" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Keshdan install qiling", ru: "Сделайте install из кеша" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Yaqin javon bilan — <span className="italic" style={{ color: T.accent }}>qancha tezroq</span>?</>, ru: <>С ближней полкой — <span className="italic" style={{ color: T.accent }}>насколько быстрее</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Yaqin javon avvalgi reysda yuklangan paketlarni saqlab qo'yadi. Keyingi reysda ular <b style={{ color: T.ink }}>qayta yuklanmaydi</b>. Tugmani bosing.</>, ru: <>Ближняя полка сохраняет пакеты, загруженные в прошлом рейсе. В следующем рейсе они <b style={{ color: T.ink }}>не скачиваются заново</b>. Нажмите кнопку.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 «▶ npm install (kesh bilan)» tugmasini bosing — ikki vaqt-chipini solishtiring.", ru: "💡 Нажмите «▶ npm install (с кешем)» — сравните два чипа времени." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <Term title={tr2({ uz: "install (kesh bilan)", ru: "install (с кешем)" })} minH={90}>
              <TLine cmd="npm install" />
              {ran && <TLine out={tr2({ uz: "1247 paket — 1240 tasi keshdan topildi ✓", ru: "1247 пакетов — 1240 нашлись в кеше ✓" })} col={CODE.str} />}
            </Term>
            <button className="btn" style={{ alignSelf: "flex-start" }} disabled={ran} onClick={() => {
    setRan(true);
    setSc((n) => n + 1);
  }}>{ran ? tr2({ uz: "✓ Yuklandi", ru: "✓ Загружено" }) : tr2({ uz: "▶ npm install (kesh bilan)", ru: "▶ npm install (с кешем)" })}</button>
          </Col>
          <Col>
            <div className="timer-row fade-up delay-2">
              <div className="timer-chip danger"><span className="tc-lbl">{tr2({ uz: "Keshsiz", ru: "Без кеша" })}</span><span className="tc-val">{tr2({ uz: "40 s", ru: "40 сек" })}</span></div>
              <div className={`timer-chip ${ran ? "success" : ""}`}><span className="tc-lbl">{tr2({ uz: "Kesh bilan", ru: "С кешем" })}</span><span className="tc-val">{ran ? tr2({ uz: "8 s", ru: "8 сек" }) : "—"}</span></div>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>40 soniyadan 8 soniyaga — <b>5 baravar tezroq</b>. Bu ayniqsa matrix bilan muhim: 3 muhit, har birida kesh bo'lsa jami vaqt sezilarli qisqaradi.</>, ru: <>С 40 секунд до 8 — <b>в 5 раз быстрее</b>. Это особенно важно с matrix: сред три, и если кеш есть в каждой, общее время заметно сокращается.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [show, setShow] = useState3(!!storedAnswer);
  const [sc, setSc] = useState3(0);
  const done = show;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, show ? 1 : 0);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Tushuncha · cache kaliti", ru: "Понятие · ключ кеша" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Yo'l xaritasini ko'ring", ru: "Посмотрите маршрутную карту" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Yo'l xaritasida <span className="italic" style={{ color: T.accent }}>cache qanday</span> yoziladi?</>, ru: <>Как записывается <span className="italic" style={{ color: T.accent }}>cache</span> в маршрутной карте?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>Yaqin javon uchun yo'l xaritasiga bitta amal qo'shiladi — <span className="mono">cache</span>. U qaysi papkani saqlashni va qaysi kalit bilan topishni biladi.</>, ru: <>Для ближней полки в маршрутную карту добавляется одно действие — <span className="mono">cache</span>. Оно знает, какую папку сохранять и по какому ключу её находить.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 «▶ Bu nimani bildiradi?» tugmasini bosing — path va key qatorlari tushuntiriladi.", ru: "💡 Нажмите «▶ Что это значит?» — объяснятся строки path и key." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <pre className="code-box" style={{ lineHeight: 1.9 }}>
              {"- "}<At>uses</At>{": actions/cache@v4"}{"\n"}
              {"  "}<At>with</At>{":"}{"\n"}
              {"    "}<At>path</At>{": "}<St>node_modules</St>{"\n"}
              {"    "}<At>key</At>{": "}<St>{"${{ hashFiles('package-lock.json') }}"}</St>
            </pre>
            <button className="btn-soft" style={{ alignSelf: "flex-start" }} disabled={show} onClick={() => {
    setShow(true);
    setSc((n) => n + 1);
  }}>{show ? tr2({ uz: "✓ Ko'rdingiz", ru: "✓ Посмотрели" }) : tr2({ uz: "▶ Bu nimani bildiradi?", ru: "▶ Что это значит?" })}</button>
          </Col>
          <Col>
            {show ? <div className="sk-info fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <><span className="mono">path</span> — qaysi papka saqlanadi (<span className="mono">node_modules</span>). <span className="mono">key</span> — paketlar ro'yxati o'zgarmagan bo'lsa, oldingi keshdan foydalaniladi.</>, ru: <><span className="mono">path</span> — какая папка сохраняется (<span className="mono">node_modules</span>). <span className="mono">key</span> — если список пакетов не менялся, используется прежний кеш.</> })}</p></div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Tugmani bosing ←", ru: "Нажмите кнопку ←" })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <><span className="mono">package-lock.json</span> o'zgarsa — kalit ham o'zgaradi, kesh yangilanadi. O'zgarmasa — eski keshdan foydalaniladi.</>, ru: <>Если <span className="mono">package-lock.json</span> изменится — изменится и ключ, кеш обновится. Не изменится — берётся старый кеш.</> })}</p></div>}
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
  eyebrow={tr2({ uz: "Mashq · 2-savol", ru: "Практика · вопрос 2" })}
  questionText="Yaqin javon (cache) nimaga yordam beradi?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Yaqin javon (cache) <span className="italic" style={{ color: T.accent }}>nimaga</span> yordam beradi?</>, ru: <>Чем помогает <span className="italic" style={{ color: T.accent }}>ближняя полка</span> (cache)?</> })}</h2></>}
  options={[{ uz: "Bir nechta muhitda (masalan, turli Node versiyalarida) parallel test o'tkazadi", ru: "Проводит параллельные тесты в нескольких средах (например, в разных версиях Node)" }, { uz: "Kod sifatini avtomatik tekshirib, xatolarni ekranda ko'rsatib beradi", ru: "Автоматически проверяет качество кода и показывает ошибки на экране" }, { uz: "Maxfiy kalitlarni xavfsiz joyda saqlab, kod ichidan yashiradi", ru: "Хранит секретные ключи в надёжном месте и прячет их из кода" }, { uz: "Har reysda paketlarni qaytadan yuklamaslik orqali vaqtni tejaydi", ru: "Экономит время: не скачивает пакеты заново на каждом рейсе" }]}
  correctIdx={3}
  explainCorrect={{ uz: "To'g'ri! Yaqin javon avvalgi reysda yuklangan paketlarni saqlab qo'yadi — keyingi reys sezilarli tezroq o'tadi.", ru: "Верно! Ближняя полка сохраняет пакеты, загруженные в прошлом рейсе, — следующий рейс проходит заметно быстрее." }}
  explainWrong={{
    0: { uz: "Parallel test — matrix ishi. Cache install bosqichini tezlashtiradi.", ru: "Параллельные тесты — работа matrix. Cache ускоряет этап install." },
    1: { uz: "Sifat tekshiruvi — bu boshqa vosita. Cache esa vaqtni tejaydi.", ru: "Проверка качества — это другой инструмент. Cache же экономит время." },
    2: { uz: "Kalitlarni saqlash — seyf (secrets) ishi. Cache paketlarni saqlaydi.", ru: "Хранение ключей — работа сейфа (secrets). Cache хранит пакеты." },
    default: { uz: "Cache = takroriy install'ni tezlashtiradi.", ru: "Cache = ускоряет повторный install." }
  }}
/>;
var Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [openSeen, setOpenSeen] = useState3(!!storedAnswer);
  const [secured, setSecured] = useState3(!!storedAnswer);
  const [sc, setSc] = useState3(0);
  const done = secured;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, (openSeen ? 1 : 0) + (secured ? 1 : 0));
  const fired = useRef3(!!storedAnswer);
  useEffect4(() => {
    if (done && !fired.current) {
      fired.current = true;
      onAnswer(screen, { stage: "case", screenIdx: screen, question: "Maxfiy kalitni seyfga xavfsiz joylang", correct: true, solved: true, picked: true });
    }
  }, [done]);
  const showOpen = () => {
    setOpenSeen(true);
    setSc((n) => n + 1);
  };
  const secure = () => {
    if (!openSeen) return;
    setSecured(true);
    setSc((n) => n + 1);
  };
  return <Stage eyebrow={tr2({ uz: "Hayotiy · seyf", ru: "Из жизни · сейф" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : openSeen ? tr2({ uz: "Seyfga joylang", ru: "Положите в сейф" }) : tr2({ uz: "Ochiq holatni ko'ring", ru: "Посмотрите открытый вариант" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Maxfiy kalitni yo'l xaritasiga <span className="italic" style={{ color: T.accent }}>qanday yozasiz</span>?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>записать секретный ключ</span> в маршрутную карту?</> })}</h2></div>
        <Mentor>{tr2({ uz: <>API kaliti kerak. Avval uni <b style={{ color: T.ink }}>ochiq matn</b> sifatida yozib ko'ring — nima bo'lishini ko'rasiz. Keyin <b style={{ color: T.ink }}>seyfga</b> joylab tuzating.</>, ru: <>Нужен API-ключ. Сначала попробуйте записать его <b style={{ color: T.ink }}>открытым текстом</b> — увидите, что будет. Потом исправьте: положите его <b style={{ color: T.ink }}>в сейф</b>.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Avval «▶ Repo'ni ochiq holda ko'rish» — kalit ochiqda nima bo'lishini ko'ring, keyin «🔐 Seyfga joylash».", ru: "💡 Сначала «▶ Посмотреть репозиторий в открытом виде» — увидите, что бывает с открытым ключом, затем «🔐 Положить в сейф»." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <pre className="code-box" style={{ lineHeight: 1.9 }}>
              {"- "}<At>run</At>{": deploy --key="}{!secured ? <St>"sk-a91f7c2e..."</St> : <span style={{ color: CODE.str }}>{"${{ secrets.API_KEY }}"}</span>}
            </pre>
            {!openSeen && <button className="btn" style={{ alignSelf: "flex-start" }} onClick={showOpen}>{tr2({ uz: "▶ Repo'ni ochiq holda ko'rish", ru: "▶ Посмотреть репозиторий в открытом виде" })}</button>}
            {openSeen && !secured && <button className="btn" style={{ alignSelf: "flex-start" }} onClick={secure}>{tr2({ uz: "🔐 Seyfga joylash", ru: "🔐 Положить в сейф" })}</button>}
          </Col>
          <Col>
            {!openSeen && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Tugmani bosing ←", ru: "Нажмите кнопку ←" })}</p></div>}
            {openSeen && !secured && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>{tr2({ uz: "😱 Repo ochiq — kalit ko'rinib turibdi!", ru: "😱 Репозиторий открыт — ключ на виду!" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Har kim repo'ni ko'rib, kalitni <b>nusxalab olishi</b> mumkin. Bu — xavfsizlik teshigi. Endi seyfga joylab tuzating.</>, ru: <>Любой может открыть репозиторий и <b>скопировать ключ</b>. Это дыра в безопасности. Теперь исправьте — положите его в сейф.</> })}</p></div>}
            {secured && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Endi kalit seyfda — kod ichida faqat <span className="mono">{"${{ secrets.API_KEY }}"}</span> ko'rinadi, haqiqiy qiymat hech qayerda ochiq yozilmaydi va lenta jurnalida ham yulduzchalar bilan yashiriladi.</>, ru: <>Теперь ключ в сейфе — в коде видно только <span className="mono">{"${{ secrets.API_KEY }}"}</span>, настоящее значение нигде не записано открыто, и даже в журнале ленты оно закрыто звёздочками.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen10 = (props) => <QuestionScreen
  {...props}
  idx={10}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 3-savol", ru: "Практика · вопрос 3" })}
  questionText="Maxfiy kalitni ci.yml faylida qanday ishlatish xavfsiz?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Maxfiy kalitni <span className="italic" style={{ color: T.accent }}>qanday</span> ishlatish xavfsiz?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>безопасно</span> использовать секретный ключ?</> })}</h2></>}
  options={[{ uz: "Seyfga saqlab, ${{ secrets.API_KEY }} orqali chaqirish", ru: "Хранить в сейфе и вызывать через ${{ secrets.API_KEY }}" }, { uz: "Commit izohiga (commit message) yozib, keyin push qilish", ru: "Записать в сообщение коммита (commit message) и сделать push" }, { uz: "README faylining eng boshiga alohida qatorga yozib qo'yish", ru: "Записать отдельной строкой в самом начале файла README" }, { uz: "To'g'ridan-to'g'ri ochiq matn sifatida faylning ichiga yozib qo'yish", ru: "Записать прямо в файл открытым текстом" }]}
  correctIdx={0}
  explainCorrect={{ uz: "To'g'ri! Maxfiy kalit hech qachon kod ichida ochiq yozilmaydi — u seyfga saqlanadi va yo'l xaritasida faqat ${{ secrets.API_KEY }} orqali chaqiriladi.", ru: "Верно! Секретный ключ никогда не пишется в коде открыто — он хранится в сейфе, а в маршрутной карте вызывается только через ${{ secrets.API_KEY }}." }}
  explainWrong={{
    1: { uz: "Commit izohi ham hammaga ko'rinadi — seyf emas.", ru: "Сообщение коммита тоже видно всем — это не сейф." },
    2: { uz: "README ham ochiq fayl — kalit u yerda ham xavfsiz emas.", ru: "README — тоже открытый файл, ключ там не в безопасности." },
    3: { uz: "Ochiq matn — repo ochiq bo'lsa, hamma kalitni ko'radi. Bu xavfli.", ru: "Открытый текст — если репозиторий открыт, ключ увидят все. Это опасно." },
    default: { uz: "Maxfiy kalit — faqat seyfdan, ${{ secrets.API_KEY }} orqali.", ru: "Секретный ключ — только из сейфа, через ${{ secrets.API_KEY }}." }
  }}
/>;
var STAGE_MODES = [
  { id: "staging", icon: "🛫", label: { uz: "Sinov reysi (staging)", ru: "Тестовый рейс (staging)" }, d: { uz: "Yo'lovchisiz sinov parvozi — yangi yukni haqiqiy foydalanuvchilardan alohida muhitda tekshirasiz.", ru: "Пробный полёт без пассажиров — вы проверяете новый груз в среде, отделённой от настоящих пользователей." } },
  { id: "production", icon: "✈️", label: { uz: "Haqiqiy reys (production)", ru: "Настоящий рейс (production)" }, d: { uz: "Yo'lovchi (foydalanuvchi) qo'lidagi muhit — faqat sinov reysida hammasi yashil bo'lgandan keyin shu yerga chiqadi.", ru: "Среда в руках пассажира (пользователя) — сюда груз попадает только после того, как на тестовом рейсе всё зелёное." } }
];
var Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState3(storedAnswer ? new Set(STAGE_MODES.map((m) => m.id)) : /* @__PURE__ */ new Set());
  const [active, setActive] = useState3(null);
  const [sc, setSc] = useState3(0);
  const done = seen.size >= STAGE_MODES.length;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, seen.size);
  const firstUnseen = (STAGE_MODES.find((m) => !seen.has(m.id)) || {}).id;
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
  const cur = STAGE_MODES.find((m) => m.id === active);
  return <Stage eyebrow={tr2({ uz: "Tushuncha · staging", ru: "Понятие · staging" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Ikkalasini ko'ring", ru: "Посмотрите оба" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Haqiqiy reysdan oldin — <span className="italic" style={{ color: T.accent }}>sinov reysi</span>.</>, ru: <>Перед настоящим рейсом — <span className="italic" style={{ color: T.accent }}>тестовый рейс</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: "Yangi yuk to'g'ridan-to'g'ri yo'lovchi qo'liga chiqmaydi. Avval alohida muhitda sinaladi. Ikkala muhitni bosing.", ru: "Новый груз не попадает сразу в руки пассажира. Сначала его проверяют в отдельной среде. Нажмите на обе среды." })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 Qolgan reysni bosing — biri yo'lovchisiz sinov, ikkinchisi haqiqiy.", ru: "💡 Нажмите оставшийся рейс — один пробный без пассажиров, другой настоящий." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STAGE_MODES.map((m) => <button key={m.id} className={`vcard ${m.id === firstUnseen ? "tap-hint" : ""}`} onClick={() => tap(m.id)} style={{ boxShadow: active === m.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : void 0 }}>
                  <span className="role-ico">{m.icon}</span>
                  <span className="vlbl">{tr2(m.label)}</span>
                  <span className="vseen" style={{ color: seen.has(m.id) ? T.success : T.ink3 }}>{seen.has(m.id) ? "✓" : ""}</span>
                </button>)}
            </div>
          </Col>
          <Col>
            {cur ? <div className="frame fade-step" key={active}><p className="note-h"><span style={{ fontSize: 20, marginRight: 6 }}>{cur.icon}</span>{tr2(cur.label)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2(cur.d)}</p></div> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Muhitni bosing ←", ru: "Нажмите на среду ←" })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Tartib muhim: avval <b>sinov reysi</b>, keyingina <b>haqiqiy reys</b>. Hech qachon teskari emas.</>, ru: <>Порядок важен: сначала <b>тестовый рейс</b>, и только потом <b>настоящий</b>. И никогда наоборот.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [broke, setBroke] = useState3(!!storedAnswer);
  const [sc, setSc] = useState3(0);
  const done = broke;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, broke ? 1 : 0);
  useEffect4(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr2({ uz: "Hayotiy · production", ru: "Из жизни · production" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Yangi yukni chiqarish", ru: "Выпустить новый багаж" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Sinov reysi yashil edi — <span className="italic" style={{ color: T.accent }}>haqiqiy reysda</span> nima bo'ldi?</>, ru: <>Тестовый рейс был зелёным — что случилось <span className="italic" style={{ color: T.accent }}>на настоящем рейсе</span>?</> })}</h2></div>
        <Mentor>{tr2({ uz: "Ba'zan sinov reysida yashil bo'lgan yuk ham haqiqiy reysda kutilmagan xato beradi (masalan, boshqa ma'lumotlar hajmi tufayli). Tugmani bosing.", ru: "Иногда груз, зелёный на тестовом рейсе, на настоящем рейсе выдаёт неожиданную ошибку (например, из-за другого объёма данных). Нажмите кнопку." })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 «✈️ Yangi yukni production'ga chiqarish» tugmasini bosing — yo'lovchi ekranida nima bo'lishini ko'ring.", ru: "💡 Нажмите «✈️ Выпустить новый багаж в продакшен» — посмотрите, что станет с экраном пассажира." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable>
        <div className="split">
          <Col>
            <button className="btn" style={{ alignSelf: "flex-start" }} disabled={broke} onClick={() => {
    setBroke(true);
    setSc((n) => n + 1);
  }}>{broke ? tr2({ uz: "✓ Yangi yuk production'ga chiqdi", ru: "✓ Новый багаж вышел в продакшен" }) : tr2({ uz: "✈️ Yangi yukni production'ga chiqarish", ru: "✈️ Выпустить новый багаж в продакшен" })}</button>
            {broke && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>{tr2({ uz: "💥 Production'da xato chiqdi", ru: "💥 В продакшене ошибка" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Foydalanuvchilar hozir <b>buzuq sayt</b>ni ko'rmoqda. Darhol biror narsa qilish kerak.</>, ru: <>Пользователи прямо сейчас видят <b>сломанный сайт</b>. Нужно срочно что-то делать.</> })}</p></div>}
          </Col>
          <Col>
            <PhoneMock state={broke ? "broken" : "old"} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>Endi vaqt hisobga kirdi. Yechim — <b>eski yukni qaytarish</b>. Keyingi ekranda buni bir bosishda qilamiz.</>, ru: <>Теперь счёт идёт на минуты. Решение — <b>вернуть старый багаж</b>. На следующем экране сделаем это в один клик.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var IMPROVEMENTS = [
  { id: "matrix", icon: "🧬", label: { uz: "Parallel lentalar", ru: "Параллельные ленты" }, before: { uz: "1 muhitda tekshiriladi — production'da kutilmagan xato chiqishi mumkin", ru: "Проверка в 1 среде — в продакшене может вылезти неожиданная ошибка" }, after: { uz: "3 muhitda (Node 18/20/22) parallel tekshiriladi — muammo oldindan ko'rinadi", ru: "Параллельная проверка в 3 средах (Node 18/20/22) — проблема видна заранее" } },
  { id: "cache", icon: "💨", label: { uz: "Yaqin javon", ru: "Ближняя полка" }, before: { uz: "Har reysda 40 soniya install", ru: "На каждом рейсе install занимает 40 секунд" }, after: { uz: "Kesh bilan 8 soniya install — 5 baravar tez", ru: "С кешем install за 8 секунд — в 5 раз быстрее" } },
  { id: "secret", icon: "🔐", label: { uz: "Seyf", ru: "Сейф" }, before: { uz: "Kalit ochiq matnda — repo ochiq bo'lsa ko'rinadi", ru: "Ключ открытым текстом — в открытом репозитории виден всем" }, after: { uz: "Kalit seyfda — kod ichida hech qachon ochiq yozilmaydi", ru: "Ключ в сейфе — в коде никогда не пишется открыто" } },
  { id: "staging", icon: "🛫", label: { uz: "Sinov reysi", ru: "Тестовый рейс" }, before: { uz: "To'g'ridan-to'g'ri haqiqiy reysga chiqadi", ru: "Груз уходит сразу на настоящий рейс" }, after: { uz: "Avval sinov reysida tekshiriladi, keyin haqiqiy reysga", ru: "Сначала проверка на тестовом рейсе, потом настоящий рейс" } }
];
var Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [on, setOn] = useState3(() => storedAnswer ? new Set(IMPROVEMENTS.map((i) => i.id)) : /* @__PURE__ */ new Set());
  const [rolledBack, setRolledBack] = useState3(!!storedAnswer);
  const [sc, setSc] = useState3(0);
  const allOn = on.size >= IMPROVEMENTS.length;
  const firstOff = (IMPROVEMENTS.find((i) => !on.has(i.id)) || {}).id;
  const done = rolledBack;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, on.size + (rolledBack ? 1 : 0));
  const fired = useRef3(!!storedAnswer);
  useEffect4(() => {
    if (done && !fired.current) {
      fired.current = true;
      onAnswer(screen, { stage: "builder", screenIdx: screen, question: "4 yaxshilashni yoqib, eski yukni qaytaring", correct: true, solved: true, picked: true });
    }
  }, [done]);
  const toggle = (id) => {
    setOn((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
    setSc((n) => n + 1);
  };
  const rollback = () => {
    if (!allOn) return;
    setRolledBack(true);
    setSc((n) => n + 1);
  };
  return <Stage eyebrow={tr2({ uz: "Markaziy · ishonchli lenta", ru: "Центральный · надёжная лента" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={done || _resc ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : allOn ? tr2({ uz: "Eski yukni qaytaring", ru: "Верните старый багаж" }) : `${tr2({ uz: "Yaxshilashlarni yoqing", ru: "Включите улучшения" })} (${on.size}/4)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Lentani <span className="italic" style={{ color: T.accent }}>o'zingiz</span> ishonchli qiling.</>, ru: <>Сделайте ленту надёжной <span className="italic" style={{ color: T.accent }}>сами</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: <>4 ta yaxshilashni birma-bir yoqing — har birida <b style={{ color: T.ink }}>oldin/keyin</b> farqni ko'rasiz. Hammasi yoqilgach, oldingi ekrandagi buzuq yukni <b style={{ color: T.ink }}>qaytarasiz</b>.</>, ru: <>Включите 4 улучшения по одному — в каждом увидите разницу <b style={{ color: T.ink }}>до/после</b>. Когда все включены, <b style={{ color: T.ink }}>вернёте</b> сломанный багаж с прошлого экрана.</> })}</Mentor>
        {_tip && !done && <p className="bhint fade-step">{tr2({ uz: "💡 To'rt yaxshilashni birma-bir yoqing — har birida «oldin/keyin» farqi chiqadi. Hammasi yoqilgach, buzuq yukni qaytaradigan tugma paydo bo'ladi.", ru: "💡 Включайте четыре улучшения по одному — в каждом появится разница «до/после». Когда включите все, появится кнопка возврата сломанного багажа." })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr2({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: "Остальное разберём вместе позже — «Продолжить» открыто." })}</p>}
        <Zoomable><div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {IMPROVEMENTS.map((im) => {
    const isOn = on.has(im.id);
    return <button key={im.id} className={`vcard ${im.id === firstOff ? "tap-hint" : ""}`} onClick={() => toggle(im.id)} style={{ boxShadow: isOn ? `inset 0 0 0 1.5px ${T.success}, 0 8px 20px -6px rgba(31,122,77,0.2)` : void 0 }}>
                    <span className="role-ico">{im.icon}</span>
                    <span className="vlbl">{tr2(im.label)}</span>
                    <span className="vseen" style={{ color: isOn ? T.success : T.ink3 }}>{isOn ? tr2({ uz: "✓ yoqilgan", ru: "✓ включено" }) : tr2({ uz: "yoqish", ru: "включить" })}</span>
                  </button>;
  })}
            </div>
            {allOn && !done && <button className="btn" style={{ alignSelf: "flex-start" }} onClick={rollback}>{tr2({ uz: "🔁 Eski yukni qaytarish (rollback)", ru: "🔁 Вернуть старый багаж (rollback)" })}</button>}
          </Col>
          <Col>
            {IMPROVEMENTS.map((im) => on.has(im.id) && <div key={im.id} className="sk-info fade-step">
                <p className="note-h"><span style={{ fontSize: 16, marginRight: 6 }}>{im.icon}</span>{tr2(im.label)}</p>
                <p className="small" style={{ margin: "0 0 4px", color: T.danger }}>{tr2({ uz: "Oldin:", ru: "До:" })} {tr2(im.before)}</p>
                <p className="small" style={{ margin: 0, color: T.success }}>{tr2({ uz: "Keyin:", ru: "После:" })} {tr2(im.after)}</p>
              </div>)}
            {on.size === 0 && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr2({ uz: "Chapdan yaxshilashni yoqing ←", ru: "Включите улучшение слева ←" })}</p></div>}
            {allOn && <PhoneMock state={done ? "old" : "broken"} />}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "🎉 Bir bosishda oldingi ishlaydigan yukka qaytdingiz — foydalanuvchi endi yana ishlaydigan saytni ko'radi. Lenta endi ishonchli: tez, xavfsiz, qaytariladigan.", ru: "🎉 В один клик вы вернулись к прежнему рабочему багажу — пользователь снова видит работающий сайт. Лента теперь надёжная: быстрая, безопасная, обратимая." })}</p><PhoneMock state="new" /></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>;
};
var Screen14 = (props) => <QuestionScreen
  {...props}
  idx={14}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Mashq · 4-savol", ru: "Практика · вопрос 4" })}
  questionText="Yangi versiya productionda buzuq chiqdi. Nima qilasiz?"
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr2({ uz: "To'g'ri javobni tanlang", ru: "Выберите правильный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr2({ uz: <>Yangi yuk production'da buzuq chiqdi. <span className="italic" style={{ color: T.accent }}>Nima qilasiz</span>?</>, ru: <>Новый багаж в продакшене оказался сломанным. <span className="italic" style={{ color: T.accent }}>Что будете делать</span>?</> })}</h2></>}
  options={[{ uz: "Hech narsa qilmayman, o'zi tuzalib ketadi deb kutaman", ru: "Ничего — подожду, вдруг само починится" }, { uz: "Yaqin javonni (cache) butunlay o'chirib, install'ni noldan qayta ishga tushiraman", ru: "Полностью отключу кеш (cache) и запущу install заново с нуля" }, { uz: "Eski yukni qaytarish (rollback) bilan darhol oldingi versiyaga qaytaman", ru: "Сразу вернусь к прежней версии через rollback (возврат старого багажа)" }, { uz: "Parallel lentalar sonini yana ko'paytirib, qaytadan sinab ko'raman", ru: "Увеличу количество параллельных лент и попробую ещё раз" }]}
  correctIdx={2}
  explainCorrect={{ uz: "To'g'ri! Rollback — muammoli yangi yukdan darhol oldingi ishlaydigan yukka qaytish. Bu eng tez va ishonchli yechim.", ru: "Верно! Rollback — мгновенный возврат от проблемного нового багажа к прежнему рабочему. Это самое быстрое и надёжное решение." }}
  explainWrong={{
    0: { uz: "Kutish — foydalanuvchi shu vaqtda buzuq saytni ko'raveradi. Darhol harakat kerak.", ru: "Ждать нельзя — всё это время пользователь видит сломанный сайт. Действовать нужно сразу." },
    1: { uz: "Cache'ni o'chirish muammoni hal qilmaydi — bu boshqa yaxshilash.", ru: "Отключение кеша проблему не решит — это другое улучшение." },
    3: { uz: "Matrix sonini ko'paytirish ham hozirgi buzuq versiyani tuzatmaydi.", ru: "Больше параллельных лент — но текущую сломанную версию это не починит." },
    default: { uz: "Muammo chiqsa — rollback bilan darhol qaytiladi.", ru: "Если возникла проблема — сразу откатываемся через rollback." }
  }}
/>;
var PRO_ITEMS = [
  { id: "matrix", label: { uz: "🧬 Matrix — parallel tekshirish", ru: "🧬 Matrix — параллельная проверка" } },
  { id: "cache", label: { uz: "💨 Cache — tezroq yig'ish", ru: "💨 Cache — быстрее сборка" } },
  { id: "secret", label: { uz: "🔐 Secret — seyfdan kalit", ru: "🔐 Secret — ключ из сейфа" } },
  { id: "staging", label: { uz: "🛫 Staging — sinov reysi", ru: "🛫 Staging — тестовый рейс" } },
  { id: "production", label: { uz: "✈️ Production — haqiqiy reys", ru: "✈️ Production — настоящий рейс" } }
];
var PRO_ORDER = PRO_ITEMS.map((i) => i.id);
var Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState3(!!storedAnswer);
  const [consequence, setConsequence] = useState3(null);
  const hadWrongRef = useRef3(storedAnswer ? storedAnswer.firstAttemptCorrect === false : false);
  const fired = useRef3(!!storedAnswer);
  const [recapOpen, setRecapOpen] = useState3(false);
  const onSolved = () => {
    if (fired.current) {
      setDone(true);
      return;
    }
    fired.current = true;
    const firstOk = !hadWrongRef.current;
    setDone(true);
    onAnswer(screen, { stage: "final", screenIdx: screen, question: "Ishonchli lenta bosqichlarini to'g'ri tartibda joylang", correct: firstOk, firstAttemptCorrect: firstOk, solved: true, picked: firstOk ? 0 : 1 });
  };
  const onChange = (slots) => {
    if (fired.current) return;
    const full = slots.every((s) => s !== null);
    if (!full) {
      setConsequence(null);
      return;
    }
    const solved = slots.every((s, i) => s === PRO_ORDER[i]);
    if (solved) {
      setConsequence(null);
      return;
    }
    hadWrongRef.current = true;
    const prodIdx = slots.indexOf("production");
    const stageIdx = slots.indexOf("staging");
    setConsequence(prodIdx >= 0 && stageIdx >= 0 && prodIdx < stageIdx ? "skip-staging" : "wrong");
  };
  return <Stage eyebrow={tr2({ uz: "Yakuniy · amaliy", ru: "Финал · практика" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Lentani yig'ing", ru: "Соберите ленту" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>Oxirgi qadam: ishonchli lentani <span className="italic" style={{ color: T.accent }}>to'g'ri tartibda</span> yig'ing.</>, ru: <>Последний шаг: соберите надёжную ленту <span className="italic" style={{ color: T.accent }}>в правильном порядке</span>.</> })}</h2></div>
        <Mentor>{tr2({ uz: "Bosqichlarni sudrab to'g'ri tartibga joylang. Diqqat: agar ✈️ Production'ni 🛫 Staging'dan oldin qo'ysangiz — oqibatini ko'rasiz. Keyin to'g'rilaysiz.", ru: "Перетащите этапы в правильный порядок. Внимание: если поставите ✈️ Production раньше 🛫 Staging — увидите последствия. Потом исправите." })}</Mentor>
        <DragDropOrder
    items={PRO_ITEMS}
    hints={[{ uz: "1-qadam", ru: "шаг 1" }, { uz: "2-qadam", ru: "шаг 2" }, { uz: "3-qadam", ru: "шаг 3" }, { uz: "4-qadam", ru: "шаг 4" }, { uz: "5-qadam", ru: "шаг 5" }]}
    doneText={{ uz: "To'g'ri: Matrix → Cache → Secret → Staging → Production.", ru: "Верно: Matrix → Cache → Secret → Staging → Production." }}
    onSolved={onSolved}
    onChange={onChange}
  />
        {consequence === "skip-staging" && !done && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>{tr2({ uz: "💥 Sinov reysisiz haqiqiy reysga chiqib ketdi!", ru: "💥 Улетело на настоящий рейс без тестового!" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Tekshirilmagan yuk to'g'ridan-to'g'ri yo'lovchi qo'liga tushdi. Tartibni to'g'rilang.", ru: "Непроверенный груз попал прямо в руки пассажира. Исправьте порядок." })}</p><PhoneMock state="broken" /></div>}
        {consequence === "wrong" && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Tartib xato — bo'lakni bosib qaytaring va qaytadan joylang.", ru: "Порядок неверный — нажмите на блок, верните его и разложите заново." })}</p></div>}
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: <>✓ Ishonchli lenta tayyor: <b>Matrix → Cache → Secret → Staging → Production</b>. Muammo chiqsa — rollback bilan bir bosishda qaytarasiz.</>, ru: <>✓ Надёжная лента готова: <b>Matrix → Cache → Secret → Staging → Production</b>. Если возникнет проблема — вернётесь через rollback в один клик.</> })}</p><PhoneMock state="new" />
          {hadWrongRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr2({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "📖 Короткое повторение — взглянуть на тему ещё раз" })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>;
};
var ACHIEVEMENTS = {
  multiRunner: { icon: "🧬", name: "Multi-Runner", desc: { uz: "Parallel lentalar (matrix) nima ekanini tushundingiz", ru: "Вы разобрались, что такое параллельные ленты (matrix)" } },
  vaultKeeper: { icon: "🔐", name: "Vault Keeper", desc: { uz: "Maxfiy kalit qayerda turishini topdingiz", ru: "Вы нашли, где хранить секретный ключ" } },
  proPipeline: { icon: "🏎️", name: "Pro Pipeline", desc: { uz: "Muammo chiqqanda rollbackni tanladingiz", ru: "При проблеме вы выбрали rollback" } },
  orderMatters: { icon: "🔀", name: "Order Matters", desc: { uz: "Lenta tartibini 1-urinishda terdingiz", ru: "Вы собрали порядок ленты с 1-й попытки" } }
};
var ACH_TRIGGERS = { s4: "multiRunner", s10: "vaultKeeper", s14: "proPipeline", s15: "orderMatters" };
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
var Q_LABELS = { 4: "1 — Matrix", 8: "2 — Cache", 10: "3 — Secret", 14: "4 — Rollback", 15: "5 — Tartib" };
var QUIZ_MS = 15e3;
var QZ_BG_SHAPES = [
  { ch: "matrix", l: 5, t: 10, s: 32, d: 19, dl: 0 },
  { ch: "🧬", l: 85, t: 8, s: 32, d: 23, dl: 1.5 },
  { ch: "cache", l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: "secrets", l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: "staging", l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: "rollback", l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: "node 18/20/22", l: 26, t: 34, s: 20, d: 20, dl: 1.9 },
  { ch: "ci.yml", l: 55, t: 5, s: 26, d: 22, dl: 0.6 },
  { ch: "✗", l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: "✓", l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: "production", l: 34, t: 62, s: 20, d: 29, dl: 3.4 },
  { ch: "💨", l: 2, t: 30, s: 26, d: 28, dl: 3.1 },
  { ch: "🔐", l: 60, t: 90, s: 20, d: 31, dl: 4.2 },
  { ch: "🛫", l: 20, t: 16, s: 22, d: 18, dl: 2.9 }
];
var QUIZ_BANK = [
  { q: { uz: "Parallel lentalar (matrix) nima uchun ishlatiladi?", ru: "Для чего используются параллельные ленты (matrix)?" }, opts: [{ uz: "Bir nechta muhitda (masalan, Node versiyalarida) bir vaqtda sinash uchun", ru: "Чтобы тестировать одновременно в нескольких средах (например, версиях Node)" }, { uz: "Faqat production serverini qayta yuklab, ishga tushirish uchun ishlatiladi", ru: "Чтобы просто перезагружать и запускать продакшен-сервер" }, { uz: "Kodni faqat bitta muhitda biroz sekinroq tekshirish uchun maxsus ishlatiladi", ru: "Чтобы проверять код в одной-единственной среде, но чуть медленнее" }, { uz: "Maxfiy kalitlarni bitta joyga yig'ib, doim yashirib qo'yish uchun ishlatiladi", ru: "Чтобы собрать секретные ключи в одном месте и всегда их прятать" }], correct: 0 },
  { q: { uz: "Yaqin javon (cache) nimani tezlashtiradi?", ru: "Что ускоряет ближняя полка (cache)?" }, opts: [{ uz: "Foydalanuvchi brauzeridagi sahifa render bo'lish tezligini oshirib beradi", ru: "Скорость отрисовки страницы в браузере пользователя" }, { uz: "Faqat production serverining internetga ulanish tezligini oshirib beradi", ru: "Только скорость подключения продакшен-сервера к интернету" }, { uz: "Testlarning ichidagi mantiqiy hisob-kitoblarini bajarish tezligini oshiradi", ru: "Скорость логических вычислений внутри тестов" }, { uz: "Paketlarni qaytadan yuklamaslik orqali install bosqichini tezlashtiradi", ru: "Этап install — пакеты не скачиваются заново" }], correct: 3 },
  { q: { uz: "Maxfiy kalitni (masalan API_KEY) yo'l xaritasiga qanday yozish xavfsiz?", ru: "Как безопасно записать секретный ключ (например, API_KEY) в маршрутную карту?" }, opts: [{ uz: "To'g'ridan-to'g'ri ochiq matn sifatida faylning ichiga yozib qo'yiladi", ru: "Записать прямо в файл открытым текстом" }, { uz: "README faylining eng boshiga alohida qatorga yozib qo'yiladi", ru: "Записать отдельной строкой в самом начале README" }, { uz: "Seyfga saqlab, keyin maxsus belgi orqali chaqirib ishlatiladi", ru: "Сохранить в сейфе и вызывать через специальную запись" }, { uz: "Commit izohiga (commit message) yozib, keyin push qilib yuboriladi", ru: "Записать в сообщение коммита и отправить push" }], correct: 2 },
  { q: { uz: "Sinov reysi (staging) nima uchun kerak bo'ladi?", ru: "Зачем нужен тестовый рейс (staging)?" }, opts: [{ uz: "Kodni to'g'ridan-to'g'ri yo'lovchi qo'liga tezroq yetkazish uchun kerak", ru: "Чтобы быстрее доставить код прямо в руки пассажира" }, { uz: "Haqiqiy reysdan oldin yo'lovchisiz alohida sinab ko'rish uchun", ru: "Чтобы отдельно всё проверить без пассажиров перед настоящим рейсом" }, { uz: "Parallel lentalarni bitta katta lentaga birlashtirib qo'yish uchun kerak", ru: "Чтобы объединить параллельные ленты в одну большую ленту" }, { uz: "Maxfiy kalitlarni ochiq holda saqlab qo'yish uchun ishlatiladi doimo", ru: "Чтобы всегда хранить секретные ключи в открытом виде" }], correct: 1 },
  { q: { uz: "Yangi o'ralgan yuk productionda buzuq chiqdi. Eng tez yechim nima bo'ladi?", ru: "Новый упакованный багаж в продакшене оказался сломанным. Какое решение самое быстрое?" }, opts: [{ uz: "Yaqin javonni (cache) to'liq tozalab, yana boshidan yuklab olinadi", ru: "Полностью очистить кеш (cache) и загрузить всё заново" }, { uz: "Barcha maxfiy kalitlarni butunlay o'chirib, so'ngra yangidan yaratib qo'yiladi", ru: "Удалить все секретные ключи и создать их заново" }, { uz: "Parallel lentalar sonini yana ko'proq oshirib, qayta sinab ko'riladi", ru: "Увеличить количество параллельных лент и попробовать снова" }, { uz: "Eski yukni qaytarish (rollback) bilan oldingi versiyaga darhol qaytiladi", ru: "Сразу вернуться к прежней версии через rollback (возврат старого багажа)" }], correct: 3 },
  { q: { uz: "Matrix'da 3 muhitdan biri (masalan Node 18) qizil chiroq bersa nima bo'ladi?", ru: "Что будет, если в matrix одна из 3 сред (например, Node 18) даст красный свет?" }, opts: [{ uz: "Aynan o'sha muhit qizil ko'rinadi, qaysi sharoitda singani aniqlanadi", ru: "Красной станет именно эта среда — сразу ясно, в каких условиях всё сломалось" }, { uz: "Qolgan ikkita muhit ham avtomatik ravishda qizil bo'lib qolaveradi", ru: "Остальные две среды тоже автоматически станут красными" }, { uz: "Butun lenta darhol butunlay o'chib, hammasi qayta o'rnatilishi kerak bo'ladi", ru: "Вся лента сразу выключится, и всё придётся переустанавливать" }, { uz: "Barcha muhitlar birlashib, o'rtacha bitta natija chiqarib beriladi", ru: "Все среды объединятся и выдадут один усреднённый результат" }], correct: 0 },
  { q: { uz: "Yaqin javon (cache) qanday qilib ishlaydi?", ru: "Как работает ближняя полка (cache)?" }, opts: [{ uz: "Har reysda hamma narsani doim noldan boshlab qayta yozib chiqaveradi", ru: "На каждом рейсе всегда всё переделывает заново с нуля" }, { uz: "Avvalgi reysda yuklangan paketlarni saqlab, keyin qayta ishlatiladi", ru: "Сохраняет пакеты с прошлого рейса и использует их снова" }, { uz: "Testlar natijasini butunlay eslab qolib, qayta ishga tushirmaydi", ru: "Запоминает результаты тестов и больше их не запускает" }, { uz: "Faqat maxfiy kalitlarni saqlaydi, boshqa hech narsani saqlamaydi", ru: "Хранит только секретные ключи и больше ничего" }], correct: 1 },
  { q: { uz: "Seyf (secrets) qayerda saqlanishi kerak bo'ladi?", ru: "Где должны храниться секреты (secrets)?" }, opts: [{ uz: "ci.yml faylining o'zida, hammaga ochiq matn sifatida turadi doimo", ru: "Прямо в файле ci.yml, открытым текстом на виду у всех" }, { uz: "Lenta jurnalining (logs) eng oxirgi qatoriga yozib qo'yiladi", ru: "В самой последней строке журнала ленты (logs)" }, { uz: "Platformaning maxsus xavfsiz seyf sozlamalar bo'limida saqlanadi", ru: "В специальном безопасном разделе-сейфе в настройках платформы" }, { uz: "Foydalanuvchiga ochiq ko'rinadigan README faylida saqlanadi", ru: "В файле README, открытом для любого пользователя" }], correct: 2 },
  { q: { uz: "Sinov reysi (staging) va haqiqiy reys (production) orasidagi farq nima?", ru: "В чём разница между тестовым рейсом (staging) и настоящим (production)?" }, opts: [{ uz: "Sinov reysida yo'lovchi yo'q, haqiqiy reysda esa yo'lovchi bor", ru: "На тестовом рейсе пассажиров нет, а на настоящем — есть" }, { uz: "Sinov reysi faqat dushanba kunlari ishga tushib, keyin o'chadi", ru: "Тестовый рейс запускается только по понедельникам, а потом отключается" }, { uz: "Ikkalasi ham aslida bir xil, faqat nomlari boshqacha qo'yilgan", ru: "На самом деле они одинаковые, просто названия разные" }, { uz: "Haqiqiy reys hech qachon hech qanday tekshiruvdan o'tmasligi kerak", ru: "Настоящий рейс вообще не должен проходить никаких проверок" }], correct: 0 },
  { q: { uz: "Eski yukni qaytarish (rollback) qachon ishlatilishi kerak bo'ladi?", ru: "Когда нужно использовать возврат старого багажа (rollback)?" }, opts: [{ uz: "Har push'da, sharoitidan qat'i nazar har doim ishlatilishi kerak", ru: "При каждом push, всегда и независимо от ситуации" }, { uz: "Yangi versiya productionda muammo chiqarganda, tez qaytish uchun", ru: "Когда новая версия дала сбой в продакшене — чтобы быстро вернуться" }, { uz: "Yaqin javon (cache) hali bo'sh bo'lgan paytda ishlatilishi kerak", ru: "Когда ближняя полка (cache) ещё пустая" }, { uz: "Faqat matrix barcha muhitlarda to'liq yashil bo'lgan paytda ishlatiladi", ru: "Только когда matrix полностью зелёный во всех средах" }], correct: 1 },
  { q: { uz: "Parallel lentalar foydali — turli muhitda kod boshqacha ishlashi mumkinmi?", ru: "Параллельные ленты полезны — а может ли код в разных средах работать по-разному?" }, opts: [{ uz: "Ha, lekin bu faqat yakshanba kunlari shunday bo'lib qoladi", ru: "Да, но только по воскресеньям" }, { uz: "Yo'q, barcha muhitlarda kod har doim aynan bir xil ishlaydi", ru: "Нет, во всех средах код всегда работает одинаково" }, { uz: "Yo'q, matrix faqat sayt dizaynini tekshiradi, kodni umuman tekshirmaydi", ru: "Нет, matrix проверяет только дизайн сайта, а код — вообще нет" }, { uz: "Ha, chunki turli muhitlarda kod har xil natija berishi mumkin bo'ladi", ru: "Да, ведь в разных средах код может давать разный результат" }], correct: 3 },
  { q: { uz: "Ishonchli lentada to'g'ri tartib qanday bo'lishi kerak?", ru: "Каким должен быть правильный порядок в надёжной ленте?" }, opts: [{ uz: "Avval production ishga tushadi, so'ngra sinov reysi (staging) boshlanadi", ru: "Сначала запускается production, затем начинается тестовый рейс (staging)" }, { uz: "Avval rollback qilinib, keyin yangi yuk chiqarib yuboriladi", ru: "Сначала делается rollback, потом выпускается новый багаж" }, { uz: "Avval sinov reysi (staging), so'ngra haqiqiy reys (production)", ru: "Сначала тестовый рейс (staging), затем настоящий рейс (production)" }, { uz: "Avval seyf o'chiriladi, keyin kod yozishga kirishiladi", ru: "Сначала отключается сейф, потом начинают писать код" }], correct: 2 }
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
          <span className="cs-hud-i">🏆 PODIUM</span>
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
    const TOK = ["matrix", "cache", "secrets", "staging", "rollback", "ci.yml", "runner", "✓", "✗", "node 20"];
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
      if (typeof window !== "undefined" && !window.confirm(tr2({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?", ru: "Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nВсё равно закрыть?" }))) return;
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
          <span>{tr2({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "⚠️ Живой урок завершён — продолжите тест самостоятельно:" })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "📖 Mashq rejimida davom etish", ru: "📖 Продолжить в режиме практики" })}</button>
        </div>}

      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr2({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: "Чем быстрее верный ответ — тем больше баллов. Серия верных ответов подряд даёт 🔥 бонус!" })}</p>
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
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr2({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ""}</span></> : <span className="qz-res-t">{my ? tr2({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: "Ошибка — 0 баллов. Возьмёте своё на следующем! 💪" }) : tr2({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: "Время вышло — 0 баллов. Побыстрее! ⏱" })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr2({ uz: <>Siz hozir: {myRank + 1}-o'rin</>, ru: <>Вы сейчас на {myRank + 1}-м месте</> })}</span>}
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
              <p className="qz-sub">{tr2({ uz: <>ball · {soloScore.ok}/{QUIZ_BANK.length} to'g'ri{soloScore.maxStreak >= 2 ? ` · eng uzun streak 🔥x${soloScore.maxStreak}` : ""}</>, ru: <>баллов · {soloScore.ok}/{QUIZ_BANK.length} верных{soloScore.maxStreak >= 2 ? ` · лучшая серия 🔥x${soloScore.maxStreak}` : ""}</> })}</p>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)", ru: "↻ Пройти тест ещё раз — практика (в таблицу не записывается)" })}</button>}
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr2({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верных)</> })}</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "🏆 To'liq reyting", ru: "🏆 Полный рейтинг" })}</div>
              <div className="pod-list">
                {board.map((b, i) => <div key={b.id} className={`pod-row ${live.playerId === b.id ? "me" : ""}`}>
                    <span className="mono pod-rank">{i + 1}</span>
                    <span className="pod-row-name">{b.nickname}</span>
                    <span className="pod-row-dots">{SCORED_IDX.map((q) => {
    const a = rows.find((r) => r.player_id === b.id && r.screen_idx === q);
    return <span key={q} className={`pod-dot ${a ? a.correct ? "ok" : "bad" : ""}`} title={Q_LABELS[q]} />;
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
  if (!live || live.mode !== "mentor" || !data.players || data.players.length === 0) return null;
  const players = data.players;
  const doers = players.filter((p) => data.doneIds.has(p.id));
  const waiting = players.filter((p) => !data.doneIds.has(p.id));
  return <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>👀 {tr2({ uz: "Kim bajardi", ru: "Кто выполнил" })} — {doers.length}/{players.length}</div>
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
  return <Stage eyebrow={tr2({ uz: "Amaliyot · VS Code", ru: "Практика · VS Code" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : tr2({ uz: "Avval bajaring", ru: "Сначала выполните" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(12px,2vw,18px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2(title)}</h2></div>
        <Mentor>{tr2({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Отмечайте каждый шаг по мере выполнения. Когда закончите, нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — наставник следит за прогрессом.</> })}</Mentor>
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
              {done ? tr2({ uz: "✓ Bajarildi — ustozni kuting", ru: "✓ Выполнено — ждите наставника" }) : tr2({ uz: "✅ Bajardim", ru: "✅ Готово" })}
            </button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr2({ uz: "Juda yaxshi! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: "Отлично! Задание выполнено. Наставник проверит и переведёт вас на следующий шаг." })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>;
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
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr2({ uz: "O'rganilmoqda", ru: "Изучается" })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr2({ uz: "Bildim", ru: "Знаю" })} · <b>{known}</b></span></div>
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
var ScreenProPractice = (props) => <ScreenLivePractice
  {...props}
  title={{ uz: "O'z loyihangizga ishonchli lenta yaxshilashlarini qo'shing", ru: "Добавьте в свой проект улучшения надёжной ленты" }}
  task={{ uz: "Repo'dagi ci.yml faylini yaxshilang: bir nechta muhitda parallel test (matrix), paketlarni tezlashtiruvchi kesh (cache) va maxfiy kalitni seyfda saqlash (secrets) qo'shing. Keyin push qilib, Actions bo'limida natijani kuzating.", ru: "Улучшите файл ci.yml в репозитории: добавьте параллельные тесты в нескольких средах (matrix), ускоряющий кеш пакетов (cache) и хранение секретного ключа в сейфе (secrets). Затем сделайте push и следите за результатом в разделе Actions." }}
  checklist={[
    { uz: "`ci.yml` ichiga `strategy: matrix` bilan 2-3 muhit (masalan `node-version: [18, 20, 22]`) qo'shing", ru: "Добавьте в `ci.yml` 2-3 среды через `strategy: matrix` (например `node-version: [18, 20, 22]`)" },
    { uz: "`actions/cache@v4` bilan `node_modules`'ni keshlang", ru: "Закешируйте `node_modules` с помощью `actions/cache@v4`" },
    { uz: "Har qanday maxfiy qiymatni `${{ secrets.NOM }}` orqali chaqiring — hech qachon ochiq yozmang", ru: "Любое секретное значение вызывайте через `${{ secrets.NOM }}` — никогда не пишите его открыто" },
    { uz: "O'zgarishni push qiling", ru: "Сделайте push изменений" },
    { uz: "`Actions` bo'limini oching — 3 muhit parallel aylanayotganini kuzating", ru: "Откройте раздел `Actions` — понаблюдайте, как 3 среды крутятся параллельно" }
  ]}
/>;
var PRO_FLASHCARDS = [
  { front: { uz: "Bitta kodni bir nechta Node versiyasida birdan tekshirish nima deb ataladi?", ru: "Как называется проверка одного кода сразу в нескольких версиях Node?" }, back: "matrix", note: { uz: "Parallel lentalar: Node 18, 20 va 22 bir vaqtda tekshiriladi", ru: "Параллельные ленты: Node 18, 20 и 22 проверяются одновременно" } },
  { front: { uz: "ci.yml faylida bir nechta muhitni qaysi kalit sanab beradi?", ru: "Какой ключ перечисляет несколько сред в файле ci.yml?" }, back: "strategy: matrix", note: { uz: "Muhitlar ro'yxati aynan shu kalit ostiga yoziladi", ru: "Список сред пишется именно под этим ключом" } },
  { front: { uz: "Matrixda uchta muhitdan biri qizil bo'lsa, qolganlari nima qiladi?", ru: "Одна из трёх сред в matrix покраснела — что делают остальные?" }, back: { uz: "Ishlashda davom etadi", ru: "Продолжают работать" }, note: { uz: "Shuning uchun aynan qaysi sharoitda singani aniq ko'rinadi", ru: "Именно поэтому сразу видно, в каких условиях всё сломалось" } },
  { front: { uz: "Paketlarni qayta yuklamay lentani tezlashtiruvchi vosita qanday ataladi?", ru: "Как называется то, что ускоряет ленту, не качая пакеты заново?" }, back: "cache", note: { uz: "Yaqin javon: 40 soniya o'rniga 8 soniya", ru: "Ближняя полка: 8 секунд вместо 40" } },
  { front: { uz: "Odatda qaysi papka yaqin javonda saqlanadi?", ru: "Какую папку обычно держат на ближней полке?" }, back: "node_modules", note: { uz: "O'zgarmagan paketlarni qayta yuklash shart emas", ru: "Пакеты, которые не менялись, качать заново незачем" } },
  { front: { uz: "Maxfiy kalit qayerda saqlanishi kerak?", ru: "Где должен храниться секретный ключ?" }, back: { uz: "Seyfda (secrets)", ru: "В сейфе (secrets)" }, note: { uz: "Yo'l xaritasida ochiq yozilsa, uni hamma o'qiy oladi", ru: "Если записать открыто в карте маршрута, его прочитает кто угодно" } },
  { front: { uz: "Kodda maxfiy kalitni qanday chaqirasiz?", ru: "Как вы вызываете секретный ключ в коде?" }, back: "${{ secrets.API_KEY }}", note: { uz: "Kalitning qiymati lenta jurnalida yulduzcha bilan yashiriladi", ru: "Значение ключа в журнале ленты закрывается звёздочками" } },
  { front: { uz: "Yo'lovchisiz sinab ko'riladigan muhit qanday ataladi?", ru: "Как называется среда, где проверяют без пассажиров?" }, back: "staging", note: { uz: "Sinov reysi: xato chiqsa ham hech kim zarar ko'rmaydi", ru: "Пробный рейс: даже если вылезет ошибка, никто не пострадает" } },
  { front: { uz: "Foydalanuvchi ishlatadigan haqiqiy muhit qanday ataladi?", ru: "Как называется настоящая среда, которой пользуется пользователь?" }, back: "production", note: { uz: "Haqiqiy reys: yuk endi yo'lovchi qo'lida", ru: "Настоящий рейс: багаж уже в руках пассажира" } },
  { front: { uz: "Sinov reysi bilan haqiqiy reys qaysi tartibda boradi?", ru: "В каком порядке идут пробный и настоящий рейсы?" }, back: { uz: "Avval staging, keyin production", ru: "Сначала staging, потом production" }, note: { uz: "Sinov reysi yashil bo'lgach, xuddi shu yuk haqiqiy reysga chiqadi", ru: "Как только пробный рейс зелёный, тот же груз выходит на настоящий" } },
  { front: { uz: "Productionda buzuq versiya chiqsa, eng tez yechim qanday ataladi?", ru: "В production вышла сломанная версия — как называется самое быстрое решение?" }, back: "rollback", note: { uz: "Eski yukni qaytarish: oldingi ishlaydigan versiyaga qaytasiz", ru: "Возврат старого багажа: вы возвращаетесь к прежней рабочей версии" } },
  { front: { uz: "Rollback tez qilinsa, foydalanuvchi muammoni qanchalik sezadi?", ru: "Если откатиться быстро, насколько пользователь заметит проблему?" }, back: { uz: "Deyarli sezmaydi", ru: "Почти не заметит" }, note: { uz: "Tezlik foydalanuvchi ishonchini saqlab qoladi", ru: "Скорость сохраняет доверие пользователя" } }
];
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect4(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  return <Stage eyebrow={tr2({ uz: "Takrorlash", ru: "Повторение" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr2({ uz: "Yakunlash →", ru: "Завершить →" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={PRO_FLASHCARDS} /></div>
      </div>
    </Stage>;
};
var SummaryScreen = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
    { uz: "Matrix — bitta yukni bir nechta muhitda (masalan Node versiyalarida) parallel tekshiradi", ru: "Matrix — проверяет один груз параллельно в нескольких средах (например, версиях Node)" },
    { uz: "Cache — avvalgi paketlarni saqlab, keyingi reysni sezilarli tezlashtiradi", ru: "Cache — сохраняет прежние пакеты и заметно ускоряет следующий рейс" },
    { uz: "Secret — maxfiy kalitlar hech qachon ochiq yozilmaydi, faqat seyfdan chaqiriladi", ru: "Secret — секретные ключи никогда не пишутся открыто, только вызываются из сейфа" },
    { uz: "Staging → Production — avval sinov reysida, keyin haqiqiy reysga chiqariladi", ru: "Staging → Production — сначала тестовый рейс, потом выход на настоящий" },
    { uz: "Rollback — production'da muammo chiqsa, bir bosishda eski yukka qaytiladi", ru: "Rollback — при проблеме в продакшене возврат к старому багажу в один клик" }
  ];
  const HOMEWORK = [
    { b: { uz: "Qo'shing", ru: "Добавьте" }, t: { uz: "— o'z loyihangizga matrix bilan kamida 2 muhitni sinash", ru: "— проверку минимум 2 сред через matrix в своём проекте" } },
    { b: { uz: "Sozlang", ru: "Настройте" }, t: { uz: "— node_modules uchun cache qo'shing va vaqt farqini o'lchang", ru: "— добавьте cache для node_modules и измерьте разницу во времени" } },
    { b: { uz: "Tekshiring", ru: "Проверьте" }, t: { uz: "— loyihangizda hech qanday maxfiy kalit ochiq yozilmaganini tekshiring", ru: "— что в вашем проекте ни один секретный ключ не записан открыто" } }
  ];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return <Stage eyebrow={tr2({ uz: "Tayyor", ru: "Готово" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Yakunlash ✓", ru: "Завершить ✓" })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr2({ uz: "Ishonchli lentani yig'dingiz", ru: "Вы собрали надёжную ленту" })}</span><h2 className="title h-title fade-up d1">{tr2({ uz: <>Endi lentangiz — <span className="italic" style={{ color: T.accent }}>tez, xavfsiz, qaytariladigan</span>.</>, ru: <>Теперь ваша лента — <span className="italic" style={{ color: T.accent }}>быстрая, безопасная, обратимая</span>.</> })}</h2>{
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr2({ uz: "📝 Uyga vazifa", ru: "📝 Домашнее задание" })}</div><ul>{HOMEWORK.map((h, i) => <li key={i}><b>{tr2(h.b)}</b> <span className="t">{tr2(h.t)}</span></li>)}</ul><p className="hw-note">{tr2({ uz: "🚀 Loyiha kuni davom etadi — endi bu ishonchli lentani o'z bitiruv loyihangizga qo'llaysiz!", ru: "🚀 Проектный день продолжается — теперь примените эту надёжную ленту в своём выпускном проекте!" })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr2({ uz: "Nishonlaringiz", ru: "Ваши значки" })} — {achievements ? achievements.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
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
function FullProPipelineLesson({ lang: langProp, onFinished, liveToken }) {
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
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]);
    if (_m && _m.scored && _m.scope === "final" && data && data.solved && live.mode === "student") live.submitAnswer(idx, _m.id, data.picked ?? 1, !!data.correct, data.elapsedMs || 0);
  };
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
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenProPractice, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; }
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

        /* === MENTOR === */
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

        /* === HOOK OPSIYALARI (radio) === */
        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .hook-option:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }


        .h-title { font-size: clamp(22px,4vw,38px); }
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
        /* frame-warn — FAQAT haqiqiy xato/yiqilish (401/400/500, noto'g'ri tanlov): dangerSoft, yo'lakdagi rz-crash bilan bir tilda */
        .frame-warn { background: ${T.dangerSoft}; border-left: 4px solid ${T.danger}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(194,54,43,0.22); }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }
        /* 🔓 klapan ipuchasi (m4-08 bilan bir xil): .bhint — ipucha, .bhint.calm — «Davom etish» ochildi */
        .bhint.bhint { margin: 0; align-self: flex-start; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 14px; box-shadow: inset 0 0 0 1.5px ${T.accent}33; }
        .bhint.bhint.calm { color: ${T.ink2}; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; font-style: italic; }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
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
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === AI CARD === */
        .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }

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

        /* === 4-MODUL: KOD QUTISI === */
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

        /* === JSON KO'RINISHI === */

        /* === MA'LUMOT JADVALI === */

        /* === SXEMA JADVAL-KARTOCHKASI === */

        /* === BOG'LANISH TUGMASI (s10) === */

        /* === TANLASH QATORI (s13) === */

        /* === YAKUNIY SXEMA KANVAS (s15) === */

        /* === Instagram POST KARTOCHKASI === */

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }
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
        .lp-done-btn.is-done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; animation: lp-done-pop 0.44s cubic-bezier(.3,1.35,.5,1); }
        /* O'quvchi ko'radigan sinf-pulsi (StudentPracticePulse, 4-Modul standarti) */
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done { animation: none !important; } }
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }

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
        .pod-my b { color: ${T.success}; } /* 11.16: o'quvchining O'Z natijasi YASHIL (qizil faqat xato javob uchun) */
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
        /* --- Kahoot-kutish holatlari (jonli test) --- */
        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        /* === MENTOR STATISTIKASI (jonli test + yozma ish panellari) === */
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

        /* === ⚡ CTA (yakun sahifasida) === */
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

        /* tap-hint affordance: bosilmagan karta "meni bos" deb pulslaydi */
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 0 rgba(255,79,40,0.4); } 70%,100% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 8px rgba(255,79,40,0); } }

        /* Kahoot-kutish: tanlangan variant javob ochilguncha nafas oladi */
        .option-wait { animation: opt-wait-breathe 2s ease-in-out infinite; }
        @keyframes opt-wait-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.012); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }

        /* ============ 4c-MODUL · CI/CD DARSI CSS ============ */

        /* TERMINAL (retyped — reusable qatlamdan tashqarida, shu yerda kerak) */
        .term { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .term-bar { background: #2D2D2D; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .term-title { font-family: 'JetBrains Mono'; font-size: 11px; color: #C9D1D9; }
        .term-body { background: #1E1E1E; padding: 12px 13px; min-height: 60px; }
        .tline { font-family: 'JetBrains Mono'; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.8; color: ${CODE.text}; word-break: break-word; }

        /* LENTA (pipeline) status-strip — s1/s3/s6/s7 preview */
        /* pipe-track — lenta ostidagi cheksiz aylanuvchi chiziqlar (doim sekin harakatlanadi, "lenta ishlayapti" hissi) */
        .pipe-track { position: relative; border-radius: 14px; overflow: visible; padding: 20px 2px 9px; }
        .pipe-track::after { content: ''; position: absolute; left: 0; right: 0; bottom: 2px; height: 3px; border-radius: 99px; background-image: repeating-linear-gradient(90deg, ${T.ink3}70 0 9px, transparent 9px 19px); background-size: 38px 100%; animation: belt-scroll 1s linear infinite; opacity: 0.55; }
        @keyframes belt-scroll { to { background-position: -38px 0; } }
        /* 🧳 chamadon — hozirgi nuqtaga qarab lenta ustida siljiydi */
        .pipe-suitcase { position: absolute; top: 0; font-size: 16px; transform: translateX(-50%); transition: left 0.6s cubic-bezier(.4,0,.2,1); z-index: 2; filter: drop-shadow(0 3px 5px rgba(${T.shadowBase},0.35)); }
        @media (prefers-reduced-motion: reduce) { .pipe-suitcase { transition: none; } }
        .pipe { position: relative; z-index: 1; display: flex; align-items: center; flex-wrap: wrap; gap: 5px; padding: 4px 0; }
        .pipe-step { position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; background: ${T.paper}; border-radius: 11px; padding: 9px 11px; min-width: 66px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); transition: all 0.25s, opacity 0.35s; }
        .pipe-ico { font-size: 19px; line-height: 1; display: inline-block; }
        .pipe-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; color: ${T.ink}; }
        .pipe-badge { font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 800; min-height: 13px; line-height: 1; color: ${T.ink3}; }
        .pipe-arrow { color: ${T.ink3}; font-weight: 700; font-size: 14px; }
        /* 🔍 SKANER: nuqta ustida yuqoridan pastga o'tuvchi ko'k tekshiruv nuri */
        .pipe-step.run { box-shadow: inset 0 0 0 1.5px ${T.blue}, 0 5px 14px -6px rgba(1,154,203,0.3); animation: pipe-run-pulse 0.9s ease-in-out infinite; }
        .pipe-step.run::after { content: ''; position: absolute; left: 0; right: 0; top: -45%; height: 45%; background: linear-gradient(180deg, transparent, rgba(1,154,203,0.75), transparent); animation: scan-sweep 0.8s ease-in-out infinite; pointer-events: none; }
        @keyframes scan-sweep { 0% { top: -45%; } 100% { top: 115%; } }
        @keyframes pipe-run-pulse { 0%,100% { box-shadow: inset 0 0 0 1.5px ${T.blue}, 0 5px 14px -6px rgba(1,154,203,0.3); } 50% { box-shadow: inset 0 0 0 1.5px ${T.blue}, 0 8px 18px -6px rgba(1,154,203,0.45); } }
        .pipe-step.run .pipe-badge { color: ${T.blue}; }
        .pipe-step.pass { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .pipe-step.pass .pipe-badge { color: ${T.success}; }
        /* ✈️ UCHISH: faqat Uchirish nuqtasi yashil bo'lganda — samolyot sirg'alib ko'tariladi */
        .pipe-step[data-id="deploy"].pass .pipe-ico { animation: plane-launch 0.9s cubic-bezier(.3,.75,.4,1) both; }
        @keyframes plane-launch { 0% { transform: translate(0,0) rotate(0deg); } 55% { transform: translate(13px,-11px) rotate(-8deg); } 100% { transform: translate(0,0) rotate(0deg); } }
        /* 🚦 QIZIL CHIROQ: lenta shu nuqtada TO'XTAYDI — 2 marta qizil pulsatsiya + chamadon titraydi */
        .pipe-step.fail { background: ${T.dangerSoft}; box-shadow: inset 0 0 0 1.5px ${T.danger}; animation: pipe-fail-pulse 0.5s ease-in-out 2, pipe-fail-shake 0.5s ease; }
        @keyframes pipe-fail-pulse { 0%,100% { box-shadow: inset 0 0 0 1.5px ${T.danger}, 0 0 0 0 rgba(194,54,43,0); } 50% { box-shadow: inset 0 0 0 1.5px ${T.danger}, 0 0 0 6px rgba(194,54,43,0.32); } }
        @keyframes pipe-fail-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(4px); } }
        .pipe-step.fail .pipe-badge { color: ${T.danger}; }
        /* keyingi nuqtalar — lenta to'xtaganda so'nib qoladi, chiziqlar ham qotadi */
        .pipe-step.skip { opacity: 0.35; }
        .pipe-track:has(.pipe-step.fail)::after { animation-play-state: paused; opacity: 0.25; }
        @keyframes rz-shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }

        /* Qo'lda-yuk / vasvasali tugma vaqt taymerlari (s2/s3) */
        .timer-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .timer-chip { flex: 1; min-width: 130px; display: flex; flex-direction: column; gap: 3px; background: ${T.paper}; border-radius: 12px; padding: 12px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); }
        .timer-chip .tc-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .timer-chip .tc-val { font-family: 'JetBrains Mono'; font-weight: 800; font-size: clamp(20px,3vw,28px); color: ${T.ink}; }
        .timer-chip.danger .tc-val { color: ${T.danger}; }
        .timer-chip.success .tc-val { color: ${T.success}; }

        /* 📱 TELEFON MOCK — foydalanuvchi ekrani (doim ko'rinadi) */
        .phone-mock { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .phone-body { position: relative; width: clamp(96px,14vw,128px); height: clamp(176px,24vw,232px); background: #16171B; border-radius: 22px; padding: 8px; box-shadow: 0 14px 30px -12px rgba(${T.shadowBase},0.4), inset 0 0 0 2px #2A2B31; }
        .phone-notch { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 34px; height: 5px; border-radius: 99px; background: #2A2B31; z-index: 2; }
        .phone-screen { position: relative; width: 100%; height: 100%; border-radius: 15px; overflow: hidden; background: ${T.bg}; }
        .phone-face { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; text-align: center; padding: 8px; opacity: 0; transition: opacity 0.5s ease; }
        .phone-face span:first-child { font-size: 26px; }
        .phone-face p { margin: 0; font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.ink}; }
        .phone-ok { font-family: 'JetBrains Mono'; font-size: 9px; font-weight: 700; }
        .phone-screen.old .old-face { opacity: 1; }
        .phone-screen.new .new-face { opacity: 1; }
        .phone-screen.broken .broken-face { opacity: 1; }
        .old-face .phone-ok { color: ${T.ink2}; }
        .new-face .phone-ok, .new-face span:first-child { color: ${T.success}; }
        .broken-face .phone-ok, .broken-face span:first-child { color: ${T.danger}; }
        .phone-lbl { font-family: 'Manrope'; font-weight: 600; font-size: 10.5px; color: ${T.ink3}; }

        /* 🧳 CHAMADON / BUYUM KARTALARI — s2, s5, s7, s9 markaziy o'yin */
        .cj-items { display: flex; flex-wrap: wrap; gap: 9px; }
        .itm-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; width: clamp(84px,15vw,104px); background: ${T.paper}; border: none; border-radius: 13px; padding: 11px 7px 9px; cursor: pointer; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.2); transition: all 0.16s; }
        .itm-card:hover:not(:disabled) { transform: translateY(-2px); }
        .itm-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -8px rgba(255,79,40,0.3); }
        .itm-card:disabled { cursor: not-allowed; opacity: 0.75; }
        .itm-ico { font-size: 20px; }
        .itm-nm { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 10.5px; color: ${T.ink}; text-align: center; }

        /* MUHIT/VARIANT KARTALARI (vcard) — s2 matrix, s11 staging, s13 builder ro'yxati */
        .vcard { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover:not(:disabled) { transform: translateY(-1px); }
        .vcard:disabled { cursor: default; }
        .vlbl { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .vseen { margin-left: auto; font-weight: 700; }
        .role-ico { font-size: 20px; flex-shrink: 0; }

        /* LENTA JURNALI — terminal-uslub log */

        /* YO'L XARITASI bo'shliqlari (s13 builder) */

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi. Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        .btn-soft.tap-hint, .itm-card.tap-hint, .vcard.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }

        .dd { display: flex; flex-direction: column; gap: 13px; }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; position: relative; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 58px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; box-shadow: 0 5px 14px -9px rgba(${T.shadowBase},0.2); transition: border-color .18s, background .18s, box-shadow .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; box-shadow: 0 8px 18px -10px rgba(${T.shadowBase},0.26); }
        /* to'g'ri terilganda — qadamlar KETMA-KET tasdiqlanadi (yuqoridan pastga to'lqin) */
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; animation: dd-ok-pop 0.42s cubic-bezier(.3,1.5,.5,1); }
        .dd-slot.ok:nth-child(2) { animation-delay: 0.07s; } .dd-slot.ok:nth-child(3) { animation-delay: 0.14s; }
        .dd-slot.ok:nth-child(4) { animation-delay: 0.21s; } .dd-slot.ok:nth-child(5) { animation-delay: 0.28s; }
        @keyframes dd-ok-pop { 0%,100% { transform: scale(1); } 45% { transform: scale(1.025); } }
        .dd-slot.bad { border-color: ${T.danger}; background: ${T.dangerSoft}; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        /* SNAP — bo'lak slotga tushganda "qulflandi" hissi (fill-mode YO'Q — sudrash transform'i erkin qolsin) */
        .dd-chip.in { animation: dd-snap 0.32s cubic-bezier(.3,1.6,.5,1); }
        @keyframes dd-snap { 0% { transform: scale(1.14) rotate(-2deg); } 55% { transform: scale(0.97) rotate(0.5deg); } 100% { transform: scale(1) rotate(0); } }
        .dd-slotn { width: 26px; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; box-shadow: none; }
        .dd-slot.bad .dd-slotn { background: ${T.danger}; color: #fff; box-shadow: none; }
        .dd-hint { flex: 1; min-width: 0; color: ${T.ink3}; font-style: italic; font-size: 13px; line-height: 1.35; }
        .dd-slot .dd-chip { min-width: 168px; text-align: left; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${T.bg}; position: relative; z-index: 1; }
        .dd-pool-empty { color: ${T.ink3}; font-size: 12.5px; font-style: italic; align-self: center; }
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip:hover { transform: translateY(-2px); }
        .dd-chip:active { cursor: grabbing; }
        .dd-done { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .dd-wrong { font-weight: 700; color: ${T.danger}; font-size: 13.5px; }

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi (11.7). Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        /* 11.15 — jonli badge xira, hover'da tiniq (proyektorda xalaqit bermaydi) */
        .live-badge { opacity: 0.62; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* S21 — har og'ir animatsiyaga TINCH variant. */
        @media (prefers-reduced-motion: reduce) {
          .pipe-step.run, .pipe-step.fail, .itm-card.tap-hint, .btn-soft.tap-hint, .vcard.tap-hint,
          .dd-chip.in, .dd-slot.ok, .dd-slot.bad,
          .pipe-track::after, .pipe-step.run::after, .pipe-step[data-id="deploy"].pass .pipe-ico { animation: none !important; }
          .phone-face { transition: opacity 0.16s linear !important; }
        }

      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={{ uz: "Ishonchli lenta darsi", ru: "Урок надёжной ленты" }} /> : <>
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
  FullProPipelineLesson as default
};
