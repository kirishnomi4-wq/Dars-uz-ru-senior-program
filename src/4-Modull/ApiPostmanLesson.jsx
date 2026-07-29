import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// BACKEND MODULI (4-MODUL) · 6-DARS — API va POSTMAN — PLATFORM STANDARD v16 (AUDIOSIZ)
// Mavzu: API nima (ikki dastur o'zaro gaplashadigan vosita) · so'rov (request) va javob (response) ·
//        HTTP method'lar GET/POST/PUT/DELETE = front backend bilan qanday gaplashadi ·
//        Postman = "postachi" — frontend yozmasdan API'ni sinab ko'radigan asbob · o'z API'ingizni Postman'da chaqirish.
// ANALOGIYA (user): POCHTA — API=pochta tizimi; so'rov=xat (konvert: manzil URL + niyat METHOD + ichi BODY);
//        javob=qaytgan xat (shtamp=status kodi 200/201/404 + ichi=JSON ma'lumot); Postman=POSTACHI (xatni eltadi, javobni keltiradi).
// KO'PRIK: id31 (routing, METHOD+PATH, Nest) + id32 (bazada CRUD: SQL) — endi o'sha 4 amalni INTERNET orqali API bilan so'raymiz:
//        GET=SELECT(o'qish) · POST=INSERT(qo'shish) · PUT=UPDATE(o'zgartirish) · DELETE=DELETE(o'chirish).
// Misol: onlayn do'kon `/api/products` (id32 dagi aynan products jadvali, endi API orqali).
// QAROR (user): final = Postman so'rov-quruvchi (method+URL tanlab → Send → to'g'ri status).
// AUDIOSIZ: ovoz (TTS) yo'q. Har ekran global savol bilan ochiladi. Markaziy widget: Postman mock + konvert-sayohat animatsiyasi.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
  line: '#E9E6DF', shadowBase: '58, 53, 48'
};
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };
// HTTP method ranglari (niyat → rang) — Postman uslubi
const METHODS = { GET: T.success, POST: T.accent, PUT: T.blue, DELETE: '#C2410C' };
// status kodi → [matn, rang]
// STAMP palitrasi — uch rang: yashil (o'tdi 200/201) · g'isht-qizil (404 manzil yo'q) · to'q sariq (400 noto'g'ri konvert)
const STAT = { 200: ['200 OK', T.success], 201: ['201 Created', T.success], 404: ['404 Not Found', '#C2410C'], 400: ['400 Bad Request', '#D97706'] };

// ============================================================
// JONLI SESSIYA INFRA — InternetLesson/ReactIntro bilan bir xil (liveRpc/useLiveSession/LiveGate)
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
    } catch { setJoinError(tr({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: 'Неверный код ментора или ошибка подключения.' })); }
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
      <div style={{ fontSize: 'clamp(13px,2vw,18px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: LT.accent, marginBottom: 'clamp(14px,3vw,28px)' }}>{tr({ uz: "Jonli darsga qo'shilish", ru: 'Подключение к живому уроку' })}</div>
      <div style={{ display: 'flex', gap: 'clamp(6px,1.4vw,16px)', justifyContent: 'center', flexWrap: 'wrap' }}>{digits.map((d, i) => <span key={i} style={box}>{d}</span>)}</div>
      <p style={{ color: '#fff', opacity: 0.85, fontSize: 'clamp(15px,2.2vw,22px)', maxWidth: 640, margin: 'clamp(20px,4vw,36px) 0 0', lineHeight: 1.5 }}>{tr({ uz: <>Shu darsni o'z qurilmangizda oching → <b style={{ color: '#fff' }}>«👨‍🎓 O'quvchiman»</b> → ushbu kodni kiriting.</>, ru: <>Откройте этот урок на своём устройстве → <b style={{ color: '#fff' }}>«👨‍🎓 Я ученик»</b> → введите этот код.</> })}</p>
      <button onClick={onClose} style={{ marginTop: 'clamp(22px,4vw,40px)', background: LT.accent, color: '#fff', border: 'none', borderRadius: 14, padding: 'clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)', fontSize: 'clamp(15px,1.8vw,18px)', fontWeight: 700, cursor: 'pointer' }}>{tr({ uz: 'Darsni boshlash →', ru: 'Начать урок →' })}</button>
    </div>
  );
}

function LiveGate({ live, title = { uz: 'Jonli dars', ru: 'Живой урок' } }) {
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
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{tr(title)}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Подключиться к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и своё имя.' })}</p></div>
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
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "🔓 O'quvchilar erkin qilindi", ru: '🔓 Ученики переведены в свободный режим' })}</div>;
    return (<>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr({ uz: 'Kod:', ru: 'Код:' })} <b style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr({ uz: "Kodni katta ko'rsatish", ru: 'Показать код крупно' })} style={{ marginLeft: 6, background: LT.ink, color: '#fff', border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: "📺 Ko'rsatish", ru: '📺 Показать' })}</button>
        <button onClick={() => { if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: 'Отпустить учеников? Они продолжат самостоятельно.' }))) live.endSession(); }} style={{ background: LT.accentSoft, color: LT.accent, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: '🔓 Erkin qilish', ru: '🔓 Отпустить' })}</button>
      </div>
    </>);
  }
  if (live.mode === 'student') {
    if (live.status === 'ended') return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: "🔓 Erkin rejim — o'zingiz davom eting", ru: '🔓 Свободный режим — продолжайте сами' })}</div>;
    if (!live.mentorAlive) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: '⚠️ Mentor uzildi — erkin rejim', ru: '⚠️ Ментор отключился — свободный режим' })}</div>;
    if (!live.connected) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot('#FFD380')} /> {tr({ uz: '🔄 Qayta ulanmoqda…', ru: '🔄 Переподключение…' })}</div>;
    return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: '👨‍🏫 Mentor:', ru: '👨‍🏫 Ментор:' })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

const LangContext = createContext('uz');
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const LiveGateCtx = createContext(null); // JONLI: mentor-gate + live obyekti (Jonli roli Provider bilan ulaydi)

// Matn ichidagi `kod` bo'laklarini chip qilib ko'rsatadi (qcode)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};

// AUDIOSIZ dars — useAudio/getAudioEngine zaglushkasi (QuestionScreen imzosi saqlanadi, TTS yo'q)
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

const LESSON_META = { lessonId: 'api-postman-04-06-v18', lessonTitle: { uz: 'API va Postman — front backend bilan qanday gaplashadi', ru: 'API и Postman — как фронт говорит с бэком' } };
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5b', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's13', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's15p',type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's15b',type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

const Split = ({ children }) => <div className="split">{children}</div>;
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
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

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
const NavBack = ({ onPrev }) => <button className="btn-ghost" onClick={onPrev} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Orqaga', ru: 'Назад' })}</button>;
const NavNext = ({ disabled, label = { uz: 'Davom etish', ru: 'Продолжить' }, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(label))}</button>;
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

// JONLI JAVOB KALITI — SCORED ekranlar correctIdx (final -1). Pozitsiyalar aralashtirilgan (2/0/3/1). Kalit qiymatini ⚡ Jonli tekshiradi.
// -1 = "ishtirok" sentineli (server: correct_idx < 0 → to'ldirgani = to'g'ri). s15 = yakuniy amaliy, 'practice' = «Bajardim» signali.
// Kalitsiz question_id'ni server correct=false deb yozadi — shuning uchun 'practice' ham SHU YERDA bo'lishi shart.
const INLINE_KEYS = { s4: 2, s5b: 0, s9: 3, s12: 1, s15: -1, practice: -1 };
const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;

