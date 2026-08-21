import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// MA'LUMOT VA BACKEND MODULI · PRAKTIKA 1 — BACKEND CRUD: AVTOIJARA (Express + PostgreSQL) — PLATFORM STANDARD v16 (AUDIOSIZ)
// O'RNI: 4-Modul oxiri, "Auth va .env" darsidan KEYIN. Birinchi fullstack praktika.
//        O'quvchi biladi: JSON/jadval/sxema, SQL vs NoSQL, Express server, routing (METHOD+PATH), SQL CRUD, API/Postman.
//        Hali bilmaydi: Express'ni PostgreSQL'ga ULASH (pool.query) — bu praktika shu bo'shliqni yopadi.
// Mavzu: AvtoIjara backend — cars jadvali + Express orqali CRUD. Front (Modul 3) keyingi praktikada ulanadi.
// HALQA: ME'MOR (sxemani qo'lda loyihalash) → REJISSYOR (AI-prompt bilan endpoint) → NAZORATCHI (Postman bilan test).
// KO'PRIK: yakunda — "ma'lumot kodda emas, bazada yashaydi; server o'chsa ham saqlanadi" → Praktika 2 (React frontni ulash) ga intro.
// PEDAGOGIKA: rejani siz tuzasiz → AI quradi → siz Postman bilan tekshirasiz. "sehr"/"g'isht" ishlatilmaydi. AUDIOSIZ.
// Yakuniy ekran (spf): JONLI PRAKTIKA — o'quvchi backend'ni O'Z VS Code'ida quradi (kod platformaga KIRITILMAYDI),
//        bosqichlarni belgilab «Bajardim» bosadi → mentor MentorPracticeStats'da kim bajarganini ko'radi (screen_idx 500+).
// BALL: 4 ta scored inline test (s4/s5b/s8/s12) + 12 savolli arena. Praktika ballanmaydi (scored:false, 'practice' → -1 sentinel).
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
  danger: '#C2362B', dangerSoft: '#FAE3E0', line: '#E9E6DF',
  amber: '#B45309', amberSoft: '#FBEBD8', // PUT/UPDATE + REJISSYOR roli (CRUD rang semantikasi)
  shadowBase: '58, 53, 48'
};
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };

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
    } catch { setJoinError(tr({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: "Неверный код ментора или ошибка соединения." })); }
    finally { setBusy(false); }
  }, [lessonId]);

  const joinStudent = useCallback(async (raw, rawNick) => {
    const p = (raw || '').replace(/\D/g, '');
    const nick = (rawNick || '').trim();
    if (p.length < 4) { setJoinError(tr({ uz: "Kodni to'liq kiriting.", ru: "Введите код полностью." })); return; }
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
      setJoinError(/ism|band|kod|dars|belgi/i.test(m) ? m : tr({ uz: "Ulanib bo'lmadi. Internetni tekshiring.", ru: "Не удалось подключиться. Проверьте интернет." }));
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
      <p style={{ color: '#fff', opacity: 0.85, fontSize: 'clamp(15px,2.2vw,22px)', maxWidth: 640, margin: 'clamp(20px,4vw,36px) 0 0', lineHeight: 1.5 }}>{tr({ uz: <>Shu darsni o'z qurilmangizda oching → <b style={{ color: '#fff' }}>«👨‍🎓 O'quvchiman»</b> → bu kodni kiriting.</>, ru: <>Откройте этот урок на своём устройстве → <b style={{ color: '#fff' }}>«👨‍🎓 Я ученик»</b> → введите этот код.</> })}</p>
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

const LESSON_META = { lessonId: 'backend-crud-practice-p1-v18', lessonTitle: { uz: 'Praktika: Backend CRUD — AvtoIjara', ru: 'Практика: Backend CRUD — AvtoIjara' } };
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
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's13', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'spf', type: 'practice',    template: 'custom',   scored: false, scope: null },
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
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic;
  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px + 60px
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
    if (e.target && e.target.closest && e.target.closest('.mentor')) return;
    setMCollapsed(true);
    // mentor yig'ilganda — kontentni silliq yuqoriga surib, ochilgan joyni ko'rsatamiz
    const el = contentRef.current;
    if (el) setTimeout(() => { if (el) el.scrollTo({ top: 0, behavior: 'smooth' }); }, 80);
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
            <div className="chrome-left eyebrow"><span className="dot" /><span>{tr(eyebrow)}</span></div>
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

// ============================================================
// 📖 QAYTA TUSHUNTIRISH (recap) — scored testda xato chiqsa mavzuni qisqa kartalarda yana ko'rsatish.
// Kalitlar — scored test ekranlarining screens[]-indekslari (4=s4, 6=s5b, 9=s8, 13=s12).
// ============================================================
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
const RECAPS = {
  4: {
    title: { uz: "ME'MOR — jadval sxemasi", ru: "АРХИТЕКТОР — схема таблицы" },
    cards: [
      { ic: "🗄️", h: { uz: "Jadval — garaj daftari", ru: "Таблица — журнал гаража" }, body: { uz: <>Baza <b>jadval</b>lardan iborat. <span className="mono">cars</span> jadvali — mashinalar ro'yxati yoziladigan daftar. Har qatori — bitta mashina.</>, ru: <>База состоит из <b>таблиц</b>. Таблица <span className="mono">cars</span> — журнал, куда записывают список машин. Каждая строка — одна машина.</> }, vis: <RcFlow items={[{ uz: "cars jadvali", ru: "таблица cars" }, { uz: "qator = mashina", ru: "строка = машина" }]} sep="·" /> },
      { ic: "📊", h: { uz: "Ustun — bitta narsa", ru: "Столбец — одна вещь" }, body: { uz: <>Har <b>ustun</b> mashinaning bitta xususiyatini saqlaydi: <span className="mono">nom</span>, <span className="mono">narx</span>, <span className="mono">yil</span>, <span className="mono">bandmi</span>. Ustun turi bor: matn, son yoki ha/yo'q.</>, ru: <>Каждый <b>столбец</b> хранит одно свойство машины: <span className="mono">nom</span>, <span className="mono">narx</span>, <span className="mono">yil</span>, <span className="mono">bandmi</span>. У столбца есть тип: текст, число или да/нет.</> } },
      { ic: "🔑", h: { uz: "id — takrorlanmas nomer", ru: "id — неповторимый номер" }, body: { uz: <><span className="mono">id SERIAL PRIMARY KEY</span> — har mashinaga <b>takrorlanmas raqam</b> beradi va avtomatik o'stiradi (1, 2, 3…). Shuning uchun ikki mashina bir xil id'ga ega bo'lmaydi.</>, ru: <><span className="mono">id SERIAL PRIMARY KEY</span> даёт каждой машине <b>уникальный номер</b> и автоматически увеличивает его (1, 2, 3…). Поэтому у двух машин не бывает одинакового id.</> }, ask: { uz: "Nega har mashinaga takrorlanmas id kerak?", ru: "Зачем каждой машине уникальный id?" } },
    ]
  },
  6: {
    title: { uz: "O'qish — GET → SELECT", ru: "Чтение — GET → SELECT" },
    cards: [
      { ic: "📖", h: { uz: "O'qish = ro'yxatni so'rash", ru: "Чтение = запросить список" }, body: { uz: <>Front bazadan hech narsa o'zgartirmaydi — u faqat <b>ro'yxatni so'raydi</b>. Bunday so'rov <span className="mono">GET</span> deyiladi, bazadan olib beradigan SQL esa <span className="mono">SELECT</span>. Ikkalasi ham bitta ishni bildiradi: <b>bor narsani olib ber</b>.</>, ru: <>Фронт ничего не меняет в базе — он просто <b>запрашивает список</b>. Такой запрос называется <span className="mono">GET</span>, а SQL, который достаёт данные из базы, — <span className="mono">SELECT</span>. Оба означают одно: <b>отдай то, что есть</b>.</> }, vis: <RcFlow items={["GET", "SELECT"]} sep="=" /> },
      { ic: "🧭", h: { uz: "Endpoint — method + manzil", ru: "Endpoint — метод + адрес" }, body: { uz: <><span className="mono">app.get('/api/cars', ...)</span> — bu bitta <b>endpoint</b>: <span className="mono">GET</span> — qanday so'rov, <span className="mono">/api/cars</span> — qaysi manzil. Shu manzilga GET kelsa, server aynan shu kodni ishga tushiradi.</>, ru: <><span className="mono">app.get('/api/cars', ...)</span> — это один <b>endpoint</b>: <span className="mono">GET</span> — какой запрос, <span className="mono">/api/cars</span> — какой адрес. Когда на этот адрес приходит GET, сервер запускает именно этот код.</> }, vis: <RcFlow items={["GET", "/api/cars", "SELECT * FROM cars"]} /> },
      { ic: "📦", h: { uz: "res.json — javobni orqaga qaytarish", ru: "res.json — вернуть ответ обратно" }, body: { uz: <>So'rov ko'prikdan o'tadi: <span className="mono">pool.query('SELECT * FROM cars')</span> bazadan qatorlarni oladi, <span className="mono">res.json(...)</span> esa ularni frontga JSON qilib qaytaradi. Front ro'yxatni ekranda ko'rsatadi.</>, ru: <>Запрос идёт по мосту: <span className="mono">pool.query('SELECT * FROM cars')</span> берёт строки из базы, а <span className="mono">res.json(...)</span> возвращает их фронту в виде JSON. Фронт показывает список на экране.</> }, ask: { uz: "Barcha mashinalarni o'qish uchun qaysi method va qaysi SQL kerak?", ru: "Какой метод и какой SQL нужны, чтобы прочитать все машины?" } },
    ]
  },
  9: {
    title: "CRUD ↔ HTTP ↔ SQL — 4=4=4",
    cards: [
      { ic: "🔤", h: { uz: "CRUD — 4 amal", ru: "CRUD — 4 действия" }, body: { uz: <>Deyarli har ilova 4 amal bajaradi: <b>C</b>reate (qo'shish), <b>R</b>ead (o'qish), <b>U</b>pdate (o'zgartirish), <b>D</b>elete (o'chirish).</>, ru: <>Почти каждое приложение делает 4 действия: <b>C</b>reate (добавить), <b>R</b>ead (прочитать), <b>U</b>pdate (изменить), <b>D</b>elete (удалить).</> }, vis: <RcFlow items={["Create", "Read", "Update", "Delete"]} sep="·" /> },
      { ic: "🔗", h: { uz: "Har amalning juftligi bor", ru: "У каждого действия есть пара" }, body: { uz: <>Qo'shish = <span className="mono">POST → INSERT</span>. O'qish = <span className="mono">GET → SELECT</span>. O'zgartirish = <span className="mono">PUT → UPDATE</span>. O'chirish = <span className="mono">DELETE → DELETE</span>.</>, ru: <>Добавить = <span className="mono">POST → INSERT</span>. Прочитать = <span className="mono">GET → SELECT</span>. Изменить = <span className="mono">PUT → UPDATE</span>. Удалить = <span className="mono">DELETE → DELETE</span>.</> }, vis: <RcFlow items={["POST", "INSERT"]} /> },
      { ic: "📞", h: { uz: "Telefon kontaktlari misolida", ru: "На примере контактов в телефоне" }, body: { uz: <>Yangi kontakt <b>qo'shasiz</b> (Create), ro'yxatga <b>qaraysiz</b> (Read), raqamni <b>o'zgartirasiz</b> (Update), keraksizini <b>o'chirasiz</b> (Delete). Backend ham xuddi shunday.</>, ru: <>Вы <b>добавляете</b> новый контакт (Create), <b>смотрите</b> список (Read), <b>меняете</b> номер (Update), <b>удаляете</b> ненужный (Delete). Бэкенд работает так же.</> }, ask: { uz: "Bazaga yangi mashina qo'shish — qaysi method va SQL?", ru: "Добавить в базу новую машину — какой метод и SQL?" } },
    ]
  },
  13: {
    title: { uz: "Ko'prik va xavfsizlik", ru: "Мост и безопасность" },
    cards: [
      { ic: "🌉", h: { uz: "pool.query — ko'prik", ru: "pool.query — мост" }, body: { uz: <><span className="mono">pool</span> — Express server bilan PostgreSQL orasidagi ko'prik. <span className="mono">pool.query('...')</span> SQL'ni bazaga olib boradi va javobni qaytaradi. U bo'lmasa server baza bilan gaplasha olmaydi.</>, ru: <><span className="mono">pool</span> — мост между сервером Express и PostgreSQL. <span className="mono">pool.query('...')</span> доставляет SQL в базу и возвращает ответ. Без него сервер не может говорить с базой.</> }, vis: <RcFlow items={["Express", "pool.query", "PostgreSQL"]} /> },
      { ic: "🛡️", h: { uz: "$1, $2 — xavfsiz o'rin", ru: "$1, $2 — безопасное место" }, body: { uz: <>Qiymatlarni SQL'ga to'g'ridan-to'g'ri yopishtirmaymiz — <span className="mono">$1, $2</span> qo'yamiz, qiymatlar massivda beriladi. Shunda foydalanuvchi matni <b>kod bo'lib qolmaydi</b>, faqat oddiy qiymat.</>, ru: <>Мы не вклеиваем значения прямо в SQL — ставим <span className="mono">$1, $2</span>, а значения передаём массивом. Тогда текст пользователя <b>не становится кодом</b>, а остаётся просто значением.</> } },
      { ic: "🎯", h: ":id + WHERE id=$1", body: { uz: <>Manzildagi <span className="mono">:id</span> — o'zgaruvchi (<span className="mono">req.params.id</span>). <span className="mono">WHERE id = $1</span> bazada aynan o'sha qatorni topadi — qolganlariga tegmaydi.</>, ru: <><span className="mono">:id</span> в адресе — переменная (<span className="mono">req.params.id</span>). <span className="mono">WHERE id = $1</span> находит в базе именно ту строку — остальные не трогает.</> }, ask: { uz: "Express ichida bazaga SQL yuborish uchun nima ishlatiladi?", ru: "Что используется в Express, чтобы отправить SQL в базу?" } },
    ]
  },
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
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}${tr({ uz: '-karta', ru: '-карточка' })}`} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: '✓ Tushunarli — davom etamiz', ru: '✓ Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Далее →' })}</button>}
      </div>
    </div>
  );
}

// ===== 📊 MENTOR STATISTIKASI (jonli test) — proyektorda jonli natija, Kahoot-reveal =====
const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60, RECAP_GOOD_PCT = 75, RECAP_MIN_ANSWERS = 3;
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
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri ✅", ru: 'правильно ✅' })}</span></div>
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
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и число ✅/❌ скрыты — по кнопке «Открыть результат» всё откроется сразу и у вас, и на экранах учеников.' })}</p>
      )}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
          const n = data.rows.filter(a => a.picked === i).length;
          const pct = answered ? Math.round((n / answered) * 100) : 0;
          const isC = i === correctIdx;
          const col = isC ? T.success : MSTATS_COLORS[i % 4];
          return (
            <div key={i} className={`mstats-row ${!isC ? 'dimmed' : ''}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? '✓' : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round((n / maxN) * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? `${n} ${tr({ uz: "o'quvchi", ru: 'уч.' })} · ${pct}%` : '—'}</span>
            </div>
          );
        })}
      </div>}
      {reveal && answered >= RECAP_MIN_ANSWERS && (() => {
        const pct = Math.round((ok / answered) * 100);
        const level = pct < RECAP_NEED_PCT ? 'need' : pct < RECAP_GOOD_PCT ? 'maybe' : 'good';
        return (
          <div className={`mstats-verdict ${level}`}>
            {level === 'need' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Только <b>{pct}%</b> правильно — эта тема осталась классу непонятной. Перед продолжением рекомендуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish — ', ru: '📖 Повторное объяснение — ' })}{tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> правильно — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> правильно — класс освоил тему. Смело продолжайте!</> })}</p>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Yana bir bor tushuntiring.", ru: '⚠️ Многие ошиблись — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь вживую…' })}</p>}
    </div>
  );
}

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student'); // jonli dars: BITTA urinish
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
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval natijani oching', ru: 'Сначала откройте результат' }) : solved ? { uz: 'Davom etish', ru: 'Продолжить' } : (oneShot ? { uz: 'Javob tanlang', ru: 'Выберите ответ' } : { uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
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
                  : solved ? tr({ uz: "To'g'ri", ru: 'Правильно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
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
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">{tr({ uz: "to'g'ri javob", ru: 'правильных' })}</div></div>
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue">{tr({ uz: " · ko'rsatmani ochish ▾", ru: ' · открыть подсказку ▾' })}</span>}</span>
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
const TLine = ({ cmd, out, dim }) => (
  <div className="el-in" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(11.5px,1.4vw,13px)', lineHeight: 1.7, color: dim ? CODE.comment : CODE.text }}>
    {cmd ? <><span style={{ color: CODE.str }}>$</span> <span style={{ color: CODE.text }}>{cmd}</span></> : out}
  </div>
);

// ===== AVTOIJARA MA'LUMOTLARI =====
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const CARS = [
  { id: 1, nom: 'Cobalt',  narx: 280000, yil: 2022, emoji: '🚗', bg: 'linear-gradient(135deg,#7EA6F4,#2E4A9E)' },
  { id: 2, nom: 'Malibu',  narx: 520000, yil: 2023, emoji: '🚙', bg: 'linear-gradient(135deg,#8FD3A8,#2E7A4E)' },
  { id: 3, nom: 'Kia K5',  narx: 610000, yil: 2023, emoji: '🚘', bg: 'linear-gradient(135deg,#F4B26A,#C9622E)' }
];
const POOL_CARS = [
  { id: 4, nom: 'Spark',   narx: 190000, yil: 2021, emoji: '🚐', bg: 'linear-gradient(135deg,#F4A6C0,#B5446E)' },
  { id: 5, nom: 'Tracker', narx: 450000, yil: 2024, emoji: '🚓', bg: 'linear-gradient(135deg,#B9A8F4,#6A4AC9)' },
  { id: 6, nom: 'Onix',    narx: 340000, yil: 2023, emoji: '🚕', bg: 'linear-gradient(135deg,#F4D06A,#C99B2E)' }
];

// jadval ustunlari (ME'MOR — sxema loyihalash)
const COLUMNS = [
  { key: 'id',     sql: 'id SERIAL PRIMARY KEY', type: { uz: 'raqam', ru: 'номер' },  desc: { uz: "Har mashinaning takrorlanmas raqami — avtomatik o'sib boradi", ru: 'Уникальный номер каждой машины — растёт автоматически' } },
  { key: 'nom',    sql: 'nom TEXT',              type: { uz: 'matn', ru: 'текст' },   desc: { uz: "Mashina nomi — masalan 'Cobalt' (matn)", ru: "Название машины — например 'Cobalt' (текст)" } },
  { key: 'narx',   sql: 'narx INTEGER',          type: { uz: 'son', ru: 'число' },    desc: { uz: 'Kunlik ijara narxi — butun son', ru: 'Цена аренды за день — целое число' } },
  { key: 'yil',    sql: 'yil INTEGER',           type: { uz: 'son', ru: 'число' },    desc: { uz: 'Ishlab chiqarilgan yili — butun son', ru: 'Год выпуска — целое число' } },
  { key: 'bandmi', sql: 'bandmi BOOLEAN',        type: { uz: "ha/yo'q", ru: 'да/нет' }, desc: { uz: "Hozir ijaradami? — ha yoki yo'q (true/false)", ru: 'Сдана ли сейчас в аренду? — да или нет (true/false)' } }
];

// CRUD ↔ HTTP ↔ SQL
const OPS = [
  { key: 'C', en: 'Create', amal: { uz: "Qo'shish", ru: 'Добавить' },   method: 'POST',   sql: 'INSERT', color: T.success, code: 'INSERT INTO cars ... VALUES ($1, $2, $3)' },
  { key: 'R', en: 'Read',   amal: { uz: "Ko'rish", ru: 'Прочитать' },     method: 'GET',    sql: 'SELECT', color: T.blue,    code: 'SELECT * FROM cars' },
  { key: 'U', en: 'Update', amal: { uz: 'Tahrirlash', ru: 'Изменить' },  method: 'PUT',    sql: 'UPDATE', color: T.amber,   code: 'UPDATE cars SET narx = $1 WHERE id = $2' },
  { key: 'D', en: 'Delete', amal: { uz: "O'chirish", ru: 'Удалить' },   method: 'DELETE', sql: 'DELETE', color: T.danger,  code: 'DELETE FROM cars WHERE id = $1' }
];
const M_COLOR = { GET: T.blue, POST: T.success, PUT: T.amber, DELETE: T.danger };
const MBadge = ({ m }) => <span className="pm-method" style={{ background: M_COLOR[m] }}>{m}</span>;

// ===== OYNA (brauzer chrome) — mockup haqiqiy oyna ko'rinishida =====
const Win = ({ title, children, minH }) => (
  <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">{title}</span></div><div className="bp-body" style={{ minHeight: minH, position: 'relative' }}>{children}</div></div>
);

// ===== 🛂 ROL PASPORTI — uch muhr: ME'MOR · REJISSYOR · NAZORATCHI =====
// Muhr bosiladi, qachonki o'quvchi shu rolning ekranini bajarsa (answers'dan o'qiladi — mantiq o'zgarmaydi).
const ROLES = [
  { key: 'memor',      idx: 2,  ic: '🏗️', name: { uz: "ME'MOR", ru: 'АРХИТЕКТОР' },     tag: { uz: 'sxema', ru: 'схема' },  col: T.blue,    soft: T.blueSoft },
  { key: 'rejissyor',  idx: 5,  ic: '🎬', name: { uz: 'REJISSYOR', ru: 'РЕЖИССЁР' },  tag: { uz: 'prompt', ru: 'промпт' }, col: T.amber,   soft: T.amberSoft },
  { key: 'nazoratchi', idx: 10, ic: '🔍', name: { uz: 'NAZORATCHI', ru: 'КОНТРОЛЁР' }, tag: { uz: 'sinov', ru: 'проверка' },  col: T.success, soft: T.successSoft }
];
const RolePassport = ({ answers, active }) => {
  // ✨ HARAKAT: muhr AYNAN shu ekranda to'lganda bosiladi (mount paytida to'lgani jim turadi — qayta o'ynamaydi)
  const sig = ROLES.map(r => ((answers && answers[r.idx]) ? '1' : '0')).join('');
  const atMount = useRef(sig);
  const [press, setPress] = useState('000');   // shu ekranda yangi bosilgan muhr(lar)
  const [payoff, setPayoff] = useState(false); // 3/3 — pasport to'ldi
  useEffect(() => {
    const fresh = ROLES.map((_, i) => ((sig[i] === '1' && atMount.current[i] === '0') ? '1' : '0')).join('');
    if (!fresh.includes('1')) return;
    setPress(fresh);
    const ts = [setTimeout(() => setPress('000'), 1000)];
    if (sig === '111') { // uchinchi muhr — pasport tasdiqlandi
      ts.push(setTimeout(() => setPayoff(true), 460));
      ts.push(setTimeout(() => setPayoff(false), 2800));
    }
    return () => ts.forEach(clearTimeout);
  }, [sig]);
  return (
    <div className="fade-up">
    <div className={`rp ${payoff ? 'full' : ''}`} aria-label={tr({ uz: 'Rol pasporti', ru: 'Паспорт ролей' })}>
      <span className="rp-lbl">{tr({ uz: <>Rol<br />pasporti</>, ru: <>Паспорт<br />ролей</> })}</span>
      <div className="rp-stamps">
        {ROLES.map((r, i) => {
          const got = !!(answers && answers[r.idx]);
          const on = active === r.key && !got;
          return (
            <React.Fragment key={r.key}>
              {i > 0 && <span className="rp-sep" aria-hidden="true" />}
              <span className={`rp-stamp ${got ? 'got' : ''} ${on ? 'on' : ''} ${press[i] === '1' ? 'press' : ''}`} style={{ '--rc': r.col, '--rs': r.soft }}>
                <span className="rp-ic">{r.ic}</span>
                <span className="rp-col"><b className="rp-name">{tr(r.name)}</b><i className="rp-tag">{tr(r.tag)}</i></span>
                <span className="rp-seal">{got ? '✓' : on ? '●' : '○'}</span>
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
    </div>
  );
};

// AvtoIjara mashina kartochkasi (front preview)
const CarCard = ({ car, onDelete, flash }) => (
  <div className="rocard el-in" style={{ position: 'relative', boxShadow: flash ? `0 0 0 2px ${T.success}, 0 6px 16px -5px rgba(0,0,0,0.2)` : undefined, transition: 'all 0.3s' }}>
    <div className="rothumb" style={{ background: car.bg }}>
      <span style={{ fontSize: 24 }}>{car.emoji}</span>
      {onDelete && <button className="cardx" onClick={onDelete} title={tr({ uz: "O'chirish", ru: 'Удалить' })}>✕</button>}
    </div>
    <div className="robody">
      <p className="roname">{car.nom}</p>
      <div className="rostats"><span>{sp(car.narx)} {tr({ uz: "so'm/kun", ru: 'сум/день' })}</span><span style={{ marginLeft: 'auto', color: T.ink3 }}>{car.yil}</span></div>
    </div>
  </div>
);
const CardGrid = ({ children, cols = 3 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 8 }}>{children}</div>
);

// PostgreSQL jadval (cars) ko'rinishi
const DbTable = ({ rows, flashId, dimId }) => (
  <div className="db">
    <div className="db-cap">🗄️ <b>cars</b> <span>· {rows.length} {tr({ uz: 'qator', ru: 'строк' })}</span></div>
    <div className="db-row db-head"><span>id</span><span>nom</span><span>narx</span><span>yil</span></div>
    {rows.length ? rows.map(r => (
      <div key={r.id} className={`db-row el-in ${flashId === r.id ? 'flash' : ''}`} style={{ opacity: dimId === r.id ? 0.35 : 1, textDecoration: dimId === r.id ? 'line-through' : 'none' }}>
        <span>{r.id}</span><span>{r.nom}</span><span>{sp(r.narx)}</span><span>{r.yil}</span>
      </div>
    )) : <div className="db-empty">{tr({ uz: "— bo'sh (0 qator) —", ru: '— пусто (0 строк) —' })}</div>}
  </div>
);

// Postman javob qutisi
const Resp = ({ status, text, json }) => (
  <div className="pm-resp el-in">
    <div className="pm-status" style={{ color: status < 300 ? T.success : T.danger }}>● {status} {text}</div>
    {json && <pre className="json">{json}</pre>}
  </div>
);

// ===== SCREEN 0 — HOOK (front bor, lekin ma'lumot qattiq yozilgan) =====

// ══ KLAPAN — IPUCHA-ZINAPOYA + RESCUE (KATTA_TOZALASH 13-band, PmLesson11 naqshi) ══
//
// Muammo: «Davom etish» qulflangan har ekran — potentsial O'LIK NUQTA. O'quvchi topa
// olmasa, yordam so'rashdan boshqa yo'li yo'q. Uch daraja, har biri oldingisini to'ldiradi:
//   1) QULF-YORLIQ harakatni aytadi  ->  2) IPUCHA chuqurlashtiradi  ->  3) RESCUE yo'l ochadi
//
// IKKI O'LCHOV (PmLesson11, M3-D10 sabog'i):
//   `sec`  — ekran ochiq turgan vaqt. Bosishga BOG'LIQ EMAS.
//   `idle` — oxirgi HAQIQIY siljishdan beri o'tgan vaqt. `progress` o'zgarmasa o'sadi.
// Ikkinchisi «samarasiz urinish» o'lchovi: to'g'ri yo'ldan ketayotgan o'quvchi (progress
// o'sib turadi) hech qachon «tiqilib qolgan» deb belgilanmaydi.
//
// Mentor rejimida klapan UMUMAN ishlamaydi — u topshiriqni bajarmaydi, kuzatadi.
//
// API:  const { tip, rescue } = useStuckValve(done, progress)
//   done      — ekran ochilish sharti (bool)
//   progress  — siljish o'lchovi (son): seen.size · step · added · bajarilgan amallar soni
//   tip       — ipucha ko'rsatiladimi
//   rescue    — «Davom etish» ochiladimi (ball YO'Q, yo'l ochiq)
//
// 🔴 BALL-HALOLLIGI (§157 · 136-qonun): rescue bilan o'tilganda ekran
// `solved: true, correct: false` yozadi — o'quvchi chiqadi, statistika «topdi» demaydi.
const VALVE_TIP_SEC = 40, VALVE_TIP_IDLE = 25;
const VALVE_RES_SEC = 110, VALVE_RES_IDLE = 60;
function useStuckValve(done, progress = 0) {
  const _gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(_gate.live && _gate.live.mode === 'mentor');
  const [sec, setSec] = useState(0);
  const [idle, setIdle] = useState(0);
  const lastProg = useRef(progress);
  useEffect(() => {
    if (lastProg.current !== progress) { lastProg.current = progress; setIdle(0); }
  }, [progress]);
  useEffect(() => {
    if (done || isMentor) return;
    const t = setInterval(() => { setSec(v => v + 1); setIdle(v => v + 1); }, 1000);
    return () => clearInterval(t);
  }, [done, isMentor]);
  const live = !done && !isMentor;
  return {
    tip: live && (sec >= VALVE_TIP_SEC || idle >= VALVE_TIP_IDLE),
    rescue: live && (sec >= VALVE_RES_SEC || idle >= VALVE_RES_IDLE),
    isMentor,
  };
}
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [tried, setTried] = useState(!!storedAnswer);
  const [shakeId, setShakeId] = useState(null);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const poke = (id) => { setTried(true); clearTimeout(timer.current); setShakeId(id); timer.current = setTimeout(() => setShakeId(null), 450); };
  const OPTS = [
    { id: 'a', label: { uz: "Hech narsa — ko'rsatgani yetadi", ru: 'Ничего — показывать достаточно' } },
    { id: 'b', label: { uz: "Ma'lumot doimiy saqlanadigan joy — server va baza", ru: 'Место, где данные хранятся постоянно, — сервер и база' } },
    { id: 'c', label: { uz: "Ko'proq rang va animatsiya", ru: 'Больше цветов и анимации' } }
  ];
  const pick = (v) => { if (picked !== null || !tried) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: v === 'b' }); };
  return (
    <Stage eyebrow={{ uz: 'Kirish', ru: 'Введение' }} screen={screen} scrollSignal={picked !== null} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 860 }}>{tr({ uz: <>Saytdagi mashinalar ro'yxatini nega <span className="italic" style={{ color: T.accent }}>o'zgartirib bo'lmaydi</span>?</>, ru: <>Почему список машин на сайте <span className="italic" style={{ color: T.accent }}>нельзя изменить</span>?</> })}</h1>
        <Mentor>{tr({ uz: <>Mana Modul 3'da qurgan <b style={{ color: T.ink }}>AvtoIjara</b> saytingiz. Lekin mashinalar ro'yxati <span className="mono">App.jsx</span> faylining <b style={{ color: T.ink }}>ichiga to'g'ridan-to'g'ri yozib qo'yilgan</b> — hech qayerda saqlanmagan. Yangi mashina <b style={{ color: T.ink }}>qo'shmoqchi</b> bo'lib ko'ring yoki bittasini <b style={{ color: T.ink }}>o'chiring</b> — nima sezasiz?</>, ru: <>Вот ваш сайт <b style={{ color: T.ink }}>AvtoIjara</b>, собранный в Модуле 3. Но список машин <b style={{ color: T.ink }}>вписан прямо внутрь</b> файла <span className="mono">App.jsx</span> — он нигде не хранится. Попробуйте <b style={{ color: T.ink }}>добавить</b> новую машину или <b style={{ color: T.ink }}>удалить</b> одну — что заметите?</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <div className="fade-up delay-1">
              <Win title="localhost:5173 — AvtoIjara">
                <div className="app-hd">
                  <span className="app-brand"><span className="app-logo">🚗</span> AvtoIjara</span>
                  <button className={`chip ${shakeId === 'add' ? 'shake' : ''}`} onClick={() => poke('add')} style={{ padding: '6px 12px', fontSize: 12.5 }}>{tr({ uz: "+ Mashina qo'shish", ru: '+ Добавить машину' })}</button>
                </div>
                <CardGrid cols={3}>
                  {CARS.map(c => (<div key={c.id} className={shakeId === c.id ? 'shake' : ''}><CarCard car={c} onDelete={() => poke(c.id)} /></div>))}
                </CardGrid>
              </Win>
            </div>
            <pre className="code-box fade-up delay-2" style={{ padding: '10px 14px', lineHeight: 1.85 }}>
              <Jx>{'const'}</Jx>{' cars = [ { nom: '}<St>"Cobalt"</St>{', ... }, ... ];'}{'\n'}
              <Cm>{tr({ uz: "// ↑ ro'yxat kod ichida — bazada saqlanmagan", ru: '// ↑ список внутри кода — в базе не хранится' })}</Cm>
            </pre>
            {tried && <p className="small fade-step" style={{ color: T.accent, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Tugma bor — lekin hech narsa o'zgarmadi. Ro'yxat kod ichida qotib qolgan, orqada server yo'q!", ru: 'Кнопка есть — но ничего не изменилось. Список застыл в коде, за ним нет сервера!' })}</p>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: "Haqiqiy AvtoIjara ilovasiga faqat ko'rsatish yetarli emas. Yana nima kerak?", ru: 'Настоящему приложению AvtoIjara мало просто показывать. Что ещё нужно?' })}</p>
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
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Avval tugmalarni bosib ko'ring ←", ru: 'Сначала понажимайте кнопки ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{picked === 'b'
              ? tr({ uz: <>Aniq! Mashinalar qo'lda yozilgan — yangisini qo'shish uchun har safar kodni ochish kerak, sahifani yangilasangiz o'zgarish yo'qoladi. Bugun ma'lumotni <b>doimiy bazada</b> saqlaydigan va <b>boshqariladigan</b> backend quramiz.</>, ru: <>Точно! Машины вписаны вручную — чтобы добавить новую, каждый раз надо открывать код, а обновите страницу — изменения пропадут. Сегодня построим backend, который хранит данные в <b>постоянной базе</b> и умеет <b>управлять</b> ими.</> })
              : tr({ uz: <>Aslida ko'rsatishning o'zi yetmaydi — mashina <b>qo'shilsa</b>, <b>o'chirilsa</b>, saqlanib qolishi kerak. Buni bugun <b>qurasiz</b>.</>, ru: <>На самом деле показать — мало: если машину <b>добавили</b> или <b>удалили</b>, это должно сохраниться. Именно это вы сегодня <b>построите</b>.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (ME'MOR → REJISSYOR → NAZORATCHI) =====
const Screen1 = ({ screen, answers, onNext, onPrev }) => {
  const STEPS = [
    { text: { uz: 'Sxemani siz chizasiz', ru: 'Схему рисуете вы' }, tag: { uz: "ME'MOR — loyihachi", ru: 'АРХИТЕКТОР — проектировщик' } },
    { text: { uz: "Express'ni bazaga ulaysiz", ru: 'Подключаете Express к базе' }, tag: { uz: "pool.query — ko'prik", ru: 'pool.query — мост' } },
    { text: { uz: "AI'ga buyruq berib kod yozdirasiz", ru: 'Командуете AI — он пишет код' }, tag: { uz: 'REJISSYOR — buyruq beruvchi', ru: 'РЕЖИССЁР — отдаёт команды' } },
    { text: { uz: 'Postman bilan tekshirasiz', ru: 'Проверяете через Postman' }, tag: { uz: 'NAZORATCHI — sinovchi', ru: 'КОНТРОЛЁР — испытатель' } }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: "Dars oxirida — sizning backend'ingiz", ru: 'В конце урока — ваш backend' })}</p>
      <div className="pm">
        <div className="pm-bar"><MBadge m="GET" /><span className="pm-url">localhost:3000/api/cars</span><span className="pm-send-static">Send</span></div>
        <div className="pm-body"><Resp status={200} text="OK" json={'[\n  { "id": 1, "nom": "Cobalt", "narx": 280000 },\n  { "id": 2, "nom": "Malibu", "narx": 520000 }\n]'} /></div>
      </div>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: "→ mashinalar endi bazadan keladi — qo'shish · o'qish · o'zgartirish · o'chirish", ru: '→ машины теперь приходят из базы — добавить · прочитать · изменить · удалить' })}</p>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 4 qadam', ru: 'Сегодняшние 4 шага' })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span>{s.tag && <span className="step-tag">{tr(s.tag)}</span>}</span></li>))}
      </ol>
    </Col>
  );
  return (
    <Stage eyebrow={{ uz: 'Reja', ru: 'План' }} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>AvtoIjara'ni <span className="italic" style={{ color: T.accent }}>haqiqiy ilovaga</span> qanday aylantiramiz?</>, ru: <>Как превратить AvtoIjara <span className="italic" style={{ color: T.accent }}>в настоящее приложение</span>?</> })}</h2>
        </div>
        <RolePassport answers={answers} />
        <Mentor>{tr({ uz: <>Bu yo'lda siz <b style={{ color: T.ink }}>uchta rolni</b> o'ynaysiz. <b style={{ color: T.ink }}>ME'MOR</b> — me'mor binoni chizganidek, siz ma'lumot sxemasini chizasiz. <b style={{ color: T.ink }}>REJISSYOR</b> — rejissyor aktyorga ko'rsatma berganidek, siz AI'ga aniq buyruq berasiz. <b style={{ color: T.ink }}>NAZORATCHI</b> — natijani Postman bilan o'zingiz sinab tekshirasiz. Avval har qadamni tushunasiz, keyin loyihani bitirasiz.</>, ru: <>На этом пути вы сыграете <b style={{ color: T.ink }}>три роли</b>. <b style={{ color: T.ink }}>АРХИТЕКТОР</b> — как архитектор чертит здание, вы чертите схему данных. <b style={{ color: T.ink }}>РЕЖИССЁР</b> — как режиссёр даёт указания актёру, вы даёте AI точную команду. <b style={{ color: T.ink }}>КОНТРОЛЁР</b> — сами проверяете результат через Postman. Сначала поймёте каждый шаг, потом закончите проект.</> })}</Mentor>
        {!isNarrow ? (
          <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable>
        ) : !showSteps ? (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "Bugungi 4 qadamni ko'rish", ru: 'Посмотреть 4 шага на сегодня' })}</button>
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

// ===== SCREEN 2 — ME'MOR: SXEMANI QO'LDA LOYIHALASH =====
const Screen2 = ({ screen, answers, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(storedAnswer ? new Set(COLUMNS.map(c => c.key)) : new Set());
  const done = seen.size >= COLUMNS.length;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, seen.size);   // 13-band klapan
  const tap = (k) => { setActive(k); setSeen(prev => { const s = new Set(prev); s.add(k); return s; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = COLUMNS.find(c => c.key === active);
  return (
    <Stage eyebrow={{ uz: "1-qadam · ME'MOR", ru: 'Шаг 1 · АРХИТЕКТОР' }} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={(done || _resc) ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `${seen.size}/${COLUMNS.length} ustun ko'rildi`, ru: `Столбцов просмотрено: ${seen.size}/${COLUMNS.length}` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Mashinalar haqida bazada <span className="italic" style={{ color: T.accent }}>qaysi ma'lumotni</span> saqlaymiz?</>, ru: <>Какие данные о машинах <span className="italic" style={{ color: T.accent }}>будем хранить</span> в базе?</> })}</h2></div>
        <RolePassport answers={answers} active="memor" />
        <Mentor>{tr({ uz: <>AI kod yozishidan oldin <b style={{ color: T.ink }}>siz</b> qaror qilasiz: <span className="mono">cars</span> jadvalida qaysi ustunlar bo'ladi? Har ustun bitta narsani saqlaydi. Ustunlarni bosib, nima saqlashini ko'ring — pastda <span className="mono">CREATE TABLE</span> yig'iladi.</>, ru: <>Прежде чем AI напишет код, <b style={{ color: T.ink }}>вы</b> решаете: какие столбцы будут в таблице <span className="mono">cars</span>? Каждый столбец хранит одну вещь. Нажимайте на столбцы и смотрите, что они хранят — внизу соберётся <span className="mono">CREATE TABLE</span>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'cars jadvali — ustunlar', ru: 'таблица cars — столбцы' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {COLUMNS.map((c, i) => {
                const on = active === c.key;
                const isSeen = seen.has(c.key);
                return (
                  <button key={c.key} className={`vcard ${!isSeen ? 'tap-hint' : ''}`} onClick={() => tap(c.key)} style={{ boxShadow: on ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : undefined, animationDelay: `${i * 0.16}s` }}>
                    <span className={`vbadge ${c.key === 'id' ? 'pk' : ''}`}>{tr(c.type)}</span>
                    <span className="vlbl mono">{c.key}</span>
                    <span className={`vseen ${isSeen ? 'tick' : ''}`} style={{ color: isSeen ? T.success : T.ink3 }}>{isSeen ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
            {cur && <div className="sk-info" key={active}><p className="body" style={{ margin: 0, color: T.ink }}><b className="mono" style={{ color: T.accent }}>{cur.key}</b> — {tr(cur.desc)}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Tayyor sxema — SQL tilida', ru: 'Готовая схема — на языке SQL' })}</p>
            <pre className="code-box fade-up delay-1" style={{ lineHeight: 1.9 }}>
              <Jx>{'CREATE TABLE'}</Jx>{' cars ('}{'\n'}
              {COLUMNS.map(c => (
                <React.Fragment key={c.key}>
                  {'  '}<span style={{ opacity: seen.has(c.key) ? 1 : 0.3, background: active === c.key ? 'rgba(255,79,40,0.16)' : 'transparent', borderRadius: 4, padding: '1px 3px' }}><At>{c.key}</At>{' ' + c.sql.split(' ').slice(1).join(' ')}</span>{c.key !== 'bandmi' ? ',' : ''}{'\n'}
                </React.Fragment>
              ))}
              {');'}
            </pre>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Sxema tayyor! Har ustun aniq bitta narsani saqlaydi. <span className="mono">id SERIAL PRIMARY KEY</span> — har mashinaga takrorlanmas raqam beradi. Endi shu jadvalga Express'ni ulaymiz.</>, ru: <>Схема готова! Каждый столбец хранит ровно одну вещь. <span className="mono">id SERIAL PRIMARY KEY</span> даёт каждой машине уникальный номер. Теперь подключим к этой таблице Express.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr({ uz: "💡 Hali ochilmagan ustun bor — jadvaldagi kulrang qatorni bosing.", ru: '💡 Есть непросмотренный столбец — нажмите на серую строку в таблице.' })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: 'Остальное разберём вместе позже — «Продолжить» открыто.' })}</p>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — pg KO'PRIK (Express ↔ PostgreSQL) =====
const CHAIN = ['Front', 'Express', 'pool.query', 'PostgreSQL', { uz: 'javob', ru: 'ответ' }];
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? CHAIN.length : -1);
  const done = step >= CHAIN.length - 1;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, step);   // 13-band klapan
  const advance = () => setStep(s => Math.min(s + 1, CHAIN.length - 1));
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: "2-qadam · ko'prik", ru: 'Шаг 2 · мост' }} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={(done || _resc) ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Zanjirni yuring — ${step + 1}/${CHAIN.length}`, ru: `Пройдите цепочку — ${step + 1}/${CHAIN.length}` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Express baza bilan <span className="italic" style={{ color: T.accent }}>qanday</span> gaplashadi?</>, ru: <>Как Express <span className="italic" style={{ color: T.accent }}>разговаривает</span> с базой?</> })}</h2></div>
        <Mentor>{tr({ uz: <>SQL darsida so'rovlarni yozdingiz — lekin ularni kim yuboradi? <b style={{ color: T.ink }}>Express</b> server, <span className="mono">pg</span> kutubxonasi orqali. <span className="mono">pool</span> — server bilan baza orasidagi <b style={{ color: T.ink }}>ko'prik</b>: <span className="mono">pool.query('...')</span> SQL'ni bazaga olib boradi va javobni qaytaradi. So'rovni qadam-qadam kuzating.</>, ru: <>На уроке SQL вы писали запросы — но кто их отправляет? Сервер <b style={{ color: T.ink }}>Express</b>, через библиотеку <span className="mono">pg</span>. <span className="mono">pool</span> — <b style={{ color: T.ink }}>мост</b> между сервером и базой: <span className="mono">pool.query('...')</span> доставляет SQL в базу и возвращает ответ. Проследите запрос шаг за шагом.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <pre className="code-box fade-up delay-1" style={{ lineHeight: 1.9 }}>
              <Jx>{'const'}</Jx>{' { Pool } = '}<At>require</At>{'('}<St>'pg'</St>{');'}{'\n'}
              <Jx>{'const'}</Jx>{' pool = '}<Jx>new</Jx>{' Pool({ database: '}<St>'avtoijara'</St>{' });'}{'\n\n'}
              <Cm>{tr({ uz: "// so'rov — ko'prik orqali bazaga:", ru: '// запрос — через мост в базу:' })}</Cm>{'\n'}
              <Jx>{'const'}</Jx>{' result = '}<At>await</At>{' '}<span style={{ background: 'rgba(255,79,40,0.16)', borderRadius: 5, padding: '1px 5px' }}>pool.query(<St>'SELECT * FROM cars'</St>)</span>{';'}
            </pre>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done} onClick={advance}>{step < 0 ? tr({ uz: "▶ So'rovni yuborish", ru: '▶ Отправить запрос' }) : (done ? tr({ uz: '✓ Yetib bordi', ru: '✓ Дошёл' }) : tr({ uz: 'Keyingi qadam →', ru: 'Следующий шаг →' }))}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "So'rovning yo'li", ru: 'Путь запроса' })}</p>
            <div className="chain fade-up delay-1">
              {CHAIN.map((c, i) => {
                const lit = step >= i;
                return (
                  <React.Fragment key={i}>
                    <div className={`chain-node ${lit ? 'lit' : ''}`} style={{ background: lit ? T.accent : T.paper, color: lit ? '#fff' : T.ink3, boxShadow: lit ? `0 6px 16px -5px rgba(255,79,40,0.45)` : `0 4px 12px -6px rgba(${T.shadowBase},0.16)` }}>{tr(c)}</div>
                    {i < CHAIN.length - 1 && <span className={`chain-arr ${step > i ? 'flow' : ''}`} style={{ color: step > i ? T.accent : T.ink3 }}>→</span>}
                  </React.Fragment>
                );
              })}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mana ko'prik! Front so'raydi → Express qabul qiladi → <span className="mono">pool.query</span> SQL'ni PostgreSQL'ga olib boradi → javob qaytadi. <span className="mono">pool.query</span> bo'lmasa, server baza bilan gaplasha olmaydi.</>, ru: <>Вот мост! Фронт просит → Express принимает → <span className="mono">pool.query</span> несёт SQL в PostgreSQL → ответ возвращается. Без <span className="mono">pool.query</span> сервер не может говорить с базой.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr({ uz: "💡 Zanjirning keyingi bo'g'inini bosing — so'rov Front'dan PostgreSQL'gacha boradi.", ru: '💡 Нажмите следующее звено — запрос идёт от Front до PostgreSQL.' })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: 'Остальное разберём вместе позже — «Продолжить» открыто.' })}</p>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 (sxema / PRIMARY KEY) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={{ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' }}
    questionText="Har mashinaning takrorlanmas raqami uchun qaysi ustun to'g'ri?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Har mashinaning <span className="italic" style={{ color: T.accent }}>takrorlanmas raqami</span> uchun qaysi ustun?</>, ru: <>Какой столбец нужен для <span className="italic" style={{ color: T.accent }}>уникального номера</span> каждой машины?</> })}</h2></>}
    options={['nom TEXT', 'id SERIAL PRIMARY KEY', 'narx INTEGER NOT NULL', 'bandmi BOOLEAN']} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! PRIMARY KEY har qatorni yagona qiladi, SERIAL esa raqamni avtomatik o'stiradi (1, 2, 3…). Shuning uchun har mashinaning o'z id'si bo'ladi.", ru: 'Верно! PRIMARY KEY делает каждую строку уникальной, а SERIAL автоматически увеличивает номер (1, 2, 3…). Поэтому у каждой машины свой id.' }}
    explainWrong={{
      0: { uz: "nom — bu mashina nomi (matn), takrorlanishi mumkin. Yagona raqam uchun id SERIAL PRIMARY KEY.", ru: 'nom — это название машины (текст), оно может повторяться. Для уникального номера — id SERIAL PRIMARY KEY.' },
      2: { uz: "narx — ijara narxi (son), bir xil bo'lishi mumkin. Takrorlanmas raqam — id SERIAL PRIMARY KEY.", ru: 'narx — цена аренды (число), может совпадать. Уникальный номер — id SERIAL PRIMARY KEY.' },
      3: { uz: "bandmi — ha/yo'q qiymati. Takrorlanmas raqam emas. To'g'risi — id SERIAL PRIMARY KEY.", ru: 'bandmi — значение да/нет. Это не уникальный номер. Правильно — id SERIAL PRIMARY KEY.' },
      default: { uz: "Takrorlanmas raqam = id SERIAL PRIMARY KEY.", ru: 'Уникальный номер = id SERIAL PRIMARY KEY.' }
    }} />
);

// ===== SCREEN 5 — REJISSYOR: AI'GA ANIQ PROMPT TANLASH (3 promptdan) =====
const PROMPTS = [
  { id: 'a', text: { uz: "Menga mashinalar kerak.", ru: 'Мне нужны машины.' }, precise: false, why: { uz: "Juda noaniq — AI qaysi method, qaysi manzil yoki qaysi SQL kerakligini bilmaydi. Bunday buyruqdan xato kod chiqadi.", ru: 'Слишком расплывчато — AI не знает, какой метод, какой адрес и какой SQL нужны. Из такой команды выйдет ошибочный код.' } },
  { id: 'b', text: { uz: "GET /api/cars yarat — pool.query bilan SELECT * FROM cars qilib, natijani res.json bilan qaytar.", ru: 'Создай GET /api/cars — через pool.query сделай SELECT * FROM cars и верни результат через res.json.' }, precise: true, why: { uz: "Aniq buyruq! Method (GET), manzil (/api/cars), amal (SELECT * FROM cars) va javob (res.json) — hammasi aytilgan. AI to'g'ri endpoint yozadi.", ru: 'Точная команда! Метод (GET), адрес (/api/cars), действие (SELECT * FROM cars) и ответ (res.json) — всё названо. AI напишет правильный endpoint.' } },
  { id: 'c', text: { uz: "Bazadan biror narsa olib chiqadigan kod yoz.", ru: 'Напиши код, который что-то достаёт из базы.' }, precise: false, why: { uz: "Noaniq — qaysi jadval, qaysi method, qanday javob? AI taxmin qiladi va ko'pincha xato kod chiqaradi. Aniq buyring.", ru: 'Неточно — какая таблица, какой метод, какой ответ? AI будет гадать и часто выдаёт ошибочный код. Командуйте точно.' } }
];
const Screen5 = ({ screen, answers, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const done = picked != null && PROMPTS.find(p => p.id === picked)?.precise;
  const cur = PROMPTS.find(p => p.id === picked);
  const choose = (id) => {
    if (done) return;
    setPicked(id);
    const ok = !!PROMPTS.find(p => p.id === id)?.precise;
    if (ok) onAnswer(screen, { stage: null, screenIdx: screen, picked: id, correct: true, solved: true });
  };
  return (
    <Stage eyebrow={{ uz: '3-qadam · REJISSYOR', ru: 'Шаг 3 · РЕЖИССЁР' }} screen={screen} scrollSignal={picked != null} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Aniq promptni tanlang', ru: 'Выберите точный промпт' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI'ga qaysi buyruq <span className="italic" style={{ color: T.accent }}>to'g'ri kod</span> yozdiradi?</>, ru: <>Какая команда заставит AI написать <span className="italic" style={{ color: T.accent }}>правильный код</span>?</> })}</h2></div>
        <RolePassport answers={answers} active="rejissyor" />
        <Mentor>{tr({ uz: <>Rejissyor aktyorga aniq ko'rsatma beradi: qayerda turishini, qaysi gapni aytishini. AI'ga ham xuddi shunday <b style={{ color: T.ink }}>aniq</b> buyring: qaysi <span className="mono">method</span>, qaysi manzil, qaysi SQL va qanday javob. Shunda AI to'g'ri <b style={{ color: T.ink }}>endpoint</b> yozadi — endpoint bu bitta manzilga javob beradigan kod bo'lagi. Pastdagi uch buyruqdan <b style={{ color: T.ink }}>eng aniq</b>ini tanlang: noaniq buyruq xato kodga olib boradi.</>, ru: <>Режиссёр даёт актёру точные указания: где стоять, какую реплику говорить. Командуйте AI так же <b style={{ color: T.ink }}>точно</b>: какой <span className="mono">method</span>, какой адрес, какой SQL и какой ответ. Тогда AI напишет правильный <b style={{ color: T.ink }}>endpoint</b> — endpoint — это кусок кода, отвечающий на один адрес. Выберите из трёх команд <b style={{ color: T.ink }}>самую точную</b>: расплывчатая команда ведёт к ошибочному коду.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Uch prompt — birini tanlang', ru: 'Три промпта — выберите один' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {PROMPTS.map(p => {
                const on = picked === p.id;
                let cls = 'hook-option';
                if (on) cls += p.precise ? ' on' : '';
                return (
                  <button key={p.id} className={cls} disabled={done} onClick={() => choose(p.id)} style={on && !p.precise ? { boxShadow: `inset 0 0 0 1.5px ${T.danger}`, background: T.dangerSoft, color: T.danger } : undefined}>
                    <span className="you-badge">{tr({ uz: 'Siz', ru: 'Вы' })}</span>
                    <span style={{ flex: 1, textAlign: 'left' }}>{tr(p.text)}</span>
                  </button>
                );
              })}
            </div>
            {cur && <div className={cur.precise ? 'frame-success fade-step' : 'frame-warn fade-step'}><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.why)}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Natija — Postman bilan sinab ko'ring", ru: 'Результат — проверьте через Postman' })}</p>
            <div className="pm">
              <div className="pm-bar"><MBadge m="GET" /><span className="pm-url">localhost:3000/api/cars</span><span className="pm-send-static">Send</span></div>
              <div className="pm-body">
                {done
                  ? <><div className="ai-code fade-step" style={{ marginBottom: 8 }}><div className="ai-line ok" style={{ cursor: 'default', whiteSpace: 'pre-wrap' }}>{"app.get('/api/cars', async (req, res) => {\n  const result = await pool.query('SELECT * FROM cars');\n  res.json(result.rows);\n});"}</div></div><Resp status={200} text="OK" json={'[\n  { "id": 1, "nom": "Cobalt", "narx": 280000, "yil": 2022 },\n  { "id": 2, "nom": "Malibu", "narx": 520000, "yil": 2023 },\n  { "id": 3, "nom": "Kia K5", "narx": 610000, "yil": 2023 }\n]'} /></>
                  : <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{tr({ uz: "Aniq promptni tanlang — AI to'g'ri endpoint yozadi, GET javobi shu yerda ko'rinadi…", ru: 'Выберите точный промпт — AI напишет правильный endpoint, ответ GET появится здесь…' })}</p>}
              </div>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Aniq buyruq — to'g'ri kod! <span className="mono">SELECT * FROM cars</span> barcha qatorni oldi, <span className="mono">res.json</span> uni frontga JSON qilib qaytardi.</>, ru: <>Точная команда — правильный код! <span className="mono">SELECT * FROM cars</span> взял все строки, <span className="mono">res.json</span> вернул их фронту в виде JSON.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5b — TEST 2 (READ mapping) =====
const Screen5b = (props) => (
  <QuestionScreen {...props} idx={6} scope="module-mikro" eyebrow={{ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' }}
    questionText="Barcha mashinalarni frontga qaytaradigan to'g'ri juftlik qaysi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Barcha mashinalarni <span className="italic" style={{ color: T.accent }}>qaytarish</span> uchun qaysi juftlik?</>, ru: <>Какая пара нужна, чтобы <span className="italic" style={{ color: T.accent }}>вернуть</span> все машины?</> })}</h2></>}
    options={['POST /api/cars → INSERT INTO cars', 'DELETE /api/cars → SELECT * FROM cars', 'GET /api/cars → DELETE FROM cars', 'GET /api/cars → SELECT * FROM cars']} correctIdx={3}
    explainCorrect={{ uz: "To'g'ri! GET = o'qish, SELECT = bazadan olish. Ikkalasi 'ma'lumot olish' degani — shuning uchun juftlik mos.", ru: "Верно! GET = чтение, SELECT = взять из базы. Оба означают 'получить данные' — поэтому пара подходит." }}
    explainWrong={{
      0: { uz: "POST/INSERT — bu yangi qo'shish, o'qish emas. O'qish uchun GET → SELECT.", ru: 'POST/INSERT — это добавление нового, а не чтение. Для чтения GET → SELECT.' },
      1: { uz: "DELETE method o'chirish uchun. O'qish uchun GET → SELECT * FROM cars.", ru: 'Метод DELETE — для удаления. Для чтения GET → SELECT * FROM cars.' },
      2: { uz: "GET o'qish uchun, lekin DELETE o'chiradi — mos emas. To'g'risi GET → SELECT.", ru: 'GET — для чтения, но DELETE удаляет — пара не совпадает. Правильно GET → SELECT.' },
      default: { uz: "O'qish = GET → SELECT * FROM cars.", ru: 'Чтение = GET → SELECT * FROM cars.' }
    }} />
);

// ===== SCREEN 6 — CREATE (POST → INSERT, $1 $2 $3) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [rows, setRows] = useState(storedAnswer ? [...CARS, POOL_CARS[0]] : CARS);
  const [last, setLast] = useState(null);
  const added = rows.length - CARS.length;
  const done = added >= 1;
  const remaining = POOL_CARS.filter(p => !rows.some(r => r.id === p.id));
  const addOne = (c) => { setRows(prev => prev.some(x => x.id === c.id) ? prev : [...prev, c]); setLast(c.id); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const newCar = remaining[0];
  return (
    <Stage eyebrow={{ uz: "Create · qo'shish", ru: 'Create · добавление' }} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Bitta mashina POST qiling', ru: 'Отправьте POST с одной машиной' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yangi mashina bazaga <span className="italic" style={{ color: T.accent }}>qanday</span> qo'shiladi?</>, ru: <>Как новая машина <span className="italic" style={{ color: T.accent }}>добавляется</span> в базу?</> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: T.ink }}>POST</b> so'rovi <span className="mono">body</span>'da ma'lumot yuboradi, server uni <span className="mono">INSERT</span> bilan bazaga yozadi. Qiymatlarni to'g'ridan-to'g'ri SQL'ga yopishtirmaymiz — o'rniga <span className="mono">$1, $2, $3</span> qo'yamiz va massivda beramiz. Bu — <b style={{ color: T.ink }}>xavfsiz</b> usul: foydalanuvchi yuborgan matn kod emas, faqat oddiy qiymat bo'lib qoladi. POST yuborib ko'ring.</>, ru: <>Запрос <b style={{ color: T.ink }}>POST</b> отправляет данные в <span className="mono">body</span>, сервер записывает их в базу через <span className="mono">INSERT</span>. Мы не вклеиваем значения прямо в SQL — ставим <span className="mono">$1, $2, $3</span> и передаём массивом. Это <b style={{ color: T.ink }}>безопасный</b> способ: присланный пользователем текст остаётся просто значением, а не кодом. Попробуйте отправить POST.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Postman — POST so'rovi", ru: 'Postman — запрос POST' })}</p>
            <div className="pm">
              <div className="pm-bar"><MBadge m="POST" /><span className="pm-url">localhost:3000/api/cars</span>
                {newCar && <button className="pm-send btn-soft" onClick={() => addOne(newCar)} disabled={!newCar}>Send</button>}
              </div>
              <div className="pm-body">
                <p className="flow-label" style={{ margin: '0 0 6px' }}>Body (JSON)</p>
                <pre className="json">{newCar ? `{ "nom": "${newCar.nom}", "narx": ${newCar.narx}, "yil": ${newCar.yil} }` : '{ ... }'}</pre>
                {last && <Resp status={201} text="Created" json={`{ "status": "qo'shildi", "id": ${last} }`} />}
              </div>
            </div>
            <pre className="code-box fade-up delay-1" style={{ lineHeight: 1.85, padding: '10px 14px' }}>
              {'pool.query(\n  '}
              <St>{"'INSERT INTO cars (nom, narx, yil)\n   VALUES ("}</St>
              <At>{'$1, $2, $3'}</At>
              <St>{")'"}</St>
              {',\n  [nom, narx, yil]\n);'}
            </pre>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'PostgreSQL — cars jadvali', ru: 'PostgreSQL — таблица cars' })}</p>
            <DbTable rows={rows} flashId={last} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Yangi qator paydo bo'ldi! Server <span className="mono">201 Created</span> qaytardi. <span className="mono">$1, $2, $3</span> body'dagi qiymatlar bilan to'ldirildi va bazaga yozildi.</>, ru: <>Появилась новая строка! Сервер вернул <span className="mono">201 Created</span>. <span className="mono">$1, $2, $3</span> заполнились значениями из body и записались в базу.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — UPDATE + DELETE (:id route param) =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [rows, setRows] = useState(CARS);
  const [didUpd, setDidUpd] = useState(!!storedAnswer);
  const [didDel, setDidDel] = useState(!!storedAnswer);
  const [flash, setFlash] = useState(null);
  const [dim, setDim] = useState(null);
  const done = didUpd && didDel;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, (didUpd ? 1 : 0) + (didDel ? 1 : 0));   // 13-band klapan
  const lower = (id) => { setRows(prev => prev.map(r => r.id === id ? { ...r, narx: Math.max(100000, r.narx - 50000) } : r)); setDidUpd(true); setFlash(id); setTimeout(() => setFlash(null), 600); };
  const del = (id) => { setDim(id); setTimeout(() => { setRows(prev => prev.filter(r => r.id !== id)); setDidDel(true); setDim(null); }, 350); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow="Update · Delete" screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={(done || _resc) ? { uz: 'Davom etish', ru: 'Продолжить' } : (didUpd ? { uz: "Endi bittasini o'chiring", ru: 'Теперь удалите одну' } : { uz: "Narxni o'zgartiring", ru: 'Измените цену' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta mashinani o'zgartirish — <span className="italic" style={{ color: T.accent }}>qaysi birini</span> server qayerdan biladi?</>, ru: <>Изменить одну машину — откуда сервер знает, <span className="italic" style={{ color: T.accent }}>какую именно</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Manzildagi <span className="mono">:id</span> — bu o'zgaruvchi (routing darsidan tanish). <span className="mono">PUT /api/cars/<b style={{ color: T.ink }}>2</b></span> — "2-raqamli mashinani o'zgartir" degani. SQL'da <span className="mono">WHERE id = $1</span> aynan o'shani topadi. Bitta mashina narxini tushiring, bittasini o'chiring.</>, ru: <><span className="mono">:id</span> в адресе — это переменная (знакома по уроку про роутинг). <span className="mono">PUT /api/cars/<b style={{ color: T.ink }}>2</b></span> значит «измени машину номер 2». В SQL её находит <span className="mono">WHERE id = $1</span>. Снизьте цену одной машины и удалите одну.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <pre className="code-box fade-up delay-1" style={{ lineHeight: 1.85, padding: '11px 14px' }}>
              <Cm>{tr({ uz: '// PUT — narxni yangilash', ru: '// PUT — обновить цену' })}</Cm>{'\n'}
              {'app.put('}<St>'/api/cars/:id'</St>{', ...);'}{'\n'}
              {'  UPDATE cars SET narx=$1 '}<At>WHERE id=$2</At>{'\n\n'}
              <Cm>{tr({ uz: "// DELETE — o'chirish", ru: '// DELETE — удалить' })}</Cm>{'\n'}
              {'app.delete('}<St>'/api/cars/:id'</St>{', ...);'}{'\n'}
              {'  DELETE FROM cars '}<At>WHERE id=$1</At>
            </pre>
            <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <><span className="mono" style={{ color: T.ink }}>:id</span> manzilda keladi (<span className="mono">req.params.id</span>), <span className="mono">WHERE id = $1</span> bazada aynan o'sha qatorni topadi.</>, ru: <><span className="mono" style={{ color: T.ink }}>:id</span> приходит в адресе (<span className="mono">req.params.id</span>), а <span className="mono">WHERE id = $1</span> находит в базе именно ту строку.</> })}</p></div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'PostgreSQL — cars jadvali', ru: 'PostgreSQL — таблица cars' })}</p>
            <div className="db">
              <div className="db-cap">🗄️ <b>cars</b> <span>· {rows.length} {tr({ uz: 'qator', ru: 'строк' })}</span></div>
              <div className="db-row db-head"><span>id</span><span>nom</span><span>narx</span><span>{tr({ uz: 'amal', ru: 'действие' })}</span></div>
              {rows.map(r => (
                <div key={r.id} className={`db-row el-in ${flash === r.id ? 'flash' : ''}`} style={{ opacity: dim === r.id ? 0.3 : 1 }}>
                  <span>{r.id}</span><span>{r.nom}</span><span>{sp(r.narx)}</span>
                  <span style={{ display: 'flex', gap: 5 }}>
                    <button className="db-btn" style={{ color: T.amber }} onClick={() => lower(r.id)} title={tr({ uz: 'PUT — narxni tushir', ru: 'PUT — снизить цену' })}>PUT</button>
                    <button className="db-btn" style={{ color: T.danger }} onClick={() => del(r.id)} title={tr({ uz: "DELETE — o'chir", ru: 'DELETE — удалить' })}>DEL</button>
                  </span>
                </div>
              ))}
            </div>
            <div className="fade-up delay-2" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              <span className="tagpill" style={{ color: didUpd ? T.success : T.ink3 }}>{didUpd ? '✓' : '○'} {tr({ uz: 'PUT — yangiladim', ru: 'PUT — обновлено' })}</span>
              <span className="tagpill" style={{ color: didDel ? T.success : T.ink3 }}>{didDel ? '✓' : '○'} {tr({ uz: "DELETE — o'chirdim", ru: 'DELETE — удалено' })}</span>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mana to'liq CRUD! <span className="mono">:id</span> + <span className="mono">WHERE id=$1</span> aniq bitta qatorni topib o'zgartiradi yoki o'chiradi — qolganlariga tegmaydi.</>, ru: <>Вот полный CRUD! <span className="mono">:id</span> + <span className="mono">WHERE id=$1</span> находят ровно одну строку, меняют или удаляют её — остальные не трогают.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr({ uz: "💡 Ikki amal kerak: narxni tushiring (UPDATE) va bitta qatorni o'chiring (DELETE).", ru: '💡 Нужны два действия: снизить цену (UPDATE) и удалить одну строку (DELETE).' })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: 'Остальное разберём вместе позже — «Продолжить» открыто.' })}</p>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST 3 (CRUD ↔ method ↔ SQL) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} idx={8} scope="module-mikro" eyebrow={{ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' }}
    questionText="Bazaga yangi mashina qo'shish uchun qaysi method va SQL?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Bazaga <span className="italic" style={{ color: T.accent }}>yangi mashina qo'shish</span> uchun?</>, ru: <>Что нужно, чтобы <span className="italic" style={{ color: T.accent }}>добавить в базу новую машину</span>?</> })}</h2></>}
    options={['GET → SELECT', 'PUT → UPDATE', 'POST → INSERT', 'DELETE → DELETE']} correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! POST = yaratish, INSERT = bazaga yangi qator yozish. Yangi mashina qo'shish — aynan shu.", ru: 'Верно! POST = создать, INSERT = записать в базу новую строку. Добавить новую машину — именно это.' }}
    explainWrong={{
      0: { uz: "GET → SELECT — bu o'qish (mavjudini ko'rsatish), yangi qo'shish emas. Qo'shish: POST → INSERT.", ru: 'GET → SELECT — это чтение (показать существующее), а не добавление. Добавление: POST → INSERT.' },
      1: { uz: "PUT → UPDATE — bu mavjud mashinani o'zgartirish, yangi qo'shish emas. To'g'risi: POST → INSERT.", ru: 'PUT → UPDATE — это изменение существующей машины, а не добавление новой. Правильно: POST → INSERT.' },
      3: { uz: "DELETE — o'chirish. Qo'shish uchun POST → INSERT.", ru: 'DELETE — удаление. Для добавления POST → INSERT.' },
      default: { uz: "Yangi qo'shish = POST → INSERT.", ru: 'Добавить новое = POST → INSERT.' }
    }} />
);

// ===== SCREEN 9 — NAZORATCHI: POSTMAN TEST + DOIMIYLIK =====
const Screen9 = ({ screen, answers, storedAnswer, onAnswer, onNext, onPrev }) => {
  // phase: 0 boshlang'ich · 1 POST yuborildi · 2 restart bosildi · 3 GET tasdiqlandi
  const [phase, setPhase] = useState(storedAnswer ? 3 : 0);
  const rows = phase >= 1 ? [...CARS, POOL_CARS[0]] : CARS;
  const done = phase >= 3;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const label = phase === 0 ? tr({ uz: '1) POST yuborish', ru: '1) Отправить POST' }) : phase === 1 ? tr({ uz: "2) Serverni o'chirib-yoqish", ru: '2) Перезапустить сервер' }) : phase === 2 ? tr({ uz: '3) GET — tekshirish', ru: '3) GET — проверить' }) : tr({ uz: '✓ Tasdiqlandi', ru: '✓ Подтверждено' });
  return (
    <Stage eyebrow={{ uz: '4-qadam · NAZORATCHI', ru: 'Шаг 4 · КОНТРОЛЁР' }} screen={screen} scrollSignal={phase > 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Uch qadamni bajaring', ru: 'Выполните три шага' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Server o'chsa — ma'lumot <span className="italic" style={{ color: T.accent }}>saqlanib qoladimi</span>?</>, ru: <>Если сервер выключится — данные <span className="italic" style={{ color: T.accent }}>сохранятся</span>?</> })}</h2></div>
        <RolePassport answers={answers} active="nazoratchi" />
        <Mentor>{tr({ uz: <>Eslang: Modul 3'da qo'shgan narsangiz sahifani yangilaganda yo'qolardi (faqat xotirada edi). Endi tekshiramiz: mashina <b style={{ color: T.ink }}>POST</b> qilamiz, keyin serverni <b style={{ color: T.ink }}>o'chirib-yoqamiz</b>, so'ng <b style={{ color: T.ink }}>GET</b> qilamiz — Spark hali ham bormi?</>, ru: <>Вспомните: в Модуле 3 добавленное пропадало при обновлении страницы (жило только в памяти). Теперь проверим: отправим машину через <b style={{ color: T.ink }}>POST</b>, затем <b style={{ color: T.ink }}>перезапустим</b> сервер, потом сделаем <b style={{ color: T.ink }}>GET</b> — Spark всё ещё там?</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done} onClick={() => setPhase(p => Math.min(p + 1, 3))}>{label}</button>
            <div className={`code-box ${phase === 2 ? 'srv-reboot' : ''}`} style={{ minHeight: 92, padding: '10px 13px' }}>
              <TLine cmd="node server.js" />
              {phase >= 1 && <TLine out={<span style={{ color: CODE.str }}>{tr({ uz: "✓ POST /api/cars → 201 (Spark qo'shildi)", ru: '✓ POST /api/cars → 201 (Spark добавлен)' })}</span>} />}
              {phase >= 2 && <><TLine out={<span style={{ color: CODE.comment }}>{tr({ uz: "^C  server to'xtadi…", ru: '^C  сервер остановился…' })}</span>} /><TLine cmd="node server.js" /><TLine out={<span style={{ color: CODE.comment }}>{tr({ uz: 'server qayta yondi :3000', ru: 'сервер снова запущен :3000' })}</span>} /></>}
              {phase >= 3 && <TLine out={<span style={{ color: CODE.str }}>{tr({ uz: '✓ GET /api/cars → 200 (4 qator — Spark joyida!)', ru: '✓ GET /api/cars → 200 (4 строки — Spark на месте!)' })}</span>} />}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'PostgreSQL — cars jadvali', ru: 'PostgreSQL — таблица cars' })}</p>
            <DbTable rows={rows} flashId={phase === 1 ? POOL_CARS[0].id : null} />
            {phase >= 1 && phase < 3 && <p className="small fade-step" style={{ color: T.ink2, fontStyle: 'italic', margin: 0 }}>{tr({ uz: <>Ma'lumot serverning xotirasida emas — <b>PostgreSQL</b>'da diskda yotibdi.</>, ru: <>Данные не в памяти сервера — они лежат на диске в <b>PostgreSQL</b>.</> })}</p>}
            {done && <div className="takeaway fade-step"><div className="ta-bulb">💾</div><p className="ta-h">{tr({ uz: "Ma'lumot saqlanib qoldi!", ru: 'Данные сохранились!' })}</p><p className="ta-sub">{tr({ uz: "Server o'chsa ham — baza yodida. Dars boshidagi muammo hal bo'ldi.", ru: 'Даже если сервер выключится — база всё помнит. Проблема из начала урока решена.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — AI DEBUGGING (column "price" does not exist) =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [picked, setPicked] = useState(storedAnswer ? 'bad' : null);
  const [fixed, setFixed] = useState(!!storedAnswer);
  const found = picked === 'bad';
  const done = fixed;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow="Debugging" screen={screen} scrollSignal={found || fixed} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : (found ? { uz: 'Endi tuzating', ru: 'Теперь исправьте' } : { uz: 'Xatoni toping', ru: 'Найдите ошибку' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Server xato qaytardi — bu bizga <span className="italic" style={{ color: T.accent }}>nimani aytmoqchi</span>?</>, ru: <>Сервер вернул ошибку — что он <span className="italic" style={{ color: T.accent }}>хочет нам сказать</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>POST yuborganda server <span className="mono" style={{ color: T.danger }}>500</span> qaytardi: <i>column "price" does not exist</i>. Bunday xatolar — kod yozishning <b style={{ color: T.ink }}>tabiiy qismi</b>; hatto AI ham adashishi mumkin, shuning uchun biz doim tekshiramiz. Eng yaxshisi: xato matni nima noto'g'ri ekanini <b style={{ color: T.ink }}>o'zi aytib beradi</b> — baza "price degan ustun yo'q" deyapti. Sxemamizda ustun nomi <span className="mono">narx</span> edi. Qaysi qatorda shu nom xato? Bosing.</>, ru: <>При POST сервер вернул <span className="mono" style={{ color: T.danger }}>500</span>: <i>column "price" does not exist</i>. Такие ошибки — <b style={{ color: T.ink }}>естественная часть</b> написания кода; даже AI может ошибиться, поэтому мы всегда проверяем. Лучшее в этом: текст ошибки <b style={{ color: T.ink }}>сам говорит</b>, что не так — база сообщает «нет столбца price». А в нашей схеме столбец назывался <span className="mono">narx</span>. В какой строке это имя ошибочно? Нажмите.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-1">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: "Qo'shish kodini yozdim:", ru: 'Я написал код добавления:' })}</span></div>
              <div className="ai-code">
                <div className={`ai-line ${picked === 'a' ? 'ok' : ''} ${!found ? 'scan' : ''}`} style={{ animationDelay: '0s' }} onClick={() => { if (!found) setPicked('a'); }}><Jx>{'const'}</Jx>{' { nom, narx, yil } = req.body;'}</div>
                {!fixed ? (
                  <div className={`ai-line ${found ? 'bad' : ''} ${!found ? 'scan' : ''}`} style={{ animationDelay: '0.5s' }} onClick={() => { if (!found) setPicked('bad'); }}>{"pool.query('INSERT INTO cars (nom, "}<At>price</At>{", yil)...');"}{'  '}<Cm>{'// price?'}</Cm></div>
                ) : (
                  <div className="ai-line ok fixed-line">{"pool.query('INSERT INTO cars (nom, "}<At>narx</At>{", yil)...');"}{'  '}<Cm>{'// ✓ narx'}</Cm></div>
                )}
                <div className={`ai-line ${picked === 'c' ? 'ok' : ''} ${!found ? 'scan' : ''}`} style={{ animationDelay: '1s' }} onClick={() => { if (!found) setPicked('c'); }}>{"res.json({ status: \"qo'shildi\" });"}</div>
              </div>
              {!found && <p className="ai-prompt">{tr({ uz: 'Qaysi qator bazadagi ustun nomiga mos emas? Bosing.', ru: 'Какая строка не совпадает с именем столбца в базе? Нажмите.' })}</p>}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={() => setFixed(true)}>{tr({ uz: '🔧 price → narx ga tuzatish', ru: '🔧 Исправить price → narx' })}</button>}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: 'normal', fontWeight: 600 }}>{tr({ uz: '✓ Tuzatildi — ustun nomi sxemaga mos: narx', ru: '✓ Исправлено — имя столбца совпадает со схемой: narx' })}</p>}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Server javobi', ru: 'Ответ сервера' })}</p>
            <div className="pm">
              <div className="pm-bar"><MBadge m="POST" /><span className="pm-url">localhost:3000/api/cars</span></div>
              <div className="pm-body">
                {fixed
                  ? <Resp status={201} text="Created" json={`{ "status": "qo'shildi" }`} />
                  : <Resp status={500} text="Server Error" json={'{\n  "error": "column \\"price\\" does not exist"\n}'} />}
              </div>
            </div>
            {!found && (picked === 'a' || picked === 'c')
              ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu qator to'g'ri. Yana qarang: xato <i>"price" does not exist"</i> deyapti — kodda qayerda <span className="mono">price</span> yozilgan?</>, ru: <>Эта строка правильная. Посмотрите ещё раз: ошибка говорит <i>"price" does not exist</i> — где в коде написано <span className="mono">price</span>?</> })}</p></div>
              : null}
            {found && !fixed && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: '✓ Topdingiz!', ru: '✓ Нашли!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Kodda ustun <span className="mono">price</span> deb yozilgan, biroq sxemada u <span className="mono">narx</span> — shuning uchun baza topa olmadi. Bitta so'zni to'g'rilaymiz. Chapdagi tugma bilan tuzating →</>, ru: <>В коде столбец записан как <span className="mono">price</span>, но в схеме он <span className="mono">narx</span> — поэтому база его не нашла. Исправим одно слово. Нажмите кнопку слева →</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — TO'LIQ ZANJIR: 4 AMALNI O'ZINGIZ BOSHQARING =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [rows, setRows] = useState(storedAnswer ? [...CARS, POOL_CARS[1]] : CARS);
  const [didC, setDidC] = useState(!!storedAnswer);
  const [didR, setDidR] = useState(!!storedAnswer);
  const [didU, setDidU] = useState(!!storedAnswer);
  const [didD, setDidD] = useState(!!storedAnswer);
  const [active, setActive] = useState(storedAnswer ? 'R' : null);
  const [flash, setFlash] = useState(null);
  const [runs, setRuns] = useState(0); // ✨ har yuborishda zanjir to'lqinini qayta o'ynatish uchun
  const done = didC && didR && didU && didD;
  const { tip: _tip, rescue: _resc } = useStuckValve(done, (didC?1:0)+(didR?1:0)+(didU?1:0)+(didD?1:0));   // 13-band klapan
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const run = (k) => {
    setActive(k);
    setRuns(n => n + 1);
    if (k === 'C') { const n = POOL_CARS.find(p => !rows.some(r => r.id === p.id)); if (n) { setRows(prev => [...prev, n]); setFlash(n.id); } setDidC(true); }
    if (k === 'R') { setDidR(true); }
    if (k === 'U') { setRows(prev => prev.map((r, i) => i === 0 ? { ...r, narx: Math.max(100000, r.narx - 40000) } : r)); setFlash(rows[0]?.id); setDidU(true); }
    if (k === 'D') { setRows(prev => prev.slice(0, -1)); setDidD(true); }
    setTimeout(() => setFlash(null), 600);
  };
  const cur = OPS.find(o => o.key === active);
  return (
    <Stage eyebrow={{ uz: "Amaliyot · to'liq zanjir", ru: 'Практика · полная цепочка' }} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !_resc} label={(done || _resc) ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `To'rt amalni sinang — ${(didC?1:0)+(didR?1:0)+(didU?1:0)+(didD?1:0)}/4`, ru: `Испытайте четыре действия — ${(didC?1:0)+(didR?1:0)+(didU?1:0)+(didD?1:0)}/4` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi o'zingiz — <span className="italic" style={{ color: T.accent }}>to'rt amalni</span> ham yuboring.</>, ru: <>Теперь сами — отправьте <span className="italic" style={{ color: T.accent }}>все четыре действия</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har bosishda so'rov to'liq zanjirdan o'tadi: <b style={{ color: T.ink }}>Front → Express → pool.query → PostgreSQL → javob</b>. To'rttasini ham yuboring: <b style={{ color: T.ink }}>POST</b> (qo'shish), <b style={{ color: T.ink }}>GET</b> (o'qish), <b style={{ color: T.ink }}>PUT</b> (yangilash), <b style={{ color: T.ink }}>DELETE</b> (o'chirish).</>, ru: <>При каждом нажатии запрос проходит всю цепочку: <b style={{ color: T.ink }}>Фронт → Express → pool.query → PostgreSQL → ответ</b>. Отправьте все четыре: <b style={{ color: T.ink }}>POST</b> (добавить), <b style={{ color: T.ink }}>GET</b> (прочитать), <b style={{ color: T.ink }}>PUT</b> (обновить), <b style={{ color: T.ink }}>DELETE</b> (удалить).</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "So'rov yuborish", ru: 'Отправка запроса' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {OPS.map((o, i) => {
                const did = { C: didC, R: didR, U: didU, D: didD }[o.key];
                return (
                  <button key={o.key} className={`vcard ${!did ? 'tap-hint' : ''}`} onClick={() => run(o.key)} style={{ boxShadow: active === o.key ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : undefined, animationDelay: `${i * 0.16}s` }}>
                    <span className="vbadge" style={{ background: o.color }}>{o.method}</span>
                    <span className="vlbl">{tr(o.amal)}</span>
                    <span className={`vseen ${did ? 'tick' : ''}`} style={{ color: did ? T.success : T.ink3 }}>{did ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
            {cur && <div className="sk-info" key={active}><p className="body mono" style={{ margin: 0, color: T.ink, fontSize: 12.5 }}>{cur.method} → {cur.code}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "So'rovning yo'li", ru: 'Путь запроса' })}</p>
            <div className="chain fade-up delay-1">
              {CHAIN.map((c, i) => (
                <React.Fragment key={i}>
                  {/* ✨ har so'rovda to'lqin zanjirdan o'tadi: key almashadi → animatsiya qayta o'ynaydi, kechikish bosqichma-bosqich */}
                  <div key={`${active || 'off'}-${runs}`} className={`chain-node ${active ? 'lit wave' : ''}`} style={{ background: active ? T.accent : T.paper, color: active ? '#fff' : T.ink3, animationDelay: `${i * 0.09}s` }}>{tr(c)}</div>
                  {i < CHAIN.length - 1 && <span key={`a-${active || 'off'}-${runs}`} className={`chain-arr ${active ? 'flow' : ''}`} style={{ color: active ? T.accent : T.ink3, animationDelay: `${i * 0.09 + 0.05}s` }}>→</span>}
                </React.Fragment>
              ))}
            </div>
            <DbTable rows={rows} flashId={flash} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "🎉 To'liq CRUD backend tayyor! Har so'rov front'dan bazaga borib-keldi. Keyingi praktikada Modul 3'dagi React frontni aynan shu serverga ulaymiz.", ru: '🎉 Полный CRUD-backend готов! Каждый запрос сходил от фронта до базы и обратно. На следующей практике подключим React-фронт из Модуля 3 именно к этому серверу.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
        {_tip && !done && <p className="bhint fade-step">{tr({ uz: "💡 C·R·U·D — to'rttasi ham: qo'shish, ko'rish, o'zgartirish, o'chirish.", ru: '💡 C·R·U·D — все четыре: добавить, показать, изменить, удалить.' })}</p>}
        {_resc && !done && <p className="bhint calm fade-step">{tr({ uz: "Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.", ru: 'Остальное разберём вместе позже — «Продолжить» открыто.' })}</p>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TEST 4 (pg ko'prik) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} idx={12} scope="module-mikro" eyebrow={{ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' }}
    questionText="Express ichida PostgreSQL'ga SQL yuborish uchun nima ishlatiladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Express ichida bazaga <span className="italic" style={{ color: T.accent }}>SQL yuborish</span> uchun?</>, ru: <>Что нужно в Express, чтобы <span className="italic" style={{ color: T.accent }}>отправить SQL</span> в базу?</> })}</h2></>}
    options={["pool.query('...')", 'res.send(...)', 'app.listen(3000, callback)', 'console.log(...)']} correctIdx={0}
    explainCorrect={{ uz: "To'g'ri! pool.query('...') — server bilan baza orasidagi ko'prik. SQL'ni PostgreSQL'ga olib boradi va natijani qaytaradi.", ru: "Верно! pool.query('...') — мост между сервером и базой. Доставляет SQL в PostgreSQL и возвращает результат." }}
    explainWrong={{
      1: { uz: "res.send — frontga javob qaytaradi, bazaga emas. Bazaga SQL: pool.query('...').", ru: "res.send — возвращает ответ фронту, а не базе. SQL в базу: pool.query('...')." },
      2: { uz: "app.listen — serverni yoqadi (portni tinglaydi). Bazaga so'rov: pool.query('...').", ru: "app.listen — включает сервер (слушает порт). Запрос в базу: pool.query('...')." },
      3: { uz: "console.log — terminalga yozadi. Bazaga SQL yuborish: pool.query('...').", ru: "console.log — пишет в терминал. Отправка SQL в базу: pool.query('...')." },
      default: { uz: "Bazaga SQL = pool.query('...').", ru: "SQL в базу = pool.query('...')." }
    }} />
);

// ===== SCREEN 13 — QOIDA: MA'LUMOT BAZADA YASHAYDI =====
const Screen13 = ({ screen, answers, onNext, onPrev }) => {
  return (
    <Stage eyebrow={{ uz: 'Qoida · xulosa', ru: 'Правило · вывод' }} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Oxirgi qadam →', ru: 'Последний шаг →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Mashinalar endi <span className="italic" style={{ color: T.accent }}>qayerda yashaydi</span> — kodda yoki bazada?</>, ru: <>Где теперь <span className="italic" style={{ color: T.accent }}>живут машины</span> — в коде или в базе?</> })}</h2></div>
        <RolePassport answers={answers} />
        <Mentor>{tr({ uz: <>Eng muhim o'zgarish shu: endi mashinalar <span className="mono">App.jsx</span>'da emas, <b style={{ color: T.ink }}>PostgreSQL</b>'da. Kod faqat so'rov yuboradi, ma'lumotni baza saqlaydi. Quyida butun ish bir qarashda.</>, ru: <>Самое важное изменение: теперь машины не в <span className="mono">App.jsx</span>, а в <b style={{ color: T.ink }}>PostgreSQL</b>. Код лишь отправляет запросы, данные хранит база. Ниже вся работа одним взглядом.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label">CRUD ↔ HTTP ↔ SQL</p>
            <div className="db">
              <div className="db-row db-head" style={{ gridTemplateColumns: '1fr 1fr 1.4fr' }}><span>{tr({ uz: 'amal', ru: 'действие' })}</span><span>method</span><span>SQL</span></div>
              {OPS.map(o => (
                <div key={o.key} className="db-row" style={{ gridTemplateColumns: '1fr 1fr 1.4fr' }}>
                  <span>{tr(o.amal)}</span><span style={{ color: o.color, fontWeight: 700 }}>{o.method}</span><span>{o.sql}</span>
                </div>
              ))}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Uch rol — har safar shunday', ru: 'Три роли — так каждый раз' })}</p>
            <div className="roadmap">
              <div className="step-card"><span className="step-num" style={{ color: T.blue }}>🏗️ 01</span><span className="step-body"><span className="step-text">{tr({ uz: "ME'MOR", ru: 'АРХИТЕКТОР' })}</span><span className="step-tag">{tr({ uz: 'sxemani siz loyihalaysiz', ru: 'схему проектируете вы' })}</span></span></div>
              <div className="step-card"><span className="step-num" style={{ color: T.amber }}>🎬 02</span><span className="step-body"><span className="step-text">{tr({ uz: 'REJISSYOR', ru: 'РЕЖИССЁР' })}</span><span className="step-tag">{tr({ uz: "AI'ga aniq prompt", ru: 'точный промпт для AI' })}</span></span></div>
              <div className="step-card"><span className="step-num" style={{ color: T.success }}>🔍 03</span><span className="step-body"><span className="step-text">{tr({ uz: 'NAZORATCHI', ru: 'КОНТРОЛЁР' })}</span><span className="step-tag">{tr({ uz: 'Postman bilan test', ru: 'проверка через Postman' })}</span></span></div>
            </div>
            <div className="frame-success"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ko'prik — <span className="mono">pool.query</span>. Aniq qator — <span className="mono">:id</span> + <span className="mono">WHERE id=$1</span>. Xavfsizlik — qiymatlar <span className="mono">$1, $2</span> o'rinlariga qo'yiladi.</>, ru: <>Мост — <span className="mono">pool.query</span>. Точная строка — <span className="mono">:id</span> + <span className="mono">WHERE id=$1</span>. Безопасность — значения подставляются в места <span className="mono">$1, $2</span>.</> })}</p></div>
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== 🛠️ JONLI PRAKTIKA (reusable checkpoint) — o'quvchi VS Code'da bajaradi, ustoz kuzatadi =====
// signal zonasi: <100 test · 100+ arena · 500+ praktika (to'qnashmaydi).
const PRACTICE_BASE = 500;
const MentorPracticeStats = ({ live, screen }) => {
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  const isMentor = !!(live && live.mode === 'mentor' && live.pin);
  useEffect(() => {
    if (!isMentor) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ players, doneIds: new Set(rows.map(r => r.player_id)) }); // JONLI: bajarganlar = screen_idx==500+screen javob yozganlar
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isMentor, live && live.pin, screen]);
  if (!isMentor) return null;
  // 129-qonun (F-0819-57): bo'sh apparat ko'rsatilmaydi — birinchi o'quvchi qo'shilgach
  // panel o'zi paydo bo'ladi (har 3 s da yangilanadi).
  if (data.players === null || data.players.length === 0) return null;
  const total = data.players ? data.players.length : 0;
  const doers = data.players ? data.players.filter(p => data.doneIds.has(p.id)) : [];
  const waiting = data.players ? data.players.filter(p => !data.doneIds.has(p.id)) : [];
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{tr({ uz: '👀 Kim bajardi — ', ru: '👀 Кто выполнил — ' })}<b>{doers.length}</b>/{total}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className="lp-doer done">✓ {p.nickname}</span>)}
          {waiting.slice(0, 10).map(p => <span key={p.id} className="lp-doer">⏳ {p.nickname}</span>)}
          {waiting.length > 10 && <span className="lp-doer">+{waiting.length - 10}</span>}
      </div>
    </div>
  );
};
// O'QUVCHI ko'radigan sinf-holati (45-qonun) — sof O'QISH, ball-relsga yozmaydi.
// Manba-etalon: m3-09 `ReactApiPostLesson`; 4-Modulda standart.
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
function ScreenLivePractice({ title, task, checklist, screen, storedAnswer, onAnswer, onNext, onPrev, live }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor'); // mentor topshiriqni BAJARMAYDI — kuzatadi (F-0819-41)
  const [checked, setChecked] = useState(() => new Set());
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const toggle = (i) => setChecked(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; });
  const complete = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: (title && title.uz) || title, solved: true, correct: true, picked: true }); // UZ-etalon
    // JONLI: o'quvchi «Bajardim» bosganda serverga yoziladi (500+ zonasi) — mentor MentorPracticeStats'da ko'radi
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  return (
    <Stage eyebrow={{ uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' }} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={(done || isMentor) ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{isMentor ? tr({ uz: <>O'quvchilar topshiriqni <b style={{ color: T.ink }}>o'z kompyuterida</b> bajarmoqda. Nechtasi tugatgani pastda ko'rinadi — hamma tayyor bo'lgach davom eting.</>, ru: <>Ученики выполняют задание <b style={{ color: T.ink }}>на своих компьютерах</b>. Сколько закончили — видно ниже; продолжайте, когда будут готовы все.</> }) : tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Выполняйте шаги и отмечайте их. Когда закончите, нажмите <b style={{ color: T.ink }}>«Выполнил(а)»</b> — наставник следит за прогрессом.</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="lp-task fade-up delay-1">
              <div className="lp-task-h"><span className="lp-task-badge">{tr({ uz: 'TOPSHIRIQ', ru: 'ЗАДАНИЕ' })}</span></div>
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr(task)}</p>
            </div>
            <MentorPracticeStats live={_live} screen={screen} />
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
              {done ? tr({ uz: '✓ Bajarildi — ustozni kuting', ru: '✓ Выполнено — ждите наставника' }) : tr({ uz: '✅ Bajardim', ru: '✅ Выполнил(а)' })}
            </button>}
            {done && !isMentor && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Juda yaxshi! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: 'Отлично! Задание выполнено. Наставник проверит и переведёт вас на следующий шаг.' })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
}

// ===== FINAL — JONLI PRAKTIKA (VS Code, AvtoIjara backend) =====
const ScreenFinalPractice = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "Yakuniy amaliyot — AvtoIjara backend'ini o'zingiz quring", ru: 'Финальная практика — соберите backend AvtoIjara сами' }}
    task={{ uz: "VS Code'da AvtoIjara backend'ini qadam-qadam quring: bazaga ulanish, cars jadvali, GET va POST endpoint'lari. So'ng Postman bilan sinab ko'ring va serverni o'chirib-yoqing — ma'lumot saqlanib qoladimi?", ru: 'Соберите backend AvtoIjara в VS Code шаг за шагом: подключение к базе, таблица cars, endpoint-ы GET и POST. Затем проверьте через Postman и перезапустите сервер — сохранятся ли данные?' }}
    checklist={[
      { uz: "Terminalda `npm install pg` — PostgreSQL kutubxonasini o'rnating", ru: 'В терминале `npm install pg` — установите библиотеку PostgreSQL' },
      { uz: "`db.js` faylida ko'prikni yarating: `new Pool({ database: 'avtoijara' })`", ru: "В файле `db.js` создайте мост: `new Pool({ database: 'avtoijara' })`" },
      "`CREATE TABLE cars (id SERIAL PRIMARY KEY, nom TEXT, narx INTEGER, yil INTEGER, bandmi BOOLEAN)`",
      { uz: "AI'ga aniq buyruq bering: GET va POST /api/cars — `pool.query`, `$1, $2` bilan", ru: 'Дайте AI точную команду: GET и POST /api/cars — через `pool.query`, `$1, $2`' },
      { uz: "`node server.js` — serverni yoqing", ru: '`node server.js` — запустите сервер' },
      { uz: "Postman: GET → `200`, POST → `201` — javoblarni tekshiring", ru: 'Postman: GET → `200`, POST → `201` — проверьте ответы' },
      { uz: "Serverni o'chirib-yoqing, so'ng yana GET yuboring — ma'lumot saqlanib qoldimi?", ru: 'Перезапустите сервер, затем снова отправьте GET — сохранились ли данные?' },
    ]} />
);

// 🃏 FLASHCARD KARTALARI (front = savol, back = qisqa javob, note = bir qatorlik misol)
const BACKEND_FLASHCARDS = [
  { front: { uz: "Jadvaldagi bitta ustun nimani saqlaydi?", ru: 'Что хранит один столбец таблицы?' }, back: { uz: "Bitta xususiyatni", ru: 'Одно свойство' }, note: "nom · narx · yil · bandmi" },
  { front: { uz: "Har mashinaga takrorlanmas raqamni qaysi ustun beradi?", ru: 'Какой столбец даёт каждой машине неповторимый номер?' }, back: "id SERIAL PRIMARY KEY", note: { uz: "Raqam avtomatik o'sadi: 1, 2, 3…", ru: 'Номер растёт сам: 1, 2, 3…' } },
  { front: { uz: "Barcha mashinalarni o'qish uchun qaysi juftlik kerak?", ru: 'Какая пара нужна, чтобы прочитать все машины?' }, back: "GET → SELECT", note: { uz: "Bazada hech narsa o'zgarmaydi", ru: 'В базе ничего не меняется' } },
  { front: { uz: "Bazaga yangi mashina qo'shish uchun qaysi juftlik kerak?", ru: 'Какая пара нужна, чтобы добавить в базу новую машину?' }, back: "POST → INSERT", note: { uz: "Ma'lumot req.body ichida keladi", ru: 'Данные приходят внутри req.body' } },
  { front: { uz: "Bitta mashina narxini o'zgartirish uchun qaysi juftlik kerak?", ru: 'Какая пара нужна, чтобы изменить цену одной машины?' }, back: "PUT → UPDATE", note: "UPDATE cars SET narx = $1 WHERE id = $2" },
  { front: { uz: "Mashinani ro'yxatdan olib tashlash uchun qaysi juftlik kerak?", ru: 'Какая пара нужна, чтобы убрать машину из списка?' }, back: "DELETE → DELETE", note: "DELETE FROM cars WHERE id = $1" },
  { front: { uz: "CRUD harflari qaysi to'rt amalni bildiradi?", ru: 'Какие четыре действия означают буквы CRUD?' }, back: "Create · Read · Update · Delete", note: { uz: "Qo'shish · o'qish · o'zgartirish · o'chirish", ru: 'Добавить · прочитать · изменить · удалить' } },
  { front: { uz: "Express'dan bazaga SQL'ni nima olib boradi?", ru: 'Что доставляет SQL из Express в базу?' }, back: "pool.query('...')", note: { uz: "Express bilan PostgreSQL orasidagi ko'prik", ru: 'Мост между Express и PostgreSQL' } },
  { front: { uz: "SQL ichiga qiymatni yopishtirish o'rniga nima qo'yasiz?", ru: 'Что вы ставите вместо вклеивания значения прямо в SQL?' }, back: "$1, $2", note: { uz: "Qiymatlar massivda beriladi — matn kod bo'lib qolmaydi", ru: 'Значения передаются массивом — текст не станет кодом' } },
  { front: { uz: "Manzildagi :id qiymatini kodda qayerdan olasiz?", ru: 'Откуда в коде вы берёте значение :id из адреса?' }, back: "req.params.id", note: { uz: "/api/cars/2 kelsa, id = 2", ru: 'Пришёл /api/cars/2 — id = 2' } },
  { front: { uz: "Bazadan olingan natijani frontga nima qaytaradi?", ru: 'Что возвращает фронту результат, взятый из базы?' }, back: "res.json(...)", note: { uz: "Javob JSON ko'rinishida ketadi", ru: 'Ответ уходит в виде JSON' } },
  { front: { uz: "Muvaffaqiyatli POST qaysi status kodni qaytaradi?", ru: 'Какой статус-код возвращает успешный POST?' }, back: "201 Created", note: { uz: "Yangi yozuv qo'shildi degani", ru: 'Значит, новая запись добавлена' } },
];

const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={{ uz: 'Takrorlash', ru: 'Повторение' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={BACKEND_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== 🃏 FLASHCARDS (reusable, 3D flip) — HARAKAT ✨ Animatsiya, KONTENT 🎓 Metodist =====
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
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda", ru: '↻ Учу' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })} · <b>{known}</b></span></div>
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

// ===== 🏅 ACHIEVEMENTS (nishonlar) — dars davomidagi REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  blueprint: { icon: '🏗️', name: 'Blueprint!',      desc: { uz: "Sxema savolini to'g'ri yechdingiz", ru: "Вы верно решили вопрос по схеме" } },
  director:  { icon: '🎬', name: "Director's Cut!", desc: { uz: "AI'ga eng aniq promptni tanladingiz", ru: "Вы выбрали для AI самый точный промпт" } },
  catcher:   { icon: '🐞', name: 'Nice Catch!',     desc: { uz: "price xatosini narx'ga tuzatdingiz (500 → 201)", ru: "Вы исправили price на narx (500 → 201)" } },
  finisher:  { icon: '🚀', name: 'Ship It!',        desc: { uz: "AvtoIjara backend'ini VS Code'da o'zingiz qurdingiz", ru: 'Вы сами собрали backend AvtoIjara в VS Code' } },
};
// Ekran id → nishon (recordAnswer'da, faqat REAL solve bilan: scored test / challenge / final)
const ACH_TRIGGERS = { s4: 'blueprint', s5: 'director', s10: 'catcher', spf: 'finisher' };

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
const Q_LABELS = { 4: { uz: '1 — Sxema (id)', ru: '1 — Схема (id)' }, 6: "2 — READ (GET)", 9: "3 — Create (POST)", 13: { uz: "4 — Ko'prik (pool)", ru: '4 — Мост (pool)' } };
// Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi). SCORED_IDX ekranlari correctIdx'laridan 1:1.
const INLINE_KEYS = { s4: 1, s5b: 3, s8: 2, s12: 0, practice: -1 };

// ===== ⚡ CODE STRIKE — CTA kapsulasi + ARENA =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C'];
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
const QZ_BG_SHAPES = [
  { ch: 'pool.query', l: 5,  t: 10, s: 26, c: 'rgba(120,235,175,0.16)', d: 19, dl: 0 },
  { ch: 'SELECT',     l: 84, t: 7,  s: 30, c: 'rgba(80,200,255,0.14)',  d: 23, dl: 1.5 },
  { ch: 'INSERT',     l: 8,  t: 72, s: 28, c: 'rgba(232,161,58,0.15)',  d: 27, dl: 0.8 },
  { ch: '$1',         l: 80, t: 68, s: 34, c: 'rgba(255,110,70,0.14)',  d: 21, dl: 2.2 },
  { ch: 'SERIAL',     l: 44, t: 86, s: 28, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: 'GET',        l: 62, t: 26, s: 30, c: 'rgba(80,200,255,0.13)',  d: 17, dl: 0.4 },
  { ch: 'POST',       l: 26, t: 34, s: 28, c: 'rgba(120,235,175,0.14)', d: 20, dl: 1.9 },
  { ch: 'cars',       l: 55, t: 5,  s: 30, c: 'rgba(203,173,255,0.12)', d: 22, dl: 0.6 },
  { ch: 'req.body',   l: 89, t: 42, s: 22, c: 'rgba(232,161,58,0.13)',  d: 24, dl: 1.3 },
  { ch: 'res.json',   l: 2,  t: 45, s: 24, c: 'rgba(80,200,255,0.10)',  d: 26, dl: 2.6 },
  { ch: 'WHERE',      l: 36, t: 58, s: 24, c: 'rgba(255,110,70,0.11)',  d: 28, dl: 0.9 },
  { ch: ':id',        l: 70, t: 90, s: 26, c: 'rgba(203,173,255,0.12)', d: 18, dl: 2.0 },
];
// JONLI: mustahkamlash-jang savollari — Backend CRUD qamrovi. To'g'ri javoblar 4 pozitsiyaga TENG (3/3/3/3).
const QUIZ_BANK = [
  { q: { uz: "Har mashinaga takrorlanmas raqam beradigan ustun qaysi?", ru: 'Какой столбец даёт каждой машине уникальный номер?' }, opts: [ "nom TEXT","id SERIAL PRIMARY KEY", "narx INTEGER NOT NULL", "bandmi BOOLEAN"], correct: 1 },
  { q: { uz: "cars jadvalini yaratish uchun qaysi SQL to'g'ri?", ru: 'Какой SQL правильный для создания таблицы cars?' }, opts: ["SELECT * FROM cars ORDER BY id", "DELETE FROM cars", "INSERT INTO cars", "CREATE TABLE cars (...)"], correct: 3 },
  { q: { uz: "narx ustuni uchun qaysi tur mos (butun son)?", ru: 'Какой тип подходит столбцу narx (целое число)?' }, opts: [ "INTEGER", "BOOLEAN","TEXT", "SERIAL LIST"], correct: 0 },
  { q: { uz: "Bazaga yangi mashina qo'shish uchun qaysi juftlik?", ru: 'Какая пара нужна, чтобы добавить в базу новую машину?' }, opts: ["GET → SELECT", "PUT → UPDATE", "POST → INSERT", "DELETE → DELETE"], correct: 2 },
  { q: { uz: "Barcha mashinalarni o'qish uchun qaysi juftlik?", ru: 'Какая пара нужна, чтобы прочитать все машины?' }, opts: ["GET → SELECT", "POST → INSERT", "PUT → UPDATE", "DELETE → DELETE"], correct: 0 },
  { q: { uz: "Bitta mashina narxini o'zgartirish uchun?", ru: 'Что нужно, чтобы изменить цену одной машины?' }, opts: ["POST → INSERT INTO cars (nom, narx)", "PUT → UPDATE ... WHERE id = $1", "GET → SELECT * FROM cars", "DELETE → DELETE FROM cars"], correct: 1 },
  { q: { uz: "Express ichida bazaga SQL yuborish uchun nima ishlatiladi?", ru: 'Что используется в Express, чтобы отправить SQL в базу?' }, opts: ["res.send(...)", "app.listen(3000, callback)", "console.log(...)", "pool.query('...')"], correct: 3 },
  { q: { uz: "AI'ga eng aniq buyruq qaysi?", ru: 'Какая команда для AI самая точная?' }, opts: [{ uz: "Menga mashinalar kerak, ularni chiqaradigan biror narsa qilib bergin", ru: 'Мне нужны машины, сделай что-нибудь, что их выводит' }, { uz: "Bazadan biror narsa olib chiqadigan kod yozib ber", ru: 'Напиши код, который что-то достаёт из базы' }, { uz: "GET /api/cars — pool.query bilan SELECT * FROM cars, JSON qaytar", ru: 'GET /api/cars — через pool.query сделай SELECT * FROM cars, верни JSON' }, { uz: "Mashinalar uchun yaxshi backend kodi yozib ber", ru: 'Напиши хороший backend-код для машин' }], correct: 2 },
  { q: { uz: "res.json(...) nima qiladi?", ru: 'Что делает res.json(...)?' }, opts: [ { uz: "Yangi jadval yaratadi", ru: 'Создаёт новую таблицу' }, { uz: "Serverni yoqadi va portni tinglashni boshlaydi", ru: 'Включает сервер и начинает слушать порт' }, { uz: "Natijani frontga JSON qilib qaytaradi", ru: 'Возвращает результат фронту в виде JSON' }, { uz: "Faylni diskka yozadi", ru: 'Записывает файл на диск' }], correct: 2 },
  { q: { uz: "Nega SQL'da $1, $2 ishlatiladi (to'g'ridan yopishtirmaymiz)?", ru: 'Зачем в SQL используют $1, $2 (а не вклеивают напрямую)?' }, opts: [ { uz: "Xavfsizlik — foydalanuvchi matni kod bo'lmaydi", ru: 'Безопасность — текст пользователя не станет кодом' }, { uz: "Kod tezroq ishlashi va so'rov sekin bo'lmasligi uchun", ru: 'Чтобы код работал быстрее и запрос не тормозил' }, { uz: "PostgreSQL buni majburiy talab qiladi", ru: 'PostgreSQL требует это в обязательном порядке' }, { uz: "Ustun nomlarini qisqartirish uchun", ru: 'Чтобы сократить названия столбцов' }], correct: 0 },
  { q: { uz: "Server 500 qaytardi: column \"price\" does not exist. Sabab?", ru: 'Сервер вернул 500: column "price" does not exist. Причина?' }, opts: [{ uz: "Baza o'chib qolgan — server ulana olmadi", ru: 'База выключилась — сервер не смог подключиться' }, { uz: "Kodda price, lekin sxemada ustun nomi narx", ru: 'В коде price, а в схеме столбец называется narx' }, { uz: "Internet uzilgan — so'rov yetib bormadi", ru: 'Пропал интернет — запрос не дошёл' }, { uz: "Postman noto'g'ri sozlangan — manzil xato", ru: 'Postman настроен неверно — адрес ошибочный' }], correct: 1 },
  { q: { uz: "Muvaffaqiyatli POST (qo'shildi) qaysi status kodni qaytaradi?", ru: 'Какой статус-код возвращает успешный POST (добавлено)?' }, opts: ["404 Not Found", "500 Server Error", "200 OK", "201 Created"], correct: 3 },
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

// Jonli fon: suzuvchi uchqunlar + «web» chiziqlari + CRUD kod tokenlari (canvas)
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['pool.query', 'SELECT', 'INSERT', '$1', 'GET', 'POST', 'cars', 'WHERE'];
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

// ===== ⚡ CODE STRIKE ARENA — mustahkamlash-jang (mentor/student/solo). Kahoot uslubi: savol→taymer→reveal→podium. =====
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

  // Taymer — 100ms aniqlikda; vaqt tugasa javob ochiladi.
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
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚡ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать в арене.\nПотом можно вернуться в это же место через «⚡ Продолжить».\n\nВсё равно закрыть?' }))) return;
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
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее правильный ответ — тем больше баллов. Серия правильных ответов даёт 🔥 бонус!' })}</p>
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
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length} {tr({ uz: '— natija', ru: '— результат' })}</span>
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
                ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr({ uz: 'ball', ru: 'баллов' })}{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} ${tr({ uz: 'streak', ru: 'серия' })}` : ''}</span></>
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Быстрее! ⏱' })}</span>}
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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: "🏁 Natijani ko'rish", ru: '🏁 Посмотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Далее →' })}</button>}
        </div>
      )}

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'правильно' })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'самая длинная серия' })} 🔥x${soloScore.maxStreak}` : ''}</p>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест ещё раз — практика (в таблицу не записывается)' })}</button>}
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
        // DARS javoblari (<100): livePlayers + liveAnswers(pin) [screen_idx<100] — podium reyting
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
    <Stage eyebrow={{ uz: 'Natijalar', ru: 'Результаты' }} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-wait" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. В живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{myIdx + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</b> ({board[myIdx].okCount}/{totalQ} {tr({ uz: "to'g'ri", ru: 'правильно' })})</p>}
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

// ===== SCREEN 15 — YAKUN =====
const Screen15 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
    { uz: "Sxemani siz loyihalaysiz: CREATE TABLE cars (id SERIAL PRIMARY KEY, ...)", ru: 'Схему проектируете вы: CREATE TABLE cars (id SERIAL PRIMARY KEY, ...)' },
    { uz: "Express bazaga pool.query orqali ulanadi — ko'prik", ru: 'Express подключается к базе через pool.query — мост' },
    "CRUD ↔ HTTP ↔ SQL: GET/SELECT · POST/INSERT · PUT/UPDATE · DELETE/DELETE",
    { uz: "Aniq qator: :id manzilda + WHERE id = $1 bazada", ru: 'Точная строка: :id в адресе + WHERE id = $1 в базе' },
    { uz: "Xavfsizlik: qiymatlar $1, $2 o'rinlariga qo'yiladi — SQL'ga yopishtirilmaydi", ru: 'Безопасность: значения подставляются в $1, $2 — не вклеиваются в SQL' }
  ];
  const HOMEWORK = [
    { b: { uz: "O'z jadvalingiz", ru: 'Ваша таблица' }, t: { uz: "— AvtoIjara'ga 'rang' yoki 'transmissiya' ustunini qo'shing (ALTER TABLE)", ru: "— добавьте в AvtoIjara столбец 'rang' или 'transmissiya' (ALTER TABLE)" } },
    { b: { uz: "To'liq CRUD", ru: 'Полный CRUD' }, t: { uz: "— AI bilan 4 endpoint (GET/POST/PUT/DELETE) yozing", ru: '— напишите с AI 4 endpoint-а (GET/POST/PUT/DELETE)' } },
    { b: { uz: 'Postman test', ru: 'Postman-тест' }, t: { uz: "— har endpointni o'zingiz sinang: status kod to'g'rimi (200/201)?", ru: '— проверьте каждый endpoint сами: верный ли статус-код (200/201)?' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={{ uz: 'Tayyor', ru: 'Готово' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: "Birinchi backend'ingiz tayyor", ru: 'Ваш первый backend готов' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>AvtoIjara backend'ini <span className="italic" style={{ color: T.accent }}>o'zingiz qurdingiz</span>.</>, ru: <>Вы <span className="italic" style={{ color: T.accent }}>сами собрали</span> backend AvtoIjara.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Antigravity bilan o'z backend'ingizda sinang:", ru: 'Проверьте на своём backend вместе с Antigravity:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "🚀 Backend tayyor, lekin u hozircha yolg'iz. Keyingi praktikada Modul 3'dagi React frontni aynan shu serverga ulaymiz — to'liq fullstack!", ru: '🚀 Backend готов, но пока он одинок. На следующей практике подключим React-фронт из Модуля 3 именно к этому серверу — полный fullstack!' })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '🏅 Nishonlaringiz — ', ru: '🏅 Ваши значки — ' })}{(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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
export default function BackendCrudPracticeLesson({ lang: langProp, onFinished }) {
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
  // Javob kaliti: inline testlar + praktika sentineli + jang savollari (QUIZ_BANK'dan) — mentor ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, ScreenFinalPractice, ScreenPodium, ScreenFlashcards, Screen15];
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

        /* === VCARD (amal tugmasi) === */
        .vcard { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 12px 15px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover { transform: translateY(-1px); }
        .vbadge { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; color: ${T.ink2}; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.ink3}; padding: 4px 9px; border-radius: 6px; letter-spacing: 0.02em; }
        .vbadge.pk { color: #fff; background: ${T.accent}; box-shadow: none; }   /* 132-qonun: fon almashsa matn rangi ham */
        .vlbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .vseen { margin-left: auto; font-weight: 700; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); background: ${T.accentSoft}; }
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

        /* === BROWSER / PREVIEW === */
        .bp-window { border-radius: 13px; overflow: hidden; background: ${T.paper}; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.16); }
        .bp-bar { background: #f0eee8; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-title { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; }
        .bp-body { padding: clamp(12px,2.2vw,18px); }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

        /* === AVTOIJARA ILOVA PANELI (brauzer oynasi ichida) === */
        .app-hd { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 11px; padding-bottom: 9px; border-bottom: 1px solid ${T.line}; }
        .app-brand { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: ${T.ink}; letter-spacing: -0.01em; }
        .app-logo { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 7px; background: ${T.accentSoft}; font-size: 13px; }

        /* === 🛂 ROL PASPORTI — uch muhr === */
        .rp { display: flex; align-items: center; gap: clamp(10px,1.8vw,16px); background: ${T.paper}; border-radius: 13px; padding: 9px clamp(11px,1.8vw,15px); box-shadow: 0 6px 18px -8px rgba(${T.shadowBase},0.16); border: 1px dashed ${T.line}; }
        .rp-lbl { flex-shrink: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 9px; line-height: 1.25; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink3}; border-right: 1px solid ${T.line}; padding-right: clamp(10px,1.6vw,14px); }
        .rp-stamps { display: flex; align-items: center; gap: clamp(6px,1.2vw,10px); flex: 1; min-width: 0; flex-wrap: wrap; }
        .rp-sep { flex: none; width: 14px; height: 1px; background: ${T.line}; }
        .rp-stamp { display: inline-flex; align-items: center; gap: 8px; padding: 6px 11px; border-radius: 10px; background: ${T.bg}; box-shadow: inset 0 0 0 1px rgba(167,166,162,0.28); opacity: 0.55; transition: opacity 0.25s, background 0.25s, box-shadow 0.25s; }
        .rp-stamp.on { opacity: 1; background: var(--rs); box-shadow: inset 0 0 0 1.5px var(--rc); }
        .rp-stamp.got { opacity: 1; background: var(--rs); box-shadow: inset 0 0 0 1.5px var(--rc), 0 5px 14px -7px var(--rc); }
        .rp-ic { font-size: 15px; line-height: 1; flex: none; filter: grayscale(1); transition: filter 0.25s; }
        .rp-stamp.on .rp-ic, .rp-stamp.got .rp-ic { filter: none; }
        .rp-col { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .rp-name { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; color: ${T.ink2}; white-space: nowrap; }
        .rp-stamp.on .rp-name, .rp-stamp.got .rp-name { color: var(--rc); }
        .rp-tag { font-family: 'JetBrains Mono', monospace; font-style: normal; font-size: 9.5px; color: ${T.ink3}; white-space: nowrap; }
        .rp-seal { flex: none; width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; color: ${T.ink3}; background: rgba(167,166,162,0.16); }
        .rp-stamp.on .rp-seal { color: var(--rc); background: rgba(255,255,255,0.7); }
        .rp-stamp.got .rp-seal { color: #fff; background: var(--rc); }
        @media (max-width: 640px) { .rp-lbl { display: none; } .rp-sep { display: none; } .rp-tag { display: none; } }

        /* === 🛂 MUHR BOSILISHI — darsning bayram-momenti (✨ Animatsiya) === */
        /* 1) muhr qog'ozga uriladi (recoil) · 2) seal tepadan burilib tushadi · 3) siyoh halqasi tarqaladi */
        .rp-stamp { position: relative; }
        @keyframes rp-press { 0% { transform: scale(1); } 14% { transform: scale(1.1) rotate(-1.5deg); } 30% { transform: scale(0.93) rotate(1deg); } 46% { transform: scale(1.04) rotate(-0.5deg); } 66% { transform: scale(0.99); } 100% { transform: scale(1); } }
        .rp-stamp.press { animation: rp-press 0.62s cubic-bezier(.36,1.5,.42,1) both; z-index: 2; }
        @keyframes rp-seal-drop { 0% { transform: scale(3.1) rotate(-38deg); opacity: 0; } 30% { opacity: 0.9; } 55% { transform: scale(0.86) rotate(6deg); opacity: 1; } 72% { transform: scale(1.12) rotate(-2deg); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        .rp-stamp.press .rp-seal { animation: rp-seal-drop 0.55s cubic-bezier(.3,1.35,.45,1) both; }
        @keyframes rp-ink { 0% { transform: scale(0.72); opacity: 0.6; } 100% { transform: scale(1.5); opacity: 0; } }
        .rp-stamp.press::after { content: ''; position: absolute; inset: -3px; border-radius: 12px; box-shadow: 0 0 0 2px var(--rc); animation: rp-ink 0.75s ease-out 0.16s both; pointer-events: none; }
        @keyframes rp-ic-kick { 0%,100% { transform: scale(1) rotate(0); } 35% { transform: scale(1.3) rotate(-9deg); } 62% { transform: scale(0.95) rotate(4deg); } }
        .rp-stamp.press .rp-ic { animation: rp-ic-kick 0.6s ease-out 0.1s both; }
        /* 3/3 — pasport TASDIQLANDI: bo'ylab yorug'lik chizig'i o'tadi + ramka nafas oladi */
        .rp { position: relative; overflow: hidden; }
        @keyframes rp-sweep { 0% { left: -40%; } 100% { left: 130%; } }
        .rp.full::after { content: ''; position: absolute; top: 0; bottom: 0; left: -40%; width: 36%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.85), transparent); transform: skewX(-16deg); animation: rp-sweep 1.1s ease-out 0.05s both; pointer-events: none; }
        @keyframes rp-full-glow { 0%,100% { box-shadow: 0 6px 18px -8px rgba(${T.shadowBase},0.16); } 50% { box-shadow: 0 8px 26px -6px rgba(31,122,77,0.42), inset 0 0 0 1px rgba(31,122,77,0.35); } }
        .rp.full { animation: rp-full-glow 1.4s ease-in-out 2; }
        @media (prefers-reduced-motion: reduce) {
          .rp-stamp.press, .rp-stamp.press .rp-seal, .rp-stamp.press .rp-ic, .rp.full { animation: none !important; }
          .rp-stamp.press::after, .rp.full::after { display: none; }
        }

        /* === AVTOIJARA KARTOCHKA === */
        .rocard { border-radius: 12px; background: #fff; box-shadow: 0 4px 14px -4px rgba(0,0,0,0.16); overflow: hidden; border: 1px solid rgba(0,0,0,0.05); transition: transform 0.15s, box-shadow 0.15s; }
        .rothumb { height: 54px; display: flex; align-items: center; justify-content: center; position: relative; }
        .robody { padding: 7px 9px 9px; }
        .roname { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; color: ${T.ink}; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rostats { display: flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-size: 10.5px; color: ${T.ink2}; font-weight: 700; }
        .cardx { position: absolute; top: 4px; right: 5px; width: 20px; height: 20px; border-radius: 50%; border: none; background: rgba(14,14,16,0.5); color: #fff; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; transition: background 0.15s; z-index: 2; }
        .cardx:hover { background: ${T.danger}; }

        /* === DB JADVAL (PostgreSQL) === */
        .db { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.18); background: #fff; }
        .db-cap { background: #e9e5dc; padding: 8px 12px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; color: ${T.ink2}; } .db-cap b { color: ${T.ink}; } .db-cap span { color: ${T.ink3}; }
        .db-row { display: grid; grid-template-columns: 36px 1.3fr 1fr 0.8fr; gap: 8px; padding: 8px 12px; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; border-top: 1px solid #eee; }
        .db-head { background: ${CODE.bg}; color: ${CODE.punct}; font-weight: 700; border-top: none; }
        .db-row.flash { background: ${T.successSoft}; }
        .db-empty { padding: 18px 12px; text-align: center; font-family: 'Georgia', serif; font-style: italic; color: ${T.ink3}; font-size: 13px; }
        .db-btn { border: none; background: ${T.bg}; border-radius: 7px; padding: 4px 8px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; cursor: pointer; transition: all 0.15s; }
        .db-btn:hover { background: #EFEBE3; transform: translateY(-1px); }

        /* === POSTMAN === */
        .pm { border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.18); }
        .pm-bar { display: flex; align-items: center; gap: 9px; padding: 9px 11px; background: #f0eee8; }
        .pm-method { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; color: #fff; padding: 4px 9px; border-radius: 6px; letter-spacing: 0.02em; }
        .pm-url { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pm-send { margin-left: auto; flex-shrink: 0; padding: 5px 13px; }
        .pm-send-static { margin-left: auto; flex-shrink: 0; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; color: ${T.ink3}; background: ${T.bg}; padding: 5px 13px; border-radius: 8px; }
        .pm-body { padding: 11px 12px; }
        .pm-resp { margin-top: 9px; }
        .pm-status { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; margin-bottom: 7px; }
        .json { background: ${CODE.bg}; color: ${CODE.text}; border-radius: 9px; padding: 10px 12px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; white-space: pre-wrap; word-break: break-word; line-height: 1.6; margin: 0; }

        /* === ZANJIR (chain) === */
        .chain { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .chain-node { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; padding: 7px 11px; border-radius: 9px; transition: all 0.3s; }
        .chain-arr { font-size: 13px; transition: color 0.3s; }

        /* === 🌉 KO'PRIK HARAKATI — so'rov zanjirdan O'TADI (paket ko'rinadi) === */
        @keyframes chain-lit-pop { 0% { transform: scale(0.9); } 45% { transform: scale(1.14); } 70% { transform: scale(0.97); } 100% { transform: scale(1); } }
        .chain-node.lit { animation: chain-lit-pop 0.42s cubic-bezier(.34,1.5,.44,1) both; }
        .chain-node.wave { animation: chain-lit-pop 0.42s cubic-bezier(.34,1.5,.44,1) both; }
        /* strelka ustidan paket uchib o'tadi */
        .chain-arr { position: relative; }
        @keyframes chain-pkt { 0% { transform: translate(-9px,-50%) scale(0.5); opacity: 0; } 25% { opacity: 1; } 75% { opacity: 1; } 100% { transform: translate(9px,-50%) scale(0.5); opacity: 0; } }
        .chain-arr.flow::after { content: ''; position: absolute; top: 50%; left: 50%; width: 5px; height: 5px; margin-left: -2.5px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 7px ${T.accent}; animation: chain-pkt 0.6s ease-in-out both; pointer-events: none; }

        /* === 👆 TAP-HINT — bosilmagan joy "meni bos" deb chaqiradi (11.7) === */
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16), 0 0 0 0 rgba(255,79,40,0.32); } 65%,100% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16), 0 0 0 9px rgba(255,79,40,0); } }
        .tap-hint { animation: tap-hint-pulse 2.2s ease-out infinite; }
        .tap-hint:hover { animation-play-state: paused; }
        /* bosilgani ✓ bilan "muhrlanadi" — jonli progress signali */
        @keyframes tap-tick-pop { 0% { transform: scale(0) rotate(-25deg); opacity: 0; } 55% { transform: scale(1.45) rotate(6deg); opacity: 1; } 78% { transform: scale(0.92); } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        .vseen.tick { display: inline-block; animation: tap-tick-pop 0.44s cubic-bezier(.34,1.56,.44,1) both; }

        /* === 🖥️ SERVER O'CH–YON (doimiylik momenti, s9) === */
        @keyframes srv-blink { 0%,100% { filter: none; } 12% { filter: brightness(0.35) saturate(0.4); } 20% { filter: brightness(0.9); } 30% { filter: brightness(0.3) saturate(0.3); } 44% { filter: brightness(1.25); } 56% { filter: brightness(0.55); } 70% { filter: brightness(1.1); } }
        .srv-reboot { animation: srv-blink 1.1s ease-in-out both; }

        /* === 🐞 DEBUG — qidiruv (skan) va tuzatish (yashil supurish) === */
        @keyframes ai-scan { 0%,100% { box-shadow: inset 2px 0 0 rgba(255,79,40,0); } 50% { box-shadow: inset 2px 0 0 rgba(255,79,40,0.55); } }
        .ai-line.scan { animation: ai-scan 2.4s ease-in-out infinite; }
        .ai-line.scan:hover { animation-play-state: paused; }
        @keyframes fix-sweep { 0% { background: rgba(31,122,77,0.55); transform: translateX(-4px); } 40% { background: rgba(31,122,77,0.34); transform: none; } 100% { background: rgba(31,122,77,0.16); } }
        .ai-line.fixed-line { animation: fix-sweep 0.7s ease-out both; }

        /* === 🗄️ BAZA QATORI — yangi/o'zgargan qator urib ko'rsatiladi === */
        @keyframes db-hit { 0% { background: rgba(31,122,77,0.42); transform: translateX(-6px); } 45% { background: rgba(31,122,77,0.2); transform: none; } 100% { background: ${T.successSoft}; } }
        .db-row.flash { animation: db-hit 0.6s ease-out both; }

        /* === 💡 TAKEAWAY — xulosa "chiqib keladi" === */
        @keyframes ta-pop { 0% { opacity: 0; transform: scale(0.94) translateY(8px); } 60% { transform: scale(1.02) translateY(0); } 100% { opacity: 1; transform: none; } }
        .takeaway { animation: ta-pop 0.46s cubic-bezier(.34,1.4,.45,1) both; }
        @keyframes ta-bulb-kick { 0% { transform: scale(0.4) rotate(-16deg); } 55% { transform: scale(1.22) rotate(7deg); } 100% { transform: scale(1) rotate(0); } }
        .ta-bulb { animation: ta-bulb-kick 0.55s cubic-bezier(.34,1.5,.45,1) 0.12s both; }

        @media (prefers-reduced-motion: reduce) {
          .chain-node.lit, .chain-node.wave, .tap-hint, .vseen.tick, .srv-reboot, .ai-line.scan, .ai-line.fixed-line, .db-row.flash, .takeaway, .ta-bulb { animation: none !important; }
          .chain-arr.flow::after { display: none; }
        }

        /* === SILKINISH === */
        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: shake 0.4s ease; }

        /* === VS CODE === */
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

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }


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
        /* BITTA KLASS — BITTA ROL (134-qonun). «Siz» — suhbatdagi personaj emas,
           ekran egasining navbat-signali: KONTUR-accent (yorliq, tugma emas). */
        .you-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.accent}; background: ${T.paper}; border: 1px solid ${T.accent}; padding: 2px 8px; border-radius: 99px; letter-spacing: 0.04em; white-space: nowrap; }
        /* KLAPAN-IPUCHASI (13-band). Ogohlantirish emas — YORDAM: shuning uchun
           accent-kontur, qizil emas. Modifikator .calm — rescue xabari, undan ham yumshoqroq. */
        .bhint.bhint { margin: 0; align-self: flex-start; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 14px; box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
        .bhint.bhint.calm { color: ${T.ink2}; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; font-style: italic; }
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

        /* ===================== ⚡ JONLI QATLAM CSS (ReactIntro etalonidan) ===================== */
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

        /* ===== 📖 QAYTA TUSHUNTIRISH (recap) ===== */
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(255,79,40,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(255,79,40,0.55); }
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
        @media (max-width: 560px) {
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


        /* option-wait (jonli test kutish holati) — sekin nafas pulsatsiyasi (natija ochilishini kutmoqda) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; animation: ow-breathe 1.9s ease-in-out infinite; }
        @keyframes ow-breathe { 0%,100% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3); } 50% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 30px -6px rgba(1,154,203,0.5); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

        /* === 🛠️ JONLI PRAKTIKA — mentor «kim bajardi» chiplari === */
        .lp-doer { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; color: ${T.ink2}; background: rgba(58,53,48,0.07); border-radius: 99px; padding: 4px 11px; white-space: nowrap; }
        .lp-doer.done { color: ${T.success}; background: ${T.successSoft}; }

        /* === ⚡ LIVE BADGE — sekundar UI: kerak bo'lguncha xira (L1 etalon) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Backend praktikasi', ru: 'Бэкенд-практика' }} />
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
