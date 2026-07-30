import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from 'react';

// Mentor avatari — hostlangan rasm, barcha darsda BIR XIL (DARS_ETALON 11.1, namuna: Htmllesson1)
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM M1-D6 — STRUKTURA: SAYT BO'LIMLARI TARTIBI — 🔴 1-TUR PM ETALONI
// Mavzu: bo'limlar tartibi bezak emas, FOYDALANUVCHI UCHUN QILINGAN QAROR.
// Tur: 1-tur (texnikaga yaqin PM) — mavzu real saytlar orqali ochiladi, o'quvchi
//      joylashtiradi/tartiblaydi, yozma artefakt YO'Q. Qonun: PM_DARS_ETALON 1-B bo'lim.
//      2-tur etaloni (sof PM, o'quvchi yozadi) = src/pm/PmUserStoryLesson.jsx — bu dars unga
//      O'XSHAMASLIGI kerak (klon-taqiq).
// Dizayn: PM-STUDIA identitet-pasporti (PM_DARS_ETALON 1-bo'lim). Texnik darslar (JsIntro/
//      Htmllesson) dekori bu yerga KO'CHIRILMAYDI.
// Navbat-pulsi: 88-qonun + 1-C bo'lim (useTurnHint / useTurnWalk / .turn-ring).
// Mentor ekrani: 90-qonun + 1-D jadvali (shaxsiy hisob va mag'lubiyat-tablosi proyektorda YO'Q).
// Koding: 87-qonun — oldingi texnik darsdan o'sadi (Htmllesson2 header/main/footer nazariyasi;
//      u yerda praktikasi 9.4 tufayli olib tashlangan — shu bo'shliq aynan bu yerda yopiladi).
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

// ============================================================
// 🎨 PM-STUDIA IDENTITET (PM PLATFORM P0 ETALON — barcha PM darslar shu palitrada)
// «Mahsulot-menejerning ish stoli»: chuqur indigo/binafsha brend + studio-qog'oz fon.
// Rang-qonun: accent(indigo)=brend/e'tibor · success(yashil)=muvaffaqiyat · err(qizil)=FAQAT xato ·
// blue(kok)=info · amber=ogohlantirish-urg'u.
// CODESTRIKE arenasi allaqachon binafsha — bu palitra u bilan bitta oilada.
// ============================================================
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB', link: '#5B3DE6',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
};
const G = "'Source Serif 4', Georgia, serif"; // sayt-maketi sarlavhalari (PM-STUDIA tipografikasi)


