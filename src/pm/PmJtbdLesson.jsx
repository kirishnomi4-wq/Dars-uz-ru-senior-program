import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM MODULI (7-MODUL) · 2-DARS — JOBS-TO-BE-DONE: ODAMLAR NIMANI SOTIB OLADI? — PM PLATFORM
// Senariy-manba: pm-senariylar/M7-D2-JTBD.md (GATE S tasdiqlangan).
// Mavzu: Jobs-to-be-Done (JTBD) — odamlar mahsulotni emas, u beradigan NATIJAni («ish»ni) sotib oladi;
//        3 ish-turi (funksional/ijtimoiy/emotsional); drel va devordagi rasm (natija); raqobatchi-ish;
//        MVP asosiy vazifasi; K18 Starbucks «uchinchi joy» keysi.
// Artefakt: o'quvchi sinfda 3 ta JTBD-karta chiqaradi (1-kartasi — o'z MVP'i); custdev darsida ishlatiladi.
// V2 (2026-07-25, P0-V4 tuzilmasi): ustaxona BITTALAB-yozish (48-qonun) · tekshiruvchi stoli/mijoz-talabi/
//        prioritet ekranlari (52-qonun) · TestQ test-dizayni (49-qonun) · TaskSpec+MentorWatchLine bekor (51).
// INFRA/PRIMITIVLAR MANBAI: src/pm/PmUserStoryLesson.jsx P0 ETALON (liveRpc/useLiveSession/LiveGate/Stage/NavNext/
//        QuestionScreen/MentorTestStats/RecapOverlay/ScreenPodium/CodeStrike-arena/badges/
//        PRACTICE_BASE sentinel) — FAQAT infra/rels ko'chirilgan, kontent yangi (PM).
// AUDIOSIZ: ovoz (TTS) yo'q — M3+ qarori (useAudio stub, QuestionScreen imzosi saqlangan).
// P0: PM primitivlari birinchi marta shu darsda qurildi — hammasi REUSABLE, props-driven, StrictMode-safe.
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
// LIVE_STALE_MS = 180s (60s EMAS): Chrome fon-tabda setInterval'ni ~1 daqiqagacha bo'g'adi —
// mentor boshqa oynaga o'tsa 60s oynada «o'lik» deb topilib, butun sinf-darvoza ochilib ketardi (F-0726-02).
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
  // select=* — cur_screen (phase11) migratsiyasi hali bajarilmagan bazada ham sinmasin
  // (live_sessions'da sir YO'Q: token session_secrets'da, kalitlar quiz_keys'da).
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/live_sessions?pin=eq.${encodeURIComponent(pin)}&select=*`, { headers: _liveHdr });
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
  // mentorMax — sinf ENG UZOQ borgan nuqta (faqat o'sadi). DARVOZA mentorScreen (cur) bilan,
  // TEST-JAVOBINI OCHISH esa mentorMax bilan ishlaydi: mentor orqaga qaytsa allaqachon
  // ochilgan javob qayta yashirinib qolmasin (F-0726-02).
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
  // Darvoza mentorning HOZIRGI ekraniga qaraydi (phase11 cur_screen); eski bazada max_screen'ga tushadi.
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
        setMentorMax(p => (mMax > p ? mMax : p)); // klient tomonda ham monoton — hech qachon kamaymaydi
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
    beat(); // darhol — o'quvchilar 10s kutmasin
    const id = setInterval(beat, LIVE_HEARTBEAT_MS);
    // Fon-tabdan qaytganda darhol urish: Chrome fon-taymerlarni bo'g'adi (LIVE_STALE_MS izohi)
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
const LESSON_META = { lessonId: 'pm-m7d2-v2', lessonTitle: { uz: 'Jobs-to-be-Done: odamlar nimani sotib oladi?', ru: 'Jobs-to-be-Done' } };
// V4 EKRAN-TARTIB (P0 tuzilmasi bilan tenglik): ustaxona bittalab-yozish + 3 yangi unscored ekran
// (tekshiruvchi stoli / mijoz-talabi / prioritet); testlar teoriyaga biriktirilgan (s7 idx4 · s8 idx6 · s9 idx9).
const SCREEN_META = [
  { id: 's0',       type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },        // 0
  { id: 's1',       type: 'rule',        template: 'custom',   scored: false, scope: null },          // 1
  { id: 's2',       type: 'exploration', template: 'custom',   scored: false, scope: null },          // 2
  { id: 's3',       type: 'exploration', template: 'custom',   scored: false, scope: null },          // 3
  { id: 's7',       type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' }, // 4 · TEST-1 (qaysi biri ish?)
  { id: 's4',       type: 'case',        template: 'custom',   scored: false, scope: null },          // 5 · K18 keys
  { id: 's8',       type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' }, // 6 · TEST-2 (surat — qaysi tur)
  { id: 'practice', type: 'practice',    template: 'custom',   scored: false, scope: null },          // 7 · ustaxona (3 karta BITTALAB)
  { id: 'peer',     type: 'exploration', template: 'custom',   scored: false, scope: null },          // 8 · tekshiruvchi stoli
  { id: 's9',       type: 'test',        template: 'custom',   scored: true,  scope: 'module-mikro' }, // 9 · TEST-3 (juftlash MatchPairs)
  { id: 'clinic',   type: 'practice',    template: 'custom',   scored: false, scope: null },          // 10 · mijoz talabini kartaga aylantirish
  { id: 's10',      type: 'koding',      template: 'custom',   scored: false, scope: null },          // 11 · koding JtbdCard (React · VS Code)
  { id: 'priority', type: 'practice',    template: 'custom',   scored: false, scope: null },          // 12 · prioritet-doska
  { id: 's11',      type: 'recap',       template: 'custom',   scored: false, scope: null },          // 13
  { id: 's12',      type: 'homework',    template: 'custom',   scored: false, scope: null },          // 14
  { id: 'podium',   type: 'stats',       template: 'custom',   scored: false, scope: null },          // 15
  { id: 's16',      type: 'summary',     template: 'custom',   scored: false, scope: null }           // 16
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// SCREEN_INTENTS — har ekran nima uchun mavjud: 1 gaplik niyat (Quruvchi yozadi, 👦 O'quvchi-simulyator
// tekshiradi). Render qilinmaydi; niyat = bola nima QILADI yoki nima BILADI.
export const SCREEN_INTENTS = {
  s0: "Bola Starbucks savoliga ovoz berib, «nega odamlar u yerda soatlab o'tiradi?» degan qiziqish bilan qoladi",
  s1: "Bola dars oxirida o'zi 3 karta yozib, ularga «YOLLANDI» belgisi tushishini oldindan ko'radi",
  s2: "Bola ilovani chiroyi uchun emas, beradigan natijasi uchun ochishini o'zi topadi",
  s3: "Bola hayotiy misollarni uch turga (funksional · ijtimoiy · emotsional) o'zi biriktiradi",
  s7: "Bola mahsulot bilan natijani ajratib, qaysi biri «ish» ekanini topadi",
  s4: "Bola Starbucks keysidan odam ichimlikka emas, joy va muhitga to'lashini biladi",
  s8: "Bola boshqalarga ko'rinish istagi ijtimoiy tur ekanini aniqlaydi",
  practice: "Bola o'z MVP'i va 2 mahsulot uchun kartani bittalab yozib, doskaga saqlaydi",
  peer: "Bola 3 ta tayyor kartaga bittalab hukm chiqarib, kamchilikni nomlab beradi",
  s9: "Bola yangi 4 mahsulotni o'z «ishi» bilan juftlab, bilimini sinaydi",
  clinic: "Bola mijozning qisqa talabidan to'liq karta yig'adi va 2 tuzoqni tanib oladi",
  s10: "Bola 3 kartasini React-komponent qilib o'z loyihasida chiqaradi",
  priority: "Bola 3 kartasidan qaysi «ish»dan boshlashni tanlaydi",
  s11: "Bola bugun o'rganganini sherigiga aytib, bir gapda yozib qoldiradi",
  s12: "Bola uyga vazifa uchun kimdan so'rashini o'zi tanlaydi",
  podium: "Bola o'z natijasini (jonlida — sinf reytingini) ko'radi",
  s16: "Bola darsni yakunlab, nishonlari va arena-imkoniyatini ko'radi"
};

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
  // freeRide: jonli darsda tugma OCHIQ qoladi (sekin o'quvchi sinfni bloklamasin), LEKIN yorliq
  // topshiriq-matnini ko'rsatib turadi — o'quvchi nimani o'tkazayotganini biladi (F-0726-02).
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? "Mentor hali bu sahifaga o'tmadi" : (freeRide && disabled ? "Jonli dars: bajarmasdan ham o'tishingiz mumkin" : undefined)} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? '⏳ Mentorni kuting' : label}</button>;
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

// Scored ekranlar javob kaliti — darslik-jonli TASDIQLAYDI (placeCorrect USLUBI YO'Q — haqiqiy indeks).
// s7 (TEST-1 MCQ): to'g'ri = idx1 («formada bo'lish») · s8 (TEST-2 MCQ): to'g'ri = idx2 («ijtimoiy»).
// s9 (TEST-3 MatchPairs): picked=0 = birinchi urinishda hammasi to'g'ri juftlandi, aks holda 1; kalit = 0.
const INLINE_KEYS = { s7: 1, s8: 2, s9: 0, practice: -1 };
// Har scored ekran uchun qayta-tushuntirish (recap) — Metodist sayqallaydi. Kalitlar = YANGI scored ekran indeksi (4/6/9).
const RECAPS = {
  4: {
    title: "«Ish» — mahsulot emas",
    cards: [
      { ic: "🎯", h: "Ish — erishiladigan natija", body: <>Odamlar mahsulotni emas, u beradigan natijani — <b>«ish»</b>ni oladi. «Formada bo'lish» ana shunday natija; poyabzal, ilova va soat esa unga yollanadigan mahsulotlar.</> },
      { ic: "🪛", h: "Drel va rasm", body: <>Drel (devor teshadigan asbob)ni hech kim asbob uchun olmaydi — maqsad <b>devorga rasm osish</b>. Mahsulot — vosita, odam esa natijani sotib oladi.</> },
      { ic: "🧩", h: "Uch tur ish", body: <>Har ish <b>funksional</b> (vazifa bitsin), <b>ijtimoiy</b> (qanday ko'rinaman) yoki <b>emotsional</b> (qanday his qilaman) bo'ladi.</>, ask: "«formada bo'lish» qaysi turga yaqin?" },
    ]
  },
  6: {
    title: "Ijtimoiy ish — «ko'rinish»",
    cards: [
      { ic: "🛋", h: "Uchinchi joy", body: <>Starbucks o'zini oddiy qahvaxona emas, <b>«uchinchi joy»</b> deb ko'rsatadi — u yerda o'tirish, ishlash, uchrashish mumkin. Odam joy va muhitga to'laydi.</> },
      { ic: "👥", h: "Ijtimoiy tur", body: <>«Boshqalar ko'zida qanday ko'rinaman» — bu <b>ijtimoiy</b> ish. Do'stlar bilan suratga tushib yuborish — ijtimoiy.</> },
      { ic: "🧠", h: "Bir mahsulot — bir necha tur", body: <>Starbucks bir vaqtda <b>funksional</b> (o'tirib ishlash) + <b>ijtimoiy</b> (ko'rinish) + <b>emotsional</b> (shinam his) vazifalarni birga bajaradi.</>, ask: "Starbucks'ning emotsional ishi qaysi?" },
    ]
  },
  9: {
    title: "Har mahsulot — o'z ishiga",
    cards: [
      { ic: "🔗", h: "Har mahsulot bir ishga", body: <>Har mahsulot bitta asosiy <b>natija</b> uchun yollanadi: velosiped tez yetish uchun, budilnik esa vaqtida uyg'onish uchun.</> },
      { ic: "🥊", h: "Raqib ham bor", body: <>Bir natijani boshqa yo'l ham beradi — velosipedga <b>avtobus</b> raqib. Raqib «ish» darajasida bo'ladi, mahsulot darajasida emas.</> },
      { ic: "🎯", h: "Tur ham muhim", body: <>Rangli telefon g'ilofi «do'stlar orasida ajralib turish» natijasini beradi — bu <b>ijtimoiy</b> tur.</>, ask: "Budilnik qaysi ishga yollangan edi?" },
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

// QuestionScreen — scored test mexanikasi (jonli-ball KAFOLATLI: submitAnswer imzosi + Kahoot-reveal).
// 49-qonun: variantlar doira-harf belgili (`.jq-abc`); bo'lak-bosish (hotspot) rejimi BEKOR.
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
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytib tushuntirsa ham o'quvchida javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? 'Davom etish' : 'Avval natijani oching') : solved ? 'Davom etish' : (ctaLabel || 'Javobni tanlang')} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>⚡ Jonli dars — bitta urinish, o'ylab bosing!</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
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
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: 'clamp(12px,1.8vw,16px) clamp(14px,2.2vw,20px)', fontSize: 'clamp(14px,1.7vw,16px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`jq-abc ${showGreenLetter ? 'ok' : showRedLetter ? 'bad' : showDimLetter ? 'dim' : ''}`}>{showGreenLetter ? '✓' : showRedLetter ? '✗' : String.fromCharCode(65 + i)}</span>
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

// ===== JTBD STORAGE — ustaxona 3 kartasi (JOBS_KEY) + o'quvchining MVP kartasi (MVP_KEY) =====
// Ustaxonaning 1-kartasi = o'quvchining MVP'i: u JOBS_KEY bilan birga MVP_KEY'ga ham yoziladi
// (recap savoli, koding-preview va yakun-ekran shu kalitdan o'qiydi).
const JOBS_KEY = 'pm-m7d2-jobs';
const MVP_KEY = 'pm-m7d2-mvp';
const readJobs = () => { try { const a = JSON.parse(localStorage.getItem(JOBS_KEY) || 'null'); return Array.isArray(a) ? a : null; } catch { return null; } };
const writeJobs = (arr) => {
  try { localStorage.setItem(JOBS_KEY, JSON.stringify(arr)); } catch {}
  try { window.dispatchEvent(new Event('pm-m7d2-jobs-upd')); } catch {} // yollash-doskasi jonli yangilanadi
};
const writeMvp = (o) => { try { localStorage.setItem(MVP_KEY, JSON.stringify(o)); } catch {} };

// ===== PM PRIMITIV: JTBD-karta validatori (mahsulot + ish + tur to'liqmi) =====
const JOB_TURLAR = ['funksional', 'ijtimoiy', 'emotsional'];
const validateJob = (mahsulot, ish, tur) => {
  const has = (s) => (s || '').trim().length >= 2;
  return { mahsulotOk: has(mahsulot), ishOk: has(ish), turOk: !!tur, full: has(mahsulot) && has(ish) && !!tur };
};
// 48/51-qonun (2026-07-24): TaskSpec va MentorWatchLine BEKOR qilindi — shartlar saqlash-hintga,
// mentorga ko'rsatma esa MentorNote («📋 Eslatma») chipiga ko'chdi (proyektor toza qoladi).

// ===== 📌 «MENING 3 KARTAM» strip — ekranlar bo'ylab o'sib boruvchi 3-slot doska (faqat ko'rinish qatlami) =====
// Ustaxona kartalari (JOBS_KEY) validatordan o'tgani sari slotlar «✓ YOLLANDI» mini-shtampini oladi.
// Ustaxona (7) → tekshiruvchi stoli (8) → mijoz-talabi (10) → prioritet (12) → recap (13) → uy-vazifa (14).
// Test/arena/podiumda YO'Q; koding (11) ham chiqarilgan — u o'z kartalarini panelida ko'rsatadi (50-qonun ruhi).
// Default yig'iq (~44px), bosilsa ochiladi. Ball-mantiqqa aloqasi yo'q.
// Id-bo'yicha (P0 naqshi): ekran tartibi o'zgarsa jim buzilmasin — qattiq indeks yozilmaydi.
const BOARD_SCREEN_IDS = new Set(['practice', 'peer', 'clinic', 'priority', 's11', 's12']);
function HireBoard({ screen }) {
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState(() => readJobs() || []);
  useEffect(() => {
    const upd = () => setJobs(readJobs() || []);
    upd();
    window.addEventListener('pm-m7d2-jobs-upd', upd);
    return () => window.removeEventListener('pm-m7d2-jobs-upd', upd);
  }, [screen]);
  const slots = [0, 1, 2].map(k => {
    const c = jobs[k];
    return { full: !!(c && validateJob(c.mahsulot, c.ish, c.tur).full), name: (c && (c.mahsulot || '').trim()) || '' };
  });
  const n = slots.filter(s => s.full).length;
  return (
    <div className={`hboard ${open ? 'open' : ''} ${n === 3 ? 'all' : ''}`}>
      {open && (
        <div className="hboard-panel fade-step">
          {slots.map((s, k) => (
            <div key={k} className={`hboard-row ${s.full ? 'ok' : ''}`}>
              <span className="hboard-n">{k + 1}</span>
              <span className="hboard-name">{s.name || "bo'sh karta"}</span>
              {s.full ? <span className="jhire-stamp mini hb">✓ YOLLANDI</span> : <span className="hboard-dash">—</span>}
            </div>
          ))}
          <p className="hboard-cap">{n === 3 ? '3/3 karta yollandi! 🎉' : 'Kartalar ustaxonada yoziladi.'}</p>
        </div>
      )}
      <button type="button" className="hboard-pill" onClick={() => setOpen(o => !o)} aria-expanded={open} title="Mening 3 kartam">
        <span className="hboard-ic" aria-hidden="true">📌</span>
        <span className="hboard-lbl">Mening 3 kartam</span>
        <span className="hboard-slots" aria-label={`${n}/3 yollandi`}>
          {slots.map((s, k) => <i key={k} className={`hboard-dot ${s.full ? 'ok' : ''}`}>{s.full ? '✓' : k + 1}</i>)}
        </span>
        <span className="hboard-car" aria-hidden="true">{open ? '▾' : '▴'}</span>
      </button>
    </div>
  );
}

// ===== SCREEN 0 — HOOK: Starbucks ovoz berish (jonli natija — to'lib boradigan kofe-stakanlar) =====
// VIZUAL IMZO (pm-dizayn sayqallaydi): ovoz natijasi kofe-stakanlar to'lishi bilan ko'rinadi.
const HOOK_OPTS = [
  "Eng mazali kofe uchun",
  "Tez xizmat uchun",
  "O'tirib ishlash va uchrashish uchun",
  "Chegirma va aksiyalar uchun",
];
// Hook-tanlov lesson-scoped saqlanadi — s4 yakuniy slaydda shaxsiy qaytarish uchun (payoff).
const HOOK_CHOICE_KEY = 'pm-m7d2-hook-choice';
const readHookChoice = () => { try { const v = localStorage.getItem(HOOK_CHOICE_KEY); return v == null || v === '' ? null : Number(v); } catch { return null; } };
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [counts, setCounts] = useState(null);
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
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
    try { localStorage.setItem(HOOK_CHOICE_KEY, String(i)); } catch {} // payoff: s4 oxirida shaxsiy qaytarish
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: i, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const isMentor = live && live.mode === 'mentor';
  const shown = counts || (picked !== null ? HOOK_OPTS.map((_, i) => (i === picked ? 1 : 0)) : null);
  const totalVotes = shown ? shown.reduce((a, b) => a + b, 0) : 0;
  const revealViz = shown && (picked !== null || isMentor);
  const topIdx = revealViz ? shown.indexOf(Math.max(...shown)) : -1;
  return (
    <Stage eyebrow="Kirish · Starbucks so'rovi" screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? 'Avval ovoz bering' : 'Davom etish'} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="hook-hero fade-up"><span className="hook-cup">☕</span></div>
        <div className="head"><h2 className="title h-title fade-up" style={{ textAlign: 'center' }}>Odamlar <span className="italic" style={{ color: T.accent }}>Starbucks</span>'ga aslida nima uchun boradi?</h2></div>
        <Mentor>Odamlar Starbucks'ga asosan <b style={{ color: T.ink }}>NIMA UCHUN</b> boradi deb o'ylaysiz? Ovoz bering — haqiqiy javobni birozdan keyin birga bilib olamiz.</Mentor>
        <MentorNote>O'quvchilar ovoz beradi — siz faqat kuzatasiz. To'g'ri javobni AYTMANG («birozdan keyin birga bilib olamiz»). 2 daqiqadan oshmasin.</MentorNote>
        <div className="hook-menu fade-up delay-1">
          {HOOK_OPTS.map((o, i) => {
            const on = picked === i;
            const locked = picked !== null || isMentor;
            return (
              <button key={i} className={`hook-mc ${on ? 'on' : ''} ${!locked ? 'taphint' : ''}`} disabled={locked} onClick={() => pick(i)}>
                <span className="hook-mc-abc">{String.fromCharCode(65 + i)}</span>
                <span className="hook-mc-txt">{o}</span>
                <span className="hook-mc-cup" aria-hidden="true">☕</span>
              </button>
            );
          })}
        </div>
        {revealViz && (
          <div className="cofsh-shelf fade-step" aria-label="Ovoz natijalari — kofe-stakanlarda">
            <div className="cofsh-row">
              {HOOK_OPTS.map((o, i) => {
                const n = shown[i];
                const pct = totalVotes ? Math.round((n / totalVotes) * 100) : 0;
                return (
                  <div key={i} className={`cofsh ${picked === i ? 'mine' : ''} ${i === topIdx && totalVotes > 0 ? 'top' : ''}`}>
                    {i === topIdx && totalVotes > 0 && <span className="cofsh-crown" aria-hidden="true">👑</span>}
                    <span className="cofsh-pct">{pct}%</span>
                    <div className="cofsh-vessel" style={{ '--sk': `var(--sk${i})` }}>
                      <span className="cofsh-lid" aria-hidden="true" />
                      <span className="cofsh-steam" aria-hidden="true" />
                      <div className="cofsh-glass">
                        <span className="cofsh-fill" style={{ height: `${Math.max(pct, totalVotes ? 3 : 0)}%` }} />
                      </div>
                    </div>
                    <span className="cofsh-abc">{String.fromCharCode(65 + i)}</span>
                  </div>
                );
              })}
            </div>
            {/* F-0725-01: mentor-izohi olib tashlandi — stakanlarning o'zi ovozni ko'rsatadi, matn ortiqcha (54-qonun). */}
            {!isMentor && <p className="cofsh-cap">Ovozingiz qabul qilindi! Haqiqiy sabab kutganingizdan qiziqroq — birozdan keyin birga bilib olamiz. 😉</p>}
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD: «ISHGA QABUL» imzo-sahnasi (JTBD metaforasi = mahsulot ISHGA YOLLANADI) =====
// WOW-moment: 3 demo-karta «ish shartnomasi» ko'rinishida CSS-taymlayn bilan «yozilib» to'ladi,
// har karta to'lgach ustiga indigo «✓ YOLLANDI» shtampi bosiladi (reduced-motion: darhol to'liq holat).
const DEMO_JTBD = [
  { em: '☕', mahsulot: 'qahva', ish: 'ish oldidan jonlanish', tur: 'emotsional' },
  { em: '🚲', mahsulot: 'velosiped', ish: 'maktabga tez yetish', tur: 'funksional' },
  { em: '👟', mahsulot: 'brend krossovka', ish: "davrada o'zini ko'rsatish", tur: 'ijtimoiy' },
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow="Maqsad" screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label="Boshlaymiz →" onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">Mahsulot qaysi <span className="italic" style={{ color: T.accent }}>ishni bajarishini</span> yozishni o'rganasiz.</h2></div>
      <Mentor>JTBD-karta (Jobs-to-be-Done — «bajarilishi kerak bo'lgan ish») — mahsulot qaysi <b style={{ color: T.ink }}>ISH</b>ga yollangani yozilgan karta. Quyida 3 ta namuna o'z-o'zidan yozilib chiqadi.</Mentor>
      <div className="jhire-grid">
        {DEMO_JTBD.map((s, i) => {
          const base = 0.3 + i * 1.7;
          return (
            <div key={i} className="jhire-card" style={{ '--cd': `${0.12 + i * 0.18}s` }}>
              <div className="jhire-top"><span className="jhire-em" aria-hidden="true">{s.em}</span><span className="jhire-nm">{s.mahsulot}</span><span className="jhire-doc">ishga qabul</span></div>
              <div className="jhire-rows">
                {[['MAHSULOT', s.mahsulot, 'kim'], ['ISH', s.ish, 'nima'], ['TUR', s.tur, 'natija']].map(([lbl, val, cls], j) => (
                  <div key={lbl} className={`jhire-row ${cls}`}><span className="jhire-lbl">{lbl}</span><span className="jhire-val" style={{ '--fd': `${base + j * 0.45}s` }}>{val}</span></div>
                ))}
              </div>
              <span className="jhire-stamp" style={{ '--fd': `${base + 1.75}s` }}>✓ YOLLANDI</span>
            </div>
          );
        })}
      </div>
      {/* F-0725-01 · 54-qonun: `jhire-cap` va ta-sub o'chirildi — P0 da aynan shu ikki qatlam olib tashlangan edi (bitta xabar, bitta qator). */}
      <div className="takeaway fade-up delay-2"><span className="ta-bulb">🎯</span><p className="ta-h">Birozdan keyin sizning 3 kartangiz ham xuddi shunday yozilgan bo'ladi.</p></div>
    </div>
  </Stage>
);

// ===== SCREEN 2 — YADRO: kalkulyator-savoli + «telefon ekrani» (ilova qaysi ISHga yollanadi?) =====
// Interaktiv mini-sahna (unscored, onAnswer'siz): 3 ilova-ikonka bosilganda 3D-flip bilan ISHini ochadi.
const JAPPS = [
  { ic: '🧮', name: 'Kalkulyator', job: 'hisob-kitob bitsin' },
  { ic: '📷', name: 'Kamera', job: 'lahzani saqlab qolish' },
  { ic: '🗺️', name: 'Xarita', job: 'adashmay yetib borish' },
];
const Screen2 = ({ screen, onNext, onPrev }) => {
  // opened — hozirgi flip-holat (qayta bosilsa yopiladi/ochiladi — yodlash uchun toggle);
  // seen — kamida bir marta ochilganlar (3/3 darvozasi shu bilan, yopilsa ham yo'qolmaydi).
  const [opened, setOpened] = useState([false, false, false]);
  const [seen, setSeen] = useState([false, false, false]);
  const allOpen = seen.every(Boolean);
  const openApp = (i) => {
    setOpened(prev => prev.map((v, k) => (k === i ? !v : v)));
    setSeen(prev => (prev[i] ? prev : prev.map((v, k) => (k === i ? true : v))));
  };
  return (
    <Stage eyebrow="Muhokama · savol" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!allOpen} label={allOpen ? 'Davom etish' : `👆 Yana ${seen.filter(v => !v).length} ilovani oching`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="proj-q fade-up">
          <span className="proj-q-lbl">🗣️ Sinfga savol</span>
          <p className="proj-q-body">Kalkulyatorni oxirgi marta nega ochdingiz — <b>chiroyli</b> bo'lgani uchunmi? 🙂</p>
        </div>
        <Mentor>Uchala ikonkani bosing — har birining <b style={{ color: T.ink }}>natijasi</b> ochiladi.</Mentor>
        <div className="jphone fade-up delay-1">
          <span className="jphone-notch" aria-hidden="true" />
          <div className="jphone-grid">
            {JAPPS.map((a, i) => (
              <button key={i} className={`japp ${opened[i] ? 'open' : 'taphint'}`} onClick={() => openApp(i)} aria-label={a.name}>
                <span className="japp-inner">
                  <span className="japp-face japp-front"><span className="japp-ic" aria-hidden="true">{a.ic}</span><span className="japp-nm">{a.name}</span></span>
                  <span className="japp-face japp-back"><span className="japp-lbl">ISHI</span><span className="japp-job">{a.job}</span></span>
                </span>
              </button>
            ))}
          </div>
          <p className="jphone-cap">{allOpen ? "✓ 3/3 — har ilova o'z natijasi uchun turibdi" : "Ikonkalarni bosing — natijasi ochiladi"}</p>
        </div>
        {allOpen && (
          <>
            <div className="done-mini fade-step">✅ 3/3 ochildi <span className="dm-sub">— ilova chiroyi uchun emas, natijasi uchun ochiladi</span></div>
            <div className="ex-card fade-step">
              <span className="ex-lbl">🚲 Raqib — o'sha natijani beradigan boshqa yo'l</span>
              <p className="ex-body">Velosipedni «<b>maktabga tez yetish</b>» uchun olasiz. Buni <b>avtobus</b> ham bajaradi — demak, avtobus velosipedga raqib.</p>
            </div>
          </>
        )}
        <MentorNote>Har kim bittadan javob aytsin. Qoidani SAVOLDAN OLDIN aytmang — o'quvchi «ish» g'oyasiga uchala ikonkani ochib o'zi kelsin.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — QOIDA: drel→natija (devordagi rasm) demo-lenta + 3 hayotiy misolni 3 ish-turiga TAP-BIRIKTIRISH =====
// Mexanika s2 flipdan FARQ qiladi (takror-sindirish) va s9 MatchPairs'ga ko'prik: misol-chipni bosib,
// keyin tur-ustunini bosasiz — to'g'ri joylashsa snap-pop + yashil, xato bosishda qisqa qizil silkinish.
// Unscored; onAnswer payload eski shakl bilan mos: hammasi joylashganda { placed, correct: true }.
const JOB_TYPES = [
  { key: 'funksional', ic: '🔧', h: 'Funksional', short: 'Vazifa bajarilsin', body: <>Vazifa <b>bajarilsin</b>: rasm devorga osilsin, manzilga yetib borilsin.</> },
  { key: 'ijtimoiy',   ic: '👥', h: 'Ijtimoiy',   short: "Boshqalar ko'zida qanday ko'rinaman", body: <><b>Boshqalar ko'zida</b> qanday ko'rinaman: obro', tan olinish.</> },
  { key: 'emotsional', ic: '💗', h: 'Emotsional', short: "O'zimni qanday his qilaman", body: <>O'zimni qanday <b>his qilaman</b>: xotirjamlik, hayajon, shinamlik.</> },
];
// Hayotiy misol-chiplar (chip ≤4 so'z); type = JOB_TYPES indeksi. Display-tartib aralash (barqaror).
const JT_EXAMPLES = [
  { ic: '🖼️', t: 'devorga rasm osish', type: 0 },
  { ic: '⌚', t: 'brend soat taqish', type: 1 },
  { ic: '☕', t: 'issiq choydan shinam his', type: 2 },
];
const JT_EX_ORDER = [1, 2, 0];
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [st, setSt] = useState(() => {
    if (storedAnswer?.placed) return { placed: storedAnswer.placed.slice(), sel: null, miss: null };
    if (storedAnswer?.opened) return { placed: [0, 1, 2], sel: null, miss: null }; // eski-format moslik
    return { placed: [null, null, null], sel: null, miss: null };
  });
  const missTimer = useRef(null);
  useEffect(() => () => clearTimeout(missTimer.current), []);
  const done = st.placed.every(p => p !== null);
  const tapChip = (ei) => { if (st.placed.includes(ei)) return; setSt(p => ({ ...p, sel: p.sel === ei ? null : ei, miss: null })); };
  const tapCol = (ci) => {
    if (st.placed[ci] !== null || st.sel === null) return;
    if (JT_EXAMPLES[st.sel].type === ci) {
      const placed = st.placed.slice(); placed[ci] = st.sel;
      setSt({ placed, sel: null, miss: null });
      if (placed.every(p => p !== null) && storedAnswer === undefined) onAnswer(screen, { placed, correct: true });
    } else {
      // haqiqiy xato — qisqa qizil silkinish, chip qo'lda qoladi (yana urinadi)
      setSt(p => ({ ...p, miss: ci }));
      clearTimeout(missTimer.current);
      missTimer.current = setTimeout(() => setSt(p => (p.miss === ci ? { ...p, miss: null } : p)), 650);
    }
  };
  const leftN = st.placed.filter(p => p === null).length;
  return (
    <Stage eyebrow="Qoida" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? 'Davom etish' : st.sel === null ? `Yana ${leftN} misolni joylang` : '👆 Endi mos ustunni bosing'} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Odamlar aslida <span className="italic" style={{ color: T.accent }}>nimani</span> sotib oladi?</h2></div>
        <Mentor>Drel — devor teshadigan asbob, lekin odamga aslida devordagi rasm kerak. Odam mahsulotni emas, <b style={{ color: T.ink }}>NATIJA</b>ni sotib oladi — bu natija <b style={{ color: T.ink }}>«ish»</b> deyiladi (inglizcha Jobs-to-be-Done, qisqacha JTBD).</Mentor>
        <div className="jdrill fade-up" aria-label="Drel — vosita, natija — devordagi rasm">
          <span className="jdrill-tool" aria-hidden="true">🔩</span>
          <span className="jdrill-arrow" aria-hidden="true">→</span>
          <span className="jdrill-wall" aria-hidden="true"><span className="jdrill-pic">🖼️</span></span>
          <span className="jdrill-tag">Natija — bu «ish»</span>
        </div>
        {!done && (
          <div className="jta-pool fade-up delay-1">
            <span className="flow-label">Misolni bosing, so'ng mos ustunga qo'ying</span>
            <div className="jta-pool-row">
              {JT_EX_ORDER.map(ei => st.placed.includes(ei) ? null : (
                <button key={ei} className={`jta-chip ${st.sel === ei ? 'sel' : ''}`} onClick={() => tapChip(ei)}>
                  <span className="jta-chip-ic" aria-hidden="true">{JT_EXAMPLES[ei].ic}</span>{JT_EXAMPLES[ei].t}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="jta-grid fade-up delay-1">
          {JOB_TYPES.map((jt, ci) => {
            const ei = st.placed[ci];
            const filled = ei !== null;
            return (
              <button key={jt.key} type="button" className={`jta-col ${jt.key} ${filled ? 'ok' : ''} ${st.miss === ci ? 'miss' : ''} ${st.sel !== null && !filled ? 'droppable' : ''}`} onClick={() => tapCol(ci)} disabled={filled}>
                <span className="jta-ic" aria-hidden="true">{jt.ic}</span>
                <span className="jta-h">{jt.h}</span>
                <span className="jta-short">{jt.short}</span>
                <span className="jta-slot">
                  {filled
                    ? <span className="jta-placed">✓ {JT_EXAMPLES[ei].ic} {JT_EXAMPLES[ei].t}</span>
                    : <span className="jta-slot-empty">{st.sel !== null ? 'shu yerga qo\'ying' : 'misol kutilmoqda'}</span>}
                </span>
                {filled && <span className="jta-body">{jt.body}</span>}
              </button>
            );
          })}
        </div>
        {done && <div className="done-mini fade-step">✅ 3/3 joylandi <span className="dm-sub">— har misol o'z turini topdi</span></div>}
        <MentorNote>Qoidani SAVOLDAN OLDIN aytmang — o'quvchi biriktirish orqali o'zi kelsin. Har turga sinfdan bittadan qo'shimcha misol so'rang.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — KEYS K18: Starbucks «uchinchi joy» bosqichma-bosqich =====
const K18_SLIDES = [
  { ic: "☕", h: "Starbucks — oddiy qahvaxonami?", body: <>Starbucks o'zini oddiy qahvaxona deb hisoblamaydi. O'ylab ko'ring: nega odamlar u yerda soatlab o'tiradi?</> },
  { ic: "🛋️", h: "«Uchinchi joy»", body: <>Odamning ikki doimiy joyi bor: uy va maktab. Starbucks o'zini <b>uchinchi joy</b> deb ataydi — o'tirish, ishlash, uchrashish mumkin bo'lgan joy.</>, diagram: [{ ic: '🏠', l: 'Uy' }, { ic: '☕', l: 'Uchinchi joy', mid: true }, { ic: '🏫', l: 'Maktab' }] },
  { ic: "💳", h: "Aslida nima sotiladi?", body: <>Odamlar pulni <b>ichimlikka emas</b>, joy va muhitga to'laydi: qulay stol, Wi-Fi, musiqa, «o'zimniki» degan his.</> },
  { ic: "🧩", h: "Uch vazifa birga", body: <>Starbucks uch xil vazifani birga bajaradi: <b>funksional</b> (o'tirib ishlash), <b>ijtimoiy</b> (do'stlar ichida ko'rinish), <b>emotsional</b> (shinam his).</> },
  { ic: "🎯", h: "Xulosa", body: <>Har mahsulot odamga bitta asosiy natija beradi. Starbucks kofe emas — <b>«uchinchi joy»</b>ni sotadi.</> },
];
// 🎲 BASHORAT-STAVKA (unscored ko'rinish qatlami): 2 kalit-slayd oldidan mikro-taxmin.
// Topsa — yashil ✓; topmasa — NEYTRAL indigo «Adashdingiz — asl javob «Y»» (56-qonun: javob doim ochiladi; qizil YO'Q, ball YO'Q).
const K18_PREDICTS = {
  1: { q: "Sizningcha, Starbucks o'zini qanday joy deb ko'rsatadi?", opts: [{ ic: '☕', t: "tez kofe do'koni" }, { ic: '🛋️', t: "o'tirib ishlaydigan makon", ok: true }, { ic: '🎁', t: 'chegirmalar klubi' }] },
  2: { q: "Sizningcha, odamlar Starbucksda pulni asosan nimaga to'laydi?", opts: [{ ic: '☕', t: "kofe ta'miga" }, { ic: '📸', t: 'chiroyli brend-stakanga' }, { ic: '🛋️', t: 'joy va muhitga', ok: true }] },
};
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate4 = useContext(LiveGateCtx) || {};
  const isMentor4 = !!(gate4.live && gate4.live.mode === 'mentor');
  const [st4, setSt4] = useState({ i: 0, pending: null, preds: {}, glow: false });
  const { i, pending, preds, glow } = st4;
  const last = i === K18_SLIDES.length - 1;
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last]); // eslint-disable-line
  const goNext = () => {
    if (pending !== null) { setSt4(p => ({ ...p, i: p.pending, pending: null, glow: true })); return; } // mentor ozod: taxminsiz ochadi
    const nxt = i + 1;
    if (K18_PREDICTS[nxt] && preds[nxt] === undefined) { setSt4(p => ({ ...p, pending: nxt })); return; }
    setSt4(p => ({ ...p, i: nxt, glow: false }));
  };
  const bet = (j) => setSt4(p => ({ ...p, preds: { ...p.preds, [p.pending]: j }, i: p.pending, pending: null, glow: true }));
  const goDot = (k) => { if (k <= i && pending === null) setSt4(p => ({ ...p, i: k, glow: false })); };
  const c = K18_SLIDES[i];
  const pd = K18_PREDICTS[i];
  const myBet = pd && preds[i] !== undefined ? pd.opts[preds[i]] : null;
  // 🎁 PAYOFF: hook-tanlovga shaxsiy qaytarish (saqlanmagan bo'lsa umumiy matn qoladi)
  const hookPick = last ? readHookChoice() : null;
  const hookHit = hookPick === 2; // «O'tirib ishlash va uchrashish uchun» — sirga eng yaqin javob
  return (
    <Stage eyebrow="Haqiqiy misol ☕" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={pending !== null && !isMentor4} label={pending !== null ? (isMentor4 ? '🔓 Slaydni ochish' : '👆 Avval taxminingizni tanlang') : last ? 'Davom etish' : `Keyingi bosqich (${i + 1}/${K18_SLIDES.length})`} onClick={last ? onNext : goNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Nega odamlar Starbucksda <span className="italic" style={{ color: T.accent }}>soatlab</span> o'tiradi?</h2></div>
        {pending !== null ? (
          <div className="pred-card fade-step" key={`p${pending}`}>
            <span className="pred-tag">🎲 Slayd ochilishidan oldin — taxmin qiling</span>
            <p className="pred-q">{K18_PREDICTS[pending].q}</p>
            <div className="pred-chips">
              {K18_PREDICTS[pending].opts.map((o, j) => (
                <button key={j} className="pred-chip" onClick={() => bet(j)}><span className="pred-ic" aria-hidden="true">{o.ic}</span>{o.t}</button>
              ))}
            </div>
            <p className="pred-cap">Bu ball emas — bemalol taxmin qiling, javob hozir ochiladi.</p>
          </div>
        ) : (
          <div className={`k-slide fade-step ${glow ? 'reveal-glow' : ''}`} key={i}>
            <span className="k-slide-eyebrow">📊 Haqiqiy misol · Starbucks · {i + 1} / {K18_SLIDES.length}</span>
            <div className="k-slide-ic">{c.ic}</div>
            <h3 className="k-slide-h">{c.h}</h3>
            {/* F-0725-01 · 56-qonun: adashganda ASL JAVOB aytiladi (P0 `kp-res` naqshi) — taxminni takrorlash o'rgatmaydi. */}
            {myBet && (myBet.ok
              ? <span className="pred-res hit">🎯 Topdingiz: {myBet.t}</span>
              : <span className="pred-res miss">Adashdingiz — asl javob «{(pd.opts.find(o => o.ok) || {}).t}»</span>)}
            <p className="k-slide-body">{c.body}</p>
            {c.diagram && (
              <div className="k-slide-diagram fade-step" aria-label="Uy → uchinchi joy → maktab">
                {c.diagram.map((n, k) => (
                  <React.Fragment key={k}>
                    {k > 0 && <span className="ksd-arrow" aria-hidden="true">→</span>}
                    <div className={`ksd-node ${n.mid ? 'mid' : ''}`}><span className="ksd-ic">{n.ic}</span><span className="ksd-lbl">{n.l}</span></div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="k-dots">{K18_SLIDES.map((_, k) => <button key={k} className={`k-dot ${k === i && pending === null ? 'cur' : k < i || pending === k ? 'fill' : ''}`} onClick={() => goDot(k)} aria-label={`${k + 1}-bosqich`} />)}</div>
        {last && hookPick !== null && (hookHit
          ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>🎉 Dars boshida siz «<b>{HOOK_OPTS[hookPick]}</b>» degandingiz — topgan ekansiz!</p></div>
          : <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>Dars boshida siz «<b>{HOOK_OPTS[hookPick]}</b>» degandingiz — aslida odamlar joy va muhitga to'laydi.</p></div>)}
        {/* F-0725-01 · 54-qonun: keysning oxirgi slaydidagi «sizning MVP'ingiz ham…» ramkasi o'chirildi — P0 da bu qatlam yo'q (bir ekran, bir xabar). */}
        <MentorNote>Keysni sodda tilda ayting. Raqam to'qimang — bu keysda rasmiy raqam yo'q. Taxmin-bosqichda sinfdan ovoz so'rang, keyin slaydni oching.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== ISH-TURI TANLAGICH (ustaxona muharriri ishlatadi) =====
const TurPicker = ({ value, onPick }) => (
  <div className="tur-pick">
    {JOB_TURLAR.map(t => (
      <button key={t} type="button" className={`tur-chip ${t} ${value === t ? 'on' : ''}`} onClick={() => onPick(t)}>{t}</button>
    ))}
  </div>
);

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

// O'QUVCHI ko'radigan sinf-pulsi: koding-ekranda «nechta sinfdosh bajardi / bajarmoqda» jonli hisobi.
// Faqat jonli student-rejimda; MentorPracticeStats bilan bir xil signal-zonadan (PRACTICE_BASE+screen) o'qiydi,
// ball-relsga yozmaydi — sof o'qish. 3 soniyalik polling (mentor-panel bilan bir xil).
const StudentPracticePulse = ({ live, screen }) => {
  const [data, setData] = useState(null); // { total, done }
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

// ===== USTAXONA (practice) — 3 karta BITTALAB yoziladi (48-qonun) =====
// UX: chapda BITTA karta-muharrir → «Saqlash» → karta o'ngdagi doskaga ko'chadi va yangi bo'sh karta keladi.
// 1-karta — o'quvchining O'Z MVP'i: u MVP_KEY'ga ham yoziladi (recap/koding/yakun shu yerdan o'qiydi).
// 3-karta saqlanganda ekran O'ZI bajarildi bo'ladi (honor-tugma yo'q — real signal PRACTICE_BASE'ga ketadi).
// Sifat-shartlar SAQLASH PAYTIDA: to'liq · ish mahsulot nomining takrori emas · mahsulot takrorlanmaydi ·
// uchala kartada tur bir xil bo'lib qolmaydi.
const emptyJob = () => ({ mahsulot: '', ish: '', tur: '', raqib: '' });
const savedJobs = () => (readJobs() || [])
  .filter(c => c && validateJob(c.mahsulot, c.ish, c.tur).full)
  .slice(0, 3)
  .map(c => ({ mahsulot: c.mahsulot, ish: c.ish, tur: c.tur, raqib: c.raqib || '' }));
// Karta o'rniga qarab placeholder (1-karta — o'z MVP'i, keyingilari hayotdagi mahsulotlar)
const JW_PLACE = [
  { m: "o'z g'oyangiz — masalan: dars-eslatma boti", i: 'masalan: darsni unutmaslik' },
  { m: 'masalan: quloqchin', i: "masalan: yo'lda zerikmaslik" },
  { m: 'masalan: brend krossovka', i: "masalan: davrada o'zini ko'rsatish" },
];
const ScreenJobWorkshop = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorW = !!(live && live.mode === 'mentor');
  const [st, setSt] = useState(() => {
    const src = storedAnswer?.cards || savedJobs();
    const saved = src.filter(c => c && validateJob(c.mahsulot, c.ish, c.tur).full).slice(0, 3)
      .map(c => ({ mahsulot: c.mahsulot, ish: c.ish, tur: c.tur, raqib: c.raqib || '' }));
    return { saved, draft: emptyJob(), editIdx: -1, done: !!(storedAnswer && storedAnswer.solved) || saved.length >= 3 };
  });
  const { saved, draft, editIdx, done } = st;
  // Reload-tuzatish (F-0726-02): F5 dan keyin kartalar localStorage'dan tiklanadi va done=true
  // bo'ladi, LEKIN onAnswer/submitAnswer otilmay qolardi — o'quvchi mentor-panelda «bajarmagan»
  // ko'rinardi, nishon ham berilmasdi. Bir marta qayta yuboramiz.
  useEffect(() => {
    if (done && storedAnswer === undefined && saved.length >= 3) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'job-workshop', cards: saved, solved: true, correct: true, picked: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  }, []); // eslint-disable-line
  const v = validateJob(draft.mahsulot, draft.ish, draft.tur);
  const editing = editIdx >= 0;
  const allSaved = saved.length >= 3;
  const showEditor = !allSaved || editing;
  const slotN = editing ? editIdx : saved.length;
  const others = saved.filter((_, i) => i !== editIdx);
  // Saqlash-shartlari (ekranni to'ldirmasdan, faqat saqlash payti)
  const ishTakror = v.full && draft.ish.trim().toLowerCase() === draft.mahsulot.trim().toLowerCase();
  const mahsulotTakror = v.full && others.some(c => c.mahsulot.trim().toLowerCase() === draft.mahsulot.trim().toLowerCase());
  const turBirXil = v.full && others.length === 2 && others.every(c => c.tur === draft.tur);
  const canSave = v.full && !ishTakror && !mahsulotTakror && !turBirXil;
  const saveHint = !v.full ? null
    : ishTakror ? "ISH maydonida mahsulot nomi turibdi. Uning o'rniga natijani yozing: odam nimaga erishadi?"
    : mahsulotTakror ? 'Bu mahsulot daftarda allaqachon bor — boshqasini oling.'
    : turBirXil ? "Uchala karta bir xil turda bo'lib qolmasin — bu kartaga boshqa turni tanlang." : null;
  const saveDraft = () => {
    if (!canSave) return;
    const cards = editing ? saved.map((c, i) => (i === editIdx ? { ...draft } : c)) : [...saved, { ...draft }];
    writeJobs(cards);
    // 1-karta = o'quvchining MVP'i — alohida kalitga ham yoziladi (recap/koding/yakun o'qiydi)
    if ((editing ? editIdx : cards.length - 1) === 0) writeMvp({ mahsulot: cards[0].mahsulot, ish: cards[0].ish, tur: cards[0].tur });
    const finished = cards.length >= 3;
    if (finished && !done) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'jtbd-workshop', cards, solved: true, correct: true, picked: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
    setSt({ saved: cards, draft: emptyJob(), editIdx: -1, done: done || finished });
  };
  const editCard = (i) => setSt(prev => ({ ...prev, draft: { ...prev.saved[i] }, editIdx: i }));
  const setD = (patch) => setSt(prev => ({ ...prev, draft: { ...prev.draft, ...patch } }));
  const nFilled = [v.mahsulotOk, v.ishOk, v.turOk].filter(Boolean).length;
  const ph = JW_PLACE[Math.min(slotN, 2)];
  // 30-qonun: qulflangan tugma qaysi qadam qolganini aytadi
  const navLabel = done || isMentorW ? 'Davom etish' : `✍️ ${saved.length}/3 — kartani yozib saqlang`;
  return (
    <Stage eyebrow="Ustaxona · kartalar ✍️" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentorW} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Endi 3 ta <span className="italic" style={{ color: T.accent }}>JTBD-karta</span> yozasiz.</h2></div>
        <Mentor>Kartani to'ldiring va <b style={{ color: T.ink }}>Saqlash</b> bosing — u o'ngdagi daftarga ko'chadi, o'rniga yangi karta keladi.</Mentor>
        <div className="split">
          <Col>
            {showEditor ? (
              <div className="jw-ed fade-up" key={editing ? `e${editIdx}` : `n${saved.length}`}>
                <span className="jw-tag">{editing ? `✎ ${editIdx + 1}-kartani tahrirlash` : slotN === 0 ? "✨ 1-karta — sizning g'oyangiz (MVP)" : `✨ ${slotN + 1}-karta — hayotdagi mahsulot`}</span>
                {/* imzo-vizual: shtamp-o'rni — karta to'lguncha xira-punktir, uchala maydon to'lganda yonadi */}
                <span className={`jw-stampzone ${canSave ? 'ready' : ''}`} aria-hidden="true">✓ YOLLANDI</span>
                <p className="jw-sent">Foydalanuvchi <b className={`jw-part mahsulot ${draft.mahsulot ? 'on' : ''}`}>{draft.mahsulot || 'mahsulot'}</b>ni <b className={`jw-part ish ${draft.ish ? 'on' : ''}`}>{draft.ish || 'ish'}</b> uchun yollaydi. Turi: <b className={`jw-part tur ${draft.tur ? 'on' : ''}`}>{draft.tur || 'tur'}</b>.</p>
                <div className="swcard-fields two">
                  <label className={`smini-f kim ${v.mahsulotOk ? 'on' : ''}`}><span>MAHSULOT</span><input value={draft.mahsulot} onChange={e => setD({ mahsulot: e.target.value })} placeholder={ph.m} /></label>
                  <label className={`smini-f nima ${v.ishOk ? 'on' : ''}`}><span>ISH</span><input value={draft.ish} onChange={e => setD({ ish: e.target.value })} placeholder={ph.i} /></label>
                </div>
                <div className={`smini-f natija ${v.turOk ? 'on' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span>{slotN === 2 && !editing ? "ISH TURI — uchchalasi bir xil bo'lmasin" : 'ISH TURI'}</span><TurPicker value={draft.tur} onPick={t => setD({ tur: t })} /></div>
                <label className="swcard-raqib"><span>⭐ RAQIB — ixtiyoriy</span><input value={draft.raqib} onChange={e => setD({ raqib: e.target.value })} placeholder="shu ishni yana nima bajaradi? masalan: avtobus" /></label>
                {saveHint && <p className="jw-hint">💡 {saveHint}</p>}
                <div className="jw-btns">
                  {editing && <button className="btn-ghost" onClick={() => setSt(prev => ({ ...prev, draft: emptyJob(), editIdx: -1 }))}>Bekor qilish</button>}
                  {!v.full && <span className="jw-cnt">{nFilled}/3 asosiy maydon to'ldi</span>}
                  <button className="jw-save" disabled={!canSave} onClick={saveDraft}>✓ Saqlash</button>
                </div>
              </div>
            ) : (
              /* 28-qonun: muharrir o'rni bo'sh qolmaydi — uchala shtamp bosilgan «yakunlangan varaq» */
              <div className="jw-done fade-step">
                <span className="jw-done-stamps" aria-hidden="true">
                  {[0, 1, 2].map(k => <span key={k} className="jhire-stamp mini jb" style={{ '--sd': `${0.1 + k * 0.16}s` }}>✓ YOLLANDI</span>)}
                </span>
                <div className="done-mini">✅ 3 karta tayyor <span className="dm-sub">— kerak bo'lsa, daftardagi kartani ✎ bilan tahrirlang</span></div>
              </div>
            )}
          </Col>
          <Col>
            <div className="jbook fade-up delay-1">
              <div className="jbook-head"><span className="card-lbl" style={{ color: T.accent, margin: 0 }}>📒 Kartalarim</span><b className={`jbook-n ${allSaved ? 'ok' : ''}`}>{saved.length}/3</b></div>
              {[0, 1, 2].map(i => {
                const c = saved[i];
                if (!c) return <div key={i} className="jbook-slot"><span className="jbook-slot-n">{i + 1}</span>hali yozilmagan</div>;
                return (
                  <div key={i} className={`jbook-card ${editIdx === i ? 'editing' : ''}`}>
                    <div className="jbook-top">
                      <span className="jbook-num">{i + 1}</span>
                      <span className={`jbook-tur ${c.tur}`}>{c.tur}</span>
                      <span className="jhire-stamp mini jb">✓ YOLLANDI</span>
                      <button className="jbook-edit" onClick={() => editCard(i)} aria-label={`${i + 1}-kartani tahrirlash`}>✎</button>
                    </div>
                    <p className="jbook-sent">Foydalanuvchi <b style={{ color: T.blue }}>{c.mahsulot}</b>ni <b style={{ color: '#B77A16' }}>{c.ish}</b> uchun yollaydi.</p>
                  </div>
                );
              })}
              <p className="jbook-foot">Keyingi darsda foydalanuvchilar bilan suhbat savollarini aynan shu kartalardan tuzamiz.</p>
            </div>
            <MentorPracticeStats live={live} screen={screen} label="✍️ 3 kartani yozib bo'lganlar" />
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
        </div>
        <MentorNote>Bu ishni o'quvchilar bajaradi — «✍️ 3 kartani yozib bo'lganlar» panelida kuzatasiz; «Davom etish» siz uchun ochiq. Qiynalganga 2 savol bering: bu mahsulotni nima uchun ishlataman? Undan keyin hayotimda nima yaxshilanadi?</MentorNote>
      </div>
    </Stage>
  );
};

