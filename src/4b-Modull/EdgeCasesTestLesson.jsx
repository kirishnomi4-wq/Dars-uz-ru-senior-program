import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// LOYIHANI TESTLASH MODULI (4b) · DARS 2 — EDGE CASES VA ERROR PATH — PLATFORM STANDARD v18 (AUDIOSIZ)
// Maqsad: o'quvchi happy path'dan tashqari chegara holatlar (0, manfiy), noto'g'ri ma'lumot (NaN) va
//         exception'larni (toThrow) sinashni o'rganadi.
// Davomi: Dars 1 (Jest asoslari) — o'sha orderTotal funksiyasi. Endi u himoyasiz ekani ko'rsatiladi,
//         guard (throw) qo'shiladi va sinaladi.
// Metafora: funksiya = MASHINA + JESTBOT = robot-sinovchi va ETALON KARTOCHKASI (Dars 1'dan davom).
//   Bu darsga xos: SHUMTAKA — mashinaga g'alati buyruq beradigan mijoz (masalan −5 ta kitob buyurib,
//   qaytim so'raydi). Chekka holatlar = shumtakaning kutilmagan buyruqlari. Bola shumtakani o'zi
//   o'ynaydi: mashinaga g'alati kirish beradi, mashina yiqiladi, keyin himoya (guard) yozib mustahkamlaydi.
// Funksiya rivoji: orderTotal(price, quantity) → if (typeof quantity !== 'number' || quantity <= 0) throw new Error(...).
// Yangi: expect(() => ...).toThrow(), boundary (1 vs 0), invalid data, error path → 400 (Modul 05 DTO bilan bog'lanish).
// JONLI: useLiveSession + INLINE_KEYS + QUIZ_BANK (CodeStrike arena) + Podium + Flashcards + Badges.
// PRAKTIKA: VS Code'da bajariladi — kod darslikka KIRITILMAYDI («✅ Bajardim» + mentor-gate).
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA',
  danger: '#C2362B', dangerSoft: '#FAE3E0', amber: '#B45309', jest: '#99425B',
  line: '#E9E6DF',
  shadowBase: '58, 53, 48'
};
// CODE.ok / CODE.err — terminal ichidagi SEMANTIK ranglar (yashil = o'tgan test, qizil = yiqilgan test).
// T.success/T.danger qog'oz fonga mo'ljallangan (to'q) — qora terminalda o'qilmaydi, shuning uchun yorug' juftlik.
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8', ok: '#7DD181', err: '#FF8A7A' };

// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};

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
    <button onClick={() => { setRole('mentor'); setCode(''); }} title={tr({ uz: 'Mentor', ru: 'Ментор' })} aria-label={tr({ uz: 'Mentor', ru: 'Ментор' })} style={{ position: 'absolute', bottom: 10, right: 12, background: 'none', border: 'none', fontSize: 16, opacity: 0.3, cursor: 'pointer', lineHeight: 1, padding: 4 }}>🧑‍🏫</button>
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
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "🔓 O'quvchilar erkin qilindi", ru: '🔓 Ученики отпущены — свободный режим' })}</div>;
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

// Analytics-payload matnlari UZ-etalon bo'lib qoladi ({uz,ru} obyektdan uz'ni oladi)
const ou = (o) => (o && o.uz) || o;

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


