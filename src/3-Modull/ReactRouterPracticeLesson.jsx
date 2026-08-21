import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// FRONTEND REACT MODULI · PRAKTIKA 2 — REACT ROUTER: KO'P SAHIFALI ILOVA — PLATFORM STANDARD v18 (AUDIOSIZ)
// O'RNI: "API — POST/PUT/DELETE" darsidan KEYIN. O'quvchi allaqachon biladi:
//        komponent, props, state, map, fetch (GET), CRUD (POST/PUT/DELETE).
// Mavzu: bir sahifali vs ko'p sahifali ilova; route = manzil → komponent; <Routes>/<Route>;
//        <Link> vs <a> (Link sahifani QAYTA YUKLAMAydi — SPA navigatsiya); URL parametr /game/:id;
//        useNavigate (kod orqali sahifa almashtirish — POST'dan keyin Bosh'ga qaytish).
// PEDAGOGIKA (praktika): ME'MOR (route xaritasini qo'lda chizish) → REJISSYOR (AI'ga buyruq) →
//        NAZORATCHI (kodni tekshirish + debugging). Router vibecoding ichida "yetarlicha" beriladi.
// Misol ilova: robo-games (davom) — ko'p sahifali: Bosh (/) · O'yin (/game/:id) · Qo'shish (/add).
// MUHIM: kelgusi darslar ro'yxati AYTILMAYDI — faqat yakunda teaser. AUDIOSIZ: ovoz yo'q.
// Yakuniy ekran (s14): VS Code — <Route path="/add" element={<AddPage />} /> ni qo'lda yozish.
// Toza dizayn — ortiqcha emoji yo'q. "sehr"/"g'isht" ishlatilmaydi.
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
    } catch { setJoinError(tr({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: 'Код ментора неверный или ошибка подключения.' })); }
    finally { setBusy(false); }
  }, [lessonId]);

  const joinStudent = useCallback(async (raw, rawNick) => {
    const p = (raw || '').replace(/\D/g, '');
    const nick = (rawNick || '').trim();
    if (p.length < 4) { setJoinError(tr({ uz: "Kodni to'liq kiriting.", ru: 'Введите код полностью.' })); return; }
    if (nick.length < 2) { setJoinError(tr({ uz: 'Ismingizni kiriting (kamida 2 harf).', ru: 'Введите своё имя (минимум 2 буквы).' })); return; }
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

// Matn ichidagi `kod` bo'laklarini chip qilib ko'rsatadi (qcode)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

// AUDIOSIZ dars — useAudio/getAudioEngine zaglushkasi (imzo saqlanadi, TTS yo'q)
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

const LESSON_META = { lessonId: 'react-router-practice-p2-v18', lessonTitle: { uz: "Praktika: React Router — ko'p sahifali ilova", ru: 'Практика: React Router — многостраничное приложение' } };
const HW_TOKENS = [
  { t: { uz: 'amaliyot', ru: 'практика' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'loyiha', ru: 'проект' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'mashq', ru: 'упражнение' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'natija', ru: 'результат' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
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
  { id: 'sp1', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 'sp2', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's13', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'sp3', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's15b',type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768); // mobil: Mentor yig'ilish rejimi
  const collapseOn = isNarrow && !mentorStatic;
  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px + 60px
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); }, [screen]);
  // MOBIL AVTOSCROLL: natija paydo bo'lganda (scrollSignal o'zgarsa) kontentni pastga suramiz — uzun sahifalarda natija ko'rinib qoladi
  useEffect(() => {
    if (!scrollSignal || !isNarrow) return;
    const el = contentRef.current;
    if (!el) return;
    const t = setTimeout(() => { if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }, 240);
    return () => clearTimeout(t);
  }, [scrollSignal, isNarrow]);
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
const NavNext = ({ disabled, label, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  const lbl = label ?? tr({ uz: 'Davom etish', ru: 'Продолжить' });
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

const RECAP_NEED_PCT = 60, RECAP_GOOD_PCT = 75, RECAP_MIN_ANSWERS = 3;
// Recap qatlami: xato javob bergan o'quvchi + mentor «Qayta tushuntirish» — RecapOverlay bilan mavzuni qisqa kartalarda qayta ko'radi.
const RECAPS = {
  4: {
    title: { uz: "Route — manzilni sahifaga bog'laydi", ru: 'Route — связывает адрес со страницей' },
    cards: [
      { ic: "🗺️", h: { uz: "Route — xaritaning bitta qatori", ru: 'Route — одна строка карты' }, body: { uz: <>Route — manzillar ro'yxatining <b>bitta qatori</b>. Ikki bo'lagi bor: <span className="mono">path</span> (qaysi manzil) va <span className="mono">element</span> (qaysi sahifa). <span className="mono">/add</span> ochilganda Router shu qatorni topadi va <span className="mono">AddPage</span> sahifasini ko'rsatadi.</>, ru: <>Route — <b>одна строка</b> в списке адресов. У неё две части: <span className="mono">path</span> (какой адрес) и <span className="mono">element</span> (какая страница). Когда открывается <span className="mono">/add</span>, Router находит эту строку и показывает страницу <span className="mono">AddPage</span>.</> } },
      { ic: "🔗", h: { uz: "path + element — bir juftlik", ru: 'path + element — одна пара' }, body: { uz: <><span className="mono">path</span> — manzil (masalan <span className="mono">/add</span>), <span className="mono">element</span> — o'sha manzilda ko'rsatiladigan sahifa (masalan <span className="mono">{'<AddPage />'}</span>). Ular birga bir qatorni tashkil qiladi: <b>manzil → sahifa</b>.</>, ru: <><span className="mono">path</span> — адрес (например <span className="mono">/add</span>), <span className="mono">element</span> — страница, которая показывается по этому адресу (например <span className="mono">{'<AddPage />'}</span>). Вместе они образуют одну строку: <b>адрес → страница</b>.</> } },
      { ic: "📋", h: { uz: "Har sahifa — bitta Route", ru: 'Каждая страница — один Route' }, body: { uz: <>Ilovada nechta sahifa bo'lsa, shuncha <span className="mono">{'<Route>'}</span> qatori bo'ladi. Bosh, O'yin, Qo'shish — har biri o'z <span className="mono">path</span> va <span className="mono">element</span>i bilan.</>, ru: <>Сколько страниц в приложении — столько строк <span className="mono">{'<Route>'}</span>. Главная, Игра, Добавить — у каждой свой <span className="mono">path</span> и свой <span className="mono">element</span>.</> }, ask: { uz: "Yangi «Sevimlilar» sahifasi qo'shsak, uning Route qatorida path va element nima bo'ladi?", ru: 'Если добавим новую страницу «Избранное», что будет в её строке Route — какой path и какой element?' } },
    ]
  },
  6: {
    title: { uz: "Link vs a — warp-portal va chiqish eshigi", ru: 'Link vs a — warp-портал и дверь выхода' },
    cards: [
      { ic: "⚡", h: { uz: "Warp-portal — bu <Link>", ru: 'Warp-портал — это <Link>' }, body: { uz: <>ROBO-WORLD'da warp-portalga kirsangiz, robot chaqmoq bilan ko'chadi — HUD-ramka (koordinata-panel = URL) <b>joyida qoladi</b>, faqat markaz almashadi. Bu <span className="mono">{'<Link>'}</span>: sahifani qayta yuklamaydi, tez va silliq.</>, ru: <>Когда в ROBO-WORLD вы входите в warp-портал, робот телепортируется молнией — HUD-рамка (панель координат = URL) <b>остаётся на месте</b>, меняется только центр. Это <span className="mono">{'<Link>'}</span>: страница не перезагружается — быстро и плавно.</> } },
      { ic: "🚪", h: { uz: "Chiqish eshigi — bu <a href>", ru: 'Дверь выхода — это <a href>' }, body: { uz: <>Chiqish eshigidan chiqsangiz, <b>butun olam qorayadi</b> va qaytadan yig'iladi — sekin. Bu oddiy <span className="mono">{'<a href>'}</span>: brauzer butun sahifani qayta yuklaydi. Shuning uchun React'da doim <span className="mono">{'<Link>'}</span> ishlatiladi.</>, ru: <>Если выйти через дверь выхода, <b>весь мир гаснет</b> и собирается заново — медленно. Это обычный <span className="mono">{'<a href>'}</span>: браузер перезагружает всю страницу. Поэтому в React всегда используют <span className="mono">{'<Link>'}</span>.</> } },
      { ic: "🔀", h: { uz: "Ikkalasi ham havola — farqi tezlikda", ru: 'Обе — ссылки, разница в скорости' }, body: { uz: <><span className="mono">{'<Link>'}</span> ham, <span className="mono">{'<a>'}</span> ham bir sahifadan boshqasiga o'tkazadi. Farqi: <span className="mono">{'<Link>'}</span> faqat kerakli qismni almashtiradi, <span className="mono">{'<a>'}</span> esa butun sahifani qaytadan yuklaydi.</>, ru: <>И <span className="mono">{'<Link>'}</span>, и <span className="mono">{'<a>'}</span> переводят с одной страницы на другую. Разница: <span className="mono">{'<Link>'}</span> меняет только нужную часть, а <span className="mono">{'<a>'}</span> перезагружает всю страницу.</> }, ask: { uz: "Nega butun olamni qayta yuklashdan ko'ra, faqat markazni almashtirish tezroq?", ru: 'Почему сменить только центр быстрее, чем перезагрузить весь мир?' } },
    ]
  },
  10: {
    title: { uz: ":id — manzildagi o'zgaruvchan joy", ru: ':id — переменное место в адресе' },
    cards: [
      { ic: "🎛️", h: { uz: ":id — bo'sh katak", ru: ':id — пустая ячейка' }, body: { uz: <><span className="mono">/game/:id</span> manzilida <span className="mono">:id</span> — bo'sh katak, <b>o'zgaruvchan joy</b>. Adopt Me bosilsa <span className="mono">/game/1</span>, Doors bosilsa <span className="mono">/game/4</span>. Bitta manzil naqshi — istalgan o'yin.</>, ru: <>В адресе <span className="mono">/game/:id</span> часть <span className="mono">:id</span> — пустая ячейка, <b>переменное место</b>. Нажали Adopt Me — <span className="mono">/game/1</span>, нажали Doors — <span className="mono">/game/4</span>. Один шаблон адреса — любая игра.</> } },
      { ic: "🔑", h: { uz: "useParams() katakni o'qiydi", ru: 'useParams() читает ячейку' }, body: { uz: <><span className="mono">/game/7</span> ochilganda Router <span className="mono">:id</span> katagiga 7 ni qo'yadi. Sahifa uni <span className="mono">useParams()</span> bilan o'qiydi: <span className="mono">const {'{ id }'} = useParams()</span> → id = 7. Keyin aynan 7-o'yinni ko'rsatadi.</>, ru: <>Когда открывается <span className="mono">/game/7</span>, Router кладёт 7 в ячейку <span className="mono">:id</span>. Страница читает её через <span className="mono">useParams()</span>: <span className="mono">const {'{ id }'} = useParams()</span> → id = 7. И показывает именно игру номер 7.</> } },
      { ic: "♻️", h: { uz: "Bitta sahifa — minglab o'yin", ru: 'Одна страница — тысячи игр' }, body: { uz: <>Har o'yinga alohida sahifa yozmaymiz. Bitta <span className="mono">GamePage</span> va <span className="mono">:id</span> — barcha o'yinlar uchun yetadi.</>, ru: <>Мы не пишем отдельную страницу под каждую игру. Одной <span className="mono">GamePage</span> и <span className="mono">:id</span> хватает на все игры.</> }, ask: { uz: "1000 ta o'yin bo'lsa, nechta «O'yin sahifasi» kodi yozamiz?", ru: 'Если игр будет 1000 — сколько раз мы напишем код «страницы игры»?' } },
    ]
  },
  15: {
    title: { uz: "useNavigate — kod o'zi warp qiladi", ru: 'useNavigate — код сам делает warp' },
    cards: [
      { ic: "🤖", h: { uz: "Avto-warp — bu useNavigate()", ru: 'Авто-warp — это useNavigate()' }, body: { uz: <>Ba'zan foydalanuvchi hech qanday havolani <b>bosmaydi</b> — masalan «Saqlash»dan keyin ilova o'zi Bosh sahifaga o'tishi kerak. Bosadigan havola yo'q, demak <span className="mono">{'<Link>'}</span> ish bermaydi. Bu yerda <b>kodning o'zi</b> warp qiladi: <span className="mono">useNavigate()</span>.</>, ru: <>Иногда пользователь <b>не нажимает</b> никакую ссылку — например, после «Сохранить» приложение само должно перейти на Главную. Нажимать нечего, значит <span className="mono">{'<Link>'}</span> не поможет. Здесь warp делает <b>сам код</b>: <span className="mono">useNavigate()</span>.</> } },
      { ic: "💾", h: { uz: "Hodisadan keyin kod o'tkazadi", ru: 'После события переводит код' }, body: { uz: <><span className="mono">const navigate = useNavigate()</span> — keyin <span className="mono">navigate('/')</span> chaqirilganda kod o'zi Bosh sahifaga o'tadi. <span className="mono">{'<Link>'}</span> — odam bosishi uchun; <span className="mono">navigate()</span> — kod ichida ishlatish uchun.</>, ru: <><span className="mono">const navigate = useNavigate()</span> — затем при вызове <span className="mono">navigate('/')</span> код сам переходит на Главную. <span className="mono">{'<Link>'}</span> — чтобы нажимал человек; <span className="mono">navigate()</span> — чтобы вызывал код.</> } },
      { ic: "🎯", h: { uz: "Link bosiladi, navigate chaqiriladi", ru: 'Link нажимают, navigate вызывают' }, body: { uz: <>Ikkalasi ham sahifa almashtiradi. Farqi: <span className="mono">{'<Link>'}</span>ni foydalanuvchi <b>bosadi</b>, <span className="mono">navigate()</span>ni esa <b>kod chaqiradi</b> (masalan saqlashdan keyin).</>, ru: <>Оба меняют страницу. Разница: <span className="mono">{'<Link>'}</span> <b>нажимает</b> пользователь, а <span className="mono">navigate()</span> <b>вызывает код</b> (например, после сохранения).</> }, ask: { uz: "Forma saqlangach o'quvchi avtomatik Bosh sahifada bo'lishi kerak — qaysi birini ishlatamiz?", ru: 'После сохранения формы ученик должен автоматически оказаться на Главной — что из двух используем?' } },
    ]
  },
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
        <p className="mstats-hidden">{tr({ uz: '🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o\'quvchilar ekranida ham birdan ochiladi.', ru: '🙈 Кто что выбрал и число ✅/❌ скрыто — при нажатии «Открыть результат» всё откроется одновременно и у вас, и на экранах учеников.' })}</p>
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
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? `${n} ${tr({ uz: "o'quvchi", ru: 'учен.' })} · ${pct}%` : '—'}</span>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — эта тема осталась классу непонятной. Перед продолжением рекомендуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish —', ru: '📖 Повторное объяснение —' })} {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по процентам вывод делать рано. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish —', ru: '📖 Повторное объяснение —' })} {tr(RECAPS[screenIdx]?.title)}</button>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в реальном времени…' })}</p>}
    </div>
  );
}
const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student'); // jonli dars: BITTA urinish — xato bo'lsa ham qotadi
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now()); // tezlik: savol ochilgandan bosishgacha (teng ballda hal qiladi)
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null); // ball: 1-urinish qotadi
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
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect; // ball: 1-urinishni qotirib qo'yamiz
    if (oneShot) {
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || ('s' + screen), i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx; // jonli darsda xato bosib qotgan
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed; // javob qotdi — natija mentordan kutilmoqda
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, нажимайте обдуманно!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (isMentorLive) {
              if (mReveal) { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; }
            } else if (solved) {
              if (waiting) { if (i === picked) cls += ' option-wait'; }
              else { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; if (wrongLocked && i === picked) cls += ' option-picked-wrong'; }
            }
            else if (i === picked) cls += ' option-picked-wrong';
            const showGreenLetter = isMentorLive ? (mReveal && i === correctIdx) : (solved && revealed && i === correctIdx);
            return (
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
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

// ===== KOD RANGLARI =====
const Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: 'italic' }}>{children}</span>;
const Win = ({ title, children, minH }) => (
  <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">{title}</span></div><div className="bp-body" style={{ minHeight: minH, position: 'relative' }}>{children}</div></div>
);
const TLine = ({ cmd, out, dim }) => (
  <div className="el-in" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(11.5px,1.4vw,13px)', lineHeight: 1.7, color: dim ? CODE.comment : CODE.text }}>
    {cmd ? <><span style={{ color: CODE.str }}>$</span> <span style={{ color: CODE.text }}>{cmd}</span></> : out}
  </div>
);

// ===== ROBO-GAMES MA'LUMOTLARI (oldingi darslardan tanish) =====
const GAMES = [
  { id: 1, name: 'Adopt Me!', emoji: '🐾', likes: 92, players: '402K', bg: 'linear-gradient(135deg,#F3C2D2,#DFA6BA)', desc: { uz: "Uy hayvonlarini asrang, boqing va do'st orttiring.", ru: 'Заботьтесь о питомцах, кормите их и заводите друзей.' } },
  { id: 2, name: 'Blox Fruits', emoji: '🍇', likes: 95, players: '750K', bg: 'linear-gradient(135deg,#BAC4EC,#98A6DC)', desc: { uz: "Mevalar kuchini oching va dengizni zabt eting.", ru: 'Откройте силу фруктов и покорите море.' } },
  { id: 3, name: 'Brookhaven', emoji: '🏠', likes: 89, players: '510K', bg: 'linear-gradient(135deg,#B6DDC4,#92C8A7)', desc: { uz: "O'z shahringizda yashang, mashina haydang, do'st toping.", ru: 'Живите в своём городе, водите машину, находите друзей.' } },
  { id: 4, name: 'Doors', emoji: '🚪', likes: 91, players: '310K', bg: 'linear-gradient(135deg,#C6BFB8,#A79E95)', desc: { uz: "Eshiklarni oching, sirlardan qoching, omon qoling.", ru: 'Открывайте двери, избегайте тайн, выживайте.' } }
];
const gameById = (id) => GAMES.find(g => g.id === Number(id)) || GAMES[0];
const gameByName = (nm) => GAMES.find(g => g.name.toLowerCase() === String(nm).toLowerCase());

// O'yin kartochkasi: name + players props; onClick (kartani bosish → o'sha sahifa)
const RoCard = ({ name, players, top, onClick, emoji, likes, bg }) => {
  const g = gameByName(name);
  const _bg = bg || (g ? g.bg : 'linear-gradient(135deg,#8E9BB5,#4A5670)');
  const em = emoji || (g ? g.emoji : '🎮');
  return (
    <div className={`rocard el-in ${onClick ? 'tappable' : ''}`} onClick={onClick} style={{ position: 'relative' }}>
      <div className="rothumb" style={{ background: _bg }}>
        <span style={{ fontSize: 26 }}>{em}</span>
        {top && <span className="topbadge el-in">🔥 TOP</span>}
      </div>
      <div className="robody">
        <p className="roname">{name}</p>
        <div className="rostats">
          <span>👍 {likes != null ? likes : (g ? g.likes : 88)}%</span>
          {players && <span>👥 {players}</span>}
        </div>
      </div>
    </div>
  );
};

// ===== ROUTE XARITASI (3 sahifa) =====
const ROUTES = [
  { path: '/', page: { uz: 'Bosh', ru: 'Главная' }, comp: 'Home', icon: '🏠', desc: "barcha o'yinlar katalogi" },
  { path: '/game/:id', page: { uz: "O'yin", ru: 'Игра' }, comp: 'GamePage', icon: '🎮', desc: "bitta o'yin tafsiloti" },
  { path: '/add', page: { uz: "Qo'shish", ru: 'Добавить' }, comp: 'AddPage', icon: '➕', desc: "yangi o'yin formasi" }
];

// ===== ILOVANING SIMULYATSIYASI (brauzer ichidagi sahifalar) =====
const UrlBar = ({ path }) => (
  <div className="url-bar"><span style={{ fontSize: 10 }}>🔒</span><span style={{ color: T.ink3 }}>robo-games.uz</span><span className="u-path">{path}</span></div>
);
const NavMenu = ({ active, onGo }) => (
  <div className="navmenu">
    {ROUTES.map(r => (
      <button key={r.path} className={`navlink ${active === r.path ? 'on' : ''}`} onClick={onGo ? () => onGo(r.path) : undefined}>{r.icon} {tr(r.page)}</button>
    ))}
  </div>
);
const HomeView = ({ onOpen }) => (
  <div className="fade-step" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
    {GAMES.map(g => <RoCard key={g.id} name={g.name} players={g.players} onClick={onOpen ? () => onOpen(g.id) : undefined} />)}
  </div>
);
const GameView = ({ id }) => {
  const g = gameById(id);
  return (
    <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ borderRadius: 12, height: 76, background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38 }}>{g.emoji}</div>
      <div>
        <p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 18, color: T.ink, margin: 0 }}>{g.name}</p>
        <div style={{ display: 'flex', gap: 12, margin: '4px 0 6px', fontFamily: "'Manrope',sans-serif", fontSize: 12, color: T.ink2, fontWeight: 600 }}><span>👍 {g.likes}%</span><span>👥 {g.players}</span></div>
        <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr(g.desc)}</p>
      </div>
    </div>
  );
};
const AddView = () => (
  <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
    <p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 17, color: T.ink, margin: 0 }}>{tr({ uz: "Yangi o'yin qo'shish", ru: 'Добавить новую игру' })}</p>
    <div style={{ background: T.bg, borderRadius: 9, padding: '9px 12px', fontFamily: "'Manrope',sans-serif", fontSize: 12.5, color: T.ink3 }}>{tr({ uz: "O'yin nomi…", ru: 'Название игры…' })}</div>
    <div style={{ display: 'flex', gap: 6 }}>{['🤖', '🏎️', '🐉', '👾'].map(e => <span key={e} style={{ width: 30, height: 30, borderRadius: 8, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{e}</span>)}</div>
    <span style={{ alignSelf: 'flex-start', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 12, background: T.accent, color: '#fff', borderRadius: 8, padding: '7px 14px' }}>{tr({ uz: "+ Qo'shish", ru: '+ Добавить' })}</span>
  </div>
);
const PageView = ({ path, gameId, onOpen }) => {
  if (path === '/') return <HomeView onOpen={onOpen} />;
  if (path === '/add') return <AddView />;
  if (String(path).startsWith('/game')) return <GameView id={gameId} />;
  return null;
};

// ============================================================
// 🌐 WARP-XARITA (Ijodkor g'oyasi) — top-down ROBO-WORLD: 3 zona + robot-avatar + O'ZGARMAS HUD-ramka.
// SKELET: currentZone + arenaId state. warp-portal = Link/SPA (HUD joyida, faqat markaz almashadi);
// «chiqish eshigi» = <a href> (butun panel qorayadi, loading-bar). Raqam-dial = useParams. Auto-warp = useNavigate.
// Harakat SIFATI (silliqlik/reduced-motion) → ✨ Animatsiya; ranglar/rasm → 🎨 Dizayn.
// ============================================================
const WARP_ZONES = [
  { id: 'home',  path: '/',         label: { uz: 'Bosh', ru: 'Главная' },      icon: '🏠', color: T.accent },
  { id: 'arena', path: '/game/:id', label: { uz: 'Arena', ru: 'Арена' },       icon: '🎮', color: T.blue },
  { id: 'shop',  path: '/add',      label: { uz: 'Ustaxona', ru: 'Мастерская' }, icon: '🔧', color: T.success },
];
const warpZone = (id) => WARP_ZONES.find(z => z.id === id) || WARP_ZONES[0];
function WarpMap({ variant = 'link', preview = false, onWarp, onReload, onDial, onAutoNav }) {
  const [zone, setZone] = useState('home');
  const [arenaId, setArenaId] = useState(1);
  const [warping, setWarping] = useState(false);
  const [reloading, setReloading] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const z = warpZone(zone);
  const path = zone === 'arena' ? `/game/${arenaId}` : z.path;
  const g = gameById(arenaId);
  const warp = (id) => {
    if (preview || warping || reloading || id === zone) return;
    clearTimeout(timer.current);
    setWarping(true);
    timer.current = setTimeout(() => { setZone(id); setWarping(false); if (onWarp) onWarp(id); }, 460);
  };
  const exitReload = () => {
    if (preview || reloading || warping) return;
    clearTimeout(timer.current);
    setReloading(true);
    if (onReload) onReload();
    timer.current = setTimeout(() => { setZone('home'); setReloading(false); }, 1150);
  };
  const dial = (delta) => {
    if (preview) return;
    setArenaId(v => ((v - 1 + delta + 4) % 4) + 1);
    if (onDial) onDial();
  };
  // useNavigate demo: Ustaxonada «Saqlash» → avtomatik Bosh maydonga warp
  const saveAndNavigate = () => {
    if (preview || warping || reloading) return;
    clearTimeout(timer.current);
    setWarping(true);
    timer.current = setTimeout(() => { setZone('home'); setWarping(false); if (onAutoNav) onAutoNav(); }, 620);
  };
  return (
    <div className={`warp ${preview ? 'warp-preview' : ''}`} style={{ '--wz': z.color }}>
      {/* O'ZGARMAS HUD-ramka: koordinata-panel = URL bar */}
      <div className="warp-hud">
        <span className="warp-dot" style={{ background: z.color }} />
        <span className="warp-coord mono">robo-games.uz<b style={{ color: z.color }}>{path}</b></span>
        <span className="warp-live">HUD</span>
      </div>
      <div className="warp-scene">
        {reloading && <div className="warp-flash"><div className="warp-loadbar"><i /></div><span className="warp-flash-t">{tr({ uz: 'Butun olam qaytadan yuklanmoqda…', ru: 'Весь мир загружается заново…' })}</span></div>}
        {warping && <div className="warp-zap" aria-hidden="true" style={{ '--wz': z.color }} />}
        <div className={`warp-center ${warping ? 'warping' : ''}`} key={zone + (zone === 'arena' ? arenaId : '')} style={{ '--wz': z.color }}>
          <div className="warp-zoneicon" style={{ background: z.color }}>{zone === 'arena' ? g.emoji : z.icon}</div>
          <div className="warp-robot" aria-hidden="true">🤖</div>
          <p className="warp-zonename">{zone === 'arena' ? g.name : tr(z.label)}</p>
          {zone === 'arena' && (variant === 'param' || variant === 'link') && (
            <div className="warp-dial">
              <button className="warp-dialbtn" onClick={() => dial(-1)} aria-label={tr({ uz: 'oldingi', ru: 'предыдущая' })}>‹</button>
              <span className="mono warp-dialnum">:id = {arenaId}</span>
              <button className="warp-dialbtn" onClick={() => dial(1)} aria-label={tr({ uz: 'keyingi', ru: 'следующая' })}>›</button>
            </div>
          )}
          {zone === 'shop' && variant === 'navigate' && (
            <button className="warp-savebtn" onClick={saveAndNavigate}>{tr({ uz: '💾 Saqlash → Bosh', ru: '💾 Сохранить → Главная' })}</button>
          )}
        </div>
      </div>
      {/* Portallar = <Link> (SPA warp) + chiqish eshigi = <a href> (to'liq reload) */}
      <div className="warp-portals">
        {WARP_ZONES.map(w => (
          <button key={w.id} className={`warp-portal ${zone === w.id ? 'on' : ''}`} style={{ '--wz': w.color }} onClick={() => warp(w.id)} disabled={preview}>
            <span className="warp-portal-ic">{w.icon}</span>
            <span className="warp-portal-l">{tr(w.label)}</span>
            <span className="mono warp-portal-p">{w.path}</span>
            <span className="warp-portal-bar" />
          </button>
        ))}
      </div>
      <button className="warp-exit" onClick={exitReload} disabled={preview}>{tr({ uz: '🚪 Chiqish eshigi', ru: '🚪 Дверь выхода' })} <span className="warp-exit-sub">{tr({ uz: "(o'yinni qayta och — <a href>)", ru: '(перезапустить игру — <a href>)' })}</span></button>
    </div>
  );
}

// ===== SCREEN 0 — HOOK (bir sahifa vs ko'p sahifa: nega qayta yuklanmaydi?) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [path, setPath] = useState('/');
  const [reloading, setReloading] = useState(false);
  const [tried, setTried] = useState(!!storedAnswer);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const go = (p) => {
    if (reloading) return;
    setReloading(true); setTried(true);
    timer.current = setTimeout(() => { setPath(p); setReloading(false); }, 1050);
  };
  const OPTS = [
    { id: 'a', label: { uz: "Har sahifa alohida HTML fayl — qayta yuklanaveradi", ru: 'Каждая страница — отдельный HTML-файл, он всё время перезагружается' } },
    { id: 'b', label: { uz: 'React Router — sahifani qayta yuklamay, faqat kerakli qismni almashtiradi', ru: 'React Router — не перезагружает страницу, а меняет только нужную часть' } },
    { id: 'c', label: { uz: "Internet juda tez bo'lgani uchun", ru: 'Потому что интернет очень быстрый' } }
  ];
  const pick = (v) => { if (picked !== null || !tried) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked !== null} navContent={<NavNext disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 820 }}>{tr({ uz: <>Sahifalar orasida o'tganda nega ekran <span className="italic" style={{ color: T.accent }}>oqarib ketdi</span>?</>, ru: <>Почему при переходе между страницами экран <span className="italic" style={{ color: T.accent }}>побелел</span>?</> })}</h1>
        <Mentor>{tr({ uz: <>Robo-games hozir <b style={{ color: T.ink }}>bitta sahifa</b>. Lekin haqiqiy ilovada "Bosh", "O'yin", "Qo'shish" sahifalari bor. Menyudagi havolani <b style={{ color: T.ink }}>bosib ko'ring</b> — diqqat qiling: sahifa qanday ochiladi?</>, ru: <>Сейчас robo-games — <b style={{ color: T.ink }}>одна страница</b>. Но в настоящем приложении есть страницы «Главная», «Игра», «Добавить». <b style={{ color: T.ink }}>Нажмите</b> на ссылку в меню — обратите внимание: как открывается страница?</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'Eski usul — har bosishda qayta yuklanadi', ru: 'Старый способ — перезагрузка при каждом нажатии' })}</p>
            <Win title="robo-games.uz" minH={150}>
              <div style={{ marginBottom: 9 }}><NavMenu active={path} onGo={go} /></div>
              <div style={{ position: 'relative', minHeight: 96 }}>
                {reloading && <div className="page-flash"><div className="spinner" /></div>}
                <UrlBar path={path} />
                <div style={{ marginTop: 9 }}><PageView path={path} gameId={1} /></div>
              </div>
            </Win>
            {tried && !reloading && <p className="small fade-step" style={{ color: T.accent, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Sezdingizmi? Butun ekran oq bo'lib, qaytadan yuklandi — sekin va silliq emas.", ru: 'Заметили? Весь экран побелел и загрузился заново — медленно и не плавно.' })}</p>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Instagram va Roblox sahifalar orasida bir zumda o\'tadi. Nega?', ru: 'Instagram и Roblox переходят между страницами мгновенно. Почему?' })}</p>
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
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Avval menyudan bir sahifani oching ←', ru: 'Сначала откройте страницу из меню ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Aynan! <b>React Router</b> butun sahifani emas, faqat <b>kerakli qismini</b> almashtiradi — shuning uchun o'tish bir zumda. Bugun robo-games'ni <b>ko'p sahifali</b> qilamiz.</>, ru: <>Именно! <b>React Router</b> меняет не всю страницу, а только <b>нужную часть</b> — поэтому переход мгновенный. Сегодня сделаем robo-games <b>многостраничным</b>.</> })}</p>}
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
    { text: { uz: "Manzillar ro'yxati — o'zingiz tuzasiz", ru: 'Список адресов — составляете сами' }, tag: { uz: 'manzil → sahifa', ru: 'адрес → страница' } },
    { text: { uz: 'Routes va Route', ru: 'Routes и Route' }, tag: '<Route path element />' },
    { text: { uz: 'Link — qayta yuklamaydigan havola', ru: 'Link — ссылка без перезагрузки' }, tag: '<Link> vs <a>' },
    { text: { uz: 'URL parametr', ru: 'URL-параметр' }, tag: '/game/:id' },
    { text: { uz: 'AI bilan qurish va tekshirish', ru: 'Строим с AI и проверяем' }, tag: 'vibecoding' }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Dars oxirida — sizning ROBO-WORLD xaritangiz', ru: 'В конце урока — ваша карта ROBO-WORLD' })}</p>
      <WarpMap preview />
      <pre className="code-box" style={{ padding: '10px 14px' }}>{'<Routes>'}{'\n  '}<Jx>{'<Route '}</Jx><At>path</At>=<St>"/"</St> <At>element</At>{'={<Home />}'}<Jx>{' />'}</Jx>{'\n  …'}{'\n'}{'</Routes>'}</pre>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: '→ 3 zona — bitta ilovada', ru: '→ 3 зоны — в одном приложении' })}</p>
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
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Bugun <span className="italic" style={{ color: T.accent }}>rejani siz tuzasiz</span> — AI esa yozadi.</>, ru: <>Сегодня <span className="italic" style={{ color: T.accent }}>план составляете вы</span> — а AI пишет.</> })}</h2>
        </div>
        <Mentor>{tr({ uz: <>Tartib oddiy: avval <b style={{ color: T.ink }}>siz</b> belgilaysiz — qaysi manzil qaysi sahifani ochadi. Keyin <b style={{ color: T.ink }}>AI</b> kodni yozadi, so'ng <b style={{ color: T.ink }}>siz</b> uni tekshirasiz. Router'ni shu — qurish jarayonida — o'rganasiz.</>, ru: <>Порядок простой: сначала <b style={{ color: T.ink }}>вы</b> решаете, какой адрес открывает какую страницу. Затем <b style={{ color: T.ink }}>AI</b> пишет код, а потом <b style={{ color: T.ink }}>вы</b> его проверяете. Router вы выучите прямо в процессе постройки.</> })}</Mentor>
        {!isNarrow ? (
          <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable>
        ) : !showSteps ? (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "Bugungi 5 qadamni ko'rish", ru: 'Посмотреть сегодняшние 5 шагов' })}</button>
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

// ===== SCREEN 2 — ME'MOR: ROUTE XARITASI (reusable DragDropOrder — manzil→sahifa) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  // items[i] slot i ga tushadi: har manzil (hint) uchun to'g'ri sahifani joylang
  const ITEMS = [
    { id: 'home', label: tr({ uz: '🏠 Bosh', ru: '🏠 Главная' }) },
    { id: 'game', label: tr({ uz: "🎮 O'yin", ru: '🎮 Игра' }) },
    { id: 'add',  label: tr({ uz: "➕ Qo'shish", ru: '➕ Добавить' }) }
  ];
  const HINTS = [tr({ uz: '/  →  bu manzilga?', ru: '/  →  на этот адрес?' }), tr({ uz: '/game/:id  →  bu manzilga?', ru: '/game/:id  →  на этот адрес?' }), tr({ uz: '/add  →  bu manzilga?', ru: '/add  →  на этот адрес?' })];
  const solve = () => { if (done) return; setDone(true); onAnswer(screen, { correct: true, picked: true }); };
  return (
    <Stage eyebrow={tr({ uz: "1-qadam · manzillar ro'yxati", ru: 'Шаг 1 · список адресов' })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Ro'yxatni yig'ing", ru: 'Соберите список' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaysi <span className="italic" style={{ color: T.accent }}>manzil</span> qaysi <span className="italic" style={{ color: T.accent }}>sahifaga</span> olib boradi?</>, ru: <>Какой <span className="italic" style={{ color: T.accent }}>адрес</span> ведёт на какую <span className="italic" style={{ color: T.accent }}>страницу</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Ilovani qurishdan oldin bitta <b style={{ color: T.ink }}>ro'yxat</b> kerak: qaysi manzil (URL) qaysi sahifani ochadi. Har manzil katagiga to'g'ri sahifa bo'lagini <b style={{ color: T.ink }}>sudrab</b> joylang — ro'yxatni o'zingiz yig'asiz.</>, ru: <>Перед постройкой приложения нужен один <b style={{ color: T.ink }}>список</b>: какой адрес (URL) открывает какую страницу. <b style={{ color: T.ink }}>Перетащите</b> в ячейку каждого адреса правильную страницу — список вы собираете сами.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Har manzilga to'g'ri sahifani joylang", ru: 'Поставьте к каждому адресу правильную страницу' })}</p>
            <DragDropOrder items={ITEMS} hints={HINTS} onSolved={solve} />
          </Col>
          <Col>
            {!done ? (
              <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Manzil (URL) — bu sahifaning <b style={{ color: T.ink }}>adresi</b>. <span className="mono">/</span> — bosh katalog, <span className="mono">/game/:id</span> — bitta o'yin, <span className="mono">/add</span> — forma. Har birini o'z sahifasiga ulang.</>, ru: <>Адрес (URL) — это <b style={{ color: T.ink }}>адрес</b> страницы. <span className="mono">/</span> — главный каталог, <span className="mono">/game/:id</span> — одна игра, <span className="mono">/add</span> — форма. Соедините каждый со своей страницей.</> })}</p></div>
            ) : (
              <>
                <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: "Tayyor ro'yxat — kod tilida", ru: 'Готовый список — на языке кода' })}</p>
                <pre className="code-box fade-step" style={{ lineHeight: 1.9 }}>
                  {ROUTES.map(r => (
                    <React.Fragment key={r.path}><Cm>{`// ${r.path}`}</Cm>{`  → ${r.comp}\n`}</React.Fragment>
                  ))}
                </pre>
                <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mana sizning <b>ro'yxatingiz</b>: 3 ta manzil, 3 ta sahifa. Endi buni React kodiga aylantiramiz.</>, ru: <>Вот ваш <b>список</b>: 3 адреса, 3 страницы. Теперь превратим его в код React.</> })}</p></div>
              </>
            )}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — ROUTES / ROUTE (3 bo'lakni bosib o'rganish) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const PARTS = {
    routes: { lbl: '<Routes>', t: { uz: "yo'l tanlovchi", ru: 'выбирает маршрут' }, desc: { uz: "Barcha route'larni o'rab turadi. URL'ga qarab qaysi birini ko'rsatishni hal qiladi.", ru: 'Оборачивает все route. По URL решает, какой из них показать.' } },
    path: { lbl: 'path="/"', t: { uz: 'manzil', ru: 'адрес' }, desc: { uz: "Qaysi URL'da ishlashi. Brauzer manzili shunga teng bo'lsa — shu route tanlanadi.", ru: 'На каком URL работает. Если адрес браузера совпадает — выбирается этот route.' } },
    element: { lbl: 'element={<Home />}', t: { uz: 'qaysi sahifa', ru: 'какая страница' }, desc: { uz: "Shu manzilda ko'rsatiladigan komponent. Manzil → komponent.", ru: 'Компонент, который показывается по этому адресу. Адрес → компонент.' } }
  };
  const KEYS = ['routes', 'path', 'element'];
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(storedAnswer ? new Set(KEYS) : new Set());
  const done = seen.size >= 3;
  const tap = (k) => { setActive(k); setSeen(prev => { const s = new Set(prev); s.add(k); return s; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Routes va Route', ru: 'Routes и Route' })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${seen.size}/3 ${tr({ uz: "bo'lakni ko'ring", ru: 'части — посмотрите' })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bu ro'yxatni React <span className="italic" style={{ color: T.accent }}>qaysi so'zlar</span> bilan yozadi?</>, ru: <>Какими <span className="italic" style={{ color: T.accent }}>словами</span> React записывает этот список?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Atigi ikki teg yetadi: <span className="mono">{'<Routes>'}</span> va <span className="mono">{'<Route>'}</span>. Har <span className="mono">{'<Route>'}</span> — bitta qator: <b style={{ color: T.ink }}>path</b> (manzil) va <b style={{ color: T.ink }}>element</b> (qaysi sahifa). Kodning <b style={{ color: T.ink }}>uchta bo'lagini</b> bosib ko'ring.</>, ru: <>Хватает всего двух тегов: <span className="mono">{'<Routes>'}</span> и <span className="mono">{'<Route>'}</span>. Каждый <span className="mono">{'<Route>'}</span> — одна строка: <b style={{ color: T.ink }}>path</b> (адрес) и <b style={{ color: T.ink }}>element</b> (какая страница). Нажмите на <b style={{ color: T.ink }}>три части</b> кода.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <pre className="code-box fade-up delay-1" style={{ lineHeight: 2 }}>
              <span onClick={() => tap('routes')} style={{ cursor: 'pointer', borderRadius: 6, padding: '1px 5px', background: active === 'routes' ? 'rgba(255,79,40,0.18)' : (seen.has('routes') ? 'rgba(31,122,77,0.13)' : 'transparent') }}><Jx>{'<Routes>'}</Jx></span>{'\n'}
              {'  '}<Jx>{'<Route '}</Jx>
              <span onClick={() => tap('path')} style={{ cursor: 'pointer', borderRadius: 6, padding: '1px 4px', background: active === 'path' ? 'rgba(255,79,40,0.18)' : (seen.has('path') ? 'rgba(31,122,77,0.13)' : 'transparent') }}><At>path</At>=<St>"/"</St></span>{' '}
              <span onClick={() => tap('element')} style={{ cursor: 'pointer', borderRadius: 6, padding: '1px 4px', background: active === 'element' ? 'rgba(255,79,40,0.18)' : (seen.has('element') ? 'rgba(31,122,77,0.13)' : 'transparent') }}><At>element</At>{'={<Home />}'}</span>
              <Jx>{' />'}</Jx>{'\n'}
              {'  '}<Jx>{'<Route '}</Jx><At>path</At>=<St>"/add"</St> <At>element</At>{'={<AddPage />}'}<Jx>{' />'}</Jx>{'\n'}
              <Jx>{'</Routes>'}</Jx>
            </pre>
          </Col>
          <Col>
            {active ? (
              <div className="sk-info" key={active}>
                <div className="sk-tagbig"><span className="sk-wordbadge mono">{PARTS[active].lbl}</span><span style={{ fontWeight: 600, color: T.ink }}>{tr(PARTS[active].t)}</span></div>
                <p className="body" style={{ color: T.ink, margin: '10px 0 0' }}>{tr(PARTS[active].desc)}</p>
              </div>
            ) : (
              <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Kod bo'lagini bosing", ru: 'Нажмите на часть кода' })}</p></div>
            )}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Formula oddiy: har sahifa = bitta <span className="mono">{'<Route path="…" element={<… />} />'}</span>. <span className="mono">{'<Routes>'}</span> esa URL'ga qarab qaysi birini ko'rsatishni tanlaydi.</>, ru: <>Формула простая: каждая страница = один <span className="mono">{'<Route path="…" element={<… />} />'}</span>. А <span className="mono">{'<Routes>'}</span> по URL выбирает, какой из них показать.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 (Route nima qiladi?) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText={tr({ uz: '<Route path="/add" /> nima qiladi?', ru: 'Что делает <Route path="/add" />?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <><span className="mono" style={{ color: T.accent }}>{'<Route path="/add" />'}</span> <span className="italic" style={{ color: T.accent }}>nima qiladi</span>?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>делает</span> <span className="mono" style={{ color: T.accent }}>{'<Route path="/add" />'}</span>?</> })}</h2></>}
    options={[tr({ uz: "Manzilni sahifaga bog'laydi", ru: 'Связывает адрес со страницей' }), tr({ uz: "Yangi o'yin qo'shadi", ru: 'Добавляет новую игру' }), tr({ uz: 'Sahifani qayta yuklaydi', ru: 'Перезагружает страницу' }), tr({ uz: "Serverga so'rov yuboradi", ru: 'Отправляет запрос на сервер' })]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! Route — ro'yxatning bitta qatori: path (manzil) + element (sahifa). /add ochilganda Router AddPage komponentini ko'rsatadi.", ru: 'Верно! Route — одна строка списка: path (адрес) + element (страница). Когда открывается /add, Router показывает компонент AddPage.' })}
    explainWrong={{
      1: tr({ uz: "Yo'q — Route hech narsa qo'shmaydi. U faqat manzilni sahifaga bog'laydi: /add → AddPage.", ru: 'Нет — Route ничего не добавляет. Он только связывает адрес со страницей: /add → AddPage.' }),
      2: tr({ uz: "Aksincha — Router sahifani QAYTA YUKLAMAydi. Route shunchaki manzil → komponent bog'lamasi.", ru: 'Наоборот — Router НЕ перезагружает страницу. Route — просто связка адрес → компонент.' }),
      3: tr({ uz: "Yo'q — bu fetch'ning ishi. Route — manzil va sahifa o'rtasidagi ro'yxat qatori.", ru: 'Нет — это работа fetch. Route — строка списка между адресом и страницей.' }),
      default: tr({ uz: 'Route manzilni komponentga bog\'laydi: path="/add" → element={<AddPage />}.', ru: 'Route связывает адрес с компонентом: path="/add" → element={<AddPage />}.' })
    }} />
);

// ===== SCREEN 5 — LINK vs A (Warp-xarita: warp-portal vs chiqish eshigi) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [triedWarp, setTriedWarp] = useState(!!storedAnswer);
  const [triedExit, setTriedExit] = useState(!!storedAnswer);
  const done = triedWarp && triedExit;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Link vs a · Warp xarita', ru: 'Link vs a · Warp-карта' })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Ikkalasini ham sinang', ru: 'Попробуйте оба' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Havolaning <span className="italic" style={{ color: T.accent }}>ikki turi</span> — qaysi biri butun olamni qayta yuklamaydi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Два вида</span> ссылок — какая не перезагружает весь мир?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana ROBO-WORLD — top-down olam. Tepadagi <b style={{ color: T.ink }}>HUD-ramka</b> (koordinata-panel) — bu URL. <b style={{ color: T.ink }}>Warp-portal</b> (<span className="mono">{'<Link to>'}</span>) bosilsa robot chaqmoq bilan ko'chadi, HUD <b style={{ color: T.ink }}>joyida qoladi</b> — faqat markaz almashadi. <b style={{ color: T.ink }}>Chiqish eshigi</b> (<span className="mono">{'<a href>'}</span>) esa butun olamni qoraytirib, qaytadan yig'adi. Ikkalasini ham sinang.</>, ru: <>Вот ROBO-WORLD — мир с видом сверху. <b style={{ color: T.ink }}>HUD-рамка</b> наверху (панель координат) — это URL. Нажмёте <b style={{ color: T.ink }}>warp-портал</b> (<span className="mono">{'<Link to>'}</span>) — робот телепортируется молнией, HUD <b style={{ color: T.ink }}>остаётся на месте</b>, меняется только центр. А <b style={{ color: T.ink }}>дверь выхода</b> (<span className="mono">{'<a href>'}</span>) гасит весь мир и собирает его заново. Попробуйте оба.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'ROBO-WORLD — warp xaritasi', ru: 'ROBO-WORLD — warp-карта' })}</p>
            <WarpMap variant="link" onWarp={() => setTriedWarp(true)} onReload={() => setTriedExit(true)} />
          </Col>
          <Col>
            <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'Nima sezdingiz?', ru: 'Что вы заметили?' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="tagpill" style={{ color: triedWarp ? T.success : T.ink }}>{triedWarp ? '✓' : '○'} {tr({ uz: <>Warp-portal ({'<Link to>'}) — HUD joyida, silliq</>, ru: <>Warp-портал ({'<Link to>'}) — HUD на месте, плавно</> })}</span>
              <span className="tagpill" style={{ color: triedExit ? T.success : T.ink }}>{triedExit ? '✓' : '○'} {tr({ uz: <>Chiqish eshigi ({'<a href>'}) — butun olam qorayadi</>, ru: <>Дверь выхода ({'<a href>'}) — весь мир гаснет</> })}</span>
            </div>
            {done
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ko'rdingizmi? <span className="mono">{'<a>'}</span> — butun olam qorayib qaytadan yuklandi (sekin). <span className="mono">{'<Link>'}</span> — HUD joyida, faqat markaz almashdi (bir zumda). Shuning uchun React'da <b>doim {'<Link>'}</b> ishlatiladi.</>, ru: <>Видели? <span className="mono">{'<a>'}</span> — весь мир погас и загрузился заново (медленно). <span className="mono">{'<Link>'}</span> — HUD на месте, сменился только центр (мгновенно). Поэтому в React <b>всегда используют {'<Link>'}</b>.</> })}</p></div>
              : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Avval <b style={{ color: T.ink }}>warp-portal</b>ni bosing (pastdagi 3 zona), keyin <b style={{ color: T.ink }}>chiqish eshigi</b>ni — farqni his qiling.</>, ru: <>Сначала нажмите <b style={{ color: T.ink }}>warp-портал</b> (3 зоны внизу), затем <b style={{ color: T.ink }}>дверь выхода</b> — почувствуйте разницу.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5b — TEST 2 (Link vs a) =====
const Screen5b = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv', ru: 'Проверка' })}
    questionText={tr({ uz: 'Qaysi biri sahifani QAYTA YUKLAMAydi?', ru: 'Что из этого НЕ перезагружает страницу?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Mustahkamlash', ru: 'Закрепление' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Qaysi biri sahifani <span className="italic" style={{ color: T.accent }}>qayta yuklamaydi</span>?</>, ru: <>Что из этого <span className="italic" style={{ color: T.accent }}>не перезагружает</span> страницу?</> })}</h2></>}
    options={['<a href="/add">', '<Link to="/add">', tr({ uz: 'Ikkalasi ham qayta yuklaydi', ru: 'Оба перезагружают' }), tr({ uz: 'Ikkalasi ham bir xil ishlaydi', ru: 'Оба работают одинаково' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! <Link> — Router'ning havolasi: sahifani qayta yuklamay, faqat kerakli qismni almashtiradi. Tez va silliq.", ru: 'Верно! <Link> — ссылка Router: не перезагружает страницу, а меняет только нужную часть. Быстро и плавно.' })}
    explainWrong={{
      0: tr({ uz: 'Esingizdami oq ekran? <a href> brauzerni butun sahifani qayta yuklashga majbur qiladi.', ru: 'Помните белый экран? <a href> заставляет браузер перезагрузить всю страницу.' }),
      2: tr({ uz: "Yo'q — <Link> qayta yuklamaydi. Aynan shu uning vazifasi.", ru: 'Нет — <Link> не перезагружает. В этом и есть его задача.' }),
      3: tr({ uz: "Yo'q — farqi katta: <a> qaytadan yuklaydi, <Link> esa yo'q.", ru: 'Нет — разница большая: <a> перезагружает, а <Link> — нет.' }),
      default: tr({ uz: '<Link to> qayta yuklamaydi; <a href> esa butun sahifani qaytadan yuklaydi.', ru: '<Link to> не перезагружает; а <a href> перезагружает всю страницу.' })
    }} />
);

// ===== SCREEN 6 — URL PARAMETR (/game/:id) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [openId, setOpenId] = useState(storedAnswer ? 2 : null);
  const [seen, setSeen] = useState(storedAnswer ? new Set([1, 2]) : new Set());
  const done = seen.size >= 2;
  const open = (id) => { setOpenId(id); setSeen(prev => { const s = new Set(prev); s.add(id); return s; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'URL parametr', ru: 'URL-параметр' })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${seen.size}/2 ${tr({ uz: "o'yinni oching", ru: 'игры — откройте' })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta "O'yin" sahifasi <span className="italic" style={{ color: T.accent }}>minglab o'yinga</span> qanday yetadi?</>, ru: <>Как одной страницы «Игра» хватает <span className="italic" style={{ color: T.accent }}>на тысячи игр</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har o'yinga alohida sahifa yozmaymiz! Manzilda <b style={{ color: T.ink }}>o'zgaruvchan joy</b> bor: <span className="mono">/game/<span style={{ color: T.accent }}>:id</span></span>. <span className="mono">:id</span> — bo'sh katak. Adopt Me bosilsa <span className="mono">/game/1</span>, Doors bosilsa <span className="mono">/game/4</span>. Bitta sahifa — istalgan o'yin. Kartochkalarni bosib ko'ring.</>, ru: <>Мы не пишем отдельную страницу под каждую игру! В адресе есть <b style={{ color: T.ink }}>переменное место</b>: <span className="mono">/game/<span style={{ color: T.accent }}>:id</span></span>. <span className="mono">:id</span> — пустая ячейка. Нажали Adopt Me — <span className="mono">/game/1</span>, нажали Doors — <span className="mono">/game/4</span>. Одна страница — любая игра. Понажимайте на карточки.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Bosh sahifa — kartochkani bosing', ru: 'Главная — нажмите на карточку' })}</p>
            <Win title="robo-games.uz" minH={120}>
              <UrlBar path="/" />
              <div style={{ marginTop: 8 }}><HomeView onOpen={open} /></div>
            </Win>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "O'yin sahifasi", ru: 'Страница игры' })}</p>
            <Win title="robo-games.uz" minH={120}>
              {openId ? <><UrlBar path={`/game/${openId}`} /><div style={{ marginTop: 9 }}><GameView id={openId} /></div></>
                : <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{tr({ uz: "Chapdan o'yinni bosing…", ru: 'Нажмите на игру слева…' })}</p>}
            </Win>
            {openId && (
              <div className="code-box fade-step" style={{ padding: '9px 13px' }}>
                <TLine out={<span><Cm>{'// manzildan o\'qiladi:'}</Cm></span>} />
                <TLine out={<span><Jx>{'const'}</Jx>{' { '}<At>id</At>{' } = useParams();  '}<Cm>{`// id = "${openId}"`}</Cm></span>} />
              </div>
            )}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">:id</span> — manzildagi o'zgaruvchi. Sahifa uni <span className="mono">useParams()</span> bilan o'qiydi va aynan o'sha o'yinni ko'rsatadi. Bitta kod — barcha o'yinlar uchun.</>, ru: <><span className="mono">:id</span> — переменная в адресе. Страница читает её через <span className="mono">useParams()</span> и показывает именно ту игру. Один код — на все игры.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — NAVIGATSIYA SIMULYATSIYASI (to'liq ilova) =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [path, setPath] = useState('/');
  const [openId, setOpenId] = useState(1);
  const [seen, setSeen] = useState(storedAnswer ? new Set(['/', '/game/:id', '/add']) : new Set(['/']));
  const done = seen.size >= 3;
  const go = (p) => { setPath(p); setSeen(prev => { const s = new Set(prev); s.add(p); return s; }); };
  const openGame = (id) => { setOpenId(id); setPath('/game/:id'); setSeen(prev => { const s = new Set(prev); s.add('/game/:id'); return s; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const realPath = path === '/game/:id' ? `/game/${openId}` : path;
  return (
    <Stage eyebrow={tr({ uz: 'Navigatsiya', ru: 'Навигация' })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Har 3 sahifani oching', ru: 'Откройте все 3 страницы' })} (${seen.size}/3)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>to'liq ilova</span> — sahifalar orasida yuring.</>, ru: <>Теперь <span className="italic" style={{ color: T.accent }}>полное приложение</span> — гуляйте между страницами.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana yig'ilgan ilova: tepada menyu, pastda joriy sahifa. Menyudan bosing yoki o'yin kartochkasini oching — diqqat qiling: <b style={{ color: T.ink }}>manzil (URL) o'zgaradi</b>, lekin ekran <b style={{ color: T.ink }}>oqarmaydi</b>. Har 3 sahifani aylanib chiqing.</>, ru: <>Вот собранное приложение: сверху меню, снизу текущая страница. Нажимайте в меню или открывайте карточку игры — обратите внимание: <b style={{ color: T.ink }}>адрес (URL) меняется</b>, но экран <b style={{ color: T.ink }}>не белеет</b>. Обойдите все 3 страницы.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <Win title="robo-games.uz" minH={190}>
              <div style={{ marginBottom: 9 }}><NavMenu active={path} onGo={go} /></div>
              <UrlBar path={realPath} />
              <div style={{ marginTop: 10 }}><PageView path={path} gameId={openId} onOpen={openGame} /></div>
            </Win>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Ziyorat qilingan sahifalar', ru: 'Посещённые страницы' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {ROUTES.map(r => {
                const ok = seen.has(r.path);
                return (
                  <div key={r.path} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 13px', borderRadius: 11, background: ok ? T.successSoft : T.paper, boxShadow: ok ? `inset 0 0 0 1.5px ${T.success}` : `0 4px 12px -6px rgba(${T.shadowBase},0.14)`, transition: 'all 0.3s' }}>
                    <span style={{ fontWeight: 700, color: ok ? T.success : T.ink3 }}>{ok ? '✓' : '○'}</span>
                    <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12.5, fontWeight: 700, color: T.ink }}>{r.icon} {tr(r.page)}</span>
                    <span className="mono" style={{ marginLeft: 'auto', fontSize: 11, color: T.ink3 }}>{r.path}</span>
                  </div>
                );
              })}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bitta ilova, uchta sahifa, hech qanday qayta yuklanish yo'q. Aynan shu — <b>Single Page App</b> (bir sahifali ilova): brauzer bitta sahifa deb biladi, Router esa ichini almashtiradi.</>, ru: <>Одно приложение, три страницы и ни одной перезагрузки. Это и есть <b>Single Page App</b> (одностраничное приложение): браузер думает, что страница одна, а Router меняет её содержимое.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST 3 (:id ma'nosi) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} idx={8} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText={tr({ uz: '/game/7 manzilida :id nimaga teng?', ru: 'Чему равен :id в адресе /game/7?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <><span className="mono" style={{ color: T.accent }}>/game/7</span> manzilida <span className="mono" style={{ color: T.accent }}>:id</span> <span className="italic" style={{ color: T.accent }}>nimaga teng</span>?</>, ru: <>Чему <span className="italic" style={{ color: T.accent }}>равен</span> <span className="mono" style={{ color: T.accent }}>:id</span> в адресе <span className="mono" style={{ color: T.accent }}>/game/7</span>?</> })}</h2></>}
    options={[tr({ uz: "O'sha o'yinning raqami", ru: 'Номеру этой игры' }), tr({ uz: "Katalogdagi barcha o'yinlar", ru: 'Всем играм каталога' }), tr({ uz: 'Katalogning 7-sahifasi', ru: '7-й странице каталога' }), tr({ uz: '7 soniyalik kutish vaqti', ru: 'Времени ожидания 7 секунд' })]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! :id — manzildagi o'zgaruvchan joy. /game/7 ochilganda useParams() id sifatida 7 ni beradi, sahifa esa 7-o'yinni ko'rsatadi.", ru: 'Верно! :id — переменное место в адресе. Когда открывается /game/7, useParams() отдаёт id = 7, и страница показывает игру номер 7.' })}
    explainWrong={{
      1: tr({ uz: "Yo'q — barcha o'yinlar Bosh sahifada (/). /game/7 esa faqat bittasi — 7-o'yin.", ru: 'Нет — все игры на Главной (/). А /game/7 — только одна, игра номер 7.' }),
      2: tr({ uz: "Yo'q — bu sahifa raqami emas. :id — o'yinning raqami (id).", ru: 'Нет — это не номер страницы. :id — номер игры (id).' }),
      3: tr({ uz: "Yo'q — vaqtga aloqasi yo'q. 7 — o'yinning id raqami.", ru: 'Нет — со временем это не связано. 7 — это id игры.' }),
      default: tr({ uz: "/game/:id da :id — o'yin raqami. /game/7 → id = 7.", ru: 'В /game/:id часть :id — номер игры. /game/7 → id = 7.' })
    }} />
);

// ===== SCREEN 9 — VIBECODING (REJISSYOR: AI ilovani quradi) =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const TASKS = [
    { id: 't1', label: tr({ uz: "Router o'rnatib, 3 sahifa qo'sh: Bosh, O'yin, Qo'shish", ru: 'Установи Router и добавь 3 страницы: Главная, Игра, Добавить' }), plan: [tr({ uz: "Ro'yxatni kodga aylantiraman", ru: 'Превращаю список в код' }), tr({ uz: 'Har sahifaga bitta <Route path element /> yozaman', ru: 'Пишу для каждой страницы один <Route path element />' })], code: <>{'<Routes>'}{'\n  '}<Jx>{'<Route '}</Jx><At>path</At>=<St>"/"</St> <At>element</At>{'={<Home />}'}<Jx>{' />'}</Jx>{'\n  '}<Jx>{'<Route '}</Jx><At>path</At>=<St>"/game/:id"</St> <At>element</At>{'={<GamePage />}'}<Jx>{' />'}</Jx>{'\n  '}<Jx>{'<Route '}</Jx><At>path</At>=<St>"/add"</St> <At>element</At>{'={<AddPage />}'}<Jx>{' />'}</Jx>{'\n'}{'</Routes>'}</> },
    { id: 't2', label: tr({ uz: "Tepaga menyu qo'sh — har sahifaga havola", ru: 'Добавь сверху меню — ссылку на каждую страницу' }), plan: [tr({ uz: "Navbar komponentiga uchta <Link> qo'shaman", ru: 'Добавляю в компонент Navbar три <Link>' }), tr({ uz: '<a> emas, <Link to> ishlataman — qayta yuklanmasin', ru: 'Использую <Link to>, а не <a> — чтобы не было перезагрузки' })], code: <><Jx>{'<Link '}</Jx><At>to</At>=<St>"/"</St><Jx>{'>'}</Jx>{tr({ uz: 'Bosh', ru: 'Главная' })}<Jx>{'</Link>'}</Jx>{'\n'}<Jx>{'<Link '}</Jx><At>to</At>=<St>"/add"</St><Jx>{'>'}</Jx>{tr({ uz: "Qo'shish", ru: 'Добавить' })}<Jx>{'</Link>'}</Jx></> },
    { id: 't3', label: tr({ uz: "O'yin kartochkasi bosilganda o'sha o'yin sahifasiga o'tsin", ru: 'При нажатии на карточку игры пусть открывается страница этой игры' }), plan: [tr({ uz: 'Har kartochkani <Link> ichiga olaman', ru: 'Оборачиваю каждую карточку в <Link>' }), tr({ uz: "Manzilga o'yin id'sini qo'shaman: /game/ + g.id", ru: 'Добавляю в адрес id игры: /game/ + g.id' })], code: <><Jx>{'<Link '}</Jx><At>to</At>{'={'}<St>"/game/"</St>{' + g.id}'}<Jx>{'>'}</Jx>{'\n  '}<Jx>{'<GameCard '}</Jx><At>name</At>{'={g.name}'}<Jx>{' />'}</Jx>{'\n'}<Jx>{'</Link>'}</Jx></> }
  ];
  const [task, setTask] = useState(null);
  const [resId, setResId] = useState(null); // t3 natijasi: bosilgan o'yin sahifasi
  const [phase, setPhase] = useState(storedAnswer ? 'done' : 'idle');
  const timer = useRef(null);
  const done = phase === 'done';
  useEffect(() => () => clearTimeout(timer.current), []);
  const choose = (id) => { clearTimeout(timer.current); setTask(id); setPhase('planned'); setResId(null); };
  const approve = () => { clearTimeout(timer.current); setPhase('building'); timer.current = setTimeout(() => setPhase('done'), 1300); };
  const cur = TASKS.find(t => t.id === task) || (storedAnswer ? TASKS[0] : null);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'AI bilan qurish', ru: 'Строим с AI' })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Agent bilan quring', ru: 'Постройте с агентом' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ro'yxat tayyor — endi <span className="italic" style={{ color: T.accent }}>AI quradi</span>.</>, ru: <>Список готов — теперь <span className="italic" style={{ color: T.accent }}>строит AI</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Siz qaysi manzil qaysi sahifani ochishini bilasiz, demak agent kodini <b style={{ color: T.ink }}>tekshira olasiz</b>: route'lar to'g'rimi, <span className="mono">{'<Link>'}</span> ishlatilganmi (<span className="mono">{'<a>'}</span> emas), <span className="mono">:id</span> bormi. Buyruq bering, rejani <b style={{ color: T.ink }}>tasdiqlang</b>, kodni o'qing.</>, ru: <>Вы знаете, какой адрес открывает какую страницу, значит можете <b style={{ color: T.ink }}>проверить</b> код агента: верны ли route, использован ли <span className="mono">{'<Link>'}</span> (а не <span className="mono">{'<a>'}</span>), есть ли <span className="mono">:id</span>. Дайте команду, <b style={{ color: T.ink }}>подтвердите</b> план, прочитайте код.</> })}</Mentor>
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
                <div className="ai-row"><span className="ai-badge">{tr({ uz: 'Agent', ru: 'Агент' })}</span><span className="ai-bubble">{phase === 'planned' ? tr({ uz: 'Mana rejam — tasdiqlaysizmi?', ru: 'Вот мой план — подтверждаете?' }) : (phase === 'building' ? tr({ uz: 'Yozyapman…', ru: 'Пишу…' }) : tr({ uz: 'Bajardim — kodni tekshiring', ru: 'Готово — проверьте код' }))}</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cur.plan.map((p, i) => <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}><span style={{ color: phase === 'planned' ? T.ink3 : T.success }}>{phase === 'planned' ? '○' : '✓'}</span><span style={{ color: T.ink }}>{p}</span></div>)}
                </div>
                {phase === 'planned' && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={approve}>{tr({ uz: 'Rejani tasdiqlash', ru: 'Подтвердить план' })}</button>}
                {phase === 'building' && <p className="ai-prompt" style={{ color: T.accent }}>{tr({ uz: 'Kod yozilyapti…', ru: 'Код пишется…' })}</p>}
                {phase === 'done' && <div className="ai-code fade-step"><div className="ai-line ok" style={{ cursor: 'default', whiteSpace: 'pre-wrap' }}>{cur.code}</div></div>}
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: '2. Natija — robo-games.uz', ru: '2. Результат — robo-games.uz' })} {done && cur?.id === 't3' ? tr({ uz: '· kartochkani bosing', ru: '· нажмите на карточку' }) : ''}</p>
            <Win title="robo-games.uz" minH={150}>
              {done && cur ? (
                cur.id === 't3' ? (
                  <div className="fade-step">
                    <NavMenu active="/" />
                    <div style={{ marginTop: 9 }}><UrlBar path={resId ? `/game/${resId}` : '/'} /></div>
                    <div style={{ marginTop: 9 }}>
                      {resId
                        ? <div key={`g${resId}`} className="fade-step"><GameView id={resId} /><button className="btn-soft" style={{ marginTop: 10 }} onClick={() => setResId(null)}>{tr({ uz: '← Bosh sahifa', ru: '← Главная' })}</button></div>
                        : <><HomeView onOpen={setResId} /><p className="small" style={{ color: T.accent, fontStyle: 'italic', margin: '8px 0 0' }}>{tr({ uz: "O'yin kartochkasini bosing — o'yin sahifasiga o'tadi (qayta yuklanmaydi).", ru: 'Нажмите на карточку игры — откроется её страница (без перезагрузки).' })}</p></>}
                    </div>
                  </div>
                ) : (
                  <div className="fade-step">
                    <NavMenu active={cur.id === 't2' ? '/add' : '/'} />
                    <div style={{ marginTop: 9 }}><UrlBar path={cur.id === 't2' ? '/add' : '/'} /></div>
                    <div style={{ marginTop: 9 }}><PageView path={cur.id === 't2' ? '/add' : '/'} gameId={1} /></div>
                  </div>
                )
              ) : (
                <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{tr({ uz: 'Buyruq bering va rejani tasdiqlang…', ru: 'Дайте команду и подтвердите план…' })}</p>
              )}
            </Win>
            {done
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Kodni o'qing: route'lar ro'yxatga mos, <span className="mono">{'<Link>'}</span> ishlatilgan, manzilga <span className="mono">id</span> qo'shilgan. Agent ishini <b>tekshirib</b> qabul qildingiz.</>, ru: <>Прочитайте код: route соответствуют списку, использован <span className="mono">{'<Link>'}</span>, в адрес добавлен <span className="mono">id</span>. Вы приняли работу агента, <b>проверив</b> её.</> })}</p></div>
              : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr({ uz: "Natija shu yerda paydo bo'ladi — keyin uni o'zingiz tekshirasiz.", ru: 'Результат появится здесь — потом вы сами его проверите.' })}</p>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — useNavigate (qo'shgandan keyin Bosh'ga qaytish) =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [phase, setPhase] = useState(storedAnswer ? 3 : 0); // 0 forma, 1 POST, 2 navigate, 3 bosh
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const done = phase >= 3;
  useEffect(() => () => clearTimeout(timer.current), []);
  const save = () => {
    if (running) return;
    clearTimeout(timer.current); setRunning(true); setPhase(1);
    timer.current = setTimeout(() => {
      setPhase(2);
      timer.current = setTimeout(() => { setPhase(3); setRunning(false); }, 800);
    }, 850);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow="useNavigate" screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "O'yin qo'shing", ru: 'Добавьте игру' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>"Saqlash" bosilgach, Bosh sahifaga <span className="italic" style={{ color: T.accent }}>kim olib o'tadi</span>?</>, ru: <>После нажатия «Сохранить» <span className="italic" style={{ color: T.accent }}>кто переводит</span> на Главную?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Diqqat qiling: foydalanuvchi hech qanday havolani <b style={{ color: T.ink }}>bosmaydi</b> — u faqat "Saqlash"ni bosadi. Keyin ilova uni <b style={{ color: T.ink }}>o'zi</b> Bosh sahifaga olib o'tishi kerak — yangi o'yinini ko'rsin. Bosadigan havola yo'q, demak <span className="mono">{'<Link>'}</span> ish bermaydi. Bu yerda <b style={{ color: T.ink }}>kodning o'zi</b> sahifani almashtiradi: <span className="mono">useNavigate()</span>.</>, ru: <>Обратите внимание: пользователь <b style={{ color: T.ink }}>не нажимает</b> никакую ссылку — он нажимает только «Сохранить». Дальше приложение <b style={{ color: T.ink }}>само</b> должно перевести его на Главную — пусть увидит свою новую игру. Ссылки для нажатия нет, значит <span className="mono">{'<Link>'}</span> не сработает. Здесь страницу меняет <b style={{ color: T.ink }}>сам код</b>: <span className="mono">useNavigate()</span>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Qo'shish sahifasi (/add)", ru: 'Страница «Добавить» (/add)' })}</p>
            <Win title="robo-games.uz" minH={140}>
              <UrlBar path={phase >= 3 ? '/' : '/add'} />
              <div style={{ marginTop: 9 }}>
                {phase >= 3
                  ? <div className="fade-step"><p style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 12.5, color: T.success, margin: '0 0 7px' }}>{tr({ uz: "✓ Bosh sahifa — yangi o'yin qo'shildi!", ru: '✓ Главная — новая игра добавлена!' })}</p><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}><RoCard name="Adopt Me!" /><RoCard name="Doors" /><RoCard name="Robo Race" emoji="🤖" likes={100} bg="linear-gradient(135deg,#F0C9B4,#D8A184)" /></div></div>
                  : <AddView />}
              </div>
            </Win>
            {phase < 3 && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={save} disabled={running}>{running ? tr({ uz: 'Saqlanmoqda…', ru: 'Сохраняем…' }) : tr({ uz: '💾 Saqlash', ru: '💾 Сохранить' })}</button>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Kod va konsol', ru: 'Код и консоль' })}</p>
            <pre className="code-box fade-up delay-1" style={{ lineHeight: 1.9 }}>
              <Jx>{'const'}</Jx>{' navigate = useNavigate();'}{'\n\n'}
              <Jx>{'function'}</Jx>{' saqlash() {'}{'\n'}
              <span style={{ background: running && phase === 1 ? 'rgba(255,79,40,0.18)' : 'transparent', borderRadius: 5, padding: '0 4px' }}>{'  '}fetch(url, {'{ '}<At>method</At>: <St>'POST'</St>{' }'});  <Cm>{'// qo\'shildi'}</Cm></span>{'\n'}
              <span style={{ background: phase >= 2 ? 'rgba(31,122,77,0.14)' : 'transparent', borderRadius: 5, padding: '0 4px' }}>{'  '}navigate(<St>'/'</St>);  <Cm>{'// Bosh\'ga qaytaramiz'}</Cm></span>{'\n'}
              {'}'}
            </pre>
            <div className="code-box" style={{ padding: '9px 13px', minHeight: 56 }}>
              {phase === 0 && <TLine out={<span style={{ color: CODE.comment, fontStyle: 'italic' }}>{tr({ uz: '"Saqlash" tugmasini bosing…', ru: 'Нажмите кнопку «Сохранить»…' })}</span>} />}
              {phase >= 1 && <TLine out={<span className="el-in" style={{ display: 'inline-block' }}><span style={{ color: T.success, fontWeight: 700 }}>POST</span> /games → <span style={{ color: CODE.str }}>201 Created</span></span>} />}
              {phase >= 2 && <TLine out={<span className="el-in" style={{ display: 'inline-block' }}>navigate(<span style={{ color: CODE.str }}>'/'</span>) → <span style={{ color: CODE.str }}>{tr({ uz: 'Bosh sahifa ochildi ✓', ru: 'Главная открыта ✓' })}</span></span>} />}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>useNavigate()</b> — tugma bosilgani kabi hodisadan keyin <b>kod orqali</b> sahifa almashtirish. <span className="mono">{'<Link>'}</span> — bosish uchun, <span className="mono">navigate()</span> — kod ichida.</>, ru: <><b>useNavigate()</b> — смена страницы <b>через код</b> после события, например нажатия кнопки. <span className="mono">{'<Link>'}</span> — для нажатия, <span className="mono">navigate()</span> — внутри кода.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — AMALIYOT: O'Z SAHIFANGIZ =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const POOL = [
    { path: '/top', page: tr({ uz: "TOP o'yinlar", ru: 'ТОП игры' }), icon: '🔥' },
    { path: '/sevimli', page: tr({ uz: 'Sevimlilar', ru: 'Избранное' }), icon: '⭐' },
    { path: '/about', page: tr({ uz: 'Men haqimda', ru: 'Обо мне' }), icon: '👤' }
  ];
  const [added, setAdded] = useState(storedAnswer ? POOL[0] : null);
  const [visited, setVisited] = useState(!!storedAnswer);
  const done = !!added && visited;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const baseNav = ['/', '/game/:id', '/add'];
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot · o'z sahifangiz", ru: 'Практика · ваша страница' })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (!added ? tr({ uz: 'Sahifa tanlang', ru: 'Выберите страницу' }) : tr({ uz: 'Sahifani oching', ru: 'Откройте страницу' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi o'zingiz: ilovaga <span className="italic" style={{ color: T.accent }}>yangi sahifa</span> qo'shing.</>, ru: <>Теперь сами: добавьте в приложение <span className="italic" style={{ color: T.accent }}>новую страницу</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Quruvchi sifatida sinab ko'ring. Bitta yangi sahifa tanlang — u <b style={{ color: T.ink }}>ro'yxatga</b> (yangi <span className="mono">{'<Route>'}</span>) va <b style={{ color: T.ink }}>menyuga</b> (yangi <span className="mono">{'<Link>'}</span>) qo'shiladi. Keyin menyudan o'sha sahifani oching.</>, ru: <>Попробуйте себя в роли строителя. Выберите одну новую страницу — она добавится <b style={{ color: T.ink }}>в список</b> (новый <span className="mono">{'<Route>'}</span>) и <b style={{ color: T.ink }}>в меню</b> (новый <span className="mono">{'<Link>'}</span>). Затем откройте её из меню.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Qaysi sahifani qo'shamiz?", ru: 'Какую страницу добавим?' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {POOL.map(p => <button key={p.path} className={`chip ${added?.path === p.path ? 'chip-on' : ''}`} onClick={() => { setAdded(p); setVisited(false); }}>{p.icon} {p.page}</button>)}
            </div>
            <pre className="code-box fade-up delay-2" style={{ lineHeight: 1.85 }}>
              <Jx>{'<Routes>'}</Jx>{'\n'}
              <Cm>{'  // mavjud 3 route…'}</Cm>{'\n'}
              {added
                ? <span className="el-in" style={{ display: 'inline-block', background: 'rgba(31,122,77,0.13)', borderRadius: 5, padding: '0 4px' }}>{'  '}<Jx>{'<Route '}</Jx><At>path</At>=<St>"{added.path}"</St> <At>element</At>{`={<${added.path === '/about' ? 'About' : (added.path === '/top' ? 'TopPage' : 'FavPage')} />}`}<Jx>{' />'}</Jx>{'  '}<Cm>{'// + yangi'}</Cm></span>
                : <Cm>{'  // sahifa tanlang…'}</Cm>}
              {'\n'}<Jx>{'</Routes>'}</Jx>
            </pre>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Ilova', ru: 'Приложение' })} {added && !visited ? tr({ uz: '— menyudan yangi sahifani oching', ru: '— откройте новую страницу из меню' }) : ''}</p>
            <Win title="robo-games.uz" minH={140}>
              <div className="navmenu" style={{ marginBottom: 9 }}>
                {[...baseNav.map(p => ROUTES.find(r => r.path === p)), added].filter(Boolean).map(r => (
                  <button key={r.path} className={`navlink ${visited && added && r.path === added.path ? 'on' : (!added || r.path !== added.path ? '' : '')}`} onClick={added && r.path === added.path ? () => setVisited(true) : undefined} style={added && r.path === added.path ? { boxShadow: `inset 0 0 0 1.5px ${T.accent}` } : undefined}>{r.icon} {tr(r.page)}</button>
                ))}
              </div>
              <UrlBar path={visited && added ? added.path : '/'} />
              <div style={{ marginTop: 10 }}>
                {visited && added
                  ? <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 0' }}><span style={{ fontSize: 34 }}>{added.icon}</span><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 17, color: T.ink, margin: 0 }}>{tr(added.page)}</p><p className="small" style={{ color: T.ink3, margin: 0 }}>{tr({ uz: 'sizning yangi sahifangiz', ru: 'ваша новая страница' })}</p></div>
                  : <HomeView />}
              </div>
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mana shunday! Yangi sahifa = bitta <span className="mono">{'<Route>'}</span> + bitta <span className="mono">{'<Link>'}</span>. Ilovangiz endi 4 sahifali — va siz uni o'zingiz kengaytirdingiz.</>, ru: <>Вот так! Новая страница = один <span className="mono">{'<Route>'}</span> + один <span className="mono">{'<Link>'}</span>. Теперь в вашем приложении 4 страницы — и расширили его вы сами.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TEST 4 (useNavigate stsenariy) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} idx={12} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText={tr({ uz: "Forma saqlangach, o'quvchini avtomatik Bosh sahifaga qaytarish kerak. Nima ishlatamiz?", ru: 'После сохранения формы нужно автоматически вернуть ученика на Главную. Что используем?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>"Saqlash" bosilgach, <span className="italic" style={{ color: T.accent }}>kod orqali</span> Bosh sahifaga qaytarish — nima bilan?</>, ru: <>После нажатия «Сохранить» вернуть на Главную <span className="italic" style={{ color: T.accent }}>через код</span> — чем?</> })}</h2></>}
    options={[tr({ uz: '<a href="/"> havolasi', ru: 'Ссылкой <a href="/">' }), tr({ uz: 'useNavigate() hook', ru: 'Хуком useNavigate()' }), tr({ uz: '<Link to="/"> tugmasi', ru: 'Кнопкой <Link to="/">' }), tr({ uz: 'fetch("/") so\'rovi', ru: 'Запросом fetch("/")' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! Foydalanuvchi hech narsa bosmaydi — saqlashdan keyin KOD o'zi sahifani almashtiradi. Buning yo'li: useNavigate() → navigate('/').", ru: 'Верно! Пользователь ничего не нажимает — после сохранения страницу меняет САМ код. Путь такой: useNavigate() → navigate(\'/\').' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — <a> sahifani qayta yuklaydi va bu havola, kod emas. Bizga kod ichida o'tish kerak.", ru: 'Нет — <a> перезагружает страницу, и это ссылка, а не код. Нам нужен переход внутри кода.' }),
      2: tr({ uz: "<Link> — foydalanuvchi BOSADIGAN havola. Bu yerda hech kim bosmaydi; kod o'zi o'tkazadi.", ru: '<Link> — ссылка, которую НАЖИМАЕТ пользователь. Здесь никто не нажимает; переводит сам код.' }),
      3: tr({ uz: "fetch — serverga so'rov. U sahifani almashtirmaydi. Sahifa almashtirish — navigate().", ru: 'fetch — запрос на сервер. Он не меняет страницу. Смена страницы — navigate().' }),
      default: tr({ uz: "Hodisadan keyin kod orqali o'tish = useNavigate() → navigate('/').", ru: 'Переход через код после события = useNavigate() → navigate(\'/\').' })
    }} />
);

