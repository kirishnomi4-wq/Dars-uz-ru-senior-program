import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
// Kod kompilyatori — UMUMIY modul (F-0809-05 · GATE S 3-qarori). Tugma bilan ochiladigan
// to'liq-ekran asbob, shuning uchun CodeStrike brendida (PM_DARS_ETALON 1-bo'lim istisnosi).
import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM · M4c-D2 — HAMMASINI BIRDAN CHIQARAYMI — YOKI HAR HAFTA BO'LAK? (yetkazish tezligi)
// Senariy-manba: pm-senariylar/M4c-D2-Tezlik.md ([AVTO-GATE S] YOPILDI, 2026-08-17).
// Misol-ip: maktabda yo'qolgan narsalar saytining ikki sinfdosh-poygasi (91/95/96c/108-qonun).
// Imzo-vizual: RELIZ-TASMASI — «🏁 Poyga: 6 hafta», ikki yo'l va «▶ Keyingi hafta».
// Kirish-artefakt: YO'Q (modul-ochilish darsi; zaxira-tarmoq ham yozilmaydi — korpus §69).
// Chiqish-artefakt: pm-m4c2-reliz = { bolaklar: [{hafta, ish} x3], savedAt } — m4c-06 shuni o'qiydi.
// INFRA MANBAI: src/4a-Modull/PmLesson15.jsx (M4a-D2) va src/4-Modull/PmLesson11.jsx (M4-D2) —
//   ular o'z navbatida src/pm/PmUserStoryLesson.jsx (P0) va src/3-Modull/PmLesson9.jsx (M3-D10)
//   dan: jonli relslar, Stage, QuestionScreen, MentorTestStats, RecapOverlay, PairTimer,
//   ScreenPodium, CodeStrike-arena, nishonlar, to'liq-ekran kompilyator qobig'i (zoom-bekori).
// KODING: umumiy kompilyator (registr R1 navbati: m4b-02 VS Code -> m4c-02 kompilyator), sof JS.
// ATAMA-INTIZOMI: bosh atama «reliz» faqat s2 da tug'iladi (s0/s1 da 0); «uchirish/lenta»
//   faqat s2 ko'prik-gapida (§112); bir tushuncha — bir nom: «bo'lak».
// BIR TILLI (UZ): tarjima-yordamchisi yo'q; RU alohida sweep'da qo'shiladi.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================
// PM-STUDIA IDENTITET (P0 dan AYNAN)
// ============================================================
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB', link: '#5B3DE6',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
};

// ============================================================
// JONLI SESSIYA INFRA (P0 dan AYNAN — TEGILMAYDI)
// ============================================================
const LIVE_SUPABASE_URL = 'https://dwoubexcexzsinogojiu.supabase.co';
const LIVE_SUPABASE_KEY = 'sb_publishable_cijLMhCDDdo6dlXs05thyw__oH-YgKX';
const LIVE_ENABLED = !!(LIVE_SUPABASE_URL && LIVE_SUPABASE_KEY);
const LIVE_POLL_MS = 2500, LIVE_POLL_MAX_MS = 15000, LIVE_HEARTBEAT_MS = 10000, LIVE_STALE_MS = 180000;
const LT = { bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4', paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', success: '#12A968' };
const _liveHdr = { apikey: LIVE_SUPABASE_KEY, Authorization: `Bearer ${LIVE_SUPABASE_KEY}` };
async function liveRpc(fn, body) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { ..._liveHdr, 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
  if (!r.ok) {
    let msg = '';
    try { msg = JSON.parse(await r.text()).message || ''; } catch {}
    throw new Error(msg || `${fn}: ${r.status}`);
  }
  const t = await r.text(); return t ? JSON.parse(t) : null;
}
async function liveGet(pin) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/live_sessions?pin=eq.${encodeURIComponent(pin)}&select=*`, { headers: _liveHdr });
  if (!r.ok) throw new Error(`get: ${r.status}`);
  const rows = await r.json(); return (rows && rows[0]) || null;
}
const _lsKey = (id) => `liveSession:${id}`;
const liveRead = (id) => { try { return JSON.parse(localStorage.getItem(_lsKey(id)) || 'null'); } catch { return null; } };
const liveStore = (id, o) => { try { localStorage.setItem(_lsKey(id), JSON.stringify(o)); } catch {} };
const liveClear = (id) => { try { localStorage.removeItem(_lsKey(id)); } catch {} };
const fmtPin = (p) => (p ? String(p).replace(/(\d{3})(\d{3})/, '$1 $2') : '');
// Sahifa-holat saqlovi (F-0730-01): reload'da o'quvchi o'z ekraniga qaytadi.
const PROG_TTL_MS = 6 * 60 * 60 * 1000;
const _progKey = (id) => `ccProgress:${id}`;
const progRead = (id, total) => {
  try {
    const p = JSON.parse(localStorage.getItem(_progKey(id)) || 'null');
    if (!p || p.total !== total || Date.now() - (p.savedAt || 0) > PROG_TTL_MS) return null;
    return p;
  } catch { return null; }
};
const progWrite = (id, o) => { try { localStorage.setItem(_progKey(id), JSON.stringify(o)); } catch {} };
const progClear = (id) => { try { localStorage.removeItem(_progKey(id)); } catch {} };
const LIVE_NICK_KEY = 'liveNickname';
const nickRead = () => { try { return localStorage.getItem(LIVE_NICK_KEY) || ''; } catch { return ''; } };
const nickStore = (n) => { try { localStorage.setItem(LIVE_NICK_KEY, n); } catch {} };
async function liveList(path) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/${path}`, { headers: _liveHdr });
  if (!r.ok) throw new Error(`list: ${r.status}`);
  return r.json();
}
const livePlayers = (pin) => liveList(`live_players?pin=eq.${encodeURIComponent(pin)}&select=id,nickname,joined_at&order=joined_at.asc`);
const liveAnswers = (pin, screenIdx) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}${screenIdx == null ? '&screen_idx=lt.100' : `&screen_idx=eq.${screenIdx}`}&select=player_id,screen_idx,picked,correct,elapsed_ms`);
const liveQuizAnswers = (pin) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}&screen_idx=gte.100&select=player_id,screen_idx,picked,correct,elapsed_ms`);

function useLiveSession(lessonId, answerKey) {
  const keyRef = useRef(answerKey); keyRef.current = answerKey;
  const initRef = useRef(undefined);
  if (initRef.current === undefined) initRef.current = LIVE_ENABLED ? liveRead(lessonId) : null;
  const init = initRef.current;
  const [mode, setMode] = useState(() => {
    if (!LIVE_ENABLED) return 'self';
    if (init?.mode === 'self') return 'self';
    if (init?.mode === 'student') return 'student';
    if (init?.mode === 'mentor') return 'mentor';
    return 'choosing';
  });
  const [pin, setPin] = useState(init?.pin || null);
  const tokenRef = useRef(init?.token || null);
  const playerRef = useRef(init?.playerId ? { id: init.playerId, token: init.playerToken } : null);
  const nickRef = useRef(init?.nickname || '');
  const [mentorScreen, setMentorScreen] = useState(init?.lastScreen || 0);
  const [mentorMax, setMentorMax] = useState(init?.maxScreen ?? init?.lastScreen ?? 0);
  const [status, setStatus] = useState('live');
  const [mentorAlive, setMentorAlive] = useState(true);
  const [connected, setConnected] = useState(true);
  const [ended, setEnded] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [busy, setBusy] = useState(false);
  const [quiz, setQuiz] = useState({ state: 'off', q: -1 });
  const [revealScreen, setRevealScreen] = useState(-1);
  const lastSeenRef = useRef(Date.now());
  const lastUpdatedRef = useRef(null);
  const mentorScreenOf = (row) => (typeof row.cur_screen === 'number' ? row.cur_screen : row.max_screen);
  const syncQuiz = useCallback((row) => {
    const qs = row?.quiz_state || 'off', qq = row?.quiz_q ?? -1;
    setQuiz(p => (p.state === qs && p.q === qq) ? p : { state: qs, q: qq });
    const rv = row?.reveal_screen ?? -1;
    setRevealScreen(p => p === rv ? p : rv);
  }, []);

  useEffect(() => {
    if (mode !== 'student' || !pin) return;
    let on = true, timer = null, delay = LIVE_POLL_MS;
    const schedule = () => { if (on) timer = setTimeout(tick, delay); };
    const tick = async () => {
      if (typeof document !== 'undefined' && document.hidden) { schedule(); return; }
      try {
        const row = await liveGet(pin);
        if (!on) return;
        delay = LIVE_POLL_MS; setConnected(true);
        if (!row) { setStatus(p => p === 'ended' ? p : 'ended'); schedule(); return; }
        const mScr = mentorScreenOf(row);
        const mMax = Math.max(row.max_screen ?? 0, mScr);
        setMentorScreen(p => p === mScr ? p : mScr);
        setMentorMax(p => (mMax > p ? mMax : p));
        setStatus(p => p === row.status ? p : row.status);
        syncQuiz(row);
        if (row.updated_at !== lastUpdatedRef.current) { lastUpdatedRef.current = row.updated_at; lastSeenRef.current = Date.now(); liveStore(lessonId, { mode: 'student', pin, lastScreen: mScr, maxScreen: mMax, playerId: playerRef.current?.id, playerToken: playerRef.current?.token, nickname: nickRef.current }); }
        const alive = Date.now() - lastSeenRef.current < LIVE_STALE_MS;
        setMentorAlive(p => p === alive ? p : alive);
      } catch { if (!on) return; setConnected(false); delay = Math.min(delay * 2, LIVE_POLL_MAX_MS); }
      schedule();
    };
    tick();
    const onVis = () => { if (!document.hidden) { clearTimeout(timer); delay = LIVE_POLL_MS; tick(); } };
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVis);
    return () => { on = false; clearTimeout(timer); if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVis); };
  }, [mode, pin, lessonId]); // eslint-disable-line

  useEffect(() => {
    if (mode !== 'mentor' || !pin) return;
    let on = true;
    liveGet(pin).then(row => {
      if (!on) return;
      if (!row || row.status === 'ended') { liveClear(lessonId); setPin(null); tokenRef.current = null; setMode('choosing'); setEnded(false); return; }
      syncQuiz(row);
    }).catch(() => {});
    const beat = () => { liveRpc('session_heartbeat', { p_pin: pin, p_token: tokenRef.current }).catch(() => {}); };
    beat();
    const id = setInterval(beat, LIVE_HEARTBEAT_MS);
    const onVis = () => { if (typeof document !== 'undefined' && !document.hidden) beat(); };
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVis);
    return () => { on = false; clearInterval(id); if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVis); };
  }, [mode, pin, lessonId]); // eslint-disable-line

  const startMentor = useCallback(async (mentorCode) => {
    setBusy(true); setJoinError('');
    try {
      const res = await liveRpc('create_session', { p_lesson_id: lessonId, p_mentor_code: (mentorCode || '').trim() });
      const row = Array.isArray(res) ? res[0] : res;
      if (!row?.pin) throw new Error('no pin');
      tokenRef.current = row.token; setPin(row.pin); setMode('mentor'); setEnded(false);
      liveStore(lessonId, { mode: 'mentor', pin: row.pin, token: row.token });
      if (keyRef.current) liveRpc('set_quiz_keys', { p_lesson_id: lessonId, p_mentor_code: (mentorCode || '').trim(), p_keys: keyRef.current }).catch(() => {});
    } catch { setJoinError("Mentor kodi noto'g'ri yoki ulanishda xato."); }
    finally { setBusy(false); }
  }, [lessonId]);

  const joinStudent = useCallback(async (raw, rawNick) => {
    const p = (raw || '').replace(/\D/g, '');
    const nick = (rawNick || '').trim();
    if (p.length < 4) { setJoinError("Kodni to'liq kiriting."); return; }
    if (nick.length < 2) { setJoinError('Ismingizni kiriting (kamida 2 harf).'); return; }
    setBusy(true); setJoinError('');
    try {
      const row = await liveGet(p);
      if (!row) { setJoinError('Bunday kod topilmadi.'); setBusy(false); return; }
      if (row.lesson_id && row.lesson_id !== lessonId) { setJoinError('Bu kod boshqa darsga tegishli.'); setBusy(false); return; }
      if (row.status !== 'live') { setJoinError('Bu dars allaqachon yakunlangan.'); setBusy(false); return; }
      const res = await liveRpc('join_session', { p_pin: p, p_nickname: nick });
      const player = Array.isArray(res) ? res[0] : res;
      if (!player?.player_id) throw new Error('no player');
      playerRef.current = { id: player.player_id, token: player.token };
      nickRef.current = nick; nickStore(nick);
      lastUpdatedRef.current = row.updated_at; lastSeenRef.current = Date.now();
      const jScr = mentorScreenOf(row), jMax = Math.max(row.max_screen ?? 0, jScr);
      setPin(p); setMentorScreen(jScr); setMentorMax(jMax); setStatus(row.status); setMode('student');
      liveStore(lessonId, { mode: 'student', pin: p, lastScreen: jScr, maxScreen: jMax, playerId: player.player_id, playerToken: player.token, nickname: nick });
    } catch (e) {
      const m = String(e?.message || '');
      setJoinError(/ism|band|kod|dars|belgi/i.test(m) ? m : "Ulanib bo'lmadi. Internetni tekshiring.");
    }
    finally { setBusy(false); }
  }, [lessonId]);

  const selfStudy = useCallback(() => { setMode('self'); liveStore(lessonId, { mode: 'self' }); }, [lessonId]);
  const reportScreen = useCallback((idx) => { if (mode === 'mentor' && pin) liveRpc('advance_session', { p_pin: pin, p_token: tokenRef.current, p_screen: idx }).catch(() => {}); }, [mode, pin]);
  const endSession = useCallback(() => { if (mode === 'mentor' && pin) { liveRpc('end_session', { p_pin: pin, p_token: tokenRef.current }).catch(() => {}); setEnded(true); } }, [mode, pin]);

  const submitAnswer = useCallback((screenIdx, questionId, picked, correct, elapsedMs) => {
    if (mode !== 'student' || !pin || !playerRef.current) return;
    const body = {
      p_pin: pin, p_player_id: playerRef.current.id, p_token: playerRef.current.token,
      p_screen: screenIdx, p_question_id: questionId || '', p_picked: picked,
      p_correct: !!correct, p_elapsed_ms: Math.max(0, Math.round(elapsedMs || 0))
    };
    const attempt = (n) => { liveRpc('submit_answer', body).catch(() => { if (n < 3) setTimeout(() => attempt(n + 1), 3000 * (n + 1)); }); };
    attempt(0);
  }, [mode, pin]);

  const quizControl = useCallback(async (state, q) => {
    if (mode !== 'mentor' || !pin) throw new Error('mentor emas');
    await liveRpc('quiz_control', { p_pin: pin, p_token: tokenRef.current, p_state: state, p_q: q ?? -1 });
    setQuiz({ state, q: q ?? -1 });
  }, [mode, pin]);

  const mentorReveal = useCallback((screenIdx) => {
    if (mode !== 'mentor' || !pin) return;
    setRevealScreen(screenIdx);
    liveRpc('reveal_screen', { p_pin: pin, p_token: tokenRef.current, p_screen: screenIdx }).catch(() => {});
  }, [mode, pin]);

  return { mode, pin, mentorScreen, mentorMax, status, mentorAlive, connected, ended, joinError, busy, startMentor, joinStudent, selfStudy, reportScreen, endSession, submitAnswer, quiz, quizControl, revealScreen, mentorReveal, playerId: playerRef.current?.id || null, nickname: nickRef.current };
}

