import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// FRONTEND REACT MODULI · PRAKTIKA 3 — LOYIHA KUNI: "AvtoIjara" (React + API + CRUD + Router) — PLATFORM STANDARD v16 (AUDIOSIZ)
// O'RNI: P2 (Router) dan KEYIN. O'quvchi BILADI: komponent, props, map, state, fetch (GET/POST/PUT/DELETE), CRUD, Router.
// MAQSAD: hammasini BITTA to'liq ilovaga birlashtirish. Yangi tushuncha YO'Q — INTEGRATSIYA + AGENTNI BOSHQARISH.
//        O'quvchi: (1) yaxshi PROMPT yozadi (Nima+Qanday+Qayerda), (2) agentni boshqaradi (buyur→reja→tasdiq→tekshir),
//        (3) xatolarni DEBUG qiladi → natijada "men istalgan saytni qura olaman" deb chiqadi.
// VIBECODING HALQASI (yangi): promptni YIG'ADI (aniqlik qo'shadi) → agent reja → tasdiq → kodni tekshir → natijani sina.
//        Iteratsiya: AI biroz xato → aniqlashtiruvchi follow-up prompt (s10).
// Loyiha: AvtoIjara — Bosh(/) katalog · Mashina(/car/:id) · Mening ijaralarim(/bookings) · Qo'shish(/add).
//        Asosiy mexanika: jami = kun × kunlik narx. s12 debugging = AI kunni unutgan (× days yo'q).
// TRANSFER (s14): "bu mashina edi, lekin xuddi shu 5 qadam bilan istalgan sayt" → P4 (o'z loyihangiz).
// AUDIOSIZ. "sehr"/"g'isht" yo'q. Rasmiy "siz".
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
  danger: '#C2362B', dangerSoft: '#FAE3E0', line: '#E9E6DF',
  shadowBase: '58, 53, 48'
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
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: 'Tekshirilmoqda…', ru: 'Проверяем…' }) : tr({ uz: 'Kirish →', ru: 'Войти →' })}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
      <button onClick={() => { setRole('student'); setMentorCode(''); }} style={link}>{tr({ uz: '← Orqaga', ru: '← Назад' })}</button>
    </div></div>);
  }
  return (<div style={wrap}><div style={card}>
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{tr(title)}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Подключение к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и своё имя.' })}</p></div>
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
const MentorCtx = createContext(null);
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun

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

const LESSON_META = { lessonId: 'react-project-day-p3-v18', lessonTitle: { uz: 'Praktika: Loyiha kuni — AvtoIjara', ru: 'Практика: Проектный день — AvtoIjara' } };
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
  { id: 's5',  type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's5b', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'p1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 'p2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'p3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'p4',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'spodium', type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',  type: 'flashcards', template: 'custom', scored: false, scope: null },
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
  const lbl = label === undefined ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : label;
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
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
const RECAPS = {
  4: {
    title: { uz: "Yaxshi prompt — Nima + Qanday + Qayerda", ru: 'Хороший промпт — Что + Как + Где' },
    cards: [
      { ic: "🎯", h: { uz: "Yaxshi prompt 3 narsani aytadi", ru: 'Хороший промпт называет 3 вещи' }, body: { uz: <>Agent siz nima desangiz — shuni quradi. Kuchli prompt uchtasini aniq aytadi: <b>Nima</b> kerak, <b>Qanday</b> ishlasin, <b>Qayerda</b> bo'lsin. Shunda agent adashmaydi.</>, ru: <>Агент строит ровно то, что Вы сказали. Сильный промпт чётко называет три вещи: <b>Что</b> нужно, <b>Как</b> это должно работать, <b>Где</b> это должно быть. Тогда агент не запутается.</> }, vis: <RcFlow items={[{ uz: 'Nima', ru: 'Что' }, { uz: 'Qanday', ru: 'Как' }, { uz: 'Qayerda', ru: 'Где' }]} /> },
      { ic: "😕", h: { uz: "Zaif prompt → taxmin → xato", ru: 'Слабый промпт → догадки → ошибка' }, body: { uz: <>"Chiroyli qil", "mashina" kabi noaniq buyruq agentni <b>taxminga</b> majbur qiladi. Taxmin ko'pincha xato chiqadi — keyin qayta-qayta tuzatasiz.</>, ru: <>Расплывчатые команды вроде «сделай красиво» или «машина» заставляют агента <b>гадать</b>. Догадки часто оказываются неверными — потом придётся исправлять снова и снова.</> } },
      { ic: "💪", h: { uz: "Kuchli prompt → aniq natija", ru: 'Сильный промпт → точный результат' }, body: { uz: <>Aniq buyruq — aniq natija. Siz <b>loyiha boshlig'i</b>siz: aniq topshiriq berasiz, agent aynan shuni quradi.</>, ru: <>Точная команда — точный результат. Вы — <b>руководитель проекта</b>: даёте чёткое задание, и агент строит именно его.</> }, ask: { uz: "Zaif promptni qanday qilib kuchaytirasiz?", ru: 'Как Вы усилите слабый промпт?' } },
    ]
  },
  6: {
    title: { uz: "Katalog — GET + map", ru: 'Каталог — GET + map' },
    cards: [
      { ic: "🌐", h: { uz: "Ro'yxatni serverdan olamiz (GET)", ru: 'Берём список с сервера (GET)' }, body: { uz: <>Katalog — mashinalar ro'yxati. Uni serverdan <b>fetch (GET)</b> bilan olamiz, <b>.json()</b> massivga aylantiradi, <b>setCars</b> state'ga yozadi.</>, ru: <>Каталог — это список машин. Мы получаем его с сервера через <b>fetch (GET)</b>, <b>.json()</b> превращает ответ в массив, а <b>setCars</b> записывает его в state.</> }, vis: <RcFlow items={["GET", "map", { uz: 'kartochka', ru: 'карточка' }]} /> },
      { ic: "🧩", h: { uz: "map → <CarCard/>", ru: 'map → <CarCard/>' }, body: { uz: <>Ro'yxatni <b>.map()</b> aylanib, har biriga bitta <b>{"<CarCard/>"}</b> chizadi. Minglab mashina bo'lsa ham kod bitta.</>, ru: <><b>.map()</b> проходит по списку и рисует для каждой машины свой <b>{"<CarCard/>"}</b>. Даже для тысяч машин код один и тот же.</> } },
      { ic: "🎁", h: { uz: "props: nom + narx", ru: 'props: название + цена' }, body: { uz: <>Har kartochkaga <b>props</b> orqali mashinaning nomi va kunlik narxi uzatiladi: <b>{'<CarCard car={c} />'}</b>.</>, ru: <>Каждая карточка получает название машины и цену за день через <b>props</b>: <b>{'<CarCard car={c} />'}</b>.</> }, ask: { uz: "Katalogda har kartochkaga qanday ma'lumot props orqali beriladi?", ru: 'Какие данные передаются каждой карточке каталога через props?' } },
    ]
  },
  11: {
    title: { uz: "Ijara + jami — State", ru: 'Аренда + итог — State' },
    cards: [
      { ic: "💾", h: { uz: "useState — ijara ro'yxati", ru: 'useState — список аренд' }, body: { uz: <>Foydalanuvchi tanlagan mashinalar <b>state</b>da (useState) eslab qolinadi. State o'zgarsa — React ekranni o'zi yangilaydi.</>, ru: <>Выбранные машины запоминаются в <b>state</b> (useState). Когда state меняется — React сам обновляет экран.</> } },
      { ic: "➕", h: { uz: "kun +/- state bilan", ru: 'дни +/- через state' }, body: { uz: <>Kun sonini +/- tugmalar state'da o'zgartiradi. Har o'zgarishda jami qayta hisoblanadi.</>, ru: <>Кнопки +/- меняют число дней в state. При каждом изменении итог пересчитывается заново.</> }, vis: <RcFlow items={[{ uz: 'Tanla', ru: 'Выбери' }, { uz: 'kun', ru: 'дни' }, { uz: 'jami', ru: 'итог' }]} /> },
      { ic: "🧮", h: { uz: "jami = kun × narx", ru: 'итог = дни × цена' }, body: { uz: <>Jami narx <b>kun × kunlik narx</b> formulasidan chiqadi va state o'zgarganda <b>o'zi qayta hisoblanadi</b>.</>, ru: <>Итоговая цена считается по формуле <b>дни × цена за день</b> и <b>сама пересчитывается</b>, когда меняется state.</> }, ask: { uz: "Kun soni o'zgarsa, jami narxni kim qayta hisoblaydi?", ru: 'Если число дней изменится, кто пересчитает итоговую цену?' } },
    ]
  },
  16: {
    title: { uz: "Debugging — kodni o'qib xato topish", ru: 'Дебаггинг — найти ошибку, читая код' },
    cards: [
      { ic: "🔍", h: { uz: "Mijoz shikoyati", ru: 'Жалоба клиента' }, body: { uz: <>Sayt tayyor, lekin mijoz "jami noto'g'ri" deydi. Boshliq sifatida siz <b>tekshirasiz</b> — muammo qayerdaligini topasiz.</>, ru: <>Сайт готов, но клиент говорит: «итог неверный». Как руководитель Вы <b>проверяете</b> — и находите, где именно проблема.</> } },
      { ic: "🐞", h: { uz: "Xato: kun unutilgan", ru: 'Ошибка: забыли дни' }, body: { uz: <>Eng ko'p uchraydigan xato — jami hisobida <b>× kun</b> (b.days) tushib qolgan. Faqat narx qolib, jami noto'g'ri chiqadi.</>, ru: <>Самая частая ошибка — в расчёте итога потерялось <b>× дни</b> (b.days). Остаётся только цена, и итог выходит неверным.</> } },
      { ic: "🛠️", h: { uz: "Boshliq tekshiradi → tuzatadi", ru: 'Руководитель проверяет → исправляет' }, body: { uz: <>Agentning birinchi javobi ko'pincha to'liq emas. Siz o'qiysiz, xatoni topasiz va aniq follow-up bilan tuzatasiz.</>, ru: <>Первый ответ агента часто неполный. Вы читаете код, находите ошибку и исправляете её точным follow-up промптом.</> }, ask: { uz: "Nega agentning birinchi javobini ko'r-ko'rona qabul qilmaslik kerak?", ru: 'Почему нельзя слепо принимать первый ответ агента?' } },
    ]
  },
  19: {
    title: { uz: "Boshliq halqasi — istalgan ilovaga", ru: 'Цикл руководителя — для любого приложения' },
    cards: [
      { ic: "🧭", h: { uz: "5 qadam", ru: '5 шагов' }, body: { uz: <>Har loyihada bir xil halqa: <b>buyur → reja → tasdiq → tekshir → sina</b>. Siz boshqarasiz, agent quradi.</>, ru: <>В каждом проекте один и тот же цикл: <b>поручи → план → одобри → проверь → испытай</b>. Вы управляете, агент строит.</> }, vis: <RcFlow items={[{ uz: 'buyur', ru: 'поручи' }, { uz: 'reja', ru: 'план' }, { uz: 'tasdiq', ru: 'одобри' }, { uz: 'tekshir', ru: 'проверь' }, { uz: 'sina', ru: 'испытай' }]} /> },
      { ic: "🔁", h: { uz: "Iteratsiya (follow-up)", ru: 'Итерация (follow-up)' }, body: { uz: <>Natija to'liq bo'lmasa — <b>aniqlashtiruvchi follow-up</b> prompt berasiz. AI sayqallaydi, siz tasdiqlaysiz.</>, ru: <>Если результат неполный — Вы даёте <b>уточняющий follow-up</b> промпт. ИИ дорабатывает, Вы одобряете.</> } },
      { ic: "🚀", h: { uz: "Istalgan ilovaga", ru: 'Для любого приложения' }, body: { uz: <>Bu mashina sayti edi — lekin xuddi shu 5 qadam bilan <b>istalgan saytni</b> qura olasiz.</>, ru: <>Это был сайт про машины — но теми же 5 шагами Вы можете построить <b>любой сайт</b>.</> }, ask: { uz: "Shu halqa bilan yana qanday ilovalar qura olasiz?", ru: 'Какие ещё приложения Вы можете построить этим циклом?' } },
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
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
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
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и количество ✅/❌ скрыто — при нажатии «Открыть результат» всё появится одновременно и у вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — класс не понял эту тему. Перед тем как продолжить, рекомендуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите перед тем, как продолжить.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — делать выводы по процентам сложно. Оцените сами:</> })}</p>
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в живом режиме…' })}</p>}
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
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' }))} onClick={onNext} /></>}>
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
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас Вы узнаете верный ответ.' })
                : wrongLocked
                  ? fmtCode(explainWrong[picked] ?? explainWrong.default)
                  : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
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

// ===== AVTOIJARA MA'LUMOTLARI =====
const CARS = [
  { id: 1, name: 'Tesla Model 3', emoji: '⚡', price: 80, seats: 5, speed: 250, desc: { uz: "Tinch, tejamkor, elektr — shahar uchun ideal.", ru: 'Тихая, экономичная, электрическая — идеальна для города.' }, bg: 'linear-gradient(135deg,#7EA6F4,#2E4A9E)' },
  { id: 2, name: 'Lamborghini', emoji: '🏎️', price: 200, seats: 2, speed: 350, desc: { uz: "Eng tez — yo'lda hamma o'giriladi.", ru: 'Самая быстрая — на дороге все оборачиваются.' }, bg: 'linear-gradient(135deg,#F4B26A,#C9622E)' },
  { id: 3, name: 'BMW X5', emoji: '🚙', price: 120, seats: 7, speed: 240, desc: { uz: "Katta oila uchun keng va qulay.", ru: 'Просторная и удобная для большой семьи.' }, bg: 'linear-gradient(135deg,#8FD3A8,#2E7A4E)' },
  { id: 4, name: 'Mustang', emoji: '🐎', price: 150, seats: 4, speed: 280, desc: { uz: "Klassik amerikan kuchi.", ru: 'Классическая американская мощь.' }, bg: 'linear-gradient(135deg,#C44569,#7A2A40)' }
];
const POOL = [
  { id: 5, name: 'Jeep Wrangler', emoji: '🚙', price: 90, seats: 5, speed: 180, desc: { uz: "Tog'u tosh — hamma joyga boradi.", ru: 'Горы и камни — проедет где угодно.' }, bg: 'linear-gradient(135deg,#6B7280,#1F2430)' },
  { id: 6, name: 'Mini Cooper', emoji: '🚗', price: 60, seats: 4, speed: 200, desc: { uz: "Kichkina, ixcham, arzon.", ru: 'Маленькая, компактная, недорогая.' }, bg: 'linear-gradient(135deg,#F4D06A,#C99B2E)' }
];
const carById = (id) => [...CARS, ...POOL].find(c => c.id === Number(id)) || CARS[0];

const CarCard = ({ car, onRent, onOpen, onDelete }) => (
  <div className={`rocard el-in ${onOpen ? 'tappable' : ''}`} onClick={onOpen} style={{ position: 'relative' }}>
    <div className="rothumb" style={{ background: car.bg, height: 54 }}>
      <span style={{ fontSize: 25 }}>{car.emoji}</span>
      {onDelete && <button className="cardx" onClick={(e) => { e.stopPropagation(); onDelete(); }} title={tr({ uz: "O'chirish", ru: 'Удалить' })}>✕</button>}
    </div>
    <div className="robody">
      <p className="roname">{car.name}</p>
      <div className="rostats"><span style={{ color: T.accent, fontWeight: 800 }}>${car.price}/{tr({ uz: 'kun', ru: 'день' })}</span>{car.seats && <span>👤 {car.seats}</span>}</div>
      {onRent && <div className="cardacts"><button className="cardbtn" onClick={(e) => { e.stopPropagation(); onRent(); }}>{tr({ uz: '🔑 Ijaraga', ru: '🔑 Арендовать' })}</button></div>}
    </div>
  </div>
);
const Grid = ({ children, cols = 3 }) => <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 8 }}>{children}</div>;
const CarDetail = ({ id, onRent }) => {
  const c = carById(id);
  return (
    <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ borderRadius: 12, height: 72, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>{c.emoji}</div>
      <div>
        <p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 18, color: T.ink, margin: 0 }}>{c.name}</p>
        <div style={{ display: 'flex', gap: 12, margin: '4px 0 6px', fontFamily: "'Manrope',sans-serif", fontSize: 12, color: T.ink2, fontWeight: 600 }}><span style={{ color: T.accent, fontWeight: 800 }}>${c.price}/{tr({ uz: 'kun', ru: 'день' })}</span><span>👤 {c.seats}</span><span>⚡ {c.speed} {tr({ uz: 'km/s', ru: 'км/ч' })}</span></div>
        <p className="body" style={{ margin: '0 0 8px', color: T.ink2 }}>{tr(c.desc)}</p>
        {onRent && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={onRent}>{tr({ uz: '🔑 Ijaraga olish', ru: '🔑 Взять в аренду' })}</button>}
      </div>
    </div>
  );
};

// ===== AGENT BUILD — vibecoding halqasi: prompt yig'ish → reja → tasdiq → kod =====
const AgentBuild = ({ base, parts, planSteps, code, onDone, storedDone }) => {
  const [sel, setSel] = useState(storedDone ? new Set(parts.map(p => p.id)) : new Set());
  const [phase, setPhase] = useState(storedDone ? 'done' : 'compose'); // compose | planned | building | done
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const ready = sel.size >= parts.length;
  const toggle = (id) => { if (phase !== 'compose') return; setSel(prev => { const s = new Set(prev); if (s.has(id)) s.delete(id); else s.add(id); return s; }); };
  const send = () => { if (ready) setPhase('planned'); };
  const approve = () => { setPhase('building'); timer.current = setTimeout(() => { setPhase('done'); if (onDone) onDone(); }, 1200); };
  const chosen = parts.filter(p => sel.has(p.id));
  return (
    <>
      <p className="flow-label">{tr({ uz: "1. Promptni yig'ing — aniqlik qo'shing", ru: '1. Соберите промпт — добавьте точности' })}</p>
      <div className="ai-card">
        <div className="prompt-box">
          <span className="prompt-q">"</span>{tr(base)}{chosen.length ? <> — {chosen.map((p, i) => <span key={p.id}><span style={{ color: T.success, fontWeight: 700 }}>{tr(p.label)}</span>{i < chosen.length - 1 ? ', ' : ''}</span>)}</> : <span style={{ color: T.ink3, fontStyle: 'italic' }}> {tr({ uz: "…aniqlik qo'shing", ru: '…добавьте точности' })}</span>}<span className="prompt-q">"</span>
        </div>
        {phase === 'compose' && (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {parts.map(p => <button key={p.id} className={`chip ${sel.has(p.id) ? 'chip-on' : ''}`} style={{ padding: '7px 12px', fontSize: 12.5 }} onClick={() => toggle(p.id)}>+ {tr(p.label)}</button>)}
            </div>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={!ready} onClick={send}>{ready ? tr({ uz: 'Agentga yuborish →', ru: 'Отправить агенту →' }) : `${tr({ uz: 'Yana', ru: 'Добавьте ещё' })} ${parts.length - sel.size} ${tr({ uz: "ta aniqlik qo'shing", ru: 'уточнения(й)' })}`}</button>
          </>
        )}
        {phase !== 'compose' && (
          <>
            <div className="ai-row fade-step"><span className="ai-badge" style={{ background: T.ink }}>{tr({ uz: 'Agent', ru: 'Агент' })}</span><span className="ai-bubble">{phase === 'planned' ? tr({ uz: 'Mana rejam — tasdiqlaysizmi?', ru: 'Вот мой план — одобряете?' }) : (phase === 'building' ? tr({ uz: 'Yozyapman…', ru: 'Пишу…' }) : tr({ uz: 'Bajardim — kodni tekshiring', ru: 'Готово — проверьте код' }))}</span></div>
            <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 6, animationDelay: '0.06s' }}>
              {planSteps.map((s, i) => <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}><span style={{ color: phase === 'planned' ? T.ink3 : T.success }}>{phase === 'planned' ? '○' : '✓'}</span><span style={{ color: T.ink }}>{tr(s)}</span></div>)}
            </div>
            {phase === 'planned' && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={approve}>{tr({ uz: 'Rejani tasdiqlash', ru: 'Одобрить план' })}</button>}
            {phase === 'building' && <p className="ai-prompt ab-building" style={{ color: T.accent }}>{tr({ uz: 'Kod yozilyapti…', ru: 'Код пишется…' })}</p>}
            {phase === 'done' && <div className="ai-code fade-step"><div className="ai-line ok" style={{ cursor: 'default', whiteSpace: 'pre-wrap' }}>{code}</div></div>}
          </>
        )}
      </div>
    </>
  );
};

// ===== SCREEN 0 — HOOK (4 ta alohida kuch → bitta ilova?) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const SKILLS = [
    { k: 'komponent', t: tr({ uz: 'Komponent + props + map', ru: 'Компонент + props + map' }), e: '🧩' },
    { k: 'state', t: tr({ uz: 'State (xotira)', ru: 'State (память)' }), e: '💾' },
    { k: 'api', t: tr({ uz: 'API — server (CRUD)', ru: 'API — сервер (CRUD)' }), e: '🌐' },
    { k: 'router', t: tr({ uz: 'Router (sahifalar)', ru: 'Router (страницы)' }), e: '🧭' }
  ];
  const [seen, setSeen] = useState(storedAnswer ? new Set(SKILLS.map(s => s.k)) : new Set());
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const allSeen = seen.size >= 4;
  const tap = (k) => setSeen(prev => { const s = new Set(prev); s.add(k); return s; });
  const OPTS = [
    { id: 'a', label: tr({ uz: "Yo'q — har biri alohida narsa", ru: 'Нет — каждая сила сама по себе' }) },
    { id: 'b', label: tr({ uz: "Ha — bitta to'liq ilovaga birlashadi", ru: 'Да — они соберутся в одно полноценное приложение' }) },
    { id: 'c', label: tr({ uz: 'Faqat kattalar buni qila oladi', ru: 'Это под силу только взрослым' }) }
  ];
  const pick = (v) => { if (picked !== null || !allSeen) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  const audio = useAudio([{ id: 's0', text: `Bu modulda to'rtta kuch o'rgandingiz — komponent, state, API va router. Har biri alohida edi. Bugun ularni bitta haqiqiy ilovaga birlashtiramiz: AvtoIjara — mashina ijara sayti. To'rttala kuchni bosib eslang, keyin ayting: shularni birlashtirsak, to'liq sayt chiqadimi?`, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · loyiha kuni', ru: 'Вступление · проектный день' })} screen={screen} audioState={audio} scrollSignal={picked !== null} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 820 }}>{tr({ uz: <>4 ta alohida kuchni <span className="italic" style={{ color: T.accent }}>bitta ilovaga</span> birlashtira olamizmi?</>, ru: <>Сможем ли мы объединить 4 отдельные силы <span className="italic" style={{ color: T.accent }}>в одно приложение</span>?</> })}</h1>
        <Mentor>{tr({ uz: <>Bu modulda 4 ta kuch o'rgandingiz — har biri alohida. Bugun ularni <b style={{ color: T.ink }}>bitta haqiqiy ilovaga</b> qo'shamiz: <b style={{ color: T.ink }}>AvtoIjara</b> (mashina ijara sayti). To'rttala kuchni bosib eslang.</>, ru: <>В этом модуле Вы изучили 4 силы — каждую по отдельности. Сегодня мы соберём их в <b style={{ color: T.ink }}>одно настоящее приложение</b>: <b style={{ color: T.ink }}>AvtoIjara</b> (сайт аренды машин). Нажмите на все четыре силы и вспомните их.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SKILLS.map((s, si) => (
                <button key={s.k} className={`vcard ${seen.has(s.k) ? '' : 'tap-hint'}`} onClick={() => tap(s.k)} style={{ boxShadow: seen.has(s.k) ? `inset 0 0 0 1.5px ${T.success}` : undefined, animationDelay: `${si * 0.22}s` }}>
                  <span style={{ fontSize: 20 }}>{s.e}</span>
                  <span className="vlbl">{s.t}</span>
                  <span className="vseen" style={{ color: seen.has(s.k) ? T.success : T.ink3 }}>{seen.has(s.k) ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: "Shularni birlashtirib, to'liq sayt chiqadimi?", ru: 'Если их объединить — получится полноценный сайт?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (
                  <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null || !allSeen} style={{ opacity: !allSeen ? 0.55 : 1 }} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{o.label}</span>
                  </button>
                );
              })}
            </div>
            {!allSeen && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Avval 4 kuchni bosib eslang ←', ru: 'Сначала нажмите на 4 силы и вспомните их ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Aynan! Har bir kuch — ilovaning bir qismi. Bugun siz <b>loyiha boshlig'i</b>siz: rejani tuzasiz, <b>AI'ga buyurib</b> qurasiz, kodini tekshirasiz. Bo'sh sahifadan — to'liq AvtoIjara ilovasigacha.</>, ru: <>Именно! Каждая сила — часть приложения. Сегодня Вы — <b>руководитель проекта</b>: составляете план, <b>поручаете ИИ</b> строить и проверяете код. От пустой страницы — до полного приложения AvtoIjara.</> })}</p>}
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
    { text: tr({ uz: 'Loyihani rejalashtirish', ru: 'Спланировать проект' }), tag: tr({ uz: "sahifalar + ma'lumot", ru: 'страницы + данные' }) },
    { text: tr({ uz: 'Yaxshi prompt yozish', ru: 'Написать хороший промпт' }), tag: tr({ uz: 'Nima + Qanday + Qayerda', ru: 'Что + Как + Где' }) },
    { text: tr({ uz: 'Agent quradi — siz tekshirasiz', ru: 'Агент строит — Вы проверяете' }), tag: tr({ uz: 'buyur → reja → tasdiq', ru: 'поручи → план → одобри' }) },
    { text: tr({ uz: 'Xatolarni debug qilish', ru: 'Отладить ошибки' }), tag: tr({ uz: "kodni o'qib tuzatish", ru: 'читать код и исправлять' }) },
    { text: tr({ uz: "To'liq ilovani yig'ish", ru: 'Собрать полное приложение' }), tag: tr({ uz: 'AvtoIjara tayyor', ru: 'AvtoIjara готово' }) }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: "Dars oxirida — sizning to'liq ilovangiz", ru: 'В конце урока — Ваше полное приложение' })}</p>
      <Win title="AvtoIjara — localhost:5173" minH={130}>
        <div className="navmenu" style={{ marginBottom: 8 }}>
          <span className="navlink on">{tr({ uz: '🏠 Bosh', ru: '🏠 Главная' })}</span><span className="navlink">{tr({ uz: '🔑 Ijaralarim', ru: '🔑 Мои аренды' })}</span><span className="navlink">{tr({ uz: "➕ Qo'shish", ru: '➕ Добавить' })}</span>
        </div>
        <Grid cols={3}><CarCard car={CARS[0]} /><CarCard car={CARS[1]} /><CarCard car={CARS[2]} /></Grid>
      </Win>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: '→ katalog · ijara · jami narx — bitta ilovada', ru: '→ каталог · аренда · итоговая цена — в одном приложении' })}</p>
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
  const audio = useAudio([{ id: 's1', text: `Bugun siz loyiha boshlig'isiz, AI esa jamoangiz. Gap shu: yaxshi dasturchi har qatorni o'zi yozmaydi — u aniq buyuradi va natijani tekshiradi. Bugun shuni mashq qilamiz: aniq prompt, agent quradi, siz tekshirasiz. Besh qadam bilan bo'sh sahifadan to'liq AvtoIjara ilovasigacha boramiz.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Bugun siz <span className="italic" style={{ color: T.accent }}>loyiha boshlig'i</span>siz — AI esa jamoangiz.</>, ru: <>Сегодня Вы — <span className="italic" style={{ color: T.accent }}>руководитель проекта</span>, а ИИ — Ваша команда.</> })}</h2>
        </div>
        <Mentor>{tr({ uz: <>Gap shu: yaxshi dasturchi har qatorni o'zi yozmaydi — u <b style={{ color: T.ink }}>aniq buyuradi</b> va <b style={{ color: T.ink }}>natijani tekshiradi</b>. Bugun shuni mashq qilamiz: aniq prompt → agent quradi → siz tekshirasiz va tuzatasiz. Oxirida to'liq <b style={{ color: T.ink }}>AvtoIjara</b> ilovasi.</>, ru: <>Суть вот в чём: хороший разработчик не пишет каждую строку сам — он <b style={{ color: T.ink }}>чётко поручает</b> и <b style={{ color: T.ink }}>проверяет результат</b>. Сегодня тренируем именно это: точный промпт → агент строит → Вы проверяете и исправляете. В конце — полное приложение <b style={{ color: T.ink }}>AvtoIjara</b>.</> })}</Mentor>
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

// ===== SCREEN 2 — LOYIHA CHIZMASI (sahifa → vazifa) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const PAGES = [
    { path: '/', page: tr({ uz: 'Bosh', ru: 'Главная' }), icon: '🏠', jobId: 'get', job: tr({ uz: "mashinalarni serverdan olib ko'rsatish (GET + map)", ru: 'показать машины с сервера (GET + map)' }) },
    { path: '/car/:id', page: tr({ uz: 'Mashina', ru: 'Машина' }), icon: '🚗', jobId: 'router', job: tr({ uz: 'bitta mashina tafsiloti (Router + :id)', ru: 'детали одной машины (Router + :id)' }) },
    { path: '/bookings', page: tr({ uz: 'Ijaralarim', ru: 'Мои аренды' }), icon: '🔑', jobId: 'state', job: tr({ uz: 'tanlangan mashinalar + jami narx (state)', ru: 'выбранные машины + итоговая цена (state)' }) },
    { path: '/add', page: tr({ uz: "Qo'shish", ru: 'Добавить' }), icon: '➕', jobId: 'post', job: tr({ uz: "yangi mashina qo'shish (POST)", ru: 'добавить новую машину (POST)' }) }
  ];
  const JOBS = [
    { id: 'get', label: tr({ uz: 'Serverdan olish (GET)', ru: 'Получить с сервера (GET)' }) },
    { id: 'router', label: tr({ uz: 'Bitta mashina (Router)', ru: 'Одна машина (Router)' }) },
    { id: 'state', label: tr({ uz: 'Jami narx (state)', ru: 'Итоговая цена (state)' }) },
    { id: 'post', label: tr({ uz: "Yangi qo'shish (POST)", ru: 'Добавить новую (POST)' }) }
  ];
  const [taskIdx, setTaskIdx] = useState(storedAnswer ? PAGES.length : 0);
  const [shakeId, setShakeId] = useState(null);
  const timer = useRef(null);
  const done = taskIdx >= PAGES.length;
  useEffect(() => () => clearTimeout(timer.current), []);
  const cur = PAGES[Math.min(taskIdx, PAGES.length - 1)];
  const tap = (jobId) => {
    if (done) return;
    if (jobId === cur.jobId) setTaskIdx(t => t + 1);
    else { clearTimeout(timer.current); setShakeId(jobId); timer.current = setTimeout(() => setShakeId(null), 450); }
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's2', text: `Quruvchidan oldin — chizma. Loyiha boshlig'i avval ilovani bo'laklaydi: to'rt sahifa, har biri bitta vazifa. Mana AvtoIjara sahifalari — har biriga to'g'ri vazifani biriktiring. Bu — sizning loyiha chizmangiz.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha chizmasi', ru: 'Схема проекта' })} screen={screen} audioState={audio} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Chizmani tuzing', ru: 'Составьте схему' })} (${Math.min(taskIdx, PAGES.length)}/4)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Quruvchidan oldin — <span className="italic" style={{ color: T.accent }}>chizma</span>. Har sahifa nima qiladi?</>, ru: <>Перед стройкой — <span className="italic" style={{ color: T.accent }}>схема</span>. Что делает каждая страница?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Loyiha boshlig'i avval ilovani <b style={{ color: T.ink }}>bo'laklaydi</b>: 4 sahifa, har biri bitta vazifa. Mana AvtoIjara sahifalari — har biriga to'g'ri vazifani biriktiring. Shu — sizning loyiha chizmangiz.</>, ru: <>Руководитель проекта сначала <b style={{ color: T.ink }}>разбивает</b> приложение на части: 4 страницы, у каждой одна задача. Вот страницы AvtoIjara — прикрепите к каждой верную задачу. Это и есть Ваша схема проекта.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Sahifalar', ru: 'Страницы' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PAGES.map((p, i) => {
                const matched = i < taskIdx;
                const activeRow = !done && i === taskIdx;
                return (
                  <div key={p.path} className="routerow" style={{ boxShadow: activeRow ? `inset 0 0 0 1.5px ${T.accent}` : (matched ? `inset 0 0 0 1.5px ${T.success}` : `0 4px 12px -6px rgba(${T.shadowBase},0.14)`), background: matched ? T.successSoft : T.paper }}>
                    <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 12.5, color: matched ? T.success : T.ink }}>{p.icon} {p.page}</span>
                    <span className="mono" style={{ marginLeft: 'auto', fontSize: 11, color: T.ink3 }}>{p.path}</span>
                  </div>
                );
              })}
            </div>
          </Col>
          <Col>
            {!done ? (
              <>
                <div className="sk-info" key={taskIdx}><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b style={{ color: T.accent }}>{cur.icon} {cur.page}</b> ({cur.path}) sahifasi nima qiladi?</>, ru: <>Что делает страница <b style={{ color: T.accent }}>{cur.icon} {cur.page}</b> ({cur.path})?</> })}</p></div>
                <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'Vazifani tanlang', ru: 'Выберите задачу' })}</p>
                <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {JOBS.map(j => <button key={j.id} className={`gchip ${shakeId === j.id ? 'shake' : ''}`} onClick={() => tap(j.id)} style={{ justifyContent: 'flex-start', padding: '11px 14px' }}>{j.label}</button>)}
                </div>
              </>
            ) : (
              <>
                <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'Tayyor chizma', ru: 'Готовая схема' })}</p>
                <div className="code-box fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '13px 15px' }}>
                  {PAGES.map(p => <TLine key={p.path} out={<span><span style={{ color: CODE.attr }}>{p.path}</span> <span style={{ color: CODE.comment }}>→ {p.job}</span></span>} />)}
                </div>
                <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Mana loyiha chizmasi: 4 sahifa, har biri bitta vazifa — Router, API, state birga. Endi har birini AI'ga qurdiramiz.", ru: 'Вот схема проекта: 4 страницы, у каждой одна задача — Router, API и state вместе. Теперь поручим ИИ построить каждую из них.' })}</p></div>
              </>
            )}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — PROMPT MAHORATI (zaif vs kuchli) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [view, setView] = useState(null); // 'weak' | 'strong'
  const [seen, setSeen] = useState(storedAnswer ? new Set(['weak', 'strong']) : new Set());
  const done = seen.size >= 2;
  const show = (v) => { setView(v); setSeen(prev => { const s = new Set(prev); s.add(v); return s; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's3', text: `Bir xil ish, ikki xil prompt — farqi katta. Agent siz nima desangiz, shuni quradi. Yaxshi prompt uch narsani aytadi: Nima kerak, Qanday ishlasin, Qayerda bo'lsin. Ikkala tugmani bosing — zaif va kuchli promptning farqini ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Prompt mahorati', ru: 'Мастерство промпта' })} screen={screen} audioState={audio} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Ikkala promptni ko'ring", ru: 'Посмотрите оба промпта' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bir xil ish — <span className="italic" style={{ color: T.accent }}>ikki xil prompt</span>. Farqi katta.</>, ru: <>Одна и та же задача — <span className="italic" style={{ color: T.accent }}>два разных промпта</span>. Разница огромная.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Agent siz nima desangiz — shuni qiladi. Yaxshi prompt 3 narsani aytadi: <b style={{ color: T.ink }}>Nima</b> kerak · <b style={{ color: T.ink }}>Qanday</b> ishlasin · <b style={{ color: T.ink }}>Qayerda</b> bo'lsin. Ikkala tugmani bosib, farqni ko'ring.</>, ru: <>Агент делает ровно то, что Вы скажете. Хороший промпт называет 3 вещи: <b style={{ color: T.ink }}>Что</b> нужно · <b style={{ color: T.ink }}>Как</b> должно работать · <b style={{ color: T.ink }}>Где</b> должно быть. Нажмите обе кнопки и увидите разницу.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 9 }}>
              <button className={`btn-soft ${view === 'weak' ? '' : ''}`} style={view === 'weak' ? { boxShadow: `inset 0 0 0 1.5px ${T.danger}` } : undefined} onClick={() => show('weak')}>{tr({ uz: '😕 Zaif prompt', ru: '😕 Слабый промпт' })} {seen.has('weak') ? '✓' : ''}</button>
              <button className="btn" style={view === 'strong' ? { background: T.success } : undefined} onClick={() => show('strong')}>{tr({ uz: '💪 Kuchli prompt', ru: '💪 Сильный промпт' })} {seen.has('strong') ? '✓' : ''}</button>
            </div>
            <div className="ai-card" style={{ minHeight: 90 }}>
              {!view && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Yuqoridan bittasini tanlang…', ru: 'Выберите один из вариантов выше…' })}</p>}
              {view === 'weak' && <div className="fade-step"><div className="prompt-box" style={{ boxShadow: `inset 0 0 0 1px ${T.danger}` }}><span className="prompt-q">"</span>{tr({ uz: "mashina qo'sh", ru: 'добавь машину' })}<span className="prompt-q">"</span></div><p className="small" style={{ color: T.danger, margin: '8px 0 0' }}>{tr({ uz: <>Agent: qaysi mashina? qayerga? narxi-chi? — <b>taxmin qiladi</b>, ko'pincha xato.</>, ru: <>Агент: какую машину? куда? а цена? — <b>гадает</b>, и часто ошибается.</> })}</p></div>}
              {view === 'strong' && <div className="fade-step"><div className="prompt-box" style={{ boxShadow: `inset 0 0 0 1px ${T.success}` }}><span className="prompt-q">"</span>{tr({ uz: <><b>Bosh sahifaga</b> "Mashina qo'shish" formasi yasa — <b>nom va kunlik narx</b> kiritilsin, "Saqlash"da <b>serverga POST</b> qilinsin</>, ru: <>Сделай на <b>главной странице</b> форму «Добавить машину» — с полями <b>название и цена за день</b>, при «Сохранить» отправь <b>POST на сервер</b></> })}<span className="prompt-q">"</span></div><p className="small" style={{ color: T.success, margin: '8px 0 0' }}>{tr({ uz: "Agent: aniq biladi — to'g'ri quradi.", ru: 'Агент: точно знает — строит верно.' })}</p></div>}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Yaxshi promptning 3 qismi', ru: '3 части хорошего промпта' })}</p>
            <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[[tr({ uz: 'Nima', ru: 'Что' }), tr({ uz: 'qanday funksiya kerak', ru: 'какая функция нужна' }), '🎯'], [tr({ uz: 'Qanday', ru: 'Как' }), tr({ uz: "qanday ishlasin / ko'rinsin", ru: 'как должно работать / выглядеть' }), '⚙️'], [tr({ uz: 'Qayerda', ru: 'Где' }), tr({ uz: 'qaysi sahifa / joy', ru: 'какая страница / место' }), '📍']].map(([a, b, e]) => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 13px', borderRadius: 11, background: T.paper, boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.14)` }}>
                  <span style={{ fontSize: 17 }}>{e}</span><span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 13, color: T.accent, minWidth: 64 }}>{a}</span><span style={{ fontSize: 12.5, color: T.ink2 }}>{b}</span>
                </div>
              ))}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Qoida: <b>aniq prompt — aniq natija</b>. Bugun har buyruqni shu 3 qism bilan yig'asiz — agent adashmaydi, siz tezroq quradigan bo'lasiz.</>, ru: <>Правило: <b>точный промпт — точный результат</b>. Сегодня Вы собираете каждую команду из этих 3 частей — агент не путается, а Вы строите быстрее.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 (prompt sifati) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    audioText="Qaysi prompt agentga aniqroq va yaxshiroq? To'g'ri javobni tanlang."
    questionText="Qaysi prompt agentga aniqroq va yaxshiroq?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Qaysi prompt agentga <span className="italic" style={{ color: T.accent }}>aniqroq</span>?</>, ru: <>Какой промпт для агента <span className="italic" style={{ color: T.accent }}>точнее</span>?</> })}</h2></>}
    options={[tr({ uz: '"chiroyli qil"', ru: '«сделай красиво»' }), tr({ uz: '"mashina"', ru: '«машина»' }), tr({ uz: '"Bosh sahifaga mashinalar katalogini chiqar — serverdan (GET), har birini kartochka qilib, nom va narx bilan"', ru: '«Выведи на главной странице каталог машин — с сервера (GET), каждую карточкой, с названием и ценой»' }), tr({ uz: '"hammasini o\'zing bil"', ru: '«разберись сам»' })]} correctIdx={2}
    explainCorrect={tr({ uz: "To'g'ri! Bu promptda Nima (katalog), Qanday (GET, kartochka, nom+narx) va Qayerda (Bosh sahifa) — hammasi aniq. Agent adashmaydi.", ru: 'Верно! В этом промпте есть Что (каталог), Как (GET, карточки, название+цена) и Где (главная страница) — всё точно. Агент не запутается.' })}
    explainWrong={{
      0: tr({ uz: "Juda noaniq — nimani chiroyli qil? Agent taxmin qiladi. Nima/Qanday/Qayerda kerak.", ru: 'Слишком расплывчато — что именно сделать красиво? Агент будет гадать. Нужны Что/Как/Где.' }),
      1: tr({ uz: "Bitta so'z — agent hech narsa bilmaydi. Aniqlik qo'shing.", ru: 'Одно слово — агент ничего не поймёт. Добавьте точности.' }),
      3: tr({ uz: "Bu eng yomoni — siz boshliqsiz, rejani siz berasiz. Aniq ayting.", ru: 'Это худший вариант — руководитель Вы, и план даёте Вы. Говорите точно.' }),
      default: tr({ uz: "Yaxshi prompt = Nima + Qanday + Qayerda. Aniq prompt — aniq natija.", ru: 'Хороший промпт = Что + Как + Где. Точный промпт — точный результат.' })
    }} />
);