const LESSON_META = { lessonId: 'edge-cases-04b-02-v18', lessonTitle: { uz: 'Edge cases va error path', ru: 'Граничные случаи и обработка ошибок' } };
const HW_TOKENS = [
  { t: { uz: 'amaliyot', ru: 'практика' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'loyiha', ru: 'проект' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'mashq', ru: 'упражнение' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'natija', ru: 'результат' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',       type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',       type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',       type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',       type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',       type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',       type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',       type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',       type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',       type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',       type: 'challenge',   template: 'custom',   scored: false, scope: null },   // guard funksiyasini yig'ish (DragDrop)
  { id: 's10',      type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11',      type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's12',      type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's13',      type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's14',      type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's15',      type: 'challenge',   template: 'custom',   scored: false, scope: null },   // haqiqiy edge testlarni tanlash (PickLines)
  { id: 's16',      type: 'test',        template: 'custom',   scored: true,  scope: 'final' }, // etalon kartochkasi — boundary
  { id: 'practice', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards',  template: 'custom',   scored: false, scope: null },
  { id: 's17',      type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

const Split = ({ children }) => <div className="split">{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

// 🏅 Yuqori paneldagi nishon hisoblagichi (Stage chrome)
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
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic;
  const padH = isMobile ? 12 : 60; // layout standarti: 1100px + 60px
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); }, [screen]);
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
    const tgt = e.target;
    if (tgt && tgt.closest && tgt.closest('.mentor')) return;
    setMCollapsed(true);
    const isControl = tgt && tgt.closest && tgt.closest('button, input, a, .vcard, .option, .hook-option, .pick-row, .dd-chip, .dd-slot');
    if (!isControl) {
      const el = contentRef.current;
      if (el) setTimeout(() => { if (el) el.scrollTo({ top: 0, behavior: 'smooth' }); }, 80);
    }
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
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Дождитесь ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(label))}</button>;
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
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// JONLI javob kaliti — inline testlar (⚡ Jonli roli qiymatlarni tekshiradi).
// final (s16) va practice: -1 — bu ekranlar o'z signalini alohida yuboradi.
const INLINE_KEYS = { s4: 2, s8: 1, s11: 3, s14: 0, s16: 1, practice: -1 };
// 📖 Qayta tushuntirish kartalari (skelet — matnni 🎓 Metodist sayqallaydi)
const RECAPS = {
  4: {
    title: { uz: 'Edge case — chegaradagi qiymat', ru: 'Edge case — значение на границе' },
    cards: [
      { ic: '🎭', h: { uz: 'Shumtaka mijoz', ru: 'Клиент-озорник' }, body: { uz: <>Har mijoz to'g'ri kiritmaydi — kimdir <b>0 ta</b>, kimdir <b>manfiy</b> buyurtma beradi.</>, ru: <>Не каждый клиент вводит данные как надо — кто-то закажет <b>0 штук</b>, а кто-то <b>минус</b>.</> } },
      { ic: '📐', h: { uz: 'Chegara', ru: 'Граница' }, body: { uz: <>Edge case — oddiylikning <b>chetidagi</b> qiymati: 0, manfiy, juda katta.</>, ru: <>Edge case — значение <b>на краю</b> обычного: 0, отрицательное, слишком большое.</> } },
      { ic: '🕳️', h: { uz: 'Xato shu yerda yashiringan', ru: 'Ошибка прячется именно тут' }, body: { uz: <>Himoyasiz funksiya chegarada <b>jim ravishda noto'g'ri</b> javob beradi.</>, ru: <>Функция без защиты на границе <b>молча выдаёт неверный</b> ответ.</> }, ask: { uz: 'Edge case nima?', ru: 'Что такое edge case?' } }
    ]
  },
  8: {
    title: { uz: "expect(() => ...).toThrow() — xato tashlashni sinash", ru: 'expect(() => ...).toThrow() — проверяем выброс ошибки' },
    cards: [
      { ic: '🧯', h: { uz: "() => bilan o'rash", ru: 'Оборачиваем в () =>' }, body: { uz: <>Xato tashlaydigan funksiyani <span className="mono">() =&gt;</span> ichiga o'rab beramiz — shunda Jest uni nazorat ostida chaqiradi.</>, ru: <>Функцию, бросающую ошибку, оборачиваем в <span className="mono">() =&gt;</span> — тогда Jest вызывает её под контролем.</> } },
      { ic: '💥', h: { uz: "O'ramasangiz", ru: 'Если не обернуть' }, body: { uz: <><span className="mono">() =&gt;</span> siz funksiya darrov chaqiriladi va xato tashlab, test o'zi qulaydi.</>, ru: <>Без <span className="mono">() =&gt;</span> функция вызовется сразу, бросит ошибку — и тест рухнет сам.</> } },
      { ic: '✅', h: 'toThrow', body: { uz: <><span className="mono">.toThrow()</span> — funksiya xato tashlaganini tasdiqlaydi.</>, ru: <><span className="mono">.toThrow()</span> — подтверждает, что функция бросила ошибку.</> }, ask: { uz: "Manfiy sonda xatoni qanday sinaymiz?", ru: 'Как проверить ошибку при отрицательном числе?' } }
    ]
  },
  11: {
    title: { uz: 'Happy path VA edge case — ikkalasi ham', ru: 'Happy path И edge case — нужны оба' },
    cards: [
      { ic: '🙂', h: 'Happy path', body: { uz: <>Oddiy, kutilgan kirish — funksiya to'g'ri natija beradi.</>, ru: <>Обычный, ожидаемый ввод — функция выдаёт правильный результат.</> } },
      { ic: '🎭', h: 'Edge case', body: { uz: <>Chegaradagi g'ayrioddiy kirish — 0, manfiy, noto'g'ri tur.</>, ru: <>Необычный ввод на границе — 0, отрицательное число, неверный тип.</> } },
      { ic: '🧩', h: { uz: 'Ikkalasi birga', ru: 'Оба вместе' }, body: { uz: <>Puxta test — <b>happy path</b> va <b>edge case</b>larni birga sinaydi.</>, ru: <>Надёжный тест проверяет и <b>happy path</b>, и <b>edge case</b> — вместе.</> }, ask: { uz: "Nega faqat happy path yetarli emas?", ru: 'Почему одного happy path недостаточно?' } }
    ]
  },
  14: {
    title: { uz: "Faqat edge test tutadigan xato", ru: 'Ошибка, которую ловит только edge-тест' },
    cards: [
      { ic: '🕳️', h: { uz: "Ko'rinmas xato", ru: 'Невидимая ошибка' }, body: { uz: <>Happy-path test yashil bo'lsa ham, chegarada xato <b>sezilmay</b> ishlab ketishi mumkin.</>, ru: <>Даже когда happy-path тест зелёный, ошибка на границе может <b>незаметно</b> работать дальше.</> } },
      { ic: '🚨', h: { uz: 'Edge test tutadi', ru: 'Edge-тест ловит' }, body: { uz: <>Edge test (<span className="mono">toThrow</span>) shu xatoni <b>darhol qizil</b> qilib ko'rsatadi.</>, ru: <>Edge-тест (<span className="mono">toThrow</span>) <b>сразу подсветит</b> эту ошибку красным.</> } },
      { ic: '💰', h: { uz: "Narxi katta", ru: 'Цена высока' }, body: { uz: <>Manfiy buyurtmada "qaytim" — bu <b>haqiqiy pul yo'qotish</b>. Edge test uni oldindan tutadi.</>, ru: <>«Сдача» при отрицательном заказе — это <b>реальная потеря денег</b>. Edge-тест ловит её заранее.</> }, ask: { uz: "Nega faqat happy-path test yetarli emas?", ru: 'Почему одних happy-path тестов недостаточно?' } }
    ]
  },
  16: {
    title: { uz: "Chegara qiymati — eng kichik to'g'ri", ru: 'Граничное значение — наименьшее допустимое' },
    cards: [
      { ic: '📐', h: { uz: "Guard qayerda bo'ladi", ru: 'Где срабатывает guard' }, body: { uz: <>Guard <span className="mono">quantity &lt;= 0</span> bo'lsa xato tashlaydi. Demak eng kichik <b>to'g'ri</b> qiymat — <b>1</b>.</>, ru: <>Guard бросает ошибку, когда <span className="mono">quantity &lt;= 0</span>. Значит, наименьшее <b>допустимое</b> значение — <b>1</b>.</> } },
      { ic: '🧮', h: { uz: 'Etalonni hisoblang', ru: 'Посчитайте эталон' }, body: { uz: <>10000 so'm × 1 dona = <b>10000</b>. Kartochkaga shu son yoziladi — mashina qanday hisoblasa, siz ham shunday hisoblaysiz.</>, ru: <>10000 сумов × 1 штука = <b>10000</b>. Это число и пишем в карточку — считаете так же, как машина.</> } },
      { ic: '🚨', h: { uz: 'Guard eski testni buzadi', ru: 'Guard ломает старый тест' }, body: { uz: <>Guard qo'shilgach, eski <span className="mono">expect(orderTotal(10000, 0)).toBe(0)</span> testi endi <b>QIZIL</b> bo'ladi — funksiya 0 o'rniga xato tashlaydi.</>, ru: <>После guard старый тест <span className="mono">expect(orderTotal(10000, 0)).toBe(0)</span> станет <b>КРАСНЫМ</b> — функция теперь бросает ошибку вместо 0.</> }, ask: { uz: "Nega guard qo'shilgach eski test qizil bo'lib qoladi?", ru: 'Почему после добавления guard старый тест становится красным?' } }
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
        <span className="rc-tag">{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Объясняем ещё раз' })}</span>
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
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi 📨', ru: 'ответили 📨' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и число ✅/❌ пока скрыты — по кнопке «Открыть результат» всё появится сразу и у вас, и на экранах учеников.' })}</p>
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
            {level === 'need' && <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Правильно только у <b>{pct}%</b> — тема осталась классу непонятной. Перед продолжением стоит коротко повторить.</> })}</p>}
            {level === 'maybe' && <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> правильных — неплохо. При желании коротко повторите, прежде чем идти дальше.</> })}</p>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> правильных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — делать выводы по процентам рано. Оцените сами.</> })}</p>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Стоит объяснить ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в прямом эфире…' })}</p>}
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
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
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
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval natijani oching', ru: 'Сначала откройте результат' }) : solved ? { uz: 'Davom etish', ru: 'Продолжить' } : (oneShot ? { uz: 'Javob tanlang', ru: 'Выберите ответ' } : { uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, подумайте перед нажатием!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
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
              ? <>{tr({ uz: "✓ To'g'ri javob:", ru: '✓ Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? <>{tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(tr(explainCorrect))
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете правильный ответ.' })
                : wrongLocked
                  ? fmtCode(tr(explainWrong[picked] ?? explainWrong.default))
                  : solved ? fmtCode(tr(explainCorrect)) : fmtCode(tr(explainWrong[picked] ?? explainWrong.default))}
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue">{tr({ uz: " · ko'rsatmani ochish ▾", ru: ' · открыть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

const Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: 'italic' }}>{children}</span>;

const CodeFile = ({ name, children, minH }) => (
  <div className="editor">
    <div className="editor-bar"><span className="bb-dots"><i /><i /><i /></span><span className="editor-tab">{name}</span></div>
    <div className="editor-body" style={{ minHeight: minH }}><pre className="editor-code">{children}</pre></div>
  </div>
);
const AgentCard = ({ children, title = { uz: "💬 Agentni shunday yo'naltiring", ru: '💬 Направьте агента вот так' } }) => (
  <div className="agent-card"><span className="agent-lbl">{tr(title)}</span><p className="agent-msg">{children}</p></div>
);

// ===== MOCK TERMINAL =====
const Term = ({ title = 'Terminal', children, minH }) => (
  <div className="term"><div className="term-bar"><span className="bb-dots"><i /><i /><i /></span><span className="term-title">{title}</span></div><div className="term-body" style={{ minHeight: minH }}>{children}</div></div>
);
const TLine = ({ cmd, out, col }) => (
  <div className="el-in tline">{cmd ? <><span style={{ color: CODE.str }}>$</span> <span style={{ color: CODE.text }}>{cmd}</span></> : <span style={{ color: col || CODE.comment }}>{out}</span>}</div>
);

// ===== JESTBOT HAKAMI — JEST NATIJA TERMINALI =====
// Bu darsning YURAGI: yassi karta emas, HAQIQIY terminal oynasi —
// oyna-chrome (nuqtalar) + jest brend yorlig'i + hukm chirog'i (yashil ✓ / qizil ✕) + Expected/Received dalili.
// Terminal oynasi: chrome (nuqtalar) + jest brend yorlig'i + hukm chirog'i. tone: 'ok' (yashil) | 'bad' (qizil).
const JestWindow = ({ tone = 'ok', file = 'order.spec.ts', children }) => (
  <div className={`jestrun el-in ${tone}`}>
    <div className="term-bar">
      <span className="bb-dots"><i /><i /><i /></span>
      <span className="jr-brand">jest</span>
      <span className="term-title">{file}</span>
      <span className="jr-lamp" aria-hidden="true" />
    </div>
    <div className="jest">{children}</div>
  </div>
);
const JestRun = ({ status, testName = '2 kitob narxini hisoblaydi', expected = '20000', received = '10002' }) => {
  if (status !== 'pass' && status !== 'fail') return null;
  if (status === 'pass') return (
    <JestWindow tone="ok">
      <div><span className="jest-tag">PASS</span><span className="jest-file"> order.spec.ts</span></div>
      <div className="jest-block"><span style={{ color: CODE.ok }}>✓</span> {testName} <span style={{ color: CODE.comment }}>(3 ms)</span></div>
      <div className="jest-sum">Tests: <b style={{ color: CODE.ok }}>1 passed</b>, 1 total</div>
    </JestWindow>
  );
  return (
    <JestWindow tone="bad">
      <div><span className="jest-tag fail">FAIL</span><span className="jest-file"> order.spec.ts</span></div>
      <div className="jest-block"><span style={{ color: CODE.err }}>✕</span> {testName}</div>
      <div className="jest-diff">
        <span className="jest-diff-row"><b>Expected:</b> <span style={{ color: CODE.ok }}>{expected}</span></span>
        <span className="jest-diff-row"><b>Received:</b> <span style={{ color: CODE.err }}>{received}</span></span>
      </div>
      <div className="jest-sum">Tests: <b style={{ color: CODE.err }}>1 failed</b>, 1 total</div>
    </JestWindow>
  );
};

// ===== PICK LINES =====
const PickLines = ({ fileName, scaffoldTop, scaffoldBottom, candidates, agent, instruction, onComplete, completedInit }) => {
  const correct = candidates.filter(c => c.correct);
  const [picked, setPicked] = useState(() => completedInit ? new Set(correct.map(c => c.id)) : new Set());
  const [shakeId, setShakeId] = useState(null);
  const [why, setWhy] = useState(null);
  const done = correct.every(c => picked.has(c.id));
  const fired = useRef(false);
  useEffect(() => { if (done && !fired.current) { fired.current = true; onComplete && onComplete(); } }, [done]);
  const tap = (c) => {
    if (picked.has(c.id) || done) return;
    if (c.correct) { setPicked(p => { const s = new Set(p); s.add(c.id); return s; }); setWhy(null); }
    else { setShakeId(c.id); setWhy(c.why); setTimeout(() => setShakeId(x => (x === c.id ? null : x)), 450); }
  };
  const pickedCorrect = correct.filter(c => picked.has(c.id));
  return (
    <Zoomable>
    <div className="split">
      <Col>
        <p className="flow-label">{fileName}</p>
        <CodeFile name={fileName} minH={120}>
          {scaffoldTop}{'\n'}
          {pickedCorrect.length === 0
            ? <span className="line-empty">{'    ' + tr({ uz: "// qatorlarni o'ng tomondan tanlang →", ru: '// выберите строки справа →' })}</span>
            : pickedCorrect.map((c, i) => <React.Fragment key={c.id}>{i > 0 ? '\n' : ''}{'    '}{c.node}</React.Fragment>)}
          {'\n'}{scaffoldBottom}
        </CodeFile>
        {agent && <AgentCard>{tr(agent)}</AgentCard>}
      </Col>
      <Col>
        <p className="flow-label">{instruction ? tr(instruction) : tr({ uz: 'Testga tegishli qatorlarni tanlang', ru: 'Выберите строки, относящиеся к тесту' })}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {candidates.map(c => (
            <button key={c.id} className={`pick-row ${picked.has(c.id) ? 'picked' : ''} ${shakeId === c.id ? 'shake' : ''}`} disabled={picked.has(c.id)} onClick={() => tap(c)}>
              <span style={{ flex: 1 }}>{c.label}</span>
              <span className="pick-plus">{picked.has(c.id) ? '✓' : '+'}</span>
            </button>
          ))}
        </div>
        {why && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr(why)}</p></div>}
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: '✓ Test tayyor — chaqirdik va natijani tekshirdik.', ru: '✓ Тест готов — вызвали и проверили результат.' })}</p></div>}
      </Col>
    </div>
    </Zoomable>
  );
};

// ===== ORDER FUNKSIYASI (himoyasiz va mustahkam) =====
const OrderPlain = ({ minH }) => (
  <CodeFile name="order.ts" minH={minH || 90}>
    <Jx>export function</Jx>{' orderTotal(price, quantity) {'}{'\n'}
    {'  '}<Jx>return</Jx>{' price * quantity;'}{'  '}<Cm>{'// himoyasiz'}</Cm>{'\n'}
    {'}'}
  </CodeFile>
);
const OrderGuarded = ({ minH }) => (
  <CodeFile name="order.ts" minH={minH || 130}>
    <Jx>export function</Jx>{' orderTotal(price, quantity) {'}{'\n'}
    {'  '}<Jx>if</Jx>{' ('}<Jx>typeof</Jx>{' quantity !== '}<St>'number'</St>{' || quantity <= 0)'}{'\n'}
    {'    '}<Jx>throw new</Jx>{' Error('}<St>{"'quantity musbat raqam bo'lsin'"}</St>{');'}{'\n'}
    {'  '}<Jx>return</Jx>{' price * quantity;'}{'\n'}
    {'}'}
  </CodeFile>
);

// ===== SCREEN 0 — HOOK: shumtaka mijoz =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const WEIRD = [
    { in: '(10000, 0)', out: '0', note: { uz: "0 so'm — bepul buyurtma!", ru: '0 сумов — бесплатный заказ!' } },
    { in: '(10000, -5)', out: '-50000', note: { uz: "manfiy — do'kon pul to'laydimi?!", ru: 'минус — магазин ещё и доплачивает?!' } }
  ];
  const [seen, setSeen] = useState(storedAnswer ? new Set([0, 1]) : new Set());
  const [active, setActive] = useState(null);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const tried = seen.size >= 1;
  const OPTS = [
    { id: 'a', label: { uz: 'Baribir hisoblab beraversin (hozirgidek)', ru: 'Пусть считает как считает (как сейчас)' } },
    { id: 'b', label: { uz: "Xato (Error) berishi kerak — noto'g'ri buyurtma", ru: 'Должна выдать ошибку (Error) — заказ неверный' } },
    { id: 'c', label: { uz: "Farqi yo'q, hech kim bunday qilmaydi", ru: 'Без разницы — никто так не делает' } }
  ];
  const tap = (i) => { setActive(i); setSeen(prev => { const s = new Set(prev); s.add(i); return s; }); setSc(n => n + 1); };
  const pick = (v) => { if (picked !== null || !tried) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 880 }}>{tr({ uz: <>orderTotal(10000, 2) ishlaydi. Lekin mijoz <span className="italic" style={{ color: T.accent }}>0 ta</span> yoki <span className="italic" style={{ color: T.accent }}>−5 ta</span> buyursa-chi?</>, ru: <>orderTotal(10000, 2) работает. А если клиент закажет <span className="italic" style={{ color: T.accent }}>0 штук</span> или <span className="italic" style={{ color: T.accent }}>−5 штук</span>?</> })}</h1>
        <Mentor>{tr({ uz: <>Dars 1'da funksiyani <b style={{ color: T.ink }}>oddiy</b> kirishda sinadingiz. Lekin haqiqiy do'konda har xil odam bor — kimdir <b style={{ color: T.ink }}>shumtaka</b> mijozdek g'alati narsa kiritadi. Pastdagi "g'alati buyurtma"larni bosib, funksiya nima qaytarishini ko'ring.</>, ru: <>На уроке 1 вы проверяли функцию на <b style={{ color: T.ink }}>обычном</b> вводе. Но в настоящем магазине люди разные — кто-то, как <b style={{ color: T.ink }}>клиент-озорник</b>, введёт что-нибудь странное. Нажимайте на «странные заказы» внизу и смотрите, что вернёт функция.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <OrderPlain />
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {WEIRD.map((w, i) => <button key={i} className={`gchip ${seen.has(i) ? '' : 'tap-hint'}`} onClick={() => tap(i)} style={seen.has(i) ? { boxShadow: `inset 0 0 0 1.5px ${T.danger}`, color: T.danger } : undefined}>orderTotal{w.in}</button>)}
            </div>
            {active !== null && <div className="frame-warn fade-step" key={active}><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Natija:', ru: 'Результат:' })} <b className="mono" style={{ color: T.danger }}>{WEIRD[active].out}</b> — {tr(WEIRD[active].note)}</p></div>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Funksiya bunday kirishga qanday javob berishi kerak?', ru: 'Как функция должна ответить на такой ввод?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null || !tried} style={{ opacity: !tried ? 0.55 : 1 }} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>);
              })}
            </div>
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Avval g'alati buyurtmani sinang ←", ru: 'Сначала попробуйте странный заказ ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Aynan! Happy path (oddiy kirish) yetarli emas. Funksiya <b>noto'g'ri kirishni rad etishi</b> kerak — va biz buni ham <b>sinashimiz</b> kerak. Bugun: edge cases.</>, ru: <>Именно! Happy path (обычного ввода) недостаточно. Функция должна <b>отклонять неверный ввод</b> — и это тоже нужно <b>протестировать</b>. Сегодня: edge cases.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (preview + qadamlar) =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: { uz: "Happy path vs xato yo'li", ru: 'Happy path vs путь ошибки' }, tag: { uz: 'farqi', ru: 'в чём разница' } },
    { text: { uz: 'Chegara holatlar: 0, manfiy', ru: 'Граничные случаи: 0, отрицательные' }, tag: 'edge / boundary' },
    { text: { uz: "Noto'g'ri ma'lumot va exception", ru: 'Неверные данные и exception' }, tag: 'throw' },
    { text: { uz: 'Exceptionni sinash', ru: 'Тестируем exception' }, tag: 'toThrow()' }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const Preview = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Dars oxirida — exceptionni ham sinaysiz', ru: 'К концу урока — протестируете и exception' })}</p>
      <JestRun status="pass" testName="0 ta buyurtmada xato beradi" />
      <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Endi test faqat "to'g'ri ishlaydimi" emas, "<b>noto'g'rini rad etadimi</b>" ni ham tekshiradi.</>, ru: <>Теперь тест проверяет не только «работает ли правильно», но и «<b>отклоняет ли неверное</b>».</> })}</p></div>
    </Col>
  );
  const StepsB = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 4 qadam', ru: '4 шага на сегодня' })}</p>
      <ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span><span className="step-tag">{tr(s.tag)}</span></span></li>))}</ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Test faqat "to'g'ri ishlaydimi" ni tekshiradimi — yoki <span className="italic" style={{ color: T.accent }}>"noto'g'rini rad etadimi"</span> ham?</>, ru: <>Тест проверяет только «работает ли правильно» — или ещё и <span className="italic" style={{ color: T.accent }}>«отклоняет ли неверное»</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yaxshi dasturchi ikkalasini ham sinaydi: oddiy kirish (happy path) <b style={{ color: T.ink }}>va</b> g'alati kirish (edge cases). Mana natija va 4 qadam.</>, ru: <>Хороший разработчик проверяет и то, и другое: обычный ввод (happy path) <b style={{ color: T.ink }}>и</b> странный ввод (edge cases). Вот результат и 4 шага.</> })}</Mentor>
        {!isNarrow ? <Zoomable><Split>{Preview}{StepsB}</Split></Zoomable>
          : !showSteps ? <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{Preview}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "4 qadamni ko'rish", ru: 'Смотреть 4 шага' })}</button></div>
            : <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Natijani ko'rish", ru: '↩ Смотреть результат' })}</button>{StepsB}</div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — HAPPY PATH =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [show, setShow] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = show;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · happy path', ru: 'Понятие · happy path' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Happy path'ni ko'ring", ru: 'Посмотрите happy path' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>"Happy path" — bu <span className="italic" style={{ color: T.accent }}>nima</span>?</>, ru: <>«Happy path» — это <span className="italic" style={{ color: T.accent }}>что</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: T.ink }}>Happy path</b> — hammasi rejadagidek ketadigan oddiy yo'l: mijoz to'g'ri, kutilgan ma'lumot kiritadi (2 ta kitob, 5 ta...). Dars 1'da aynan shuni sinadingiz. Tugmani bosing.</>, ru: <><b style={{ color: T.ink }}>Happy path</b> — обычный путь, где всё идёт по плану: клиент вводит правильные, ожидаемые данные (2 книги, 5...). Именно это вы проверяли на уроке 1. Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name="order.spec.ts" minH={90}>
              <At>it</At>{'('}<St>'2 kitob narxini hisoblaydi'</St>{', () => {'}{'\n'}
              {'  '}<At>expect</At>{'(orderTotal(10000, 2)).'}<At>toBe</At>{'(20000);'}{'\n'}
              {'});'}
            </CodeFile>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} disabled={show} onClick={() => { setShow(true); setSc(n => n + 1); }}>{show ? tr({ uz: "✓ Ko'rdingiz", ru: '✓ Просмотрено' }) : tr({ uz: 'Bu yetarlimi?', ru: 'Этого достаточно?' })}</button>
          </Col>
          <Col>
            <JestRun status={show ? 'pass' : undefined} testName="2 kitob narxini hisoblaydi" />
            {!show && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Tugmani bosing ←', ru: 'Нажмите кнопку ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Yashil! Lekin bu faqat <b>oddiy</b> kirish. Haqiqiy foydalanuvchilar har doim ham "happy" emas — keyingisi: g'alati kirishlar.</>, ru: <>Зелёный! Но это только <b>обычный</b> ввод. Настоящие пользователи не всегда «happy» — дальше: странный ввод.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — EDGE / CHEGARA =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const CASES = [
    { in: '(10000, 0)', out: '0', bad: true, note: { uz: "0 so'm — bepul. Do'kon zarar ko'radi.", ru: '0 сумов — бесплатно. Магазин в убытке.' } },
    { in: '(10000, -5)', out: '-50000', bad: true, note: { uz: 'Manfiy summa — mantiqsiz!', ru: 'Отрицательная сумма — абсурд!' } },
    { in: '(10000, 1)', out: '10000', bad: false, note: { uz: "Bu to'g'ri — eng kichik haqiqiy buyurtma.", ru: 'А это правильно — наименьший настоящий заказ.' } }
  ];
  const [seen, setSeen] = useState(storedAnswer ? new Set([0, 1, 2]) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= CASES.length;
  const tap = (i) => { setActive(i); setSeen(prev => { const s = new Set(prev); s.add(i); return s; }); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · edge', ru: 'Понятие · edge' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Chegaralarni sinang (${seen.size}/3)`, ru: `Проверьте границы (${seen.size}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Funksiya <span className="italic" style={{ color: T.accent }}>chegarada</span> qanday ishlaydi — 0, manfiy, eng kichik?</>, ru: <>Как функция ведёт себя <span className="italic" style={{ color: T.accent }}>на границе</span> — 0, отрицательное, наименьшее?</> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: T.ink }}>Edge case</b> (chegara holati) — oddiylikning chetidagi qiymatlar: 0, manfiy, eng kichik/katta. Himoyasiz funksiya ularda <b style={{ color: T.ink }}>jim ravishda noto'g'ri</b> javob beradi. Har birini bosib ko'ring.</>, ru: <><b style={{ color: T.ink }}>Edge case</b> (граничный случай) — значения на краю обычного: 0, отрицательные, наименьшее/наибольшее. Функция без защиты <b style={{ color: T.ink }}>молча выдаёт на них неверный</b> ответ. Нажмите на каждое.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <OrderPlain />
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {CASES.map((c, i) => <button key={i} className={`gchip ${seen.has(i) ? '' : 'tap-hint'}`} onClick={() => tap(i)} style={seen.has(i) ? { boxShadow: `inset 0 0 0 1.5px ${c.bad ? T.danger : T.success}`, color: c.bad ? T.danger : T.success } : undefined}>orderTotal{c.in}</button>)}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija', ru: 'результат' })}</p>
            {active === null
              ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Chegarani bosing ←', ru: 'Нажмите на границу ←' })}</p></div>
              : <div className={CASES[active].bad ? 'frame-warn fade-step' : 'frame-success fade-step'} key={active}><p className="body mono" style={{ margin: '0 0 5px', color: CASES[active].bad ? T.danger : T.success, fontWeight: 700 }}>{CASES[active].in} → {CASES[active].out}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(CASES[active].note)}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mana muammo: <b>0</b> va <b>manfiy</b>da funksiya jim ravishda noto'g'ri ishlaydi. Lekin <b>1</b> to'g'ri. Demak chegara — 0 bilan 1 orasida.</>, ru: <>Вот и проблема: на <b>0</b> и <b>отрицательных</b> функция молча работает неверно. А <b>1</b> — правильно. Значит, граница проходит между 0 и 1.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    questionText="Edge case (chegara holati) nima?"
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}><span className="italic" style={{ color: T.accent }}>Edge case</span> nima?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите правильный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Что такое <span className="italic" style={{ color: T.accent }}>edge case</span>?</h2></> })}
    options={[
      { uz: "Eng ko'p uchraydigan, dasturchi kutgan oddiy va tipik kirish", ru: 'Самый частый, обычный и типичный ввод, которого ждёт разработчик' },
      { uz: "Faqat hech qachon xato bermaydigan, to'g'ri ishlaydigan kirish", ru: 'Только ввод, который никогда не даёт ошибок и всегда работает' },
      { uz: "Oddiylikning chetidagi qiymat: 0, manfiy, eng kichik yoki katta", ru: 'Значение на краю обычного: 0, отрицательное, наименьшее или наибольшее' },
      { uz: "Funksiyaga berilgan nom yoki uning o'zgaruvchi nomi, xolos", ru: 'Просто имя функции или имя её переменной' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! Edge case — chegaradagi g'ayrioddiy qiymat (0, manfiy, juda katta, bo'sh). Aynan shu yerda xatolar yashiringan bo'ladi.", ru: 'Верно! Edge case — необычное значение на границе (0, отрицательное, слишком большое, пустое). Именно там и прячутся ошибки.' }}
    explainWrong={{
      0: { uz: "Oddiy kirish — bu happy path. Edge case esa chetdagi g'alati qiymatlar.", ru: 'Обычный ввод — это happy path. А edge case — странные значения на краю.' },
      1: { uz: "Aksincha — edge case ko'pincha funksiya noto'g'ri ishlaydigan joy.", ru: 'Наоборот — edge case чаще всего то место, где функция работает неверно.' },
      3: { uz: 'Bu funksiya nomi emas — edge case kirish qiymatining turi.', ru: 'Это не имя функции — edge case описывает тип входного значения.' },
      default: { uz: "Edge case = chegaradagi g'ayrioddiy qiymat (0, manfiy...).", ru: 'Edge case = необычное значение на границе (0, отрицательное...).' }
    }} />
);

// ===== SCREEN 5 — NOTO'G'RI MA'LUMOT (NaN) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const CASES = [
    { in: "(10000, 'ikki')", out: 'NaN', note: { uz: 'NaN = "Not a Number". Jim buzilish — eng xavfli, chunki xato sezilmaydi!', ru: 'NaN = «Not a Number». Тихая поломка — самая опасная: ошибку никто не замечает!' } },
    { in: '(10000, null)', out: '0', note: { uz: "null → 0 ga aylanadi — yana bepul buyurtma!", ru: 'null превращается в 0 — снова бесплатный заказ!' } }
  ];
  const [seen, setSeen] = useState(storedAnswer ? new Set([0, 1]) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= CASES.length;
  const tap = (i) => { setActive(i); setSeen(prev => { const s = new Set(prev); s.add(i); return s; }); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · noto'g'ri ma'lumot", ru: 'Понятие · неверные данные' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Ikkalasini sinang (${seen.size}/2)`, ru: `Проверьте оба (${seen.size}/2)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Mijoz raqam o'rniga <span className="italic" style={{ color: T.accent }}>"ikki"</span> deb yozsa nima bo'ladi?</>, ru: <>Что будет, если клиент вместо числа напишет <span className="italic" style={{ color: T.accent }}>«ikki»</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Foydalanuvchi har doim raqam yubormaydi — matn, bo'sh qiymat (null) kelishi mumkin. Himoyasiz funksiya bunda <b style={{ color: T.ink }}>NaN</b> yoki <b style={{ color: T.ink }}>0</b> beradi — eng yomoni, xato <b style={{ color: T.ink }}>sezilmay</b> qoladi. Sinab ko'ring.</>, ru: <>Пользователь не всегда присылает число — может прийти текст или пустое значение (null). Функция без защиты выдаст <b style={{ color: T.ink }}>NaN</b> или <b style={{ color: T.ink }}>0</b> — и, что хуже всего, ошибка останется <b style={{ color: T.ink }}>незамеченной</b>. Попробуйте.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <OrderPlain />
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {CASES.map((c, i) => <button key={i} className={`gchip ${seen.has(i) ? '' : 'tap-hint'}`} onClick={() => tap(i)} style={seen.has(i) ? { boxShadow: `inset 0 0 0 1.5px ${T.danger}`, color: T.danger } : undefined}>orderTotal{c.in}</button>)}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija', ru: 'результат' })}</p>
            {active === null
              ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Noto'g'ri kirishni bosing ←", ru: 'Нажмите на неверный ввод ←' })}</p></div>
              : <div className="frame-warn fade-step" key={active}><p className="body mono" style={{ margin: '0 0 5px', color: T.danger, fontWeight: 700 }}>{CASES[active].in} → {CASES[active].out}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(CASES[active].note)}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Demak funksiya noto'g'ri kirishni <b>o'zi to'xtatishi</b> kerak. Buni qanday qilamiz? — Keyingi qadam.</>, ru: <>Значит, функция должна <b>сама останавливать</b> неверный ввод. Как это сделать? — Следующий шаг.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — GUARD (throw) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [show, setShow] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = show;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Yechim · throw', ru: 'Решение · throw' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Funksiyani mustahkamlang', ru: 'Укрепите функцию' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Funksiya noto'g'ri kirishni qanday <span className="italic" style={{ color: T.accent }}>rad etadi</span>?</>, ru: <>Как функция <span className="italic" style={{ color: T.accent }}>отклоняет</span> неверный ввод?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Funksiya boshida <b style={{ color: T.ink }}>tekshiruv (guard)</b> qo'yamiz: agar quantity raqam bo'lmasa yoki 0 dan kichik bo'lsa — <span className="mono">throw new Error(...)</span> bilan <b style={{ color: T.ink }}>xato tashlaydi</b> va ishni to'xtatadi. Tugmani bosing.</>, ru: <>В начале функции ставим <b style={{ color: T.ink }}>проверку (guard)</b>: если quantity не число или не больше нуля — функция <b style={{ color: T.ink }}>бросает ошибку</b> через <span className="mono">throw new Error(...)</span> и останавливается. Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            {show ? <OrderGuarded /> : <OrderPlain minH={130} />}
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={show} onClick={() => { setShow(true); setSc(n => n + 1); }}>{show ? tr({ uz: '✓ Mustahkamlandi', ru: '✓ Укреплено' }) : tr({ uz: "🛡️ Guard (throw) qo'shish", ru: '🛡️ Добавить guard (throw)' })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "endi nima bo'ladi", ru: 'что будет теперь' })}</p>
            {!show
              ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Tugmani bosing ←', ru: 'Нажмите кнопку ←' })}</p></div>
              : <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="frame-success" style={{ padding: 12 }}><p className="body mono" style={{ margin: 0, fontSize: 12, color: T.ink }}>orderTotal(10000, 2) → <b style={{ color: T.success }}>20000</b> ✓</p></div>
                <div className="frame-warn" style={{ padding: 12 }}><p className="body mono" style={{ margin: 0, fontSize: 12, color: T.ink }}>{tr({ uz: <>orderTotal(10000, 0) → <b style={{ color: T.danger }}>Error tashlaydi</b> ✋</>, ru: <>orderTotal(10000, 0) → <b style={{ color: T.danger }}>бросает Error</b> ✋</> })}</p></div>
              </div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Endi funksiya kuchli: to'g'ri kirishda hisoblaydi, noto'g'rida xato beradi. Lekin buni <b>qanday sinaymiz</b>? Xato tashlasa, test buzilmaydimi?</>, ru: <>Теперь функция сильная: правильный ввод считает, неверный отклоняет с ошибкой. Но <b>как это протестировать</b>? Если она бросит ошибку — не сломается ли сам тест?</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — toThrow (() => o'rashi) =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [choice, setChoice] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const done = choice === 'b';
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: 'b' }); }, [done]);
  const pick = (v) => { if (choice === 'b') return; setChoice(v); setSc(n => n + 1); };
  return (
    <Stage eyebrow="toThrow" screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "To'g'ri yozuvni tanlang", ru: 'Выберите правильную запись' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Funksiya xato tashlasa — uni qanday <span className="italic" style={{ color: T.accent }}>sinaymiz</span>?</>, ru: <>Функция бросает ошибку — как её <span className="italic" style={{ color: T.accent }}>протестировать</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Xato tashlaydigan funksiyani to'g'ridan-to'g'ri chaqirsangiz, test ham buzilib qoladi. Shuning uchun funksiyani <span className="mono">() =&gt;</span> ichiga o'rab beramiz — Jest uni o'zi chaqiradi va <span className="mono">.toThrow()</span> bilan xato tashlaganini tekshiradi. Qaysi yozuv to'g'ri?</>, ru: <>Вызовете функцию, бросающую ошибку, напрямую — рухнет и сам тест. Поэтому оборачиваем её в <span className="mono">() =&gt;</span> — Jest вызовет её сам и проверит через <span className="mono">.toThrow()</span>, что ошибка брошена. Какая запись правильная?</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <button className={`vcard ${choice === 'a' ? 'shake' : ''}`} onClick={() => pick('a')} disabled={done} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6, boxShadow: choice === 'a' ? `inset 0 0 0 1.5px ${T.danger}` : undefined }}>
              <span className="vlbl">{tr({ uz: '❌ Variant A', ru: '❌ Вариант A' })}</span>
              <span className="agent-msg">expect(orderTotal(10000, 0)).toThrow()</span>
            </button>
            {choice === 'a' && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu yerda <span className="mono">orderTotal(10000, 0)</span> <b>darrov</b> chaqiriladi va xato tashlaydi — expect ushlab ulgurmaydi, test qulaydi. <span className="mono">() =&gt;</span> kerak.</>, ru: <>Здесь <span className="mono">orderTotal(10000, 0)</span> вызывается <b>сразу</b> и бросает ошибку — expect не успевает её поймать, тест падает. Нужен <span className="mono">() =&gt;</span>.</> })}</p></div>}
          </Col>
          <Col>
            <button className="vcard" onClick={() => pick('b')} disabled={done} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6, boxShadow: choice === 'b' ? `inset 0 0 0 1.5px ${T.success}` : undefined }}>
              <span className="vlbl">{tr({ uz: '✅ Variant B', ru: '✅ Вариант B' })}</span>
              <span className="agent-msg">expect(() =&gt; orderTotal(10000, 0)).toThrow()</span>
            </button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ To'g'ri! <span className="mono">() =&gt;</span> funksiyani "o'rab" beradi — Jest uni nazorat ostida chaqiradi va xato chiqqanini ko'rib, testni <b>PASS</b> qiladi.</>, ru: <>✓ Верно! <span className="mono">() =&gt;</span> «оборачивает» функцию — Jest вызывает её под контролем, видит ошибку и ставит тесту <b>PASS</b>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST 2 =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    questionText="Xato tashlashni tekshirish uchun qaysi yozuv to'g'ri?"
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Exceptionni <span className="italic" style={{ color: T.accent }}>qanday</span> sinaymiz?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите правильный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Как <span className="italic" style={{ color: T.accent }}>проверить</span> exception?</h2></> })}
    options={[
      { uz: "expect(orderTotal(10000, 0)).toThrow() — o'ramasdan chaqiradi", ru: 'expect(orderTotal(10000, 0)).toThrow() — вызывает без обёртки' },
      { uz: "expect(() => orderTotal(10000, 0)).toThrow() — o'rab chaqiradi", ru: 'expect(() => orderTotal(10000, 0)).toThrow() — вызывает в обёртке' },
      { uz: 'expect(orderTotal(10000, 0)).toBe(0) — natijani solishtiradi', ru: 'expect(orderTotal(10000, 0)).toBe(0) — сравнивает результат' },
      { uz: "orderTotal(10000, 0).toThrow() — bevosita, expect'siz chaqiradi", ru: 'orderTotal(10000, 0).toThrow() — вызывает напрямую, без expect' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! () => bilan o'raymiz — Jest funksiyani o'zi chaqiradi va xato tashlaganini toThrow bilan tekshiradi.", ru: 'Верно! Оборачиваем в () => — Jest сам вызовет функцию и через toThrow проверит, что она бросила ошибку.' }}
    explainWrong={{
      0: { uz: "() => yo'q — funksiya darrov chaqirilib, xato tashlaydi va test qulaydi. O'rash kerak.", ru: 'Без () => функция вызовется сразу, бросит ошибку — и тест рухнет. Нужна обёртка.' },
      2: { uz: "toBe(0) — bu xatoni emas, qiymatni tekshiradi. Xato uchun toThrow va () => kerak.", ru: 'toBe(0) проверяет значение, а не ошибку. Для ошибки нужны toThrow и () =>.' },
      3: { uz: "Bu noto'g'ri sintaksis — funksiya darrov ishlab xato tashlaydi.", ru: 'Это неверный синтаксис — функция сработает сразу и бросит ошибку.' },
      default: { uz: "To'g'risi — expect(() => ...).toThrow().", ru: 'Правильно так: expect(() => ...).toThrow().' }
    }} />
);


// ===== SCREEN 9 — GUARD FUNKSIYASINI YIG'ISH (pointer DragDrop; HTML5 draggable ISHLATILMAYDI) =====
const DD_SLOTS = [
  { i: 0, want: 'if',     ph: { uz: "🚧 shart — qaysi kirish noto'g'ri?", ru: '🚧 условие — какой ввод неверный?' } },
  { i: 1, want: 'throw',  ph: { uz: "🧯 xato tashlash — funksiyani to'xtatadi", ru: '🧯 бросить ошибку — остановит функцию' } },
  { i: 2, want: 'return', ph: { uz: "✅ to'g'ri hisob — himoyalangan qaytish", ru: '✅ правильный расчёт — защищённый return' } }
];
const DD_CHIPS = [
  { id: 'if',     label: "if (typeof quantity !== 'number' || quantity <= 0)", node: <><Jx>if</Jx>{' ('}<Jx>typeof</Jx>{' quantity !== '}<St>'number'</St>{' || quantity <= 0)'}</> },
  { id: 'throw',  label: "throw new Error('quantity musbat raqam bo'lsin');", node: <><Jx>throw new</Jx>{' Error('}<St>{"'quantity musbat raqam bo'lsin'"}</St>{');'}</> },
  { id: 'return', label: 'return price * quantity;', node: <><Jx>return</Jx>{' price * quantity;'}</> },
  { id: 'log',    label: "console.log('tekshirilmoqda...');", why: { uz: "console.log funksiyani to'xtatmaydi — bu himoya (guard) emas, faqat chiqaradi.", ru: 'console.log не останавливает функцию — это не защита (guard), он просто печатает.' } },
  { id: 'zero',   label: 'return 0;', why: { uz: "Bu shartni tekshirmasdan har doim 0 qaytaradi — guard emas, yana bir xato manbai.", ru: 'Это всегда возвращает 0 без всякой проверки — не guard, а ещё один источник ошибок.' } }
];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const solvedInit = () => ({ if: 0, throw: 1, return: 2 });
  const [placed, setPlaced] = useState(() => (storedAnswer ? solvedInit() : {}));
  const [run, setRun] = useState(null);      // null | 'nothrow' | 'real'
  const [sawPartial, setSawPartial] = useState(!!storedAnswer);
  const [shake, setShake] = useState(null);
  const [why, setWhy] = useState(null);
  const [over, setOver] = useState(null);
  const [sc, setSc] = useState(0);
  const slotRefs = useRef({});
  const has = (id) => placed[id] !== undefined;
  const full = has('if') && has('throw') && has('return');
  const canRun = has('if') && has('return');
  const done = full && run === 'real';
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const drop = (chip, slotIdx) => {
    if (chip.id !== DD_SLOTS[slotIdx].want) {
      setShake(chip.id); setWhy(chip.why || { uz: "Bu blok bu qatorga to'g'ri kelmaydi. Tartib: if → throw → return.", ru: 'Этот блок не подходит к этой строке. Порядок: if → throw → return.' });
      setTimeout(() => setShake(s => (s === chip.id ? null : s)), 460);
      setSc(n => n + 1);
      return false;
    }
    setPlaced(p => ({ ...p, [chip.id]: slotIdx }));
    setWhy(null); setRun(null); setSc(n => n + 1);
    return true;
  };
  // 🖐️ Pointer sudrash — DOM transform (mobil touchda ham ishlaydi)
  const down = (ev, chip) => {
    if (ev.button != null && ev.button !== 0) return;
    ev.preventDefault();
    const el = ev.currentTarget;
    const sx = ev.clientX, sy = ev.clientY;
    let moved = false, hov = null;
    el.style.transition = 'none'; el.style.zIndex = '30'; el.style.willChange = 'transform';
    const clear = () => { el.style.transition = ''; el.style.transform = ''; el.style.zIndex = ''; el.style.willChange = ''; el.classList.remove('drag'); };
    const snapBack = (msq) => { el.classList.remove('drag'); el.style.transition = `transform ${msq}ms cubic-bezier(.34,1.4,.4,1)`; el.style.transform = ''; setTimeout(clear, msq + 30); };
    const hit = (x, y) => {
      let h = null;
      DD_SLOTS.forEach(s => {
        const n = slotRefs.current[s.i]; if (!n) return;
        const r = n.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) h = s.i;
      });
      return h;
    };
    const mv = (e) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 5) { moved = true; el.classList.add('drag'); }
      if (!moved) return;
      el.style.transform = `translate(${dx}px,${dy}px) scale(1.05) rotate(-1.5deg)`;
      const t = hit(e.clientX, e.clientY);
      if (t !== hov) { hov = t; setOver(t); }
    };
    const up = (e) => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
      setOver(null);
      const t = moved ? hit(e.clientX, e.clientY) : null;
      if (!moved) { clear(); const free = DD_SLOTS.find(s => s.want === chip.id && placed[chip.id] === undefined); if (free) drop(chip, free.i); else { setShake(chip.id); setWhy(chip.why || { uz: "Bu blok varaqaga tushmaydi.", ru: 'Этот блок не ложится на лист.' }); setTimeout(() => setShake(s => (s === chip.id ? null : s)), 460); } return; }
      if (t === null || t === undefined) { snapBack(300); return; }
      const okDrop = drop(chip, t);
      snapBack(okDrop ? 180 : 300);
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  };
  const runTests = () => { setRun(has('throw') ? 'real' : 'nothrow'); if (!has('throw')) setSawPartial(true); setSc(n => n + 1); };
  const pool = DD_CHIPS.filter(c => placed[c.id] === undefined);
  const navLabel = done ? { uz: 'Davom etish', ru: 'Продолжить' } : (!full ? { uz: `Guardni yig'ing (${Object.keys(placed).length}/3)`, ru: `Соберите guard (${Object.keys(placed).length}/3)` } : { uz: 'Testni ishga tushiring', ru: 'Запустите тест' });
  return (
    <Stage eyebrow={tr({ uz: "Mashq · guard yig'ish", ru: 'Практика · собираем guard' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Guard funksiyasini <span className="italic" style={{ color: T.accent }}>o'zingiz yig'ing</span>.</>, ru: <>Соберите guard <span className="italic" style={{ color: T.accent }}>своими руками</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bo'sh <span className="mono">order.ts</span>. Bloklarni <b style={{ color: T.ink }}>sudrab</b> (yoki bosib) joyiga qo'ying: shart → xato tashlash → to'g'ri hisob. Yig'ib bo'lgach <span className="mono">npm test</span> bilan "0 ta buyurtmada xato beradi" testini ishga tushiring.</>, ru: <>Пустой <span className="mono">order.ts</span>. <b style={{ color: T.ink }}>Перетащите</b> блоки (или нажмите) на свои места: условие → бросок ошибки → правильный расчёт. Когда соберёте — запустите тест «0 ta buyurtmada xato beradi» командой <span className="mono">npm test</span>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'order.ts — varaqa', ru: 'order.ts — лист' })}</p>
            <div className="dd-sheet">
              <div className="dd-sheet-bar"><span className="bb-dots"><i /><i /><i /></span><span className="editor-tab">order.ts</span></div>
              <div className="dd-sheet-body">
                <div className="dd-tail mono" style={{ paddingLeft: 4, opacity: 0.9 }}><Jx>export function</Jx>{' orderTotal(price, quantity) {'}</div>
                {DD_SLOTS.map(s => {
                  const chip = DD_CHIPS.find(c => placed[c.id] === s.i);
                  return (
                    <div key={s.i} ref={el => (slotRefs.current[s.i] = el)} className={`dd-slot ${chip ? 'filled' : ''} ${over === s.i ? 'over' : ''}`} style={{ marginLeft: 14 + s.i * 8 }}>
                      {chip ? <span className="dd-code settle">{chip.node}</span> : <span className="dd-ph">{tr(s.ph)}</span>}
                    </div>
                  );
                })}
                <div className="dd-tail mono">{'}'}</div>
              </div>
            </div>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={!canRun} onClick={runTests}>▶ npm test</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'bloklar — sudrang', ru: 'блоки — перетаскивайте' })}</p>
            <div className="dd-pool fade-up delay-1">
              {pool.length ? pool.map(c => (
                <div key={c.id} className={`dd-chip ${shake === c.id ? 'shake' : ''}`} onPointerDown={(e) => down(e, c)}>
                  <span className="mono">{c.label}</span>
                </div>
              )) : <span className="small" style={{ color: T.success, fontWeight: 700 }}>{tr({ uz: '✓ Kerakli bloklar joylandi', ru: '✓ Нужные блоки на местах' })}</span>}
            </div>
            {why && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr(why)}</p></div>}
            {run === 'nothrow' && (
              <JestRun status="fail" testName="0 ta buyurtmada xato beradi" expected="funksiya xato tashlashi kerak edi" received="0 qaytardi — xato yo'q" />
            )}
            {run === 'nothrow' && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Lampa <b style={{ color: T.danger }}>qizil</b> — chunki <span className="mono">throw</span> qatori hali yo'q. Shart bor, lekin u hech narsa qilmayapti. Xato tashlash blokini ham qo'ying.</>, ru: <>Лампа <b style={{ color: T.danger }}>красная</b> — строки <span className="mono">throw</span> ещё нет. Условие есть, но оно ничего не делает. Добавьте и блок с броском ошибки.</> })}</p></div>}
            {run === 'real' && <JestRun status="pass" testName="0 ta buyurtmada xato beradi" />}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Endi guard to'liq: shart → xato tashlash → to'g'ri hisob.", ru: 'Теперь guard полный: условие → бросок ошибки → правильный расчёт.' })}{sawPartial ? tr({ uz: " Shartsiz throw ishlamasligini o'z ko'zingiz bilan ko'rdingiz.", ru: ' Вы своими глазами увидели: без throw защита не работает.' }) : ''}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};