// ===== SCREEN 13 — DEBUGGING (a href → Link) — reusable DebugChallenge =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  const LINES = [
    { text: `<Link to="/">${tr({ uz: 'Bosh', ru: 'Главная' })}</Link>` },
    { text: `<a href="/add">${tr({ uz: "Qo'shish", ru: 'Добавить' })}</a>`, bug: true },
    { text: `<Link to="/game/1">${tr({ uz: "O'yin", ru: 'Игра' })}</Link>` },
  ];
  const solve = () => { if (done) return; setDone(true); onAnswer(screen, { correct: true, picked: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Debugging', ru: 'Дебаггинг' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Xatoni toping', ru: 'Найдите ошибку' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI yordam beradi — siz esa <span className="italic" style={{ color: T.accent }}>tekshirasiz</span>.</>, ru: <>AI помогает — а <span className="italic" style={{ color: T.accent }}>проверяете</span> вы.</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI menyuni bir zumda yozib berdi — lekin "Qo'shish"ni bosganda ilova <b style={{ color: T.ink }}>oqarib, qayta yuklanyapti</b>! Holat ham yo'qoladi. <b style={{ color: T.ink }}>Odamlar ham, AI ham</b> ba'zan adashadi. Endi siz Router qoidasini bilasiz — qaysi qator <span className="mono">{'<Link>'}</span> emas? Toping va bosing.</>, ru: <>AI мгновенно написал меню — но при нажатии «Добавить» приложение <b style={{ color: T.ink }}>белеет и перезагружается</b>! Состояние тоже теряется. <b style={{ color: T.ink }}>И люди, и AI</b> иногда ошибаются. Вы уже знаете правило Router — какая строка не <span className="mono">{'<Link>'}</span>? Найдите и нажмите.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: 'Menyu havolalarini yozdim:', ru: 'Я написал ссылки меню:' })}</span></div>
            <DebugChallenge
              lines={LINES}
              fixed={`<Link to="/add">${tr({ uz: "Qo'shish", ru: 'Добавить' })}</Link>`}
              explain={tr({ uz: "<a href> brauzerni butun sahifani qayta yuklashga majbur qiladi. Router'da doim <Link to> ishlatiladi — u qayta yuklamaydi.", ru: '<a href> заставляет браузер перезагрузить всю страницу. В Router всегда используют <Link to> — он не перезагружает.' })}
              onSolved={solve}
            />
          </Col>
          <Col>
            {!done
              ? <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Ikkitasi <span className="mono">{'<Link>'}</span>, bittasi boshqacha. Qayta yuklash — <span className="mono" style={{ color: T.ink }}>{'<a href>'}</span> ning belgisi. Qaysi qator shunga zid?</>, ru: <>Две строки — <span className="mono">{'<Link>'}</span>, одна — другая. Перезагрузка — признак <span className="mono" style={{ color: T.ink }}>{'<a href>'}</span>. Какая строка нарушает правило?</> })}</p></div>
              : (<>
                  <Win title="robo-games.uz"><div><NavMenu active="/add" /><div style={{ marginTop: 9 }}><UrlBar path="/add" /></div><div style={{ marginTop: 9 }}><AddView /></div></div></Win>
                </>)}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ============================================================
