import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// REACT MODULI · 6-DARS — API: POST/PUT/DELETE — SERVERGA YUBORISH — PLATFORM STANDARD v16 (AUDIOSIZ)
// Mavzu: so'rov fe'llari (method): GET o'qiydi, POST qo'shadi, PUT almashtiradi, DELETE o'chiradi;
//        fetch'ning 2-argumenti (sozlamalar qutisi), body + JSON.stringify (.json()ning teskarisi),
//        201 Created, ID (/games/2), DELETE tasdiqlash (qaytarilmaydi), CRUD nomi yakunda ochiladi.
// Misol sayt: robo-games (davom) — o'quvchi endi O'YINCHI emas, DEVELOPER tomonida:
//        o'z o'yinini serverga qo'shadi, tuzatadi, o'chiradi. L5 teaseri shu yerda bajariladi.
// Ekranlar 19 ta (s7 ID va s10 like-persist qo'shimcha o'rta sahifalar — user ruxsati bilan).
// Animatsiyalar: posilka endi TESKARI uchadi (siz→server, .fly-right), server jadvali jonli
//        (srow-new/changed/del), 4 qadamli POST parvozi (stringify→uchish→201→katalog),
//        like persist (PUT→refresh→turibdi), DELETE fade-out + confirm dialog.
// Oldingi darslar bilan bog'lanish: GET/fetch/.json()/404/skeleton (5-dars), state/setGames (3-dars),
//        map (4-dars), "refresh→yo'qoldi" muammosi (State darsi) — endi serverda saqlanadi.
// MUHIM: kelgusi darslar ro'yxati o'quvchiga AYTILMAYDI — faqat yakunda teaser.
// AUDIOSIZ: ovoz (TTS) yo'q — platforma qarori.
// Yakuniy ekran (s16): o'z o'yiniga nom+emoji berib, VS Code'da method: 'POST', ni yozish →
//        o'z kartochkasi katalogda paydo bo'ladi (payoff).
// Toza dizayn — ortiqcha emoji yo'q; ma'no so'z va tipografiya bilan beriladi.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
  line: '#E9E6DF',
  shadowBase: '58, 53, 48'
};
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };

const LangContext = createContext('uz');
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor

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
const LT = { bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', success: '#1F7A4D' };
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
    } catch { setJoinError(tr({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: 'Код ментора неверный или ошибка соединения.' })); }
    finally { setBusy(false); }
  }, [lessonId]);

  const joinStudent = useCallback(async (raw, rawNick) => {
    const p = (raw || '').replace(/\D/g, '');
    const nick = (rawNick || '').trim();
    if (p.length < 4) { setJoinError(tr({ uz: "Kodni to'liq kiriting.", ru: 'Введите код полностью.' })); return; }
    if (nick.length < 2) { setJoinError(tr({ uz: 'Ismingizni kiriting (kamida 2 harf).', ru: 'Введите ваше имя (минимум 2 буквы).' })); return; }
    setBusy(true); setJoinError('');
    try {
      const row = await liveGet(p);
      if (!row) { setJoinError(tr({ uz: 'Bunday kod topilmadi.', ru: 'Такой код не найден.' })); setBusy(false); return; }
      if (row.lesson_id && row.lesson_id !== lessonId) { setJoinError(tr({ uz: 'Bu kod boshqa darsga tegishli.', ru: 'Этот код от другого урока.' })); setBusy(false); return; }
      if (row.status !== 'live') { setJoinError(tr({ uz: 'Bu dars allaqachon yakunlangan.', ru: 'Этот урок уже завершён.' })); setBusy(false); return; }
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
      setJoinError(/ism|band|kod|dars|belgi/i.test(m) ? m : tr({ uz: "Ulanib bo'lmadi. Internetni tekshiring.", ru: 'Не удалось подключиться. Проверьте интернет.' }));
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
const _liveBadgeS = { position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 9998, background: LT.paper, border: `1px solid ${LT.ink3}55`, borderRadius: 99, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: LT.ink2, boxShadow: '0 2px 10px rgba(58,53,48,0.12)', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', maxWidth: '92vw' };
const _liveDot = (c) => ({ width: 8, height: 8, borderRadius: 99, background: c, display: 'inline-block' });

function LiveBigCode({ pin, onClose }) {
  const digits = String(pin || '').split('');
  const overlay = { position: 'fixed', inset: 0, zIndex: 10000, background: LT.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,40px)', textAlign: 'center' };
  const box = { background: LT.paper, color: LT.ink, borderRadius: 'clamp(10px,1.6vw,18px)', fontFamily: 'monospace', fontWeight: 800, lineHeight: 1, fontSize: 'clamp(48px,13vw,150px)', padding: 'clamp(10px,2vw,28px) clamp(12px,2.2vw,30px)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)' };
  return (
    <div style={overlay}>
      <div style={{ fontSize: 'clamp(13px,2vw,18px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: LT.accent, marginBottom: 'clamp(14px,3vw,28px)' }}>{tr({ uz: "Jonli darsga qo'shilish", ru: 'Присоединиться к живому уроку' })}</div>
      <div style={{ display: 'flex', gap: 'clamp(6px,1.4vw,16px)', justifyContent: 'center', flexWrap: 'wrap' }}>{digits.map((d, i) => <span key={i} style={box}>{d}</span>)}</div>
      <p style={{ color: '#fff', opacity: 0.85, fontSize: 'clamp(15px,2.2vw,22px)', maxWidth: 640, margin: 'clamp(20px,4vw,36px) 0 0', lineHeight: 1.5 }}>{tr({ uz: <>Shu darsni o'z qurilmangizda oching → <b style={{ color: '#fff' }}>«👨‍🎓 O'quvchiman»</b> → kodni kiriting.</>, ru: <>Откройте этот урок на своём устройстве → <b style={{ color: '#fff' }}>«👨‍🎓 Я ученик»</b> → введите этот код.</> })}</p>
      <button onClick={onClose} style={{ marginTop: 'clamp(22px,4vw,40px)', background: LT.accent, color: '#fff', border: 'none', borderRadius: 14, padding: 'clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)', fontSize: 'clamp(15px,1.8vw,18px)', fontWeight: 700, cursor: 'pointer' }}>{tr({ uz: 'Darsni boshlash →', ru: 'Начать урок →' })}</button>
    </div>
  );
}

function LiveGate({ live, title = 'Jonli dars' }) {
  const [code, setCode] = useState('');
  const [nick, setNick] = useState(() => nickRead()); // oldingi darsda yozgan ismi tayyor chiqadi
  const [mentorCode, setMentorCode] = useState('');
  const [role, setRole] = useState('student');
  const card = { position: 'relative', width: '100%', maxWidth: 420, background: LT.paper, borderRadius: 20, padding: 'clamp(24px,4vw,36px)', boxShadow: '0 10px 40px -12px rgba(58,53,48,0.22)', display: 'flex', flexDirection: 'column', gap: 18 };
  const wrap = { minHeight: 'calc(100dvh / var(--lz, 1))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 };
  const link = { background: 'none', border: 'none', color: LT.ink3, fontSize: 13, cursor: 'pointer', alignSelf: 'center' };
  if (role === 'mentor') {
    return (<div style={wrap}><div style={card}>
      <div style={{ textAlign: 'center' }}><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '0 0 4px' }}>{tr({ uz: '🧑‍🏫 Mentor kirishi', ru: '🧑‍🏫 Вход для ментора' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor kodini kiriting.', ru: 'Введите код ментора.' })}</p></div>
      <input value={mentorCode} onChange={e => setMentorCode(e.target.value)} type="password" autoFocus placeholder={tr({ uz: 'Mentor kodi', ru: 'Код ментора' })} onKeyDown={e => { if (e.key === 'Enter') live.startMentor(mentorCode); }} style={{ width: '100%', padding: '14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 18, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: 'Tekshirilmoqda…', ru: 'Проверяем…' }) : tr({ uz: 'Kirish →', ru: 'Войти →' })}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
      <button onClick={() => { setRole('student'); setMentorCode(''); }} style={link}>{tr({ uz: '← Orqaga', ru: '← Назад' })}</button>
    </div></div>);
  }
  return (<div style={wrap}><div style={card}>
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{tr(title)}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Присоединиться к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и ваше имя.' })}</p></div>
    <input value={code} onChange={e => setCode(e.target.value)} inputMode="numeric" autoFocus placeholder="483 920" style={{ width: '100%', padding: '16px 14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 28, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.12em', textAlign: 'center', outline: 'none' }} />
    <input value={nick} onChange={e => setNick(e.target.value)} maxLength={24} placeholder={tr({ uz: 'Ismingiz (masalan: Ali)', ru: 'Ваше имя (например: Али)' })} onKeyDown={e => { if (e.key === 'Enter') live.joinStudent(code, nick); }} style={{ width: '100%', padding: '13px 14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 17, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
    <button onClick={() => live.joinStudent(code, nick)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: 'Ulanmoqda…', ru: 'Подключаемся…' }) : tr({ uz: "Qo'shilish →", ru: 'Присоединиться →' })}</button>
    {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
    <button onClick={() => { setRole('mentor'); setCode(''); }} title="Mentor" aria-label="Mentor" style={{ position: 'absolute', bottom: 10, right: 12, background: 'none', border: 'none', fontSize: 16, opacity: 0.3, cursor: 'pointer', lineHeight: 1, padding: 4 }}>🧑‍🏫</button>
  </div></div>);
}

function LiveBadge({ live, total }) {
  const [bigOpen, setBigOpen] = useState(false);
  const [nPlayers, setNPlayers] = useState(null);
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
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "🔓 O'quvchilar erkin qilindi", ru: '🔓 Ученики отпущены в свободный режим' })}</div>;
    return (<>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr({ uz: 'Kod:', ru: 'Код:' })} <b style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr({ uz: "Kodni katta ko'rsatish", ru: 'Показать код крупно' })} style={{ marginLeft: 6, background: LT.ink, color: '#fff', border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: "📺 Ko'rsatish", ru: '📺 Показать' })}</button>
        <button onClick={() => { if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: 'Отпустить учеников? Дальше они продолжат самостоятельно.' }))) live.endSession(); }} style={{ background: LT.accentSoft, color: LT.accent, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: '🔓 Erkin qilish', ru: '🔓 Отпустить' })}</button>
      </div>
    </>);
  }
  if (live.mode === 'student') {
    if (live.status === 'ended') return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: "🔓 Erkin rejim — o'zingiz davom eting", ru: '🔓 Свободный режим — продолжайте сами' })}</div>;
    if (!live.mentorAlive) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: '⚠️ Mentor uzildi — erkin rejim', ru: '⚠️ Ментор отключился — свободный режим' })}</div>;
    if (!live.connected) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot('#FFD380')} /> {tr({ uz: '🔄 Qayta ulanmoqda…', ru: '🔄 Переподключаемся…' })}</div>;
    return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: '👨‍🏫 Mentor:', ru: '👨‍🏫 Ментор:' })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const useLang = () => useContext(LangContext);

// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};

// Matn ichidagi `kod` bo'laklarini chip qilib ko'rsatadi (qcode)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;
// AUDIOSIZ dars — useAudio/getAudioEngine zaglushkasi (TTS yo'q)
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

const LESSON_META = { lessonId: 'react-api-post-06-v18', lessonTitle: { uz: "API: POST/PUT/DELETE — serverga ma'lumot yuborish", ru: 'Работа с API — POST/PUT/DELETE' } };
const HW_TOKENS = [
  { t: { uz: 'amaliyot', ru: 'практика' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'loyiha', ru: 'проект' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'mashq', ru: 'упражнение' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'natija', ru: 'результат' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',    type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',    type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',    type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',    type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',    type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',    type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5b',   type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',    type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'sp1',   type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's7',    type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',    type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',    type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's10',   type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11',   type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'sp2',   type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12',   type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's13',   type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's14',   type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's15',   type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's16',   type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's16b',  type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash',type: 'flashcards',  template: 'custom',   scored: false, scope: null },
  { id: 's17',   type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

const Split = ({ children }) => <div className="split">{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;
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
        <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })} title={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })}>{big ? '✕' : '⛶'}</button>
        {children}
      </div>
    </>
  );
};

// 🏅 Yuqori paneldagi nishon hisoblagichi (Stage chrome)
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
  if (gate && gate.live && gate.live.mode === 'mentor') return null; // 🔴 mentor proyektorida nishon YO'Q (hooklardan KEYIN)
  return (
    <div className="ach-cnt-wrap">
      <button className={`ach-counter ${bump ? 'bump' : ''} ${count > 0 ? 'has' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Badges" title="Badges">
        <span className="ach-cnt-ic">🏅</span><b>{count}</b><span className="ach-cnt-tot">/{total}</span>
      </button>
      {open && (
        <div className="ach-pop" onMouseLeave={() => setOpen(false)}>
          <div className="ach-pop-h">🏅 Badges — {count}/{total}</div>
          {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(earned && earned.has(id)); return (
            <div key={id} className={`ach-pop-row ${got ? 'got' : ''}`}><span className="ach-pop-ic">{got ? a.icon : '🔒'}</span><span className="ach-pop-nm">{tr(a.name)}</span></div>
          ); })}
        </div>
      )}
    </div>
  );
}

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768); // mobil: Mentor yig'ilish rejimi
  const collapseOn = isNarrow && !mentorStatic; // ba'zi sahifalarda Mentor yig'ilmaydi
  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px + 60px
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); }, [screen]); // har ekranda Mentor ochiq holatdan boshlanadi
  const setCollapsed = useCallback((v) => {
    setMCollapsed(v);
    if (v === false && contentRef.current) { const el = contentRef.current; requestAnimationFrame(() => { if (el) el.scrollTo({ top: 0, behavior: 'auto' }); }); }
  }, []);
  const onContentClick = (e) => {
    if (!collapseOn || mCollapsed) return;
    if (e.target && e.target.closest && e.target.closest('.mentor')) return; // Mentorning o'ziga tegsa — yig'maymiz
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
const NavBack = ({ onPrev }) => <button className="btn-ghost" onClick={onPrev} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Orqaga', ru: 'Назад' })}</button>;
const NavNext = ({ disabled, label, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  const lbl = label !== undefined ? tr(label) : tr({ uz: 'Davom etish', ru: 'Продолжить' });
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
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
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

const RECAPS = {
  4: { title: { uz: "POST — yangi yozuv", ru: 'POST — новая запись' }, cards: [
    { ic: "📮", h: { uz: "Fe'l — jo'natish buyrug'i", ru: 'Глагол — команда отправки' }, body: { uz: <>Har so'rovning <b>fe'li (method)</b> bor — server shu fe'lga qarab nima qilishni biladi. <b>GET</b> olib keladi, <b>POST</b> esa yangi yozuv qo'shadi.</>, ru: <>У каждого запроса есть <b>глагол (method)</b> — по нему сервер понимает, что делать. <b>GET</b> приносит данные, а <b>POST</b> добавляет новую запись.</> }, vis: <RcFlow items={[{ uz: "GET olib keladi", ru: 'GET приносит' }, { uz: "POST olib boradi", ru: 'POST относит' }, { uz: "Server qo'shadi", ru: 'Сервер добавляет' }]} /> },
    { ic: "📦", h: { uz: "Fe'l sozlamalar qutisida", ru: 'Глагол — в коробке настроек' }, body: { uz: <>POST fetch'ning ikkinchi qismida yoziladi: <b>{"{ method: 'POST' }"}</b>. Bu — "olib kelma, olib bor" degani.</>, ru: <>POST пишется во второй части fetch: <b>{"{ method: 'POST' }"}</b>. Это значит «не приноси — отнеси».</> } },
    { ic: "🗣️", h: { uz: "O'ylab ko'ring", ru: 'Подумайте' }, body: { uz: <>Adopt Me! katalogda yo'q edi. Uni qo'shish uchun qaysi fe'l kerak?</>, ru: <>Adopt Me! не было в каталоге. Какой глагол нужен, чтобы её добавить?</> }, ask: { uz: "Katalogda yo'q o'yinni qo'shish uchun qaysi fe'l?", ru: 'Какой глагол добавит игру, которой нет в каталоге?' } },
  ]},
  6: { title: { uz: "body va JSON.stringify", ru: 'body и JSON.stringify' }, cards: [
    { ic: "📦", h: { uz: "body — teskari posilka", ru: 'body — посылка наоборот' }, body: { uz: <>O'tgan darsda posilka serverDAN kelardi. Endi teskari: <b>body</b> orqali ma'lumotni SIZ serverga yuborasiz.</>, ru: <>На прошлом уроке посылка приходила ОТ сервера. Теперь наоборот: через <b>body</b> данные на сервер отправляете ВЫ.</> }, vis: <RcFlow items={[{ uz: "Obyekt", ru: 'Объект' }, "JSON.stringify", { uz: "JSON matn", ru: 'JSON-текст' }]} /> },
    { ic: "🔤", h: { uz: "Server obyektni tushunmaydi", ru: 'Сервер не понимает объект' }, body: { uz: <>Serverga <b>JSON matn</b> kerak. <b>JSON.stringify()</b> obyektni matnga aylantiradi — bu .json()ning teskarisi.</>, ru: <>Серверу нужен <b>JSON-текст</b>. <b>JSON.stringify()</b> превращает объект в текст — это операция, обратная .json().</> } },
    { ic: "🗣️", h: { uz: "O'ylab ko'ring", ru: 'Подумайте' }, body: { uz: <>Endi siz serverga qaysi "tilda" (formatda) yozyapsiz?</>, ru: <>На каком «языке» (в каком формате) вы теперь пишете серверу?</> }, ask: { uz: "Serverga qaysi formatda yozamiz?", ru: 'В каком формате мы пишем серверу?' } },
  ]},
  11: { title: { uz: "Manzil va ID", ru: 'Адрес и ID' }, cards: [
    { ic: "📍", h: { uz: "URL — aniq manzil", ru: 'URL — точный адрес' }, body: { uz: <>Har yozuvning <b>ID</b>si bor. <b>/games</b> — hammasi, <b>/games/7</b> — faqat 7-yozuv.</>, ru: <>У каждой записи есть <b>ID</b>. <b>/games</b> — все записи, <b>/games/7</b> — только запись номер 7.</> }, vis: <RcFlow items={["/games", "/games/7", { uz: "bitta yozuv", ru: 'одна запись' }]} /> },
    { ic: "⚠️", h: { uz: "ID'siz xavfli", ru: 'Без ID — опасно' }, body: { uz: <>PUT va DELETE <b>doim ID bilan</b> ishlaydi — aks holda server qaysi yozuvni o'zgartirishni bilmaydi.</>, ru: <>PUT и DELETE работают <b>всегда с ID</b> — иначе сервер не поймёт, какую запись менять.</> } },
    { ic: "🗣️", h: { uz: "O'ylab ko'ring", ru: 'Подумайте' }, body: { uz: <><b>/games</b> va <b>/games/2</b> orasidagi farq nima?</>, ru: <>В чём разница между <b>/games</b> и <b>/games/2</b>?</> }, ask: { uz: "/games va /games/2 farqi nimada?", ru: 'В чём разница между /games и /games/2?' } },
  ]},
  15: { title: "DELETE", cards: [
    { ic: "🗑️", h: { uz: "DELETE + ID, body'siz", ru: 'DELETE + ID, без body' }, body: { uz: <><b>DELETE</b> yozuvni olib tashlaydi. Faqat <b>manzil + ID</b> kerak — body kerak emas.</>, ru: <><b>DELETE</b> убирает запись. Нужны только <b>адрес + ID</b> — body не нужен.</> }, vis: <RcFlow items={["DELETE", { uz: "tasdiqlash", ru: 'подтверждение' }, { uz: "ketdi", ru: 'удалено' }]} /> },
    { ic: "🚫", h: { uz: "Qaytarilmaydi", ru: 'Не вернуть' }, body: { uz: <>O'chirilgan yozuv <b>butunlay</b> ketadi. Shuning uchun avval <b>tasdiqlash</b> so'raladi.</>, ru: <>Удалённая запись исчезает <b>навсегда</b>. Поэтому сначала спрашивают <b>подтверждение</b>.</> } },
    { ic: "🗣️", h: { uz: "O'ylab ko'ring", ru: 'Подумайте' }, body: { uz: <>Nega saytlar o'chirishdan oldin "Ishonchingiz komilmi?" deb so'raydi?</>, ru: <>Почему сайты перед удалением спрашивают «Вы уверены?»</> }, ask: { uz: "Nega saytlar o'chirishdan oldin so'raydi?", ru: 'Почему сайты спрашивают перед удалением?' } },
  ]},
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
        <span className="rc-tag">{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Повторное объяснение' })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">{tr({ uz: '🗣️ Sinfga savol:', ru: '🗣️ Вопрос классу:' })} {tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущая' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}${tr({ uz: '-karta', ru: '-я карточка' })}`} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: '✓ Tushunarli — davom etamiz', ru: '✓ Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующая →' })}</button>}
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
        <span className="mstats-lbl">{tr({ uz: '📊 Jonli natija', ru: '📊 Живой результат' })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>{tr({ uz: '🔓 Natijani ochish', ru: '🔓 Открыть результат' })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }} /></div>
      {reveal ? (
        <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri ✅", ru: 'верно ✅' })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: 'xato ❌', ru: 'ошибка ❌' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ожидаем ⏳' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi 📨', ru: 'ответили 📨' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ожидаем ⏳' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и число ✅/❌ скрыто — после «Открыть результат» всё появится сразу и у Вас, и на экранах учеников.' })}</p>
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
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? `${n} ${tr({ uz: "o'quvchi", ru: 'уч.' })} · ${pct}%` : '—'}</span>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — класс не понял эту тему. Перед продолжением советуем коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс усвоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по проценту судить сложно. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>
        );
      })()}
      {waiting.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr({ uz: '⏳ Kutilmoqda:', ru: '⏳ Ожидаем:' })}</span>
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Советуем объяснить ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в реальном времени…' })}</p>}
    </div>
  );
}

const QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: 'on_mount', waits_for: { type: 'option_picked' } }] : null);
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
    if (audioText) { audio.triggerEvent('option_picked'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? (audioOk || "To'g'ri.") : (audioWrong || "Unchalik emas. Qaytadan urinib ko'ring.")); }, 300); }
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
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval natijani oching', ru: 'Сначала откройте результат' }) : solved ? { uz: 'Davom etish', ru: 'Продолжить' } : (oneShot ? { uz: 'Javob tanlang', ru: 'Выберите ответ' } : { uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, подумайте перед нажатием!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
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
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(tr(opt))}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? <>{tr({ uz: "✓ To'g'ri javob:", ru: '✓ Верный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? <>{tr({ uz: "To'g'ri javob:", ru: 'Верный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(tr(explainCorrect))
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете верный ответ.' })
                : wrongLocked
                  ? fmtCode(tr(explainWrong[picked] ?? explainWrong.default))
                  : solved ? fmtCode(tr(explainCorrect)) : fmtCode(tr(explainWrong[picked] ?? explainWrong.default))}
          </p>
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
              Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */}
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: '📖 Короткое повторение — взглянуть на тему ещё раз' })}</button>
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
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">{tr({ uz: "to'g'ri javob", ru: 'верных ответов' })}</div></div>
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish ▾", ru: 'открыть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

// 🧲 Qayta ishlatiladigan DRAG-DROP ORDER — bo'laklarni to'g'ri tartibda joylash (StrictMode-safe, atomik holat).
// Boshqa darsga: `items` ([{id,label}] — to'g'ri tartib), `hints`, `onSolved` almashtiriladi.
function DragDropOrder({ items, hints, onSolved }) {
  const order = items.map(x => x.id);
  const byId = useMemo(() => Object.fromEntries(items.map(x => [x.id, x])), [items]);
  const [st, setSt] = useState(() => {
    const a = order.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return { pool: a, slots: order.map(() => null) };
  });
  const { pool, slots } = st;
  const slotRefs = useRef([]);
  const full = slots.every(s => s !== null);
  const solved = slots.every((s, i) => s === order[i]);
  const wrong = full && !solved;
  useEffect(() => { if (solved) onSolved && onSolved(); }, [solved]); // eslint-disable-line
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
  const tap = (id) => setSt(({ pool, slots }) => {
    const e = slots.findIndex(s => s === null); if (e < 0) return { pool, slots };
    const ns = slots.slice(); ns[e] = id;
    return { pool: pool.filter(x => x !== id), slots: ns };
  });
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
            {sid ? <button className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{byId[sid].label}</button> : <span className="dd-hint">{hints ? tr(hints[i]) : tr({ uz: 'bu yerga joylang', ru: 'положите сюда' })}</span>}
          </div>
        ))}
      </div>
      <div className="dd-pool">
        {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: 'Порядок неверный — нажмите на блок, верните его и разместите заново' })}</span>}
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{byId[id].label}</button>)}
      </div>
      {solved && <div className="dd-done">{tr({ uz: "✓ To'g'ri! Tartib aynan shunday.", ru: '✓ Верно! Порядок именно такой.' })}</div>}
      {wrong && !solved && <div className="dd-wrong">{tr({ uz: '⚠️ Tartib xato — qayta joylang.', ru: '⚠️ Порядок неверный — разместите заново.' })}</div>}
    </div>
  );
}

// 🐞 Qayta ishlatiladigan DEBUG CHALLENGE — buzuq koddan xato qatorni topib bosish → tuzatiladi.
// Boshqa darsga: `lines` (bittasida bug:true), `fixed` (to'g'ri qator), `explain` almashtiriladi.
function DebugChallenge({ lines, fixed, explain, onSolved }) {
  const bugIdx = lines.findIndex(l => l.bug);
  const [picked, setPicked] = useState(-1);
  const [wrongIdx, setWrongIdx] = useState(-1);
  const solved = picked === bugIdx;
  useEffect(() => { if (solved) onSolved && onSolved(); }, [solved]); // eslint-disable-line
  const click = (i) => {
    if (solved) return;
    if (i === bugIdx) setPicked(i);
    else { setWrongIdx(i); setTimeout(() => setWrongIdx(w => (w === i ? -1 : w)), 500); }
  };
  return (
    <div className="dbg fade-up">
      <div className="dbg-code">
        {lines.map((l, i) => (
          <div key={i} className={`dbg-line ${solved && i === bugIdx ? 'fixed' : ''} ${wrongIdx === i ? 'wrong' : ''}`} onClick={() => click(i)}>
            <span className="dbg-ln">{i + 1}</span>
            <span className="dbg-txt">{solved && i === bugIdx ? fixed : l.text}</span>
            {solved && i === bugIdx && <span className="dbg-badge">{tr({ uz: '✓ tuzatildi', ru: '✓ исправлено' })}</span>}
          </div>
        ))}
      </div>
      {!solved
        ? <p className="dbg-hint">{tr({ uz: '👆 Xato bor qatorni toping va bosing', ru: '👆 Найдите строку с ошибкой и нажмите на неё' })}</p>
        : <div className="dbg-ok">{tr({ uz: '✓ Topdingiz!', ru: '✓ Нашли!' })} {tr(explain)}</div>}
    </div>
  );
}

// 🃏 Qayta ishlatiladigan FLASHCARDS — aktiv takrorlash (3D flip + o'z-o'zini baholash + spaced recall).
// Boshqa darsga: faqat `cards` ({ front, back, note }) almashtiriladi.
// F-0803-13/14: KARTA JAVOBI UZUNLIKKA MOSLASHADI.
// Muammo edi: `.fc-tag` hamma javobga bir xil katta monoshrift berardi — u bir so'zlik javob
// (`let`, `=`, `string`) uchun tanlangan o'lcham. Uzun javob 2-3 qatorga bo'linib, qat'iy
// balandlikdagi kartaga sig'masdi va izoh pastki chetga yopishib qolardi.
// Yechim: (1) uzunlik bo'yicha 4 pog'onali o'lcham · (2) bitta kod-tokeni — mono,
// gap — Manrope (o'qishga qulay, ~25% tor) · (3) gap ichidagi kod so'zlari mono qoladi.
const FC_CODE_WORDS = /\b(let|const|var|string|number|boolean|true|false|null|undefined|function|return|for|while|if|else)\b/g;
const FC_VOCAB = new Set(['let', 'const', 'var', 'string', 'number', 'boolean', 'true', 'false', 'null', 'undefined', 'function', 'return', 'for', 'while', 'if', 'else']);
// Kodmi yoki so'zmi? Monoshrift FAQAT kodga: lug'atdagi kalit so'z yoki kod-belgisi bo'lgan
// token. «o'zgaruvchi» kabi o'zbekcha atama — gap, u Manrope bilan chiroyliroq va tor chiqadi.
// F-0803-23: defis-li ODDIY so'z («Promo-landing», «follow-up», «AI-agent») kod EMAS — ilgari u
// dasturchi shriftida, `let`/`const` kabi kod-token bo'lib ko'rinardi. Haqiqiy defis-li kod
// tokeni (`background-color`, `runs-on`) FC_VOCAB oq ro'yxati orqali mono bo'lib qoladi.
const fcIsCode = (s) => {
  if (FC_VOCAB.has(s.toLowerCase())) return true;
  if (/^[\p{L}'\u02BB\u2019]+(-[\p{L}'\u02BB\u2019]+)+$/u.test(s)) return false;
  return /[=(){};.[\]<>+*/%!&|-]/.test(s);
};
const fcTier = (s) => (s.length <= 8 ? 't1' : s.length <= 16 ? 't2' : s.length <= 32 ? 't3' : 't4');
const fcAnswer = (raw) => {
  const s = String(raw ?? '');
  const oneToken = !/\s/.test(s) && fcIsCode(s);        // `let`, `const`, `=`, `string` — kod tokeni
  const cls = `fc-tag ${fcTier(s)} ${oneToken ? 'mono-all' : 'prose'}`;
  if (oneToken) return <span className={cls}>{s}</span>;
  const parts = s.split(FC_CODE_WORDS);                 // gap: kod so'zlari mono bo'lakda qoladi
  return (
    <span className={cls}>
      {parts.map((p, i) => (i % 2 === 1 ? <span key={i} className="fc-kw">{p}</span> : p))}
    </span>
  );
};

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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'atama yodlandi', ru: 'терминов выучено' })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda", ru: '↻ Учим' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span><span className="fc-cue">{tr({ uz: "Javobni o'ylang", ru: 'Подумайте над ответом' })} 🤔 <span className="fc-tap">{tr({ uz: 'bosing', ru: 'нажмите' })}</span></span></div>
          <div className="fc-face fc-back">{fcAnswer(tr(card.back))}{card.note && <span className="fc-note">{tr(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : (<p className="fc-hint">{tr({ uz: "👆 Kartani bosing — javobni ko'rasiz", ru: '👆 Нажмите на карточку — увидите ответ' })}</p>)}
    </div>
  );
}

// ===== REACT-5 YORDAMCHILAR =====
const Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: 'italic' }}>{children}</span>;
const Win = ({ title, children, minH }) => (
  <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">{title}</span></div><div className="bp-body" style={{ minHeight: minH, position: 'relative' }}>{children}</div></div>
);
// Roblox uslubidagi o'yinlar (oldingi darslardan tanish)
const GAMES = [
  { name: 'Adopt Me!', emoji: '🐾', likes: 92, players: '402K', bg: 'linear-gradient(135deg,#F3C2D2,#DFA6BA)' },
  { name: 'Blox Fruits', emoji: '🍇', likes: 95, players: '750K', bg: 'linear-gradient(135deg,#BAC4EC,#98A6DC)' },
  { name: 'Brookhaven', emoji: '🏠', likes: 89, players: '510K', bg: 'linear-gradient(135deg,#B6DDC4,#92C8A7)' },
  { name: 'Tower of Hell', emoji: '🗼', likes: 84, players: '120K', bg: 'linear-gradient(135deg,#A6D4CF,#82BDB6)' },
  { name: 'Doors', emoji: '🚪', likes: 91, players: '310K', bg: 'linear-gradient(135deg,#C6BFB8,#A79E95)' },
  { name: 'Piggy', emoji: '🐷', likes: 87, players: '180K', bg: 'linear-gradient(135deg,#DCC0D2,#C29FB6)' },
  { name: 'Bee Swarm', emoji: '🐝', likes: 93, players: '260K', bg: 'linear-gradient(135deg,#CFD8B2,#B0BC90)' },
  { name: 'Robo Race', emoji: '🤖', likes: 100, players: '—', bg: 'linear-gradient(135deg,#F0C9B4,#D8A184)' }
];
const gameByName = (nm) => GAMES.find(g => g.name.toLowerCase() === String(nm).toLowerCase());
// To'rt so'rov fe'li (method) — rang va vazifa bilan
const VERBS = {
  GET: { col: '#019ACB', soft: '#E2F4FA', t: { uz: 'OLADI', ru: 'ЧИТАЕТ' }, desc: { uz: "ro'yxatni o'qib olib keladi — hech narsani o'zgartirmaydi", ru: 'читает и приносит список — ничего не меняет' } },
  POST: { col: '#1F7A4D', soft: '#E3F0E8', t: { uz: "QO'SHADI", ru: 'ДОБАВЛЯЕТ' }, desc: { uz: "yangi yozuv yaratadi — posilka (body) bilan keladi", ru: 'создаёт новую запись — приходит с посылкой (body)' } },
  PUT: { col: '#B45309', soft: '#FBEEDB', t: { uz: 'ALMASHTIRADI', ru: 'ЗАМЕНЯЕТ' }, desc: { uz: "mavjud yozuvni yangisiga almashtiradi — ID kerak", ru: 'заменяет существующую запись новой — нужен ID' } },
  DELETE: { col: '#C2362B', soft: '#FAE3E0', t: { uz: "O'CHIRADI", ru: 'УДАЛЯЕТ' }, desc: { uz: "yozuvni butunlay olib tashlaydi — ID kerak, body kerak emas", ru: 'полностью убирает запись — нужен ID, body не нужен' } }
};
const VKEYS = ['GET', 'POST', 'PUT', 'DELETE'];
// Server jadvali qatori (id + nom) — holatlar: read/new/changed/del
const SrvRow = ({ id, name, state, extra }) => (
  <div className={`srow ${state ? `srow-${state}` : ''}`}>
    <span className="srid">{id}</span>
    <span className="srname">{name}</span>
    {extra && <span className="srextra">{extra}</span>}
  </div>
);
// O'yin kartochkasi (bu darsda: likes override + bosiladigan 👍)
const RoCard = ({ name, emoji, players, top, likes, onLike }) => {
  const g = gameByName(name);
  const bg = g ? g.bg : 'linear-gradient(135deg,#8E9BB5,#4A5670)';
  const em = emoji || (g ? g.emoji : '🎮');
  const pct = likes != null ? likes : (g ? g.likes : 88);
  return (
    <div className="rocard el-in" style={{ position: 'relative' }}>
      <div className="rothumb" style={{ background: bg }}>
        <span style={{ fontSize: 26 }}>{em}</span>
        {top && <span className="topbadge el-in">🔥 TOP</span>}
      </div>
      <div className="robody">
        <p className="roname">{name}</p>
        <div className="rostats">
          <span key={pct} className={onLike ? 'hpop' : undefined} onClick={onLike} style={onLike ? { cursor: 'pointer', fontWeight: 700, color: T.ink } : undefined}>👍 {pct}%</span>
          {players && <span>👥 {players}</span>}
        </div>
      </div>
    </div>
  );
};
// Skeleton kartochka — yuklanish holati (shimmer)
const SkelCard = () => (
  <div className="rocard">
    <div className="rothumb skel" />
    <div className="robody">
      <div className="skel" style={{ height: 11, width: '70%', borderRadius: 5, marginBottom: 5 }} />
      <div className="skel" style={{ height: 9, width: '45%', borderRadius: 5 }} />
    </div>
  </div>
);
// Terminal/konsol qatori
const TLine = ({ cmd, out, dim }) => (
  <div className="el-in" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(11.5px,1.4vw,13px)', lineHeight: 1.7, color: dim ? CODE.comment : CODE.text }}>
    {cmd ? <><span style={{ color: CODE.str }}>$</span> <span style={{ color: CODE.text }}>{cmd}</span></> : out}
  </div>
);