// ============================================================
// JONLI DARS (live) — Kahoot uslubida: PIN, mentor, o'quvchilar, jonli test.
// InternetLesson/PmLesson1 bilan bir xil infra. O'chirish: LIVE_SUPABASE_URL='' .
// ============================================================
const LIVE_SUPABASE_URL = 'https://dwoubexcexzsinogojiu.supabase.co';
const LIVE_SUPABASE_KEY = 'sb_publishable_cijLMhCDDdo6dlXs05thyw__oH-YgKX';
const LIVE_ENABLED = !!(LIVE_SUPABASE_URL && LIVE_SUPABASE_KEY);
// LIVE_STALE_MS = 180s (60s EMAS): Chrome fon-tabda setInterval'ni ~1 daqiqagacha bo'g'adi —
// mentor boshqa oynaga o'tsa 60s oynada «o'lik» deb topilib, butun sinf-darvoza ochilib ketardi (F-0726-01).
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
// ---- Sahifa-holat saqlovi (F-0730-01): reload'da o'quvchi o'z ekraniga qaytadi.
// TTL 6 soat (kechagi chala urinish bugungi darsga aralashmasin); ekran soni
// o'zgargan bo'lsa saqlov bekor; har qanday xatoda jimgina 0-ekrandan boshlanadi.
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
// Nickname — qurilma bo'ylab BITTA (darsga bog'lanmagan kalit): Internet darsida yozgan ismi shu yerda ham chiqadi
const LIVE_NICK_KEY = 'liveNickname';
const nickRead = () => { try { return localStorage.getItem(LIVE_NICK_KEY) || ''; } catch { return ''; } };
const nickStore = (n) => { try { localStorage.setItem(LIVE_NICK_KEY, n); } catch {} };
// Statistika uchun jadval o'qish (RLS: select ochiq, yozish faqat RPC)
async function liveList(path) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/${path}`, { headers: _liveHdr });
  if (!r.ok) throw new Error(`list: ${r.status}`);
  return r.json();
}
const livePlayers = (pin) => liveList(`live_players?pin=eq.${encodeURIComponent(pin)}&select=id,nickname,joined_at&order=joined_at.asc`);
// screenIdx berilmasa — faqat DARS javoblari (<100); Mustahkamlash javoblari 100+ indekslarda
const liveAnswers = (pin, screenIdx) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}${screenIdx == null ? '&screen_idx=lt.100' : `&screen_idx=eq.${screenIdx}`}&select=player_id,screen_idx,picked,correct,elapsed_ms`);
const liveQuizAnswers = (pin) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}&screen_idx=gte.100&select=player_id,screen_idx,picked,correct,elapsed_ms`);

const LiveGateCtx = createContext(null);

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
  const [quiz, setQuiz] = useState({ state: 'off', q: -1 }); // Mustahkamlash holati (serverdan)
  const [revealScreen, setRevealScreen] = useState(-1); // Kahoot-reveal: mentor natijasini ochgan ekran (serverdan)
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

  // O'QUVCHI: visibility-aware + backoff polling
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

  // MENTOR: heartbeat + o'lik sessiya tekshiruvi
  useEffect(() => {
    if (mode !== 'mentor' || !pin) return;
    let on = true;
    liveGet(pin).then(row => {
      if (!on) return;
      if (!row || row.status === 'ended') { liveClear(lessonId); setPin(null); tokenRef.current = null; setMode('choosing'); setEnded(false); return; }
      syncQuiz(row); // mentor sahifani yangilagan bo'lsa — quiz holati tiklanadi
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
      // Serverdan kelgan o'zbekcha xabarlarni (ism band va h.k.) o'zini ko'rsatamiz
      const m = String(e?.message || '');
      setJoinError(/ism|band|kod|dars|belgi/i.test(m) ? m : "Ulanib bo'lmadi. Internetni tekshiring.");
    }
    finally { setBusy(false); }
  }, [lessonId]);

  const selfStudy = useCallback(() => { setMode('self'); liveStore(lessonId, { mode: 'self' }); }, [lessonId]);
  const reportScreen = useCallback((idx) => { if (mode === 'mentor' && pin) liveRpc('advance_session', { p_pin: pin, p_token: tokenRef.current, p_screen: idx }).catch(() => {}); }, [mode, pin]);
  const endSession = useCallback(() => { if (mode === 'mentor' && pin) { liveRpc('end_session', { p_pin: pin, p_token: tokenRef.current }).catch(() => {}); setEnded(true); } }, [mode, pin]);

  // O'quvchi javobini serverga yozish — birinchi javob qotadi (server unique).
  // Tarmoq uzilsa 3 martagacha qayta uriniladi (javob yo'qolmasin).
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

  // Mustahkamlash boshqaruvi (faqat mentor): 'lobby' | 'q' | 'r' | 'done'
  const quizControl = useCallback(async (state, q) => {
    if (mode !== 'mentor' || !pin) throw new Error('mentor emas');
    await liveRpc('quiz_control', { p_pin: pin, p_token: tokenRef.current, p_state: state, p_q: q ?? -1 });
    setQuiz({ state, q: q ?? -1 });
  }, [mode, pin]);

  // Kahoot-reveal (faqat mentor): «Natijani ochish» — to'g'ri javob barcha
  // o'quvchilar ekranida ham birdan ochiladi (o'quvchi polling orqali oladi)
  const mentorReveal = useCallback((screenIdx) => {
    if (mode !== 'mentor' || !pin) return;
    setRevealScreen(screenIdx); // optimistik — proyektorda darhol
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
  const [nick, setNick] = useState(() => nickRead()); // oldingi darsda yozgan ismi tayyor chiqadi
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
  // 🔴 Katta PIN AUTO-ochilmaydi (L1 etalon) — faqat «📺 Ko'rsatish» tugmasi ochadi (onboarding spotlight to'qnashmasin)
  // Mentor: qo'shilgan o'quvchilar soni (har 6s yangilanadi)
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
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const useLang = () => useContext(LangContext);

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

// AUDIOSIZ: AudioIndicator (ovoz/replay tugmalari) olib tashlandi — ovoz o'chirilgan, ikonka kerak emas.

// ===== IKONKALAR — abstrakt tushunchalar uchun toza chiziq, real ilovalar uchun rangli brend belgilari =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  // abstrakt tushunchalar — joriy rangda (chiziqli)
  user: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-3.6 3.2-5.8 7-5.8s7 2.2 7 5.8" /></svg>),
  problem: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1 .9-1 1.7" /><path d="M12 16.7h.01" /></svg>),
  solution: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M9.5 18h5" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.8 10.7c.7.6 1 1.1 1 1.8h5.6c0-.7.3-1.2 1-1.8A6 6 0 0 0 12 3z" /></svg>),
  arrow: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={1.9}><path d="M4 12h14" /><path d="M13 6l6 6-6 6" /></svg>),
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
  clock: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>),
  map: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></svg>),
  book: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4z" /><path d="M5 16h13" /></svg>),
  // real ilovalar — o'z brend ranglari bilan (bolalar taniydigan belgilar)
  youtube: (s = 26) => (<svg viewBox="0 0 24 24" width={s} height={s}><rect x="2" y="5" width="20" height="14" rx="4.2" fill="#FF0000" /><path d="M10 8.6v6.8L15.8 12z" fill="#fff" /></svg>),
  telegram: (s = 26) => (<svg viewBox="0 0 24 24" width={s} height={s}><circle cx="12" cy="12" r="11" fill="#29A9EB" /><path d="M17.9 7.2l-2.05 9.4c-.15.68-.56.84-1.13.52l-3.1-2.28-1.5 1.44c-.16.16-.3.3-.62.3l.22-3.1 5.68-5.13c.25-.22-.05-.34-.38-.12l-7 4.42-3.02-.94c-.66-.2-.67-.66.14-.97l11.8-4.55c.55-.2 1.03.13.98.49z" fill="#fff" /></svg>),
  market: (s = 26) => (<svg viewBox="0 0 24 24" width={s} height={s}><path d="M5 9.5h14V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" fill="#5B3DE6" fillOpacity="0.18" /><path d="M3.4 5.5h17.2l1.05 3.3a2.25 2.25 0 0 1-4.35.55 2.25 2.25 0 0 1-4.3 0 2.25 2.25 0 0 1-4.3 0 2.25 2.25 0 0 1-4.35-.55z" fill="#5B3DE6" /><rect x="9.7" y="13" width="4.6" height="7" rx="0.8" fill="#5B3DE6" /></svg>),
  taxi: (s = 26) => (<svg viewBox="0 0 24 24" width={s} height={s}><path d="M4 16.2l1.5-4.9A2.5 2.5 0 0 1 7.9 9.6h8.2a2.5 2.5 0 0 1 2.4 1.7l1.5 4.9v3a.8.8 0 0 1-.8.8h-1.5a.8.8 0 0 1-.8-.8V19H6.6v.2a.8.8 0 0 1-.8.8H4.3a.8.8 0 0 1-.8-.8z" fill="#E8A13A" /><rect x="9" y="6.4" width="6" height="2.6" rx="0.5" fill="#222" /><circle cx="7.6" cy="16.4" r="1.15" fill="#222" /><circle cx="16.4" cy="16.4" r="1.15" fill="#222" /></svg>)
};

const LESSON_META = { lessonId: 'pm-m1d6-v1', lessonTitle: { uz: 'Struktura — foydalanuvchi uchun qilingan qulaylik', ru: 'Структура — удобство для пользователя' } };
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5b', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's14', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'koding', type: 'koding',   template: 'custom',   scored: false, scope: null },
  { id: 's15b', type: 'stats',      template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

const Split = ({ children }) => <div className="split">{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

// ===== 🏷️ fmtCode — matn ichidagi `atama`larni chip qilib chiqaradi (11.8) =====
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

// ===== 🏅 ACHIEVEMENTS (nishonlar) — inglizcha o'yin-nomlar, o'zbekcha tavsiflar (siz-forma) =====
const ACHIEVEMENTS = {
  firstwin:   { icon: '🎯', name: 'First Win!',   desc: "Birinchi testni to'g'ri yechdingiz" },
  builder:    { icon: '🧲', name: 'In Order!',    desc: "Bo'limlarni to'g'ri tartibga keltirdingiz" },
  strategist: { icon: '🧠', name: 'Shipped It!',  desc: "Yakuniy sahifa tuzilishini o'zingiz qurdingiz" },
  graduate:   { icon: '🏆', name: 'Level Up!',    desc: "Struktura darsini to'liq yakunladingiz" },
};
// Ekran id → nishon (recordAnswer'da avtomatik beriladi — FAQAT scored test yoki DragDrop challenge)
const ACH_TRIGGERS = { s4: 'firstwin', s11: 'builder', koding: 'strategist' };
// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI — yorqin nurlar, medal portlashi, uchqunlar
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
          <span className="acu-eyebrow">🏅 Nishon ochildi!</span>
          <span className="acu-name">{ach.name}</span>
          {ach.desc && <span className="acu-desc">{ach.desc}</span>}
        </div>
        <span className="acu-tap">bosib davom eting</span>
      </div>
    </div>
  );
}
// Navbatda bittasi ko'rsatiladi (to'liq-ekran bayram) — tugagach keyingisi chiqadi
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}
// Yuqori paneldagi nishon hisoblagichi (AchCtx'dan o'qiydi).
// 🔴 MENTOR EKRANIDA KO'RSATILMAYDI: nishon — QURILMAGA xos, shaxsiy hisob. Proyektorda u
// mentorning o'z bosishlarini sanaydi, sinf ishini emas — ya'ni yolg'on hisob bo'lardi.
// Tamoyil: mentor ekrani = SAHNA (lahzalar), o'quvchi qurilmasi = DAFTAR (hisob).
// F-0729-06: to'liq-ekran bayram (AchCelebrate) ham mentorda O'CHIRILGAN — mentor ekranida badges umuman chiqmaydi.
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
  if (gate && gate.live && gate.live.mode === 'mentor') return null; // hooklardan KEYIN
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
  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px + 60px
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* AUDIOSIZ: ovoz tugmasi (AudioIndicator) ko'rsatilmaydi — ovoz allaqachon o'chirilgan */}
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
// 🔔 NAVBAT-PULSI (88-qonun) — «hozir navbat shu elementda» signali.
// Ekranda ISTALGAN LAHZADA faqat BITTA element yonadi. Puls DARHOL emas, harakatsizlikdan
// keyin chiqadi: o'zi bilgan o'quvchi darhol bosadi va pulsni UMUMAN ko'rmaydi — yordam
// faqat ikkilanganga boradi. `active` yolg'onga o'tsa (bosildi/qulflandi) — darhol o'chadi.
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

// 🔔 NAVBAT YURISHI (88-qonun) — «hammasini ko'rib chiqish» tipidagi ekranlar uchun.
// Puls BAJARILMAGAN elementlar bo'ylab navbat bilan yuradi: istalgan lahzada faqat BITTASI
// yonadi, bajarilgani navbatdan chiqadi, har harakatdan keyin kutish qaytadan boshlanadi.
// Bitta element qolsa — yurishning ma'nosi qolmaydi, u tinch yonib turadi (masalan sukut
// bo'yicha ochiq turgan juftlikda ko'rilmagani).
const TURN_STEP_MS = 1300;   // bitta elementning navbati
const TURN_PAUSE_MS = 3200;  // aylanish tugagach tanaffus (keyin qaytadan)
function useTurnWalk(pending, enabled = true) {
  const key = pending.join('');
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
// Yurish-holatida qisqa «paydo bo'l — turib tur — so'n», yolg'iz qolganda tinch nafas.
const turnCls = (lit, k, walking) => (lit === k ? (walking ? ' turn-ring turn-step' : ' turn-ring') : '');

const NavNext = ({ disabled, label = 'Davom etish', onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  const isOff = (freeRide ? false : disabled) || locked;
  // Navbat tugmada FAQAT u bosiladigan holatda bo'ladi. Shu sababli ikkita shart o'z-o'zidan
  // bajariladi: (a) ballanadigan testda tugma javob berilgunga qadar `disabled` — puls yo'q;
  // (b) mentorni kutayotgan qulflangan tugma ham yonmaydi (83-qonun: qulf o'zi yo'l ko'rsatadi).
  const hint = useTurnHint(!isOff);
  return <button className={`btn-white-accent${hint ? ' turn-hint' : ''}`} disabled={isOff} onClick={onClick} title={locked ? 'Mentor hali bu sahifaga o\'tmadi' : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? '⏳ Mentorni kuting' : (freeRide && disabled ? 'Davom etish' : label)}</button>;
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


// ===== 📖 QAYTA TUSHUNTIRISH (recap) — jonli darsda mentor past natijada ochadi =====
const RECAP_NEED_PCT = 60;   // shundan past — qayta tushuntirish TAVSIYA etiladi
const RECAP_GOOD_PCT = 75;   // shundan yuqori — sinf o'zlashtirdi, bemalol davom
const RECAP_MIN_ANSWERS = 3; // foizga ishonch uchun kamida shuncha javob kerak
// ============================================================
// 📖 QAYTA TUSHUNTIRISH (recap) — test natijasi past chiqsa mentor proyektorda
// ochib, og'zaki qayta tushuntiradi (server sinxronsiz — o'quvchilar qulflangan,
// proyektorga qaraydi). Xato qilgan o'quvchi o'z qurilmasida ham ochishi mumkin.
// Kalitlar — scored test ekranlarining indekslari (4, 6, 10, 13).
// Har karta: ic (katta emoji), h (sarlavha), body (1-2 gap), vis (ko'rgazma),
// ask (mentor sinfga og'zaki beradigan savol — jonli muloqot uchun).
// ============================================================
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
// RECAPS — har scored test uchun «Qayta tushuntirish» kartalari (kalit = ekran indeksi).
// Kalitlar — MCScreen testlar indekslari (4, 6, 10, 13). Yakuniy DragDrop (idx 16) — QuestionScreen
// emas, recap ko'rsatilmaydi (xato bo'lishi mumkin emas: to'g'ri yig'ilganda o'zi hal bo'ladi).
const RECAPS = {
  // idx 4 — s4: «Foydalanuvchi birinchi nimani ko'rishi kerak?» (nazariya: birinchi ekran = sarlavha)
  4: {
    title: 'Birinchi ekran — birinchi blok', cards: [
      { ic: '👀', h: 'Birinchi ekran — birinchi taassurot',
        body: <>Foydalanuvchi saytga kirgach <b>juda tez</b> hal qiladi: qolamanmi yoki ketamanmi. Shuning uchun eng tepada <b>birinchi blok</b> (<b className="mono">hero</b>) turadi — katta sarlavha va bir qatorlik izoh.</>,
        vis: <RcFlow items={['👀 Kirdi', '📢 Birinchi blok', '✅ Qoldi']} /> },
      { ic: '📢', h: "Birinchi blok — bir jumlali va'da",
        body: <>Yaxshi birinchi blok <b>bitta jumlada</b> sayt nima berishini aytadi: «Ortiqcha buyumingizni soting». Foydalanuvchi shuni o'qib, «ha, bu menga kerak» deydi.</>,
        vis: <RcFlow items={['"Ortiqcha buyumni soting"']} /> },
      { ic: '⛔', h: 'Tugma birinchi emas',
        body: <>Ba'zilar harakat tugmasini eng tepaga qo'yadi. Lekin foydalanuvchi hali <b>nega bosishini</b> bilmaydi. Avval birinchi blok — keyin qolgani.</>,
        vis: <RcFlow items={['📢 Birinchi blok', '🖱️ Tugma — keyin']} sep="·" />,
        ask: "Sevimli saytingizda birinchi ekranda nima yozilgan?" },
    ]
  },
  // idx 6 — s5b: «Harakat tugmasi qayerda turishi mantiqiy?» (nazariya: CTA — oxirida)
  6: {
    title: 'Harakat tugmasi — oxirida', cards: [
      { ic: '🖱️', h: 'CTA — harakatga chaqiruvchi tugma',
        body: <><b className="mono">CTA</b> (Call To Action — harakatga chaqiruv) — foydalanuvchini <b>aniq bir ishga</b> chaqiradigan tugma: «E'lon berish», «Ro'yxatdan o'tish». U — sahifaning maqsadi.</>,
        vis: <RcFlow items={["[ E'lon berish ]"]} /> },
      { ic: '🤝', h: 'Avval ishonch — keyin tugma',
        body: <>Odam notanish tugmani bosmaydi. Avval u <b>muammo</b>, <b>yechim</b> va <b>isbot</b>ni ko'radi — ishonadi. Shundan keyingina tugmani bosadi.</>,
        vis: <RcFlow items={['🤝 Ishondi', '🖱️ Bosdi']} sep="·" /> },
      { ic: '📍', h: 'Shuning uchun — sababdan keyin',
        body: <>Tugma <b>sababdan keyin</b> turadi — odam nima taklif qilinayotganini tushunib bo'lgach. Shuning uchun uni birinchi blok tagiga yoki sahifa oxiriga qo'yishadi. Izohsiz, yolg'iz tepada tursa — odam nega bosishini bilmaydi.</>,
        vis: <RcFlow items={['📢 Birinchi blok', 'sabab', '🖱️ Tugma']} />,
        ask: "Nega tugma sababdan keyin qo'yiladi?" },
    ]
  },
  // idx 10 — s9: «Bo'limlar tartibi nega muhim?» (nazariya: tartib — foydalanuvchi uchun qaror)
  9: {
    title: 'Tartib — foydalanuvchi uchun qulaylik', cards: [
      { ic: '🧭', h: 'Tartib foydalanuvchini yetaklaydi',
        body: <>Bo'limlar tartibi tasodifiy emas. U foydalanuvchini <b>qadam-baqadam</b> yetaklaydi: muammodan yechimga, yechimdan ishonchga, ishonchdan harakatga.</>,
        vis: <RcFlow items={['❓ Muammo', '💡 Yechim', '🖱️ Harakat']} /> },
      { ic: '🎯', h: 'Bezak emas — odam uchun qulaylik',
        body: <>Bo'limlarni qanday joylash — bu <b>foydalanuvchi uchun qilingan qulaylik</b>. Chiroylilik uchun emas — foydalanuvchi <b>adashmasligi</b> uchun.</>,
        vis: <RcFlow items={["🎨 Bezak — yo'q", '🎯 Odam uchun — ha']} sep="·" /> },
      { ic: '🔀', h: 'Aralash tartib — foydalanuvchi adashadi',
        body: <>Bo'limlar aralashsa, foydalanuvchi <b>nima qilishini</b> tushunmaydi va ketadi. To'g'ri tartib esa uni <b>maqsadga</b> olib boradi.</>,
        vis: <RcFlow items={['🔀 Aralash — ketadi', '➡️ Tartibli — qoladi']} sep="·" />,
        ask: "Bo'limlar aralashib ketsa foydalanuvchi nima qiladi?" },
    ]
  },
  // idx 13 — s12: «Eng mantiqiy tartib qaysi?» (nazariya: sahifa = hikoya)
  11: {
    title: 'Sahifa tartibi — hikoya', cards: [
      { ic: '📖', h: 'Sahifa — bu hikoya',
        body: <>Yaxshi sahifa hikoyadek o'qiladi: <b>birinchi blok</b> (nima), <b>muammo</b> (nega), <b>yechim</b> (qanday), <b>isbot</b> (ishonch), <b>tugma</b> (harakat).</>,
        vis: <RcFlow items={['Birinchi blok', 'Muammo', 'Yechim', 'Isbot', 'Tugma']} /> },
      { ic: '🧩', h: "Har bo'limning o'z o'rni",
        body: <>Har bo'lim bitta savolga javob beradi. Ularning <b>joyini almashtirsangiz</b> — hikoya buziladi, foydalanuvchi adashadi.</>,
        vis: <RcFlow items={['nima', 'nega', 'qanday', 'ishonch', 'harakat']} /> },
      { ic: '✅', h: "To'g'ri tartib — konversiya",
        body: <>To'g'ri tartibda foydalanuvchi ishonib, tugmani bosadi — bu <b>konversiya</b> (tashrifchi mijozga aylanadi). Noto'g'ri tartibda esa foydalanuvchi saytdan chiqib ketadi.</>,
        vis: <RcFlow items={['➡️ Tartibli', '🤝 Ishondi', '✅ Konversiya']} />,
        ask: "Konversiya nima degani?" },
    ]
  },
};

// Overlay — ekran ustida (indekslarga tegmaydi)
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

// ===== MENTOR STATISTIKASI (jonli test paneli — InternetLesson bilan bir xil) =====
const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A']; // A B C D — brend-neytral
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
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">noto'g'ri ❌</span></div>
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
        {options.map((_opt, i) => {
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
            {level === 'need' && <>
              <p className="mstats-verdict-t">⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 Qayta tushuntirish — {RECAPS[screenIdx]?.title}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 Qisqa takrorlash</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 Qayta tushuntirish — {RECAPS[screenIdx]?.title}</button>}
            </>}
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
      {reveal && struggling && <p className="mstats-warn">⚠️ Ko'pchilik noto'g'ri javob berdi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.</p>}
      {answered === 0 && <p className="mstats-wait">O'quvchilar javoblari shu yerda jonli ko'rinadi…</p>}
    </div>
  );
}

// ===== MENTOR YOZMA-ISH PANELI — amaliyot/koding ekranlari uchun =====
// O'quvchining yozgan MATNI serverga bormaydi (jadval sxemasi) — faqat «tugatdi»
// belgisi boradi. Mentor kim tugatgani/kim yozayotganini jonli ko'radi.

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
// O'QUVCHI ko'radigan sinf-pulsi (45-qonun): «nechta sinfdosh bajardi / bajarmoqda» jonli hisobi.
// MentorPracticeStats bilan BIR XIL zonadan (PRACTICE_BASE+screen) sof O'QISH — ball-relsga yozmaydi.
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

const QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student'); // jonli dars: BITTA urinish — xato bo'lsa ham qotadi
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now()); // tezlik: savol ochilgandan bosishgacha (teng ballda hal qiladi)
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  // MENTOR (proyektor): o'zi javob BERMAYDI — statistikani kuzatadi, «Natijani ochish»
  // bosganda to'g'ri javob + izoh katta ekranda ochiladi, shundan keyin davom etadi.
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
  // 📖 Qayta tushuntirish (recap) — natija past chiqsa mentor ochadi; o'quvchi xato qilsa o'zi ham ochishi mumkin
  const [recapOpen, setRecapOpen] = useState(false);
  const hasRecap = !!RECAPS[screen];
  // «Natijani ochish» — proyektorda ham, BARCHA o'quvchilar ekranida ham birdan ochiladi (Kahoot reveal)
  const doReveal = () => { setMReveal(true); if (live) live.mentorReveal(screen); if (storedAnswer === undefined) onAnswer(screen, { mentorRevealed: true }); };
  // Mentor sahifani yangilagan bo'lsa — reveal holati serverdan tiklanadi
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect(() => { if (isMentorLive && liveRevealScreen === screen) setMReveal(true); }, [isMentorLive, liveRevealScreen, screen]);
  const pick = (i) => {
    if (solved || isMentorLive) return;
    const isCorrect = i === correctIdx;
    setPicked(i);
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect; // ball: 1-urinishni qotirib qo'yamiz
    if (oneShot) {
      // Jonli dars: javob darhol qotadi (to'g'ri ham, xato ham) va serverga yoziladi
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx; // jonli darsda xato bosib qotgan
  // KAHOOT REVEAL: jonli darsda javob bosilgach to'g'ri/XATO ham sir saqlanadi —
  // faqat «javob qabul qilindi» ko'rinadi. Mentor «Natijani ochish»ni bosganda
  // (reveal_screen) yoki keyingi sahifaga o'tganda / dars tugaganda hammada birdan ochiladi.
  // Erkin rejimda (ended / mentor uzilgan / self) natija darhol ko'rinadi.
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed; // javob qotdi — natija mentordan kutilmoqda
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? 'Davom etish' : 'Avval natijani oching') : solved ? 'Davom etish' : (oneShot ? 'Javob tanlang' : "To'g'ri javobni toping")} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>⚡ Jonli dars — bitta urinish, o'ylab bosing!</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (isMentorLive) {
              if (mReveal) { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; } // reveal'gacha hammasi neytral — proyektorda sir saqlanadi
            } else if (solved) {
              if (waiting) { if (i === picked) cls += ' option-wait'; } // faqat neytral belgi — to'g'ri/xato hali sir
              else { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; if (wrongLocked && i === picked) cls += ' option-picked-wrong'; }
            }
            else if (i === picked) cls += ' option-picked-wrong';
            const showGreenLetter = isMentorLive ? (mReveal && i === correctIdx) : (solved && revealed && i === correctIdx);
            return (
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: 'clamp(12px,1.8vw,16px) clamp(14px,2.2vw,20px)', fontSize: 'clamp(14px,1.7vw,16px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(opt)}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? `✓ To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`
              : waiting
                ? '📨 Javobingiz qabul qilindi'
                : wrongLocked
                  ? `To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`
                  : solved ? "To'g'ri" : "Qaytadan urinib ko'ring"}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {fmtCode(isMentorLive
              ? explainCorrect
              : waiting
                ? "Hozir to'g'ri javobni bilib olasiz."
                : wrongLocked
                  ? (explainWrong[picked] ?? explainWrong.default)
                  : solved ? explainCorrect : (explainWrong[picked] ?? explainWrong.default))}
          </p>
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
              Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */}
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

// Mobil: Mentor yopilganda ish maydonini ko'rinishga olib keladi (avtoskroll)
const MentorCollapseScroll = ({ targetRef }) => {
  const ctx = useContext(MentorCtx) || {};
  const prev = useRef(false);
  useEffect(() => {
    if (ctx.enabled && ctx.collapsed && !prev.current && targetRef && targetRef.current) {
      const el = targetRef.current;
      setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 420);
    }
    prev.current = !!ctx.collapsed;
  }, [ctx.collapsed, ctx.enabled, targetRef]);
  return null;
};

const IcoChip = ({ color = T.accent, soft = T.accentSoft, children, size = 46 }) => (
  <span style={{ width: size, height: size, borderRadius: 13, background: soft, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{children}</span>
);

// Brauzer oynasi — "haqiqiy sayt" maketi (HTML darslar dizayni)
const Preview = ({ url, children, minH }) => (
  <div className="bp-window fade-up delay-1">
    <div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-url"><span className="lock">●</span>{url}</span></div>
    <div className="bp-body" style={{ minHeight: minH }}>{children}</div>
  </div>
);

// Sayt maketi ichidagi mini landing-page
// ===== PM-2 STRUKTURA — bo'limlar va ularning to'g'ri tartibi (marketplace "OLX") =====
const ssv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const sIco = {
  star: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...ssv}><path d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z" /></svg>),
  shield: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...ssv}><path d="M12 3l7 3v5c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>),
  cursor: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...ssv}><path d="M5 4l6 16 2.2-6.2L19 11z" /></svg>),
  up: (s = 15) => (<svg viewBox="0 0 24 24" width={s} height={s} {...ssv} strokeWidth={2.3}><path d="M6 14l6-6 6 6" /></svg>),
  down: (s = 15) => (<svg viewBox="0 0 24 24" width={s} height={s} {...ssv} strokeWidth={2.3}><path d="M6 10l6 6 6-6" /></svg>)
};
// Bo'lim-ranglari: hero=amber(e'tibor) · muammo=pushti(og'riq) · yechim=ko'k(info) ·
// isbot=yashil(ishonch) · harakat=indigo(brend-CTA). Qizil YO'Q — bu xato emas, bo'lim.
// Amber — «ogohlantirish/e'tibor» (xato EMAS: qizil faqat haqiqiy xatoda, 23-qonun)
const AMBER = '#E8A13A', AMBER_SOFT = 'rgba(232,161,58,0.14)', AMBER_INK = '#8F5F12';
const SEC_AMBER = AMBER, SEC_ROSE = '#E0559A';
const SECDATA = {
  hero: { label: 'Birinchi blok (hero)', ic: sIco.star(18), color: SEC_AMBER, job: 'Katta sarlavha va bir qatorlik izoh: bir jumlada sayt nima taklif qilishini aytadi.', snip: '"Ortiqcha buyumingizni soting"' },
  muammo: { label: 'Muammo', ic: Ico.problem(18), color: SEC_ROSE, job: 'Foydalanuvchi o\'zi duch kelgan qiyinchilikni eslatadi — o\'qiganda xayoliga «ha, bu menga tanish» degan fikr keladi.', snip: '"Sotish qiyin edi"' },
  yechim: { label: 'Qanday ishlaydi', ic: Ico.solution(18), color: T.blue, job: 'Sayt shu qiyinchilikni qanday yengib berishini qadamma-qadam ko\'rsatadi.', snip: '"3 daqiqada e\'lon"' },
  isbot: { label: 'Isbot', ic: sIco.shield(18), color: T.success, job: 'Boshqalar allaqachon foydalanayotganini ko\'rsatadi — shundan ishonch tug\'iladi.', snip: 'Velosiped · Telefon' },
  harakat: { label: 'Harakat tugmasi', ic: sIco.cursor(18), color: T.accent, job: 'Aniq keyingi qadamni beradi: «E\'lon berish». Uni CTA ham deyishadi.', snip: '[ E\'lon berish ]' }
};
const ORDER = ['hero', 'muammo', 'yechim', 'isbot', 'harakat'];

const SecView = ({ k }) => {
  if (k === 'hero') return (<div><div className="site-header" style={{ marginBottom: 8 }}><span className="site-brand"><span className="site-logo" style={{ background: T.accent }}>O</span><span className="site-name">OLX</span></span><span className="site-nav"><span>Sotish</span><span>Xarid</span></span></div><h3 className="site-h3" style={{ margin: 0 }}>Ortiqcha buyumingizni soting</h3></div>);
  if (k === 'muammo') return (<p style={{ fontFamily: G, fontSize: 13.5, color: T.ink2, margin: 0 }}>Uyda ishlatilmaydigan narsalar bor — sotish esa qiyin va uzoq.</p>);
  if (k === 'yechim') return (<p style={{ fontFamily: G, fontSize: 13.5, color: T.ink, margin: 0 }}><b>3 daqiqada</b> e'lon bering — minglab xaridor ko'radi.</p>);
  if (k === 'isbot') return (<div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>{['Velosiped — 450 000', 'Telefon — 1 200 000'].map((r, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span style={{ width: 34, height: 26, borderRadius: 6, background: T.bg, flexShrink: 0, boxShadow: `inset 0 0 0 1px ${T.ink3}30` }} /><span style={{ fontFamily: G, fontSize: 13, color: T.ink }}>{r}</span></div>))}</div>);
  if (k === 'harakat') return (<span style={{ display: 'inline-block', background: T.accent, color: '#fff', fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13, padding: '9px 18px', borderRadius: 9 }}>E'lon berish</span>);
  return null;
};
const PagePreview = ({ order, url = 'olx.uz', minH = 240 }) => (
  <Preview url={url} minH={minH}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {order.map((k, i) => (<div key={k} className="pg-in" style={{ paddingBottom: 11, borderBottom: i < order.length - 1 ? `1px solid ${T.ink3}22` : 'none' }}><SecView k={k} /></div>))}
    </div>
  </Preview>
);
// 🧲 Qayta ishlatiladigan DRAG&DROP TARTIBLASH (9.1) — pool + slots, tap-to-place fallback, DOM-transform sudrash.
// Boshqa darsga: `items` ([{id,label}] — TO'G'RI tartibda), `hints`, `onSolved`, `onOrder` almashtiriladi.
function DragDropOrder({ items, hints, onSolved, onOrder }) {
  const order = items.map(x => x.id);
  const byId = React.useMemo(() => Object.fromEntries(items.map(x => [x.id, x])), [items]);
  // YAGONA holat — pool va slots birga (setState ichida setState YO'Q → StrictMode'da dublikat bo'lmaydi)
  const [st, setSt] = useState(() => {
    const a = order.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return { pool: a, slots: order.map(() => null) };
  });
  const { pool, slots } = st;
  const slotRefs = useRef([]);
  const fresh = slots.every(s => s === null); // hali hech narsa joylanmagan — affordance uchun
  const full = slots.every(s => s !== null);
  const solved = slots.every((s, i) => s === order[i]);
  const wrong = full && !solved;
  useEffect(() => { if (solved) onSolved && onSolved(); }, [solved]); // eslint-disable-line
  useEffect(() => { onOrder && onOrder(slots); }, [st]); // eslint-disable-line — joriy tartibni tashqariga uzatadi (Sinov mijozi uchun)
  const place = (id, from, slotIdx) => setSt(({ pool, slots }) => {
    const ns = slots.slice(); const occ = ns[slotIdx];
    if (typeof from === 'number') ns[from] = null;
    ns[slotIdx] = id;
    let np = from === 'pool' ? pool.filter(x => x !== id) : pool.slice();
    if (occ) np = [...np, occ];
    return { pool: np, slots: ns };
  });
  const toPool = (slotIdx) => setSt(({ pool, slots }) => {
    const id = slots[slotIdx]; if (!id) return { pool, slots };
    const ns = slots.slice(); ns[slotIdx] = null;
    return { pool: [...pool, id], slots: ns };
  });
  // Hammasini laganchaga qaytarish — xato yig'ilganda bola bir bosishda qayta boshlaydi
  const resetAll = () => setSt(({ pool, slots }) => ({ pool: [...pool, ...slots.filter(Boolean)], slots: order.map(() => null) }));
  const tap = (id) => setSt(({ pool, slots }) => {
    const e = slots.findIndex(s => s === null); if (e < 0) return { pool, slots };
    const ns = slots.slice(); ns[e] = id;
    return { pool: pool.filter(x => x !== id), slots: ns };
  });
  // Sudrash — asl chip elementini DOM transform bilan suramiz (state yo'q → pirillamaydi).
  const down = (ev, id, from) => {
    if (ev.button != null && ev.button !== 0) return;
    ev.preventDefault();
    const el = ev.currentTarget; const sx = ev.clientX, sy = ev.clientY; let moved = false;
    el.style.transition = 'none'; el.style.zIndex = '9999'; el.style.willChange = 'transform';
    const mv = (e) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 5) moved = true;
      if (moved) el.style.transform = `translate(${dx}px,${dy}px) scale(1.06) rotate(-2deg)`;
    };
    const finish = (el2) => { el2.style.zIndex = ''; el2.style.willChange = ''; el2.style.transform = ''; el2.style.transition = ''; };
    const up = (e) => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      if (!moved) { finish(el); if (from === 'pool') tap(id); else toPool(from); return; }
      let t = -1;
      slotRefs.current.forEach((elm, i) => { if (!elm) return; const r = elm.getBoundingClientRect(); if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) t = i; });
      if (t >= 0) { finish(el); place(id, from, t); }
      else if (typeof from === 'number') { finish(el); toPool(from); }
      else { el.style.transition = 'transform .2s cubic-bezier(.34,1.3,.4,1)'; el.style.transform = ''; setTimeout(() => finish(el), 210); }
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  return (
    <div className="dd fade-up">
      <div className="dd-slots">
        {slots.map((sid, i) => (
          <div key={i} ref={el => (slotRefs.current[i] = el)} className={`dd-slot ${sid ? 'filled' : ''} ${solved && sid ? 'ok' : ''} ${wrong && sid && sid !== order[i] ? 'bad' : ''}`}>
            <span className="dd-slotn">{i + 1}</span>
            {sid ? <button className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{byId[sid].label}</button> : <span className="dd-hint">{hints ? hints[i] : 'bu yerga joylang'}</span>}
          </div>
        ))}
      </div>
      <div className="dd-pool">
        {pool.map(id => <button key={id} className={`dd-chip ${fresh ? 'hint' : ''}`} onPointerDown={(e) => down(e, id, 'pool')}>{byId[id].label}</button>)}
      </div>
      {solved && <div className="dd-done">✓ To'g'ri! Sahifa aynan shu tartibda.</div>}
      {wrong && !solved && <div className="dd-wrong">⚠️ Tartib noto'g'ri.<button className="dd-retry" onClick={resetAll}>↻ Qayta joylash</button></div>}
    </div>
  );
}

// 🧍 SINOV MIJOZI (Ijodkor brifi, GATE 1.5) — o'quvchi qurgan tartibni "mijoz" bo'lim-baqadam bosib o'tadi.
// Holatlar: idle → walking → (convert | bounce). To'g'ri tartib → har bo'limda ishonch +1 → konversiya (Confetti).
// Noto'g'ri → birinchi buzuq bo'limda to'xtaydi (bounce). Dino step-advance ritmi (~700ms/qadam).
function CustomerRun({ order, correct }) {
  const [state, setState] = useState('idle'); // idle | walking | convert | bounce
  const [step, setStep] = useState(-1);        // joriy bo'lim indeksi (mijoz-avatar shu yerda)
  const [confidence, setConfidence] = useState(0);
  const [badAt, setBadAt] = useState(-1);
  const timer = useRef(null);
  const ready = Array.isArray(order) && order.length === correct.length && order.every(x => x != null);
  useEffect(() => () => clearTimeout(timer.current), []);
  // tartib o'zgarsa — natijani tozalaymiz (qayta yuborishga tayyor)
  useEffect(() => { clearTimeout(timer.current); setState('idle'); setStep(-1); setConfidence(0); setBadAt(-1); }, [(order || []).join(',')]); // eslint-disable-line
  const send = () => {
    if (!ready) return;
    clearTimeout(timer.current);
    setState('walking'); setStep(-1); setConfidence(0); setBadAt(-1);
    const walk = (i) => {
      if (i >= order.length) { setStep(i); setState('convert'); return; }
      if (order[i] !== correct[i]) { setStep(i); setBadAt(i); timer.current = setTimeout(() => setState('bounce'), 480); return; }
      setStep(i); setConfidence(c => c + 1);
      timer.current = setTimeout(() => walk(i + 1), 700);
    };
    timer.current = setTimeout(() => walk(0), 320);
  };
  const walking = state === 'walking';
  const rows = ready ? order : correct;
  return (
    <div className="cr">
      <p className="flow-label">Foydalanuvchi — sahifangizni birinchi marta ochib ko'rayotgan odam</p>
      <div className="cr-page">
        {rows.map((k, i) => {
          const here = step === i && (walking || state === 'bounce');
          const done = state !== 'idle' && step > i;
          const bad = state === 'bounce' && badAt === i;
          return (
            <div key={i} className={`cr-row ${here ? 'here' : ''} ${done ? 'done' : ''} ${bad ? 'bad' : ''}`}>
              <div style={{ flex: 1, minWidth: 0 }}>{k ? <SecView k={k} /> : <span className="cr-empty">— bo'sh —</span>}</div>
              {here && <span className={`cr-avatar ${bad ? 'leaving' : ''}`} aria-hidden="true">🧍</span>}
              {done && <span className="cr-tick" aria-hidden="true">{Ico.check(14)}</span>}
            </div>
          );
        })}
      </div>
      <div className="cr-conf">
        <span className="cr-conf-lbl">Ishonch</span>
        <span className="cr-conf-track"><span className="cr-conf-fill" style={{ width: `${(confidence / correct.length) * 100}%` }} /></span>
        <span className="cr-conf-n mono">{confidence}/{correct.length}</span>
      </div>
      {state === 'convert' && <Confetti />}
      {state === 'convert' && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>Foydalanuvchi ishonch bilan tugmani bosdi — bu <b>konversiya</b>: u siz kutgan harakatni bajardi. To'g'ri tartib uni oxirigacha yetaklab bordi.</p></div>}
      {state === 'bounce' && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>Foydalanuvchi shu bo'limga kelganda adashdi va sahifadan chiqib ketdi — bu bo'lim o'z o'rnida emas. Tartibni tuzatib, yana sinab ko'ring.</p></div>}
      <button className={`btn ${state === 'convert' ? 'cr-cta-fire' : ''}`} onClick={send} disabled={!ready || walking} style={{ alignSelf: 'flex-start' }}>
        {walking ? 'Foydalanuvchi sahifani ko\'rmoqda…' : state === 'convert' ? '↻ Yana sinab ko\'rish' : state === 'bounce' ? '↻ Qayta sinab ko\'rish' : 'Sahifani sinab ko\'rish'}
      </button>
    </div>
  );
}

// 🃏 Qayta ishlatiladigan FLASHCARDS (9.3) — aktiv takrorlash (3D flip + o'z-o'zini baholash).
// Boshqa darsga: faqat `cards` ({ front, back, note }) almashtiriladi.
const PM_FLASHCARDS = [
  { front: "Sahifaning eng tepasida qaysi bo'lim turadi?", back: 'Birinchi blok (hero)', note: "katta sarlavha va bir qatorlik izoh" },
  { front: "Muammo bo'limi nima vazifani bajaradi?", back: "Foydalanuvchining muammosini aytib beradi", note: "«nega bu sayt kerak?» — sababi shu yerda" },
  { front: "Yechim bo'limi nima vazifani bajaradi?", back: "Sayt muammoni qanday hal qilishini ko'rsatadi", note: "muammodan keyin keladi" },
  { front: "Isbot bo'limi nima vazifani bajaradi?", back: "Ishonch uyg'otadi", note: "boshqalar ham foydalanayotganini ko'rsatadi" },
  { front: "Harakat tugmasi qayerda turadi?", back: "Sahifaning oxirida", note: "foydalanuvchi ishongandan keyin bosiladi" },
  { front: "Bo'limlar tartibi kim uchun tuziladi?", back: 'Foydalanuvchi uchun', note: "bezak emas — qulaylik" },
  { front: "Yaxshi sahifa qanday o'qiladi?", back: 'Hikoyadek, boshdan oxirigacha', note: "muammo → yechim → isbot → tugma" },
];
function Flashcards({ cards }) {
  const [queue, setQueue] = useState(() => cards.map((_, i) => i));
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [exiting, setExiting] = useState(null); // 'knew' | 'again' — karta uchib chiqish animatsiyasi
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
  const knew = () => advance(true);
  const again = () => advance(false);
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
          <div className="fc-face fc-back"><span className="fc-tag">{card.back}</span>{card.note && <span className="fc-note">{card.note}</span>}</div>
        </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>✗ Takrorlash</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>✓ Bildim</button></div>)
        : (<p className="fc-hint">👆 Kartani bosing — javobni ko'rasiz</p>)}
    </div>
  );
}

// Animatsiyani katta ekranda ko'rish uchun o'rovchi — ⛶ tugma, holat saqlanadi
const Zoomable = ({ children }) => {
  const [big, setBig] = useState(false);
  useEffect(() => {
    if (!big) return;
    const onKey = (e) => { if (e.key === 'Escape') setBig(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [big]);
  return (
    <>
      {big && <div className="zoom-backdrop" onClick={() => setBig(false)} />}
      <div className={`zoomable ${big ? 'zoom-on' : ''}`}>
        <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? 'Kichraytirish' : 'Kattalashtirish'} title={big ? 'Kichraytirish' : 'Kattalashtirish'}>{big ? '✕' : '⛶'}</button>
        {children}
      </div>
    </>
  );
};

// ===== SCREEN 0 — HOOK =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [v, setV] = useState('good');
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  // 🔔 Navbat (88-qonun) — bu ekranda IKKI qadam bor, mentor ham shuni aytadi:
  // «Ikkala tugmani bosib solishtiring, KEYIN sababini tanlang».
  // 1-navbat: «Tartibli» sukut bo'yicha ochiq turadi — demak ko'rilmagani «Aralash».
  // 2-navbat: solishtirgach, uchala variant BIRMA-BIR yonadi (bittasi emas — ular teng emas,
  //           bittasini ajratib ko'rsatish javobga undash bo'lardi).
  const [seenBad, setSeenBad] = useState(false);
  const cmpHint = useTurnHint(!seenBad);
  const voteHint = useTurnHint(seenBad && picked === null);
  const goodOrder = ORDER;
  const badOrder = ['harakat', 'isbot', 'muammo', 'hero', 'yechim'];
  const OPTS = [
    { id: 'a', label: 'Ranglari chiroyliroq' },
    { id: 'b', label: 'Bo\'limlari boshqa tartibda' },
    { id: 'c', label: 'Matni ko\'proq yozilgan' }
  ];
  const pick = (id) => { if (picked !== null) return; setPicked(id); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: true }); };
  return (
    <Stage eyebrow="Kirish" screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label="Davom etish" onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 780 }}>Ikkala sahifada so'zlar bir xil, ammo nega birida kerakli narsa <span className="italic" style={{ color: T.accent }}>darrov topiladi</span>?</h1>
        <Mentor>Mana internet-magazin — OLX sayti, pastdagi <b style={{ color: T.ink }}>«Tartibli»</b> va <b style={{ color: T.ink }}>«Aralash»</b> tugmalarini bosib, ikki ko'rinishni solishtiring. So'ng savolga javobingizni variantlardan belgilang.</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${v === 'good' ? 'chip-on' : ''}`} onClick={() => setV('good')}>Tartibli</button>
              <button className={`chip ${v === 'bad' ? 'chip-on' : ''}${cmpHint ? ' turn-ring' : ''}`} onClick={() => { setV('bad'); setSeenBad(true); }}>Aralash</button>
            </div>
            <div key={v}><PagePreview order={v === 'good' ? goodOrder : badOrder} minH={232} /></div>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>Sizningcha, ikkalasining farqi nimada?</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {/* Navbat to'lqini: variantlar BIRMA-BIR yonadi (istalgan lahzada faqat bittasi —
                  88-qonun (a) buzilmaydi). Bittasini ajratib ko'rsatmaymiz: variantlar teng emas
                  (b — o'ylantiruvchi javob, c — noto'g'ri), shuning uchun bittasini yoritish
                  javobga undash bo'lardi. To'lqin cheklangan (4 aylanish) — sekin o'qiydigan
                  o'quvchi cheksiz harakatdan charchamasin. */}
              {OPTS.map((o, oi) => { const on = picked === o.id; return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}${voteHint ? ` turn-ring turn-wave w${oi + 1}` : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{o.label}</span></button>); })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">Farq — bo'limlarning <b>tartibida</b>: so'zlar bir xil bo'lsa ham, biri to'g'ri tartibda turgani uchun kerakli narsa darrov topiladi. Bugun aynan shu tartibni qurishni o'rganasiz.</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: 'Birinchi nima ko\'rinadi', tag: '' },
    { text: 'Tartib — hikoya', tag: '' },
    { text: 'Bo\'lim vazifalari', tag: '' },
    { text: 'Tartibni tuzatish', tag: '' },
    { text: 'Sahifa tartibini qurasiz', tag: '' }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const Idea = ({ ic, h, t, c }) => (<div className="frame" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}><IcoChip color={c} soft={T.bg}>{ic}</IcoChip><div><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, color: T.ink, margin: 0, fontSize: 'clamp(16px,2.2vw,19px)' }}>{h}</p><p className="body" style={{ margin: '2px 0 0', color: T.ink2 }}>{t}</p></div></div>);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">Asosiy g'oya</p>
      <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Idea ic={sIco.star(22)} c={SEC_AMBER} h="TARTIB — O'YLAB QILINGAN TANLOV" t="Har bo'limning o'rni foydalanuvchiga qarab hal qilinadi" />
        <Idea ic={Ico.arrow(22)} c={T.accent} h="SAHIFA — KICHIK HIKOYA" t="U odamni qadam-baqadam kerakli ishgacha yetaklab boradi" />
      </div>
    </Col>
  );
  const StepsBlock = (<Col><p className="flow-label">5 qadam</p><ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{s.text}</span>{s.tag && <span className="step-tag">{s.tag}</span>}</span></li>))}</ol></Col>);
  return (
    <Stage eyebrow="Reja" screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label="Boshlaymiz →" onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">Saytni <span className="italic" style={{ color: T.accent }}>qaysi tartibda</span> tuzsak tushunarli bo'ladi?</h2></div>
        <Mentor>Yaxshi sayt bo'limlarni to'g'ri tartibda joylashtiradi — bugun siz ham shu <b style={{ color: T.ink }}>tartibni</b> o'rganasiz. Yo'limiz — 5 qadam: ro'yxatga qarang, so'ng boshlaymiz.</Mentor>
        {!isNarrow ? (<Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable>) : !showSteps ? (<div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{PreviewBlock}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>5 qadamni ko'rish</button></div>) : (<div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>↩ G'oyani ko'rish</button>{StepsBlock}</div>)}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — BIRINCHI EKRAN (fold) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [top, setTop] = useState('hero');
  const [seen, setSeen] = useState(new Set(['hero']));
  // Navbat: «Sarlavha» sukut bo'yicha ochiq — demak ko'rilmagani «Tugma» (88-qonun (a2)).
  const pend2 = ['hero', 'cta'].filter(k => !seen.has(k));
  const lit2 = useTurnWalk(pend2);
  const done = seen.size >= 2;
  const set = (t) => { setTop(t); setSeen(prev => { const n = new Set(prev); n.add(t); return n; }); };
  const order = top === 'hero' ? ORDER : ['harakat', 'hero', 'muammo', 'yechim', 'isbot'];
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow="Birinchi ekran" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? 'Davom etish' : 'Ikkalasini ko\'ring'} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Saytga kirgan foydalanuvchi avval <span className="italic" style={{ color: T.accent }}>nimani</span> ko'radi?</h2></div>
        <Mentor>Saytga kirgan foydalanuvchi dastlab faqat sahifaning <b style={{ color: T.ink }}>yuqori qismini</b> ko'radi — qolish yoki ketish shu yerda hal bo'ladi. Pastdagi ikki tugmani bosib, farqni o'zingiz ko'ring.</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${top === 'hero' ? 'chip-on' : ''}${turnCls(lit2, 'hero', pend2.length > 1)}`} onClick={() => set('hero')}>Tepada: birinchi blok</button>
              <button className={`chip ${top === 'cta' ? 'chip-on' : ''}${turnCls(lit2, 'cta', pend2.length > 1)}`} onClick={() => set('cta')}>Tepada: tugma</button>
            </div>
            <div key={top}><PagePreview order={order} minH={210} /></div>
          </Col>
          <Col>
            {top === 'hero'
              ? <div className="frame-success fade-step" key="h"><p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tushunarli</p><p className="body" style={{ margin: 0, color: T.ink }}><b>Sayt nima taklif qilayotgani</b> birinchi qarashdayoq ko'rinib turibdi — foydalanuvchi qiziqib, saytdan foydalanishda davom etadi.</p></div>
              : <div className="frame-warn fade-step" key="c"><p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: AMBER_INK, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tushunarsiz</p><p className="body" style={{ margin: 0, color: T.ink }}>Tepada <b>tugma</b>, lekin nega bosish kerakligi noma'lum. Foydalanuvchi tushunmay saytga kirmay qo'yadi.</p></div>}
            {done && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>Shuning uchun eng tepaga <b>birinchi blok (hero)</b> qo'yiladi: katta sarlavha va izoh.</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — REAL SAYTLAR TUZILISHI =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const SITES = {
    market: { ic: Ico.market(24), name: 'OLX', rows: ['Birinchi blok: nimani sotasiz', 'Qanday ishlaydi', 'Mahsulotlar (isbot)', 'E\'lon berish (tugma)'] },
    news: { ic: Ico.book(24), name: 'Yangiliklar', rows: ['Birinchi blok: eng katta xabar', 'Asosiy yangiliklar', 'Boshqa xabarlar', 'Obuna bo\'lish (tugma)'] },
    video: { ic: Ico.youtube(24), name: 'Video', rows: ['Birinchi blok: tavsiya etilgan video', 'Mashhur videolar', 'Kanallar', 'Ko\'rishni boshlash'] }
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 3;
  // Navbat ko'rilmagan saytlar bo'ylab yuradi — uchalasi birdan emas, birma-bir.
  const pend3 = Object.keys(SITES).filter(k => !seen.has(k));
  const lit3 = useTurnWalk(pend3);
  const tap = (k) => { setActive(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow="Real saytlar" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? 'Davom etish' : `${seen.size}/3 ko'ring`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Uchta mashhur saytni bosib, <span className="italic" style={{ color: T.accent }}>tuzilishini</span> solishtiring</h2></div>
        <Mentor>Mashhur saytlar ham shu qoidaga amal qiladi. Pastdagi uchta saytni <b style={{ color: T.ink }}>birma-bir bosing</b> — har birida bo'limlar qaysi tartibda turgani ochiladi.</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {Object.keys(SITES).map(k => (<button key={k} className={turnCls(lit3, k, pend3.length > 1).trim()} onClick={() => tap(k)} style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', border: 'none', borderRadius: 12, padding: '13px 15px', background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -7px rgba(91,61,230,0.22)` : `0 6px 16px -8px rgba(${T.shadowBase},0.16)`, transition: 'all 0.18s' }}><span style={{ display: 'inline-flex' }}>{SITES[k].ic}</span><span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 15, color: T.ink }}>{SITES[k].name}</span>{seen.has(k) && <span style={{ marginLeft: 'auto', color: T.success, display: 'inline-flex' }}>{Ico.check(14)}</span>}</button>))}
            </div>
          </Col>
          <Col>
            {active ? (<div className="sk-info fade-step" key={active}><span className="sk-tagbig"><span style={{ display: 'inline-flex' }}>{SITES[active].ic}</span><span className="sk-wordbadge">{SITES[active].name}</span></span><div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>{SITES[active].rows.map((r, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span className="mono" style={{ fontSize: 11, fontWeight: 700, color: T.accent, minWidth: 14 }}>{i + 1}</span><span className="body" style={{ margin: 0, color: T.ink }}>{r}</span></div>))}</div></div>) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>Bir saytni bosing</p></div> : null)}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>Ko'rdingizmi — uchalasida ham <b>eng muhim narsa birinchi blokda</b> turibdi. Tugma esa eng oxirida turibdi — foydalanuvchi nega bosish kerakligini tushungandan keyin chiqadi.</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow="Mashq · 1-savol"
    questionText="Saytga kirgan foydalanuvchi birinchi nimani ko'rishi kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-sub" style={{ marginTop: 8 }}>Saytga kirgan foydalanuvchi birinchi <span className="italic" style={{ color: T.accent }}>nimani</span> ko'rishi kerak?</h2></>}
    options={['Birinchi blokni — sayt nima taklif qilishini', 'Eng pastdagi `footer`ni — havolalar va aloqani', 'Harakat tugmasini — darrov bosib qo\'yishi uchun', 'Mahsulotlar ro\'yxatini — narxlari bilan']} correctIdx={0}
    explainCorrect="To'g'ri! Eng birinchi bo'lib birinchi blok (`hero`) ko'rinadi — katta sarlavha bir jumlada sayt nima taklif qilishini aytadi. Shuni tushungan foydalanuvchi qiziqib, saytdan foydalanishda davom etadi."
    explainWrong={{ 1: '`footer` — sahifaning eng pastki qismi: havolalar va aloqa. Birinchi ko\'rinishda esa birinchi blok turadi.', 2: 'Tugmani sababsiz ko\'rsatsa, foydalanuvchi nega bosishini tushunmaydi. Avval birinchi blok.', 3: 'Ro\'yxat foydalanuvchi nima taklif qilinayotganini tushungach kerak bo\'ladi. Avval birinchi blok.', default: 'Birinchi — birinchi blok (sayt nima taklif qiladi).' }} />
);

// ===== SCREEN 5 — HAR BO'LIMNING VAZIFASI =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 5;
  // Navbat ochilmagan bo'limlar bo'ylab yuradi; bosilgani navbatdan chiqadi, qolganlari
  // aylanishda davom etadi (masalan 1,2,5 ochilgan bo'lsa — 3 va 4 navbatlashadi).
  const pend5 = ORDER.filter(k => !seen.has(k));
  const lit5 = useTurnWalk(pend5);
  const tap = (k) => { setActive(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow="Bo'lim vazifasi" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? 'Davom etish' : `${seen.size}/5 bo'limni oching`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Sahifadagi beshta bo'lim qanday <span className="italic" style={{ color: T.accent }}>vazifalarni</span> bajaradi?</h2></div>
        <Mentor>Yaxshi sahifada ishlamaydigan bo'lim bo'lmaydi — hammasining aniq <b style={{ color: T.ink }}>vazifasi</b> bor. Pastdagi beshta bo'limni birma-bir bosing: bosganingizda uning vazifasi ochiladi.</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ORDER.map(k => { const s = SECDATA[k]; return (<button key={k} className={turnCls(lit5, k, pend5.length > 1).trim()} onClick={() => tap(k)} style={{ display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 12, padding: '12px 14px', background: T.paper, color: active === k ? s.color : T.ink2, boxShadow: active === k ? `inset 0 0 0 2px ${s.color}, 0 8px 20px -8px ${s.color}44` : `0 6px 16px -8px rgba(${T.shadowBase},0.16)`, transition: 'all 0.18s' }}><span style={{ color: s.color, display: 'inline-flex' }}>{s.ic}</span><span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 14, color: T.ink }}>{s.label}</span>{seen.has(k) && <span style={{ marginLeft: 'auto', color: T.success, display: 'inline-flex' }}>{Ico.check(14)}</span>}</button>); })}
            </div>
          </Col>
          <Col>
            {active ? (<div className="sk-info fade-step" key={active}><span className="sk-tagbig"><span style={{ color: SECDATA[active].color, display: 'inline-flex' }}>{SECDATA[active].ic}</span><span className="sk-wordbadge" style={{ color: SECDATA[active].color, background: SECDATA[active].color + '1c' }}>{SECDATA[active].label}</span></span><p className="body" style={{ color: T.ink, margin: '12px 0 0' }}>{SECDATA[active].job}</p></div>) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>Bir bo'limni bosing</p></div> : null)}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>Endi beshala bo'limning vazifasini bilasiz. Keyingi qadam — ularni <b>to'g'ri tartibda</b> joylashtirishni o'rganish.</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5b — TEST 2 =====
const Screen5b = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow="Mashq · 2-savol"
    questionText="Harakat tugmasi sahifaning qayerida turishi kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-sub" style={{ marginTop: 8 }}>Harakat tugmasi (CTA) sahifaning <span className="italic" style={{ color: T.accent }}>qayerida</span> turishi kerak?</h2></>}
    options={['Eng tepada, hammadan ham oldin', 'Sahifa o\'rtasida, muammodan oldin', 'Sabab ko\'rsatilgandan keyin, oxirroqda', 'Menyuda, boshqa havolalar orasida']} correctIdx={2}
    explainCorrect="To'g'ri! Avval foydalanuvchi muammo, yechim va isbotni ko'rib ishonch hosil qiladi — endi tugmani bosishga sababi bor."
    explainWrong={{ 0: 'Tepada bo\'lsa, foydalanuvchi nega bosishini hali bilmaydi. Avval ishontirish kerak.', 1: 'Muammodan oldin hali erta — foydalanuvchi bu yerda hali ishonmagan. Tugma sabab ko\'rsatilgandan keyin keladi.', 3: 'Havolalar orasida tugma ko\'zga tashlanmaydi. U foyda tushuntirilgach, alohida turishi kerak.', default: 'Tugma — foydalanuvchi nega bosishini tushungandan keyin.' }} />
);

// ===== SCREEN 6 — TARTIB = HIKOYA (stepper) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? ORDER.length : 0);
  const [running, setRunning] = useState(false);
  // Navbat (88-qonun): bu ekranda birinchi harakat — hikoyani qurishni boshlash.
  // Qurilib bo'lgach navbat «Davom etish»ga o'tadi, shuning uchun `done` da puls yo'q.
  const timer = useRef(null);
  const done = step >= ORDER.length;
  const runHint = useTurnHint(!running && !done);
  const isMobile = useIsMobile();
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => { clearTimeout(timer.current); setStep(0); setRunning(true); const tick = (i) => { setStep(i); if (i < ORDER.length) timer.current = setTimeout(() => tick(i + 1), 720); else { setRunning(false); } }; timer.current = setTimeout(() => tick(1), 350); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow="Tartib — hikoya" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? 'Davom etish' : 'Avval kuzating'} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.4vw,13px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Sahifa qanday qilib <span className="italic" style={{ color: T.accent }}>hikoyaga</span> aylanadi?</h2></div>
        <Mentor>Yaxshi sahifa hikoyaga o'xshaydi: bitta bo'limni o'qigan foydalanuvchi <b style={{ color: T.ink }}>keyingisini ham</b> o'qigisi keladi. Pastdagi «Hikoyani qurish» tugmasini bosing — beshta bo'lim ko'z oldingizda birma-bir joylashib boradi.</Mentor>
        <Zoomable>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {ORDER.map((k, i) => { const s = SECDATA[k]; const on = step > i; return (<React.Fragment key={k}><div style={{ display: 'flex', alignItems: 'center', gap: 11, background: T.paper, borderRadius: 11, padding: '7px 13px', opacity: on ? 1 : 0.4, boxShadow: on ? `0 7px 18px -10px rgba(${T.shadowBase},0.18)` : 'none', transition: 'all 0.4s' }}><IcoChip color={on ? s.color : T.ink3} soft={on ? s.color + '1c' : T.line} size={31}>{s.ic}</IcoChip><div style={{ minWidth: 0 }}><p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 13.5, color: on ? T.ink : T.ink3, margin: 0 }}>{s.label}</p></div>{!isMobile && <span style={{ marginLeft: 'auto', fontFamily: G, fontSize: 12.5, fontStyle: 'italic', color: on ? T.ink2 : T.ink3, whiteSpace: 'nowrap' }}>{s.snip}</span>}{on && <span style={{ marginLeft: isMobile ? 'auto' : 10, color: T.success }}>{Ico.check(15)}</span>}</div>{i < ORDER.length - 1 && <div style={{ display: 'flex', justifyContent: 'center', color: step > i + 1 ? T.success : T.ink3, transform: 'rotate(90deg)', lineHeight: 1, transition: 'color 0.3s' }}>{Ico.arrow(12)}</div>}</React.Fragment>); })}
        </div>
        <button className={`btn${runHint ? ' turn-ring' : ''}`} onClick={run} disabled={running} style={{ alignSelf: 'flex-start' }}>{running ? 'Qurilmoqda…' : (done ? '↻ Yana ko\'rish' : 'Hikoyani qurish')}</button>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>Mana to'g'ri tartib: <b>birinchi blok, muammo, yechim, isbot, harakat tugmasi</b>. Shu tartibda o'qigan foydalanuvchi oxiriga yetganda tugmani ishonch bilan bosadi.</p></div>}
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};


