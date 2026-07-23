import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM MODULI (1-MODUL) · 12-DARS — STORYTELLING: PITCH — MAHSULOTNI 2 DAQIQADA SO'ZLAB BERISH
// Senariy-manba: pm-senariylar/M1-D12-Pitch.md (GATE S tasdiqlangan, korrektura o'tgan).
// Mavzu: kuchli pitch retsepti MUAMMO → YECHIM → DEMO; xususiyat-sanash nega kuchsiz;
//        K12 Airbnb pitch-deck keysi; ilgak (ochuvchi gap); demo — ishonch dalili.
// Kontekst: ERTAGA Demo Day (M1-D13)! O'quvchi HTML+CSS biladi, sayti Netlify'da JONLI (D11).
// Artefakt: 2 daqiqalik pitch (3 qism: MUAMMO 1-2 gap · YECHIM 1-2 gap · DEMO-gap 1 gap) —
//        ertaga sahnada aytiladi; koding: Demo Day sahna-kartasi (HTML-karta + jonli havola).
// SKELET/PRIMITIV MANBAI: src/pm/PmUserStoryLesson.jsx (P0 oltin namuna) — liveRpc/useLiveSession/
//        LiveGate/Stage/NavNext/QuestionScreen/MentorTestStats/RecapOverlay/TaskSpec/MentorWatchLine/
//        PmCompiler-qobiq/PairTimer/HW-SHARTNOMA/Podium/CodeStrike-arena/badges/PRACTICE_BASE.
//        MatchPairs (TEST-3) — PmMetricsLesson.jsx s9 konvensiyasi. Kompilyator HTML-varianti —
//        PmAudienceLesson.jsx (M1-D2) matn-tekshiruv relsi. KONTENT to'liq yangi (senariydan).
// AUDIOSIZ: ovoz (TTS) yo'q (useAudio stub, QuestionScreen imzosi saqlangan).
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

// ============================================================
// 🎨 PM-STUDIA IDENTITET (PM PLATFORM P0 ETALON — barcha PM darslar shu palitrada)
// «Mahsulot-menejerning ish stoli»: chuqur indigo/binafsha brend + studio-qog'oz fon.
// Rang-qonun: accent(indigo)=brend/e'tibor · success(yashil)=muvaffaqiyat · err(qizil)=FAQAT xato ·
// blue(kok)=KIM slot/info · amber=NIMA slot · yashil=NATIJA slot (formula-semantikasi).
// CODESTRIKE arenasi allaqachon binafsha — bu palitra u bilan bitta oilada.
// ============================================================
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB', link: '#5B3DE6',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
};
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };

// ============================================================
// JONLI SESSIYA INFRA — InternetLesson etalon bilan bir xil (liveRpc/useLiveSession/LiveGate)
// ============================================================
const LIVE_SUPABASE_URL = 'https://dwoubexcexzsinogojiu.supabase.co';
const LIVE_SUPABASE_KEY = 'sb_publishable_cijLMhCDDdo6dlXs05thyw__oH-YgKX';
const LIVE_ENABLED = !!(LIVE_SUPABASE_URL && LIVE_SUPABASE_KEY);
const LIVE_POLL_MS = 2500, LIVE_POLL_MAX_MS = 15000, LIVE_HEARTBEAT_MS = 10000, LIVE_STALE_MS = 60000;
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
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/live_sessions?pin=eq.${encodeURIComponent(pin)}&select=lesson_id,max_screen,status,updated_at,quiz_state,quiz_q,quiz_started_at,reveal_screen`, { headers: _liveHdr });
  if (!r.ok) throw new Error(`get: ${r.status}`);
  const rows = await r.json(); return (rows && rows[0]) || null;
}
const _lsKey = (id) => `liveSession:${id}`;
const liveRead = (id) => { try { return JSON.parse(localStorage.getItem(_lsKey(id)) || 'null'); } catch { return null; } };
const liveStore = (id, o) => { try { localStorage.setItem(_lsKey(id), JSON.stringify(o)); } catch {} };
const liveClear = (id) => { try { localStorage.removeItem(_lsKey(id)); } catch {} };
const fmtPin = (p) => (p ? String(p).replace(/(\d{3})(\d{3})/, '$1 $2') : '');
// Nickname — qurilma bo'ylab BITTA (darsga bog'lanmagan kalit)
const LIVE_NICK_KEY = 'liveNickname';
const nickRead = () => { try { return localStorage.getItem(LIVE_NICK_KEY) || ''; } catch { return ''; } };
const nickStore = (n) => { try { localStorage.setItem(LIVE_NICK_KEY, n); } catch {} };
async function liveList(path) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/${path}`, { headers: _liveHdr });
  if (!r.ok) throw new Error(`list: ${r.status}`);
  return r.json();
}
const livePlayers = (pin) => liveList(`live_players?pin=eq.${encodeURIComponent(pin)}&select=id,nickname,joined_at&order=joined_at.asc`);
// screenIdx berilmasa — faqat DARS javoblari (<100); Mustahkamlash javoblari 100+ indekslarda
const liveAnswers = (pin, screenIdx) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}${screenIdx == null ? '&screen_idx=lt.100' : `&screen_idx=eq.${screenIdx}`}&select=player_id,screen_idx,picked,correct,elapsed_ms`);
const liveQuizAnswers = (pin) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}&screen_idx=gte.100&select=player_id,screen_idx,picked,correct,elapsed_ms`);


