// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/2-Modull/JsVarsLesson.jsx
//  Kompilyator: TASHQI MODUL — https://go.coddycamp.uz/uploads/course_artifacts/f9e30f4aaecfeada4e3482bfe60877d2.jsx
//  Qayta yig'ish:  node scripts/build-lms.mjs --shared https://go.coddycamp.uz/uploads/course_artifacts/f9e30f4aaecfeada4e3482bfe60877d2.jsx src/2-Modull/JsVarsLesson.jsx
//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.
// ============================================================
// src/2-Modull/JsVarsLesson.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from "react";
import HtmlCompiler, { checks as C } from "https://go.coddycamp.uz/uploads/course_artifacts/f9e30f4aaecfeada4e3482bfe60877d2.jsx";
var __lang = "uz";
var tr = (node) => {
  if (node === null || node === void 0) return "";
  if (typeof node === "string") return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? "";
};
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
var CODE = { bg: "#1A2436", text: "#E8E5DD", tag: "#FF7755", attr: "#FFD380", str: "#7DD181", comment: "#6B7585", punct: "#9FB4D8", kw: "#C792EA", num: "#F78C6C", vr: "#82AAFF", bool: "#FFCB6B" };
var LIVE_SUPABASE_URL = "https://dwoubexcexzsinogojiu.supabase.co";
var LIVE_SUPABASE_KEY = "sb_publishable_cijLMhCDDdo6dlXs05thyw__oH-YgKX";
var LIVE_ENABLED = !!(LIVE_SUPABASE_URL && LIVE_SUPABASE_KEY);
var LIVE_POLL_MS = 2500;
var LIVE_POLL_MAX_MS = 15e3;
var LIVE_HEARTBEAT_MS = 1e4;
var LIVE_STALE_MS = 18e4;
var LT = { bg: "#F6F4EF", ink: "#0E0E10", ink2: "#5A5A60", ink3: "#A7A6A2", paper: "#FFFFFF", accent: "#FF4F28", accentSoft: "#FFE8E1", success: "#1F7A4D" };
var _liveHdr = { apikey: LIVE_SUPABASE_KEY, Authorization: `Bearer ${LIVE_SUPABASE_KEY}` };
async function liveRpc(fn, body) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: "POST", headers: { ..._liveHdr, "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
  if (!r.ok) {
    let msg = "";
    try {
      msg = JSON.parse(await r.text()).message || "";
    } catch {
    }
    throw new Error(msg || `${fn}: ${r.status}`);
  }
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}
async function liveGet(pin) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/live_sessions?pin=eq.${encodeURIComponent(pin)}&select=*`, { headers: _liveHdr });
  if (!r.ok) throw new Error(`get: ${r.status}`);
  const rows = await r.json();
  return rows && rows[0] || null;
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
var progWrite = (id, o) => {
  try {
    localStorage.setItem(_progKey(id), JSON.stringify(o));
  } catch {
  }
};
var progClear = (id) => {
  try {
    localStorage.removeItem(_progKey(id));
  } catch {
  }
};
var _pracKey = (id) => `ccPractice:${id}`;
var pracRead = (id) => {
  try {
    const v = JSON.parse(localStorage.getItem(_pracKey(id)) || "null");
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
};
var pracWrite = (id, o) => {
  try {
    localStorage.setItem(_pracKey(id), JSON.stringify(o));
  } catch {
  }
};
var pracClear = (id) => {
  try {
    localStorage.removeItem(_pracKey(id));
  } catch {
  }
};
var codeKeyOf = (id, kind) => `ccCode:${id}:${kind}`;
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
async function liveList(path) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/${path}`, { headers: _liveHdr });
  if (!r.ok) throw new Error(`list: ${r.status}`);
  return r.json();
}
var livePlayers = (pin) => liveList(`live_players?pin=eq.${encodeURIComponent(pin)}&select=id,nickname,joined_at&order=joined_at.asc`);
var liveAnswers = (pin, screenIdx) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}${screenIdx == null ? "&screen_idx=lt.100" : `&screen_idx=eq.${screenIdx}`}&select=player_id,screen_idx,picked,correct,elapsed_ms`);
var liveQuizAnswers = (pin) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}&screen_idx=gte.100&select=player_id,screen_idx,picked,correct,elapsed_ms`);
var LiveGateCtx = createContext(null);
function useLiveSession(lessonId, answerKey) {
  const keyRef = useRef(answerKey);
  keyRef.current = answerKey;
  const initRef = useRef(void 0);
  if (initRef.current === void 0) initRef.current = LIVE_ENABLED ? liveRead(lessonId) : null;
  const init = initRef.current;
  const [mode, setMode] = useState(() => {
    if (!LIVE_ENABLED) return "self";
    if (init?.mode === "self") return "self";
    if (init?.mode === "student") return "student";
    if (init?.mode === "mentor") return "mentor";
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
      setJoinError(tr({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: "Неверный код наставника или ошибка подключения." }));
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
        setJoinError(tr({ uz: "Bu kod boshqa darsga tegishli.", ru: "Этот код от другого урока." }));
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
    if (mode !== "student" || !pin || !playerRef.current) return;
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
    const attempt = (n) => {
      liveRpc("submit_answer", body).catch(() => {
        if (n < 3) setTimeout(() => attempt(n + 1), 3e3 * (n + 1));
      });
    };
    attempt(0);
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
  return { mode, pin, mentorScreen, mentorMax, status, mentorAlive, connected, ended, joinError, busy, startMentor, joinStudent, selfStudy, reportScreen, endSession, submitAnswer, quiz, quizControl, revealScreen, mentorReveal, playerId: playerRef.current?.id || null, nickname: nickRef.current };
}
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
      <p style={{ color: "#fff", opacity: 0.85, fontSize: "clamp(15px,2.2vw,22px)", maxWidth: 640, margin: "clamp(20px,4vw,36px) 0 0", lineHeight: 1.5 }}>{tr({ uz: <>Shu darsni o'z qurilmangizda oching → <b style={{ color: "#fff" }}>«👨‍🎓 O'quvchiman»</b> → ushbu kodni kiriting.</>, ru: <>Откройте этот урок на своём устройстве → <b style={{ color: "#fff" }}>«👨‍🎓 Я ученик»</b> → введите этот код.</> })}</p>
      <button onClick={onClose} style={{ marginTop: "clamp(22px,4vw,40px)", background: LT.accent, color: "#fff", border: "none", borderRadius: 14, padding: "clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)", fontSize: "clamp(15px,1.8vw,18px)", fontWeight: 700, cursor: "pointer" }}>{tr({ uz: "Darsni boshlash →", ru: "Начать урок →" })}</button>
    </div>;
}
function LiveGate({ live, title = { uz: "Jonli dars", ru: "Живой урок" } }) {
  const [code, setCode] = useState("");
  const [nick, setNick] = useState(() => nickRead());
  const [mentorCode, setMentorCode] = useState("");
  const [role, setRole] = useState("student");
  const card = { position: "relative", width: "100%", maxWidth: 420, background: LT.paper, borderRadius: 20, padding: "clamp(24px,4vw,36px)", boxShadow: "0 10px 40px -12px rgba(58,53,48,0.22)", display: "flex", flexDirection: "column", gap: 18 };
  const wrap = { minHeight: "calc(100dvh / var(--lz, 1))", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 };
  const link = { background: "none", border: "none", color: LT.ink3, fontSize: 13, cursor: "pointer", alignSelf: "center" };
  if (role === "mentor") {
    return <div style={wrap}><div style={card}>
      <div style={{ textAlign: "center" }}><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "0 0 4px" }}>{tr({ uz: "🧑‍🏫 Mentor kirishi", ru: "🧑‍🏫 Вход для наставника" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: "Mentor kodini kiriting.", ru: "Введите код наставника." })}</p></div>
      <input value={mentorCode} onChange={(e) => setMentorCode(e.target.value)} type="password" autoFocus placeholder={tr({ uz: "Mentor kodi", ru: "Код наставника" })} onKeyDown={(e) => {
      if (e.key === "Enter") live.startMentor(mentorCode);
    }} style={{ width: "100%", padding: "14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 18, fontWeight: 600, textAlign: "center", outline: "none" }} />
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: "Tekshirilmoqda…", ru: "Проверяем…" }) : tr({ uz: "Kirish →", ru: "Войти →" })}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: "center" }}>{live.joinError}</div>}
      <button onClick={() => {
      setRole("student");
      setMentorCode("");
    }} style={link}>{tr({ uz: "← Orqaga", ru: "← Назад" })}</button>
    </div></div>;
  }
  return <div style={wrap}><div style={card}>
    <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: LT.accent }}>{tr(title)}</div><h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,28px)", color: LT.ink, margin: "6px 0 4px" }}>{tr({ uz: "Darsga qo'shilish", ru: "Подключиться к уроку" })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: "Mentor bergan kodni va ismingizni kiriting.", ru: "Введите код от наставника и своё имя." })}</p></div>
    <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" autoFocus placeholder="483 920" style={{ width: "100%", padding: "16px 14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 28, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.12em", textAlign: "center", outline: "none" }} />
    <input value={nick} onChange={(e) => setNick(e.target.value)} maxLength={24} placeholder={tr({ uz: "Ismingiz (masalan: Ali)", ru: "Ваше имя (например: Али)" })} onKeyDown={(e) => {
    if (e.key === "Enter") live.joinStudent(code, nick);
  }} style={{ width: "100%", padding: "13px 14px", border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 17, fontWeight: 600, textAlign: "center", outline: "none" }} />
    <button onClick={() => live.joinStudent(code, nick)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: "Ulanmoqda…", ru: "Подключаемся…" }) : tr({ uz: "Qo'shilish →", ru: "Присоединиться →" })}</button>
    {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: "center" }}>{live.joinError}</div>}
    <button onClick={() => {
    setRole("mentor");
    setCode("");
  }} title="Mentor" aria-label="Mentor" style={{ position: "absolute", bottom: 10, right: 12, background: "none", border: "none", fontSize: 16, opacity: 0.3, cursor: "pointer", lineHeight: 1, padding: 4 }}>🧑‍🏫</button>
  </div></div>;
}
function LiveBadge({ live, total }) {
  const [bigOpen, setBigOpen] = useState(false);
  const [nPlayers, setNPlayers] = useState(null);
  useEffect(() => {
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
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "🔓 O'quvchilar erkin qilindi", ru: "🔓 Ученики отпущены" })}</div>;
    return <>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr({ uz: "Kod:", ru: "Код:" })} <b style={{ fontFamily: "monospace", letterSpacing: "0.08em" }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr({ uz: "Kodni katta ko'rsatish", ru: "Показать код крупно" })} style={{ marginLeft: 6, background: LT.ink, color: "#fff", border: "none", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{tr({ uz: "📺 Ko'rsatish", ru: "📺 Показать" })}</button>
        <button onClick={() => {
      if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: "Отпустить учеников? Они продолжат самостоятельно." }))) live.endSession();
    }} style={{ background: LT.accentSoft, color: LT.accent, border: "none", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{tr({ uz: "🔓 Erkin qilish", ru: "🔓 Отпустить" })}</button>
      </div>
    </>;
  }
  if (live.mode === "student") {
    if (live.status === "ended") return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: "🔓 Erkin rejim — o'zingiz davom eting", ru: "🔓 Свободный режим — продолжайте сами" })}</div>;
    if (!live.mentorAlive) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "⚠️ Mentor uzildi — erkin rejim", ru: "⚠️ Наставник отключился — свободный режим" })}</div>;
    if (!live.connected) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot("#FFD380")} /> {tr({ uz: "🔄 Qayta ulanmoqda…", ru: "🔄 Переподключение…" })}</div>;
    return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 👨‍🏫 {tr({ uz: "Mentor:", ru: "Наставник:" })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}