const _liveBtnPri = { background: LT.accent, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 20px', fontSize: 16, fontWeight: 700, cursor: 'pointer' };
const _liveBadgeS = { position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 9998, background: LT.paper, border: `1px solid ${LT.ink3}55`, borderRadius: 99, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: LT.ink2, boxShadow: '0 2px 10px rgba(40,34,82,0.12)', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', maxWidth: '92vw' };
const _liveDot = (c) => ({ width: 8, height: 8, borderRadius: 99, background: c, display: 'inline-block' });

function LiveBigCode({ pin, onClose }) {
  const digits = String(pin || '').split('');
  const overlay = { position: 'fixed', inset: 0, zIndex: 10000, background: LT.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,40px)', textAlign: 'center' };
  const box = { background: LT.paper, color: LT.ink, borderRadius: 'clamp(10px,1.6vw,18px)', fontFamily: 'monospace', fontWeight: 800, lineHeight: 1, fontSize: 'clamp(48px,13vw,150px)', padding: 'clamp(10px,2vw,28px) clamp(12px,2.2vw,30px)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)' };
  return (
    <div style={overlay}>
      <div style={{ fontSize: 'clamp(13px,2vw,18px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: LT.accent, marginBottom: 'clamp(14px,3vw,28px)' }}>Jonli darsga qo'shilish</div>
      <div style={{ display: 'flex', gap: 'clamp(6px,1.4vw,16px)', justifyContent: 'center', flexWrap: 'wrap' }}>{digits.map((d, i) => <span key={i} style={box}>{d}</span>)}</div>
      <p style={{ color: '#fff', opacity: 0.85, fontSize: 'clamp(15px,2.2vw,22px)', maxWidth: 640, margin: 'clamp(20px,4vw,36px) 0 0', lineHeight: 1.5 }}>Shu darsni o'z qurilmangizda oching → <b style={{ color: '#fff' }}>«Darsga qo'shilish»</b> oynasida ushbu kodni va ismingizni kiriting.</p>
      <button onClick={onClose} style={{ marginTop: 'clamp(22px,4vw,40px)', background: LT.accent, color: '#fff', border: 'none', borderRadius: 14, padding: 'clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)', fontSize: 'clamp(15px,1.8vw,18px)', fontWeight: 700, cursor: 'pointer' }}>Darsni boshlash →</button>
    </div>
  );
}

function LiveGate({ live, title = 'Jonli dars' }) {
  const [code, setCode] = useState('');
  const [nick, setNick] = useState(() => nickRead());
  const [mentorCode, setMentorCode] = useState('');
  const [role, setRole] = useState('student');
  const card = { position: 'relative', width: '100%', maxWidth: 420, background: LT.paper, borderRadius: 20, padding: 'clamp(24px,4vw,36px)', boxShadow: '0 10px 40px -12px rgba(40,34,82,0.22)', display: 'flex', flexDirection: 'column', gap: 18 };
  const wrap = { minHeight: 'calc(100dvh / var(--lz, 1))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 };
  const link = { background: 'none', border: 'none', color: LT.ink3, fontSize: 13, cursor: 'pointer', alignSelf: 'center' };
  if (role === 'mentor') {
    return (<div style={wrap}><div style={card}>
      <div style={{ textAlign: 'center' }}><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '0 0 4px' }}>🧑‍🏫 Mentor kirishi</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>Mentor kodini kiriting.</p></div>
      <input value={mentorCode} onChange={e => setMentorCode(e.target.value)} type="password" autoFocus placeholder="Mentor kodi" onKeyDown={e => { if (e.key === 'Enter') live.startMentor(mentorCode); }} style={{ width: '100%', padding: '14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 18, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? 'Tekshirilmoqda…' : 'Kirish →'}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
      <button onClick={() => { setRole('student'); setMentorCode(''); }} style={link}>← Orqaga</button>
    </div></div>);
  }
  return (<div style={wrap}><div style={card}>
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{title}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>Darsga qo'shilish</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>Mentor bergan kodni va ismingizni kiriting.</p></div>
    <input value={code} onChange={e => setCode(e.target.value)} inputMode="numeric" autoFocus placeholder="483 920" style={{ width: '100%', padding: '16px 14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 28, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.12em', textAlign: 'center', outline: 'none' }} />
    <input value={nick} onChange={e => setNick(e.target.value)} maxLength={24} placeholder="Ismingiz (masalan: Ali)" onKeyDown={e => { if (e.key === 'Enter') live.joinStudent(code, nick); }} style={{ width: '100%', padding: '13px 14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 17, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
    <button onClick={() => live.joinStudent(code, nick)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? 'Ulanmoqda…' : 'Qo\'shilish →'}</button>
    {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
    <button onClick={() => { setRole('mentor'); setCode(''); }} title="Mentor" aria-label="Mentor" style={{ position: 'absolute', bottom: 10, right: 12, background: 'none', border: 'none', fontSize: 16, opacity: 0.3, cursor: 'pointer', lineHeight: 1, padding: 4 }}>🧑‍🏫</button>
  </div></div>);
}

function LiveBadge({ live, total }) {
  const [bigOpen, setBigOpen] = useState(false);
  const [nPlayers, setNPlayers] = useState(null);
  useEffect(() => {
    if (live.mode !== 'mentor' || !live.pin || live.ended) return;
    let on = true, t = null;
    const tick = async () => {
      try { const rows = await livePlayers(live.pin); if (on) setNPlayers(rows.length); } catch {}
      if (on) t = setTimeout(tick, 6000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live.mode, live.pin, live.ended]);
  if (live.mode === 'mentor') {
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> 🔓 O'quvchilar erkin qilindi</div>;
    return (<>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> Kod: <b style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title="Kodni katta ko'rsatish" style={{ marginLeft: 6, background: LT.ink, color: '#fff', border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>📺 Ko'rsatish</button>
        <button onClick={() => { if (window.confirm("O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.")) live.endSession(); }} style={{ background: LT.accentSoft, color: LT.accent, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>🔓 Erkin qilish</button>
      </div>
    </>);
  }
  if (live.mode === 'student') {
    if (live.status === 'ended') return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 🔓 Erkin rejim — o'zingiz davom eting</div>;
    if (!live.mentorAlive) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> ⚠️ Mentor uzildi — erkin rejim</div>;
    if (!live.connected) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot('#FFD380')} /> 🔄 Qayta ulanmoqda…</div>;
    return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 👨‍🏫 Mentor: {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

const LangContext = createContext('uz');
const MentorCtx = createContext(null);
const AchCtx = createContext(null);
const LiveGateCtx = createContext(null);

const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

// ============================================================ PM DARS META
const LESSON_META = { lessonId: 'pm-m4c2-v1', lessonTitle: { uz: "Hammasini birdan chiqaraymi — yoki har hafta bo'lak?" } };
// YAKUN-TUZILMASI ETALONDAN (P0 PmUserStory · PmLesson2 · PmLesson4 · M3-D10 · M4-D2):
// koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa BIR sahifada).
// Uy-vazifa va arena alohida ekran BO'LMAYDI — ikkovi ham yakun ichida.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom', scored: false, scope: 'hook' },        // 0  · BLOK 1
  { id: 's1',  type: 'rule',        template: 'custom', scored: false, scope: null },          // 1  · BLOK 2
  { id: 's2',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 2  · BLOK 3 teoriya-1
  { id: 's3',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 3  · TEST-1
  { id: 's4',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 4  · YADRO: reliz-tasmasi
  { id: 's5',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 5  · TEST-2
  { id: 's6',  type: 'case',        template: 'custom', scored: false, scope: null },          // 6  · K13 keys (Telegram)
  { id: 's7',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 7  · TEST-3
  { id: 's8',  type: 'practice',    template: 'custom', scored: false, scope: null },          // 8  · BLOK 4 uch bo'lak
  { id: 's9',  type: 'practice',    template: 'custom', scored: false, scope: null },          // 9  · BLOK 5 tekshiruv
  { id: 's10', type: 'koding',      template: 'custom', scored: false, scope: null },          // 10 · BLOK 6 kompilyator
  { id: 's11', type: 'test',        template: 'custom', scored: true,  scope: 'final' },       // 11 · TEST-4
  { id: 's12', type: 'reflection',  template: 'custom', scored: false, scope: null },          // 12 · BLOK 7
  { id: 's13', type: 'stats',       template: 'custom', scored: false, scope: null },          // 13 · podium
  { id: 's14', type: 'flashcard',   template: 'custom', scored: false, scope: null },          // 14 · takrorlash
  { id: 's15', type: 'summary',     template: 'custom', scored: false, scope: null }           // 15 · BLOK 8 + 9
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// SCREEN_INTENTS — har ekran nima uchun mavjud: 1 gaplik niyat (bola nima QILADI yoki nima BILADI).
export const SCREEN_INTENTS = {
  s0: "Bola ikki sinfdoshning ikki yo'lidan birini tanlaydi va ikkala tanlovda bir xil javobni ko'radi",
  s1: "Bola dars oxirida o'z loyihasi uchun uch haftalik rejani yozib olishini oldindan ko'radi",
  s2: "Bola ikki kartani ochib bo'lak qachon chiqqan hisoblanishini topadi va reliz nima ekanini biladi",
  s3: "Bola faqat o'z kompyuterida ishlagan tugma reliz emasligini tanlaydi",
  s4: "Bola olti haftani o'zi o'tkazib ikki saytni solishtiradi va tez-tez chiqargani oldin bilishini ko'radi",
  s5: "Bola odamlarga nima kerakligini eng erta qachon bilishini aniqlaydi",
  s6: "Bola Telegram voqeasidan tez-tez chiqarish poygada oldinga chiqarishini biladi",
  s7: "Bola reaksiya, stiker va kanal boshqa yozishuv ilovalarida qachon paydo bo'lganini tanlaydi",
  s8: "Bola o'z loyihasiga uch haftalik bo'lakni bittalab yozadi",
  s9: "Bola uch raundda darvozaning ikki chirog'idan o'tadigan bo'lakni tanlab uch haftalik reja yig'adi",
  s10: "Bola kompilyatorda ishni haftalarga bo'ladigan funksiyani yozadi",
  s11: "Bola uch haftalik katta ishni qanday chiqarishini tanlaydi",
  s12: "Bola birinchi haftadagi bo'lagini yoddan aytadi va bir qatorda yozib qoldiradi",
  s13: "Bola o'z natijasini (jonlida — guruh reytingini) ko'radi",
  s14: "Bola o'nta takrorlash kartasi bilan o'zini o'zi tekshiradi",
  s15: "Bola arenada bilimini tezlikda tekshiradi, uy-vazifasini va nishonlarini bitta yakun-sahifada ko'radi"
};


const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

// Nishon-hisoblagichi mentor (proyektor) rejimida KO'RINMAYDI — 90-qonun · 1-D jadvali.
function AchCounter() {
  const earned = useContext(AchCtx);
  const gate = useContext(LiveGateCtx);
  const count = earned ? earned.size : 0;
  const total = Object.keys(ACHIEVEMENTS).length;
  const prevRef = useRef(count);
  const [bump, setBump] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (count > prevRef.current) { setBump(true); const t = setTimeout(() => setBump(false), 800); prevRef.current = count; return () => clearTimeout(t); }
    prevRef.current = count;
  }, [count]);
  if (gate && gate.live && gate.live.mode === 'mentor') return null;
  return (
    <div className="ach-cnt-wrap">
      <button className={`ach-counter ${bump ? 'bump' : ''} ${count > 0 ? 'has' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Nishonlar" title="Nishonlar">
        <span className="ach-cnt-ic">🏅</span><b>{count}</b><span className="ach-cnt-tot">/{total}</span>
      </button>
      {open && (
        <div className="ach-pop" onMouseLeave={() => setOpen(false)}>
          <div className="ach-pop-h">🏅 Nishonlar — {count}/{total}</div>
          {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(earned && earned.has(id)); return (
            <div key={id} className={`ach-pop-row ${got ? 'got' : ''}`}><span className="ach-pop-ic">{got ? a.icon : '🔒'}</span><span className="ach-pop-nm">{a.name}</span></div>
          ); })}
        </div>
      )}
    </div>
  );
}

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic;
  const padH = isMobile ? 12 : 60;
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); }, [screen]);
  const setCollapsed = useCallback((v) => {
    setMCollapsed(v);
    if (v === false && contentRef.current) { const el = contentRef.current; requestAnimationFrame(() => { if (el) el.scrollTo({ top: 0, behavior: 'auto' }); }); }
  }, []);
  const onContentClick = (e) => {
    if (!collapseOn || mCollapsed) return;
    if (e.target && e.target.closest && e.target.closest('.mentor')) return;
    setMCollapsed(true);
  };
  const onContentScroll = () => {
    if (!collapseOn || mCollapsed) return;
    const el = contentRef.current;
    if (el && el.scrollTop > 6) setMCollapsed(true);
  };
  return (
    <MentorCtx.Provider value={{ enabled: collapseOn, collapsed: mCollapsed, setCollapsed }}>
      <div className="stage">
        <div className="stage-header" style={{ paddingLeft: padH, paddingRight: padH }}>
          <div className="progress-track"><div className="progress-bar" style={{ width: `${((screen + 1) / totalScreens) * 100}%` }} /></div>
          <div className="chrome">
            <div className="chrome-left eyebrow"><span className="dot" /><span>{eyebrow}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AchCounter />
              <div className="mono small" style={{ color: T.ink3 }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
            </div>
          </div>
        </div>
        <div ref={contentRef} onClick={onContentClick} onScroll={onContentScroll} className={`stage-content ${narrow ? 'narrow' : ''}`} style={{ paddingLeft: padH, paddingRight: padH }}>{children}</div>
        {navContent && <div className="stage-nav" style={{ paddingLeft: padH, paddingRight: padH }}>{navContent}</div>}
      </div>
    </MentorCtx.Provider>
  );
};
const NavBack = ({ onPrev }) => <button className="btn-ghost" onClick={onPrev} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Orqaga</button>;

// NAVBAT-SIGNALI (88-qonun · 1-C.8 kod-shartnomasi — PmLesson2 manbasidan AYNAN).
const TURN_HINT_MS = 2600;
function useTurnHint(active) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!active) { setOn(false); return; }
    setOn(false);
    const t = setTimeout(() => setOn(true), TURN_HINT_MS);
    return () => clearTimeout(t);
  }, [active]);
  return on;
}
const TURN_STEP_MS = 1300;
const TURN_PAUSE_MS = 3200;
function useTurnWalk(pending, enabled = true) {
  const key = pending.join('');
  const [lit, setLit] = useState(null);
  useEffect(() => {
    setLit(null);
    if (!enabled || pending.length === 0) return;
    let on = true, t = null, i = 0;
    if (pending.length === 1) {
      t = setTimeout(() => { if (on) setLit(pending[0]); }, TURN_HINT_MS);
      return () => { on = false; clearTimeout(t); };
    }
    const stepIn = () => {
      if (!on) return;
      setLit(pending[i]);
      t = setTimeout(() => {
        if (!on) return;
        setLit(null);
        i = (i + 1) % pending.length;
        t = setTimeout(stepIn, i === 0 ? TURN_PAUSE_MS : 140);
      }, TURN_STEP_MS);
    };
    t = setTimeout(stepIn, TURN_HINT_MS);
    return () => { on = false; clearTimeout(t); };
  }, [key, enabled]); // eslint-disable-line
  return lit;
}
const turnCls = (lit, k, walking) => (lit === k ? (walking ? ' turn-ring turn-step' : ' turn-ring') : '');
const waveCls = (on, i, n) => (on ? ` turn-ring turn-wave${n > 3 ? ' wv4' : ''} w${i + 1}` : '');

const NavNext = ({ disabled, label = 'Davom etish', onClick, optionalLive, turnBusy }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  const isOff = (freeRide ? false : disabled) || locked;
  const hint = useTurnHint(!isOff && !turnBusy);
  return <button className={`btn-white-accent${hint ? ' turn-hint' : ''}`} disabled={isOff} onClick={onClick} title={locked ? "Mentor hali bu sahifaga o'tmadi" : (freeRide && disabled ? "Jonli dars: bajarmasdan ham o'tishingiz mumkin" : undefined)} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? '⏳ Mentorni kuting' : label}</button>;
};

const FeedbackBlock = ({ show, isCorrect, neutral, children }) => {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (show) { setMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => { setVisible(true); setTimeout(() => { if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 350); })); }
    else { setVisible(false); const t = setTimeout(() => setMounted(false), 400); return () => clearTimeout(t); }
  }, [show]);
  if (!mounted) return null;
  return <div ref={ref} className={`feedback-block ${visible ? 'visible' : ''}`}><div className={neutral ? 'frame-wait' : isCorrect ? 'frame-success' : 'frame-soft'}>{children}</div></div>;
};

const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;

// Scored ekranlar javob kaliti — darslik-jonli TASDIQLAYDI (senariy 4-bo'limi bilan qatorma-qator).
// Kalit nomi = submitAnswer'ga uzatilgan question_id: testlarda SCREEN_META.id, praktikada zona-nomi.
// -1 = ishtirok-sentinel (server: to'ldirgani = to'g'ri). Praktika signal-zonasi: PRACTICE_BASE+screen.
const INLINE_KEYS = { s3: 1, s5: 0, s7: 1, s11: 1, poyga: -1, practice: -1, darvoza: -1, koding: -1 };
// Har scored ekran uchun qayta-tushuntirish. Kalitlar = scored ekran INDEKSI (3/5/7/11).
const RECAPS = {
  3: {
    title: "Reliz — bo'lak odamlar qo'liga tekkan payt",
    cards: [
      { ic: '🌐', h: 'Reliz nima', body: <>Tayyor bo'lakni <b>odamlar ishlatadigan joyga chiqarish</b> — reliz deyiladi. Reliz katta ham, kichkina ham bo'ladi.</> },
      { ic: '💻', h: 'Kompyuterda ishlagani yetmaydi', body: <>Kod o'z kompyuterida ishlayotgani hali reliz emas: odamlar unga tegmaguncha hech narsa o'zgarmaydi.</> },
      { ic: '🔎', h: 'Bitta savol yetadi', body: <>Har bo'lakka bitta savol bering: buni hozir odamlar ishlata oladimi?</>, ask: "Sinfdoshingiz tugma yozdi — faqat o'z kompyuterida. Bu reliz bo'ldimi?" }
    ]
  },
  5: {
    title: "Kim tez-tez chiqarsa, o'sha oldin biladi",
    cards: [
      { ic: '🏁', h: 'Poygada nima chiqdi', body: <>6 haftada «Har hafta kichik» sayti odamlardan <b>6 marta</b> bilib oldi, «Bir marta katta» sayti — <b>1 marta</b>.</> },
      { ic: '📅', h: 'Birinchi hafta yetadi', body: <>Birinchi bo'lak chiqib, odamlar ishlatgan haftadayoq nima kerakligi ko'rinadi — reja yozish yoki kompyuterda sinash buni aytmaydi.</> },
      { ic: '⚖️', h: 'Ikki yo\'l', body: <>Ikkala yo'l ham saytga olib keladi; farq — kim odamlarga nima kerakligini oldin bilganida.</>, ask: "Uchta bo'lak yasamoqchisiz. Odamlarga nima kerakligini eng erta qachon bilasiz?" }
    ]
  },
  7: {
    title: 'Telegram deyarli har oy chiqaradi',
    cards: [
      { ic: '📦', h: 'Telegram misolida', body: <>Telegram katta yangilanishlarni <b>deyarli har oy</b> chiqarib keladi — yillar davomida, to'xtamasdan.</> },
      { ic: '⚡', h: 'Boshqalar qachon yetdi', body: <>Reaksiya, stiker, kanalni Telegram <b>raqiblaridan yillar oldin</b> chiqargan; boshqa yozishuv ilovalarida ular bir necha yil keyin paydo bo'ldi.</> },
      { ic: '🧭', h: 'Nimasi bilan ajralib turadi', body: <>Telegramdan oyiga 1 milliard odam foydalanadi (2025-yil mart). Tez chiqarish — uning o'ziga xos belgisi bo'lib qoldi.</>, ask: "Reaksiya, stiker, kanal boshqa yozishuv ilovalarida qachon paydo bo'ldi?" }
    ]
  },
  11: {
    title: "Haftalik bo'lak: sig'adi va ishlaydi",
    cards: [
      { ic: '⏱', h: 'Birinchi chiroq', body: <>Bo'lak <b>haftaga sig'adi</b>: unga ketadigan kunlar besh ish kunidan oshmaydi — bir haftada bir nechta ish bo'lsa, kunlari qo'shib hisoblanadi.</> },
      { ic: '👤', h: 'Ikkinchi chiroq', body: <>Bo'lakni <b>odam ishlata oladi</b>: bossa — nimadir bo'ladi, javob qaytadi.</> },
      { ic: '❓', h: "O'zingizni tekshiring", body: <>Yozgan bo'laklaringizga qarang: har biri shu ikki chiroqdan o'tadimi?</>, ask: 'Uch haftalik katta ishni qanday chiqarasiz?' }
    ]
  }
};

function RecapOverlay({ screenIdx, onClose }) {
  const rc = RECAPS[screenIdx];
  const [i, setI] = useState(0);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') setI(p => Math.min(p + 1, rc.cards.length - 1));
      else if (e.key === 'ArrowLeft') setI(p => Math.max(p - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, rc]);
  if (!rc) return null;
  const card = rc.cards[i];
  const last = i === rc.cards.length - 1;
  return (
    <div className="rc-overlay">
      <div className="rc-head">
        <span className="rc-tag">📖 Qayta tushuntirish</span>
        <span className="rc-title">{rc.title}</span>
        <button className="rc-x" onClick={onClose} aria-label="Yopish">✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{card.h}</h2>
        <p className="rc-body">{card.body}</p>
        {card.ask && <div className="rc-ask">🗣️ Sinfga savol: {card.ask}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← Oldingi</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}-karta`} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>✓ Tushunarli — davom etamiz</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>Keyingisi →</button>}
      </div>
    </div>
  );
}

// MENTOR (proyektor): jonli test statistikasi — «Natijani ochish»gacha ✅/❌ soni yashirin.
function MentorTestStats({ live, screenIdx, options, correctIdx, reveal, onReveal, onOpenRecap }) {
  const [data, setData] = useState({ players: null, rows: [] });
  useEffect(() => {
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, answers] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, screenIdx)]);
        if (on) setData({ players, rows: answers });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live.pin, screenIdx]);
  if (data.players === null) return null;
  const total = data.players.length;
  const answered = data.rows.length;
  const ok = data.rows.filter(a => a.picked === correctIdx).length;
  const bad = answered - ok;
  const allIn = total > 0 && answered >= total;
  const struggling = answered >= 2 && bad > ok;
  const answeredIds = new Set(data.rows.map(r => r.player_id));
  const waiting = data.players.filter(p => !answeredIds.has(p.id));
  const maxN = Math.max(1, ...options.map((_, i) => data.rows.filter(a => a.picked === i).length));
  return (
    <div className="mstats fade-up">
      <div className="mstats-head">
        <span className="mstats-lbl">📊 Jonli natija</span>
        <span className="mstats-n">{allIn ? '✓ Hamma javob berdi' : <>Javob berdi: <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>🔓 Natijani ochish</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }} /></div>
      {reveal ? (
        <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">to'g'ri ✅</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">adashdi ❌</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">kutilmoqda ⏳</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">javob berdi 📨</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">kutilmoqda ⏳</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">🙈 Kim nimani tanlagani va ✅/❌ soni yopiq — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.</p>
      )}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
          const n = data.rows.filter(a => a.picked === i).length;
          const pct = answered ? Math.round((n / answered) * 100) : 0;
          const isC = reveal && i === correctIdx;
          const col = isC ? T.success : MSTATS_COLORS[i % 4];
          return (
            <div key={i} className={`mstats-row ${reveal && !isC ? 'dimmed' : ''}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? '✓' : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round((n / maxN) * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? `${n} o'quvchi · ${pct}%` : '—'}</span>
            </div>
          );
        })}
      </div>}
      {reveal && answered > 0 && (() => {
        const pct = Math.round((ok / answered) * 100);
        const level = answered < RECAP_MIN_ANSWERS ? 'few' : pct < RECAP_NEED_PCT ? 'need' : pct < RECAP_GOOD_PCT ? 'maybe' : 'good';
        return (
          <div className={`mstats-verdict ${level}`}>
            {level === 'need' && <p className="mstats-verdict-t">⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</p>}
            {level === 'maybe' && <p className="mstats-verdict-t">🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</p>}
            {level === 'good' && <p className="mstats-verdict-t">✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</p>}
            {level === 'few' && <p className="mstats-verdict-t">Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</p>}
            {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 Qayta tushuntirishni ochish</button>}
          </div>
        );
      })()}
      {waiting.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">⏳ Kutilmoqda:</span>
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">⚠️ Ko'pchilik adashdi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Yana bir bor tushuntiring.</p>}
      {answered === 0 && <p className="mstats-wait">O'quvchilar javoblari shu yerda jonli ko'rinadi…</p>}
    </div>
  );
}

// QuestionScreen — scored test mexanikasi (jonli-ball KAFOLATLI: submitAnswer + Kahoot-reveal).
const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, ctaLabel, revealPrefix = "To'g'ri javob", storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student');
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now());
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
  const [recapOpen, setRecapOpen] = useState(false);
  const hasRecap = !!RECAPS[screen];
  const doReveal = () => { setMReveal(true); if (live) live.mentorReveal(screen); if (storedAnswer === undefined) onAnswer(screen, { mentorRevealed: true }); };
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect(() => { if (isMentorLive && liveRevealScreen === screen) setMReveal(true); }, [isMentorLive, liveRevealScreen, screen]);
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
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? 'Davom etish' : 'Avval natijani oching') : solved ? 'Davom etish' : (ctaLabel || 'Javobni tanlang')} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>⚡ Jonli dars — bitta urinish, o'ylab bosing!</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (isMentorLive) {
              if (mReveal) { cls += i === correctIdx ? ' option-correct' : ' option-wrong'; }
            } else if (solved) {
              if (waiting) { if (i === picked) cls += ' option-wait'; }
              else { cls += i === correctIdx ? ' option-correct' : ' option-wrong'; if (wrongLocked && i === picked) cls += ' option-picked-wrong'; }
            }
            else if (i === picked) cls += ' option-picked-wrong';
            const showGreenLetter = isMentorLive ? (mReveal && i === correctIdx) : (solved && revealed && i === correctIdx);
            const showRedLetter = cls.includes('option-picked-wrong');
            const showDimLetter = cls.includes('option-wrong') && !showGreenLetter && !showRedLetter;
            return (
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`opt-abc ${showGreenLetter ? 'ok' : showRedLetter ? 'bad' : showDimLetter ? 'dim' : ''}`}>{showGreenLetter ? '✓' : showRedLetter ? '✗' : String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(opt)}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? <>✓ {revealPrefix}: {fmtCode(options[correctIdx])}</>
              : waiting
                ? '📨 Javobingiz qabul qilindi'
                : wrongLocked
                  ? <>{revealPrefix}: {fmtCode(options[correctIdx])}</>
                  : solved ? "Topdingiz!" : "Qaytadan ko'ring"}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(explainCorrect)
              : waiting
                ? "Hozir to'g'ri javobni bilib olasiz."
                : wrongLocked
                  ? fmtCode(explainWrong[picked] ?? explainWrong.default)
                  : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
          </p>
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>📖 Qisqa takrorlash — mavzuni yana bir ko'rish</button>
          )}
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

function ScoreRing({ correct, total }) {
  const PCT = total ? correct / total : 0;
  const col = PCT >= 0.6 ? T.success : T.accent;
  const R = 50, ST = 9, C = 2 * Math.PI * R;
  const [off, setOff] = useState(C);
  useEffect(() => { const t = setTimeout(() => setOff(C * (1 - PCT)), 200); return () => clearTimeout(t); }, [C, PCT]);
  return (
    <div className="ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke={T.ink3 + '40'} strokeWidth={ST} />
        <circle cx="64" cy="64" r={R} fill="none" stroke={col} strokeWidth={ST} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 64 64)" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">to'g'ri javob</div></div>
    </div>
  );
}

// ===== MENTOR =====
const Mentor = ({ children }) => {
  const ctx = useContext(MentorCtx) || {};
  const enabled = !!ctx.enabled;
  const collapsed = enabled && ctx.collapsed;
  const expand = (e) => { e.stopPropagation(); if (ctx.setCollapsed) ctx.setCollapsed(false); };
  return (
    <div className={`mentor fade-up ${enabled ? 'mentor-mob' : ''} ${collapsed ? 'is-collapsed' : ''}`} onClick={collapsed ? expand : undefined} role={collapsed ? 'button' : undefined}>
      <div className="mentor-ava" aria-hidden="true">
        <img src={MENTOR_IMG} alt="" />
      </div>
      <div className="mentor-col">
        <span className="mentor-name">Mentor{collapsed && <span className="mentor-cue"> · ko'rsatmani ochish ▾</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

// MentorNote — PROYEKTOR-SIR: default yopiq xira chip; bosishda ochiladi/yopiladi.
const MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [open, setOpen] = useState(false);
  if (!live || live.mode !== 'mentor') return null;
  if (!open) return (
    <button type="button" className="mnote-chip" onClick={() => setOpen(true)} title="Mentorga eslatma — bosib oching">📋 Eslatma</button>
  );
  return (
    <div className="mnote fade-up" onClick={() => setOpen(false)} title="Yopish uchun bosing">
      <span className="mnote-lbl">🧑‍🏫 Mentorga eslatma<span className="mnote-x">✕ yopish</span></span>
      <p className="mnote-body">{children}</p>
    </div>
  );
};

// ===== 🛠️ JONLI PRAKTIKA signal-zonasi (500+) =====
const PRACTICE_BASE = 500;
const MentorPracticeStats = ({ live, screen, label = "👀 Kim bajardi" }) => {
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ players, doneIds: new Set(rows.map(r => r.player_id)) });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, screen]);
  if (!live || live.mode !== 'mentor') return null;
  const players = data.players || [];
  const doers = players.filter(p => data.doneIds.has(p.id));
  const waiting = players.filter(p => !data.doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{label} — {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>Ma'lumot kelmoqda…</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>Hali hech kim qo'shilmagan.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.successSoft, color: T.success, fontWeight: 700 }}>✓ {p.nickname}</span>)}
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.accentSoft, color: T.accent, fontWeight: 700 }}>✏️ {p.nickname}</span>)}
        </div>
      )}
    </div>
  );
};

// O'QUVCHI ko'radigan sinf-holati (45-qonun) — sof O'QISH, ball-relsga yozmaydi.
const StudentPracticePulse = ({ live, screen }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!live || live.mode !== 'student' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ total: players.length, done: new Set(rows.map(r => r.player_id)).size });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, screen]);
  if (!live || live.mode !== 'student' || !data || data.total === 0) return null;
  const doing = Math.max(0, data.total - data.done);
  return (
    <div className="done-mini fade-up" style={{ alignSelf: 'flex-start' }}>
      👥 Sinfda: <b>{data.done}</b> bajardi{doing > 0 && <span className="dm-sub">· ✏️ {doing} hali bajarmoqda</span>}
    </div>
  );
};

// ============================================================
// 🏁 DARS MA'LUMOTLARI — maktabda yo'qolgan narsalar saytining ikki sinfdosh-poygasi
// (bitta misol-ip, 108-qonun). s4 poygasi · s9 darvozasi · s10 kodi — bir olam, bir til.
// ============================================================
// Yo'l-yorliqlari dars bo'ylab AYNAN bir xil (korpus §80): s0 · s4 · testlar · flashcard · s15.
const YOL_KATTA = 'Bir marta katta';
const YOL_KICHIK = 'Har hafta kichik';
const HAFTA_SONI = 6;
// 6 hafta: «Har hafta kichik» sayti har haftada bitta bo'lak chiqaradi va odamlardan bilib oladi.
const POYGA = [
  { n: 1, ic: '📋', nom: "E'lonlar ro'yxati", odam: 9,  bildi: "hamma yozuvga sinfini qo'shyapti («qora quloqchin, 7-B»)" },
  { n: 2, ic: '🏫', nom: "E'longa sinf yozish", odam: 21, bildi: "rasm hech kim qo'ymayapti — rangini yozyapti" },
  { n: 3, ic: '🔍', nom: "Rang bo'yicha qidiruv", odam: 34, bildi: "topilgan narsa ro'yxatda qolib ketyapti" },
  { n: 4, ic: '✅', nom: "E'lonni yopish tugmasi", odam: 52, bildi: "eski e'lonlar to'planib qoldi" },
  { n: 5, ic: '🕰', nom: "30 kunlik e'lon o'zi yashirinadi", odam: 70, bildi: "yangi e'lonni ko'rmay qolishyapti" },
  { n: 6, ic: '🔔', nom: 'Kunlik «yangi e\'lonlar» xabari', odam: 95, bildi: "6 bo'lak, hammasi ishlatilmoqda" },
];
// «Bir marta katta» sayti 6-haftada hammasini birdan chiqaradi (1–5-haftada 🔒 yasalmoqda).
const KATTA_YAKUN = {
  ic: '🚀', nom: "5 bo'lak birdan", odam: 38,
  royxat: "e'lonlar ro'yxati · rasm yuklash · maktab xaritasi · ikki tomonlama chat · e'lon reytingi",
  bildi: "xarita va reytingni hech kim ochmadi; hamma yozuvga sinfini qo'lda yozyapti",
};

