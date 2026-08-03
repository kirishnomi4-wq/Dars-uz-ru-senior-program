import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';

// Mentor avatar — hostlangan (LMS'da assets papkasi bo'lmaydi; 11.1 standart)
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PRAKTIKA 1-DARS — SAYTNI JONLANTIRAMIZ (interaktivlik) — PLATFORM STANDARD v16
// Mavzu: statik sahifa vs jonli sahifa; HODISA (event) -> REAKSIYA (JS) -> O'ZGARISH (DOM).
//        5 vosita: Like sanagich, tungi/kunduzgi rejim, ko'rsat/yashir,
//        jonli salom (input), forma tekshiruvi (if/else).
// Maqsad (1-modul): bola interaktivlik NIMALIGINI his qilsin va tushunsin. AI minimal.
// Hook: chiroyli, lekin "o'lik" sayt — tugma bosiladi, hech nima bo'lmaydi.
// Ko'prik: keyingi darsda Antigravity agenti buni tez qiladi — bola TEKSHIRUVCHI.
// Toza dizayn — ortiqcha emoji yo'q; ma'no so'z va tipografiya bilan beriladi.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
  line: '#E9E6DF', shadowBase: '58, 53, 48'
};
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };


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
// F-0801-01 (102-qonun): ochiq praktika-oynasi ham saqlanadi — Chrome fon-tabni bo'shatib
// sahifani qayta yuklasa, o'quvchi praktika ICHIGA qaytadi, ortidagi darsga emas.
const _pracKey = (id) => `ccPractice:${id}`;
const pracRead = (id) => { try { const v = JSON.parse(localStorage.getItem(_pracKey(id)) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const pracWrite = (id, o) => { try { localStorage.setItem(_pracKey(id), JSON.stringify(o)); } catch {} };
const pracClear = (id) => { try { localStorage.removeItem(_pracKey(id)); } catch {} };
// Kod-saqlov kaliti: har praktika o'z kaliti bilan (bir darsda bir necha praktika bor)
const codeKeyOf = (id, kind) => `ccCode:${id}:${kind}`;
const codesRead = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const codesWrite = (k, codes) => { try { localStorage.setItem(k, JSON.stringify({ codes, savedAt: Date.now() })); } catch {} };
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
    } catch { setJoinError(tr({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: 'Код ментора неверный или ошибка подключения.' })); }
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

function LiveGate({ live, title }) {
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
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: 'Tekshirilmoqda…', ru: 'Проверка…' }) : tr({ uz: 'Kirish →', ru: 'Войти →' })}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
      <button onClick={() => { setRole('student'); setMentorCode(''); }} style={link}>{tr({ uz: '← Orqaga', ru: '← Назад' })}</button>
    </div></div>);
  }
  return (<div style={wrap}><div style={card}>
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{tr(title) || tr({ uz: 'Jonli dars', ru: 'Живой урок' })}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Присоединиться к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и своё имя.' })}</p></div>
    <input value={code} onChange={e => setCode(e.target.value)} inputMode="numeric" autoFocus placeholder="483 920" style={{ width: '100%', padding: '16px 14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 28, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.12em', textAlign: 'center', outline: 'none' }} />
    <input value={nick} onChange={e => setNick(e.target.value)} maxLength={24} placeholder={tr({ uz: 'Ismingiz (masalan: Ali)', ru: 'Ваше имя (например: Али)' })} onKeyDown={e => { if (e.key === 'Enter') live.joinStudent(code, nick); }} style={{ width: '100%', padding: '13px 14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 17, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
    <button onClick={() => live.joinStudent(code, nick)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: 'Ulanmoqda…', ru: 'Подключение…' }) : tr({ uz: "Qo'shilish →", ru: 'Присоединиться →' })}</button>
    {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
    <button onClick={() => { setRole('mentor'); setCode(''); }} title="Mentor" aria-label="Mentor" style={{ position: 'absolute', bottom: 10, right: 12, background: 'none', border: 'none', fontSize: 16, opacity: 0.3, cursor: 'pointer', lineHeight: 1, padding: 4 }}>🧑‍🏫</button>
  </div></div>);
}

function LiveBadge({ live, total }) {
  const [bigOpen, setBigOpen] = useState(false);
  const [nPlayers, setNPlayers] = useState(null);
  // Katta PIN ekrani AVTOMATIK ochilmaydi — mentor «📺 Ko'rsatish» bosadi.
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
    if (live.ended) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "🔓 O'quvchilar erkin qilindi", ru: '🔓 Ученики отпущены в свободный режим' })}</div>;
    return (<>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div data-tour="live" className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr({ uz: 'Kod:', ru: 'Код:' })} <b style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr({ uz: "Kodni katta ko'rsatish", ru: 'Показать код крупно' })} style={{ marginLeft: 6, background: LT.ink, color: '#fff', border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>📺 {tr({ uz: "Ko'rsatish", ru: 'Показать' })}</button>
        <button onClick={() => { if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: 'Отпустить учеников? Дальше они продолжат самостоятельно.' }))) live.endSession(); }} style={{ background: LT.accentSoft, color: LT.accent, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>🔓 {tr({ uz: 'Erkin qilish', ru: 'Отпустить' })}</button>
      </div>
    </>);
  }
  if (live.mode === 'student') {
    if (live.status === 'ended') return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: "🔓 Erkin rejim — o'zingiz davom eting", ru: '🔓 Свободный режим — продолжайте сами' })}</div>;
    if (!live.mentorAlive) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: '⚠️ Mentor uzildi — erkin rejim', ru: '⚠️ Ментор отключился — свободный режим' })}</div>;
    if (!live.connected) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot('#FFD380')} /> {tr({ uz: '🔄 Qayta ulanmoqda…', ru: '🔄 Переподключение…' })}</div>;
    return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: '👨‍🏫 Mentor:', ru: '👨‍🏫 Ментор:' })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

const LangContext = createContext('uz');
const MentorCtx = createContext(null);
const AchCtx = createContext(null);            // 🏅 topilgan nishonlar Set — prop-drilling'siz
const PRACTICE_DONE_BASE = 500;                // praktika-tugadi signal indekslari (500+, test/arena zonasidan yuqori)

// backtick chiplar: `onclick` matn ichida chip bo'lib chiqadi (test/arena savollarida)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split(/(`[^`]+`)/g).map((p, i) => (p.startsWith('`') && p.endsWith('`') ? <code key={i} className="qcode">{p.slice(1, -1)}</code> : p))
  : s;

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
class AudioEngine {
  constructor() {
    this.queue = []; this.currentIdx = 0; this.isPlaying = false;
    this.currentUtterance = null; this.onStateChange = null; this.waitingFor = null;
    this.voicesByLang = { ru: null, uz: null }; this.voicesReady = false; this.currentLang = 'uz';
    this.initVoices();
  }
  initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (!v.length) return;
      this.voicesByLang.ru = v.find(x => x.lang.startsWith('ru')) || v[0];
      this.voicesByLang.uz = v.find(x => x.lang.startsWith('uz')) || v.find(x => x.lang.startsWith('ru')) || v[0];
      this.voicesReady = true;
    };
    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) window.speechSynthesis.onvoiceschanged = load;
  }
  setLang(l) { this.currentLang = l; }
  getVoice() { return this.voicesByLang[this.currentLang] || this.voicesByLang.ru || null; }
  hasUz() { if (typeof window === 'undefined' || !window.speechSynthesis) return false; return window.speechSynthesis.getVoices().some(v => v.lang.startsWith('uz')); }
  loadQueue(s) { this.stop(); this.queue = s; this.currentIdx = 0; this.waitingFor = null; }
  playSegment(seg) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(seg.text);
    const useUz = this.currentLang === 'uz' && this.hasUz();
    u.lang = useUz ? 'uz-UZ' : 'ru-RU'; u.rate = 0.95; u.pitch = 1.0;
    const v = this.getVoice(); if (v) u.voice = v;
    u.onstart = () => { this.isPlaying = true; if (this.onStateChange) this.onStateChange({ isPlaying: true, currentSegment: seg.id }); };
    u.onend = () => { this.isPlaying = false; this.currentUtterance = null; if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null }); this.handleEnd(seg); };
    u.onerror = () => { this.isPlaying = false; this.currentUtterance = null; if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null }); };
    this.currentUtterance = u; /* AUDIOSIZ: ovoz o'chirildi (kontekst saqlandi) */
  }
  handleEnd(seg) { if (seg.waits_for) { this.waitingFor = seg.waits_for; if (this.onStateChange) this.onStateChange({ isPlaying: false, waitingFor: seg.waits_for }); } else { this.currentIdx++; this.playNext(); } }
  playNext() { if (this.currentIdx >= this.queue.length) return; this.playSegment(this.queue[this.currentIdx]); }
  start() { this.currentIdx = 0; this.waitingFor = null; this.playNext(); }
  triggerEvent(type, target) { if (!this.waitingFor) return; const m = this.waitingFor.type === type && (this.waitingFor.target === target || !this.waitingFor.target); if (m) { this.waitingFor = null; this.currentIdx++; this.playNext(); } }
  pushOneOff(text) { if (!text) return; this.queue.push({ id: `oneoff_${Date.now()}`, text, trigger: 'manual', waits_for: null }); this.currentIdx = this.queue.length - 1; this.playNext(); }
  replay() { if (this.currentIdx > 0) this.currentIdx--; this.waitingFor = null; this.playNext(); }
  stop() { if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel(); this.isPlaying = false; this.currentUtterance = null; if (this.onStateChange) this.onStateChange({ isPlaying: false, currentSegment: null }); }
}
let audioEngineInstance = null;
const getAudioEngine = () => { if (typeof window === 'undefined') return null; if (!audioEngineInstance) audioEngineInstance = new AudioEngine(); return audioEngineInstance; };

function useAudio(segments) {
  const lang = useLang();
  const [state, setState] = useState({ isPlaying: false, currentSegment: null, waitingFor: null, muted: false });
  const engineRef = useRef(null);
  const segmentsRef = useRef(segments);
  const key = segments ? JSON.stringify(segments) : '';
  const prevKey = useRef(key);
  if (prevKey.current !== key) { segmentsRef.current = segments; prevKey.current = key; }
  const stable = segmentsRef.current;
  useEffect(() => {
    const engine = getAudioEngine(); if (!engine) return;
    engineRef.current = engine; engine.setLang(lang);
    engine.onStateChange = (s) => setState(p => ({ ...p, ...s }));
    if (stable && stable.length > 0 && !state.muted) {
      engine.loadQueue(stable);
      const t = setTimeout(() => engine.start(), 300);
      return () => { clearTimeout(t); engine.stop(); };
    }
    return () => { if (engine) engine.stop(); };
    // eslint-disable-next-line
  }, [stable, lang]);
  const triggerEvent = useCallback((type, target) => { if (engineRef.current) engineRef.current.triggerEvent(type, target); }, []);
  const replay = useCallback(() => { if (engineRef.current) engineRef.current.replay(); }, []);
  const toggleMute = useCallback(() => { setState(p => { const m = !p.muted; if (m && engineRef.current) engineRef.current.stop(); return { ...p, muted: m }; }); }, []);
  return { ...state, triggerEvent, replay, toggleMute };
}
// AUDIOSIZ: AudioIndicator (ovoz/replay tugmalari) olib tashlandi — ovoz o'chirilgan, ikonka kerak emas.

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

// ===== Kod bo'yoqlari (syntax highlight) =====
const KW = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const NUM = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const STR = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const FN = ({ children }) => <span style={{ color: CODE.punct }}>{children}</span>;
const CM = ({ children }) => <span style={{ color: CODE.comment }}>{children}</span>;

const LESSON_META = { lessonId: 'practice-01-jonlantirish-v18', lessonTitle: { uz: 'Praktika 1 — Saytni jonlantiramiz', ru: 'Практика 1 — Оживляем сайт' } };
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
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's12', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's15b', type: 'stats',      template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

const Split = ({ children }) => <div className="split">{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic;
  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px + 60px
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); }, [screen]);
  const setCollapsed = (v) => {
    setMCollapsed(v);
    if (v === false && contentRef.current) { const el = contentRef.current; requestAnimationFrame(() => { if (el) el.scrollTo({ top: 0, behavior: 'auto' }); }); }
  };
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