var LangContext = createContext("uz");
var MentorCtx = createContext(null);
var AchCtx = createContext(null);
var PRACTICE_DONE_BASE = 500;
var useLang = () => useContext(LangContext);
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < breakpoint : false);
  useEffect(() => {
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
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (!v.length) return;
      this.voicesByLang.ru = v.find((x) => x.lang.startsWith("ru")) || v[0];
      this.voicesByLang.uz = v.find((x) => x.lang.startsWith("uz")) || v.find((x) => x.lang.startsWith("ru")) || v[0];
      this.voicesReady = true;
    };
    load();
    if (window.speechSynthesis.onvoiceschanged !== void 0) window.speechSynthesis.onvoiceschanged = load;
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
  const [state, setState] = useState({ isPlaying: false, currentSegment: null, waitingFor: null, muted: false });
  const engineRef = useRef(null);
  const segmentsRef = useRef(segments);
  const key = segments ? JSON.stringify(segments) : "";
  const prevKey = useRef(key);
  if (prevKey.current !== key) {
    segmentsRef.current = segments;
    prevKey.current = key;
  }
  const stable = segmentsRef.current;
  useEffect(() => {
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
  const triggerEvent = useCallback((type, target) => {
    if (engineRef.current) engineRef.current.triggerEvent(type, target);
  }, []);
  const replay = useCallback(() => {
    if (engineRef.current) engineRef.current.replay();
  }, []);
  const toggleMute = useCallback(() => {
    setState((p) => {
      const m = !p.muted;
      if (m && engineRef.current) engineRef.current.stop();
      return { ...p, muted: m };
    });
  }, []);
  return { ...state, triggerEvent, replay, toggleMute };
}
var LESSON_META = { lessonId: "js-vars-01-v18", lessonTitle: { uz: "JavaScript — O'zgaruvchilar", ru: "JavaScript — Переменные" } };
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
var Kw = ({ children }) => <span style={{ color: CODE.kw }}>{children}</span>;
var Vr = ({ children }) => <span style={{ color: CODE.vr }}>{children}</span>;
var St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
var Nm = ({ children }) => <span style={{ color: CODE.num }}>{children}</span>;
var Op = ({ children }) => <span style={{ color: CODE.punct }}>{children}</span>;
var VarBox = ({ name, value, valColor = T.accent, small, pulse }) => <div className="var-box" key={value}>
    <div className="var-name">📦 {name}</div>
    <div className={`var-val ${pulse ? "drop-in" : ""}`} style={{ color: valColor, fontSize: small ? "clamp(15px,2.4vw,19px)" : "clamp(18px,3vw,24px)" }}>{value}</div>
  </div>;
function AchCounter() {
  const earned = useContext(AchCtx);
  const gate = useContext(LiveGateCtx);
  const count = earned ? earned.size : 0;
  const total = Object.keys(ACHIEVEMENTS).length;
  const prevRef = useRef(count);
  const [bump, setBump] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
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
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => {
    setMCollapsed(false);
  }, [screen]);
  const setCollapsed = useCallback((v) => {
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
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
var NavBack = ({ onPrev }) => <button className="btn-ghost" onClick={onPrev} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr({ uz: "Orqaga", ru: "Назад" })}</button>;
var NavNext = ({ disabled, label = { uz: "Davom etish", ru: "Продолжить" }, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === "student" && live.status !== "ended" && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: "Наставник ещё не открыл эту страницу" }) : void 0} style={{ padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)", marginLeft: "auto" }}>{locked ? tr({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите наставника" }) : freeRide && disabled ? tr({ uz: "Davom etish", ru: "Продолжить" }) : tr(label)}</button>;
};
var FeedbackBlock = ({ show, isCorrect, neutral, children }) => {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
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
var RcFlow = ({ items, sep = "→" }) => <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>;
var RECAPS = {
  4: {
    title: { uz: "O'zgaruvchi nima?", ru: "Что такое переменная?" },
    cards: [
      {
        ic: "📦",
        h: { uz: "O'zgaruvchi — nomlangan quti", ru: "Переменная — коробка с именем" },
        body: { uz: <>O'zgaruvchi — bu <b>qiymat saqlaydigan nomlangan «quti»</b>. Ichiga biror narsa solamiz, qutiga <b>nom</b> beramiz, keyin shu nom bilan chaqiramiz.</>, ru: <>Переменная — это <b>«коробка» с именем, в которой хранится значение</b>. Кладём внутрь что-нибудь, даём коробке <b>имя</b> — и потом зовём её по этому имени.</> },
        vis: <RcFlow items={[{ uz: "📦 quti", ru: "📦 коробка" }, { uz: "🏷️ nom: yosh", ru: "🏷️ имя: yosh" }, { uz: "🔢 ichida: 14", ru: "🔢 внутри: 14" }]} />,
        ask: { uz: "Uyda qanday «nomlangan qutilar» bor — masalan «tuz» yozilgan idish?", ru: "Какие «коробки с именами» есть у вас дома — например, банка с надписью «соль»?" }
      },
      {
        ic: "🏷️",
        h: { uz: "Nom bo'lsa — topa olamiz", ru: "Есть имя — легко найти" },
        body: { uz: <>Qutiga <b>nom</b> berganimiz uchun keyin uni <b>oson topamiz</b>. «yosh» desak — ichidagi 14 chiqadi. Nomsiz quti — qidirib topib bo'lmaydi.</>, ru: <>Мы дали коробке <b>имя</b>, поэтому потом <b>легко её находим</b>. Скажем «yosh» — получим 14 изнутри. А коробку без имени не отыскать.</> },
        vis: <RcFlow items={[{ uz: "🏷️ ism", ru: "🏷️ ism" }, { uz: "🏷️ yosh", ru: "🏷️ yosh" }, { uz: "🏷️ shahar", ru: "🏷️ shahar" }]} sep="·" />
      },
      {
        ic: "🎯",
        h: { uz: "Amal ham, sahifa ham emas", ru: "Не действие и не страница" },
        body: { uz: <>O'zgaruvchi — bu <b>hisob-kitob amali</b> yoki internet sahifasi emas. U shunchaki <b>ma'lumotni saqlab turadigan joy</b>.</>, ru: <>Переменная — это не <b>математическое действие</b> и не интернет-страница. Это просто <b>место, где хранятся данные</b>.</> }
      }
    ]
  },
  6: {
    title: { uz: "let — o'zgaradigan qiymat", ru: "let — значение, которое меняется" },
    cards: [
      {
        ic: "🔄",
        h: { uz: "Qiymat o'zgarsa — let", ru: "Значение меняется — let" },
        body: { uz: <>Qiymati <b>keyin o'zgaradigan</b> o'zgaruvchini <b>let</b> so'zi bilan ochamiz. «number» yoki «print» emas — aynan let.</>, ru: <>Переменную, значение которой <b>потом будет меняться</b>, создаём словом <b>let</b>. Не «number» и не «print» — именно let.</> },
        vis: <RcFlow items={[{ uz: "let ball = 10", ru: "let ball = 10" }, { uz: "ball = 25", ru: "ball = 25" }, { uz: "📦 endi 25", ru: "📦 теперь 25" }]} />,
        ask: { uz: "O'yin bali dars davomida o'zgaradimi? Unda let mi, boshqami?", ru: "Счёт в игре меняется по ходу урока? Тогда let или что-то другое?" }
      },
      {
        ic: "🎮",
        h: { uz: "Misol: o'yin bali", ru: "Пример: счёт в игре" },
        body: { uz: <>O'yinda <b>ball</b> ortib boradi — 10, keyin 25. Bunday <b>o'zgarib turadigan</b> narsa uchun <b>let</b> to'g'ri keladi.</>, ru: <>В игре <b>счёт</b> растёт — 10, потом 25. Для таких <b>меняющихся</b> вещей подходит <b>let</b>.</> },
        vis: <RcFlow items={[{ uz: "10", ru: "10" }, { uz: "20", ru: "20" }, { uz: "25", ru: "25" }, { uz: "🔼 o'zgaradi", ru: "🔼 меняется" }]} sep="·" />
      },
      {
        ic: "🎯",
        h: { uz: "let bilan constni adashtirmang", ru: "Не путайте let и const" },
        body: { uz: <>Yodda tuting: <b>let</b> — keyin <b>o'zgartirsa bo'ladi</b>. const esa — <b>o'zgarmaydi</b>. Savolda «o'zgaradigan» so'zi bo'lsa — javob let.</>, ru: <>Запомните: <b>let</b> — потом <b>можно менять</b>. А const — <b>не меняется</b>. Если в вопросе есть слово «меняется» — ответ let.</> }
      }
    ]
  },
  10: {
    title: { uz: "const — o'zgarmas qiymat", ru: "const — неизменное значение" },
    cards: [
      {
        ic: "🔒",
        h: { uz: "O'zgarmasa — const", ru: "Не меняется — const" },
        body: { uz: <>Tug'ilgan yilingiz kabi <b>o'zgarmas</b> qiymat uchun <b>const</b> ishlatamiz. const qutisini <b>qulflab</b> qo'yamiz — ichidagisi doim shu bo'lib qoladi.</>, ru: <>Для <b>неизменных</b> значений — как год вашего рождения — используем <b>const</b>. Коробку const мы <b>запираем на замок</b>: внутри навсегда остаётся то же самое.</> },
        vis: <RcFlow items={[{ uz: "const yil = 2011", ru: "const yil = 2011" }, { uz: "🔒 qulf", ru: "🔒 замок" }, { uz: "doim 2011", ru: "всегда 2011" }]} />,
        ask: { uz: "Bir haftada necha kun bor? Bu o'zgaradimi? Unda let mi, const mi?", ru: "Сколько дней в неделе? Это меняется? Тогда let или const?" }
      },
      {
        ic: "🚫",
        h: { uz: "O'zgartirsangiz — xato", ru: "Попробуете изменить — ошибка" },
        body: { uz: <>const PI = 3.14 dan keyin <b>PI = 3</b> desak — <b>xato</b> beradi. Chunki const bir marta to'ldiriladi va <b>o'zgarmaydi</b>.</>, ru: <>Если после const PI = 3.14 написать <b>PI = 3</b> — будет <b>ошибка</b>. Потому что const заполняется один раз и <b>не меняется</b>.</> },
        vis: <RcFlow items={[{ uz: "const PI = 3.14", ru: "const PI = 3.14" }, { uz: "PI = 3", ru: "PI = 3" }, { uz: "❌ xato", ru: "❌ ошибка" }]} />
      },
      {
        ic: "🎯",
        h: { uz: "Qulf kerakmi? — const", ru: "Нужен замок? — const" },
        body: { uz: <>Qoida: qiymat <b>hech qachon o'zgarmasa</b> — const. O'zgarib tursa — let. «o'zgarmas», «doim bir xil» so'zlari constdan darak beradi.</>, ru: <>Правило: значение <b>никогда не меняется</b> — const. Меняется — let. Слова «неизменный», «всегда одинаковый» подсказывают: это const.</> }
      }
    ]
  },
  13: {
    title: { uz: "Number (raqam) va string (matn)", ru: "Number (число) и string (текст)" },
    cards: [
      {
        ic: "🔢",
        h: { uz: "Tirnoqsiz — bu raqam", ru: "Без кавычек — это число" },
        body: { uz: <>25 — bu <b>number (raqam)</b>, chunki <b>qo'shtirnoqsiz</b> yozilgan. Number bilan <b>hisob-kitob</b> qilsa bo'ladi: qo'shish, ko'paytirish.</>, ru: <>25 — это <b>number (число)</b>, потому что записано <b>без кавычек</b>. С number можно <b>считать</b>: складывать, умножать.</> },
        vis: <RcFlow items={[{ uz: "25 → number", ru: "25 → number" }, { uz: "25 + 5 = 30", ru: "25 + 5 = 30" }, { uz: "✅ hisob bo'ladi", ru: "✅ можно считать" }]} />,
        ask: { uz: "10 + 5 raqamlar bilan bo'ladi. Lekin «o'n» + «besh» bo'ladimi?", ru: "10 + 5 с числами работает. А «десять» + «пять» сработает?" }
      },
      {
        ic: "✍️",
        h: { uz: "Qo'shtirnoqda — bu matn", ru: "В кавычках — это текст" },
        body: { uz: <>«25» qo'shtirnoqda bo'lsa — bu endi <b>string (matn)</b>, raqam emas. «yigirma» ham — <b>harflar</b> bo'lgani uchun string.</>, ru: <>Если «25» в кавычках — это уже <b>string (текст)</b>, а не число. «двадцать» тоже string — ведь это <b>буквы</b>.</> },
        vis: <RcFlow items={[{ uz: '"25" → matn', ru: '"25" → текст' }, { uz: '"yigirma" → matn', ru: '"yigirma" → текст' }]} sep="·" />
      },
      {
        ic: "🎯",
        h: { uz: "true — boshqa tur", ru: "true — другой тип" },
        body: { uz: <>true — bu <b>boolean</b> (ha/yo'q), raqam emas. Demak faqat <b>tirnoqsiz 25</b> — number bo'ladi.</>, ru: <>true — это <b>boolean</b> (да/нет), а не число. Значит, number здесь только <b>25 без кавычек</b>.</> }
      }
    ]
  }
};
function RecapOverlay({ screenIdx, onClose }) {
  const rc = RECAPS[screenIdx];
  const [i, setI] = useState(0);
  useEffect(() => {
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
        <span className="rc-tag">{tr({ uz: "📖 Qayta tushuntirish", ru: "📖 Повторное объяснение" })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: "Yopish", ru: "Закрыть" })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">🗣️ {tr({ uz: "Sinfga savol:", ru: "Вопрос классу:" })} {tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: "← Oldingi", ru: "← Предыдущая" })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? "cur" : k < i ? "fill" : ""}`} onClick={() => setI(k)} aria-label={`${k + 1}-${tr({ uz: "karta", ru: "карточка" })}`} />)}</div>
        {last ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: "✓ Tushunarli — davom etamiz", ru: "✓ Понятно — продолжаем" })}</button> : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: "Keyingisi →", ru: "Следующая →" })}</button>}
      </div>
    </div>;
}
var fmtCode = (s) => typeof s === "string" && s.includes("`") ? s.split("`").map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p) : s;
var MSTATS_COLORS = ["#019ACB", "#8B5CF6", "#E8A13A", "#E0559A"];
function MentorTestStats({ live, screenIdx, options, correctIdx, reveal, onReveal, onOpenRecap }) {
  const [data, setData] = useState({ players: null, rows: [] });
  useEffect(() => {
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
        <span className="mstats-lbl">{tr({ uz: "📊 Jonli natija", ru: "📊 Живой результат" })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: "✓ Hamma javob berdi", ru: "✓ Все ответили" }) : <>{tr({ uz: "Javob berdi:", ru: "Ответили:" })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? "ready" : ""}`} onClick={onReveal}>{tr({ uz: "🔓 Natijani ochish", ru: "🔓 Открыть результат" })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? "full" : ""}`} style={{ width: `${total ? Math.round(answered / total * 100) : 0}%` }} /></div>
      {reveal ? <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri ✅", ru: "верно ✅" })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: "xato ❌", ru: "ошибка ❌" })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: "kutilmoqda ⏳", ru: "ожидаем ⏳" })}</span></div>
        </div> : <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: "javob berdi 📨", ru: "ответили 📨" })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: "kutilmoqda ⏳", ru: "ожидаем ⏳" })}</span></div>
        </div>}
      {!reveal && answered > 0 && <p className="mstats-hidden">{tr({ uz: <>🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.</>, ru: <>🙈 Кто что выбрал и счёт ✅/❌ скрыты — по нажатию «Открыть результат» всё появится сразу и у вас, и на экранах учеников.</> })}</p>}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
    const n = data.rows.filter((a) => a.picked === i).length;
    const pct = answered ? Math.round(n / answered * 100) : 0;
    const isC = reveal && i === correctIdx;
    const col = isC ? T.success : MSTATS_COLORS[i % 4];
    return <div key={i} className={`mstats-row ${reveal && !isC ? "dimmed" : ""}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? "✓" : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round(n / maxN * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : void 0}>{n > 0 ? `${n} ${tr({ uz: "o'quvchi", ru: "уч." })} · ${pct}%` : "—"}</span>
            </div>;
  })}
      </div>}
      {reveal && answered > 0 && (() => {
    const pct = Math.round(ok / answered * 100);
    const level = answered < RECAP_MIN_ANSWERS ? "few" : pct < RECAP_NEED_PCT ? "need" : pct < RECAP_GOOD_PCT ? "maybe" : "good";
    return <div className={`mstats-verdict ${level}`}>
            {level === "need" && <>
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — класс не понял эту тему. Перед продолжением советуем коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr({ uz: "Qayta tushuntirish", ru: "Повторное объяснение" })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === "maybe" && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: "📖 Qisqa takrorlash", ru: "📖 Быстрое повторение" })}</button>}
            </>}
            {level === "good" && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === "few" && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — судить по процентам сложно. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: "Qayta tushuntirish", ru: "Повторное объяснение" })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>;
  })()}
      {waiting.length > 0 && answered > 0 && <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr({ uz: "⏳ Kutilmoqda:", ru: "⏳ Ожидаем:" })}</span>
          {waiting.slice(0, 8).map((p) => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>}
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: "⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Советуем объяснить её ещё раз." })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: "Ответы учеников появятся здесь в реальном времени…" })}</p>}
    </div>;
}
var QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: "on_mount", waits_for: { type: "option_picked" } }] : null);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === "student");
  const isMentorLive = !!(live && live.mode === "mentor");
  const mountTs = useRef(Date.now());
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? storedAnswer.solved ?? storedAnswer.picked === correctIdx : false);
  const firstCorrectRef = useRef(storedAnswer ? storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null : null);
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
  const [recapOpen, setRecapOpen] = useState(false);
  const hasRecap = !!RECAPS[screen];
  const doReveal = () => {
    setMReveal(true);
    if (live) live.mentorReveal(screen);
    if (storedAnswer === void 0) onAnswer(screen, { mentorRevealed: true });
  };
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect(() => {
    if (isMentorLive && liveRevealScreen === screen) setMReveal(true);
  }, [isMentorLive, liveRevealScreen, screen]);
  const pick = (i) => {
    if (solved || isMentorLive) return;
    const isCorrect = i === correctIdx;
    setPicked(i);
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect;
    if (oneShot) {
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: tr(questionText), options: options.map((o) => tr(o)), correctIndex: correctIdx, correctAnswer: tr(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: tr(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: tr(questionText), options: options.map((o) => tr(o)), correctIndex: correctIdx, correctAnswer: tr(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: tr(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
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
  return <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : void 0} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? mReveal ? tr({ uz: "Davom etish", ru: "Продолжить" }) : tr({ uz: "Avval natijani oching", ru: "Сначала откройте результат" }) : solved ? tr({ uz: "Davom etish", ru: "Продолжить" }) : oneShot ? tr({ uz: "Javob tanlang", ru: "Выберите ответ" }) : tr({ uz: "To'g'ri javobni toping", ru: "Найдите верный ответ" })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? "flex-start" : "safe center", gap: "clamp(16px,2.5vw,24px)" }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: "-8px 0 0", color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: "⚡ Живой урок — одна попытка, подумайте перед нажатием!" })}</p>}
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
                <span style={{ flex: 1 }}>{fmtCode(tr(opt))}</span>
              </button>;
  })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : solved && !wrongLocked} neutral={waiting}>
          <p className="small mono" style={{ margin: "0 0 6px", fontWeight: 600, color: waiting ? T.blue : isMentorLive || solved && !wrongLocked ? T.success : T.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isMentorLive ? `✓ ${tr({ uz: "To'g'ri javob:", ru: "Верный ответ:" })} ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}` : waiting ? tr({ uz: "📨 Javobingiz qabul qilindi", ru: "📨 Ваш ответ принят" }) : wrongLocked ? `${tr({ uz: "To'g'ri javob:", ru: "Верный ответ:" })} ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}` : solved ? tr({ uz: "To'g'ri", ru: "Верно" }) : tr({ uz: "Qaytadan urinib ko'ring", ru: "Попробуйте ещё раз" })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive ? tr(explainCorrect) : waiting ? tr({ uz: "Javobingiz qabul qilindi. Mentor «Natijani ochish»ni bosganda natija hammada birdan ko'rinadi.", ru: "Ваш ответ принят. Когда наставник нажмёт «Открыть результат», итог появится у всех одновременно." }) : wrongLocked ? tr(explainWrong[picked] ?? explainWrong.default) : solved ? tr(explainCorrect) : tr(explainWrong[picked] ?? explainWrong.default)}
          </p>
          {
    /* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
       Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */
  }
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "📖 Быстрое повторение — взглянуть на тему ещё раз" })}</button>}
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>;
};
function ScoreRing({ correct, total }) {
  const PCT = total ? correct / total : 0;
  const col = PCT >= 0.6 ? T.success : T.accent;
  const R = 50, ST = 9, C2 = 2 * Math.PI * R;
  const [off, setOff] = useState(C2);
  useEffect(() => {
    const t = setTimeout(() => setOff(C2 * (1 - PCT)), 200);
    return () => clearTimeout(t);
  }, [C2, PCT]);
  return <div className="ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke={T.ink3 + "40"} strokeWidth={ST} />
        <circle cx="64" cy="64" r={R} fill="none" stroke={col} strokeWidth={ST} strokeLinecap="round" strokeDasharray={C2} strokeDashoffset={off} transform="rotate(-90 64 64)" style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">{tr({ uz: "to'g'ri javob", ru: "верных ответов" })}</div></div>
    </div>;
}
var MENTOR_IMG = "https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png";
var Mentor = ({ children }) => {
  const ctx = useContext(MentorCtx) || {};
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
        <span className="mentor-name">{tr({ uz: "Mentor", ru: "Наставник" })}{collapsed && <span className="mentor-cue">{tr({ uz: " · ko'rsatmani ochish ▾", ru: " · открыть подсказку ▾" })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>;
};
var Zoomable = ({ children }) => {
  const [big, setBig] = useState(false);
  useEffect(() => {
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
        <button type="button" className="zoom-btn" onClick={() => setBig((b) => !b)} aria-label={big ? tr({ uz: "Kichraytirish", ru: "Уменьшить" }) : tr({ uz: "Kattalashtirish", ru: "Увеличить" })} title={big ? tr({ uz: "Kichraytirish", ru: "Уменьшить" }) : tr({ uz: "Kattalashtirish", ru: "Увеличить" })}>{big ? "✕" : "⛶"}</button>
        {children}
      </div>
    </>;
};
var Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const audio = useAudio([{ id: "s0", text: `O'yin o'ynaganingizda ekranda ballingiz, jonlaringiz va ismingiz turadi. O'yin ularni qayerda eslab qoladi? "Kod" tugmasini bosib, ichkariga qarang.`, trigger: "on_mount", waits_for: { type: "option_picked" } }]);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [view, setView] = useState("game");
  const OPTS = [
    { id: "a", label: { uz: "Sehr bilan — shunchaki eslab qoladi", ru: "Магией — просто запоминает" } },
    { id: "b", label: { uz: `Nomlangan "quti" — o'zgaruvchida saqlaydi`, ru: "В «коробке» с именем — в переменной" } },
    { id: "c", label: { uz: "Hech qayerda — har safar yo'qoladi", ru: "Нигде — каждый раз теряется" } }
  ];
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v);
    onAnswer(screen, { stage: "hook", screenIdx: screen, picked: v, correct: true });
    audio.triggerEvent("option_picked");
  };
  return <Stage eyebrow={tr({ uz: "Kirish", ru: "Введение" })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 760 }}>{tr({ uz: <>O'yin ballingizni <span className="italic" style={{ color: T.accent }}>qayerda</span> saqlaydi?</>, ru: <>Игра — <span className="italic" style={{ color: T.accent }}>где</span> она хранит ваш счёт?</> })}</h1>
        <Mentor>{tr({ uz: <>O'yin o'ynaganingizda ekranda <b style={{ color: T.ink }}>ballingiz</b>, jonlaringiz va ismingiz turadi. O'yin ularni qayerda eslab qoladi? <b style={{ color: T.ink }}>"Kod"</b> tugmasini bosib, ichkariga qarang.</>, ru: <>Когда вы играете, на экране видны <b style={{ color: T.ink }}>ваш счёт</b>, жизни и имя. Где игра всё это запоминает? Нажмите кнопку <b style={{ color: T.ink }}>«Код»</b> и загляните внутрь.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              <button className={`chip ${view === "game" ? "chip-on" : ""}`} onClick={() => setView("game")}>{tr({ uz: "👾 O'yin", ru: "👾 Игра" })}</button>
              <button className={`chip ${view === "code" ? "chip-on" : ""}`} onClick={() => setView("code")}>{"</>"} {tr({ uz: "Kod", ru: "Код" })}</button>
            </div>
            <div className="demo-swap" key={view}>
              {view === "game" ? <div style={{ background: "#101826", borderRadius: 14, padding: "18px 16px", boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.2)` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontFamily: "'Manrope',sans-serif" }}>
                    <span style={{ fontWeight: 800, color: "#FFCB6B" }}>👾 SPACE</span>
                    <span style={{ fontSize: 13, color: "#82AAFF" }}>{tr({ uz: "O'yinchi: Aziza", ru: "Игрок: Азиза" })}</span>
                  </div>
                  <div style={{ textAlign: "center", margin: "16px 0" }}>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 38, color: "#7DD181" }}>1250</div>
                    <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11, color: "#9FB4D8", letterSpacing: "0.1em" }}>{tr({ uz: "BALL", ru: "СЧЁТ" })}</div>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 18 }}>❤️ ❤️ ❤️</div>
                </div> : <pre className="code-box"><Kw>let</Kw> <Vr>ball</Vr> <Op>=</Op> <Nm>1250</Nm>{"\n"}<Kw>let</Kw> <Vr>jon</Vr> <Op>=</Op> <Nm>3</Nm>{"\n"}<Kw>let</Kw> <Vr>ism</Vr> <Op>=</Op> <St>"Aziza"</St></pre>}
            </div>
            {view === "code" && <p className="mono small" style={{ color: T.ink3, marginTop: 6, textAlign: "center" }}>{tr({ uz: '↑ har bir qiymat — nomlangan "quti"da', ru: "↑ каждое значение — в «коробке» с именем" })}</p>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: "Sizningcha, o'yin ballni qanday eslab qoladi?", ru: "Как, по-вашему, игра запоминает счёт?" })}</p>
            <div className="fade-up delay-3" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {OPTS.map((o) => {
    const on = picked === o.id;
    return <button key={o.id} className={`hook-option ${on ? "on" : ""}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{tr(o.label)}</span>
                  </button>;
  })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>To'g'ri yo'nalish! Bu "qutilar" — <b>o'zgaruvchilar</b>. Bugun ularni o'rganamiz.</>, ru: <>Верное направление! Эти «коробки» — <b>переменные</b>. Сегодня мы их изучим.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen1 = ({ screen, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s1", text: `Mana, eng qizig'i boshlanadi — bugun siz birinchi marta haqiqiy JavaScript kodi yozasiz! Boshlanishi esa o'zgaruvchilardan. Ularni 5 ta qadamda o'rganamiz va oxirida o'zingiz yozasiz.`, trigger: "on_mount", waits_for: null }]);
  const STEPS = [
    { text: { uz: "O'zgaruvchi nima — nomlangan quti", ru: "Что такое переменная — коробка с именем" }, tag: "" },
    { text: { uz: "Qiymat berish", ru: "Присваивание значения" }, tag: "=" },
    { text: { uz: "O'zgaradigan va o'zgarmas", ru: "Меняющееся и неизменное" }, tag: "let / const" },
    { text: { uz: "Ma'lumot turlari", ru: "Типы данных" }, tag: { uz: "matn · raqam", ru: "текст · число" } },
    { text: { uz: "O'zgaruvchini o'zingiz yozasiz", ru: "Сами напишете переменную" }, tag: "" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = <Col>
      <p className="flow-label">{tr({ uz: "Bugun shunday kod yozasiz", ru: "Сегодня вы напишете такой код" })}</p>
      <pre className="code-box" style={{ fontSize: "clamp(13px,1.9vw,15px)" }}><span className="fade-up" style={{ display: "block", animationDelay: "0.1s" }}><Kw>let</Kw> <Vr>ism</Vr> <Op>=</Op> <St>"Aziza"</St></span><span className="fade-up" style={{ display: "block", animationDelay: "0.3s" }}><Kw>let</Kw> <Vr>yosh</Vr> <Op>=</Op> <Nm>14</Nm></span><span className="fade-up" style={{ display: "block", animationDelay: "0.5s" }}><Kw>const</Kw> <Vr>shahar</Vr> <Op>=</Op> <St>"Toshkent"</St></span></pre>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: `→ uchta o'zgaruvchi, uchta "quti"`, ru: "→ три переменные, три «коробки»" })}</p>
    </Col>;
  const StepsBlock = <Col>
      <p className="flow-label">{tr({ uz: "5 qadam", ru: "5 шагов" })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => <li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, "0")}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span>{s.tag && <span className="step-tag">{tr(s.tag)}</span>}</span></li>)}
      </ol>
    </Col>;
  return <Stage eyebrow={tr({ uz: "Reja", ru: "План" })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: "Boshlaymiz →", ru: "Начинаем →" })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Bugun <span className="italic" style={{ color: T.accent }}>birinchi haqiqiy kodingizni</span> yozasiz!</>, ru: <>Сегодня вы напишете <span className="italic" style={{ color: T.accent }}>свой первый настоящий код</span>!</> })}</h2>
        </div>
        <Mentor>{tr({ uz: <>Mana, eng qizig'i boshlanadi — bugun siz birinchi marta <b style={{ color: T.ink }}>haqiqiy JavaScript kodi</b> yozasiz! Hammasi <b style={{ color: T.ink }}>o'zgaruvchilardan</b> boshlanadi. 5 qadamda o'rganamiz va oxirida o'zingiz yozasiz.</>, ru: <>Вот и самое интересное — сегодня вы впервые напишете <b style={{ color: T.ink }}>настоящий код на JavaScript</b>! Всё начинается с <b style={{ color: T.ink }}>переменных</b>. Разберём их за 5 шагов, а в конце напишете сами.</> })}</Mentor>
        {!isNarrow ? <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable> : !showSteps ? <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(true)}>{tr({ uz: "📋 Bugungi 5 qadamni ko'rish", ru: "📋 Посмотреть 5 шагов на сегодня" })}</button>
          </div> : <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
            <button className="btn-soft" style={{ alignSelf: "flex-start" }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Kodni ko'rish", ru: "↩ Посмотреть код" })}</button>
            {StepsBlock}
          </div>}
      </div>
    </Stage>;
};
var Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s2", text: `O'zgaruvchini shunday tasavvur qiling: ustiga nom yozilgan quti. Qutining nomi bor — masalan "ism", ichida esa qiymat turadi — masalan Aziza. Nom orqali qutini istalgan payt topib, ichidagini olasiz. Quti qismlarini bosib ko'ring.`, trigger: "on_mount", waits_for: null }]);
  const PARTS = {
    nom: { label: tr({ uz: "Nom", ru: "Имя" }), role: tr({ uz: "Qutining yorlig'i — uni shu nom orqali chaqirasiz. Masalan: ism, ball, yosh.", ru: "Ярлык коробки — по этому имени вы её и зовёте. Например: ism, ball, yosh." }) },
    qiymat: { label: tr({ uz: "Qiymat", ru: "Значение" }), role: tr({ uz: 'Quti ichida saqlanadigan narsa. Masalan: "Aziza", 1250, 14.', ru: 'То, что хранится внутри коробки. Например: "Aziza", 1250, 14.' }) }
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(/* @__PURE__ */ new Set());
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
  useEffect(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr({ uz: "O'zgaruvchi", ru: "Переменная" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: "Davom etish", ru: "Продолжить" }) : `${seen.size}/2 ${tr({ uz: "qismni ko'ring", ru: "части посмотрите" })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zgaruvchi aslida <span className="italic" style={{ color: T.accent }}>nima</span>?</>, ru: <>Что такое переменная <span className="italic" style={{ color: T.accent }}>на самом деле</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>O'zgaruvchi — bu ustiga <b style={{ color: T.ink }}>yorliq yopishtirilgan quti</b>. Yorlig'i — uning <b style={{ color: T.ink }}>nomi</b> (masalan <span className="mono">ism</span>), ichidagi narsa — <b style={{ color: T.ink }}>qiymati</b> (masalan <span className="mono">"Aziza"</span>). Nomini aytib, ichidagini istalgan payt olasiz. Quti qismlarini bosib ko'ring.</>, ru: <>Переменная — это <b style={{ color: T.ink }}>коробка с наклеенным ярлыком</b>. Ярлык — это её <b style={{ color: T.ink }}>имя</b> (например <span className="mono">ism</span>), а то, что внутри — <b style={{ color: T.ink }}>значение</b> (например <span className="mono">"Aziza"</span>). Назовёте имя — в любой момент получите содержимое. Понажимайте на части коробки.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
              <div style={{ background: T.paper, borderRadius: 16, boxShadow: `0 10px 26px -6px rgba(${T.shadowBase},0.16)`, overflow: "hidden", minWidth: 210 }}>
                <div onClick={() => tap("nom")} style={{ cursor: "pointer", background: active === "nom" ? T.accent : T.ink, color: "#fff", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}><span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 9.5, opacity: 0.65, letterSpacing: "0.12em" }}>{tr({ uz: "NOMI", ru: "ИМЯ" })}</span>📦 ism {seen.has("nom") && <span style={{ marginLeft: "auto" }}>✓</span>}</div>
                <div onClick={() => tap("qiymat")} style={{ cursor: "pointer", padding: "18px 16px", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: "clamp(20px,4vw,28px)", color: active === "qiymat" ? T.accent : T.ink, background: active === "qiymat" ? T.accentSoft : "#fff", transition: "all 0.2s" }}><div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 9.5, opacity: 0.6, letterSpacing: "0.12em", fontWeight: 600, marginBottom: 5 }}>{tr({ uz: "QIYMATI · ICHIDAGI", ru: "ЗНАЧЕНИЕ · ВНУТРИ" })}</div>"Aziza" {seen.has("qiymat") && <span style={{ fontSize: 14, color: T.success }}>✓</span>}</div>
              </div>
            </div>
            <pre className="code-box fade-up delay-2" style={{ textAlign: "center" }}><Kw>let</Kw> <Vr>ism</Vr> <Op>=</Op> <St>"Aziza"</St></pre>
          </Col>
          <Col>
            {active ? <div className="sk-info pop-in" key={active}>
                <span className="sk-tagbig"><span className="sk-wordbadge">{PARTS[active].label}</span></span>
                <p className="body" style={{ color: T.ink, margin: "11px 0 0" }}>{PARTS[active].role}</p>
              </div> : !isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr({ uz: "Quti nomi yoki ichini bosing", ru: "Нажмите на имя коробки или на её содержимое" })}</p></div> : null}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Mana shu — <b>o'zgaruvchi</b>: nomi bor quti. <span className="mono">ism</span> deb chaqirsangiz, ichidagi <span className="mono">"Aziza"</span> ni olasiz.</>, ru: <>✓ Вот это и есть <b>переменная</b>: коробка с именем. Позовёте <span className="mono">ism</span> — получите <span className="mono">"Aziza"</span> изнутри.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s3", text: `Matematikada teng belgisi "teng" degani. Dasturlashda esa u "qutiga joylashtir" degani. Bir qiymat tanlab, nima bo'lishini kuzating.`, trigger: "on_mount", waits_for: null }]);
  const VALUES = ["Aziza", "Bobur", "Dilnoza"];
  const [val, setVal] = useState(null);
  const [read, setRead] = useState(false);
  const [sawNameless, setSawNameless] = useState(false);
  const done = val !== null && read;
  useEffect(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr({ uz: "Qiymat berish", ru: "Присваивание" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: "Davom etish", ru: "Продолжить" }) : val === null ? tr({ uz: "Bir qiymat tanlang", ru: "Выберите значение" }) : tr({ uz: "Qutini o'qing 🤖", ru: "Прочитайте коробку 🤖" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qutiga qiymatni <span className="italic" style={{ color: T.accent }}>qanday</span> solamiz?</>, ru: <>А <span className="italic" style={{ color: T.accent }}>как</span> положить значение в коробку?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Matematikada <b style={{ color: T.ink }}>=</b> — «teng» degani. Dasturlashda esa <b style={{ color: T.ink }}>=</b> — <b style={{ color: T.ink }}>«qutiga joylashtir»</b> degani. Bir qiymat tanlab, nima bo'lishini kuzating.</>, ru: <>В математике <b style={{ color: T.ink }}>=</b> — это «равно». А в программировании <b style={{ color: T.ink }}>=</b> — это <b style={{ color: T.ink }}>«положи в коробку»</b>. Выберите значение и посмотрите, что произойдёт.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Qiymat tanlang", ru: "Выберите значение" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {VALUES.map((v) => <button key={v} className={`chip ${val === v ? "chip-on" : ""}`} onClick={() => setVal(v)}>"{v}"</button>)}
            </div>
            <pre className="code-box fade-up delay-2" style={{ fontSize: "clamp(14px,2.4vw,18px)" }}><Kw>let</Kw> <Vr>ism</Vr> <Op>=</Op> <span className="pop-num" key={val} style={{ color: CODE.str }}>"{val || "..."}"</span></pre>
            <div className="frame fade-up delay-2"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>O'qiymiz: «<span className="mono">"{val || "..."}"</span> ni <span className="mono">ism</span> qutisiga sol».</>, ru: <>Читаем: «положи <span className="mono">"{val || "..."}"</span> в коробку <span className="mono">ism</span>».</> })}</p></div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Natija — quti", ru: "Результат — коробка" })}</p>
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
              {val ? <VarBox name="ism" value={`"${val}"`} valColor={CODE.str} pulse /> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr({ uz: "Qiymat tanlang — qutiga yoziladi", ru: "Выберите значение — оно запишется в коробку" })}</p></div>}
            </div>
            {
    /* OMBORCHI O'QI: nom orqali chaqirib qiymatni chiqarish (robot-qo'l) */
  }
            {val && <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                <button className="btn" onClick={() => setRead(true)} disabled={read} style={{ opacity: read ? 0.6 : 1 }}>🤖 {tr({ uz: <><span className="mono">ism</span> ni o'qi (chaqir)</>, ru: <>прочитать <span className="mono">ism</span> (позвать)</> })}</button>
                {
    /* F-0803-10: matn o'rniga NATIJANING O'ZI — quti nomi → ichidagi qiymat (rasm gapiradi) */
  }
                {read && <div className="pop-in" style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(15px,2.4vw,19px)", fontWeight: 700 }}>
                    <span className="wh-arm" style={{ display: "inline-block" }}>🤖</span>
                    <span style={{ color: T.ink2 }}>ism</span>
                    <span style={{ color: T.ink3 }}>→</span>
                    <span className="pop-num" style={{ color: CODE.str, animationDelay: ".3s", animationFillMode: "both" }}>"{val}"</span>
                  </div>}
                {read && <button className="btn" onClick={() => setSawNameless(true)} disabled={sawNameless} style={{ opacity: sawNameless ? 0.6 : 1 }}>{tr({ uz: "❓ Nomsiz qutini chaqirib ko'ring", ru: "❓ Попробуйте позвать коробку без имени" })}</button>}
                {sawNameless && <div className="frame-dash pop-in" style={{ width: "100%" }}><p className="small" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <><span className="wh-grope" style={{ display: "inline-block" }}>🤖</span> Nomsiz qutini robot-qo'l paypaslab topolmadi — <span className="wh-graygone" style={{ display: "inline-block" }}>bo'sh qaytdi</span>. Shuning uchun har qutiga <b style={{ color: T.ink }}>nom (yorliq)</b> kerak!</>, ru: <><span className="wh-grope" style={{ display: "inline-block" }}>🤖</span> Коробку без имени рука-робот так и не нащупала — <span className="wh-graygone" style={{ display: "inline-block" }}>вернулась пустой</span>. Вот почему каждой коробке нужно <b style={{ color: T.ink }}>имя (ярлык)</b>!</> })}</p></div>}
              </div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Endi <span className="mono">ism</span> ni chaqirsangiz <span className="mono">"{val}"</span> qaytadi.</>, ru: <>✓ Теперь, если позвать <span className="mono">ism</span>, вернётся <span className="mono">"{val}"</span>.</> })}</p></div>}
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
  eyebrow={tr({ uz: "Mashq · 1-savol", ru: "Практика · вопрос 1" })}
  audioText="O'zgaruvchi nima? To'g'ri variantni tanlang."
  questionText={{ uz: "O'zgaruvchi (peremennaya) nima?", ru: "Что такое переменная?" }}
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "O'zgaruvchi nima?", ru: "Что такое переменная?" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: "O'zgaruvchi (peremennaya) nima?", ru: "Что такое переменная?" })}</h2></>}
  options={[{ uz: 'Qiymat saqlaydigan nomlangan "quti"', ru: "«Коробка» с именем, где хранится значение" }, { uz: "Sonlar ustida hisob-kitob amali", ru: "Математическое действие над числами" }, { uz: "Brauzerda ochiladigan sahifa", ru: "Страница, которая открывается в браузере" }, { uz: "Ekranda ko'rinadigan rang turi", ru: "Вид цвета на экране" }]}
  correctIdx={0}
  explainCorrect={{ uz: "To'g'ri! O'zgaruvchi — nomi bor quti: ichida qiymat (matn, raqam...) saqlanadi va siz uni nom orqali chaqirasiz.", ru: "Верно! Переменная — коробка с именем: внутри хранится значение (текст, число…), и вы обращаетесь к ней по имени." }}
  explainWrong={{ 1: { uz: "Yo'q — bu hisoblash emas. O'zgaruvchi qiymat saqlaydigan nomlangan quti.", ru: "Нет — это не вычисление. Переменная — коробка с именем, где хранится значение." }, 2: { uz: "Yo'q — bu sahifa emas. O'zgaruvchi — kod ichidagi qiymat qutisi.", ru: "Нет — это не страница. Переменная — коробка со значением внутри кода." }, 3: { uz: "Yo'q — rang emas. O'zgaruvchi — qiymat saqlaydigan nomlangan quti.", ru: "Нет — не цвет. Переменная — коробка с именем, где хранится значение." }, default: { uz: "O'zgaruvchi — qiymat saqlaydigan nomlangan quti.", ru: "Переменная — коробка с именем, где хранится значение." } }}
