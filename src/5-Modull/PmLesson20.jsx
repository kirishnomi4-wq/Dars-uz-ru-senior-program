import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM · M5-D8 — BOTINGIZNI ISHLATGAN ODAMDAN NIMANI SO'RAYSIZ?
// Senariy-manba: pm-senariylar/M5-D8-Custdev.md (GATE S yopilgan, 2026-08-18).
// Misol-ip: o'quvchining O'Z Telegram-boti (91/95/96c/108-qonun) — M5 da o'zi qurgan.
// Imzo-vizual: INTERVYU-STOLI (to'rt savol -> javob-pufagi -> bilingan-qatori; keyin
//   eshitganini varaqqa qaysi qator bilan yozish).
// Tekshiruv-mexanikasi: SAVOL-ELAK (ikki to'siq, uch natija-tugmasi).
// Bosh keys: K4 AIRBNB — faqat Nyu-York bo'lagi (o'sish to'xtadi -> uy-ma-uy -> surat).
// Kirish-artefakt: pm-m5d2-yigirmata (m5-02 · odamlar ro'yxati) — asosiy yo'l BOR,
//   zaxira tarmog'i JIM (yo'qlik haqida gap yozilmaydi, §69).
// Chiqish-artefakt: pm-m5d8-javoblar -> m5-11 (qaytish-kalendari) o'qiydi.
// INFRA MANBAI: src/4c-Modull/PmLesson18.jsx (jonli relslar, Stage, QuestionScreen,
//   MentorTestStats, RecapOverlay, PairTimer, ScreenPodium, CodeStrike-arena)
//   + src/4-Modull/PmLesson12.jsx (VS Code maketi) + PmLesson14 s8 DRAFT_KEY naqshi.
// KODING: VS Code-topshirig'i (26-qonun R1 navbati: m5-02 kompilyator -> m5-08 VS Code);
//   kod nusxalanmaydi, qo'lda yoziladi; matn-qiymatlari qo'shtirnoqda (§135).
// BIR TILLI (UZ): tarjima-yordamchisi yo'q; RU alohida sweep'da qo'shiladi.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================
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
      <p style={{ color: '#fff', opacity: 0.85, fontSize: 'clamp(15px,2.2vw,22px)', maxWidth: 640, margin: 'clamp(20px,4vw,36px) 0 0', lineHeight: 1.5 }}>Shu darsni o'z qurilmangizda oching → <b style={{ color: '#fff' }}>«Darsga qo'shilish»</b> oynasida bu kodni va ismingizni kiriting.</p>
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
const LESSON_META = { lessonId: 'pm-m5d8-v1', lessonTitle: { uz: "Botingizni ishlatgan odamdan nimani so'raysiz?" } };
// YAKUN-TUZILMASI ETALONDAN (P0 PmUserStory · PmLesson2 · PmLesson18):
// koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa BIR sahifada).
// Uy-vazifa va arena alohida ekran BO'LMAYDI — ikkovi ham yakun ichida.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom', scored: false, scope: 'hook' },        // 0  · BLOK 1
  { id: 's1',  type: 'rule',        template: 'custom', scored: false, scope: null },          // 1  · BLOK 2
  { id: 's2',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 2  · BLOK 3 teoriya-1
  { id: 's3',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 3  · TEST-1
  { id: 's4',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 4  · markaziy mexanika: suhbat stoli
  { id: 's5',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 5  · TEST-2
  { id: 's6',  type: 'case',        template: 'custom', scored: false, scope: null },          // 6  · biznes olamidan (K4)
  { id: 's7',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 7  · TEST-3
  { id: 's8',  type: 'practice',    template: 'custom', scored: false, scope: null },          // 8  · BLOK 4 yozish-ekrani
  { id: 's9',  type: 'practice',    template: 'custom', scored: false, scope: null },          // 9  · BLOK 5 tekshiruv (savol-elak)
  { id: 's10', type: 'koding',      template: 'custom', scored: false, scope: null },          // 10 · BLOK 6 VS Code
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
  s0: "Bola botini ko'rsatganda odam nima deyishini tanlaydi va ikkala javobdan ham nima qilish kerakligi bilinmasligini ko'radi",
  s1: "Bola dars oxirida uchta savol va uchta eshitgan javobdan yig'iladigan varaqni oldindan ko'radi",
  s2: "Bola stol ortida o'ylashni odamning oldiga borish bilan solishtiradi va suhbat nima ekanini biladi",
  s3: "Bola maqtov gapidan hech narsa bilinmasligini tanlaydi",
  s4: "Bola to'rt savolni birma-bir berib javoblarni eshitadi, keyin eshitganini varaqqa qaysi qator bilan yozishni tanlaydi",
  s5: "Bola hali qilinmagan ish haqidagi savolga va'da javob kelishini aniqlaydi",
  s6: "Bola Airbnb asoschilari javobni uy egalarining yonida topganini bashorat bilan ochadi",
  s7: "Bola asoschilar uy egalarining oldida nimani bilib olganini tanlaydi",
  s8: "Bola uchta savolini bittalab yozadi, odamga beradi va eshitgan javobini o'sha zahoti yozib oladi",
  s9: "Bola to'rt savolni elakdan o'tkazadi va har birini qaysi to'siq ushlab qolganini nomlaydi",
  s10: "Bola VS Code'da suhbat varag'ini chiqaradigan kodni yozadi va terminalda uch qatorni ko'radi",
  s11: "Bola suhbatdoshning gapidan varaqqa qaysi qator tushishini tanlaydi",
  s12: "Bola uchta savolini yoddan aytadi va bir qatorda yozib qoldiradi",
  s13: "Bola o'z natijasini (jonlida — sinf reytingini) ko'radi",
  s14: "Bola o'nta takrorlash kartasi bilan o'zini o'zi tekshiradi",
  s15: "Bola arenada bilimini tezlikda sinaydi, uy-vazifasini va nishonlarini bitta yakun-sahifada ko'radi"
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

// NAVBAT-BELGISI (88-qonun · 1-C.8 kod-shartnomasi — PmLesson2 manbasidan AYNAN).
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
// -1 = ishtirok-sentinel (baza: to'ldirgani = to'g'ri). Praktika zonasi: PRACTICE_BASE+screen.
const INLINE_KEYS = { s3: 1, s5: 0, s7: 2, s11: 1, stol: -1, javoblar: -1, elak: -1, koding: -1 };
// Har scored ekran uchun qayta-tushuntirish. Kalitlar = scored ekran INDEKSI (3/5/7/11).
const RECAPS = {
  3: {
    title: 'Javob odamning oldida',
    cards: [
      { ic: '🗣️', h: 'Suhbat nima', body: <>Odamning oldiga borib, <b>bo'lib o'tgan ishini so'rash</b> — suhbat. Suhbatda siz odamning fikrini emas, bo'lib o'tgan ishini so'raysiz.</> },
      { ic: '💭', h: 'Stol ortida', body: <>Stol ortida o'ylab topilgan javobni hech kim tasdiqlamaydi: tugmani qo'shasiz, lekin uni <b>hech kim bosmaydi</b>.</> },
      { ic: '🙋', h: 'Maqtov gapi', body: <>«Zo'r ekan» degan gapda odamning <b>o'zi qilgan biror ishi</b> yo'q — undan botga nima qo'shish kerakligi bilinmaydi.</>, ask: "Botingizni oxirgi marta kimga ko'rsatgandingiz?" }
    ]
  },
  5: {
    title: "Bo'lib o'tgan ishni so'rang",
    cards: [
      { ic: '📅', h: 'Voqea savoli', body: <>Bo'lib o'tgan ishni so'ragan savol — <b>voqea savoli</b>. Uning javobida kun ham, qilingan ish ham bo'ladi.</> },
      { ic: '⏳', h: "Hali bo'lmagan ish", body: <>Hali qilinmagan ish haqida odam faqat <b>va'da</b> beradi: «ha, ishlataman» — bundan hech narsa bilinmaydi.</> },
      { ic: '🕳️', h: "Bo'sh savol", body: <>Javobidan bo'lib o'tgan ish bilinmaydigan savol — <b>bo'sh savol</b>.</>, ask: "«Botim yoqdimi?» degan savolga sinfdoshingiz nima deydi?" }
    ]
  },
  7: {
    title: 'Javob odamning yonida topiladi',
    cards: [
      { ic: '✈️', h: 'Nyu-Yorkka borishdi', body: <>O'sish to'xtaganda Airbnb asoschilari javobni izlab Nyu-Yorkka jo'nashdi va u yerda <b>uy-ma-uy</b> yurishdi.</> },
      { ic: '📸', h: 'Nimani topishdi', body: <>Yomon surat qo'yilgan uyni <b>hech kim band qilmas ekan</b> — buni ular uy egalarining yonida turib bilishdi.</> },
      { ic: '🚶', h: 'Nega borishdi', body: <>Javob ularning stolida emas, <b>uy egalarining yonida</b> turgan edi.</>, ask: "Botingizni ishlatgan odam yoningizda o'tiribdimi?" }
    ]
  },
  11: {
    title: 'Eshitganingizni yozing',
    cards: [
      { ic: '📄', h: 'Varaqqa nima tushadi', body: <>Varaqqa <b>odamning o'z gapi</b> tushadi — uni o'zgartirmasdan yozib qo'yasiz.</> },
      { ic: '🤔', h: 'Nima tushmaydi', body: <>Sizning xulosangiz ham, bitta odamning gapidan chiqarilgan <b>umumiy gap</b> ham javob emas.</> },
      { ic: '✍️', h: 'Qachon yoziladi', body: <>Eshitgan javobni <b>o'sha zahoti</b> yozib olasiz — keyin gap boshqacha eslanadi.</>, ask: "Oxirgi eshitgan javobingizni so'zma-so'z ayta olasizmi?" }
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

// ===== 🛠️ JONLI PRAKTIKA javob-zonasi (500+) =====
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
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>Yuklanmoqda…</p>
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
// 🤖 DARS MA'LUMOTLARI — o'quvchining O'Z Telegram-boti (bitta misol-ip, 108-qonun)
// ============================================================
// KIRISH-ARTEFAKT (m5-02 chiqishi, bosh-agent muhri): { kanallar: [{ kanal, kim, nechta } × 3], savedAt }.
// Bu yerdan FAQAT odam-nomlari (`kim`) olinadi; `kanallar` — kod-kaliti, o'quvchi matnida u so'z YO'Q.
// §69 (jim zaxira): kalit bo'lmasa tasma render bo'lmaydi va yo'qlik haqida gap YOZILMAYDI.
const IN_KEY = 'pm-m5d2-yigirmata';
const ZAXIRA_KIM = 'sinfdosh';
const qisqart = (s, n = 20) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const readOdamlar = () => {
  try {
    const d = JSON.parse(localStorage.getItem(IN_KEY) || 'null');
    if (!d || typeof d !== 'object' || !Array.isArray(d.kanallar)) return null;
    const rows = d.kanallar
      .map(b => (b && typeof b === 'object' ? String(b.kim || '').trim() : (typeof b === 'string' ? b.trim() : '')))
      .filter(s => s.length >= 2)
      .map(s => qisqart(s));
    return rows.length ? rows.slice(0, 3) : null;
  } catch { return null; }
};
const suhbatdoshNomi = () => { const r = readOdamlar(); return (r && r[0]) || ZAXIRA_KIM; };

// Imzo-sahna: stol ortidagi suhbatdosh — hook ekranida ham, s4 stolida ham bir xil qiyofa.
const StolBar = ({ kim }) => (
  <div className="stolbar">
    <span className="stolbar-av" aria-hidden="true">👤</span>
    <span className="stolbar-nm">{kim}</span>
    <span className="stolbar-b">💬 · · ·</span>
  </div>
);

// ===== SCREEN 0 — HOOK: botingizni ko'rsatsangiz, u nima deydi? =====
// 104-qonun: ikki tanlov teng og'irlikda; payoff IKKALASIDA BIR XIL, maqtov yo'q.
const HOOK_OPTS = [
  { k: 'zor',      ic: '🙂', t: "«Zo'r ekan» deydi — meni xafa qilgisi kelmaydi" },
  { k: 'kamchilik', ic: '🤔', t: "Bir-ikki kamchilik aytadi — to'g'risini aytadi" },
];
// 100-qonun: tanlov yoziladi, hech qayerda O'QILMAYDI.
const HOOK_KEY = 'pm-m5d8-hook-choice';
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [kim] = useState(() => suhbatdoshNomi());
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
    <Stage eyebrow="Kirish · botingiz" screen={screen} navContent={<NavNext optionalLive turnBusy={picked === null && !isMentor} disabled={picked === null && !isMentor} label={opened ? 'Davom etish' : 'Bittasini tanlang'} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)', justifyContent: 'center' }}>
        <div className="head"><h2 className="title h-title fade-up">Botingizni ko'rsatsangiz, u <span className="italic" style={{ color: T.accent }}>nima</span> deydi?</h2></div>
        <Mentor>Botingizni yoningizdagi odamga ko'rsatdingiz.</Mentor>
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
            {/* IMZO-SAHNA: ikkala tanlovda ham BIR XIL sahna — stol ortidagi odam (104-qonun) */}
            <StolBar kim={kim} />
            <div className="frame-soft fade-step">
              <p className="body" style={{ margin: 0, color: T.ink }}>Ikkalasi ham bo'ladi. Lekin ikkala javob ham fikr — odam o'zi nima qilganini aytmadi, shuning uchun botga nima qo'shish kerakligi bilinmaydi. Bugun undan nimani so'rasangiz javobi ish berishini ko'rasiz.</p>
            </div>
          </>
        )}
        {/* Korpus §97: ovoz-diagrammasi FAQAT jonli darsda — yakka o'quvchida jamoa-murojaati yo'q */}
        {opened && isLive && counts && (
          <div className="hvote fade-step" aria-label="Sinf natijasi">
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
        <MentorNote>Ovozlar bo'linadi — ikkalasi ham halol javob. «Nima qo'shish kerakligi bilinmaydi» degan joyda to'xtang: bugungi dars aynan shu bo'shliqni to'ldiradi. Qanday so'rash kerakligini oldindan aytmang.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD: varaqning uch qatori o'z-o'zidan yozilib chiqadi (18-qonun) =====
// 🔴 Demo MATNSIZ: savol matni ham, javob matni ham s4/s8 kashfiyoti — bu yerda faqat shakl.
const DEMO_QATOR = [
  { ic: '🗣️', nom: '1-savol', why: 'odamning javobi' },
  { ic: '🗣️', nom: '2-savol', why: 'odamning javobi' },
  { ic: '🗣️', nom: '3-savol', why: 'odamning javobi' },
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow="Maqsad" screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label="Boshlaymiz →" onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">Dars oxirida sizda bitta <span className="italic" style={{ color: T.accent }}>varaq</span> bo'ladi.</h2></div>
      <Mentor>Pastdagi varaqqa qarang.</Mentor>
      <div className="s1demo">
        <span className="s1demo-lbl">📄 Suhbat varag'i</span>
        <div className="s1demo-list">
          {DEMO_QATOR.map((r, i) => (
            <span key={r.nom} className="s1row" style={{ '--dd': `${0.5 + i * 0.85}s` }}>
              <span className="s1row-ic" style={{ '--dd': `${0.5 + i * 0.85}s` }} aria-hidden="true">{r.ic}</span>
              <span className="s1row-t" style={{ '--dd': `${0.5 + i * 0.85}s` }}>{r.nom}</span>
              <span className="s1row-mark" style={{ '--dd2': `${0.95 + i * 0.85}s` }}>→</span>
              <span className="s1row-why" style={{ '--dd3': `${1.15 + i * 0.85}s` }}>{r.why} ✅</span>
            </span>
          ))}
        </div>
      </div>
      <div className="takeaway fade-up delay-2"><span className="ta-bulb">🎯</span><p className="ta-h">Dars oxirida sizda bitta varaq bo'ladi: uchta savol va odamdan eshitgan uchta javob.</p></div>
      <MentorNote>Varaq yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.</MentorNote>
    </div>
  </Stage>
);

// ===== SCREEN 2 — TEORIYA-1: stol ortida o'ylash ↔ odamning oldiga borish (46-qonun toggle) =====
const S2_CARDS = [
  { ic: '💭', h: 'Stol ortida',      b: "Botga qanday tugma kerakligini o'zingiz o'ylab topasiz. Tugma tayyor bo'ladi, lekin uni hech kim bosmaydi" },
  { ic: '🚶', h: 'Odamning oldida',  b: "Botni ishlatgan odamdan o'tgan hafta nima qilganini so'raysiz. Javobida kun ham, qilingan ish ham chiqadi" },
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
  // 400-belgi qoidasi: kartalar va xulosa BIR VAQTDA turmaydi — ikkala karta ko'rilgach
  // ekran xulosa-bosqichiga o'tadi; kartalarga qaytish tugmasi 46-qonun toggle'ini saqlaydi.
  const [faza, setFaza] = useState('kartalar');
  useEffect(() => {
    if (!allSeen) return;
    const t = setTimeout(() => setFaza('xulosa'), 700);
    return () => clearTimeout(t);
  }, [allSeen]);
  const xulosa = faza === 'xulosa' && allSeen;
  return (
    <Stage eyebrow="Muhokama · ikki yo'l" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!allSeen && !isMentor} disabled={!allSeen && !isMentor} label={allSeen || isMentor ? 'Davom etish' : `👆 Yana ${qoldi} kartani oching`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)', justifyContent: 'center' }}>
        <div className="head"><h2 className="title h-title fade-up">Botingizga nima kerakligini <span className="italic" style={{ color: T.accent }}>kim</span> biladi?</h2></div>
        <Mentor>Ikki kartani bosib solishtiring.</Mentor>
        {!xulosa && (
          <div className="dfc-grid fade-up delay-1">
            {S2_CARDS.map((c, i) => (
              <button key={c.h} type="button" className={`dfc${opened[i] ? ' open' : ''}${turnCls(lit, String(i), pend.length > 1)}`} onClick={() => toggle(i)}>
                <span className="dfc-top"><span className="dfc-ic">{c.ic}</span><span className="dfc-h">{c.h}</span></span>
                <span className="dfc-b">{opened[i] ? c.b : '· · ·'}</span>
              </button>
            ))}
          </div>
        )}
        {xulosa && (
          <>
            <div className="xul fade-step">
              <span className="xul-h">Odamning oldiga borib, bo'lib o'tgan ishini so'rash — suhbat deyiladi.</span>
              <p className="xul-b">Suhbatda siz odamning fikrini emas, bo'lib o'tgan ishini so'raysiz.</p>
            </div>
            <button type="button" className="nextsig" onClick={() => setFaza('kartalar')}>◂ Kartalarga qaytish</button>
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== TEST-EKRAN sarlavhasi (105-qonun: .h-ask) =====
const TestQ = ({ ask }) => <h2 className="title h-ask">{ask}</h2>;

const Screen3 = (props) => (
  <QuestionScreen {...props} eyebrow="Tekshiruv · maqtov gapi" scope="module-mikro"
    ctaLabel="Javobni tanlang" revealPrefix="To'g'ri javob"
    question={<TestQ ask="🗣 Sinfdoshingiz botingizni ko'rib «Zo'r ekan» dedi. Bundan nimani bilib oldingiz?" />}
    questionText="«Zo'r ekan» degan gapdan nimani bilib oldingiz"
    options={["Bot unga yoqqanini — endi shu yo'ldan ketaverasiz", 'Hech narsani — u qilgan biror ishini aytmadi', "Botni ishlatib ko'rganini — shuning uchun maqtadi"]}
    correctIdx={1}
    explainCorrect="To'g'ri — maqtov gapida odamning o'zi qilgan biror ish yo'q."
    explainWrong={{
      0: "Maqtov gapidan botga nima qo'shish kerakligi bilinmaydi — u qilgan ishini aytmadi.",
      2: "U botni ishlatganini aytmadi: maqtov gapida qilingan ish yo'q.",
      default: "Maqtov gapida odamning o'zi qilgan biror ish yo'q."
    }}
  />
);

// ===== SCREEN 4 — SUHBAT STOLI (markaziy mexanika, senariy 1-bo'limi) =====
// 1-bosqich: to'rt savolni birma-bir berish — javob gap-pufakda yozilib chiqadi, ostida bilingan-qatori.
// 2-bosqich: 3-javob so'zma-so'z qaytariladi va varaqqa qaysi qator tushishi tanlanadi.
// 🔴 Atama-tartibi (§104/§126): «voqea savoli», «bo'sh savol», «eshitgan javob» ikkala bosqichda
//    ham YO'Q — uchalasi YAKUN-KARTASIDA, ko'rilgan hodisadan keyin tug'iladi.
const STOL_KEY = 'pm-m5d8-stol';
const SAVOLLAR = [
  { id: 'q1', q: 'Botim yoqdimi?', a: "Ha, zo'r ekan!", bil: "Hech narsa bilinmadi — u qilgan biror ishini aytmadi", ok: false },
  { id: 'q2', q: "Botga eslatma tugmasi qo'shsam, ishlatasizmi?", a: 'Ha, ishlataman.', bil: "Bu hali qilinmagan ish — javobi va'da bo'ldi", ok: false },
  { id: 'q3', q: 'Uy vazifasini oxirgi marta qachon unutgansiz?', a: "O'tgan payshanba. Ertalab guruhni ochsam, vazifa kechqurun yozilgan ekan.", bil: "Payshanba kuni ham, o'sha kuni bo'lgan ish ham aytildi", ok: true },
  { id: 'q4', q: "O'sha kuni vazifani qanday topdingiz?", a: "Guruhdagi xabarlarni yuqoriga surib qidirdim, o'n daqiqa ketdi.", bil: "Vazifani hozir qanday topayotgani ko'rindi", ok: true },
];
const YOZUV = [
  { t: "Sinfdoshlarim vazifani ko'p unutadi", ok: false, fb: '🤔 Buni u aytmadi — bitta odam aytgan gapni hammaga yoydingiz' },
  { t: "Payshanba kuni vazifani unutgan — kechqurun yozilgan ekan", ok: true, fb: "✅ Aynan shu — odamning o'z gapi" },
  { t: 'Botga eslatma tugmasi kerak', ok: false, fb: '🤔 Bu sizning xulosangiz — u tugma haqida hech narsa demadi' },
];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [kim] = useState(() => suhbatdoshNomi());
  const [reduce] = useState(() => { try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch { return false; } });
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) { try { savedRef.current = JSON.parse(localStorage.getItem(STOL_KEY) || 'null') || {}; } catch { savedRef.current = {}; } }
  const st0 = savedRef.current;
  const [asked, setAsked] = useState(() => (Array.isArray(st0.asked) ? st0.asked.filter(i => i >= 0 && i < SAVOLLAR.length) : []));
  const [cur, setCur] = useState(() => (Array.isArray(st0.asked) && st0.asked.length ? st0.asked[st0.asked.length - 1] : null));
  const [typed, setTyped] = useState(() => 999);
  const [yozuv, setYozuv] = useState(() => (typeof st0.yozuv === 'number' ? st0.yozuv : null));
  const [sec, setSec] = useState(0);
  const javob = cur === null ? '' : SAVOLLAR[cur].a;
  const typing = cur !== null && typed < javob.length;
  // Javob gap-pufakda yozilib chiqadi (~1,2 s); prefers-reduced-motion'da darhol to'liq turadi.
  // Qayta kirganda (progress-saqlov) yozuv qaytadan chiqmaydi — javob darhol to'liq turadi.
  const mountedRef = useRef(false);
  useEffect(() => {
    if (cur === null) { mountedRef.current = true; return; }
    const full = SAVOLLAR[cur].a.length;
    if (reduce || !mountedRef.current) { mountedRef.current = true; setTyped(full); return; }
    setTyped(0);
    const step = Math.max(1, Math.ceil(full / 30));
    const id = setInterval(() => setTyped(v => { const n = v + step; if (n >= full) clearInterval(id); return Math.min(full, n); }), 40);
    return () => clearInterval(id);
  }, [cur, reduce]);
  const allAsked = asked.length === SAVOLLAR.length && !typing;
  const done = yozuv !== null && YOZUV[yozuv] && YOZUV[yozuv].ok;
  // 400-belgi qoidasi: ekran to'rt bosqichga bo'lindi — bir vaqtda faqat bittasi turadi.
  // so'rash (savol-kartalari + stol) → bilingan (to'rt qator birga) → yozuv (varaq-qatori) → xulosa.
  const [faza, setFaza] = useState(() => {
    const okYoz = typeof st0.yozuv === 'number' && YOZUV[st0.yozuv] && YOZUV[st0.yozuv].ok;
    if (okYoz) return 'xulosa';
    if (Array.isArray(st0.asked) && st0.asked.length === SAVOLLAR.length) return typeof st0.yozuv === 'number' ? 'yozuv' : 'bilingan';
    return 'sorash';
  });
  useEffect(() => { if (allAsked) setFaza(f => (f === 'sorash' ? 'bilingan' : f)); }, [allAsked]);
  useEffect(() => {
    if (!done) return undefined;
    const t = setTimeout(() => setFaza('xulosa'), 2500);
    return () => clearTimeout(t);
  }, [done]);
  useEffect(() => { try { localStorage.setItem(STOL_KEY, JSON.stringify({ asked, yozuv })); } catch {} }, [asked, yozuv]);
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'stol', screenIdx: screen, asked, yozuv, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'stol', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  useEffect(() => { if (allAsked || isMentor) return; const t = setInterval(() => setSec(s => s + 1), 1000); return () => clearInterval(t); }, [allAsked, isMentor]);
  const ber = (i) => { if (typing || asked.includes(i) || isMentor) return; setAsked(p => [...p, i]); setCur(i); };
  const tanla = (k) => { if (isMentor) return; setYozuv(k); };
  const pend = SAVOLLAR.map((_, i) => String(i)).filter(k => !asked.includes(Number(k)));
  const lit = useTurnWalk(pend, !typing && !allAsked && !isMentor);
  const rowWave = useTurnHint(faza === 'yozuv' && yozuv === null && !isMentor);
  const bilTurn = useTurnHint(faza === 'bilingan' && !isMentor);
  // Kashfiyot-himoyasi: javobni AYTMAYDIGAN ipucha (korpus §77), 45 soniyadan keyin.
  const tip = !allAsked && asked.length > 0 && sec >= 45;
  const navLabel = done || isMentor ? 'Davom etish'
    : faza === 'sorash' ? (asked.length === 0 ? '① Savol-kartasini bosing' : `① Yana ${SAVOLLAR.length - asked.length} savol bering`)
      : faza === 'bilingan' ? "② Bilingan qatorlarni o'qing"
        : '③ Varaqqa tushadigan qatorni tanlang';
  return (
    <Stage eyebrow="Suhbat stoli" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(9px,1.4vw,14px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Savolni tanlang va <span className="italic" style={{ color: T.accent }}>javobni</span> eshiting.</h2></div>
        {/* Mentor-pufak stol-bosqichlarida turadi; ipucha chiqqanda o'z o'rnini unga bo'shatadi */}
        {!tip && (faza === 'sorash' || faza === 'bilingan') && <Mentor>Stol ortida suhbatdosh o'tiribdi, chapda to'rt savol.</Mentor>}
        <div className="split">
          <Col gap={9}>
            {faza === 'sorash' && (
              <div className="qcards fade-up delay-1">
                {/* Berilgan savol ro'yxatdan chiqadi: javobi stolda turibdi, hisob stol-lentasida (400-belgi qoidasi) */}
                {SAVOLLAR.map((s, i) => (asked.includes(i) ? null : (
                  <button key={s.id} type="button" className={`qcard${turnCls(lit, String(i), pend.length > 1)}`} disabled={typing || isMentor} onClick={() => ber(i)}>
                    <span className="qcard-n mono">{i + 1}</span>
                    <span className="qcard-t">{s.q}</span>
                    <span className="qcard-m">▸</span>
                  </button>
                )))}
                {tip && <p className="bhint fade-step">🤔 Qolgan savollarni ham bering — javoblarni solishtiring.</p>}
              </div>
            )}
            {/* 2-bosqich «bilingan»: to'rt javobdan bilingan qatorlar birga qo'yiladi — solishtirish shu yerda */}
            {faza === 'bilingan' && (
              <div className="stol fade-step">
                <span className="stol-bar">🪑 Stol <b className="mono">Berilgan savol · {SAVOLLAR.length}/{SAVOLLAR.length}</b></span>
                <div className="bilgan">
                  {SAVOLLAR.map((s, i) => (
                    <span key={s.id} className={`bilgan-i${s.ok ? ' ok' : ''}`}><b className="mono">{i + 1})</b> {s.bil}</span>
                  ))}
                </div>
                <button type="button" className={`nextsig${bilTurn ? ' turn-ring' : ''}`} onClick={() => setFaza('yozuv')}>Keyingisi ▸</button>
              </div>
            )}
            {faza === 'yozuv' && (
              <div className="wq fade-step">
                <span className="wq-lbl">✓ To'rt savol berildi</span>
                <span className="wq-quote">💬 «{SAVOLLAR[2].a}»</span>
                <span className="wq-ask">Shu javobdan varaqqa qaysi qator tushadi?</span>
                <div className="wq-rows">
                  {YOZUV.map((r, k) => (
                    <button key={r.t} type="button" className={`wq-row${yozuv === k ? ' on' : ''}${yozuv !== null && r.ok ? ' ans' : ''}${yozuv === null ? waveCls(rowWave, k, YOZUV.length) : ''}`} disabled={isMentor} onClick={() => tanla(k)}>{r.t}</button>
                  ))}
                </div>
                {yozuv !== null && <p className={`sfb ${YOZUV[yozuv].ok ? 'ok' : 'ask'} fade-step`}>{YOZUV[yozuv].fb}</p>}
              </div>
            )}
            {/* Yakun-kartasi ochilganda chap ustundagi yozuv-bloki o'z o'rnini bo'shatadi (400-belgi qoidasi) */}
            {faza === 'xulosa' && (
              <div className="xul fade-step">
                <span className="xul-h">Bo'lib o'tgan ishni so'ragan savol — voqea savoli.</span>
                <p className="xul-b">Uning javobida kun ham, qilingan ish ham bo'ladi. Javobidan bo'lib o'tgan ish bilinmaydigan savol — bo'sh savol. Odam aytgan gapni o'z so'zi bilan yozib qo'ysangiz — bu eshitgan javob. Varaqqa sizning xulosangiz emas, o'sha eshitgan javob tushadi.</p>
              </div>
            )}
          </Col>
          <Col gap={9}>
            {faza === 'sorash' && (
              <div className="stol">
                <span className="stol-bar">🪑 Stol <b className="mono">Berilgan savol · {asked.length}/{SAVOLLAR.length}</b></span>
                <div className="stol-p">
                  <span className="stol-av" aria-hidden="true">👤</span>
                  <span className="stol-nm">{kim}</span>
                </div>
                <div className={`bubble${cur === null ? ' empty' : ''}`} key={cur === null ? 'x' : SAVOLLAR[cur].id}>
                  {cur === null ? '· · ·' : `«${javob.slice(0, typed)}»`}
                </div>
                {cur !== null && !typing && (
                  <div className="bilgan">
                    <span className={`bilgan-i${SAVOLLAR[cur].ok ? ' ok' : ''}`}><b className="mono">{cur + 1})</b> {SAVOLLAR[cur].bil}</span>
                  </div>
                )}
              </div>
            )}
            {done && <StudentPracticePulse live={live} screen={screen} />}
            <MentorPracticeStats live={live} screen={screen} label="🗣 To'rt savolni bergani" />
          </Col>
        </div>
        <MentorNote>Bolalar odatda 1-savoldan boshlaydi va «ha, zo'r» javobiga kuladi. To'rttasi ham berilgach so'rang: qaysi ikki javobdan payshanba kuni chiqdi? Farqni shu yerda ular aytsin, siz aytmang. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.</MentorNote>
      </div>
    </Stage>
  );
};

const Screen5 = (props) => (
  <QuestionScreen {...props} eyebrow="Tekshiruv · javob turi" scope="module-mikro"
    ctaLabel="Javobni tanlang" revealPrefix="To'g'ri javob"
    question={<TestQ ask="⏳ «Kelasi haftadan botni ishlatasizmi?» — bu savolga javob qanday bo'ladi?" />}
    questionText="«Kelasi haftadan botni ishlatasizmi?» savoliga javob qanday bo'ladi"
    options={["Hali qilmagan ishi haqida va'da bo'ladi", "O'tgan haftada qilgan ishi haqida gap bo'ladi", "Botni ochgan aniq kun va soat bo'ladi"]}
    correctIdx={0}
    explainCorrect="To'g'ri — hali bo'lmagan ish haqida odam faqat va'da bera oladi."
    explainWrong={{
      1: "Savol kelasi haftani so'rayapti — o'tgan haftada qilgan ishi bu javobdan chiqmaydi.",
      2: "Bunday savolga odam kun ham, soat ham aytmaydi: u faqat va'da beradi.",
      default: "Hali bo'lmagan ish haqida odam faqat va'da bera oladi."
    }}
  />
);

// ===== SCREEN 6 — BIZNES OLAMIDAN: 4 slayd + 2 bashorat + ko'prik (33/56/91b-qonun qolipi) =====
// 🔴 K-kodi ekranga CHIQMAYDI · raqamsiz keys: jonli son-hisoblagichi YO'Q.
// 🔴 Bosqich-hisoblagichi UZLUKSIZ: eyebrow har bosqichda «🏠 Biznes olamidan · n / 7».
// 🔴 Ko'prik-gap ALOHIDA bosqich (7/7) — darsga qaytaruvchi lahza (44-qonun).
const KEYS_STEPS = [
  { ic: '🏠', h: "2007-yil. San-Frantsiskoda katta yig'in bo'ldi, mehmonxonalarda joy qolmadi",
    body: <>Shunda Airbnb'ni boshlagan odamlar — asoschilar — o'z uyiga uchta havo to'shagi qo'yib, kelganlarga joy berishdi. Kompaniya shundan boshlandi.</> },
  { predict: { ask: "Saytga yangi odamlar qo'shilmay qolganda asoschilar nima qildi?", chips: [
      { ic: '🖱', t: "Saytga yangi tugma qo'shdi" },
      { ic: '✉️', t: 'Uy egalariga xat yozdi' },
      { ic: '✈️', t: "Nyu-Yorkka jo'nab ketdi" },
    ], ans: 2,
      hit: "🎯 Topdingiz! Nyu-Yorkka jo'nab ketdi",
      miss: "Adashdingiz — asl javob: Nyu-Yorkka jo'nab ketdi" } },
  { ic: '📉', h: "Keyinroq o'sish to'xtadi",
    body: <>Saytga yangi odamlar qo'shilmay qo'ydi. Asoschilar javobni izlab Nyu-Yorkka jo'nashdi.</> },
  { ic: '🚪', h: 'Nyu-Yorkda uy-ma-uy yurishdi',
    body: <>Uy egalarining oldiga kirib, uylarni o'zlari suratga olishdi.</> },
  { predict: { ask: "Uylarni ko'rib ular nimani topdi?", chips: [
      { ic: '💸', t: 'Uy egalari narxni oshirgan' },
      { ic: '📷', t: 'Suratlar yomon chiqqan' },
      { ic: '🐌', t: 'Sayt sekin ochilib qolgan' },
    ], ans: 1,
      hit: '🎯 Topdingiz! Suratlar yomon chiqqan',
      miss: 'Adashdingiz — asl javob: suratlar yomon chiqqan' } },
  { ic: '📸', h: "Shunda ma'lum bo'ldi",
    body: <>Suratlari yomon chiqqan uyga hech kim kelmas ekan — odamlar bunday uyni band qilmaydi. Buni ular uy egalarining yonida turib topishdi.</> },
  { ic: '🌉',
    body: <>Javob ularning stolida emas, uy egalarining yonida turgan edi. Sizning botingiz ham shunday: javob sizda emas, uni ishlatgan odamda. Endi shu odamga beradigan uchta savolni o'zingiz yozasiz.</> },
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gateK = useContext(LiveGateCtx) || {};
  const isMentorK = !!(gateK.live && gateK.live.mode === 'mentor');
  const steps = KEYS_STEPS;
  const [i, setI] = useState(0);
  const [bets, setBets] = useState({});
  const [maxSeen, setMaxSeen] = useState(0);
  useEffect(() => { setMaxSeen(m => Math.max(m, i)); }, [i]);
  const last = i === steps.length - 1;
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last]); // eslint-disable-line
  const c = steps[i];
  const bet = c.predict ? bets[i] : undefined;
  const betPending = !!(c.predict && bet === undefined);
  const betHint = useTurnHint(betPending && !isMentorK);
  const showSlide = !c.predict;
  return (
    <Stage eyebrow="🏠 Biznes olamidan" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={betPending && !isMentorK} disabled={betPending && !isMentorK} label={betPending && !isMentorK ? "Avval o'zingiz belgilang" : last ? 'Davom etish' : `Keyingi bosqich (${i + 1}/${steps.length})`} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Airbnb asoschilari javobni <span className="italic" style={{ color: T.accent }}>qayerdan</span> topdi?</h2></div>
        {c.predict && (
          <div className={`kp-bet fade-step${bet !== undefined ? ' answered' : ''}`} key={`b${i}`}>
            <span className="k-slide-eyebrow">{bet === undefined ? "🎲 Avval o'zingiz belgilab ko'ring" : '🏠 Biznes olamidan'} · {i + 1} / {steps.length}</span>
            <h3 className="k-slide-h">{c.predict.ask}</h3>
            <div className="kp-chips">
              {c.predict.chips.map((ch, k) => {
                const locked = bet !== undefined;
                const isAns = k === c.predict.ans;
                let cls = 'kp-chip';
                if (locked) { cls += ' locked'; if (isAns) cls += ' correct'; else if (bet === k && !isMentorK) cls += ' wrong'; }
                else cls += waveCls(betHint, k, c.predict.chips.length);
                return (
                  <button key={ch.t} className={cls} disabled={locked} onClick={() => setBets(p => ({ ...p, [i]: k }))}>
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
            <span className="k-slide-eyebrow">🏠 Biznes olamidan · {i + 1} / {steps.length}</span>
            <div className="k-slide-ic">{c.ic}</div>
            {c.h && <h3 className="k-slide-h">{c.h}</h3>}
            <p className="k-slide-body">{c.body}</p>
          </div>
        )}
        <div className="k-dots">{steps.map((_, k) => {
          const ochiq = k <= maxSeen && !(betPending && k > i);
          return <button key={k} className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} disabled={!ochiq} onClick={() => ochiq && setI(k)} aria-label={`${k + 1}-bosqich`} title={ochiq ? undefined : "Avval shu bosqichni tugating"} />;
        })}</div>
        <MentorNote>Bolalar «nega o'zlari surat olgan, suratchi yollashsa bo'lmasmidi?» deb so'raydi. Javob berib qo'ymang — so'rang: suratchi yuborilsa, asoschilar uy egasining gapini eshitarmidi?</MentorNote>
      </div>
    </Stage>
  );
};

const Screen7 = (props) => (
  <QuestionScreen {...props} eyebrow="Tekshiruv · uy egalarining oldida" scope="module-mikro"
    ctaLabel="Javobni tanlang" revealPrefix="To'g'ri javob"
    question={<TestQ ask="🏠 Airbnb asoschilari uy egalarining oldiga borib nimani bilib oldi?" />}
    questionText="Asoschilar uy egalarining oldiga borib nimani bilib oldi"
    options={["Uy egalari narxni juda baland qo'yib yuborganini", 'Uy egalari saytga kam kirib turishini', "Yomon surat qo'yilgan uy band qilinmasligini"]}
    correctIdx={2}
    explainCorrect="To'g'ri — buni ular uzoqdan emas, uy egalarining yonida turib bilishdi."
    explainWrong={{
      0: "Narx haqida hech narsa chiqmagan: ular uylarning suratlarini ko'rishdi.",
      1: "Uy egalari saytga qancha kirishi emas — yomon surat band qilishni to'xtatayotgani ma'lum bo'ldi.",
      default: "Yomon surat qo'yilgan uy band qilinmas ekan — buni ular joyida bilishdi."
    }}
  />
);

// ===== SCREEN 8 — YOZISH-EKRANI: uch savol va uch eshitgan javob (48/80/85/92/106d-qonun) =====
const OUT_KEY = 'pm-m5d8-javoblar';
const DRAFT_KEY = 'pm-m5d8-draft';   // yarim yozilgan holat «Orqaga»da yo'qolmaydi
const M_APO = "['\u02BB\u2019]";
const normS = (s) => String(s || '').toLowerCase().replace(new RegExp(M_APO, 'g'), "'").replace(/\s+/g, ' ').trim();
// Belgi-lug'ati (106d-c) — dars o'z so'zlaridan: bo'lgan ish · hali bo'lmagan ish · xulosa.
const VOQEA_RE = /(qachon|oxirgi marta|o'sha kuni|qanday qild|nima qild|qanday top|qanday ochd|necha marta)/;
const KELAJAK_RE = /(qo'shsam|bo'lsa|kelasi|keyin|ishlatasizmi|qilasizmi|bo'larmi)/;
const XULOSA_RE = /(kerak|muhim|yaxshi bo'lardi|qulay|zarur)/;
const endsMi = (n) => /(mi|misiz|midingiz|masiz|masizmi)\??$/.test(n.replace(/[.!\s]+$/, ''));
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [odamlar] = useState(() => readOdamlar());
  const draftRef = useRef(undefined);
  if (draftRef.current === undefined) { try { draftRef.current = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null') || {}; } catch { draftRef.current = {}; } }
  const d0 = draftRef.current;
  const [list, setList] = useState(() => (storedAnswer && Array.isArray(storedAnswer.javoblar)) ? storedAnswer.javoblar : (Array.isArray(d0.list) ? d0.list : []));
  const [savol, setSavol] = useState(() => (typeof d0.savol === 'string' ? d0.savol : ''));
  const [eshitgan, setEshitgan] = useState(() => (typeof d0.eshitgan === 'string' ? d0.eshitgan : ''));
  const [berildi, setBerildi] = useState(!!d0.berildi);
  const [edit, setEdit] = useState(null);
  const [focus, setFocus] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const done = list.length >= 3;
  const savedRef = useRef(false);
  const idx = edit === null ? Math.min(list.length, 2) : edit;
  const savolTxt = savol.trim();
  const eshTxt = eshitgan.trim();
  const nS = normS(savolTxt);
  const nE = normS(eshTxt);
  const savolOk = savolTxt.length >= 8;
  const kelajak = savolOk && KELAJAK_RE.test(nS);
  const yopiq = savolOk && !kelajak && endsMi(nS) && !VOQEA_RE.test(nS);
  const eshOk = eshTxt.length >= 8;
  const xulosa = eshOk && XULOSA_RE.test(nE);
  const canSave = savolOk && berildi && eshOk;
  const inputTurn = useTurnHint(berildi && !eshOk && !focus && !isMentor);
  useEffect(() => {
    if (!done || savedRef.current) return;
    savedRef.current = true;
    if (storedAnswer === undefined || !storedAnswer.solved) {
      onAnswer(screen, { stage: 'javoblar', screenIdx: screen, javoblar: list.slice(0, 3), solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'javoblar', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  useEffect(() => {
    if (!done) return;
    const payload = { javoblar: list.slice(0, 3).map(r => ({ savol: r.savol, eshitgan: r.eshitgan })), savedAt: Date.now() };
    try { localStorage.setItem(OUT_KEY, JSON.stringify(payload)); } catch {}
  }, [list, done]);
  useEffect(() => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ list, savol, eshitgan, berildi })); } catch {} }, [list, savol, eshitgan, berildi]);
  const save = () => {
    if (!canSave) return;
    const yozuv = { savol: savolTxt, eshitgan: eshTxt };
    setList(p => (edit === null ? [...p, yozuv] : p.map((r, k) => (k === edit ? yozuv : r))));
    setSavol(''); setEshitgan(''); setBerildi(false); setEdit(null);
  };
  const startEdit = (k) => { setEdit(k); setSavol(list[k].savol); setEshitgan(list[k].eshitgan); setBerildi(true); };
  const xulRef = useRef(null);
  useEffect(() => {
    if (!done || !xulRef.current) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const t = setTimeout(() => { if (xulRef.current) xulRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'nearest' }); }, 320);
    return () => clearTimeout(t);
  }, [done]);
  const navLabel = done || isMentor ? 'Davom etish' : list.length === 0 ? '① Birinchi savolingizni yozing' : `② Yana ${3 - list.length} savol qoldi`;
  const needTxt = !savolOk ? 'savol yozilmagan' : !berildi ? 'savol hali berilmagan' : !eshOk ? 'eshitgan javob yozilmagan' : '';
  const specOk = [
    list.length >= 3,
    list.length > 0 && list.every(r => !KELAJAK_RE.test(normS(r.savol))),
    list.length > 0 && list.every(r => !XULOSA_RE.test(normS(r.eshitgan))),
  ];
  return (
    <Stage eyebrow="Mustaqil ish · uch savol" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Uchta <span className="italic" style={{ color: T.accent }}>savolingizni</span> yozing.</h2></div>
        {/* 92b: kirish-artefakt bir qatorlik tasma — ish-maydoni emas, ko'prik */}
        {odamlar && (
          <div className="tasma fade-up">
            <span className="tasma-i">👥 Siz yozgan odamlar: {odamlar.join(' · ')}</span>
          </div>
        )}
        <Mentor>{odamlar
          ? "Tepadagi ro'yxatdan bitta odamni tanlang — uchta savolni o'shanga berasiz."
          : "Yoningizdagi odamlardan birini tanlang — uchta savolni o'shanga berasiz."}</Mentor>
        {/* 80a: havoda uch doira — nechanchi savolda ekaningiz shu yerda ko'rinadi */}
        <div className="stps fade-up">
          {[1, 2, 3].map((n, k) => (
            <span key={n} className={`stp ${list.length > k ? 'done' : idx === k ? 'on' : ''}`}><i>{list.length > k ? '✓' : n}</i>{n}-savol</span>
          ))}
        </div>
        <div className="split">
          <Col gap={9}>
            {(!done || edit !== null) && (
              <div className="wsp-ed">
                <span className="wsp-ed-h">{idx + 1}-savol</span>
                {!berildi ? (
                  <>
                    <input className={`reflect-input${savolOk ? ' filled' : ''}`} value={savol} maxLength={140}
                      placeholder="Nimani so'raysiz?"
                      onChange={e => setSavol(e.target.value)} />
                    {kelajak && <p className="sfb ask">🤔 Bu ish hali bo'lmagan — javobi va'da bo'ladi. Allaqachon bo'lgan kunni so'rang.</p>}
                    {yopiq && <p className="sfb ask">🤔 Bunga odam «ha» deb qo'ya qoladi. Bo'lib o'tgan ishni so'rang: oxirgi marta qachon?</p>}
                    <button type="button" className="wsp-save" disabled={!savolOk} onClick={() => setBerildi(true)}>🗣 Savolni o'qib bering</button>
                  </>
                ) : (
                  <>
                    {/* 92e: savol o'qish holatiga o'tdi — tahrir ✎ ortida */}
                    <div className="wq-read">
                      <span className="wq-read-t">{savolTxt}</span>
                      <button type="button" className="wsp-item-edit" title="Tahrirlash" onClick={() => setBerildi(false)}>✎</button>
                    </div>
                    <input className={`reflect-input${inputTurn ? ' await' : ''}${eshOk ? ' filled' : ''}`} value={eshitgan} maxLength={200}
                      placeholder="U nima dedi?"
                      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                      onChange={e => setEshitgan(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') save(); }} />
                    {/* 106d: ikki tomonlama javob — bloklamaydi, yo'naltiradi */}
                    {xulosa && <p className="sfb ask">🤔 Bu sizning xulosangiz. Odam aytgan gapni o'z so'zi bilan yozing.</p>}
                    {eshOk && !xulosa && !kelajak && !yopiq && <p className="sfb ok">✅ Savolingiz bo'lib o'tgan ishni so'radi, javobda odamning o'z gapi turibdi.</p>}
                    <div className="wsp-saverow">
                      <button type="button" className="wsp-save" disabled={!canSave} onClick={save}>{edit === null ? '✓ Saqlash' : '✓ Yangilash'}</button>
                      {!canSave && needTxt && <span className="wsp-need">{needTxt}</span>}
                    </div>
                  </>
                )}
              </div>
            )}
            {/* 80c: yozilganlar yozish paytida ko'rinmaydi; uchtasi tayyor bo'lgach varaq ochiladi */}
            {done && edit === null && (
              <div className="wsp-list fade-step" ref={xulRef}>
                <span className="wsp-list-h">📄 Suhbat varag'ingiz</span>
                {list.slice(0, 3).map((r, k) => (
                  <span key={k} className="wsp-item">
                    <span className="wsp-item-m mono">{k + 1}</span>
                    <span className="wsp-item-t">{r.savol} → «{r.eshitgan}»</span>
                    <button type="button" className="wsp-item-edit" title="Tahrirlash" onClick={() => startEdit(k)}>✎</button>
                  </span>
                ))}
              </div>
            )}
          </Col>
          <Col gap={9}>
            <div className="wsp-task">
              <span className="wsp-task-lbl">🎯 Topshiriq</span>
              {[1, 2, 3].map((n, k) => (
                <span key={n} className={`wsp-task-row${list.length > k ? ' done' : ''}`}>
                  <span>🗣 {n}-savol va eshitgan javob</span>
                  {list[k] && <span className="wsp-task-m" aria-hidden="true">✓</span>}
                </span>
              ))}
              <div className="spec">
                {['Uch savol yozilgan', "Savol bo'lib o'tgan ishni so'raydi", "Har javob odamning o'z gapi"].map((t, k) => (
                  <span key={t} className={`spec-c${specOk[k] ? ' ok' : ''}`}>{specOk[k] ? '✓' : '○'} {t}</span>
                ))}
              </div>
              {/* 106c-b: holat ko'rsatkichi */}
              <span className="wsp-task-n mono">3 tadan {Math.min(list.length, 3)} tasi yozildi</span>
            </div>
            <div className="wsxrow">
              <div className={`wsx ${yordamOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>💡 Yordam {yordamOpen ? '▾' : '▸'}</button>
                {yordamOpen && <div className="wsx-body"><p>Savolingizni «Oxirgi marta qachon …?» yoki «O'sha kuni qanday qildingiz?» deb boshlang.</p><p>Bu ish allaqachon bo'lganmi? Bu gapni odam aytdimi, siz chiqardingizmi?</p></div>}
              </div>
              <div className={`wsx star ${starOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setStarOpen(o => !o)}>⭐ Qo'shimcha {starOpen ? '▾' : '▸'}</button>
                {starOpen && <div className="wsx-body"><p>Uch javobingizni qayta o'qing: ikkitasida bir xil narsa takrorlanganmi? Topganingizni ovoz chiqarib ayting.</p></div>}
              </div>
            </div>
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label="✍️ Uch javobni yozganlar" />
          </Col>
        </div>
        {done && edit === null && <div className="done-mini fade-step">✅ Uch savolingiz varaqda <span className="dm-sub">— har birining yonida eshitgan javob turibdi</span></div>}
        <MentorNote>«Yoqdimi?», «Kerakmi?» kabi savollar ko'p chiqadi — eng foydali xato. Javob-qatori uni tutadi; siz 1-savol javobini eslating: «Ha, zo'r ekan». Juftlik almashinuvini o'zingiz boshqaring — har o'quvchiga 3 daqiqadan. Baholash-mezoni: uch savol bo'lib o'tgan ishni so'raydi · har javobda odamning o'z gapi bor. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEKSHIRUV: SAVOL-ELAK (26-qonun: yangi mexanika) =====
// Hech narsa baholanmaydi va o'chirilmaydi — o'quvchi savolni QAYSI TO'SIQ ushlab qolganini nomlaydi.
const ELAK_KEY = 'pm-m5d8-elak';
const TOSIQLAR = [
  { k: 'hali',   ic: '⏳', t: "Ish hali bo'lmagan" },
  { k: 'ichida', ic: '🗣️', t: 'Javob savolning ichida' },
  { k: 'otdi',   ic: '⬇️', t: "O'tdi — varaqqa" },
];
const ELAK_SAVOL = [
  { id: 'e1', t: 'Botni oxirgi marta qachon ochgansiz?', yol: 'otdi', sabab: "Bo'lib o'tgan kun so'raldi — odam kunni o'zi aytadi" },
  { id: 'e2', t: "Botga o'yin qo'shsam, ko'proq ishlatasizmi?", yol: 'hali', sabab: "Bu o'yin hali qo'shilmagan — javobi va'da bo'ladi" },
  { id: 'e3', t: 'Guruhda vazifani topish qiyin, shundaymi?', yol: 'ichida', sabab: "Javob savolda yozib qo'yilgan — odam «ha» deb qo'ya qoladi" },
  { id: 'e4', t: "O'sha kuni vazifani qanday topdingiz?", yol: 'otdi', sabab: "Bo'lib o'tgan ish so'raldi — odam qadamlarini o'zi aytadi" },
];
const ELAK_TUZAT = {
  otdi: "🤔 Hech bir to'siq ushlamadi — savol varaqqa tushdi",
  hali: "🤔 Ish hali bo'lmagan — savol shu to'siqda qoldi",
  ichida: "🤔 Javobi savolning ichida — savol shu to'siqda qoldi",
};
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [tanlov, setTanlov] = useState(() => (storedAnswer && storedAnswer.tanlov) || {});
  const [i, setI] = useState(() => {
    const t = (storedAnswer && storedAnswer.tanlov) || {};
    const k = ELAK_SAVOL.findIndex(s => !t[s.id]);
    return k < 0 ? ELAK_SAVOL.length - 1 : k;
  });
  const [missedOnce, setMissedOnce] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const n = Object.keys(tanlov).length;
  const done = n === ELAK_SAVOL.length;
  const cur = ELAK_SAVOL[i];
  const pick = tanlov[cur.id];
  const togri = pick === cur.yol;
  useEffect(() => { try { localStorage.setItem(ELAK_KEY, JSON.stringify({ elak: tanlov })); } catch {} }, [tanlov]);
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      // §133: nishon TO'G'RI javobga emas, to'rt qarorning bajarilishiga beriladi (senariy 10-bo'lim).
      const hammasi = ELAK_SAVOL.every(s => tanlov[s.id] === s.yol);
      onAnswer(screen, { stage: 'elak', screenIdx: screen, tanlov, hammasi, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'elak', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const tanla = (k) => {
    if (pick || isMentor) return;
    if (k !== cur.yol) setMissedOnce(true);
    setTanlov(p => ({ ...p, [cur.id]: k }));
  };
  // Tuzatish-qatori va sabab BIR VAQTDA, tanlov bosilishi bilan darhol chiqadi (kechikish yo'q):
  // asl javobni olib yuruvchi qator o'chib ketmasin — s9 ning eng to'liq holati 259 belgi (chegara 400).
  // To'rtinchi sabab o'qilgach elak-kartasi yopiladi va natija-lentasi uning o'rnini egallaydi.
  const [yakun, setYakun] = useState(() => Object.keys((storedAnswer && storedAnswer.tanlov) || {}).length === ELAK_SAVOL.length);
  useEffect(() => {
    if (!done) return undefined;
    const t = setTimeout(() => setYakun(true), 2200);
    return () => clearTimeout(t);
  }, [done]);
  const yolTurn = useTurnHint(!pick && !isMentor);
  const nextTurn = useTurnHint(!!pick && i < ELAK_SAVOL.length - 1);
  const xulRef = useRef(null);
  useEffect(() => {
    if (!done || !xulRef.current) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const t = setTimeout(() => { if (xulRef.current) xulRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'nearest' }); }, 320);
    return () => clearTimeout(t);
  }, [done]);
  const navLabel = done || isMentor ? 'Davom etish' : n === 0 ? '① Birinchi savolni elakka tashlang' : `② Yana ${ELAK_SAVOL.length - n} savol qoldi`;
  return (
    <Stage eyebrow="Tekshiruv · savol-elak" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(9px,1.4vw,14px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Har savolni <span className="italic" style={{ color: T.accent }}>elakdan</span> o'tkazing.</h2></div>
        <Mentor>Uch savolingiz varaqda tayyor — endi to'rt yangi savolni sinaymiz.</Mentor>
        {/* Yo'riqnoma birinchi qaror qabul qilingunicha turadi — keyin mexanika ma'lum, o'rni javob-qatoriga bo'shaydi */}
        {n === 0 && <p className="task-line fade-up delay-1">Har savol elakka tushadi: uni ushlab qolgan to'siqni tanlang. Hech biri ushlamasa — «O'tdi» ni bosing.</p>}
        <div className="split">
          <Col gap={9}>
            {!yakun && <div className={`elak${!pick ? ' wait' : ''}`}>
              <span className="elak-bar"><i className="elak-ic" aria-hidden="true">🕳️</i> Elakdagi savol <b className="mono">{Math.min(n + (pick ? 0 : 1), ELAK_SAVOL.length)} / {ELAK_SAVOL.length}</b></span>
              <div className={`elak-body${pick ? (cur.yol === 'otdi' ? ' fall' : ' hold') : ''}`} key={cur.id}>
                {cur.t}
              </div>
              <div className="elakbtns">
                {TOSIQLAR.map((y, k) => (
                  <button key={y.k} type="button" className={`elakb elakb-${y.k}${pick === y.k ? ' on' : ''}${pick && y.k === cur.yol ? ' ans' : ''}${!pick ? waveCls(yolTurn, k, TOSIQLAR.length) : ''}`} disabled={!!pick || isMentor} onClick={() => tanla(y.k)}>
                    <span className="elakb-ic">{y.ic}</span><span className="elakb-t">{y.t}</span>
                  </button>
                ))}
              </div>
              {pick && (
                <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {!togri && <p className="sfb ask">{ELAK_TUZAT[cur.yol]}</p>}
                  <p className={`sfb ${togri ? 'ok' : 'ask'}`}>{togri ? '✅' : '📄'} {cur.sabab}</p>
                  {i < ELAK_SAVOL.length - 1 && <button type="button" className={`nextsig${nextTurn ? ' turn-ring' : ''}`} onClick={() => setI(i + 1)}>Keyingisi ▸</button>}
                </div>
              )}
            </div>}
            {/* Yakun-bosqichi: elak-kartasi o'z o'rnini natija-lentasiga bo'shatadi (400-belgi qoidasi) */}
            {yakun && (
              <div className="bdone fade-step" ref={xulRef}>
                <div className="strip">
                  {ELAK_SAVOL.map((s, k) => (
                    <span key={s.id} className={`strip-i${tanlov[s.id] === s.yol ? ' ok' : ''}`} style={{ '--i': k }}>
                      <b className="mono">{k + 1}</b> {s.yol === 'otdi' ? '⬇️ varaqqa' : s.yol === 'hali' ? "⏳ to'siqda" : "🗣 to'siqda"}
                    </span>
                  ))}
                </div>
                <span className="done-mini">✅ Elakdan faqat bo'lib o'tgan ishni so'ragan savol o'tadi <span className="dm-sub">— qolgan savollarga odam bir og'iz «ha» deb qo'ya qoladi</span></span>
              </div>
            )}
          </Col>
          <Col gap={9}>
            {/* YORDAM ekran boshida turmaydi — faqat birinchi xatodan keyin ochiladi */}
            {missedOnce && !done && (
              <div className={`wsx ${yordamOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>💡 Yordam {yordamOpen ? '▾' : '▸'}</button>
                {yordamOpen && <div className="wsx-body"><p>Savol so'ragan ish hali bo'lmagan bo'lsa — elak uni ushlab qoladi.</p><p>Javobni savolning o'zi aytib tursa, odam faqat «ha» deydi — elak uni ham ushlaydi.</p></div>}
              </div>
            )}
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label="🕳 To'rt savolni o'tkazganlar" />
          </Col>
        </div>
        <MentorNote>Eng ko'p adashiladigan joy — 3-savol: «vazifa topish qiyin, bu to'g'ri aytilgan». Ikkinchi savolni eslating: javobni savolning o'zi aytib turibdimi? Ha — demak odam faqat «ha» deydi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — KODING: VS Code-topshirig'i (26/82/87-qonun · R1 navbati) =====
// Kod NUSXALANMAYDI (82d): qo'lda yozganda o'rganiladi.
// 🔴 §135: matn-qiymatlari QO'SHTIRNOQDA — o'quvchi javobidagi apostrof kodni sindirmasin.
const KODING_KEY = 'pm-m5d8-code';
const readKoding = () => { try { const v = JSON.parse(localStorage.getItem(KODING_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
// Darvoza-mashq (82e): bitta savol — uchala variant ham bir turdagi natija-gapi.
const GATE_OPTS = [
  { t: 'Birinchi yozuvdagi savol matni', ok: true },
  { t: 'Uchala yozuvdagi savollar ketma-ket' },
  { t: 'Birinchi yozuvdagi javob matni' },
];
const KOD_MATN = `// suhbat.js — suhbat varag'i
const javoblar = [
  { savol: "Uy vazifasini oxirgi marta qachon unutgansiz?",
    eshitgan: "O'tgan payshanba, ertalab guruhni ochsam yozilgan ekan" },
  { savol: "", eshitgan: "" },
  { savol: "", eshitgan: "" },
];

for (let i = 0; i < javoblar.length; i++) {
  const j = javoblar[i];

  // 1) har qatorni chiqaring:
  //    console.log((i + 1) + ") " + j.savol + "  ->  " + j.eshitgan);
  // 2) j.eshitgan.length 25 dan kichik bo'lsa, yana bir qator chiqaring:
  //    "   qisqa javob — bo'lib o'tgan ish ko'rinmayapti"
}`;
const JS_TOKEN = /(\/\/[^\n]*|"[^"]*"|\b(?:const|let|for|if|else|return)\b|\b\d+\b)/g;
const jsHl = (ln) => ln.split(JS_TOKEN).filter(p => p !== undefined && p !== '').map((p, i) => {
  if (p.startsWith('//')) return <span key={i} style={{ color: '#6A9955' }}>{p}</span>;
  if (p.startsWith('"')) return <span key={i} style={{ color: '#CE9178' }}>{p}</span>;
  if (/^(const|let|for|if|else|return)$/.test(p)) return <span key={i} style={{ color: '#C586C0' }}>{p}</span>;
  if (/^\d+$/.test(p)) return <span key={i} style={{ color: '#B5CEA8' }}>{p}</span>;
  return <span key={i}>{p}</span>;
});
const KD_SHART = [
  <><code className="qcode">node suhbat.js</code> uch qatorni chiqaradi</>,
  <>Har qatorda savol va javobi</>,
  <>Qisqa javobga belgi qo'yildi</>,
];
const ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const isSelf = !live || live.mode === 'self';
  const [saved] = useState(() => readKoding());
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved) || !!(saved && saved.done));
  const [gateOk, setGateOk] = useState(!!(saved && saved.gateOk));
  const [miss, setMiss] = useState(null);
  const [missedOnce, setMissedOnce] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const missT = useRef(null);
  useEffect(() => () => clearTimeout(missT.current), []);
  const stage2 = gateOk || isMentor || done;
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const pickGate = (i) => {
    if (stage2) return;
    if (GATE_OPTS[i].ok) {
      setGateOk(true);
      try { localStorage.setItem(KODING_KEY, JSON.stringify({ ...(readKoding() || {}), gateOk: true })); } catch {}
    } else {
      setMiss(i);
      setMissedOnce(true);
      clearTimeout(missT.current);
      missT.current = setTimeout(() => setMiss(null), 600);
    }
  };
  const complete = () => {
    if (done) return;
    setDone(true);
    try { localStorage.setItem(KODING_KEY, JSON.stringify({ ...(readKoding() || {}), gateOk: true, done: true })); } catch {}
  };
  const lines = KOD_MATN.split('\n');
  const doneTurn = useTurnHint(stage2 && !done && !isMentor);
  const navLabel = done || isMentor ? 'Davom etish' : !stage2 ? '🔒 Avval kod-savolini yeching' : '② Kodni yozing va tugmani bosing';
  return (
    <Stage eyebrow="Koding · ⌨️ VS Code" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.5vw,15px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Suhbat varag'ini chiqaradigan <span className="italic" style={{ color: T.accent }}>kod</span> yozamiz.</h2></div>
        {!stage2 ? (
          <>
            <Mentor>Avval bitta savol — keyin kod yoziladi.</Mentor>
            <div className="cmt hunt">
              <span className="cmt-lbl">🔎 Kod <code className="qcode">javoblar[0].savol</code> ni chiqarsa, terminalda nima ko'rinadi?</span>
              <div className="gt-btns col3">
                {GATE_OPTS.map((g, i) => (
                  <button key={g.t} type="button" className={`gt-b${miss === i ? ' miss' : ''}`} onClick={() => pickGate(i)}>{g.t}</button>
                ))}
              </div>
              {missedOnce && <p className="cmt-tip">🤔 Ikki bo'lakni alohida o'qing: <b>javoblar[0]</b> — birinchi yozuv, <b>.savol</b> — o'sha yozuvning savol bo'lagi.</p>}
            </div>
          </>
        ) : (
          <>
            <Mentor>Uch javobingiz endi kodda turadi. Siz bitta takrorlash-sikli va bitta if-sharti yozasiz.</Mentor>
            <div className="cmt-fold fade-step"><span className="cmt-done">✓ javoblar[0].savol — birinchi savol matni</span></div>
            <div className="split">
              <Col gap={10}>
                <div className={`kdpanel${done ? ' is-done' : ''}`}>
                  <p className="flow-label">Kod nima chiqarsin</p>
                  <ol className="kdreq">{KD_SHART.map((sh, i) => <li key={i}>{sh}</li>)}</ol>
                  <div className={`wsx star ${yordamOpen ? 'open' : ''}`}>
                    <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>💡 Yordam {yordamOpen ? '▾' : '▸'}</button>
                    {yordamOpen && <div className="wsx-body">
                      <p>Kodni <b>node</b> buyrug'i bilan ilgari ham yurgizgansiz — pastdagi qora oynaga <b>node suhbat.js</b> deb yozasiz.</p>
                      <p>Avval bitta qatorni chiqarib ko'ring: <b>javoblar[0].savol</b>. Ishlagach siklni, keyin <b>if</b> ni qo'shing.</p>
                      <p>Javob matnini doim qo'shtirnoq ichida yozing: bitta tirnoq ichidagi apostrof kodni sindiradi.</p>
                      <p>⭐ Qo'shimcha: qisqa javoblarni sanab boring va oxirida bitta qatorda chiqaring: «n ta javob qisqa».</p>
                    </div>}
                  </div>
                  <button className={`lp-done-btn ${done ? 'is-done' : ''}${!done && doneTurn ? ' turn-ring' : ''}`} disabled={done} onClick={done ? undefined : complete}>
                    {done ? '✓ Bajarildi' : '✅ Yozdim — uch qator chiqdi'}
                  </button>
                  {done && <div className="done-mini fade-step">✅ Suhbat varag'ingiz kodda chiqdi <span className="dm-sub">— qisqa javobga belgi qo'yildi</span></div>}
                  {!done && isSelf && (
                    <button className="kd-skip" onClick={onNext}>✓ Bu mashqni sinfda bajarganman — davom etish →</button>
                  )}
                </div>
                <StudentPracticePulse live={live} screen={screen} />
                <MentorPracticeStats live={live} screen={screen} label="⌨️ Kodni yozib bo'lganlar" />
              </Col>
              <Col gap={10}>
                <div className="vsc no-copy" onCopy={e => e.preventDefault()} onCut={e => e.preventDefault()} onPaste={e => e.preventDefault()} onContextMenu={e => e.preventDefault()}>
                  <div className="vsc-bar">
                    <span className="vsc-tab on"><span style={{ color: '#4FC1FF' }}>⌨️</span> suhbat.js</span>
                    <span className="vsc-lock" title="Kod nusxalanmaydi — o'zingiz terib yozasiz">🔒 qo'lda yoziladi</span>
                  </div>
                  <div className="vsc-body">
                    {lines.map((ln, i) => (
                      <div key={i} className="vsc-line"><span className="vsc-ln">{i + 1}</span><span className="vsc-code">{ln ? jsHl(ln) : ' '}</span></div>
                    ))}
                  </div>
                  <div className="term">
                    <span className="term-l mono"><b>$</b> node suhbat.js</span>
                    <span className="term-c" aria-hidden="true" />
                  </div>
                </div>
                <p className="bhint">🔒 Kodni VS Code (kod yoziladigan dastur)da qo'lda yozasiz — nusxalab bo'lmaydi.</p>
              </Col>
            </div>
          </>
        )}
        <MentorNote>Javoblari hali to'liq yozilmagan bolalar boshlang'ich koddagi namuna qatorni qoldiradi — kod baribir ishlaydi. Javob matnini doim qo'shtirnoq ichida yozishni ayting. Kod 10 daqiqada yoziladi; ulgurmaganlar uyga qisqa variantni oladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.</MentorNote>
      </div>
    </Stage>
  );
};
// ===== SCREEN 12 — RECAP: 2 qadam (ayting + yozing) =====
const REFLECT_KEY = 'pm-m5d8-reflection';
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
        <div className="head"><h2 className="title h-title fade-up">Uchta savolingizni <span className="italic" style={{ color: T.accent }}>yoddan</span> ayta olasizmi?</h2></div>
        <Mentor>Ekranga qaramasdan ayting: qaysi savolingizdan eng aniq javob keldi va o'sha javobda nima bor edi?</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">🗣 {yakka ? "Ovoz chiqarib o'zingizga ayting: savol va javob" : 'Sherigingizga ayting: savol va javob'}</span></div></div>
            <PairTimer onStage={setPairStage} muted={written} solo={yakka} />
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">✍️ Endi bir qator yozing</span></div></div>
            <span className={`turn-wrap${inputTurn ? ' turn-ring' : ''}`}>
              <input className="reflect-input" value={text} onChange={e => save(e.target.value)} onFocus={() => setReflFocus(true)} onBlur={() => setReflFocus(false)} placeholder="Eng aniq javob ... savolimdan keldi, unda ..." maxLength={160} />
            </span>
            {/* 106f(b): yozib bo'lgach mukofot — bitta tabrik-gap va bitta qoida-qatori */}
            {written && (
              <div className="rwd fade-step">
                <p className="rwd-t">✓ Endi siz odam nima deydi deb o'ylab o'tirmaysiz — borib so'raysiz.</p>
                <span className="rwd-rule">🎯 Bugungi qoida: bo'lib o'tgan ishni so'rang, eshitganingizni o'z so'zi bilan yozing</span>
              </div>
            )}
          </div>
        </div>
        <MentorNote>Uchdan biri «javobda nima bor edi» savoliga javob berolmasa — suhbat stoli ekranini qayta oching va 3-savol javobini birga o'qing.</MentorNote>
      </div>
    </Stage>
  );
};
// ===== SCREEN 14 — FLASHCARD (10 karta · mentorsiz, 99a-qonun) =====
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
            <div className="fc-face fc-front"><span className="fc-q">{fmtCode(card.front)}</span><span className="fc-cue">Javobni o'ylang 🤔 <span className="fc-tap">bosing</span></span></div>
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
  { front: 'Suhbat nima?', back: "Odamning oldiga borib, bo'lib o'tgan ishini so'rash" },
  { front: 'Voqea savoli nima?', back: "Bo'lib o'tgan ishni so'ragan savol" },
  { front: "Bo'sh savol nima?", back: "Javobidan bo'lib o'tgan ish bilinmaydigan savol" },
  { front: "Voqea savoliga javobda nima bo'ladi?", back: 'Kun, joy yoki qilingan ish' },
  { front: "«Botim yoqdimi?» — qanday savol?", back: "Bo'sh savol: javobida qilingan ish qolmaydi" },
  { front: "Hali qilinmagan ish haqida so'rasangiz, javob qanday bo'ladi?", back: "Va'da bo'ladi — bunday ish hali bo'lmagan" },
  { front: 'Varaqqa nima yoziladi?', back: "Odam aytgan gap, uning o'z so'zi bilan" },
  { front: 'Varaqqa nima yozilmaydi?', back: 'Sizning xulosangiz va bitta odamning gapidan chiqarilgan umumiy gap' },
  { front: 'Airbnb asoschilari uy egalarining oldida nimani bilib oldi?', back: "Yomon surat qo'yilgan uy band qilinmasligini" },
  { front: 'Suhbatni kimdan boshlaysiz?', back: "Botingizni ishlatgan odamdan: sinfdosh, to'garakdosh yoki qo'shni" },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow="Takrorlash" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label="Davom etish" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</h2></div>
        <div className="fc-center"><Flashcards cards={FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

const ScreenFinalTest = (props) => (
  <QuestionScreen {...props} eyebrow="Yakuniy tekshiruv" scope="final"
    ctaLabel="Javobni tanlang" revealPrefix="To'g'ri javob"
    question={<><div className="qquote fade-up">💬 Suhbatdosh: «Kecha kechqurun botni ochdim, lekin tugmani topolmay chiqib ketdim.»</div><TestQ ask="📝 Qaysi qator varaqqa tushadi?" /></>}
    questionText="Suhbatdoshning gapidan qaysi qator varaqqa tushadi"
    options={['Botning tugmalarini qayta joylash kerak', 'Kecha tugmani topolmay chiqib ketgan', 'Odamlar kecha tugmani topa olmadi']}
    correctIdx={1}
    explainCorrect="To'g'ri — varaqqa odamning o'z gapi tushadi; nima qilish kerakligini keyin o'zingiz hal qilasiz."
    explainWrong={{
      0: "Bu sizning xulosangiz — u tugmalarni qayta joylash haqida hech narsa demadi.",
      2: "U o'zi haqida gapirdi: bitta odam aytgan gap hammaga yoyilmaydi.",
      default: "Varaqqa odamning o'z gapi tushadi."
    }}
  />
);

// ===== UYGA VAZIFA — alohida ekran EMAS, YAKUN sahifasi ichida (etalon: P0 · PmLesson2) =====
const HW_KEY = 'pm-m5d8-hw-target';
const HW_VARIANT = [
  { k: 'toliq', t: "To'liq · ~20 daqiqa" },
  { k: 'qisqa', t: 'Qisqa · ~10 daqiqa' },
];
const HW_STEPS = {
  toliq: ['Uch savolingizni yangi odamlarga bering', "Har javobni odamning o'z so'zi bilan o'sha zahoti yozib oling", "Ikki varaqni yonma-yon qo'ying va takrorlangan bitta gapni belgilang"],
  qisqa: ['Uch savolingizni yana bitta odamga bering', "Eshitganingizni o'z so'zi bilan yozib oling", 'Sinfdagi javoblar bilan solishtirib, takrorlangan bitta gapni belgilang'],
};
const readHwTarget = () => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } };
// Uy-vazifa kapsulasi fonidagi xira so'z-tokenlar — dars atamalari (CodeStrike cs-sky oilasi)
const HW_TOKENS = [
  { t: 'suhbat',  l: 5,  tp: 16, s: 12, d: 6.5 },
  { t: 'savol',   l: 80, tp: 12, s: 11, d: 7.5 },
  { t: 'javob',   l: 12, tp: 70, s: 11, d: 8 },
  { t: 'varaq',   l: 64, tp: 76, s: 12, d: 6 },
  { t: 'odam',    l: 86, tp: 52, s: 10, d: 9 },
  { t: '🗣',       l: 36, tp: 8,  s: 12, d: 7 },
  { t: '📄',       l: 3,  tp: 44, s: 12, d: 8.5 },
];
const HwCard = ({ variant, onPick }) => {
  const steps = HW_STEPS[variant] || HW_STEPS.toliq;
  const pickTurn = useTurnHint(!variant && !!onPick);
  return (
    <div className="card fade-step">
      <div className="card-lbl" style={{ color: T.accent }}>📝 Uyda nima qilasiz?</div>
      <p className="body" style={{ margin: '0 0 10px', color: T.ink }}>Uyda o'sha uch savolni yana boshqa odamlarga berasiz va eshitganingizni o'sha zahoti yozib olasiz. Keyin ikki varaqni yonma-yon qo'yib, takrorlangan gapni topasiz. Qaysi variantni olishni o'zingiz tanlaysiz.</p>
      <div className="hw-chips">
        {HW_VARIANT.map((v, vi) => (
          <button key={v.k} className={`hw-chip ${variant === v.k ? 'on' : ''}${waveCls(pickTurn, vi, HW_VARIANT.length)}`} onClick={() => onPick(v.k)}>{v.t}</button>
        ))}
      </div>
      {variant ? (
        <div className="pmtask fade-step">
          <div className="pmtask-head"><span className="pmtask-tag">🗂 Topshiriq kartasi</span><span className="pmtask-id">{variant === 'qisqa' ? 'QISQA' : "TO'LIQ"}</span></div>
          <div className="pmtask-rows">
            <div className="pmtask-row"><span className="pmtask-k">Kimga berasiz</span><span className="pmtask-v"><b>{variant === 'qisqa' ? 'bitta odam' : 'ikki odam'}</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">Muddat</span><span className="pmtask-v"><b>keyingi darsgacha</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">Odam topolmasangiz</span><span className="pmtask-v"><b>sinfdagi boshqa juftlikdan so'rang</b></span></div>
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
  goodListener: { icon: '👂', name: 'Good Listener!', desc: "To'rt javobni oxirigacha eshitdingiz" },
  noteTaker:    { icon: '📝', name: 'Note Taker!',    desc: 'Uch savol va uch javobni yozdingiz' },
  sharpSifter:  { icon: '🚧', name: 'Sharp Sifter!',  desc: "To'rt savolning to'sig'ini tanladingiz" },
  sheetMaker:   { icon: '📄', name: 'Sheet Maker!',   desc: "Suhbat varag'ini kod bilan chiqardingiz" },
};
const ACH_TRIGGERS = { s4: 'goodListener', s8: 'noteTaker', s9: 'sharpSifter', s10: 'sheetMaker' };
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
const Q_LABELS = { 3: '1 — Maqtov gapi', 5: '2 — Javob turi', 7: '3 — Uy egalarining oldida', 11: '4 — Varaqqa qaysi qator' };
const QUIZ_MS = 15000;
// §114: arena-fon so'zlari SHU darsning lug'atidan.
const QZ_BG_SHAPES = [
  { ch: 'suhbat',  l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: 'savol',   l: 85, t: 8,  s: 28, d: 23, dl: 1.5 },
  { ch: 'javob',   l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'varaq',   l: 74, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: 'odam',    l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: 'kun',     l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: 'bot',     l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: 'elak',    l: 55, t: 5,  s: 20, d: 22, dl: 0.6 },
  { ch: '🗣',       l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '📄',       l: 16, t: 52, s: 28, d: 26, dl: 2.6 },
  { ch: '✍️',       l: 2,  t: 30, s: 30, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike — 12 savol · 3/3/3/3 · to'g'ri indekslar 0,3,2,1 · 1,0,2,3 · 0,2,1,3.
// darslik-jonli TASDIQLAYDI. Har savol darsda AYTILGAN ekranga bog'langan (65-qonun).
const QUIZ_BANK = [
  { q: 'Suhbat nima?', opts: ["Odamning oldiga borib, bo'lib o'tgan ishini so'rash", "Bo'lib o'tgan ishni odamsiz, o'zingiz taxmin qilish", "Kelasi haftada nima qilishini oldindan so'rash", "Botingizni ko'rsatib, u haqdagi fikrini so'rash"], correct: 0 },
  { q: "Suhbatda nima so'raladi?", opts: ["Bo'lib o'tgan ishga odam qo'ygan bahosi", 'Odamning kelasi hafta rejasi', 'Odamning bot haqidagi fikri', "Odamning bo'lib o'tgan ishi"], correct: 3 },
  { q: 'Voqea savoli nima?', opts: ["Bo'lib o'tgan ishni emas, kelajakni so'ragan savol", "Botga qanday tugma kerakligini so'ragan savol", "Bo'lib o'tgan ishni so'ragan savol", "Javobi «ha» bo'lib qoladigan savol"], correct: 2 },
  { q: "Bo'sh savol nima?", opts: ["Javobida bo'lib o'tgan ish juda ko'p aytiladigan savol", "Javobidan bo'lib o'tgan ish bilinmaydigan savol", 'Suhbatning oxirida beriladigan savol', 'Bir kunda ikki marta berilgan savol'], correct: 1 },
  // §107: ikki qiymatli olam — 2/2 yoziladi, farq SABABda qoladi.
  { q: '«Botim yoqdimi?» — bu qanday savol?', opts: ['Voqea savoli — botni tilga olgan savol', "Bo'sh savol — qilgan ish so'ralmadi", "Bo'sh savol — savol juda qisqa", "Voqea savoli — javobi bir og'iz"], correct: 1 },
  { q: '«Oxirgi marta qachon unutgansiz?» — bu qanday savol?', opts: ["Voqea savoli — bo'lgan kunni so'radi", "Voqea savoli — javobi «ha» bo'lib qoladi", "Bo'sh savol — kelajakni so'radi", "Bo'sh savol — botni tilga olmadi"], correct: 0 },
  { q: 'Suhbatdosh «Ha, ishlataman» dedi — bundan nima bilinadi?', opts: ['U botni har kuni ochib turgani', 'U eslatma tugmasini bosgani', "Hech narsa — bu ish hali bo'lmagan", 'U vazifani payshanba unutgani'], correct: 2 },
  { q: 'Varaqqa qaysi gap tushadi?', opts: ['Siz chiqargan xulosa', "Botga kerak bo'lgan tugmalar ro'yxati", 'Hammaga taalluqli umumiy gap', "Odam aytgan gap, uning o'z so'zi bilan"], correct: 3 },
  { q: "Airbnb asoschilari o'sish to'xtaganda qayerga bordi?", opts: ['Nyu-Yorkka — uy egalarining oldiga', "San-Frantsiskodagi yig'inga", "Mehmonxonalarga — joy so'rashga", "Hech qayerga — saytni o'zgartirishdi"], correct: 0 },
  { q: 'Ular uy egalarining oldida nimani bilib oldi?', opts: ["Uy egalari narxni baland qo'yganini", 'Uy egalari saytga kam kirishini', "Yomon surat qo'yilgan uy band qilinmasligini", "Uy egalari surat olishni bilmasligini"], correct: 2 },
  { q: 'Suhbatni kimdan boshlaysiz?', opts: ['Bot haqida eshitmagan odamdan', 'Botingizni ishlatgan odamdan', "Eng ko'p kitob o'qigan odamdan", 'Botni yozishga yordam bergan odamdan'], correct: 1 },
  { q: 'Bir odam aytgan gapni varaqqa qanday yozasiz?', opts: ["«Hamma shunday deydi» deb yozib qo'yaman", "Qisqartirib, o'z xulosam bilan yozaman", 'Yozmayman — esimda qoladi', "Uning o'z so'zi bilan, o'zgartirmasdan"], correct: 3 },
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

// ===== ⚔️ CODESTRIKE ARENA — javob zonasi: 100+ =====
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
    const TOK = ['suhbat', 'savol', 'javob', 'varaq', 'odam', 'kun', 'bot', 'elak', '🗣', '📄'];
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
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruhning natijalar ro'yxati va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi.</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>Natijalar yuklanmoqda…</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>Bu darsga hali hech kim qo'shilmagan.</p></div>
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
              <div className="card-lbl" style={{ color: T.accent }}>🏆 Natijalar ro'yxati</div>
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
// Tuzilma etalondan: hero (h-sub YO'Q) -> CodeStrike -> «Endi siz bilasiz» -> uy-vazifa -> nishonlar.
const ScreenSummary = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const live = _gate.live;
  const isMentorL = !!(live && live.mode === 'mentor');
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const RECAP = [
    "Odamning oldiga borib, bo'lib o'tgan ishini so'rash — suhbat.",
    "Bo'lib o'tgan ishni so'ragan savol — voqea savoli.",
    "Javobidan bo'lib o'tgan ish bilinmaydigan savol — bo'sh savol.",
    "Varaqqa odamning o'z gapi tushadi, sizning xulosangiz emas.",
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
  const [charge, setCharge] = useState(false);
  const fireHw = () => { if (charge || hwOpen) return; setCharge(true); setTimeout(() => { setHwOpen(true); setCharge(false); }, 500); };
  // 58-qonun: karta oqimga qo'shilsa yakun-ekrani ~500px skroll bo'lardi. Avto-skroll — yamoq;
  // shuning uchun karta VARAQ bo'lib yakun ustiga qo'yiladi (.hw-sheet) — skroll 0, ✕ bilan olinadi.

  const recapCard = (
    <div className="card fade-up d3">
      <div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> Endi siz bilasiz</div>
      <ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul>
    </div>
  );
  return (
    <Stage eyebrow="Dars yakuni" screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Qaytadan</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Yakunlash ✓</button></>}>
      <div className={`screen${hwOpen ? ' hw-on' : ''}`} style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="hero">
          <div className="hero-l">
            <span className="done-chip fade-up"><span className="tick">✓</span> Dars tugadi</span>
            <h2 className="title h-title fade-up d1">Uchta savol berdingiz va <span className="italic" style={{ color: T.accent }}>eshitganingizni</span> yozdingiz.</h2>
          </div>
          {!isMentorL && <ScoreRing correct={correct} total={total} />}
        </div>
        {/* 103-qonun: darsni bitta gap yopadi */}
        <div className="bigidea fade-up d2"><span className="bigidea-lbl">Bugungi asosiy fikr —</span><p className="bigidea-t">Javob sizda emas: uni botingizni ishlatgan odam biladi.</p></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? '⏳ Mentorni kuting' : undefined} />
        </div>
        {arena && <QuizArena live={live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        {/* «Endi siz bilasiz» va nishonlar yonma-yon (58-qonun) */}
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
        {hwOpen && (
          <div className="hw-sheet" role="dialog" aria-label="Uyga vazifa">
            <div className="hw-sheet-paper">
              <button type="button" className="hw-sheet-x" onClick={() => setHwOpen(false)} aria-label="Yopish" title="Yopish">✕</button>
              <HwCard variant={hwVariant} onPick={pickHw} />
            </div>
          </div>
        )}
        <MentorNote>Arena tugagach g'oliblarni nomlab tabriklang. Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa. Tekshirishda bitta savolga qarang: yozilgan javobda odamning o'z gapi turibdimi — kun, joy yoki qilingan ish bormi?</MentorNote>
      </div>
    </Stage>
  );
};
const CSS_BASE = `
  html, body { margin: 0; padding: 0; }
  .lesson-root, .lesson-root * { box-sizing: border-box; }
  .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
  /* Reset: <p> uchun FAQAT margin nollanadi. Ilgari padding ham nollanardi va u element-selektor
     bo'lgani uchun klass-paddinglarni (.sfb/.bhint/.cmt-tip/.kdreq li) yeb qo'yardi —
     javob-qatorlari fon ichida siqilib turardi. Ro'yxatlarda padding nollanishi kerak (40px odat). */
  .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p { margin: 0; }
  .lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }

  .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
  .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
  .mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
  .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; }
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
  /* 27-qonun: to'g'ri variant sahifa-qatori kabi «joyiga o'tiradi» — dars mexanikasining sadosi. */
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
  /* O'ng ustun hali BO'SH bo'lsa (topshiriq/yordam ochilmagan) — chap karta sahnaning
     o'rtasida turadi: sahna bo'sh yarim ekran bilan qolmaydi. Ustun to'lganda yumshoq o'tadi. */
  .split { transition: grid-template-columns 0.4s cubic-bezier(.4,0,.2,1); }
  .split:has(> .col:last-child:empty) { grid-template-columns: minmax(0,1fr); }
  @media (max-width: 860px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
  @media (prefers-reduced-motion: reduce) { .split { transition: none; } }

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
  /* Chip matni uzun bo'lsa oddiy matn kabi yangi qatorga o'tadi (inline-flex ilgari uni ikki
     bo'lakka yorib, izohni satr o'rtasidan boshlab yuborardi). */
  .done-mini { display: inline-block; line-height: 1.5; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; min-width: 0; overflow-wrap: anywhere; }
  .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
  .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
`;
// Dars-vizuallari: suhbat stoli (imzo-vizual), savol-elak, yozish-ekrani, VS Code.
const CSS_LESSON = `
  /* HOOK — ikki tanlov bitta qatorda (104-qonun: teng og'irlik, teng kenglik) */
  .hrow { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: clamp(8px,1.4vw,14px); }
  .hopt { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 7px; background: ${T.paper}; border: none; border-radius: 15px; padding: clamp(13px,2vw,18px) clamp(9px,1.4vw,13px); cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 8px 20px -9px rgba(${T.shadowBase},0.22); transition: transform 0.16s, box-shadow 0.16s; min-width: 0; }
  .hopt:hover:not(:disabled):not(.on) { transform: translateY(-3px); box-shadow: 0 14px 26px -9px rgba(${T.shadowBase},0.3); }
  .hopt:disabled { cursor: default; }
  .hopt.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 12px 26px -9px rgba(91,61,230,0.35); background: ${T.accentSoft}; }
  .hopt-ic { font-size: clamp(24px,3.4vw,32px); line-height: 1; }
  .hopt-nom { font-weight: 700; font-size: clamp(12.5px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.3; overflow-wrap: anywhere; }
  .hvote { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,18px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
  .hvote-row { display: flex; align-items: center; gap: 10px; }
  .hvote-lbl { flex: 0 0 clamp(120px,26vw,230px); font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hvote-row.mine .hvote-lbl { color: ${T.accent}; }
  .hvote-track { flex: 1; height: 12px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
  .hvote-fill { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.6s cubic-bezier(.2,.7,.2,1); }
  .hvote-row.top .hvote-fill { background: linear-gradient(90deg, ${T.success}, #0E8A55); }
  .hvote-pct { min-width: 38px; text-align: right; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
  @media (prefers-reduced-motion: reduce) { .hopt, .hvote-fill { transition: none; } }

  .hrow.two { max-width: 720px; align-self: center; width: 100%; }
  .hrow.two .hopt { padding: clamp(14px,2vw,20px) clamp(10px,1.6vw,16px); }
  /* IMZO-SAHNA: tanlangan javob — stol ortidagi odamning GAPI. Karta gap-pufakka aylanadi,
     dumi pastdagi odam-qatoriga qaraydi (.bubble::before bilan bir oila). */
  .hrow.two .hopt.on { position: relative; }
  .hrow.two .hopt.on::after { content: ''; position: absolute; bottom: -7px; left: 50%; margin-left: -7px; width: 14px; height: 14px; border-radius: 2px; background: ${T.accentSoft}; box-shadow: inset -2px -2px 0 ${T.accent}; transform: rotate(45deg); }

  /* MAQSAD (s1) — ro'yxat o'z-o'zidan yozilib chiqadi (18-qonun) */
  /* s4 panelining kichik ukasi: tepada uch holat-rangi yo'lakchasi, ichida uch katak. */
  .s1demo { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 18px; padding: clamp(15px,2.2vw,20px) clamp(15px,2.4vw,22px) clamp(13px,2vw,18px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; max-width: 640px; align-self: center; width: 100%; }
  .s1demo::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, ${T.success}, ${T.accent}, ${T.blue}); }
  .s1demo-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: ${T.accent}; }
  .s1demo-list { display: flex; flex-direction: column; gap: 7px; }
  .s1row { position: relative; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; background: ${T.bg}; border-radius: 11px; padding: 9px 12px; opacity: 0; animation: s1-in 0.5s cubic-bezier(.3,1.4,.45,1) var(--dd) forwards, s1-flash 0.95s ease-out calc(var(--dd) + 0.55s); min-width: 0; }
  /* Qator bir lahza yonadi va tinchiydi: xabar kelib o'tdi. */
  @keyframes s1-flash { 0% { background: ${T.bg}; box-shadow: inset 0 0 0 0 rgba(91,61,230,0); } 28% { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px rgba(91,61,230,0.35); } 100% { background: ${T.bg}; box-shadow: inset 0 0 0 0 rgba(91,61,230,0); } }
  .s1row-ic { flex-shrink: 0; width: 27px; height: 27px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; opacity: 0; animation: s1-ok 0.4s cubic-bezier(.34,1.5,.4,1) var(--dd) forwards; }
  /* 42-qonun: fe'l ↔ ekran jarayoni — matn chapdan o'ngga «yozilib chiqadi», quruq paydo bo'lmaydi */
  .s1row-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; clip-path: inset(0 100% 0 0); animation: s1-write 0.62s ease-out forwards; animation-delay: var(--dd); }
  .s1row::before { content: ""; position: absolute; left: -10px; top: 50%; transform: translateY(-50%); height: 2px; width: 0; border-radius: 99px; background: ${T.accent}; animation: s1-link 0.9s ease-out forwards; animation-delay: var(--dd); }
  /* Strelka qo'yiladi, keyin «xabar keladi» chipi o'ngdan uchib keladi */
  .s1row-mark { margin-left: auto; font-size: 16px; color: ${T.accent}; opacity: 0; animation: s1-ok 0.4s ease-out forwards; animation-delay: var(--dd2); }
  /* «xabar keladi» — chip bo'lib O'NGDAN uchib keladi: kelayotgan xabarning o'zi. */
  .s1row-why { font-family: 'Manrope'; font-weight: 800; font-size: clamp(11.5px,1.4vw,13px); color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 12px; box-shadow: inset 0 0 0 1.5px rgba(91,61,230,0.26); text-align: right; min-width: 0; overflow-wrap: anywhere; opacity: 0; animation: s1-arrive 0.5s cubic-bezier(.3,1.35,.45,1) var(--dd3) forwards; }
  @keyframes s1-arrive { 0% { opacity: 0; transform: translateX(16px) scale(0.9); } 100% { opacity: 1; transform: translateX(0) scale(1); } }
  @keyframes s1-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes s1-write { to { clip-path: inset(0 0 0 0); } }
  @keyframes s1-link { 0% { width: 0; opacity: 0.95; } 40% { width: 10px; opacity: 0.95; } 100% { width: 10px; opacity: 0; } }
  @keyframes s1-ok { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) { .s1row, .s1row-mark, .s1row-ic, .s1row-why { animation: none; opacity: 1; transform: none; } .s1row-t { animation: none; clip-path: none; } .s1row::before { animation: none; width: 0; } }

  /* TEORIYA-1 (s2): ikki ta'rif kartasi — bosilsa ochiladi/yopiladi (46-qonun) */
  .dfc-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: clamp(10px,1.8vw,16px); }
  @media (max-width: 700px) { .dfc-grid { grid-template-columns: 1fr; } }
  .dfc { display: flex; flex-direction: column; gap: 9px; text-align: left; background: ${T.paper}; border: none; border-radius: 16px; padding: clamp(13px,2vw,18px); cursor: pointer; box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; transition: transform 0.16s, box-shadow 0.16s; min-width: 0; }
  .dfc:hover { transform: translateY(-2px); box-shadow: 0 14px 26px -9px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.accent}44; }
  .dfc:active { transform: translateY(0); }
  .dfc.open { box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 12px 26px -14px rgba(91,61,230,0.3); }
  .dfc-top { display: flex; align-items: center; gap: 9px; }
  .dfc-ic { font-size: clamp(20px,2.8vw,26px); line-height: 1; }
  .dfc-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  .dfc-b { font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.5; color: ${T.ink2}; background: ${T.bg}; border-radius: 11px; padding: 9px 12px; min-height: clamp(62px,7.6vh,86px); display: flex; align-items: center; overflow-wrap: anywhere; min-width: 0; transition: background 0.2s, color 0.2s; }
  /* Yopiq karta «bosing» deb turadi: nuqtalar markazda, xira */
  .dfc:not(.open) .dfc-b { justify-content: center; color: ${T.ink3}; letter-spacing: 0.34em; }
  .dfc.open .dfc-b { color: ${T.ink}; background: ${T.accentSoft}; animation: fade-step 0.28s ease-out; }
  /* Bir tushuncha — bir rang: 💭 STOL ORTIDA indigo (javob hali yo'q, faqat o'ylangan) ·
     🚶 ODAMNING OLDIDA yashil (javob shu yerdan keladi — bugungi dars yo'li). */
  .dfc-grid .dfc:first-child.open { box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 12px 26px -14px rgba(91,61,230,0.3); }
  .dfc-grid .dfc:first-child.open .dfc-b { background: ${T.accentSoft}; }
  .dfc-grid .dfc:last-child.open { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 12px 26px -14px rgba(31,122,77,0.3); }
  .dfc-grid .dfc:last-child.open .dfc-b { background: ${T.successSoft}; }
  @media (prefers-reduced-motion: reduce) { .dfc, .dfc:hover { transition: none; transform: none; } .dfc.open .dfc-b { animation: none; } }


  /* YOZISH-EKRANI (s8): qaror-kartasi, qator-paneli, yozilganlar ro'yxati */
  /* Muharrir — ekranning yagona «baland» kartasi (80b): navbat shu yerda ekani soyadan ham ko'rinadi */
  .wsp-ed { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,17px); box-shadow: 0 16px 34px -16px rgba(${T.shadowBase},0.28), inset 0 0 0 2px ${T.accent}44; min-width: 0; }
  .wsp-ed-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; }
  .wsp-save { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.6vw,14.5px); color: #fff; background: ${T.accent}; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 10px 22px -10px rgba(91,61,230,0.6); transition: transform 0.14s, opacity 0.14s, box-shadow 0.14s; }
  .wsp-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 13px 26px -10px rgba(91,61,230,0.7); }
  .wsp-save:active:not(:disabled) { transform: translateY(0) scale(0.97); }
  .wsp-save:disabled { opacity: 0.42; cursor: not-allowed; box-shadow: none; }
  @media (prefers-reduced-motion: reduce) { .wsp-save { transition: none; } .wsp-save:hover:not(:disabled), .wsp-save:active:not(:disabled) { transform: none; } }
  .wsp-list { display: flex; flex-direction: column; gap: 7px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,17px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.success}55; min-width: 0; }
  .wsp-list-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.success}; overflow-wrap: anywhere; }
  /* Uch qaror ro'yxatga birin-ketin tushadi — bir zarbda emas */
  .wsp-item { display: flex; align-items: flex-start; gap: 9px; background: ${T.bg}; border-radius: 11px; padding: 9px 11px; min-width: 0; animation: fade-in-up 0.34s ease-out both; }
  .wsp-item:nth-child(3) { animation-delay: 0.09s; }
  .wsp-item:nth-child(4) { animation-delay: 0.18s; }
  @media (prefers-reduced-motion: reduce) { .wsp-item { animation: none; } }
  .wsp-item-t { flex: 1; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; line-height: 1.4; min-width: 0; overflow-wrap: anywhere; }
  .wsp-item-edit { flex-shrink: 0; background: none; border: none; cursor: pointer; font-size: 14px; color: ${T.ink3}; border-radius: 8px; padding: 2px 6px; }
  .wsp-item-edit:hover { color: ${T.accent}; background: ${T.accentSoft}; }
  .wsp-task { display: flex; flex-direction: column; gap: 5px; background: ${T.paper}; border-left: 5px solid ${T.accent}; border-radius: 14px; padding: 11px 14px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; }
  .wsp-task-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
  .wsp-task-row { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); color: ${T.ink2}; background: ${T.bg}; border-radius: 9px; padding: 6px 10px; min-width: 0; overflow-wrap: anywhere; transition: background 0.2s, color 0.2s; }
  .wsp-task-row.done { color: ${T.success}; background: ${T.successSoft}; }
  .wsp-task-m { margin-left: auto; flex-shrink: 0; font-size: 14px; animation: s1-ok 0.34s cubic-bezier(.34,1.5,.4,1); }
  @media (prefers-reduced-motion: reduce) { .wsp-task-row { transition: none; } .wsp-task-m { animation: none; } }
  .wsp-task-n { font-size: 11.5px; font-weight: 700; color: ${T.ink3}; }
  .wsp-saverow { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  /* 83/30-qonun: tugma faol bo'lmasa, nima yetishmayotgani SO'Z bilan yoziladi */
  .wsp-need { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; }
  .wsp-item-m { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; background: ${T.blueSoft}; }

  /* KODING darvoza-mashqi (82e): darsning O'Z texnik bilimidan bitta savol */
  .gt-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  /* Darvoza-savoli — test-kartochkasi ritmida: uch variant teng enda, ustma-ust */
  .gt-btns.col3 { flex-direction: column; align-items: stretch; }
  .gt-b { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 10px; padding: 9px 14px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; text-align: left; transition: box-shadow 0.14s, color 0.14s, transform 0.12s; min-width: 0; overflow-wrap: anywhere; }
  .gt-b:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}66; color: ${T.accent}; }
  .gt-b:active:not(:disabled) { transform: scale(0.98); }
  .gt-b.miss { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; animation: cmt-shake 0.4s ease; }
  @media (prefers-reduced-motion: reduce) { .gt-b { transition: none; } .gt-b.miss { animation: none; } .gt-b:active:not(:disabled) { transform: none; } }

  /* KODING — VS Code-topshirig'i (82-qonun): panel CHAPDA, kod O'NGDA, nusxalash yopiq */
  .vsc { position: relative; background: #1E1E1E; border-radius: 14px; overflow: hidden; box-shadow: 0 14px 30px -10px rgba(${T.shadowBase},0.35); }
  .vsc-bar { background: #252526; display: flex; align-items: center; gap: 2px; padding-right: 8px; }
  .vsc-tab { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: #8B949E; background: #2D2D2D; border: none; padding: 9px 14px; display: inline-flex; align-items: center; gap: 6px; }
  .vsc-tab.on { background: #1E1E1E; color: #E6EDF3; box-shadow: inset 0 2px 0 #007ACC; }
  .vsc-lock { margin-left: auto; font-family: 'Manrope'; font-weight: 700; font-size: 11px; letter-spacing: 0.04em; color: #B9A8E6; background: rgba(255,255,255,0.07); border-radius: 8px; padding: 5px 11px; }
  .vsc.no-copy .vsc-body { user-select: none; -webkit-user-select: none; }
  .vsc-body { padding: 10px 14px 12px 6px; font-family: 'JetBrains Mono', monospace; font-size: clamp(11px,1.35vw,12.5px); color: #D4D4D4; line-height: 1.58; overflow: auto; max-height: clamp(240px, 46vh, 520px); scrollbar-width: thin; scrollbar-color: #4A4A4A #1E1E1E; }
  .vsc-body::-webkit-scrollbar { width: 9px; height: 9px; }
  .vsc-body::-webkit-scrollbar-thumb { background: #4A4A4A; border-radius: 99px; }
  .vsc-body::-webkit-scrollbar-track { background: #1E1E1E; }
  @media (max-width: 620px) { .vsc-body { max-height: none; overflow-y: visible; } }
  .vsc-line { display: flex; align-items: baseline; min-width: max-content; }
  .vsc-ln { color: #6E7681; min-width: 26px; text-align: right; margin-right: 14px; font-size: 10.5px; flex-shrink: 0; user-select: none; }
  .vsc-code { white-space: pre; }
  .xul { background: ${T.paper}; border-left: 5px solid ${T.success}; border-radius: 14px; padding: clamp(13px,2vw,18px); display: flex; flex-direction: column; gap: 7px; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.2); }
  .xul-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; }
  .xul-b { margin: 0; font-size: clamp(13.5px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
  /* Xulosa-hujjati keng ekranda IKKI ustun: chapda qoida (serif), o'ngda izoh.
     Matn qisqarmaydi — YIG'ILADI: qator uzunligi ikki barobar qisqaradi, s4 dagi
     to'rt gaplik izoh devor bo'lib ko'rinmaydi (58/109-qonun). */
  @media (min-width: 861px) {
    .xul { display: grid; grid-template-columns: minmax(0,0.92fr) minmax(0,1.2fr); align-items: start; column-gap: clamp(18px,2.6vw,30px); }
    .xul-h { position: relative; padding-right: clamp(16px,2.2vw,26px); }
    .xul-h::after { content: ''; position: absolute; top: 4px; bottom: 2px; right: 0; width: 1px; background: ${T.line}; }
  }
  /* RECAP mukofoti (106f-b): bitta tabrik-gap va bitta qoida-qatori.
     Qoida-qatori «muhr» kabi tushadi — mukofot real yutuqdan keyin, bir marta. */
  .rwd { display: flex; flex-direction: column; gap: 7px; align-items: flex-start; }
  .rwd-t { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; color: ${T.success}; background: ${T.successSoft}; border-radius: 10px; padding: 8px 12px; min-width: 0; overflow-wrap: anywhere; }
  .rwd-rule { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 7px 14px; min-width: 0; overflow-wrap: anywhere; box-shadow: inset 0 0 0 1.5px ${T.accent}44; animation: rwd-stamp 0.46s cubic-bezier(.34,1.5,.4,1) 0.16s both; }
  @keyframes rwd-stamp { 0% { opacity: 0; transform: scale(1.16); } 60% { opacity: 1; transform: scale(0.97); } 100% { opacity: 1; transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) { .rwd-rule { animation: none; } }
  /* YAKUN (103-qonun): darsni yopadigan bitta gap — sahifaning oxirgi «hujjat»i */
  .bigidea { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 4px; align-items: center; text-align: center; background: ${T.paper}; border-radius: 16px; padding: clamp(14px,2vw,20px) clamp(14px,2.2vw,22px) clamp(12px,1.8vw,18px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.accent}33; }
  .bigidea::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}, ${T.blue}); }
  .bigidea-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
  .bigidea-t { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,21px); line-height: 1.3; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .bhint { margin: 0; align-self: flex-start; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 9px; padding: 7px 12px; }
  /* ETALON 32: muvaffaqiyat-xabari CHIP bo'lib qoladi — to'liq-en yashil lenta emas */
  .bdone { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
  .bdone .done-mini { max-width: 780px; }

  /* BOSQICHLI OCHILISH (94-qonun): uch qadam-doirasi */
  .stps { display: flex; flex-wrap: wrap; gap: 8px; }
  .stp { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink3}; background: ${T.paper}; border-radius: 99px; padding: 5px 12px 5px 5px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .stp i { font-style: normal; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: ${T.bg}; color: ${T.ink3}; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11px; }
  .stp.on { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .stp.on i { background: ${T.accent}; color: #fff; }
  .stp.done { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
  .stp.done i { background: ${T.success}; color: #fff; }
  /* 81-qonun: maydon-belgilari MA'NO rangida (qizil hech qachon).
     bo'sh = xira halqa · kutmoqda = yumshoq indigo nafas · fokus = to'liq indigo 2px · to'lgan = indigo halqa. */
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
  .wsx.star { border-color: ${T.blue}66; }
  .wsx-toggle { width: 100%; text-align: left; background: none; border: none; padding: 8px 11px; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.accent}; cursor: pointer; }
  .wsx.star .wsx-toggle { color: ${T.blue}; }
  .wsx-body { padding: 0 11px 9px; display: flex; flex-direction: column; gap: 6px; animation: fade-step 0.25s ease-out; }
  .wsx-body p { font-size: 12.5px; color: ${T.ink2}; margin: 0; line-height: 1.45; overflow-wrap: anywhere; }
  .wsx-body b { color: ${T.ink}; }
  /* KODING (82-qonun): topshiriq-paneli CHAPDA, kompilyator-tugmasi O'NGDA */
  .kdpanel { position: relative; background: ${T.paper}; border-radius: 16px; padding: 11px 13px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.18); border-left: 5px solid ${T.accent}; min-width: 0; transition: border-color 0.3s; }
  .kdpanel.is-done { border-left-color: ${T.success}; }
  /* ETALON 32: shartlar chip-panel ritmida — .spec-c/.wsp-task-row bilan bir oila. */
  ol.kdreq { margin: 0; padding-left: 0; list-style: none; counter-reset: kd; display: flex; flex-direction: column; gap: 5px; }
  .kdreq li { counter-increment: kd; display: flex; align-items: flex-start; gap: 8px; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; background: ${T.bg}; border-radius: 9px; padding: 6px 10px; min-width: 0; overflow-wrap: anywhere; }
  .kdreq li::before { content: counter(kd); flex-shrink: 0; width: 17px; height: 17px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 10.5px; display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }
  .cmt { background: ${T.bg}; border-radius: 13px; border-left: 4px solid ${T.accent}; padding: 11px 13px; display: flex; flex-direction: column; gap: 9px; max-width: 680px; width: 100%; align-self: center; }
  .cmt.hunt { animation: cmt-hunt 1.7s ease-in-out infinite; }
  /* 72c: darvoza-savoli yechilgach diqqat-belgisi tinadi */
  .cmt.calm { animation: none; }
  @keyframes cmt-hunt { 0%, 100% { box-shadow: 0 0 0 0 rgba(110,75,255,0.4); } 50% { box-shadow: 0 0 0 9px rgba(110,75,255,0); } }
  .cmt-fold { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; background: ${T.successSoft}; border-radius: 99px; padding: 7px 9px 7px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
  @media (prefers-reduced-motion: reduce) { .cmt.hunt, .cmt.calm { animation: none; } }
  .cmt-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: ${T.ink}; }
  .cmt-done { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.5vw,13.5px); color: ${T.success}; animation: fade-step 0.3s ease-out; }
  @keyframes cmt-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 55% { transform: translateX(5px); } 80% { transform: translateX(-2px); } }
  /* Javob-manbai (106d): NEYTRAL maslahat — accentSoft, xato-rangi EMAS. Bitta qator, cmt blokining ICHIDA. */
  .cmt-tip { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13px); line-height: 1.45; color: ${T.ink2}; background: ${T.accentSoft}; border-radius: 9px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; animation: fade-step 0.3s ease-out; }
  @media (prefers-reduced-motion: reduce) { .cmt-tip { animation: none; } }
  .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13.5px,1.7vw,15px); cursor: pointer; border: none; border-radius: 13px; padding: 12px 18px; background: ${T.ink}; color: ${T.bg}; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.34); transition: all 0.18s; }
  .lp-done-btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.5); }
  .lp-done-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .lp-done-btn.is-done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; }
  .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 10px 13px; display: flex; flex-direction: column; gap: 5px; }
  .kd-skip { align-self: flex-start; background: none; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-decoration: underline; text-underline-offset: 3px; padding: 4px 6px; border-radius: 8px; transition: color 0.15s; }
  .kd-skip:hover { color: ${T.accent}; }
  /* RECAP (s11) */
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
  .k-dots { display: flex; gap: 8px; justify-content: center; }
  .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
  .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }
  .kp-bet { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(15px,2.4vw,24px) clamp(18px,3vw,30px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 11px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
  .kp-bet::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: repeating-linear-gradient(90deg, ${T.accent} 0 14px, ${T.accentSoft} 14px 22px); }
  /* Javob berilgach bashorat-kartasi ixchamlashadi: uning ishi tugadi, sahna slaydga o'tadi. */
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
  @media (prefers-reduced-motion: reduce) { .kp-chip, .kp-chip:hover { transition: none; transform: none; } .kp-res.kp-res { animation: none; } }

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
  /* ===== UY-VAZIFA VARAG'I (58-qonun) — kapsula bosilganda topshiriq VARAQ bo'lib
     yakun-stoli ustiga qo'yiladi. Ilgari karta oqimga qo'shilardi va sahifa ~500px
     skroll bo'lib ketardi (avto-skroll — yamoq). Endi varaq sahna ichida turadi: skroll 0. */
  .screen.hw-on { position: relative; }
  .hw-sheet { position: absolute; inset: 0; z-index: 40; display: flex; align-items: center; justify-content: center; padding: 2px 0 6px; background: linear-gradient(180deg, rgba(242,240,250,0.9), rgba(242,240,250,0.97)); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); animation: hw-sheet-in 0.3s ease-out both; }
  .hw-sheet-paper { position: relative; width: min(920px, 100%); max-height: 100%; overflow: auto; border-radius: 16px; box-shadow: 0 30px 64px -26px rgba(${T.shadowBase},0.5); animation: hw-paper-up 0.42s cubic-bezier(.2,.8,.25,1) both; }
  .hw-sheet-paper > .card { border-left: 5px solid ${T.accent}; }
  .hw-sheet-x { position: absolute; top: 12px; right: 12px; z-index: 2; width: 30px; height: 30px; border: none; border-radius: 50%; cursor: pointer; background: ${T.bg}; color: ${T.ink2}; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; line-height: 1; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: transform 0.15s, box-shadow 0.15s, color 0.15s; }
  .hw-sheet-x:hover { color: ${T.accent}; transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .hw-sheet .card-lbl { padding-right: 40px; }
  @keyframes hw-sheet-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes hw-paper-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
  /* Varaq ochiqda kapsula parda ortida qoladi: yorug'lik-supurgisi ham, aura ham ko'rinmaydi
     (ko'rinmas animatsiya + ular kapsuladan tashqariga chiqib sahna bo'yini uzaytirardi). */
  .screen.hw-on .hw-big-shine, .screen.hw-on .hw-big-wrap::before { display: none; }
  @media (prefers-reduced-motion: reduce) { .hw-sheet, .hw-sheet-paper { animation: none; } }
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

  /* KIRISH-TASMA (s8) — bir qatorlik ko'prik, ish-maydoni EMAS (92b) */
  .tasma { display: flex; flex-wrap: wrap; gap: 6px; }
  .tasma-i { font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; background: ${T.paper}; border-radius: 99px; padding: 5px 12px; box-shadow: inset 0 0 0 1px ${T.line}; min-width: 0; overflow-wrap: anywhere; }
  /* TOPSHIRIQ-SHARTLARI (ETALON 32): qisqa chip, bajarilgani yashil */
  .spec { display: flex; flex-direction: column; gap: 4px; margin-top: 3px; }
  .spec-c { font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink3}; background: ${T.bg}; border-radius: 8px; padding: 5px 9px; min-width: 0; overflow-wrap: anywhere; transition: color 0.2s, background 0.2s; }
  .spec-c.ok { color: ${T.success}; background: ${T.successSoft}; }
  .task-line { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; color: ${T.ink}; background: ${T.paper}; border-left: 5px solid ${T.accent}; border-radius: 12px; padding: 10px 13px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; overflow-wrap: anywhere; }
  .strip { display: flex; flex-wrap: wrap; gap: 6px; }
  /* Yakun-tasmasi bir zarbda emas — to'rt yo'l birin-ketin joyiga tushadi. */
  .strip-i { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink2}; background: ${T.paper}; border-radius: 99px; padding: 6px 12px; box-shadow: inset 0 0 0 1px ${T.line}; min-width: 0; overflow-wrap: anywhere; animation: strip-in 0.36s cubic-bezier(.3,1.35,.45,1) both; animation-delay: calc(var(--i, 0) * 0.09s); }
  @keyframes strip-in { 0% { opacity: 0; transform: translateY(7px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
  .strip-i.ok { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }

  /* IMZO-SAHNA (s0): stol ortidagi odam — hook ekranida ham, s4 stolida ham bir qiyofa */
  .stolbar { display: flex; align-items: center; gap: 9px; align-self: center; background: ${T.paper}; border-radius: 99px; padding: 7px 16px 7px 8px; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 8px 20px -12px rgba(${T.shadowBase},0.24); min-width: 0; }
  .stolbar-av { width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; background: ${T.accentSoft}; flex-shrink: 0; }
  .stolbar-nm { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.4vw,13.5px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  .stolbar-b { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; background: ${T.bg}; border-radius: 99px; padding: 5px 12px; letter-spacing: 0.12em; }

  /* 🔴 IMZO-VIZUAL (s4): SUHBAT STOLI — chapda savol-kartalari, o'ngda stol ortidagi odam */
  .qcards { display: flex; flex-direction: column; gap: 8px; }
  .qcard { display: flex; align-items: center; gap: 10px; text-align: left; background: ${T.paper}; border: none; border-radius: 13px; padding: 11px 13px; cursor: pointer; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.24), inset 0 0 0 1.5px ${T.line}; transition: transform 0.15s, box-shadow 0.15s; min-width: 0; }
  .qcard:hover:not(:disabled) { transform: translateX(3px); box-shadow: 0 12px 26px -12px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.accent}66; }
  .qcard:disabled { cursor: default; }
  .qcard-n { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #fff; background: ${T.accent}; }
  .qcard-t { flex: 1; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.4; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .qcard-m { flex-shrink: 0; font-size: 13px; color: ${T.accent}; }
  .stol { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,17px); box-shadow: 0 12px 30px -16px rgba(${T.shadowBase},0.26), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .stol-bar { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: clamp(11.5px,1.4vw,13px); color: ${T.accent}; }
  .stol-bar b { margin-left: auto; color: ${T.ink3}; font-weight: 700; font-size: 11.5px; }
  .stol-p { display: flex; align-items: center; gap: 10px; }
  .stol-av { width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 21px; background: ${T.accentSoft}; flex-shrink: 0; }
  .stol-nm { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  /* Gap-pufak: javob ichida yozilib chiqadi (~1,2 s), tepasida stol ortidagi odamga qaragan burchak */
  .bubble { position: relative; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.5; color: ${T.ink}; background: ${T.bg}; border-radius: 14px; padding: 11px 14px; min-height: 62px; min-width: 0; overflow-wrap: anywhere; box-shadow: inset 0 0 0 1.5px ${T.accent}33; animation: fade-step 0.3s ease-out; }
  .bubble::before { content: ""; position: absolute; top: -7px; left: 18px; width: 13px; height: 13px; background: ${T.bg}; transform: rotate(45deg); box-shadow: inset 1.5px 1.5px 0 ${T.accent}33; }
  .bubble.empty { color: ${T.ink3}; letter-spacing: 0.34em; display: flex; align-items: center; }
  .bilgan { display: flex; flex-direction: column; gap: 5px; }
  .bilgan-i { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; background: ${T.accentSoft}; border-radius: 9px; padding: 7px 10px; min-width: 0; overflow-wrap: anywhere; animation: fade-in-up 0.34s ease-out both; }
  .bilgan-i.ok { color: ${T.success}; background: ${T.successSoft}; }
  .bilgan-i b { font-size: 11.5px; color: ${T.ink3}; margin-right: 4px; }
  /* 2-bosqich: eshitganini varaqqa qaysi qator bilan yozish */
  .wq { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,17px); box-shadow: 0 14px 32px -16px rgba(${T.shadowBase},0.28), inset 0 0 0 2px ${T.accent}44; min-width: 0; }
  .wq-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: ${T.success}; }
  .wq-quote { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink}; background: ${T.bg}; border-radius: 11px; padding: 9px 12px; min-width: 0; overflow-wrap: anywhere; }
  .wq-ask { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; }
  .wq-rows { display: flex; flex-direction: column; gap: 7px; }
  .wq-row { text-align: left; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.4; color: ${T.ink}; background: ${T.bg}; border: none; border-radius: 11px; padding: 10px 13px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: box-shadow 0.15s, transform 0.12s; min-width: 0; overflow-wrap: anywhere; }
  .wq-row:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}66; transform: translateX(2px); }
  .wq-row.on { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
  .wq-row.ans { box-shadow: inset 0 0 0 2px ${T.success}; background: ${T.successSoft}; color: ${T.success}; }
  /* 92e: savol o'qish holatiga o'tdi — katta shriftda, tahrir belgisi yonida */
  .wq-read { display: flex; align-items: flex-start; gap: 8px; background: ${T.accentSoft}; border-radius: 11px; padding: 9px 12px; min-width: 0; }
  .wq-read-t { flex: 1; font-family: 'Manrope'; font-weight: 800; font-size: clamp(13.5px,1.7vw,15.5px); line-height: 1.4; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }

  /* TEKSHIRUV (s9): SAVOL-ELAK — savol ikki to'siqdan o'tadi yoki elakda qoladi */
  .elak { display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,17px); box-shadow: 0 12px 30px -16px rgba(${T.shadowBase},0.26), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .elak-bar { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: clamp(11.5px,1.4vw,13px); color: ${T.accent}; }
  .elak-bar b { margin-left: auto; color: ${T.ink3}; font-weight: 700; font-size: 11.5px; }
  .elak-ic { font-style: normal; font-size: 15px; }
  /* Javob kutilayotganda elak-belgisi sekin uriladi: savol elak ustida turibdi */
  .elak.wait .elak-ic { animation: elak-pulse 2.1s ease-in-out infinite; display: inline-block; }
  @keyframes elak-pulse { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
  .elak-body { font-family: 'Manrope'; font-weight: 700; font-size: clamp(13.5px,1.7vw,15.5px); line-height: 1.45; color: ${T.ink}; background: ${T.bg}; border-radius: 13px; padding: 13px 15px; min-width: 0; overflow-wrap: anywhere; box-shadow: inset 0 0 0 1.5px ${T.accent}33; animation: elak-in 0.34s ease-out; }
  /* Savol varaqqa tushadi yoki to'siqda qoladi — natijaning o'zi ko'rinadi */
  .elak-body.fall { animation: elak-fall 0.5s cubic-bezier(.3,.9,.4,1) both; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
  .elak-body.hold { box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  @keyframes elak-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes elak-fall { 0% { transform: translateY(0); } 100% { transform: translateY(9px); } }
  /* ELAK TO'RI — savol-kartasi bilan to'siq-tugmalari orasidagi teshikli yo'lak.
     Dekor mavzuni O'QITADI: kutish holatida to'r bir tekis; savol o'tganda teshiklar
     kengayadi (savol tushib ketdi), to'siqda qolganda to'r yopiladi (savol ushlanib qoldi).
     Rang-qonuni: o'tgan = success, ushlangan = neytral indigo — qizil YO'Q. */
  .elakbtns { position: relative; margin-top: 12px; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
  .elakbtns::before {
    content: ''; position: absolute; left: 2px; right: 2px; top: -12px; height: 6px; border-radius: 99px;
    background: repeating-linear-gradient(90deg, ${T.line} 0 9px, transparent 9px 15px);
    transition: background 0.3s ease;
  }
  .elak-body.fall + .elakbtns::before { background: repeating-linear-gradient(90deg, ${T.success}77 0 5px, transparent 5px 17px); }
  .elak-body.hold + .elakbtns::before { background: ${T.accent}66; }
  @media (max-width: 720px) { .elakbtns { grid-template-columns: 1fr; } }
  .elakb { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; font-family: 'Manrope'; font-weight: 700; background: ${T.bg}; border: none; border-radius: 12px; padding: 11px 10px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: box-shadow 0.15s, transform 0.12s; min-width: 0; }
  .elakb:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .elakb:disabled { cursor: default; }
  .elakb-ic { font-size: 19px; line-height: 1; }
  .elakb-t { font-size: clamp(11.5px,1.4vw,13px); line-height: 1.35; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .elakb.on { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
  .elakb.ans { box-shadow: inset 0 0 0 2px ${T.success}; background: ${T.successSoft}; }
  .elakb.ans .elakb-t { color: ${T.success}; }
  /* To'siq-tugmasi javob OCHILGANDAN keyin o'z ma'nosini bir marta ko'rsatadi (oldindan
     ishora yo'q — tanlovgacha uchtasi teng): o'tgan savol pastga tushadi, ushlangani joyida qoladi. */
  .elakb-otdi.ans .elakb-ic { animation: elakb-drop 0.5s cubic-bezier(.3,.9,.4,1) both; display: inline-block; }
  .elakb-hali.ans .elakb-ic, .elakb-ichida.ans .elakb-ic { animation: elakb-hold 0.5s cubic-bezier(.34,1.5,.4,1) both; display: inline-block; }
  @keyframes elakb-drop { 0% { transform: translateY(-7px); opacity: 0.35; } 62% { transform: translateY(3px); opacity: 1; } 100% { transform: translateY(0); } }
  @keyframes elakb-hold { 0% { transform: scale(0.82); } 55% { transform: scale(1.14); } 100% { transform: scale(1); } }
  .nextsig { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border: none; border-radius: 10px; padding: 8px 15px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.accent}44; }
  .nextsig:hover { background: ${T.accent}; color: #fff; }

  /* Kod-qatorlari panelga sig'sin: uzun izoh-qator gorizontal skrollga emas, keyingi qatorga o'tadi */
  .vsc-line { align-items: flex-start; min-width: 0; }
  .vsc-code { white-space: pre-wrap; overflow-wrap: break-word; flex: 1; min-width: 0; }
  /* KODING (s10): VS Code maketining pastki terminal-qatori */
  /* Terminal — maketning bir bo'lagi: yuqori hoshiyasi .vsc-lock rangida. */
  .term { display: flex; align-items: center; gap: 8px; background: #151515; padding: 10px 14px; box-shadow: inset 0 1px 0 rgba(185,168,230,0.22); }
  .term-l { font-size: clamp(11px,1.35vw,12.5px); color: #D4D4D4; }
  .term-l b { color: #4EC9B0; }
  .term-c { width: 8px; height: 15px; background: #D4D4D4; animation: term-blink 1.1s steps(1) infinite; }
  @keyframes term-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

  /* YAKUNIY TEST (s11): tahlil-materiali — suhbatdoshning gapi (49-qonun) */
  .qquote { align-self: center; max-width: 640px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,15px); line-height: 1.5; color: ${T.ink}; background: ${T.paper}; border-radius: 13px; padding: 11px 15px; box-shadow: inset 0 0 0 1.5px ${T.line}; min-width: 0; overflow-wrap: anywhere; }

  @media (prefers-reduced-motion: reduce) {
    .term-c, .elak.wait .elak-ic { animation: none; }
    .bubble, .bilgan-i, .elak-body, .elak-body.fall { animation: none; }
    .elakb-otdi.ans .elakb-ic, .elakb-hali.ans .elakb-ic, .elakb-ichida.ans .elakb-ic { animation: none; transform: none; }
    .elakbtns::before { transition: none; }
    .qcard:hover:not(:disabled), .wq-row:hover:not(:disabled), .elakb:hover:not(:disabled) { transform: none; }
    .strip-i { animation: none; opacity: 1; transform: none; }
  }
`;
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
  @media (prefers-reduced-motion: reduce) { .ach-counter.bump { animation: none; } }
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
  /* Nishon-kartasi: belgi CHAPDA, nom va izoh o'ngda — past ekranda karta bo'yi qisqaradi,
     belgi esa kattaligicha qoladi (kichik ekranda ham tanilsin). */
  .ach-badge { display: grid; grid-template-columns: auto minmax(0,1fr); grid-template-areas: "ic nm" "ic ds"; align-items: center; column-gap: 11px; row-gap: 2px; text-align: left; border-radius: 14px; padding: 10px 12px; transition: transform 0.15s; }
  .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #F5F1FE); border: 1.5px solid ${T.accent}55; }
  .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
  .ach-badge-ic { grid-area: ic; font-size: 27px; line-height: 1; width: 32px; text-align: center; }
  .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 20px; }
  .ach-badge-name { grid-area: nm; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
  .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
  .ach-badge-desc { grid-area: ds; font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
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
  /* ===== 58-QONUN: PAST-DESKTOP (past ekran) — sahifa skrollsiz sigsin =====
     Matn kattaligi TEGILMAYDI: faqat kapsula-ichi boshligi, nishon-katak va halqa kichrayadi.
     Blok ENG OXIRIDA turadi: media-sorov aniqlik qoshmaydi, tartib hal qiladi. */
  @media (max-height: 900px) {
    .stage-content > .screen { gap: clamp(8px,1.2vw,12px) !important; }
    .ring-wrap { width: 94px; height: 94px; }
    .ring-num { font-size: 24px; }
    .bigidea { padding: clamp(10px,1.4vw,14px) clamp(14px,2.2vw,22px) clamp(9px,1.2vw,12px); }
    .cs-cta .cs-cap { padding: clamp(9px,1.1vw,12px) clamp(20px,3vw,36px); }
    .hw-big { padding: clamp(11px,1.4vw,14px) clamp(22px,2.6vw,30px); }
    .card { padding: 12px 15px; }
    .card-lbl { margin-bottom: 8px; }
    .recap { gap: 6px; }
    .ach-badge { padding: 7px 10px; }
    .ach-grid { gap: 8px; }
    .vsc-body { max-height: clamp(210px, 41vh, 440px); }
  }
  @media (max-height: 830px) {
    .vsc-body { max-height: clamp(190px, 36vh, 380px); }
    .ring-wrap { width: 80px; height: 80px; }
    .ring-num { font-size: 23px; }
    .ring-den { font-size: 17px; }
    .cs-cta .cs-cap { padding: 9px clamp(18px,2.6vw,32px); }
    .hw-big { padding: 11px clamp(20px,2.4vw,28px); gap: 4px; }
    .ach-badge { padding: 5px 9px; row-gap: 1px; }
    .ach-badge-ic { font-size: 24px; }
    .bigidea { padding: 7px 16px 7px; }
    .stage-content > .screen { gap: 8px !important; }
    .card { padding: 11px 14px; }
    .recap { gap: 5px; }
    .recap li { font-size: 13.5px; }
    .card-lbl { margin-bottom: 7px; }
    .hw-big { padding: 7px clamp(20px,2.4vw,28px); }
    .cs-cta .cs-cap { padding: 5px clamp(18px,2.6vw,32px); }
    .ach-grid { gap: 6px; }
    /* 58-qonun · 1280x800 o'lchovi: koding-ekranida «💡 Yordam» ochilib, ustiga «bajarildi»
       chipi qo'shilganda chap ustun 41px oshib ketardi. Matn kattaligi TEGILMAYDI —
       faqat panel ichidagi bo'shliqlar qisqaradi. */
    .kdpanel { gap: 6px; padding: 9px 12px; }
    ol.kdreq { gap: 4px; }
    .kdreq li { padding: 5px 9px; line-height: 1.4; }
    .wsx-body { padding: 0 10px 7px; gap: 5px; }
    .wsx-body p { line-height: 1.4; }
    .wsx-toggle { padding: 7px 10px; }
    .lp-done-btn { padding: 10px 16px; }
    .kdpanel .done-mini { padding: 6px 13px; }
    .bhint { padding: 6px 11px; }
  }
  /* 58-qonun uchinchi pog'ona — 1366x768 kabi past noutbuklar (o'lchov: s4 -18px, s15 -13px).
     Matn kattaligi TEGILMAYDI: faqat ichki bo'shliqlar qisqaradi. */
  @media (max-height: 780px) {
    .stage-content > .screen { gap: 7px !important; }
    .card { padding: 9px 13px; }
    .recap { gap: 4px; }
    .ach-badge { padding: 4px 9px; }
    .ach-grid { gap: 5px; }
    .bigidea { padding: 6px 14px 6px; }
    .cs-cta .cs-cap { padding: 4px clamp(16px,2.4vw,30px); }
    .hw-big { padding: 6px clamp(18px,2.2vw,26px); }
    .xul { padding: 10px 13px; }
    .stol, .wq, .elak { padding: 10px 12px; }
    .bubble { min-height: 52px; }
    .vsc-body { max-height: clamp(170px, 32vh, 340px); }
  }
`;
export default function PmLesson20({ lang: langProp, onFinished }) {
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