// ===== SCREEN 5 — VIBECODING: KATALOG (GET + map) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's5', text: `Birinchi qism — Bosh sahifa katalogi. Mashinalar serverdan yuklanib, har biri kartochka bo'lib chiqadi. Promptga aniqlik qo'shing: qaysi ma'lumot, qayerdan. Keyin agentga yuboring, rejasini tasdiqlang, kodini o'qing.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Qurish · Katalog', ru: 'Стройка · Каталог' })} screen={screen} audioState={audio} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Agent bilan quring', ru: 'Постройте с агентом' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>1-qism: <span className="italic" style={{ color: T.accent }}>Katalog</span>ni agentga qurdiring.</>, ru: <>Часть 1: поручите агенту построить <span className="italic" style={{ color: T.accent }}>каталог</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Birinchi sahifa — Bosh: mashinalar katalogi. Promptga <b style={{ color: T.ink }}>aniqlik qo'shing</b> (qaysi ma'lumot, qayerdan), so'ng agentga yuboring. Reja kelganda — tasdiqlang, kodni o'qing.</>, ru: <>Первая страница — Главная: каталог машин. <b style={{ color: T.ink }}>Добавьте в промпт точности</b> (какие данные, откуда), затем отправьте агенту. Когда придёт план — одобрите его и прочитайте код.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <AgentBuild
              base={{ uz: "Bosh sahifada mashinalar katalogini ko'rsat", ru: 'Покажи на главной странице каталог машин' }}
              parts={[{ id: 'get', label: { uz: 'serverdan yuklab (GET)', ru: 'загрузив с сервера (GET)' } }, { id: 'map', label: { uz: 'har birini kartochka qilib (map)', ru: 'каждую карточкой (map)' } }, { id: 'price', label: { uz: 'nom va kunlik narx bilan', ru: 'с названием и ценой за день' } }]}
              planSteps={[{ uz: "useEffect ichida fetch(GET) bilan mashinalarni olaman", ru: 'В useEffect получу машины через fetch(GET)' }, { uz: "setCars(data) — state'ga yozaman", ru: 'setCars(data) — запишу в state' }, { uz: "cars.map bilan har biriga CarCard chizaman", ru: 'Через cars.map нарисую каждой CarCard' }]}
              code={<>{'fetch('}<St>'https://avto-api.uz/cars'</St>{')'}{'\n  .then(r => r.json())'}{'\n  .then(data => setCars(data));'}{'\n\n'}{'{cars.map(c => '}<Jx>{'<CarCard '}</Jx><At>car</At>{'={c}'}<Jx>{' />'}</Jx>{')}'}</>}
              storedDone={!!storedAnswer}
              onDone={() => setDone(true)}
            />
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija — AvtoIjara', ru: 'Результат — AvtoIjara' })}</p>
            <Win title="AvtoIjara — localhost:5173" minH={130}>
              {done
                ? <div className="fade-step"><div className="navmenu" style={{ marginBottom: 8 }}><span className="navlink on">{tr({ uz: '🏠 Bosh', ru: '🏠 Главная' })}</span></div><Grid cols={3}>{CARS.map(c => <CarCard key={c.id} car={c} />)}</Grid></div>
                : <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{tr({ uz: "Promptni yig'ib, agentga yuboring…", ru: 'Соберите промпт и отправьте агенту…' })}</p>}
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Katalog tayyor! Kodni tekshirdingiz: <span className="mono">fetch</span> serverdan oladi, <span className="mono">map</span> har biriga kartochka chizadi. 1-qism bajarildi.</>, ru: <>Каталог готов! Вы проверили код: <span className="mono">fetch</span> получает данные с сервера, <span className="mono">map</span> рисует каждой машине карточку. Часть 1 выполнена.</> })}</p></div>}
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
    audioText="Katalogni serverdan yuklash uchun qaysi kerak? To'g'ri javobni tanlang."
    questionText="Katalogni serverdan yuklash uchun qaysi kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Mustahkamlash', ru: 'Закрепление' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Katalogni <span className="italic" style={{ color: T.accent }}>serverdan yuklash</span> uchun?</>, ru: <>Что нужно, чтобы <span className="italic" style={{ color: T.accent }}>загрузить каталог с сервера</span>?</> })}</h2></>}
    options={[tr({ uz: 'fetch (GET) + .json() + setCars, keyin map bilan chizish', ru: 'fetch (GET) + .json() + setCars, затем нарисовать через map' }), tr({ uz: 'Faqat map yetadi', ru: 'Достаточно одного map' }), tr({ uz: "Har mashinani qo'lda yozish", ru: 'Вписать каждую машину вручную' }), tr({ uz: 'CSS bilan', ru: 'Через CSS' })]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! Serverdan fetch(GET) bilan olamiz, .json() massivga aylantiradi, setCars state'ga yozadi — React map bilan chizadi.", ru: 'Верно! Получаем с сервера через fetch(GET), .json() превращает ответ в массив, setCars записывает в state — React рисует через map.' })}
    explainWrong={{
      1: tr({ uz: "map faqat tayyor ro'yxatni chizadi. Ro'yxatni avval serverdan fetch bilan olish kerak.", ru: 'map рисует только готовый список. Сначала список нужно получить с сервера через fetch.' }),
      2: tr({ uz: "Yo'q — minglab mashinani qo'lda yozmaymiz. Server + fetch + map.", ru: 'Нет — тысячи машин вручную не впишешь. Сервер + fetch + map.' }),
      3: tr({ uz: "CSS — bezak. Ma'lumotni olish — fetch (GET).", ru: 'CSS — это оформление. Данные получает fetch (GET).' }),
      default: tr({ uz: "fetch(GET) → .json() → setCars → map.", ru: 'fetch(GET) → .json() → setCars → map.' })
    }} />
);