// 🧩 QAYTA ISHLATILADIGAN INTERAKTIVLAR + V18 QATLAMLAR (ReactFirstComponentLesson etalonidan)
// ============================================================

// 🧲 Qayta ishlatiladigan DRAG-DROP TARTIB — bo'laklarni to'g'ri slotga sudrash (harakat sifati → ✨ Animatsiya).
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
            {sid ? <button className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{byId[sid].label}</button> : <span className="dd-hint">{hints ? hints[i] : tr({ uz: 'bu yerga joylang', ru: 'положите сюда' })}</span>}
          </div>
        ))}
      </div>
      <div className="dd-pool">
        {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: 'Порядок неверный — нажмите на блок, верните его и разложите заново' })}</span>}
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{byId[id].label}</button>)}
      </div>
      {solved && <div className="dd-done">{tr({ uz: "✓ To'g'ri! Har manzil o'z sahifasiga ulandi.", ru: '✓ Верно! Каждый адрес соединён со своей страницей.' })}</div>}
      {wrong && !solved && <div className="dd-wrong">{tr({ uz: '⚠️ Tartib xato — qayta joylang.', ru: '⚠️ Порядок неверный — разложите заново.' })}</div>}
    </div>
  );
}

// 🐞 Qayta ishlatiladigan DEBUG CHALLENGE — buzuq koddan xato qatorni topib bosish → tuzatiladi.
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
        ? <p className="dbg-hint">{tr({ uz: '👆 Xato bor qatorni toping va bosing', ru: '👆 Найдите строку с ошибкой и нажмите' })}</p>
        : <div className="dbg-ok">{tr({ uz: '✓ Topdingiz!', ru: '✓ Нашли!' })} {explain}</div>}
    </div>
  );
}