// To'liq kartalar — koding/prioritet o'qiydi; bo'sh bo'lsa namuna-fallback (40-qonun).
const readFullJobs = () => savedJobs();


// ===== TEKSHIRUVCHI STOLI (peer) — 3 tayyor kartaga hukm chiqarish (52-qonun) =====
// Kartalar TAYYOR beriladi (o'quvchining o'z ishi emas): bittalab ko'riladi — «ishlaydi» yoki
// «tuzatish kerak» + sabab. Ball ham, jazo ham yo'q: noto'g'ri hukmda neytral izoh chiqadi.
// Uchtasi baholangach xulosa-qator uchchalasini bir joyda ko'rsatadi.
const PEER_REASONS = ["ish — mahsulot nomi", "ish — harakat, natija emas", "tur mos emas"];
const PEER_CARDS = [
  {
    em: '📝', mahsulot: 'Notion', ish: "Notion'dan foydalanish", tur: 'funksional', bad: 0,
    ok: "To'g'ri: «ish» o'rnida mahsulot nomining o'zi turibdi.",
    miss: "Bu kartada «ish» o'rnida mahsulot nomi takrorlangan — natija ko'rinmaydi.",
  },
  {
    em: '📱', mahsulot: "Rangli telefon g'ilofi", ish: "do'stlar orasida ajralib turish", tur: 'ijtimoiy', bad: -1,
    ok: "To'g'ri: bu — natija, va turi ham unga mos.",
    miss: "Bu karta aslida ishlaydi: «ajralib turish» — natija, turi ham mos.",
  },
  {
    em: '🚲', mahsulot: 'Velosiped', ish: 'pedal aylantirish', tur: 'funksional', bad: 1,
    ok: "To'g'ri: bu — harakat, natija emas.",
    miss: "Bu kartada harakat yozilgan: pedal aylantirgandan keyin odam nimaga erishadi?",
  },
];
const peerHit = (c, v) => (c.bad < 0 ? v.ok : (!v.ok && v.reason === c.bad));
const ScreenPeer = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorP = !!(live && live.mode === 'mentor');
  const [st, setSt] = useState(() => ({
    idx: storedAnswer && storedAnswer.solved ? PEER_CARDS.length : 0,
    verdicts: storedAnswer?.verdicts || [null, null, null],
    ask: false,
    done: !!(storedAnswer && storedAnswer.solved),
  }));
  const { idx, verdicts, ask, done } = st;
  const judged = verdicts.filter(Boolean).length;
  const card = PEER_CARDS[idx];
  const cur = verdicts[idx] || null;
  const judge = (ok, reason) => {
    const next = verdicts.slice();
    next[idx] = { ok, reason: reason === undefined ? null : reason };
    const nowDone = next.every(Boolean);
    if (nowDone && !done) {
      onAnswer(screen, { stage: 'peer', screenIdx: screen, verdicts: next, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'peer', 0, true, 0);
    }
    setSt(p => ({ ...p, verdicts: next, ask: false, done: p.done || nowDone }));
  };
  const navLabel = done || isMentorP ? 'Davom etish' : `🔍 Yana ${PEER_CARDS.length - judged} kartani baholang`;
  return (
    <Stage eyebrow="Tekshiruvchi stoli · 🔍" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentorP} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="jpeer-head fade-up">
          <h2 className="title h-title" style={{ margin: 0 }}>Uch kartani <span className="italic" style={{ color: T.accent }}>tekshiring.</span></h2>
          <span className="jpeer-prog" aria-label={`${Math.min(idx + 1, PEER_CARDS.length)} / ${PEER_CARDS.length}`}>
            {PEER_CARDS.map((_, i) => <i key={i} className={i < judged ? 'on' : ''} aria-hidden="true">●</i>)}
            <b>{Math.min(idx + 1, PEER_CARDS.length)}/{PEER_CARDS.length}</b>
          </span>
        </div>
        <Mentor>Bu kartalarni boshqalar yozgan — har biriga o'zingiz hukm chiqaring.</Mentor>

        {idx < PEER_CARDS.length ? (
          <div className="jpeer-desk">
            <div key={idx} className={`jpeer-card ${cur ? (peerHit(card, cur) ? 'hit' : 'note') : ''}`}>
              <span className="jpeer-em" aria-hidden="true">{card.em}</span>
              <div className="jpeer-rows">
                <div className="jpeer-r"><i>mahsulot</i><b>{card.mahsulot}</b></div>
                <div className="jpeer-r"><i>ish</i><b>{card.ish}</b></div>
                <div className="jpeer-r"><i>tur</i><span className={`jbook-tur ${card.tur}`}>{card.tur}</span></div>
              </div>
            </div>

            {!cur && !ask && (
              <div className="jpeer-acts fade-step">
                <button className="jpeer-btn yes" onClick={() => judge(true)}>✓ ishlaydi</button>
                <button className="jpeer-btn no" onClick={() => setSt(p => ({ ...p, ask: true }))}>✕ tuzatish kerak</button>
              </div>
            )}
            {!cur && ask && (
              <div className="jpeer-why fade-step">
                <span className="jpeer-wq">Nimasini tuzatasiz?</span>
                <div className="jpeer-chips">
                  {PEER_REASONS.map((r, i) => (
                    <button key={i} className="jpeer-chip" onClick={() => judge(false, i)}>{r}</button>
                  ))}
                  <button className="jpeer-chip back" onClick={() => setSt(p => ({ ...p, ask: false }))}>↩︎ ortga</button>
                </div>
              </div>
            )}
            {cur && (
              <div className="jpeer-fb fade-step">
                <p className={`jpeer-fbt ${peerHit(card, cur) ? 'hit' : 'note'}`}>
                  <b aria-hidden="true">{peerHit(card, cur) ? '✅' : '💡'}</b> {peerHit(card, cur) ? card.ok : card.miss}
                </p>
                <button className="jpeer-next" onClick={() => setSt(p => ({ ...p, idx: p.idx + 1, ask: false }))}>
                  {idx < PEER_CARDS.length - 1 ? 'Keyingisi ▸' : 'Xulosa ▸'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="jpeer-sum fade-up">
            {PEER_CARDS.map((c, i) => {
              const v = verdicts[i] || { ok: true, reason: null };
              return (
                <div key={i} className={`jpeer-srow ${peerHit(c, v) ? 'hit' : 'note'}`}>
                  <span className="jpeer-sem" aria-hidden="true">{c.em}</span>
                  <span className="jpeer-sname">{c.mahsulot}</span>
                  <span className="jpeer-sish">«{c.ish}»</span>
                  <span className={`jpeer-sv ${v.ok ? 'y' : 'n'}`}>{v.ok ? '✓ ishlaydi' : `✕ ${PEER_REASONS[v.reason]}`}</span>
                </div>
              );
            })}
            {/* F-0725-02: «shu ko'z bilan qarang» ko'chma ma'nosi olib tashlandi — harakat-tili (42-qonun). */}
            <p className="jpeer-sfoot">Endi o'z kartangizda ham shu kamchiliklarni qidiring.</p>
          </div>
        )}

        <MentorPracticeStats live={live} screen={screen} label="🔍 Baholab bo'lganlar" />
        <StudentPracticePulse live={live} screen={screen} />
        <MentorNote>Bu ishni o'quvchilar bajaradi — «🔍 Baholab bo'lganlar» panelida kuzatasiz; «Davom etish» siz uchun ochiq. Ball qo'yilmaydi: maqsad — tekshiruvchi ko'zini mashq qilish, 2-3 daqiqa yetadi.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== MIJOZ TALABI (clinic) — qisqa talabdan TO'LIQ karta yig'ish + 2 tuzoq (52-qonun) =====
// TEST-3 dan keyin darhol qo'llash: mijoz bir og'iz gapiradi, o'quvchi bo'laklardan kartani yig'adi.
// Tuzoqlar mazmunan JTBD-xatolari: harakatni natija deb ko'rsatish · mahsulot nomini «ish» deb ko'rsatish.
const FIX_SLOTS = [
  { key: 'mahsulot', label: 'mahsulot' },
  { key: 'ish', label: 'ish' },
  { key: 'tur', label: 'tur' },
];
const FIX_POOL = [
  { txt: 'quloqchin', slot: 0 },
  { txt: "yo'lda zerikmaslik", slot: 1 },
  { txt: 'emotsional', slot: 2 },
  { txt: 'quloqchinni taqib olish', slot: 1, trap: "Bu — harakatning o'zi. Taqib olgandan keyin odam nimaga erishadi? O'sha javob — ish." },
  { txt: 'eng yangi model quloqchin', slot: 1, trap: 'Bu — mahsulot nomi. Ish esa mahsulot beradigan natija.' },
];
const FIX_ORDER = [3, 0, 4, 2, 1]; // barqaror aralash tartib (StrictMode-safe)
const ScreenClinic = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorC = !!(live && live.mode === 'mentor');
  const [st, setSt] = useState(() => ({ placed: storedAnswer?.placed || [null, null, null], sel: -1, shake: -1, trapMsg: null, burned: storedAnswer?.burned || [] }));
  const { placed, sel, shake, trapMsg, burned } = st;
  const done = placed.every(p => p !== null);
  const pickChip = (idx) => {
    const f = FIX_POOL[idx];
    if (burned.includes(idx) || placed[f.slot] === f.txt) return;
    setSt(prev => ({ ...prev, sel: prev.sel === idx ? -1 : idx, shake: -1, trapMsg: null }));
  };
  const trySlot = (slotIdx) => {
    if (placed[slotIdx] !== null || sel < 0) return;
    const frag = FIX_POOL[sel];
    if (frag.trap) {
      setSt(prev => ({ ...prev, sel: -1, shake: slotIdx, trapMsg: frag.trap, burned: [...prev.burned, sel] }));
      setTimeout(() => setSt(prev => (prev.shake === slotIdx ? { ...prev, shake: -1 } : prev)), 480);
      return;
    }
    if (frag.slot === slotIdx) {
      const next = [...placed]; next[slotIdx] = frag.txt;
      setSt(prev => ({ ...prev, placed: next, sel: -1, shake: -1, trapMsg: null }));
      if (next.every(p => p !== null) && (storedAnswer === undefined || !storedAnswer.solved)) {
        onAnswer(screen, { stage: 'clinic', screenIdx: screen, placed: next, burned, solved: true, correct: true });
        if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'clinic', 0, true, 0);
      }
    } else {
      setSt(prev => ({ ...prev, shake: slotIdx }));
      setTimeout(() => setSt(prev => (prev.shake === slotIdx ? { ...prev, shake: -1 } : prev)), 480);
    }
  };
  return (
    <Stage eyebrow="Foydalanuvchi talabi · 🩺" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentorC} label={done || isMentorC ? 'Davom etish' : '🩺 Talabni kartaga aylantiring'} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Bu talabni <span className="italic" style={{ color: T.accent }}>to'liq kartaga</span> aylantiring.</h2></div>
        <div className="jfix-quote fade-up">
          <span className="jfix-quote-who">💬 Foydalanuvchi aytdi:</span>
          <p className="jfix-quote-txt">«Menga yaxshi quloqchin kerak!»</p>
        </div>
        <Mentor>U faqat mahsulotni aytdi, nima uchun kerakligini aytmadi. Bo'lakni bosing, so'ng joyiga bosing — orasida <b style={{ color: T.ink }}>2 ta tuzoq</b> bor, lekin tuzoqqa tushsangiz ball yo'qotmaysiz.</Mentor>
        <div className="jfix-line fade-up delay-1">
          <span className="jfix-w">Foydalanuvchi</span>
          {FIX_SLOTS.map((s, i) => (
            <React.Fragment key={s.key}>
              <button
                className={`jfix-slot ${s.key} ${placed[i] ? 'filled' : ''} ${shake === i ? 'shake' : ''} ${sel >= 0 && placed[i] === null ? 'targetable' : ''}`}
                disabled={placed[i] !== null}
                onClick={() => trySlot(i)}
              >{placed[i] || s.label}</button>
              <span className="jfix-w">{i === 0 ? 'ni' : i === 1 ? 'uchun yollaydi. Turi:' : ''}</span>
            </React.Fragment>
          ))}
        </div>
        {trapMsg && <div className="jfix-trap fade-step">🪤 Tuzoqqa tushdingiz — ball yo'qolmadi, bu bo'lak endi kerak emas. {trapMsg}</div>}
        {!done && <div className="jfix-pool fade-up delay-2">
          {FIX_ORDER.map((idx) => {
            const f = FIX_POOL[idx];
            if (placed[f.slot] === f.txt) return null;
            const isBurned = burned.includes(idx);
            return <button key={idx} className={`jfix-chip ${sel === idx ? 'sel' : ''} ${isBurned ? 'burned' : ''}`} disabled={isBurned} onClick={() => pickChip(idx)}>{isBurned ? '🪤 ' : ''}{f.txt}</button>;
          })}
        </div>}
        {done && (
          <div className="done-mini fade-step">✅ Karta to'liq bo'ldi! <span className="dm-sub">— endi unda natija ham, turi ham bor{burned.length > 0 ? ` (${burned.length} ta tuzoq yo'lda chiqdi — endi tanib olasiz)` : ' (bitta tuzoqqa ham tushmadingiz! 👏)'}</span></div>
        )}
        {/* F-0725-02 (👦 topilmasi): tuzoqqa TUSHMAGAN o'quvchi ham ularni ko'rsin — aks holda ekran-niyati
            («ikki tuzoqni tanib oladi») faqat adashgan bolada bajariladi. */}
        {done && (
          <div className="clinic-traps fade-step">
            <span className="ct-lbl">🪤 Bu ikkitasi tuzoq edi</span>
            {FIX_POOL.filter(f => f.trap).map((f, i) => (
              <p key={i} className="ct-row"><b>«{f.txt}»</b> — {f.trap}</p>
            ))}
          </div>
        )}
        <MentorPracticeStats live={live} screen={screen} label="🩺 Kartani yig'ib bo'lganlar" />
        <StudentPracticePulse live={live} screen={screen} />
        <MentorNote>Bu ishni o'quvchilar bajaradi — «🩺 Kartani yig'ib bo'lganlar» panelida kuzatasiz; «Davom etish» siz uchun ochiq. Tuzoqlar ataylab qo'yilgan: «quloqchinni taqib olish» (harakat) va «eng yangi model quloqchin» (mahsulot nomi). Tuzoqqa tushish — xato emas, darsning o'zi: kim tushganini so'rab, sababini muhokama qiling.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== PRIORITET-DOSKA (priority) — qaysi «ish»dan boshlash (52-qonun) =====
// PM-ko'nikma: hammasini birdan qilib bo'lmaydi — «Hozir» ustuniga FAQAT BITTA karta sig'adi.
// Tanlov localStorage'da saqlanadi — keyingi dars (mijozlar bilan suhbat) shu yerdan boshlaydi.
const PRIORITY_KEY = 'pm-m7d2-priority';
const PD_COLS = [
  { k: 'hozir', t: '🔥 Hozir', sub: "faqat bitta — eng muhimi", cap: 1 },
  { k: 'keyin', t: '📌 Keyin', sub: 'shu haftada qilaman', cap: 2 },
  { k: 'keyinroq', t: '🌙 Keyinroq', sub: "kutib tursa ham bo'ladi", cap: 2 },
];
const ScreenPriority = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorPr = !!(live && live.mode === 'mentor');
  const [cards] = useState(() => { const j = readFullJobs(); return j.length ? j : DEMO_JTBD; });
  const [isDemo] = useState(() => readFullJobs().length === 0);
  const [st, setSt] = useState(() => {
    let saved = storedAnswer?.assign;
    if (!saved) { try { saved = JSON.parse(localStorage.getItem(PRIORITY_KEY) || 'null'); } catch { saved = null; } }
    const assign = saved || {};
    // Reload-tuzatish (F-0726-02): doska localStorage'dan to'liq tiklansa done ham true —
    // aks holda o'quvchi kartani qo'zg'atmaguncha «Davom etish» qulflanib qolardi.
    const restored = cards.every((_, i) => assign[i]);
    return { assign, sel: -1, shakeCol: null, done: !!(storedAnswer && storedAnswer.solved) || restored };
  });
  const { assign, sel, shakeCol, done } = st;
  useEffect(() => {
    if (done && storedAnswer === undefined) {
      onAnswer(screen, { stage: 'priority', screenIdx: screen, assign: st.assign, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'priority', 0, true, 0);
    }
  }, []); // eslint-disable-line
  const allPlaced = cards.every((_, i) => assign[i]);
  const colItems = (k) => cards.map((_, i) => i).filter(i => assign[i] === k);
  const pickCard = (i) => setSt(prev => ({ ...prev, sel: prev.sel === i ? -1 : i, shakeCol: null }));
  const tryCol = (k) => {
    if (sel < 0) return;
    const col = PD_COLS.find(c => c.k === k);
    const inCol = colItems(k).filter(i => i !== sel).length;
    if (inCol >= col.cap) {
      setSt(prev => ({ ...prev, shakeCol: k }));
      setTimeout(() => setSt(prev => (prev.shakeCol === k ? { ...prev, shakeCol: null } : prev)), 480);
      return;
    }
    const next = { ...assign, [sel]: k };
    try { localStorage.setItem(PRIORITY_KEY, JSON.stringify(next)); } catch {}
    const nowDone = cards.every((_, i) => next[i]);
    if (nowDone && !done) {
      onAnswer(screen, { stage: 'priority', screenIdx: screen, assign: next, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'priority', 0, true, 0);
    }
    setSt(prev => ({ ...prev, assign: next, sel: -1, done: prev.done || nowDone }));
  };
  const hozirIdx = colItems('hozir')[0];
  // 22/30-qonun: qulf-yorlig'i AYNAN nechta karta qolganini aytadi (kartalar soni 3 dan kam ham bo'lishi mumkin)
  const leftN = cards.filter((_, i) => !assign[i]).length;
  return (
    <Stage eyebrow="Muhimini tanlash · 🔥" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentorPr} label={done || isMentorPr ? 'Davom etish' : `🔥 Yana ${leftN} kartani joylang`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Qaysi ishdan boshlashni <span className="italic" style={{ color: T.accent }}>tanlang</span>.</h2></div>
        <Mentor>Mahsulot menejeri (PM) hamma ishni birdan boshlamaydi: bitta ishni yaxshi bajarish — uchtasini yarim qoldirishdan afzal. Avval kartani bosing, so'ng <b style={{ color: T.ink }}>«Hozir»</b> ustuniga.</Mentor>
        {isDemo && <p className="small fade-up" style={{ margin: 0, color: T.ink3, fontStyle: 'italic' }}>Namuna kartalar — ustaxonada yozilganlar shu yerda chiqadi.</p>}
        {cards.some((_, i) => !assign[i]) && (
          <div className="jpri-pool fade-up delay-1">
            {cards.map((c, i) => assign[i] ? null : (
              <button key={i} className={`jpri-card ${sel === i ? 'sel' : ''}`} onClick={() => pickCard(i)}>
                <span className="jpri-card-n">{i + 1}</span>
                <span className="jpri-card-txt"><b style={{ color: T.blue }}>{c.mahsulot}</b> — {c.ish}</span>
              </button>
            ))}
          </div>
        )}
        <div className="jpri-board fade-up delay-2">
          {PD_COLS.map(col => {
            const items = colItems(col.k);
            const full = items.length >= col.cap;
            return (
              <div key={col.k} className={`jpri-col ${col.k} ${shakeCol === col.k ? 'shake' : ''} ${sel >= 0 && !full ? 'targetable' : ''}`} onClick={() => tryCol(col.k)} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') tryCol(col.k); }}>
                <div className="jpri-col-h"><span className="jpri-col-t">{col.t}</span><span className="jpri-col-sub">{col.sub}</span></div>
                {items.map(i => (
                  <button key={i} className={`jpri-card placed ${sel === i ? 'sel' : ''}`} onClick={e => { e.stopPropagation(); pickCard(i); }}>
                    <span className="jpri-card-n">{i + 1}</span>
                    <span className="jpri-card-txt"><b style={{ color: T.blue }}>{cards[i].mahsulot}</b> — {cards[i].ish}</span>
                  </button>
                ))}
                {items.length < col.cap && <div className="jpri-empty">{col.k === 'hozir' ? 'eng muhimi shu yerga' : "bo'sh joy"}</div>}
              </div>
            );
          })}
        </div>
        {shakeCol && (
          <p className="small fade-step" style={{ margin: 0, color: T.accent, fontWeight: 700 }}>
            {shakeCol === 'hozir' ? "«Hozir»ga bitta ish sig'adi — eng muhimini tanlang, qolganini «Keyin»ga qo'ying." : "Bu ustun to'ldi — kartani boshqa ustunga qo'ying."}
          </p>
        )}
        {allPlaced && hozirIdx !== undefined && (
          <div className="done-mini fade-step">✅ Tanlov qilindi! <span className="dm-sub">— keyingi darsda «{cards[hozirIdx].ish}» ishidan boshlaymiz 🚀</span></div>
        )}
        <MentorPracticeStats live={live} screen={screen} label="🔥 Joylashtirib bo'lganlar" />
        <StudentPracticePulse live={live} screen={screen} />
        <MentorNote>Bu ishni o'quvchilar bajaradi — «🔥 Joylashtirib bo'lganlar» panelida kuzatasiz; «Davom etish» siz uchun ochiq. Joylashgan kartani bosib boshqa ustunga ko'chirsa bo'ladi. «Hozir» talashib qolganlarga savol: qaysi ish foydalanuvchiga eng katta foyda beradi?</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7/8 — TEKSHIRUV (MCQ, scored) + SCREEN 9 — JUFTLASH (MatchPairs, YANGI PM PRIMITIV) =====
// 49-qonun (TestQ): katta savol-sarlavha + toza kartochka (faqat tahlil-material) + doira-harfli variantlar.
const TestQ = ({ ask, story, note }) => (
  <div className="jq">
    <h2 className="jq-ask">{ask}</h2>
    {story && <div className="jq-card"><p className="jq-story">{story}</p></div>}
    {note && <p className="jq-note">{note}</p>}
  </div>
);
const Screen7 = (props) => (
  <QuestionScreen {...props} eyebrow="Tekshiruv · ish 1" scope="module-mikro"
    ctaLabel="Javobni tanlang" revealPrefix="To'g'ri javob"
    question={<TestQ ask="Ali aslida qaysi natijaga erishmoqchi?"
      story="Ali formada bo'lishni juda xohlaydi: yugurish poyabzali oldi, fitnes-ilova yukladi, sport soati taqdi." />}
    questionText="Ali qaysi natijaga (ishga) erishmoqchi?"
    options={["Yugurish poyabzali", "Formada bo'lish", "Fitnes-ilova", "Sport soati"]}
    correctIdx={1}
    explainCorrect="To'g'ri: «formada bo'lish» — odam erishmoqchi bo'lgan natija, ya'ni «ish». Poyabzal, ilova va soat esa — shu natijaga yetish uchun ishlatiladigan mahsulotlar."
    explainWrong={{ 0: "Yugurish poyabzali — do'kondan sotib olinadigan mahsulot. «Ish» esa natija — bu yerda u «formada bo'lish».", 2: "Fitnes-ilova ham mahsulot — u «formada bo'lish» natijasiga yetishga yordam beradi, xolos.", 3: "Sport soati ham mahsulot. «Ish» — odam erishmoqchi bo'lgan natija: «formada bo'lish».", default: "Mahsulot nomini emas, odam erishmoqchi bo'lgan natijani — «ish»ni tanlang." }}
  />
);
const Screen8 = (props) => (
  <QuestionScreen {...props} eyebrow="Tekshiruv · ish 2" scope="module-mikro"
    ctaLabel="Javobni tanlang" revealPrefix="To'g'ri javob"
    question={<TestQ ask="Bu qaysi tur ish? Tanlang."
      story="Do'stlar Starbucks'da birga suratga tushishdi va suratni hammaga yuborishdi." />}
    questionText="Suratga tushib yuborish — qaysi tur ish?"
    options={["Funksional", "Emotsional", "Ijtimoiy", "Bu umuman ish emas"]}
    correctIdx={2}
    explainCorrect="To'g'ri, bu — ijtimoiy tur. Suratni do'stlarga yuborish «boshqalar ko'zida qanday ko'rinaman?» degan istakdan chiqadi."
    explainWrong={{ 0: "Funksional tur — «vazifa bitsin» (masalan, o'tirib ishlash). Suratni yuborish esa boshqalarga ko'rinish uchun — bu ijtimoiy tur.", 1: "Emotsional tur — «o'zimni qanday his qilaman». Bu yerda esa gap boshqalarga qanday ko'rinishda — demak, ijtimoiy.", 3: "Bu ham «ish»: do'stlar ko'zida yaxshi ko'rinish. Bunday istak ijtimoiy turga kiradi.", default: "«Boshqalar ko'zida qanday ko'rinaman» — bu ijtimoiy tur." }}
  />
);

// ===== 🔴 YANGI PM PRIMITIV: MatchPairs (juftlash) — StrictMode-safe yagona atomik holat, DOM-transform sudrash + tap =====
// JONLI-BALL KONTRAKTI (darslik-jonli TASDIQLAYDI):
//  · scored; picked = BIRINCHI to'liq urinishda hammasi to'g'ri juftlangan bo'lsa 0, aks holda 1.
//  · INLINE_KEYS.s9 = 0 → server picked===0 ni to'g'ri deb belgilaydi.
//  · submitAnswer(screen, 's9', picked, picked===0, elapsed) — jonli o'quvchida FAQAT bir marta (birinchi to'liq urinish).
//  · Kahoot-reveal: jonlida juftlash QOTADI (locked), ranglar mentor ochguncha yashirin; reveal'da to'g'ri=yashil, xato=qizil.
//  · Self rejimda: birinchi-urinish balli qotadi, o'quvchi to'g'ri yechilguncha davom etadi.
const MP_PAIRS = [
  { chip: 'velosiped', ic: '🚲', job: 'maktabga tez yetib borish', tur: 'funksional' },
  { chip: 'budilnik', ic: '⏰', job: "ertalab vaqtida uyg'onish", tur: 'funksional' },
  { chip: "til o'rgatuvchi ilova", ic: '📱', job: "har kuni oz-ozdan o'rganish odati", tur: 'funksional' },
  { chip: "rangli telefon g'ilofi", ic: '🎨', job: "do'stlar orasida ajralib turish", tur: 'ijtimoiy' },
];
const MP_CHIP_ORDER = [2, 0, 3, 1];   // pool chiplari display tartibi (barqaror — StrictMode-safe)
const MP_TARGET_ORDER = [1, 3, 0, 2]; // nishon-kartalar display tartibi (barqaror)
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student');
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now());
  const [st, setSt] = useState(() => ({
    assign: storedAnswer?.assign ? storedAnswer.assign.slice() : [null, null, null, null],
    sel: null,
    result: storedAnswer ? (storedAnswer.firstResult ?? null) : null, // 0=birinchi urinishda hammasi to'g'ri · 1=xato bo'ldi
    locked: !!(storedAnswer && storedAnswer.locked),
  }));
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
  const [recapOpen, setRecapOpen] = useState(false);
  const dragRef = useRef(null);
  const targetEls = useRef({});
  const hasRecap = !!RECAPS[screen];
  const doReveal = () => { setMReveal(true); if (live) live.mentorReveal(screen); if (storedAnswer === undefined) onAnswer(screen, { mentorRevealed: true }); };
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect(() => { if (isMentorLive && liveRevealScreen === screen) setMReveal(true); }, [isMentorLive, liveRevealScreen, screen]);

  // Mentor (proyektor): javob kaliti FAQAT «Natijani ochish»dan keyin ko'rinadi (Kahoot-reveal) —
  // reveal'gacha kartalar bo'sh turadi, aks holda to'g'ri juftlik ekranda oldindan ochilib qoladi.
  const assign = isMentorLive ? (mReveal ? [0, 1, 2, 3] : [null, null, null, null]) : st.assign;
  const filledAll = assign.every(c => c !== null);
  const allCorrect = filledAll && assign.every((c, t) => c === t);
  const revealed = isMentorLive ? mReveal
    : oneShot ? !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive))
    : st.result !== null;
  const waiting = oneShot && st.result !== null && !revealed;
  const solved = isMentorLive ? true : allCorrect;

  const hitTarget = (x, y) => {
    for (const t of MP_TARGET_ORDER) {
      const el = targetEls.current[t]; if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return t;
    }
    return null;
  };
  const commit = (nextAssign) => {
    const full = nextAssign.every(x => x !== null);
    let result = st.result, locked = st.locked, justFirst = false;
    if (full && result === null) { result = nextAssign.every((c, t) => c === t) ? 0 : 1; locked = oneShot; justFirst = true; }
    setSt({ ...st, assign: nextAssign, sel: null, result, locked });
    const nowSolved = nextAssign.every((c, t) => c === t);
    onAnswer(screen, { stage: 'module-mikro', screenIdx: screen, assign: nextAssign.slice(), firstResult: result, picked: result, correct: result === 0, solved: nowSolved, locked });
    if (justFirst && oneShot && live) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, result, result === 0, Date.now() - mountTs.current);
  };
  const place = (t, c) => {
    if (st.locked || isMentorLive) return;
    const nextAssign = st.assign.slice();
    for (let i = 0; i < nextAssign.length; i++) if (nextAssign[i] === c) nextAssign[i] = null;
    nextAssign[t] = c;
    commit(nextAssign);
  };
  const removeAt = (t) => {
    if (st.locked || isMentorLive || st.assign[t] === null) return;
    const nextAssign = st.assign.slice(); nextAssign[t] = null;
    setSt({ ...st, assign: nextAssign, sel: null });
  };
  const tapChip = (c) => { if (st.locked || isMentorLive) return; setSt({ ...st, sel: st.sel === c ? null : c }); };
  const tapTarget = (t) => {
    if (st.locked || isMentorLive) return;
    if (st.sel !== null) place(t, st.sel);
    else if (st.assign[t] !== null) removeAt(t);
  };
  const onChipPointerDown = (e, c) => {
    if (st.locked || isMentorLive) return;
    const el = e.currentTarget; try { el.setPointerCapture(e.pointerId); } catch {}
    dragRef.current = { c, el, x0: e.clientX, y0: e.clientY, moved: false };
  };
  const onChipPointerMove = (e) => {
    const d = dragRef.current; if (!d) return;
    const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
    if (!d.moved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) d.moved = true;
    if (d.moved) {
      d.el.style.transform = `translate(${dx}px, ${dy}px) scale(1.05) rotate(2.5deg)`; d.el.style.zIndex = '60'; d.el.style.position = 'relative';
      const over = hitTarget(e.clientX, e.clientY);
      for (const t of MP_TARGET_ORDER) { const el = targetEls.current[t]; if (el) el.classList.toggle('dragover', t === over); }
    }
  };
  const clearDragOver = () => { for (const t of MP_TARGET_ORDER) { const el = targetEls.current[t]; if (el) el.classList.remove('dragover'); } };
  const onChipPointerUp = (e) => {
    const d = dragRef.current; if (!d) return;
    dragRef.current = null; clearDragOver();
    d.el.style.transform = ''; d.el.style.zIndex = ''; d.el.style.position = '';
    if (!d.moved) { tapChip(d.c); return; }
    const t = hitTarget(e.clientX, e.clientY);
    if (t !== null) place(t, d.c);
  };

  const pool = MP_CHIP_ORDER.filter(c => !assign.includes(c));
  const navDisabled = isMentorLive ? !mReveal : (oneShot ? st.result === null : !solved);
  const navLabel = isMentorLive ? (mReveal ? 'Davom etish' : 'Avval natijani oching')
    : oneShot ? (st.result === null ? 'Hammasini juftlang' : 'Davom etish')
    : (solved ? 'Davom etish' : "To'g'ri juftlang");

  return (
    <Stage eyebrow="Tekshiruv · juftlash" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={navDisabled} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.4vw,22px)' }}>
        <div className="fade-up">
          <TestQ ask="Har mahsulotni o'z ishi bilan juftlang."
            note="3 kartangiz tayyor — endi bilimingizni yangi 4 mahsulotda sinaymiz. Mahsulot nomini o'z ishi ustiga torting yoki nomni bosib tanlang, so'ng kartani bosing." />
        </div>
        {oneShot && st.result === null && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>⚡ Jonli dars — bitta urinish, o'ylab juftlang!</p>}
        <div className="mp-wrap fade-up delay-1">
          <div className="mp-decor" aria-hidden="true">{['ISH?', 'JTBD', 'drel va natija', 'funksional', 'ijtimoiy', 'emotsional'].map((t, k) => <span key={k} className={`mp-decor-t md${k}`}>{t}</span>)}</div>
          <div className="mp-targets">
            {MP_TARGET_ORDER.map(t => {
              const c = assign[t];
              const isPlaced = c !== null && c !== undefined;
              const correctHere = isPlaced && c === t;
              let cls = 'mp-target';
              if (isPlaced) { cls += revealed ? (correctHere ? ' ok' : ' bad') : ' filled'; }
              else if (st.sel !== null && !isMentorLive) cls += ' droppable';
              return (
                <div key={t} ref={el => { if (el) targetEls.current[t] = el; }} className={cls} onClick={() => tapTarget(t)}>
                  <div className="mp-target-job"><span className="mp-target-lbl">ISH</span><span className="mp-target-txt">{MP_PAIRS[t].job}</span><span className={`mp-tur ${MP_PAIRS[t].tur}`}>{MP_PAIRS[t].tur}</span></div>
                  <div className="mp-slot">
                    {isPlaced
                      ? <span className={`mp-chip placed ${revealed ? (correctHere ? 'ok' : 'bad') : ''}`}><span className="mp-chip-ic">{MP_PAIRS[c].ic}</span>{MP_PAIRS[c].chip}{revealed && (correctHere ? <span className="mp-mark ok">✓</span> : <span className="mp-mark bad">✕</span>)}</span>
                      : <span className="mp-slot-empty">{isMentorLive ? '🙈 «Natijani ochish»da ko\'rinadi' : 'bu yerga torting'}</span>}
                    {revealed && correctHere && <span className="mp-burst" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map(k => <span key={k} style={{ '--ba': `${k * 60}deg` }}>✦</span>)}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          {!isMentorLive && (
            <div className="mp-pool">
              <span className="flow-label">Mahsulot nomlari — torting yoki tanlang</span>
              <div className="mp-pool-row">
                {pool.length === 0 ? <span className="mp-pool-done">Hammasi joylandi ✓</span> : pool.map(c => (
                  <button key={c} type="button" className={`mp-chip pool ${st.sel === c ? 'sel' : ''}`} style={{ touchAction: 'none' }}
                    onPointerDown={e => onChipPointerDown(e, c)} onPointerMove={onChipPointerMove} onPointerUp={onChipPointerUp}>
                    <span className="mp-chip-ic">{MP_PAIRS[c].ic}</span>{MP_PAIRS[c].chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : st.result !== null} isCorrect={isMentorLive ? true : (revealed && allCorrect)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || allCorrect) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive ? "✓ To'g'ri juftlik" : waiting ? '📨 Javobingiz qabul qilindi' : allCorrect ? "Hammasi to'g'ri!" : (revealed ? "Ba'zilari xato" : "Qaytadan urinib ko'ring")}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive ? "Har mahsulot o'z natijasi uchun yollanadi: velosiped tez yetish uchun, budilnik uyg'onish uchun, ilova o'rganish odati uchun, rangli g'ilof esa ajralib turish uchun (ijtimoiy)."
              : waiting ? "Hozir mentor natijani ochadi — to'g'ri juftliklar yashil bo'ladi."
              : allCorrect ? "Zo'r! Har mahsulot o'z «ishi» bilan to'g'ri juftlandi."
              : "Qizil juftlarni qayta joylang — har mahsulot bitta «ish»ga yollanadi."}
          </p>
          {hasRecap && !isMentorLive && st.result === 1 && revealed && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>📖 Qisqa takrorlash — mavzuni yana bir ko'rish</button>
          )}
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={["To'g'ri juftladi", "Xato bo'ldi"]} correctIdx={0} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
        <MentorNote>Hamma juftlab bo'lmaguncha natijani OCHMANG. Reveal'dan keyin xato juftlarni birga muhokama qiling — nega bu mahsulot o'sha «ish»ga tushmadi.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — KODING: «3 kartangiz — React komponent» (VS Code'da o'z MVP loyihasiga) =====
// M7 o'quvchisi React (M3) va o'z MVP loyihasini biladi — shu bois JS-kompilyator emas, REAL VS Code
// topshirig'i: tayyor JtbdCard skeletini nusxalab, o'z loyihasida 3 kartasini komponent qilib chiqaradi.
// WOW: kdJobs() — o'quvchining USTAXONADA yozgan real 3 kartasi (JOBS_KEY) preview-panelda komponent
// ko'rinishida chiqadi; bo'sh bo'lsa namunaviy DEMO_JTBD ishlatiladi.
// Ball-rels O'ZGARMAGAN: onAnswer({stage:'koding',...}) + live.submitAnswer(PRACTICE_BASE+screen,'koding',0,true,0).
const KD_STEPS = [
  "Loyihamni VS Code'da ochdim",
  "`src` papkasida `JtbdCard.jsx` yaratdim",
  "Karta 3 ma'lumot oladi",
  "Brauzerda 3 kartam ko'rindi",
];
const kdJobs = () => {
  const saved = readJobs();
  // Buzuq/yarim yozuvlar (null, bo'sh maydon) o'tkazilmaydi — 3 TO'LIQ karta bo'lsagina o'quvchiniki,
  // aks holda chiroyli namuna-kartalar (DEMO_JTBD). Preview hech qachon bo'sh/singan chiqmaydi.
  const full = (saved || []).filter(c => c && typeof c === 'object' && (c.mahsulot || '').trim() && (c.ish || '').trim() && c.tur);
  return full.length >= 3 ? full.slice(0, 3) : DEMO_JTBD; // sanoq-mosligi: doim aynan 3 karta
};
// Ko'chirib olsa bo'ladigan boshlang'ich kod — App-chaqiruvlar o'quvchining O'Z kartalaridan yig'iladi.
const kdCode = (jobs, own) => `function JtbdCard({ mahsulot, ish, tur }) {
  return (
    <div className="jtbd-card">
      <h3>{mahsulot}</h3>
      <p>Ishi: {ish}</p>
      <span className="tur">{tur}</span>
    </div>
  );
}

export default JtbdCard;

// App.jsx ichida — ${own ? 'sizning 3 kartangiz' : 'namunaviy 3 karta'}:
${jobs.map(j => `// <JtbdCard mahsulot="${j.mahsulot}" ish="${j.ish}" tur="${j.tur}" />`).join('\n')}`;
// 🔎 MIKRO-TEKSHIRUV: BITTA prop (tur) ataylab tushirilgan variant — App-chaqiruvlar tur'ni beradi,
// komponent esa qabul qilmaydi. O'quvchi yetishmagan propni topgach to'liq kod ochiladi.
const kdCodeBroken = (jobs, own) => `function JtbdCard({ mahsulot, ish }) {
  return (
    <div className="jtbd-card">
      <h3>{mahsulot}</h3>
      <p>Ishi: {ish}</p>
    </div>
  );
}

export default JtbdCard;

// App.jsx ichida — ${own ? 'sizning 3 kartangiz' : 'namunaviy 3 karta'}:
${jobs.map(j => `// <JtbdCard mahsulot="${j.mahsulot}" ish="${j.ish}" tur="${j.tur}" />`).join('\n')}`;
const KD_PROP_OPTS = ['mahsulot', 'ish', 'tur'];
const KD_MISSING_IDX = 2; // 'tur' — komponent imzosida yashiringan prop
const KD_PROP_KEY = 'pm-m7d2-kd-prop';
// Mini sintaksis-bo'yoq (VS Code-mockup uchun) — faqat ko'rinish, kod bajarilmaydi.
const KD_TOKEN = /("[^"]*"|\/\/.*$|\b(?:function|return|export|default)\b|<\/?[A-Za-z][\w.]*|\{|\})/g;
const kdHl = (ln) => ln.split(KD_TOKEN).filter(p => p !== undefined && p !== '').map((p, i) => {
  if (p.startsWith('//')) return <span key={i} style={{ color: '#6A9955' }}>{p}</span>;
  if (p.startsWith('"')) return <span key={i} style={{ color: '#CE9178' }}>{p}</span>;
  if (/^(function|return|export|default)$/.test(p)) return <span key={i} style={{ color: '#C586C0' }}>{p}</span>;
  if (/^<\/?[A-Z]/.test(p)) return <span key={i} style={{ color: '#4EC9B0' }}>{p}</span>;
  if (/^<\/?[a-z]/.test(p)) return <span key={i} style={{ color: '#569CD6' }}>{p}</span>;
  if (p === '{' || p === '}') return <span key={i} style={{ color: '#FFD70A' }}>{p}</span>;
  return <span key={i}>{p}</span>;
});

const ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [jobs] = useState(() => kdJobs());
  const isOwn = jobs !== DEMO_JTBD;
  const [checked, setChecked] = useState(() => new Set(storedAnswer && storedAnswer.solved ? KD_STEPS.map((_, i) => i) : []));
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const [copied, setCopied] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  // 🔎 Prop-ov: found=true bo'lguncha kod BUZUQ variantda (tur yashirin); MENTOR darhol to'liq ko'radi.
  const [found, setFound] = useState(() => {
    if (storedAnswer && storedAnswer.solved) return true;
    try { return localStorage.getItem(KD_PROP_KEY) === '1'; } catch { return false; }
  });
  const [justFound, setJustFound] = useState(false);
  const [wrongProp, setWrongProp] = useState(null);
  const wrongTimer = useRef(null);
  useEffect(() => () => clearTimeout(wrongTimer.current), []);
  const showFull = found || isMentor;
  const code = showFull ? kdCode(jobs, isOwn) : kdCodeBroken(jobs, isOwn);
  const pickProp = (k) => {
    if (showFull) return;
    if (k === KD_MISSING_IDX) {
      setFound(true); setJustFound(true);
      try { localStorage.setItem(KD_PROP_KEY, '1'); } catch {}
      setChecked(prev => { const s = new Set(prev); s.add(2); return s; }); // «Karta 3 ma'lumot oladi» bandi avto-✓
    } else {
      setWrongProp(k);
      clearTimeout(wrongTimer.current);
      wrongTimer.current = setTimeout(() => setWrongProp(null), 650);
    }
  };
  const toggle = (i) => { if (done) return; setChecked(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; }); };
  const allChecked = checked.size === KD_STEPS.length;
  const copy = () => {
    if (!showFull) return;
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
    <Stage eyebrow="Koding · ⚛️ React" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? 'Davom etish' : allChecked ? '«✅ Bajardim»ni bosing' : !found ? '① Yetishmaganini toping' : `Qadamlarni belgilang (${checked.size}/${KD_STEPS.length})`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.3vw,13px)' }}>
        <div className="head"><h2 className="title h-title fade-up">3 kartangizni <span className="italic" style={{ color: T.accent }}>React komponenti</span> qiling.</h2></div>
        <Mentor>Pastdagi kodni nusxalab, <b style={{ color: T.ink }}>VS Code</b>'da (kod yoziladigan dastur) loyihangizga qo'ying.</Mentor>
        <div className="jprev fade-up delay-1">
          <div className="jprev-bar"><span className="bb-dots"><i /><i /><i /></span><span className="jprev-url">localhost:5173 — loyihangiz brauzerda</span><span className="jprev-note">Komponent — bir marta yoziladi, har kartada ishlaydi.</span><span className={`jprev-src ${isOwn ? 'own' : 'demo'}`}>{isOwn ? '✓ sizning 3 kartangiz' : 'namunaviy 3 karta'}</span></div>
          <div className="jprev-cards">
            {jobs.map((j, i) => (
              <div key={i} className="jprev-card">
                <span className="jprev-top">
                  <span className="jprev-name">{j.em ? `${j.em} ` : ''}{j.mahsulot}</span>
                  <span className={`jprev-tur ${j.tur}`}>{j.tur}</span>
                </span>
                <span className="jprev-job">Ishi: <b>{j.ish}</b></span>
              </div>
            ))}
          </div>
        </div>
        <div className="split">
          <Col>
            {/* 32c: prop-ov + muharrir BITTA blok bo'lib ko'rinadi — ekranda alohida karta ko'paymaydi */}
            <div className="jkd-code fade-up delay-1">
            <div className={`kdq ${showFull ? 'ok' : ''}`}>
              {isMentor ? (
                <span className="kdq-done">✓ To'liq kod — o'quvchida avval <code className="qcode">tur</code> ma'lumoti yashiringan bo'ladi</span>
              ) : found ? (
                <span className="kdq-done">✓ Topdingiz: kartaga <code className="qcode">tur</code> berilmagan edi — kod to'ldi</span>
              ) : (
                <>
                  <span className="kdq-lbl">🔎 Kartaga uzatiladigan 3 ma'lumotdan qaysisi yo'q?</span>
                  <div className="kdq-chips">
                    {KD_PROP_OPTS.map((p, k) => (
                      <button key={p} type="button" className={`kdq-chip ${wrongProp === k ? 'miss' : ''}`} onClick={() => pickProp(k)}><code className="qcode">{p}</code></button>
                    ))}
                  </div>
                  {wrongProp !== null && <span className="kdq-lbl">Bu birinchi qatorda bor — qolgan ikkitasini solishtiring.</span>}
                </>
              )}
            </div>
            <div className={`vsc ${justFound ? 'reveal-glow' : ''}`}>
              <div className="vsc-bar">
                <span className="vsc-tab on"><span style={{ color: '#61DAFB' }}>⚛</span> JtbdCard.jsx</span>
                <span className="vsc-tab">App.jsx</span>
                <button className={`vsc-copy ${copied ? 'ok' : ''}`} disabled={!showFull} onClick={copy}>{copied ? '✓ Nusxalandi' : showFull ? '📋 Nusxalash' : '🔒 Avval toping'}</button>
              </div>
              <div className="vsc-body">
                {lines.map((ln, i) => (
                  <div key={i} className="vsc-line"><span className="vsc-ln">{i + 1}</span><span className="vsc-code">{ln ? kdHl(ln) : ' '}</span></div>
                ))}
              </div>
            </div>
            </div>
          </Col>
          <Col>
            {/* 32c: o'ng ustun BITTA holat-panelga yig'ildi — sarlavha + progress + qadamlar + tugma */}
            <div className={`jkd-panel fade-up delay-2 ${done ? 'is-done' : ''}`}>
              <div className="jkd-phead">
                <p className="flow-label">Kompyuterda bajarib belgilang</p>
                <span className={`jkd-pcnt ${allChecked ? 'ok' : ''}`}>{checked.size}/{KD_STEPS.length}</span>
              </div>
              <div className="jkd-pbar"><i style={{ width: `${(checked.size / KD_STEPS.length) * 100}%` }} /></div>
              <div className="kd-steps">
                {KD_STEPS.map((s, i) => {
                  const on = checked.has(i);
                  return (
                    <button key={i} className={`kd-step ${on ? 'on' : ''}`} onClick={() => toggle(i)}>
                      <span className="kd-check">{on ? '✓' : i + 1}</span>
                      <span className="kd-step-t">{fmtCode(s)}</span>
                    </button>
                  );
                })}
              </div>
              <div className={`wsx star ${starOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setStarOpen(o => !o)}>💡 Yordam {starOpen ? '▾' : '▸'}</button>
                {starOpen && <div className="wsx-body">
                  <p><code className="qcode">src</code> — loyihangizdagi kod fayllari turadigan papka; yangi fayl ham shu yerga yaratiladi.</p>
                  <p>Loyihangiz hali yo'qmi? VS Code'da yangi papka oching — fayllarni shunga yozing.</p>
                  <p>⭐ Qo'shimcha: 3 kartani <b>map</b> bilan birdaniga chiqaring: <span className="mono">{'jobs.map(j => <JtbdCard ... />)'}</span></p>
                </div>}
              </div>
              <button className={`lp-done-btn ${done ? 'is-done' : ''}`} disabled={done || !allChecked} onClick={complete}>
                {done ? '✓ Bajarildi — ustozni kuting' : allChecked ? '✅ Bajardim' : 'Qadamlarni belgilang'}
              </button>
              <StudentPracticePulse live={live} screen={screen} />
              {done && <div className="done-mini fade-step">✅ JtbdCard tayyor <span className="dm-sub">— {isOwn ? '3 kartangiz' : 'namunaviy 3 karta'} endi loyihangizda</span></div>}
            </div>
            <MentorPracticeStats live={live} screen={screen} label="⚛️ Komponentni qurganlar" />
          </Col>
        </div>
        <MentorNote>Bu kodingni o'quvchilar bajaradi — «⚛️ Komponentni qurganlar» panelida kuzatasiz; «Davom etish» siz uchun ochiq. Eng ko'p adashish — ma'lumot nomlari va Katta harf (JtbdCard). Ulgurmagan o'quvchi uyda tugatadi (qisqa uy-vazifa). Xohlasangiz proyektorda o'z VS Code'ingizda jonli ko'rsating.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — RECAP: 3 qadam-karta (juftlik-taymer + Reflection + 3 tez savol) =====
const REFLECT_KEY = 'pm-m7d2-reflection';
// Juftlik-taymeri (P0 etalon): 60s = avval A gapiradi (30s), keyin B (30s) — kim gapirayotgani
// doim ko'rinadi (🎙 puls), o'rta-marker progress, «✓ Vaqt tugadi» holati.
function PairTimer({ solo }) {
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
            <span className="pair-now"><span className="pair-mic" aria-hidden="true">🎙</span> {solo ? 'Hozir ovoz chiqarib ayting' : <>Hozir <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span> gapiradi{isA ? ' — keyin B' : ''}</>}</span>
            <span className="pair-clock">{solo ? st.left : (isA ? st.left - 30 : st.left)}s</span>
          </div>
          <div className="pair-prog"><span className="pair-prog-fill" style={{ width: `${((60 - st.left) / 60) * 100}%` }} /><i className="pair-prog-mid" aria-hidden="true" /></div>
        </>
      ) : (
        <p className="pair-now" style={{ margin: 0 }}>{st.done ? (solo ? "✓ Vaqt tugadi — aytib bo'ldingizmi? Barakalla!" : "✓ Vaqt tugadi — ikkalangiz ham aytdingizmi? Barakalla!") : (solo ? "Gapni ovoz chiqarib o'zingizga ayting." :"Har biringizga 30 soniyadan: avval A gapiradi, keyin B.")}</p>
      )}
      <div className="pair-timer-btns">
        {!st.running && <button className="btn-soft" onClick={() => setSt({ running: true, left: 60, done: false })}>{st.done ? '↻ Yana 1 daqiqa' : '▶ 1 daqiqani boshlash'}</button>}
        {st.running && <button className="btn-soft" onClick={() => setSt({ running: false, left: 60, done: false })}>⏹ To'xtatish</button>}
      </div>
    </div>
  );
}
const Screen11 = ({ screen, onNext, onPrev }) => {
  const gate11 = useContext(LiveGateCtx) || {};
  const live11 = gate11.live;
  const isSolo = !live11 || live11.mode === 'self';
  const [text, setText] = useState(() => { try { return localStorage.getItem(REFLECT_KEY) || ''; } catch { return ''; } });
  const save = (v) => { setText(v); try { localStorage.setItem(REFLECT_KEY, v); } catch {} };
  const written = text.trim().length >= 8;
  return (
    <Stage eyebrow="Mustahkamlash · 2 qadam" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label="Davom etish" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">MVP'ingiz qaysi <span className="italic" style={{ color: T.accent }}>ish</span>ga yollanadi — va nega?</h2></div>
        <Mentor>Endi o'rganganingizni o'zingiz takrorlaysiz — ikki qadamni birma-bir bajaring.</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">{isSolo ? '🗣 Ovoz chiqarib ayting' : '🗣 Juftlikda ayting'}</span><span className="rcp-s">«Mening MVP'im … ishi uchun kerak, chunki …» {isSolo ? '— 1 daqiqa o\'zingizga' : '— 30 soniyada rol almashadi'}</span></div></div>
            <PairTimer solo={isSolo} />
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">✍️ Bir qator yozing</span><span className="rcp-s">Hozirgina aytganingizni bitta gapga sig'diring</span></div></div>
            <input className="reflect-input" value={text} onChange={e => save(e.target.value)} placeholder="Mening MVP'im ... ishi uchun kerak, chunki ..." maxLength={160} />
            {written && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>✓ Yozildi — keyingi darsda foydalanuvchi bilan suhbatni shu gapdan boshlaymiz.</p>}
          </div>
          {/* F-0725-01 · 54-qonun: 3-qadam (sinf-savollari / solo o'z-o'zini tekshirish) O'CHIRILDI — P0 da bu qadam
              ataylab olib tashlangan: mustahkamlash = ayting + yozing, uchinchi qatlam ekranni og'irlashtiradi. */}
        </div>
        <MentorNote>Soft: juftlikda «mening MVP'im qaysi ishga yollanadi» mini-pitch. «Ish»ni mahsulot ta'rifi bilan aralashtirsalar — velosiped misolini qayta tushuntiring (keysni emas, sodda misolni).</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — UYGA VAZIFA «SHARTNOMA»: MVP ishini KIMDAN so'rashni SHU YERDA tanlash =====
// Tanlov localStorage'ga (HW_KEY) yoziladi — summary va keyingi dars o'qishi mumkin.
const HW_KEY = 'pm-m7d2-hw-target';
// F-0725-01 · 57-qonun: chip-qiymatlari SIZ-formada — ular gap ichiga qo'yiladi
// («ota-onamga o'qib bering» = shaxs-nomuvofiqligi; to'g'risi «ota-onangizga o'qib bering»).
const HW_TARGETS = ["sinfdoshingiz", "ota-onangiz", "do'stingiz"];
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
  return (
    <Stage eyebrow="Uyga vazifa" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label="Davom etish" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">MVP ishini <span className="italic" style={{ color: T.accent }}>kimdan</span> so'rab tekshirasiz?</h2></div>
        <Mentor>Uyda <b style={{ color: T.ink }}>3 ta karta</b> yozasiz — avval kimdan so'rashingizni tanlang.</Mentor>
        <div className="hw-chips fade-up delay-1">
          {HW_TARGETS.map(t => (
            <button key={t} className={`hw-chip ${target === t && !customMode ? 'on' : ''}`} onClick={() => pick(t)}>{t}</button>
          ))}
          <button className={`hw-chip add ${customMode ? 'on' : ''}`} onClick={openCustom}>➕ o'zim yozaman</button>
        </div>
        {customMode && (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input className="reflect-input" value={custom} onChange={e => setCustom(e.target.value)} placeholder="masalan: o'qituvchim, akam, ilk foydalanuvchim…" maxLength={40} autoFocus />
            <p className="small" style={{ margin: 0, color: T.ink2 }}>Kimdan so'rasangiz — o'shani yozing. Bitta so'z yetadi.</p>
          </div>
        )}
        {chosen ? (
          <div className="split">
            {/* F-0725-02 (👦 topilmasi): qaysi karta kimga tegishli ekani O'QUVCHI matnida aytiladi — avval buni faqat MentorNote bilardi. */}
            <div className="hw-card full fade-step">
              <span className="hw-badge">To'liq · ~20 daqiqa</span>
              <p className="body" style={{ color: T.ink }}>Kodni sinfda tugatgan bo'lsangiz — pastdagi 3 qadamni bajaring.</p>
            </div>
            <div className="hw-card short fade-step">
              <span className="hw-badge short">Qisqa · ~10 daqiqa</span>
              <p className="body" style={{ color: T.ink }}>Kod uyga qolgan bo'lsa — avval uni tugating, so'ng bitta karta yozib <b>{chosen}</b>ga o'qib bering.</p>
            </div>
          </div>
        ) : (
          <div className="frame-soft fade-up delay-2"><p className="body" style={{ margin: 0, color: T.ink }}>👆 Kimdan so'raysiz? Masalan: sinfdoshingizdan yoki ota-onangizdan — birini tanlang, vazifa-karta shunga moslashadi.</p></div>
        )}
        {/* 53-qonun: uy-vazifa qadamlari tiqilmaydi — raqam-doirali 3 alohida qator */}
        <div className="pmtask-steps fade-up delay-2">
          <span className="pmtask-step"><i>1</i><b>{chosen || 'tanlagan odamingiz'}</b>dan so'rab, 3 ta karta yozing</span>
          <span className="pmtask-step"><i>2</i>har kartada ish natija bo'lsin — mahsulot nomi emas</span>
          <span className="pmtask-step"><i>3</i>eng kuchlisini belgilang va sababini yozing</span>
        </div>
        <MentorNote>Koding sinfda tugagan bo'lsa — to'liq versiya (3 JTBD); koding uyga ketgan bo'lsa — qisqa versiya (1 funksional JTBD). Ro'yxat: 3/3 = o'tdi · 2/3 = to'ldiradi · kam = qayta.</MentorNote>
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES — REAL bosqichlar uchun (tekin emas). Har 4 nishonning triggeri bajariladigan harakat:
// cardMaster = ustaxonada «✅ Bajardim» (3/3 karta) · jobHunter = 3 tekshiruvda ham javob berib yechish ·
// toolMaker = koding-checklist «✅ Bajardim» · graduate = yakun-ekraniga yetish (LESSON ROOT'da earn).
const ACHIEVEMENTS = {
  cardMaster: { icon: '🃏', name: 'Card Master!', desc: "Ustaxonada 3/3 JTBD-karta tuzdingiz" },
  jobHunter:  { icon: '🎯', name: 'Job Hunter!',  desc: "3 tekshiruvni ham yechib chiqdingiz" },
  toolMaker:  { icon: '🛠️', name: 'Tool Maker!',  desc: "JtbdCard React-komponentini yasadingiz" },
  graduate:   { icon: '🎓', name: 'Level Up!',    desc: "Jobs-to-be-Done darsini yakunladingiz" },
};
// Ekran id → nishon (recordAnswer'da, faqat REAL solve bilan). jobHunter = 3 test aggregat, graduate = summary.
const ACH_TRIGGERS = { practice: 'cardMaster', s10: 'toolMaker' };

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

// Podium savol yorliqlari (YANGI SCORED_IDX indekslariga mos — 4/6/9 = s7/s8/s9)
const Q_LABELS = { 4: "1 — Ish?", 6: "2 — Tur?", 9: "3 — Juftlash" };
const QUIZ_MS = 15000;
// Arena fon tokenlari — darsning "DNK"si (JTBD atamalari). Arena platforma mahsuloti — brendi qoladi.
const QZ_BG_SHAPES = [
  { ch: 'ISH?',       l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: 'JTBD',       l: 85, t: 8,  s: 28, d: 23, dl: 1.5 },
  { ch: 'drel',       l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'natija',     l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: 'funksional', l: 44, t: 86, s: 18, d: 25, dl: 1.1 },
  { ch: 'ijtimoiy',   l: 66, t: 26, s: 20, d: 17, dl: 0.4 },
  { ch: 'emotsional', l: 24, t: 34, s: 18, d: 20, dl: 1.9 },
  { ch: 'raqib',      l: 55, t: 5,  s: 22, d: 22, dl: 0.6 },
  { ch: 'yollandi',   l: 91, t: 42, s: 20, d: 24, dl: 1.3 },
  { ch: '☕',        l: 16, t: 52, s: 28, d: 26, dl: 2.6 },
  { ch: '🎯',        l: 2,  t: 30, s: 30, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3). darslik-jonli TASDIQLAYDI.
const QUIZ_BANK = [
  { q: "Jobs-to-be-Done (JTBD) g'oyasi nima?", opts: ["Ko'proq imkoniyat qo'shsa mahsulot yaxshi bo'ladi", "Mahsulotni doim arzonlashtirish kerak", "Har foydalanuvchiga alohida ilova kerak", "Odamlar mahsulotni emas, u bajaradigan «ish»ni sotib oladi"], correct: 3 },
  { q: "«Hech kim drelni (devor teshadigan asbobni) o'zi uchun olmaydi» — odam aslida nimani sotib oladi?", opts: ["drelning yangi qutisini", "devorga osilgan rasmni", "drel uchun batareyani", "drel haqidagi reklamani"], correct: 1 },
  { q: "Qaysi biri odam erishmoqchi bo'lgan natija («ish»)?", opts: ["formada bo'lish", "yugurish poyabzali", "fitnes-ilova", "sport soati"], correct: 0 },
  { q: "«Vazifa bitsin» (masalan, manzilga yetib borish) — bu qaysi tur ish?", opts: ["ijtimoiy", "emotsional", "funksional", "hech qanday tur"], correct: 2 },
  { q: "«Boshqalar ko'zida qanday ko'rinaman» — bu qaysi tur ish?", opts: ["ijtimoiy", "funksional", "emotsional", "texnik"], correct: 0 },
  { q: "«O'zimni qanday his qilaman» — bu qaysi tur ish?", opts: ["funksional", "ijtimoiy", "emotsional", "ijtimoiy-funksional"], correct: 2 },
  { q: "Starbucks o'zini qanday joy deb ko'rsatadi?", opts: ["eng arzon qahvaxona", "eng tez qahvaxona", "faqat kofe sotadigan oddiy do'kon", "«uchinchi joy» — uy ham, maktab ham emas"], correct: 3 },
  { q: "Starbucks misolida odamlar aslida nimaga pul to'laydi?", opts: ["faqat kofe ta'miga", "joy va muhitga", "chegirmalarga", "stakan dizayniga"], correct: 1 },
  { q: "Do'stlar Starbucks'da birga suratga tushib yuborishdi — bu qaysi tur ish?", opts: ["funksional", "emotsional", "ijtimoiy", "bu umuman ish emas"], correct: 2 },
  { q: "Velosipedning «maktabga tez yetish» ishida raqibi kim?", opts: ["boshqa velosiped", "velosiped do'koni", "velosiped narxi", "avtobus va piyoda yo'l"], correct: 3 },
  { q: "«Foydalanuvchi mahsulotni bir ISH uchun yollaydi» — bu yerdagi «ish» nima?", opts: ["mahsulotning rasmiy nomi", "foydalanuvchi bitiradigan vazifa", "mahsulotning bozor narxi", "mahsulotning tashqi rangi"], correct: 1 },
  { q: "Nega foydalanuvchi bilan suhbat savollarini «ish»lardan tuzamiz?", opts: ["Chunki odam mahsulotni emas, ishni xohlaydi", "Chunki savol tuzish osonroq bo'ladi", "Chunki foydalanuvchi aynan shuni talab qiladi", "Tartib farq qilmaydi"], correct: 0 },
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
    const TOK = ['ISH?', 'JTBD', 'drel', 'natija', 'funksional', 'ijtimoiy', 'emotsional', 'raqib', 'yollandi', '☕'];
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
        <div className="head"><h2 className="title h-title fade-up">{isLive ? <>Bugungi <span className="italic" style={{ color: T.accent }}>g'oliblarimiz</span></> : <>Sizning <span className="italic" style={{ color: T.accent }}>natijangiz</span></>}</h2></div>
        {!isLive ? (
          (() => {
            // Solo-rejim: shaxsiy progress — ScoreRing + nishonlar + yollash-doskasi holati
            const achN = achievements ? achievements.size : 0;
            const jobsNow = readJobs() || [];
            const hiredN = [0, 1, 2].filter(k => { const c = jobsNow[k]; return c && validateJob(c.mahsulot, c.ish, c.tur).full; }).length;
            return (
              <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                <ScoreRing correct={selfCorrect} total={totalQ} />
                <div className="solo-stats fade-up d1">
                  <span className="solo-chip">🏅 Nishonlar: <b>{achN}</b>/{Object.keys(ACHIEVEMENTS).length}</span>
                  <span className={`solo-chip ${hiredN === 3 ? 'ok' : ''}`}>📌 Kartalarim: <b>{hiredN}</b>/3 YOLLANDI</span>
                </div>
                <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>Bu — sizning shaxsiy natijangiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.</p></div>
              </div>
            );
          })()
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
  // Sanoq-mosligi (ETALON 22): sarlavha o'quvchi REAL yozgan karta sonini aytadi —
  // jonli darsda 1-2 karta bilan o'tib ketgan bo'lsa ham yolg'on tasdiq chiqmaydi.
  const [jobsN] = useState(() => { try { return readFullJobs().length; } catch { return 0; } });
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
    "Jobs-to-be-Done: odamlar mahsulotni emas, u bajaradigan «ish»ni sotib oladi",
    "Har «ish» uch turli: funksional · ijtimoiy · emotsional",
    "Hech kim drelni drel uchun olmaydi — odamga devordagi NATIJA (osilgan rasm) kerak",
    "Starbucks «uchinchi joy» ishini sotadi — joy va muhit",
    "Har mahsulotning raqibi — o'sha «ish»ni bajaradigan boshqa yo'l"
  ];
  const hwTarget = (() => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } })();
  const HOMEWORK = [
    { b: hwTarget ? `${hwTarget}dan` : 'Kimdan?', t: hwTarget ? "— so'rab, MVP ishingizni tekshiring" : "— MVP ishini kimdan so'rashni tanlang" },
    { b: '3 karta', t: "— har turdan bittadan: funksional · ijtimoiy · emotsional" },
    { b: 'Eng kuchli', t: "— 3 tadan eng kuchlisini bir asos bilan belgilang" }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow="Tayyor" screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Qaytadan</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Yakunlash ✓</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> Dars tugadi</span><h2 className="title h-title fade-up d1">{jobsN > 0 ? <>{jobsN} ta <span className="italic" style={{ color: T.accent }}>JTBD-kartangiz</span> tayyor.</> : isMentorL ? <>Sinf <span className="italic" style={{ color: T.accent }}>JTBD-kartalarini</span> yozdi.</> : <><span className="italic" style={{ color: T.accent }}>JTBD-kartani</span> endi o'zingiz yozasiz.</>}</h2>{/* F-0725-01 · 54-qonun: yakun-hero'ning h-sub qatori o'chirildi — sarlavha o'zi yetadi, pastda «Endi siz bilasiz» ro'yxati bor (P0 bilan bir xil). */}</div>{!isMentorL && <ScoreRing correct={correct} total={total} />}</div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? '⏳ Mentorni kuting' : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> Endi siz bilasiz</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>📝 Uyga vazifa</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{hwTarget ? <>Tanlovingiz: <b style={{ color: T.accent }}>{hwTarget}</b>dan so'rab, MVP uchun 3 ta karta.</> : "MVP'ingiz uchun 3 ta karta — har turdan bittadan:"}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>))}</ul><p className="hw-note">Keyingi darsda foydalanuvchilar bilan suhbat savollarini aynan shu «ish»lardan tuzamiz! 🚀</p></div>
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
export default function PmJtbdLesson({ lang: langProp, onFinished }) {
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
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); }; // F-0725-04: balandlik ham hisobda — past ekranda zum kattalashtirib vertikal joyni yemasin
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
    // 🏅 jobHunter — 3 tekshiruvda ham javob berib yechganda (scored indekslar 4/6/9 = s7/s8/s9).
    // Shart «birinchi urinishda to'g'ri» EMAS (aks holda bitta xato nishonni butunlay yopib qo'yardi) —
    // har uch testda real javob berilgani yetarli. Ball-relsga tegmaydi (earn — faqat mahalliy nishon).
    if (SCORED_IDX.every(i => nextA[i] && nextA[i].picked != null)) earn('jobHunter');
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

  // V4 tartib — SCREEN_META bilan bir xil (17 ekran):
  // s0,s1,s2,s3,TEST1(s7),s4,TEST2(s8),ustaxona,tekshiruv-stoli,TEST3(s9),mijoz-talabi,koding,prioritet,recap,uyga,podium,summary
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen7, Screen4, Screen8, ScreenJobWorkshop, ScreenPeer, Screen9, ScreenClinic, ScreenCoding, ScreenPriority, Screen11, Screen12, ScreenPodium, Screen16];
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
        .option:hover:not(:disabled) { background: #FBFAFE; box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.24); transform: translateY(-2px); }
        .option:hover:not(:disabled) .jq-abc { background: ${T.accent}; color: #fff; }
        .option:active:not(:disabled) { transform: translateY(0) scale(0.995); }
        .option:disabled { cursor: default; }
        @media (prefers-reduced-motion: reduce) { .option:hover:not(:disabled), .option:active:not(:disabled) { transform: none; } }
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

        /* === HOOK: TO'LAYOTGAN KOFE-STAKANLAR (dars imzosi — pm-dizayn sayqallaydi) === */
        .cofsh-shelf { display: flex; flex-direction: column; gap: 12px; background: linear-gradient(180deg, ${T.paper}, #FBFAFE); border-radius: 18px; padding: clamp(16px,2.4vw,22px) clamp(12px,2vw,20px) clamp(12px,1.8vw,16px); box-shadow: 0 10px 28px -12px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.line}; }
        .cofsh-row { display: flex; align-items: flex-end; justify-content: space-around; gap: clamp(6px,1.4vw,16px); position: relative; padding-bottom: 8px; border-bottom: 2px solid ${T.line}; }
        .cofsh { --sk0: #6F4E37; --sk1: #A9825E; --sk2: #C69C6D; --sk3: #8C6239; display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; min-width: 0; position: relative; }
        .cofsh-crown { position: absolute; top: -22px; font-size: clamp(15px,2.4vw,20px); animation: float-sm 2.4s ease-in-out infinite; }
        .cofsh-pct { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(13px,1.9vw,17px); color: ${T.ink}; font-variant-numeric: tabular-nums; }
        .cofsh.mine .cofsh-pct { color: ${T.accent}; }
        .cofsh-vessel { position: relative; width: clamp(40px,8.4vw,64px); display: flex; justify-content: center; padding-top: 16px; }
        .cofsh-glass { position: relative; width: 100%; height: clamp(78px,15vw,118px); background: linear-gradient(90deg, rgba(255,255,255,0.55), rgba(230,226,244,0.4) 50%, rgba(255,255,255,0.55)); border: 2px solid ${T.line}; border-top: none; clip-path: polygon(7% 0, 93% 0, 83% 100%, 17% 100%); overflow: hidden; box-shadow: inset 0 -6px 14px rgba(${T.shadowBase},0.08); transition: box-shadow 0.25s; }
        .cofsh.mine .cofsh-vessel .cofsh-glass { box-shadow: inset 0 -6px 14px rgba(${T.shadowBase},0.1), 0 0 0 2px ${T.accent}77; }
        .cofsh-fill { position: absolute; left: 0; right: 0; bottom: 0; background: var(--sk, ${T.accent}); background-image: linear-gradient(180deg, rgba(255,255,255,0.3), rgba(0,0,0,0.06)); transition: height 1s cubic-bezier(.34,1.15,.4,1); box-shadow: inset 0 3px 5px rgba(255,255,255,0.4); }
        /* krem-qatlam — kofe ustidagi ko'pik/sut chizig'i */
        .cofsh-fill::after { content: ""; position: absolute; top: 0; left: -2%; right: -2%; height: 7px; background: linear-gradient(180deg, rgba(255,250,242,0.95), rgba(233,219,199,0.45)); border-radius: 40% 40% 46% 46% / 100% 100% 30% 30%; box-shadow: 0 1px 3px rgba(${T.shadowBase},0.1); }
        .cofsh-lid { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 80%; height: 20px; background: radial-gradient(circle at 32% 38%, #fff, #F1EAF7); border-radius: 50% 50% 42% 42%; box-shadow: 0 -2px 4px rgba(255,255,255,0.85), 0 3px 5px rgba(${T.shadowBase},0.14); z-index: 3; }
        /* bug'-chiziqchalar — issiq kofe hissi: uchta yumshoq oq wisp yuqoriga ko'tariladi */
        .cofsh-steam { position: absolute; top: -1px; left: 50%; width: 4px; height: 28px; transform: translateX(-50%); z-index: 2; border-radius: 3px; background: linear-gradient(180deg, rgba(255,255,255,0), rgba(214,208,236,0.8) 55%, rgba(255,255,255,0)); filter: blur(0.7px); animation: cofsh-steam-main 3s ease-in-out infinite; }
        .cofsh-steam::before, .cofsh-steam::after { content: ""; position: absolute; top: 3px; width: 3.5px; height: 22px; border-radius: 3px; background: linear-gradient(180deg, rgba(255,255,255,0), rgba(214,208,236,0.65) 55%, rgba(255,255,255,0)); filter: blur(0.7px); }
        .cofsh-steam::before { left: -7px; height: 20px; animation: cofsh-wisp 3.4s ease-in-out 0.5s infinite; }
        .cofsh-steam::after { left: 7px; height: 17px; animation: cofsh-wisp 2.6s ease-in-out 0.9s infinite; }
        @keyframes cofsh-steam-main { 0%,100% { transform: translateX(-50%) translateY(2px); opacity: 0.35; } 50% { transform: translateX(-50%) translateY(-5px); opacity: 0.8; } }
        @keyframes cofsh-wisp { 0%,100% { transform: translateY(2px); opacity: 0.2; } 50% { transform: translateY(-5px); opacity: 0.6; } }
        .cofsh-abc { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; color: ${T.ink3}; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 7px; background: ${T.bg}; }
        .cofsh.mine .cofsh-abc { color: #fff; background: ${T.accent}; }
        .cofsh-cap { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; text-align: center; }
        @media (prefers-reduced-motion: reduce) { .cofsh-fill { transition: none; } .cofsh-crown, .cofsh-steam, .cofsh-steam::before, .cofsh-steam::after { animation: none; } .cofsh-steam { opacity: 0.55; } .hook-mc.taphint { animation: none; } }
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
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar bir-birining ustiga chiqib ketardi (klinika 11/17 dalili). */
        .screen > * { flex-shrink: 0; }
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

        /* === 📇 «ISHGA QABUL» (maqsad s1) — vakansiya-karta CSS-taymlayn bilan to'ladi + YOLLANDI shtampi === */
        .jhire-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(10px,1.8vw,16px); }
        @media (max-width: 760px) { .jhire-grid { grid-template-columns: 1fr; } }
        .jhire-card { position: relative; background: linear-gradient(180deg, #fff, #FBFAFE); border-radius: 14px; padding: 13px 15px 34px; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; overflow: hidden; opacity: 0; animation: jhire-in 0.5s ease-out forwards; animation-delay: var(--cd, 0s); }
        .jhire-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}); }
        @keyframes jhire-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .jhire-top { display: flex; align-items: center; gap: 8px; padding-bottom: 9px; border-bottom: 1.5px dashed ${T.line}; }
        .jhire-em { font-size: clamp(20px,2.6vw,26px); line-height: 1; }
        .jhire-nm { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .jhire-doc { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 8.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink3}; flex-shrink: 0; }
        .jhire-rows { display: flex; flex-direction: column; gap: 7px; padding-top: 10px; }
        .jhire-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .jhire-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 9.5px; letter-spacing: 0.06em; width: 68px; flex-shrink: 0; color: ${T.ink3}; }
        .jhire-row.kim .jhire-lbl { color: ${T.blue}; } .jhire-row.nima .jhire-lbl { color: #B77A16; } .jhire-row.natija .jhire-lbl { color: ${T.success}; }
        /* qiymat «yozilib» to'ladi — steps() bilan mashinka-effekt */
        .jhire-val { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink}; white-space: nowrap; overflow: hidden; max-width: 0; animation: jhire-type 0.5s steps(14, end) forwards; animation-delay: var(--fd, 1s); }
        @keyframes jhire-type { from { max-width: 0; } to { max-width: 220px; } }
        /* «✓ YOLLANDI» shtampi — indigo doira-oval, katta→kichik bosilish + qisqa silkinish */
        .jhire-stamp { position: absolute; right: 10px; bottom: 8px; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; letter-spacing: 0.1em; color: ${T.accent}; border: 3px solid ${T.accent}; border-radius: 999px; padding: 4px 12px; background: rgba(235,229,253,0.55); opacity: 0; transform: rotate(-8deg) scale(2.6); animation: jhire-stamp-in 0.55s cubic-bezier(.2,1.2,.3,1) forwards; animation-delay: var(--fd, 2s); pointer-events: none; }
        @keyframes jhire-stamp-in { 0% { opacity: 0; transform: rotate(-8deg) scale(2.6); } 55% { opacity: 1; transform: rotate(-8deg) scale(0.94); } 70% { transform: rotate(-5.5deg) scale(1.06); } 84% { transform: rotate(-9deg) scale(0.99); } 100% { opacity: 1; transform: rotate(-8deg) scale(1); } }
        /* ustaxona mini-shtampi — s1 bilan bitta vizual til */
        .jhire-stamp.mini { position: static; margin-left: auto; flex-shrink: 0; font-size: 9.5px; padding: 2px 8px; border-width: 2px; transform: rotate(-6deg); opacity: 1; animation: jhire-stamp-in 0.45s cubic-bezier(.2,1.2,.3,1); }
        /* doskadagi saqlangan kartaning shtampi — karta uchib kelgach bosiladi (kechikish bilan) */
        .jhire-stamp.mini.jb { font-size: 8.5px; padding: 2px 8px; animation: jhire-stamp-in 0.5s cubic-bezier(.2,1.2,.3,1) var(--sd, 0.34s) both; }
        /* ustaxona yakunlangach muharrir o'rnidagi «uch shtampli varaq» */
        .jw-done { background: ${T.paper}; border-radius: 16px; border-left: 5px solid ${T.success}; padding: clamp(16px,2.4vw,22px); display: flex; flex-direction: column; align-items: flex-start; gap: 14px; box-shadow: 0 12px 30px -12px rgba(18,169,104,0.3); min-width: 0; }
        .jw-done-stamps { display: flex; flex-wrap: wrap; gap: 8px; }
        .jw-done .jhire-stamp.mini.jb { margin-left: 0; font-size: 10px; padding: 4px 12px; }

        @media (prefers-reduced-motion: reduce) {
          .jhire-card, .jhire-val, .jhire-stamp, .jhire-stamp.mini, .jhire-stamp.mini.jb, .jhire-stamp.mini.hb { animation: none; opacity: 1; }
          .jhire-card { transform: none; } .jhire-val { max-width: 220px; }
          .jhire-stamp { transform: rotate(-8deg); } .jhire-stamp.mini { transform: rotate(-6deg); }
        }

        /* === PROYEKTOR SAVOL + MISOL (yadro) === */
        .proj-q { background: ${T.paper}; border-radius: 14px; padding: clamp(16px,2.5vw,22px); box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); display: flex; flex-direction: column; gap: 8px; border-left: 4px solid ${T.accent}; }
        .proj-q-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .proj-q-body { font-size: clamp(16px,2.3vw,20px); font-weight: 500; color: ${T.ink}; line-height: 1.4; margin: 0; }
        .ex-card { background: ${T.successSoft}; border-radius: 14px; padding: clamp(14px,2.2vw,18px); display: flex; flex-direction: column; gap: 10px; }
        .ex-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.success}; }
        .ex-body { font-size: clamp(15px,2vw,18px); color: ${T.ink}; margin: 0; line-height: 1.45; }
        /* === 📱 TELEFON EKRANI (s2) — ilova-ikonka 3D-flip: ortida ISHI === */
        .jphone { position: relative; align-self: center; width: min(100%, 560px); background: linear-gradient(180deg, ${T.paper}, #F6F3FE); border-radius: 26px; padding: clamp(26px,3.4vw,32px) clamp(14px,2.4vw,22px) clamp(12px,1.8vw,16px); box-shadow: 0 14px 34px -14px rgba(${T.shadowBase},0.3), inset 0 0 0 2px ${T.line}; display: flex; flex-direction: column; gap: 12px; }
        .jphone-notch { position: absolute; top: 9px; left: 50%; transform: translateX(-50%); width: 84px; height: 8px; border-radius: 99px; background: ${T.line}; }
        .jphone-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(10px,1.8vw,14px); }
        @media (max-width: 520px) { .jphone-grid { grid-template-columns: 1fr; } }
        .japp { position: relative; background: none; border: none; padding: 0; cursor: pointer; perspective: 800px; min-height: clamp(112px,15vw,128px); }
        .japp:disabled { cursor: default; }
        .japp-inner { position: absolute; inset: 0; display: block; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(.3,1.35,.4,1); }
        .japp.open .japp-inner { transform: rotateY(180deg); }
        .japp:not(.open):hover .japp-inner { transform: rotateY(16deg); }
        .japp-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; border-radius: 16px; padding: 10px; }
        .japp-front { background: ${T.paper}; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; }
        .japp-back { transform: rotateY(180deg); background: ${T.accentSoft}; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.3), inset 0 0 0 2px ${T.accent}; }
        .japp-ic { font-size: clamp(30px,4.6vw,38px); line-height: 1; }
        .japp-nm { font-family: 'Manrope'; font-weight: 700; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink2}; }
        .japp-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 9.5px; letter-spacing: 0.12em; color: ${T.accent}; }
        .japp-job { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(13px,1.7vw,15.5px); color: ${T.ink}; text-align: center; line-height: 1.3; }
        /* bosilmagan ikonkada taphint-puls */
        .japp.taphint .japp-front { animation: japp-hint 2.2s ease-in-out infinite; }
        .japp.taphint:nth-child(2) .japp-front { animation-delay: 0.35s; } .japp.taphint:nth-child(3) .japp-front { animation-delay: 0.7s; }
        @keyframes japp-hint { 0%,86%,100% { box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; } 93% { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.32), inset 0 0 0 2px ${T.accent}66; transform: translateY(-2px); } }
        .jphone-cap { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12px,1.4vw,13.5px); color: ${T.ink2}; text-align: center; }
        @media (prefers-reduced-motion: reduce) {
          .japp-inner { transition: none; }
          .japp.taphint .japp-front { animation: none; }
          .japp:not(.open):hover .japp-inner { transform: none; }
        }

        /* === K18 SLAYD (s4) === */
        .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; flex-shrink: 0; }
        .k-slide::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}, ${T.blue}); }
        .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
        .k-slide-ic { font-size: clamp(40px,7vw,64px); line-height: 1; }
        .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(20px,3.2vw,30px); color: ${T.ink}; margin: 0; }
        .k-slide-body { font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; } .k-slide-body b { color: ${T.ink}; }
        .k-dots { display: flex; gap: 8px; justify-content: center; }
        .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }
        /* «uchinchi joy» mini-diagramma: uy → ☕ → maktab */
        .k-slide-diagram { display: flex; align-items: center; justify-content: center; gap: clamp(5px,1.4vw,12px); flex-wrap: wrap; margin-top: 6px; }
        .ksd-node { display: flex; flex-direction: column; align-items: center; gap: 4px; background: ${T.bg}; border-radius: 13px; padding: 10px 15px; box-shadow: inset 0 0 0 1.5px ${T.line}; min-width: clamp(70px,14vw,90px); }
        .ksd-node.mid { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; transform: translateY(-5px); }
        .ksd-ic { font-size: clamp(23px,3.8vw,30px); line-height: 1; }
        .ksd-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(10.5px,1.3vw,12px); color: ${T.ink2}; }
        .ksd-node.mid .ksd-lbl { color: ${T.accent}; }
        .ksd-arrow { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px,2.2vw,20px); color: ${T.ink3}; }

        /* === STORY MINI-EDITOR / USTAXONA === */
        .swcard-fields { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        @media (max-width: 620px) { .swcard-fields { grid-template-columns: 1fr; } }
        @keyframes card-fill-pop { 0% { transform: scale(1); } 40% { transform: scale(1.012) translateY(-2px); } 100% { transform: scale(1); } }
        .smini-f { display: flex; flex-direction: column; gap: 4px; }
        .smini-f span { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.06em; color: ${T.ink3}; }
        .smini-f.kim span { color: ${T.blue}; } .smini-f.nima span { color: #B77A16; } .smini-f.natija span { color: ${T.success}; }
        .smini-f input { font-family: 'Manrope'; font-weight: 500; font-size: 14px; color: ${T.ink}; border: none; border-radius: 9px; padding: 9px 11px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.18s; width: 100%; }
        .smini-f input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .smini-f.on input { box-shadow: inset 0 0 0 1.5px ${T.success}66; background: ${T.paper}; }
        @keyframes hc-cond-pop { 0% { transform: scale(1); } 42% { transform: scale(1.015) translateY(-1px); } 100% { transform: scale(1); } }
        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes jfix-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 55% { transform: translateX(5px); } 80% { transform: translateX(-2px); } }

        /* === 🧪 SCORED TEST (TestQ, 49-qonun): savol-sarlavha + toza kartochka + doira-harf ===
           JTBD imzosi: kartochka «ish shartnomasi» qog'ozidek — chap-accent hoshiya + burchak-buklama. */
        .jq { display: flex; flex-direction: column; gap: clamp(12px,2vw,18px); width: 100%; }
        /* F-0725-01 · 55-qonun: SAVOL yonida vertikal hoshiya YO'Q — accent-hoshiya faqat hikoya-kartochkasida (P0 .tq-ask bilan aynan bir xil). */
        .jq-ask { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16.5px,2.2vw,21px); line-height: 1.3; letter-spacing: -0.005em; color: ${T.ink}; margin: 0; }
        .jq-card { position: relative; background: ${T.paper}; border-radius: 16px; padding: clamp(20px,3vw,28px) clamp(20px,3vw,30px); box-shadow: 0 14px 34px -14px rgba(${T.shadowBase},0.22); border-left: 5px solid ${T.accent}; overflow: hidden; min-width: 0; }
        /* burchak-buklama: hujjat/karta hissi (dekor o'qitadi — «bu bir karta») */
        .jq-card::after { content: ""; position: absolute; right: 0; top: 0; border-width: 0 20px 20px 0; border-style: solid; border-color: ${T.bg} ${T.accentSoft}; border-radius: 0 0 0 4px; }
        .jq-story { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(17px,2.4vw,23px); line-height: 1.55; color: ${T.ink}; margin: 0; overflow-wrap: anywhere; }
        .jq-note { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink2}; }
        .jq-abc { width: 27px; height: 27px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; background: ${T.accentSoft}; color: ${T.accent}; transition: background 0.2s, color 0.2s; }
        .jq-abc.ok { background: ${T.success}; color: #fff; animation: jq-abc-pop 0.36s cubic-bezier(.3,1.5,.5,1); }
        .jq-abc.bad { background: ${T.err}; color: #fff; animation: jq-abc-pop 0.36s cubic-bezier(.3,1.5,.5,1); }
        .jq-abc.dim { background: ${T.bg}; color: ${T.ink3}; }
        @keyframes jq-abc-pop { 0% { transform: scale(0.72); } 48% { transform: scale(1.22); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .jq-abc.ok, .jq-abc.bad { animation: none; } }

        /* === ✍️ USTAXONA (48-qonun): bitta karta-muharrir + «Kartalarim» doskasi ===
           IMZO-VIZUAL: muharrir — to'ldirilayotgan «ish shartnomasi» varag'i; uchala maydon to'lganda
           shtamp-o'rni yonadi, «Saqlash» bosilgach karta o'ngdagi doskaga UCHIB o'tadi va shtamp bosiladi. */
        .jw-ed { position: relative; background: ${T.paper}; border-radius: 16px; padding: clamp(16px,2.4vw,22px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 12px 30px -10px rgba(${T.shadowBase},0.2); border-left: 5px solid ${T.accent}; min-width: 0; }
        .jw-ed::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; border-radius: 0 16px 0 0; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}); opacity: 0.85; }
        .jw-tag { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; padding: 4px 12px; border-radius: 99px; color: ${T.accent}; background: ${T.accentSoft}; }
        /* shtamp-o'rni: bo'sh kartada xira-punktir «kutmoqda», to'lganda accent'da yonadi (tap-hint: endi saqlasa bo'ladi) */
        .jw-stampzone { position: absolute; right: clamp(12px,2vw,18px); top: clamp(12px,2vw,16px); font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 9.5px; letter-spacing: 0.1em; padding: 3px 9px; border-radius: 999px; border: 2px dashed ${T.ink3}66; color: ${T.ink3}; background: transparent; opacity: 0.45; transform: rotate(-6deg); transition: all 0.3s cubic-bezier(.3,1.3,.5,1); pointer-events: none; }
        .jw-stampzone.ready { border-style: solid; border-color: ${T.accent}; color: ${T.accent}; background: rgba(235,229,253,0.6); opacity: 1; animation: jw-stamp-ready 1.6s ease-in-out infinite; }
        @keyframes jw-stamp-ready { 0%,100% { transform: rotate(-6deg) scale(1); box-shadow: 0 0 0 0 rgba(91,61,230,0.28); } 50% { transform: rotate(-6deg) scale(1.045); box-shadow: 0 0 0 7px rgba(91,61,230,0); } }
        @media (max-width: 520px) { .jw-stampzone { display: none; } }
        .jw-sent { font-family: Georgia, serif; font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.6; margin: 0; min-width: 0; overflow-wrap: anywhere; padding-bottom: 10px; border-bottom: 1.5px dashed ${T.line}; }
        .jw-part { font-weight: 600; font-style: italic; color: ${T.ink3}; opacity: 0.75; }
        .jw-part.on { font-style: normal; opacity: 1; }
        .jw-part.mahsulot.on { color: ${T.blue}; } .jw-part.ish.on { color: #B77A16; } .jw-part.tur.on { color: ${T.success}; }
        .jw-hint { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; line-height: 1.45; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; overflow-wrap: anywhere; min-width: 0; }
        .jw-btns { display: flex; gap: 12px; justify-content: flex-end; align-items: center; flex-wrap: wrap; }
        .jw-cnt { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 12px; color: ${T.ink3}; }
        .jw-save { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 13px 26px; background: ${T.accent}; color: #fff; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.55); transition: all 0.18s; }
        .jw-save:hover:not(:disabled) { background: ${T.accentVivid}; transform: translateY(-1px); }
        .jw-save:disabled { background: ${T.accentSoft}; color: ${T.accent}; opacity: 0.55; box-shadow: none; cursor: not-allowed; transform: none; }
        /* 📒 Kartalarim doskasi — «yollash daftari»: bo'sh o'rinlar punktir, to'lgani yashil + YOLLANDI shtampi */
        .jbook { position: relative; background: linear-gradient(180deg, ${T.paper}, #FBFAFE); border-radius: 16px; padding: 15px 16px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.16); min-width: 0; }
        .jbook-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-bottom: 9px; border-bottom: 1.5px dashed ${T.line}; }
        .jbook-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 14px; color: ${T.ink3}; background: ${T.bg}; border-radius: 99px; padding: 3px 11px; transition: all 0.25s; }
        .jbook-n.ok { color: ${T.success}; background: ${T.successSoft}; }
        .jbook-slot { display: flex; align-items: center; gap: 10px; border: 1.5px dashed ${T.ink3}55; border-radius: 12px; padding: 12px 14px; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink3}; font-style: italic; }
        .jbook-slot-n { width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; font-style: normal; color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.ink3}44; }
        /* saqlangan karta CHAPDAN uchib keladi — «muharrirdan doskaga ko'chdi» hissi */
        .jbook-card { position: relative; background: ${T.successSoft}; border-radius: 12px; padding: 11px 13px 12px; display: flex; flex-direction: column; gap: 6px; min-width: 0; box-shadow: inset 0 0 0 1.5px ${T.success}44; animation: jbook-land 0.5s cubic-bezier(.22,1.15,.34,1) both; }
        @keyframes jbook-land { 0% { opacity: 0; transform: translateX(-26px) translateY(6px) scale(0.94); } 62% { opacity: 1; transform: translateX(2px) translateY(0) scale(1.015); } 100% { opacity: 1; transform: none; } }
        .jbook-card.editing { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; animation: none; }
        .jbook-top { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; min-width: 0; }
        .jbook-num { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11px; color: #fff; background: ${T.success}; }
        /* ISH-TURI rangi — dars bo'ylab YAGONA semantika (tur-chip · mp-tur · jprev-tur bilan bir xil) */
        .jbook-tur { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.05em; border-radius: 99px; padding: 3px 9px; background: ${T.bg}; color: ${T.ink2}; flex-shrink: 0; }
        .jbook-tur.funksional { background: ${T.blueSoft}; color: ${T.blue}; }
        .jbook-tur.ijtimoiy { background: #FBEED6; color: #B77A16; }
        .jbook-tur.emotsional { background: #FBE3F0; color: #D23D82; }
        .jbook-edit { margin-left: 2px; background: ${T.paper}; border: none; border-radius: 8px; width: 28px; height: 28px; font-size: 14px; color: ${T.ink2}; cursor: pointer; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); transition: color 0.15s, transform 0.15s; flex-shrink: 0; }
        .jbook-edit:hover { color: ${T.accent}; transform: scale(1.08); }
        .jbook-sent { font-size: 13.5px; color: ${T.ink2}; line-height: 1.45; margin: 0; min-width: 0; overflow-wrap: anywhere; }
        .jbook-sent b { color: ${T.ink}; font-weight: 600; }
        .jbook-foot { margin: 2px 0 0; font-family: 'Manrope'; font-weight: 500; font-size: 12px; line-height: 1.45; color: ${T.ink3}; }
        @media (prefers-reduced-motion: reduce) { .jbook-card { animation: none; } .jbook-edit:hover { transform: none; } .jw-stampzone.ready { animation: none; } .jw-stampzone { transition: none; } }

        /* === 🔍 TEKSHIRUVCHI STOLI (52-qonun) ===
           IMZO-VIZUAL: stol ustida BITTA katta karta yotadi; hukmdan keyin uning chap hoshiyasi
           rang oladi (yashil — hukm to'g'ri, indigo — izoh bor). Xato uchun qizil ISHLATILMAYDI:
           bu yerda ball ham, jazo ham yo'q. Uchtasi tugagach karta o'rnini xulosa-qatorlar egallaydi. */
        .jpeer-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .jpeer-prog { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink3}; flex-shrink: 0; }
        .jpeer-prog i { font-style: normal; font-size: 10px; color: ${T.line}; transition: color 0.25s; }
        .jpeer-prog i.on { color: ${T.accent}; }
        .jpeer-prog b { color: ${T.ink2}; margin-left: 3px; }
        .jpeer-desk { display: flex; flex-direction: column; gap: 14px; align-items: stretch; max-width: 660px; width: 100%; align-self: center; min-width: 0; }
        .jpeer-card { position: relative; display: flex; align-items: center; gap: 20px; background: ${T.paper}; border-radius: 18px; padding: 22px 26px; min-width: 0; box-shadow: 0 12px 30px -12px rgba(${T.shadowBase},0.26); border-left: 5px solid ${T.accent}55; animation: jpeer-in 0.4s ease both; transition: border-color 0.3s, box-shadow 0.3s; }
        .jpeer-card.hit { border-left-color: ${T.success}; }
        .jpeer-card.note { border-left-color: ${T.accent}; }
        @keyframes jpeer-in { from { opacity: 0; transform: translateY(10px) rotate(-0.6deg); } to { opacity: 1; transform: none; } }
        .jpeer-em { font-size: 38px; line-height: 1; flex-shrink: 0; }
        .jpeer-rows { display: flex; flex-direction: column; gap: 9px; min-width: 0; flex: 1; }
        .jpeer-r { display: flex; align-items: baseline; gap: 10px; min-width: 0; overflow-wrap: anywhere; }
        .jpeer-r i { font-style: normal; font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink3}; width: 78px; flex-shrink: 0; white-space: nowrap; }
        .jpeer-r b { font-family: 'Manrope'; font-weight: 700; font-size: 17px; color: ${T.ink}; line-height: 1.3; min-width: 0; }
        .jpeer-acts { display: flex; gap: 10px; flex-wrap: wrap; }
        .jpeer-btn { flex: 1 1 180px; border: none; cursor: pointer; border-radius: 13px; padding: 15px 18px; font-family: 'Manrope'; font-weight: 800; font-size: 15.5px; background: ${T.paper}; color: ${T.ink2}; box-shadow: inset 0 0 0 2px ${T.line}, 0 6px 16px -10px rgba(${T.shadowBase},0.4); transition: transform 0.15s, box-shadow 0.15s, color 0.15s; }
        .jpeer-btn.yes:hover { color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}, 0 10px 20px -12px rgba(18,169,104,0.7); transform: translateY(-2px); }
        .jpeer-btn.no:hover { color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 20px -12px rgba(${T.shadowBase},0.6); transform: translateY(-2px); }
        .jpeer-why { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .jpeer-wq { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; }
        .jpeer-chips { display: flex; gap: 8px; flex-wrap: wrap; min-width: 0; }
        .jpeer-chip { border: none; cursor: pointer; border-radius: 99px; padding: 9px 14px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: transform 0.15s, box-shadow 0.15s, color 0.15s; }
        .jpeer-chip:hover { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; transform: translateY(-2px); }
        .jpeer-chip.back { background: transparent; box-shadow: none; color: ${T.ink3}; font-weight: 600; }
        .jpeer-fb { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .jpeer-fbt { margin: 0; flex: 1 1 260px; min-width: 0; overflow-wrap: anywhere; font-size: 13.5px; line-height: 1.45; border-radius: 12px; padding: 10px 14px; }
        .jpeer-fbt.hit { background: ${T.successSoft}; color: ${T.success}; }
        .jpeer-fbt.note { background: ${T.accentSoft}; color: ${T.ink}; }
        .jpeer-next { border: none; cursor: pointer; border-radius: 99px; padding: 11px 20px; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; color: #fff; background: ${T.accent}; box-shadow: 0 8px 18px -10px rgba(${T.shadowBase},0.8); transition: transform 0.15s; flex-shrink: 0; }
        .jpeer-next:hover { transform: translateY(-2px); }
        .jpeer-sum { display: flex; flex-direction: column; gap: 8px; max-width: 720px; width: 100%; align-self: center; min-width: 0; }
        .jpeer-srow { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; background: ${T.paper}; border-radius: 12px; padding: 10px 14px; min-width: 0; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.5); border-left: 4px solid ${T.line}; animation: jpeer-in 0.35s ease both; }
        .jpeer-srow.hit { border-left-color: ${T.success}; }
        .jpeer-srow.note { border-left-color: ${T.accent}; }
        .jpeer-sem { font-size: 18px; line-height: 1; flex-shrink: 0; }
        .jpeer-sname { font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
        .jpeer-sish { font-size: 13px; color: ${T.ink3}; min-width: 0; overflow-wrap: anywhere; flex: 1 1 auto; }
        .jpeer-sv { font-family: 'Manrope'; font-weight: 800; font-size: 12px; border-radius: 99px; padding: 5px 12px; flex-shrink: 0; }
        .jpeer-sv.y { background: ${T.successSoft}; color: ${T.success}; }
        .jpeer-sv.n { background: ${T.accentSoft}; color: ${T.accent}; }
        .jpeer-sfoot { margin: 4px 0 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink2}; }
        @media (max-width: 700px) { .jpeer-r i { width: 66px; } .jpeer-card { gap: 14px; padding: 16px 18px; } }
        @media (prefers-reduced-motion: reduce) { .jpeer-card, .jpeer-srow { animation: none; } .jpeer-btn:hover, .jpeer-chip:hover, .jpeer-next:hover { transform: none; } }

        /* === 🩺 MIJOZ TALABI: gap-pufak + karta-yig'gich + tuzoqlar (52-qonun) ===
           IMZO-VIZUAL: mijozning og'zaki gapi (pufak, dumchali) → to'liq karta-qatoriga aylanadi.
           Slot ranglari formula semantikasi bo'yicha: mahsulot=ko'k · ish=amber · tur=yashil.
           Tuzoq-bo'lak «kuyadi» (chizilib, tutun-tebranish bilan susayadi), sabab amber-kartada ochiladi
           — tuzoq XATO EMAS, shuning uchun amber (qizil faqat slot noto'g'ri urinishida bir lahza). */
        .jfix-quote { position: relative; align-self: flex-start; background: ${T.paper}; border-radius: 4px 18px 18px 18px; padding: 13px 20px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 4px; max-width: 100%; min-width: 0; }
        .jfix-quote::before { content: ""; position: absolute; left: -9px; top: 0; border-width: 0 0 14px 10px; border-style: solid; border-color: transparent ${T.paper}; }
        .jfix-quote-who { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink3}; }
        .jfix-quote-txt { font-family: Georgia, serif; font-style: italic; font-size: clamp(17px,2.4vw,23px); color: ${T.ink}; margin: 0; overflow-wrap: anywhere; }
        /* karta-qatori — «hujjat» varag'i: chap-accent hoshiya + burchak-buklama (jq-card bilan bir til) */
        .jfix-line { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: ${T.paper}; border-radius: 16px; border-left: 5px solid ${T.accent}; padding: clamp(14px,2.2vw,20px); box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.18); overflow: hidden; min-width: 0; }
        .jfix-line::after { content: ""; position: absolute; right: 0; top: 0; border-width: 0 18px 18px 0; border-style: solid; border-color: ${T.bg} ${T.accentSoft}; }
        .jfix-w { font-family: Georgia, serif; font-size: clamp(15px,2vw,19px); color: ${T.ink2}; }
        .jfix-slot { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,15px); border: 1.5px dashed ${T.ink3}66; background: ${T.bg}; color: ${T.ink3}; border-radius: 10px; padding: 9px 14px; cursor: default; transition: all 0.18s; min-width: 0; overflow-wrap: anywhere; }
        .jfix-slot.filled { animation: jfix-snap 0.42s cubic-bezier(.34,1.6,.4,1); }
        @keyframes jfix-snap { 0% { transform: scale(0.86); } 52% { transform: scale(1.09); } 100% { transform: scale(1); } }
        .jfix-slot.mahsulot.filled { background: ${T.blueSoft}; color: ${T.blue}; border-style: solid; border-color: ${T.blue}55; }
        .jfix-slot.ish.filled { background: #FBEED6; color: #B77A16; border-style: solid; border-color: #E8A13A55; }
        .jfix-slot.tur.filled { background: ${T.successSoft}; color: ${T.success}; border-style: solid; border-color: ${T.success}55; }
        /* bo'lak tanlangan — bo'sh slotlar «meni bos» deb yonib turadi (tap-hint affordance) */
        .jfix-slot.targetable { border-color: ${T.accent}; color: ${T.accent}; cursor: pointer; background: ${T.accentSoft}; animation: jfix-target 1.5s ease-in-out infinite; }
        .jfix-slot.targetable:hover { transform: translateY(-2px); box-shadow: 0 8px 18px -8px rgba(91,61,230,0.5); }
        @keyframes jfix-target { 0%,100% { box-shadow: 0 0 0 0 rgba(91,61,230,0.26); } 55% { box-shadow: 0 0 0 8px rgba(91,61,230,0); } }
        .jfix-slot.shake { animation: jfix-shake 0.4s ease; border-color: ${T.err}; color: ${T.err}; background: ${T.errSoft}; }
        .jfix-pool { display: flex; flex-wrap: wrap; gap: 9px; }
        .jfix-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.paper}; color: ${T.ink}; border: none; border-radius: 11px; padding: 10px 15px; cursor: pointer; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; transition: transform 0.15s, box-shadow 0.15s, opacity 0.3s; max-width: 100%; overflow-wrap: anywhere; }
        .jfix-chip:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 22px -8px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.accent}44; }
        .jfix-chip:active:not(:disabled) { transform: translateY(-1px) scale(0.97); }
        .jfix-chip.sel { background: ${T.accent}; color: #fff; box-shadow: 0 10px 22px -7px rgba(91,61,230,0.5), inset 0 0 0 1.5px ${T.accent}; transform: translateY(-2px); }
        .jfix-chip.burned { background: ${T.bg}; color: ${T.ink3}; text-decoration: line-through; cursor: not-allowed; box-shadow: inset 0 0 0 1.5px ${T.line}; opacity: 0.55; transform: none; animation: jfix-burn 0.55s ease-out; }
        @keyframes jfix-burn { 0% { transform: translateY(0) rotate(0); opacity: 1; } 30% { transform: translateY(-3px) rotate(-2.5deg); } 60% { transform: translateY(2px) rotate(2deg); } 100% { transform: none; opacity: 0.55; } }
        /* F-0725-02: yakuniy tuzoq-ochilishi — tuzoqqa tushmagan o'quvchi ham ikkalasini ko'radi */
        .clinic-traps { align-self: stretch; display: flex; flex-direction: column; gap: 6px; background: ${T.bg}; border-radius: 12px; padding: 12px 14px; box-shadow: inset 0 0 0 1.5px ${T.line}; min-width: 0; }
        .ct-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink3}; }
        .ct-row { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,13.5px); line-height: 1.5; color: ${T.ink2}; overflow-wrap: anywhere; }
        .ct-row b { color: ${T.ink}; }
        .jfix-trap { align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.45; color: #B77A16; background: #FBEED6; border-radius: 12px; border-left: 4px solid #E8A13A; padding: 11px 15px; box-shadow: 0 8px 20px -10px rgba(232,161,58,0.5); min-width: 0; overflow-wrap: anywhere; }
        @media (prefers-reduced-motion: reduce) {
          .jfix-slot.filled, .jfix-slot.targetable, .jfix-chip.burned { animation: none; }
          .jfix-slot.targetable:hover, .jfix-chip:hover:not(:disabled), .jfix-chip:active:not(:disabled), .jfix-chip.sel { transform: none; }
        }

        /* === 🔥 PRIORITET-DOSKA (52-qonun) === */
        .jpri-pool { display: flex; flex-wrap: wrap; gap: 9px; }
        .jpri-card { display: inline-flex; align-items: center; gap: 8px; text-align: left; background: ${T.paper}; border: none; border-radius: 11px; padding: 9px 13px; cursor: pointer; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.22); transition: transform 0.15s, box-shadow 0.15s; max-width: 100%; min-width: 0; }
        .jpri-card:hover { transform: translateY(-2px); box-shadow: 0 10px 20px -8px rgba(${T.shadowBase},0.3); }
        .jpri-card:active { transform: translateY(0) scale(0.98); }
        .jpri-card.sel { box-shadow: 0 0 0 2.5px ${T.accent}, 0 10px 22px -7px rgba(91,61,230,0.4); transform: translateY(-2px); }
        .jpri-card.sel .jpri-card-n { background: ${T.accent}; color: #fff; }
        .jpri-card-n { width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; }
        .jpri-card-txt { font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink2}; line-height: 1.35; min-width: 0; overflow-wrap: anywhere; }
        .jpri-board { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; align-items: stretch; }
        @media (max-width: 760px) { .jpri-board { grid-template-columns: 1fr; } }
        /* IMZO-VIZUAL: uch ustunli doska. «Hozir» — YAGONA joyli ustun: qalinroq accent halqa,
           yuqorisida gradient-lenta va sig'im-yorlig'i pill bo'lib ajralib turadi (PM tanlovi shu yerda). */
        .jpri-col { position: relative; display: flex; flex-direction: column; gap: 9px; background: ${T.bg}; border-radius: 14px; padding: 12px; min-height: 130px; min-width: 0; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: box-shadow 0.2s, background 0.2s; cursor: default; }
        .jpri-col.targetable { box-shadow: inset 0 0 0 2px ${T.accent}66; cursor: pointer; }
        .jpri-col.targetable:hover { box-shadow: inset 0 0 0 2.5px ${T.accent}; background: ${T.accentSoft}66; }
        .jpri-col.hozir { background: linear-gradient(180deg, #F6F3FE, ${T.bg}); box-shadow: inset 0 0 0 2px ${T.accent}55; padding-top: 15px; }
        .jpri-col.hozir::before { content: ""; position: absolute; top: 0; left: 12px; right: 12px; height: 4px; border-radius: 0 0 99px 99px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}); }
        .jpri-col.hozir.targetable { box-shadow: inset 0 0 0 2.5px ${T.accent}; }
        .jpri-col.shake { animation: jfix-shake 0.4s ease; }
        .jpri-col-h { display: flex; flex-direction: column; gap: 3px; align-items: flex-start; }
        .jpri-col-t { font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .jpri-col-sub { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.ink3}; }
        .jpri-col.hozir .jpri-col-sub { color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 2px 9px; font-weight: 800; }
        /* karta ustunga «qo'nadi» — pastdan sakrab keladi */
        .jpri-col .jpri-card.placed { width: 100%; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.28); animation: jpri-land 0.44s cubic-bezier(.28,1.35,.4,1); }
        @keyframes jpri-land { 0% { opacity: 0; transform: translateY(-14px) scale(0.94); } 60% { opacity: 1; transform: translateY(2px) scale(1.02); } 100% { opacity: 1; transform: none; } }
        .jpri-col .jpri-card.placed.sel { box-shadow: 0 0 0 2.5px ${T.accent}; }
        .jpri-empty { border: 1.5px dashed ${T.ink3}55; border-radius: 10px; padding: 10px; text-align: center; font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: ${T.ink3}; font-style: italic; transition: all 0.2s; }
        .jpri-col.hozir .jpri-empty { border-color: ${T.accent}66; color: ${T.accent}; }
        .jpri-col.targetable .jpri-empty { border-style: solid; border-color: ${T.accent}88; color: ${T.accent}; background: ${T.paper}; }
        @media (prefers-reduced-motion: reduce) { .jpri-col.shake, .jpri-col .jpri-card.placed, .jfix-slot.shake { animation: none; } .jpri-card:hover, .jfix-chip:hover:not(:disabled) { transform: none; } }

        /* === 🗂 UY-VAZIFA QADAMLARI (53-qonun): raqam-doirali 3 qator ===
           Qadamlar ketma-ketligi ko'rinib tursin: doiralarni ingichka accent-chiziq bog'laydi,
           har qator navbat bilan sirg'alib chiqadi. */
        .pmtask-steps { position: relative; display: flex; flex-direction: column; gap: 11px; padding: 15px 16px 17px; background: ${T.bg}; border-radius: 14px; }
        .pmtask-steps::before { content: ""; position: absolute; left: calc(16px + 11px); top: 26px; bottom: 28px; width: 2px; border-radius: 2px; background: ${T.accentSoft}; }
        .pmtask-step { position: relative; display: flex; align-items: center; gap: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.45; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; animation: pmtask-in 0.4s ease-out both; }
        .pmtask-step:nth-child(2) { animation-delay: 0.1s; } .pmtask-step:nth-child(3) { animation-delay: 0.2s; }
        @keyframes pmtask-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
        .pmtask-step b { color: ${T.accent}; margin-right: 4px; }
        .pmtask-step i { position: relative; z-index: 1; font-style: normal; width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; box-shadow: 0 0 0 3px ${T.bg}; }
        @media (prefers-reduced-motion: reduce) { .pmtask-step { animation: none; } }

        /* === ✅ MUVAFFAQIYAT-CHIP (done-mini) — to'liq-en ramka o'rniga bitta qator === */
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }

        /* === YORDAM + YULDUZCHA — bitta qatordagi 2 ixcham yig'ma-chip (ustaxona) === */
        .wsx { flex: 1; min-width: 170px; background: ${T.bg}; border: 1.5px dashed ${T.ink3}66; border-radius: 12px; overflow: hidden; }
        .wsx.star { border-color: ${T.blue}66; }
        .wsx-toggle { width: 100%; text-align: left; background: none; border: none; padding: 10px 13px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; cursor: pointer; }
        .wsx.star .wsx-toggle { color: ${T.blue}; }
        .wsx-body { padding: 0 13px 11px; display: flex; flex-direction: column; gap: 6px; animation: fade-step 0.25s ease-out; }
        .wsx-body p { font-size: 13px; color: ${T.ink2}; margin: 0; line-height: 1.45; } .wsx-body b { color: ${T.ink}; }

        /* === ⚛️ KODING (s10): VS Code-mockup + jonli JtbdCard-preview + qadam-checklist ===
           32c EKRAN-DIYETA: chapda BITTA blok (prop-ov savoli muharrirning «peshtoqi» bo'lib ulanadi),
           o'ngda BITTA holat-panel (sarlavha + progress + qadamlar + yulduzcha + tugma). */
        .jkd-code { border-radius: 14px; overflow: hidden; box-shadow: 0 14px 30px -12px rgba(${T.shadowBase},0.3); }
        .jkd-code .kdq { border-radius: 0; box-shadow: none; border-bottom: 1.5px solid ${T.line}; padding: 10px 13px; gap: 7px; }
        .jkd-code .vsc { border-radius: 0; box-shadow: none; border-left: 4px solid #2D2D2D; }
        .jkd-panel { position: relative; background: ${T.paper}; border-radius: 16px; padding: 11px 14px 10px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.18); border-left: 5px solid ${T.accent}; min-width: 0; transition: border-color 0.3s; }
        .jkd-panel.is-done { border-left-color: ${T.success}; }
        .jkd-phead { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .jkd-pcnt { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; color: ${T.ink3}; background: ${T.bg}; border-radius: 99px; padding: 3px 10px; transition: all 0.25s; }
        .jkd-pcnt.ok { color: ${T.success}; background: ${T.successSoft}; }
        .jkd-pbar { position: relative; height: 6px; border-radius: 99px; background: rgba(${T.shadowBase},0.08); overflow: hidden; }
        .jkd-pbar i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 99px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}); transition: width 0.45s cubic-bezier(.3,1,.4,1); }
        .jkd-panel.is-done .jkd-pbar i { background: linear-gradient(90deg, ${T.success}, #2BD97C); }
        .jkd-panel .wsx { flex: 0 0 auto; }
        /* Panel ichidagi ikkilamchi qatlamlar ixchamlashadi — matn o'zgarmaydi, faqat zichlik */
        .jkd-panel .wsx-toggle { padding: 7px 12px; }
        .jkd-panel .lp-done-btn { margin-top: 0; padding: 10px 18px; }
        .jkd-panel .done-mini { padding: 5px 13px; }
        /* 💡 Yordam desktopda QALQIB chiqadi (panel ustidagi suzuvchi kartacha) — ochilganda panel
           balandligi o'zgarmaydi, ya'ni ekran skrolga tushmaydi. Mobil (≤620px) — odatdagi ochilish. */
        .jkd-panel .wsx-body { padding: 11px 13px; }
        @media (min-width: 761px) {
          .jkd-panel .wsx.open { position: relative; overflow: visible; border-color: ${T.blue}; }
          /* qalqib chiqadi CHAPGA — qadam-ro'yxati yopilmaydi, o'quvchi yordamni o'qib turib belgilay oladi */
          .jkd-panel .wsx.open .wsx-body { position: absolute; right: calc(100% + 14px); bottom: -4px; width: min(330px, 34vw); z-index: 6; background: ${T.paper}; border-radius: 13px; box-shadow: 0 20px 44px -14px rgba(${T.shadowBase},0.45), inset 0 0 0 1.5px ${T.blue}55; }
        }
        @media (prefers-reduced-motion: reduce) { .jkd-pbar i { transition: none; } }
        .vsc { position: relative; background: #1E1E1E; border-radius: 14px; overflow: hidden; box-shadow: 0 14px 30px -10px rgba(${T.shadowBase},0.35); }
        /* «davomi bor» ishorasi — kod ichida skroll borligini ko'rsatuvchi yumshoq soya (matnsiz affordance) */
        .vsc::after { content: ''; position: absolute; left: 0; right: 9px; bottom: 0; height: 26px; pointer-events: none; background: linear-gradient(180deg, rgba(30,30,30,0) 0%, rgba(30,30,30,0.92) 100%); }
        @media (max-width: 620px) { .vsc::after { display: none; } }
        .vsc-bar { background: #252526; display: flex; align-items: center; gap: 2px; padding-right: 8px; }
        .vsc-tab { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: #8B949E; background: #2D2D2D; padding: 9px 14px; display: inline-flex; align-items: center; gap: 6px; }
        .vsc-tab.on { background: #1E1E1E; color: #E6EDF3; box-shadow: inset 0 2px 0 #007ACC; }
        .vsc-copy { margin-left: auto; background: #0E639C; color: #fff; border: none; border-radius: 8px; padding: 6px 12px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; cursor: pointer; transition: background 0.18s, transform 0.18s; flex-shrink: 0; }
        .vsc-copy:hover { background: #1177BB; transform: translateY(-1px); }
        .vsc-copy.ok { background: ${T.success}; }
        /* Kod-oynasi o'zi skroll bo'ladi — butun sahifa emas (desktopda ekran skrolsiz sig'sin) */
        .vsc-body { padding: 10px 14px 12px 6px; font-family: 'JetBrains Mono', monospace; font-size: clamp(11px,1.35vw,12.5px); color: #D4D4D4; line-height: 1.62; overflow: auto; max-height: clamp(170px, 27vh, 300px); scrollbar-width: thin; scrollbar-color: #4A4A4A #1E1E1E; }
        .vsc-body::-webkit-scrollbar { width: 9px; height: 9px; }
        .vsc-body::-webkit-scrollbar-thumb { background: #4A4A4A; border-radius: 99px; }
        .vsc-body::-webkit-scrollbar-track { background: #1E1E1E; }
        /* baland ekranda kod ko'proq ko'rinadi — bo'sh joy behuda qolmaydi */
        @media (min-width: 901px) and (min-height: 860px) { .vsc-body { max-height: min(34vh, 340px); } }
        @media (max-width: 620px) { .vsc-body { max-height: none; overflow-y: visible; } }
        .vsc-line { display: flex; align-items: baseline; min-width: max-content; }
        .vsc-ln { color: #6E7681; min-width: 26px; text-align: right; margin-right: 14px; font-size: 10.5px; flex-shrink: 0; user-select: none; }
        .vsc-code { white-space: pre; }
        /* Jonli natija-preview — o'quvchining REAL 3 kartasi «brauzerda» ko'rinadi.
           flex-shrink: 0 SHART: .screen fiks-balandlik flex-ustun, overflow:hidden'li element aks holda
           siqilib «bo'sh karta» bo'lib qoladi (muammo.png bugi — kartalardan faqat chekka chiziq ko'ringan). */
        .jprev { background: ${T.paper}; border-radius: 16px; overflow: hidden; flex-shrink: 0; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.2); }
        .jprev-bar { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; padding: 7px 13px; background: #F7F5FD; border-bottom: 1px solid ${T.line}; }
        /* «Komponent — bir marta yoziladi…» izohi brauzer-panelining o'ziga ko'chdi: alohida qator emas (balandlik tejaladi) */
        .jprev-note { font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: ${T.ink3}; }
        .jprev-url { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink3}; background: ${T.paper}; border-radius: 99px; padding: 4px 12px; box-shadow: inset 0 0 0 1px ${T.line}; }
        /* yashil = o'quvchining REAL kartalari; namuna-fallback neytral indigo (40-qonun: yolg'on «✓» bo'lmasin) */
        .jprev-src { margin-left: auto; font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; border-radius: 99px; padding: 3px 10px; color: ${T.ink2}; background: ${T.bg}; }
        .jprev-src.own { color: ${T.success}; background: ${T.successSoft}; }
        .jprev-src.demo { color: ${T.accent}; background: ${T.accentSoft}; }
        .jprev-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(9px,1.3vw,12px); padding: clamp(9px,1.1vw,10px); }
        @media (max-width: 700px) { .jprev-cards { grid-template-columns: 1fr; } }
        .jprev-card { background: #FBFAFE; border-radius: 12px; border-left: 4px solid ${T.accent}; padding: 9px 12px; display: flex; flex-direction: column; gap: 3px; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.18); min-width: 0; animation: fade-step 0.4s ease-out both; }
        .jprev-card:nth-child(2) { animation-delay: 0.12s; } .jprev-card:nth-child(3) { animation-delay: 0.24s; }
        /* nom + tur BITTA qatorda — karta 3 qator emas, 2 qator bo'ldi */
        .jprev-top { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .jprev-name { flex: 1; min-width: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(13.5px,1.6vw,15px); color: ${T.ink}; overflow-wrap: anywhere; }
        .jprev-job { font-size: clamp(12px,1.4vw,13px); line-height: 1.35; color: ${T.ink2}; overflow-wrap: anywhere; } .jprev-job b { color: ${T.ink}; }
        .jprev-tur { flex-shrink: 0; font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; border-radius: 99px; padding: 3px 9px; color: ${T.accent}; background: ${T.accentSoft}; }
        .jprev-tur.funksional { color: ${T.blue}; background: ${T.blueSoft}; } .jprev-tur.ijtimoiy { color: #B77A16; background: #FBEED6; } .jprev-tur.emotsional { color: #D23D82; background: #FBE3F0; }
        /* VS Code qadamlari — o'quvchi o'zi belgilaydi */
        .kd-steps { display: flex; flex-direction: column; gap: 5px; }
        /* past ekranli noutbuklar (≤790px) — panel yana bir pog'ona zichlashadi */
        @media (min-width: 761px) and (max-height: 790px) { .kd-step { padding: 6px 11px; } .jkd-panel { gap: 6px; } .jprev-card { padding: 7px 11px; } .jprev-bar { padding: 5px 12px; } }
        .kd-step { display: flex; align-items: center; gap: 10px; text-align: left; width: 100%; background: ${T.paper}; border: none; border-radius: 11px; padding: 8px 12px; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.12), inset 0 0 0 1.5px ${T.line}; transition: all 0.18s; }
        .kd-step:hover:not(.on) { transform: translateY(-1px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.accent}44; }
        .kd-step.on { color: ${T.ink}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .kd-check { width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}55; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; color: ${T.ink3}; background: ${T.paper}; transition: all 0.2s; }
        .kd-step.on .kd-check { background: ${T.success}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        .kd-step-t { min-width: 0; line-height: 1.4; }
        @media (prefers-reduced-motion: reduce) { .kd-step.on .kd-check { animation: none; } .jprev-card { animation: none; } }

        /* === RECAP (s11) — 3 raqamlangan qadam-karta + juftlik-taymer + reflection + savol === */
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
        @media (prefers-reduced-motion: reduce) { .pair-mic { animation: none; } }

        /* === UYGA VAZIFA kartalari === */
        .hw-card { border-radius: 14px; padding: clamp(15px,2.4vw,20px); display: flex; flex-direction: column; gap: 10px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
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
        /* 53-qonun: podium ustunlari pastdan KO'TARILADI (g'olib e'lon qilingandek) */
        .pod-bar { width: 100%; border-radius: 10px 10px 0 0; background: linear-gradient(180deg, ${T.accent}, ${T.accent}BB); box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); transform-origin: bottom; animation: pod-rise 0.62s cubic-bezier(.22,1.1,.36,1) both; }
        .pod-1 .pod-bar { height: clamp(74px,11vw,120px); animation-delay: 0.32s; }
        .pod-2 .pod-bar { height: clamp(52px,8vw,86px); background: linear-gradient(180deg, ${T.ink2}, ${T.ink3}); animation-delay: 0.14s; }
        .pod-3 .pod-bar { height: clamp(38px,6vw,62px); background: linear-gradient(180deg, #C98A3D, #DDA55C); animation-delay: 0.22s; }
        @keyframes pod-rise { from { transform: scaleY(0.04); opacity: 0.4; } to { transform: scaleY(1); opacity: 1; } }
        .pod-col.me .pod-name { color: ${T.success}; }
        .pod-col.me .pod-bar { box-shadow: 0 8px 20px -8px rgba(18,169,104,0.5), inset 0 0 0 2px ${T.success}; }
        @media (prefers-reduced-motion: reduce) { .pod-bar { animation: none; } }
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
        .cs-cta .cs-cap { padding: clamp(14px,2vw,24px) clamp(22px,3.2vw,40px); gap: clamp(4px,0.7vw,8px); }
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
        /* === 🔩 DREL→NATIJA demo-lenta (s3) — drel g'ichirlaydi, devorda rasm paydo bo'ladi === */
        .jdrill { align-self: center; display: flex; align-items: center; justify-content: center; gap: clamp(10px,2vw,18px); background: ${T.paper}; border-radius: 14px; padding: 11px 18px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16), inset 0 0 0 1.5px ${T.line}; }
        .jdrill-tool { font-size: clamp(24px,3.4vw,30px); line-height: 1; display: inline-block; animation: jdrill-spin 3.6s ease-in-out infinite; }
        @keyframes jdrill-spin { 0%,55%,100% { transform: rotate(0); } 14% { transform: rotate(-26deg); } 28% { transform: rotate(18deg); } 42% { transform: rotate(-10deg); } }
        .jdrill-arrow { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px,2vw,19px); color: ${T.ink3}; }
        .jdrill-wall { position: relative; width: clamp(46px,6.4vw,56px); height: clamp(34px,4.8vw,42px); border-radius: 8px; background: linear-gradient(180deg, #F6F3EC, #EDE7DB); box-shadow: inset 0 0 0 1.5px ${T.line}; display: inline-flex; align-items: center; justify-content: center; }
        /* devorga RASM osiladi — drel faqat vosita, odamga natija kerak */
        .jdrill-pic { font-size: clamp(16px,2.4vw,20px); line-height: 1; display: inline-block; transform: scale(0); animation: jdrill-pic 3.6s ease-in-out infinite; }
        @keyframes jdrill-pic { 0%,42% { transform: scale(0); } 54%,90% { transform: scale(1); } 100% { transform: scale(0); } }
        .jdrill-tag { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.04em; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 12px; }
        @media (prefers-reduced-motion: reduce) { .jdrill-tool { animation: none; } .jdrill-pic { animation: none; transform: scale(1); } }

        /* === 🧲 ISH-TURI TAP-BIRIKTIRISH (s3) — misol-chip → tur-ustun; s9 MatchPairs'ga ko'prik === */
        /* Tur-ranglar: funksional=ko'k · ijtimoiy=amber · emotsional=iliq-pushti (yashil=faqat muvaffaqiyat) */
        .jta-pool { display: flex; flex-direction: column; gap: 8px; background: ${T.bg}; border-radius: 14px; padding: 12px 14px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .jta-pool-row { display: flex; flex-wrap: wrap; gap: 10px; min-height: 44px; align-items: center; }
        .jta-chip { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13.5px,1.7vw,15px); padding: 11px 16px; border-radius: 13px; border: none; background: linear-gradient(180deg, #fff, #F5F2FE); color: ${T.ink}; cursor: pointer; box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.24), inset 0 0 0 1.5px ${T.line}; transition: transform 0.14s, box-shadow 0.18s; animation: jta-hint 2.4s ease-in-out infinite; }
        .jta-chip:nth-child(2) { animation-delay: 0.4s; } .jta-chip:nth-child(3) { animation-delay: 0.8s; }
        @keyframes jta-hint { 0%,88%,100% { box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.24), inset 0 0 0 1.5px ${T.line}; } 94% { box-shadow: 0 10px 22px -6px rgba(91,61,230,0.3), inset 0 0 0 1.5px ${T.accent}66; } }
        .jta-chip:hover { transform: translateY(-2px); }
        .jta-chip:active { transform: scale(0.96); }
        .jta-chip.sel { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 10px 22px -8px rgba(91,61,230,0.34), inset 0 0 0 2px ${T.accent}; animation: none; }
        .jta-chip-ic { font-size: 18px; }
        .jta-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(10px,1.6vw,14px); }
        @media (max-width: 640px) { .jta-grid { grid-template-columns: 1fr; } }
        .jta-col { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 7px; border: none; border-radius: 16px; padding: 14px 12px; background: ${T.paper}; border-top: 4px solid var(--jc); cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.18), inset 0 0 0 1.5px ${T.line}; transition: box-shadow 0.2s, transform 0.15s, background 0.25s; }
        .jta-col.funksional { --jc: ${T.blue}; --jcs: ${T.blueSoft}; --jct: ${T.blue}; }
        .jta-col.ijtimoiy { --jc: #E8A13A; --jcs: #FBEED6; --jct: #B77A16; }
        .jta-col.emotsional { --jc: #E0559A; --jcs: #FBE3F0; --jct: #D23D82; }
        .jta-col:disabled { cursor: default; }
        .jta-col.droppable { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.28), inset 0 0 0 2px ${T.accent}; animation: mp-halo 1.4s ease-in-out infinite; }
        .jta-col:hover:not(:disabled) { transform: translateY(-2px); }
        /* to'g'ri joylashdi — yashil snap-pop */
        .jta-col.ok { background: linear-gradient(180deg, #fff, ${T.successSoft}); box-shadow: 0 8px 20px -8px rgba(18,169,104,0.3), inset 0 0 0 1.5px ${T.success}; animation: mp-okpop 0.5s cubic-bezier(.3,1.4,.4,1); }
        /* xato bosildi — qisqa qizil silkinish (FAQAT haqiqiy xato) */
        .jta-col.miss { background: ${T.errSoft}; box-shadow: inset 0 0 0 2px ${T.err}; animation: jta-shake 0.4s ease; }
        @keyframes jta-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 55% { transform: translateX(5px); } 80% { transform: translateX(-2px); } }
        .jta-ic { font-size: clamp(24px,4.2vw,32px); line-height: 1; width: clamp(48px,8vw,58px); height: clamp(48px,8vw,58px); display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--jcs); }
        .jta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(15px,2vw,18px); color: ${T.ink}; }
        .jta-short { font-weight: 700; font-size: 12px; color: var(--jct); }
        .jta-slot { width: 100%; min-height: 42px; border-radius: 11px; border: 1.5px dashed ${T.ink3}66; display: flex; align-items: center; justify-content: center; padding: 6px 8px; min-width: 0; }
        .jta-col.droppable .jta-slot { border-color: ${T.accent}; }
        .jta-col.ok .jta-slot { border-style: solid; border-color: ${T.success}66; background: #fff; }
        .jta-slot-empty { font-weight: 600; font-size: 11.5px; color: ${T.ink3}; font-style: italic; }
        .jta-placed { font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: ${T.success}; overflow-wrap: anywhere; min-width: 0; animation: mp-snap 0.38s cubic-bezier(.3,1.5,.4,1); }
        .jta-body { font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; line-height: 1.45; animation: fade-step 0.3s ease-out; } .jta-body b { color: ${T.ink}; }
        @media (prefers-reduced-motion: reduce) {
          .jta-chip, .jta-col.droppable, .jta-col.ok, .jta-col.miss, .jta-placed, .jta-body { animation: none; }
          .jta-chip:hover, .jta-chip:active, .jta-col:hover:not(:disabled) { transform: none; }
        }

        /* === ISH-TUR TANLAGICH (MVP editori / ustaxona) === */
        .swcard-fields.two { grid-template-columns: 1fr 1fr; }
        @media (max-width: 620px) { .swcard-fields.two { grid-template-columns: 1fr; } }
        .tur-pick { display: flex; gap: 8px; flex-wrap: wrap; }
        .tur-chip { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; padding: 7px 14px; border-radius: 99px; border: none; background: ${T.bg}; color: ${T.ink2}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.16s; }
        .tur-chip:hover:not(.on) { box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
        /* tanlangan chip o'z tur-rangida (jta/mp-tur bilan izchil) */
        .tur-chip.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .tur-chip.funksional.on { background: ${T.blueSoft}; color: ${T.blue}; box-shadow: inset 0 0 0 1.5px ${T.blue}; }
        .tur-chip.ijtimoiy.on { background: #FBEED6; color: #B77A16; box-shadow: inset 0 0 0 1.5px #E8A13A; }
        .tur-chip.emotsional.on { background: #FBE3F0; color: #D23D82; box-shadow: inset 0 0 0 1.5px #E0559A; }
        .swcard-raqib { display: flex; flex-direction: column; gap: 4px; }
        /* ixtiyoriy maydon — IKKILAMCHI ohang (32c): amber ISH-slotining rangini o'zlashtirmaydi */
        .swcard-raqib span { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.06em; color: ${T.ink3}; }
        .swcard-raqib input { font-family: 'Manrope'; font-weight: 500; font-size: 14px; color: ${T.ink}; border: none; border-radius: 9px; padding: 9px 11px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.18s; }
        .swcard-raqib input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }

        /* === 🔗 MATCHPAIRS (s9 juftlash) — FAQAT vizual boyitilgan: ball-mantiq o'zgarmagan === */
        .mp-wrap { position: relative; display: flex; flex-direction: column; gap: clamp(14px,2.2vw,20px); }
        /* fon-dekor: dars atamalaridan xira tokenlar (dekor o'qitadi) */
        .mp-decor { position: absolute; inset: -10px; pointer-events: none; z-index: 0; overflow: hidden; }
        .mp-decor-t { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: rgba(91,61,230,0.065); user-select: none; white-space: nowrap; }
        .mp-decor-t.md0 { left: 1%; top: 3%; font-size: 26px; transform: rotate(-9deg); }
        .mp-decor-t.md1 { right: 3%; top: 8%; font-size: 30px; transform: rotate(6deg); }
        .mp-decor-t.md2 { left: 38%; top: 46%; font-size: 22px; transform: rotate(-4deg); }
        .mp-decor-t.md3 { left: 4%; bottom: 6%; font-size: 20px; transform: rotate(7deg); }
        .mp-decor-t.md4 { right: 6%; bottom: 14%; font-size: 24px; transform: rotate(-6deg); }
        .mp-decor-t.md5 { right: 30%; top: 30%; font-size: 18px; transform: rotate(4deg); }
        .mp-targets { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(10px,1.8vw,16px); }
        @media (max-width: 640px) { .mp-targets { grid-template-columns: 1fr; } }
        .mp-target { position: relative; display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border-radius: 14px; padding: 14px 15px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16), inset 0 0 0 1.5px ${T.line}; transition: box-shadow 0.2s, transform 0.15s; }
        /* tanlangan/sudralayotgan chip uchun nishon puls-glow (indigo halo) */
        .mp-target.droppable { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.28), inset 0 0 0 2px ${T.accent}; cursor: pointer; animation: mp-halo 1.4s ease-in-out infinite; }
        .mp-target.dragover { background: ${T.accentSoft}; box-shadow: 0 12px 28px -8px rgba(91,61,230,0.38), inset 0 0 0 2.5px ${T.accent}; transform: translateY(-2px); animation: mp-halo 0.9s ease-in-out infinite; }
        @keyframes mp-halo { 0%,100% { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.28), inset 0 0 0 2px ${T.accent}; } 50% { box-shadow: 0 12px 32px -6px rgba(110,75,255,0.5), inset 0 0 0 2.5px ${T.accentVivid}; } }
        .mp-target.dragover .mp-slot { border-color: ${T.accent}; }
        .mp-target.filled { box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.accent}44; }
        /* to'g'ri juftlik ochilganda: yashil yonish + snap-pop */
        .mp-target.ok { background: ${T.successSoft}; box-shadow: 0 8px 20px -8px rgba(18,169,104,0.3), inset 0 0 0 1.5px ${T.success}; animation: mp-okpop 0.5s cubic-bezier(.3,1.4,.4,1); }
        @keyframes mp-okpop { 0% { transform: scale(0.97); } 45% { transform: scale(1.025); } 100% { transform: scale(1); } }
        .mp-target.bad { background: ${T.errSoft}; box-shadow: 0 8px 20px -8px rgba(229,72,77,0.28), inset 0 0 0 1.5px ${T.err}; }
        .mp-target-job { font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.9vw,17px); color: ${T.ink}; line-height: 1.35; display: flex; flex-wrap: wrap; align-items: center; gap: 7px; }
        .mp-target-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 9.5px; letter-spacing: 0.08em; color: ${T.ink3}; background: ${T.bg}; border-radius: 6px; padding: 3px 7px; }
        .mp-target-txt { flex: 1; min-width: 120px; }
        .mp-tur { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; padding: 3px 9px; border-radius: 99px; }
        .mp-tur.funksional { color: ${T.blue}; background: ${T.blueSoft}; } .mp-tur.ijtimoiy { color: #B77A16; background: #FBEED6; } .mp-tur.emotsional { color: #D23D82; background: #FBE3F0; }
        .mp-slot { position: relative; min-height: 48px; border-radius: 11px; border: 1.5px dashed ${T.ink3}66; display: flex; align-items: center; justify-content: center; padding: 6px; transition: border-color 0.2s; }
        .mp-target.ok .mp-slot, .mp-target.bad .mp-slot { border-color: transparent; }
        .mp-slot-empty { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink3}; font-style: italic; }
        /* chip — kattaroq, emoji + gradient-fon + soya; ushlaganda scale+tilt (JS transform) */
        .mp-chip { position: relative; display: inline-flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,16px); padding: 12px 18px; border-radius: 13px; border: none; background: linear-gradient(180deg, #fff, #F5F2FE); color: ${T.ink}; box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.26), inset 0 0 0 1.5px ${T.line}; }
        .mp-chip-ic { font-size: 20px; }
        .mp-chip.pool { cursor: grab; user-select: none; transition: transform 0.14s, box-shadow 0.18s; }
        .mp-chip.pool:hover { transform: translateY(-2px) rotate(-1.5deg) scale(1.02); box-shadow: 0 14px 26px -8px rgba(${T.shadowBase},0.32), inset 0 0 0 1.5px ${T.accent}55; }
        .mp-chip.pool:active { cursor: grabbing; }
        .mp-chip.pool.sel { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 10px 22px -8px rgba(91,61,230,0.34), inset 0 0 0 2px ${T.accent}; }
        /* joylangan chip — karta ichiga «yopishgan» + snap-pop */
        .mp-chip.placed { background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; padding: 9px 14px; animation: mp-snap 0.38s cubic-bezier(.3,1.5,.4,1); }
        @keyframes mp-snap { 0% { transform: scale(0.7); } 55% { transform: scale(1.12); } 100% { transform: scale(1); } }
        .mp-chip.placed.ok { color: ${T.success}; background: transparent; box-shadow: none; }
        .mp-chip.placed.bad { color: ${T.err}; text-decoration: line-through; background: transparent; box-shadow: none; }
        .mp-mark { width: 20px; height: 20px; border-radius: 50%; color: #fff; font-size: 11px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }
        /* ✓ — mini-shtamp uslubida (s1 YOLLANDI shtampi bilan bitta til) */
        .mp-mark.ok { background: ${T.successSoft}; color: ${T.success}; border: 2px solid ${T.success}; box-sizing: border-box; transform: rotate(-8deg); font-family: 'JetBrains Mono', monospace; }
        .mp-mark.bad { background: ${T.err}; }
        /* to'g'ri tushganda mini yulduzcha-burst */
        .mp-burst { position: absolute; top: 50%; left: 50%; width: 0; height: 0; pointer-events: none; z-index: 5; }
        .mp-burst span { position: absolute; left: -6px; top: -6px; font-size: 12px; color: #F5A623; text-shadow: 0 0 8px rgba(245,166,35,0.7); opacity: 0; transform: rotate(var(--ba)) translateY(0) scale(0.4); animation: mp-burst-fly 0.8s ease-out 0.1s forwards; }
        @keyframes mp-burst-fly { 0% { opacity: 0; transform: rotate(var(--ba)) translateY(0) scale(0.4); } 30% { opacity: 1; } 100% { opacity: 0; transform: rotate(var(--ba)) translateY(-46px) scale(1); } }
        .mp-pool { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 8px; background: ${T.bg}; border-radius: 14px; padding: 13px 15px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .mp-pool-row { display: flex; flex-wrap: wrap; gap: 10px; min-height: 48px; align-items: center; }
        .mp-pool-done { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.success}; }
        @media (prefers-reduced-motion: reduce) {
          .mp-target.droppable, .mp-target.dragover, .mp-target.ok, .mp-chip.placed { animation: none; }
          .mp-burst { display: none; }
          .mp-chip.pool:hover { transform: none; }
          .cofsh-fill, .cofsh-crown { animation: none; }
        }

        /* === 🎲 BASHORAT-STAVKA (s4 keys) — taxmin-karta + press-chip + reveal-glow === */
        .pred-card { background: linear-gradient(180deg, ${T.paper}, #FBFAFE); border-radius: 18px; padding: clamp(22px,3.6vw,34px) clamp(18px,3vw,30px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), inset 0 0 0 2px ${T.accent}33; }
        .pred-tag { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.12em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
        .pred-q { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(18px,2.8vw,26px); color: ${T.ink}; margin: 0; line-height: 1.3; max-width: 560px; }
        .pred-chips { display: flex; gap: clamp(8px,1.6vw,14px); flex-wrap: wrap; justify-content: center; }
        .pred-chip { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13.5px,1.7vw,15.5px); padding: 12px 18px; border-radius: 14px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.line}; transition: transform 0.14s, box-shadow 0.18s; }
        .pred-chip:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -8px rgba(91,61,230,0.28), inset 0 0 0 1.5px ${T.accent}66; }
        .pred-chip:active { transform: scale(0.95); }
        .pred-ic { font-size: 19px; }
        .pred-cap { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink3}; }
        /* taxmin natijasi — topsa yashil ✓, topmasa NEYTRAL indigo (qizil YO'Q) */
        .pred-res { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12px,1.5vw,13.5px); border-radius: 99px; padding: 6px 14px; animation: hc-cond-pop 0.4s cubic-bezier(.34,1.5,.4,1); }
        .pred-res.hit { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .pred-res.miss { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}33; }
        /* reveal-glow — taxmindan keyin slayd/kod «yonib» ochiladi */
        .reveal-glow { animation: reveal-glow 1.1s ease-out; }
        @keyframes reveal-glow { 0% { box-shadow: 0 0 0 3px ${T.accent}88, 0 0 44px rgba(110,75,255,0.55); } 100% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); } }
        @media (prefers-reduced-motion: reduce) { .pred-res { animation: none; } .reveal-glow { animation: none; } .pred-chip:hover, .pred-chip:active { transform: none; } }

        /* === 📌 YOLLASH DOSKASI — yig'iq strip + ochilma panel (shtamp-metafora davomi) === */
        .hboard { position: fixed; left: clamp(10px,1.6vw,18px); bottom: clamp(76px,10vh,92px); z-index: 890; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: min(320px, 86vw); }
        .hboard-pill { display: inline-flex; align-items: center; gap: 8px; background: ${T.paper}; border: none; border-radius: 999px; padding: 9px 14px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; color: ${T.ink2}; cursor: pointer; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.35), inset 0 0 0 1.5px ${T.line}; transition: transform 0.18s, box-shadow 0.18s; opacity: 0.88; }
        .hboard-pill:hover { transform: translateY(-2px); opacity: 1; box-shadow: 0 14px 30px -10px rgba(91,61,230,0.3), inset 0 0 0 1.5px ${T.accent}55; }
        .hboard.all .hboard-pill { box-shadow: 0 10px 26px -10px rgba(18,169,104,0.35), inset 0 0 0 1.5px ${T.success}66; }
        .hboard-ic { font-size: 14px; }
        .hboard-lbl { letter-spacing: 0.03em; white-space: nowrap; }
        .hboard-slots { display: inline-flex; gap: 4px; }
        .hboard-dot { width: 19px; height: 19px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-style: normal; font-weight: 800; font-size: 10.5px; color: ${T.ink3}; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.25s; }
        .hboard-dot.ok { color: #fff; background: ${T.success}; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        .hboard-car { font-size: 9px; color: ${T.ink3}; }
        .hboard-panel { width: 100%; background: ${T.paper}; border-radius: 14px; padding: 11px 13px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 16px 38px -14px rgba(${T.shadowBase},0.4), inset 0 0 0 1.5px ${T.line}; }
        .hboard-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .hboard-n { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11px; color: ${T.accent}; width: 16px; flex-shrink: 0; }
        .hboard-name { flex: 1; min-width: 0; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .hboard-row:not(.ok) .hboard-name { color: ${T.ink3}; font-weight: 600; font-style: italic; }
        .hboard-dash { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; color: ${T.ink3}; }
        .jhire-stamp.mini.hb { font-size: 8.5px; padding: 2px 7px; }
        .hboard-cap { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 11px; color: ${T.ink3}; }
        @media (prefers-reduced-motion: reduce) { .hboard-dot.ok { animation: none; } .hboard-pill:hover { transform: none; } }
        @media (max-width: 560px) { .hboard { bottom: 70px; } .hboard-lbl { display: none; } }

        /* === 🔎 KODING PROP-OV (s10) — yetishmagan propni topish mikro-mashqi === */
        .kdq { background: ${T.paper}; border-radius: 13px; border-left: 4px solid ${T.accent}; padding: 12px 14px; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); transition: border-color 0.3s; }
        .kdq.ok { border-left-color: ${T.success}; }
        .kdq-lbl { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; }
        .kdq-chips { display: flex; gap: 8px; flex-wrap: wrap; }
        .kdq-chip { border: none; border-radius: 10px; padding: 8px 14px; background: ${T.bg}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: transform 0.14s, box-shadow 0.18s, background 0.2s; }
        .kdq-chip:hover { transform: translateY(-1px); box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
        .kdq-chip:active { transform: scale(0.95); }
        /* noto'g'ri prop bosildi — qisqa qizil silkinish (haqiqiy xato) */
        .kdq-chip.miss { background: ${T.errSoft}; box-shadow: inset 0 0 0 2px ${T.err}; animation: jta-shake 0.4s ease; }
        .kdq-chip.miss .qcode { color: ${T.err}; background: transparent; }
        .kdq-done { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.success}; animation: fade-step 0.3s ease-out; }
        .vsc-copy:disabled { opacity: 0.55; cursor: not-allowed; background: #3A3A3D; }
        @media (prefers-reduced-motion: reduce) { .kdq-chip.miss, .kdq-done { animation: none; } .kdq-chip:hover, .kdq-chip:active { transform: none; } }

        /* === ⚡ SOLO O'Z-TEKSHIRUV KARTALARI (s11 3-qadam) + PODIUM solo-chiplar === */
        .solo-stats { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .solo-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; background: ${T.paper}; border-radius: 99px; padding: 8px 16px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16), inset 0 0 0 1.5px ${T.line}; } .solo-chip b { color: ${T.accent}; }
        .solo-chip.ok { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}55; background: ${T.successSoft}; } .solo-chip.ok b { color: ${T.success}; }

      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title="Jobs-to-be-Done darsi" />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              {BOARD_SCREEN_IDS.has(SCREEN_META[screen].id) && live.mode !== 'mentor' && <HireBoard screen={screen} />}
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