// ===== SCREEN 6 — VIBECODING: ROUTER + MASHINA SAHIFASI =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  const [openId, setOpenId] = useState(null);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's6', text: `Ikkinchi qism — har mashinaga alohida sahifa. Kartochka bosilganda mashina sahifasi ochilsin, sahifa qayta yuklanmay. Promptni yig'ing, agentga yuboring, tayyor bo'lgach kartochkani bosib sinab ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Qurish · Router', ru: 'Стройка · Router' })} screen={screen} audioState={audio} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Agent bilan quring', ru: 'Постройте с агентом' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>2-qism: har mashinaga <span className="italic" style={{ color: T.accent }}>alohida sahifa</span>.</>, ru: <>Часть 2: каждой машине — <span className="italic" style={{ color: T.accent }}>отдельная страница</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Endi kartochka bosilganda mashina sahifasi (<span className="mono">/car/:id</span>) ochilsin — qayta yuklanmay. Promptga aniqlik qo'shing, agentga yuboring. Tayyor bo'lgach, natijada kartochkani bosib sinab ko'ring.</>, ru: <>Теперь при клике по карточке пусть открывается страница машины (<span className="mono">/car/:id</span>) — без перезагрузки. Добавьте в промпт точности и отправьте агенту. Когда будет готово — кликните по карточке и проверьте.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <AgentBuild
              base={{ uz: "Kartochka bosilganda mashina sahifasi ochilsin", ru: 'При клике по карточке пусть открывается страница машины' }}
              parts={[{ id: 'route', label: { uz: 'har mashinaga /car/:id manzili', ru: 'каждой машине адрес /car/:id' } }, { id: 'link', label: { uz: '<Link> bilan (qayta yuklanmasin)', ru: 'через <Link> (без перезагрузки)' } }, { id: 'detail', label: { uz: "narx va xususiyatlar ko'rsatilsin", ru: 'показать цену и характеристики' } }]}
              planSteps={[{ uz: "<Route path='/car/:id' element={<CarPage />} /> qo'shaman", ru: "Добавлю <Route path='/car/:id' element={<CarPage />} />" }, { uz: "Kartochkani <Link to={'/car/' + c.id}> ichiga olaman", ru: "Оберну карточку в <Link to={'/car/' + c.id}>" }, { uz: "CarPage'da useParams bilan mashinani topib chizaman", ru: 'В CarPage найду машину через useParams и нарисую' }]}
              code={<><Jx>{'<Route '}</Jx><At>path</At>=<St>"/car/:id"</St> <At>element</At>{'={<CarPage />}'}<Jx>{' />'}</Jx>{'\n\n'}<Jx>{'<Link '}</Jx><At>to</At>{'={'}<St>"/car/"</St>{' + c.id}'}<Jx>{'>'}</Jx>{'<CarCard car={c} />'}<Jx>{'</Link>'}</Jx></>}
              storedDone={!!storedAnswer}
              onDone={() => setDone(true)}
            />
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija', ru: 'Результат' })} {done ? tr({ uz: '— kartochkani bosing', ru: '— кликните по карточке' }) : ''}</p>
            <Win title="AvtoIjara — localhost:5173" minH={130}>
              {done
                ? (openId
                  ? <div key={openId} className="fade-step"><div className="navmenu" style={{ marginBottom: 8 }}><button className="navlink" onClick={() => setOpenId(null)}>{tr({ uz: '🏠 Bosh', ru: '🏠 Главная' })}</button></div><CarDetail id={openId} /></div>
                  : <div className="fade-step"><div className="navmenu" style={{ marginBottom: 8 }}><span className="navlink on">{tr({ uz: '🏠 Bosh', ru: '🏠 Главная' })}</span></div><Grid cols={3}>{CARS.map(c => <CarCard key={c.id} car={c} onOpen={() => setOpenId(c.id)} />)}</Grid></div>)
                : <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{tr({ uz: "Promptni yig'ib, agentga yuboring…", ru: 'Соберите промпт и отправьте агенту…' })}</p>}
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ishladi! Kartochka → <span className="mono">/car/:id</span> sahifasi, qayta yuklanmay. <span className="mono">useParams</span> qaysi mashina ekanini biladi. 2-qism bajarildi.</>, ru: <>Сработало! Карточка → страница <span className="mono">/car/:id</span>, без перезагрузки. <span className="mono">useParams</span> знает, какая это машина. Часть 2 выполнена.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — VIBECODING: IJARA + JAMI NARX (state) =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  const [bookings, setBookings] = useState([]); // {car, days}
  const rent = (car) => setBookings(prev => (prev.some(b => b.car.id === car.id) ? prev : [...prev, { car, days: 2 }]));
  const setDays = (id, d) => setBookings(prev => prev.map(b => b.car.id === id ? { ...b, days: Math.max(1, d) } : b));
  const total = bookings.reduce((s, b) => s + b.car.price * b.days, 0);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's7', text: `Uchinchi qism — eng qizig'i: ijara va jami narx, ilovaning yuragi. Mashinani necha kunga olsangiz, jami narx o'zi hisoblanadi — bu state ishi. Promptni yig'ing, agentga yuboring, keyin natijada ijaraga olib kunni o'zgartiring.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Qurish · Ijara', ru: 'Стройка · Аренда' })} screen={screen} audioState={audio} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Agent bilan quring', ru: 'Постройте с агентом' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>3-qism: <span className="italic" style={{ color: T.accent }}>ijara + jami narx</span> — ilovaning yuragi.</>, ru: <>Часть 3: <span className="italic" style={{ color: T.accent }}>аренда + итоговая цена</span> — сердце приложения.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Eng qiziq qism: mashinani ijaraga olib, <b style={{ color: T.ink }}>necha kun</b>ga tanlash — jami narx <b style={{ color: T.ink }}>o'zi hisoblanadi</b>. Bu — state ishi. Promptni yig'ing, agentga yuboring, keyin natijada ijaraga olib sinang.</>, ru: <>Самая интересная часть: берёте машину в аренду, выбираете <b style={{ color: T.ink }}>на сколько дней</b> — и итоговая цена <b style={{ color: T.ink }}>считается сама</b>. Это работа state. Соберите промпт, отправьте агенту, а потом возьмите машину в аренду и проверьте.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <AgentBuild
              base={{ uz: "Mashinani ijaraga olish funksiyasini qo'sh", ru: 'Добавь функцию аренды машины' }}
              parts={[{ id: 'add', label: { uz: '"Mening ijaralarim" ro\'yxatiga qo\'shsin', ru: 'добавлять в список «Мои аренды»' } }, { id: 'days', label: { uz: 'necha kun tanlansin', ru: 'выбор числа дней' } }, { id: 'total', label: { uz: 'jami = kun × kunlik narx', ru: 'итог = дни × цена за день' } }]}
              planSteps={[{ uz: "'Ijaraga' bosilganda setBookings([...bookings, {car, days}])", ru: "При нажатии «Арендовать» — setBookings([...bookings, {car, days}])" }, { uz: "Kun sonini tanlash (+/-)", ru: 'Выбор числа дней (+/-)' }, { uz: "Jami narxni hisoblash: har ijara uchun kun × narx", ru: 'Расчёт итога: для каждой аренды дни × цена' }]}
              code={<>{'setBookings([...bookings, { car, days: 2 }]);'}{'\n\n'}<Jx>{'const'}</Jx>{' jami = bookings.reduce((s, b) =>'}{'\n  s + b.car.price '}<span style={{ background: 'rgba(31,122,77,0.18)', borderRadius: 4, padding: '0 3px' }}>{'* b.days'}</span>{', 0);'}</>}
              storedDone={!!storedAnswer}
              onDone={() => setDone(true)}
            />
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija', ru: 'Результат' })} {done ? tr({ uz: '— mashinani ijaraga oling', ru: '— возьмите машину в аренду' }) : ''}</p>
            <Win title="AvtoIjara — localhost:5173" minH={150}>
              {done ? (
                <div className="fade-step">
                  <Grid cols={2}>{CARS.slice(0, 2).map(c => <CarCard key={c.id} car={c} onRent={() => rent(c)} />)}</Grid>
                  <div style={{ marginTop: 10, borderTop: `1px solid ${T.bg}`, paddingTop: 9 }}>
                    <p className="flow-label" style={{ margin: '0 0 6px' }}>{tr({ uz: '🔑 Mening ijaralarim', ru: '🔑 Мои аренды' })}</p>
                    {bookings.length === 0 ? <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Yuqoridan "Ijaraga" ni bosing…', ru: 'Нажмите «Арендовать» выше…' })}</p> : (
                      <>
                        {bookings.map(b => (
                          <div key={b.car.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '5px 0' }}>
                            <span style={{ fontWeight: 700, color: T.ink, flex: 1 }}>{b.car.emoji} {b.car.name}</span>
                            <button className="daybtn" onClick={() => setDays(b.car.id, b.days - 1)}>−</button>
                            <span className="mono" style={{ minWidth: 44, textAlign: 'center' }}>{b.days} {tr({ uz: 'kun', ru: 'дн.' })}</span>
                            <button className="daybtn" onClick={() => setDays(b.car.id, b.days + 1)}>+</button>
                            <span style={{ color: T.accent, fontWeight: 800, minWidth: 50, textAlign: 'right' }}>${b.car.price * b.days}</span>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: `1.5px solid ${T.ink3}40`, fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 14 }}><span>{tr({ uz: 'Jami:', ru: 'Итого:' })}</span><span style={{ color: T.success }}>${total}</span></div>
                      </>
                    )}
                  </div>
                </div>
              ) : <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{tr({ uz: "Promptni yig'ib, agentga yuboring…", ru: 'Соберите промпт и отправьте агенту…' })}</p>}
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Yuragi tayyor! Kun o'zgarsa — jami <b>o'zi qayta hisoblanadi</b> (state). <span className="mono">kun × narx</span> — ilovaning asosiy mantiqi.</>, ru: <>Сердце готово! Меняются дни — итог <b>пересчитывается сам</b> (state). <span className="mono">дни × цена</span> — главная логика приложения.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST 3 =====
const Screen8 = (props) => (
  <QuestionScreen {...props} idx={8} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    audioText="Uch kunlik Tesla, kuniga sakson dollardan — jami qancha? To'g'ri javobni tanlang."
    questionText="3 kunlik Tesla ($80/kun) — jami qancha?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Tesla <span className="mono" style={{ color: T.accent }}>$80/kun</span>, 3 kunga — <span className="italic" style={{ color: T.accent }}>jami</span>?</>, ru: <>Tesla по <span className="mono" style={{ color: T.accent }}>$80/день</span>, на 3 дня — <span className="italic" style={{ color: T.accent }}>итого</span>?</> })}</h2></>}
    options={[tr({ uz: '$80 — kunini hisobga olmaymiz', ru: '$80 — дни не учитываем' }), tr({ uz: "$83 — qo'shamiz", ru: '$83 — складываем' }), '$3', tr({ uz: '$240 — kun × narx (3 × 80)', ru: '$240 — дни × цена (3 × 80)' })]} correctIdx={3}
    explainCorrect={tr({ uz: "To'g'ri! Jami = kun × kunlik narx = 3 × 80 = $240. Bu ilovaning asosiy formulasi.", ru: 'Верно! Итог = дни × цена за день = 3 × 80 = $240. Это главная формула приложения.' })}
    explainWrong={{
      0: tr({ uz: "Diqqat! Bu — eng ko'p uchraydigan xato: kunni unutish. Jami = kun × narx.", ru: 'Внимание! Это самая частая ошибка: забыть про дни. Итог = дни × цена.' }),
      1: tr({ uz: "Qo'shish emas, ko'paytirish: 3 × 80 = 240.", ru: 'Не сложение, а умножение: 3 × 80 = 240.' }),
      2: tr({ uz: "Yo'q — bu faqat kun soni. Narxga ko'paytiring: 3 × 80.", ru: 'Нет — это только число дней. Умножьте на цену: 3 × 80.' }),
      default: tr({ uz: "Jami = kun × kunlik narx = 3 × 80 = $240.", ru: 'Итог = дни × цена за день = 3 × 80 = $240.' })
    }} />
);

// ===== SCREEN 9 — VIBECODING: QO'SHISH + ITERATSIYA (follow-up) =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [built, setBuilt] = useState(!!storedAnswer);
  const [iterated, setIterated] = useState(!!storedAnswer);
  const [list, setList] = useState(CARS.slice(0, 3));
  const [onAdd, setOnAdd] = useState(false); // /add sahifasidami
  const done = built && iterated;
  const addCar = () => {
    setList(prev => (prev.length >= 4 ? prev : [...prev, POOL[0]]));
    if (iterated) setOnAdd(false); // tuzatilgan: Bosh'ga qaytadi
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's9', text: `To'rtinchi qism — mashina qo'shish, va agentni sayqallash. Sotuvchi yangi mashina qo'shsin. Lekin diqqat: agent birinchi urinishda ko'pincha to'liq qilmaydi — siz natijani ko'rib, aniqlashtiruvchi prompt berasiz. Mana shu — haqiqiy agent boshqaruvi.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: "Qurish · Qo'shish", ru: 'Стройка · Добавление' })} screen={screen} audioState={audio} scrollSignal={built || done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (built ? tr({ uz: "Agentni to'g'rilang", ru: 'Поправьте агента' }) : tr({ uz: 'Agent bilan quring', ru: 'Постройте с агентом' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>4-qism: <span className="italic" style={{ color: T.accent }}>mashina qo'shish</span> — va agentni sayqallash.</>, ru: <>Часть 4: <span className="italic" style={{ color: T.accent }}>добавление машины</span> — и доводка агента.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Sotuvchi yangi mashina qo'shsin (POST). Lekin diqqat: agent <b style={{ color: T.ink }}>birinchi urinishda</b> ko'pincha to'liq qilmaydi — siz natijani ko'rib, <b style={{ color: T.ink }}>aniqlashtiruvchi prompt</b> berasiz. Mana shu — haqiqiy agent boshqaruvi.</>, ru: <>Пусть продавец добавляет новую машину (POST). Но внимание: агент <b style={{ color: T.ink }}>с первой попытки</b> часто делает не всё — Вы смотрите на результат и даёте <b style={{ color: T.ink }}>уточняющий промпт</b>. Вот это и есть настоящее управление агентом.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            {!built ? (
              <AgentBuild
                base={{ uz: "Mashina qo'shish formasini yasa", ru: 'Сделай форму добавления машины' }}
                parts={[{ id: 'form', label: { uz: 'nom va narx kiritilsin', ru: 'поля: название и цена' } }, { id: 'post', label: { uz: '"Saqlash"da serverga POST', ru: 'при «Сохранить» — POST на сервер' } }]}
                planSteps={[{ uz: "Forma: nom + narx input", ru: 'Форма: input название + цена' }, { uz: "Saqlash: fetch POST + body", ru: 'Сохранение: fetch POST + body' }]}
                code={<>{'fetch(url, { '}<At>method</At>{': '}<St>'POST'</St>{', '}<At>body</At>{': JSON.stringify(yangi) })'}</>}
                storedDone={false}
                onDone={() => setBuilt(true)}
              />
            ) : (
              <div className="ai-card fade-step">
                <div className="ai-row"><span className="ai-badge" style={{ background: T.ink }}>{tr({ uz: 'Agent', ru: 'Агент' })}</span><span className="ai-bubble">{iterated ? tr({ uz: "Tuzatdim — endi Bosh'ga qaytaradi", ru: 'Исправил — теперь возвращает на Главную' }) : tr({ uz: "Bajardim — sinab ko'ring", ru: 'Готово — попробуйте' })}</span></div>
                <div className="ai-code"><div className="ai-line ok" style={{ cursor: 'default', whiteSpace: 'pre-wrap' }}>{iterated ? <>{'fetch(url, { method: '}<St>'POST'</St>{', … });'}{'\n'}<span style={{ background: 'rgba(31,122,77,0.18)', borderRadius: 4, padding: '0 3px' }}>{'navigate('}<St>'/'</St>{');'}</span>{'  '}<Cm>{tr({ uz: "// Bosh'ga qaytaradi", ru: '// возвращает на Главную' })}</Cm></> : <>{'fetch(url, { method: '}<St>'POST'</St>{', … });'}{'  '}<Cm>{tr({ uz: "// qo'shadi, lekin /add'da qoladi", ru: '// добавляет, но остаётся на /add' })}</Cm></>}</div></div>
                {!iterated && (
                  <>
                    <div className="prompt-box" style={{ marginTop: 4 }}><span className="prompt-q">"</span>{tr({ uz: <>Qo'shgandan keyin avtomatik <b>Bosh sahifaga qaytar</b> (useNavigate)</>, ru: <>После добавления автоматически <b>верни на Главную</b> (useNavigate)</> })}<span className="prompt-q">"</span></div>
                    <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={() => { setIterated(true); setOnAdd(false); }}>{tr({ uz: '↳ Aniqlashtiruvchi prompt yuborish', ru: '↳ Отправить уточняющий промпт' })}</button>
                  </>
                )}
                {iterated && <p className="ai-prompt" style={{ color: T.success, fontStyle: 'normal', fontWeight: 600 }}>{tr({ uz: "✓ Endi to'liq ishlaydi.", ru: '✓ Теперь работает полностью.' })}</p>}
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija', ru: 'Результат' })} {built ? tr({ uz: '— "+ Qo\'shish"ni sinang', ru: '— попробуйте «+ Добавить»' }) : ''}</p>
            <Win title="AvtoIjara — localhost:5173" minH={140}>
              {built ? (
                <div className="fade-step">
                  <div className="navmenu" style={{ marginBottom: 8 }}><span className={`navlink ${onAdd ? '' : 'on'}`}>{tr({ uz: '🏠 Bosh', ru: '🏠 Главная' })}</span><span className={`navlink ${onAdd ? 'on' : ''}`}>{tr({ uz: "➕ Qo'shish", ru: '➕ Добавить' })}</span></div>
                  {onAdd && !iterated
                    ? <div><div style={{ background: T.bg, borderRadius: 8, padding: '8px 11px', fontSize: 12, color: T.ink3, marginBottom: 8 }}>{tr({ uz: "Yangi mashina qo'shildi ✓ — lekin hali shu yerdasiz", ru: 'Новая машина добавлена ✓ — но Вы всё ещё здесь' })}</div><p className="small" style={{ color: T.danger, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Bosh sahifaga qaytmadi! Agentni to'g'rilang ←", ru: 'Не вернулось на Главную! Поправьте агента ←' })}</p></div>
                    : <><div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}><button className="chip chip-on" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => { setOnAdd(true); addCar(); }}>{tr({ uz: "+ Qo'shish", ru: '+ Добавить' })}</button></div><Grid cols={3}>{list.map(c => <CarCard key={c.id} car={c} />)}</Grid></>}
                </div>
              ) : <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: 'Georgia, serif', fontSize: 13 }}>{tr({ uz: "Promptni yig'ib, agentga yuboring…", ru: 'Соберите промпт и отправьте агенту…' })}</p>}
            </Win>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mana agent boshqaruvi: birinchi natija to'liq emasdi — siz ko'rdingiz, <b>aniqlashtiruvchi prompt</b> berdingiz, AI tuzatdi. Birinchi javobni ko'r-ko'rona qabul qilmang!</>, ru: <>Вот управление агентом: первый результат был неполным — Вы это увидели, дали <b>уточняющий промпт</b>, и ИИ исправил. Не принимайте первый ответ вслепую!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — AMALIYOT: TO'LIQ ILOVANI ISHLATING =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [page, setPage] = useState('/');
  const [openId, setOpenId] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [didBrowse, setDidBrowse] = useState(!!storedAnswer);
  const [didRent, setDidRent] = useState(!!storedAnswer);
  const [didTotal, setDidTotal] = useState(!!storedAnswer);
  const done = didBrowse && didRent && didTotal;
  const open = (id) => { setOpenId(id); setPage('/car/:id'); setDidBrowse(true); };
  const rent = (car) => { setBookings(prev => (prev.some(b => b.car.id === car.id) ? prev : [...prev, { car, days: 2 }])); setDidRent(true); setPage('/bookings'); };
  const setDays = (id, d) => { setBookings(prev => prev.map(b => b.car.id === id ? { ...b, days: Math.max(1, d) } : b)); setDidTotal(true); };
  const total = bookings.reduce((s, b) => s + b.car.price * b.days, 0);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const Tick = ({ ok, label }) => <span className="tagpill" style={{ color: ok ? T.success : T.ink3 }}>{ok ? '✓' : '○'} {label}</span>;
  const audio = useAudio([{ id: 's10', text: `Mana yig'ilgan AvtoIjara — endi o'zingiz ishlatib ko'ring. Mashinani oching, ijaraga oling, keyin kunni o'zgartirib jami narxni kuzating. Uchalasi bajarilsa — ilova tayyor ishlaydi.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot · to'liq ilova", ru: 'Практика · полное приложение' })} screen={screen} audioState={audio} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: '3 amalni bajaring', ru: 'Выполните 3 действия' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>to'liq ilovani</span> o'zingiz ishlating.</>, ru: <>Теперь испытайте <span className="italic" style={{ color: T.accent }}>полное приложение</span> сами.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana yig'ilgan AvtoIjara! Sinab ko'ring: mashinani <b style={{ color: T.ink }}>oching</b> → <b style={{ color: T.ink }}>ijaraga oling</b> → kunni o'zgartirib <b style={{ color: T.ink }}>jami narx</b>ni kuzating. Uchalasi bajarilsa — ilova ishlaydi!</>, ru: <>Вот собранное AvtoIjara! Попробуйте: <b style={{ color: T.ink }}>откройте</b> машину → <b style={{ color: T.ink }}>возьмите в аренду</b> → меняйте дни и следите за <b style={{ color: T.ink }}>итоговой ценой</b>. Все три сделаны — приложение работает!</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <Win title="AvtoIjara — localhost:5173" minH={180}>
              <div className="navmenu" style={{ marginBottom: 9 }}>
                <button className={`navlink ${page === '/' ? 'on' : ''}`} onClick={() => setPage('/')}>{tr({ uz: '🏠 Bosh', ru: '🏠 Главная' })}</button>
                <button className={`navlink ${page === '/bookings' ? 'on' : ''}`} onClick={() => setPage('/bookings')}>{tr({ uz: '🔑 Ijaralarim', ru: '🔑 Мои аренды' })} {bookings.length ? `(${bookings.length})` : ''}</button>
              </div>
              {page === '/' && <Grid cols={3}>{CARS.map(c => <CarCard key={c.id} car={c} onOpen={() => open(c.id)} />)}</Grid>}
              {page === '/car/:id' && <CarDetail id={openId} onRent={() => rent(carById(openId))} />}
              {page === '/bookings' && (
                bookings.length === 0 ? <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Hali ijara yo'q — mashina oching va ijaraga oling.", ru: 'Аренд пока нет — откройте машину и возьмите её в аренду.' })}</p> : (
                  <div>
                    {bookings.map(b => (
                      <div key={b.car.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '5px 0' }}>
                        <span style={{ fontWeight: 700, color: T.ink, flex: 1 }}>{b.car.emoji} {b.car.name}</span>
                        <button className="daybtn" onClick={() => setDays(b.car.id, b.days - 1)}>−</button>
                        <span className="mono" style={{ minWidth: 44, textAlign: 'center' }}>{b.days} {tr({ uz: 'kun', ru: 'дн.' })}</span>
                        <button className="daybtn" onClick={() => setDays(b.car.id, b.days + 1)}>+</button>
                        <span style={{ color: T.accent, fontWeight: 800, minWidth: 50, textAlign: 'right' }}>${b.car.price * b.days}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: `1.5px solid ${T.ink3}40`, fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 14 }}><span>{tr({ uz: 'Jami:', ru: 'Итого:' })}</span><span style={{ color: T.success }}>${total}</span></div>
                  </div>
                )
              )}
            </Win>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Bajarilishi kerak', ru: 'Нужно выполнить' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              <Tick ok={didBrowse} label={tr({ uz: 'Mashina ochdim', ru: 'Открыл(а) машину' })} /><Tick ok={didRent} label={tr({ uz: 'Ijaraga oldim', ru: 'Взял(а) в аренду' })} /><Tick ok={didTotal} label={tr({ uz: "Kun/jami o'zgartirdim", ru: 'Менял(а) дни/итог' })} />
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>🎉 To'liq ishlaydi! Katalog (GET) → mashina sahifasi (Router) → ijara + jami (state) — hammasi bitta ilovada. Siz bularni <b>AI bilan birga qurdingiz</b>.</>, ru: <>🎉 Работает полностью! Каталог (GET) → страница машины (Router) → аренда + итог (state) — всё в одном приложении. Вы построили это <b>вместе с ИИ</b>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — DEBUGGING (jami narx: AI kunni unutgan) =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [picked, setPicked] = useState(storedAnswer ? 'total' : null);
  const [fixed, setFixed] = useState(!!storedAnswer);
  const found = picked === 'total';
  const done = fixed;
  const bookings = [{ car: CARS[1], days: 3 }, { car: CARS[0], days: 2 }]; // Lambo 3 kun, Tesla 2 kun
  const wrongTotal = bookings.reduce((s, b) => s + b.car.price, 0); // 200+80 = 280 (xato)
  const rightTotal = bookings.reduce((s, b) => s + b.car.price * b.days, 0); // 600+160 = 760
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's11', text: `AI yordam beradi, siz esa tekshirasiz. Mijoz shikoyat qildi: jami narx noto'g'ri. Agent qaysidir qatorda kunni unutgan — jami faqat narxdan chiqyapti. Kodni o'qing, kun tushib qolgan qatorni toping va tuzating.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Debugging', ru: 'Дебаггинг' })} screen={screen} audioState={audio} scrollSignal={found || fixed} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (found ? tr({ uz: 'Endi tuzating', ru: 'Теперь исправьте' }) : tr({ uz: 'Xatoni toping', ru: 'Найдите ошибку' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI yordam beradi — siz esa <span className="italic" style={{ color: T.accent }}>tekshirasiz</span>.</>, ru: <>ИИ помогает — а <span className="italic" style={{ color: T.accent }}>проверяете</span> Вы.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mijoz shikoyat qildi: <b style={{ color: T.ink }}>jami narx noto'g'ri</b>! Lamborghini 3 kun ($200) + Tesla 2 kun ($80) — jami $760 bo'lishi kerak, lekin $280 chiqyapti. Agent qaysidir qatorda <b style={{ color: T.ink }}>kun</b>ni unutgan. Toping.</>, ru: <>Клиент пожаловался: <b style={{ color: T.ink }}>итоговая цена неверная</b>! Lamborghini 3 дня ($200) + Tesla 2 дня ($80) — итог должен быть $760, а выходит $280. Агент в какой-то строке забыл про <b style={{ color: T.ink }}>дни</b>. Найдите её.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-2">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: 'Jami narx kodi:', ru: 'Код итоговой цены:' })}</span></div>
              <div className="ai-code">
                <div className={`ai-line ${picked === 'list' ? 'ok' : ''}`} onClick={() => { if (!found) setPicked('list'); }}><Jx>{'const'}</Jx>{' jami = bookings.reduce('}</div>
                {!fixed ? (
                  <div className={`ai-line ${found ? 'bad' : ''}`} onClick={() => { if (!found) setPicked('total'); }}>{'  (s, b) => s + b.car.price'}{'  '}<Cm>{tr({ uz: '// kun qani?', ru: '// а где дни?' })}</Cm></div>
                ) : (
                  <div className="ai-line ok el-in">{'  (s, b) => s + b.car.price '}<span style={{ background: 'rgba(31,122,77,0.25)', borderRadius: 4, padding: '0 3px' }}>{'* b.days'}</span>{'  '}<Cm>{tr({ uz: '// kun × narx!', ru: '// дни × цена!' })}</Cm></div>
                )}
                <div className={`ai-line ${picked === 'end' ? 'ok' : ''}`} onClick={() => { if (!found) setPicked('end'); }}>{', 0);'}</div>
              </div>
              {!found && <p className="ai-prompt">{tr({ uz: 'Qaysi qator kunni hisobga olmayapti? Bosing.', ru: 'Какая строка не учитывает дни? Нажмите на неё.' })}</p>}
              {found && !fixed && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={() => setFixed(true)}>{tr({ uz: "🔧 * b.days qo'shish", ru: '🔧 Добавить * b.days' })}</button>}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: 'normal', fontWeight: 600 }}>{tr({ uz: '✓ Tuzatildi — endi kun ham hisobga olinadi!', ru: '✓ Исправлено — теперь дни тоже учитываются!' })}</p>}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: '🔑 Mening ijaralarim', ru: '🔑 Мои аренды' })}</p>
            <Win title="AvtoIjara — localhost:5173" minH={120}>
              {bookings.map(b => (
                <div key={b.car.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '5px 0' }}>
                  <span style={{ fontWeight: 700, color: T.ink, flex: 1 }}>{b.car.emoji} {b.car.name}</span>
                  <span className="mono" style={{ color: T.ink3 }}>{b.days} {tr({ uz: 'kun', ru: 'дн.' })} × ${b.car.price}</span>
                  <span style={{ color: T.accent, fontWeight: 800, minWidth: 50, textAlign: 'right' }}>${fixed ? b.car.price * b.days : b.car.price}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: `1.5px solid ${T.ink3}40`, fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 15 }}><span>{tr({ uz: 'Jami:', ru: 'Итого:' })}</span><span style={{ color: fixed ? T.success : T.danger }}>${fixed ? rightTotal : wrongTotal}{!fixed && ' ✗'}</span></div>
            </Win>
            {!found && (
              (picked === 'list' || picked === 'end')
                ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu qator to'g'ri. Yana qarang: <span className="mono">b.car.price</span> bor, lekin <b>kun</b> (<span className="mono">b.days</span>) qayerda?</>, ru: <>Эта строка верная. Посмотрите ещё раз: <span className="mono">b.car.price</span> есть, но где <b>дни</b> (<span className="mono">b.days</span>)?</> })}</p></div>
                : <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Jami = <b style={{ color: T.ink }}>kun × narx</b> bo'lishi kerak edi. Kodda narx bor — lekin kunga ko'paytirilmagan qator qaysi?</>, ru: <>Итог должен был быть <b style={{ color: T.ink }}>дни × цена</b>. В коде цена есть — но в какой строке она не умножена на дни?</> })}</p></div>
            )}
            {found && !fixed && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: '✓ Topdingiz!', ru: '✓ Нашли!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Agent <span className="mono">s + b.car.price</span> yozgan — faqat narx, <b>kunsiz</b>. To'g'risi: <span className="mono">s + b.car.price * b.days</span>. Chapdagi tugma bilan tuzating →</>, ru: <>Агент написал <span className="mono">s + b.car.price</span> — только цена, <b>без дней</b>. Правильно: <span className="mono">s + b.car.price * b.days</span>. Исправьте кнопкой слева →</> })}</p></div>}
            {fixed && <div className="takeaway fade-step"><div className="ta-bulb">🛠️</div><p className="ta-h">{tr({ uz: 'Topdingiz va tuzatdingiz — bu debugging!', ru: 'Нашли и исправили — это и есть дебаггинг!' })}</p><p className="ta-sub">{tr({ uz: 'AI tez yozadi, siz tekshirib tuzatasiz — zo\'r jamoa', ru: 'ИИ пишет быстро, Вы проверяете и исправляете — отличная команда' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TEST 4 =====
const Screen12 = (props) => (
  <QuestionScreen {...props} idx={12} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    audioText="Agentning birinchi kodi natijasi to'liq emas. Nima qilasiz? To'g'ri javobni tanlang."
    questionText="Agentning birinchi kodi natijasi to'liq emas. Nima qilasiz?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Agent kodi natijasi <span className="italic" style={{ color: T.accent }}>to'liq emas</span> — nima qilasiz?</>, ru: <>Результат кода агента <span className="italic" style={{ color: T.accent }}>неполный</span> — что Вы сделаете?</> })}</h2></>}
    options={[tr({ uz: 'Birinchi natijani shundayligicha qabul qilaman', ru: 'Приму первый результат как есть' }), tr({ uz: "Natijani ko'rib, aniqlashtiruvchi follow-up prompt beraman", ru: 'Посмотрю результат и дам уточняющий follow-up промпт' }), tr({ uz: 'Loyihani tashlab ketaman', ru: 'Брошу проект' }), tr({ uz: "AI yomon deb, hammasini qo'lda yozaman", ru: 'Решу, что ИИ плох, и напишу всё вручную' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! Agentni boshqarish — bu suhbat: natijani ko'rasiz, aniq follow-up berasiz ('kunni ham hisobla'), AI tuzatadi. Birinchi javob ko'pincha boshlanish, oxiri emas.", ru: 'Верно! Управление агентом — это диалог: Вы смотрите на результат, даёте точный follow-up («учти ещё дни»), и ИИ исправляет. Первый ответ — чаще начало, а не конец.' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — birinchi javob ko'pincha to'liq emas. Siz boshliqsiz: tekshiring va sayqallang.", ru: 'Нет — первый ответ часто неполный. Вы руководитель: проверяйте и дорабатывайте.' }),
      2: tr({ uz: "Yo'q — bir-ikki follow-up prompt bilan to'g'rilanadi. Tashlab ketish shart emas.", ru: 'Нет — один-два follow-up промпта всё исправят. Бросать не нужно.' }),
      3: tr({ uz: "AI yomon emas — uni boshqarish kerak. Aniq prompt bilan tezroq bo'lasiz.", ru: 'ИИ не плох — им нужно управлять. С точным промптом Вы будете быстрее.' }),
      default: tr({ uz: "Natijani tekshiring → aniqlashtiruvchi prompt bering → AI sayqallaydi.", ru: 'Проверьте результат → дайте уточняющий промпт → ИИ доработает.' })
    }} />
);

// ===== SCREEN 13 — TRANSFER ("istalgan saytni qura olaman") =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const IDEAS = [
    { e: '🍕', t: tr({ uz: 'Pitsa yetkazish', ru: 'Доставка пиццы' }), d: tr({ uz: 'menyu · savat · buyurtma', ru: 'меню · корзина · заказ' }) },
    { e: '🎵', t: tr({ uz: "Musiqa ro'yxati", ru: 'Музыкальный сервис' }), d: tr({ uz: "qo'shiqlar · pleylist · like", ru: 'песни · плейлист · лайк' }) },
    { e: '📚', t: tr({ uz: "Kitob do'koni", ru: 'Книжный магазин' }), d: tr({ uz: 'katalog · savat · sotib olish', ru: 'каталог · корзина · покупка' }) },
    { e: '⚽', t: tr({ uz: 'Sport jadvali', ru: 'Спортивное расписание' }), d: tr({ uz: "o'yinlar · natija · sevimli", ru: 'матчи · результат · избранное' }) }
  ];
  const [picked, setPicked] = useState(storedAnswer ? IDEAS[0].t : null);
  const done = !!picked;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const audio = useAudio([{ id: 's13', text: `Eng muhim narsani anglang: siz mashina ilovasini emas, besh qadamli usulni o'rgandingiz — rejala, aniq prompt, agent quradi, tekshir, tuzat. Shu usul bilan istalgan saytni qurasiz. Quyidagi g'oyani tanlang — xuddi shu qadamlarni ko'rasiz.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Eng muhimi', ru: 'Самое главное' })} screen={screen} audioState={audio} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Bitta g'oyani tanlang", ru: 'Выберите одну идею' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bu mashina edi — lekin <span className="italic" style={{ color: T.accent }}>istalgan saytni</span> shu yo'l bilan.</>, ru: <>Это были машины — но тем же путём строится <span className="italic" style={{ color: T.accent }}>любой сайт</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Eng muhim narsani anglang: siz mashina ilovasini emas, <b style={{ color: T.ink }}>5 qadamli usulni</b> o'rgandingiz — rejala → aniq prompt → agent quradi → tekshir → tuzat. Shu usul bilan <b style={{ color: T.ink }}>istalgan saytni</b> qurasiz. Quyidagi g'oyani tanlang — ko'ring: xuddi shu qadamlar.</>, ru: <>Поймите самое главное: Вы выучили не приложение про машины, а <b style={{ color: T.ink }}>метод из 5 шагов</b> — спланируй → точный промпт → агент строит → проверь → исправь. Этим методом Вы построите <b style={{ color: T.ink }}>любой сайт</b>. Выберите идею ниже — и увидите: шаги те же.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "G'oyani tanlang", ru: 'Выберите идею' })}</p>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {IDEAS.map(idea => (
                <button key={idea.t} className={`chip ${picked === idea.t ? 'chip-on' : ''}`} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 3, padding: '11px 13px', height: 'auto' }} onClick={() => setPicked(idea.t)}>
                  <span style={{ fontSize: 18 }}>{idea.e} {idea.t}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.85 }}>{idea.d}</span>
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {picked ? (
              <div className="fade-step">
                <p className="flow-label">"{picked}" — {tr({ uz: 'xuddi shu 5 qadam', ru: 'те же 5 шагов' })}</p>
                <ol className="roadmap" style={{ gap: 6 }}>
                  {[tr({ uz: "Rejalashtiring — sahifalar va ma'lumot", ru: 'Спланируйте — страницы и данные' }), tr({ uz: 'Aniq prompt yozing (Nima + Qanday + Qayerda)', ru: 'Напишите точный промпт (Что + Как + Где)' }), tr({ uz: 'Agent quradi — rejasini tasdiqlang', ru: 'Агент строит — одобрите его план' }), tr({ uz: 'Kodni tekshiring, natijani sinang', ru: 'Проверьте код, испытайте результат' }), tr({ uz: 'Xatoni debug qiling → tayyor!', ru: 'Отладьте ошибку → готово!' })].map((s, i) => (
                    <li key={i} className="step-card" style={{ padding: '9px 13px' }}><span className="step-num">{i + 1}</span><span className="step-text" style={{ fontSize: 13 }}>{s}</span></li>
                  ))}
                </ol>
                <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ko'rdingizmi? Mavzu o'zgardi — usul <b>o'sha</b>. Siz endi g'oyani aytib, agentni boshqarib, <b>istalgan saytni</b> qura olasiz.</>, ru: <>Видите? Тема изменилась — метод <b>тот же</b>. Теперь Вы можете назвать идею, управлять агентом и построить <b>любой сайт</b>.</> })}</p></div>
              </div>
            ) : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Chapdan g'oya tanlang", ru: 'Выберите идею слева' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — YAKUNIY (VS Code: jami narx formulasi) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [value, setValue] = useState(storedAnswer?.picked || '');
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const norm = value.replace(/\s+/g, ' ').trim();
  const valid = /^b\.(car\.)?price\s*\*\s*b\.days$|^b\.days\s*\*\s*b\.(car\.)?price$/.test(norm);
  const hasPrice = /b\.(car\.)?price/.test(value);
  const hasMul = /\*/.test(value);
  const hasDays = /b\.days/.test(value);
  useEffect(() => {
    if (valid && !passed) {
      setPassed(true);
      onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'VS Code: jami uchun b.price * b.days', studentAnswer: value, correct: true, firstAttemptCorrect: true, solved: true, picked: value });
    }
  }, [valid]);
  const Ln = ({ n, children }) => (
    <div className="vsc-line"><span className="vsc-ln">{n}</span><span style={{ whiteSpace: 'pre' }}>{children}</span></div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} scrollSignal={passed} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Formulani yozing', ru: 'Напишите формулу' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: ilovaning <span className="italic" style={{ color: T.accent }}>yuragini</span> o'zingiz yozing.</>, ru: <>Последний шаг: напишите <span className="italic" style={{ color: T.accent }}>сердце</span> приложения сами.</> })}</h2></div>
        <Mentor>{tr({ uz: <>VS Code'da jami narx hisobi ochiq — faqat <b style={{ color: T.ink }}>3-qator bo'sh</b>. Har ijara uchun <b style={{ color: T.ink }}>narx × kun</b> ni yozing: <span className="mono">b.price</span> <b style={{ color: T.ink }}>*</b> <span className="mono">b.days</span>. Mana shu — AvtoIjara'ning asosiy mantiqi.</>, ru: <>В VS Code открыт расчёт итоговой цены — пустует только <b style={{ color: T.ink }}>строка 3</b>. Напишите для каждой аренды <b style={{ color: T.ink }}>цена × дни</b>: <span className="mono">b.price</span> <b style={{ color: T.ink }}>*</b> <span className="mono">b.days</span>. Это и есть главная логика AvtoIjara.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="vsc fade-up delay-2">
              <div className="vsc-bar">
                <span className="vsc-tab on"><span style={{ color: '#61DAFB' }}>⚛</span> Bookings.jsx <span style={{ color: '#6E7681', marginLeft: 4 }}>×</span></span>
              </div>
              <div className="vsc-body">
                <Ln n={1}><Jx>{'const'}</Jx>{' jami = bookings.reduce('}</Ln>
                <Ln n={2}>{'  (s, b) => s +'}</Ln>
                <div className="vsc-line">
                  <span className="vsc-ln">3</span>
                  <span style={{ whiteSpace: 'pre' }}>{'    '}</span>
                  <input className={`vsc-input ${valid ? 'ok' : ''}`} value={value} onChange={e => setValue(e.target.value)} placeholder='b.price * b.days' spellCheck={false} autoCapitalize="off" autoCorrect="off" />
                </div>
                <Ln n={4}>{'  , 0);'}</Ln>
              </div>
            </div>
            <div className="fade-up delay-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tagpill" style={{ opacity: hasPrice ? 1 : 0.4 }}>{hasPrice ? '✓' : '1'} b.price</span>
              <span className="tagpill" style={{ opacity: hasMul ? 1 : 0.4 }}>{hasMul ? '✓' : '2'} * {tr({ uz: "(ko'paytirish)", ru: '(умножение)' })}</span>
              <span className="tagpill" style={{ opacity: hasDays ? 1 : 0.4 }}>{hasDays ? '✓' : '3'} b.days</span>
            </div>
            {passed && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ Mukammal! Jami = narx × kun. AvtoIjara to'liq ishlaydi — boshidan oxirigacha siz qurdingiz.", ru: '✓ Великолепно! Итог = цена × дни. AvtoIjara полностью работает — Вы построили его от начала до конца.' })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija — Mening ijaralarim', ru: 'результат — Мои аренды' })}</p>
            <Win title="AvtoIjara — localhost:5173" minH={120}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '5px 0' }}><span style={{ fontWeight: 700, flex: 1 }}>🏎️ Lamborghini</span><span className="mono" style={{ color: T.ink3 }}>3 {tr({ uz: 'kun', ru: 'дн.' })} × $200</span><span style={{ color: T.accent, fontWeight: 800 }}>${valid ? 600 : '?'}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '5px 0' }}><span style={{ fontWeight: 700, flex: 1 }}>⚡ Tesla</span><span className="mono" style={{ color: T.ink3 }}>2 {tr({ uz: 'kun', ru: 'дн.' })} × $80</span><span style={{ color: T.accent, fontWeight: 800 }}>${valid ? 160 : '?'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: `1.5px solid ${T.ink3}40`, fontWeight: 800, fontSize: 15 }}><span>{tr({ uz: 'Jami:', ru: 'Итого:' })}</span><span style={{ color: valid ? T.success : T.ink3 }}>${valid ? 760 : '?'}</span></div>
              {!valid && <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: '10px 0 0', textAlign: 'center', fontSize: 12.5 }}>{tr({ uz: '3-qator yozilmaguncha jami hisoblanmaydi', ru: 'Пока строка 3 не написана, итог не считается' })}</p>}
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
    tr({ uz: "Loyihani bo'laklash: sahifalar + ma'lumot + amallar", ru: 'Разбивка проекта: страницы + данные + действия' }),
    tr({ uz: "Yaxshi prompt = Nima + Qanday + Qayerda (aniq → aniq natija)", ru: 'Хороший промпт = Что + Как + Где (точно → точный результат)' }),
    tr({ uz: "Agentni boshqarish: buyur → reja → tasdiq → tekshir → sina", ru: 'Управление агентом: поручи → план → одобри → проверь → испытай' }),
    tr({ uz: "Iteratsiya: natijani ko'rib, aniqlashtiruvchi follow-up prompt", ru: 'Итерация: смотрим результат и даём уточняющий follow-up промпт' }),
    tr({ uz: "Debug: kodni o'qib xatoni topish (jami = kun × narx)", ru: 'Дебаг: найти ошибку, читая код (итог = дни × цена)' })
  ];
  const HOMEWORK = [
    { b: tr({ uz: "O'z g'oyangiz", ru: 'Ваша идея' }), t: tr({ uz: "— Antigravity bilan o'zingiz xohlagan ilovani tanlang (mashina emas)", ru: '— выберите с Antigravity любое приложение по душе (не про машины)' }) },
    { b: tr({ uz: "Rejalashtiring", ru: 'Спланируйте' }), t: tr({ uz: "— sahifalar + ma'lumotni qog'ozga chizing", ru: '— нарисуйте на бумаге страницы + данные' }) },
    { b: tr({ uz: "Quring", ru: 'Постройте' }), t: tr({ uz: "— aniq promptlar bilan agentga qurdiring, tekshiring, tuzating", ru: '— поручите агенту точными промптами, проверяйте и исправляйте' }) }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const audio = useAudio([{ id: 's15', text: `Tabriklaymiz — to'liq ilovani AI bilan qurdingiz! Esda saqlang: loyihani avval sahifalarga bo'laklaysiz, keyin har buyruqni Nima, Qanday, Qayerda bilan aniq berasiz. Agent quradi, siz rejasini tasdiqlaysiz, kodini tekshirasiz va xatoni tuzatasiz. Shu besh qadam bilan istalgan saytni qura olasiz.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Loyiha kuni tugadi', ru: 'Проектный день завершён' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>To'liq ilovani <span className="italic" style={{ color: T.accent }}>AI bilan qurdingiz</span>.</>, ru: <>Вы <span className="italic" style={{ color: T.accent }}>построили с ИИ</span> полное приложение.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Antigravity bilan o'z loyihangizni boshlang:", ru: 'Начните с Antigravity свой проект:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>))}</ul><p className="hw-note">{tr({ uz: "Keyingi va oxirgi qadam: o'z bitiruv loyihangizni katta bo'laklarga ajratib, noldan qurishni boshlaysiz! 🚀", ru: 'Следующий и последний шаг: разобьёте свой выпускной проект на крупные части и начнёте строить его с нуля! 🚀' })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '🏅 Nishonlaringiz', ru: '🏅 Ваши награды' })} — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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

// ===== 🏅 ACHIEVEMENTS (nishonlar) — REAL scored/challenge bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  lead:     { icon: '🎯', name: 'In Command!', desc: { uz: "Agentni buyur → reja → tasdiq bilan boshqardingiz", ru: 'Вы управляли агентом: поручи → план → одобри' } },
  builder:  { icon: '🚀', name: 'Shipped It!', desc: { uz: "To'liq AvtoIjara mantiqini ishga tushirdingiz", ru: 'Вы запустили полную логику AvtoIjara' } },
  debugger: { icon: '🐞', name: 'Bug Hunter!', desc: { uz: "jami = kun × narx xatosini topib tuzatdingiz", ru: 'Вы нашли и исправили ошибку «итог = дни × цена»' } },
  graduate: { icon: '🏆', name: 'Level Up!',   desc: { uz: "Loyiha kuni capstone darsini yakunladingiz", ru: 'Вы завершили capstone-урок проектного дня' } },
};
// Ekran id → nishon (recordAnswer'da, FAQAT REAL solve: scored testlar) — free-pass exploration'ga bog'lanmaydi
const ACH_TRIGGERS = { s4: 'lead', s8: 'builder', s12: 'debugger', s14: 'graduate' };

// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI — yorqin nurlar, medal portlashi, uchqunlar, zarba to'lqini
function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr({ uz: 'Yangi nishon:', ru: 'Новая награда:' })} ${ach.name}`}>
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

// 🃏 FLASHCARD KARTALARI (front=savol, back=qisqa javob, note=bir qatorlik misol)
const REACT_FLASHCARDS = [
  { front: { uz: "Yaxshi prompt qaysi 3 narsani aytadi?", ru: 'Какие 3 вещи называет хороший промпт?' }, back: { uz: "Nima + Qanday + Qayerda", ru: 'Что + Как + Где' }, note: { uz: "aniq buyruq — aniq natija", ru: 'точная команда — точный результат' } },
  { front: { uz: "Siz uchun kod yozadigan AI yordamchi qanday ataladi?", ru: 'Как называется ИИ-помощник, который пишет за Вас код?' }, back: { uz: "Agent", ru: 'Агент' }, note: { uz: "siz buyurasiz, agent quradi", ru: 'Вы поручаете, агент строит' } },
  { front: { uz: "Agentni boshqarish halqasi qaysi 5 qadamdan iborat?", ru: 'Из каких 5 шагов состоит цикл управления агентом?' }, back: { uz: "buyur → reja → tasdiq → tekshir → sina", ru: 'поручи → план → одобри → проверь → испытай' }, note: { uz: "avval reja, keyin kod", ru: 'сначала план, потом код' } },
  { front: { uz: "Agent natijasi to'liq chiqmasa nima qilasiz?", ru: 'Что делать, если результат агента неполный?' }, back: { uz: "Follow-up prompt beraman", ru: 'Дам follow-up промпт' }, note: { uz: "aniqlashtiruvchi ikkinchi buyruq", ru: 'уточняющая вторая команда' } },
  { front: { uz: "Serverdan mashinalar ro'yxatini nima olib keladi?", ru: 'Что приносит список машин с сервера?' }, back: "GET (fetch)", note: { uz: "javob JSON bo'lib qaytadi", ru: 'ответ возвращается в JSON' } },
  { front: { uz: "Ro'yxatni kartochkalarga nima aylantiradi?", ru: 'Что превращает список в карточки?' }, back: ".map()", note: { uz: "har mashinaga bitta CarCard", ru: 'на каждую машину — один CarCard' } },
  { front: { uz: "Serverga yangi mashina qanday qo'shiladi?", ru: 'Как добавить на сервер новую машину?' }, back: "POST", note: { uz: "yangi ma'lumot serverga yuboriladi", ru: 'новые данные отправляются на сервер' } },
  { front: { uz: "Tanlangan ijaralar ro'yxati qayerda eslab qolinadi?", ru: 'Где запоминается список выбранных аренд?' }, back: "State (useState)", note: { uz: "state o'zgarsa ekran o'zi yangilanadi", ru: 'меняется state — экран обновляется сам' } },
  { front: { uz: "Kartochkaga nom va narxni nima uzatadi?", ru: 'Что передаёт карточке название и цену?' }, back: "props", note: "<CarCard car={c} />" },
  { front: { uz: "Sahifadan sahifaga o'tishni nima boshqaradi?", ru: 'Что управляет переходом со страницы на страницу?' }, back: "Router (<Route> · <Link>)", note: "/car/:id" },
  { front: { uz: "Ijaraning jami narxi qanday hisoblanadi?", ru: 'Как считается итоговая цена аренды?' }, back: { uz: "kun × kunlik narx", ru: 'дни × цена за день' }, note: { uz: "eng ko'p uchraydigan xato — kunni unutish", ru: 'самая частая ошибка — забыть дни' } },
  { front: { uz: "Kodni o'qib xatoni topish qanday ataladi?", ru: 'Как называется поиск ошибки чтением кода?' }, back: { uz: "Debugging", ru: 'Дебаггинг' }, note: { uz: "agentning birinchi javobini tekshirasiz", ru: 'Вы проверяете первый ответ агента' } },
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

const Q_LABELS = { 4: { uz: "1 — Yaxshi prompt", ru: '1 — Хороший промпт' }, 6: { uz: "2 — Katalog", ru: '2 — Каталог' }, 11: { uz: "3 — Ijara + jami", ru: '3 — Аренда + итог' }, 16: { uz: "4 — Debugging", ru: '4 — Дебаггинг' }, 19: { uz: "5 — Boshliq halqasi", ru: '5 — Цикл руководителя' } };
// Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi). s14 = -1 (yakuniy amaliy).
const INLINE_KEYS = { s4: 2, s5b: 0, s8: 3, s12: 1, s14: -1 };

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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>место {myIdx + 1}</b> ({board[myIdx].okCount}/{totalQ} верных)</> })}</p>}
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
                      <span className="qstat-lbl">{Q_LABELS[q] ? tr(Q_LABELS[q]) : `#${q}`}{hard && ' ⚠️'}</span>
                      <span className="mstats-track"><span className="mstats-fill" style={{ width: `${pct}%`, background: hard ? T.accent : T.success }} /></span>
                      <span className="mono qstat-n">{okN}/{qa.length}</span>
                    </div>
                  );
                })}
              </div>
              {live.mode === 'mentor' && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.', ru: 'Вопросы с ⚠️ — темы, где класс споткнулся. Рекомендуем объяснить их ещё раз.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];