// ===== SCREEN 10 — CHEGARA CHIZIG'I (1 vs 0) =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [a, setA] = useState(!!storedAnswer); // 1 sinaldi
  const [b, setB] = useState(!!storedAnswer); // 0 sinaldi
  const [sc, setSc] = useState(0);
  const done = a && b;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · chegara chizig'i", ru: 'Понятие · линия границы' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Ikki tomonni sinang', ru: 'Проверьте обе стороны' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Chegara qayerda — <span className="italic" style={{ color: T.accent }}>1 to'g'ri, 0 noto'g'ri</span>. Ikkalasini sinaymiz.</>, ru: <>Где проходит граница — <span className="italic" style={{ color: T.accent }}>1 верно, 0 неверно</span>. Проверим обе стороны.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Eng muhim joy — chegara chizig'i. <span className="mono">quantity = 1</span> — eng kichik <b style={{ color: T.ink }}>to'g'ri</b> qiymat (PASS bo'lishi kerak). <span className="mono">quantity = 0</span> — birinchi <b style={{ color: T.ink }}>noto'g'ri</b> qiymat (xato berishi kerak). Yaxshi test chegaraning <b>ikki tomonini</b> ham sinaydi.</>, ru: <>Самое важное место — линия границы. <span className="mono">quantity = 1</span> — наименьшее <b style={{ color: T.ink }}>допустимое</b> значение (должен быть PASS). <span className="mono">quantity = 0</span> — первое <b style={{ color: T.ink }}>недопустимое</b> (должна быть ошибка). Хороший тест проверяет <b>обе стороны</b> границы.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name="order.spec.ts" minH={150}>
              <Cm>{'// chegaraning ikki tomoni'}</Cm>{'\n'}
              <At>it</At>{'('}<St>'1 ta buyurtma ishlaydi'</St>{', () => {'}{'\n'}
              {'  '}<At>expect</At>{'(orderTotal(10000, 1)).'}<At>toBe</At>{'(10000);'}{'\n'}
              {'});'}{'\n'}
              <At>it</At>{'('}<St>'0 ta buyurtmada xato beradi'</St>{', () => {'}{'\n'}
              {'  '}<At>expect</At>{'(() => orderTotal(10000, 0)).'}<At>toThrow</At>{'();'}{'\n'}
              {'});'}
            </CodeFile>
          </Col>
          <Col>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn-soft" disabled={a} onClick={() => { setA(true); setSc(n => n + 1); }}>{a ? '✓ 1 → PASS' : tr({ uz: '▶ 1 ni sinash', ru: '▶ Проверить 1' })}</button>
              <button className="btn-soft" disabled={b} onClick={() => { setB(true); setSc(n => n + 1); }}>{b ? tr({ uz: '✓ 0 → xato tutildi', ru: '✓ 0 → ошибка поймана' }) : tr({ uz: '▶ 0 ni sinash', ru: '▶ Проверить 0' })}</button>
            </div>
            {a && <JestRun status="pass" testName="1 ta buyurtma ishlaydi" />}
            {b && <JestRun status="pass" testName="0 ta buyurtmada xato beradi" />}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Ikkalasi ham yashil: 1 to\'g\'ri ishladi, 0 xato berdi (va test buni kutgan edi). Chegara puxta sinaldi.', ru: 'Оба зелёные: 1 отработал правильно, 0 дал ошибку (и тест этого ждал). Граница проверена надёжно.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — TEST 3 =====