function useLiveSession(lessonId, answerKey) {
  const keyRef = useRef(answerKey); keyRef.current = answerKey; // javob kaliti — mentor sessiya ochganda serverga yuklanadi
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
        setMentorScreen(p => p === row.max_screen ? p : row.max_screen);
        setStatus(p => p === row.status ? p : row.status);
        syncQuiz(row);
        if (row.updated_at !== lastUpdatedRef.current) { lastUpdatedRef.current = row.updated_at; lastSeenRef.current = Date.now(); liveStore(lessonId, { mode: 'student', pin, lastScreen: row.max_screen, playerId: playerRef.current?.id, playerToken: playerRef.current?.token, nickname: nickRef.current }); }
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
    const id = setInterval(() => { liveRpc('session_heartbeat', { p_pin: pin, p_token: tokenRef.current }).catch(() => {}); }, LIVE_HEARTBEAT_MS);
    return () => { on = false; clearInterval(id); };
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
      setPin(p); setMentorScreen(row.max_screen); setStatus(row.status); setMode('student');
      liveStore(lessonId, { mode: 'student', pin: p, lastScreen: row.max_screen, playerId: player.player_id, playerToken: player.token, nickname: nick });
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

  return { mode, pin, mentorScreen, status, mentorAlive, connected, ended, joinError, busy, startMentor, joinStudent, selfStudy, reportScreen, endSession, submitAnswer, quiz, quizControl, revealScreen, mentorReveal, playerId: playerRef.current?.id || null, nickname: nickRef.current };
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
      <p style={{ color: '#fff', opacity: 0.85, fontSize: 'clamp(15px,2.2vw,22px)', maxWidth: 640, margin: 'clamp(20px,4vw,36px) 0 0', lineHeight: 1.5 }}>Shu darsni o'z qurilmangizda oching → <b style={{ color: '#fff' }}>«👨‍🎓 O'quvchiman»</b> → ushbu kodni kiriting.</p>
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

// AUDIOSIZ dars — useAudio/getAudioEngine stub (QuestionScreen imzosi saqlanadi, TTS yo'q)
const getAudioEngine = () => null;
const useAudio = () => ({ muted: true, isPlaying: false, currentSegment: null, waitingFor: null, triggerEvent: () => {}, replay: () => {}, toggleMute: () => {} });

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
const LESSON_META = { lessonId: 'pm-m1d12-v1', lessonTitle: { uz: "Pitch: mahsulotni 2 daqiqada so'zlab berish", ru: 'Pitch' } };
// EKRAN-TARTIB (P0 naqshi): testlar teoriyaga biriktirilgan (s7 retseptdan keyin idx4 · s8 K12'dan keyin idx6 · s9 ustaxonadan keyin idx9).
const SCREEN_META = [
  { id: 's0',       type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },        // 0 · Demo Day ovoz-berish
  { id: 's1',       type: 'rule',        template: 'custom',   scored: false, scope: null },          // 1 · maqsad (pitch-karta jonli)
  { id: 's2',       type: 'exploration', template: 'custom',   scored: false, scope: null },          // 2 · sinfdosh-o'yin flip-mashq
  { id: 's3',       type: 'exploration', template: 'custom',   scored: false, scope: null },          // 3 · retsept-konstruktor
  { id: 's7',       type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' }, // 4 · TEST-1 (hotspot: xususiyat-sanash)
  { id: 's4',       type: 'case',        template: 'custom',   scored: false, scope: null },          // 5 · K12 Airbnb keys
  { id: 's8',       type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' }, // 6 · TEST-2 (nega muammo birinchi)
  { id: 's5',       type: 'exploration', template: 'custom',   scored: false, scope: null },          // 7 · amaliyot (MUAMMO-gap)
  { id: 'practice', type: 'practice',    template: 'custom',   scored: false, scope: null },          // 8 · ustaxona (pitch 3 qism)
  { id: 's9',       type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' }, // 9 · TEST-3 (MatchPairs juftlash)
  { id: 's10',      type: 'koding',      template: 'custom',   scored: false, scope: null },          // 10 · koding (sahna-karta compiler)
  { id: 's11',      type: 'recap',       template: 'custom',   scored: false, scope: null },          // 11
  { id: 's12',      type: 'homework',    template: 'custom',   scored: false, scope: null },          // 12
  { id: 'podium',   type: 'stats',       template: 'custom',   scored: false, scope: null },          // 13
  { id: 's16',      type: 'summary',     template: 'custom',   scored: false, scope: null }           // 14
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

function AchCounter() {
  const earned = useContext(AchCtx);
  const count = earned ? earned.size : 0;
  const total = Object.keys(ACHIEVEMENTS).length;
  const prevRef = useRef(count);
  const [bump, setBump] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (count > prevRef.current) { setBump(true); const t = setTimeout(() => setBump(false), 800); prevRef.current = count; return () => clearTimeout(t); }
    prevRef.current = count;
  }, [count]);
  return (
    <div className="ach-cnt-wrap">
      <button className={`ach-counter ${bump ? 'bump' : ''} ${count > 0 ? 'has' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Badges" title="Badges">
        <span className="ach-cnt-ic">🏅</span><b>{count}</b><span className="ach-cnt-tot">/{total}</span>
      </button>
      {open && (
        <div className="ach-pop" onMouseLeave={() => setOpen(false)}>
          <div className="ach-pop-h">🏅 Badges — {count}/{total}</div>
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
const NavNext = ({ disabled, label = 'Davom etish', onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? "Mentor hali bu sahifaga o'tmadi" : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? '⏳ Mentorni kuting' : (freeRide && disabled ? 'Davom etish' : label)}</button>;
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

// Scored ekranlar javob kaliti — darslik-jonli TASDIQLAYDI. s7 = hotspot (buzuq bo'lak),
// s8 = tashxis-test, s9 = MatchPairs (mukammal=0, aks holda=1). placeCorrect USLUBI YO'Q — haqiqiy indeks.
const INLINE_KEYS = { s7: 1, s8: 2, s9: 0, practice: -1 };
// Har scored ekran uchun qayta-tushuntirish (recap) — Metodist sayqallaydi. Kalitlar = scored ekran indeksi (4/6/9).
const RECAPS = {
  4: {
    title: "Raqam emas — vaziyat",
    cards: [
      { ic: "🥱", h: "Xususiyat-sanash kuchsiz", body: <>«4K, sekundiga 120 kadr» — raqamlar tinglovchiga <b>hech narsa his qildirmaydi</b>.</> },
      { ic: "🎯", h: "Vaziyat taniladi", body: <>Kuchli pitch tinglovchi <b>taniydigan vaziyatdan</b> boshlanadi — «bu men-ku!» dedirtiradi.</> },
      { ic: "🧩", h: "Uch qadam", body: <>Retsept: <b>MUAMMO → YECHIM → DEMO</b>. Har qadam o'z ishini qiladi — bittasi raqam-sanashga almashsa, pitch kuchsizlanadi.</>, ask: "«Saytimda 12 rasm bor» — bu qaysi xato?" },
    ]
  },
  6: {
    title: "Nega muammo birinchi?",
    cards: [
      { ic: "🏨", h: "Airbnb 1-slaydi", body: <>Airbnb pul so'raganda birinchi slaydga mahsulotni emas, <b>MUAMMOni</b> qo'ydi: mehmonxonalar qimmat.</> },
      { ic: "❤️", h: "Avval his qilsin", body: <>Tinglovchi muammoni <b>his qilsa</b> — yechimga o'zi qiziqadi. Maqsad — majburlash emas, ishontirish.</> },
      { ic: "📄", h: "Sodda slaydlar yetdi", body: <>O'nga yaqin <b>sodda slayd</b> — va bu pitch eng ko'p o'rganiladigan taqdimotlardan biriga aylandi.</>, ask: "Sizning 1-gapingiz qaysi muammoni his qildiradi?" },
    ]
  },
  9: {
    title: "Har bo'lakning o'z ishi",
    cards: [
      { ic: "😖", h: "MUAMMO — vaziyat", body: <>«Tasavvur qiling…» — tinglovchi <b>o'zini taniydigan</b> vaziyat. Pitch shu yerdan boshlanadi.</> },
      { ic: "💡", h: "YECHIM — sayt gapiradi", body: <>«Saytimda … bir joyda» — sayt muammoni <b>qanday hal qilishi</b> aniq aytiladi.</> },
      { ic: "📺", h: "DEMO — ishonch dalili", body: <>«Mana, ishlayapti» gapi bo'lmasa, pitch faqat <b>va'da</b> bo'lib qoladi.</>, ask: "Demo Day'da saytingizning qaysi joyini jonli ko'rsatasiz?" },
    ]
  }
};
// Overlay — ekran USTIDA ochiladi (indekslarga tegmaydi), slayd-slayd o'tiladi.
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
        {card.vis && <div className="rc-vis">{card.vis}</div>}
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
// MENTOR (proyektor): jonli test statistikasi — «Natijani ochish»gacha ✅/❌ soni yashirin (Kahoot-reveal).
// Sanoq FAQAT bitta manbadan: picked === correctIdx (server-kalit bilan mos).
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
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">xato ❌</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">kutilmoqda ⏳</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">javob berdi 📨</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">kutilmoqda ⏳</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.</p>
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
            {level === 'need' && <p className="mstats-verdict-t">⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</p>}
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
      {reveal && struggling && <p className="mstats-warn">⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.</p>}
      {answered === 0 && <p className="mstats-wait">O'quvchilar javoblari shu yerda jonli ko'rinadi…</p>}
    </div>
  );
}

// QuestionScreen — scored test/hotspot mexanikasi (jonli-ball KAFOLATLI: submitAnswer imzosi + Kahoot-reveal).
// Hotspot varianti: options = buzuq hikoya bo'laklari, correctIdx = buzuq bo'lak; renderMode='hotspot'.
const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, renderMode, ctaLabel, revealPrefix = "Buzuq bo'lak", storedAnswer, onAnswer, onNext, onPrev }) => {
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
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || live.mentorScreen > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  const isHotspot = renderMode === 'hotspot';
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? 'Davom etish' : 'Avval natijani oching') : solved ? 'Davom etish' : (ctaLabel || (oneShot ? 'Buzuq bo\'lakni bosing' : "Buzuq bo'lakni toping"))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>⚡ Jonli dars — bitta urinish, o'ylab bosing!</p>}
        <div className={`fade-up delay-1 ${isHotspot ? 'hs-parts' : ''}`} style={{ display: 'flex', flexDirection: isHotspot ? 'row' : 'column', flexWrap: isHotspot ? 'wrap' : 'nowrap', gap: isHotspot ? 10 : 9 }}>
          {options.map((opt, i) => {
            let cls = isHotspot ? 'hs-chip' : 'option';
            if (isMentorLive) {
              if (mReveal) { cls += i === correctIdx ? (isHotspot ? ' hs-broken' : ' option-correct') : (isHotspot ? ' hs-ok' : ' option-wrong'); }
            } else if (solved) {
              if (waiting) { if (i === picked) cls += isHotspot ? ' hs-wait' : ' option-wait'; }
              else { cls += i === correctIdx ? (isHotspot ? ' hs-broken' : ' option-correct') : (isHotspot ? ' hs-ok' : ' option-wrong'); if (wrongLocked && i === picked) cls += isHotspot ? ' hs-miss' : ' option-picked-wrong'; }
            }
            else if (i === picked) cls += isHotspot ? ' hs-miss' : ' option-picked-wrong';
            const showGreenLetter = isMentorLive ? (mReveal && i === correctIdx) : (solved && revealed && i === correctIdx);
            return (
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={isHotspot ? undefined : { padding: 'clamp(12px,1.8vw,16px) clamp(14px,2.2vw,20px)', fontSize: 'clamp(14px,1.7vw,16px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                {!isHotspot && <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>}
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

// MentorNote — MENTORGA maydoni: faqat mentor-rejimda. PROYEKTOR-SIR (2026-07-15):
// mentor ekrani katta ekranda ko'rinadi — eslatma DEFAULT YOPIQ xira chip; bir bosishda
// ochiladi, yana bosishda yopiladi; ekran almashganda komponent unmount bo'lib o'zi yopiladi.
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

// ===== SHARED PITCH STORAGE — s5 (MUAMMO-gap) va ustaxona (3 qism) BITTA kalitni ishlatadi =====
// s5'dagi MUAMMO-gap ustaxonaga ko'chib keladi; ustaxona YECHIM + DEMO (+⭐ ilgak) qo'shadi = pitch (artefakt).
// KODING'da avto-quyish YO'Q — o'quvchi gaplarini O'ZI ko'chirib yozadi (M1-D2 konvensiyasi).
const PITCH_KEY = 'pm-m1d12-pitch';
const readPitch = () => { try { const o = JSON.parse(localStorage.getItem(PITCH_KEY) || 'null'); return (o && typeof o === 'object') ? o : null; } catch { return null; } };
const writePitch = (o) => { try { localStorage.setItem(PITCH_KEY, JSON.stringify(o)); } catch {} };

// ===== PM PRIMITIV: pitch-validator (P0 validateStory naqshi, pitch-shartlarga moslangan) =====
// MUAMMO — tinglovchi haqida («sayt» so'zisiz) · YECHIM — sayt gapiradi («sayt» so'zi bor) · DEMO — aniq joy.
const validatePitch = (p) => {
  const muammo = (p.muammo || '').trim(), yechim = (p.yechim || '').trim(), demo = (p.demo || '').trim();
  const muammoOk = muammo.length >= 15 && !/sayt/i.test(muammo);
  const yechimOk = yechim.length >= 12 && /sayt/i.test(yechim);
  const demoOk = demo.length >= 8;
  return { muammoOk, yechimOk, demoOk, full: muammoOk && yechimOk && demoOk };
};
// ===== 🎯 TOPSHIRIQ-PANEL (TaskSpec) — o'quvchi yozadigan HAR ekranning yagona shart-tili =====
// UX-qonun: shartlar PROZAGA yozilmaydi — shu panelda chip bo'lib turadi. Chip = raqam + ≤4 so'z;
// bajarilganda yashil ✓ + pop (kompilyator hc-cond bilan bitta vizual oila). Batafsil matn chip
// ostida, DEFAULT YOPIQ (matn-diyeta). Ball-mantiqqa aloqasi yo'q — faqat ko'rinish qatlami.
const TaskSpec = ({ items, sticky }) => {
  const [openIdx, setOpenIdx] = useState(-1);
  const doneN = items.filter(i => i.done).length;
  const allDone = doneN === items.length;
  return (
    <div className={`tspec ${sticky ? 'sticky' : ''} ${allDone ? 'all' : ''} fade-up`}>
      <div className="tspec-h">
        <span className="tspec-ttl">🎯 Topshiriq</span>
        <span className={`tspec-cnt ${allDone ? 'ok' : ''}`}>{doneN}/{items.length}</span>
      </div>
      <div className="tspec-chips">
        {items.map((it, i) => (
          <button key={i} type="button" className={`tspec-chip ${it.done ? 'on' : ''} ${openIdx === i ? 'open' : ''}`}
            onClick={() => it.detail && setOpenIdx(openIdx === i ? -1 : i)} aria-expanded={openIdx === i}>
            <span className="tspec-box">{it.done ? '✓' : i + 1}</span>
            <span className="tspec-lbl">{it.label}</span>
            {it.detail && <span className="tspec-car" aria-hidden="true">{openIdx === i ? '▾' : '▸'}</span>}
          </button>
        ))}
      </div>
      {openIdx >= 0 && items[openIdx] && items[openIdx].detail && <p className="tspec-detail fade-step">💡 {items[openIdx].detail}</p>}
    </div>
  );
};

// 31-qonun: jonli darsda amaliyotni KIM bajarishi EKRANDA yoziladi — faqat mentorga ko'rinadi.
const MentorWatchLine = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  if (!live || live.mode !== 'mentor') return null;
  return <p className="mwatch fade-up">👨‍🏫 {children}</p>;
};

// ===== SCREEN 0 — HOOK: Demo Day ovoz-berish (imzo-sahna: sahna-chiroqlari to'ladi) =====
// Javob SIR — keys-ekranda (K12 Airbnb) ochiladi. Ovoz unscored (correct=false), P0 relsi.
const HOOK_OPTS = [
  { t: "«Bu mening saytim, unda menyu bor, rasm bor…»", d: "bo'limlarni sanash" },
  { t: "«Tasavvur qiling: …»", d: "muammodan boshlash" },
  { t: "«Men 3 hafta ishladim…»", d: "mehnatni aytish" },
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [counts, setCounts] = useState(null);
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  // Jonli: shu ekran (0) ovozlarini o'qiymiz — real sinf diagrammasi
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
    if (picked !== null || (live && live.mode === 'mentor')) return;
    setPicked(i);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: i, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const isMentor = live && live.mode === 'mentor';
  const shown = counts || (picked !== null ? HOOK_OPTS.map((_, i) => (i === picked ? 1 : 0)) : null);
  const totalVotes = shown ? shown.reduce((a, b) => a + b, 0) : 0;
  const revealViz = shown && (picked !== null || isMentor);
  const topIdx = revealViz ? shown.indexOf(Math.max(...shown)) : -1;
  return (
    <Stage eyebrow="Kirish · Demo Day arafasi" screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? 'Avval ovoz bering' : 'Davom etish'} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="hook-hero fade-up"><span className="hook-cup">🎤</span></div>
        <div className="head"><h2 className="title h-title fade-up" style={{ textAlign: 'center' }}>Ertaga <span className="italic" style={{ color: T.accent }}>Demo Day</span> — nimadan boshlaysiz?</h2></div>
        <Mentor>Saytingizni ota-onalar va mehmonlar oldida ko'rsatasiz — sizga <b style={{ color: T.ink }}>2 daqiqa</b> beriladi. Qaysi boshlanish kuchli — ovoz bering.</Mentor>
        <MentorNote>To'g'ri javobni AYTMANG — u keys-ekranda ochiladi. Demo Day ertaga ekanini his qildiring: bu shunchaki mashq emas, ertangi sahnaga tayyorgarlik. 2 daqiqadan oshirmang.</MentorNote>
        <div className="hook-menu one fade-up delay-1">
          {HOOK_OPTS.map((o, i) => {
            const on = picked === i;
            const locked = picked !== null || isMentor;
            return (
              <button key={i} className={`hook-mc ${on ? 'on' : ''} ${!locked ? 'taphint' : ''}`} disabled={locked} onClick={() => pick(i)}>
                <span className="hook-mc-abc">{String.fromCharCode(65 + i)}</span>
                <span className="hook-mc-txt">{o.t}<span className="hook-mc-sub">{o.d}</span></span>
                <span className="hook-mc-cup" aria-hidden="true">🎤</span>
              </button>
            );
          })}
        </div>
        {revealViz && (
          <div className="spot-shelf fade-step" aria-label="Ovoz natijalari — sahna chiroqlarida">
            <div className="spot-row">
              {HOOK_OPTS.map((o, i) => {
                const n = shown[i];
                const pct = totalVotes ? Math.round((n / totalVotes) * 100) : 0;
                return (
                  <div key={i} className={`spotl ${picked === i ? 'mine' : ''}`}>
                    {i === topIdx && totalVotes > 0 && <span className="spotl-star" aria-hidden="true">⭐</span>}
                    <span className="spotl-pct">{pct}%</span>
                    <span className="spotl-cap" aria-hidden="true" />
                    <div className="spotl-beam">
                      <span className="spotl-fill" style={{ height: `${Math.max(pct, totalVotes ? 4 : 0)}%` }} />
                    </div>
                    <span className="spotl-abc">{String.fromCharCode(65 + i)}</span>
                  </div>
                );
              })}
            </div>
            <p className="spot-note">{isMentor ? "Sinf ovozi — chiroqlar to'lgani sari fikr aniqlashadi. To'g'ri javobni hali ochmang." : "Ovozingiz sahna chirog'ini yoqdi! Javobni birozdan keyin real voqeada birga ochamiz. 😉"}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD: jonli natija-preview — SAHNA/PROYEKTOR imzo-vizuali (23-qonun: klon emas) =====
// WOW-moment: qorong'i sahnada proyektor nuri ostida pitch-karta qatorlari o'z-o'zidan tiziladi
// (CSS-taymlayn), oxirida «SAHNAGA TAYYOR» shtampi. reduced-motion'da darhol to'liq holat.
// Namuna-kontent (galereya-sayt) keyingi mashq javobini oshkor qilmaydi.
const DEMO_PITCH = [
  { key: 'muammo', lbl: 'MUAMMO', txt: 'Rasmlaringiz telefonda sochilib yotibdi' },
  { key: 'yechim', lbl: 'YECHIM', txt: 'Saytim ularni bitta galereyaga jamlaydi' },
  { key: 'demo',   lbl: 'DEMO',   txt: 'Mana, galereya shu yerda ochiladi' },
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow="Maqsad" screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label="Boshlaymiz →" onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">Ertaga sahnada <span className="italic" style={{ color: T.accent }}>nima bilan</span> chiqasiz?</h2></div>
      <Mentor>Dars oxirida sizda 2 daqiqalik <b style={{ color: T.ink }}>pitch</b> — qisqa ishontiruvchi nutq — tayyor bo'ladi. Qarang, u sahnada qanday tiziladi.</Mentor>
      <div className="pstage fade-up delay-1">
        <span className="pstage-beam" aria-hidden="true" />
        <div className="pstage-head"><span className="pstage-live">🎬 SAHNA</span><span className="pstage-timer mono">⏱ 2:00</span></div>
        <div className="pstage-card">
          {DEMO_PITCH.map((r, i) => (
            <div key={r.key} className={`pp-row ${r.key}`} style={{ '--pd': `${0.9 + i * 1.05}s` }}>
              <span className="pp-lbl">{r.lbl}</span>
              <span className="pp-txt">{r.txt}</span>
            </div>
          ))}
          <span className="pstage-stamp" style={{ '--pd': '4.3s' }}>✓ SAHNAGA TAYYOR</span>
        </div>
        <span className="pstage-mic" aria-hidden="true">🎤</span>
      </div>
      <div className="takeaway fade-up delay-2"><span className="ta-bulb">🎯</span><p className="ta-h">Sizning pitchingiz ham shunday tiziladi.</p><p className="ta-sub">Ertaga Demo Day'da aynan shu nutq bilan chiqasiz</p></div>
    </div>
  </Stage>
);

// ===== SCREEN 2 — YADRO (1-savol): sinfdosh-o'yin misoli — FLIP-KARTA mashq (24-qonun: interaktiv muhokama) =====
// Ikki gap — ikkita ag'dariladigan karta: bosilganda «miyangiz nima deydi» ochiladi. UNSCORED.
// Misol senariydan yangi (kundalik-jurnal takrori emas): sinfdosh o'yinga 30 soniyada ishontirdi.
const S2_CARDS = [
  { id: 'a', tag: 'xususiyat-sanash', front: "«Grafikasi 4K, sekundiga 120 kadr…»", back: "🥱 Raqamlar yodda qolmadi — o'rnatgingiz ham kelmadi.", cat: 'weak' },
  { id: 'b', tag: 'vaziyat-hikoya', front: "«Zerikkanimda ochaman — vaqt qanday o'tganini bilmay qolaman»", back: "👀 «Menda ham shunday!» — o'sha kuni o'rnatib oldingiz.", cat: 'strong' },
];
const Screen2 = ({ screen, onNext, onPrev }) => {
  const [flipped, setFlipped] = useState({});
  const both = S2_CARDS.every(c => flipped[c.id]);
  return (
    <Stage eyebrow="Muhokama · sinfdosh siri" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!both} label={both ? 'Davom etish' : 'Ikkala gapni oching'} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Sinfdoshingiz sizni o'yinga 30 soniyada qanday <span className="italic" style={{ color: T.accent }}>ishontirdi</span>?</h2></div>
        <Mentor>U shunday maqtadiki — o'sha kuni o'rnatib oldingiz. Har gapni bosing: miyangiz qaysi biriga «xo'p» deydi?</Mentor>
        <MentorNote>Frontal tushuntirish jami 10 daqiqadan oshmasin. D2 auditoriya-kartasi va D5 strukturasi shu pitchning xom-ashyosi ekanini keyingi ekranlarda bog'laysiz.</MentorNote>
        <div className="pflip-row fade-up delay-1">
          {S2_CARDS.map(c => (
            <button key={c.id} className={`pflip ${flipped[c.id] ? 'flipped' : ''}`} onClick={() => setFlipped(p => ({ ...p, [c.id]: true }))} aria-pressed={!!flipped[c.id]}>
              <span className="pflip-inner">
                <span className="pflip-face pflip-front">
                  <span className="pf-tag">{c.tag}</span>
                  <span className="pf-txt">{c.front}</span>
                  <span className="pf-hint">👆 bosing — miyangiz nima deydi?</span>
                </span>
                <span className={`pflip-face pflip-back ${c.cat}`}>
                  <span className="pf-tag">{c.tag}</span>
                  <span className="pf-back-txt">{c.back}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
        {both && (
          <>
            <div className="done-mini fade-step">✅ Sirni ochdingiz! <span className="dm-sub">— u sizga VAZIYATNI aytdi</span></div>
            <div className="ex-card fade-step">
              <span className="ex-lbl">🎮 Kuchli hikoya raqam sanamaydi</span>
              <p className="ex-body">U <b>tinglovchi taniydigan vaziyatni</b> aytdi — siz o'zingizni ko'rdingiz. Kuchli pitch xuddi shunday ishlaydi.</p>
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — YADRO (2-qoida): RETSEPT-KONSTRUKTOR — ta'riflarni uch qadamga joylash (P0 fslot relsi) =====
const FRAG_POOL = [
  { txt: "tinglovchi taniydigan vaziyat", slot: 0 },
  { txt: "mahsulot muammoni qanday hal qiladi", slot: 1 },
  { txt: "jonli ko'rsatish: mana, ishlayapti!", slot: 2 },
];
const SLOT_META = [
  { key: 'kim', label: 'MUAMMO', hint: 'vaziyat' },
  { key: 'nima', label: 'YECHIM', hint: 'hal qilish' },
  { key: 'natija', label: 'DEMO', hint: 'jonli isbot' },
];
// Bo'laklar ATAY aralash tartibda (slot-tartibi emas) va rang-ishorasiz chiqadi — haqiqiy sinov.
const FRAG_ORDER = [1, 2, 0]; // FRAG_POOL indekslari (barqaror permutatsiya — StrictMode-safe, Math.random YO'Q)
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [st, setSt] = useState(() => ({ placed: storedAnswer?.placed || [null, null, null], sel: -1, shake: -1 }));
  const done = st.placed.every(p => p !== null);
  // Chipni tanlash (yoki tanlovni bekor qilish) — hali rang bermaydi
  const pickChip = (idx) => {
    const f = FRAG_POOL[idx];
    if (st.placed[f.slot] === f.txt) return; // allaqachon joylashgan
    setSt(prev => ({ ...prev, sel: prev.sel === idx ? -1 : idx, shake: -1 }));
  };
  // Slotga urinish — tanlangan chip SHU slotga mos kelsagina joylashadi, aks holda silkinadi
  const trySlot = (slotIdx) => {
    if (st.placed[slotIdx] !== null || st.sel < 0) return;
    const frag = FRAG_POOL[st.sel];
    if (frag.slot === slotIdx) {
      const placed = [...st.placed]; placed[slotIdx] = frag.txt;
      setSt({ placed, sel: -1, shake: -1 });
      if (placed.every(p => p !== null) && storedAnswer === undefined) onAnswer(screen, { placed, correct: true });
    } else {
      setSt(prev => ({ ...prev, shake: slotIdx }));
      setTimeout(() => setSt(prev => (prev.shake === slotIdx ? { ...prev, shake: -1 } : prev)), 480);
    }
  };
  const reset = () => setSt({ placed: [null, null, null], sel: -1, shake: -1 });
  const selActive = st.sel >= 0;
  return (
    <Stage eyebrow="Retsept" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? 'Davom etish' : 'Uch ta\'rifni joylang'} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Kuchli pitch retseptini o'zingiz <span className="italic" style={{ color: T.accent }}>yig'a olasizmi</span>?</h2></div>
        <Mentor>Kuchli hikoya uch qadam: <b style={{ color: T.ink }}>MUAMMO → YECHIM → DEMO</b>. Har ta'rifni o'z qadamiga joylang.</Mentor>
        <div className="formula-line fade-up delay-1">
          <span className="fw">Kuchli pitch:</span>
          {SLOT_META.map((s, i) => (
            <React.Fragment key={s.key}>
              <button
                className={`fslot ${s.key} ${st.placed[i] ? 'filled' : ''} ${st.shake === i ? 'shake' : ''} ${selActive && st.placed[i] === null ? 'targetable' : ''}`}
                disabled={st.placed[i] !== null}
                onClick={() => trySlot(i)}
              >{st.placed[i] ? `${s.label}: ${st.placed[i]}` : s.label}</button>
              {i < 2 && <span className="fw">→</span>}
            </React.Fragment>
          ))}
        </div>
        <p className="flow-label fade-up delay-1">Ta'riflar — avval tanlang, keyin qadamga bosing</p>
        <div className="frag-pool fade-up delay-2">
          {FRAG_ORDER.map((idx) => {
            const f = FRAG_POOL[idx];
            const used = st.placed[f.slot] === f.txt;
            return <button key={idx} className={`frag-chip ${used ? 'used' : ''} ${st.sel === idx ? 'sel' : ''}`} disabled={used} onClick={() => pickChip(idx)}>{f.txt}</button>;
          })}
        </div>
        {done && (
          <div className="fade-step" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div className="done-mini">✅ Retsept tayyor! <span className="dm-sub">— endi uni real sahnada ko'ramiz</span></div>
            <button className="btn-soft" onClick={reset}>↻ Qaytadan</button>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — KEYS K12: Airbnb pitch-deck bosqichma-bosqich (hook-javob shu yerda ochiladi) =====
const K12_SLIDES = [
  { ic: "🗳️", h: "Avval ovozingiz javobi", body: <>Dars boshida so'ragan edik: nimadan boshlaysiz? Kuchli pitch <b>muammodan boshlanadi</b> — «Tasavvur qiling…». Nega? Hozir real voqeada ko'ramiz.</> },
  { ic: "🏨", h: "1-slayd: MUAMMO", body: <>Airbnb pul qo'yadigan investorlar oldiga chiqdi. Birinchi slaydda mahsulot emas — muammo: <b>mehmonxonalar qimmat</b>.</> },
  { ic: "🔑", h: "2-slayd: YECHIM", body: <>Keyin yechim: odamlarning <b>bo'sh xonalarini</b> sayohatchilarga ijaraga berish.</> },
  { ic: "💻", h: "Keyin — mahsulotning o'zi", body: <>Va nihoyat mahsulot: sayt qanday ishlashi. Avval muammoni <b>his qildirdi</b>, keyin ko'rsatdi.</> },
  { ic: "🌍", h: "O'nga yaqin sodda slayd", body: <>Shu tartib bilan o'nga yaqin sodda slayd — va bu pitch <b>eng ko'p o'rganiladigan</b> taqdimotlardan biriga aylandi, internetda ochiq turibdi.</> },
];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [i, setI] = useState(0);
  const last = i === K12_SLIDES.length - 1;
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last]); // eslint-disable-line
  const c = K12_SLIDES[i];
  return (
    <Stage eyebrow="Keys (real voqea tahlili) 🏠" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={last ? 'Davom etish' : `Keyingi bosqich (${i + 1}/${K12_SLIDES.length})`} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Airbnb sirini ochamiz: kuchli pitch <span className="italic" style={{ color: T.accent }}>nimadan</span> boshlanadi?</h2></div>
        <div className="k-slide fade-step" key={i}>
          <span className="k-slide-eyebrow">🏠 Airbnb keysi · {i + 1} / {K12_SLIDES.length}</span>
          <div className="k-slide-ic">{c.ic}</div>
          <h3 className="k-slide-h">{c.h}</h3>
          <p className="k-slide-body">{c.body}</p>
        </div>
        <div className="k-dots">{K12_SLIDES.map((_, k) => <button key={k} className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}-bosqich`} />)}</div>
        {last && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>Xuddi Airbnb kabi — sizning pitchingiz ham MUAMMOdan boshlanadi. Keyingi ekranda birinchi gapingizni yozasiz.</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 5 — AMALIYOT: pitchning birinchi (MUAMMO) gapini yozish — split + sahna-monitor (28-qonun) =====
// D2 auditoriya-kartasidagi MUAMMO shu gapning xom-ashyosi. Gap PITCH_KEY'ga yoziladi — ustaxonaga ko'chadi.
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate5 = useContext(LiveGateCtx) || {};
  const isMentor5 = !!(gate5.live && gate5.live.mode === 'mentor');
  const [st, setSt] = useState(() => {
    const saved = readPitch();
    return { muammo: (saved && saved.muammo) || storedAnswer?.muammo || '', helpOpen: false };
  });
  const { muammo, helpOpen } = st;
  const txt = muammo.trim();
  const hasLen = txt.length >= 15;
  const noSite = txt.length > 0 && !/sayt/i.test(txt);
  const done = hasLen && noSite;
  const setMuammo = (v) => {
    setSt(prev => ({ ...prev, muammo: v }));
    const t = v.trim();
    onAnswer(screen, { muammo: v, correct: t.length >= 15 && !/sayt/i.test(t) });
    const prev = readPitch() || {};
    writePitch({ ...prev, muammo: v });
  };
  return (
    <Stage eyebrow="Amaliyot · birinchi gap" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor5} label={done || isMentor5 ? 'Davom etish' : !hasLen ? '① Vaziyat gapini yozing' : "② «Sayt» so'zini olib tashlang"} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Pitchingizning birinchi gapi <span className="italic" style={{ color: T.accent }}>kim haqida</span>?</h2></div>
        <Mentor>Tinglovchi «bu men-ku!» deydigan vaziyatni bitta gapda ayting.</Mentor>
        <MentorWatchLine>Bu amaliyotni <b>o'quvchilar</b> bajaradi — siz kuzatasiz; «Davom etish» siz uchun ochiq.</MentorWatchLine>
        <div className="split">
          <Col>
            {/* BUG-QO'RIQ (metrika.png sinfi, 2026-07-22): fade-up + .pwrite.ok animatsiya-to'qnashuvi
                elementni opacity:0 da g'oyib qilardi — editor opacity-animatsiyaga BOG'LANMAYDI. */}
            <div className={`pwrite muammo ${done ? 'ok' : ''}`}>
              <span className="pwrite-lbl muammo">MUAMMO — ochilish gapi</span>
              <textarea className="pwrite-ta" value={muammo} onChange={e => setMuammo(e.target.value)} placeholder="Tasavvur qiling: …" />
            </div>
            <div className={`yordam ${helpOpen ? 'open' : ''} fade-up delay-2`}>
              <button className="yordam-toggle" onClick={() => setSt(prev => ({ ...prev, helpOpen: !prev.helpOpen }))}>💡 Yordam kerakmi? {helpOpen ? '▾' : '▸'}</button>
              {helpOpen && <div className="yordam-body">
                <p>Auditoriya-kartangizni eslang (2-dars): <b>MUAMMO</b> qatori tayyor turibdi.</p>
                <p className="yordam-hint">O'sha qatorni tinglovchiga aytiladigan GAPga aylantiring.</p>
              </div>}
            </div>
          </Col>
          <Col>
            <TaskSpec sticky items={[
              { done: hasLen, label: 'Vaziyat-gap yozildi', detail: "Kamida bitta to'liq gap — tinglovchi taniydigan vaziyat." },
              { done: noSite && txt.length > 0, label: 'Tinglovchi haqida', detail: "Birinchi gapda «sayt» so'zi bo'lmasin — sayt keyin, YECHIMda gapiradi. «Men sayt yasadim» EMAS." },
            ]} />
            <div className="pmon fade-up delay-1">
              <span className="pmon-lbl">🎬 Ochilishingiz sahnada</span>
              <p className={`pmon-txt ${txt ? '' : 'empty'}`}>{txt || 'Gapingiz shu yerda jonli ko\'rinadi…'}</p>
              <span className={`pmon-status ${done ? 'ok' : ''}`}>{done ? '✓ Sahnaga tayyor' : '⏳ Yozilmoqda…'}</span>
            </div>
            {done && <div className="done-mini fade-step">✅ Ochilish gapi tayyor <span className="dm-sub">— ustaxonaga ko'chdi</span></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== 🛠️ JONLI PRAKTIKA signal-zonasi (500+): test <100 · arena 100+ bilan to'qnashmaydi =====
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

// ===== SCREEN 6 (practice) — PITCH-USTAXONA: 3 qism (MUAMMO · YECHIM · DEMO-gap) + ⭐ ilgak =====
// s5'dagi MUAMMO-gap PITCH_KEY orqali ko'chib keladi; o'quvchi YECHIM va DEMO-gapni qo'shadi = pitch.
// Ertaga sahnada AYNAN shu matn aytiladi; koding sahna-kartasi ham shu gaplardan quriladi (qo'lda).
const PW_FIELDS = [
  { key: 'muammo', lbl: 'MUAMMO', sub: 'tinglovchi taniydigan vaziyat · 1-2 gap', ph: 'Tasavvur qiling: …' },
  { key: 'yechim', lbl: 'YECHIM', sub: 'saytingiz buni qanday hal qiladi · 1-2 gap', ph: 'Saytimda …' },
  { key: 'demo', lbl: 'DEMO-GAP', sub: "saytda nimani jonli ko'rsatasiz · 1 gap", ph: 'Mana, … shu yerda ishlaydi' },
];
const initPitch = (storedAnswer) => {
  if (storedAnswer?.pitch) return { ilgak: '', ...storedAnswer.pitch };
  const saved = readPitch() || {};
  return { muammo: saved.muammo || '', yechim: saved.yechim || '', demo: saved.demo || '', ilgak: saved.ilgak || '' };
};
const ScreenPitchWorkshop = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [st, setSt] = useState(() => ({
    pitch: initPitch(storedAnswer),
    done: !!(storedAnswer && storedAnswer.solved),
    helpOpen: false,
    starOpen: false,
  }));
  const { pitch, done, helpOpen, starOpen } = st;
  const v = validatePitch(pitch);
  // TOPSHIRIQ-PANEL chiplari: yorliq ≤4 so'z, batafsili chip ichida (default yopiq) — RO'YXAT 3 band
  const checks = [
    { ok: v.muammoOk, label: 'MUAMMO — vaziyat', detail: "Tinglovchi taniydigan vaziyat, 1-2 gap. «Men sayt yasadim» EMAS — «sayt» so'zi keyingi qismda gapiradi." },
    { ok: v.yechimOk, label: 'YECHIMda sayt gapiradi', detail: "Saytingiz muammoni qanday hal qiladi — «sayt» so'zi shu yerda qatnashsin." },
    { ok: v.demoOk, label: 'DEMO-joy nomlangan', detail: "Demo Day'da saytning ANIQ qaysi joyini jonli ko'rsatasiz — bitta gap." },
  ];
  const passed = checks.every(c => c.ok);
  const isMentorW = !!(live && live.mode === 'mentor');
  // 30-qonun: qulflangan tugma AYNAN qaysi shart qolganini aytadi
  const navLabel = done || isMentorW ? 'Davom etish'
    : !v.muammoOk ? '① MUAMMO gapini tugating'
    : !v.yechimOk ? '② YECHIMda saytingiz gapirsin'
    : !v.demoOk ? '③ DEMO joyini nomlang'
    : '«✅ Bajardim»ni bosing';
  const setField = (key, val) => setSt(prev => {
    const pitch = { ...prev.pitch, [key]: val };
    writePitch(pitch);
    return { ...prev, pitch };
  });
  const complete = () => {
    if (done || !passed) return;
    setSt(prev => ({ ...prev, done: true }));
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'pitch-workshop', pitch, solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  const scriptRows = [
    pitch.ilgak.trim() && { lbl: '⭐', txt: pitch.ilgak.trim(), key: 'ilgak' },
    { lbl: 'MUAMMO', txt: pitch.muammo.trim(), key: 'muammo' },
    { lbl: 'YECHIM', txt: pitch.yechim.trim(), key: 'yechim' },
    { lbl: 'DEMO', txt: pitch.demo.trim(), key: 'demo' },
  ].filter(Boolean);
  return (
    <Stage eyebrow="Mustaqil ish · pitch-ustaxona ✍️" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentorW} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Pitchingiz sahna sinovidan <span className="italic" style={{ color: T.accent }}>o'ta oladimi</span>?</h2></div>
        <Mentor>Ochilish gapingiz ko'chib keldi — endi <b style={{ color: T.ink }}>YECHIM</b> va <b style={{ color: T.ink }}>DEMO-gap</b>ni qo'shing.</Mentor>
        <MentorWatchLine>Bu mustaqil ishni <b>o'quvchilar</b> bajaradi — «✍️ yozib bo'lganlar» chiplarida kuzatasiz; «Davom etish» siz uchun ochiq.</MentorWatchLine>
        <div className="split">
          <Col>
            {PW_FIELDS.map((f, i) => {
              const ok = [v.muammoOk, v.yechimOk, v.demoOk][i];
              const seeded = f.key === 'muammo' && pitch.muammo.trim();
              return (
                <div key={f.key} className={`pwrite ${f.key} ${ok ? 'ok' : ''}`}>
                  <span className={`pwrite-lbl ${f.key}`}>{f.lbl} <i className="pwrite-sub">{f.sub}</i>{seeded ? <i className="pwrite-kept">↩ ko'chdi</i> : null}</span>
                  <textarea className="pwrite-ta" rows={f.key === 'demo' ? 2 : 3} value={pitch[f.key]} onChange={e => setField(f.key, e.target.value)} placeholder={f.ph} />
                </div>
              );
            })}
          </Col>
          <Col>
            <TaskSpec sticky items={checks.map(c => ({ done: c.ok, label: c.label, detail: c.detail }))} />
            <div className={`yordam ${helpOpen ? 'open' : ''} fade-up`}>
              <button className="yordam-toggle" onClick={() => setSt(prev => ({ ...prev, helpOpen: !prev.helpOpen }))}>💡 Yordam kerakmi? {helpOpen ? '▾' : '▸'}</button>
              {helpOpen && <div className="yordam-body">
                <p>Auditoriya-kartangizni oching (2-dars) — <b>MUAMMO</b> qatori tayyor turibdi, uni gapga aylantiring.</p>
                <p className="yordam-hint">YECHIM = saytingiz o'sha muammoni qanday yechadi.</p>
              </div>}
            </div>
            <div className={`yordam ${starOpen ? 'open' : ''} fade-up`}>
              <button className="yordam-toggle" onClick={() => setSt(prev => ({ ...prev, starOpen: !prev.starOpen }))}>⭐ Yulduzcha: ilgak-gap {starOpen ? '▾' : '▸'}</button>
              {starOpen && <div className="yordam-body">
                <p>Tinglovchini <b>birinchi soniyadan</b> tortadigan ochuvchi gap qo'shing — savol yoki kutilmagan fakt: «Tasavvur qiling…», «Bilasizmi…».</p>
                <input className="reflect-input" value={pitch.ilgak} onChange={e => setField('ilgak', e.target.value)} placeholder="Bilasizmi, …" maxLength={120} />
              </div>}
            </div>
            {scriptRows.some(r => r.txt) && (
              <div className="pscript fade-up">
                <span className="pmon-lbl">📜 2 daqiqalik pitchingiz</span>
                {scriptRows.map(r => r.txt ? <p key={r.key} className="pscript-row"><b className={`pscript-lbl ${r.key}`}>{r.lbl}</b>{r.txt}</p> : null)}
              </div>
            )}
            <MentorPracticeStats live={live} screen={screen} label="✍️ Pitchni yozib bo'lganlar" />
            <button className={`lp-done-btn ${done ? 'is-done' : ''}`} disabled={done || !passed} onClick={complete}>
              {done ? '✓ Bajarildi — ustozni kuting' : passed ? '✅ Bajardim' : `🎯 Topshiriq: ${checks.filter(c => c.ok).length}/3`}
            </button>
            {done && <div className="done-mini fade-step">✅ Pitch tayyor <span className="dm-sub">— ertaga sahnada shu aytiladi</span></div>}
          </Col>
        </div>
        <MentorNote>3/3 = qabul · 2/3 = joyida qayta ishlash · undan kam = maslahat bilan qaytadan. «Saytim haqida» deb boshlaganlarni to'xtating: birinchi gap — tinglovchi HAQIDA.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7/8 — TEKSHIRUV: buzuq pitch (hotspot) + Airbnb tashxis-testi (QuestionScreen relsi) =====
const BrokenStory = ({ text, tag, lead, cue }) => (
  <div className="proj-q broken">
    <span className="proj-q-lbl">🔎 {tag}</span>
    <p className="broken-cue">{lead}</p>
    <p className="broken-story">«{text}»</p>
    <p className="broken-cue"><b>{cue}</b></p>
  </div>
);
const Screen7 = (props) => (
  <QuestionScreen {...props} eyebrow="Tekshiruv · pitch 1" scope="module-mikro" renderMode="hotspot"
    ctaLabel="Kuchsiz bo'lakni bosing" revealPrefix="Kuchsiz bo'lak"
    question={<BrokenStory tag="Pitch 1/3"
      lead="Bir o'quvchi o'yin haqidagi pitchini uch bo'lakda aytdi:"
      text="Tasavvur qiling: kechqurun zerikib o'tiribsiz. Grafikasi 4K, sekundiga 120 kadr. Mana, o'yin telefonimda ishlayapti."
      cue="Qaysi bo'lak pitchni KUCHSIZLANTIRYAPTI? Ustiga bosing." />}
    questionText="Buzuq pitch: xususiyat-sanash"
    options={["Tasavvur qiling: kechqurun zerikib o'tiribsiz", "Grafikasi 4K, sekundiga 120 kadr", "Mana, o'yin telefonimda ishlayapti"]}
    correctIdx={1}
    explainCorrect="«4K, 120 kadr» — xususiyat-sanash: raqamlar tinglovchiga hech narsa his qildirmaydi. Bu joyda YECHIM gapi bo'lishi kerak: o'yin zerikishni qanday ketkazadi."
    explainWrong={{ 0: "«Tasavvur qiling…» — bu kuchli MUAMMO-boshlanish, joyida. Kuchsiz bo'lak — raqam sanayotgani. O'sha bo'lakni bosing.", 2: "«Mana, ishlayapti» — bu DEMO, ishonch dalili, joyida. Kuchsizi — raqam sanash. O'sha bo'lakni bosing.", default: "Xususiyat-sanash bo'lagini bosing — raqamlar vaziyatni his qildirmaydi." }}
  />
);
const Screen8 = (props) => (
  <QuestionScreen {...props} eyebrow="Tekshiruv · pitch 2" scope="module-mikro"
    ctaLabel="Javobni tanlang" revealPrefix="To'g'ri javob"
    question={<BrokenStory tag="Airbnb keysi"
      lead="Airbnb o'z taqdimotini shu slayddan boshladi:"
      text="1-slayd: Mehmonxonalar qimmat"
      cue="Nega mahsulotdan emas, MUAMMOdan boshlashdi? Javobni tanlang." />}
    questionText="Airbnb: nega muammo birinchi"
    options={["Chunki mahsulot o'sha paytda hali to'liq tayyor bo'lmagan edi", "Chunki taqdimotda slaydlar soni ko'p bo'lishi shart edi", "Tinglovchi avval muammoni his qilsin — keyin yechimga o'zi qiziqadi"]}
    correctIdx={2}
    explainCorrect="To'g'ri! Tinglovchi muammoni his qilsa, yechimga o'zi qiziqadi. Shuning uchun sizning pitchingiz ham MUAMMOdan boshlanadi — majburlash emas, ishontirish."
    explainWrong={{ 0: "Gap mahsulot tayyorligida emas: muammo-slayd tinglovchini HIS QILDIRISH uchun birinchi turadi — keyin yechimga o'zi qiziqadi.", 1: "Aksincha — Airbnb'ga o'nga yaqin sodda slayd yetdi. Muammo birinchi turadi: tinglovchi his qilsin, keyin yechimga o'zi qiziqsin.", default: "Muammo birinchi: tinglovchi avval his qilsin — keyin yechimga o'zi qiziqadi." }}
  />
);

// ===== SCREEN 9 — TEKSHIRUV (TEST-3): MatchPairs — 3 pitch-bo'lak ↔ MUAMMO/YECHIM/DEMO (scored, Kahoot-reveal) =====
// KONTRAKT (PmJtbdLesson/PmMetricsLesson konvensiyasi AYNAN): chip → nishon · atomik holat (yagona useState) ·
// drag + tap-fallback · scored: birinchi-urinish mukammal → picked=0, aks holda picked=1 · INLINE_KEYS.s9=0 · Kahoot-reveal.
const MATCH_PAIRS = [
  { id: 'muammo', chip: 'MUAMMO', ic: '😖', target: '«Tasavvur qiling: repetitor kerak, lekin qayerdan izlashni bilmaysiz»' },
  { id: 'yechim', chip: 'YECHIM', ic: '💡', target: '«Saytimda tekshirilgan repetitorlar bir joyda»' },
  { id: 'demo',   chip: 'DEMO',   ic: '📺', target: '«Mana, qidiruv shu yerda ishlaydi»' },
];
// Fon-dekor tokenlari (27-qonun: dekor o'qitadi — pitch atamalari, ball-mantiqqa aloqasi yo'q)
const MMX_TOKENS = ['PITCH', 'MUAMMO', 'YECHIM', 'DEMO', '🎤', '⏱'];
// Barqaror (StrictMode-safe) tartiblar — render'da aralashtirilmaydi. Chip tartibi nishondan farqli.
const MATCH_CHIP_ORDER = [1, 2, 0]; // YECHIM · DEMO · MUAMMO
const MATCH_TARGET_ORDER = [0, 1, 2];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student');
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now());
  const [st, setSt] = useState(() => ({
    assign: storedAnswer?.assign || { 0: null, 1: null, 2: null },
    sel: null,
    drag: null,
    solved: !!(storedAnswer && storedAnswer.solved),
    picked: storedAnswer?.picked ?? null,
  }));
  const { assign, sel, drag, solved, picked } = st;
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
  const [recapOpen, setRecapOpen] = useState(false);
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect(() => { if (isMentorLive && liveRevealScreen === screen) setMReveal(true); }, [isMentorLive, liveRevealScreen, screen]);
  const doReveal = () => { setMReveal(true); if (live) live.mentorReveal(screen); if (storedAnswer === undefined) onAnswer(screen, { mentorRevealed: true }); };

  const pool = MATCH_PAIRS.filter(p => !Object.values(assign).includes(p.id));
  const complete = (nextAssign) => {
    const allCorrect = MATCH_PAIRS.every((p, i) => nextAssign[i] === p.id);
    const pk = allCorrect ? 0 : 1; // birinchi-urinish mukammal → 0
    setSt(prev => ({ ...prev, assign: nextAssign, sel: null, drag: null, solved: true, picked: pk }));
    onAnswer(screen, { stage: 'module-mikro', screenIdx: screen, assign: nextAssign, picked: pk, correct: allCorrect, firstAttemptCorrect: allCorrect, solved: true });
    if (oneShot) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, pk, allCorrect, Date.now() - mountTs.current);
  };
  const place = (targetIdx, chipId) => {
    if (solved || isMentorLive || chipId == null) return;
    const next = { ...assign };
    Object.keys(next).forEach(k => { if (next[k] === chipId) next[k] = null; }); // chipni eski nishondan olib tashlash
    next[targetIdx] = chipId;
    if (Object.values(next).filter(v => v !== null).length === 3) complete(next);
    else setSt(prev => ({ ...prev, assign: next, sel: null, drag: null }));
  };
  const tapChip = (chipId) => { if (solved || isMentorLive) return; setSt(prev => ({ ...prev, sel: prev.sel === chipId ? null : chipId })); };
  const tapTarget = (targetIdx) => { if (solved || isMentorLive) return; if (sel != null) place(targetIdx, sel); };

  const revealed = !oneShot || !!(live && (live.revealScreen === screen || live.mentorScreen > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  const showColors = isMentorLive ? mReveal : (solved && revealed);
  const allCorrect = MATCH_PAIRS.every((p, i) => assign[i] === p.id);
  const navLabel = isMentorLive ? (mReveal ? 'Davom etish' : 'Avval natijani oching') : (solved ? 'Davom etish' : 'Uchala juftlikni tuzing');
  return (
    <Stage eyebrow="Tekshiruv · juftlash" screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">
          <div className="proj-q">
            <span className="proj-q-lbl">🔎 Test 3 · juftlash</span>
            <p className="broken-cue">Pitchingiz tayyor — endi bilimni YANGI pitchda sinaymiz: repetitor sayti pitchi 3 bo'lak.</p>
            <p className="proj-q-body"><b>3 vazifa-chipni o'z gapiga juftlang — chipni gap ustiga torting (yoki bosing).</b></p>
          </div>
        </div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>⚡ Jonli dars — bitta urinish, o'ylab juftlang!</p>}
        <div className="mmx-wrap">
          <div className="mmx-decor" aria-hidden="true">{MMX_TOKENS.map((t, k) => <span key={k} className={`mmx-t md${k}`}>{t}</span>)}</div>
          {/* CHIP POOL */}
          <div className="match-pool fade-up delay-1">
            {MATCH_CHIP_ORDER.filter(idx => pool.some(p => p.id === MATCH_PAIRS[idx].id)).map(idx => {
              const p = MATCH_PAIRS[idx];
              return (
                <button key={p.id} className={`match-chip ${sel === p.id ? 'sel' : ''} ${drag === p.id ? 'dragging' : ''}`}
                  draggable={!solved && !isMentorLive}
                  onDragStart={() => setSt(prev => ({ ...prev, drag: p.id, sel: p.id }))}
                  onDragEnd={() => setSt(prev => ({ ...prev, drag: null }))}
                  disabled={solved || isMentorLive}
                  onClick={() => tapChip(p.id)}>
                  <span className="match-chip-ic" aria-hidden="true">{p.ic}</span>{p.chip}
                </button>
              );
            })}
            {pool.length === 0 && <span className="match-pool-empty">Barcha chiplar joylandi ✓</span>}
          </div>
          <div className="match-hint small mono">{sel ? '👉 endi gap ustiga bosing' : (isMentorLive ? '' : 'chipni tanlang yoki gap ustiga torting')}</div>
          {/* TARGETS */}
          <div className="match-targets fade-up delay-2">
            {MATCH_TARGET_ORDER.map(ti => {
              const chipId = assign[ti];
              const p = chipId != null ? MATCH_PAIRS.find(x => x.id === chipId) : null;
              const correctHere = showColors && chipId === MATCH_PAIRS[ti].id;
              const wrongHere = showColors && chipId != null && chipId !== MATCH_PAIRS[ti].id;
              return (
                <div key={ti} className={`match-target ${chipId ? 'filled' : ''} ${sel && !solved && !isMentorLive ? 'droppable' : ''} ${correctHere ? 'ok' : ''} ${wrongHere ? 'bad' : ''}`}
                  onDragOver={e => { if (!solved && !isMentorLive) e.preventDefault(); }}
                  onDrop={() => place(ti, drag)}
                  onClick={() => tapTarget(ti)} role="button">
                  <span className="match-target-q">{MATCH_PAIRS[ti].target}</span>
                  <span className="match-slot">
                    {p ? <span className={`match-slot-chip ${correctHere ? 'ok' : ''} ${wrongHere ? 'bad' : ''}`}><span className="match-chip-ic sm" aria-hidden="true">{p.ic}</span>{p.chip}{showColors && (correctHere ? ' ✓' : ' ✕')}</span> : <span className="match-slot-empty">bu yerga</span>}
                    {correctHere && <span className="mmx-burst" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map(k => <span key={k} style={{ '--ba': `${k * 60}deg` }}>✦</span>)}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : solved} isCorrect={isMentorLive ? true : (allCorrect && !waiting)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || allCorrect) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive ? '✓ To\'g\'ri juftlik' : waiting ? '📨 Javobingiz qabul qilindi' : allCorrect ? 'Barchasi to\'g\'ri!' : 'To\'g\'ri juftlik quyida'}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {waiting ? "Hozir to'g'ri juftlikni bilib olasiz." : "«Tasavvur qiling…» → MUAMMO · «Saytimda … bir joyda» → YECHIM · «Mana, ishlaydi» → DEMO. Demo — ishonch dalili: usiz pitch faqat va'da bo'lib qoladi."}
          </p>
          {!isMentorLive && !allCorrect && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>📖 Qisqa takrorlash — mavzuni yana bir ko'rish</button>
          )}
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={["Barcha juftlik to'g'ri", "Xato bo'ldi"]} correctIdx={0} reveal={mReveal} onReveal={doReveal} onOpenRecap={() => setRecapOpen(true)} />}
        {recapOpen && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — KODING: REAL compiler-qobiq — «DEMO DAY SAHNA-KARTASI» (HTML-variant) =====
// INFRA-MANBA: P0 PmCompiler (Htmllesson1 tizimi) HTML-relsi — PmAudienceLesson (M1-D2) uslubida
//   sinxron matn-tekshiruv (harness/postMessage KERAK EMAS — skript yo'q, sandbox bo'sh).
// MEXANIKA M1-D5 (skelet-yig'ish)dan FARQLI: tayyor karta-shablonni TO'LDIRISH + REAL havola.
// O'quvchi [SAYT NOMI]/[MUAMMO-GAP]/[YECHIM-GAP]/[SAYT-MANZILI]ni almashtiradi — gaplarni
// ustaxonadan O'ZI ko'chirib yozadi (avto-quyish YO'Q), havola = D11 Netlify manzili.
const HC_PREVIEW_CSS = `
  *{box-sizing:border-box}
  body{font-family:Georgia,'Times New Roman',serif;margin:0;padding:30px 22px;background:linear-gradient(180deg,#171130,#241A4A);min-height:100vh;color:#1B1630}
  h1{font-family:Georgia,serif;font-size:27px;margin:0 0 16px;color:#A78BFA;text-align:center;letter-spacing:.01em;overflow-wrap:anywhere}
  p{margin:0 0 10px;font-size:15.5px;line-height:1.55;background:#fff;border-left:4px solid #E7E3F4;border-radius:10px;padding:11px 14px;box-shadow:0 8px 20px -10px rgba(0,0,0,.5);overflow-wrap:anywhere}
  p.muammo{border-left-color:#0E86C4}
  p.yechim{border-left-color:#E8A13A}
  a{display:block;text-align:center;margin-top:16px;background:#12A968;color:#fff;text-decoration:none;font-family:'Segoe UI',system-ui,sans-serif;font-weight:700;font-size:15px;border-radius:12px;padding:13px 18px;box-shadow:0 10px 24px -8px rgba(18,169,104,.55);overflow-wrap:anywhere}
`;
// O'quvchi yozgan fragment to'liq sahifaga o'raladi (skript yo'q — sandbox bo'sh).
const HC_wrapDoc = (code) => `<!doctype html><html lang="uz"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${HC_PREVIEW_CSS}</style>
</head><body>${code}</body></html>`;

// KOD (senariy blok-6): tayyor karta-shablon — h1 + muammo/yechim gaplari + havola + sodda style (rang ⭐ uchun).
const KODING_STARTER = `<h1>[SAYT NOMI]</h1>

<p class="muammo">[MUAMMO-GAP]</p>
<p class="yechim">[YECHIM-GAP]</p>

<a href="[SAYT-MANZILI]">Saytni ochish →</a>

<style>
  h1 { color: #A78BFA; }
</style>`;
// Shart-tekshiruv: teg ichi to'ldirilganmi (placeholder qolmagan + bo'sh emas).
const hcTagFilled = (code, re) => {
  const m = code.match(re);
  return !!(m && m[1].replace(/\[[^\]]*\]/g, '').trim().length > 0);
};
const checkKodingConds = (code) => ({
  c1: !code.includes('[SAYT NOMI]') && hcTagFilled(code, /<h1>([\s\S]*?)<\/h1>/i),
  c2: !code.includes('[MUAMMO-GAP]') && !code.includes('[YECHIM-GAP]')
    && hcTagFilled(code, /<p class="muammo">([\s\S]*?)<\/p>/i)
    && hcTagFilled(code, /<p class="yechim">([\s\S]*?)<\/p>/i),
  c3: !code.includes('[SAYT-MANZILI]') && (() => { const m = code.match(/href="([^"]*)"/i); return !!(m && /^https?:\/\/.+\..+/.test(m[1].trim())); })(),
  star: (() => { const m = code.match(/color:\s*([^;}]+)/i); return !!(m && m[1].trim().toLowerCase() !== '#a78bfa'); })(),
});
const KODING_CONDS = [
  { id: 'c1', label: 'Sayt nomi yozildi', hint: "[SAYT NOMI] yozuvini qavsi bilan birga o'chirib, o'rniga o'z saytingiz nomini yozing — teglarga tegmang." },
  { id: 'c2', label: 'MUAMMO va YECHIM joyida', hint: "[MUAMMO-GAP] va [YECHIM-GAP] o'rniga ustaxonada yozgan gaplaringizni O'ZINGIZ ko'chirib yozing." },
  { id: 'c3', label: 'Havola ishlaydi', hint: "[SAYT-MANZILI] o'rniga 11-darsda olgan Netlify manzilingizni qo'ying — u http bilan boshlanadi." },
];
// ===== PM-KOMPILYATOR — Htmllesson1 (HtmlCompiler) tizimi PM-qobiqda =====
// To'liq-ekran praktika: tepada topshiriq + JONLI shart-chiplar, chapda muharrir,
// o'ngda jonli natija (iframe). Yozilgani sari shartlar O'ZI tekshiriladi (400ms
// debounce, ▶ ham bor). Uchala shart yashil bo'lsa — «Davom etish» yonadi.
function PmCompiler({ initialCode, onContinue, onBack }) {
  const [code, setCode] = useState(initialCode || KODING_STARTER);
  const [doc, setDoc] = useState('');
  // Jonli preview — debounce bilan avto-yangilanadi
  useEffect(() => {
    const t = setTimeout(() => { setDoc(HC_wrapDoc(code)); }, 400);
    return () => clearTimeout(t);
  }, [code]);
  // Shartlar sinxron matn-tekshiruv (harness/postMessage kerak emas — skript yo'q)
  const conds = checkKodingConds(code);
  const passed = conds.c1 && conds.c2 && conds.c3;
  const okN = KODING_CONDS.filter(c => conds[c.id]).length;
  const firstHint = KODING_CONDS.find(c => !conds[c.id])?.hint;
  const runNow = () => setDoc(HC_wrapDoc(code));
  const reset = () => setCode(initialCode || KODING_STARTER);
  // Tab tugmasi 2 bo'sh joy qo'shsin (Htmllesson1 bilan bir xil)
  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target, s = el.selectionStart, en = el.selectionEnd;
      const next = code.slice(0, s) + '  ' + code.slice(en);
      setCode(next);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    }
  };
  return (
    <div className="hcp-root">
      <div className="hcp-wrap">
        <header className="hcp-top">
          <span className="hcp-eyebrow">Koding · praktika</span>
          <h1 className="hcp-title">Demo Day sahna-kartasi</h1>
          <p className="hcp-brief">Bu — ertangi sahna-kartangiz. <span className="mono">[SAYT NOMI]</span>, <span className="mono">[MUAMMO-GAP]</span> va <span className="mono">[YECHIM-GAP]</span> o'rniga o'z gaplaringizni ko'chirib yozing, havolaga esa ishlaydigan sayt manzilingizni qo'ying — mehmonlar telefonidan ochib ko'radi.</p>
          <div className="hcp-checklist">
            <span className="hcp-count">{okN}/{KODING_CONDS.length}</span>
            {KODING_CONDS.map((c, i) => (
              <span key={c.id} className={`hcp-chip ${conds[c.id] ? 'ok' : ''}`} title={c.hint}>
                <span className="hcp-dot">{conds[c.id] ? '✓' : i + 1}</span>{c.label}
              </span>
            ))}
            <span className={`hcp-chip ${conds.star ? 'ok' : ''}`} title="style ichidagi rang qiymatini o'z saytingiz uslubiga almashtiring — ixtiyoriy">
              <span className="hcp-dot">{conds.star ? '✓' : '⭐'}</span>Karta rangi sizniki (ixtiyoriy)
            </span>
          </div>
          {!passed && firstHint && <p className="hcp-hint">💡 {firstHint}</p>}
        </header>
        <main className="hcp-split">
          <section className="hcp-pane">
            <div className="hcp-pane-bar dark">
              <span className="bb-dots"><i /><i /><i /></span>
              <span className="hcp-tab">sahna-karta.html</span>
              <button className="hcp-mini" onClick={runNow}>▶ Ishga tushirish</button>
            </div>
            <textarea className="hcp-code" value={code} spellCheck={false} autoCapitalize="off" autoCorrect="off" onChange={e => setCode(e.target.value)} onKeyDown={onKeyDown} placeholder="Yozuvlarni shu yerda almashtiring…" />
          </section>
          <section className="hcp-pane">
            <div className="hcp-pane-bar">
              <span className="hcp-pane-name">📺 Proyektor</span>
              <span className="hcp-live">jonli</span>
            </div>
            {doc
              ? <iframe className="hcp-frame" title="Jonli natija" sandbox="" srcDoc={doc} />
              : <p className="code-out-empty" style={{ padding: 16, margin: 0 }}>Yozishni boshlang — sahna-kartangiz shu yerda jonli ko'rinadi.</p>}
          </section>
        </main>
        <footer className="hcp-bottom">
          <button className="hcp-ghost" onClick={onBack}>← Darsga qaytish</button>
          <button className="hcp-ghost" onClick={reset}>Qaytadan</button>
          <div className="hcp-status">
            {passed
              ? <span className="hcp-ok-msg">✓ Uchala shart bajarildi!</span>
              : <span className="hcp-wait-msg">Shartlarni bajaring — natija o'ngda jonli ko'rinadi</span>}
          </div>
          <button className="hcp-next" disabled={!passed} onClick={() => passed && onContinue({ code })}>Davom etish →</button>
        </footer>
      </div>
    </div>
  );
}

const ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [open, setOpen] = useState(false);
  const [st, setSt] = useState(() => ({
    code: storedAnswer?.code || KODING_STARTER,
    done: !!(storedAnswer && storedAnswer.solved),
  }));
  const { code, done } = st;
  // Kompilyatordan qaytish: kod saqlanadi, birinchi marta tugatilganda ball-signal ketadi
  const finishPractice = ({ code: newCode }) => {
    setOpen(false);
    setSt({ code: newCode, done: true });
    if (!done) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code: newCode, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  return (
    <Stage eyebrow="Koding · 🛠 kompilyator" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? 'Davom etish' : 'Avval kompilyatorda bajaring'} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Pitchingiz proyektorda qanday <span className="italic" style={{ color: T.accent }}>ko'rinadi</span>?</h2></div>
        <Mentor>Ertaga bu karta proyektorda turadi — tanish kod maydonida (kompilyatorda) gaplaringizni joylab, <b style={{ color: T.ink }}>ishlaydigan havolangizni</b> qo'yasiz.</Mentor>
        <MentorWatchLine>Kartani <b>o'quvchilar</b> yasaydi — «🛠 tugatganlar»da kuzatasiz; «Davom etish» siz uchun ochiq.</MentorWatchLine>
        <div className="split">
          <Col>
            <div className="hc-task fade-up">
              <span className="card-lbl" style={{ color: T.accent }}>📋 Kompilyatorda sizni nima kutadi</span>
              <div className="hc-conds">
                {KODING_CONDS.map((c, i) => {
                  const met = done;
                  return (
                    <div key={c.id} className={`hc-cond ${met ? 'ok' : ''}`}>
                      <span className="hc-cond-box">{met ? '✓' : i + 1}</span>
                      <div className="hc-cond-txt"><span className="hc-cond-label">{c.label}</span></div>
                    </div>
                  );
                })}
              </div>
              <p className="small" style={{ margin: 0, color: T.ink3 }}>⭐ Yulduzcha topshiriq kompilyator ichida kutadi.</p>
            </div>
            <MentorPracticeStats live={live} screen={screen} label="🛠 Sahna-kartani tugatganlar" />
            {done && <div className="done-mini fade-step">✅ Karta tayyor! <span className="dm-sub">— ertaga proyektorda shu turadi</span></div>}
          </Col>
          <Col>
            <div className="kod-launch fade-up delay-1">
              <div className="kod-launch-bar"><span className="bb-dots"><i /><i /><i /></span><span className="kod-launch-title">sahna-karta.html</span></div>
              <div className="kod-launch-body" aria-hidden="true">{code.split('\n').slice(0, 6).join('\n')}</div>
              <div className="kod-launch-veil">
                <button className="kod-launch-btn" onClick={() => setOpen(true)}>{done ? '↻ Kompilyatorni qayta ochish' : '🛠 Kompilyatorni ochish'}</button>
                <span className="kod-launch-sub">{done ? "Bajarildi — xohlasangiz kartani yana sayqallang" : "To'liq ekranda to'ldirib, darsga qaytasiz"}</span>
              </div>
            </div>
          </Col>
        </div>
        <MentorNote>Havola REAL ishlashini tekshirtiring — D11 deploy manzili bo'lsin. 10 daqiqada ulgurmaganlar kartani uyda tugatadi (uy-qoida keyingi ekranlarda).</MentorNote>
      </div>
      {open && <PmCompiler initialCode={code} onContinue={finishPractice} onBack={() => setOpen(false)} />}
    </Stage>
  );
};

// ===== SCREEN 11 — YAKUNIY SO'Z (3 qadam): to'liq pitch-mashq (30s) → sherik-fikr → bir qator yozish =====
const REFLECT_KEY = 'pm-m1d12-reflection';
const FEEDBACK_KEY = 'pm-m1d12-feedback';
const FEEDBACK_OPTS = ['MUAMMO', 'YECHIM', 'DEMO', 'Ilgak'];
// Juftlik-taymeri: 60s = avval A gapiradi (30s), keyin B (30s) — kim gapirayotgani doim ko'rinib turadi.
function PairTimer() {
  const [st, setSt] = useState({ running: false, left: 60, done: false });
  useEffect(() => {
    if (!st.running) return;
    if (st.left <= 0) { setSt({ running: false, left: 60, done: true }); return; }
    const t = setTimeout(() => setSt(p => ({ ...p, left: p.left - 1 })), 1000);
    return () => clearTimeout(t);
  }, [st.running, st.left]);
  const isA = st.left > 30;
  return (
    <div className="pair-timer">
      {st.running ? (
        <>
          <div className="pair-timer-top">
            <span className="pair-now">Hozir <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span> gapiradi{isA ? ' — keyin B' : ''}</span>
            <span className="pair-clock">{isA ? st.left - 30 : st.left}s</span>
          </div>
          <div className="pair-prog"><span className="pair-prog-fill" style={{ width: `${((60 - st.left) / 60) * 100}%` }} /><i className="pair-prog-mid" aria-hidden="true" /></div>
        </>
      ) : (
        <p className="pair-now" style={{ margin: 0 }}>{st.done ? "✓ Vaqt tugadi — ikkalangiz ham aytdingizmi? Barakalla!" : "Har biringizga 30 soniyadan: avval A gapiradi, keyin B."}</p>
      )}
      <div className="pair-timer-btns">
        {!st.running && <button className="btn-soft" onClick={() => setSt({ running: true, left: 60, done: false })}>{st.done ? '↻ Yana 1 daqiqa' : '▶ 1 daqiqani boshlash'}</button>}
        {st.running && <button className="btn-soft" onClick={() => setSt({ running: false, left: 60, done: false })}>⏹ To'xtatish</button>}
      </div>
    </div>
  );
}
const Screen11 = ({ screen, onNext, onPrev }) => {
  const [text, setText] = useState(() => { try { return localStorage.getItem(REFLECT_KEY) || ''; } catch { return ''; } });
  const [fb, setFb] = useState(() => { try { return localStorage.getItem(FEEDBACK_KEY) || ''; } catch { return ''; } });
  const save = (v) => { setText(v); try { localStorage.setItem(REFLECT_KEY, v); } catch {} };
  const pickFb = (v) => { setFb(v); try { localStorage.setItem(FEEDBACK_KEY, v); } catch {} };
  const written = text.trim().length >= 8;
  return (
    <Stage eyebrow="Mustahkamlash · 3 qadam" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label="Davom etish" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Ertaga sahnada nimani <span className="italic" style={{ color: T.accent }}>kuchaytirasiz</span>?</h2></div>
        <Mentor>Dars deyarli tugadi — endi pitchni <b style={{ color: T.ink }}>tilda sinang</b>: pastdagi uch qadam, tartib bilan.</Mentor>
        <MentorNote>2-3 ko'ngilli pitchini butun sinf oldida aytsin — bu ertangi sahnaning repetitsiyasi. Sinfning uchdan biri MUAMMOsiz boshlasa, Airbnb 1-slaydini qayta ko'rsating.</MentorNote>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">🎤 To'liq pitchingizni ayting</span><span className="rcp-s">Sherigingizga — har biringizga 30 soniya, sekundomer bilan</span></div></div>
            <PairTimer />
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">🗣 Sherik fikri</span><span className="rcp-s">U aytsin: pitchning qaysi joyi eng ishonarli chiqdi?</span></div></div>
            <div className="hw-chips">
              {FEEDBACK_OPTS.map(o => <button key={o} className={`hw-chip ${fb === o ? 'on' : ''}`} onClick={() => pickFb(o)}>{o}</button>)}
            </div>
            {fb && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>✓ Belgilandi — demak {fb} qismingiz allaqachon kuchli.</p>}
          </div>
          <div className="rcp-step wide fade-up delay-3">
            <div className="rcp-step-h"><span className="rcp-n">3</span><div><span className="rcp-t">✍️ Bir qator yozing</span><span className="rcp-s">Ertaga qaysi joyni kuchaytirasiz?</span></div></div>
            <input className="reflect-input" value={text} onChange={e => save(e.target.value)} placeholder="Ertaga ... qismini kuchaytiraman, chunki ..." maxLength={160} />
            {written && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>✓ Yozildi — ertaga sahnadan oldin shu gapni qayta o'qing.</p>}
          </div>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — UYGA VAZIFA «SHARTNOMA»: to'liq/qisqa variantni SHU YERDA tanlash =====
// Tanlov localStorage'ga (HW_KEY) yoziladi — summary o'qiydi. Ertaga Demo Day — mashq ustuvor!
const HW_KEY = 'pm-m1d12-hw-variant';
const readHwVariant = () => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } };
const HW_VARIANTS = {
  full: {
    label: "✅ To'liq: 3 mashq", mashq: '3 marta ovoz chiqarib', tomosha: "oila a'zosi + 1 savol",
    steps: [
      <>Pitchni <b>3 marta</b> ovoz chiqarib ayting.</>,
      <>Bittasini <b>oila a'zosiga</b> ayting — savoliga javob bering.</>,
      <>Sahna-kartadagi <b>havolani</b> ochib tekshiring.</>,
    ]
  },
  short: {
    label: '⏱ Qisqa: 1 mashq', mashq: '1 marta ovoz chiqarib', tomosha: "oila a'zosi oldida",
    steps: [
      <>Pitchni <b>1 marta oila a'zosiga</b> ayting.</>,
      <>Uning <b>bitta savoliga</b> javob bering.</>,
      <>Sahna-kartadagi <b>havolani ochib</b> tekshiring.</>,
    ]
  },
};
const Screen12 = ({ screen, onNext, onPrev }) => {
  const [variant, setVariant] = useState(() => readHwVariant());
  const pick = (v) => { setVariant(v); try { localStorage.setItem(HW_KEY, v); } catch {} };
  const hv = HW_VARIANTS[variant];
  return (
    <Stage eyebrow="Uyga vazifa · shartnoma" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label="Davom etish" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Ertangi sahnaga <span className="italic" style={{ color: T.accent }}>qanday</span> tayyor borasiz?</h2></div>
        <Mentor>Ertaga <b style={{ color: T.ink }}>Demo Day</b>! Shartnomangizni tanlang.</Mentor>
        <div className="hw-chips fade-up delay-1">
          {Object.entries(HW_VARIANTS).map(([k, v]) => (
            <button key={k} className={`hw-chip ${variant === k ? 'on' : ''}`} onClick={() => pick(k)}>{v.label}</button>
          ))}
        </div>
        {hv ? (
          <>
            <div className="pmtask fade-step">
              <div className="pmtask-head"><span className="pmtask-tag">🗂 PM-topshiriq kartasi</span><span className="pmtask-id">PITCH-UY</span></div>
              <div className="pmtask-rows">
                <div className="pmtask-row"><span className="pmtask-k">Mashq</span><span className="pmtask-v"><b className="pmtask-val" key={variant} style={{ color: T.accent }}>{hv.mashq}</b></span></div>
                <div className="pmtask-row"><span className="pmtask-k">Tomoshabin</span><span className="pmtask-v"><b>{hv.tomosha}</b></span></div>
                <div className="pmtask-row"><span className="pmtask-k">Havola</span><span className="pmtask-v">ochib tekshiriladi</span></div>
                <div className="pmtask-row"><span className="pmtask-k">Muddat</span><span className="pmtask-v"><b>ERTAGA — Demo Day!</b></span></div>
              </div>
            </div>
            <div className="pmsteps fade-step">
              <span className="card-lbl" style={{ color: T.accent }}>📍 Uyda 3 qadam</span>
              <ol className="pmsteps-ol">
                {hv.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          </>
        ) : (
          <div className="frame-soft fade-up delay-2"><p className="body" style={{ margin: 0, color: T.ink }}>👆 Avval variantni tanlang — topshiriq-karta shunga moslashadi.</p></div>
        )}
        <MentorNote>Standart qoidadan ongli chekinish: odatda «koding uyga qoldi» = QISQA variant, bu safar EMAS — ertaga Demo Day, to'liq pitch-mashq hamma uchun ustuvor. Kartani darsda tugatmagan o'quvchi uyda avval kartani tugatib, keyin mashqqa o'tsin.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES — REAL bosqichlar uchun (tekin emas). Nomlar metodist-tasdiqlangan (2026-07-23) =====
const ACHIEVEMENTS = {
  stageReady: { icon: '🎤', name: 'Stage Ready!', desc: "Ustaxonada 3 qismli pitchingizni yozdingiz" },
  sharpEar:   { icon: '👂', name: 'Sharp Ear!',   desc: "3 tekshiruvda ham to'g'ri javob berdingiz" },
  showTime:   { icon: '🛠️', name: 'Show Time!',   desc: "Demo Day sahna-kartasini yasadingiz" },
  graduate:   { icon: '🎓', name: 'Level Up!',    desc: "Pitch darsini yakunladingiz" },
};
// Ekran id → nishon (recordAnswer'da, faqat REAL solve bilan). sharpEar = 3/3 aggregat, graduate = summary.
const ACH_TRIGGERS = { practice: 'stageReady', s10: 'showTime' };

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

// Podium savol yorliqlari (SCORED_IDX indekslariga mos — 4/6/9 = s7/s8/s9)
const Q_LABELS = { 4: "1 — Buzuq pitch", 6: "2 — Airbnb keysi", 9: "3 — Juftlash" };
const QUIZ_MS = 15000;
// Arena fon tokenlari — darsning "DNK"si (pitch atamalari). Arena platforma mahsuloti — brendi qoladi.
const QZ_BG_SHAPES = [
  { ch: 'PITCH',    l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: 'MUAMMO',   l: 85, t: 8,  s: 28, d: 23, dl: 1.5 },
  { ch: 'YECHIM',   l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'DEMO',     l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: 'ilgak',    l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: '2 daqiqa', l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: 'sahna',    l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: 'Demo Day', l: 55, t: 5,  s: 20, d: 22, dl: 0.6 },
  { ch: '🎤',       l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '🎬',       l: 16, t: 52, s: 28, d: 26, dl: 2.6 },
  { ch: '🔗',       l: 2,  t: 30, s: 30, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3, seq naqshsiz). darslik-jonli TASDIQLAYDI.
const QUIZ_BANK = [
  { q: "Kuchli pitch (qisqa ishontiruvchi nutq) qaysi tartibda quriladi?", opts: ["DEMO → MUAMMO → YECHIM", "YECHIM → DEMO → MUAMMO", "MUAMMO → YECHIM → DEMO", "MUAMMO → DEMO → YECHIM"], correct: 2 },
  { q: "Pitch nimadan boshlanadi?", opts: ["Tinglovchi taniydigan MUAMMOdan", "Sayt bo'limlarini birma-bir sanashdan", "Qancha mehnat ketganini aytishdan", "Sayt havolasini ko'rsatishdan"], correct: 0 },
  { q: "Nega xususiyat-sanash («4 sahifa, 12 rasm bor») kuchsiz?", opts: ["Chunki pitch doim narxni aytishdan boshlanishi kerak", "Chunki saytdagi sahifalar soni hali juda kam", "Chunki pitchda sonlarni ishlatish umuman taqiqlangan", "Tinglovchi vaziyatni his qilmaydi — qiziqish uyg'onmaydi"], correct: 3 },
  { q: "Airbnb o'z pitch-taqdimotining birinchi slaydiga nimani qo'ygan?", opts: ["Jamoa a'zolari ro'yxatini", "MUAMMOni — mehmonxonalar qimmatligini", "Mahsulot skrinshotini", "Kompaniya tarixi haqidagi uzun hikoyani"], correct: 1 },
  { q: "Airbnb pitchidagi YECHIM nima edi?", opts: ["Yangi zamonaviy mehmonxonalar tarmog'ini qurish", "Odamlarning bo'sh xonalarini sayohatchilarga ijaraga berish", "Aviachiptalar narxini arzonlashtirish", "Sayohat qo'llanmalarini chop etib tarqatish"], correct: 1 },
  { q: "DEMO pitchda qanday vazifani bajaradi?", opts: ["Taqdimot vaqtini cho'zish", "Slaydlar sonini ko'paytirish", "Pitchga chiroyli yakun yasash", "Ishonch dalili — «mana, ishlayapti!»"], correct: 3 },
  { q: "Demo Day'da pitch uchun qancha vaqt beriladi?", opts: ["2 daqiqa", "20 daqiqa", "1 soat", "5 soniya"], correct: 0 },
  { q: "Ilgak (ochuvchi gap) nima qiladi?", opts: ["Pitchni rasman yakunlab qo'yadi", "Saytning to'liq manzilini aytadi", "Tinglovchini birinchi soniyadan tortadi", "Qancha mehnat ketganini ko'rsatadi"], correct: 2 },
  { q: "Qaysi gap ilgak (ochuvchi gap) bo'la oladi?", opts: ["«Xulosa qilib aytganda, menda hammasi shu edi»", "«Endi saytimning barcha bo'limlarini sanab chiqaman»", "«Taqdimotim tugadi, e'tiboringiz uchun rahmat»", "«Tasavvur qiling: repetitor kerak, lekin qayerdan izlashni bilmaysiz»"], correct: 3 },
  { q: "Sinfdosh sizni o'yinga 30 soniyada qanday ishontirdi?", opts: ["O'yin grafikasi ko'rsatkichlarini birma-bir sanab", "O'yin qancha turishini va chegirmasini aytib", "Vaziyatni aytib: «zerikkanimda ochib, vaqtni unutaman»", "O'yinni yaratgan kompaniyani uzoq maqtab"], correct: 2 },
  { q: "«Saytimda tekshirilgan repetitorlar bir joyda» — bu pitchning qaysi qismi?", opts: ["YECHIM", "MUAMMO", "DEMO", "Ilgak (ochuvchi gap)"], correct: 0 },
  { q: "Pitch oxirida sayt havolasi nima uchun kerak?", opts: ["Sahna-kartadagi bo'sh joyni to'ldirish uchun", "Mehmonlar saytni o'z telefonida ochib ko'rishi uchun", "Kod yozilganini tekshiruvchiga isbotlash uchun", "Taqdimot sahifalari sonini oshirish uchun"], correct: 1 },
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
// ===== ⚔️ CODESTRIKE ARENA — signal zonasi: 100+ (test <100, praktika 500+ bilan to'qnashmaydi) =====
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
    const TOK = ['PITCH', 'MUAMMO', 'YECHIM', 'DEMO', 'sahna', 'ilgak', 'Demo Day', '2 daqiqa', '🎤', '🎬'];
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
          <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>
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
                ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">ball{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ''}</span></>
                : <span className="qz-res-t">{my ? "Xato — 0 ball. Keyingisida olasiz! 💪" : "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱"}</span>}
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
              <p className="qz-sub">ball · {soloScore.ok}/{QUIZ_BANK.length} to'g'ri{soloScore.maxStreak >= 2 ? ` · eng uzun streak 🔥x${soloScore.maxStreak}` : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ Qayta ishlash</button>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>Arenani yopish</button>
        </div>
      )}
    </div>
  );
}

// ===== 🏆 PODIUM / STATISTIKA — jonli reyting =====
const ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
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
        <div className="head"><h2 className="title h-title fade-up">Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>Natijalar yuklanmoqda…</p>
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
      </div>
    </Stage>
  );
};

// ===== SCREEN 16 — YAKUN + CODESTRIKE CTA =====
const Screen16 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = _gate.live;
  const [arena, setArena] = useState(false);
  const [arenaSolo, setArenaSolo] = useState(false);
  const quizSt = (_live && _live.quiz && _live.quiz.state) || 'off';
  const isStudentL = _live && _live.mode === 'student';
  const isMentorL = _live && _live.mode === 'mentor';
  const classOver = !!(_live && (_live.status === 'ended' || !_live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== 'done';
  const studentLive = isStudentL && !studentSolo && quizSt !== 'off';
  const studentWait = isStudentL && !studentSolo && quizSt === 'off';
  const openArena = async () => {
    if (isMentorL && quizSt === 'off') { try { await _live.quizControl('lobby', -1); } catch { return; } }
    setArenaSolo(studentSolo); setArena(true);
  };
  const RECAP = [
    "Pitch retsepti: MUAMMO → YECHIM → DEMO",
    "Xususiyat-sanash kuchsiz — hikoya vaziyatni his qildiradi",
    "Airbnb 1-slaydi — MUAMMO: avval his qildir, keyin ko'rsat",
    "DEMO — ishonch dalili: «mana, ishlayapti!»",
    "Ilgak tinglovchini birinchi soniyadan tortadi · 2 daqiqa yetadi"
  ];
  const hwVariant = (() => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } })();
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow="Tayyor" screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Qaytadan</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Yakunlash ✓</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> Dars tugadi</span><h2 className="title h-title fade-up d1">Pitchingiz <span className="italic" style={{ color: T.accent }}>sahnaga</span> tayyor.</h2><p className="body h-sub fade-up d2">{PASSED ? "Tabriklaymiz! Ertaga Demo Day'da MUAMMO → YECHIM → DEMO tartibida ishonch bilan chiqasiz." : "Yaxshi harakat! Uyda mashqlarni albatta qiling — retsept tilga o'rnashadi va ertaga sahnada o'zi chiqadi."}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? '⏳ Mentorni kuting' : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> Endi siz bilasiz</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>📝 Uyga vazifa — eslatma</div><p className="body" style={{ margin: 0, color: T.ink }}>{hwVariant === 'short' ? <>Shartnomangiz: <b style={{ color: T.accent }}>1 mashq</b> oila a'zosi oldida + <b>havola-tekshiruv</b>. To'liq qadamlar — uy-vazifa ekranida.</> : <>Shartnomangiz: pitchni <b style={{ color: T.accent }}>3 marta</b> ovoz chiqarib mashq qilish, bittasi <b>oila a'zosi</b> oldida + havola-tekshiruv.</>}</p><p className="hw-note">Ertaga Demo Day — sahna sizniki! 🎤</p></div>
        </div>
        <div className="card ach-coll fade-up d3">
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
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmPitchLesson({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState({});
  const startTimeRef = useRef(Date.now());
  const earnedRef = useRef(new Set());
  const [earned, setEarned] = useState(() => new Set());
  const [achToasts, setAchToasts] = useState([]);
  const achKeyRef = useRef(0);
  const earn = useCallback((id) => {
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts(t => [...t, { id, k: ++achKeyRef.current }]);
  }, []);
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, window.innerWidth / 1920)); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  const SUMMARY_IDX = SCREEN_META.findIndex(m => m.id === 's16');
  useEffect(() => { if (screen === SUMMARY_IDX) earn('graduate'); }, [screen, SUMMARY_IDX, earn]);
  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));
  const recordAnswer = (idx, data) => {
    const nextA = { ...answers, [idx]: data };
    setAnswers(nextA);
    // 🏅 sharpEar — 3 tekshiruvda ham to'g'ri javob (scored indekslar 4/6/9 = s7/s8/s9)
    if ([4, 6, 9].every(i => nextA[i] && nextA[i].correct)) earn('sharpEar');
    const _m = SCREEN_META[idx];
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat REAL solve)
  };
  const reset = () => { setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };

  const finishLesson = () => {
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

  // Tartib — SCREEN_META bilan bir xil: s0,s1,s2,s3,TEST1(s7),s4,TEST2(s8),s5,ustaxona,TEST3(s9),koding,recap,uyga,podium,summary
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen7, Screen4, Screen8, Screen5, ScreenPitchWorkshop, Screen9, ScreenCoding, Screen11, Screen12, ScreenPodium, Screen16];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
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

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* Jonli-nishon (LiveBadge) — xira, aralashmaydi; hoverda to'liq ko'rinadi */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease; }
        .live-badge:hover { opacity: 1; }

        /* === KNOPKALAR === */
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FBFAFE; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.errSoft} !important; color: ${T.err} !important; box-shadow: 0 8px 22px -6px rgba(229,72,77,0.32) !important; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* === MENTORGA ESLATMA (faqat mentor-rejim) === */
        .mnote { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 5px; cursor: pointer; }
        .mnote-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.blue}; display: flex; align-items: center; }
        .mnote-x { margin-left: auto; font-weight: 800; font-size: 10.5px; opacity: 0.7; text-transform: none; letter-spacing: 0; }
        /* Proyektor-sir: yopiq holatda xira chip (LiveBadge oilasi) — o'quvchi diqqatini tortmaydi */
        .mnote-chip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; background: ${T.paper}; border: 1.5px dashed ${T.blue}; color: ${T.blue}; border-radius: 999px; padding: 4px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.04em; cursor: pointer; opacity: 0.4; transition: opacity 0.2s ease, transform 0.2s ease; }
        .mnote-chip:hover, .mnote-chip:focus-visible { opacity: 1; transform: translateY(-1px); }
        @media (hover: none) { .mnote-chip { opacity: 0.6; } }
        .mnote-body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.45; }

        /* === HOOK: menyu-kartochka ovoz-plitkalari === */
        .hook-menu { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(10px,1.6vw,14px); }
        @media (max-width: 560px) { .hook-menu { grid-template-columns: 1fr; } }
        .hook-menu.one { grid-template-columns: 1fr; max-width: 720px; width: 100%; margin: 0 auto; }
        .hook-mc-sub { display: block; font-weight: 700; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink3}; margin-top: 3px; }
        .hook-mc.on .hook-mc-sub { color: ${T.accent}; }
        .hook-mc { position: relative; display: flex; align-items: center; gap: 12px; text-align: left; background: ${T.paper}; border: none; border-radius: 16px; padding: clamp(13px,1.9vw,17px) clamp(14px,2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; overflow: hidden; transition: transform 0.18s, box-shadow 0.18s, background 0.2s; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.18), inset 0 0 0 1.5px ${T.line}; }
        .hook-mc:hover:not(:disabled):not(.on) { transform: translateY(-3px); box-shadow: 0 14px 28px -10px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.accent}44; }
        .hook-mc.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 12px 26px -8px rgba(91,61,230,0.34), inset 0 0 0 2px ${T.accent}; }
        .hook-mc:disabled { cursor: default; }
        .hook-mc-abc { flex-shrink: 0; width: 30px; height: 30px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 14px; color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}33; transition: all 0.2s; }
        .hook-mc.on .hook-mc-abc { background: ${T.accent}; color: #fff; box-shadow: none; }
        .hook-mc-txt { flex: 1; line-height: 1.3; }
        .hook-mc-cup { font-size: 22px; opacity: 0.5; flex-shrink: 0; transition: transform 0.25s, opacity 0.2s; }
        .hook-mc.on .hook-mc-cup { opacity: 1; transform: scale(1.15) rotate(-6deg); }
        .hook-mc.taphint { animation: hook-tap 2.4s ease-in-out infinite; }
        .hook-mc.taphint:nth-child(2) { animation-delay: 0.3s; } .hook-mc.taphint:nth-child(3) { animation-delay: 0.6s; } .hook-mc.taphint:nth-child(4) { animation-delay: 0.9s; }
        @keyframes hook-tap { 0%,88%,100% { box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.18), inset 0 0 0 1.5px ${T.line}; } 94% { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.28), inset 0 0 0 1.5px ${T.accent}66; } }

        /* === HOOK IMZO-SAHNA: YONAYOTGAN SAHNA-CHIROQLARI — ovoz nuri to'ldiradi (dars imzosi) === */
        .spot-shelf { display: flex; flex-direction: column; gap: 12px; background: linear-gradient(180deg, #171130, #241A4A); border-radius: 18px; padding: clamp(16px,2.4vw,22px) clamp(12px,2vw,20px) clamp(12px,1.8vw,16px); box-shadow: 0 14px 34px -14px rgba(23,17,48,0.6); }
        .spot-row { display: flex; align-items: flex-end; justify-content: space-around; gap: clamp(6px,1.4vw,16px); position: relative; padding-bottom: 8px; border-bottom: 2px solid rgba(255,255,255,0.14); }
        .spotl { display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; min-width: 0; position: relative; }
        .spotl-star { position: absolute; top: -24px; font-size: clamp(15px,2.4vw,20px); animation: float-sm 2.4s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(255,222,107,0.7)); }
        .spotl-pct { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(13px,1.9vw,17px); color: #F2ECFF; font-variant-numeric: tabular-nums; }
        .spotl.mine .spotl-pct { color: #CDAFFF; }
        .spotl-cap { width: clamp(22px,4vw,30px); height: 11px; border-radius: 6px 6px 2px 2px; background: #0E0B1E; box-shadow: inset 0 -2px 0 rgba(255,255,255,0.18), 0 0 10px rgba(0,0,0,0.4); margin-bottom: -3px; z-index: 2; }
        .spotl-beam { position: relative; width: clamp(46px,9vw,72px); height: clamp(78px,15vw,118px); clip-path: polygon(37% 0, 63% 0, 94% 100%, 6% 100%); background: rgba(255,255,255,0.05); overflow: hidden; }
        .spotl-fill { position: absolute; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, rgba(255,222,107,0.22), rgba(255,222,107,0.85)); transition: height 1s cubic-bezier(.34,1.15,.4,1); box-shadow: 0 0 26px rgba(255,222,107,0.55); transform-origin: bottom; animation: spotl-grow 0.9s cubic-bezier(.34,1.15,.4,1) both; }
        /* panel ochilganda chiroq PASTDAN YUQORIGA to'lib yonadi — imzo-moment (keyingi jonli o'zgarishlar height-transition bilan) */
        @keyframes spotl-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .spotl:nth-child(2) .spotl-fill { animation-delay: 0.14s; } .spotl:nth-child(3) .spotl-fill { animation-delay: 0.28s; }
        .spotl.mine .spotl-fill { background: linear-gradient(180deg, rgba(167,139,250,0.28), rgba(167,139,250,0.9)); box-shadow: 0 0 26px rgba(140,100,255,0.6); }
        .spotl-abc { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; color: #B9A8E6; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 7px; background: rgba(255,255,255,0.08); }
        .spotl.mine .spotl-abc { color: #fff; background: ${T.accent}; }
        .spot-note { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(12.5px,1.5vw,14px); color: #CFC6EE; text-align: center; }
        @media (prefers-reduced-motion: reduce) { .spotl-fill { transition: none; animation: none; } .spotl-star { animation: none; } .hook-mc.taphint { animation: none; } }
        .hook-hero { display: flex; justify-content: center; }
        .hook-cup { font-size: clamp(48px,10vw,86px); line-height: 1; filter: drop-shadow(0 10px 18px rgba(91,61,230,0.28)); animation: float-sm 2.6s ease-in-out infinite; }
        @keyframes float-sm { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-8px) rotate(3deg); } }

        .h-title { font-size: clamp(22px,4vw,38px); }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        /* === STAGE === */
        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

        /* === FRAME === */
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(91,61,230,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        /* === LAYOUT === */
        .screen { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }

        /* === TAKEAWAY === */
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
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }

        /* === bb-dots (kod-muharrir sarlavhasi) === */
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }

        /* === 🎬 MAQSAD IMZO-VIZUAL: SAHNA + PROYEKTOR NURI — pitch-karta o'zi tiziladi (CSS-taymlayn) === */
        .pstage { position: relative; overflow: hidden; background: linear-gradient(180deg, #171130, #241A4A); border-radius: 20px; padding: clamp(18px,2.8vw,28px); display: flex; flex-direction: column; align-items: center; gap: 13px; box-shadow: 0 16px 40px -14px rgba(23,17,48,0.6); }
        .pstage-beam { position: absolute; top: -18%; left: 50%; transform: translateX(-50%); width: 74%; height: 132%; background: radial-gradient(50% 62% at 50% 0%, rgba(255,240,200,0.22), transparent 70%); pointer-events: none; animation: pstage-sway 5.5s ease-in-out infinite, pstage-up 0.9s ease-out 4.3s both; }
        @keyframes pstage-sway { 0%,100% { transform: translateX(-53%); } 50% { transform: translateX(-47%); } }
        /* shtamp tushgan lahzada nur yorishadi — «sahna tayyor» payoff */
        @keyframes pstage-up { from { filter: brightness(1); } to { filter: brightness(1.5); } }
        .pstage-head { display: flex; align-items: center; justify-content: space-between; align-self: stretch; z-index: 1; }
        .pstage-live { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.12em; color: #FFD35A; background: rgba(255,255,255,0.08); border-radius: 99px; padding: 5px 13px; }
        .pstage-timer { font-weight: 700; font-size: 13px; color: #CFC6EE; background: rgba(255,255,255,0.08); border-radius: 99px; padding: 5px 13px; font-variant-numeric: tabular-nums; animation: ptimer-set 0.5s ease-out 4.35s both; }
        /* shtamp bilan birga taymer «oltin»ga yonadi — 2 daqiqa sahna-vaqti belgilandi */
        @keyframes ptimer-set { from { color: #CFC6EE; box-shadow: none; } to { color: #FFD35A; box-shadow: 0 0 16px rgba(255,211,90,0.3), inset 0 0 0 1px rgba(255,211,90,0.4); } }
        .pstage-card { position: relative; z-index: 1; background: #fff; border-radius: 14px; padding: clamp(14px,2.2vw,20px) clamp(15px,2.4vw,22px); width: 100%; max-width: 580px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 20px 44px -16px rgba(0,0,0,0.55); }
        .pp-row { display: flex; gap: 10px; align-items: flex-start; min-width: 0; opacity: 0; transform: translateY(9px); animation: pp-in 0.5s cubic-bezier(.3,1.3,.4,1) forwards; animation-delay: var(--pd, 1s); }
        @keyframes pp-in { 0% { opacity: 0; transform: translateY(9px) scale(0.97); } 60% { opacity: 1; transform: translateY(-2px) scale(1.02); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .pp-lbl { flex-shrink: 0; font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.06em; padding: 5px 10px; border-radius: 7px; }
        .pp-row.muammo .pp-lbl { color: ${T.blue}; background: ${T.blueSoft}; }
        .pp-row.yechim .pp-lbl { color: #B77A16; background: #FBEED6; }
        .pp-row.demo .pp-lbl { color: ${T.success}; background: ${T.successSoft}; }
        .pp-txt { font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.9vw,17px); color: ${T.ink}; line-height: 1.4; min-width: 0; overflow-wrap: anywhere; }
        .pstage-stamp { align-self: flex-end; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.08em; color: ${T.success}; border: 2.5px solid ${T.success}; border-radius: 8px; padding: 4px 11px; opacity: 0; transform: rotate(-6deg) scale(0); animation: pstamp-in 0.5s cubic-bezier(.3,1.5,.4,1) forwards; animation-delay: var(--pd, 4s); }
        @keyframes pstamp-in { 0% { opacity: 0; transform: rotate(10deg) scale(0); } 70% { opacity: 1; transform: rotate(-8deg) scale(1.12); } 100% { opacity: 1; transform: rotate(-6deg) scale(1); } }
        .pstage-mic { position: absolute; bottom: 10px; left: 15px; z-index: 1; font-size: clamp(26px,4vw,40px); filter: drop-shadow(0 6px 12px rgba(0,0,0,0.5)); }
        @media (prefers-reduced-motion: reduce) {
          .pp-row, .pstage-stamp { animation: none; opacity: 1; transform: none; }
          .pstage-stamp { transform: rotate(-6deg); }
          .pstage-beam { animation: none; filter: brightness(1.5); }
          .pstage-timer { animation: none; color: #FFD35A; box-shadow: 0 0 16px rgba(255,211,90,0.3), inset 0 0 0 1px rgba(255,211,90,0.4); }
        }

        /* === PROYEKTOR SAVOL + MISOL (yadro) === */
        .proj-q { background: ${T.paper}; border-radius: 14px; padding: clamp(16px,2.5vw,22px); box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); display: flex; flex-direction: column; gap: 8px; border-left: 4px solid ${T.accent}; }
        .proj-q-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .proj-q-body { font-size: clamp(16px,2.3vw,20px); font-weight: 500; color: ${T.ink}; line-height: 1.4; margin: 0; }
        .proj-q.broken { border-left: none; background: repeating-linear-gradient(${T.paper}, ${T.paper} 33px, ${T.line}55 33px, ${T.line}55 34px); box-shadow: 0 12px 30px -12px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; position: relative; }
        .proj-q.broken::before { content: "📄"; position: absolute; top: 12px; right: 14px; font-size: 18px; opacity: 0.4; }
        .broken-story { font-family: 'Source Serif 4', serif; font-size: clamp(20px,3.2vw,27px); color: ${T.ink}; margin: 0; line-height: 1.42; }
        .broken-cue { font-size: 13px; color: ${T.ink2}; margin: 0; font-weight: 600; }
        .ex-card { background: ${T.successSoft}; border-radius: 14px; padding: clamp(14px,2.2vw,18px); display: flex; flex-direction: column; gap: 10px; }
        .ex-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.success}; }
        .ex-body { font-size: clamp(15px,2vw,18px); color: ${T.ink}; margin: 0; line-height: 1.45; }

        /* === s2 FLIP-KARTA mashq (sinfdosh-o'yin) — UNSCORED, 3D ag'darish + reduced-motion fallback === */
        .pflip-row { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(12px,2vw,16px); }
        @media (max-width: 640px) { .pflip-row { grid-template-columns: 1fr; } }
        .pflip { perspective: 950px; cursor: pointer; border: none; background: none; padding: 0; text-align: left; height: clamp(160px,22vw,190px); }
        .pflip-inner { position: relative; width: 100%; height: 100%; transition: transform 0.55s cubic-bezier(.3,1.05,.4,1); transform-style: preserve-3d; display: block; }
        .pflip.flipped .pflip-inner { transform: rotateY(180deg); }
        .pflip-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 14px; padding: 15px 16px; display: flex; flex-direction: column; gap: 9px; overflow: hidden; }
        .pflip-front { background: ${T.paper}; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.line}; }
        .pflip:not(.flipped):hover .pflip-front { box-shadow: 0 12px 26px -8px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.accent}55; }
        .pf-tag { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink3}; background: ${T.bg}; border-radius: 99px; padding: 3px 10px; }
        .pf-txt { font-family: 'Source Serif 4', serif; font-size: clamp(15px,2vw,18px); color: ${T.ink}; line-height: 1.42; min-width: 0; overflow-wrap: anywhere; }
        .pf-hint { margin-top: auto; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.accent}; animation: pf-hint-pulse 2.2s ease-in-out infinite; }
        @keyframes pf-hint-pulse { 0%,100% { opacity: 0.65; } 50% { opacity: 1; } }
        .pflip-back { transform: rotateY(180deg); box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.2); }
        .pflip-back.weak { background: ${T.accentSoft}; }
        .pflip-back.strong { background: ${T.successSoft}; }
        .pflip-back.weak .pf-tag { color: ${T.accent}; background: ${T.paper}; }
        .pflip-back.strong .pf-tag { color: ${T.success}; background: ${T.paper}; }
        .pf-back-txt { font-family: 'Manrope'; font-weight: 600; font-size: clamp(14px,1.9vw,16.5px); color: ${T.ink}; line-height: 1.5; min-width: 0; overflow-wrap: anywhere; }
        @media (prefers-reduced-motion: reduce) { .pflip-inner { transition: none; } .pf-hint { animation: none; opacity: 1; } }

        /* === FORMULA KONSTRUKTOR (s3) === */
        .formula-line { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: ${T.paper}; background-image: radial-gradient(rgba(${T.shadowBase},0.05) 1px, transparent 1.2px); background-size: 16px 16px; border-radius: 14px; padding: clamp(16px,2.5vw,22px); box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14), inset 0 0 0 1.5px ${T.line}; font-size: clamp(15px,2.1vw,19px); }
        .fw { color: ${T.ink2}; font-weight: 500; }
        /* Bo'sh slot NEUTRAL (rang-ishorasiz) — rang faqat to'g'ri joylashgach paydo bo'ladi */
        .fslot { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.6vw,14px); letter-spacing: 0.04em; padding: 8px 14px; border-radius: 10px; border: 2px dashed ${T.ink3}; color: ${T.ink3}; min-width: 74px; text-align: center; transition: all 0.25s; background: transparent; cursor: default; }
        .fslot:disabled { cursor: default; }
        .fslot.targetable { cursor: pointer; border-color: ${T.accent}; color: ${T.accent}; box-shadow: 0 0 0 4px ${T.accent}1F; }
        .fslot.shake { animation: fslot-shake 0.44s cubic-bezier(.36,.07,.19,.97); border-color: ${T.err}; color: ${T.err}; }
        @keyframes fslot-shake { 10%,90% { transform: translateX(-2px); } 20%,80% { transform: translateX(3px); } 30%,50%,70% { transform: translateX(-5px); } 40%,60% { transform: translateX(5px); } }
        .fslot.filled { border-style: solid; letter-spacing: 0; animation: fslot-snap 0.42s cubic-bezier(.34,1.65,.4,1); }
        @keyframes fslot-snap { 0% { transform: scale(0.86); } 45% { transform: scale(1.12); } 70% { transform: scale(0.97); } 100% { transform: scale(1); } }
        /* reduced-motion: silkinish/pop o'chadi, lekin xato-rang (err) va to'ldirilgan-rang belgisi qoladi — feedback yo'qolmaydi */
        @media (prefers-reduced-motion: reduce) { .fslot.filled, .fslot.shake { animation: none; } }
        .fslot.kim.filled { background: ${T.blueSoft}; color: ${T.blue}; border-color: ${T.blue}; }
        .fslot.nima.filled { background: #FBEED6; color: #B77A16; border-color: #E8A13A; }
        .fslot.natija.filled { background: ${T.successSoft}; color: ${T.success}; border-color: ${T.success}; }
        .frag-pool { display: flex; flex-wrap: wrap; gap: 10px; }
        .frag-chip { font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.7vw,15px); padding: 11px 16px; border-radius: 11px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.line}; }
        .frag-chip:hover:not(:disabled) { transform: translateY(-3px) rotate(-1deg); box-shadow: 0 12px 22px -8px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.accent}44; }
        .frag-chip:active:not(:disabled) { transform: translateY(-1px) scale(0.97); }
        /* Chip NEUTRAL — rang-ishora yo'q; tanlanganda accent bilan belgilanadi */
        .frag-chip.sel { background: ${T.accent}; color: #fff; box-shadow: 0 10px 22px -8px rgba(91,61,230,0.55), inset 0 0 0 1.5px ${T.accent}; transform: translateY(-2px); }
        .frag-chip.sel:hover { box-shadow: 0 12px 24px -8px rgba(91,61,230,0.6), inset 0 0 0 1.5px ${T.accent}; }
        .frag-chip.used { opacity: 0.35; cursor: default; }

        /* === K12 SLAYD (s4) === */
        .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        .k-slide::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}, ${T.blue}); }
        .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
        .k-slide-ic { font-size: clamp(40px,7vw,64px); line-height: 1; }
        .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(20px,3.2vw,30px); color: ${T.ink}; margin: 0; }
        .k-slide-body { font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; } .k-slide-body b { color: ${T.ink}; }
        .k-dots { display: flex; gap: 8px; justify-content: center; }
        .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }

        /* === ✍️ PITCH-YOZUV KARTALARI (amaliyot + ustaxona) — 28-qonun: split, validator doim ko'rinadi === */
        .pwrite { background: ${T.paper}; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); border-left: 4px solid ${T.ink3}; transition: border-color 0.25s, box-shadow 0.25s; min-width: 0; }
        .pwrite.muammo { border-left-color: ${T.blue}66; }
        .pwrite.yechim { border-left-color: #E8A13A88; }
        .pwrite.demo { border-left-color: ${T.success}66; }
        .pwrite.ok { border-left-color: ${T.success}; box-shadow: 0 8px 20px -8px rgba(18,169,104,0.28); animation: card-fill-pop 0.42s cubic-bezier(.34,1.5,.4,1); }
        @keyframes card-fill-pop { 0% { transform: scale(1); } 40% { transform: scale(1.012) translateY(-2px); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .pwrite.ok { animation: none; } }
        .pwrite-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.06em; color: ${T.ink3}; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .pwrite-lbl.muammo { color: ${T.blue}; } .pwrite-lbl.yechim { color: #B77A16; } .pwrite-lbl.demo { color: ${T.success}; }
        .pwrite-sub { font-weight: 600; font-style: normal; font-size: 10.5px; letter-spacing: 0.02em; text-transform: none; color: ${T.ink3}; }
        .pwrite-kept { font-weight: 800; font-style: normal; font-size: 10px; color: ${T.ink3}; background: ${T.bg}; border-radius: 99px; padding: 2px 9px; box-shadow: inset 0 0 0 1px ${T.line}; text-transform: none; }
        .pwrite-ta { font-family: 'Manrope'; font-weight: 500; font-size: 14.5px; line-height: 1.5; color: ${T.ink}; border: none; border-radius: 9px; padding: 10px 12px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.18s; width: 100%; min-height: 64px; resize: vertical; min-width: 0; overflow-wrap: anywhere; }
        .pwrite-ta:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .pwrite.ok .pwrite-ta { box-shadow: inset 0 0 0 1.5px ${T.success}66; background: ${T.paper}; }
        /* Sahna-monitor (jonli holat-panel) — kiritish-vizual BARCHA holatlarda ko'rinadi */
        .pmon { background: radial-gradient(85% 60% at 50% 0%, rgba(255,240,200,0.09), transparent 72%), linear-gradient(180deg, #171130, #241A4A); border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 9px; min-width: 0; box-shadow: 0 12px 28px -12px rgba(23,17,48,0.55); }
        .pmon-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #FFD35A; }
        .pmon-txt { margin: 0; font-family: 'Source Serif 4', serif; font-size: clamp(15px,2vw,18px); color: #fff; line-height: 1.45; min-width: 0; overflow-wrap: anywhere; word-break: break-word; }
        .pmon-txt.empty { color: rgba(255,255,255,0.42); font-style: italic; }
        .pmon-status { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: #CFC6EE; background: rgba(255,255,255,0.08); border-radius: 99px; padding: 4px 12px; transition: all 0.25s; }
        .pmon-status.ok { color: #0B2417; background: #3CE88E; box-shadow: 0 0 18px rgba(60,232,142,0.5); }
        /* Pitch-ssenariy jonli yig'ma (ustaxona) — oq qog'oz, min-width himoya */
        .pscript { background: ${T.paper}; border-radius: 14px; border-left: 4px solid ${T.accent}; padding: 13px 15px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); min-width: 0; }
        .pscript .pmon-lbl { color: ${T.accent}; }
        .pscript-row { margin: 0; font-family: 'Source Serif 4', serif; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; line-height: 1.5; min-width: 0; overflow-wrap: anywhere; word-break: break-word; animation: fade-step 0.3s ease-out; }
        .pscript-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.05em; margin-right: 7px; padding: 2px 8px; border-radius: 6px; vertical-align: 1px; }
        .pscript-lbl.muammo { color: ${T.blue}; background: ${T.blueSoft}; }
        .pscript-lbl.yechim { color: #B77A16; background: #FBEED6; }
        .pscript-lbl.demo { color: ${T.success}; background: ${T.successSoft}; }
        .pscript-lbl.ilgak { color: ${T.accent}; background: ${T.accentSoft}; }

        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }

        /* === YORDAM (ochiladigan) === */
        .yordam { background: ${T.bg}; border: 1.5px dashed ${T.ink3}66; border-radius: 12px; overflow: hidden; }
        .yordam-toggle { width: 100%; text-align: left; background: none; border: none; padding: 12px 15px; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.accent}; cursor: pointer; }
        .yordam-body { padding: 0 15px 13px; display: flex; flex-direction: column; gap: 7px; }
        .yordam-body p { font-size: 13.5px; color: ${T.ink2}; margin: 0; } .yordam-body b { color: ${T.ink}; }
        .yordam-hint { color: ${T.accent} !important; font-weight: 700; }

        /* === 🎯 TOPSHIRIQ-PANEL (TaskSpec) — shartlarning yagona vizual tili === */
        .tspec { background: ${T.paper}; border-radius: 14px; padding: 12px 14px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 9px; border-left: 3px solid ${T.accent}; transition: border-color 0.3s; }
        .tspec.all { border-left-color: ${T.success}; }
        .tspec.sticky { position: sticky; top: 8px; z-index: 6; }
        .tspec-h { display: flex; align-items: center; justify-content: space-between; }
        .tspec-ttl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
        .tspec-cnt { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12.5px; color: ${T.ink3}; background: ${T.bg}; border-radius: 99px; padding: 2px 10px; transition: all 0.25s; }
        .tspec-cnt.ok { color: #fff; background: ${T.success}; }
        .tspec-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .tspec-chip { display: inline-flex; align-items: center; gap: 7px; background: ${T.bg}; border: none; border-radius: 99px; padding: 6px 12px 6px 6px; box-shadow: inset 0 0 0 1.5px ${T.line}; cursor: pointer; transition: background 0.25s, box-shadow 0.25s; font-family: 'Manrope'; min-width: 0; }
        .tspec-chip.open { box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
        .tspec-chip.on { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}55; animation: hc-cond-pop 0.4s cubic-bezier(.34,1.5,.4,1); }
        .tspec-box { width: 21px; height: 21px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}55; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; color: ${T.ink3}; transition: all 0.2s; }
        .tspec-chip.on .tspec-box { background: ${T.success}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        .tspec-lbl { font-weight: 700; font-size: clamp(12px,1.4vw,13.5px); color: ${T.ink2}; overflow-wrap: anywhere; }
        .tspec-chip.on .tspec-lbl { color: ${T.ink}; }
        .tspec-car { font-size: 10px; color: ${T.ink3}; flex-shrink: 0; }
        .tspec-detail { margin: 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; background: ${T.accentSoft}; border-radius: 9px; padding: 8px 11px; overflow-wrap: anywhere; min-width: 0; }
        @media (prefers-reduced-motion: reduce) { .tspec-chip.on, .tspec-chip.on .tspec-box { animation: none; } }

        /* 31-qonun: «kim bajaradi» yozuvi (faqat mentor ko'radi) */
        .mwatch { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; background: ${T.blueSoft}; border-left: 3px solid ${T.blue}; border-radius: 9px; padding: 8px 12px; align-self: flex-start; }
        .mwatch b { color: ${T.ink}; }

        /* muvaffaqiyat = ixcham chip (paragraf-ramka EMAS) */
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }

        /* === HOTSPOT (buzuq bo'laklar) === */
        .hs-parts { justify-content: center; }
        .hs-chip { font-family: 'Source Serif 4', serif; font-size: clamp(15px,2.1vw,19px); padding: 12px 18px; border-radius: 12px; border: 2px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.18); }
        .hs-chip:hover:not(:disabled) { border-color: ${T.blue}; transform: translateY(-2px); }
        .hs-chip:disabled { cursor: default; }
        /* buzuq bo'lak TOPILDI = yashil «✓ topdingiz» (xato emas — nishonni topish) */
        .hs-broken { position: relative; background: ${T.successSoft} !important; color: ${T.success} !important; border-color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(18,169,104,0.34) !important; animation: hs-found-pop 0.44s cubic-bezier(.34,1.5,.4,1); }
        .hs-broken::after { content: '✓'; position: absolute; top: -9px; right: -9px; width: 22px; height: 22px; border-radius: 50%; background: ${T.success}; color: #fff; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -3px rgba(18,169,104,0.5); }
        @keyframes hs-found-pop { 0% { transform: scale(0.92); } 45% { transform: scale(1.06) translateY(-3px); } 100% { transform: scale(1); } }
        .hs-ok { opacity: 0.45 !important; }
        .hs-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; border-color: ${T.blue} !important; }
        /* o'quvchi NOTO'G'RI bosgan bo'lak = qizil (faqat shu holatda) */
        .hs-miss { background: ${T.errSoft} !important; color: ${T.err} !important; border-color: ${T.err} !important; opacity: 1 !important; text-decoration: line-through; box-shadow: 0 8px 22px -6px rgba(229,72,77,0.28) !important; }
        @media (prefers-reduced-motion: reduce) { .hs-broken { animation: none; } }

        /* === KODING: launch-karta (darsdan kompilyatorga «boradi») === */
        .kod-launch { position: relative; border-radius: 16px; overflow: hidden; background: ${CODE.bg}; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.35); }
        .kod-launch-bar { background: #141C2B; padding: 10px 14px; display: flex; align-items: center; gap: 10px; }
        .kod-launch-title { font-family: 'JetBrains Mono'; font-size: 11.5px; color: #7E92B4; }
        .kod-launch-body { padding: 16px 18px; min-height: 190px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.7; color: rgba(232,229,221,0.45); white-space: pre-wrap; word-break: break-word; }
        .kod-launch-veil { position: absolute; inset: 42px 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(180deg, rgba(26,36,54,0.45), rgba(26,36,54,0.85)); }
        .kod-launch-btn { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,1.9vw,17px); background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 14px 28px; cursor: pointer; box-shadow: 0 14px 30px -8px rgba(91,61,230,0.65); transition: transform 0.18s, box-shadow 0.18s; animation: kod-btn-pulse 2.2s ease-in-out infinite; }
        .kod-launch-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -8px rgba(110,75,255,0.75); }
        @keyframes kod-btn-pulse { 0%,100% { box-shadow: 0 14px 30px -8px rgba(91,61,230,0.65); } 50% { box-shadow: 0 14px 38px -4px rgba(110,75,255,0.85); } }
        .kod-launch-sub { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: rgba(232,229,221,0.75); text-align: center; padding: 0 14px; }
        @media (prefers-reduced-motion: reduce) { .kod-launch-btn { animation: none; } }
        .code-out-empty { font-family: 'Manrope', sans-serif; font-size: 12.5px; color: ${T.ink3}; font-style: italic; margin: 0; }

        /* === PM-KOMPILYATOR (to'liq-ekran, Htmllesson1 relslari, PM palitra) === */
        .hcp-root { position: fixed; inset: 0; z-index: 2100; background: radial-gradient(120% 80% at 50% -10%, ${T.accentSoft} 0%, rgba(235,229,253,0) 46%), ${T.bg}; overflow: hidden; animation: fade-step 0.3s ease-out; }
        .hcp-wrap { width: 100%; max-width: 1160px; height: 100dvh; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; gap: clamp(10px,1.6vw,16px); padding: clamp(14px,2.2vw,28px); }
        .hcp-top { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 7px; }
        .hcp-eyebrow { font-family: 'Manrope'; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 800; color: ${T.accent}; display: inline-flex; align-items: center; gap: 7px; }
        .hcp-eyebrow::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: ${T.accent}; }
        .hcp-title { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(20px,2.8vw,30px); margin: 0; color: ${T.ink}; letter-spacing: -0.01em; line-height: 1.12; }
        .hcp-brief { margin: 0; color: ${T.ink2}; font-size: clamp(13px,1.5vw,15px); line-height: 1.55; max-width: 64ch; }
        .hcp-checklist { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 5px; }
        .hcp-count { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; color: #fff; background: linear-gradient(135deg, ${T.accent}, ${T.accentVivid}); padding: 6px 11px; border-radius: 99px; box-shadow: 0 6px 16px -6px rgba(91,61,230,0.5); }
        .hcp-chip { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-size: 13px; font-weight: 500; color: ${T.ink2}; background: ${T.paper}; padding: 6px 14px 6px 7px; border-radius: 99px; border: 1px solid ${T.line}; transition: all 0.22s ease; cursor: default; }
        .hcp-chip.ok { color: ${T.ink}; font-weight: 600; border-color: ${T.success}40; background: ${T.successSoft}; }
        .hcp-dot { flex-shrink: 0; width: 21px; height: 21px; border-radius: 50%; background: ${T.bg}; color: ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; transition: all 0.25s; }
        .hcp-chip.ok .hcp-dot { background: ${T.success}; color: #fff; box-shadow: 0 3px 8px -2px ${T.success}88; }
        .hcp-hint { margin: 3px 0 0; font-family: 'Manrope'; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 8px 15px; border-radius: 11px; max-width: 64ch; line-height: 1.5; }
        .hcp-split { flex: none; height: 58vh; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(12px,1.6vw,18px); }
        .hcp-pane { display: flex; flex-direction: column; min-height: 0; border-radius: 18px; overflow: hidden; background: ${T.paper}; box-shadow: 0 1px 0 ${T.line}, 0 18px 40px -22px rgba(${T.shadowBase},0.35); }
        .hcp-pane-bar { display: flex; align-items: center; gap: 10px; padding: 10px 15px; font-family: 'Manrope'; font-size: 12px; font-weight: 600; color: ${T.ink2}; border-bottom: 1px solid ${T.line}; }
        .hcp-pane-bar.dark { background: ${CODE.bg}; color: #A7B6D6; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .hcp-tab { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: #fff; background: rgba(255,255,255,0.14); padding: 5px 13px; border-radius: 9px; box-shadow: inset 0 -2px 0 ${T.accent}; }
        .hcp-mini { margin-left: auto; background: ${T.accent}; color: #fff; border: none; border-radius: 9px; padding: 6px 13px; font-size: 11.5px; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; transition: all 0.18s; flex-shrink: 0; box-shadow: 0 6px 14px -6px rgba(91,61,230,0.6); }
        .hcp-mini:hover { transform: translateY(-1px); box-shadow: 0 9px 18px -6px rgba(91,61,230,0.7); }
        .hcp-code { flex: 1; min-height: 0; resize: none; border: none; outline: none; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 1.7; padding: 18px 20px; tab-size: 2; white-space: pre; overflow: auto; caret-color: ${T.accentVivid}; }
        .hcp-code::placeholder { color: #5B6B86; }
        .hcp-code::selection { background: ${T.accent}55; }
        .hcp-pane-name { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
        .hcp-live { margin-left: auto; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${T.success}; background: ${T.successSoft}; padding: 4px 9px; border-radius: 99px; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; }
        .hcp-live::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: ${T.success}; animation: hcp-pulse 1.8s infinite; }
        @keyframes hcp-pulse { 0% { box-shadow: 0 0 0 0 ${T.success}66; } 70% { box-shadow: 0 0 0 6px ${T.success}00; } 100% { box-shadow: 0 0 0 0 ${T.success}00; } }
        .hcp-frame { flex: 1; min-height: 0; width: 100%; border: none; background: #FBFAFE; }
        .hcp-bottom { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .hcp-ghost { background: transparent; border: 1px solid transparent; color: ${T.ink2}; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; padding: 11px 17px; border-radius: 12px; transition: all 0.15s; }
        .hcp-ghost:hover { background: ${T.paper}; color: ${T.ink}; border-color: ${T.line}; box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.3); }
        .hcp-status { margin-left: auto; }
        .hcp-ok-msg { color: ${T.success}; font-family: 'Manrope'; font-weight: 700; font-size: 14px; }
        .hcp-wait-msg { color: ${T.ink3}; font-family: 'Manrope'; font-size: 13px; }
        .hcp-next { background: ${T.accent}; color: #fff; border: none; border-radius: 13px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 15px; cursor: pointer; padding: 13px 30px; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.6); transition: all 0.2s; }
        .hcp-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 32px -8px rgba(110,75,255,0.7); }
        .hcp-next:disabled { background: #D7D8DE; color: #fff; cursor: not-allowed; box-shadow: none; }
        @media (max-width: 820px) { .hcp-split { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; } .hcp-checklist { width: 100%; } }
        /* Compiler topshiriq-panel (JS-check shartlari — jonli ✓) */
        /* Topshiriq-panel = «brief-hujjat» (chap-accent hoshiya, yumshoq qog'oz) */
        .hc-task { background: linear-gradient(180deg, ${T.paper}, #FBFAFE); border-radius: 14px; border-left: 4px solid ${T.accent}; padding: 15px 17px 16px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .hc-conds { display: flex; flex-direction: column; gap: 9px; }
        .hc-cond { display: flex; align-items: flex-start; gap: 10px; background: ${T.bg}; border-radius: 11px; padding: 10px 12px; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: box-shadow 0.25s, background 0.25s; }
        .hc-cond.ok { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}55; animation: hc-cond-pop 0.4s cubic-bezier(.34,1.5,.4,1); }
        @keyframes hc-cond-pop { 0% { transform: scale(1); } 42% { transform: scale(1.015) translateY(-1px); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .hc-cond.ok { animation: none; } }
        .hc-cond-box { width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}55; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.ink3}; transition: all 0.2s; }
        .hc-cond.ok .hc-cond-box { background: ${T.success}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        .hc-cond-txt { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        .hc-cond-label { font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; line-height: 1.35; }
        /* hint = ochiladigan yumshoq indigo maslahat (xato-ogohlantirish EMAS) */

        /* === YAKUNIY SO'Z — 3 qadam oqimi === */
        .rcp-flow { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; }
        @media (max-width: 760px) { .rcp-flow { grid-template-columns: 1fr; } }
        .rcp-step { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 12px; }
        .rcp-step.wide { grid-column: 1 / -1; }
        .rcp-step-h { display: flex; gap: 11px; align-items: flex-start; }
        .rcp-n { width: 26px; height: 26px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 5px 12px -5px rgba(91,61,230,0.5), 0 0 0 3px ${T.accentSoft}; }
        .rcp-t { display: block; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .rcp-s { display: block; font-family: 'Manrope'; font-size: 12.5px; color: ${T.ink2}; margin-top: 2px; line-height: 1.4; }
        .pair-timer { background: ${T.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 10px; box-shadow: inset 0 0 0 1.5px ${T.line}; margin-top: auto; }
        .pair-timer-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .pair-now { font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink2}; line-height: 1.45; }
        .pair-who { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 8px; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 13px; vertical-align: middle; }
        .pair-who.b { background: ${T.success}; }
        .pair-clock { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 22px; color: ${T.ink}; font-variant-numeric: tabular-nums; }
        .pair-prog { position: relative; height: 8px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; }
        .pair-prog-fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 99px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}); transition: width 1s linear; }
        .pair-prog-mid { position: absolute; left: 50%; top: -3px; bottom: -3px; width: 2px; background: ${T.ink3}; border-radius: 2px; }
        .pair-timer-btns { display: flex; gap: 8px; }
        .reflect-input { font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; border: none; border-radius: 10px; padding: 12px 14px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; }
        .reflect-input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        /* === 🧲 MATCHPAIRS (TEST-3) — PmMetricsLesson s9 vizual oilasi (27-qonun: dekor + mikro-animatsiya) === */
        .mmx-wrap { position: relative; display: flex; flex-direction: column; gap: clamp(14px,2.2vw,20px); }
        .mmx-decor { position: absolute; inset: -10px; pointer-events: none; z-index: 0; overflow: hidden; }
        .mmx-t { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: rgba(91,61,230,0.065); user-select: none; white-space: nowrap; }
        .mmx-t.md0 { left: 1%; top: 2%; font-size: 26px; transform: rotate(-9deg); }
        .mmx-t.md1 { right: 3%; top: 10%; font-size: 30px; transform: rotate(6deg); }
        .mmx-t.md2 { left: 40%; top: 40%; font-size: 24px; transform: rotate(-4deg); }
        .mmx-t.md3 { left: 4%; bottom: 8%; font-size: 20px; transform: rotate(7deg); }
        .mmx-t.md4 { right: 6%; bottom: 16%; font-size: 22px; transform: rotate(-6deg); }
        .mmx-t.md5 { right: 28%; top: 26%; font-size: 20px; transform: rotate(4deg); }
        .match-pool { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; min-height: 50px; }
        .match-chip { display: inline-flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.9vw,16px); padding: 12px 18px; border-radius: 13px; border: none; background: linear-gradient(180deg, #fff, #F5F2FE); color: ${T.ink}; cursor: grab; box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.26), inset 0 0 0 1.5px ${T.line}; transition: transform 0.16s, box-shadow 0.18s; }
        .match-chip-ic { font-size: 20px; line-height: 1; }
        .match-chip-ic.sm { font-size: 15px; margin-right: 5px; }
        .match-chip:hover:not(:disabled) { transform: translateY(-2px) rotate(-1.5deg) scale(1.02); box-shadow: 0 14px 26px -8px rgba(${T.shadowBase},0.32), inset 0 0 0 1.5px ${T.accent}55; }
        .match-chip:disabled { cursor: default; }
        .match-chip.sel { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 10px 22px -8px rgba(91,61,230,0.34), inset 0 0 0 2px ${T.accent}; }
        .match-chip.dragging { opacity: 0.85; transform: scale(1.07) rotate(3deg); cursor: grabbing; box-shadow: 0 18px 32px -10px rgba(91,61,230,0.4), inset 0 0 0 2px ${T.accent}; }
        .match-pool-empty { font-family: 'Manrope'; font-size: 13px; color: ${T.success}; font-weight: 700; }
        .match-hint { position: relative; z-index: 1; text-align: center; color: ${T.ink3}; min-height: 16px; }
        .match-targets { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 10px; }
        .match-target { display: flex; align-items: center; gap: 12px; background: ${T.paper}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16), inset 0 0 0 1.5px ${T.line}; cursor: pointer; transition: box-shadow 0.2s, background 0.2s, transform 0.16s; }
        .match-target.filled { box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.accent}44; }
        .match-target.droppable { box-shadow: 0 8px 20px -8px rgba(91,61,230,0.28), inset 0 0 0 2px ${T.accent}66; animation: mmx-halo 1.4s ease-in-out infinite; }
        @keyframes mmx-halo { 0%,100% { box-shadow: 0 8px 20px -8px rgba(91,61,230,0.28), inset 0 0 0 2px ${T.accent}66; } 50% { box-shadow: 0 12px 32px -6px rgba(110,75,255,0.5), inset 0 0 0 2.5px ${T.accentVivid}; } }
        .match-target.droppable:hover { transform: translateY(-2px); background: ${T.accentSoft}; box-shadow: 0 12px 26px -8px rgba(91,61,230,0.36), inset 0 0 0 2px ${T.accent}; }
        .match-target.ok { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}66; animation: match-target-pop 0.44s cubic-bezier(.34,1.5,.4,1); }
        @keyframes match-target-pop { 0% { transform: scale(1); } 40% { transform: scale(1.015) translateY(-2px); } 100% { transform: scale(1); } }
        .match-target.bad { background: ${T.errSoft}; box-shadow: inset 0 0 0 1.5px ${T.err}66; }
        .match-target-q { flex: 1; font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.9vw,17px); color: ${T.ink}; line-height: 1.35; min-width: 0; overflow-wrap: anywhere; }
        .match-slot { position: relative; flex-shrink: 0; min-width: clamp(110px,22vw,150px); display: flex; justify-content: center; }
        .match-slot-chip { display: inline-flex; align-items: center; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; padding: 8px 12px; border-radius: 9px; background: ${T.accentSoft}; color: ${T.accent}; white-space: nowrap; animation: match-snap 0.38s cubic-bezier(.3,1.5,.4,1); }
        .match-slot-chip.ok { background: ${T.success}; color: #fff; animation: match-snap 0.42s cubic-bezier(.34,1.55,.4,1); }
        @keyframes match-snap { 0% { transform: scale(0.68); } 48% { transform: scale(1.18); } 100% { transform: scale(1); } }
        .match-slot-chip.bad { background: ${T.err}; color: #fff; }
        .match-slot-empty { font-family: 'Manrope'; font-size: 12px; color: ${T.ink3}; font-style: italic; border: 1.5px dashed ${T.ink3}66; border-radius: 9px; padding: 8px 14px; }
        .mmx-burst { position: absolute; top: 50%; left: 50%; width: 0; height: 0; pointer-events: none; z-index: 5; }
        .mmx-burst span { position: absolute; left: -6px; top: -6px; font-size: 12px; color: #F5A623; text-shadow: 0 0 8px rgba(245,166,35,0.7); opacity: 0; transform: rotate(var(--ba)) translateY(0) scale(0.4); animation: mmx-burst-fly 0.8s ease-out 0.1s forwards; }
        @keyframes mmx-burst-fly { 0% { opacity: 0; transform: rotate(var(--ba)) translateY(0) scale(0.4); } 30% { opacity: 1; } 100% { opacity: 0; transform: rotate(var(--ba)) translateY(-42px) scale(1); } }
        @media (prefers-reduced-motion: reduce) { .match-target.ok, .match-target.droppable, .match-slot-chip, .match-slot-chip.ok, .match-chip.dragging { animation: none; } .mmx-burst { display: none; } .match-chip:hover:not(:disabled) { transform: none; } }

        /* Uyga-vazifa SHARTNOMA — tanlov-chiplar */
        .hw-chips { display: flex; flex-wrap: wrap; gap: 10px; }
        .hw-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); padding: 11px 18px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.18), inset 0 0 0 1.5px ${T.line}; transition: all 0.18s; }
        .hw-chip:hover:not(.on) { transform: translateY(-2px); box-shadow: 0 10px 22px -8px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.accent}55; }
        /* tanlangan = to'ldirilgan indigo (aniq holat) */
        .hw-chip.on { background: ${T.accent}; color: #fff; box-shadow: 0 8px 18px -6px rgba(91,61,230,0.4), inset 0 0 0 2px ${T.accent}; }

        /* === PM-TOPSHIRIQ KARTASI + 3-QADAM (s12 uy-vazifa, jonli to'ladi) === */
        /* «imzolangan brief-hujjat» hissi — chap-accent hoshiya + indigo soya */
        .pmtask { background: ${T.paper}; border-radius: 16px; padding: 0; overflow: hidden; box-shadow: 0 12px 30px -12px rgba(91,61,230,0.28); border: 1.5px solid ${T.line}; border-left: 5px solid ${T.accent}; }
        .pmtask-head { display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; background: ${T.accentSoft}; }
        .pmtask-tag { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.04em; color: ${T.accent}; }
        .pmtask-id { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; color: ${T.accent}; background: ${T.paper}; border-radius: 99px; padding: 3px 10px; }
        .pmtask-rows { display: flex; flex-direction: column; }
        .pmtask-row { display: flex; gap: 12px; padding: 11px 16px; align-items: baseline; }
        .pmtask-row + .pmtask-row { border-top: 1px solid ${T.line}; }
        .pmtask-k { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink3}; flex: 0 0 clamp(84px,14vw,110px); }
        .pmtask-v { font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; flex: 1; line-height: 1.4; }
        /* tanlov o'zgarganda «Kim uchun» qiymati yumshoq yangilanadi (opacity-only, silkinishsiz) */
        .pmtask-val { display: inline-block; animation: pmval-fade 0.24s ease both; }
        @keyframes pmval-fade { 0% { opacity: 0.25; } 100% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .pmtask-val { animation: none; } }
        .pmsteps { background: ${T.bg}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 10px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .pmsteps-ol { margin: 0; padding-left: 0; list-style: none; counter-reset: pms; display: flex; flex-direction: column; gap: 9px; }
        .pmsteps-ol li { counter-increment: pms; position: relative; padding-left: 38px; font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; line-height: 1.45; min-height: 26px; display: flex; align-items: center; }
        /* «3 qadam» raqam-doirachalari — to'la doira, indigo, oq halqa bilan */
        .pmsteps-ol li::before { content: counter(pms); position: absolute; left: 0; top: 0; width: 26px; height: 26px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 12px -5px rgba(91,61,230,0.5), 0 0 0 3px ${T.accentSoft}; }

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }

        /* === 🛠️ JONLI PRAKTIKA (self-report) === */
        .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 13px; padding: 14px 20px; background: ${T.ink}; color: ${T.bg}; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.34); transition: all 0.18s; margin-top: 2px; }
        .lp-done-btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.5); }
        .lp-done-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .lp-done-btn.is-done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; animation: lp-done-pop 0.44s cubic-bezier(.3,1.35,.5,1); }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }

        /* === 🏅 ACHIEVEMENTS — hisoblagich + bayram === */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(91,61,230,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(91,61,230,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(91,61,230,0); } }
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

        /* === Konfetti === */
        .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
        .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.3); }
        @keyframes confetti-fall { 0% { transform: translateY(-24px) rotate(0deg); opacity: 0; } 8% { opacity: 1; } 55% { transform: translateY(48vh) translateX(22px) rotate(320deg); } 100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }

        /* === 🏆 PODIUM === */
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
        .pod-dot.bad { background: ${T.err}; }
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pod-row-time { min-width: 46px; text-align: right; font-size: 11.5px; color: ${T.ink3}; }

        /* === ⚡ CODE STRIKE — CTA neon-kapsula (arena STRUKTURASI ⚡ Jonliniki) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        /* Yakun-ekran CTA ixcham: so'z kattaligi o'zgarmaydi, faqat kapsula bo'sh joyi qisqaradi
           («Mentorni kuting»dan keyin joy qolib qalin ko'rinmasin — image copy.png etaloni) */
        .cs-cta .cs-cap { padding: clamp(14px,2vw,24px) clamp(22px,3.2vw,40px); gap: clamp(4px,0.7vw,8px); }
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

        /* === Kahoot-kutish holatlari === */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }

        /* === MENTOR STATISTIKASI === */
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
        .mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.err}; background: ${T.errSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.errSoft}; border-left: 4px solid ${T.err}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); border-left: 4px solid #E8A13A; }
        .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
        .mstats-verdict.few { background: rgba(167,166,162,0.12); border-left: 4px solid ${T.ink3}; }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(91,61,230,0.55); }
        .rc-open.soft { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); }
        .rc-open-mini { align-self: flex-start; margin-top: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
        .rc-open-mini:hover { transform: translateY(-1px); }

        /* === 📖 QAYTA TUSHUNTIRISH (recap overlay) === */
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
        @media (max-width: 640px) { .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; } .rc-dots { width: 100%; order: -1; } .rc-btn { font-size: 13px; padding: 11px 16px; } }

        /* ===== ⚡ ARENA ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
        .qz-arena::before { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(190,150,255,0.08) 1.1px, transparent 1.2px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; color: rgba(203,173,255,0.16); }
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
        .qz-tile:hover:not(:disabled):not(.rv) { transform: translateY(-3px); }
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
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

        @media (prefers-reduced-motion: reduce) {
          .lp-done-btn.is-done, .hook-cup { animation: none !important; }
        }
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title="Pitch darsi" />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />
            </>
          )}
        </div>
      </LiveGateCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>
  );
}