// Arena foni: suzuvchi tokenlar — dars mavzusidan (loyiha kuni · agent · kun×narx)
const QZ_BG_SHAPES = [
  { ch: 'useState',  l: 5,  t: 10, s: 30, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: 'props',     l: 84, t: 7,  s: 28, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: '.map()',    l: 8,  t: 72, s: 30, c: 'rgba(120,235,175,0.15)', d: 27, dl: 0.8 },
  { ch: '<Route>',   l: 80, t: 68, s: 30, c: 'rgba(80,200,255,0.16)',  d: 21, dl: 2.2 },
  { ch: 'fetch',     l: 44, t: 86, s: 30, c: 'rgba(80,200,255,0.14)',  d: 25, dl: 1.1 },
  { ch: 'POST',      l: 66, t: 26, s: 26, c: 'rgba(120,235,175,0.14)', d: 17, dl: 0.4 },
  { ch: '<Link>',    l: 26, t: 34, s: 26, c: 'rgba(80,200,255,0.13)',  d: 20, dl: 1.9 },
  { ch: 'useEffect', l: 55, t: 5,  s: 26, c: 'rgba(203,173,255,0.12)', d: 22, dl: 0.6 },
  { ch: '.jsx',      l: 91, t: 42, s: 26, c: 'rgba(120,235,175,0.13)', d: 24, dl: 1.3 },
  { ch: 'agent',     l: 2,  t: 45, s: 24, c: 'rgba(255,110,70,0.14)',  d: 26, dl: 2.6 },
  { ch: 'prompt',    l: 38, t: 58, s: 26, c: 'rgba(255,110,70,0.15)',  d: 18, dl: 1.2 },
  { ch: 'kun×narx',  l: 70, t: 50, s: 24, c: 'rgba(255,110,70,0.13)',  d: 23, dl: 0.3 },
];