// 🃏 Qayta ishlatiladigan FLASHCARDS — aktiv takrorlash (3D flip → ✨ Animatsiya, KONTENT → 🎓 Metodist).
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
  const knew = () => advance(true);
  const again = () => advance(false);
  const restart = () => { setQueue(cards.map((_, i) => i)); setKnown(0); setFlipped(false); };
  if (!card) return (
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'atama yodlandi', ru: 'терминов выучено' })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda", ru: '↻ Учится' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })} · <b>{known}</b></span></div>
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

// ===== 🛠️ JONLI PRAKTIKA (reusable) — o'quvchi VS Code'da bajaradi, ustoz kuzatadi =====
// signal zonasi: <100 test · 100+ arena · 500+ praktika (to'qnashmaydi).
const PRACTICE_BASE = 500;
const MentorPracticeStats = ({ live, screen, label }) => {
  const [data, setData] = useState(null);
  const pin = live && live.pin;
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(pin), liveAnswers(pin, PRACTICE_BASE + screen)]);
        if (on) setData({ players, rows });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [pin, live && live.mode, screen]);
  if (!live || live.mode !== 'mentor') return null;
  // Bo'sh apparat ko'rsatilmaydi: 0% to'lgan progress-bar va «shu yerda chiqadi» matni joy
  // egallaydi, lekin hech narsa o'rgatmaydi. Birinchi o'quvchi qo'shilgach panel o'zi paydo
  // bo'ladi (har 3 s da yangilanadi) — F-0819-57, PmLesson8:836 dan.
  if (!data || data.players.length === 0) return null;
  const total = data ? data.players.length : 0;
  const doneIds = data ? new Set(data.rows.map(r => r.player_id)) : new Set();
  const doers = data ? data.players.filter(p => doneIds.has(p.id)) : [];
  const waiting = data ? data.players.filter(p => !doneIds.has(p.id)) : [];
  const allIn = total > 0 && doers.length >= total;
  return (
    <div className="lp-mstats mstats fade-up">
      <div className="mstats-head">
        <span className="mstats-lbl">{tr(label || { uz: '👀 Kim bajardi', ru: '👀 Кто выполнил' })}</span>
        <span className="mstats-n">{total ? (allIn ? tr({ uz: '✓ Hamma bajardi', ru: '✓ Все выполнили' }) : <>{tr({ uz: 'Bajardi:', ru: 'Выполнили:' })} <b>{doers.length}</b> / {total}</>) : tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ожидаем учеников…' })}</span>
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((doers.length / total) * 100) : 0}%` }} /></div>
      {doers.length > 0 && <div className="mstats-waitrow"><span className="mstats-wait-lbl" style={{ color: T.success }}>{tr({ uz: '✅ Bajardi:', ru: '✅ Выполнили:' })}</span>{doers.slice(0, 12).map(p => <span key={p.id} className="mstats-wait-chip" style={{ color: T.success, background: T.successSoft }}>{p.nickname}</span>)}{doers.length > 12 && <span className="mstats-wait-chip more">+{doers.length - 12}</span>}</div>}
      {waiting.length > 0 && <div className="mstats-waitrow"><span className="mstats-wait-lbl">{tr({ uz: '⏳ Kutilmoqda:', ru: '⏳ Ожидаем:' })}</span>{waiting.slice(0, 12).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}{waiting.length > 12 && <span className="mstats-wait-chip more">+{waiting.length - 12}</span>}</div>}
      {total === 0 && <p className="mstats-wait">{tr({ uz: "Jonli darsda bajargan o'quvchilar shu yerda chiqadi.", ru: 'На живом уроке выполнившие ученики появятся здесь.' })}</p>}
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
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); // JONLI: praktika bajarildi signali (500+ zona)
  };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={(done || isMentor) ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{isMentor ? tr({ uz: <>O'quvchilar topshiriqni <b style={{ color: T.ink }}>VS Code'da</b> bajarmoqda. Nechtasi tugatgani pastda ko'rinadi — hamma tayyor bo'lgach davom eting.</>, ru: <>Ученики выполняют задание <b style={{ color: T.ink }}>в VS Code</b>. Сколько закончили — видно ниже; продолжайте, когда будут готовы все.</> }) : tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Выполняйте шаги и отмечайте их. Когда закончите, нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — наставник следит за прогрессом.</> })}</Mentor>
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
// Link+useParams praktikasi (s9 case'dan keyin, idx 12) — Router o'rnatilgach kartochkadan sahifaga (<Link> + useParams)
const ScreenPracticeCard = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "Kartochkadan o'yin sahifasiga", ru: 'С карточки — на страницу игры' }}
    statsLabel={{ uz: '🔗 Sahifaga ulaganlar', ru: '🔗 Связали со страницей' }}
    task={{ uz: "Bosh sahifadagi o'yin kartochkalarini bosilganda o'yin sahifasiga (/game/:id) o'tadigan qiling. Kartani <Link> ichiga oling, GamePage'da useParams() bilan id ni o'qing.", ru: 'Сделайте так, чтобы нажатие на карточку игры на Главной вело на страницу игры (/game/:id). Оберните карточку в <Link>, а в GamePage прочитайте id через useParams().' }}
    checklist={[
      { uz: "Bosh sahifada har kartochkani `<Link to={'/game/' + g.id}>` ichiga oling", ru: "На Главной оберните каждую карточку в `<Link to={'/game/' + g.id}>`" },
      { uz: "`GamePage`da `const { id } = useParams()` bilan id ni o'qing", ru: 'В `GamePage` прочитайте id через `const { id } = useParams()`' },
      { uz: "Saqlang — kartochka bosilganda o'yin sahifasi ochilsinmi?", ru: 'Сохраните — открывается ли страница игры при нажатии на карточку?' },
    ]} />
);
// Router o'rnatish praktikasi (s7'dan keyin, idx 9 — BIRINCHI amaliyot) — npm i + BrowserRouter + 3 Route + menyu
const ScreenPracticeRouter = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "Routerni o'rnating", ru: 'Установите Router' }}
    statsLabel={{ uz: "🌀 Router o'rnatganlar", ru: '🌀 Установили Router' }}
    task={{ uz: "VS Code'da robo-games loyihangizga React Router'ni o'rnating va 3 sahifani ulang: Bosh (/), O'yin (/game/:id), Qo'shish (/add). Tepada menyu bo'lsin.", ru: 'В VS Code установите React Router в свой проект robo-games и подключите 3 страницы: Главная (/), Игра (/game/:id), Добавить (/add). Сверху пусть будет меню.' }}
    checklist={[
      { uz: "Terminalda: `npm i react-router-dom` — kutubxonani o'rnating", ru: 'В терминале: `npm i react-router-dom` — установите библиотеку' },
      { uz: "`main.jsx`da ilovani `<BrowserRouter>` ichiga oling", ru: 'В `main.jsx` оберните приложение в `<BrowserRouter>`' },
      { uz: "`App.jsx`da `<Routes>` ichida 3 ta `<Route>`: `/`, `/game/:id`, `/add`", ru: 'В `App.jsx` внутри `<Routes>` — 3 `<Route>`: `/`, `/game/:id`, `/add`' },
      { uz: "Tepaga `<Link>` menyu qo'shing — 3 sahifaga havola", ru: 'Добавьте сверху меню из `<Link>` — ссылки на 3 страницы' },
    ]} />
);
// sp3 (s14'dan oldin) — yakuniy integratsiya (useNavigate bilan saqlab qaytish)
const ScreenPracticeFinal = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: 'Yakuniy integratsiya', ru: 'Финальная интеграция' }}
    statsLabel={{ uz: "↩️ Qaytarishni qo'shganlar", ru: '↩️ Добавили возврат' }}
    task={{ uz: "«Qo'shish» formasini yakunlang: yangi o'yin saqlangach, useNavigate() bilan o'quvchini avtomatik Bosh sahifaga qaytaring.", ru: 'Завершите форму «Добавить»: после сохранения новой игры автоматически верните ученика на Главную с помощью useNavigate().' }}
    checklist={[
      { uz: "`/add` formasiga `const navigate = useNavigate()` qo'shing", ru: 'Добавьте в форму `/add` строку `const navigate = useNavigate()`' },
      { uz: "«Saqlash» bosilganda yangi o'yinni qo'shing (POST)", ru: 'При нажатии «Сохранить» добавьте новую игру (POST)' },
      { uz: "So'ng `navigate('/')` — Bosh sahifaga qaytsin", ru: "Затем `navigate('/')` — пусть вернётся на Главную" },
    ]} />
);

// 🃏 FLASHCARD KARTALARI (front=savol, back=qisqa javob)
const REACT_FLASHCARDS = [
  { front: { uz: "Qaysi manzilda qaysi sahifa ochilishini nima belgilaydi?", ru: 'Что задаёт, какая страница откроется по какому адресу?' }, back: "<Route>", note: { uz: "ichida path va element bor", ru: 'внутри — path и element' } },
  { front: { uz: "Route qatorida manzil qaysi xossaga yoziladi?", ru: 'В какое свойство строки Route пишется адрес?' }, back: "path", note: 'path="/add"' },
  { front: { uz: "Route qatorida ko'rsatiladigan sahifa qaysi xossaga yoziladi?", ru: 'В какое свойство Route пишется показываемая страница?' }, back: "element", note: "element={<AddPage />}" },
  { front: { uz: "Barcha Route qatorlari qaysi tegning ichida turadi?", ru: 'Внутри какого тега стоят все строки Route?' }, back: "<Routes>", note: { uz: "manzilga mos kelganini tanlaydi", ru: 'выбирает подходящую под адрес' } },
  { front: { uz: "React'da bir sahifadan boshqasiga o'tish uchun qaysi teg ishlatiladi?", ru: 'Каким тегом в React переходят с одной страницы на другую?' }, back: "<Link to=\"/add\">", note: { uz: 'sahifa qayta yuklanmaydi — tez', ru: 'страница не перезагружается — быстро' } },
  { front: { uz: "Oddiy <a href> havolasi nega Router'da ishlatilmaydi?", ru: 'Почему обычную ссылку <a href> не используют в Router?' }, back: { uz: "Sahifani qayta yuklaydi", ru: 'Она перезагружает страницу' }, note: { uz: 'butun sahifa qaytadan yig\'iladi — sekin', ru: 'вся страница собирается заново — медленно' } },
  { front: { uz: "/game/:id manzilidagi :id nimani bildiradi?", ru: 'Что означает :id в адресе /game/:id?' }, back: { uz: "O'zgaruvchan joy", ru: 'Переменное место' }, note: "/game/1, /game/4, /game/7 …" },
  { front: { uz: "Manzildagi :id qiymatini sahifa qanday o'qiydi?", ru: 'Как страница читает значение :id из адреса?' }, back: "useParams()", note: "const { id } = useParams()" },
  { front: { uz: "1000 ta o'yin uchun nechta O'yin sahifasi yoziladi?", ru: 'Сколько страниц Игры пишется для 1000 игр?' }, back: { uz: 'Bittasi', ru: 'Одна' }, note: { uz: ":id har o'yinni o'sha sahifada ko'rsatadi", ru: ':id показывает любую игру на той же странице' } },
  { front: { uz: "Saqlagandan keyin kod o'zi Bosh sahifaga o'tsin — nima ishlatasiz?", ru: 'Что вы используете, чтобы код сам перешёл на Главную после сохранения?' }, back: "useNavigate()", note: "const navigate = useNavigate(); navigate('/')" },
  { front: { uz: "Butun ilovani qaysi teg bilan o'raysiz?", ru: 'Каким тегом вы оборачиваете всё приложение?' }, back: "<BrowserRouter>", note: { uz: "main.jsx da eng tashqi teg", ru: 'в main.jsx — самый внешний тег' } },
  { front: { uz: "Router kutubxonasini qaysi buyruq o'rnatadi?", ru: 'Какая команда устанавливает библиотеку Router?' }, back: "npm i react-router-dom", note: { uz: "terminalda bir marta yoziladi", ru: 'пишется в терминале один раз' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={REACT_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== 🏅 ACHIEVEMENTS (nishonlar) — dars davomidagi REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  builder:  { icon: '🧱', name: 'Router Built!', desc: { uz: "AI bilan Router'ni qurdingiz", ru: 'Вы построили Router вместе с AI' } },
  debugger: { icon: '🐞', name: 'Nice Catch!',  desc: { uz: 'AI kodidagi <a>→<Link> xatosini tuzatdingiz', ru: 'Вы исправили ошибку <a>→<Link> в коде AI' } },
  router:   { icon: '🗺️', name: 'Route Master!', desc: { uz: "Route qatorini o'zingiz yozdingiz", ru: 'Вы сами написали строку Route' } },
  graduate: { icon: '🏆', name: 'Level Up!',     desc: { uz: "Router praktikasini to'liq yakunladingiz", ru: 'Вы полностью завершили практику Router' } },
};
// Ekran id → nishon (recordAnswer'da, faqat REAL solve bilan: qurish / debug challenge / final)
const ACH_TRIGGERS = { s9: 'builder', s13: 'debugger', s14: 'router' };
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
const Q_LABELS = { 4: "1 — Route", 6: "2 — Link vs a", 10: { uz: "3 — :id parametr", ru: '3 — параметр :id' }, 15: "4 — useNavigate", 18: { uz: "5 — Yakuniy amaliy", ru: '5 — Финальное задание' } };

// ===== ⚡ CODE STRIKE — CTA kapsulasi (arena STRUKTURASINI ⚡ Jonli quradi; bu yerda faqat wordmark + CSS) =====
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si (Route / Link / :id / useParams / useNavigate / Routes)
const QZ_BG_SHAPES = [
  { ch: '<Route',      l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: '<Link>',      l: 84, t: 7,  s: 30, d: 23, dl: 1.5 },
  { ch: ':id',         l: 8,  t: 72, s: 32, d: 27, dl: 0.8 },
  { ch: 'useParams',   l: 77, t: 68, s: 28, d: 21, dl: 2.2 },
  { ch: '⚛',           l: 44, t: 86, s: 40, d: 25, dl: 1.1 },
  { ch: 'useNavigate', l: 60, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: '<Routes>',    l: 24, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: 'path="/"',    l: 55, t: 5,  s: 26, d: 22, dl: 0.6 },
  { ch: 'navigate',    l: 89, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '/game/:id',   l: 2,  t: 45, s: 22, d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: "`Route` nima vazifasini bajaradi?", ru: 'Какую задачу выполняет `Route`?' }, opts: [{ uz: "Manzilni sahifaga bog'laydi", ru: 'Связывает адрес со страницей' }, { uz: 'Rasmlarni ekranga chizadi', ru: 'Рисует картинки на экране' }, { uz: "Serverga so'rov yuboradi", ru: 'Отправляет запрос на сервер' }, { uz: "Ma'lumotni bazaga saqlaydi", ru: 'Сохраняет данные в базу' }], correct: 0 },
  { q: { uz: "`<Routes>` o'rami nima ish qiladi?", ru: 'Что делает обёртка `<Routes>`?' }, opts: [{ uz: 'Barcha rasmlarni yuklaydi', ru: 'Загружает все картинки' }, { uz: "URL'ga qarab sahifani tanlaydi", ru: 'Выбирает страницу по URL' }, { uz: "Ma'lumotlarni o'chiradi", ru: 'Удаляет данные' }, { uz: 'Faqat menyuni chizadi', ru: 'Рисует только меню' }], correct: 1 },
  { q: { uz: '`Route`dagi `path` nimani bildiradi?', ru: 'Что означает `path` в `Route`?' }, opts: [{ uz: 'Sahifaning fon rangini', ru: 'Цвет фона страницы' }, { uz: 'Foydalanuvchi ismini', ru: 'Имя пользователя' }, { uz: 'Qaysi manzilda ishlashini', ru: 'На каком адресе работать' }, { uz: 'Fayl hajmini baytlarda', ru: 'Размер файла в байтах' }], correct: 2 },
  { q: { uz: "`Route`dagi `element` nimani ko'rsatadi?", ru: 'На что указывает `element` в `Route`?' }, opts: [{ uz: 'Qaysi serverga ulanishni', ru: 'К какому серверу подключаться' }, { uz: "Ma'lumotlar bazasi nomini", ru: 'Название базы данных' }, { uz: 'Havolaning rang kodini', ru: 'Код цвета ссылки' }, { uz: "Qaysi sahifa ko'rsatilishini", ru: 'Какую страницу показать' }], correct: 3 },
  { q: { uz: '`<Link>` va `<a>` orasidagi asosiy farq nima?', ru: 'В чём главная разница между `<Link>` и `<a>`?' }, opts: [{ uz: '<Link> sahifani qayta yuklamaydi', ru: '<Link> не перезагружает страницу' }, { uz: '<Link> doim sekinroq ishlaydi', ru: '<Link> всегда работает медленнее' }, { uz: "<a> — Router'ning maxsus havolasi", ru: '<a> — специальная ссылка Router' }, { uz: 'Ular butunlay bir xil', ru: 'Они полностью одинаковые' }], correct: 0 },
  { q: { uz: 'Oddiy `<a href>` bosilganda nima yuz beradi?', ru: 'Что происходит при нажатии обычного `<a href>`?' }, opts: [{ uz: "Faqat rang o'zgaradi", ru: 'Меняется только цвет' }, { uz: 'Butun sahifa qayta yuklanadi', ru: 'Вся страница перезагружается' }, { uz: "Hech qanday o'zgarish bo'lmaydi", ru: 'Ничего не меняется' }, { uz: "Ilova butunlay o'chadi", ru: 'Приложение полностью выключается' }], correct: 1 },
  { q: { uz: '`/game/:id` manzilidagi `:id` nimani anglatadi?', ru: 'Что означает `:id` в адресе `/game/:id`?' }, opts: [{ uz: "Sahifadagi rasm o'lchamini", ru: 'Размер картинки на странице' }, { uz: "Har doim 7-o'yin raqami", ru: 'Всегда номер игры 7' }, { uz: "O'zgaruvchan o'yin raqami", ru: 'Переменный номер игры' }, { uz: '7 soniyalik kutish vaqti', ru: 'Время ожидания 7 секунд' }], correct: 2 },
  { q: { uz: "URL'dagi `:id` qiymatini qaysi hook o'qiydi?", ru: 'Какой хук читает значение `:id` из URL?' }, opts: ['useState()', 'useEffect()', 'useNavigate()', 'useParams()'], correct: 3 },
  { q: { uz: '`useNavigate()` hook nimaga kerak?', ru: 'Для чего нужен хук `useNavigate()`?' }, opts: [{ uz: 'Kod orqali sahifa ochishga', ru: 'Открывать страницу через код' }, { uz: "Ma'lumot yuklab olishga", ru: 'Скачивать данные' }, { uz: "Ranglarni o'zgartirishga", ru: 'Менять цвета' }, { uz: 'Rasmlarni yuklab olishga', ru: 'Скачивать картинки' }], correct: 0 },
  { q: { uz: 'POST bilan saqlagandan keyin Bosh sahifaga qanday qaytamiz?', ru: 'Как вернуться на Главную после сохранения через POST?' }, opts: [{ uz: "<a href='/'> bosib", ru: "Нажав <a href='/'>" }, { uz: "navigate('/') chaqirib", ru: "Вызвав navigate('/')" }, { uz: 'Sahifani yangilab', ru: 'Обновив страницу' }, { uz: "Serverni o'chirib", ru: 'Выключив сервер' }], correct: 1 },
  { q: { uz: 'SPA (Single Page App) nimasi bilan ajralib turadi?', ru: 'Чем выделяется SPA (Single Page App)?' }, opts: [{ uz: 'Faqat bitta rasmdan iborat', ru: 'Состоит из одной картинки' }, { uz: 'Internetsiz ishlaydi', ru: 'Работает без интернета' }, { uz: 'Sahifa qayta yuklanmaydi', ru: 'Страница не перезагружается' }, { uz: 'Faqat bitta tugmasi bor', ru: 'У него только одна кнопка' }], correct: 2 },
  { q: { uz: "Ilovani Router bilan o'rash uchun `main.jsx`da nima ishlatiladi?", ru: 'Что используется в `main.jsx`, чтобы обернуть приложение в Router?' }, opts: ['<Routes>', '<Link>', 'useParams()', '<BrowserRouter>'], correct: 3 },
];
const INLINE_KEYS = { s4: 0, s5b: 1, s8: 0, s12: 1, s14: -1, practice: -1 }; // scored ekranlar correctIdx'idan 1:1 (s14 final — sentinel -1)
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

const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
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
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['Route', 'Link', 'useParams', 'navigate', '⚛', 'path', 'Routes', ':id'];
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
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚡ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nПотом можно вернуться ровно к этому месту через «⚡ Продолжить».\n\nВсё равно закрыть?' }))) return;
    }
    onClose();
  };

  return (
    <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => (
          <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c || 'rgba(190,150,255,0.16)', animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>
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
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Быстрее нажали верно — больше баллов. Верные ответы подряд дают 🔥 бонус!' })}</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ожидаем учеников…' })}</span>}
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Будьте быстрее! ⏱' })}</span>}
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
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'самый длинный streak' })} 🔥x${soloScore.maxStreak}` : ''}</p>
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
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{myRank + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</b> · {board[myRank].pts} {tr({ uz: 'ball', ru: 'баллов' })}</p>}
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{myIdx + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</b> ({board[myIdx].okCount}/{totalQ} {tr({ uz: "to'g'ri", ru: 'верно' })})</p>}
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