// ===== SCREEN 0 — HOOK (siz o'yin yaratdingiz — GET uni katalogga chiqarmadi!) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [fetched, setFetched] = useState(!!storedAnswer);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const doGet = () => {
    if (loading) return;
    setLoading(true); setFetched(false);
    timer.current = setTimeout(() => { setLoading(false); setFetched(true); }, 1100);
  };
  const OPTS = [
    { id: 'a', label: { uz: 'Internet sekin ishladi', ru: 'Интернет работал медленно' } },
    { id: 'b', label: { uz: "GET faqat OLADI — serverga hech narsa yubormaydi", ru: 'GET только ЧИТАЕТ — на сервер ничего не отправляет' } },
    { id: 'c', label: { uz: "Server sizning o'yiningizni yoqtirmadi", ru: 'Серверу не понравилась Ваша игра' } }
  ];
  const pick = (v) => { if (picked !== null || !fetched) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  const audio = useAudio([{ id: 's0', text: `Siz o'yin yaratdingiz, lekin u katalogda ko'rinmayapti. Nega? Kompyuteringizdagi o'yinni GET so'rovi bilan yuborib ko'ring. GET faqat o'qiydi va olib keladi — serverga hech narsa jo'natmaydi. Shuning uchun o'yiningiz katalogga chiqmaydi. Sabab nimada — o'ylab, javobni tanlang.`, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 800 }}>{tr({ uz: <>Siz o'yin yaratdingiz. Nega u katalogga <span className="italic" style={{ color: T.accent }}>chiqmayapti</span>?</>, ru: <>Вы создали игру. Почему она <span className="italic" style={{ color: T.accent }}>не появляется</span> в каталоге?</> })}</h1>
        <Mentor>{tr({ uz: <>O'tgan darsda <b style={{ color: T.ink }}>katalogni</b> — robo-games sahifasidagi, hammaga ko'rinadigan o'yinlar ro'yxatini — serverdan <span className="mono">fetch</span> bilan oldik. Mana sizning yangi o'yiningiz — <b style={{ color: T.ink }}>Robo Race</b>, kompyuteringizda tayyor turibdi. GET so'rovini yuborib ko'ring — katalogga chiqarmikan?</>, ru: <>На прошлом уроке мы получили <b style={{ color: T.ink }}>каталог</b> — список игр на странице robo-games, который видят все, — с сервера через <span className="mono">fetch</span>. А вот Ваша новая игра — <b style={{ color: T.ink }}>Robo Race</b>, она готова и лежит на Вашем компьютере. Отправьте GET-запрос — попадёт ли она в каталог?</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ maxWidth: 150, flexShrink: 0 }}>
                <p className="flow-label" style={{ marginBottom: 6 }}>{tr({ uz: 'Sizning kompyuteringizda', ru: 'На Вашем компьютере' })}</p>
                <div className="frame-dash" style={{ padding: 8 }}><RoCard name="Robo Race" emoji="🤖" likes={100} /></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn" onClick={doGet} disabled={loading}>{loading ? tr({ uz: "So'rov yo'lda…", ru: 'Запрос в пути…' }) : (fetched ? tr({ uz: '↻ Yana GET yuborish', ru: '↻ Отправить GET ещё раз' }) : tr({ uz: 'GET bilan olish', ru: 'Получить через GET' }))}</button>
                {fetched && <span className="mono small fade-step" style={{ color: T.ink2 }}>GET /games → 200 OK</span>}
              </div>
            </div>
            <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'robo-games — katalog', ru: 'robo-games — каталог' })}</p>
            <Win title="robo-games — localhost:5173" minH={96}>
              {loading && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}><SkelCard /><SkelCard /><SkelCard /></div>}
              {!loading && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <RoCard name="Adopt Me!" />
                  <RoCard name="Doors" />
                  <RoCard name="Piggy" />
                </div>
              )}
            </Win>
            {fetched && <p className="small fade-step" style={{ color: T.accent, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Katalog keldi… lekin Robo Race ICHIDA YO'Q!", ru: 'Каталог пришёл… но Robo Race в нём НЕТ!' })}</p>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Sizningcha, nega chiqmadi?', ru: 'Как Вы думаете, почему не появилась?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (
                  <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null || !fetched} style={{ opacity: !fetched ? 0.55 : 1 }} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{tr(o.label)}</span>
                  </button>
                );
              })}
            </div>
            {!fetched && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Avval GET yuborib ko'ring ←", ru: 'Сначала отправьте GET ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Aynan! GET faqat <b>o'qiydi</b> — bor narsani olib keladi. O'yiningiz hali serverda yo'q — bugun <b>yuborishni</b> o'rganamiz: POST, PUT, DELETE.</>, ru: <>Именно! GET только <b>читает</b> — приносит то, что уже есть. Вашей игры на сервере ещё нет — сегодня научимся <b>отправлять</b>: POST, PUT, DELETE.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (developer tomoniga o'tamiz) =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: tr({ uz: "So'rov fe'llari — 4 buyruq", ru: 'Глаголы запросов — 4 команды' }), tag: 'GET · POST · PUT · DELETE' },
    { text: tr({ uz: "POST — yangi qo'shish", ru: 'POST — добавить новое' }), tag: "method: 'POST'" },
    { text: tr({ uz: 'Posilka yuki — body', ru: 'Груз посылки — body' }), tag: 'JSON.stringify(yangi)' },
    { text: tr({ uz: 'PUT — almashtirish', ru: 'PUT — заменить' }), tag: '/games/2 + ID' },
    { text: tr({ uz: "DELETE — o'chirish", ru: 'DELETE — удалить' }), tag: tr({ uz: 'tasdiqlash bilan', ru: 'с подтверждением' }) }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: "Dars oxirida — sizning o'yiningiz serverda", ru: 'В конце урока — Ваша игра на сервере' })}</p>
      <Win title="robo-games — localhost:5173" minH={92}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <RoCard name="Adopt Me!" />
          <RoCard name="Doors" />
          <RoCard name="Robo Race" emoji="🤖" likes={100} top />
        </div>
      </Win>
      <pre className="code-box" style={{ padding: '10px 14px' }}>{'fetch(url, { '}<At>method</At>{': '}<St>'POST'</St>{', '}<At>body</At>{': … })'}</pre>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: '→ endi siz serverga buyruq berasiz', ru: '→ теперь Вы отдаёте команды серверу' })}</p>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 5 qadam', ru: '5 шагов на сегодня' })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{s.text}</span>{s.tag && <span className="step-tag">{s.tag}</span>}</span></li>))}
      </ol>
    </Col>
  );
  const audio = useAudio([{ id: 's1', text: `Ishonasizmi — dars oxirida o'z o'yiningizni serverga joylaysiz, u katalogda hammaga ko'rinadi. Yo'lda yana ikki kuch olasiz: xatoni tuzatish va keraksizini o'chirish. Bularning hammasi — so'rov fe'llari: GET, POST, PUT, DELETE. Bugun buni besh qadamda o'rganamiz.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Bugun siz o'yinchi emas — <span className="italic" style={{ color: T.accent }}>dasturchi</span> bo'lasiz.</>, ru: <>Сегодня Вы не игрок — Вы <span className="italic" style={{ color: T.accent }}>разработчик</span>.</> })}</h2>
        </div>
        <Mentor>{tr({ uz: <>O'tgan darsda ofitsiant taomni <b style={{ color: T.ink }}>olib kelardi</b> — bugun teskarisi: <b style={{ color: T.ink }}>siz serverga jo'natasiz</b>. Dars oxirida o'z o'yiningiz katalogda hammaga ko'rinadi.</>, ru: <>На прошлом уроке официант <b style={{ color: T.ink }}>приносил</b> блюдо — сегодня наоборот: <b style={{ color: T.ink }}>Вы отправляете на сервер</b>. В конце урока Вашу игру увидят все в каталоге.</> })}</Mentor>
        {!isNarrow ? (
          <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable>
        ) : !showSteps ? (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "Bugungi 5 qadamni ko'rish", ru: 'Посмотреть 5 шагов на сегодня' })}</button>
          </div>
        ) : (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Natijani ko'rish", ru: '↩ Посмотреть результат' })}</button>
            {StepsBlock}
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — TO'RT FE'L (GET/POST/PUT/DELETE jonli demo) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(storedAnswer ? new Set(VKEYS) : new Set());
  const done = seen.size >= 4;
  const tap = (k) => { setActive(k); setSeen(prev => { const s = new Set(prev); s.add(k); return s; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const CONSOLE = {
    GET: <span style={{ color: CODE.str }}>{tr({ uz: "200 OK — 3 qator o'qildi", ru: '200 OK — прочитано 3 строки' })}</span>,
    POST: <span style={{ color: CODE.str }}>{tr({ uz: "201 Created — yangi qator qo'shildi", ru: '201 Created — добавлена новая строка' })}</span>,
    PUT: <span style={{ color: CODE.str }}>{tr({ uz: '200 OK — 2-qator almashtirildi', ru: '200 OK — строка 2 заменена' })}</span>,
    DELETE: <span style={{ color: CODE.str }}>{tr({ uz: "200 OK — 3-qator o'chirildi", ru: '200 OK — строка 3 удалена' })}</span>
  };
  const audio = useAudio([{ id: 's2', text: `Serverga necha xil buyruq berish mumkin? To'rtta. Har so'rovning fe'li bor — server shu fe'lga qarab nima qilishini biladi: GET o'qiydi, POST qo'shadi, PUT almashtiradi, DELETE o'chiradi. To'rtalasini bosib, server jadvaliga nima bo'lishini kuzating.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: "Fe'llar", ru: 'Глаголы' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `${seen.size}/4 fe'lni sinang`, ru: `Попробуйте глаголы: ${seen.size}/4` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Serverga necha xil <span className="italic" style={{ color: T.accent }}>buyruq</span> berish mumkin?</>, ru: <>Сколько разных <span className="italic" style={{ color: T.accent }}>команд</span> можно отдать серверу?</> })}</h2></div>
        <Mentor>{tr({ uz: <>To'rtta! Har so'rovning <b style={{ color: T.ink }}>fe'li (method)</b> bor — server shu fe'lga qarab nima qilishni biladi. Hozirgacha bittasini bilardingiz: GET. <b style={{ color: T.ink }}>To'rtalasini bosib</b>, server jadvaliga nima bo'lishini kuzating.</>, ru: <>Четыре! У каждого запроса есть <b style={{ color: T.ink }}>глагол (method)</b> — по нему сервер понимает, что делать. До сих пор Вы знали один: GET. <b style={{ color: T.ink }}>Нажмите на все четыре</b> и посмотрите, что происходит с таблицей сервера.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {VKEYS.map(k => {
                const v = VERBS[k];
                const on = active === k;
                return (
                  <button key={k} className={`vcard ${!seen.has(k) && !on ? 'hint' : ''}`} onClick={() => tap(k)} style={{ boxShadow: on ? `inset 0 0 0 1.5px ${v.col}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : undefined }}>
                    <span className="vbadge" style={{ background: v.col }}>{k}</span>
                    <span className="vlbl">{tr(v.t)}</span>
                    <span className="vseen" style={{ color: seen.has(k) ? T.success : T.ink3 }}>{seen.has(k) ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
            {active && <div className="sk-info" key={active}><p className="body" style={{ margin: 0, color: T.ink }}><b style={{ color: VERBS[active].col }}>{active}</b> — {tr(VERBS[active].desc)}.</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'robo-api.uz — server jadvali', ru: 'robo-api.uz — таблица сервера' })}</p>
            <div className="code-box fade-up delay-2" style={{ padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <SrvRow id={1} name="Adopt Me!" state={active === 'GET' ? 'read' : null} />
              <SrvRow id={2} name={active === 'PUT' ? 'Doors 2.0' : 'Doors'} state={active === 'GET' ? 'read' : (active === 'PUT' ? 'changed' : null)} extra={active === 'PUT' ? tr({ uz: 'yangilandi', ru: 'обновлено' }) : null} />
              <SrvRow id={3} name="Piggy" state={active === 'GET' ? 'read' : (active === 'DELETE' ? 'del' : null)} extra={active === 'DELETE' ? tr({ uz: "o'chirildi", ru: 'удалено' }) : null} />
              {active === 'POST' && <SrvRow id={4} name="Robo Race" state="new" extra={tr({ uz: '+ yangi', ru: '+ новое' })} />}
            </div>
            <div className="code-box" style={{ padding: '9px 13px', minHeight: 40 }}>
              {active
                ? <TLine out={<span className="el-in" style={{ display: 'inline-block' }}><span style={{ color: VERBS[active].col, fontWeight: 700 }}>{active}</span> /games{(active === 'PUT' || active === 'DELETE') ? <span style={{ color: CODE.attr }}>/{active === 'PUT' ? 2 : 3}</span> : ''} → {CONSOLE[active]}</span>} />
                : <TLine out={<span style={{ color: CODE.comment, fontStyle: 'italic' }}>{tr({ uz: "chapdan fe'lni tanlang…", ru: 'выберите глагол слева…' })}</span>} />}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bular — <b>HTTP fe'llari</b>. Manzil bitta (<span className="mono">/games</span>), fe'l har xil — server har safar boshqa ish qiladi. Endi har birini alohida o'rganamiz.</>, ru: <>Это — <b>HTTP-глаголы</b>. Адрес один (<span className="mono">/games</span>), глаголы разные — и сервер каждый раз делает разную работу. Теперь разберём каждый по отдельности.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — POST (posilka endi teskari uchadi + 2-argument) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [phase, setPhase] = useState(storedAnswer ? 2 : 0); // 0 idle, 1 uchmoqda, 2 yetib bordi
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const done = phase >= 2;
  useEffect(() => () => clearTimeout(timer.current), []);
  const send = () => {
    if (running) return;
    clearTimeout(timer.current); setRunning(true); setPhase(1);
    timer.current = setTimeout(() => { setPhase(2); setRunning(false); }, 1000);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's3', text: `O'tgan darsda posilka — ya'ni ma'lumot to'plami — serverdan sizga kelardi. Endi teskarisi: o'yiningizni siz serverga yuborasiz. Buning uchun fetch'ga ikkinchi qism — sozlamalar qutisi qo'shiladi, ichida fe'l: method POST. Posilkani yuborib, uning yo'lini kuzating.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow="POST" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Posilkani yuboring', ru: 'Отправьте посылку' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ma'lumot posilkasi endi <span className="italic" style={{ color: T.accent }}>qaysi tomonga</span> uchadi?</>, ru: <>В какую сторону теперь <span className="italic" style={{ color: T.accent }}>летит</span> посылка с данными?</> })}</h2></div>
        <Mentor>{tr({ uz: <>O'tgan darsda ofitsiant taomni <b style={{ color: T.ink }}>olib kelardi</b> (GET). Endi teskarisi — <b style={{ color: T.ink }}>siz serverga jo'natasiz</b>: fetch'ga ikkinchi qism, <b style={{ color: T.ink }}>sozlamalar qutisi</b> qo'shiladi, ichida fe'l — <span className="mono">method: 'POST'</span>.</>, ru: <>На прошлом уроке официант <b style={{ color: T.ink }}>приносил</b> блюдо (GET). Теперь наоборот — <b style={{ color: T.ink }}>Вы отправляете на сервер</b>: к fetch добавляется вторая часть, <b style={{ color: T.ink }}>коробка настроек</b>, а внутри глагол — <span className="mono">method: 'POST'</span>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Taqqoslang', ru: 'Сравните' })}</p>
            <pre className="code-box fade-up delay-1" style={{ lineHeight: 2 }}>
              <Cm>{tr({ uz: "// o'tgan dars — olish:", ru: '// прошлый урок — получить:' })}</Cm>{'\n'}
              {'fetch(url)'}{'\n\n'}
              <Cm>{tr({ uz: '// bugun — yuborish:', ru: '// сегодня — отправить:' })}</Cm>{'\n'}
              {'fetch(url, '}<span style={{ borderRadius: 6, padding: '2px 5px', background: 'rgba(255,79,40,0.18)', boxShadow: `inset 0 0 0 1px ${T.accent}` }}>{'{ '}<At>method</At>{': '}<St>'POST'</St>{' }'}</span>{')'}
            </pre>
            <button className="btn fade-up delay-2" style={{ alignSelf: 'flex-start' }} onClick={send} disabled={running}>{running ? tr({ uz: "Yo'lda…", ru: 'В пути…' }) : (done ? tr({ uz: '📦 Yana yuborish', ru: '📦 Отправить ещё раз' }) : tr({ uz: '📦 POST yuborish', ru: '📦 Отправить POST' }))}</button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ikkinchi qism — <b>sozlamalar qutisi</b> <span className="mono">{'{ }'}</span>: fetch'ga "qanday borish"ni aytadi. <span className="mono">method: 'POST'</span> = "olib kelma — <b>olib bor</b>".</>, ru: <>Вторая часть — <b>коробка настроек</b> <span className="mono">{'{ }'}</span>: она говорит fetch, «как идти». <span className="mono">method: 'POST'</span> = «не приноси — <b>отнеси</b>».</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Posilka yo'li", ru: 'Путь посылки' })}</p>
            <div className="fade-up delay-2" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '10px 8px', borderRadius: 12, background: T.paper, boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.14)` }}>
                <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'SIZ', ru: 'ВЫ' })}</p>
                <p className="mono small" style={{ margin: '4px 0 0', color: T.ink }}>Robo Race</p>
              </div>
              <div style={{ position: 'relative', width: 64, height: 28, flexShrink: 0 }}>
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3, fontSize: 15 }}>→</span>
                {phase === 1 && <span className="fly-right" style={{ position: 'absolute', left: 0, top: 1, fontSize: 19 }}>📦</span>}
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '10px 8px', borderRadius: 12, background: phase >= 2 ? T.successSoft : T.paper, boxShadow: phase >= 2 ? `inset 0 0 0 1.5px ${T.success}` : `0 4px 12px -6px rgba(${T.shadowBase},0.14)`, transition: 'all 0.35s' }}>
                <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'SERVER', ru: 'СЕРВЕР' })}</p>
                <p className="mono small" style={{ margin: '4px 0 0', color: phase >= 2 ? T.success : T.ink3 }}>{phase >= 2 ? tr({ uz: 'qabul qildi ✓', ru: 'принял ✓' }) : tr({ uz: 'kutmoqda…', ru: 'ждёт…' })}</p>
              </div>
            </div>
            <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'robo-api.uz — jadval', ru: 'robo-api.uz — таблица' })}</p>
            <div className="code-box" style={{ padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <SrvRow id={1} name="Adopt Me!" />
              <SrvRow id={2} name="Doors" />
              <SrvRow id={3} name="Piggy" />
              {phase >= 2 && <SrvRow id={4} name="Robo Race" state="new" extra={tr({ uz: '+ yangi', ru: '+ новое' })} />}
            </div>
            {done && <span className="tagpill fade-step" style={{ color: T.success }}>{tr({ uz: '✓ POST — serverda YANGI qator paydo qildi', ru: '✓ POST — на сервере появилась НОВАЯ строка' })}</span>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 (qo'shish uchun qaysi fe'l?) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    questionText={tr({ uz: "Serverga YANGI ma'lumot qo'shish uchun qaysi so'rov ishlatiladi?", ru: 'Какой запрос добавляет на сервер НОВЫЕ данные?' })}
    audioText="Serverga yangi ma'lumot qo'shish uchun qaysi so'rov ishlatiladi? To'g'ri javobni tanlang."
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Serverga <span className="italic" style={{ color: T.accent }}>yangi ma'lumot qo'shish</span> uchun qaysi so'rov?</>, ru: <>Какой запрос <span className="italic" style={{ color: T.accent }}>добавляет новые данные</span> на сервер?</> })}</h2></>}
    options={[tr({ uz: "GET — u hamma ishni qiladi", ru: 'GET — он делает всю работу' }), tr({ uz: "POST — yangi yozuv yaratadi", ru: 'POST — создаёт новую запись' }), tr({ uz: "Sahifani yangilash kifoya", ru: 'Достаточно обновить страницу' }), tr({ uz: "DELETE — u yozuvni o'chiradi", ru: 'DELETE — он удаляет запись' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! POST = qo'shish. fetch(url, { method: 'POST', … }) — ikkinchi qismdagi fe'l serverga 'yangi yozuv yarat' deydi.", ru: "Верно! POST = добавить. fetch(url, { method: 'POST', … }) — глагол во второй части говорит серверу: «создай новую запись»." })}
    explainWrong={{
      0: tr({ uz: "Hook'ni eslang: GET yubordingiz — o'yiningiz katalogga chiqmadi. GET faqat O'QIYDI.", ru: 'Вспомните начало урока: Вы отправили GET — игра в каталоге не появилась. GET только ЧИТАЕТ.' }),
      2: tr({ uz: "Yangilash faqat bor narsani qayta ko'rsatadi. Serverda yo'q narsa paydo bo'lmaydi.", ru: 'Обновление лишь заново показывает то, что есть. То, чего нет на сервере, не появится.' }),
      3: tr({ uz: "DELETE — aksincha, o'chiradi! Qo'shish uchun POST.", ru: 'DELETE — наоборот, удаляет! Для добавления — POST.' }),
      default: tr({ uz: "Qo'shish = POST. Fe'l sozlamalar qutisida yoziladi: { method: 'POST' }.", ru: "Добавить = POST. Глагол пишется в коробке настроек: { method: 'POST' }." })
    }} />
);

// ===== SCREEN 5 — BODY + JSON.stringify (posilkaning yuki) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const NAMES = ['Robo Race', 'Super Kart', 'Pixel Quest'];
  const EMOJIS = ['🤖', '🏎️', '🐉'];
  const [name, setName] = useState(storedAnswer ? 'Robo Race' : null);
  const [emoji, setEmoji] = useState(storedAnswer ? '🤖' : null);
  const done = !!(name && emoji);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's5', text: `O'yiningiz posilkaning qaysi qismiga joylanadi? Sozlamalar qutisidagi body xonasiga — bu posilkaning yuki. Lekin server obyektni tushunmaydi, unga JSON matn kerak. JSON.stringify obyektni matnga aylantiradi — bu tarjimon. O'yiningizni tanlab, kod qanday yig'ilishini kuzating.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow="Body" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Posilkani yig'ing", ru: 'Соберите посылку' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'yiningiz posilkaning <span className="italic" style={{ color: T.accent }}>qaysi qismiga</span> joylanadi?</>, ru: <>В <span className="italic" style={{ color: T.accent }}>какую часть</span> посылки кладётся Ваша игра?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Sozlamalar qutisida yana bir xona bor: <b style={{ color: T.ink }}>body — posilka yuki</b>. Lekin server obyektni tushunmaydi — unga <b style={{ color: T.ink }}>JSON matn</b> kerak. Tarjimon: <span className="mono">JSON.stringify()</span>. <b style={{ color: T.ink }}>headers</b> esa serverga ma'lumot JSON ekanini aytadi. O'yiningizni tanlab, kod qanday yig'ilishini kuzating.</>, ru: <>В коробке настроек есть ещё одна комната: <b style={{ color: T.ink }}>body — груз посылки</b>. Но сервер не понимает объект — ему нужен <b style={{ color: T.ink }}>JSON-текст</b>. Переводчик: <span className="mono">JSON.stringify()</span>. А <b style={{ color: T.ink }}>headers</b> сообщает серверу, что данные — это JSON. Выберите свою игру и смотрите, как собирается код.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">name</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {NAMES.map(v => <button key={v} className="gchip" style={name === v ? { background: T.accent, color: '#fff' } : undefined} onClick={() => setName(v)}>{v}</button>)}
            </div>
            <p className="flow-label" style={{ marginTop: 2 }}>emoji</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {EMOJIS.map(v => <button key={v} className="gchip" style={emoji === v ? { background: T.accent } : undefined} onClick={() => setEmoji(v)}>{v}</button>)}
            </div>
            <pre className="code-box fade-up delay-2" style={{ lineHeight: 1.95 }}>
              <Jx>{'const'}</Jx>{' yangi = { name: '}{name ? <St>'{name}'</St> : <Cm>?</Cm>}{', emoji: '}{emoji ? <St>'{emoji}'</St> : <Cm>?</Cm>}{' };'}{'\n\n'}
              {'fetch(url, {'}{'\n'}
              {'  '}<At>method</At>{': '}<St>'POST'</St>{','}{'\n'}
              {'  '}<At>headers</At>{": { 'Content-Type': 'application/json' },"}{'\n'}
              {'  '}<span style={{ borderRadius: 6, padding: '1px 5px', background: done ? 'rgba(31,122,77,0.14)' : 'rgba(255,255,255,0.06)' }}><At>body</At>{': JSON.stringify(yangi)'}</span>{'\n'}
              {'});'}
            </pre>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Tarjimon ikki tomonga ishlaydi', ru: 'Переводчик работает в обе стороны' })}</p>
            <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px', borderRadius: 12, background: T.paper, boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.14)` }}>
                <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: T.blue, minWidth: 72 }}>{tr({ uz: 'KELISHDA', ru: 'НА ВХОДЕ' })}</span>
                <span style={{ fontSize: 12.5, color: T.ink }}><span className="mono">res.json()</span> — {tr({ uz: 'JSON matn → massiv', ru: 'JSON-текст → массив' })}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px', borderRadius: 12, background: T.paper, boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.14)` }}>
                <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: T.success, minWidth: 72 }}>{tr({ uz: 'KETISHDA', ru: 'НА ВЫХОДЕ' })}</span>
                <span style={{ fontSize: 12.5, color: T.ink }}><span className="mono">JSON.stringify()</span> — {tr({ uz: 'obyekt → JSON matn', ru: 'объект → JSON-текст' })}</span>
              </div>
            </div>
            <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'Posilka ichi', ru: 'Внутри посылки' })} {done ? tr({ uz: '— tayyor', ru: '— готово' }) : ''}</p>
            <div className="code-box" style={{ padding: '10px 13px', minHeight: 52 }}>
              {done
                ? <TLine out={<span className="el-in" style={{ display: 'inline-block', color: CODE.str }}>{`'{"name":"${name}","emoji":"${emoji}"}'`}</span>} />
                : <TLine out={<span style={{ color: CODE.comment, fontStyle: 'italic' }}>{tr({ uz: 'name va emoji tanlang…', ru: 'выберите name и emoji…' })}</span>} />}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Tanish ko'rinishmi? O'tgan darsda javob <b>shunday matn</b> bo'lib kelardi! Endi siz ham serverga <b>o'sha tilda</b> yozyapsiz. <span className="mono">stringify</span> = "matnga aylantir".</>, ru: <>Знакомо выглядит? На прошлом уроке ответ приходил <b>именно таким текстом</b>! Теперь и Вы пишете серверу <b>на том же языке</b>. <span className="mono">stringify</span> = «преврати в текст».</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5b — TEST 2 (JSON.stringify nima qiladi?) =====
const Screen5b = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv', ru: 'Проверка' })}
    questionText={tr({ uz: "JSON.stringify(yangi) nima qiladi?", ru: 'Что делает JSON.stringify(yangi)?' })}
    audioText="JSON.stringify(yangi) nima qiladi? To'g'ri javobni tanlang."
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Mustahkamlash', ru: 'Закрепление' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <><span className="mono" style={{ color: T.accent }}>JSON.stringify(yangi)</span> nima qiladi?</>, ru: <>Что делает <span className="mono" style={{ color: T.accent }}>JSON.stringify(yangi)</span>?</> })}</h2></>}
    options={[tr({ uz: "O'yinni darhol katalogga chizadi", ru: 'Сразу рисует игру в каталоге' }), tr({ uz: "Obyektda xato bor-yo'qligini tekshiradi", ru: 'Проверяет объект на ошибки' }), tr({ uz: "Obyektni JSON matnga aylantiradi", ru: 'Превращает объект в JSON-текст' }), tr({ uz: "Serverdan javob olib keladi", ru: 'Приносит ответ с сервера' })]} correctIdx={2}
    explainCorrect={tr({ uz: "To'g'ri! Server obyektni emas, JSON matnni tushunadi. stringify — 'matnga aylantir': obyektdan JSON matn yasaydi. Bu .json()ning teskarisi.", ru: 'Верно! Сервер понимает не объект, а JSON-текст. stringify — «преврати в текст»: делает из объекта JSON-текст. Это операция, обратная .json().' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — chizish React'ning ishi. stringify faqat tarjima qiladi: obyekt → matn.", ru: 'Нет — рисовать это работа React. stringify только переводит: объект → текст.' }),
      1: tr({ uz: "Yo'q — u tekshirmaydi, aylantiradi. Obyektdan JSON matn yasaydi.", ru: 'Нет — он не проверяет, а превращает. Делает из объекта JSON-текст.' }),
      3: tr({ uz: "Bu .json()ning ishi — KELGAN javobni o'girish. stringify esa KETAYOTGAN yukni o'giradi.", ru: 'Это работа .json() — переводить ПРИШЕДШИЙ ответ. А stringify переводит УХОДЯЩИЙ груз.' }),
      default: tr({ uz: "stringify = obyektni JSON matnga aylantirish, body shu matn bilan uchadi.", ru: 'stringify = превратить объект в JSON-текст; body летит именно с этим текстом.' })
    }} />
);

// ===== SCREEN 6 — TO'LIQ PARVOZ (stringify → POST → 201 → katalog) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? 4 : 0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const done = step >= 4;
  useEffect(() => () => clearInterval(timer.current), []);
  const run = () => {
    if (running) return;
    clearInterval(timer.current); setRunning(true); setStep(0);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1; setStep(i);
      if (i >= 4) { clearInterval(timer.current); setRunning(false); }
    }, 950);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const hl = (z) => ({ borderRadius: 6, padding: '1px 5px', display: 'inline-block', background: running && step === z ? 'rgba(255,79,40,0.22)' : (step >= z && step >= 4 ? 'rgba(31,122,77,0.12)' : (step > z ? 'rgba(31,122,77,0.12)' : 'transparent')), transition: 'all 0.3s' });
  const STEPS = [
    { z: 1, t: tr({ uz: "Yuk tayyorlandi — stringify matnga o'girdi", ru: 'Груз готов — stringify перевёл его в текст' }) },
    { z: 2, t: tr({ uz: "POST uchdi — posilka serverga yo'lda", ru: 'POST полетел — посылка в пути к серверу' }) },
    { z: 3, t: tr({ uz: 'Server qabul qildi — 201 Created', ru: 'Сервер принял — 201 Created' }) },
    { z: 4, t: tr({ uz: 'Katalog yangilandi — kartochka paydo', ru: 'Каталог обновился — карточка появилась' }) }
  ];
  const audio = useAudio([{ id: 's6', text: `Posilka serverga yetib borganini qayerdan bilamiz? Server javob qaytaradi. To'liq parvoz to'rt qadam: obyekt JSON matnga qadoqlanadi, POST bilan uchadi, server 201 Created qaytaradi — "yangi yozuv yaratildi" degani — va kartochka katalogda paydo bo'ladi. Tugmani bosib, to'rt qadamni kuzating.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Parvoz', ru: 'Полёт' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Posilkani kuzating', ru: 'Проследите за посылкой' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Posilka serverga yetib borganini <span className="italic" style={{ color: T.accent }}>qayerdan bilamiz</span>?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>узнать</span>, что посылка долетела до сервера?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Server javob qaytaradi! GET'da <b style={{ color: T.ink }}>200 OK</b> kelardi. POST muvaffaqiyatli bo'lsa — <b style={{ color: T.ink }}>201 Created</b>: "yangi yozuv yaratildi" degani. ▶ bosib, posilkaning to'liq parvozini kuzating.</>, ru: <>Сервер отвечает! На GET приходил <b style={{ color: T.ink }}>200 OK</b>. Если POST успешен — <b style={{ color: T.ink }}>201 Created</b>: значит «новая запись создана». Нажмите ▶ и проследите весь полёт посылки.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <button className="btn fade-up delay-1" style={{ alignSelf: 'flex-start' }} onClick={run} disabled={running}>{running ? tr({ uz: 'Parvozda…', ru: 'В полёте…' }) : (done ? tr({ uz: '↻ Yana kuzatish', ru: '↻ Посмотреть ещё раз' }) : tr({ uz: '▶ Posilkani uchirish', ru: '▶ Запустить посылку' }))}</button>
            <pre className="code-box fade-up delay-2" style={{ lineHeight: 1.95 }}>
              <span style={hl(1)}><Jx>{'const'}</Jx>{' yangi = { name: '}<St>'Robo Race'</St>{' };'}</span>{'\n\n'}
              <span style={hl(2)}>{'fetch('}<St>'https://robo-api.uz/games'</St>{', {'}</span>{'\n'}
              <span style={hl(2)}>{'  '}<At>method</At>{': '}<St>'POST'</St>{','}</span>{'\n'}
              <span style={hl(1)}>{'  '}<At>body</At>{': JSON.stringify(yangi)'}</span>{'\n'}
              {'})'}{'\n'}
              <span style={hl(3)}>{'  .then(res => res.json())'}</span>{'\n'}
              <span style={hl(4)}>{'  .then(data => setGames([...games, data]));'}</span>
            </pre>
          </Col>
          <Col>
            <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STEPS.map(s => (
                <div key={s.z} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 12px', borderRadius: 11, background: step >= s.z ? T.successSoft : T.paper, boxShadow: running && step === s.z ? `inset 0 0 0 1.5px ${T.accent}` : (step >= s.z ? `inset 0 0 0 1.5px ${T.success}` : `0 4px 12px -6px rgba(${T.shadowBase},0.14)`), transition: 'all 0.35s' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 11.5, color: step >= s.z ? T.success : T.ink3 }}>{step >= s.z ? '✓' : s.z}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12.5, color: step >= s.z ? T.ink : T.ink3, transition: 'color 0.35s' }}>{s.t}</span>
                </div>
              ))}
            </div>
            <div className="code-box" style={{ padding: '9px 13px', minHeight: 38 }}>
              {step >= 3
                ? <TLine out={<span className="el-in" style={{ display: 'inline-block' }}><span style={{ color: VERBS.POST.col, fontWeight: 700 }}>POST</span> /games → <span style={{ color: CODE.str }}>201 Created ✓</span></span>} />
                : <TLine out={<span style={{ color: CODE.comment, fontStyle: 'italic' }}>{step >= 2 ? tr({ uz: "posilka yo'lda…", ru: 'посылка в пути…' }) : tr({ uz: 'konsol kutmoqda…', ru: 'консоль ждёт…' })}</span>} />}
            </div>
            <Win title="robo-games — localhost:5173" minH={86}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <RoCard name="Adopt Me!" />
                <RoCard name="Doors" />
                {step >= 4 ? <div className="el-in"><RoCard name="Robo Race" emoji="🤖" likes={100} /></div> : <div style={{ borderRadius: 12, border: `1.5px dashed ${T.ink3}`, minHeight: 86 }} />}
              </div>
            </Win>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — ID (server siznikini qanday topadi?) =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const ROWS = [{ id: 1, name: 'Adopt Me!' }, { id: 2, name: 'Doors' }, { id: 3, name: 'Piggy' }];
  const TASKS = [{ target: 'Doors', id: 2 }, { target: 'Piggy', id: 3 }];
  const [taskIdx, setTaskIdx] = useState(storedAnswer ? 2 : 0);
  const [picked, setPicked] = useState(null);
  const [shakeId, setShakeId] = useState(null);
  const shakeTimer = useRef(null);
  const done = taskIdx >= TASKS.length;
  useEffect(() => () => clearTimeout(shakeTimer.current), []);
  const cur = TASKS[Math.min(taskIdx, TASKS.length - 1)];
  const tap = (id) => {
    if (done) return;
    if (id === cur.id) { setPicked(id); setTimeout(() => { setPicked(null); setTaskIdx(t => t + 1); }, 700); }
    else { clearTimeout(shakeTimer.current); setShakeId(id); shakeTimer.current = setTimeout(() => setShakeId(null), 450); }
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's7', text: `Serverda ko'p yozuv bor — server qaysi birini almashtirishni qayerdan biladi? Har yozuvning aniq raqami — ID — bor. Slesh games hammasini bildiradi, slesh games slesh ikki esa faqat ikkinchi yozuvni. Manzillarni bosib, ular orasidagi farqni ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow="ID" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Manzilni toping (${taskIdx}/2)`, ru: `Найдите адрес (${taskIdx}/2)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Server minglab o'yindan <span className="italic" style={{ color: T.accent }}>keraklisini</span> qanday topadi?</>, ru: <>Как сервер находит <span className="italic" style={{ color: T.accent }}>нужную</span> игру среди тысяч?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har yozuvning <b style={{ color: T.ink }}>ID</b>si bor — pasport raqami kabi. Bitta yozuv ustida ishlash uchun ID <b style={{ color: T.ink }}>manzilga qo'shiladi</b>: <span className="mono">/games/2</span>. Topshiriq: kerakli o'yinning manzilini toping.</>, ru: <>У каждой записи есть <b style={{ color: T.ink }}>ID</b> — как номер паспорта. Чтобы работать с одной записью, ID <b style={{ color: T.ink }}>добавляется к адресу</b>: <span className="mono">/games/2</span>. Задание: найдите адрес нужной игры.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'robo-api.uz — jadval', ru: 'robo-api.uz — таблица' })}</p>
            <div className="code-box fade-up delay-1" style={{ padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {ROWS.map(r => <SrvRow key={r.id} id={r.id} name={r.name} state={!done && cur.target === r.name ? 'read' : null} extra={!done && cur.target === r.name ? tr({ uz: '← shu kerak', ru: '← нужна эта' }) : null} />)}
            </div>
            {!done
              ? <div className="sk-info" key={taskIdx}><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Topshiriq {taskIdx + 1}/2: <b>{cur.target}</b> ustida ishlamoqchimiz. Qaysi manzilga so'rov yuboramiz?</>, ru: <>Задание {taskIdx + 1}/2: работаем с <b>{cur.target}</b>. На какой адрес отправим запрос?</> })}</p></div>
              : <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>ID — yozuvning aniq manzili. <span className="mono">/games</span> = hammasi, <span className="mono">/games/2</span> = faqat 2-yozuv. PUT va DELETE <b>doim ID bilan</b> ishlaydi.</>, ru: <>ID — точный адрес записи. <span className="mono">/games</span> = все, <span className="mono">/games/2</span> = только запись 2. PUT и DELETE работают <b>всегда с ID</b>.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Manzilni tanlang', ru: 'Выберите адрес' })}</p>
            <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ROWS.map(r => (
                <button key={r.id} className={`gchip ${shakeId === r.id ? 'shake' : ''}`} onClick={() => tap(r.id)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, padding: '10px 14px', justifyContent: 'flex-start', background: picked === r.id ? T.success : undefined, color: picked === r.id ? '#fff' : undefined }}>
                  robo-api.uz/games/<b>{r.id}</b>
                </button>
              ))}
            </div>
            {done && <span className="tagpill fade-step" style={{ color: T.success }}>{tr({ uz: '✓ 2/2 — manzil + ID = aniq nishon', ru: '✓ 2/2 — адрес + ID = точная цель' })}</span>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — PUT (xato nomni almashtirish) =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [found, setFound] = useState(!!storedAnswer);
  const [fixed, setFixed] = useState(!!storedAnswer);
  const [shakeId, setShakeId] = useState(null);
  const shakeTimer = useRef(null);
  const done = fixed;
  useEffect(() => () => clearTimeout(shakeTimer.current), []);
  const ROWS = [{ id: 1, name: 'Adopt Me!' }, { id: 2, name: 'Doors' }, { id: 4, name: 'Robo Rase' }];
  const tapRow = (id) => {
    if (found) return;
    if (id === 4) setFound(true);
    else { clearTimeout(shakeTimer.current); setShakeId(id); shakeTimer.current = setTimeout(() => setShakeId(null), 450); }
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's8', text: `Bir o'yin nomini o'zgartirmoqchisiz — qaysi fe'l kerak? PUT mavjud yozuvni butunlay almashtiradi, lekin doim ID bilan — server qaysi yozuvni almashtirishini bilishi kerak. Avval o'zgartiriladigan yozuvni toping, keyin PUT'ni yuboring.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow="PUT" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : (found ? { uz: 'PUT yuboring', ru: 'Отправьте PUT' } : { uz: 'Xato yozuvni toping', ru: 'Найдите запись с ошибкой' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Serverdagi xatoni qanday <span className="italic" style={{ color: T.accent }}>tuzatamiz</span>?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>исправить</span> ошибку на сервере?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Voy — o'yiningizni shoshilib yuboribsiz: nomida xato bor! O'chirib qayta qo'shish shartmas — <b style={{ color: T.ink }}>PUT</b> mavjud yozuvni yangisiga <b style={{ color: T.ink }}>almashtiradi</b>. Roblox o'yinlari har hafta UPDATE oladi — bu o'sha kuch. Avval xato yozuvni jadvaldan toping.</>, ru: <>Ой — Вы отправили игру второпях: в названии ошибка! Удалять и добавлять заново не нужно — <b style={{ color: T.ink }}>PUT</b> <b style={{ color: T.ink }}>заменяет</b> существующую запись новой. Игры Roblox каждую неделю получают UPDATE — это та самая сила. Сначала найдите ошибочную запись в таблице.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'robo-api.uz — jadval', ru: 'robo-api.uz — таблица' })} {found ? '' : tr({ uz: '(xatoni bosing)', ru: '(нажмите на ошибку)' })}</p>
            <div className="code-box fade-up delay-1" style={{ padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {ROWS.map(r => (
                <div key={r.id} className={shakeId === r.id ? 'shake' : ''} onClick={() => tapRow(r.id)} style={{ cursor: found ? 'default' : 'pointer' }}>
                  <SrvRow id={r.id} name={r.id === 4 && fixed ? 'Robo Race' : r.name} state={r.id === 4 ? (fixed ? 'changed' : (found ? 'read' : null)) : null} extra={r.id === 4 ? (fixed ? tr({ uz: 'almashtirildi', ru: 'заменено' }) : (found ? tr({ uz: '← xato!', ru: '← ошибка!' }) : null)) : null} />
                </div>
              ))}
            </div>
            {found && !fixed && (
              <pre className="code-box fade-step" style={{ lineHeight: 1.9 }}>
                {'fetch('}<St>'https://robo-api.uz/games/</St><span style={{ borderRadius: 5, padding: '0 4px', background: 'rgba(255,79,40,0.2)' }}><St>4</St></span><St>'</St>{', {'}{'\n'}
                {'  '}<At>method</At>{': '}<St>'PUT'</St>{','}{'\n'}
                {'  '}<At>body</At>{': JSON.stringify({ name: '}<St>'Robo Race'</St>{' })'}{'\n'}
                {'});'}
              </pre>
            )}
            {found && !fixed && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={() => setFixed(true)}>{tr({ uz: 'PUT yuborish', ru: 'Отправить PUT' })}</button>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Katalogda', ru: 'В каталоге' })}</p>
            <div style={{ maxWidth: 160 }}>
              <RoCard key={fixed ? 'ok' : 'bad'} name={fixed ? 'Robo Race' : 'Robo Rase'} emoji="🤖" likes={100} />
            </div>
            {!found && <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Jadvalda bitta nom <b style={{ color: T.ink }}>xato yozilgan</b> — diqqat bilan o'qing va o'sha qatorni bosing.</>, ru: <>В таблице одно название <b style={{ color: T.ink }}>написано с ошибкой</b> — внимательно прочитайте и нажмите на эту строку.</> })}</p></div>}
            {found && !fixed && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: '✓ Topdingiz: "Robo Rase"', ru: '✓ Нашли: «Robo Rase»' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>E'tibor bering: manzilda <b>ID bor</b> — <span className="mono">/games/4</span>. PUT aynan shu yozuvni body'dagi yangisiga almashtiradi.</>, ru: <>Обратите внимание: в адресе <b>есть ID</b> — <span className="mono">/games/4</span>. PUT заменит именно эту запись на новую из body.</> })}</p></div>}
            {fixed && (
              <>
                <div className="code-box" style={{ padding: '9px 13px' }}>
                  <TLine out={<span className="el-in" style={{ display: 'inline-block' }}><span style={{ color: VERBS.PUT.col, fontWeight: 700 }}>PUT</span> /games/4 → <span style={{ color: CODE.str }}>{tr({ uz: '200 OK — almashtirildi ✓', ru: '200 OK — заменено ✓' })}</span></span>} />
                </div>
                <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>PUT formulasi: <b>manzil + ID</b> (qaysi yozuv) + <b>body</b> (yangi varianti). Server eskisini olib tashlab, yangisini qo'yadi.</>, ru: <>Формула PUT: <b>адрес + ID</b> (какая запись) + <b>body</b> (новый вариант). Сервер убирает старое и ставит новое.</> })}</p></div>
              </>
            )}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEST 3 (manzildagi ID nima degani?) =====
const Screen9 = (props) => (
  <QuestionScreen {...props} idx={9} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    questionText={tr({ uz: "robo-api.uz/games/7 — bu manzil nima degani?", ru: 'robo-api.uz/games/7 — что означает этот адрес?' })}
    audioText="robo-api.uz slesh games slesh yetti — bu manzil nima degani? To'g'ri javobni tanlang."
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <><span className="mono" style={{ color: T.accent }}>robo-api.uz/games/7</span> — bu manzil nima degani?</>, ru: <><span className="mono" style={{ color: T.accent }}>robo-api.uz/games/7</span> — что означает этот адрес?</> })}</h2></>}
    options={[tr({ uz: "7 ta o'yin olib keladi", ru: 'Принесёт 7 игр' }), tr({ uz: "Katalogning 7-sahifasini ochadi", ru: 'Откроет 7-ю страницу каталога' }), tr({ uz: "7 soniya kutib turadi", ru: 'Подождёт 7 секунд' }), tr({ uz: "ID raqami 7 bo'lgan bitta o'yin", ru: 'Одна игра с ID номер 7' })]} correctIdx={3}
    explainCorrect={tr({ uz: "To'g'ri! Manzil oxiridagi raqam — ID, yozuvning pasport raqami. PUT/DELETE shu aniq yozuvga qaratiladi.", ru: 'Верно! Число в конце адреса — ID, «номер паспорта» записи. PUT/DELETE нацеливаются именно на эту запись.' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — soni emas, manzili. /games hammasi bo'lardi, /games/7 esa faqat bittasi.", ru: 'Нет — это не количество, а адрес. /games — все записи, /games/7 — только одна.' }),
      1: tr({ uz: "Yo'q — bu sahifa emas, serverdagi yozuvning raqami.", ru: 'Нет — это не страница, а номер записи на сервере.' }),
      2: tr({ uz: "Yo'q — vaqtga aloqasi yo'q. 7 — yozuvning ID raqami.", ru: 'Нет — время тут ни при чём. 7 — это ID записи.' }),
      default: tr({ uz: "/games/7 = ID'si 7 bo'lgan bitta yozuv. PUT va DELETE shunga ishlaydi.", ru: '/games/7 = одна запись с ID 7. PUT и DELETE работают именно так.' })
    }} />
);

// ===== SCREEN 10 — LIKE PERSIST (PUT real hayotda — refresh sinovi) =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [likes, setLikes] = useState(storedAnswer ? 93 : 92);
  const [sent, setSent] = useState(!!storedAnswer);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(!!storedAnswer);
  const timer = useRef(null);
  const done = sent && refreshed;
  useEffect(() => () => clearTimeout(timer.current), []);
  const like = () => {
    if (sent) return;
    setLikes(93); setSent(true);
  };
  const refresh = () => {
    if (!sent || refreshing) return;
    setRefreshing(true); setRefreshed(false);
    timer.current = setTimeout(() => { setRefreshing(false); setRefreshed(true); }, 1300);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's10', text: `O'tgan darsda like bosardingiz, lekin sahifani yangilaganda yo'qolardi — u faqat brauzerda turardi. Endi PUT bilan serverga yozamiz. Like bosing, keyin sahifani yangilang va like'ning saqlanib turganini o'z ko'zingiz bilan ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Serverda saqlanadi', ru: 'Хранится на сервере' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : (sent ? { uz: 'Endi sahifani yangilang', ru: 'Теперь обновите страницу' } : { uz: 'Like bosing', ru: 'Поставьте лайк' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Like bosganingiz nega <span className="italic" style={{ color: T.accent }}>yo'qolib qolmaydi</span>?</>, ru: <>Почему Ваш лайк <span className="italic" style={{ color: T.accent }}>не исчезает</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>State darsini eslang: like faqat <b style={{ color: T.ink }}>xotirada</b> edi — sahifa yangilansa, yo'qolardi. Sirning yechimi: like bosilganda sayt <b style={{ color: T.ink }}>serverga PUT yuboradi</b>. Sinab ko'ring: kartochkadagi <b style={{ color: T.ink }}>👍 ni bosing</b>, keyin sahifani yangilang.</>, ru: <>Вспомните урок про state: лайк жил только <b style={{ color: T.ink }}>в памяти</b> — обновили страницу, и он пропадал. Разгадка секрета: при лайке сайт <b style={{ color: T.ink }}>отправляет PUT на сервер</b>. Проверьте: <b style={{ color: T.ink }}>нажмите 👍</b> на карточке, потом обновите страницу.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ maxWidth: 160, flexShrink: 0 }}>
                {refreshing
                  ? <SkelCard />
                  : <RoCard name="Adopt Me!" likes={likes} onLike={like} />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn-soft" onClick={refresh} disabled={!sent || refreshing}>{tr({ uz: '⟳ Sahifani yangilash', ru: '⟳ Обновить страницу' })} {refreshed ? '✓' : ''}</button>
                {!sent && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: '← avval 👍 ni bosing', ru: '← сначала нажмите 👍' })}</p>}
              </div>
            </div>
            <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'Konsol', ru: 'Консоль' })}</p>
            <div className="code-box" style={{ padding: '10px 13px', minHeight: 64 }}>
              {!sent && <TLine out={<span style={{ color: CODE.comment, fontStyle: 'italic' }}>{tr({ uz: 'like kutilmoqda…', ru: 'ждём лайк…' })}</span>} />}
              {sent && <TLine out={<span className="el-in" style={{ display: 'inline-block' }}><span style={{ color: VERBS.PUT.col, fontWeight: 700 }}>PUT</span> /games/1 {'{ likes: 93 }'} → <span style={{ color: CODE.str }}>200 OK</span></span>} />}
              {refreshing && <TLine out={<span><span style={{ color: VERBS.GET.col, fontWeight: 700 }}>GET</span> /games → <span style={{ color: CODE.comment }}>{tr({ uz: 'yuklanmoqda…', ru: 'загружается…' })}</span></span>} />}
              {refreshed && sent && <TLine out={<span className="el-in" style={{ display: 'inline-block', color: CODE.str }}>{tr({ uz: '✓ serverdan keldi: likes = 93 — saqlanib qolgan!', ru: '✓ пришло с сервера: likes = 93 — сохранилось!' })}</span>} />}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'robo-api.uz — jadval', ru: 'robo-api.uz — таблица' })}</p>
            <div className="code-box fade-up delay-2" style={{ padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <SrvRow id={1} name="Adopt Me!" state={sent ? 'changed' : null} extra={sent ? 'likes: 93' : 'likes: 92'} />
              <SrvRow id={2} name="Doors" extra="likes: 91" />
            </div>
            {sent && !refreshed && !refreshing && <div className="hint fade-step"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Like serverga yozildi. Endi katta sinov: <b style={{ color: T.ink }}>sahifani yangilang</b> — yo'qolarmikan?</>, ru: <>Лайк записан на сервер. Теперь главный тест: <b style={{ color: T.ink }}>обновите страницу</b> — исчезнет ли?</> })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mana farq! Avval: xotirada → yangilansa yo'q. Endi: <b>serverda</b> → istalgan qurilmada, istalgan vaqtda turibdi. Roblox'dagi millionlab like shunday yashaydi.</>, ru: <>Вот и разница! Раньше: в памяти → обновил и нет. Теперь: <b>на сервере</b> → живёт на любом устройстве, в любое время. Миллионы лайков в Roblox живут именно так.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — DELETE (tasdiqlash bilan o'chirish) =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [asking, setAsking] = useState(false);
  const [deleted, setDeleted] = useState(!!storedAnswer);
  const [cancelled, setCancelled] = useState(false);
  const done = deleted;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's11', text: `Katalogdan eski o'yinni qanday olib tashlaysiz? DELETE so'rovi yozuvni butunlay o'chiradi — faqat manzil va ID kerak, body kerak emas, chunki DELETE hech qanday yuk ko'tarmaydi. Eski o'yinni tanlab, o'chirib ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow="DELETE" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Eski o'yinni o'chiring", ru: 'Удалите старую игру' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Keraksiz yozuvni qanday <span className="italic" style={{ color: T.accent }}>olib tashlaymiz</span>?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>убрать</span> ненужную запись?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Jadvalda eski sinov yozuvi qolib ketgan: <b style={{ color: T.ink }}>"test test"</b> (ID 5). Uni <b style={{ color: T.ink }}>DELETE</b> olib tashlaydi. E'tibor bering: body kerak emas — <b style={{ color: T.ink }}>faqat manzil + ID</b>. Lekin ehtiyot bo'ling: DELETE'ni <b style={{ color: T.ink }}>qaytarib bo'lmaydi</b>!</>, ru: <>В таблице осталась старая тестовая запись: <b style={{ color: T.ink }}>«test test»</b> (ID 5). Её уберёт <b style={{ color: T.ink }}>DELETE</b>. Обратите внимание: body не нужен — <b style={{ color: T.ink }}>только адрес + ID</b>. Но будьте осторожны: DELETE <b style={{ color: T.ink }}>нельзя отменить</b>!</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'robo-api.uz — jadval', ru: 'robo-api.uz — таблица' })}</p>
            <div className="code-box fade-up delay-1" style={{ padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <SrvRow id={1} name="Adopt Me!" />
              <SrvRow id={4} name="Robo Race" />
              {!deleted ? <SrvRow id={5} name="test test" state={asking ? 'read' : null} extra={tr({ uz: '← eski sinov', ru: '← старый тест' })} /> : <div className="el-in" style={{ opacity: 0.45 }}><SrvRow id={5} name="test test" state="del" extra={tr({ uz: "o'chirildi", ru: 'удалено' })} /></div>}
            </div>
            <pre className="code-box fade-up delay-2" style={{ lineHeight: 1.9, padding: '10px 14px' }}>
              {'fetch('}<St>'https://robo-api.uz/games/5'</St>{', {'}{'\n'}
              {'  '}<At>method</At>{': '}<St>'DELETE'</St>{'\n'}
              {'});  '}<Cm>{tr({ uz: "// body yo'q — faqat nishon", ru: '// body нет — только цель' })}</Cm>
            </pre>
            {!deleted && !asking && <button className="btn fade-up delay-2" style={{ alignSelf: 'flex-start' }} onClick={() => { setAsking(true); setCancelled(false); }}>{tr({ uz: 'DELETE yuborish', ru: 'Отправить DELETE' })}</button>}
          </Col>
          <Col>
            {asking && !deleted && (
              <div className="frame fade-step" style={{ boxShadow: `inset 0 0 0 1.5px ${VERBS.DELETE.col}, 0 8px 22px -6px rgba(${T.shadowBase},0.2)` }}>
                <p className="note-h" style={{ color: VERBS.DELETE.col }}>{tr({ uz: "Rostdan o'chirilsinmi?", ru: 'Точно удалить?' })}</p>
                <p className="body" style={{ margin: '0 0 12px', color: T.ink }}>{tr({ uz: <>"test test" (ID 5) butunlay o'chadi. Bu amalni <b>qaytarib bo'lmaydi</b>.</>, ru: <>«test test» (ID 5) исчезнет полностью. Это действие <b>нельзя отменить</b>.</> })}</p>
                <div style={{ display: 'flex', gap: 9 }}>
                  <button className="btn-soft" onClick={() => { setAsking(false); setCancelled(true); }}>{tr({ uz: 'Bekor qilish', ru: 'Отмена' })}</button>
                  <button className="btn" style={{ background: VERBS.DELETE.col }} onClick={() => { setAsking(false); setDeleted(true); }}>{tr({ uz: "Ha, o'chirilsin", ru: 'Да, удалить' })}</button>
                </div>
              </div>
            )}
            {cancelled && !asking && !deleted && <div className="hint fade-step"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "Bekor qildingiz — hech narsa o'zgarmadi. Bu ham muhim ko'nikma! Tayyor bo'lsangiz, yana DELETE yuboring.", ru: 'Вы отменили — ничего не изменилось. Это тоже важный навык! Когда будете готовы, отправьте DELETE ещё раз.' })}</p></div>}
            {!asking && !deleted && !cancelled && <div className="hint fade-up delay-2"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Nega saytlar o'chirishdan oldin doim <b style={{ color: T.ink }}>"Ishonchingiz komilmi?"</b> deb so'raydi? Hozir bilib olasiz.</>, ru: <>Почему сайты перед удалением всегда спрашивают <b style={{ color: T.ink }}>«Вы уверены?»</b> Сейчас узнаете.</> })}</p></div>}
            {deleted && (
              <>
                <div className="code-box" style={{ padding: '9px 13px' }}>
                  <TLine out={<span className="el-in" style={{ display: 'inline-block' }}><span style={{ color: VERBS.DELETE.col, fontWeight: 700 }}>DELETE</span> /games/5 → <span style={{ color: CODE.str }}>{tr({ uz: "200 OK — o'chirildi ✓", ru: '200 OK — удалено ✓' })}</span></span>} />
                </div>
                <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Yozuv ketdi — <b>butunlay</b>. Shuning uchun yaxshi saytlar avval tasdiqlash so'raydi: bitta bosishda baza o'chib ketmasin. Siz ham o'z saytingizda shunday qilasiz.</>, ru: <>Запись исчезла — <b>навсегда</b>. Поэтому хорошие сайты сначала просят подтверждение: чтобы одним кликом не стереть базу. Вы на своём сайте сделаете так же.</> })}</p></div>
              </>
            )}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TEST 4 (to'g'ri fe'l + manzil juftligi) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} idx={12} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    questionText={tr({ uz: "Piggy (ID 3) ni o'chirish uchun to'g'ri so'rov qaysi?", ru: 'Какой запрос правильно удалит Piggy (ID 3)?' })}
    audioText="Piggy — ID uch — ni o'chirish uchun to'g'ri so'rov qaysi? To'g'ri javobni tanlang."
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Piggy (ID 3) ni <span className="italic" style={{ color: T.accent }}>o'chirish</span> uchun to'g'ri so'rov qaysi?</>, ru: <>Какой запрос правильно <span className="italic" style={{ color: T.accent }}>удалит</span> Piggy (ID 3)?</> })}</h2></>}
    options={["DELETE /games/3", tr({ uz: "DELETE /games — hammasiga yuboramiz", ru: 'DELETE /games — отправим всем' }), "POST /games/3", "GET /games/3"]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! Fe'l (DELETE) + aniq nishon (/games/3 — ID). Body kerak emas.", ru: 'Верно! Глагол (DELETE) + точная цель (/games/3 — ID). Body не нужен.' })}
    explainWrong={{
      1: tr({ uz: "Xavfli! ID'siz DELETE — qaysi birini? Butun ro'yxatdan ayrilish mumkin. Doim aniq ID bilan.", ru: 'Опасно! DELETE без ID — какую именно? Можно лишиться всего списка. Всегда с точным ID.' }),
      2: tr({ uz: "POST — qo'shadi, o'chirmaydi. Fe'l noto'g'ri.", ru: 'POST — добавляет, а не удаляет. Глагол не тот.' }),
      3: tr({ uz: "GET — faqat o'qiydi: Piggy ma'lumotini olib keladi, lekin o'chirmaydi.", ru: 'GET — только читает: принесёт данные Piggy, но не удалит.' }),
      default: tr({ uz: "O'chirish = DELETE + ID: DELETE /games/3.", ru: 'Удалить = DELETE + ID: DELETE /games/3.' })
    }} />
);

// ===== SCREEN 13 — YUK JO'NATISH PULTI (Dispatcher Console — 3 posilka gate) =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [stage, setStage] = useState(storedAnswer ? 3 : 0); // 0 POST, 1 PUT, 2 DELETE, 3 done
  const [postFly, setPostFly] = useState(!!storedAnswer);
  const [putShake, setPutShake] = useState(false);
  const [delAsking, setDelAsking] = useState(false);
  const [delDone, setDelDone] = useState(!!storedAnswer);
  const shakeTimer = useRef(null);
  const flyTimer = useRef(null);
  const done = stage >= 3;
  useEffect(() => () => { clearTimeout(shakeTimer.current); clearTimeout(flyTimer.current); }, []);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const POST_ITEMS = [
    { id: 'm', label: "method: 'POST'" },
    { id: 'b', label: 'body:' },
    { id: 'j', label: 'JSON.stringify(yangi)' }
  ];
  const postSolved = () => { setPostFly(true); flyTimer.current = setTimeout(() => setStage(1), 950); };
  const pickAddr = (ok) => {
    if (ok) setStage(2);
    else { clearTimeout(shakeTimer.current); setPutShake(true); shakeTimer.current = setTimeout(() => setPutShake(false), 450); }
  };
  const DEL_LINES = [
    { text: "fetch('https://robo-api.uz/games/5', {" },
    { text: "  method: 'GET',", bug: true },
    { text: "});" }
  ];
  const delFixed = tr({ uz: "  method: 'DELETE'   // fe'l DELETE — body ko'tarmaydi", ru: "  method: 'DELETE'   // глагол DELETE — body не несёт" });
  const confirmDelete = () => { setDelAsking(false); setDelDone(true); setStage(3); };
  const rows = [
    { id: 1, name: 'Adopt Me!' },
    { id: 2, name: stage >= 2 ? 'Doors 2' : 'Doors', state: stage === 2 ? 'changed' : null },
    ...(stage >= 1 ? [{ id: 6, name: tr({ uz: "Yangi o'yin", ru: 'Новая игра' }), state: stage === 1 ? 'new' : null }] : []),
    ...(!delDone ? [{ id: 5, name: 'test test', state: stage === 2 ? 'read' : null }] : [{ id: 5, name: 'test test', state: 'del', extra: tr({ uz: "o'chirildi", ru: 'удалено' }) }])
  ];
  const STAGE_LBL = [tr({ uz: "📦 POST — posilkani yig'ing", ru: '📦 POST — соберите посылку' }), tr({ uz: '✏️ PUT — manzilni tanlang', ru: '✏️ PUT — выберите адрес' }), tr({ uz: '🗑️ DELETE — yorliqni tuzating', ru: '🗑️ DELETE — исправьте ярлык' })];
  const audio = useAudio([{ id: 's13', text: `Endi siz dispetchersiz. Konveyerda uch posilka: biri katalogga qo'shiladi, biri almashtiriladi, biri o'chiriladi. Har biriga to'g'ri yorliq kerak — fe'l, manzil va yuk. Xato yorliq bo'lsa, posilka silkinib qaytadi. Uchtasini to'g'ri jo'nating.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · pult', ru: 'Практика · пульт' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Posilka ${Math.min(stage + 1, 3)}/3`, ru: `Посылка ${Math.min(stage + 1, 3)}/3` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yuk jo'natish <span className="italic" style={{ color: T.accent }}>pulti</span> — 3 posilkani jo'nating.</>, ru: <><span className="italic" style={{ color: T.accent }}>Пульт</span> отправки грузов — отправьте 3 посылки.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Siz — <b style={{ color: T.ink }}>dispetcher</b>. Har posilkaga to'g'ri yorliq kerak: fe'l + manzil + yuk. Uchtasini to'g'ri jo'natmaguncha «Davom» yopiq. Xato yorliq — posilka silkinib qaytadi.</>, ru: <>Вы — <b style={{ color: T.ink }}>диспетчер</b>. Каждой посылке нужен правильный ярлык: глагол + адрес + груз. Пока не отправите все три, «Продолжить» закрыто. Ошибочный ярлык — посылка затрясётся и вернётся.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            {!done
              ? <div className="sk-info" key={stage}><p className="flow-label" style={{ marginBottom: 5 }}>{tr({ uz: 'Posilka', ru: 'Посылка' })} {stage + 1}/3</p><p className="body" style={{ margin: 0, color: T.ink, fontWeight: 600 }}>{STAGE_LBL[stage]}</p></div>
              : <div className="takeaway fade-step"><div className="ta-bulb">🎛️</div><p className="ta-h">{tr({ uz: 'Pult sizniki!', ru: 'Пульт Ваш!' })}</p><p className="ta-sub">Create · Read · Update · Delete — CRUD</p></div>}
            {stage === 0 && !done && (
              <>
                <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: "Chiplarni to'g'ri tartibda yig'ing", ru: 'Соберите чипы в правильном порядке' })}</p>
                <DragDropOrder items={POST_ITEMS} hints={[{ uz: "fe'l", ru: 'глагол' }, { uz: 'yuk kaliti', ru: 'ключ груза' }, { uz: 'qadoqlangan yuk', ru: 'упакованный груз' }]} onSolved={postSolved} />
              </>
            )}
            {stage === 1 && (
              <>
                <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: '"Doors" → "Doors 2" — qaysi manzilga PUT?', ru: '«Doors» → «Doors 2» — на какой адрес PUT?' })}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button className={`gchip ${putShake ? 'shake' : ''}`} onClick={() => pickAddr(false)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, padding: '10px 14px', justifyContent: 'flex-start' }}>robo-api.uz/games</button>
                  <button className="gchip" onClick={() => pickAddr(true)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, padding: '10px 14px', justifyContent: 'flex-start' }}>robo-api.uz/games/<b>2</b></button>
                </div>
                {putShake && <p className="small" style={{ color: T.accent, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "ID'siz — qaysi birini almashtiray? Aniq manzil kerak.", ru: 'Без ID — какую именно заменить? Нужен точный адрес.' })}</p>}
              </>
            )}
            {stage === 2 && !delAsking && (
              <>
                <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'Buzuq yorliqni toping va tuzating', ru: 'Найдите и исправьте сломанный ярлык' })}</p>
                <DebugChallenge lines={DEL_LINES} fixed={delFixed} explain={{ uz: "Fe'l DELETE bo'lishi kerak — GET emas. DELETE body ham ko'tarmaydi.", ru: 'Глагол должен быть DELETE — не GET. И body DELETE не несёт.' }} onSolved={() => setDelAsking(true)} />
              </>
            )}
            {delAsking && (
              <div className="frame fade-step" style={{ boxShadow: `inset 0 0 0 1.5px ${VERBS.DELETE.col}` }}>
                <p className="note-h" style={{ color: VERBS.DELETE.col }}>{tr({ uz: "Rostdan o'chirilsinmi?", ru: 'Точно удалить?' })}</p>
                <p className="body" style={{ margin: '0 0 12px', color: T.ink }}>{tr({ uz: '"test test" (ID 5) butunlay o\'chadi. Qaytarib bo\'lmaydi.', ru: '«test test» (ID 5) исчезнет полностью. Отменить нельзя.' })}</p>
                <div style={{ display: 'flex', gap: 9 }}>
                  <button className="btn-soft" onClick={() => setDelAsking(false)}>{tr({ uz: 'Bekor qilish', ru: 'Отмена' })}</button>
                  <button className="btn" style={{ background: VERBS.DELETE.col }} onClick={confirmDelete}>{tr({ uz: "Ha, o'chirilsin", ru: 'Да, удалить' })}</button>
                </div>
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'robo-api.uz — jadval (jonli)', ru: 'robo-api.uz — таблица (живая)' })}</p>
            <div className="code-box fade-up delay-2" style={{ padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 5, position: 'relative' }}>
              {postFly && stage <= 1 && <span className="fly-right" style={{ position: 'absolute', left: -4, top: 8, fontSize: 18, zIndex: 3 }}>📦</span>}
              {rows.map(r => <SrvRow key={`${r.id}-${r.name}`} id={r.id} name={r.name} state={r.state} extra={r.extra} />)}
            </div>
            <div className="code-box" style={{ padding: '9px 13px', minHeight: 38 }}>
              {done
                ? <TLine out={<span style={{ color: CODE.str }}>{tr({ uz: "✓ 3/3 posilka jo'natildi — CRUD to'liq", ru: '✓ 3/3 посылки отправлены — CRUD полный' })}</span>} />
                : (postFly && stage <= 1)
                  ? <TLine out={<span className="el-in" style={{ display: 'inline-block' }}><span style={{ color: VERBS.POST.col, fontWeight: 700 }}>POST</span> /games → <span style={{ color: CODE.str }}>201 Created ✓</span></span>} />
                  : <TLine out={<span style={{ color: CODE.comment, fontStyle: 'italic' }}>{tr({ uz: `posilka ${stage + 1}/3 kutilmoqda…`, ru: `ждём посылку ${stage + 1}/3…` })}</span>} />}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Sezdingizmi — kod deyarli bir xil: faqat <b>fe'l va ID</b> o'zgaradi. Shu pult bilan istalgan ilovani boshqarasiz.</>, ru: <>Заметили — код почти одинаковый: меняются только <b>глагол и ID</b>. Этим пультом Вы управляете любым приложением.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — VIBECODING (AI bilan to'liq boshqaruv) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const TASKS = [
    { id: 't1', label: tr({ uz: "O'yin qo'shish formasi yasa — tugma bosilganda POST ketsin", ru: 'Сделай форму добавления игры — по кнопке пусть уходит POST' }), plan: [tr({ uz: "Forma: name + emoji uchun input va state", ru: 'Форма: input и state для name + emoji' }), tr({ uz: "Tugmada: fetch POST + body: JSON.stringify(yangi)", ru: 'В кнопке: fetch POST + body: JSON.stringify(yangi)' })], code: <>{'fetch(url, { '}<At>method</At>{': '}<St>'POST'</St>{', '}<At>body</At>{': JSON.stringify(yangi) })'}</> },
    { id: 't2', label: tr({ uz: "Like tugmasi serverda saqlanadigan bo'lsin", ru: 'Пусть лайк сохраняется на сервере' }), plan: [tr({ uz: "onLike ichida PUT yuboraman: /games/ID", ru: 'Внутри onLike отправлю PUT: /games/ID' }), tr({ uz: "body'da yangi likes soni ketadi", ru: 'В body уйдёт новое число likes' })], code: <>{'fetch(url + '}<St>'/'</St>{' + g.id, { '}<At>method</At>{': '}<St>'PUT'</St>{', '}<At>body</At>{': … })'}</> },
    { id: 't3', label: tr({ uz: "O'chirish tugmasi qo'sh — lekin avval tasdiqlash so'rasin", ru: 'Добавь кнопку удаления — но сначала пусть спросит подтверждение' }), plan: [tr({ uz: "Avval confirm: 'Rostdan o'chirilsinmi?'", ru: "Сначала confirm: «Точно удалить?»" }), tr({ uz: "Ha bo'lsa: fetch DELETE /games/ID — body'siz", ru: 'Если да: fetch DELETE /games/ID — без body' })], code: <>{'if (tasdiq) fetch(url + '}<St>'/'</St>{' + g.id, { '}<At>method</At>{': '}<St>'DELETE'</St>{' })'}</> }
  ];
  const [task, setTask] = useState(null);
  const [phase, setPhase] = useState(storedAnswer ? 'done' : 'idle');
  const timer = useRef(null);
  const done = phase === 'done';
  useEffect(() => () => clearTimeout(timer.current), []);
  const choose = (id) => { clearTimeout(timer.current); setTask(id); setPhase('planned'); };
  const approve = () => { clearTimeout(timer.current); setPhase('building'); timer.current = setTimeout(() => setPhase('done'), 1300); };
  const cur = TASKS.find(t => t.id === task) || (storedAnswer ? TASKS[0] : null);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's14', text: `Endi siz fe'llarni bilasiz — shuning uchun agentning kodini tekshira olasiz: to'g'ri fe'l tanlanganmi, body qadoqlanganmi, ID joyidami. Agentga buyruq bering, uning rejasini tasdiqlang, so'ng natijani sinab ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Keyingi qadam · AI', ru: 'Следующий шаг · AI' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Agent bilan ishlab ko'ring", ru: 'Поработайте с агентом' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>To'liq boshqaruvni <span className="italic" style={{ color: T.accent }}>AI bilan</span> saytga qo'shamizmi?</>, ru: <>Добавим на сайт полное управление <span className="italic" style={{ color: T.accent }}>вместе с AI</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Endi siz fe'llarni bilasiz — agent kodini <b style={{ color: T.ink }}>tekshira olasiz</b>: fe'l to'g'rimi, ID bormi, body kerak joyda stringify bormi, DELETE'dan oldin tasdiqlash so'ralganmi. Buyruq bering, rejani tasdiqlang.</>, ru: <>Теперь Вы знаете глаголы — и <b style={{ color: T.ink }}>можете проверять</b> код агента: верный ли глагол, есть ли ID, стоит ли stringify там, где нужен body, спрашивается ли подтверждение перед DELETE. Дайте команду и утвердите план.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "1. Agentga so'z bilan ayting", ru: '1. Скажите агенту словами' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TASKS.map(t => <button key={t.id} className={`chip ${task === t.id ? 'chip-on' : ''}`} onClick={() => choose(t.id)} style={{ justifyContent: 'flex-start', textAlign: 'left' }}>"{t.label}"</button>)}
            </div>
            {!cur && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Yuqoridan bitta buyruqni tanlang', ru: 'Выберите одну команду сверху' })}</p></div>}
            {cur && (
              <div className="ai-card fade-step" key={task || 'stored'}>
                <div className="ai-row"><span className="ai-badge">{tr({ uz: 'Agent', ru: 'Агент' })}</span><span className="ai-bubble">{phase === 'planned' ? tr({ uz: 'Mana rejam — tasdiqlaysizmi?', ru: 'Вот мой план — утверждаете?' }) : (phase === 'building' ? tr({ uz: 'Yozyapman…', ru: 'Пишу…' }) : tr({ uz: 'Bajardim — kodni tekshiring', ru: 'Готово — проверьте код' }))}</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cur.plan.map((p, i) => <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}><span style={{ color: phase === 'planned' ? T.ink3 : T.success }}>{phase === 'planned' ? '○' : '✓'}</span><span style={{ color: T.ink }}>{p}</span></div>)}
                </div>
                {phase === 'planned' && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={approve}>{tr({ uz: 'Rejani tasdiqlash', ru: 'Утвердить план' })}</button>}
                {phase === 'building' && <p className="ai-prompt" style={{ color: T.accent }}>{tr({ uz: 'Kod yozilyapti…', ru: 'Код пишется…' })}</p>}
                {phase === 'done' && <div className="ai-code fade-step"><div className="ai-line ok" style={{ cursor: 'default' }}>{cur.code}</div></div>}
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: '2. Natija — localhost:5173', ru: '2. Результат — localhost:5173' })}</p>
            <Win title="robo-games — localhost:5173" minH={130}>
              {done && cur ? (
                <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cur.id === 't1' && (
                    <>
                      <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11.5, background: T.bg, borderRadius: 7, padding: '6px 10px', color: T.ink2 }}>Robo Race</span>
                        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 11.5, background: T.bg, borderRadius: 7, padding: '6px 10px', color: T.ink2 }}>🤖</span>
                        <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 11, background: T.accent, color: '#fff', borderRadius: 7, padding: '6px 10px' }}>{tr({ uz: "+ Qo'shish", ru: '+ Добавить' })}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                        <RoCard name="Adopt Me!" /><RoCard name="Doors" /><RoCard name="Robo Race" emoji="🤖" likes={100} />
                      </div>
                    </>
                  )}
                  {cur.id === 't2' && (
                    <>
                      <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 13, color: T.ink, margin: 0 }}>{tr({ uz: '👍 bosildi', ru: '👍 нажат' })} <span className="mono small" style={{ color: T.success, fontWeight: 700 }}>{tr({ uz: '→ PUT → serverda', ru: '→ PUT → на сервере' })}</span></p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                        <RoCard name="Adopt Me!" likes={93} /><RoCard name="Doors" /><RoCard name="Piggy" />
                      </div>
                    </>
                  )}
                  {cur.id === 't3' && (
                    <>
                      <div style={{ borderRadius: 9, padding: '8px 11px', background: VERBS.DELETE.soft, fontFamily: "'Manrope',sans-serif", fontSize: 11.5, color: T.ink }}>{tr({ uz: "Rostdan o'chirilsinmi?", ru: 'Точно удалить?' })} <b>{tr({ uz: '[Bekor]', ru: '[Отмена]' })}</b> <b style={{ color: VERBS.DELETE.col }}>{tr({ uz: '[Ha]', ru: '[Да]' })}</b></div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                        <RoCard name="Adopt Me!" /><RoCard name="Doors" /><div style={{ borderRadius: 12, border: `1.5px dashed ${T.ink3}`, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 86 }}><span className="small" style={{ color: T.ink3, fontStyle: 'italic' }}>{tr({ uz: "o'chdi", ru: 'удалено' })}</span></div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{tr({ uz: 'Buyruq bering va rejani tasdiqlang…', ru: 'Дайте команду и утвердите план…' })}</p>
              )}
            </Win>
            {done
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Kodni o'qing: fe'l vaziyatga mosmi, ID aniq nishonga olinganmi, xavfli amal tasdiqlash bilanmi. Agent ishini <b>isbot bilan</b> qabul qildingiz.</>, ru: <>Прочитайте код: подходит ли глагол к ситуации, взята ли точная цель по ID, есть ли подтверждение у опасного действия. Вы приняли работу агента <b>с доказательством</b>.</> })}</p></div>
              : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr({ uz: "Natija shu yerda paydo bo'ladi — keyin uni o'zingiz tekshirasiz.", ru: 'Результат появится здесь — потом Вы сами его проверите.' })}</p>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — DEBUGGING (method yozilmagan → jimgina GET ketgan) =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [picked, setPicked] = useState(storedAnswer ? 'opts' : null);
  const [fixed, setFixed] = useState(!!storedAnswer);
  const found = picked === 'opts';
  const done = fixed;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's15', text: `Kod bor, lekin yozuv serverga ketmayapti — nega? Sozlamalar qutisida biror muhim qism yetishmayapti. Kodni diqqat bilan o'qing, yetishmayotgan qatorni toping va tuzating.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Debugging', ru: 'Дебаггинг' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : (found ? { uz: 'Endi tuzating', ru: 'Теперь исправьте' } : { uz: "Yetishmayotganini toping", ru: 'Найдите, чего не хватает' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI yordam beradi — siz esa <span className="italic" style={{ color: T.accent }}>tekshirasiz</span>.</>, ru: <>AI помогает — а Вы <span className="italic" style={{ color: T.accent }}>проверяете</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI qo'shish kodini yozdi — hammasi joyidaday. Lekin o'yin <b style={{ color: T.ink }}>qo'shilmayapti</b>! Konsolga qarang: biz POST kutgandik, u yerda esa… <b style={{ color: T.ink }}>GET</b>?! Kodda nimadir <b style={{ color: T.ink }}>yetishmayapti</b>. Qaysi qatorda bo'lishi kerak edi?</>, ru: <>AI написал код добавления — вроде всё на месте. Но игра <b style={{ color: T.ink }}>не добавляется</b>! Посмотрите в консоль: мы ждали POST, а там… <b style={{ color: T.ink }}>GET</b>?! В коде чего-то <b style={{ color: T.ink }}>не хватает</b>. В какой строке это должно было быть?</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-2">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: "Qo'shish kodini yozdim:", ru: 'Написал код добавления:' })}</span></div>
              <div className="ai-code">
                <div className={`ai-line ${picked === 'obj' ? 'ok' : ''}`} onClick={() => { if (!found) setPicked('obj'); }}><Jx>{'const'}</Jx>{' yangi = { name: '}<St>'Super Kart'</St>{' };'}</div>
                {!fixed ? (
                  <div className={`ai-line ${found ? 'bad' : ''}`} onClick={() => { if (!found) setPicked('opts'); }}>{'fetch(url, {'}</div>
                ) : (
                  <div className="ai-line ok el-in">{'fetch(url, {'}</div>
                )}
                {fixed && <div className="ai-line ok el-in">{'  '}<At>method</At>{': '}<St>'POST'</St>{',  '}<Cm>{tr({ uz: "// yetishmagan fe'l!", ru: '// недостающий глагол!' })}</Cm></div>}
                <div className={`ai-line ${picked === 'body' ? 'ok' : ''}`} onClick={() => { if (!found) setPicked('body'); }}>{'  '}<At>body</At>{': JSON.stringify(yangi)'}</div>
                <div className={`ai-line ${picked === 'end' ? 'ok' : ''}`} onClick={() => { if (!found) setPicked('end'); }}>{'});'}</div>
              </div>
              {!found && <p className="ai-prompt">{tr({ uz: "Fe'l qayerda yozilishi kerak edi? O'sha qatorni bosing.", ru: 'Где должен был стоять глагол? Нажмите на ту строку.' })}</p>}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={() => setFixed(true)}>{tr({ uz: "🔧 method: 'POST' qo'shish", ru: "🔧 Добавить method: 'POST'" })}</button>}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: 'normal', fontWeight: 600 }}>{tr({ uz: '✓ Tuzatildi — endi server fe\'lni tushunadi!', ru: '✓ Исправлено — теперь сервер понимает глагол!' })}</p>}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Konsol va jadval', ru: 'Консоль и таблица' })}</p>
            <div className="code-box" style={{ padding: '9px 13px' }}>
              {!fixed
                ? <TLine out={<span><span style={{ color: VERBS.GET.col, fontWeight: 700 }}>GET</span> /games → <span style={{ color: CODE.str }}>200 OK</span> <span style={{ color: CODE.comment }}>{tr({ uz: "…lekin hech narsa qo'shilmadi", ru: '…но ничего не добавилось' })}</span></span>} />
                : <TLine out={<span className="el-in" style={{ display: 'inline-block' }}><span style={{ color: VERBS.POST.col, fontWeight: 700 }}>POST</span> /games → <span style={{ color: CODE.str }}>201 Created ✓</span></span>} />}
            </div>
            <div className="code-box" style={{ padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <SrvRow id={1} name="Adopt Me!" />
              <SrvRow id={2} name="Doors" />
              {fixed && <SrvRow id={6} name="Super Kart" state="new" extra={tr({ uz: '+ yangi', ru: '+ новое' })} />}
            </div>
            {!found && (
              (picked === 'obj' || picked === 'body' || picked === 'end')
                ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu qator to'g'ri{picked === 'obj' ? ' — obyekt tayyor' : picked === 'body' ? ' — yuk stringify bilan joyida' : ''}. Lekin sozlamalar qutisida <b>nima yo'q</b>? Konsol GET deyapti…</>, ru: <>Эта строка верная{picked === 'obj' ? ' — объект готов' : picked === 'body' ? ' — груз со stringify на месте' : ''}. Но <b>чего нет</b> в коробке настроек? Консоль говорит GET…</> })}</p></div>
                : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Sir shu yerda: fe'l yozilmasa, fetch <b style={{ color: T.ink }}>jimgina GET yuboradi</b>. GET esa hech narsa qo'shmaydi.</>, ru: <>Секрет вот в чём: если глагол не написан, fetch <b style={{ color: T.ink }}>молча отправляет GET</b>. А GET ничего не добавляет.</> })}</p></div>
            )}
            {found && !fixed && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: '✓ Topdingiz!', ru: '✓ Нашли!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Sozlamalar qutisi ochilgan-u, ichida <b>method yo'q</b>! Fe'lsiz fetch sukut bo'yicha GET ishlatadi. Chapdagi tugma bilan tuzating →</>, ru: <>Коробка настроек открыта, а внутри <b>нет method</b>! Без глагола fetch по умолчанию использует GET. Исправьте кнопкой слева →</> })}</p></div>}
            {fixed && (
              <div className="takeaway fade-step"><div className="ta-bulb">🛠️</div><p className="ta-h">{tr({ uz: "Ko'rinmas xatoni ham topdingiz!", ru: 'Вы нашли даже невидимую ошибку!' })}</p><p className="ta-sub">{tr({ uz: "Konsoldagi fe'lni o'qish — dasturchilar odati", ru: 'Читать глагол в консоли — привычка профессионала' })}</p></div>
            )}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 16 — YAKUNIY (o'z o'yiningizni serverga qo'shing!) =====
const Screen16 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const EMOJIS = ['🤖', '🏎️', '🐉', '⚽', '🎯'];
  const [gname, setGname] = useState(storedAnswer?.gameName || '');
  const [emoji, setEmoji] = useState(storedAnswer?.gameEmoji || '🤖');
  const [value, setValue] = useState(storedAnswer?.picked || '');
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const [loaded, setLoaded] = useState(!!storedAnswer);
  const timer = useRef(null);
  const nameOk = gname.trim().length >= 2;
  const normQ = value.replace(/[\u2018\u2019\u201C\u201D]/g, "'").replace(/"/g, "'");
  const norm = normQ.replace(/\s+/g, '');
  const lineOk = /^method:'POST',$/.test(norm);
  const valid = lineOk && nameOk;
  const hasMethod = /method\s*:/.test(normQ);
  const hasPost = /'POST'/.test(normQ);
  const hasComma = /,\s*$/.test(value.trim());
  const lowerPost = /'(post|Post|pOST)'/.test(normQ);
  const capMethod = /Method|METHOD/.test(value);
  const noQuotes = /method\s*:\s*POST/.test(norm.replace(/'/g, '')) && !hasPost;
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (valid && !passed) {
      setPassed(true);
      onAnswer(screen, { stage: 'final', screenIdx: screen, question: tr({ uz: "O'z o'yiningizni POST bilan serverga qo'shing", ru: 'Добавьте свою игру на сервер через POST' }), studentAnswer: `${gname} | ${value}`, gameName: gname, gameEmoji: emoji, correct: true, firstAttemptCorrect: true, solved: true, picked: value });
      timer.current = setTimeout(() => setLoaded(true), 1100);
    }
  }, [valid]);
  const Ln = ({ n, children }) => (
    <div className="vsc-line"><span className="vsc-ln">{n}</span><span style={{ whiteSpace: 'pre' }}>{children}</span></div>
  );
  const audio = useAudio([{ id: 's16', text: `Kutgan daqiqangiz keldi: o'z o'yiningizga nom va emoji bering, so'ng sozlamalar qutisiga method POST'ni yozing. Tugma bosilishi bilan kartochkangiz katalogda paydo bo'ladi. Endi siz chinakam dasturchi tomonidasiz.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? { uz: 'Davom etish', ru: 'Продолжить' } : (nameOk ? { uz: "Fe'lni yozing", ru: 'Напишите глагол' } : { uz: "O'yiningizga nom bering", ru: 'Дайте игре название' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Va'da qilingan daqiqa: <span className="italic" style={{ color: T.accent }}>o'z o'yiningizni</span> serverga qo'shing.</>, ru: <>Обещанный момент: добавьте <span className="italic" style={{ color: T.accent }}>свою игру</span> на сервер.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Hammasi tayyor: manzil bor, body bor. Avval o'yiningizga <b style={{ color: T.ink }}>nom va emoji</b> bering, keyin VS Code'da yetishmayotgan qatorni yozing: <b style={{ color: T.ink }}>method: 'POST',</b> — fe'l qo'shtirnoqda, KATTA harflarda, oxirida vergul.</>, ru: <>Всё готово: адрес есть, body есть. Сначала дайте игре <b style={{ color: T.ink }}>название и эмодзи</b>, затем впишите в VS Code недостающую строку: <b style={{ color: T.ink }}>method: 'POST',</b> — глагол в кавычках, БОЛЬШИМИ буквами, в конце запятая.</> })}</Mentor>
        <Zoomable>
        <div className="split split-wide">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                value={gname}
                onChange={e => setGname(e.target.value.slice(0, 18))}
                placeholder={tr({ uz: "O'yiningiz nomi…", ru: 'Название Вашей игры…' })}
                spellCheck={false}
                style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13.5, padding: '9px 13px', borderRadius: 10, border: 'none', outline: 'none', background: T.paper, color: T.ink, boxShadow: nameOk ? `inset 0 0 0 1.5px ${T.success}` : `0 4px 12px -6px rgba(${T.shadowBase},0.2)`, width: 170 }}
              />
              {EMOJIS.map(e => <button key={e} className="gchip" style={emoji === e ? { background: T.accent } : undefined} onClick={() => setEmoji(e)}>{e}</button>)}
            </div>
            <div className="vsc fade-up delay-2">
              <div className="vsc-bar">
                <span className="vsc-tab on"><span style={{ color: '#61DAFB' }}>⚛</span> App.jsx <span style={{ color: '#6E7681', marginLeft: 4 }}>×</span></span>
                <span className="vsc-tab">GameCard.jsx</span>
              </div>
              <div className="vsc-body" style={{ fontSize: 'clamp(11px,1.35vw,12px)', lineHeight: 1.82 }}>
                <Ln n={1}><Jx>{'const'}</Jx>{' yangi = { name: '}<St>'{nameOk ? gname : '?'}'</St>{', emoji: '}<St>'{emoji}'</St>{' };'}</Ln>
                <Ln n={2}>{''}</Ln>
                <Ln n={3}>{'fetch('}<St>'https://robo-api.uz/games'</St>{', {'}</Ln>
                <div className="vsc-line">
                  <span className="vsc-ln">4</span>
                  <span style={{ whiteSpace: 'pre' }}>{'  '}</span>
                  <input className={`vsc-input ${lineOk ? 'ok' : ''}`} value={value} onChange={e => setValue(e.target.value)} placeholder="method: 'POST'," spellCheck={false} autoCapitalize="off" autoCorrect="off" style={{ fontSize: 'clamp(11px,1.35vw,12px)' }} />
                </div>
                <Ln n={5}>{'  '}<At>body</At>{': JSON.stringify(yangi)'}</Ln>
                <Ln n={6}>{'});'}</Ln>
              </div>
            </div>
            <div className="fade-up delay-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tagpill" style={{ opacity: hasMethod ? 1 : 0.4 }}>{hasMethod ? '✓' : '1'} {tr({ uz: 'method: — kichik harf', ru: 'method: — строчными' })}</span>
              <span className="tagpill" style={{ opacity: hasPost && !lowerPost ? 1 : 0.4 }}>{hasPost && !lowerPost ? '✓' : '2'} {tr({ uz: "'POST' — katta, qo'shtirnoqda", ru: "'POST' — большими, в кавычках" })}</span>
              <span className="tagpill" style={{ opacity: hasComma ? 1 : 0.4 }}>{hasComma ? '✓' : '3'} {tr({ uz: ', — oxirida vergul', ru: ', — запятая в конце' })}</span>
            </div>
            {lowerPost && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Fe'llar doim <b>KATTA harflarda</b>: <span className="mono">'POST'</span> ('post' emas).</>, ru: <>Глаголы всегда <b>БОЛЬШИМИ буквами</b>: <span className="mono">'POST'</span> (не 'post').</> })}</p></div>}
            {capMethod && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">method</span> — kichik harf bilan yoziladi.</>, ru: <><span className="mono">method</span> пишется со строчной буквы.</> })}</p></div>}
            {noQuotes && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Fe'l — matn: <b>qo'shtirnoq ichida</b> yozing: <span className="mono">'POST'</span></>, ru: <>Глагол — это текст: пишите <b>в кавычках</b>: <span className="mono">'POST'</span></> })}</p></div>}
            {lineOk && !nameOk && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Qator to'g'ri! Endi tepada o'yiningizga <b>nom bering</b> — posilka bo'sh ketmasin.</>, ru: <>Строка верная! Теперь дайте игре <b>название</b> сверху — чтобы посылка не улетела пустой.</> })}</p></div>}
            {passed && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ Posilka yo'lda! Server qabul qilyapti…", ru: '✓ Посылка в пути! Сервер принимает…' })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija — localhost:5173', ru: 'результат — localhost:5173' })}</p>
            <Win title="robo-games — localhost:5173" minH={130}>
              {!passed && <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>{tr({ uz: "4-qator yozilmaguncha o'yiningiz shu yerda paydo bo'lmaydi…", ru: 'Пока не написана строка 4, Ваша игра здесь не появится…' })}</p>}
              {passed && !loaded && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <SkelCard /><SkelCard /><SkelCard />
                </div>
              )}
              {passed && loaded && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>
                  <RoCard name="Adopt Me!" />
                  <RoCard name="Doors" />
                  <div className="el-in" style={{ animationDelay: '0.25s', animationFillMode: 'backwards' }}><RoCard name={gname} emoji={emoji} likes={100} top /></div>
                </div>
              )}
            </Win>
            {passed && loaded && (
              <>
                <div className="code-box" style={{ padding: '9px 13px' }}>
                  <TLine out={<span className="el-in" style={{ display: 'inline-block' }}><span style={{ color: VERBS.POST.col, fontWeight: 700 }}>POST</span> /games → <span style={{ color: CODE.str }}>201 Created ✓</span></span>} />
                </div>
                <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>"<b>{gname}</b>" endi serverda — katalogda hammaga ko'rinadi. O'tgan dars va'dasi <b>bajarildi</b>!</>, ru: <>«<b>{gname}</b>» теперь на сервере — её видят все в каталоге. Обещание прошлого урока <b>выполнено</b>!</> })}</p></div>
              </>
            )}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== 🛠️ JONLI PRAKTIKA (reusable) — o'quvchi VS Code'da bajaradi, ustoz kuzatadi =====