const QUIZ_BANK = [
  { q: { uz: "Yaxshi prompt 3 narsani aniq aytadi — qaysi?", ru: 'Хороший промпт точно называет 3 вещи — какие?' }, opts: [{ uz: "Nima + Qanday + Qayerda", ru: 'Что + Как + Где' }, { uz: "Faqat rang va shrift", ru: 'Только цвет и шрифт' }, { uz: "Uzunligi va tili", ru: 'Длину и язык' }, { uz: "Fayl nomi va hajmi", ru: 'Имя файла и размер' }], correct: 0 },
  { q: { uz: "Agentni boshqarish tartibi qanday?", ru: 'Каков порядок управления агентом?' }, opts: [{ uz: "Darrov kod yozdirish", ru: 'Сразу заставить писать код' }, { uz: "Faqat rasm ko'rsatish", ru: 'Только показать картинку' }, { uz: "Uzoq kutib turish", ru: 'Долго ждать' }, { uz: "buyur → reja → tasdiq → tekshir → sina", ru: 'поручи → план → одобри → проверь → испытай' }], correct: 3 },
  { q: { uz: "Agentning 1-urinishi to'liq bo'lmasa, nima qilasiz?", ru: 'Первая попытка агента неполная — что Вы сделаете?' }, opts: [{ uz: "Loyihani tashlab ketaman", ru: 'Брошу проект' }, { uz: "Aniqlashtiruvchi follow-up beraman", ru: 'Дам уточняющий follow-up' }, { uz: "Hammasini qo'lda yozaman", ru: 'Напишу всё вручную' }, { uz: "Shundayligicha qabul qilaman", ru: 'Приму как есть' }], correct: 1 },
  { q: { uz: "Katalog (mashinalar ro'yxati) qaysi kuch bilan chiqadi?", ru: 'Какой силой выводится каталог (список машин)?' }, opts: ["Router", "State", { uz: "API `GET` + `map`", ru: 'API `GET` + `map`' }, "CSS"], correct: 2 },
  { q: { uz: "Yangi mashinani serverga qanday qo'shamiz?", ru: 'Как добавить новую машину на сервер?' }, opts: ["`POST`", "`GET`", { uz: "O'chirib tashlab", ru: 'Удалив её' }, { uz: "faqat `map`", ru: 'только `map`' }], correct: 0 },
  { q: { uz: "Ijaraga olingan mashinalar ro'yxati qayerda saqlanadi?", ru: 'Где хранится список арендованных машин?' }, opts: [{ uz: "Rasm faylida", ru: 'В файле картинки' }, { uz: "Alohida hujjatda", ru: 'В отдельном документе' }, { uz: "Server papkasida", ru: 'В папке сервера' }, "State (`useState`)"], correct: 3 },
  { q: { uz: "Sahifadan sahifaga o'tish qaysi bilan?", ru: 'Чем делается переход между страницами?' }, opts: ["`useState`", "Router (`<Route>`)", "`fetch`", "`map`"], correct: 1 },
  { q: { uz: "Jami narx formulasi qanday?", ru: 'Какова формула итоговой цены?' }, opts: [{ uz: "kun + narx", ru: 'дни + цена' }, { uz: "narx − kun", ru: 'цена − дни' }, { uz: "kun × narx", ru: 'дни × цена' }, { uz: "faqat narx", ru: 'только цена' }], correct: 2 },
  { q: { uz: "Tesla $80/kun, 3 kun — jami qancha?", ru: 'Tesla $80/день, 3 дня — сколько всего?' }, opts: ["$240", "$80", "$83", "$3"], correct: 0 },
  { q: { uz: "Debugging nima?", ru: 'Что такое дебаггинг?' }, opts: [{ uz: "Saytni chiroyli bezash", ru: 'Красиво оформить сайт' }, { uz: "Serverni qayta o'chirib yoqish", ru: 'Перезагрузить сервер' }, { uz: "Yangi rang va shrift qo'shish", ru: 'Добавить новый цвет и шрифт' }, { uz: "Kodni o'qib xatoni topib tuzatish", ru: 'Найти и исправить ошибку, читая код' }], correct: 3 },
  { q: { uz: "Loyihada birinchi ish nima?", ru: 'Что в проекте делается первым?' }, opts: [{ uz: "Darrov kod yoza boshlash", ru: 'Сразу начать писать код' }, { uz: "Rejalashtirish: sahifa + ma'lumot + amal", ru: 'Планирование: страницы + данные + действия' }, { uz: "AI o'zi qilishini kutish", ru: 'Ждать, что ИИ сделает сам' }, { uz: "Sayt rangini tanlash", ru: 'Выбрать цвет сайта' }], correct: 1 },
  { q: { uz: "Loyihada kim boshliq?", ru: 'Кто в проекте руководитель?' }, opts: [{ uz: "Agent boshliq — men kutaman", ru: 'Агент — а я жду' }, { uz: "Ikkovimiz teng qaror qilamiz", ru: 'Решаем на равных' }, { uz: "Men boshliq — agent quradi", ru: 'Я руководитель — агент строит' }, { uz: "Hech kim boshqarmaydi", ru: 'Никто не управляет' }], correct: 2 },
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
    const TOK = ['useState', 'props', '.map()', '<Route>', 'fetch', 'POST', '<Link>', 'useEffect', 'agent', 'prompt', 'kun×narx'];
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
          <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>
        ))}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>

      {/* QUTQARUV: jonli dars tugadi — o'quvchi osilib qolmaydi, mashq rejimida davom etadi */}
      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме практики' })}</button>
        </div>
      )}

      {/* ===== LOBBY ===== */}
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
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: 'Siz hozir:', ru: 'Вы сейчас:' })} {myRank + 1}-{tr({ uz: "o'rin", ru: 'место' })}</span>}
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
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верных' })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'лучший стрик' })} 🔥x${soloScore.maxStreak}` : ''}</p>
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
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: <>Siz — <b>{myRank + 1}-o'rin</b> · {board[myRank].pts} ball</>, ru: <>Вы — <b>место {myRank + 1}</b> · {board[myRank].pts} баллов</> })}</p>}
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