// ===== SCREEN 14 — YAKUNIY (VS Code: <Route path="/add" element={<AddPage />} />) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [value, setValue] = useState(storedAnswer?.picked || '');
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const norm = value.replace(/\s+/g, ' ').trim();
  const valid = /^<\s*Route\s+path\s*=\s*"\/add"\s+element\s*=\s*\{\s*<\s*AddPage\s*\/?\s*>\s*\}\s*\/?\s*>$/.test(norm);
  const hasRoute = /<\s*Route\b/.test(value);
  const hasLowerRoute = /<\s*route\b/i.test(value) && !hasRoute;
  const hasPath = /path\s*=\s*"\/add"/.test(value);
  const hasElement = /element\s*=\s*\{\s*<\s*AddPage\s*\/?\s*>\s*\}/.test(value);
  useEffect(() => {
    if (valid && !passed) {
      setPassed(true);
      onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'VS Code: <Route path="/add" element={<AddPage />} /> ni yozing', studentAnswer: value, correct: true, firstAttemptCorrect: true, solved: true, picked: value });
    }
  }, [valid]);
  const Ln = ({ n, children }) => (
    <div className="vsc-line"><span className="vsc-ln">{n}</span><span style={{ whiteSpace: 'pre' }}>{children}</span></div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Route qatorini yozing', ru: 'Напишите строку Route' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: <span className="italic" style={{ color: T.accent }}>Qo'shish</span> sahifasini ro'yxatga ulang.</>, ru: <>Последний шаг: подключите к списку страницу <span className="italic" style={{ color: T.accent }}>«Добавить»</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>VS Code'da <span className="mono">App.jsx</span> ochiq: Bosh va O'yin route'lari tayyor — faqat <b style={{ color: T.ink }}>4-qator bo'sh</b>. <span className="mono">/add</span> manzilini <span className="mono">AddPage</span> sahifasiga bog'lang: <b style={{ color: T.ink }}>{'<Route'}</b> + <b style={{ color: T.ink }}>path="/add"</b> + <b style={{ color: T.ink }}>element={'{<AddPage />}'}</b> + <b style={{ color: T.ink }}>{'/>'}</b>.</>, ru: <>В VS Code открыт <span className="mono">App.jsx</span>: route для Главной и Игры готовы — пуста только <b style={{ color: T.ink }}>строка 4</b>. Свяжите адрес <span className="mono">/add</span> со страницей <span className="mono">AddPage</span>: <b style={{ color: T.ink }}>{'<Route'}</b> + <b style={{ color: T.ink }}>path="/add"</b> + <b style={{ color: T.ink }}>element={'{<AddPage />}'}</b> + <b style={{ color: T.ink }}>{'/>'}</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="vsc fade-up delay-2">
              <div className="vsc-bar">
                <span className="vsc-tab on"><span style={{ color: '#61DAFB' }}>⚛</span> App.jsx <span style={{ color: '#6E7681', marginLeft: 4 }}>×</span></span>
                <span className="vsc-tab">Home.jsx</span>
              </div>
              <div className="vsc-body">
                <Ln n={1}><Jx>{'<Routes>'}</Jx></Ln>
                <Ln n={2}>{'  '}<Jx>{'<Route '}</Jx><At>path</At>=<St>"/"</St> <At>element</At>{'={<Home />}'}<Jx>{' />'}</Jx></Ln>
                <Ln n={3}>{'  '}<Jx>{'<Route '}</Jx><At>path</At>=<St>"/game/:id"</St> <At>element</At>{'={<GamePage />}'}<Jx>{' />'}</Jx></Ln>
                <div className="vsc-line">
                  <span className="vsc-ln">4</span>
                  <span style={{ whiteSpace: 'pre' }}>{'  '}</span>
                  <input className={`vsc-input ${valid ? 'ok' : ''}`} value={value} onChange={e => setValue(e.target.value)} placeholder='<Route path="/add" element={<AddPage />} />' spellCheck={false} autoCapitalize="off" autoCorrect="off" />
                </div>
                <Ln n={5}><Jx>{'</Routes>'}</Jx></Ln>
              </div>
            </div>
            <div className="fade-up delay-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tagpill" style={{ opacity: hasRoute ? 1 : 0.4 }}>{hasRoute ? '✓' : '1'} {'<Route'}</span>
              <span className="tagpill" style={{ opacity: hasPath ? 1 : 0.4 }}>{hasPath ? '✓' : '2'} path="/add"</span>
              <span className="tagpill" style={{ opacity: hasElement ? 1 : 0.4 }}>{hasElement ? '✓' : '3'} element={'{<AddPage />}'}</span>
            </div>
            {hasLowerRoute && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Teg nomi <b>Katta harf</b> bilan: <span className="mono">{'<Route'}</span>.</>, ru: <>Имя тега — с <b>Большой буквы</b>: <span className="mono">{'<Route'}</span>.</> })}</p></div>}
            {passed && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Mukammal! Endi <span className="mono">/add</span> ochilganda Router AddPage'ni ko'rsatadi. Ilovangiz to'liq ko'p sahifali — sizning qo'lingizda.</>, ru: <>✓ Превосходно! Теперь при открытии <span className="mono">/add</span> Router показывает AddPage. Ваше приложение полностью многостраничное — и оно в ваших руках.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija — robo-games.uz', ru: 'результат — robo-games.uz' })}</p>
            <Win title="robo-games.uz" minH={140}>
              {valid
                ? <div className="fade-step"><NavMenu active="/add" /><div style={{ marginTop: 9 }}><UrlBar path="/add" /></div><div style={{ marginTop: 9 }}><AddView /></div></div>
                : <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>{tr({ uz: <>4-qator yozilmaguncha <span className="mono" style={{ fontStyle: 'normal' }}>/add</span> sahifasi ulanmagan: <span className="mono" style={{ fontStyle: 'normal' }}>{'<Route'}</span> + <span className="mono" style={{ fontStyle: 'normal' }}>path</span> + <span className="mono" style={{ fontStyle: 'normal' }}>element</span></>, ru: <>Пока строка 4 не написана, страница <span className="mono" style={{ fontStyle: 'normal' }}>/add</span> не подключена: <span className="mono" style={{ fontStyle: 'normal' }}>{'<Route'}</span> + <span className="mono" style={{ fontStyle: 'normal' }}>path</span> + <span className="mono" style={{ fontStyle: 'normal' }}>element</span></> })}</p>}
            </Win>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — YAKUN =====