// ===== KO'P TANLOVLI TEST =====

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
// RECAPS kontenti — Stage 4'da JS-intro testlariga to'ldiriladi (hozircha bo'sh)
const RECAPS = {
  4: {
    title: { uz: "Hodisa (event) nima?", ru: 'Что такое событие (event)?' },
    cards: [
      { ic: "⚡", h: { uz: "Hodisa = foydalanuvchi harakati", ru: 'Событие = действие пользователя' }, body: { uz: <>Hodisa (event) — bu foydalanuvchi saytda <b>biror harakat qilgani</b>: tugmani bosish, matn yozish yoki sichqonchani ustiga olib borish. Sayt shu harakatni sezadi.</>, ru: <>Событие (event) — это когда пользователь <b>что-то сделал</b> на сайте: нажал кнопку, ввёл текст или навёл мышку. Сайт замечает это действие.</> }, vis: <RcFlow items={[{ uz: "Bosish", ru: 'Клик' }, { uz: "Yozish", ru: 'Ввод' }, "Hover"]} />, ask: { uz: "Sichqonchani rasm ustiga olib borsak — bu hodisami yoki yo'qmi?", ru: 'Если навести мышку на картинку — это событие или нет?' } },
      { ic: "🎨", h: { uz: "Rang yoki nom — hodisa emas", ru: 'Цвет или название — не событие' }, body: { uz: <>Saytning rangi, shrifti yoki nomi — bu <b>ko'rinish</b>, hodisa emas. Internet tezligi ham hodisa emas. Hodisa faqat foydalanuvchi <b>nimadir qilganda</b> yuz beradi.</>, ru: <>Цвет сайта, шрифт или название — это <b>внешний вид</b>, а не событие. Скорость интернета тоже не событие. Событие происходит, только когда пользователь <b>что-то делает</b>.</> } },
      { ic: "🔔", h: { uz: "Sayt hodisani kutib turadi", ru: 'Сайт ждёт событие' }, body: { uz: <>Sayt xuddi <b>eshik qo'ng'irog'i</b> kabi: kimdir tugmani bossa (hodisa), sayt buni eshitadi va javob beradi. Hodisa bo'lmasa — sayt jim turadi.</>, ru: <>Сайт — как <b>дверной звонок</b>: кто-то нажал кнопку (событие) — сайт это слышит и отвечает. Нет события — сайт молчит.</> }, vis: <RcFlow items={[{ uz: "Foydalanuvchi harakati", ru: 'Действие пользователя' }, { uz: "Sayt sezadi", ru: 'Сайт замечает' }]} /> },
    ]
  },
  7: {
    title: { uz: "Har bosishda son +1", ru: 'Каждое нажатие: son +1' },
    cards: [
      { ic: "🔢", h: { uz: "Har bosish songa 1 qo'shadi", ru: 'Каждое нажатие добавляет к son единицу' }, body: { uz: <>son <b>0</b> dan boshlanadi. Har safar tugma bosilganda <b>son = son + 1</b> bajariladi. 3 marta bossak: 0 → 1 → 2 → 3. Demak son <b>3</b> bo'ladi.</>, ru: <>son начинается с <b>0</b>. При каждом нажатии кнопки выполняется <b>son = son + 1</b>. Нажали 3 раза: 0 → 1 → 2 → 3. Значит son будет <b>3</b>.</> }, vis: <RcFlow items={["0", "1", "2", "3"]} />, ask: { uz: "Agar tugmani 5 marta bossak, son nechta bo'ladi?", ru: 'А если нажать кнопку 5 раз — чему будет равен son?' } },
      { ic: "💾", h: { uz: "son — eslab qoluvchi quti", ru: 'son — коробка, которая помнит' }, body: { uz: <>son — bu <b>o'zgaruvchi</b>, xuddi ichiga qiymat solib qo'yiladigan quti kabi. Har bosishda quti ichidagi son yangilanadi va sayt uni <b>esda saqlaydi</b>.</>, ru: <>son — это <b>переменная</b>, как коробка, в которую кладут значение. При каждом нажатии число в коробке обновляется, и сайт его <b>запоминает</b>.</> } },
      { ic: "❤️", h: { uz: "Like sanagichi aynan shunday", ru: 'Счётчик лайков работает так же' }, body: { uz: <>Like tugmasi ham shu mantiq: har bosganda sanagich <b>1 taga oshadi</b> va ekranda yangi son ko'rinadi. Bosish — hodisa, son+1 — reaksiya.</>, ru: <>Кнопка Like — та же логика: при каждом нажатии счётчик <b>растёт на 1</b>, и на экране видно новое число. Нажатие — событие, son+1 — реакция.</> }, vis: <RcFlow items={[{ uz: "Bosish (hodisa)", ru: 'Нажатие (событие)' }, "son + 1", { uz: "Yangi son", ru: 'Новое число' }]} /> },
    ]
  },
  11: {
    title: { uz: "Ism yozilsa — qaysi hodisa?", ru: 'Пишем имя — какое событие?' },
    cards: [
      { ic: "⌨️", h: { uz: "Yozish = input hodisasi", ru: 'Ввод текста = событие input' }, body: { uz: <>Foydalanuvchi matn maydoniga harf <b>yozganda</b> «input» hodisasi yuz beradi. Har yozilgan harfda sayt darhol sezadi va salomni yangilaydi.</>, ru: <>Когда пользователь <b>печатает</b> буквы в поле, происходит событие «input». С каждой буквой сайт сразу замечает это и обновляет приветствие.</> }, vis: <RcFlow items={[{ uz: "Harf yozildi", ru: 'Буква введена' }, { uz: "input hodisasi", ru: 'событие input' }, { uz: "Salom yangilandi", ru: 'Приветствие обновилось' }]} />, ask: { uz: "Bu yerda foydalanuvchi biror tugmani bosdimi? Yo'q — faqat yozdi. Qaysi hodisa kerak?", ru: 'Пользователь здесь нажимал какую-то кнопку? Нет — он только печатал. Какое событие нужно?' } },
      { ic: "🖱️", h: { uz: "Bosish (click) bu yerda emas", ru: 'Клик (click) здесь не подходит' }, body: { uz: <>Click — <b>tugma bosilganda</b> ishlaydi. Ammo bu yerda foydalanuvchi hech narsani bosmaydi, faqat <b>yozadi</b> — shuning uchun click emas, input kerak.</>, ru: <>Click срабатывает, <b>когда нажимают кнопку</b>. Но здесь пользователь ничего не нажимает, а только <b>печатает</b> — поэтому нужен input, а не click.</> } },
      { ic: "👋", h: { uz: "Jonli salom o'zgaradi", ru: 'Живое приветствие меняется' }, body: { uz: <>Ism yozilgan zahoti «Salom, Ali!» paydo bo'ladi: <b>hodisa</b> (yozish) → <b>reaksiya</b> (salomni yangilash). Hodisa to'g'ri bo'lmasa, salom o'zgarmay qoladi.</>, ru: <>Как только вписали имя, появляется «Salom, Ali!»: <b>событие</b> (ввод) → <b>реакция</b> (обновить приветствие). Если событие не то — приветствие не изменится.</> }, vis: <RcFlow items={["input", { uz: "reaksiya", ru: 'реакция' }, { uz: "yangi salom", ru: 'новое приветствие' }]} /> },
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
        <span className="rc-tag">📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">🗣️ {tr({ uz: 'Sinfga savol:', ru: 'Вопрос классу:' })} {tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← {tr({ uz: 'Oldingi', ru: 'Назад' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}-${tr({ uz: 'karta', ru: 'карточка' })}`} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>✓ {tr({ uz: 'Tushunarli — davom etamiz', ru: 'Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi', ru: 'Дальше' })} →</button>}
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
        <span className="mstats-lbl">📊 {tr({ uz: 'Jonli natija', ru: 'Живой результат' })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>🔓 {tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }} /></div>
      {reveal ? (
        <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri", ru: 'верно' })} ✅</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: 'xato', ru: 'ошибка' })} ❌</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda', ru: 'ожидается' })} ⏳</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi', ru: 'ответили' })} 📨</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda', ru: 'ожидается' })} ⏳</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и число ✅/❌ скрыты — при нажатии «Открыть результат» всё откроется сразу и у вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — эта тема осталась классу непонятной. Перед продолжением рекомендуется короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. При желании коротко повторите тему перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — судить по проценту сложно. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>
        );
      })()}
      {waiting.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">⏳ {tr({ uz: 'Kutilmoqda:', ru: 'Ожидаются:' })}</span>
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуется объяснить её ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в реальном времени…' })}</p>}
    </div>
  );
}

// ===== MENTOR YOZMA-ISH PANELI — s6 (amaliyot) va s15 (yakuniy g'oya) uchun =====
// O'quvchining yozgan MATNI serverga bormaydi (jadval sxemasi) — faqat «tugatdi»
// belgisi boradi. Mentor kim tugatgani/kim yozayotganini jonli ko'radi.
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
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval natijani oching', ru: 'Сначала откройте результат' }) : solved ? { uz: 'Davom etish', ru: 'Продолжить' } : (oneShot ? { uz: 'Javob tanlang', ru: 'Выберите ответ' } : { uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, думайте перед нажатием!' })}</p>}
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
                <span style={{ flex: 1 }}>{fmtCode(opt)}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? fmtCode(`✓ ${tr({ uz: "To'g'ri javob", ru: 'Правильный ответ' })}: ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`)
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? fmtCode(`${tr({ uz: "To'g'ri javob", ru: 'Правильный ответ' })}: ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`)
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {fmtCode(isMentorLive
              ? explainCorrect
              : waiting
                ? tr({ uz: "Mentor «Natijani ochish»ni bosganda to'g'ri javob hammada birdan ko'rinadi.", ru: 'Когда ментор нажмёт «Открыть результат», правильный ответ появится у всех одновременно.' })
                : wrongLocked
                  ? (explainWrong[picked] ?? explainWrong.default)
                  : solved ? explainCorrect : (explainWrong[picked] ?? explainWrong.default))}
          </p>
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
              Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */}
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>📖 {tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish", ru: 'открыть подсказку' })} ▾</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

// ===== BROWSER (jonli sayt preview) =====
const Browser = ({ url = 'mening-saytim.uz', children, dark = false }) => (
  <div className={`browser ${dark ? 'browser-dark' : ''}`}>
    <div className="browser-bar">
      <span className="browser-dot" style={{ background: '#FF5F56' }} />
      <span className="browser-dot" style={{ background: '#FFBD2E' }} />
      <span className="browser-dot" style={{ background: '#27C93F' }} />
      <span className="browser-url">{url}</span>
    </div>
    <div className="browser-body">{children}</div>
  </div>
);

// ===== FLOW (Hodisa -> Reaksiya -> O'zgarish) =====
const Flow = ({ step }) => {
  const NODES = [{ n: '1', l: tr({ uz: 'Hodisa', ru: 'Событие' }) }, { n: '2', l: tr({ uz: 'Reaksiya', ru: 'Реакция' }) }, { n: '3', l: tr({ uz: "O'zgarish", ru: 'Изменение' }) }];
  return (
    <div className="flow">
      {NODES.map((nd, i) => (
        <React.Fragment key={i}>
          <div className={`flow-node ${step >= i + 1 ? 'on' : ''}`}><span className="flow-n">{nd.n}</span><span>{nd.l}</span></div>
          {i < 2 && <span className="flow-arrow">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

// Kichik sayt kartasi (ko'p ekranda qayta ishlatiladi)
const SiteCard = ({ name = 'Akmal', role, children }) => (
  <div className="site-card">
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className="site-ava">{(name && name.trim()[0]) || 'A'}</div>
      <div>
        <div className="site-name">{name}</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>{tr(role) || tr({ uz: 'Veb-dasturchi · 14 yosh', ru: 'Веб-разработчик · 14 лет' })}</div>
      </div>
    </div>
    {children}
  </div>
);

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
        <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })} title={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })}>{big ? '✕' : '⛶'}</button>
        {children}
      </div>
    </>
  );
};

// ===== SCREEN 0 — HOOK (o'lik sayt) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [dead, setDead] = useState(0);
  const [shake, setShake] = useState(false);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const timer = useRef(null);
  const OPTS = [
    { id: 'a', label: tr({ uz: "JavaScript yo'q — sayt reaksiya qila olmaydi", ru: 'Нет JavaScript — сайт не может реагировать' }) },
    { id: 'b', label: tr({ uz: "Internet sekin, shuning uchun ishlamayapti", ru: 'Интернет медленный, поэтому не работает' }) },
    { id: 'c', label: tr({ uz: "Tugma chiroyli emas, shuning uchun bosilmaydi", ru: 'Кнопка некрасивая, поэтому не нажимается' }) }
  ];
  useEffect(() => () => clearTimeout(timer.current), []);
  const tapDead = () => { setDead(d => d + 1); setShake(true); clearTimeout(timer.current); timer.current = setTimeout(() => setShake(false), 360); };
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 820 }}>{tr({ uz: <>Chiroyli sayt, lekin tugma <span className="italic" style={{ color: T.accent }}>bosilsa</span> — hech nima bo'lmaydi</>, ru: <>Красивый сайт, но <span className="italic" style={{ color: T.accent }}>нажимаешь</span> кнопку — и ничего не происходит</> })}</h1>
        <Mentor>{tr({ uz: <>Mana siz qurgan sayt — chiroyli ko'rinadi. Pastdagi <b style={{ color: T.ink }}>Like</b> tugmasini bir necha marta bosing va diqqat qiling: nima o'zgaryapti? Hech narsa! Hozircha bu sayt <b style={{ color: T.ink }}>jonsiz</b> — bosasiz, lekin u <b style={{ color: T.ink }}>javob bermaydi</b>, xuddi devordagi <b style={{ color: T.ink }}>rasm</b>dek qotib turadi.</>, ru: <>Вот сайт, который вы построили, — выглядит красиво. Нажмите кнопку <b style={{ color: T.ink }}>Like</b> внизу несколько раз и обратите внимание: что меняется? Ничего! Пока этот сайт <b style={{ color: T.ink }}>неживой</b> — вы нажимаете, а он <b style={{ color: T.ink }}>не отвечает</b>, застыл, как <b style={{ color: T.ink }}>картина</b> на стене.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: 'Sizning saytingiz', ru: 'Ваш сайт' })}</p>
            <Browser>
              <SiteCard>
                <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, opacity: 0.85 }}>{tr({ uz: 'Salom! Bu mening birinchi saytim. Yoqsa, like bosing.', ru: 'Привет! Это мой первый сайт. Понравился — ставь лайк.' })}</p>
                <button className={`site-like ${shake ? 'shake' : ''}`} onClick={tapDead}>Like · 0</button>
                {dead > 0 && <p className="mono small" style={{ color: T.accent, margin: '4px 0 0' }}>{tr({ uz: <>{dead}-marta bosildi, son hali 0. Hech nima bo'lmadi.</>, ru: <>Нажато {dead} раз — число всё ещё 0. Ничего не произошло.</> })}</p>}
              </SiteCard>
            </Browser>
          </Col>
          <Col>
            {dead < 3 ? (
              <div className="frame-dash" style={{ display: 'flex', alignItems: 'center', minHeight: 120 }}>
                <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Avval tugmani <b>kamida 3 marta</b> bosib ko'ring — jonsiz sayt qanaqa ekanini his qiling.</>, ru: <>Сначала нажмите кнопку <b>минимум 3 раза</b> — почувствуйте, каким бывает неживой сайт.</> })}</p>
              </div>
            ) : (
              <div className="fade-step">
                <p className="eyebrow" style={{ color: T.ink2, margin: '0 0 9px' }}>{tr({ uz: 'Nega tugma ishlamayapti?', ru: 'Почему кнопка не работает?' })}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {OPTS.map(o => {
                    const on = picked === o.id;
                    return (
                      <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                        <span className="radio">{on && <span className="radio-dot" />}</span>
                        <span>{o.label}</span>
                      </button>
                    );
                  })}
                </div>
                {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>To'g'ri. HTML/CSS — saytning <b>tashqi ko'rinishi</b>, lekin u <b>jonsiz</b>. Jon kiritadigan narsa — <b>JavaScript</b>. Bugun saytimizni jonlantiramiz.</>, ru: <>Верно. HTML/CSS — это <b>внешний вид</b> сайта, но сам он <b>неживой</b>. Жизнь в него вдыхает <b>JavaScript</b>. Сегодня мы оживим наш сайт.</> })}</p>}
              </div>
            )}
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
    { text: tr({ uz: 'Like sanagich — bosilsa son oshadi', ru: 'Счётчик лайков — нажали, число выросло' }), tag: 'son' },
    { text: tr({ uz: 'Tungi / kunduzgi rejim', ru: 'Ночной / дневной режим' }), tag: 'rejim' },
    { text: tr({ uz: "Ko'rsat / yashir — menyu, batafsil", ru: 'Показать / скрыть — меню, «подробнее»' }), tag: 'holat' },
    { text: tr({ uz: "Jonli salom — ism yozsangiz o'zgaradi", ru: 'Живое приветствие — пишете имя, оно меняется' }), tag: 'input' },
    { text: tr({ uz: "Forma tekshiruvi — bo'sh bo'lsa xato", ru: 'Проверка формы — пусто, значит ошибка' }), tag: 'shart' }
  ];
  const NODES = [
    { n: '1', name: tr({ uz: 'HODISA', ru: 'СОБЫТИЕ' }), desc: tr({ uz: 'Foydalanuvchi biror harakat qiladi (bosish, yozish)', ru: 'Пользователь что-то делает (клик, ввод)' }) },
    { n: '2', name: tr({ uz: 'REAKSIYA', ru: 'РЕАКЦИЯ' }), desc: tr({ uz: 'JavaScript funksiyasi ishga tushadi', ru: 'Запускается функция JavaScript' }) },
    { n: '3', name: tr({ uz: "O'ZGARISH", ru: 'ИЗМЕНЕНИЕ' }), desc: tr({ uz: "Sahifa ko'z oldida o'zgaradi", ru: 'Страница меняется на глазах' }) }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const [flowStep, setFlowStep] = useState(0);
  useEffect(() => { let i = 0; const id = setInterval(() => { i = (i + 1) % 4; setFlowStep(i); }, 850); return () => clearInterval(id); }, []);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Jonlantirishning oddiy qoidasi', ru: 'Простое правило оживления' })}</p>
      <div className="fade-up"><Flow step={flowStep} /></div>
      <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {NODES.map(nd => {
          const active = String(flowStep) === nd.n;
          return (
            <div key={nd.n} className="frame" style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 16px', boxShadow: active ? `inset 0 0 0 2px ${T.accent}, 0 10px 24px -6px rgba(255,79,40,0.28)` : `0 8px 22px -6px rgba(${T.shadowBase},0.14)`, transform: active ? 'translateX(3px)' : 'none', transition: 'all .35s' }}>
              <span className="num-badge" style={{ background: active ? T.accent : T.accentSoft, color: active ? '#fff' : T.accent, transition: 'all .35s' }}>{nd.n}</span>
              <div><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, margin: 0 }}>{nd.name}</p><p className="body" style={{ margin: '1px 0 0', color: T.ink2 }}>{nd.desc}</p></div>
            </div>
          );
        })}
      </div>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: "Bugun saytga 5 ta vosita qo'shamiz", ru: 'Сегодня добавим на сайт 5 инструментов' })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{s.text}</span>{s.tag && <span className="step-tag">{s.tag}</span>}</span></li>))}
      </ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun saytimizni <span className="italic" style={{ color: T.accent }}>jonlantiramiz</span></>, ru: <>Сегодня мы <span className="italic" style={{ color: T.accent }}>оживим</span> наш сайт</> })}</h2></div>
        <Mentor>{tr({ uz: <>Sayt jonlanishi uchun bitta oddiy qoidani bilish kifoya: <b style={{ color: T.ink }}>HODISA → REAKSIYA → O'ZGARISH</b>. Kimdir tugmani bosadi (hodisa), JavaScript javob beradi (reaksiya), sahifa o'zgaradi. Bugun shu qoida bilan saytimizga <b style={{ color: T.ink }}>5 ta vosita</b> qo'shamiz.</>, ru: <>Чтобы сайт ожил, достаточно одного простого правила: <b style={{ color: T.ink }}>СОБЫТИЕ → РЕАКЦИЯ → ИЗМЕНЕНИЕ</b>. Кто-то нажимает кнопку (событие), JavaScript отвечает (реакция), страница меняется. Сегодня по этому правилу мы добавим на сайт <b style={{ color: T.ink }}>5 инструментов</b>.</> })}</Mentor>
        {!isNarrow ? (
          <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable>
        ) : !showSteps ? (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "5 ta vositani ko'rish", ru: 'Посмотреть 5 инструментов' })}</button>
          </div>
        ) : (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>↩ {tr({ uz: "Qoidani ko'rish", ru: 'Посмотреть правило' })}</button>
            {StepsBlock}
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — KATTA G'OYA (o'lik tugma jonlanadi) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [pressed, setPressed] = useState(!!storedAnswer);
  const [step, setStep] = useState(0);
  const timer = useRef(null);
  const done = pressed;
  useEffect(() => () => clearTimeout(timer.current), []);
  const click = () => {
    clearTimeout(timer.current);
    setStep(1);
    timer.current = setTimeout(() => {
      setStep(2);
      timer.current = setTimeout(() => {
        setStep(3); setPressed(true);
        timer.current = setTimeout(() => setStep(0), 900);
      }, 360);
    }, 360);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const running = step > 0;
  return (
    <Stage eyebrow={tr({ uz: "Katta g'oya", ru: 'Главная идея' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval tugmani bosing', ru: 'Сначала нажмите кнопку' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tugma bosilganda <span className="italic" style={{ color: T.accent }}>aslida</span> nima sodir bo'ladi?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>на самом деле</span> происходит при нажатии кнопки?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Biz tugmaga JavaScript "uladik". Endi uni bosing va <b style={{ color: T.ink }}>3 bosqichni</b> kuzating: <b style={{ color: T.accent }}>Hodisa</b> (bosish sezildi) → <b style={{ color: T.accent }}>Reaksiya</b> (funksiya ishladi) → <b style={{ color: T.accent }}>O'zgarish</b> (sahifa o'zgardi). Mana shu — jonlantirish.</>, ru: <>Мы «подключили» JavaScript к кнопке. Теперь нажмите её и проследите <b style={{ color: T.ink }}>3 шага</b>: <b style={{ color: T.accent }}>Событие</b> (нажатие замечено) → <b style={{ color: T.accent }}>Реакция</b> (функция сработала) → <b style={{ color: T.accent }}>Изменение</b> (страница изменилась). Это и есть оживление.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Saytingiz — endi reaksiya qiladi', ru: 'Ваш сайт — теперь он реагирует' })}</p>
            <Browser>
              <SiteCard>
                <p style={{ fontSize: 13, margin: 0, opacity: 0.85 }}>{tr({ uz: 'Tugmani bosing.', ru: 'Нажмите кнопку.' })}</p>
                <button className="site-btn" onClick={click} style={{ background: pressed && step === 0 ? T.success : T.ink }}>{step === 0 && pressed ? tr({ uz: 'Ishladi!', ru: 'Сработало!' }) : (running ? tr({ uz: 'Ishlayapti…', ru: 'Работает…' }) : tr({ uz: 'Meni bos', ru: 'Нажми меня' }))}</button>
              </SiteCard>
            </Browser>
            <div className="codebox" style={{ fontSize: 'clamp(12px,1.6vw,13.5px)' }}>
              <div><CM>// tugma BOSILGANDA bu funksiya ishlaydi:</CM></div>
              <div><FN>tugma</FN>.<FN>onclick</FN> = () =&gt; {'{'}</div>
              <div style={{ paddingLeft: 18 }}><FN>tugma</FN>.<FN>matn</FN> = <STR>{tr({ uz: '"Ishladi!"', ru: '"Сработало!"' })}</STR></div>
              <div>{'}'}</div>
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Nima yuz beryapti?', ru: 'Что происходит?' })}</p>
            <div className="frame" style={{ display: 'flex', justifyContent: 'center', padding: '22px 10px' }}><Flow step={step} /></div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Sezdingizmi? Bir bosish — uchta narsa: sayt hodisani <b>eshitdi</b>, JavaScript <b>javob berdi</b>, ekran <b>o'zgardi</b>. Statik rasm jonli sahifaga aylandi.</>, ru: <>Заметили? Одно нажатие — три вещи: сайт <b>услышал</b> событие, JavaScript <b>ответил</b>, экран <b>изменился</b>. Статичная картинка стала живой страницей.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — HODISALAR (event turlari) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const isMobile = useIsMobile();
  const EVENTS = [
    { id: 'click', name: tr({ uz: 'Bosish (click)', ru: 'Клик (click)' }), hint: tr({ uz: 'Tugma yoki rasmni bosganda', ru: 'Когда нажимают кнопку или картинку' }) },
    { id: 'hover', name: isMobile ? tr({ uz: 'Bosib turish (hover)', ru: 'Нажать и держать (hover)' }) : tr({ uz: 'Ustiga olib borish (hover)', ru: 'Наведение (hover)' }), hint: isMobile ? tr({ uz: 'Element ustida barmoqni bosib turganda', ru: 'Когда держите палец на элементе' }) : tr({ uz: 'Sichqoncha ustiga kelganda', ru: 'Когда мышка оказывается сверху' }) },
    { id: 'type', name: tr({ uz: 'Yozish (input)', ru: 'Ввод (input)' }), hint: tr({ uz: 'Matn maydoniga yozganda', ru: 'Когда печатают в текстовом поле' }) }
  ];
  const [active, setActive] = useState('click');
  const [seen, setSeen] = useState(new Set(['click']));
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [text, setText] = useState('');
  const done = seen.size >= 2;
  const pick = (id) => { setActive(id); setSeen(prev => { const n = new Set(prev); n.add(id); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Hodisalar', ru: 'События' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Kamida 2 hodisani sinang', ru: 'Попробуйте минимум 2 события' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sayt foydalanuvchining qaysi <span className="italic" style={{ color: T.accent }}>harakatlarini</span> sezadi?</>, ru: <>Какие <span className="italic" style={{ color: T.accent }}>действия</span> пользователя замечает сайт?</> })}</h2></div>
        <Mentor>{tr({ uz: <>"Hodisa" — bu foydalanuvchining harakati. Eng ko'p uchraydigani uchta: <b style={{ color: T.ink }}>bosish</b>, <b style={{ color: T.ink }}>ustiga olib borish</b> va <b style={{ color: T.ink }}>yozish</b>. Har birini tanlab, o'ngdagi saytda jonli sinab ko'ring.</>, ru: <>«Событие» — это действие пользователя. Чаще всего встречаются три: <b style={{ color: T.ink }}>клик</b>, <b style={{ color: T.ink }}>наведение</b> и <b style={{ color: T.ink }}>ввод текста</b>. Выбирайте каждое и пробуйте вживую на сайте справа.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {EVENTS.map(e => (
                <button key={e.id} className={`evt-card ${active === e.id ? 'on' : ''}`} onClick={() => pick(e.id)}>
                  <span style={{ flex: 1 }}><span className="evt-name">{e.name}</span><br /><span className="evt-hint">{e.hint}</span></span>
                  {seen.has(e.id) && <span style={{ color: T.success }}>✓</span>}
                </button>
              ))}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Sinab ko'ring", ru: 'Попробуйте' })}</p>
            <Browser url="sinov.uz">
              {active === 'click' && (
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <button className="site-btn" onClick={() => setClicked(c => !c)} style={{ background: clicked ? T.success : T.ink }}>{clicked ? tr({ uz: 'Bosildi!', ru: 'Нажато!' }) : tr({ uz: 'Meni bos', ru: 'Нажми меня' })}</button>
                  <p className="small" style={{ margin: '10px 0 0', opacity: 0.7 }}>{tr({ uz: "Bosish hodisasi → tugma o'zgaradi", ru: 'Событие клика → кнопка меняется' })}</p>
                </div>
              )}
              {active === 'hover' && (
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onTouchStart={() => setHovered(true)}
                    onTouchEnd={(e) => { e.preventDefault(); setHovered(false); }}
                    style={{ display: 'inline-block', padding: '18px 26px', borderRadius: 12, fontWeight: 700, transition: 'all .2s', background: hovered ? T.accent : T.accentSoft, color: hovered ? '#fff' : T.accent, cursor: 'pointer', userSelect: 'none', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                  >{hovered ? tr({ uz: 'Ustimdasiz!', ru: 'Вы на мне!' }) : (isMobile ? tr({ uz: 'Bosib turing', ru: 'Держите палец' }) : tr({ uz: 'Ustimga keling', ru: 'Наведите на меня' }))}</div>
                  <p className="small" style={{ margin: '10px 0 0', opacity: 0.7 }}>{isMobile ? tr({ uz: "Bosib turing → rang o'zgaradi", ru: 'Держите → цвет меняется' }) : tr({ uz: "Hover hodisasi → rang o'zgaradi", ru: 'Событие hover → цвет меняется' })}</p>
                </div>
              )}
              {active === 'type' && (
                <div style={{ padding: '4px 0' }}>
                  <input value={text} onChange={e => setText(e.target.value)} placeholder={tr({ uz: 'Bu yerga yozing…', ru: 'Пишите сюда…' })} style={{ width: '100%', padding: '10px 13px', borderRadius: 10, border: `1.5px solid ${T.ink3}`, fontFamily: "'Manrope'", fontSize: 14, outline: 'none' }} />
                  <p style={{ margin: '12px 0 0', fontSize: 15 }}>{tr({ uz: 'Siz yozdingiz:', ru: 'Вы написали:' })} <b style={{ color: T.accent }}>{text || '—'}</b></p>
                  <p className="small" style={{ margin: '6px 0 0', opacity: 0.7 }}>{tr({ uz: 'Yozish hodisasi → matn jonli aks etadi', ru: 'Событие ввода → текст отображается вживую' })}</p>
                </div>
              )}
            </Browser>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Har xil hodisa — har xil reaksiya. Sayt foydalanuvchini "eshitadi" va javob beradi.</>, ru: <>Разное событие — разная реакция. Сайт «слышит» пользователя и отвечает ему.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText={tr({ uz: 'Hodisa (event) nima?', ru: 'Что такое событие (event)?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Veb-saytda <span className="italic" style={{ color: T.accent }}>"hodisa" (event)</span> nima?</>, ru: <>Что такое <span className="italic" style={{ color: T.accent }}>«событие» (event)</span> на веб-сайте?</> })}</h2></>}
    options={[tr({ uz: 'Saytning rangi va shrifti', ru: 'Цвет и шрифт сайта' }), tr({ uz: 'Foydalanuvchining harakati', ru: 'Действие пользователя' }), tr({ uz: 'Internet ulanish tezligi', ru: 'Скорость интернет-соединения' }), tr({ uz: 'Saytga berilgan fayl nomi', ru: 'Имя файла сайта' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! Hodisa — foydalanuvchi qiladigan harakat: tugmani bosish, matn yozish, sichqonchani ustiga olib borish. JavaScript shu hodisaga javob beradi.", ru: 'Верно! Событие — это действие пользователя: нажатие кнопки, ввод текста, наведение мышки. JavaScript отвечает именно на это событие.' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — rang va shrift bu CSS (ko'rinish). Hodisa esa foydalanuvchining harakati.", ru: 'Нет — цвет и шрифт это CSS (внешний вид). А событие — действие пользователя.' }),
      2: tr({ uz: "Yo'q — internet tezligi boshqa narsa. Hodisa — bosish, yozish kabi harakatlar.", ru: 'Нет — скорость интернета это другое. Событие — действия вроде клика и ввода.' }),
      3: tr({ uz: "Yo'q — nom boshqa. Hodisa — foydalanuvchi bajaradigan harakat.", ru: 'Нет — имя это другое. Событие — действие, которое совершает пользователь.' }),
      default: tr({ uz: 'Hodisa = foydalanuvchining harakati (bosish, yozish, hover).', ru: 'Событие = действие пользователя (клик, ввод, hover).' })
    }} />
);

// ===== SCREEN 5 — VOSITA 1: LIKE SANAGICH =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [n, setN] = useState(storedAnswer ? 3 : 0);
  const [pop, setPop] = useState(false);
  const timer = useRef(null);
  const done = n >= 3;
  useEffect(() => () => clearTimeout(timer.current), []);
  const like = () => { setN(c => c + 1); setPop(true); clearTimeout(timer.current); timer.current = setTimeout(() => setPop(false), 200); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Vosita 1 · Like', ru: 'Инструмент 1 · Like' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: '3 marta like bosing', ru: 'Нажмите Like 3 раза' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Necha marta bosilganini sayt qanday <span className="italic" style={{ color: T.accent }}>eslab qoladi?</span></>, ru: <>Как сайт <span className="italic" style={{ color: T.accent }}>запоминает</span>, сколько раз нажали?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Hookdagi jonsiz tugma esingizdami? Endi unga jon kiritamiz. Sayt nechta like borligini <b style={{ color: T.ink }}>o'zgaruvchi</b>da — <span className="mono">son</span> ichida — eslab qoladi. Har bosishda funksiya <span className="mono">son = son + 1</span> qiladi va ekranni yangilaydi. Like bosing va sonni kuzating.</>, ru: <>Помните неживую кнопку из начала урока? Теперь вдохнём в неё жизнь. Сколько лайков — сайт запоминает в <b style={{ color: T.ink }}>переменной</b> <span className="mono">son</span>. При каждом нажатии функция делает <span className="mono">son = son + 1</span> и обновляет экран. Нажимайте Like и следите за числом.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Saytingiz', ru: 'Ваш сайт' })}</p>
            <Browser>
              <SiteCard>
                <p style={{ fontSize: 13, margin: 0, opacity: 0.85 }}>{tr({ uz: 'Saytim yoqdimi? Like bosing.', ru: 'Нравится мой сайт? Ставь лайк.' })}</p>
                <button className="site-like" onClick={like} style={{ transform: pop ? 'scale(1.12)' : 'scale(1)', position: 'relative' }}>Like · {n}{n > 0 && <span className="float-plus" key={n}>+1</span>}</button>
              </SiteCard>
            </Browser>
          </Col>
          <Col>
            <div className="codebox">
              <div><KW>let</KW> son = <NUM>0</NUM> <CM>// o'zgaruvchi</CM></div>
              <div style={{ marginTop: 6 }}><FN>tugma</FN>.<FN>onclick</FN> = () =&gt; {'{'}</div>
              <div style={{ paddingLeft: 18 }}>son = son + <NUM>1</NUM> <CM>// +1</CM></div>
              <div style={{ paddingLeft: 18 }}><FN>tugma</FN>.<FN>matn</FN> = <STR>"Like · "</STR> + son</div>
              <div>{'}'}</div>
            </div>
            <div className="iwatch">
              <span className="iwatch-lbl">son</span>
              <span className="iwatch-eq">=</span>
              <span className="iwatch-num pop-num" key={n}>{n}</span>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Har bosish — funksiya ishladi, son oshdi, ekran yangilandi. Mana o'zgaruvchi va hodisa birga ishlagani.</>, ru: <>Каждое нажатие — функция сработала, число выросло, экран обновился. Вот переменная и событие в связке.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — VOSITA 2: TUNGI/KUNDUZGI REJIM =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [dark, setDark] = useState(false);
  const [seen, setSeen] = useState(new Set(['light']));
  const done = seen.size >= 2;
  const toggle = () => { setDark(d => { const nv = !d; setSeen(prev => { const n = new Set(prev); n.add(nv ? 'dark' : 'light'); return n; }); return nv; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Vosita 2 · Rejim', ru: 'Инструмент 2 · Режим' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Rejimni almashtiring', ru: 'Переключите режим' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta tugma butun sayt ko'rinishini qanday <span className="italic" style={{ color: T.accent }}>o'zgartiradi?</span></>, ru: <>Как одна кнопка <span className="italic" style={{ color: T.accent }}>меняет</span> вид всего сайта?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bu yerda <b style={{ color: T.ink }}>shart</b> (if/else) ishlaydi: <b style={{ color: T.ink }}>agar</b> hozir yorug' bo'lsa — qorong'iga o'tkaz, <b style={{ color: T.ink }}>aks holda</b> — yorug'ga. Bitta tugma butun saytning ko'rinishini o'zgartiradi. Tugmani bosib ikkala rejimni ko'ring.</>, ru: <>Здесь работает <b style={{ color: T.ink }}>условие</b> (if/else): <b style={{ color: T.ink }}>если</b> сейчас светло — переключи на тёмное, <b style={{ color: T.ink }}>иначе</b> — на светлое. Одна кнопка меняет вид всего сайта. Нажмите кнопку и посмотрите оба режима.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Saytingiz', ru: 'Ваш сайт' })} — {dark ? tr({ uz: 'tungi', ru: 'ночной' }) : tr({ uz: 'kunduzgi', ru: 'дневной' })}</p>
            <Browser dark={dark}>
              <SiteCard>
                <p style={{ fontSize: 13, margin: 0, opacity: 0.85 }}><span className="pop-num" key={dark ? 'd' : 'l'} style={{ marginRight: 4 }}>{dark ? '🌙' : '☀️'}</span>{tr({ uz: "Ranglar rejimga qarab o'zgaradi.", ru: 'Цвета меняются в зависимости от режима.' })}</p>
                <button className="site-btn" onClick={toggle} style={{ background: dark ? '#FFD380' : T.ink, color: dark ? '#1A2436' : '#fff' }}>{dark ? tr({ uz: '☀️ Kunduzgi rejim', ru: '☀️ Дневной режим' }) : tr({ uz: '🌙 Tungi rejim', ru: '🌙 Ночной режим' })}</button>
              </SiteCard>
            </Browser>
          </Col>
          <Col>
            <div className="codebox">
              <div><KW>if</KW> (rejim === <STR>"yorug'"</STR>) {'{'}</div>
              <div style={{ paddingLeft: 18, background: dark ? 'rgba(255,79,40,0.2)' : 'transparent', borderRadius: 4, transition: 'background .35s' }}>rejim = <STR>"qorong'i"</STR> <CM>// tungi</CM></div>
              <div>{'}'} <KW>else</KW> {'{'}</div>
              <div style={{ paddingLeft: 18, background: !dark ? 'rgba(31,122,77,0.22)' : 'transparent', borderRadius: 4, transition: 'background .35s' }}>rejim = <STR>"yorug'"</STR> <CM>// kunduzgi</CM></div>
              <div>{'}'}</div>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bitta tugma — butun sayt o'zgardi. Bu <b>shart</b> yordamida: har bosishda rejim teskarisiga aylanadi.</>, ru: <>Одна кнопка — изменился весь сайт. Всё благодаря <b>условию</b>: при каждом нажатии режим переключается на противоположный.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — TEST 2 =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText={tr({ uz: "son = 0. Tugma bosilganda son = son + 1. Tugma 3 marta bosilsa, son nechta bo'ladi?", ru: 'son = 0. При нажатии son = son + 1. Если нажать кнопку 3 раза, чему будет равен son?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><div className="codebox" style={{ marginTop: 10, marginBottom: 6 }}><div><KW>let</KW> son = <NUM>0</NUM></div><div><FN>tugma</FN>.<FN>onclick</FN> = () =&gt; son = son + <NUM>1</NUM></div></div><h2 className="title h-ask" style={{ marginTop: 6 }}>{tr({ uz: <>Tugma <span className="italic" style={{ color: T.accent }}>3 marta</span> bosilsa, son nechta bo'ladi?</>, ru: <>Если нажать кнопку <span className="italic" style={{ color: T.accent }}>3 раза</span>, чему будет равен son?</> })}</h2></>}
    options={['0', '1', '3', '33']} correctIdx={2}
    explainCorrect={tr({ uz: "To'g'ri! Har bosish son ni 1 ga oshiradi. 3 marta bosilsa: 0 → 1 → 2 → 3. Demak son = 3.", ru: 'Верно! Каждое нажатие увеличивает son на 1. Нажали 3 раза: 0 → 1 → 2 → 3. Значит son = 3.' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — endi tugma jonli: har bosishda son oshadi. 3 marta → 3.", ru: 'Нет — теперь кнопка живая: при каждом нажатии son растёт. 3 раза → 3.' }),
      1: tr({ uz: "Yo'q — 1 faqat bitta bosishdan keyin bo'lardi. 3 marta bossak → 3.", ru: 'Нет — 1 было бы после одного нажатия. Нажали 3 раза → 3.' }),
      3: tr({ uz: "Yo'q — 33 bu matn ulanishi bo'lardi. Bu yerda son ga +1 qo'shiladi: 3.", ru: 'Нет — 33 получилось бы при склейке текста. Здесь к son прибавляется +1: 3.' }),
      default: tr({ uz: 'Har bosish +1 → 3 marta → son = 3.', ru: 'Каждое нажатие +1 → 3 раза → son = 3.' })
    }} />
);

// ===== SCREEN 8 — VOSITA 3: KO'RSAT / YASHIR =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(new Set());
  const done = seen.size >= 2;
  const toggle = () => { setOpen(o => { const nv = !o; setSeen(prev => { const n = new Set(prev); n.add(nv ? 'open' : 'closed'); return n; }); return nv; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: "Vosita 3 · Ko'rsat/Yashir", ru: 'Инструмент 3 · Показать/Скрыть' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Oching va yoping', ru: 'Откройте и закройте' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Menyu qanday qilib o'zi <span className="italic" style={{ color: T.accent }}>ochilib-yopiladi?</span></>, ru: <>Как меню само <span className="italic" style={{ color: T.accent }}>открывается и закрывается?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Menyu, "batafsil" matni, savol-javob bo'limlari — hammasi <b style={{ color: T.ink }}>bir xil oddiy qoida</b> bilan ishlaydi: <b style={{ color: T.ink }}>bosilganda ko'rsat, yana bosilganda yashir</b> (almashtirgich). Bu joyni tejaydi va saytni qulay qiladi. Tugmani bosib batafsil matnni oching-yoping.</>, ru: <>Меню, текст «подробнее», разделы вопрос-ответ — всё работает по <b style={{ color: T.ink }}>одному простому правилу</b>: <b style={{ color: T.ink }}>нажали — показать, нажали ещё раз — скрыть</b> (переключатель). Это экономит место и делает сайт удобным. Нажимайте кнопку — открывайте и закрывайте подробный текст.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Saytingiz', ru: 'Ваш сайт' })}</p>
            <Browser>
              <SiteCard>
                <button className="site-btn" onClick={toggle}>{open ? tr({ uz: '▲ Yashirish', ru: '▲ Скрыть' }) : tr({ uz: '▼ Batafsil', ru: '▼ Подробнее' })}</button>
                {open && (
                  <div className="fade-step" style={{ background: T.bg, borderRadius: 10, padding: '12px 14px', fontSize: 13, lineHeight: 1.55 }}>
                    {tr({ uz: "Men 14 yoshdaman va veb-saytlar yarataman. HTML, CSS va JavaScriptni o'rganyapman. Kelajakda o'z startapimni ochmoqchiman.", ru: 'Мне 14 лет, и я создаю веб-сайты. Учу HTML, CSS и JavaScript. В будущем хочу открыть свой стартап.' })}
                  </div>
                )}
              </SiteCard>
            </Browser>
          </Col>
          <Col>
            <div className="codebox">
              <div><FN>tugma</FN>.<FN>onclick</FN> = () =&gt; {'{'}</div>
              <div style={{ paddingLeft: 18 }}><KW>if</KW> (matn.<FN>yashirin</FN>) ko'rsat()</div>
              <div style={{ paddingLeft: 18 }}><KW>else</KW> yashir()</div>
              <div>{'}'}</div>
            </div>
            <div className="fade-up" style={{ display: 'flex', gap: 8 }}>
              <span className="tagpill" style={{ background: open ? T.successSoft : T.paper, color: open ? T.success : T.ink2 }}><span className="pop-num" key={open ? 'o' : 'c'}>{open ? '👁️' : '🙈'}</span> {tr({ uz: 'Holat:', ru: 'Состояние:' })} {open ? tr({ uz: 'ochiq', ru: 'открыто' }) : tr({ uz: 'yashirin', ru: 'скрыто' })}</span>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bir tugma — ikki holat: ochiq va yopiq. Saytlardagi menyular aynan shunday ishlaydi.</>, ru: <>Одна кнопка — два состояния: открыто и закрыто. Именно так работают меню на сайтах.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — VOSITA 4: JONLI SALOM =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [name, setName] = useState(storedAnswer ? 'Akmal' : '');
  const done = name.trim().length >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Vosita 4 · Jonli salom', ru: 'Инструмент 4 · Живое приветствие' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Ismingizni yozing', ru: 'Введите своё имя' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Siz yozayotganingizni sayt qanday <span className="italic" style={{ color: T.accent }}>darhol sezadi?</span></>, ru: <>Как сайт <span className="italic" style={{ color: T.accent }}>мгновенно замечает</span>, что вы печатаете?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bu eng yoqimli his: matn maydoniga <b style={{ color: T.ink }}>har bir harf</b> yozganingizda sayt <b style={{ color: T.ink }}>shu zahoti</b> o'zgaradi. "Yozish" hodisasi har harf yozilganda ishlaydi va salomni yangilaydi. Ismingizni yozib ko'ring.</>, ru: <>Это самое приятное чувство: с <b style={{ color: T.ink }}>каждой буквой</b>, которую вы вводите, сайт меняется <b style={{ color: T.ink }}>мгновенно</b>. Событие «ввод» срабатывает на каждую букву и обновляет приветствие. Впишите своё имя.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Saytingiz', ru: 'Ваш сайт' })}</p>
            <Browser>
              <div className="site-card">
                <div style={{ fontSize: 'clamp(20px,3vw,26px)', fontFamily: "'Source Serif 4',serif", fontWeight: 600 }}>{tr({ uz: 'Salom,', ru: 'Привет,' })} <span style={{ color: T.accent }}>{name.trim() || '—'}</span>!</div>
                <p style={{ fontSize: 13, margin: 0, opacity: 0.85 }}>{tr({ uz: 'Ismingizni kiriting:', ru: 'Введите имя:' })}</p>
                <input value={name} onChange={e => setName(e.target.value)} placeholder={tr({ uz: 'Ismingiz…', ru: 'Ваше имя…' })} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${T.ink3}`, fontFamily: "'Manrope'", fontSize: 15, outline: 'none' }} />
              </div>
            </Browser>
          </Col>
          <Col>
            <div className="codebox">
              <div><FN>maydon</FN>.<FN>oninput</FN> = () =&gt; {'{'}</div>
              <div style={{ paddingLeft: 18 }}><FN>salom</FN>.<FN>matn</FN> = <STR>{tr({ uz: '"Salom, "', ru: '"Привет, "' })}</STR> + maydon.<FN>qiymat</FN></div>
              <div>{'}'}</div>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Har harf — yangi reaksiya. Sayt sizni real vaqtda eshityapti. Juda kuchli his, to'g'rimi?</>, ru: <>Каждая буква — новая реакция. Сайт слышит вас в реальном времени. Мощное чувство, правда?</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — VOSITA 5: FORMA TEKSHIRUVI =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [val, setVal] = useState('');
  const [msg, setMsg] = useState(null); // null | 'error' | 'ok'
  const [seen, setSeen] = useState(new Set(storedAnswer ? ['error', 'ok'] : []));
  const done = seen.size >= 2;
  const submit = () => {
    const ok = val.trim().length > 0;
    setMsg(ok ? 'ok' : 'error');
    setSeen(prev => { const n = new Set(prev); n.add(ok ? 'ok' : 'error'); return n; });
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Vosita 5 · Forma', ru: 'Инструмент 5 · Форма' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Bo'sh va to'liq holatni sinang", ru: 'Попробуйте пустое и заполненное' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bo'sh forma yuborilsa, sayt buni qanday <span className="italic" style={{ color: T.accent }}>payqaydi?</span></>, ru: <>Как сайт <span className="italic" style={{ color: T.accent }}>замечает</span>, что отправили пустую форму?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Aqlli saytlar foydalanuvchi xato qilmasin deb <b style={{ color: T.ink }}>tekshiradi</b>. Bu yerda <b style={{ color: T.ink }}>shart</b> ishlaydi: <b style={{ color: T.ink }}>agar</b> maydon bo'sh bo'lsa — qizil xato, <b style={{ color: T.ink }}>aks holda</b> — yashil "yuborildi". Avval <b>bo'sh</b> holda "Yuborish"ni bosing, keyin ism yozib qayta bosing.</>, ru: <>Умные сайты <b style={{ color: T.ink }}>проверяют</b>, чтобы пользователь не ошибся. Здесь работает <b style={{ color: T.ink }}>условие</b>: <b style={{ color: T.ink }}>если</b> поле пустое — красная ошибка, <b style={{ color: T.ink }}>иначе</b> — зелёное «отправлено». Сначала нажмите «Отправить» с <b>пустым</b> полем, потом впишите имя и нажмите снова.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Saytingiz', ru: 'Ваш сайт' })}</p>
            <Browser>
              <div className="site-card">
                <p style={{ fontSize: 13, margin: 0, opacity: 0.85, fontWeight: 600 }}>{tr({ uz: "Bog'lanish formasi", ru: 'Форма обратной связи' })}</p>
                <input className={msg === 'error' ? 'shake' : ''} value={val} onChange={e => { setVal(e.target.value); setMsg(null); }} placeholder={tr({ uz: 'Ismingiz…', ru: 'Ваше имя…' })} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${msg === 'error' ? T.accent : T.ink3}`, fontFamily: "'Manrope'", fontSize: 15, outline: 'none' }} />
                <button className="site-btn" onClick={submit}>{tr({ uz: 'Yuborish', ru: 'Отправить' })}</button>
                {msg === 'error' && <p className="fade-step" style={{ margin: 0, color: T.accent, fontWeight: 600, fontSize: 13 }}>{tr({ uz: 'Iltimos, ismingizni kiriting.', ru: 'Пожалуйста, введите имя.' })}</p>}
                {msg === 'ok' && <p className="fade-step" style={{ margin: 0, color: T.success, fontWeight: 600, fontSize: 13 }}>{tr({ uz: 'Rahmat, xabaringiz yuborildi.', ru: 'Спасибо, сообщение отправлено.' })}</p>}
              </div>
            </Browser>
          </Col>
          <Col>
            <div className="codebox">
              <div><KW>if</KW> (maydon.<FN>qiymat</FN> === <STR>""</STR>) {'{'}</div>
              <div style={{ paddingLeft: 18, background: msg === 'error' ? 'rgba(255,79,40,0.2)' : 'transparent', borderRadius: 4, transition: 'background .3s' }}>xato(<STR>"Ism kiriting!"</STR>) <CM>// bo'sh</CM></div>
              <div>{'}'} <KW>else</KW> {'{'}</div>
              <div style={{ paddingLeft: 18, background: msg === 'ok' ? 'rgba(31,122,77,0.22)' : 'transparent', borderRadius: 4, transition: 'background .3s' }}>yubor() <CM>// to'liq</CM></div>
              <div>{'}'}</div>
            </div>
            <div className="fade-up" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tagpill" style={{ opacity: seen.has('error') ? 1 : 0.4 }}>{seen.has('error') ? '✓' : '1'} {tr({ uz: "bo'sh → xato", ru: 'пусто → ошибка' })}</span>
              <span className="tagpill" style={{ opacity: seen.has('ok') ? 1 : 0.4 }}>{seen.has('ok') ? '✓' : '2'} {tr({ uz: "to'liq → ok", ru: 'заполнено → ok' })}</span>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ikkala holatni ko'rdingiz. Sayt endi foydalanuvchini xatodan saqlaydi — bu professional saytlarning belgisi.</>, ru: <>Вы увидели оба состояния. Теперь сайт защищает пользователя от ошибки — признак профессионального сайта.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — TEST 3 =====
const Screen11 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText={tr({ uz: "Foydalanuvchi ism yozganda jonli salom o'zgarishi uchun qaysi hodisa kerak?", ru: 'Пользователь вводит имя — какое событие нужно, чтобы приветствие менялось вживую?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Foydalanuvchi <span className="italic" style={{ color: T.accent }}>ism yozganda</span> salom jonli o'zgarishi uchun qaysi hodisa kerak?</>, ru: <>Пользователь <span className="italic" style={{ color: T.accent }}>вводит имя</span> — какое событие нужно, чтобы приветствие менялось вживую?</> })}</h2></>}
    options={[tr({ uz: 'Bosish (click)', ru: 'Клик (click)' }), tr({ uz: 'Hech qanday hodisa kerak emas', ru: 'Никакое событие не нужно' }), tr({ uz: 'Hover (ustiga olib borish)', ru: 'Hover (наведение)' }), tr({ uz: 'Yozish (input)', ru: 'Ввод (input)' })]} correctIdx={3}
    explainCorrect={tr({ uz: "To'g'ri! Yozish (input) hodisasi har bir harf kiritilganda ishlaydi, shuning uchun salom real vaqtda o'zgaradi.", ru: 'Верно! Событие ввода (input) срабатывает на каждую букву, поэтому приветствие меняется в реальном времени.' })}
    explainWrong={{
      0: tr({ uz: 'Yo\'q — bosish faqat tugma uchun. Yozilayotgan matnni kuzatish uchun "input" hodisasi kerak.', ru: 'Нет — клик только для кнопок. Чтобы следить за вводом текста, нужно событие «input».' }),
      1: tr({ uz: 'Yo\'q — hodisasiz sayt o\'zgarmaydi. Yozishni kuzatish uchun "input" hodisasi shart.', ru: 'Нет — без события сайт не изменится. Для отслеживания ввода обязательно событие «input».' }),
      2: tr({ uz: 'Yo\'q — hover sichqoncha harakati uchun. Yozish uchun "input" hodisasi kerak.', ru: 'Нет — hover для движения мышки. Для ввода нужно событие «input».' }),
      default: tr({ uz: 'Yozishni kuzatish → "input" hodisasi.', ru: 'Следить за вводом → событие «input».' })
    }} />
);

// ===== SCREEN 12 — HAMMASI BIRGA (to'liq tirik sayt) =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [alive, setAlive] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [played, setPlayed] = useState(!!storedAnswer);
  const [deadPulse, setDeadPulse] = useState(false);
  const deadTimer = useRef(null);
  const done = played;
  const act = (fn) => () => { if (!alive) { setDeadPulse(true); clearTimeout(deadTimer.current); deadTimer.current = setTimeout(() => setDeadPulse(false), 480); return; } fn(); setPlayed(true); };
  useEffect(() => () => clearTimeout(deadTimer.current), []);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Hammasi birga', ru: 'Всё вместе' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Saytingiz bilan o'ynang", ru: 'Поиграйте со своим сайтом' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Mana — saytingiz endi <span className="italic" style={{ color: T.accent }}>to'liq jonlandi</span></>, ru: <>Вот он — ваш сайт теперь <span className="italic" style={{ color: T.accent }}>полностью ожил</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana — 5 ta vositaning hammasi bitta saytda. Like bosing, rejimni almashtiring, batafsilni oching, ismingizni yozing. Va eng qizig'i: <b style={{ color: T.ink }}>"Jonsiz"</b> tugmasini bosib, dars boshidagi jonsiz saytga qaytib ko'ring — farqni his qiling.</>, ru: <>Вот все 5 инструментов на одном сайте. Ставьте лайк, переключайте режим, открывайте «подробнее», впишите имя. И самое интересное: нажмите кнопку <b style={{ color: T.ink }}>«Неживой»</b> и вернитесь к мёртвому сайту из начала урока — почувствуйте разницу.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button className={`chip ${alive ? 'chip-on' : ''}`} onClick={() => setAlive(true)}>{tr({ uz: 'Jonli', ru: 'Живой' })}</button>
              <button className={`chip ${!alive ? 'chip-on' : ''}`} onClick={() => setAlive(false)}>{tr({ uz: 'Jonsiz', ru: 'Неживой' })}</button>
              <span className={`mono small ${deadPulse ? 'shake' : ''}`} style={{ color: alive ? T.success : (deadPulse ? T.accent : T.ink3), fontWeight: deadPulse ? 700 : 400, transition: 'color .2s' }}>{alive ? tr({ uz: 'JavaScript yoqilgan', ru: 'JavaScript включён' }) : (deadPulse ? tr({ uz: "⛔ Bosdingiz — lekin hech nima bo'lmadi (jonsiz!)", ru: '⛔ Вы нажали — но ничего не произошло (неживой!)' }) : tr({ uz: "JavaScript o'chiq — bosing, hech nima bo'lmaydi", ru: 'JavaScript выключен — нажимайте, ничего не произойдёт' }))}</span>
            </div>
            <Browser dark={alive && dark}>
              <div className="site-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="site-ava">{(name.trim()[0]) || 'A'}</div>
                  <div>
                    <div className="site-name">{tr({ uz: 'Salom,', ru: 'Привет,' })} {name.trim() || 'Akmal'}!</div>
                    <div style={{ fontSize: 13, opacity: 0.7 }}>{tr({ uz: 'Veb-dasturchi · 14 yosh', ru: 'Веб-разработчик · 14 лет' })}</div>
                  </div>
                </div>
                <input value={name} onChange={e => { if (alive) { setName(e.target.value); setPlayed(true); } }} placeholder={alive ? tr({ uz: 'Ismingizni yozing…', ru: 'Введите имя…' }) : tr({ uz: "(jonsiz — yozib bo'lmaydi)", ru: '(неживой — печатать нельзя)' })} style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: `1.5px solid ${T.ink3}`, fontFamily: "'Manrope'", fontSize: 14, outline: 'none', opacity: alive ? 1 : 0.5 }} />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="site-like" onClick={act(() => setLikes(c => c + 1))}>Like · {likes}</button>
                  <button className="site-btn" onClick={act(() => setDark(d => !d))} style={{ background: dark ? '#FFD380' : T.ink, color: dark ? '#1A2436' : '#fff' }}>{dark ? tr({ uz: 'Kunduzgi', ru: 'Дневной' }) : tr({ uz: 'Tungi', ru: 'Ночной' })}</button>
                  <button className="site-btn" onClick={act(() => setOpen(o => !o))}>{open ? tr({ uz: '▲ Yashir', ru: '▲ Скрыть' }) : tr({ uz: '▼ Batafsil', ru: '▼ Подробнее' })}</button>
                </div>
                {alive && open && <div className="fade-step" style={{ background: dark ? 'rgba(255,255,255,0.08)' : T.bg, borderRadius: 9, padding: '10px 12px', fontSize: 13 }}>{tr({ uz: "HTML, CSS va JavaScriptni o'rganyapman. Kelajakda startap ochaman.", ru: 'Учу HTML, CSS и JavaScript. В будущем открою стартап.' })}</div>}
              </div>
            </Browser>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Nimalarni sinab ko'rdingiz?", ru: 'Что вы попробовали?' })}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[['Like', likes > 0], [tr({ uz: 'Tungi rejim', ru: 'Ночной режим' }), dark], [tr({ uz: 'Batafsil', ru: 'Подробнее' }), open], [tr({ uz: 'Ism', ru: 'Имя' }), name.trim().length > 0]].map(([lbl, ok], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: T.paper, borderRadius: 10, padding: '9px 13px', boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.14)` }}>
                  <span className="pop-num" key={ok ? 'y' : 'n'} style={{ color: ok ? T.success : T.ink3, fontWeight: 700 }}>{ok ? '✓' : '○'}</span>
                  <span className="body" style={{ margin: 0, color: ok ? T.ink : T.ink2 }}>{lbl}</span>
                </div>
              ))}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Statik rasmdan to'laqonli jonli saytgacha. Siz HTML/CSS saytiga JavaScript bilan jon kiritdingiz — bu haqiqiy dasturchining ishi.</>, ru: <>От статичной картинки до полноценного живого сайта. Вы вдохнули жизнь в HTML/CSS-сайт с помощью JavaScript — это работа настоящего разработчика.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — HAYOTDA (statik vs interaktiv) =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const CARDS = {
    statik: { color: T.ink3, name: tr({ uz: 'Statik (jonsiz)', ru: 'Статичный (неживой)' }), when: tr({ uz: "Faqat ko'rsatadi, javob bermaydi", ru: 'Только показывает, не отвечает' }), ex: [tr({ uz: 'Gazeta yoki plakat', ru: 'Газета или плакат' }), tr({ uz: 'Oddiy "biz haqimizda" sahifa', ru: 'Обычная страница «о нас»' }), tr({ uz: "Rasm galereyasi (faqat ko'rish)", ru: 'Галерея картинок (только просмотр)' })] },
    inter: { color: T.accent, name: tr({ uz: 'Interaktiv (jonli)', ru: 'Интерактивный (живой)' }), when: tr({ uz: 'Foydalanuvchiga javob beradi', ru: 'Отвечает пользователю' }), ex: [tr({ uz: 'Instagram — like, komment', ru: 'Instagram — лайки, комменты' }), tr({ uz: "Onlayn o'yin", ru: 'Онлайн-игра' }), tr({ uz: "Do'kon — savatga qo'shish", ru: 'Магазин — добавить в корзину' })] }
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 2;
  const tap = (k) => { setActive(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Hayotda', ru: 'В жизни' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `${seen.size}/2 ko'ring`, ru: `Посмотрите ${seen.size}/2` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Interaktivlik <span className="italic" style={{ color: T.accent }}>qachon</span> kerak?</>, ru: <>Когда <span className="italic" style={{ color: T.accent }}>нужна</span> интерактивность?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har bir sayt ham jonli bo'lishi shart emas. Ba'zilari faqat <b style={{ color: T.ink }}>ma'lumot ko'rsatadi</b> (statik), ba'zilari esa foydalanuvchi bilan <b style={{ color: T.ink }}>"gaplashadi"</b> (interaktiv). Har ikkala kartani bosib, farqini ko'ring.</>, ru: <>Не каждый сайт обязан быть живым. Одни просто <b style={{ color: T.ink }}>показывают информацию</b> (статичные), другие <b style={{ color: T.ink }}>«разговаривают»</b> с пользователем (интерактивные). Нажмите обе карточки и увидьте разницу.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.keys(CARDS).map(k => (
                <button key={k} onClick={() => tap(k)} style={{ display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 14, padding: '15px 16px', background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: 'all 0.18s' }}>
                  <span className={k === 'inter' ? 'live-dot' : ''} style={{ width: 14, height: 14, borderRadius: 4, background: CARDS[k].color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 16, color: T.ink }}>{CARDS[k].name}</span>
                  {seen.has(k) && <span style={{ marginLeft: 'auto', color: T.success, fontSize: 15 }}>✓</span>}
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {active ? (
              <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span className={active === 'inter' ? 'live-dot' : ''} style={{ width: 14, height: 14, borderRadius: 4, background: CARDS[active].color }} /><span className="sk-wordbadge">{CARDS[active].name}</span></span>
                <p className="body" style={{ color: T.ink, margin: '11px 0 9px', fontWeight: 600 }}>{CARDS[active].when}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {CARDS[active].ex.map((e, i) => (<div key={i} className="ex-row" style={{ display: 'flex', gap: 8, alignItems: 'center', background: T.bg, borderRadius: 8, padding: '8px 11px', animationDelay: `${0.05 + i * 0.09}s` }}><span style={{ color: T.accent }}>•</span><span className="body" style={{ margin: 0, color: T.ink2 }}>{e}</span></div>))}
                </div>
              </div>
            ) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Bir kartani bosing', ru: 'Нажмите на карточку' })}</p></div> : null)}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Esda tuting: ishlatadigan deyarli barcha ilovalar — Instagram, YouTube, o'yinlar — <b>interaktiv</b>. Jonlantirish — zamonaviy vebning yuragi.</>, ru: <>Запомните: почти все приложения, которыми вы пользуетесь, — Instagram, YouTube, игры — <b>интерактивные</b>. Оживление — сердце современного веба.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — VIBECODING (tasvirla -> tasdiqla -> quradi -> tekshir) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const TASKS = [
    { id: 't1', label: tr({ uz: "Saytimga tungi rejim qo'shib ber", ru: 'Добавь на мой сайт ночной режим' }), plan: [tr({ uz: "Tungi rejim tugmasini qo'shaman", ru: 'Добавлю кнопку ночного режима' }), tr({ uz: "Bosilganda ranglarni qorong'iga o'tkazaman", ru: 'При нажатии переключу цвета на тёмные' })], dark: true, result: 'Tungi rejim' },
    { id: 't2', label: tr({ uz: "Like tugmasini qo'shib ber", ru: 'Добавь кнопку Like' }), plan: [tr({ uz: "son nomli o'zgaruvchi yarataman", ru: 'Создам переменную son' }), tr({ uz: 'Bosilganda sonni 1 ga oshiraman', ru: 'При нажатии увеличу число на 1' })], dark: false, result: 'Like · 0' },
    { id: 't3', label: tr({ uz: "Ochiladigan menyu qo'shib ber", ru: 'Добавь раскрывающееся меню' }), plan: [tr({ uz: "Menyu tugmasini qo'yaman", ru: 'Поставлю кнопку меню' }), tr({ uz: "Bosilganda ro'yxatni ko'rsataman/yashiraman", ru: 'При нажатии покажу/скрою список' })], dark: false, result: '▾ Menyu' }
  ];
  const [task, setTask] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | planned | building | done
  const [demoDark, setDemoDark] = useState(false);
  const [demoLikes, setDemoLikes] = useState(0);
  const [demoMenu, setDemoMenu] = useState(false);
  const timer = useRef(null);
  const done = phase === 'done';
  useEffect(() => () => clearTimeout(timer.current), []);
  const resetDemo = () => { setDemoDark(false); setDemoLikes(0); setDemoMenu(false); };
  const choose = (id) => { clearTimeout(timer.current); setTask(id); setPhase('planned'); resetDemo(); };
  const approve = () => { clearTimeout(timer.current); setPhase('building'); timer.current = setTimeout(() => setPhase('done'), 1300); };
  const cur = TASKS.find(t => t.id === task);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Keyingi qadam · AI', ru: 'Следующий шаг · AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Agent bilan ishlab ko'ring", ru: 'Поработайте с агентом' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Shularni endi <span className="italic" style={{ color: T.accent }}>AI'ga aytib</span> qildirsak-chi?</>, ru: <>А что если теперь <span className="italic" style={{ color: T.accent }}>поручить это AI</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Buni <b style={{ color: T.ink }}>vibecoding</b> deyiladi: kodni o'zingiz yozish o'rniga, <b style={{ color: T.ink }}>oddiy so'z bilan</b> nima xohlayotganingizni aytasiz — AI agent (masalan, <b style={{ color: T.ink }}>Antigravity</b>) yozib beradi. Ammo <b style={{ color: T.accent }}>boshliq — siz</b>: agent avval rejasini ko'rsatadi, siz uni <b style={{ color: T.ink }}>tasdiqlaysiz</b>, oxirida natijani <b style={{ color: T.ink }}>tekshirasiz</b>. Bir buyruqni sinab ko'ring.</>, ru: <>Это называется <b style={{ color: T.ink }}>vibecoding</b>: вместо того чтобы писать код самому, вы <b style={{ color: T.ink }}>простыми словами</b> говорите, чего хотите, — AI-агент (например, <b style={{ color: T.ink }}>Antigravity</b>) напишет его за вас. Но <b style={{ color: T.accent }}>главный — вы</b>: сначала агент показывает план, вы его <b style={{ color: T.ink }}>подтверждаете</b>, а в конце <b style={{ color: T.ink }}>проверяете</b> результат. Попробуйте одну команду.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "1. Agentga so'z bilan ayting", ru: '1. Скажите агенту словами' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TASKS.map(t => <button key={t.id} className={`chip ${task === t.id ? 'chip-on' : ''}`} onClick={() => choose(t.id)} style={{ justifyContent: 'flex-start', textAlign: 'left' }}>"{t.label}"</button>)}
            </div>
            {!cur && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Yuqoridan bitta buyruqni tanlang', ru: 'Выберите одну команду выше' })}</p></div>}
            {cur && (
              <div className="ai-card fade-step" key={task}>
                <div className="ai-row"><span className="ai-badge" style={{ background: T.ink }}>Agent</span><span className="ai-bubble">{phase === 'planned' ? tr({ uz: 'Mana rejam — tasdiqlaysizmi?', ru: 'Вот мой план — подтверждаете?' }) : (phase === 'building' ? tr({ uz: 'Quryapman…', ru: 'Строю…' }) : tr({ uz: 'Bajardim', ru: 'Готово' }))}</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cur.plan.map((p, i) => <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}><span style={{ color: phase === 'planned' ? T.ink3 : T.success }}>{phase === 'planned' ? '○' : '✓'}</span><span style={{ color: T.ink }}>{p}</span></div>)}
                </div>
                {phase === 'planned' && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={approve}>{tr({ uz: 'Rejani tasdiqlash', ru: 'Подтвердить план' })}</button>}
                {phase === 'building' && <p className="ai-prompt" style={{ color: T.accent }}>{tr({ uz: 'Kod yozilyapti…', ru: 'Пишется код…' })}</p>}
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "2. Natija — bosib sinab ko'ring", ru: '2. Результат — нажмите и проверьте' })}</p>
            <Browser dark={done && task === 't1' && demoDark}>
              <SiteCard>
                <p style={{ fontSize: 13, margin: 0, opacity: 0.85 }}>{tr({ uz: 'Mening saytim', ru: 'Мой сайт' })}</p>
                {!done && <p className="small" style={{ margin: 0, opacity: 0.5 }}>{tr({ uz: "(agent hali hech narsa qo'shmadi)", ru: '(агент пока ничего не добавил)' })}</p>}
                {done && task === 't1' && (
                  <div className="fade-step" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <button className="site-btn" onClick={() => setDemoDark(d => !d)} style={{ background: demoDark ? '#FFD380' : T.ink, color: demoDark ? '#1A2436' : '#fff' }}>{demoDark ? tr({ uz: 'Kunduzgi rejim', ru: 'Дневной режим' }) : tr({ uz: 'Tungi rejim', ru: 'Ночной режим' })}</button>
                    <span className="mono small" style={{ color: T.success, fontWeight: 700 }}>{tr({ uz: '+ yangi', ru: '+ новое' })}</span>
                  </div>
                )}
                {done && task === 't2' && (
                  <div className="fade-step" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <button className="site-like" onClick={() => setDemoLikes(c => c + 1)}>Like · {demoLikes}</button>
                    <span className="mono small" style={{ color: T.success, fontWeight: 700 }}>{tr({ uz: '+ yangi', ru: '+ новое' })}</span>
                  </div>
                )}
                {done && task === 't3' && (
                  <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button className="site-btn" onClick={() => setDemoMenu(m => !m)}>{demoMenu ? tr({ uz: '▴ Menyu', ru: '▴ Меню' }) : tr({ uz: '▾ Menyu', ru: '▾ Меню' })}</button>
                      <span className="mono small" style={{ color: T.success, fontWeight: 700 }}>{tr({ uz: '+ yangi', ru: '+ новое' })}</span>
                    </div>
                    {demoMenu && <div className="fade-step" style={{ background: T.bg, borderRadius: 9, padding: '9px 12px', fontSize: 13, width: '100%', lineHeight: 1.7 }}>{tr({ uz: "Bosh sahifa · Loyihalar · Bog'lanish", ru: 'Главная · Проекты · Контакты' })}</div>}
                  </div>
                )}
              </SiteCard>
            </Browser>
            {done
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Agent qo'shgan tugmani <b>o'zingiz bosib sinang</b> — haqiqatan ishlayaptimi? Darsda har birini qo'lda qurganingiz uchun, agent to'g'ri qildimi yo'qmi — <b>tekshira olasiz</b>.</>, ru: <>Нажмите кнопку, которую добавил агент, <b>сами</b> — она правда работает? Вы построили каждый инструмент своими руками на уроке, поэтому <b>можете проверить</b>, правильно ли сделал агент.</> })}</p></div>
              : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr({ uz: "Buyruq bering va rejani tasdiqlang — ishlaydigan natija shu yerda paydo bo'ladi.", ru: 'Дайте команду и подтвердите план — работающий результат появится здесь.' })}</p>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — YAKUNIY (o'lik tugmani jonlantirish) =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [evt, setEvt] = useState(storedAnswer ? 'click' : null);
  const [react, setReact] = useState(storedAnswer ? 'color' : null);
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const [bg, setBg] = useState(false);
  const evtOk = evt === 'click';
  const reactOk = react === 'color';
  const ready = evtOk && reactOk;
  useEffect(() => { if (ready && !passed) { setPassed(true); onAnswer(screen, { stage: 'final', screenIdx: screen, question: tr({ uz: "Tugmani jonlantirish: hodisa + reaksiya", ru: 'Оживить кнопку: событие + реакция' }), studentAnswer: `${evt}+${react}`, correct: true, firstAttemptCorrect: true, solved: true, picked: `${evt}+${react}` }); } }, [ready]);
  const EVTS = [{ id: 'click', l: tr({ uz: 'Bosilganda (click)', ru: 'При нажатии (click)' }) }, { id: 'hover', l: 'Hover' }, { id: 'scroll', l: tr({ uz: 'Aylantirilganda', ru: 'При прокрутке' }) }];
  const REACTS = [{ id: 'color', l: tr({ uz: "Rangni o'zgartir", ru: 'Изменить цвет' }) }, { id: 'delete', l: tr({ uz: "Sahifani o'chir", ru: 'Удалить страницу' }) }, { id: 'nothing', l: tr({ uz: 'Hech narsa', ru: 'Ничего' }) }];
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Hodisa va reaksiyani tanlang', ru: 'Выберите событие и реакцию' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi sinov: tugmani <span className="italic" style={{ color: T.accent }}>o'zingiz</span> to'g'ri jonlantiring</>, ru: <>Последнее испытание: оживите кнопку <span className="italic" style={{ color: T.accent }}>сами</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Maqsad: <b style={{ color: T.ink }}>"Tugma bosilganda sahifa rangi o'zgarsin."</b> To'g'ri <b style={{ color: T.ink }}>HODISA</b> va to'g'ri <b style={{ color: T.ink }}>REAKSIYA</b>ni tanlang. Ikkalasi to'g'ri bo'lsa — tugma o'ngdagi saytda haqiqatan ishlay boshlaydi.</>, ru: <>Цель: <b style={{ color: T.ink }}>«При нажатии кнопки цвет страницы меняется.»</b> Выберите правильное <b style={{ color: T.ink }}>СОБЫТИЕ</b> и правильную <b style={{ color: T.ink }}>РЕАКЦИЮ</b>. Если оба верны — кнопка на сайте справа действительно заработает.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: '1. Qaysi HODISA?', ru: '1. Какое СОБЫТИЕ?' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {EVTS.map(e => <button key={e.id} className={`chip ${evt === e.id ? 'chip-on' : ''}`} onClick={() => { setEvt(e.id); setBg(false); }} style={evt === e.id && e.id === 'click' ? { background: T.success, boxShadow: '0 6px 16px -5px rgba(31,122,77,0.5)' } : undefined}>{e.l}</button>)}
            </div>
            {evt && <p className="small fade-step" style={{ margin: 0, fontWeight: 600, color: evtOk ? T.success : T.accent }}>{evtOk ? tr({ uz: "✓ To'g'ri — tugma 'bosish'ni sezadi", ru: '✓ Верно — кнопка чувствует «нажатие»' }) : tr({ uz: "✗ Bu hodisa tugma bosilishini sezmaydi. 'Bosilganda (click)' kerak.", ru: '✗ Это событие не замечает нажатие кнопки. Нужно «При нажатии (click)».' })}</p>}
            <p className="flow-label" style={{ marginTop: 4 }}>{tr({ uz: '2. Qaysi REAKSIYA?', ru: '2. Какая РЕАКЦИЯ?' })}</p>
            <div className="fade-up delay-2" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {REACTS.map(r => <button key={r.id} className={`chip ${react === r.id ? 'chip-on' : ''}`} onClick={() => { setReact(r.id); setBg(false); }} style={react === r.id && r.id === 'color' ? { background: T.success, boxShadow: '0 6px 16px -5px rgba(31,122,77,0.5)' } : undefined}>{r.l}</button>)}
            </div>
            {react && <p className="small fade-step" style={{ margin: 0, fontWeight: 600, color: reactOk ? T.success : T.accent }}>{reactOk ? tr({ uz: "✓ To'g'ri reaksiya — rang o'zgaradi", ru: '✓ Правильная реакция — цвет изменится' }) : (react === 'delete' ? tr({ uz: "✗ Bu sahifani o'chiradi — maqsadga mos emas", ru: '✗ Это удалит страницу — не соответствует цели' }) : tr({ uz: "✗ 'Hech narsa' bo'lsa sayt jonlanmaydi", ru: '✗ Если «ничего» — сайт не оживёт' }))}</p>}
            <div className="codebox" style={{ marginTop: 6 }}>
              <div><FN>tugma</FN>.<FN>{evt === 'click' ? 'onclick' : (evt || '???')}</FN> = () =&gt; {'{'}</div>
              <div style={{ paddingLeft: 18 }}>{reactOk ? <>sahifa.<FN>rang</FN> = <STR>"yangi"</STR></> : <CM>// reaksiyani tanlang</CM>}</div>
              <div>{'}'}</div>
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija — saytingiz', ru: 'результат — ваш сайт' })}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tagpill" style={{ background: evt ? (evtOk ? T.successSoft : T.accentSoft) : T.paper, color: evt ? (evtOk ? T.success : T.accent) : T.ink3 }}>{evt ? (evtOk ? '✓' : '✗') : '1'} {tr({ uz: 'HODISA', ru: 'СОБЫТИЕ' })}</span>
              <span className="tagpill" style={{ background: react ? (reactOk ? T.successSoft : T.accentSoft) : T.paper, color: react ? (reactOk ? T.success : T.accent) : T.ink3 }}>{react ? (reactOk ? '✓' : '✗') : '2'} {tr({ uz: 'REAKSIYA', ru: 'РЕАКЦИЯ' })}</span>
            </div>
            <Browser>
              <div style={{ borderRadius: 12, padding: 'clamp(22px,4vw,34px)', textAlign: 'center', transition: 'background .35s ease', background: bg ? T.accent : '#FFFFFF', border: `1.5px solid ${bg ? T.accent : '#E6E1D8'}` }}>
                <p className="small" style={{ margin: '0 0 14px', fontWeight: 700, letterSpacing: '0.03em', color: bg ? '#fff' : T.ink2 }}>{tr({ uz: 'Sahifa rangi:', ru: 'Цвет страницы:' })} {bg ? tr({ uz: "TO'Q SARIQ", ru: 'ОРАНЖЕВЫЙ' }) : tr({ uz: 'OQ', ru: 'БЕЛЫЙ' })}</p>
                <button className={`site-btn ${ready && !bg ? 'glow-btn' : ''}`} disabled={!ready} onClick={() => { if (ready) setBg(b => !b); }} style={{ opacity: ready ? 1 : 0.5, background: bg ? '#fff' : T.ink, color: bg ? T.accent : '#fff' }}>{ready ? tr({ uz: 'Tugmani bos', ru: 'Нажми кнопку' }) : tr({ uz: '🔒 qulflangan', ru: '🔒 заблокировано' })}</button>
              </div>
            </Browser>
            <p className="small" style={{ margin: 0, color: T.ink3 }}>{!ready ? tr({ uz: "Hodisa va reaksiyani to'g'ri tanlasangiz, tugma ishlay boshlaydi.", ru: 'Выберите верное событие и реакцию — кнопка заработает.' }) : (bg ? tr({ uz: "Bosdingiz — sahifa rangi o'zgardi! Yana bosing, qaytadi.", ru: 'Вы нажали — цвет страницы изменился! Нажмите ещё раз — вернётся.' }) : tr({ uz: "Tugmani bosing — sahifa rangi darhol o'zgaradi.", ru: 'Нажмите кнопку — цвет страницы сразу изменится.' }))}</p>
            {passed
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mukammal! <b>Bosish</b> hodisasi va <b>rangni o'zgartirish</b> reaksiyasi birga — tugma jonlandi. Siz uni o'zingiz jonlantirdingiz.</>, ru: <>Отлично! Событие <b>клик</b> и реакция <b>изменить цвет</b> вместе — кнопка ожила. Вы оживили её сами.</> })}</p></div>
              : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr({ uz: 'Maslahat: tugma uchun "bosish" hodisasi va maqsadga mos reaksiya kerak.', ru: 'Подсказка: для кнопки нужно событие «нажатие» и реакция, соответствующая цели.' })}</p>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 16 — YAKUN =====
const Screen16 = ({ screen, answers, achievements, onReset, onPrev, onFinish, onHomework }) => {
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
  const RECAP = [tr({ uz: "Statik sayt — jonsiz rasm; interaktiv sayt — javob beradi", ru: 'Статичный сайт — неживая картинка; интерактивный — отвечает' }), tr({ uz: "Asosiy qoida: HODISA → REAKSIYA → O'ZGARISH", ru: 'Главное правило: СОБЫТИЕ → РЕАКЦИЯ → ИЗМЕНЕНИЕ' }), tr({ uz: "Hodisalar: bosish (click), hover, yozish (input)", ru: 'События: клик (click), hover, ввод (input)' }), tr({ uz: "5 vosita: like, rejim, ko'rsat/yashir, jonli salom, forma", ru: '5 инструментов: лайк, режим, показать/скрыть, живое приветствие, форма' }), tr({ uz: "AI agent quradi — lekin siz tushunasiz va tekshirasiz", ru: 'AI-агент строит — но вы понимаете и проверяете' })];
  const HOMEWORK = [{ b: tr({ uz: "O'z sahifangiz", ru: 'Ваша страница' }), t: tr({ uz: "— HTML/CSS saytingizga 1 ta vosita qo'shing (masalan, like yoki tungi rejim)", ru: '— добавьте на свой HTML/CSS-сайт 1 инструмент (например, лайк или ночной режим)' }) }, { b: tr({ uz: 'Antigravity bilan', ru: 'С Antigravity' }), t: tr({ uz: "— agentga \"saytimga tungi rejim qo'sh\" deb topshiring, rejasini o'qing, keyin tasdiqlang", ru: '— поручите агенту «добавь на мой сайт ночной режим», прочитайте его план, затем подтвердите' }) }, { b: tr({ uz: "Tekshiruvchi bo'ling", ru: 'Будьте проверяющим' }), t: tr({ uz: "— agent qo'shgan vositani sinab ko'ring: ishlayaptimi? Xato bormi?", ru: '— испытайте инструмент, добавленный агентом: работает? Есть ошибки?' }) }];
  const GLOSSARY = [{ b: tr({ uz: 'Interaktivlik', ru: 'Интерактивность' }), t: tr({ uz: '— saytning foydalanuvchiga javob berishi', ru: '— способность сайта отвечать пользователю' }) }, { b: tr({ uz: 'Hodisa (event)', ru: 'Событие (event)' }), t: tr({ uz: '— foydalanuvchi harakati (bosish, yozish)', ru: '— действие пользователя (клик, ввод)' }) }, { b: tr({ uz: 'Reaksiya', ru: 'Реакция' }), t: tr({ uz: '— ishga tushadigan JavaScript funksiyasi', ru: '— функция JavaScript, которая запускается' }) }, { b: 'click', t: tr({ uz: '— bosish hodisasi', ru: '— событие клика' }) }, { b: 'input', t: tr({ uz: '— yozish hodisasi', ru: '— событие ввода' }) }, { b: 'hover', t: tr({ uz: '— ustiga olib borish hodisasi', ru: '— событие наведения' }) }, { b: 'Antigravity', t: tr({ uz: '— AI agent yordamida sayt quradigan muhit', ru: '— среда, где сайт строится с помощью AI-агента' }) }];
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
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: '1-praktika tugadi', ru: 'Практика 1 завершена' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Statik saytni <span className="italic" style={{ color: T.accent }}>jonli</span> saytga aylantirdingiz</>, ru: <>Вы превратили статичный сайт в <span className="italic" style={{ color: T.accent }}>живой</span></> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} disabled={studentWait} liveOn={studentLive} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: 'Saytingizni jonlantiring:', ru: 'Оживите свой сайт:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>))}</ul><p className="hw-note">{tr({ uz: 'Esda tuting: AI quradi, lekin boshliq — sizsiz. Tushunib, tekshirib boring.', ru: 'Помните: AI строит, но главный — вы. Понимайте и проверяйте.' })}</p></div>}
        {/* 🏠 UYGA VAZIFA — amaliy topshiriq kompilyatorda bajariladi. Mentor proyektorida
            KO'RSATILMAYDI: uy ishi shaxsiy (sahna ↔ daftar tamoyili). */}
        {!isMentorL && onHomework && (
          <div className="hw-big-wrap fade-up d4">
            <button className="hw-big" onClick={onHomework}>
              <span className="hw-big-shine" aria-hidden="true" />
              <span className="hw-big-t">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span>
              <span className="hw-big-s">{tr({ uz: 'Amaliy topshiriqni bajarish →', ru: 'Выполнить практическое задание →' })}</span>
            </button>
          </div>
        )}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: 'Nishonlaringiz', ru: 'Ваши значки' })} — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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
        <div ref={glossRef} className="gloss fade-up d4" style={{ scrollMarginBottom: 16 }}><div className="gloss-head" onClick={toggleGloss}><span className="lbl">{tr({ uz: "Kalit so'zlar (interaktivlik)", ru: 'Ключевые слова (интерактивность)' })}</span><span className="gloss-toggle">{open ? '−' : '+'}</span></div>{open && (<div className="gloss-body">{GLOSSARY.map((g, i) => (<span key={i}><b>{g.b}</b> {g.t}{i < GLOSSARY.length - 1 ? ' · ' : ''}</span>))}</div>)}</div>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT
// Podium yorliqlari (scored indeks -> qisqa nom)
const Q_LABELS = { 4: { uz: "1 — Hodisa (event)", ru: '1 — Событие (event)' }, 7: "2 — son + 1", 11: { uz: "3 — Qaysi hodisa", ru: '3 — Какое событие' }, 15: { uz: "4 — Tugmani jonlantirish", ru: '4 — Оживить кнопку' } };

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

// Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi). s15 = -1 (yakuniy amaliy).
const INLINE_KEYS = { s4: 1, s7: 2, s11: 3, s15: -1 };

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
    // FAQAT baholanadigan testlar (SCORED_IDX) hisoblanadi — praktikaning
    // «tugatdi» signali (PRACTICE_DONE_BASE) reytingga aralashmaydi.
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
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} /></>}>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{myIdx + 1}-{tr({ uz: "o'rin", ru: 'е место' })}</b> ({board[myIdx].okCount}/{totalQ} {tr({ uz: "to'g'ri", ru: 'верно' })})</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>🏆 {tr({ uz: "To'liq reyting", ru: 'Полный рейтинг' })}</div>
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
              <div className="card-lbl" style={{ color: T.blue }}>📊 {tr({ uz: "Savollar bo'yicha", ru: 'По вопросам' })}</div>
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
              {live.mode === 'mentor' && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.', ru: 'Вопросы с ⚠️ — темы, где класс затруднился. Рекомендуется объяснить их ещё раз.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
//  🔧 INTERAKTIV QATLAMLAR (Htmllesson1 etalonidan ko'chirilgan)
// ============================================================
//
//  LMSga tayyor kontrakt (o'zgarmaydi):
//    <HtmlCompiler task={...} starterCode="..." onContinue={fn} onBack={fn} />
//  Kelajakda CSS/JS darslarida ham shu komponent ishlatiladi — task.files
//  orqali qaysi fayllar ko'rinishini va shartlarni belgilaysiz.
// ============================================================

const HC_T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4D26', accent2: '#FF8A3D', accentSoft: '#FFEDE5',
  success: '#0FA968', successSoft: '#E4F7EE', warn: '#9A5400', shadowBase: '58, 53, 48', line: '#E9E6DF',
};
const HC_CODE = { bg: '#0E1525', text: '#E7EAF2', gutter: '#1C2740' };

// ============================================================
//  TEKSHIRUV YORDAMCHILARI (builders)
//  Har biri ctx (kontekst) qabul qiladigan funksiya qaytaradi.
//  Funksiya:  true  → shart bajarildi
//             "..."  → bajarilmadi, qaytgan matn = o'quvchiga maslahat
//
//  ctx ichida nimalar bor:
//    ctx.html / ctx.css / ctx.js  — xom (raw) manba matnlar
//    ctx.doc                       — o'quvchi HTML'idan qurilgan real DOM
//    ctx.$  / ctx.$$               — doc bo'yicha querySelector / All
//    ctx.cssRules                  — [{selector, props:{...}}] — parslangan CSS
// ============================================================
const norm = (s) => (s || '').trim();

// JS izohlarini olib tashlaymiz — izoh ichidagi matn `js` shartini ALDAB
// o'tmasligi uchun (masalan starterdagi "// console.log ..." izohi).
// Oddiy yondashuv (blok + satr izohi) — o'quv praktikalari uchun yetarli.
const stripJsComments = (src) =>
  (src || '')
    .replace(/\/\*[\s\S]*?\*\//g, ' ') // /* ... */
    .replace(/\/\/[^\n]*/g, ' ');      // // ...

const checks = {
  // Teg/selektor mavjudmi?
  has: (sel, hint) => (x) =>
    x.$(sel) ? true : (hint ?? `\`${sel}\` topilmadi`),

  // Mavjud VA ichida bo'sh bo'lmagan matn bormi?
  text: (sel, hint) => (x) => {
    const el = x.$(sel);
    if (!el) return hint ?? `\`${sel}\` topilmadi`;
    return norm(el.textContent) ? true : (hint ?? `\`${sel}\` bor, lekin ichi bo'sh — matn yozing`);
  },

  // Atribut bormi va bo'sh emasmi? (yoki equals bilan aniq qiymat)
  attr: (sel, attr, hint, equals) => (x) => {
    const el = x.$(sel);
    if (!el) return hint ?? `\`${sel}\` topilmadi`;
    const v = el.getAttribute(attr);
    if (v == null || !norm(v)) return hint ?? `\`${sel}\` da \`${attr}="..."\` to'ldiring`;
    if (equals != null && norm(v) !== norm(equals)) return hint ?? `\`${sel}\` da \`${attr}\` qiymati \`${equals}\` bo'lsin`;
    return true;
  },

  // Bir nechta atribut — hammasi bo'sh bo'lmasligi kerak
  attrs: (sel, attrList, hint) => (x) => {
    const el = x.$(sel);
    if (!el) return hint ?? `\`${sel}\` topilmadi`;
    const miss = attrList.filter((a) => !norm(el.getAttribute(a) || ''));
    return miss.length ? (hint ?? `\`${sel}\` da \`${miss.join('` va `')}\` to'ldiring`) : true;
  },

  // child element parent ichidami?
  nested: (parent, child, hint) => (x) =>
    x.$(`${parent} ${child}`) ? true : (hint ?? `\`${child}\` ni \`${parent}\` ichiga joylang`),

  // Kamida n ta bormi?
  count: (sel, n, hint) => (x) =>
    x.$$(sel).length >= n ? true : (hint ?? `Kamida ${n} ta \`${sel}\` kerak`),

  // CSS: selektorga shu xossa yozilganmi?
  cssProp: (selector, prop, hint) => (x) => {
    const hit = x.cssRules.some(
      (r) => r.selector.split(',').map(norm).includes(norm(selector)) && norm(r.props[prop])
    );
    return hit ? true : (hint ?? `\`${selector}\` uchun \`${prop}\` xossasini yozing`);
  },

  // CSS: selektorga shu xossa AYNAN shu qiymat bilan yozilganmi?
  cssValue: (selector, prop, val, hint) => (x) => {
    const hit = x.cssRules.some(
      (r) => r.selector.split(',').map(norm).includes(norm(selector)) && norm(r.props[prop]) === norm(val)
    );
    return hit ? true : (hint ?? `\`${selector}\` da \`${prop}: ${val}\` yozing`);
  },

  // JS: manbada namuna (regex) bormi? (izohlar hisobga olinmaydi)
  js: (re, hint) => (x) =>
    re.test(stripJsComments(x.js)) ? true : (hint ?? `Skriptda kerakli qism topilmadi`),

  // To'liq erkin tekshiruv: (ctx) => true | "maslahat"
  custom: (fn) => fn,

  // ── RUNTIME tekshiruvlar (kod iframe'da ishlatiladi) ──
  // Bular funksiya emas, "probe" obyekti qaytaradi — komponent ularni
  // iframe ichida ishlatib, natijani postMessage orqali oladi.

  // console.log chiqishida shu qiymat bormi?
  logs: (value, hint) => ({ __runtime: 'log_includes', value: String(value), hint }),

  // JS ifoda (masalan global o'zgaruvchi yoki typeof) shu qiymatga tengmi?
  evalEquals: (expr, expected, hint) => ({ __runtime: 'eval_equals', expr, expected: String(expected), hint }),

  // clickSel bosilgach, readSel matni expected'ni o'z ichiga oladimi?
  domAfterClick: (clickSel, readSel, expected, hint) =>
    ({ __runtime: 'click_text', clickSel, readSel, expected: String(expected), hint }),

  // ALMASHISH (toggle): clickSel ni ikki marta bosamiz.
  //   boshida readSel matni = textA, 1-bosishdan keyin = textB,
  //   2-bosishdan keyin yana = textA. Hammasi to'g'ri bo'lsa — haqiqiy toggle.
  toggle: (clickSel, readSel, textA, textB, hint) =>
    ({ __runtime: 'toggle', clickSel, readSel, textA: String(textA), textB: String(textB), hint }),
};
const C = checks;

// ============================================================
//  DEKLARATIV SHARTLAR — oddiy data → check (tarjimon)
//  Dars yaratuvchi `C.has('form')` kabi kod yozmasdan, faqat data
//  bilan shart bera oladi: { tag: 'form', attrs: ['action'] }.
//  Istalgan teg/atribut ishlaydi — backend kerak emas, hammasi darsda.
//  Qo'llab-quvvatlanadigan kalitlar:
//    HTML:  { tag, text }                       → teg bor + ichi bo'sh emas
//           { tag, attr, equals? }              → atribut bor (yoki aniq qiymat)
//           { tag, attrs: ['src','alt'] }       → bir nechta atribut
//           { tag, child: 'input' }             → child teg ichidami (nested)
//           { tag, count: 3 }                   → kamida n ta
//    CSS:   { css: { sel, prop, value? } }      → xossa (yoki aniq qiymat)
//    JS:    { js: /addEventListener/ }          → manbada namuna
//    Runtime: { logs: 5 }                       → console.log chiqishi
//             { eval: 'typeof f', equals: 'function' }
//             { click: '#btn', read: '#out', expect: 'Salom' }
//  Har bir kalitga ixtiyoriy `hint` (maslahat matni) qo'shsa bo'ladi.
// ============================================================
function specToCheck(s) {
  const hint = s.hint;
  if (s.css) {
    const { sel, prop, value } = s.css;
    return value != null ? checks.cssValue(sel, prop, value, hint) : checks.cssProp(sel, prop, hint);
  }
  if (s.js) return checks.js(s.js instanceof RegExp ? s.js : new RegExp(s.js), hint);
  if (s.logs !== undefined) return checks.logs(s.logs, hint);
  if (s.eval !== undefined) return checks.evalEquals(s.eval, s.equals, hint);
  if (s.toggle) return checks.toggle(s.toggle, s.read || s.toggle, s.a, s.b, hint);
  if (s.click) return checks.domAfterClick(s.click, s.read, s.expect, hint);
  const sel = s.tag || s.sel;
  if (sel) {
    if (s.child || s.nested) return checks.nested(sel, s.child || s.nested, hint);
    if (s.count != null) return checks.count(sel, s.count, hint);
    if (Array.isArray(s.attrs)) return checks.attrs(sel, s.attrs, hint);
    if (s.attr) return checks.attr(sel, s.attr, hint, s.equals);
    if (s.text) return checks.text(sel, hint);
    return checks.has(sel, hint);
  }
  // Tanib bo'lmadi — yiqilmaydi, shunchaki bajarilmagan bo'lib qoladi
  return () => (hint ?? 'shart aniqlanmadi');
}

// Deklarativ shartdan o'qiladigan label avtomatik yasaymiz (label berilmasa)
function buildLabel(s) {
  if (s.css) return `CSS: ${s.css.sel} { ${s.css.prop}${s.css.value != null ? `: ${s.css.value}` : ''} }`;
  if (s.logs !== undefined) return `konsolda «${s.logs}»`;
  if (s.toggle) return `${s.a} ⇄ ${s.b}`;
  if (s.click) return `bosilsa «${s.expect}»`;
  if (s.eval !== undefined) return `${s.eval} = ${s.equals}`;
  if (s.js) return 'JS namunasi';
  const sel = s.tag || s.sel;
  if (sel) {
    if (s.child || s.nested) return `<${sel}> ichida <${s.child || s.nested}>`;
    if (Array.isArray(s.attrs)) return `<${sel}> — ${s.attrs.join(', ')}`;
    if (s.attr) return `<${sel}> — ${s.attr}`;
    if (s.count != null) return `kamida ${s.count} ta <${sel}>`;
    if (s.text) return `<${sel}> (matn bilan)`;
    return `<${sel}>`;
  }
  return 'shart';
}

// Shartni to'liq { id, label, check } shakliga keltiramiz.
// Eski uslub (check: C.has(...) / runtime obyekt / re:/.../) — tegmaymiz,
// faqat yetishmasa id/label to'ldiramiz. Deklarativ data bo'lsa — tarjima qilamiz.
function normalizeReq(req, i = 0) {
  const ready = typeof req.check === 'function' || (req.check && req.check.__runtime) || req.re;
  if (ready) return { id: req.id ?? `r${i}`, label: req.label ?? '', ...req };
  const check = specToCheck(req);
  const id = req.id ?? `${req.tag || req.sel || 'r'}${i}`;
  return { ...req, id, label: req.label ?? buildLabel(req), check };
}

// ============================================================
//  STANDART SHART (komponent yakka ishga tushganda)
// ============================================================
const DEFAULT_FILES = [
  { name: 'index.html', lang: 'html', starter: `<!-- Bu yerga yozing -->
` },
];

const DEFAULT_TASK = {
  eyebrow: { uz: 'Praktika', ru: 'Практика' },
  title: { uz: "O'z sahifangizni quring", ru: 'Постройте свою страницу' },
  brief: { uz: "Quyidagi shartlarni bajaring. Har biri bajarilganda yashil ✓ yonadi. Hammasi yashil bo'lsa — “Davom etish” ochiladi.", ru: 'Выполните условия ниже. Когда условие выполнено, загорается зелёная ✓. Все зелёные — откроется «Продолжить».' },
  requirements: [
    { id: 'h1', label: { uz: '<h1> sarlavha (matn bilan)', ru: '<h1> заголовок (с текстом)' }, check: checks.text('h1', { uz: "`<h1>` ichiga sarlavha matnini yozing", ru: 'Впишите текст заголовка внутрь `<h1>`' }) },
    { id: 'p', label: { uz: '<p> — matn (paragraf)', ru: '<p> — текст (абзац)' }, check: checks.text('p', { uz: "`<p>` ichiga bir-ikki gap yozing", ru: 'Напишите пару предложений внутри `<p>`' }) },
    { id: 'img', label: { uz: '<img> — src va alt bilan', ru: '<img> — со src и alt' }, check: checks.attrs('img', ['src', 'alt'], { uz: "`<img>` da `src` va `alt` ikkalasini to'ldiring", ru: 'Заполните в `<img>` оба атрибута: `src` и `alt`' }) },
  ],
};

// ============================================================
//  CSS'ni xavfsiz parslash — vaqtinchalik <style> orqali,
//  qiymatlarni oddiy obyektga ko'chirib olamiz (DOM'dan ajratamiz).
// ============================================================
function parseCss(css) {
  if (!css || !css.trim() || typeof document === 'undefined') return [];
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
  let rules = [];
  try {
    rules = [...(el.sheet?.cssRules || [])]
      .filter((r) => r.style) // faqat style qoidalari (media/keyframes emas)
      .map((r) => {
        const props = {};
        for (let i = 0; i < r.style.length; i++) {
          const p = r.style[i];
          props[p] = r.style.getPropertyValue(p);
        }
        return { selector: r.selectorText || '', props };
      });
  } catch { /* parse xatosi — bo'sh qaytadi */ }
  el.remove();
  return rules;
}

// ============================================================
//  HTML LINTER — sintaksis tekshiruvi (DOMParser kechirimchi,
//  bu esa qattiqqo'l). Yopilmagan teg, yopish typo'si, yopilmagan
//  tirnoq/izoh, noto'g'ri ichma-ichlikni ushlaydi.
//  Qaytaradi: [{ line, msg }]
// ============================================================
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

// Yopish tegi IXTIYORIY bo'lgan elementlar (HTML brauzer o'zi yopadi).
// Bularni "yopilmagan" deb xato chiqarmaymiz — aks holda <li>, ketma-ket
// <p> kabi to'g'ri kod noto'g'ri qizil bo'lardi.
const OPTIONAL_CLOSE = new Set(['li', 'p', 'td', 'th', 'tr', 'dt', 'dd', 'option', 'thead', 'tbody', 'tfoot']);
const BLOCK_TAGS = new Set([
  'address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset',
  'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'header', 'hr', 'main', 'menu', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul',
]);
// Yangi ochuvchi teg (open) stack tepasidagi (top) ixtiyoriy tegni yopadimi?
function closesOnOpen(open, top) {
  if (top === 'li') return open === 'li';
  if (top === 'p') return open === 'p' || BLOCK_TAGS.has(open);
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
  const stack = []; // { name, line }
  const n = src.length;
  let i = 0, line = 1, col = 1;
  const here = () => ({ line, col });
  const step = () => { if (src[i] === '\n') { line++; col = 1; } else { col++; } i++; };
  const skipTo = (idx) => { while (i < idx && i < n) step(); };

  while (i < n) {
    if (src[i] !== '<') { step(); continue; }
    const next = src[i + 1];

    // Izoh
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      if (end === -1) { errors.push({ ...here(), msg: { uz: 'Izoh yopilmagan (`-->` yetishmayapti)', ru: 'Комментарий не закрыт (не хватает `-->`)' } }); break; }
      skipTo(end + 3); continue;
    }
    // <!doctype ...> yoki deklaratsiya
    if (next === '!') {
      const end = src.indexOf('>', i);
      if (end === -1) { errors.push({ ...here(), msg: { uz: '`<! ... >` yopilmagan', ru: '`<! ... >` не закрыт' } }); break; }
      skipTo(end + 1); continue;
    }
    // Yopuvchi teg </...>
    if (next === '/') {
      const start = here();
      let j = i + 2, name = '';
      while (j < n && /[a-zA-Z0-9-]/.test(src[j])) { name += src[j]; j++; }
      while (j < n && src[j] !== '>') j++;
      if (j >= n) { errors.push({ line: start.line, msg: { uz: `Yopuvchi teg \`</${name}>\` to'liq emas (\`>\` yetishmayapti)`, ru: `Закрывающий тег \`</${name}>\` неполный (не хватает \`>\`)` } }); break; }
      const lname = name.toLowerCase();
      // Ixtiyoriy yopiladigan teglarni jimgina yopamiz (masalan </ul> ochiq <li>'ni yopadi)
      while (
        stack.length &&
        OPTIONAL_CLOSE.has(stack[stack.length - 1].name) &&
        stack[stack.length - 1].name !== lname &&
        stack.some((s, idx) => s.name === lname && idx < stack.length - 1)
      ) {
        stack.pop();
      }
      if (stack.length === 0) {
        errors.push({ line: start.line, msg: { uz: `Ortiqcha yopuvchi teg \`</${name}>\` — mos ochuvchi yo'q`, ru: `Лишний закрывающий тег \`</${name}>\` — нет парного открывающего` } });
      } else {
        const top = stack[stack.length - 1];
        if (top.name === lname) {
          stack.pop();
        } else {
          const idx = stack.map((s) => s.name).lastIndexOf(lname);
          if (idx === -1) {
            errors.push({ line: start.line, msg: { uz: `\`</${name}>\` mos ochuvchi tegga ega emas (xato yoki typo)`, ru: `У \`</${name}>\` нет парного открывающего тега (ошибка или опечатка)` } });
          } else {
            errors.push({ line: top.line, msg: { uz: `\`<${top.name}>\` yopilmagan — \`</${top.name}>\` kutilgan, \`</${name}>\` keldi`, ru: `\`<${top.name}>\` не закрыт — ожидался \`</${top.name}>\`, а пришёл \`</${name}>\`` } });
            stack.length = idx;
          }
        }
      }
      skipTo(j + 1); continue;
    }
    // Ochuvchi teg <...>
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
      if (quote && j >= n) { errors.push({ line: start.line, msg: { uz: `\`<${name}>\` ichida tirnoq (${quote}) yopilmagan`, ru: `Внутри \`<${name}>\` не закрыта кавычка (${quote})` } }); break; }
      if (strayLt) {
        errors.push({ line: start.line, msg: { uz: `\`<${name}\` tegi \`>\` bilan yopilmagan`, ru: `Тег \`<${name}\` не закрыт символом \`>\`` } });
        skipTo(j); continue; // '<' dan qayta boshlaymiz
      }
      if (!closed && j >= n) { errors.push({ line: start.line, msg: { uz: `\`<${name}\` tegi \`>\` bilan yopilmagan`, ru: `Тег \`<${name}\` не закрыт символом \`>\`` } }); break; }
      const lname = name.toLowerCase();
      // Ochuvchi teg stack tepasidagi ixtiyoriy tegni yopsa — jimgina yopamiz
      while (stack.length && closesOnOpen(lname, stack[stack.length - 1].name)) stack.pop();
      if (!selfClose && !VOID_TAGS.has(lname)) stack.push({ name: lname, line: start.line });
      skipTo(j); continue;
    }
    // '<' dan keyin harf/`/`/`!` emas → matn deb qaraladi (brauzer ham shunday)
    step();
  }
  // Oxirida ochiq qolgan teglar (ixtiyoriy yopiladiganlardan tashqari)
  for (const t of stack) {
    if (OPTIONAL_CLOSE.has(t.name)) continue;
    errors.push({ line: t.line, msg: { uz: `\`<${t.name}>\` ochiq qoldi — \`</${t.name}>\` bilan yoping`, ru: `\`<${t.name}>\` остался открытым — закройте его \`</${t.name}>\`` } });
  }
  return errors;
}

// Bitta shartni ishga tushiramiz → { ok, hint }
function runOne(req, ctx) {
  try {
    // Runtime probe — bu yerda emas, iframe'da tekshiriladi (placeholder)
    if (req.check && req.check.__runtime) {
      return { ok: false, hint: { uz: 'ishga tushirilmoqda…', ru: 'запускается…' }, runtime: true };
    }
    if (typeof req.check === 'function') {
      const r = req.check(ctx);
      if (r === true) return { ok: true, hint: null };
      return { ok: false, hint: (typeof r === 'string' || (r && typeof r === 'object')) ? r : (req.hint || null) };
    }
    // Eski uslub: regex (orqaga moslik). Izohlarni olib tashlab tekshiramiz.
    if (req.re) {
      const ok = req.re.test((ctx.html || '').replace(/<!--[\s\S]*?-->/g, ''));
      return { ok, hint: ok ? null : (req.hint || null) };
    }
    return { ok: false, hint: null };
  } catch {
    return { ok: false, hint: { uz: 'tekshirishda xatolik', ru: 'ошибка при проверке' } };
  }
}

// ============================================================
//  RUNTIME HARNESS — iframe ichida ishlaydigan kod.
//  console.log'ni ushlaydi, probe'larni bajaradi, natijani
//  postMessage bilan ota-oynaga (parent) yuboradi. Xavfsiz:
//  sandbox buzilmaydi, faqat bool natijalar uzatiladi.
// ============================================================
const CONSOLE_CAPTURE = `<script>
window.__logs=[];
(function(){var _l=console.log;console.log=function(){
  for(var i=0;i<arguments.length;i++){var a=arguments[i];
    try{window.__logs.push(typeof a==='object'?JSON.stringify(a):String(a));}catch(e){window.__logs.push(String(a));}}
  try{_l.apply(console,arguments);}catch(e){}
};})();
<\/script>`;

// KO'RINADIGAN konsol uchun: console.log/info/warn/error va xatolarni
// ota-oynaga (parent) postMessage bilan uzatadi → UI'da chiqaramiz.
// nonce — eski va yangi natijalar aralashmasligi uchun.
const CONSOLE_FORWARD = (nonce) => `<script>
(function(){
  var N=${JSON.stringify(nonce)};
  function fmt(a){try{return typeof a==='object'?JSON.stringify(a):String(a);}catch(e){return String(a);}}
  function send(level,args){
    var parts=[];for(var i=0;i<args.length;i++)parts.push(fmt(args[i]));
    try{parent.postMessage({__hcConsole:true,nonce:N,level:level,text:parts.join(' ')},'*');}catch(e){}
  }
  ['log','info','warn','error'].forEach(function(m){
    var _o=console[m]?console[m].bind(console):function(){};
    console[m]=function(){send(m,arguments);try{_o.apply(null,arguments);}catch(e){}};
  });
  window.addEventListener('error',function(e){send('error',[e.message]);});
})();
<\/script>`;

const buildHarness = (probes, nonce) => `<script>
(function(){
  function runProbes(){
    var P=${JSON.stringify(probes)};
    var logs=window.__logs||[];
    var joined=logs.join(' ');
    var out={};
    for(var k=0;k<P.length;k++){
      var p=P[k],ok=false;
      try{
        if(p.type==='log_includes'){
          var v=String(p.value).trim();
          ok=joined.indexOf(v)!==-1||logs.some(function(l){return String(l).trim().indexOf(v)!==-1;});
        }else if(p.type==='eval_equals'){
          var r; try{r=eval(p.expr);}catch(e){r=undefined;}
          ok=String(r)===String(p.expected);
        }else if(p.type==='click_text'){
          var exp=String(p.expected);
          var t0=document.querySelector(p.readSel);
          var before=t0?t0.textContent:'';
          var b=document.querySelector(p.clickSel);
          if(b){try{b.click();}catch(e){}}
          var t1=document.querySelector(p.readSel);
          var after=t1?t1.textContent:'';
          // Matn bosishdan KEYIN paydo bo'lishi kerak (oldin bo'lmagan) — JS'siz o'tmaydi
          ok=after.indexOf(exp)!==-1 && before.indexOf(exp)===-1;
        }else if(p.type==='toggle'){
          var A=String(p.textA).toLowerCase().trim();
          var B=String(p.textB).toLowerCase().trim();
          var rd=function(){var e=document.querySelector(p.readSel);return (e?e.textContent:'').toLowerCase();};
          var b2=document.querySelector(p.clickSel);
          var s0=rd();
          var startOk=s0.indexOf(A)!==-1 && s0.indexOf(B)===-1; // boshida A
          if(b2){try{b2.click();}catch(e){}}
          var s1=rd();
          var firstOk=s1.indexOf(B)!==-1 && s1.indexOf(A)===-1; // 1-bosish -> B
          if(b2){try{b2.click();}catch(e){}}
          var s2=rd();
          var secondOk=s2.indexOf(A)!==-1 && s2.indexOf(B)===-1; // 2-bosish -> A
          ok=startOk && firstOk && secondOk;
        }
      }catch(e){ok=false;}
      out[p.id]=ok;
    }
    try{parent.postMessage({__hcReport:true,nonce:${JSON.stringify(nonce)},results:out},'*');}catch(e){}
  }
  // 'load' hodisasidan keyin ishga tushiramiz — o'quvchi handler'ni
  // window.onload / addEventListener('load') ichida ulagan bo'lsa ham ulgursin.
  function start(){ setTimeout(runProbes, 50); }
  if(document.readyState==='complete') start();
  else window.addEventListener('load', start);
})();
<\/script>`;

// Foydalanuvchi 3 faylini bitta jonli HTML hujjatga birlashtiramiz
const baseStyle = `
  *{box-sizing:border-box}
  body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;margin:0;padding:24px;color:#13141A;line-height:1.6;background:#fff}
  h1{font-family:Georgia,serif;margin:0 0 12px;letter-spacing:-.01em}
  img{max-width:100%;border-radius:12px;display:block;margin:10px 0}
  p{margin:0 0 12px}
  li:empty{display:none}`;

const wrapDoc = (html, css, js, opts = {}) => `<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<base target="_blank">
<style>${baseStyle}
${css || ''}</style>
${opts.capture ? CONSOLE_CAPTURE : ''}
${opts.consoleNonce != null ? CONSOLE_FORWARD(opts.consoleNonce) : ''}
</head>
<body>
${html || ''}
<script>${js || ''}<\/script>
${opts.harness || ''}
</body>
</html>`;

function HtmlCompiler({
  task = DEFAULT_TASK,
  starterCode,            // eski kontrakt: bitta HTML fayl uchun starter
  onContinue,
  onBack,
  storageKey,             // F-0801-01: berilsa — yozilgan kod shu kalitda saqlanadi
}) {
  // Shartlarni bir marta normalizatsiya: deklarativ data ham, eski C.has(...)
  // uslubi ham bir xil { id, label, check } shaklga keladi. Quyidagi butun
  // kod (runtimeProbes, results, merged, render) o'zgarmaydi.
  const reqs = useMemo(
    () => (task.requirements || []).map((r, i) => normalizeReq(r, i)),
    [task.requirements]
  );

  // Fayllar: task.files bo'lsa o'shani, bo'lmasa eski yakka HTML faylni ishlatamiz
  const files = useMemo(() => {
    if (task.files && task.files.length) return task.files;
    const single = { ...DEFAULT_FILES[0] };
    if (starterCode != null) single.starter = starterCode;
    return [single];
  }, [task.files, starterCode]);

  // F-0801-01 (102-qonun): saqlangan kod bo'lsa — o'shandan boshlanadi (faqat AYNAN shu
  // fayllar to'plami uchun; topshiriq o'zgargan bo'lsa saqlov e'tiborsiz qoldiriladi).
  const [codes, setCodes] = useState(() => {
    const fresh = Object.fromEntries(files.map((f) => [f.name, f.starter ?? '']));
    if (!storageKey) return fresh;
    const s = codesRead(storageKey);
    if (!s || !s.codes) return fresh;
    const names = Object.keys(fresh);
    if (names.length !== Object.keys(s.codes).length || !names.every((n) => n in s.codes)) return fresh;
    return { ...fresh, ...s.codes };
  });
  // Yozilgan kod jonli saqlanadi (400ms) — tab almashinuvida yo'qolmasin
  useEffect(() => {
    if (!storageKey) return;
    const id = setTimeout(() => codesWrite(storageKey, codes), 400);
    return () => clearTimeout(id);
  }, [codes, storageKey]);
  const [active, setActive] = useState(files[0].name);
  const taRef = useRef(null);

  // Til bo'yicha matnni olish (birlashtirilgan preview uchun)
  const byLang = (lang) => {
    const f = files.find((ff) => ff.lang === lang);
    return f ? (codes[f.name] ?? '') : '';
  };
  const html = byLang('html'), css = byLang('css'), js = byLang('js');

  // Runtime shartlar (iframe'da ishlatib tekshiriladi)
  const runtimeProbes = useMemo(
    () => reqs.filter((r) => r.check && r.check.__runtime)
      .map((r) => ({ id: r.id, type: r.check.__runtime, ...r.check })),
    [reqs]
  );
  const hasRuntime = runtimeProbes.length > 0;
  const nonceRef = useRef(0);
  const [runtimeResults, setRuntimeResults] = useState({});

  // ── KO'RINADIGAN KONSOL — JS fayli bo'lsa ko'rsatamiz (console.log natijasi) ──
  const showConsole = useMemo(() => files.some((f) => f.lang === 'js'), [files]);
  const consoleNonceRef = useRef(0);
  const [consoleLines, setConsoleLines] = useState([]);

  // Ko'rinadigan preview — HECH QACHON tekshiruv tomonidan o'zgartirilmaydi
  const [doc, setDoc] = useState(() => wrapDoc(html, css, js));
  // Tekshiruv hujjati — alohida YASHIRIN iframe'da ishlaydi (tugmani bosadi,
  // DOMni o'zgartiradi — lekin foydalanuvchi buni ko'rmaydi)
  const [checkDoc, setCheckDoc] = useState('');
  // Jonli natijani debounce bilan yangilaymiz (har bosishda emas)
  useEffect(() => {
    const id = setTimeout(() => {
      const cn = showConsole ? ++consoleNonceRef.current : null;
      if (showConsole) setConsoleLines([]); // yangi ishga tushishda konsol tozalanadi
      setDoc(wrapDoc(html, css, js, cn != null ? { consoleNonce: cn } : {}));
      if (hasRuntime) {
        const nonce = ++nonceRef.current;
        setRuntimeResults({}); // kutish holatiga qaytaramiz
        setCheckDoc(wrapDoc(html, css, js, { capture: true, harness: buildHarness(runtimeProbes, nonce) }));
      }
    }, 300);
    return () => clearTimeout(id);
  }, [html, css, js, hasRuntime, runtimeProbes, showConsole]);

  // iframe'dan kelgan runtime natijalarni qabul qilamiz (faqat oxirgi nonce)
  useEffect(() => {
    if (!hasRuntime) return;
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.__hcReport && d.nonce === nonceRef.current) {
        setRuntimeResults(d.results || {});
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [hasRuntime]);

  // Preview iframe'dan kelgan console.log xabarlarini yig'amiz (faqat oxirgi nonce)
  useEffect(() => {
    if (!showConsole) return;
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.__hcConsole && d.nonce === consoleNonceRef.current) {
        setConsoleLines((prev) => (prev.length >= 200 ? prev : [...prev, { level: d.level, text: d.text }]));
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [showConsole]);

  // ── TEKSHIRUV: real tahlil, sinxron, xavfsiz (iframe'ga tegmaydi) ──
  const results = useMemo(() => {
    const parsed = new DOMParser().parseFromString(html || '', 'text/html');
    const ctx = {
      html, css, js,
      doc: parsed,
      $: (s) => { try { return parsed.querySelector(s); } catch { return null; } },
      $$: (s) => { try { return [...parsed.querySelectorAll(s)]; } catch { return []; } },
      cssRules: parseCss(css),
    };
    return reqs.map((r) => runOne(r, ctx));
  }, [html, css, js, reqs]);

  // ── SINTAKSIS: HTML linter (DOMParser ushlamaydigan xatolarni tutadi) ──
  const htmlErrors = useMemo(() => lintHtml(html), [html]);
  const hasSyntaxError = htmlErrors.length > 0;

  // Sinxron + runtime natijalarni birlashtiramiz
  const merged = reqs.map((r, i) => {
    if (r.check && r.check.__runtime) {
      const got = runtimeResults[r.id];
      if (got === undefined) return { ok: false, hint: { uz: 'ishga tushirilmoqda…', ru: 'запускается…' } };
      return { ok: !!got, hint: got ? null : (r.check.hint || { uz: 'natija kutilgancha emas', ru: 'результат не такой, как ожидалось' }) };
    }
    return results[i];
  });

  const passedCount = merged.filter((r) => r.ok).length;
  const allPassed = reqs.length > 0 && passedCount === reqs.length && !hasSyntaxError;
  const firstHint = merged.find((r) => !r.ok && r.hint)?.hint;

  const setActiveCode = (val) => setCodes((prev) => ({ ...prev, [active]: val }));

  // Tab tugmasi 2 bo'sh joy qo'shsin
  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target;
      const s = el.selectionStart, en = el.selectionEnd;
      const cur = codes[active] ?? '';
      const next = cur.slice(0, s) + '  ' + cur.slice(en);
      setActiveCode(next);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    }
  };

  const runNow = () => {
    const cn = showConsole ? ++consoleNonceRef.current : null;
    if (showConsole) setConsoleLines([]);
    setDoc(wrapDoc(html, css, js, cn != null ? { consoleNonce: cn } : {}));
  };
  const reset = () => setCodes(Object.fromEntries(files.map((f) => [f.name, f.starter ?? ''])));

  return (
    <div className="hc-root">
      <StyleTag />

      {/* ── Tepa: shart (markazda) ── */}
      <header className="hc-top">
        {task.eyebrow && <span className="hc-eyebrow">{tr(task.eyebrow)}</span>}
        <h1 className="hc-title">{tr(task.title)}</h1>
        {task.brief && <p className="hc-brief">{tr(task.brief)}</p>}
        <div className="hc-checklist">
          <span className="hc-count">{passedCount}/{reqs.length}</span>
          {reqs.map((r, i) => (
            <span key={r.id} className={`hc-chip ${merged[i]?.ok ? 'ok' : ''}`} title={tr(merged[i]?.hint) || ''}>
              <span className="hc-dot">{merged[i]?.ok ? '✓' : i + 1}</span>
              {tr(r.label)}
            </span>
          ))}
        </div>
        {hasSyntaxError ? (
          <div className="hc-errors">
            {htmlErrors.slice(0, 3).map((e, k) => (
              <span key={k} className="hc-err">⚠ {tr({ uz: 'Sintaksis · qator', ru: 'Синтаксис · строка' })} {e.line}: {tr(e.msg)}</span>
            ))}
            {htmlErrors.length > 3 && <span className="hc-err">… {tr({ uz: 'va yana', ru: 'и ещё' })} {htmlErrors.length - 3} {tr({ uz: 'ta xato', ru: 'ошибок' })}</span>}
          </div>
        ) : (!allPassed && firstHint && (
          <p className="hc-hint">💡 {tr(firstHint)}</p>
        ))}
      </header>

      {/* ── O'rta: editor | natija ── */}
      <main className="hc-split">
        <section className="hc-pane hc-editor-pane">
          <div className="hc-pane-bar hc-tabs-bar">
            <span className="hc-dots"><i /><i /><i /></span>
            <div className="hc-tabs">
              {files.map((f) => (
                <button
                  key={f.name}
                  className={`hc-tab ${active === f.name ? 'active' : ''}`}
                  onClick={() => setActive(f.name)}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <button className="hc-mini" onClick={runNow} title={tr({ uz: 'Ishga tushirish', ru: 'Запустить' })}>▶ {tr({ uz: 'Ishga tushirish', ru: 'Запустить' })}</button>
          </div>
          <textarea
            ref={taRef}
            className="hc-code"
            value={codes[active] ?? ''}
            onChange={(e) => setActiveCode(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder={tr({ uz: 'Kodingizni shu yerga yozing…', ru: 'Пишите свой код здесь…' })}
          />
        </section>

        <section className="hc-pane hc-preview-pane">
          <div className="hc-pane-bar">
            <span className="hc-pane-name">📺 {tr({ uz: 'Natija', ru: 'Результат' })}</span>
            <span className="hc-live">{tr({ uz: 'jonli', ru: 'live' })}</span>
          </div>
          <iframe
            className="hc-frame"
            title="natija"
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
            srcDoc={doc}
          />
          {showConsole && (
            <div className="hc-console">
              <div className="hc-console-bar">
                <span className="hc-console-title">🖥️ Console</span>
                {consoleLines.length > 0 && (
                  <button className="hc-console-clear" onClick={() => setConsoleLines([])}>{tr({ uz: 'tozalash', ru: 'очистить' })}</button>
                )}
              </div>
              <div className="hc-console-body">
                {consoleLines.length === 0 ? (
                  <div className="hc-console-empty">{tr({ uz: 'console.log(...) natijasi shu yerda chiqadi', ru: 'результат console.log(...) появится здесь' })}</div>
                ) : (
                  consoleLines.map((l, i) => (
                    <div key={i} className={`hc-console-line lvl-${l.level}`}>
                      <span className="hc-console-caret">›</span>
                      <span className="hc-console-text">{l.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Yashirin tekshiruv iframe'i — probe'lar shu yerda ishlaydi (tugmani
          bosadi, DOMni o'zgartiradi), foydalanuvchi ko'radigan preview esa toza qoladi */}
      {hasRuntime && (
        <iframe
          aria-hidden="true"
          tabIndex={-1}
          title="tekshiruv"
          sandbox="allow-scripts"
          srcDoc={checkDoc}
          style={{ position: 'fixed', left: '-9999px', top: 0, width: 1, height: 1, opacity: 0, pointerEvents: 'none', border: 'none' }}
        />
      )}

      {/* ── Past: harakatlar ── */}
      <footer className="hc-bottom">
        {onBack && <button className="hc-ghost" onClick={onBack}>← {tr({ uz: 'Orqaga', ru: 'Назад' })}</button>}
        <button className="hc-ghost" onClick={reset}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button>
        <div className="hc-status">
          {allPassed
            ? <span className="hc-ok-msg">✓ {tr({ uz: 'Barcha shartlar bajarildi!', ru: 'Все условия выполнены!' })}</span>
            : <span className="hc-wait-msg">{tr({ uz: "Shartlarni bajaring — natija o'ngda ko'rinadi", ru: 'Выполняйте условия — результат виден справа' })}</span>}
        </div>
        <button
          className="hc-next"
          disabled={!allPassed}
          onClick={() => allPassed && onContinue && onContinue({ codes, code: html })}
        >
          {tr({ uz: 'Davom etish', ru: 'Продолжить' })} →
        </button>
      </footer>
    </div>
  );
}

function StyleTag() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
      .hc-root,.hc-root *{box-sizing:border-box}
      .hc-root{font-family:'Manrope',system-ui,sans-serif;color:${HC_T.ink};background:
        radial-gradient(120% 80% at 50% -10%, ${HC_T.accentSoft} 0%, rgba(255,237,229,0) 46%),
        ${HC_T.bg};
        height:100dvh;display:flex;flex-direction:column;justify-content:center;gap:clamp(12px,1.8vw,18px);padding:clamp(16px,2.4vw,30px);overflow:hidden;-webkit-font-smoothing:antialiased;width:100%;max-width:1160px;margin:0 auto}

      .hc-top{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px}
      .hc-eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:800;color:${HC_T.accent};display:inline-flex;align-items:center;gap:7px}
      .hc-eyebrow::before{content:"";width:6px;height:6px;border-radius:50%;background:${HC_T.accent}}
      .hc-title{font-family:Georgia,serif;font-size:clamp(22px,3vw,32px);margin:0;color:${HC_T.ink};font-weight:600;letter-spacing:-.015em;line-height:1.12}
      .hc-brief{margin:0;color:${HC_T.ink2};font-size:clamp(13px,1.5vw,15px);line-height:1.55;max-width:60ch}

      .hc-checklist{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:6px}
      .hc-count{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:12px;color:#fff;background:linear-gradient(135deg,${HC_T.accent},${HC_T.accent2});padding:6px 11px;border-radius:99px;box-shadow:0 6px 16px -6px rgba(255,77,38,.5)}
      .hc-chip{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:500;color:${HC_T.ink2};background:${HC_T.paper};padding:6px 14px 6px 7px;border-radius:99px;border:1px solid ${HC_T.line};box-shadow:0 1px 2px rgba(${HC_T.shadowBase},.04);transition:all .22s ease;cursor:default}
      .hc-chip.ok{color:${HC_T.ink};font-weight:600;border-color:${HC_T.success}40;background:${HC_T.successSoft}}
      .hc-dot{flex-shrink:0;width:21px;height:21px;border-radius:50%;background:${HC_T.bg};color:${HC_T.ink3};display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;transition:all .25s}
      .hc-chip.ok .hc-dot{background:${HC_T.success};color:#fff;box-shadow:0 3px 8px -2px ${HC_T.success}88}
      .hc-hint{margin:3px 0 0;font-size:13px;color:${HC_T.warn};background:#FFF6EA;border:1px solid #F4DFBC;padding:8px 15px;border-radius:11px;max-width:60ch;line-height:1.5}
      .hc-errors{display:flex;flex-direction:column;gap:5px;align-items:center;margin:3px 0 0}
      .hc-err{font-size:12.5px;color:#C01024;background:#FDECEC;border:1px solid #F6CFCF;padding:7px 14px;border-radius:10px;font-family:'JetBrains Mono',monospace;max-width:74ch;line-height:1.5}

      .hc-split{flex:none;height:62vh;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:clamp(12px,1.6vw,18px)}
      .hc-pane{display:flex;flex-direction:column;min-height:0;border-radius:18px;overflow:hidden;background:${HC_T.paper};box-shadow:0 1px 0 ${HC_T.line},0 18px 40px -22px rgba(${HC_T.shadowBase},.35)}
      .hc-pane-bar{display:flex;align-items:center;gap:10px;padding:10px 15px;font-size:12px;font-weight:600;color:${HC_T.ink2}}
      .hc-editor-pane .hc-pane-bar{background:${HC_CODE.bg};color:#A7B6D6;border-bottom:1px solid rgba(255,255,255,.06)}
      .hc-preview-pane .hc-pane-bar{background:${HC_T.paper};border-bottom:1px solid ${HC_T.line}}
      .hc-dots{display:inline-flex;gap:6px;flex-shrink:0}
      .hc-dots i{width:11px;height:11px;border-radius:50%;background:#3A4760;display:block}
      .hc-dots i:nth-child(1){background:#ff5f56}.hc-dots i:nth-child(2){background:#ffbd2e}.hc-dots i:nth-child(3){background:#27c93f}
      .hc-pane-name{font-family:'JetBrains Mono',monospace;font-weight:700}
      .hc-live{margin-left:auto;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:${HC_T.success};background:${HC_T.successSoft};padding:4px 9px;border-radius:99px;font-weight:800;display:inline-flex;align-items:center;gap:6px}
      .hc-live::before{content:"";width:6px;height:6px;border-radius:50%;background:${HC_T.success};animation:hc-pulse 1.8s infinite}
      @keyframes hc-pulse{0%{box-shadow:0 0 0 0 ${HC_T.success}66}70%{box-shadow:0 0 0 6px ${HC_T.success}00}100%{box-shadow:0 0 0 0 ${HC_T.success}00}}

      .hc-tabs{display:flex;gap:4px;overflow:hidden}
      .hc-tab{background:transparent;border:none;color:#7E92B4;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;padding:6px 13px;border-radius:9px;cursor:pointer;transition:all .15s;white-space:nowrap}
      .hc-tab:hover{color:#cfe0ff;background:rgba(255,255,255,.06)}
      .hc-tab.active{color:#fff;background:rgba(255,255,255,.14);box-shadow:inset 0 -2px 0 ${HC_T.accent}}
      .hc-mini{margin-left:auto;background:linear-gradient(135deg,${HC_T.accent},${HC_T.accent2});color:#fff;border:none;border-radius:9px;padding:6px 13px;font-size:11.5px;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;transition:all .18s;flex-shrink:0;box-shadow:0 6px 14px -6px rgba(255,77,38,.6)}
      .hc-mini:hover{transform:translateY(-1px);box-shadow:0 9px 18px -6px rgba(255,77,38,.7)}
      .hc-mini:active{transform:translateY(0)}

      .hc-code{flex:1;min-height:0;resize:none;border:none;outline:none;background:${HC_CODE.bg};color:${HC_CODE.text};font-family:'JetBrains Mono',monospace;font-size:14px;line-height:1.7;padding:18px 20px;tab-size:2;white-space:pre;overflow:auto;caret-color:${HC_T.accent2}}
      .hc-code::placeholder{color:#5B6B86}
      .hc-code::selection{background:${HC_T.accent}55}

      .hc-frame{flex:1;min-height:0;width:100%;border:none;background:#fff}

      .hc-console{flex-shrink:0;height:34%;min-height:96px;display:flex;flex-direction:column;background:${HC_CODE.bg};border-top:1px solid rgba(255,255,255,.07)}
      .hc-console-bar{display:flex;align-items:center;gap:8px;padding:7px 14px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#7E92B4;border-bottom:1px solid rgba(255,255,255,.06)}
      .hc-console-title{font-family:'JetBrains Mono',monospace}
      .hc-console-clear{margin-left:auto;background:rgba(255,255,255,.08);color:#cfe0ff;border:none;border-radius:7px;padding:4px 10px;font-size:10.5px;font-weight:600;cursor:pointer;text-transform:none;letter-spacing:0;font-family:'Manrope',sans-serif;transition:all .15s}
      .hc-console-clear:hover{background:${HC_T.accent};color:#fff}
      .hc-console-body{flex:1;min-height:0;overflow:auto;padding:6px 0;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.6}
      .hc-console-empty{color:#5B6B86;padding:4px 15px;font-style:italic}
      .hc-console-line{display:flex;gap:8px;padding:2px 15px;color:#E7EAF2;border-bottom:1px solid rgba(255,255,255,.03);white-space:pre-wrap;word-break:break-word}
      .hc-console-caret{color:#27c93f;flex-shrink:0;font-weight:700}
      .hc-console-line.lvl-warn{color:#FFD380;background:rgba(255,189,46,.08)}
      .hc-console-line.lvl-error{color:#ff8a7a;background:rgba(255,95,86,.1)}
      .hc-console-line.lvl-error .hc-console-caret{color:#ff5f56}

      .hc-bottom{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
      .hc-ghost{background:transparent;border:1px solid transparent;color:${HC_T.ink2};font-family:'Manrope',sans-serif;font-weight:600;font-size:14px;cursor:pointer;padding:11px 17px;border-radius:12px;transition:all .15s}
      .hc-ghost:hover{background:${HC_T.paper};color:${HC_T.ink};border-color:${HC_T.line};box-shadow:0 6px 16px -10px rgba(${HC_T.shadowBase},.3)}
      .hc-status{margin-left:auto}
      .hc-ok-msg{color:${HC_T.success};font-weight:700;font-size:14px}
      .hc-wait-msg{color:${HC_T.ink3};font-size:13px}
      .hc-next{background:linear-gradient(135deg,${HC_T.accent},${HC_T.accent2});color:#fff;border:none;border-radius:13px;font-family:'Manrope',sans-serif;font-weight:800;font-size:15px;cursor:pointer;padding:13px 30px;box-shadow:0 10px 24px -8px rgba(255,77,38,.6);transition:all .2s}
      .hc-next:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 16px 32px -8px rgba(255,77,38,.7)}
      .hc-next:active:not(:disabled){transform:translateY(0)}
      .hc-next:disabled{background:#D7D8DE;color:#fff;cursor:not-allowed;box-shadow:none}

      @media (max-width:820px){
        .hc-split{grid-template-columns:1fr;grid-template-rows:1fr 1fr}
        .hc-checklist{width:100%}
      }
    `}</style>
  );
}

// Dars shartlarida ishlatiladigan qisqa alias (ilgari `checks as C`)

// ============================================================
//  🏅 NISHONLAR (achievements) — Htmllesson1 etalon naqshi
// ============================================================
const ACHIEVEMENTS = {
  spark:    { icon: '⚡', name: "It's Alive!", desc: { uz: "Hodisa → reaksiya mantig'ini to'g'ri angladingiz", ru: 'Вы верно поняли логику событие → реакция' } },
  coder:    { icon: '💻', name: 'Code It!',    desc: { uz: "JavaScript yozib, vositani ishga tushirdingiz", ru: "Вы написали JavaScript и запустили инструмент" } },
  logician: { icon: '🧩', name: 'Nice Logic!', desc: { uz: "Shart (if/else) savolini to'g'ri yechdingiz", ru: 'Вы верно решили вопрос про условие (if/else)' } },
  graduate: { icon: '🏆', name: 'Level Up!',   desc: { uz: 'Praktikani yakunladingiz', ru: 'Вы завершили практику' } },
};
// Ekran id → nishon (recordAnswer'da FAQAT scored test ekranda, data.correct bo'lsa beriladi)
const ACH_TRIGGERS = { s4: 'spark', s11: 'logician' };

// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI — yorqin nurlar, medal portlashi, uchqunlar
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
// Navbatda bittasi ko'rsatiladi (to'liq-ekran bayram) — tugagach keyingisi chiqadi
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}

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

// ===== 🃏 FLASHCARDS — atamalarni tez takrorlash (glossary → kartalar) =====
const HTML_FLASHCARDS = [
  { front: { uz: "Saytni jonlantiradigan til qaysi?", ru: 'Какой язык оживляет сайт?' }, back: 'JavaScript', note: { uz: "HTML — tuzilish, CSS — ko'rinish, JavaScript — harakat", ru: 'HTML — структура, CSS — внешний вид, JavaScript — действие' } },
  { front: { uz: "Foydalanuvchining bosishi yoki yozishi bir so'z bilan nima deyiladi?", ru: 'Как одним словом называют клик или ввод пользователя?' }, back: { uz: 'hodisa (event)', ru: 'событие (event)' }, note: { uz: 'sayt bu harakatni sezadi', ru: 'сайт замечает это действие' } },
  { front: { uz: "Tugma bosilganda qaysi hodisa yuz beradi?", ru: 'Какое событие происходит при нажатии кнопки?' }, back: 'click', note: { uz: "«Meni bos» tugmasi shu hodisani kutadi", ru: 'Кнопка «Нажми меня» ждёт именно его' } },
  { front: { uz: "Matn maydoniga yozganda qaysi hodisa yuz beradi?", ru: 'Какое событие происходит при вводе в текстовое поле?' }, back: 'input', note: { uz: 'har harfda jonli salom yangilanadi', ru: 'с каждой буквой живое приветствие обновляется' } },
  { front: { uz: "Sichqoncha element ustiga kelganda qaysi hodisa yuz beradi?", ru: 'Какое событие происходит, когда мышка оказывается над элементом?' }, back: 'hover', note: { uz: 'telefonda — barmoqni bosib turish', ru: 'на телефоне — держать палец' } },
  { front: { uz: "Sayt jonlanishining uch qadami qanday tartibda boradi?", ru: 'В каком порядке идут три шага оживления сайта?' }, back: { uz: "Hodisa → Reaksiya → O'zgarish", ru: 'Событие → Реакция → Изменение' }, note: { uz: "bosdingiz → JavaScript ishladi → ekran o'zgardi", ru: 'нажали → JavaScript сработал → экран изменился' } },
  { front: { uz: "Sayt like sonini nimada eslab qoladi?", ru: 'Где сайт запоминает число лайков?' }, back: { uz: "o'zgaruvchida", ru: 'в переменной' }, note: { uz: "son — ichiga qiymat solinadigan quti", ru: 'son — коробка, в которую кладут значение' } },
  { front: { uz: "son = 0 edi, tugma 3 marta bosildi (son = son + 1). Ekranda nechta chiqadi?", ru: 'son = 0, кнопку нажали 3 раза (son = son + 1). Что будет на экране?' }, back: '3', note: { uz: '0 → 1 → 2 → 3', ru: '0 → 1 → 2 → 3' } },
  { front: { uz: "Forma bo'sh yoki to'ldirilganini qaysi shart tekshiradi?", ru: 'Какое условие проверяет, пустая форма или заполненная?' }, back: 'if / else', note: { uz: "bo'sh bo'lsa «Ism kiriting», aks holda «Rahmat»", ru: 'пусто — «Ism kiriting», иначе — «Rahmat»' } },
  { front: { uz: "Kodni yozmasdan, so'z bilan aytib AI'ga qurdirish nima deyiladi?", ru: 'Как называется, когда код не пишут, а словами поручают его AI?' }, back: 'Vibecoding', note: { uz: 'agent quradi, natijani siz tekshirasiz', ru: 'агент строит, результат проверяете вы' } },
];

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
  const [exiting, setExiting] = useState(null); // 'knew' | 'again' — karta uchib chiqish animatsiyasi (Quizlet uslubi)
  const swapRef = useRef(0);                    // har almashishda karta remount bo'lib, kirish animatsiyasi o'ynaydi
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'karta yodlandi', ru: 'терминов выучено' })}</p><button className="fc-btn ghost" onClick={restart}>↻ {tr({ uz: 'Qaytadan takrorlash', ru: 'Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Учится' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
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
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>✗ {tr({ uz: 'Takrorlash', ru: 'Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })}</button></div>)
        : (<p className="fc-hint">{tr({ uz: "👆 Kartani bosing — javobni ko'rasiz", ru: '👆 Нажмите на карточку — увидите ответ' })}</p>)}
    </div>
  );
}

// ===== ScreenFlashcards — atamalarni tez takrorlash (podiumdan keyin, yakundan oldin) =====
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 'sflash', text: `O'zingizni sinab ko'ring. Har kartada bir savol — javobini o'ylang, keyin kartani bosing.`, trigger: 'on_mount', waits_for: null }]);
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={HTML_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

function MentorPracticeOverlay({ entry, live, onClose }) {
  const [view, setView] = useState('watch'); // 'watch' | 'demo'
  const [data, setData] = useState({ players: null, rows: [] });
  const doneIdx = PRACTICE_DONE_BASE + entry.fromScreen;
  useEffect(() => {
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, doneIdx)]);
        if (on) setData({ players, rows });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live.pin, doneIdx]);

  if (view === 'demo') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg }}>
        <HtmlCompiler task={entry.task} starterCode={entry.starter} onContinue={() => setView('watch')} onBack={() => setView('watch')} />
      </div>
    );
  }

  const total = data.players ? data.players.length : 0;
  const doneN = data.rows.length;
  const allIn = total > 0 && doneN >= total;
  const doneIds = new Set(data.rows.map(r => r.player_id));
  return (
    <div className="mp-overlay">
      <div className="mp-card">
        <div className="mp-eyebrow">✍️ {tr({ uz: 'Amaliyot · jonli', ru: 'Практика · живой урок' })}</div>
        <h2 className="mp-title">{tr(entry.task.title)}</h2>
        <p className="mp-brief">{tr(entry.task.brief)}</p>
        <div className="mp-flow">
          <span className="mp-step cur">1 · {tr({ uz: "O'quvchilar o'z qurilmasida yozmoqda", ru: 'Ученики пишут на своих устройствах' })}</span>
          <span className="mp-arr">→</span>
          <span className="mp-step">2 · {tr({ uz: "Mentor doskada yozib ko'rsatadi", ru: 'Ментор пишет и показывает на доске' })}</span>
        </div>
        {data.players === null ? (
          <p className="mstats-wait">{tr({ uz: 'Ulanish…', ru: 'Подключение…' })}</p>
        ) : (
          <div className="mstats" style={{ marginTop: 2 }}>
            <div className="mstats-head">
              <span className="mstats-lbl">👨‍🎓 {tr({ uz: 'Praktikani tugatdi', ru: 'Завершили практику' })}</span>
              <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma tugatdi!', ru: '✓ Все закончили!' }) : <>{tr({ uz: 'Tugatdi:', ru: 'Закончили:' })} <b>{doneN}</b> / {total}</>}</span>
            </div>
            <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((doneN / total) * 100) : 0}%` }} /></div>
            {total > 0 && (
              <div className="mstats-waitrow" style={{ marginTop: 10 }}>
                {data.players.map(p => <span key={p.id} className="mstats-wait-chip" style={doneIds.has(p.id) ? { background: T.successSoft, color: T.success, fontWeight: 700 } : undefined}>{doneIds.has(p.id) ? '✓ ' : '✏️ '}{p.nickname}</span>)}
              </div>
            )}
            {total === 0 && <p className="mstats-wait">{tr({ uz: "Hali o'quvchi qo'shilmagan — ular praktikani boshlashi bilan bu yerda ✓ chiqadi…", ru: 'Пока никто не присоединился — как только ученики начнут практику, здесь появятся ✓…' })}</p>}
          </div>
        )}
        <div className="mp-actions">
          <button className="mp-demo" onClick={() => setView('demo')}>🖊 {tr({ uz: "Doskada yozib ko'rsatish", ru: 'Показать на доске' })}</button>
          <button className="mp-next" onClick={onClose}>{tr({ uz: 'Keyingi mavzuga', ru: 'К следующей теме' })} →</button>
        </div>
        <p className="mp-tip">{tr({ uz: "💡 Ko'pchilik tugatgach, aynan shu mashqni doskada birga yozing — shunda o'quvchilar o'zini tekshiradi va mavzu mustahkamlanadi.", ru: '💡 Когда большинство закончит, напишите это же упражнение на доске вместе — так ученики проверят себя, и тема закрепится.' })}</p>
      </div>
    </div>
  );
}

// ============================================================
//  ✏️ PRAKTIKA — 3 topshiriq (HtmlCompiler, JS iframe'da bajariladi).
//  Shartlar C.* (haqiqiy DOM/runtime tahlili). Starter FAQAT bo'sh izoh.
//  PRACTICE_AFTER[screenIdx] — shu ekrandan keyin compilator ochiladi.
// ============================================================

// — P1: LIKE SANAGICH (Screen5 — like demo — dan keyin) —
const TASK_LIKE = {
  eyebrow: { uz: 'Praktika · Like', ru: 'Практика · Like' },
  title: { uz: "Like tugmasini jonlantiring", ru: 'Оживите кнопку Like' },
  brief: { uz: "HTML'da tugma `<button id=\"like\">Like</button>` va son uchun `<span id=\"son\">0</span>` yozing. JS faylida tugma bosilganda son 1 taga oshsin (`son = son + 1`). To'g'ri bo'lsa — bosilganda 0 → 1 bo'ladi.", ru: 'В HTML напишите кнопку `<button id=\"like\">Like</button>` и `<span id=\"son\">0</span>` для числа. В JS-файле: при нажатии кнопки число растёт на 1 (`son = son + 1`). Если всё верно — при нажатии 0 → 1.' },
  files: [
    { name: 'index.html', lang: 'html', starter: `<!-- Bu yerga yozing -->\n` },
    { name: 'script.js',  lang: 'js',   starter: `// Bu yerga yozing\n` },
  ],
  requirements: [
    { id: 'btn', label: { uz: '<button id="like"> tugma', ru: '<button id="like"> кнопка' }, check: C.has('#like', { uz: "`<button id=\"like\">Like</button>` qo'shing", ru: 'Добавьте `<button id=\"like\">Like</button>`' }) },
    { id: 'son', label: { uz: '<span id="son">0</span> — son', ru: '<span id="son">0</span> — число' }, check: C.has('#son', { uz: "Son uchun `<span id=\"son\">0</span>` qo'shing", ru: 'Добавьте `<span id=\"son\">0</span>` для числа' }) },
    { id: 'click', label: { uz: 'bosilganda son 1 ga oshadi', ru: 'при нажатии число растёт на 1' }, check: C.domAfterClick('#like', '#son', '1', { uz: "JS'da: bosilganda `son`ni +1 qilib, `son` matnini yangilang", ru: 'В JS: при нажатии прибавьте к `son` +1 и обновите текст `son`' }) },
  ],
};

// — P2: TUNGI/KUNDUZGI REJIM (Screen6 — toggle demo — dan keyin) —
const TASK_TOGGLE = {
  eyebrow: { uz: 'Praktika · Rejim', ru: 'Практика · Режим' },
  title: { uz: "Rejim tugmasini yasang", ru: 'Сделайте кнопку режима' },
  brief: { uz: "HTML'da `<button id=\"rejim\">Kunduz</button>` yozing. JS'da tugma bosilganda matn «Kunduz» va «Tun» orasida almashsin (if/else). 1-bosishda Tun, 2-bosishda yana Kunduz bo'lishi kerak.", ru: 'В HTML напишите `<button id=\"rejim\">Kunduz</button>`. В JS: при нажатии текст переключается между «Kunduz» и «Tun» (if/else). После 1-го нажатия — Tun, после 2-го — снова Kunduz.' },
  files: [
    { name: 'index.html', lang: 'html', starter: `<!-- Bu yerga yozing -->\n` },
    { name: 'script.js',  lang: 'js',   starter: `// Bu yerga yozing\n` },
  ],
  requirements: [
    { id: 'btn', label: '<button id="rejim">Kunduz</button>', check: C.has('#rejim', { uz: "`<button id=\"rejim\">Kunduz</button>` qo'shing", ru: 'Добавьте `<button id=\"rejim\">Kunduz</button>`' }) },
    { id: 'toggle', label: { uz: 'Kunduz ⇄ Tun almashadi', ru: 'Kunduz ⇄ Tun переключается' }, check: C.toggle('#rejim', '#rejim', 'Kunduz', 'Tun', { uz: "JS'da: agar matn «Kunduz» bo'lsa «Tun»ga, aks holda «Kunduz»ga o'zgartiring", ru: 'В JS: если текст «Kunduz» — поменяйте на «Tun», иначе — на «Kunduz»' }) },
  ],
};

// — P3: FORMA TEKSHIRUVI — if/else (Screen10 — forma demo — dan keyin) —
const TASK_FORM = {
  eyebrow: { uz: 'Praktika · Forma', ru: 'Практика · Форма' },
  title: { uz: "Formani tekshiring (if/else)", ru: 'Проверьте форму (if/else)' },
  brief: { uz: "HTML'da `<input id=\"ism\">`, `<button id=\"yubor\">Yuborish</button>` va xabar uchun `<span id=\"xabar\"></span>` yozing. JS'da: agar input bo'sh bo'lsa — «Ism kiriting» yozing, aks holda «Rahmat». Bo'sh formada bosilsa «Ism kiriting» chiqadi.", ru: 'В HTML напишите `<input id=\"ism\">`, `<button id=\"yubor\">Yuborish</button>` и `<span id=\"xabar\"></span>` для сообщения. В JS: если input пустой — выведите «Ism kiriting», иначе — «Rahmat». При пустой форме после нажатия появится «Ism kiriting».' },
  files: [
    { name: 'index.html', lang: 'html', starter: `<!-- Bu yerga yozing -->\n` },
    { name: 'script.js',  lang: 'js',   starter: `// Bu yerga yozing\n` },
  ],
  requirements: [
    { id: 'btn', label: { uz: '<button id="yubor"> tugma', ru: '<button id="yubor"> кнопка' }, check: C.has('#yubor', { uz: "`<button id=\"yubor\">Yuborish</button>` qo'shing", ru: 'Добавьте `<button id=\"yubor\">Yuborish</button>`' }) },
    { id: 'ifelse', label: { uz: 'if/else ishlatilgan', ru: 'использован if/else' }, check: C.js(/if\s*\(/, { uz: "Tekshiruv uchun `if (...)` sharti yozing", ru: 'Напишите условие `if (...)` для проверки' }) },
    { id: 'check', label: { uz: "bo'sh formada «Ism kiriting»", ru: 'при пустой форме — «Ism kiriting»' }, check: C.domAfterClick('#yubor', '#xabar', 'kiriting', { uz: "JS'da: agar `ism` qiymati bo'sh bo'lsa `xabar`ga «Ism kiriting» yozing", ru: 'В JS: если значение `ism` пустое, выведите в `xabar` текст «Ism kiriting»' }) },
  ],
};

// Praktika handoff xaritasi: shu ekran INDEKSIDAN keyin qaysi praktika chaqiriladi.
const PRACTICE_AFTER = {
  5:  { task: TASK_LIKE,   starter: '' }, // 1) Like sanagich (click → son+1)
  6:  { task: TASK_TOGGLE, starter: '' }, // 2) Tungi/kunduzgi rejim (toggle if/else)
  10: { task: TASK_FORM,   starter: '' }, // 3) Forma tekshiruvi (if/else)
};

// ===== ⚡ CODE STRIKE — mustahkamlash arena =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi kod tokenlari (jonlantirish mavzusi — hodisa/reaksiya)
const QZ_BG_SHAPES = [
  { ch: 'onclick',  l: 6,  t: 18, s: 30, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: 'click',    l: 82, t: 12, s: 26, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: 'son=0',    l: 9,  t: 74, s: 30, c: 'rgba(255,110,70,0.15)',  d: 27, dl: 0.8 },
  { ch: 'input',    l: 76, t: 70, s: 26, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: 'if/else',  l: 46, t: 86, s: 28, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: 'hover',    l: 66, t: 24, s: 22, c: 'rgba(80,200,255,0.14)',  d: 17, dl: 0.4 },
  { ch: 'son+1',    l: 22, t: 36, s: 22, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: 'toggle',   l: 92, t: 46, s: 24, c: 'rgba(120,235,175,0.13)', d: 24, dl: 1.3 },
  { ch: 'event',    l: 2,  t: 46, s: 24, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: "HTML va CSS saytga nima beradi?", ru: 'Что дают сайту HTML и CSS?' }, opts: [{ uz: "Tashqi ko'rinish", ru: 'Внешний вид' }, { uz: "Jonlilik va reaksiya", ru: 'Живость и реакции' }, { uz: "Internet tezligi", ru: 'Скорость интернета' }, { uz: "Ma'lumotlar bazasi", ru: 'Базу данных' }], correct: 0 },
  { q: { uz: "Saytga jon (interaktivlik) kiritadigan til qaysi?", ru: 'Какой язык вдыхает в сайт жизнь (интерактивность)?' }, opts: ["HTML", "CSS", "JavaScript", "Word"], correct: 2 },
  { q: { uz: "«Hodisa» (event) nima?", ru: 'Что такое «событие» (event)?' }, opts: [{ uz: "Saytning tashqi rangi", ru: 'Внешний цвет сайта' }, { uz: "Yuklangan fayl nomi", ru: 'Имя загруженного файла' }, { uz: "Internet ulanish tezligi", ru: 'Скорость интернет-соединения' }, { uz: "Foydalanuvchining harakati", ru: 'Действие пользователя' }], correct: 3 },
  { q: { uz: "Jonlantirishning to'g'ri ketma-ketligi qaysi?", ru: 'Какова правильная последовательность оживления?' }, opts: [{ uz: "O'zgarish → Hodisa → Reaksiya", ru: 'Изменение → Событие → Реакция' }, { uz: "Hodisa → Reaksiya → O'zgarish", ru: 'Событие → Реакция → Изменение' }, { uz: "Reaksiya → Hodisa → O'zgarish", ru: 'Реакция → Событие → Изменение' }, { uz: "Faqat o'zgarish", ru: 'Только изменение' }], correct: 1 },
  { q: { uz: "Tugmani bosish qaysi hodisaga misol?", ru: 'Нажатие кнопки — пример какого события?' }, opts: ["input", "hover", "click", "scroll"], correct: 2 },
  { q: { uz: "Matn maydoniga yozish qaysi hodisa?", ru: 'Ввод в текстовое поле — какое событие?' }, opts: ["input", "click", "hover", "load"], correct: 0 },
  { q: { uz: "son = 0 bo'lsa, tugma 3 marta bosilsa (son = son + 1) natija?", ru: 'son = 0; кнопку нажали 3 раза (son = son + 1) — результат?' }, opts: ["0", "1", "3", "33"], correct: 2 },
  { q: { uz: "Sayt nechta like borligini nimada eslab qoladi?", ru: 'Где сайт запоминает, сколько лайков?' }, opts: [{ uz: "Rasm faylida", ru: 'В файле картинки' }, { uz: "URL manzilda", ru: 'В URL-адресе' }, { uz: "CSS faylida", ru: 'В CSS-файле' }, { uz: "O'zgaruvchida", ru: 'В переменной' }], correct: 3 },
  { q: { uz: "Tungi/kunduzgi rejim tugmasi asosan nimani o'zgartiradi?", ru: 'Что в основном меняет кнопка ночного/дневного режима?' }, opts: [{ uz: "Internet tezligini", ru: 'Скорость интернета' }, { uz: "Ranglar va mavzuni", ru: 'Цвета и тему' }, { uz: "Fayl nomlarini", ru: 'Имена файлов' }, { uz: "Server manzilini", ru: 'Адрес сервера' }], correct: 1 },
  { q: { uz: "«Ko'rsat / yashir» tugmasi nimani boshqaradi?", ru: 'Чем управляет кнопка «показать / скрыть»?' }, opts: [{ uz: "Element ko'rinishini", ru: 'Видимостью элемента' }, { uz: "Internet ulanishini", ru: 'Интернет-соединением' }, { uz: "Shriftni yuklashni", ru: 'Загрузкой шрифта' }, { uz: "Domen manzilini", ru: 'Адресом домена' }], correct: 0 },
  { q: { uz: "Forma tekshiruvida bo'sh maydon uchun nima ishlatiladi?", ru: 'Что используется для проверки пустого поля в форме?' }, opts: [{ uz: "Rang o'zgarishi", ru: 'Смена цвета' }, { uz: "if/else sharti", ru: 'Условие if/else' }, { uz: "Rasm qo'shish", ru: 'Добавление картинки' }, { uz: "Video ijrosi", ru: 'Воспроизведение видео' }], correct: 1 },
  { q: { uz: "«Jonli salom» — ism yozilganda o'zgarishi uchun kerak bo'lgan hodisa?", ru: '«Живое приветствие» — какое событие нужно, чтобы оно менялось при вводе имени?' }, opts: ["click", { uz: "hech qaysi", ru: 'никакое' }, "hover", "input"], correct: 3 },
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
          <span className="cs-hud-i">🏆 {tr({ uz: 'PODIUM', ru: 'ПОДИУМ' })}</span>
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
    const TOK = ['onclick', 'let', '() =>', 'click', 'if', 'true', '{ }', ';'];
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
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать в арене.\nПотом можно вернуться в это же место через «⚔️ Продолжить».\n\nВсё равно закрыть?' }))) return;
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
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест сами:' })}</span>
          <button className="qz-btn" onClick={startPractice}>📖 {tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме тренировки' })}</button>
        </div>
      )}

      {/* ===== LOBBY ===== */}
      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее правильный ответ — тем больше баллов. Серия верных ответов даёт 🔥 бонус!' })}</p>
          {solo && isStudent && <p className="qz-sub" style={{ color: '#FFC94D' }}>{tr({ uz: "📖 Mashq rejimi — o'z tezligingizda ishlaysiz, natija faqat sizga ko'rinadi.", ru: '📖 Режим тренировки — работаете в своём темпе, результат виден только вам.' })}</p>}
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>▶ {tr({ uz: 'Testni boshlash', ru: 'Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Ждите, пока ментор начнёт тест…' })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>▶ {tr({ uz: 'Boshlash', ru: 'Начать' })}</button>}
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
              <button className="qz-btn" onClick={() => ctrl('r', qi)}>⏹ {tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Быстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: 'Siz hozir:', ru: 'Вы сейчас:' })} {myRank + 1}-{tr({ uz: "o'rin", ru: 'е место' })}</span>}
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
          <div className="qz-brand sm"><QzBolt size={48} /><span className="qz-wm">Code<span className="qz-wm-h">Strike</span></span></div>
          <h2 className="qz-h" style={{ fontSize: 'clamp(20px,3.4vw,30px)' }}>{tr({ uz: 'Test yakunlandi!', ru: 'Тест завершён!' })} 🎉</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'лучшая серия' })} 🔥x${soloScore.maxStreak}` : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ {tr({ uz: 'Qayta ishlash', ru: 'Пройти ещё раз' })}</button>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ {tr({ uz: 'Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: 'Пройти тест ещё раз — тренировка (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

export default function PracticeLesson1({ lang: langProp, onFinished, onPractice }) {
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
  const [practice, setPractice] = useState(null);        // lokal overlay: { task, starter, done } yoki null
  const [mentorPractice, setMentorPractice] = useState(null); // jonli mentor paneli
  const startTimeRef = useRef(saved?.startedAt || Date.now());

  // 🏅 Nishonlar (achievements) — earnedRef + Set (StrictMode-xavfsiz, dublikatsiz)
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

  // Javob kaliti: inline testlar + jang savollari (QUIZ_BANK'dan) — mentor ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);

  // 🃏 Flashcard jonli darsda FAQAT MENTORGA (proyektorda jamoaviy takrorlash); jonli o'quvchidan yashirin — sakrab o'tiladi.
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const advance = () => setScreen(s => {
    let n = Math.min(s + 1, TOTAL_SCREENS - 1);
    if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
    return n;
  });
  // Praktikani ishga tushiradi: production'da onPractice (LMS), lokalda overlay.
  const runPractice = (entry, fromScreen) => {
    const done = () => {
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_DONE_BASE + fromScreen, `practice-${fromScreen}`, 0, true, 0);
      earn('coder'); // 🏅 praktikada o'z qo'li bilan kod yozdi
      pracClear(LESSON_META.lessonId); setPractice(null); advance();
    };
    if (typeof onPractice === 'function') Promise.resolve(onPractice(entry.task)).then(done);
    else { pracWrite(LESSON_META.lessonId, { kind: `s${fromScreen}`, screen: fromScreen }); setPractice({ ...entry, done, codeKey: codeKeyOf(LESSON_META.lessonId, `s${fromScreen}`) }); }
  };
  // "Davom etish": shu ekrandan keyin praktika bo'lsa — compilatorni ochadi.
  // 🏠 UYGA VAZIFA PRAKTIKASI (yakun-sahifadagi tugma) — yakuniy topshiriq.
  // Dars-ichi mashqidan farqi: keyingi ekranga O'TKAZMAYDI (oxirgi sahifa) va serverga
  // «bajardim» signali YUBORMAYDI — bu uy ishi, sinf ishi emas.
  const openHomeworkPractice = () => {
    const entry = { task: TASK_FORM, starter: '' };
    if (typeof onPractice === 'function') Promise.resolve(onPractice(entry.task)).catch(() => {});
    else {
      pracWrite(LESSON_META.lessonId, { kind: 'hw' });
      setPractice({ ...entry, codeKey: codeKeyOf(LESSON_META.lessonId, 'hw'), done: () => { pracClear(LESSON_META.lessonId); setPractice(null); } });
    }
  };
  // F-0801-01: qayta yuklanishda ochiq praktika tiklanadi (qaysi biri ochilgan bo'lsa — o'sha
  // qayta quriladi; `done` shu yerda yangidan bog'lanadi).
  useEffect(() => {
    if (typeof onPractice === 'function') return; // production: overlay ishlatilmaydi
    const p = pracRead(LESSON_META.lessonId);
    if (!p) return;
    if (p.kind === 'hw') { openHomeworkPractice(); return; }
    const entry = PRACTICE_AFTER[p.screen];
    if (entry) runPractice(entry, p.screen);
    else pracClear(LESSON_META.lessonId); // dars o'zgargan — eskirgan saqlov tashlanadi
  }, []); // eslint-disable-line

  const next = () => {
    const entry = PRACTICE_AFTER[screen];
    if (!entry) { advance(); return; }
    // 🔴 DARS-ICHI PRAKTIKASI FAQAT JONLI DARSDA (2026-07-29): mashq faqat o'quvchi mentorga
    // ULANGAN va sessiya davom etayotganda ochiladi. Mentor «Erkin qilish»ni bossa, uzilib qolsa
    // yoki bola mustaqil o'qiyotgan bo'lsa — mashq OCHILMAYDI, u yakun-sahifadagi «Uyga vazifa»
    // tugmasi orqali bajaradi.
    if (!(live && (live.mode === 'mentor' || (live.mode === 'student' && live.status !== 'ended' && live.mentorAlive)))) { advance(); return; }
    if (live && live.mode === 'mentor') { setMentorPractice({ ...entry, fromScreen: screen }); advance(); }
    else runPractice(entry, screen);
  };
  const prev = () => setScreen(s => {
    let n = Math.max(s - 1, 0);
    if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0);
    return n;
  });
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && _m.scored && _m.scope === 'final' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat SCORED test ekran)
  };
  const reset = () => { progClear(LESSON_META.lessonId); pracClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); setPractice(null); setMentorPractice(null); startTimeRef.current = Date.now(); };
  // F-0730-01: har o'zgarishda progress saqlanadi (screen + javoblar + nishonlar + boshlangan vaqt)
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned]);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  useEffect(() => { if (screen === TOTAL_SCREENS - 1) earn('graduate'); }, [screen]); // eslint-disable-line 🏅 yakuniy ekran

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
      nickname: live.nickname || null, livePin: live.pin || null, liveMode: live.mode,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scoredMeta.length, correctAnswers,
      scorePercent: scoredMeta.length ? Math.round((correctAnswers / scoredMeta.length) * 100) : 0,
      finalScore: finalCorrect, finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : (scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false),
      answers: SCREEN_META.map((_, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === 'function') onFinished(payload);
  };

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenPodium, ScreenFlashcards, Screen16];
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
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
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

        /* === OPSIYALAR === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); display: flex; align-items: center; justify-content: center; font-size: 22px; line-height: 1; }
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
        .num-badge { width: 30px; height: 30px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 800; font-size: 14px; flex-shrink: 0; }

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

        /* === CODEBOX === */
        .codebox { background: ${CODE.bg}; border-radius: 12px; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: clamp(12.5px,1.6vw,14.5px); color: ${CODE.text}; line-height: 1.75; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.18); overflow-x: hidden; }
        .codebox > div { white-space: pre-wrap; word-break: break-word; }

        /* === TAGPILL / AI CARD === */
        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; }

        /* === BROWSER / SAYT PREVIEW === */
        .browser { background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px -10px rgba(${T.shadowBase},0.22); border: 1px solid rgba(167,166,162,0.25); }
        .browser-bar { display: flex; align-items: center; gap: 6px; padding: 9px 12px; background: #ECEAE4; }
        .browser-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .browser-url { margin-left: 8px; flex: 1; font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; background: ${T.paper}; border-radius: 6px; padding: 4px 10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .browser-body { padding: clamp(15px,2.6vw,22px); min-height: 150px; background: ${T.paper}; color: ${T.ink}; transition: background .35s ease, color .35s ease; }
        .browser-dark .browser-bar { background: #11151C; }
        .browser-dark .browser-body { background: #161E2B; color: #E8E5DD; }
        .browser-dark .browser-url { background: #0E141D; color: #7A8699; }

        /* === MINI-SAYT === */
        .site-card { display: flex; flex-direction: column; gap: 13px; align-items: flex-start; }
        .site-ava { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, ${T.accent}, #FF9B7D); display: flex; align-items: center; justify-content: center; font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 24px; color: #fff; flex-shrink: 0; text-transform: uppercase; }
        .site-name { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(17px,2.4vw,21px); }
        .site-btn { font-family: 'Manrope'; font-weight: 600; font-size: 14px; border: none; border-radius: 10px; padding: 9px 16px; cursor: pointer; background: ${T.ink}; color: ${T.paper}; transition: all .18s; }
        .site-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .site-btn:disabled { cursor: not-allowed; }
        .site-like { display: inline-flex; align-items: center; gap: 8px; background: ${T.accentSoft}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 16px; font-family: 'Manrope'; font-weight: 700; font-size: 15px; cursor: pointer; transition: transform .15s; }
        .site-like:active { transform: scale(.94); }
        .shake { animation: shake .36s ease; }
        @keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }

        /* === FLOW (Hodisa->Reaksiya->O'zgarish) === */
        .flow { display: flex; align-items: center; justify-content: center; gap: 5px; flex-wrap: wrap; }
        .flow-node { display: flex; align-items: center; gap: 5px; background: ${T.paper}; border-radius: 9px; padding: 6px 9px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: ${T.ink2}; transition: all .25s; opacity: .45; white-space: nowrap; }
        .flow-node.on { opacity: 1; background: ${T.accent}; color: #fff; transform: translateY(-2px); box-shadow: 0 8px 18px -6px rgba(255,79,40,0.4); }
        .flow-node .flow-n { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; background: rgba(167,166,162,0.3); font-family: 'JetBrains Mono'; font-weight: 700; font-size: 9.5px; flex-shrink: 0; }
        .flow-node.on .flow-n { background: rgba(255,255,255,0.3); }
        .flow-arrow { color: ${T.ink3}; font-size: 13px; }

        /* === EVENT KARTALAR === */
        .evt-card { display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer; border: none; border-radius: 12px; padding: 13px 15px; background: ${T.paper}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: all .18s; width: 100%; }
        .evt-card:hover { transform: translateY(-1px); }
        .evt-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22); }
        .evt-card .evt-name { font-family: 'Manrope'; font-weight: 600; font-size: 14px; color: ${T.ink}; }
        .evt-card .evt-hint { font-size: 12px; color: ${T.ink2}; }

        /* === IWATCH === */
        .iwatch { display: flex; align-items: baseline; gap: 9px; background: ${T.paper}; border-radius: 12px; padding: 12px 18px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .iwatch-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink3}; }
        .iwatch-eq { font-family: 'JetBrains Mono'; font-size: 18px; color: ${T.ink2}; }
        .iwatch-num { font-family: 'Fraunces', serif; font-size: clamp(34px,7vw,52px); color: ${T.accent}; line-height: 1; }

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
        /* 🏠 UYGA VAZIFA — amaliy topshiriqqa chorlaydigan kapsula (darsning O'Z rangida) */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, ${T.accent}66, ${T.accent}00 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: none; border-radius: 22px; cursor: pointer; background: linear-gradient(160deg, ${T.accent} 0%, ${T.accent} 52%, ${T.ink} 100%); color: #fff; animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; text-shadow: 0 2px 12px rgba(0,0,0,0.25); }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent); transform: skewX(-18deg); animation: hw-shine 3.2s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 18px 40px -14px ${T.accent}99, 0 0 0 0 ${T.accent}59; } 50% { box-shadow: 0 20px 48px -14px ${T.accent}bb, 0 0 0 11px ${T.accent}00; } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before { animation: none; } .hw-big-wrap::before { opacity: 0.55; } }
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.12); overflow: hidden; }
        .gloss-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 17px; cursor: pointer; } .gloss-head .lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; } .gloss-toggle { font-size: 18px; color: ${T.ink2}; }
        .gloss-body { padding: 0 17px 15px; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; line-height: 1.7; animation: fade-step 0.3s; } .gloss-body b { color: ${T.ink}; }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* ===== QO'SHIMCHA ANIMATSIYALAR (v16 yaxshilash) ===== */
        @keyframes floatplus { 0%{opacity:1; transform:translate(-50%,0) scale(1);} 100%{opacity:0; transform:translate(-50%,-28px) scale(1.35);} }
        .float-plus { position:absolute; left:50%; top:-8px; font-family:'JetBrains Mono'; font-weight:800; font-size:16px; color:${T.accent}; pointer-events:none; animation: floatplus 0.7s ease-out forwards; }
        @keyframes popnum { 0%{transform:scale(0.55);} 55%{transform:scale(1.28);} 100%{transform:scale(1);} }
        .pop-num { display:inline-block; animation: popnum 0.35s cubic-bezier(.34,1.4,.4,1); }
        @keyframes glowpulse { 0%,100%{box-shadow:0 0 0 0 rgba(31,122,77,0.55);} 50%{box-shadow:0 0 0 9px rgba(31,122,77,0);} }
        .glow-btn { animation: glowpulse 1.2s ease-in-out infinite; }
        @keyframes livedot { 0%,100%{box-shadow:0 0 0 0 rgba(255,79,40,0.55);} 50%{box-shadow:0 0 0 7px rgba(255,79,40,0);} }
        .live-dot { animation: livedot 1.3s ease-in-out infinite; }
        .ex-row { animation: el-pop 0.32s ease-out both; }
        @keyframes codeglow-ok { from{background:rgba(31,122,77,0);} to{background:rgba(31,122,77,0.2);} }
        @keyframes codeglow-bad { from{background:rgba(255,79,40,0);} to{background:rgba(255,79,40,0.18);} }
        .ck-line { display:flex; align-items:center; gap:9px; border-radius:10px; padding:9px 13px; font-size:13px; transition:all .3s; }

        /* === MOBIL POLISH (zichroq, toza, gorizontal toshmasin) === */
        @media (max-width: 640px) {
          .stage-content { padding-bottom: clamp(14px,3vw,22px); }
          .screen { gap: 13px; }
          .browser-body { min-height: 84px; padding: 14px 15px; }
          .codebox { font-size: 12.5px; line-height: 1.6; padding: 12px 13px; }
          .mentor-msg { padding: 11px 14px; }
          .site-ava { width: 46px; height: 46px; font-size: 21px; }
          .frame { padding: 15px 16px; }
          .split { gap: 14px; }
          .flow { gap: 4px; }
          .flow-node { padding: 6px 8px; }
        }

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

        /* ===== ✍️ MENTOR PRAKTIKA OVERLAY ===== */
        .mp-overlay { position: fixed; inset: 0; z-index: 2000; background: ${T.bg}; display: flex; align-items: center; justify-content: center; padding: clamp(16px,3vw,34px); overflow: auto; }
        .mp-card { width: 100%; max-width: 640px; background: ${T.paper}; border-radius: 22px; padding: clamp(22px,3.4vw,36px); box-shadow: 0 24px 60px -24px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 14px; animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        .mp-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; }
        .mp-title { font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(22px,3.2vw,30px); color: ${T.ink}; margin: 0; line-height: 1.15; }
        .mp-brief { margin: 0; font-size: clamp(13.5px,1.8vw,15px); line-height: 1.55; color: ${T.ink2}; }
        .mp-flow { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin: 2px 0 4px; }
        .mp-step { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.06); border-radius: 99px; padding: 6px 13px; }
        .mp-step.cur { color: ${T.success}; background: ${T.successSoft}; }
        .mp-arr { color: ${T.ink3}; font-weight: 700; }
        .mp-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
        .mp-demo { flex: 1; min-width: 200px; padding: 14px 20px; border: none; border-radius: 14px; background: ${T.ink}; color: ${T.paper}; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.4); transition: transform 0.15s; }
        .mp-demo:hover { transform: translateY(-2px); }
        .mp-next { flex: 1; min-width: 160px; padding: 14px 20px; border: 1.5px solid rgba(${T.shadowBase},0.16); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.15s; }
        .mp-next:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .mp-tip { margin: 2px 0 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink3}; }
        /* ===== 🃏 FLASHCARDS ===== */
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
        /* Quizlet uslubi: karta rangli muhr bilan chapga (✗ qizil) / o'ngga (✓ yashil) uchib ketadi */
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
        /* Aylanuvchi nur burjlari (butun ekran) */
        .acu-rays { position: absolute; top: 50%; left: 50%; width: 170vmax; height: 170vmax; transform: translate(-50%,-50%); pointer-events: none;
          background: repeating-conic-gradient(from 0deg, rgba(255,201,77,0.16) 0deg 7deg, transparent 7deg 20deg);
          -webkit-mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%); mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%);
          animation: acu-spin 16s linear infinite, acu-fade 0.6s ease-out; }
        @keyframes acu-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes acu-fade { from { opacity: 0; } to { opacity: 1; } }
        /* Markaziy yorug'lik */
        .acu-glow { position: absolute; top: 42%; left: 50%; width: 78vmin; height: 78vmin; transform: translate(-50%,-50%); pointer-events: none; filter: blur(4px);
          background: radial-gradient(circle, rgba(255,224,150,0.62) 0%, rgba(255,150,60,0.30) 38%, rgba(255,120,40,0) 68%);
          animation: acu-glow-pulse 2.2s ease-in-out infinite, acu-fade 0.5s ease-out; }
        @keyframes acu-glow-pulse { 0%,100% { opacity: 0.85; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08); } }
        /* Zarba to'lqini (halqa) */
        .acu-ring { position: absolute; top: 42%; left: 50%; width: 130px; height: 130px; border-radius: 50%; border: 3px solid rgba(255,240,200,0.85); transform: translate(-50%,-50%) scale(0.3); pointer-events: none; animation: acu-shock 1s cubic-bezier(.2,.7,.3,1) forwards; }
        .acu-ring.d2 { border-color: rgba(255,180,90,0.6); animation-delay: 0.22s; }
        @keyframes acu-shock { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.9; } 100% { transform: translate(-50%,-50%) scale(6.5); opacity: 0; } }
        /* Sahna (medal + matn) */
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
        /* Yuqori paneldagi nishon hisoblagichi */
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
        /* === ⚔️ CTA (yakun sahifasida) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; background: linear-gradient(135deg, #1D1145, #35206B); border-radius: 18px; padding: clamp(16px,2.4vw,22px) clamp(18px,2.6vw,26px); box-shadow: 0 14px 36px -14px rgba(29,17,69,0.55); }
        .qz-cta-txt { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 3px; }
        .qz-cta-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(16px,2.2vw,20px); color: #fff; }
        .qz-cta-s { font-family: 'Manrope'; font-weight: 500; font-size: 13px; color: rgba(255,255,255,0.72); }
        .qz-cta-btn { background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 13px 24px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 8px 22px -8px rgba(255,79,40,0.7); transition: transform 0.2s; }
        .qz-cta-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.03); }
        .qz-cta-btn:disabled { background: rgba(255,255,255,0.14); color: rgba(255,255,255,0.55); cursor: default; box-shadow: none; }
        .qz-cta.ready .qz-cta-btn { animation: qz-pulse 1.1s ease-in-out infinite; }
        @keyframes qz-pulse { 0%,100% { transform: scale(1); box-shadow: 0 8px 22px -8px rgba(255,79,40,0.7); } 50% { transform: scale(1.06); box-shadow: 0 10px 30px -6px rgba(255,79,40,0.95); } }

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

        /* === ⚔️ ARENA — to'liq ekran, tiniq qorong'u muhit === */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px);
          background:
            radial-gradient(120% 85% at 50% -18%, rgba(88,58,200,0.55) 0%, rgba(88,58,200,0) 55%),
            radial-gradient(70% 60% at 108% 112%, rgba(196,37,126,0.30) 0%, rgba(196,37,126,0) 60%),
            radial-gradient(55% 45% at -8% 108%, rgba(19,104,206,0.28) 0%, rgba(19,104,206,0) 60%),
            linear-gradient(168deg, #241560 0%, #170F3D 52%, #0D0826 100%);
        }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; animation: qz-drift ease-in-out infinite; text-shadow: 0 0 34px currentColor; will-change: transform; }
        @keyframes qz-drift { 0%,100% { transform: translate(0,0) rotate(-7deg) scale(1); } 50% { transform: translate(22px,-28px) rotate(9deg) scale(1.07); } }
        @media (prefers-reduced-motion: reduce) { .qz-shp { animation: none; } }
        .qz-x { position: fixed; top: 14px; right: 16px; z-index: 10600; width: 38px; height: 38px; border-radius: 50%; border: none; background: rgba(255,255,255,0.12); color: #fff; font-size: 16px; cursor: pointer; transition: background 0.2s; }
        .qz-x:hover { background: rgba(255,255,255,0.25); }
        .qz-view { position: relative; z-index: 1; width: 100%; max-width: 780px; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,2.4vw,22px); margin: auto; }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .qz-brand { display: flex; align-items: center; gap: 12px; }
        .qz-brand.sm { gap: 9px; }
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(255,79,40,0.32)); }
        .qz-wm { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,5vw,46px); letter-spacing: -0.03em; color: #F2ECFF; line-height: 1; text-shadow: 0 0 22px rgba(150,95,255,0.4); }
        .qz-wm-h { color: #FF6A3D; }
        .qz-logo { font-size: clamp(44px,8vw,72px); line-height: 1; filter: drop-shadow(0 8px 24px rgba(255,79,40,0.5)); }
        .qz-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,4.4vw,40px); color: #fff; margin: 0; text-align: center; letter-spacing: -0.02em; }
        .qz-sub { font-family: 'Manrope'; font-size: clamp(13px,1.9vw,16px); color: rgba(255,255,255,0.75); margin: 0; text-align: center; max-width: 560px; line-height: 1.55; }
        .qz-dimtxt { color: rgba(255,255,255,0.5); font-family: 'Manrope'; font-size: 14px; font-style: italic; }
        .qz-lobby-players { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; max-width: 640px; }
        .qz-pchip { background: rgba(255,255,255,0.12); color: #fff; font-family: 'Manrope'; font-weight: 700; font-size: 14px; border-radius: 99px; padding: 7px 16px; animation: qz-pop 0.4s cubic-bezier(.34,1.5,.4,1); }
        .qz-pchip.me { background: ${T.accent}; }
        @keyframes qz-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .qz-btn { background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 13px 26px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 10px 26px -8px rgba(255,79,40,0.65); transition: transform 0.18s; }
        .qz-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .qz-btn:disabled { opacity: 0.45; cursor: default; }
        .qz-btn.big { font-size: clamp(16px,2.2vw,19px); padding: clamp(14px,2vw,17px) clamp(30px,4vw,44px); }
        .qz-btn.ghost { background: rgba(255,255,255,0.12); box-shadow: none; }
        .qz-waitmsg { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 14.5px; color: #2BD97C; text-align: center; }
        .qz-qview { max-width: 860px; }
        .qz-top { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .qz-count { font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.8vw,16px); color: rgba(255,255,255,0.75); }
        .qz-count b { color: #fff; font-size: 1.25em; }
        .qz-ansn { font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.8vw,16px); color: #FFC94D; min-width: 64px; text-align: right; }
        .qz-timer { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
        .qz-timer-n { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 20px; }
        .qz-timer.urgent { animation: qz-shake 0.5s ease-in-out infinite; }
        @keyframes qz-shake { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .qz-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(19px,3.2vw,28px); color: #fff; margin: 0; text-align: center; line-height: 1.35; background: rgba(255,255,255,0.07); border-radius: 18px; padding: clamp(16px,2.6vw,24px) clamp(18px,3vw,30px); width: 100%; }
        .qz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(10px,1.6vw,14px); width: 100%; }
        @media (max-width: 560px) { .qz-grid { grid-template-columns: 1fr; } }
        .qz-tile { position: relative; display: flex; align-items: center; gap: 12px; border: none; border-radius: 16px; padding: clamp(15px,2.4vw,22px) clamp(14px,2.2vw,20px); cursor: pointer; text-align: left; min-height: 64px; box-shadow: 0 10px 26px -10px rgba(0,0,0,0.55); transition: transform 0.16s, opacity 0.3s, box-shadow 0.16s; }
        .qz-tile:hover:not(:disabled):not(.rv) { transform: translateY(-3px) scale(1.015); box-shadow: 0 16px 34px -10px rgba(0,0,0,0.6); }
        .qz-tile:disabled { cursor: default; }
        .qz-shape { font-size: clamp(17px,2.4vw,22px); color: rgba(255,255,255,0.9); flex-shrink: 0; }
        .qz-opt { flex: 1; font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,2vw,17px); color: #fff; line-height: 1.3; }
        .qz-tile.faded { opacity: 0.28; }
        .qz-tile.picked { outline: 3px solid #fff; animation: qz-pop 0.3s; }
        .qz-pbadge { position: absolute; top: -9px; right: -7px; width: 26px; height: 26px; border-radius: 50%; background: #fff; color: #17103B; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.4); }
        .qz-tile.rv.win { outline: 4px solid #2BD97C; box-shadow: 0 0 34px rgba(43,217,124,0.55); animation: qz-pop 0.4s; }
        .qz-tile.rv.lose { opacity: 0.3; }
        .qz-cnt { font-family: 'Manrope'; font-weight: 800; font-size: clamp(15px,2.2vw,19px); color: #fff; background: rgba(0,0,0,0.28); border-radius: 99px; padding: 4px 13px; flex-shrink: 0; }
        .qz-mrow { display: flex; align-items: center; gap: 14px; }
        .qz-allin { font-family: 'Manrope'; font-weight: 700; font-size: 15px; color: #2BD97C; animation: qz-pop 0.4s; }
        .qz-res { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; justify-content: center; border-radius: 16px; padding: 14px 26px; animation: qz-pop 0.45s cubic-bezier(.34,1.5,.4,1); }
        .qz-res.good { background: rgba(43,217,124,0.16); outline: 1.5px solid rgba(43,217,124,0.5); }
        .qz-res.bad { background: rgba(255,90,90,0.14); outline: 1.5px solid rgba(255,90,90,0.4); }
        .qz-res-pts { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,4.4vw,40px); color: #2BD97C; line-height: 1; }
        .qz-res-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,2vw,17px); color: #fff; }
        .qz-res-rank { font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; color: rgba(255,255,255,0.7); width: 100%; text-align: center; }
        .qz-board { width: 100%; max-width: 480px; background: rgba(255,255,255,0.07); border-radius: 16px; padding: 12px 14px; display: flex; flex-direction: column; gap: 5px; }
        .qz-board.wide { max-width: 640px; max-height: 260px; overflow: auto; }
        .qz-board-h { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.1em; color: #FFC94D; margin-bottom: 3px; }
        .qz-brow { display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 10px; background: rgba(255,255,255,0.05); }
        .qz-brow.me { background: linear-gradient(90deg,rgba(43,217,124,0.26),rgba(43,217,124,0.06)); outline: 1.5px solid rgba(43,217,124,0.55); }
        .qz-brow.me .qz-brank { background: #2BD97C; color: #0B2417; }
        .qz-brank { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: rgba(255,255,255,0.55); min-width: 20px; }
        .qz-bname { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14.5px; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .qz-bstreak { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: #FFC94D; }
        .qz-bok { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: rgba(255,255,255,0.6); }
        .qz-bpts { font-family: 'Manrope'; font-weight: 800; font-size: 15px; color: #FFC94D; min-width: 52px; text-align: right; }
        .qz-pod { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px,2.4vw,24px); padding-top: 18px; }
        .qz-pod-col { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; width: clamp(92px,24vw,170px); }
        .qz-crown { position: absolute; top: -30px; font-size: 28px; animation: qz-float-sm 2s ease-in-out infinite; }
        @keyframes qz-float-sm { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .qz-pod-medal { font-size: clamp(30px,5vw,46px); line-height: 1; }
        .qz-pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,2vw,18px); color: #fff; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .qz-pod-pts { font-family: 'Manrope'; font-weight: 600; font-size: clamp(11px,1.5vw,13px); color: rgba(255,255,255,0.72); }
        .qz-pod-bar { width: 100%; border-radius: 12px 12px 0 0; animation: qz-rise 0.9s cubic-bezier(.3,1.2,.4,1); transform-origin: bottom; }
        @keyframes qz-rise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .qz-pod-col.p1 .qz-pod-bar { height: clamp(90px,14vw,150px); background: linear-gradient(180deg, #FFD34D, #E8A13A); box-shadow: 0 0 44px rgba(255,211,77,0.4); }
        .qz-pod-col.p2 .qz-pod-bar { height: clamp(62px,10vw,104px); background: linear-gradient(180deg, #D8DCE8, #9AA2B8); }
        .qz-pod-col.p3 .qz-pod-bar { height: clamp(44px,7vw,74px); background: linear-gradient(180deg, #D89A5C, #A9682F); }
        .qz-pod-col.me .qz-pod-name { color: #3CE88E; text-shadow: 0 0 14px rgba(60,232,142,0.4); }
        .qz-mypl { margin: 0; font-family: 'Manrope'; font-size: 15px; color: rgba(255,255,255,0.85); }
        .qz-mypl b { color: #3CE88E; }
        .qz-solo-res { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .qz-solo-pts { font-family: 'Manrope'; font-weight: 800; font-size: clamp(52px,9vw,84px); line-height: 1; color: #FFC94D; text-shadow: 0 8px 34px rgba(255,201,77,0.4); }
        .qz-endnote { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 10600; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; max-width: 94vw; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 16px; padding: 10px 16px; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; backdrop-filter: blur(6px); }

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
        /* Jonli-badge — sekundar UI, kerak bo'lguncha xira (11.15) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
          <div className="lesson-root">
            {live.mode === 'choosing' ? (
              <LiveGate live={live} title={{ uz: 'Praktika', ru: 'Практика' }} />
            ) : (
              <>
                <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} onHomework={openHomeworkPractice} />
                {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
                <LiveBadge live={live} total={TOTAL_SCREENS} />
              </>
            )}
            {practice && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg }}>
                <HtmlCompiler task={practice.task} starterCode={practice.starter} storageKey={practice.codeKey} onContinue={practice.done} onBack={() => { pracClear(LESSON_META.lessonId); setPractice(null); }} />
              </div>
            )}
            {mentorPractice && <MentorPracticeOverlay entry={mentorPractice} live={live} onClose={() => setMentorPractice(null)} />}
          </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>
  );
}