const Screen11 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    questionText="orderTotal funksiyasini sinaganda qaysi holatlarni tekshirish kerak?"
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Qaysi holatlarni <span className="italic" style={{ color: T.accent }}>tekshiramiz</span>?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите правильный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Какие случаи <span className="italic" style={{ color: T.accent }}>проверяем</span>?</h2></> })}
    options={[
      { uz: 'Faqat happy path — oddiy va kutilgan, hech qanday muammosiz kirish', ru: 'Только happy path — обычный, ожидаемый ввод без всяких проблем' },
      { uz: 'Faqat eng katta son — boshqa hech qanday holat tekshirilmaydi', ru: 'Только самое большое число — больше ничего не проверяем' },
      { uz: "Hech qaysi holat — funksiya o'zi har doim ishonchli hisoblanadi", ru: 'Никакие — функция и так всегда считается надёжной' },
      { uz: "Happy path VA chegara/noto'g'ri holatlar — ikkalasi birga", ru: 'Happy path И граничные/неверные случаи — вместе' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "To'g'ri! Ikkalasi: oddiy kirish (happy path) VA chegara/noto'g'ri (0, manfiy, matn). Xatolar ko'pincha aynan chegarada yashiringan.", ru: 'Верно! И то, и другое: обычный ввод (happy path) И граничный/неверный (0, отрицательное, текст). Ошибки чаще всего прячутся именно на границе.' }}
    explainWrong={{
      0: { uz: "Faqat happy path yetarli emas — 0, manfiy, noto'g'ri kirishda xato yashiringan bo'ladi.", ru: 'Одного happy path мало — на 0, отрицательных и неверном вводе прячутся ошибки.' },
      1: { uz: "Faqat bitta holat — kam. Happy path va edge case'larni birga sinaymiz.", ru: 'Один случай — мало. Проверяем happy path и edge case вместе.' },
      2: { uz: "Funksiya o'zicha ishonchli emas — aynan shuning uchun test yozamiz.", ru: 'Функция не надёжна сама по себе — именно поэтому мы пишем тесты.' },
      default: { uz: "Happy path VA edge case'larni birga sinash kerak.", ru: 'Нужно проверять happy path И edge case вместе.' }
    }} />
);