const Screen15 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  // F-0803-08: uyga vazifa kapsulasi — bosilganda topshiriq kartasi ochiladi
  const [hwOpen, setHwOpen] = useState(false);
  const [hwCharge, setHwCharge] = useState(false);
  const fireHw = () => { if (hwCharge || hwOpen) return; setHwCharge(true); setTimeout(() => { setHwOpen(true); setHwCharge(false); }, 500); };
  const _gate = useContext(LiveGateCtx) || {};
  const _live = _gate.live;
  const isMentorL = _live && _live.mode === 'mentor';
  const [arena, setArena] = useState(false);
  const isStudentL = _live && _live.mode === 'student';
  const quizSt = (_live && _live.quiz && _live.quiz.state) || 'off';
  const studentWait = isStudentL && quizSt === 'off';
  const studentLive = isStudentL && quizSt !== 'off';
  // ⚡ Jonli: CodeStrike arena to'liq ulangan — CTA bosilganda QuizArena ochiladi (mentor lobby / student jonli / self solo).
  const openArena = () => setArena(true);
  const RECAP = [
    tr({ uz: 'Route = manzil → sahifa: <Route path="/add" element={<AddPage />} />', ru: 'Route = адрес → страница: <Route path="/add" element={<AddPage />} />' }),
    tr({ uz: "<Routes> URL'ga qarab qaysi sahifani ko'rsatishni tanlaydi", ru: '<Routes> по URL выбирает, какую страницу показать' }),
    tr({ uz: '<Link to> qayta yuklamaydi — <a href> esa yuklaydi', ru: '<Link to> не перезагружает — а <a href> перезагружает' }),
    tr({ uz: "URL parametr /game/:id — bitta sahifa, barcha o'yinlar (useParams)", ru: 'URL-параметр /game/:id — одна страница, все игры (useParams)' }),
    tr({ uz: "useNavigate() — kod orqali sahifa almashtirish (POST'dan keyin Bosh'ga)", ru: 'useNavigate() — смена страницы через код (после POST — на Главную)' })
  ];
  const HOMEWORK = [
    { b: tr({ uz: "Sahifalar ro'yxati", ru: 'Список страниц' }), t: tr({ uz: "— o'z loyihangiz uchun 3-4 sahifa ro'yxatini qog'ozga yozing", ru: '— напишите на бумаге список из 3-4 страниц для своего проекта' }) },
    { b: tr({ uz: 'AI bilan quring', ru: 'Постройте с AI' }), t: tr({ uz: "— Antigravity'ga Router'ni o'rnatib, sahifalar va menyuni qurishni buyuring", ru: '— поручите Antigravity установить Router и построить страницы с меню' }) },
    { b: tr({ uz: 'Tekshiring', ru: 'Проверьте' }), t: tr({ uz: "— hamma havola <Link>mi, /game/:id parametri bormi — o'zingiz nazorat qiling", ru: '— все ли ссылки <Link>, есть ли параметр /game/:id — проконтролируйте сами' }) }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Praktika tugadi', ru: 'Практика завершена' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Ko'p sahifali ilovangiz <span className="italic" style={{ color: T.accent }}>tayyor</span>.</>, ru: <>Ваше многостраничное приложение <span className="italic" style={{ color: T.accent }}>готово</span>.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={_live} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul></div>
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Antigravity bilan o'z loyihangizda sinang:", ru: 'Попробуйте в своём проекте с Antigravity:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>))}</ul><p className="hw-note">{tr({ uz: "Keyingi qadam — loyiha kuni: React + API + CRUD + Router'ni birlashtirib, o'z ilovangizni boshidan oxirigacha qurasiz! 🚀", ru: 'Следующий шаг — день проекта: объедините React + API + CRUD + Router и постройте своё приложение от начала до конца! 🚀' })}</p></div>}
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