// ===== SCREEN 8 — MOSLASH: bo'lim ↔ vazifa =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const PAIRS = ['hero', 'muammo', 'isbot', 'harakat'];
  const NEEDS = [
    { id: 'isbot', text: 'Boshqalar foydalanayotganini ko\'rsatadi' },
    { id: 'hero', text: 'Bir jumlada sayt nimaligini aytadi' },
    { id: 'harakat', text: 'Aniq keyingi qadamni beradi' },
    { id: 'muammo', text: 'Tanish qiyinchilikni eslatadi' }
  ];
  const [sel, setSel] = useState(null);
  const [matched, setMatched] = useState({});
  const [wrong, setWrong] = useState(null);
  const done = Object.keys(matched).length >= 4;
  // Navbat hali moslanmagan bo'limlar bo'ylab yuradi. Bo'lim tanlangach (`sel`) puls TO'XTAYDI —
  // endi navbat o'ng ustundagi vazifada, uni yoritish esa javobni aytib qo'yish bo'lardi.
  const pend8 = PAIRS.filter(id => !matched[id]);
  const lit8 = useTurnWalk(pend8, !sel);
  const pickP = (id) => { if (matched[id]) return; setSel(id); setWrong(null); };
  const pickN = (id) => { if (!sel) return; if (id === sel) { setMatched(prev => ({ ...prev, [sel]: true })); setSel(null); setWrong(null); } else setWrong(id); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cardBtn = (extra) => ({ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', border: 'none', borderRadius: 12, padding: '12px 14px', fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 'clamp(13px,1.5vw,14.5px)', color: T.ink, transition: 'all 0.18s', ...extra });
  return (
    <Stage eyebrow="Amaliyot" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? 'Davom etish' : `${Object.keys(matched).length}/4 moslang`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Qaysi bo'lim qaysi ishni bajaradi — <span className="italic" style={{ color: T.accent }}>topa olasizmi</span>?</h2></div>
        <Mentor>Chapdagi bo'limlardan bittasini tanlang, so'ng o'ng tomondan uning <b style={{ color: T.ink }}>vazifasini</b> toping — to'g'ri topsangiz, juftlik yashil rangga o'zgaradi.</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">Bo'limlar</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {PAIRS.map(id => { const s = SECDATA[id]; const m = matched[id]; const on = sel === id; return (<button key={id} className={turnCls(lit8, id, pend8.length > 1).trim()} onClick={() => pickP(id)} disabled={m} style={cardBtn({ cursor: m ? 'default' : 'pointer', opacity: m ? 0.5 : 1, background: m ? T.successSoft : T.paper, boxShadow: on ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -7px rgba(91,61,230,0.22)` : `0 6px 16px -8px rgba(${T.shadowBase},0.16)` })}><span style={{ color: m ? T.success : s.color, display: 'inline-flex' }}>{m ? Ico.check(18) : s.ic}</span><span style={{ flex: 1, fontWeight: 600 }}>{s.label}</span></button>); })}
            </div>
          </Col>
          <Col>
            <p className="flow-label">Vazifalar</p>
            <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {NEEDS.map(n => { const m = matched[n.id]; const isWrong = wrong === n.id; return (<button key={n.id} onClick={() => pickN(n.id)} disabled={m || !sel} style={cardBtn({ cursor: (m || !sel) ? 'default' : 'pointer', opacity: m ? 0.55 : 1, color: !sel && !m ? T.ink2 : T.ink, background: m ? T.successSoft : (isWrong ? T.errSoft : T.paper), boxShadow: m ? 'none' : !sel ? `inset 0 0 0 1.5px ${T.line}` : isWrong ? `inset 0 0 0 1.5px ${T.err}66, 0 6px 16px -8px rgba(${T.shadowBase},0.16)` : `inset 0 0 0 1.5px ${T.accent}44, 0 10px 22px -8px rgba(91,61,230,0.28)` })}><span style={{ flex: 1 }}>{n.text}</span>{m && <span style={{ color: T.success, display: 'inline-flex' }}>{Ico.check(16)}</span>}</button>); })}
            </div>
            {wrong && !done && <p className="small" style={{ color: T.err, margin: 0 }}>Bu boshqa bo'limning vazifasi — chapdagi bo'lim nima qilishini bir eslang.</p>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>Zo'r, hammasini to'g'ri uladingiz! Ko'rdingizmi — to'rtta bo'lim to'rt xil ish bajaradi. Shuning uchun birining o'rnini boshqasi bosa olmaydi.</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEST 3 =====
const Screen9 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow="Mashq · 3-savol"
    questionText="Bo'limlarni to'g'ri tartibda joylashdan maqsad nima?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-sub" style={{ marginTop: 8 }}>Bo'limlarni to'g'ri tartibda joylashdan <span className="italic" style={{ color: T.accent }}>maqsad</span> nima?</h2></>}
    options={['Sahifaga chiroyli ko\'rinish berish uchun', 'Foydalanuvchini muammodan yechimga yetaklash uchun', 'Sahifani uzunroq va to\'liqroq qilish uchun', 'Qidiruvda yuqoriroq chiqib turish uchun']} correctIdx={1}
    explainCorrect="To'g'ri! Tartib — bu yo'l: foydalanuvchini muammodan yechimga, keyin harakatga olib boradi. Bu foydalanuvchi uchun qilingan qulaylik."
    explainWrong={{ 0: 'Chiroyli ko\'rinish — bezashning ishi, u keyingi darslarda. Tartibning vazifasi esa foydalanuvchini yetaklash.', 2: 'Uzunlik maqsad emas. Tartib — foydalanuvchini to\'g\'ri yo\'ldan olib borish uchun.', 3: 'Qidiruvdagi o\'rin boshqa narsalarga bog\'liq. Tartib esa odamni yechimga olib borish uchun.', default: 'Tartib foydalanuvchini muammodan yechimga olib boradi.' }} />
);

// ===== SCREEN 11 — REORDER WARM-UP (3 bo'lim) =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const correct = ['hero', 'muammo', 'harakat'];
  const items = correct.map(k => ({ id: k, label: SECDATA[k].label }));
  const [liveArr, setLiveArr] = useState(() => correct.map(() => null));
  const [dragDone, setDragDone] = useState(!!storedAnswer);
  const done = dragDone;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, arr: correct }); }, [done]); // eslint-disable-line
  return (
    <Stage eyebrow="Tartiblash" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? 'Davom etish' : 'Bo\'limlarni tartiblang'} onClick={onNext} /></>}>
      {/* Mentor gapi bilan ish maydoni orasi biroz kengaytirildi — ular ustma-ust tiqilib
          qolmasin; lekin ekran pastga cho'zilib ketmasligi uchun o'sish jilovlangan. */}
      <div className="screen" style={{ gap: 'clamp(14px,2vw,22px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Siz tuzgan sahifadan foydalanuvchi <span className="italic" style={{ color: T.accent }}>oxirigacha</span> o'ta oladimi?</h2></div>
        <Mentor>Uchta bo'lakni to'g'ri tartibga joylang, so'ng <b style={{ color: T.ink }}>«Sahifani sinab ko'rish»</b> tugmasini bosing — foydalanuvchi sahifangizni tepadan pastgacha o'qib chiqadi.</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">Bo'limlar — to'g'ri tartibga joylang</p>
            <DragDropOrder items={items} onSolved={() => setDragDone(true)} onOrder={setLiveArr} />
          </Col>
          <Col>
            <CustomerRun order={liveArr} correct={correct} />
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TEST 4 =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow="Mashq · 4-savol"
    questionText="Sahifa bo'limlarining eng mantiqiy tartibi qaysi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-sub" style={{ marginTop: 8 }}>Eng <span className="italic" style={{ color: T.accent }}>mantiqiy</span> tartib qaysi?</h2></>}
    options={['Tugma, isbot, birinchi blok, muammo, yechim', 'Isbot, tugma, muammo, birinchi blok, yechim', 'Muammo, tugma, birinchi blok, yechim, isbot', 'Birinchi blok, muammo, yechim, isbot, tugma']} correctIdx={3}
    explainCorrect="To'g'ri! Birinchi blok — nima taklif qilinmoqda, muammo — nega kerak, yechim — qanday ishlaydi, isbot — nega ishonsa bo'ladi, tugma — endi nima qilish kerak."
    explainWrong={{ 0: 'Tugma boshida — erta. Avval birinchi blok, keyin ishontirish kerak.', 1: 'Bo\'limlar o\'rni almashib ketgan. To\'g\'risi: birinchi blok, muammo, yechim, isbot, tugma.', 2: 'Birinchi blok eng boshida bo\'lishi kerak, tugma esa oxirida.', default: 'Birinchi blok, muammo, yechim, isbot, tugma.' }} />
);

