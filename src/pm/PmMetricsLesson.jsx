import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM MODULI (8-MODUL) · 1-DARS — METRIKA NIMA: DAU, RETENTION, NORTH STAR
// Senariy-manba: pm-senariylar/M8-D1-Metrika.md (GATE S tasdiqlangan).
// Mavzu: metrika (mahsulot pulsi); DAU/MAU; retention (qaytish); churn (ketish);
//        North Star (bosh yulduz-ko'rsatkich); K5 Duolingo streak keysi (RAQAMSIZ).
// Artefakt: o'quvchi sinfda North Star nomzodi + 3 metrika-karta chiqaradi (uyda jonli raqam qo'shadi).
// INFRA/PRIMITIV MANBAI: P0 — src/pm/PmUserStoryLesson.jsx (liveRpc/useLiveSession/LiveGate/Stage/
//        NavNext/QuestionScreen/MentorTestStats/RecapOverlay/compiler-qobiq/ScreenPodium/arena/badges/
//        PRACTICE_BASE sentinel) — infra/rels AYNAN ko'chirilgan, kontent yangi (Metrika).
// AUDIOSIZ: ovoz (TTS) yo'q (useAudio stub, QuestionScreen imzosi saqlangan).
// PRIMITIVLAR: hook streak-alanga zanjiri (+ovoz HOOK_KEY'ga — keys-payoff shaxsiylashadi) ·
//        MAQSAD «boshqaruv paneli jonlanadi» (CountUp+sparkline+● JONLI) ·
//        oshxona-haftaligi interaktiv mini-sahna · 4 metrika SARALASH (msort: vaziyat→ustun, s2 flip'idan farqli) ·
//        K5 keys mikro-bashorat stavkalari (K5_BETS, unscored) · North Star validator ·
//        metrika-panel ustaxona (wsx-chiplar, karta-progress) · 📟 MINI-PULT strip (MiniPult — panel-holati
//        amaliyot/ustaxona/koding/recap/uy-vazifa ekranlarida o'sib boradi) · MatchPairs (boyitilgan vizual) ·
//        KODING = MetrikaPanel HISOB-KOMPONENT
//        VS Code-topshirig'i + 🧮 jonli retention-hisob vidjeti (26-qonun; JTBD props-kartadan farqli).
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
const LESSON_META = { lessonId: 'pm-m8d1-v1', lessonTitle: { uz: 'Metrika nima: DAU, retention, North Star', ru: 'Metriki' } };
// EKRAN-TARTIB: testlar teoriyaga biriktirib tarqatildi (s7 qoida'dan keyin idx4 · s8 K5'dan keyin idx6 · s9 ustaxonadan keyin idx9).
const SCREEN_META = [
  { id: 's0',       type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },        // 0 · Duolingo streak ovoz
  { id: 's1',       type: 'rule',        template: 'custom',   scored: false, scope: null },          // 1 · maqsad (North Star + 3 karta)
  { id: 's2',       type: 'exploration', template: 'custom',   scored: false, scope: null },          // 2 · savol + oshxona misoli
  { id: 's3',       type: 'exploration', template: 'custom',   scored: false, scope: null },          // 3 · 4 metrika flip-karta
  { id: 's7',       type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' }, // 4 · TEST-1 (DAU · MCQ)
  { id: 's4',       type: 'case',        template: 'custom',   scored: false, scope: null },          // 5 · K5 Duolingo streak keys
  { id: 's8',       type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' }, // 6 · TEST-2 (streak→retention · MCQ)
  { id: 's5',       type: 'exploration', template: 'custom',   scored: false, scope: null },          // 7 · o'z North Star nomzodi
  { id: 'practice', type: 'practice',    template: 'custom',   scored: false, scope: null },          // 8 · metrika-panel ustaxona (3 karta)
  { id: 's9',       type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' }, // 9 · TEST-3 (juftlash · MatchPairs)
  { id: 's10',      type: 'koding',      template: 'custom',   scored: false, scope: null },          // 10 · koding (retentionFoiz compiler)
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

// Scored ekranlar (s7/s8 = MCQ · s9 = MatchPairs) javob kaliti — darslik-jonli TASDIQLAYDI.
// correctIdx = haqiqiy to'g'ri variant indeksi (placeCorrect USLUBI YO'Q). s9: 0 = juftlash mukammal.
// T1/T2 correct'lari ATAYIN har xil indeksda (s7=0 · s8=2).
const INLINE_KEYS = { s7: 0, s8: 2, s9: 0, practice: -1 };
// Har scored ekran uchun qayta-tushuntirish (recap) — Metodist sayqallaydi. Kalitlar = YANGI scored ekran indeksi (4/6/9).
const RECAPS = {
  4: {
    title: "DAU — kunlik faol foydalanuvchi",
    cards: [
      { ic: "📅", h: "DAU nimani sanaydi", body: <>DAU (Daily Active Users) — bir kunda mahsulotga <b>kirgan faol odamlar soni</b>. Odam har kuni kirsa, avvalo shu raqam o'sadi.</> },
      { ic: "📊", h: "DAU va MAU farqi", body: <>MAU — <b>oylik</b> faol foydalanuvchi. DAU/MAU nisbati «odamlar qanchalik tez-tez qaytadi»ni ko'rsatadi.</> },
      { ic: "🔀", h: "Churn — aksincha", body: <>Churn (ketish) esa kamayadi: odamlar qaytib kirsa, ketganlar ulushi tushadi — DAU bilan chalkashtirmang.</>, ask: "Ilovaga har kuni odam kirsa — DAU o'sadimi yoki churn?" },
    ]
  },
  6: {
    title: "Streak retention'ni ko'taradi",
    cards: [
      { ic: "🔥", h: "Streak = qaytish mexanikasi", body: <>Duolingo streak — uzluksiz kunlar zanjiri. Zanjir uzilishidan qo'rquv odamni <b>qayta-qayta qaytaradi</b>. O'yinlardagi kunlik bonus ham shu usul.</> },
      { ic: "↩️", h: "Retention nimani o'lchaydi", body: <>Retention — kirganlarning <b>qaytish ulushi</b>. Streak birinchi navbatda aynan shu metrikani ko'taradi.</> },
      { ic: "🚫", h: "Yangi oqim emas", body: <>Streak <b>yangi foydalanuvchilar oqimini</b> yoki server tezligini o'zgartirmaydi — u faqat mavjudlarni qaytaradi.</>, ask: "Streak qaysi metrikaga eng kuchli ta'sir qiladi?" },
    ]
  },
  9: {
    title: "Har metrika — o'z savoliga javob",
    cards: [
      { ic: "📅", h: "DAU → kelish", body: <>DAU savoli: <b>«Bugun nechta odam kirdi?»</b> — mahsulotga kelishni sanaydi.</> },
      { ic: "↩️", h: "retention → qaytish · churn → ketish", body: <>Retention: <b>«kelganlarning qanchasi qaytdi?»</b>. Churn: <b>«qanchasi butunlay ketdi?»</b> — ikkisi bir tanganing ikki tomoni.</> },
      { ic: "⭐", h: "North Star → qiymat", body: <>North Star savoli: <b>«mahsulot haqiqiy qiymat beryaptimi?»</b> — bosh yulduz-ko'rsatkich.</>, ask: "«Kelganlarning qanchasi qaytdi?» — bu qaysi metrika?" },
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
// Ikki rejim: MCQ (renderMode yo'q) — variant tanlash · hotspot (renderMode='hotspot') — buzuq bo'lakni bosish.
const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, renderMode, storedAnswer, onAnswer, onNext, onPrev }) => {
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
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? 'Davom etish' : 'Avval natijani oching') : solved ? 'Davom etish' : (isHotspot ? (oneShot ? 'Buzuq bo\'lakni bosing' : "Buzuq bo'lakni toping") : 'Variantni tanlang')} onClick={onNext} /></>}>
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
              ? <>✓ {isHotspot ? 'Buzuq bo\'lak' : 'To\'g\'ri javob'}: {fmtCode(options[correctIdx])}</>
              : waiting
                ? '📨 Javobingiz qabul qilindi'
                : wrongLocked
                  ? <>{isHotspot ? 'Buzuq bo\'lak' : 'To\'g\'ri javob'}: {fmtCode(options[correctIdx])}</>
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

// ===== SHARED METRIKA STORAGE — s5 (North Star nomzodi) va ustaxona (panel) BITTA kalitni ishlatadi =====
// s5'dagi North Star ustaxonaga ko'chib keladi; ustaxona 3 metrika-karta qo'shadi (artefakt).
const METRICS_KEY = 'pm-m8d1-metrics';
// MiniPult jonli yangilansin deb yozuvda mahalliy event otiladi (storage-event faqat boshqa tabda ishlaydi)
const METRICS_EVT = 'pm-m8d1-metrics-evt';
const readMetrics = () => { try { const o = JSON.parse(localStorage.getItem(METRICS_KEY) || 'null'); return (o && typeof o === 'object') ? o : null; } catch { return null; } };
const writeMetrics = (o) => { try { localStorage.setItem(METRICS_KEY, JSON.stringify(o)); if (typeof window !== 'undefined') window.dispatchEvent(new Event(METRICS_EVT)); } catch {} };

// ===== PM PRIMITIV: North Star validatori — javobda «raqam» va «chunki…qiymat» bo'laklari bormi =====
// number: matnda raqam yoki o'lchov-so'z bor · reason: «chunki»/«qiymat» bog'lovchisi bor.
const validateNorthStar = (text) => {
  const t = (text || '').trim();
  const hasNumber = /\d/.test(t) || /(soni|ulush|foiz|nechta|raqam|daqiqa|marta|kun)/i.test(t);
  const hasReason = /(chunki|qiymat|foyda|ko'rsat|olayotgan|beradi)/i.test(t) && t.length >= 14;
  return { hasNumber, hasReason, full: hasNumber && hasReason };
};
// ===== PM PRIMITIV: metrika-karta validatori (NOMI + NIMANI o'lchaydi + NEGA muhim) =====
const validateMetricCard = (c) => {
  const has = (s) => (s || '').trim().length >= 2;
  return { nomOk: has(c.nom), whatOk: has(c.what), whyOk: has(c.why), askOk: !!c.ask, full: has(c.nom) && has(c.what) && has(c.why) && !!c.ask };
};
const StoryCheck = ({ ok, label }) => (
  <span className={`stcheck ${ok ? 'on' : ''}`}><span className="stcheck-box">{ok ? '✓' : ''}</span>{label}</span>
);

// ===== 📟 PULT-CHIROQLAR — panel-holati BITTA manbadan (METRICS_KEY): NS + 3 karta =====
// MiniPult strip, recap o'z-tekshiruv kartasi va solo-podium shu ro'yxatni o'qiydi.
const pultLamps = () => {
  const m = readMetrics();
  const cards = (m && m.cards) || [];
  return [
    { lbl: '⭐ North Star', on: validateNorthStar((m && m.northStar) || '').full },
    ...[0, 1, 2].map(i => {
      const c = cards[i];
      return { lbl: c && (c.nom || '').trim() ? c.nom : `${i + 1}-karta`, on: c ? validateMetricCard(c).full : false };
    })
  ];
};
// Panel-stripi bo'sh 0/4 holatda chalg'itmasin: o'quvchi BIRINCHI yozuvini kiritgachgina ko'rinadi.
const pultHasData = () => {
  const m = readMetrics();
  if (!m) return false;
  if ((m.northStar || '').trim()) return true;
  return (m.cards || []).some(c => c && ['nom', 'what', 'why', 'ask', 'hyp'].some(k => ((c[k] || '') + '').trim()));
};

// ===== 🎯 TOPSHIRIQ-PANEL (TaskSpec) — o'quvchi yozadigan HAR ekranning yagona shart-tili (P0'dan AYNAN) =====
// UX-qonun (32): shartlar PROZAGA yozilmaydi — shu panelda chip bo'lib turadi. Chip = raqam + ≤4 so'z;
// bajarilganda yashil ✓ + pop. Batafsil matn chip ostida, DEFAULT YOPIQ (matn-diyeta).
// Ball-mantiqqa aloqasi yo'q — faqat ko'rinish qatlami.
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

// ===== 📟 MINI-PULT STRIP — «jonli pult» metaforasining jismoniy davomi (s1 panel-demo uslubdoshi) =====
// Amaliyot/ustaxona/koding/recap/uy-vazifa ekranlarida ko'rinadi (test/arena/podiumda YO'Q).
// Faqat ko'rinish qatlami: METRICS_KEY'dan o'qiydi, ball-mantiqqa aloqasi yo'q. Bosilsa ochiladi/yig'iladi.
function MiniPult() {
  const [lamps, setLamps] = useState(() => pultLamps());
  const [hasData, setHasData] = useState(() => pultHasData());
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const upd = () => { setLamps(pultLamps()); setHasData(pultHasData()); };
    window.addEventListener(METRICS_EVT, upd);
    window.addEventListener('storage', upd);
    return () => { window.removeEventListener(METRICS_EVT, upd); window.removeEventListener('storage', upd); };
  }, []);
  const litN = lamps.filter(l => l.on).length;
  if (!hasData) return null; // birinchi yozuvgacha bo'sh strip ko'rsatilmaydi
  return (
    <div className="mpult">
      {open && (
        <div className="mpult-body fade-step">
          <span className="mpult-ttl">📟 Mening panelim</span>
          {lamps.map((l, i) => (
            <div key={i} className={`plamp ${l.on ? 'on' : ''}`}>
              <i className="plamp-dot" aria-hidden="true" />
              <span className="plamp-lbl">{l.lbl}</span>
              <span className="plamp-st mono">{l.on ? '● JONLI' : '···'}</span>
            </div>
          ))}
          <span className={`mpult-hint ${litN === 4 ? 'ok' : ''}`}>
            {litN === 4 ? '✓ Panel to\'liq jonli!' : litN === 0 ? 'North Star yozilsa 1-chiroq yonadi' : 'Ustaxonada karta to\'lsa chiroq yonadi'}
          </span>
        </div>
      )}
      <button type="button" className="mpult-head" onClick={() => setOpen(o => !o)} aria-expanded={open} title="Mening panelim — chiroqlar holati">
        <span className="mpult-ic" aria-hidden="true">📟</span>
        <span className="mpult-dots" aria-hidden="true">{lamps.map((l, i) => <i key={i} className={`plamp-dot sm ${l.on ? 'on' : ''}`} />)}</span>
        <span className="mpult-cnt mono">{litN}/4</span>
      </button>
    </div>
  );
}

// ===== SCREEN 0 — HOOK: Duolingo streak ovoz berish (jonli natija — o'sib boradigan alanga zanjiri) =====
const HOOK_OPTS = [
  "Yangi so'zlar qiziqarli",
  "STREAK (kunlar zanjiri) uzilib qolishidan qo'rqish",
  "Eslatma-bildirishnomalar",
  "Do'stlar bilan musobaqa",
];
// Hook-ovoz lesson-scoped saqlanadi — K5 keys yakunida shaxsiy payoff («Siz "X" degandingiz…»).
const HOOK_KEY = 'pm-m8d1-hookvote';
const HOOK_SHORT = ["yangi so'zlar qiziq", "streak-qo'rquv", "eslatmalar", "do'stlar bilan musobaqa"];
const readHookVote = () => { try { const v = localStorage.getItem(HOOK_KEY); return v == null || v === '' ? null : Number(v); } catch { return null; } };
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
    try { localStorage.setItem(HOOK_KEY, String(i)); } catch {} // keys-payoff uchun (Screen4 oxiri)
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: i, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const isMentor = live && live.mode === 'mentor';
  const shown = counts || (picked !== null ? HOOK_OPTS.map((_, i) => (i === picked ? 1 : 0)) : null);
  const totalVotes = shown ? shown.reduce((a, b) => a + b, 0) : 0;
  const revealViz = shown && (picked !== null || isMentor);
  const topIdx = revealViz ? shown.indexOf(Math.max(...shown)) : -1;
  return (
    <Stage eyebrow="Kirish · Duolingo so'rovi" screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked !== null || isMentor ? 'Davom etish' : 'Avval ovoz bering'} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="hook-hero fade-up"><span className="hook-cup">🦉</span></div>
        <div className="head"><h2 className="title h-title fade-up" style={{ textAlign: 'center' }}>Duolingo'ni <span className="italic" style={{ color: T.accent }}>ertasiga yana</span> ochishga nima majbur qiladi?</h2></div>
        <Mentor>Duolingo'da minglab odam charchagan kuni ham <b style={{ color: T.ink }}>ertasiga yana kirib</b> dars qiladi — sizningcha, ularni <b style={{ color: T.ink }}>nima majbur qiladi</b>? Ovoz bering — sababini birozdan keyin birga bilib olamiz.</Mentor>
        <MentorNote>O'quvchilar ovoz berib belgilashadi — siz faqat kuzatasiz. Javobni AYTMANG: «birozdan keyin birga bilib olamiz» deb qiziqishni saqlang. 2 daqiqadan oshirmang.</MentorNote>
        <div className="hook-menu fade-up delay-1">
          {HOOK_OPTS.map((o, i) => {
            const on = picked === i;
            const locked = picked !== null || isMentor;
            return (
              <button key={i} className={`hook-mc ${on ? 'on' : ''} ${!locked ? 'taphint' : ''}`} disabled={locked} onClick={() => pick(i)}>
                <span className="hook-mc-abc">{String.fromCharCode(65 + i)}</span>
                <span className="hook-mc-txt">{o}</span>
                <span className="hook-mc-cup" aria-hidden="true">🔥</span>
              </button>
            );
          })}
        </div>
        {revealViz && (
          <div className="streak-shelf fade-step" aria-label="Ovoz natijalari — streak-alanga zanjirlari">
            <div className="streak-rows">
              {HOOK_OPTS.map((o, i) => {
                const n = shown[i];
                const pct = totalVotes ? Math.round((n / totalVotes) * 100) : 0;
                const flames = Math.max(totalVotes ? 1 : 0, Math.round(pct / 10)); // 0..10 alanga
                return (
                  <div key={i} className={`streak-row ${picked === i ? 'mine' : ''} ${i === topIdx && totalVotes > 0 ? 'top' : ''}`}>
                    <span className="streak-abc">{String.fromCharCode(65 + i)}</span>
                    <div className="streak-chain" aria-hidden="true">
                      {Array.from({ length: 10 }).map((_, k) => (
                        <span key={k} className={`streak-cell ${k < flames ? 'lit' : ''}`} style={{ transitionDelay: `${k * 40}ms` }}>🔥</span>
                      ))}
                    </div>
                    <span className="streak-pct">{i === topIdx && totalVotes > 0 && <span className="streak-crown" aria-hidden="true">👑</span>}{pct}%</span>
                  </div>
                );
              })}
            </div>
            <p className="streak-cap">{isMentor ? "Sinf ovozi — zanjir uzun bo'lgani sari sabab aniqlashadi. To'g'ri javobni hali ochmang." : "Ovozingiz qabul qilindi. Haqiqiy sababni birozdan keyin ochamiz: bu RETENTION (ertasiga yana kirish) mexanikasi bilan bog'liq. 😉"}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== METRICS IMZO-PRIMITIV: CountUp — raqam 0'dan sanab «jonlanadi» (reduced-motion: darhol yakuniy) =====
const prefersReduced = () => (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
function CountUp({ to, dur = 1100, delay = 0, suffix = '' }) {
  const [val, setVal] = useState(() => (prefersReduced() ? to : 0));
  useEffect(() => {
    if (prefersReduced()) { setVal(to); return; }
    let raf = 0;
    const t0 = performance.now() + delay;
    const step = (tm) => {
      const p = Math.min(1, Math.max(0, (tm - t0) / dur));
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, dur, delay]);
  return <>{val}{suffix}</>;
}

// ===== SCREEN 1 — MAQSAD: «BOSHQARUV PANELI JONLANADI» imzo-sahnasi (Metrics identiteti, 23-qonun) =====
// WOW: 3 metrika-karta priborlar paneliday ketma-ket «yonadi» — raqam 0'dan sanab o'sadi (CountUp),
// mini-sparkline chizig'i chiziladi (SVG stroke-dashoffset), karta to'lgach yashil «● JONLI» puls yonadi.
const DEMO_METRICS = [
  { ic: '📅', name: 'DAU', what: 'kunlik kirganlar', num: 128, suffix: '', pts: '0,26 14,22 28,24 42,16 56,18 70,10 84,12 98,4' },
  { ic: '↩️', name: 'Retention', what: 'yana kelganlar ulushi', num: 42, suffix: '%', pts: '0,24 14,25 28,20 42,21 56,15 70,16 84,10 98,7' },
  { ic: '⭐', name: 'North Star', what: 'haftada 3+ qaytganlar', num: 57, suffix: '', pts: '0,27 14,24 28,25 42,19 56,13 70,14 84,8 98,5' },
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow="Maqsad" screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label="Boshlaymiz →" onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">Loyihangiz «pulsi»ni bitta <span className="italic" style={{ color: T.accent }}>jonli panelda</span> ko'rsangiz-chi?</h2></div>
      <Mentor>Dars oxirida sizda <b style={{ color: T.ink }}>boshqaruv paneli</b> bo'ladi: <b style={{ color: T.ink }}>North Star</b> (bosh yulduz-ko'rsatkich) va 3 metrika-karta — metrika bu mahsulot holatini ko'rsatadigan raqam. Qarang — namunaviy panel hozir jonlanadi.</Mentor>
      <div className="mdash-grid">
        {DEMO_METRICS.map((m, i) => (
          <div key={i} className="mdash-card" style={{ '--cd': `${0.15 + i * 0.85}s` }}>
            <div className="mdash-top">
              <span className="mdash-ic" aria-hidden="true">{m.ic}</span>
              <span className="mdash-nm">{m.name}</span>
              <span className="mlive" style={{ '--ld': `${1.6 + i * 0.85}s` }}>● JONLI</span>
            </div>
            <div className="mdash-num mono"><CountUp to={m.num} delay={(0.55 + i * 0.85) * 1000} suffix={m.suffix} /></div>
            <span className="mdash-what">{m.what}</span>
            <svg className="mdash-spark" viewBox="0 0 98 30" preserveAspectRatio="none" aria-hidden="true">
              <polyline className="mdash-line" points={m.pts} style={{ '--sd': `${0.55 + i * 0.85}s` }} />
            </svg>
          </div>
        ))}
      </div>
      <p className="mdash-cap">✨ Dars oxirida o'z panelingiz xuddi shunday jonlanadi.</p>
      <div className="takeaway fade-up delay-2"><span className="ta-bulb">🎯</span><p className="ta-h">Bu panel bugun to'ladi — keyingi darsda shu raqamlar asosida maqsad qo'yishni o'rganasiz.</p><p className="ta-sub">Tayyor natija = loyihangizning o'lchov tizimi</p></div>
    </div>
  </Stage>
);

// ===== SCREEN 2 — MUHOKAMA: savol + «OSHXONA HAFTALIGI» interaktiv mini-sahna (24-qonun: statik matn emas) =====
// Maktab oshxonasida yangi taom: 5 kun-katak — har birini bosganda o'sha kuni oshxonaga KELGANLAR
// va taomni YANA OLGANLAR soni ochiladi (CountUp + mini-ustuncha). Unscored, 5/5 → xulosa.
const OSHX_DAYS = [
  { d: 'Du', keldi: 100, qaytdi: 100 },
  { d: 'Se', keldi: 98, qaytdi: 55 },
  { d: 'Cho', keldi: 97, qaytdi: 40 },
  { d: 'Pa', keldi: 99, qaytdi: 34 },
  { d: 'Ju', keldi: 98, qaytdi: 31 },
];
const Screen2 = ({ screen, onNext, onPrev }) => {
  const [opened, setOpened] = useState(() => OSHX_DAYS.map(() => false));
  const openedN = opened.filter(Boolean).length;
  const allOpen = openedN === OSHX_DAYS.length;
  const openDay = (i) => setOpened(prev => (prev[i] ? prev : prev.map((v, k) => (k === i ? true : v))));
  return (
    <Stage eyebrow="Muhokama · savol" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label="Davom etish" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="proj-q fade-up">
          <span className="proj-q-lbl">🗣️ Sinfga savol</span>
          <p className="proj-q-body">Oshxonada <b>yangi taom</b> chiqdi — birinchi kuni HAMMA oldi. Demak, taom zo'rmi? <b>Qayerdan bilamiz?</b></p>
        </div>
        <Mentor>Birinchi kun — bu shunchaki <b style={{ color: T.ink }}>kelish</b> (qiziqish). Besh kun-katakni bosib oching: keyingi kunlari <b style={{ color: T.ink }}>necha kishi YANA oldi</b>?</Mentor>
        <div className="oshx fade-up delay-1">
          <div className="oshx-week">
            {OSHX_DAYS.map((d, i) => {
              const on = opened[i];
              return (
                <button key={d.d} className={`oshx-day ${on ? 'open' : 'taphint'}`} onClick={() => openDay(i)} disabled={on} aria-label={`${d.d} kuni`}>
                  <span className="oshx-inner">
                    <span className="oshx-face oshx-front"><span className="oshx-d">{d.d}</span><span className="oshx-plate" aria-hidden="true">🍽️</span><span className="oshx-q" aria-hidden="true">?</span></span>
                    <span className="oshx-face oshx-back">
                      <span className="oshx-d back">{d.d}</span>
                      <span className="oshx-n keldi">🍽️ {on ? <CountUp to={d.keldi} dur={600} /> : 0}</span>
                      <i className="oshx-bar keldi" style={{ '--w': '100%' }} />
                      <span className="oshx-n qayt">↩️ {on ? <CountUp to={d.qaytdi} dur={700} delay={150} /> : 0}</span>
                      <i className="oshx-bar qayt" style={{ '--w': `${d.qaytdi}%` }} />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="oshx-cap">{allOpen ? '✓ 5/5 — har kuni kelish o\'zgarmadi, YANA OLGANLAR kamayib ketdi' : `Kun-kataklarni bosing (${openedN}/5) · 🍽️ oshxonaga keldi · ↩️ taomni yana oldi`}</p>
        </div>
        {allOpen && <div className="done-mini fade-step">✅ Sirni ochdingiz! <span className="dm-sub">Haqiqiy baho — ertasiga YANA olganlar</span></div>}
        <MentorNote>Qoidani SAVOLDAN OLDIN aytmang — o'quvchi «kelish emas, qaytish» g'oyasiga kataklarni ochib o'zi kelsin.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — QOIDA-EKRAN: SARALASH — 4 mini-vaziyatni 4 metrika-ustunga joylash =====
// s2'da flip bo'ldi — bu yerda YANA flip emas (takror-mexanika sindirildi): o'quvchi vaziyat-kartani
// tanlab mos ustunga biriktiradi; to'g'ri tushsa snap-pop yashil + o'sha metrika TA'RIFI ochiladi.
// KONTENT (4 metrika ta'rifi) saqlangan; unscored — hammasi joylashgach onAnswer(screen, { correct: true }).
// Rang-semantika: DAU=ko'k · Retention=indigo · Churn=amber · North Star=oltin (yashil FAQAT muvaffaqiyat).
const METRIC_DEFS = [
  { key: 'dau',  ic: '📅', name: 'DAU / MAU',  short: 'kunlik / oylik faol', def: <>Bir kun (yoki oy) ichida mahsulotga <b>kirgan faol odamlar soni</b>. «Bugun nechta odam kirdi?» degan savolga javob beradi.</> },
  { key: 'ret',  ic: '↩️', name: 'Retention', short: 'yana kelish ulushi', def: <>Kirganlardan <b>necha kishi keyin YANA kiradi</b>. O'yinlardagi «har kuni kirsang — bonus» ham aynan shu qaytish-mexanikasi.</> },
  { key: 'churn',ic: '📉', name: 'Churn',      short: 'ketish ulushi', def: <>Retention'ning aksi: <b>necha kishi butunlay ketib qoldi</b>. Churn o'ssa — odamlar mahsulotni tashlab ketmoqda degani.</> },
  { key: 'ns',   ic: '⭐', name: 'North Star', short: 'bosh yulduz-ko\'rsatkich', def: <>Mahsulotingiz <b>haqiqiy qiymat berayotganini</b> eng yaxshi ko'rsatadigan YAGONA bosh raqam. Butun jamoa shunga qaraydi.</> },
];
// Vaziyat-kartalar — id = mos metrika-ustun kaliti. Tartib ustunlardan farqli (aralashtirilgan, barqaror).
const MSORT_ITEMS = [
  { id: 'ret',   ic: '↩️', txt: 'Kelganlarning 42% qaytdi' },
  { id: 'ns',    ic: '⭐', txt: 'Eng muhim raqam: dars tugatganlar' },
  { id: 'dau',   ic: '📅', txt: 'Bugun 128 kishi kirdi' },
  { id: 'churn', ic: '📉', txt: '10 kishi ilovani butunlay tashladi' },
];
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [st, setSt] = useState(() => ({ placed: storedAnswer ? METRIC_DEFS.map(m => m.key) : [], sel: null, miss: null }));
  const { placed, sel, miss } = st;
  const doneN = placed.length;
  const done = doneN >= METRIC_DEFS.length;
  const pool = MSORT_ITEMS.filter(it => !placed.includes(it.id));
  const missTimer = useRef(null);
  useEffect(() => () => clearTimeout(missTimer.current), []);
  const tapCol = (key) => {
    if (!sel || placed.includes(key)) return;
    if (sel === key) {
      const nx = [...placed, key];
      setSt({ placed: nx, sel: null, miss: null });
      if (nx.length === METRIC_DEFS.length && storedAnswer === undefined) onAnswer(screen, { correct: true });
    } else {
      // haqiqiy xato — qisqa qizil silkinish, karta havzaga qaytadi
      setSt(prev => ({ ...prev, miss: key }));
      clearTimeout(missTimer.current);
      missTimer.current = setTimeout(() => setSt(prev => ({ ...prev, miss: null })), 600);
    }
  };
  return (
    <Stage eyebrow="Qoida" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? 'Davom etish' : `4 kartani joylang (${doneN}/4)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Loyihangiz yaxshi ishlayaptimi — buni qaysi <span className="italic" style={{ color: T.accent }}>raqam</span> ko'rsatadi?</h2></div>
        <Mentor>Metrika — mahsulotning holatini ko'rsatadigan <b style={{ color: T.ink }}>raqam</b>. To'rt vaziyat-kartani tanlab, mos metrika-ustunga joylang — to'g'ri tushsa ta'rifi ochiladi.</Mentor>
        <div className="msort fade-up delay-1">
          <div className="msort-pool">
            {pool.map(it => (
              <button key={it.id} type="button" className={`msort-card ${sel === it.id ? 'sel' : ''}`}
                onClick={() => setSt(prev => ({ ...prev, sel: prev.sel === it.id ? null : it.id }))}>
                <span className="msort-card-ic" aria-hidden="true">{it.ic}</span>{it.txt}
              </button>
            ))}
            {pool.length === 0 && <span className="msort-pool-done">✓ 4/4 — har raqam o'z metrikasida</span>}
          </div>
          <div className="msort-hint small mono">{done ? '' : sel ? '👉 endi mos ustunni bosing' : 'vaziyat-kartani tanlang'}</div>
          <div className="msort-cols">
            {METRIC_DEFS.map(m => {
              const isOn = placed.includes(m.key);
              const item = MSORT_ITEMS.find(it => it.id === m.key);
              return (
                <div key={m.key} role="button" tabIndex={isOn ? -1 : 0}
                  className={`msort-col ${m.key} ${isOn ? 'on' : ''} ${sel && !isOn ? 'droppable' : ''} ${miss === m.key ? 'miss' : ''}`}
                  onClick={() => tapCol(m.key)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tapCol(m.key); } }}>
                  <div className="msort-col-h">
                    <span className="msort-ic" aria-hidden="true">{m.ic}</span>
                    <span className="msort-nm">{m.name}</span>
                    <span className="msort-short">{m.short}</span>
                  </div>
                  {isOn
                    ? <span className="msort-chipin"><span aria-hidden="true">{item.ic}</span> {item.txt} <b>✓</b></span>
                    : <span className="msort-slot">bu yerga</span>}
                  {isOn && <p className="msort-def fade-step">{m.def}</p>}
                </div>
              );
            })}
          </div>
        </div>
        {done && <div className="done-mini fade-step">✅ 4/4 joylandi <span className="dm-sub">— kelish (DAU) ≠ qaytish (retention), bugungi darsning bosh g'oyasi shu</span></div>}
        <MentorNote>Duolingo keysi keyingi ekranda keladi. «North Star» so'zini birinchi aytganda ochib bering: butun jamoa qaraydigan bitta bosh raqam. Xato joylangan karta havzaga qaytadi — jazo yo'q.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — KEYS K5: Duolingo streak mexanikasi bosqichma-bosqich (RAQAMSIZ) =====
const K5_SLIDES = [
  { ic: "🦉", h: "Duolingo — har kuni qaytish", body: <>Duolingo'ning bosh muammosi: odamlar ilovani yuklab, keyin <b>tashlab ketmasin</b>. Til o'rganish — uzoq safar, har kun kerak.</> },
  { ic: "🔥", h: "Streak nima", body: <>Streak — <b>uzluksiz kunlar zanjiri</b>: har kuni dars qilsangiz, zanjir uzunlashadi. Bir kun o'tkazib yuborsangiz — zanjir uziladi.</> },
  { ic: "😰", h: "Qo'rquv + odat", body: <>Uzun zanjirni <b>yo'qotishdan qo'rquv</b> odamni charchagan kunda ham qaytaradi. Asta-sekin bu <b>odatga</b> aylanadi.</> },
  { ic: "🧊", h: "Muzlatish va eslatmalar", body: <>Atrofida yordamchi mexanika: zanjirni <b>«muzlatish»</b> (bir kun o'tkazib yuborsangiz saqlanadi) va kunlik <b>eslatmalar</b>.</> },
  { ic: "↩️", h: "Xulosa: retention", body: <>Streak — tasodifiy bezak emas, atayin o'ylab qilingan mahsulot-qarori. U <b>retention'ni (qaytishni) ko'taradi</b> va har kuni o'lchab boriladi.</> },
];
// 🎲 Mikro-bashorat stavkalari — 2 kalit-slayd OLDIDAN o'quvchi taxmin tikadi, slayd javobni ochadi.
// Unscored: ball yo'q, to'g'ri kelmasa NEYTRAL indigo (qizil EMAS). Tanlov localStorage'da (qaytib kirsa saqlanadi).
const K5_BETS_KEY = 'pm-m8d1-k5bets';
const K5_BETS = {
  2: { q: "Sizningcha, zanjir uzilay deganda odam nima qiladi?", opts: [{ ic: '😴', t: "Tashlab qo'yadi" }, { ic: '😰', t: 'Kirib dars qiladi' }, { ic: '🤷', t: 'Sezmaydi ham' }], ans: 1 },
  3: { q: "Bir kun o'tkazib yuborsangiz-chi — Duolingo nima qiladi?", opts: [{ ic: '🎁', t: "Sovg'a beradi" }, { ic: '😤', t: 'Zanjir noldan boshlanadi' }, { ic: '🧊', t: '«Muzlatish» saqlab qoladi' }], ans: 2 },
};
const readK5Bets = () => { try { const o = JSON.parse(localStorage.getItem(K5_BETS_KEY) || '{}'); return (o && typeof o === 'object') ? o : {}; } catch { return {}; } };
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [i, setI] = useState(0);
  const [bets, setBets] = useState(() => readK5Bets());
  // Hook-payoff shaxsiylashuvi: s0'dagi ovoz (HOOK_KEY) — yakuniy slaydda shaxsiy murojaat, bo'lmasa umumiy matn.
  const [hookVote] = useState(() => readHookVote());
  const last = i === K5_SLIDES.length - 1;
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last]); // eslint-disable-line
  const c = K5_SLIDES[i];
  const bet = K5_BETS[i];
  const betPending = !!bet && bets[i] == null && !isMentor;
  const placeBet = (k) => setBets(prev => {
    const nx = { ...prev, [i]: k };
    try { localStorage.setItem(K5_BETS_KEY, JSON.stringify(nx)); } catch {}
    return nx;
  });
  return (
    <Stage eyebrow="Keys 🔥" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={betPending} label={betPending ? '🎲 Avval taxminingizni tanlang' : last ? 'Davom etish' : `Keyingi bosqich (${i + 1}/${K5_SLIDES.length})`} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Duolingo sirini ochamiz: nima odamni <span className="italic" style={{ color: T.accent }}>har kuni</span> qaytaradi?</h2></div>
        {betPending ? (
          <div className="kbet fade-step" key={`bet${i}`}>
            <span className="k-slide-eyebrow">🎲 Bashorat · {i + 1}-bosqich oldidan</span>
            <h3 className="kbet-q">{bet.q}</h3>
            <div className="kbet-chips">
              {bet.opts.map((o, k) => (
                <button key={k} type="button" className="kbet-chip" onClick={() => placeBet(k)}>
                  <span className="kbet-ic" aria-hidden="true">{o.ic}</span>{o.t}
                </button>
              ))}
            </div>
            <span className="kbet-sub">Ball yo'q — bemalol taxmin qiling, javob keyingi slaydda ochiladi</span>
          </div>
        ) : (
          <div className="k-slide fade-step" key={i}>
            <span className="k-slide-eyebrow">📊 Keys · Duolingo · {i + 1} / {K5_SLIDES.length}</span>
            <div className="k-slide-ic">{c.ic}</div>
            <h3 className="k-slide-h">{c.h}</h3>
            <p className="k-slide-body">{c.body}</p>
            {bet && bets[i] != null && bet.opts[bets[i]] && (
              <div className={`kbet-res ${bets[i] === bet.ans ? 'win' : ''} fade-step`}>
                {bets[i] === bet.ans
                  ? <>✓ Topdingiz! «{bet.opts[bet.ans].t}»</>
                  : <>Sizning javobingiz: «{bet.opts[bets[i]].t}» — to'g'risi: «{bet.opts[bet.ans].t}»</>}
              </div>
            )}
          </div>
        )}
        <div className="k-dots">{K5_SLIDES.map((_, k) => <button key={k} className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}-bosqich`} />)}</div>
        {last && !betPending && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>
          {hookVote === 1 && <><b style={{ color: T.accent }}>Buni darsning boshidayoq sezgandingiz — «streak-qo'rquv» deb ovoz bergandingiz!</b>{' '}</>}
          {hookVote != null && hookVote !== 1 && HOOK_SHORT[hookVote] && <><b style={{ color: T.accent }}>Dars boshida siz «{HOOK_SHORT[hookVote]}» degandingiz — Duolingo'ning bosh siri esa streak ekan.</b>{' '}</>}
          Sizning MVP'ingizda (mahsulotingizning ilk sodda versiyasida) ham «odamni qaytaradigan» bitta mexanika bo'lishi mumkin. Uni topib, retention'ni o'lchab turasiz.</p></div>}
        <MentorNote>Bu keysda rasmiy raqam yo'q — foydalanuvchi soni yoki foizini o'zingizdan to'qimang. «Streak» so'zini birinchi aytganda ochib bering (kunlar zanjiri). Bashorat-bosqichda avval sinfdan taxmin so'rang — o'quvchilar ekranida taxmin-variantlari chiqadi.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5 — O'Z LOYIHASI: North Star nomzodi (28-qonun: narrow YO'Q, split-layout, ● JONLI holat-panel) =====
// BUG-TARIX (metrika.png, 2026-07-22): editor'da `fade-up` + `.nstar-editor.ok` animatsiyasi to'qnashib,
// `.ok` animation'ni override qilgach element opacity:0 da G'OYIB bo'lardi. Endi editor opacity-animatsiyaga
// bog'lanmagan — BARCHA holatlarda (bo'sh/yarim/to'liq/qayta kirganda) ko'rinadi.
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [text, setText] = useState(() => {
    const saved = readMetrics();
    return storedAnswer?.northStar ?? saved?.northStar ?? '';
  });
  const v = validateNorthStar(text);
  // FEEDBACK (4.png, 2026-07-22): mentor amaliyotni to'ldirmasa o'ta olmasdi + nima yetishmayotgani
  // tushunarsiz edi. Endi: mentor ozod (qoida ekranda yozilgan), tugma-yorliq QAYSI qadam qolganini aytadi.
  const gate5 = useContext(LiveGateCtx);
  const isMentor = !!(gate5 && gate5.live && gate5.live.mode === 'mentor');
  const save = (val) => {
    setText(val);
    onAnswer(screen, { northStar: val, correct: validateNorthStar(val).full });
    const prev = readMetrics() || {};
    writeMetrics({ ...prev, northStar: val });
  };
  return (
    <Stage eyebrow="Amaliyot · North Star'ingiz" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!v.full && !isMentor} label={v.full || isMentor ? 'Davom etish' : !v.hasNumber ? "① Avval o'lchanadigan raqamni yozing" : '② «chunki …» deb sababini qo\'shing'} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Loyihangizning bosh raqami — <span className="italic" style={{ color: T.accent }}>North Star</span> — qaysi bo'ladi?</h2></div>
        <Mentor>Shablon: <b style={{ color: T.ink }}>«Mening North Star'im — [raqam], chunki u [foydalanuvchi olayotgan qiymat]ni ko'rsatadi»</b>.</Mentor>
        <MentorWatchLine>Bu amaliyotni <b>o'quvchilar</b> bajaradi — siz kuzatasiz; «Davom etish» siz uchun ochiq.</MentorWatchLine>
        <TaskSpec items={[
          { done: v.hasNumber, label: "O'lchanadigan raqam", detail: "Soni / ulush / foiz — o'lchab bo'ladigan raqam yozing, masalan «haftada 3+ marta kirganlar soni»." },
          { done: v.hasReason, label: '«chunki …» sababi', detail: "«chunki u [foydalanuvchi olayotgan qiymat]ni ko'rsatadi» deb yakunlang — raqam nega muhimligi aytilsin." },
        ]} />
        <div className="split">
          <Col>
            <div className={`nstar-editor ${v.full ? 'ok' : ''}`}>
              <span className="nstar-lead">⭐ Mening North Star'im —</span>
              <textarea className="nstar-input" value={text} spellCheck={false} rows={4} onChange={e => save(e.target.value)} placeholder="masalan: haftada 3+ marta yana kirgan foydalanuvchilar soni, chunki u odam mahsulotdan real foyda olayotganini ko'rsatadi" />
            </div>
          </Col>
          <Col>
            <div className="mxlamps fade-up delay-1">
              <span className="card-lbl" style={{ color: T.accent }}>📟 Panel-holati</span>
              {[['num', "O'lchanadigan raqam (soni/ulush/foiz)", v.hasNumber], ['why', '«chunki … qiymat» sababi', v.hasReason]].map(([k, lbl, on]) => (
                <div key={k} className={`mxlamp ${on ? 'on' : ''}`}>
                  <span className="mxlamp-dot" aria-hidden="true" />
                  <span className="mxlamp-lbl">{lbl}</span>
                  <span className="mxlamp-st">{on ? 'yondi ✓' : 'kutilmoqda…'}</span>
                </div>
              ))}
              {v.full ? <span className="mlive big">● JONLI</span> : <span className="mxlamp-hint">Ikkala chiroq yonsa — panel jonlanadi</span>}
            </div>
            {v.full && <div className="done-mini fade-step">✅ Nomzod tayyor <span className="dm-sub">— ustaxonaga ko'chdi, u yerda 3 karta qo'shasiz</span></div>}
          </Col>
        </div>
        <MentorNote>«Hammasi DAU bo'lsin» tuzog'iga tushmasin: North Star — real qiymatni ko'rsatuvchi raqam, shunchaki kelish soni emas.</MentorNote>
        <MiniPult />
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

// ===== SCREEN 6 (practice) — METRIKA-PANEL USTAXONA: North Star + 3 metrika-karta + RO'YXAT + YULDUZCHA + YORDAM =====
// s5'dagi North Star METRICS_KEY orqali ko'chib keladi; o'quvchi 3 metrika-karta qo'shadi (NOMI→NIMANI→NEGA + savol turi).
const METRIC_ASKS = [
  { k: 'kelish', label: 'Kelish — «bugun nechta odam kirdi?»' },
  { k: 'qaytish', label: 'Qaytish — «necha kishi yana keldi?»' },
  { k: 'qiymat', label: 'Qiymat — «mahsulot real foyda beryaptimi?»' },
];
const emptyMetric = () => ({ nom: '', what: '', why: '', ask: '', hyp: '' });
const initMetricCards = (storedAnswer) => {
  if (storedAnswer?.cards) return storedAnswer.cards.slice(0, 3);
  const saved = readMetrics();
  const base = (saved?.cards || []).slice(0, 3).map(c => ({ ...emptyMetric(), ...c }));
  while (base.length < 3) base.push(emptyMetric());
  return base;
};
const ScreenMetricWorkshop = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [st, setSt] = useState(() => ({
    northStar: storedAnswer?.northStar ?? readMetrics()?.northStar ?? '',
    cards: initMetricCards(storedAnswer),
    done: !!(storedAnswer && storedAnswer.solved),
    helpOpen: false,
    starOpen: false,
  }));
  const { northStar, cards, done, helpOpen, starOpen } = st;
  // TOPSHIRIQ-PANEL — 3 band jonli validator (chip ≤4 so'z, batafsili chip ichida — 32-qonun)
  const nsOk = validateNorthStar(northStar).full;
  const asks = cards.map(c => c.ask).filter(Boolean);
  const threeAsks = new Set(asks).size >= 3;
  const allWhy = cards.every(c => validateMetricCard(c).full);
  const checks = [
    { ok: nsOk, label: 'North Star raqamli', detail: "North Star o'lchanadigan bo'lsin: raqam (soni/ulush/foiz) + «chunki … qiymatni ko'rsatadi» sababi." },
    { ok: threeAsks, label: '3 karta — 3 savol', detail: "Har kartada «Qaysi savolga javob?» tanlansin — uchala karta uch XIL savolga (kelish · qaytish · qiymat) javob bersin." },
    { ok: allWhy, label: 'Har kartada NEGA', detail: "Har kartada NOMI + NIMANI o'lchaydi + NEGA muhim to'lgan bo'lsin — «nega» real foydani aytadi." },
  ];
  const passed = checks.every(c => c.ok);
  // FEEDBACK (5.png, 2026-07-22): qaysi amaliyotni kim bajarishi yozilmagan edi + mentor ham majburan
  // to'ldirardi. Qoida endi bir xil va ekranda yozilgan: o'quvchi bajaradi, mentor kuzatadi va ozod o'tadi.
  const isMentor = !!(live && live.mode === 'mentor');
  // 30-qonun: qulflangan tugma AYNAN qaysi shart qolganini aytadi (bosqichli dinamik yorliq)
  const navLabel = done || isMentor ? 'Davom etish'
    : !nsOk ? "① North Star'ni raqamli yozing"
    : !threeAsks ? '② 3 kartaga 3 xil savol tanlang'
    : !allWhy ? "③ Har kartani to'liq to'ldiring"
    : '«✅ Bajardim»ni bosing';
  const persistNS = (val) => setSt(prev => { writeMetrics({ northStar: val, cards: prev.cards }); return { ...prev, northStar: val }; });
  const setCard = (i, p) => setSt(prev => { const cards = prev.cards.map((c, k) => k === i ? { ...c, ...p } : c); writeMetrics({ northStar: prev.northStar, cards }); return { ...prev, cards }; });
  const complete = () => {
    if (done || !passed) return;
    setSt(prev => ({ ...prev, done: true }));
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'metric-panel', northStar, cards, solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  return (
    <Stage eyebrow="Mustaqil ish · metrika-panel ✍️" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Loyihangiz <span className="italic" style={{ color: T.accent }}>metrika-panelini</span> o'zingiz yig'a olasizmi?</h2></div>
        <Mentor>North Star'ni tasdiqlab 3 kartani to'ldiring — shartlar o'ngdagi 🎯 panelda, to'lgan karta ustida <b style={{ color: T.success }}>● JONLI</b> yonadi.</Mentor>
        <MentorWatchLine>Bu mustaqil ishni <b>o'quvchilar</b> bajaradi — «✍️ Panelni tugatganlar» ro'yxatida kuzatasiz; «Davom etish» siz uchun ochiq.</MentorWatchLine>
        <div className="split">
          <Col>
            <div className={`nstar-editor mini ${nsOk ? 'ok' : ''}`}>
              <span className="nstar-lead">⭐ North Star (tasdiqlang)</span>
              <textarea className="nstar-input" value={northStar} spellCheck={false} rows={2} onChange={e => persistNS(e.target.value)} placeholder="…soni, chunki u qanday qiymatni ko'rsatadi" />
            </div>
            {cards.map((c, i) => {
              const v = validateMetricCard(c);
              const nOk = [v.nomOk, v.whatOk, v.whyOk, v.askOk].filter(Boolean).length;
              return (
                <div key={i} className={`swcard ${v.full ? 'ok' : ''}`}>
                  <div className="swcard-h">
                    <span className="swcard-n">{i + 1}</span>
                    <span className="swcard-sent">{c.nom ? <b>{c.nom}</b> : `Metrika-karta ${i + 1}`}</span>
                    {v.full ? <span className="mlive mini">● JONLI</span> : <span className="swcard-prog">{nOk}/4</span>}
                  </div>
                  <div className="swcard-fields">
                    <label className={`smini-f kim ${v.nomOk ? 'on' : ''}`}><span>NOMI</span><input value={c.nom} onChange={e => setCard(i, { nom: e.target.value })} placeholder="masalan: retention" /></label>
                    <label className={`smini-f nima ${v.whatOk ? 'on' : ''}`}><span>NIMANI o'lchaydi</span><input value={c.what} onChange={e => setCard(i, { what: e.target.value })} placeholder="yana kelganlar ulushi" /></label>
                    <label className={`smini-f natija ${v.whyOk ? 'on' : ''}`}><span>NEGA muhim</span><input value={c.why} onChange={e => setCard(i, { why: e.target.value })} placeholder="real foyda shu yerda" /></label>
                  </div>
                  <label className={`mwcard-ask ${c.ask ? 'on' : ''}`}>
                    <span>Qaysi savolga javob?</span>
                    <select value={c.ask} onChange={e => setCard(i, { ask: e.target.value })}>
                      <option value="">— tanlang —</option>
                      {METRIC_ASKS.map(a => <option key={a.k} value={a.k}>{a.label}</option>)}
                    </select>
                  </label>
                  <label className="mwcard-hyp">
                    <span>⭐ Gipoteza (ixtiyoriy)</span>
                    <input value={c.hyp} onChange={e => setCard(i, { hyp: e.target.value })} placeholder="…qilsak, bu raqam o'sadi" />
                  </label>
                </div>
              );
            })}
          </Col>
          <Col>
            <TaskSpec sticky items={checks.map(c => ({ done: c.ok, label: c.label, detail: c.detail }))} />
            <div className="wsx-row fade-up">
              <div className={`wsx ${helpOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setSt(prev => ({ ...prev, helpOpen: !prev.helpOpen }))}>💡 Yordam {helpOpen ? '▾' : '▸'}</button>
                {helpOpen && <div className="wsx-body">
                  <p>Foydalanuvchi qachon <b>xursand</b> bo'ladi? O'sha lahzaning raqami — North Star.</p>
                  <p>Kelish · qaytish · qiymat — har biri <b>o'z raqamini</b> so'raydi.</p>
                </div>}
              </div>
              <div className={`wsx star ${starOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setSt(prev => ({ ...prev, starOpen: !prev.starOpen }))}>⭐ Yulduzcha {starOpen ? '▾' : '▸'}</button>
                {starOpen && <div className="wsx-body">
                  <p>Har kartaga <b>gipoteza</b> (taxmin): «[X] qilsak, bu raqam o'sadi» — keyingi darsda shu taxminlardan maqsad qo'yamiz.</p>
                </div>}
              </div>
            </div>
            <MentorPracticeStats live={live} screen={screen} label="✍️ Panelni tugatganlar" />
            <button className={`lp-done-btn ${done ? 'is-done' : ''}`} disabled={done || !passed} onClick={complete}>
              {done ? '✓ Bajarildi' : passed ? '✅ Bajardim' : `🎯 Topshiriq: ${checks.filter(c => c.ok).length}/3`}
            </button>
            {done && <div className="done-mini fade-step">✅ Panel ● JONLI <span className="dm-sub">— davom etishingiz mumkin</span></div>}
          </Col>
        </div>
        <MentorNote>3/3 = o'tdi · 2/3 = joyida to'ldiradi · kam = YORDAM bilan qaytadan. «Hammasi DAU bo'lsin» tuzog'i: uch karta uch XIL savolga javob berishini tekshiring.</MentorNote>
        <MiniPult />
      </div>
    </Stage>
  );
};

// ===== SCREEN 7/8 — TEKSHIRUV: teoriyaga biriktirilgan scored MCQ (QuestionScreen, lead→cue) =====
const TestLead = ({ tag, lead, cue }) => (
  <div className="proj-q">
    <span className="proj-q-lbl">🔎 {tag}</span>
    <p className="broken-cue">{lead}</p>
    <p className="proj-q-body"><b>{cue}</b></p>
  </div>
);
const Screen7 = (props) => (
  <QuestionScreen {...props} eyebrow="Tekshiruv · test 1" scope="module-mikro"
    question={<TestLead tag="Test 1"
      lead="DAU bilan MAU'ni endi bilasiz."
      cue="Ilovangizga odamlar HAR KUNI kirib tursa, qaysi ko'rsatkich birinchi o'sadi?" />}
    questionText="Test 1: har kuni kirish"
    options={["DAU — kunlik faol foydalanuvchi", "Churn — ketish ulushi", "Sahifa dizaynining bahosi", "Server narxi"]}
    correctIdx={0}
    explainCorrect="DAU (kunlik faol foydalanuvchi) — odam har kuni kirsa, avvalo shu raqam o'sadi. Churn esa aksincha kamayadi."
    explainWrong={{ 1: "Churn — ketish. Odam qaytib kirsa, churn kamayadi, o'smaydi. To'g'ri javob — DAU.", 2: "Sahifa dizayni — bu metrika emas, sub'ektiv baho. To'g'ri javob — DAU.", 3: "Server narxi — bu xarajat, foydalanuvchi faolligini o'lchamaydi. To'g'ri javob — DAU.", default: "Har kuni kirish avvalo DAU'ni o'stiradi." }}
  />
);
const Screen8 = (props) => (
  <QuestionScreen {...props} eyebrow="Tekshiruv · test 2" scope="module-mikro"
    question={<TestLead tag="Test 2"
      lead="Duolingo misolida ko'rdik — streak odamni qaytaradi."
      cue="Streak birinchi navbatda qaysi metrikani ko'taradi?" />}
    questionText="Test 2: streak qaysi metrikani ko'taradi"
    options={["Yangi foydalanuvchilar oqimi", "Server tezligi", "Retention — qaytish ulushi", "Bitta xariddagi o'rtacha pul"]}
    correctIdx={2}
    explainCorrect="Retention — «qaytish» mexanikasi. Streak odamni qayta-qayta qaytaradi, demak avvalo retention o'sadi."
    explainWrong={{ 0: "Yangi oqim — bu yangi kelganlar. Streak faqat mavjudlarni qaytaradi, yangi odam keltirmaydi. To'g'ri javob — retention.", 1: "Server tezligi — texnik ko'rsatkich, streak'ga bog'liq emas. To'g'ri javob — retention.", 3: "Bitta xariddagi o'rtacha pul («o'rtacha chek») — bu daromad metrikasi. Streak avvalo qaytishni oshiradi. To'g'ri javob — retention.", default: "Streak = qaytish mexanikasi → retention." }}
  />
);

// ===== SCREEN 9 — TEKSHIRUV (TEST-3): MatchPairs — 4 metrika ↔ 4 savol juftlash (scored, Kahoot-reveal) =====
// KONTRAKT: 4 chip → 4 nishon · atomik holat (yagona useState) · DOM-transform drag + tap-fallback ·
// scored: birinchi-urinish mukammal → picked=0, aks holda picked=1 · INLINE_KEYS.s9=0 · Kahoot-reveal.
const MATCH_PAIRS = [
  { id: 'dau',   chip: 'DAU',        ic: '📅', target: 'Bugun nechta odam kirdi?' },
  { id: 'ret',   chip: 'retention',  ic: '↩️', target: 'Kelganlardan necha kishi yana keldi?' },
  { id: 'churn', chip: 'churn',      ic: '📉', target: 'Necha kishi butunlay ketdi?' },
  { id: 'ns',    chip: 'North Star', ic: '⭐', target: 'Mahsulot haqiqiy qiymat beryaptimi?' },
];
// Fon-dekor tokenlari (27-qonun: dekor o'qitadi — Metrics atamalari, ball-mantiqqa aloqasi yo'q)
const MMX_TOKENS = ['DAU', '%', '📈', 'retention', 'churn', '⭐'];
// Barqaror (StrictMode-safe) tartiblar — render'da aralashtirilmaydi. Chip tartibi nishondan farqli.
const MATCH_CHIP_ORDER = [2, 0, 3, 1]; // churn · DAU · North Star · retention
const MATCH_TARGET_ORDER = [0, 1, 2, 3];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student');
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now());
  const [st, setSt] = useState(() => ({
    assign: storedAnswer?.assign || { 0: null, 1: null, 2: null, 3: null },
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
  const filled = Object.values(assign).filter(v => v !== null).length;
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
    if (Object.values(next).filter(v => v !== null).length === 4) complete(next);
    else setSt(prev => ({ ...prev, assign: next, sel: null, drag: null }));
  };
  const tapChip = (chipId) => { if (solved || isMentorLive) return; setSt(prev => ({ ...prev, sel: prev.sel === chipId ? null : chipId })); };
  const tapTarget = (targetIdx) => { if (solved || isMentorLive) return; if (sel != null) place(targetIdx, sel); };

  const revealed = !oneShot || !!(live && (live.revealScreen === screen || live.mentorScreen > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  const showColors = isMentorLive ? mReveal : (solved && revealed);
  const allCorrect = MATCH_PAIRS.every((p, i) => assign[i] === p.id);
  const navLabel = isMentorLive ? (mReveal ? 'Davom etish' : 'Avval natijani oching') : (solved ? 'Davom etish' : 'Barcha juftlikni tuzing');
  return (
    <Stage eyebrow="Tekshiruv · juftlash" screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">
          <div className="proj-q">
            <span className="proj-q-lbl">🔎 Test 3 · juftlash</span>
            <p className="broken-cue">3 kartangiz tayyor.</p>
            <p className="proj-q-body"><b>Endi 4 asosiy metrikani o'z savoliga juftlang — har metrikani to'g'ri savol ustiga torting (yoki bosing).</b></p>
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
            {pool.length === 0 && <span className="match-pool-empty">Hammasi joylandi ✓</span>}
          </div>
          <div className="match-hint small mono">{sel ? '👉 endi savol ustiga bosing' : (isMentorLive ? '' : 'metrikani tanlang yoki savol ustiga torting')}</div>
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
            {waiting ? "Hozir to'g'ri juftlikni bilib olasiz." : "DAU → «bugun kirganlar» · retention → «yana kelganlar» · churn → «butunlay ketganlar» · North Star → «real qiymat». Har metrika bitta savolga javob beradi."}
          </p>
          {!isMentorLive && !allCorrect && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>📖 Qisqa takrorlash — mavzuni yana bir ko'rish</button>
          )}
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={["Barcha juftlik to'g'ri", "Xato bo'ldi"]} correctIdx={0} reveal={mReveal} onReveal={doReveal} onOpenRecap={() => setRecapOpen(true)} />}
        {recapOpen && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
        <MentorNote>Hamma o'quvchi juftlab bo'lmaguncha natijani ochmang. Ochgandan keyin xato juftlangan metrikalarni birga ko'rib chiqing — qaysi metrika qaysi savolga javob berishini takrorlang.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — KODING (⚛️ React, 26-qonun): MetrikaPanel — HISOB-KOMPONENT VS Code-topshirig'i =====
// JTBD (M7-D2) koding'idan FARQLI mexanika: props-karta emas — komponent ICHIDA retention foizi
// HISOBLANADI (const foiz = Math.round(qaytdi / keldi * 100)) va o'quvchining ustaxonadagi REAL
// panel-ma'lumotlari (METRICS_KEY) massiv+map bilan chiqadi. Jonli namuna-preview o'quvchining
// o'z kartalaridan render bo'ladi (bo'sh bo'lsa — namunaviy). Ball-rels AYNAN eski kompilyator
// relsi: onAnswer({stage:'koding',...solved:true,correct:true}) + submitAnswer(PRACTICE_BASE+screen,'koding',0,true,0).
const MK_DEMO_CARDS = [
  { nom: 'DAU', what: 'kunlik kirganlar' },
  { nom: 'retention', what: 'yana kelganlar ulushi' },
  { nom: 'North Star', what: 'haftada 3+ qaytganlar' },
];
const mkPanel = () => {
  const saved = readMetrics();
  const cards = (saved?.cards || []).filter(c => (c.nom || '').trim() && (c.what || '').trim()).slice(0, 3);
  const own = cards.length >= 3;
  return { cards: own ? cards : MK_DEMO_CARDS, ns: ((saved?.northStar) || '').trim(), own };
};
const MK_STEPS = [
  "`src` ichida `MetrikaPanel.jsx` yaratdim",
  "`foiz` hisobi ishladi: `Math.round(qaytdi/keldi*100)`",
  "Kartalar massivini `map` bilan chiqardim",
  "Brauzerda panel va 25% ko'rindi",
];
// Nusxalanadigan boshlang'ich kod — KARTALAR massivi o'quvchining O'Z panel-kartalaridan yig'iladi.
const mkCode = (cards) => `const KARTALAR = [
${cards.map(c => `  { nom: "${c.nom}", olchov: "${c.what}" },`).join('\n')}
];

function MetrikaPanel({ keldi, qaytdi }) {
  const foiz = Math.round(qaytdi / keldi * 100);
  return (
    <div className="panel">
      <h3>Retention: {foiz}%</h3>
      {KARTALAR.map(k => (
        <p key={k.nom}>{k.nom} — {k.olchov}</p>
      ))}
    </div>
  );
}

export default MetrikaPanel;

// App.jsx ichida:
// <MetrikaPanel keldi={20} qaytdi={5} />`;
// Mini sintaksis-bo'yoq (VS Code-mockup) — faqat ko'rinish, kod bajarilmaydi.
const MK_TOKEN = /("[^"]*"|\/\/.*$|\b(?:function|return|export|default|const)\b|<\/?[A-Za-z][\w.]*|\{|\})/g;
const mkHl = (ln) => ln.split(MK_TOKEN).filter(p => p !== undefined && p !== '').map((p, i) => {
  if (p.startsWith('//')) return <span key={i} style={{ color: '#6A9955' }}>{p}</span>;
  if (p.startsWith('"')) return <span key={i} style={{ color: '#CE9178' }}>{p}</span>;
  if (/^(function|return|export|default|const)$/.test(p)) return <span key={i} style={{ color: '#C586C0' }}>{p}</span>;
  if (/^<\/?[A-Z]/.test(p)) return <span key={i} style={{ color: '#4EC9B0' }}>{p}</span>;
  if (/^<\/?[a-z]/.test(p)) return <span key={i} style={{ color: '#569CD6' }}>{p}</span>;
  if (p === '{' || p === '}') return <span key={i} style={{ color: '#FFD70A' }}>{p}</span>;
  return <span key={i}>{p}</span>;
});

const ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [panel] = useState(() => mkPanel());
  const [code] = useState(() => mkCode(panel.cards));
  const [checked, setChecked] = useState(() => new Set(storedAnswer && storedAnswer.solved ? MK_STEPS.map((_, i) => i) : []));
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const [copied, setCopied] = useState(false);
  // 🧮 Jonli hisob — honor-checklistga REAL qatlam: o'quvchi raqam kiritsa, kod-qator foizni o'zi
  // hisoblab chiqaradi va «foiz hisobi ishladi» bandi (idx 1) avto-✓ bo'ladi. Ball-signal o'zgarmagan.
  const [calc, setCalc] = useState({ keldi: '', qaytdi: '' });
  const kN = parseInt(calc.keldi, 10), qN = parseInt(calc.qaytdi, 10);
  const calcReady = calc.keldi.trim() !== '' && calc.qaytdi.trim() !== '' && Number.isFinite(kN) && Number.isFinite(qN);
  const calcFoiz = calcReady && kN > 0 ? Math.round(qN / kN * 100) : null;
  const onCalc = (p) => {
    const nx = { ...calc, ...p };
    setCalc(nx);
    const k = parseInt(nx.keldi, 10), q = parseInt(nx.qaytdi, 10);
    if (!done && Number.isFinite(k) && k > 0 && Number.isFinite(q)) setChecked(prev => prev.has(1) ? prev : new Set([...prev, 1]));
  };
  const toggle = (i) => { if (done) return; setChecked(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; }); };
  const allChecked = checked.size === MK_STEPS.length;
  const copy = () => {
    try { navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); }).catch(() => {}); } catch {}
  };
  // Birinchi marta tugatilganda ball-signal ketadi — AYNAN eski kompilyator-relsdagidek.
  const complete = () => {
    if (done || !allChecked) return;
    setDone(true);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, solved: true, correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  const lines = code.split('\n');
  return (
    <Stage eyebrow="Koding · ⚛️ React" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? 'Davom etish' : allChecked ? '«✅ Bajardim»ni bosing' : `Qadamlarni belgilang (${checked.size}/4)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Retention foizini <span className="italic" style={{ color: T.accent }}>kodning o'zi</span> hisoblasa-chi?</h2></div>
        <Mentor>Kodni nusxalab VS Code'da loyihangizga qo'shing — <b style={{ color: T.ink }}>MetrikaPanel</b> foizni <b style={{ color: T.ink }}>o'zi hisoblab</b>, ustaxonadagi kartalaringizni chiqaradi.</Mentor>
        <MentorWatchLine>Kodni <b>o'quvchilar</b> yozadi — «⚛️ Panelni kodlaganlar» ro'yxatida kuzatasiz; «Davom etish» siz uchun ochiq.</MentorWatchLine>
        <div className="mxprev fade-up delay-1">
          <div className="mxprev-bar"><span className="bb-dots"><i /><i /><i /></span><span className="mxprev-url">localhost:5173</span><span className="mxprev-src">{panel.own ? '✓ sizning panelingiz' : 'namunaviy panel'}</span></div>
          <div className="mxprev-body">
            <div className="mxprev-head">
              <span className="mxprev-foiz mono"><CountUp to={25} suffix="%" /></span>
              <div className="mxprev-head-t"><span className="mxprev-lbl">Retention</span><span className="mxprev-calc mono">Math.round(5 / 20 * 100)</span></div>
              {panel.ns && <span className="mxprev-ns" title={panel.ns}>⭐ {panel.ns}</span>}
            </div>
            <div className="mxprev-cards">
              {panel.cards.map((c, i) => (
                <div key={i} className="mxprev-card"><span className="mlive mini">●</span><span className="mxprev-card-nm">{c.nom}</span><span className="mxprev-card-what">{c.what}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="split">
          <Col>
            <div className="vsc fade-up delay-2">
              <div className="vsc-bar">
                <span className="vsc-tab on"><span style={{ color: '#61DAFB' }}>⚛</span> MetrikaPanel.jsx</span>
                <span className="vsc-tab">App.jsx</span>
                <button className={`vsc-copy ${copied ? 'ok' : ''}`} onClick={copy}>{copied ? '✓ Nusxalandi' : '📋 Nusxalash'}</button>
              </div>
              <div className="vsc-body">
                {lines.map((ln, i) => (
                  <div key={i} className="vsc-line"><span className="vsc-ln">{i + 1}</span><span className="vsc-code">{ln ? mkHl(ln) : ' '}</span></div>
                ))}
              </div>
            </div>
          </Col>
          <Col>
            <div className="card-lbl" style={{ color: T.accent, marginBottom: 0 }}>VS Code'da bajarib — belgilang</div>
            <div className="kd-steps fade-up delay-2">
              {MK_STEPS.map((s, i) => {
                const on = checked.has(i);
                return (
                  <button key={i} className={`kd-step ${on ? 'on' : ''}`} onClick={() => toggle(i)}>
                    <span className="kd-check">{on ? '✓' : i + 1}</span>
                    <span className="kd-step-t">{fmtCode(s)}</span>
                  </button>
                );
              })}
            </div>
            <div className="calcw fade-up delay-2">
              <span className="card-lbl" style={{ color: T.accent, marginBottom: 0 }}>🧮 Jonli sinov — raqam kiriting</span>
              <div className="calcw-row">
                <label className="calcw-f"><span>keldi</span><input className="mono" value={calc.keldi} onChange={e => onCalc({ keldi: e.target.value.replace(/\D/g, '').slice(0, 5) })} inputMode="numeric" placeholder="100" /></label>
                <label className="calcw-f"><span>qaytdi</span><input className="mono" value={calc.qaytdi} onChange={e => onCalc({ qaytdi: e.target.value.replace(/\D/g, '').slice(0, 5) })} inputMode="numeric" placeholder="30" /></label>
              </div>
              <div className={`calcw-term mono ${calcFoiz != null ? 'on' : ''}`}>
                <span className="calcw-ps" aria-hidden="true">›</span>
                {calcReady
                  ? (kN > 0
                    ? <>retention({kN}, {qN}) → <b>{calcFoiz}%</b></>
                    : <>retention(0, {qN}) → nolga bo'lib bo'lmaydi 🤯</>)
                  : <span className="calcw-wait">retention(keldi, qaytdi) → ?</span>}
              </div>
            </div>
            <div className="star-task"><span className="card-lbl" style={{ color: T.blue }}>⭐ Yulduzcha</span><p className="small" style={{ margin: 0, color: T.ink2 }}>MAU kartasini qo'shib, <span className="mono">DAU/MAU</span> nisbatini (bo'linmasini) chiqaring — «qanchalik tez-tez qaytishadi» ko'rsatkichi.</p></div>
            <MentorPracticeStats live={live} screen={screen} label="⚛️ Panelni kodlaganlar" />
            <button className={`lp-done-btn ${done ? 'is-done' : ''}`} disabled={done || !allChecked} onClick={complete}>
              {done ? '✓ Bajarildi' : allChecked ? '✅ Bajardim' : `4 qadamni belgilang (${checked.size}/4)`}
            </button>
            {done && <div className="done-mini fade-step">✅ MetrikaPanel loyihangizda <span className="dm-sub">— retention endi kodda hisoblanadi</span></div>}
          </Col>
        </div>
        <MentorNote>Eng ko'p adashish — qavslar va katta harf (MetrikaPanel). Sinfga savol sifatida bering: keldi 0 bo'lsa nima bo'ladi? Ulgurmagan o'quvchi uyda tugatadi. Xohlasangiz proyektorda o'z VS Code'ingizda jonli ko'rsating.</MentorNote>
        <MiniPult />
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — RECAP: 3 raqamlangan qadam (rcp-flow) + P0-etalon juftlik-taymer + Reflection =====
const REFLECT_KEY = 'pm-m8d1-reflection';
// Juftlik-taymeri (P0 etalon): 60s = avval A gapiradi (30s), keyin B (30s) — kim gapirayotgani
// doim ko'rinadi (🎙 puls), o'rta-marker progress, «✓ Vaqt tugadi» holati.
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
            <span className="pair-now"><span className="pair-mic" aria-hidden="true">🎙</span> Hozir <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span> gapiradi{isA ? ' — keyin B' : ''}</span>
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
// Solo-rejim o'z-tekshiruv kartalari: sinf-savollari yakka o'quvchida ishlamaydi (qo'l ko'tarish/ovoz),
// shuning uchun solo'da har karta bosilganda JAVOBI ochiladi; 3-karta pult-holatini REAL o'qiydi.
const SOLO_QA = [
  { ic: '✋', q: <>Retention <b>kirganlarni</b>mi yoki <b>yana kelganlarni</b>mi o'lchaydi?</>, a: "Yana kelganlarni — qaytish ulushini sanaydi." },
  { ic: '🗳️', q: <>«100 kishi kirdi, 90 tasi qaytmadi» — qaysi metrika signal beradi?</>, a: 'Retention: atigi 10% qaytdi (churn — 90%).' },
];
const Screen11 = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const solo = !gate.live || gate.live.mode === 'self';
  const [qaOpen, setQaOpen] = useState(() => [false, false, false]);
  const openQa = (i) => setQaOpen(prev => prev[i] ? prev : prev.map((v, k) => (k === i ? true : v)));
  const litN = solo ? pultLamps().filter(l => l.on).length : 0;
  const [text, setText] = useState(() => { try { return localStorage.getItem(REFLECT_KEY) || ''; } catch { return ''; } });
  const save = (v) => { setText(v); try { localStorage.setItem(REFLECT_KEY, v); } catch {} };
  const written = text.trim().length >= 8;
  return (
    <Stage eyebrow="Mustahkamlash · 3 qadam" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label="Davom etish" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">North Star'ingiz nima — va qaysi <span className="italic" style={{ color: T.accent }}>qiymatni</span> ko'rsatadi?</h2></div>
        <Mentor>Dars deyarli tugadi — endi o'rganganingizni pastdagi <b style={{ color: T.ink }}>uch qadamda</b> o'zingiz takrorlaysiz.</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">🗣 Juftlikda ayting</span><span className="rcp-s">«North Star'im — …, chunki …» — 30 soniyada rol almashadi</span></div></div>
            <PairTimer />
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">✍️ Bir qator yozing</span><span className="rcp-s">Hozirgina aytganingizni bitta gapga sig'diring</span></div></div>
            <input className="reflect-input" value={text} onChange={e => save(e.target.value)} placeholder="Mening North Star'im — ..., chunki u ...ni ko'rsatadi" maxLength={160} />
            {written && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>✓ Yozildi — keyingi darsda shu raqamdan boshlaymiz.</p>}
          </div>
          <div className="rcp-step wide fade-up delay-3">
            <div className="rcp-step-h"><span className="rcp-n">3</span><div><span className="rcp-t">{solo ? "⚡ O'zingizni tekshiring — 3 karta" : '⚡ Sinf bilan — 3 tez savol'}</span><span className="rcp-s">{solo ? 'Avval o\'zingiz javob bering, keyin kartani bosib tekshiring' : "Mentor o'qiydi, siz harakat bilan javob berasiz"}</span></div></div>
            {solo ? (
              <div className="qa-cards">
                {SOLO_QA.map((c, i) => (
                  <button key={i} type="button" className={`qa-card tap ${qaOpen[i] ? 'open' : ''}`} onClick={() => openQa(i)}>
                    <span className="qa-ic">{c.ic}</span><p>{c.q}</p>
                    {qaOpen[i] ? <span className="qa-ans fade-step">✓ {c.a}</span> : <span className="qa-tap">javobni ochish ▸</span>}
                  </button>
                ))}
                <button type="button" className={`qa-card tap ${qaOpen[2] ? 'open' : ''}`} onClick={() => openQa(2)}>
                  <span className="qa-ic">📟</span><p>North Star + 3 kartangiz tayyormi? <b>Panelni tekshiring</b></p>
                  {qaOpen[2]
                    ? <span className="qa-ans fade-step">{litN === 4 ? "✓ 4/4 chiroq — panelingiz to'liq jonli!" : `${litN}/4 chiroq — qolganini ustaxonada to'ldirsangiz bo'ladi.`}</span>
                    : <span className="qa-tap">holatni ochish ▸</span>}
                </button>
              </div>
            ) : (
              <div className="qa-cards">
                <div className="qa-card"><span className="qa-ic">✋</span><p>Retention <b>kirganlarni</b> emas, <b>yana kelganlarni</b> o'lchaydimi? — qo'l ko'taring</p></div>
                <div className="qa-card"><span className="qa-ic">🗳️</span><p>«100 kishi kirdi, 90 tasi qaytmadi» — qaysi metrika signal beradi? — ovoz bering</p></div>
                <div className="qa-card"><span className="qa-ic">📄</span><p>North Star + 3 karta yozganlar — panel ekranini ko'tarsin</p></div>
              </div>
            )}
          </div>
        </div>
        <MentorNote>Sinfning uchdan biri North Star bilan DAU'ni farqlay olmasa — oshxona misolini qayta tushuntiring (kelganlar emas — QAYTGANLAR).</MentorNote>
        <MiniPult />
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — UYGA VAZIFA «SHARTNOMA»: qaysi metrikani birinchi tekshirishni SHU YERDA tanlash =====
// Tanlov localStorage'ga (HW_KEY) yoziladi — summary va keyingi dars o'qishi mumkin.
const HW_KEY = 'pm-m8d1-hw';
const HW_TARGETS = ["North Star", "retention", "DAU"];
const readHwTarget = () => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } };
const Screen12 = ({ screen, onNext, onPrev }) => {
  const [st, setSt] = useState(() => {
    const saved = readHwTarget();
    const isPreset = HW_TARGETS.includes(saved);
    return { target: saved, custom: isPreset ? '' : saved, customMode: !!saved && !isPreset };
  });
  const { target, custom, customMode } = st;
  const pick = (t) => { setSt(prev => ({ ...prev, target: t, customMode: false })); try { localStorage.setItem(HW_KEY, t); } catch {} };
  const setCustom = (v) => { setSt(prev => ({ ...prev, custom: v, target: v.trim(), customMode: true })); try { localStorage.setItem(HW_KEY, v.trim()); } catch {} };
  const openCustom = () => setSt(prev => ({ ...prev, customMode: true, target: prev.custom.trim() }));
  const chosen = target && target.trim();
  // Yolg'on-checklist YO'Q: bandlar REAL holatdan o'qiydi (tanlov + METRICS_KEY paneli) — uy-vazifaga
  // yo'lga-tayyorlik tekshiruvi. Uydagi ishning o'zi hw-kartalarda yozilgan.
  const lamps = pultLamps();
  const nsOk = lamps[0].on;
  const cardsOk = lamps.slice(1).every(l => l.on);
  return (
    <Stage eyebrow="Uyga vazifa · shartnoma" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label="Davom etish" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Qaysi metrikani <span className="italic" style={{ color: T.accent }}>birinchi</span> tekshirasiz?</h2></div>
        <Mentor>Uyda MVP'ingizning <b style={{ color: T.ink }}>tahlil (analytics) panelini</b> oching — uni oldingi modulda ulagansiz — va 3 metrika-kartangizga o'tgan haftaning <b style={{ color: T.ink }}>jonli raqamini</b> yozing. Shu yerda birinchi tekshiradigan metrikani tanlang — vazifangiz shunga moslashadi.</Mentor>
        <div className="hw-chips fade-up delay-1">
          {HW_TARGETS.map(t => (
            <button key={t} className={`hw-chip ${target === t && !customMode ? 'on' : ''}`} onClick={() => pick(t)}>{t}</button>
          ))}
          <button className={`hw-chip add ${customMode ? 'on' : ''}`} onClick={openCustom}>➕ o'zim yozaman</button>
        </div>
        {customMode && (
          <input className="reflect-input fade-step" value={custom} onChange={e => setCustom(e.target.value)} placeholder="masalan: churn, sessiya davomiyligi…" maxLength={40} autoFocus />
        )}
        {chosen ? (
          <div className="split">
            <div className="hw-card full fade-step">
              <span className="hw-badge">To'liq · ~20 daqiqa</span>
              <p className="body" style={{ color: T.ink }}>Analytics'ni ochib, <b>{chosen}</b>dan boshlab <b>3 metrika-kartangizga jonli raqam</b> yozing. Raqam chiqmagan kartaga «hali o'lchanmaydi — nima qo'shish kerak» deb yozing. Eng hayron qoldirgan raqamni bir gap izoh bilan belgilang.</p>
            </div>
            <div className="hw-card short fade-step">
              <span className="hw-badge short">Qisqa · ~10 daqiqa</span>
              <p className="body" style={{ color: T.ink }}>Vaqt kam bo'lsa: faqat <b>North Star</b> raqamini analytics'dan topib yozing va bir gap izoh qo'shing.</p>
            </div>
          </div>
        ) : (
          <div className="frame-soft fade-up delay-2"><p className="body" style={{ margin: 0, color: T.ink }}>👆 Avval metrikani tanlang — vazifa-karta shunga moslashadi.</p></div>
        )}
        <div className="checklist fade-up delay-2">
          <div className="card-lbl" style={{ color: T.accent }}>📋 Yo'lga tayyorlik (3 band)</div>
          <StoryCheck ok={!!chosen} label="Birinchi metrika tanlandi" />
          <StoryCheck ok={nsOk} label="North Star yozilgan" />
          <StoryCheck ok={cardsOk} label="3 metrika-karta to'ldirilgan" />
        </div>
        <MentorNote>Koding sinfda tugagan bo'lsa — to'liq versiya; uyga ketgan bo'lsa — qisqa versiya. Analytics'i ishlamayotgan o'quvchiga: avval oldingi moduldagi ulanishni tiklash — bu ham vazifa.</MentorNote>
        <MiniPult />
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES — REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  panelPro:   { icon: '📊', name: 'Panel Pro!',   desc: "Metrika-panelni 3/3 to'ldirdingiz" },
  dataEye:    { icon: '👁️', name: 'Data Eye!',    desc: "3 testni ham to'g'ri yechdingiz" },
  calcMaster: { icon: '🛠️', name: 'Calc Master!', desc: "Retention foizini MetrikaPanel komponentida hisobladingiz" },
  graduate:   { icon: '🎓', name: 'Level Up!',    desc: "Metrika darsini yakunladingiz" },
};
// Ekran id → nishon (recordAnswer'da, faqat REAL solve bilan). dataEye = 3/3 aggregat, graduate = summary.
const ACH_TRIGGERS = { practice: 'panelPro', s10: 'calcMaster' };

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
const Q_LABELS = { 4: "1 — DAU testi", 6: "2 — Retention testi", 9: "3 — Juftlash" };
const QUIZ_MS = 15000;
// Arena fon tokenlari — darsning "DNK"si (metrika atamalari). Arena platforma mahsuloti — brendi qoladi.
const QZ_BG_SHAPES = [
  { ch: 'DAU',       l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: 'MAU',       l: 85, t: 8,  s: 28, d: 23, dl: 1.5 },
  { ch: 'retention', l: 8,  t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: 'churn',     l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: 'North Star',l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: '%',         l: 66, t: 26, s: 30, d: 17, dl: 0.4 },
  { ch: 'streak',    l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: 'qaytish',   l: 55, t: 5,  s: 22, d: 22, dl: 0.6 },
  { ch: 'N★',        l: 91, t: 42, s: 28, d: 24, dl: 1.3 },
  { ch: '🔥',        l: 16, t: 52, s: 28, d: 26, dl: 2.6 },
  { ch: '⭐',        l: 2,  t: 30, s: 30, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3), naqshsiz. darslik-jonli TASDIQLAYDI.
const QUIZ_BANK = [
  { q: "Metrika nima?", opts: ["Ilova yuklab olingan qurilma modeli", "Kodda nechta funksiya borligi", "Mahsulot holatini ko'rsatadigan raqam", "Dizayn ranglari to'plami"], correct: 2 },
  { q: "DAU nimani sanaydi?", opts: ["Kunlik faol foydalanuvchilar soni", "Oyiga to'langan pul", "Sahifadagi tugmalar soni", "Serverning tezligi"], correct: 0 },
  { q: "Retention nimani o'lchaydi?", opts: ["Bir kunda kirganlar soni", "Kelganlarning keyin qaytish ulushi", "Yangi foydalanuvchilar oqimi", "Ilova hajmi"], correct: 1 },
  { q: "Churn nima?", opts: ["Qaytganlar ulushi", "Kunlik faol foydalanuvchi", "Bosh yulduz-ko'rsatkich", "Butunlay tashlab ketganlar ulushi"], correct: 3 },
  { q: "North Star nima?", opts: ["Real qiymatni ko'rsatuvchi yagona bosh raqam", "Eng ko'p pul olib keladigan reklama", "Kodning eng muhim fayli", "Ilovadagi eng chiroyli ekran"], correct: 0 },
  { q: "Duolingo streak nima?", opts: ["Bir martalik katta chegirma", "Do'stlar ro'yxati", "Uzluksiz kunlar zanjiri", "Ilova versiyasi raqami"], correct: 2 },
  { q: "Streak birinchi navbatda qaysi metrikani ko'taradi?", opts: ["Server narxini", "Yangi foydalanuvchilar oqimini", "Ekran o'lchamini", "Retention (qaytish)ni"], correct: 3 },
  { q: "«MVP'ga (mahsulotning ilk sodda versiyasiga) bir haftada 100 kishi kirdi» — bu yaxshimi?", opts: ["Ha, chunki kirgan odam soni katta", "Aniq emas — qanchasi qaytganini ko'rish kerak", "Yo'q, har doim yomon", "Faqat serverning narxiga bog'liq"], correct: 1 },
  { q: "Oshxonadagi yangi taom misolida haqiqiy baho nima?", opts: ["Ikkinchi haftada nechtasi YANA olishi", "Birinchi kuni hamma olib ko'rishi", "Taomning rangi", "Narxi qancha ekani"], correct: 0 },
  { q: "20 kishi keldi, 5 tasi qaytdi. Retention necha foiz?", opts: ["5%", "20%", "100%", "25%"], correct: 3 },
  { q: "DAU va MAU farqi nimada?", opts: ["DAU pul, MAU vaqt", "Ular bir xil narsa", "DAU — kunlik, MAU — oylik faol foydalanuvchi", "DAU — dizayn ko'rsatkichi, MAU — marketing"], correct: 2 },
  { q: "North Star tanlashda eng ko'p uchraydigan xato qaysi?", opts: ["Uni jamoaga ochiq ko'rsatish", "Hammasini «kelish» (DAU) deb belgilash", "Raqamni har oy tekshirish", "Uni bitta qilib tanlash"], correct: 1 },
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
    const TOK = ['DAU', 'MAU', 'retention', 'churn', 'North Star', 'streak', 'qaytish', '%', '⭐', '🔥'];
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

// ===== 🏆 PODIUM / STATISTIKA — jonli reyting (solo'da — shaxsiy progress: halqa + nishonlar + pult) =====
const ScreenPodium = ({ screen, answers, achievements, onNext, onPrev }) => {
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
            <div className="spod-grid">
              <div className="card spod-card">
                <div className="card-lbl" style={{ color: T.accent }}>📟 Panel holati</div>
                {pultLamps().map((l, i) => (
                  <div key={i} className={`plamp ${l.on ? 'on' : ''}`}>
                    <i className="plamp-dot" aria-hidden="true" />
                    <span className="plamp-lbl">{l.lbl}</span>
                    <span className="plamp-st mono">{l.on ? '● JONLI' : '···'}</span>
                  </div>
                ))}
              </div>
              <div className="card spod-card">
                <div className="card-lbl" style={{ color: T.accent }}>🏅 Nishonlaringiz — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
                <div className="spod-badges">
                  {Object.entries(ACHIEVEMENTS).map(([id, a]) => {
                    const got = !!(achievements && achievements.has(id));
                    return <span key={id} className={`spod-badge ${got ? 'got' : ''}`} title={a.desc}><span aria-hidden="true">{got ? a.icon : '🔒'}</span>{a.name}</span>;
                  })}
                </div>
              </div>
            </div>
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>Bu — sizning shaxsiy natijangiz. Jonli darsda shu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.</p></div>
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
    "Metrika — mahsulotning holatini ko'rsatadigan raqam",
    "DAU/MAU — kelish · retention — yana kelish · churn — ketish",
    "North Star — real qiymatni ko'rsatuvchi yagona bosh raqam",
    "Kelganlar emas — ertasiga YANA KELGANLAR haqiqiy bahoni beradi",
    "Duolingo streak — retention'ni ko'taruvchi mahsulot-mexanikasi"
  ];
  const hwTarget = (() => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } })();
  const HOMEWORK = [
    { b: hwTarget ? `${hwTarget}dan` : 'Analytics', t: hwTarget ? "boshlab 3 kartaga jonli raqam yozing" : "— o'tgan hafta raqamlarini oching" },
    { b: '3 karta', t: "— har biriga jonli raqam yoki «nima yetishmaydi»" },
    { b: 'North Star', t: "— raqamini alohida belgilang va bir gap izoh" }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow="Tayyor" screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Qaytadan</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Yakunlash ✓</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> Dars tugadi</span><h2 className="title h-title fade-up d1">Sizning <span className="italic" style={{ color: T.accent }}>metrika-panelingiz</span> tayyor.</h2><p className="body h-sub fade-up d2">{PASSED ? "Tabriklaymiz! Endi mahsulotni «kelish» emas, «qaytish» va «qiymat» bilan o'lchaysiz — bu mahsulot fikrlashning poydevori." : "Yaxshi harakat! Testlarni yana bir marta ko'rib chiqing — DAU va retention farqi tez o'rnashadi."}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? '⏳ Mentorni kuting' : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> Endi siz bilasiz</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>📝 Uyga vazifa</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{hwTarget ? <>Shartnomangiz: <b style={{ color: T.accent }}>{hwTarget}</b>dan boshlab jonli raqamlar.</> : "Analytics'dan 3 kartaga jonli raqam:"}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>))}</ul><p className="hw-note">Keyingi darsda aynan shu metrikalar asosida maqsadlar qo'yamiz! 🚀</p></div>
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
export default function PmMetricsLesson({ lang: langProp, onFinished }) {
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
    // 🏅 dataEye — 3/3 scored testni (DAU · retention · juftlash) to'g'ri yechganda (scored indekslar 4/6/9 = s7/s8/s9)
    if ([4, 6, 9].every(i => nextA[i] && nextA[i].correct)) earn('dataEye');
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
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen7, Screen4, Screen8, Screen5, ScreenMetricWorkshop, Screen9, ScreenCoding, Screen11, Screen12, ScreenPodium, Screen16];
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

        /* === HOOK: STREAK-ALANGA ZANJIRLARI (dars imzosi) — ovoz sari zanjir uzunlashadi === */
        .streak-shelf { display: flex; flex-direction: column; gap: 12px; background: linear-gradient(180deg, ${T.paper}, #FBFAFE); border-radius: 18px; padding: clamp(14px,2.2vw,20px) clamp(12px,2vw,18px); box-shadow: 0 10px 28px -12px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.line}; }
        .streak-rows { display: flex; flex-direction: column; gap: 10px; }
        .streak-row { display: flex; align-items: center; gap: clamp(8px,1.6vw,14px); }
        .streak-abc { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; color: ${T.ink3}; width: 24px; height: 24px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 7px; background: ${T.bg}; transition: background 0.25s, color 0.25s; }
        .streak-row.mine .streak-abc { color: #fff; background: ${T.accent}; }
        .streak-row.top .streak-abc { color: #B7770D; background: #FFF1D6; box-shadow: inset 0 0 0 1px #F5A62366; }
        /* ember-track: zanjir asos-yo'lagi — alanga uning ustida yonadi */
        .streak-chain { display: flex; align-items: center; gap: clamp(2px,0.8vw,5px); flex: 1; min-width: 0; padding: 5px clamp(7px,1.5vw,11px); border-radius: 99px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}, inset 0 2px 5px rgba(${T.shadowBase},0.06); transition: box-shadow 0.3s, background 0.3s; }
        .streak-row.mine .streak-chain { background: linear-gradient(90deg, ${T.accentSoft}, #F3EFFE); box-shadow: inset 0 0 0 1.5px ${T.accent}44, inset 0 2px 5px rgba(91,61,230,0.08); }
        .streak-row.top .streak-chain { background: linear-gradient(90deg, #FFF6E7, #FFEFD4); box-shadow: inset 0 0 0 1.5px #F5A62366, inset 0 2px 6px rgba(255,150,40,0.14); }
        .streak-cell { font-size: clamp(14px,2.4vw,20px); line-height: 1; opacity: 0.24; filter: grayscale(1); transform: none; transition: opacity 0.45s ease, filter 0.45s ease; }
        .streak-cell.lit { opacity: 1; filter: grayscale(0) drop-shadow(0 0 5px rgba(255,140,30,0.5)); animation: streak-flicker 1.9s ease-in-out infinite; }
        .streak-cell.lit:nth-child(2n) { animation-delay: 0.28s; } .streak-cell.lit:nth-child(3n) { animation-delay: 0.55s; } .streak-cell.lit:nth-child(4n) { animation-delay: 0.82s; }
        .streak-row.top .streak-cell { font-size: clamp(16px,2.7vw,23px); }
        .streak-row.top .streak-cell.lit { filter: grayscale(0) drop-shadow(0 0 8px rgba(255,120,20,0.72)); animation-duration: 1.5s; }
        @keyframes streak-flicker { 0%,100% { transform: scale(1.03) rotate(-2deg); } 50% { transform: scale(1.13) rotate(2deg); filter: grayscale(0) drop-shadow(0 0 9px rgba(255,110,15,0.78)) brightness(1.07); } }
        .streak-pct { display: inline-flex; align-items: center; gap: 4px; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: ${T.ink}; font-variant-numeric: tabular-nums; min-width: 52px; justify-content: flex-end; }
        .streak-row.mine .streak-pct { color: ${T.accent}; }
        .streak-row.top .streak-pct { color: #B7770D; }
        .streak-crown { font-size: clamp(14px,2.2vw,18px); animation: float-sm 2.4s ease-in-out infinite; }
        .streak-cap { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; text-align: center; }
        @media (prefers-reduced-motion: reduce) { .streak-cell { transition: none; } .streak-cell.lit { animation: none; filter: grayscale(0) drop-shadow(0 0 4px rgba(255,140,30,0.45)); } .streak-crown { animation: none; } .hook-mc.taphint { animation: none; } }

        /* === 🗂 QOIDA (s3): SARALASH — vaziyat-kartalar havzasi + 4 metrika-ustun === */
        /* Rang-akcentlar: dau=ko'k · ret=indigo · churn=amber · ns=oltin (yashil FAQAT muvaffaqiyat) */
        .msort { display: flex; flex-direction: column; gap: clamp(10px,1.6vw,14px); }
        .msort-pool { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; min-height: 48px; }
        .msort-card { display: inline-flex; align-items: center; gap: 9px; font-family: 'Source Serif 4', serif; font-size: clamp(13.5px,1.8vw,16px); font-weight: 500; color: ${T.ink}; background: linear-gradient(180deg, #fff, #F5F2FE); border: none; border-radius: 12px; padding: 11px 16px; cursor: pointer; box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.24), inset 0 0 0 1.5px ${T.line}; transition: transform 0.16s, box-shadow 0.18s, background 0.2s; }
        .msort-card-ic { font-size: 18px; line-height: 1; }
        .msort-card:hover:not(.sel) { transform: translateY(-2px); box-shadow: 0 14px 26px -8px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.accent}55; }
        .msort-card:active { transform: scale(0.96); }
        .msort-card.sel { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 10px 22px -8px rgba(91,61,230,0.34), inset 0 0 0 2px ${T.accent}; }
        .msort-pool-done { font-family: 'Manrope'; font-size: 13px; color: ${T.success}; font-weight: 700; align-self: center; }
        .msort-hint { text-align: center; color: ${T.ink3}; min-height: 16px; }
        .msort-cols { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: clamp(8px,1.4vw,12px); align-items: start; }
        @media (max-width: 900px) { .msort-cols { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 520px) { .msort-cols { grid-template-columns: 1fr; } }
        .msort-col { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 14px; border-top: 4px solid var(--mc); padding: 12px 12px 13px; cursor: pointer; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.18), inset 0 0 0 1.5px ${T.line}; transition: box-shadow 0.2s, transform 0.16s, background 0.2s; min-width: 0; }
        .msort-col.dau { --mc: ${T.blue}; --mcs: ${T.blueSoft}; --mct: ${T.blue}; }
        .msort-col.ret { --mc: ${T.accent}; --mcs: ${T.accentSoft}; --mct: ${T.accent}; }
        .msort-col.churn { --mc: #E8A13A; --mcs: #FBEED6; --mct: #B77A16; }
        .msort-col.ns { --mc: #F5A623; --mcs: #FFF3DA; --mct: #B7770D; }
        .msort-col-h { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 3px; }
        .msort-ic { font-size: clamp(20px,3vw,26px); line-height: 1; width: clamp(38px,5.6vw,46px); height: clamp(38px,5.6vw,46px); display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--mcs); }
        .msort-nm { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(14px,1.8vw,16.5px); color: ${T.ink}; }
        .msort-short { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: var(--mct); }
        .msort-slot { align-self: stretch; text-align: center; font-family: 'Manrope'; font-size: 12px; color: ${T.ink3}; font-style: italic; border: 1.5px dashed ${T.ink3}66; border-radius: 9px; padding: 9px 10px; transition: border-color 0.2s, background 0.2s; }
        /* tanlangan karta bor — drop-zona puls-halo (indigo glow) */
        .msort-col.droppable { box-shadow: 0 8px 20px -8px rgba(91,61,230,0.28), inset 0 0 0 2px ${T.accent}66; animation: mmx-halo 1.4s ease-in-out infinite; }
        .msort-col.droppable:hover { transform: translateY(-2px); background: #FBFAFE; }
        .msort-col.droppable .msort-slot { border-color: ${T.accent}88; background: ${T.accentSoft}44; }
        /* to'g'ri tushdi — snap-pop yashil */
        .msort-col.on { cursor: default; background: linear-gradient(180deg, #fff, #FBFEF9); box-shadow: 0 10px 24px -8px rgba(18,169,104,0.26), inset 0 0 0 1.5px ${T.success}55; animation: msort-pop 0.44s cubic-bezier(.34,1.5,.4,1); }
        @keyframes msort-pop { 0% { transform: scale(0.97); } 45% { transform: scale(1.03) translateY(-3px); } 100% { transform: scale(1); } }
        .msort-chipin { display: inline-flex; align-items: center; gap: 6px; align-self: center; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.success}; background: ${T.successSoft}; border-radius: 9px; padding: 7px 11px; text-align: center; animation: match-snap 0.42s cubic-bezier(.34,1.55,.4,1); min-width: 0; overflow-wrap: anywhere; }
        .msort-chipin b { flex-shrink: 0; }
        /* noto'g'ri ustun bosildi — haqiqiy xato: qisqa qizil silkinish, karta havzada qoladi */
        .msort-col.miss { animation: msort-shake 0.45s ease; box-shadow: 0 8px 20px -8px rgba(229,72,77,0.3), inset 0 0 0 2px ${T.err}88; }
        @keyframes msort-shake { 0%,100% { transform: translateX(0); } 22% { transform: translateX(-6px); } 44% { transform: translateX(5px); } 66% { transform: translateX(-3px); } 84% { transform: translateX(2px); } }
        .msort-def { margin: 0; font-family: 'Manrope'; font-size: clamp(12px,1.4vw,13.5px); color: ${T.ink2}; line-height: 1.45; } .msort-def b { color: ${T.ink}; }
        @media (prefers-reduced-motion: reduce) { .msort-col.on, .msort-col.miss, .msort-col.droppable, .msort-chipin { animation: none; } .msort-card:hover:not(.sel), .msort-card:active, .msort-col.droppable:hover { transform: none; } }

        /* === 🎲 K5 BASHORAT-STAVKA (unscored — qizil YO'Q: g'olib yashil, qolgani neytral indigo) === */
        .kbet { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        .kbet::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}, ${T.blue}); }
        .kbet-q { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(18px,2.8vw,26px); color: ${T.ink}; margin: 0; max-width: 560px; }
        .kbet-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .kbet-chip { display: inline-flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; background: linear-gradient(180deg, #fff, #F5F2FE); border: none; border-radius: 99px; padding: 12px 20px; cursor: pointer; box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.24), inset 0 0 0 1.5px ${T.line}; transition: transform 0.16s, box-shadow 0.2s; }
        .kbet-ic { font-size: 20px; line-height: 1; }
        .kbet-chip:hover { transform: translateY(-2px); box-shadow: 0 14px 28px -8px rgba(91,61,230,0.34), inset 0 0 0 1.5px ${T.accent}66, 0 0 18px rgba(110,75,255,0.28); }
        .kbet-chip:active { transform: scale(0.94); }
        .kbet-sub { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
        /* natija-chip: bashorat to'g'ri — yashil ✓; boshqacha — neytral indigo (ball emas) */
        .kbet-res { align-self: center; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 8px 16px; max-width: 100%; overflow-wrap: anywhere; }
        .kbet-res.win { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}44; animation: msort-pop 0.44s cubic-bezier(.34,1.5,.4,1); }
        @media (prefers-reduced-motion: reduce) { .kbet-chip:hover, .kbet-chip:active { transform: none; } .kbet-res.win { animation: none; } }

        /* === 📟 MINI-PULT STRIP — «jonli pult» ekranlar bo'ylab o'sadi (s1 panel-demo uslubdoshi) === */
        .mpult { position: fixed; left: 14px; bottom: 84px; z-index: 950; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
        .mpult-head { display: inline-flex; align-items: center; gap: 8px; background: ${T.paper}; border: none; border-radius: 99px; padding: 8px 13px; cursor: pointer; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.line}; transition: transform 0.18s, box-shadow 0.2s; }
        .mpult-head:hover { transform: translateY(-2px); box-shadow: 0 12px 26px -8px rgba(91,61,230,0.32), inset 0 0 0 1.5px ${T.accent}55; }
        .mpult-ic { font-size: 15px; line-height: 1; }
        .mpult-dots { display: inline-flex; gap: 5px; }
        .mpult-cnt { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .mpult-body { position: relative; width: 232px; max-width: calc(100vw - 28px); background: ${T.paper}; border-radius: 14px; padding: 12px 14px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 16px 38px -12px rgba(${T.shadowBase},0.36), inset 0 0 0 1.5px ${T.line}; }
        .mpult-ttl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .mpult-hint { font-family: 'Manrope'; font-size: 11.5px; color: ${T.ink3}; font-style: italic; }
        .mpult-hint.ok { color: ${T.success}; font-weight: 700; font-style: normal; }
        /* plamp — pult-chiroq qatori (MiniPult + solo-podium umumiy tili) */
        .plamp { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .plamp-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.ink3}55; flex-shrink: 0; transition: background 0.25s, box-shadow 0.25s; }
        .plamp-dot.sm { width: 7px; height: 7px; }
        .plamp.on .plamp-dot, .plamp-dot.on { background: ${T.success}; box-shadow: 0 0 8px rgba(18,169,104,0.65); animation: mlive-pulse 1.8s ease-in-out infinite; }
        .plamp-lbl { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .plamp.on .plamp-lbl { color: ${T.ink}; }
        .plamp-st { font-size: 9.5px; font-weight: 800; letter-spacing: 0.06em; color: ${T.ink3}; white-space: nowrap; }
        .plamp.on .plamp-st { color: ${T.success}; }
        @media (max-width: 760px) { .mpult { left: 8px; bottom: 76px; } }
        @media (prefers-reduced-motion: reduce) { .plamp.on .plamp-dot, .plamp-dot.on { animation: none; } .mpult-head:hover { transform: none; } }

        /* === 🧮 CALCW (koding jonli retention-hisob vidjeti) === */
        .calcw { background: ${T.paper}; border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); min-width: 0; }
        .calcw-row { display: flex; gap: 8px; }
        .calcw-f { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
        .calcw-f span { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink3}; }
        .calcw-f input { width: 100%; min-width: 0; font-weight: 700; font-size: 15px; color: ${T.ink}; border: none; border-radius: 9px; padding: 8px 10px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.2s; }
        .calcw-f input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        /* terminal-qator — VS Code-mockup bilan bitta olamdan */
        .calcw-term { display: flex; align-items: baseline; gap: 8px; background: #1E1E1E; color: #8B949E; border-radius: 10px; padding: 10px 13px; font-size: clamp(12px,1.4vw,13.5px); overflow-x: auto; white-space: nowrap; transition: color 0.25s; }
        .calcw-term.on { color: #4EC9B0; }
        .calcw-term b { color: #FFD70A; font-size: 1.15em; }
        .calcw-ps { color: #6E7681; flex-shrink: 0; }
        .calcw-wait { color: #6E7681; font-style: italic; }

        /* === solo o'z-tekshiruv kartalari (recap 3-qadam) + solo-podium === */
        .qa-card.tap { border: none; cursor: pointer; text-align: left; font-family: 'Manrope', sans-serif; }
        .qa-card.tap.open { box-shadow: inset 0 0 0 1.5px ${T.success}55; cursor: default; }
        .qa-tap { font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.accent}; }
        .qa-ans { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.success}; background: ${T.successSoft}; border-radius: 9px; padding: 7px 10px; line-height: 1.4; overflow-wrap: anywhere; }
        .spod-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); width: 100%; max-width: 640px; }
        @media (max-width: 620px) { .spod-grid { grid-template-columns: 1fr; } }
        .spod-card { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .spod-badges { display: flex; flex-wrap: wrap; gap: 6px; }
        .spod-badge { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; background: ${T.bg}; border-radius: 99px; padding: 5px 11px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .spod-badge.got { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}44; }

        /* === NORTH STAR VALIDATOR (s5 + ustaxona mini) === */
        .nstar-editor { background: ${T.paper}; border-radius: 14px; border-left: 4px solid ${T.ink3}; padding: 15px 17px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.14); transition: border-color 0.3s, box-shadow 0.3s, background 0.3s; }
        /* North Star belgilanganda — yumshoq oltin porlash (yulduz-karta hissi) */
        .nstar-editor.ok { border-left-color: #F5A623; background: linear-gradient(180deg, #FFFDF6, #FFF8E9); box-shadow: 0 12px 28px -8px rgba(245,166,35,0.32), inset 0 0 0 1.5px #F5A62333; animation: nstar-gold 0.7s ease-out; }
        @keyframes nstar-gold { 0% { box-shadow: 0 0 0 0 rgba(245,166,35,0); } 45% { box-shadow: 0 0 0 9px rgba(245,166,35,0.16); } 100% { box-shadow: 0 12px 28px -8px rgba(245,166,35,0.32), inset 0 0 0 1.5px #F5A62333; } }
        .nstar-editor.ok .nstar-lead { color: #B7770D; text-shadow: 0 0 12px rgba(245,166,35,0.4); }
        .nstar-editor.mini { padding: 12px 14px; gap: 7px; }
        .nstar-lead { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.04em; color: ${T.accent}; transition: color 0.3s; }
        @media (prefers-reduced-motion: reduce) { .nstar-editor.ok { animation: none; } }
        .nstar-input { font-family: 'Manrope'; font-weight: 500; font-size: 14.5px; color: ${T.ink}; border: none; border-radius: 10px; padding: 11px 13px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; resize: vertical; line-height: 1.5; min-width: 0; overflow-wrap: anywhere; word-break: break-word; }
        .nstar-input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        /* === 📟 NORTH STAR HOLAT-PANELI (s5, 28-qonun split-layout) — chiroqlar + ● JONLI === */
        .mxlamps { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .mxlamp { display: flex; align-items: center; gap: 10px; background: ${T.bg}; border-radius: 11px; padding: 10px 12px; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: background 0.25s, box-shadow 0.25s; }
        .mxlamp.on { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .mxlamp-dot { width: 12px; height: 12px; border-radius: 50%; background: ${T.ink3}55; flex-shrink: 0; transition: background 0.25s, box-shadow 0.25s; }
        .mxlamp.on .mxlamp-dot { background: ${T.success}; box-shadow: 0 0 10px rgba(18,169,104,0.65); animation: mxlamp-pop 0.4s cubic-bezier(.3,1.5,.45,1); }
        @keyframes mxlamp-pop { 0% { transform: scale(0.4); } 55% { transform: scale(1.5); } 100% { transform: scale(1); } }
        .mxlamp-lbl { flex: 1; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; min-width: 0; }
        .mxlamp-st { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; color: ${T.ink3}; white-space: nowrap; }
        .mxlamp.on .mxlamp-st { color: ${T.success}; }
        .mxlamp-hint { font-family: 'Manrope'; font-size: 12px; color: ${T.ink3}; font-style: italic; }
        .mlive.big { margin-left: 0; align-self: flex-start; font-size: 13px; padding: 6px 14px; animation: mlive-in 0.45s cubic-bezier(.3,1.5,.45,1), mlive-pulse 1.8s ease-in-out 0.5s infinite; }
        @media (prefers-reduced-motion: reduce) { .mxlamp.on .mxlamp-dot { animation: none; } .mlive.big { animation: none; } }

        /* === METRIKA-KARTA USTAXONA (ask/gipoteza) === */
        .mwcard-ask, .mwcard-hyp { display: flex; flex-direction: column; gap: 4px; }
        .mwcard-ask > span, .mwcard-hyp > span { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.06em; color: ${T.ink3}; }
        .mwcard-ask select { font-family: 'Manrope'; font-weight: 500; font-size: 13.5px; color: ${T.ink}; border: none; border-radius: 9px; padding: 9px 11px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; cursor: pointer; }
        .mwcard-ask.on select { box-shadow: inset 0 0 0 1.5px ${T.success}66; background: ${T.paper}; }
        .mwcard-hyp input { font-family: 'Manrope'; font-weight: 500; font-size: 13.5px; color: ${T.ink}; border: none; border-radius: 9px; padding: 9px 11px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; }
        .mwcard-hyp input:focus { box-shadow: inset 0 0 0 1.5px ${T.blue}; }

        /* === MATCHPAIRS (s9 TEST-3) — 27-qonun: vizual boyitilgan, BALL-MANTIQ TEGILMAGAN === */
        .mmx-wrap { position: relative; display: flex; flex-direction: column; gap: clamp(14px,2.2vw,20px); }
        /* fon-dekor: dars atamalaridan xira tokenlar (dekor o'qitadi) */
        .mmx-decor { position: absolute; inset: -10px; pointer-events: none; z-index: 0; overflow: hidden; }
        .mmx-t { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: rgba(91,61,230,0.065); user-select: none; white-space: nowrap; }
        .mmx-t.md0 { left: 1%; top: 2%; font-size: 26px; transform: rotate(-9deg); }
        .mmx-t.md1 { right: 3%; top: 10%; font-size: 30px; transform: rotate(6deg); }
        .mmx-t.md2 { left: 40%; top: 40%; font-size: 24px; transform: rotate(-4deg); }
        .mmx-t.md3 { left: 4%; bottom: 8%; font-size: 20px; transform: rotate(7deg); }
        .mmx-t.md4 { right: 6%; bottom: 16%; font-size: 22px; transform: rotate(-6deg); }
        .mmx-t.md5 { right: 28%; top: 26%; font-size: 20px; transform: rotate(4deg); }
        .match-pool { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; min-height: 50px; }
        /* chip — kattaroq, emoji + gradient-fon + soya; hover'da ko'tarilib qiyshayadi */
        .match-chip { display: inline-flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.9vw,16px); padding: 12px 18px; border-radius: 13px; border: none; background: linear-gradient(180deg, #fff, #F5F2FE); color: ${T.ink}; cursor: grab; box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.26), inset 0 0 0 1.5px ${T.line}; transition: transform 0.16s, box-shadow 0.18s; }
        .match-chip-ic { font-size: 20px; line-height: 1; }
        .match-chip-ic.sm { font-size: 15px; margin-right: 5px; }
        .match-chip:hover:not(:disabled) { transform: translateY(-2px) rotate(-1.5deg) scale(1.02); box-shadow: 0 14px 26px -8px rgba(${T.shadowBase},0.32), inset 0 0 0 1.5px ${T.accent}55; }
        .match-chip:disabled { cursor: default; }
        .match-chip.sel { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 10px 22px -8px rgba(91,61,230,0.34), inset 0 0 0 2px ${T.accent}; }
        /* sudrashda tilt + lift (HTML5 drag — asl element qiyshayadi) */
        .match-chip.dragging { opacity: 0.85; transform: scale(1.07) rotate(3deg); cursor: grabbing; box-shadow: 0 18px 32px -10px rgba(91,61,230,0.4), inset 0 0 0 2px ${T.accent}; }
        .match-pool-empty { font-family: 'Manrope'; font-size: 13px; color: ${T.success}; font-weight: 700; }
        .match-hint { position: relative; z-index: 1; text-align: center; color: ${T.ink3}; min-height: 16px; }
        .match-targets { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 10px; }
        .match-target { display: flex; align-items: center; gap: 12px; background: ${T.paper}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16), inset 0 0 0 1.5px ${T.line}; cursor: pointer; transition: box-shadow 0.2s, background 0.2s, transform 0.16s; }
        /* chip qo'yilgan nishon — nozik indigo halqa (JTBD .mp-target.filled bilan izchil) */
        .match-target.filled { box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.accent}44; }
        /* tanlangan/sudralayotgan chip uchun drop-zona puls-halo (indigo glow) */
        .match-target.droppable { box-shadow: 0 8px 20px -8px rgba(91,61,230,0.28), inset 0 0 0 2px ${T.accent}66; animation: mmx-halo 1.4s ease-in-out infinite; }
        .match-target.droppable:hover { transform: translateY(-2px); background: ${T.accentSoft}; box-shadow: 0 12px 26px -8px rgba(91,61,230,0.36), inset 0 0 0 2px ${T.accent}; }
        @keyframes mmx-halo { 0%,100% { box-shadow: 0 8px 20px -8px rgba(91,61,230,0.28), inset 0 0 0 2px ${T.accent}66; } 50% { box-shadow: 0 12px 32px -6px rgba(110,75,255,0.5), inset 0 0 0 2.5px ${T.accentVivid}; } }
        .match-target.ok { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}66; animation: match-target-pop 0.44s cubic-bezier(.34,1.5,.4,1); }
        @keyframes match-target-pop { 0% { transform: scale(1); } 40% { transform: scale(1.015) translateY(-2px); } 100% { transform: scale(1); } }
        .match-target.bad { background: ${T.errSoft}; box-shadow: inset 0 0 0 1.5px ${T.err}66; }
        .match-target-q { flex: 1; font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.9vw,17px); color: ${T.ink}; line-height: 1.35; }
        .match-slot { position: relative; flex-shrink: 0; min-width: clamp(110px,22vw,150px); display: flex; justify-content: center; }
        .match-slot-chip { display: inline-flex; align-items: center; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; padding: 8px 12px; border-radius: 9px; background: ${T.accentSoft}; color: ${T.accent}; white-space: nowrap; animation: match-snap 0.38s cubic-bezier(.3,1.5,.4,1); }
        .match-slot-chip.ok { background: ${T.success}; color: #fff; animation: match-snap 0.42s cubic-bezier(.34,1.55,.4,1); }
        @keyframes match-snap { 0% { transform: scale(0.68); } 48% { transform: scale(1.18); } 100% { transform: scale(1); } }
        .match-slot-chip.bad { background: ${T.err}; color: #fff; }
        .match-slot-empty { font-family: 'Manrope'; font-size: 12px; color: ${T.ink3}; font-style: italic; border: 1.5px dashed ${T.ink3}66; border-radius: 9px; padding: 8px 14px; }
        /* to'g'ri juftlik ochilganda mini yulduzcha-burst (reveal bayrami) */
        .mmx-burst { position: absolute; top: 50%; left: 50%; width: 0; height: 0; pointer-events: none; z-index: 5; }
        .mmx-burst span { position: absolute; left: -6px; top: -6px; font-size: 12px; color: #F5A623; text-shadow: 0 0 8px rgba(245,166,35,0.7); opacity: 0; transform: rotate(var(--ba)) translateY(0) scale(0.4); animation: mmx-burst-fly 0.8s ease-out 0.1s forwards; }
        @keyframes mmx-burst-fly { 0% { opacity: 0; transform: rotate(var(--ba)) translateY(0) scale(0.4); } 30% { opacity: 1; } 100% { opacity: 0; transform: rotate(var(--ba)) translateY(-42px) scale(1); } }
        @media (prefers-reduced-motion: reduce) { .match-target.ok, .match-target.droppable, .match-slot-chip, .match-slot-chip.ok, .match-chip.dragging { animation: none; } .mmx-burst { display: none; } .match-chip:hover:not(:disabled) { transform: none; } }
        .hook-hero { display: flex; justify-content: center; }
        .hook-cup { font-size: clamp(48px,10vw,86px); line-height: 1; filter: drop-shadow(0 10px 18px rgba(91,61,230,0.28)); animation: float-sm 2.6s ease-in-out infinite; }
        @keyframes float-sm { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-8px) rotate(3deg); } }

        .h-title { font-size: clamp(22px,4vw,38px); }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
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
        .card.hw { min-width: 0; overflow-wrap: anywhere; word-break: break-word; }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }

        /* === bb-dots (kod-muharrir sarlavhasi) === */
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }

        /* === 📟 MAQSAD IMZO-SAHNA: «BOSHQARUV PANELI JONLANADI» (Metrics identiteti, 23-qonun) === */
        .mdash-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(10px,1.8vw,16px); }
        @media (max-width: 760px) { .mdash-grid { grid-template-columns: 1fr; } }
        .mdash-card { position: relative; display: flex; flex-direction: column; gap: 6px; background: linear-gradient(180deg, #fff, #FBFAFE); border-radius: 16px; padding: 14px 16px 12px; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; overflow: hidden; opacity: 0; animation: mdash-in 0.5s ease-out forwards; animation-delay: var(--cd, 0s); }
        .mdash-card::before { content: ""; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(180deg, transparent 0 26px, ${T.line}44 26px 27px); opacity: 0.6; }
        .mdash-card::after { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}); }
        @keyframes mdash-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .mdash-top { position: relative; display: flex; align-items: center; gap: 7px; }
        .mdash-ic { font-size: clamp(17px,2.2vw,21px); line-height: 1; }
        .mdash-nm { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); letter-spacing: 0.04em; color: ${T.ink2}; }
        .mdash-num { position: relative; font-size: clamp(30px,4.6vw,42px); font-weight: 700; line-height: 1; color: ${T.accent}; font-variant-numeric: tabular-nums; }
        .mdash-what { position: relative; font-family: 'Manrope'; font-weight: 600; font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink3}; }
        .mdash-spark { position: relative; width: 100%; height: clamp(26px,3.6vw,34px); margin-top: 4px; }
        .mdash-line { fill: none; stroke: ${T.accentVivid}; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 170; stroke-dashoffset: 170; animation: mdash-draw 1.1s ease-out forwards; animation-delay: var(--sd, 0.5s); filter: drop-shadow(0 2px 4px rgba(110,75,255,0.35)); }
        @keyframes mdash-draw { to { stroke-dashoffset: 0; } }
        .mdash-cap { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; text-align: center; opacity: 0; animation: fade-in-up 0.5s ease-out forwards; animation-delay: 3.6s; }
        /* ● JONLI indikatori — Metrics imzo-chipi (maqsad-preview + ustaxona karta-tasdig'i + koding-preview) */
        .mlive { margin-left: auto; flex-shrink: 0; display: inline-flex; align-items: center; font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.08em; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 3px 10px; }
        .mdash-card .mlive { opacity: 0; animation: mlive-in 0.45s cubic-bezier(.3,1.5,.45,1) forwards, mlive-pulse 1.8s ease-in-out infinite; animation-delay: var(--ld, 1.6s), calc(var(--ld, 1.6s) + 0.5s); }
        .mlive.mini { font-size: 9.5px; padding: 2px 8px; animation: mlive-in 0.4s cubic-bezier(.3,1.5,.45,1), mlive-pulse 1.8s ease-in-out 0.4s infinite; }
        @keyframes mlive-in { 0% { opacity: 0; transform: scale(0.5); } 60% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes mlive-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(18,169,104,0.35); } 50% { box-shadow: 0 0 0 5px rgba(18,169,104,0); } }
        @media (prefers-reduced-motion: reduce) {
          .mdash-card, .mdash-cap { animation: none; opacity: 1; transform: none; }
          .mdash-line { animation: none; stroke-dashoffset: 0; }
          .mdash-card .mlive, .mlive.mini { animation: none; opacity: 1; }
        }

        /* === 🍽️ OSHXONA HAFTALIGI (s2 muhokama mini-sahnasi) — kun-katak flip: keldi vs yana oldi === */
        .oshx { display: flex; flex-direction: column; gap: 10px; }
        .oshx-week { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: clamp(8px,1.4vw,12px); }
        @media (max-width: 560px) { .oshx-week { grid-template-columns: repeat(2, 1fr); } }
        .oshx-day { position: relative; background: none; border: none; padding: 0; cursor: pointer; perspective: 800px; min-height: clamp(122px,15vw,142px); }
        .oshx-day:disabled { cursor: default; }
        .oshx-inner { position: absolute; inset: 0; display: block; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(.3,1.3,.4,1); }
        .oshx-day.open .oshx-inner { transform: rotateX(180deg); }
        .oshx-day:not(.open):hover .oshx-inner { transform: rotateX(14deg); }
        .oshx-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: 14px; padding: 9px 10px; }
        .oshx-front { background: ${T.paper}; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.line}; }
        .oshx-back { transform: rotateX(180deg); background: linear-gradient(180deg, #fff, #FBFAFE); box-shadow: 0 10px 24px -8px rgba(91,61,230,0.24), inset 0 0 0 1.5px ${T.accent}55; align-items: stretch; justify-content: center; }
        .oshx-d { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 8px; padding: 2px 9px; }
        .oshx-d.back { align-self: center; margin-bottom: 2px; }
        .oshx-plate { font-size: clamp(24px,3.6vw,30px); line-height: 1; }
        .oshx-q { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 15px; color: ${T.ink3}; }
        .oshx-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(12px,1.5vw,13.5px); color: ${T.ink}; font-variant-numeric: tabular-nums; }
        .oshx-n.keldi { color: ${T.blue}; } .oshx-n.qayt { color: ${T.accent}; }
        .oshx-bar { display: block; height: 6px; border-radius: 99px; background: ${T.bg}; position: relative; overflow: hidden; }
        .oshx-bar::after { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: var(--w, 0%); border-radius: 99px; transform-origin: left; animation: oshx-bar-in 0.7s cubic-bezier(.3,1,.4,1) both 0.15s; }
        .oshx-bar.keldi::after { background: ${T.blue}; } .oshx-bar.qayt::after { background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}); }
        @keyframes oshx-bar-in { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .oshx-day.taphint .oshx-front { animation: oshx-hint 2.4s ease-in-out infinite; }
        .oshx-week .oshx-day.taphint:nth-child(2) .oshx-front { animation-delay: 0.3s; } .oshx-week .oshx-day.taphint:nth-child(3) .oshx-front { animation-delay: 0.6s; } .oshx-week .oshx-day.taphint:nth-child(4) .oshx-front { animation-delay: 0.9s; } .oshx-week .oshx-day.taphint:nth-child(5) .oshx-front { animation-delay: 1.2s; }
        @keyframes oshx-hint { 0%,86%,100% { box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.line}; } 93% { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.32), inset 0 0 0 2px ${T.accent}66; transform: translateY(-2px); } }
        .oshx-cap { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12px,1.4vw,13.5px); color: ${T.ink2}; text-align: center; }
        @media (prefers-reduced-motion: reduce) {
          .oshx-inner { transition: none; }
          .oshx-day.taphint .oshx-front { animation: none; }
          .oshx-day:not(.open):hover .oshx-inner { transform: none; }
          .oshx-bar::after { animation: none; transform: scaleX(1); }
        }

        /* === PROYEKTOR SAVOL + MISOL (yadro) === */
        .proj-q { background: ${T.paper}; border-radius: 14px; padding: clamp(16px,2.5vw,22px); box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); display: flex; flex-direction: column; gap: 8px; border-left: 4px solid ${T.accent}; }
        .proj-q-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .proj-q-body { font-size: clamp(16px,2.3vw,20px); font-weight: 500; color: ${T.ink}; line-height: 1.4; margin: 0; }
        .broken-cue { font-size: 13px; color: ${T.ink2}; margin: 0; font-weight: 600; }

        /* === K5 SLAYD (s4) === */
        .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        .k-slide::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}, ${T.blue}); }
        .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
        .k-slide-ic { font-size: clamp(40px,7vw,64px); line-height: 1; }
        .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(20px,3.2vw,30px); color: ${T.ink}; margin: 0; }
        .k-slide-body { font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; } .k-slide-body b { color: ${T.ink}; }
        .k-dots { display: flex; gap: 8px; justify-content: center; }
        .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }

        /* === STORY MINI-EDITOR / USTAXONA === */
        .smini, .swcard { background: ${T.paper}; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); border-left: 4px solid ${T.ink3}; transition: border-color 0.25s, box-shadow 0.25s; min-width: 0; }
        /* Ustaxonada 3 karta — «dashboard-panel» hissi: burchakda mini-ekran (o'suvchi trend-chizig'i) */
        .swcard { position: relative; }
        .swcard::before { content: ""; position: absolute; top: 13px; right: 14px; width: 48px; height: 17px; border-radius: 5px; background: ${T.bg} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 34'%3E%3Cpolyline points='6,26 28,20 50,23 72,12 94,15 114,6' fill='none' stroke='%235B3DE6' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='114' cy='6' r='4.5' fill='%23F5A623'/%3E%3C/svg%3E") no-repeat center / 34px 11px; box-shadow: inset 0 0 0 1px ${T.line}; opacity: 0.9; pointer-events: none; }
        .swcard.ok::before { background-color: ${T.successSoft}; box-shadow: inset 0 0 0 1px ${T.success}44; }
        .col > .swcard + .swcard { margin-top: 4px; }
        .smini.ok, .swcard.ok { border-left-color: ${T.success}; box-shadow: 0 8px 20px -8px rgba(18,169,104,0.28); animation: card-fill-pop 0.42s cubic-bezier(.34,1.5,.4,1); }
        @keyframes card-fill-pop { 0% { transform: scale(1); } 40% { transform: scale(1.012) translateY(-2px); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .smini.ok, .swcard.ok { animation: none; } }
        .smini-h, .swcard-h { display: flex; align-items: center; gap: 10px; }
        .smini-n, .swcard-n { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .smini-sent, .swcard-sent { font-size: clamp(13px,1.6vw,15px); color: ${T.ink2}; line-height: 1.4; min-width: 0; overflow-wrap: anywhere; word-break: break-word; } .smini-sent b, .swcard-sent b { color: ${T.ink}; }
        .smini-fields, .swcard-fields { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        @media (max-width: 620px) { .smini-fields, .swcard-fields { grid-template-columns: 1fr; } }
        .smini-f { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .smini-f span { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.06em; color: ${T.ink3}; }
        .smini-f.kim span { color: ${T.blue}; } .smini-f.nima span { color: #B77A16; } .smini-f.natija span { color: ${T.success}; }
        .smini-f input { font-family: 'Manrope'; font-weight: 500; font-size: 14px; color: ${T.ink}; border: none; border-radius: 9px; padding: 9px 11px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.18s; width: 100%; }
        .smini-f input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .smini-f.on input { box-shadow: inset 0 0 0 1.5px ${T.success}66; background: ${T.paper}; }
        /* === RO'YXAT / CHECKLIST === */
        .checklist { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 9px; }
        .stcheck { display: flex; align-items: center; gap: 10px; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; font-weight: 500; }
        .stcheck-box { width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}55; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #fff; transition: all 0.2s; }
        .stcheck.on { color: ${T.ink}; } .stcheck.on .stcheck-box { background: ${T.success}; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }

        /* === 🎯 TOPSHIRIQ-PANEL (TaskSpec) — shartlarning yagona vizual tili (P0'dan AYNAN) === */
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
        @keyframes hc-cond-pop { 0% { transform: scale(1); } 42% { transform: scale(1.015) translateY(-1px); } 100% { transform: scale(1); } }
        .tspec-box { width: 21px; height: 21px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}55; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 800; color: ${T.ink3}; transition: all 0.2s; }
        .tspec-chip.on .tspec-box { background: ${T.success}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        .tspec-lbl { font-weight: 700; font-size: clamp(12px,1.4vw,13.5px); color: ${T.ink2}; overflow-wrap: anywhere; }
        .tspec-chip.on .tspec-lbl { color: ${T.ink}; }
        .tspec-car { font-size: 10px; color: ${T.ink3}; flex-shrink: 0; }
        .tspec-detail { margin: 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; background: ${T.accentSoft}; border-radius: 9px; padding: 8px 11px; overflow-wrap: anywhere; min-width: 0; }
        @media (prefers-reduced-motion: reduce) { .tspec-chip.on, .tspec-chip.on .tspec-box { animation: none; } }

        /* 31-qonun: mentorga «kim bajaradi» bir-qatorlik yozuvi */
        .mwatch { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; background: ${T.blueSoft}; border-left: 3px solid ${T.blue}; border-radius: 9px; padding: 8px 12px; align-self: flex-start; }
        .mwatch b { color: ${T.ink}; }

        /* Muvaffaqiyat = bitta-qatorlik chip (paragraf-ramka EMAS) */
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }

        /* === YORDAM + YULDUZCHA — bitta qatordagi 2 ixcham yig'ma-chip (25-qonun matn-diyeta) === */
        .wsx-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-start; }
        .wsx { flex: 1; min-width: 170px; background: ${T.bg}; border: 1.5px dashed ${T.ink3}66; border-radius: 12px; overflow: hidden; }
        .wsx.star { border-color: ${T.blue}66; }
        .wsx-toggle { width: 100%; text-align: left; background: none; border: none; padding: 10px 13px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; cursor: pointer; }
        .wsx.star .wsx-toggle { color: ${T.blue}; }
        .wsx-body { padding: 0 13px 11px; display: flex; flex-direction: column; gap: 6px; animation: fade-step 0.25s ease-out; }
        .wsx-body p { font-size: 13px; color: ${T.ink2}; margin: 0; line-height: 1.45; } .wsx-body b { color: ${T.ink}; }
        /* karta-progress (n/4) — «● JONLI» yonguncha */
        .swcard-prog { margin-left: auto; flex-shrink: 0; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11px; color: ${T.ink3}; background: ${T.bg}; border-radius: 99px; padding: 3px 9px; }
        .star-task { background: ${T.blueSoft}; border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 5px; }

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

        /* === ⚛️ KODING (s10): VS Code-mockup + jonli MetrikaPanel-preview + qadam-checklist === */
        .vsc { background: #1E1E1E; border-radius: 14px; overflow: hidden; box-shadow: 0 14px 30px -10px rgba(${T.shadowBase},0.35); }
        .vsc-bar { background: #252526; display: flex; align-items: center; gap: 2px; padding-right: 8px; }
        .vsc-tab { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: #8B949E; background: #2D2D2D; padding: 9px 14px; display: inline-flex; align-items: center; gap: 6px; }
        .vsc-tab.on { background: #1E1E1E; color: #E6EDF3; box-shadow: inset 0 2px 0 #007ACC; }
        .vsc-copy { margin-left: auto; background: #0E639C; color: #fff; border: none; border-radius: 8px; padding: 6px 12px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; cursor: pointer; transition: background 0.18s, transform 0.18s; flex-shrink: 0; }
        .vsc-copy:hover { background: #1177BB; transform: translateY(-1px); }
        .vsc-copy.ok { background: ${T.success}; }
        .vsc-body { padding: 12px 14px 14px 6px; font-family: 'JetBrains Mono', monospace; font-size: clamp(11px,1.35vw,12.5px); color: #D4D4D4; line-height: 1.85; overflow-x: auto; }
        .vsc-line { display: flex; align-items: baseline; min-width: max-content; }
        .vsc-ln { color: #6E7681; min-width: 26px; text-align: right; margin-right: 14px; font-size: 10.5px; flex-shrink: 0; user-select: none; }
        .vsc-code { white-space: pre; }
        /* Jonli natija-preview — o'quvchining REAL panel-kartalari «brauzerda», foiz CountUp bilan jonlanadi */
        .mxprev { background: ${T.paper}; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.2); }
        .mxprev-bar { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #F7F5FD; border-bottom: 1px solid ${T.line}; }
        .mxprev-url { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink3}; background: ${T.paper}; border-radius: 99px; padding: 4px 12px; box-shadow: inset 0 0 0 1px ${T.line}; }
        .mxprev-src { margin-left: auto; font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 3px 10px; }
        .mxprev-body { display: flex; flex-direction: column; gap: 10px; padding: clamp(12px,2vw,18px); }
        .mxprev-head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .mxprev-foiz { font-size: clamp(30px,4.4vw,40px); font-weight: 700; line-height: 1; color: ${T.accent}; font-variant-numeric: tabular-nums; }
        .mxprev-head-t { display: flex; flex-direction: column; gap: 2px; }
        .mxprev-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.05em; color: ${T.ink2}; }
        .mxprev-calc { font-size: 10.5px; color: ${T.ink3}; }
        .mxprev-ns { margin-left: auto; max-width: 46%; font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: #B7770D; background: #FFF3DA; border-radius: 99px; padding: 4px 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .mxprev-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(8px,1.4vw,12px); }
        @media (max-width: 700px) { .mxprev-cards { grid-template-columns: 1fr; } .mxprev-ns { max-width: 100%; margin-left: 0; } }
        .mxprev-card { display: flex; flex-direction: column; gap: 3px; background: #FBFAFE; border-radius: 12px; border-left: 4px solid ${T.accent}; padding: 10px 12px; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.18); min-width: 0; animation: fade-step 0.4s ease-out both; }
        .mxprev-card:nth-child(2) { animation-delay: 0.12s; } .mxprev-card:nth-child(3) { animation-delay: 0.24s; }
        .mxprev-card .mlive.mini { margin-left: 0; align-self: flex-start; }
        .mxprev-card-nm { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; overflow-wrap: anywhere; }
        .mxprev-card-what { font-size: clamp(12px,1.4vw,13px); color: ${T.ink2}; overflow-wrap: anywhere; }
        /* VS Code qadamlari — o'quvchi o'zi belgilaydi */
        .kd-steps { display: flex; flex-direction: column; gap: 8px; }
        .kd-step { display: flex; align-items: flex-start; gap: 10px; text-align: left; width: 100%; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 13px; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.12), inset 0 0 0 1.5px ${T.line}; transition: all 0.18s; }
        .kd-step:hover:not(.on) { transform: translateY(-1px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.accent}44; }
        .kd-step.on { color: ${T.ink}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .kd-check { width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}55; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.ink3}; background: ${T.paper}; transition: all 0.2s; }
        .kd-step.on .kd-check { background: ${T.success}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        .kd-step-t { min-width: 0; line-height: 1.4; }
        @media (prefers-reduced-motion: reduce) { .kd-step.on .kd-check { animation: none; } .mxprev-card { animation: none; } }

        /* === RECAP (s11) — 3 raqamlangan qadam-karta (slide-in) + P0-etalon juftlik-taymer + reflection + savol === */
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
        .pair-mic { display: inline-block; animation: pair-mic-pulse 1.1s ease-in-out infinite; }
        @keyframes pair-mic-pulse { 0%,100% { transform: scale(1); opacity: 0.75; } 50% { transform: scale(1.25); opacity: 1; } }
        .pair-clock { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 22px; color: ${T.ink}; font-variant-numeric: tabular-nums; }
        .pair-prog { position: relative; height: 8px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; }
        .pair-prog-fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 99px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}); transition: width 1s linear; }
        .pair-prog-mid { position: absolute; left: 50%; top: -3px; bottom: -3px; width: 2px; background: ${T.ink3}; border-radius: 2px; }
        .pair-timer-btns { display: flex; gap: 8px; }
        .reflect-input { font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; border: none; border-radius: 10px; padding: 12px 14px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; }
        .reflect-input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .qa-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        @media (max-width: 620px) { .qa-cards { grid-template-columns: 1fr; } }
        .qa-card { background: ${T.bg}; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 8px; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: transform 0.18s, box-shadow 0.18s; }
        .qa-card:hover { transform: translateY(-3px); box-shadow: inset 0 0 0 1.5px ${T.accent}44, 0 10px 22px -8px rgba(${T.shadowBase},0.2); }
        .qa-ic { font-size: 24px; display: inline-block; width: fit-content; }
        .qa-card:hover .qa-ic { animation: qa-wiggle 0.5s ease; }
        @keyframes qa-wiggle { 0%,100% { transform: rotate(0); } 30% { transform: rotate(-14deg) scale(1.12); } 70% { transform: rotate(10deg); } }
        .qa-card p { font-size: 13.5px; color: ${T.ink}; margin: 0; line-height: 1.4; } .qa-card b { color: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) { .pair-mic { animation: none; } .qa-card:hover .qa-ic { animation: none; } .qa-card:hover { transform: none; } }

        /* === UYGA VAZIFA kartalari === */
        .hw-card { border-radius: 14px; padding: clamp(15px,2.4vw,20px); display: flex; flex-direction: column; gap: 10px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); min-width: 0; overflow-wrap: anywhere; word-break: break-word; }
        /* «imzolangan shartnoma-hujjat» — oq indeks-karta + chap-accent hoshiya */
        .hw-card.full { background: ${T.paper}; border-left: 5px solid ${T.accent}; box-shadow: 0 12px 28px -10px rgba(91,61,230,0.28); }
        /* qisqa versiya — ikkilamchi ohang (susaygan, punktir) */
        .hw-card.short { background: ${T.bg}; border: 1.5px dashed ${T.ink3}66; box-shadow: none; }
        .hw-badge { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; padding: 5px 12px; border-radius: 99px; background: ${T.accent}; color: #fff; }
        .hw-badge.short { background: ${T.ink2}; }
        /* Uyga-vazifa SHARTNOMA — tanlov-chiplar */
        .hw-chips { display: flex; flex-wrap: wrap; gap: 10px; }
        .hw-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); padding: 11px 18px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.18), inset 0 0 0 1.5px ${T.line}; transition: all 0.18s; }
        .hw-chip:hover:not(.on) { transform: translateY(-2px); box-shadow: 0 10px 22px -8px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.accent}55; }
        /* tanlangan = to'ldirilgan indigo (aniq holat) */
        .hw-chip.on { background: ${T.accent}; color: #fff; box-shadow: 0 8px 18px -6px rgba(91,61,230,0.4), inset 0 0 0 2px ${T.accent}; }
        .hw-chip.add { color: ${T.accent}; border-style: dashed; box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
        .hw-chip.add.on { background: ${T.accent}; color: #fff; box-shadow: 0 8px 18px -6px rgba(91,61,230,0.4), inset 0 0 0 2px ${T.accent}; }

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
          .stcheck.on .stcheck-box, .lp-done-btn.is-done, .hook-cup { animation: none !important; }
        }
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title="Metrika darsi" />
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