// ============================================================ LESSON ROOT
export default function ReactRouterPracticeLesson({ lang: langProp, onFinished }) {
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
  // 🃏 Flashcard ekrani jonli darsda (mentor boshqaruvida) o'quvchida yashiriladi — JONLI roli flashHidden'ni ulaydi
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat REAL solve)
    if (_m && _m.scored && _m.scope === 'final' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0); // yakuniy amaliy — serverga
  };
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen7, ScreenPracticeRouter, Screen8, Screen9, ScreenPracticeCard, Screen10, Screen11, Screen12, Screen13, ScreenPracticeFinal, Screen14, ScreenPodium, ScreenFlashcards, Screen15];
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

        /* === PRAKTIKA · ROUTER CSS === */
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
        /* Brauzer URL paneli + navigatsiya menyusi */
        .url-bar { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; padding: 5px 10px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; }
        .url-bar .u-path { color: ${T.accent}; font-weight: 700; }
        .navmenu { display: flex; gap: 6px; flex-wrap: wrap; }
        .navlink { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; padding: 5px 11px; border-radius: 99px; border: none; background: ${T.bg}; color: ${T.ink}; cursor: pointer; transition: all 0.15s; }
        .navlink.on { background: ${T.accent}; color: #fff; }
        .navlink:hover:not(.on) { background: #EFEBE3; }
        /* Route xaritasi qatori */
        .routerow { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 11px; transition: all 0.3s; }
        /* Sahifa qayta yuklanishi (flash + spinner) */
        @keyframes pageflash { 0% { opacity: 0; } 15% { opacity: 1; } 100% { opacity: 0; } }
        .page-flash { position: absolute; inset: 0; background: #fff; z-index: 5; animation: pageflash 1s ease-out forwards; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 22px; height: 22px; border: 3px solid rgba(0,0,0,0.12); border-top-color: ${T.accent}; border-radius: 50%; animation: spin 0.7s linear infinite; }
        /* Silkinish (xato tanlov) */
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

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* === 🌐 WARP-XARITA (ROBO-WORLD) — harakat sifati → ✨ Animatsiya, ranglar → 🎨 Dizayn === */
        .warp { display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border-radius: 16px; padding: 12px; box-shadow: 0 14px 34px -14px rgba(${T.shadowBase},0.20); }
        .warp-hud { display: flex; align-items: center; gap: 8px; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 10px; padding: 7px 12px; }
        .warp-dot { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 8px -1px var(--wz,${T.accent}); flex-shrink: 0; }
        .warp-coord { font-size: 12px; color: ${T.ink2}; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .warp-coord b { font-weight: 800; }
        .warp-live { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 800; letter-spacing: .14em; color: ${T.success}; background: ${T.successSoft}; border: 1px solid rgba(31,122,77,.32); border-radius: 99px; padding: 2px 7px; flex-shrink: 0; }
        .warp-scene { position: relative; min-height: 168px; border-radius: 13px; background: radial-gradient(120% 120% at 50% 0%, #EDF1FC, ${T.bg} 62%); box-shadow: inset 0 0 0 1px ${T.line}; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .warp-center { display: flex; flex-direction: column; align-items: center; gap: 7px; animation: warp-in .42s cubic-bezier(.34,1.3,.4,1); padding: 16px; }
        @keyframes warp-in { from { opacity: 0; transform: scale(.9); } to { opacity: 1; transform: none; } }
        .warp-center.warping { animation: warp-out .46s ease forwards; }
        @keyframes warp-out { 60% { opacity: .3; filter: blur(2px); } 100% { opacity: 0; transform: scale(1.12); } }
        .warp-zap { position: absolute; inset: 0; z-index: 4; pointer-events: none; background: radial-gradient(42% 42% at 50% 47%, transparent 30%, var(--wz,#7EA6F4) 44%, transparent 66%); animation: warp-zap .46s ease-out forwards; }
        @keyframes warp-zap { 0% { opacity: 0; transform: scale(.45); } 26% { opacity: .9; transform: scale(.9); } 50% { opacity: .28; transform: scale(1.08); } 68% { opacity: .7; } 100% { opacity: 0; transform: scale(1.45); } }
        .warp-zoneicon { width: 58px; height: 58px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 30px; box-shadow: 0 0 0 3px ${T.paper}, 0 0 0 5px var(--wz,${T.accent}), 0 10px 24px -8px rgba(${T.shadowBase},0.38); }
        .warp-robot { font-size: 24px; margin-top: -6px; animation: warp-bob 2.4s ease-in-out infinite; }
        @keyframes warp-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .warp-zonename { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 15px; color: ${T.ink}; margin: 0; }
        .warp-dial { display: flex; align-items: center; gap: 8px; margin-top: 3px; }
        .warp-dialbtn { width: 26px; height: 26px; border-radius: 8px; border: none; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; color: ${T.ink}; font-size: 15px; cursor: pointer; transition: all .15s; }
        .warp-dialbtn:hover { background: var(--wz,${T.blue}); color: #fff; box-shadow: none; }
        .warp-dialnum { font-size: 12px; color: ${T.ink2}; }
        .warp-savebtn { margin-top: 4px; border: none; border-radius: 10px; background: ${T.success}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; padding: 8px 14px; cursor: pointer; }
        .warp-flash { position: absolute; inset: 0; z-index: 5; background: #060A12; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; animation: warp-flashin .2s ease; }
        .warp-loadbar { width: 60%; height: 6px; border-radius: 99px; background: rgba(255,255,255,.12); overflow: hidden; }
        .warp-loadbar i { display: block; height: 100%; width: 0; background: linear-gradient(90deg,#7EA6F4,${T.blue}); border-radius: 99px; animation: warp-load 1.1s ease forwards; }
        @keyframes warp-load { to { width: 100%; } }
        @keyframes warp-flashin { from { opacity: 0; } }
        .warp-flash-t { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #9FB4D8; }
        .warp-portals { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
        .warp-portal { display: flex; flex-direction: column; align-items: center; gap: 2px; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 9px 6px; cursor: pointer; transition: all .16s; }
        .warp-portal:hover:not(:disabled) { transform: translateY(-2px); border-color: var(--wz,${T.ink3}); box-shadow: 0 8px 18px -8px rgba(${T.shadowBase},0.30); }
        .warp-portal.on { border-color: var(--wz,${T.accent}); background: ${T.paper}; box-shadow: 0 8px 20px -8px var(--wz,${T.accent}); }
        .warp-portal:disabled { cursor: default; opacity: .8; }
        .warp-portal-ic { font-size: 18px; }
        .warp-portal-l { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; color: ${T.ink}; }
        .warp-portal-p { font-size: 9.5px; color: ${T.ink2}; }
        .warp-portal-bar { width: 20px; height: 3px; border-radius: 99px; background: var(--wz,${T.ink3}); margin-top: 4px; opacity: .5; transition: opacity .16s, width .16s; }
        .warp-portal.on .warp-portal-bar, .warp-portal:hover:not(:disabled) .warp-portal-bar { opacity: 1; width: 30px; }
        .warp-exit { border: 1.5px solid ${T.line}; background: ${T.bg}; border-radius: 12px; padding: 9px; color: ${T.ink2}; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; cursor: pointer; transition: all .16s; }
        .warp-exit:hover:not(:disabled) { background: ${T.paper}; border-color: ${T.ink3}; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.28); }
        .warp-exit:disabled { cursor: default; opacity: .7; }
        .warp-exit-sub { font-weight: 500; font-size: 10.5px; color: ${T.ink2}; }
        .warp-preview { opacity: .96; }
        @media (prefers-reduced-motion: reduce) { .warp-center, .warp-center.warping, .warp-robot, .warp-loadbar i { animation: none !important; } .warp-zap { display: none !important; } }

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }

        /* === 🧲 DRAG-DROP TARTIB (reusable) === */
        .dd { display: flex; flex-direction: column; gap: 13px; }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; position: relative; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 56px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; transition: border-color .18s, background .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; }
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; }
        .dd-slot.bad { border-color: #E24848; background: #FBE9E9; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        .dd-slotn { width: 26px; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; }
        .dd-hint { color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${T.bg}; position: relative; z-index: 1; }
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
        /* Jonli nishoni xira turadi — kontentdan diqqat tortmasin; ustiga borilganda ochiladi. */
        .live-badge { opacity: 0.62; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }

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
        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        {live.mode === 'choosing'
          ? <LiveGate live={live} title={tr({ uz: 'React Router praktikasi', ru: 'Практика React Router' })} />
          : (<div className="lesson-root">
          <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
          <LiveBadge live={live} total={TOTAL_SCREENS} />
          {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
        </div>)}
      </LiveGateCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>
  );
}