// ===== SCREEN 13 — NAMUNA (tayyor tartib + izohlar) =====

// ===== SCREEN 14 — QOIDA (global savol) =====
const Screen14 = ({ screen, onNext, onPrev }) => {
  return (
    <Stage eyebrow="Qoida" screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label="Yakuniy ishga →" onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">Nega ba'zi saytlar <span className="italic" style={{ color: T.accent }}>bir qarashda</span> ishonch uyg'otadi?</h2></div>
        <Mentor>Ishonch chiroydan emas, <b style={{ color: T.ink }}>tartibdan</b> tug'iladi: to'g'ri tuzilgan sahifa foydalanuvchini muammodan yechimga, so'ng harakatga yetaklaydi. Shuning uchun tartib — <b style={{ color: T.ink }}>foydalanuvchi uchun qilingan qulaylik</b>.</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="frame fade-up" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 'clamp(18px,2.6vw,26px)' }}>
              <IcoChip size={54} color={SEC_AMBER} soft={SEC_AMBER + '1c'}>{sIco.star(28)}</IcoChip>
              <div><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, margin: 0, color: T.ink, fontSize: 'clamp(18px,2.4vw,22px)' }}>Tartib — foydalanuvchi uchun qilingan qulaylik</p><p className="body" style={{ margin: '3px 0 0', color: T.ink2 }}>Har bo'lim o'z o'rnida turibdi — shunda foydalanuvchi adashmay yechimga yetadi.</p></div>
            </div>
          </Col>
          <Col>
            <p className="flow-label">Ishlaydigan tartib</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ORDER.map((k, i) => { const s = SECDATA[k]; return (<React.Fragment key={k}><div className="rl-step" style={{ display: 'flex', alignItems: 'center', gap: 11, background: T.paper, borderRadius: 11, padding: '10px 13px', boxShadow: `0 5px 14px -8px rgba(${T.shadowBase},0.16)`, animationDelay: `${i * 0.9}s` }}><span style={{ color: s.color, display: 'inline-flex' }}>{s.ic}</span><span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, color: T.ink, fontSize: 13.5 }}>{s.label}</span></div>{i < ORDER.length - 1 && <span className="rl-arrow" style={{ color: T.ink3, textAlign: 'center', fontSize: 11, animationDelay: `${i * 0.9 + 0.45}s` }}>↓</span>}</React.Fragment>); })}
            </div>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ============================================================
// SCREEN 15 — KODING: sahifa TUZILISHINI haqiqiy HTML'da qurish
// Ikki qavat (chalkashmasin!): header/main/footer — sahifaning QAVATLARI;
// hero/muammo/yechim/isbot/harakat — MAZMUN bo'limlari, ular <main> ICHIDA yashaydi.
// Teglar faqat o'tilganidan: header · main · footer · h2 · p (section YO'Q — o'rgatilmagan).
// ============================================================

// Bo'lim sarlavhalari — darsdagi ORDER bilan BIR XIL ketma-ketlik (hero = sayt tepasi, header'da).
const KOD_WORDS = { muammo: 'muammo', yechim: 'qanday ishlaydi', isbot: 'isbot', harakat: 'harakat' };
const KOD_TITLES = { muammo: 'Muammo', yechim: 'Qanday ishlaydi', isbot: 'Isbot', harakat: 'Harakat' };
const KOD_SECS = ORDER.filter(k => KOD_WORDS[k]).map(k => ({ key: k, title: KOD_TITLES[k], word: KOD_WORDS[k] }));