// signal zonasi: <100 test · 100+ arena · 500+ praktika (to'qnashmaydi).
const PRACTICE_BASE = 500;
// Mentor ko'rinishi sloti — "kim bajardi" jonli chiplar paneli. JONLI roli to'ldiradi.
const MentorPracticeStats = ({ live, screen, label }) => {
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        // Praktika signali 500+ zonasida (test <100, arena 100+ bilan to'qnashmaydi)
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ players, doneIds: new Set(rows.map(r => r.player_id)) });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, screen]);
  if (!live || live.mode !== 'mentor') return null;
  // Bo'sh apparat ko'rsatilmaydi: «Yuklanmoqda…» va «0/0 — hech kim qo'shilmagan» joy
  // egallaydi, lekin hech narsa o'rgatmaydi. Birinchi o'quvchi qo'shilgach panel o'zi
  // paydo bo'ladi (har 3 s da yangilanadi) — F-0819-57, PmLesson8:836 dan.
  if (data.players === null || data.players.length === 0) return null;
  const players = data.players;
  const doers = players.filter(p => data.doneIds.has(p.id));
  const waiting = players.filter(p => !data.doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{tr(label || { uz: '👀 Kim bajardi', ru: '👀 Кто выполнил' })} — {doers.length}/{players.length}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {doers.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.successSoft, color: T.success }}>✓ {p.nickname}</span>)}
        {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ opacity: 0.6 }}>⏳ {p.nickname}</span>)}
      </div>
    </div>
  );
};
// O'QUVCHI ko'radigan sinf-holati (45-qonun) — sof O'QISH, ball-relsga yozmaydi.
// PmLesson8:871 dan; yorliqlar tr() da, chunki bu dars UZ+RU.
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
    <div className="done-mini fade-up">
      👥 {tr({ uz: 'Sinfda:', ru: 'В классе:' })} <b>{data.done}</b> {tr({ uz: 'bajardi', ru: 'выполнили' })}
      {doing > 0 && <span className="dm-sub">· ✏️ {doing} {tr({ uz: 'hali bajarmoqda', ru: 'ещё выполняют' })}</span>}
    </div>
  );
};
function ScreenLivePractice({ title, task, checklist, statsLabel, screen, storedAnswer, onAnswer, onNext, onPrev, live }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor'); // mentor topshiriqni BAJARMAYDI — kuzatadi (F-0819-41)
  const [checked, setChecked] = useState(() => new Set());
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const toggle = (i) => setChecked(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; });
  const complete = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: tr(title), solved: true, correct: true, picked: true });
    // JONLI: praktika bajarilgani serverga yoziladi (500+ zona — reytingga aralashmaydi, faqat mentor ko'radi)
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  // JONLI: mentor keyingi sahifaga o'tmaguncha NavNext qulf bo'ladi (optionalLive + LiveGateCtx gate). Hozircha done bo'lsa ochiq.
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={(done || isMentor) ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{isMentor ? tr({ uz: <>O'quvchilar topshiriqni <b style={{ color: T.ink }}>VS Code'da</b> bajarmoqda. Nechtasi tugatgani pastda ko'rinadi — hamma tayyor bo'lgach davom eting.</>, ru: <>Ученики выполняют задание <b style={{ color: T.ink }}>в VS Code</b>. Сколько закончили — видно ниже; продолжайте, когда будут готовы все.</> }) : tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Проходите шаги и отмечайте их. Когда закончите, нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — наставник следит за прогрессом.</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="lp-task fade-up delay-1">
              <div className="lp-task-h"><span className="lp-task-badge">{tr({ uz: 'TOPSHIRIQ', ru: 'ЗАДАНИЕ' })}</span></div>
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr(task)}</p>
            </div>
            <MentorPracticeStats live={_live} screen={screen} label={statsLabel} />
            <StudentPracticePulse live={_live} screen={screen} />
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Bosqichlar — belgilab boring', ru: 'Шаги — отмечайте по мере выполнения' })}</p>
            <div className="lp-steps fade-up delay-2">
              {checklist.map((c, i) => {
                const on = checked.has(i);
                return (
                  <button key={i} className={`lp-step ${on ? 'on' : ''}`} onClick={() => toggle(i)}>
                    <span className="lp-check">{on ? '✓' : i + 1}</span>
                    <span className="lp-step-t">{fmtCode(tr(c))}</span>
                  </button>
                );
              })}
            </div>
            {!isMentor && <button className={`lp-done-btn ${done ? 'is-done' : ''}`} disabled={done} onClick={complete}>
              {done ? tr({ uz: '✓ Bajarildi — ustozni kuting', ru: '✓ Выполнено — ждите наставника' }) : tr({ uz: '✅ Bajardim', ru: '✅ Выполнил' })}
            </button>}
            {done && !isMentor && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Juda yaxshi! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: 'Отлично! Задание выполнено. Наставник проверит и переведёт на следующий шаг.' })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
}