// ===== SCREEN 12 — ERROR PATH + API (400) =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [show, setShow] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = show;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow="Error path · API" screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Bog'lanishni ko'ring", ru: 'Посмотрите связь' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Funksiyada <span className="mono" style={{ color: T.accent }}>throw</span> — API'da bu <span className="italic" style={{ color: T.accent }}>nimaga aylanadi</span>?</>, ru: <>В функции <span className="mono" style={{ color: T.accent }}>throw</span> — а <span className="italic" style={{ color: T.accent }}>во что это превращается</span> в API?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Esingizdami — Modul 05'da <b style={{ color: T.ink }}>DTO</b> noto'g'ri ma'lumotni 400 bilan rad etardi. Bu o'sha g'oya: noto'g'ri kirish "error path"dan ketadi. Funksiyada <span className="mono">throw</span>, API'da <span className="mono">@IsNumber</span> → <b style={{ color: T.ink }}>400</b>. Tugmani bosing.</>, ru: <>Помните — в модуле 05 <b style={{ color: T.ink }}>DTO</b> отклонял неверные данные с кодом 400. Это та же идея: неверный ввод уходит по «error path». В функции — <span className="mono">throw</span>, в API — <span className="mono">@IsNumber</span> → <b style={{ color: T.ink }}>400</b>. Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name="create-order.dto.ts" minH={90}>
              <At>@IsNumber</At>{'()  '}<At>@Min</At>{'(1)'}{'\n'}
              {'quantity: '}<St>number</St>{';'}
            </CodeFile>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} disabled={show} onClick={() => { setShow(true); setSc(n => n + 1); }}>{show ? tr({ uz: "✓ Ko'rdingiz", ru: '✓ Просмотрено' }) : '▶ POST /order { quantity: 0 }'}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'API javobi', ru: 'ответ API' })}</p>
            {!show
              ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "So'rovni yuboring ←", ru: 'Отправьте запрос ←' })}</p></div>
              : <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>✗ 400 — Bad Request</p><p className="body mono" style={{ margin: 0, color: T.ink, fontSize: 12 }}>"quantity must not be less than 1"</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bir xil mantiq, ikki qatlam: <b>funksiyada</b> throw (unit-test toThrow bilan tekshiradi), <b>API'da</b> DTO → 400. Ikkalasi ham "error path".</>, ru: <>Одна логика, два слоя: <b>в функции</b> — throw (юнит-тест ловит его через toThrow), <b>в API</b> — DTO → 400. И то, и другое — «error path».</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — PAYOFF: faqat edge-test tutadigan bug =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? 2 : 0); // 0 boshlang'ich, 1 happy-only (bug o'tib ketdi), 2 edge qo'shildi (tutildi)
  const [sc, setSc] = useState(0);
  const done = step >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const go = () => { setStep(s => Math.min(s + 1, 2)); setSc(n => n + 1); };
  return (
    <Stage eyebrow="Payoff · bug" screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Hikoyani ko'ring", ru: 'Посмотрите историю' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Faqat <span className="italic" style={{ color: T.accent }}>edge-test</span> tutadigan xato — qanday qutqaradi?</>, ru: <>Ошибка, которую ловит только <span className="italic" style={{ color: T.accent }}>edge-тест</span>, — как он спасает?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Tasavvur qiling: kimdir <span className="mono">-5</span> ta buyurtma berib, do'kondan <b style={{ color: T.ink }}>50 000 so'm "qaytim"</b> oldi. Agar faqat happy-path test bo'lsa, bu xato sezilmay ishlab ketadi. Hikoyani bosib kuzating.</>, ru: <>Представьте: кто-то заказал <span className="mono">-5</span> книг и получил от магазина <b style={{ color: T.ink }}>50 000 сумов «сдачи»</b>. Будь только happy-path тесты, эта ошибка работала бы незаметно. Нажимайте и следите за историей.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done} onClick={go}>{step === 0 ? tr({ uz: '▶ Faqat happy-path test bilan', ru: '▶ Только с happy-path тестом' }) : (step === 1 ? tr({ uz: "🛡️ Edge testni qo'shish", ru: '🛡️ Добавить edge-тест' }) : tr({ uz: '✓ Tutildi', ru: '✓ Поймана' }))}</button>
            {step >= 1 && <div className={step >= 2 ? 'frame-success fade-step' : 'frame-warn fade-step'}>
              {step === 1
                ? <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Happy-path testlar <b style={{ color: T.success }}>yashil</b> — lekin manfiy buyurtma xatosi <b style={{ color: T.danger }}>sezilmay ishlab ketdi</b>. Pul yo'qotildi!</>, ru: <>Happy-path тесты <b style={{ color: T.success }}>зелёные</b> — но ошибка с отрицательным заказом <b style={{ color: T.danger }}>проскочила незамеченной</b>. Деньги потеряны!</> })}</p>
                : <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Edge test (<span className="mono">toThrow</span>) qo'shildi — endi manfiy buyurtma <b>darhol qizil</b> bo'ladi. Xato mijozgacha yetib bormaydi.</>, ru: <>Edge-тест (<span className="mono">toThrow</span>) добавлен — теперь отрицательный заказ <b>сразу горит красным</b>. Ошибка не дойдёт до клиента.</> })}</p>}
            </div>}
          </Col>
          <Col>
            <p className="flow-label">npm test</p>
            {step === 0 && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Tugmani bosing ←', ru: 'Нажмите кнопку ←' })}</p></div>}
            {step === 1 && <JestRun status="pass" testName="2 kitob narxini hisoblaydi" />}
            {step >= 2 && <JestRun status="fail" testName="manfiy sonda xato beradi" expected="funksiya xato tashlashi kerak edi" received="-50000 qaytardi — xato yo'q" />}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Qizil FAIL — bu yaxshi xabar! Test xatoni <b>siz</b> ko'rar oldidan tutdi. Mana edge case'ning kuchi.</>, ru: <>Красный FAIL — это хорошая новость! Тест поймал ошибку раньше, чем её увидели <b>вы</b>. Вот она, сила edge case.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — TEST 4 =====
const Screen14 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    questionText="Nega faqat happy-path test yetarli emas?"
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Nega faqat <span className="italic" style={{ color: T.accent }}>happy-path</span> yetarli emas?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите правильный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Почему одного <span className="italic" style={{ color: T.accent }}>happy-path</span> недостаточно?</h2></> })}
    options={[
      { uz: "Xatolar ko'pincha edge holatlarda (0, manfiy) yashiringan bo'ladi", ru: 'Ошибки чаще всего прячутся в edge-случаях (0, отрицательные)' },
      { uz: 'Happy path testi odatdagidan biroz sekinroq ishlaydi, xolos', ru: 'Happy-path тест просто работает чуть медленнее обычного' },
      { uz: "Jest happy path'ni sinashni umuman qo'llab-quvvatlamaydi", ru: 'Jest вообще не поддерживает проверку happy path' },
      { uz: 'Edge case yozish shart emas — happy path hammasini qamraydi', ru: 'Edge case писать не нужно — happy path покрывает всё' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "To'g'ri! Oddiy kirish ko'pincha ishlaydi — xatolar chegarada (0, manfiy, noto'g'ri tur) yashiringan. Faqat edge test ularni tutadi.", ru: 'Верно! Обычный ввод чаще всего работает — ошибки прячутся на границе (0, отрицательные, неверный тип). Поймает их только edge-тест.' }}
    explainWrong={{
      1: { uz: "Tezlik masala emas — gap qamrovda: happy path edge xatolarni ko'rmaydi.", ru: 'Дело не в скорости, а в покрытии: happy path не видит ошибок на границе.' },
      2: { uz: "Jest happy path'ni ham, edge'ni ham qo'llaydi. Gap — ikkalasini sinashda.", ru: 'Jest поддерживает и happy path, и edge. Суть в том, чтобы проверять оба.' },
      3: { uz: "Aksincha — edge case eng muhim, chunki xatolar aynan o'sha yerda.", ru: 'Наоборот — edge case важнее всего: ошибки именно там.' },
      default: { uz: "Xatolar edge holatlarda yashiringan — shuning uchun ularni ham sinaymiz.", ru: 'Ошибки прячутся в edge-случаях — поэтому проверяем и их.' }
    }} />
);


// ===== SCREEN 15 — HAQIQIY EDGE TESTLARNI TANLASH (PickLines) =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  const candidates = [
    { id: 'zero', correct: true, label: "it('0 ta xato beradi', () => { expect(() => orderTotal(10000, 0)).toThrow(); })", node: <><At>it</At>{'('}<St>{"'0 ta xato beradi'"}</St>{', () => { '}<At>expect</At>{'(() => orderTotal(10000, 0)).'}<At>toThrow</At>{'(); });'}</> },
    { id: 'neg', correct: true, label: "it('manfiy sonda xato beradi', () => { expect(() => orderTotal(10000, -5)).toThrow(); })", node: <><At>it</At>{'('}<St>{"'manfiy sonda xato beradi'"}</St>{', () => { '}<At>expect</At>{'(() => orderTotal(10000, -5)).'}<At>toThrow</At>{'(); });'}</> },
    { id: 'no-wrap', correct: false, label: "it('0 ta xato beradi', () => { expect(orderTotal(10000, 0)).toThrow(); })", why: { uz: "() => yo'q — funksiya darrov chaqiriladi va xato tashlab, test o'zi qulaydi. O'rash kerak.", ru: 'Нет () => — функция вызовется сразу, бросит ошибку, и тест рухнет сам. Нужна обёртка.' } },
    { id: 'wrong-matcher', correct: false, label: "it('manfiy son', () => { expect(orderTotal(10000, -5)).toBe(-50000); })", why: { uz: "Bu edge xatoni tutmaydi — funksiya hali himoyasiz bo'lsa ham natijani 'to'g'ri' deb tekshiradi. toThrow kerak, toBe emas.", ru: 'Этот тест не поймает edge-ошибку — даже незащищённую функцию он посчитает «правильной». Нужен toThrow, а не toBe.' } },
    { id: 'log', correct: false, label: "it('log', () => { console.log(orderTotal(10000, 0)); })", why: { uz: "console.log faqat ekranga chiqaradi — hech narsani tekshirmaydi. Bu ham yolg'on test.", ru: 'console.log только печатает на экран — ничего не проверяет. Это тоже фальшивый тест.' } }
  ];
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · haqiqiy edge test', ru: 'Практика · настоящий edge-тест' })} screen={screen} scrollSignal={done ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Haqiqiy edge testlarni tanlang', ru: 'Выберите настоящие edge-тесты' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bir nechta test yozildi. Qaysilari <span className="italic" style={{ color: T.accent }}>haqiqatan edge holatni tutadi</span>?</>, ru: <>Несколько тестов уже написано. Какие из них <span className="italic" style={{ color: T.accent }}>действительно ловят edge-случай</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har testga ikkita savol bering: (1) <span className="mono">() =&gt;</span> bilan o'ralganmi? (2) to'g'ri matcher — <span className="mono">toThrow</span> — ishlatilganmi? Faqat haqiqiy edge testlarni varaqaga oling.</>, ru: <>Задайте каждому тесту два вопроса: (1) обёрнут ли он в <span className="mono">() =&gt;</span>? (2) использован ли правильный matcher — <span className="mono">toThrow</span>? Берите на лист только настоящие edge-тесты.</> })}</Mentor>
        <PickLines
          fileName="order.spec.ts"
          scaffoldTop={<><At>describe</At>{'('}<St>{"'orderTotal — edge cases'"}</St>{', () => {'}</>}
          scaffoldBottom={<>{'});'}</>}
          candidates={candidates}
          agent={{ uz: "orderTotal uchun edge case testlarini yoz: 0 ta va manfiy sonda toThrow — () => bilan o'rab.", ru: 'Напиши edge case тесты для orderTotal: toThrow для 0 и отрицательного числа — обернув в () =>.' }}
          instruction={{ uz: "Qaysi testlar haqiqatan edge holatni tutadi?", ru: 'Какие тесты действительно ловят edge-случай?' }}
          completedInit={!!storedAnswer}
          onComplete={() => { setDone(true); if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }}
        />
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>2 ta haqiqiy edge test: 0 va manfiy, ikkalasi ham <span className="mono">() =&gt; ...toThrow()</span> bilan. Yolg'onlar: o'ralmagan chaqiruv, noto'g'ri matcher (toBe) va <span className="mono">console.log</span>.</>, ru: <>Два настоящих edge-теста: 0 и отрицательное, оба через <span className="mono">() =&gt; ...toThrow()</span>. Фальшивки: вызов без обёртки, неверный matcher (toBe) и <span className="mono">console.log</span>.</> })}</p></div>}
      </div>
    </Stage>
  );
};


