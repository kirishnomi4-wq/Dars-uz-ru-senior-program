import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

// Mentor avatar — hostlangan rasm (LMS'da assets papkasi bo'lmaydi; 11.1 standart)
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// M1-D13 — NETLIFY VA DEPLOY — deploy-amaliyoti (v19)
// Mavzu: o'quvchi Demo Day uchun o'z loyihasini tanlaydi, tayyor topshiriq bilan
//        AI'dan kod oladi, GitHub'ga qo'yadi, Netlify'ga GitHub bilan kirib
//        deploy qiladi va havolani oladi. Nazariya minimal, amaliyot asosiy.
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

const LESSON_META = { lessonId: 'netlify-deploy-v19', lessonTitle: { uz: 'Netlify va deploy', ru: 'Netlify и деплой' } };
const HW_TOKENS = [
  { t: { uz: 'amaliyot', ru: 'практика' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'loyiha', ru: 'проект' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'mashq', ru: 'упражнение' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'natija', ru: 'результат' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',     type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',     type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',     type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's3',     type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's4',     type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's5',     type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's6',     type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's7',     type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',     type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's9',     type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10',    type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11',    type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12',    type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's13',    type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's14b',   type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcard',   template: 'custom',   scored: false, scope: null },
  { id: 's16',    type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// Kichik namuna-sayt (brauzer/telefon maketlarida qayta ishlatiladi)
const MiniSite = ({ name = 'Aziza' }) => (
  <div style={{ fontFamily: 'Georgia, serif' }}>
    <h1 style={{ fontSize: 'clamp(18px,2.6vw,24px)', margin: '0 0 6px', color: T.ink }}>{tr({ uz: 'Salom, men', ru: 'Привет, я' })} {name}!</h1>
    <p style={{ margin: '0 0 12px', color: T.ink2, fontSize: 'clamp(13px,1.7vw,15px)', lineHeight: 1.5 }}>{tr({ uz: "Bu mening birinchi saytim. Web-dasturlashni endi o'rganyapman.", ru: 'Это мой первый сайт. Я только начинаю изучать веб-разработку.' })}</p>
    <span style={{ display: 'inline-block', background: T.accent, color: '#fff', padding: '7px 15px', borderRadius: 8, fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 13 }}>{tr({ uz: "Obuna bo'lish", ru: 'Подписаться' })}</span>
  </div>
);

// 🏅 NISHONLAR — 4 ta (uchtasi ma'noli triggerdan, bittasi yakundan). Nom inglizcha o'yin-uslubi, desc o'zbekcha siz-forma.
const ACHIEVEMENTS = {
  hostpick: { icon: '🌐', name: 'Host Pick!',   desc: { uz: "Netlify nima qilishini aniqladingiz", ru: "Вы определили, что делает Netlify" } },
  filefind: { icon: '📄', name: 'File Finder!', desc: { uz: 'Bosh sahifa qaysi fayl ekanini bildingiz', ru: 'Вы узнали, какой файл является главной страницей' } },
  shipit:   { icon: '🚀', name: 'Ship It!',     desc: { uz: "Sayt chiqarish tartibini ko'rsatdingiz", ru: "Вы указали порядок публикации сайта" } },
  graduate: { icon: '🏆', name: 'Level Up!',    desc: { uz: "Deploy darsini yakunladingiz", ru: "Вы завершили урок деплоя" } },
};
// Ekran id -> nishon (recordAnswer'da avtomatik beriladi). FAQAT scored testlar — nishon tekin berilmaydi.
const ACH_TRIGGERS = { s2: 'hostpick', s6: 'filefind', s10: 'shipit' };

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
// RECAPS kontenti — baholanadigan testlar uchun qayta tushuntirish (idx 2/6/10).
// Xato javob bergan o'quvchi mavzuni 3 ta qisqa kartada qayta ko'radi.
const RECAPS = {
  // idx 2 — s2: «Netlify nima qiladi?»
  2: {
    title: { uz: 'Netlify — saytning internetdagi joyi', ru: 'Netlify — место сайта в интернете' }, cards: [
      { ic: '📁', h: { uz: 'Netlify nima qiladi?', ru: 'Что делает Netlify?' },
        body: { uz: <><b>Netlify</b> sayt papkangizni <b>doimo yonib turgan</b> kompyuterda saqlaydi va sizga <b>havola</b> beradi. Havolani bilgan har kim saytni ochadi.</>, ru: <><b>Netlify</b> хранит папку вашего сайта на <b>всегда включённом</b> компьютере и выдаёт вам <b>ссылку</b>. Сайт откроет каждый, кто знает ссылку.</> },
        vis: <RcFlow items={[{ uz: '📁 Sayt papkasi', ru: '📁 Папка сайта' }, '🌐 Netlify', { uz: '🔗 Havola', ru: '🔗 Ссылка' }]} />,
        ask: { uz: "Netlify bo'lmasa, saytingizni kim ko'ra oladi?", ru: 'Кто увидит ваш сайт без Netlify?' } },
      { ic: '💻', h: { uz: 'Kompyuteringiz va Netlify farqi', ru: 'Разница между вашим компьютером и Netlify' },
        body: { uz: <>Sayt faqat sizda tursa, kompyuter o'chgach u ham yo'qoladi va uni faqat siz ko'rasiz. Netlify'dagi kompyuter esa <b>doimo yonib turadi</b> — sayt kechasi ham ochiq.</>, ru: <>Если сайт лежит только у вас, он исчезает вместе с выключенным компьютером, и видите его только вы. А компьютер у Netlify <b>работает всегда</b> — сайт открыт и ночью.</> },
        vis: <RcFlow items={[{ uz: '💻 faqat men', ru: '💻 только я' }, { uz: '🌍 Netlify — hamma', ru: '🌍 Netlify — все' }]} sep="·" /> },
      { ic: '☝️', h: { uz: 'Adashtirmang!', ru: 'Не путайте!' },
        body: { uz: <>Netlify saytni <b>bezamaydi</b> (bu CSS ishi) va internetni <b>tezlashtirmaydi</b>. Uning ishi bitta: sayt fayllarini saqlash va havola berish.</>, ru: <>Netlify сайт <b>не украшает</b> (это работа CSS) и интернет <b>не ускоряет</b>. Его дело одно: хранить файлы сайта и выдавать ссылку.</> },
        ask: { uz: 'Saytni kim bezaydi — Netlify yoki CSS?', ru: 'Кто украшает сайт — Netlify или CSS?' } },
    ]
  },
  // idx 6 — s6: «Brauzer birinchi qaysi faylni qidiradi?»
  6: {
    title: { uz: 'Sayt fayllari va bosh sahifa', ru: 'Файлы сайта и главная страница' }, cards: [
      { ic: '📄', h: { uz: 'Bosh sahifa — index.html', ru: 'Главная страница — index.html' },
        body: { uz: <>Brauzer sayt papkasini ochganda birinchi <span className="mono">index.html</span> ni qidiradi. Topa olmasa, sahifa o'rniga xato chiqadi.</>, ru: <>Открывая папку сайта, браузер первым делом ищет <span className="mono">index.html</span>. Не найдёт — вместо страницы покажет ошибку.</> },
        vis: <RcFlow items={['index.html', { uz: '= bosh sahifa', ru: '= главная страница' }]} sep="" /> },
      { ic: '🗂️', h: { uz: 'Qaysi fayl nima qiladi', ru: 'Какой файл за что отвечает' },
        body: { uz: <><span className="mono">index.html</span> — bosh sahifa, <span className="mono">style.css</span> — bezak, qolgan <span className="mono">.html</span> fayllar — menyudagi boshqa sahifalar.</>, ru: <><span className="mono">index.html</span> — главная страница, <span className="mono">style.css</span> — оформление, остальные <span className="mono">.html</span> — другие страницы из меню.</> },
        vis: <RcFlow items={['index.html', 'style.css', 'menyu.html']} sep="·" /> },
      { ic: '☝️', h: { uz: 'Nom bitta harf ham farq qilmasin', ru: 'Имя не должно отличаться ни на букву' },
        body: { uz: <>AI bergan fayl nomini <b>aynan</b> ko'chiring. <span className="mono">Index.html</span> yoki <span className="mono">home.html</span> deb saqlansa, sayt ochilmaydi.</>, ru: <>Копируйте имя файла от AI <b>точь-в-точь</b>. Если сохранить как <span className="mono">Index.html</span> или <span className="mono">home.html</span>, сайт не откроется.</> },
        ask: { uz: 'Bosh sahifa fayli qanday nomlanadi?', ru: 'Как называется файл главной страницы?' } },
    ]
  },
  // idx 10 — s10: «Sayt qanday tartibda internetga chiqadi?»
  10: {
    title: { uz: 'Deploy tartibi', ru: 'Порядок деплоя' }, cards: [
      { ic: '🧭', h: { uz: "To'rt qadam, aniq tartibda", ru: 'Четыре шага, строгий порядок' },
        body: { uz: <>Kod <b>GitHub</b>ga boradi → Netlify o'sha <b>reponi</b> tanlaydi → <b>deploy</b> qiladi → sizga <b>havola</b> beradi.</>, ru: <>Код уходит на <b>GitHub</b> → Netlify выбирает этот <b>репозиторий</b> → делает <b>деплой</b> → выдаёт вам <b>ссылку</b>.</> },
        vis: <RcFlow items={['GitHub', { uz: 'repo tanlash', ru: 'выбор репо' }, 'deploy', { uz: 'havola', ru: 'ссылка' }]} /> },
      { ic: '⬆️', h: { uz: 'Nega avval GitHub?', ru: 'Почему сначала GitHub?' },
        body: { uz: <>Netlify kodni kompyuteringizdan emas, <b>GitHub repodan</b> oladi. Repo bo'sh bo'lsa, u sayt qura olmaydi.</>, ru: <>Netlify забирает код не с вашего компьютера, а <b>из репозитория GitHub</b>. Если репозиторий пуст, собирать нечего.</> },
        vis: <RcFlow items={[{ uz: 'git push', ru: 'git push' }, { uz: "kod GitHub'da", ru: 'код на GitHub' }]} sep="→" /> },
      { ic: '🔗', h: { uz: 'Havola — eng oxirida', ru: 'Ссылка — в самом конце' },
        body: { uz: <>Havola deploy <b>natijasi</b>: «Site is live» yozuvi bilan birga chiqadi. Undan oldin havola bo'lmaydi.</>, ru: <>Ссылка — <b>результат</b> деплоя: она появляется вместе с надписью «Site is live». Раньше её нет.</> },
        ask: { uz: "Havola qachon paydo bo'ladi?", ru: 'Когда появляется ссылка?' } },
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

// ============================================================
//  🎯 DARS ARTEFAKTLARI — o'quvchi shu darsda YARATADIGAN narsalar
//  cc-deploy-project : { turi, sahifalar: [...], uslub }
//  cc-site-url       : o'quvchining Netlify havolasi
//  ccPitch3.link     : Demo Day darsi havolani shu yerdan oladi (buzmasdan qo'shiladi)
// ============================================================
const PROJ_KEY = 'cc-deploy-project';
const SITE_URL_KEY = 'cc-site-url';
const PITCH_KEY = 'ccPitch3';
const PAGE_SLOTS = 5;   // 5 maydon: 4 tasi shart, 5-si ixtiyoriy
const MIN_PAGES = 4;
const projRead = () => { try { return JSON.parse(localStorage.getItem(PROJ_KEY) || 'null') || null; } catch { return null; } };
const projWrite = (patch) => { try { const cur = projRead() || {}; localStorage.setItem(PROJ_KEY, JSON.stringify({ ...cur, ...patch })); } catch {} };
// 🏁 DEMO DAY LOYIHA-IPI (F-0803-30): PmLesson1/VsCode'da tanlangan muammo-loyiha. Bor bo'lsa —
// loyiha tanlovida BIRINCHI karta bo'lib chiqadi (shablonlar zaxira qoladi).
const demoRead = () => { try { return JSON.parse(localStorage.getItem('ccDemoDay') || 'null'); } catch { return null; } };
const siteUrlRead = () => { try { return localStorage.getItem(SITE_URL_KEY) || ''; } catch { return ''; } };
// Havola IKKI joyga yoziladi: o'z kaliti + ccPitch3.link (Demo Day darsi o'qiydi).
// ccPitch3 ichidagi boshqa maydonlar saqlanadi: o'qi -> yoy -> faqat link'ni yoz.
const siteUrlWrite = (url) => {
  try { localStorage.setItem(SITE_URL_KEY, url); } catch {}
  try {
    let old = null;
    try { old = JSON.parse(localStorage.getItem(PITCH_KEY) || 'null'); } catch {}
    const base = (old && typeof old === 'object' && !Array.isArray(old)) ? old : {};
    localStorage.setItem(PITCH_KEY, JSON.stringify({ ...base, link: url }));
  } catch {}
};

// ============================================================
//  ✅ «O'ZIM QILDIM» EKRANI — o'quvchi ishni real kompyuterida bajaradi.
//  Qadamlar BITTALAB ochiladi (94-qonun): bajarilgani yopiladi, keyingisi ochiladi.
//  Har qadamda: nima qilish · kutilgan natija ko'rinishi · «bajarolmadim» ipuchasi.
//  practice=true — mentorga praktika-signali (PRACTICE_BASE + ekran) yuboriladi.
// ============================================================
const PRACTICE_BASE = 500; // praktika zonasi: dars javoblari (<100) va arena (100+) bilan to'qnashmaydi

function DoSteps({ screen, storedAnswer, onAnswer, steps, taskLabel, practice, onStep }) {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorLive = !!(live && live.mode === 'mentor');
  const initial = () => new Set(storedAnswer?.doneIds || (storedAnswer?.correct ? steps.map(s => s.id) : []));
  const firstUndone = (set) => { const i = steps.findIndex(s => !set.has(s.id)); return i < 0 ? steps.length - 1 : i; };
  const [done, setDone] = useState(initial);
  const [open, setOpen] = useState(() => firstUndone(initial()));
  const sentRef = useRef(!!(storedAnswer && storedAnswer.correct));
  const allDone = done.size >= steps.length;
  useEffect(() => { if (onStep) onStep(open); }, [open]); // eslint-disable-line
  const toggle = (id, i) => {
    if (isMentorLive) return;
    const n = new Set(done);
    const marking = !n.has(id);
    if (marking) n.add(id); else n.delete(id);
    setDone(n);
    setOpen(marking ? firstUndone(n) : i);
    const all = n.size >= steps.length;
    onAnswer(screen, { correct: all, doneIds: [...n], picked: n.size, stage: 'do-steps', screenIdx: screen });
    if (all && !sentRef.current) {
      sentRef.current = true;
      if (live && live.mode === 'student') live.submitAnswer((practice ? PRACTICE_BASE : 0) + screen, SCREEN_META[screen]?.id || `s${screen}`, 0, true, 0);
    }
  };
  return (
    <div className="dsx fade-up delay-1">
      <div className="dsx-head">
        <span className="dsx-lbl">✅ {tr({ uz: 'Kompyuteringizda bajaring', ru: 'Выполните на своём компьютере' })}</span>
        <span className={`dsx-count ${allDone ? 'ok' : ''}`}>{done.size}/{steps.length}</span>
      </div>
      {steps.map((s, i) => {
        const on = done.has(s.id);
        const isOpen = !on && i === open;
        const locked = !on && i !== open;
        return (
          <div key={s.id} className={`dsx-row ${on ? 'on' : ''} ${isOpen ? 'open' : ''} ${locked ? 'lock' : ''}`}>
            <span className="dsx-num">{on ? '✓' : i + 1}</span>
            <div className="dsx-body">
              <span className="dsx-t">{fmtCode(tr(s.t))}</span>
              {isOpen && s.d && <span className="dsx-d">{fmtCode(tr(s.d))}</span>}
              {isOpen && s.help && (
                <details className="dsx-help">
                  <summary>{tr({ uz: 'Bajarolmadim', ru: 'Не получилось' })}</summary>
                  <span>{fmtCode(tr(s.help))}</span>
                </details>
              )}
              {isOpen && <button className="dsx-btn" onClick={() => toggle(s.id, i)} disabled={isMentorLive}>{tr({ uz: '✓ Bajardim', ru: '✓ Сделал(а)' })}</button>}
            </div>
            {on && !isMentorLive && <button className="dsx-undo" onClick={() => toggle(s.id, i)} title={tr({ uz: 'Qaytarish', ru: 'Вернуть' })}>↺</button>}
          </div>
        );
      })}
      {allDone && !isMentorLive && <p className="dsx-done fade-step">🎉 {tr({ uz: 'Hamma qadam bajarildi.', ru: 'Все шаги выполнены.' })}</p>}
      {isMentorLive && <MentorWorkStats live={live} screenIdx={(practice ? PRACTICE_BASE : 0) + screen} taskLabel={taskLabel} />}
    </div>
  );
}

// Bitta ekran — bitta ish (92-qonun): chapda kutilgan natija, o'ngda qadamlar.
const DoScreen = ({ screen, storedAnswer, onAnswer, onNext, onPrev, eyebrow, title, mentor, steps, taskLabel, practice, resultLabel }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _isMentorLive = !!(_gate.live && _gate.live.mode === 'mentor');
  const [view, setView] = useState(0);
  const doneIds = storedAnswer?.doneIds || (storedAnswer?.correct ? steps.map(s => s.id) : []);
  const allDone = doneIds.length >= steps.length;
  const waitIdx = Math.max(0, steps.findIndex(s => !doneIds.includes(s.id)));
  const navLabel = (allDone || _isMentorLive)
    ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : tr({ uz: `${waitIdx + 1}-qadam: ${tr(steps[waitIdx].nav)}`, ru: `Шаг ${waitIdx + 1}: ${tr(steps[waitIdx].nav)}` });
  const cur = steps[Math.min(view, steps.length - 1)];
  return (
    <Stage eyebrow={eyebrow} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={_isMentorLive ? false : !allDone} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{title}</h2></div>
        <Mentor>{mentor}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{resultLabel || tr({ uz: 'Ekraningizda shunday chiqadi', ru: 'На вашем экране будет так' })}</p>
            <div className="demo-swap" key={cur.id}>{cur.res()}</div>
          </Col>
          <Col>
            <DoSteps screen={screen} storedAnswer={storedAnswer} onAnswer={onAnswer} steps={steps} taskLabel={taskLabel} practice={practice} onStep={setView} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== Netlify oynasi maketi (soxta-skrinshot; rasm-fayl EMAS) =====
const NetWin = ({ title = 'app.netlify.com', minH = 158, children }) => (
  <div className="bp-window">
    <div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">{title}</span></div>
    <div className="bp-body nfy" style={{ minHeight: minH }}>
      <div className="nfy-head"><span className="nfy-logo">N</span><span className="nfy-name">Netlify</span></div>
      {children}
    </div>
  </div>
);
const winBox = { display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', textAlign: 'center' };

// ===== SCREEN 0 — HOOK =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [view, setView] = useState('me');
  const OPTS = [
    { id: 'a', label: { uz: 'Sayt faylini Telegram orqali yuboraman', ru: 'Отправлю файл сайта через Telegram' } },
    { id: 'b', label: { uz: 'Saytni internetga chiqarib, havolasini yuboraman', ru: 'Опубликую сайт в интернете и отправлю ссылку' } },
    { id: 'c', label: { uz: "Do'stim mening kompyuterimga kelib ko'radi", ru: 'Друг придёт к моему компьютеру и посмотрит' } }
  ];
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 780 }}>{tr({ uz: <>Saytingiz faqat kompyuteringizda turibdi. Do'stingizga <span className="italic" style={{ color: T.accent }}>qanday</span> ko'rsatasiz?</>, ru: <>Ваш сайт лежит только на вашем компьютере. <span className="italic" style={{ color: T.accent }}>Как</span> вы покажете его другу?</> })}</h1>
        <Mentor>{tr({ uz: 'Pastdagi uch javobdan bittasini tanlang.', ru: 'Выберите один из трёх ответов ниже.' })}</Mentor>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${view === 'me' ? 'chip-on' : ''}`} onClick={() => setView('me')}>💻 {tr({ uz: 'Mening kompyuterim', ru: 'Мой компьютер' })}</button>
              <button className={`chip ${view === 'friend' ? 'chip-on' : ''}`} onClick={() => setView('friend')}>📱 {tr({ uz: "Do'stimning telefoni", ru: 'Телефон друга' })}</button>
            </div>
            <div className="demo-swap" key={view}>
              {view === 'me' ? (
                <Preview minH={158} title="localhost:5500"><MiniSite name="Aziza" /></Preview>
              ) : (
                <Preview minH={158} title="???">
                  <div className="dl-shake" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 8, padding: '14px 0' }}>
                    <span style={{ fontSize: 38 }}>😕</span>
                    <p style={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: T.ink, margin: 0, fontSize: 'clamp(15px,2vw,18px)' }}>{tr({ uz: 'Bu sahifa ochilmadi', ru: 'Страница не открылась' })}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", color: T.ink3, margin: 0, fontSize: 12 }}>{tr({ uz: 'manzil topilmadi', ru: 'адрес не найден' })}</p>
                  </div>
                </Preview>
              )}
            </div>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Sizningcha qaysi biri?', ru: 'Как думаете, какой?' })}</p>
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
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Javob — ikkinchisi. Sayt internetga chiqsa, bitta <b>havola</b> yetadi: do'stingiz uni telefonida ochadi. Bugun shuni qilamiz.</>, ru: <>Ответ — второй. Когда сайт в интернете, хватает одной <b>ссылки</b>: друг откроет её на телефоне. Сегодня мы это и сделаем.</> })}</p>}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — NETLIFY NIMA (qisqa, bitta vizual) =====
const Screen1 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const STEPS = [
    { ic: '📁', h: { uz: 'Sayt papkangiz', ru: 'Папка вашего сайта' }, s: 'index.html, style.css' },
    { ic: '🌐', h: { uz: 'Netlify', ru: 'Netlify' }, s: { uz: "hech qachon o'chmaydigan kompyuter", ru: 'компьютер, который никогда не выключается' } },
    { ic: '🔗', h: { uz: 'Havola', ru: 'Ссылка' }, s: { uz: 'har kim ochadi', ru: 'откроет каждый' } }
  ];
  const [step, setStep] = useState(storedAnswer ? STEPS.length : 0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const done = step >= STEPS.length;
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current); setStep(0); setRunning(true);
    const tick = (i) => { setStep(i); if (i < STEPS.length) timer.current = setTimeout(() => tick(i + 1), 700); else setRunning(false); };
    timer.current = setTimeout(() => tick(1), 320);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  return (
    <Stage eyebrow="Netlify" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Yo'lni ko'rsating", ru: 'Покажите путь' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sayt papkangiz internetda <span className="italic" style={{ color: T.accent }}>qayerda</span> yashaydi?</>, ru: <>Где в интернете <span className="italic" style={{ color: T.accent }}>живёт</span> папка вашего сайта?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Sayt papkangizni doimo yonib turadigan begona kompyuterga qo'yish kerak. Shunday kompyuter <b style={{ color: T.ink }}>Netlify</b>da turadi: u papkani oladi va sizga havola beradi. Tugmani bosing.</>, ru: <>Папку сайта нужно положить на чужой компьютер, который работает всегда. Такой компьютер стоит у <b style={{ color: T.ink }}>Netlify</b>: он принимает папку и выдаёт вам ссылку. Нажмите кнопку.</> })}</Mentor>
        <div className="frame-col">
          <div className="pz-flow" style={{ justifyContent: 'center' }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`pz-step ${step > i ? 'on' : ''} ${running && step === i + 1 ? 'active' : ''}`} style={{ minWidth: 136 }}>
                  <span style={{ fontSize: 28 }}>{step > i ? s.ic : '○'}</span>
                  <span className="pz-lbl"><b style={{ color: step > i ? T.ink : T.ink2 }}>{tr(s.h)}</b><br />{tr(s.s)}</span>
                </div>
                {i < STEPS.length - 1 && <span className={`pz-arrow ${step > i + 1 ? 'on' : ''}`}>→</span>}
              </React.Fragment>
            ))}
          </div>
          <button className="btn" onClick={run} disabled={running} style={{ alignSelf: 'center' }}>{running ? tr({ uz: 'Ketmoqda…', ru: 'Идёт…' }) : (done ? tr({ uz: "↻ Yana ko'rsatish", ru: '↻ Показать ещё раз' }) : tr({ uz: '▶ Boshlash', ru: '▶ Старт' }))}</button>
        </div>
        {done && (
          <div className="frame-success fade-step">
            <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Netlify uchun alohida parol o'ylab topmaysiz — u yerga <b>GitHub</b> hisobingiz bilan kiriladi. GitHub sizda bor: Git darsida ochgansiz.</>, ru: <>Отдельный пароль для Netlify придумывать не нужно — туда входят через свой <b>GitHub</b>. GitHub у вас есть: вы завели его на уроке Git.</> })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — TEST 1 =====
const Screen2 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · 1-savol', ru: 'Проверка · вопрос 1' })}
    questionText="Netlify nima qiladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: 'Netlify nima qiladi?', ru: 'Что делает Netlify?' })}</h2></>}
    options={[
      { uz: 'Sayt papkangizni internetda saqlaydi va havola beradi', ru: 'Хранит папку вашего сайта в интернете и выдаёт ссылку' },
      { uz: 'Kodni chiroyli ranglar bilan bezaydi', ru: 'Красиво раскрашивает код' },
      { uz: 'Internet tezligini oshiradi', ru: 'Увеличивает скорость интернета' },
      { uz: "Telefonga o'yin o'rnatadi", ru: 'Устанавливает игры на телефон' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "To'g'ri! Netlify sayt fayllaringizni doimo yonib turgan kompyuterda saqlaydi va sizga havola beradi. O'sha havolani istalgan odam ochadi.", ru: 'Верно! Netlify хранит файлы вашего сайта на всегда включённом компьютере и выдаёт ссылку. По ней сайт откроет любой человек.' }}
    explainWrong={{
      1: { uz: "Yo'q — kodni bezash CSS ishi. Netlify saytni internetda saqlaydi va havola beradi.", ru: 'Нет — украшать код это работа CSS. Netlify хранит сайт в интернете и даёт ссылку.' },
      2: { uz: "Yo'q — Netlify internetni tezlashtirmaydi. U saytni internetda saqlaydi va havola beradi.", ru: 'Нет — Netlify не ускоряет интернет. Он хранит сайт в интернете и даёт ссылку.' },
      3: { uz: "Yo'q — o'yin bilan aloqasi yo'q. Netlify saytni internetda saqlaydi va havola beradi.", ru: 'Нет — к играм это отношения не имеет. Netlify хранит сайт в интернете и даёт ссылку.' },
      default: { uz: 'Netlify sayt fayllarini internetda saqlaydi va havola beradi.', ru: 'Netlify хранит файлы сайта в интернете и выдаёт ссылку.' }
    }} />
);

// ===== SCREEN 3 — LOYIHANGIZNI TANLANG + SAHIFALARINI YOZING =====
// 94-qonun: avval faqat loyiha kartalari; tanlangach bir qatorga yig'iladi va sahifa maydonlari ochiladi.
const PROJECTS = [
  { id: 'lavash', ic: '🌯', name: { uz: "Lavash do'koni", ru: 'Лавашная' }, sub: { uz: 'menyu, narxlar, manzil', ru: 'меню, цены, адрес' } },
  { id: 'klub', ic: '🎮', name: { uz: "O'yin-klub", ru: 'Игровой клуб' }, sub: { uz: "o'yinlar, narxlar, jadval", ru: 'игры, цены, расписание' } },
  { id: 'ozim', ic: '🙋', name: { uz: "O'zim haqimda", ru: 'Обо мне' }, sub: { uz: 'ishlarim, qiziqishlarim', ru: 'мои работы, интересы' } },
  { id: 'togarak', ic: '🏫', name: { uz: "Maktab to'garagi", ru: 'Школьный кружок' }, sub: { uz: 'darslar, jamoa, aloqa', ru: 'занятия, команда, контакты' } },
];
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const saved = projRead() || {};
  const [turi, setTuri] = useState(saved.turi || null);
  const [pages, setPages] = useState(() => {
    const p = Array.isArray(saved.sahifalar) ? saved.sahifalar.slice(0, PAGE_SLOTS) : [];
    while (p.length < PAGE_SLOTS) p.push('');
    return p;
  });
  const filled = pages.filter(p => p.trim().length > 1);
  // F-0803-30: PmLesson1/VsCode'da tanlangan Demo Day loyihasi birinchi karta bo'lib chiqadi
  const demo = demoRead();
  const projList = demo && demo.muammo
    ? [{ id: 'demo', ic: '⭐', name: { uz: 'Demo Day loyiham', ru: 'Мой проект Demo Day' }, sub: { uz: demo.yechim || '', ru: demo.yechim || '' } }, ...PROJECTS]
    : PROJECTS;
  const proj = projList.find(p => p.id === turi);
  const done = !!proj && filled.length >= MIN_PAGES;
  const choose = (id) => { setTuri(id); projWrite({ turi: id }); };
  const setPage = (i, v) => {
    const n = pages.slice(); n[i] = v; setPages(n);
    projWrite({ sahifalar: n.filter(x => x.trim()).map(x => x.trim()) });
  };
  useEffect(() => { if (done && !(storedAnswer && storedAnswer.correct)) onAnswer(screen, { correct: true, picked: filled.length, stage: 'artefakt', screenIdx: screen }); }, [done]); // eslint-disable-line
  const navLabel = !proj ? tr({ uz: 'Loyihani tanlang', ru: 'Выберите проект' })
    : !done ? tr({ uz: `Yana ${MIN_PAGES - filled.length} ta sahifa nomi`, ru: `Ещё названий страниц: ${MIN_PAGES - filled.length}` })
      : tr({ uz: 'Davom etish', ru: 'Продолжить' });
  return (
    <Stage eyebrow={tr({ uz: 'Sizning loyihangiz', ru: 'Ваш проект' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun <span className="italic" style={{ color: T.accent }}>qanday</span> sayt quramiz?</>, ru: <>Какой сайт мы <span className="italic" style={{ color: T.accent }}>соберём</span> сегодня?</> })}</h2></div>
        {/* F-0803-30: `!proj` sharti — turi saqlanib, lekin ro'yxatdan topilmasa (masalan
            demo-g'oya o'chirilgan bo'lsa) tanlov qaytadan ochiladi, proj.ic da qulamaydi. */}
        <Mentor>{!proj
          ? tr({ uz: "Loyihangizni tanlang — shu sayt dars oxirida internetda turadi.", ru: 'Выберите свой проект — этот сайт к концу урока окажется в интернете.' })
          : tr({ uz: "Endi sayt qaysi sahifalardan iborat bo'lishini yozing. Kamida to'rttasi kerak: masalan «Bosh sahifa».", ru: 'Теперь напишите, из каких страниц состоит сайт. Нужно минимум четыре: например «Главная».' })}</Mentor>
        <Split>
          <Col>
            {!proj ? (
              <div className="prj-grid fade-up delay-1">
                {projList.map(p => (
                  <button key={p.id} className="prj-card" onClick={() => choose(p.id)}>
                    <span className="prj-ic">{p.ic}</span>
                    <span className="prj-nm">{tr(p.name)}</span>
                    <span className="prj-sub">{tr(p.sub)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="pick-row fade-step">
                  <span style={{ fontSize: 20 }}>{proj.ic}</span>
                  <span className="body" style={{ margin: 0 }}>{tr({ uz: 'Loyiha:', ru: 'Проект:' })} <b>{tr(proj.name)}</b></span>
                  <button className="pick-redo" onClick={() => { setTuri(null); projWrite({ turi: null }); }}>↻ {tr({ uz: "o'zgartirish", ru: 'изменить' })}</button>
                </div>
                <div className="pg-list fade-step">
                  {pages.map((v, i) => (
                    <div key={i} className={`pg-row ${v.trim().length > 1 ? 'on' : ''}`}>
                      <span className="pg-n">{v.trim().length > 1 ? '✓' : i + 1}</span>
                      <input className="text-input" value={v} maxLength={28} onChange={e => setPage(i, e.target.value)}
                        placeholder={i < MIN_PAGES ? tr({ uz: 'Sahifa nomi…', ru: 'Название страницы…' }) : tr({ uz: 'Sahifa nomi (ixtiyoriy)…', ru: 'Название страницы (не обязательно)…' })} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Sayt menyusi shunday chiqadi', ru: 'Меню сайта получится таким' })}</p>
            <Preview title={turi ? `${turi}.netlify.app` : tr({ uz: 'hali tanlanmadi', ru: 'пока не выбрано' })} minH={150}>
              {filled.length === 0
                ? <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: "Sahifa nomlarini yozing — menyu shu yerda yig'iladi", ru: 'Напишите названия страниц — меню соберётся здесь' })}</p>
                : (<>
                  <div className="menu-mock">{filled.map((p, i) => <span key={i} className={`menu-tab ${i === 0 ? 'on' : ''}`}>{p.trim()}</span>)}</div>
                  <p className="body" style={{ margin: '12px 0 0', color: T.ink2 }}>{tr({ uz: 'Har nomga bitta sahifa. Hammasi shu menyu orqali bir-biriga ulanadi.', ru: 'На каждое название — своя страница. Все они связаны через это меню.' })}</p>
                </>)}
            </Preview>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TAYYOR TOPSHIRIQ (prompt) =====
const STYLES = [
  { id: 'minimal', ic: '⬜', name: { uz: 'Minimalist', ru: 'Минимализм' }, sub: { uz: 'oq fon, tinch', ru: 'белый фон, спокойный' },
    desc: { uz: "oq fon, ko'p bo'sh joy, qora matn va bitta urg'u rang. Shrift sodda va tinch.", ru: 'белый фон, много воздуха, чёрный текст и один акцентный цвет. Шрифт простой и спокойный.' } },
  { id: 'yorqin', ic: '🎨', name: { uz: 'Yorqin', ru: 'Яркий' }, sub: { uz: 'quvnoq ranglar', ru: 'весёлые цвета' },
    desc: { uz: "yorqin ranglar (to'q sariq va ko'k), katta sarlavhalar, quvnoq ohang.", ru: 'яркие цвета (оранжевый и синий), крупные заголовки, весёлое настроение.' } },
  { id: 'qorongi', ic: '🌙', name: { uz: "Qorong'i", ru: 'Тёмный' }, sub: { uz: "to'q fon, oq matn", ru: 'тёмный фон, белый текст' },
    desc: { uz: "to'q fon, oq matn, yashil urg'u rang. Shrift zamonaviy.", ru: 'тёмный фон, белый текст, зелёный акцент. Шрифт современный.' } },
  { id: 'gradient', ic: '🌈', name: { uz: 'Gradient', ru: 'Градиент' }, sub: { uz: "rang o'tishlari", ru: 'переливы цвета' },
    desc: { uz: "binafsha va pushti rang o'tishli fonlar, yumshoq soyalar, dumaloq burchaklar.", ru: 'фоны с фиолетово-розовыми переходами, мягкие тени, скруглённые углы.' } },
];
const PROJ_TITLE = {
  lavash: { uz: "Lavash do'koni sayti", ru: 'Сайт лавашной' },
  klub: { uz: "O'yin-klub sayti", ru: 'Сайт игрового клуба' },
  ozim: { uz: "O'zim haqimda sayt", ru: 'Сайт обо мне' },
  togarak: { uz: "Maktab to'garagi sayti", ru: 'Сайт школьного кружка' },
};
const buildPrompt = (proj, style) => {
  const pages = (proj && Array.isArray(proj.sahifalar) && proj.sahifalar.length ? proj.sahifalar : ['Bosh sahifa']).join(', ');
  // F-0803-30: Demo Day loyihasi tanlangan bo'lsa, sarlavha o'quvchining O'Z yechimi bo'ladi
  const demo = proj && proj.turi === 'demo' ? demoRead() : null;
  const ttl = demo && demo.yechim ? { uz: demo.yechim, ru: demo.yechim }
    : PROJ_TITLE[proj && proj.turi] || { uz: 'Mening saytim', ru: 'Мой сайт' };
  // Har qator UZ va RU juftligi bilan — o'quvchi qaysi tilda o'qisa, topshiriq ham shu tilda.
  return [
    tr({ uz: "Men veb-sayt qurmoqchiman. Menga uning to'liq kodini yozib ber.", ru: 'Я хочу сделать веб-сайт. Напиши мне его полный код.' }),
    '',
    tr({ uz: 'LOYIHA: ' + ttl.uz, ru: 'ПРОЕКТ: ' + ttl.ru }),
    tr({ uz: 'SAHIFALAR: ' + pages, ru: 'СТРАНИЦЫ: ' + pages }),
    '',
    tr({ uz: 'SHARTLAR:', ru: 'УСЛОВИЯ:' }),
    tr({ uz: '1. Faqat HTML va CSS ishlat. JavaScript ISHLATMA.', ru: '1. Используй только HTML и CSS. JavaScript НЕ используй.' }),
    tr({ uz: "2. Har sahifa alohida fayl bo'lsin: bosh sahifa index.html, qolganlari o'z nomiga mos .html fayllar. Hammasi bitta style.css faylga ulansin.", ru: '2. Каждая страница — отдельный файл: главная index.html, остальные — .html по своим названиям. Все подключены к одному style.css.' }),
    tr({ uz: '3. Har sahifada bir xil menyu (header) tursin va sahifalar bir-biriga havola orqali ulansin.', ru: '3. На каждой странице одинаковое меню (header), страницы связаны ссылками между собой.' }),
    tr({ uz: '4. Semantik teglardan foydalan: header, main, footer.', ru: '4. Используй семантические теги: header, main, footer.' }),
    tr({ uz: "5. Sayt telefonda ham, kompyuterda ham chiroyli ko'rinsin.", ru: '5. Сайт должен красиво выглядеть и на телефоне, и на компьютере.' }),
    tr({ uz: "6. Animatsiya qo'sh: tugma va havolalarda hover-effekt, silliq o'tishlar, sahifa ochilganda matn va rasmlar yumshoq paydo bo'lsin.", ru: '6. Добавь анимацию: hover-эффект на кнопках и ссылках, плавные переходы, мягкое появление текста и картинок при открытии страницы.' }),
    tr({ uz: "7. Rasmlar o'rniga https://picsum.photos/600/400 havolalaridan foydalan.", ru: '7. Вместо картинок используй ссылки https://picsum.photos/600/400.' }),
    tr({ uz: '8. Uslub: ' + style.desc.uz, ru: '8. Стиль: ' + style.desc.ru }),
    tr({ uz: "9. Kod toza va o'qiladigan bo'lsin, muhim joylariga izoh yoz.", ru: '9. Код должен быть чистым и читаемым, в важных местах — комментарии.' }),
    tr({ uz: "10. Har faylni alohida ko'rsat va tepasiga fayl nomini yoz.", ru: '10. Покажи каждый файл отдельно и напиши сверху его имя.' })
  ].join('\n');
};
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const proj = projRead() || {};
  const [style, setStyle] = useState(proj.uslub || null);
  const [copied, setCopied] = useState(false);
  const st = STYLES.find(s => s.id === style);
  const text = st ? buildPrompt(proj, st) : '';
  const choose = (id) => { setStyle(id); setCopied(false); projWrite({ uslub: id }); };
  useEffect(() => { if (st && !(storedAnswer && storedAnswer.correct)) onAnswer(screen, { correct: true, picked: style, stage: 'artefakt', screenIdx: screen }); }, [style]); // eslint-disable-line
  const copy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
      setCopied(true); setTimeout(() => setCopied(false), 2200);
    } catch {}
  };
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor topshiriq', ru: 'Готовое задание' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!st} label={st ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Uslubni tanlang', ru: 'Выберите стиль' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sayt kodini AI <span className="italic" style={{ color: T.accent }}>yozib beradi</span></>, ru: <>Код сайта <span className="italic" style={{ color: T.accent }}>напишет</span> AI</> })}</h2></div>
        <Mentor>{tr({ uz: "Uslubni tanlang — topshiriq matni o'zgaradi. Keyin 📋 tugmasi bilan nusxalab oling.", ru: 'Выберите стиль — текст задания изменится. Потом скопируйте его кнопкой 📋.' })}</Mentor>
        <Split>
          <Col>
            <div className="prj-grid fade-up delay-1">
              {STYLES.map(s => (
                <button key={s.id} className={`prj-card ${style === s.id ? 'on' : ''}`} onClick={() => choose(s.id)}>
                  <span className="prj-ic">{s.ic}</span>
                  <span className="prj-nm">{tr(s.name)}</span>
                  <span className="prj-sub">{tr(s.sub)}</span>
                </button>
              ))}
            </div>
            <p className="small" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Har kim boshqa uslub tanlasa, sinfda bir xil sayt chiqmaydi.', ru: 'Если каждый выберет свой стиль, одинаковых сайтов в классе не будет.' })}</p>
            <div className="frame-soft"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu matn — <b>ish asbobi</b>, koding mashqi emas: uni qo'lda ko'chirmaysiz, nusxalab AI'ga berasiz.</>, ru: <>Этот текст — <b>рабочий инструмент</b>, а не упражнение по кодингу: его не переписывают руками, а копируют и отдают AI.</> })}</p></div>
          </Col>
          <Col>
            {st ? (
              <div className="pr-panel fade-step" key={style}>
                <div className="pr-head">
                  <span className="pr-lbl">📝 {tr({ uz: 'AI uchun topshiriq', ru: 'Задание для AI' })}</span>
                  <button className={`pr-copy ${copied ? 'ok' : ''}`} onClick={copy}>{copied ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: '📋 Nusxa olish', ru: '📋 Копировать' })}</button>
                </div>
                <pre className="pr-body">{text}</pre>
              </div>
            ) : (
              <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Chapdan uslubni tanlang — topshiriq shu yerda chiqadi', ru: 'Выберите стиль слева — задание появится здесь' })}</p></div>
            )}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5 — AI'DAN KOD -> VS CODE (o'quvchi o'zi qiladi) =====
const Screen5 = (props) => {
  const STEPS = [
    { id: 'ai', nav: { uz: 'AI', ru: 'AI' },
      t: { uz: "Nusxalagan topshiriqni AI chatiga qo'ying va yuboring", ru: 'Вставьте скопированное задание в чат AI и отправьте' },
      d: { uz: 'Javobda har fayl alohida chiqadi: index.html, style.css va qolganlari.', ru: 'В ответе каждый файл будет отдельно: index.html, style.css и остальные.' },
      help: { uz: "Javob chala tugasa — «davom et» deb yozing, AI qolgan fayllarni beradi.", ru: 'Если ответ оборвался — напишите «продолжи», и AI выдаст остальные файлы.' },
      res: () => <Preview title="AI chat" minH={150}><div style={{ ...winBox, minHeight: 112, alignItems: 'stretch' }}><span className="mono small" style={{ color: T.ink3 }}>{tr({ uz: 'siz:', ru: 'вы:' })}</span><span className="mono small" style={{ background: T.bg, borderRadius: 8, padding: '7px 10px' }}>{tr({ uz: 'Men veb-sayt qurmoqchiman…', ru: 'Я хочу сделать веб-сайт…' })}</span><span className="mono small" style={{ color: T.success, fontWeight: 700 }}>AI: index.html · style.css · …</span></div></Preview> },
    { id: 'folder', nav: { uz: 'papka', ru: 'папка' },
      t: { uz: "VS Code'da yangi papka oching: `mening-saytim`", ru: 'Откройте в VS Code новую папку: `mening-saytim`' },
      d: { uz: "File → Open Folder. Papka bo'sh bo'lsin.", ru: 'File → Open Folder. Папка должна быть пустой.' },
      help: { uz: "Papkani avval ish stolida yarating, keyin VS Code'dan oching.", ru: 'Сначала создайте папку на рабочем столе, потом откройте её из VS Code.' },
      res: () => <div className="term"><span className="term-row"><span className="term-out">mening-saytim/</span></span><span className="term-row"><span className="term-cmd">  {tr({ uz: "(hozircha bo'sh)", ru: '(пока пусто)' })}</span></span></div> },
    { id: 'files', nav: { uz: 'fayllar', ru: 'файлы' },
      t: { uz: 'Har fayl uchun shu nomdagi fayl yarating va kodini nusxalang', ru: 'Создайте файл с таким же именем и вставьте в него код' },
      d: { uz: 'index.html, style.css va menyudagi har sahifa uchun bittadan .html fayl.', ru: 'index.html, style.css и по одному .html на каждую страницу меню.' },
      help: { uz: "Fayl nomi AI yozgani bilan aynan bir xil bo'lsin: bitta harf farq qilsa, sahifa ochilmaydi.", ru: 'Имя файла должно точно совпадать с тем, что написал AI: одна буква разницы — и страница не откроется.' },
      res: () => <div className="term"><span className="term-row"><span className="term-out">mening-saytim/</span></span><span className="term-row"><span className="term-cmd">  index.html</span></span><span className="term-row"><span className="term-cmd">  style.css</span></span><span className="term-row"><span className="term-cmd">  menyu.html</span></span></div> },
    { id: 'open', nav: { uz: 'brauzer', ru: 'браузер' },
      t: { uz: "index.html'ni brauzerda oching", ru: 'Откройте index.html в браузере' },
      d: { uz: 'Sayt chiqdimi? Menyudagi havolalarni bosib, sahifalarni tekshiring.', ru: 'Сайт открылся? Нажмите ссылки в меню и проверьте страницы.' },
      help: { uz: "Sahifa oq bo'lsa — index.html ichida kod bor-yo'qligini tekshiring.", ru: 'Если страница белая — проверьте, есть ли код внутри index.html.' },
      res: () => <Preview title="index.html" minH={150}><MiniSite name="Aziza" /></Preview> },
  ];
  return <DoScreen {...props} practice steps={STEPS}
    eyebrow={tr({ uz: 'Amaliyot · kod', ru: 'Практика · код' })}
    taskLabel={tr({ uz: "Kodni VS Code'ga ko'chirish", ru: 'Перенос кода в VS Code' })}
    title={tr({ uz: <>Kodni oling va <span className="italic" style={{ color: T.accent }}>VS Code'ga</span> joylang</>, ru: <>Заберите код и положите его <span className="italic" style={{ color: T.accent }}>в VS Code</span></> })}
    mentor={tr({ uz: 'Qadamlar birma-bir ochiladi. Har birini kompyuteringizda bajaring va «✓ Bajardim»ni bosing.', ru: 'Шаги открываются по одному. Выполните каждый на своём компьютере и нажмите «✓ Сделал(а)».' })} />;
};

// ===== SCREEN 6 — TEST 2 =====
const Screen6 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · 2-savol', ru: 'Проверка · вопрос 2' })}
    questionText="Sayt papkasi ochilganda brauzer birinchi qaysi faylni qidiradi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: 'Sayt papkasi ochilganda brauzer birinchi qaysi faylni qidiradi?', ru: 'Какой файл браузер ищет первым, когда открывает папку сайта?' })}</h2></>}
    options={[
      { uz: '`style.css`', ru: '`style.css`' },
      { uz: '`rasm.jpg`', ru: '`rasm.jpg`' },
      { uz: '`index.html`', ru: '`index.html`' },
      { uz: '`netlify.txt`', ru: '`netlify.txt`' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! Bosh sahifa doim `index.html` deb nomlanadi. Shuning uchun AI bergan bosh sahifa faylini aynan shu nom bilan saqlaysiz.", ru: 'Верно! Главная страница всегда называется `index.html`. Поэтому файл главной страницы от AI вы сохраняете именно под этим именем.' }}
    explainWrong={{
      0: { uz: "`style.css` — bezak fayli. Brauzer avval bosh sahifani, ya'ni `index.html` ni qidiradi.", ru: '`style.css` — файл оформления. Браузер сначала ищет главную страницу, то есть `index.html`.' },
      1: { uz: "Rasm — sahifa ichidagi bo'lak. Bosh sahifa fayli `index.html` deb nomlanadi.", ru: 'Картинка — часть страницы. Файл главной страницы называется `index.html`.' },
      3: { uz: 'Bunday fayl kerak emas. Bosh sahifa fayli `index.html` deb nomlanadi.', ru: 'Такой файл не нужен. Файл главной страницы называется `index.html`.' },
      default: { uz: 'Bosh sahifa fayli `index.html` deb nomlanadi.', ru: 'Файл главной страницы называется `index.html`.' }
    }} />
);

// ===== SCREEN 7 — GITHUB'GA QO'YISH (o'quvchi o'zi qiladi) =====
const Screen7 = (props) => {
  const STEPS = [
    { id: 'repo', nav: { uz: 'repo', ru: 'репо' },
      t: { uz: 'github.com da yangi repo oching: `mening-saytim`', ru: 'Создайте на github.com новый репозиторий: `mening-saytim`' },
      d: { uz: '«+» → New repository → nomni yozing → Public → Create.', ru: '«+» → New repository → впишите имя → Public → Create.' },
      help: { uz: 'Repo — bitta loyiha kodi turadigan GitHub papkasi. Uni Git darsida ochgansiz.', ru: 'Репозиторий — папка GitHub, где лежит код одного проекта. Вы создавали такой на уроке Git.' },
      res: () => <Preview title="github.com/new" minH={150}><div className="repo" style={{ boxShadow: 'none' }}><div className="repo-top">📦 <b>mening-saytim</b> <span style={{ marginLeft: 'auto', color: T.ink3, fontSize: 11 }}>Public</span></div><div className="repo-row" style={{ cursor: 'default' }}>{tr({ uz: "hozircha fayl yo'q", ru: 'файлов пока нет' })}</div></div></Preview> },
    { id: 'commit', nav: { uz: 'commit', ru: 'коммит' },
      t: { uz: 'VS Code terminalida: `git init` → `git add .` → `git commit -m "sayt"`', ru: 'В терминале VS Code: `git init` → `git add .` → `git commit -m "sayt"`' },
      d: { uz: 'Terminalni ochish: Terminal → New Terminal.', ru: 'Открыть терминал: Terminal → New Terminal.' },
      help: { uz: "«nothing to commit» chiqsa — papkada fayl yo'q. Fayllar aynan shu papkada ekanini tekshiring.", ru: 'Если пишет «nothing to commit» — в папке нет файлов. Проверьте, что файлы лежат именно в этой папке.' },
      res: () => <div className="term"><span className="term-row"><span className="term-prompt">$ </span><span className="term-cmd">git add .</span></span><span className="term-row"><span className="term-prompt">$ </span><span className="term-cmd">git commit -m "sayt"</span></span><span className="term-row"><span className="term-ok">[main 7f3a19c] sayt</span></span></div> },
    { id: 'remote', nav: { uz: 'ulash', ru: 'связать' },
      t: { uz: 'Repo havolasini ulang: `git remote add origin <havola>` va `git branch -M main`', ru: 'Свяжите с репозиторием: `git remote add origin <ссылка>` и `git branch -M main`' },
      d: { uz: 'Havolani GitHub sahifasidagi yashil «Code» tugmasidan nusxalaysiz.', ru: 'Ссылку копируете с зелёной кнопки «Code» на странице GitHub.' },
      help: { uz: "«remote origin already exists» chiqsa — bu qadam allaqachon bajarilgan, keyingisiga o'ting.", ru: 'Если пишет «remote origin already exists» — шаг уже выполнен, идите дальше.' },
      res: () => <div className="term"><span className="term-row"><span className="term-prompt">$ </span><span className="term-cmd">git remote add origin https://github.com/…/mening-saytim.git</span></span><span className="term-row"><span className="term-prompt">$ </span><span className="term-cmd">git branch -M main</span></span></div> },
    { id: 'push', nav: { uz: 'push', ru: 'push' },
      t: { uz: "`git push -u origin main` — fayllarni GitHub'ga yuboring", ru: '`git push -u origin main` — отправьте файлы на GitHub' },
      d: { uz: "GitHub sahifasini yangilang: fayllaringiz ro'yxatda ko'rinadi.", ru: 'Обновите страницу GitHub: ваши файлы появятся в списке.' },
      help: { uz: "Parol so'rasa — brauzerda ochilgan oynadan GitHub hisobingizga kiring.", ru: 'Если просит пароль — войдите в свой GitHub в открывшемся окне браузера.' },
      res: () => <Preview title="github.com/…/mening-saytim" minH={150}><div className="repo" style={{ boxShadow: 'none' }}><div className="repo-top">📦 <b>mening-saytim</b></div><div className="repo-row" style={{ cursor: 'default' }}>📄 index.html</div><div className="repo-row" style={{ cursor: 'default' }}>🎨 style.css</div><div className="repo-row" style={{ cursor: 'default' }}>🕐 1 commit</div></div></Preview> },
  ];
  return <DoScreen {...props} practice steps={STEPS}
    eyebrow={tr({ uz: 'Amaliyot · GitHub', ru: 'Практика · GitHub' })}
    taskLabel={tr({ uz: "Saytni GitHub'ga qo'yish", ru: 'Загрузка сайта на GitHub' })}
    title={tr({ uz: <>Sayt fayllarini <span className="italic" style={{ color: T.accent }}>GitHub'ga</span> qo'ying</>, ru: <>Положите файлы сайта <span className="italic" style={{ color: T.accent }}>на GitHub</span></> })}
    mentor={tr({ uz: "Bu Git darsining davomi. Netlify kodni aynan GitHub'dan oladi.", ru: 'Это продолжение урока Git. Код Netlify забирает именно с GitHub.' })} />;
};

// ===== SCREEN 8 — NETLIFY: GITHUB BILAN KIRISH (o'quvchi o'zi qiladi) =====
const Screen8 = (props) => {
  const STEPS = [
    { id: 'open', nav: { uz: 'netlify.com', ru: 'netlify.com' },
      t: { uz: 'Brauzerda `netlify.com` saytini oching', ru: 'Откройте в браузере сайт `netlify.com`' },
      d: { uz: "Manzilni qo'lda yozing — bu rasmiy sayt.", ru: 'Наберите адрес вручную — это официальный сайт.' },
      res: () => <NetWin title="netlify.com"><span className="nfy-btn ghost">Log in</span><span className="nfy-btn">Sign up</span></NetWin> },
    { id: 'github', nav: { uz: 'GitHub', ru: 'GitHub' },
      t: { uz: '«Log in» → «Log in with GitHub» tugmasini bosing', ru: 'Нажмите «Log in» → «Log in with GitHub»' },
      d: { uz: "Alohida parol o'ylab topmaysiz: GitHub hisobingiz yetadi.", ru: 'Отдельный пароль придумывать не нужно: хватит вашего GitHub.' },
      help: { uz: "Tugma ko'rinmasa — sahifani pastga suring, kirish usullari ro'yxati shu yerda.", ru: 'Если кнопки не видно — прокрутите страницу вниз, список способов входа там.' },
      res: () => <NetWin title="app.netlify.com"><span className="nfy-row on">🐙 Log in with GitHub</span><span className="nfy-row">✉️ Log in with email</span></NetWin> },
    { id: 'auth', nav: { uz: 'ruxsat', ru: 'доступ' },
      t: { uz: 'GitHub sahifasida «Authorize Netlify» tugmasini bosing', ru: 'На странице GitHub нажмите «Authorize Netlify»' },
      d: { uz: "Shu bilan Netlify'ga repolaringizni ko'rishga ruxsat berasiz.", ru: 'Так вы разрешаете Netlify видеть ваши репозитории.' },
      help: { uz: "Sahifa GitHub parolini so'rasa — hisobingizga kiring va tugmani qayta bosing.", ru: 'Если страница просит пароль GitHub — войдите в аккаунт и нажмите кнопку снова.' },
      res: () => <Preview title="github.com/login/oauth" minH={150}><div style={{ ...winBox, minHeight: 112 }}><span style={{ fontSize: 24 }}>🐙</span><span className="body" style={{ margin: 0 }}>Authorize Netlify</span><span style={{ background: T.success, color: '#fff', borderRadius: 8, padding: '7px 16px', fontWeight: 700, fontSize: 13 }}>Authorize</span></div></Preview> },
    { id: 'panel', nav: { uz: 'panel', ru: 'панель' },
      t: { uz: 'Netlify boshqaruv paneli ochildi — bu sizning hisobingiz', ru: 'Открылась панель Netlify — это ваш аккаунт' },
      d: { uz: 'Tepada «Add new site» tugmasi turadi. Keyingi ekranda shundan boshlaymiz.', ru: 'Сверху есть кнопка «Add new site». С неё начнём на следующем экране.' },
      res: () => <NetWin title="app.netlify.com"><span className="nfy-live">✓ {tr({ uz: 'kirdingiz', ru: 'вы вошли' })}</span><span className="nfy-btn">Add new site</span><span className="nfy-row">{tr({ uz: "hali sayt yo'q", ru: 'сайтов пока нет' })}</span></NetWin> },
  ];
  return <DoScreen {...props} practice steps={STEPS}
    eyebrow={tr({ uz: 'Amaliyot · Netlify', ru: 'Практика · Netlify' })}
    taskLabel={tr({ uz: "Netlify'ga kirish", ru: 'Вход в Netlify' })}
    title={tr({ uz: <>Netlify'ga <span className="italic" style={{ color: T.accent }}>GitHub bilan</span> kiring</>, ru: <>Войдите в Netlify <span className="italic" style={{ color: T.accent }}>через GitHub</span></> })}
    mentor={tr({ uz: 'Yangi hisob ochmaysiz — GitHub hisobingiz bilan kirasiz.', ru: 'Новый аккаунт заводить не нужно — вы войдёте своим GitHub.' })} />;
};

// ===== SCREEN 9 — DEPLOY: REPO TANLASH -> HAVOLA (o'quvchi o'zi qiladi) =====
const Screen9 = (props) => {
  const STEPS = [
    { id: 'add', nav: { uz: 'Add new site', ru: 'Add new site' },
      t: { uz: '«Add new site» → «Import an existing project»', ru: '«Add new site» → «Import an existing project»' },
      d: { uz: "Bu — tayyor loyihani GitHub'dan olib kelish yo'li.", ru: 'Это путь «взять готовый проект с GitHub».' },
      res: () => <NetWin><span className="nfy-btn">Add new site ▾</span><span className="nfy-row on">Import an existing project</span><span className="nfy-row">Deploy manually</span></NetWin> },
    { id: 'provider', nav: { uz: 'GitHub', ru: 'GitHub' },
      t: { uz: '«Deploy with GitHub» ni tanlang', ru: 'Выберите «Deploy with GitHub»' },
      d: { uz: "Netlify sizning repolaringiz ro'yxatini ko'rsatadi.", ru: 'Netlify покажет список ваших репозиториев.' },
      help: { uz: "Ro'yxat bo'sh bo'lsa — «Configure the Netlify app» ni bosib, repongizga ruxsat bering.", ru: 'Если список пуст — нажмите «Configure the Netlify app» и дайте доступ к своему репозиторию.' },
      res: () => <NetWin><span className="nfy-row on">🐙 Deploy with GitHub</span><span className="nfy-row">GitLab</span><span className="nfy-row">Bitbucket</span></NetWin> },
    { id: 'repo', nav: { uz: 'repo', ru: 'репо' },
      t: { uz: "Ro'yxatdan `mening-saytim` repongizni bosing", ru: 'Нажмите в списке свой репозиторий `mening-saytim`' },
      d: { uz: 'Sayt aynan shu repodagi fayllardan quriladi.', ru: 'Сайт соберётся именно из файлов этого репозитория.' },
      res: () => <NetWin><span className="nfy-row on">📦 mening-saytim</span><span className="nfy-row">📦 birinchi-sayt</span><span className="nfy-row">📦 test-repo</span></NetWin> },
    { id: 'deploy', nav: { uz: 'Deploy', ru: 'Deploy' },
      t: { uz: 'Pastdagi «Deploy» tugmasini bosing va kuting', ru: 'Нажмите кнопку «Deploy» внизу и подождите' },
      d: { uz: 'Sozlamalarga tegmaysiz — ular tayyor. Kutish 1-2 daqiqa.', ru: 'Настройки не трогайте — они уже готовы. Ожидание 1–2 минуты.' },
      help: { uz: "«Failed» chiqsa — repoda `index.html` bor-yo'qligini tekshiring, keyin «Retry deploy».", ru: 'Если пишет «Failed» — проверьте, есть ли в репозитории `index.html`, затем «Retry deploy».' },
      res: () => <NetWin><span className="nfy-row">⏳ Building…</span><span className="nfy-row">📦 {tr({ uz: "fayllar ko'chirilmoqda", ru: 'файлы копируются' })}</span></NetWin> },
    { id: 'live', nav: { uz: 'havola', ru: 'ссылка' },
      t: { uz: '«Site is live» yozuvi va havola chiqadi — havolani nusxalang', ru: 'Появится «Site is live» и ссылка — скопируйте её' },
      d: { uz: "Havola shunday ko'rinishda bo'ladi: `nomi.netlify.app`.", ru: 'Ссылка выглядит так: `nomi.netlify.app`.' },
      help: { uz: 'Havolani keyin ham topasiz: Netlify panelida sayt nomini bossangiz, u tepada turadi.', ru: 'Ссылку можно найти и позже: нажмите имя сайта в панели Netlify — она сверху.' },
      res: () => <NetWin><span className="nfy-live">✓ Site is live</span><span className="nfy-link">https://mening-saytim.netlify.app</span><span className="nfy-row">{tr({ uz: 'havolani nusxalang', ru: 'скопируйте ссылку' })} 📋</span></NetWin> },
  ];
  return <DoScreen {...props} practice steps={STEPS}
    eyebrow={tr({ uz: 'Amaliyot · deploy', ru: 'Практика · деплой' })}
    taskLabel={tr({ uz: 'Deploy va havola', ru: 'Деплой и ссылка' })}
    title={tr({ uz: <>Reponi tanlang va saytni <span className="italic" style={{ color: T.accent }}>internetga chiqaring</span></>, ru: <>Выберите репозиторий и <span className="italic" style={{ color: T.accent }}>опубликуйте сайт</span></> })}
    mentor={tr({ uz: <>Saytni serverga joylab internetga chiqarish <b style={{ color: T.ink }}>deploy</b> deyiladi. Besh qadamdan keyin havolangiz tayyor.</>, ru: <>Разместить сайт на сервере и открыть в интернете — это <b style={{ color: T.ink }}>деплой</b>. Через пять шагов ссылка будет готова.</> })} />;
};

// ===== SCREEN 10 — TEST 3 =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · 3-savol', ru: 'Проверка · вопрос 3' })}
    questionText="Sayt Netlify orqali internetga qanday tartibda chiqadi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri tartibni tanlang", ru: 'Выберите верный порядок' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: 'Sayt Netlify orqali internetga qanday tartibda chiqadi?', ru: 'В каком порядке сайт выходит в интернет через Netlify?' })}</h2></>}
    options={[
      { uz: "Netlify'ga kirish → deploy → kodni yozish → GitHub", ru: 'Войти в Netlify → деплой → написать код → GitHub' },
      { uz: "Kodni GitHub'ga qo'yish → Netlify'da reponi tanlash → deploy → havola", ru: 'Положить код на GitHub → выбрать репо в Netlify → деплой → ссылка' },
      { uz: "Havolani olish → deploy → kodni GitHub'ga qo'yish", ru: 'Получить ссылку → деплой → положить код на GitHub' },
      { uz: "Sayt papkasini Telegram'ga tashlash → havolani olish", ru: 'Скинуть папку сайта в Telegram → получить ссылку' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! Avval kod GitHub'da bo'ladi, keyin Netlify o'sha repodan kodni oladi, deploy qiladi va havola beradi. Bugun siz aynan shu tartibda ishladingiz.", ru: 'Верно! Сначала код попадает на GitHub, потом Netlify забирает его из репозитория, делает деплой и выдаёт ссылку. Сегодня вы работали именно в этом порядке.' }}
    explainWrong={{
      0: { uz: "Kod avval yoziladi va GitHub'ga qo'yiladi: Netlify bo'sh repodan sayt qura olmaydi.", ru: 'Сначала пишут код и кладут на GitHub: из пустого репозитория Netlify сайт не соберёт.' },
      2: { uz: 'Havola eng oxirida chiqadi: u deploy natijasi.', ru: 'Ссылка появляется в самом конце: это результат деплоя.' },
      3: { uz: "Telegram fayl yuboradi, sayt ochmaydi. Kod GitHub'ga, keyin Netlify'ga boradi.", ru: 'Telegram пересылает файл, а не публикует сайт. Код идёт на GitHub, потом в Netlify.' },
      default: { uz: "Kodni GitHub'ga qo'yish → Netlify'da reponi tanlash → deploy → havola.", ru: 'Положить код на GitHub → выбрать репо в Netlify → деплой → ссылка.' }
    }} />
);

// ===== SCREEN 11 — HAVOLANI SINASH VA SAQLASH =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const isMentorLive = !!(_gate.live && _gate.live.mode === 'mentor');
  const [url, setUrl] = useState(() => storedAnswer?.picked || siteUrlRead());
  const [saved, setSaved] = useState(false);
  const clean = url.trim();
  const looksOk = /\./.test(clean) && clean.length > 6;
  const save = () => {
    siteUrlWrite(clean);
    setSaved(true);
    onAnswer(screen, { correct: true, picked: clean, stage: 'artefakt', screenIdx: screen });
    setTimeout(() => setSaved(false), 2200);
  };
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: '' }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Havolangiz', ru: 'Ваша ссылка' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Havolani <span className="italic" style={{ color: T.accent }}>telefonda</span> oching</>, ru: <>Откройте ссылку <span className="italic" style={{ color: T.accent }}>на телефоне</span></> })}</h2></div>
        <Mentor>{tr({ uz: "Havolani telefoningizda oching va do'stingizga yuboring. Keyin uni pastdagi maydonga yozib qo'ying.", ru: 'Откройте ссылку на телефоне и отправьте другу. Потом впишите её в поле ниже.' })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Telefonda shunday ko'rinadi", ru: 'На телефоне это выглядит так' })}</p>
            <div className="phone fade-up delay-1">
              <div className="phone-scr">
                <div className="phone-bar">{clean || 'mening-saytim.netlify.app'}</div>
                <MiniSite name="Aziza" />
              </div>
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Havolangizni saqlab qo'ying", ru: 'Сохраните свою ссылку' })}</p>
            <input className="text-input fade-up delay-1" value={url} onChange={e => setUrl(e.target.value)} spellCheck={false} autoCapitalize="off" autoCorrect="off" placeholder="mening-saytim.netlify.app" />
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={!looksOk || isMentorLive} onClick={save}>{saved ? tr({ uz: '✓ Saqlandi', ru: '✓ Сохранено' }) : tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
            <p className="small" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: "Maydon ixtiyoriy: sayt hali tayyor bo'lmasa ham davom etasiz.", ru: 'Поле не обязательное: даже если сайт ещё не готов, вы идёте дальше.' })}</p>
            {clean && looksOk && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Endi shu havolani bilgan <b>har kim</b> saytingizni ochadi.</>, ru: <>Теперь ваш сайт откроет <b>каждый</b>, кто знает эту ссылку.</> })}</p></div>}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY TEST =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy savol', ru: 'Финальный вопрос' })}
    questionText="Do'stingiz saytingizni telefonida ochishi uchun unga nima yuborasiz?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Yakuniy savol', ru: 'Финальный вопрос' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: "Do'stingiz saytingizni telefonida ochishi uchun unga nima yuborasiz?", ru: 'Что вы отправите другу, чтобы он открыл ваш сайт на телефоне?' })}</h2></>}
    options={[
      { uz: '`index.html` faylini', ru: 'Файл `index.html`' },
      { uz: 'Sayt papkasini arxiv qilib', ru: 'Папку сайта архивом' },
      { uz: 'GitHub parolimni', ru: 'Свой пароль от GitHub' },
      { uz: 'Netlify bergan havolani', ru: 'Ссылку, которую выдал Netlify' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "To'g'ri! Sayt endi internetda: havolaning o'zi yetadi. Fayl yuborish ham, parol berish ham kerak emas.", ru: 'Верно! Сайт теперь в интернете: хватает самой ссылки. Ни файл отправлять, ни пароль давать не нужно.' }}
    explainWrong={{
      0: { uz: "Bitta fayl do'stning telefonida sayt bo'lib ochilmaydi. Netlify bergan havolani yuboring.", ru: 'Один файл на телефоне друга сайтом не откроется. Отправьте ссылку от Netlify.' },
      1: { uz: 'Arxivni ochish uchun kompyuter kerak. Havola esa telefonda ham ochiladi.', ru: 'Чтобы открыть архив, нужен компьютер. А ссылка открывается и на телефоне.' },
      2: { uz: "Parol hech qachon yuborilmaydi. Sayt uchun havolaning o'zi yetadi.", ru: 'Пароль отправлять нельзя никогда. Для сайта достаточно самой ссылки.' },
      default: { uz: 'Netlify bergan havolani yuborasiz.', ru: 'Вы отправляете ссылку, которую выдал Netlify.' }
    }} />
);

// ===== SCREEN 13 — UYGA VAZIFA =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const url = siteUrlRead();
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const TASKS = [
    { b: { uz: 'Saytni tugating', ru: 'Доведите сайт до конца' }, t: { uz: '— hamma sahifa ochilsin, menyu ishlasin', ru: '— чтобы открывались все страницы и работало меню' } },
    { b: { uz: "Matnni o'zingiznikiga almashtiring", ru: 'Замените текст на свой' }, t: { uz: "— AI yozgan namuna matn o'rniga", ru: '— вместо примерного текста от AI' } },
    { b: { uz: 'Qayta push qiling', ru: 'Сделайте push ещё раз' }, t: { uz: "— `git add .` → `git commit` → `git push`, sayt o'zi yangilanadi", ru: '— `git add .` → `git commit` → `git push`, сайт обновится сам' } },
    { b: { uz: 'Havolani yuboring', ru: 'Отправьте ссылку' }, t: { uz: "— mentorga va do'stlaringizga", ru: '— ментору и друзьям' } },
  ];
  return (
    <Stage eyebrow={tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Amaliy topshiriqni bajarish →', ru: 'Выполнить практическое задание →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Uyda: saytni tugating va <span className="italic" style={{ color: T.accent }}>havolani yuboring</span></>, ru: <>Дома: доделайте сайт и <span className="italic" style={{ color: T.accent }}>отправьте ссылку</span></> })}</h2></div>
        <Mentor>{tr({ uz: "Sayt bugun bitmagan bo'lsa ham xavotir olmang: uyda tugatasiz. Topshiriq bitta — havolani yuborish.", ru: 'Если сайт сегодня не закончен, ничего страшного: доделаете дома. Задание одно — отправить ссылку.' })}</Mentor>
        <Split>
          <div className="card hw fade-up delay-1">
            <div className="card-lbl" style={{ color: T.accent }}>📝 {tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div>
            <ul>{TASKS.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul>
            <p className="hw-note">{tr({ uz: 'Havolani mentorga yuborsangiz, vazifa bajarilgan hisoblanadi.', ru: 'Задание считается выполненным, когда вы отправите ссылку ментору.' })}</p>
          </div>
          <Col>
            <p className="flow-label">{tr({ uz: 'Yuboriladigan havola', ru: 'Ссылка, которую нужно отправить' })}</p>
            <div className="frame">
              <p className="mono" style={{ margin: 0, color: url ? T.success : T.ink3, wordBreak: 'break-all', fontSize: 14 }}>{url || tr({ uz: 'havola hali saqlanmagan', ru: 'ссылка пока не сохранена' })}</p>
            </div>
            <div className="frame-soft"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu havola <b>Demo Day</b> repetitsiyasida ham kerak bo'ladi.</>, ru: <>Эта ссылка понадобится и на репетиции <b>Demo Day</b>.</> })}</p></div>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// 🃏 FLASHCARDS — aktiv takrorlash (3D flip + o'z-o'zini baholash).
const DEPLOY_FLASHCARDS = [
  { front: { uz: 'Sayt papkangizni internetda saqlab, havola beradigan xizmat qaysi?', ru: 'Какая служба хранит папку вашего сайта в интернете и выдаёт ссылку?' }, back: 'Netlify', note: { uz: 'Unga GitHub hisobingiz bilan kiriladi', ru: 'Входят в неё своим аккаунтом GitHub' } },
  { front: { uz: 'Saytni serverga joylab internetga chiqarish qanday ataladi?', ru: 'Как называется размещение сайта на сервере и вывод его в интернет?' }, back: { uz: 'Deploy', ru: 'Деплой' }, note: { uz: 'Deploydan keyin sayt havola orqali ochiladi', ru: 'После деплоя сайт открывается по ссылке' } },
  { front: { uz: 'Brauzer sayt papkasidan birinchi qaysi faylni qidiradi?', ru: 'Какой файл браузер ищет в папке сайта первым?' }, back: 'index.html', note: { uz: 'Bosh sahifa doim shu nom bilan', ru: 'Главная страница всегда с этим именем' } },
  { front: { uz: 'Kodingiz internetda saqlanadigan joy qaysi?', ru: 'Где в интернете хранится ваш код?' }, back: 'GitHub', note: { uz: 'Netlify kodni aynan shu yerdan oladi', ru: 'Netlify забирает код именно оттуда' } },
  { front: { uz: 'Bitta loyiha kodi turadigan GitHub papkasi qanday ataladi?', ru: 'Как называется папка GitHub с кодом одного проекта?' }, back: { uz: 'Repo', ru: 'Репозиторий' }, note: { uz: 'Deploy qilishda aynan shu repo tanlanadi', ru: 'При деплое выбирают именно этот репозиторий' } },
  { front: { uz: "Netlify uchun alohida parol o'ylab topish kerakmi?", ru: 'Нужно ли придумывать отдельный пароль для Netlify?' }, back: { uz: "Yo'q — GitHub bilan kiriladi", ru: 'Нет — вход через GitHub' }, note: { uz: '«Log in with GitHub» tugmasi', ru: 'Кнопка «Log in with GitHub»' } },
  { front: { uz: "Kodni GitHub'ga yuboradigan buyruq qaysi?", ru: 'Какая команда отправляет код на GitHub?' }, back: 'git push', note: { uz: 'Undan oldin: git add . va git commit', ru: 'Перед ней: git add . и git commit' } },
  { front: { uz: 'Deploydan keyin Netlify sizga nima beradi?', ru: 'Что выдаёт Netlify после деплоя?' }, back: { uz: 'Havola', ru: 'Ссылку' }, note: { uz: "Ko'rinishi: nomi.netlify.app", ru: 'Выглядит так: nomi.netlify.app' } },
  { front: { uz: 'Sayt sahifalarini bir-biriga nima ulaydi?', ru: 'Что связывает страницы сайта между собой?' }, back: { uz: 'Menyudagi havolalar', ru: 'Ссылки в меню' }, note: { uz: 'Menyu har sahifada bir xil turadi', ru: 'Меню одинаковое на каждой странице' } },
  { front: { uz: "AI'dan kod so'raganda unga nima berasiz?", ru: 'Что вы даёте AI, когда просите код?' }, back: { uz: 'Aniq topshiriq', ru: 'Точное задание' }, note: { uz: "Shart qancha aniq bo'lsa, kod shuncha mos chiqadi", ru: 'Чем точнее условия, тем точнее код' } },
  { front: { uz: "Sayt telefonda ham chiroyli ko'rinishi nima deyiladi?", ru: 'Как называется то, что сайт красиво смотрится и на телефоне?' }, back: 'responsive', note: { uz: 'Topshiriqda shu shartni alohida yozdik', ru: 'Мы записали это условие в задании отдельно' } },
  { front: { uz: "Deploydan keyin saytni kim ko'ra oladi?", ru: 'Кто сможет увидеть сайт после деплоя?' }, back: { uz: 'Havolani bilgan har kim', ru: 'Каждый, кто знает ссылку' }, note: { uz: "Boshqa shahardagi do'stingiz ham", ru: 'И друг из другого города тоже' } },
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
          <div className="fc-face fc-back">{fcAnswer(tr(card.back))}{card.note && <span className="fc-note">{tr(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>✗ {tr({ uz: 'Takrorlash', ru: 'Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })}</button></div>)
        : (<p className="fc-hint">👆 {tr({ uz: "Kartani bosing — javobni ko'rasiz", ru: 'Нажмите на карточку — увидите ответ' })}</p>)}
    </div>
  );
}

// ===== SCREEN: FLASHCARD TAKRORLASH =====
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'К финалу →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={DEPLOY_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 16 — YAKUN =====
const Screen16 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
  const url = siteUrlRead();
  const RECAP = [
    { uz: 'Netlify sayt papkasini internetda saqlaydi va havola beradi', ru: 'Netlify хранит папку сайта в интернете и выдаёт ссылку' },
    { uz: "AI'ga aniq topshiriq berib, sayt kodini olish", ru: 'Получение кода сайта по точному заданию для AI' },
    { uz: "Kodni GitHub repoga qo'yish: add, commit, push", ru: 'Загрузка кода в репозиторий GitHub: add, commit, push' },
    { uz: "Netlify'ga GitHub hisobi bilan kirish", ru: 'Вход в Netlify через аккаунт GitHub' },
    { uz: 'Reponi tanlab deploy qilish va havolani olish', ru: 'Выбор репозитория, деплой и получение ссылки' },
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Saytingiz endi <span className="italic" style={{ color: T.accent }}>internetda</span>.</>, ru: <>Ваш сайт теперь <span className="italic" style={{ color: T.accent }}>в интернете</span>.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
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
        {!isMentorL && hwOpen && <div className="card hw fade-up d4">
            <div className="card-lbl" style={{ color: T.accent }}>🔗 {tr({ uz: 'Sizning havolangiz', ru: 'Ваша ссылка' })}</div>
            <p className="mono" style={{ margin: '0 0 10px', color: url ? T.success : T.ink3, wordBreak: 'break-all', fontSize: 14 }}>{url || tr({ uz: 'havola hali saqlanmagan', ru: 'ссылка пока не сохранена' })}</p>
            <p className="hw-note">{tr({ uz: 'Uyda saytni tugatib, havolani mentorga yuboring.', ru: 'Доделайте сайт дома и отправьте ссылку ментору.' })}</p>
          </div>}
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
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
// Podium yorliqlari (scored indeks -> qisqa nom)
const Q_LABELS = { 2: { uz: 'Netlify vazifasi', ru: 'Задача Netlify' }, 6: { uz: 'Bosh sahifa fayli', ru: 'Файл главной страницы' }, 10: { uz: 'Deploy tartibi', ru: 'Порядок деплоя' }, 12: { uz: 'Havola (yakuniy)', ru: 'Ссылка (финал)' } };

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

// Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi).
// Praktika ekranlari -1 sentinel: ular ballanmaydi, faqat «bajardim» signali boradi.
const INLINE_KEYS = { s2: 0, s6: 2, s10: 1, s12: 3, s3: -1, s4: -1, s5: -1, s7: -1, s8: -1, s9: -1, s11: -1 };

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
  { ch: '.app',     l: 85, t: 9,  s: 40, c: 'rgba(255,110,70,0.14)',  d: 23, dl: 1.5 },
  { ch: 'netlify',  l: 8,  t: 72, s: 30, c: 'rgba(80,200,255,0.13)',  d: 27, dl: 0.8 },
  { ch: 'index.html', l: 76, t: 68, s: 26, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: '🚀',       l: 45, t: 86, s: 40, c: 'rgba(203,173,255,0.9)',   d: 25, dl: 1.1 },
  { ch: 'https://', l: 64, t: 24, s: 24, c: 'rgba(203,173,255,0.14)',  d: 17, dl: 0.4 },
  { ch: '🌍',       l: 26, t: 34, s: 34, c: 'rgba(203,173,255,0.9)',   d: 20, dl: 1.9 },
  { ch: 'LIVE',     l: 55, t: 5,  s: 26, c: 'rgba(120,235,175,0.13)',  d: 22, dl: 0.6 },
  { ch: 'deploy',   l: 92, t: 44, s: 24, c: 'rgba(203,173,255,0.10)',  d: 24, dl: 1.3 },
  { ch: 'netlify.app', l: 2, t: 46, s: 20, c: 'rgba(203,173,255,0.12)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: 'Netlify nima qiladi?', ru: 'Что делает Netlify?' }, opts: [{ uz: 'Sayt papkasini internetda saqlab, havola beradi', ru: 'Хранит папку сайта в интернете и выдаёт ссылку' }, { uz: 'Kodni chiroyli ranglar bilan bezaydi', ru: 'Красиво раскрашивает код' }, { uz: 'Internet tezligini oshiradi', ru: 'Увеличивает скорость интернета' }, { uz: 'Telefonni zaryadlaydi', ru: 'Заряжает телефон' }], correct: 0 },
  { q: { uz: 'Brauzer sayt papkasidan birinchi qaysi faylni qidiradi?', ru: 'Какой файл браузер ищет в папке сайта первым?' }, opts: ['style.css', 'index.html', 'rasm.jpg', 'netlify.txt'], correct: 1 },
  { q: { uz: 'Saytni serverga joylab internetga chiqarish qanday ataladi?', ru: 'Как называется размещение сайта на сервере и вывод его в интернет?' }, opts: [{ uz: 'Commit', ru: 'Коммит' }, { uz: 'Restart', ru: 'Рестарт' }, { uz: 'Deploy', ru: 'Деплой' }, { uz: 'Zoom', ru: 'Zoom' }], correct: 2 },
  { q: { uz: "Netlify'ga qanday kiriladi?", ru: 'Как входят в Netlify?' }, opts: [{ uz: "Yangi parol o'ylab topib", ru: 'Придумав новый пароль' }, { uz: 'SMS kod bilan', ru: 'По коду из SMS' }, { uz: 'Bank kartasi bilan', ru: 'По банковской карте' }, { uz: 'GitHub hisobi bilan', ru: 'Через аккаунт GitHub' }], correct: 3 },
  { q: { uz: 'Netlify sayt kodini qayerdan oladi?', ru: 'Откуда Netlify берёт код сайта?' }, opts: [{ uz: 'Telegram kanalidan', ru: 'Из Telegram-канала' }, { uz: 'Elektron pochtadan', ru: 'Из электронной почты' }, { uz: 'GitHub repodan', ru: 'Из репозитория GitHub' }, { uz: 'Flesh kartadan', ru: 'С флешки' }], correct: 2 },
  { q: { uz: "Kodni GitHub'ga yuboradigan buyruq qaysi?", ru: 'Какая команда отправляет код на GitHub?' }, opts: ['git push', 'git open', 'git send', 'git deploy'], correct: 0 },
  { q: { uz: 'Deploydan keyin Netlify sizga nima beradi?', ru: 'Что выдаёт Netlify после деплоя?' }, opts: [{ uz: 'Yangi kompyuter', ru: 'Новый компьютер' }, { uz: 'Sayt havolasini', ru: 'Ссылку на сайт' }, { uz: 'Yangi parol', ru: 'Новый пароль' }, { uz: 'Bepul internet', ru: 'Бесплатный интернет' }], correct: 1 },
  { q: { uz: "Do'stingiz saytni telefonida ochishi uchun unga nima yuborasiz?", ru: 'Что вы отправите другу, чтобы он открыл сайт на телефоне?' }, opts: [{ uz: 'index.html faylini', ru: 'Файл index.html' }, { uz: 'GitHub parolimni', ru: 'Свой пароль от GitHub' }, { uz: 'Sayt papkasini arxiv qilib', ru: 'Папку сайта архивом' }, { uz: 'Sayt havolasini', ru: 'Ссылку на сайт' }], correct: 3 },
  { q: { uz: 'Sayt sahifalari bir-biriga nima orqali ulanadi?', ru: 'Через что страницы сайта связаны между собой?' }, opts: [{ uz: 'Menyudagi havolalar orqali', ru: 'Через ссылки в меню' }, { uz: 'Rasmlar orqali', ru: 'Через картинки' }, { uz: 'Parol orqali', ru: 'Через пароль' }, { uz: 'Fayl hajmi orqali', ru: 'Через размер файла' }], correct: 0 },
  { q: { uz: "AI'ga sayt topshirig'ini yozganda nima ko'rsatiladi?", ru: 'Что указывают в задании для AI при заказе сайта?' }, opts: [{ uz: 'Faqat sevimli rang', ru: 'Только любимый цвет' }, { uz: 'Faqat ism', ru: 'Только имя' }, { uz: "Sahifalar ro'yxati va shartlar", ru: 'Список страниц и условия' }, { uz: 'Hech narsa', ru: 'Ничего' }], correct: 2 },
  { q: { uz: "Sayt telefonda ham chiroyli ko'rinishi qanday ataladi?", ru: 'Как называется то, что сайт красиво смотрится и на телефоне?' }, opts: ['deploy', 'commit', 'hosting', 'responsive'], correct: 3 },
  { q: { uz: "Deploydan keyin saytni kim ko'ra oladi?", ru: 'Кто сможет увидеть сайт после деплоя?' }, opts: [{ uz: "Faqat men, o'z kompyuterimda", ru: 'Только я, на своём компьютере' }, { uz: 'Havolani bilgan har kim', ru: 'Каждый, кто знает ссылку' }, { uz: 'Faqat mentor', ru: 'Только ментор' }, { uz: 'Faqat GitHub xodimlari', ru: 'Только сотрудники GitHub' }], correct: 1 },
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
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
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
    // Yakuniy savol ham oddiy test ekrani (QuestionScreen) — javobni O'ZI serverga yozadi.
    // Bu yerdan qo'shimcha submitAnswer YO'Q: aks holda picked=0 bilan dubl yozuv ketardi.
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, ScreenPodium, ScreenFlashcards, Screen16];
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
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
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
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
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
        /* === 🃏 FLASHCARDS === */
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

        /* === «O'ZIM QILDIM» qadamlari (bittalab ochiladi) === */
        .dsx { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 16px; padding: 14px 15px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .dsx-head { display: flex; align-items: center; gap: 10px; }
        .dsx-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; letter-spacing: 0.01em; }
        .dsx-count { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink3}; background: ${T.bg}; border-radius: 99px; padding: 3px 10px; }
        .dsx-count.ok { color: ${T.success}; background: ${T.successSoft}; }
        .dsx-row { display: flex; align-items: flex-start; gap: 11px; border-radius: 12px; padding: 10px 12px; background: ${T.bg}; transition: background 0.25s, opacity 0.25s; }
        .dsx-row.open { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px rgba(255,79,40,0.35); animation: fade-step 0.3s ease-out; }
        .dsx-row.on { background: ${T.successSoft}; }
        .dsx-row.lock { opacity: 0.45; }
        .dsx-num { width: 24px; height: 24px; flex-shrink: 0; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; background: ${T.paper}; color: ${T.ink2}; box-shadow: 0 3px 9px -4px rgba(${T.shadowBase},0.25); }
        .dsx-row.on .dsx-num { background: ${T.success}; color: #fff; }
        .dsx-row.open .dsx-num { background: ${T.accent}; color: #fff; }
        .dsx-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 7px; }
        .dsx-t { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,14.5px); color: ${T.ink}; line-height: 1.4; }
        .dsx-row.on .dsx-t { color: ${T.success}; }
        .dsx-d { font-family: 'Manrope', sans-serif; font-size: 12.5px; color: ${T.ink2}; line-height: 1.45; }
        .dsx-help { font-size: 12px; color: ${T.ink2}; }
        .dsx-help summary { cursor: pointer; font-weight: 600; color: ${T.accent}; list-style: none; }
        .dsx-help summary::-webkit-details-marker { display: none; }
        .dsx-help summary::before { content: '? '; font-weight: 800; }
        .dsx-help span { display: block; margin-top: 5px; line-height: 1.45; }
        .dsx-btn { align-self: flex-start; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; border: none; border-radius: 10px; padding: 8px 15px; background: ${T.ink}; color: ${T.bg}; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -5px rgba(${T.shadowBase},0.3); }
        .dsx-btn:hover:not(:disabled) { background: ${T.accent}; }
        .dsx-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .dsx-undo { flex-shrink: 0; align-self: center; border: none; background: transparent; color: ${T.ink3}; font-size: 14px; cursor: pointer; padding: 2px 4px; border-radius: 8px; }
        .dsx-undo:hover { color: ${T.accent}; background: ${T.paper}; }
        .dsx-done { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.success}; }

        /* === Terminal va repo maketlari === */
        .term { background: ${CODE.bg}; border-radius: 12px; padding: 14px 16px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); display: flex; flex-direction: column; gap: 5px; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.6vw,13.5px); line-height: 1.5; overflow-x: auto; }
        .term-row { white-space: pre-wrap; word-break: break-word; }
        .term-prompt { color: ${CODE.str}; } .term-cmd { color: ${CODE.attr}; } .term-out { color: ${CODE.punct}; } .term-ok { color: ${CODE.str}; }
        .repo { background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
        .repo-top { display: flex; align-items: center; gap: 8px; padding: 12px 15px; border-bottom: 1px solid rgba(167,166,162,0.25); font-family: 'JetBrains Mono'; font-size: 13px; color: ${T.ink}; }
        .repo-row { display: flex; align-items: center; gap: 10px; padding: 11px 15px; font-family: 'JetBrains Mono'; font-size: 13px; color: ${T.ink2}; }

        /* === Netlify oynasi maketi === */
        .nfy { background: #0e1726; display: flex; flex-direction: column; gap: 9px; }
        .nfy-head { display: flex; align-items: center; gap: 9px; }
        .nfy-logo { width: 24px; height: 24px; border-radius: 7px; background: #00C7B7; color: #0e1726; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; }
        .nfy-name { color: #fff; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; }
        .nfy-btn { align-self: flex-start; background: #00C7B7; color: #06231f; border-radius: 8px; padding: 7px 13px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; }
        .nfy-btn.ghost { background: transparent; color: #9FB4D8; box-shadow: inset 0 0 0 1.5px #2a3a52; }
        .nfy-row { display: flex; align-items: center; gap: 9px; border-radius: 9px; padding: 8px 11px; background: rgba(255,255,255,0.05); color: #E8E5DD; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
        .nfy-row.on { background: rgba(0,199,183,0.14); box-shadow: inset 0 0 0 1.5px #00C7B7; }
        .nfy-live { color: #7DD181; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; }
        .nfy-link { color: #8ED8FF; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; word-break: break-all; }

        /* === Loyiha va uslub kartalari === */
        .prj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
        .prj-card { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; text-align: left; border: none; border-radius: 13px; padding: 13px 14px; background: ${T.paper}; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: transform 0.18s, box-shadow 0.18s, background 0.18s; }
        .prj-card:hover { transform: translateY(-2px); box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .prj-card.on { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 22px -6px rgba(255,79,40,0.28); }
        .prj-ic { font-size: 24px; }
        .prj-nm { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .prj-sub { font-family: 'Manrope', sans-serif; font-size: 12px; color: ${T.ink2}; line-height: 1.4; }
        .pick-row { display: flex; align-items: center; gap: 10px; background: ${T.successSoft}; border-radius: 12px; padding: 10px 13px; }
        .pick-redo { margin-left: auto; border: none; background: transparent; color: ${T.ink3}; cursor: pointer; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600; }
        .pick-redo:hover { color: ${T.accent}; }
        .pg-list { display: flex; flex-direction: column; gap: 8px; }
        .pg-row { display: flex; align-items: center; gap: 10px; }
        .pg-n { width: 22px; height: 22px; flex-shrink: 0; border-radius: 50%; background: ${T.bg}; color: ${T.ink2}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }
        .pg-row.on .pg-n { background: ${T.success}; color: #fff; }
        .menu-mock { display: flex; flex-wrap: wrap; gap: 8px; }
        .menu-tab { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; padding: 6px 12px; border-radius: 99px; background: ${T.bg}; color: ${T.ink2}; }
        .menu-tab.on { background: ${T.accent}; color: #fff; }

        /* === Tayyor topshiriq paneli === */
        .pr-panel { display: flex; flex-direction: column; background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
        .pr-head { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-bottom: 1px solid rgba(167,166,162,0.25); }
        .pr-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; }
        .pr-copy { margin-left: auto; border: none; border-radius: 10px; padding: 7px 14px; background: ${T.ink}; color: ${T.bg}; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; cursor: pointer; transition: background 0.18s; }
        .pr-copy:hover { background: ${T.accent}; }
        .pr-copy.ok { background: ${T.success}; color: #fff; }
        .pr-body { margin: 0; padding: 13px 15px; max-height: min(46vh, 340px); overflow-y: auto; white-space: pre-wrap; word-break: break-word; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.55; color: ${T.ink}; }

        /* === Telefon maketi (havolani sinash) === */
        .phone { display: flex; justify-content: center; }
        .phone-scr { width: min(260px, 100%); background: ${T.paper}; border-radius: 22px; padding: 12px; box-shadow: 0 12px 30px -10px rgba(${T.shadowBase},0.3), inset 0 0 0 3px ${T.line}; }
        .phone-bar { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink3}; background: ${T.bg}; border-radius: 99px; padding: 5px 10px; margin-bottom: 10px; text-align: center; word-break: break-all; }

        @media (prefers-reduced-motion: reduce) {
          .fade-up, .fade-step, .demo-swap, .dsx-row.open { animation: none !important; opacity: 1 !important; }
          .prj-card, .prj-card:hover { transition: none !important; transform: none !important; }
        }
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