const ScreenPractice1 = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "O'z o'yiningizni serverga jo'nating", ru: 'Отправьте свою игру на сервер' }}
    statsLabel={{ uz: '📤 POST yuborganlar', ru: '📤 Отправили POST' }}
    task={{ uz: "robo-games loyihangizga «O'yin qo'shish» tugmasini qo'shing — bosilganda POST bilan serverga ketsin va katalogda paydo bo'lsin.", ru: 'Добавьте в свой проект robo-games кнопку «Добавить игру» — по нажатию пусть уходит POST на сервер, и игра появляется в каталоге.' }}
    checklist={[
      { uz: "Obyekt tayyorlang: `const yangi = { name, emoji }`", ru: 'Подготовьте объект: `const yangi = { name, emoji }`' },
      { uz: "`fetch(url, { method: 'POST', ... })` yozing", ru: "Напишите `fetch(url, { method: 'POST', ... })`" },
      { uz: "`body: JSON.stringify(yangi)` qo'shing", ru: 'Добавьте `body: JSON.stringify(yangi)`' },
      { uz: "Tugmani bosib, sahifani yangilab — o'yin katalogda ko'rinsin", ru: 'Нажмите кнопку, обновите страницу — игра должна появиться в каталоге' },
    ]} />
);
const ScreenPractice2 = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "🗑 Xavfsiz o'chirish tugmasi", ru: '🗑 Кнопка безопасного удаления' }}
    statsLabel={{ uz: "🗑 O'chirganlar", ru: '🗑 Удалили' }}
    task={{ uz: "Har kartaga 🗑 tugma qo'shing: avval tasdiqlash so'rasin, keyin DELETE bilan serverdan o'chirsin (body'siz).", ru: 'Добавьте каждой карточке кнопку 🗑: сначала пусть спросит подтверждение, потом удалит с сервера через DELETE (без body).' }}
    checklist={[
      { uz: "Avval so'rang: `if (confirm('Rostdan o'chirilsinmi?'))`", ru: "Сначала спросите: `if (confirm('Точно удалить?'))`" },
      { uz: "`fetch(url + '/' + g.id, { method: 'DELETE' })` — body'siz", ru: "`fetch(url + '/' + g.id, { method: 'DELETE' })` — без body" },
      { uz: "ID to'g'riligini tekshiring: /games/ID", ru: 'Проверьте правильность ID: /games/ID' },
      { uz: "Yangilab ko'ring — yozuv qaytmasligi kerak", ru: 'Обновите страницу — запись не должна вернуться' },
    ]} />
);

