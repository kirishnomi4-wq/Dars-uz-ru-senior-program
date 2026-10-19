// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/9-Modull/PmOneOnOneLesson.jsx
//  Kompilyator: yo'q (dars uni import qilmaydi)
//  Qayta yig'ish:  node scripts/build-lms.mjs src/9-Modull/PmOneOnOneLesson.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/9-Modull/lms-entry:PmOneOnOneLesson.jsx
import React4, { createElement as __ccEl, useState as useState5, useEffect as useEffect6, useLayoutEffect, useRef as useRef5, createContext as createContext2, useContext as useContext2, useCallback as useCallback2, useMemo as useMemo2 } from "react";

// src/9-Modull/PmOneOnOneLesson.jsx

// src/live/previewMode.js
var PREVIEW = "preview";
var on = false;
var runId = null;
var OWN_KEY_PREFIXES = [
  "liveSession:",
  "liveNickname",
  "ccProgress:",
  "ccPractice:",
  "ccCode:",
  "ccDetails:",
  "ccSeal:",
  "ccHomework:",
  "ccHwSeal:",
  "ccHwQa-",
  "ccDemoDay",
  "ccPitch",
  "ccBridgeCard",
  "cc-site-url",
  "cc-deploy-project",
  "pm-",
  "bridge-",
  "ld-tahrir",
  "inetOnboarded_",
  "hcOnboarded_",
  "hcFont",
  "hcSplit"
];
var PASS_KEYS = ["cc_lang", "bridgeLang", "hwDemoLang"];
var isOwnKey = (k) => typeof k === "string" && (PASS_KEYS.includes(k) || OWN_KEY_PREFIXES.some((p) => k.startsWith(p)));
var isPreview = () => on;
function notePreviewProps(props) {
  if (props && props.visitMode === PREVIEW) {
    if (typeof props.previewRunId === "string" && /^[A-Za-z0-9_-]{16,128}$/.test(props.previewRunId)) runId = props.previewRunId;
    enable();
  }
  return isPreview();
}
function enable() {
  if (on) return;
  on = true;
  installOverlay();
}
function installOverlay() {
  if (typeof Storage === "undefined" || typeof window === "undefined") return;
  const P = Storage.prototype;
  if (P.__ccPreview) return;
  const local = /* @__PURE__ */ new Map(), session = /* @__PURE__ */ new Map();
  const memOf = (s) => {
    try {
      if (s === window.localStorage) return local;
    } catch {
    }
    try {
      if (s === window.sessionStorage) return session;
    } catch {
    }
    return null;
  };
  const get = P.getItem, set = P.setItem, rem = P.removeItem;
  P.getItem = function(k) {
    const m = memOf(this), key = String(k);
    if (!m || !isOwnKey(key)) return get.call(this, k);
    if (m.has(key)) return m.get(key);
    return PASS_KEYS.includes(key) ? get.call(this, k) : null;
  };
  P.setItem = function(k, v) {
    const m = memOf(this), key = String(k);
    if (m && isOwnKey(key)) {
      m.set(key, String(v));
      return;
    }
    return set.call(this, k, v);
  };
  P.removeItem = function(k) {
    const m = memOf(this), key = String(k);
    if (m && isOwnKey(key)) {
      m.set(key, null);
      return;
    }
    return rem.call(this, k);
  };
  Object.defineProperty(P, "__ccPreview", { value: true });
}

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
  clearedProgress.delete(lessonId);
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
var CAP_BYTES = 48e3;
var byteLen = (s) => {
  try {
    return new TextEncoder().encode(s).length;
  } catch {
    return s.length;
  }
};
function capPayload(payload, cap = CAP_BYTES) {
  if (!payload || typeof payload !== "object") return payload;
  if (byteLen(JSON.stringify(payload)) <= cap) return payload;
  const p = JSON.parse(JSON.stringify(payload));
  const dropped = [];
  const step = (name, fn) => {
    if (byteLen(JSON.stringify(p)) <= cap) return;
    fn();
    dropped.push(name);
  };
  step("answers", () => {
    delete p.answers;
  });
  step("attempts", () => {
    for (const q of p.questions || []) if (Array.isArray(q.attempts) && q.attempts.length > 3) q.attempts = q.attempts.slice(0, 3);
  });
  step("text", () => {
    const c = (s) => typeof s === "string" && s.length > 120 ? s.slice(0, 120) : s;
    for (const q of p.questions || []) {
      q.question = c(q.question);
      if (q.options) q.options = q.options.map(c);
      q.correct_answer = c(q.correct_answer);
      for (const a of q.attempts || []) a.answer = c(a.answer);
    }
  });
  step("questions", () => {
    while ((p.questions || []).length > 1 && byteLen(JSON.stringify(p)) > cap) p.questions.pop();
  });
  p.truncated = true;
  p.truncatedFields = dropped;
  return p;
}
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
    const rec = { key, json: JSON.stringify(capPayload(payload)) };
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
function buildResultDetails({ lessonId, screenMeta, answers, earned, achievements, lang: langIn, now, arenaBank, firstPass, lastAnswers, startedAt: startedIn, totalScreens: totalIn } = {}) {
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
  const prog = clearedProgress.get(lessonId) || null;
  const fp = firstPass !== void 0 ? firstPass : prog ? prog.firstPass ?? null : void 0;
  const started = Number.isFinite(startedIn) ? startedIn : prog && Number.isFinite(prog.startedAt) ? prog.startedAt : null;
  const totalScreens = Number.isInteger(totalIn) ? totalIn : (screenMeta || []).length || (prog && Number.isInteger(prog.total) ? prog.total : 0);
  const missed = questions.filter((q) => q.kind === "test" && q.correct !== true).map((q) => q.question_id);
  let retake = null;
  if (fp !== void 0) {
    if (fp && typeof fp === "object") {
      const la = lastAnswers || prog && prog.answers || null;
      retake = { pressed: true, lastPass: passStats(screenMeta, la, started, finish) };
    } else retake = { pressed: false };
  }
  const out = { detailsVersion: 2, lang, questions, achievements: list.slice(0, LIM.achievements), missed, totalScreens, finishedAt: iso(finish), truncated: false, retake };
  if (started) out.startedAt = iso(started);
  return out;
}
function passStats(screenMeta, answers, startedAt, finish) {
  const scored = [];
  (screenMeta || []).forEach((m, i) => {
    if (m && m.scored) scored.push(i);
  });
  const total = scored.length;
  const correct = answers && typeof answers === "object" ? scored.filter((i) => answers[i] && answers[i].correct === true).length : null;
  const o = { totalQuestions: total, correctAnswers: correct, scorePercent: correct === null || !total ? null : Math.round(correct / total * 100) };
  if (Number.isFinite(startedAt)) o.durationSec = Math.max(0, Math.floor((finish - startedAt) / 1e3));
  return o;
}
var clearedProgress = /* @__PURE__ */ new Map();
function noteProgressCleared(lessonId, prog) {
  if (!lessonId) return;
  if (prog && typeof prog === "object") clearedProgress.set(lessonId, prog);
}

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
function net(url, init) {
  if (isPreview()) {
    const e = new Error("preview: dars-api yopiq");
    e.code = "preview_offline";
    return Promise.reject(e);
  }
  return fetch(url, init);
}
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
  const r = await net(`${API}/rpc/${fn}`, {
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
  const r = await net(`${API}/session/${encodeURIComponent(pin)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`get: ${r.status}`);
  return r.json();
}
async function liveList(url) {
  const r = await net(url);
  if (!r.ok) throw new Error(`list: ${r.status}`);
  return r.json();
}
var livePlayers = (pin) => liveList(`${API}/players/${encodeURIComponent(pin)}`);
var liveAnswers = (pin, screenIdx) => liveList(`${API}/answers/${encodeURIComponent(pin)}${screenIdx == null ? "" : `?screen=${encodeURIComponent(screenIdx)}`}`);
var liveQuizAnswers = (pin) => liveList(`${API}/answers/${encodeURIComponent(pin)}?range=arena`);
async function lmsFetch(method, url, liveToken, body) {
  const r = await net(url, {
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
  const r = await net(`${LIVE_API_URL}/api/v1/me/progress`, {
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
    noteProgressCleared(id, JSON.parse(localStorage.getItem(_progKey(id)) || "null"));
  } catch {
  }
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

// src/live/progressSync.js
var DEBOUNCE_MS = 2e3;
var channels = /* @__PURE__ */ new Map();
function setProgressChannel(lessonId, ch) {
  const prev = channels.get(lessonId);
  if (prev) {
    clearTimeout(prev.timer);
    flush(lessonId, { keepalive: true });
  }
  if (!ch || isPreview()) {
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
  const previewRef = useRef(null);
  if (previewRef.current === null) previewRef.current = notePreviewProps(opts);
  const preview = previewRef.current;
  const liveToken = preview ? null : opts.liveToken || null;
  const lessonVersion = opts.lessonVersion || null;
  const keyRef = useRef(answerKey);
  keyRef.current = answerKey;
  useEffect(() => {
    unsealPayload(lessonId);
  }, [lessonId]);
  const initRef = useRef(void 0);
  if (initRef.current === void 0) initRef.current = LIVE_ENABLED && !preview ? liveRead(lessonId) : null;
  const init = initRef.current;
  const [mode, setMode] = useState(() => {
    if (!LIVE_ENABLED || preview) return "self";
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
    let on2 = true, timer = null, delay = LIVE_POLL_MS;
    const schedule = () => {
      if (on2) timer = setTimeout(tick, delay);
    };
    const tick = async () => {
      if (typeof document !== "undefined" && document.hidden) {
        schedule();
        return;
      }
      try {
        const row = await liveGet(pin);
        if (!on2) return;
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
        if (!on2) return;
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
      on2 = false;
      clearTimeout(timer);
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode, pin, lessonId]);
  useEffect(() => {
    if (mode !== "mentor" || !pin) return;
    let on2 = true;
    liveGet(pin).then((row) => {
      if (!on2) return;
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
      on2 = false;
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
    let on2 = true, inFlight = false;
    const recheck = async () => {
      if (!on2 || inFlight || typeof document !== "undefined" && document.hidden) return;
      inFlight = true;
      try {
        const body = { lesson_id: lessonId };
        if (lessonVersion) body.lesson_version = lessonVersion;
        const res = await lmsJoin(tok, body);
        if (!on2 || !res || res.mode !== "student") return;
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
      on2 = false;
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
    liveJoinedNote,
    preview
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

// src/live/useAutoNext.js
import { useEffect as useEffect3, useRef as useRef3, useState as useState2 } from "react";
var AUTO_NEXT_MS = 6e3;
function useAutoNext({ on: on2, onFire, qKey }) {
  const [sec, setSec] = useState2(null);
  const [auto, setAuto] = useState2(true);
  const firedRef = useRef3(false);
  const fireRef = useRef3(onFire);
  fireRef.current = onFire;
  useEffect3(() => {
    firedRef.current = false;
  }, [qKey]);
  useEffect3(() => {
    if (!on2 || !auto) {
      setSec(null);
      return void 0;
    }
    const deadline = Date.now() + AUTO_NEXT_MS;
    setSec(Math.ceil(AUTO_NEXT_MS / 1e3));
    const iv = setInterval(() => {
      const rem = deadline - Date.now();
      if (rem > 0) {
        setSec(Math.ceil(rem / 1e3));
        return;
      }
      clearInterval(iv);
      setSec(null);
      if (!firedRef.current) {
        firedRef.current = true;
        fireRef.current();
      }
    }, 200);
    return () => clearInterval(iv);
  }, [on2, auto, qKey]);
  const fireNow = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setSec(null);
    fireRef.current();
  };
  const shown = on2 && auto ? sec ?? Math.ceil(AUTO_NEXT_MS / 1e3) : null;
  return {
    sec: shown,
    auto,
    fireNow,
    pause: () => setAuto(false),
    resume: () => setAuto(true)
  };
}

// src/live/LiveUI.jsx
import React2, { useState as useState3, useEffect as useEffect4 } from "react";
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
  const [code, setCode] = useState3("");
  const [nick, setNick] = useState3(() => nickRead());
  const [mentorCode, setMentorCode] = useState3("");
  const [role, setRole] = useState3("student");
  const card = { position: "relative", width: "100%", maxWidth: 420, background: LT.paper, borderRadius: 20, padding: "clamp(24px,4vw,36px)", boxShadow: "0 10px 40px -12px rgba(58,53,48,0.22)", display: "flex", flexDirection: "column", gap: 18 };
  const wrap = { minHeight: "calc(100dvh / var(--lz, 1))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 };
  const link = { background: "none", border: "none", color: LT.ink3, fontSize: 13, cursor: "pointer", alignSelf: "center" };
  const lms = live.lms || { state: "idle" };
  const [pinFallback, setPinFallback] = useState3(false);
  if (live.preview) return null;
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
  const [bigOpen, setBigOpen] = useState3(false);
  const [nPlayers, setNPlayers] = useState3(null);
  useEffect4(() => {
    if (live.mode !== "mentor" || !live.pin || live.ended) return;
    let on2 = true, t = null;
    const tick = async () => {
      try {
        const rows = await livePlayers(live.pin);
        if (on2) setNPlayers(rows.length);
      } catch {
      }
      if (on2) t = setTimeout(tick, 6e3);
    };
    tick();
    return () => {
      on2 = false;
      clearTimeout(t);
    };
  }, [live.mode, live.pin, live.ended]);
  if (live.preview) return <div data-tour="live" data-live="badge-preview" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "Oldindan ko'rish", ru: "Предпросмотр" })}</div>;
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
var _toastEl = null;
var _toastT = null;
function liveToast(node, ms = 6e3) {
  if (typeof document === "undefined") return;
  const text = tr(node);
  if (!_toastEl) {
    _toastEl = document.createElement("div");
    _toastEl.setAttribute("role", "status");
    _toastEl.setAttribute("data-live", "toast");
    Object.assign(_toastEl.style, { position: "fixed", left: "50%", bottom: "28px", transform: "translateX(-50%)", zIndex: "12000", background: LT.ink, color: "#fff", borderRadius: "14px", padding: "12px 18px", fontFamily: "'Manrope', system-ui, sans-serif", fontSize: "15px", fontWeight: "600", lineHeight: "1.4", textAlign: "center", maxWidth: "min(92vw, 560px)", boxShadow: "0 10px 30px -8px rgba(0,0,0,0.45)", opacity: "0", transition: "opacity .25s", pointerEvents: "none" });
    document.body.appendChild(_toastEl);
  }
  _toastEl.textContent = typeof text === "string" ? text : String(text);
  _toastEl.style.opacity = "1";
  clearTimeout(_toastT);
  _toastT = setTimeout(() => {
    if (_toastEl) _toastEl.style.opacity = "0";
  }, ms);
}
function FinishBtn({ onClick, children, disabled, ...rest }) {
  const [done, setDone] = useState3(false);
  const click = (e) => {
    if (done) return;
    try {
      if (typeof onClick === "function") onClick(e);
    } catch (err) {
      console.error("[finish]", err);
      return;
    }
    setDone(true);
    liveToast(isPreview() ? { uz: "Ko'rish rejimi — natija yozilmaydi.", ru: "Режим просмотра — результат не записывается." } : { uz: "Dars yakunlandi ✓ Endi bu oynani yopsangiz bo'ladi.", ru: "Урок завершён ✓ Теперь это окно можно закрыть." });
  };
  return <button {...rest} data-live={done ? "finish-done" : "finish"} disabled={disabled || done} onClick={click}>{done ? tr({ uz: "Yakunlandi ✓", ru: "Завершено ✓" }) : children}</button>;
}

// src/qolip/index.jsx
import React3, { useState as useState4, useEffect as useEffect5, useRef as useRef4, useMemo } from "react";

// src/qolip/tokens.js
var NEYTRAL = {
  tex: { bg: "#F6F4EF", paper: "#FFFFFF", line: "#E9E6DF", ink2: "#5A5A60", ink: "#0E0E10" },
  pm: { bg: "#F2F0FA", paper: "#FFFFFF", line: "#E7E3F4", ink2: "#565073", ink: "#1B1630" }
};
var MODUL_RANGI = {
  tex: { accent: "#FF4F28", accentSoft: "#FFE8E1" },
  pm: { accent: "#5B3DE6", accentSoft: "#EBE5FD" }
};
var HOLAT = { ok: "#1F7A4D", okFon: "#E3F0E8", err: "#C2362B", errFon: "#FAE3E0" };
var fon = (hex, a = 0.12) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}, ${a})`;
};
var qolipRang = (modul = "tex") => ({
  ...NEYTRAL[modul] || NEYTRAL.tex,
  ...MODUL_RANGI[modul] || MODUL_RANGI.tex,
  ...HOLAT
});

// src/qolip/qolipCss.js
var qolipCss = (Q) => `
  /* --- Ekran: tepadan boshlanadi, bloklar orasida bir xil oraliq (174) --- */
  .q-ekran { display: flex; flex-direction: column; gap: clamp(12px,1.8vw,16px); min-width: 0; }
  .q-split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(14px,2.4vw,24px); align-items: start; min-width: 0; } /* F-1015-141 (Z2): ustunlar tepadan, mazmun balandligida — karta bo'sh cho'zilmaydi */
  .q-split.q-keng-ong { grid-template-columns: minmax(0,0.85fr) minmax(0,1.15fr); }
  .q-col { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
  .q-col > .q-karta:last-child, .q-col > .q-vizual-karta:last-child { flex-grow: 1; }
  @media (max-width: 860px) {
    .q-split, .q-split.q-keng-ong { grid-template-columns: minmax(0,1fr); }
    .q-split.q-vizual-avval > .q-col:last-child { order: -1; } /* telefonda vizual tepada — bosish va o'zgarish bir ko'rishda */
  }

  /* --- Karta: oq + 1px chiziq. Soya va ichki ramka yo'q (QA: minimalist) --- */
  .q-karta { background: ${Q.paper}; border: 1px solid ${Q.line}; border-radius: 14px; padding: clamp(12px,1.8vw,16px); display: flex; flex-direction: column; gap: 10px; min-width: 0; }
  .q-yorliq { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${Q.ink2}; }

  /* --- D2: tugma ikki darajada. Asosiy — to'la rang, ekranda bitta; ikkinchi darajali — chegarali. O'ng chetda (187) --- */
  .q-btn { align-self: flex-end; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13.5px,1.5vw,14.5px); line-height: 1.2; cursor: pointer; border: 1.5px solid ${Q.accent}; border-radius: 11px; padding: 10px 18px; background: ${Q.accent}; color: #fff; transition: filter 0.15s, opacity 0.15s; }
  .q-btn:hover:not(:disabled) { filter: brightness(1.06); }
  .q-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .q-btn.q-2 { background: ${Q.paper}; color: ${Q.ink}; border-color: ${Q.line}; }
  .q-btn.q-2:hover:not(:disabled) { border-color: ${Q.accent}; color: ${Q.accent}; filter: none; }
  .q-btn.q-2:disabled { opacity: 1; border-color: transparent; background: none; color: ${Q.ink2}; font-weight: 600; font-size: 13px; padding: 6px 4px; } /* bajarilgan ikkinchi daraja — oddiy izoh-matn («✓ Ochildi») */
  .q-btn:focus-visible, .q-chip:focus-visible { outline: 2px solid ${Q.accent}; outline-offset: 2px; }

  /* --- Kirish standarti (DE-201): radio-variant — texnik darslardagi hook-option bilan bir xil --- */
  .q-variantlar-kol { gap: 9px; }
  .q-variant { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${Q.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${Q.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${Q.shadowBase || "58, 53, 48"},0.12); }
  .q-variant:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${Q.shadowBase || "58, 53, 48"},0.18); }
  .q-variant.on { background: ${Q.accentSoft}; color: ${Q.accent}; box-shadow: 0 8px 22px -6px ${fon(Q.accent, 0.3)}, inset 0 0 0 1.5px ${Q.accent}; }
  .q-variant:disabled { cursor: default; }
  .q-radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${Q.ink2}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
  .q-variant.on .q-radio { box-shadow: inset 0 0 0 2px ${Q.accent}; }
  .q-radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${Q.accent}; }
  /* --- Reja standarti (DE-201): «01 · matn · teg» qadam-kartalari --- */
  .q-reja-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .q-reja-k { display: flex; align-items: center; gap: 14px; background: ${Q.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${Q.shadowBase || "58, 53, 48"},0.12); }
  .q-reja-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: ${Q.accent}; flex-shrink: 0; }
  .q-reja-b { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .q-reja-t { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(14px,1.6vw,15.5px); color: ${Q.ink}; }
  .q-reja-teg { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${Q.ink2}; background: ${Q.bg}; padding: 3px 8px; border-radius: 6px; }
  /* --- DE-199: ish tugadi — natija butun enga chiqadi va bir lahza kattalashib e'tiborni tortadi --- */
  .q-fokus { animation: q-fokus 0.62s cubic-bezier(.2,.9,.3,1.15) both; }
  .q-fokus > * { border-radius: 14px; }
  @keyframes q-fokus { 0% { opacity: 0.4; transform: scale(0.96); } 60% { opacity: 1; transform: scale(1.012); } 100% { transform: scale(1); } }
  /* --- Tanlov-chip: holat rangi faqat holatda --- */
  .q-chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.45vw,14px); line-height: 1.35; text-align: left; color: ${Q.ink}; background: ${Q.paper}; border: 1.5px solid ${Q.line}; border-radius: 11px; padding: 9px 13px; cursor: pointer; min-width: 0; overflow-wrap: anywhere; transition: border-color 0.15s, background 0.15s; }
  .q-chip:hover:not(:disabled) { border-color: ${Q.accent}; }
  .q-chip:disabled { cursor: default; }
  .q-chip.on { border-color: ${Q.accent}; background: ${Q.accentSoft}; }
  .q-chip.ok { border-color: ${Q.ok}; background: ${Q.okFon}; color: ${Q.ok}; }
  .q-chip.err { border-color: ${Q.err}; background: ${Q.errFon}; color: ${Q.err}; }
  .q-chip.q-silk { animation: q-silk 0.32s ease-in-out; }
  @keyframes q-silk { 0%, 100% { transform: none; } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
  .q-variantlar { display: flex; flex-wrap: wrap; gap: 8px; }

  /* --- Bashorat (181): ballsiz, bitta savol, tanlov saqlanadi --- */
  .q-bashorat { display: flex; flex-direction: column; gap: 9px; }
  .q-bashorat-s { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.6vw,15.5px); color: ${Q.ink}; line-height: 1.4; }
  p.q-taxmin, .q-taxmin { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; color: ${Q.ink2}; }
  .q-taxmin b { color: ${Q.ink}; }
  .q-taxmin.ok b { color: ${Q.ok}; }

  /* --- Qadamlar (163.8): o'tgani belgili, joriysi aksent --- */
  .q-qadamlar { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
  .q-qadamlar li { display: flex; align-items: center; gap: 9px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; color: ${Q.ink2}; line-height: 1.35; min-width: 0; }
  .q-qadamlar li i { font-style: normal; flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; border: 1.5px solid ${Q.line}; color: ${Q.ink2}; background: ${Q.paper}; }
  .q-qadamlar li.done { color: ${Q.ink}; }
  .q-qadamlar li.done i { background: ${Q.ok}; border-color: ${Q.ok}; color: #fff; }
  .q-qadamlar li.cur { color: ${Q.ink}; font-weight: 800; }
  .q-qadamlar li.cur i { border-color: ${Q.accent}; color: ${Q.accent}; }

  /* --- Xulosa (162): bitta, 110 belgigacha. Xato qatori: 60 belgigacha. «p.» — dars p-reset qoidasidan kuchliroq bo'lsin --- */
  p.q-xulosa, .q-xulosa { margin: 0; background: ${Q.okFon}; color: ${Q.ink}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.6vw,15.5px); line-height: 1.5; animation: q-kir 0.3s ease-out; } /* 202: texnik darslardagi .frame-success bilan AYNAN bir yashil */
  p.q-xato, .q-xato { margin: 0; color: ${Q.err}; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; line-height: 1.4; animation: q-kir 0.25s ease-out; }
  p.q-izoh, .q-izoh { margin: 0; color: ${Q.ink2}; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; line-height: 1.45; }
  @keyframes q-kir { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

  /* --- Bosiladigan joy halqasi (168) --- */
  .q-halqa { position: relative; }
  .q-halqa::after { content: ''; position: absolute; inset: -4px; border-radius: inherit; border: 2px solid ${Q.accent}; opacity: 0; animation: q-halqa 1.6s ease-out infinite; pointer-events: none; }
  @keyframes q-halqa { 0% { opacity: 0.7; transform: scale(0.97); } 100% { opacity: 0; transform: scale(1.06); } }

  /* --- Test (DE-203): texnik darslar standarti — oq variant, A–D harfi; to'g'ri — yashil (202), tanlangan xato — modul rangi, qolgani xira --- */
  .q-test { gap: clamp(16px,2.5vw,24px); }
  .q-test-ogoh { margin: -8px 0 0; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; color: ${Q.accent}; }
  .q-test-ro { display: flex; flex-direction: column; gap: 11px; }
  .q-test-ro.ixcham { gap: 8px; }
  .q-test-v { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; background: ${Q.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(15px,1.85vw,17px); line-height: 1.45; color: ${Q.ink}; cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 16px -6px rgba(${Q.shadowBase || "58, 53, 48"},0.14); }
  .q-test-ro.ixcham .q-test-v { padding: clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px); }
  .q-test-v:hover:not(:disabled) { box-shadow: 0 10px 22px -6px rgba(${Q.shadowBase || "58, 53, 48"},0.22); }
  .q-test-v:disabled { cursor: default; }
  .q-test-harf { min-width: 20px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${Q.ink2}; }
  .q-test-t { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .q-test-v.ok { background: ${Q.okFon}; color: ${Q.ok}; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32); }
  .q-test-v.ok .q-test-harf { color: ${Q.ok}; font-weight: 800; }
  .q-test-v.xira { color: ${Q.ink2}; opacity: 0.55; box-shadow: 0 4px 12px -6px rgba(${Q.shadowBase || "58, 53, 48"},0.08); }
  .q-test-v.xato { background: ${Q.accentSoft}; color: ${Q.accent}; opacity: 1; box-shadow: 0 8px 22px -6px ${fon(Q.accent, 0.38)}; }
  .q-test-v.kutish { background: ${Q.accentSoft}; color: ${Q.accent}; box-shadow: inset 0 0 0 2px ${Q.accent}, 0 8px 22px -8px ${fon(Q.accent, 0.3)}; animation: q-kutish 2s ease-in-out infinite; }
  @keyframes q-kutish { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.012); } }
  .q-test-javob { border-radius: 12px; padding: clamp(14px,2.5vw,20px); animation: q-kir 0.35s ease-out; }
  .q-test-javob.ok { background: ${Q.okFon}; box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
  .q-test-javob.qayta, .q-test-javob.kutish { background: ${Q.accentSoft}; box-shadow: 0 6px 16px -6px ${fon(Q.accent, 0.22)}; }
  p.q-test-js { margin: 0 0 6px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: ${Q.accent}; }
  .q-test-javob.ok p.q-test-js { color: ${Q.ok}; }
  .q-test-jm { font-family: 'Manrope', sans-serif; font-size: clamp(14px,1.6vw,15.5px); line-height: 1.55; color: ${Q.ink}; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
  .q-test-jm p { margin: 0; }
  /* --- Tartib-mashqi (188): uyalar chapda, bo'laklar o'ngda; to'g'ri — yashil to'lqin, xato — silkinish --- */
  .q-dd { display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,1fr); gap: 13px; align-items: start; }
  .q-dd > .q-xulosa, .q-dd > .q-xato { grid-column: 1 / -1; }
  @media (max-width: 760px) { .q-dd { grid-template-columns: minmax(0,1fr); } }
  .q-dd-slots { display: flex; flex-direction: column; gap: 9px; }
  .q-dd-slot { display: flex; align-items: center; gap: 12px; min-height: 58px; border-radius: 14px; border: 2px dashed ${fon(Q.ink2, 0.4)}; background: ${Q.paper}; padding: 8px 12px; transition: border-color .18s, background .18s; }
  .q-dd-slot.filled { border-style: solid; border-color: ${Q.line}; }
  .q-dd-slot.ok { border-color: ${Q.ok}; background: ${Q.okFon}; animation: q-dd-ok 0.42s cubic-bezier(.3,1.5,.5,1); }
  .q-dd-slot.ok:nth-child(2) { animation-delay: 0.07s; } .q-dd-slot.ok:nth-child(3) { animation-delay: 0.14s; } .q-dd-slot.ok:nth-child(4) { animation-delay: 0.21s; } .q-dd-slot.ok:nth-child(5) { animation-delay: 0.28s; }
  @keyframes q-dd-ok { 0%, 100% { transform: scale(1); } 45% { transform: scale(1.025); } }
  .q-dd-slot.bad { border-color: ${Q.err}; background: ${Q.errFon}; animation: q-silk .4s; }
  .q-dd-n { width: 26px; height: 26px; border-radius: 8px; background: ${Q.bg}; color: ${Q.ink2}; font-family: 'Manrope'; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: inset 0 0 0 1.5px ${Q.line}; }
  .q-dd-slot.ok .q-dd-n { background: ${Q.ok}; color: #fff; box-shadow: none; }
  .q-dd-slot.bad .q-dd-n { background: ${Q.err}; color: #fff; box-shadow: none; }
  .q-dd-hint { flex: 1; min-width: 0; color: ${Q.ink2}; font-family: 'Manrope'; font-style: italic; font-size: 13px; line-height: 1.35; }
  .q-dd-slot .q-dd-chip { min-width: 168px; text-align: left; }
  .q-dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${Q.bg}; position: relative; z-index: 1; }
  .q-dd-chip { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: ${Q.accent}; border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; user-select: none; box-shadow: 0 8px 16px -8px ${fon(Q.accent, 0.6)}, inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; }
  .q-dd-chip:hover { transform: translateY(-2px); }
  .q-dd-chip:active { cursor: grabbing; }
  .q-dd-chip.in { animation: q-dd-snap 0.32s cubic-bezier(.3,1.6,.5,1); }
  @keyframes q-dd-snap { 0% { transform: scale(1.14) rotate(-2deg); } 55% { transform: scale(0.97) rotate(0.5deg); } 100% { transform: scale(1) rotate(0); } }
  /* --- Kod ekrani (190/F-1004-35): chap vazifa, o'ng muharrir, bir balandlikda --- */
  .q-kod > .q-col > .q-karta, .q-kod > .q-col > .q-muharrir { flex-grow: 1; }
  .q-kod .q-karta > .q-btn { margin-top: auto; }

  /* --- Mustaqil ish: bitta ustun --- */
  .q-mustaqil { max-width: 640px; width: 100%; }
  /* --- Amaliyot bloki (172/173, QBlok): qadamlar bittadan, bajarilgani bir qatorga yig'iladi; o'ngda kutilgan natija --- */
  .q-blok-qadamlar { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  .q-blok-q { display: flex; align-items: center; gap: 11px; background: ${Q.paper}; border: 1px solid ${Q.line}; border-radius: 12px; padding: 10px 13px; min-width: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); color: ${Q.ink}; }
  .q-blok-q.joriy { align-items: flex-start; border-color: ${Q.ink2}; }
  .q-blok-q.bajarildi { background: ${Q.okFon}; border-color: ${fon(Q.ok, 0.35)}; padding-block: 8px; }
  .q-blok-n { width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; background: ${Q.bg}; color: ${Q.ink2}; border: 1.5px solid ${Q.line}; }
  .q-blok-q.bajarildi .q-blok-n { background: ${Q.ok}; border-color: ${Q.ok}; color: #fff; }
  .q-blok-h { flex: 1; min-width: 0; font-weight: 700; color: ${Q.ok}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .q-blok-qaytar { flex-shrink: 0; border: none; background: transparent; color: ${Q.ok}; font-size: 16px; font-weight: 700; cursor: pointer; padding: 2px 6px; border-radius: 8px; }
  .q-blok-qaytar:hover { background: ${Q.paper}; }
  .q-blok-tana { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px; }
  p.q-blok-t { margin: 0; line-height: 1.5; overflow-wrap: break-word; }
  p.q-blok-xato { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${Q.ink2}; }
  .q-blok-tugadi { background: ${Q.okFon}; border-radius: 12px; padding: clamp(12px,2vw,16px); }
  .q-blok-tugadi p { margin: 0; color: ${Q.ink}; line-height: 1.5; }
  .q-blok-natija { display: flex; flex-direction: column; min-width: 0; }
  .q-blok-ong > .q-blok-izoh { display: flex; align-items: center; min-height: 30px; } /* F-1015-166: natija ostidagi izoh (F-1015-176: joy topolmagan ⛶ ko'rsatilmaydi) */
  .q-blok-ong > .zoomable.zb-qator:not(.zoom-on) { padding-top: 0 !important; }
  /* F-1015-176: amaliyot natijasidagi telefon/oyna maketining o'z yorlig'i maket OSTIGA (qadamlar kartasi bilan bir chiziqdan boshlansin) */
  .q-blok-natija [class*="-tel-ust"] > [class*="-tel-yorliq"], .q-blok-natija [class*="-tel-ust"] > [class*="-tel-tex"], .q-blok-natija [class*="-tel-ust"] > [class*="-rol"],
  .q-blok-natija [class*="-telj"] > [class*="-tel-yorliq"], .q-blok-natija [class*="-tel-w"] > [class*="-tel-y"] { order: 9; margin-top: 6px; }
  .q-blok-ortda { display: flex; flex-direction: column; gap: 4px; font-size: 12px; line-height: 1.5; color: ${Q.ink2}; min-width: 0; }
  .q-blok-buyruq { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${Q.ink}; background: ${Q.bg}; border: 1px solid ${Q.line}; border-radius: 6px; padding: 3px 7px; display: block; white-space: nowrap; overflow-x: auto; } /* buyruq bo'linmaydi (--tags), tor ekranda ichida suriladi */
  .q-prompt { width: 100%; background: ${Q.bg}; border: 1px solid ${Q.line}; border-radius: 11px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; }
  .q-prompt-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px; }
  .q-prompt-kim { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 10.5px; letter-spacing: 0.06em; color: ${Q.ink2}; }
  .q-prompt-nusxa { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; padding: 5px 11px; border-radius: 8px; border: 1px solid ${Q.line}; background: ${Q.paper}; color: ${Q.accent}; cursor: pointer; margin-left: auto; }
  .q-prompt-nusxa:hover { background: ${Q.accentSoft}; }
  p.q-prompt-satr { margin: 0; font-size: clamp(12.5px,1.5vw,13.5px); line-height: 1.55; color: ${Q.ink}; font-weight: 500; overflow-wrap: break-word; }
  .q-joy { background: ${Q.accentSoft}; color: ${Q.accent}; border-radius: 6px; padding: 1px 6px; font-weight: 700; }

  /* --- Voqea: karta mazmun balandligida (F-1004-44) --- */
  .q-voqea { align-items: center; text-align: center; }

  /* --- 8. Kartochkalar (DE-204): texnik darslar standarti aynan — pilotdan ko'chirildi, darsda nusxa yo'q (q21) --- */
  .fc-center { flex: 1; min-height: 0; display: flex; align-items: flex-start; justify-content: center; padding-top: 4px; } /* 174: kontent tepadan (texnik darslarda o'rtada edi — 6-Modul savolsiz tuzatish) */
  .fc { display: flex; flex-direction: column; gap: 11px; max-width: 520px; width: 100%; }
  .fc-top { display: flex; justify-content: space-between; align-items: center; }
  .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
  .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
  .fc-pill.learn { background: ${Q.accentSoft}; color: ${Q.accent}; border: 1.5px solid ${Q.accent}44; }
  .fc-pill.knew { background: ${Q.okFon}; color: ${Q.ok}; border: 1.5px solid ${Q.ok}44; }
  @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
  .fc-bar { height: 7px; background: ${Q.line}; border-radius: 99px; overflow: hidden; }
  .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #FF8A3D, ${Q.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
  .fc-cardwrap { perspective: 1200px; position: relative; }
  .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${Q.paper}; border: 2px solid ${Q.line}; z-index: -1; }
  .fc-cardwrap::before { transform: translateY(7px) scale(0.965); opacity: 0.7; }
  .fc-cardwrap::after { transform: translateY(15px) scale(0.93); opacity: 0.4; }
  .fc-fly { position: relative; animation: fc-in 0.3s ease; }
  @keyframes fc-in { from { opacity: 0; transform: translateY(10px) scale(0.97); } }
  .fc-fly.out-knew { animation: fc-out-knew 0.42s ease forwards; }
  .fc-fly.out-again { animation: fc-out-again 0.42s ease forwards; }
  @keyframes fc-out-knew { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(70%) rotate(5deg); opacity: 0; } }
  @keyframes fc-out-again { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(-70%) rotate(-5deg); opacity: 0; } }
  .fc-fly.out-knew::after, .fc-fly.out-again::after { position: absolute; top: 50%; left: 50%; z-index: 6; width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; color: #fff; pointer-events: none; animation: fc-stamp 0.3s cubic-bezier(.34,1.6,.4,1); transform: translate(-50%, -50%); }
  .fc-fly.out-knew::after { content: '✓'; background: ${Q.ok}; box-shadow: 0 10px 26px -8px ${Q.ok}; }
  .fc-fly.out-again::after { content: '✗'; background: ${Q.accent}; box-shadow: 0 10px 26px -8px ${Q.accent}; }
  @keyframes fc-stamp { from { transform: translate(-50%, -50%) scale(0); } }
  .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
  .fc-card.flip { transform: rotateY(180deg); }
  .fc-card:not(.flip):hover { transform: translateY(-3px); }
  .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
  .fc-front { background: ${Q.paper}; border: 2px solid ${Q.line}; box-shadow: 0 14px 34px -18px rgba(${Q.shadowBase || "58, 53, 48"},0.4); }
  .fc-back { background: linear-gradient(160deg, #FF8A3D, ${Q.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(255,79,40,0.6); }
  .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${Q.ink}; line-height: 1.3; text-wrap: balance; }
  .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${Q.ink2}; }
  .fc-tap { color: ${Q.accent}; font-weight: 700; }
  /* F-0803-13/14: javob uzunlikka moslashadi — 4 pog'ona + kod/gap shrift ajrimi */
  .fc-tag { font-weight: 800; letter-spacing: -0.02em; line-height: 1.16; max-width: 100%; text-wrap: balance; overflow-wrap: anywhere; }
  .fc-tag.mono-all { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }
  .fc-tag.prose { font-family: 'Manrope', sans-serif; letter-spacing: -0.005em; }
  .fc-tag .fc-kw { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; }
  .fc-tag.t1 { font-size: clamp(30px,6vw,46px); }
  .fc-tag.t2 { font-size: clamp(24px,4.4vw,34px); }
  .fc-tag.t3 { font-size: clamp(20px,3.4vw,26px); }
  .fc-tag.t4 { font-size: clamp(17px,2.6vw,22px); line-height: 1.3; }
  .fc-note { font-family: 'Manrope'; font-size: 14px; opacity: 0.92; }
  .fc-actions { display: flex; gap: 10px; min-height: 48px; }
  .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
  .fc-btn:hover { transform: translateY(-2px); }
  .fc-btn.knew { background: ${Q.ok}; color: #fff; box-shadow: 0 10px 22px -10px ${Q.ok}; }
  .fc-btn.again { background: ${Q.paper}; border: 2px solid ${Q.accent}66; color: ${Q.accent}; }
  .fc-btn.again:hover { border-color: ${Q.accent}; background: ${Q.accentSoft}; }
  .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
  .fc-btn.ghost { background: ${Q.paper}; border: 1.5px solid ${Q.line}; color: ${Q.ink}; flex: none; align-self: center; padding: 11px 22px; }
  .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${Q.ink2}; font-style: italic; font-size: 13px; }
  .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${Q.okFon}; border-radius: 18px; padding: 22px; max-width: 480px; }
  .fc-done-emoji { font-size: 40px; }
  .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${Q.ok}; margin: 0; }
  .fc-done-s { font-family: 'Manrope'; color: ${Q.ink2}; margin: 0 0 8px; font-size: 14px; }

  /* --- 9. Yakun (DE-204, 192, 202): chiplar · «Endi siz bilasiz» · «Uyga vazifa» banneri · nishonlar — texnik darslar standarti aynan --- */
  .q-yakun .card { background: ${Q.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${Q.shadowBase || "58, 53, 48"},0.14); }
  .q-yakun .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
  .q-yakun .card-lbl.ok { color: ${Q.ok}; } .q-yakun .card-lbl.acc { color: ${Q.accent}; }
  .q-yakun .card-lbl .tick { width: 16px; height: 16px; border-radius: 50%; background: ${Q.ok}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; }
  .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
  .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${Q.ok}; background: ${Q.okFon}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${Q.ok}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
  .hero-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; } .score-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; font-variant-numeric: tabular-nums; color: ${Q.accent}; background: ${Q.accentSoft}; padding: 5px 12px; border-radius: 999px; } .score-chip.neytral { color: ${Q.ink2}; background: ${Q.paper}; box-shadow: inset 0 0 0 1px ${Q.line}; } .score-chip.toliq { color: ${Q.ok}; background: ${Q.okFon}; box-shadow: none; } /* F-1015-146: ball belgisi — neytral, hammasi to'g'ri bo'lsa yashil */ /* F-1003-04/05: yakunda halqa o'rniga yorliq */
  .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${Q.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${Q.ok}; font-weight: 700; flex-shrink: 0; background: none; padding: 0; }
  /* F-0803-08 — UYGA VAZIFA KAPSULASI (PmLesson2 etaloni): yakun sahifasida
  «Endi siz bilasiz» dan KEYIN turadi, bosilganda topshiriq kartasi ochiladi. */
  .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); } /* 192 (F-1004-57): platforma standarti — o'rtada, 560px gacha */
  .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
  @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
  .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
  .hw-big:hover { transform: translateY(-3px) scale(1.02); }
  .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; color: rgba(255,255,255,0.16); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
  @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
  .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
  @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.03); } 100% { filter: brightness(1); } }
  .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; }
  .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
  .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent); transform: rotate(8deg); animation: hw-shine 4.6s ease-in-out infinite; pointer-events: none; }
  @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(120,60,220,.6), 0 0 40px rgba(124,58,237,.72), 0 0 96px rgba(124,58,237,.4), inset 0 0 60px rgba(124,58,237,.44); } }
  @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
  @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none !important; } }
  .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${Q.ink}; } .hw li b { color: ${Q.accent}; } .hw .t { color: ${Q.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${Q.accent}; font-weight: 600; }
  .ach-coll { display: flex; flex-direction: column; gap: 10px; }
  .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
  .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
  .ach-badge.got { background: linear-gradient(160deg, ${Q.accentSoft}, #FFF3EC); border: 1.5px solid ${Q.accent}55; }
  .ach-badge.got:hover { transform: translateY(-3px); }
  .ach-badge.locked { background: ${Q.bg}; border: 1.5px dashed ${Q.line}; opacity: 0.75; }
  .ach-badge-ic { font-size: 30px; line-height: 1; }
  .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
  .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${Q.ink}; }
  .ach-badge.locked .ach-badge-name { color: ${Q.ink2}; }
  .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${Q.ink2}; line-height: 1.3; }
  @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }

  @media (prefers-reduced-motion: reduce) {
    .q-halqa::after, .q-chip.q-silk, .q-xulosa, .q-xato, .q-fokus, .q-test-v.kutish, .q-test-javob, .q-dd-slot.ok, .q-dd-slot.bad, .q-dd-chip.in { animation: none; }
  }
`;

// src/qolip/index.jsx
var cx = (...a) => a.filter(Boolean).join(" ");
var useTugadi = (done, kechikish = 900, darhol = false) => {
  const [t, setT] = useState4(!!(done && darhol));
  useEffect5(() => {
    if (!done) {
      setT(false);
      return;
    }
    const id = setTimeout(() => setT(true), kechikish);
    return () => clearTimeout(id);
  }, [done, kechikish]);
  return t;
};
var QTugma = ({ ikkinchi = false, className, children, ...p }) => <button type="button" className={cx("q-btn", ikkinchi && "q-2", className)} {...p}>{children}</button>;
var QChip = ({ holat, silk, className, children, ...p }) => <button type="button" className={cx("q-chip", holat, silk && "q-silk", className)} {...p}>{children}</button>;
var QXulosa = ({ children }) => <p className="q-xulosa">{children}</p>;
var QXato = ({ children }) => <p className="q-xato" role="status">{children}</p>;
var QIzoh = ({ children }) => <p className="q-izoh">{children}</p>;
var Bosh = ({ sarlavha, mentor }) => <>
    {sarlavha && <div className="head"><h2 className="title h-title fade-up">{sarlavha}</h2></div>}
    {mentor}
  </>;
var Z = ({ zoom: Zm, children }) => Zm ? <Zm>{children}</Zm> : children;
var QKirish = ({ sarlavha, mentor, zoom, maket, savol, variantlar = [], tanlov = null, onTanla, yopiq = false, javob, children }) => <div className="screen q-ekran q-kirish">
    <Bosh sarlavha={sarlavha} mentor={mentor} />
    <Z zoom={zoom}>
      <div className="q-split">
        <div className="q-col">{maket}</div>
        <div className="q-col">
          {savol && <span className="q-yorliq fade-up delay-2">{savol}</span>}
          {
  /* F-1015-164 (160-sinf): maket ochilmaguncha variantlar ko'rinmaydi — bosib bo'lmaydigan xira tugma ko'rsatilmaydi */
}
          {!yopiq && <div className="q-col q-variantlar-kol fade-up">
            {variantlar.map((v) => {
  const on2 = tanlov === v.id;
  return <button key={v.id} type="button" className={cx("q-variant", on2 && "on")} disabled={tanlov !== null} onClick={() => onTanla && onTanla(v.id)}>
                  <span className="q-radio">{on2 && <span className="q-radio-dot" />}</span><span>{v.t}</span>
                </button>;
})}
          </div>}
          {javob}
        </div>
      </div>
    </Z>
    {children}
  </div>;
var QReja = ({ sarlavha, mentor, zoom, chapYorliq, chap, ongYorliq, qadamlar = [], children }) => <div className="screen q-ekran q-reja">
    <Bosh sarlavha={sarlavha} mentor={mentor} />
    {
  /* F-1015-165: Reja ekranida ⛶ yo'q — zoom qabul qilinadi, lekin ishlatilmaydi */
}
    <>
      <div className="q-split">
        <div className="q-col">{chapYorliq && <span className="q-yorliq">{chapYorliq}</span>}{chap}</div>
        <div className="q-col">
          {
  /* F-1015-176: chapda yorliq bo'lsa, o'ngda ham shu balandlikda joy — ikki ustun bir chiziqdan boshlanadi */
}
          {ongYorliq ? <span className="q-yorliq">{ongYorliq}</span> : chapYorliq ? <span className="q-yorliq" aria-hidden="true">{" "}</span> : null}
          <ol className="q-reja-ro">
            {qadamlar.map((q, i) => <li key={i} className="q-reja-k fade-up" style={{ animationDelay: `${0.08 + i * 0.06}s` }}>
                <span className="q-reja-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="q-reja-b"><span className="q-reja-t">{q.t}</span>{q.teg && <span className="q-reja-teg">{q.teg}</span>}</span>
              </li>)}
          </ol>
        </div>
      </div>
    </>
    {children}
  </div>;
var QTushuncha = ({ sarlavha, mentor, zoom, bashorat, harakat, vizual, natija, xulosa, tugadi = false, keng = false, harakatAvval = false, vizualAvval = true, children }) => {
  const V = vizual ? <Z zoom={zoom}>{vizual}</Z> : null;
  return <div className="screen q-ekran q-tushuncha">
      <Bosh sarlavha={sarlavha} mentor={mentor} />
      {bashorat}
      {tugadi ? <div className="q-col q-fokus" key="fokus">{V}</div> : keng ? <div className="q-col">{harakatAvval && harakat}{V}{!harakatAvval && harakat}</div> : <div className={cx("q-split", vizualAvval && "q-vizual-avval")}>
              <div className="q-col">{harakat}</div>
              <div className="q-col">{V}</div>
            </div>}
      {natija}
      {xulosa && <QXulosa>{xulosa}</QXulosa>}
      {children}
    </div>;
};
var QTest = ({ savol, ogoh, variantlar, holat = () => void 0, ixcham = false, yopiq = false, onTanla, javob, children }) => <div className="screen q-ekran q-test">
    <div className="fade-up">{savol}</div>
    {ogoh && <p className="q-test-ogoh fade-up">{ogoh}</p>}
    <div className={cx("q-test-ro fade-up delay-1", ixcham && "ixcham")}>
      {variantlar.map((v, i) => <button key={i} type="button" className={cx("q-test-v", holat(i))} disabled={yopiq} onClick={() => onTanla && onTanla(i)}>
          <span className="q-test-harf">{String.fromCharCode(65 + i)}</span><span className="q-test-t">{v}</span>
        </button>)}
    </div>
    {javob}
    {children}
  </div>;
var QTestJavob = ({ tur = "qayta", sarlavha, children }) => {
  const ref = useRef4(null);
  useEffect5(() => {
    const t = setTimeout(() => {
      if (ref.current && ref.current.scrollIntoView) ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 320);
    return () => clearTimeout(t);
  }, [tur]);
  return <div ref={ref} className={cx("q-test-javob", tur)} role="status">
      {sarlavha && <p className="q-test-js">{sarlavha}</p>}
      <div className="q-test-jm">{children}</div>
    </div>;
};
var QMustaqil = ({ sarlavha, mentor, qadamlar, forma, yordam, children }) => <div className="screen q-ekran">
    <Bosh sarlavha={sarlavha} mentor={mentor} />
    {qadamlar}
    <div className="q-col q-mustaqil">{forma}{yordam}</div>
    {children}
  </div>;
var QM = {
  uz: {
    org: "↻ O'rganilmoqda",
    bildim: "✓ Bildim",
    takror: "✗ Takrorlash",
    hammasi: "Hammasini bilasiz!",
    yodlandi: "atama yodlandi",
    qayta: "↻ Qaytadan takrorlash",
    togri: "to'g'ri",
    testlar: "Testlar",
    bilasiz: "Endi siz bilasiz",
    uyga: "Uyga vazifa",
    uygaS: "Amaliy topshiriqni bajarish →",
    nishon: "Nishonlaringiz",
    bajardim: "Bajardim",
    qaytar: "Qaytarish",
    nusxa: "Nusxalash",
    nusxalandi: "✓ Nusxalandi",
    natija: "kutilgan natija",
    ortda: "Ortda qoldingizmi — mentor bilan:"
  },
  ru: {
    org: "↻ Изучается",
    bildim: "✓ Знаю",
    takror: "✗ Повторить",
    hammasi: "Вы знаете всё!",
    yodlandi: "терминов выучено",
    qayta: "↻ Повторить заново",
    togri: "верно",
    testlar: "Тесты",
    bilasiz: "Теперь вы знаете",
    uyga: "Домашнее задание",
    uygaS: "Выполнить практическое задание →",
    nishon: "Ваши значки",
    bajardim: "Готово",
    qaytar: "Вернуть",
    nusxa: "Скопировать",
    nusxalandi: "✓ Скопировано",
    natija: "ожидаемый результат",
    ortda: "Отстали — вместе с ментором:"
  }
};
var FC_KOD_SOZ = /\b(let|const|var|string|number|boolean|true|false|null|undefined|function|return|for|while|if|else)\b/g;
var FC_LUGAT = /* @__PURE__ */ new Set(["let", "const", "var", "string", "number", "boolean", "true", "false", "null", "undefined", "function", "return", "for", "while", "if", "else"]);
var fcKodmi = (s) => {
  if (FC_LUGAT.has(s.toLowerCase())) return true;
  if (/^[\p{L}'\u02BB\u2019]+(-[\p{L}'\u02BB\u2019]+)+$/u.test(s)) return false;
  return /[=(){};.[\]<>+*/%!&|-]/.test(s);
};
var fcPog = (s) => s.length <= 8 ? "t1" : s.length <= 16 ? "t2" : s.length <= 32 ? "t3" : "t4";
var fcJavob = (raw) => {
  const s = String(raw ?? "");
  const bitta = !/\s/.test(s) && fcKodmi(s);
  const cls = `fc-tag ${fcPog(s)} ${bitta ? "mono-all" : "prose"}`;
  if (bitta) return <span className={cls}>{s}</span>;
  return <span className={cls}>{s.split(FC_KOD_SOZ).map((p, i) => i % 2 === 1 ? <span key={i} className="fc-kw">{p}</span> : p)}</span>;
};
function QKartochka({ cards, til = "uz" }) {
  const M = QM[til] || QM.uz;
  const [queue, setQueue] = useState4(() => cards.map((_, i) => i));
  const [flipped, setFlipped] = useState4(false);
  const [known, setKnown] = useState4(0);
  const [exiting, setExiting] = useState4(null);
  const swapRef = useRef4(0);
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
  const restart = () => {
    setQueue(cards.map((_, i) => i));
    setKnown(0);
    setFlipped(false);
  };
  return <div className="fc-center">
      {!card ? <div className="fc-done fade-up"><p className="fc-done-h">{M.hammasi}</p><p className="fc-done-s">{total}/{total} {M.yodlandi}</p><button className="fc-btn ghost" onClick={restart}>{M.qayta}</button></div> : <div className="fc fade-up">
          <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{M.org} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{M.bildim} · <b>{known}</b></span></div>
          <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${known / total * 100}%` }} /></div>
          <div className="fc-cardwrap">
            <div className={cx("fc-fly", exiting === "knew" && "out-knew", exiting === "again" && "out-again")} key={swapRef.current}>
              <div className={cx("fc-card", flipped && "flip")} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
                <div className="fc-face fc-front"><span className="fc-q">{card.front}</span></div>
                <div className="fc-face fc-back">{fcJavob(card.back)}{card.note && <span className="fc-note">{card.note}</span>}</div>
              </div>
            </div>
          </div>
          {flipped ? <div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={() => advance(false)}>{M.takror}</button><button className="fc-btn knew" disabled={!!exiting} onClick={() => advance(true)}>{M.bildim}</button></div> : <p className="fc-hint" />}
        </div>}
    </div>;
}
function QYakun({ til = "uz", chip, togri, jami, sarlavha, cta, recap = [], uyga, keyingi, hwTokens = [], nishonlar, children }) {
  const M = QM[til] || QM.uz;
  const [hwOpen, setHwOpen] = useState4(false);
  const [hwCharge, setHwCharge] = useState4(false);
  const fireHw = () => {
    if (hwCharge || hwOpen) return;
    setHwCharge(true);
    setTimeout(() => {
      setHwOpen(true);
      setHwCharge(false);
    }, 500);
  };
  const royxat = Array.isArray(uyga);
  return <div className="screen q-yakun">
      <div className="hero"><div className="hero-l"><div className="hero-chips"><span className="done-chip fade-up"><span className="tick">✓</span> {chip}</span><span className={cx("score-chip", "fade-up", jami > 0 && togri === jami ? "toliq" : "neytral")}>{M.testlar}: {togri}/{jami}</span></div><h2 className="title h-title fade-up d1">{sarlavha}</h2></div></div>
      {cta}
      {recap.length > 0 && <div className="card fade-up d3"><div className="card-lbl ok"><span className="tick">✓</span> {M.bilasiz}</div><ul className="recap">{recap.map((r, i) => <li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>)}</ul></div>}
      {uyga && <div className="hw-big-wrap fade-up d4">
        <button className={cx("hw-big", hwCharge && "charging")} onClick={fireHw}>
          <span className="hw-sky" aria-hidden="true">
            {hwTokens.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, "--d": `${k.d}s` }}>{k.t}</span>)}
          </span>
          <span className="hw-big-shine" aria-hidden="true" />
          <span className="hw-big-t">{M.uyga}</span>
          <span className="hw-big-s">{M.uygaS}</span>
        </button>
      </div>}
      {uyga && hwOpen && (royxat ? <div className="card hw fade-up d4"><div className="card-lbl acc">{M.uyga}</div><ul>{uyga.map((h, i) => <li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>)}</ul>{keyingi && <p className="hw-note">{keyingi}</p>}</div> : uyga)}
      {nishonlar && <div className="card ach-coll fade-up d3">
        <div className="card-lbl acc">{M.nishon} — {nishonlar.filter((a) => a.got).length}/{nishonlar.length}</div>
        <div className="ach-grid">
          {nishonlar.map((a) => <div key={a.id} className={cx("ach-badge", a.got ? "got" : "locked")} title={a.desc}>
              <span className="ach-badge-ic">{a.got ? a.icon : "🔒"}</span>
              <span className="ach-badge-name">{a.name}</span>
              {a.got && <span className="ach-badge-desc">{a.desc}</span>}
            </div>)}
        </div>
      </div>}
      {children}
    </div>;
}

// src/9-Modull/PmOneOnOneLesson.jsx
var MENTOR_IMG = "https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png";
var T = { ...qolipRang("pm"), shadowBase: "27, 22, 48" };
var __lang = "uz";
var tr2 = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React4.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? "";
};
var ou = (o) => o && typeof o === "object" && !React4.isValidElement(o) ? o.uz ?? "" : o;
var LangContext = createContext2("uz");
var MentorCtx = createContext2(null);
var AchCtx = createContext2(null);
var AchMissCtx = createContext2(null);
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split("`").map((p, i) => i % 2 ? <code className={p.length > 24 && p.includes(" ") ? "qcode uzun" : "qcode"} key={i}>{p}</code> : p) : s;
var getAudioEngine = () => null;
var useAudio = () => ({ muted: true, isPlaying: false, currentSegment: null, waitingFor: null, triggerEvent: () => {
}, replay: () => {
}, toggleMute: () => {
} });
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState5(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect6(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}
var LESSON_META = { lessonId: "pm-m9d15-v1", lessonTitle: { uz: "Roadmap bo'yicha qayerdasiz?", ru: "Где вы сейчас по roadmap?" } };
var HW_TOKENS = [
  { t: { uz: "qadam", ru: "шаг" }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: "risk", ru: "риск" }, l: 70, tp: 18, s: 12, d: 7.5 },
  { t: { uz: "reja", ru: "план" }, l: 40, tp: 70, s: 12, d: 8.5 }
];
var SCREEN_META = [
  { id: "s0", type: "hook", template: "custom", scored: false, scope: "hook" },
  { id: "s1", type: "rule", template: "custom", scored: false, scope: null },
  { id: "s2", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s3", type: "exploration", template: "custom", scored: false, scope: null },
  { id: "s4", type: "test", template: "MCScreen", scored: true, scope: "module-mikro" },
  { id: "s5", type: "practice", template: "custom", scored: false, scope: null },
  { id: "s6", type: "practice", template: "custom", scored: false, scope: null },
  { id: "s7", type: "practice", template: "custom", scored: false, scope: null },
  { id: "s8", type: "test", template: "MCScreen", scored: true, scope: "final" },
  { id: "podium", type: "stats", template: "custom", scored: false, scope: null },
  { id: "sflash", type: "flashcards", template: "custom", scored: false, scope: null },
  { id: "s11", type: "summary", template: "custom", scored: false, scope: null }
];
var TOTAL_SCREENS = SCREEN_META.length;
var SCORED_IDX = SCREEN_META.map((m, i) => m.scored ? i : null).filter((i) => i !== null);
var Zoomable = ({ children }) => {
  const [big, setBig] = useState5(false);
  const zref = useRef5(null);
  const [hasContent, setHasContent] = useState5(true);
  const [zFloat, setZFloat] = useState5(false);
  const [zJoy, setZJoy] = useState5(false);
  const [zQator, setZQator] = useState5(false);
  useEffect6(() => {
    const el = zref.current;
    if (!el || typeof MutationObserver === "undefined") return;
    const ink = (n) => {
      if (!el.contains(n) || n === el || n.classList?.contains("zoom-btn") || n.closest?.(".zoom-btn")) return false;
      if (/^(IMG|svg|CANVAS|INPUT|TEXTAREA|BUTTON|VIDEO|SELECT|path|rect|circle|line|polygon)$/.test(n.tagName)) return true;
      if ([...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) return true;
      const cs = getComputedStyle(n);
      const bg = cs.backgroundColor.match(/[\d.]+/g);
      return bg && (bg.length < 4 || Number(bg[3]) > 0.05) || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== "none";
    };
    const run = () => {
      const zb = el.querySelector(":scope > .zoom-btn");
      if (!zb || el.classList.contains("zoom-on")) {
        setZFloat(false);
        return;
      }
      const zr0 = el.getBoundingClientRect();
      const qol = el.querySelector("[data-zoom-asosiy]");
      const tash = [];
      if (qol) tash.push(qol);
      else {
        const q = [...el.children].filter((n) => !n.classList.contains("zoom-btn"));
        while (q.length) {
          const n = q.shift();
          const b = n.getBoundingClientRect();
          if (b.width < 2 || b.height < 2) {
            q.push(...n.children);
            continue;
          }
          if (n.tagName === "svg" || ink(n)) tash.push(n);
          else q.push(...n.children);
        }
      }
      const yuza = (n) => {
        const b = n.getBoundingClientRect();
        return b.width * b.height;
      };
      const maks = tash.length ? Math.max(...tash.map(yuza)) : 0;
      const asosiy = tash.filter((n) => yuza(n) >= maks * 0.5);
      if (asosiy.length && zr0.width) {
        let T2 = 1e9, R = -1e9;
        for (const n of asosiy) {
          const b = n.getBoundingClientRect();
          T2 = Math.min(T2, b.top);
          R = Math.max(R, b.right);
        }
        const k = el.offsetWidth / zr0.width;
        const pt = parseFloat(getComputedStyle(el).paddingTop) || 0;
        const xs = (R - zr0.left) * k;
        const band = (dx, dy) => {
          const s = pt / k, bl = R + (dx - 3) / k, br = bl + 36 / k, bt = T2 - s + (dy - 3) / k, bb = bt + 36 / k;
          if (bl < zr0.left - 1 || br > zr0.right + 1) return true;
          for (const n of el.querySelectorAll("*")) {
            if (n.closest(".zoom-btn")) continue;
            const yaprq = /^(IMG|svg|INPUT|BUTTON|TEXTAREA|SELECT|CANVAS|VIDEO)$/.test(n.tagName) || [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
            if (!yaprq || n.closest("svg") && n.tagName !== "svg") continue;
            const b = n.getBoundingClientRect();
            if (b.width < 1) continue;
            if (b.left < br && b.right > bl && b.top - s < bb && b.bottom - s > bt) return true;
          }
          for (const [px, py] of [[bl, bt], [br, bt], [bl, bb], [br, bb], [(bl + br) / 2, (bt + bb) / 2]]) for (const n of document.elementsFromPoint(px, py)) {
            if (el.contains(n) || n.contains(el) || n.closest(".zoom-btn")) continue;
            if (/^(IMG|svg|INPUT|BUTTON|TEXTAREA|SELECT|CANVAS|VIDEO)$/.test(n.tagName) || [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) return true;
          }
          return false;
        };
        const j = [[8, 0], [-38, 8]].find(([dx, dy]) => !band(dx, dy));
        if (j) {
          el.style.setProperty("--zb-x", xs + j[0] + "px");
          el.style.setProperty("--zb-y", Math.max(0, (T2 - zr0.top) * k - pt + j[1]) + "px");
          setZQator(false);
          setZJoy(true);
          setZFloat(false);
          return;
        }
        el.style.setProperty("--zb-x", Math.max(0, xs - 30) + "px");
        setZJoy(false);
        setZQator(true);
        setZFloat(false);
        return;
      }
      setZJoy(false);
      setZQator(false);
      const r = zb.getBoundingClientRect(), zr = el.getBoundingClientRect();
      if (!r.width) return;
      let hit = false;
      for (let y = r.top; y < Math.min(r.top + 220, zr.bottom) && !hit; y += 18) for (const x of [r.left - 30, r.left - 140]) {
        if (x < zr.left) continue;
        if (document.elementsFromPoint(x, y).some(ink)) {
          hit = true;
          break;
        }
      }
      setZFloat(!hit);
    };
    let raf = 0;
    const sch = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(run);
    };
    sch();
    const t = setTimeout(sch, 700);
    const t2 = setTimeout(sch, 1600);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sch);
    const mo = new MutationObserver(sch);
    mo.observe(el, { childList: true, subtree: true, characterData: true });
    window.addEventListener("resize", sch);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      clearTimeout(t2);
      mo.disconnect();
      window.removeEventListener("resize", sch);
    };
  }, []);
  useLayoutEffect(() => {
    const el = zref.current;
    if (!el) return;
    const kids = [...el.childNodes].filter((n) => !(n.nodeType === 1 && n.classList.contains("zoom-btn")));
    const c = kids.some((n) => (n.textContent || "").trim().length > 0 || n.nodeType === 1 && n.querySelector("img,svg,canvas,input,textarea,video,iframe,button"));
    if (c !== hasContent) setHasContent(c);
  });
  useEffect6(() => {
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
      <div ref={zref} className={`zoomable ${big ? "zoom-on" : ""}${hasContent ? "" : " z-empty"}${zFloat ? " z-float" : ""}${zJoy ? " zb-joy" : ""}${zQator ? " zb-qator" : ""}`}>
        {hasContent && <button type="button" className="zoom-btn" onClick={() => setBig((b) => !b)} aria-label={big ? tr2({ uz: "Kichraytirish", ru: "Уменьшить" }) : tr2({ uz: "Kattalashtirish", ru: "Увеличить" })} title={big ? tr2({ uz: "Kichraytirish", ru: "Уменьшить" }) : tr2({ uz: "Kattalashtirish", ru: "Увеличить" })}>{big ? "✕" : "⛶"}</button>}
        {children}
      </div>
    </>;
};
function AchCounter() {
  const earned = useContext2(AchCtx);
  const gate = useContext2(LiveGateCtx);
  const count = earned ? earned.size : 0;
  const total = Object.keys(ACHIEVEMENTS).length;
  const prevRef = useRef5(count);
  const [bump, setBump] = useState5(false);
  const [open, setOpen] = useState5(false);
  useEffect6(() => {
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
    return <div key={id} className={`ach-pop-row ${got ? "got" : ""}`}><span className="ach-pop-ic">{got ? a.icon : "🔒"}</span><span className="ach-pop-nm">{tr2(a.name)}</span></div>;
  })}
        </div>}
    </div>;
}
var Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic;
  const padH = isMobile ? 12 : 60;
  const [mCollapsed, setMCollapsed] = useState5(false);
  const contentRef = useRef5(null);
  useEffect6(() => {
    setMCollapsed(false);
  }, [screen]);
  useEffect6(() => {
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
            <div className="chrome-left eyebrow"><span className="dot" /><span>{tr2(eyebrow)}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <AchCounter />
              <div className="mono small" style={{ color: T.ink2 }}>{String(screen + 1).padStart(2, "0")} / {String(totalScreens).padStart(2, "0")}</div>
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
  const lbl = tr2(label) || tr2({ uz: "Davom etish", ru: "Продолжить" });
  const gate = useContext2(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === "student" && live.status !== "ended" && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr2({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Ментор ещё не перешёл на эту страницу" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? tr2({ uz: "Mentorni kuting", ru: "Ждите ментора" }) : freeRide && disabled ? tr2({ uz: "Davom etish", ru: "Продолжить" }) : lbl}</button>;
};
var MSTATS_COLORS = ["#019ACB", "#8B5CF6", "#E8A13A", "#E0559A"];
var RECAP_NEED_PCT = 60;
var RECAP_GOOD_PCT = 75;
var RECAP_MIN_ANSWERS = 3;
var INLINE_KEYS = { s4: 2, s8: 1, holatlar: -1, qadamlar: -1, practice: -1 };
var RECAPS = {
  4: { title: { uz: "Risk — oldinda", ru: "Риск — впереди" }, cards: [
    { ic: "1", h: { uz: "Risk — rejaga xalaqit berishi mumkin bo'lgan narsa.", ru: "Риск — то, что может помешать плану." } },
    { ic: "2", h: { uz: "Bo'lib o'tgan ish risk emas — uning holati bor: kechikdi yoki bajarildi.", ru: "Прошедшая работа — не риск: у неё есть статус — «с опозданием» или «выполнено»." } },
    { ic: "3", h: { uz: "Roadmap'ga yordam beradigan narsa ham risk emas.", ru: "То, что помогает roadmap, — тоже не риск." }, ask: { uz: "Roadmap'ingizga oldinda nima xalaqit berishi mumkin?", ru: "Что впереди может помешать вашему roadmap?" } }
  ] },
  8: { title: { uz: "Qadam roadmap'ga yoziladi", ru: "Шаг записывают в roadmap" }, cards: [
    { ic: "1", h: { uz: "Har riskka bitta qadam — riskni kamaytiradigan aniq ish.", ru: "На каждый риск — один шаг: конкретное дело, которое уменьшает риск." } },
    { ic: "2", h: { uz: "Qadam roadmap'da o'z ufqiga qo'yiladi: qachon boshlana olsa.", ru: "Шаг ставят в свой горизонт roadmap: когда он сможет начаться." } },
    { ic: "3", h: { uz: "Holatlar va qadamlar qo'shilgan roadmap — tuzatilgan reja.", ru: "Roadmap со статусами и шагами — это исправленный план." }, ask: { uz: "Birinchi qadamingiz qaysi ufqda turibdi?", ru: "В каком горизонте стоит ваш первый шаг?" } }
  ] }
};
function RecapOverlay({ screenIdx, onClose }) {
  const rc = RECAPS[screenIdx];
  const [i, setI] = useState5(0);
  useEffect6(() => {
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
        <span className="rc-tag">{tr2({ uz: "Qayta tushuntirish", ru: "Повторное объяснение" })}</span>
        <span className="rc-title">{tr2(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        {card.ic && <div className="rc-ic">{card.ic}</div>}
        <h2 className="rc-h">{tr2(card.h)}</h2>
        <p className="rc-body">{tr2(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">{tr2({ uz: "Sinfga savol:", ru: "Вопрос классу:" })} {tr2(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr2({ uz: "← Oldingi", ru: "← Предыдущая" })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={`${k + 1}${tr2({ uz: "-karta", ru: "-я карта" })}`} />)}</div>
        {last ? <button className="rc-btn done" onClick={onClose}>{tr2({ uz: "✓ Tushunarli — davom etamiz", ru: "✓ Понятно — продолжаем" })}</button> : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr2({ uz: "Keyingisi →", ru: "Дальше →" })}</button>}
      </div>
    </div>;
}
function MentorTestStats({ live, screenIdx, options, correctIdx, reveal, onReveal, onOpenRecap }) {
  const [data, setData] = useState5({ players: null, rows: [] });
  useEffect6(() => {
    let on2 = true, t = null;
    const tick = async () => {
      try {
        const [players, answers] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, screenIdx)]);
        if (on2) setData({ players, rows: answers });
      } catch {
      }
      if (on2) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on2 = false;
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
        <span className="mstats-lbl">{tr2({ uz: "Jonli natija", ru: "Живой результат" })}</span>
        <span className="mstats-n">{allIn ? tr2({ uz: "✓ Hamma javob berdi", ru: "✓ Все ответили" }) : <>{tr2({ uz: "Javob berdi:", ru: "Ответили:" })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? "ready" : ""}`} onClick={onReveal}>{tr2({ uz: "Natijani ochish", ru: "Открыть результат" })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? "full" : ""}`} style={{ width: `${total ? Math.round(answered / total * 100) : 0}%` }} /></div>
      {reveal ? <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr2({ uz: "to'g'ri", ru: "верно" })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr2({ uz: "xato", ru: "неверно" })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr2({ uz: "kutilmoqda", ru: "ожидаем" })}</span></div>
        </div> : <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr2({ uz: "javob berdi", ru: "ответили" })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr2({ uz: "kutilmoqda", ru: "ожидаем" })}</span></div>
        </div>}
      {!reveal && answered > 0 && <p className="mstats-hidden">{tr2({ uz: "Kim nimani tanlagani va to'g'ri/xato soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: "Кто что выбрал и число верных/неверных скрыто — при нажатии «Открыть результат» всё появится сразу и у вас, и на экранах учеников." })}</p>}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
    const n = data.rows.filter((a) => a.picked === i).length;
    const pct = answered ? Math.round(n / answered * 100) : 0;
    const isC = reveal && i === correctIdx;
    const col = isC ? T.ok : MSTATS_COLORS[i % 4];
    return <div key={i} className={`mstats-row ${reveal && !isC ? "dimmed" : ""}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? "✓" : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round(n / maxN * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.ok, fontWeight: 800 } : void 0}>{n > 0 ? `${n} ${tr2({ uz: "o'quvchi", ru: "уч." })} · ${pct}%` : "—"}</span>
            </div>;
  })}
      </div>}
      {reveal && answered > 0 && (() => {
    const pct = Math.round(ok / answered * 100);
    const level = answered < RECAP_MIN_ANSWERS ? "few" : pct < RECAP_NEED_PCT ? "need" : pct < RECAP_GOOD_PCT ? "maybe" : "good";
    return <div className={`mstats-verdict ${level}`}>
            {level === "need" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <>Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>Только <b>{pct}%</b> верных — тема осталась непонятной классу. Перед продолжением коротко повторите.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr2({ uz: "Qayta tushuntirish — ", ru: "Объяснить заново — " })}{tr2(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === "maybe" && <>
              <p className="mstats-verdict-t">{tr2({ uz: <><b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <><b>{pct}%</b> верных — неплохо. При желании коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr2({ uz: "Qisqa takrorlash", ru: "Короткое повторение" })}</button>}
            </>}
            {level === "good" && <p className="mstats-verdict-t">{tr2({ uz: <><b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <><b>{pct}%</b> верных — класс усвоил тему. Смело продолжайте!</> })}</p>}
            {level === "few" && <p className="mstats-verdict-t">{tr2({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — по процентам судить трудно. Оцените сами.</> })}</p>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr2({ uz: "Kutilmoqda:", ru: "Ожидаем:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">{tr2({ uz: "Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: "Большинство ошиблось — похоже, тема осталась непонятной. Объясните ещё раз." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr2({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь в реальном времени…" })}</p>}
    </div>;
}
var QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev, vizual }) => {
  const _am = useContext2(AchMissCtx);
  const fpPractice = !!(_am && _am.practice);
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: "on_mount", waits_for: { type: "option_picked" } }] : null);
  const gate = useContext2(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === "student");
  const isMentorLive = !!(live && live.mode === "mentor");
  const mountTs = useRef5(Date.now());
  const [picked, setPicked] = useState5(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState5(storedAnswer ? storedAnswer.solved ?? storedAnswer.picked === correctIdx : false);
  const firstCorrectRef = useRef5(storedAnswer ? storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null : null);
  const [mReveal, setMReveal] = useState5(() => !!(isMentorLive && storedAnswer));
  const [recapOpen, setRecapOpen] = useState5(false);
  const hasRecap = !!RECAPS[screen];
  const doReveal = () => {
    setMReveal(true);
    if (live) live.mentorReveal(screen);
    if (storedAnswer === void 0) onAnswer(screen, { mentorRevealed: true });
  };
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect6(() => {
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
      if (!fpPractice) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    if (live && live.recordAttempt && !fpPractice) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options: options.map(ou), picked: ou(options[i]), correct: ou(options[correctIdx]), lang: typeof __lang !== "undefined" && __lang === "ru" ? "ru" : "uz" });
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
      {
    /* D1/DE-203: ko'rinish — qolip QTest (texnik darslar standarti); mantiq (jonli ball, bitta urinish, mentor ochishi) — shu yerda */
  }
      <QTest
    savol={tr2(question)}
    ogoh={oneShot && !solved && tr2({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: "Живой урок — одна попытка, подумайте перед нажатием!" })}
    variantlar={options.map((opt) => fmtCode(tr2(opt)))}
    ixcham={picked !== null}
    yopiq={solved || isMentorLive}
    onTanla={pick}
    holat={(i) => isMentorLive ? mReveal ? i === correctIdx ? "ok" : "xira" : void 0 : solved ? waiting ? i === picked ? "kutish" : void 0 : i === correctIdx ? "ok" : wrongLocked && i === picked ? "xato" : "xira" : i === picked ? "xato" : void 0}
    javob={(isMentorLive ? mReveal : picked !== null) && <QTestJavob
      key={`${picked}-${solved}-${waiting}`}
      tur={waiting ? "kutish" : isMentorLive || solved && !wrongLocked ? "ok" : "qayta"}
      sarlavha={isMentorLive ? <>{tr2({ uz: "✓ To'g'ri javob:", ru: "✓ Верный ответ:" })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr2(options[correctIdx]))}</> : waiting ? tr2({ uz: "Javobingiz qabul qilindi", ru: "Ваш ответ принят" }) : wrongLocked ? <>{tr2({ uz: "To'g'ri javob:", ru: "Верный ответ:" })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr2(options[correctIdx]))}</> : solved ? tr2({ uz: "To'g'ri", ru: "Верно" }) : tr2({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
    >
            <p>{isMentorLive ? fmtCode(tr2(explainCorrect)) : waiting ? tr2({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: "Сейчас узнаете верный ответ." }) : wrongLocked ? fmtCode(tr2(explainWrong[picked] ?? explainWrong.default)) : solved ? fmtCode(tr2(explainCorrect)) : fmtCode(tr2(explainWrong[picked] ?? explainWrong.default))}</p>
            {
      /* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi; jonli darsda — reveal'dan keyin */
    }
            {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr2({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — взглянуть на тему ещё раз" })}</button>}
          </QTestJavob>}
  >
        {
    /* MD: javob topilgach (jonli darsda — natija ochilgandan keyin) savol ostida kichik karta */
  }
        {
    /* F-1015-175: javobdan keyin takror karta (vizual) ko'rsatilmaydi — javob izohi yetarli */
  }
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </QTest>
    </Stage>;
};
function ScoreRing({ correct, total }) {
  const PCT = total ? correct / total : 0;
  const col = PCT >= 0.6 ? T.ok : T.accent;
  const R = 50, ST = 9, C = 2 * Math.PI * R;
  const [off, setOff] = useState5(C);
  useEffect6(() => {
    const t = setTimeout(() => setOff(C * (1 - PCT)), 200);
    return () => clearTimeout(t);
  }, [C, PCT]);
  return <div className="ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke={T.ink2 + "40"} strokeWidth={ST} />
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
var cxx = (...a) => a.filter(Boolean).join(" ");
var A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
var kamHarakat = () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var lsGet = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k) || "null");
  } catch {
    return null;
  }
};
var lsSet = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
  }
};
var useJonli = () => {
  const g = useContext2(LiveGateCtx) || {};
  const live = g.live;
  return { live, isMentor: !!(live && live.mode === "mentor"), isStudent: !!(live && live.mode === "student") };
};
var jonliDars = (live) => !!(live && live.pin && (live.mode === "student" || live.mode === "mentor"));
var useIpucha = (faol, kalit, ms = 4e4) => {
  const [on2, setOn] = useState5(false);
  useEffect6(() => {
    setOn(false);
    if (!faol) return void 0;
    const t = setTimeout(() => setOn(true), ms);
    return () => clearTimeout(t);
  }, [faol, kalit, ms]);
  return on2;
};
var uchir = (r, el, ms = 560) => {
  if (!r || !el || !el.animate || kamHarakat()) return;
  const g = el.getBoundingClientRect();
  if (!g.width || !r.width) return;
  const z = (el.offsetWidth || g.width) / g.width;
  const dx = (r.left + r.width / 2 - (g.left + g.width / 2)) * z;
  const dy = (r.top + r.height / 2 - (g.top + g.height / 2)) * z;
  const s = Math.min(2.4, Math.max(0.4, r.width / g.width));
  el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.8 }, { transform: "translate(0, 0) scale(1)", opacity: 1 }], { duration: ms, easing: "cubic-bezier(.2,.8,.2,1)" });
};
var useUchish = () => {
  const q = useRef5([]);
  useLayoutEffect(() => {
    if (!q.current.length) return;
    const navbat = q.current;
    q.current = [];
    navbat.forEach((u) => uchir(u.r, document.querySelector(`.lesson-root [data-uch="${u.k}"]`), u.ms));
  });
  return useCallback2((manba, k, ms) => {
    const r = manba && (manba.getBoundingClientRect ? manba.getBoundingClientRect() : manba);
    if (r) q.current.push({ r, k, ms });
  }, []);
};
var halqa = (on2) => on2 ? "oo-halqa" : void 0;
var MentorNote = ({ children }) => {
  const { isMentor } = useJonli();
  const [ochiq, setOchiq] = useState5(false);
  if (!isMentor) return null;
  return ochiq ? <div className="oo-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="oo-mnote-l">{tr2({ uz: "Mentorga eslatma", ru: "Заметка ментору" })}</span><span>{children}</span></div> : <QTugma ikkinchi className="oo-mnote-c" onClick={() => setOchiq(true)}>{tr2({ uz: "Eslatma", ru: "Заметка" })}</QTugma>;
};
var NishonQatori = ({ screen }) => {
  const olingan = useContext2(AchCtx);
  const am = useContext2(AchMissCtx);
  const { isMentor } = useJonli();
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || isMentor || olingan && olingan.has(ach)) return null;
  if (am.missed.has(sid)) return null;
  return <p className={cxx("oo-nishon", false)}>{tr2({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: "Сделаете верно с первой попытки — значок ваш." })}</p>;
};
var OvozChizigi = ({ live, screen, variantlar, mening }) => {
  const [son, setSon] = useState5(null);
  const pin = live && live.pin;
  useEffect6(() => {
    if (!pin) return void 0;
    let on2 = true, t = null;
    const ayl = async () => {
      try {
        const rows = await liveAnswers(pin, screen);
        if (on2) setSon(variantlar.map((_, i) => rows.filter((r) => r.picked === i).length));
      } catch {
      }
      if (on2) t = setTimeout(ayl, 3e3);
    };
    ayl();
    return () => {
      on2 = false;
      clearTimeout(t);
    };
  }, [pin, screen]);
  if (!son) return null;
  const jami = son.reduce((a, b) => a + b, 0);
  return <div className="oo-ovoz fade-step">
      {variantlar.map((v, i) => <div key={i} className={cxx("oo-ovoz-q", mening === i && "men")}><span>{v}</span><span className="oo-ovoz-y"><i style={{ width: `${jami ? Math.round(son[i] / jami * 100) : 0}%` }} /></span><b>{son[i]}</b></div>)}
    </div>;
};
var MentorRoyxat = ({ screen, yorliq, qator }) => {
  const { live, isMentor } = useJonli();
  const pin = live && live.pin;
  const [d, setD] = useState5(null);
  useEffect6(() => {
    if (!isMentor || !pin) return void 0;
    let on2 = true, t = null;
    const ayl = async () => {
      try {
        const [p, r] = await Promise.all([livePlayers(pin), liveAnswers(pin, PRACTICE_BASE + screen)]);
        if (on2) setD({ p, r });
      } catch {
      }
      if (on2) t = setTimeout(ayl, 3e3);
    };
    ayl();
    return () => {
      on2 = false;
      clearTimeout(t);
    };
  }, [isMentor, pin, screen]);
  if (!isMentor) return null;
  const players = d ? d.p : [];
  const map = new Map((d ? d.r : []).map((r) => [r.player_id, r]));
  const bor = players.filter((p) => map.has(p.id)).length;
  return <div className="oo-mr fade-up">
      <div className="oo-mr-h"><span className="oo-yorliq">{tr2(yorliq)}</span><b>{d ? `${bor} / ${players.length}` : "—"}</b></div>
      {d && players.length > 0 && <ul className="oo-mr-ro">{players.map((p) => {
    const r = map.get(p.id);
    return <li key={p.id} className={cxx("oo-mr-q", r && "ok")}><span className="oo-mr-n">{p.nickname}</span>{qator(r)}</li>;
  })}</ul>}
      {d && !players.length && <p className="oo-kul-q">{tr2({ uz: "Hali hech kim qo'shilmagan.", ru: "Пока никто не присоединился." })}</p>}
    </div>;
};
var UFQLAR = [
  { id: "hozir", t: { uz: "Hozir · 11-Modul", ru: "Сейчас · 11-й модуль" }, q: { uz: "hozir", ru: "сейчас" } },
  { id: "keyinroq", t: { uz: "Keyinroq · 12–13-Modul", ru: "Позже · 12–13-й модуль" }, q: { uz: "keyinroq", ru: "позже" } },
  { id: "uzoqroq", t: { uz: "Uzoqroq · bitiruvdan keyin", ru: "Дальше · после выпуска" }, q: { uz: "uzoqroq", ru: "дальше" } }
];
var ufqQ = (id) => {
  const u = UFQLAR.find((x) => x.id === id);
  return u ? tr2(u.q) : "";
};
var HOLAT2 = {
  bajarildi: { t: { uz: "Bajarildi", ru: "Выполнено" }, ch: { uz: "bajarildi", ru: "выполнено" } },
  kechikdi: { t: { uz: "Kechikdi", ru: "С опозданием" }, ch: { uz: "kechikdi", ru: "с опозданием" } },
  boshlanmadi: { t: { uz: "Boshlanmadi", ru: "Не начато" }, ch: { uz: "boshlanmadi", ru: "не начато" } }
};
var HOLAT_TUGMA = ["bajarildi", "kechikdi", "boshlanmadi"];
var BUGUN = { uz: "Bugun · 15-dars", ru: "Сегодня · урок 15" };
var QADAM_Y = { uz: "qadam", ru: "шаг" };
var AVVAL_Y = { uz: "Avval", ru: "Сначала" };
var RISK_T = { uz: "Risk", ru: "Риск" };
var QADAM_T = { uz: "Qadam", ru: "Шаг" };
var SAQLASH = { uz: "Saqlash", ru: "Сохранить" };
var YORDAM_T = { uz: "Yordam", ru: "Подсказка" };
var DAVOM = { uz: "Davom etish", ru: "Продолжить" };
var darsT = (n) => tr2({ uz: `${n}-dars`, ru: `урок ${n}` });
var SLOT = [{ uz: "1-asosiy funksiya", ru: "1-я основная функция" }, { uz: "2-asosiy funksiya", ru: "2-я основная функция" }, { uz: "3-asosiy funksiya", ru: "3-я основная функция" }];
var DARS_HOZIR = [11, 12, 14];
var MJ = () => <span className="oo-mj">Maydon Jamoa</span>;
var MentorMisoli = () => <>{tr2({ uz: "Mentor misoli", ru: "Пример Ментора" })} · <MJ /></>;
var ROADMAPIM = { uz: "Roadmap'im", ru: "Мой roadmap" };
var TUZATILGAN = { uz: "Tuzatilgan reja", ru: "Исправленный план" };
var MENTOR_REJA = [
  { id: "elon", nom: { uz: "O'yin e'loni va qo'shilish", ru: "Объявление об игре и присоединение" }, ufq: "hozir", dars: 11, holat: "bajarildi" },
  { id: "tasdiq", nom: { uz: "O'yin kuni tasdiq", ru: "Подтверждение в день игры" }, ufq: "hozir", dars: 12, holat: "bajarildi" },
  { id: "royxat", nom: { uz: "Ro'yxat kun bo'yicha", ru: "Список по дням" }, ufq: "hozir", dars: 13, holat: "bajarildi" },
  { id: "navbat", nom: { uz: "Chiqish va navbat", ru: "Выход и очередь" }, ufq: "hozir", dars: 14, holat: "kechikdi" },
  { id: "eslatma", nom: { uz: "O'yindan oldin eslatma", ru: "Напоминание перед игрой" }, ufq: "keyinroq", holat: "boshlanmadi" },
  { id: "jonli", nom: { uz: "Ro'yxat o'zi yangilanadi", ru: "Список обновляется сам" }, ufq: "keyinroq", holat: "boshlanmadi" },
  { id: "pul", nom: { uz: "Maydon pulini bo'lishish", ru: "Делить плату за поле" }, ufq: "uzoqroq", holat: "boshlanmadi" }
];
var mentorIshlar = (holatli2) => MENTOR_REJA.map((x) => ({ key: x.id, nom: tr2(x.nom), ufq: x.ufq, yorliq: x.dars ? darsT(x.dars) : null, holat: holatli2 ? x.holat : null }));
var HolatChip = ({ h, yangi }) => h ? <span className={cxx("rd-chip", h, yangi && "yangi")}>{h === "bajarildi" && <i aria-hidden="true">✓</i>}{tr2(HOLAT2[h].ch)}</span> : <span className="rd-chip bosh">?</span>;
var IshK = ({ ish, i, joriy, xato, yangi, onBos, sakra }) => {
  const Tag = onBos ? "button" : "div";
  return <Tag type={onBos ? "button" : void 0} className={cxx("rd-karta", joriy && "joriy", xato && "xato", yangi && "yangi", ish.kul && "kul", onBos && "bosiladi")} data-uch={"k-" + ish.key} onClick={onBos} style={{ "--i": i }}>
      <span className="rd-k-nom">{ish.nom}</span>
      {ish.yorliq && <span className="rd-k-y">{ish.yorliq}</span>}
      <span className={cxx("rd-k-ch", sakra && "sakra")} style={{ "--i": i }}><HolatChip h={ish.holat} yangi={yangi} /></span>
      {onBos && <i className="rd-k-ed" aria-hidden="true">✎</i>}
    </Tag>;
};
var QadamK = ({ q, i, yangi, avval, onBos, onEd }) => <div className={cxx("rd-q", q.bosh && "bosh", yangi && "yangi", avval && "avval", q.tush && "tush")} data-uch={"q-" + q.key} style={{ "--i": i }}>
    <span className="rd-q-y">{tr2(QADAM_Y)}{avval && <b>{tr2(AVVAL_Y)}</b>}</span>
    {!q.bosh && (onBos ? <button type="button" className="rd-qadam" onClick={onBos}>{q.matn}</button> : <span className="rd-q-t">{q.matn}</span>)}
    {!q.bosh && q.risk && <span className="rd-q-r">{q.risk}</span>}
    {onEd && <button type="button" className="rd-ed" aria-label="✎" onClick={onEd}>✎</button>}
  </div>;
var RejaDoska = ({ ishlar = [], qadamlar = [], kor = "toliq", sarlavha, son, joriy = [], xato, yangi = [], onIsh, onQadam, onQadamEd, avval = null, sakra, tolqin, yonadi, sarKalit, faqat, className }) => {
  if (kor === "ixcham") {
    return <div className={cxx("rd-ix", className)}>
        {sarlavha && <span className="rd-ix-l">{sarlavha}</span>}
        {UFQLAR.map((u) => {
      const ich = ishlar.filter((x) => x.ufq === u.id);
      return <span key={u.id} className="rd-ix-u"><i>{tr2(u.t)}</i>
              {HOLAT_TUGMA.map((h) => {
        const n2 = ich.filter((x) => x.holat === h).length;
        return n2 > 0 && <span key={h} className={cxx("rd-chip", h)}>{h === "bajarildi" ? "✓" : tr2(HOLAT2[h].ch)} {n2}</span>;
      })}
              {!ich.some((x) => x.holat) && <span className="rd-chip bosh">{ich.length ? "?" : "—"}</span>}
            </span>;
    })}
      </div>;
  }
  let n = 0;
  return <div className={cxx("rd", kor, yonadi && "yonadi", className)}>
      {(sarlavha || son) && <div className="rd-h"><b key={sarKalit} className="rd-h-t">{sarlavha}</b>{son}</div>}
      <div className={cxx("rd-ustunlar", faqat && "faqat")}>
        {UFQLAR.filter((u) => !faqat || faqat.includes(u.id)).map((u) => {
    const ich = ishlar.filter((x) => x.ufq === u.id);
    const qs = qadamlar.filter((x) => x.ufq === u.id);
    return <div key={u.id} className={cxx("rd-u", u.id)}>
              <span className="rd-u-h">{tr2(u.t)}</span>
              <div className="rd-u-ich">
                {ich.map((x) => <IshK key={x.key} ish={x} i={n++} joriy={joriy.includes(x.key)} xato={xato && joriy.includes(x.key)} yangi={yangi.includes(x.key)} sakra={sakra} onBos={onIsh ? () => onIsh(x) : void 0} />)}
                {u.id === "hozir" && <div className={cxx("rd-bugun", tolqin && "tolqin")}><span>{tr2(BUGUN)}</span></div>}
                {qs.map((q) => <QadamK key={q.key} q={q} i={n++} yangi={yangi.includes("q-" + q.key)} avval={avval === q.idx} onBos={onQadam ? () => onQadam(q) : void 0} onEd={onQadamEd ? () => onQadamEd(q) : void 0} />)}
              </div>
            </div>;
  })}
      </div>
    </div>;
};
var Tel = ({ children, xira, k, bar = true, className }) => <div className={cxx("oo-tel", xira && "xira", className)}>
    {bar ? <div className="oo-tel-bar"><MJ /></div> : <div className="oo-tel-bar bosh" />}
    <div className="oo-tel-ekran" key={k}>{children}</div>
  </div>;
var SHANBA = { uz: "Shanba, 18:00", ru: "Суббота, 18:00" };
var MAYDON = { uz: "Mahalla maydoni", ru: "Поле махалли" };
var OyinK = ({ son, tugma, ok, soatsiz }) => <div className="oo-ok">
    <span className="oo-ok-t">{!soatsiz && <b>{tr2(SHANBA)}</b>}<span>{tr2(MAYDON)}</span></span>
    {son && <b className="oo-ok-son" key={son}>{son}</b>}
    {tugma && <span className={cxx("oo-ok-tg", ok && "ok")}>{tugma}</span>}
  </div>;
var Odam = ({ x = 0, y = 0, s = 1, kiyim = "#3E7CB1", teri = "#E3A87C", soch = "#2E2019" }) => <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-8" y="-31" width="7.5" height="29" rx="3.5" fill="#3B3F5C" />
    <rect x="0.5" y="-31" width="7.5" height="29" rx="3.5" fill="#3B3F5C" />
    <rect x="-9.5" y="-4" width="10" height="4.5" rx="2.2" fill="#2A2730" />
    <rect x="0.5" y="-4" width="11" height="4.5" rx="2.2" fill="#2A2730" />
    <rect x="-11" y="-58" width="22" height="30" rx="8" fill={kiyim} />
    <rect x="-13" y="-56" width="8" height="24" rx="4" fill={kiyim} opacity="0.85" />
    <rect x="-3" y="-62" width="6" height="6" rx="2" fill={teri} />
    <rect x="5" y="-54" width="7" height="14" rx="3.5" fill={kiyim} />
    <rect x="7" y="-45" width="12" height="6.5" rx="3.2" fill={kiyim} />
    <circle cx="19" cy="-42" r="3.3" fill={teri} />
    <rect x="16.5" y="-53" width="6.5" height="11" rx="1.6" fill="#2A2730" />
    <circle cx="0" cy="-71" r="10.5" fill={teri} />
    <path d="M -11 -70 C -12 -86, 12 -86, 11 -71 C 6 -77, -2 -78, -11 -70 Z" fill={soch} />
    <circle cx="2.5" cy="-71" r="1.35" fill="#2A2730" />
    <circle cx="7.5" cy="-71" r="1.35" fill="#2A2730" />
    <path d="M 3 -66 Q 5.5 -64 8 -66" stroke="#8A4B3A" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </g>;
var S2Dalil = ({ k }) => {
  const [bosildi, setBosildi] = useState5(false);
  useEffect6(() => {
    setBosildi(false);
    if (k > 1) return void 0;
    const t = setTimeout(() => setBosildi(true), kamHarakat() ? 0 : 1100);
    return () => clearTimeout(t);
  }, [k]);
  const sar = (t) => <span className="oo-te-h">{tr2(t)}</span>;
  const OYINLAR = { uz: "O'yinlar", ru: "Игры" };
  let ekran, ust = null, ost = null;
  if (k === 0) {
    ekran = <>{sar(OYINLAR)}<OyinK son={bosildi ? "9 / 10" : "8 / 10"} tugma={bosildi ? tr2({ uz: "Qo'shildingiz", ru: "Вы присоединились" }) : tr2({ uz: "Qo'shilaman", ru: "Присоединяюсь" })} ok={bosildi} />{!bosildi && <i className="oo-barmoq" aria-hidden="true" />}</>;
    ost = { uz: "11-darsda shunday ishladi", ru: "Так работало на 11-м уроке" };
  } else if (k === 1) {
    ekran = <>{sar({ uz: "Shanba, 18:00 · Mahalla maydoni", ru: "Суббота, 18:00 · Поле махалли" })}<span className="oo-te-doira">{[0, 1, 2, 3, 4].map((i) => <i key={i} className={i < 3 ? "ok" : ""} />)}</span><span className={cxx("oo-ok-tg", "ok")}>{tr2({ uz: "Kelaman", ru: "Приду" })}</span>{bosildi && <span className="oo-te-q fade-step">{tr2({ uz: "Kelishini tasdiqladi: 7 / 9", ru: "Подтвердили: 7 / 9" })}</span>}</>;
    ost = { uz: "12-darsda shunday ishladi", ru: "Так работало на 12-м уроке" };
  } else if (k === 2) {
    ekran = <>{sar(OYINLAR)}<span className="oo-te-kun">{tr2({ uz: "Shanba", ru: "Суббота" })}</span><OyinK son="8 / 10" /><span className="oo-te-kun" style={{ "--i": 1 }}>{tr2({ uz: "Yakshanba", ru: "Воскресенье" })}</span><OyinK soatsiz /></>;
    ost = { uz: "13-darsda, sinovdan keyin shunday ishladi", ru: "Так работало на 13-м уроке, после теста" };
  } else if (k === 3) {
    ust = <div className="oo-vaqt fade-step">
        <span className="oo-vq"><span className="oo-vq-b"><i className="x">✕</i><i className="x" style={{ "--i": 1 }}>✕</i></span><b>{darsT(14)}</b><em>{tr2({ uz: "navbatdagi kirmadi", ru: "из очереди не попал" })}</em></span>
        <span className="oo-vq-c" aria-hidden="true" />
        <span className="oo-vq"><span className="oo-vq-b"><i className="ok" style={{ "--i": 2 }}>✓</i></span><b>{tr2({ uz: "darsdan keyin", ru: "после урока" })}</b></span>
      </div>;
    ekran = <>{sar(OYINLAR)}<OyinK son={tr2({ uz: "O'yin to'ldi", ru: "Игра заполнена" })} tugma={tr2({ uz: "Navbatga yozilish", ru: "Записаться в очередь" })} /></>;
  } else {
    ust = <span className="oo-kul oo-tel-ust fade-step">{tr2({ uz: "12-Modul hali boshlanmagan", ru: "12-й модуль ещё не начался" })}</span>;
    ekran = <>{sar(OYINLAR)}<OyinK son="8 / 10" /></>;
  }
  return <div className="oo-dalil">
      {ust}
      <Tel k={k} xira={k === 4}>{ekran}</Tel>
      {ost && <span className="oo-kul fade-step" key={"o" + k}>{tr2(ost)}</span>}
    </div>;
};
var ROADMAP_KEY = "pm-m9d6-roadmap";
var SINOV_KEY = "pm-m9d13-sinov";
var REJA_KEY = "pm-m9d15-reja";
var QORALAMA_KEY = "pm-m9d15-qoralama";
var matnOl = (s) => String(typeof s === "string" ? s : s && (s.nom || s.matn || s.t) || "").trim();
var nuqtasiz = (s) => String(s || "").trim().replace(/[.!?…]+$/, "");
var qisqa = (s, n = 34) => {
  const t = String(s || "").trim();
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t;
};
var sinovLs = () => {
  const v = lsGet(SINOV_KEY);
  return v && typeof v === "object" ? v : null;
};
var trekWeb = () => {
  const v = lsGet("pm-m9d8-platforma");
  return !!(v && v.trek === "web");
};
var qoralama = () => {
  const v = lsGet(QORALAMA_KEY);
  return v && typeof v === "object" ? v : {};
};
var qoralamaYoz = (patch) => {
  const v = { ...qoralama(), ...patch, savedAt: Date.now() };
  lsSet(QORALAMA_KEY, v);
  return v;
};
var rejaLs = () => {
  const v = lsGet(REJA_KEY);
  return v && Array.isArray(v.risklar) ? v : null;
};
var roadmapIshlar = () => {
  const r = lsGet(ROADMAP_KEY);
  if (!r || !Array.isArray(r.ishlar) || !r.ishlar.length) return null;
  const hozir = Array.isArray(r.hozir) ? r.hozir.filter((i) => Number.isInteger(i) && r.ishlar[i] && matnOl(r.ishlar[i].nom)).slice(0, 3) : [];
  const out = hozir.map((i, s) => ({ key: "i" + i, nom: matnOl(r.ishlar[i].nom), ufq: "hozir", dars: DARS_HOZIR[s], yorliq: `${tr2(SLOT[s])} · ${darsT(DARS_HOZIR[s])}` }));
  const sv = sinovLs();
  const tox = sv && Array.isArray(sv.toxtashlar) ? sv.toxtashlar.find((t) => t && t.id === sv.eng) : null;
  const tnom = tox ? matnOl(tox.matn) : "";
  const sinov = {
    key: "sinov",
    nom: tnom ? qisqa(tnom) : tr2({ uz: "13-dars: sinovdan keyingi ish", ru: "Урок 13: работа после теста" }),
    kul: !tnom,
    toliq: tnom || null,
    ufq: "hozir",
    dars: 13,
    yorliq: sv && sv.tur === "mashq" ? `${darsT(13)} · ${tr2({ uz: "mashq sinovi", ru: "учебный тест" })}` : darsT(13),
    qayta: sv && sv.qaytaSinov && sv.qaytaSinov.natija
  };
  const j = out.findIndex((x) => x.dars === 14);
  if (j >= 0) out.splice(j, 0, sinov);
  else out.push(sinov);
  r.ishlar.forEach((x, i) => {
    if (hozir.includes(i)) return;
    const nom = matnOl(x && x.nom);
    if (!nom || !UFQLAR.some((u) => u.id === (x && x.ufq))) return;
    out.push({ key: "i" + i, nom, ufq: x.ufq });
  });
  return out;
};
var talabaIshlar = () => {
  const r = roadmapIshlar();
  if (r) return { ishlar: r, manba: "roadmap" };
  const q = qoralama();
  const y = Array.isArray(q.ishlar) ? q.ishlar.filter((x) => x && x.nom && x.ufq) : [];
  return y.length ? { ishlar: y, manba: "yozma" } : { ishlar: null, manba: null };
};
var holatli = (ishlar, d) => (ishlar || []).map((x) => ({ ...x, holat: (d.holat || {})[x.key] || null }));
var birinchiI = (risklar = [], ufqlar = [], birinchi) => {
  if (Number.isInteger(birinchi) && risklar[birinchi]) return birinchi;
  for (const u of ["hozir", "keyinroq", "uzoqroq"]) {
    const i = ufqlar.findIndex((x, j) => x === u && risklar[j]);
    if (i >= 0) return i;
  }
  return risklar.length ? 0 : -1;
};
var rejaYoz = (ishlar, d) => {
  const risklar = (d.risklar || []).slice(0, 3);
  const reja = {
    holatlar: (ishlar || []).filter((x) => (d.holat || {})[x.key]).map((x) => ({ ish: x.toliq || x.nom, holat: d.holat[x.key] })),
    risklar: risklar.map((r, i) => ({ risk: r.risk, qadam: r.qadam, ufq: (d.ufqlar || [])[i] || null })),
    eng: Number.isInteger(d.eng) && risklar[d.eng] ? d.eng : null,
    birinchi: Number.isInteger(d.birinchi) && risklar[d.birinchi] ? d.birinchi : null,
    savedAt: Date.now()
  };
  lsSet(REJA_KEY, reja);
  return reja;
};
var RejaStrip = () => {
  const { ishlar } = talabaIshlar();
  if (!ishlar || !ishlar.length) return null;
  const d = qoralama();
  const n = ishlar.filter((x) => (d.holat || {})[x.key]).length;
  return <div className="oo-strip fade-step"><span className="oo-strip-l">{tr2(ROADMAPIM)}</span><span>{tr2({ uz: "holatlar", ru: "статусы" })} <b>{n}/{ishlar.length}</b></span>{rejaLs() && <span className="oo-strip-ok">{tr2({ uz: "qadamlar", ru: "шаги" })} <b>3/3</b></span>}</div>;
};
var HOOK_OPTS = [
  { id: "ketyapman", t: { uz: "Roadmap bo'yicha ketyapman", ru: "Иду по roadmap" } },
  { id: "ortda", t: { uz: "Roadmap'dan biroz ortdaman", ru: "Немного отстаю от roadmap" } },
  { id: "oldinda", t: { uz: "Roadmap'dan biroz oldindaman", ru: "Немного опережаю roadmap" } }
];
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useJonli();
  const [picked, setPicked] = useState5(storedAnswer?.picked ?? null);
  const [manba] = useState5(talabaIshlar);
  const ishlar = manba.ishlar ? manba.ishlar.map((x) => ({ ...x, holat: null })) : mentorIshlar(false);
  const pick = (id) => {
    if (picked !== null || isMentor) return;
    const i = HOOK_OPTS.findIndex((o) => o.id === id);
    setPicked(id);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: id, correct: false });
    if (live && live.mode === "student") live.submitAnswer(screen, "s0", i, false, 0);
  };
  return <Stage eyebrow={tr2({ uz: "Kirish", ru: "Введение" })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr2({ uz: "Bittasini tanlang", ru: "Выберите один вариант" }) : tr2(DAVOM)} onClick={onNext} />}>
      <div className={cxx("oo-s0", picked === null && !isMentor && "tanlovsiz")}>
        <QKirish
    zoom={Zoomable}
    sarlavha={tr2({ uz: <>Roadmap bo'yicha <A>qayerdasiz?</A></>, ru: <>Где вы сейчас <A>по roadmap?</A></> })}
    mentor={<Mentor>{picked === null ? tr2({ uz: "Poydevor, uch asosiy funksiya va sinov ortda qoldi. Roadmap'ingizni eslang va o'zingizga yaqin javobni belgilang.", ru: "Фундамент, три основные функции и тест позади. Вспомните свой roadmap и отметьте близкий вам ответ." }) : tr2({ uz: "Javobni o'qing va «Davom etish»ni bosing.", ru: "Прочитайте ответ и нажмите «Продолжить»." })}</Mentor>}
    maket={<RejaDoska kor="kichik" ishlar={ishlar} sarlavha={manba.ishlar ? tr2(ROADMAPIM) : <MentorMisoli />} tolqin={picked !== null} sakra={picked !== null} />}
    variantlar={HOOK_OPTS.map((o) => ({ id: o.id, t: tr2(o.t) }))}
    tanlov={picked}
    onTanla={pick}
    yopiq={isMentor}
    javob={<>
            {picked !== null && <p className="oo-javob fade-step">{tr2({ uz: "Uchalasi ham uchraydi. Buni taxmin emas, roadmap'dagi har ish ko'rsatadi: o'z vaqtida tugadimi?", ru: "Встречаются все три. Покажет это не догадка, а каждая работа в roadmap: закончилась ли она вовремя?" })}</p>}
            {jonliDars(live) && <OvozChizigi live={live} screen={screen} variantlar={HOOK_OPTS.map((o) => tr2(o.t))} mening={HOOK_OPTS.findIndex((o) => o.id === picked)} />}
          </>}
  />
      </div>
      <MentorNote>{tr2({ uz: "Javoblarni muhokama qilmang — bugun har o'quvchi o'z roadmap'ini dalil bilan ko'radi. «Oldindaman» degan o'quvchidan keyinroq so'rang: keyinroq ufqidagi ishni boshladingizmi?", ru: "Не обсуждайте ответы — сегодня каждый ученик проверит свой roadmap по подтверждениям. Ученика, который сказал «опережаю», спросите позже: вы начали работу горизонта «позже»?" })}</MentorNote>
    </Stage>;
};
var REJA = [
  { t: { uz: "Roadmap'dagi har ish o'z vaqtida tugaganini belgilaysiz", ru: "Отметите, вовремя ли закончилась каждая работа в roadmap" }, teg: { uz: "holat", ru: "статус" } },
  { t: { uz: "Oldinda rejaga nima xalaqit berishi mumkinligini topasiz", ru: "Найдёте, что впереди может помешать плану" }, teg: { uz: "risk", ru: "риск" } },
  { t: { uz: "Har biriga bitta aniq qadam yozasiz", ru: "Для каждого напишете один конкретный шаг" }, teg: { uz: "qadam", ru: "шаг" } },
  { t: { uz: "Qadamlarni roadmap'ga qo'yib, Mentor bilan ko'rasiz", ru: "Поставите шаги в roadmap и посмотрите их с Ментором" }, teg: { uz: "tuzatilgan reja", ru: "исправленный план" } }
];
var S1_QADAM = [{ key: "b1", ufq: "hozir", bosh: true }, { key: "b2", ufq: "hozir", bosh: true }, { key: "b3", ufq: "keyinroq", bosh: true }];
var Screen1 = ({ screen, onNext, onPrev }) => <Stage eyebrow={tr2({ uz: "Reja", ru: "План" })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr2({ uz: "Boshlaymiz", ru: "Начинаем" })} onClick={onNext} /></>}>
    <QReja
  zoom={Zoomable}
  sarlavha={tr2({ uz: <>Bugun roadmap'ingizni <A>Mentor bilan</A> tuzatasiz.</>, ru: <>Сегодня вы исправите roadmap <A>вместе с Ментором</A>.</> })}
  mentor={<Mentor>{tr2({ uz: "Bugun har biringiz bilan yakkama-yakka gaplashaman. Undan oldin roadmap'ingizni birma-bir ko'rib chiqasiz.", ru: "Сегодня у меня встреча один на один с каждым из вас. До этого вы пункт за пунктом просмотрите свой roadmap." })}</Mentor>}
  chapYorliq={tr2({ uz: "Dars oxirida — Mentor bilan yakkama-yakka: risklar va tuzatilgan reja", ru: "В конце урока — встреча один на один с Ментором: риски и исправленный план" })}
  chap={<RejaDoska kor="kichik" ishlar={mentorIshlar(false)} qadamlar={S1_QADAM} sarlavha={<MentorMisoli />} sakra />}
  qadamlar={REJA.map((r) => ({ t: tr2(r.t) }))}
/>
  </Stage>;
var X_ISHLADI = { uz: "Dalilga qarang: ish o'z darsida ishladi.", ru: "Посмотрите на подтверждение: работа заработала на своём уроке." };
var X_BOSHLANGAN = { uz: "Telefonda ish ishlab turibdi — demak boshlangan.", ru: "На телефоне это уже работает — значит, начато." };
var X_VAQT = { uz: "Bu ishlarning vaqti hali kelmagan.", ru: "Время этих работ ещё не пришло." };
var S2_KARTA = [
  { keys: ["elon"], togri: "bajarildi", xato: { kechikdi: X_ISHLADI, boshlanmadi: X_BOSHLANGAN } },
  { keys: ["tasdiq"], togri: "bajarildi", xato: { kechikdi: X_ISHLADI, boshlanmadi: X_BOSHLANGAN } },
  { keys: ["royxat"], togri: "bajarildi", xato: { kechikdi: X_ISHLADI, boshlanmadi: X_BOSHLANGAN } },
  {
    keys: ["navbat"],
    togri: "kechikdi",
    xato: { bajarildi: { uz: "Hozir ishlaydi — lekin 14-darsda tugadimi?", ru: "Сейчас работает — но закончилась ли на 14-м уроке?" }, boshlanmadi: { uz: "Ish 14-darsda boshlangan edi — dalilni o'qing.", ru: "Работа началась на 14-м уроке — прочитайте подтверждение." } },
    izoh: { uz: "Kechikdi — rejadagi vaqtida tugamagan ish, keyin tugagan bo'lsa ham.", ru: "С опозданием — работа не закончилась в плановое время, даже если закончилась позже." }
  },
  {
    keys: ["eslatma", "jonli", "pul"],
    togri: "boshlanmadi",
    xato: { bajarildi: X_VAQT, kechikdi: X_VAQT },
    izoh: { uz: "Boshlanmadi — vaqti hali kelmagan ish.", ru: "Не начато — работа, время которой ещё не пришло." }
  }
];
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext2(AchMissCtx);
  const avval = !!storedAnswer;
  const [k, setK] = useState5(avval ? 5 : 0);
  const [xato, setXato] = useState5(null);
  const [izoh, setIzoh] = useState5(null);
  const [yangi, setYangi] = useState5(null);
  const xatoBor = useRef5(false);
  const done = k >= 5;
  const tugadi = useTugadi(done, 1700, avval);
  const ipucha = useIpucha(!done, k);
  const { live } = useJonli();
  useEffect6(() => {
    if (!done || storedAnswer !== void 0) return;
    onAnswer(screen, { stage: "holatlar", screenIdx: screen, correct: !xatoBor.current, picked: true, solved: true });
    if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "holatlar", 0, !xatoBor.current, 0);
  }, [done]);
  useEffect6(() => {
    if (!izoh) return void 0;
    const t = setTimeout(() => setIzoh(null), 3200);
    return () => clearTimeout(t);
  }, [izoh]);
  useEffect6(() => {
    if (yangi === null) return void 0;
    const t = setTimeout(() => setYangi(null), 1100);
    return () => clearTimeout(t);
  }, [yangi]);
  const bos = (h) => {
    if (done) return;
    const kt = S2_KARTA[k];
    if (h === kt.togri) {
      setXato(null);
      setYangi(k);
      setIzoh(kt.izoh ? { matn: kt.izoh, kk: Date.now() } : null);
      setK(k + 1);
      return;
    }
    if (!xatoBor.current && achMiss) achMiss.miss(screen);
    xatoBor.current = true;
    setXato({ h, kk: Date.now(), matn: kt.xato[h] });
  };
  const holatOf = (key) => {
    const i = S2_KARTA.findIndex((c) => c.keys.includes(key));
    return i >= 0 && i < k ? S2_KARTA[i].togri : null;
  };
  const ishlar = MENTOR_REJA.map((x) => ({ key: x.id, nom: tr2(x.nom), ufq: x.ufq, yorliq: x.dars ? darsT(x.dars) : null, holat: holatOf(x.id) }));
  const joriy = done ? [] : S2_KARTA[k].keys;
  const yangiK = yangi !== null ? S2_KARTA[yangi].keys : [];
  const doska = <RejaDoska ishlar={ishlar} joriy={joriy} xato={!!xato} yangi={yangiK} sarlavha={<MentorMisoli />} />;
  return <Stage eyebrow={tr2({ uz: "Tushuncha · holat", ru: "Понятие · статус" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2(DAVOM) : `${tr2({ uz: "Kartalarni belgilang", ru: "Отметьте карточки" })} (${Math.min(k, 5)}/5)`} onClick={onNext} /></>}>
      <QTushuncha
    zoom={Zoomable}
    tugadi={tugadi}
    keng
    sarlavha={tr2({ uz: <>Mentor roadmap'idagi ishlar <A>o'z vaqtida</A> tugadimi?</>, ru: <>Работы в roadmap Ментора закончились <A>вовремя?</A></> })}
    mentor={<Mentor>{done ? tr2({ uz: "Doskadagi holatlarni ko'ring va «Davom etish»ni bosing.", ru: "Посмотрите на статусы на доске и нажмите «Продолжить»." }) : tr2({ uz: "Telefondagi dalilni ko'ring va kartaga mos tugmani bosing.", ru: "Посмотрите подтверждение на телефоне и нажмите кнопку, подходящую карточке." })}</Mentor>}
    vizual={tugadi ? doska : <div className="oo-s2">
          <div className="oo-s2-tel"><S2Dalil k={Math.min(k, 4)} /></div>
          <div className="oo-s2-ong">
            {doska}
            {!done && <div className={cxx("oo-tugmalar", "oo-guruh")}>
              {HOLAT_TUGMA.map((h, i) => <QChip key={xato && xato.h === h ? `${h}-${xato.kk}` : h} holat={xato && xato.h === h ? "err" : void 0} silk={!!(xato && xato.h === h)} style={{ "--i": i }} onClick={() => bos(h)}>{tr2(HOLAT2[h].t)}</QChip>)}
            </div>}
            {xato && !done && <QXato key={xato.kk}>{tr2(xato.matn)}</QXato>}
            {izoh && <QIzoh key={izoh.kk}>{tr2(izoh.matn)}</QIzoh>}
            {!done && <NishonQatori screen={screen} />}
          </div>
        </div>}
    natija={!done && ipucha && <QIzoh>{tr2({ uz: "Telefondagi kulrang yorliqni o'qing — ish qachon ishladi?", ru: "Прочитайте серую подпись на телефоне — когда это заработало?" })}</QIzoh>}
    xulosa={done && <>{tr2({ uz: "Holat ishning rejadagi vaqtiga nisbatan qayerda ekanini ko'rsatadi: bajarildi, kechikdi yoki boshlanmadi.", ru: "Статус показывает, где работа относительно планового времени: выполнено, с опозданием или не начато." })}</>}
  />
      <MentorNote>{tr2({ uz: "Eng ko'p bahs — 4-karta: «hozir ishlayapti-ku, nega kechikdi?». Javob: holat ish o'z vaqtiga nisbatan qayerdaligini aytadi; navbat 14-darsda tugamagan, keyin ishlagan. Sinfdan so'rang: «Sizda o'z darsida tugamagan ish bormi?» — javoblar 5-ekranga olib boradi.", ru: "Больше всего споров — 4-я карточка: «сейчас же работает, почему с опозданием?». Ответ: статус говорит, где работа относительно своего времени; очередь не закончили на 14-м уроке, она заработала позже. Спросите класс: «Есть ли у вас работа, не законченная на своём уроке?» — ответы ведут к 5-му экрану." })}</MentorNote>
    </Stage>;
};
var KUTISH_YOZUVI = { uz: "O'yinlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.", ru: "Игры загружаются — это может занять до минуты." };
var MENTOR_RISKLAR = [
  {
    risk: { uz: "Render bepul xizmati uxlaydi — birinchi ochilish bir daqiqagacha.", ru: "Бесплатный сервис Render засыпает — первое открытие до минуты." },
    ufq: "hozir",
    tanlov: [
      { t: { uz: "Ilovaga kutish yozuvi qo'shish", ru: "Добавить в приложение запись ожидания" }, ok: true },
      { t: { uz: "Ilovani har kuni o'zingiz ochib turish", ru: "Каждый день самому открывать приложение" }, xato: { uz: "15 daqiqa so'rovsiz qolsa, Backend yana uxlaydi.", ru: "Если 15 минут нет запросов, Backend снова засыпает." } },
      { t: { uz: "Telegram guruhida ogohlantirish yozish", ru: "Написать предупреждение в Telegram-группе" }, xato: { uz: "Ilovani ochgan o'yinchi guruhni ko'rmasligi mumkin.", ru: "Игрок, открывший приложение, может не увидеть группу." } }
    ],
    osti: { uz: "Kutish qisqarmaydi — o'yinchi ilovani yopmaydi.", ru: "Ожидание не сокращается, но игрок не закрывает приложение." },
    yordam: { uz: "Qaysi tanlovdan keyin o'yinchi ilovani yopmaydi?", ru: "После какого выбора игрок не закроет приложение?" }
  },
  {
    risk: { uz: "12-Modulda 50 foydalanuvchi kerak, hozir 3 sinovchi.", ru: "В 12-м модуле нужно 50 пользователей, сейчас 3 тестировщика." },
    ufq: "hozir",
    tanlov: [
      { t: { uz: "12-Modul boshlanganda foydalanuvchilarni qidirib ko'rish", ru: "Поискать пользователей, когда начнётся 12-й модуль" }, xato: { uz: "Odam kech qidirilsa, 12-Modulga yetmasligi mumkin.", ru: "Если искать людей поздно, к 12-му модулю их может не хватить." } },
      { t: { uz: "Mahalla futbol guruhidan 10 kishini sinovga chaqirish", ru: "Позвать на тест 10 человек из футбольной группы махалли" }, ok: true },
      { t: { uz: "Uch sinovchidan ilovani yana bir necha marta sinashni so'rash", ru: "Попросить трёх тестировщиков проверить приложение ещё несколько раз" }, xato: { uz: "Sinovchilar soni baribir 3 ta qoladi.", ru: "Тестировщиков всё равно остаётся 3." } }
    ],
    osti: { uz: "Hali 50 emas: qadam riskni kamaytiradi, yo'qotmaydi.", ru: "Это ещё не 50: шаг уменьшает риск, но не убирает его." },
    yordam: { uz: "Qaysi tanlovdan keyin 50 ga yaqinlashadi?", ru: "После какого выбора число приблизится к 50?" }
  },
  {
    risk: { uz: "Expo Go — sinash ilovasi, hamma o'yinchida yo'q.", ru: "Expo Go — инструмент для проверки, он есть не у всех игроков." },
    ufq: "keyinroq",
    tanlov: [
      { t: { uz: "Har o'yinchiga Expo Go o'rnatishni aytish", ru: "Сказать каждому игроку установить Expo Go" }, xato: { uz: "Expo Go — sinash ilovasi, o'yinchilar uchun emas.", ru: "Expo Go — инструмент для проверки, не для игроков." } },
      { t: { uz: "Ilovani faqat o'z telefoningizda ko'rsatish", ru: "Показывать приложение только на своём телефоне" }, xato: { uz: "Unda o'yinchilarning o'zi ilovani ocholmaydi.", ru: "Тогда игроки сами не смогут открыть приложение." } },
      { t: { uz: "12-Modulda APK: Android'ga o'rnatiladigan fayl", ru: "APK в 12-м модуле: файл для установки на Android" }, ok: true }
    ],
    osti: { uz: "APK — Android uchun; iPhone yo'li alohida qaror.", ru: "APK — для Android; путь для iPhone — отдельное решение." },
    yordam: { uz: "Qaysi tanlovdan keyin ilova Expo Go'siz ochiladi?", ru: "После какого выбора приложение откроется без Expo Go?" }
  }
];
var mentorQadam = (i) => MENTOR_RISKLAR[i].tanlov.find((t) => t.ok).t;
var S3Sahna = ({ b, yechildi }) => {
  const [sek, setSek] = useState5(0);
  useEffect6(() => {
    if (b !== 0) return void 0;
    if (kamHarakat()) {
      setSek(60);
      return void 0;
    }
    setSek(0);
    let s = 0;
    const id = setInterval(() => {
      s += 3;
      setSek(Math.min(s, 60));
      if (s >= 60) clearInterval(id);
    }, yechildi ? 240 : 150);
    return () => clearInterval(id);
  }, [b, yechildi]);
  if (b === 0) {
    const keldi = sek >= 60;
    return <div className="oo-sahna">
        <span className="oo-kul oo-tel-ust">{tr2({ uz: "Render · bepul xizmat", ru: "Render · бесплатный сервис" })}</span>
        <div className="oo-sahna-q">
          <Tel k={`b0-${yechildi}`}>
            <span className="oo-te-h">{tr2({ uz: "O'yinlar", ru: "Игры" })}<em className="oo-soat">{`0:${String(Math.min(sek, 59)).padStart(2, "0")}`}</em></span>
            {keldi ? <><OyinK son="8 / 10" /><OyinK soatsiz /></> : yechildi && <p className="oo-kutish fade-step">{tr2(KUTISH_YOZUVI)}</p>}
          </Tel>
          {yechildi && <svg className="oo-odam fade-step" viewBox="-30 -96 60 100" width="64" height="106" aria-hidden="true"><Odam /></svg>}
        </div>
        <span className="oo-kul">{tr2({ uz: "tezlashtirilgan · bir daqiqagacha", ru: "ускорено · до минуты" })}</span>
      </div>;
  }
  if (b === 1) {
    return <div className="oo-sahna">
        <div className="oo-bar">
          <span className="oo-bar-t">{tr2({ uz: "Foydalanuvchilar: 3 / 50", ru: "Пользователи: 3 / 50" })}</span>
          <span className="oo-bar-y"><i className="ok" style={{ width: "6%" }} />{yechildi && <i className="taklif" style={{ width: "20%" }} />}</span>
          <span className={cxx("oo-kul", yechildi && "oo-acc")}>{yechildi ? tr2({ uz: "3 + 10 · taklif qilinadi", ru: "3 + 10 · приглашаем" }) : tr2({ uz: "12-Modul: 50 foydalanuvchi", ru: "12-й модуль: 50 пользователей" })}</span>
        </div>
        <Tel k="b1"><span className="oo-te-h">{tr2({ uz: "O'yinlar", ru: "Игры" })}</span><OyinK son="8 / 10" /></Tel>
      </div>;
  }
  return <div className="oo-sahna">
      <span className="oo-kul oo-tel-ust">{tr2({ uz: "Expo Go — sinash ilovasi", ru: "Expo Go — инструмент для проверки" })}</span>
      <div className="oo-ikki-tel">
        <Tel k="b2a"><span className="oo-expo">Expo Go</span><span className="oo-te-h">{tr2({ uz: "O'yinlar", ru: "Игры" })}</span><OyinK son="8 / 10" /></Tel>
        <Tel k="b2b" bar={false}>
          <span className="oo-ilovalar">{["#E07A5F", "#3E7CB1", "#E9A23B", "#7B61C9", "#D96C8A"].map((c, i) => <i key={i} style={{ background: c }} />)}
            {yechildi ? <i className="apk" /> : <i className="savol">?</i>}
          </span>
          {yechildi && <span className="oo-kul oo-apk-y">{tr2({ uz: "APK · 12-Modul", ru: "APK · 12-й модуль" })}</span>}
        </Tel>
      </div>
    </div>;
};
var RiskK = ({ risk, qadam, ufq, xato, osti, uch }) => <div className="oo-rk" data-uch={uch}>
    <span className="oo-kul">{tr2({ uz: "Mentor misoli", ru: "Пример Ментора" })}</span>
    <div className="oo-rk-q"><b>{tr2(RISK_T)}</b><span>{risk}</span></div>
    <div className={cxx("oo-rk-q", "qadam", !qadam && "bosh", xato && "xato", qadam && "yozildi")}><b>{tr2(QADAM_T)}</b>{qadam ? <span data-uch="s3-qadam">{qadam}</span> : <span className="oo-rk-bosh">?</span>}{ufq && <span className="oo-ufq fade-step">{ufq}</span>}</div>
    {osti && <p className="oo-rk-osti fade-step">{osti}</p>}
  </div>;
var YigQator = ({ i, uch, yangi }) => {
  const r = MENTOR_RISKLAR[i];
  return <li className={cxx("oo-yig", yangi && "yangi")} data-uch={uch}><span className="oo-yig-r">{tr2(r.risk)}</span><i aria-hidden="true">→</i><span className="oo-yig-q">{tr2(mentorQadam(i))}</span><em>{ufqQ(r.ufq)}</em></li>;
};
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext2(AchMissCtx);
  const avval = !!storedAnswer;
  const [b, setB] = useState5(avval ? 3 : 0);
  const [faza, setFaza] = useState5("tanlov");
  const [xato, setXato] = useState5(null);
  const [yordam, setYordam] = useState5([]);
  const [yangi, setYangi] = useState5(null);
  const [qIzoh, setQIzoh] = useState5(false);
  const xatoBor = useRef5(false);
  const kartaRef = useRef5(null);
  const uch = useUchish();
  const done = b >= 3;
  const tugadi = useTugadi(done, 900, avval);
  const r = MENTOR_RISKLAR[Math.min(b, 2)];
  const { live } = useJonli();
  useEffect6(() => {
    if (!done || storedAnswer !== void 0) return;
    onAnswer(screen, { stage: "risk", screenIdx: screen, correct: !xatoBor.current, picked: true, solved: true });
    if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "qadamlar", 0, !xatoBor.current, 0);
  }, [done]);
  useEffect6(() => {
    if (yangi === null) return void 0;
    const t = setTimeout(() => setYangi(null), 1200);
    return () => clearTimeout(t);
  }, [yangi]);
  useEffect6(() => {
    if (faza !== "yozildi" || b !== 2) return void 0;
    const t = setTimeout(() => keyingi(), kamHarakat() ? 600 : 3600);
    return () => clearTimeout(t);
  }, [faza, b]);
  const tanla = (t, i, e) => {
    if (faza !== "tanlov" || done) return;
    if (t.ok) {
      uch(e && e.currentTarget, "s3-qadam", 620);
      setXato(null);
      setFaza("yozildi");
      if (b === 0) setQIzoh(true);
      return;
    }
    if (!xatoBor.current && achMiss) achMiss.miss(screen);
    xatoBor.current = true;
    setXato({ i, kk: Date.now() });
    setYordam((y) => y.includes(b) ? y : [...y, b]);
  };
  const keyingi = () => {
    if (faza !== "yozildi") return;
    uch(kartaRef.current, "y-" + b, 600);
    setYangi(b);
    setB(b + 1);
    setFaza("tanlov");
    setXato(null);
    setQIzoh(false);
  };
  const yig = [...Array(Math.min(b, 3)).keys()];
  const royxat = yig.length > 0 && <ol className={cxx("oo-yig-ro", tugadi && "keng")}>{yig.map((i) => <YigQator key={i} i={i} uch={"y-" + i} yangi={yangi === i} />)}</ol>;
  const mentorT = done ? { uz: "Uch riskni o'qing va «Davom etish»ni bosing.", ru: "Прочитайте три риска и нажмите «Продолжить»." } : faza === "yozildi" && b < 2 ? { uz: "Kartadagi qatorni o'qing va «Keyingi risk ›»ni bosing.", ru: "Прочитайте строку на карточке и нажмите «Следующий риск ›»." } : { uz: "Holat o'tganini ko'rsatdi, endi oldinga qaraymiz: har sahnada mos tanlovni bosing.", ru: "Статус показал прошлое, теперь смотрим вперёд: в каждой сцене нажмите подходящий выбор." };
  return <Stage eyebrow={tr2({ uz: "Tushuncha · risk", ru: "Понятие · риск" })} screen={screen} scrollSignal={b * 2 + (faza === "yozildi" ? 1 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr2(DAVOM) : `${tr2({ uz: "Risklarni oching", ru: "Откройте риски" })} (${yig.length}/3)`} onClick={onNext} /></>}>
      <QTushuncha
    zoom={Zoomable}
    tugadi={tugadi}
    keng
    sarlavha={tr2({ uz: <>Mentor roadmap'iga nima <A>xalaqit berishi</A> mumkin?</>, ru: <>Что может <A>помешать</A> roadmap Ментора?</> })}
    mentor={<Mentor>{tr2(mentorT)}</Mentor>}
    bashorat={!tugadi && <NishonQatori screen={screen} />}
    vizual={tugadi ? <div className="oo-s3 tamom">{royxat}</div> : <div className="oo-s3">
          <S3Sahna b={Math.min(b, 2)} yechildi={faza === "yozildi"} key={"s" + Math.min(b, 2)} />
          <div className="oo-s3-ong">
            {!done && <div ref={kartaRef} key={"k" + b} className="oo-s3-k">
              <RiskK uch={"rk-" + b} risk={tr2(r.risk)} qadam={faza === "yozildi" ? tr2(mentorQadam(b)) : null} ufq={faza === "yozildi" && ufqQ(r.ufq)} xato={!!xato} osti={faza === "yozildi" && tr2(r.osti)} />
              {qIzoh && <QIzoh>{tr2({ uz: "Riskni kamaytiradigan bitta aniq ish — qadam.", ru: "Одно конкретное дело, которое уменьшает риск, — это шаг." })}</QIzoh>}
              {faza === "yozildi" && b < 2 && <QTugma className="oo-halqa oo-keyingi" onClick={keyingi}>{tr2({ uz: "Keyingi risk ›", ru: "Следующий риск ›" })}</QTugma>}
              {faza === "tanlov" && <div className="oo-s3-pastki">
                <div className="oo-tanlovlar oo-guruh" key={"t" + b + (xato ? xato.kk : "")}>
                  {r.tanlov.map((t, i) => <QChip key={i} silk={!!(xato && xato.i === i)} holat={xato && xato.i === i ? "err" : void 0} style={{ "--i": i }} onClick={(e) => tanla(t, i, e)}>{tr2(t.t)}</QChip>)}
                </div>
                {xato && <QXato key={xato.kk}>{tr2(r.tanlov[xato.i].xato)}</QXato>}
                {xato && yordam.includes(b) && <QIzoh>{tr2(r.yordam)}</QIzoh>}
              </div>}
            </div>}
            {royxat}
          </div>
        </div>}
    xulosa={tugadi && tr2({ uz: "Risk — rejaga xalaqit berishi mumkin bo'lgan narsa. Har riskka bitta qadam yoziladi.", ru: "Риск — то, что может помешать плану. На каждый риск пишут один шаг." })}
  />
      <MentorNote>{tr2({ uz: "Kutish yozuvi — 10-Moduldagi «kutish holati»ning ilovadagi ko'rinishi (o'sha modulda saytga qo'yilgan edi); o'quvchilarga shunday eslating, «holat» so'zini bu darsda ishlatmang. Kutish yozuvi Backend'ni uyg'otmaydi — o'yinchi kutishini aytadi va ilovani yopmasligiga yordam beradi. APK faqat Android uchun; iPhone yo'li 12-Modulda (dastur: «Expo Go / APK»). Hisoblagich tezlashtirilgan — real kutish bir daqiqagacha. Sinfdan so'rang: «Holat bilan riskning farqi nima?» (holat — bo'lib o'tgani, risk — oldinda bo'lishi mumkini).", ru: "Запись ожидания — это «состояние ожидания» из 10-го модуля, только в приложении (в том модуле его ставили на сайт); так и напомните ученикам, но в уроке называйте её только «запись ожидания»: «статус» здесь — статус работы. Запись ожидания не будит Backend — она говорит игроку, что надо подождать, и помогает ему не закрыть приложение. APK — только для Android; путь для iPhone — в 12-м модуле (программа: «Expo Go / APK»). Счётчик ускорен — реальное ожидание до минуты. Спросите класс: «Чем статус отличается от риска?» (статус — то, что уже было; риск — то, что может случиться впереди)." })}</MentorNote>
    </Stage>;
};
var Screen4 = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr2({ uz: "Tekshiruv · risk", ru: "Проверка · риск" })}
  questionText="Qaysi biri roadmap'ingizga risk bo'ladi?"
  question={tr2({ uz: <h2 className="title h-ask">Qaysi biri roadmap'ingizga <A>risk bo'ladi?</A></h2>, ru: <h2 className="title h-ask">Что из этого станет <A>риском</A> для вашего roadmap?</h2> })}
  options={[
    { uz: "14-darsdagi funksiya darsdan keyin tugadi", ru: "Функция 14-го урока закончилась после урока" },
    { uz: "Do'stlar sinovga yordam berishi mumkin", ru: "Друзья могут помочь с тестом" },
    { uz: "Imtihon haftasida vaqt qolmasligi mumkin", ru: "В неделю экзаменов может не остаться времени" },
    { uz: "Keyinroq ufqidagi ishlar hali boshlanmagan", ru: "Работы горизонта «позже» ещё не начаты" }
  ]}
  correctIdx={2}
  explainCorrect={{ uz: "Vaqt qolmasligi oldinda rejaga xalaqit berishi mumkin.", ru: "Нехватка времени впереди может помешать плану." }}
  explainWrong={{
    0: { uz: "Bu bo'lib o'tgan ish — uning holati: kechikdi.", ru: "Это прошедшая работа — её статус: с опозданием." },
    1: { uz: "Bu roadmap'ingizga yordam beradi — xalaqit emas.", ru: "Это помогает вашему roadmap, а не мешает." },
    3: { uz: "Ularning vaqti hali kelmagan — bu holat, risk emas.", ru: "Их время ещё не пришло — это статус, а не риск." },
    default: { uz: "Qaysi biri oldinda rejaga xalaqit berishi mumkin?", ru: "Что из этого впереди может помешать плану?" }
  }}
/>;
var VARAQ_JONLI = false;
var VARAQ_QATOR = {
  bor: { uz: "Yakkama-yakka suhbatda Mentor buni o'z ekranida ko'radi.", ru: "На встрече один на один Ментор увидит это на своём экране." },
  yoq: { uz: "Yakkama-yakkada roadmap'ingizni Mentorga o'z ekraningizda ko'rsatasiz.", ru: "На встрече один на один вы покажете Ментору свой roadmap на своём экране." }
};
var s5Xulosa = (ishlar) => {
  const son = (h) => ishlar.filter((x) => x.holat === h).length;
  const bol = HOLAT_TUGMA.map((h) => [son(h), h]).filter(([x]) => x > 0);
  const uz = bol.map(([x, h], i) => i === 0 ? `${x} ta ish ${h}` : `${x} tasi ${h}`).join(", ");
  const ru = bol.map(([x, h]) => `${HOLAT2[h].ch.ru} — ${x}`).join(", ");
  return tr2({ uz: `Roadmap'ingizda: ${uz}.`, ru: `В вашем roadmap: ${ru}.` });
};
var Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const [manba] = useState5(talabaIshlar);
  const formRejim = manba.manba !== "roadmap";
  const [yozma, setYozma] = useState5(() => manba.manba === "yozma" ? manba.ishlar : []);
  const [holat, setHolat] = useState5(() => qoralama().holat || {});
  const [tahrir, setTahrir] = useState5(null);
  const [yangi, setYangi] = useState5(null);
  const [izoh, setIzoh] = useState5(null);
  const [nom, setNom] = useState5("");
  const [ufq, setUfq] = useState5(null);
  const [fxato, setFxato] = useState5(null);
  const kartaRef = useRef5(null);
  const uch = useUchish();
  const baza = formRejim ? yozma : manba.ishlar;
  const ishlar = baza.map((x) => ({ ...x, holat: holat[x.key] || null }));
  const N = ishlar.length;
  const n = ishlar.filter((x) => x.holat).length;
  const done = N > 0 && n === N && tahrir === null && (!formRejim || N >= 3 && ishlar.some((x) => x.ufq === "hozir"));
  const joriy = tahrir !== null ? ishlar.find((x) => x.key === tahrir) : ishlar.find((x) => !x.holat);
  useEffect6(() => {
    if (yangi === null) return void 0;
    const t = setTimeout(() => setYangi(null), 1200);
    return () => clearTimeout(t);
  }, [yangi]);
  useEffect6(() => {
    if (!izoh) return void 0;
    const t = setTimeout(() => setIzoh(null), 4500);
    return () => clearTimeout(t);
  }, [izoh]);
  useEffect6(() => {
    if (!done || storedAnswer !== void 0) return;
    const c = (h) => Math.min(9, ishlar.filter((x) => x.holat === h).length);
    onAnswer(screen, { stage: "holat", screenIdx: screen, practice: "holat", correct: true, picked: true, solved: true });
    if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "practice", c("bajarildi") * 100 + c("kechikdi") * 10 + c("boshlanmadi"), true, 0);
  }, [done]);
  const qoy = (h) => {
    if (!joriy || isMentor) return;
    const yh = { ...holat, [joriy.key]: h };
    uch(kartaRef.current, "k-" + joriy.key, 620);
    setHolat(yh);
    qoralamaYoz({ holat: yh });
    setYangi(joriy.key);
    setTahrir(null);
    setIzoh(h === "boshlanmadi" && joriy.ufq === "hozir" && joriy.dars ? { kk: Date.now() } : null);
  };
  const qosh = () => {
    if (!nom.trim()) {
      setFxato({ kk: Date.now() });
      return;
    }
    if (!ufq) {
      setFxato({ kk: Date.now(), ufq: true });
      const b = document.querySelector(".oo-forma .oo-tugmalar .q-chip");
      if (b) b.focus();
      return;
    }
    if (yozma.length >= 8) return;
    const ro = [...yozma, { key: "y" + Date.now().toString(36), nom: nom.trim(), ufq }];
    setYozma(ro);
    qoralamaYoz({ ishlar: ro });
    setNom("");
    setUfq(null);
    setFxato(null);
  };
  const qaytaT = joriy && joriy.key === "sinov" && joriy.qayta === "toxtamadi" ? { uz: "13-darsda: qayta sinovda takrorlanmadi", ru: "На 13-м уроке: при повторном тесте не повторилось" } : joriy && joriy.key === "sinov" && joriy.qayta === "toxtadi" ? { uz: "13-darsda: qayta sinovda yana to'xtadi", ru: "На 13-м уроке: при повторном тесте снова остановился" } : null;
  const katta = joriy && !isMentor && <div className="oo-katta fade-up" ref={kartaRef} key={joriy.key}>
      <div className="oo-katta-bosh"><b className="oo-katta-nom">{joriy.nom}</b><span className="oo-kul">{tr2(UFQLAR.find((u) => u.id === joriy.ufq).t)}{joriy.yorliq ? ` · ${joriy.yorliq}` : ""}</span></div>
      {qaytaT && <p className="oo-kul-q">{tr2(qaytaT)}</p>}
      <div className={cxx("oo-tugmalar", joriy.ufq === "hozir" && "oo-guruh")}>
        {HOLAT_TUGMA.map((h, i) => <QChip key={h} className={joriy.ufq !== "hozir" && h === "boshlanmadi" ? "oo-halqa" : void 0} holat={joriy.holat === h ? "on" : void 0} style={{ "--i": i }} onClick={() => qoy(h)}>{tr2(HOLAT2[h].t)}</QChip>)}
      </div>
    </div>;
  const forma = formRejim && !isMentor && !joriy && yozma.length < 8 && <div className={cxx("oo-katta", "oo-forma", done && "ixcham")}>
      {!done && <p className="oo-kul-q">{tr2({ uz: "Roadmap topilmadi — ishlaringizni yozing.", ru: "Roadmap не найден — напишите свои работы." })}</p>}
      <div className="oo-forma-q">
        <input className={cxx("oo-inp", !nom.trim() && "oo-halqa-i")} value={nom} placeholder={tr2({ uz: "Ish nomi", ru: "Название работы" })} aria-label={tr2({ uz: "Ish nomi", ru: "Название работы" })} onChange={(e) => {
    setNom(e.target.value);
    setFxato(null);
  }} onKeyDown={(e) => {
    if (e.key === "Enter") qosh();
  }} />
        <div className={cxx("oo-tugmalar", nom.trim() && !ufq && "oo-guruh")}>{UFQLAR.map((u) => <QChip key={u.id} holat={ufq === u.id ? "on" : void 0} onClick={() => {
    setUfq(u.id);
    if (fxato && fxato.ufq) setFxato(null);
  }}>{tr2(u.t)}</QChip>)}</div>
        <QTugma className={halqa(!!(nom.trim() && ufq))} onClick={qosh}>{tr2({ uz: "Qo'shish", ru: "Добавить" })}</QTugma>
      </div>
      {fxato && <QXato key={fxato.kk}>{fxato.ufq ? tr2({ uz: "Ufqni tanlang.", ru: "Выберите горизонт." }) : tr2({ uz: "Ish nomini yozing.", ru: "Напишите название работы." })}</QXato>}
    </div>;
  const mentorT = done ? { uz: "Holatlarni ko'ring: o'zgarsa — ✎, keyin «Davom etish»ni bosing.", ru: "Посмотрите статусы: если что-то изменилось — ✎, потом нажмите «Продолжить»." } : formRejim && !joriy ? { uz: "Ishni yozing, ufqini tanlang va «Qo'shish»ni bosing.", ru: "Напишите работу, выберите горизонт и нажмите «Добавить»." } : { uz: "Ish o'z vaqtida tugadimi — ilovangizda tekshirib, bitta tugmani bosing.", ru: "Закончилась ли работа вовремя — проверьте в своём приложении и нажмите одну кнопку." };
  return <Stage eyebrow={tr2({ uz: "Mustaqil ish · holat", ru: "Самостоятельная работа · статус" })} screen={screen} scrollSignal={n + yozma.length} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr2(DAVOM) : `${tr2({ uz: "Har ishga holat qo'ying", ru: "Поставьте статус каждой работе" })}${N ? ` (${n}/${N})` : ""}`} onClick={onNext} /></>}>
      <QMustaqil
    sarlavha={tr2({ uz: <>Roadmap'ingizdagi har ishga <A>holat</A> qo'ying.</>, ru: <>Поставьте <A>статус</A> каждой работе в roadmap.</> })}
    mentor={<Mentor>{tr2(mentorT)}</Mentor>}
    qadamlar={isMentor ? <MentorRoyxat screen={screen} yorliq={{ uz: "Holat qo'yganlar", ru: "Поставили статусы" }} qator={(r) => r ? <span className="oo-mr-ch">{[Math.floor(r.picked / 100), Math.floor(r.picked / 10) % 10, r.picked % 10].map((v, i) => <span key={i} className={cxx("rd-chip", HOLAT_TUGMA[i])}>{i === 0 ? "✓" : tr2(HOLAT2[HOLAT_TUGMA[i]].ch)} {v}</span>)}</span> : <span className="oo-mr-y">—</span>} /> : isStudent && jonliDars(live) && <p className="oo-kul-q">{tr2(VARAQ_JONLI ? VARAQ_QATOR.bor : VARAQ_QATOR.yoq)}</p>}
    forma={isMentor ? null : katta || forma}
  >
        {isMentor ? <RejaDoska ishlar={mentorIshlar(true)} sarlavha={<MentorMisoli />} /> : N > 0 && <RejaDoska ishlar={ishlar} sarlavha={tr2(ROADMAPIM)} joriy={joriy ? [joriy.key] : []} yangi={yangi ? [yangi] : []} onIsh={done ? (x) => setTahrir(x.key) : void 0} />}
        {izoh && !isMentor && <QIzoh key={izoh.kk}>{tr2({ uz: "Darsi o'tgan, lekin boshlanmagan ish — Mentorga shuni ayting.", ru: "Урок прошёл, а работа не начата — скажите об этом Ментору." })}</QIzoh>}
        {done && !isMentor && <QXulosa>{s5Xulosa(ishlar)}</QXulosa>}
        <MentorNote>{tr2({ uz: "«Bajarildi» sharti — ish o'quvchining telefonida (yoki brauzerida) hozir ishlaydi va rejadagi vaqtida (hozir ufqida — o'z darsida) tugagan. Kechikkan ish uyalish emas: yakkama-yakkada «nima to'xtatdi?» deb so'rang. O'quvchi roadmap'idagi ish nomlari 6-darsdagidek; bu ekranda nom o'zgartirilmaydi (holat qo'yiladi).", ru: "Условие «выполнено» — работа сейчас работает на телефоне (или в браузере) ученика и закончилась в плановое время (для горизонта «сейчас» — на своём уроке). Опоздание — не стыд: на встрече один на один спросите «что остановило?». Названия работ — как на 6-м уроке; на этом экране их не меняют (ставят статус)." })}</MentorNote>
      </QMustaqil>
    </Stage>;
};
var TUTUQ_RE = new RegExp("[" + String.fromCharCode(699, 700, 8216, 8217, 96) + "]", "g");
var normYoz = (s) => String(s || "").toLowerCase().replace(TUTUQ_RE, "'").replace(/[.,!?;:«»"]+/g, " ").replace(/\s+/g, " ").trim();
var OTGAN_SOZ = ["kechikdi", "ishlamadi", "bo'lmadi", "ulgurmadim", "qilmadim", "опоздал", "не работал", "не получилось", "не успел", "не сделал"];
var UMUMIY_SOZ = ["harakat qilaman", "ehtiyot bo'laman", "e'tibor beraman", "yaxshilayman", "o'ylab ko'raman", "tezroq ishlayman", "ko'proq ishlayman", "буду стараться", "постараюсь", "буду внимательн", "буду осторожн", "улучшу", "подумаю", "буду работать быстрее", "буду больше работать"];
var tekshirRisk = (risk, qadam, royxat, tahrir) => {
  if (!String(risk || "").trim() || !String(qadam || "").trim()) return { tur: "bosh", q: true, k: !String(risk || "").trim() ? "risk" : "qadam" };
  const nr = normYoz(risk), nq = normYoz(qadam);
  if (OTGAN_SOZ.some((w) => nr.includes(w))) return { tur: "otgan", k: "risk" };
  if (UMUMIY_SOZ.some((w) => nq.includes(w))) return { tur: "umumiy", k: "qadam" };
  if (royxat.some((o, i) => i !== tahrir && normYoz(o.risk) === nr)) return { tur: "takror", k: "risk" };
  return null;
};
var XABAR6 = {
  bosh: { uz: "Risk va qadamni ham yozing.", ru: "Напишите и риск, и шаг." },
  otgan: { uz: "Bu bo'lib o'tgan ish. Oldinda nima xalaqit berishi mumkin?", ru: "Это прошедшая работа. Что может помешать впереди?" },
  umumiy: { uz: "Bu hali qadam emas: aynan nima qilasiz?", ru: "Это ещё не шаг: что именно вы сделаете?" },
  takror: { uz: "Bu risk yozilgan — boshqasini toping.", ru: "Этот риск уже записан — найдите другой." }
};
var QOLDIR6 = { uz: "Shunday qoldirsangiz — yana «Saqlash»ni bosing.", ru: "Если оставить так — снова нажмите «Сохранить»." };
var PH6 = { risk: { uz: "Rejaga nima xalaqit berishi mumkin?", ru: "Что может помешать плану?" }, qadam: { uz: "Uni kamaytiradigan bitta ish", ru: "Одно дело, которое его уменьшит" } };
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [d0] = useState5(qoralama);
  const [royxat, setRoyxat] = useState5(() => Array.isArray(d0.risklar) ? d0.risklar.filter((x) => x && x.risk && x.qadam).slice(0, 3) : []);
  const [eng, setEng] = useState5(Number.isInteger(d0.eng) ? d0.eng : null);
  const [joriy, setJoriy] = useState5({ risk: "", qadam: "" });
  const [tahrir, setTahrir] = useState5(null);
  const [tg, setTg] = useState5(null);
  const [xato, setXato] = useState5(null);
  const [yordam, setYordam] = useState5(false);
  const [yangi, setYangi] = useState5(null);
  const [kartaK, setKartaK] = useState5(0);
  const kartaRef = useRef5(null);
  const uch = useUchish();
  const [ish] = useState5(() => holatli(talabaIshlar().ishlar, qoralama()));
  const [sv] = useState5(sinovLs);
  const n = royxat.length;
  const done = n >= 3 && tahrir === null;
  const g = tahrir !== null ? tg : joriy;
  const setG = (f) => tahrir !== null ? setTg((o) => ({ ...o, ...f })) : setJoriy((o) => ({ ...o, ...f }));
  useEffect6(() => {
    if (yangi === null) return void 0;
    const t = setTimeout(() => setYangi(null), 1300);
    return () => clearTimeout(t);
  }, [yangi]);
  useEffect6(() => {
    if (n < 3 || storedAnswer !== void 0) return;
    onAnswer(screen, { stage: "risklar", screenIdx: screen, practice: "risklar", correct: true, picked: true, solved: true });
    if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "practice", 3, true, 0);
  }, [n]);
  const saqla = () => {
    if (!g) return;
    const t = tekshirRisk(g.risk, g.qadam, royxat, tahrir);
    const imzo = t && `${t.tur}|${normYoz(g.risk)}|${normYoz(g.qadam)}`;
    if (t && (t.q || !(xato && xato.imzo === imzo))) {
      setXato({ ...t, imzo, kk: Date.now() });
      return;
    }
    setXato(null);
    const yr = { risk: g.risk.trim(), qadam: g.qadam.trim() };
    const idx = tahrir !== null ? tahrir : royxat.length;
    const ro = tahrir !== null ? royxat.map((o, i) => i === tahrir ? yr : o) : [...royxat, yr];
    uch(kartaRef.current, "r6-" + idx, 620);
    setRoyxat(ro);
    qoralamaYoz({ risklar: ro });
    setYangi(idx);
    if (tahrir !== null) {
      setTahrir(null);
      setTg(null);
    } else setJoriy({ risk: "", qadam: "" });
    setYordam(false);
    setKartaK((k) => k + 1);
  };
  const ochTahrir = (i) => {
    if (isMentor) return;
    setTahrir(i);
    setTg({ ...royxat[i] });
    setXato(null);
    setKartaK((k) => k + 1);
  };
  const belgila = (i) => {
    if (isMentor) return;
    setEng(i);
    qoralamaYoz({ eng: i });
    const rj = rejaLs();
    if (rj) lsSet(REJA_KEY, { ...rj, eng: i, savedAt: Date.now() });
  };
  const kech = ish.filter((x) => x.holat === "kechikdi")[0];
  const sinovN = sv && Array.isArray(sv.bajardi) ? sv.bajardi.length : 0;
  const yord = [
    kech && { uz: `Kechikkan ish: ${kech.nom}. Shu sabab yana takrorlanishi mumkinmi?`, ru: `Работа с опозданием: ${kech.nom}. Может ли эта причина повториться?` },
    sinovN > 0 && (sv.tur === "mashq" ? { uz: `Mashq sinovida ${sinovN} kishi qatnashdi.`, ru: `В учебном тесте участвовали: ${sinovN}.` } : { uz: `Sinovda ${sinovN} kishi qatnashdi.`, ru: `В тесте участвовали: ${sinovN}.` })
  ].filter(Boolean);
  const yordamT = trekWeb() ? { uz: "Uch joyga qarang: texnika (Backend, saytni ochish), odamlar (foydalanuvchilar soni) va vaqt (imtihon, ulgurish) — keyin kechikkan ishingizni eslang.", ru: "Посмотрите с трёх сторон: техника (Backend, открытие сайта), люди (число пользователей) и время (экзамены, успеть) — потом вспомните свою работу с опозданием." } : { uz: "Uch joyga qarang: texnika (Backend, ilovani ochish), odamlar (foydalanuvchilar soni) va vaqt (imtihon, ulgurish) — keyin kechikkan ishingizni eslang.", ru: "Посмотрите с трёх сторон: техника (Backend, открытие приложения), люди (число пользователей) и время (экзамены, успеть) — потом вспомните свою работу с опозданием." };
  const toliq = !!(g && g.risk.trim() && g.qadam.trim());
  const qatorI = (k) => {
    const xq = xato && xato.k === k;
    const birinchiBosh = g && !g.risk.trim() ? "risk" : g && !g.qadam.trim() ? "qadam" : null;
    return <div className={cxx("oo-rq", xq && "xato")}>
        <label className="oo-rq-l" htmlFor={"r6-" + k}>{tr2(k === "risk" ? RISK_T : QADAM_T)}</label>
        <input id={"r6-" + k} className={cxx("oo-inp", birinchiBosh === k && "oo-halqa-i")} value={g ? g[k] : ""} placeholder={tr2(PH6[k])} onChange={(e) => {
      setG({ [k]: e.target.value });
      if (xato && xato.k === k && xato.q) setXato(null);
    }} onKeyDown={(e) => {
      if (e.key === "Enter") saqla();
    }} />
        {xq && <div className="oo-rq-x"><QXato>{tr2(XABAR6[xato.tur])}</QXato>{!xato.q && <QIzoh>{tr2(QOLDIR6)}</QIzoh>}</div>}
      </div>;
  };
  const roy = n > 0 && <div className={cxx("oo-risklarim", done && "keng")}>
      <div className="oo-risklarim-h"><span className="oo-yorliq">{tr2({ uz: "Risklarim", ru: "Мои риски" })}</span></div>
      {done && <p className="oo-kul-q">{tr2({ uz: "Qaysi risk eng katta? — bitta qatorni bosing.", ru: "Какой риск самый большой? — нажмите одну строку." })}</p>}
      <ol className="oo-r6-ro">
        {royxat.map((o, i) => <li key={i} className={cxx("oo-r6", yangi === i && "yangi", tahrir === i && "joriy", eng === i && done && "eng")} data-uch={"r6-" + i}>
            {done ? <button type="button" className={cxx("oo-yulduz", eng === null && i === 0 && "oo-halqa")} onClick={() => belgila(i)}><i aria-hidden="true">{eng === i ? "★" : "☆"}</i><span className="oo-r6-r">{o.risk}</span><b aria-hidden="true">→</b><span className="oo-r6-q">{o.qadam}</span></button> : <span className="oo-r6-b"><span className="oo-r6-r">{qisqa(o.risk, 30)}</span><b aria-hidden="true">→</b><span className="oo-r6-q">{qisqa(o.qadam, 30)}</span></span>}
            {!isMentor && <button type="button" className="rd-ed" aria-label="✎" onClick={() => ochTahrir(i)}>✎</button>}
          </li>)}
      </ol>
    </div>;
  return <Stage eyebrow={tr2({ uz: "Mustaqil ish · risk", ru: "Самостоятельная работа · риск" })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr2(DAVOM) : __lang === "ru" ? `Напишите ещё ${3 - n} ${3 - n === 1 ? "риск" : "риска"}` : `Yana ${3 - n} ta risk yozing`} onClick={onNext} /></>}>
      <QMustaqil
    sarlavha={tr2({ uz: <>Roadmap'ingiz uchun <A>uchta risk</A> yozing.</>, ru: <>Напишите <A>три риска</A> для своего roadmap.</> })}
    mentor={<Mentor>{tr2(done ? { uz: "Eng katta riskni ★ bilan belgilang, keyin «Davom etish»ni bosing.", ru: "Отметьте самый большой риск ★, потом нажмите «Продолжить»." } : { uz: "Avval riskni, keyin unga bitta aniq qadamni yozing.", ru: "Сначала напишите риск, потом один конкретный шаг к нему." })}</Mentor>}
    qadamlar={isMentor ? <MentorRoyxat screen={screen} yorliq={{ uz: "Uch risk yozganlar", ru: "Написали три риска" }} qator={(r) => <span className={cxx("oo-mr-y", r && "ok")}>{r ? tr2({ uz: "Risklar 3/3 ✓", ru: "Риски 3/3 ✓" }) : tr2({ uz: "Risklar —", ru: "Риски —" })}</span>} /> : <>{ish.length > 0 && <RejaDoska kor="ixcham" ishlar={ish} sarlavha={tr2(ROADMAPIM)} />}{roy}</>}
    forma={!isMentor && !done && <div className="oo-katta fade-up" key={kartaK} ref={kartaRef}>
          <div className="oo-katta-bosh"><b className="oo-katta-nom">{tr2(RISK_T)} {(tahrir !== null ? tahrir : n) + 1}</b></div>
          {yord.length > 0 && <div className="oo-yord">{yord.map((t, i) => <p key={i} className="oo-kul-q">{tr2(t)}</p>)}</div>}
          {qatorI("risk")}
          {qatorI("qadam")}
          <div className="oo-amal">
            <QTugma ikkinchi onClick={() => setYordam((o) => !o)}>{tr2(YORDAM_T)}</QTugma>
            <QTugma className={halqa(toliq)} onClick={saqla}>{tr2(SAQLASH)}</QTugma>
          </div>
          {yordam && <QIzoh>{tr2(yordamT)}</QIzoh>}
        </div>}
  >
        {done && !isMentor && <QXulosa>{tr2({ uz: "Uch riskka uchta qadam yozildi: har biri — bitta aniq ish.", ru: "На три риска написаны три шага: каждый — одно конкретное дело." })}</QXulosa>}
        <MentorNote>{tr2({ uz: "Yakkama-yakka shu ekrandan keyin boshlanadi. Uch riskni yozgan o'quvchini chaqiring (≈ 3–4 daqiqa; qolganlar 6–7-ekranlarda ishlaydi). Uch savol: 1) Qaysi ish kechikdi va nega? 2) Uch riskdan qaysi biri eng katta? 3) Birinchi qadam qachon va qanday bajariladi? — 2 va 3-javobni o'quvchi ★ va «Avval» bilan belgilaydi. Vaqt: 12 kishigacha ≈ 4 daqiqa; 13–15 kishi bo'lsa — 3 daqiqa taymer bilan yoki ikki aylanishda (avval 2 va 3-savol, keyin 1-savol). Qadam umumiy bo'lsa («harakat qilaman»), «aynan nima qilasiz?» deb aniqlashtiring. Mentor misolidagi uch risk — Backend, foydalanuvchilar, ilovani ochish; uni o'quvchiga «to'g'ri javob» qilib bermang — uning mahsuloti boshqa.", ru: "Встречи один на один начинаются после этого экрана. Зовите ученика, который написал три риска (≈ 3–4 минуты; остальные работают на 6–7-м экранах). Три вопроса: 1) Какая работа опоздала и почему? 2) Какой из трёх рисков самый большой? 3) Когда и как будет сделан первый шаг? — ответы 2 и 3 ученик отмечает ★ и «Сначала». Время: до 12 человек ≈ 4 минуты; если 13–15 — 3 минуты с таймером или в два круга (сначала вопросы 2 и 3, потом 1). Если шаг общий («буду стараться»), уточните: «что именно сделаете?». Три риска из примера Ментора — Backend, пользователи, открытие приложения; не давайте их ученику как «правильный ответ» — у него другой продукт." })}</MentorNote>
      </QMustaqil>
    </Stage>;
};
var s7Xulosa = (risklar, ufqlar, birinchi) => {
  const bi = birinchiI(risklar, ufqlar, birinchi);
  if (bi < 0) return "";
  const q = nuqtasiz(risklar[bi].qadam);
  const a = ufqlar.filter((u, i) => u === "hozir" && risklar[i]).length;
  return a > 0 ? tr2({ uz: `Tuzatilgan rejangizda ${a} ta qadam hozir ufqida. Birinchisi: ${q}.`, ru: `В исправленном плане шагов в горизонте «сейчас»: ${a}. Первый: ${q}.` }) : tr2({ uz: `Qadamlaringiz keyingi ufqlarda. Birinchisi: ${q}.`, ru: `Ваши шаги — в следующих горизонтах. Первый: ${q}.` });
};
var Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const [d0] = useState5(qoralama);
  const [ishBaza] = useState5(() => talabaIshlar().ishlar || []);
  const ishlar = holatli(ishBaza, d0);
  const [risklar, setRisklar] = useState5(() => Array.isArray(d0.risklar) ? d0.risklar.filter((x) => x && x.risk && x.qadam).slice(0, 3) : []);
  const [ufqlar, setUfqlar] = useState5(() => {
    const u = Array.isArray(d0.ufqlar) ? d0.ufqlar : [];
    return [0, 1, 2].map((i) => u[i] || null);
  });
  const [birinchi, setBirinchi] = useState5(Number.isInteger(d0.birinchi) ? d0.birinchi : null);
  const [tahrir, setTahrir] = useState5(null);
  const [tMatn, setTMatn] = useState5("");
  const [saqlandi, setSaqlandi] = useState5(() => !!rejaLs());
  const [ozgardi, setOzgardi] = useState5(false);
  const [yangi, setYangi] = useState5(null);
  const [izoh, setIzoh] = useState5(false);
  const kartaRef = useRef5(null);
  const uch = useUchish();
  const R = risklar.length;
  const joylandi = [0, 1, 2].filter((i) => i < R && ufqlar[i]).length;
  const hammasi = R >= 3 && joylandi >= 3;
  const joriyI = tahrir !== null ? tahrir : [0, 1, 2].find((i) => i < R && !ufqlar[i]);
  const done = hammasi && saqlandi && tahrir === null;
  useEffect6(() => {
    if (yangi === null) return void 0;
    const t = setTimeout(() => setYangi(null), 1300);
    return () => clearTimeout(t);
  }, [yangi]);
  const ufqQoy = (u) => {
    if (joriyI === void 0 || isMentor) return;
    const yu = ufqlar.map((x, i) => i === joriyI ? u : x);
    const yr = tahrir !== null && tMatn.trim() ? risklar.map((x, i) => i === joriyI ? { ...x, qadam: tMatn.trim() } : x) : risklar;
    uch(kartaRef.current, "q-" + joriyI, 640);
    setUfqlar(yu);
    setRisklar(yr);
    qoralamaYoz({ ufqlar: yu, risklar: yr });
    setYangi(joriyI);
    setTahrir(null);
    if (saqlandi) setOzgardi(true);
    if (!hammasi && R >= 3 && yu.filter(Boolean).length >= 3) setIzoh(true);
  };
  const avvalBos = (q) => {
    if (!hammasi || isMentor) return;
    setBirinchi(q.idx);
    qoralamaYoz({ birinchi: q.idx });
    if (saqlandi) setOzgardi(true);
  };
  const ochTahrir = (q) => {
    if (isMentor) return;
    setTahrir(q.idx);
    setTMatn(risklar[q.idx].qadam);
  };
  const saqla = () => {
    if (!hammasi) return;
    rejaYoz(ishBaza, { ...qoralama(), risklar, ufqlar, birinchi });
    setSaqlandi(true);
    setOzgardi(false);
    if (storedAnswer === void 0) {
      onAnswer(screen, { stage: "reja", screenIdx: screen, practice: "reja", correct: true, picked: true, solved: true });
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_BASE + screen, "practice", ufqlar.filter((x) => x === "hozir").length, true, 0);
    }
  };
  const qadamlar = [0, 1, 2].filter((i) => i < R && ufqlar[i] && i !== tahrir).map((i) => ({ key: String(i), idx: i, matn: risklar[i].qadam, risk: `${tr2(RISK_T)}: ${qisqa(risklar[i].risk, 44)}`, ufq: ufqlar[i] }));
  const katta = !isMentor && joriyI !== void 0 && R > 0 && <div className="oo-katta fade-up" ref={kartaRef} key={"q" + joriyI + (tahrir !== null ? "t" : "")}>
      {tahrir !== null ? <input className="oo-inp" value={tMatn} aria-label={tr2(QADAM_T)} onChange={(e) => setTMatn(e.target.value)} /> : <b className="oo-katta-nom">{risklar[joriyI].qadam}</b>}
      <span className="oo-kul">{tr2(RISK_T)}: {risklar[joriyI].risk}</span>
      <div className="oo-tugmalar oo-guruh">{UFQLAR.map((u, i) => <QChip key={u.id} holat={ufqlar[joriyI] === u.id ? "on" : void 0} style={{ "--i": i }} onClick={() => ufqQoy(u.id)}>{tr2(u.t)}</QChip>)}</div>
    </div>;
  const kam = !isMentor && R < 3 && <p className="oo-kul-q">{tr2({ uz: "Avval uchta risk yozing — «Orqaga»ni bosing.", ru: "Сначала напишите три риска — нажмите «Назад»." })}</p>;
  const mentorT = !hammasi ? { uz: "Qadam qachon boshlana oladi — o'sha ufqni bosing.", ru: "Когда шаг сможет начаться — нажмите этот горизонт." } : !saqlandi ? { uz: "Boshlaydigan qadamingizni bosing, keyin «Saqlash»ni bosing.", ru: "Нажмите шаг, с которого начнёте, потом нажмите «Сохранить»." } : { uz: "Reja saqlandi — «Davom etish»ni bosing.", ru: "План сохранён — нажмите «Продолжить»." };
  return <Stage eyebrow={tr2({ uz: "Mustaqil ish · reja", ru: "Самостоятельная работа · план" })} screen={screen} scrollSignal={joylandi + (saqlandi ? 4 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr2(DAVOM) : hammasi ? tr2({ uz: "Tuzatilgan rejani saqlang", ru: "Сохраните исправленный план" }) : `${tr2({ uz: "Qadamlarni ufqqa qo'ying", ru: "Поставьте шаги в горизонты" })} (${joylandi}/3)`} onClick={onNext} /></>}>
      <QMustaqil
    sarlavha={tr2({ uz: <>Har qadamni roadmap'ingizdagi <A>ufqqa</A> qo'ying.</>, ru: <>Поставьте каждый шаг в <A>горизонт</A> roadmap.</> })}
    mentor={<Mentor>{tr2(mentorT)}</Mentor>}
    qadamlar={isMentor && <MentorRoyxat screen={screen} yorliq={{ uz: "Tuzatilgan rejani saqlaganlar", ru: "Сохранили исправленный план" }} qator={(r) => <span className={cxx("oo-mr-y", r && "ok")}>{r ? tr2({ uz: "Reja saqlandi ✓", ru: "План сохранён ✓" }) : "—"}</span>} />}
    forma={isMentor ? null : katta || kam}
  >
        {isMentor ? <RejaDoska ishlar={mentorIshlar(true)} qadamlar={MENTOR_RISKLAR.map((r, i) => ({ key: "m" + i, idx: i, matn: tr2(mentorQadam(i)), risk: `${tr2(RISK_T)}: ${qisqa(tr2(r.risk), 44)}`, ufq: r.ufq }))} avval={0} sarlavha={tr2(TUZATILGAN)} /> : <RejaDoska
    ishlar={ishlar}
    qadamlar={qadamlar}
    sarlavha={tr2(hammasi ? TUZATILGAN : ROADMAPIM)}
    sarKalit={hammasi ? "t" : "r"}
    yonadi={izoh}
    son={hammasi && tahrir === null && <span className="oo-s7-h fade-step"><span className="oo-kul">{tr2({ uz: "Qaysi qadamdan boshlaysiz? — bitta qadam kartasini bosing.", ru: "С какого шага начнёте? — нажмите одну карточку шага." })}</span>
              <QTugma className={halqa(!saqlandi || ozgardi)} disabled={saqlandi && !ozgardi} onClick={saqla}>{tr2(saqlandi ? { uz: "Yangilash", ru: "Обновить" } : SAQLASH)}</QTugma></span>}
    yangi={yangi !== null ? ["q-" + yangi] : []}
    avval={hammasi ? birinchi : null}
    onQadam={hammasi ? avvalBos : void 0}
    onQadamEd={ochTahrir}
  />}
        {!isMentor && izoh && !saqlandi && <QIzoh>{tr2({ uz: "Holatlar va risklarga qarshi qadamlar qo'shilgan roadmap — tuzatilgan reja.", ru: "Roadmap со статусами и шагами против рисков — это исправленный план." })}</QIzoh>}
        {!isMentor && isStudent && jonliDars(live) && <p className="oo-kul-q">{tr2({ uz: "Mentor chaqirganda roadmap'ingizni ko'rsating; o'zgarsa — ✎ bilan o'zgartiring.", ru: "Когда Ментор позовёт, покажите свой roadmap; если что-то поменялось — измените через ✎." })}</p>}
        {!isMentor && done && <div className="oo-s7-x"><QXulosa>{s7Xulosa(risklar, ufqlar, birinchi)}</QXulosa></div>}
        <MentorNote>{tr2({ uz: "Ufq qoidasi 6-Moduldan: ishni ufqqa u qachon boshlana olishi qo'yadi. Mentor misolida: kutish yozuvi va 10 kishini chaqirish — hozir, APK — keyinroq (12-Modul). Hamma qadami «uzoqroq»da bo'lgan o'quvchidan so'rang: «Bu risk bitiruvgacha xalaqit bermaydimi?».", ru: "Правило горизонта из 6-го модуля: работу в горизонт ставит то, когда она сможет начаться. В примере Ментора: запись ожидания и приглашение 10 человек — «сейчас», APK — «позже» (12-й модуль). Ученика, у которого все шаги «дальше», спросите: «Этот риск не помешает до выпуска?»." })}</MentorNote>
      </QMustaqil>
    </Stage>;
};
var Screen8 = (props) => <QuestionScreen
  {...props}
  scope="final"
  eyebrow={tr2({ uz: "Yakuniy tekshiruv", ru: "Итоговая проверка" })}
  questionText="Riskka qadam yozdingiz. Endi u qayerda turadi?"
  question={tr2({ uz: <h2 className="title h-ask">Riskka qadam yozdingiz. Endi u <A>qayerda turadi?</A></h2>, ru: <h2 className="title h-ask">Вы написали шаг к риску. <A>Где он теперь?</A></h2> })}
  options={[
    { uz: "Alohida varaqda — roadmap'dan tashqarida", ru: "На отдельном листе — вне roadmap" },
    { uz: "Roadmap'da — o'z ufqida, ishlar qatorida", ru: "В roadmap — в своём горизонте, рядом с работами" },
    { uz: "Faqat Mentorning ekranida — sizda saqlanmaydi", ru: "Только на экране Ментора — у вас не хранится" },
    { uz: "Risk kartasining ichida — ufqi tanlanmaydi", ru: "Внутри карточки риска — горизонт не выбирается" }
  ]}
  correctIdx={1}
  explainCorrect={{ uz: "Qadam o'z ufqiga yoziladi — reja shunday tuzatiladi.", ru: "Шаг записывают в свой горизонт — так план исправляется." }}
  explainWrong={{
    0: { uz: "Roadmap'dan tashqaridagi qadam unutilishi mumkin.", ru: "Шаг вне roadmap могут забыть." },
    2: { uz: "Roadmap sizniki: u sizda ham saqlanadi.", ru: "Roadmap ваш: он хранится и у вас." },
    3: { uz: "Ufqsiz qadam roadmap'da ko'rinmaydi — qachon qilinadi?", ru: "Шага без горизонта не видно в roadmap — когда его делать?" },
    default: { uz: "Tuzatilgan rejada nima turadi — shuni eslang.", ru: "Вспомните, что стоит в исправленном плане." }
  }}
  vizual={<RejaDoska kor="kichik" faqat={["hozir"]} className="oo-s8" ishlar={mentorIshlar(true)} qadamlar={[{ key: "m1", idx: 0, matn: tr2(mentorQadam(0)), ufq: "hozir", tush: true }]} />}
/>;
var ACHIEVEMENTS = {
  statusCheck: { icon: "🧭", name: "Status Check!", desc: { uz: "Mentor roadmap'idagi ishlarga holatni birinchi urinishda to'g'ri qo'ydingiz", ru: "С первой попытки верно поставили статусы работам в roadmap Ментора" } },
  stepPicker: { icon: "👣", name: "Step Picker!", desc: { uz: "Uch riskning har biriga mos qadamni birinchi urinishda tanladingiz", ru: "С первой попытки выбрали подходящий шаг для каждого из трёх рисков" } },
  riskSpotter: { icon: "🔎", name: "Risk Spotter!", desc: { uz: "Bo'lib o'tgan ish va yordam beradigan narsa orasidan riskni topdingiz", ru: "Нашли риск среди прошедшей работы и того, что помогает" } },
  planFixer: { icon: "🗺️", name: "Plan Fixer!", desc: { uz: "Uch qadamni roadmap'ingizga qo'yib, rejani saqladingiz", ru: "Поставили три шага в свой roadmap и сохранили план" } }
};
var ACH_TRIGGERS = { s2: "statusCheck", s3: "stepPicker", s4: "riskSpotter", s7: "planFixer" };
function AchCelebrate({ ach, onDone }) {
  useEffect6(() => {
    const t = setTimeout(onDone, 4e3);
    return () => clearTimeout(t);
  }, []);
  return <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr2({ uz: "Yangi nishon", ru: "Новый значок" })}: ${ach.name}`}>
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
  const COLORS = [T.accent, T.ok, T.accent, "#FFD380", "#FF7755", "#7DD181"];
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
var Q_LABELS = {
  4: { uz: "1 — Qaysi biri risk", ru: "1 — Что из этого риск" },
  8: { uz: "Yakuniy — Qadam qayerda", ru: "Итог — Где стоит шаг" }
};
var QUIZ_MS = 15e3;
var QZ_BG_SHAPES = [
  { ch: { uz: "roadmap", ru: "roadmap" }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: "holat", ru: "статус" }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: "risk", ru: "риск" }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: "qadam", ru: "шаг" }, l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: "ufq", ru: "горизонт" }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: "bajarildi", ru: "выполнено" }, l: 66, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: "kechikdi", ru: "с опозданием" }, l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: { uz: "boshlanmadi", ru: "не начато" }, l: 20, t: 16, s: 20, d: 18, dl: 2.9 },
  { ch: "Render", l: 56, t: 6, s: 20, d: 22, dl: 3.4 },
  { ch: "Expo Go", l: 88, t: 44, s: 20, d: 24, dl: 0.6 },
  { ch: "APK", l: 36, t: 58, s: 22, d: 19, dl: 2.6 },
  { ch: "Maydon Jamoa", l: 4, t: 46, s: 18, d: 26, dl: 1.3 }
];
var QUIZ_BANK = [
  { q: { uz: "Holat nimani ko'rsatadi?", ru: "Что показывает статус?" }, opts: [{ uz: "Ish rejadagi vaqtiga nisbatan qayerda", ru: "Где работа относительно планового времени" }, { uz: "Ishga necha kun ketishini oldindan aniq", ru: "Сколько дней займёт работа — заранее и точно" }, { uz: "Ishni aynan qaysi odam bajarishini", ru: "Какой именно человек сделает работу" }, { uz: "Ish nechta foydalanuvchiga kerakligini", ru: "Скольким пользователям нужна работа" }], correct: 0 },
  { q: { uz: "Ish o'z darsida ishladi, telefonda tekshirildi. Holati qanday?", ru: "Работа заработала на своём уроке, проверена на телефоне. Какой статус?" }, opts: [{ uz: "Kechikdi", ru: "С опозданием" }, { uz: "Bajarildi", ru: "Выполнено" }, { uz: "Boshlanmadi", ru: "Не начато" }, { uz: "Bekor qilindi", ru: "Отменено" }], correct: 1 },
  { q: { uz: "Keyinroq ufqidagi ish hali boshlanmagan. Bu nimani bildiradi?", ru: "Работа горизонта «позже» ещё не начата. Что это значит?" }, opts: [{ uz: "Ish kechikdi, uni tezroq qilish kerak", ru: "Работа опоздала, её надо сделать быстрее" }, { uz: "Roadmap noto'g'ri, qayta yozish kerak", ru: "Roadmap неверный, его надо переписать" }, { uz: "Vaqti hali kelmagan, bu odatiy hol", ru: "Её время ещё не пришло, это обычное дело" }, { uz: "Ishni roadmap'dan olib tashlash kerak", ru: "Работу надо убрать из roadmap" }], correct: 2 },
  { q: { uz: "Risk nima?", ru: "Что такое риск?" }, opts: [{ uz: "Darsda allaqachon bo'lib o'tgan kechikish", ru: "Опоздание, которое уже случилось на уроке" }, { uz: "Kelajakda qo'shilishi mumkin bo'lgan funksiya", ru: "Функция, которую могут добавить в будущем" }, { uz: "Roadmap'dagi bajarilgan ishlar ro'yxati", ru: "Список выполненных работ в roadmap" }, { uz: "Rejaga xalaqit berishi mumkin bo'lgan narsa", ru: "То, что может помешать плану" }], correct: 3 },
  { q: { uz: "Render bepul xizmatida Backend qachon uxlaydi?", ru: "Когда засыпает Backend на бесплатном сервисе Render?" }, opts: [{ uz: "15 daqiqa davomida so'rov kelmasa", ru: "Если 15 минут нет запросов" }, { uz: "Har kuni yarim tunda, o'z-o'zidan", ru: "Каждый день в полночь, сам по себе" }, { uz: "Kuniga 100 ta so'rovdan keyin", ru: "После 100 запросов в день" }, { uz: "Ilova telefonda yopilgan zahoti", ru: "Сразу, как закрыли приложение на телефоне" }], correct: 0 },
  { q: { uz: "Backend uxlab qolsa, birinchi ochilish qancha kutadi?", ru: "Если Backend уснул, сколько ждать первого открытия?" }, opts: [{ uz: "Bir necha soniya", ru: "Несколько секунд" }, { uz: "Bir daqiqagacha", ru: "До минуты" }, { uz: "Besh daqiqagacha", ru: "До пяти минут" }, { uz: "Bir soatdan ko'p", ru: "Больше часа" }], correct: 1 },
  { q: { uz: "Mentor misolida «3 sinovchi» riskiga qaysi qadam yozildi?", ru: "Какой шаг в примере Ментора записан к риску «3 тестировщика»?" }, opts: [{ uz: "Ilovaga yana bitta yangi funksiya qo'shish", ru: "Добавить в приложение ещё одну функцию" }, { uz: "12-Modul boshlanganda odamlarni qidirish", ru: "Искать людей, когда начнётся 12-й модуль" }, { uz: "Mahalla futbol guruhidan 10 kishini chaqirish", ru: "Позвать 10 человек из футбольной группы махалли" }, { uz: "Uch sinovchidan ilovani qayta sinashni so'rash", ru: "Попросить трёх тестировщиков проверить ещё раз" }], correct: 2 },
  { q: { uz: "Nega Expo Go Mentor roadmap'iga risk bo'ldi?", ru: "Почему Expo Go стал риском для roadmap Ментора?" }, opts: [{ uz: "U ilovani juda sekin ochgani uchun", ru: "Потому что он слишком медленно открывает приложение" }, { uz: "Unda Backend'ga ulanmagani uchun", ru: "Потому что в нём нет связи с Backend" }, { uz: "U faqat iPhone'da ishlagani uchun", ru: "Потому что он работает только на iPhone" }, { uz: "U sinash ilovasi, hammada yo'q", ru: "Потому что это инструмент для проверки — он есть не у всех" }], correct: 3 },
  { q: { uz: "APK nima?", ru: "Что такое APK?" }, opts: [{ uz: "Android'ga o'rnatiladigan ilova fayli", ru: "Файл приложения для установки на Android" }, { uz: "iPhone'dagi ilovalar do'konining nomi", ru: "Название магазина приложений на iPhone" }, { uz: "Expo Go ichidagi maxsus sinov rejimi", ru: "Особый тестовый режим внутри Expo Go" }, { uz: "Render'dagi Backend sozlamalari fayli", ru: "Файл настроек Backend на Render" }], correct: 0 },
  { q: { uz: "Qadam 12-Modulda bajariladi. Qaysi ufqqa qo'yasiz?", ru: "Шаг выполнят в 12-м модуле. В какой горизонт его поставить?" }, opts: [{ uz: "Hozir — shu 11-Modulda", ru: "Сейчас — в этом 11-м модуле" }, { uz: "Keyinroq — 12–13-Modul", ru: "Позже — 12–13-й модуль" }, { uz: "Uzoqroq — bitiruvdan keyin", ru: "Дальше — после выпуска" }, { uz: "Ufqsiz — alohida ro'yxatda", ru: "Без горизонта — в отдельном списке" }], correct: 1 },
  { q: { uz: "Qaysi biri riskka qarshi aniq qadam?", ru: "Что из этого — конкретный шаг против риска?" }, opts: [{ uz: "Roadmap'ga ko'proq e'tibor berib ishlash", ru: "Работать, уделяя roadmap больше внимания" }, { uz: "Imkon qadar tezroq va ko'proq harakat qilish", ru: "Стараться как можно быстрее и больше" }, { uz: "Shanba kuni 10 kishini sinovga chaqirish", ru: "В субботу позвать на тест 10 человек" }, { uz: "Risk haqida keyinroq yana o'ylab ko'rish", ru: "Подумать о риске ещё раз позже" }], correct: 2 },
  { q: { uz: "Yakkama-yakkada Mentor bilan nimani ko'rasiz?", ru: "Что вы смотрите с Ментором на встрече один на один?" }, opts: [{ uz: "Arena natijangiz va ballingizni", ru: "Свой результат и баллы в арене" }, { uz: "Kodingizning har bir qatorini", ru: "Каждую строку своего кода" }, { uz: "O'nta yangi g'oyangizni birma-bir", ru: "Десять новых идей по одной" }, { uz: "Holatlar, risklar va qadamlarni", ru: "Статусы, риски и шаги" }], correct: 3 }
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
  const [charge, setCharge] = useState5(false);
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
          <span className="cs-hud-i">🏆 PODIUM</span>
        </div>}
      {hint && <span className={`cs-enter ${disabled ? "wait" : ""}`}>{tr2(hint)}</span>}
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
  const ref = useRef5(null);
  useEffect6(() => {
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
    const TOK = ["Frontend", "🗄️", "Backend", "front→back", "request", "response", "API", "⚙️", "🖥️", "client"];
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
  const [soloMode, setSoloMode] = useState5(!!startSolo);
  const solo = soloMode || !isMentor && !isStudent;
  const soloRef = useRef5(solo);
  soloRef.current = solo;
  const [phase, setPhase] = useState5("lobby");
  const [qi, setQi] = useState5(-1);
  const [remaining, setRemaining] = useState5(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState5({});
  const [players, setPlayers] = useState5([]);
  const [qRows, setQRows] = useState5([]);
  const [answeredN, setAnsweredN] = useState5(0);
  const [classEnded, setClassEnded] = useState5(false);
  const seenQRef = useRef5(-1);
  const qStartRef = useRef5(0);
  const deadlineRef = useRef5(0);
  const phaseRef = useRef5(phase);
  phaseRef.current = phase;
  useEffect6(() => {
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
  useEffect6(() => {
    if (soloRef.current) return;
    let on2 = true, t = null;
    const tick = async () => {
      if (soloRef.current) return;
      try {
        const row = await liveGet(live.pin);
        if (!on2) return;
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
        if (on2) setClassEnded(!row || row.status === "ended");
        if (ph === "lobby" || ph === "reveal" || ph === "done" || phaseRef.current === "reveal") {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]);
          if (on2) {
            setPlayers(pl);
            setQRows(qa);
          }
        } else if (ph === "q" && isMentor) {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, QUIZ_BASE_IDX + seenQRef.current)]);
          if (on2) {
            setPlayers(pl);
            setAnsweredN(qa.length);
          }
        }
      } catch {
      }
      if (on2) t = setTimeout(tick, 1200);
    };
    tick();
    return () => {
      on2 = false;
      clearTimeout(t);
    };
  }, []);
  useEffect6(() => {
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
  const autoNext = useAutoNext({
    on: phase === "reveal" && isMentor && !solo && !lastQ,
    onFire: () => ctrl("q", qi + 1),
    qKey: qi
  });
  const my = qi >= 0 ? myAnswers[qi] : null;
  const closeArena = () => {
    if (isMentor && !solo && phase !== "done") {
      if (typeof window !== "undefined" && !window.confirm(tr2({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?", ru: "Тест ещё не завершён — если закрыть, ученики останутся ждать на арене.\nВсё равно закрыть?" }))) return;
    }
    onClose();
  };
  return <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{tr2(s.ch)}</span>)}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr2({ uz: "Yopish", ru: "Закрыть" })}>✕</button>

      {classEnded && isStudent && !solo && phase !== "done" && <div className="qz-endnote fade-step">
          <span>{tr2({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "⚠️ Живой урок завершён — продолжите тест самостоятельно:" })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "Mashq rejimida davom etish", ru: "Продолжить в режиме практики" })}</button>
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
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl("done", qi) : autoNext.fireNow()}>{lastQ ? tr2({ uz: "🏁 G'oliblarni e'lon qilish", ru: "🏁 Объявить победителей" }) : tr2({ uz: "Keyingi savol →", ru: "Следующий вопрос →" })}</button>}
          {isMentor && !lastQ && <button className="qz-btn ghost qz-auto" onClick={autoNext.auto ? autoNext.pause : autoNext.resume} title={tr2({ uz: "Avto o'tishni to'xtatish — javobni tushuntirish uchun (arena oxirigacha)", ru: "Остановить авто-переход — чтобы объяснить ответ (до конца арены)" })}>{autoNext.auto ? `${tr2({ uz: "To'xtatish", ru: "Пауза" })}${autoNext.sec ? ` · ${autoNext.sec}` : ""}` : tr2({ uz: "▶ Avto", ru: "▶ Авто" })}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr2({ uz: "🏁 Natijani ko'rish", ru: "🏁 Посмотреть результат" }) : tr2({ uz: "Keyingi →", ru: "Дальше →" })}</button>}
        </div>}

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
              {myRank >= 0 && <p className="qz-mypl">{tr2({ uz: "Siz", ru: "Вы" })} — <b>{myRank + 1}{tr2({ uz: "-o'rin", ru: "-е место" })}</b> · {board[myRank].pts} {tr2({ uz: "ball", ru: "баллов" })}</p>}
              <div className="qz-board wide">
                {board.map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                    <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                    {b.maxStreak >= 2 && <span className="qz-bstreak">🔥x{b.maxStreak}</span>}
                    <span className="qz-bok">{b.ok}/{QUIZ_BANK.length}</span>
                    <span className="qz-bpts">{b.pts}</span>
                  </div>)}
              </div>
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr2({ uz: "↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)", ru: "↻ Пройти тест заново — практика (в таблицу не идёт)" })}</button>}
            </>}
          <button className="qz-btn ghost" onClick={closeArena}>{tr2({ uz: "Arenani yopish", ru: "Закрыть арену" })}</button>
        </div>}
    </div>;
}
var ScreenPodium = ({ screen, answers, achievements, onNext, onPrev }) => {
  const gate = useContext2(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === "student" || live.mode === "mentor") && live.pin);
  const livePin = live ? live.pin : null;
  const [players, setPlayers] = useState5([]);
  const [rows, setRows] = useState5([]);
  const [loaded2, setLoaded] = useState5(false);
  useEffect6(() => {
    if (!isLive || !livePin) return;
    let on2 = true, t = null;
    const tick = async () => {
      try {
        const [p, a] = await Promise.all([livePlayers(livePin), liveAnswers(livePin)]);
        if (on2) {
          setPlayers(p);
          setRows(a);
          setLoaded(true);
        }
      } catch {
      }
      if (on2) t = setTimeout(tick, 3e3);
    };
    tick();
    return () => {
      on2 = false;
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
        <div className="head head-c"><h2 className="title h-title fade-up">{isLive ? tr2({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> }) : tr2({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш сегодняшний <span className="italic" style={{ color: T.accent }}>результат</span></> })}</h2></div>
        {!isLive ? <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="pod-card">
              <div className="pod-card-ring"><ScoreRing correct={selfCorrect} total={totalQ} /></div><p className="ring-iz">{tr2({ uz: "Testlarda birinchi urinishda topilgan to'g'ri javoblar", ru: "Верные ответы в тестах с первой попытки" })}</p>
              <div className="pod-card-sec">
                <span className="pod-card-lbl">{tr2({ uz: "Nishonlar", ru: "Значки" })} · {Object.keys(ACHIEVEMENTS).filter((id) => achievements && achievements.has(id)).length}/{Object.keys(ACHIEVEMENTS).length}</span>
                <div className="pod-card-badges">
                  {Object.entries(ACHIEVEMENTS).map(([id, a], k) => {
    const got = !!(achievements && achievements.has(id));
    return <span key={id} className={`pcb ${got ? "got" : ""}`} style={{ "--k": k }} title={tr2(a.desc)}><span className="pcb-ic" aria-hidden="true">{got ? a.icon : "🔒"}</span><span className="pcb-nm">{got ? a.name : "?"}</span></span>;
  })}
                </div>
              </div>
              <div className="pod-card-note"><span className="pcn-ic" aria-hidden="true">💡</span><p className="body">{tr2({ uz: "Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruhning natijalar ro'yxati va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi.", ru: "Это ваш личный результат. На живом уроке здесь появится список результатов всей группы и 🥇🥈🥉 тройка лучших (подиум)." })}</p></div>
            </div>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr2({ uz: "Siz", ru: "Вы" })} — <b>{myIdx + 1}{tr2({ uz: "-o'rin", ru: "-е место" })}</b> ({board[myIdx].okCount}/{totalQ} {tr2({ uz: "to'g'ri", ru: "верно" })})</p>}
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
var KARTOCHKALAR = [
  { front: { uz: "Holat nimani ko'rsatadi?", ru: "Что показывает статус?" }, back: { uz: "Ishning rejadagi vaqtiga nisbatan qayerda ekanini", ru: "Где работа относительно планового времени" }, note: { uz: "Uch holat: bajarildi · kechikdi · boshlanmadi", ru: "Три статуса: выполнено · с опозданием · не начато" } },
  { front: { uz: "Ish rejadagi vaqtida tugamadi, keyin tugadi. Holati qanday?", ru: "Работа не закончилась в плановое время, а закончилась позже. Какой статус?" }, back: { uz: "Kechikdi", ru: "С опозданием" }, note: { uz: "Mentor misolida chiqish va navbat shunday: 14-darsdan keyin ishladi", ru: "В примере Ментора так с выходом и очередью: заработало после 14-го урока" } },
  { front: { uz: "Keyinroq ufqidagi ish hali boshlanmagan. Bu kechikishmi?", ru: "Работа горизонта «позже» ещё не начата. Это опоздание?" }, back: { uz: "Yo'q — holati: boshlanmadi", ru: "Нет — статус: не начато" }, note: { uz: "Uning vaqti hali kelmagan", ru: "Её время ещё не пришло" } },
  { front: { uz: "Risk nima?", ru: "Что такое риск?" }, back: { uz: "Rejaga xalaqit berishi mumkin bo'lgan narsa", ru: "То, что может помешать плану" }, note: { uz: "Bo'lib o'tgan ish risk emas — uning holati bor", ru: "Прошедшая работа — не риск: у неё есть статус" } },
  { front: { uz: "Har riskka nechta qadam yoziladi?", ru: "Сколько шагов пишут на каждый риск?" }, back: { uz: "Bitta — riskni kamaytiradigan aniq ish", ru: "Один — конкретное дело, которое уменьшает риск" }, note: { uz: "«Ehtiyot bo'laman» — hali qadam emas", ru: "«Буду осторожен» — ещё не шаг" } },
  { front: { uz: "Mentor misolida Render bilan bog'liq risk qaysi?", ru: "Какой риск в примере Ментора связан с Render?" }, back: { uz: "Bepul xizmat uxlaydi: birinchi ochilish bir daqiqagacha", ru: "Бесплатный сервис засыпает: первое открытие до минуты" }, note: { uz: "Qadam: ilovaga kutish yozuvi", ru: "Шаг: запись ожидания в приложении" } },
  { front: { uz: "Ilovani har kuni o'zingiz ochib tursangiz, Backend uxlamaydimi?", ru: "Если каждый день самому открывать приложение, Backend не уснёт?" }, back: { uz: "Uxlaydi: 15 daqiqa so'rovsiz qolsa", ru: "Уснёт: если 15 минут нет запросов" }, note: { uz: "Shuning uchun qadam — kutish yozuvi", ru: "Поэтому шаг — запись ожидания" } },
  { front: { uz: "Mentor misolida foydalanuvchilar bilan bog'liq risk qaysi?", ru: "Какой риск в примере Ментора связан с пользователями?" }, back: { uz: "12-Modulda 50 foydalanuvchi kerak, hozir 3 sinovchi", ru: "В 12-м модуле нужно 50 пользователей, сейчас 3 тестировщика" }, note: { uz: "Qadam: mahalla futbol guruhidan 10 kishini sinovga chaqirish", ru: "Шаг: позвать на тест 10 человек из футбольной группы махалли" } },
  { front: { uz: "Nega Expo Go Mentor roadmap'iga risk bo'ldi?", ru: "Почему Expo Go стал риском для roadmap Ментора?" }, back: { uz: "U sinash ilovasi, hamma o'yinchida yo'q", ru: "Это инструмент для проверки, он есть не у всех игроков" }, note: { uz: "Qadam: 12-Modulda APK", ru: "Шаг: APK в 12-м модуле" } },
  { front: { uz: "APK nima?", ru: "Что такое APK?" }, back: { uz: "Android telefonga o'rnatiladigan ilova fayli", ru: "Файл приложения для установки на телефон Android" }, note: { uz: "Mentor misolida — keyinroq ufqida, 12-Modulda", ru: "В примере Ментора — в горизонте «позже», в 12-м модуле" } },
  { front: { uz: "Qadam roadmap'ning qaysi ufqiga qo'yiladi?", ru: "В какой горизонт roadmap ставят шаг?" }, back: { uz: "U qachon boshlana olsa — o'sha ufqqa", ru: "В тот, когда он сможет начаться" }, note: { uz: "Hozir · keyinroq · uzoqroq", ru: "Сейчас · позже · дальше" } },
  { front: { uz: "Tuzatilgan reja nima?", ru: "Что такое исправленный план?" }, back: { uz: "Holatlar va risklarga qarshi qadamlar qo'shilgan roadmap", ru: "Roadmap со статусами и шагами против рисков" }, note: { uz: "Mentor bilan ko'rgach, uni yana yangilashingiz mumkin", ru: "Посмотрев с Ментором, вы можете обновить его ещё раз" } }
];
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect6(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  const [bosildi, setBosildi] = useState5(false);
  const belgila = (e) => {
    if (e.target && e.target.closest && e.target.closest(".fc-card")) setBosildi(true);
  };
  return <Stage eyebrow={tr2({ uz: "Takrorlash", ru: "Повторение" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr2({ uz: "Yakunlash →", ru: "Завершить →" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr2({ uz: <>O'zingizni <A>sinab ko'ring</A>.</>, ru: <>Проверьте <A>себя</A>.</> })}</h2></div>
        {
    /* SABOQ 16: Mentor yo'q; birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */
  }
        <div className={cxx("oo-flash", !bosildi && "yangi")} onClickCapture={belgila} onKeyDownCapture={(e) => {
    if (e.key === "Enter" || e.key === " ") belgila(e);
  }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map((c) => ({ front: tr2(c.front), back: tr2(c.back), note: c.note && tr2(c.note) }))} />
          {!bosildi && <p className="oo-fc-ipucha"><i aria-hidden="true" />{tr2({ uz: "Kartani bosing — javob ochiladi", ru: "Нажмите на карточку — откроется ответ" })}</p>}
        </div>
      </div>
    </Stage>;
};
var HW_KARTA = [
  { k: { uz: "Kim bilan", ru: "С кем" }, v: { uz: "qadamga qarab — agent yoki odamlar", ru: "зависит от шага — агент или люди" } },
  { k: { uz: "Nechta", ru: "Сколько" }, v: { uz: "1 qadam", ru: "1 шаг" } },
  { k: { uz: "Muddat", ru: "Срок" }, v: { uz: "keyingi darsgacha", ru: "до следующего урока" } }
];
var hwBirinchi = () => {
  const rj = rejaLs();
  if (!rj || !rj.risklar.length) return tr2({ uz: "Birinchi qadamingizni yozing.", ru: "Напишите свой первый шаг." });
  const bi = birinchiI(rj.risklar, rj.risklar.map((x) => x.ufq), rj.birinchi);
  const q = bi >= 0 ? nuqtasiz(rj.risklar[bi].qadam) : "";
  return tr2({ uz: `Tuzatilgan rejada «Avval» deb belgilagan qadamingizni oling: ${q}.`, ru: `Возьмите шаг, который в исправленном плане отмечен «Сначала»: ${q}.` });
};
var HW_QADAM = [
  { uz: "Uni bajaring: ilovada bo'lsa — talabni yozib agentga bering; odamlar bilan bo'lsa — ularga yozing yoki ayting.", ru: "Выполните его: если это в приложении — напишите требование и дайте агенту; если с людьми — напишите им или скажите." },
  { uz: "Qadam bajarilganini o'zingiz tekshiring (Mentor misolida — ilova ochilganda kutish yozuvi chiqadimi). Risk o'zgarishi uchun vaqt kerak bo'lishi mumkin.", ru: "Сами проверьте, что шаг выполнен (в примере Ментора — появляется ли запись ожидания при открытии приложения). Чтобы риск изменился, может понадобиться время." }
];
var HwCard = ({ keyingi }) => <div className="card oo-hw fade-up">
    <div className="card-lbl acc">{tr2({ uz: "Uyda nima qilasiz?", ru: "Что сделаете дома?" })}</div>
    <div className="oo-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="oo-hw-q"><span className="oo-hw-k">{tr2(r.k)}</span><span className="oo-hw-v">{tr2(r.v)}</span></div>)}</div>
    <ol className="oo-hw-qadam">{[hwBirinchi(), ...HW_QADAM.map(tr2)].map((q, i) => <li key={i}><i>{i + 1}</i><span>{q}</span></li>)}</ol>
    {keyingi && <span className="oo-hw-keyingi">{keyingi}</span>}
  </div>;
var SummaryScreen = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const _gate = useContext2(LiveGateCtx) || {};
  const _live = _gate.live;
  const [arena, setArena] = useState5(false);
  const [arenaSolo, setArenaSolo] = useState5(false);
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
      } catch (e) {
        console.warn("[arena]", e);
        liveToast({ uz: "Jonli arena ochilmadi: server javob bermadi. Mashq rejimida ochildi — o'quvchilar ekranida ko'rinmaydi.", ru: "Живая арена не открылась: сервер не ответил. Открыта в режиме тренировки — на экранах учеников не видна." });
        setArenaSolo(true);
        setArena(true);
        return;
      }
    }
    setArenaSolo(studentSolo);
    setArena(true);
  };
  const RECAP = [
    { uz: "Holat ishning rejadagi vaqtiga nisbatan qayerda ekanini ko'rsatadi: bajarildi, kechikdi yoki boshlanmadi.", ru: "Статус показывает, где работа относительно планового времени: выполнено, с опозданием или не начато." },
    { uz: "Rejadagi vaqtida tugamagan ish kechikdi deyiladi, keyin tugagan bo'lsa ham.", ru: "Работу, не законченную в плановое время, называют «с опозданием», даже если она закончилась позже." },
    { uz: "Risk — rejaga xalaqit berishi mumkin bo'lgan narsa.", ru: "Риск — то, что может помешать плану." },
    { uz: "Har riskka bitta qadam yoziladi: riskni kamaytiradigan bitta aniq ish.", ru: "На каждый риск пишут один шаг: одно конкретное дело, которое уменьшает риск." },
    { uz: "Qadam roadmap'da o'z ufqiga qo'yiladi — shunda reja tuzatiladi.", ru: "Шаг ставят в свой горизонт roadmap — так план исправляется." }
  ];
  const keyingi = tr2({ uz: <>Keyingi dars — <b>«G'oyangiz va ilovangiz guruhni ishontiradimi?»</b></>, ru: <>Следующий урок — <b>«Убедят ли группу ваша идея и приложение?»</b></> });
  const saqlangan = !!rejaLs();
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return <Stage eyebrow={tr2({ uz: "Dars yakuni", ru: "Итог урока" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Qaytadan", ru: "Заново" })}</button><FinishBtn className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr2({ uz: "Yakunlash ✓", ru: "Завершить ✓" })}</FinishBtn></>}>
      <QYakun
    til={__lang}
    chip={tr2({ uz: "Dars tugadi", ru: "Урок окончен" })}
    togri={correct}
    jami={total}
    sarlavha={saqlangan || isMentorL ? tr2({ uz: <>Roadmap'ingiz tuzatildi: <A>uch risk, uchta qadam</A>.</>, ru: <>Roadmap исправлен: <A>три риска, три шага</A>.</> }) : tr2({ uz: <>Roadmap'ingizning qolganini <A>uyda yozing</A>.</>, ru: <>Остальное в roadmap <A>допишите дома</A>.</> })}
    cta={<>
          {!isMentorL && <RejaStrip />}
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? void 0 : openArena} hint={studentWait ? tr2({ uz: "Mentorni kuting", ru: "Дождитесь наставника" }) : void 0} />
          </div>
          {arena && <QuizArena live={isMentorL && arenaSolo ? { mode: "self" } : _live || { mode: "self" }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
    recap={RECAP.map(tr2)}
    uyga={<HwCard keyingi={keyingi} />}
    keyingi={keyingi}
    hwTokens={HW_TOKENS.map((k) => ({ ...k, t: tr2(k.t) }))}
    nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr2(a.desc), got: !!(achievements && achievements.has(id)) }))}
  />
    </Stage>;
};
function PmOneOnOneLesson({ lang: langProp, onFinished, liveToken }) {
  const lang = langProp || "uz";
  __lang = lang;
  setLiveLang(lang);
  const savedRef = useRef5(void 0);
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
  const [screen, setScreen] = useState5(() => saved ? Math.min(Math.max(saved.screen || 0, 0), TOTAL_SCREENS - 1) : 0);
  const [answers, setAnswers] = useState5(() => saved && saved.answers || {});
  const startTimeRef = useRef5(saved?.startedAt || Date.now());
  const firstPassRef = useRef5(saved?.firstPass || null);
  const soloSentRef = useRef5(/* @__PURE__ */ new Set());
  const [fpPractice, setFpPractice] = useState5(!!saved?.firstPass);
  const earnedRef = useRef5(new Set(saved?.earned || []));
  const [earned, setEarned] = useState5(() => new Set(saved?.earned || []));
  const [achToasts, setAchToasts] = useState5([]);
  const achKeyRef = useRef5(0);
  const earn = useCallback2((id) => {
    if (firstPassRef.current) return;
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts((t) => [...t, { id, k: ++achKeyRef.current }]);
  }, []);
  const missedRef = useRef5(new Set(saved?.missed || []));
  const [missed, setMissed] = useState5(() => new Set(saved?.missed || []));
  const missTry = useCallback2((idx) => {
    const sid = SCREEN_META[idx] && SCREEN_META[idx].id;
    const ach = ACH_TRIGGERS[sid];
    if (!sid || missedRef.current.has(sid) || ach && earnedRef.current.has(ach)) return;
    missedRef.current.add(sid);
    setMissed(new Set(missedRef.current));
  }, []);
  const achMissVal = useMemo2(() => ({ missed, miss: missTry, practice: fpPractice }), [missed, missTry, fpPractice]);
  useEffect6(() => {
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
  useEffect6(() => {
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
    if (_m && _m.scored && _m.scope === "final" && data && data.solved && live.mode === "student") live.submitAnswer(idx, _m.id, data.picked ?? 1, !!data.correct, data.elapsedMs || 0);
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
  useEffect6(() => {
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
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenPodium, ScreenFlashcards, SummaryScreen];
  const Current = screens[screen];
  return <LangContext.Provider value={lang}>
      <style>{`
/* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }
        ${qolipCss(T)}
        /* === 11-Modul 15-dars — darsning o'z vizuali (prefiks oo-, doska rd-). Faqat qolip tokenlari (D3); «Maydon Jamoa» nomi — #2E9E4F (tayanch 9.62) === */
        @media (max-width: 640px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .oo-yorliq { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .oo-kul { display: inline-flex; align-items: center; align-self: center; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 3px 8px; line-height: 1.35; }
        .oo-kul.oo-acc { color: ${T.accent}; background: ${T.accentSoft}; }
        p.oo-kul-q { margin: 0; font-size: 13px; font-weight: 600; color: ${T.ink2}; background: ${T.bg}; border-radius: 8px; padding: 7px 10px; line-height: 1.45; }
        .oo-mj { color: #2E9E4F; font-weight: 800; font-style: normal; }
        /* Bosiladigan joy halqasi (SABOQ 11, 32; B-10): accent halqa doim, yengil to'lqin (≤1.03, ≤0.35, 2.4 s, 3 marta); kam harakatda to'lqin o'chadi, halqa qoladi */
        .oo-halqa { position: relative; }
        .oo-halqa::after { content: ''; position: absolute; inset: -5px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: oo-tolqin 2.4s ease-in-out 0.4s 3; }
        /* Guruh halqasi (SABOQ 32): variantlar/tanlovlar guruhida bitta halqa — guruh atrofida */
        .oo-guruh { position: relative; width: fit-content; max-width: 100%; border-radius: 14px; }
        .oo-halqa-i { border-color: ${T.accent} !important; animation: oo-tolqin-i 2.4s ease-in-out 0.4s 3; }
        .stage-nav .btn-white-accent:not(:disabled) { position: relative; }
        .stage-nav .btn-white-accent:not(:disabled)::after { content: ''; position: absolute; inset: -5px; border-radius: 15px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: oo-tolqin 2.4s ease-in-out 0.5s 3; }
        .lesson-root:has(.oo-flash.yangi) .stage-nav .btn-white-accent { outline: none; }
        .lesson-root:has(.oo-flash.yangi) .stage-nav .btn-white-accent::after { display: none; }
        @keyframes oo-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes oo-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        @keyframes oo-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes oo-tush { from { opacity: 0; transform: translateY(-10px) scale(0.6); } to { opacity: 1; transform: none; } }
        @keyframes oo-sakra { 0%, 100% { transform: none; } 45% { transform: translateY(-5px); } }
        @keyframes oo-yon { 0% { box-shadow: 0 0 0 0 ${fon(T.ok, 0)}; background-color: ${T.okFon}; } 40% { box-shadow: 0 0 0 4px ${fon(T.ok, 0.25)}; background-color: ${T.okFon}; } 100% { box-shadow: 0 0 0 0 ${fon(T.ok, 0)}; } }
        @keyframes oo-son { 0% { transform: scale(1.35); color: ${T.accent}; } 100% { transform: none; } }
        @keyframes oo-chiziq { 0%, 100% { transform: scaleX(1); opacity: 1; } 40% { transform: scaleX(1.06); opacity: 0.55; } }
        @keyframes oo-sirg { from { opacity: 0; transform: translateX(-26px); } to { opacity: 1; transform: none; } }
        @keyframes oo-qtush { from { opacity: 0; transform: translateY(-46px) scale(1.1); } to { opacity: 1; transform: none; } }
        @keyframes oo-barmoq { 0% { opacity: 0; transform: translate(40px, 40px); } 55% { opacity: 1; transform: none; } 80% { transform: scale(0.82); } 100% { opacity: 0.9; transform: none; } }
        @keyframes oo-osish { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes oo-doska-yon { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 40% { box-shadow: 0 0 0 5px ${fon(T.accent, 0.22)}; } }

        /* --- Umumiy: Mentor eslatmasi, nishon qatori, ovozlar, Mentor ro'yxati --- */
        .oo-mnote-c { align-self: flex-end; }
        .oo-mnote { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-radius: 12px; border: 1px dashed ${T.line}; background: ${T.paper}; cursor: pointer; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .oo-mnote-l { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        p.oo-nishon { margin: 0; font-size: 12px; color: ${T.ink2}; }
        p.oo-nishon.ketdi { opacity: 0.75; }
        .oo-ovoz { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .oo-ovoz-q { display: grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr) 28px; align-items: center; gap: 8px; font-size: 12.5px; color: ${T.ink2}; }
        .oo-ovoz-q.men { color: ${T.accent}; font-weight: 700; }
        .oo-ovoz-y { height: 8px; border-radius: 4px; background: ${T.line}; overflow: hidden; }
        .oo-ovoz-y i { display: block; height: 100%; background: ${T.accent}; transition: width 0.6s ease-out; }
        .oo-ovoz-q b { font-family: 'JetBrains Mono', monospace; text-align: right; color: ${T.ink}; }
        .oo-mr { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .oo-mr-h { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
        .oo-mr-h b { font-family: 'JetBrains Mono', monospace; font-size: 18px; color: ${T.accent}; }
        ul.oo-mr-ro { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 6px; }
        li.oo-mr-q { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 10px; border-radius: 10px; background: ${T.bg}; font-size: 13px; }
        li.oo-mr-q.ok { background: ${T.okFon}; }
        .oo-mr-n { font-weight: 700; color: ${T.ink}; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .oo-mr-ch { display: flex; gap: 4px; flex-shrink: 0; }
        .oo-mr-y { flex-shrink: 0; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .oo-mr-y.ok { color: ${T.ok}; }
        .oo-test-viz { display: flex; flex-direction: column; }

        /* --- 0-ekran: kirish --- */
        .oo-s0.tanlovsiz .q-variantlar-kol { position: relative; border-radius: 16px; }
        p.oo-javob { margin: 2px 0 0; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; font-size: clamp(13.5px,1.5vw,15px); font-weight: 600; line-height: 1.5; color: ${T.ink}; }

        /* --- RejaDoska: uch ustun, ish kartasi, holat chipi, «Bugun» chizig'i, qadam kartasi --- */
        .rd { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 16px; padding: 10px 12px; min-width: 0; }
        .rd.yonadi { animation: oo-doska-yon 1.2s ease-out 0.2s 1; }
        .rd-h { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
        .rd-h-t { font-size: 14px; font-weight: 800; color: ${T.ink}; animation: oo-kir 0.4s ease-out both; }
        .rd-ustunlar { display: grid; grid-template-columns: minmax(0,1.35fr) minmax(0,1fr) minmax(0,1fr); gap: 8px; align-items: start; }
        .rd-ustunlar.faqat { grid-template-columns: minmax(0,1fr); }
        .rd-u { display: flex; flex-direction: column; gap: 6px; padding: 8px; border-radius: 12px; background: ${T.bg}; min-width: 0; }
        .rd-u-h { font-size: 10.5px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .rd-u.hozir .rd-u-h { color: ${T.accent}; }
        .rd-u-ich { display: flex; flex-direction: column; gap: 4px; }
        .rd-karta { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; width: 100%; text-align: left; font: inherit; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; padding: 4px 8px; transition: transform 0.25s, box-shadow 0.25s, background-color 0.25s; animation: oo-kir 0.35s ease-out both; animation-delay: calc(var(--i, 0) * 70ms); }
        .rd-karta.joriy { box-shadow: 0 0 0 2px ${T.accent}; transform: scale(1.03); z-index: 1; }
        .rd-karta.joriy::after { content: ''; position: absolute; inset: -5px; border-radius: 13px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: oo-tolqin 2.4s ease-in-out 0.4s 3; }
        .rd-karta.xato { background: ${T.errFon}; }
        .rd-karta.yangi { animation: oo-yon 1.1s ease-out; }
        .rd-karta.kul .rd-k-nom { color: ${T.ink2}; }
        .rd-karta.bosiladi { cursor: pointer; padding-right: 22px; }
        .rd-karta.bosiladi:hover { border-color: ${T.accent}; }
        .rd-k-nom { flex: 1 1 auto; min-width: 0; font-size: 12.5px; font-weight: 700; line-height: 1.3; overflow-wrap: anywhere; }
        .rd-k-y { font-size: 11px; font-weight: 600; color: ${T.ink2}; }
        .rd-k-ch { display: inline-flex; margin-left: auto; }
        .rd-k-ch.sakra { animation: oo-sakra 0.5s ease-out both; animation-delay: calc(0.35s + var(--i, 0) * 100ms); }
        .rd-k-ed { position: absolute; top: 5px; right: 7px; font-style: normal; font-size: 11px; color: ${T.ink2}; }
        .rd-chip { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 800; line-height: 1.3; padding: 2px 7px; border-radius: 999px; white-space: nowrap; }
        .rd-chip.bosh { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .rd-chip.bajarildi { background: ${T.okFon}; color: ${T.ok}; }
        .rd-chip.kechikdi { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1px ${T.accent}; }
        .rd-chip.boshlanmadi { background: ${T.line}; color: ${T.ink2}; }
        .rd-chip.yangi { animation: oo-tush 0.45s cubic-bezier(.3,1.5,.5,1); }
        .rd-chip i { font-style: normal; }
        .rd-bugun { display: flex; align-items: center; gap: 6px; margin: 1px 0; }
        .rd-bugun::before, .rd-bugun::after { content: ''; flex: 1; height: 2px; border-radius: 2px; background: ${T.accent}; }
        .rd-bugun span { font-size: 10.5px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.accent}; white-space: nowrap; }
        .rd-bugun.tolqin::before, .rd-bugun.tolqin::after, .rd-bugun.tolqin span { animation: oo-chiziq 0.9s ease-in-out 0.1s 1; }
        .rd-q { position: relative; display: grid; grid-template-columns: auto minmax(0,1fr); align-items: baseline; gap: 1px 7px; padding: 5px 28px 5px 8px; border-radius: 10px; background: ${T.paper}; border: 1.5px solid ${T.accent}; animation: oo-kir 0.4s ease-out both; }
        .rd-q.bosh { min-height: 30px; padding-right: 8px; background: transparent; border-style: dashed; animation: oo-sirg 0.6s ease-out both; animation-delay: calc(0.4s + var(--i, 0) * 0.12s); }
        .rd-q.tush { animation: oo-qtush 0.8s cubic-bezier(.2,.8,.2,1) 0.5s both; }
        .rd-q.yangi { animation: oo-yon 1.1s ease-out; }
        .rd-q.avval { background: ${T.accentSoft}; box-shadow: 0 0 0 2px ${T.accent}; }
        .rd-q-y { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .rd-q-y b { color: #fff; background: ${T.accent}; border-radius: 999px; padding: 0 7px; letter-spacing: 0.02em; }
        .rd-q-t, button.rd-qadam { font: inherit; font-size: 12.5px; font-weight: 700; line-height: 1.3; color: ${T.ink}; text-align: left; overflow-wrap: anywhere; }
        button.rd-qadam { background: none; border: 0; padding: 0; cursor: pointer; }
        button.rd-qadam:hover { color: ${T.accent}; }
        .rd-q-r { grid-column: 1 / -1; font-size: 11px; line-height: 1.3; color: ${T.ink2}; overflow-wrap: anywhere; }
        button.rd-ed { position: absolute; top: 4px; right: 4px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-size: 11px; cursor: pointer; }
        button.rd-ed:hover { color: ${T.accent}; border-color: ${T.accent}; }
        .rd.kichik { padding: 10px; gap: 6px; }
        .rd.kichik .rd-u { padding: 6px; gap: 4px; }
        .rd.kichik .rd-k-nom, .rd.kichik .rd-q-t { font-size: 11.5px; }
        .rd.kichik .rd-chip { font-size: 10px; padding: 1px 6px; }
        .rd.kichik .rd-karta { padding: 3px 7px; }
        .rd.oo-s8 { padding: 6px; }
        .rd.oo-s8 .rd-u-ich { gap: 3px; }
        .rd-ix { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 8px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; }
        .rd-ix-l { font-weight: 800; color: ${T.ink}; }
        .rd-ix-u { display: inline-flex; align-items: center; gap: 5px; }
        .rd-ix-u i { font-style: normal; font-size: 11px; font-weight: 800; color: ${T.ink2}; }

        /* --- Telefon maketi «Maydon Jamoa» (≈170×272, barqaror) --- */
        .oo-tel { width: 168px; height: 292px; flex-shrink: 0; display: flex; flex-direction: column; gap: 2px; padding: 7px; border-radius: 30px; background: ${T.ink}; box-shadow: 0 14px 30px -16px rgba(${T.shadowBase},0.55); transition: opacity 0.4s, filter 0.4s; }
        .oo-tel.xira { opacity: 0.45; filter: grayscale(0.7); }
        .oo-tel-bar { height: 46px; display: flex; align-items: center; justify-content: center; border-radius: 23px 23px 0 0; background: ${T.paper}; font-size: 12px; padding-top: 22px; position: relative; }
        .oo-tel-bar::before { content: ''; position: absolute; top: 7px; left: 50%; margin-left: -28px; width: 56px; height: 11px; border-radius: 8px; background: ${T.ink}; z-index: 2; pointer-events: none; } /* F-1015-124: telefon kesigi (m7-08 namunasi) */
        .oo-tel-ekran { position: relative; flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 8px; border-radius: 4px 4px 18px 18px; background: ${T.paper}; overflow: hidden; animation: oo-kir 0.35s ease-out both; }
        .oo-te-h { display: flex; align-items: center; justify-content: space-between; gap: 6px; font-size: 11.5px; font-weight: 800; color: ${T.ink}; }
        .oo-te-kun { font-size: 10px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; animation: oo-kir 0.35s ease-out both; animation-delay: calc(var(--i, 0) * 0.25s); }
        .oo-ok { display: flex; flex-direction: column; gap: 3px; padding: 6px 7px; border-radius: 10px; border: 1px solid ${T.line}; background: ${T.bg}; animation: oo-kir 0.35s ease-out both; }
        .oo-ok + .oo-ok { animation-delay: 0.12s; }
        .oo-ok-t { display: flex; flex-direction: column; font-size: 10.5px; line-height: 1.3; color: ${T.ink2}; }
        .oo-ok-t b { font-size: 11px; color: ${T.ink}; }
        .oo-ok-son { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; animation: oo-son 0.4s ease-out; }
        .oo-ok-tg { align-self: flex-start; font-size: 10.5px; font-weight: 800; color: #fff; background: #2E9E4F; border-radius: 8px; padding: 3px 8px; }
        .oo-ok-tg.ok { color: ${T.ok}; background: ${T.okFon}; }
        .oo-barmoq { position: absolute; left: 34px; top: 104px; width: 22px; height: 22px; border-radius: 50%; background: ${fon(T.accent, 0.22)}; border: 2px solid ${T.accent}; animation: oo-barmoq 1.1s ease-in-out both; }
        .oo-te-doira { display: flex; gap: 4px; }
        .oo-te-doira i { display: block; width: 16px; height: 16px; border-radius: 50%; background: ${T.line}; }
        .oo-te-doira i.ok { background: ${fon(T.ok, 0.55)}; }
        .oo-te-q { font-size: 11px; font-weight: 800; line-height: 1.3; color: ${T.ok}; }
        .oo-dalil { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .oo-tel-ust { max-width: 200px; text-align: center; }
        .oo-vaqt { display: flex; align-items: flex-end; gap: 6px; }
        .oo-vq { display: flex; flex-direction: column; align-items: center; gap: 1px; }
        .oo-vq-b { display: flex; gap: 3px; }
        .oo-vq-b i { font-style: normal; font-size: 15px; font-weight: 800; animation: oo-tush 0.4s ease-out both; animation-delay: calc(0.25s + var(--i, 0) * 0.35s); }
        .oo-vq-b i.x { color: ${T.err}; }
        .oo-vq-b i.ok { color: ${T.ok}; }
        .oo-vq b { font-size: 11px; color: ${T.ink}; }
        .oo-vq em { font-size: 10px; font-style: normal; color: ${T.ink2}; }
        .oo-vq-c { width: 34px; height: 2px; margin-bottom: 20px; background: ${T.line}; }

        /* --- 2-ekran: telefon chapda, doska o'ngda, uch tugma doska ostida --- */
        .oo-s2 { display: grid; grid-template-columns: 210px minmax(0,1fr); gap: 16px; align-items: start; }
        .oo-s2-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .oo-tugmalar { display: flex; flex-wrap: wrap; gap: 8px; }
        .oo-tugmalar .q-chip { animation: oo-kir 0.35s ease-out both; animation-delay: calc(var(--i, 0) * 90ms); }

        /* --- 3-ekran: sahna, risk kartasi, yig'ilgan ro'yxat, tanlovlar --- */
        .oo-s3 { display: grid; grid-template-columns: minmax(0,0.95fr) minmax(0,1.05fr); gap: 16px; align-items: start; }
        .oo-s3.tamom { display: block; }
        .oo-s3-ong, .oo-s3-k { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .oo-keyingi { align-self: flex-end; }
        .oo-sahna { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; animation: oo-kir 0.4s ease-out both; }
        .oo-sahna-q { display: flex; align-items: flex-end; gap: 6px; }
        .oo-soat { font-family: 'JetBrains Mono', monospace; font-style: normal; font-size: 11px; color: ${T.accent}; }
        p.oo-kutish { margin: 4px 0 0; padding: 8px; border-radius: 8px; background: ${T.accentSoft}; font-size: 11px; font-weight: 700; line-height: 1.4; color: ${T.ink}; }
        .oo-odam { flex-shrink: 0; }
        .oo-bar { width: 100%; max-width: 320px; display: flex; flex-direction: column; align-items: flex-start; gap: 5px; }
        .oo-bar-t { font-size: 12.5px; font-weight: 800; color: ${T.ink}; }
        .oo-bar-y { display: flex; width: 100%; height: 12px; border-radius: 6px; background: ${T.line}; overflow: hidden; }
        .oo-bar-y i { display: block; height: 100%; transform-origin: left; animation: oo-osish 0.8s ease-out both; }
        .oo-bar-y i.ok { background: ${T.ok}; }
        .oo-bar-y i.taklif { /* kesik-ok: shtrix = grafikdagi taklif qilingan (hali yo'q) qism */ background: repeating-linear-gradient(45deg, ${T.accent} 0 4px, ${T.accentSoft} 4px 8px); animation-delay: 0.2s; }
        .oo-ikki-tel { display: flex; gap: 12px; }
        .oo-expo { align-self: flex-start; font-size: 10px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 6px; }
        .oo-ilovalar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; padding: 10px 4px 4px; }
        .oo-ilovalar > i { display: flex; align-items: center; justify-content: center; aspect-ratio: 1; border-radius: 10px; font-style: normal; }
        .oo-ilovalar > i.savol { background: ${T.bg}; border: 1.5px dashed ${T.ink2}; color: ${T.ink2}; font-weight: 800; }
        .oo-ilovalar > i.apk { background: ${T.line}; animation: oo-tush 0.45s ease-out both; }
        .oo-apk-y { align-self: center; animation: oo-kir 0.4s ease-out both 0.2s; }
        .oo-rk { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; animation: oo-kir 0.4s ease-out both; }
        .oo-rk .oo-kul { align-self: flex-start; }
        .oo-rk-q { display: grid; grid-template-columns: 52px minmax(0,1fr) auto; gap: 8px; align-items: center; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; font-size: 13px; line-height: 1.4; color: ${T.ink}; }
        .oo-rk-q b { font-size: 10.5px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .oo-rk-q.qadam.bosh { background: transparent; border: 1.5px dashed ${T.line}; }
        .oo-rk-q.xato { background: ${T.errFon}; }
        .oo-rk-q.yozildi { font-weight: 700; animation: oo-yon 1.1s ease-out; }
        .oo-rk-bosh { font-weight: 800; color: ${T.ink2}; }
        .oo-ufq { font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 2px 8px; white-space: nowrap; }
        p.oo-rk-osti { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        ol.oo-yig-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        li.oo-yig { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr) auto; gap: 8px; align-items: center; padding: 7px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12px; line-height: 1.35; }
        li.oo-yig.yangi { animation: oo-yon 1.1s ease-out; }
        li.oo-yig i { font-style: normal; color: ${T.accent}; }
        li.oo-yig em { font-style: normal; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 2px 8px; white-space: nowrap; }
        .oo-yig-r { color: ${T.ink2}; }
        .oo-yig-q { font-weight: 700; color: ${T.ink}; }
        ol.oo-yig-ro:not(.keng) .oo-yig-r, ol.oo-yig-ro:not(.keng) .oo-yig-q { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        ol.oo-yig-ro.keng li.oo-yig { font-size: 14px; padding: 11px 14px; }
        .oo-s3-pastki { display: flex; flex-direction: column; gap: 8px; }
        .oo-tanlovlar { display: flex; flex-direction: column; align-items: stretch; gap: 6px; width: 100%; }
        .oo-tanlovlar .q-chip { text-align: left; white-space: normal; line-height: 1.35; }
        .oo-tanlovlar .q-chip { animation: oo-kir 0.35s ease-out both; animation-delay: calc(var(--i, 0) * 100ms); }

        /* --- 5–7-ekran: ustaxona — katta karta, forma, risklar ro'yxati --- */
        .lesson-root .q-mustaqil { max-width: none; }
        .oo-katta { display: flex; flex-direction: column; gap: 9px; padding: 12px 16px; border-radius: 16px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.4); }
        .oo-katta-bosh { display: flex; align-items: center; justify-content: space-between; gap: 6px 12px; flex-wrap: wrap; }
        .oo-katta-nom { font-size: 17px; font-weight: 800; line-height: 1.3; color: ${T.ink}; overflow-wrap: anywhere; }
        .oo-katta .oo-kul { align-self: flex-start; }
        .oo-forma.ixcham { padding: 10px 12px; box-shadow: none; }
        .oo-forma-q { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        input.oo-inp { flex: 1 1 220px; min-width: 0; font: inherit; font-size: 14px; padding: 9px 12px; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.paper}; color: ${T.ink}; }
        input.oo-inp:focus { outline: none; border-color: ${T.accent}; }
        .oo-rq { display: grid; grid-template-columns: 64px minmax(0,1fr); gap: 6px 10px; align-items: center; }
        label.oo-rq-l { font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink2}; }
        .oo-rq.xato input.oo-inp { background: ${T.errFon}; }
        .oo-rq-x { grid-column: 2; display: flex; flex-direction: column; gap: 2px; }
        .oo-amal { display: flex; justify-content: space-between; gap: 8px; }
        .oo-yord { display: flex; flex-wrap: wrap; gap: 6px; }
        .oo-risklarim { display: flex; flex-direction: column; gap: 5px; padding: 8px 12px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .oo-risklarim-h { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
        ol.oo-r6-ro { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 5px; }
        li.oo-r6 { display: flex; align-items: center; gap: 8px; padding: 4px 8px; border-radius: 10px; background: ${T.bg}; font-size: 12.5px; line-height: 1.4; }
        li.oo-r6.yangi { animation: oo-yon 1.1s ease-out; }
        li.oo-r6.joriy { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        li.oo-r6.eng { background: ${T.accentSoft}; }
        .oo-r6 .rd-ed { position: static; flex-shrink: 0; }
        .oo-r6-b, button.oo-yulduz { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; }
        button.oo-yulduz { font: inherit; color: ${T.ink}; text-align: left; background: none; border: 0; border-radius: 8px; padding: 2px 4px; cursor: pointer; }
        button.oo-yulduz i { font-style: normal; font-size: 16px; color: ${T.accent}; }
        .oo-r6-r { color: ${T.ink2}; }
        .oo-r6-q { font-weight: 700; }
        .oo-r6-b b, button.oo-yulduz b { color: ${T.accent}; }
        .oo-risklarim.keng li.oo-r6 { font-size: 14px; padding: 9px 10px; }
        .oo-s7-h { display: inline-flex; align-items: center; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
        .rd-h:has(.oo-s7-h) { align-items: center; flex-wrap: wrap; }
        .oo-s7-x p.q-xulosa { padding-top: 10px; padding-bottom: 10px; }
        .oo-strip { display: flex; align-items: center; justify-content: center; gap: 6px 12px; flex-wrap: wrap; padding: 7px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 12.5px; color: ${T.ink2}; }
        .oo-strip-l { font-weight: 800; color: ${T.ink}; }
        .oo-strip b { color: ${T.accent}; }
        .oo-strip-ok b { color: ${T.ok}; }

        /* --- Kartochkalar va yakun --- */
        .oo-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: oo-tolqin-i 2.4s ease-in-out 0.4s 3; }
        p.oo-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.oo-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .oo-fikr { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 20px 14px; border-radius: 16px; text-align: center; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.2)}; }
        .oo-fikr-l { font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        p.oo-fikr-t { margin: 0; color: ${T.ink}; line-height: 1.5; }
        .oo-hw { display: flex; flex-direction: column; gap: 10px; }
        .oo-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .oo-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 9px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .oo-hw-k { font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .oo-hw-v { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        ol.oo-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        ol.oo-hw-qadam li { display: flex; align-items: flex-start; gap: 9px; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        ol.oo-hw-qadam li i { flex: 0 0 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 12px; line-height: 1; color: ${T.accent}; background: ${T.accentSoft}; }
        .oo-hw-keyingi { font-size: 13.5px; color: ${T.ink2}; }

        @media (max-width: 860px) {
          .oo-s2, .oo-s3 { grid-template-columns: minmax(0,1fr); }
          .oo-s2-tel, .oo-s3 > .oo-sahna { justify-self: center; }
        }
        @media (max-width: 640px) {
          .rd-ustunlar { grid-template-columns: minmax(0,1fr); }
          .rd.kichik .rd-ustunlar { grid-template-columns: minmax(0,1fr); }
          li.oo-yig { grid-template-columns: minmax(0,1fr) auto; }
          li.oo-yig > i { display: none; }
          li.oo-yig .oo-yig-q { grid-column: 1; }
          .oo-ikki-tel { gap: 8px; }
          .oo-ikki-tel .oo-tel { width: 150px; }
          .oo-hw-karta { grid-template-columns: minmax(0,1fr); }
          .oo-rq { grid-template-columns: minmax(0,1fr); }
          .oo-rq-x { grid-column: 1; }
          ul.oo-mr-ro { grid-template-columns: minmax(0,1fr); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lesson-root [class*="oo-"], .lesson-root [class*="oo-"]::after, .lesson-root [class*="oo-"]::before, .lesson-root [class^="rd"], .lesson-root [class*=" rd-"], .lesson-root [class^="rd"]::after, .lesson-root [class^="rd"]::before, .lesson-root .stage-nav .btn-white-accent::after { animation: none !important; transition: none !important; }
        }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px ${fon(T.accent, 0.35)}, 0 0 0 1px ${fon(T.accent, 0.12)}; }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px ${fon(T.accent, 0.55)}; }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoomable.z-float > .zoom-btn { visibility: hidden; } /* ⛶ bo'sh joy ustida osilmasin (ZBTN, 159-qonun) */
        .flow-label:has(+ .zoomable.z-empty) { display: none; } /* bo'sh ustun ustida yorliq yolg'iz osilmasin (bridge 40-band, F-0926-01) */
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .ring-iz { margin: 0; font-size: 13px; line-height: 1.4; color: ${T.ink2}; text-align: center; } /* F-1015-147: hisob qoidasi */
        /* F-1015-158: natija — bitta karta (m5-08 namunasi): halqa, nishonlar, 💡 izoh; halqa atrofida qo'shimcha chiziq yo'q */
        .pod-card { position: relative; width: 100%; max-width: 480px; margin-top: 6px; background: ${T.paper}; border-radius: 20px; padding: 0 clamp(14px,2.4vw,20px) clamp(14px,2.4vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 16px 34px -20px rgba(${T.shadowBase},0.35); }
        .pod-card-ring { display: flex; justify-content: center; padding-top: clamp(14px,2.4vw,20px); } .pod-card-ring > * { margin-top: 0 !important; }
        .screen:has(.pod-card) .head { text-align: center; }
        .pod-card-sec { background: ${T.bg}; border-radius: 14px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .pod-card-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .pod-card-badges { display: flex; justify-content: center; gap: clamp(8px,1.6vw,12px); flex-wrap: wrap; }
        .pcb { width: 84px; display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .pcb-ic { width: 50px; height: 50px; border-radius: 14px; display: grid; place-items: center; font-size: 26px; line-height: 1; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .pcb.got .pcb-ic { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}; animation: pcb-pop 0.5s cubic-bezier(.3,1.6,.5,1) both; animation-delay: calc(0.35s + var(--k) * 0.12s); }
        .pcb:not(.got) .pcb-ic { font-size: 18px; filter: grayscale(1); opacity: 0.55; }
        .pcb-nm { font-family: 'Manrope'; font-size: 10.5px; line-height: 1.25; text-align: center; color: ${T.ink2}; }
        .pcb.got .pcb-nm { color: ${T.ink}; font-weight: 700; }
        @keyframes pcb-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .pod-card-note { display: flex; gap: 10px; align-items: flex-start; background: ${T.accentSoft}; border-radius: 14px; padding: 11px 13px; }
        .pcn-ic { width: 32px; height: 32px; flex: none; border-radius: 50%; display: grid; place-items: center; background: ${T.paper}; font-size: 16px; }
        .pod-card-note .body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); }
        @media (prefers-reduced-motion: reduce) { .pcb.got .pcb-ic { animation: none; } }
        .zoomable.zb-joy:not(.zoom-on) { padding-top: 0 !important; } .zoomable.zb-joy:not(.zoom-on) > .zoom-btn { top: var(--zb-y, 0px) !important; left: var(--zb-x, auto) !important; right: auto !important; visibility: visible !important; } /* F-1015-125 (206.6): ⛶ asosiy vizual burchagida; 36px qator — faqat zaxira */ .zoomable.zb-qator:not(.zoom-on) { padding-top: 0 !important; } /* F-1015-176: ⛶ joy topolmasa — ko'rsatilmaydi, bo'sh qator yo'q */ .zoomable.zb-qator:not(.zoom-on) > .zoom-btn { display: none !important; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        /* F-1004-12 · F-1015-111 (B): ⛶ hech narsani yopmaydi va kartadan chiqmaydi — vizual tepasida o'ziga ajratilgan
           36 px qatorda, o'ng chetda; har kenglikda bir xil (7-Modul U2 naqshi). */
        .zoomable:not(.z-empty):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: 0; }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); } /* skeletda tushib qolgan edi — ⛶ ishlamasdi (F-1006-271) */
        .q-fokus:has(.zoom-on) { animation: none; transform: none; } /* qolip .q-fokus (fill both) transform qoldiradi — ⛶ oynasi blokka bog'lanib qolardi (F-1006-286, MEXANIZM-TAKLIF 12) */
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI (radio) === */
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }


        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
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
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px ${fon(T.accent, 0.55)}; }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px ${fon(T.accent, 0.55)}, 0 0 3px ${fon(T.accent, 0.4)}; }
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px ${fon(T.accent, 0.22)}; }
        .frame-success { background: ${T.okFon}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .head-c { text-align: center; align-items: center; } /* F-1003-04: natija ekrani — bitta o'q */
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
        .ai-line.bad { background: ${fon(T.accent, 0.16)}; box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }

        /* === YAKUN === */
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink2}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }

        /* === JSON KO'RINISHI === */

        /* === MA'LUMOT JADVALI === */

        /* === SXEMA JADVAL-KARTOCHKASI === */

        /* === BOG'LANISH TUGMASI (s10) === */

        /* === TANLASH QATORI (s13) === */

        /* === YAKUNIY SXEMA KANVAS (s15) === */

        /* === Instagram POST KARTOCHKASI === */

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }
        .lp-step:hover:not(.on) { box-shadow: 0 8px 18px -7px rgba(${T.shadowBase},0.24); }
        .lp-step.on { background: ${T.okFon}; color: ${T.ok}; box-shadow: inset 0 0 0 1.5px ${T.ok}55; }
        .lp-step.on .lp-check { background: ${T.ok}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done { animation: none !important; } }
        .lp-mstats { background: ${T.accentSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }

        /* === 🃏 FLASHCARDS — qolipda: QKartochka (DE-204) === */

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qcode.uzun { white-space: normal; overflow-wrap: break-word; } /* F-1015-129: uzun kod (SQL, buyruq) bo'sh joydan bo'linadi, kartadan chiqmaydi */

        /* === 🏅 ACHIEVEMENTS — hisoblagich + to'liq-ekran bayram === */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px ${fon(T.accent, 0.4)}; }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink2}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px ${fon(T.accent, 0.18)}; } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 222px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink2}; }
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
        .pod-medal { font-size: clamp(26px,4vw,38px); line-height: 1; }
        .pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: ${T.ink}; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-score { font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink2}; }
        .pod-bar { width: 100%; border-radius: 10px 10px 0 0; background: linear-gradient(180deg, ${T.accent}, ${T.accent}BB); box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); }
        .pod-1 .pod-bar { height: clamp(74px,11vw,120px); }
        .pod-2 .pod-bar { height: clamp(52px,8vw,86px); background: linear-gradient(180deg, ${T.ink2}, ${T.ink2}); }
        .pod-3 .pod-bar { height: clamp(38px,6vw,62px); background: linear-gradient(180deg, #C98A3D, #DDA55C); }
        .pod-col.me .pod-name { color: ${T.ok}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.ok}; } /* 11.16: o'quvchining O'Z natijasi YASHIL (qizil faqat xato javob uchun) */
        .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
        .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
        .pod-row.me { background: ${T.okFon}; outline: 1.5px solid ${T.ok}66; }
        .pod-rank { min-width: 22px; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .pod-row-name { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-row-dots { display: flex; gap: 4px; }
        .pod-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(${T.shadowBase},0.15); }
        .pod-dot.ok { background: ${T.ok}; }
        .pod-dot.bad { background: ${T.accent}; }
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pod-row-time { min-width: 46px; text-align: right; font-size: 11.5px; color: ${T.ink2}; }

        /* === ⚡ CODE STRIKE — CTA neon-kapsula (arena STRUKTURASI ⚡ Jonliniki) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px; /* 192 (F-1004-57): CODE STRIKE — kapsula, platforma standarti */
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
        .cs-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; line-height: 1; user-select: none; color: rgba(203,173,255,.32); text-shadow: 0 0 12px rgba(150,95,255,.4); animation: cs-float ease-in-out infinite; animation-duration: calc(var(--d,22s) / var(--spd,1)); will-change: transform; }
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
        .cs-hud { position: relative; z-index: 2; display: flex; gap: clamp(7px,1.1vw,11px); align-items: center; justify-content: center; flex-wrap: wrap; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
        .cs-hud-i { display: inline-flex; align-items: baseline; gap: 5px; background: rgba(255,255,255,.055); border: 1px solid rgba(190,150,255,.42); border-radius: 999px; padding: 6px 14px; text-shadow: 0 0 10px rgba(160,100,255,.55); }
        .cs-hud-i b { font-size: clamp(13px,1.7vw,17px); color: #fff; }
        .cs-hud-dot { color: rgba(190,150,255,.6); }
        .cs-enter { position: relative; z-index: 2; font-family: 'Manrope'; font-weight: 900; font-size: clamp(13px,1.8vw,17px); color: #C9A6FF; letter-spacing: .01em; text-shadow: 0 0 12px rgba(150,90,255,.6); animation: cs-enter-pulse 1.3s ease-in-out infinite; }
        .cs-enter.wait { color: #8C86A8; text-shadow: none; animation: none; }
        @keyframes cs-enter-pulse { 0%,100% { opacity: .72; transform: translateY(0) scale(1); } 50% { opacity: 1; transform: translateY(2px) scale(1.03); } }
        .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
        .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
        @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
        .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none; background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%); animation: cs-portal-in .9s ease-in-out both; }
        @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }
        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }
        /* === MENTOR STATISTIKASI (jonli test + yozma ish panellari) === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px ${fon(T.accent, 0.5)}; }
        .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px ${fon(T.accent, 0.5)}; } 50% { box-shadow: 0 4px 18px 0 ${fon(T.accent, 0.55)}; } }
        .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
        .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.accent}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
        .mstats-prog-fill.full { background: ${T.ok}; }
        .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
        .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
        .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
        .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .mstats-chip.okc  { background: ${T.okFon}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.ok}; }
        .mstats-chip.badc { background: ${T.accentSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.accent}; }
        .mstats-chip.waitc { background: rgba(${T.shadowBase},0.06); } .mstats-chip.waitc .mstats-chip-n, .mstats-chip.waitc .mstats-chip-t { color: ${T.ink2}; }
        .mstats-chip.ansc { background: ${fon(T.accent, 0.1)}; } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.accent}; }
        .mstats-hidden { margin: 0; font-family: 'Manrope'; font-size: 12.5px; font-style: italic; color: ${T.ink2}; }
        .mstats-bars { display: flex; flex-direction: column; gap: 8px; }
        .mstats-row { display: flex; align-items: center; gap: 10px; transition: opacity 0.4s; }
        .mstats-row.dimmed { opacity: 0.4; }
        .mstats-abc { width: 28px; height: 28px; border-radius: 9px; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); }
        .mstats-track { flex: 1; height: 16px; background: rgba(${T.shadowBase},0.07); border-radius: 99px; overflow: hidden; }
        .mstats-fill { display: block; height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(.4,0,.2,1); opacity: 0.85; }
        .mstats-count { min-width: 108px; text-align: right; font-size: 12px; font-weight: 600; color: ${T.ink2}; white-space: nowrap; }
        .mstats-waitrow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .mstats-wait-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .mstats-wait-chip { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.07); border-radius: 99px; padding: 3px 10px; }
        .mstats-wait-chip.more { color: ${T.ink2}; }
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink2}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px ${fon(T.accent, 0.5)}; transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px ${fon(T.accent, 0.55)}; }
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
        .rc-dot.fill { background: ${T.ink2}; }
        .rc-dot.cur { background: ${T.accent}; width: 26px; }
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.accent}; color: #fff; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
        .rc-btn:hover:not(:disabled) { background: ${T.accent}; }
        .rc-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
        .rc-btn.ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
        .rc-btn.ghost:hover:not(:disabled) { background: ${T.paper}; color: ${T.ink}; }
        .rc-btn.done { background: ${T.ok}; color: #fff; }
        .rc-btn.done:hover { background: #17603C; }
        @media (max-width: 640px) {
          .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; }
          .rc-dots { width: 100%; order: -1; }
          .rc-btn { font-size: 13px; padding: 11px 16px; }
        }

        /* === ⚡ CTA (yakun sahifasida) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }

        /* ===== ⚡ ARENA — issiq CoddyCamp muhiti ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, ${fon(T.accent, 0.14)} 0%, ${fon(T.accent, 0)} 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
        .qz-arena::before { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(190,150,255,0.08) 1.1px, transparent 1.2px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; }
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
        .qz-pchip.me { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border-color: transparent; box-shadow: 0 0 22px ${fon(T.accent, 0.45)}; }
        @keyframes qz-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .qz-btn { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border: none; border-radius: 14px; padding: 13px 26px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 14px 26px -10px ${fon(T.accent, 0.6)}, inset 0 2px 0 rgba(255,255,255,0.3); transition: transform 0.18s; }
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
        .qz-opt { flex: 1; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(14px,2vw,17px); color: #fff; line-height: 1.3; letter-spacing: -0.01em; }
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
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%,100% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 8px ${fon(T.accent, 0)}; } }
        .bnode.on { opacity: 1; transform: scale(1); }
        .bnode.trig.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px ${fon(T.accent, 0.3)}; }
        .bnode.sheet.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px ${fon(T.accent, 0.3)}; }
        .bnode.act.on { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}, 0 8px 18px -6px rgba(31,122,77,0.3); }
        .bflow-arrow.on { color: ${T.accent}; opacity: 1; }
        @keyframes think-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .gear-slot.on { opacity: 1; box-shadow: inset 0 0 0 1.5px ${T.ok}, 0 6px 16px -6px rgba(31,122,77,0.26); background: ${T.okFon}; }
        .bot-status.on .bot-status-dot { background: ${T.ok}; box-shadow: 0 0 8px rgba(31,122,77,0.55); }
        @keyframes bot-status-danger { 0%,100% { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 1.5px ${T.err}55; } 50% { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 5px ${T.err}22; } }
        .ns-cell.filled { border-style: solid; border-color: ${T.line}; }
        .ns-cust.ok { box-shadow: inset 0 0 0 1.5px ${T.ok}; } .ns-cust.ok .ns-cust-msg { color: ${T.ok}; }
        @keyframes ns-dots-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes rz-shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .itm-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -8px ${fon(T.accent, 0.3)}; }

        /* to'g'ri terilganda — qadamlar KETMA-KET tasdiqlanadi (yuqoridan pastga to'lqin) */
        /* SNAP — bo'lak slotga tushganda "qulflandi" hissi (fill-mode YO'Q — sudrash transform'i erkin qolsin) */

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi (11.7). Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        /* 11.15 — jonli badge xira, hover'da tiniq (proyektorda xalaqit bermaydi) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* ===== 🏙️ SHAHAR KONTENT KOMPONENTLARI (arxitektura darsi) ===== */
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope'; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }
        @keyframes rev-in { from { opacity: 0; transform: translateY(-6px) scale(0.96); } to { opacity: 1; transform: none; } }
        .fl-node.done { opacity: 1; background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; }
        .fl-node.on { opacity: 1; background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 18px -4px ${fon(T.accent, 0.45)}; transform: translateY(-3px); animation: fl-pulse 1.1s infinite ease-in-out; }
        @keyframes fl-pulse { 0%,100% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 16px -6px ${fon(T.accent, 0.4)}; } 50% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 24px -2px ${fon(T.accent, 0.65)}; } }
        @keyframes fl-move { from { left: -7px; opacity: 0; } 25% { opacity: 1; } to { left: calc(100% - 6px); opacity: 1; } }
        .cm-client.on { opacity: 1; box-shadow: inset 0 0 0 1.5px ${T.ok}, 0 5px 14px -6px rgba(31,122,77,0.26); }
        .agent-step.done { background: ${T.okFon}; }
        .agent-step.done .as-phase { color: ${T.ok}; }

        /* S21 — har og'ir animatsiyaga TINCH variant. */
        @media (prefers-reduced-motion: reduce) {
          .itm-card.tap-hint, .gchip.tap-hint, .btn-soft.tap-hint,
          .shake, .fl-node.on { animation: none !important; }
        }
        /* qaytarilgan keyframes (saralashdan keyin) */
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={tr2(LESSON_META.lessonTitle)} /> : <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} live={live} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== "mentor" && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts((t) => t.filter((x) => x.k !== k))} />}
            </>}
        </div>
      </LiveGateCtx.Provider>
      </AchMissCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>;
}

// src/9-Modull/lms-entry:PmOneOnOneLesson.jsx
function CcLessonEntry(props) {
  notePreviewProps(props);
  return __ccEl(PmOneOnOneLesson, props);
}
export {
  CcLessonEntry as default
};