// ===== HTML SINTAKSIS-LINTERI (manba: src/compilator/HtmlCompiler.jsx — qator raqami bilan xato) =====
const KOD_VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
// Yopish tegi IXTIYORIY bo'lgan elementlar — brauzer o'zi yopadi, «yopilmagan» deb qizarmasin
const KOD_OPTIONAL = new Set(['li', 'p', 'td', 'th', 'tr', 'dt', 'dd', 'option', 'thead', 'tbody', 'tfoot']);
const KOD_BLOCK = new Set(['address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'main', 'menu', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul']);
function kodClosesOnOpen(open, top) {
  if (top === 'li') return open === 'li';
  if (top === 'p') return open === 'p' || KOD_BLOCK.has(open);
  if (top === 'option') return open === 'option';
  if (top === 'td' || top === 'th') return open === 'td' || open === 'th' || open === 'tr';
  if (top === 'tr') return open === 'tr';
  if (top === 'dt' || top === 'dd') return open === 'dt' || open === 'dd';
  if (top === 'thead' || top === 'tbody' || top === 'tfoot') return open === 'tbody' || open === 'tfoot' || open === 'thead';
  return false;
}
function lintHtml(src) {
  const errors = [];
  if (!src) return errors;
  const stack = [];
  const n = src.length;
  let i = 0, line = 1, col = 1;
  const here = () => ({ line, col });
  const step = () => { if (src[i] === '\n') { line++; col = 1; } else { col++; } i++; };
  const skipTo = (idx) => { while (i < idx && i < n) step(); };
  while (i < n) {
    if (src[i] !== '<') { step(); continue; }
    const next = src[i + 1];
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      if (end === -1) { errors.push({ ...here(), msg: "Izoh yopilmagan — oxiriga --> qo'ying" }); break; }
      skipTo(end + 3); continue;
    }
    if (next === '!') {
      const end = src.indexOf('>', i);
      if (end === -1) { errors.push({ ...here(), msg: "<! ... > yopilmagan" }); break; }
      skipTo(end + 1); continue;
    }
    if (next === '/') {
      const start = here();
      let j = i + 2, name = '';
      while (j < n && /[a-zA-Z0-9-]/.test(src[j])) { name += src[j]; j++; }
      while (j < n && src[j] !== '>') j++;
      if (j >= n) { errors.push({ line: start.line, msg: `</${name}> to'liq emas — oxiriga > qo'ying` }); break; }
      const lname = name.toLowerCase();
      while (stack.length && KOD_OPTIONAL.has(stack[stack.length - 1].name) && stack[stack.length - 1].name !== lname && stack.some((s, idx) => s.name === lname && idx < stack.length - 1)) stack.pop();
      if (stack.length === 0) {
        errors.push({ line: start.line, msg: `Ortiqcha yopuvchi teg </${name}> — unga mos ochuvchi teg yo'q` });
      } else {
        const top = stack[stack.length - 1];
        if (top.name === lname) { stack.pop(); }
        else {
          const idx = stack.map(s => s.name).lastIndexOf(lname);
          if (idx === -1) errors.push({ line: start.line, msg: `</${name}> ga mos ochuvchi teg yo'q — nom xato yozilgan bo'lishi mumkin` });
          else { errors.push({ line: top.line, msg: `<${top.name}> yopilmagan — </${top.name}> kutilgan edi, </${name}> keldi` }); stack.length = idx; }
        }
      }
      skipTo(j + 1); continue;
    }
    if (/[a-zA-Z]/.test(next || '')) {
      const start = here();
      let j = i + 1, name = '';
      while (j < n && /[a-zA-Z0-9-]/.test(src[j])) { name += src[j]; j++; }
      let selfClose = false, closed = false, quote = null, strayLt = false;
      while (j < n) {
        const c = src[j];
        if (quote) { if (c === quote) quote = null; j++; continue; }
        if (c === '"' || c === "'") { quote = c; j++; continue; }
        if (c === '<') { strayLt = true; break; }
        if (c === '/' && src[j + 1] === '>') { selfClose = true; closed = true; j += 2; break; }
        if (c === '>') { closed = true; j++; break; }
        j++;
      }
      if (quote && j >= n) { errors.push({ line: start.line, msg: `<${name}> ichida tirnoq (${quote}) yopilmagan` }); break; }
      if (strayLt) { errors.push({ line: start.line, msg: `<${name} tegi > bilan yopilmagan` }); skipTo(j); continue; }
      if (!closed && j >= n) { errors.push({ line: start.line, msg: `<${name} tegi > bilan yopilmagan` }); break; }
      const lname = name.toLowerCase();
      while (stack.length && kodClosesOnOpen(lname, stack[stack.length - 1].name)) stack.pop();
      if (!selfClose && !KOD_VOID.has(lname)) stack.push({ name: lname, line: start.line });
      skipTo(j); continue;
    }
    step();
  }
  for (const t of stack) {
    if (KOD_OPTIONAL.has(t.name)) continue;
    errors.push({ line: t.line, msg: `<${t.name}> ochiq qoldi — </${t.name}> bilan yoping` });
  }
  return errors;
}

// ===== TUZILMA-TEKSHIRUVI — DOMParser ctx ($ / $$) ustida, 4 shart =====
// Har shart uchun maslahat HARAKATGA CHORLAYDI (nima yozish kerakligini aytadi), ayblamaydi (66-qonun).
const KOD_CONDS = [
  { id: 'c1', label: 'Uchala teg bor: header · main · footer' },
  { id: 'c2', label: "main ichida 4 bo'lim: h2 + p" },
  { id: 'c3', label: 'Qavatlar tartibi: tepa, asosiy, past' },
  { id: 'c4', label: "Bo'limlar tartibi — hikoya bo'yicha" },
];
function checkStructure(html) {
  const res = { c1: false, c2: false, c3: false, c4: false, hints: {} };
  if (typeof DOMParser === 'undefined') return res;
  const parsed = new DOMParser().parseFromString(html || '', 'text/html');
  const body = parsed.body;
  const $ = (s) => { try { return body.querySelector(s); } catch { return null; } };
  const $$ = (s) => { try { return [...body.querySelectorAll(s)]; } catch { return []; } };
  const txt = (el) => ((el && el.textContent) || '').replace(/\s+/g, ' ').trim();
  const header = $('header'), main = $('main'), footer = $('footer');

  // ① Uchala qavat bor va ichi bo'sh emas
  const miss = [];
  if (!header) miss.push('<header>');
  if (!main) miss.push('<main>');
  if (!footer) miss.push('<footer>');
  if (miss.length) {
    res.hints.c1 = `Yetishmayapti: ${miss.join(', ')}. Sahifa uchta tegdan iborat: <header>, <main>, <footer>.`;
  } else {
    const empty = [];
    if (!txt(header)) empty.push('<header>');
    if (!txt(footer)) empty.push('<footer>');
    if (empty.length) res.hints.c1 = `${empty.join(' va ')} ichi bo'sh — tepaga sayt nomini, pastga havola yoki aloqa ma'lumotini yozing.`;
    else res.c1 = true;
  }

  // ② <main> ichida 4 bo'lim: har biri h2 sarlavha + p izoh
  const h2s = $$('main h2').filter(el => txt(el));
  const ps = $$('main p').filter(el => txt(el));
  if (!main) res.hints.c2 = "Avval <main> tegini yozing — bo'limlar shuning ichida yashaydi.";
  else if (h2s.length < 4) res.hints.c2 = `<main> ichida ${h2s.length} ta to'ldirilgan sarlavha bor — 4 ta kerak. Yetmagani uchun <h2>Bo'lim nomi</h2> yozing.`;
  else if (ps.length < 4) res.hints.c2 = `Har sarlavha ostiga bir gap izoh kerak: <p>...</p>. Hozir <main> ichida ${ps.length} ta to'ldirilgan izoh bor.`;
  else res.c2 = true;

  // ③ Qavatlar HUJJAT-TARTIBI: header → main → footer (compareDocumentPosition)
  //    Xato bo'lsa AYNAN qaysi ikkitasi o'rin almashgani aytiladi.
  if (!header || !main || !footer) {
    res.hints.c3 = "Uchala teg yozilgach tartib tekshiriladi — avval <header>, <main>, <footer> ni qo'shing.";
  } else if ($('main header') || $('main footer') || $('header main') || $('footer main')) {
    res.hints.c3 = "<header> va <footer> ni <main> dan tashqariga chiqaring — uchtasi yonma-yon turadi, biri ikkinchisining ichida emas.";
  } else {
    const isAfter = (a, b) => !!(a.compareDocumentPosition(b) & 4); // b — a dan KEYIN
    if (!isAfter(header, main)) res.hints.c3 = "<main> hozir <header> dan oldin turibdi — sayt nomi eng tepada bo'lsin: avval <header>, keyin <main> yozing.";
    else if (!isAfter(main, footer)) res.hints.c3 = "<footer> hozir <main> dan oldin turibdi — u eng pastda bo'lsin: <main> dan keyin <footer> yozing.";
    else res.c3 = true;
  }

  // ④ <main> ichidagi bo'limlar KETMA-KETLIGI — qaysi bo'lim qayerga ketishi aytiladi
  const titles = h2s.map(el => txt(el).toLowerCase());
  const at = KOD_SECS.map(s => titles.findIndex(t => t.includes(s.word)));
  const missIdx = at.findIndex(x => x === -1);
  if (!main || !h2s.length) {
    res.hints.c4 = "Avval <main> ichiga bo'lim sarlavhalarini yozing.";
  } else if (missIdx !== -1) {
    res.hints.c4 = `«${KOD_SECS[missIdx].title}» sarlavhasi topilmadi — <main> ichiga <h2>${KOD_SECS[missIdx].title}</h2> qo'shing.`;
  } else {
    let bad = -1;
    for (let i = 1; i < at.length; i++) if (at[i] < at[i - 1]) { bad = i; break; }
    if (bad !== -1) res.hints.c4 = `«${KOD_SECS[bad].title}» hozir ${at[bad] + 1}-o'rinda turibdi — u «${KOD_SECS[bad - 1].title}» dan KEYIN kelishi kerak. Shu ikki bo'limni o'rin almashtiring.`;
    else res.c4 = true;
  }
  return res;
}

// Jonli natija — o'quvchi kodi haqiqiy sahifa bo'lib ko'rinadi (skript YO'Q: sandbox bo'sh).
const KOD_PREVIEW_CSS = `
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#FBFAFE;color:#1B1630;line-height:1.55}
  header{background:#1B1630;color:#fff;padding:16px 20px}
  header h2{margin:0 0 4px;font-size:18px;font-family:Georgia,serif}
  header p{margin:0;font-size:13px;color:#CFC7F0}
  main{padding:18px 20px;display:flex;flex-direction:column;gap:16px}
  main h2{margin:0 0 4px;font-size:16px;font-family:Georgia,serif;color:#5B3DE6}
  main p{margin:0;font-size:14px;color:#565073;overflow-wrap:anywhere}
  footer{background:#EBE5FD;color:#565073;padding:14px 20px;font-size:13px}
  footer p{margin:0;overflow-wrap:anywhere}
  h2,p{overflow-wrap:anywhere;min-width:0}
`;
const kodWrapDoc = (code) => `<!doctype html><html lang="uz"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><style>${KOD_PREVIEW_CSS}</style></head>
<body>${code}</body></html>`;

// Placeholder-namuna: muharrir BO'SH boshlanadi, xira namuna ko'rinib turadi.
// Nusxa-ko'chirishga qarshi: faqat SKELET ko'rinadi — bo'limlar nomi/tartibi berilmaydi.
const KOD_PLACEHOLDER = `<!-- Bu xira NAMUNA. Yozishni boshlasangiz o'chadi — o'zingiz yozing. -->
<header>
  <h2>OLX</h2>
  <p>Ortiqcha buyumingizni soting</p>
</header>

<main>
  <h2>... bo'lim nomi ...</h2>
  <p>... bir gap izoh ...</p>
  <!-- jami 4 bo'lim — tartibini o'zingiz tanlaysiz -->
</main>

<footer>
  <p>Aloqa: salom@olx.uz</p>
</footer>`;