const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
const RECAPS = {
  4: {
    title: { uz: "API — ikki dastur gaplashadigan til", ru: 'API — язык общения двух программ' },
    cards: [
      { ic: "📮", h: { uz: "API = pochta tizimi", ru: 'API = почтовая система' }, body: { uz: <>Sayt bazani <b>ko'rmaydi</b> — u <b>API</b> orqali serverga so'rov yuboradi. API — til va qoidalar to'plami.</>, ru: <>Сайт <b>не видит</b> базу — он отправляет запрос серверу <b>через API</b>. API — это язык и набор правил.</> } },
      { ic: "✉️", h: { uz: "So'rov = konvert", ru: 'Запрос = конверт' }, body: { uz: <>Har so'rov: <b>METHOD</b> (niyat) + <b>URL</b> (manzil) + ba'zan <b>BODY</b> (ichi). Server javob-konvert qaytaradi.</>, ru: <>Каждый запрос: <b>METHOD</b> (намерение) + <b>URL</b> (адрес) + иногда <b>BODY</b> (содержимое). Сервер возвращает конверт-ответ.</> } },
      { ic: "🔁", h: { uz: "So'rov → javob", ru: 'Запрос → ответ' }, body: { uz: <>Sayt → API → server → baza, keyin javob shu yo'l bilan ortga qaytadi.</>, ru: <>Сайт → API → сервер → база, потом ответ возвращается тем же путём.</> }, ask: { uz: "Sayt bazaga to'g'ridan-to'g'ri kira oladimi?", ru: 'Может ли сайт попасть в базу напрямую?' } },
    ]
  },
  6: {
    title: { uz: "GET — ma'lumotni o'qib olish", ru: 'GET — чтение данных' },
    cards: [
      { ic: "📥", h: { uz: "GET = «o'qib ol»", ru: 'GET = «прочитай»' }, body: { uz: <><b>GET</b> serverdan ma'lumotni <b>oladi</b>, hech narsani o'zgartirmaydi. Bazadagi <span className="mono">SELECT</span> bilan bir xil.</>, ru: <><b>GET</b> <b>получает</b> данные с сервера и ничего не меняет. То же самое, что <span className="mono">SELECT</span> в базе.</> } },
      { ic: "🟢", h: "200 OK", body: { uz: <>Muvaffaqiyatli GET javobi — <b>200 OK</b> shtampi + JSON ma'lumot.</>, ru: <>Успешный ответ GET — штамп <b>200 OK</b> + данные в JSON.</> } },
      { ic: "🚫", h: { uz: "BODY yo'q", ru: 'BODY нет' }, body: { uz: <>GET'da <b>BODY bo'lmaydi</b> — faqat manzil (URL). Qo'shish/o'zgartirishda BODY kerak.</>, ru: <>У GET <b>нет BODY</b> — только адрес (URL). BODY нужен при добавлении и изменении.</> }, ask: { uz: "GET yangi ma'lumot qo'sha oladimi?", ru: 'Может ли GET добавить новые данные?' } },
    ]
  },
  10: {
    title: { uz: "POST — yangi ma'lumot qo'shish", ru: 'POST — добавление новых данных' },
    cards: [
      { ic: "➕", h: { uz: "POST = «qo'shib qo'y»", ru: 'POST = «добавь»' }, body: { uz: <><b>POST</b> bazaga yangi yozuv qo'shadi — <span className="mono">INSERT</span> bilan bir xil. BODY'da yangi ma'lumot ketadi.</>, ru: <><b>POST</b> добавляет в базу новую запись — как <span className="mono">INSERT</span>. Новые данные едут в BODY.</> } },
      { ic: "🆕", h: "201 Created", body: { uz: <>Muvaffaqiyatli POST javobi — <b>201 Created</b>: yangi narsa yaratildi.</>, ru: <>Успешный ответ POST — <b>201 Created</b>: создано что-то новое.</> } },
      { ic: "📦", h: { uz: "BODY shart", ru: 'BODY обязателен' }, body: { uz: <>POST'da <b>BODY</b> bor — qo'shiladigan ma'lumot. Aks holda server nimani saqlashni bilmaydi.</>, ru: <>У POST есть <b>BODY</b> — данные для добавления. Иначе сервер не знает, что сохранять.</> }, ask: { uz: "Yangi mahsulot qo'shish uchun qaysi method?", ru: 'Каким методом добавить новый товар?' } },
    ]
  },
  13: {
    title: { uz: "Front backend bilan qanday gaplashadi", ru: 'Как фронт говорит с бэком' },
    cards: [
      { ic: "🔌", h: { uz: "Sayt o'zi kira olmaydi", ru: 'Сайт сам войти не может' }, body: { uz: <>Sayt bazaga <b>to'g'ridan-to'g'ri</b> kira olmaydi — bu xavfli. U <b>API</b> orqali so'raydi.</>, ru: <>Сайт не может попасть в базу <b>напрямую</b> — это опасно. Он спрашивает <b>через API</b>.</> } },
      { ic: "🔗", h: { uz: "Method = CRUD amali", ru: 'Метод = операция CRUD' }, body: <>GET·POST·PUT·DELETE → SELECT·INSERT·UPDATE·DELETE.</> },
      { ic: "📨", h: { uz: "So'rov → javob", ru: 'Запрос → ответ' }, body: { uz: <>Sayt API'ga <b>so'rov</b> yuboradi, server bazada ishlaydi va <b>javob</b> qaytaradi.</>, ru: <>Сайт отправляет в API <b>запрос</b>, сервер работает с базой и возвращает <b>ответ</b>.</> }, ask: { uz: "Frontend serverdan ma'lumotni qanday so'raydi?", ru: 'Как фронтенд запрашивает данные у сервера?' } },
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
        <span className="rc-tag">{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Разбор темы' })}</span>
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
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: '✓ Tushunarli — davom etamiz', ru: '✓ Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующая →' })}</button>}
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
        <span className="mstats-lbl">{tr({ uz: '📊 Jonli natija', ru: '📊 Живой результат' })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>{tr({ uz: '🔓 Natijani ochish', ru: '🔓 Открыть результат' })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }} /></div>
      {reveal ? (
        <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri ✅", ru: 'верно ✅' })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: 'xato ❌', ru: 'ошибка ❌' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi 📨', ru: 'ответили 📨' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и сколько ✅/❌ — пока скрыто. Нажмите «Открыть результат» — и всё откроется сразу и у вас, и на экранах учеников.' })}</p>
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
            {level === 'need' && <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — класс не понял эту тему. Перед тем как идти дальше, рекомендуем короткое повторение.</> })}</p>}
            {level === 'maybe' && <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите тему перед продолжением.</> })}</p>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответов мало ({answered}) — делать выводы по процентам рано. Оцените сами.</> })}</p>}
          </div>
        );
      })()}
      {waiting.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr({ uz: '⏳ Kutilmoqda:', ru: '⏳ Ждём:' })}</span>
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблись — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в реальном времени…' })}</p>}
    </div>
  );
}

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: 'on_mount', waits_for: { type: 'option_picked' } }] : null);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student'); // jonli dars: BITTA urinish — xato bo'lsa ham qotadi
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now()); // tezlik: savol ochilgandan bosishgacha (teng ballda hal qiladi)
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  // MENTOR (proyektor): o'zi javob BERMAYDI — «Natijani ochish» bosilguncha to'g'ri javob sir saqlanadi.
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
  // 📖 Qayta tushuntirish (recap) — natija past chiqsa mentor ochadi; o'quvchi xato qilsa o'zi ham ochishi mumkin
  const [recapOpen, setRecapOpen] = useState(false);
  const hasRecap = !!RECAPS[screen];
  const doReveal = () => { setMReveal(true); if (live) live.mentorReveal(screen); if (storedAnswer === undefined) onAnswer(screen, { mentorRevealed: true }); };
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
  // KAHOOT REVEAL: jonli darsda javob bosilgach to'g'ri/XATO ham sir — faqat «javob qabul qilindi».
  // Mentor «Natijani ochish»/keyingi sahifa/dars tugashi bilan hammada birdan ochiladi.
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed; // javob qotdi — natija mentordan kutilmoqda
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, думайте перед кликом!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (isMentorLive) {
              if (mReveal) { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; } // reveal'gacha hammasi neytral
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
              ? <>✓ {tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? <>{tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(explainCorrect)
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете правильный ответ.' })
                : wrongLocked
                  ? fmtCode(explainWrong[picked] ?? explainWrong.default)
                  : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
          </p>
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi.
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> {tr({ uz: "· ko'rsatmani ochish ▾", ru: '· открыть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

const Win = ({ title, children, minH, hotTitle }) => (
  <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title" style={hotTitle ? { color: T.accent, fontWeight: 700 } : undefined}>{title}</span></div><div className="bp-body" style={{ minHeight: minH, position: 'relative' }}>{children}</div></div>
);

// ============================================================
// 4-MODUL · 6-DARS YORDAMCHILAR — API / Postman
// ============================================================
// onlayn do'kon ma'lumoti (id32 davomi) — endi /api/products orqali
const PRODUCTS = [
  { id: 1, nom: 'Klaviatura', narx: 120000, soni: 8 },
  { id: 2, nom: 'Sichqoncha', narx: 75000,  soni: 15 },
  { id: 3, nom: 'Quloqchin',  narx: 95000,  soni: 5 }
];
const NEW_PRODUCT = { id: 4, nom: 'Mikrofon', narx: 60000, soni: 12 };
const fmtNarx = (n) => Number(n).toLocaleString('ru-RU');

const MethodBadge = ({ method, big }) => (
  <span className="mbadge" style={{ color: METHODS[method] || T.ink2, background: (METHODS[method] || T.ink2) + '22', fontSize: big ? 12 : 10.5, padding: big ? '3px 10px' : '2px 7px' }}>{method}</span>
);
// Javob shtampi — server bosgan retro pochta muhri (uch rang: yashil o'tdi · g'isht 404 · sariq 400)
const StatusBadge = ({ code, punch }) => { const s = STAT[code] || ['', T.ink2]; const tone = code === 404 ? ' sb-err' : code === 400 ? ' sb-warn' : ' sb-ok'; return <span key={punch ? code : undefined} className={`status-badge${punch ? ' sb-punch' + tone : ''}`} style={{ color: s[1], background: s[1] + '14', borderColor: s[1] }}>{s[0]}</span>; };

// JSON ko'rinishi (API javobi) — kalit/qiymat ranglanadi
const JsonBox = ({ data, sm }) => {
  const txt = JSON.stringify(data, null, 2);
  return (
    <pre className={`json-box ${sm ? 'sm' : ''}`}>{txt.split('\n').map((ln, i) => {
      const m = ln.match(/^(\s*)"([^"]+)":\s?(.*)$/);
      if (m) { const v = m[3]; const isStr = v.startsWith('"'); return <div key={i}>{m[1]}<span className="j-key">"{m[2]}"</span>: <span className={isStr ? 'j-str' : 'j-num'}>{v}</span></div>; }
      return <div key={i}>{ln}</div>;
    })}</pre>
  );
};

// ===== POSTMAN MOCK — bu darsning markaziy widgeti (so'rov yuborib, javobni ko'rish) =====
const Postman = ({ method, url, body, methodPicker, onMethod, onSend, sending, sent, status, children, sendDisabled, sendLabel = 'Send' }) => (
  <div className={`postman fade-up ${sending ? 'is-sending' : ''}`}>
    <div className="pm-chrome">
      <span className="bb-dots"><i /><i /><i /></span>
      <span className="pm-app">Postman</span>
      <span className="pm-tab mono">{url}</span>
    </div>
    <div className="pm-bar">
      {methodPicker
        ? <div className="pm-methods">{['GET', 'POST', 'PUT', 'DELETE'].map(m => (
            <button key={m} className="pm-mbtn" onClick={() => onMethod && onMethod(m)} style={method === m ? { color: '#fff', background: METHODS[m] } : { color: METHODS[m], background: METHODS[m] + '18' }}>{m}</button>
          ))}</div>
        : <span className="pm-method" style={{ color: METHODS[method] }}>{method}</span>}
      <span className="pm-url mono">{url}</span>
      <button className="pm-send" disabled={sendDisabled || sending} onClick={onSend}>{sending ? '…' : sendLabel}</button>
    </div>
    {body && <div className="pm-body"><span className="pm-bodylbl">Body (JSON)</span><JsonBox sm data={body} /></div>}
    <div className="pm-resp">
      <div className="pm-resp-h"><span className="pm-resp-lbl">{tr({ uz: 'Javob (Response)', ru: 'Ответ (Response)' })}</span>{sent && status ? <StatusBadge code={status} punch /> : null}</div>
      {sending ? <div className="pm-loading"><span className="pm-flytrack" aria-hidden="true"><span className="pm-fly">📨</span></span> {tr({ uz: 'Yuborilmoqda…', ru: 'Отправляем…' })}</div>
        : sent ? <div className="pm-respbody fade-step">{children}</div>
        : <div className="pm-empty">{tr({ uz: '▸ Send bosing — server javobi shu yerda chiqadi', ru: '▸ Нажмите Send — ответ сервера появится здесь' })}</div>}
    </div>
  </div>
);

// ===== SCREEN 0 — HOOK (sayt ma'lumotni qayerdan oladi?) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [phase, setPhase] = useState(storedAnswer ? 'done' : 'idle'); // idle | flying | done
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const tried = phase === 'done';
  const fly = () => { if (phase !== 'idle') return; setPhase('flying'); setTimeout(() => setPhase('done'), 1100); };
  const OPTS = [
    { id: 'a', label: { uz: "Ma'lumot saytning kodi ichida yozib qo'yilgan", ru: 'Данные заранее записаны в коде сайта' } },
    { id: 'b', label: { uz: "Sayt serverga so'rov (API) yuboradi va javob oladi", ru: 'Сайт отправляет серверу запрос (API) и получает ответ' } },
    { id: 'c', label: { uz: "Sayt bazaga to'g'ridan-to'g'ri o'zi kiradi", ru: 'Сайт сам напрямую заходит в базу' } }
  ];
  const correct = 'b';
  const pick = (v) => { if (picked !== null || !tried) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: v === correct }); };
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Har kuni ilova ochasiz — yangi postlar, yangi xabarlar paydo bo'ladi. Ular qayerdan keladi? Bir variantni tanlab ko'ring, keyin haqiqatni ochamiz.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 860 }}>{tr({ uz: <>Ilovani ochasiz — yangi ma'lumot <span className="italic" style={{ color: T.accent }}>qayerdan</span> keladi?</>, ru: <>Вы открываете приложение — <span className="italic" style={{ color: T.accent }}>откуда</span> приходят новые данные?</> })}</h1>
        <Mentor>{tr({ uz: <>O'tgan darslarda server qurdik va bazada CRUD qildik. Lekin sayt (frontend) bazani <b style={{ color: T.ink }}>ko'rmaydi</b> — u serverga <b style={{ color: T.accent }}>xat (so'rov)</b> yuboradi, server javob qaytaradi. Tugmani bosing — konvert qanday uchishini ko'ring.</>, ru: <>На прошлых уроках мы собрали сервер и делали CRUD в базе. Но сайт (фронтенд) базу <b style={{ color: T.ink }}>не видит</b> — он отправляет серверу <b style={{ color: T.accent }}>письмо (запрос)</b>, а сервер возвращает ответ. Нажмите кнопку — посмотрите, как летит конверт.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <Win title={tr({ uz: 'zakaz-shop.uz — ilova', ru: 'zakaz-shop.uz — приложение' })} minH={150}>
              <div className="shopmock">
                {(phase === 'done' ? [...PRODUCTS, NEW_PRODUCT] : PRODUCTS).map(p => (
                  <div key={p.id} className="shop-card"><div className="shop-name">{p.nom}</div><div className="shop-narx">{fmtNarx(p.narx)} {tr({ uz: "so'm", ru: 'сум' })}</div></div>
                ))}
              </div>
            </Win>
            <div className="flyrow">
              <span className="flynode">{tr({ uz: 'Sayt', ru: 'Сайт' })}</span>
              <span className="flytrack"><span className={`flyenv ${phase}`}>{phase === 'done' ? '📩' : '📨'}</span></span>
              <span className="flynode">{tr({ uz: 'Server', ru: 'Сервер' })}</span>
            </div>
            {phase === 'idle' && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={fly}>{tr({ uz: "📨 Serverdan ma'lumot so'rash", ru: '📨 Запросить данные с сервера' })}</button>}
            {phase === 'flying' && <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: 'Konvert serverga uchmoqda…', ru: 'Конверт летит к серверу…' })}</p>}
            {phase === 'done' && <p className="mono small" style={{ color: T.success, margin: 0 }}>{tr({ uz: '✓ Javob keldi — yangi mahsulot "Mikrofon" qo\'shildi!', ru: '✓ Ответ пришёл — добавлен новый товар «Mikrofon»!' })}</p>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: "Sizningcha sayt ma'lumotni qanday oladi?", ru: 'Как, по-вашему, сайт получает данные?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (
                  <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null || !tried} style={{ opacity: !tried ? 0.55 : 1 }} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{tr(o.label)}</span>
                  </button>
                );
              })}
            </div>
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Avval konvertni uchirib ko'ring ←", ru: 'Сначала отправьте конверт ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{picked === correct ? tr({ uz: <>To'g'ri! Sayt serverga <b>so'rov (API)</b> yuboradi, server javob qaytaradi. Bugun shu suhbatni o'rganamiz.</>, ru: <>Верно! Сайт отправляет серверу <b>запрос (API)</b>, а сервер возвращает ответ. Сегодня мы изучим этот разговор.</> }) : tr({ uz: <>Aslida sayt serverga <b>so'rov (API)</b> yuboradi va javob oladi — bazaga o'zi kira olmaydi. Mana shu suhbatni bugun o'rganamiz.</>, ru: <>На самом деле сайт отправляет серверу <b>запрос (API)</b> и получает ответ — сам в базу он попасть не может. Этот разговор мы сегодня и изучим.</> })}</p>}
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
    { text: { uz: "API nima — ikki dastur tili", ru: 'Что такое API — язык двух программ' }, tag: { uz: 'pochta', ru: 'почта' } },
    { text: { uz: "So'rov va javob (konvert)", ru: 'Запрос и ответ (конверт)' }, tag: 'request · response' },
    { text: { uz: "4 method — GET/POST/PUT/DELETE", ru: '4 метода — GET/POST/PUT/DELETE' }, tag: 'CRUD' },
    { text: { uz: "Postman — postachi asbob", ru: 'Postman — инструмент-почтальон' }, tag: { uz: "sinab ko'rish", ru: 'проверка' } },
    { text: { uz: "O'z API'ingizni chaqirasiz", ru: 'Вызовете свой собственный API' }, tag: '/api/products' }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: "Dars oxirida — siz Postman'da so'rov yuborasiz", ru: 'В конце урока вы сами отправите запрос в Postman' })}</p>
      <Postman method="GET" url="/api/products" sent status={200}><JsonBox sm data={PRODUCTS.slice(0, 2)} /></Postman>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: "→ method tanlaysiz, Send bosasiz, javobni ko'rasiz", ru: '→ выбираете метод, жмёте Send, видите ответ' })}</p>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 5 qadam', ru: 'Сегодняшние 5 шагов' })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span>{s.tag && <span className="step-tag">{tr(s.tag)}</span>}</span></li>))}
      </ol>
    </Col>
  );
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Bugun beshta qadamda API bilan gaplashishni o'rganamiz. Oxirida Postman degan asbob bilan o'z serveringizga so'rov yuborib, javobini o'z ko'zingiz bilan ko'rasiz. Boshladik.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Front backend bilan <span className="italic" style={{ color: T.accent }}>qanday gaplashadi?</span></>, ru: <>Как фронт <span className="italic" style={{ color: T.accent }}>говорит с бэком?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Ishonasizmi — dars oxirida siz <b style={{ color: T.ink }}>Postman</b> degan asbob bilan o'z serveringizga so'rov yuborib, javobini o'z ko'zingiz bilan ko'rasiz. Buning uchun sayt yozish ham shart emas. Bularning bari bitta narsa ustida quriladi: <b style={{ color: T.ink }}>API</b>.</>, ru: <>Поверите ли — в конце урока вы через инструмент <b style={{ color: T.ink }}>Postman</b> отправите запрос своему серверу и своими глазами увидите ответ. И для этого даже не нужно писать сайт. Всё это строится на одной вещи: <b style={{ color: T.ink }}>API</b>.</> })}</Mentor>
        {!isNarrow ? (
          <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable>
        ) : !showSteps ? (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "Bugungi 5 qadamni ko'rish", ru: 'Посмотреть 5 шагов' })}</button>
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