/>;
var S5_VALS = [25, 60, 100, 250];
var Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s5", text: `O'yindagi ballingizni eslang — u doim o'zgarib turadi-ku. Bunday o'zgarib turadigan qiymatlar uchun let so'zini ishlatamiz. let qutisiga yangi qiymat-tokenni soling — eski qiymat tushib ketadi, yangisi joylashadi.`, trigger: "on_mount", waits_for: null }]);
  const [box, setBox] = useState(() => storedAnswer?.box || { value: 10 });
  const [refills, setRefills] = useState(storedAnswer?.refills || 0);
  const [falling, setFalling] = useState(null);
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(false);
  const [jolt, setJolt] = useState(false);
  const ball = box.value;
  const done = refills >= 1;
  const place = (v) => {
    if (v === box.value) return;
    setFalling(box.value);
    setBox({ value: v });
    setRefills((r) => r + 1);
    setDrag(null);
    setOver(false);
    setJolt(true);
    setTimeout(() => setJolt(false), 450);
    setTimeout(() => setFalling(null), 560);
  };
  useEffect(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true, box, refills });
  }, [done]);
  return <Stage eyebrow="let" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: "Davom etish", ru: "Продолжить" }) : tr({ uz: "Yangi qiymat soling", ru: "Положите новое значение" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic mono" style={{ color: T.accent }}>let</span> — qiymatni keyin o'zgartirsa bo'ladimi?</>, ru: <><span className="italic mono" style={{ color: T.accent }}>let</span> — можно ли потом изменить значение?</> })}</h2></div>
        <Mentor>{tr({ uz: <>O'yindagi <b style={{ color: T.ink }}>ballingiz</b> doim o'zgarib turadi-ku. Bunday qiymatlar uchun <b style={{ color: T.ink }}>let</b> so'zini ishlatamiz. Qutiga <b style={{ color: T.ink }}>yangi qiymat-tokenni</b> soling (sudrang yoki bosing) — eski qiymat tushib ketadi, yangisi joylashadi.</>, ru: <>Ваш <b style={{ color: T.ink }}>счёт</b> в игре всё время меняется, так ведь? Для таких значений используем слово <b style={{ color: T.ink }}>let</b>. Положите в коробку <b style={{ color: T.ink }}>новый жетон-значение</b> (перетащите или нажмите) — старое выпадет, новое займёт его место.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Yangi qiymat tokeni — qutiga soling", ru: "Новый жетон значения — положите в коробку" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {S5_VALS.map((v) => <button
    key={v}
    draggable
    onDragStart={() => setDrag(v)}
    onDragEnd={() => setDrag(null)}
    onClick={() => place(v)}
    disabled={v === box.value}
    className="mono"
    style={{ cursor: v === box.value ? "default" : "grab", border: "none", borderRadius: 9, padding: "9px 15px", fontWeight: 700, fontSize: 15, background: v === box.value ? T.accentSoft : T.paper, color: CODE.num, opacity: v === box.value ? 0.4 : 1, boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.25)`, transition: "all 0.18s" }}
  >{v}</button>)}
            </div>
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0", position: "relative" }}>
              <div
    onDragOver={(e) => {
      e.preventDefault();
      setOver(true);
    }}
    onDragLeave={() => setOver(false)}
    onDrop={(e) => {
      e.preventDefault();
      if (drag != null) place(drag);
    }}
    className={jolt ? "wh-jolt" : ""}
    style={{ outline: over ? `2px dashed ${T.accent}` : "none", outlineOffset: 4, borderRadius: 16, transition: "outline 0.15s" }}
  >
                <VarBox name="ball" value={ball} valColor={CODE.num} pulse />
              </div>
              {falling != null && <span className="mono wh-fall" style={{ position: "absolute", top: 8, left: "50%", color: CODE.num, fontWeight: 700, fontSize: 18, pointerEvents: "none" }}>{falling} ↓</span>}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Kod", ru: "Код" })}</p>
            <pre className="code-box fade-up" style={{ fontSize: "clamp(13px,2vw,15px)" }}><Kw>let</Kw> <Vr>ball</Vr> <Op>=</Op> <Nm>10</Nm>  <span style={{ color: CODE.comment }}>{"// boshlang'ich"}</span>{"\n"}{refills > 0 && <><Vr>ball</Vr> <Op>=</Op> <Nm>{ball}</Nm>  <span style={{ color: CODE.comment }}>{"// yangilandi"}</span></>}</pre>
            {done ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ <b>let</b> — bu o'zgaradigan quti. Eski qiymat tushdi, yangisi joylashdi. Xohlagancha yangilaysiz!</>, ru: <>✓ <b>let</b> — коробка, которую можно менять. Старое значение выпало, новое встало на место. Обновляйте сколько хотите!</> })}</p></div> : <div className="frame-soft"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Diqqat: ikkinchi marta <span className="mono">let</span> yozilmaydi — quti bor, faqat ichini almashtiramiz.</>, ru: <>Внимание: второй раз <span className="mono">let</span> не пишут — коробка уже есть, мы лишь меняем содержимое.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen5b = (props) => <QuestionScreen
  {...props}
  scope="module-mikro"
  eyebrow={tr({ uz: "Tekshiruv", ru: "Проверка" })}
  audioText="Qiymati keyin o'zgarib turadigan o'zgaruvchini qaysi so'z bilan ochamiz?"
  questionText={{ uz: "Qiymati keyin o'zgaradigan o'zgaruvchini qaysi so'z bilan ochamiz?", ru: "Каким словом создаём переменную, значение которой потом меняется?" }}
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "Mustahkamlash", ru: "Закрепление" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Qiymati keyin <span className="italic" style={{ color: T.accent }}>o'zgaradigan</span> o'zgaruvchini qaysi so'z bilan ochamiz?</>, ru: <>Каким словом создаём переменную, значение которой потом <span className="italic" style={{ color: T.accent }}>меняется</span>?</> })}</h2></>}
  options={["const", "let", "number", "print"]}
  correctIdx={1}
  explainCorrect={{ uz: "To'g'ri! let bilan ochilgan qutining qiymatini keyin istagancha o'zgartirish mumkin.", ru: "Верно! Значение коробки, созданной через let, потом можно менять сколько угодно." }}
  explainWrong={{
    0: { uz: "Yo'q — const o'zgarmas qiymat uchun. O'zgaradigan qiymat uchun let.", ru: "Нет — const для неизменных значений. Для меняющихся — let." },
    2: { uz: "Yo'q — number bunday so'z emas. To'g'risi — let.", ru: "Нет — number не такое слово. Правильно — let." },
    3: { uz: "Yo'q — print bunday so'z emas. O'zgaradigan qiymat uchun let.", ru: "Нет — print не такое слово. Для меняющегося значения — let." },
    default: { uz: "O'zgaradigan qiymat uchun — let.", ru: "Для меняющегося значения — let." }
  }}
/>;
var Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s6", text: `Ba'zi qiymatlar esa hech qachon o'zgarmaydi. Tug'ilgan yilingizni o'ylab ko'ring — u doim bir xil. Bunday qiymatlar uchun const so'zini ishlatamiz. const qutisining ichini o'zgartirib bo'lmaydi. Ishonmaysizmi? Tugmani bosib, o'zgartirishga urinib ko'ring.`, trigger: "on_mount", waits_for: null }]);
  const [tried, setTried] = useState(false);
  const done = tried;
  useEffect(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow="const" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: "Davom etish", ru: "Продолжить" }) : tr({ uz: "O'zgartirishga urining", ru: "Попробуйте изменить" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ba'zi qiymatlar <span className="italic" style={{ color: T.accent }}>o'zgarmasligi</span> kerakmi?</>, ru: <>А если значение <span className="italic" style={{ color: T.accent }}>не должно меняться</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Ba'zi qiymatlar hech qachon o'zgarmaydi: <b style={{ color: T.ink }}>tug'ilgan yilingiz</b> doim bir xil-ku. Bunday qiymatlar uchun <b style={{ color: T.ink }}>const</b> so'zini ishlatamiz — uning ichini o'zgartirib bo'lmaydi. Ishonmaysizmi? Tugmani bosing.</>, ru: <>Некоторые значения не меняются никогда: <b style={{ color: T.ink }}>год вашего рождения</b> всегда один и тот же. Для таких значений используем слово <b style={{ color: T.ink }}>const</b> — его содержимое изменить нельзя. Не верите? Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Quti — o'zgarmas (const)", ru: "Коробка — неизменная (const)" })}</p>
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
              <div className={tried ? "shake-x" : ""} style={{ position: "relative" }}>
                <VarBox name="tugilgan_yil" value={2012} valColor={CODE.num} />
                {tried && <span className="pop-num" style={{ position: "absolute", top: -10, right: -10, fontSize: 22 }}>🔒</span>}
                {tried && <span className="mono wh-reject" style={{ position: "absolute", top: 6, left: "50%", color: CODE.num, fontWeight: 700, fontSize: 17, pointerEvents: "none" }}>2015 ↩</span>}
              </div>
            </div>
            <button className="btn" onClick={() => setTried(true)} style={{ alignSelf: "center" }}>{tr({ uz: "✏️ Qiymatni o'zgartirishga urinish", ru: "✏️ Попытаться изменить значение" })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Kod", ru: "Код" })}</p>
            <pre className="code-box fade-up" style={{ fontSize: "clamp(13px,2vw,15px)" }}><Kw>const</Kw> <Vr>tugilgan_yil</Vr> <Op>=</Op> <Nm>2012</Nm>{"\n"}{tried && <><Vr>tugilgan_yil</Vr> <Op>=</Op> <Nm>2015</Nm>{"\n"}<span className="el-in" style={{ color: T.accent, display: "inline-block" }}>{"❌ Xato: const o'zgarmaydi!"}</span></>}</pre>
            {done ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ko'rdingizmi — <b>const</b> qutini "qulflaydi" 🔒. Qiymat bir marta solinadi va o'zgarmaydi.</>, ru: <>Видели? <b>const</b> «запирает» коробку 🔒. Значение кладётся один раз и больше не меняется.</> })}</p></div> : <div className="frame-soft"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>const = constant = o'zgarmas. Tug'ilgan yil, hafta kunlari soni (7), Pi soni — bularga const.</>, ru: <>const = constant = неизменный. Год рождения, число дней в неделе (7), число Пи — для них const.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s7", text: `Endi eng muhim qoidani mustahkamlaymiz. Qiymat o'zgaradimi — let. O'zgarmaydimi — const. Quyidagi har bir holat uchun to'g'ri so'zni tanlang.`, trigger: "on_mount", waits_for: null }]);
  const CASES = [
    { t: { uz: "O'yindagi ballingiz", ru: "Ваш счёт в игре" }, a: "let", why: { uz: "doim o'zgaradi", ru: "всё время меняется" } },
    { t: { uz: "Tug'ilgan yilingiz", ru: "Год вашего рождения" }, a: "const", why: { uz: "hech o'zgarmaydi", ru: "никогда не меняется" } },
    { t: { uz: "Haftadagi kunlar (7)", ru: "Дней в неделе (7)" }, a: "const", why: { uz: "doim 7", ru: "всегда 7" } }
  ];
  const [ans, setAns] = useState(storedAnswer?.ans || {});
  const done = CASES.every((c, i) => ans[i] === c.a);
  const choose = (i, v) => {
    if (ans[i] === CASES[i].a) return;
    setAns((p) => ({ ...p, [i]: v }));
  };
  useEffect(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true, ans });
  }, [done]);
  return <Stage eyebrow="let vs const" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: "Davom etish", ru: "Продолжить" }) : tr({ uz: "Hammasini to'g'ri tanlang", ru: "Выберите верно для всех" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>let yoki const — <span className="italic" style={{ color: T.accent }}>qaysi birini</span>?</>, ru: <>let или const — <span className="italic" style={{ color: T.accent }}>что выбрать</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Oddiy qoida: qiymat <b style={{ color: T.ink }}>o'zgaradimi</b> — <span className="mono">let</span>. <b style={{ color: T.ink }}>O'zgarmaydimi</b> — <span className="mono">const</span>. Har bir holat uchun to'g'ri so'zni tanlang.</>, ru: <>Простое правило: значение <b style={{ color: T.ink }}>меняется</b> — <span className="mono">let</span>. <b style={{ color: T.ink }}>Не меняется</b> — <span className="mono">const</span>. Выберите верное слово для каждого случая.</> })}</Mentor>
        <Zoomable>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CASES.map((c, i) => {
    const correct = ans[i] === c.a;
    const wrong = ans[i] && ans[i] !== c.a;
    return <div key={i} className={correct ? "ring-green" : ""} style={{ display: "flex", alignItems: "center", gap: 12, background: T.paper, borderRadius: 12, padding: "12px 15px", boxShadow: `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, flexWrap: "wrap" }}>
                <span style={{ flex: 1, minWidth: 140, fontFamily: "'Manrope',sans-serif", fontWeight: 600, color: T.ink }}>{tr(c.t)}</span>
                {correct ? <span className="mono pop-in" style={{ color: T.success, fontWeight: 700, fontSize: 14 }}>✓ {c.a} — {tr(c.why)}</span> : <span style={{ display: "flex", gap: 7 }}>
                    {["let", "const"].map((opt) => <button key={opt} onClick={() => choose(i, opt)} className="mono" style={{ cursor: "pointer", border: "none", borderRadius: 9, padding: "8px 16px", fontWeight: 700, fontSize: 14, background: wrong && ans[i] === opt ? T.accentSoft : T.bg, color: wrong && ans[i] === opt ? T.accent : T.ink, boxShadow: `0 3px 9px -5px rgba(${T.shadowBase},0.2)` }}>{opt}</button>)}
                  </span>}
              </div>;
  })}
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Ajoyib! Ko'pincha <b>const</b> dan boshlanadi — agar qiymat keyin o'zgarishi kerak bo'lsa, <b>let</b> ga o'tasiz.</>, ru: <>✓ Отлично! Чаще всего начинают с <b>const</b> — а если значение должно меняться, переходят на <b>let</b>.</> })}</p></div>}
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s8", text: `Eski kodlarda yana bitta so'zni uchratasiz — var. Bu o'zgaruvchining eng eski usuli, 2015-yilgacha hamma shuni ishlatardi. Lekin uning kamchiliklari bor edi, shuning uchun bugun biz let va const ishlatamiz. var bilan shunchaki tanish bo'lib qo'ying. Tugmani bosib, eski va yangi usulni solishtiring.`, trigger: "on_mount", waits_for: null }]);
  const [era, setEra] = useState("new");
  const [touched, setTouched] = useState(false);
  const done = touched;
  const set = (e) => {
    setEra(e);
    setTouched(true);
  };
  useEffect(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow="var" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: "Davom etish", ru: "Продолжить" }) : tr({ uz: "Ikkalasini ko'ring", ru: "Посмотрите оба" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic mono" style={{ color: T.accent }}>var</span> — eski usul (endi ishlatilmaydi)</>, ru: <><span className="italic mono" style={{ color: T.accent }}>var</span> — старый способ (уже не используется)</> })}</h2></div>
        <Mentor>{tr({ uz: <>Eski kodlarda yana bitta so'zni uchratasiz — <b style={{ color: T.ink }}>var</b>. Bu o'zgaruvchining eng eski usuli (2015-yilgacha). Kamchiliklari borligi uchun bugun biz <b style={{ color: T.ink }}>let</b> va <b style={{ color: T.ink }}>const</b> ishlatamiz. var bilan shunchaki tanish bo'lib qo'ying.</>, ru: <>В старом коде вам встретится ещё одно слово — <b style={{ color: T.ink }}>var</b>. Это самый старый способ создать переменную (до 2015 года). У него были недостатки, поэтому сегодня мы используем <b style={{ color: T.ink }}>let</b> и <b style={{ color: T.ink }}>const</b>. С var просто познакомьтесь.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              <button className={`chip ${era === "old" ? "chip-on" : ""}`} onClick={() => set("old")}>{tr({ uz: "🕰️ Eski (2015 gacha)", ru: "🕰️ Старый (до 2015)" })}</button>
              <button className={`chip ${era === "new" ? "chip-on" : ""}`} onClick={() => set("new")}>{tr({ uz: "✨ Hozir", ru: "✨ Сейчас" })}</button>
            </div>
            <pre className="code-box demo-swap" key={`code-${era}`} style={{ fontSize: "clamp(13px,2.1vw,16px)" }}>
              {era === "old" ? <><Kw>var</Kw> <Vr>ism</Vr> <Op>=</Op> <St>"Aziza"</St>{"\n"}<Kw>var</Kw> <Vr>yosh</Vr> <Op>=</Op> <Nm>14</Nm></> : <><Kw>let</Kw> <Vr>ism</Vr> <Op>=</Op> <St>"Aziza"</St>{"\n"}<Kw>const</Kw> <Vr>yosh</Vr> <Op>=</Op> <Nm>14</Nm></>}
            </pre>
            <p className="el-in" key={`note-${era}`} style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 600, color: era === "old" ? T.accent : T.success }}>{era === "old" ? tr({ uz: "⚠️ Eski usul — kamchiliklari bor edi", ru: "⚠️ Старый способ — у него были недостатки" }) : tr({ uz: "✨ Zamonaviy va ishonchli usul", ru: "✨ Современный и надёжный способ" })}</p>
          </Col>
          <Col>
            <div className="frame fade-up delay-2">
              <p className="eyebrow" style={{ color: T.accent, margin: "0 0 6px" }}>{tr({ uz: "Qisqa xulosa", ru: "Коротко о главном" })}</p>
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">var</span> — eski usul, eski kodlarda ko'rasiz. <br /><span className="mono">let</span> va <span className="mono">const</span> — zamonaviy, ishonchli usul. <b>Siz doim shu ikkitasini ishlating.</b></>, ru: <><span className="mono">var</span> — старый способ, увидите его в старом коде. <br /><span className="mono">let</span> и <span className="mono">const</span> — современный, надёжный способ. <b>Всегда используйте эти два.</b></> })}</p>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Endi uchalasini ham bilasiz: <b>var</b> (eski), <b>let</b> va <b>const</b> (yangi). Tanlov oson — let yoki const.</>, ru: <>Теперь вы знаете все три: <b>var</b> (старый), <b>let</b> и <b>const</b> (новые). Выбор прост — let или const.</> })}</p></div>}
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
  eyebrow={tr({ uz: "Mashq · 2-savol", ru: "Практика · вопрос 2" })}
  audioText="Tug'ilgan yilingiz kabi o'zgarmas qiymat uchun qaysi so'zni ishlatasiz?"
  questionText={{ uz: "Tug'ilgan yilingiz kabi o'zgarmas qiymat uchun qaysi so'zni ishlatasiz?", ru: "Какое слово вы используете для неизменного значения — как год рождения?" }}
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: "Выберите верный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Tug'ilgan yilingiz kabi <span className="italic" style={{ color: T.accent }}>o'zgarmas</span> qiymat uchun qaysi so'zni ishlatasiz?</>, ru: <>Какое слово подойдёт для <span className="italic" style={{ color: T.accent }}>неизменного</span> значения — как год вашего рождения?</> })}</h2></>}
  options={["let", "var", "const", "box"]}
  correctIdx={2}
  explainCorrect={{ uz: "To'g'ri! O'zgarmas qiymat uchun const — u qutini qulflaydi, qiymat o'zgarmaydi.", ru: "Верно! Для неизменного значения — const: он запирает коробку, значение не меняется." }}
  explainWrong={{
    0: { uz: "Yo'q — let o'zgaradigan qiymat uchun. O'zgarmas qiymatga const.", ru: "Нет — let для меняющихся значений. Для неизменного — const." },
    1: { uz: "Yo'q — var eski usul. Zamonaviy o'zgarmas qiymat uchun const.", ru: "Нет — var это старый способ. Для неизменного значения сегодня — const." },
    3: { uz: "Yo'q — box bunday so'z emas. O'zgarmas qiymat uchun const.", ru: "Нет — слова box не существует. Для неизменного значения — const." },
    default: { uz: "O'zgarmas qiymat uchun — const.", ru: "Для неизменного значения — const." }
  }}
/>;
var Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s10", text: `Qutiga turli xil narsa solish mumkin. Matn — masalan ism, qo'shtirnoq ichida yoziladi. Raqam — masalan yosh, qo'shtirnoqsiz. Va ha-yo'q qiymati — true yoki false. Bularni ma'lumot turlari deyiladi. Har birini bosib ko'ring.`, trigger: "on_mount", waits_for: null }]);
  const TYPES = {
    string: { name: { uz: "Matn — string", ru: "Текст — string" }, box: { n: "ism", v: '"Aziza"' }, color: CODE.str, desc: { uz: `Harflar, so'zlar. Doim qo'shtirnoq ichida: "..."`, ru: 'Буквы, слова. Всегда в кавычках: "..."' } },
    number: { name: { uz: "Raqam — number", ru: "Число — number" }, box: { n: "yosh", v: "14" }, color: CODE.num, desc: { uz: "Sonlar, qo'shtirnoqsiz. Ular bilan hisob qilamiz.", ru: "Числа, без кавычек. С ними можно считать." } },
    boolean: { name: { uz: "Ha/yo'q — boolean", ru: "Да/нет — boolean" }, box: { n: "maktabda", v: "true" }, color: CODE.bool, desc: { uz: "Faqat ikki qiymat: true (ha) yoki false (yo'q).", ru: "Только два значения: true (да) или false (нет)." } }
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(/* @__PURE__ */ new Set());
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
  useEffect(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr({ uz: "Ma'lumot turlari", ru: "Типы данных" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: "Davom etish", ru: "Продолжить" }) : `${seen.size}/3 ${tr({ uz: "turni ko'ring", ru: "типа — посмотрите" })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Quti ichida qanday <span className="italic" style={{ color: T.accent }}>qiymatlar</span> bo'ladi?</>, ru: <>Какие <span className="italic" style={{ color: T.accent }}>значения</span> бывают внутри коробки?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Qutiga turli xil narsa sig'adi: <b style={{ color: T.ink }}>matn</b> (qo'shtirnoq ichida), <b style={{ color: T.ink }}>raqam</b> (qo'shtirnoqsiz) va <b style={{ color: T.ink }}>ha/yo'q</b> (true yoki false). Bular — <b style={{ color: T.ink }}>ma'lumot turlari</b>. Har birini bosing.</>, ru: <>В коробку помещается разное: <b style={{ color: T.ink }}>текст</b> (в кавычках), <b style={{ color: T.ink }}>число</b> (без кавычек) и <b style={{ color: T.ink }}>да/нет</b> (true или false). Это — <b style={{ color: T.ink }}>типы данных</b>. Нажмите на каждый.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {Object.keys(TYPES).map((k) => <button key={k} onClick={() => tap(k)} style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer", border: "none", borderRadius: 12, padding: "12px 15px", background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${TYPES[k].color}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: "all 0.18s" }}>
                  <span className="mono" style={{ fontWeight: 700, color: TYPES[k].color, fontSize: 14 }}>{TYPES[k].box.v}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 14, color: T.ink }}>{tr(TYPES[k].name)}</span>
                  {seen.has(k) && <span style={{ marginLeft: "auto", color: T.success, fontSize: 14 }}>✓</span>}
                </button>)}
            </div>
          </Col>
          <Col>
            {active ? <div className="fade-step" style={{ display: "flex", flexDirection: "column", gap: 12 }} key={active}>
                <div style={{ display: "flex", justifyContent: "center" }}><VarBox name={TYPES[active].box.n} value={TYPES[active].box.v} valColor={TYPES[active].color} small pulse /></div>
                <div className="sk-info"><span className="sk-tagbig"><span className="sk-wordbadge">{tr(TYPES[active].name)}</span></span><p className="body" style={{ color: T.ink, margin: "10px 0 0" }}>{tr(TYPES[active].desc)}</p></div>
              </div> : !isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr({ uz: "Bir turni bosing", ru: "Нажмите на один из типов" })}</p></div> : null}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Uchta asosiy tur: <b>matn</b>, <b>raqam</b>, <b>boolean</b>. Eng muhim farq — qo'shtirnoq!</>, ru: <>✓ Три основных типа: <b>текст</b>, <b>число</b>, <b>boolean</b>. Главное отличие — кавычки!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s11", text: `Endi eng muhim sirni ochaman. Qo'shtirnoq bitta narsani butunlay o'zgartiradi. Agar raqamlar qo'shtirnoqsiz bo'lsa — qo'shiladi: besh qo'shuv besh — o'n. Lekin qo'shtirnoq ichida bo'lsa — ular matn, shunchaki yopishtiriladi: besh-besh — besh yuz emas, ellik besh degani — "55". Ikki tugmani bosib solishtiring.`, trigger: "on_mount", waits_for: null }]);
  const [mode, setMode] = useState("num");
  const [seen, setSeen] = useState(/* @__PURE__ */ new Set(["num"]));
  const done = seen.size >= 2;
  const set = (m) => {
    setMode(m);
    setSeen((prev) => {
      const n = new Set(prev);
      n.add(m);
      return n;
    });
  };
  const isNum = mode === "num";
  useEffect(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr({ uz: "Matn vs Raqam", ru: "Текст vs Число" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: "Davom etish", ru: "Продолжить" }) : tr({ uz: "Ikkalasini ko'ring", ru: "Посмотрите оба" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Besh qo'shuv besh — <span className="italic" style={{ color: T.accent }}>qachon</span> o'n emas?</>, ru: <>Пять плюс пять — <span className="italic" style={{ color: T.accent }}>когда</span> это не десять?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bitta <b style={{ color: T.ink }}>qo'shtirnoq</b> hammasini o'zgartiradi! Raqamlar qo'shtirnoqsiz bo'lsa — <b style={{ color: T.ink }}>qo'shiladi</b> (5+5=10). Qo'shtirnoq ichida bo'lsa — ular matn, <b style={{ color: T.ink }}>yopishtiriladi</b> ("5"+"5"="55"). Solishtiring.</>, ru: <>Одни <b style={{ color: T.ink }}>кавычки</b> меняют всё! Числа без кавычек — <b style={{ color: T.ink }}>складываются</b> (5+5=10). А в кавычках это текст — он <b style={{ color: T.ink }}>склеивается</b> ("5"+"5"="55"). Сравните.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: "flex", gap: 8 }}>
              <button className={`chip ${isNum ? "chip-on" : ""}`} onClick={() => set("num")}>{tr({ uz: "🔢 Raqam", ru: "🔢 Число" })}</button>
              <button className={`chip ${!isNum ? "chip-on" : ""}`} onClick={() => set("str")}>{tr({ uz: "🔤 Matn", ru: "🔤 Текст" })}</button>
            </div>
            <pre className="code-box demo-swap" key={mode} style={{ fontSize: "clamp(14px,2.4vw,18px)" }}>
              {isNum ? <><Nm>5</Nm> <Op>+</Op> <Nm>5</Nm>  <span style={{ color: CODE.comment }}>{"// raqamlar"}</span></> : <><St>"5"</St> <Op>+</Op> <St>"5"</St>  <span style={{ color: CODE.comment }}>{"// matn"}</span></>}
            </pre>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Natija", ru: "Результат" })}</p>
            <div className="demo-swap" key={mode + "r"} style={{ background: T.paper, borderRadius: 14, padding: "22px", textAlign: "center", boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)` }}>
              <div className="pop-num" key={mode} style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(36px,8vw,52px)", color: isNum ? CODE.num : T.accent }}>{isNum ? "10" : '"55"'}</div>
              <p className="body" style={{ margin: "6px 0 0", color: T.ink2 }}>{isNum ? tr({ uz: "Qo'shildi — chunki raqam", ru: "Сложилось — потому что числа" }) : tr({ uz: "Yopishdi — chunki matn", ru: "Склеилось — потому что текст" })}</p>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Esda saqlang: <b>qo'shtirnoq bor → matn</b>, <b>qo'shtirnoq yo'q → raqam</b>. Bu — eng ko'p chalkashtiradigan joy!</>, ru: <>✓ Запомните: <b>есть кавычки → текст</b>, <b>нет кавычек → число</b>. Тут путаются чаще всего!</> })}</p></div>}
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
  eyebrow={tr({ uz: "Mashq · 3-savol", ru: "Практика · вопрос 3" })}
  audioText="Quyidagilardan qaysi biri RAQAM (number)?"
  questionText={{ uz: "Qaysi biri RAQAM (number)?", ru: "Что из этого — ЧИСЛО (number)?" }}
  question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: "Выберите верный ответ" })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Qaysi biri <span className="italic" style={{ color: T.accent }}>RAQAM</span> (number)?</>, ru: <>Что из этого — <span className="italic" style={{ color: T.accent }}>ЧИСЛО</span> (number)?</> })}</h2></>}
  options={['"25"', "25", '"yigirma"', "true"]}
  correctIdx={1}
  explainCorrect={{ uz: "To'g'ri! 25 — qo'shtirnoqsiz, demak raqam (number). U bilan hisob qilsa bo'ladi.", ru: "Верно! 25 — без кавычек, значит число (number). С ним можно считать." }}
  explainWrong={{
    0: { uz: `"25" — qo'shtirnoqda, demak bu matn (string), raqam emas.`, ru: '"25" — в кавычках, значит это текст (string), а не число.' },
    2: { uz: `"yigirma" — qo'shtirnoqdagi so'z, bu matn (string).`, ru: '"yigirma" — слово в кавычках, это текст (string).' },
    3: { uz: "true — bu boolean (ha/yo'q), raqam emas. Raqam — qo'shtirnoqsiz 25.", ru: "true — это boolean (да/нет), не число. Число — 25 без кавычек." },
    default: { uz: "Qo'shtirnoqsiz son — raqam: 25.", ru: "Число без кавычек — 25." }
  }}
/>;
var S13_COLOR = (t) => t === "str" ? CODE.str : t === "bool" ? CODE.bool : CODE.num;
var S13_BLOCKS = [
  { kw: "let", name: "ism", val: '"Aziza"', t: "str" },
  { kw: "let", name: "yosh", val: "14", t: "num" },
  { kw: "const", name: "shahar", val: '"Toshkent"', t: "str" },
  { kw: "let", name: "ball", val: "0", t: "num" },
  { kw: "const", name: "maktab", val: '"Coddycamp"', t: "str" },
  { kw: "let", name: "oqiyaptimi", val: "true", t: "bool" }
];
var Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s13", text: `Endi navbat sizga — o'zingiz haqingizda bir nechta o'zgaruvchi yarating. Pastdagi bloklarni bosib qo'shing: ism, yosh, shahar... Kamida 3 ta o'zgaruvchi yig'ing.`, trigger: "on_mount", waits_for: null }]);
  const MAX = 6;
  const [items, setItems] = useState(() => storedAnswer?.items || []);
  const done = items.length >= 3;
  const add = (b) => {
    if (items.length >= MAX || items.find((x) => x.name === b.name)) return;
    setItems((prev) => [...prev, b]);
  };
  const reset = () => setItems([]);
  useEffect(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true, items });
  }, [done]);
  return <Stage eyebrow={tr({ uz: "Amaliyot · o'zgaruvchilar", ru: "Практика · переменные" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: "Davom etish", ru: "Продолжить" }) : `${tr({ uz: "Kamida 3 ta", ru: "Минимум 3" })} (${items.length}/3)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(8px,1.2vw,12px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'z o'zgaruvchilaringizni <span className="italic" style={{ color: T.accent }}>yarating</span></>, ru: <><span className="italic" style={{ color: T.accent }}>Создайте</span> свои переменные</> })}</h2></div>
        <Mentor>{tr({ uz: <>Endi navbat sizga — o'zingiz haqingizda o'zgaruvchilar yarating. Bloklarni bosib qo'shing: ism, yosh, shahar... Kamida <b style={{ color: T.ink }}>3 ta</b> o'zgaruvchi yig'ing.</>, ru: <>Теперь ваша очередь — создайте переменные о себе. Нажимайте блоки, чтобы добавить: ism, yosh, shahar... Соберите минимум <b style={{ color: T.ink }}>3</b> переменные.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Bloklar — bosib qo'shing", ru: "Блоки — нажмите, чтобы добавить" })}</p>
            <div className="fade-up delay-1" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {S13_BLOCKS.map((b, i) => <button key={i} className="gchip" disabled={items.length >= MAX || !!items.find((x) => x.name === b.name)} onClick={() => add(b)}>
                  <span className="mono" style={{ color: T.accent }}>{b.kw}</span> {b.name}
                </button>)}
              {items.length > 0 && <button className="gchip" onClick={reset}>{tr({ uz: "↺ Tozalash", ru: "↺ Очистить" })}</button>}
            </div>
            <p className="body fade-up delay-2" style={{ margin: "2px 0 0", color: T.ink3, fontSize: 13 }}>{tr({ uz: <><b style={{ color: T.ink2 }}>Maslahat:</b> o'zgaradiganiga let, o'zgarmasiga const.</>, ru: <><b style={{ color: T.ink2 }}>Совет:</b> для изменяемого — let, для неизменного — const.</> })}</p>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Sizning kodingiz", ru: "Ваш код" })}</p>
            <pre className="code-box" style={{ minHeight: 110 }}>
              {items.length === 0 ? <span style={{ color: CODE.comment }}>{tr({ uz: "// blok qo'shing…", ru: "// добавьте блок…" })}</span> : items.map((b, i) => <span key={i} className="el-in" style={{ display: "block" }}><Kw>{b.kw}</Kw> <Vr>{b.name}</Vr> <Op>=</Op> <span style={{ color: S13_COLOR(b.t) }}>{b.val}</span></span>)}
            </pre>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Zo'r! Siz {items.length} ta o'zgaruvchi yaratdingiz — har biri nomi va qiymati bor quti.</>, ru: <>✓ Отлично! Вы создали {items.length} переменные — каждая это коробка с именем и значением.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s14", text: `AI sizga kod yozib berdi, lekin bittasida xato bor — dastur ishlamayapti. Yaxshilab qarang: bir o'zgaruvchining matn qiymati qo'shtirnoqsiz qolib ketibdi. Xato qatorni toping va bosing.`, trigger: "on_mount", waits_for: { type: "error_found" } }]);
  const [picked, setPicked] = useState(storedAnswer ? "ism" : null);
  const [fixed, setFixed] = useState(!!storedAnswer);
  const found = picked === "ism";
  const done = fixed;
  const pickIsm = () => {
    if (found) return;
    setPicked("ism");
    audio.triggerEvent("error_found");
    if (!audio.muted) setTimeout(() => {
      const e = getAudioEngine();
      if (e && !audio.muted) e.pushOneOff(`Topdingiz! Aziza qo'shtirnoqsiz — kompyuter uni o'zgaruvchi deb o'ylab, topolmayapti. Qo'shtirnoq qo'shamiz.`);
    }, 300);
  };
  const fix = () => {
    setFixed(true);
    if (!audio.muted) setTimeout(() => {
      const e = getAudioEngine();
      if (e && !audio.muted) e.pushOneOff(`Tuzatildi! Endi "Aziza" matn bo'ldi — kod ishlaydi.`);
    }, 300);
  };
  useEffect(() => {
    if (done && storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, [done]);
  return <Stage eyebrow={tr({ uz: "Debugging", ru: "Отладка" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: "Davom etish", ru: "Продолжить" }) : found ? tr({ uz: "Endi tuzating", ru: "Теперь исправьте" }) : tr({ uz: "Xatoni toping", ru: "Найдите ошибку" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kod ishlamadi — <span className="italic" style={{ color: T.accent }}>nega</span>?</>, ru: <>Код не заработал — <span className="italic" style={{ color: T.accent }}>почему</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI kod yozib berdi, lekin dastur <b style={{ color: T.ink }}>ishlamayapti</b>. Yaxshilab qarang: bir o'zgaruvchining <b style={{ color: T.ink }}>matn qiymati qo'shtirnoqsiz</b> qolib ketibdi. Xato qatorni toping va bosing.</>, ru: <>ИИ написал вам код, но программа <b style={{ color: T.ink }}>не работает</b>. Присмотритесь: у одной переменной <b style={{ color: T.ink }}>текстовое значение осталось без кавычек</b>. Найдите строку с ошибкой и нажмите на неё.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-1">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: "Mana, o'zgaruvchilaringiz:", ru: "Вот ваши переменные:" })}</span></div>
              <div className="ai-code">
                <div className="ai-line" style={{ cursor: "default" }}><Kw>let</Kw> <Vr>yosh</Vr> <Op>=</Op> <Nm>14</Nm></div>
                <div className={`ai-line ${found ? fixed ? "ok" : "bad" : ""}`} onClick={pickIsm}><Kw>let</Kw> <Vr>ism</Vr> <Op>=</Op> {fixed ? <St>"Aziza"</St> : <span style={{ color: CODE.text }}>Aziza</span>} {!fixed && <span style={{ color: CODE.comment }}>{"// ?"}</span>}</div>
                <div className="ai-line" style={{ cursor: "default" }}><Kw>const</Kw> <Vr>shahar</Vr> <Op>=</Op> <St>"Toshkent"</St></div>
              </div>
              {!found && <p className="ai-prompt">{tr({ uz: "Qaysi qatorda xato? Bosing.", ru: "В какой строке ошибка? Нажмите." })}</p>}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: "flex-start" }} onClick={fix}>{tr({ uz: `🔧 "Aziza" ga qo'shtirnoq qo'shish`, ru: '🔧 Добавить кавычки к "Aziza"' })}</button>}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: "normal", fontWeight: 600 }}>{tr({ uz: "✓ Tuzatildi — endi kod ishlaydi!", ru: "✓ Исправлено — теперь код работает!" })}</p>}
            </div>
          </Col>
          <Col>
            {!found && (picked && picked !== "ism" ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu qator to'g'ri. Yana qarang: qaysi matn qiymatida <b>qo'shtirnoq yetishmayapti</b>?</>, ru: <>Эта строка верная. Посмотрите ещё: какому текстовому значению <b>не хватает кавычек</b>?</> })}</p></div> : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Eslang: matn qiymati doim <b style={{ color: T.ink }}>qo'shtirnoq ichida</b> bo'lishi kerak. Qaysi qatorda yo'q?</>, ru: <>Вспомните: текстовое значение всегда должно быть <b style={{ color: T.ink }}>в кавычках</b>. В какой строке их нет?</> })}</p></div>)}
            {found && !fixed && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: "✓ Topdingiz!", ru: "✓ Нашли!" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">Aziza</span> qo'shtirnoqsiz — kompyuter uni o'zgaruvchi deb o'ylab, topolmayapti. To'g'risi: <span className="mono">"Aziza"</span>. Chap tugmani bosing →</>, ru: <><span className="mono">Aziza</span> без кавычек — компьютер думает, что это переменная, и не может её найти. Правильно: <span className="mono">"Aziza"</span>. Нажмите кнопку слева →</> })}</p></div>}
            {fixed && <>
              <p className="flow-label">{tr({ uz: "Endi ishlaydi", ru: "Теперь работает" })}</p>
              <div style={{ display: "flex", justifyContent: "center" }}><VarBox name="ism" value={'"Aziza"'} valColor={CODE.str} small /></div>
              <div className="takeaway fade-step"><div className="ta-bulb">🛠️</div><p className="ta-h">{tr({ uz: "Topdingiz va tuzatdingiz — bu debugging!", ru: "Нашли и исправили — это и есть отладка!" })}</p><p className="ta-sub">{tr({ uz: "Matn = qo'shtirnoq ichida", ru: "Текст = в кавычках" })}</p></div>
            </>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "s15", text: `Mana, eng muhim lahza. Shu paytgacha qutilarni qo'l bilan to'ldirdingiz — endi birinchi qutingizni so'z bilan yozasiz. Ismingizni saqlaydigan o'zgaruvchi yozing: let, keyin nom, teng belgisi va qo'shtirnoqda ismingiz. Masalan: let ism teng qo'shtirnoqda Aziza.`, trigger: "on_mount", waits_for: { type: "typed_ok" } }]);
  const [value, setValue] = useState(storedAnswer?.picked || "");
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const v = value.trim();
  const m = v.match(/^(let|const|var)\s+([A-Za-z_]\w*)\s*=\s*(.+)$/);
  const hasKw = /^(let|const|var)\b/.test(v);
  const hasName = /^(let|const|var)\s+[A-Za-z_]\w*/.test(v);
  const hasEq = /^(let|const|var)\s+[A-Za-z_]\w*\s*=/.test(v);
  const valid = !!m && m[3].trim().length > 0;
  const nm = valid ? m[2] : "";
  const vv = valid ? m[3].trim() : "";
  const valIsStr = /^".*"$/.test(vv) || /^'.*'$/.test(vv);
  useEffect(() => {
    if (valid && !passed) {
      setPassed(true);
      onAnswer(screen, { correct: true, picked: value });
      audio.triggerEvent("typed_ok");
      if (!audio.muted) setTimeout(() => {
        const e = getAudioEngine();
        if (e && !audio.muted) e.pushOneOff(`Zo'r! Birinchi o'zgaruvchingizni o'zingiz yozdingiz. Tabriklayman!`);
      }, 300);
    }
  }, [valid]);
  return <Stage eyebrow={tr({ uz: "Yakuniy · amaliy", ru: "Финал · практика" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? tr({ uz: "Davom etish", ru: "Продолжить" }) : tr({ uz: "O'zgaruvchini yozing", ru: "Напишите переменную" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: o'zgaruvchini <span className="italic" style={{ color: T.accent }}>o'zingiz</span> yozing.</>, ru: <>Последний шаг: напишите переменную <span className="italic" style={{ color: T.accent }}>сами</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: T.ink }}>Shu paytgacha qutilarni qo'l bilan to'ldirdingiz — endi birinchi qutingizni so'z bilan yozasiz.</b> Ismingizni saqlaydigan o'zgaruvchi yozing: <span className="mono">let</span>, keyin nom, <span className="mono">=</span> va qo'shtirnoqda ismingiz. Masalan: <span className="mono">let ism = "Aziza"</span>.</>, ru: <><b style={{ color: T.ink }}>До сих пор вы заполняли коробки руками — теперь создадите первую коробку словами.</b> Напишите переменную, которая хранит ваше имя: <span className="mono">let</span>, затем имя, <span className="mono">=</span> и ваше имя в кавычках. Например: <span className="mono">let ism = "Aziza"</span>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <input className="fade-up delay-1" value={value} onChange={(e) => setValue(e.target.value)} placeholder={'let ism = "Aziza"'} spellCheck={false} autoCapitalize="off" autoCorrect="off" style={{ width: "100%", fontFamily: "'JetBrains Mono', monospace", fontSize: 16, padding: "14px 16px", borderRadius: 12, border: "none", background: T.paper, color: T.ink, outline: "none", transition: "box-shadow 0.2s", boxShadow: valid ? `0 0 0 2px ${T.success}, 0 8px 20px -8px rgba(${T.shadowBase},0.2)` : `0 4px 14px -6px rgba(${T.shadowBase},0.16)` }} />
            <div className="fade-up delay-2" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tagpill" style={{ opacity: hasKw ? 1 : 0.4 }}>{hasKw ? "✓" : "1"} let / const</span>
              <span className="tagpill" style={{ opacity: hasName ? 1 : 0.4 }}>{hasName ? "✓" : "2"} {tr({ uz: "nom", ru: "имя" })}</span>
              <span className="tagpill" style={{ opacity: hasEq ? 1 : 0.4 }}>{hasEq ? "✓" : "3"} =</span>
              <span className="tagpill" style={{ opacity: valid ? 1 : 0.4 }}>{valid ? "✓" : "4"} {tr({ uz: "qiymat", ru: "значение" })}</span>
            </div>
            {passed ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Zo'r! Bu — to'liq, to'g'ri o'zgaruvchi. Siz haqiqiy JavaScript yozdingiz!</>, ru: <>✓ Класс! Это полная, правильная переменная. Вы написали настоящий JavaScript!</> })}</p></div> : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr({ uz: <>Matn qiymatini qo'shtirnoqqa oling: <span className="mono">"..."</span>. Raqam uchun qo'shtirnoq shart emas.</>, ru: <>Текстовое значение возьмите в кавычки: <span className="mono">"..."</span>. Числу кавычки не нужны.</> })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "natija — quti", ru: "результат — коробка" })}</p>
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
              {valid ? <VarBox name={nm} value={vv} valColor={valIsStr ? CODE.str : CODE.num} /> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: "center", fontStyle: "italic", margin: 0 }}>{tr({ uz: "To'liq yozing — quti shu yerda paydo bo'ladi", ru: "Допишите до конца — коробка появится здесь" })}</p></div>}
            </div>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>;
};
var JS_FLASHCARDS = [
  { front: { uz: "Qiymatni saqlab turadigan nomlangan «quti» qanday ataladi?", ru: "Как называется «коробка» с именем, которая хранит значение?" }, back: { uz: "o'zgaruvchi", ru: "переменная" }, note: { uz: "quti + nom + ichidagi qiymat", ru: "коробка + имя + значение внутри" } },
  { front: { uz: "Qiymati keyin o'zgaradigan qutini qaysi so'z bilan ochamiz?", ru: "Каким словом создаём коробку, значение которой потом меняется?" }, back: "let", note: { uz: "let ball = 10, keyin ball = 25", ru: "let ball = 10, потом ball = 25" } },
  { front: { uz: "Qiymati hech qachon o'zgarmaydigan qutini qaysi so'z ochadi?", ru: "Какое слово создаёт коробку, значение которой никогда не меняется?" }, back: "const", note: { uz: "const yil = 2011 — quti qulflangan", ru: "const yil = 2011 — коробка заперта" } },
  { front: { uz: "Qutiga qiymat solish uchun qaysi belgi ishlatiladi?", ru: "Каким знаком кладут значение в коробку?" }, back: "=", note: { uz: 'u "sol" degani — "teng" degani emas', ru: "он значит «положи», а не «равно»" } },
  { front: { uz: "Matn (so'z, gap) turi qanday ataladi?", ru: "Как называется тип для текста (слов, фраз)?" }, back: "string", note: { uz: `qo'shtirnoq ichida yoziladi: "Aziza"`, ru: 'пишется в кавычках: "Aziza"' } },
  { front: { uz: "Raqam turi qanday ataladi?", ru: "Как называется тип для чисел?" }, back: "number", note: { uz: "qo'shtirnoqsiz yoziladi: 14, 3.14", ru: "пишется без кавычек: 14, 3.14" } },
  { front: { uz: "true va false qaysi turga kiradi?", ru: "К какому типу относятся true и false?" }, back: "boolean", note: { uz: "faqat ikki qiymat: rost yoki yolg'on", ru: "всего два значения: истина или ложь" } },
  { front: { uz: "«14» qo'shtirnoq ichida yozilsa, qaysi tur bo'ladi?", ru: "Если «14» написано в кавычках, какой это тип?" }, back: "string", note: { uz: "raqamga o'xshaydi, lekin bu matn", ru: "похоже на число, но это текст" } },
  { front: { uz: "Bugun ishlatilmaydigan eski so'z qaysi?", ru: "Какое старое слово сегодня уже не используют?" }, back: "var", note: { uz: "o'rniga let yoki const yozing", ru: "вместо него пишите let или const" } },
  { front: { uz: "let bilan const orasidagi asosiy farq nima?", ru: "В чём главная разница между let и const?" }, back: { uz: "let o'zgaradi, const o'zgarmaydi", ru: "let меняется, const — нет" }, note: { uz: "o'yin bali — let, tug'ilgan yil — const", ru: "счёт в игре — let, год рождения — const" } },
  { front: { uz: "O'zgaruvchi nomi raqam bilan boshlansa bo'ladimi?", ru: "Может ли имя переменной начинаться с цифры?" }, back: { uz: "Yo'q, bo'lmaydi", ru: "Нет, нельзя" }, note: { uz: "bo'sh joy ham bo'lmaydi: tugilgan_yil", ru: "пробелов тоже нельзя: tugilgan_yil" } },
  { front: { uz: "const PI = 3.14 dan keyin PI = 3 yozsangiz nima bo'ladi?", ru: "Что будет, если после const PI = 3.14 написать PI = 3?" }, back: { uz: "Xato beradi", ru: "Будет ошибка" }, note: { uz: "const qutisi bir marta to'ldiriladi", ru: "коробка const заполняется один раз" } }
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
  const [queue, setQueue] = useState(() => cards.map((_, i) => i));
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [exiting, setExiting] = useState(null);
  const swapRef = useRef(0);
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
  if (!card) return <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: "Hammasini bilasiz!", ru: "Вы знаете всё!" })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: "karta yodlandi", ru: "карточек выучено" })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: "↻ Qaytadan takrorlash", ru: "↻ Повторить заново" })}</button></div>;
  return <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda", ru: "↻ Учу" })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: "✓ Bildim", ru: "✓ Знаю" })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${known / total * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === "knew" ? "out-knew" : ""} ${exiting === "again" ? "out-again" : ""}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? "flip" : ""}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span><span className="fc-cue">{tr({ uz: "Javobni o'ylang", ru: "Подумайте над ответом" })} 🤔 <span className="fc-tap">{tr({ uz: "bosing", ru: "нажмите" })}</span></span></div>
          <div className="fc-face fc-back">{fcAnswer(tr(card.back))}{card.note && <span className="fc-note">{tr(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped ? <div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>{tr({ uz: "✗ Takrorlash", ru: "✗ Повторить" })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>{tr({ uz: "✓ Bildim", ru: "✓ Знаю" })}</button></div> : <p className="fc-hint">{tr({ uz: "👆 Kartani bosing — javobni ko'rasiz", ru: "👆 Нажмите на карточку — увидите ответ" })}</p>}
    </div>;
}
var ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: "sflash", text: `O'zingizni sinab ko'ring. Har kartada bir savol — javobini o'ylang, keyin kartani bosing.`, trigger: "on_mount", waits_for: null }]);
  useEffect(() => {
    if (storedAnswer === void 0) onAnswer(screen, { correct: true, picked: true });
  }, []);
  return <Stage eyebrow={tr({ uz: "Takrorlash", ru: "Повторение" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={false} label={tr({ uz: "Yakunlash →", ru: "Завершить →" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(10px,1.6vw,16px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={JS_FLASHCARDS} /></div>
      </div>
    </Stage>;
};
var Screen16 = ({ screen, answers, achievements, onReset, onPrev, onFinish, onHomework }) => {
  const [hwOpen, setHwOpen] = useState(false);
  const [hwCharge, setHwCharge] = useState(false);
  const fireHw = () => {
    if (hwCharge || hwOpen) return;
    setHwCharge(true);
    setTimeout(() => {
      setHwOpen(true);
      setHwCharge(false);
    }, 500);
  };
  const _gate = useContext(LiveGateCtx) || {};
  const _live = _gate.live;
  const [arena, setArena] = useState(false);
  const [arenaSolo, setArenaSolo] = useState(false);
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
  const audio = useAudio([{ id: "s16", text: "Tabriklaymiz — bugun siz birinchi haqiqiy JavaScript kodingizni yozdingiz! Eslab qoling: o'zgaruvchi — nomlangan quti, let o'zgaradi, const o'zgarmaydi, qiymatlar esa matn, raqam yoki boolean bo'ladi. Keyingi darsda o'zgaruvchilarni ekranga chiqarib, ular bilan amallar bajaramiz.", trigger: "on_mount", waits_for: null }]);
  const RECAP = [{ uz: "O'zgaruvchi — qiymat saqlaydigan nomlangan quti", ru: "Переменная — коробка с именем, где хранится значение" }, { uz: 'Qiymat berish: = ("qutiga sol")', ru: "Присваивание: = («положи в коробку»)" }, { uz: "let — o'zgaradi, const — o'zgarmas", ru: "let — меняется, const — неизменный" }, { uz: "var — eski usul, bugun let/const", ru: "var — старый способ, сегодня let/const" }, { uz: "Turlar: matn (string), raqam (number), boolean", ru: "Типы: текст (string), число (number), boolean" }];
  const HOMEWORK = [{ b: "ism", t: { uz: "— let bilan, qo'shtirnoqda", ru: "— через let, в кавычках" } }, { b: "yosh", t: { uz: "— let bilan, qo'shtirnoqsiz raqam", ru: "— через let, число без кавычек" } }, { b: "tugilgan_yil", t: { uz: "— const bilan", ru: "— через const" } }];
  const correct = SCORED_IDX.filter((i) => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return <Stage eyebrow={tr({ uz: "Tayyor", ru: "Готово" })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: "clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr({ uz: "Qaytadan", ru: "Заново" })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: "auto", padding: "clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)", fontSize: "clamp(13px,1.5vw,15px)" }}>{tr({ uz: "Yakunlash ✓", ru: "Завершить ✓" })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: "Dars tugadi", ru: "Урок завершён" })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Birinchi <span className="italic" style={{ color: T.accent }}>JavaScript</span> kodingizni yozdingiz.</>, ru: <>Вы написали свой первый код на <span className="italic" style={{ color: T.accent }}>JavaScript</span>.</> })}</h2>{
    /* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */
  }</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? "ready" : ""}`}>
          <CsWordmark
    stats={false}
    disabled={studentWait}
    liveOn={studentLive}
    onClick={studentWait ? void 0 : openArena}
    hint={studentWait ? tr({ uz: "⏳ Mentorni kuting", ru: "⏳ Ждите наставника" }) : void 0}
  />
        </div>
        {arena && <QuizArena live={_live || { mode: "self" }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: "50%", background: T.success, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✓</span> {tr({ uz: "Endi siz bilasiz", ru: "Теперь вы знаете" })}</div><ul className="recap">{RECAP.map((r, i) => <li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>)}</ul></div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${hwCharge ? "charging" : ""}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, "--d": `${k.d}s` }}>{tr(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr({ uz: "Uyga vazifa", ru: "Домашнее задание" })}</span>
            <span className="hw-big-s">{tr({ uz: "Amaliy topshiriqni bajarish →", ru: "Выполнить практическое задание →" })}</span>
          </button>
        </div>
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: "Uyga vazifa", ru: "Домашнее задание" })}</div><p className="body" style={{ margin: "0 0 10px", color: T.ink }}>{tr({ uz: "O'zingiz haqingizda 3 ta o'zgaruvchi yozing:", ru: "Напишите 3 переменные о себе:" })}</p><ul>{HOMEWORK.map((h, i) => <li key={i}><b className="mono">{h.b}</b> <span className="t">{tr(h.t)}</span></li>)}</ul><p className="hw-note">{tr({ uz: "Avval qo'lda yozing, keyin to'g'ri-noto'g'risini tekshiring. Keyingi darsda ularni ekranga chiqaramiz! 🚀", ru: "Сначала напишите сами, потом проверьте, всё ли верно. На следующем уроке выведем их на экран! 🚀" })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: "Nishonlaringiz", ru: "Ваши значки" })} — {achievements ? achievements.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
    const got = !!(achievements && achievements.has(id));
    return <div key={id} className={`ach-badge ${got ? "got" : "locked"}`} title={tr(a.desc)}>
                <span className="ach-badge-ic">{got ? a.icon : "🔒"}</span>
                <span className="ach-badge-name">{a.name}</span>
                {got && <span className="ach-badge-desc">{tr(a.desc)}</span>}
              </div>;
  })}
          </div>
        </div>}
      </div>
    </Stage>;
};
var Q_LABELS = { 4: { uz: "1 — O'zgaruvchi nima", ru: "1 — Что такое переменная" }, 6: { uz: "2 — let (o'zgaradigan)", ru: "2 — let (меняется)" }, 10: { uz: "3 — const (o'zgarmas)", ru: "3 — const (неизменный)" }, 13: { uz: "4 — Raqam (number)", ru: "4 — Число (number)" }, 16: { uz: "5 — O'zgaruvchi yoz", ru: "5 — Напиши переменную" } };
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
var INLINE_KEYS = { s4: 0, s5b: 1, s9: 2, s12: 1, s15: -1 };
var ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === "student" || live.mode === "mentor") && live.pin);
  const livePin = live ? live.pin : null;
  const [players, setPlayers] = useState([]);
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
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
  return <Stage eyebrow={tr({ uz: "Natijalar", ru: "Результаты" })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: "Davom etish", ru: "Продолжить" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: "clamp(14px,2.2vw,20px)" }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: "Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.", ru: "Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉." })}</p></div>
          </div> : !loaded ? <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: "Natijalar yuklanmoqda…", ru: "Загружаем результаты…" })}</p> : board.length === 0 ? <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: "К этой сессии пока никто не подключился." })}</p></div> : <>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верно)</> })}</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: "🏆 To'liq reyting", ru: "🏆 Полный рейтинг" })}</div>
              <div className="pod-list">
                {board.map((b, i) => <div key={b.id} className={`pod-row ${live.playerId === b.id ? "me" : ""}`}>
                    <span className="mono pod-rank">{i + 1}</span>
                    <span className="pod-row-name">{b.nickname}</span>
                    <span className="pod-row-dots">{SCORED_IDX.map((q) => {
    const a = rows.find((r) => r.player_id === b.id && r.screen_idx === q);
    return <span key={q} className={`pod-dot ${a ? a.correct ? "ok" : "bad" : ""}`} title={tr(Q_LABELS[q])} />;
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
              <div className="card-lbl" style={{ color: T.blue }}>{tr({ uz: "📊 Savollar bo'yicha", ru: "📊 По вопросам" })}</div>
              <div className="pod-qstats">
                {SCORED_IDX.map((q) => {
    const qa = rows.filter((r) => r.screen_idx === q);
    const okN = qa.filter((r) => r.correct).length;
    const pct = qa.length ? Math.round(okN / qa.length * 100) : 0;
    const hard = qa.length >= 2 && pct < 50;
    return <div key={q} className="qstat-row">
                      <span className="qstat-lbl">{tr(Q_LABELS[q]) || `#${q}`}{hard && " ⚠️"}</span>
                      <span className="mstats-track"><span className="mstats-fill" style={{ width: `${pct}%`, background: hard ? T.accent : T.success }} /></span>
                      <span className="mono qstat-n">{okN}/{qa.length}</span>
                    </div>;
  })}
              </div>
              {live.mode === "mentor" && <p className="small" style={{ margin: "10px 0 0", color: T.ink2 }}>{tr({ uz: "⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.", ru: "Вопросы с ⚠️ — темы, где класс споткнулся. Советуем объяснить их ещё раз." })}</p>}
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
  { ch: "let", l: 6, t: 18, s: 40, c: "rgba(203,173,255,0.16)", d: 19, dl: 0 },
  { ch: "const", l: 82, t: 12, s: 32, c: "rgba(255,110,70,0.15)", d: 23, dl: 1.5 },
  { ch: "=", l: 9, t: 74, s: 44, c: "rgba(203,173,255,0.14)", d: 27, dl: 0.8 },
  { ch: '"..."', l: 76, t: 70, s: 30, c: "rgba(80,200,255,0.14)", d: 21, dl: 2.2 },
  { ch: "10", l: 46, t: 86, s: 34, c: "rgba(203,173,255,0.13)", d: 25, dl: 1.1 },
  { ch: "{ }", l: 66, t: 24, s: 30, c: "rgba(203,173,255,0.11)", d: 17, dl: 0.4 },
  { ch: ";", l: 24, t: 36, s: 28, c: "rgba(203,173,255,0.12)", d: 20, dl: 1.9 },
  { ch: "true", l: 92, t: 46, s: 24, c: "rgba(120,235,175,0.13)", d: 24, dl: 1.3 },
  { ch: "//", l: 2, t: 46, s: 28, c: "rgba(203,173,255,0.10)", d: 26, dl: 2.6 }
];
var QUIZ_BANK = [
  { q: { uz: 'let ism = "Aziza" — bu yerda «quti»ning nomi qaysi?', ru: 'let ism = "Aziza" — где здесь имя «коробки»?' }, opts: ["ism", '"Aziza"', "let", "="], correct: 0 },
  { q: { uz: "let yosh = 14 — 14 qanday ma'lumot turi?", ru: "let yosh = 14 — какой тип данных у 14?" }, opts: [{ uz: "string (matn)", ru: "string (текст)" }, { uz: "number (raqam)", ru: "number (число)" }, "boolean", "const"], correct: 1 },
  { q: { uz: "Qaysi qiymat string (matn) hisoblanadi?", ru: "Какое значение считается string (текстом)?" }, opts: ["42", "true", '"Toshkent"', "3.14"], correct: 2 },
  { q: { uz: "const PI = 3.14 dan keyin PI = 3 desak nima bo'ladi?", ru: "Что будет, если после const PI = 3.14 написать PI = 3?" }, opts: [{ uz: "Xato beradi — const o'zgarmaydi", ru: "Будет ошибка — const не меняется" }, { uz: "PI qiymati 3 ga o'zgaradi", ru: "Значение PI изменится на 3" }, { uz: "Ikkala qiymat ham saqlanib qoladi", ru: "Сохранятся оба значения" }, { uz: "PI o'chib ketadi", ru: "PI удалится" }], correct: 0 },
  { q: { uz: "Kodda = belgisi aslida nimani bildiradi?", ru: "Что на самом деле означает знак = в коде?" }, opts: [{ uz: "Ikki qiymat bir-biriga teng", ru: "Два значения равны друг другу" }, { uz: "Qutiga qiymat sol (o'zlashtir)", ru: "Положи значение в коробку (присвой)" }, { uz: "Ikki qiymatni o'zaro taqqosla", ru: "Сравни два значения между собой" }, { uz: "Qutidagi qiymatni o'chir", ru: "Удали значение из коробки" }], correct: 1 },
  { q: { uz: "true va false qaysi ma'lumot turiga tegishli?", ru: "К какому типу данных относятся true и false?" }, opts: ["string", "number", "boolean", "const"], correct: 2 },
  { q: { uz: "Qaysi holatda const ishlatgan ma'qul?", ru: "В каком случае лучше использовать const?" }, opts: [{ uz: "Haftadagi kunlar soni (7)", ru: "Число дней в неделе (7)" }, { uz: "O'yin bali (o'zgarib turadi)", ru: "Счёт в игре (всё время меняется)" }, { uz: "Foydalanuvchi kiritgan matn", ru: "Текст, который ввёл пользователь" }, { uz: "Jon soni jangda", ru: "Число жизней в бою" }], correct: 0 },
  { q: { uz: "let ball = 10 keyin ball = 25 yozildi. ball qutisida endi nima?", ru: "Написали let ball = 10, потом ball = 25. Что теперь в коробке ball?" }, opts: ["10", "25", { uz: "10 va 25", ru: "10 и 25" }, { uz: "Xato", ru: "Ошибка" }], correct: 1 },
  { q: { uz: "let va const o'rtasidagi asosiy farq nima?", ru: "В чём главная разница между let и const?" }, opts: [{ uz: "let raqamga, const matnga mo'ljallangan", ru: "let для чисел, const для текста" }, { uz: "const koddan ancha tezroq ishlaydi", ru: "const работает намного быстрее" }, { uz: "let keyin o'zgaradi, const o'zgarmaydi", ru: "let потом меняется, const — нет" }, { uz: "Ikkalasi aynan bir xil, farqi yo'q", ru: "Они совершенно одинаковые" }], correct: 2 },
  { q: { uz: `"14" (qo'shtirnoqda) qanday tur?`, ru: '"14" (в кавычках) — какой это тип?' }, opts: [{ uz: "number — u bilan hisob qilinadi", ru: "number — с ним можно считать" }, "const", "boolean", { uz: "string — bu matn", ru: "string — это текст" }], correct: 3 },
  { q: { uz: "var haqida to'g'ri gap qaysi?", ru: "Какое утверждение о var верно?" }, opts: [{ uz: "Zamonaviy standart, doim ishlating", ru: "Современный стандарт, всегда используйте" }, { uz: "const bilan bir xil narsa", ru: "То же самое, что и const" }, { uz: "Faqat raqamlar uchun", ru: "Только для чисел" }, { uz: "Eski usul — bugun let/const afzal", ru: "Старый способ — сегодня лучше let/const" }], correct: 3 },
  { q: { uz: `let shahar = "Toshkent" da qiymat qo'shtirnoqda. Nega?`, ru: 'В let shahar = "Toshkent" значение в кавычках. Почему?' }, opts: [{ uz: "Chunki u raqam", ru: "Потому что это число" }, { uz: "Qo'shtirnoq shart emas edi", ru: "Кавычки были не обязательны" }, { uz: "Chunki u boolean", ru: "Потому что это boolean" }, { uz: "Chunki u matn (string)", ru: "Потому что это текст (string)" }], correct: 3 }
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
  const R = 26, C2 = 2 * Math.PI * R;
  const frac = Math.max(0, Math.min(1, remaining / QUIZ_MS));
  const sec = Math.ceil(remaining / 1e3);
  const col = remaining > 1e4 ? "#2BD97C" : remaining > 5e3 ? "#FFC94D" : "#FF5A5A";
  return <div className={`qz-timer ${remaining <= 5e3 && remaining > 0 ? "urgent" : ""}`}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6" />
        <circle cx="32" cy="32" r={R} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round" strokeDasharray={C2} strokeDashoffset={C2 * (1 - frac)} transform="rotate(-90 32 32)" style={{ transition: "stroke-dashoffset 0.12s linear, stroke 0.4s" }} />
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
  const [charge, setCharge] = useState(false);
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
          <span className="cs-hud-i"><b>{QUIZ_BANK.length}</b> {tr({ uz: "SAVOL", ru: "ВОПРОСОВ" })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i"><b>{QUIZ_MS / 1e3}</b> {tr({ uz: "SONIYA", ru: "СЕКУНД" })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i">🏆 PODIUM</span>
        </div>}
      {hint && <span className={`cs-enter ${disabled ? "wait" : ""}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>;
};
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
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
    const TOK = ["let", "const", "=", "{ }", "//", "14", '"..."', ";"];
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
  const [soloMode, setSoloMode] = useState(!!startSolo);
  const solo = soloMode || !isMentor && !isStudent;
  const soloRef = useRef(solo);
  soloRef.current = solo;
  const [phase, setPhase] = useState("lobby");
  const [qi, setQi] = useState(-1);
  const [remaining, setRemaining] = useState(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState({});
  const [players, setPlayers] = useState([]);
  const [qRows, setQRows] = useState([]);
  const [answeredN, setAnsweredN] = useState(0);
  const [classEnded, setClassEnded] = useState(false);
  const seenQRef = useRef(-1);
  const qStartRef = useRef(0);
  const deadlineRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  useEffect(() => {
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
  useEffect(() => {
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
  useEffect(() => {
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
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: "Тест ещё не закончен — если закроете, ученики останутся ждать на арене.\nПотом можно вернуться ровно сюда через «⚔️ Продолжить».\n\nВсё равно закрыть?" }))) return;
    }
    onClose();
  };
  return <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>)}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr({ uz: "Yopish", ru: "Закрыть" })}>✕</button>

      {
    /* QUTQARUV: jonli dars tugadi — o'quvchi osilib qolmaydi, mashq rejimida davom etadi */
  }
      {classEnded && isStudent && !solo && phase !== "done" && <div className="qz-endnote fade-step">
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: "⚠️ Живой урок завершён — продолжите тест самостоятельно:" })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: "📖 Mashq rejimida davom etish", ru: "📖 Продолжить в режиме тренировки" })}</button>
        </div>}

      {
    /* ===== LOBBY ===== */
  }
      {phase === "lobby" && <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub">{tr({ uz: <>{QUIZ_BANK.length} savol · har biriga {QUIZ_MS / 1e3} soniya · tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!</>, ru: <>{QUIZ_BANK.length} вопросов · по {QUIZ_MS / 1e3} секунд на каждый · чем быстрее верный ответ — тем больше баллов. Серия верных ответов даёт бонус 🔥!</> })}</p>
          {!solo && <div className="qz-lobby-players">
              {players.map((p) => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? "me" : ""}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: "Ждём учеников…" })}</span>}
            </div>}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl("q", 0)}>{tr({ uz: "▶ Testni boshlash", ru: "▶ Начать тест" })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: "⏳ Mentor testni boshlashini kuting…", ru: "⏳ Ждите, пока наставник начнёт тест…" })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>{tr({ uz: "▶ Boshlash", ru: "▶ Начать" })}</button>}
        </div>}

      {
    /* ===== SAVOL ===== */
  }
      {phase === "q" && Q && <div className="qz-view qz-qview fade-step" key={`q${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: "Savol", ru: "Вопрос" })} <b>{qi + 1}</b>/{QUIZ_BANK.length}</span>
            <QzTimer remaining={remaining} />
            {isMentor ? <span className="qz-ansn">📨 {answeredN}/{players.length}</span> : <span className="qz-ansn">{streakUpTo(qi - 1) >= 2 ? `🔥 x${streakUpTo(qi - 1)}` : " "}</span>}
          </div>
          <h2 className="qz-q">{tr(Q.q)}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
    const pickedThis = my && my.picked === i;
    return <button key={i} className={`qz-tile ${my ? pickedThis ? "picked" : "faded" : ""}`} style={{ background: QUIZ_COLORS[i] }} disabled={isMentor || !!my} onClick={() => answer(i)}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr(o))}</span>
                  {pickedThis && <span className="qz-pbadge">✔</span>}
                </button>;
  })}
          </div>
          {my && !isMentor && !solo && <p className="qz-waitmsg">{tr({ uz: "✔ Javob qabul qilindi — natijani kuting…", ru: "✔ Ответ принят — ждите результат…" })}</p>}
          {isMentor && <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">{tr({ uz: "✓ Hamma javob berdi!", ru: "✓ Все ответили!" })}</span>}
              <button className="qz-btn" onClick={() => ctrl("r", qi)}>{tr({ uz: "⏹ Natijani ochish", ru: "⏹ Открыть результат" })}</button>
            </div>}
        </div>}

      {
    /* ===== NATIJA (reveal) ===== */
  }
      {phase === "reveal" && Q && <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: "Savol", ru: "Вопрос" })} <b>{qi + 1}</b>/{QUIZ_BANK.length} — {tr({ uz: "natija", ru: "результат" })}</span>
          </div>
          <h2 className="qz-q">{tr(Q.q)}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
    const win = i === Q.correct;
    const pickedThis = my && my.picked === i;
    return <div key={i} className={`qz-tile rv ${win ? "win" : "lose"} ${pickedThis ? "picked" : ""}`} style={{ background: QUIZ_COLORS[i] }}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr(o))}</span>
                  <span className="qz-cnt">{win ? "✓ " : ""}{counts[i]}</span>
                </div>;
  })}
          </div>
          {!isMentor && <div className={`qz-res ${my?.correct ? "good" : "bad"}`}>
              {my?.correct ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr({ uz: "ball", ru: "баллов" })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ""}</span></> : <span className="qz-res-t">{my ? tr({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: "Ошибка — 0 баллов. Возьмёте своё на следующем! 💪" }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: "Время вышло — 0 баллов. Будьте быстрее! ⏱" })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: "Siz hozir:", ru: "Вы сейчас:" })} {myRank + 1}-{tr({ uz: "o'rin", ru: "место" })}</span>}
            </div>}
          {!solo && <div className="qz-board">
              <div className="qz-board-h">🏆 TOP-5</div>
              {board.slice(0, 5).map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                  <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                  {b.maxStreak >= 2 && <span className="qz-bstreak">🔥</span>}
                  <span className="qz-bpts">{b.pts}</span>
                </div>)}
            </div>}
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl("done", qi) : ctrl("q", qi + 1)}>{lastQ ? tr({ uz: "🏁 G'oliblarni e'lon qilish", ru: "🏁 Объявить победителей" }) : tr({ uz: "Keyingi savol →", ru: "Следующий вопрос →" })}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: "🏁 Natijani ko'rish", ru: "🏁 Посмотреть результат" }) : tr({ uz: "Keyingi →", ru: "Дальше →" })}</button>}
        </div>}

      {
    /* ===== YAKUN — PODIUM ===== */
  }
      {phase === "done" && <div className="qz-view fade-step">
          <Confetti />
          <div className="qz-brand sm"><QzBolt size={48} /><span className="qz-wm">Code<span className="qz-wm-h">Strike</span></span></div>
          <h2 className="qz-h">{tr({ uz: "🏆 Test yakunlandi!", ru: "🏆 Тест завершён!" })}</h2>
          {solo ? <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: "ball", ru: "баллов" })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: "верно" })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: "eng uzun streak", ru: "лучшая серия" })} 🔥x${soloScore.maxStreak}` : ""}</p>
              <button className="qz-btn big" onClick={soloReplay}>{tr({ uz: "↻ Qayta ishlash", ru: "↻ Пройти ещё раз" })}</button>
            </div> : <>
              <div className="qz-pod">
                {[1, 0, 2].map((rank) => {
    const b = board[rank];
    return <div key={rank} className={`qz-pod-col p${rank + 1} ${b && b.id === live.playerId ? "me" : ""}`}>
                      {rank === 0 && <span className="qz-crown">👑</span>}
                      <span className="qz-pod-medal">{["🥇", "🥈", "🥉"][rank]}</span>
                      <span className="qz-pod-name">{b ? b.nickname : "—"}</span>
                      {b && <span className="qz-pod-pts">{b.pts} {tr({ uz: "ball", ru: "баллов" })} · {b.ok}/{QUIZ_BANK.length}</span>}
                      <div className="qz-pod-bar" />
                    </div>;
  })}
              </div>
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: <>Siz — <b>{myRank + 1}-o'rin</b> · {board[myRank].pts} ball</>, ru: <>Вы — <b>{myRank + 1}-е место</b> · {board[myRank].pts} баллов</> })}</p>}
              <div className="qz-board wide">
                {board.map((b, i) => <div key={b.id} className={`qz-brow ${b.id === live.playerId ? "me" : ""}`}>
                    <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                    {b.maxStreak >= 2 && <span className="qz-bstreak">🔥x{b.maxStreak}</span>}
                    <span className="qz-bok">{b.ok}/{QUIZ_BANK.length}</span>
                    <span className="qz-bpts">{b.pts}</span>
                  </div>)}
              </div>
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: "↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)", ru: "↻ Пройти тест ещё раз — тренировка (в таблицу не идёт)" })}</button>}
            </>}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: "Arenani yopish", ru: "Закрыть арену" })}</button>
        </div>}
    </div>;
}
var ACHIEVEMENTS = {
  boxkeeper: { icon: "📦", name: "Box Keeper", desc: { uz: "O'zgaruvchi — nomlangan quti ekanini bildingiz", ru: "Вы узнали, что переменная — коробка с именем" } },
  lockmaster: { icon: "🔒", name: "Lock Master", desc: { uz: "const bilan qutini qulflashni o'rgandingiz", ru: "Вы научились запирать коробку через const" } },
  typedetective: { icon: "🔍", name: "Type Detective", desc: { uz: "Ma'lumot turini (matn / raqam) aniqladingiz", ru: "Вы определили тип данных (текст / число)" } },
  graduate: { icon: "🏆", name: "Level Up!", desc: { uz: "Birinchi JavaScript darsini to'liq yakunladingiz", ru: "Вы полностью прошли первый урок JavaScript" } }
};
var ACH_TRIGGERS = { s4: "boxkeeper", s9: "lockmaster", s12: "typedetective" };
function AchCelebrate({ ach, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4e3);
    return () => clearTimeout(t);
  }, []);
  return <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr({ uz: "Yangi nishon", ru: "Новый значок" })}: ${ach.name}`}>
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
          {ach.desc && <span className="acu-desc">{tr(ach.desc)}</span>}
        </div>
        <span className="acu-tap">{tr({ uz: "bosib davom eting", ru: "нажмите, чтобы продолжить" })}</span>
      </div>
    </div>;
}
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}
function MentorPracticeOverlay({ entry, live, onClose }) {
  const [view, setView] = useState("watch");
  const [data, setData] = useState({ players: null, rows: [] });
  const doneIdx = PRACTICE_DONE_BASE + entry.fromScreen;
  useEffect(() => {
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
  if (view === "demo") {
    return <div style={{ position: "fixed", inset: 0, zIndex: 2e3, background: T.bg }}>
        <HtmlCompiler lang={__lang} task={entry.task} starterCode={entry.starter} onContinue={() => setView("watch")} onBack={() => setView("watch")} />
      </div>;
  }
  const total = data.players ? data.players.length : 0;
  const doneN = data.rows.length;
  const allIn = total > 0 && doneN >= total;
  const doneIds = new Set(data.rows.map((r) => r.player_id));
  return <div className="mp-overlay">
      <div className="mp-card">
        <div className="mp-eyebrow">✍️ {tr({ uz: "Amaliyot · jonli", ru: "Практика · живой урок" })}</div>
        <h2 className="mp-title">{tr(entry.task.title)}</h2>
        <p className="mp-brief">{tr(entry.task.brief)}</p>
        <div className="mp-flow">
          <span className="mp-step cur">1 · {tr({ uz: "O'quvchilar o'z qurilmasida yozmoqda", ru: "Ученики пишут на своих устройствах" })}</span>
          <span className="mp-arr">→</span>
          <span className="mp-step">2 · {tr({ uz: "Mentor doskada yozib ko'rsatadi", ru: "Ментор пишет и показывает на доске" })}</span>
        </div>
        {data.players === null ? <p className="mstats-wait">{tr({ uz: "Ulanish…", ru: "Подключение…" })}</p> : <div className="mstats" style={{ marginTop: 2 }}>
            <div className="mstats-head">
              <span className="mstats-lbl">👨‍🎓 {tr({ uz: "Praktikani tugatdi", ru: "Завершили практику" })}</span>
              <span className="mstats-n">{allIn ? tr({ uz: "✓ Hamma tugatdi!", ru: "✓ Все закончили!" }) : <>{tr({ uz: "Tugatdi:", ru: "Закончили:" })} <b>{doneN}</b> / {total}</>}</span>
            </div>
            <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? "full" : ""}`} style={{ width: `${total ? Math.round(doneN / total * 100) : 0}%` }} /></div>
            {total > 0 && <div className="mstats-waitrow" style={{ marginTop: 10 }}>
                {data.players.map((p) => <span key={p.id} className="mstats-wait-chip" style={doneIds.has(p.id) ? { background: T.successSoft, color: T.success, fontWeight: 700 } : void 0}>{doneIds.has(p.id) ? "✓ " : "✏️ "}{p.nickname}</span>)}
              </div>}
            {total === 0 && <p className="mstats-wait">{tr({ uz: "Hali o'quvchi qo'shilmagan — ular praktikani boshlashi bilan bu yerda ✓ chiqadi…", ru: "Пока никто не присоединился — как только ученики начнут практику, здесь появятся ✓…" })}</p>}
          </div>}
        <div className="mp-actions">
          <button className="mp-demo" onClick={() => setView("demo")}>🖊 {tr({ uz: "Doskada yozib ko'rsatish", ru: "Показать на доске" })}</button>
          <button className="mp-next" onClick={onClose}>{tr({ uz: "Keyingi mavzuga", ru: "К следующей теме" })} →</button>
        </div>
        <p className="mp-tip">{tr({ uz: "💡 Ko'pchilik tugatgach, aynan shu mashqni doskada birga yozing — shunda o'quvchilar o'zini tekshiradi va mavzu mustahkamlanadi.", ru: "💡 Когда большинство закончит, напишите это же упражнение на доске вместе — так ученики проверят себя, и тема закрепится." })}</p>
      </div>
    </div>;
}
var TASK_BALL = {
  eyebrow: { uz: "Praktika · let", ru: "Практика · let" },
  title: { uz: "Birinchi qutingizni yozing", ru: "Напишите свою первую коробку" },
  brief: { uz: "`let` bilan `ball` nomli quti oching va ichiga `0` soling. Keyin ballni `25` ga o'zgartiring va `console.log(ball)` yozing — pastdagi konsolda `25` chiqadi.", ru: "Создайте через `let` коробку с именем `ball` и положите в неё `0`. Затем измените ball на `25` и напишите `console.log(ball)` — в консоли внизу появится `25`." },
  files: [
    { name: "script.js", lang: "js", starter: `// Bu yerga yozing
` }
  ],
  requirements: [
    { id: "let", label: "let ball = 0", check: C.js(/let\s+ball\s*=/, { uz: "`let ball = 0` deb yozing", ru: "Напишите `let ball = 0`" }) },
    { id: "log", label: { uz: "konsolda 25 chiqdi", ru: "в консоли появилось 25" }, check: C.logs("25", { uz: "Ballni o'zgartiring (`ball = 25`) va `console.log(ball)` yozing", ru: "Измените ball (`ball = 25`) и напишите `console.log(ball)`" }) }
  ]
};
var TASK_QUOTES = {
  eyebrow: { uz: "Praktika · qo'shtirnoq", ru: "Практика · кавычки" },
  title: { uz: "Qo'shtirnoq nima qiladi?", ru: "Что делают кавычки?" },
  brief: { uz: 'Ikki qator yozing: `console.log(5 + 5)` va `console.log("5" + "5")`. Konsolda ikki xil natija chiqadi — o\'zingiz ko\'ring: `10` va `55`.', ru: 'Напишите две строки: `console.log(5 + 5)` и `console.log("5" + "5")`. В консоли будут два разных результата — увидите сами: `10` и `55`.' },
  files: [
    { name: "script.js", lang: "js", starter: `// Bu yerga yozing
` }
  ],
  requirements: [
    { id: "num", label: { uz: "raqamlar qo'shildi → 10", ru: "числа сложились → 10" }, check: C.logs("10", { uz: "Qo'shtirnoqsiz yozing: `console.log(5 + 5)`", ru: "Напишите без кавычек: `console.log(5 + 5)`" }) },
    { id: "str", label: { uz: "matnlar yopishdi → 55", ru: "тексты склеились → 55" }, check: C.logs("55", { uz: 'Qo\'shtirnoq ichida yozing: `console.log("5" + "5")`', ru: 'Напишите в кавычках: `console.log("5" + "5")`' }) }
  ]
};
var TASK_QUTILAR = {
  eyebrow: { uz: "Praktika · o'zgaruvchilar", ru: "Практика · переменные" },
  title: { uz: "O'zingiz haqingizda 3 ta quti", ru: "Три коробки о себе" },
  brief: { uz: "Uch quti yozing: `ism` — `let` bilan, qo'shtirnoqda; `yosh` — `let` bilan, qo'shtirnoqsiz raqam; `tugilgan_yil` — `const` bilan (u hech qachon o'zgarmaydi).", ru: "Напишите три коробки: `ism` — через `let`, в кавычках; `yosh` — через `let`, число без кавычек; `tugilgan_yil` — через `const` (он никогда не меняется)." },
  files: [
    { name: "script.js", lang: "js", starter: `// Bu yerga yozing
` }
  ],
  requirements: [
    { id: "ism", label: 'let ism = "..."', check: C.js(/let\s+ism\s*=\s*["'][^"']+["']/, { uz: 'Ismni qo\'shtirnoqqa oling: `let ism = "Aziza"`', ru: 'Возьмите имя в кавычки: `let ism = "Aziza"`' }) },
    { id: "yosh", label: "let yosh = 14", check: C.js(/let\s+yosh\s*=\s*\d/, { uz: "Yoshni qo'shtirnoqsiz yozing: `let yosh = 14`", ru: "Возраст пишите без кавычек: `let yosh = 14`" }) },
    { id: "yil", label: "const tugilgan_yil = 2011", check: C.js(/const\s+tugilgan_yil\s*=\s*\d/, { uz: "O'zgarmas qiymat uchun `const tugilgan_yil = 2011`", ru: "Для неизменного значения: `const tugilgan_yil = 2011`" }) }
  ]
};
var PRACTICE_AFTER = {
  6: { task: TASK_BALL, starter: "" },
  // 1) let quti + o'zgartirish → console
  13: { task: TASK_QUOTES, starter: "" },
  // 2) qo'shtirnoq: 10 va 55
  16: { task: TASK_QUTILAR, starter: "" }
  // 3) yakuniy: 3 quti (uy vazifasi bilan bir xil)
};
function JsVarsLesson({ lang: langProp, onFinished, onPractice }) {
  const lang = langProp || "uz";
  __lang = lang;
  const savedRef = useRef(void 0);
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
  const [screen, setScreen] = useState(() => saved ? Math.min(Math.max(saved.screen || 0, 0), TOTAL_SCREENS - 1) : 0);
  const [answers, setAnswers] = useState(() => saved && saved.answers || {});
  const [practice, setPractice] = useState(null);
  const [mentorPractice, setMentorPractice] = useState(null);
  const startTimeRef = useRef(saved?.startedAt || Date.now());
  const earnedRef = useRef(new Set(saved?.earned || []));
  const [earned, setEarned] = useState(() => new Set(saved?.earned || []));
  const [achToasts, setAchToasts] = useState([]);
  const achKeyRef = useRef(0);
  const earn = useCallback((id) => {
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts((t) => [...t, { id, k: ++achKeyRef.current }]);
  }, []);
  useEffect(() => {
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
  const advance = () => setScreen((s) => {
    let n = Math.min(s + 1, TOTAL_SCREENS - 1);
    if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
    return n;
  });
  const runPractice = (entry, fromScreen) => {
    const done = () => {
      if (live && live.mode === "student") live.submitAnswer(PRACTICE_DONE_BASE + fromScreen, `practice-${fromScreen}`, 0, true, 0);
      earn("coder");
      pracClear(LESSON_META.lessonId);
      setPractice(null);
      advance();
    };
    if (typeof onPractice === "function") Promise.resolve(onPractice(entry.task)).then(done);
    else {
      pracWrite(LESSON_META.lessonId, { kind: `s${fromScreen}`, screen: fromScreen });
      setPractice({ ...entry, done, codeKey: codeKeyOf(LESSON_META.lessonId, `s${fromScreen}`) });
    }
  };
  const openHomeworkPractice = () => {
    const entry = { task: TASK_QUTILAR, starter: "" };
    if (typeof onPractice === "function") Promise.resolve(onPractice(entry.task)).catch(() => {
    });
    else {
      pracWrite(LESSON_META.lessonId, { kind: "hw" });
      setPractice({ ...entry, codeKey: codeKeyOf(LESSON_META.lessonId, "hw"), done: () => {
        pracClear(LESSON_META.lessonId);
        setPractice(null);
      } });
    }
  };
  useEffect(() => {
    if (typeof onPractice === "function") return;
    const p = pracRead(LESSON_META.lessonId);
    if (!p) return;
    if (p.kind === "hw") {
      openHomeworkPractice();
      return;
    }
    const entry = PRACTICE_AFTER[p.screen];
    if (entry) runPractice(entry, p.screen);
    else pracClear(LESSON_META.lessonId);
  }, []);
  const next = () => {
    const entry = PRACTICE_AFTER[screen];
    if (!entry) {
      advance();
      return;
    }
    if (!(live && (live.mode === "mentor" || live.mode === "student" && live.status !== "ended" && live.mentorAlive))) {
      advance();
      return;
    }
    if (live.mode === "mentor") {
      setMentorPractice({ ...entry, fromScreen: screen });
      advance();
    } else runPractice(entry, screen);
  };
  const prev = () => setScreen((s) => {
    let n = Math.max(s - 1, 0);
    if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0);
    return n;
  });
  const recordAnswer = (idx, data) => {
    setAnswers((a) => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && _m.scored && _m.scope === "final" && data && data.correct && live.mode === "student") live.submitAnswer(idx, _m.id, 0, true, 0);
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]);
  };
  const reset = () => {
    progClear(LESSON_META.lessonId);
    pracClear(LESSON_META.lessonId);
    setAnswers({});
    setScreen(0);
    setPractice(null);
    setMentorPractice(null);
    startTimeRef.current = Date.now();
  };
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned]);
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === "student" && live.status !== "ended" && live.mentorAlive;
  const locked = isStudentLive && screen + 1 > live.mentorScreen;
  useEffect(() => {
    live.reportScreen(screen);
  }, [screen, live.mode, live.pin]);
  useEffect(() => {
    if (screen === TOTAL_SCREENS - 1) earn("graduate");
  }, [screen, earn]);
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
      answers: SCREEN_META.map((s, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === "function") onFinished(payload);
  };
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenPodium, ScreenFlashcards, Screen16];
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
        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }

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

        /* ── Jonli demo animatsiyalari ── */
        @keyframes pop-in { 0% { opacity: 0; transform: scale(.82) translateY(10px); } 55% { opacity: 1; transform: scale(1.05) translateY(0); } 100% { transform: scale(1); } }
        .pop-in { animation: pop-in .42s cubic-bezier(.34,1.4,.4,1); }
        @keyframes pop-num { 0% { transform: scale(.5); opacity: 0; } 60% { transform: scale(1.18); opacity: 1; } 100% { transform: scale(1); } }
        .pop-num { animation: pop-num .5s cubic-bezier(.34,1.5,.4,1); display: inline-block; }
        @keyframes drop-in { 0% { opacity: 0; transform: translateY(-16px) scale(.8); } 60% { opacity: 1; transform: translateY(3px) scale(1.05); } 100% { transform: translateY(0) scale(1); } }
        .drop-in { animation: drop-in .5s cubic-bezier(.34,1.4,.4,1); }
        @keyframes shake-x { 0%,100% { transform: translateX(0); } 18% { transform: translateX(-6px); } 38% { transform: translateX(6px); } 58% { transform: translateX(-4px); } 78% { transform: translateX(4px); } }
        .shake-x { animation: shake-x .45s ease; }
        @keyframes ring-green { 0% { box-shadow: 0 0 0 0 rgba(31,122,77,.5); } 70% { box-shadow: 0 0 0 16px rgba(31,122,77,0); } 100% { box-shadow: 0 0 0 0 rgba(31,122,77,0); } }
        @keyframes ring-red { 0% { box-shadow: 0 0 0 0 rgba(255,79,40,.5); } 70% { box-shadow: 0 0 0 16px rgba(255,79,40,0); } 100% { box-shadow: 0 0 0 0 rgba(255,79,40,0); } }
        .ring-green { animation: ring-green 1.3s ease-out; } .ring-red { animation: ring-red 1.3s ease-out; }
        @keyframes flow-y { 0% { transform: translateY(-3px); opacity: .45; } 50% { transform: translateY(3px); opacity: 1; } 100% { transform: translateY(-3px); opacity: .45; } }
        .flow-y { animation: flow-y 1.1s ease-in-out infinite; display: inline-block; }

        /* ── 📦 OMBORCHI (warehouse) harakatlari — Ijodkor brifi ── */
        /* quti seskanishi: token qutiga tushganda quti "plop" bilan silkidi */
        @keyframes wh-jolt { 0%,100% { transform: translateY(0); } 22% { transform: translateY(5px); } 52% { transform: translateY(-2px); } 78% { transform: translateY(1px); } }
        .wh-jolt { animation: wh-jolt .42s cubic-bezier(.34,1.4,.4,1); }
        /* eski qiymat qutidan tushib ketadi (s5 refill) */
        @keyframes wh-fall { 0% { transform: translate(-50%,0) rotate(0); opacity: 1; } 15% { opacity: 1; } 100% { transform: translate(-50%,58px) rotate(16deg); opacity: 0; } }
        .wh-fall { animation: wh-fall .55s cubic-bezier(.5,.1,.9,.4) forwards; }
        /* const-qulf: rad etilgan token orqaga/yuqoriga uchib ketadi (s6) */
        @keyframes wh-reject { 0% { transform: translate(-50%,0) scale(1); opacity: 0; } 18% { transform: translate(-50%,-14px) scale(1.08); opacity: 1; } 55% { transform: translate(-50%,-42px) scale(.96) rotate(8deg); opacity: 1; } 100% { transform: translate(-50%,-88px) scale(.6) rotate(18deg); opacity: 0; } }
        .wh-reject { animation: wh-reject .62s cubic-bezier(.4,.05,.75,.5) forwards; }
        /* robot-qo'l O'QI: cho'zilish → ushlash → tortib chiqarish (s3) */
        @keyframes wh-arm { 0% { transform: translateX(-34px) scale(.7); opacity: 0; } 34% { transform: translateX(0) scale(1); opacity: 1; } 58% { transform: translateX(7px) scale(1.14); } 100% { transform: translateX(0) scale(1); opacity: 1; } }
        .wh-arm { animation: wh-arm .72s cubic-bezier(.34,1.3,.4,1); display: inline-block; }
        /* topolmadi: robot-qo'l paypaslaydi (s3 nomsiz quti) */
        @keyframes wh-grope { 0%,100% { transform: translateX(0) rotate(0); } 18% { transform: translateX(-8px) rotate(-9deg); } 44% { transform: translateX(8px) rotate(9deg); } 68% { transform: translateX(-4px) rotate(-4deg); } 86% { transform: translateX(3px) rotate(3deg); } }
        .wh-grope { animation: wh-grope .75s ease-in-out; display: inline-block; }
        /* bo'sh qaytish: token kulrang so'nadi */
        @keyframes wh-graygone { 0% { opacity: 1; filter: grayscale(0); } 100% { opacity: .32; filter: grayscale(1); } }
        .wh-graygone { animation: wh-graygone .6s ease forwards; }
        @media (prefers-reduced-motion: reduce) {
          .wh-jolt, .wh-arm, .wh-grope { animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
          .wh-fall, .wh-reject { animation-duration: .2s !important; }
          .wh-graygone { animation: none !important; opacity: .32; filter: grayscale(1); }
        }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.ink}; color: ${T.bg}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
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
        /* F-0803-13: javob uzunlikka moslashadi — 4 pog'ona + kod/gap shrift ajrimi */
        .fc-tag { font-weight: 800; letter-spacing: -0.02em; line-height: 1.16; max-width: 100%; text-wrap: balance; overflow-wrap: anywhere; }
        .fc-tag.mono-all { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }
        .fc-tag.prose { font-family: 'Manrope', sans-serif; letter-spacing: -0.005em; }
        .fc-tag .fc-kw { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; }
        .fc-tag.t1 { font-size: clamp(30px,6vw,46px); }
        .fc-tag.t2 { font-size: clamp(24px,4.4vw,34px); }
        .fc-tag.t3 { font-size: clamp(20px,3.4vw,26px); }
        .fc-tag.t4 { font-size: clamp(17px,2.6vw,22px); line-height: 1.3; }
        .fc-note { font-family: 'Manrope'; font-size: 14px; opacity: 0.92; max-width: 100%; }
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
        /* === Jonli panel (LiveBadge) — xira turadi, ustiga borilganda tiniqlashadi (kontentni to'smaydi) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
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
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }
        .chip:disabled { opacity: 0.4; cursor: not-allowed; }
        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; }
        .tagpill { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }

        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); display: flex; align-items: center; justify-content: center; }
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

        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(12.5px,1.6vw,14.5px); line-height: 1.65; padding: clamp(12px,2.2vw,18px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

        /* O'zgaruvchi qutisi */
        .var-box { display: inline-flex; flex-direction: column; min-width: 130px; border-radius: 14px; overflow: hidden; background: ${T.paper}; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.18); }
        .var-name { background: ${T.ink}; color: ${T.bg}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12.5px; padding: 8px 14px; letter-spacing: 0.03em; display: flex; align-items: center; gap: 6px; }
        .var-val { padding: 16px 14px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; text-align: center; }

        .h-title { font-size: clamp(22px,4vw,38px); }
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

        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
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
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        .demo-swap { animation: fade-step 0.3s ease-out; }

        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; } .ai-line:hover { background: rgba(255,255,255,0.06); }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

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
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }

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

        /* === ⚔️ CTA (yakun sahifasida) === */
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
        .cs-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; line-height: 1; user-select: none;
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
          font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
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
          font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
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
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; }
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
        .qz-logo { font-size: clamp(44px,8vw,72px); line-height: 1; }
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
        .qz-opt { flex: 1; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(14px,2vw,17px); color: #fff; line-height: 1.3; letter-spacing: -0.01em; }
        .qz-tile.faded { filter: saturate(0.5); opacity: 0.4; }
        .qz-tile.picked { outline: 3px solid #fff; box-shadow: 0 0 0 4px rgba(255,255,255,0.4), 0 14px 26px -12px rgba(0,0,0,0.4); animation: qz-pop 0.3s; }
        .qz-pbadge { position: absolute; top: -9px; right: -7px; width: 27px; height: 27px; border-radius: 50%; background: #fff; color: #12A968; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 12px rgba(0,0,0,0.28); }
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
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


        /* === ✍️ PRAKTIKA — mentor paneli (jonli darsda) + uy-vazifa tugmasi === */
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
        .hw-run { margin-top: 12px; align-self: flex-start; padding: 12px 20px; border: none; border-radius: 13px; background: ${T.ink}; color: ${T.paper}; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; cursor: pointer; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.42); transition: transform 0.15s, background 0.15s; }
        .hw-run:hover { transform: translateY(-2px); background: ${T.accent}; }

        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
        <div className="lesson-root">
          {live.mode === "choosing" ? <LiveGate live={live} title={{ uz: "JS darsi", ru: "Урок JS" }} /> : <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} onHomework={openHomeworkPractice} />
              {live.mode !== "mentor" && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts((t) => t.filter((x) => x.k !== k))} />}
              <LiveBadge live={live} total={TOTAL_SCREENS} />
            </>}
          {practice && <div style={{ position: "fixed", inset: 0, zIndex: 2e3, background: T.bg }}>
              <HtmlCompiler lang={__lang} task={practice.task} starterCode={practice.starter} storageKey={practice.codeKey} onContinue={practice.done} onBack={() => {
    pracClear(LESSON_META.lessonId);
    setPractice(null);
  }} />
            </div>}
          {mentorPractice && <MentorPracticeOverlay entry={mentorPractice} live={live} onClose={() => setMentorPractice(null)} />}
        </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>;
}
export {
  JsVarsLesson as default
};
