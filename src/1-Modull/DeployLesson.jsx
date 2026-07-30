import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

// Mentor avatar — hostlangan rasm (LMS'da assets papkasi bo'lmaydi; 11.1 standart)
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 06-DARS — NETLIFY VA DEPLOY — PLATFORM STANDARD v16
// Mavzu: Hosting nima, saytni internetga chiqarish (deploy),
//        maktab poddomeniga ulash (ism.maktab.uz).
// Arxitektura/dizayn — platform_contract (HTML/CSS/Git darslari bilan bir xil).
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', link: '#1a56db',
  line: '#E8E4DC', shadowBase: '58, 53, 48'
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
    } catch { setJoinError(tr({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: 'Неверный код ментора или ошибка соединения.' })); }
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
      <div style={{ fontSize: 'clamp(13px,2vw,18px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: LT.accent, marginBottom: 'clamp(14px,3vw,28px)' }}>{tr({ uz: "Jonli darsga qo'shilish", ru: 'Подключение к живому уроку' })}</div>
      <div style={{ display: 'flex', gap: 'clamp(6px,1.4vw,16px)', justifyContent: 'center', flexWrap: 'wrap' }}>{digits.map((d, i) => <span key={i} style={box}>{d}</span>)}</div>
      <p style={{ color: '#fff', opacity: 0.85, fontSize: 'clamp(15px,2.2vw,22px)', maxWidth: 640, margin: 'clamp(20px,4vw,36px) 0 0', lineHeight: 1.5 }}>{tr({ uz: <>Shu darsni o'z qurilmangizda oching → <b style={{ color: '#fff' }}>«👨‍🎓 O'quvchiman»</b> → ushbu kodni kiriting.</>, ru: <>Откройте этот урок на своём устройстве → <b style={{ color: '#fff' }}>«👨‍🎓 Я ученик»</b> → введите этот код.</> })}</p>
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
      <div style={{ textAlign: 'center' }}><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '0 0 4px' }}>🧑‍🏫 {tr({ uz: 'Mentor kirishi', ru: 'Вход для ментора' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor kodini kiriting.', ru: 'Введите код ментора.' })}</p></div>
      <input value={mentorCode} onChange={e => setMentorCode(e.target.value)} type="password" autoFocus placeholder={tr({ uz: 'Mentor kodi', ru: 'Код ментора' })} onKeyDown={e => { if (e.key === 'Enter') live.startMentor(mentorCode); }} style={{ width: '100%', padding: '14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 18, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: 'Tekshirilmoqda…', ru: 'Проверяем…' }) : tr({ uz: 'Kirish →', ru: 'Войти →' })}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
      <button onClick={() => { setRole('student'); setMentorCode(''); }} style={link}>{tr({ uz: '← Orqaga', ru: '← Назад' })}</button>
    </div></div>);
  }
  return (<div style={wrap}><div style={card}>
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{title}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Подключение к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и своё имя.' })}</p></div>
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
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> 🔓 {tr({ uz: "O'quvchilar erkin qilindi", ru: 'Ученики в свободном режиме' })}</div>;
    return (<>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr({ uz: 'Kod:', ru: 'Код:' })} <b style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr({ uz: "Kodni katta ko'rsatish", ru: 'Показать код крупно' })} style={{ marginLeft: 6, background: LT.ink, color: '#fff', border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>📺 {tr({ uz: "Ko'rsatish", ru: 'Показать' })}</button>
        <button onClick={() => { if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: 'Отпустить учеников? Они продолжат урок самостоятельно.' }))) live.endSession(); }} style={{ background: LT.accentSoft, color: LT.accent, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>🔓 {tr({ uz: 'Erkin qilish', ru: 'Отпустить' })}</button>
      </div>
    </>);
  }
  if (live.mode === 'student') {
    if (live.status === 'ended') return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 🔓 {tr({ uz: "Erkin rejim — o'zingiz davom eting", ru: 'Свободный режим — продолжайте сами' })}</div>;
    if (!live.mentorAlive) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> ⚠️ {tr({ uz: 'Mentor uzildi — erkin rejim', ru: 'Ментор отключился — свободный режим' })}</div>;
    if (!live.connected) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot('#FFD380')} /> 🔄 {tr({ uz: 'Qayta ulanmoqda…', ru: 'Переподключаемся…' })}</div>;
    return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 👨‍🏫 {tr({ uz: 'Mentor:', ru: 'Ментор:' })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

const LangContext = createContext('uz');
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
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

const LESSON_META = { lessonId: 'deploy-01-v18', lessonTitle: { uz: 'Netlify va Deploy', ru: 'Netlify и деплой' } };
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
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's13', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's15b', type: 'stats',      template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcard', template: 'custom',  scored: false, scope: null },
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

const Preview = ({ children, title = 'preview.html', minH }) => (
  <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">{title}</span></div><div className="bp-body" style={{ minHeight: minH }}>{children}</div></div>
);
const Split = ({ children }) => <div className="split">{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

// GitHub Octocat logotipi (qoramtir) — sakkizoyoq emoji o'rniga
const GitHubMark = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" fill="#24292F" style={{ display: 'block' }}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

// Kichik namuna-sayt (deploy/poddomen ekranlarida qayta ishlatiladi)
const MiniSite = ({ name = 'Aziza' }) => (
  <div style={{ fontFamily: 'Georgia, serif' }}>
    <h1 style={{ fontSize: 'clamp(18px,2.6vw,24px)', margin: '0 0 6px', color: T.ink }}>{tr({ uz: 'Salom, men', ru: 'Привет, я' })} {name}!</h1>
    <p style={{ margin: '0 0 12px', color: T.ink2, fontSize: 'clamp(13px,1.7vw,15px)', lineHeight: 1.5 }}>{tr({ uz: "Bu mening birinchi saytim. Web-dasturlashni endi o'rganyapman.", ru: 'Это мой первый сайт. Я только начинаю изучать веб-разработку.' })}</p>
    <span style={{ display: 'inline-block', background: T.accent, color: '#fff', padding: '7px 15px', borderRadius: 8, fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 13 }}>{tr({ uz: "Obuna bo'lish", ru: 'Подписаться' })}</span>
  </div>
);

// 🏅 NISHONLAR — 4 ta (uchtasi ma'noli triggerdan, bittasi yakundan). Nom inglizcha o'yin-uslubi, desc o'zbekcha siz-forma.
const ACHIEVEMENTS = {
  shipit:    { icon: '🚀', name: 'Ship It!',    desc: { uz: 'Saytni deploy qilib, internetga chiqarish nima ekanini bildingiz', ru: 'Вы задеплоили сайт и узнали, что значит выйти в интернет' } },
  hostpick:  { icon: '🌐', name: 'Host Pick!',  desc: { uz: "Hosting sayt uchun nima qilishini to'g'ri aniqladingiz", ru: 'Вы верно определили, что хостинг делает для сайта' } },
  golive:    { icon: '📡', name: 'Go Live!',    desc: { uz: "Uchirish markazida saytni to'g'ri tartibda uchirdingiz", ru: 'Вы запустили сайт в правильном порядке в центре управления' } },
  graduate:  { icon: '🏆', name: 'Level Up!',   desc: { uz: 'Deploy darsini yakunlab, saytingizni butun dunyoga ochdingiz', ru: 'Вы завершили урок деплоя и открыли сайт всему миру' } },
};
// Ekran id → nishon (recordAnswer'da avtomatik beriladi). FAQAT scored test yoki uchirish-gate — tekin berilmaydi.
// s4/s9 — scored testlar (correct=to'g'ri javob); s13 — uchirish gate (correct FAQAT worldwide fazasida).
const ACH_TRIGGERS = { s4: 'hostpick', s9: 'shipit', s13: 'golive' };

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
  const lbl = label != null ? tr(label) : tr({ uz: 'Davom etish', ru: 'Продолжить' });
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
// RECAPS kontenti — 4 ta baholanadigan test uchun qayta tushuntirish (idx 4/6/10/13).
// Xato javob bergan o'quvchi mavzuni 3 ta qisqa kartada qayta ko'radi (deploy/hosting/raketa metaforalari).
const RECAPS = {
  // idx 4 — s4: «Hosting asosan qanday vazifa bajaradi?» (nazariya: hosting)
  4: {
    title: { uz: 'Hosting — saytning doimiy uyi', ru: 'Хостинг — постоянный дом сайта' }, cards: [
      { ic: '🏠', h: { uz: 'Hosting nima qiladi?', ru: 'Что делает хостинг?' },
        body: { uz: <><b>Hosting</b> — saytingizni <b>doimo ishlab turadigan</b> serverda saqlaydi. Buni <b>24 soat ochiq do'kon</b> deb tasavvur qiling: eshigi hech qachon yopilmaydi, istalgan payt istalgan odam kirib ko'radi.</>, ru: <><b>Хостинг</b> хранит ваш сайт на <b>постоянно работающем</b> сервере. Представьте <b>магазин, открытый 24 часа</b>: двери никогда не закрываются, зайти может любой в любой момент.</> },
        vis: <RcFlow items={[{ uz: '📄 Sayt fayllari', ru: '📄 Файлы сайта' }, { uz: '🖥️ Hosting serveri', ru: '🖥️ Сервер хостинга' }, { uz: "🌍 Har kim ko'radi", ru: '🌍 Видят все' }]} />,
        ask: { uz: "Sizningcha, hosting bo'lmasa saytni kim ko'ra oladi?", ru: 'Как вы думаете, кто увидит сайт без хостинга?' } },
      { ic: '💻', h: { uz: 'localhost va hosting farqi', ru: 'Разница между localhost и хостингом' },
        body: { uz: <>Sayt faqat sizning kompyuteringizda ishlasa — bu <span className="mono">localhost</span>: kompyuter o'chsa, sayt ham yo'q, faqat siz ko'rasiz. Hostingda esa server <b>24/7</b> yonib turadi — dunyoning istalgan yeridan ochiladi.</>, ru: <>Если сайт работает только на вашем компьютере — это <span className="mono">localhost</span>: выключили компьютер — сайта нет, и видите его только вы. А на хостинге сервер работает <b>24/7</b> — сайт открывается из любой точки мира.</> },
        vis: <RcFlow items={[{ uz: '💻 localhost — faqat men', ru: '💻 localhost — только я' }, { uz: '🌍 hosting — hamma', ru: '🌍 хостинг — все' }]} sep="·" /> },
      { ic: '☝️', h: { uz: 'Adashtirmang!', ru: 'Не путайте!' },
        body: { uz: <>Hosting saytni <b>bezamaydi</b> (bu CSS ishi) va internetni <b>tezlashtirmaydi</b>. Uning yagona vazifasi — saytingizni serverda <b>doimo ochiq</b> saqlash, toki har kim manzildan ochsin.</>, ru: <>Хостинг сайт <b>не украшает</b> (это работа CSS) и интернет <b>не ускоряет</b>. Его единственная задача — держать сайт на сервере <b>всегда открытым</b>, чтобы каждый мог открыть его по адресу.</> },
        ask: { uz: "Sayt bezashini kim qiladi — hostingmi yoki CSS?", ru: 'Кто украшает сайт — хостинг или CSS?' } },
    ]
  },
  // idx 6 — s5b: «Netlify nima?» (nazariya: hosting platformasi)
  6: {
    title: { uz: 'Netlify — hosting platformasi', ru: 'Netlify — хостинг-платформа' }, cards: [
      { ic: '🌐', h: { uz: 'Netlify nima?', ru: 'Что такое Netlify?' },
        body: { uz: <><b>Netlify</b> — saytlarni <b>bepul</b> va bir necha soniyada internetga chiqaradigan <b>hosting platformasi</b>. Ya'ni saytingizni serverga qo'yish ishini u siz uchun oson qilib beradi.</>, ru: <><b>Netlify</b> — <b>хостинг-платформа</b>, которая публикует сайты <b>бесплатно</b> и за несколько секунд. Она берёт на себя всю работу по размещению сайта на сервере.</> },
        vis: <RcFlow items={[{ uz: '📁 Sayt', ru: '📁 Сайт' }, '🌐 Netlify', { uz: '🌍 Internetda', ru: '🌍 В интернете' }]} /> },
      { ic: '🔗', h: { uz: "Ikki yo'li bor", ru: 'Есть два пути' },
        body: { uz: <>Netlify'da saytni chiqarishning ikki usuli bor: papkani <b>sichqoncha bilan tortib tashlash</b>, yoki <b>GitHub'ni ulash</b>. Biz GitHub'ni ulaymiz — chunki kodimiz allaqachon o'sha yerda.</>, ru: <>Опубликовать сайт на Netlify можно двумя способами: <b>перетащить папку</b> мышкой или <b>подключить GitHub</b>. Мы подключим GitHub — ведь наш код уже там.</> },
        vis: <RcFlow items={[{ uz: '📁 Papkani tortish', ru: '📁 Перетащить папку' }, { uz: "🔗 GitHub'ni ulash", ru: '🔗 Подключить GitHub' }]} sep="·" /> },
      { ic: '☝️', h: { uz: 'Adashtirmang!', ru: 'Не путайте!' },
        body: { uz: <>Netlify — <b>brauzer emas</b> (brauzer saytni ko'rsatadi, masalan Chrome) va <b>domen emas</b> (domen — saytning manzili). Netlify — saytni <b>joylaydigan</b> hosting platformasi.</>, ru: <>Netlify — <b>не браузер</b> (браузер показывает сайт, например Chrome) и <b>не домен</b> (домен — это адрес сайта). Netlify — хостинг-платформа, которая сайт <b>размещает</b>.</> },
        ask: { uz: "Netlify va Chrome — qaysi biri saytni ko'rsatadi?", ru: 'Netlify и Chrome — что из них показывает сайт?' } },
    ]
  },
  // idx 10 — s9: «Deploy qilgandan keyin uni kim ko'radi?» (nazariya: deploy)
  10: {
    title: { uz: 'Deploy — saytni uchirish', ru: 'Деплой — запуск сайта' }, cards: [
      { ic: '🚀', h: { uz: 'Deploy nima?', ru: 'Что такое деплой?' },
        body: { uz: <><b>Deploy</b> — saytni serverga joylab, <b>internetga chiqarish</b>. Buni <b>raketani uchirish</b>ga o'xshating: shu paytgacha sayt yerda (kompyuteringizda) turardi, deploy uni <b>osmonga — internetga</b> olib chiqadi.</>, ru: <><b>Деплой</b> — разместить сайт на сервере и <b>вывести его в интернет</b>. Это как <b>запуск ракеты</b>: до этого сайт стоял на земле (на вашем компьютере), а деплой поднимает его <b>в небо — в интернет</b>.</> },
        vis: <RcFlow items={[{ uz: '💻 Kompyuterda', ru: '💻 На компьютере' }, { uz: '🚀 Deploy', ru: '🚀 Деплой' }, { uz: '🌍 Internetda', ru: '🌍 В интернете' }]} /> },
      { ic: '👀', h: { uz: "Endi uni kim ko'radi?", ru: 'Кто его теперь увидит?' },
        body: { uz: <>Deploy qilingach sayt internetda ochiq bo'ladi — <b>manzilni bilgan har bir kishi</b> uni ochib ko'radi. Boshqa shahardagi do'stingiz ham, notanish odam ham.</>, ru: <>После деплоя сайт открыт в интернете — его откроет <b>каждый, кто знает адрес</b>. И друг из другого города, и совсем незнакомый человек.</> },
        vis: <RcFlow items={[{ uz: "🧑 Do'stingiz", ru: '🧑 Ваш друг' }, { uz: '👩 Notanish', ru: '👩 Незнакомец' }, { uz: '🌍 Hamma', ru: '🌍 Все' }]} sep="·" /> },
      { ic: '☝️', h: { uz: 'localhost bilan adashtirmang!', ru: 'Не путайте с localhost!' },
        body: { uz: <>Deploydan <b>oldin</b> sayt <span className="mono">localhost</span>da edi — faqat siz ko'rardingiz. Deploy aynan shuni o'zgartiradi: saytni <b>hammaga</b> ochib beradi.</>, ru: <><b>До</b> деплоя сайт жил на <span className="mono">localhost</span> — видели его только вы. Деплой меняет именно это: он открывает сайт <b>всем</b>.</> },
        ask: { uz: "Deploydan oldin saytni kim ko'ra olardi?", ru: 'Кто мог видеть сайт до деплоя?' } },
    ]
  },
  // idx 13 — s12: «aziza.maktab.uz — bu nima?» (nazariya: domen va poddomen)
  13: {
    title: { uz: 'Domen va poddomen', ru: 'Домен и поддомен' }, cards: [
      { ic: '🌐', h: { uz: 'Domen — saytning manzili', ru: 'Домен — адрес сайта' },
        body: { uz: <><b>Domen</b> — saytning internetdagi <b>asosiy manzili</b>, odam eslab qoladigan nom. Masalan <span className="mono">maktab.uz</span>. Uy manzili kabi — uni bilsangiz, saytni topasiz.</>, ru: <><b>Домен</b> — <b>основной адрес</b> сайта в интернете, имя, которое легко запомнить. Например <span className="mono">maktab.uz</span>. Как домашний адрес — зная его, вы найдёте сайт.</> },
        vis: <RcFlow items={['🏫 maktab.uz', { uz: '= asosiy manzil', ru: '= основной адрес' }]} sep="" /> },
      { ic: '🏷️', h: { uz: "Poddomen — oldiga qo'shilgan nom", ru: 'Поддомен — имя, добавленное впереди' },
        body: { uz: <><b>Poddomen</b> — asosiy domen oldiga qo'shilgan <b>shaxsiy nom</b>. <span className="mono">aziza.maktab.uz</span> — bu <span className="mono">maktab.uz</span> domenining poddomeni. Bitta domen ostida <b>yuzlab</b> poddomen bo'ladi.</>, ru: <><b>Поддомен</b> — <b>личное имя</b>, добавленное перед основным доменом. <span className="mono">aziza.maktab.uz</span> — это поддомен домена <span className="mono">maktab.uz</span>. Под одним доменом бывают <b>сотни</b> поддоменов.</> },
        vis: <RcFlow items={['aziza.maktab.uz', 'ali.maktab.uz', 'dilnoza.maktab.uz']} sep="·" /> },
      { ic: '🧩', h: { uz: "Manzil qismlarga bo'linadi", ru: 'Адрес делится на части' },
        body: { uz: <><span className="mono">aziza</span> — sizning nomingiz (poddomen), <span className="mono">maktab.uz</span> — maktab domeni. Birga qo'shilganda — <b>sizning shaxsiy manzilingiz</b>. Bu mustaqil sayt yoki parol emas — bu <b>manzil</b>.</>, ru: <><span className="mono">aziza</span> — ваше имя (поддомен), <span className="mono">maktab.uz</span> — домен школы. Вместе — <b>ваш личный адрес</b>. Это не отдельный сайт и не пароль — это <b>адрес</b>.</> },
        ask: { uz: 'aziza.maktab.uz da qaysi qismi poddomen?', ru: 'Какая часть в aziza.maktab.uz — поддомен?' } },
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
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Назад' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-karta`, ru: `карточка ${k + 1}` })} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>✓ {tr({ uz: 'Tushunarli — davom etamiz', ru: 'Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Дальше →' })}</button>}
      </div>
    </div>
  );
}

// `backtick` ichidagi matnni <code class="qcode"> chipiga aylantiradi (savol/variant/arena)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

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
  // «To'g'ri» sanog'i ustunlar bilan BIR XIL mantiqdan (picked === correctIdx) — S2 saboq
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
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda', ru: 'ожидаем' })} ⏳</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi', ru: 'ответили' })} 📨</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda', ru: 'ожидаем' })} ⏳</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">🙈 {tr({ uz: "Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: 'Кто что выбрал и число ✅/❌ скрыты — после «Открыть результат» всё откроется сразу и у вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — класс не понял эту тему. Перед тем как идти дальше, рекомендуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. Если хотите, коротко повторите тему перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс усвоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — делать вывод по проценту сложно. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>
        );
      })()}
      {waiting.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">⏳ {tr({ uz: 'Kutilmoqda:', ru: 'Ожидаем:' })}</span>
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">⚠️ {tr({ uz: "Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: 'Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуем объяснить её ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в реальном времени…' })}</p>}
    </div>
  );
}

// ===== MENTOR YOZMA-ISH PANELI — s6 (amaliyot) va s15 (yakuniy g'oya) uchun =====
// O'quvchining yozgan MATNI serverga bormaydi (jadval sxemasi) — faqat «tugatdi»
// belgisi boradi. Mentor kim tugatgani/kim yozayotganini jonli ko'radi.
function MentorWorkStats({ live, screenIdx, taskLabel }) {
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
  const doneN = data.rows.length;
  const allIn = total > 0 && doneN >= total;
  const doneIds = new Set(data.rows.map(r => r.player_id));
  return (
    <div className="mstats fade-up">
      <div className="mstats-head">
        <span className="mstats-lbl">✍️ {taskLabel}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma tugatdi!', ru: '✓ Все закончили!' }) : <>{tr({ uz: 'Tugatdi:', ru: 'Закончили:' })} <b>{doneN}</b> / {total}</>}</span>
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((doneN / total) * 100) : 0}%` }} /></div>
      {total > 0 && (
        <div className="mstats-waitrow">
          {data.players.map(p => <span key={p.id} className="mstats-wait-chip" style={doneIds.has(p.id) ? { background: T.successSoft, color: T.success, fontWeight: 700 } : undefined}>{doneIds.has(p.id) ? '✓ ' : '✏️ '}{p.nickname}</span>)}
        </div>
      )}
      {doneN === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar yozib tugatishi bilan shu yerda ✓ belgisi chiqadi…", ru: 'Как только ученик закончит писать, здесь появится ✓…' })}</p>}
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
    const optTexts = options.map(o => tr(o)); // payload'ga doim string yoziladi ({uz,ru} obyekt emas)
    if (oneShot) {
      // Jonli dars: javob darhol qotadi (to'g'ri ham, xato ham) va serverga yoziladi
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: optTexts, correctIndex: correctIdx, correctAnswer: optTexts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: optTexts[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: optTexts, correctIndex: correctIdx, correctAnswer: optTexts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: optTexts[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
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
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>⚡ {tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: 'Живой урок — одна попытка, думайте перед кликом!' })}</p>}
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
                <span style={{ flex: 1 }}>{fmtCode(tr(opt))}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? fmtCode(tr({ uz: `✓ To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}`, ru: `✓ Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}` }))
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? fmtCode(tr({ uz: `To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}`, ru: `Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}` }))
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {fmtCode(tr(isMentorLive
              ? explainCorrect
              : waiting
                ? { uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас вы узнаете верный ответ.' }
                : wrongLocked
                  ? (explainWrong[picked] ?? explainWrong.default)
                  : solved ? explainCorrect : (explainWrong[picked] ?? explainWrong.default)))}
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

// ===== MENTOR (nomsiz ustoz ovozi — intro/izoh shu orqali; audio matni = shu matn) =====
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

// ===== SCREEN 0 — HOOK =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const audio = useAudio([{ id: 's0', text: `Saytingiz tayyor — kompyuteringizda zo'r ishlayapti. Lekin do'stingiz boshqa shahardan uni ocholmayapti. Nega? Pastdagi tugmalarni bosib ko'ring.`, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [view, setView] = useState('me');
  const OPTS = [
    { id: 'a', label: { uz: 'Faylni Telegram orqali yuboraman', ru: 'Отправлю файл через Telegram' } },
    { id: 'b', label: { uz: 'Saytni internetga joylashtirish kerak', ru: 'Нужно разместить сайт в интернете' } },
    { id: 'c', label: { uz: "Do'stim ham shu kompyuterga kelishi kerak", ru: 'Друг должен прийти к этому компьютеру' } }
  ];
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); audio.triggerEvent('option_picked'); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 760 }}>{tr({ uz: <>Saytingizni <span className="italic" style={{ color: T.accent }}>butun dunyo</span> ko'ra oladimi?</>, ru: <>Увидит ли <span className="italic" style={{ color: T.accent }}>весь мир</span> ваш сайт?</> })}</h1>
        <Mentor>{tr({ uz: <>Saytingiz tayyor — kompyuteringizda zo'r ishlayapti. Lekin <b style={{ color: T.ink }}>do'stingiz</b> boshqa shahardan uni ocholmayapti. Nega? <b style={{ color: T.ink }}>"Do'stim"</b> tugmasini bosib ko'ring.</>, ru: <>Ваш сайт готов — на вашем компьютере он отлично работает. Но <b style={{ color: T.ink }}>ваш друг</b> из другого города не может его открыть. Почему? Нажмите кнопку <b style={{ color: T.ink }}>«Друг»</b>.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${view === 'me' ? 'chip-on' : ''}`} onClick={() => setView('me')}>💻 {tr({ uz: 'Mening kompyuterim', ru: 'Мой компьютер' })}</button>
              <button className={`chip ${view === 'friend' ? 'chip-on' : ''}`} onClick={() => setView('friend')}>📱 {tr({ uz: "Do'stim", ru: 'Друг' })}</button>
            </div>
            <div className="demo-swap" key={view}>
              {view === 'me' ? (
                <Preview minH={158} title="localhost:5500">
                  <MiniSite name="Aziza" />
                </Preview>
              ) : (
                <Preview minH={158} title="???">
                  <div className="dl-shake" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 8, padding: '14px 0' }}>
                    <span style={{ fontSize: 38 }}>😕</span>
                    <p style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: T.ink, margin: 0, fontSize: 'clamp(15px,2vw,18px)' }}>{tr({ uz: 'Bu sahifa ochilmadi', ru: 'Страница не открылась' })}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", color: T.ink3, margin: 0, fontSize: 12 }}>{tr({ uz: 'ERR — manzil topilmadi', ru: 'ERR — адрес не найден' })}</p>
                  </div>
                </Preview>
              )}
            </div>
            {view === 'friend' && <p className="mono small" style={{ color: T.ink3, marginTop: 2, textAlign: 'center' }}>↑ {tr({ uz: "do'stingizda sayt yo'q — chunki u faqat sizning kompyuteringizda", ru: 'у друга сайта нет — он есть только на вашем компьютере' })}</p>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: "Sizningcha, do'st ham ko'rishi uchun nima qilish kerak?", ru: 'Как вы думаете, что нужно сделать, чтобы сайт увидел и друг?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (
                  <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{tr(o.label)}</span>
                  </button>
                );
              })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>To'g'ri yo'nalish! Saytni internetga <b>joylashtirish</b> — bugun shuni o'rganamiz.</>, ru: <>Верное направление! <b>Разместить</b> сайт в интернете — этому мы сегодня и научимся.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's1', text: `Ishonasizmi — dars oxirida saytingiz internetda, haqiqiy manzil bilan ochiq bo'ladi — masalan, aziza nuqta maktab nuqta uz. Unga 5 ta qadamda yetib boramiz.`, trigger: 'on_mount', waits_for: null }]);
  const STEPS = [
    { text: { uz: 'Hosting nima? — tushunamiz', ru: 'Что такое хостинг? — разберёмся' }, tag: '' },
    { text: { uz: 'Netlify bilan tanishamiz', ru: 'Познакомимся с Netlify' }, tag: 'hosting' },
    { text: { uz: "GitHub'dan kodni ulaymiz", ru: 'Подключим код с GitHub' }, tag: 'repo' },
    { text: { uz: 'Deploy qilamiz — sayt jonlanadi', ru: 'Сделаем деплой — сайт оживёт' }, tag: 'deploy' },
    { text: { uz: 'Maktab poddomeniga ulaymiz', ru: 'Подключим школьный поддомен' }, tag: 'ism.maktab.uz' }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: "Manzil — dars oxirida shunday bo'ladi", ru: 'Адрес — таким он будет в конце урока' })}</p>
      <Preview title="aziza.maktab.uz" minH={210}>
        <MiniSite name="Aziza" />
      </Preview>
      <p className="mono small" style={{ color: T.success, margin: 0 }}><span className="dl-globe">🌍</span> {tr({ uz: 'internetda · har kim ochishi mumkin', ru: 'в интернете · открыть может каждый' })}</p>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: '5 qadam', ru: '5 шагов' })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span>{s.tag && <span className="step-tag">{s.tag}</span>}</span></li>))}
      </ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начнём →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up"><span className="italic" style={{ color: T.accent }}>{tr({ uz: 'Bugun saytni butun dunyoga ochamiz!', ru: 'Сегодня откроем сайт всему миру!' })}</span></h2>
        </div>
        <Mentor>{tr({ uz: <>Ishonasizmi — dars oxirida saytingiz <b style={{ color: T.ink }}>internetda</b>, haqiqiy manzil bilan ochiq bo'ladi — masalan <span className="mono">aziza.maktab.uz</span>. Unga <b style={{ color: T.ink }}>5 ta qadamda</b> yetib boramiz.</>, ru: <>Представляете — в конце урока ваш сайт будет <b style={{ color: T.ink }}>в интернете</b>, с настоящим адресом — например <span className="mono">aziza.maktab.uz</span>. Дойдём до этого за <b style={{ color: T.ink }}>5 шагов</b>.</> })}</Mentor>
        {!isNarrow ? (
          <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable>
        ) : !showSteps ? (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>📋 {tr({ uz: "Bugungi 5 qadamni ko'rish", ru: 'Посмотреть 5 шагов на сегодня' })}</button>
          </div>
        ) : (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>↩ {tr({ uz: "Natijani ko'rish", ru: 'Посмотреть результат' })}</button>
            {StepsBlock}
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — HOSTING NIMA (localhost vs hosting) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's2', text: `Saytingiz hozir faqat sizning kompyuteringizda yashayapti — buni "localhost" deyiladi. Uni hammaga ochish uchun doimo ishlab turadigan boshqa kompyuterga — hosting serveriga qo'yish kerak. Ikkala holatni almashtirib ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  const [mode, setMode] = useState('local');
  const [touched, setTouched] = useState(false);
  const done = touched;
  const pick = (m) => { setMode(m); setTouched(true); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const VISITORS = ['🧑', '👩', '👨', '👵', '🧒', '👧'];
  return (
    <Stage eyebrow={tr({ uz: 'Hosting', ru: 'Хостинг' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Ikkalasini ko'ring", ru: 'Посмотрите оба варианта' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sayt internetda <span className="italic" style={{ color: T.accent }}>qayerda</span> yashaydi?</>, ru: <>Где <span className="italic" style={{ color: T.accent }}>живёт</span> сайт в интернете?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Saytingiz hozir faqat <b style={{ color: T.ink }}>sizning kompyuteringizda</b> yashayapti — buni <span className="mono">localhost</span> deyiladi. Uni hammaga ochish uchun doimo ishlab turadigan boshqa kompyuterga — <b style={{ color: T.ink }}>hosting serveriga</b> qo'yish kerak.</>, ru: <>Сейчас ваш сайт живёт только <b style={{ color: T.ink }}>на вашем компьютере</b> — это называется <span className="mono">localhost</span>. Чтобы открыть его всем, нужно перенести его на другой, постоянно работающий компьютер — <b style={{ color: T.ink }}>хостинг-сервер</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${mode === 'local' ? 'chip-on' : ''}`} onClick={() => pick('local')}>💻 localhost</button>
              <button className={`chip ${mode === 'host' ? 'chip-on' : ''}`} onClick={() => pick('host')}>🌍 {tr({ uz: 'Hosting', ru: 'Хостинг' })}</button>
            </div>
            <div className="demo-swap" key={mode} style={{ background: T.paper, borderRadius: 14, padding: '20px 18px', boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)`, textAlign: 'center' }}>
              {mode === 'local' ? (
                <>
                  <div style={{ fontSize: 40 }}>💻</div>
                  <p style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: T.ink, margin: '8px 0 4px', fontSize: 'clamp(15px,2vw,18px)' }}>{tr({ uz: "Faqat bitta odam ko'radi", ru: 'Видит только один человек' })}</p>
                  <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "Sayt sizning kompyuteringizda. Kompyuter o'chsa — sayt ham yo'q.", ru: 'Сайт на вашем компьютере. Выключили компьютер — сайта нет.' })}</p>
                  <div style={{ marginTop: 12, fontSize: 26 }}>🧑</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 40 }}>🌍</div>
                  <p style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: T.ink, margin: '8px 0 4px', fontSize: 'clamp(15px,2vw,18px)' }}>{tr({ uz: "Butun dunyo ko'radi", ru: 'Видит весь мир' })}</p>
                  <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'Sayt hosting serverida — 24/7 yonib turadi, har kim manzildan ochadi.', ru: 'Сайт на хостинг-сервере — работает 24/7, и каждый открывает его по адресу.' })}</p>
                  <div style={{ marginTop: 12, fontSize: 22, display: 'flex', justifyContent: 'center', gap: 7 }}>{VISITORS.map((v, i) => (<span key={i} className="dl-visitor" style={{ animationDelay: `${i * 0.08}s` }}>{v}</span>))}</div>
                </>
              )}
            </div>
          </Col>
          <Col>
            <div className="frame frame-col fade-up delay-2">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 26 }}>🏠</span>
                <div>
                  <p className="eyebrow" style={{ color: T.accent, margin: '0 0 4px' }}>{tr({ uz: 'Oddiy qilib aytganda', ru: 'Проще говоря' })}</p>
                  <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>Hosting</b> — saytingiz uchun internetda ijaraga olingan <b>doimiy uy</b>. U yerda fayllaringiz turadi va server ularni 24 soat har kimga ko'rsatib beradi.</>, ru: <><b>Хостинг</b> — это <b>постоянный дом</b>, арендованный для вашего сайта в интернете. Там лежат ваши файлы, и сервер показывает их всем 24 часа в сутки.</> })}</p>
                </div>
              </div>
            </div>
            <div className="frame-soft fade-up delay-3"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Esingizdami — Internet darsida <b>server</b> haqida gaplashgandik? Hosting — aynan saytingizni shunday serverga joylashtirishdir.</>, ru: <>Помните — на уроке про интернет мы говорили о <b>сервере</b>? Хостинг — это как раз размещение вашего сайта на таком сервере.</> })}</p></div>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — HOSTING QANDAY ISHLAYDI (oqim) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's3', text: `Saytni hostingga qo'yganingizda nima bo'ladi? Fayllaringiz serverga ko'chiriladi, manzil oladi, va har bir tashrifchi brauzerda o'sha manzilni ochadi. "Boshlash" tugmasini bosib, yo'lni kuzating.`, trigger: 'on_mount', waits_for: { type: 'flow_done' } }]);
  const STEPS = [
    { ic: '📄', h: { uz: 'Fayllaringiz', ru: 'Ваши файлы' }, s: 'index.html, style.css' },
    { ic: '⬆️', h: { uz: 'Serverga yuklanadi', ru: 'Загружаются на сервер' }, s: { uz: 'hosting xotirasiga', ru: 'в память хостинга' } },
    { ic: '🌐', h: { uz: 'Manzil oladi', ru: 'Получает адрес' }, s: { uz: 'masalan: sayt.netlify.app', ru: 'например: sayt.netlify.app' } },
    { ic: '👀', h: { uz: 'Tashrifchi ochadi', ru: 'Посетитель открывает' }, s: { uz: "brauzerda ko'radi", ru: 'видит в браузере' } }
  ];
  const [step, setStep] = useState(storedAnswer ? STEPS.length : 0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const isNarrow = useIsMobile(768);
  const done = step >= STEPS.length;
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current); setStep(0); setRunning(true);
    const tick = (i) => { setStep(i); if (i < STEPS.length) timer.current = setTimeout(() => tick(i + 1), 620); else { setRunning(false); audio.triggerEvent('flow_done'); } };
    timer.current = setTimeout(() => tick(1), 350);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Hosting oqimi', ru: 'Схема хостинга' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Avval oqimni ko'ring", ru: 'Сначала посмотрите схему' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saytni qo'ysangiz — <span className="italic" style={{ color: T.accent }}>nima bo'ladi?</span></>, ru: <>Вы загрузили сайт — <span className="italic" style={{ color: T.accent }}>что дальше?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Saytni hostingga qo'yganingizda: fayllaringiz <b style={{ color: T.ink }}>serverga ko'chiriladi</b>, <b style={{ color: T.ink }}>manzil</b> oladi, va har bir tashrifchi brauzerda o'sha manzilni ochadi. Tugmani bosib, yo'lni kuzating.</>, ru: <>Когда вы кладёте сайт на хостинг: файлы <b style={{ color: T.ink }}>переносятся на сервер</b>, получают <b style={{ color: T.ink }}>адрес</b>, и каждый посетитель открывает этот адрес в браузере. Нажмите кнопку и проследите путь.</> })}</Mentor>
        <Zoomable>
        <div className="frame-col">
        {!isNarrow ? (
          <div className="pz-flow" style={{ justifyContent: 'center', position: 'relative' }}>
            {running && <span className="dl-packet">📄</span>}
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`pz-step ${step > i ? 'on' : ''} ${running && step === i + 1 ? 'active' : ''}`} style={{ minWidth: 104 }}>
                  <span style={{ fontSize: 26 }}>{step > i ? s.ic : '○'}</span>
                  <span className="pz-lbl"><b style={{ color: step > i ? T.ink : T.ink2 }}>{tr(s.h)}</b><br />{tr(s.s)}</span>
                </div>
                {i < STEPS.length - 1 && <span className={`pz-arrow ${step > i + 1 ? 'on' : ''}`}>→</span>}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="pz-flow-v">
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`pz-rowstep ${step > i ? 'on' : ''} ${running && step === i + 1 ? 'active' : ''}`}>
                  <span className="pz-rowic">{step > i ? s.ic : '○'}</span>
                  <span className="pz-rowtxt"><b>{tr(s.h)}</b><span>{tr(s.s)}</span></span>
                  {step > i && <span style={{ marginLeft: 'auto', color: T.success, fontSize: 15 }}>✓</span>}
                </div>
                {i < STEPS.length - 1 && <span className={`pz-varrow ${step > i + 1 ? 'on' : ''}`}>↓</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        <button className="btn" onClick={run} disabled={running} style={{ alignSelf: 'flex-start' }}>{running ? tr({ uz: 'Bajarilmoqda…', ru: 'Выполняется…' }) : (done ? tr({ uz: "↻ Yana ko'rsatish", ru: '↻ Показать ещё раз' }) : tr({ uz: '▶ Boshlash', ru: '▶ Старт' }))}</button>
        </div>
        </Zoomable>
        {done && (
          <div className="frame-success fade-step"><p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ {tr({ uz: 'Mana shu — hosting', ru: 'Вот это и есть хостинг' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Fayllaringiz serverda <b>doimo</b> turadi va manzil orqali ochiladi. Endi kerak — buni qiladigan <b>oson vosita</b>. Mana <b>Netlify</b> kiradi.</>, ru: <>Ваши файлы <b>всегда</b> лежат на сервере и открываются по адресу. Теперь нужен <b>простой инструмент</b>, который всё это сделает. Тут и появляется <b>Netlify</b>.</> })}</p></div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    audioText="Hosting asosan qanday vazifa bajaradi? To'g'ri variantni tanlang."
    questionText="Hosting asosan qanday vazifa bajaradi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Hosting nima qiladi?', ru: 'Что делает хостинг?' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: 'Hosting asosan qanday vazifa bajaradi?', ru: 'Какую основную задачу выполняет хостинг?' })}</h2></>}
    options={[{ uz: 'Saytni internetda doimo ochiq saqlaydi', ru: 'Постоянно держит сайт открытым в интернете' }, { uz: 'Kodni chiroyli ranglar bilan bezaydi', ru: 'Красиво раскрашивает код' }, { uz: 'Saytdagi rasmlarni tahrir qiladi', ru: 'Редактирует картинки на сайте' }, { uz: 'Internet ulanishini tezlashtiradi', ru: 'Ускоряет интернет-соединение' }]} correctIdx={0}
    explainCorrect={{ uz: "To'g'ri! Hosting saytingizni doimo ishlab turadigan serverda saqlaydi — xuddi 24 soat ochiq do'kon kabi: eshigi hech qachon yopilmaydi, istalgan payt har kim kirib ko'radi.", ru: 'Верно! Хостинг хранит ваш сайт на постоянно работающем сервере — как магазин, открытый 24 часа: двери никогда не закрываются, и зайти может каждый в любой момент.' }}
    explainWrong={{ 1: { uz: "Yo'q — kodni bezash CSS ishi. Hosting esa saytni internetda ochiq saqlaydi.", ru: 'Нет — украшать код — работа CSS. А хостинг держит сайт открытым в интернете.' }, 2: { uz: "Yo'q — rasm tahriri boshqa narsa. Hosting saytni serverda joylashtiradi.", ru: 'Нет — редактирование картинок — это другое. Хостинг размещает сайт на сервере.' }, 3: { uz: "Yo'q — hosting internetni tezlashtirmaydi, u saytingizni doimo ochiq saqlaydi.", ru: 'Нет — хостинг не ускоряет интернет, он держит ваш сайт постоянно открытым.' }, default: { uz: 'Hosting saytni internetda doimo ochiq saqlaydi.', ru: 'Хостинг постоянно держит сайт открытым в интернете.' } }} />
);

// ===== SCREEN 5 — NETLIFY NIMA =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's5', text: `Netlify — saytingizni bir necha soniyada va bepul internetga chiqaradigan hosting platformasi. Ikki yo'li bor: papkani sichqoncha bilan tortib tashlash, yoki GitHub'ni ulash. Ikkala usulni bosib ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  const WAYS = {
    drag: { ic: '📁', title: { uz: 'Papkani tortib tashlash', ru: 'Перетащить папку' }, body: { uz: "Sayt papkangizni Netlify oynasiga sichqoncha bilan tortib tashlaysiz — tamom, sayt internetda. Eng tez usul.", ru: 'Просто перетаскиваете папку сайта мышкой в окно Netlify — и всё, сайт в интернете. Самый быстрый способ.' } },
    github: { ic: '🔗', title: { uz: "GitHub'ni ulash", ru: 'Подключить GitHub' }, body: { uz: "Netlify GitHub repongizni kuzatadi. Siz push qilgan har bir o'zgarish avtomatik internetga chiqadi. Biz shu usulni o'rganamiz.", ru: 'Netlify следит за вашим репозиторием GitHub. Каждое запушенное изменение автоматически попадает в интернет. Именно этот способ мы и изучим.' } }
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 2;
  const tap = (k) => { setActive(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow="Netlify" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `${seen.size}/2 usulni ko'ring`, ru: `Посмотрите оба способа (${seen.size}/2)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saytni <span className="italic" style={{ color: T.accent }}>bir necha soniyada</span> chiqaramiz</>, ru: <>Опубликуем сайт <span className="italic" style={{ color: T.accent }}>за несколько секунд</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Netlify — saytingizni <b style={{ color: T.ink }}>bepul</b> va tez internetga chiqaradigan hosting platformasi. Ikki yo'li bor — ikkalasini bosib ko'ring.</>, ru: <>Netlify — хостинг-платформа, которая <b style={{ color: T.ink }}>бесплатно</b> и быстро выводит сайт в интернет. Есть два пути — нажмите на оба.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="bp-window fade-up delay-1">
              <div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">app.netlify.com</span></div>
              <div className="bp-body" style={{ background: '#0e1726', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 150 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: '#00C7B7', color: '#0e1726', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontFamily: "'Manrope',sans-serif", fontSize: 14 }}>N</span>
                  <span style={{ color: '#fff', fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 15 }}>Netlify</span>
                  <span style={{ marginLeft: 'auto', color: '#7DD181', fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>● {tr({ uz: 'bepul', ru: 'бесплатно' })}</span>
                </div>
                {Object.keys(WAYS).map(k => (
                  <button key={k} onClick={() => tap(k)} style={{ textAlign: 'left', cursor: 'pointer', border: active === k ? `1.5px solid #00C7B7` : '1.5px solid #2a3a52', background: active === k ? 'rgba(0,199,183,0.12)' : 'transparent', borderRadius: 10, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.18s' }}>
                    <span style={{ fontSize: 22 }}>{WAYS[k].ic}</span>
                    <span style={{ color: '#E8E5DD', fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13.5 }}>{tr(WAYS[k].title)}</span>
                    {seen.has(k) && <span style={{ marginLeft: 'auto', color: '#7DD181', fontSize: 13 }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </Col>
          <Col>
            {active ? (
              <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span className="dl-pop" style={{ fontSize: 24 }}>{WAYS[active].ic}</span><span className="sk-wordbadge">{tr(WAYS[active].title)}</span></span>
                <p className="body" style={{ color: T.ink, margin: '11px 0 0' }}>{tr(WAYS[active].body)}</p>
              </div>
            ) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Chapdan bir usulni bosing', ru: 'Нажмите на один из способов слева' })}</p></div> : null)}
            {done && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Biz <b>GitHub'ni ulash</b> usulidan foydalanamiz — chunki Git darsida kodimizni allaqachon GitHub'ga qo'ygan edik.</>, ru: <>Мы будем использовать способ <b>«Подключить GitHub»</b> — на уроке Git мы уже загрузили туда свой код.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5b — TEST 2 =====
const Screen5b = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv', ru: 'Проверка' })}
    audioText="Netlify nima?"
    questionText="Netlify nima?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Mustahkamlash', ru: 'Закрепление' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: 'Netlify nima?', ru: 'Что такое Netlify?' })}</h2></>}
    options={[{ uz: "Saytni ko'rsatadigan brauzer dasturi", ru: 'Браузер — программа для просмотра сайтов' }, { uz: "Onlayn o'ynaladigan qiziqarli o'yin", ru: 'Увлекательная онлайн-игра' }, { uz: 'Saytlarni joylaydigan hosting platformasi', ru: 'Хостинг-платформа для размещения сайтов' }, { uz: 'Saytning internetdagi domen manzili', ru: 'Доменный адрес сайта в интернете' }]} correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! Netlify — saytlarni bepul va tez internetga chiqaradigan hosting platformasi.", ru: 'Верно! Netlify — хостинг-платформа, которая бесплатно и быстро публикует сайты в интернете.' }}
    explainWrong={{
      0: { uz: "Brauzer — saytni ko'rsatadigan dastur (Chrome). Netlify esa saytni joylaydigan hosting.", ru: 'Браузер — программа, которая показывает сайт (Chrome). А Netlify — хостинг, который его размещает.' },
      1: { uz: "Yo'q — Netlify o'yin emas, u hosting platformasi.", ru: 'Нет — Netlify не игра, это хостинг-платформа.' },
      3: { uz: 'Domen — saytning manzili (maktab.uz). Netlify esa saytni joylaydigan platforma.', ru: 'Домен — адрес сайта (maktab.uz). А Netlify — платформа, которая размещает сайт.' },
      default: { uz: 'Netlify — saytlarni joylaydigan bepul hosting platformasi.', ru: 'Netlify — бесплатная хостинг-платформа для размещения сайтов.' }
    }} />
);

// ===== SCREEN 6 — GITHUB'NI ULASH =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's6', text: `Netlify kodingizni qayerdan oladi? GitHub'dan. Git darsida push qilgan repongizni tanlaysiz va ulaysiz — shundan keyin Netlify uni doimo kuzatib turadi. Repongizni tanlab, "Ulash" tugmasini bosing.`, trigger: 'on_mount', waits_for: { type: 'connected' } }]);
  const REPOS = ['mening-saytim', 'maktab-loyiha', 'portfolio'];
  const [repo, setRepo] = useState(storedAnswer ? 'mening-saytim' : null);
  const [connected, setConnected] = useState(!!storedAnswer);
  const done = connected;
  const connect = () => { if (!repo) return; setConnected(true); audio.triggerEvent('connected'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(`Ulandi! Endi Netlify shu reponi kuzatadi.`); }, 300); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'GitHub ulash', ru: 'Подключение GitHub' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Reponi ulang', ru: 'Подключите репозиторий' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Netlify kodni <span className="italic" style={{ color: T.accent }}>qayerdan</span> oladi?</>, ru: <>Откуда Netlify <span className="italic" style={{ color: T.accent }}>берёт</span> код?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Netlify kodingizni <b style={{ color: T.ink }}>GitHub'dan</b> oladi. Git darsida push qilgan repongizni tanlaysiz — shundan keyin Netlify uni doimo kuzatib turadi.</>, ru: <>Netlify берёт ваш код <b style={{ color: T.ink }}>с GitHub</b>. Вы выбираете репозиторий, который запушили на уроке Git, — и дальше Netlify постоянно за ним следит.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'GitHub repolaringiz', ru: 'Ваши репозитории GitHub' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {REPOS.map(r => (
                <button key={r} onClick={() => !connected && setRepo(r)} disabled={connected} style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', cursor: connected ? 'default' : 'pointer', border: 'none', borderRadius: 12, padding: '12px 15px', background: T.paper, color: T.ink, boxShadow: repo === r ? `inset 0 0 0 2px ${T.accent}, 0 6px 16px -6px rgba(255,79,40,0.25)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 500, transition: 'all 0.18s' }}>
                  <span style={{ fontSize: 17 }}>📦</span>
                  <span>{r}</span>
                  {repo === r && <span style={{ marginLeft: 'auto', color: T.accent, fontSize: 16 }}>●</span>}
                </button>
              ))}
            </div>
            {!connected && <button className="btn" onClick={connect} disabled={!repo} style={{ alignSelf: 'flex-start', marginTop: 4 }}>🔗 {tr({ uz: "Netlify'ga ulash", ru: 'Подключить к Netlify' })}</button>}
          </Col>
          <Col>
            {connected ? (
              <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="dl-linkwrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, background: T.paper, borderRadius: 14, padding: '18px 14px', boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)` }}>
                  <span className="dl-link-dot" />
                  <div style={{ textAlign: 'center' }}><div style={{ height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GitHubMark size={30} /></div><span className="mono small" style={{ color: T.ink2, marginTop: 4, display: 'block' }}>GitHub</span></div>
                  <span style={{ color: T.success, fontSize: 20 }}>🔗</span>
                  <div style={{ textAlign: 'center' }}><div style={{ height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🌍</div><span className="mono small" style={{ color: T.ink2, marginTop: 4, display: 'block' }}>Netlify</span></div>
                </div>
                <div className="frame-success"><p className="small mono" style={{ margin: '0 0 4px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ {tr({ uz: 'Ulandi', ru: 'Подключено' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b className="mono">{repo}</b> reposi Netlify'ga ulandi. Endi push qilingan kod avtomatik internetga chiqadi.</>, ru: <>Репозиторий <b className="mono">{repo}</b> подключён к Netlify. Теперь запушенный код автоматически попадает в интернет.</> })}</p></div>
              </div>
            ) : (
              <div className="frame-soft"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>Eslatma:</b> kodingiz GitHub'da turibdi (Git darsidan). Netlify uni o'sha yerdan o'qiydi — qayta yuklash shart emas.</>, ru: <><b>Напоминание:</b> ваш код уже лежит на GitHub (с урока Git). Netlify читает его прямо оттуда — заново загружать не нужно.</> })}</p></div>
            )}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — DEPLOY QILISH =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's7', text: `Endi eng zo'r lahza — deploy. Deploy degani: fayllaringizni serverga joylab, saytni internetda ochiq qilish. "Deploy" tugmasini bosing va kuzating.`, trigger: 'on_mount', waits_for: { type: 'deployed' } }]);
  const [phase, setPhase] = useState(storedAnswer ? 'live' : 'idle'); // idle | building | live
  const timer = useRef(null);
  const done = phase === 'live';
  useEffect(() => () => clearTimeout(timer.current), []);
  const deploy = () => {
    setPhase('building');
    timer.current = setTimeout(() => { setPhase('live'); audio.triggerEvent('deployed'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(`Tayyor! Saytingiz internetda — manzilni do'stingizga yuborsangiz, ochib ko'radi.`); }, 300); }, 1600);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Deploy', ru: 'Деплой' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Saytni deploy qiling', ru: 'Задеплойте сайт' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sayt qanday <span className="italic" style={{ color: T.accent }}>jonlanadi?</span></>, ru: <>Как сайт <span className="italic" style={{ color: T.accent }}>оживает?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: T.ink }}>Deploy</b> — fayllaringizni serverga joylab, saytni internetda ochiq qilish. Tugmani bosing va kuzating.</>, ru: <><b style={{ color: T.ink }}>Деплой</b> — разместить файлы на сервере и открыть сайт в интернете. Нажмите кнопку и наблюдайте.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="bp-window fade-up delay-1">
              <div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">app.netlify.com</span></div>
              <div className="bp-body" style={{ minHeight: 150, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {phase === 'idle' && (<>
                  <span style={{ fontSize: 40 }}>🚀</span>
                  <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'Sayt deploy qilishga tayyor.', ru: 'Сайт готов к деплою.' })}</p>
                  <button className="btn" onClick={deploy}>🚀 {tr({ uz: 'Deploy qilish', ru: 'Задеплоить' })}</button>
                </>)}
                {phase === 'building' && (<>
                  <span className="dl-launch" style={{ fontSize: 38 }}>🚀</span>
                  <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Building… fayllar serverga yuklanyapti', ru: 'Building… файлы загружаются на сервер' })}</p>
                  <p className="mono small" style={{ color: T.ink3, margin: 0 }}>index.html · style.css</p>
                </>)}
                {phase === 'live' && (<>
                  <span className="dl-pop" style={{ fontSize: 40 }}>✅</span>
                  <p style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: T.success, margin: 0, fontSize: 'clamp(16px,2.2vw,19px)' }}>{tr({ uz: 'Published! Sayt internetda', ru: 'Published! Сайт в интернете' })}</p>
                  <span className="mono" style={{ fontSize: 13, color: T.link, textDecoration: 'underline' }}>mening-saytim.netlify.app</span>
                </>)}
              </div>
            </div>
          </Col>
          <Col>
            {done ? (
              <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p className="flow-label">{tr({ uz: 'Endi sayt shu manzilda ochiladi', ru: 'Теперь сайт открывается по этому адресу' })}</p>
                <Preview title="mening-saytim.netlify.app" minH={150}><MiniSite name="Aziza" /></Preview>
                <div className="frame-success"><p className="body" style={{ margin: 0, color: T.ink }}>✓ {tr({ uz: "Bu manzilni istalgan odamga yuborsangiz — u brauzerda ochib, saytingizni ko'radi.", ru: 'Отправьте этот адрес кому угодно — человек откроет его в браузере и увидит ваш сайт.' })}</p></div>
              </div>
            ) : (
              <div className="frame-soft"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Netlify avtomatik manzil beradi: <span className="mono">tasodifiy-nom.netlify.app</span>. Keyinroq uni <b>maktab poddomeniga</b> almashtiramiz.</>, ru: <>Netlify выдаёт автоматический адрес: <span className="mono">tasodifiy-nom.netlify.app</span>. Позже мы заменим его на <b>школьный поддомен</b>.</> })}</p></div>
            )}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — AVTO-DEPLOY (push -> auto) =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's8', text: `Eng qulay qismi: kodni o'zgartirib GitHub'ga push qilsangiz, Netlify GitHub'ni kuzatib turgani uchun o'zgarishni darrov sezadi va saytni avtomatik yangilaydi. Sinab ko'ring: sarlavhani o'zgartiring, keyin "push" qiling.`, trigger: 'on_mount', waits_for: { type: 'pushed' } }]);
  const [text, setText] = useState(() => tr({ uz: 'Salom, men Aziza!', ru: 'Привет, я Aziza!' }));
  const [live, setLive] = useState(() => tr({ uz: 'Salom, men Aziza!', ru: 'Привет, я Aziza!' }));
  const [phase, setPhase] = useState('idle'); // idle | deploying
  const [pushed, setPushed] = useState(!!storedAnswer);
  const timer = useRef(null);
  const dirty = text.trim() !== live.trim() && text.trim().length > 0;
  const done = pushed;
  useEffect(() => () => clearTimeout(timer.current), []);
  const push = () => {
    if (!dirty || phase === 'deploying') return;
    setPhase('deploying');
    timer.current = setTimeout(() => { setLive(text.trim()); setPhase('idle'); setPushed(true); audio.triggerEvent('pushed'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(`Ko'rdingizmi! Push qildingiz — Netlify o'zi qayta deploy qildi. Sayt yangilandi.`); }, 300); }, 1400);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Avto-deploy', ru: 'Авто-деплой' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "O'zgartirib push qiling", ru: 'Измените и запушьте' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kodni o'zgartirsangiz <span className="italic" style={{ color: T.accent }}>nima bo'ladi?</span></>, ru: <>Что будет, если <span className="italic" style={{ color: T.accent }}>изменить код?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Eng qulay qismi: kodni o'zgartirib GitHub'ga <b style={{ color: T.ink }}>push</b> qilsangiz, Netlify GitHub'ni kuzatib turgani uchun o'zgarishni sezadi va saytni <b style={{ color: T.ink }}>avtomatik</b> yangilaydi. Sinab ko'ring.</>, ru: <>Самое удобное: если изменить код и сделать <b style={{ color: T.ink }}>push</b> на GitHub, Netlify заметит изменение (он же следит за GitHub) и <b style={{ color: T.ink }}>автоматически</b> обновит сайт. Попробуйте.</> })}</Mentor>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Kod (sarlavhani o'zgartiring)", ru: 'Код (измените заголовок)' })}</p>
            <div className="fade-up delay-1" style={{ background: CODE.bg, borderRadius: 12, padding: '13px 14px', boxShadow: `0 8px 22px -6px rgba(${T.shadowBase},0.2)`, fontFamily: "'JetBrains Mono',monospace", fontSize: 13.5 }}>
              <span style={{ color: CODE.tag }}>{'<h1>'}</span>
              <input value={text} onChange={e => setText(e.target.value)} maxLength={30} spellCheck={false} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 6, color: CODE.text, fontFamily: "'JetBrains Mono',monospace", fontSize: 13.5, padding: '3px 7px', margin: '0 3px', width: 'min(60%, 200px)', outline: 'none' }} />
              <span style={{ color: CODE.tag }}>{'</h1>'}</span>
            </div>
            <button className="btn" onClick={push} disabled={!dirty || phase === 'deploying'} style={{ alignSelf: 'flex-start' }}>{phase === 'deploying' ? 'Deploying…' : '⬆️ git push'}</button>
            {dirty && phase === 'idle' && <p className="mono small" style={{ color: T.accent, margin: 0 }}>● {tr({ uz: "o'zgarish push qilinmagan", ru: 'изменение не запушено' })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Internetdagi sayt', ru: 'Сайт в интернете' })} {phase === 'deploying' && <span style={{ color: T.accent }}>· {tr({ uz: 'yangilanyapti…', ru: 'обновляется…' })}</span>}</p>
            <div style={{ position: 'relative' }}>
              <Preview title="mening-saytim.netlify.app" minH={130}>
                <div key={live} className="fade-step"><MiniSite name={live.replace(/^(?:Salom,?\s*men|Привет,?\s*я)\s*/i, '').replace(/!$/, '') || live} /></div>
              </Preview>
              {phase === 'deploying' && <div style={{ position: 'absolute', inset: 0, top: 32, background: 'rgba(246,244,239,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0 0 13px 13px' }}><div style={{ width: 28, height: 28, border: `3px solid ${T.accentSoft}`, borderTopColor: T.accent, borderRadius: '50%', animation: 'dl-spin 0.8s linear infinite' }} /></div>}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ <b>Continuous deployment</b>: push qilsangiz — sayt o'zi yangilanadi. Qo'lda hech narsa qilish shart emas!</>, ru: <>✓ <b>Continuous deployment</b>: сделали push — сайт обновился сам. Вручную ничего делать не нужно!</> })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEST 3 =====
