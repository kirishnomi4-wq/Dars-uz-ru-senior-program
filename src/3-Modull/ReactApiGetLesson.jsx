import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// REACT MODULI · 5-DARS — API BILAN ISHLASH: GET — PLATFORM STANDARD v16 (AUDIOSIZ)
// Mavzu: nega ma'lumot serverda turadi (1 markaz — hamma qurilma), API = ofitsiant,
//        fetch anatomiyasi (GET so'rovi, URL, endpoint), JSON javob (.json()),
//        loading holati (skeleton), useEffect + fetch + state — to'liq usul,
//        endpointlar (/games /top /new), 404 xatosi.
// Misol sayt: robo-games (davom) — katalog endi "serverdan" yuklanadi (robo-api.uz).
// Animatsiyalar: 3 qurilma sinxron yangilanishi (server kuchi), so'rov-javob konsoli,
//        skeleton shimmer (yuklanish), 4 qadamli useEffect+fetch+state oqimi,
//        404 → fix → katalog stagger yuklanishi.
// Oldingi darslar bilan bog'lanish: useEffect [] (3-dars), state (3-dars), massiv+map (4-dars),
//        server/so'rov (Internet darsi L0).
// MUHIM: kelgusi darslar ro'yxati o'quvchiga AYTILMAYDI — faqat yakunda teaser.
// AUDIOSIZ: ovoz (TTS) yo'q — platforma qarori.
// Yakuniy ekran (s15): VS Code — useEffect ichida fetch('https://robo-api.uz/games') yozish.
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
      <p style={{ color: '#fff', opacity: 0.85, fontSize: 'clamp(15px,2.2vw,22px)', maxWidth: 640, margin: 'clamp(20px,4vw,36px) 0 0', lineHeight: 1.5 }}>{tr({ uz: <>Shu darsni o'z qurilmangizda oching → <b style={{ color: '#fff' }}>«👨‍🎓 O'quvchiman»</b> → ushbu kodni kiriting.</>, ru: <>Откройте этот урок на своём устройстве → <b style={{ color: '#fff' }}>«👨‍🎓 Я ученик»</b> → введите этот код.</> })}</p>
      <button onClick={onClose} style={{ marginTop: 'clamp(22px,4vw,40px)', background: LT.accent, color: '#fff', border: 'none', borderRadius: 14, padding: 'clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)', fontSize: 'clamp(15px,1.8vw,18px)', fontWeight: 700, cursor: 'pointer' }}>{tr({ uz: 'Darsni boshlash →', ru: 'Начать урок →' })}</button>
    </div>
  );
}

function LiveGate({ live, title }) {
  title = title || tr({ uz: 'Jonli dars', ru: 'Живой урок' });
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
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{title}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Присоединиться к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и своё имя.' })}</p></div>
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

const LangContext = createContext('uz');
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const LiveGateCtx = createContext(null); // JONLI: mentor-gate + live obyekti (Jonli roli Provider bilan ulaydi)

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

const LESSON_META = { lessonId: 'react-api-get-05-v18', lessonTitle: { uz: "API bilan ishlash: GET — serverdan ma'lumot olish", ru: 'Работа с API — GET' } };
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
  { id: 's15', type: 'practice',    template: 'custom',   scored: false, scope: null },
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
  const lbl = label || tr({ uz: 'Davom etish', ru: 'Продолжить' });
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
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

// JONLI JAVOB KALITI — har SCORED ekranning correctIdx'idan (yozma/praktika -1 sentinel). Kalitni ⚡ Jonli tekshiradi.
const INLINE_KEYS = { s4: 1, s5b: 2, s9: 3, s12: 0, s15: -1 };
const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
const RECAPS = {
  4: {
    title: { uz: "fetch — serverga boradigan ofitsiant", ru: 'fetch — официант, который ходит на сервер' },
    cards: [
      { ic: "📡", h: { uz: "Server — ma'lumot markazi", ru: 'Сервер — центр данных' }, body: { uz: <>Ma'lumot bitta joyda — <b>serverda</b> — turadi: <span className="mono">robo-api.uz</span>. Hamma qurilma o'sha markazdan so'rab oladi.</>, ru: <>Данные живут в одном месте — на <b>сервере</b>: <span className="mono">robo-api.uz</span>. Все устройства запрашивают их из этого центра.</> } },
      { ic: "🛎️", h: { uz: "fetch — «borib olib kel»", ru: 'fetch — «сходи и принеси»' }, body: { uz: <><span className="mono">fetch</span> — ofitsiant kabi GET so'rovi: manzilga boradi va javobni <b>olib keladi</b>. O'zi ekranga hech narsa <b>chizmaydi</b>.</>, ru: <><span className="mono">fetch</span> — GET-запрос, как официант: идёт по адресу и <b>приносит ответ</b>. Сам на экране ничего <b>не рисует</b>.</> } },
      { ic: "🧾", h: { uz: "So'rovning 3 qismi", ru: 'Три части запроса' }, body: { uz: <>To'liq so'rov: <b>buyruq</b> (fetch) + <b>manzil</b> (https://robo-api.uz) + <b>bo'lim</b> (/games).</>, ru: <>Полный запрос: <b>команда</b> (fetch) + <b>адрес</b> (https://robo-api.uz) + <b>раздел</b> (/games).</> }, ask: { uz: "Serverdan kelgan ma'lumotni ekranga kim chizadi?", ru: 'Кто рисует на экране данные, пришедшие с сервера?' } },
    ]
  },
  6: {
    title: { uz: ".json() — patnisning qopqog'ini ochadi", ru: '.json() — снимает крышку с подноса' },
    cards: [
      { ic: "📝", h: { uz: "Javob avval MATN bo'ladi", ru: 'Ответ сначала — ТЕКСТ' }, body: { uz: <>Server javobi <b>shunchaki matn</b> bo'lib keladi (qo'shtirnoq ichida). Matnga <span className="mono">map()</span> qilib bo'lmaydi.</>, ru: <>Ответ сервера приходит <b>просто текстом</b> (в кавычках). К тексту <span className="mono">map()</span> применить нельзя.</> } },
      { ic: "🔄", h: { uz: ".json() — tarjima qiladi", ru: '.json() — переводит' }, body: { uz: <><span className="mono">.json()</span> matnni <b>haqiqiy massivga</b> aylantiradi — endi <span className="mono">map()</span> ishlaydi.</>, ru: <><span className="mono">.json()</span> превращает текст в <b>настоящий массив</b> — теперь <span className="mono">map()</span> работает.</> } },
      { ic: "➡️", h: { uz: "To'liq yo'l", ru: 'Полный путь' }, body: { uz: <>Yo'l: <b>matn → .json() → massiv → map → kartochka</b>. Tarjimasiz massiv yo'q.</>, ru: <>Путь: <b>текст → .json() → массив → map → карточка</b>. Без перевода массива не будет.</> }, ask: { uz: "Nega server javobiga darhol map qilib bo'lmaydi?", ru: 'Почему к ответу сервера нельзя сразу применить map?' } },
    ]
  },
  10: {
    title: { uz: "setGames — stolga kim qo'yadi", ru: 'setGames — кто ставит на стол' },
    cards: [
      { ic: "🛎️", h: { uz: "fetch faqat olib keladi", ru: 'fetch только приносит' }, body: { uz: <><span className="mono">fetch</span> ma'lumotni olib keladi, xolos — ekranga chizish uning ishi emas.</>, ru: <><span className="mono">fetch</span> лишь приносит данные — рисовать на экране не его работа.</> } },
      { ic: "🖼️", h: { uz: "setGames chizadi", ru: 'setGames рисует' }, body: { uz: <><span className="mono">setGames(data)</span> → state yangilanadi → <b>React o'zi qayta chizadi</b>.</>, ru: <><span className="mono">setGames(data)</span> → state обновился → <b>React сам всё перерисует</b>.</> } },
      { ic: "⏱️", h: { uz: "useEffect — «qachon»", ru: 'useEffect — «когда»' }, body: { uz: <><span className="mono">useEffect(…, [])</span> so'rov <b>qachon</b> ketishini hal qiladi: sahifa ochilganda bir marta.</>, ru: <><span className="mono">useEffect(…, [])</span> решает, <b>когда</b> уйдёт запрос: один раз при открытии страницы.</> }, ask: { uz: "Serverdan kelgan ro'yxat qaysi qadam bilan ekranga chiqadi?", ru: 'Каким шагом список с сервера попадает на экран?' } },
    ]
  },
  13: {
    title: { uz: "404 — noto'g'ri eshik", ru: '404 — не та дверь' },
    cards: [
      { ic: "🚪", h: { uz: "404 = «bunday eshik yo'q»", ru: '404 = «такой двери нет»' }, body: { uz: <>404 — server javobi: <b>so'ralgan manzil topilmadi</b>. Sayt buzilmagan, faqat manzil xato.</>, ru: <>404 — ответ сервера: <b>запрошенный адрес не найден</b>. Сайт не сломан — просто адрес неверный.</> } },
      { ic: "🔡", h: { uz: "Manzilni harfma-harf tekshir", ru: 'Проверьте адрес по буквам' }, body: { uz: <><span className="mono">/gmaes</span> emas, <span className="mono">/games</span> — bitta harf xato ham 404 beradi.</>, ru: <>Не <span className="mono">/gmaes</span>, а <span className="mono">/games</span> — даже одна неверная буква даёт 404.</> } },
      { ic: "📬", h: { uz: "404 — xabarchi", ru: '404 — вестник' }, body: { uz: <>404 dushman emas, <b>xabarchi</b>: manzilni tekshir, deydi. <span className="mono">200 OK</span> esa — to'g'ri eshik, javob keldi.</>, ru: <>404 не враг, а <b>вестник</b>: он говорит «проверь адрес». А <span className="mono">200 OK</span> — дверь верная, ответ пришёл.</> }, ask: { uz: "Skeleton to'xtamayapti, konsolda 404 — birinchi nima qilasiz?", ru: 'Скелетон не исчезает, в консоли 404 — что сделаете первым делом?' } },
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
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}${tr({ uz: '-karta', ru: '-я карта' })}`} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: '✓ Tushunarli — davom etamiz', ru: '✓ Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Дальше →' })}</button>}
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
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: 'xato ❌', ru: 'неверно ❌' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ожидаем ⏳' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi 📨', ru: 'ответили 📨' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ожидаем ⏳' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и число ✅/❌ скрыто — при нажатии «Открыть результат» всё появится сразу и у вас, и на экранах учеников.' })}</p>
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
            {level === 'need' && <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — тема осталась непонятной классу. Перед продолжением рекомендуем короткое повторение.</> })}</p>}
            {level === 'maybe' && <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. При желании коротко повторите перед продолжением.</> })}</p>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс усвоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — по процентам судить трудно. Оцените сами.</> })}</p>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз.' })}</p>}
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
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, подумайте перед нажатием!' })}</p>}
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
              ? <>{tr({ uz: "✓ To'g'ri javob:", ru: '✓ Верный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? <>{tr({ uz: "To'g'ri javob:", ru: 'Верный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(explainCorrect)
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете верный ответ.' })
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish ▾", ru: 'открыть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

// ===== REACT-5 YORDAMCHILAR =====
const Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: 'italic' }}>{children}</span>;
const Code = ({ children }) => <code className="codechip">{children}</code>; // matnda real kodcha
const Win = ({ title, children, minH }) => (
  <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">{title}</span></div><div className="bp-body" style={{ minHeight: minH, position: 'relative' }}>{children}</div></div>
);
// Roblox uslubidagi o'yinlar (oldingi darslardan tanish)
const GAMES = [
  { name: 'Adopt Me!', emoji: '🐾', likes: 92, players: '402K', bg: 'linear-gradient(135deg,#FF9DBF,#C44569)' },
  { name: 'Blox Fruits', emoji: '🍇', likes: 95, players: '750K', bg: 'linear-gradient(135deg,#7EA6F4,#2E4A9E)' },
  { name: 'Brookhaven', emoji: '🏠', likes: 89, players: '510K', bg: 'linear-gradient(135deg,#8FD3A8,#2E7A4E)' },
  { name: 'Tower of Hell', emoji: '🗼', likes: 84, players: '120K', bg: 'linear-gradient(135deg,#F4B26A,#C9622E)' },
  { name: 'Doors', emoji: '🚪', likes: 91, players: '310K', bg: 'linear-gradient(135deg,#6B7280,#1F2430)' },
  { name: 'Piggy', emoji: '🐷', likes: 87, players: '180K', bg: 'linear-gradient(135deg,#F4A6C0,#B5446E)' },
  { name: 'Bee Swarm', emoji: '🐝', likes: 93, players: '260K', bg: 'linear-gradient(135deg,#F4D06A,#C99B2E)' }
];
const gameByName = (nm) => GAMES.find(g => g.name.toLowerCase() === String(nm).toLowerCase());
// "Server"dagi ma'lumotlar — endpointlar bo'yicha
const SERVER = {
  '/games': ['Adopt Me!', 'Blox Fruits', 'Brookhaven'],
  '/top': ['Blox Fruits', 'Bee Swarm'],
  '/new': ['Doors', 'Piggy', 'Bee Swarm']
};
// O'yin kartochkasi
const RoCard = ({ name, emoji, players, top }) => {
  const g = gameByName(name);
  const bg = g ? g.bg : 'linear-gradient(135deg,#8E9BB5,#4A5670)';
  const em = emoji || (g ? g.emoji : '🎮');
  return (
    <div className="rocard el-in" style={{ position: 'relative' }}>
      <div className="rothumb" style={{ background: bg }}>
        <span style={{ fontSize: 26 }}>{em}</span>
        {top && <span className="topbadge el-in">🔥 TOP</span>}
      </div>
      <div className="robody">
        <p className="roname">{name}</p>
        <div className="rostats">
          <span>👍 {g ? g.likes : 88}%</span>
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

// ===== SCREEN 0 — HOOK (yangi o'yin — hamma qurilmada bir zumda) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [published, setPublished] = useState(!!storedAnswer);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const OPTS = [
    { id: 'a', label: { uz: "Har bir qurilmaga kod alohida yozib chiqilgan", ru: 'На каждое устройство код написали отдельно' } },
    { id: 'b', label: { uz: "Ma'lumot BITTA markazda turadi — hamma qurilma o'sha yerdan oladi", ru: 'Данные лежат в ОДНОМ центре — все устройства берут их оттуда' } },
    { id: 'c', label: { uz: "Qurilmalar bir-biridan ko'chirib oladi", ru: 'Устройства копируют друг у друга' } }
  ];
  const pick = (v) => { if (picked !== null || !published) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  const DEVICES = [{ uz: 'telefon', ru: 'телефон' }, { uz: 'planshet', ru: 'планшет' }, { uz: 'noutbuk', ru: 'ноутбук' }];
  const audio = useAudio([{ id: 's0', text: `Roblox'da yangi o'yin chiqsa, u bir zumda millionlab ekranda paydo bo'ladi. Hech kim har telefonga alohida kod yozmaydi — ma'lumot bitta markazda, serverda turadi. Tugmani bosing va yangi o'yin uch qurilmaga birdan qanday yetib borishini ko'ring. Keyin ayting: sizningcha, buni qanday uddalashdi?`, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 800 }}>{tr({ uz: <>Yangi o'yin chiqdi — millionlab ekranda <span className="italic" style={{ color: T.accent }}>bir zumda</span> paydo bo'ldi. Qanday?</>, ru: <>Вышла новая игра — и <span className="italic" style={{ color: T.accent }}>мгновенно</span> появилась на миллионах экранов. Как?</> })}</h1>
        <Mentor>{tr({ uz: <>O'tgan darsda katalog kod ichidagi ro'yxatdan chizilardi. Lekin Roblox'da yangi o'yin chiqsa, u <b style={{ color: T.ink }}>bir vaqtning o'zida</b> hammaning telefonida, planshetida, noutbukida paydo bo'ladi. Tugmani bosib, buni o'z ko'zingiz bilan ko'ring.</>, ru: <>На прошлом уроке каталог рисовался из списка внутри кода. Но когда в Roblox выходит новая игра, она появляется <b style={{ color: T.ink }}>одновременно</b> у всех — на телефоне, планшете, ноутбуке. Нажмите кнопку и увидьте это своими глазами.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <button className="btn fade-up delay-1" style={{ alignSelf: 'flex-start' }} onClick={() => setPublished(true)} disabled={published}>{published ? tr({ uz: "✓ E'lon qilindi", ru: '✓ Опубликовано' }) : tr({ uz: "📡 Yangi o'yinni e'lon qilish", ru: '📡 Опубликовать новую игру' })}</button>
            {published && <p className="broadcast-cue fade-step">{tr({ uz: <>📡 <b>robo-api.uz</b> serverdan 3 qurilmaga bir vaqtda yuborildi</>, ru: <>📡 С сервера <b>robo-api.uz</b> отправлено на 3 устройства одновременно</> })}</p>}
            <div className="fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>
              {DEVICES.map((d, i) => (
                <div key={i} style={{ minWidth: 0 }}>
                  <p className="flow-label" style={{ marginBottom: 6 }}>{tr(d)}</p>
                  <Win title="robo-games" minH={60}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      <RoCard name="Adopt Me!" />
                      {published && <div className="el-in push-in" style={{ animationDelay: `${0.2 + i * 0.35}s`, animationFillMode: 'backwards' }}><RoCard name="Doors" /></div>}
                    </div>
                  </Win>
                </div>
              ))}
            </div>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Sizningcha, buni qanday uddalashdi?', ru: 'Как, по-вашему, это удалось?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (
                  <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null || !published} style={{ opacity: !published ? 0.55 : 1 }} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{tr(o.label)}</span>
                  </button>
                );
              })}
            </div>
            {!published && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Avval yangi o'yinni e'lon qiling ←", ru: 'Сначала опубликуйте новую игру ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Aynan! O'sha markaz — <b>server</b>. Hech kim millionlab telefonga kod yozib chiqmaydi: ma'lumot bitta joyda turadi, qurilmalar undan <b>so'rab oladi</b>. Bugun katalogingiz ham shunday ishlaydi.</>, ru: <>Именно! Этот центр — <b>сервер</b>. Никто не пишет код на миллионы телефонов: данные лежат в одном месте, а устройства их <b>запрашивают</b>. Сегодня ваш каталог заработает так же.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (va'da + bugungi 5 qadam) =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: { uz: "Server — ma'lumot markazi", ru: 'Сервер — центр данных' }, tag: 'robo-api.uz' },
    { text: { uz: "fetch — so'rov yuborish", ru: 'fetch — отправить запрос' }, tag: "fetch('…/games')" },
    { text: { uz: 'JSON — server javobi', ru: 'JSON — ответ сервера' }, tag: 'res.json()' },
    { text: { uz: 'Yuklanish holati', ru: 'Состояние загрузки' }, tag: 'skeleton' },
    { text: { uz: "To'liq usul", ru: 'Полный приём' }, tag: 'useEffect + fetch + state' }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const [pvLoaded, setPvLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setPvLoaded(true), 950); return () => clearTimeout(t); }, []);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Dars oxirida — sizning natijangiz', ru: 'В конце урока — ваш результат' })} {pvLoaded ? '' : tr({ uz: '· yuklanmoqda…', ru: '· загружается…' })}</p>
      <Win title="robo-games — localhost:5173" minH={100}>
        {!pvLoaded
          ? <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}><SkelCard /><SkelCard /><SkelCard /></div>
          : <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {['Adopt Me!', 'Blox Fruits', 'Brookhaven'].map((n, i) => <div key={n} className="el-in" style={{ animationDelay: `${i * 0.13}s`, animationFillMode: 'backwards' }}><RoCard name={n} /></div>)}
            </div>}
      </Win>
      <pre className="code-box" style={{ padding: '10px 14px' }}>{'fetch('}<St>'https://robo-api.uz/games'</St>{')'}</pre>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: '→ kartochkalar endi serverdan yuklanadi', ru: '→ карточки теперь загружаются с сервера' })}</p>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 5 qadam', ru: 'Сегодняшние 5 шагов' })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span>{s.tag && <span className="step-tag">{s.tag}</span>}</span></li>))}
      </ol>
    </Col>
  );
  const audio = useAudio([{ id: 's1', text: `Ishonasizmi — dars oxirida saytingiz xuddi haqiqiy Roblox kabi ishlaydi: sahifa ochiladi, so'rov serverga uchadi, kartochkalar yuklanib chiqadi. Buning kaliti bitta buyruq: fetch. Bugun uni besh qadamda o'rganamiz — serverga so'rov yuborishdan, kartochkalar ekranga chiqquncha.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Bugun katalogingiz ma'lumotni <span className="italic" style={{ color: T.accent }}>internetdagi serverdan</span> oladi.</>, ru: <>Сегодня ваш каталог будет брать данные <span className="italic" style={{ color: T.accent }}>с сервера в интернете</span>.</> })}</h2>
        </div>
        <Mentor>{tr({ uz: <>Ishonasizmi — dars oxirida saytingiz <b style={{ color: T.ink }}>xuddi haqiqiy Roblox kabi</b> ishlaydi: sahifa ochiladi, so'rov serverga uchadi, kartochkalar yuklanib chiqadi. Buning kaliti — bitta buyruq: <span className="mono">fetch</span>.</>, ru: <>Поверите ли — к концу урока ваш сайт заработает <b style={{ color: T.ink }}>как настоящий Roblox</b>: страница открывается, запрос летит на сервер, карточки подгружаются. Ключ к этому — одна команда: <span className="mono">fetch</span>.</> })}</Mentor>
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

// ===== SCREEN 2 — SERVER (ro'yxat kod ichidan serverga ko'chadi) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [phase, setPhase] = useState(storedAnswer ? 2 : 0); // 0 kodda, 1 ko'chmoqda, 2 serverda
  const timer = useRef(null);
  const done = phase >= 2;
  useEffect(() => () => clearTimeout(timer.current), []);
  const move = () => {
    if (phase !== 0) return;
    setPhase(1);
    timer.current = setTimeout(() => setPhase(2), 1000);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's2', text: `Hozir games ro'yxati App.jsx kodining ichida yashayapti — uni faqat shu sayt ko'radi. Endi uni internetdagi maxsus kompyuterga, serverga ko'chiramiz. Server ro'yxatga bitta manzil beradi, va istalgan qurilma o'sha manzildan oladi. Tugmani bosib, ro'yxat serverga qanday ko'chishini kuzating.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Server', ru: 'Сервер' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Ro'yxatni ko'chiring", ru: 'Перенесите список' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ro'yxatni kod ichidan <span className="italic" style={{ color: T.accent }}>serverga ko'chirsak</span> nima o'zgaradi?</>, ru: <>Что изменится, если <span className="italic" style={{ color: T.accent }}>перенести список на сервер</span> из кода?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Hozir <span className="mono">games</span> ro'yxati App.jsx ichida yashayapti — uni faqat shu sayt ko'radi. Endi uni internetdagi maxsus kompyuterga — <b style={{ color: T.ink }}>serverga</b> ko'chiramiz. Server unga <b style={{ color: T.ink }}>manzil</b> beradi, va istalgan qurilma o'sha manzildan oladi.</>, ru: <>Сейчас список <span className="mono">games</span> живёт внутри App.jsx — его видит только этот сайт. Теперь перенесём его на особый компьютер в интернете — <b style={{ color: T.ink }}>сервер</b>. Сервер даст ему <b style={{ color: T.ink }}>адрес</b>, и любое устройство возьмёт данные по этому адресу.</> })}</Mentor>
        <Zoomable>
        <div className="migrate fade-up delay-1">
          <div className="mig-box">
            <p className="flow-label">{tr({ uz: 'App.jsx — sizning kodingiz', ru: 'App.jsx — ваш код' })}</p>
            <pre className="code-box" style={{ lineHeight: 1.9, margin: 0 }}>
              {phase < 2
                ? <span className={phase === 1 ? 'mig-leaving' : ''} style={{ borderRadius: 6, padding: '2px 5px', display: 'inline-block', transition: 'all 0.3s' }}><Jx>{'const'}</Jx>{' games = ['}<St>"Adopt Me!"</St>{', '}<St>"Doors"</St>{', '}<St>"Brookhaven"</St>{'];'}</span>
                : <span className="el-in"><Cm>{tr({ uz: "// ro'yxat endi serverda — kod yengillashdi!", ru: '// список теперь на сервере — код стал легче!' })}</Cm></span>}
              {'\n\n'}
              {'{games.map(g => '}<Jx>{'<GameCard '}</Jx><At>name</At>{'={g}'}<Jx>{' />'}</Jx>{')}'}
            </pre>
          </div>
          <div className="mig-arrow">
            {phase === 1 && <span className="mig-packet">📦 games</span>}
            <span className="mig-line" />
            <span className="mig-cap" style={{ color: phase >= 2 ? T.success : T.ink3 }}>{phase === 0 ? tr({ uz: "ko'chirish", ru: 'перенос' }) : phase === 1 ? tr({ uz: "ko'chmoqda…", ru: 'переносится…' }) : tr({ uz: "✓ ko'chdi", ru: '✓ перенесён' })}</span>
          </div>
          <div className="mig-box">
            <p className="flow-label">{tr({ uz: 'robo-api.uz — server', ru: 'robo-api.uz — сервер' })}</p>
            <div className="code-box" style={{ padding: '11px 14px', minHeight: 96, margin: 0, boxShadow: phase >= 2 ? `0 0 0 2px ${T.success}, 0 8px 22px -6px rgba(${T.shadowBase},0.2)` : undefined, transition: 'box-shadow 0.4s' }}>
              <TLine out={<span style={{ color: CODE.attr, fontWeight: 700 }}>robo-api.uz</span>} />
              {phase < 2
                ? <TLine out={<span style={{ color: CODE.comment, fontStyle: 'italic' }}>{phase === 1 ? tr({ uz: "posilka yo'lda…", ru: 'посылка в пути…' }) : tr({ uz: "bo'sh — ma'lumot kutilmoqda…", ru: 'пусто — ждём данные…' })}</span>} />
                : <>
                    <TLine out={<span><span style={{ color: CODE.punct }}>/games:</span></span>} />
                    <TLine out={<span className="el-in" style={{ display: 'inline-block' }}>{'[ '}<St>"Adopt Me!"</St>{', '}<St>"Doors"</St>{', '}<St>"Brookhaven"</St>{' ]'}</span>} />
                  </>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px,1.6vw,14px)', marginTop: 12 }}>
          <button className="btn fade-up delay-2" style={{ alignSelf: 'flex-start' }} onClick={move} disabled={phase !== 0}>{phase === 0 ? tr({ uz: "📦 Serverga ko'chirish", ru: '📦 Перенести на сервер' }) : phase === 1  ? tr({ uz: "Ko'chmoqda…", ru: 'Переносится…' }) : tr({ uz: "✓ Ko'chirildi", ru: '✓ Перенесено' })}</button>
          {done && <span className="tagpill fade-step" style={{ color: T.success, alignSelf: 'flex-start' }}>{tr({ uz: '✓ manzil tayyor: https://robo-api.uz/games', ru: '✓ адрес готов: https://robo-api.uz/games' })}</span>}
          {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Endi bu ro'yxatni telefon ham, noutbuk ham, boshqa sayt ham — <b>manzili orqali</b> oladi. Bitta markaz — hamma uchun. Savol qoldi: kod uni <b>qanday so'rab oladi</b>?</>, ru: <>Теперь этот список возьмёт и телефон, и ноутбук, и другой сайт — <b>по адресу</b>. Один центр — для всех. Остался вопрос: как код его <b>запросит</b>?</> })}</p></div>}
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — FETCH ANATOMIYASI (3 bosiladigan qism) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const PARTS = {
    fetch: { title: { uz: 'fetch — buyruq', ru: 'fetch — команда' }, desc: { uz: <>Ma'nosi: <b>"shu manzilga borib, ma'lumotni olib kel"</b>. Bu GET so'rovi — faqat olish, serverda hech narsani o'zgartirmaslik.</>, ru: <>Смысл: <b>«сходи по этому адресу и принеси данные»</b>. Это GET-запрос — только получить, ничего на сервере не менять.</> } },
    url: { title: { uz: 'https://robo-api.uz — server manzili', ru: 'https://robo-api.uz — адрес сервера' }, desc: { uz: <>Qaysi serverga borish kerakligi. Xuddi do'kon manzili: avval <b>qayerga</b> borishni bilish kerak.</>, ru: <>На какой сервер идти. Как адрес магазина: сначала нужно знать, <b>куда</b> идти.</> } },
    ep: { title: { uz: '/games — endpoint', ru: '/games — эндпоинт' }, desc: { uz: <>Serverning <b>qaysi bo'limi</b> kerakligi. Bitta serverda bir nechta "eshik" bo'ladi — bu haqda birozdan keyin.</>, ru: <>Какой <b>раздел</b> сервера нужен. У одного сервера бывает несколько «дверей» — об этом чуть позже.</> } }
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(storedAnswer ? new Set(['fetch', 'url', 'ep']) : new Set());
  const done = seen.size >= 3;
  const tap = (k) => { setActive(k); setSeen(prev => { const s = new Set(prev); s.add(k); return s; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const tokCls = (k) => `fa-tok ${active === k ? 'on' : ''} ${seen.has(k) ? 'seen' : ''}`;
  const audio = useAudio([{ id: 's3', text: `Serverdan ma'lumotni qaysi buyruq olib keladi? Tanishing: fetch. Internet darsidagi ofitsiantni eslaysizmi — fetch ham shunday: manzilni berasiz, u serverga boradi va javobni olib keladi. Buyruqning uch qismini birma-bir bosing: fetch — buyruqning o'zi, manzil — qaysi server, va bo'lim — serverning qaysi eshigi.`, trigger: 'on_mount', waits_for: null }]);
  const Row = ({ k, lbl, val }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: seen.has(k) ? T.successSoft : T.paper, boxShadow: seen.has(k) ? `inset 0 0 0 1.5px ${T.success}` : `0 4px 12px -6px rgba(${T.shadowBase},0.14)`, transition: 'all 0.3s' }}>
      <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', color: seen.has(k) ? T.success : T.ink3, minWidth: 64 }}>{lbl}</span>
      <span key={seen.has(k) ? 'v' : 'q'} className={`mono ${seen.has(k) ? 'el-in' : ''}`} style={{ fontSize: 12.5, color: seen.has(k) ? T.ink : T.ink3 }}>{seen.has(k) ? val : '?'}</span>
    </div>
  );
  return (
    <Stage eyebrow="fetch" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${seen.size}/3 ${tr({ uz: "qismni o'rganing", ru: 'части — изучите' })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Serverdan ma'lumotni <span className="italic" style={{ color: T.accent }}>qaysi buyruq</span> olib keladi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Какая команда</span> приносит данные с сервера?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Tanishing: <span className="mono">fetch</span>. Internet darsidagi ofitsiantni eslaysizmi? <span className="mono">fetch</span> ham shunday ishlaydi: manzilni berasiz — u serverga boradi va javobni olib keladi. Buyruqning <b style={{ color: T.ink }}>3 qismini bosib</b> o'rganing.</>, ru: <>Знакомьтесь: <span className="mono">fetch</span>. Помните официанта из урока про интернет? <span className="mono">fetch</span> работает так же: даёте адрес — он идёт на сервер и приносит ответ. <b style={{ color: T.ink }}>Нажмите на 3 части</b> команды и изучите их.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <pre className="code-box fade-up delay-1" style={{ fontSize: 'clamp(13px,1.9vw,16px)', lineHeight: 2.1, padding: '16px 18px' }}>
              <span onClick={() => tap('fetch')} className={tokCls('fetch')}><Jx>fetch</Jx></span>
              {'('}
              <span onClick={() => tap('url')} className={tokCls('url')}><St>'https://robo-api.uz</St></span>
              <span onClick={() => tap('ep')} className={tokCls('ep')}><St>/games'</St></span>
              {')'}
            </pre>
            {active
              ? <div className="sk-info" key={active}><p className="note-h" style={{ color: T.accent }}>{tr(PARTS[active].title)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(PARTS[active].desc)}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: '👆 Kodning rangli qismlarini bosing', ru: '👆 Нажимайте на цветные части кода' })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "So'rov pasporti", ru: 'Паспорт запроса' })}</p>
            <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Row k="fetch" lbl={tr({ uz: 'BUYRUQ', ru: 'КОМАНДА' })} val={tr({ uz: 'GET — borib olib kel', ru: 'GET — сходи и принеси' })} />
              <Row k="url" lbl={tr({ uz: 'SERVER', ru: 'СЕРВЕР' })} val="https://robo-api.uz" />
              <Row k="ep" lbl={tr({ uz: "BO'LIM", ru: 'РАЗДЕЛ' })} val="/games" />
            </div>
            {done && (
              <div className="code-box fade-step" style={{ padding: '9px 13px' }}>
                <TLine out={<span><span style={{ color: CODE.attr }}>GET</span> https://robo-api.uz/games</span>} />
                <TLine out={<span style={{ color: CODE.str }}>{tr({ uz: '✓ 200 OK — server javob berdi', ru: '✓ 200 OK — сервер ответил' })}</span>} />
              </div>
            )}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>So'rov to'liq: <b>kim</b> (fetch) + <b>qayerga</b> (manzil) + <b>nima</b> (/games). Server tushundi va javob qaytardi.</>, ru: <>Запрос полный: <b>кто</b> (fetch) + <b>куда</b> (адрес) + <b>что</b> (/games). Сервер понял и вернул ответ.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 (fetch nima qiladi?) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    audioText="fetch buyrug'i aslida nima qiladi? To'g'ri javobni tanlang."
    questionText="fetch('https://robo-api.uz/games') nima qiladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <><span className="mono" style={{ color: T.accent }}>fetch('https://robo-api.uz/games')</span> nima qiladi?</>, ru: <>Что делает <span className="mono" style={{ color: T.accent }}>fetch('https://robo-api.uz/games')</span>?</> })}</h2></>}
    options={[tr({ uz: "Saytni to'liq qaytadan yuklaydi", ru: 'Полностью перезагружает сайт' }), tr({ uz: "Manzilga borib ma'lumotni olib keladi", ru: 'Идёт по адресу и приносит данные' }), tr({ uz: "Faylni kompyuterga yuklab saqlaydi", ru: 'Скачивает и сохраняет файл на компьютер' }), tr({ uz: "Yangi bo'sh sahifa ochadi", ru: 'Открывает новую пустую страницу' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! fetch — ofitsiant kabi: manzilga boradi, so'raydi, javobni olib keladi. Bu GET so'rovi — faqat olish.", ru: 'Верно! fetch — как официант: идёт по адресу, спрашивает и приносит ответ. Это GET-запрос — только получение.' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — sahifa joyida qoladi. fetch indamasdan, orqa fonda serverga borib keladi.", ru: 'Нет — страница остаётся на месте. fetch тихо, в фоне сходит на сервер и вернётся.' }),
      2: tr({ uz: "Yo'q — hech narsa saqlanmaydi. fetch ma'lumotni kodga olib keladi, xolos.", ru: 'Нет — ничего не сохраняется. fetch просто приносит данные в код.' }),
      3: tr({ uz: "Yo'q — yangi sahifa ochilmaydi. Hammasi shu sahifaning ichida, ko'zga ko'rinmay bo'ladi.", ru: 'Нет — новая страница не открывается. Всё происходит внутри этой же страницы, незаметно для глаз.' }),
      default: tr({ uz: "fetch = manzilga so'rov yuborish va javobni olib kelish.", ru: 'fetch = отправить запрос по адресу и принести ответ.' })
    }} />
);

// ===== SCREEN 5 — JSON (javob matn → .json() → massiv) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [got, setGot] = useState(!!storedAnswer);     // javob keldi (matn)
  const [parsed, setParsed] = useState(!!storedAnswer); // .json() qilindi
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);
  const done = got && parsed;
  useEffect(() => () => clearTimeout(timer.current), []);
  const send = () => {
    if (loading || got) return;
    setLoading(true);
    timer.current = setTimeout(() => { setLoading(false); setGot(true); }, 800);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's5', text: `Server javobi nega darrov ishlamaydi? Chunki javob shunchaki matn bo'lib keladi — qo'shtirnoq ichida — unga map qilib bo'lmaydi. Ofitsiant patnisni qopqoq bilan olib keladi: qopqoqni ochish kerak. Ochish — bu .json(): u matnni haqiqiy massivga aylantiradi. Avval so'rov yuboring, keyin .json() bilan tarjima qiling va kartochkalar chiqishini ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow="JSON" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (got ? tr({ uz: 'Endi .json() qiling', ru: 'Теперь примените .json()' }) : tr({ uz: "So'rov yuboring", ru: 'Отправьте запрос' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Server javobi nega <span className="italic" style={{ color: T.accent }}>darrov ishlamaydi</span>?</>, ru: <>Почему ответ сервера <span className="italic" style={{ color: T.accent }}>не работает сразу</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Server javobi <b style={{ color: T.ink }}>shunchaki matn</b> bo'lib keladi (qo'shtirnoq ichida!) — unga <Code>map()</Code> qilib bo'lmaydi. Avval <Code>.json()</Code> uni <b style={{ color: T.ink }}>haqiqiy massivga</b> tarjima qiladi. 1-tugma — so'rov yuboring, keyin 2-tugma — tarjima qiling.</>, ru: <>Ответ сервера приходит <b style={{ color: T.ink }}>просто текстом</b> (в кавычках!) — <Code>map()</Code> к нему не применить. Сначала <Code>.json()</Code> переведёт его в <b style={{ color: T.ink }}>настоящий массив</b>. Кнопка 1 — отправьте запрос, затем кнопка 2 — переведите.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={send} disabled={loading || got}>{tr({ uz: "1 · 📨 So'rov yuborish", ru: '1 · 📨 Отправить запрос' })} {got ? '✓' : ''}</button>
              <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => { if (got) setParsed(true); }} disabled={!got || parsed}>{tr({ uz: '2 · 🔄 .json() — tarjima qilish', ru: '2 · 🔄 .json() — перевести' })} {parsed ? '✓' : ''}</button>
            </div>
            <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'Server javobi', ru: 'Ответ сервера' })}</p>
            <div className="json-stage">
              {!got && !loading && <div className="json-empty">{tr({ uz: "📭 hali so'rov yuborilmagan…", ru: '📭 запрос ещё не отправлен…' })}</div>}
              {loading && <div className="json-empty">{tr({ uz: '⏳ GET /games — javob kutilmoqda…', ru: '⏳ GET /games — ждём ответ…' })}</div>}
              {got && !parsed && (
                <div className="json-card txt" key="txt">
                  <div className="json-head"><span className="json-tag bad">{tr({ uz: '🔒 MATN (string)', ru: '🔒 ТЕКСТ (string)' })}</span><span className="json-note bad">{tr({ uz: '❌ map() hali ishlamaydi', ru: '❌ map() пока не работает' })}</span></div>
                  <pre className="json-body">{'\'[ {"name":"Adopt Me!"}, {"name":"Doors"} ]\''}</pre>
                </div>
              )}
              {parsed && (
                <div className="json-card arr" key="arr">
                  <div className="json-head"><span className="json-tag good">{tr({ uz: '📦 MASSIV (array)', ru: '📦 МАССИВ (array)' })}</span><span className="json-note good">{tr({ uz: '✓ endi map() ishlaydi', ru: '✓ теперь map() работает' })}</span></div>
                  <pre className="json-body">{'[\n  { name: '}<St>"Adopt Me!"</St>{' },\n  { name: '}<St>"Doors"</St>{' }\n]'}</pre>
                </div>
              )}
            </div>
            {got && !parsed && <p className="small fade-step" style={{ margin: 0, color: T.accent, fontStyle: 'italic' }}>{tr({ uz: '↑ Bu hali matn. 2-tugmani bosing — massivga aylansin.', ru: '↑ Это пока текст. Нажмите кнопку 2 — пусть станет массивом.' })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Ekranda — map() natijasi', ru: 'На экране — результат map()' })}</p>
            <Win title="robo-games — localhost:5173" minH={118}>
              {parsed
                ? <div className="fade-step" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 280 }}>
                    <RoCard name="Adopt Me!" />
                    <RoCard name="Doors" />
                  </div>
                : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 96 }}>
                    <span style={{ fontSize: 26, opacity: got ? 1 : 0.4 }}>{got ? '🔒' : '📭'}</span>
                    <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13, textAlign: 'center' }}>{got ? tr({ uz: "Javob hali MATN — map() ishlamaydi. Avval .json() qiling.", ru: 'Ответ пока ТЕКСТ — map() не работает. Сначала примените .json().' }) : tr({ uz: "So'rov yuboring…", ru: 'Отправьте запрос…' })}</p>
                  </div>}
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Yo'l aniq: <b>matn → .json() → massiv → map → kartochkalar</b>. Tarjimasiz massiv yo'q, massivsiz map yo'q!</>, ru: <>Путь ясен: <b>текст → .json() → массив → map → карточки</b>. Без перевода нет массива, без массива нет map!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5b — TEST 2 (.json) =====
const Screen5b = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv', ru: 'Проверка' })}
    audioText="Server javobini kodda ishlatishdan oldin nima qilamiz? To'g'ri javobni tanlang."
    questionText="Server javobini kodda ishlatishdan oldin nima qilamiz?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Mustahkamlash', ru: 'Закрепление' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Server javobini kodda ishlatishdan oldin <span className="italic" style={{ color: T.accent }}>nima qilamiz</span>?</>, ru: <><span className="italic" style={{ color: T.accent }}>Что мы делаем</span> с ответом сервера перед использованием в коде?</> })}</h2></>}
    options={[tr({ uz: "Hech narsa — javob darrov tayyor bo'ladi", ru: 'Ничего — ответ сразу готов' }), tr({ uz: "Javobni qaytadan serverga yuboramiz", ru: 'Отправляем ответ обратно на сервер' }), tr({ uz: ".json() bilan massivga aylantiramiz", ru: 'Превращаем в массив с помощью .json()' }), tr({ uz: "Ma'lumotni qo'lda ko'chirib yozamiz", ru: 'Переписываем данные вручную' })]} correctIdx={2}
    explainCorrect={tr({ uz: "To'g'ri! Javob JSON matn bo'lib keladi — .json() uni haqiqiy massivga aylantiradi. Shundan keyingina map ishlaydi.", ru: 'Верно! Ответ приходит JSON-текстом — .json() превращает его в настоящий массив. Только после этого работает map.' })}
    explainWrong={{
      0: tr({ uz: "Konsolni eslang: javob matn edi — qo'shtirnoq ichida. Matnga map qilolmaysiz, avval .json().", ru: 'Вспомните консоль: ответ был текстом — в кавычках. К тексту map не применить, сначала .json().' }),
      1: tr({ uz: "Yo'q — javob bizga keldi, uni qaytarish shart emas. Faqat tarjima kerak: .json().", ru: 'Нет — ответ уже у нас, возвращать его не нужно. Нужен только перевод: .json().' }),
      3: tr({ uz: "Yo'q — hech narsa qo'lda yozilmaydi. .json() bir o'zi hammasini aylantiradi.", ru: 'Нет — вручную ничего не пишется. .json() сам всё преобразует.' }),
      default: tr({ uz: "Avval .json() — JSON matnni haqiqiy massivga aylantiradi.", ru: 'Сначала .json() — он превращает JSON-текст в настоящий массив.' })
    }} />
);

// ===== SCREEN 6 — YUKLANISH (skeletonsiz vs skeleton) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const LIST = GAMES.slice(0, 3);
  const [mode, setMode] = useState(null);      // 'plain' | 'skel'
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [tried, setTried] = useState(storedAnswer ? new Set(['plain', 'skel']) : new Set());
  const timer = useRef(null);
  const done = tried.size >= 2;
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = (m) => {
    if (loading) return;
    clearTimeout(timer.current);
    setMode(m); setLoading(true); setLoaded(false);
    setTried(prev => { const s = new Set(prev); s.add(m); return s; });
    timer.current = setTimeout(() => { setLoading(false); setLoaded(true); }, 1800);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's6', text: `Javob kelguncha foydalanuvchi nimani ko'radi? Ofitsiant oshxonaga ketdi — taom hali kelmadi. Shu kutish payti saytlar ikki xil yo'l tutadi: yo bo'sh oq ekran, yo kulrang lipillovchi kartochkalar — skeleton. Ikkala tugmani ham sinang va qaysi biri xotirjamroq ekanini o'zingiz ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Yuklanish', ru: 'Загрузка' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Ikkala usulni sinang', ru: 'Испробуйте оба способа' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Javob kelguncha foydalanuvchi <span className="italic" style={{ color: T.accent }}>nimani ko'radi</span>?</>, ru: <><span className="italic" style={{ color: T.accent }}>Что видит</span> пользователь, пока идёт ответ?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Server javobi bir zumda kelmaydi — internet orqali yo'l bor. Shu kutish payti saytlar ikki xil yo'l tutadi. <b style={{ color: T.ink }}>Ikkalasini ham sinang</b> — qaysi biri yaxshiroq, o'zingiz ko'rasiz.</>, ru: <>Ответ сервера приходит не мгновенно — у него путь через интернет. В это время ожидания сайты ведут себя по-разному. <b style={{ color: T.ink }}>Испробуйте оба варианта</b> — сами увидите, какой лучше.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => run('plain')} disabled={loading}>{tr({ uz: '1 · Shunchaki kutish', ru: '1 · Просто ждать' })} {tried.has('plain') ? '✓' : ''}</button>
              <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => run('skel')} disabled={loading}>{tr({ uz: '2 · Skeleton bilan kutish', ru: '2 · Ждать со скелетоном' })} {tried.has('skel') ? '✓' : ''}</button>
            </div>
            {tried.has('plain') && mode === 'plain' && loading && <div className="hint fade-step"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Bo'sh oq ekran… Sayt qotib qoldimi? Ishlayaptimi? Foydalanuvchi <b style={{ color: T.ink }}>bilmaydi</b>.</>, ru: <>Пустой белый экран… Сайт завис? Работает? Пользователь <b style={{ color: T.ink }}>не знает</b>.</> })}</p></div>}
            {mode === 'skel' && loading && <div className="hint fade-step"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Kulrang kartochkalar lipillayapti — "sayt tirik, ma'lumot <b style={{ color: T.ink }}>yo'lda</b>" degan signal.</>, ru: <>Серые карточки мерцают — сигнал: «сайт жив, данные <b style={{ color: T.ink }}>в пути</b>».</> })}</p></div>}
            {done && !loading && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>Skeleton</b> — yuklanayotgan kartochkaning kulrang sharpasi. Roblox, YouTube, Instagram — hammasi shuni ishlatadi: foydalanuvchi xotirjam kutadi.</>, ru: <><b>Скелетон</b> — серый призрак загружающейся карточки. Roblox, YouTube, Instagram — все его используют: пользователь ждёт спокойно.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">robo-games {loading ? tr({ uz: '— yuklanmoqda…', ru: '— загружается…' }) : ''}</p>
            <Win title="robo-games — localhost:5173" minH={120}>
              {!mode && <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{tr({ uz: 'Chapdagi tugmalardan birini bosing…', ru: 'Нажмите одну из кнопок слева…' })}</p>}
              {mode && loading && mode === 'plain' && <div style={{ height: 96 }} />}
              {mode && loading && mode === 'skel' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <SkelCard /><SkelCard /><SkelCard />
                </div>
              )}
              {mode && loaded && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {LIST.map((g, i) => <div key={g.name} className="el-in" style={{ animationDelay: `${i * 0.13}s`, animationFillMode: 'backwards' }}><RoCard name={g.name} /></div>)}
                </div>
              )}
            </Win>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — TO'LIQ NAQSH (useEffect + fetch + state, 4 qadam anim) =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const LIST = GAMES.slice(0, 3);
  const [step, setStep] = useState(storedAnswer ? 4 : 0); // 0 idle, 1..4
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
  const hl = (z) => ({ borderRadius: 6, padding: '1px 5px', display: 'inline-block', background: running && step === z ? 'rgba(255,79,40,0.22)' : (step > z || (!running && step >= z && step >= 4) ? 'rgba(31,122,77,0.12)' : 'transparent'), transition: 'all 0.3s' });
  const STEPS = [
    { z: 1, t: { uz: "Sahifa ochildi — games hali bo'sh [ ]", ru: 'Страница открылась — games пока пуст [ ]' } },
    { z: 2, t: { uz: "useEffect fetch'ni yubordi — so'rov yo'lda", ru: 'useEffect отправил fetch — запрос в пути' } },
    { z: 3, t: { uz: "Javob keldi — .json() massivga aylantirdi", ru: 'Ответ пришёл — .json() превратил его в массив' } },
    { z: 4, t: { uz: "setGames — React kartochkalarni chizdi", ru: 'setGames — React нарисовал карточки' } }
  ];
  const audio = useAudio([{ id: 's7', text: `Endi hammasi birga — professional saytlarning yuragi, to'rt qadam. Sahifa ochilganda games hali bo'sh. useEffect fetch'ni yuboradi — so'rov yo'lda. Javob kelganda .json() uni massivga aylantiradi. Oxirida setGames state'ga yozadi va React kartochkalarni chizadi. Tugmani bosib, kod bilan ekranni birga kuzating — useState va useEffect o'tgan darslardan tanish, yangi mehmon faqat fetch.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: "To'liq usul", ru: 'Полный приём' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Usulni ishga tushiring', ru: 'Запустите приём' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Hammasi birga: to'liq usul <span className="italic" style={{ color: T.accent }}>qanday ishlaydi</span>?</>, ru: <>Всё вместе: <span className="italic" style={{ color: T.accent }}>как работает</span> полный приём?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana professional saytlarning yuragi — <b style={{ color: T.ink }}>4 qadam</b>: bo'sh state → useEffect so'rov yuboradi → javob keladi → setGames chizadi. ▶ tugmasini bosib, <b style={{ color: T.ink }}>kod bilan ekranni birga</b> kuzating.</>, ru: <>Вот сердце профессиональных сайтов — <b style={{ color: T.ink }}>4 шага</b>: пустой state → useEffect шлёт запрос → приходит ответ → setGames рисует. Нажмите ▶ и следите <b style={{ color: T.ink }}>за кодом и экраном одновременно</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <button className="btn fade-up delay-1" style={{ alignSelf: 'flex-start' }} onClick={run} disabled={running}>{running ? tr({ uz: 'Ishlayapti…', ru: 'Работает…' }) : (done ? tr({ uz: "↻ Yana ko'rish", ru: '↻ Посмотреть ещё раз' }) : tr({ uz: '▶ Usulni ishga tushirish', ru: '▶ Запустить приём' }))}</button>
            <pre className="code-box fade-up delay-2" style={{ lineHeight: 1.95 }}>
              <span style={hl(1)}><Jx>{'const'}</Jx>{' [games, setGames] = useState([]);'}</span>{'\n\n'}
              <span style={hl(2)}>{'useEffect(() => {'}</span>{'\n'}
              <span style={hl(2)}>{'  fetch('}<St>'https://robo-api.uz/games'</St>{')'}</span>{'\n'}
              <span style={hl(3)}>{'    .then(res => res.json())'}</span>{'\n'}
              <span style={hl(4)}>{'    .then(data => setGames(data));'}</span>{'\n'}
              {'}, []);'}
            </pre>
          </Col>
          <Col>
            <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STEPS.map(s => (
                <div key={s.z} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 12px', borderRadius: 11, background: step >= s.z ? T.successSoft : T.paper, boxShadow: running && step === s.z ? `inset 0 0 0 1.5px ${T.accent}` : (step >= s.z ? `inset 0 0 0 1.5px ${T.success}` : `0 4px 12px -6px rgba(${T.shadowBase},0.14)`), transition: 'all 0.35s' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 11.5, color: step >= s.z ? T.success : T.ink3 }}>{step >= s.z ? '✓' : s.z}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12.5, color: step >= s.z ? T.ink : T.ink3, transition: 'color 0.35s' }}>{tr(s.t)}</span>
                </div>
              ))}
            </div>
            <Win title="robo-games — localhost:5173" minH={96}>
              {step < 2 && <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{running ? tr({ uz: 'sahifa ochildi…', ru: 'страница открылась…' }) : tr({ uz: '▶ tugmasini bosing', ru: 'нажмите кнопку ▶' })}</p>}
              {(step === 2 || step === 3) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <SkelCard /><SkelCard /><SkelCard />
                </div>
              )}
              {step >= 4 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {LIST.map((g, i) => <div key={g.name} className="el-in" style={{ animationDelay: `${i * 0.16}s`, animationFillMode: 'backwards' }}><RoCard name={g.name} /></div>)}
                </div>
              )}
            </Win>
            {done && !running && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Tanish qismlarga e'tibor bering: <span className="mono">useState</span> va <span className="mono">useEffect</span> — o'tgan darslardan! Yangi mehmon faqat bitta: <span className="mono">fetch</span>.</>, ru: <>Обратите внимание на знакомые части: <span className="mono">useState</span> и <span className="mono">useEffect</span> — из прошлых уроков! Новый гость всего один: <span className="mono">fetch</span>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — ENDPOINTLAR (/games /top /new) =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const EPS = ['/games', '/top', '/new'];
  const LABELS = { '/games': { uz: "hamma o'yinlar", ru: 'все игры' }, '/top': { uz: "eng zo'rlari", ru: 'самые топовые' }, '/new': { uz: 'yangilari', ru: 'новые' } };
  const [ep, setEp] = useState(storedAnswer ? '/top' : null);
  const [loading, setLoading] = useState(false);
  const [tried, setTried] = useState(storedAnswer ? new Set(['/games', '/top']) : new Set());
  const timer = useRef(null);
  const done = tried.size >= 2;
  useEffect(() => () => clearTimeout(timer.current), []);
  const choose = (e) => {
    clearTimeout(timer.current);
    setEp(e); setLoading(true);
    setTried(prev => { const s = new Set(prev); s.add(e); return s; });
    timer.current = setTimeout(() => setLoading(false), 600);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's8', text: `Bitta serverdan har xil ro'yxat olsa bo'ladimi? Bo'ladi. Server — katta bino, endpointlar esa uning eshiklari: slash-games hamma o'yinlar, slash-top eng zo'rlari, slash-new yangilari. Eshiklarni tanlab ko'ring — faqat manzil oxiri o'zgaradi, fetch esa o'sha bo'limning ro'yxatini olib keladi.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Endpointlar', ru: 'Эндпоинты' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Kamida 2 eshikni sinang', ru: 'Испробуйте минимум 2 двери' })} (${tried.size}/2)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta serverdan <span className="italic" style={{ color: T.accent }}>har xil ro'yxat</span> olsa bo'ladimi?</>, ru: <>Можно ли получить <span className="italic" style={{ color: T.accent }}>разные списки</span> с одного сервера?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bo'ladi! Server — katta bino, <b style={{ color: T.ink }}>endpointlar — eshiklar</b>: <Code>/games</Code> hammasi, <Code>/top</Code> eng zo'rlari, <Code>/new</Code> yangilari. Eshikni tanlang — <Code>fetch()</Code> o'sha ro'yxatni olib keladi.</>, ru: <>Можно! Сервер — большое здание, <b style={{ color: T.ink }}>эндпоинты — двери</b>: <Code>/games</Code> — все, <Code>/top</Code> — лучшие, <Code>/new</Code> — новые. Выберите дверь — <Code>fetch()</Code> принесёт нужный список.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Eshikni tanlang', ru: 'Выберите дверь' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {EPS.map(e => (
                <button key={e} className={`chip ${ep === e ? 'chip-on' : ''}`} onClick={() => choose(e)}>
                  <span className="mono" style={{ fontSize: 13 }}>{e}</span>
                  <span style={{ fontSize: 11.5, opacity: 0.75 }}>{tr(LABELS[e])}</span>
                  {tried.has(e) ? ' ✓' : ''}
                </button>
              ))}
            </div>
            <pre className="code-box fade-up delay-2" style={{ padding: '12px 14px' }}>
              {'fetch('}<St>'https://robo-api.uz</St>{ep ? <St><b>{ep}</b></St> : <Cm>?</Cm>}<St>'</St>{')'}
            </pre>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bitta server — uchta eshik. Faqat <b>manzil oxiri</b> o'zgaradi, fetch o'sha bo'limni keltiradi. Roblox'dagi "Top", "Yangi" qatorlari ham shunday ishlaydi.</>, ru: <>Один сервер — три двери. Меняется только <b>конец адреса</b>, а fetch приносит нужный раздел. Ряды «Top» и «New» в Roblox работают так же.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">robo-api.uz{ep || ''}</p>
            <Win title={`robo-api.uz${ep || ''}`} minH={110}>
              {!ep && <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{tr({ uz: 'Eshik tanlanmagan…', ru: 'Дверь не выбрана…' })}</p>}
              {ep && loading && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {SERVER[ep].map((_, i) => <SkelCard key={i} />)}
                </div>
              )}
              {ep && !loading && (
                <div key={ep} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {SERVER[ep].map((nm, i) => <div key={nm} className="el-in" style={{ animationDelay: `${i * 0.12}s`, animationFillMode: 'backwards' }}><RoCard name={nm} top={ep === '/top'} /></div>)}
                </div>
              )}
            </Win>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEST 3 (kelgan ma'lumot qanday ekranga chiqadi?) =====
const Screen9 = (props) => (
  <QuestionScreen {...props} idx={9} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    audioText="Serverdan kelgan o'yinlar qanday qilib ekranga chiqadi? To'g'ri javobni tanlang."
    questionText="Serverdan kelgan o'yinlar qanday qilib ekranga chiqadi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Serverdan kelgan o'yinlar <span className="italic" style={{ color: T.accent }}>qanday qilib</span> ekranga chiqadi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> игры с сервера попадают на экран?</> })}</h2></>}
    options={[tr({ uz: "Sahifani qo'lda yangilab turish kerak", ru: 'Нужно вручную обновлять страницу' }), tr({ uz: "fetch o'zi ekranga chizib qo'yadi", ru: 'fetch сам рисует их на экране' }), tr({ uz: "useEffect o'zi chizib beradi", ru: 'useEffect сам их рисует' }), tr({ uz: "setGames state'ga yozadi — React qayta chizadi", ru: 'setGames пишет в state — React перерисовывает' })]} correctIdx={3}
    explainCorrect={tr({ uz: "To'g'ri! fetch faqat olib keladi, chizish — state'ning ishi: setGames(data) → state yangilandi → React kartochkalarni chizdi. O'tgan darsdagi qoida shu yerda ham ishlayapti!", ru: 'Верно! fetch только приносит, а рисование — дело state: setGames(data) → state обновился → React нарисовал карточки. Правило из прошлого урока работает и здесь!' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — qo'lda yangilash kerak emas. setGames state'ni o'zgartirgan zahoti React o'zi qayta chizadi.", ru: 'Нет — вручную обновлять не нужно. Как только setGames изменит state, React сам всё перерисует.' }),
      1: tr({ uz: "fetch — ofitsiant: olib keladi, lekin chizmaydi. Chizish uchun ma'lumot state'ga tushishi kerak.", ru: 'fetch — официант: приносит, но не рисует. Чтобы нарисовалось, данные должны попасть в state.' }),
      2: tr({ uz: "useEffect — faqat 'qachon ishga tushirish'ni hal qiladi. Chizishni state o'zgarishi boshlaydi.", ru: 'useEffect решает только «когда запустить». Рисование запускает изменение state.' }),
      default: tr({ uz: "Yo'l: javob → .json() → setGames(data) → state yangilandi → React chizdi.", ru: 'Путь: ответ → .json() → setGames(data) → state обновился → React нарисовал.' })
    }} />
);

// ===== SCREEN 10 — 404 (xato manzil) =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const LIST = GAMES.slice(0, 3);
  const [cur, setCur] = useState(storedAnswer ? 'good' : 'bad'); // default: xato manzil (404)
  const [triedBad, setTriedBad] = useState(true); // sahifa xatodan boshlanadi
  const [triedGood, setTriedGood] = useState(!!storedAnswer);
  const done = triedBad && triedGood;
  const send = (which) => {
    setCur(which);
    if (which === 'bad') setTriedBad(true); else setTriedGood(true);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's10', text: `Manzilda bitta harf xato bo'lsa-chi? Mana, sayt hozir xato manzilga so'rov yuboryapti — slash-gmaes, harflar aralashib ketgan. Server 404, ya'ni Topilmadi deb javob berdi, katalog bo'sh qoldi. 404 dushman emas — xabarchi: bunday eshik menda yo'q, deydi. To'g'ri manzil tugmasini bosib, o'zingiz tuzating.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow="404" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "To'g'ri manzilni bosib tuzating", ru: 'Нажмите верный адрес и исправьте' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Manzilda <span className="italic" style={{ color: T.accent }}>bitta harf xato</span> bo'lsa-chi?</>, ru: <>А если в адресе <span className="italic" style={{ color: T.accent }}>ошибка в одной букве</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana, sayt hozir <b style={{ color: T.ink }}>xato manzilga</b> so'rov yuboryapti — <Code>/gmaes</Code> (harflar aralashib ketgan!). Server <b style={{ color: T.ink }}>404 — "Topilmadi"</b> deb javob berdi, katalog bo'sh. Endi <b style={{ color: T.ink }}>to'g'ri manzil</b> tugmasini bosib, o'zingiz tuzating.</>, ru: <>Смотрите: сайт сейчас шлёт запрос <b style={{ color: T.ink }}>по неверному адресу</b> — <Code>/gmaes</Code> (буквы перепутались!). Сервер ответил <b style={{ color: T.ink }}>404 — «Не найдено»</b>, каталог пуст. Теперь нажмите кнопку с <b style={{ color: T.ink }}>верным адресом</b> и исправьте сами.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <button className="btn-soft mono" style={{ alignSelf: 'flex-start', fontFamily: "'JetBrains Mono',monospace" }} onClick={() => send('bad')}>fetch('…/gmaes') {triedBad ? '✓' : ''}</button>
              <button className="btn mono" style={{ alignSelf: 'flex-start', fontFamily: "'JetBrains Mono',monospace" }} onClick={() => send('good')}>fetch('…/games') {triedGood ? '✓' : ''}</button>
            </div>
            <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'Konsol', ru: 'Консоль' })}</p>
            <div className="code-box" style={{ padding: '10px 13px', minHeight: 64 }}>
              {!cur && <TLine out={<span style={{ color: CODE.comment, fontStyle: 'italic' }}>{tr({ uz: 'manzilni tanlang…', ru: 'выберите адрес…' })}</span>} />}
              {cur === 'bad' && (
                <>
                  <TLine out={<span><span style={{ color: CODE.attr }}>GET</span> https://robo-api.uz/gmaes</span>} />
                  <TLine out={<span className="el-in" style={{ display: 'inline-block', color: CODE.tag }}>{tr({ uz: "❌ 404 Not Found — bunday endpoint yo'q", ru: '❌ 404 Not Found — такого эндпоинта нет' })}</span>} />
                </>
              )}
              {cur === 'good' && (
                <>
                  <TLine out={<span><span style={{ color: CODE.attr }}>GET</span> https://robo-api.uz/games</span>} />
                  <TLine out={<span className="el-in" style={{ display: 'inline-block', color: CODE.str }}>{tr({ uz: "✓ 200 OK — 3 ta o'yin keldi", ru: '✓ 200 OK — пришло 3 игры' })}</span>} />
                </>
              )}
            </div>
          </Col>
          <Col>
            <p className="flow-label">robo-games</p>
            <Win title="robo-games — localhost:5173" minH={104}>
              {cur === 'good'
                ? <div className="fade-step" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>{LIST.map(g => <RoCard key={g.name} name={g.name} />)}</div>
                : <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{cur === 'bad' ? tr({ uz: "katalog bo'sh qoldi — ma'lumot kelmadi…", ru: 'каталог остался пустым — данные не пришли…' }) : tr({ uz: 'kutilmoqda…', ru: 'ожидание…' })}</p>}
            </Win>
            {triedBad && !triedGood && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>404 — bu serverning javobi: <b>"so'rading, lekin menda /gmaes degan eshik yo'q"</b>. Sayt buzilmadi — faqat manzil xato. Endi to'g'risini sinang.</>, ru: <>404 — это ответ сервера: <b>«ты спросил, но двери /gmaes у меня нет»</b>. Сайт не сломался — просто адрес неверный. Теперь попробуйте правильный.</> })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>404 — dushman emas, <b>xabarchi</b>: manzilni tekshir, deydi. Konsolda 404 ko'rsangiz — birinchi navbatda <b>manzil harflarini</b> tekshirasiz.</>, ru: <>404 не враг, а <b>вестник</b>: он говорит «проверь адрес». Увидели 404 в консоли — первым делом проверяете <b>буквы адреса</b>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — VIBECODING (AI bilan serverli boyitish) =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const TASKS = [
    { id: 't1', label: tr({ uz: "Saytga TOP o'yinlar bo'limini qo'sh", ru: 'Добавь на сайт раздел ТОП-игр' }), plan: [tr({ uz: "fetch('https://robo-api.uz/top') so'rov yuboraman", ru: "Отправлю запрос fetch('https://robo-api.uz/top')" }), tr({ uz: "Kelgan ro'yxatni alohida TOP qatorida chizaman", ru: 'Нарисую пришедший список отдельным рядом TOP' })], code: <>{'fetch('}<St>'https://robo-api.uz/top'</St>{').then(r => r.json()).then(d => setTop(d))'}</> },
    { id: 't2', label: tr({ uz: "Yangi o'yinlar bo'limini qo'sh", ru: 'Добавь раздел новых игр' }), plan: [tr({ uz: "fetch('https://robo-api.uz/new') so'rov yuboraman", ru: "Отправлю запрос fetch('https://robo-api.uz/new')" }), tr({ uz: "Javobni 'Yangi' sarlavhasi ostida chizaman", ru: 'Нарисую ответ под заголовком «Новые»' })], code: <>{'fetch('}<St>'https://robo-api.uz/new'</St>{').then(r => r.json()).then(d => setNew(d))'}</> },
    { id: 't3', label: tr({ uz: "Yuklanayotganda skeleton ko'rsat", ru: 'Показывай скелетон во время загрузки' }), plan: [tr({ uz: "loading degan state qo'shaman — boshida true", ru: 'Добавлю state с именем loading — вначале true' }), tr({ uz: "Javob kelganda false qilib, skeleton o'rniga kartochkalarni chizaman", ru: 'Когда придёт ответ, поставлю false и вместо скелетона нарисую карточки' })], code: <>{'{loading ? '}<Jx>{'<Skeleton />'}</Jx>{' : games.map(…)}'}</> }
  ];
  const [task, setTask] = useState(null);
  const [phase, setPhase] = useState(storedAnswer ? 'done' : 'idle'); // idle | planned | building | done
  const timer = useRef(null);
  const done = phase === 'done';
  useEffect(() => () => clearTimeout(timer.current), []);
  const choose = (id) => { clearTimeout(timer.current); setTask(id); setPhase('planned'); };
  const approve = () => { clearTimeout(timer.current); setPhase('building'); timer.current = setTimeout(() => setPhase('done'), 1300); };
  const cur = TASKS.find(t => t.id === task) || (storedAnswer ? TASKS[0] : null);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's11', text: `Serverli saytni AI bilan boyitsak-chi? Endi siz so'rov usulini bilasiz — shuning uchun agent kodini tekshira olasiz: manzil to'g'rimi, .json() bormi, javob state'ga tushyaptimi. Agentga so'z bilan buyruq bering, u tayyorlagan rejani tasdiqlang va natijani sinang.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Keyingi qadam · AI', ru: 'Следующий шаг · AI' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Agent bilan ishlab ko'ring", ru: 'Поработайте с агентом' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Serverli saytni <span className="italic" style={{ color: T.accent }}>AI bilan</span> boyitsak-chi?</>, ru: <>А если прокачать серверный сайт <span className="italic" style={{ color: T.accent }}>с помощью AI</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Endi siz so'rov usulini bilasiz — agent kodini <b style={{ color: T.ink }}>tekshira olasiz</b>: manzil to'g'rimi, .json() bormi, javob state'ga tushyaptimi. Buyruq bering, rejani <b style={{ color: T.ink }}>tasdiqlang</b>, natijani sinang.</>, ru: <>Теперь вы знаете приём запроса — значит, <b style={{ color: T.ink }}>можете проверить</b> код агента: верный ли адрес, есть ли .json(), попадает ли ответ в state. Дайте команду, <b style={{ color: T.ink }}>подтвердите</b> план, проверьте результат.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "1. Agentga so'z bilan ayting", ru: '1. Скажите агенту словами' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TASKS.map(t => <button key={t.id} className={`chip ${task === t.id ? 'chip-on' : ''}`} onClick={() => choose(t.id)} style={{ justifyContent: 'flex-start', textAlign: 'left' }}>"{t.label}"</button>)}
            </div>
            {!cur && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Yuqoridan bitta buyruqni tanlang', ru: 'Выберите одну команду выше' })}</p></div>}
            {cur && (
              <div className="ai-card fade-step" key={task || 'stored'}>
                <div className="ai-row"><span className="ai-badge" style={{ background: T.ink }}>{tr({ uz: 'Agent', ru: 'Агент' })}</span><span className="ai-bubble">{phase === 'planned' ? tr({ uz: 'Mana rejam — tasdiqlaysizmi?', ru: 'Вот мой план — подтверждаете?' }) : (phase === 'building' ? tr({ uz: 'Yozyapman…', ru: 'Пишу…' }) : tr({ uz: 'Bajardim — kodni tekshiring', ru: 'Готово — проверьте код' }))}</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cur.plan.map((p, i) => <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}><span style={{ color: phase === 'planned' ? T.ink3 : T.success }}>{phase === 'planned' ? '○' : '✓'}</span><span style={{ color: T.ink }}>{p}</span></div>)}
                </div>
                {phase === 'planned' && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={approve}>{tr({ uz: 'Rejani tasdiqlash', ru: 'Подтвердить план' })}</button>}
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
                  {cur.id === 't1' && <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 13.5, color: T.ink, margin: 0 }}>{tr({ uz: "TOP o'yinlar", ru: 'ТОП-игры' })} <span className="mono small" style={{ color: T.success, fontWeight: 700 }}>{tr({ uz: '← /top dan keldi', ru: '← пришло из /top' })}</span></p>}
                  {cur.id === 't2' && <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 13.5, color: T.ink, margin: 0 }}>{tr({ uz: "Yangi o'yinlar", ru: 'Новые игры' })} <span className="mono small" style={{ color: T.success, fontWeight: 700 }}>{tr({ uz: '← /new dan keldi', ru: '← пришло из /new' })}</span></p>}
                  {cur.id === 't3' && <p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 13.5, color: T.ink, margin: 0 }}>{tr({ uz: "Yuklanish chiroyli bo'ldi", ru: 'Загрузка стала красивой' })} <span className="mono small" style={{ color: T.success, fontWeight: 700 }}>{tr({ uz: '← skeleton', ru: '← скелетон' })}</span></p>}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {cur.id === 't1' && SERVER['/top'].map(nm => <RoCard key={nm} name={nm} top />)}
                    {cur.id === 't2' && SERVER['/new'].map(nm => <RoCard key={nm} name={nm} />)}
                    {cur.id === 't3' && <><SkelCard /><RoCard name="Adopt Me!" /><RoCard name="Doors" /></>}
                  </div>
                </div>
              ) : (
                <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{tr({ uz: 'Buyruq bering va rejani tasdiqlang…', ru: 'Дайте команду и подтвердите план…' })}</p>
              )}
            </Win>
            {done
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Kodni o'qing: manzil <b>to'g'ri eshikka</b> boryapti, javob <b>.json()dan o'tib</b> state'ga tushyapti. Agent ishini <b>isbot bilan</b> qabul qildingiz.</>, ru: <>Прочитайте код: адрес идёт <b>в верную дверь</b>, ответ <b>проходит через .json()</b> и попадает в state. Вы приняли работу агента <b>с доказательством</b>.</> })}</p></div>
              : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr({ uz: "Natija shu yerda paydo bo'ladi — keyin uni o'zingiz tekshirasiz.", ru: 'Результат появится здесь — потом вы сами его проверите.' })}</p>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TEST 4 (404 ko'rsangiz nimani tekshirasiz?) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} idx={12} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    audioText="Konsolda 404 ko'rsangiz, birinchi nimani tekshirasiz? To'g'ri javobni tanlang."
    questionText="Konsolda 404 xatosini ko'rsangiz, birinchi nimani tekshirasiz?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Konsolda <span className="mono" style={{ color: T.accent }}>404</span> ko'rsangiz, birinchi <span className="italic" style={{ color: T.accent }}>nimani tekshirasiz</span>?</>, ru: <>Увидели в консоли <span className="mono" style={{ color: T.accent }}>404</span> — <span className="italic" style={{ color: T.accent }}>что проверите</span> первым делом?</> })}</h2></>}
    options={[tr({ uz: "Manzilni — endpoint to'g'ri yozilganmi", ru: 'Адрес — верно ли написан эндпоинт' }), tr({ uz: "Kompyuterni o'chirib yoqaman", ru: 'Перезагружу компьютер' }), tr({ uz: "React'ni qaytadan o'rnataman", ru: 'Переустановлю React' }), tr({ uz: "Hech narsani — o'zi tuzalib ketadi", ru: 'Ничего — само починится' })]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! 404 = server 'bunday eshik menda yo'q' deyapti. Demak manzilda xato bor — harflarni tekshirasiz: /gmaes emas, /games.", ru: 'Верно! 404 = сервер говорит «такой двери у меня нет». Значит, в адресе ошибка — проверяете буквы: не /gmaes, а /games.' })}
    explainWrong={{
      1: tr({ uz: "Yo'q — kompyuterda ayb yo'q. 404 server javobi: so'ralgan manzil topilmadi.", ru: 'Нет — компьютер не виноват. 404 — ответ сервера: запрошенный адрес не найден.' }),
      2: tr({ uz: "Yo'q — React joyida. 404 faqat manzil haqida gapiryapti.", ru: 'Нет — React в порядке. 404 говорит только об адресе.' }),
      3: tr({ uz: "O'zi tuzalmaydi — manzil xato bo'lsa, server har safar 404 deyveradi. Harflarni tuzatish kerak.", ru: 'Само не починится — пока адрес неверный, сервер каждый раз будет отвечать 404. Нужно исправить буквы.' }),
      default: tr({ uz: "404 = manzil topilmadi. Birinchi qadam — endpoint harflarini tekshirish.", ru: '404 = адрес не найден. Первый шаг — проверить буквы эндпоинта.' })
    }} />
);

// ===== SCREEN 13 — AMALIYOT: SO'ROV KODINI YIG'ISH (tartiblangan bo'laklar) =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const LIST = GAMES.slice(0, 3);
  const ORDER = ['effect', 'fetch', 'json', 'set'];
  const CHIPS = {
    effect: 'useEffect(() => {',
    fetch: "fetch('https://robo-api.uz/games')",
    json: '.then(res => res.json())',
    set: '.then(data => setGames(data));'
  };
  const POOL = ['set', 'fetch', 'effect', 'json']; // ataylab aralashtirilgan
  const HINTS = { effect: { uz: 'qachon? — sahifa ochilganda', ru: 'когда? — при открытии страницы' }, fetch: { uz: "qayerga? — manzilga so'rov", ru: 'куда? — запрос по адресу' }, json: { uz: 'tarjima — matn → massiv', ru: 'перевод — текст → массив' }, set: { uz: 'ekranga — state yangilanadi', ru: 'на экран — state обновляется' } };
  const [placed, setPlaced] = useState(storedAnswer ? 4 : 0);
  const [shakeId, setShakeId] = useState(null);
  const [loaded, setLoaded] = useState(!!storedAnswer);
  const timer = useRef(null);
  const shakeTimer = useRef(null);
  const done = placed >= 4;
  useEffect(() => () => { clearTimeout(timer.current); clearTimeout(shakeTimer.current); }, []);
  useEffect(() => {
    if (done && !loaded) { timer.current = setTimeout(() => setLoaded(true), 900); }
  }, [done]);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const tap = (id) => {
    if (done || POOL.indexOf(id) === -1) return;
    if (ORDER.indexOf(id) < placed) return; // allaqachon joylashgan
    if (ORDER[placed] === id) { setPlaced(p => p + 1); }
    else {
      clearTimeout(shakeTimer.current);
      setShakeId(id);
      shakeTimer.current = setTimeout(() => setShakeId(null), 450);
    }
  };
  const IND = { effect: '', fetch: '  ', json: '    ', set: '    ' };
  const audio = useAudio([{ id: 's13', text: `So'rov kodini o'zingiz yig'a olasizmi? To'rt bo'lakni to'g'ri tartibda bosing — bu ofitsiantning to'rt bekati. Avval qachon: useEffect, smenaga chiqadi. Keyin qayerga: fetch, oshxonaga yuguradi. Keyin tarjima: .json(), qopqoqni ochadi. Oxirida ekranga: setGames, stolga qo'yadi. Xato bossangiz, bo'lak silkinadi.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot · kod yig'ish", ru: 'Практика · сборка кода' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Bo'laklarni tartib bilan bosing", ru: 'Нажимайте блоки по порядку' })} (${placed}/4)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>So'rov kodini <span className="italic" style={{ color: T.accent }}>o'zingiz yig'a olasizmi</span>?</>, ru: <>Соберёте код запроса <span className="italic" style={{ color: T.accent }}>сами</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>4 bo'lak — <b style={{ color: T.ink }}>to'g'ri tartibda</b> bosing: avval <b style={{ color: T.ink }}>qachon</b> (useEffect), keyin <b style={{ color: T.ink }}>qayerga</b> (fetch), keyin <b style={{ color: T.ink }}>tarjima</b> (.json), oxirida <b style={{ color: T.ink }}>ekranga</b> (setGames). Xato bossangiz — bo'lak silkinadi.</>, ru: <>4 блока — нажимайте <b style={{ color: T.ink }}>в правильном порядке</b>: сначала <b style={{ color: T.ink }}>когда</b> (useEffect), потом <b style={{ color: T.ink }}>куда</b> (fetch), затем <b style={{ color: T.ink }}>перевод</b> (.json), в конце <b style={{ color: T.ink }}>на экран</b> (setGames). Ошибётесь — блок затрясётся.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Bo'laklar", ru: 'Блоки' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {POOL.map(id => {
                const used = ORDER.indexOf(id) < placed;
                return (
                  <button key={id} className={`gchip ${shakeId === id ? 'shake' : ''}`} disabled={used} onClick={() => tap(id)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, justifyContent: 'space-between', opacity: used ? 0.35 : 1, padding: '9px 13px' }}>
                    <span>{CHIPS[id]}</span>
                    <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 10.5, color: used ? T.success : T.ink3, fontStyle: 'italic' }}>{used ? '✓' : tr(HINTS[id])}</span>
                  </button>
                );
              })}
            </div>
            <pre className="code-box fade-up delay-2" style={{ lineHeight: 1.95, minHeight: 110 }}>
              {placed === 0 && <Cm>{tr({ uz: "// bo'laklarni tartib bilan bosing…", ru: '// нажимайте блоки по порядку…' })}</Cm>}
              {ORDER.slice(0, placed).map(id => <span key={id} className="el-in" style={{ display: 'inline-block' }}>{IND[id]}{id === 'fetch' ? <>{'fetch('}<St>'https://robo-api.uz/games'</St>{')'}</> : CHIPS[id]}{'\n'}</span>)}
              {done && <span className="el-in" style={{ display: 'inline-block' }}><Cm>{'}, []);'}</Cm></span>}
            </pre>
          </Col>
          <Col>
            <p className="flow-label">robo-games</p>
            <Win title="robo-games — localhost:5173" minH={110}>
              {!done && <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{tr({ uz: "Kod tayyor bo'lganda katalog yuklanadi…", ru: 'Когда код будет готов, каталог загрузится…' })}</p>}
              {done && !loaded && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <SkelCard /><SkelCard /><SkelCard />
                </div>
              )}
              {done && loaded && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {LIST.map((g, i) => <div key={g.name} className="el-in" style={{ animationDelay: `${i * 0.15}s`, animationFillMode: 'backwards' }}><RoCard name={g.name} /></div>)}
                </div>
              )}
            </Win>
            {done && loaded && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Tartib muhim edi: so'rovsiz javob yo'q, tarjimasiz massiv yo'q, setGames'siz ekran yo'q. Siz usulni <b>tushunib</b> yig'dingiz.</>, ru: <>Порядок был важен: без запроса нет ответа, без перевода нет массива, без setGames нет экрана. Вы собрали приём <b>с пониманием</b>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — DEBUGGING (AI kodida endpoint xatosi → 404) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const LIST = GAMES.slice(0, 3);
  const [picked, setPicked] = useState(storedAnswer ? 'url' : null);
  const [fixed, setFixed] = useState(!!storedAnswer);
  const found = picked === 'url';
  const done = fixed;
  const pickUrl = () => { if (found) return; setPicked('url'); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's14', text: `AI yordam beradi — siz esa tekshirasiz. AI so'rov kodini bir zumda yozib berdi, usul to'g'ri. Lekin katalog yuklanmayapti: skeleton aylanaveryapti, konsolda 404. Endi siz 404 nima deyishini bilasiz. Xato qaysi qatorda ekanini toping va manzilni tuzating.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Debugging', ru: 'Отладка' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (found ? tr({ uz: 'Endi tuzating', ru: 'Теперь исправьте' }) : tr({ uz: 'Xatoni toping', ru: 'Найдите ошибку' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI yordam beradi — siz esa <span className="italic" style={{ color: T.accent }}>tekshirasiz</span>.</>, ru: <>AI помогает — а вы <span className="italic" style={{ color: T.accent }}>проверяете</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI so'rov kodini bir zumda yozib berdi — usul to'g'ri. Lekin katalog <b style={{ color: T.ink }}>yuklanmayapti</b>: skeleton aylanaveryapti, konsolda <b style={{ color: T.ink }}>404</b>. Siz endi 404 nima deyishini bilasiz. Xato qaysi qatorda?</>, ru: <>AI мгновенно написал код запроса — приём верный. Но каталог <b style={{ color: T.ink }}>не загружается</b>: скелетон крутится и крутится, в консоли <b style={{ color: T.ink }}>404</b>. Вы уже знаете, что говорит 404. В какой строке ошибка?</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-2">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: "So'rov kodini yozdim:", ru: 'Я написал код запроса:' })}</span></div>
              <div className="ai-code">
                <div className={`ai-line ${picked === 'effect' ? 'ok' : ''}`} onClick={() => { if (!found) setPicked('effect'); }}>{'useEffect(() => {'}</div>
                {!fixed ? (
                  <div className={`ai-line ${found ? 'bad' : ''}`} onClick={pickUrl}>{'  fetch('}<St>'https://robo-api.uz/gmaes'</St>{')'}</div>
                ) : (
                  <div className="ai-line ok el-in">{'  fetch('}<St>'https://robo-api.uz/games'</St>{')  '}<Cm>{tr({ uz: '// tuzatildi!', ru: '// исправлено!' })}</Cm></div>
                )}
                <div className={`ai-line ${picked === 'json' ? 'ok' : ''}`} onClick={() => { if (!found) setPicked('json'); }}>{'    .then(res => res.json())'}</div>
                <div className={`ai-line ${picked === 'set' ? 'ok' : ''}`} onClick={() => { if (!found) setPicked('set'); }}>{'    .then(data => setGames(data));'}</div>
                <div className={`ai-line ${picked === 'end' ? 'ok' : ''}`} onClick={() => { if (!found) setPicked('end'); }}>{'}, []);'}</div>
              </div>
              {!found && <p className="ai-prompt">{tr({ uz: 'Konsoldagi 404 qaysi qator haqida gapiryapti? Bosing.', ru: 'О какой строке говорит 404 в консоли? Нажмите на неё.' })}</p>}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={() => setFixed(true)}>{tr({ uz: '🔧 /games deb tuzatish', ru: '🔧 Исправить на /games' })}</button>}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: 'normal', fontWeight: 600 }}>{tr({ uz: "✓ Tuzatildi — so'rov to'g'ri eshikka ketyapti!", ru: '✓ Исправлено — запрос идёт в верную дверь!' })}</p>}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Konsol va sayt', ru: 'Консоль и сайт' })}</p>
            <div className="code-box" style={{ padding: '9px 13px' }}>
              {!fixed
                ? <TLine out={<span style={{ color: CODE.tag }}>❌ 404 Not Found — /gmaes</span>} />
                : <TLine out={<span className="el-in" style={{ display: 'inline-block', color: CODE.str }}>{tr({ uz: "✓ 200 OK — /games, 3 ta o'yin keldi", ru: '✓ 200 OK — /games, пришло 3 игры' })}</span>} />}
            </div>
            <Win title="robo-games — localhost:5173" minH={104}>
              {!fixed
                ? <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}><SkelCard /><SkelCard /><SkelCard /></div>
                : <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>{LIST.map((g, i) => <div key={g.name} className="el-in" style={{ animationDelay: `${i * 0.15}s`, animationFillMode: 'backwards' }}><RoCard name={g.name} /></div>)}</div>}
            </Win>
            {!found && (
              (picked === 'effect' || picked === 'json' || picked === 'set' || picked === 'end')
                ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu qator to'g'ri{picked === 'json' ? ' — tarjima joyida' : picked === 'set' ? " — state'ga yozish joyida" : ''}. Konsol nima dedi? <span className="mono">404 — /gmaes</span>. Manzilni <b>harfma-harf</b> o'qing.</>, ru: <>Эта строка верная{picked === 'json' ? ' — перевод на месте' : picked === 'set' ? ' — запись в state на месте' : ''}. Что сказала консоль? <span className="mono">404 — /gmaes</span>. Прочитайте адрес <b>по буквам</b>.</> })}</p></div>
                : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Skeleton tugamayapti — demak javob <b style={{ color: T.ink }}>hech qachon kelmagan</b>. Konsoldagi 404 sizga aniq manzilni aytib turibdi.</>, ru: <>Скелетон не исчезает — значит, ответ <b style={{ color: T.ink }}>так и не пришёл</b>. 404 в консоли прямо называет вам адрес.</> })}</p></div>
            )}
            {found && !fixed && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: '✓ Topdingiz!', ru: '✓ Нашли!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">/gmaes</span> — harflar almashib ketgan! Server bunday eshikni tanimaydi, shuning uchun 404. Chapdagi tugma bilan tuzating →</>, ru: <><span className="mono">/gmaes</span> — буквы перепутались! Сервер такой двери не знает, поэтому 404. Исправьте кнопкой слева →</> })}</p></div>}
            {fixed && (
              <div className="takeaway fade-step"><div className="ta-bulb">🛠️</div><p className="ta-h">{tr({ uz: "404 ni o'qidingiz, manzilni tuzatdingiz!", ru: 'Вы прочитали 404 и исправили адрес!' })}</p><p className="ta-sub">{tr({ uz: 'AI tez yozadi, siz tekshirib tuzatasiz — zo\'r jamoa', ru: 'AI быстро пишет, вы проверяете и чините — отличная команда' })}</p></div>
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
      <div className="card-lbl" style={{ color: T.blue }}>{tr({ uz: '👀 Kim bajardi', ru: '👀 Кто выполнил' })} — {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружается…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не присоединился.' })}</p>
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
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: tr(title), solved: true, correct: true, picked: true });
    // JONLI: praktika bajarilgani serverga yoziladi (500+ zona — reytingga aralashmaydi, faqat mentor ko'radi)
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  // JONLI: mentor keyingi sahifaga o'tmaguncha NavNext qulf bo'ladi (optionalLive + LiveGateCtx gate). Hozircha done bo'lsa ochiq.
  const audio = useAudio([{ id: `practice_${screen}`, text: `Endi navbat sizda — bu topshiriqni o'z kompyuteringizda, VS Code'da bajarasiz. games ro'yxatini koddan olib tashlab, katalogni serverdan fetch bilan yuklaysiz. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Отмечайте каждый шаг по мере выполнения. Закончите — нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — наставник следит.</> })}</Mentor>
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
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: 'Отлично! Задание выполнено. Наставник проверит и переведёт вас к следующему шагу.' })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
}
const ScreenApiPractice = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: 'Katalogni serverdan yuklang', ru: 'Загрузите каталог с сервера' }}
    task={{ uz: "robo-games loyihangizda games ro'yxatini koddan olib tashlang va katalogni SERVERdan fetch bilan yuklang — sahifa ochilganda so'rov ketsin, kartochkalar serverdan chiqsin.", ru: 'В своём проекте robo-games уберите список games из кода и загрузите каталог с СЕРВЕРА через fetch — при открытии страницы пусть уходит запрос, а карточки приходят с сервера.' }}
    checklist={[
      { uz: "App faylida `const [games, setGames] = useState([])` e'lon qiling", ru: 'В файле App объявите `const [games, setGames] = useState([])`' },
      { uz: "`useEffect(() => { … }, [])` ichiga so'rovni joylang — bir marta ishlasin", ru: 'Поместите запрос внутрь `useEffect(() => { … }, [])` — пусть сработает один раз' },
      { uz: "`fetch('https://robo-api.uz/games')` — manzilga so'rov yuboring", ru: "`fetch('https://robo-api.uz/games')` — отправьте запрос по адресу" },
      { uz: "`.then(res => res.json())` — javobni massivga aylantiring", ru: '`.then(res => res.json())` — превратите ответ в массив' },
      { uz: "`.then(data => setGames(data))` — natijani state'ga yozing", ru: '`.then(data => setGames(data))` — запишите результат в state' },
      { uz: "Brauzerda tekshiring: avval skeleton, keyin 3 kartochka; konsolda `200 OK`", ru: 'Проверьте в браузере: сначала скелетон, потом 3 карточки; в консоли `200 OK`' },
    ]} />
);

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
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda", ru: '↻ Изучается' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })} · <b>{known}</b></span></div>
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
        : (<p className="fc-hint">{tr({ uz: "👆 Kartani bosing — javobni ko'rasiz", ru: '👆 Нажмите на карту — увидите ответ' })}</p>)}
    </div>
  );
}
// 🃏 API-GET FLASHCARD KARTALARI (front=izoh, back=tushuncha) — Metodist keyin sayqallaydi
const REACT_FLASHCARDS = [
  { front: { uz: "O'yinlar ro'yxati qayerda saqlanadi?", ru: 'Где хранится список игр?' }, back: { uz: "Serverda", ru: 'На сервере' }, note: { uz: "bitta joy — hamma qurilma uchun", ru: 'одно место — для всех устройств' } },
  { front: { uz: "Serverdan ma'lumot olib keladigan buyruq qaysi?", ru: 'Какая команда приносит данные с сервера?' }, back: "fetch", note: { uz: "ofitsiant kabi: boradi va olib keladi", ru: 'как официант: идёт и приносит' } },
  { front: { uz: "Faqat olish uchun so'rov turi qanday ataladi?", ru: 'Как называется запрос только для получения?' }, back: "GET", note: { uz: "serverda hech narsa o'zgarmaydi", ru: 'на сервере ничего не меняется' } },
  { front: { uz: "Serverning /games kabi bo'limi qanday ataladi?", ru: 'Как называется раздел сервера вроде /games?' }, back: { uz: "Endpoint", ru: 'Эндпоинт' }, note: { uz: "server eshiklari: /games, /top, /new", ru: 'двери сервера: /games, /top, /new' } },
  { front: { uz: "Server javobi dastlab qanday ko'rinishda keladi?", ru: 'В каком виде приходит ответ сервера сначала?' }, back: { uz: "JSON matn", ru: 'JSON-текст' }, note: { uz: "matnga map() qilib bo'lmaydi", ru: 'к тексту map() применить нельзя' } },
  { front: { uz: "Javob matnini haqiqiy massivga nima aylantiradi?", ru: 'Что превращает текст ответа в настоящий массив?' }, back: ".json()", note: { uz: "shundan keyingina map() ishlaydi", ru: 'только после этого работает map()' } },
  { front: { uz: "Serverdan kelgan ro'yxatni ekranga nima chiqaradi?", ru: 'Что выводит пришедший с сервера список на экран?' }, back: "setGames(data)", note: { uz: "fetch olib keladi, chizmaydi", ru: 'fetch приносит, но не рисует' } },
  { front: { uz: "So'rov qachon ketishini nima hal qiladi?", ru: 'Что решает, когда уйдёт запрос?' }, back: "useEffect(…, [])", note: { uz: "sahifa ochilganda bir marta", ru: 'один раз при открытии страницы' } },
  { front: { uz: "Javob kutilayotganini ekranda nima ko'rsatadi?", ru: 'Что показывает на экране, что ответ ещё в пути?' }, back: { uz: "Skeleton", ru: 'Скелетон' }, note: { uz: "kartochkaning kulrang sharpasi", ru: 'серый призрак карточки' } },
  { front: { uz: "200 OK javobi nimani bildiradi?", ru: 'Что означает ответ 200 OK?' }, back: { uz: "Hammasi joyida", ru: 'Всё в порядке' }, note: { uz: "to'g'ri eshik — javob keldi", ru: 'дверь верная — ответ пришёл' } },
  { front: { uz: "Konsolda 404 chiqsa, birinchi nimani tekshirasiz?", ru: 'Если в консоли 404, что проверите первым делом?' }, back: { uz: "Manzilni", ru: 'Адрес' }, note: { uz: "/gmaes emas, /games — bitta harf ham muhim", ru: 'не /gmaes, а /games — важна каждая буква' } },
  { front: { uz: "Ro'yxatni ekranga chiqaradigan to'liq yo'l qanday?", ru: 'Каков полный путь списка на экран?' }, back: "useEffect → fetch → .json() → setGames", note: { uz: "so'rov → tarjima → xotira → ekran", ru: 'запрос → перевод → память → экран' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tushunchalarni <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Быстро повторим</span> понятия.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Darsni yakunlashdan oldin bugun o'rgangan tushunchalarni takrorlaymiz. Har kartada bir savol — <b style={{ color: T.ink }}>javobini</b> o'ylang, keyin kartani bosib tekshiring. <b style={{ color: T.ink }}>Bildim</b> yoki <b style={{ color: T.ink }}>Takrorlash</b> bilan baholang.</>, ru: <>Перед завершением урока повторим сегодняшние понятия. На каждой карточке — вопрос: подумайте, <b style={{ color: T.ink }}>каким будет ответ</b>, затем нажмите на карту и проверьте. Оцените кнопками <b style={{ color: T.ink }}>Знаю</b> или <b style={{ color: T.ink }}>Повторить</b>.</> })}</Mentor>
        <div className="fc-center"><Flashcards cards={REACT_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — dars davomidagi REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  firstFetch: { icon: '🛎️', name: 'First Fetch!',  desc: { uz: "Birinchi fetch so'rovini yubordingiz", ru: 'Вы отправили первый fetch-запрос' } },
  served:     { icon: '🍽️', name: 'Order Served!', desc: { uz: "Ma'lumotni setGames bilan ekranga chiqardingiz", ru: 'Вы вывели данные на экран через setGames' } },
  detective:  { icon: '🔎', name: '404 Detective!',  desc: { uz: "Xato manzilni topib tuzatdingiz", ru: 'Вы нашли и исправили неверный адрес' } },
  headWaiter: { icon: '🏆', name: 'Head Waiter!',   desc: { uz: "So'rov kodini o'zingiz yozdingiz", ru: 'Вы сами написали код запроса' } },
};
// Ekran id → nishon (recordAnswer'da, faqat REAL solve bilan: SCORED test / praktika)
const ACH_TRIGGERS = { s4: 'firstFetch', s9: 'served', s12: 'detective', s15: 'headWaiter' };
// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI
function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr({ uz: 'Yangi nishon', ru: 'Новый значок' })}: ${ach.name}`}>
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
const Q_LABELS = { 4: "1 — fetch", 6: "2 — .json()", 10: "3 — setGames", 13: "4 — 404" };
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si (fetch / .json() / useEffect / 404)
const QZ_BG_SHAPES = [
  { ch: 'fetch',     l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: '.json()',   l: 84, t: 7,  s: 30, d: 23, dl: 1.5 },
  { ch: 'useEffect', l: 8,  t: 72, s: 30, d: 27, dl: 0.8 },
  { ch: 'loading',   l: 78, t: 68, s: 30, d: 21, dl: 2.2 },
  { ch: '200 OK',    l: 44, t: 86, s: 28, d: 25, dl: 1.1 },
  { ch: '404',       l: 66, t: 26, s: 30, d: 17, dl: 0.4 },
  { ch: '/games',    l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: 'GET',       l: 55, t: 5,  s: 28, d: 22, dl: 0.6 },
  { ch: 'skeleton',  l: 91, t: 42, s: 24, d: 24, dl: 1.3 },
  { ch: '🛎️', l: 2, t: 45, s: 30, d: 26, dl: 2.6 },
];
// ⚔️ Mustahkamlash-jang savollari — fetch/server/GET/JSON/.json()/useEffect/loading/setGames/endpoint/404/200 OK.
// To'g'ri javoblar 4 pozitsiyaga TENG taqsimlangan (12 savol: 3/3/3/3).
const QUIZ_BANK = [
  { q: { uz: "`fetch` nima qiladi?", ru: 'Что делает `fetch`?' }, opts: [{ uz: "Manzilga borib ma'lumot olib keladi", ru: 'Идёт по адресу и приносит данные' }, { uz: "Saytni to'liq qayta yuklaydi", ru: 'Полностью перезагружает сайт' }, { uz: "Faylni kompyuterga yuklab saqlaydi", ru: 'Скачивает файл на компьютер' }, { uz: "Yangi bo'sh oyna ochadi", ru: 'Открывает новое пустое окно' }], correct: 0 },
  { q: { uz: "Server nima?", ru: 'Что такое сервер?' }, opts: [{ uz: "Ma'lumot saqlanadigan markaz", ru: 'Центр, где хранятся данные' }, { uz: "Telefonning ichki xotirasi", ru: 'Внутренняя память телефона' }, { uz: "Kompyuterdagi rasm papkasi", ru: 'Папка с картинками на компьютере' }, { uz: "Brauzer xotirasidagi nusxa", ru: 'Копия в памяти браузера' }], correct: 0 },
  { q: { uz: "`GET` so'rovi serverda nimani o'zgartiradi?", ru: 'Что меняет `GET`-запрос на сервере?' }, opts: [{ uz: "Hech narsani o'zgartirmaydi", ru: 'Ничего не меняет' }, { uz: "Ma'lumotni butunlay o'chiradi", ru: 'Полностью удаляет данные' }, { uz: "Yangi ma'lumot yaratadi", ru: 'Создаёт новые данные' }, { uz: "Serverni o'chirib qo'yadi", ru: 'Выключает сервер' }], correct: 0 },
  { q: { uz: "Server javobi dastlab qanday keladi?", ru: 'В каком виде сначала приходит ответ сервера?' }, opts: [{ uz: "Tayyor massiv", ru: 'Готовый массив' }, { uz: "Matn (string)", ru: 'Текст (string)' }, { uz: "Rasm", ru: 'Картинка' }, { uz: "HTML sahifa", ru: 'HTML-страница' }], correct: 1 },
  { q: { uz: "`.json()` nima qiladi?", ru: 'Что делает `.json()`?' }, opts: [{ uz: "Qaytadan so'rov yuboradi", ru: 'Отправляет запрос заново' }, { uz: "Matnni massivga aylantiradi", ru: 'Превращает текст в массив' }, { uz: "Javobni faylga saqlaydi", ru: 'Сохраняет ответ в файл' }, { uz: "Sahifani qayta yangilaydi", ru: 'Обновляет страницу' }], correct: 1 },
  { q: { uz: "`useEffect(…, [])` nega bo'sh massiv bilan yoziladi?", ru: 'Зачем в `useEffect(…, [])` пустой массив?' }, opts: [{ uz: "Har soniyada qayta-qayta ishlashi uchun", ru: 'Чтобы срабатывал каждую секунду' }, { uz: "Ochilganda bir marta ishlashi uchun", ru: 'Чтобы сработал один раз при открытии' }, { uz: "Tugma har bosilganda ishlashi uchun", ru: 'Чтобы срабатывал при каждом нажатии кнопки' }, { uz: "Umuman hech qachon ishlamasligi uchun", ru: 'Чтобы вообще никогда не срабатывал' }], correct: 1 },
  { q: { uz: "Javob kelguncha ekranda nima ko'rsatiladi?", ru: 'Что показывают на экране, пока идёт ответ?' }, opts: [{ uz: "Xatolik oynasi chiqadi", ru: 'Появляется окно ошибки' }, { uz: "Bo'sh oq ekran turadi", ru: 'Стоит пустой белый экран' }, { uz: "Skeleton — kulrang sharpa", ru: 'Скелетон — серый призрак' }, { uz: "Reklama ko'rsatiladi", ru: 'Показывается реклама' }], correct: 2 },
  { q: { uz: "Serverdan kelgan ro'yxat ekranga qanday chiqadi?", ru: 'Как список с сервера попадает на экран?' }, opts: [{ uz: "`fetch` o'zi chizadi", ru: '`fetch` сам рисует' }, { uz: "`useEffect` o'zi chizadi", ru: '`useEffect` сам рисует' }, { uz: "`setGames` → state → React chizadi", ru: '`setGames` → state → React рисует' }, { uz: "Qo'lda yoziladi", ru: 'Пишется вручную' }], correct: 2 },
  { q: { uz: "Endpoint nimani bildiradi?", ru: 'Что означает эндпоинт?' }, opts: [{ uz: "Manzilning boshlanishini", ru: 'Начало адреса' }, { uz: "Faylning to'liq ismini", ru: 'Полное имя файла' }, { uz: "Serverning qaysi bo'limini", ru: 'Какой раздел сервера нужен' }, { uz: "Internet ulanish tezligini", ru: 'Скорость интернет-соединения' }], correct: 2 },
  { q: { uz: "Konsolda `404` ko'rsangiz birinchi nima qilasiz?", ru: 'Увидели `404` в консоли — что сделаете первым?' }, opts: [{ uz: "Kompyuterni o'chirib yoqasiz", ru: 'Перезагрузите компьютер' }, { uz: "React'ni qayta o'rnatasiz", ru: 'Переустановите React' }, { uz: "Biroz kutasiz", ru: 'Немного подождёте' }, { uz: "Manzilni tekshirasiz", ru: 'Проверите адрес' }], correct: 3 },
  { q: { uz: "`200 OK` nimani bildiradi?", ru: 'Что означает `200 OK`?' }, opts: [{ uz: "Server o'chib qoldi", ru: 'Сервер отключился' }, { uz: "So'ralgan manzil topilmadi", ru: 'Запрошенный адрес не найден' }, { uz: "Internet ulanishi yo'q", ru: 'Нет интернет-соединения' }, { uz: "Muvaffaqiyat — javob keldi", ru: 'Успех — ответ пришёл' }], correct: 3 },
  { q: { uz: "`fetch → .json() → setGames` tartibi nega muhim?", ru: 'Почему важен порядок `fetch → .json() → setGames`?' }, opts: [{ uz: "Aslida bu tartib umuman muhim emas", ru: 'На самом деле порядок вообще не важен' }, { uz: "Faqat kod chiroyli ko'rinishi uchun", ru: 'Только чтобы код красиво выглядел' }, { uz: "Tartib butunlay tasodifiy tanlangan", ru: 'Порядок выбран совершенно случайно' }, { uz: "Har qadam oldingi qadamga tayanadi", ru: 'Каждый шаг опирается на предыдущий' }], correct: 3 },
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
          <span className="cs-hud-i">🏆 PODIUM</span>
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
    const TOK = ['fetch', '.json()', 'useEffect', 'loading', '200 OK', '404', '/games', 'GET', 'skeleton', '🛎️'];
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
      if (typeof window !== 'undefined' && !window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nВсё равно закрыть?' }))) return;
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
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме практики' })}</button>
        </div>
      )}

      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают 🔥 бонус!' })}</p>
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
                : <span className="qz-res-t">{my ? tr({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: 'Мимо — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Побыстрее! ⏱' })}</span>}
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

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'лучший стрик' })} 🔥x${soloScore.maxStreak}` : ''}</p>
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
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: 'Siz', ru: 'Вы' })} — <b>{myRank + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</b> · {board[myRank].pts} {tr({ uz: 'ball', ru: 'баллов' })}</p>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест заново — практика (в таблицу не идёт)' })}</button>}
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
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не присоединился.' })}</p></div>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: 'Siz', ru: 'Вы' })} — <b>{myIdx + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</b> ({board[myIdx].okCount}/{totalQ} {tr({ uz: "to'g'ri", ru: 'верно' })})</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: "🏆 To'liq reyting", ru: '🏆 Полный рейтинг' })}</div>
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
    tr({ uz: "Ma'lumot serverda yashaydi — manzili bor: robo-api.uz/games", ru: 'Данные живут на сервере — у них есть адрес: robo-api.uz/games' }),
    tr({ uz: "fetch — so'rov: shu manzilga borib, olib kel (GET)", ru: 'fetch — запрос: сходи по адресу и принеси (GET)' }),
    tr({ uz: "Javob JSON matn — .json() uni massivga aylantiradi", ru: 'Ответ — JSON-текст, .json() превращает его в массив' }),
    tr({ uz: "Kutish payti — skeleton: \"ma'lumot yo'lda\" signali", ru: 'Во время ожидания — скелетон: сигнал «данные в пути»' }),
    tr({ uz: "To'liq usul: useEffect + fetch + .json() + setGames", ru: 'Полный приём: useEffect + fetch + .json() + setGames' })
  ];
  const HOMEWORK = [
    { b: tr({ uz: 'Jonli katalog', ru: 'Живой каталог' }), t: tr({ uz: "— robo-games loyihangizga agent bilan haqiqiy API ulang: \"o'yinlar ro'yxatini serverdan fetch bilan yukla\" deb buyuring", ru: '— подключите к своему robo-games настоящий API с агентом: скомандуйте «загрузи список игр с сервера через fetch»' }) },
    { b: tr({ uz: 'Skeleton', ru: 'Скелетон' }), t: tr({ uz: "— yuklanish paytida skeleton kartochkalar chiqaring", ru: '— выводите скелетон-карточки во время загрузки' }) },
    { b: tr({ uz: '404 detektivi', ru: 'Детектив 404' }), t: tr({ uz: "— manzilni ataylab xato yozib, konsoldagi 404 ni toping va tuzating", ru: '— нарочно напишите адрес с ошибкой, найдите 404 в консоли и исправьте' }) }
  ];
  const GLOSSARY = [
    { b: tr({ uz: 'Server', ru: 'Сервер' }), t: tr({ uz: "— ma'lumot markazi: bitta joy, hamma qurilma uchun", ru: '— центр данных: одно место для всех устройств' }) },
    { b: 'fetch', t: tr({ uz: "— so'rov buyrug'i: borib olib kel", ru: '— команда запроса: сходи и принеси' }) },
    { b: 'GET', t: tr({ uz: "— so'rov turi: faqat olish", ru: '— тип запроса: только получение' }) },
    { b: tr({ uz: 'Endpoint', ru: 'Эндпоинт' }), t: tr({ uz: "— server eshigi: /games, /top, /new", ru: '— дверь сервера: /games, /top, /new' }) },
    { b: 'JSON', t: tr({ uz: "— kompyuterlarning umumiy ma'lumot tili", ru: '— общий язык данных для компьютеров' }) },
    { b: '.json()', t: tr({ uz: "— javobni haqiqiy massivga aylantirish", ru: '— превращение ответа в настоящий массив' }) },
    { b: tr({ uz: 'Skeleton', ru: 'Скелетон' }), t: tr({ uz: "— yuklanayotgan kartochkaning kulrang sharpasi", ru: '— серый призрак загружающейся карточки' }) },
    { b: '404', t: tr({ uz: "— server javobi: bunday manzil topilmadi", ru: '— ответ сервера: такой адрес не найден' }) }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const [open, setOpen] = useState(false);
  const glossRef = useRef(null);
  const isNarrow = useIsMobile(768);
  const toggleGloss = () => setOpen(o => {
    const nv = !o;
    if (nv && isNarrow) setTimeout(() => { if (glossRef.current) glossRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 80);
    return nv;
  });
  const audio = useAudio([{ id: 's16', text: `Tabriklaymiz — katalogingiz endi jonli! Esda saqlang: ma'lumot serverda yashaydi, uning manzili bor. fetch o'sha manzilga borib olib keladi, .json() javobni massivga aylantiradi, setGames esa ekranga chizadi. Kutish payti skeleton ko'rsatiladi. Keyingi darsda serverga faqat olish emas — YUBORISH ham o'rganamiz.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Katalogingiz endi <span className="italic" style={{ color: T.accent }}>jonli</span>.</>, ru: <>Ваш каталог теперь <span className="italic" style={{ color: T.accent }}>живой</span>.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: "Tabriklaymiz! Saytingiz endi serverdan ma'lumot oladi — xuddi haqiqiy Roblox kabi. Siz frontend bilan serverni bog'ladingiz.", ru: 'Поздравляем! Ваш сайт теперь получает данные с сервера — как настоящий Roblox. Вы соединили фронтенд с сервером.' }) : tr({ uz: "Yaxshi harakat! fetch usulini mustahkamlash uchun bir-ikki ekranni qayta ko'ring.", ru: 'Хорошая попытка! Чтобы закрепить приём fetch, пересмотрите пару экранов.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Antigravity bilan o'z loyihangizda sinang:", ru: 'Попробуйте в своём проекте с Antigravity:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>))}</ul><p className="hw-note">{tr({ uz: "Keyingi darsda kuch yana oshadi: serverdan faqat olish emas — unga YUBORISH ham o'rganamiz. O'z o'yiningizni katalogga qo'shasiz! 🚀", ru: 'На следующем уроке сила вырастет: научимся не только получать с сервера, но и ОТПРАВЛЯТЬ на него. Добавите в каталог свою игру! 🚀' })}</p></div>
        </div>
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '🏅 Nishonlaringiz', ru: '🏅 Ваши значки' })} — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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
        <div ref={glossRef} className="gloss fade-up d4" style={{ scrollMarginBottom: 16 }}><div className="gloss-head" onClick={toggleGloss}><span className="lbl">{tr({ uz: "💡 Kalit so'zlar (takrorlash)", ru: '💡 Ключевые слова (повторение)' })}</span><span className="gloss-toggle">{open ? '−' : '+'}</span></div>{open && (<div className="gloss-body">{GLOSSARY.map((g, i) => (<span key={i}><b>{g.b}</b> {g.t}{i < GLOSSARY.length - 1 ? ' \xb7 ' : ''}</span>))}</div>)}</div>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function ReactApiGetLesson({ lang: langProp, onFinished }) {
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
  // ETALON — 1920px (InternetLesson): keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, window.innerWidth / 1920)); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // Javob kaliti: inline testlar + jang savollari (QUIZ_BANK'dan) — mentor ochganda set_quiz_keys bilan serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  // 🃏 Flashcard ekrani jonli darsda (mentor boshqaruvida) o'quvchida ko'rsatilmaydi
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, ScreenApiPractice, ScreenPodium, ScreenFlashcards, Screen16];
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
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
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
        .screen { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
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
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

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
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.12); overflow: hidden; }
        .gloss-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 17px; cursor: pointer; } .gloss-head .lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; } .gloss-toggle { font-size: 18px; color: ${T.ink2}; }
        .gloss-body { padding: 0 17px 15px; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; line-height: 1.7; animation: fade-step 0.3s; } .gloss-body b { color: ${T.ink}; }

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

        /* Matn ichidagi real kodcha */
        .codechip { font-family: 'JetBrains Mono', monospace; font-size: 0.84em; font-weight: 600; background: ${CODE.bg}; color: ${CODE.str}; padding: 1.5px 6px; border-radius: 5px; white-space: nowrap; }

        /* Server'ga ko'chish (Screen2) */
        .migrate { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .mig-box { flex: 1 1 240px; min-width: 0; display: flex; flex-direction: column; gap: 7px; }
        .mig-arrow { flex: 0 0 86px; position: relative; display: flex; flex-direction: column; align-items: center; gap: 7px; }
        .mig-line { width: 100%; height: 2px; background: repeating-linear-gradient(90deg, ${T.ink3} 0 5px, transparent 5px 10px); }
        .mig-cap { font-family: 'Manrope'; font-weight: 700; font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; }
        .mig-packet { position: absolute; top: -6px; left: 0; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 10px; color: #fff; background: ${T.accent}; padding: 4px 8px; border-radius: 99px; white-space: nowrap; box-shadow: 0 5px 12px -3px rgba(255,79,40,0.55); animation: mig-fly 1s ease-in-out forwards; z-index: 3; }
        @keyframes mig-fly { 0% { left: -8%; opacity: 0; } 18% { opacity: 1; } 82% { opacity: 1; } 100% { left: 90%; opacity: 0; } }
        @keyframes mig-leave { 0% { opacity: 1; transform: none; } 100% { opacity: 0.35; transform: scale(0.92) translateX(10px); } }
        .mig-leaving { animation: mig-leave 1s ease-in forwards; }
        @media (max-width: 620px) { .mig-arrow { flex-basis: 100%; flex-direction: row; height: 36px; justify-content: center; } .mig-arrow .mig-line { width: 55%; } .mig-packet { top: 50%; transform: translateY(-50%); } }

        /* JSON tarjima quvuri (Screen5) */
        .json-stage { min-height: 118px; }
        .json-empty { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 26px 14px; text-align: center; font-family: 'Georgia', serif; font-style: italic; color: ${T.ink3}; font-size: 13px; }
        .json-card { border-radius: 12px; padding: 12px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.18); }
        .json-card.txt { background: #20283A; animation: fade-step 0.35s ease-out; }
        .json-card.arr { background: ${CODE.bg}; box-shadow: 0 0 0 2px ${T.success}, 0 8px 20px -6px rgba(31,122,77,0.3); animation: json-flip 0.55s cubic-bezier(.34,1.3,.5,1); transform-origin: top center; }
        @keyframes json-flip { 0% { transform: perspective(500px) rotateX(-78deg); opacity: 0; } 100% { transform: perspective(500px) rotateX(0); opacity: 1; } }
        .json-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 9px; }
        .json-tag { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; padding: 3px 9px; border-radius: 99px; letter-spacing: 0.03em; }
        .json-tag.bad { background: rgba(255,255,255,0.13); color: #C9B89A; }
        .json-tag.good { background: rgba(31,122,77,0.35); color: #8FE3B5; }
        .json-note { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; }
        .json-note.bad { color: ${T.accent}; }
        .json-note.good { color: #8FE3B5; }
        .json-body { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${CODE.text}; margin: 0; white-space: pre-wrap; word-break: break-word; line-height: 1.55; }
        .json-card.txt .json-body { color: #8A93A6; }

        /* fetch qismlari — bosishga chorlovchi (Screen3) */
        .fa-tok { cursor: pointer; border-radius: 6px; padding: 3px 5px; transition: all 0.18s; }
        .fa-tok:not(.seen):not(.on) { animation: fa-invite 2.2s ease-in-out infinite; }
        @keyframes fa-invite { 0%,100% { box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.2); background: rgba(255,255,255,0.05); } 50% { box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.5); background: rgba(255,79,40,0.08); } }
        .fa-tok.on { background: rgba(255,79,40,0.22); box-shadow: inset 0 0 0 1px ${T.accent}; }
        .fa-tok.seen:not(.on) { background: rgba(31,122,77,0.14); }

        /* Tinch variant — «Ofitsiant safari» harakatlari (skeleton lipillashi, tap-hint, tomchi, qopqoq-flip, posilka) */
        @media (prefers-reduced-motion: reduce) {
          .skel { animation: none !important; background: #ECE9E2 !important; }
          .flow-dot { animation: none !important; opacity: 0.5; }
          .fa-tok:not(.seen):not(.on) { animation: none !important; box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.4); }
          .json-card.arr { animation: fade-step 0.3s ease-out !important; }
          .parcel, .fly-in, .mig-packet { animation-duration: 0.01s !important; }
          .shake, .dd-shake, .hpop { animation: none !important; }
        }

        /* Hook broadcast (Screen0) */
        .broadcast-cue { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; margin: 0; }
        .push-in { position: relative; border-radius: 12px; animation: el-pop 0.3s ease-out, push-ring 0.95s ease-out; }
        @keyframes push-ring { 0% { box-shadow: 0 0 0 0 rgba(31,122,77,0.5); } 100% { box-shadow: 0 0 0 9px rgba(31,122,77,0); } }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }
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

        /* === 🐞 DEBUG CHALLENGE (reusable) === */
        .dbg { display: flex; flex-direction: column; gap: 10px; }
        .dbg-code { background: ${CODE.bg}; border-radius: 14px; padding: 10px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 10px 26px -14px rgba(${T.shadowBase},0.4); overflow-x: auto; }
        .dbg-line { display: flex; align-items: center; gap: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px,1.8vw,15px); color: ${CODE.text}; padding: 8px 12px; border-radius: 9px; cursor: pointer; border: 1.5px solid transparent; transition: background .15s, border-color .15s; white-space: nowrap; }
        .dbg-line:hover { background: rgba(255,255,255,0.06); }
        .dbg-line.wrong { border-color: #E24848; background: rgba(226,72,72,0.16); animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .dbg-line.fixed { border-color: ${T.success}; background: rgba(18,169,104,0.16); cursor: default; }
        .dbg-ln { color: ${CODE.comment}; font-size: 12px; min-width: 16px; text-align: right; flex-shrink: 0; }
        .dbg-txt { flex: 1; }
        .dbg-badge { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.success}; background: rgba(18,169,104,0.2); border-radius: 99px; padding: 3px 9px; flex-shrink: 0; }
        .dbg-hint { margin: 0; font-size: 13px; color: ${T.ink3}; font-style: italic; }
        .dbg-ok { font-weight: 700; color: ${T.success}; font-size: 14px; background: ${T.successSoft}; border-radius: 12px; padding: 10px 14px; }

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

        /* === 🎮 LIKE MASHINASI (S5 maqsad-o'yin) — HARAKAT sifati ✨ Animatsiya roli === */
        .lm-flow { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .lm-mem { width: 100%; max-width: 240px; border-radius: 12px; padding: 10px 14px; background: ${T.accentSoft}; display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .lm-channel { position: relative; width: 10px; height: 44px; border-radius: 6px; background: repeating-linear-gradient(180deg, rgba(0,0,0,0.12) 0 5px, transparent 5px 10px), #d8d4cc; overflow: hidden; display: flex; align-items: flex-end; justify-content: center; transition: box-shadow 0.3s, background 0.3s; }
        .lm-channel.lit { background: linear-gradient(180deg, ${T.success}, #35c07d); box-shadow: 0 0 14px 2px rgba(31,122,77,0.55); }
        .lm-channel-lbl { position: absolute; left: 16px; bottom: 12px; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; color: ${T.ink3}; white-space: nowrap; }
        .lm-impulse { position: absolute; top: -20px; left: 0; right: 0; height: 20px; background: linear-gradient(180deg, transparent, rgba(255,255,255,0.9)); animation: lm-drop 0.6s cubic-bezier(.4,0,.3,1) both; }
        @keyframes lm-drop { 0% { transform: translateY(-4px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(64px); opacity: 0.2; } }
        .lm-screen.lm-frozen { animation: lm-shake 0.4s ease; }
        @keyframes lm-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .lm-gap { display: flex; align-items: center; justify-content: center; gap: 12px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${T.ink2}; }
        .lm-gap-i b { color: ${T.ink}; font-size: 15px; }
        .lm-gap-vs { font-family: 'Fraunces', serif; font-size: 18px; color: ${T.ink3}; font-weight: 700; }
        .lm-goal { position: relative; width: 100%; height: 26px; border-radius: 99px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px rgba(0,0,0,0.07); overflow: hidden; }
        .lm-goal-fill { position: absolute; inset: 0 auto 0 0; background: linear-gradient(90deg, ${T.success}, #35c07d); border-radius: 99px; transition: width 0.5s cubic-bezier(.34,1.2,.5,1); }
        .lm-goal-txt { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12.5px; color: ${T.ink}; }
        .lm-levers { display: flex; flex-direction: column; gap: 10px; }
        .lm-lever { display: flex; flex-direction: column; gap: 2px; align-items: flex-start; text-align: left; border: none; border-radius: 12px; padding: 12px 16px; cursor: pointer; transition: transform 0.15s, box-shadow 0.2s; }
        .lm-lever:disabled { opacity: 0.5; cursor: default; }
        .lm-lever:not(:disabled):hover { transform: translateY(-2px); }
        .lm-lever.dead { background: linear-gradient(135deg, ${T.bg}, ${T.accentSoft}); border: 1.5px dashed rgba(255,79,40,0.42); box-shadow: none; }
        .lm-lever.live { background: linear-gradient(135deg, ${T.success}, #35c07d); box-shadow: 0 8px 22px -6px rgba(31,122,77,0.5); }
        .lm-lever-code { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(13px,1.7vw,15px); }
        .lm-lever.dead .lm-lever-code { color: ${T.ink2}; } .lm-lever.dead .lm-lever-sub { color: ${T.ink3}; }
        .lm-lever.live .lm-lever-code { color: #fff; } .lm-lever.live .lm-lever-sub { color: rgba(255,255,255,0.85); }
        .lm-lever-sub { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 11px; }
        .lm-toast { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 10px 13px; border-left: 3px solid ${T.accent}; }
        /* behuda-sanagich — har soxta-bosishda qizil pulsatsiya (key strategiya retrigger) */
        .lm-wasted { animation: lm-wasted-pulse 0.46s cubic-bezier(.34,1.4,.5,1); }
        .lm-wasted b { display: inline-block; animation: lm-wasted-glow 0.46s ease; }
        @keyframes lm-wasted-pulse { 0%,100% { transform: scale(1); } 26% { transform: scale(1.07); } }
        @keyframes lm-wasted-glow { 0% { transform: scale(1); text-shadow: 0 0 0 rgba(255,79,40,0); } 32% { transform: scale(1.3); text-shadow: 0 0 12px rgba(255,79,40,0.65); } 100% { transform: scale(1); text-shadow: 0 0 0 rgba(255,79,40,0); } }
        @media (prefers-reduced-motion: reduce) { .lm-impulse, .lm-screen.lm-frozen, .lm-wasted, .lm-wasted b, .lm-goal-fill { animation: none !important; transition: none !important; } .lm-impulse { display: none; } }

        /* ===== ⚡ JONLI QATLAM CSS (Kahoot-kutish · MentorTestStats · CodeStrike arena · qcode-chip) — L1 etalondan ===== */
        /* --- Kahoot-kutish holatlari (jonli test) --- */
        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
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
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr({ uz: 'API bilan ishlash darsi', ru: 'Урок работы с API' })} />
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