const PRACTICE_BASE = 500;
// Mentor ko'rinishi sloti — "kim bajardi" jonli chiplar paneli. JONLI roli to'ldiradi.
const MentorPracticeStats = ({ live, screen }) => {
  const [data, setData] = useState({ players: null, rows: [] });
  const on = !!(live && live.mode === 'mentor' && live.pin);
  useEffect(() => {
    if (!on) return;
    let alive = true, t = null;
    const tick = async () => {
      try {
        // Praktika javoblari 500+ zonasida (test <100 · arena 100+ bilan to'qnashmaydi)
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (alive) setData({ players, rows });
      } catch {}
      if (alive) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { alive = false; clearTimeout(t); };
  }, [on, live && live.pin, screen]);
  if (!on) return null;
  const total = data.players === null ? 0 : data.players.length;
  const doneIds = new Set(data.rows.map(r => r.player_id));
  const doers = (data.players || []).filter(p => doneIds.has(p.id));
  const waiting = (data.players || []).filter(p => !doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{tr({ uz: '👀 Kim bajardi', ru: '👀 Кто выполнил' })} — <b>{doers.length}</b>{total ? ` / ${total}` : ''}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружается…' })}</p>
      ) : doers.length === 0 && waiting.length === 0 ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Jonli darsda bajargan o'quvchilar shu yerda chiqadi.", ru: 'На живом уроке здесь появятся выполнившие ученики.' })}</p>
      ) : (
        <div className="mstats-waitrow">
          {doers.slice(0, 12).map(p => <span key={p.id} className="mstats-wait-chip" style={{ color: T.success, background: T.successSoft }}>✓ {p.nickname}</span>)}
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
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
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: (title && title.uz) || title, solved: true, correct: true, picked: true }); // UZ-RU: payload'da doim UZ-etalon saqlanadi
    // JONLI: o'quvchi «Bajardim» → ishtirok-ball 500+ zonaga yoziladi (podium/arena'ga aralashmaydi)
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  // JONLI: mentor keyingi sahifaga o'tmaguncha NavNext qulf bo'ladi (optionalLive + LiveGateCtx gate). Hozircha done bo'lsa ochiq.
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Выполняйте шаги и отмечайте их. Когда закончите, нажмите <b style={{ color: T.ink }}>«Выполнил(а)»</b> — наставник следит за прогрессом.</> })}</Mentor>
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
              {done ? tr({ uz: '✓ Bajarildi — ustozni kuting', ru: '✓ Выполнено — ждите наставника' }) : tr({ uz: '✅ Bajardim', ru: '✅ Выполнил(а)' })}
            </button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: 'Отлично! Задание выполнено. Наставник проверит и переведёт вас к следующему шагу.' })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
}