const REACT_FLASHCARDS = [
  { front: { uz: "Server nima qilishini so'rovning qaysi qismidan biladi?", ru: 'По какой части запроса сервер понимает, что делать?' }, back: { uz: "Fe'l (method)", ru: 'Глагол (method)' }, note: { uz: "GET, POST, PUT, DELETE", ru: 'GET, POST, PUT, DELETE' } },
  { front: { uz: "Katalogga yangi o'yin qo'shish uchun qaysi fe'l kerak?", ru: 'Какой глагол нужен, чтобы добавить в каталог новую игру?' }, back: "POST", note: { uz: "server yangi yozuv yaratadi", ru: 'сервер создаёт новую запись' } },
  { front: { uz: "Mavjud yozuvni almashtirish uchun qaysi fe'l kerak?", ru: 'Какой глагол нужен, чтобы заменить существующую запись?' }, back: "PUT", note: { uz: "doim ID bilan: /games/2", ru: 'всегда с ID: /games/2' } },
  { front: { uz: "Yozuvni butunlay olib tashlash uchun qaysi fe'l kerak?", ru: 'Какой глагол нужен, чтобы полностью убрать запись?' }, back: "DELETE", note: { uz: "manzil va ID yetarli, body kerak emas", ru: 'хватит адреса и ID, body не нужен' } },
  { front: { uz: "Qaysi fe'l faqat o'qiydi va hech narsani o'zgartirmaydi?", ru: 'Какой глагол только читает и ничего не меняет?' }, back: "GET", note: { uz: "o'tgan darsdan tanish: olib keladi", ru: 'знаком с прошлого урока: приносит' } },
  { front: { uz: "Fe'lni fetch'ning qaysi qismiga yozasiz?", ru: 'В какую часть fetch вы пишете глагол?' }, back: { uz: "Sozlamalar qutisiga", ru: 'В коробку настроек' }, note: "fetch(url, { method: 'POST' })" },
  { front: { uz: "Serverga yuborilayotgan ma'lumot qayerda turadi?", ru: 'Где находятся данные, отправляемые на сервер?' }, back: "body", note: { uz: "bu safar posilkani siz jo'natasiz", ru: 'на этот раз посылку отправляете Вы' } },
  { front: { uz: "Obyektni JSON matnga nima aylantiradi?", ru: 'Что превращает объект в JSON-текст?' }, back: "JSON.stringify()", note: { uz: ".json()ning teskarisi", ru: 'обратная операция .json()' } },
  { front: { uz: "PUT va DELETE ishlashi uchun yana nima kerak?", ru: 'Что ещё нужно, чтобы PUT и DELETE сработали?' }, back: "ID", note: { uz: "aks holda server qaysi yozuv ekanini bilmaydi", ru: 'иначе сервер не поймёт, какая это запись' } },
  { front: { uz: "/games va /games/2 nimasi bilan farq qiladi?", ru: 'Чем отличаются /games и /games/2?' }, back: { uz: "Butun ro'yxat va bitta yozuv", ru: 'Весь список и одна запись' }, note: { uz: "/games/2 — 2-raqamli yozuv", ru: '/games/2 — запись под номером 2' } },
  { front: { uz: "201 Created javobi nimani bildiradi?", ru: 'Что означает ответ 201 Created?' }, back: { uz: "Yangi yozuv yaratildi", ru: 'Новая запись создана' }, note: { uz: "POST muvaffaqiyatli o'tdi", ru: 'POST прошёл успешно' } },
  { front: { uz: "To'rt fe'lning umumiy nomi qanday?", ru: 'Каково общее имя четырёх глаголов?' }, back: "CRUD", note: { uz: "Create · Read · Update · Delete", ru: 'Create · Read · Update · Delete' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={REACT_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 17 — YAKUN =====
const Screen17 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  // F-0803-08: uyga vazifa kapsulasi — bosilganda topshiriq kartasi ochiladi
  const [hwOpen, setHwOpen] = useState(false);
  const [hwCharge, setHwCharge] = useState(false);
  const fireHw = () => { if (hwCharge || hwOpen) return; setHwCharge(true); setTimeout(() => { setHwOpen(true); setHwCharge(false); }, 500); };
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
    tr({ uz: "4 fe'l: GET o'qiydi · POST qo'shadi · PUT almashtiradi · DELETE o'chiradi", ru: '4 глагола: GET читает · POST добавляет · PUT заменяет · DELETE удаляет' }),
    tr({ uz: "Fe'l sozlamalar qutisida: fetch(url, { method: 'POST', … })", ru: "Глагол — в коробке настроек: fetch(url, { method: 'POST', … })" }),
    tr({ uz: "Yuk — body: JSON.stringify(obyekt) — .json()ning teskarisi", ru: 'Груз — body: JSON.stringify(объект) — операция, обратная .json()' }),
    tr({ uz: "PUT va DELETE — doim ID bilan: /games/2", ru: 'PUT и DELETE — всегда с ID: /games/2' }),
    tr({ uz: "201 Created = yaratildi; DELETE qaytarilmaydi — avval tasdiqlash", ru: '201 Created = создано; DELETE не отменить — сначала подтверждение' }),
    tr({ uz: "Bularning umumiy nomi — CRUD", ru: 'Общее имя всего этого — CRUD' })
  ];
  const HOMEWORK = [
    { b: tr({ uz: "Qo'shish formasi", ru: 'Форма добавления' }), t: tr({ uz: "— robo-games loyihangizga agent bilan forma qo'shing: nom + emoji → POST bilan serverga ketsin", ru: '— добавьте с агентом форму в свой проект robo-games: название + эмодзи → пусть уходит POST на сервер' }) },
    { b: tr({ uz: 'Jonli like', ru: 'Живой лайк' }), t: tr({ uz: "— like tugmasi PUT yuborsin; sahifani yangilab, saqlanganini tekshiring", ru: '— пусть кнопка лайка отправляет PUT; обновите страницу и проверьте, что он сохранился' }) },
    { b: tr({ uz: "Xavfsiz o'chirish", ru: 'Безопасное удаление' }), t: tr({ uz: "— DELETE tugmasi qo'shing, lekin avval \"Ishonchingiz komilmi?\" so'ralsin", ru: '— добавьте кнопку DELETE, но пусть сначала спрашивает «Вы уверены?»' }) }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const audio = useAudio([{ id: 's17', text: `Tabriklaymiz — server endi sizning buyrug'ingizda! To'liq aylanani yopdingiz: o'qish, qo'shish, almashtirish, o'chirish — bularning umumiy nomi CRUD. Sezdingizmi: kod deyarli bir xil, faqat fe'l va ID o'zgaradi. Keyingi darsda hammasini birlashtirib, o'z ilovangizni qurasiz.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Server endi sizning <span className="italic" style={{ color: T.accent }}>buyrug'ingizda</span>.</>, ru: <>Сервер теперь <span className="italic" style={{ color: T.accent }}>под Вашим командованием</span>.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь Вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul></div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${hwCharge ? 'charging' : ''}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, '--d': `${k.d}s` }}>{tr(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span>
            <span className="hw-big-s">{tr({ uz: 'Amaliy topshiriqni bajarish →', ru: 'Выполнить практическое задание →' })}</span>
          </button>
        </div>
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Antigravity bilan o'z loyihangizda sinang:", ru: 'Попробуйте с Antigravity в своём проекте:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>))}</ul><p className="hw-note">{tr({ uz: "Sizda endi to'liq quvvat bor: React + server + 4 fe'l. Keyingi qadam — hammasini birlashtirib, o'ZINGIZNING ilovangizni qurish! 🚀", ru: 'У Вас теперь полная мощность: React + сервер + 4 глагола. Следующий шаг — соединить всё и построить СВОЁ приложение! 🚀' })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '🏅 Nishonlaringiz', ru: '🏅 Ваши награды' })} — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
              <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={tr(a.desc)}>
                <span className="ach-badge-ic">{got ? a.icon : '🔒'}</span>
                <span className="ach-badge-name">{tr(a.name)}</span>
                {got && <span className="ach-badge-desc">{tr(a.desc)}</span>}
              </div>
            ); })}
          </div>
        </div>}
      </div>
    </Stage>
  );
};

// ===== 🏅 ACHIEVEMENTS (nishonlar) — REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  poster:     { icon: '📮', name: 'Shipped It!',     desc: { uz: "Birinchi POST — serverga yozuv qo'shdingiz", ru: 'Первый POST — Вы добавили запись на сервер' } },
  packer:     { icon: '📦', name: 'Packed & Sealed', desc: { uz: "body'ni JSON.stringify bilan qadoqladingiz", ru: 'Вы упаковали body с помощью JSON.stringify' } },
  dispatcher: { icon: '🎛️', name: 'Dispatcher!',     desc: { uz: "Pultda 3 posilkani to'g'ri jo'natdingiz", ru: 'Вы правильно отправили 3 посылки с пульта' } },
  graduate:   { icon: '🏆', name: 'Level Up!',       desc: { uz: "API POST/PUT/DELETE darsini yakunladingiz", ru: 'Вы завершили урок API POST/PUT/DELETE' } },
};
// Ekran id → nishon (recordAnswer'da, faqat REAL solve bilan: SCORED test / gate)
const ACH_TRIGGERS = { s4: 'poster', s5b: 'packer', s13: 'dispatcher' };

// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI — yorqin nurlar, medal portlashi, uchqunlar, zarba to'lqini
function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr({ uz: 'Yangi nishon:', ru: 'Новая награда:' })} ${tr(ach.name)}`}>
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
          <span className="acu-name">{tr(ach.name)}</span>
          {ach.desc && <span className="acu-desc">{tr(ach.desc)}</span>}
        </div>
        <span className="acu-tap">{tr({ uz: 'bosib davom eting', ru: 'нажмите, чтобы продолжить' })}</span>
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

const Q_LABELS = { 4: { uz: "1 — POST (qo'shish)", ru: '1 — POST (добавление)' }, 6: "2 — body/stringify", 11: { uz: "3 — manzil/ID", ru: '3 — адрес/ID' }, 15: "4 — DELETE", 19: { uz: "5 — Yakuniy amaliy", ru: '5 — Финальная практика' } };
// Server-baholash javob kaliti (mentor ochganda avto-yuklanadi). s16 = -1 (yakuniy amaliy).
const INLINE_KEYS = { s4: 1, s5b: 2, s9: 3, s12: 0, s16: -1, practice: -1 };

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
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не присоединился.' })}</p></div>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верно)</> })}</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: "🏆 To'liq reyting", ru: '🏆 Полный рейтинг' })}</div>
              <div className="pod-list">
                {board.map((b, i) => (
                  <div key={b.id} className={`pod-row ${live.playerId === b.id ? 'me' : ''}`}>
                    <span className="mono pod-rank">{i + 1}</span>
                    <span className="pod-row-name">{b.nickname}</span>
                    <span className="pod-row-dots">{SCORED_IDX.map(q => { const a = rows.find(r => r.player_id === b.id && r.screen_idx === q); return <span key={q} className={`pod-dot ${a ? (a.correct ? 'ok' : 'bad') : ''}`} title={tr(Q_LABELS[q])} />; })}</span>
                    <span className="mono pod-row-score">{b.okCount}/{totalQ}</span>
                    <span className="mono pod-row-time">{fmtT(b.time)}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Savollar bo'yicha — qaysi mavzu qiyin bo'ldi */}
            <div className="card fade-up d2">
              <div className="card-lbl" style={{ color: T.blue }}>{tr({ uz: "📊 Savollar bo'yicha", ru: '📊 По вопросам' })}</div>
              <div className="pod-qstats">
                {SCORED_IDX.map(q => {
                  const qa = rows.filter(r => r.screen_idx === q);
                  const okN = qa.filter(r => r.correct).length;
                  const pct = qa.length ? Math.round((okN / qa.length) * 100) : 0;
                  const hard = qa.length >= 2 && pct < 50;
                  return (
                    <div key={q} className="qstat-row">
                      <span className="qstat-lbl">{tr(Q_LABELS[q]) || `#${q}`}{hard && ' ⚠️'}</span>
                      <span className="mstats-track"><span className="mstats-fill" style={{ width: `${pct}%`, background: hard ? T.accent : T.success }} /></span>
                      <span className="mono qstat-n">{okN}/{qa.length}</span>
                    </div>
                  );
                })}
              </div>
              {live.mode === 'mentor' && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntiring.', ru: 'Вопросы со значком ⚠️ — темы, где класс споткнулся. Советуем объяснить их ещё раз.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== ⚔️ MUSTAHKAMLASH-JANG (Kahoot arena) =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi tokenlar — so'rov fe'llari (VERBS palitra)
const QZ_BG_SHAPES = [
  { ch: 'POST',           l: 6,  t: 12, s: 30, c: 'rgba(31,122,77,0.16)',  d: 19, dl: 0 },
  { ch: 'PUT',            l: 82, t: 8,  s: 30, c: 'rgba(180,83,9,0.15)',    d: 23, dl: 1.5 },
  { ch: 'DELETE',         l: 9,  t: 70, s: 30, c: 'rgba(194,54,43,0.15)',   d: 27, dl: 0.8 },
  { ch: 'body',           l: 78, t: 66, s: 34, c: 'rgba(31,122,77,0.13)',   d: 21, dl: 2.2 },
  { ch: 'JSON.stringify', l: 40, t: 86, s: 22, c: 'rgba(1,154,203,0.13)',   d: 25, dl: 1.1 },
  { ch: '201',            l: 64, t: 24, s: 32, c: 'rgba(31,122,77,0.14)',   d: 17, dl: 0.4 },
  { ch: '/games/2',       l: 24, t: 34, s: 24, c: 'rgba(180,83,9,0.12)',    d: 20, dl: 1.9 },
  { ch: 'method',         l: 54, t: 5,  s: 28, c: 'rgba(1,154,203,0.14)',   d: 22, dl: 0.6 },
  { ch: 'CRUD',           l: 90, t: 40, s: 26, c: 'rgba(31,122,77,0.13)',   d: 24, dl: 1.3 },
  { ch: '📦',             l: 3,  t: 44, s: 30, c: 'rgba(180,83,9,0.16)',    d: 26, dl: 2.6 },
  { ch: '200 OK',         l: 68, t: 82, s: 24, c: 'rgba(1,154,203,0.12)',   d: 18, dl: 1.7 },
];
const QUIZ_BANK = [
  { q: { uz: "Serverga yangi o'yin qo'shish uchun qaysi fe'l?", ru: 'Какой глагол добавит новую игру на сервер?' }, opts: ["POST", "GET", "DELETE", "PUT"], correct: 0 },
  { q: { uz: "`DELETE` so'rovida body kerakmi?", ru: 'Нужен ли body в запросе `DELETE`?' }, opts: [{ uz: "Yo'q — faqat manzil va ID", ru: 'Нет — только адрес и ID' }, { uz: "Ha, har doim yuboriladi", ru: 'Да, отправляется всегда' }, { uz: "Faqat POST bilan birga", ru: 'Только вместе с POST' }, { uz: "Ha, JSON ko'rinishida", ru: 'Да, в виде JSON' }], correct: 0 },
  { q: { uz: "`201 Created` javobi qachon keladi?", ru: 'Когда приходит ответ `201 Created`?' }, opts: [{ uz: "POST yangi yozuv qo'shganda", ru: 'Когда POST добавил новую запись' }, { uz: "GET yozuvni o'qiganda", ru: 'Когда GET прочитал запись' }, { uz: "Har doim, har so'rovda", ru: 'Всегда, на любой запрос' }, { uz: "Faqat xato bo'lganda", ru: 'Только при ошибке' }], correct: 0 },
  { q: { uz: "Posilka yuki (ma'lumot) qaysi xonada ketadi?", ru: 'В какой «комнате» едет груз посылки (данные)?' }, opts: ["headers", "body", "method", "url"], correct: 1 },
  { q: { uz: "`PUT` nima qiladi?", ru: 'Что делает `PUT`?' }, opts: [{ uz: "Faqat o'qiydi", ru: 'Только читает' }, { uz: "Mavjud yozuvni almashtiradi", ru: 'Заменяет существующую запись' }, { uz: "Yangi yozuv qo'shadi", ru: 'Добавляет новую запись' }, { uz: "Yozuvga rang beradi", ru: 'Красит запись' }], correct: 1 },
  { q: { uz: "`GET` nima qiladi?", ru: 'Что делает `GET`?' }, opts: [{ uz: "Yangi yozuv qo'shadi", ru: 'Добавляет новую запись' }, { uz: "Faqat o'qib olib keladi", ru: 'Только читает и приносит' }, { uz: "Yozuvni o'chiradi", ru: 'Удаляет запись' }, { uz: "Yozuvni almashtiradi", ru: 'Заменяет запись' }], correct: 1 },
  { q: { uz: "`JSON.stringify(yangi)` nima qiladi?", ru: 'Что делает `JSON.stringify(yangi)`?' }, opts: [{ uz: "Ekranga chizadi", ru: 'Рисует на экране' }, { uz: "Xato bor-yo'qligini tekshiradi", ru: 'Проверяет на ошибки' }, { uz: "Obyektni JSON matnga aylantiradi", ru: 'Превращает объект в JSON-текст' }, { uz: "Serverdan javob oladi", ru: 'Получает ответ сервера' }], correct: 2 },
  { q: { uz: "`PUT` va `DELETE` da nima majburiy?", ru: 'Что обязательно для `PUT` и `DELETE`?' }, opts: [{ uz: "Rang", ru: 'Цвет' }, "body", "ID (/games/2)", "headers"], correct: 2 },
  { q: { uz: "`fetch(url, {…})` — ikkinchi qism nima?", ru: '`fetch(url, {…})` — что такое вторая часть?' }, opts: [{ uz: "Manzil", ru: 'Адрес' }, { uz: "Javob", ru: 'Ответ' }, { uz: "Sozlamalar qutisi", ru: 'Коробка настроек' }, { uz: "Fe'l nomi", ru: 'Имя глагола' }], correct: 2 },
  { q: { uz: "`DELETE` bilan o'chirilgan yozuv qaytariladimi?", ru: 'Вернётся ли запись, удалённая через `DELETE`?' }, opts: [{ uz: "Ha, oson qaytarib olinadi", ru: 'Да, легко вернуть' }, { uz: "Bir daqiqada o'zi tiklanadi", ru: 'Сама восстановится через минуту' }, { uz: "Serverda saqlanib qoladi", ru: 'Останется храниться на сервере' }, { uz: "Yo'q — shuning uchun tasdiq so'raladi", ru: 'Нет — поэтому и просят подтверждение' }], correct: 3 },
  { q: { uz: "CRUD nima?", ru: 'Что такое CRUD?' }, opts: ["Copy · Run · Undo · Do", "Create · Read · Undo · Done", "Code · Read · Use · Debug", "Create · Read · Update · Delete"], correct: 3 },
  { q: { uz: "`method: 'POST'` serverga nima deydi?", ru: "Что говорит серверу `method: 'POST'`?" }, opts: [{ uz: "«Rangni o'zgartir»", ru: '«Поменяй цвет»' }, { uz: "«O'lchamni kichraytir»", ru: '«Уменьши размер»' }, { uz: "«Tezlikni oshir»", ru: '«Увеличь скорость»' }, { uz: "«Yangi yozuv yarat»", ru: '«Создай новую запись»' }], correct: 3 },
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
          <span className="cs-hud-i"><b>{QUIZ_BANK.length}</b> {tr({ uz: 'SAVOL', ru: 'ВОПРОСОВ' })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i"><b>{QUIZ_MS / 1000}</b> {tr({ uz: 'SONIYA', ru: 'СЕКУНД' })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i">{tr({ uz: '🏆 PODIUM', ru: '🏆 ПОДИУМ' })}</span>
        </div>
      )}
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>
  );
};

// Jonli fon: suzuvchi uchqunlar + «web» chiziqlari + kod tokenlari (canvas)
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['POST', 'PUT', 'DELETE', 'body', 'method', 'CRUD', '201', 'fetch'];
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
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚡ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nПотом можно вернуться в это же место через «⚡ Продолжить».\n\nВсё равно закрыть?' }))) return;
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
      <button className="qz-x" onClick={closeArena} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>

      {/* QUTQARUV: jonli dars tugadi — o'quvchi osilib qolmaydi, mashq rejimida davom etadi */}
      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме тренировки' })}</button>
        </div>
      )}

      {/* ===== LOBBY ===== */}
      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Серия верных ответов подряд даёт 🔥 бонус!' })}</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>{tr({ uz: '▶ Testni boshlash', ru: '▶ Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Ждите, пока ментор начнёт тест…' })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>{tr({ uz: '▶ Boshlash', ru: '▶ Начать' })}</button>}
        </div>
      )}

      {/* ===== SAVOL ===== */}
      {phase === 'q' && Q && (
        <div className="qz-view qz-qview fade-step" key={`q${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length}</span>
            <QzTimer remaining={remaining} />
            {isMentor
              ? <span className="qz-ansn">📨 {answeredN}/{players.length}</span>
              : <span className="qz-ansn">{streakUpTo(qi - 1) >= 2 ? `🔥 x${streakUpTo(qi - 1)}` : ' '}</span>}
          </div>
          <h2 className="qz-q">{fmtCode(tr(Q.q))}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
              const pickedThis = my && my.picked === i;
              return (
                <button key={i} className={`qz-tile ${my ? (pickedThis ? 'picked' : 'faded') : ''}`} style={{ background: QUIZ_COLORS[i] }} disabled={isMentor || !!my} onClick={() => answer(i)}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr(o))}</span>
                  {pickedThis && <span className="qz-pbadge">✔</span>}
                </button>
              );
            })}
          </div>
          {my && !isMentor && !solo && <p className="qz-waitmsg">{tr({ uz: '✔ Javob qabul qilindi — natijani kuting…', ru: '✔ Ответ принят — ждите результат…' })}</p>}
          {isMentor && (
            <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">{tr({ uz: '✓ Hamma javob berdi!', ru: '✓ Все ответили!' })}</span>}
              <button className="qz-btn" onClick={() => ctrl('r', qi)}>{tr({ uz: '⏹ Natijani ochish', ru: '⏹ Открыть результат' })}</button>
            </div>
          )}
        </div>
      )}

      {/* ===== NATIJA (reveal) ===== */}
      {phase === 'reveal' && Q && (
        <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length} — {tr({ uz: 'natija', ru: 'результат' })}</span>
          </div>
          <h2 className="qz-q">{fmtCode(tr(Q.q))}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
              const win = i === Q.correct;
              const pickedThis = my && my.picked === i;
              return (
                <div key={i} className={`qz-tile rv ${win ? 'win' : 'lose'} ${pickedThis ? 'picked' : ''}`} style={{ background: QUIZ_COLORS[i] }}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr(o))}</span>
                  <span className="qz-cnt">{win ? '✓ ' : ''}{counts[i]}</span>
                </div>
              );
            })}
          </div>
          {!isMentor && (
            <div className={`qz-res ${my?.correct ? 'good' : 'bad'}`}>
              {my?.correct
                ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr({ uz: 'ball', ru: 'баллов' })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ''}</span></>
                : <span className="qz-res-t">{my ? tr({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Будьте быстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: 'Siz hozir:', ru: 'Вы сейчас:' })} {myRank + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</span>}
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
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl('done', qi) : ctrl('q', qi + 1)}>{lastQ ? tr({ uz: "🏁 G'oliblarni e'lon qilish", ru: '🏁 Объявить победителей' }) : tr({ uz: 'Keyingi savol →', ru: 'Следующий вопрос →' })}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: "🏁 Natijani ko'rish", ru: '🏁 Посмотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Дальше →' })}</button>}
        </div>
      )}

      {/* ===== YAKUN — PODIUM ===== */}
      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'лучший streak' })} 🔥x${soloScore.maxStreak}` : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>{tr({ uz: '↻ Qayta ishlash', ru: '↻ Пройти заново' })}</button>
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
                      {b && <span className="qz-pod-pts">{b.pts} {tr({ uz: 'ball', ru: 'баллов' })} · {b.ok}/{QUIZ_BANK.length}</span>}
                      <div className="qz-pod-bar" />
                    </div>
                  );
                })}
              </div>
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: <>Siz — <b>{myRank + 1}-o'rin</b> · {board[myRank].pts} ball</>, ru: <>Вы — <b>{myRank + 1}-е место</b> · {board[myRank].pts} баллов</> })}</p>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест заново — тренировка (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function ReactApiPostLesson({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
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
  // 🏅 Nishonlar
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
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // 🃏 Flashcard ekrani jonli darsda (mentor boshqaruvida) o'quvchida ko'rsatilmaydi — o'tkazib yuboriladi
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat REAL solve)
    if (_m && _m.scored && _m.scope === 'final' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);
  };
  // Javob kaliti: inline testlar + jang savollari — mentor ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  useEffect(() => { if (screen === TOTAL_SCREENS - 1) earn('graduate'); }, [screen, earn]); // 🏅 yakuniy nishon
  const reset = () => { progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  // F-0730-01: har o'zgarishda progress saqlanadi (screen + javoblar + nishonlar + boshlangan vaqt)
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned]);

  const finishLesson = () => {
    progClear(LESSON_META.lessonId); // F-0730-01: yakunlangan dars saqlovi tozalanadi
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, ScreenPractice1, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenPractice2, Screen12, Screen13, Screen14, Screen15, Screen16, ScreenPodium, ScreenFlashcards, Screen17];
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
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
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

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }
        .chip:disabled { opacity: 0.4; cursor: not-allowed; }
        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; }
        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        /* Zoomable tugmasi (⛶) o'ng yuqori burchakdagi hisoblagich bilan to'qnashmasin (F-0819-47). */
        .zoomable .split > .col:last-child > div:first-child,
        .zoomable .split-4555 > .col:last-child > div:first-child { padding-right: 38px; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
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

        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.16); }

        .h-title { font-size: clamp(22px,4vw,38px); }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

        /* === STAGE === */
        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; justify-content: safe center; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
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
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === LAYOUT === */
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

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }
        .hint { background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; white-space: pre-wrap; } .ai-line:hover { background: rgba(255,255,255,0.06); }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
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

        /* === REACT-4 DARS CSS === */
        .bp-bar { background: #f0eee8; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-title { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; }
        .bp-body { padding: clamp(12px,2.2vw,18px); }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        /* Roblox uslubidagi o'yin kartochkasi */
        .rocard { border-radius: 12px; background: #fff; box-shadow: 0 4px 14px -4px rgba(0,0,0,0.16); overflow: hidden; border: 1px solid rgba(0,0,0,0.05); transition: transform 0.15s, box-shadow 0.15s; }
        .rocard:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -5px rgba(0,0,0,0.22); }
        .rocard.tappable { cursor: pointer; }
        .rothumb { height: 58px; display: flex; align-items: center; justify-content: center; position: relative; }
        .topbadge { position: absolute; top: 4px; left: 6px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 8.5px; color: #fff; background: rgba(14,14,16,0.72); padding: 2px 7px; border-radius: 99px; letter-spacing: 0.04em; }
        .robody { padding: 7px 10px 9px; }
        .roname { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; color: ${T.ink}; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rostats { display: flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-size: 10.5px; color: ${T.ink3}; font-weight: 600; }
        @keyframes heart-pop { 0% { transform: scale(1); } 40% { transform: scale(1.45); } 100% { transform: scale(1); } }
        .hpop { animation: heart-pop 0.4s ease; display: inline-block; }
        /* Rentgen rejimi */
        .xray-ov { position: absolute; inset: 0; border: 1.5px dashed ${T.accent}; border-radius: 12px; background: rgba(246,244,239,0.9); display: flex; align-items: center; justify-content: center; animation: fade-step 0.35s ease-out; z-index: 2; }
        /* Posilka */
        @keyframes fly-down { 0% { opacity: 0; transform: translate(-50%, -18px) scale(0.7); } 35% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%, 46px) scale(1); } }
        .parcel { transform: translateX(-50%); animation: fly-down 0.9s ease-in forwards; z-index: 3; }
        /* Ma'lumot daryosi tomchilari */
        @keyframes drip { 0% { transform: translateY(0); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(16px); opacity: 0; } }
        .flow-dot { position: absolute; left: 1px; top: 0; width: 6px; height: 6px; border-radius: 50%; background: ${T.accent}; animation: drip 0.75s linear infinite; }
        /* Silkinish (teskari oqim / read-only) */
        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: shake 0.4s ease; }
        /* VS Code muhiti (yakuniy ekran) */
        .vsc { background: #1E1E1E; border-radius: 13px; overflow: hidden; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.3); }
        .vsc-bar { background: #252526; display: flex; align-items: flex-end; }
        .vsc-tab { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: #8B949E; background: #2D2D2D; padding: 8px 14px; display: inline-flex; align-items: center; gap: 6px; }
        .vsc-tab.on { background: #1E1E1E; color: #E6EDF3; box-shadow: inset 0 2px 0 #007ACC; }
        .vsc-body { padding: 12px 14px 14px 8px; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13px); color: #D4D4D4; line-height: 2; }
        .vsc-line { display: flex; align-items: center; }
        .vsc-ln { color: #6E7681; min-width: 22px; text-align: right; margin-right: 14px; font-size: 11px; flex-shrink: 0; user-select: none; }
        .vsc-input { background: rgba(0,122,204,0.08); border: 1px dashed #007ACC; border-radius: 6px; color: #E6EDF3; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13px); padding: 4px 9px; outline: none; flex: 1; min-width: 0; transition: border-color 0.2s, background 0.2s; }
        .vsc-input::placeholder { color: #5A6374; }
        .vsc-input.ok { border: 1.5px solid ${T.success}; background: rgba(31,122,77,0.14); }


        /* === REACT-5 DARS CSS (API GET) === */
        @media (min-width: 761px) { .split-wide { grid-template-columns: minmax(0,1.18fr) minmax(0,0.82fr); } }
        @keyframes shimmer { 0% { background-position: 160% 0; } 100% { background-position: -160% 0; } }
        .skel { background: linear-gradient(100deg, #ECE9E2 38%, #F8F6F1 50%, #ECE9E2 62%); background-size: 220% 100%; animation: shimmer 1.15s linear infinite; }
        @keyframes fly-in { 0% { opacity: 0; transform: translate(-50%, -14px) scale(0.7); } 35% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%, 40px) scale(1); } }
        .fly-in { transform: translateX(-50%); animation: fly-in 0.95s ease-in forwards; z-index: 3; }


        /* === REACT-6 DARS CSS (POST/PUT/DELETE) === */
        .vcard { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); font-family: 'Manrope', sans-serif; }
        .vcard:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.2); }
        .vcard:disabled { cursor: default; }
        .vcard.hint { animation: tap-hint 1.9s ease-in-out infinite; }
        .vcard.hint:hover { animation: none; }
        @keyframes tap-hint { 0%,100% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); } 50% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14), 0 0 0 3px rgba(255,79,40,0.16); } }
        @media (prefers-reduced-motion: reduce) { .vcard.hint { animation: none; } }
        .vbadge { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; color: #fff; padding: 4px 9px; border-radius: 7px; letter-spacing: 0.04em; flex-shrink: 0; min-width: 52px; text-align: center; }
        .vlbl { font-weight: 700; font-size: 12px; color: ${T.ink}; letter-spacing: 0.05em; }
        .vseen { margin-left: auto; font-weight: 700; font-size: 13px; }
        .srow { display: flex; align-items: center; gap: 10px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${CODE.text}; padding: 5px 8px; border-radius: 7px; transition: all 0.3s; }
        .srid { color: ${CODE.attr}; min-width: 16px; text-align: right; flex-shrink: 0; }
        .srname { color: ${CODE.text}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .srextra { margin-left: auto; font-size: 10.5px; color: ${CODE.comment}; font-style: italic; flex-shrink: 0; }
        .srow-read { background: rgba(1,154,203,0.16); box-shadow: inset 0 0 0 1px rgba(1,154,203,0.5); }
        .srow-new { background: rgba(31,122,77,0.18); box-shadow: inset 0 0 0 1px rgba(125,209,129,0.5); animation: el-pop 0.35s ease-out; }
        .srow-new .srextra { color: ${CODE.str}; font-style: normal; }
        .srow-changed { background: rgba(180,83,9,0.2); box-shadow: inset 0 0 0 1px rgba(255,211,128,0.5); animation: el-pop 0.35s ease-out; }
        .srow-changed .srextra { color: ${CODE.attr}; font-style: normal; }
        .srow-del { background: rgba(194,54,43,0.16); }
        .srow-del .srname { text-decoration: line-through; color: ${CODE.comment}; }
        @keyframes fly-right { 0% { opacity: 0; transform: translateX(-6px) scale(0.7); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateX(46px) scale(1); } }
        .fly-right { animation: fly-right 0.95s ease-in forwards; }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* ===== v18 QATLAM CSS (DD/DBG/FC/ACH/ARENA/PODIUM/RECAP/MSTATS/CS) ===== */
        /* === 🧲 DRAG-DROP ORDER (reusable) === */
        .dd { display: flex; flex-direction: column; gap: 13px; }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 56px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; transition: border-color .18s, background .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; }
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; }
        .dd-slot.bad { border-color: #E24848; background: #FBE9E9; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        .dd-slotn { width: 26px; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; }
        .dd-hint { color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${T.bg}; position: relative; z-index: 1; }
        .dd-slots { position: relative; }
        .dd-pool-empty { color: ${T.ink3}; font-size: 12.5px; font-style: italic; align-self: center; }
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip:hover { transform: translateY(-2px); }
        .dd-chip:active { cursor: grabbing; }
        .dd-done { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .dd-wrong { font-weight: 700; color: #E24848; font-size: 13.5px; }

        /* === 🐞 DEBUG CHALLENGE (reusable) === */
        .dbg { display: flex; flex-direction: column; gap: 10px; }
        .dbg-code { background: ${CODE.bg}; border-radius: 14px; padding: 10px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 10px 26px -14px rgba(${T.shadowBase},0.4); overflow-x: auto; }
        .dbg-line { display: flex; align-items: center; gap: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px,1.8vw,15px); color: ${CODE.text}; padding: 8px 12px; border-radius: 9px; cursor: pointer; border: 1.5px solid transparent; transition: background .15s, border-color .15s; white-space: nowrap; }
        .dbg-line:hover { background: rgba(255,255,255,0.06); }
        .dbg-line.wrong { border-color: #E24848; background: rgba(226,72,72,0.16); animation: dd-shake .4s; }
        .dbg-line.fixed { border-color: ${T.success}; background: rgba(18,169,104,0.16); cursor: default; }
        .dbg-ln { color: ${CODE.comment}; font-size: 12px; min-width: 16px; text-align: right; flex-shrink: 0; }
        .dbg-txt { flex: 1; }
        .dbg-badge { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.success}; background: rgba(18,169,104,0.2); border-radius: 99px; padding: 3px 9px; flex-shrink: 0; }
        .dbg-hint { margin: 0; font-size: 13px; color: ${T.ink3}; font-style: italic; }
        .dbg-ok { font-weight: 700; color: ${T.success}; font-size: 14px; background: ${T.successSoft}; border-radius: 12px; padding: 10px 14px; }

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
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #FFF3EC); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
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

        /* === kod chip (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
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

        /* === ⚔️ CTA (yakun sahifasida) === */
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
        .qz-brand { display: flex; align-items: center; gap: 12px; }
        .qz-brand.sm { gap: 9px; }
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


        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        /* === 🔴 JONLI EFIR (LiveFrame / hearts / countdown) — puls·uchish·zarb ✨ Animatsiyaga, rang 🎨 Dizaynga === */
        .lb-frame { border-radius: 15px; overflow: hidden; box-shadow: 0 12px 30px -12px rgba(${T.shadowBase},0.28); transition: box-shadow 0.3s, transform 0.3s; }
        /* efirda kadr "yozib olinyapti" — nur-hoshiya nafas ritmida (✨ Animatsiya, rang 🎨 Dizayndan) */
        .lb-frame.on { box-shadow: 0 0 0 2px ${T.accent}33, 0 16px 40px -14px rgba(255,79,40,0.4); animation: lb-rec-breathe 2.8s ease-in-out infinite; }
        @keyframes lb-rec-breathe { 0%,100% { box-shadow: 0 0 0 2px ${T.accent}33, 0 16px 40px -14px rgba(255,79,40,0.4); } 50% { box-shadow: 0 0 0 3px ${T.accent}55, 0 20px 48px -12px rgba(255,79,40,0.6); } }
        .lb-bar { display: flex; align-items: center; justify-content: space-between; padding: 7px 11px; background: ${T.ink}; }
        .lb-frame.off .lb-bar { background: #2A2A30; }
        .lb-onair { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.08em; color: #fff; background: ${T.accent}; border-radius: 99px; padding: 3px 10px; }
        .lb-onair.dim { background: rgba(255,255,255,0.14); color: rgba(255,255,255,0.6); }
        .lb-dot { width: 7px; height: 7px; border-radius: 50%; background: #fff; display: inline-block; animation: lb-pulse 1.1s ease-in-out infinite; }
        .lb-onair.dim .lb-dot { animation: none; opacity: 0.5; }
        @keyframes lb-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.55); opacity: 0.5; } }
        .lb-viewers { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: #fff; }
        .lb-viewers b { font-variant-numeric: tabular-nums; }
        /* ko'ruvchi-soni almashganda mikro-puls (raqam "tirik" his qilinadi) */
        .lb-tick { display: inline-block; animation: lb-tick 0.42s cubic-bezier(.3,1.4,.4,1); }
        @keyframes lb-tick { 0% { transform: translateY(-3px) scale(1.22); opacity: 0.35; } 100% { transform: none; opacity: 1; } }
        .lb-eye { font-size: 13px; }
        .lb-stage { position: relative; overflow: hidden; }
        .lb-hearts { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 3; }
        .lb-heart { position: absolute; bottom: 12px; font-size: 20px; pointer-events: none; will-change: transform, opacity; animation: lb-rise 1.3s cubic-bezier(.3,.7,.4,1) forwards; }
        @keyframes lb-rise { 0% { transform: translateY(0) translateX(0) scale(0.6); opacity: 0; } 18% { opacity: 1; } 100% { transform: translateY(-118px) translateX(var(--dx,0)) scale(1.15); opacity: 0; } }
        .lb-count-big { font-family: 'Fraunces', serif; font-size: clamp(26px,4vw,34px); line-height: 1; color: ${T.accent}; display: inline-flex; align-items: center; gap: 8px; font-variant-numeric: tabular-nums; }
        .chip.lb-golive { color: ${T.accent}; }
        .chip.lb-golive.chip-on { background: ${T.accent}; color: #fff; }
        .btn.lb-golive { background: ${T.accent}; color: #fff; }
        .lb-timer.frame { position: relative; }
        .lb-cd { display: flex; flex-direction: column; align-items: center; gap: 2px; width: 100%; }
        .lb-cd-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.14em; color: ${T.accent}; }
        .lb-cd-n { font-family: 'Fraunces', serif; font-size: 52px; line-height: 1; color: ${T.ink}; animation: lb-cd-pop 0.9s cubic-bezier(.3,1.4,.4,1); }
        @keyframes lb-cd-pop { 0% { transform: scale(0.4); opacity: 0; } 45% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lb-dot, .lb-heart, .lb-cd-n, .lb-tick { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; } .lb-frame.on { animation: none !important; } }

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }

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

        /* === 🏅 ACHIEVEMENTS === */
        /* ===== 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI ===== */
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
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #FFF3EC); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
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
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(255,79,40,0.32)); }

        /* ===== 🛠️ JONLI PRAKTIKA CSS ===== */
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
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done { animation: none !important; } }
        /* Jonli nishoni xira turadi — kontentdan diqqat tortmasin; ustiga borilganda to'liq ochiladi. */
        .live-badge { opacity: 0.62; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }

      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'API darsi', ru: 'Урок API' }} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} live={live} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
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