// ===== SCREEN 0 — HOOK: ikki sinfdosh, bir g'oya =====
const HOOK_OPTS = [
  { k: 'katta',  ic: '🧱', t: "Bir marta katta — sayt to'liq bo'lib chiqsin" },
  { k: 'kichik', ic: '🧩', t: 'Har hafta kichik — odamlar erta ishlatsin' },
];
// 100-qonun: tanlov yoziladi, hech qayerda O'QILMAYDI.
const HOOK_KEY = 'pm-m4c2-hook-choice';
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [counts, setCounts] = useState(null);
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const isMentor = !!(live && live.mode === 'mentor');
  useEffect(() => {
    if (!isLive) return;
    let on = true, t = null;
    const tick = async () => {
      try { const rows = await liveAnswers(live.pin, screen); if (on) setCounts(HOOK_OPTS.map((_, i) => rows.filter(r => r.picked === i).length)); } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isLive, live && live.pin, screen]);
  const pick = (i) => {
    if (picked !== null || isMentor) return;
    setPicked(i);
    try { localStorage.setItem(HOOK_KEY, HOOK_OPTS[i].k); } catch {}
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: i, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const opened = picked !== null || isMentor;
  const totalVotes = counts ? counts.reduce((a, b) => a + b, 0) : 0;
  const optWave = useTurnHint(picked === null && !isMentor);
  return (
    <Stage eyebrow="Kirish · ikki sinfdosh" screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={opened ? 'Davom etish' : 'Bittasini tanlang'} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Siz qaysi yo'ldan <span className="italic" style={{ color: T.accent }}>yurardingiz?</span></h2></div>
        <Mentor>Ikki sinfdoshingiz bir xil g'oyani tanladi: maktabda yo'qolgan narsalar sayti — quloqchin, kalit. Biri 6 hafta yasab, hammasini birdan chiqarmoqchi. Ikkinchisi 1-haftadayoq kichkina bo'lak chiqarib, har hafta yangisini qo'shmoqchi.</Mentor>
        <div className="hrow two fade-up delay-1">
          {HOOK_OPTS.map((o, i) => (
            <button key={o.k} className={`hopt${picked === i ? ' on' : ''}${opened ? ' open' : ''}${!opened && optWave ? waveCls(true, i, HOOK_OPTS.length) : ''}`} disabled={opened} onClick={() => pick(i)}>
              <span className="hopt-ic">{o.ic}</span>
              <span className="hopt-nom">{o.t}</span>
            </button>
          ))}
        </div>
        {opened && (
          <>
            {/* IMZO-SAHNA: ikkala tanlovda ham BIR XIL natija ochiladi (104-qonun · korpus §119) */}
            <div className="h0pay fade-step">
              <span className="h0pay-row"><b>Ikkala yo'l ham</b><i className="h0pay-arw">→</i><span>6-haftada saytga olib keladi</span></span>
              <span className="h0pay-row"><b>Farq</b><i className="h0pay-arw">→</i><span>yo'lda: kim odamlarga nima kerakligini oldin bilganida</span></span>
            </div>
            <div className="frame-soft h0end fade-step">
              <p className="body" style={{ margin: 0, color: T.ink }}>Poygani o'zingiz o'tkazasiz.</p>
            </div>
          </>
        )}
        {/* Korpus §97: ovoz-diagrammasi FAQAT jonli darsda — yakka o'quvchida «ko'pchilik» yo'q */}
        {opened && isLive && counts && (
          <div className="hvote fade-step" aria-label="Jonli natija">
            {HOOK_OPTS.map((o, i) => {
              const n = counts[i];
              const pct = totalVotes ? Math.round((n / totalVotes) * 100) : 0;
              const top = totalVotes > 0 && n === Math.max(...counts);
              return (
                <div key={o.k} className={`hvote-row ${picked === i ? 'mine' : ''} ${top ? 'top' : ''}`}>
                  <span className="hvote-lbl">{o.ic} {o.t}</span>
                  <span className="hvote-track"><span className="hvote-fill" style={{ width: `${Math.max(pct, totalVotes ? 4 : 0)}%` }} /></span>
                  <span className="hvote-pct mono">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
        <MentorNote>Ovozlar bo'linadi — «to'liq sayt chiqsin» degani ham, «erta ishlatishsin» degani ham hayotiy. Hech qaysini «xato» demang: poyga keyingi ekranlarda o'zi ko'rsatadi.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD: uch hafta-qatori o'z-o'zidan yozilib chiqadi (18-qonun WOW) =====
// Demo-uchligi ATAYLAB s4 bo'laklaridan ham, s9 nomzodlaridan ham TASHQARIDA (spoyler-taqiq).
const DEMO_REJA = [
  { h: '1-hafta', ish: "E'lonni tahrirlash tugmasi — bossa, yozuvni to'g'rilaydi" },
  { h: '2-hafta', ish: "E'lonni ulashish havolasi — bossa, havola nusxalanadi" },
  { h: '3-hafta', ish: "«Mening e'lonlarim» ro'yxati — bossa, o'z e'lonlarini ko'radi" },
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow="Maqsad" screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label="Boshlaymiz →" onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">Dars oxirida siz <span className="italic" style={{ color: T.accent }}>nima</span> yozib olasiz?</h2></div>
      <Mentor>Pastdagi ro'yxatni kuzating.</Mentor>
      <div className="s1demo">
        <span className="s1demo-lbl">🗓 Uch haftalik reja</span>
        <div className="s1demo-list">
          {DEMO_REJA.map((d, i) => (
            <span key={d.h} className="s1row" style={{ '--dd': `${0.5 + i * 0.8}s` }}>
              <span className="s1row-t">{d.h}</span>
              <i className="s1row-arw" style={{ '--dd2': `${0.95 + i * 0.8}s` }}>→</i>
              <span className="s1row-b" style={{ '--dd2': `${1.05 + i * 0.8}s` }}>{d.ish}</span>
              <span className="s1row-ok" style={{ '--dd3': `${1.35 + i * 0.8}s` }}>✅</span>
            </span>
          ))}
        </div>
      </div>
      <div className="takeaway fade-up delay-2"><span className="ta-bulb">🎯</span><p className="ta-h">Dars oxirida o'z loyihangiz uchun uch haftalik rejani yozib olasiz: har haftada odamlar qo'liga tegadigan bitta bo'lak.</p></div>
      <MentorNote>Ro'yxat yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.</MentorNote>
    </div>
  </Stage>
);

// ===== SCREEN 2 — TEORIYA-1: o'yin relizi ↔ sayt relizi (46-qonun toggle) =====
const S2_CARDS = [
  { ic: '🎮', h: 'O\'yinda', b: "Kun keladi — o'yin chiqadi, hamma o'sha kundan o'ynay boshlaydi. Katta, yilda bir marta" },
  { ic: '🌐', h: 'Saytda',  b: "Yangi bo'lak chiqadi — odamlar shu kundan ishlata boshlaydi. Katta ham, kichkina ham bo'ladi; yilda bir marta ham, har hafta ham" },
];
const Screen2 = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [opened, setOpened] = useState([false, false]);
  const [seen, setSeen] = useState([false, false]);
  const allSeen = seen.every(Boolean);
  // 46-qonun: birinchi bosishdan keyin karta QULFLANMAYDI — qayta bosilsa yopilib-ochiladi.
  const toggle = (i) => {
    setOpened(prev => prev.map((v, k) => (k === i ? !v : v)));
    setSeen(prev => (prev[i] ? prev : prev.map((v, k) => (k === i ? true : v))));
  };
  const pend = S2_CARDS.map((_, i) => String(i)).filter(k => !seen[Number(k)]);
  const lit = useTurnWalk(pend);
  const qoldi = seen.filter(v => !v).length;
  return (
    <Stage eyebrow="Muhokama · ikki karta" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!allSeen && !isMentor} label={allSeen || isMentor ? 'Davom etish' : `👆 Yana ${qoldi} kartani oching`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Sinfdoshingiz yozgan bo'lak qachon <span className="italic" style={{ color: T.accent }}>«chiqdi» hisoblanadi?</span></h2></div>
        <Mentor>O'tgan darsda lenta kodni o'zi uchirardi — u kod endi odamlar qo'liga tegadi. Ikki kartani bosing: o'yinda va saytda bu kun qanday o'tadi?</Mentor>
        <div className="dfc-grid fade-up delay-1">
          {S2_CARDS.map((c, i) => (
            <button key={c.h} type="button" className={`dfc${opened[i] ? ' open' : ''}${turnCls(lit, String(i), pend.length > 1)}`} onClick={() => toggle(i)}>
              <span className="dfc-top"><span className="dfc-ic">{c.ic}</span><span className="dfc-h">{c.h}</span></span>
              <span className="dfc-b">{opened[i] ? c.b : '· · ·'}</span>
            </button>
          ))}
        </div>
        {allSeen && (
          <div className="xul fade-step">
            <span className="xul-h">Tayyor bo'lakni odamlar ishlatadigan joyga chiqarish — reliz deyiladi (inglizchasi — release).</span>
            <p className="xul-b">Reliz katta bo'lishi mumkin — yoki kichkina; yilda bir marta — yoki har hafta.</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== TEST-EKRAN sarlavhasi (105-qonun: .h-ask) =====
const TestQ = ({ ask }) => <h2 className="title h-ask">{ask}</h2>;

const Screen3 = (props) => (
  <QuestionScreen {...props} eyebrow="Tekshiruv · reliz bo'ldimi" scope="module-mikro"
    ctaLabel="Javobni tanlang" revealPrefix="To'g'ri javob"
    question={<TestQ ask="🌐 Sinfdoshingiz yangi tugma yozdi — hozircha faqat o'z kompyuterida. Bu reliz bo'ldimi?" />}
    questionText="Faqat o'z kompyuterida ishlagan tugma reliz bo'ldimi"
    options={["Ha — kod tayyor bo'ldi, demak reliz", "Yo'q — odamlar hali ishlata olmaydi", "Yo'q — odamlarga bu o'zgarish kichkina"]}
    correctIdx={1}
    explainCorrect="To'g'ri — reliz kod yozilgan kun emas, odamlar ishlata boshlagan kun."
    explainWrong={{
      0: "Kod tayyor bo'lgani yetmaydi: bo'lak odamlar ishlatadigan joyga chiqmaguncha reliz bo'lmaydi.",
      2: "Reliz kichkina ham bo'ladi — gap o'lchamda emas, odamlar ishlata oladimi-yo'qmi shunda.",
      default: "Reliz — bo'lak odamlar qo'liga tekkan payt."
    }}
  />
);

// ===== SCREEN 4 — YADRO: RELIZ-TASMASI (markaziy mexanika) =====
// 🔴 Kashfiyot-himoyasi: 42 soniya harakatsizlikdan keyin bitta ipucha — javobni AYTMAYDI.
const POYGA_KEY = 'pm-m4c2-poyga';
const TIP_SEC = 42;
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [h, setH] = useState(() => storedAnswer?.hafta || 0);
  const [sec, setSec] = useState(0);
  const done = h >= HAFTA_SONI;
  useEffect(() => {
    if (done || isMentor) return;
    const t = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [done, isMentor]);
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      try { localStorage.setItem(POYGA_KEY, JSON.stringify({ hafta: HAFTA_SONI, savedAt: Date.now() })); } catch {}
      onAnswer(screen, { stage: 'poyga', screenIdx: screen, hafta: HAFTA_SONI, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'poyga', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const oldinga = () => { if (isMentor || done) return; setH(v => Math.min(HAFTA_SONI, v + 1)); };
  const btnTurn = useTurnHint(h === 0 && !isMentor);
  const tipOn = !done && !isMentor && h === 0 && sec >= TIP_SEC;
  const cur = h > 0 ? POYGA[h - 1] : null;
  // 77-qonun: oxirgi hafta ochilgach xulosa-karta ko'rinishga olib kelinadi (ekran ostida qolmasin)
  const xulRef = useRef(null);
  useEffect(() => {
    if (!done || !xulRef.current) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const t = setTimeout(() => { if (xulRef.current) xulRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'nearest' }); }, 320);
    return () => clearTimeout(t);
  }, [done]);
  const navLabel = done || isMentor ? 'Davom etish' : `① Yana ${HAFTA_SONI - h} haftani o'tkazing`;
  return (
    <Stage eyebrow="Amaliyot · olti hafta" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(9px,1.4vw,14px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Haftani o'tkazing — ikki saytni <span className="italic" style={{ color: T.accent }}>solishtiring</span>.</h2></div>
        <Mentor>Chapda ikki sinfdoshning ikki yo'li, o'ngda 6 hafta. «Keyingi hafta»ni bosib boring — har haftada kim nimani chiqargani va odamlar nima qilgani ochiladi.</Mentor>
        <div className="pyg">
          <div className="pyg-h">
            <span className="pyg-t">🏁 Poyga: 6 hafta</span>
            <span className="pyg-n mono">{h} / {HAFTA_SONI}</span>
          </div>
          <span className="pyg-src">👥 odam soni — maktabdagi o'quvchilar</span>
          <div className="pyg-lane">
            <span className="pyg-nom">🧱 {YOL_KATTA}</span>
            <div className="pyg-cells">
              {POYGA.map((w, i) => {
                const ochiq = i < h;
                const yakun = i === HAFTA_SONI - 1;
                if (!ochiq) return <span key={w.n} className="pyg-cell wait"><span className="pyg-w mono">{w.n}-hafta</span><span className="pyg-ic">·</span></span>;
                if (!yakun) return (
                  <span key={w.n} className="pyg-cell lock fade-step">
                    <span className="pyg-w mono">{w.n}-hafta</span><span className="pyg-ic">🔒</span>
                    <span className="pyg-nm">yasalmoqda</span><span className="pyg-odam mono">0 kishi</span>
                  </span>
                );
                return (
                  <span key={w.n} className="pyg-cell on fade-step">
                    <span className="pyg-w mono">{w.n}-hafta</span><span className="pyg-ic">{KATTA_YAKUN.ic}</span>
                    <span className="pyg-nm">{KATTA_YAKUN.nom}</span><span className="pyg-odam mono">{KATTA_YAKUN.odam} kishi</span>
                  </span>
                );
              })}
            </div>
          </div>
          <div className="pyg-lane">
            <span className="pyg-nom">🧩 {YOL_KICHIK}</span>
            <div className="pyg-cells">
              {POYGA.map((w, i) => {
                const ochiq = i < h;
                if (!ochiq) return <span key={w.n} className="pyg-cell wait"><span className="pyg-w mono">{w.n}-hafta</span><span className="pyg-ic">·</span></span>;
                return (
                  <span key={w.n} className="pyg-cell on fade-step">
                    <span className="pyg-w mono">{w.n}-hafta</span><span className="pyg-ic">{w.ic}</span>
                    <span className="pyg-nm">{w.nom}</span><span className="pyg-odam mono">{w.odam} kishi</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="split s4">
          <Col gap={9}>
            <div className="pygc">
              <button type="button" className={`pyg-btn${h === 0 && btnTurn && !isMentor ? '' : ' calm'}`} onClick={oldinga} disabled={done || isMentor}>
                {done ? '✓ Olti hafta o\'tdi' : '▶ Keyingi hafta'}
              </button>
              <span className="pygc-sub">{done ? "Olti hafta ochildi — pastdagi xulosani o'qing." : "Har bosishda ikkala saytda o'sha haftaning katagi ochiladi."}</span>
              {tipOn && <p className="bhint fade-step">💡 Keyingi haftani o'tkazing — kataklar ochiladi.</p>}
            </div>
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label="🏁 Poygani o'tkazganlar" />
          </Col>
          <Col gap={9}>
            <div className="pygd">
              <span className="pygd-h">{cur ? `${cur.n}-haftada nima bo'ldi` : 'Hafta ochilganda shu yerda yoziladi'}</span>
              {cur && (
                <>
                  <span className="pygd-row katta fade-step">
                    <b>🧱 {YOL_KATTA}</b>
                    {h < HAFTA_SONI
                      ? <i>🔒 Yasalmoqda — 0 kishi</i>
                      : <i>{KATTA_YAKUN.ic} Chiqdi: {KATTA_YAKUN.royxat} — {KATTA_YAKUN.odam} kishi</i>}
                  </span>
                  <span className="pygd-bildi fade-step">🔎 {h === HAFTA_SONI ? <>1-marta bilib oldi: {KATTA_YAKUN.bildi}</> : 'Hali hech narsa bilgani yo\'q — 0 marta'}</span>
                  <span className="pygd-row kichik fade-step">
                    <b>🧩 {YOL_KICHIK}</b>
                    <i>{cur.ic} {cur.nom} — {cur.odam} kishi</i>
                  </span>
                  <span className="pygd-bildi fade-step">🔎 {cur.n}-marta bilib oldi: {cur.bildi}</span>
                </>
              )}
            </div>
          </Col>
        </div>
        {done && (
          <div className="xul fade-step" ref={xulRef}>
            <span className="xul-h">✅ Buni o'zingiz ko'rdingiz: 6 haftada «{YOL_KICHIK}» sayti odamlardan 6 marta bilib oldi, «{YOL_KATTA}» sayti — 1 marta.</span>
            <p className="xul-b">Kim tez-tez chiqarsa, o'sha oldin biladi.</p>
          </div>
        )}
        <MentorNote>Bolalar 6 haftani tez bosib o'tadi. 3-haftadan keyin to'xtating va so'rang: «{YOL_KATTA}» sayti hozir nimani biladi? Javob — hech narsani. Shu lahza dars. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.</MentorNote>
      </div>
    </Stage>
  );
};

const Screen5 = (props) => (
  <QuestionScreen {...props} eyebrow="Tekshiruv · eng erta qachon" scope="module-mikro"
    ctaLabel="Javobni tanlang" revealPrefix="To'g'ri javob"
    question={<TestQ ask="🧩 Loyihangizga uchta bo'lak yasamoqchisiz. Odamlarga nima kerakligini eng erta qachon bilasiz?" />}
    questionText="Odamlarga nima kerakligini eng erta qachon bilasiz"
    options={["Birinchi bo'lakni odamlar ishlatgan kuni", "Uchala bo'lakni rejaga yozib chiqqan kuni", "Kod o'z kompyuteringizda ishlab turgan kuni"]}
    correctIdx={0}
    explainCorrect="To'g'ri — birinchi bo'lak chiqqan zahoti odamlar nima qilishi ko'rinadi; kim tez-tez chiqarsa, o'sha oldin biladi."
    explainWrong={{
      1: "Rejaga yozilgani hech narsa o'rgatmaydi — odamlar unga hali tegmagan.",
      2: "O'z kompyuteringizda ishlab turgani hali reliz emas: odamlar unga tegmagan, demak bilib ham olmaysiz.",
      default: "Birinchi bo'lak chiqib, odamlar ishlatgan haftadayoq nima kerakligi ko'rinadi."
    }}
  />
);

// ===== SCREEN 6 — K13 TELEGRAM: 4 slayd + 2 bashorat + ko'prik (33/56/91b-qonun) =====
// 🔴 33-qonun: kamida IKKI kalit-slayd oldidan bashorat. Ikkalasi IKKI O'LCHOVDA:
// (1) CHASTOTA — qanchalik tez-tez chiqadi · (2) MIQDOR — oyiga nechta odam foydalanadi.
// 🔴 Hisoblagich (korpus §123/§101): javobgacha «—» da turadi, keyin bitta yugurish bilan keladi.
const K13_SLIDES = [
  { ic: '📱', h: 'Telefoningizdagi Telegram',
    body: <>Vaqti-vaqti bilan «Yangilanish» keladi: yangi tugmalar, yangi bo'laklar. Bu qanchalik tez-tez bo'lishini o'zingiz belgilab ko'ring.</> },
  { ic: '🔮', h: null, body: null,
    predict: { ask: 'Sizningcha, Telegram katta yangilanishni qanchalik tez-tez chiqaradi?', chips: [
      { ic: '📆', t: 'Yiliga bir marta' },
      { ic: '📦', t: 'Deyarli har oy' },
      { ic: '🕰', t: 'Uch yilda bir' },
    ], ans: 1,
      hit: '🎯 Topdingiz! Deyarli har oy',
      miss: 'Adashdingiz — asl javob: deyarli har oy' } },
  { ic: '📦', h: 'Deyarli har oy',
    body: <>Telegram yillar davomida katta yangilanishlarni <b>deyarli har oy</b> chiqarib keladi — to'xtamasdan.</> },
  { ic: '⚡', h: 'Reaksiya, stiker, kanal',
    body: <>Bu uch bo'lakni Telegram <b>raqiblaridan yillar oldin</b> chiqargan. Boshqa yozishuv ilovalarida xuddi shundaylari yillar keyin paydo bo'ldi.</> },
  { ic: '🔮', h: null, body: null,
    predict: { ask: 'Sizningcha, 2025-yil martida Telegramdan oyiga nechta odam foydalanadi?', chips: [
      { ic: '1️⃣', t: '100 million' },
      { ic: '2️⃣', t: '1 milliard' },
      { ic: '3️⃣', t: '3 milliard' },
    ], ans: 1,
      hit: '🎯 Topdingiz! 1 milliard',
      miss: 'Adashdingiz — asl javob: 1 milliard' } },
  { ic: '👥', h: '1 milliard odam (2025-yil mart)',
    body: <>Oyiga shuncha odam Telegramdan foydalanadi. Tez chiqarish — Telegramning o'ziga xos belgisi bo'lib qoldi.</> },
  { ic: null, h: null, body: null, bridge: true },
];
// Bosqichma-bosqich hisoblagich holati (10-qonun: raqam DOIM yili bilan turadi).
const K13_HISOB = [
  { oy: false, odam: null },  // 1-slayd — chastota hali aytilmagan
  { oy: false, odam: null },  // bashorat-1 (javob ekranda ko'rinmasin)
  { oy: true,  odam: null },  // 2-slayd — 12 oy-katagi yonadi
  { oy: true,  odam: null },  // 3-slayd
  { oy: true,  odam: null },  // bashorat-2 — «—» da to'xtab turadi
  { oy: true,  odam: 1000 },  // 4-slayd — «—» dan 1 milliardgacha bitta yugurish
  { oy: true,  odam: 1000 },  // ko'prik
];
const fmtOdam = (mln) => (mln >= 1000 ? `${(mln / 1000).toFixed(mln % 1000 === 0 ? 0 : 1).replace('.', ',')} milliard` : `${Math.round(mln)} million`);
function OdamHisob({ oy, odam }) {
  const [v, setV] = useState(odam || 0);
  const fromRef = useRef(odam || 0);
  useEffect(() => {
    if (odam == null) { setV(0); fromRef.current = 0; return; }
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const from = fromRef.current;
    if (kam || from === odam) { setV(odam); fromRef.current = odam; return; }
    const t0 = Date.now(), DUR = 900;
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (Date.now() - t0) / DUR);
      setV(from + (odam - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick); else fromRef.current = odam;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [odam]);
  return (
    <div className="kmy">
      <span className="kmy-lbl">📦 Katta yangilanish — bir yil</span>
      <div className="kmy-oy">
        {Array.from({ length: 12 }).map((_, k) => (
          <span key={k} className={`kmy-c${oy ? ' on' : ''}`} style={{ '--kd': `${0.06 * k}s` }}>{oy ? '📦' : ''}</span>
        ))}
      </div>
      <span className="kmy-oylbl">{oy ? 'deyarli har oy — bitta katta yangilanish' : '12 oy — hali noma\'lum'}</span>
      <span className="kmy-val mono">{odam == null ? '—' : fmtOdam(v)}{odam != null && <i className="kmy-yil">(2025-yil mart)</i>}</span>
      <span className="kmy-sub">👥 Oyiga foydalanadigan odam{odam == null && ' — hali noma\'lum'}</span>
    </div>
  );
}
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gateK = useContext(LiveGateCtx) || {};
  const isMentorK = !!(gateK.live && gateK.live.mode === 'mentor');
  const [i, setI] = useState(0);
  const [bets, setBets] = useState({});
  // Nuqta faqat ALLAQACHON ko'rilgan bosqichga yo'l beradi; oldinga yurish faqat NavNext orqali,
  // u esa bashorat berilmaguncha qulflangan.
  const [maxSeen, setMaxSeen] = useState(0);
  useEffect(() => { setMaxSeen(m => Math.max(m, i)); }, [i]);
  const last = i === K13_SLIDES.length - 1;
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last]); // eslint-disable-line
  const c = K13_SLIDES[i];
  const bet = c.predict ? bets[i] : undefined;
  const betPending = !!(c.predict && bet === undefined);
  const betHint = useTurnHint(betPending && !isMentorK);
  // 44-qonun oilasi: mentor rejimida ham javob OLDINDAN ochilmaydi — u ham bosib ochadi.
  const showSlide = c.h && (!c.predict || bet !== undefined);
  const hisob = K13_HISOB[i];
  return (
    <Stage eyebrow="⚡ Haqiqiy voqea" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={betPending && !isMentorK} label={betPending && !isMentorK ? "Avval o'zingiz belgilang" : last ? 'Davom etish' : `Keyingi bosqich (${i + 1}/${K13_SLIDES.length})`} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen k-fill" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Bizning olamdan <span className="italic" style={{ color: T.accent }}>mashhur voqea</span></h2></div>
        <OdamHisob oy={hisob.oy} odam={hisob.odam} />
        {c.predict && (
          <div className={`kp-bet fade-step${bet !== undefined ? ' answered' : ''}`} key={`b${i}`}>
            {/* 🔴 ETALON 22 (sanoq-mosligi): bashoratli bosqichda ham hisoblagich uzluksiz
                turadi (1·2·…·7) va har bosqichda AYNAN BITTA joyda ko'rinadi. */}
            <span className="k-slide-eyebrow">{bet === undefined ? "🎲 Avval o'zingiz belgilab ko'ring" : '⚡ Haqiqiy voqea'} · {i + 1} / {K13_SLIDES.length}</span>
            <h3 className="k-slide-h">{c.predict.ask}</h3>
            <div className="kp-chips">
              {c.predict.chips.map((ch, k) => {
                const locked = bet !== undefined;
                const isAns = k === c.predict.ans;
                let cls = 'kp-chip';
                if (locked) { cls += ' locked'; if (isAns) cls += ' correct'; else if (bet === k && !isMentorK) cls += ' wrong'; }
                else cls += waveCls(betHint, k, c.predict.chips.length);
                return (
                  <button key={k} className={cls} disabled={locked} onClick={() => setBets(p => ({ ...p, [i]: k }))}>
                    <span className="kp-ic">{ch.ic}</span>{ch.t}
                    {locked && isAns && <span className="kp-mark ok">✓</span>}
                    {locked && !isAns && bet === k && !isMentorK && <span className="kp-mark no">✗</span>}
                  </button>
                );
              })}
            </div>
            {bet !== undefined && !isMentorK && (
              <p className={`kp-res ${bet === c.predict.ans ? 'hit' : 'miss'}`}>
                {bet === c.predict.ans ? c.predict.hit : c.predict.miss}
              </p>
            )}
          </div>
        )}
        {showSlide && (
          <div className="k-slide fade-step" key={`s${i}`}>
            {!c.predict && <span className="k-slide-eyebrow">⚡ Haqiqiy voqea · {i + 1} / {K13_SLIDES.length}</span>}
            <div className="k-slide-ic">{c.ic}</div>
            <h3 className="k-slide-h">{c.h}</h3>
            <p className="k-slide-body">{c.body}</p>
          </div>
        )}
        <div className="k-dots">{K13_SLIDES.map((_, k) => {
          const ochiq = k <= maxSeen && !(betPending && k > i);
          return <button key={k} className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} disabled={!ochiq} onClick={() => ochiq && setI(k)} aria-label={`${k + 1}-bosqich`} title={ochiq ? undefined : "Avval shu bosqichni tugating"} />;
        })}</div>
        {c.bridge && (
          <div className="frame-soft fade-step" key={`k${i}`}>
            {/* ETALON 22: ko'prik-bosqichi ham sanoqqa kiradi — zanjir uzilmaydi */}
            <span className="k-slide-eyebrow">⚡ Haqiqiy voqea · {i + 1} / {K13_SLIDES.length}</span>
            <p className="body" style={{ margin: '10px 0 0', color: T.ink }}>Telegram tez chiqaradi — va poygada oldinda. Loyihangizda ham shunday: har hafta chiqqan bo'lak odamlarga nima kerakligini aytadi. Nimani qachon chiqarishni kod emas, <b>mahsulotni o'ylaydigan odam</b> hal qiladi — endi shu qaror sizniki.</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

const Screen7 = (props) => (
  <QuestionScreen {...props} eyebrow="Tekshiruv · boshqa ilovalarda" scope="module-mikro"
    ctaLabel="Javobni tanlang" revealPrefix="To'g'ri javob"
    question={<TestQ ask="⚡ Reaksiya, stiker, kanal — Telegramdan keyin boshqa yozishuv ilovalarida qachon paydo bo'ldi?" />}
    questionText="Reaksiya, stiker, kanal boshqa yozishuv ilovalarida qachon paydo bo'ldi"
    options={['Telegramdan bir necha yil oldin', "Telegramdan bir necha yil keyin", "Telegram bilan bir kunda, birga"]}
    correctIdx={1}
    explainCorrect="To'g'ri — bu uch bo'lakni Telegram raqiblaridan yillar oldin chiqargan; boshqalarida ular bir necha yil keyin yetib keldi. Tez chiqarish uni poygada oldinga chiqardi."
    explainWrong={{
      0: "Teskarisi bo'lgan: bu uch bo'lakni Telegram raqiblaridan yillar oldin chiqargan.",
      2: "Bir kunda emas — avval Telegramda chiqdi, boshqalarida bir necha yil keyin.",
      default: "Boshqa yozishuv ilovalarida bu bo'laklar bir necha yil keyin paydo bo'ldi."
    }}
  />
);

// ===== SCREEN 8 — UCH HAFTALIK BO'LAK (48/80/85/92/106d-qonun) =====
// Chiqish-artefakt (AVTO-GATE S 4-qarori): { bolaklar: [{hafta, ish} x3], savedAt } — m4c-06 o'qiydi.
const OUT_KEY = 'pm-m4c2-reliz';
const APO = "['\\u02BB\\u2019]";
const rx = (src, flags) => new RegExp(src.replace(/'/g, APO), flags || 'i');
// Katta-ish so'zlari (106d-c, dars o'z lug'atidan): bunday bo'lak bir haftaga sig'maydi.
const KATTA_SOZ = rx("hammasi|hammasini|butun|to'liq|to'liq sayt|barcha|qayta yasa");
// Odam qiladigan harakat — bo'lak «ish» ekanining belgisi (s9 ikkinchi chirog'i bilan bir til).
const HARAKAT = rx("bos|yoz|ko'r|och|yubor|qo'sh|tanla|kirit|topa|izla|qidir|belgila|to'g'rila|nusxa|tushadi|chiqadi|ketadi|keladi|oladi");
const normIsh = (s) => s.toLowerCase().replace(new RegExp(APO, 'g'), '').replace(/[^a-z0-9 ]+/gi, ' ').replace(/\s+/g, ' ').trim();
const sozSoni = (s) => normIsh(s).split(' ').filter(Boolean).length;
// Natija-fe'llari: bo'lak ishlatilgandan KEYIN sodir bo'ladigan narsa — bu ikkinchi ish EMAS.
const NATIJA = rx("chiqadi|chiqib|ko'rinadi|ko'rinib|tushadi|tushib|keladi|kelib|ochiladi|ochilib|yopiladi|saqlanadi|yuboriladi|ketadi|ketib|qo'shiladi|yozilad|bo'ladi|paydo bo'l|nusxalanadi|yangilanadi|o'chadi|o'chiriladi|to'g'rilanadi|ko'rsatadi|ko'rsatiladi|topiladi");
// Odamning O'Z harakati (natija-fe'li bo'lgan bo'lak bu ro'yxatdan chiqadi).
const AKTIV = rx("bos|yoz|ko'r|och|yubor|qo'sh|tanla|kirit|topa|izla|qidir|belgila|to'g'rila|nusxa|yukla|jo'nat");
// «Va» tekshiruvi: qatorda IKKI HARAKAT bo'lsa — ikkita ish. «bosadi va … chiqadi»
// (harakat + natija) bitta ish sanaladi: ipucha-savolning o'zi shu shaklda so'raydi.
const ikkiIsh = (s) => {
  const p = s.split(rx('\\s+va\\s+'));
  if (p.length < 2) return false;
  const harakatBolagi = (x) => sozSoni(x) >= 2 && AKTIV.test(x) && !NATIJA.test(x);
  return p.filter(harakatBolagi).length >= 2;
};
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [list, setList] = useState(() => (storedAnswer && Array.isArray(storedAnswer.bolaklar)) ? storedAnswer.bolaklar : []);
  const [dIsh, setDIsh] = useState('');
  const [edit, setEdit] = useState(null);
  const [focus, setFocus] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const done = list.length >= 3;
  const savedRef = useRef(false);
  const uzun = sozSoni(dIsh) >= 3;
  const kattaIsh = uzun && KATTA_SOZ.test(dIsh);
  const juft = uzun && ikkiIsh(dIsh);
  const takror = uzun && list.some((r, k) => k !== edit && normIsh(r.ish) === normIsh(dIsh));
  const canSave = uzun && !kattaIsh && !juft && !takror;
  const inputTurn = useTurnHint(!done && !uzun && !focus && !isMentor);
  const nQadam = edit === null ? list.length + 1 : edit + 1;
  useEffect(() => {
    if (!done || savedRef.current) return;
    savedRef.current = true;
    try { localStorage.setItem(OUT_KEY, JSON.stringify({ bolaklar: list.slice(0, 3), savedAt: Date.now() })); } catch {}
    if (storedAnswer === undefined || !storedAnswer.solved) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, bolaklar: list.slice(0, 3), solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  useEffect(() => {
    if (!done || !savedRef.current) return;
    try { localStorage.setItem(OUT_KEY, JSON.stringify({ bolaklar: list.slice(0, 3), savedAt: Date.now() })); } catch {}
  }, [list, done]);
  const save = () => {
    if (!canSave) return;
    const v = { hafta: nQadam, ish: dIsh.trim() };
    setList(p => (edit === null ? [...p, v] : p.map((r, k) => (k === edit ? v : r))));
    setDIsh(''); setEdit(null);
  };
  const startEdit = (k) => { setEdit(k); setDIsh(list[k].ish); };
  const harakatBor = list.slice(0, 3).every(r => HARAKAT.test(r.ish));
  const sigadi = list.slice(0, 3).every(r => !KATTA_SOZ.test(r.ish));
  const oldingi = edit === null && list.length > 0 ? list[list.length - 1] : null;
  const navLabel = done || isMentor
    ? 'Davom etish'
    : list.length === 0 ? "① Birinchi bo'lakni yozing va saqlang" : `② Yana ${3 - list.length} bo'lak yozing`;
  return (
    <Stage eyebrow="Mustaqil ish · uch bo'lak" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Loyihangizga uch haftalik <span className="italic" style={{ color: T.accent }}>bo'lak</span> yozing.</h2></div>
        <Mentor>Loyihangizdagi bitta katta ishni uch haftaga bo'ling — quyiga katta ishni emas, har haftaga bitta bo'lakni yozasiz.</Mentor>
        {/* 80a: havoda uch doira — yozilgani yashil, joriysi pulsda, kelgusi punktir */}
        <div className="stps fade-up">
          {[0, 1, 2].map(k => (
            <span key={k} className={`stp ${list.length > k ? 'done' : (edit === null ? list.length : edit) === k ? 'on' : ''}`}><i>{list.length > k ? '✓' : k + 1}</i>{k + 1}-hafta</span>
          ))}
        </div>
        <div className="split">
          <Col gap={9}>
            {/* 80b: ekranning yagona kartasi — hafta-yorlig'i o'zi turadi, o'quvchi bitta qator yozadi */}
            {(!done || edit !== null) && (
              <div className="wsp-ed">
                <span className="wsp-ed-h">{nQadam}-hafta</span>
                {oldingi && <span className="wsp-prev">Oldingi: {list.length}-hafta — {oldingi.ish.length > 56 ? `${oldingi.ish.slice(0, 56)}…` : oldingi.ish}</span>}
                <span className="wsp-q">Odam nimani bosadi va nima bo'ladi?</span>
                <input className={`reflect-input${inputTurn ? ' await' : ''}${uzun ? ' filled' : ''}`} value={dIsh} maxLength={110}
                  placeholder="Masalan: «Yozilish» tugmasi — bossa, ism ro'yxatga tushadi"
                  onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                  onChange={e => setDIsh(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') save(); }} />
                {/* 106d: ikki tomonlama javob — savolni qaytaradi, yo'l ko'rsatadi */}
                {dIsh.trim().length > 0 && !uzun && <p className="sfb ask">🤔 Bir-ikki so'z yetmaydi: odam nimani bosadi va nima bo'ladi?</p>}
                {kattaIsh && <p className="sfb ask">🤔 Bu bir haftaga sig'maydi ko'rinadi — shu ishning odam birinchi bosadigan bo'lagini yozing.</p>}
                {juft && <p className="sfb ask">🤔 Bu ikkita ish — bittasini shu haftaga, ikkinchisini keyingisiga.</p>}
                {takror && <p className="sfb ask">🤔 Bu bo'lak yuqorida allaqachon yozilgan — keyingi haftaga boshqa bo'lak.</p>}
                {canSave && <p className="sfb ok">{HARAKAT.test(dIsh)
                  ? "✅ Bo'lak aniq — hafta oxirida odam buni ishlata oladi."
                  : "✅ Saqlashingiz mumkin. Odam nima qilishi ham ko'rinsa yaxshi: bosadi, ko'radi, yozadi."}</p>}
                {/* 30-qonun: qulf-tugma AYNAN qaysi qadam qolganini aytadi */}
                <div className="wsp-go">
                  <button type="button" className="wsp-save" disabled={!canSave} onClick={save}>{edit === null ? 'Saqlash →' : '✓ Yangilash'}</button>
                  {!canSave && <span className="wsp-need">{!uzun ? '① Bo\'lak nima qilishini yozing' : takror ? '① Boshqa bo\'lak yozing' : kattaIsh ? '② Kichikroq bo\'lak yozing' : '② Bitta ishni qoldiring'}</span>}
                </div>
              </div>
            )}
            {/* 80c: yozilganlar YOZISH PAYTIDA ko'rinmaydi; uchtasi yozilgach ro'yxat ochiladi */}
            {done && edit === null && (
              <div className="wsp-list fade-step">
                <span className="wsp-list-h">🗓 Uch haftalik bo'laklaringiz</span>
                {list.slice(0, 3).map((r, k) => (
                  <span key={k} className="wsp-item">
                    <span className="wsp-item-n">{k + 1}</span>
                    <span className="wsp-item-t">{k + 1}-hafta <i className="wsp-arw">→</i> {r.ish}</span>
                    <button type="button" className="wsp-item-edit" title="Tahrirlash" onClick={() => startEdit(k)}>✎</button>
                  </span>
                ))}
              </div>
            )}
          </Col>
          <Col gap={9}>
            <div className="wsp-task">
              <span className="wsp-task-lbl">🎯 Topshiriq</span>
              <span className="wsp-task-nom">Uch hafta — uch bo'lak</span>
              <div className="wsp-chk">
                <span className={`wsp-chk-i${done ? ' on' : ''}`}><i>{done ? '✓' : '○'}</i>Uch hafta — uch bo'lak</span>
                <span className={`wsp-chk-i${done && harakatBor ? ' on' : ''}`}><i>{done && harakatBor ? '✓' : '○'}</i>Har bo'lakda odam nima qilishi yozilgan</span>
                <span className={`wsp-chk-i${done && sigadi ? ' on' : ''}`}><i>{done && sigadi ? '✓' : '○'}</i>Har bo'lak bir haftaga sig'adi</span>
              </div>
              {/* 106c-b: holat ko'rsatkichi */}
              <span className="wsp-task-n mono">3 tadan {Math.min(list.length, 3)} tasi yozildi</span>
            </div>
            <div className="wsxrow">
              <div className={`wsx ${yordamOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>💡 Yordam {yordamOpen ? '▾' : '▸'}</button>
                {yordamOpen && <div className="wsx-body"><p>Har bo'lakka bitta savol bering: hafta oxirida odam buni <b>bosganda nima bo'ladi</b>? Javob chiqmasa — bo'lak hali ish emas, uni kichraytiring.</p></div>}
              </div>
              <div className={`wsx star ${starOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setStarOpen(o => !o)}>⭐ Qo'shimcha {starOpen ? '▾' : '▸'}</button>
                {starOpen && <div className="wsx-body"><p>Uch bo'lagingizdan qaysi biri odamlar haqida eng ko'p narsa aytadi — o'shani belgilang.</p></div>}
              </div>
            </div>
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label="✍️ Uch bo'lakni yozganlar" />
          </Col>
        </div>
        {done && edit === null && <div className="done-mini fade-step">✅ Uch bo'lagingiz yozildi <span className="dm-sub">— har birida odam nima qilishi ko'rinadi</span></div>}
        <MentorNote>Birinchi bo'lakka «butun saytni yasash» yozadiganlar chiqadi — eng foydali xato. Javob-qatori tutadi; siz so'rang: hafta oxirida odam nimani bosadi? Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEKSHIRUV: HAFTAGA-SIG'DIRISH DARVOZASI (26-qonun: yangi mexanika) =====
// Sahna yangi, olam o'sha (91-qonun): 6 haftalik poygadan KEYINGI katta ish.
// Nomzodlar s4 bo'laklarini takrorlamaydi (§102); har raundda AYNAN bitta karta ikkala chiroqni yoqadi.
const SIGIM_KUN = 5;
const RAUNDLAR = [
  { hafta: 1, ok: 'r1c',
    ok_txt: "✅ ≈5 kun — sig'di, va odam bosgan zahoti xabar ketadi. 1-hafta tayyor.",
    reja: { ic: '📨', nom: "«Topdim!» → egasiga xabar", kun: 5 },
    nomzod: [
      { id: 'r1a', ic: '🔘', t: "«Topdim!» tugmasi qo'yiladi — bosilsa hali hech narsa bo'lmaydi", kun: 1, vaqt: true, ish: false },
      { id: 'r1b', ic: '✉️', t: "Xabar, rasm, xabarlar tarixi va ikki tomonlama chat — birdan", kun: 11, vaqt: false, ish: true },
      { id: 'r1c', ic: '📨', t: "«Topdim!» — bosilsa egasiga xabar ketadi, egasi «Menda ✓» deb javob beradi", kun: 5, vaqt: true, ish: true },
    ] },
  { hafta: 2, ok: 'r2a',
    ok_txt: "✅ ≈2 kun — sig'di, va odam xabarga rasm qo'sha oladi. 2-hafta tayyor.",
    reja: { ic: '🖼', nom: "Xabarga rasm qo'shish", kun: 2 },
    nomzod: [
      { id: 'r2a', ic: '🖼', t: "Xabarga rasm qo'shish — bossa, rasm birga ketadi", kun: 2, vaqt: true, ish: true },
      { id: 'r2b', ic: '💬', t: 'Chat oynasi ochiladi — lekin xabar yuborilmaydi', kun: 2, vaqt: true, ish: false },
      { id: 'r2c', ic: '🗂', t: 'Rasm, chat va xabarlar tarixi — hammasi birdan', kun: 9, vaqt: false, ish: true },
    ] },
  { hafta: 3, ok: 'r3b',
    ok_txt: "✅ ≈4 kun — sig'di, va ikki odam bir-biriga yoza oladi. 3-hafta tayyor.",
    reja: { ic: '💬', nom: 'Ikki tomonlama chat', kun: 4 },
    nomzod: [
      { id: 'r3a', ic: '🗂', t: 'Chat va xabarlar tarixi — ikkovi birga', kun: 7, vaqt: false, ish: true },
      { id: 'r3b', ic: '💬', t: 'Ikki tomonlama chat — ikkovi bir-biriga yozadi', kun: 4, vaqt: true, ish: true },
      { id: 'r3c', ic: '🔘', t: '«Chat» tugmasi — bosilsa hali oyna ochilmaydi', kun: 1, vaqt: true, ish: false },
    ] },
];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [ri, setRi] = useState(() => storedAnswer?.ri || 0);
  const [lamp, setLamp] = useState(null);   // oxirgi bosilgan nomzod hukmi
  const [miss, setMiss] = useState(null);
  const [tries, setTries] = useState(0);
  const [missedOnce, setMissedOnce] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const done = ri >= RAUNDLAR.length;
  const raund = done ? null : RAUNDLAR[ri];
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      try { localStorage.setItem('pm-m4c2-darvoza', JSON.stringify({ raund: RAUNDLAR.length, savedAt: Date.now() })); } catch {}
      onAnswer(screen, { stage: 'darvoza', screenIdx: screen, ri: RAUNDLAR.length, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'darvoza', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const tanla = (n) => {
    if (isMentor || done) return;
    setLamp({ vaqt: n.vaqt, ish: n.ish, kun: n.kun });
    if (n.id === raund.ok) { setMiss(null); setTries(0); setLamp({ vaqt: true, ish: true, kun: n.kun, ok: true }); setTimeout(() => { setLamp(null); }, 1400); setRi(r => r + 1); return; }
    const t = tries + 1;
    setTries(t);
    setMissedOnce(true);
    setMiss(!n.vaqt
      ? `🤔 ≈${n.kun} kun — haftaga sig'madi. Kichikroq bo'lakni tanlang.`
      : "🤔 Bosilsa hech narsa bo'lmaydi — odam buni ishlata olmaydi. Ish qiladigan bo'lakni tanlang.");
  };
  const koprik = tries >= 2 && !done;
  const navLabel = done || isMentor ? 'Davom etish' : `Yana ${RAUNDLAR.length - ri} haftani to'ldiring`;
  return (
    <Stage eyebrow="Tekshiruv · darvoza" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(9px,1.4vw,14px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Har haftaga sig'adigan bo'lakni <span className="italic" style={{ color: T.accent }}>tanlang</span>.</h2></div>
        <Mentor>Uch bo'lagingiz tayyor — endi sinfdoshning katta ishini o'ngdagi darvoza tekshiradi: haftaga sig'ishi va odam ishlata olishi. Uch nomzoddan bittasini darvozaga bosing.</Mentor>
        <div className="split s9">
          <Col gap={9}>
            <div className={`s9ask${done ? ' ok' : ''}`}>
              <span className="s9ask-n">{Math.min(ri + 1, RAUNDLAR.length)} / {RAUNDLAR.length}</span>
              <span className="s9ask-t">«{YOL_KICHIK}» saytining navbatdagi katta ishi: topgan odam e'lon egasiga xabar bera olsin. <i>{done ? 'Uch hafta to\'ldi.' : `${raund.hafta}-haftaga bitta nomzodni tanlang.`}</i></span>
            </div>
            <div className="nmz-opts">
              {!done && raund.nomzod.map(n => (
                <button key={n.id} type="button" className="nmz-opt" onClick={() => tanla(n)} disabled={isMentor}>
                  <span className="nmz-ic">{n.ic}</span>
                  <span className="nmz-t">{n.t}</span>
                  <span className="nmz-kun mono">≈{n.kun} kun</span>
                </button>
              ))}
              {done && <span className="rnk-empty">✓ Uch hafta — uch bo'lak darvozadan o'tdi</span>}
            </div>
            <span className="nmz-src">⏱ Necha kun ketishini sinfdoshning o'zi hisoblagan</span>
          </Col>
          <Col gap={9}>
            <div className={`dvz${lamp && lamp.ok ? ' ok' : ''}`}>
              <div className="dvz-h"><span>🚪 Bu hafta chiqadi</span><span className="dvz-sub mono">hafta = {SIGIM_KUN} ish kuni</span></div>
              <div className="dvz-lamps">
                <span className={`dvz-lamp${lamp ? (lamp.vaqt ? ' ok' : ' no') : ''}`}>⏱ haftaga sig'adi</span>
                <span className={`dvz-lamp${lamp ? (lamp.ish ? ' ok' : ' no') : ''}`}>👤 odam ishlata oladi</span>
              </div>
              {lamp && lamp.ok && <p className="dvz-res hit fade-step">{RAUNDLAR[Math.max(0, ri - 1)].ok_txt}</p>}
              {!lamp && !done && <p className="dvz-wait">Nomzodni bosing — chiroqlar javob beradi.</p>}
              <div className="pyg-cells reja">
                {RAUNDLAR.map((r, k) => (
                  k < ri
                    ? <span key={r.hafta} className="pyg-cell on fade-step"><span className="pyg-w mono">{r.hafta}-hafta</span><span className="pyg-ic">{r.reja.ic}</span><span className="pyg-nm">{r.reja.nom}</span><span className="pyg-odam mono">≈{r.reja.kun} kun</span></span>
                    : <span key={r.hafta} className="pyg-cell wait"><span className="pyg-w mono">{r.hafta}-hafta</span><span className="pyg-ic">·</span></span>
                ))}
              </div>
            </div>
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label="🚪 Darvozadan o'tkazganlar" />
          </Col>
        </div>
        {/* YORDAM-savoli ekran boshida TURMAYDI: faqat birinchi xatodan keyin ochiladi */}
        {miss && !done && <p className="bhint fade-step">{miss}</p>}
        {koprik && <p className="bhint fade-step">🤔 Qolgan ikkitasidan qaysi biri besh kunga sig'adi VA bosilganda javob qaytaradi?</p>}
        {/* 106d: o'quvchiga «Xato: N» emas — neytral urinish-sanog'i */}
        {tries > 0 && !done && <p className="small" style={{ margin: 0, color: T.ink3, fontWeight: 700 }}>Bu qadamda urinish: {tries} ta</p>}
        {missedOnce && !done && (
          <div className={`wsx ${yordamOpen ? 'open' : ''}`} style={{ maxWidth: 560 }}>
            <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>💡 Yordam {yordamOpen ? '▾' : '▸'}</button>
            {yordamOpen && <div className="wsx-body"><p>Ikki savol bering: bu bo'lak necha kun — <b>5 dan oshmaydimi</b>? Odam uni bossa — <b>nimadir bo'ladimi</b>?</p></div>}
          </div>
        )}
        {done && (
          <div className="bdone fade-step">
            <span className="done-mini">✅ Katta ishni uch haftaga bo'lib chiqdingiz <span className="dm-sub">— birinchi haftadayoq odamlar «Topdim!»ni bosa boshlaydi, sayt egasi esa uch marta bilib oladi</span></span>
          </div>
        )}
        <MentorNote>Eng ko'p adashiladigan joy — «faqat tugma» nomzodi: haftaga sig'adi, lekin bosilsa hech narsa bo'lmaydi. Ikkinchi chiroq shuning uchun bor. Ish-tartibi: juftlikda ishlating — har o'quvchi sherigining uch bo'lagini o'qib, har biriga «buni odam hafta oxirida ishlata oladimi?» deb so'raydi; javob topilmasa, bo'lak qayta yoziladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — KODING: ishni haftalarga bo'ladigan kod (26/82/87-qonun) =====
// Registr R1 navbati: m4b-02 VS Code -> m4c-02 KOMPILYATOR (src/compilator/HtmlCompiler.jsx).
const KODING_KEY = 'pm-m4c2-code';
const readKoding = () => { try { const v = JSON.parse(localStorage.getItem(KODING_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const writeKodingOpen = (open) => { try { const p = readKoding() || {}; localStorage.setItem(KODING_KEY, JSON.stringify({ ...p, open })); } catch {} };

// Darvoza-mashq (82e): «haftaga sig'ish» qoidasi kod yozishdan OLDIN muhrlanadi (yig'indi, alohida emas).
// §112 ko'prik: s9 da bir haftaga BITTA bo'lak tushgan; bu yerda bir haftaga bir nechta ichki ish tushadi.
const GATE_ITEMS = [
  { id: 'g1', ic: '📦', t: 'Har bir ish alohida 5 kundan kichik bo\'ladi',   ok: false },
  { id: 'g2', ic: '➕', t: 'Haftadagi ishlar kunlari qo\'shilib 5 dan oshmaydi', ok: true },
  { id: 'g3', ic: '🔢', t: 'Haftadagi ishlar soni 5 tadan oshmaydi',         ok: false },
];

// Kod-nomlari ASCII, apostrofsiz (bolaklar · qoshish · SIGIM); prozada «bo'laklar».
const KOD_STARTER = `// bolaklar — darvozadan o'tgan uch bo'lakning ichki ishlari, har biriga necha kun ketadi
const bolaklar = [
  { nom: 'topdim-tugmasi', kun: 1 },
  { nom: 'egasiga-xabar',  kun: 2 },
  { nom: 'menda-belgisi',  kun: 2 },
  { nom: 'rasm-qoshish',   kun: 2 },
  { nom: 'chat',           kun: 4 },
];
const SIGIM = 5; // bir hafta — 5 ish kuni

function haftalar(bolaklar) {
  // Ishlarni tartib bilan haftalarga joylang.
  // Har haftada kunlar yig'indisi SIGIM dan oshmasin.
  return [];
}

console.log(haftalar(bolaklar));
// [['topdim-tugmasi','egasiga-xabar','menda-belgisi'], ['rasm-qoshish'], ['chat']]
console.log(haftalar(bolaklar).length);   // 3`;

// Shartlar XULQ-ATVORGA bog'langan (manba-regex sanog'i emas): for...of bilan ham,
// reduce bilan ham yozilgan to'g'ri yechim o'tadi; starter holatida uchalasi ham qizil.
const KOD_DATA = "[{nom:'topdim-tugmasi',kun:1},{nom:'egasiga-xabar',kun:2},{nom:'menda-belgisi',kun:2},{nom:'rasm-qoshish',kun:2},{nom:'chat',kun:4}]";
const KOD_TASK = {
  eyebrow: 'Koding · haftalarga bo\'lish',
  title: 'Ishni haftalarga bo\'ling',
  brief: <>Funksiya ishlarni <b>tartib bilan</b> haftalarga joylasin: har haftada kunlar yig'indisi <span className="mono">SIGIM</span> dan oshmasin. Pastdagi <span className="mono">console.log</span> natijani ko'rsatadi.</>,
  files: [{ name: 'app.js', lang: 'js', starter: KOD_STARTER, placeholder: "// ishlarni haftalarga joylang" }],
  requirements: [
    { id: 'royxat', label: "Funksiya haftalar ro'yxatini (massiv ichida massivlar) qaytaradi",
      check: C.evalEquals(`(function(){var r=haftalar(${KOD_DATA});return Array.isArray(r)&&r.length>0&&r.every(Array.isArray);})()`, 'true', "Har hafta — alohida ro'yxat; bo'sh massiv o'tmaydi") },
    { id: 'sigim', label: 'Har haftadagi kunlar 5 dan oshmaydi',
      check: C.evalEquals(`(function(){var K={'topdim-tugmasi':1,'egasiga-xabar':2,'menda-belgisi':2,'rasm-qoshish':2,'chat':4};var r=haftalar(${KOD_DATA});if(!Array.isArray(r))return false;var n=0;for(var i=0;i<r.length;i++){if(!Array.isArray(r[i]))return false;var s=0;for(var j=0;j<r[i].length;j++){var e=r[i][j];var nm=(e&&e.nom)?e.nom:e;s+=K[nm]||0;n++;}if(s>5)return false;}return n===5;})()`, 'true', "Har haftada kunlar yig'indisi 5 dan oshmasin va bitta ish ham tushib qolmasin") },
    { id: 'uch', label: "Uch hafta chiqdi va tartib saqlangan",
      check: C.evalEquals(`(function(){var r=haftalar(${KOD_DATA});if(!Array.isArray(r))return '';var f=[];for(var i=0;i<r.length;i++){var w=r[i]||[];for(var j=0;j<w.length;j++){var e=w[j];f.push((e&&e.nom)?e.nom:e);}}return r.length+'|'+f.join(',');})()`, '3|topdim-tugmasi,egasiga-xabar,menda-belgisi,rasm-qoshish,chat', "Uch hafta chiqsin va ishlar boshlang'ich tartibda qolsin") },
  ],
};

const ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const isSelf = !live || live.mode === 'self';
  const [saved] = useState(() => readKoding());
  const [open, setOpen] = useState(() => !!(saved && saved.open));
  const [gpick, setGpick] = useState(() => (saved && saved.gpick) || null);
  const [miss, setMiss] = useState(null);
  const [missedOnce, setMissedOnce] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const missT = useRef(null);
  const [st, setSt] = useState(() => ({
    code: (storedAnswer && storedAnswer.code) || (saved && saved.code) || KOD_STARTER,
    done: !!(storedAnswer && storedAnswer.solved) || !!(saved && saved.done),
  }));
  const { code, done } = st;
  useEffect(() => () => clearTimeout(missT.current), []);
  const stage2 = !!gpick || isMentor || done;
  const openHint = useTurnHint(stage2 && !done && !open && !isMentor);
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const pickGate = (g) => {
    if (stage2) return;
    if (g.ok) {
      setGpick(g.id);
      try { localStorage.setItem(KODING_KEY, JSON.stringify({ ...(readKoding() || {}), gpick: g.id })); } catch {}
    } else {
      setMiss(g.id);
      setMissedOnce(true);
      clearTimeout(missT.current);
      missT.current = setTimeout(() => setMiss(null), 600);
    }
  };
  // Kompilyator `{ codes, code }` uzatadi; bu darsda yagona fayl — `app.js` (JS rejimi).
  const finishPractice = ({ codes, code: htmlCode }) => {
    const newCode = (codes && codes['app.js']) || htmlCode || code;
    setOpen(false);
    setSt({ code: newCode, done: true });
    try { localStorage.setItem(KODING_KEY, JSON.stringify({ ...(readKoding() || {}), code: newCode, done: true, open: false })); } catch {}
    if (!done) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code: newCode, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  const navLabel = done || isMentor ? 'Davom etish' : !stage2 ? "① Haftaga sig'ish qoidasini belgilang" : '② Kodni yozing';
  return (
    <Stage eyebrow="Koding · 🛠 kod oynasi" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.5vw,15px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Ishni haftalarga bo'ladigan <span className="italic" style={{ color: T.accent }}>kod</span> yozamiz.</h2></div>
        {!stage2 ? (
          <>
            <Mentor>Darvozada har haftaga bitta bo'lak tushgan edi. Kodda esa bo'lak ichidagi maydaroq ishlar haftalarga joylanadi.</Mentor>
            <div className={`cmt hunt${missedOnce ? ' calm' : ''}`}>
              <span className="cmt-lbl">🔎 Bir haftaga bir nechta ish tushsa — sig'ganini qanday bilamiz?</span>
              <div className="gt-rows">
                {GATE_ITEMS.map(g => (
                  <button key={g.id} type="button" className={`fchoice${miss === g.id ? ' miss' : ''}`} onClick={() => pickGate(g)}>
                    {g.ic} {g.t}
                  </button>
                ))}
              </div>
              {missedOnce && <p className="cmt-tip">🤔 Bu boshqa narsani o'lchaydi. Bir haftadagi ishlarning <b>kunlari qo'shilganda</b> nima chiqishini o'ylang.</p>}
            </div>
          </>
        ) : (
          <>
            <Mentor>Darvozadan o'tgan uch bo'lakning ichki ishlari — besh dona, kunlari o'sha sinfdoshniki. Endi ularni haftalarga kod bo'ladi.</Mentor>
            <div className="cmt-fold fade-step"><span className="cmt-done">✓ Haftaga sig'ish — haftadagi ishlar kunlari qo'shilib 5 dan oshmasa</span></div>
            <div className="split kod">
              <Col gap={10}>
                <div className={`kdpanel${done ? ' is-done' : ''}`}>
                  <p className="flow-label">Kod nima qilsin</p>
                  <ol className="kdreq">
                    <li>Funksiya haftalar ro'yxatini (massiv ichida massivlar) qaytaradi</li>
                    <li>Har haftadagi kunlar 5 dan oshmaydi</li>
                    <li>Uch hafta chiqdi va tartib saqlangan</li>
                  </ol>
                  <div className={`wsx star ${yordamOpen ? 'open' : ''}`}>
                    <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>💡 Yordam {yordamOpen ? '▾' : '▸'}</button>
                    {yordamOpen && <div className="wsx-body">
                      <p>Ikki narsani ushlab turing: hozirgi hafta ro'yxati va undagi kunlar yig'indisi. Ish sig'masa — haftani natijaga qo'shib, yangisini boshlang.</p>
                      <p>⭐ Qo'shimcha: hafta sig'imini 7 kunga oshiring (<code className="qcode">SIGIM = 7</code>) va <code className="qcode">haftalar(bolaklar).length</code> endi nima qaytarishini ko'ring.</p>
                    </div>}
                  </div>
                  {done && <div className="done-mini fade-step">✅ Uch hafta chiqdi <span className="dm-sub">— kod endi ishni haftalarga o'zi bo'ladi</span></div>}
                  {!done && isSelf && (
                    <button className="kd-skip" onClick={onNext}>✓ Bu kodni sinfda yozganman →</button>
                  )}
                </div>
                <StudentPracticePulse live={live} screen={screen} />
                <MentorPracticeStats live={live} screen={screen} label="🛠 Kodni yozib bo'lganlar" />
              </Col>
              <Col gap={10}>
                <div className="klaunch">
                  <span className="klaunch-lbl">🗓 Besh ish — bitta funksiya</span>
                  <p className="klaunch-b">Kod yoziladigan oyna: chapda kod, o'ngda natija.</p>
                  <button className={`kod-launch-btn${openHint ? ' turn-ring' : ''}`} onClick={() => { setOpen(true); writeKodingOpen(true); }}>
                    {done ? '↻ Kompilyatorni qayta ochish' : '🛠 Kompilyatorni ochish'}
                  </button>
                  {done && <span className="klaunch-sub">Bajarildi — xohlasangiz kodni yana sayqallang</span>}
                </div>
              </Col>
            </div>
          </>
        )}
        <MentorNote>Kod — darvozadagi ishning to'g'ridan-to'g'ri tarjimasi: qo'lda tanlangan bo'laklar endi massiv elementi. Shuni ochiq ayting. Kod shu oynada yoziladi — 10 daqiqa yetadi; ulgurmagan o'quvchi uyga qisqa variantni oladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.</MentorNote>
      </div>
      {/* Kod-saqlov kompilyatorning O'ZIDA (`:code`) — dars kaliti `done`/`open` uchun qoladi */}
      {/* To'liq-ekran qobiq: kompilyator `.stage-content` ichida qisilib qolsa, shart-chiplari
          (.hc-top) va «Davom etish» (.hc-bottom) ekrandan tashqarida qoladi. */}
      {/* 🔴 ZOOM IKKI MARTA TUSHMASIN (18-ov (a)): `.lesson-root` da `zoom: var(--lz)` bor,
          `.hc-root` ham o'zi `zoom: var(--lz)` qo'yadi — keng ekranda (2560×1440 · --lz 1.33)
          masshtab lz² ga chiqib, kompilyator balandligi 1920px bo'lardi va shart-chiplari
          (.hc-top) bilan «Davom etish» (.hc-bottom) ekrandan chiqib ketardi. Qobiq tashqi
          zoomni bekor qiladi — kompilyator o'z lz sida, viewport ICHIDA qoladi. */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang="uz" task={KOD_TASK} starterCode={code || KOD_STARTER} storageKey={`${KODING_KEY}:code`}
            onContinue={finishPractice} onBack={() => { setOpen(false); writeKodingOpen(false); }} />
        </div>
      )}
    </Stage>
  );
};
// ===== SCREEN 12 — RECAP: 2 qadam (ayting + yozing) =====
const REFLECT_KEY = 'pm-m4c2-reflection';
// 🔴 Korpus §97: YAKKA o'quvchida sherik YO'Q — unga «A» va «B» navbati ko'rsatilmaydi.
// Yakka tarmoq: bitta 30 soniyalik navbat, neytral matn.
function PairTimer({ onStage, muted, solo }) {
  const TOTAL = solo ? 30 : 60;
  const [st, setSt] = useState({ running: false, left: TOTAL, done: false });
  const stage = st.running ? 'running' : (st.done ? 'done' : 'idle');
  useEffect(() => { if (onStage) onStage(stage); }, [stage]); // eslint-disable-line
  const startTurn = useTurnHint(!st.running && !st.done && !muted);
  useEffect(() => {
    if (!st.running) return;
    if (st.left <= 0) { setSt({ running: false, left: TOTAL, done: true }); return; }
    const t = setTimeout(() => setSt(p => ({ ...p, left: p.left - 1 })), 1000);
    return () => clearTimeout(t);
  }, [st.running, st.left, TOTAL]);
  const isA = solo ? true : st.left > 30;
  const phaseLeft = solo ? st.left : (isA ? st.left - 30 : st.left);
  const R = 34, C = 2 * Math.PI * R, frac = phaseLeft / 30;
  return (
    <div className="pair-timer">
      {st.running ? (
        <div className="pair-live">
          <div className={`pair-ring ${isA ? 'a' : 'b'}`}>
            <svg width="82" height="82" viewBox="0 0 88 88" aria-hidden="true">
              <circle cx="44" cy="44" r={R} fill="none" stroke={T.line} strokeWidth="7" />
              <circle cx="44" cy="44" r={R} fill="none" stroke={isA ? T.accent : T.success} strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 44 44)" style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="pair-ring-mid">{!solo && <span className={`pair-ring-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span>}<span className="pair-ring-sec">{phaseLeft}s</span></div>
          </div>
          <div className="pair-live-txt">
            {solo
              ? <><span className="pair-now">Hozir ovoz chiqarib ayting</span><span className="pair-next">ekranga qaramasdan</span></>
              : <><span className="pair-now">Hozir <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span> gapiradi</span><span className="pair-next">{isA ? 'keyin — B navbati' : 'oxirgi navbat'}</span></>}
          </div>
        </div>
      ) : (
        <p className="pair-now" style={{ margin: 0 }}>{st.done
          ? (solo ? "✓ Vaqt tugadi — aytib bo'ldingiz. Barakalla!" : "✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla!")
          : (solo ? "30 soniya — ovoz chiqarib o'zingizga ayting." : "Har biringizga 30 soniyadan — avval A, keyin B.")}</p>
      )}
      <div className="pair-timer-btns">
        {!st.running && <button className={st.done ? 'btn-soft' : `pair-start${startTurn ? '' : ' calm'}`} onClick={() => setSt({ running: true, left: TOTAL, done: false })}>{st.done ? (solo ? '↻ Yana 30 soniya' : '↻ Yana 1 daqiqa') : (solo ? '▶ 30 soniyani boshlash' : '▶ 1 daqiqani boshlash')}</button>}
        {st.running && <button className="btn-soft" onClick={() => setSt({ running: false, left: TOTAL, done: false })}>⏹ To'xtatish</button>}
      </div>
    </div>
  );
}
const ScreenReflection = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  // Korpus §97: yolg'iz o'qiyotgan o'quvchida sherik YO'Q — ikki tarmoq bir shakl, bir uzunlikda.
  const yakka = !live || live.mode === 'self';
  const [text, setText] = useState(() => { try { return localStorage.getItem(REFLECT_KEY) || ''; } catch { return ''; } });
  const save = (v) => { setText(v); try { localStorage.setItem(REFLECT_KEY, v); } catch {} };
  const written = text.trim().length >= 8;
  const [pairStage, setPairStage] = useState('idle');
  const [reflFocus, setReflFocus] = useState(false);
  const inputTurn = useTurnHint(pairStage === 'done' && !written && !reflFocus);
  return (
    <Stage eyebrow="Mustahkamlash · 2 qadam" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={!written} label="Davom etish" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Uch bo'lagingizni <span className="italic" style={{ color: T.accent }}>yoddan</span> ayta olasizmi?</h2></div>
        <Mentor>Ekranga qaramasdan javob bering: birinchi haftada odam nimani bosadi va nima bo'ladi? Avval {yakka ? "ovoz chiqarib o'zingizga" : 'sherigingizga'} ayting, so'ng shu javobni bir qatorda yozing.</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">🗣 {yakka ? 'Ovoz chiqarib ayting: 1-haftada odam nimani bosadi va nima bo\'ladi' : 'Sherigingizga ayting: 1-haftada odam nimani bosadi va nima bo\'ladi'}</span></div></div>
            <PairTimer onStage={setPairStage} muted={written} solo={yakka} />
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">✍️ Endi bir qator yozing</span></div></div>
            <span className={`turn-wrap${inputTurn ? ' turn-ring' : ''}`}>
              <input className="reflect-input" value={text} onChange={e => save(e.target.value)} onFocus={() => setReflFocus(true)} onBlur={() => setReflFocus(false)} placeholder="1-haftada odam ... bosadi va ... bo'ladi" maxLength={160} />
            </span>
            {written && (
              <div className="rcp-win fade-step">
                <span className="rcp-win-t">✓ Endi siz katta ishni haftalik bo'lakka bo'la olasiz.</span>
                <span className="rcp-win-s">🎯 Bugungi qoida: kim tez-tez chiqarsa, o'sha oldin biladi.</span>
              </div>
            )}
          </div>
        </div>
        <MentorNote>Uchdan biri «nima bo'ladi» savoliga javob berolmasa — darvoza ekranini qayta oching va «faqat tugma» nomzodini birga ko'ring.</MentorNote>
      </div>
    </Stage>
  );
};
const fcTier = (s) => (s.length <= 8 ? 't1' : s.length <= 16 ? 't2' : s.length <= 32 ? 't3' : 't4');
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
    setExiting(removed ? 'knew' : 'again');
    setTimeout(() => {
      setExiting(null); setFlipped(false); swapRef.current++;
      if (removed) setKnown(k => k + 1);
      setQueue(q => { const [first, ...rest] = q; return removed ? rest : [...rest, first]; });
    }, 420);
  };
  const restart = () => { setQueue(cards.map((_, i) => i)); setKnown(0); setFlipped(false); };
  if (!card) return (
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">Hammasini bilasiz!</p><p className="fc-done-s">{total}/{total} karta yodlandi</p><button className="fc-btn ghost" onClick={restart}>↻ Qaytadan takrorlash</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ O'rganilmoqda · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ Bildim · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
          <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
            <div className="fc-face fc-front"><span className="fc-q">{card.front}</span><span className="fc-cue">Javobni o'ylang 🤔 <span className="fc-tap">bosing</span></span></div>
            <div className="fc-face fc-back"><span className={`fc-tag ${fcTier(card.back)}`}>{card.back}</span></div>
          </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={() => advance(false)}>✗ Takrorlash</button><button className="fc-btn knew" disabled={!!exiting} onClick={() => advance(true)}>✓ Bildim</button></div>)
        : (<p className="fc-hint">👆 Kartani bosing — javobni ko'rasiz</p>)}
    </div>
  );
}
const FLASHCARDS = [
  { front: 'Reliz nima?', back: "Tayyor bo'lakni odamlar ishlatadigan joyga chiqarish" },
  { front: "Kod faqat o'z kompyuteringizda ishlasa — bu relizmi?", back: "Yo'q — odamlar hali ishlata olmaydi" },
  { front: 'Kim odamlarga nima kerakligini oldin biladi?', back: "Kim tez-tez chiqarsa, o'sha oldin biladi" },
  { front: 'Har hafta chiqarganda nima yutasiz?', back: 'Har hafta odamlardan bir narsa bilib olasiz' },
  { front: "Haftalik bo'lakning birinchi sharti?", back: "Haftaga sig'adi" },
  { front: "Haftalik bo'lakning ikkinchi sharti?", back: 'Odam uni ishlata oladi — bossa, nimadir bo\'ladi' },
  { front: "Katta ish haftaga sig'masa nima qilasiz?", back: 'Odam birinchi bosadigan bo\'lagini ajratasiz' },
  { front: 'Telegram katta yangilanishni qanchalik tez-tez chiqaradi?', back: 'Deyarli har oy' },
  { front: '2025-yil martida Telegramdan oyiga nechta odam foydalanadi?', back: '1 milliard' },
  { front: 'Nimani qachon chiqarishni kim hal qiladi?', back: "Mahsulotni o'ylaydigan odam" },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow="Takrorlash" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label="Davom etish" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        {/* 99a: flashcard ekranida mentor YO'Q — sarlavha platforma etaloni */}
        <div className="head"><h2 className="title h-title fade-up">O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</h2></div>
        <div className="fc-center"><Flashcards cards={FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

const ScreenFinalTest = (props) => (
  <QuestionScreen {...props} eyebrow="Yakuniy tekshiruv" scope="final"
    ctaLabel="Javobni tanlang" revealPrefix="To'g'ri javob"
    question={<TestQ ask="📅 Loyihangizda uch haftalik katta ish bor. Uni qanday chiqarasiz?" />}
    questionText="Uch haftalik katta ishni qanday chiqarasiz"
    options={['Uch hafta yasab, odamlarga hammasini birdan', "Har hafta odam ishlata oladigan bo'lakni", "Birinchi haftada eng katta bo'lakni chiqarib"]}
    correctIdx={1}
    explainCorrect="To'g'ri — har hafta odam ishlata oladigan bo'lak chiqadi; siz uch marta bilib olasiz, bir marta emas."
    explainWrong={{
      0: "Uch hafta kutsangiz, odamlar nima qilishini faqat oxirida ko'rasiz.",
      2: "Eng katta bo'lak haftaga sig'maydi — darvozaning birinchi chirog'i uni o'tkazmaydi.",
      default: "Har hafta odam ishlata oladigan bitta bo'lak chiqadi."
    }}
  />
);
// ===== UYGA VAZIFA — alohida ekran EMAS, YAKUN sahifasi ichida (etalon: P0 · PmLesson2 · M4-D2) =====
const HW_KEY = 'pm-m4c2-hw-target';
const HW_VARIANT = [
  { k: 'toliq', t: "To'liq · ~20 daqiqa" },
  { k: 'qisqa', t: 'Qisqa · ~10 daqiqa' },
];
const HW_STEPS = {
  toliq: ["To'rtinchi haftaga bitta bo'lak yozing", "Har bo'lakka savol bering: odam buni bosganda nima bo'ladi?", 'Javobini bir gapda yozib qo\'ying'],
  qisqa: ["Bo'laklaringizdan birinchisini oling", 'Savol bering: odam uni bosganda nima bo\'ladi?', 'Javobini bir gapda yozing'],
};
const readHwTarget = () => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } };
// Uy-vazifa kapsulasi fonidagi xira so'z-tokenlar — darsning O'Z lug'ati (§114)
const HW_TOKENS = [
  { t: 'reliz',   l: 5,  tp: 16, s: 12, d: 6.5 },
  { t: "bo'lak",  l: 80, tp: 12, s: 11, d: 7.5 },
  { t: 'hafta',   l: 12, tp: 70, s: 11, d: 8 },
  { t: 'poyga',   l: 64, tp: 76, s: 12, d: 6 },
  { t: 'chiroq',  l: 86, tp: 52, s: 10, d: 9 },
  { t: '✅',       l: 36, tp: 8,  s: 12, d: 7 },
  { t: 'chiqadi', l: 3,  tp: 44, s: 12, d: 8.5 },
];
const HwCard = ({ variant, onPick, innerRef }) => {
  const steps = HW_STEPS[variant] || HW_STEPS.toliq;
  const pickTurn = useTurnHint(!variant && !!onPick);
  return (
    <div className="card fade-step" ref={innerRef}>
      <div className="card-lbl" style={{ color: T.accent }}>📝 Uyda nima qilasiz?</div>
      {(
        <>
          <p className="body" style={{ margin: '0 0 10px', color: T.ink }}>Uyda rejangizni davom ettirasiz: bo'laklaringizdan har biriga bitta savol berasiz — odam buni bosganda nima bo'ladi? Javobini bir gapda yozib qo'yasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.</p>
          <div className="hw-chips">
            {HW_VARIANT.map((v, vi) => (
              <button key={v.k} className={`hw-chip ${variant === v.k ? 'on' : ''}${waveCls(pickTurn, vi, HW_VARIANT.length)}`} onClick={() => onPick(v.k)}>{v.t}</button>
            ))}
          </div>
        </>
      )}
      {variant ? (
        <div className="pmtask fade-step">
          <div className="pmtask-head"><span className="pmtask-tag">🗂 Topshiriq kartasi</span><span className="pmtask-id">{variant === 'qisqa' ? 'QISQA' : "TO'LIQ"}</span></div>
          <div className="pmtask-rows">
            <div className="pmtask-row"><span className="pmtask-k">Nechta</span><span className="pmtask-v"><b>{variant === 'qisqa' ? "bitta bo'lak + javobi" : "to'rtinchi bo'lak + har biriga javob"}</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">Muddat</span><span className="pmtask-v"><b>keyingi darsgacha</b></span></div>
          </div>
          <div className="pmtask-steps">
            {steps.map((s, i) => <span key={i} className="pmtask-step"><i>{i + 1}</i>{s}</span>)}
          </div>
        </div>
      ) : (
        <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>👆 Avval variantni tanlang — topshiriq-karta shunga moslashadi.</p></div>
      )}
    </div>
  );
};
// ===== 🏅 NISHONLAR — 4 ta, faqat REAL tekshiriladigan harakatga =====
const ACHIEVEMENTS = {
  paceSetter:  { icon: '🏁', name: 'Pace Setter!',  desc: "Poygani oxirigacha o'tkazdingiz" },
  fastShipper: { icon: '🚀', name: 'Fast Shipper!', desc: 'Uch haftalik rejangizni yozdingiz' },
  gateKeeper:  { icon: '🚪', name: 'Gate Keeper!',  desc: "Uch bo'lakni haftaga sig'dirdingiz" },
  weekPlanner: { icon: '🛠', name: 'Week Planner!', desc: "Ishni haftalarga kod bilan bo'lib chiqdingiz" },
};
const ACH_TRIGGERS = { s4: 'paceSetter', s8: 'fastShipper', s9: 'gateKeeper', s10: 'weekPlanner' };
function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={`Yangi nishon: ${ach.name}`}>
      <div className="acu-rays" aria-hidden="true" />
      <div className="acu-glow" aria-hidden="true" />
      <div className="acu-ring" aria-hidden="true" />
      <div className="acu-ring d2" aria-hidden="true" />
      <div className="acu-stage">
        <div className="acu-medal-wrap">
          <div className="acu-medal">{ach.icon}<span className="acu-shine" /></div>
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="acu-spark" style={{ '--a': `${i * (360 / 14)}deg`, animationDelay: `${0.18 + (i % 5) * 0.05}s` }}>✦</span>
          ))}
        </div>
        <div className="acu-txt">
          <span className="acu-name">{ach.name}</span>
          {ach.desc && <span className="acu-desc">{ach.desc}</span>}
        </div>
        <span className="acu-tap">bosib davom eting</span>
      </div>
    </div>
  );
}
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}

const Confetti = () => {
  const COLORS = [T.accent, T.success, T.blue, '#FFD380', '#FF7755', '#7DD181'];
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 44 }).map((_, i) => {
        const left = (i * 2.31 + (i % 7) * 4) % 100;
        const size = 6 + (i % 4) * 2;
        return (
          <span key={i} className="confetti-bit" style={{
            left: `${left}%`, background: COLORS[i % COLORS.length],
            width: size, height: size * 1.5,
            animationDelay: `${(i % 11) * 0.16}s`,
            animationDuration: `${2.4 + (i % 6) * 0.45}s`,
            borderRadius: i % 2 ? '2px' : '50%'
          }} />
        );
      })}
    </div>
  );
};

// Podium savol yorliqlari (scored indekslar 3/5/7/11)
const Q_LABELS = { 3: '1 — Reliz bo\'ldimi', 5: '2 — Eng erta qachon', 7: '3 — Boshqa ilovalarda', 11: '4 — Yakuniy savol' };
const QUIZ_MS = 15000;
const QZ_BG_SHAPES = [
  { ch: 'reliz',   l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: "bo'lak",  l: 85, t: 8,  s: 28, d: 23, dl: 1.5 },
  { ch: 'hafta',   l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'poyga',   l: 74, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: 'chiroq',  l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: 'chiqadi', l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: 'odam',    l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: 'reja',    l: 55, t: 5,  s: 20, d: 22, dl: 0.6 },
  { ch: '✅',       l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '🔒',       l: 16, t: 52, s: 28, d: 26, dl: 2.6 },
  { ch: '🏁',       l: 2,  t: 30, s: 30, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike — 12 savol · 3/3/3/3 · naqshsiz. darslik-jonli TASDIQLAYDI.
const QUIZ_BANK = [
  { q: 'Reliz nima?', opts: ["Tayyor bo'lakni odamlar ishlatadigan joyga chiqarish", "Kodni o'z kompyuterida ishga tushirib tekshirib ko'rish", 'Saytga yangi rasm va rang tanlash', "Ishni haftalarga bo'lib rejalashtirish"], correct: 0 },
  { q: "Kod faqat o'z kompyuteringizda ishlasa — bu relizmi?", opts: ['Ha — kod ishlayotgani yetadi', "Yo'q — bu o'zgarish juda kichkina", 'Ha — sinfdosh uni ko\'rgan', "Yo'q — odamlar ishlata olmaydi"], correct: 3 },
  { q: 'Ikki sinfdosh bir vaqtda boshladi. 6-haftada kim keyingi bo\'lakni aniq biladi?', opts: ["Kod ko'proq yozgani", "Rejasini eng uzoq o'ylab chiqqani", 'Har hafta chiqarib turgani', 'Saytni kech ochgani'], correct: 2 },
  { q: "«Har hafta kichik» sayti 6 haftada necha marta bilib oldi?", opts: ['3 marta', '6 marta', 'Hech marta', '1 marta'], correct: 1 },
  { q: "«Bir marta katta» sayti 6-haftada nimani kech bildi?", opts: ['Odamlar saytni topa olmaganini', "Xarita va reytingni ochmaganlarini", 'Chat oynasi ishlamay qolganini', "E'lonlar ro'yxati umuman ochilmasligini"], correct: 1 },
  { q: "Haftalik bo'lak qaysi ikki chiroqdan o'tadi?", opts: ["Haftaga sig'adi · odam ishlata oladi", 'Bir kunda tayyor · bepul chiqadi', 'Tez yoziladi · kam kod talab qiladi', "Rasmli bo'ladi · chiroyli ko'rinib turadi"], correct: 0 },
  { q: "«Bosilsa hali hech narsa bo'lmaydi» bo'lagiga nima yetishmaydi?", opts: ['Uni bosadigan odam', "Unga qo'yiladigan rasm", 'Bosgandan keyingi ish', "Haftaga sig'adigan vaqt"], correct: 2 },
  { q: '≈11 kunlik bo\'lakka darvoza nima deydi?', opts: ['Kunlar hisoblanmagan', 'Odam uni ishlata olmaydi', 'Bu bo\'lak takrorlangan', "Bu hafta sig'maydi"], correct: 3 },
  { q: 'Telegram katta yangilanishni qanchalik tez-tez chiqaradi?', opts: ['Deyarli har oy', 'Uch yilda bir marta', 'Yiliga bir marta', 'Ikki haftada bir'], correct: 0 },
  { q: 'Reaksiya, stiker, kanal boshqa yozishuv ilovalarida qachon paydo bo\'ldi?', opts: ['Bir necha hafta ichida', "O'sha kuniyoq, birga", "Bir necha yil o'tgach", 'Telegramdan oldinroq'], correct: 2 },
  { q: '2025-yil martida Telegramdan oyiga nechta odam foydalanadi?', opts: ['100 million', '1 milliard', '3 milliard', '500 million'], correct: 1 },
  { q: 'Nimani qachon chiqarishni kim hal qiladi?', opts: ['Kodni yozgan dasturchi', 'Saytga kirgan odam', 'Saytni joylashtirgan xizmat egasi', "Mahsulotni o'ylaydigan odam"], correct: 3 },
];
const CsNeonBolt = ({ flip }) => (
  <span className={`csn-boltwrap ${flip ? 'flip' : ''}`} aria-hidden="true">
    <svg className="csn-bolt" viewBox="0 0 60 100">
      <defs><linearGradient id="csnb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#B08CFF" /></linearGradient></defs>
      <path d="M38 4 L10 52 L27 52 L20 96 L52 40 L33 40 Z" fill="url(#csnb)" stroke="rgba(255,255,255,.65)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
    <i className="cs-spark s1" /><i className="cs-spark s2" /><i className="cs-spark s3" />
  </span>
);
const CsWordmark = ({ onClick, disabled, hint, stats = true, bolt = true, liveOn = false }) => {
  const clickable = !!onClick && !disabled;
  const [charge, setCharge] = useState(false);
  const fire = () => {
    if (!clickable || charge) return;
    setCharge(true);
    setTimeout(onClick, 430);
    setTimeout(() => setCharge(false), 900);
  };
  return (
    <div
      className={`cs-cap ${clickable ? 'cs-clickable' : ''} ${disabled ? 'cs-off' : ''} ${liveOn ? 'cs-live' : ''} ${charge ? 'cs-charging' : ''}`}
      {...(clickable ? { role: 'button', tabIndex: 0, onClick: fire, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } } } : {})}
    >
      <span className="cs-ring" aria-hidden="true" />
      <div className="cs-sky" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => (
          <span key={i} className={`cs-tok ${i % 2 ? 'back' : 'front'}`} style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: `clamp(9px, ${Math.round(s.s * 0.4)}px, ${Math.round(s.s * 0.6)}px)`, '--d': `${s.d}s`, animationDelay: `-${s.dl * 3}s` }}>{s.ch}</span>
        ))}
        {[[14, 30, 24], [38, 66, 15], [57, 20, 27], [76, 60, 18], [88, 36, 13]].map(([l, t, w], i) => (
          <i key={i} className="cs-dash" style={{ left: `${l}%`, top: `${t}%`, width: w, animationDelay: `-${i * 1.7}s` }} />
        ))}
        <span className="cs-thunder" />
      </div>
      <div className="cs-row">
        {bolt && <CsNeonBolt />}
        <div className="cs-word" data-text="CODE STRIKE" aria-label="CodeStrike">CODE STRIKE</div>
        {bolt && <CsNeonBolt flip />}
      </div>
      {stats && (
        <div className="cs-hud">
          <span className="cs-hud-i"><b>{QUIZ_BANK.length}</b> SAVOL</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i"><b>{QUIZ_MS / 1000}</b> SONIYA</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i">🏆 PODIUM</span>
        </div>
      )}
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>
  );
};

// ===== ⚔️ CODESTRIKE ARENA — signal zonasi: 100+ =====
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C'];
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
const quizPts = (elapsedMs) => elapsedMs <= 500 ? 1000 : Math.max(0, Math.round(1000 * (1 - (Math.min(elapsedMs, QUIZ_MS) / QUIZ_MS) / 2)));
const quizScore = (rows) => {
  const byQ = {};
  rows.forEach(r => { byQ[r.screen_idx - QUIZ_BASE_IDX] = r; });
  let pts = 0, streak = 0, maxStreak = 0, ok = 0;
  for (let i = 0; i < QUIZ_BANK.length; i++) {
    const a = byQ[i];
    if (a && a.correct) { streak++; maxStreak = Math.max(maxStreak, streak); ok++; pts += quizPts(a.elapsed_ms) + (streak >= 2 ? 100 : 0); }
    else streak = 0;
  }
  return { pts, ok, maxStreak };
};

function QzTimer({ remaining }) {
  const R = 26, C = 2 * Math.PI * R;
  const frac = Math.max(0, Math.min(1, remaining / QUIZ_MS));
  const sec = Math.ceil(remaining / 1000);
  const col = remaining > 10000 ? '#2BD97C' : remaining > 5000 ? '#FFC94D' : '#FF5A5A';
  return (
    <div className={`qz-timer ${remaining <= 5000 && remaining > 0 ? 'urgent' : ''}`}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6" />
        <circle cx="32" cy="32" r={R} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 32 32)" style={{ transition: 'stroke-dashoffset 0.12s linear, stroke 0.4s' }} />
      </svg>
      <span className="qz-timer-n" style={{ color: col }}>{sec}</span>
    </div>
  );
}

function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['reliz', "bo'lak", 'hafta', 'poyga', 'chiroq', 'chiqadi', 'odam', 'reja', '✅', '🔒'];
    const em = [], toks = [];
    for (let i = 0; i < 26; i++) em.push({ x: Math.random() * W, y: Math.random() * H, z: .3 + Math.random() * .7, ph: Math.random() * 6.28, sw: .3 + Math.random() * .6 });
    for (let i = 0; i < 9; i++) toks.push({ x: Math.random() * W, y: Math.random() * H, z: .4 + Math.random() * .9, vx: (Math.random() - .5) * .16, t: TOK[i % TOK.length], r: (Math.random() - .5) * .5 });
    const draw = (tm) => {
      ctx.clearRect(0, 0, W, H);
      for (const p of em) { p.y -= (.15 + p.z * .35) * DPR; p.x += Math.sin(tm / 1400 + p.ph) * p.sw * DPR * .35; if (p.y < -12) { p.y = H + 12; p.x = Math.random() * W; } }
      ctx.lineWidth = 1 * DPR;
      for (let a = 0; a < em.length; a++) for (let b = a + 1; b < em.length; b++) { const dx = em[a].x - em[b].x, dy = em[a].y - em[b].y, d = Math.sqrt(dx * dx + dy * dy), mx = 95 * DPR; if (d < mx) { ctx.strokeStyle = 'rgba(150,95,255,' + (.11 * (1 - d / mx)) + ')'; ctx.beginPath(); ctx.moveTo(em[a].x, em[a].y); ctx.lineTo(em[b].x, em[b].y); ctx.stroke(); } }
      for (const p of em) { const s = (1.3 + p.z * 2.2) * DPR, tw = .22 + p.z * .3 + Math.sin(tm / 600 + p.ph) * .1; ctx.fillStyle = 'rgba(205,175,255,' + tw + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, 6.29); ctx.fill(); }
      for (const t of toks) { t.x += t.vx * DPR; t.y -= (.08 + t.z * .12) * DPR; if (t.y < -34) t.y = H + 34; if (t.x < -50) t.x = W + 50; if (t.x > W + 50) t.x = -50; ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.r * .12); ctx.font = '700 ' + ((13 + t.z * 22) * DPR) + 'px "JetBrains Mono",monospace'; ctx.fillStyle = 'rgba(190,150,255,' + (.05 + t.z * .07) + ')'; ctx.textAlign = 'center'; ctx.fillText(t.t, 0, 0); ctx.restore(); }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} className="qz-fx" aria-hidden="true" />;
}

function QuizArena({ live, onClose, startSolo }) {
  const isMentor = live.mode === 'mentor';
  const isStudent = live.mode === 'student';
  const [soloMode, setSoloMode] = useState(!!startSolo);
  const solo = soloMode || (!isMentor && !isStudent);
  const soloRef = useRef(solo);
  soloRef.current = solo;
  const [phase, setPhase] = useState('lobby');
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
    liveQuizAnswers(live.pin).then(rows => {
      const mine = {};
      rows.filter(r => r.player_id === live.playerId).forEach(r => { mine[r.screen_idx - QUIZ_BASE_IDX] = { picked: r.picked, correct: r.correct, elapsed: r.elapsed_ms }; });
      setMyAnswers(m => ({ ...mine, ...m }));
    }).catch(() => {});
  }, []); // eslint-disable-line

  useEffect(() => {
    if (soloRef.current) return;
    let on = true, t = null;
    const tick = async () => {
      if (soloRef.current) return;
      try {
        const row = await liveGet(live.pin);
        if (!on) return;
        if (row) {
          const st = row.quiz_state || 'off', q = row.quiz_q ?? -1;
          if (st === 'q' && q !== seenQRef.current) {
            seenQRef.current = q; qStartRef.current = Date.now();
            deadlineRef.current = Date.now() + QUIZ_MS - (isMentor ? 0 : 700);
            setQi(q); setRemaining(deadlineRef.current - Date.now()); setPhase('q'); setAnsweredN(0);
          } else if (st === 'r') {
            if (q !== seenQRef.current) { seenQRef.current = q; setQi(q); }
            setPhase(p => p === 'done' ? p : 'reveal');
          }
          else if (st === 'done') { setPhase('done'); }
        }
        const st1 = row ? (row.quiz_state || 'off') : null;
        const ph = st1 === 'r' ? 'reveal' : st1 === 'done' ? 'done' : st1 === 'lobby' ? 'lobby' : st1 === 'q' ? 'q' : phaseRef.current;
        if (on) setClassEnded(!row || row.status === 'ended');
        if (ph === 'lobby' || ph === 'reveal' || ph === 'done' || phaseRef.current === 'reveal') {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]);
          if (on) { setPlayers(pl); setQRows(qa); }
        } else if (ph === 'q' && isMentor) {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, QUIZ_BASE_IDX + seenQRef.current)]);
          if (on) { setPlayers(pl); setAnsweredN(qa.length); }
        }
      } catch {}
      if (on) t = setTimeout(tick, 1200);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (phase !== 'q') return;
    const iv = setInterval(() => {
      const rem = deadlineRef.current - Date.now();
      setRemaining(rem > 0 ? rem : 0);
      if (rem <= 0) {
        clearInterval(iv);
        setPhase('reveal');
        if (isMentor && !soloRef.current) ctrl('r', seenQRef.current);
      }
    }, 100);
    return () => clearInterval(iv);
  }, [phase, qi]); // eslint-disable-line

  const ctrl = async (state, q) => {
    try {
      await live.quizControl(state, q);
      if (state === 'q') { seenQRef.current = q; qStartRef.current = Date.now(); deadlineRef.current = Date.now() + QUIZ_MS; setQi(q); setRemaining(QUIZ_MS); setPhase('q'); setAnsweredN(0); }
      else if (state === 'r' || state === 'done') {
        setPhase(state === 'r' ? 'reveal' : 'done');
        Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]).then(([pl, qa]) => { setPlayers(pl); setQRows(qa); }).catch(() => {});
      }
    } catch {}
  };
  const soloStart = (i) => { seenQRef.current = i; qStartRef.current = Date.now(); deadlineRef.current = Date.now() + QUIZ_MS; setQi(i); setRemaining(QUIZ_MS); setPhase('q'); };
  const soloNext = () => { const n = qi + 1; if (n >= QUIZ_BANK.length) setPhase('done'); else soloStart(n); };
  const soloReplay = () => { setMyAnswers({}); soloStart(0); };
  const startPractice = () => { setSoloMode(true); setMyAnswers({}); soloStart(0); };

  const answer = (i) => {
    if (phase !== 'q' || isMentor || myAnswers[qi]) return;
    const elapsed = Math.min(QUIZ_MS, Date.now() - qStartRef.current);
    const correct = i === QUIZ_BANK[qi].correct;
    setMyAnswers(m => ({ ...m, [qi]: { picked: i, correct, elapsed } }));
    if (isStudent && !solo) live.submitAnswer(QUIZ_BASE_IDX + qi, `quiz-${qi}`, i, correct, elapsed);
    if (solo) setPhase('reveal');
  };

  const streakUpTo = (k) => { let s = 0; for (let i = 0; i <= k; i++) { if (myAnswers[i]?.correct) s++; else s = 0; } return s; };
  const myPtsFor = (k) => { const a = myAnswers[k]; if (!a || !a.correct) return 0; return quizPts(a.elapsed) + (streakUpTo(k) >= 2 ? 100 : 0); };

  const board = players.map(p => { const s = quizScore(qRows.filter(r => r.player_id === p.id)); return { id: p.id, nickname: p.nickname, ...s }; }).sort((a, b) => b.pts - a.pts || b.ok - a.ok);
  const myRank = live.playerId ? board.findIndex(b => b.id === live.playerId) : -1;
  const soloRows = Object.entries(myAnswers).map(([k, v]) => ({ player_id: 'me', screen_idx: QUIZ_BASE_IDX + Number(k), correct: v.correct, elapsed_ms: v.elapsed }));
  const soloScore = quizScore(soloRows);

  const Q = qi >= 0 && qi < QUIZ_BANK.length ? QUIZ_BANK[qi] : null;
  const counts = Q ? Q.opts.map((_, i) => {
    if (solo) return myAnswers[qi]?.picked === i ? 1 : 0;
    let n = qRows.filter(r => r.screen_idx === QUIZ_BASE_IDX + qi && r.picked === i).length;
    const mine = myAnswers[qi];
    if (mine && mine.picked === i && live.playerId && !qRows.some(r => r.player_id === live.playerId && r.screen_idx === QUIZ_BASE_IDX + qi)) n++;
    return n;
  }) : [];
  const lastQ = qi >= QUIZ_BANK.length - 1;
  const my = qi >= 0 ? myAnswers[qi] : null;

  const closeArena = () => {
    if (isMentor && !solo && phase !== 'done') {
      if (typeof window !== 'undefined' && !window.confirm("Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?")) return;
    }
    onClose();
  };

  return (
    <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => (
          <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>
        ))}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label="Yopish">✕</button>

      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:</span>
          <button className="qz-btn" onClick={startPractice}>📖 Mashq rejimida davom etish</button>
        </div>
      )}

      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">O'quvchilar kutilmoqda…</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>▶ Testni boshlash</button>}
          {isStudent && !solo && <p className="qz-waitmsg">⏳ Mentor testni boshlashini kuting…</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>▶ Boshlash</button>}
        </div>
      )}

      {phase === 'q' && Q && (
        <div className="qz-view qz-qview fade-step" key={`q${qi}`}>
          <div className="qz-top">
            <span className="qz-count">Savol <b>{qi + 1}</b>/{QUIZ_BANK.length}</span>
            <QzTimer remaining={remaining} />
            {isMentor
              ? <span className="qz-ansn">📨 {answeredN}/{players.length}</span>
              : <span className="qz-ansn">{streakUpTo(qi - 1) >= 2 ? `🔥 x${streakUpTo(qi - 1)}` : ' '}</span>}
          </div>
          <h2 className="qz-q">{fmtCode(Q.q)}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
              const pickedThis = my && my.picked === i;
              return (
                <button key={i} className={`qz-tile ${my ? (pickedThis ? 'picked' : 'faded') : ''}`} style={{ background: QUIZ_COLORS[i] }} disabled={isMentor || !!my} onClick={() => answer(i)}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(o)}</span>
                  {pickedThis && <span className="qz-pbadge">✔</span>}
                </button>
              );
            })}
          </div>
          {my && !isMentor && !solo && <p className="qz-waitmsg">✔ Javob qabul qilindi — natijani kuting…</p>}
          {isMentor && (
            <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">✓ Hamma javob berdi!</span>}
              <button className="qz-btn" onClick={() => ctrl('r', qi)}>⏹ Natijani ochish</button>
            </div>
          )}
        </div>
      )}

      {phase === 'reveal' && Q && (
        <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">Savol <b>{qi + 1}</b>/{QUIZ_BANK.length} — natija</span>
          </div>
          <h2 className="qz-q">{fmtCode(Q.q)}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
              const win = i === Q.correct;
              const pickedThis = my && my.picked === i;
              return (
                <div key={i} className={`qz-tile rv ${win ? 'win' : 'lose'} ${pickedThis ? 'picked' : ''}`} style={{ background: QUIZ_COLORS[i] }}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(o)}</span>
                  <span className="qz-cnt">{win ? '✓ ' : ''}{counts[i]}</span>
                </div>
              );
            })}
          </div>
          {!isMentor && (
            <div className={`qz-res ${my?.correct ? 'good' : 'bad'}`}>
              {my?.correct
                ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">ball{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} ketma-ket` : ''}</span></>
                : <span className="qz-res-t">{my ? "Adashdingiz — 0 ball. Keyingisida olasiz." : "Vaqt tugadi — 0 ball. Tezroq bo'ling."}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">Siz hozir: {myRank + 1}-o'rin</span>}
            </div>
          )}
          {!solo && (
            <div className="qz-board">
              <div className="qz-board-h">🏆 TOP-5</div>
              {board.slice(0, 5).map((b, i) => (
                <div key={b.id} className={`qz-brow ${b.id === live.playerId ? 'me' : ''}`}>
                  <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                  {b.maxStreak >= 2 && <span className="qz-bstreak">🔥</span>}
                  <span className="qz-bpts">{b.pts}</span>
                </div>
              ))}
            </div>
          )}
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl('done', qi) : ctrl('q', qi + 1)}>{lastQ ? "🏁 G'oliblarni e'lon qilish" : 'Keyingi savol →'}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? '🏁 Natijani ko\'rish' : 'Keyingi →'}</button>}
        </div>
      )}

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">🏆 Test yakunlandi!</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">ball · {soloScore.ok}/{QUIZ_BANK.length} to'g'ri{soloScore.maxStreak >= 2 ? ` · ketma-ket to'g'ri 🔥x${soloScore.maxStreak}` : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ Qayta yechish</button>
            </div>
          ) : (
            <>
              <div className="qz-pod">
                {[1, 0, 2].map(rank => {
                  const b = board[rank];
                  return (
                    <div key={rank} className={`qz-pod-col p${rank + 1} ${b && b.id === live.playerId ? 'me' : ''}`}>
                      {rank === 0 && <span className="qz-crown">👑</span>}
                      <span className="qz-pod-medal">{['🥇', '🥈', '🥉'][rank]}</span>
                      <span className="qz-pod-name">{b ? b.nickname : '—'}</span>
                      {b && <span className="qz-pod-pts">{b.pts} ball · {b.ok}/{QUIZ_BANK.length}</span>}
                      <div className="qz-pod-bar" />
                    </div>
                  );
                })}
              </div>
              {myRank >= 0 && <p className="qz-mypl">Siz — <b>{myRank + 1}-o'rin</b> · {board[myRank].pts} ball</p>}
              <div className="qz-board wide">
                {board.map((b, i) => (
                  <div key={b.id} className={`qz-brow ${b.id === live.playerId ? 'me' : ''}`}>
                    <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                    {b.maxStreak >= 2 && <span className="qz-bstreak">🔥x{b.maxStreak}</span>}
                    <span className="qz-bok">{b.ok}/{QUIZ_BANK.length}</span>
                    <span className="qz-bpts">{b.pts}</span>
                  </div>
                ))}
              </div>
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ Testni qayta yechish — mashq (jadvalga yozilmaydi)</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>Arenani yopish</button>
        </div>
      )}
    </div>
  );
}