const ScreenPractice1 = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "Loyiha + katalog (GET)", ru: 'Проект + каталог (GET)' }}
    task={{ uz: "VS Code'da yangi Vite loyihasi (avto-ijara) yarating va Antigravity'ga bosh sahifada mashinalar katalogini serverdan (GET) yuklab kartochka qilishni buyuring. Brauzerda localhost'da ko'ring.", ru: 'Создайте в VS Code новый Vite-проект (avto-ijara) и поручите Antigravity вывести на главной странице каталог машин с сервера (GET) в виде карточек. Посмотрите в браузере на localhost.' }}
    checklist={[
      { uz: "Terminalda: `npm create vite@latest avto-ijara` — React (JavaScript)", ru: 'В терминале: `npm create vite@latest avto-ijara` — React (JavaScript)' },
      { uz: "`cd avto-ijara`, `npm install`, `npm run dev`", ru: '`cd avto-ijara`, `npm install`, `npm run dev`' },
      { uz: "Antigravity prompt: bosh sahifada katalogni serverdan (GET) yuklab, har mashinani nom + kunlik narx bilan kartochka qil", ru: 'Промпт Antigravity: загрузи каталог с сервера (GET) на главной и сделай каждую машину карточкой с названием + ценой за день' },
      { uz: "Rejani tasdiqlang, kodni o'qing, localhost'da katalogni ko'ring", ru: 'Одобрите план, прочитайте код, посмотрите каталог на localhost' },
    ]} />
);
const ScreenPractice2 = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "Mashina sahifasi (Router)", ru: 'Страница машины (Router)' }}
    task={{ uz: "Antigravity'ga har mashina uchun alohida sahifa (Router) qo'shishni buyuring — kartochkani bosganda tafsilotlar ochilsin.", ru: 'Поручите Antigravity добавить каждой машине отдельную страницу (Router) — при клике по карточке пусть открываются детали.' }}
    checklist={[
      { uz: "Prompt: `/car/:id` uchun `<Route>` qo'sh — bitta mashina tafsiloti", ru: 'Промпт: добавь `<Route>` для `/car/:id` — детали одной машины' },
      { uz: "Har kartochkaga `<Link>` qo'shishni so'rang", ru: 'Попросите добавить каждой карточке `<Link>`' },
      { uz: "Rejani tasdiqlang, kelgan kodni o'qing", ru: 'Одобрите план, прочитайте присланный код' },
      { uz: "Kartochkani bosib sinang — tafsilot sahifasi ochilsinmi?", ru: 'Кликните по карточке и проверьте — открывается ли страница деталей?' },
    ]} />
);
const ScreenPractice3 = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "Ijara + jami (State)", ru: 'Аренда + итог (State)' }}
    task={{ uz: "Antigravity'ga «Ijaraga» tugmasi mashinani ro'yxatga qo'shishini (state) va jami = kun × narx hisoblanishini buyuring.", ru: 'Поручите Antigravity: кнопка «Арендовать» добавляет машину в список (state), а итог считается как дни × цена.' }}
    checklist={[
      { uz: "Prompt: «Ijaraga» tugmasi mashinani ro'yxatga qo'shsin (state)", ru: 'Промпт: кнопка «Арендовать» добавляет машину в список (state)' },
      { uz: "Kun sonini +/- qilish imkonini so'rang", ru: 'Попросите возможность менять число дней через +/-' },
      { uz: "jami = kun × narx qatorini qo'shishni so'rang", ru: 'Попросите добавить строку итог = дни × цена' },
      { uz: "To'liq bo'lmasa — aniqlashtiruvchi follow-up prompt bering", ru: 'Если неполно — дайте уточняющий follow-up промпт' },
    ]} />
);
const ScreenPractice4 = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "Debug + saytni topshirish", ru: 'Дебаг + сдача сайта' }}
    task={{ uz: "Jami narx qatorini tekshiring, `* b.days` yo'qligini toping va tuzating. So'ng katalog → sahifa → ijara oqimini sinab, saytni topshiring.", ru: 'Проверьте строку итоговой цены, найдите отсутствие `* b.days` и исправьте. Затем испытайте поток каталог → страница → аренда и сдайте сайт.' }}
    checklist={[
      { uz: "Jami qatorini o'qing: `* b.days` (kun) yo'qligini toping", ru: 'Прочитайте строку итога: найдите, что нет `* b.days` (дни)' },
      { uz: "Prompt bilan tuzating: jami = narx × kun bo'lsin", ru: 'Исправьте промптом: итог = цена × дни' },
      { uz: "Katalog → mashina sahifasi → ijara oqimini to'liq sinang", ru: 'Полностью испытайте поток каталог → страница машины → аренда' },
      { uz: "Sayt ishlayapti — «Bajardim» bilan loyihani topshiring", ru: 'Сайт работает — сдайте проект кнопкой «Выполнил(а)»' },
    ]} />
);