// ===== SCREEN 2 — API NIMA (pochta) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const PARTS = [
    { k: 'sayt', label: { uz: 'Sayt (Frontend)', ru: 'Сайт (Frontend)' }, desc: { uz: "Foydalanuvchi ko'radigan tomon. U ma'lumotni o'zi saqlamaydi — serverdan so'raydi.", ru: 'Сторона, которую видит пользователь. Данные сайт сам не хранит — запрашивает их у сервера.' } },
    { k: 'api', label: { uz: 'API (Pochta)', ru: 'API (Почта)' }, desc: { uz: "Ikki dastur orasidagi til va qoidalar. Sayt API orqali so'rov yuboradi — to'g'ridan-to'g'ri bazaga kira olmaydi. Pochta kabi: xat aniq manzilga, aniq qoida bilan boradi.", ru: 'Язык и правила между двумя программами. Сайт отправляет запрос через API — напрямую в базу попасть не может. Как почта: письмо идёт по точному адресу и по правилам.' } },
    { k: 'server', label: { uz: 'Server + Baza', ru: 'Сервер + База' }, desc: { uz: "So'rovni qabul qiladi, bazada ish bajaradi (CRUD) va javob qaytaradi.", ru: 'Принимает запрос, выполняет работу в базе (CRUD) и возвращает ответ.' } }
  ];
  const [seen, setSeen] = useState(storedAnswer ? new Set(['sayt', 'api', 'server']) : new Set());
  const [active, setActive] = useState(storedAnswer ? 'api' : null);
  const done = seen.size >= 3;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const tap = (k) => { setActive(k); setSeen(s => new Set(s).add(k)); };
  const cur = PARTS.find(p => p.k === active);
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Tasavvur qiling: sayt — do'kon peshtaxtasi, server va baza — orqadagi omborxona. Ular orasida pochta ishlaydi: xat qaysi manzilga, qanday qoida bilan borishini u belgilaydi. Shu pochtani API deymiz. Har bir qismni bosib, u nima qilishini ko'ring.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'API nima', ru: 'Что такое API' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `${seen.size}/3 qismni ko'ring`, ru: `Посмотрите части: ${seen.size}/3` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sayt bazaga <span className="italic" style={{ color: T.accent }}>o'zi kira oladimi?</span></>, ru: <>Может ли сайт <span className="italic" style={{ color: T.accent }}>сам войти в базу?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Yo'q. Sayt va server — ikki alohida dastur. Ular orasida <b style={{ color: T.accent }}>API</b> turadi: bu <b style={{ color: T.ink }}>til va qoidalar</b> to'plami. Xuddi pochta kabi — xatni to'g'ri manzilga, qoida bilan yetkazadi. Uchta qismni bosib ko'ring.</>, ru: <>Нет. Сайт и сервер — две отдельные программы. Между ними стоит <b style={{ color: T.accent }}>API</b>: это набор <b style={{ color: T.ink }}>языка и правил</b>. Совсем как почта — доставляет письмо по нужному адресу и по правилам. Нажмите на все три части.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="apiflow">
              {PARTS.map((p, i) => (
                <React.Fragment key={p.k}>
                  <button className={`apinode ${active === p.k ? 'on' : ''} ${seen.has(p.k) ? 'seen' : 'tap-hint'}`} onClick={() => tap(p.k)}>{tr(p.label)} {seen.has(p.k) ? <span className="tick-pop">✓</span> : ''}</button>
                  {i < PARTS.length - 1 && <span className="apiarrow">⇄</span>}
                </React.Fragment>
              ))}
            </div>
            {cur && <div className="sk-info fade-step" key={cur.k}><span className="sk-tagbig"><span className="sk-wordbadge">{tr(cur.label)}</span></span><p className="body" style={{ color: T.ink, margin: '9px 0 0' }}>{tr(cur.desc)}</p></div>}
          </Col>
          <Col>
            {done
              ? <div className="takeaway fade-step"><div className="ta-bulb">📮</div><p className="ta-h">{tr({ uz: 'API = ikki dastur gaplashadigan til', ru: 'API = язык общения двух программ' })}</p><p className="ta-sub">{tr({ uz: "Sayt → API → Server. To'g'ridan-to'g'ri emas — qoida bilan.", ru: 'Сайт → API → Сервер. Не напрямую — по правилам.' })}</p></div>
              : <div className="frame-dash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 130 }}><p className="small" style={{ color: T.ink3, fontStyle: 'italic', textAlign: 'center', margin: 0 }}>{tr({ uz: "← Qismlarni bosib o'rganing", ru: '← Нажимайте на части и изучайте' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — SO'ROV va JAVOB (konvertni O'ZINGIZ yig'asiz) =====
const S3_INFO = {
  method: { uz: "METHOD — niyat: nima qilmoqchisiz (olish, qo'shish, o'chirish)? Konvertdagi «xizmat turi».", ru: 'METHOD — намерение: что вы хотите сделать (получить, добавить, удалить)? «Тип услуги» на конверте.' },
  url: { uz: "URL — manzil: qaysi ma'lumot kerak? Masalan /api/products. Konvertdagi «manzil» qatori.", ru: 'URL — адрес: какие данные нужны? Например /api/products. Строка «адрес» на конверте.' },
  body: { uz: "BODY — konvertning ichidagi ma'lumot (faqat qo'shish va o'zgartirishda kerak). Konvertdagi «xat matni».", ru: 'BODY — содержимое конверта (нужно только при добавлении и изменении). «Текст письма» внутри конверта.' },
  status: { uz: "STATUS — javob shtampi: ish o'tdimi? 200 = o'tdi, 201 = yangi narsa yaratildi, 404 = manzil topilmadi.", ru: 'STATUS — штамп ответа: получилось ли? 200 = получилось, 201 = создано новое, 404 = адрес не найден.' },
  data: { uz: "DATA — javob konvertining ichi: server qaytargan ma'lumot (JSON).", ru: 'DATA — содержимое конверта-ответа: данные, которые вернул сервер (JSON).' }
};
// Har bo'lak QAYSI konvertga tegishli — chiquvchi (req) yoki qaytgan (res)
const S3_PIECES = [
  { k: 'method', zone: 'req', node: <><MethodBadge method="GET" big /> <span className="ep-lbl">METHOD</span></> },
  { k: 'url', zone: 'req', node: <><span className="mono">/api/products</span> <span className="ep-lbl">URL</span></> },
  { k: 'body', zone: 'req', node: <><span className="mono" style={{ color: T.ink3 }}>{'{ ... }'}</span> <span className="ep-lbl">BODY</span></> },
  { k: 'status', zone: 'res', node: <><StatusBadge code={200} /> <span className="ep-lbl">STATUS</span></> },
  { k: 'data', zone: 'res', node: <><span className="mono" style={{ color: T.success }}>[ ... ]</span> <span className="ep-lbl">DATA</span></> }
];
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [placed, setPlaced] = useState(() => (storedAnswer ? Object.fromEntries(S3_PIECES.map(p => [p.k, p.zone])) : {}));
  const [active, setActive] = useState(null);   // info panelda ochilgan bo'lak
  const [sel, setSel] = useState(null);         // tap-rejim: tanlangan bo'lak
  const [hot, setHot] = useState(null);         // sudrash paytida ustida turgan konvert
  const [reject, setReject] = useState(null);   // noto'g'ri konvert — bo'lak silkinadi
  const zoneRefs = useRef({});
  const pool = S3_PIECES.filter(p => !placed[p.k]);
  const nPlaced = S3_PIECES.length - pool.length;
  const done = pool.length === 0;
  const zoneFull = (z) => S3_PIECES.filter(p => p.zone === z).every(p => placed[p.k]);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  // joylash: to'g'ri konvert → o'tiradi (env-settle); noto'g'ri → silkinib qaytadi (env-reject)
  const tryPlace = (k, zone) => {
    const piece = S3_PIECES.find(p => p.k === k);
    if (!piece || placed[k]) return;
    if (piece.zone !== zone) { setSel(null); setReject(k); setTimeout(() => setReject(r => (r === k ? null : r)), 520); return; }
    setPlaced(p => ({ ...p, [k]: zone })); setActive(k); setSel(null);
  };
  const hitZone = (x, y) => {
    let z = null;
    Object.keys(zoneRefs.current).forEach(zk => {
      const elm = zoneRefs.current[zk]; if (!elm) return;
      const r = elm.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) z = zk;
    });
    return z;
  };
  // Sudrash — asl chip DOM transform bilan suriladi (state yo'q → pirillamaydi;
  // `position:fixed` klon YO'Q → ekran pastida chiqib ketmaydi). Tap ham ishlaydi.
  const down = (ev, k) => {
    if (ev.button != null && ev.button !== 0) return;
    ev.preventDefault();
    const el = ev.currentTarget; const sx = ev.clientX, sy = ev.clientY; let moved = false;
    el.style.transition = 'none'; el.style.zIndex = '9999'; el.style.willChange = 'transform';
    const mv = (e) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 5) { moved = true; setSel(null); }
      if (moved) { el.style.transform = `translate(${dx}px,${dy}px) scale(1.06) rotate(-2deg)`; setHot(hitZone(e.clientX, e.clientY)); }
    };
    const finish = () => { el.style.zIndex = ''; el.style.willChange = ''; el.style.transform = ''; el.style.transition = ''; };
    const up = (e) => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      setHot(null);
      if (!moved) { finish(); setActive(k); setSel(s => (s === k ? null : k)); return; }   // bosish = tanlash
      const z = hitZone(e.clientX, e.clientY);
      if (z) { finish(); tryPlace(k, z); }
      else { el.style.transition = 'transform .2s cubic-bezier(.34,1.3,.4,1)'; el.style.transform = ''; setTimeout(finish, 210); } // bo'laklarga qaytadi
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Har bir suhbat ikki konvertdan iborat: siz yuborgan so'rov konverti va serverdan qaytgan javob konverti. So'rovda METHOD va manzil, javobda esa shtamp va ma'lumot bo'ladi. Bo'laklarni o'z konvertiga sudrab yoki bosib joylang.", trigger: 'on_mount', waits_for: null }]);
  // DIQQAT: bu oddiy render-funksiya (komponent EMAS) — render ichida komponent e'lon qilinsa
  // React uni har renderda yangi tip deb biladi va zonani unmount/remount qiladi → sudrash pirillaydi.
  const renderZone = (z, label, color) => (
    <React.Fragment key={z}>
      <p className="flow-label" style={{ color }}>{label}</p>
      <div ref={el => (zoneRefs.current[z] = el)} className={`envcard ${z} env-zone ${hot === z ? 'hot' : ''} ${zoneFull(z) ? 'sealed' : ''}`} onClick={() => sel && tryPlace(sel, z)}>
        {S3_PIECES.filter(p => p.zone === z).map(p => (
          placed[p.k]
            ? <button key={p.k} className={`envpart placed ${active === p.k ? 'on' : ''}`} onClick={() => setActive(p.k)}>{p.node}</button>
            : <span key={p.k} className="env-slot" aria-hidden="true">{tr({ uz: "bo'lakni shu yerga tashlang", ru: 'перетащите деталь сюда' })}</span>
        ))}
        {zoneFull(z) && <span className="env-seal" aria-hidden="true">📮</span>}
      </div>
    </React.Fragment>
  );
  return (
    <Stage eyebrow={tr({ uz: "So'rov va javob", ru: 'Запрос и ответ' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `${nPlaced}/5 bo'lakni joylang`, ru: `Разложите детали: ${nPlaced}/5` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har bir suhbat — <span className="italic" style={{ color: T.accent }}>ikki konvert</span></>, ru: <>Каждый разговор — <span className="italic" style={{ color: T.accent }}>два конверта</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Siz <b style={{ color: T.accent }}>so'rov</b> (request) yuborasiz, server <b style={{ color: T.success }}>javob</b> (response) qaytaradi. So'rov = METHOD + URL (+ ba'zan BODY). Javob = STATUS + DATA. Bo'laklarni o'z konvertiga <b style={{ color: T.ink }}>sudrab yoki bosib</b> joylang — har birining vazifasi yonida chiqadi.</>, ru: <>Вы отправляете <b style={{ color: T.accent }}>запрос</b> (request), сервер возвращает <b style={{ color: T.success }}>ответ</b> (response). Запрос = METHOD + URL (+ иногда BODY). Ответ = STATUS + DATA. Разложите детали по своим конвертам — <b style={{ color: T.ink }}>перетащите или нажмите</b>, роль каждой появится рядом.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="env-pool-h">
              <span className="ep-lbl" style={{ margin: 0 }}>{tr({ uz: "Bo'laklar", ru: 'Детали' })}</span>
              <span className="env-count mono" key={nPlaced}>{nPlaced}/5</span>
            </div>
            <div className="env-pool">
              {pool.length === 0
                ? <span className="env-pool-done">{tr({ uz: "✓ Ikkala konvert ham yig'ildi", ru: '✓ Оба конверта собраны' })}</span>
                : pool.map(p => (
                    <button key={p.k} className={`envpart chip ${sel === p.k ? 'sel' : ''} ${reject === p.k ? 'reject' : ''} ${sel || reject === p.k ? '' : 'tap-hint'}`} onPointerDown={(e) => down(e, p.k)}>{p.node}</button>
                  ))}
            </div>
            {sel && <p className="env-tip small">{tr({ uz: <>Endi konvertni bosing — <b>{sel.toUpperCase()}</b> shu yerga tushadi (yoki bo'lakni sudrang).</>, ru: <>Теперь нажмите на конверт — <b>{sel.toUpperCase()}</b> ляжет туда (или перетащите деталь).</> })}</p>}
            {renderZone('req', tr({ uz: "So'rov konverti (siz → server)", ru: 'Конверт запроса (вы → сервер)' }), T.accent)}
            {renderZone('res', tr({ uz: 'Javob konverti (server → siz)', ru: 'Конверт ответа (сервер → вы)' }), T.success)}
          </Col>
          <Col>
            {active
              ? <div className="sk-info fade-step" key={active}><p className="body" style={{ color: T.ink, margin: 0 }}>{tr(S3_INFO[active])}</p></div>
              : <div className="frame-dash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 130 }}><p className="small" style={{ color: T.ink3, fontStyle: 'italic', textAlign: 'center', margin: 0 }}>{tr({ uz: "← Bo'lakni konvertga sudrang (yoki bosib tanlang)", ru: '← Перетащите деталь в конверт (или выберите нажатием)' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "So'rov = nima + qayerdan. Javob = o'tdimi + natija. Endi METHOD'larni ko'ramiz.", ru: 'Запрос = что + откуда. Ответ = получилось ли + результат. Теперь посмотрим на методы.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    questionText={tr({ uz: 'API nima vazifani bajaradi?', ru: 'Какую задачу выполняет API?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Sayt va server orasida turadigan <span className="italic" style={{ color: T.accent }}>API</span> nima qiladi?</>, ru: <>Что делает <span className="italic" style={{ color: T.accent }}>API</span>, стоящий между сайтом и сервером?</> })}</h2></>}
    audioText="API — sayt va server orasidagi pochta: xat qaysi manzilga, qanday qoida bilan borishini u belgilaydi. Xo'sh, u aslida nima? O'ylab, to'g'ri javobni tanlang."
    options={[tr({ uz: 'Saytning ranglari va shriftlarini chiroyli qilib bezaydi', ru: 'Красиво оформляет цвета и шрифты сайта' }), tr({ uz: 'Server rasmlarini saqlaydigan katta papka', ru: 'Большая папка, где сервер хранит картинки' }), tr({ uz: 'Ikki dastur (sayt va server) gaplashadigan til va qoidalar', ru: 'Язык и правила, на которых общаются две программы (сайт и сервер)' }), tr({ uz: 'Internet tezligini oshiradigan maxsus dastur', ru: 'Специальная программа для ускорения интернета' })]} correctIdx={2}
    explainCorrect={tr({ uz: "To'g'ri! API — bu sayt va server bir-biri bilan gaplashadigan til va qoidalar. Sayt API orqali so'rov yuboradi, javob oladi.", ru: 'Верно! API — это язык и правила, на которых сайт и сервер общаются друг с другом. Сайт отправляет запрос через API и получает ответ.' })}
    explainWrong={{
      0: tr({ uz: "Bezash — CSS ishi. API ma'lumot almashish uchun.", ru: 'Оформление — работа CSS. API нужен для обмена данными.' }),
      1: tr({ uz: "API papka emas — u har qanday ma'lumotni so'rov-javob orqali uzatadi.", ru: 'API — не папка. Он передаёт любые данные через запрос-ответ.' }),
      3: tr({ uz: 'API tezlik vositasi emas — u sayt va server orasidagi til.', ru: 'API — не про скорость. Это язык между сайтом и сервером.' }),
      default: tr({ uz: 'API = dasturlar gaplashadigan til va qoidalar.', ru: 'API = язык и правила общения программ.' })
    }} />
);

// ===== SCREEN 5 — POSTMAN tanishtirish + GET =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(!!storedAnswer);
  const done = sent;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const send = () => { if (sent) return; setSending(true); setTimeout(() => { setSending(false); setSent(true); }, 850); };
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Postman — frontend yozmasdan so'rov yuborib ko'radigan asbob. Konvertga GET method va manzilni yozdik. Endi Send bosing — server qanday javob konvertini qaytarishini ko'ring.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow="Postman + GET" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Send bosing', ru: 'Нажмите Send' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Frontend yozmasdan API'ni <span className="italic" style={{ color: T.accent }}>qanday sinaymiz?</span></>, ru: <>Как протестировать API <span className="italic" style={{ color: T.accent }}>без фронтенда?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: T.ink }}>Postman</b> — bu "postachi" asbob: siz so'rovni yozasiz, u serverga eltadi va javobni keltiradi. Birinchi so'rov — <b style={{ color: METHODS.GET }}>GET /api/products</b>: "menga mahsulotlar ro'yxatini ber". Bu bazadagi <span className="mono">SELECT</span> bilan bir xil. Send'ni bosing.</>, ru: <><b style={{ color: T.ink }}>Postman</b> — инструмент-«почтальон»: вы пишете запрос, он относит его серверу и приносит ответ. Первый запрос — <b style={{ color: METHODS.GET }}>GET /api/products</b>: «дай мне список товаров». Это то же самое, что <span className="mono">SELECT</span> в базе. Нажмите Send.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <Postman method="GET" url="/api/products" sending={sending} sent={sent} status={200} onSend={send} sendLabel="Send">
              <JsonBox data={PRODUCTS} />
            </Postman>
          </Col>
          <Col>
            <div className="maprow"><MethodBadge method="GET" big /><span className="maparrow">=</span><span className="mono" style={{ color: T.ink }}>{tr({ uz: "SELECT (o'qish)", ru: 'SELECT (чтение)' })}</span></div>
            {sent
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Server <b>200 OK</b> shtampi bilan 3 ta mahsulotni JSON qilib qaytardi. GET — ma'lumotni faqat <b>o'qiydi</b>, hech narsani o'zgartirmaydi.</>, ru: <>Сервер вернул 3 товара в JSON со штампом <b>200 OK</b>. GET только <b>читает</b> данные и ничего не меняет.</> })}</p></div>
              : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'GET = "ma\'lumotni so\'rab ol". Eng ko\'p ishlatiladigan method. Postman\'da Send bosib, javobni ko\'ring.', ru: 'GET = «запроси данные». Самый частый метод. Нажмите Send в Postman и посмотрите ответ.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5b — TEST 2 =====
const Screen5b = (props) => (
  <QuestionScreen {...props} idx={6} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    questionText={tr({ uz: 'GET method nima qiladi?', ru: 'Что делает метод GET?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <><span className="italic" style={{ color: METHODS.GET }}>GET</span> so'rovi serverdan nimani so'raydi?</>, ru: <>Что запрашивает у сервера <span className="italic" style={{ color: METHODS.GET }}>GET</span>?</> })}</h2></>}
    audioText="GET — postachiga beriladigan «menga o'sha ma'lumotni olib kel» degan xat. Konvert bo'sh ketadi, javob to'la keladi. GET serverdan nimani so'raydi? Tanlang."
    options={[tr({ uz: "Mavjud ma'lumotni o'qib (olib) keladi", ru: 'Читает (получает) существующие данные' }), tr({ uz: "Butunlay yangi ma'lumot qo'shib yozadi", ru: 'Записывает совершенно новые данные' }), tr({ uz: "Mavjud ma'lumotni bazadan o'chiradi", ru: 'Удаляет существующие данные из базы' }), tr({ uz: "Serverni butunlay o'chirib qo'yadi", ru: 'Полностью выключает сервер' })]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! GET — ma'lumotni o'qish uchun. Bazadagi SELECT bilan bir xil: faqat oladi, o'zgartirmaydi.", ru: 'Верно! GET — для чтения данных. Как SELECT в базе: только получает, ничего не меняет.' })}
    explainWrong={{
      1: tr({ uz: "Qo'shish — POST ishi. GET faqat o'qiydi.", ru: 'Добавление — работа POST. GET только читает.' }),
      2: tr({ uz: "O'chirish — DELETE ishi. GET hech narsani o'chirmaydi.", ru: 'Удаление — работа DELETE. GET ничего не удаляет.' }),
      3: tr({ uz: "GET serverni o'chirmaydi — u shunchaki ma'lumot so'raydi.", ru: 'GET не выключает сервер — он просто запрашивает данные.' }),
      default: tr({ uz: "GET = o'qish (olish).", ru: 'GET = чтение (получение).' })
    }} />
);

// ===== SCREEN 6 — POST (qo'shish) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(!!storedAnswer);
  const done = sent;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const send = () => { if (sent) return; setSending(true); setTimeout(() => { setSending(false); setSent(true); }, 850); };
  const body = { nom: 'Mikrofon', narx: 60000, soni: 12 };
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Endi yangi mahsulot qo'shamiz. Konvertga POST shtampini bosamiz va ichiga yangi mahsulot ma'lumotini solamiz — buni BODY deymiz. Send bosing: server yangi yozuvni saqlab, 201 Created shtampini qaytaradi.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: "POST · qo'shish", ru: 'POST · добавление' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Send bosing', ru: 'Нажмите Send' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bazaga yangi mahsulot <span className="italic" style={{ color: T.accent }}>qanday qo'shamiz?</span></>, ru: <>Как добавить в базу <span className="italic" style={{ color: T.accent }}>новый товар?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: METHODS.POST }}>POST</b> = "mana yangi narsa, qo'shib qo'y". So'rov ichida (BODY) yangi mahsulot ma'lumoti ketadi. Server uni bazaga yozadi va <b style={{ color: T.success }}>201 Created</b> qaytaradi. Bu <span className="mono">INSERT</span> bilan bir xil.</>, ru: <><b style={{ color: METHODS.POST }}>POST</b> = «вот новое, добавь». Внутри запроса (BODY) едут данные нового товара. Сервер записывает их в базу и возвращает <b style={{ color: T.success }}>201 Created</b>. Это то же самое, что <span className="mono">INSERT</span>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <Postman method="POST" url="/api/products" body={body} sending={sending} sent={sent} status={201} onSend={send} sendLabel="Send">
              <JsonBox data={{ id: 4, ...body }} />
            </Postman>
          </Col>
          <Col>
            <div className="maprow"><MethodBadge method="POST" big /><span className="maparrow">=</span><span className="mono" style={{ color: T.ink }}>{tr({ uz: "INSERT (qo'shish)", ru: 'INSERT (добавление)' })}</span></div>
            {sent
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Server <b>201 Created</b> qaytardi va yangi mahsulotni <b>id: 4</b> bilan saqladi. POST — yangi ma'lumot <b>qo'shadi</b>.</>, ru: <>Сервер вернул <b>201 Created</b> и сохранил новый товар с <b>id: 4</b>. POST <b>добавляет</b> новые данные.</> })}</p></div>
              : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Diqqat: POST'da <b>BODY</b> bor — qo'shiladigan ma'lumot. GET'da body yo'q edi.</>, ru: <>Заметьте: у POST есть <b>BODY</b> — данные для добавления. У GET body не было.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — PUT (o'zgartirish) =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(!!storedAnswer);
  const done = sent;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const send = () => { if (sent) return; setSending(true); setTimeout(() => { setSending(false); setSent(true); }, 850); };
  const body = { narx: 99000 };
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Narx o'zgardi. PUT — «buni yangilab qo'y» degan konvert. Manzil oxiridagi raqam serverga qaysi mahsulotni o'zgartirishni aytadi, BODY'da esa yangi narx ketadi. Send bosing.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: "PUT · o'zgartirish", ru: 'PUT · изменение' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Send bosing', ru: 'Нажмите Send' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Mahsulot narxini <span className="italic" style={{ color: T.accent }}>qanday yangilaymiz?</span></>, ru: <>Как обновить <span className="italic" style={{ color: T.accent }}>цену товара?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: METHODS.PUT }}>PUT</b> = "buni yangilab qo'y". URL'da <b style={{ color: T.ink }}>qaysi</b> mahsulot (/api/products/<b>1</b>), BODY'da yangi qiymat. Server <b style={{ color: T.success }}>200 OK</b> qaytaradi. Bu <span className="mono">UPDATE</span> bilan bir xil.</>, ru: <><b style={{ color: METHODS.PUT }}>PUT</b> = «обнови это». В URL — <b style={{ color: T.ink }}>какой</b> товар (/api/products/<b>1</b>), в BODY — новое значение. Сервер вернёт <b style={{ color: T.success }}>200 OK</b>. Это то же самое, что <span className="mono">UPDATE</span>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <Postman method="PUT" url="/api/products/1" body={body} sending={sending} sent={sent} status={200} onSend={send} sendLabel="Send">
              <JsonBox data={{ id: 1, nom: 'Klaviatura', narx: 99000, soni: 8 }} />
            </Postman>
          </Col>
          <Col>
            <div className="maprow"><MethodBadge method="PUT" big /><span className="maparrow">=</span><span className="mono" style={{ color: T.ink }}>{tr({ uz: "UPDATE (o'zgartirish)", ru: 'UPDATE (изменение)' })}</span></div>
            {sent
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Klaviatura narxi 120 000 → <b>99 000</b> bo'ldi. URL'dagi <b>/1</b> serverga qaysi qatorni o'zgartirishni aytdi (bazadagi WHERE id=1 kabi).</>, ru: <>Цена клавиатуры стала 120 000 → <b>99 000</b>. <b>/1</b> в URL сказал серверу, какую строку менять (как WHERE id=1 в базе).</> })}</p></div>
              : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>URL oxiridagi <b>/1</b> — bu mahsulotning id'si. PUT'da u shart: aks holda qaysisini yangilashni server bilmaydi.</>, ru: <><b>/1</b> в конце URL — это id товара. Для PUT он обязателен: иначе сервер не знает, что обновлять.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — DELETE (o'chirish) =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(!!storedAnswer);
  const done = sent;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const send = () => { if (sent) return; setSending(true); setTimeout(() => { setSending(false); setSent(true); }, 850); };
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Mahsulot sotuvdan chiqdi. DELETE — «buni o'chir» degan konvert: manzil oxirida o'chiriladigan mahsulot raqami turadi, ichiga hech narsa solinmaydi. Send bosing.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: "DELETE · o'chirish", ru: 'DELETE · удаление' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Send bosing', ru: 'Нажмите Send' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Mahsulot sotuvdan chiqdi — <span className="italic" style={{ color: T.accent }}>qanday o'chiramiz?</span></>, ru: <>Товар снят с продажи — <span className="italic" style={{ color: T.accent }}>как его удалить?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: METHODS.DELETE }}>DELETE</b> = "buni o'chir". URL'da o'chiriladigan mahsulot id'si (/api/products/<b>3</b>). BODY kerak emas. Server <b style={{ color: T.success }}>200 OK</b> qaytaradi. Bu <span className="mono">DELETE FROM</span> bilan bir xil.</>, ru: <><b style={{ color: METHODS.DELETE }}>DELETE</b> = «удали это». В URL — id удаляемого товара (/api/products/<b>3</b>). BODY не нужен. Сервер вернёт <b style={{ color: T.success }}>200 OK</b>. Это то же самое, что <span className="mono">DELETE FROM</span>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <Postman method="DELETE" url="/api/products/3" sending={sending} sent={sent} status={200} onSend={send} sendLabel="Send">
              <JsonBox data={{ ochirildi: true, id: 3 }} />
            </Postman>
          </Col>
          <Col>
            <div className="maprow"><MethodBadge method="DELETE" big /><span className="maparrow">=</span><span className="mono" style={{ color: T.ink }}>{tr({ uz: "DELETE (o'chirish)", ru: 'DELETE (удаление)' })}</span></div>
            {sent
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "3-mahsulot (Quloqchin) o'chirildi. DELETE'da ham URL'dagi id juda muhim — aks holda noto'g'ri narsa o'chib ketishi mumkin.", ru: 'Товар 3 (Quloqchin) удалён. В DELETE id в URL тоже очень важен — иначе можно удалить не то.' })}</p></div>
              : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'DELETE — eng "xavfli" method. Shuning uchun id aniq bo\'lishi shart.', ru: 'DELETE — самый «опасный» метод. Поэтому id должен быть точным.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEST 3 =====
const Screen9 = (props) => (
  <QuestionScreen {...props} idx={9} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    questionText={tr({ uz: "Bazaga yangi mahsulot qo'shish uchun qaysi method?", ru: 'Каким методом добавить в базу новый товар?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Do'konga yangi mahsulot qo'shmoqchisiz. <span className="italic" style={{ color: T.accent }}>Qaysi method?</span></>, ru: <>Вы хотите добавить в магазин новый товар. <span className="italic" style={{ color: T.accent }}>Какой метод?</span></> })}</h2></>}
    audioText="Do'konga yangi mahsulot qo'ymoqchisiz — postachiga qaysi konvertni berasiz? Konvert ichida yangi mahsulot ma'lumoti ketadi. To'g'ri method'ni tanlang."
    options={[tr({ uz: "GET — mavjud ma'lumotni o'qib oladi", ru: 'GET — читает существующие данные' }), tr({ uz: "DELETE — mavjud yozuvni o'chiradi", ru: 'DELETE — удаляет существующую запись' }), tr({ uz: "PUT — mavjud yozuvni o'zgartiradi", ru: 'PUT — изменяет существующую запись' }), tr({ uz: "POST — yangi ma'lumot qo'shib yozadi", ru: 'POST — записывает новые данные' })]} correctIdx={3}
    explainCorrect={tr({ uz: "To'g'ri! POST yangi yozuv (mahsulot) yaratadi — BODY'da uning ma'lumoti ketadi. Server 201 Created qaytaradi.", ru: 'Верно! POST создаёт новую запись (товар) — её данные едут в BODY. Сервер возвращает 201 Created.' })}
    explainWrong={{
      0: tr({ uz: "GET faqat o'qiydi — yangi narsa qo'shmaydi.", ru: 'GET только читает — ничего нового не добавляет.' }),
      1: tr({ uz: "DELETE mavjud mahsulotni o'chiradi, yangi qo'shmaydi.", ru: 'DELETE удаляет существующий товар, а не добавляет новый.' }),
      2: tr({ uz: "PUT mavjud mahsulotni o'zgartiradi, yangi qo'shmaydi.", ru: 'PUT изменяет существующий товар, а не добавляет новый.' }),
      default: tr({ uz: "Yangi qo'shish — POST.", ru: 'Добавить новое — POST.' })
    }} />
);

// ===== SCREEN 10 — METHOD ↔ CRUD ↔ SQL XARITASI =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const MAP = [
    { m: 'GET',    crud: 'Read',   sql: 'SELECT * FROM products',          ex: 'GET /api/products',     desc: { uz: "Ro'yxatni o'qib oladi.", ru: 'Читает список.' } },
    { m: 'POST',   crud: 'Create', sql: 'INSERT INTO products ...',        ex: 'POST /api/products',    desc: { uz: "Yangi qator qo'shadi (BODY bilan).", ru: 'Добавляет новую строку (с BODY).' } },
    { m: 'PUT',    crud: 'Update', sql: 'UPDATE products SET ... WHERE id', ex: 'PUT /api/products/1',   desc: { uz: "Mavjud qatorni o'zgartiradi.", ru: 'Изменяет существующую строку.' } },
    { m: 'DELETE', crud: 'Delete', sql: 'DELETE FROM products WHERE id',    ex: 'DELETE /api/products/3', desc: { uz: "Qatorni o'chiradi.", ru: 'Удаляет строку.' } }
  ];
  const [seen, setSeen] = useState(storedAnswer ? new Set(MAP.map(x => x.m)) : new Set());
  const [active, setActive] = useState(storedAnswer ? 'GET' : null);
  const done = seen.size >= 4;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const tap = (m) => { setActive(m); setSeen(s => new Set(s).add(m)); };
  const cur = MAP.find(x => x.m === active);
  const audio = useAudio([{ id: `s${screen}_intro`, text: "To'rtta konvert — to'rtta method. Har biri bazada boshqa ish qiladi: olish, qo'shish, o'zgartirish, o'chirish. Har bir method'ni bosib, u qaysi SQL amaliga to'g'ri kelishini ko'ring.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow="Method ↔ CRUD ↔ SQL" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `${seen.size}/4 method ko'ring`, ru: `Посмотрите методы: ${seen.size}/4` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>To'rt method — <span className="italic" style={{ color: T.accent }}>o'sha CRUD, endi internetda</span></>, ru: <>Четыре метода — <span className="italic" style={{ color: T.accent }}>тот же CRUD, теперь в интернете</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Eng muhim ko'prik: API method'lari o'tgan darsdagi <b style={{ color: T.ink }}>CRUD</b> amallariga to'g'ridan-to'g'ri mos keladi. Postman'da bir tugma bosasiz → server kodi ishlaydi → bazada SQL bajariladi. Har method'ni bosib, ortidagi SQL'ni ko'ring.</>, ru: <>Самый важный мост: методы API напрямую соответствуют операциям <b style={{ color: T.ink }}>CRUD</b> из прошлого урока. Нажимаете кнопку в Postman → работает код сервера → в базе выполняется SQL. Нажмите на каждый метод и посмотрите SQL за ним.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
              {MAP.map(x => (
                <button key={x.m} className={`crud-card ${active === x.m ? 'on' : ''} ${seen.has(x.m) ? 'seen' : 'tap-hint'}`} onClick={() => tap(x.m)} style={active === x.m ? { boxShadow: `0 0 0 2px ${METHODS[x.m]}, 0 8px 18px -6px rgba(0,0,0,0.18)` } : undefined}>
                  <span className="crud-word" style={{ color: METHODS[x.m] }}>{x.m}</span>
                  <span className="crud-uz">{x.crud} {seen.has(x.m) && <span className="tick-pop" style={{ color: T.success }}>✓</span>}</span>
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={cur.m}>
                  <div className="maprow" style={{ marginBottom: 8 }}><MethodBadge method={cur.m} big /><span className="maparrow">→</span><span className="mono small" style={{ color: T.ink2 }}>{cur.crud}</span></div>
                  <p className="mono small" style={{ color: T.ink, margin: '0 0 6px' }}>{cur.ex}</p>
                  <p className="small" style={{ color: T.ink2, margin: '0 0 8px' }}>{tr({ uz: 'Server ortida:', ru: 'На стороне сервера:' })} <span className="mono" style={{ color: T.accent }}>{cur.sql}</span></p>
                  <p className="body" style={{ color: T.ink, margin: 0 }}>{tr(cur.desc)}</p>
                </div>
              : <div className="frame-dash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 130 }}><p className="small" style={{ color: T.ink3, fontStyle: 'italic', textAlign: 'center', margin: 0 }}>{tr({ uz: "← Method'lardan birini bosing", ru: '← Нажмите на один из методов' })}</p></div>}
            {done && <div className="takeaway fade-step"><div className="ta-bulb">🔗</div><p className="ta-h">{tr({ uz: 'API method = baza amali', ru: 'Метод API = операция в базе' })}</p><p className="ta-sub">GET·POST·PUT·DELETE → SELECT·INSERT·UPDATE·DELETE</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — TO'LIQ SAYOHAT (konvert animatsiyasi) =====
const JNODES = [
  { k: 'sayt', label: { uz: 'Sayt', ru: 'Сайт' } },
  { k: 'api', label: 'API' },
  { k: 'server', label: 'Nest server' },
  { k: 'baza', label: { uz: 'Baza', ru: 'База' } }
];
const JSEQ = [
  { idx: 0, dir: 'req', note: { uz: "Sayt so'rov yaratadi: GET /api/products", ru: 'Сайт создаёт запрос: GET /api/products' } },
  { idx: 1, dir: 'req', note: { uz: "API so'rovni qabul qiladi (pochta)", ru: 'API принимает запрос (почта)' } },
  { idx: 2, dir: 'req', note: { uz: 'Nest server kerakli kodni topadi (routing)', ru: 'Nest-сервер находит нужный код (routing)' } },
  { idx: 3, dir: 'req', note: { uz: "Baza SELECT bajaradi — ma'lumotni topadi", ru: 'База выполняет SELECT — находит данные' } },
  { idx: 2, dir: 'res', note: { uz: 'Server javobni JSON qiladi', ru: 'Сервер упаковывает ответ в JSON' } },
  { idx: 1, dir: 'res', note: { uz: 'API javobni ortga uzatadi', ru: 'API передаёт ответ обратно' } },
  { idx: 0, dir: 'res', note: { uz: "Sayt ma'lumotni ekranda ko'rsatadi · 200 OK", ru: 'Сайт показывает данные на экране · 200 OK' } }
];
const NODEPCT = [3, 35, 65, 92];
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? JSEQ.length - 1 : -1);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);
  const done = step >= JSEQ.length - 1;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  const play = () => {
    if (playing) return;
    setPlaying(true); setStep(0);
    let s = 0;
    timer.current = setInterval(() => {
      s += 1;
      if (s >= JSEQ.length) { clearInterval(timer.current); setPlaying(false); return; }
      setStep(s);
    }, 950);
  };
  const cur = step >= 0 ? JSEQ[step] : null;
  const envLeft = cur ? NODEPCT[cur.idx] : NODEPCT[0];
  const envColor = cur ? (cur.dir === 'req' ? T.accent : T.success) : T.ink3;
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Endi konvertning to'liq sayohatini kuzatamiz: saytdan chiqadi, API orqali serverga boradi, baza bilan ishlaydi va javob konverti bo'lib qaytadi. Play bosib, har bosqichni ko'ring.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: "To'liq sayohat", ru: 'Полное путешествие' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Sayohatni ko'ring (▶)", ru: 'Посмотрите путешествие (▶)' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Send bosganda konvert <span className="italic" style={{ color: T.accent }}>shu yo'lni</span> bosib o'tadi</>, ru: <>Когда вы жмёте Send, конверт проходит <span className="italic" style={{ color: T.accent }}>вот этот путь</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Postman (yoki sayt) Send bosganda so'rov konverti: Sayt → API → Nest server → Baza, keyin javob xuddi shu yo'l bilan ortga qaytadi. <b style={{ color: T.accent }}>▶ tugmasini</b> bosib, butun sayohatni kuzating.</>, ru: <>Когда Postman (или сайт) жмёт Send, конверт запроса летит: Сайт → API → Nest-сервер → База, а ответ возвращается тем же путём. Нажмите <b style={{ color: T.accent }}>кнопку ▶</b> и проследите всё путешествие.</> })}</Mentor>
        <div className="jflow">
          {JNODES.map((n, i) => (
            <div key={n.k} className={`jnode ${cur && cur.idx === i ? 'on' : ''}`} style={cur && cur.idx === i ? { boxShadow: `0 0 0 2px ${envColor}` } : undefined}>
              <span className="jnode-ic">{n.k === 'sayt' ? '🖥️' : n.k === 'api' ? '📮' : n.k === 'server' ? '🗄️' : '💾'}</span>
              <span className="jnode-lbl">{tr(n.label)}</span>
            </div>
          ))}
          <div className="jtrack"><span className="jenv" style={{ left: `${envLeft}%`, color: envColor }}>{cur && cur.dir === 'res' ? '📩' : '📨'}</span></div>
        </div>
        <div className="jnote">
          {cur ? <p className="body fade-step" key={step} style={{ margin: 0, color: T.ink }}><span className="mono" style={{ color: envColor, fontWeight: 700 }}>{cur.dir === 'req' ? tr({ uz: "SO'ROV →", ru: 'ЗАПРОС →' }) : tr({ uz: '← JAVOB', ru: '← ОТВЕТ' })}</span> &nbsp;{tr(cur.note)}</p>
            : <p className="small" style={{ margin: 0, color: T.ink3, fontStyle: 'italic' }}>{tr({ uz: '▶ tugmasini bosing — konvert sayohatini boshlang', ru: '▶ Нажмите кнопку — отправьте конверт в путешествие' })}</p>}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {!playing && <button className="btn" onClick={play}>{step < 0 ? tr({ uz: '▶ Sayohatni boshlash', ru: '▶ Начать путешествие' }) : tr({ uz: '↻ Qaytadan', ru: '↻ Заново' })}</button>}
          {done && !playing && <span className="mono small" style={{ color: T.success, alignSelf: 'center' }}>{tr({ uz: '✓ Javob saytga yetib keldi — 200 OK', ru: '✓ Ответ дошёл до сайта — 200 OK' })}</span>}
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TEST 4 =====
const Screen12 = (props) => (
  <QuestionScreen {...props} idx={12} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    questionText={tr({ uz: "Sayt ma'lumot kerak bo'lganda nima qiladi?", ru: 'Что делает сайт, когда ему нужны данные?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Frontend backend bilan <span className="italic" style={{ color: T.accent }}>qanday gaplashadi?</span></>, ru: <>Как фронтенд <span className="italic" style={{ color: T.accent }}>говорит с бэкендом?</span></> })}</h2></>}
    audioText="Sayt ma'lumot kerak bo'lganda bazaga o'zi kira olmaydi — postachi orqali so'raydi. Frontend backend bilan qanday gaplashadi? Tanlang."
    options={[tr({ uz: "Bazaga to'g'ridan-to'g'ri o'zi kirib ma'lumot oladi", ru: 'Сам напрямую заходит в базу и берёт данные' }), tr({ uz: "API'ga so'rov yuboradi, server javob qaytaradi", ru: 'Отправляет запрос в API, сервер возвращает ответ' }), tr({ uz: "Hech kim bilan gaplashmaydi — hammasini o'zi biladi", ru: 'Ни с кем не разговаривает — всё знает сам' }), tr({ uz: "Boshqa saytdan tayyor ma'lumot nusxasini oladi", ru: 'Берёт готовую копию данных с другого сайта' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! Sayt API'ga so'rov (request) yuboradi → server bazada ishlaydi → javob (response) qaytaradi. Sayt bazaga o'zi kira olmaydi.", ru: 'Верно! Сайт отправляет запрос (request) в API → сервер работает с базой → возвращает ответ (response). Сам в базу сайт попасть не может.' })}
    explainWrong={{
      0: tr({ uz: "Sayt bazaga to'g'ridan-to'g'ri kira olmaydi — bu xavfli. U API orqali so'raydi.", ru: 'Сайт не может войти в базу напрямую — это опасно. Он спрашивает через API.' }),
      2: tr({ uz: "Sayt aniq gaplashadi — API orqali serverga so'rov yuboradi.", ru: 'Ещё как разговаривает — отправляет запрос серверу через API.' }),
      3: tr({ uz: "Yo'q — har sayt o'z serveridan API orqali so'raydi.", ru: 'Нет — каждый сайт спрашивает свой сервер через API.' }),
      default: tr({ uz: "Front → API so'rov → server javob.", ru: 'Фронт → запрос в API → ответ сервера.' })
    }} />
);

// ===== SCREEN 13 — AMALIYOT: o'z API'ingizni chaqiring (GET → POST → GET) =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const STEPS = [
    { label: { uz: "1. GET — ro'yxatni ko'r", ru: '1. GET — посмотрите список' }, method: 'GET', url: '/api/products', status: 200, hint: { uz: "GET so'rovini yuboring — hozir 3 mahsulot bor.", ru: 'Отправьте GET-запрос — сейчас в списке 3 товара.' }, data: PRODUCTS },
    { label: { uz: "2. POST — yangi qo'sh", ru: '2. POST — добавьте новый' }, method: 'POST', url: '/api/products', status: 201, body: NEW_PRODUCT, hint: { uz: "Endi POST bilan Mikrofonni qo'shing (201 Created).", ru: 'Теперь добавьте Mikrofon через POST (201 Created).' }, data: { id: 4, nom: 'Mikrofon', narx: 60000, soni: 12 } },
    { label: { uz: "3. GET — qaytadan ko'r", ru: '3. GET — посмотрите снова' }, method: 'GET', url: '/api/products', status: 200, hint: { uz: "Yana GET qiling — endi 4 mahsulot bo'ladi!", ru: 'Снова сделайте GET — теперь товаров будет 4!' }, data: [...PRODUCTS, NEW_PRODUCT] }
  ];
  const [step, setStep] = useState(storedAnswer ? 2 : 0);
  const [sent, setSent] = useState(!!storedAnswer);
  const [sending, setSending] = useState(false);
  const done = step === 2 && sent;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const send = () => { if (sending || sent) return; setSending(true); setTimeout(() => { setSending(false); setSent(true); }, 800); };
  const nextStep = () => { setStep(s => s + 1); setSent(false); };
  const cur = STEPS[step];
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Endi uch so'rovni birma-bir yuborasiz: avval GET bilan ro'yxatni olasiz, keyin POST bilan yangi mahsulot qo'shasiz, so'ng yana GET qilasiz — ro'yxatda to'rtta mahsulot bo'ladi. Boshlang.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot', ru: 'Практика' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "3 so'rovni bajaring", ru: 'Выполните 3 запроса' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'z API'ingizni Postman'da <span className="italic" style={{ color: T.accent }}>chaqiring</span></>, ru: <>Вызовите свой API <span className="italic" style={{ color: T.accent }}>в Postman</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>To'liq yo'lni sinab ko'ring: avval <b style={{ color: METHODS.GET }}>GET</b> bilan ro'yxatni oling, keyin <b style={{ color: METHODS.POST }}>POST</b> bilan yangi mahsulot qo'shing, so'ng yana <b style={{ color: METHODS.GET }}>GET</b> qiling — yangi mahsulot ro'yxatda paydo bo'ladi. Bu — haqiqiy backend ishi.</>, ru: <>Проверьте весь путь: сначала получите список через <b style={{ color: METHODS.GET }}>GET</b>, потом добавьте новый товар через <b style={{ color: METHODS.POST }}>POST</b>, затем снова сделайте <b style={{ color: METHODS.GET }}>GET</b> — новый товар появится в списке. Это настоящая работа бэкендера.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="stepbar">
              {STEPS.map((s, i) => { const ok = i < step || (i === step && sent); const isCur = i === step && !ok; return <span key={i} className={`stepdot ${ok ? 'done' : ''} ${isCur ? 'cur' : ''}`}>{ok ? '✓' : i + 1}</span>; })}
            </div>
            <Postman method={cur.method} url={cur.url} body={cur.body} sending={sending} sent={sent} status={cur.status} onSend={send} sendLabel="Send" sendDisabled={sent}>
              <JsonBox data={cur.data} />
            </Postman>
            {sent && step < 2 && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={nextStep}>{tr({ uz: "Keyingi so'rov →", ru: 'Следующий запрос →' })}</button>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Vazifa:', ru: 'Задача:' })} {tr(cur.label)}</p>
            {done
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>🎉 Ajoyib! Siz GET → POST → GET qildingiz. Oxirgi GET'da <b>4 ta</b> mahsulot — Mikrofon ro'yxatga qo'shildi. Mana shu — API bilan ishlashning to'liq yo'li.</>, ru: <>🎉 Отлично! Вы сделали GET → POST → GET. В последнем GET — <b>4</b> товара: Mikrofon добавился в список. Вот он — полный цикл работы с API.</> })}</p></div>
              : sent
                ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ <b>{cur.status === 201 ? '201 Created' : '200 OK'}</b> — javob keldi. "Keyingi so'rov →" tugmasini bosing.</>, ru: <>✓ <b>{cur.status === 201 ? '201 Created' : '200 OK'}</b> — ответ пришёл. Нажмите «Следующий запрос →».</> })}</p></div>
                : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr(cur.hint)}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — DEBUGGING (noto'g'ri so'rov → 404) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  // AI noto'g'ri URL yozdi: /api/produts (typo) → 404. Topib tuzatamiz.
  const [found, setFound] = useState(!!storedAnswer);
  const [fixed, setFixed] = useState(!!storedAnswer);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(!!storedAnswer);
  const done = sent;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const send = () => { if (sent) return; setSending(true); setTimeout(() => { setSending(false); setSent(true); }, 800); };
  const audio = useAudio([{ id: `s${screen}_intro`, text: "AI siz uchun so'rov yozdi, lekin server 404 shtampini bosib qaytardi — «bunday manzil yo'q». Manzilga diqqat bilan qarang: bitta harf tushib qolgan. Xato qatorni bosib, tuzating.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Tekshiruv · 404', ru: 'Отладка · 404' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (fixed ? tr({ uz: 'Send bosing', ru: 'Нажмите Send' }) : tr({ uz: 'Xatoni toping', ru: 'Найдите ошибку' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>So'rov ishlamadi — <span className="italic" style={{ color: T.accent }}>404? Nega?</span></>, ru: <>Запрос не сработал — <span className="italic" style={{ color: T.accent }}>404? Почему?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>AI siz uchun GET so'rov yozdi, lekin server <b style={{ color: STAT[404][1] }}>404 Not Found</b> qaytardi — "bunday manzil yo'q". Status kodi sizga muammoni darrov aytadi. URL'ga diqqat bilan qarang: bir harf tushib qolgan. Topib, tuzating.</>, ru: <>AI написал для вас GET-запрос, но сервер вернул <b style={{ color: STAT[404][1] }}>404 Not Found</b> — «такого адреса нет». Код статуса сразу подсказывает, в чём проблема. Посмотрите на URL внимательно: потерялась одна буква. Найдите и исправьте.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-1">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: "Mana so'rov:", ru: 'Вот запрос:' })}</span></div>
              <div className="ai-code">
                <div className="ai-line" style={{ cursor: 'default' }}><MethodBadge method="GET" /></div>
                {fixed
                  ? <div className="ai-line ok" style={{ cursor: 'default' }}>/api/products</div>
                  : <div className={`ai-line ${found ? 'bad' : ''}`} onClick={() => setFound(true)}>/api/produts</div>}
              </div>
              {!found && <p className="ai-prompt">{tr({ uz: 'Manzilda xato bor — qatorni bosing.', ru: 'В адресе ошибка — нажмите на строку.' })}</p>}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={() => setFixed(true)}>🔧 produts → products</button>}
              {fixed && !sent && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={send}>{tr({ uz: '▶ Qaytadan Send', ru: '▶ Send ещё раз' })}</button>}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Javob', ru: 'Ответ' })}</p>
            {!fixed
              ? <div className="pm-resp" style={{ marginTop: 0 }}><div className="pm-resp-h"><span className="pm-resp-lbl">Response</span><StatusBadge code={404} punch /></div><div className="pm-respbody"><JsonBox data={{ error: 'Not Found', message: tr({ uz: "Bunday manzil yo'q", ru: 'Такого адреса нет' }) }} /></div></div>
              : !sent
                ? <div className="frame-dash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}><p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Tuzatildi — endi Send bosing', ru: 'Исправлено — теперь нажмите Send' })}</p></div>
                : <><div className="pm-resp" style={{ marginTop: 0 }}><div className="pm-resp-h"><span className="pm-resp-lbl">Response</span><StatusBadge code={200} punch /></div><div className="pm-respbody fade-step"><JsonBox data={PRODUCTS} /></div></div>
                  <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Topdingiz! Bitta harf (s) butun so'rovni ishlatdi. <b>Status kodi — sizning do'stingiz:</b> 404 = manzil noto'g'ri, 200 = hammasi joyida.</>, ru: <>Нашли! Одна буква (s) решила судьбу всего запроса. <b>Код статуса — ваш друг:</b> 404 = адрес неверный, 200 = всё в порядке.</> })}</p></div></>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — YAKUNIY: Postman so'rov-quruvchi =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [method, setMethod] = useState(storedAnswer ? 'POST' : null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const isCorrect = method === 'POST';
  const status = isCorrect ? 201 : (method === 'GET' ? 200 : method === 'DELETE' ? 400 : method === 'PUT' ? 400 : null);
  const body = { nom: 'Mishka', narx: 50000, soni: 10 };
  const send = () => { if (!method || sending) return; setSending(true); setSent(false); setTimeout(() => { setSending(false); setSent(true); }, 850); };
  useEffect(() => {
    if (sent && isCorrect && !passed) { setPassed(true); onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Yangi mahsulot qo'shish uchun to'g'ri so'rovni yig'ing", studentAnswer: method, correct: true, firstAttemptCorrect: true, solved: true, picked: method }); }
  }, [sent, isCorrect]);
  const pickMethod = (m) => { if (passed) return; setMethod(m); setSent(false); };
  const navLabel = passed ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (method ? (sent ? tr({ uz: 'Boshqa method tanlang', ru: 'Выберите другой метод' }) : tr({ uz: '▶ Send bosing', ru: '▶ Нажмите Send' })) : tr({ uz: 'Method tanlang', ru: 'Выберите метод' }));
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Yakuniy vazifa. Konvert deyarli tayyor: manzil ham, ichidagi yangi mahsulot ham yozilgan. Sizdan bitta narsa kerak — to'g'ri shtampni, ya'ni method'ni tanlash. Tanlab, Send bosing.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Vazifa: bazaga <span className="italic" style={{ color: T.accent }}>yangi mahsulot qo'shing</span></>, ru: <>Задача: добавьте в базу <span className="italic" style={{ color: T.accent }}>новый товар</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Postman tayyor: URL <span className="mono">/api/products</span> va BODY (yangi mahsulot) yozilgan. Sizdan bittagina narsa kerak — <b style={{ color: T.ink }}>to'g'ri METHOD'ni tanlang</b>. "Yangi narsa qo'shish" qaysi method edi? Tanlab, <b style={{ color: T.ink }}>Send</b> bosing.</>, ru: <>Postman готов: URL <span className="mono">/api/products</span> и BODY (новый товар) уже написаны. От вас нужно одно — <b style={{ color: T.ink }}>выбрать правильный METHOD</b>. Какой метод был «добавить новое»? Выберите и нажмите <b style={{ color: T.ink }}>Send</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <Postman method={method} url="/api/products" body={body} methodPicker onMethod={pickMethod}
              sending={sending} sent={sent} status={status} onSend={send} sendDisabled={!method} sendLabel="Send">
              {isCorrect
                ? <JsonBox data={{ id: 4, ...body }} />
                : <JsonBox data={method === 'GET' ? PRODUCTS : { error: tr({ uz: "Bu method yangi mahsulot qo'shmaydi", ru: 'Этот метод не добавляет новый товар' }) }} />}
            </Postman>
          </Col>
          <Col>
            <div className="fade-up delay-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tagpill" style={{ opacity: method ? 1 : 0.4, color: method ? T.success : T.ink }}>{method ? '✓' : '1'} {tr({ uz: 'Method tanlandi', ru: 'Метод выбран' })}</span>
              <span className="tagpill" style={{ opacity: sent ? 1 : 0.4, color: sent ? T.success : T.ink }}>{sent ? '✓' : '2'} {tr({ uz: 'Send bosildi', ru: 'Send нажат' })}</span>
              <span className="tagpill" style={{ opacity: passed ? 1 : 0.4, color: passed ? T.success : T.ink }}>{passed ? '✓' : '3'} 201 Created</span>
            </div>
            {passed
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>🎉 Tabriklaymiz! <b>POST</b> bilan yangi mahsulot qo'shildi — <b>201 Created</b>. Siz endi API bilan gaplasha olasiz!</>, ru: <>🎉 Поздравляем! Новый товар добавлен через <b>POST</b> — <b>201 Created</b>. Теперь вы умеете говорить с API!</> })}</p></div>
              : sent && !isCorrect
                ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{method === 'GET' ? tr({ uz: "GET faqat o'qiydi — ro'yxat keldi, lekin yangi narsa qo'shilmadi.", ru: 'GET только читает — список пришёл, но ничего нового не добавилось.' }) : tr({ uz: "Bu method yangi mahsulot qo'shmaydi.", ru: 'Этот метод не добавляет новый товар.' })} {tr({ uz: <>Yangi narsa <b>yaratish</b> qaysi method edi? Qayta tanlang.</>, ru: <>Какой метод <b>создаёт</b> новое? Выберите снова.</> })}</p></div>
                : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'Maslahat: GET=o\'qish, POST=qo\'shish, PUT=o\'zgartirish, DELETE=o\'chirish. Sizga "qo\'shish" kerak.', ru: 'Подсказка: GET=чтение, POST=добавление, PUT=изменение, DELETE=удаление. Вам нужно «добавить».' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
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
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda", ru: '↻ Учу' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span><span className="fc-cue">{tr({ uz: "Javobni o'ylang", ru: 'Подумайте над ответом' })} 🤔 <span className="fc-tap">{tr({ uz: 'bosing', ru: 'нажмите' })}</span></span></div>
          <div className="fc-face fc-back"><span className="fc-tag">{tr(card.back)}</span>{card.note && <span className="fc-note">{tr(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : (<p className="fc-hint">{tr({ uz: "👆 Kartani bosing — javobni ko'rasiz", ru: '👆 Нажмите на карточку — увидите ответ' })}</p>)}
    </div>
  );
}
// 🃏 API/POSTMAN FLASHCARD KARTALARI (front=savol, back=qisqa javob, note=bir qatorlik misol)
const API_FLASHCARDS = [
  { front: { uz: "Sayt server bilan nima orqali gaplashadi?", ru: 'Через что сайт общается с сервером?' }, back: "API", note: { uz: "pochta kabi: xat boradi, javob qaytadi", ru: 'как почта: письмо ушло — ответ вернулся' } },
  { front: { uz: "So'rov (request) qaysi qismlardan yig'iladi?", ru: 'Из каких частей собирается запрос (request)?' }, back: "METHOD + URL (+ BODY)", note: { uz: "niyat + manzil + ichidagi ma'lumot", ru: 'намерение + адрес + содержимое' } },
  { front: { uz: "Javob (response) qaysi ikki qismdan iborat?", ru: 'Из каких двух частей состоит ответ (response)?' }, back: "STATUS + DATA", note: { uz: "shtamp va JSON ma'lumot", ru: 'штамп и данные в JSON' } },
  { front: { uz: "Ma'lumotni o'qib olish uchun qaysi method?", ru: 'Каким методом прочитать данные?' }, back: "GET", note: { uz: "hech narsani o'zgartirmaydi", ru: 'ничего не меняет' } },
  { front: { uz: "Yangi ma'lumot qo'shish uchun qaysi method?", ru: 'Каким методом добавить новые данные?' }, back: "POST", note: { uz: "yangi ma'lumot BODY'da ketadi", ru: 'новые данные едут в BODY' } },
  { front: { uz: "Mavjud narxni yangilash uchun qaysi method?", ru: 'Каким методом обновить существующую цену?' }, back: "PUT", note: { uz: "yozuv o'chmaydi, ichi yangilanadi", ru: 'запись не исчезает — обновляется' } },
  { front: { uz: "Yozuvni o'chirish uchun qaysi method?", ru: 'Каким методом удалить запись?' }, back: "DELETE", note: "DELETE /api/products/3" },
  { front: { uz: "GET bazadagi qaysi amalga to'g'ri keladi?", ru: 'Какой операции в базе соответствует GET?' }, back: "SELECT", note: { uz: "POST → INSERT, PUT → UPDATE", ru: 'POST → INSERT, PUT → UPDATE' } },
  { front: { uz: "200 va 201 shtamplari nimani bildiradi?", ru: 'Что означают штампы 200 и 201?' }, back: { uz: "Hammasi joyida", ru: 'Всё в порядке' }, note: { uz: "200 — o'qildi, 201 — yangi yozuv yaratildi", ru: '200 — прочитано, 201 — создана новая запись' } },
  { front: { uz: "404 shtampi nimani aytadi?", ru: 'О чём говорит штамп 404?' }, back: { uz: "Manzil topilmadi", ru: 'Адрес не найден' }, note: { uz: "URL'ni tekshiring — harf xato bo'lishi mumkin", ru: 'проверьте URL — возможна опечатка' } },
  { front: { uz: "Sayt yozmasdan API'ni qaysi dasturda sinaysiz?", ru: 'В какой программе испытать API, не написав сайт?' }, back: "Postman", note: { uz: "so'rovni o'zingiz yig'ib jo'natasiz", ru: 'запрос собираете и отправляете сами' } },
  { front: { uz: "Konvert ichidagi ma'lumot qaysi formatda yoziladi?", ru: 'В каком формате пишутся данные внутри конверта?' }, back: "JSON", note: { uz: "kalit: qiymat juftliklari", ru: 'пары ключ: значение' } },
];

const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Bugungi tushunchalarni tez takrorlaymiz. Har kartada bitta savol turadi — javobini o'ylang, keyin kartani bosib tekshiring. Bildim yoki Takrorlash bilan o'zingizni baholang.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tushunchalarni <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <>Быстро повторим <span className="italic" style={{ color: T.accent }}>понятия</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Darsni yakunlashdan oldin bugun o'rgangan tushunchalarni takrorlaymiz. Har kartada bir savol — <b style={{ color: T.ink }}>javobini</b> o'ylang, keyin kartani bosib tekshiring. <b style={{ color: T.ink }}>Bildim</b> yoki <b style={{ color: T.ink }}>Takrorlash</b> bilan baholang.</>, ru: <>Перед тем как завершить урок, повторим сегодняшние понятия. На каждой карточке — вопрос: подумайте, <b style={{ color: T.ink }}>каким будет ответ</b>, потом нажмите на карточку и проверьте себя. Оцените себя кнопками <b style={{ color: T.ink }}>Знаю</b> и <b style={{ color: T.ink }}>Повторить</b>.</> })}</Mentor>
        <div className="fc-center"><Flashcards cards={API_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};
// ===== 🏅 BADGES (nishonlar) — dars davomidagi REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  envelopeBuilder: { icon: '📮', name: 'Envelope Builder!', desc: { uz: "GET → POST → GET — konvertlarni o'zingiz yig'ib jo'natdingiz", ru: 'GET → POST → GET — вы сами собрали и отправили конверты' } },
  stampReader:     { icon: '🔖', name: 'Stamp Reader!',     desc: { uz: "404 shtampini o'qib, xatoni topib tuzatdingiz", ru: 'Вы прочитали штамп 404, нашли и исправили ошибку' } },
  testMaster:      { icon: '🎓', name: 'Test Master!',      desc: { uz: "Method va CRUD mosligini to'g'ri aniqladingiz", ru: 'Вы верно сопоставили методы и операции CRUD' } },
  levelUp:         { icon: '🚀', name: 'Level Up!',         desc: { uz: "To'g'ri so'rovni yig'ib, yangi mahsulot qo'shdingiz", ru: 'Вы собрали правильный запрос и добавили новый товар' } },
};
// Ekran id → nishon (recordAnswer'da, faqat REAL solve bilan: SCORED test / challenge / final)
const ACH_TRIGGERS = { s12: 'testMaster', s13: 'envelopeBuilder', s14: 'stampReader', s15: 'levelUp' };

// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI
function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr({ uz: 'Yangi nishon:', ru: 'Новый значок:' })} ${ach.name}`}>
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
          {ach.desc && <span className="acu-desc">{tr(ach.desc)}</span>}
        </div>
        <span className="acu-tap">{tr({ uz: 'bosib davom eting', ru: 'нажмите, чтобы продолжить' })}</span>
      </div>
    </div>
  );
}
// Navbatda bittasi ko'rsatiladi — tugagach keyingisi chiqadi
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
// Podium savol yorliqlari (SCORED_IDX indekslariga mos)
const Q_LABELS = { 4: "1 — API", 6: "2 — GET", 10: { uz: "3 — method", ru: '3 — метод' }, 13: { uz: "4 — front↔back", ru: '4 — фронт↔бэк' }, 16: { uz: "5 — yakuniy", ru: '5 — финал' } };

const QUIZ_MS = 15000;

// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si (GET / POST / status / Postman)
const QZ_BG_SHAPES = [
  { ch: 'GET',    l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: 'POST',   l: 84, t: 7,  s: 30, d: 23, dl: 1.5 },
  { ch: '200 OK', l: 8,  t: 72, s: 28, d: 27, dl: 0.8 },
  { ch: '201',    l: 78, t: 68, s: 30, d: 21, dl: 2.2 },
  { ch: '404',    l: 44, t: 86, s: 30, d: 25, dl: 1.1 },
  { ch: 'Send',   l: 66, t: 26, s: 28, d: 17, dl: 0.4 },
  { ch: 'URL',    l: 26, t: 34, s: 28, d: 20, dl: 1.9 },
  { ch: 'BODY',   l: 55, t: 5,  s: 26, d: 22, dl: 0.6 },
  { ch: 'JSON',   l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: 'PUT',    l: 16, t: 52, s: 28, d: 26, dl: 2.6 },
  { ch: 'DELETE', l: 36, t: 60, s: 26, d: 18, dl: 1.7 },
];

// ⚔️ Mustahkamlash-jang savollari — API/Postman. To'g'ri javoblar 4 pozitsiyaga TENG (12: 3/3/3/3).
const QUIZ_BANK = [
  { q: { uz: "`GET` so'rovi nima qiladi?", ru: 'Что делает запрос `GET`?' }, opts: [ { uz: "Ma'lumotni bazadan butunlay o'chiradi", ru: 'Полностью удаляет данные из базы' }, { uz: "Serverga butunlay yangi ma'lumot qo'shib yozadi", ru: 'Записывает на сервер совершенно новые данные' }, { uz: "Serverni butunlay o'chirib qo'yadi", ru: 'Полностью выключает сервер' }, { uz: "Ma'lumotni o'qib oladi (o'zgartirmaydi)", ru: 'Читает данные (не меняет их)' }], correct: 3 },
  { q: { uz: "API nima?", ru: 'Что такое API?' }, opts: [{ uz: "Ikki dastur gaplashadigan til va qoidalar", ru: 'Язык и правила, на которых общаются две программы' }, { uz: "Server rasmlari saqlanadigan katta papka", ru: 'Большая папка, где хранятся картинки сервера' }, { uz: "Sayt sahifasini bezaydigan chizish vositasi", ru: 'Инструмент для рисования дизайна сайта' }, { uz: "Internet tezligini oshiradigan maxsus asbob", ru: 'Специальный прибор для ускорения интернета' }], correct: 0 },
  { q: { uz: "`201 Created` statusi nimani bildiradi?", ru: 'Что означает статус `201 Created`?' }, opts: [ { uz: "Server javob bermay o'chib qoldi", ru: 'Сервер выключился, не ответив' }, { uz: "Yangi ma'lumot muvaffaqiyatli yaratildi", ru: 'Новые данные успешно созданы' }, { uz: "So'rovda tuzatib bo'lmaydigan xatolik bor", ru: 'В запросе неисправимая ошибка' }, { uz: "So'ralgan manzil serverda topilmadi", ru: 'Запрошенный адрес не найден на сервере' }], correct: 1 },
  { q: { uz: "`POST` so'rovida BODY nima uchun kerak?", ru: 'Зачем нужен BODY в запросе `POST`?' }, opts: [{ uz: "Sahifani chiroyli ko'rsatib turishi uchun", ru: 'Чтобы страница красиво выглядела' }, { uz: "Server javobini tezlashtirish uchun", ru: 'Чтобы ускорить ответ сервера' }, { uz: "Qo'shiladigan yangi ma'lumotni tashish uchun", ru: 'Чтобы передать добавляемые новые данные' }, { uz: "So'rov manzilini yashirib qo'yish uchun", ru: 'Чтобы спрятать адрес запроса' }], correct: 2 },
  { q: { uz: "Postman qanday asbob?", ru: 'Что за инструмент Postman?' }, opts: [{ uz: "Sayt dizaynini chizadigan grafik dastur", ru: 'Графическая программа для рисования дизайна' }, { uz: "Serverga faqat rasm yuklab beradi", ru: 'Только загружает картинки на сервер' }, { uz: "Frontend yozmasdan API'ni sinaydi", ru: 'Тестирует API без написания фронтенда' }, { uz: "Bazadagi ma'lumotni o'chirib tashlaydi", ru: 'Стирает данные из базы' }], correct: 2 },
  { q: { uz: "`404 Not Found` nima demoqchi?", ru: 'О чём говорит `404 Not Found`?' }, opts: [{ uz: "Ma'lumot muvaffaqiyatli qaytib keldi", ru: 'Данные успешно вернулись' }, { uz: "So'ralgan manzil topilmadi", ru: 'Запрошенный адрес не найден' }, { uz: "Yangi yozuv muvaffaqiyatli yaratildi", ru: 'Новая запись успешно создана' }, { uz: "Serverga kirish taqiqlab qo'yilgan", ru: 'Доступ к серверу запрещён' }], correct: 1 },
  { q: { uz: "Mahsulot narxini yangilash uchun qaysi method?", ru: 'Каким методом обновить цену товара?' }, opts: [ "POST", "DELETE","GET", "PUT"], correct: 3 },
  { q: { uz: "So'rov (request) qismlari qaysilar?", ru: 'Из чего состоит запрос (request)?' }, opts: [ "METHOD + URL (+ BODY)", { uz: "Faqat rang, shrift va bezaklar", ru: 'Только цвета, шрифты и украшения' }, { uz: "Faqat rasm va videolar", ru: 'Только картинки и видео' }, { uz: "Faqat login va parol", ru: 'Только логин и пароль' }], correct: 0 },
  { q: { uz: "`DELETE /api/products/3` nima qiladi?", ru: 'Что сделает `DELETE /api/products/3`?' }, opts: [ { uz: "3-mahsulotni o'chiradi", ru: 'Удалит товар с id 3' }, { uz: "Yangi mahsulot qo'shadi", ru: 'Добавит новый товар' }, { uz: "Ro'yxatni o'qib beradi", ru: 'Прочитает и вернёт список' }, { uz: "Narxni oshirib qo'yadi", ru: 'Поднимет цену' }], correct: 0 },
  { q: { uz: "`GET` bazadagi qaysi SQL amaliga to'g'ri keladi?", ru: 'Какой SQL-операции соответствует `GET`?' }, opts: ["INSERT", "UPDATE", "SELECT", "DELETE"], correct: 2 },
  { q: { uz: "Sayt ma'lumot kerak bo'lganda nima qiladi?", ru: 'Что делает сайт, когда ему нужны данные?' }, opts: [{ uz: "Bazaga to'g'ridan-to'g'ri o'zi kiradi", ru: 'Сам напрямую заходит в базу' }, { uz: "Hech kim bilan bog'lanmay o'zi ishlaydi", ru: 'Работает сам, ни с кем не связываясь' }, { uz: "Boshqa saytdan tayyor nusxa oladi", ru: 'Берёт готовую копию с другого сайта' }, { uz: "API'ga so'rov yuboradi, javob oladi", ru: 'Отправляет запрос в API и получает ответ' }], correct: 3 },
  { q: { uz: "Javob konverti (response) nimalardan iborat?", ru: 'Из чего состоит конверт-ответ (response)?' }, opts: [{ uz: "Faqat ichiga solingan bitta rasm fayli", ru: 'Только один вложенный файл-картинка' }, { uz: "STATUS (shtamp) + DATA (JSON)", ru: 'STATUS (штамп) + DATA (JSON)' }, { uz: "Faqat foydalanuvchi paroli", ru: 'Только пароль пользователя' }, { uz: "Faqat so'rov manzili (URL)", ru: 'Только адрес запроса (URL)' }], correct: 1 },
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
// ===== ⚔️ MUSTAHKAMLASH-JANG (Kahoot arena) — signal zonasi: 100+ (test <100, praktika 500+ bilan to'qnashmaydi) =====
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
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

// Jonli fon: suzuvchi uchqunlar + «web» chiziqlari + kod tokenlari (canvas)
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
    const TOK = ['GET', 'POST', '200 OK', '201', '404', 'Send', 'URL', 'BODY', 'JSON', '📮'];
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
  const [phase, setPhase] = useState('lobby'); // lobby | q | reveal | done
  const [qi, setQi] = useState(-1);
  const [remaining, setRemaining] = useState(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState({}); // {qi: {picked, correct, elapsed}}
  const [players, setPlayers] = useState([]);
  const [qRows, setQRows] = useState([]);
  const [answeredN, setAnsweredN] = useState(0);
  const [classEnded, setClassEnded] = useState(false);
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

  // Taymer — 100ms; vaqt tugasa javob ochiladi. MENTOR serverni ham 'r' ga o'tkazadi.
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
      if (typeof window !== 'undefined' && !window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать в арене.\nВсё равно закрыть?' }))) return;
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

      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжайте тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме тренировки' })}</button>
        </div>
      )}

      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Серия верных ответов даёт 🔥 бонус!' })}</p>
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Будьте быстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас на ${myRank + 1}-м месте` })}</span>}
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

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? tr({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · лучшая серия 🔥x${soloScore.maxStreak}` }) : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>{tr({ uz: '↻ Qayta ishlash', ru: '↻ Пройти ещё раз' })}</button>
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
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{myRank + 1}-{tr({ uz: "o'rin", ru: 'е место' })}</b> · {board[myRank].pts} {tr({ uz: 'ball', ru: 'баллов' })}</p>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест ещё раз — тренировка (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}
// ===== 🏆 PODIUM / STATISTIKA — jonli reyting (jonli-ulanishni ⚡ Jonli qiladi; self-mode fallback tayyor) =====
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
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Загружаем результаты…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не подключился.' })}</p></div>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{myIdx + 1}-{tr({ uz: "o'rin", ru: 'е место' })}</b> ({board[myIdx].okCount}/{totalQ} {tr({ uz: "to'g'ri", ru: 'верно' })})</p>}
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
          </>
        )}
      </div>
    </Stage>
  );
};
const PRACTICE_BASE = 500;
// Mentor ko'rinishi sloti — "kim bajardi" jonli chiplar paneli. JONLI roli to'ldiradi.
const MentorPracticeStats = ({ live, screen }) => {
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
  const players = data.players || [];
  const doers = players.filter(p => data.doneIds.has(p.id));
  const waiting = players.filter(p => !data.doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{tr({ uz: '👀 Kim bajardi —', ru: '👀 Кто выполнил —' })} {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружаем…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не подключился.' })}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.successSoft, color: T.success }}>✓ {p.nickname}</span>)}
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ opacity: 0.6 }}>⏳ {p.nickname}</span>)}
        </div>
      )}
    </div>
  );
};
function ScreenLivePractice({ title, task, checklist, screen, storedAnswer, onAnswer, onNext, onPrev, live }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const [checked, setChecked] = useState(() => new Set());
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const toggle = (i) => setChecked(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; });
  const complete = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: (title && title.uz) || title, solved: true, correct: true, picked: true }); // payload UZ-etalon
    // JONLI: praktika bajarilgani serverga yoziladi (500+ zona — reytingga aralashmaydi, faqat mentor ko'radi)
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  // JONLI: mentor keyingi sahifaga o'tmaguncha NavNext qulf bo'ladi (optionalLive + LiveGateCtx gate). Hozircha done bo'lsa ochiq.
  const audio = useAudio([{ id: `practice_${screen}`, text: `Endi navbat sizda — bu topshiriqni o'z kompyuteringizda, VS Code'da bajarasiz. So'rovlarni Postman yoki Thunder Client'da yuborasiz. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Отмечайте каждый шаг по мере выполнения. Когда закончите, нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — наставник наблюдает.</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="lp-task fade-up delay-1">
              <div className="lp-task-h"><span className="lp-task-badge">{tr({ uz: 'TOPSHIRIQ', ru: 'ЗАДАНИЕ' })}</span></div>
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr(task)}</p>
            </div>
            <MentorPracticeStats live={_live} screen={screen} />
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Bosqichlar — belgilab boring', ru: 'Шаги — отмечайте по ходу' })}</p>
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
            <button className={`lp-done-btn ${done ? 'is-done' : ''}`} disabled={done} onClick={complete}>
              {done ? tr({ uz: '✓ Bajarildi — ustozni kuting', ru: '✓ Выполнено — ждите наставника' }) : tr({ uz: '✅ Bajardim', ru: '✅ Выполнил' })}
            </button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: 'Отлично! Задание выполнено. Наставник проверит и переведёт вас на следующий шаг.' })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
}
const ScreenPostmanPractice = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "Postman'da o'z API'ingizni sinang", ru: 'Проверьте свой API в Postman' }}
    task={{ uz: "O'z serveringizga (yoki ochiq API'ga) Postman yoki Thunder Client orqali GET va POST so'rov yuboring — qaytgan status shtampini (200/201) va JSON javobni o'qing.", ru: 'Отправьте GET- и POST-запросы к своему серверу (или открытому API) через Postman или Thunder Client — прочитайте штамп статуса (200/201) и JSON-ответ.' }}
    checklist={[
      { uz: "Postman yoki VS Code'dagi Thunder Client'ni oching", ru: 'Откройте Postman или Thunder Client в VS Code' },
      { uz: "`GET /api/products` so'rovini yuboring — Send bosing", ru: 'Отправьте запрос `GET /api/products` — нажмите Send' },
      { uz: "Qaytgan `200 OK` shtampini va JSON ro'yxatni ko'ring", ru: 'Посмотрите вернувшийся штамп `200 OK` и JSON-список' },
      { uz: "`POST /api/products` tanlab, BODY'ga yangi mahsulot yozing", ru: 'Выберите `POST /api/products` и напишите в BODY новый товар' },
      { uz: "Send bosing — `201 Created` shtampini o'qing", ru: 'Нажмите Send — прочитайте штамп `201 Created`' },
      { uz: "Yana `GET` qiling — yangi mahsulot ro'yxatda paydo bo'lganini tekshiring", ru: 'Снова сделайте `GET` — проверьте, что новый товар появился в списке' },
    ]} />
);


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
  const RECAP = [
    { uz: "API — sayt va server gaplashadigan til/qoidalar", ru: 'API — язык/правила, на которых общаются сайт и сервер' },
    { uz: "So'rov = METHOD + URL (+ BODY); javob = STATUS + DATA", ru: 'Запрос = METHOD + URL (+ BODY); ответ = STATUS + DATA' },
    "GET·POST·PUT·DELETE = SELECT·INSERT·UPDATE·DELETE",
    { uz: "Postman — frontend yozmasdan API'ni sinash asbobi", ru: 'Postman — инструмент для проверки API без фронтенда' },
    { uz: "Status: 200 OK · 201 Created · 404 Not Found", ru: 'Статусы: 200 OK · 201 Created · 404 Not Found' }
  ];
  const HOMEWORK = [
    { b: { uz: "Postman'ni o'rnating", ru: 'Установите Postman' }, t: { uz: "— postman.com'dan yuklab oling (bepul)", ru: '— скачайте с postman.com (бесплатно)' } },
    { b: { uz: "Ochiq API'ni chaqiring", ru: 'Вызовите открытый API' }, t: { uz: "— GET so'rov yuboring va kelgan JSON javobni ko'ring", ru: '— отправьте GET-запрос и посмотрите пришедший JSON' } },
    { b: { uz: "4 method'ni eslang", ru: 'Запомните 4 метода' }, t: { uz: "— har biri qaysi CRUD amaliga to'g'ri kelishini yozib chiqing", ru: '— выпишите, какой операции CRUD соответствует каждый' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const audio = useAudio([{ id: `s${screen}_intro`, text: "Ajoyib! Endi siz API bilan gaplasha olasiz: so'rov konvertini yuborasiz, javob konvertini o'qiysiz, to'rtta method'ni bilasiz. Uy vazifasini bajaring va Postman'da mashq qiling.", trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi siz <span className="italic" style={{ color: T.accent }}>API bilan</span> gaplasha olasiz.</>, ru: <>Теперь вы умеете <span className="italic" style={{ color: T.accent }}>говорить с API</span>.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: "Tabriklaymiz! So'rov-javob, 4 method va Postman — front backend bilan qanday gaplashishini to'liq tushundingiz.", ru: 'Поздравляем! Запрос-ответ, 4 метода и Postman — вы полностью поняли, как фронт говорит с бэком.' }) : tr({ uz: "Yaxshi harakat! Method'lar va so'rov-javobni mustahkamlash uchun bir-ikki ekranni qayta ko'ring.", ru: 'Хорошая работа! Чтобы закрепить методы и запрос-ответ, пересмотрите пару экранов.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "Keyingi: Backend praktika — o'z CRUD loyihangiz. Keyin NestJS bilan API'ni professional yozamiz! 🚀", ru: 'Дальше: практика по бэкенду — ваш собственный CRUD-проект. А потом напишем API профессионально на NestJS! 🚀' })}</p></div>
        </div>
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '🏅 Nishonlaringiz —', ru: '🏅 Ваши значки —' })} {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
              <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={tr(a.desc)}>
                <span className="ach-badge-ic">{got ? a.icon : '🔒'}</span>
                <span className="ach-badge-name">{a.name}</span>
                {got && <span className="ach-badge-desc">{tr(a.desc)}</span>}
              </div>
            ); })}
          </div>
        </div>}
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function ApiPostmanLesson({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState({});
  const startTimeRef = useRef(Date.now());
  // 🏅 Nishonlar
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
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat REAL solve)
    if (_m && _m.scored && _m.scope === 'final' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0); // final submit (M4-P1 xato-sinfi)
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenPostmanPractice, ScreenPodium, ScreenFlashcards, Screen16];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
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

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.ink}; color: ${T.bg}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }

        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }
        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }

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

        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .hook-option:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.16); }
        .bp-bar { background: #f0eee8; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-title { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; transition: color 0.3s; }
        .bp-body { padding: clamp(12px,2.2vw,18px); }

        .h-title { font-size: clamp(22px,4vw,38px); }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
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

        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        .screen { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        .demo-swap { animation: fade-step 0.3s ease-out; }

        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; white-space: pre-wrap; } .ai-line:hover { background: rgba(255,255,255,0.06); }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.12); overflow: hidden; }
        .gloss-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 17px; cursor: pointer; } .gloss-head .lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; } .gloss-toggle { font-size: 18px; color: ${T.ink2}; }
        .gloss-body { padding: 0 17px 15px; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; line-height: 1.7; animation: fade-step 0.3s; } .gloss-body b { color: ${T.ink}; }

        /* === 4-MODUL · 6-DARS: API + POSTMAN === */
        /* JSON ko'rinishi */
        .json-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(11.5px,1.45vw,13px); line-height: 1.6; padding: 12px 14px; border-radius: 10px; margin: 0; overflow-x: auto; white-space: pre; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04); }
        .json-box.sm { font-size: 11.5px; padding: 9px 11px; line-height: 1.5; }
        .json-box .j-key { color: ${CODE.attr}; } .json-box .j-str { color: ${CODE.str}; } .json-box .j-num { color: #7FB3FF; }

        /* method badge */
        .mbadge { font-family: 'JetBrains Mono', monospace; font-weight: 700; border-radius: 6px; letter-spacing: 0.03em; display: inline-block; }
        .maprow { display: flex; align-items: center; gap: 10px; }
        .maparrow { font-family: 'JetBrains Mono'; font-weight: 700; color: ${T.ink3}; }

        /* status badge */
        /* Javob shtampi — server bosgan retro pochta muhri (qiya, ikki halqali) */
        .status-badge { display: inline-block; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11.5px; letter-spacing: 0.05em; text-transform: uppercase; padding: 2px 9px; border-radius: 6px; white-space: nowrap; border: 2px solid currentColor; transform: rotate(-3.5deg); box-shadow: inset 0 0 0 1.5px ${T.paper}; }
        /* 📭 SHTAMP «bosilib urilish» — server javob-konvertga muhr bosadi (darsning yodda qoladigan lahzasi) */
        .status-badge.sb-ok { animation: sb-punch-ok .52s cubic-bezier(.3,1.45,.5,1) both; }
        .status-badge.sb-err { animation: sb-punch-err .62s cubic-bezier(.34,1.2,.5,1) both; transform-origin: center; }
        .status-badge.sb-warn { animation: sb-punch-warn .62s cubic-bezier(.34,1.2,.5,1) both; transform-origin: center; }
        /* yashil 200/201 — yumshoq bounce */
        @keyframes sb-punch-ok { 0% { transform: rotate(-3.5deg) scale(2.3); opacity: 0; } 40% { transform: rotate(-3.5deg) scale(.84); opacity: 1; } 62% { transform: rotate(-3.5deg) scale(1.12); } 80% { transform: rotate(-3.5deg) scale(.96); } 100% { transform: rotate(-3.5deg) scale(1); } }
        /* qizil 404 — bosilib, keyin titrash (qaltirash) */
        @keyframes sb-punch-err { 0% { transform: rotate(-3.5deg) scale(2.3); opacity: 0; } 34% { transform: rotate(-3.5deg) scale(.9); opacity: 1; } 46% { transform: rotate(-3.5deg) translateX(-3px); } 56% { transform: rotate(-3.5deg) translateX(3px); } 66% { transform: rotate(-3.5deg) translateX(-2.5px); } 76% { transform: rotate(-3.5deg) translateX(2px); } 86% { transform: rotate(-3.5deg) translateX(-1px); } 100% { transform: rotate(-3.5deg) translateX(0); } }
        /* to'q sariq 400 — bosilib, keyin silkinish (burchak titrash) */
        @keyframes sb-punch-warn { 0% { transform: rotate(-3.5deg) scale(2.3); opacity: 0; } 34% { transform: rotate(-3.5deg) scale(.9); opacity: 1; } 50% { transform: rotate(-11deg) scale(1.04); } 64% { transform: rotate(2deg); } 78% { transform: rotate(-7deg); } 90% { transform: rotate(-1deg); } 100% { transform: rotate(-3.5deg); } }
        /* shtamp URILGANDA — ostidan zarba to'lqini tarqaladi */
        .status-badge.sb-punch { position: relative; }
        .status-badge.sb-punch::after { content: ''; position: absolute; inset: -5px; border-radius: 9px; border: 2px solid currentColor; opacity: 0; pointer-events: none; animation: sb-ripple 0.6s ease-out 0.14s both; }
        @keyframes sb-ripple { 0% { transform: scale(0.72); opacity: 0.5; } 100% { transform: scale(1.55); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .status-badge.sb-ok, .status-badge.sb-err, .status-badge.sb-warn { animation: sb-punch-calm .3s ease-out both; } @keyframes sb-punch-calm { from { opacity: 0; } to { opacity: 1; } } .status-badge.sb-punch::after { display: none; } }

        /* POSTMAN mock */
        .postman { background: ${T.paper}; border-radius: 13px; overflow: hidden; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.18); }
        /* Postman ilova oynasi — chrome: dots + ilova nomi + so'rov tab'i (haqiqiy dastur ko'rinishi) */
        .pm-chrome { display: flex; align-items: center; gap: 9px; padding: 8px 11px 0; background: #f0eee8; }
        .pm-app { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.04em; color: ${T.ink2}; padding-bottom: 8px; }
        .pm-app::before { content: ''; width: 9px; height: 9px; border-radius: 50%; background: ${T.accent}; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.85); }
        .pm-chrome .bb-dots { padding-bottom: 8px; }
        .pm-tab { margin-left: auto; max-width: 58%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10.5px; font-weight: 600; color: ${T.ink2}; background: #FBFAF7; border-radius: 7px 7px 0 0; padding: 6px 11px; }
        .pm-bar { display: flex; align-items: center; gap: 8px; padding: 9px 10px; background: #FBFAF7; border-bottom: 1px solid #EFECE5; }
        .pm-method { font-family: 'JetBrains Mono'; font-weight: 800; font-size: 13px; padding: 5px 10px; border-radius: 8px; background: ${T.bg}; flex-shrink: 0; }
        .pm-methods { display: flex; gap: 4px; flex-shrink: 0; }
        .pm-mbtn { font-family: 'JetBrains Mono'; font-weight: 800; font-size: 11px; border: none; border-radius: 7px; padding: 5px 8px; cursor: pointer; transition: all 0.15s; }
        .pm-mbtn:hover { transform: translateY(-1px); }
        .pm-url { flex: 1; min-width: 0; font-size: 12.5px; font-weight: 600; color: ${T.ink}; overflow-x: auto; white-space: nowrap; padding: 4px 8px; background: #fff; border-radius: 7px; box-shadow: inset 0 0 0 1px #EFECE5; }
        .pm-send { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: #fff; background: ${T.accent}; border: none; border-radius: 8px; padding: 6px 16px; cursor: pointer; flex-shrink: 0; transition: all 0.16s; }
        .pm-send:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(255,79,40,0.5); }
        .pm-send:disabled { opacity: 0.4; cursor: not-allowed; }
        .pm-body { padding: 9px 11px; border-bottom: 1px solid #EFECE5; }
        .pm-bodylbl { font-family: 'Manrope'; font-weight: 700; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.ink3}; display: block; margin-bottom: 5px; }
        /* Javob paneli: Postman oynasi ichida — tekis; yakka holda (14-ekran) — o'z kartasi */
        .pm-resp { padding: 10px 12px; background: ${T.paper}; border-radius: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); }
        .postman .pm-resp { border-radius: 0; box-shadow: none; }
        .pm-resp-h { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }
        .pm-resp-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.ink3}; }
        .pm-loading { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono'; font-size: 13px; color: ${T.accent}; padding: 14px 4px; }
        /* SEND MOMENTI — konvert haqiqatan "ketadi": uchish + simda oqim + tugma nafas oladi */
        .pm-flytrack { position: relative; display: inline-block; width: 62px; height: 20px; flex-shrink: 0; overflow: hidden; }
        .pm-fly { position: absolute; left: 0; top: 0; font-size: 16px; line-height: 20px; animation: pm-envfly 0.85s cubic-bezier(.5,0,.4,1) infinite; }
        @keyframes pm-envfly { 0% { transform: translateX(-4px) rotate(-8deg); opacity: 0; } 15% { opacity: 1; } 72% { opacity: 1; } 100% { transform: translateX(48px) rotate(8deg); opacity: 0; } }
        .postman.is-sending .pm-bar { position: relative; overflow: hidden; }
        .postman.is-sending .pm-bar::after { content: ''; position: absolute; left: 0; bottom: 0; height: 2px; width: 34%; background: linear-gradient(90deg, transparent, ${T.accent}, transparent); animation: pm-wire 0.85s linear infinite; }
        @keyframes pm-wire { from { transform: translateX(-110%); } to { transform: translateX(400%); } }
        .postman.is-sending .pm-send { animation: pm-send-throb 0.85s ease-in-out infinite; }
        @keyframes pm-send-throb { 0%,100% { transform: scale(1); box-shadow: 0 4px 10px -5px rgba(255,79,40,0.5); } 50% { transform: scale(1.04); box-shadow: 0 8px 20px -5px rgba(255,79,40,0.75); } }
        .pm-send:active:not(:disabled) { transform: scale(0.94); }
        .pm-empty { font-size: 12.5px; color: ${T.ink3}; font-style: italic; padding: 12px 4px; }
        .pm-respbody { }

        /* API oqimi (s2) */
        .apiflow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .apinode { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; border: none; border-radius: 11px; padding: 12px 13px; cursor: pointer; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); transition: all 0.16s; flex: 1; min-width: 0; }
        .apinode:hover { transform: translateY(-1px); }
        .apinode.on { background: ${T.accent}; color: #fff; box-shadow: 0 8px 18px -5px rgba(255,79,40,0.4); }
        .apinode.seen:not(.on) { background: #FBFAF7; }
        .apiarrow { color: ${T.ink3}; font-weight: 700; flex-shrink: 0; }
        /* affordance: hali bosilmagan qism "meni bos" deb pulslaydi; bosilgani ✓ bilan muhrlanadi */
        .apinode.tap-hint, .crud-card.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }
        .tick-pop { display: inline-block; animation: tick-pop 0.42s cubic-bezier(.3,1.6,.5,1) both; }
        @keyframes tick-pop { 0% { transform: scale(0) rotate(-25deg); opacity: 0; } 55% { transform: scale(1.35) rotate(6deg); opacity: 1; } 100% { transform: scale(1) rotate(0); opacity: 1; } }

        /* so'rov/javob konvert (s3) */
        .envcard { display: flex; flex-direction: column; gap: 7px; border-radius: 12px; padding: 11px; }
        /* chiquvchi (siz → server) — accent chekka; qaytgan (server → siz) — yashil chekka */
        .envcard.req { background: ${T.accentSoft}; border-left: 3px solid ${T.accent}; }
        .envcard.res { background: ${T.successSoft}; border-left: 3px solid ${T.success}; }
        .envpart { display: flex; align-items: center; gap: 9px; background: #fff; border: none; border-radius: 9px; padding: 9px 12px; cursor: pointer; transition: all 0.15s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.16); text-align: left; }
        .envpart:hover { transform: translateX(2px); }
        .envpart.on { box-shadow: inset 0 0 0 1.5px ${T.ink}; }
        .ep-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 9.5px; letter-spacing: 0.1em; color: ${T.ink3}; margin-left: auto; }

        /* s3 KONVERT YIG'ISH — sudrab/bosib joylash */
        .env-pool-h { display: flex; align-items: center; justify-content: space-between; }
        .env-count { font-weight: 800; font-size: 12px; color: ${T.accent}; animation: env-count-bump 0.4s cubic-bezier(.3,1.5,.5,1); }
        @keyframes env-count-bump { 0% { transform: scale(1); } 42% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .env-pool { display: flex; flex-wrap: wrap; gap: 8px; min-height: 48px; padding: 10px; border-radius: 12px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.08); align-items: center; }
        .env-pool-done { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.success}; animation: fade-step 0.35s ease-out both; }
        /* sudraladigan bo'lak: touch-action:none — barmoq bilan ham suriladi */
        .envpart.chip { touch-action: none; user-select: none; cursor: grab; }
        .envpart.chip:hover { transform: translateY(-2px); box-shadow: 0 9px 20px -7px rgba(${T.shadowBase},0.3); }
        .envpart.chip:active { cursor: grabbing; }
        .envpart.chip.sel { box-shadow: 0 0 0 2px ${T.accent}, 0 10px 20px -7px rgba(255,79,40,0.4); transform: translateY(-2px); }
        .envpart.chip.reject { animation: env-reject 0.5s cubic-bezier(.3,1.2,.5,1); }
        @keyframes env-reject { 0% { transform: translateY(0); } 22% { transform: translateY(-9px) scale(1.05) rotate(-2deg); } 44% { transform: translateX(-5px) rotate(1deg); } 62% { transform: translateX(5px) rotate(-1deg); } 80% { transform: translateX(-3px); } 100% { transform: none; } }
        /* affordance: hali joylanmagan bo'lak "meni sudra" deb pulslaydi — to'lqin bo'lib, birvarakayiga emas */
        .envpart.chip.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }
        .env-pool .envpart.chip.tap-hint:nth-child(2) { animation-delay: 0.16s; }
        .env-pool .envpart.chip.tap-hint:nth-child(3) { animation-delay: 0.32s; }
        .env-pool .envpart.chip.tap-hint:nth-child(4) { animation-delay: 0.48s; }
        .env-pool .envpart.chip.tap-hint:nth-child(5) { animation-delay: 0.64s; }
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.16), 0 0 0 0 rgba(255,79,40,0.42); } 70%,100% { box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.16), 0 0 0 9px rgba(255,79,40,0); } }
        .env-tip { margin: 0; color: ${T.ink2}; animation: fade-step 0.3s ease-out both; }
        /* konvert = tashlash zonasi */
        .env-zone { position: relative; transition: box-shadow 0.2s, transform 0.2s; }
        .env-zone.hot { box-shadow: 0 0 0 2px ${T.accent}, 0 12px 26px -8px rgba(255,79,40,0.3); transform: translateY(-2px); }
        .env-zone.res.hot { box-shadow: 0 0 0 2px ${T.success}, 0 12px 26px -8px rgba(31,122,77,0.3); }
        .env-slot { display: flex; align-items: center; min-height: 38px; padding: 9px 12px; border-radius: 9px; border: 1.5px dashed rgba(${T.shadowBase},0.22); font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.ink3}; font-style: italic; }
        .envpart.placed { animation: env-settle 0.5s cubic-bezier(.3,1.5,.5,1); }
        @keyframes env-settle { 0% { transform: translateY(-12px) scale(1.07); opacity: 0; } 55% { transform: translateY(2px) scale(0.96); opacity: 1; } 78% { transform: translateY(-1px) scale(1.02); } 100% { transform: none; } }
        /* konvert to'lganda — muhrlanadi */
        .env-seal { position: absolute; right: 8px; top: -10px; font-size: 20px; animation: env-seal-drop 0.55s cubic-bezier(.3,1.5,.5,1) both; }
        @keyframes env-seal-drop { 0% { transform: translateY(-16px) scale(1.9) rotate(-18deg); opacity: 0; } 45% { transform: translateY(0) scale(0.9) rotate(4deg); opacity: 1; } 70% { transform: scale(1.08) rotate(-2deg); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        .env-zone.sealed { box-shadow: inset 0 0 0 1.5px ${T.success}55; }

        /* CRUD/method karta (s10) */
        .crud-card { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 13px 15px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .crud-card:hover { transform: translateY(-1px); }
        .crud-card.seen { background: #FBFAF7; }
        .crud-word { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 15px; }
        .crud-uz { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }

        /* sayohat (s11) */
        .jflow { position: relative; display: flex; justify-content: space-between; gap: 6px; padding: 6px 0 30px; }
        .jnode { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; background: ${T.paper}; border-radius: 12px; padding: 12px 6px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); transition: box-shadow 0.25s; }
        .jnode-ic { font-size: 24px; } .jnode-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.ink}; text-align: center; }
        /* konvert qaysi bekatga yetsa — o'sha bekat "jonlanadi" */
        .jnode.on { animation: jnode-ping 0.9s ease-out; }
        @keyframes jnode-ping { 0% { transform: scale(1); } 26% { transform: scale(1.07) translateY(-3px); } 55% { transform: scale(0.99); } 100% { transform: scale(1); } }
        .jtrack { position: absolute; left: 0; right: 0; bottom: 4px; height: 22px; }
        .jenv { position: absolute; bottom: 0; font-size: 22px; transition: left 0.85s cubic-bezier(.45,0,.25,1); transform: translateX(-50%); animation: jenv-bob 1.6s ease-in-out infinite; }
        @keyframes jenv-bob { 0%,100% { translate: 0 0; } 50% { translate: 0 -4px; } }
        .jnote { background: ${T.paper}; border-radius: 11px; padding: 12px 15px; min-height: 46px; display: flex; align-items: center; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.12); }

        /* amaliyot stepbar (s13) */
        .stepbar { display: flex; gap: 8px; }
        .stepdot { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; background: ${T.bg}; color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px rgba(${T.shadowBase},0.14); }
        .stepdot.cur { background: ${T.accent}; color: #fff; box-shadow: none; }
        .stepdot.done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; }

        /* hook do'kon + konvert uchish */
        .shopmock { display: flex; gap: 8px; flex-wrap: wrap; }
        .shop-card { flex: 1; min-width: 84px; background: #fff; border-radius: 11px; padding: 11px; box-shadow: 0 4px 14px -6px rgba(${T.shadowBase},0.18); display: flex; flex-direction: column; gap: 5px; align-items: flex-start; }
        .shop-name { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: 13.5px; color: ${T.ink}; }
        .shop-narx { font-family: 'JetBrains Mono'; font-size: 11.5px; color: ${T.accent}; font-weight: 700; }
        .flyrow { display: flex; align-items: center; gap: 10px; }
        .flynode { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink}; background: ${T.paper}; padding: 8px 12px; border-radius: 9px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .flytrack { position: relative; flex: 1; height: 26px; }
        .flyenv { position: absolute; top: 0; font-size: 21px; left: 0; transition: none; }
        .flyenv.flying { animation: flyacross 1.1s cubic-bezier(.45,0,.25,1) forwards; }
        .flyenv.done { left: 0; }
        @keyframes flyacross { 0% { left: 0; } 45% { left: calc(100% - 21px); transform: scale(1); } 50% { left: calc(100% - 21px); } 55% { transform: scaleX(-1); } 100% { left: 0; transform: scaleX(-1); } }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* ===== v18 QATLAMLAR CSS (L1/ReactApiGet etalondan) ===== */
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
        .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 13px; padding: 14px 20px; background: ${T.ink}; color: ${T.bg}; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.34); transition: all 0.18s; margin-top: 2px; }
        .lp-done-btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.5); }
        .lp-done-btn.is-done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; animation: lp-done-pop 0.44s cubic-bezier(.3,1.35,.5,1); }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done { animation: none !important; } }
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }
        /* === 🃏 FLASHCARDS (reusable, 3D flip) === */
        .fc-center { display: flex; justify-content: center; padding-top: 4px; }
        .fc { display: flex; flex-direction: column; gap: 11px; max-width: 480px; width: 100%; }
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
        .fc-card { position: relative; height: clamp(160px,26vw,188px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .fc-card.flip { transform: rotateY(180deg); }
        .fc-card:not(.flip):hover { transform: translateY(-3px); }
        .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
        .fc-front { background: ${T.paper}; border: 2px solid ${T.line}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, #FF8A3D, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(255,79,40,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
        .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
        .fc-tap { color: ${T.accent}; font-weight: 700; }
        .fc-tag { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(24px,5vw,40px); letter-spacing: -0.02em; text-wrap: balance; }
        .fc-note { font-family: 'Manrope'; font-size: 14px; opacity: 0.92; }
        .fc-actions { display: flex; gap: 10px; }
        .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
        .fc-btn:hover { transform: translateY(-2px); }
        .fc-btn.knew { background: ${T.success}; color: #fff; box-shadow: 0 10px 22px -10px ${T.success}; }
        .fc-btn.again { background: ${T.paper}; border: 2px solid ${T.accent}66; color: ${T.accent}; }
        .fc-btn.again:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
        .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
        .fc-hint { margin: 0; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
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
        /* 11.15 — sekundar UI xira: LiveBadge kerak bo'lguncha ko'zga tashlanmaydi (L1 etaloni) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(${T.shadowBase},0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
        /* --- Kahoot-kutish holatlari (jonli test) --- */
        /* option-wait (jonli test kutish holati) — mentor natijani ochguncha «nafas olish» pulsatsiyasi */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; animation: option-wait-breathe 1.8s ease-in-out infinite; }
        @keyframes option-wait-breathe { 0%,100% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.28); } 50% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 10px 30px -6px rgba(1,154,203,0.55); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

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
        .mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
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

        /* --- kod-atama chip (fmtCode) arena variantlari --- */
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        /* --- CodeStrike bolt FX qatlami --- */
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(255,79,40,0.32)); }

        /* ===== HARAKATNI KAMAYTIRISH — takrorlanuvchi/og'ir animatsiyalarga tinch variant ===== */
        @media (prefers-reduced-motion: reduce) {
          .envpart.chip.tap-hint, .apinode.tap-hint, .crud-card.tap-hint,
          .envpart.chip.reject, .envpart.placed, .env-seal, .env-count,
          .pm-fly, .postman.is-sending .pm-bar::after, .postman.is-sending .pm-send,
          .jenv, .jnode.on, .tick-pop, .flyenv.flying { animation: none !important; }
          .env-zone, .envpart, .pm-send, .apinode, .crud-card { transition: none !important; }
        }
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr({ uz: 'API va Postman darsi', ru: 'Урок «API и Postman»' })} />
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