// ===== 🏆 PODIUM (93-qonun: matn etalondan) =====
const ScreenPodium = ({ screen, answers, achievements, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const isMentorL = !!(live && live.mode === 'mentor');
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
        if (on) { setPlayers(p); setRows(a); setLoaded(true); }
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isLive, livePin]);

  const totalQ = SCORED_IDX.length;
  const board = players.map(p => {
    const mine = rows.filter(a => a.player_id === p.id && SCORED_IDX.includes(a.screen_idx));
    const okCount = mine.filter(a => a.correct).length;
    const time = mine.reduce((s, a) => s + (a.elapsed_ms || 0), 0);
    return { id: p.id, nickname: p.nickname, okCount, time };
  }).sort((x, y) => y.okCount - x.okCount || x.time - y.time);
  const fmtT = (ms) => `${(ms / 1000).toFixed(1)}s`;
  const top3 = board.slice(0, 3);
  const myIdx = live && live.playerId ? board.findIndex(b => b.id === live.playerId) : -1;
  const selfCorrect = SCORED_IDX.filter(i => answers[i]?.correct).length;

  return (
    <Stage eyebrow="Natijalar" screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label="Davom etish" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{isLive ? <>Bugungi <span className="italic" style={{ color: T.accent }}>g'oliblarimiz</span></> : <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="pod-solo">
              <div className="pod-solo-sec">
                <span className="pod-solo-lbl">🏅 Nishonlar</span>
                <div className="pod-solo-badges">
                  {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return <span key={id} className={`pod-solo-b ${got ? 'got' : ''}`} title={a.name}>{got ? a.icon : '🔒'}</span>; })}
                </div>
              </div>
            </div>
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruh reytingi va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi.</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>Natijalar kelmoqda…</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>Bu sessiyaga hali hech kim qo'shilmagan.</p></div>
        ) : (
          <>
            <Confetti />
            <div className="pod-stage fade-up">
              {[1, 0, 2].map(rank => {
                const b = top3[rank];
                return (
                  <div key={rank} className={`pod-col pod-${rank + 1} ${b && live.playerId === b.id ? 'me' : ''}`}>
                    <span className="pod-medal">{['🥇', '🥈', '🥉'][rank]}</span>
                    <span className="pod-name">{b ? b.nickname : '—'}</span>
                    {b && <span className="pod-score mono">{b.okCount}/{totalQ} · {fmtT(b.time)}</span>}
                    <div className="pod-bar" />
                  </div>
                );
              })}
            </div>
            {myIdx >= 0 && <p className="pod-my fade-up">Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>🏆 To'liq reyting</div>
              <div className="pod-list">
                {board.map((b, i) => (
                  <div key={b.id} className={`pod-row ${live.playerId === b.id ? 'me' : ''}`}>
                    <span className="mono pod-rank">{i + 1}</span>
                    <span className="pod-row-name">{b.nickname}</span>
                    <span className="pod-row-dots">{SCORED_IDX.map(q => { const a = rows.find(r => r.player_id === b.id && r.screen_idx === q); return <span key={q} className={`pod-dot ${a ? (a.correct ? 'ok' : 'bad') : ''}`} title={Q_LABELS[q]} />; })}</span>
                    <span className="mono pod-row-score">{b.okCount}/{totalQ}</span>
                    <span className="mono pod-row-time">{fmtT(b.time)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {isMentorL && <MentorNote>G'oliblarni nomlab tabriklang — arena yakun sahifasida ochiladi.</MentorNote>}
      </div>
    </Stage>
  );
};
// ===== SCREEN 15 — YAKUN: CodeStrike arenasi + uy-vazifa BIR sahifada =====
// Tuzilma etalondan (P0 PmUserStory · PmLesson2 · PmLesson4 · M3-D10 · M4-D2):
// hero (h-sub YO'Q) -> CodeStrike -> «Endi siz bilasiz» -> uy-vazifa kapsulasi -> nishonlar.
const ScreenSummary = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const live = _gate.live;
  const isMentorL = !!(live && live.mode === 'mentor');
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const RECAP = [
    "Tayyor bo'lakni odamlar ishlatadigan joyga chiqarish — reliz.",
    "Kim tez-tez chiqarsa, o'sha oldin biladi.",
    "Haftalik bo'lak haftaga sig'adi va odam uni ishlata oladi.",
    "Nimani qachon chiqarishni kod emas, mahsulotni o'ylaydigan odam hal qiladi.",
  ];
  // CodeStrike — alohida ekran emas, yakun ichida
  const [arena, setArena] = useState(false);
  const [arenaSolo, setArenaSolo] = useState(false);
  const quizSt = (live && live.quiz && live.quiz.state) || 'off';
  const isStudentL = !!(live && live.mode === 'student');
  const classOver = !!(live && (live.status === 'ended' || !live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== 'done';
  const studentLive = isStudentL && !studentSolo && quizSt !== 'off';
  const studentWait = isStudentL && !studentSolo && quizSt === 'off';
  const openArena = async () => {
    if (isMentorL && quizSt === 'off') { try { await live.quizControl('lobby', -1); } catch { return; } }
    setArenaSolo(studentSolo); setArena(true);
  };
  // Uy-vazifa — alohida ekran emas, kapsula bosilganda shu yerda ochiladi
  const [hwVariant, setHwVariant] = useState(() => readHwTarget());
  const pickHw = (k) => { setHwVariant(k); try { localStorage.setItem(HW_KEY, k); } catch {} };
  const [hwOpen, setHwOpen] = useState(false);
  // 77-qonun: kapsula ochilganda topshiriq-karta ko'rinishga olib kelinadi — aks holda
  // yakun-sahifasi skroll qiladi va karta ekran ostida qolib ketadi.
  const hwRef = useRef(null);
  useEffect(() => {
    if (!hwOpen) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const t = setTimeout(() => { if (hwRef.current) hwRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'start' }); }, 260);
    return () => clearTimeout(t);
  }, [hwOpen]);
  const [charge, setCharge] = useState(false);
  const fireHw = () => { if (charge || hwOpen) return; setCharge(true); setTimeout(() => { setHwOpen(true); setCharge(false); }, 500); };
  const recapCard = (
    <div className="card fade-up d3">
      <div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> Endi siz bilasiz</div>
      <ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul>
    </div>
  );
  return (
    <Stage eyebrow="Dars yakuni" screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Qaytadan</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Yakunlash ✓</button></>}>
      <div className="screen s-fin" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="hero">
          <div className="hero-l">
            <span className="done-chip fade-up"><span className="tick">✓</span> Dars tugadi</span>
            <h2 className="title h-title fade-up d1">Uch haftalik <span className="italic" style={{ color: T.accent }}>rejangiz</span> yozildi.</h2>
          </div>
          {!isMentorL && <ScoreRing correct={correct} total={total} />}
        </div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? '⏳ Mentorni kuting' : undefined} />
        </div>
        {arena && <QuizArena live={live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        {/* «Endi siz bilasiz» va nishonlar yonma-yon (58-qonun): yakun-sahifasi bir ko'z bilan ko'rinadi. */}
        {isMentorL ? recapCard : (
          <div className="split sum2">
            {recapCard}
            <div className="card ach-coll fade-up d4">
              <div className="card-lbl" style={{ color: T.accent }}>🏅 Nishonlaringiz — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
              <div className="ach-grid">
                {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
                  <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={a.desc}>
                    <span className="ach-badge-ic">{got ? a.icon : '🔒'}</span>
                    <span className="ach-badge-name">{a.name}</span>
                    {got && <span className="ach-badge-desc">{a.desc}</span>}
                  </div>
                ); })}
              </div>
            </div>
          </div>
        )}
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${charge ? 'charging' : ''}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, '--d': `${k.d}s` }}>{k.t}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">Uyga vazifa</span>
            <span className="hw-big-s">Amaliy topshiriqni bajarish →</span>
          </button>
        </div>
        {hwOpen && <HwCard variant={hwVariant} onPick={pickHw} innerRef={hwRef} />}
        <MentorNote>Arena tugagach g'oliblarni nomlab tabriklang. Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa variant. Muddat — keyingi darsgacha. Tekshirishda bitta savolga qarang: bo'lak bosilganda nima bo'lishi yozilganmi?</MentorNote>
      </div>
    </Stage>
  );
};
// ============================================================ CSS
const CSS_BASE = `
  html, body { margin: 0; padding: 0; }
  .lesson-root, .lesson-root * { box-sizing: border-box; }
  .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
  .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p { margin: 0; }
  .lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }

  .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
  .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
  .mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
  .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; }
  @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .fade-step { animation: fade-step 0.3s ease-out; }
  .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

  .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
  .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }
  .live-badge { opacity: 0.4; transition: opacity 0.25s ease; }
  .live-badge:hover { opacity: 1; }

  .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12); }
  .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.55); }
  .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
  @keyframes turn-hint {
    0%, 100% { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 0 rgba(91,61,230,0.40); }
    50%      { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 8px rgba(91,61,230,0); }
  }
  .turn-hint { animation: turn-hint 1.9s ease-in-out infinite; }
  .turn-ring { position: relative; }
  .turn-ring::after {
    content: ''; position: absolute; inset: -3px; border-radius: inherit; pointer-events: none;
    border: 2px solid ${T.accent}; opacity: 0; animation: turn-ring 1.9s ease-in-out infinite;
  }
  @keyframes turn-ring { 0%, 100% { opacity: 0; } 50% { opacity: 0.65; } }
  .turn-wave::after { animation-name: turn-wave; animation-duration: 2.1s; animation-iteration-count: 4; }
  @keyframes turn-wave { 0%, 100% { opacity: 0; } 12% { opacity: 0.7; } 30% { opacity: 0; } }
  .turn-wave.w2::after { animation-delay: 0.7s; }
  .turn-wave.w3::after { animation-delay: 1.4s; }
  .turn-wave.wv4::after { animation-duration: 2.8s; }
  .turn-wave.wv4.w4::after { animation-delay: 2.1s; }
  .turn-step::after { animation-name: turn-step; animation-duration: 1.3s; animation-iteration-count: 1; }
  @keyframes turn-step { 0% { opacity: 0; } 20% { opacity: 0.68; } 78% { opacity: 0.68; } 100% { opacity: 0; } }
  .turn-wrap { display: block; position: relative; }
  .turn-wrap > .reflect-input { width: 100%; }
  @media (prefers-reduced-motion: reduce) { .turn-hint, .turn-ring::after { animation: none; } .turn-ring::after { opacity: 0; } }
  .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
  .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
  .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
  .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }

  .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); min-width: 0; overflow-wrap: anywhere; }
  .option:hover:not(:disabled) { background: #FBFAFE; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
  .option:disabled { cursor: default; }
  /* 27-qonun: to'g'ri variant shart-qatori kabi «joyiga o'tiradi» — dars mexanikasining sadosi. */
  .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; animation: opt-land 0.44s cubic-bezier(.34,1.5,.4,1); }
  @keyframes opt-land { 0% { transform: scale(0.975); } 45% { transform: scale(1.022); } 100% { transform: scale(1); } }
  .opt-abc.ok { animation: opt-land 0.44s cubic-bezier(.34,1.5,.4,1) 0.06s; }
  @media (prefers-reduced-motion: reduce) { .option-correct, .opt-abc.ok { animation: none; } }
  .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
  .option-picked-wrong { background: ${T.errSoft} !important; color: ${T.err} !important; box-shadow: 0 8px 22px -6px rgba(229,72,77,0.32) !important; }
  .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
  .opt-abc { width: 27px; height: 27px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; background: ${T.accentSoft}; color: ${T.accent}; transition: background 0.2s, color 0.2s; }
  .opt-abc.ok { background: ${T.success}; color: #fff; }
  .opt-abc.bad { background: ${T.err}; color: #fff; }
  .opt-abc.dim { background: ${T.bg}; color: ${T.ink3}; }

  .mentor { display: flex; gap: 12px; align-items: flex-start; }
  .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
  .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
  .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
  .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 11px 15px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }
  .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
  .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
  .mentor-mob.is-collapsed .mentor-col { gap: 0; }
  .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
  .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

  .mnote { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 5px; cursor: pointer; }
  .mnote-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.blue}; display: flex; align-items: center; }
  .mnote-x { margin-left: auto; font-weight: 800; font-size: 10.5px; opacity: 0.7; text-transform: none; letter-spacing: 0; }
  .mnote-chip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; background: ${T.paper}; border: 1.5px dashed ${T.blue}; color: ${T.blue}; border-radius: 999px; padding: 4px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.04em; cursor: pointer; opacity: 0.4; transition: opacity 0.2s ease, transform 0.2s ease; }
  .mnote-chip:hover, .mnote-chip:focus-visible { opacity: 1; transform: translateY(-1px); }
  @media (hover: none) { .mnote-chip { opacity: 0.6; } }
  .mnote-body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.45; }

  .h-title { font-size: clamp(22px,4vw,38px); }
  .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
  .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
  .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
  .small { font-size: clamp(12.5px,1.4vw,13.5px); }
  .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

  .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
  .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
  .stage-content { flex: 1; min-height: 0; padding-top: clamp(9px,1.5vw,14px); padding-bottom: clamp(14px,2.6vw,26px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
  .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
  .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
  .chrome { display: flex; align-items: center; justify-content: space-between; }
  .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
  .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
  .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

  .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(91,61,230,0.22); }
  .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
  .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

  .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
  .screen > * { flex-shrink: 0; }
  .head { display: flex; flex-direction: column; gap: 6px; }
  .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(16px,2.6vw,30px); align-items: start; }
  .split.sum2 { gap: clamp(12px,2vw,22px); }
  .split.sum2 .ach-grid { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 860px) { .split.sum2 { grid-template-columns: 1fr; } }
  .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
  @media (max-width: 860px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }

  .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: clamp(13px,1.8vw,18px) 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; }
  .ta-bulb { font-size: 30px; }
  .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; }

  .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
  .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; }
  .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
  .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
  .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .ring-num { font-family: 'Source Serif 4', serif; font-size: 30px; font-weight: 500; line-height: 1; }
  .ring-den { color: ${T.ink3}; font-size: 20px; }
  .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
  .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); min-width: 0; overflow-wrap: anywhere; }
  .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
  .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
  .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
  .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; }
  .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; min-width: 0; overflow-wrap: anywhere; }
  .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
  .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
`;
// Dars-vizuallari: reliz-tasmasi (imzo-vizual), hafta-kataklari, darvoza-chiroqlari, yozish-kartasi.
const CSS_LESSON = `
  /* HOOK — ikki tanlov bitta qatorda (104-qonun: teng og'irlik, teng kenglik) */
  .hrow { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: clamp(8px,1.4vw,14px); }
  .hrow.two { max-width: 720px; align-self: center; width: 100%; }
  .hopt { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 7px; background: ${T.paper}; border: none; border-radius: 15px; padding: clamp(14px,2vw,20px) clamp(10px,1.6vw,16px); cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 8px 20px -9px rgba(${T.shadowBase},0.22); transition: transform 0.16s, box-shadow 0.16s; min-width: 0; }
  .hopt:hover:not(:disabled):not(.on) { transform: translateY(-3px); box-shadow: 0 14px 26px -9px rgba(${T.shadowBase},0.3); }
  .hopt:disabled { cursor: default; }
  .hopt.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 12px 26px -9px rgba(91,61,230,0.35); background: ${T.accentSoft}; }
  .hopt-ic { font-size: clamp(24px,3.4vw,32px); line-height: 1; }
  .hopt-nom { font-weight: 700; font-size: clamp(12.5px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.3; overflow-wrap: anywhere; }
  @media (max-width: 560px) { .hrow.two { grid-template-columns: minmax(0,1fr); } }
  .hvote { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,18px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
  .hvote-row { display: flex; align-items: center; gap: 10px; }
  .hvote-lbl { flex: 0 0 clamp(120px,26vw,230px); font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hvote-row.mine .hvote-lbl { color: ${T.accent}; }
  .hvote-track { flex: 1; height: 12px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
  .hvote-fill { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.6s cubic-bezier(.2,.7,.2,1); }
  .hvote-row.top .hvote-fill { background: linear-gradient(90deg, ${T.success}, #0E8A55); }
  .hvote-pct { min-width: 38px; text-align: right; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
  @media (prefers-reduced-motion: reduce) { .hopt, .hvote-fill { transition: none; } }

  /* HOOK imzo-sahnasi: ikki strelkali qator (korpus §67d) — ikkala tanlovda ham bir xil.
     SOYA-ZINAPOYASI: L2 (artefakt-karta). Ikki qator ikki kelajak — rang farqi TENG og'irlikda:
     indigo (eslab qolgan) va kulrang (eslamagan). Qizil YO'Q — bu tanlov, xato emas (104-qonun). */
  .h0pay { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(13px,2vw,18px) clamp(15px,2.4vw,22px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; max-width: 720px; align-self: center; width: 100%; }
  /* Hook ustuni bitta enda turadi: tanlovlar → natija → yopuvchi qator (720px) */
  .h0end { max-width: 720px; align-self: center; width: 100%; }
  .h0pay-row { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; background: ${T.bg}; border-left: 4px solid ${T.line}; border-radius: 4px 12px 12px 4px; padding: 10px 13px; font-family: 'Manrope', sans-serif; font-size: clamp(12.5px,1.5vw,14.5px); line-height: 1.45; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; animation: fade-in-up 0.34s ease-out both; }
  .h0pay-row:nth-child(1) { border-left-color: ${T.accent}; }
  .h0pay-row:nth-child(2) { border-left-color: ${T.ink3}; animation-delay: 0.34s; }
  .h0pay-row b { color: ${T.ink}; font-weight: 800; flex: 0 0 auto; }
  .h0pay-arw { font-style: normal; font-weight: 800; color: ${T.accent}; animation: h0-arw 0.4s cubic-bezier(.3,1.3,.45,1) 0.22s both; }
  .h0pay-row:nth-child(2) .h0pay-arw { color: ${T.ink3}; animation-delay: 0.56s; }
  @keyframes h0-arw { from { opacity: 0; transform: translateX(-7px); } to { opacity: 1; transform: translateX(0); } }
  @media (prefers-reduced-motion: reduce) { .h0pay-row, .h0pay-arw { animation: none; } }

  /* MAQSAD (s1) — uch hafta-qatori o'z-o'zidan yozilib chiqadi (18-qonun) */
  .s1demo { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 18px; padding: clamp(13px,2vw,18px) clamp(15px,2.4vw,22px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; max-width: 680px; align-self: center; width: 100%; }
  .s1demo-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: ${T.accent}; }
  .s1demo-list { display: flex; flex-direction: column; gap: 7px; }
  .s1row { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; background: ${T.bg}; border-radius: 11px; padding: 9px 12px; opacity: 0; animation: s1-in 0.5s cubic-bezier(.3,1.4,.45,1) forwards; animation-delay: var(--dd); min-width: 0; }
  /* 42-qonun: fe'l ↔ ekran jarayoni — chap bo'lak chapdan o'ngga «yozilib chiqadi» */
  .s1row-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; clip-path: inset(0 100% 0 0); animation: s1-write 0.62s ease-out forwards; animation-delay: var(--dd); }
  .s1row-arw { font-style: normal; font-weight: 800; color: ${T.accent}; opacity: 0; animation: s1-ok 0.3s ease-out forwards; animation-delay: var(--dd2); }
  /* Bo'lak-qatori O'SIB chiqadi — imzo-vizualning sadosi.
     Kengayish clip-path bilan: kapsula chapdan o'ngga QURILADI, matn cho'zilib buzilmaydi. */
  .s1row-b { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 4px 12px; overflow-wrap: anywhere; min-width: 0; opacity: 0; animation: s1-grow 0.5s cubic-bezier(.3,1.25,.45,1) forwards; animation-delay: var(--dd2); }
  .s1row-ok { margin-left: auto; font-size: 15px; opacity: 0; animation: s1-ok 0.4s ease-out forwards; animation-delay: var(--dd3); }
  @keyframes s1-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes s1-write { to { clip-path: inset(0 0 0 0); } }
  @keyframes s1-grow { 0% { opacity: 0; clip-path: inset(0 100% 0 0 round 99px); } 40% { opacity: 1; } 100% { opacity: 1; clip-path: inset(0 0 0 0 round 99px); } }
  @keyframes s1-ok { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) { .s1row, .s1row-ok, .s1row-arw, .s1row-b { animation: none; opacity: 1; clip-path: none; } .s1row-t { animation: none; clip-path: none; } }

  /* TEORIYA-1 (s2): ikki karta — bosilsa ochiladi/yopiladi (46-qonun) */
  .dfc-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: clamp(10px,1.8vw,16px); }
  @media (max-width: 700px) { .dfc-grid { grid-template-columns: 1fr; } }
  .dfc { display: flex; flex-direction: column; gap: 9px; text-align: left; background: ${T.paper}; border: none; border-radius: 16px; padding: clamp(13px,2vw,18px); cursor: pointer; box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; transition: transform 0.16s, box-shadow 0.16s; min-width: 0; }
  .dfc:hover { transform: translateY(-2px); box-shadow: 0 14px 26px -9px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.accent}44; }
  .dfc:active { transform: translateY(0); }
  .dfc.open { box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 12px 26px -14px rgba(91,61,230,0.3); }
  .dfc-top { display: flex; align-items: center; gap: 9px; }
  .dfc-ic { font-size: clamp(20px,2.8vw,26px); line-height: 1; }
  .dfc-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  .dfc-b { font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.5; color: ${T.ink2}; background: ${T.bg}; border-radius: 11px; padding: 9px 12px; min-height: 44px; display: flex; align-items: center; overflow-wrap: anywhere; min-width: 0; transition: background 0.2s, color 0.2s; }
  .dfc:not(.open) .dfc-b { justify-content: center; color: ${T.ink3}; letter-spacing: 0.34em; }
  .dfc.open .dfc-b { color: ${T.ink}; background: ${T.accentSoft}; animation: fade-step 0.28s ease-out; }
  @media (prefers-reduced-motion: reduce) { .dfc, .dfc:hover { transition: none; transform: none; } .dfc.open .dfc-b { animation: none; } }
  /* Ikki olam yonma-yon: kartalar qolgan balandlikni to'ldiradi — «bosiladigan mini-sahna»
     bo'lib turadi, ostida 340px o'lik maydon qolmaydi. Matn maydoni kartaning ichida
     o'sadi (ochilganda matn markazda), o'lchamlar o'zgarmaydi. */
  @media (min-width: 861px) {
    .screen > .dfc-grid { flex-grow: 1; max-height: 318px; }
    .screen > .dfc-grid .dfc { justify-content: center; gap: 14px; }
    .screen > .dfc-grid .dfc-b { min-height: 78px; }
  }

  /* IMZO-VIZUAL (s4): RELIZ-TASMASI — ikki yo'l, olti hafta-katagi.
     Hafta-katagi shakli s9 rejasida QAYTADI — bir dars, bir vizual til.
     Rang-qonuni: 🔒 «yasalmoqda» — neytral kulrang (xato emas, holat); chiqqan bo'lak — success;
     «hech kim ochmadi» qatori — indigo izoh (qizil YO'Q: bu nosozlik emas, kech bilingan fakt). */
  .pyg { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 20px; padding: clamp(11px,1.8vw,16px); box-shadow: 0 18px 38px -18px rgba(${T.shadowBase},0.32), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .pyg-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .pyg-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.7vw,15.5px); color: ${T.ink}; }
  .pyg-n { font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 3px 11px; }
  .pyg-src { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.ink3}; }
  .pyg-lane { display: grid; grid-template-columns: clamp(110px,17vw,168px) minmax(0,1fr); gap: 10px; align-items: center; }
  .pyg-nom { display: flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.45vw,13.5px); color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .pyg-cells { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 6px; }
  .pyg-cells.reja { grid-template-columns: repeat(3, minmax(0,1fr)); }
  .pyg-cell { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; text-align: center; min-height: 76px; border-radius: 12px; padding: 8px 5px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .pyg-cell.wait { opacity: 0.5; }
  .pyg-cell.lock { box-shadow: inset 0 0 0 1.5px ${T.ink3}55; }
  .pyg-cell.on { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
  .pyg-w { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 10px; color: ${T.ink3}; }
  .pyg-ic { font-size: 17px; line-height: 1; }
  .pyg-nm { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; line-height: 1.25; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .pyg-odam { font-weight: 700; font-size: 10.5px; color: ${T.accent}; }
  .pyg-cell.lock .pyg-nm, .pyg-cell.lock .pyg-odam { color: ${T.ink3}; }
  @media (max-width: 760px) { .pyg-lane { grid-template-columns: minmax(0,1fr); gap: 5px; } .pyg-cells { grid-template-columns: repeat(3, minmax(0,1fr)); } }

  /* Boshqaruv (72-qonun): yorliqli tugma + diqqat-signali; birinchi bosishdan keyin signal tinadi */
  .pygc { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,1.9vw,16px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .pyg-btn { font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 12px 22px; background: linear-gradient(135deg, ${T.accent}, ${T.accentVivid}); color: #fff; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5); animation: pyg-pulse 1.7s ease-in-out infinite; transition: transform 0.15s; }
  .pyg-btn:hover:not(:disabled) { transform: translateY(-2px); }
  .pyg-btn.calm { animation: none; }
  .pyg-btn:disabled { opacity: 0.5; cursor: default; animation: none; box-shadow: none; }
  @keyframes pyg-pulse { 0%, 100% { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5), 0 0 0 0 rgba(110,75,255,0.45); } 50% { box-shadow: 0 12px 28px -8px rgba(91,61,230,0.6), 0 0 0 12px rgba(110,75,255,0); } }
  .pygc-sub { font-family: 'Manrope'; font-weight: 600; font-size: 12px; line-height: 1.4; color: ${T.ink3}; min-width: 0; overflow-wrap: anywhere; }
  .pygd { display: flex; flex-direction: column; gap: 7px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,1.9vw,16px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .pygd-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; min-width: 0; overflow-wrap: anywhere; }
  .pygd-row { display: flex; flex-direction: column; gap: 3px; background: ${T.bg}; border-radius: 11px; padding: 8px 11px; min-width: 0; }
  .pygd-row b { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink}; }
  .pygd-row i { font-style: normal; font-family: 'Manrope'; font-weight: 600; font-size: 12px; line-height: 1.4; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
  .pygd-bildi { font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; line-height: 1.4; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 9px; padding: 6px 10px; min-width: 0; overflow-wrap: anywhere; }
  @media (prefers-reduced-motion: reduce) { .pyg-btn { animation: none; transition: none; } .pyg-btn:hover:not(:disabled) { transform: none; } }
  /* MOBIL (s4 · s9): natija-paneli tepaga chiqadi — bosish va o'zgarish bir ko'rish maydonida qoladi */
  @media (max-width: 860px) {
    .split.s4 > .col:last-child, .split.s9 > .col:last-child { display: contents; }
    .split.s4 .pygd, .split.s9 .dvz { order: -1; }
  }

  /* TEKSHIRUV (s9): uch nomzod, darvoza va uning ikki chirog'i */
  .split.s9 { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
  /* Yo'riq-qatori — L1.5 soya + hujjat-hoshiyasi; uch hafta to'lgach hoshiya yashilga o'tadi */
  .s9ask { display: flex; align-items: center; gap: 10px; background: ${T.paper}; border-left: 5px solid ${T.accent}; border-radius: 4px 14px 14px 4px; padding: 10px 14px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; transition: border-color 0.3s ease; }
  .s9ask.ok { border-left-color: ${T.success}; }
  .s9ask-n { flex-shrink: 0; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 10px; transition: color 0.3s ease, background 0.3s ease; }
  .s9ask.ok .s9ask-n { color: ${T.success}; background: ${T.successSoft}; }
  .s9ask-t { font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.4; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
  .s9ask-t i { font-style: normal; font-weight: 800; color: ${T.ink}; }
  @media (prefers-reduced-motion: reduce) { .s9ask, .s9ask-n { transition: none; } }
  .nmz-opts { display: flex; flex-direction: column; gap: 7px; }
  .nmz-opt { display: flex; align-items: center; gap: 10px; text-align: left; background: ${T.paper}; border: none; border-radius: 13px; padding: 11px 14px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 8px 20px -12px rgba(${T.shadowBase},0.2); transition: transform 0.14s, box-shadow 0.14s; min-width: 0; }
  .nmz-opt:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 12px 24px -12px rgba(${T.shadowBase},0.28); }
  .nmz-opt:active:not(:disabled) { transform: translateY(0) scale(0.99); }
  .nmz-opt:disabled { cursor: default; opacity: 0.55; }
  .nmz-opt:focus-visible { outline: none; box-shadow: inset 0 0 0 2px ${T.accent}, 0 0 0 4px rgba(91,61,230,0.22); }
  .nmz-ic { font-size: 19px; line-height: 1; flex-shrink: 0; }
  .nmz-t { flex: 1; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.35; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .nmz-kun { flex-shrink: 0; font-weight: 700; font-size: 11px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 9px; }
  .nmz-src { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.ink3}; }
  .rnk-empty { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.success}; background: ${T.successSoft}; border-radius: 10px; padding: 8px 12px; min-width: 0; overflow-wrap: anywhere; }
  /* Darvoza — L3 soya (s4 tasmasi bilan bir daraja): ikki chiroq hukmni AYTADI */
  .dvz { display: flex; flex-direction: column; gap: 8px; background: ${T.ink}; border-radius: 20px; padding: 10px; box-shadow: 0 20px 44px -18px rgba(${T.shadowBase},0.46); min-width: 0; transition: box-shadow 0.3s ease; }
  .dvz.ok { box-shadow: 0 20px 44px -18px rgba(${T.shadowBase},0.46), 0 0 0 3px ${T.success}66; }
  .dvz-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; padding: 2px 5px; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: #fff; }
  .dvz-sub { font-weight: 700; font-size: 10.5px; color: rgba(255,255,255,0.66); }
  .dvz-lamps { display: flex; gap: 7px; flex-wrap: wrap; }
  .dvz-lamp { flex: 1; min-width: 132px; display: flex; align-items: center; justify-content: center; gap: 6px; border-radius: 11px; padding: 9px 11px; background: ${T.paper}; color: ${T.ink3}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(11.5px,1.4vw,13px); box-shadow: inset 0 0 0 1.5px ${T.line}; transition: background 0.25s, color 0.25s, box-shadow 0.25s; overflow-wrap: anywhere; }
  .dvz-lamp.ok { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
  .dvz-lamp.no { background: ${T.errSoft}; color: ${T.err}; box-shadow: inset 0 0 0 2px ${T.err}; }
  .dvz-res { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); line-height: 1.45; border-radius: 10px; padding: 8px 12px; min-width: 0; overflow-wrap: anywhere; animation: fade-step 0.3s ease-out; }
  .dvz-res.hit { color: ${T.success}; background: ${T.successSoft}; }
  .dvz-wait { margin: 0; padding: 0 5px; font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: rgba(255,255,255,0.7); }
  /* Darvoza ichidagi bo'sh hafta-uyasi — quyida, «DARVOZA ICHIDAGI...» blokida (kontrast bo'yicha qayta yozilgan) */
  @media (prefers-reduced-motion: reduce) { .nmz-opt, .dvz, .dvz-lamp { transition: none; } .nmz-opt:hover:not(:disabled) { transform: none; } .dvz-res { animation: none; } }
  /* YOZISH-EKRANI (s8): muharrir-kartasi, topshiriq-paneli, yozilganlar ro'yxati */
  /* Fokus-yuza (L2.5): imzo-sahnadan past turadi, boshqa kartalardan esa accent-halqa bilan ajraladi */
  .wsp-ed { display: flex; flex-direction: column; gap: 7px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,17px); box-shadow: 0 14px 30px -15px rgba(${T.shadowBase},0.25), inset 0 0 0 2px ${T.accent}44; min-width: 0; }
  .wsp-ed-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; }
  .wsp-q { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink3}; margin-top: 2px; }
  .wsp-save { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.6vw,14.5px); color: #fff; background: ${T.accent}; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 10px 22px -10px rgba(91,61,230,0.6); transition: transform 0.14s, opacity 0.14s, box-shadow 0.14s; }
  .wsp-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 13px 26px -10px rgba(91,61,230,0.7); }
  .wsp-save:active:not(:disabled) { transform: translateY(0) scale(0.97); }
  .wsp-save:disabled { opacity: 0.42; cursor: not-allowed; box-shadow: none; }
  @media (prefers-reduced-motion: reduce) { .wsp-save { transition: none; } .wsp-save:hover:not(:disabled), .wsp-save:active:not(:disabled) { transform: none; } }
  .wsp-list { display: flex; flex-direction: column; gap: 7px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,17px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.success}55; min-width: 0; }
  .wsp-list-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.success}; overflow-wrap: anywhere; }
  .wsp-item { display: flex; align-items: flex-start; gap: 9px; background: ${T.bg}; border-radius: 11px; padding: 9px 11px; min-width: 0; animation: fade-in-up 0.34s ease-out both; }
  .wsp-item:nth-child(3) { animation-delay: 0.09s; }
  .wsp-item:nth-child(4) { animation-delay: 0.18s; }
  @media (prefers-reduced-motion: reduce) { .wsp-item { animation: none; } }
  .wsp-item-n { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: ${T.success}; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }
  .wsp-item-t { flex: 1; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; line-height: 1.4; min-width: 0; overflow-wrap: anywhere; }
  .wsp-arw { font-style: normal; font-weight: 800; color: ${T.accent}; }
  .wsp-item-edit { flex-shrink: 0; background: none; border: none; cursor: pointer; font-size: 14px; color: ${T.ink3}; border-radius: 8px; padding: 2px 6px; }
  .wsp-item-edit:hover { color: ${T.accent}; background: ${T.accentSoft}; }
  .wsp-task { display: flex; flex-direction: column; gap: 5px; background: ${T.paper}; border-left: 5px solid ${T.accent}; border-radius: 14px; padding: 11px 14px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; }
  .wsp-task-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
  .wsp-task-nom { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(15px,2vw,18px); color: ${T.ink}; line-height: 1.25; overflow-wrap: anywhere; min-width: 0; }
  .wsp-task-n { font-size: 11.5px; font-weight: 700; color: ${T.ink3}; }

  /* BOSQICHLI OCHILISH (94-qonun): uch qadam-doirasi */
  .stps { display: flex; flex-wrap: wrap; gap: 8px; }
  .stp { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink3}; background: ${T.paper}; border-radius: 99px; padding: 5px 12px 5px 5px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .stp i { font-style: normal; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: ${T.bg}; color: ${T.ink3}; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11px; }
  .stp.on { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .stp.on i { background: ${T.accent}; color: #fff; }
  .stp.done { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
  .stp.done i { background: ${T.success}; color: #fff; }

  /* 81-qonun: kiritish-signallari MA'NO rangida (qizil hech qachon). */
  .reflect-input { font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; border: none; border-radius: 10px; padding: 11px 14px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; width: 100%; min-width: 0; transition: box-shadow 0.18s; }
  .reflect-input:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
  .reflect-input.filled { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .reflect-input.await { animation: rin-wait 2.2s ease-in-out infinite; }
  @keyframes rin-wait { 0%, 100% { box-shadow: inset 0 0 0 1.5px ${T.line}; } 50% { box-shadow: inset 0 0 0 1.5px ${T.accent}77, 0 0 0 4px rgba(91,61,230,0.10); } }
  .reflect-input.await:focus { animation: none; }
  @media (prefers-reduced-motion: reduce) { .reflect-input.await { animation: none; box-shadow: inset 0 0 0 1.5px ${T.accent}55; } }
  .sfb { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; border-radius: 9px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; }
  .sfb.ok { color: ${T.success}; background: ${T.successSoft}; }
  .sfb.ask { color: ${T.accent}; background: ${T.accentSoft}; }
  .wsxrow { display: flex; gap: 8px; flex-wrap: wrap; }
  .wsx { flex: 1; min-width: 160px; background: ${T.bg}; border: 1.5px dashed ${T.ink3}66; border-radius: 12px; overflow: hidden; }
  /* .wsx juftlik-qatorida flex: 1 bilan yashaydi; ekranning TO'G'RIDAN-TO'G'RI bolasi
     bo'lganda (s9 «Yordam») o'sha grow bo'sh balandlikni yutib, 250px punktir quti hosil
     qilardi — bu yerda u faqat o'z bo'yiga teng turadi. */
  .screen > .wsx { flex: 0 0 auto; }
  .wsx.star { border-color: ${T.blue}66; }
  .wsx-toggle { width: 100%; text-align: left; background: none; border: none; padding: 8px 11px; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.accent}; cursor: pointer; }
  .wsx.star .wsx-toggle { color: ${T.blue}; }
  .wsx-body { padding: 0 11px 9px; display: flex; flex-direction: column; gap: 6px; animation: fade-step 0.25s ease-out; }
  .wsx-body p { font-size: 12.5px; color: ${T.ink2}; margin: 0; line-height: 1.45; overflow-wrap: anywhere; }
  .wsx-body b { color: ${T.ink}; }

  /* XULOSA-KARTASI (s2) va yordamchi qatorlar */
  .xul { background: ${T.paper}; border-left: 5px solid ${T.success}; border-radius: 14px; padding: clamp(13px,2vw,18px); display: flex; flex-direction: column; gap: 7px; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.2); }
  .xul-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; }
  .xul-b { margin: 0; font-size: clamp(13.5px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
  .bhint { margin: 0; align-self: flex-start; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 9px; padding: 7px 12px; min-width: 0; overflow-wrap: anywhere; }
  .bdone { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }

  /* KODING darvoza-mashqi (82e) va kompilyator launch-kartasi */
  .gt-rows { display: flex; flex-direction: column; gap: 7px; }
  .fchoice { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); border: none; border-radius: 12px; padding: 10px 14px; background: ${T.paper}; color: ${T.ink}; cursor: pointer; text-align: left; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.16s; max-width: 100%; min-width: 0; overflow-wrap: anywhere; }
  .fchoice:hover { box-shadow: inset 0 0 0 1.5px ${T.accent}66; transform: translateY(-1px); }
  .fchoice.miss { background: ${T.errSoft}; color: ${T.err}; box-shadow: inset 0 0 0 2px ${T.err}; animation: cmt-shake 0.4s ease; }
  @keyframes cmt-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 55% { transform: translateX(5px); } 80% { transform: translateX(-2px); } }
  /* Darvoza-kartasi (s10 · 1-bosqich) va recap ikki qadami (s12) — ekranda YAGONA harakat
     joyi bo'lgani uchun qolgan joyning o'rtasiga o'tiradi: pastda 360px o'lik maydon
     qolmaydi, diqqat bitta kartaga tushadi. */
  @media (min-width: 861px) {
    .screen > .cmt, .screen > .rcp-flow, .screen > .split.kod { margin-top: auto; margin-bottom: auto; }
  }
  .cmt { background: ${T.bg}; border-radius: 13px; border-left: 4px solid ${T.accent}; padding: 11px 13px; display: flex; flex-direction: column; gap: 9px; }
  .cmt.hunt { animation: cmt-hunt 1.7s ease-in-out infinite; }
  .cmt.calm { animation: none; }
  @keyframes cmt-hunt { 0%, 100% { box-shadow: 0 0 0 0 rgba(110,75,255,0.4); } 50% { box-shadow: 0 0 0 9px rgba(110,75,255,0); } }
  .cmt-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: ${T.ink}; }
  .cmt-fold { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; background: ${T.successSoft}; border-radius: 99px; padding: 7px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; max-width: 100%; min-width: 0; overflow-wrap: anywhere; }
  .cmt-done { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.5vw,13.5px); color: ${T.success}; animation: fade-step 0.3s ease-out; }
  .cmt-tip { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13px); line-height: 1.45; color: ${T.ink2}; background: ${T.accentSoft}; border-radius: 9px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; animation: fade-step 0.3s ease-out; }
  @media (prefers-reduced-motion: reduce) { .cmt.hunt, .cmt-tip, .cmt-done, .fchoice.miss { animation: none; } .fchoice, .fchoice:hover { transition: none; transform: none; } }
  .kdpanel { position: relative; background: ${T.paper}; border-radius: 16px; padding: 11px 13px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.18); border-left: 5px solid ${T.accent}; min-width: 0; transition: border-color 0.3s; }
  .kdpanel.is-done { border-left-color: ${T.success}; }
  .kdreq { margin: 0; padding-left: 19px; display: flex; flex-direction: column; gap: 4px; }
  .kdreq li { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; overflow-wrap: anywhere; }
  .kd-skip { align-self: flex-start; background: none; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-decoration: underline; text-underline-offset: 3px; padding: 4px 6px; border-radius: 8px; transition: color 0.15s; }
  .kd-skip:hover { color: ${T.accent}; }
  .klaunch { display: flex; flex-direction: column; align-items: center; gap: 9px; text-align: center; background: ${T.paper}; border-radius: 18px; padding: clamp(15px,2.4vw,22px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .klaunch-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; }
  .klaunch-b { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink2}; overflow-wrap: anywhere; }
  .klaunch-sub { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
  .kod-launch-btn { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,1.9vw,17px); background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 15px 34px; cursor: pointer; box-shadow: 0 14px 30px -8px rgba(91,61,230,0.6); transition: transform 0.18s, box-shadow 0.18s; }
  .kod-launch-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -8px rgba(110,75,255,0.72); }
  .kod-launch-btn:active { transform: translateY(0) scale(0.98); }
  @media (prefers-reduced-motion: reduce) { .kod-launch-btn { transition: none; transform: none !important; } }
  .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 10px 13px; display: flex; flex-direction: column; gap: 5px; }

  /* RECAP (s12) */
  .rcp-flow { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; }
  @media (max-width: 760px) { .rcp-flow { grid-template-columns: 1fr; } }
  .rcp-step { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  .rcp-step-h { display: flex; gap: 11px; align-items: flex-start; }
  .rcp-n { width: 26px; height: 26px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 5px 12px -5px rgba(91,61,230,0.5), 0 0 0 3px ${T.accentSoft}; }
  .rcp-t { display: block; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
  .pair-timer { background: ${T.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 10px; box-shadow: inset 0 0 0 1.5px ${T.line}; margin-top: auto; }
  .pair-now { font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink2}; line-height: 1.45; }
  .pair-who { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 8px; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 13px; vertical-align: middle; }
  .pair-who.b { background: ${T.success}; }
  .pair-live { display: flex; align-items: center; gap: 15px; }
  .pair-ring { position: relative; width: 82px; height: 82px; flex-shrink: 0; }
  .pair-ring-mid { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; }
  .pair-ring-who { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 14px; }
  .pair-ring-who.b { background: ${T.success}; }
  .pair-ring-sec { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 15px; color: ${T.ink}; font-variant-numeric: tabular-nums; margin-top: 2px; }
  .pair-live-txt { display: flex; flex-direction: column; gap: 3px; }
  .pair-next { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
  .pair-timer-btns { display: flex; gap: 8px; }
  .pair-start { font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 12px 22px; background: linear-gradient(135deg, ${T.accent}, ${T.accentVivid}); color: #fff; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5); animation: pair-start-pulse 1.6s ease-in-out infinite; transition: transform 0.15s; }
  .pair-start:hover { transform: translateY(-2px); }
  @keyframes pair-start-pulse { 0%, 100% { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5), 0 0 0 0 rgba(110,75,255,0.45); } 50% { box-shadow: 0 12px 28px -8px rgba(91,61,230,0.6), 0 0 0 12px rgba(110,75,255,0); } }
  .pair-start.calm { animation: none; }
  @media (prefers-reduced-motion: reduce) { .pair-start { animation: none; } }

  /* KEYS-SLAYD + BASHORAT */
  .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(15px,2.4vw,24px) clamp(18px,3vw,30px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 9px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
  .k-slide::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}, ${T.blue}); }
  .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
  .k-slide-ic { font-size: clamp(30px,4.8vw,46px); line-height: 1; }
  .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(19px,3vw,28px); color: ${T.ink}; margin: 0; }
  .k-slide-body { font-size: clamp(14.5px,1.9vw,17px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; }
  .k-slide-body b { color: ${T.ink}; }
  /* 🔴 s6 BO'SH MAYDON YIG'ILDI (k-slide oilasining umumiy nuqsoni): slayd ostida
     300–390px oq bo'shliq qolardi. Endi ekranda turgan YAGONA karta (slayd · bashorat ·
     ko'prik) qolgan joyni O'ZI to'ldiradi, matni markazda turadi — matn o'lchami,
     rangi va tartibi o'zgarmaydi. Karta hech qachon siqilmaydi (flex-shrink: 0 saqlanadi),
     shuning uchun kichik ekranda skroll odatdagidek ishlaydi (60-qonun). */
  .screen.k-fill > .k-slide, .screen.k-fill > .kp-bet { flex-grow: 1; justify-content: space-evenly; }
  /* Ko'prik-bosqichi — matn paneli: u CHO'ZILMAYDI (bo'sh siyoh-maydon paydo bo'lardi),
     qolgan joyning o'rtasiga o'tiradi (auto-hoshiya) va nafas-oralig'i biroz kengayadi. */
  .screen.k-fill > .frame-soft { margin-top: auto; margin-bottom: auto; padding-block: clamp(16px,3.4vh,34px); }
  .screen.k-fill > .k-dots { flex-shrink: 0; }
  /* Karta kattalashgani uchun ichidagi belgi/sarlavha/matn ham slayd-o'lchamiga chiqadi:
     bo'shliq kartaning ICHIGA ko'chib qolmaydi, «taqdimot slaydi» hissi paydo bo'ladi. */
  @media (min-width: 861px) {
    .screen.k-fill > .k-slide { padding: clamp(22px,3vw,34px) clamp(22px,3.4vw,40px); gap: 13px; }
    .screen.k-fill > .k-slide .k-slide-ic { font-size: clamp(40px,5.4vw,62px); }
    .screen.k-fill > .k-slide .k-slide-h { font-size: clamp(22px,3.4vw,33px); }
    .screen.k-fill > .k-slide .k-slide-body { font-size: clamp(15px,2.1vw,19.5px); max-width: 680px; }
    .screen.k-fill > .kp-bet:not(.answered) { padding: clamp(20px,2.8vw,32px) clamp(20px,3vw,36px); gap: 15px; }
    .screen.k-fill > .kp-bet:not(.answered) .k-slide-h { font-size: clamp(20px,2.9vw,28px); }
    .screen.k-fill > .frame-soft .body { font-size: clamp(15px,2vw,17px); }
  }
  @media (max-width: 860px) { .screen.k-fill > .k-slide, .screen.k-fill > .kp-bet, .screen.k-fill > .frame-soft { flex-grow: 0; } }
  .k-dots { display: flex; gap: 8px; justify-content: center; }
  .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
  .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }
  .kp-bet { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(15px,2.4vw,24px) clamp(18px,3vw,30px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 11px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
  .kp-bet::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: repeating-linear-gradient(90deg, ${T.accent} 0 14px, ${T.accentSoft} 14px 22px); }
  .kp-bet.answered { padding: clamp(11px,1.6vw,15px) clamp(14px,2.2vw,22px); gap: 8px; transition: padding 0.3s ease; }
  .kp-bet.answered .k-slide-h { font-size: clamp(15px,2vw,19px); }
  .kp-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
  .kp-bet.answered .kp-chips { gap: 7px; }
  .kp-bet.answered .kp-chip { padding: 7px 13px; font-size: clamp(12px,1.5vw,13.5px); }
  .kp-chip { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,15px); padding: 10px 16px; border-radius: 99px; border: none; background: ${T.bg}; color: ${T.ink}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: transform 0.16s, box-shadow 0.16s; }
  .kp-chip:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 10px 20px -8px rgba(${T.shadowBase},0.24); }
  .kp-ic { font-size: 18px; }
  .kp-chip.locked { cursor: default; transform: none; }
  .kp-chip.locked:hover { transform: none; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); }
  .kp-chip.correct { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
  .kp-chip.correct:hover { box-shadow: inset 0 0 0 2px ${T.success}; }
  .kp-chip.wrong { background: ${T.errSoft}; color: ${T.err}; box-shadow: inset 0 0 0 2px ${T.err}; }
  .kp-chip.wrong:hover { box-shadow: inset 0 0 0 2px ${T.err}; }
  .kp-chip.locked:not(.correct):not(.wrong) { opacity: 0.5; }
  .kp-mark { font-weight: 900; font-size: 15px; }
  .kp-res.kp-res { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fade-step 0.3s ease-out; }
  .kp-res.hit { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
  .kp-res.miss { color: ${T.accent}; background: ${T.accentSoft}; }
  @media (prefers-reduced-motion: reduce) { .kp-chip, .kp-chip:hover { transition: none; transform: none; } .kp-res { animation: none; } }

  /* FLASHCARD */
  .fc-center { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding-top: 4px; }
  .fc { display: flex; flex-direction: column; gap: 11px; max-width: 520px; width: 100%; }
  .fc-top { display: flex; justify-content: space-between; align-items: center; }
  .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
  .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
  .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
  .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
  @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
  .fc-bar { height: 7px; background: ${T.line}; border-radius: 99px; overflow: hidden; }
  .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
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
  .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
  .fc-card.flip { transform: rotateY(180deg); }
  .fc-card:not(.flip):hover { transform: translateY(-3px); }
  .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
  .fc-front { background: ${T.paper}; border: 2px solid ${T.line}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
  .fc-back { background: linear-gradient(160deg, ${T.accentVivid}, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(91,61,230,0.6); }
  .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(17px,2.6vw,22px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
  .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
  .fc-tap { color: ${T.accent}; font-weight: 700; }
  .fc-tag { font-family: 'Manrope', sans-serif; font-weight: 800; letter-spacing: -0.01em; line-height: 1.2; max-width: 100%; text-wrap: balance; overflow-wrap: anywhere; }
  .fc-tag.t1 { font-size: clamp(28px,5.4vw,42px); }
  .fc-tag.t2 { font-size: clamp(23px,4.2vw,32px); }
  .fc-tag.t3 { font-size: clamp(19px,3.2vw,25px); }
  .fc-tag.t4 { font-size: clamp(16px,2.5vw,21px); line-height: 1.3; }
  .fc-actions { display: flex; gap: 10px; min-height: 48px; }
  .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
  .fc-btn:hover { transform: translateY(-2px); }
  .fc-btn.knew { background: ${T.success}; color: #fff; box-shadow: 0 10px 22px -10px ${T.success}; }
  .fc-btn.again { background: ${T.paper}; border: 2px solid ${T.accent}66; color: ${T.accent}; }
  .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
  .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
  .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
  .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
  .fc-done-emoji { font-size: 40px; }
  .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
  .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }
  @media (prefers-reduced-motion: reduce) { .fc-card, .fc-fly, .fc-pill, .fc-btn { animation: none !important; transition: none; } }

  /* UYGA VAZIFA */
  .hw-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
  .hw-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); padding: 11px 18px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.18), inset 0 0 0 1.5px ${T.line}; transition: all 0.18s; }
  .hw-chip:hover:not(.on) { transform: translateY(-2px); box-shadow: 0 10px 22px -8px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.accent}55; }
  .hw-chip.on { background: ${T.accent}; color: #fff; box-shadow: 0 8px 18px -6px rgba(91,61,230,0.4), inset 0 0 0 2px ${T.accent}; }
  .pmtask { background: ${T.paper}; border-radius: 16px; padding: 0; overflow: hidden; box-shadow: 0 12px 30px -12px rgba(91,61,230,0.28); border: 1.5px solid ${T.line}; border-left: 5px solid ${T.accent}; }
  .pmtask-head { display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; background: ${T.accentSoft}; }
  .pmtask-tag { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.04em; color: ${T.accent}; }
  .pmtask-id { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; color: ${T.accent}; background: ${T.paper}; border-radius: 99px; padding: 3px 10px; }
  .pmtask-rows { display: flex; flex-direction: column; }
  .pmtask-row { display: flex; gap: 12px; padding: 10px 16px; align-items: baseline; }
  .pmtask-row + .pmtask-row { border-top: 1px solid ${T.line}; }
  .pmtask-k { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink3}; flex: 0 0 clamp(84px,14vw,110px); }
  .pmtask-v { font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; flex: 1; line-height: 1.4; }
  .pmtask-steps { position: relative; display: flex; flex-direction: column; gap: 10px; padding: 14px 16px 16px; background: ${T.bg}; }
  .pmtask-step { position: relative; display: flex; align-items: center; gap: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.45; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
  .pmtask-step i { font-style: normal; width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; }
  /* Uy-vazifa kapsulasi (P0 hw-big oilasi) — yakun sahifasining oxirgi harakati */
  .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
  .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
  @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
  .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
  .hw-big:hover { transform: translateY(-3px) scale(1.02); }
  .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; text-shadow: 0 2px 12px rgba(0,0,0,0.25); }
  .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
  .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent); transform: skewX(-18deg); animation: hw-shine 3.2s ease-in-out infinite; pointer-events: none; }
  .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: rgba(255,255,255,0.15); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
  @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
  .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
  @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.05); } 100% { filter: brightness(1); transform: scale(1); } }
  @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 0 rgba(124,58,237,.35); } 50% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 34px rgba(124,58,237,.68), 0 0 84px rgba(124,58,237,.4), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 11px rgba(124,58,237,0); } }
  @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
  @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none; } .hw-big-wrap::before { opacity: 0.55; } }

  /* MAQSAD (s1): hafta-yorlig'i chapda, bo'lak-qatori o'ngda — s8 saqlangan qatori bilan bir shakl */
  .s1row-b { color: ${T.ink}; background: ${T.accentSoft}; border-radius: 10px; }

  /* YOZISH-EKRANI (s8): oldingi bo'lak referent-qatori (bola takrorlab yubormasin) */
  .wsp-prev { font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; line-height: 1.4; color: ${T.ink3}; background: ${T.bg}; border-radius: 9px; padding: 5px 10px; min-width: 0; overflow-wrap: anywhere; }

  /* RECAP (s12) mukofot-blogi (106f-b): yozilgach ikki qator */
  .rcp-win { display: flex; flex-direction: column; gap: 3px; background: ${T.successSoft}; border-radius: 11px; padding: 9px 12px; min-width: 0; animation: fade-step 0.3s ease-out; }
  .rcp-win-t { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.success}; overflow-wrap: anywhere; }
  .rcp-win-s { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink2}; overflow-wrap: anywhere; }
  @media (prefers-reduced-motion: reduce) { .rcp-win { animation: none; } }
  /* Qulf-tugma yonidagi qadam-yorlig'i (30-qonun): qaysi qadam qolgani aytiladi */
  .wsp-go { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .wsp-need { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 9px; padding: 6px 11px; min-width: 0; overflow-wrap: anywhere; }
  /* Topshiriq-paneli ichidagi shart-ro'yxati: bajarilgani YASHIL (30-qonun naqshi) */
  .wsp-chk { display: flex; flex-direction: column; gap: 4px; margin-top: 2px; }
  .wsp-chk-i { display: flex; align-items: flex-start; gap: 7px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(11.5px,1.35vw,12.5px); line-height: 1.4; color: ${T.ink3}; min-width: 0; overflow-wrap: anywhere; }
  .wsp-chk-i i { font-style: normal; flex-shrink: 0; font-weight: 800; color: ${T.ink3}; }
  .wsp-chk-i.on, .wsp-chk-i.on i { color: ${T.success}; }

  /* 🔴 YAKUN-EKRANI 58-QONUN BO'YICHA YIG'ILDI (1440×900 · 1280×800 da skrollsiz):
     matn, so'z kattaligi va tartib TEGILMAGAN — faqat ichki oraliq/padding qisqardi
     (CTA-kapsula qoidasi: CodeStrike so'zining o'lchami o'zgarmaydi). */
  /* Qolgan bo'sh joy bloklar ORASIGA teng bo'linadi — ekran ostida o'lik maydon qolmaydi. */
  .s-fin { gap: clamp(7px,1vw,10px) !important; justify-content: space-between; }
  .s-fin .ring-wrap { width: 104px; height: 104px; }
  .s-fin .ring-wrap svg { width: 100%; height: 100%; }
  .s-fin .ring-num { font-size: 26px; }
  .s-fin .ring-den { font-size: 17px; }
  .s-fin .cs-cta .cs-cap { padding: clamp(8px,1.05vw,13px) clamp(20px,3vw,36px); }
  .s-fin .card { padding: 12px 17px; }
  .s-fin .card-lbl { margin-bottom: 8px; }
  .s-fin .ach-badge { padding: 7px 8px; gap: 2px; }
  .s-fin .ach-badge-ic { font-size: 26px; }
  .s-fin .ach-badge.locked .ach-badge-ic { font-size: 20px; }
  .s-fin .hw-big { padding: clamp(14px,1.85vw,20px) clamp(26px,3.4vw,44px); gap: 4px; }
  .s-fin .hw-big-t { font-size: clamp(23px,3.2vw,30px); }

  /* KEYS (s6): oy-yo'li (12 katak) + «Oyiga foydalanadigan odam» hisoblagichi.
     §101/§123: hisoblagich 0 dan yugurmaydi — javobgacha «—» da turadi; raqam yilsiz turmaydi. */
  .kmy { display: flex; flex-direction: column; align-items: center; gap: 5px; align-self: center; text-align: center; background: ${T.paper}; border-radius: 14px; padding: 10px 18px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.line}; max-width: 100%; min-width: 0; }
  .kmy-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink3}; }
  .kmy-oy { display: flex; gap: 4px; flex-wrap: wrap; justify-content: center; }
  .kmy-c { width: 18px; height: 18px; border-radius: 6px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; line-height: 1; }
  .kmy-c.on { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; animation: kmy-on 0.3s ease-out both; animation-delay: var(--kd, 0s); }
  @keyframes kmy-on { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
  .kmy-oylbl { font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
  .kmy-val { font-weight: 800; font-size: clamp(19px,2.6vw,26px); line-height: 1.1; color: ${T.accent}; font-variant-numeric: tabular-nums; }
  .kmy-yil { font-style: normal; font-family: 'Manrope'; font-weight: 700; font-size: 0.55em; color: ${T.ink3}; margin-left: 6px; }
  .kmy-sub { font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink3}; min-width: 0; overflow-wrap: anywhere; }
  @media (prefers-reduced-motion: reduce) { .kmy-c.on { animation: none; } }

  /* ============================================================
     🎨 DIZAYN-QATLAMI (2026-08-17) — 58/60-qonun + imzo-vizual sayqali.
     Uch ish: (a) s4 poyga-tasmasi past-desktopda SKROLLSIZ; (b) ekran ostidagi
     o'lik maydon kartalarga tarqaladi; (c) poyga-katagi «bilib oldi» belgisini
     yig'adi — xulosadagi «6 marta ↔ 1 marta» ko'z bilan sanaladi.
     ============================================================ */

  /* (c) IMZO-VIZUAL: hafta-katagi ochilishi — «joyiga tushdi» harakati.
     Umumiy .fade-step o'rniga o'z keyframe: katak pastdan kelib joyiga o'tiradi,
     belgisi ustidan chiqadi. Har hafta bittadan — sakrash yo'q. */
  .pyg-cell { position: relative; }
  .pyg-cell.on.fade-step, .pyg-cell.lock.fade-step { animation: pyg-land 0.42s cubic-bezier(.34,1.42,.4,1) both; }
  @keyframes pyg-land { 0% { opacity: 0; transform: translateY(9px) scale(0.94); } 60% { opacity: 1; } 100% { opacity: 1; transform: translateY(0) scale(1); } }
  .pyg-cell.on .pyg-ic { display: inline-block; animation: pyg-pop 0.36s cubic-bezier(.34,1.6,.4,1) 0.16s both; }
  @keyframes pyg-pop { 0% { opacity: 0; transform: scale(0.4); } 100% { opacity: 1; transform: scale(1); } }
  /* Chiqqan bo'lak — poyga-yo'lida bo'g'in: ochilgan kataklar bir-biriga ulanadi.
     «Bir marta katta» yo'lagida 🔒 kataklar ulanmaydi — zanjir 6-haftagacha uzuq turadi. */
  .pyg-cell.on::after { content: ''; position: absolute; top: 50%; right: -6px; width: 6px; height: 3px; border-radius: 99px; background: ${T.success}; transform: translateY(-50%); animation: fade-step 0.3s ease-out 0.3s both; }
  .pyg-cells > .pyg-cell:last-child::after { display: none; }
  /* «Bilib oldi» belgisi: chiqqan har bo'lak odamlardan bitta xabar keltiradi.
     6 hafta oxirida 🧩 yo'lagida 6 ta, 🧱 yo'lagida 1 ta — xulosa-kartaning ko'rinishi. */
  .pyg-lane .pyg-cell.on::before { content: '🔎'; position: absolute; top: 4px; right: 5px; font-size: 10px; line-height: 1; opacity: 0.9; animation: pyg-know 0.4s cubic-bezier(.34,1.5,.4,1) 0.28s both; }
  @keyframes pyg-know { 0% { opacity: 0; transform: scale(0.3) rotate(-18deg); } 100% { opacity: 0.9; transform: scale(1) rotate(0); } }
  /* 🔒 «yasalmoqda» — xato emas, holat: sekin nafas oladi (qizil yo'q, kulrang) */
  .pyg-cell.lock .pyg-ic { animation: pyg-build 2.6s ease-in-out infinite; }
  @keyframes pyg-build { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) {
    .pyg-cell.on.fade-step, .pyg-cell.lock.fade-step, .pyg-cell.on .pyg-ic, .pyg-cell.lock .pyg-ic,
    .pyg-cell.on::after, .pyg-lane .pyg-cell.on::before { animation: none; opacity: 1; transform: none; }
    .pyg-cell.on::after { transform: translateY(-50%); }
    .pyg-lane .pyg-cell.on::before { opacity: 0.9; }
  }

  /* (b) BO'SH MAYDON YIG'ILDI — «flex-grow + max-height» naqshi (B2 pretsedenti):
     ekranda turgan asosiy sahna qolgan balandlikni CHEGARALI o'zlashtiradi.
     Matn, so'z kattaligi va tartib TEGILMAGAN; kartalar siqilmaydi (flex-shrink: 0). */
  @media (min-width: 861px) {
    /* s0 — ikki yo'l tanlovi afisha bo'lib turadi; javob-payoff ochilganda karta
       O'LCHAMI o'zgarmaydi (max-height cheklovi payoff joyini oldindan qoldiradi). */
    .screen > .hrow.two { flex-grow: 1; max-height: 216px; }
    .screen > .hrow.two .hopt { justify-content: center; }
    /* s1 — uch haftalik reja jonli yozilib chiqadigan karta */
    .screen > .s1demo { flex-grow: 1; max-height: 300px; justify-content: center; }
    /* s8 — yozish-ekrani: holat-paneli hujjat bo'lib cho'ziladi, hisob-qatori
       hujjat oyog'ida turadi. Muharrir-kartasi O'SMAYDI: yozayotgan bola uchun
       kiritish maydoni joyidan qimirlamasligi kerak (javob-qatori chiqqanda ham). */
    .screen > .split:not(.s4):not(.s9):not(.kod):not(.sum2) { flex-grow: 1; align-items: stretch; max-height: 424px; }
    .split:not(.s4):not(.s9):not(.kod):not(.sum2) > .col { min-height: 0; }
    /* Muharrir-kartasi «varaq» bo'lib cho'ziladi — matn TEPADA qoladi: javob-qatori
       chiqqanda kiritish maydoni joyidan qimirlamaydi. Yordam-chiplari esa ustunning
       oyog'iga tushadi — topshiriq-paneli tepada, yordam pastda. */
    .wsp-ed, .wsp-list { flex-grow: 1; }
    .split:not(.s4):not(.s9):not(.kod):not(.sum2) .wsxrow { margin-top: auto; }
    /* s9 — darvoza qolgan joyni to'ldiradi: uch hafta-uyasi baland nishon bo'ladi,
       nomzod-kartalari o'z ustunida teng tarqaladi (raundlar orasida SILJIMAYDI:
       har raundda doim uch nomzod). */
    .screen > .split.s9 { flex-grow: 1; align-items: stretch; max-height: 440px; }
    .split.s9 > .col { min-height: 0; }
    /* Nomzod-kartalari qolgan joyni bo'lishadi (chegarali) — bosish nishoni kattaroq,
       raundlar orasida joyi o'zgarmaydi (har raundda doim uch nomzod). */
    .split.s9 .nmz-opts { flex-grow: 1; justify-content: space-between; }
    .split.s9 .nmz-opt { flex: 1 1 auto; max-height: 86px; }
    .split.s9 .dvz { flex-grow: 1; }
    .split.s9 .dvz .dvz-lamps { margin-top: auto; }
    /* Hafta-uyalari darvozaning OYOG'IDA turadi — nishon aniq, bo'shliq tepaga tarqaladi */
    .split.s9 .dvz .pyg-cells.reja { flex-grow: 1; min-height: 96px; max-height: 148px; margin-top: auto; }
    /* s10 — ikki karta o'rtada turadi, lekin cheklangan balandlikda (margin auto
       qolgan bo'shliqni tepa-past teng bo'ladi) */
    .screen > .split.kod { flex-grow: 1; align-items: stretch; max-height: 320px; }
    /* Kod-darvozasi (1-bosqich) — ekrandagi yagona harakat, o'rtada va nafas bilan turadi */
    .screen > .cmt { flex-grow: 1; max-height: 250px; justify-content: center; }
    .screen > .cmt .gt-rows { gap: clamp(7px,1.4vh,13px); }
    /* PODIUM (s13) — bitta blok, o'zgarmaydi: ustunning o'rtasiga o'tiradi */
    .screen:has(.pod-solo) { justify-content: center; }
    /* Uy-vazifa kapsulasining nur-halqasi (::before, inset -16px) ekran tagidan
       chiqib ketmasin — 58-qonun sanog'ida 4px skroll bo'lib ko'rinardi. */
    .s-fin { padding-bottom: 10px; }
    .split.kod > .col { min-height: 0; }
    .split.kod .klaunch { flex-grow: 1; justify-content: center; }
    .split.kod .kdpanel { flex-grow: 1; }
    /* s4 — POYGA-TASMASI: sahna va natija-paneli o'z balandligini OLDINDAN egallaydi.
       Ikki foyda: (a) ekran ostida o'lik maydon qolmaydi; (b) hafta ochilganda kataklar
       va panel SAKRAMAYDI — bola o'zgargan faktga qaraydi, siljigan qutiga emas. */
    .screen > .pyg { flex-grow: 1; max-height: 230px; }
    .screen > .split.s4 { flex-grow: 1; align-items: stretch; max-height: 226px; }
    .split.s4 > .col { min-height: 0; }
    .split.s4 > .col:first-child { justify-content: center; }
    .split.s4 .pygd { flex-grow: 1; }
    /* s12 — ikki qadam kartasi (taymer ichida margin-top:auto bilan pastda qoladi) */
    .screen > .rcp-flow { flex-grow: 1; max-height: 360px; }
  }

  /* DARVOZA ICHIDAGI BO'SH HAFTA-UYASI — qorong'i yuzada ko'rinadigan qilindi.
     Oldin: 7% oq fon + 18% halqa (deyarli ko'rinmasdi). Endi: punktir uya + o'qiladigan
     yorliq. Bu KUTISH holati — qizil YO'Q, uya faqat «hali bo'sh» deb turadi. */
  .dvz .pyg-cell.wait { opacity: 1; background: rgba(255,255,255,0.06); border: 1.5px dashed rgba(255,255,255,0.34); box-shadow: none; }
  .dvz .pyg-cell.wait .pyg-w { color: rgba(255,255,255,0.82); }
  .dvz .pyg-cell.wait .pyg-ic { color: rgba(255,255,255,0.5); font-size: 20px; }
  /* Navbatdagi hafta-uyasi — nishonni aytadi (72-qonun: nima bosilsa, qayerga tushadi) */
  .dvz .pyg-cell.wait:first-child, .dvz .pyg-cell.on + .pyg-cell.wait { border-color: rgba(255,255,255,0.5); animation: dvz-slot 2.4s ease-in-out infinite; }
  @keyframes dvz-slot { 0%, 100% { background: rgba(255,255,255,0.06); } 50% { background: rgba(255,255,255,0.13); } }
  .dvz .pyg-cell.on { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
  @media (prefers-reduced-motion: reduce) { .dvz .pyg-cell.wait:first-child, .dvz .pyg-cell.on + .pyg-cell.wait { animation: none; background: rgba(255,255,255,0.11); } }

  /* KEYS-HISOBLAGICHI (s6) — oy-katagi o'qiladigan bo'ldi: katak kattaroq, bo'sh oy
     ko'rinadigan halqada, to'lgan oy accent-qutisi. Panel keys-slaydi bilan bir enda. */
  .kmy { gap: 6px; padding: 11px 20px; min-width: min(420px, 100%); }
  .kmy-oy { gap: 5px; }
  .kmy-c { width: 21px; height: 21px; border-radius: 7px; font-size: 11px; box-shadow: inset 0 0 0 1.5px ${T.ink3}55; }
  .kmy-c.on { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .kmy-val { letter-spacing: -0.01em; }

  /* 🔴 58-QONUN — PAST-DESKTOP TIER (1440×900 · 1280×800 da s4 poygasi skrollsiz).
     Faqat ichki oraliq/padding/ikkilamchi yorliq qisqaradi: MATN, tartib va ranglar
     TEGILMAGAN, hech bir karta siqilmaydi (60-qonun). Balandligi yetadigan ekranda
     (>=941px) dars aynan oldingi ko'rinishida qoladi. */
  @media (max-height: 940px) {
    .screen { gap: clamp(8px,1.1vw,10px) !important; }
    .mentor { gap: 10px; }
    .mentor-ava { width: 36px; height: 36px; }
    .mentor-msg { padding: 9px 14px; }
    .pyg { gap: 5px; padding: clamp(8px,1.3vw,11px); }
    .pyg-cell { min-height: 54px; gap: 2px; padding: 5px 5px; }
    .pyg-ic { font-size: 15px; }
    .pyg-nm { font-size: 10px; line-height: 1.2; }
    .pyg-w, .pyg-odam { font-size: 10px; }
    .pygc, .pygd { padding: clamp(10px,1.5vw,13px); }
    .pygc { gap: 7px; }
    .pygd { gap: 5px; }
    .pyg-btn { padding: 10px 19px; }
    .pygd-row { padding: 5px 9px; gap: 2px; }
    .pygd-row b { font-size: 12px; }
    .pygd-row i { font-size: 11.5px; line-height: 1.35; }
    .pygd-bildi { padding: 5px 9px; font-size: 11px; line-height: 1.35; }
    .xul { padding: clamp(11px,1.6vw,14px) clamp(13px,1.9vw,17px); gap: 4px; }
    .xul-h { font-size: clamp(15px,1.8vw,16.5px); line-height: 1.25; }
    .xul-b { font-size: clamp(12.5px,1.45vw,13.5px); line-height: 1.4; }
    .pyg-src { font-size: 10.5px; }
  }
  @media (max-height: 850px) {
    .stage-header { padding-top: clamp(9px,1.5vw,13px); padding-bottom: clamp(6px,1.2vw,9px); }
    .stage-nav { padding-top: clamp(9px,1.5vw,11px); padding-bottom: clamp(9px,1.5vw,11px); }
    .progress-track { margin-bottom: 8px; }
    .stage-content { padding-top: clamp(7px,1.2vw,10px); padding-bottom: clamp(10px,1.6vw,14px); }
    .screen { gap: clamp(7px,1vw,9px) !important; }
    .pyg-cell { min-height: 50px; }
    .pyg-nm { font-size: 9.5px; }
    .mentor-msg { padding: 8px 13px; }
    .mentor-ava { width: 32px; height: 32px; }
    .pygc-sub { font-size: 11.5px; }
    .pyg-ic { font-size: 14px; }
    .pyg-cell { gap: 1px; padding: 5px 4px; }
    .pygd-row i { font-size: 11px; }
    .pygd-bildi { font-size: 10.5px; padding: 4px 8px; }
    .xul { padding: 10px 13px; }
    .xul-h { font-size: clamp(14.5px,1.7vw,15.5px); }
    .h-title { font-size: clamp(20px,3vw,32px); }
    .mentor-msg .body, .mentor-msg { font-size: 14.5px; }
  }
  /* Uchinchi pog'ona — 1366×768 kabi past noutbuk ekrani (s4 shu yerda ham skrollsiz) */
  @media (max-height: 790px) {
    .stage-content { padding-bottom: clamp(9px,1.4vw,11px); }
    .pyg { gap: 4px; padding: 8px; }
    .pyg-cell { min-height: 44px; padding: 4px; }
    .pyg-src { font-size: 10px; }
    .pygd-row { padding: 4px 8px; }
    .pygd-bildi { padding: 4px 8px; font-size: 10px; }
    .xul { padding: 8px 12px; }
    .xul-b { font-size: 12.5px; }
    .mentor-msg { padding: 7px 12px; }
    .pygc { padding: 9px 11px; }
    .pyg-btn { padding: 9px 17px; }
  }
`;
// Mentor-panel, qayta tushuntirish, nishonlar, podium va CodeStrike arenasi (platforma mahsuloti).
const CSS_ARENA = `
  .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
  .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
  .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
  .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.ink}; color: #fff; border: none; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
  .mstats-reveal:hover { background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(91,61,230,0.5); }
  .mstats-reveal.ready { background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
  @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(91,61,230,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(91,61,230,0.55); } }
  .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
  .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.blue}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
  .mstats-prog-fill.full { background: ${T.success}; }
  .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
  .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
  .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
  .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
  .mstats-chip.okc  { background: ${T.successSoft}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.success}; }
  .mstats-chip.badc { background: ${T.errSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.err}; }
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
  .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.err}; background: ${T.errSoft}; border-radius: 10px; padding: 9px 12px; }
  .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
  @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
  .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
  .mstats-verdict.need { background: ${T.errSoft}; border-left: 4px solid ${T.err}; }
  .mstats-verdict.maybe { background: rgba(232,161,58,0.14); border-left: 4px solid #E8A13A; }
  .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
  .mstats-verdict.few { background: rgba(167,166,162,0.12); border-left: 4px solid ${T.ink3}; }
  .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
  .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); transition: all 0.2s; }
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
  .rc-btn.done { background: ${T.success}; color: #fff; }
  @media (max-width: 640px) { .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; } .rc-dots { width: 100%; order: -1; } }

  .ach-cnt-wrap { position: relative; }
  .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
  .ach-counter.has { border-color: ${T.accent}66; }
  .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(91,61,230,0.4); }
  .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
  .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
  .ach-cnt-ic { font-size: 14px; }
  .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
  @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); } }
  .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 232px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
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
  .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #F5F1FE); border: 1.5px solid ${T.accent}55; }
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
  .acu-name { font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: clamp(26px,5.5vw,42px); color: #fff; line-height: 1.1; text-shadow: 0 3px 22px rgba(0,0,0,0.55); animation: acu-rise 0.55s cubic-bezier(.3,1.2,.4,1) 0.45s both; }
  .acu-desc { font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,2vw,16px); color: rgba(255,255,255,0.82); max-width: 30ch; line-height: 1.5; animation: acu-rise 0.5s ease-out 0.6s both; }
  @keyframes acu-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  .acu-tap { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); margin-top: 4px; animation: acu-rise 0.5s ease-out 1.1s both, acu-blink 1.6s ease-in-out 1.6s infinite; }
  @keyframes acu-blink { 0%,100% { opacity: 0.5; } 50% { opacity: 0.85; } }
  @media (prefers-reduced-motion: reduce) { .acu-rays, .acu-medal, .acu-glow, .acu-tap { animation-iteration-count: 1 !important; } }

  .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
  .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; }
  @keyframes confetti-fall { 0% { transform: translateY(-24px) rotate(0deg); opacity: 0; } 8% { opacity: 1; } 55% { transform: translateY(48vh) translateX(22px) rotate(320deg); } 100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }

  .pod-stage { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px,2vw,20px); padding-top: 8px; }
  .pod-col { display: flex; flex-direction: column; align-items: center; gap: 5px; width: clamp(88px,22vw,150px); }
  .pod-medal { font-size: clamp(26px,4vw,38px); line-height: 1; }
  .pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: ${T.ink}; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pod-score { font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink2}; }
  .pod-bar { width: 100%; border-radius: 10px 10px 0 0; background: linear-gradient(180deg, ${T.accent}, ${T.accent}BB); box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); transform-origin: bottom; animation: pod-rise 0.85s cubic-bezier(.3,1.2,.4,1); }
  @keyframes pod-rise { from { transform: scaleY(0.06); opacity: 0.4; } to { transform: scaleY(1); opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .pod-bar { animation: none; } }
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
  .pod-dot.bad { background: ${T.err}; }
  .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
  .pod-row-time { min-width: 46px; text-align: right; font-size: 11.5px; color: ${T.ink3}; }
  .pod-solo { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
  .pod-solo-sec { background: ${T.paper}; border-radius: 14px; padding: 12px 18px; display: flex; flex-direction: column; align-items: center; gap: 8px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); }
  .pod-solo-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
  .pod-solo-badges { display: flex; gap: 9px; align-items: center; }
  .pod-solo-b { font-size: 24px; line-height: 1; }
  .pod-solo-b:not(.got) { filter: grayscale(1) opacity(0.45); font-size: 18px; }

  .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
  .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
  .cs-cta .cs-cap { padding: clamp(14px,2vw,24px) clamp(22px,3.2vw,40px); gap: clamp(4px,0.7vw,8px); }
  @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
  .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
    gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px;
    background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%);
    border: 1.5px solid rgba(186,140,255,0.72);
    box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32);
    animation: cs-ignite 1.5s ease-out both, cs-breathe 3.8s ease-in-out 1.5s infinite; }
  @keyframes cs-ignite { 0% { opacity: .22; filter: saturate(.25) brightness(.55); box-shadow: none; } 32% { opacity: .3; } 38% { opacity: 1; filter: none; } 44% { opacity: .38; } 51% { opacity: 1; filter: none; } 57% { opacity: .55; } 66%, 100% { opacity: 1; filter: none; } }
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
  .cs-word { position: relative; z-index: 2; display: inline-block; font-family: 'Manrope', sans-serif; font-weight: 900; font-style: italic; font-size: clamp(30px,6.2vw,72px); letter-spacing: .015em; line-height: 1.06; white-space: nowrap; padding-right: .06em; background: linear-gradient(180deg,#FFFFFF 10%,#E4D6FF 46%,#A97CFF 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: cs-wglow 2.8s ease-in-out infinite; }
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
  .cs-off { filter: saturate(.45) brightness(.74); }
  .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
  .cs-live { animation: cs-ignite 1.2s ease-out both, cs-breathe 1.7s ease-in-out 1.2s infinite; }
  .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
  .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
  @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
  .cs-charging { animation: cs-charge .45s ease-in forwards !important; }
  @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
  .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none; background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%); animation: cs-portal-in .9s ease-in-out both; }
  @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }
  @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-portal { animation: none !important; } }
  @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } }

  .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
  .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
  .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; color: rgba(203,173,255,0.16); }
  @keyframes qz-drift { 0%,100% { transform: translate(0,0) rotate(-6deg) scale(1); } 50% { transform: translate(18px,-24px) rotate(6deg) scale(1.05); } }
  @media (prefers-reduced-motion: reduce) { .qz-shp { animation: none; } }
  .qz-x { position: fixed; top: 14px; right: 16px; z-index: 10600; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(186,140,255,0.34); background: rgba(255,255,255,0.06); color: #D9C9FF; font-size: 16px; cursor: pointer; box-shadow: 0 0 20px rgba(124,58,237,0.22); transition: transform 0.25s, color 0.2s, background 0.2s; }
  .qz-x:hover { color: #F2ECFF; background: rgba(255,255,255,0.12); transform: rotate(90deg); }
  .qz-view { position: relative; z-index: 1; width: 100%; max-width: 820px; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,2.4vw,22px); margin: auto; }
  .qz-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(22px,4vw,36px); color: #F2ECFF; margin: 0; text-align: center; letter-spacing: -0.02em; text-shadow: 0 0 24px rgba(150,95,255,0.35); }
  .qz-sub { font-family: 'Manrope'; font-size: clamp(13px,1.9vw,16px); color: #B9A8E6; margin: 0; text-align: center; max-width: 540px; line-height: 1.55; font-weight: 500; }
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
  .qz-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(19px,3.2vw,28px); color: #F2ECFF; margin: 0; text-align: center; line-height: 1.35; background: rgba(255,255,255,0.05); border: 1px solid rgba(186,140,255,0.34); border-radius: 20px; padding: clamp(18px,2.8vw,28px) clamp(18px,3vw,30px); width: 100%; box-shadow: 0 0 34px rgba(124,58,237,0.28), inset 0 1px 0 rgba(255,255,255,0.06); text-wrap: balance; }
  .qz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(11px,1.6vw,15px); width: 100%; }
  @media (max-width: 560px) { .qz-grid { grid-template-columns: 1fr; } }
  .qz-tile { --gl: 255,255,255; position: relative; display: flex; align-items: center; gap: 14px; border: none; border-radius: 18px; padding: clamp(15px,2.4vw,22px) clamp(14px,2.2vw,20px); cursor: pointer; text-align: left; min-height: 66px; color: #fff; overflow: hidden; box-shadow: 0 10px 26px -12px rgba(0,0,0,0.55), 0 0 26px -4px rgba(var(--gl),0.42), inset 0 2px 0 rgba(255,255,255,0.32), inset 0 -4px 0 rgba(0,0,0,0.22), inset 0 0 0 1.5px rgba(0,0,0,0.24); transition: transform 0.14s, opacity 0.3s, box-shadow 0.14s, filter 0.2s; }
  .qz-grid .qz-tile:nth-child(1) { --gl: 255,90,44; }
  .qz-grid .qz-tile:nth-child(2) { --gl: 15,166,214; }
  .qz-grid .qz-tile:nth-child(3) { --gl: 245,166,35; }
  .qz-grid .qz-tile:nth-child(4) { --gl: 34,160,92; }
  .qz-tile:hover:not(:disabled):not(.rv) { transform: translateY(-3px); }
  .qz-tile:disabled { cursor: default; }
  .qz-shape { width: 38px; height: 38px; border-radius: 12px; background: rgba(255,255,255,0.22); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.35); display: flex; align-items: center; justify-content: center; font-size: clamp(16px,2.2vw,20px); color: #fff; flex-shrink: 0; }
  .qz-opt { flex: 1; min-width: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14px,2vw,17px); color: #fff; line-height: 1.35; letter-spacing: -0.01em; overflow-wrap: anywhere; }
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
  .qz-board { width: 100%; max-width: 480px; background: rgba(255,255,255,0.05); border: 1px solid rgba(186,140,255,0.32); border-radius: 18px; padding: 14px; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 0 32px rgba(124,58,237,0.25); }
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
  .qz-pod-col.p1 .qz-pod-bar { height: clamp(96px,14vw,156px); background: linear-gradient(180deg, #FFDE6B, #F5A623); }
  .qz-pod-col.p2 .qz-pod-bar { height: clamp(66px,10vw,110px); background: linear-gradient(180deg, #E4E7EE, #A2A8B4); }
  .qz-pod-col.p3 .qz-pod-bar { height: clamp(48px,7vw,82px); background: linear-gradient(180deg, #F4C08F, #CB8149); }
  .qz-pod-col.me .qz-pod-name { color: #3CE88E; }
  .qz-mypl { margin: 0; font-family: 'Manrope'; font-size: 15px; color: #B9A8E6; }
  .qz-mypl b { color: #3CE88E; }
  .qz-solo-res { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .qz-solo-pts { font-family: 'Manrope'; font-weight: 800; font-size: clamp(52px,9vw,84px); line-height: 1; color: #FF7A4D; text-shadow: 0 0 40px rgba(255,90,44,0.55); font-variant-numeric: tabular-nums; }
  .qz-endnote { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 10600; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; max-width: 94vw; background: rgba(27,15,63,0.86); border: 1px solid rgba(186,140,255,0.4); border-radius: 16px; padding: 10px 16px; color: #F2ECFF; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; box-shadow: 0 0 34px rgba(124,58,237,0.35); }
  .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
`;
// ============================================================ LESSON ROOT
export default function PmLesson17({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) {
    const p = progRead(LESSON_META.lessonId, TOTAL_SCREENS);
    if (p) {
      const li = LIVE_ENABLED ? liveRead(LESSON_META.lessonId) : null;
      if (li && li.mode === 'student' && typeof li.lastScreen === 'number')
        p.screen = Math.min(p.screen || 0, Math.max(0, li.lastScreen - 1));
    }
    savedRef.current = p;
  }
  const saved = savedRef.current;
  const [screen, setScreen] = useState(() => saved ? Math.min(Math.max(saved.screen || 0, 0), TOTAL_SCREENS - 1) : 0);
  const [answers, setAnswers] = useState(() => (saved && saved.answers) || {});
  const startTimeRef = useRef(saved?.startedAt || Date.now());
  const earnedRef = useRef(new Set(saved?.earned || []));
  const [earned, setEarned] = useState(() => new Set(saved?.earned || []));
  const [achToasts, setAchToasts] = useState([]);
  const achKeyRef = useRef(0);
  const earn = useCallback((id) => {
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts(t => [...t, { id, k: ++achKeyRef.current }]);
  }, []);
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));
  const recordAnswer = (idx, data) => {
    const nextA = { ...answers, [idx]: data };
    setAnswers(nextA);
    const _m = SCREEN_META[idx];
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]);
  };
  const reset = () => { progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned]);

  const finishLesson = () => {
    progClear(LESSON_META.lessonId);
    live.endSession();
    const scoredMeta = SCREEN_META.filter(s => s.scored);
    const finalMeta = scoredMeta.filter(s => s.scope === 'final');
    const scoredAnswers = SCREEN_META.map((s, i) => (s.scored ? answers[i] : null)).filter(Boolean);
    const correctAnswers = scoredAnswers.filter(a => a.correct).length;
    const finalAnswers = SCREEN_META.map((s, i) => (s.scored && s.scope === 'final' ? answers[i] : null)).filter(Boolean);
    const finalCorrect = finalAnswers.filter(a => a.correct).length;
    const payload = {
      lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scoredMeta.length, correctAnswers,
      scorePercent: scoredMeta.length ? Math.round((correctAnswers / scoredMeta.length) * 100) : 0,
      finalScore: finalCorrect, finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : (scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false),
      answers: SCREEN_META.map((s, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === 'function') onFinished(payload);
  };

  // Ekran-tartibi SCREEN_META bilan bir xil (16 ta)
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, ScreenCoding, ScreenFinalTest, ScreenReflection, ScreenPodium, ScreenFlashcards, ScreenSummary];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
        /* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        ${CSS_BASE}
        ${CSS_LESSON}
        ${CSS_ARENA}
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title="Bugungi dars" />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
            </>
          )}
        </div>
      </LiveGateCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>
  );
}