// 🏗️ «Loyiha topshirish akti» — qurilish holati tracker strip (barcha ekran ustida)
const TRACKER_STEPS = [
  { id: 'p1', ic: '🌐', label: { uz: 'Katalog (GET)', ru: 'Каталог (GET)' } },
  { id: 'p2', ic: '🧭', label: { uz: 'Mashina (Router)', ru: 'Машина (Router)' } },
  { id: 'p3', ic: '💾', label: { uz: 'Ijara + jami (State)', ru: 'Аренда + итог (State)' } },
  { id: 'p4', ic: '🐞', label: { uz: 'Debug', ru: 'Дебаг' } },
];
function DeliveryTracker({ answers }) {
  const idxOf = (id) => SCREEN_META.findIndex(m => m.id === id);
  const doneCount = TRACKER_STEPS.filter(st => answers[idxOf(st.id)] && answers[idxOf(st.id)].solved).length;
  const allDone = doneCount >= TRACKER_STEPS.length;
  return (
    <div className={`dtrack ${allDone ? 'shipped' : ''}`} aria-label={tr({ uz: 'AvtoIjara — qurilish holati', ru: 'AvtoIjara — статус стройки' })}>
      <span className="dtrack-lbl">🏗️ AvtoIjara</span>
      <div className="dtrack-steps">
        {TRACKER_STEPS.map(st => {
          const on = !!(answers[idxOf(st.id)] && answers[idxOf(st.id)].solved);
          return <span key={st.id} className={`dtrack-step ${on ? 'on' : ''}`}><span className="dtrack-mark">{on ? '✓' : '☐'}</span> {st.ic} {tr(st.label)}</span>;
        })}
      </div>
      {allDone && <span className="dtrack-ship">{tr({ uz: '🚀 Sayt topshirildi', ru: '🚀 Сайт сдан' })}</span>}
    </div>
  );
}

// ============================================================ LESSON ROOT
export default function ReactProjectDayLesson({ lang: langProp, onFinished }) {
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
  // ETALON — 1920px avto-zoom (--lz): keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // 🃏 Flashcard ekrani jonli darsda (mentor boshqaruvida) o'quvchida o'tkazib yuboriladi
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
  // Javob kaliti: inline testlar + praktika + jang savollari — mentor ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, practice: -1, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, ScreenPractice1, Screen6, ScreenPractice2, Screen7, Screen8, ScreenPractice3, Screen9, Screen10, Screen11, Screen12, ScreenPractice4, Screen13, Screen14, ScreenPodium, ScreenFlashcards, Screen15];
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

        .vcard { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 12px 15px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover { transform: translateY(-1px); }
        /* tap-hint — bosilmagan kartochka "meni bos" deb chaqiradi (bosilgach ✓ + puls to'xtaydi) */
        .vcard.tap-hint { animation: tap-hint 2s ease-in-out infinite; }
        @keyframes tap-hint { 0%,100% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); } 50% { box-shadow: 0 6px 18px -6px rgba(255,79,40,0.28), inset 0 0 0 1.5px ${T.accent}33; } }
        .vcard.tap-hint:hover { animation: none; }
        @media (prefers-reduced-motion: reduce) { .vcard.tap-hint { animation: none !important; } }
        .vlbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .vseen { margin-left: auto; font-weight: 700; }

        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); background: ${T.accentSoft}; }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: contain; transform: scale(1.12); }
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

        .h-title { font-size: clamp(22px,4vw,38px); }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
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

        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; white-space: pre-wrap; } .ai-line:hover { background: rgba(255,255,255,0.06); }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .prompt-box { font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.5; color: ${T.ink}; background: ${T.bg}; border-radius: 10px; padding: 11px 13px; }
        .prompt-q { color: ${T.accent}; font-weight: 800; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

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

        /* === PRAKTIKA · AVTOIJARA CSS === */
        .bp-bar { background: #f0eee8; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-title { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; }
        .bp-body { padding: clamp(12px,2.2vw,18px); }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .rocard { border-radius: 12px; background: #fff; box-shadow: 0 4px 14px -4px rgba(0,0,0,0.16); overflow: hidden; border: 1px solid rgba(0,0,0,0.05); transition: transform 0.15s, box-shadow 0.15s; }
        .rocard.tappable { cursor: pointer; }
        .rocard.tappable:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -5px rgba(0,0,0,0.22); }
        .rothumb { height: 54px; display: flex; align-items: center; justify-content: center; position: relative; }
        .robody { padding: 7px 9px 9px; }
        .roname { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; color: ${T.ink}; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rostats { display: flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-size: 10.5px; color: ${T.ink3}; font-weight: 600; }
        .cardx { position: absolute; top: 4px; right: 5px; width: 20px; height: 20px; border-radius: 50%; border: none; background: rgba(14,14,16,0.5); color: #fff; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; transition: background 0.15s; z-index: 2; }
        .cardx:hover { background: ${T.danger}; }
        .cardacts { display: flex; gap: 5px; margin-top: 6px; }
        .cardbtn { flex: 1; border: none; background: ${T.bg}; border-radius: 7px; padding: 5px 4px; font-family: 'Manrope', sans-serif; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; cursor: pointer; transition: all 0.15s; }
        .cardbtn:hover { background: #EFEBE3; color: ${T.ink}; transform: translateY(-1px); }
        .daybtn { width: 22px; height: 22px; border-radius: 6px; border: none; background: ${T.bg}; color: ${T.ink}; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.15s; flex-shrink: 0; } .daybtn:hover { background: ${T.accent}; color: #fff; }
        .navmenu { display: flex; gap: 6px; flex-wrap: wrap; }
        .navlink { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; padding: 5px 11px; border-radius: 99px; border: none; background: ${T.bg}; color: ${T.ink}; cursor: pointer; transition: all 0.15s; }
        .navlink.on { background: ${T.ink}; color: #fff; }
        .navlink:hover:not(.on) { background: #EFEBE3; }
        .routerow { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 11px; transition: all 0.3s; }
        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: shake 0.4s ease; }
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

        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }
      

        /* ===================== v18 QATLAMLAR CSS ===================== */
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


        /* option-wait (jonli test kutish holati) — natija mentordan kutilmoqda, neytral nafas pulsatsiyasi */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; animation: opt-wait-breathe 1.9s ease-in-out infinite; }
        @keyframes opt-wait-breathe { 0%,100% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3); } 50% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 10px 26px -6px rgba(1,154,203,0.5); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }
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

        /* === 🏗️ LOYIHA TOPSHIRISH TRACKER (skelet — rang/harakat Dizayn/Animatsiya) === */
        .dtrack { position: fixed; top: 8px; left: 10px; z-index: 9997; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; max-width: min(60vw, 620px); background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 99px; padding: 5px 12px; box-shadow: 0 6px 18px -8px rgba(${T.shadowBase},0.28); font-family: 'Manrope', sans-serif; }
        .dtrack-lbl { font-weight: 800; font-size: 12px; color: ${T.accent}; white-space: nowrap; }
        .dtrack-steps { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .dtrack-step { font-weight: 600; font-size: 11px; color: ${T.ink3}; white-space: nowrap; border-radius: 99px; padding: 2px 8px; transition: color 0.35s ease, background 0.35s ease; }
        .dtrack-step.on { color: #0B6B43; font-weight: 700; background: rgba(18,169,104,0.13); animation: dt-fill 0.5s ease both; }
        @keyframes dt-fill { 0% { background: rgba(18,169,104,0); } 45% { background: rgba(18,169,104,0.28); } 100% { background: rgba(18,169,104,0.13); } }
        .dtrack-mark { display: inline-block; }
        .dtrack-step.on .dtrack-mark { color: #12A968; animation: dt-mark-pop 0.42s cubic-bezier(.3,1.5,.5,1) both; }
        @keyframes dt-mark-pop { 0% { transform: scale(0.4); } 45% { transform: scale(1.45); } 100% { transform: scale(1); } }
        .dtrack-ship { font-weight: 800; font-size: 11.5px; color: #fff; background: #12A968; border-radius: 99px; padding: 3px 10px; white-space: nowrap; box-shadow: 0 4px 14px -4px rgba(18,169,104,0.55); animation: dt-ship-pop 0.55s cubic-bezier(.25,1.5,.45,1) both; }
        @keyframes dt-ship-pop { 0% { opacity: 0; transform: translateX(-8px) scale(0.5); } 55% { opacity: 1; transform: translateX(0) scale(1.14); } 100% { transform: translateX(0) scale(1); } }
        .dtrack.shipped { border-color: #12A96866; box-shadow: 0 6px 18px -8px rgba(18,169,104,0.4); }
        @media (prefers-reduced-motion: reduce) { .dtrack-step.on, .dtrack-step.on .dtrack-mark, .dtrack-ship { animation: none !important; } }
        .ab-building { animation: ab-building-pulse 1.1s ease-in-out infinite; }
        @keyframes ab-building-pulse { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .ab-building { animation: none !important; } }
        @media (max-width: 760px) { .dtrack { max-width: 92vw; top: 6px; padding: 4px 10px; } .dtrack-lbl { font-size: 11px; } }

      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Loyiha kuni · AvtoIjara', ru: 'Проектный день · AvtoIjara' }} />
          ) : (
            <>
              <DeliveryTracker answers={answers} />
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