const Screen9 = (props) => (
  <QuestionScreen {...props} idx={9} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    audioText="Saytni deploy qilgandan keyin uni kim ko'ra oladi?"
    questionText="Saytni deploy qilgandan keyin uni kim ko'ra oladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: "Saytni deploy qilgandan keyin uni kim ko'ra oladi?", ru: 'Кто сможет увидеть сайт после деплоя?' })}</h2></>}
    options={[{ uz: "Faqat men — o'z kompyuterimda", ru: 'Только я — на своём компьютере' }, { uz: 'Internetdagi har kim (manzil orqali)', ru: 'Любой в интернете (по адресу)' }, { uz: "Bu saytni endi hech kim ko'rmaydi", ru: 'Теперь этот сайт никто не увидит' }, { uz: 'Faqat GitHub kompaniyasi xodimlari', ru: 'Только сотрудники компании GitHub' }]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! Deploy qilingach sayt internetda ochiq bo'ladi — manzilni bilgan har bir kishi uni ochib ko'radi.", ru: 'Верно! После деплоя сайт открыт в интернете — каждый, кто знает адрес, сможет его открыть.' }}
    explainWrong={{ 0: { uz: "Yo'q — bu localhost edi. Deploy qilingach sayt hamma uchun ochiq.", ru: 'Нет — так было на localhost. После деплоя сайт открыт для всех.' }, 2: { uz: "Yo'q — aksincha, deploy saytni hammaga ochib beradi.", ru: 'Нет — наоборот, деплой открывает сайт всем.' }, 3: { uz: "Yo'q — manzilni bilgan istalgan odam ko'radi, faqat GitHub emas.", ru: 'Нет — сайт увидит любой, кто знает адрес, а не только GitHub.' }, default: { uz: "Deploy qilingach saytni manzil orqali har kim ko'radi.", ru: 'После деплоя сайт по адресу увидит каждый.' } }} />
);

// ===== SCREEN 10 — PODDOMEN NIMA =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's10', text: `Netlify bergan manzil chiroyli emas — tasodifiy-nom nuqta netlify nuqta app. Maktabimizning o'z domeni bor: maktab nuqta uz. Har bir o'quvchiga uning oldidan o'z nomi qo'shiladi — bu poddomen. Masalan aziza nuqta maktab nuqta uz. Ismni bosib ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  const NAMES = ['aziza', 'ali', 'dilnoza'];
  const [pick, setPick] = useState(null);
  const [touched, setTouched] = useState(false);
  const done = touched;
  const choose = (n) => { setPick(n); setTouched(true); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Poddomen', ru: 'Поддомен' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Ismni bosing', ru: 'Нажмите на имя' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Maktabning <span className="italic" style={{ color: T.accent }}>poddomeni</span> nima?</>, ru: <>Что такое школьный <span className="italic" style={{ color: T.accent }}>поддомен</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Maktabimizning o'z domeni bor: <span className="mono">maktab.uz</span>. Har bir o'quvchiga uning oldidan o'z nomi qo'shiladi — bu <b style={{ color: T.ink }}>poddomen</b>. Masalan <span className="mono">aziza.maktab.uz</span>. Ismni bosib ko'ring.</>, ru: <>У нашей школы есть свой домен: <span className="mono">maktab.uz</span>. Каждому ученику перед ним добавляется его имя — это <b style={{ color: T.ink }}>поддомен</b>. Например <span className="mono">aziza.maktab.uz</span>. Нажмите на имя.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Bitta domen — ko'p poddomen", ru: 'Один домен — много поддоменов' })}</p>
            <div className="fade-up delay-1" style={{ background: T.paper, borderRadius: 14, padding: '18px 16px', boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)` }}>
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <span style={{ display: 'inline-block', background: T.ink, color: T.bg, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 15, padding: '8px 16px', borderRadius: 10 }}>🏫 maktab.uz</span>
                <p className="mono small" style={{ color: T.ink3, margin: '5px 0 0' }}>{tr({ uz: 'domen (asosiy manzil)', ru: 'домен (основной адрес)' })}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                {NAMES.map(n => (
                  <button key={n} onClick={() => choose(n)} style={{ cursor: 'pointer', border: 'none', borderRadius: 9, padding: '8px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, fontWeight: 600, background: pick === n ? T.accent : T.bg, color: pick === n ? '#fff' : T.ink, boxShadow: pick === n ? '0 6px 16px -5px rgba(255,79,40,0.4)' : 'none', transition: 'all 0.18s' }}>{n}.maktab.uz</button>
                ))}
              </div>
              <p className="mono small" style={{ color: T.ink3, margin: '8px 0 0', textAlign: 'center' }}>↑ {tr({ uz: "poddomenlar (har o'quvchiga bittadan)", ru: 'поддомены (по одному на ученика)' })}</p>
            </div>
          </Col>
          <Col>
            {pick ? (
              <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="sk-info">
                  <p className="flow-label" style={{ marginBottom: 8 }}>{tr({ uz: 'Manzilning qismlari', ru: 'Части адреса' })}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(15px,2.2vw,19px)' }}>
                    <span key={pick} className="dl-assemble" style={{ background: T.accentSoft, color: T.accent, padding: '4px 8px', borderRadius: 6, fontWeight: 700 }}>{pick}</span>
                    <span style={{ color: T.ink3 }}>.</span>
                    <span style={{ background: T.bg, color: T.ink, padding: '4px 8px', borderRadius: 6, fontWeight: 700, boxShadow: `inset 0 0 0 1px ${T.ink3}55` }}>maktab.uz</span>
                  </div>
                  <p className="body" style={{ margin: '11px 0 0', color: T.ink }}>{tr({ uz: <><b style={{ color: T.accent }}>{pick}</b> — sizning nomingiz (poddomen), <b>maktab.uz</b> — maktab domeni. Birga — sizning shaxsiy manzilingiz.</>, ru: <><b style={{ color: T.accent }}>{pick}</b> — ваше имя (поддомен), <b>maktab.uz</b> — домен школы. Вместе — ваш личный адрес.</> })}</p>
                </div>
                <Preview title={`${pick}.maktab.uz`} minH={110}><MiniSite name={pick.charAt(0).toUpperCase() + pick.slice(1)} /></Preview>
              </div>
            ) : (
              <div className="frame-soft"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bitta maktab domeni ostida <b>yuzlab o'quvchi</b> o'z saytiga ega bo'ladi — har biri o'z poddomeni bilan. Tartibli va chiroyli!</>, ru: <>Под одним школьным доменом <b>сотни учеников</b> получают свой сайт — у каждого свой поддомен. Аккуратно и красиво!</> })}</p></div>
            )}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — PODDOMENGA ULASH =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's11', text: `Endi saytingizni maktab poddomeniga ulaymiz. Netlify'da "Add custom domain" bo'limiga ismingizni yozasiz — manzilingiz tayyor bo'ladi. Pastga ismingizni yozing.`, trigger: 'on_mount', waits_for: null }]);
  const [name, setName] = useState(storedAnswer?.name || '');
  const clean = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  const done = clean.length >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, name: clean }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Poddomenga ulash', ru: 'Подключение поддомена' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Ismingizni yozing', ru: 'Введите своё имя' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saytni <span className="italic" style={{ color: T.accent }}>maktab poddomeniga</span> ulaymiz</>, ru: <>Подключим сайт к <span className="italic" style={{ color: T.accent }}>школьному поддомену</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Netlify'da <b style={{ color: T.ink }}>"Add custom domain"</b> bo'limiga ismingizni yozasiz, maktab administratori uni tasdiqlaydi — va manzilingiz tayyor. Pastga ismingizni yozing.</>, ru: <>В Netlify в разделе <b style={{ color: T.ink }}>"Add custom domain"</b> вы вводите своё имя, администратор школы подтверждает его — и адрес готов. Введите своё имя ниже.</> })}</Mentor>
        <div className="split">
          <Col>
            <p className="flow-label">Netlify · Add custom domain</p>
            <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 2, background: T.paper, borderRadius: 12, padding: '6px 8px', boxShadow: `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, fontFamily: "'JetBrains Mono',monospace" }}>
              <input value={name} onChange={e => setName(e.target.value)} maxLength={16} placeholder={tr({ uz: 'ismingiz', ru: 'vashe-imya' })} spellCheck={false} autoCapitalize="off" autoCorrect="off" style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(14px,2vw,17px)', fontWeight: 700, color: T.accent, padding: '8px 6px' }} />
              <span style={{ color: T.ink2, fontSize: 'clamp(14px,2vw,17px)', fontWeight: 700, whiteSpace: 'nowrap' }}>.maktab.uz</span>
            </div>
            <div className="fade-up delay-2" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="tagpill" style={{ opacity: clean.length >= 2 ? 1 : 0.4 }}>{clean.length >= 2 ? '✓' : '1'} {tr({ uz: 'ismingiz', ru: 'ваше имя' })}</span>
              <span className="tagpill" style={{ opacity: clean.length >= 2 ? 1 : 0.4 }}>{clean.length >= 2 ? '✓' : '2'} {tr({ uz: ".maktab.uz qo'shiladi", ru: '.maktab.uz добавится' })}</span>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>✓ {tr({ uz: 'Tayyor! Sizning manzilingiz:', ru: 'Готово! Ваш адрес:' })} <b className="mono">{clean}.maktab.uz</b></p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija', ru: 'результат' })}</p>
            <Preview title={done ? `${clean}.maktab.uz` : tr({ uz: 'manzil...', ru: 'адрес...' })} minH={140}>
              {done ? <MiniSite name={clean.charAt(0).toUpperCase() + clean.slice(1)} /> : <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: "Ismingizni yozing — manzilingiz shu yerda paydo bo'ladi", ru: 'Введите имя — здесь появится ваш адрес' })}</p>}
            </Preview>
            {done && <p className="mono small" style={{ color: T.success, margin: 0 }}>🌍 {tr({ uz: "endi do'stlaringiz shu manzildan ochadi", ru: 'теперь друзья откроют сайт по этому адресу' })}</p>}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TEST 4 =====
const Screen12 = (props) => (
  <QuestionScreen {...props} idx={12} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    audioText="aziza nuqta maktab nuqta uz — bu nima?"
    questionText="aziza.maktab.uz — bu nima?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}><span className="mono" style={{ fontSize: '0.85em' }}>aziza.maktab.uz</span> — {tr({ uz: 'bu nima?', ru: 'что это?' })}</h2></>}
    options={[{ uz: 'Boshqa mustaqil sayt (domen)', ru: 'Другой независимый сайт (домен)' }, { uz: 'Saytga kirish uchun maxfiy parol', ru: 'Секретный пароль для входа на сайт' }, { uz: 'Kompyuterdagi bir fayl nomi', ru: 'Имя файла на компьютере' }, { uz: 'maktab.uz domenining poddomeni', ru: 'Поддомен домена maktab.uz' }]} correctIdx={3}
    explainCorrect={{ uz: "To'g'ri! aziza.maktab.uz — bu maktab.uz domenining poddomeni. Asosiy domen oldiga qo'shilgan shaxsiy nom.", ru: 'Верно! aziza.maktab.uz — это поддомен домена maktab.uz: личное имя, добавленное перед основным доменом.' }}
    explainWrong={{
      0: { uz: "Yo'q — bu mustaqil domen emas, u maktab.uz ichidagi poddomen.", ru: 'Нет — это не отдельный домен, а поддомен внутри maktab.uz.' },
      1: { uz: "Yo'q — bu parol emas, bu saytning manzili (poddomen).", ru: 'Нет — это не пароль, это адрес сайта (поддомен).' },
      2: { uz: "Yo'q — bu fayl emas, bu internet manzili — maktab.uz poddomeni.", ru: 'Нет — это не файл, это интернет-адрес — поддомен maktab.uz.' },
      default: { uz: 'aziza.maktab.uz — maktab.uz domenining poddomeni.', ru: 'aziza.maktab.uz — поддомен домена maktab.uz.' }
    }} />
);

// ===== SCREEN 13 — AMALIYOT: TO'LIQ DEPLOY OQIMI =====
// ===== SCREEN 13 — 🚀 UCHIRISH MARKAZI (Mission Control gate) =====
// Ijodkor brifi: bosqichlar aniq TARTIBDA yonadi (hold→go). Navbatdan oldingi bosqich
// bosilsa — uchirish TO'XTAYDI (abortReason + dl-shake). Hamma go bo'lsa → launchArmed →
// «UCHIRISH» → countdown (3→2→1) → liftoff → worldwide. onAnswer(correct) FAQAT worldwide'da.
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's13', text: `Endi saytni o'zingiz uchirasiz. Uchirish markazida to'rt bosqich bor va ular aniq tartibda yonishi kerak: git push, Netlify'ga ulash, deploy, va manzil. Navbatni buzsangiz — uchirish to'xtaydi. Hammasi tayyor bo'lganda, katta UCHIRISH tugmasini bosing.`, trigger: 'on_mount', waits_for: null }]);
  const STAGES = [
    { ic: '⬆️', label: 'git push', sub: { uz: "kodni GitHub'ga yuborish", ru: 'отправить код на GitHub' }, log: { uz: "$ git push  →  kod GitHub'da ✓", ru: '$ git push  →  код на GitHub ✓' } },
    { ic: '🔗', label: { uz: "Netlify'ga ulash", ru: 'Подключить Netlify' }, sub: 'repo → Netlify', log: { uz: 'Netlify  ←  mening-saytim repo ulandi ✓', ru: 'Netlify  ←  репо mening-saytim подключён ✓' } },
    { ic: '🚀', label: { uz: 'Deploy', ru: 'Деплой' }, sub: { uz: 'saytni chiqarish', ru: 'опубликовать сайт' }, log: 'Building… ✓ Published — netlify.app' },
    { ic: '🌍', label: { uz: 'Manzil (poddomen)', ru: 'Адрес (поддомен)' }, sub: 'aziza.maktab.uz', log: 'Custom domain  →  aziza.maktab.uz ✓' },
  ];
  // Har bosqich navbatidan oldin bosilsa — nega uchirib bo'lmasligining HAQIQIY deploy sababi (armed = yetishmayotgan bosqich)
  const ABORT_REASONS = [
    { uz: "raketaga yuklaydigan kod hali yo'q — avval kodni GitHub'ga push qiling", ru: 'кода для загрузки в ракету ещё нет — сначала запушьте код на GitHub' },
    { uz: "Netlify kodni qayerdan olishini hali bilmaydi — avval repongizni ulang", ru: 'Netlify ещё не знает, откуда брать код — сначала подключите репозиторий' },
    { uz: "server hali bo'sh — internetga chiqariladigan sayt yo'q, avval deploy qiling", ru: 'сервер пока пуст — публиковать нечего, сначала сделайте деплой' },
    { uz: "saytni topib bo'lmaydi — unga hali manzil (poddomen) berilmagan", ru: 'сайт невозможно найти — у него ещё нет адреса (поддомена)' },
  ];
  const N = STAGES.length;
  const preDone = !!storedAnswer;
  const [armed, setArmed] = useState(preDone ? N : 0);              // navbatda tasdiqlangan bosqichlar soni
  const [phase, setPhase] = useState(preDone ? 'worldwide' : 'arm'); // arm | countdown | liftoff | worldwide
  const [abort, setAbort] = useState(null);                         // { idx, k } — navbatdan oldin bosildi
  const [count, setCount] = useState(3);
  const launchArmed = armed >= N;                                   // hamma bosqich GO

  const press = (i) => {
    if (phase !== 'arm') return;
    if (i === armed) { setAbort(null); setArmed(a => a + 1); }       // navbatdagi bosqich → GO
    else if (i > armed) setAbort({ idx: i, k: Date.now() });         // navbatdan oldin → HOLD/abort
  };
  const launch = () => { if (launchArmed && phase === 'arm') setPhase('countdown'); };

  // countdown 3 → 2 → 1 → liftoff
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count > 1) { const t = setTimeout(() => setCount(c => c - 1), 850); return () => clearTimeout(t); }
    const t = setTimeout(() => setPhase('liftoff'), 850);
    return () => clearTimeout(t);
  }, [phase, count]);
  // liftoff → worldwide
  useEffect(() => {
    if (phase !== 'liftoff') return;
    const t = setTimeout(() => setPhase('worldwide'), 1500);
    return () => clearTimeout(t);
  }, [phase]);
  // 🏅/ball: FAQAT worldwide'da to'g'ri deb belgilanadi
  useEffect(() => {
    if (phase === 'worldwide' && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true });
  }, [phase]); // eslint-disable-line

  const worldwide = phase === 'worldwide';
  const navLabel = worldwide ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : phase === 'countdown' ? `T-${count}…`
    : phase === 'liftoff' ? tr({ uz: 'Uchmoqda…', ru: 'Летим…' })
    : launchArmed ? tr({ uz: 'UCHIRING 🚀', ru: 'ЗАПУСКАЙТЕ 🚀' }) : `${armed}/${N} ${tr({ uz: 'tayyor', ru: 'готово' })}`;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · uchirish markazi', ru: 'Практика · центр управления' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!worldwide} label={navLabel} onClick={onNext} /></>}>
      {worldwide && <Confetti />}
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Uchirish markazi — <span className="italic" style={{ color: T.accent }}>saytni uchiring</span></>, ru: <>Центр управления — <span className="italic" style={{ color: T.accent }}>запустите сайт</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>To'rt bosqichni aniq <b style={{ color: T.ink }}>tartibda</b> yoqing: push → ulash → deploy → manzil. <b style={{ color: T.ink }}>Navbatni buzsangiz</b> — uchirish to'xtaydi. Hammasi <b style={{ color: T.success }}>GO</b> bo'lgach, katta <b style={{ color: T.accent }}>UCHIRISH</b> tugmasini bosing.</>, ru: <>Включите четыре этапа строго <b style={{ color: T.ink }}>по порядку</b>: push → подключение → деплой → адрес. <b style={{ color: T.ink }}>Нарушите очередь</b> — запуск остановится. Когда всё будет <b style={{ color: T.success }}>GO</b>, нажмите большую кнопку <b style={{ color: T.accent }}>ЗАПУСК</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Uchirish ketma-ketligi', ru: 'Последовательность запуска' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {STAGES.map((s, i) => {
                const go = i < armed;
                const nextUp = phase === 'arm' && i === armed;
                const badAbort = abort && abort.idx === i && phase === 'arm';
                const stat = go ? 'GO' : nextUp ? tr({ uz: 'bosing →', ru: 'нажмите →' }) : 'HOLD';
                const statCol = go ? T.success : nextUp ? T.accent : T.ink3;
                return (
                  <button key={i} onClick={() => press(i)} disabled={phase !== 'arm' || go}
                    className={`${nextUp ? 'dl-tap' : ''} ${badAbort ? 'dl-shake' : ''}`.trim()}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: nextUp ? 'pointer' : 'default', border: 'none', borderRadius: 12, padding: '12px 15px', background: go ? T.successSoft : (nextUp ? T.paper : T.bg), boxShadow: nextUp ? `0 8px 20px -6px rgba(255,79,40,0.28), inset 0 0 0 1.5px ${T.accent}` : (badAbort ? `inset 0 0 0 1.5px ${T.accent}` : 'none'), opacity: go || nextUp || phase !== 'arm' ? 1 : 0.5, transition: 'all 0.2s' }}>
                    <span style={{ fontSize: 22 }}>{go ? '✅' : s.ic}</span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 15, color: go ? T.success : T.ink }}>{i + 1}. {tr(s.label)}</span>
                      <span className="mono" style={{ fontSize: 11.5, color: T.ink3 }}>{tr(s.sub)}</span>
                    </span>
                    <span className="mono" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 11.5, letterSpacing: '0.06em', color: statCol, background: go ? `${T.success}1F` : nextUp ? `${T.accent}1A` : `${T.ink3}18`, borderRadius: 99, padding: '4px 10px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: statCol, boxShadow: go ? `0 0 0 3px ${T.success}22` : 'none', flexShrink: 0 }} />{stat}</span>
                  </button>
                );
              })}
            </div>
          </Col>
          <Col>
            <p className="flow-label">Mission Control</p>
            {abort && phase === 'arm' && (
              <div key={abort.k} className="dl-shake" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, borderRadius: 12, padding: '12px 14px', background: T.accentSoft, boxShadow: `inset 0 0 0 1.5px ${T.accent}55` }}>
                <span style={{ fontSize: 20 }}>🛑</span>
                <div>
                  <p className="small mono" style={{ margin: '0 0 3px', fontWeight: 700, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>HOLD — {tr({ uz: "uchirish to'xtatildi", ru: 'запуск остановлен' })}</p>
                  <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>«{tr(STAGES[abort.idx].label)}» hali erta. Avval <b>{armed + 1}-bosqich «{tr(STAGES[armed].label)}»</b> kerak — {tr(ABORT_REASONS[armed])}.</>, ru: <>«{tr(STAGES[abort.idx].label)}» пока рано. Сначала нужен <b>этап {armed + 1} — «{tr(STAGES[armed].label)}»</b>: {tr(ABORT_REASONS[armed])}.</> })}</p>
                </div>
              </div>
            )}
            <pre className="code-box" style={{ minHeight: 118 }}>
              {STAGES.slice(0, armed).map((s, i) => (<React.Fragment key={i}><span style={{ color: CODE.str }}>{tr(s.log)}</span>{'\n'}</React.Fragment>))}
              {armed === 0 && <span style={{ color: CODE.comment }}>{tr({ uz: '// bosqichlarni tartib bilan yoqing…', ru: '// включайте этапы по порядку…' })}</span>}
              {phase === 'countdown' && <span style={{ color: CODE.attr }}>{`\nT-minus… ${count}`}</span>}
              {phase === 'liftoff' && <span style={{ color: CODE.tag }}>{'\n' + tr({ uz: '🚀 Liftoff! Sayt internetga chiqmoqda…', ru: '🚀 Liftoff! Сайт выходит в интернет…' })}</span>}
              {worldwide && <span style={{ color: CODE.str }}>{'\n' + tr({ uz: '✓ LIVE — aziza.maktab.uz butun dunyoda ochiq', ru: '✓ LIVE — aziza.maktab.uz открыт всему миру' })}</span>}
            </pre>
            {phase === 'arm' && (
              <button onClick={launch} disabled={!launchArmed}
                className={launchArmed ? 'dl-armed-btn' : ''}
                style={{ marginTop: 4, padding: '15px 22px', borderRadius: 14, border: 'none', cursor: launchArmed ? 'pointer' : 'not-allowed', fontFamily: "'Manrope',sans-serif", fontWeight: 900, fontSize: 18, letterSpacing: '0.04em', color: '#fff', background: launchArmed ? T.accent : 'rgba(90,90,96,0.25)', boxShadow: launchArmed ? '0 12px 30px -8px rgba(255,79,40,0.7)' : 'none', transition: 'all 0.2s' }}>
                {launchArmed ? tr({ uz: '🚀 UCHIRISH', ru: '🚀 ЗАПУСК' }) : `🔒 ${armed}/${N} ${tr({ uz: 'bosqich GO', ru: 'этапов GO' })}`}
              </button>
            )}
            {phase === 'countdown' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '10px 0' }}>
                {/* raketa titraydi — count kamayganda tebranish kuchayadi (--amp) */}
                <span className="dl-tremble" aria-hidden="true" style={{ fontSize: 46, '--amp': `${(4 - count) * 1.4 + 1.2}px` }}>🚀</span>
                <span key={count} className="dl-countnum" style={{ fontSize: 64, fontFamily: "'Manrope',sans-serif", fontWeight: 900, color: T.accent, lineHeight: 1 }}>{count}</span>
                <span className="mono small" style={{ color: T.ink3 }}>{tr({ uz: 'uchirishga tayyorgarlik…', ru: 'подготовка к запуску…' })}</span>
              </div>
            )}
            {phase === 'liftoff' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '14px 0' }}>
                <div className="dl-liftoff-stage" aria-hidden="true">
                  <span className="dl-smoke" />
                  <span className="dl-liftoff" style={{ fontSize: 52 }}>🚀</span>
                </div>
                <span className="mono small" style={{ color: T.accent, fontWeight: 700, marginTop: 4 }}>Liftoff!</span>
              </div>
            )}
            {worldwide && (
              <div className="frame-success fade-step">
                <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 700, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}><span className="dl-globe">🌍</span> LIVE — {tr({ uz: 'butun dunyoda ochiq', ru: 'открыт всему миру' })}</p>
                <p className="body" style={{ margin: '0 0 8px', color: T.ink }}>{tr({ uz: <>Saytingiz endi <b className="mono">aziza.maktab.uz</b> da jonli — dunyoning istalgan yeridan ochilmoqda. Mana, tashrifchilar kelyapti:</>, ru: <>Ваш сайт теперь живёт на <b className="mono">aziza.maktab.uz</b> — его открывают из любой точки мира. Смотрите, посетители уже идут:</> })}</p>
                <div style={{ fontSize: 22, display: 'flex', gap: 7 }}>{['🧑', '👩', '👨', '👵', '🧒', '👧'].map((v, i) => (<span key={i} className="dl-visitor" style={{ animationDelay: `${i * 0.08}s` }}>{v}</span>))}</div>
              </div>
            )}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — DEBUGGING (index.html) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's14', text: `Deploy bo'ldi-yu, lekin sayt ochilganda bo'm-bo'sh, "404 — sahifa topilmadi" chiqdi. Sabab: bosh sahifa fayli "index.html" deb nomlanishi shart, lekin u "home.html" deb qo'yilgan. Xato faylni bosing.`, trigger: 'on_mount', waits_for: { type: 'error_found' } }]);
  const [picked, setPicked] = useState(storedAnswer ? 'home' : null);
  const [fixed, setFixed] = useState(!!storedAnswer);
  const found = picked === 'home';
  const done = fixed;
  const pickHome = () => { if (found) return; setPicked('home'); audio.triggerEvent('error_found'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(`Topdingiz! Bosh sahifa index.html bo'lishi kerak. Endi nomini to'g'rilaymiz.`); }, 300); };
  const fix = () => { setFixed(true); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(`Tuzatildi! index.html — endi sayt ochiladi.`); }, 300); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow="Debugging" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (found ? tr({ uz: 'Endi tuzating', ru: 'Теперь исправьте' }) : tr({ uz: 'Xatoni toping', ru: 'Найдите ошибку' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sayt ochildi-yu, <span className="italic" style={{ color: T.accent }}>bo'm-bo'sh</span> — nega?</>, ru: <>Сайт открылся, но <span className="italic" style={{ color: T.accent }}>пустой</span> — почему?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Deploy bo'ldi, lekin sayt <b style={{ color: T.ink }}>"404 — topilmadi"</b> chiqaryapti. Sabab: bosh sahifa fayli <span className="mono">index.html</span> bo'lishi shart. Fayllarni qarang — qaysi biri noto'g'ri nomlangan?</>, ru: <>Деплой прошёл, но сайт показывает <b style={{ color: T.ink }}>«404 — не найдено»</b>. Причина: файл главной страницы должен называться <span className="mono">index.html</span>. Посмотрите на файлы — какой из них назван неверно?</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-1">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: 'Saytingiz fayllari deploy qilindi:', ru: 'Файлы вашего сайта задеплоены:' })}</span></div>
              <div className="ai-code">
                <div className={`ai-line ${found ? (fixed ? 'ok' : 'bad') : ''}`} onClick={pickHome}>📄 {fixed ? 'index.html' : 'home.html'} <span style={{ color: CODE.comment }}>{fixed ? tr({ uz: '✓ bosh sahifa', ru: '✓ главная страница' }) : tr({ uz: '← bosh sahifa?', ru: '← главная страница?' })}</span></div>
                <div className="ai-line" onClick={() => { if (!found) setPicked('css'); }}>🎨 style.css</div>
                <div className="ai-line" onClick={() => { if (!found) setPicked('img'); }}>🖼️ rasm.jpg</div>
              </div>
              {!found && <p className="ai-prompt">{tr({ uz: "Qaysi fayl noto'g'ri nomlangan? Bosing.", ru: 'Какой файл назван неверно? Нажмите на него.' })}</p>}
              {found && !fixed && (<button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={fix}>🔧 {tr({ uz: 'Faylni index.html deb nomlash', ru: 'Переименовать файл в index.html' })}</button>)}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: 'normal', fontWeight: 600 }}>✓ {tr({ uz: 'Tuzatildi — endi sayt ochiladi!', ru: 'Исправлено — теперь сайт откроется!' })}</p>}
            </div>
          </Col>
          <Col>
            {!found && (
              picked && picked !== 'home'
                ? (<div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu fayl to'g'ri — {picked === 'css' ? 'style.css uslublar uchun' : 'rasm.jpg surat uchun'}. Yana qarang: <b>bosh sahifa</b> qanday nomlanishi kerak edi?</>, ru: <>Этот файл в порядке — {picked === 'css' ? 'style.css отвечает за стили' : 'rasm.jpg — это картинка'}. Посмотрите ещё раз: как должна называться <b>главная страница</b>?</> })}</p></div>)
                : (<div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Hosting bosh sahifani <b style={{ color: T.ink }}>index.html</b> deb qidiradi. Topa olmasa — 404 chiqaradi. Qaysi fayl boshqacha nomlangan?</>, ru: <>Хостинг ищет главную страницу с именем <b style={{ color: T.ink }}>index.html</b>. Не найдёт — покажет 404. Какой файл назван иначе?</> })}</p></div>)
            )}
            {found && !fixed && (<div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>✓ {tr({ uz: 'Topdingiz!', ru: 'Нашли!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bosh sahifa <span className="mono">home.html</span> deb nomlangan, lekin hosting <span className="mono">index.html</span> ni qidiradi. Chap tugmani bosib to'g'rilang →</>, ru: <>Главная страница названа <span className="mono">home.html</span>, а хостинг ищет <span className="mono">index.html</span>. Исправьте кнопкой слева →</> })}</p></div>)}
            {fixed ? (<>
              <p className="flow-label">{tr({ uz: "Endi sayt to'g'ri ochiladi", ru: 'Теперь сайт открывается правильно' })}</p>
              <Preview title="aziza.maktab.uz" minH={120}><MiniSite name="Aziza" /></Preview>
              <div className="takeaway fade-step"><div className="ta-bulb">🛠️</div><p className="ta-h">{tr({ uz: 'Topdingiz va tuzatdingiz — bu debugging!', ru: 'Нашли и исправили — это и есть дебаггинг!' })}</p><p className="ta-sub">{tr({ uz: "Bosh sahifa doim index.html bo'ladi", ru: 'Главная страница — всегда index.html' })}</p></div>
            </>) : (
              <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">aziza.maktab.uz</span></div><div className="bp-body" style={{ minHeight: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}><span style={{ fontSize: 30 }}>📭</span><p style={{ fontFamily: "'JetBrains Mono',monospace", color: T.accent, margin: 0, fontWeight: 700 }}>404 — Not Found</p></div></div>
            )}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — YAKUNIY (manzilni o'zi yozadi) =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const isMentorLive = !!(_gate.live && _gate.live.mode === 'mentor'); // mentor proyektorda — o'zi yozmasdan o'tadi
  const audio = useAudio([{ id: 's15', text: `Oxirgi qadam. O'z poddomen manzilingizni to'liq o'zingiz yozing: ismingiz, nuqta, maktab nuqta uz. Masalan: aziza nuqta maktab nuqta uz.`, trigger: 'on_mount', waits_for: { type: 'typed_ok' } }]);
  const [value, setValue] = useState(storedAnswer?.picked || '');
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const v = value.trim().toLowerCase();
  const hasName = /^[a-z0-9-]{2,}\./.test(v);
  const hasDot = (v.match(/\./g) || []).length >= 2;
  const endsMaktab = /\.maktab\.uz$/.test(v);
  const valid = /^[a-z0-9-]{2,}\.maktab\.uz$/.test(v);
  const namePart = valid ? v.split('.')[0] : '';
  useEffect(() => {
    if (valid && !passed) {
      setPassed(true);
      onAnswer(screen, { correct: true, picked: value });
      audio.triggerEvent('typed_ok');
      if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(`Zo'r! To'liq manzilingizni yozdingiz — saytingiz internetda tayyor.`); }, 300);
    }
  }, [valid]);
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? false : !passed} label={isMentorLive ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (passed ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Manzilni yozing', ru: 'Введите адрес' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: <span className="italic" style={{ color: T.accent }}>manzilingizni</span> yozing.</>, ru: <>Последний шаг: введите <span className="italic" style={{ color: T.accent }}>свой адрес</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>O'z poddomen manzilingizni to'liq yozing: <b style={{ color: T.ink }}>ismingiz</b> + <span className="mono">.maktab.uz</span>. Masalan: <span className="mono">aziza.maktab.uz</span>.</>, ru: <>Введите свой полный адрес поддомена: <b style={{ color: T.ink }}>ваше имя</b> + <span className="mono">.maktab.uz</span>. Например: <span className="mono">aziza.maktab.uz</span>.</> })}</Mentor>
        <div className="split">
          <Col>
            <input className="fade-up delay-1" value={value} onChange={e => setValue(e.target.value)} placeholder="ismingiz.maktab.uz" spellCheck={false} autoCapitalize="off" autoCorrect="off" style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: 16, padding: '14px 16px', borderRadius: 12, border: 'none', background: T.paper, color: T.ink, outline: 'none', transition: 'box-shadow 0.2s', boxShadow: valid ? `0 0 0 2px ${T.success}, 0 8px 20px -8px rgba(${T.shadowBase},0.2)` : `0 4px 14px -6px rgba(${T.shadowBase},0.16)` }} />
            <div className="fade-up delay-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tagpill" style={{ opacity: hasName ? 1 : 0.4 }}>{hasName ? '✓' : '1'} {tr({ uz: 'ismingiz', ru: 'ваше имя' })}</span>
              <span className="tagpill" style={{ opacity: hasDot ? 1 : 0.4 }}>{hasDot ? '✓' : '2'} {tr({ uz: 'nuqta bilan', ru: 'с точкой' })}</span>
              <span className="tagpill" style={{ opacity: endsMaktab ? 1 : 0.4 }}>{endsMaktab ? '✓' : '3'} .maktab.uz</span>
            </div>
            {passed
              ? (<div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Zo'r! <b className="mono">{v}</b> — to'liq, to'g'ri poddomen manzili.</>, ru: <>✓ Отлично! <b className="mono">{v}</b> — полный, правильный адрес поддомена.</> })}</p></div>)
              : (<p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr({ uz: <>Masalan: <span className="mono">ali.maktab.uz</span> · faqat lotin harf, raqam va tire.</>, ru: <>Например: <span className="mono">ali.maktab.uz</span> · только латинские буквы, цифры и дефис.</> })}</p>)}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija', ru: 'результат' })}</p>
            <Preview title={valid ? v : tr({ uz: 'manzil...', ru: 'адрес...' })} minH={130}>
              {valid ? <MiniSite name={namePart.charAt(0).toUpperCase() + namePart.slice(1)} /> : <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: "To'liq manzilni yozing: ismingiz.maktab.uz", ru: 'Введите полный адрес: имя.maktab.uz' })}</p>}
            </Preview>
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// 🃏 Qayta ishlatiladigan FLASHCARDS — aktiv takrorlash (3D flip + o'z-o'zini baholash + spaced recall).
// Deploy mavzusi bo'yicha 12 karta (front — savol/ta'rif, back — atama, note — hayotiy izoh/misol).
const DEPLOY_FLASHCARDS = [
  { front: { uz: "Saytni doimo ishlab turadigan serverda saqlash xizmati qanday ataladi?", ru: 'Как называется услуга хранения сайта на постоянно работающем сервере?' }, back: { uz: 'Hosting', ru: 'Хостинг' }, note: { uz: "24 soat ochiq do'kon kabi — istalgan payt kirib ko'rasiz", ru: 'Как магазин, открытый 24 часа — зайти можно в любой момент' } },
  { front: { uz: "Sayt faqat sizning kompyuteringizda ishlasa, u qayerda turadi?", ru: 'Где находится сайт, если он работает только на вашем компьютере?' }, back: 'localhost', note: { uz: "Kompyuter o'chsa — sayt ham yo'q, uni faqat siz ko'rasiz", ru: 'Выключили компьютер — сайта нет, видите его только вы' } },
  { front: { uz: "Saytni serverga joylab internetga chiqarish qanday ataladi?", ru: 'Как называется размещение сайта на сервере и вывод его в интернет?' }, back: { uz: 'Deploy', ru: 'Деплой' }, note: { uz: "Raketa uchgandek: sayt kompyuterdan internetga chiqadi", ru: 'Как запуск ракеты: сайт уходит с компьютера в интернет' } },
  { front: { uz: "Saytni bepul va bir necha soniyada chiqaradigan platforma qaysi?", ru: 'Какая платформа публикует сайт бесплатно и за несколько секунд?' }, back: 'Netlify', note: { uz: "Netlify saytni joylaydi, Chrome esa uni ko'rsatadi", ru: 'Netlify размещает сайт, а Chrome его показывает' } },
  { front: { uz: "Netlify'da saytni chiqarishning qanday ikki yo'li bor?", ru: 'Какими двумя способами можно опубликовать сайт на Netlify?' }, back: { uz: "Papkani tortish yoki GitHub'ni ulash", ru: 'Перетащить папку или подключить GitHub' }, note: { uz: "Biz GitHub'ni ulaymiz — kod allaqachon o'sha yerda", ru: 'Мы подключаем GitHub — код уже там' } },
  { front: { uz: "Hosting bosh sahifa deb qaysi fayl nomini qidiradi?", ru: 'Файл с каким именем хостинг ищет как главную страницу?' }, back: 'index.html', note: { uz: "Bosh sahifa doim shu nom bilan bo'ladi", ru: 'Главная страница всегда с этим именем' } },
  { front: { uz: "Bosh sahifa boshqacha nomlansa, brauzerda qanday xato chiqadi?", ru: 'Какая ошибка появится в браузере, если главная страница названа иначе?' }, back: '404', note: { uz: "404 — sahifa topilmadi degani", ru: '404 — значит страница не найдена' } },
  { front: { uz: "Saytning internetdagi asosiy manzili qanday ataladi?", ru: 'Как называется основной адрес сайта в интернете?' }, back: { uz: 'Domen', ru: 'Домен' }, note: { uz: "Masalan maktab.uz — odam eslab qoladigan nom", ru: 'Например maktab.uz — имя, которое легко запомнить' } },
  { front: { uz: "aziza.maktab.uz manzilida qaysi qismi poddomen?", ru: 'Какая часть в адресе aziza.maktab.uz — поддомен?' }, back: 'aziza', note: { uz: "Bitta domen ostida yuzlab poddomen bo'ladi", ru: 'Под одним доменом бывают сотни поддоменов' } },
  { front: { uz: "Kodingiz saqlanadigan bulutdagi joy qaysi?", ru: 'Что за место в облаке, где хранится ваш код?' }, back: 'GitHub', note: { uz: "Git darsida push qilgan kodingiz shu yerda turadi", ru: 'Код, который вы запушили на уроке Git, лежит там' } },
  { front: { uz: "Bitta loyiha kodi saqlanadigan GitHub papkasi qanday ataladi?", ru: 'Как называется папка на GitHub с кодом одного проекта?' }, back: { uz: 'Repo', ru: 'Репозиторий' }, note: { uz: "Netlify aynan shu repoga ulanadi", ru: 'Netlify подключается именно к этому репо' } },
  { front: { uz: "Har push qilganda saytning o'zi yangilanishi qanday ataladi?", ru: 'Как называется самообновление сайта после каждого push?' }, back: { uz: 'Avto-deploy', ru: 'Авто-деплой' }, note: { uz: "Netlify GitHub'ni kuzatadi va o'zgarishni o'zi oladi", ru: 'Netlify следит за GitHub и сам забирает изменения' } },
];
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'tushuncha yodlandi', ru: 'понятий выучено' })}</p><button className="fc-btn ghost" onClick={restart}>↻ {tr({ uz: 'Qaytadan takrorlash', ru: 'Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Изучаю' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
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
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>✗ {tr({ uz: 'Takrorlash', ru: 'Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })}</button></div>)
        : (<p className="fc-hint">👆 {tr({ uz: "Kartani bosing — javobni ko'rasiz", ru: 'Нажмите на карточку — увидите ответ' })}</p>)}
    </div>
  );
}

// ===== SCREEN: FLASHCARD TAKRORLASH (podiumdan keyin, yakuniy summarydan oldin) =====
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 'sflash', text: `Darsni yakunlashdan oldin, bugun o'rgangan tushunchalarni tez takrorlaymiz. Har kartada bir vazifa — javobni o'ylang, keyin kartani bosib tekshiring.`, trigger: 'on_mount', waits_for: null }]);
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'К финалу →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tushunchalarni <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <>Быстро повторим <span className="italic" style={{ color: T.accent }}>понятия</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Darsni yakunlashdan oldin bugun o'rgangan tushunchalarni takrorlaymiz. Har kartada bir vazifa — <b style={{ color: T.ink }}>javobni</b> o'ylang, keyin kartani bosib tekshiring. <b style={{ color: T.ink }}>Bildim</b> yoki <b style={{ color: T.ink }}>Takrorlash</b> bilan baholang.</>, ru: <>Перед финалом повторим понятия, которые вы сегодня изучили. На каждой карточке задание — подумайте над <b style={{ color: T.ink }}>ответом</b>, потом нажмите на карточку и проверьте себя. Оценивайте кнопками <b style={{ color: T.ink }}>Знаю</b> или <b style={{ color: T.ink }}>Повторить</b>.</> })}</Mentor>
        <div className="fc-center"><Flashcards cards={DEPLOY_FLASHCARDS} /></div>
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
  const audio = useAudio([{ id: 's16', text: "Dars yakunlandi. Saytingizni internetga chiqardingiz! Asosiyni eslab qoling: hosting saytni serverda saqlaydi, Netlify uni bepul deploy qiladi, deploy qilingach sayt internetda ochiq, va poddomen — maktab domeni ostidagi shaxsiy manzilingiz.", trigger: 'on_mount', waits_for: null }]);
  const RECAP = [{ uz: 'Hosting nima — saytning internetdagi uyi', ru: 'Что такое хостинг — дом сайта в интернете' }, { uz: "Netlify bilan saytni bepul deploy qilish", ru: 'Бесплатный деплой сайта через Netlify' }, { uz: "GitHub'ni ulash va avto-deploy (push → yangilanadi)", ru: 'Подключение GitHub и авто-деплой (push → обновление)' }, { uz: 'Deploy — sayt internetda har kim uchun ochiq', ru: 'Деплой — сайт в интернете открыт каждому' }, { uz: 'Poddomen — ism.maktab.uz (shaxsiy manzil)', ru: 'Поддомен — imya.maktab.uz (личный адрес)' }];
  const HOMEWORK = [{ b: 'GitHub', t: { uz: '— saytingizni repoga push qiling', ru: '— запушьте свой сайт в репозиторий' } }, { b: 'Netlify', t: { uz: '— bepul account oching va reponi ulang', ru: '— создайте бесплатный аккаунт и подключите репо' } }, { b: { uz: 'Deploy', ru: 'Деплой' }, t: { uz: '— saytni internetga chiqaring', ru: '— опубликуйте сайт в интернете' } }, { b: { uz: 'Manzil', ru: 'Адрес' }, t: { uz: "— poddomenni do'stingizga yuboring", ru: '— отправьте поддомен другу' } }];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Saytingizni <span className="italic" style={{ color: T.accent }}>internetga</span> chiqardingiz.</>, ru: <>Вы вывели свой сайт <span className="italic" style={{ color: T.accent }}>в интернет</span>.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: "Tabriklaymiz! Endi saytingizni o'zingiz deploy qilib, maktab poddomeniga ulay olasiz.", ru: 'Поздравляем! Теперь вы сами можете задеплоить сайт и подключить школьный поддомен.' }) : tr({ uz: "Yaxshi harakat! Bir-ikki joyni mustahkamlash uchun darsni qayta ko'ring.", ru: 'Хорошая попытка! Пересмотрите урок, чтобы закрепить пару моментов.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark
            stats={false}
            disabled={studentWait}
            liveOn={studentLive}
            onClick={studentWait ? undefined : openArena}
            hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined}
          />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>🚀 {tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "O'z saytingizni internetga chiqaring:", ru: 'Опубликуйте свой сайт в интернете:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "Saytingiz tayyor bo'lsa — manzilni mentor va do'stlaringizga yuboring. Bu sizning birinchi jonli loyihangiz!", ru: 'Когда сайт будет готов — отправьте адрес ментору и друзьям. Это ваш первый живой проект!' })}</p></div>
        </div>
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: 'Nishonlaringiz', ru: 'Ваши награды' })} — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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
// Podium yorliqlari (scored indeks -> qisqa nom)
const Q_LABELS = { 4: { uz: "Hosting vazifasi", ru: 'Задача хостинга' }, 6: { uz: "Netlify nima", ru: 'Что такое Netlify' }, 10: { uz: "Deploy — kim ko'radi", ru: 'Деплой — кто увидит' }, 13: { uz: "Poddomen nima", ru: 'Что такое поддомен' }, 16: { uz: "Poddomen yozish (yakuniy)", ru: 'Ввод поддомена (финал)' } };

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
const INLINE_KEYS = { s4: 0, s5b: 2, s9: 1, s12: 3, s15: -1 };

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
              {live.mode === 'mentor' && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.', ru: 'Вопросы с ⚠️ — темы, где класс испытывал трудности. Рекомендуется объяснить их ещё раз.' })}</p>}
            </div>
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
// Arena foni: suzuvchi deploy tokenlari (dars mavzusi — hosting/deploy hissi)
const QZ_BG_SHAPES = [
  { ch: 'git push', l: 5,  t: 12, s: 34, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: '.uz',      l: 85, t: 9,  s: 40, c: 'rgba(255,110,70,0.14)',  d: 23, dl: 1.5 },
  { ch: 'netlify',  l: 8,  t: 72, s: 30, c: 'rgba(80,200,255,0.13)',  d: 27, dl: 0.8 },
  { ch: 'index.html', l: 76, t: 68, s: 26, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: '🚀',       l: 45, t: 86, s: 40, c: 'rgba(203,173,255,0.9)',   d: 25, dl: 1.1 },
  { ch: 'https://', l: 64, t: 24, s: 24, c: 'rgba(203,173,255,0.14)',  d: 17, dl: 0.4 },
  { ch: '🌍',       l: 26, t: 34, s: 34, c: 'rgba(203,173,255,0.9)',   d: 20, dl: 1.9 },
  { ch: 'LIVE',     l: 55, t: 5,  s: 26, c: 'rgba(120,235,175,0.13)',  d: 22, dl: 0.6 },
  { ch: 'deploy',   l: 92, t: 44, s: 24, c: 'rgba(203,173,255,0.10)',  d: 24, dl: 1.3 },
  { ch: 'aziza.maktab.uz', l: 2, t: 46, s: 20, c: 'rgba(203,173,255,0.12)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: "Hosting asosan qanday vazifa bajaradi?", ru: 'Какую основную задачу выполняет хостинг?' }, opts: [{ uz: "Saytni internetda doimo ochiq saqlaydi", ru: 'Постоянно держит сайт открытым в интернете' }, { uz: "Kodni chiroyli ranglar bilan bezaydi", ru: 'Красиво раскрашивает код' }, { uz: "Saytdagi rasmlarni tahrir qiladi", ru: 'Редактирует картинки на сайте' }, { uz: "Internet ulanishini tezlashtiradi", ru: 'Ускоряет интернет-соединение' }], correct: 0 },
  { q: { uz: "Netlify nima?", ru: 'Что такое Netlify?' }, opts: [{ uz: "Saytni ko'rsatadigan brauzer dasturi", ru: 'Браузер — программа для просмотра сайтов' }, { uz: "Saytlarni joylaydigan hosting platformasi", ru: 'Хостинг-платформа для размещения сайтов' }, { uz: "Onlayn o'ynaladigan qiziqarli o'yin", ru: 'Увлекательная онлайн-игра' }, { uz: "Saytning internetdagi domen manzili", ru: 'Доменный адрес сайта в интернете' }], correct: 1 },
  { q: { uz: "Deploy qilgandan keyin saytni kim ko'radi?", ru: 'Кто увидит сайт после деплоя?' }, opts: [{ uz: "Faqat men — o'z kompyuterimda", ru: 'Только я — на своём компьютере' }, { uz: "Endi buni hech kim ko'rmaydi", ru: 'Теперь его никто не увидит' }, { uz: "Internetdagi har kim (manzil orqali)", ru: 'Любой в интернете (по адресу)' }, { uz: "Faqat GitHub kompaniyasi xodimlari", ru: 'Только сотрудники компании GitHub' }], correct: 2 },
  { q: { uz: "aziza.maktab.uz — bu nima?", ru: 'aziza.maktab.uz — что это?' }, opts: [{ uz: "Mustaqil boshqa sayt (domen)", ru: 'Другой независимый сайт (домен)' }, { uz: "Saytga kirish uchun maxfiy parol", ru: 'Секретный пароль для входа на сайт' }, { uz: "Kompyuterdagi bir fayl nomi", ru: 'Имя файла на компьютере' }, { uz: "maktab.uz domenining poddomeni", ru: 'Поддомен домена maktab.uz' }], correct: 3 },
  { q: { uz: "Sayt faqat sizning kompyuteringizda ishlashi qanday ataladi?", ru: 'Как называется, когда сайт работает только на вашем компьютере?' }, opts: ["localhost", { uz: "hosting", ru: 'хостинг' }, { uz: "domen", ru: 'домен' }, { uz: "deploy", ru: 'деплой' }], correct: 0 },
  { q: { uz: "Do'stingiz boshqa shahardan saytni ochish uchun nima kerak?", ru: 'Что нужно, чтобы друг из другого города открыл сайт?' }, opts: [{ uz: "Faylni Telegram orqali unga yuborish", ru: 'Отправить ему файл через Telegram' }, { uz: "Saytni internetga joylashtirish (deploy)", ru: 'Разместить сайт в интернете (деплой)' }, { uz: "Do'st sizning uyingizga tashrif buyurishi", ru: 'Друг должен приехать к вам домой' }, { uz: "Kompyuteringizni o'chirib qo'yish", ru: 'Выключить ваш компьютер' }], correct: 1 },
  { q: { uz: "Deploy so'zi nimani anglatadi?", ru: 'Что означает слово «деплой»?' }, opts: [{ uz: "Saytning kodini butunlay o'chirib tashlash", ru: 'Полностью удалить код сайта' }, { uz: "Sayt uchun chiroyli rasm chizib berish", ru: 'Нарисовать красивую картинку для сайта' }, { uz: "Saytni serverga joylab, internetga chiqarish", ru: 'Разместить сайт на сервере и открыть в интернете' }, { uz: "Saytga kirish uchun parol o'rnatish", ru: 'Установить пароль для входа на сайт' }], correct: 2 },
  { q: { uz: "Domen nima?", ru: 'Что такое домен?' }, opts: [{ uz: "Kodni ranglaydigan usul", ru: 'Способ раскрасить код' }, { uz: "Brauzer dasturining nomi", ru: 'Название браузера' }, { uz: "Faylning kengaytmasi (.html)", ru: 'Расширение файла (.html)' }, { uz: "Saytning internetdagi manzili", ru: 'Адрес сайта в интернете' }], correct: 3 },
  { q: { uz: "Netlify'da sayt uchun kod ko'pincha qayerdan olinadi?", ru: 'Откуда Netlify чаще всего берёт код сайта?' }, opts: [{ uz: "GitHub repozitoriysidan", ru: 'Из репозитория GitHub' }, { uz: "Telegram kanali orqali", ru: 'Через Telegram-канал' }, { uz: "Bosma qog'oz varag'idan", ru: 'С печатного листа бумаги' }, { uz: "Oddiy pochta xati orqali", ru: 'Из обычного почтового письма' }], correct: 0 },
  { q: { uz: "aziza.maktab.uz da asosiy domen qaysi?", ru: 'Какой основной домен в aziza.maktab.uz?' }, opts: ["aziza", "maktab.uz", "uz", "http"], correct: 1 },
  { q: { uz: "Hosting serveri saytni qancha vaqt ochiq saqlaydi?", ru: 'Сколько времени хостинг-сервер держит сайт открытым?' }, opts: [{ uz: "Faqat kunduzi", ru: 'Только днём' }, { uz: "Faqat men ulanganda", ru: 'Только когда я в сети' }, { uz: "24/7 — doimo", ru: '24/7 — постоянно' }, { uz: "Bir soat", ru: 'Один час' }], correct: 2 },
  { q: { uz: "To'g'ri poddomen manzili qaysi?", ru: 'Какой адрес поддомена написан правильно?' }, opts: ["maktab.uz.ismingiz", "ismingiz@maktab", "www ismingiz uz", "ismingiz.maktab.uz"], correct: 3 },
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

// ⚡ CODESTRIKE brend belgisi (chaqmoq) + wordmark (CTA + lobby). Ranglar → 🎨 Dizayn.
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

// Jonli arena foni: suzuvchi uchqunlar + «web» chiziqlari + deploy tokenlari (canvas).
// reduced-motion — matchMedia bilan darhol chiqib ketadi (S21: reduced-motion tug'ilishdan).
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['push', 'deploy', '🚀', '🌍', '.uz', 'LIVE', 'https://'];
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
          <span>⚠️ {tr({ uz: "Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: 'Живой урок завершён — продолжите тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>📖 {tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме практики' })}</button>
        </div>
      )}

      {/* ===== LOBBY ===== */}
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
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>▶ {tr({ uz: 'Testni boshlash', ru: 'Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">⏳ {tr({ uz: 'Mentor testni boshlashini kuting…', ru: 'Подождите, пока ментор начнёт тест…' })}</p>}
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
          {my && !isMentor && !solo && <p className="qz-waitmsg">✔ {tr({ uz: 'Javob qabul qilindi — natijani kuting…', ru: 'Ответ принят — ждите результат…' })}</p>}
          {isMentor && (
            <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">✓ {tr({ uz: 'Hamma javob berdi!', ru: 'Все ответили!' })}</span>}
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
                : <span className="qz-res-t">{my ? tr({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Быстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас: ${myRank + 1}-е место` })}</span>}
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
          <h2 className="qz-h">🏆 {tr({ uz: 'Test yakunlandi!', ru: 'Тест завершён!' })}</h2>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ {tr({ uz: 'Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: 'Пройти тест ещё раз — практика (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI — yorqin nurlar, medal portlashi, uchqunlar
function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr({ uz: `Yangi nishon: ${ach.name}`, ru: `Новая награда: ${ach.name}` })}>
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


export default function DeployLesson({ lang: langProp, onFinished }) {
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
    const upd = () => { const z = Math.min(1.5, Math.max(1, window.innerWidth / 1920)); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // 🃏 Flashcard jonli darsda FAQAT MENTORGA ko'rinadi (proyektorda jamoaviy takrorlash);
  // jonli o'quvchidan yashirin — sakrab o'tiladi. Mentor «Erkin qilish» qilgach (yoki uzilsa /
  // yakka o'qishda) o'quvchilarga ham ochiladi.
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => {
    let n = Math.min(s + 1, TOTAL_SCREENS - 1);
    if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
    return n;
  });
  const prev = () => setScreen(s => {
    let n = Math.max(s - 1, 0);
    if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0);
    return n;
  });
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
  useEffect(() => {
    if (screen === TOTAL_SCREENS - 1) earn('graduate');
  }, [screen]); // eslint-disable-line

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
      answers: SCREEN_META.map((s, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === 'function') onFinished(payload);
  };

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenPodium, ScreenFlashcards, Screen16];
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
        .bp-body ul { list-style-type: disc; list-style-position: outside; padding-left: 24px; }
        .bp-body ol { list-style-type: decimal; list-style-position: outside; padding-left: 24px; }
        .bp-body li { display: list-item; }

        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .display { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.0; letter-spacing: -0.01em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes dl-spin { to { transform: rotate(360deg); } }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR v15 (soyalar) === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.ink}; color: ${T.bg}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === OPSIYALAR v15 === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }
        .chip:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); display: flex; align-items: center; justify-content: center; font-size: 22px; line-height: 1; }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        /* === Jonli panel (LiveBadge) — xira turadi, ustiga borilganda tiniqlashadi (kontentni to'smaydi) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
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

        .text-input, .prompt-input { width: 100%; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px,1.8vw,16px); font-weight: 500; padding: 11px 13px; border: none; border-radius: 12px; background: ${T.paper}; color: ${T.ink}; outline: none; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: box-shadow 0.2s; }
        .text-input:focus, .prompt-input:focus { box-shadow: 0 10px 22px -6px rgba(255,79,40,0.3), 0 0 0 1px rgba(255,79,40,0.2); }
        .prompt-input { font-family: 'Manrope'; }

        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12.5px,1.6vw,14.5px); line-height: 1.55; padding: clamp(12px,2.2vw,18px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .code-box .tg, .t-tag { color: ${CODE.tag}; }
        .t-cm, .cm { color: ${CODE.comment}; font-style: italic; }
        .at { color: ${CODE.attr}; } .st { color: ${CODE.str}; } .tx { color: ${CODE.text}; }

        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.16); }
        .bp-bar { background: #f0eee8; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-title { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; }
        .bp-body { padding: clamp(12px,2.2vw,18px); }

        .h-title { font-size: clamp(22px,4vw,38px); }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .lead { margin: 0; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

        /* === STAGE v15 (sticky header, 936px) === */
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

        /* === FRAME v15 === */
        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-ok { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: 12px 15px; }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }
        .frame-col { display: flex; flex-direction: column; gap: 14px; }
        .savo { gap: 12px; }

        /* === LAYOUT === */
        .screen { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        .demo-swap { animation: fade-step 0.3s ease-out; }
        /* === deploy animatsiya yaxshilashlari === */
        .dl-packet { position: absolute; top: 50%; margin-top: -15px; left: 0; width: 30px; height: 30px; border-radius: 8px; background: ${T.paper}; box-shadow: 0 5px 14px -3px rgba(${T.shadowBase},0.4), inset 0 0 0 1.5px ${T.accent}; display: flex; align-items: center; justify-content: center; font-size: 15px; z-index: 4; animation: dlFly 2.6s linear; }
        @keyframes dlFly { 0% { left: 2%; opacity: 0; transform: scale(0.5); } 8% { opacity: 1; transform: scale(1); } 92% { opacity: 1; transform: scale(1); } 100% { left: calc(100% - 32px); opacity: 0; transform: scale(0.5); } }
        .dl-launch { display: inline-block; animation: dlLaunch 0.85s ease-in-out infinite; }
        @keyframes dlLaunch { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-11px) rotate(-1deg); } }
        .dl-pop { display: inline-block; animation: dlPop 0.5s cubic-bezier(.34,1.6,.5,1); }
        @keyframes dlPop { 0% { transform: scale(0); } 55% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .dl-linkwrap { position: relative; }
        .dl-link-dot { position: absolute; top: 50%; margin-top: -7px; width: 14px; height: 14px; border-radius: 50%; background: ${T.success}; box-shadow: 0 0 0 4px rgba(31,122,77,0.18); animation: dlLink 1.15s ease-in-out infinite; }
        @keyframes dlLink { 0% { left: 22%; opacity: 0; transform: scale(0.5); } 25% { opacity: 1; transform: scale(1); } 75% { opacity: 1; transform: scale(1); } 100% { left: 72%; opacity: 0; transform: scale(0.5); } }
        .dl-visitor { display: inline-block; animation: dlVpop 0.5s backwards cubic-bezier(.34,1.5,.5,1); }
        @keyframes dlVpop { from { opacity: 0; transform: scale(0) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .dl-shake { animation: dlShake 0.55s ease; }
        @keyframes dlShake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
        .dl-globe { display: inline-block; animation: dlGlobe 3s ease-in-out infinite; }
        @keyframes dlGlobe { 0%,100% { transform: rotate(0); } 50% { transform: rotate(14deg); } }
        .dl-assemble { animation: dlPop 0.45s cubic-bezier(.34,1.6,.5,1); }

        /* === 🚀 UCHIRISH MARKAZI wow-sahnasi === */
        /* countdown raqami: kuchli zoom-pop (har 3→2→1 remount qilinadi key={count}) */
        .dl-countnum { display: inline-block; animation: dlCountNum 0.5s cubic-bezier(.2,1.5,.4,1) backwards; }
        @keyframes dlCountNum { 0% { transform: scale(0.25); opacity: 0; } 32% { transform: scale(1.28); opacity: 1; } 55% { transform: scale(0.95); } 100% { transform: scale(1); opacity: 1; } }
        /* countdown raketasi: kuchayib boruvchi titrash — amplituda inline --amp orqali */
        .dl-tremble { display: inline-block; animation: dlTremble 0.13s linear infinite; }
        @keyframes dlTremble { 0%,100% { transform: translate(calc(var(--amp,2px) * -0.6), 0); } 25% { transform: translate(var(--amp,2px), calc(var(--amp,2px) * -0.3)); } 50% { transform: translate(calc(var(--amp,2px) * -1), var(--amp,2px)); } 75% { transform: translate(calc(var(--amp,2px) * 0.7), calc(var(--amp,2px) * -0.5)); } }
        /* liftoff: vertikal ko'tarilish + kichrayish + fade (dlLaunch chayqalishidan kuchliroq) + tutun-iz */
        .dl-liftoff-stage { position: relative; width: 62px; height: 120px; display: flex; align-items: flex-end; justify-content: center; }
        .dl-liftoff { display: inline-block; position: relative; z-index: 2; animation: dlLiftoff 1.45s cubic-bezier(.45,.05,.55,.2) forwards; }
        @keyframes dlLiftoff { 0% { transform: translateY(0) scale(1); opacity: 1; } 10% { transform: translateY(5px) scale(1.07); } 24% { transform: translateY(-2px) scale(1.03); } 100% { transform: translateY(-118px) scale(0.38); opacity: 0; } }
        .dl-smoke { position: absolute; bottom: 6px; left: 50%; width: 13px; transform: translateX(-50%); border-radius: 44% 44% 50% 50%; background: linear-gradient(to top, rgba(150,152,160,0) 0%, rgba(178,180,190,0.55) 42%, rgba(214,216,224,0) 100%); animation: dlSmoke 1.45s ease-out forwards; }
        @keyframes dlSmoke { 0% { height: 0; opacity: 0; } 22% { opacity: 0.7; } 100% { height: 98px; opacity: 0; } }
        /* «UCHIRISH» tugmasi armed holatda pulsatsiya — «meni bos» affordance */
        .dl-armed-btn { animation: dlArmed 1.25s ease-in-out infinite; }
        @keyframes dlArmed { 0%,100% { transform: scale(1); box-shadow: 0 12px 30px -8px rgba(255,79,40,0.7); } 50% { transform: scale(1.028); box-shadow: 0 16px 42px -6px rgba(255,79,40,0.98); } }
        /* bosqich-tugma: navbatdagi (nextUp) pulsatsiya qiladi — tartibni ko'rsatuvchi tap-hint */
        .dl-tap { animation: dlTap 1.7s ease-in-out infinite; }
        @keyframes dlTap { 0%,100% { box-shadow: 0 8px 20px -6px rgba(255,79,40,0.28), inset 0 0 0 1.5px rgba(255,79,40,1); } 50% { box-shadow: 0 11px 28px -6px rgba(255,79,40,0.5), inset 0 0 0 2.5px rgba(255,79,40,1); } }
        @media (prefers-reduced-motion: reduce) {
          .dl-tremble { animation: none; }
          .dl-countnum { animation: fade-step 0.3s ease-out backwards; }
          .dl-liftoff { animation: acu-fade 0.5s ease-out; }
          .dl-smoke { display: none; }
          .dl-armed-btn, .dl-tap { animation: none; }
        }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === PIZZA/STEP FLOW === */
        .pz-flow { display: flex; align-items: flex-start; gap: 4px; overflow-x: auto; padding: 4px 2px 2px; }
        .pz-step { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 88px; flex: 0 0 auto; padding: 10px 6px; border-radius: 12px; transition: background 0.3s; }
        .pz-step.on { background: ${T.successSoft}; }
        .pz-step.active { background: ${T.accentSoft}; }
        .pz-lbl { font-size: 11.5px; text-align: center; color: ${T.ink2}; line-height: 1.3; font-weight: 500; }
        .pz-step.on .pz-lbl { color: ${T.ink}; }
        .pz-arrow { align-self: center; margin-top: 18px; color: ${T.ink3}; font-size: 15px; flex: 0 0 auto; transition: color 0.3s; }
        .pz-arrow.on { color: ${T.success}; }
        /* Vertikal oqim (mobil) — skrolsiz, hamma qadam ko'rinadi */
        .pz-flow-v { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }
        .pz-rowstep { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 12px; background: ${T.bg}; transition: background 0.3s; }
        .pz-rowstep.on { background: ${T.successSoft}; }
        .pz-rowstep.active { background: ${T.accentSoft}; }
        .pz-rowic { font-size: 22px; width: 28px; text-align: center; flex-shrink: 0; }
        .pz-rowtxt { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .pz-rowtxt b { font-size: 14px; color: ${T.ink2}; font-weight: 700; }
        .pz-rowstep.on .pz-rowtxt b { color: ${T.ink}; }
        .pz-rowtxt span { font-size: 12px; color: ${T.ink3}; }
        .pz-varrow { align-self: center; color: ${T.ink3}; font-size: 15px; line-height: 1; transition: color 0.3s; }
        .pz-varrow.on { color: ${T.success}; }

        /* === SK-INFO (anatomy/info card) === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }

        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }
        .when { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 10px; padding: 11px 15px; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 6px 8px; border-radius: 6px; transition: all 0.15s; } .ai-line:hover { background: rgba(255,255,255,0.06); } .ai-line .tg { color: ${CODE.tag}; }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

        /* === YAKUN (Screen16) === */
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
        /* === 🃏 FLASHCARDS === */
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
        .fc-tag { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(28px,5.5vw,42px); letter-spacing: -0.02em; }
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
        /* === 🏅 NISHON BAYRAMI (to'liq ekran) === */
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
        /* Yakuniy kolleksiya kartasi */
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

        /* MOBIL: yig'iladigan Mentor (skrollni kamaytirish) */
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

        /* === ⚡ CODESTRIKE — CTA (yakun sahifasida) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; background: linear-gradient(135deg, #FFF3EA, #FFE7DC); border: 1px solid #F3D9CC; border-radius: 20px; padding: clamp(16px,2.4vw,22px) clamp(18px,2.6vw,26px); box-shadow: 0 16px 40px -18px rgba(255,79,40,0.28); }
        .qz-cta-txt { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 3px; }
        .qz-cta-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(16px,2.2vw,20px); color: #121826; }
        .qz-cta-s { font-family: 'Manrope'; font-weight: 500; font-size: 13px; color: #525A6B; }
        .qz-cta-btn { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border: none; border-radius: 14px; padding: 13px 24px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 12px 24px -8px rgba(255,79,40,0.6); transition: transform 0.2s; }
        .qz-cta-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.03); }
        .qz-cta-btn:disabled { background: #E9E6DF; color: #98A0B4; cursor: default; box-shadow: none; }
        .qz-cta.ready .qz-cta-btn { animation: qz-pulse 1.1s ease-in-out infinite; }
        @keyframes qz-pulse { 0%,100% { transform: scale(1); box-shadow: 0 12px 24px -8px rgba(255,79,40,0.6); } 50% { transform: scale(1.06); box-shadow: 0 16px 34px -6px rgba(255,79,40,0.9); } }

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
        .pod-col.me .pod-name { color: ${T.accent}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.accent}; }
        .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
        .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
        .pod-row.me { background: ${T.accentSoft}; outline: 1.5px solid ${T.accent}55; }
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
        /* kod atamasi chipi — savol/variant/izohlarda oddiy matndan ajralib turadi */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr({ uz: '1-Modul', ru: 'Модуль 1' })} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
              <LiveBadge live={live} total={TOTAL_SCREENS} />
            </>
          )}
        </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>
  );
}