// ===== SCREEN 16 — YAKUNIY: ETALON KARTOCHKASI (boundary, SCORED — javob hech qayerda oshkor emas) =====
const CARD_OPTS = ['0', '1', '-1', '0.5'];
const CARD_CORRECT = 1; // ⚡ Jonli: INLINE_KEYS.s16 shu indeks bilan mos bo'lishi SHART
const CARD_WHY = {
  0: { uz: "0 — guard buni rad etadi (quantity <= 0 shartiga tushadi va xato tashlaydi).", ru: '0 — guard его отклонит (попадает под условие quantity <= 0, будет ошибка).' },
  2: { uz: "-1 — manfiy son, guard buni ham rad etadi.", ru: '-1 — отрицательное число, guard отклонит и его.' },
  3: { uz: "0.5 — kasr son. Guard buni rad etmaydi, lekin bu eng kichik TO'G'RI butun qiymat emas.", ru: '0.5 — дробь. Guard её не отклонит, но это не наименьшее ДОПУСТИМОЕ целое значение.' },
  default: { uz: "Guard shartini eslang: typeof quantity !== 'number' || quantity <= 0.", ru: "Вспомните условие guard: typeof quantity !== 'number' || quantity <= 0." }
};
const Screen16 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student');
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now());
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? !!storedAnswer.solved : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  const [twist, setTwist] = useState(!!storedAnswer);   // burilish: guard qo'shilgach eski test buziladi
  const [sc, setSc] = useState(0);
  const hasRecap = !!RECAPS[16];
  const [recapOpen, setRecapOpen] = useState(false);
  const done = (solved || isMentorLive) && twist;
  const pick = (i) => {
    if (solved || isMentorLive) return;
    const isCorrect = i === CARD_CORRECT;
    setPicked(i); setSc(n => n + 1);
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect;
    if (oneShot) {
      setSolved(true);
      onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Eng kichik TO'G'RI (xato tashlamaydigan) quantity nechta?", options: CARD_OPTS, correctIndex: CARD_CORRECT, correctAnswer: CARD_OPTS[CARD_CORRECT], picked: i, studentAnswer: CARD_OPTS[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i, selfSubmitted: true });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Eng kichik TO'G'RI (xato tashlamaydigan) quantity nechta?", options: CARD_OPTS, correctIndex: CARD_CORRECT, correctAnswer: CARD_OPTS[CARD_CORRECT], picked: i, studentAnswer: CARD_OPTS[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i, selfSubmitted: true });
    }
  };
  const wrongLocked = oneShot && solved && picked !== CARD_CORRECT;
  const showAnswer = solved || isMentorLive;
  const navLabel = done ? { uz: 'Davom etish', ru: 'Продолжить' } : (showAnswer ? { uz: "Burilishni ko'ring", ru: 'Посмотрите поворот' } : (oneShot ? { uz: 'Qiymatni tanlang', ru: 'Выберите значение' } : { uz: "Chegarani to'g'ri toping", ru: 'Найдите правильную границу' }));
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · chegara qiymati', ru: 'Финал · граничное значение' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Chegara chizig'ining aynan qaysi tomonida funksiya <span className="italic" style={{ color: T.accent }}>ishlaydi</span>?</>, ru: <>По какую именно сторону границы функция <span className="italic" style={{ color: T.accent }}>работает</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Guard shartini eslang: <span className="mono">typeof quantity !== 'number' || quantity &lt;= 0</span> — bu bo'lsa xato. Etalon kartochkasini to'ldiring: <span className="mono">expect(orderTotal(10000, ?)).toBe(10000)</span> — eng kichik <b style={{ color: T.ink }}>TO'G'RI</b> qiymat qaysi?</>, ru: <>Вспомните условие guard: <span className="mono">typeof quantity !== 'number' || quantity &lt;= 0</span> — если оно истинно, будет ошибка. Заполните эталонную карточку: <span className="mono">expect(orderTotal(10000, ?)).toBe(10000)</span> — какое наименьшее <b style={{ color: T.ink }}>ДОПУСТИМОЕ</b> значение?</> })}{oneShot ? tr({ uz: ' Jonli dars — bitta urinish.', ru: ' Живой урок — одна попытка.' }) : ''}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'order.spec.ts — etalon kartochkasi', ru: 'order.spec.ts — эталонная карточка' })}</p>
            <CodeFile name="order.spec.ts" minH={110}>
              <At>it</At>{'('}<St>{"'eng kichik to'g'ri buyurtma'"}</St>{', () => {'}{'\n'}
              {'  '}<At>expect</At>{'(orderTotal(10000, '}
              <span className={`card-slot ${showAnswer ? 'on' : ''}`}>{showAnswer ? CARD_OPTS[CARD_CORRECT] : '?'}</span>
              {')).'}<At>toBe</At>{'(10000);'}{'\n'}
              {'});'}
            </CodeFile>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CARD_OPTS.map((o, i) => {
                let cls = 'card-tile';
                if (showAnswer) { if (i === CARD_CORRECT) cls += ' ok'; else cls += ' off'; if (wrongLocked && i === picked) cls += ' bad'; }
                else if (i === picked) cls += ' bad';
                return <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)}><span className="mono">{o}</span></button>;
              })}
            </div>
            {picked !== null && !showAnswer && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr(CARD_WHY[picked] ?? CARD_WHY.default)}</p></div>}
            {showAnswer && <div className={wrongLocked ? 'frame-warn fade-step' : 'frame-success fade-step'}><p className="body" style={{ margin: 0, color: T.ink }}>{wrongLocked ? tr({ uz: <>To'g'ri chegara — <b className="mono">1</b> (eng kichik butun musbat son). Guard <b>0</b> va undan pastini rad etadi.</>, ru: <>Правильная граница — <b className="mono">1</b> (наименьшее целое положительное число). Guard отклоняет <b>0</b> и всё, что ниже.</> }) : tr({ uz: <>To'g'ri: eng kichik to'g'ri qiymat — <b className="mono">1</b>. Guard shundan pastini rad etadi.</>, ru: <>Верно: наименьшее допустимое значение — <b className="mono">1</b>. Всё, что ниже, guard отклоняет.</> })}</p></div>}
            {hasRecap && !isMentorLive && showAnswer && firstCorrectRef.current === false && (
              <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: '📖 Короткое повторение — взглянуть на тему ещё раз' })}</button>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'burilish — guard eski testni buzadi', ru: 'поворот — guard ломает старый тест' })}</p>
            {!showAnswer
              ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Avval kartochkani to'ldiring ←", ru: 'Сначала заполните карточку ←' })}</p></div>
              : !twist
                ? <>
                    <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Guard qo'shilishidan oldin kimdir shu testni yozgan edi: <span className="mono">expect(orderTotal(10000, 0)).toBe(0)</span>. Guard qo'shilgach bu test nima bo'ladi?</>, ru: <>Ещё до guard кто-то написал вот такой тест: <span className="mono">expect(orderTotal(10000, 0)).toBe(0)</span>. Что с ним станет после добавления guard?</> })}</p></div>
                    <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => { setTwist(true); setSc(n => n + 1); }}>{tr({ uz: '▶ Eski testni ishga tushirish', ru: '▶ Запустить старый тест' })}</button>
                  </>
                : <>
                    <JestRun status="fail" testName="0 ta buyurtma — 0 qaytaradi (eski test)" expected="0" received="Error: quantity musbat raqam bo'lsin" />
                    <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Eski test endi <b style={{ color: T.danger }}>QIZIL</b> — chunki funksiya endi 0 qaytarmaydi, xato tashlaydi. Bu <b>yaxshi xabar</b>: guard ishlayapti, test buni sezdi. Eski testni yangilash kerak.</>, ru: <>Старый тест теперь <b style={{ color: T.danger }}>КРАСНЫЙ</b> — функция больше не возвращает 0, а бросает ошибку. Это <b>хорошая новость</b>: guard работает, и тест это заметил. Старый тест нужно обновить.</> })}</p></div>
                  </>}
          </Col>
        </div>
        </Zoomable>
        {recapOpen && hasRecap && <RecapOverlay screenIdx={16} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};



const ACHIEVEMENTS = {
  firstEdge:        { icon: '🎭', name: 'First Edge',        desc: { uz: "Birinchi edge case savolini to'g'ri topdingiz", ru: 'Вы верно ответили на первый вопрос про edge case' } },
  guardBuilder:     { icon: '🛡️', name: 'Guard Builder',     desc: { uz: "Guardni o'zingiz yig'dingiz (if → throw → return)", ru: "Вы сами собрали guard (if → throw → return)" } },
  blindSpotFinder:  { icon: '🕳️', name: 'Blind Spot Finder', desc: { uz: "Faqat happy-path yetarli emasligini angladingiz", ru: 'Вы поняли, что одного happy-path недостаточно' } },
  fakeEdgeHunter:   { icon: '🕵️', name: 'Fake Edge Hunter',  desc: { uz: "Haqiqiy edge testlarni yolg'onlardan ajratdingiz", ru: 'Вы отличили настоящие edge-тесты от фальшивых' } },
  boundaryMaster:   { icon: '📐', name: 'Boundary Master',   desc: { uz: "Chegara qiymatini to'g'ri topdingiz", ru: 'Вы верно нашли граничное значение' } },
};
// Ekran id → nishon. FAQAT ma'noli ekranlar: SCORED test yoki challenge (exploration'ga BOG'LANMAYDI).
const ACH_TRIGGERS = { s4: 'firstEdge', s9: 'guardBuilder', s14: 'blindSpotFinder', s15: 'fakeEdgeHunter', s16: 'boundaryMaster' };

// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI
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
  const COLORS = [T.accent, T.success, T.blue, CODE.attr, CODE.tag, CODE.ok];
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
const Q_LABELS = { 4: '1 — Edge case', 8: '2 — toThrow', 11: '3 — Happy+edge', 14: { uz: '4 — Qamrov', ru: '4 — Покрытие' }, 16: { uz: '5 — Chegara', ru: '5 — Граница' } };
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si
// Fon tokenlari — DARS MAVZUSIDAN (M7: dekoratsiya ham o'qitadi).
// c: rang SEMANTIK — yashil = o'tgan test (PASS/✓), coral = yiqilgan test (FAIL/✕), binafsha = neytral sintaksis.
const QZ_BG_SHAPES = [
  { ch: 'toThrow',  l: 5,  t: 10, s: 30, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: 'throw',    l: 84, t: 8,  s: 30, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: 'guard',    l: 8,  t: 72, s: 26, c: 'rgba(203,173,255,0.11)', d: 27, dl: 0.8 },
  { ch: 'NaN',      l: 78, t: 68, s: 30, c: 'rgba(255,110,70,0.14)', d: 21, dl: 2.2 },
  { ch: 'PASS',     l: 45, t: 86, s: 28, c: 'rgba(120,235,175,0.15)', d: 25, dl: 1.1 },
  { ch: 'FAIL',     l: 66, t: 26, s: 28, c: 'rgba(255,110,70,0.15)',  d: 17, dl: 0.4 },
  { ch: '() =>',    l: 24, t: 34, s: 24, c: 'rgba(80,200,255,0.14)',  d: 20, dl: 1.9 },
  { ch: '0 / -5',   l: 54, t: 5,  s: 22, c: 'rgba(203,173,255,0.12)', d: 22, dl: 0.6 },
  { ch: '✓',        l: 91, t: 42, s: 26, c: 'rgba(120,235,175,0.16)', d: 24, dl: 1.3 },
  { ch: '✕',        l: 16, t: 52, s: 26, c: 'rgba(255,110,70,0.14)',  d: 26, dl: 2.6 },
  { ch: '🎭',       l: 2,  t: 30, s: 30, c: 'rgba(203,173,255,0.18)', d: 28, dl: 3.1 },
];
// ⚔️ Mustahkamlash-jang savollari (12) — ⚡ Jonli roli javob-kalitlari va taqsimotni tasdiqlaydi (3/3/3/3).
const QUIZ_BANK = [
  { q: { uz: 'Edge case (chegara holati) nima?', ru: 'Что такое edge case (граничный случай)?' }, opts: [
    { uz: "Eng ko'p uchraydigan, dasturchi doim kutadigan oddiy va tipik kirish", ru: 'Самый частый, обычный и типичный ввод, которого всегда ждёт разработчик' },
    { uz: "Funksiyaga berilgan nom yoki uning ichidagi o'zgaruvchi nomi", ru: 'Имя, данное функции, или имя переменной внутри неё' },
    { uz: "Oddiylikning chetidagi qiymati: 0, manfiy yoki juda katta son", ru: 'Значение на краю обычного: 0, отрицательное или очень большое число' },
    { uz: "Faqat har doim xatosiz ishlaydigan, muammosiz oddiy kirish", ru: 'Только простой ввод, который всегда работает без ошибок' }], correct: 2 },
  { q: { uz: 'orderTotal(10000, 0) himoyasiz funksiyada nima qaytaradi?', ru: 'Что вернёт orderTotal(10000, 0) в функции без защиты?' }, opts: [
    { uz: 'Error tashlaydi va funksiyani darhol to\'xtatadi', ru: 'Бросит Error и сразу остановит функцию' },
    { uz: 'NaN qaytaradi — hisoblash muvaffaqiyatsiz bo\'ladi', ru: 'Вернёт NaN — вычисление не удастся' },
    { uz: '10000 qaytaradi — bitta buyurtma narxi kabi', ru: 'Вернёт 10000 — как цену одного заказа' },
    { uz: "0 — bepul buyurtma, lekin xato sezilmay qoladi", ru: '0 — бесплатный заказ, но ошибка останется незамеченной' }], correct: 3 },
  { q: { uz: "Mijoz raqam o'rniga matn (\"ikki\") yuborsa, himoyasiz funksiya nima qaytaradi?", ru: 'Клиент прислал вместо числа текст («ikki») — что вернёт функция без защиты?' }, opts: [
    { uz: "0 qaytaradi — matn avtomatik ravishda nolga aylantirib yuboriladi", ru: 'Вернёт 0 — текст автоматически превратится в ноль' },
    { uz: "NaN — \"Not a Number\", hisoblash jim ravishda buzilib ketadi", ru: 'NaN — «Not a Number», вычисление тихо сломается' },
    { uz: "Error tashlaydi va so'rovni darhol, hech ikkilanmasdan rad etadi", ru: 'Бросит Error и сразу, без колебаний отклонит запрос' },
    { uz: "10000 — narx hech qanday o'zgarishsiz, o'sha holicha qaytariladi", ru: '10000 — цена вернётся как есть, без изменений' }], correct: 1 },
  { q: { uz: 'Guard (himoya) qanday yoziladi?', ru: 'Как пишется guard (защита)?' }, opts: [
    { uz: "if (shart) throw new Error(...) — noto'g'ri kirishni rad etadi", ru: 'if (условие) throw new Error(...) — отклоняет неверный ввод' },
    { uz: 'console.log(quantity) yordamida qiymatni ekranga chiqarib tekshiriladi', ru: 'Через console.log(quantity) — вывести значение на экран и посмотреть' },
    { uz: "return 0 yozib, noto'g'ri holatni jimgina o'tkazib yuborish orqali", ru: 'Написать return 0 и тихо пропустить неверный случай' },
    { uz: "Guard umuman yozilmaydi — Jest buni o'zi avtomatik tekshirib qo'yadi", ru: 'Guard вообще не пишут — Jest проверит это сам, автоматически' }], correct: 0 },
  { q: { uz: 'Funksiya xato tashlashini sinash uchun qaysi yozuv to\'g\'ri?', ru: 'Какая запись правильно проверяет, что функция бросает ошибку?' }, opts: [
    { uz: 'expect(orderTotal(10000, 0)).toThrow() — o\'ramasdan chaqiriladi', ru: 'expect(orderTotal(10000, 0)).toThrow() — вызов без обёртки' },
    { uz: 'expect(orderTotal(10000, 0)).toBe(0) — natijani solishtiradi', ru: 'expect(orderTotal(10000, 0)).toBe(0) — сравнивает результат' },
    { uz: 'orderTotal(10000, 0).toThrow() — funksiyaga bevosita ulanadi', ru: 'orderTotal(10000, 0).toThrow() — цепляется прямо к функции' },
    { uz: 'expect(() => orderTotal(10000, 0)).toThrow() — o\'rab chaqiradi', ru: 'expect(() => orderTotal(10000, 0)).toThrow() — вызов в обёртке' }], correct: 3 },
  { q: { uz: '() => bilan o\'ralmasa nima bo\'ladi?', ru: 'Что будет, если не обернуть в () =>?' }, opts: [
    { uz: 'Test odatdagidan biroz sekinroq, lekin natija xuddi shunday chiqaveradi', ru: 'Тест чуть медленнее обычного, но результат тот же' },
    { uz: 'Hech narsa — funksiya har doimgidek xatosiz yaxshi ishlayveradi', ru: 'Ничего — функция продолжит работать как ни в чём не бывало' },
    { uz: "Funksiya darrov chaqiriladi, xato tashlaydi va test o'zi qulaydi", ru: 'Функция вызовется сразу, бросит ошибку — и тест рухнет сам' },
    { uz: 'Jest ogohlantirish beradi-yu, testni baribir o\'tkazib yuboradi', ru: 'Jest выдаст предупреждение, но тест всё равно пропустит' }], correct: 2 },
  { q: { uz: 'Chegara (boundary) sinovida nimalar tekshiriladi?', ru: 'Что проверяют в тесте границы (boundary)?' }, opts: [
    { uz: "Chegaraning ikki tomoni — masalan 1 (to'g'ri) va 0 (noto'g'ri)", ru: 'Обе стороны границы — например 1 (верно) и 0 (неверно)' },
    { uz: 'Faqat eng katta qiymat, boshqa hech qanday holat tekshirilmaydi', ru: 'Только наибольшее значение, больше ничего не проверяется' },
    { uz: 'Faqat manfiy sonlar, musbat qiymatlar umuman tekshirilmaydi', ru: 'Только отрицательные числа, положительные не проверяются вовсе' },
    { uz: "Faqat matn ko'rinishidagi noto'g'ri kirishlar tekshiriladi", ru: 'Только неверный ввод в виде текста' }], correct: 0 },
  { q: { uz: "orderTotal funksiyasida throw ishlatilgan. Bu API'da nimaga mos keladi?", ru: 'В orderTotal используется throw. Чему это соответствует в API?' }, opts: [
    { uz: "200 OK — so'rov muvaffaqiyatli bajarilgani ko'rsatiladi", ru: '200 OK — запрос выполнен успешно' },
    { uz: '400 Bad Request — DTO tekshiruvi kirishni rad etganini bildiradi', ru: '400 Bad Request — проверка DTO отклонила ввод' },
    { uz: "500 Internal Error — serverning o'zida nosozlik borligini bildiradi", ru: '500 Internal Error — сбой на самом сервере' },
    { uz: 'Hech nimaga mos kelmaydi — bu faqat unit-testga tegishli tushuncha', ru: 'Ничему — это понятие относится только к юнит-тестам' }], correct: 1 },
  { q: { uz: 'Faqat happy-path testi yozilgan bo\'lsa, qanday xavf bor?', ru: 'Написаны только happy-path тесты — в чём риск?' }, opts: [
    { uz: 'Edge holatdagi xato (masalan manfiy buyurtma) sezilmay ishlab ketadi', ru: 'Ошибка в edge-случае (например, отрицательный заказ) проскочит незамеченной' },
    { uz: "Test odatdagidan bir oz sekinroq ishga tushadi, boshqa hech qanday farqi yo'q", ru: 'Тесты запустятся чуть медленнее — и больше никакой разницы' },
    { uz: "Kod umuman ishlamay qoladi va dastur birdaniga to'liq yiqilib tushadi", ru: 'Код совсем перестанет работать, и программа сразу рухнет целиком' },
    { uz: "Xavf umuman yo'q — happy-path testi bu holatda ham yetarli hisoblanadi", ru: 'Риска нет — happy-path тестов и так вполне достаточно' }], correct: 0 },
  { q: { uz: "AI yozgan testda faqat happy-path bo'lsa, tekshiruvchi nima qilishi kerak?", ru: 'AI написал тесты только на happy-path — что должен сделать проверяющий?' }, opts: [
    { uz: "AI'ga to'liq ishonib, testni tekshirmasdan o'tkazib yuborish", ru: 'Полностью довериться AI и пропустить тесты без проверки' },
    { uz: "Yetishmayotgan edge case testlarni topib, qo'shib qo'yish", ru: 'Найти недостающие edge case тесты и добавить их' },
    { uz: "Butun testni o'chirib, boshidan qaytadan yozib chiqish", ru: 'Удалить все тесты и переписать их с нуля' },
    { uz: 'Faqat console.log qo\'shib, natijani ko\'z bilan kuzatish', ru: 'Просто добавить console.log и следить за результатом глазами' }], correct: 1 },
  { q: { uz: 'expect(orderTotal(10000, -5)).toBe(-50000) — bu yozuv edge xatoni tutadimi?', ru: 'expect(orderTotal(10000, -5)).toBe(-50000) — поймает ли такая запись edge-ошибку?' }, opts: [
    { uz: "Ha — chunki javobida manfiy son ishtirok etib turgani ko'rinadi", ru: 'Да — ведь в ответе фигурирует отрицательное число' },
    { uz: "Ha — toBe matcher'i har doim edge testga tegishli hisoblanadi", ru: 'Да — matcher toBe всегда считается edge-тестом' },
    { uz: "Yo'q — bu hali himoyasiz funksiyani 'to'g'ri' deb hisoblaydi", ru: 'Нет — она считает ещё незащищённую функцию «правильной»' },
    { uz: 'Bu umuman test emas — oddiy hisoblash amali, boshqa hech narsa emas', ru: 'Это вообще не тест — обычное вычисление, и только' }], correct: 2 },
  { q: { uz: "Guard qo'shilgach, eski expect(orderTotal(10000, 0)).toBe(0) testi nima bo'ladi?", ru: 'После добавления guard что станет со старым тестом expect(orderTotal(10000, 0)).toBe(0)?' }, opts: [
    { uz: "Baribir PASS bo'lib qolaveradi, hech qanday o'zgarish sezilmaydi", ru: 'Так и останется PASS, никаких изменений не будет' },
    { uz: "Testlar ro'yxatidan Jest tomonidan avtomatik chiqarib tashlanadi", ru: 'Jest автоматически уберёт его из списка тестов' },
    { uz: "Jest buni o'zi payqab, qatorni avtomatik ravishda tuzatib qo'yadi", ru: 'Jest сам это заметит и автоматически исправит строку' },
    { uz: "FAIL bo'ladi — endi funksiya 0 o'rniga xato tashlab qo'yadi", ru: 'Станет FAIL — функция теперь бросает ошибку вместо 0' }], correct: 3 },
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
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{tr(hint)}</span>}
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
    const TOK = ['expect', 'toBe', 'describe', 'it', 'PASS', 'FAIL', '.spec.ts', 'npm test', '✓', '🤖'];
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
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест сами:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме практики' })}</button>
        </div>
      )}

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
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Подождите, пока ментор начнёт тест…' })}</p>}
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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: "🏁 Natijani ko'rish", ru: '🏁 Смотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Дальше →' })}</button>}
        </div>
      )}

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верных' })}{soloScore.maxStreak >= 2 ? tr({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · лучшая серия 🔥x${soloScore.maxStreak}` }) : ''}</p>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест ещё раз — практика (в таблицу не пишется)' })}</button>}
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
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-wait" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Загружаем результаты…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-wait fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не подключился.' })}</p></div>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верных)</> })}</p>}
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
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: (title && title.uz) || title, solved: true, correct: true, picked: true });
    // JONLI: praktika bajarilgani serverga yoziladi (500+ zona — reytingga aralashmaydi, faqat mentor ko'radi)
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  // JONLI: mentor keyingi sahifaga o'tmaguncha NavNext qulf bo'ladi (optionalLive + LiveGateCtx gate). Hozircha done bo'lsa ochiq.
  const audio = useAudio([{ id: `practice_${screen}`, text: `Endi navbat sizda — bu topshiriqni o'z kompyuteringizda, VS Code'da bajarasiz. orderTotal funksiyasiga guard qo'shing, 0 va manfiy son uchun edge case testlarini toThrow bilan yozing, so'ng guardni ataylab olib tashlab qizil FAIL'ni o'qing. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Отмечайте каждый шаг по мере выполнения. Когда закончите, нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — наставник следит за прогрессом.</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="lp-task fade-up delay-1">
              <div className="lp-task-h"><span className="lp-task-badge">{tr({ uz: 'TOPSHIRIQ', ru: 'ЗАДАНИЕ' })}</span></div>
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr(task)}</p>
            </div>
            <MentorPracticeStats live={_live} screen={screen} />
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Bosqichlar — belgilab boring', ru: 'Шаги — отмечайте' })}</p>
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


const ScreenEdgePractice = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "Shumtaka mijozni o'zingiz sinang", ru: 'Сыграйте клиента-озорника сами' }}
    task={{ uz: "VS Code'da o'z loyihangizni oching: orderTotal funksiyasiga guard qo'shing va edge case testlarini yozing — 0, manfiy son va noto'g'ri tur (masalan matn) uchun. Har birini toThrow bilan sinang, so'ng kodni ataylab buzib qizil FAIL'ni ko'ring. Kodni bu yerga ko'chirmang — kompyuteringizda bajaring.", ru: 'Откройте свой проект в VS Code: добавьте guard в функцию orderTotal и напишите edge case тесты — для 0, отрицательного числа и неверного типа (например, текста). Каждый проверьте через toThrow, затем нарочно сломайте код и посмотрите на красный FAIL. Код сюда не копируйте — выполняйте на своём компьютере.' }}
    checklist={[
      { uz: "Guard qo'shing: `if (typeof quantity !== 'number' || quantity <= 0) throw new Error(...)`", ru: "Добавьте guard: `if (typeof quantity !== 'number' || quantity <= 0) throw new Error(...)`" },
      { uz: "Edge test yozing: `expect(() => orderTotal(10000, 0)).toThrow()`", ru: 'Напишите edge-тест: `expect(() => orderTotal(10000, 0)).toThrow()`' },
      { uz: "Yana bir edge test: `expect(() => orderTotal(10000, -5)).toThrow()`", ru: 'Ещё один edge-тест: `expect(() => orderTotal(10000, -5)).toThrow()`' },
      { uz: "Chegarani sinang: `expect(orderTotal(10000, 1)).toBe(10000)` — 1 baribir ishlashi kerak", ru: 'Проверьте границу: `expect(orderTotal(10000, 1)).toBe(10000)` — 1 должен работать по-прежнему' },
      { uz: "Guardni ataylab olib tashlang → testlar qizil FAIL bo'lishini kuzating → qaytadan qo'shing", ru: 'Нарочно уберите guard → посмотрите, как тесты становятся красными FAIL → верните его на место' },
    ]} />
);


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
const fcIsCode = (s) => FC_VOCAB.has(s.toLowerCase()) || /[=(){};.[\]<>+*/%!&|-]/.test(s);
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


// 🃏 EDGE CASES FLASHCARD KARTALARI (front=savol, back=qisqa javob, note=bir qatorlik izoh) — matnni 🎓 Metodist sayqallaydi
const EDGE_FLASHCARDS = [
  { front: { uz: "Oddiy, kutilgan kirish bilan sinash qanday ataladi?", ru: 'Как называется проверка обычным, ожидаемым вводом?' }, back: 'Happy path', note: { uz: "oddiy mijoz: 3 dona buyurtma", ru: 'обычный клиент: заказ на 3 штуки' } },
  { front: { uz: "0, manfiy yoki juda katta qiymat bilan sinash qanday ataladi?", ru: 'Как называется проверка нулём, отрицательным или очень большим значением?' }, back: 'Edge case', note: { uz: 'shumtaka mijoz — chegaradagi qiymat', ru: 'клиент-озорник — значение на границе' } },
  { front: { uz: "Chegara chizig'ining ikki tomonini sinash qanday ataladi?", ru: 'Как называется проверка обеих сторон линии границы?' }, back: 'Boundary', note: { uz: "1 — eng kichik to'g'ri qiymat, 0 esa rad etiladi", ru: '1 — наименьшее допустимое значение, а 0 отклоняется' } },
  { front: { uz: "Funksiyaga raqam o'rniga matn kelsa, natija nima bo'ladi?", ru: 'Что получится, если в функцию вместо числа придёт текст?' }, back: 'NaN', note: { uz: "Not a Number — jim buzilish, hech kim sezmaydi", ru: 'Not a Number — тихая поломка, её никто не замечает' } },
  { front: { uz: "Noto'g'ri kirishni rad etadigan tekshiruv qanday ataladi?", ru: 'Как называется проверка, отклоняющая неверный ввод?' }, back: 'Guard', note: { uz: "funksiya boshidagi himoya qatori", ru: 'строка-защита в начале функции' } },
  { front: { uz: "Funksiyani to'xtatib xato chiqaradigan buyruq qaysi?", ru: 'Какая команда останавливает функцию и выдаёт ошибку?' }, back: 'throw new Error(...)', note: { uz: "guard ichida shu buyruq turadi", ru: 'именно эта команда стоит внутри guard' } },
  { front: { uz: "Funksiya xato tashlaganini qaysi tekshiruv bilan sinaysiz?", ru: 'Какой проверкой вы убеждаетесь, что функция бросила ошибку?' }, back: 'toThrow', note: { uz: "expect(() => orderTotal(10000, -5)).toThrow()", ru: 'expect(() => orderTotal(10000, -5)).toThrow()' } },
  { front: { uz: "toThrow ishlashi uchun funksiyani nima bilan o'raysiz?", ru: 'Во что вы оборачиваете функцию, чтобы сработал toThrow?' }, back: '() =>', note: { uz: "o'ramasangiz xato darrov chiqadi va test o'zi qulaydi", ru: 'без обёртки ошибка вылетит сразу и тест рухнет сам' } },
  { front: { uz: "Funksiyadagi throw API tomonida qanday javobga aylanadi?", ru: 'В какой ответ превращается throw из функции на стороне API?' }, back: '400 Bad Request', note: { uz: "bir xil mantiq: error path", ru: 'одна и та же логика: error path' } },
  { front: { uz: "Faqat happy path testlarini yozsangiz, nima yetishmaydi?", ru: 'Чего не хватает, если вы пишете только happy-path тесты?' }, back: { uz: 'Edge case testlari', ru: 'Тесты edge case' }, note: { uz: "chegaradagi xato ko'rinmay qoladi", ru: 'ошибка на границе останется незаметной' } },
  { front: { uz: "orderTotal(10000, -5) natijasi -50000 chiqdi. Bu qanday holat?", ru: 'orderTotal(10000, -5) вернул -50000. Что это за случай?' }, back: { uz: 'Manfiy edge case', ru: 'Отрицательный edge case' }, note: { uz: "do'kon pul qaytargandek — haqiqiy zarar", ru: 'магазин будто возвращает деньги — реальный убыток' } },
  { front: { uz: "Guard qo'shgandan keyin eski test nega qizil bo'ladi?", ru: 'Почему после добавления guard старый тест становится красным?' }, back: { uz: 'Funksiya endi xato tashlaydi', ru: 'Функция теперь бросает ошибку' }, note: { uz: "eski test 0 kutgan edi — uni yangilash kerak", ru: 'старый тест ждал 0 — его нужно обновить' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={EDGE_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};



// ===== SCREEN 17 — YAKUN (CodeStrike CTA + RECAP/Uyga vazifa + 🏅 kolleksiya; GLOSSARY OLIB TASHLANDI) =====
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
    { uz: "Happy path — oddiy kirish; edge case — chegara (0, manfiy, juda katta)", ru: 'Happy path — обычный ввод; edge case — граница (0, отрицательное, очень большое)' },
    { uz: "Noto'g'ri ma'lumot (matn, null) → NaN/0 — jim buzilish, xavfli", ru: 'Неверные данные (текст, null) → NaN/0 — тихая поломка, опасно' },
    { uz: "Guard: if (...) throw new Error(...) — noto'g'rini rad etadi", ru: 'Guard: if (...) throw new Error(...) — отклоняет неверное' },
    { uz: "expect(() => fn()).toThrow() — exceptionni sinaydi", ru: 'expect(() => fn()).toThrow() — проверяет exception' },
    { uz: "Har funksiya = happy path + chegara + noto'g'ri ma'lumot + exception", ru: 'Каждая функция = happy path + граница + неверные данные + exception' }
  ];
  const HOMEWORK = [
    { b: { uz: 'Edge testlar', ru: 'Edge-тесты' }, t: { uz: "— o'z funksiyangizga 0, manfiy va noto'g'ri tur testlarini yozing", ru: '— напишите для своей функции тесты на 0, отрицательное и неверный тип' } },
    { b: 'toThrow', t: { uz: "— () => bilan o'rashni unutmang", ru: '— не забудьте обернуть в () =>' } },
    { b: { uz: 'AI qamrovi', ru: 'Покрытие AI' }, t: { uz: "— AI'dan test so'rang, qaysi edge case qolib ketganini toping", ru: '— попросите тесты у AI и найдите, какой edge case он упустил' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: "Edge case va exception'larni o'rgandingiz", ru: 'Вы освоили edge case и exception' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi kodingiz <span className="italic" style={{ color: T.accent }}>g'alati kirishlardan</span> ham himoyalangan.</>, ru: <>Теперь ваш код защищён и от <span className="italic" style={{ color: T.accent }}>странного ввода</span>.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? { uz: '⏳ Mentorni kuting', ru: '⏳ Дождитесь ментора' } : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "🎉 Modul 4b tugadi! Endi kodingizni o'zingiz ham, kompyuter ham tekshiradi — happy path va edge case bilan.", ru: '🎉 Модуль 4b завершён! Теперь ваш код проверяете и вы, и компьютер — с happy path и edge case.' })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 Badges — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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
export default function EdgeCasesTestLesson({ lang: langProp, onFinished }) {
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
  // ETALON — 1920px: keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // Javob kaliti: inline testlar + jang savollari — mentor sessiya ochganda set_quiz_keys bilan serverga yuklanadi
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
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 faqat REAL solve
    if (_m && _m.scored && _m.scope === 'final' && data && data.correct && !data.selfSubmitted && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);
  };
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16, ScreenEdgePractice, ScreenPodium, ScreenFlashcards, Screen17];
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
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip:disabled { opacity: 0.4; cursor: not-allowed; }
        /* kod-atama chipi (orderTotal(...), describe, expect) — monospace, kod ekanligi ko'rinib tursin */
        .gchip { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 12px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; }

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


        .h-title { font-size: clamp(22px,4vw,38px); }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
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
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
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
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }

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



        /* Kahoot-kutish: tanlangan variant javob ochilguncha nafas oladi */
        .option-wait { animation: opt-wait-breathe 2s ease-in-out infinite; }
        @keyframes opt-wait-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.012); } }



        /* ===== JEST DARSI — MAXSUS QATLAM ===== */
        /* VS CODE EDITOR */
        .editor { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .editor-bar { background: #2D2D2D; padding: 7px 11px; display: flex; align-items: center; gap: 9px; }
        .editor-tab { font-family: 'JetBrains Mono'; font-size: 11px; color: #C9D1D9; background: #1E1E1E; padding: 4px 11px; border-radius: 6px 6px 0 0; word-break: break-all; }
        .editor-body { background: ${CODE.bg}; padding: 12px 14px; }
        .editor-code { font-family: 'JetBrains Mono'; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.75; color: ${CODE.text}; white-space: pre-wrap; word-break: break-word; margin: 0; }
        .line-empty { color: ${CODE.comment}; font-style: italic; }

        /* PICK LINES (Jest varianti) */
        .pick-row { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 10px; padding: 10px 12px; cursor: pointer; transition: all 0.16s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); font-family: 'JetBrains Mono'; font-size: 11.5px; color: ${T.ink}; }
        .pick-row:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.22); }
        .pick-row.picked { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; cursor: default; }
        .pick-row:disabled { cursor: default; }
        .pick-plus { margin-left: auto; font-weight: 700; color: ${T.ink3}; } .pick-row.picked .pick-plus { color: ${T.success}; }

        /* AGENT CARD */
        .agent-card { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 10px; padding: 11px 14px; }
        .agent-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.blue}; display: block; margin-bottom: 4px; }
        .agent-msg { font-family: 'JetBrains Mono'; font-size: 12px; color: ${T.ink}; margin: 0; line-height: 1.55; }

        /* TERMINAL */
        .term { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .term-bar { background: #2D2D2D; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; } .bb-dots i { width: 9px; height: 9px; border-radius: 50%; } .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .term-title { font-family: 'JetBrains Mono'; font-size: 11px; color: #C9D1D9; }
        .term-body { background: #1E1E1E; padding: 12px 13px; min-height: 60px; }
        .tline { font-family: 'JetBrains Mono'; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.8; color: ${CODE.text}; word-break: break-word; }

        /* JESTBOT HAKAMI — terminal oynasi (chrome + hukm chirog'i + PASS/FAIL + Expected/Received dalili) */
        .jestrun { border-radius: 12px; overflow: hidden; box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.3); border-left: 3px solid transparent; }
        .jestrun.ok { border-left-color: ${CODE.ok}; }
        .jestrun.bad { border-left-color: ${CODE.err}; }
        .jestrun .term-bar { background: #22304A; }
        .jr-brand { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 10px; letter-spacing: 0.06em; color: #fff; background: ${T.jest}; padding: 2px 7px; border-radius: 4px; flex-shrink: 0; }
        .jr-lamp { margin-left: auto; width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .jestrun.ok .jr-lamp { background: ${CODE.ok}; box-shadow: 0 0 9px ${CODE.ok}; }
        .jestrun.bad .jr-lamp { background: ${CODE.err}; box-shadow: 0 0 9px ${CODE.err}; }
        .jest { background: ${CODE.bg}; padding: 13px 15px; font-family: 'JetBrains Mono'; font-size: 12px; color: ${CODE.text}; line-height: 1.7; }
        .jest-tag { display: inline-block; background: ${T.success}; color: #fff; font-weight: 800; padding: 2px 9px; border-radius: 5px; font-size: 11px; letter-spacing: 0.06em; }
        .jest-tag.fail { background: ${T.danger}; }
        .jest-file { color: #C9D1D9; }
        .jest-block { margin-top: 8px; padding-left: 6px; }
        .jest-diff { margin-top: 8px; padding: 9px 11px; background: rgba(255,138,122,0.10); border-left: 2px solid ${CODE.err}; border-radius: 0 7px 7px 0; display: flex; flex-direction: column; gap: 2px; }
        .jest-diff-row b { color: ${CODE.punct}; font-weight: 600; }
        .jest-sum { margin-top: 9px; color: #9FB4D8; border-top: 1px solid rgba(159,180,216,0.2); padding-top: 8px; }
        /* terminal his'i — qator-qator, stagger bilan chiqadi */
        .jest > * { opacity: 0; animation: el-pop 0.32s ease-out forwards; }
        .jest > *:nth-child(1) { animation-delay: 0ms; }
        .jest > *:nth-child(2) { animation-delay: 120ms; }
        .jest > *:nth-child(3) { animation-delay: 240ms; }
        .jest > *:nth-child(4) { animation-delay: 360ms; }
        .jest > *:nth-child(5) { animation-delay: 480ms; }
        .jest > *:nth-child(6) { animation-delay: 600ms; }
        .jest > *:nth-child(7) { animation-delay: 720ms; }
        @media (prefers-reduced-motion: reduce) { .jest > * { animation: none !important; opacity: 1; } }

        /* VCARD / GCHIP / TAGPILL / FRAME-DASH */
        .vcard { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover:not(:disabled) { transform: translateY(-1px); }
        .vcard:disabled { cursor: default; }
        .vlbl { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .vseen { margin-left: auto; font-weight: 700; }
        .role-ico { font-size: 20px; flex-shrink: 0; } .role-r { font-size: 11.5px; color: ${T.ink2}; font-weight: 600; }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.danger}; border-radius: 12px; padding: 12px 15px; }
        .note-h { font-weight: 700; font-size: 13.5px; margin: 0 0 5px; display: flex; align-items: center; }

        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: shake 0.4s ease; }

        /* tap-hint affordans — bosilmagan element "meni bosing" deb pulslaydi */
        .gchip.tap-hint, .vcard.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 0 rgba(255,79,40,0.4); } 70%,100% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 8px rgba(255,79,40,0); } }

        /* JONLI BADGE — xira (11.15), ustiga borsa ochiladi (kontent bilan urishmasin) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(${T.shadowBase},0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* B2 — TOPSHIRIQ VARAQASI (pointer DragDrop) */
        .dd-sheet { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .dd-sheet-bar { background: #2D2D2D; padding: 7px 11px; display: flex; align-items: center; gap: 9px; }
        .dd-sheet-body { background: ${CODE.bg}; padding: 12px 14px; display: flex; flex-direction: column; gap: 7px; }
        .dd-slot { min-height: 38px; display: flex; align-items: center; border: 1.5px dashed rgba(159,180,216,0.45); border-radius: 8px; padding: 7px 10px; transition: all 0.18s; }
        .dd-slot.over { border-color: #FFD380; background: rgba(255,211,128,0.12); transform: scale(1.01); }
        .dd-slot.filled { border-style: solid; border-color: rgba(125,209,129,0.55); background: rgba(125,209,129,0.08); }
        .dd-ph { font-family: 'Manrope'; font-size: 11.5px; color: #7E8CA8; font-style: italic; }
        .dd-code { font-family: 'JetBrains Mono'; font-size: clamp(11px,1.4vw,12.5px); color: ${CODE.text}; word-break: break-word; }
        .dd-code.settle { animation: dd-settle 0.45s cubic-bezier(.3,1.5,.5,1); }
        @keyframes dd-settle { 0% { opacity: 0; transform: translateY(-9px) scale(1.05); } 60% { opacity: 1; transform: translateY(2px) scale(0.98); } 100% { transform: none; } }
        .dd-tail { color: ${CODE.punct}; font-size: 12px; padding-left: 4px; opacity: 0.75; }
        .dd-pool { display: flex; flex-direction: column; gap: 8px; }
        .dd-chip { display: flex; align-items: center; gap: 8px; background: ${T.paper}; border-radius: 10px; padding: 11px 13px; font-size: 11.5px; color: ${T.ink}; cursor: grab; touch-action: none; user-select: none; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.18); transition: box-shadow 0.16s, transform 0.16s; }
        .dd-chip:hover { transform: translateY(-1px); }
        .dd-chip.drag { cursor: grabbing; box-shadow: 0 16px 34px -10px rgba(${T.shadowBase},0.4); }

        /* B3 — ETALON KARTOCHKASI */
        /* ETALON KARTOCHKASI — bo'sh (uzuq chiziq = to'ldirilmagan kartochka) → to'ldirilgan (yashil, Jestbot o'qiy oladi) */
        .card-slot { display: inline-block; min-width: 58px; text-align: center; border-radius: 6px; padding: 1px 8px; background: rgba(255,211,128,0.18); border: 1px dashed ${CODE.attr}; color: ${CODE.attr}; font-weight: 700; }
        .card-slot.on { background: rgba(125,209,129,0.2); border: 1px solid ${CODE.ok}; color: ${CODE.ok}; box-shadow: 0 0 12px rgba(125,209,129,0.28); }
        .card-tile { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 15px; border: none; border-radius: 12px; padding: 13px 20px; background: ${T.paper}; color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); transition: all 0.18s; }
        .card-tile:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.24); }
        .card-tile:disabled { cursor: default; }
        .card-tile.ok { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .card-tile.off { opacity: 0.45; }
        .card-tile.bad { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; opacity: 1; }

      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Edge cases va error path darsi', ru: 'Урок «Edge cases и error path»' }} />
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