// Reload-himoya: o'quvchi yozgan kod F5 da yo'qolmasin — lesson-scoped kalit
const KODING_KEY = 'pm-m1d6-koding';
const readKoding = () => { try { const v = JSON.parse(localStorage.getItem(KODING_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };

// ===== TO'LIQ-EKRAN KOMPILYATOR — tepada topshiriq + jonli shart-chiplar,
// chapda muharrir (Tab = 2 probel, ▶), o'ngda jonli brauzer-natija, pastda navigatsiya.
function StrukturaCompiler({ initialCode, onContinue, onBack }) {
  const [code, setCode] = useState(initialCode || '');
  const [src, setSrc] = useState(initialCode || ''); // debounce'dan keyingi tekshiriladigan matn
  // Yozgan sari O'ZI tekshiriladi (400ms) + kod jonli saqlanadi (F5 da yo'qolmasin)
  useEffect(() => {
    const t = setTimeout(() => {
      setSrc(code);
      try { const prev = readKoding(); localStorage.setItem(KODING_KEY, JSON.stringify({ code, done: !!(prev && prev.done) })); } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [code]);
  const res = useMemo(() => checkStructure(src), [src]);
  const errs = useMemo(() => lintHtml(src), [src]);
  const doc = useMemo(() => kodWrapDoc(src), [src]);
  const okN = KOD_CONDS.filter(c => res[c.id]).length;
  const passed = okN === KOD_CONDS.length && errs.length === 0;
  const firstHint = KOD_CONDS.map(c => (res[c.id] ? null : res.hints[c.id])).find(Boolean);
  const runNow = () => setSrc(code);
  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target, s = el.selectionStart, en = el.selectionEnd;
      setCode(code.slice(0, s) + '  ' + code.slice(en));
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    }
  };
  return (
    <div className="shc-root">
      <div className="shc-wrap">
        <header className="shc-top">
          <span className="shc-eyebrow">Koding · yakuniy ish</span>
          <h1 className="shc-title">«OLX» sahifasining tuzilishini yozing</h1>
          <p className="shc-brief">Uchta teg: <span className="mono">header</span> (sayt nomi) · <span className="mono">main</span> (asosiy qism) · <span className="mono">footer</span> (havolalar va aloqa). <span className="mono">main</span> ichida 4 bo'lim — har biri <span className="mono">h2</span> sarlavha + <span className="mono">p</span> izoh. Bo'limlar: <b>Isbot</b> · <b>Harakat</b> · <b>Muammo</b> · <b>Qanday ishlaydi</b> — <b>to'g'ri tartibda</b> joylang.</p>
          <div className="shc-chips">
            <span className="shc-count">{okN}/{KOD_CONDS.length}</span>
            {KOD_CONDS.map((c, i) => (
              <span key={c.id} className={`shc-chip ${res[c.id] ? 'ok' : ''}`}>
                <span className="shc-dot">{res[c.id] ? '✓' : i + 1}</span>{c.label}
              </span>
            ))}
          </div>
          {errs.length > 0
            ? <p className="shc-err">⚠ {errs[0].line}-qator: {errs[0].msg}{errs.length > 1 ? ` (yana ${errs.length - 1} ta sintaksis xatosi)` : ''}</p>
            : (!passed && firstHint && <p className="shc-hint">💡 {firstHint}</p>)}
        </header>
        <main className="shc-split">
          <section className="shc-pane">
            <div className="shc-bar dark">
              <span className="bb-dots"><i /><i /><i /></span>
              <span className="shc-tab">index.html</span>
              <button className="shc-mini" onClick={runNow}>▶ Ishga tushirish</button>
            </div>
            <textarea className="shc-code" value={code} spellCheck={false} autoCapitalize="off" autoCorrect="off" onChange={e => setCode(e.target.value)} onKeyDown={onKeyDown} placeholder={KOD_PLACEHOLDER} />
          </section>
          <section className="shc-pane">
            <div className="shc-bar">
              <span className="bb-dots"><i /><i /><i /></span>
              <span className="shc-url"><span className="lock">●</span>olx.uz</span>
              <span className="shc-live">jonli</span>
            </div>
            <iframe className="shc-frame" title="Jonli natija" sandbox="" srcDoc={doc} />
          </section>
        </main>
        <footer className="shc-bottom">
          <button className="shc-ghost" onClick={onBack}>← Darsga qaytish</button>
          <button className="shc-ghost" onClick={() => setCode('')}>Qaytadan</button>
          <div className="shc-status">
            {passed
              ? <span className="shc-ok-msg">✓ Sahifa tuzilishi to'g'ri yig'ildi!</span>
              : <span className="shc-wait-msg">Shartlarni bajaring — natija o'ngda jonli ko'rinadi</span>}
          </div>
          <button className="shc-next" disabled={!passed} onClick={() => passed && onContinue({ code })}>Davom etish →</button>
        </footer>
      </div>
    </div>
  );
}

const ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  // Erkin (mustaqil) rejim — jonli sessiya yo'q. Takrorlash-yo'li faqat shu yerda ko'rinadi.
  const isSelf = !live || live.mode === 'self';
  const workRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [st, setSt] = useState(() => {
    const saved = readKoding();
    return { code: storedAnswer?.code || (saved && saved.code) || '', done: !!(storedAnswer && storedAnswer.solved) || !!(saved && saved.done) };
  });
  const { code, done } = st;
  // Navbat (88-qonun): kompilyator ochilmagan bo'lsa tugma o'zi chorlaydi. Kompilyator
  // ochilgan paytda tugma ko'rinmaydi, shuning uchun puls ham to'xtaydi.
  const openHint = useTurnHint(!done && !open);
  // Reload'dan keyin signal qayta ketsin — mentor panelida «bajarmagan» bo'lib qolmasin
  useEffect(() => {
    if (done && storedAnswer === undefined) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  }, []); // eslint-disable-line
  const finishPractice = ({ code: newCode }) => {
    setOpen(false);
    setSt({ code: newCode, done: true });
    try { localStorage.setItem(KODING_KEY, JSON.stringify({ code: newCode, done: true })); } catch {}
    if (!done) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code: newCode, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  return (
    <Stage eyebrow="Yakuniy ish · 🛠 kompilyator" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? 'Davom etish' : 'Avval kompilyatorda yozing'} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Sahifa tuzilishini quradigan <span className="italic" style={{ color: T.accent }}>kod</span> yozamiz</h2></div>
        <Mentor>Tartibni o'rgandingiz — endi uni haqiqiy kodda qurasiz. Pastdagi <b style={{ color: T.ink }}>«Kompilyatorni ochish»</b> tugmasini bosing: nima yozishni o'sha yerda ko'rsatamiz.</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        <div className="stq fade-up delay-1" ref={workRef}>
          <div className="stq-code">
            <span className="stq-code-bar"><span className="bb-dots"><i /><i /><i /></span>index.html</span>
            <code className="stq-code-body">
              <span className="stq-l t">&lt;header&gt;</span>
              <span className="stq-l dim">   sayt nomi</span>
              <span className="stq-l t">&lt;/header&gt;</span>
              <span className="stq-l m">&lt;main&gt;</span>
              <span className="stq-l dim">   &lt;h2&gt; + &lt;p&gt; × 4</span>
              <span className="stq-l m">&lt;/main&gt;</span>
              <span className="stq-l f">&lt;footer&gt;</span>
              <span className="stq-l dim">   havolalar, aloqa</span>
              <span className="stq-l f">&lt;/footer&gt;</span>
            </code>
          </div>
          <span className="stq-arrow" aria-hidden="true">➜</span>
          <div className="stq-page">
            <div className="stq-pbar"><span className="bb-dots"><i /><i /><i /></span><span className="stq-purl"><span className="lock">●</span>olx.uz</span></div>
            <div className="stq-top">&lt;header&gt;</div>
            <div className="stq-mid">
              <span className="stq-tag">&lt;main&gt;</span>
              {[0, 1, 2, 3].map(i => <span key={i} className="stq-row" style={{ animationDelay: `${0.5 + i * 0.16}s` }}><i /><em /></span>)}
            </div>
            <div className="stq-foot">&lt;footer&gt;</div>
          </div>
        </div>
        <div className="stq-cta fade-up delay-2">
          <button className={`kod-launch-btn${openHint ? ' turn-ring' : ''}`} onClick={() => setOpen(true)}>{done ? '↻ Kompilyatorni qayta ochish' : '🛠 Kompilyatorni ochish'}</button>
          {done && <span className="stq-cta-sub">Bajarildi — xohlasangiz kodni yana sayqallang</span>}
          {/* 🔓 TAKRORLASH-YO'LI — FAQAT erkin rejimda va FAQAT bajarilmagan holatda.
              Nima uchun: praktika bajarilganda brauzer xotirasiga yoziladi va qaytib kelganda
              darvoza o'zi ochiq bo'ladi. Lekin bola sinfda BOSHQA qurilmada bajargan bo'lsa,
              buni dastur BILA OLMAYDI (login yo'q, PIN esa dars tugagach yopiladi). O'sha
              yagona holat uchun — o'zidan so'raymiz.
              🔴 Bu havola FAQAT eshikni ochadi: nishon bermaydi, «bajarildi» deb yozmaydi,
              serverga signal yubormaydi, xotiraga saqlanmaydi. Jonli darsda ko'rinmaydi. */}
          {!done && isSelf && (
            <button className="stq-skip" onClick={onNext}>✓ Bu mashqni sinfda bajarganman — davom etish →</button>
          )}
        </div>
        {done && <div className="done-mini fade-step" style={{ alignSelf: 'center' }}>✅ Ishladi! <span className="dm-sub">— sahifangiz to'g'ri tuzilishda yig'ildi</span></div>}
        {isMentor && <details className="stq-mnote-d"><summary>👨‍🏫 Eslatma — faqat sizga</summary><p>Topshiriqni o'quvchilar bajaradi, siz kuzatasiz. «Davom etish» siz uchun ochiq.</p></details>}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label="🛠 Tuzilishni yozib bo'lganlar" />
      </div>
      {open && <StrukturaCompiler initialCode={code} onContinue={finishPractice} onBack={() => setOpen(false)} />}
    </Stage>
  );
};

// 💻 Uyga-vazifa kapsulasi fonida suzuvchi xira so'z-tokenlar — dars DNK'si (CodeStrike cs-sky oilasi)
const HW_TOKENS = [
  { t: 'hero',      l: 5,  tp: 16, s: 12, d: 6.5 },
  { t: 'muammo',    l: 80, tp: 12, s: 11, d: 7.5 },
  { t: 'yechim',    l: 12, tp: 70, s: 11, d: 8 },
  { t: 'isbot',     l: 68, tp: 76, s: 12, d: 6 },
  { t: '<section>', l: 86, tp: 52, s: 10, d: 9 },
  { t: 'tartib',    l: 36, tp: 8,  s: 10, d: 7 },
  { t: '</>',       l: 3,  tp: 44, s: 13, d: 8.5 },
];

// ===== SCREEN 16 — YAKUN =====
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
  const RECAP = ['Sahifa bo\'limlari — odam uchun qulaylik', 'Sahifaning eng tepasida birinchi blok (hero) turadi', 'Tartib: birinchi blok → muammo → yechim → isbot → tugma', 'Sahifani kodda to\'g\'ri bo\'limlar bilan qura olasiz'];
  // 💻 Amaliy topshiriq tugmasi — LMS kompilyatoriga olib kiradi (ulanish keyin kelishiladi; hozircha dizayn-qatlam)
  const [hwNote, setHwNote] = useState(false);
  // Zaryad-effekt (CodeStrike fire() naqshi): bosilganda kapsula yorishadi, so'ng harakat davom etadi
  const [hwCharge, setHwCharge] = useState(false);
  const fireHw = () => {
    if (hwCharge) return;
    setHwCharge(true);
    setTimeout(() => { setHwNote(true); setHwCharge(false); }, 500);
  };
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow="Tayyor" screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Qaytadan</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Yakunlash</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">{Ico.check(11)}</span> Dars tugadi</span><h2 className="title h-title fade-up d1">Endi siz <span className="italic" style={{ color: T.accent }}>sahifani</span> qura olasiz.</h2>{/* 54-qonun (UserStory qarori bilan bir xil): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div>{!isMentorL && <ScoreRing correct={correct} total={total} />}</div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark
            stats={false}
            disabled={studentWait}
            liveOn={studentLive}
            onClick={studentWait ? undefined : openArena}
            hint={studentWait ? '⏳ Mentorni kuting' : undefined}
          />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span style={{ color: T.success, display: 'inline-flex' }}>{Ico.check(15)}</span> Endi siz bilasiz</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck" style={{ display: 'inline-flex' }}>{Ico.check(15)}</span><span>{r}</span></li>))}</ul></div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${hwCharge ? 'charging' : ''}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, '--d': `${k.d}s` }}>{k.t}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">Uyga vazifa</span>
            <span className="hw-big-s">Amaliy topshiriqni boshlash →</span>
          </button>
        </div>
        {hwNote && <p className="hw-cta-note fade-step" style={{ textAlign: 'center' }}>Topshiriq LMS kompilyatorida ochiladi — o'z sahifangizni bugun o'rgangan tartibda bajarasiz.</p>}
        {/* Nishon-ro'yxati — SHAXSIY hisob, mentor proyektorida ko'rsatilmaydi (yuqoridagi
            AchCounter izohi: sahna ↔ daftar tamoyili). O'quvchida esa o'z joyida qoladi. */}
        {!isMentorL && <div className="card ach-coll fade-up d4">
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
        </div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN — FLASHCARDS (9.3) — dars yakunidan oldin aktiv takrorlash =====
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow="Takrorlash" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label="Yakunlashga →" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Bo'limlarni <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</h2></div>
        <div className="fc-center"><Flashcards cards={PM_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT
// Podium yorliqlari (scored indeks -> qisqa nom)
const Q_LABELS = { 4: "Birinchi nima ko'rinadi", 6: "Tugma qayerda turadi", 9: "Tartib nega muhim", 11: "Mantiqiy tartib" };

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

// Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi) — FAQAT scored testlar.
// Koding-ekran ballanmaydi: uning signali PRACTICE_BASE + screen zonasidan ketadi (praktika, test emas).
const INLINE_KEYS = { s4: 0, s5b: 2, s9: 1, s12: 3 };

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
      if (on) t = setTimeout(tick, 3000); // kech qo'shilganlar ham jonli ko'rinadi
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isLive, livePin]);

  const totalQ = SCORED_IDX.length;
  const board = players.map(p => {
    // FAQAT baholanadigan testlar hisoblanadi — s6 amaliyotning «tugatdi» belgisi (idx 7)
    // reytingga aralashmasin (u faqat MentorWorkStats uchun yoziladi)
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
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>Natijalar yuklanmoqda…</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>Bu darsga hali hech kim qo'shilmagan.</p></div>
        ) : (
          <>
            <Confetti />
            {/* Podium — 2-1-3 tartibida (o'rtada g'olib, balandroq) */}
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
            {/* 📊 «Savollar bo'yicha» kartasi ATAYLAB YO'Q (etalon qarori — 90-qonun):
                proyektorda butun sinf oldida «0/4» ko'rsatish ochiq mag'lubiyat-tablosi bo'ladi.
                Mentor bu ma'lumotni dars PAYTIDA MentorTestStats orqali oladi — o'z joyida. */}
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== ⚡ CODESTRIKE — MUSTAHKAMLASH ARENASI =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi struktura tokenlari (sayt tuzilishi mavzusidan — dekoratsiya ham o'qitadi)
const QZ_BG_SHAPES = [
  { ch: '<section>', l: 5,  t: 16, s: 34, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: 'hero',      l: 84, t: 12, s: 32, c: 'rgba(110,75,255,0.15)',  d: 23, dl: 1.5 },
  { ch: '<h1>',      l: 9,  t: 74, s: 30, c: 'rgba(110,75,255,0.15)',  d: 27, dl: 0.8 },
  { ch: 'CTA',       l: 78, t: 70, s: 30, c: 'rgba(120,235,175,0.13)', d: 21, dl: 2.2 },
  { ch: '</>',       l: 46, t: 86, s: 30, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: '<nav>',     l: 66, t: 24, s: 24, c: 'rgba(80,200,255,0.14)',  d: 17, dl: 0.4 },
  { ch: 'footer',    l: 24, t: 34, s: 22, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: '<a>',       l: 90, t: 46, s: 24, c: 'rgba(120,235,175,0.13)', d: 24, dl: 1.3 },
  { ch: '{ }',       l: 2,  t: 46, s: 24, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: "Sayt strukturasi (bo'limlar tartibi) aslida nima?", opts: ["Foydalanuvchi uchun qilingan qulaylik", "Sahifani chiroyli ko'rsatuvchi bezak", "Dizayner o'z didiga qarab tanlagan shakl", "Hamma sayt uchun bir xil tayyor andoza"], correct: 0 },
  { q: "Foydalanuvchi saytni ochganda birinchi nimani ko'radi?", opts: ["Sahifa oxiridagi havolalar qismini", "Birinchi blokni — sarlavha va izohni", "Yon tarafdagi reklama bannerini", "Menyu va qidiruv qatorini"], correct: 1 },
  { q: "Harakat tugmasi (CTA) qayerda turishi mantiqiy?", opts: ["Eng tepada, hammadan oldin", "Menyuda, havolalar orasida", "Foydalanuvchi ishongandan keyin", "Yon tomonda, matndan ajratib"], correct: 2 },
  { q: "Bo'limlarning eng mantiqiy tartibi qaysi?", opts: ["Tugma, isbot, birinchi blok, muammo, yechim", "Isbot, tugma, muammo, yechim, birinchi blok", "Muammo, tugma, birinchi blok, yechim, isbot", "Birinchi blok, muammo, yechim, isbot, tugma"], correct: 3 },
  { q: "Birinchi blok (hero) qanday vazifani bajaradi?", opts: ["Foydalanuvchidan ariza va to'lov qabul qiladi", "Bir jumlada sayt nima taklif qilishini aytadi", "Boshqa foydalanuvchilarning izohini ko'rsatadi", "Sahifa oxirida havola va aloqa ma'lumotini beradi"], correct: 1 },
  { q: "«Isbot» bo'limi nima uchun kerak?", opts: ["Foydalanuvchida ishonch uyg'otish uchun", "Mahsulot narxini e'lon qilish uchun", "Sayt nomini eslatib turish uchun", "Aloqa ma'lumotini berish uchun"], correct: 0 },
  { q: "Yaxshi tuzilgan sahifa nimaga o'xshaydi?", opts: ["Alifbo bo'yicha tuzilgan lug'atga", "Mahsulotlar ro'yxati — katalogga", "Har xil xabarlar yig'ilgan lentaga", "Hikoyaga — qadam-baqadam yetaklaydi"], correct: 3 },
  { q: "Bo'limlar tartibi nega muhim?", opts: ["Sahifaga chiroyli ko'rinish berish uchun", "Sahifani uzunroq va to'liqroq qilish uchun", "Foydalanuvchini muammodan yechimga olib boradi", "Qidiruvda yuqoriroq chiqib turish uchun"], correct: 2 },
  { q: "Bo'limlar aralash tartibda bo'lsa nima bo'ladi?", opts: ["Foydalanuvchi adashadi va sahifadan ketadi", "Foydalanuvchi kerakli bo'limni o'zi topib oladi", "Sahifa yangicha va qiziqarli ko'rinadi", "Sahifa avvalgidan tezroq ochiladi"], correct: 0 },
  { q: "«Muammo» bo'limi qanday his uyg'otishi kerak?", opts: ["«Endi darrov sotib olaman»", "«Bu sayt ishonchli ekan»", "«Bu qanday ishlar ekan?»", "«Bu menga tanish»"], correct: 3 },
  { q: "Chiroyli va ishonchli sayt farqi ko'pincha nimada?", opts: ["Ishlatilgan ranglarida", "Tartibida (strukturasida)", "Shrift o'lchami va turida", "Qo'shilgan rasmlar sonida"], correct: 1 },
  { q: "Mahsulot taqdim qiluvchi sahifa qanday mantiqqa amal qiladi?", opts: ["Avval harakat tugmasi, keyin izoh", "Bo'limlar alifbo tartibida joylashadi", "Avval eng muhimi, oxirida harakat", "Avval aloqa, keyin mahsulot izohi"], correct: 2 },
];
const quizPts = (elapsedMs) => elapsedMs <= 500 ? 1000 : Math.max(0, Math.round(1000 * (1 - (Math.min(elapsedMs, QUIZ_MS) / QUIZ_MS) / 2)));
// Bitta o'yinchining barcha javoblaridan yakuniy hisob (hamma klientda bir xil chiqadi)
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

// Aylana taymer — vaqt kamaygani sari yashil → sariq → qizil
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

// ⚡ CodeStrike chaqmoq mascot (brend belgisi)
const QzBolt = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className="qz-bolt">
    <defs><linearGradient id="qzbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF8A3D" /><stop offset="1" stopColor="#FF4F28" /></linearGradient></defs>
    <rect x="6" y="6" width="88" height="88" rx="24" fill="url(#qzbg)" />
    <path d="M56 12 L28 54 L45 54 L38 88 L72 40 L53 40 Z" fill="#fff" stroke="#E23A16" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="76" cy="24" r="3.5" fill="#FFD9A8" /><circle cx="22" cy="72" r="2.6" fill="#FFD9A8" /><circle cx="80" cy="66" r="2.2" fill="#FFD9A8" />
  </svg>
);

// ⚡ Neon chaqmoq (kapsula yon belgilari) — uchqunlari hover'da sachraydi
const CsNeonBolt = ({ flip }) => (
  <span className={`csn-boltwrap ${flip ? 'flip' : ''}`} aria-hidden="true">
    <svg className="csn-bolt" viewBox="0 0 60 100">
      <defs><linearGradient id="csnb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#B08CFF" /></linearGradient></defs>
      <path d="M38 4 L10 52 L27 52 L20 96 L52 40 L33 40 Z" fill="url(#csnb)" stroke="rgba(255,255,255,.65)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
    <i className="cs-spark s1" /><i className="cs-spark s2" /><i className="cs-spark s3" />
  </span>
);

// ⚡ CODE STRIKE — neon-kapsula (CTA'da bosiladi, lobbyda brend-lavha).
// Ichida DARSNING O'Z QZ_BG_SHAPES tokenlari suzadi — har dars kapsulaga o'z «DNK»sini beradi.
// Holatlar: oddiy (yonib turadi) · cs-off (mentor kutilmoqda, xira) · cs-live (jonli ochiq, LIVE nuqta).
const CsWordmark = ({ onClick, disabled, hint, stats = true, bolt = true, liveOn = false }) => {
  const clickable = !!onClick && !disabled;
  const [charge, setCharge] = useState(false);
  const fire = () => {
    if (!clickable || charge) return;
    setCharge(true); // portal-zaryad: cho'qqisida arena ochiladi, flash arena ustida so'nadi
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
// 🎇 Arena fon effekti (8.2) — suzuvchi uchqun + "web" chiziqlari + mavzu-tokenlari.
// TOK massivi dars MAVZUSIDAN (landing bo'limlari / UX metrikalari). reduced-motion'da o'chadi (tug'ilishdan).
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['Hero', 'CTA', '↑', 'A/B', '%', '→', 'KPI', 'UX'];
    const em = [], toks = [];
    for (let i = 0; i < 26; i++) em.push({ x: Math.random() * W, y: Math.random() * H, z: .3 + Math.random() * .7, ph: Math.random() * 6.28, sw: .3 + Math.random() * .6 });
    for (let i = 0; i < 9; i++) toks.push({ x: Math.random() * W, y: Math.random() * H, z: .4 + Math.random() * .9, vx: (Math.random() - .5) * .16, t: TOK[i % TOK.length], r: (Math.random() - .5) * .5 });
    const draw = (tm) => {
      ctx.clearRect(0, 0, W, H);
      for (const p of em) { p.y -= (.15 + p.z * .35) * DPR; p.x += Math.sin(tm / 1400 + p.ph) * p.sw * DPR * .35; if (p.y < -12) { p.y = H + 12; p.x = Math.random() * W; } }
      ctx.lineWidth = 1 * DPR;
      for (let a = 0; a < em.length; a++) for (let b = a + 1; b < em.length; b++) { const dx = em[a].x - em[b].x, dy = em[a].y - em[b].y, d = Math.sqrt(dx * dx + dy * dy), mx = 95 * DPR; if (d < mx) { ctx.strokeStyle = 'rgba(91,61,230,' + (.055 * (1 - d / mx)) + ')'; ctx.beginPath(); ctx.moveTo(em[a].x, em[a].y); ctx.lineTo(em[b].x, em[b].y); ctx.stroke(); } }
      for (const p of em) { const s = (1.3 + p.z * 2.2) * DPR, tw = .16 + p.z * .24 + Math.sin(tm / 600 + p.ph) * .08; ctx.fillStyle = 'rgba(245,166,35,' + tw + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, 6.29); ctx.fill(); }
      for (const t of toks) { t.x += t.vx * DPR; t.y -= (.08 + t.z * .12) * DPR; if (t.y < -34) t.y = H + 34; if (t.x < -50) t.x = W + 50; if (t.x > W + 50) t.x = -50; ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.r * .12); ctx.font = '700 ' + ((13 + t.z * 22) * DPR) + 'px "JetBrains Mono",monospace'; ctx.fillStyle = 'rgba(20,17,14,' + (.03 + t.z * .05) + ')'; ctx.textAlign = 'center'; ctx.fillText(t.t, 0, 0); ctx.restore(); }
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
  // solo: self rejim YOKI mashq (dars tugagach o'quvchi uyda qayta ishlashi) —
  // taymer/savollar bir xil, lekin serverga yozilmaydi, faqat o'z natijasi ko'rinadi
  const [soloMode, setSoloMode] = useState(!!startSolo);
  const solo = soloMode || (!isMentor && !isStudent);
  const soloRef = useRef(solo);
  soloRef.current = solo;
  const [phase, setPhase] = useState('lobby'); // lobby | q | reveal | done
  const [qi, setQi] = useState(-1);
  const [remaining, setRemaining] = useState(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState({}); // {qi: {picked, correct, elapsed}}
  const [players, setPlayers] = useState([]);
  const [qRows, setQRows] = useState([]);
  const [answeredN, setAnsweredN] = useState(0);
  const [classEnded, setClassEnded] = useState(false); // jonli dars tugadi — qutqaruv banneri
  const seenQRef = useRef(-1);
  const qStartRef = useRef(0);
  const deadlineRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // O'quvchi sahifani yangilagan bo'lsa — o'z javoblarini serverdan tiklaymiz
  useEffect(() => {
    if (!isStudent || solo || !live.playerId) return;
    liveQuizAnswers(live.pin).then(rows => {
      const mine = {};
      rows.filter(r => r.player_id === live.playerId).forEach(r => { mine[r.screen_idx - QUIZ_BASE_IDX] = { picked: r.picked, correct: r.correct, elapsed: r.elapsed_ms }; });
      setMyAnswers(m => ({ ...mine, ...m }));
    }).catch(() => {});
  }, []); // eslint-disable-line

  // Jonli sinxron: 1.2s polling — savol/natija/yakun fazalari serverdan keladi.
  useEffect(() => {
    if (soloRef.current) return;
    let on = true, t = null;
    const tick = async () => {
      if (soloRef.current) return; // mashqqa o'tildi — server bilan ishlamaymiz
      try {
        const row = await liveGet(live.pin);
        if (!on) return;
        if (row) {
          const st = row.quiz_state || 'off', q = row.quiz_q ?? -1;
          if (st === 'q' && q !== seenQRef.current) {
            seenQRef.current = q; qStartRef.current = Date.now();
            deadlineRef.current = Date.now() + QUIZ_MS - (isMentor ? 0 : 700); // polling kechikish kompensatsiyasi
            setQi(q); setRemaining(deadlineRef.current - Date.now()); setPhase('q'); setAnsweredN(0);
          } else if (st === 'r') {
            if (q !== seenQRef.current) { seenQRef.current = q; setQi(q); } // kech kirgan ham natijani ko'radi
            setPhase(p => p === 'done' ? p : 'reveal');
          }
          else if (st === 'done') { setPhase('done'); }
        }
        // Fetch-fazani SERVER holatidan hisoblaymiz — reveal'ga o'tgan ZAHOTI natijalar yuklanadi
        const st1 = row ? (row.quiz_state || 'off') : null;
        const ph = st1 === 'r' ? 'reveal' : st1 === 'done' ? 'done' : st1 === 'lobby' ? 'lobby' : st1 === 'q' ? 'q' : phaseRef.current;
        if (on) setClassEnded(!row || row.status === 'ended');
        // phaseRef sharti — himoya: lokal reveal (taymer tugagan), server hali 'q' bo'lsa ham natijalar yuklanadi
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

  // Taymer — 100ms aniqlikda; vaqt tugasa javob ochiladi.
  // MENTOR: serverni ham 'r' ga o'tkazamiz — aks holda server 'q'ligicha qolib,
  // poll natijalarni yuklamaydi va hisoblagichlar/TOP-5 nolda qotib qolardi.
  useEffect(() => {
    if (phase !== 'q') return;
    const iv = setInterval(() => {
      const rem = deadlineRef.current - Date.now();
      setRemaining(rem > 0 ? rem : 0);
      if (rem <= 0) {
        clearInterval(iv);
        setPhase('reveal');
        if (isMentor && !soloRef.current) ctrl('r', seenQRef.current); // Kahoot: vaqt tugadi — natija hammaga ochiladi
      }
    }, 100);
    return () => clearInterval(iv);
  }, [phase, qi]); // eslint-disable-line

  // Mentor boshqaruvi (optimistik lokal o'tish + server)
  const ctrl = async (state, q) => {
    try {
      await live.quizControl(state, q);
      if (state === 'q') { seenQRef.current = q; qStartRef.current = Date.now(); deadlineRef.current = Date.now() + QUIZ_MS; setQi(q); setRemaining(QUIZ_MS); setPhase('q'); setAnsweredN(0); }
      else if (state === 'r' || state === 'done') {
        setPhase(state === 'r' ? 'reveal' : 'done');
        // Natijalarni DARHOL yuklaymiz — hisoblagichlar bo'sh turmaydi
        Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]).then(([pl, qa]) => { setPlayers(pl); setQRows(qa); }).catch(() => {});
      }
    } catch {}
  };
  // Solo boshqaruvi
  const soloStart = (i) => { seenQRef.current = i; qStartRef.current = Date.now(); deadlineRef.current = Date.now() + QUIZ_MS; setQi(i); setRemaining(QUIZ_MS); setPhase('q'); };
  const soloNext = () => { const n = qi + 1; if (n >= QUIZ_BANK.length) setPhase('done'); else soloStart(n); };
  const soloReplay = () => { setMyAnswers({}); soloStart(0); };
  // Jonli test tugagach «qayta ishlash» — mashq rejimiga o'tish (serverga yozilmaydi)
  const startPractice = () => { setSoloMode(true); setMyAnswers({}); soloStart(0); };

  const answer = (i) => {
    if (phase !== 'q' || isMentor || myAnswers[qi]) return;
    const elapsed = Math.min(QUIZ_MS, Date.now() - qStartRef.current);
    const correct = i === QUIZ_BANK[qi].correct;
    setMyAnswers(m => ({ ...m, [qi]: { picked: i, correct, elapsed } }));
    if (isStudent && !solo) live.submitAnswer(QUIZ_BASE_IDX + qi, `quiz-${qi}`, i, correct, elapsed);
    if (solo) setPhase('reveal'); // yolg'iz o'yinda javob darhol ochiladi
  };

  // Joriy streak (shu savolgacha ketma-ket to'g'ri)
  const streakUpTo = (k) => { let s = 0; for (let i = 0; i <= k; i++) { if (myAnswers[i]?.correct) s++; else s = 0; } return s; };
  const myPtsFor = (k) => { const a = myAnswers[k]; if (!a || !a.correct) return 0; return quizPts(a.elapsed) + (streakUpTo(k) >= 2 ? 100 : 0); };

  // Reyting (jonli) / solo hisob
  const board = players.map(p => { const s = quizScore(qRows.filter(r => r.player_id === p.id)); return { id: p.id, nickname: p.nickname, ...s }; }).sort((a, b) => b.pts - a.pts || b.ok - a.ok);
  const myRank = live.playerId ? board.findIndex(b => b.id === live.playerId) : -1;
  const soloRows = Object.entries(myAnswers).map(([k, v]) => ({ player_id: 'me', screen_idx: QUIZ_BASE_IDX + Number(k), correct: v.correct, elapsed_ms: v.elapsed }));
  const soloScore = quizScore(soloRows);

  const Q = qi >= 0 && qi < QUIZ_BANK.length ? QUIZ_BANK[qi] : null;
  // Hisoblagichlar: server qatorlari + O'Z javobim hali kelmagan bo'lsa lokal qo'shiladi
  const counts = Q ? Q.opts.map((_, i) => {
    if (solo) return myAnswers[qi]?.picked === i ? 1 : 0;
    let n = qRows.filter(r => r.screen_idx === QUIZ_BASE_IDX + qi && r.picked === i).length;
    const mine = myAnswers[qi];
    if (mine && mine.picked === i && live.playerId && !qRows.some(r => r.player_id === live.playerId && r.screen_idx === QUIZ_BASE_IDX + qi)) n++;
    return n;
  }) : [];
  const lastQ = qi >= QUIZ_BANK.length - 1;
  const my = qi >= 0 ? myAnswers[qi] : null;

  // Mentor test o'rtasida ✕ bossa — ogohlantiramiz: sinf arenada kutib qoladi.
  const closeArena = () => {
    if (isMentor && !solo && phase !== 'done') {
      if (!window.confirm("Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?")) return;
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

      {/* QUTQARUV: jonli dars tugadi — o'quvchi osilib qolmaydi, mashq rejimida davom etadi */}
      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:</span>
          <button className="qz-btn" onClick={startPractice}>📖 Mashq rejimida davom etish</button>
        </div>
      )}

      {/* ===== LOBBY ===== */}
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

      {/* ===== SAVOL ===== */}
      {phase === 'q' && Q && (
        <div className="qz-view qz-qview fade-step" key={`q${qi}`}>
          <div className="qz-top">
            <span className="qz-count">Savol <b>{qi + 1}</b>/{QUIZ_BANK.length}</span>
            <QzTimer remaining={remaining} />
            {isMentor
              ? <span className="qz-ansn">📨 {answeredN}/{players.length}</span>
              : <span className="qz-ansn">{streakUpTo(qi - 1) >= 2 ? `🔥 x${streakUpTo(qi - 1)}` : ' '}</span>}
          </div>
          <h2 className="qz-q">{Q.q}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
              const pickedThis = my && my.picked === i;
              return (
                <button key={i} className={`qz-tile ${my ? (pickedThis ? 'picked' : 'faded') : ''}`} style={{ background: QUIZ_COLORS[i] }} disabled={isMentor || !!my} onClick={() => answer(i)}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{o}</span>
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

      {/* ===== NATIJA (reveal) ===== */}
      {phase === 'reveal' && Q && (
        <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">Savol <b>{qi + 1}</b>/{QUIZ_BANK.length} — natija</span>
          </div>
          <h2 className="qz-q">{Q.q}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
              const win = i === Q.correct;
              const pickedThis = my && my.picked === i;
              return (
                <div key={i} className={`qz-tile rv ${win ? 'win' : 'lose'} ${pickedThis ? 'picked' : ''}`} style={{ background: QUIZ_COLORS[i] }}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{o}</span>
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

      {/* ===== YAKUN — PODIUM ===== */}
      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <div className="qz-brand sm"><QzBolt size={48} /><span className="qz-wm">Code<span className="qz-wm-h">Strike</span></span></div>
          <h2 className="qz-h" style={{ fontSize: 'clamp(20px,3.4vw,30px)' }}>🏆 Test yakunlandi!</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">ball · {soloScore.ok}/{QUIZ_BANK.length} to'g'ri{soloScore.maxStreak >= 2 ? ` · ketma-ket to'g'ri 🔥x${soloScore.maxStreak}` : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ Qaytadan yechish</button>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ Testni qaytadan yechish — mashq (jadvalga yozilmaydi)</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>Arenani yopish</button>
        </div>
      )}
    </div>
  );
}


export default function PmLesson2({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  // F-0730-01: saqlangan progress bir marta o'qiladi (jonli-o'quvchi mentor
  // darvozasidan oshib ketmasin — liveRead'dagi lastScreen bilan clamp).
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
  // 🏅 Nishonlar (achievements)
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

  // ETALON — 1920px (InternetLesson): keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); }; // F-0725-04 · 60-qonun: balandlik ham hisobda — past ekranda zum kattalashtirib vertikal joyni yemasin
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && _m.scored && _m.scope === 'final' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon
  };
  const reset = () => { progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  // F-0730-01: har o'zgarishda progress saqlanadi (screen + javoblar + nishonlar + boshlangan vaqt)
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned]);

  // Javob kaliti: inline testlar + jang savollari (QUIZ_BANK'dan) — mentor ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  // 🏅 Yakuniy ekranga yetganda: bitiruvchi nishoni
  useEffect(() => { if (screen === TOTAL_SCREENS - 1) earn('graduate'); }, [screen]); // eslint-disable-line


  const finishLesson = () => {
    progClear(LESSON_META.lessonId); // F-0730-01: yakunlangan dars saqlovi tozalanadi
    live.endSession();
    const scoredMeta = SCREEN_META.filter(s => s.scored);
    const finalMeta = scoredMeta.filter(s => s.scope === 'final');
    const scoredAnswers = SCREEN_META.map((s, i) => (s.scored ? answers[i] : null)).filter(Boolean);
    const correctAnswers = scoredAnswers.filter(a => a.correct).length;
    const finalCorrect = SCREEN_META.map((s, i) => (s.scored && s.scope === 'final' ? answers[i] : null)).filter(Boolean).filter(a => a.correct).length;
    const payload = {
      lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle,
      nickname: live.nickname || null, livePin: live.pin || null, liveMode: live.mode,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scoredMeta.length, correctAnswers,
      scorePercent: scoredMeta.length ? Math.round((correctAnswers / scoredMeta.length) * 100) : 0,
      finalScore: finalCorrect, finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : (scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false),
      answers: SCREEN_META.map((_s, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === 'function') onFinished(payload);
  };

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen8, Screen9, Screen11, Screen12, Screen14, ScreenCoding, ScreenPodium, ScreenFlashcards, Screen16];
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
        .fade-up { animation: fade-in-up 0.45s cubic-bezier(.2,.7,.2,1) forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(27,22,48,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        /* Harakat-diyeta: kirish-animatsiyalari o'chirilganda kontent SHU ZAHOTI ko'rinadi (60-qonun) */
        @media (prefers-reduced-motion: reduce) {
          .fade-up, .fade-step, .pg-in, .zoom-on, .zoom-backdrop, .step-card { animation: none !important; opacity: 1 !important; transform: none !important; }
          .zoom-on { transform: translate(-50%,-50%) !important; }
          .dd-slot.bad, .cr-row.bad { animation: none !important; }
        }
        @keyframes dl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.16); } }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.ink}; color: ${T.bg}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(91,61,230,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        /* 🔔 NAVBAT-PULSI (88-qonun): navbat shu elementda. O'LCHAM O'ZGARMAYDI — faqat halqa
           nafas oladi, shuning uchun UI sakramaydi va ixchamligicha qoladi. Asosiy soya saqlanadi. */
        @keyframes turn-hint {
          0%, 100% { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 0 rgba(91,61,230,0.40); }
          50%      { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 8px rgba(91,61,230,0); }
        }
        .turn-hint { animation: turn-hint 1.9s ease-in-out infinite; }
        /* Tugmadan boshqa elementlar uchun (chip, karta, zona): halqa ALOHIDA qatlamda chiziladi —
           elementning o'z soyasi/foniga tegmaydi va layout'ni surmaydi (pointer-events yo'q). */
        .turn-ring { position: relative; }
        .turn-ring::after {
          content: ''; position: absolute; inset: -3px; border-radius: inherit; pointer-events: none;
          border: 2px solid ${T.accent}; opacity: 0; animation: turn-ring 1.9s ease-in-out infinite;
        }
        @keyframes turn-ring { 0%, 100% { opacity: 0; } 50% { opacity: 0.65; } }
        /* Navbat TO'LQINI: bir guruh variant birma-bir yonadi. Kechikishlar shunday tanlanganki,
           istalgan lahzada FAQAT BITTASI ko'rinadi (har biri ~0.4s, kechikish 0.7s). Cheklangan
           (4 aylanish) — sekin o'qiydigan o'quvchi peripheral harakatdan charchamasin. */
        .turn-wave::after { animation-name: turn-wave; animation-duration: 2.1s; animation-iteration-count: 4; }
        @keyframes turn-wave { 0%, 100% { opacity: 0; } 12% { opacity: 0.7; } 30% { opacity: 0; } }
        .turn-wave.w2::after { animation-delay: 0.7s; }
        .turn-wave.w3::after { animation-delay: 1.4s; }
        /* Navbat YURISHI: bitta qadam — paydo bo'ladi, turadi, so'nadi (bir marta). */
        .turn-step::after { animation-name: turn-step; animation-duration: 1.3s; animation-iteration-count: 1; }
        @keyframes turn-step { 0% { opacity: 0; } 20% { opacity: 0.68; } 78% { opacity: 0.68; } 100% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .turn-hint, .turn-ring::after { animation: none; } .turn-ring::after { opacity: 0; } }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .option:hover:not(:disabled) { background: #FBFAFE; transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -8px rgba(18,169,104,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.5 !important; box-shadow: none !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.34) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.2); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(91,61,230,0.4); }
        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 9px 14px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -6px rgba(${T.shadowBase},0.22); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover { transform: translateY(-1px); }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: contain; transform: scale(1.12); }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -7px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI === */
        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .hook-option:hover:not(:disabled):not(.on) { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        .h-title { font-size: clamp(22px,4vw,38px); }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        .demo-swap { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }

        /* === STAGE === */
        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(156,151,180,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        .progress-track { height: 3px; background: rgba(156,151,180,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

        /* === FRAME === */
        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(91,61,230,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(18,169,104,0.22); }
        .frame-warn { background: ${AMBER_SOFT}; border-left: 4px solid ${AMBER}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === BRAUZER MAKETI (HTML darslar dizayni) === */
        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 12px 30px -8px rgba(${T.shadowBase},0.2); }
        .bp-bar { background: ${T.bg}; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-url { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; display: flex; align-items: center; gap: 6px; } .lock { color: ${T.success}; font-size: 8px; }
        .bp-body { padding: clamp(13px,2.2vw,18px); }
        .pg-in { animation: pg-in 0.38s cubic-bezier(.2,.7,.2,1); } @keyframes pg-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .site-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid ${T.ink3}40; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .site-brand { display: inline-flex; align-items: center; gap: 8px; } .site-logo { width: 24px; height: 24px; border-radius: 6px; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 13px; } .site-name { font-family: 'Manrope'; font-weight: 700; color: ${T.ink}; font-size: 14px; }
        .site-nav { display: inline-flex; gap: 12px; font-family: 'Manrope'; font-size: 12px; color: ${T.ink2}; }
        .site-h3 { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(16px,2.2vw,21px); color: ${T.ink}; margin: 0 0 8px; }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar bir-birining ustiga chiqib ketardi (klinika 11/17 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 16px 18px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); animation: fade-step 0.34s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === CONN === */
        .conn-flow { display: flex; align-items: center; justify-content: center; gap: 6px; background: ${T.paper}; border-radius: 16px; padding: 24px 16px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.14); }
        .conn-node { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; transition: opacity 0.3s; }
        .conn-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .conn-sub { font-family: 'JetBrains Mono'; font-size: 10px; color: ${T.ink3}; text-align: center; }
        .conn-link { display: flex; align-items: center; gap: 3px; flex: 1; max-width: 150px; }
        .conn-line { flex: 1; height: 3px; background: ${T.success}; border-radius: 2px; transition: background 0.3s; }
        .conn-sig { display: inline-flex; }
        .conn-link.cut .conn-line { background: ${T.ink3}; opacity: 0.5; border-top: 2px dashed ${T.accent}; height: 0; }
        .conn-link.cut { animation: shake 0.3s; }
        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }

        /* === ALGO BUILD === */
        .algo-build { background: ${T.paper}; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.14); }
        .algo-line { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; background: ${T.bg}; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 22px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; } .ta-bulb { } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

        /* === YAKUN === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { display: inline-flex; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; flex-shrink: 0; margin-top: 1px; }
        /* 💻 UYGA VAZIFA — bitta katta chorlab turuvchi tugma (CodeStrike kapsulasi ruhida):
           indigo-gradient + nafas oluvchi nur-halqa + suzib o'tuvchi shine. LMS kompilyatoriga eshik. */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        /* 1) Tashqi aura — kapsula orqasidagi nafas oluvchi binafsha nur-gardish */
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        /* 2) Suzuvchi xira tokenlar — dars so'zlari kapsula osmonida */
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: rgba(255,255,255,0.15); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        /* 3) Zaryad-effekt — bosilganda kapsula yorishib "otiladi" */
        .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
        @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.05); } 100% { filter: brightness(1); transform: scale(1); } }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; text-shadow: 0 2px 12px rgba(0,0,0,0.25); }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent); transform: skewX(-18deg); animation: hw-shine 3.2s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 0 rgba(124,58,237,.35); } 50% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 34px rgba(124,58,237,.68), 0 0 84px rgba(124,58,237,.4), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 11px rgba(124,58,237,0); } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none; } .hw-big-wrap::before { opacity: 0.55; } }
        .hw-cta-note { margin: 9px 0 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; }

        /* MOBIL: yig'iladigan Mentor */
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
        .mstats-chip.badc { background: ${T.accentSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.accent}; }
        .mstats-chip.waitc { background: rgba(${T.shadowBase},0.06); } .mstats-chip.waitc .mstats-chip-n, .mstats-chip.waitc .mstats-chip-t { color: ${T.ink2}; }
        .mstats-chip.ansc { background: rgba(14,134,196,0.10); } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.blue}; }
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
        .mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }

        /* ===== 🛠 KODING — praktika-panel, aylantirish-vizual va TO'LIQ-EKRAN KOMPILYATOR ===== */
        .lp-mstats { background: ${T.paper}; border-radius: 14px; padding: 13px 15px; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); min-width: 0; overflow-wrap: anywhere; }
        .done-mini { display: inline-flex; align-items: center; gap: 7px; flex-wrap: wrap; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 7px 15px; min-width: 0; overflow-wrap: anywhere; }
        .done-mini .dm-sub { font-weight: 500; color: ${T.ink2}; }
        /* 🔓 Takrorlash-yo'li: JIM matn-havola. Ataylab tugma EMAS va ataylab xira —
           asosiy harakat (kompilyatorni ochish) bilan raqobatlashmasin, faqat kerak
           bo'lganga ko'rinsin. Hoverda aniqlashadi. */
        .stq-skip { margin-top: 2px; background: none; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-decoration: underline; text-underline-offset: 3px; padding: 4px 6px; border-radius: 8px; transition: color 0.15s; }
        .stq-skip:hover { color: ${T.accent}; }
        .stq-mnote-d { align-self: flex-start; min-width: 0; }
        .stq-mnote-d summary { cursor: pointer; list-style: none; display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; color: ${T.blue}; background: ${T.blueSoft}; border-radius: 99px; padding: 6px 13px; user-select: none; transition: box-shadow 0.15s; }
        .stq-mnote-d summary::-webkit-details-marker { display: none; }
        .stq-mnote-d summary:hover { box-shadow: 0 4px 12px -6px rgba(14,134,196,0.4); }
        .stq-mnote-d[open] summary { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
        .stq-mnote-d p { margin: 0; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600; color: ${T.blue}; background: ${T.blueSoft}; border-radius: 0 11px 11px 11px; padding: 9px 13px; max-width: 430px; overflow-wrap: anywhere; }

        /* Aylantirish-vizual: teg-skelet ➜ yig'ilgan sahifa (bu darsning O'Z ko'rinishi) */
        .stq { display: flex; align-items: center; gap: clamp(10px,1.8vw,18px); }
        @media (max-width: 760px) { .stq { flex-direction: column; align-items: stretch; } .stq-arrow { transform: rotate(90deg); align-self: center; } }
        .stq-code { flex: 1; min-width: 0; border-radius: 14px; overflow: hidden; background: #10141F; box-shadow: 0 12px 28px -12px rgba(${T.shadowBase},0.4); }
        .stq-code-bar { display: flex; align-items: center; gap: 8px; background: #141C2B; padding: 8px 13px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #7E92B4; }
        .stq-code-body { display: flex; flex-direction: column; padding: clamp(12px,1.8vw,18px) clamp(14px,2vw,20px); font-family: 'JetBrains Mono', monospace; font-size: clamp(11.5px,1.4vw,13.5px); line-height: 1.75; }
        .stq-l { white-space: pre; }
        .stq-l.t { color: #FFD8A8; } .stq-l.m { color: #A9C7FF; } .stq-l.f { color: #B6F0C8; } .stq-l.dim { color: #6C7A94; }
        .stq-arrow { font-size: clamp(20px,2.8vw,28px); color: ${T.accent}; flex-shrink: 0; }
        .stq-page { flex: 1; min-width: 0; border-radius: 14px; overflow: hidden; background: ${T.paper}; box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.3), 0 0 0 1px ${T.line}; display: flex; flex-direction: column; }
        .stq-pbar { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .stq-purl { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; display: flex; align-items: center; gap: 6px; }
        .stq-top { background: ${T.ink}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.06em; padding: 11px 14px; }
        .stq-mid { position: relative; padding: 16px 14px 14px; display: flex; flex-direction: column; gap: 9px; background: #FBFAFE; }
        .stq-tag { position: absolute; top: 5px; right: 10px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .stq-row { display: flex; flex-direction: column; gap: 5px; opacity: 0; animation: fade-step 0.45s ease-out forwards; }
        .stq-row i { height: 9px; width: 42%; border-radius: 4px; background: ${T.accent}; opacity: 0.75; }
        .stq-row em { height: 6px; width: 88%; border-radius: 4px; background: ${T.ink3}; opacity: 0.35; }
        .stq-foot { background: ${T.accentSoft}; color: ${T.accent}; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.06em; padding: 10px 14px; }
        @media (prefers-reduced-motion: reduce) { .stq-row { opacity: 1; animation: none; } }
        .stq-cta { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .stq-cta-sub { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-align: center; }
        .kod-launch-btn { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,1.9vw,17px); background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 15px 34px; cursor: pointer; box-shadow: 0 14px 30px -8px rgba(91,61,230,0.6); transition: transform 0.18s, box-shadow 0.18s; }
        .kod-launch-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -8px rgba(110,75,255,0.72); }

        /* To'liq-ekran kompilyator (Htmllesson1 relslari, PM-STUDIA palitrasi) */
        .shc-root { position: fixed; inset: 0; z-index: 2100; background: radial-gradient(120% 80% at 50% -10%, ${T.accentSoft} 0%, rgba(235,229,253,0) 46%), ${T.bg}; overflow: hidden; animation: fade-step 0.3s ease-out; }
        .shc-wrap { width: 100%; max-width: 1160px; height: 100dvh; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; gap: clamp(9px,1.4vw,14px); padding: clamp(12px,2vw,26px); }
        .shc-top { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; min-width: 0; }
        .shc-eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 800; color: ${T.accent}; }
        .shc-title { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(19px,2.6vw,28px); margin: 0; color: ${T.ink}; line-height: 1.15; }
        .shc-brief { margin: 0; color: ${T.ink2}; font-size: clamp(12.5px,1.4vw,14.5px); line-height: 1.55; max-width: 72ch; overflow-wrap: anywhere; }
        .shc-brief b { color: ${T.ink}; }
        .shc-chips { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 7px; margin-top: 3px; }
        .shc-count { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; color: #fff; background: ${T.accent}; padding: 6px 11px; border-radius: 99px; }
        .shc-chip { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; background: ${T.paper}; padding: 5px 13px 5px 6px; border-radius: 99px; border: 1px solid ${T.line}; transition: all 0.22s ease; }
        .shc-chip.ok { color: ${T.ink}; border-color: ${T.success}44; background: ${T.successSoft}; }
        .shc-dot { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: ${T.bg}; color: ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; transition: all 0.25s; }
        .shc-chip.ok .shc-dot { background: ${T.success}; color: #fff; }
        .shc-hint { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 8px 15px; border-radius: 11px; max-width: 72ch; line-height: 1.5; overflow-wrap: anywhere; }
        .shc-err { margin: 2px 0 0; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${T.err}; background: ${T.errSoft}; padding: 7px 14px; border-radius: 10px; max-width: 72ch; line-height: 1.5; overflow-wrap: anywhere; }
        .shc-split { flex: none; height: 56vh; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(10px,1.5vw,16px); }
        .shc-pane { display: flex; flex-direction: column; min-height: 0; min-width: 0; border-radius: 16px; overflow: hidden; background: ${T.paper}; box-shadow: 0 1px 0 ${T.line}, 0 18px 40px -24px rgba(${T.shadowBase},0.35); }
        .shc-bar { display: flex; align-items: center; gap: 10px; padding: 9px 14px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; color: ${T.ink2}; border-bottom: 1px solid ${T.line}; background: ${T.bg}; }
        .shc-bar.dark { background: #141C2B; color: #A7B6D6; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .shc-tab { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: #fff; background: rgba(255,255,255,0.14); padding: 4px 12px; border-radius: 8px; box-shadow: inset 0 -2px 0 ${T.accent}; }
        .shc-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; display: flex; align-items: center; gap: 6px; }
        .shc-mini { margin-left: auto; background: ${T.accent}; color: #fff; border: none; border-radius: 9px; padding: 6px 13px; font-size: 11.5px; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; flex-shrink: 0; }
        .shc-live { margin-left: auto; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${T.success}; background: ${T.successSoft}; padding: 4px 9px; border-radius: 99px; font-weight: 800; }
        .shc-code { flex: 1; min-height: 0; resize: none; border: none; outline: none; background: #10141F; color: #E8E5DD; font-family: 'JetBrains Mono', monospace; font-size: 13.5px; line-height: 1.7; padding: 16px 18px; tab-size: 2; white-space: pre; overflow: auto; caret-color: ${T.accentVivid}; }
        .shc-code::placeholder { color: #5B6B86; font-style: italic; }
        .shc-frame { flex: 1; min-height: 0; width: 100%; border: none; background: #FBFAFE; }
        .shc-bottom { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .shc-ghost { background: transparent; border: 1px solid transparent; color: ${T.ink2}; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; padding: 11px 16px; border-radius: 12px; transition: all 0.15s; }
        .shc-ghost:hover { background: ${T.paper}; color: ${T.ink}; border-color: ${T.line}; }
        .shc-status { margin-left: auto; min-width: 0; }
        .shc-ok-msg { color: ${T.success}; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; }
        .shc-wait-msg { color: ${T.ink3}; font-family: 'Manrope', sans-serif; font-size: 13px; }
        .shc-next { background: ${T.accent}; color: #fff; border: none; border-radius: 13px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 15px; cursor: pointer; padding: 13px 28px; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.55); transition: all 0.2s; }
        .shc-next:hover:not(:disabled) { transform: translateY(-2px); }
        .shc-next:disabled { background: #D7D8DE; color: #fff; cursor: not-allowed; box-shadow: none; }
        @media (max-width: 820px) { .shc-split { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; height: 62vh; } }
        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); border-left: 4px solid #E8A13A; }
        .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
        .mstats-verdict.few { background: rgba(156,151,180,0.12); border-left: 4px solid ${T.ink3}; }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(91,61,230,0.55); }
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
        .rc-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(156,151,180,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
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
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
        .qz-cta-txt { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 3px; }
        .qz-cta-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; }
        .qz-cta-s { font-family: 'Manrope'; font-weight: 500; font-size: 13px; color: ${T.ink2}; }
        .qz-cta-btn { background: linear-gradient(170deg,${T.accentVivid},${T.accent}); color: #fff; border: none; border-radius: 14px; padding: 13px 24px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 12px 24px -8px rgba(91,61,230,0.6); transition: transform 0.2s; }
        .qz-cta-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.03); }
        .qz-cta-btn:disabled { background: ${T.line}; color: ${T.ink3}; cursor: default; box-shadow: none; }
        .qz-cta.ready .qz-cta-btn { animation: qz-pulse 1.1s ease-in-out infinite; }
        @keyframes qz-pulse { 0%,100% { transform: scale(1); box-shadow: 0 12px 24px -8px rgba(91,61,230,0.6); } 50% { transform: scale(1.06); box-shadow: 0 16px 34px -6px rgba(91,61,230,0.9); } }

        /* ===== ⚡ CODE STRIKE — NEON-KAPSULA (tungi turnir-portali) =====
           Yorug' sahifada qop-qora binafsha kapsula = arenaga PORTAL.
           Ichida darsning o'z QZ_BG_SHAPES tokenlari suzadi (dars-DNK). */
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        /* Kutish-holatida ham kapsula IXCHAM: so'z kattaligi o'zgarmaydi, faqat bo'sh joy qisqaradi
           («Mentorni kuting»dan keyin ortiqcha joy qolmasin — P0 etaloni) */
        .cs-cta .cs-cap { padding: clamp(14px,2vw,24px) clamp(22px,3.2vw,40px); gap: clamp(4px,0.7vw,8px); }
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
        .pod-col.me .pod-name { color: ${T.success}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.success}; }
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
        .pm-pop { animation: pmPop 0.5s cubic-bezier(.34,1.55,.5,1); }
        @keyframes pmPop { 0% { transform: scale(0.9); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
        .pm-match { animation: pmMatch 0.55s cubic-bezier(.34,1.5,.5,1); }
        @keyframes pmMatch { 0% { transform: scale(1); } 35% { transform: scale(1.06); box-shadow: 0 0 0 5px rgba(18,169,104,0.16); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(18,169,104,0); } }
        .pm-shake { animation: shake 0.4s ease; }
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes dl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.16); } }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }


        /* live-badge — sekundar UI, kerak bo'lguncha xira (11.15) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(40,34,82,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(14,134,196,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(14,134,196,0.22); }

        /* === 🏷️ fmtCode chip === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(40,34,82,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }

        /* === 🧲 DRAG&DROP (reusable) === */
        .dd { display: flex; flex-direction: column; gap: 13px; }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 56px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; transition: border-color .18s, background .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.ink3}44; }
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; }
        .dd-slot.bad { border-color: ${T.err}; background: ${T.errSoft}; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        .dd-slotn { width: 26px; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; }
        .dd-hint { color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${T.bg}; }
        .dd-pool-empty { color: ${T.ink3}; font-size: 12.5px; font-style: italic; align-self: center; }
        .dd-chip { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, ${T.accentVivid}, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(91,61,230,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip:hover { transform: translateY(-2px); }
        .dd-chip:active { cursor: grabbing; }
        .dd-chip.hint { animation: tap-hint 1.7s ease-in-out infinite; }
        @keyframes tap-hint { 0%, 100% { box-shadow: 0 8px 16px -8px rgba(91,61,230,.6), inset 0 2px 0 rgba(255,255,255,.3), 0 0 0 0 rgba(91,61,230,0); } 50% { box-shadow: 0 8px 16px -8px rgba(91,61,230,.6), inset 0 2px 0 rgba(255,255,255,.3), 0 0 0 4px rgba(91,61,230,0.28); } }
        @media (prefers-reduced-motion: reduce) { .dd-chip.hint { animation: none; } }
        .dd-slots, .dd-pool { position: relative; }
        .dd-pool { z-index: 1; }
        .dd-done { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .dd-wrong { font-weight: 700; color: ${T.err}; font-size: 13.5px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .dd-retry { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; cursor: pointer; border: none; border-radius: 9px; padding: 7px 13px; background: ${T.errSoft}; color: ${T.err}; transition: all 0.15s; }
        .dd-retry:hover { background: ${T.err}; color: #fff; }
        /* «Ishlaydigan tartib» (Qoida ekrani) — yo'l JONLANADI: bloklar birma-bir yumshoq yonib,
           foydalanuvchining tepadan pastga yurishini ko'rsatadi. Yonish oynalari ustma-ust
           TUSHMAYDI (0.4s oyna, 0.9s kechikish) — lahzada bittasi. Dekorativ oqim, affordance emas. */
        .rl-step { animation: rl-step 4.5s ease-in-out infinite; }
        @keyframes rl-step { 0%, 14%, 100% { transform: none; } 6% { transform: translateY(-2px); box-shadow: 0 10px 22px -8px rgba(91,61,230,0.3), inset 0 0 0 1.5px ${T.accent}44; } }
        .rl-arrow { animation: rl-arrow 4.5s ease-in-out infinite; opacity: 0.55; }
        @keyframes rl-arrow { 0%, 26%, 100% { opacity: 0.55; transform: none; } 15% { opacity: 1; color: ${T.accent}; transform: translateY(2px); } }
        @media (prefers-reduced-motion: reduce) { .rl-step, .rl-arrow { animation: none; } }

        /* === 🧍 SINOV MIJOZI (customer-run) === */
        .cr { display: flex; flex-direction: column; gap: 11px; }
        .cr-page { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 14px; padding: 12px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.18); }
        .cr-row { position: relative; display: flex; align-items: center; gap: 10px; padding: 9px 11px; border-radius: 11px; background: ${T.bg}; border: 1.5px solid transparent; transition: border-color .2s, background .2s, box-shadow .2s; }
        .cr-row.here { border-color: ${T.accent}; box-shadow: 0 6px 18px -8px rgba(91,61,230,0.4); }
        .cr-row.done { background: ${T.successSoft}; border-color: ${T.success}44; }
        .cr-row.bad { border-color: ${T.err}; background: ${T.errSoft}; animation: dd-shake .4s; }
        .cr-empty { color: ${T.ink3}; font-style: italic; font-size: 12.5px; }
        .cr-avatar { font-size: 22px; line-height: 1; margin-left: auto; animation: cr-hop .5s cubic-bezier(.34,1.4,.4,1); flex-shrink: 0; }
        @keyframes cr-hop { 0% { transform: translateY(-10px); opacity: 0; } 60% { transform: translateY(2px); } 100% { transform: translateY(0); opacity: 1; } }
        /* bounce — mijoz ishonchini yo'qotib sahifani tark etadi (opacity + translateY bilan chiqib ketadi) */
        .cr-avatar.leaving { animation: cr-leave .55s cubic-bezier(.5,0,.75,0) .35s forwards; }
        @keyframes cr-leave { 0% { transform: translateY(0); opacity: 1; } 30% { transform: translateY(-4px) rotate(-6deg); } 100% { transform: translateY(26px) rotate(-12deg); opacity: 0; } }
        /* convert — CTA "yonadi": foydalanuvchi harakatga chorlanadi */
        .cr-cta-fire { animation: cr-cta-fire 1.1s ease-in-out infinite; }
        @keyframes cr-cta-fire { 0%,100% { box-shadow: 0 10px 22px -10px rgba(91,61,230,0.55), 0 0 0 0 rgba(91,61,230,0); } 50% { box-shadow: 0 12px 28px -8px rgba(91,61,230,0.8), 0 0 0 6px rgba(91,61,230,0.16); } }
        @media (prefers-reduced-motion: reduce) { .cr-avatar, .cr-avatar.leaving, .cr-cta-fire { animation: none !important; } .cr-avatar.leaving { opacity: 0; } }
        .cr-tick { color: ${T.success}; display: inline-flex; margin-left: auto; flex-shrink: 0; }
        .cr-conf { display: flex; align-items: center; gap: 9px; }
        .cr-conf-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink2}; }
        .cr-conf-track { flex: 1; height: 8px; background: ${T.line || T.ink3 + '33'}; border-radius: 99px; overflow: hidden; }
        .cr-conf-fill { display: block; height: 100%; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); border-radius: 99px; transition: width .5s cubic-bezier(.34,1.2,.4,1); }
        .cr-conf-n { font-size: 12px; color: ${T.ink2}; font-variant-numeric: tabular-nums; }

        /* === 🃏 FLASHCARDS (reusable, 3D flip) === */
        .fc-center { display: flex; justify-content: center; padding-top: 4px; }
        .fc { display: flex; flex-direction: column; gap: 11px; max-width: 480px; width: 100%; }
        .fc-top { display: flex; justify-content: space-between; align-items: center; }
        .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
        .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
        .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
        .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
        @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
        .fc-bar { height: 7px; background: ${T.line || T.ink3 + '33'}; border-radius: 99px; overflow: hidden; }
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
        .fc-cardwrap { perspective: 1200px; position: relative; }
        .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid ${T.line || T.ink3 + '33'}; z-index: -1; }
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
        .fc-card { position: relative; height: clamp(160px,26vw,188px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .fc-card.flip { transform: rotateY(180deg); }
        .fc-card:not(.flip):hover { transform: translateY(-3px); }
        .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
        .fc-front { background: ${T.paper}; border: 2px solid ${T.line || T.ink3 + '33'}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, ${T.accentVivid}, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(91,61,230,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
        .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
        .fc-tap { color: ${T.accent}; font-weight: 700; }
        .fc-tag { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(26px,5vw,40px); letter-spacing: -0.01em; }
        .fc-note { font-family: 'Manrope'; font-size: 14px; opacity: 0.92; }
        .fc-actions { display: flex; gap: 10px; }
        .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
        .fc-btn:hover { transform: translateY(-2px); }
        .fc-btn.knew { background: ${T.success}; color: #fff; box-shadow: 0 10px 22px -10px ${T.success}; }
        .fc-btn.again { background: ${T.paper}; border: 2px solid ${T.accent}66; color: ${T.accent}; }
        .fc-btn.again:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
        .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid ${T.line || T.ink3 + '33'}; color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
        .fc-hint { margin: 0; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
        .fc-done-emoji { font-size: 40px; }
        .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
        .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }

        /* === 🏅 ACHIEVEMENTS — to'liq-ekran nishon bayrami === */
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
        .ach-coll { display: flex; flex-direction: column; gap: 10px; }
        .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
        .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #F5F1FE); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line || T.ink3 + '33'}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line || T.ink3 + '33'}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(91,61,230,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(91,61,230,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(91,61,230,0); } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 222px; background: ${T.paper}; border: 1px solid ${T.line || T.ink3 + '33'}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }

      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title="1-Modul" />
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
