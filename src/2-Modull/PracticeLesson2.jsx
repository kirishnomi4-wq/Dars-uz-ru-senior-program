import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

// Mentor avatar — hostlangan rasm (11.1 standart, 2026-07-09). Lokal import EMAS.
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PRAKTIKA 2-DARS — AI BILAN TEZ SIFATLI SAYT (promo landing) — PLATFORM STANDARD v16
// Mavzu: vibecoding; yaxshi PROMPT (4 ingredient: mavzu, uslub, rang, qismlar);
//        yomon vs yaxshi prompt; iteratsiya (qayta so'rash); natijani tekshirish.
// Loyiha: bloklardan prompt yig'ib, promo landing sahifa qurish (jonli preview).
// Asosiy xabar: "AI tezlik beradi — SIFATni siz ta'minlaysiz."
// Tool: Antigravity (haqiqiy uyga vazifa muhiti).
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
    } catch { setJoinError(tr({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: 'Неверный код ментора или ошибка подключения.' })); }
    finally { setBusy(false); }
  }, [lessonId]);

  const joinStudent = useCallback(async (raw, rawNick) => {
    const p = (raw || '').replace(/\D/g, '');
    const nick = (rawNick || '').trim();
    if (p.length < 4) { setJoinError(tr({ uz: "Kodni to'liq kiriting.", ru: 'Введите код полностью.' })); return; }
    if (nick.length < 2) { setJoinError(tr({ uz: 'Ismingizni kiriting (kamida 2 harf).', ru: 'Введите имя (минимум 2 буквы).' })); return; }
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
      <div style={{ textAlign: 'center' }}><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '0 0 4px' }}>🧑‍🏫 {tr({ uz: 'Mentor kirishi', ru: 'Вход для ментора' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor kodini kiriting.', ru: 'Введите код ментора.' })}</p></div>
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
    <button onClick={() => live.joinStudent(code, nick)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: 'Ulanmoqda…', ru: 'Подключение…' }) : tr({ uz: "Qo'shilish →", ru: 'Присоединиться →' })}</button>
    {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
    <button onClick={() => { setRole('mentor'); setCode(''); }} title="Mentor" aria-label="Mentor" style={{ position: 'absolute', bottom: 10, right: 12, background: 'none', border: 'none', fontSize: 16, opacity: 0.3, cursor: 'pointer', lineHeight: 1, padding: 4 }}>🧑‍🏫</button>
  </div></div>);
}

function LiveBadge({ live, total }) {
  const [bigOpen, setBigOpen] = useState(false);
  const [nPlayers, setNPlayers] = useState(null);
  // Auto-open OLIB TASHLANDI (onboarding spotlight bilan to'qnashadi) — katta PIN faqat «📺 Ko'rsatish» tugmasi bilan ochiladi.
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
    if (live.ended) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> 🔓 {tr({ uz: "O'quvchilar erkin qilindi", ru: 'Ученики отпущены в свободный режим' })}</div>;
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
    if (live.status === 'ended') return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 🔓 {tr({ uz: "Erkin rejim — o'zingiz davom eting", ru: 'Свободный режим — продолжайте сами' })}</div>;
    if (!live.mentorAlive) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> ⚠️ {tr({ uz: 'Mentor uzildi — erkin rejim', ru: 'Ментор отключился — свободный режим' })}</div>;
    if (!live.connected) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot('#FFD380')} /> 🔄 {tr({ uz: 'Qayta ulanmoqda…', ru: 'Переподключение…' })}</div>;
    return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 👨‍🏫 {tr({ uz: 'Mentor:', ru: 'Ментор:' })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

const LangContext = createContext('uz');
const MentorCtx = createContext(null);
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — yuqori panel hisoblagichi uchun

// backtick chiplar: `siyohrang` matn ichida chip bo'lib chiqadi (test/arena savollarida)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split(/(`[^`]+`)/g).map((p, i) => (p.startsWith('`') && p.endsWith('`') ? <code key={i} className="qcode">{p.slice(1, -1)}</code> : p))
  : s;

// ===== AUDIO (AUDIOSIZ stub) — ovoz o'chirilgan, faqat segment-struktura saqlanadi =====
const useLang = () => useContext(LangContext);
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

const LESSON_META = { lessonId: 'practice-02-ai-promo-v18', lessonTitle: { uz: 'Praktika 2 — AI bilan tez sayt', ru: 'Практика 2 — Быстрый сайт через AI' } };
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
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's15b', type: 'stats',      template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcard',template: 'custom',   scored: false, scope: null },
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

const Split = ({ children }) => <div className="split">{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, mentorCollapsible }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  // mentorCollapsible: desktopda ham mentor yig'ilsin (pastki qism bosilganda/skroll qilinganda)
  const collapseOn = (isNarrow || mentorCollapsible) && !mentorStatic;
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

// ===== KO'P TANLOVLI TEST =====

// ===== 📖 QAYTA TUSHUNTIRISH (recap) — jonli darsda mentor past natijada ochadi =====
const RECAP_NEED_PCT = 60;   // shundan past — qayta tushuntirish TAVSIYA etiladi
const RECAP_GOOD_PCT = 75;   // shundan yuqori — sinf o'zlashtirdi, bemalol davom
const RECAP_MIN_ANSWERS = 3; // foizga ishonch uchun kamida shuncha javob kerak
// ============================================================
// 📖 QAYTA TUSHUNTIRISH (recap) — test natijasi past chiqsa mentor proyektorda
// ochib, og'zaki qayta tushuntiradi (server sinxronsiz — o'quvchilar qulflangan,
// proyektorga qaraydi). Xato qilgan o'quvchi o'z qurilmasida ham ochishi mumkin.
// Kalitlar — scored test ekranlarining indekslari (4, 7, 9). s15 — amaliy final (recapsiz).
// Har karta: ic (katta emoji), h (sarlavha), body (1-2 gap), vis (ko'rgazma),
// ask (mentor sinfga og'zaki beradigan savol — jonli muloqot uchun).
// ============================================================
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
// RECAPS kontenti — Stage 4'da JS-intro testlariga to'ldiriladi (hozircha bo'sh)
const RECAPS = {
  4: {
    title: { uz: "Yaxshi prompt nimasi bilan farq qiladi?", ru: 'Чем отличается хороший промпт?' },
    cards: [
      { ic: "🎯", h: { uz: "Farqi — aniqlik", ru: 'Разница — в точности' }, body: { uz: <>Yaxshi prompt AI'ga <b>aniq</b> aytadi: qanaqa sahifa (mavzu), qanday ko'rinishda (uslub), qaysi rangda va qaysi qismlar bilan. Aniq buyruq — aniq natija.</>, ru: <>Хороший промпт говорит AI <b>точно</b>: какая страница (тема), как она выглядит (стиль), какого цвета и с какими частями. Точная команда — точный результат.</> }, vis: <RcFlow items={[{ uz: 'Mavzu', ru: 'Тема' }, { uz: 'Uslub', ru: 'Стиль' }, { uz: 'Rang', ru: 'Цвет' }, { uz: 'Qismlar', ru: 'Части' }]} />, ask: { uz: "«Menga sayt yasab ber» desak — AI qaysi rangni, qaysi mavzuni tanlaydi?", ru: 'Если сказать «сделай мне сайт» — какой цвет и какую тему выберет AI?' } },
      { ic: "📏", h: { uz: "Uzunlik emas, aniqlik", ru: 'Не длина, а точность' }, body: { uz: <>Yaxshi prompt shunchaki <b>uzun</b> bo'lgani uchun ishlamaydi. Qisqa, lekin <b>4 ingredientli</b> aniq buyruq ham ajoyib natija beradi. Muhimi — tafsilot.</>, ru: <>Хороший промпт работает не потому, что он <b>длинный</b>. Короткая, но точная команда из <b>4 ингредиентов</b> тоже даёт отличный результат. Главное — детали.</> } },
      { ic: "🌐", h: { uz: "Til muhim emas", ru: 'Язык не важен' }, body: { uz: <>Inglizcha yozish shart emas — <b>o'zbekcha</b> aniq prompt ham zo'r sahifa yasaydi. Gap tilida emas, aniqlikda: nima, uslub, rang, qismlar.</>, ru: <>Писать по-английски не обязательно — точный промпт <b>на родном языке</b> тоже делает классную страницу. Дело не в языке, а в точности: что, стиль, цвет, части.</> } },
    ]
  },
  7: {
    title: { uz: "Qaysi buyruq eng yaxshi?", ru: 'Какая команда лучшая?' },
    cards: [
      { ic: "🏆", h: { uz: "Eng aniq buyruq g'olib", ru: 'Побеждает самая точная команда' }, body: { uz: <>«Biror narsa qil», «Chiroyli qilib ber», «Sayt» — hammasi <b>noaniq</b>. Eng yaxshisi rang, uslub va qismlarni aytadi: <b>ko'k, zamonaviy, sarlavha, tugma, 3 karta</b>.</>, ru: <>«Сделай что-нибудь», «Сделай красиво», «Сайт» — всё это <b>размыто</b>. Лучшая команда называет цвет, стиль и части: <b>синий, современный, заголовок, кнопка, 3 карточки</b>.</> }, vis: <RcFlow items={[{ uz: 'Rang', ru: 'Цвет' }, { uz: 'Uslub', ru: 'Стиль' }, { uz: 'Sarlavha', ru: 'Заголовок' }, { uz: '3 karta', ru: '3 карточки' }]} />, ask: { uz: "«Chiroyli qilib ber» — chiroylini har kim boshqacha tasavvur qiladi. AI nimani chizadi?", ru: '«Сделай красиво» — красиво каждый представляет по-своему. Что нарисует AI?' } },
      { ic: "🍕", h: { uz: "Prompt = pitsa buyurtmasi", ru: 'Промпт = заказ пиццы' }, body: { uz: <>«Ovqat olib kel» desangiz — nima kelishi noma'lum. «<b>Katta pepperoni pitsa, ko'p pishloq bilan</b>» desangiz — aynan xohlaganingizni olasiz. Prompt ham xuddi shunday ishlaydi.</>, ru: <>Скажете «принеси поесть» — неизвестно, что принесут. Скажете «<b>большую пепперони с двойным сыром</b>» — получите именно то, что хотели. Промпт работает так же.</> } },
      { ic: "🧩", h: { uz: "Qismlarni sanab ber", ru: 'Перечислите части' }, body: { uz: <>Yaxshi buyruqda sahifaning <b>qismlari</b> aytiladi: sarlavha, tugma, 3 ta karta. AI shu qismlarni topib, joyiga terib beradi.</>, ru: <>В хорошей команде названы <b>части</b> страницы: заголовок, кнопка, 3 карточки. AI соберёт эти части и расставит по местам.</> }, vis: <RcFlow items={[{ uz: 'Sarlavha', ru: 'Заголовок' }, { uz: 'Tugma', ru: 'Кнопка' }, { uz: '3 karta', ru: '3 карточки' }]} /> },
    ]
  },
  9: {
    title: { uz: "AI birinchi urinishda mos qilmasa?", ru: 'AI не попал с первого раза?' },
    cards: [
      { ic: "🔁", h: { uz: "Iteratsiya — qayta so'rash", ru: 'Итерация — попросить ещё раз' }, body: { uz: <>Birinchi natija to'liq mos kelmasa, <b>tashlab ketmaysiz</b> — qayta, aniqroq so'raysiz: «tugmani kattaroq qil», «rangni ko'kroq qil». Har so'rovda natija yaxshilanadi.</>, ru: <>Если первый результат не совсем то — вы <b>не бросаете</b>, а просите снова, точнее: «сделай кнопку больше», «сделай цвет синее». С каждым запросом результат лучше.</> }, vis: <RcFlow items={[{ uz: '1-natija', ru: '1-й результат' }, { uz: "Aniqroq so'rov", ru: 'Точнее запрос' }, { uz: 'Yaxshiroq natija', ru: 'Лучше результат' }]} />, ask: { uz: "AI sarlavhani juda kichkina qilib qo'ydi. Endi unga nima deb aytasiz?", ru: 'AI сделал заголовок слишком маленьким. Что вы ему теперь скажете?' } },
      { ic: "🎨", h: { uz: "Rassomga aytgandek", ru: 'Как художнику' }, body: { uz: <>Rassomga «bu yerini kattaroq chiz» desangiz — u qayta chizadi. AI bilan ham shunday: har <b>izohingiz</b> bilan sahifa asta-sekin mukammallashadi.</>, ru: <>Скажете художнику «нарисуй вот это крупнее» — он перерисует. С AI так же: с каждым вашим <b>уточнением</b> страница становится всё лучше.</> } },
      { ic: "💪", h: { uz: "Sifatni SIZ ta'minlaysiz", ru: 'Качество обеспечиваете ВЫ' }, body: { uz: <>AI <b>tezlik</b> beradi, lekin <b>sifatni siz</b> nazorat qilasiz. Xafa bo'lib tashlab ketish yoki hammasini qo'lda yozish emas — aniq izoh berib, AI'ni to'g'rilaysiz.</>, ru: <>AI даёт <b>скорость</b>, но <b>качество контролируете вы</b>. Не обижаться и не переписывать всё руками — а дать точное уточнение и направить AI.</> }, vis: <RcFlow items={[{ uz: 'AI = tezlik', ru: 'AI = скорость' }, { uz: 'Siz = sifat', ru: 'Вы = качество' }]} /> },
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
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущая' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}-${tr({ uz: 'karta', ru: 'карточка' })}`} />)}</div>
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
        <span className="mstats-lbl">📊 {tr({ uz: 'Jonli natija', ru: 'Живой результат' })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>🔓 {tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>}
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
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и счёт ✅/❌ скрыты — при нажатии «Открыть результат» всё откроется сразу и у вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — класс не понял эту тему. Перед тем как продолжить, стоит коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. Если хотите, коротко повторите перед тем, как идти дальше.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по проценту судить сложно. Оцените сами:</> })}</p>
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуется объяснить ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь вживую…' })}</p>}
    </div>
  );
}

// ===== ✍️ MENTOR PRAKTIKA OVERLAY (jonli) — praktika-ekranda mentor kim tugatganini ko'radi =====
// Signal zonasi: PRACTICE_DONE_BASE(500)+fromScreen — test(<100)/arena(100+) bilan to'qnashmaydi.
const PRACTICE_DONE_BASE = 500;
function MentorPracticeOverlay({ entry, live, onClose }) {
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
  const total = data.players ? data.players.length : 0;
  const doneN = data.rows.length;
  const allIn = total > 0 && doneN >= total;
  const doneIds = new Set(data.rows.map(r => r.player_id));
  return (
    <div className="mp-overlay">
      <div className="mp-card">
        <div className="mp-eyebrow">✍️ {tr({ uz: 'Amaliyot · jonli', ru: 'Практика · вживую' })}</div>
        <h2 className="mp-title">{tr(entry.title)}</h2>
        <p className="mp-brief">{tr(entry.brief)}</p>
        <div className="mp-flow">
          <span className="mp-step cur">{tr({ uz: "1 · O'quvchilar o'z qurilmasida prompt yig'ib, sahifa qurmoqda", ru: '1 · Ученики собирают промпт и строят страницу на своих устройствах' })}</span>
          <span className="mp-arr">→</span>
          <span className="mp-step">{tr({ uz: "2 · Mentor doskada namuna qurib ko'rsatadi", ru: '2 · Ментор строит образец на доске' })}</span>
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
            {total === 0 && <p className="mstats-wait">{tr({ uz: "Hali o'quvchi qo'shilmagan — ular praktikani boshlashi bilan bu yerda ✓ chiqadi…", ru: 'Пока никто не подключился — как только ученики начнут практику, здесь появятся ✓…' })}</p>}
          </div>
        )}
        <div className="mp-actions">
          <button className="mp-next" onClick={onClose} style={{ marginLeft: 'auto' }}>{tr({ uz: 'Keyingi mavzuga →', ru: 'К следующей теме →' })}</button>
        </div>
        <p className="mp-tip">{tr({ uz: "💡 Ko'pchilik tugatgach, aynan shu mashqni doskada birga qurib ko'rsating — shunda o'quvchilar o'zini tekshiradi va mavzu mustahkamlanadi.", ru: '💡 Когда большинство закончит, соберите это же упражнение вместе на доске — так ученики проверят себя, и тема закрепится.' })}</p>
      </div>
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
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval natijani oching', ru: 'Сначала откройте результат' }) : solved ? { uz: 'Davom etish', ru: 'Продолжить' } : (oneShot ? { uz: 'Javob tanlang', ru: 'Выберите ответ' } : { uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, думайте перед нажатием!' })}</p>}
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
                <span style={{ flex: 1 }}>{fmtCode(opt)}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? fmtCode(`✓ ${tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`)
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? fmtCode(`${tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`)
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {fmtCode(isMentorLive
              ? explainCorrect
              : waiting
                ? tr({ uz: "Javobingiz qabul qilindi. Mentor «Natijani ochish»ni bosganda to'g'ri javob hammada birdan ko'rinadi.", ru: 'Ваш ответ принят. Когда ментор нажмёт «Открыть результат», правильный ответ появится у всех сразу.' })
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish ▾", ru: 'открыть подсказку ▾' })}</span>}</span>
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
  const NODES = [{ n: '1', l: 'Hodisa' }, { n: '2', l: 'Reaksiya' }, { n: '3', l: "O'zgarish" }];
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
const SiteCard = ({ name = 'Akmal', role = 'Veb-dasturchi · 14 yosh', children }) => (
  <div className="site-card">
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className="site-ava">{(name && name.trim()[0]) || 'A'}</div>
      <div>
        <div className="site-name">{name}</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>{role}</div>
      </div>
    </div>
    {children}
  </div>
);

// ===== PROMO MA'LUMOTLARI =====
const PROMO = {
  oyin:   { tag: { uz: "O'yin", ru: 'Игра' }, title: 'PIXEL QUEST', sub: { uz: "Yangi sarguzasht o'yini — hoziroq sinab ko'ring", ru: 'Новая приключенческая игра — попробуйте прямо сейчас' }, cta: { uz: "O'ynash", ru: 'Играть' }, cards: [{ uz: '3D olam', ru: '3D-мир' }, { uz: 'Reytinglar', ru: 'Рейтинги' }, { uz: '100 daraja', ru: '100 уровней' }] },
  klub:   { tag: { uz: 'Klub', ru: 'Клуб' }, title: { uz: 'SHAXMAT KLUBI', ru: 'ШАХМАТНЫЙ КЛУБ' }, sub: { uz: "Har shanba — bepul mashg'ulot va turnirlar", ru: 'Каждую субботу — бесплатные занятия и турниры' }, cta: { uz: "Ro'yxatdan o'tish", ru: 'Записаться' }, cards: [{ uz: 'Murabbiy', ru: 'Тренер' }, { uz: 'Turnirlar', ru: 'Турниры' }, { uz: "Yangi do'stlar", ru: 'Новые друзья' }] },
  tadbir: { tag: { uz: 'Tadbir', ru: 'Событие' }, title: { uz: 'TEXNO FEST', ru: 'ТЕХНО ФЕСТ' }, sub: { uz: 'Yilning eng katta IT festivali', ru: 'Самый большой IT-фестиваль года' }, cta: { uz: 'Bilet olish', ru: 'Купить билет' }, cards: [{ uz: 'Spikerlar', ru: 'Спикеры' }, { uz: 'Master-klass', ru: 'Мастер-класс' }, { uz: "Sovg'alar", ru: 'Подарки' }] },
  ilova:  { tag: { uz: 'Ilova', ru: 'Приложение' }, title: 'FOCUSLY', sub: { uz: 'Vaqtingizni aqlli boshqaring', ru: 'Управляйте временем с умом' }, cta: { uz: 'Yuklab olish', ru: 'Скачать' }, cards: [{ uz: 'Taymer', ru: 'Таймер' }, { uz: 'Statistika', ru: 'Статистика' }, { uz: 'Eslatma', ru: 'Напоминания' }] }
};
const STYLE_LABEL = { zamonaviy: { uz: 'zamonaviy', ru: 'современный' }, oynoqi: { uz: "o'ynoqi", ru: 'игривый' }, minimal: { uz: 'minimal', ru: 'минималистичный' } };
const COLOR_HEX = { kok: '#2563EB', yashil: '#1F9D55', sariq: '#F59E0B', siyohrang: '#7C3AED' };
const COLOR_LABEL = { kok: { uz: "ko'k", ru: 'синий' }, yashil: { uz: 'yashil', ru: 'зелёный' }, sariq: { uz: "to'q sariq", ru: 'оранжевый' }, siyohrang: { uz: 'siyohrang', ru: 'фиолетовый' } };
const TOPICS = [['oyin', { uz: "O'yin", ru: 'Игра' }], ['klub', { uz: 'Klub', ru: 'Клуб' }], ['tadbir', { uz: 'Tadbir', ru: 'Событие' }], ['ilova', { uz: 'Ilova', ru: 'Приложение' }]];
const STYLES = [['zamonaviy', { uz: 'Zamonaviy', ru: 'Современный' }], ['oynoqi', { uz: "O'ynoqi", ru: 'Игривый' }], ['minimal', { uz: 'Minimal', ru: 'Минимал' }]];
const COLORS_LIST = [['kok', { uz: "Ko'k", ru: 'Синий' }], ['yashil', { uz: 'Yashil', ru: 'Зелёный' }], ['sariq', { uz: "To'q sariq", ru: 'Оранжевый' }], ['siyohrang', { uz: 'Siyohrang', ru: 'Фиолетовый' }]];
const SECTIONS = [['button', { uz: 'Tugma', ru: 'Кнопка' }], ['cards', { uz: 'Kartalar', ru: 'Карточки' }], ['banner', { uz: 'Banner', ru: 'Баннер' }]];

// Real loyihaga yaqin nomlar — prompt "o'yinchoq" emas, AI'ga aytsa ishlaydigan darajada
const TOPIC_PROMPT = { oyin: { uz: "«Pixel Quest» video-o'yini", ru: 'видеоигры «Pixel Quest»' }, klub: { uz: 'shaxmat klubi', ru: 'шахматного клуба' }, tadbir: { uz: '«Texno Fest» festivali', ru: 'фестиваля «Техно Фест»' }, ilova: { uz: '«Focusly» ilovasi', ru: 'приложения «Focusly»' } };
const SECTION_PROMPT = { button: { uz: 'harakat tugmasi', ru: 'кнопка действия' }, cards: { uz: '3 ta xususiyat kartasi', ru: '3 карточки преимуществ' }, banner: { uz: 'maxsus taklif banneri', ru: 'баннер спецпредложения' } };
const sectionPromptWords = (s = {}) => Object.keys(SECTION_PROMPT).filter(k => s[k]).map(k => tr(SECTION_PROMPT[k]));

// key={val} — qiymat o'zgarganda slot qayta yuklanib "pop" animatsiyasi beradi (qaysi bo'lim o'zgarganini ko'rsatadi)
const Slot = ({ val, ph }) => val ? <span className="pb-slot" key={val}>{val}</span> : <span className="pb-ph">{ph}</span>;

// Real, ishlaydigan darajadagi prompt — tabiiy gap, tafsilotli; slotlar tanlovga qarab to'ladi
const PromptLine = ({ topic, style, color, sections }) => {
  const secs = sectionPromptWords(sections);
  return (
    <div className="promptbox">
      {tr({
        uz: <>Menga <Slot val={topic ? tr(TOPIC_PROMPT[topic]) : null} ph="mavzu" /> uchun bir sahifali promo-landing yasab ber.{' '}
          Uslubi <Slot val={style ? tr(STYLE_LABEL[style]) : null} ph="uslub" />, asosiy rang <Slot val={color ? tr(COLOR_LABEL[color]) : null} ph="rang" />.{' '}
          Yuqorida katta sarlavha va qisqa tavsif, hamda <Slot val={secs.length ? secs.join(', ') : null} ph="qismlar" /> bo'lsin.{' '}
          Mobil va kompyuterda chiroyli ko'rinsin.</>,
        ru: <>Сделай мне одностраничный промо-лендинг для <Slot val={topic ? tr(TOPIC_PROMPT[topic]) : null} ph="тема" />.{' '}
          Стиль — <Slot val={style ? tr(STYLE_LABEL[style]) : null} ph="стиль" />, основной цвет — <Slot val={color ? tr(COLOR_LABEL[color]) : null} ph="цвет" />.{' '}
          Сверху большой заголовок и короткое описание, а также <Slot val={secs.length ? secs.join(', ') : null} ph="части" />.{' '}
          Пусть красиво смотрится и на телефоне, и на компьютере.</>
      })}
    </div>
  );
};

// ============================================================
// USTABOT — so'zma-so'z bajaruvchi robot-usta. Bola = boshliq.
// Loyqa buyruq → bo'shliqlarni kulgili literal to'ldiradi + pufakchada sabab aytadi.
// Personaj bir xil: 🤖 robot-usta. UstaBubble hamma joyda bir uslub.
// ============================================================
const USTABOT_FACE = '🤖';
const UstaBubble = ({ children, tone = 'note', small = false }) => (
  <div className={`usta-bubble usta-${tone}${small ? ' usta-sm' : ''}`}>
    <span className="usta-face" aria-hidden>{USTABOT_FACE}</span>
    <span className="usta-say">{children}</span>
  </div>
);

// QABUL AKTI — mijoz nomidan tekshiruv varag'i: har band ✓/✗, burchakda mijoz-emoji (😕→🤩).
// Xato topilsa «Dubl 2 — …» qayta-buyruq tugmasi Ustabotni tuzatishga yuboradi.
const AcceptanceReport = ({ checks, onRedo, redoLabel, done }) => {
  const allOk = checks.every(c => c.ok);
  const face = done && allOk ? '🤩' : allOk ? '🙂' : '😕';
  return (
    <div className={`accept-akt${done && allOk ? ' akt-happy' : ''} fade-step`}>
      <div className="akt-head">
        <span className="akt-title">📋 {tr({ uz: 'Qabul akti', ru: 'Акт приёмки' })}</span>
        <span className="akt-client" title={tr({ uz: 'Mijoz kayfiyati', ru: 'Настроение клиента' })}>{face}</span>
      </div>
      <ul className="akt-list">
        {checks.map((c, i) => <li key={i} className={c.ok ? 'akt-ok' : 'akt-bad'}><span className="akt-mark">{c.ok ? '✓' : '✗'}</span>{tr(c.label)}</li>)}
      </ul>
      {!allOk && onRedo && <button className="btn akt-redo" onClick={onRedo}>↻ {tr({ uz: 'Dubl 2', ru: 'Дубль 2' })} — {tr(redoLabel)}</button>}
    </div>
  );
};

// Jonli promo-sahifa preview
const LandingPreview = ({ topic, style: styleIn, color: colorIn, sections = {}, noaniq = false, draft = false }) => {
  // DRAFT rejim: tanlanmagan ingredientni Ustabot so'zma-so'z (kulgili) to'ldiradi.
  // FAQAT ko'rinish — tanlov/gating'ga ta'sir qilmaydi. Chip tanlanganda o'sha qism darhol silliqqa almashadi.
  if (draft) {
    const hasTopic = !!topic, hasStyle = !!styleIn, hasColor = !!colorIn;
    const anySec = !!(sections.button || sections.cards || sections.banner);
    const p = hasTopic ? PROMO[topic] : null;
    const c = hasColor ? (COLOR_HEX[colorIn] || T.accent) : null;
    const minimal = styleIn === 'minimal';
    const radius = styleIn === 'oynoqi' ? 18 : minimal ? 6 : 12;
    const heroBg = hasColor ? (minimal ? '#FFFFFF' : `linear-gradient(135deg, ${c}, ${c}cc)`)
      : 'repeating-linear-gradient(45deg, #ff1493 0 14px, #c6ff00 14px 28px)'; // rang yo'q → neon to'qnashuv
    const heroColor = hasColor ? (minimal ? T.ink : '#fff') : '#12121a';
    const heroBorder = hasStyle ? (minimal && hasColor ? `2px solid ${c}` : 'none') : '2.5px dashed #12121a';
    const heroTilt = hasStyle ? 'none' : 'rotate(-2.2deg)'; // uslub yo'q → qiyshiq/aralash
    const notes = [];
    if (!hasTopic) notes.push(tr({ uz: "Mavzu aytmadingiz — bo'shini qo'ydim", ru: 'Вы не назвали тему — оставил пустым' }));
    if (!hasStyle) notes.push(tr({ uz: 'Uslub aytmadingiz — aralash qildim', ru: 'Вы не назвали стиль — сделал вперемешку' }));
    if (!hasColor) notes.push(tr({ uz: "Rangni o'zim tanladim!", ru: 'Цвет выбрал сам!' }));
    if (!anySec) notes.push(tr({ uz: "Qism aytmadingiz — bo'sh romka qo'ydim", ru: 'Вы не назвали части — поставил пустую рамку' }));
    return (
      <div className="lp-draft lp-live" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: heroBg, color: heroColor, borderRadius: hasStyle ? radius : 5, padding: 'clamp(16px,3vw,22px)', border: heroBorder, textAlign: 'center', transform: heroTilt, position: 'relative' }}>
          {!hasColor && <span className="lp-draft-badge">{tr({ uz: "Rangni o'zim tanladim! 🎨", ru: 'Цвет выбрал сам! 🎨' })}</span>}
          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.9 }}>{hasTopic ? tr(p.tag) : tr({ uz: 'Sayt', ru: 'Сайт' })}</span>
          <h3 style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 700, fontSize: 'clamp(20px,4vw,30px)', margin: '5px 0 6px', lineHeight: 1.08, transform: hasStyle ? 'none' : 'rotate(1.4deg)' }}>{hasTopic ? tr(p.title) : tr({ uz: 'SAYT', ru: 'САЙТ' })}</h3>
          <p style={{ fontSize: 13, margin: 0, opacity: 0.92, fontStyle: hasTopic ? 'normal' : 'italic' }}>{hasTopic ? tr(p.sub) : tr({ uz: "Bla-bla lorem — bu yerda matn bo'lishi kerak edi…", ru: 'Бла-бла лорем — тут должен был быть текст…' })}</p>
          {sections.button && <button style={{ marginTop: 13, border: 'none', borderRadius: Math.max((hasStyle ? radius : 5) - 4, 6), padding: '9px 18px', fontFamily: "'Manrope'", fontWeight: 700, fontSize: 13, cursor: 'pointer', background: hasColor ? '#fff' : '#12121a', color: hasColor ? c : '#c6ff00', transform: hasStyle ? 'none' : 'rotate(-1.6deg)' }}>{hasTopic ? tr(p.cta) : tr({ uz: 'Tugma', ru: 'Кнопка' })}</button>}
        </div>
        {sections.cards && p && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {p.cards.map((cd, i) => (
              <div key={i} style={{ background: T.paper, borderRadius: 8, padding: '11px 6px', textAlign: 'center', boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.16)`, transform: hasStyle ? 'none' : `rotate(${i % 2 ? 2.2 : -2.2}deg)` }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c || '#ff1493', margin: '0 auto 6px' }} />
                <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink }}>{tr(cd)}</div>
              </div>
            ))}
          </div>
        )}
        {sections.banner && <div style={{ background: hasColor ? `${c}1f` : 'rgba(255,20,147,0.14)', color: hasColor ? c : '#ff1493', borderRadius: 8, padding: '9px 12px', fontSize: 12.5, fontWeight: 700, textAlign: 'center', transform: hasStyle ? 'none' : 'rotate(-1deg)' }}>{tr({ uz: '★ Maxsus taklif — faqat shu hafta!', ru: '★ Спецпредложение — только на этой неделе!' })}</div>}
        {!anySec && <div className="lp-draft-empty"><span className="lp-draft-q">?</span><span className="lp-draft-emptxt">{tr({ uz: "Qism yo'q — bo'sh romka qoldi", ru: 'Частей нет — осталась пустая рамка' })}</span></div>}
        {notes.length > 0 && <div className="lp-draft-notes">{notes.map((n, i) => <UstaBubble key={i} small>{n}</UstaBubble>)}</div>}
      </div>
    );
  }
  const style = styleIn || 'zamonaviy';
  const color = colorIn || 'kok';
  if (noaniq || !topic) {
    return (
      <div style={{ textAlign: 'center', padding: '26px 16px' }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#E6E1D8', margin: '0 auto 10px' }} />
        <p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 17, margin: '0 0 4px', color: T.ink2 }}>{tr({ uz: 'Sayt', ru: 'Сайт' })}</p>
        <p style={{ fontSize: 12.5, margin: 0, color: T.ink3, fontStyle: 'italic' }}>{tr({ uz: "Bu yerda biror narsa bo'lishi kerak edi…", ru: 'Здесь должно было что-то быть…' })}</p>
      </div>
    );
  }
  const p = PROMO[topic];
  const c = COLOR_HEX[color] || T.accent;
  const radius = style === 'oynoqi' ? 18 : style === 'minimal' ? 6 : 12;
  const minimal = style === 'minimal';
  return (
    <div className="lp-live" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: minimal ? '#FFFFFF' : `linear-gradient(135deg, ${c}, ${c}cc)`, color: minimal ? T.ink : '#fff', borderRadius: radius, padding: 'clamp(16px,3vw,22px)', border: minimal ? `2px solid ${c}` : 'none', textAlign: minimal ? 'left' : 'center' }}>
        <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: minimal ? c : 'rgba(255,255,255,0.9)' }}>{tr(p.tag)}</span>
        <h3 style={{ fontFamily: "'Source Serif 4',serif", fontWeight: style === 'oynoqi' ? 700 : 600, fontSize: 'clamp(20px,4vw,30px)', margin: '5px 0 6px', lineHeight: 1.08 }}>{tr(p.title)}</h3>
        <p style={{ fontSize: 13, margin: 0, opacity: minimal ? 0.75 : 0.95 }}>{tr(p.sub)}</p>
        {sections.button && <button style={{ marginTop: 13, border: 'none', borderRadius: Math.max(radius - 4, 6), padding: '9px 18px', fontFamily: "'Manrope'", fontWeight: 700, fontSize: 13, cursor: 'pointer', background: minimal ? c : '#fff', color: minimal ? '#fff' : c }}>{tr(p.cta)}</button>}
      </div>
      {sections.cards && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {p.cards.map((cd, i) => (
            <div key={i} style={{ background: T.paper, borderRadius: Math.max(radius - 4, 6), padding: '11px 6px', textAlign: 'center', boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.16)` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, margin: '0 auto 6px' }} />
              <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink }}>{tr(cd)}</div>
            </div>
          ))}
        </div>
      )}
      {sections.banner && <div style={{ background: `${c}1f`, color: c, borderRadius: Math.max(radius - 4, 6), padding: '9px 12px', fontSize: 12.5, fontWeight: 700, textAlign: 'center' }}>{tr({ uz: '★ Maxsus taklif — faqat shu hafta!', ru: '★ Спецпредложение — только на этой неделе!' })}</div>}
    </div>
  );
};

// Mobil: berilgan element paydo bo'lganda/o'zgarganda unga avtoskroll (faqat <768px)
function useScrollIntoViewOnMobile(trigger) {
  const ref = useRef(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!trigger) return;
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 160);
    return () => clearTimeout(t);
  }, [trigger]);
  return ref;
}

// Barcha ekranlarda (mobil + desktop) avtoskroll — masalan "deploy" natijasi har doim ko'rinishi uchun
function useScrollIntoView(trigger) {
  const ref = useRef(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!trigger) return;
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 180);
    return () => clearTimeout(t);
  }, [trigger]);
  return ref;
}

// "Agent quryapti…" — jonli shimmer skeleton (oddiy matndan ko'ra tushunarliroq)
const BuildingPreview = () => (
  <div className="build-skel">
    <div className="bs-bar bs-lg" />
    <div className="bs-bar" style={{ width: '72%' }} />
    <div className="bs-bar" style={{ width: '92%' }} />
    <div className="bs-bar" style={{ width: '60%' }} />
    <p className="build-note">{tr({ uz: 'Agent quryapti…', ru: 'Агент строит…' })}</p>
  </div>
);

// Prompt-quruvchi (4 blok) — mobilda rang/qismlar tanlanganda natijaga avtoskroll;
// desktopda esa rang (3-blok) tanlanganda ham natijaga avtoskroll
const PromoBuilder = ({ topic, setTopic, style, setStyle, color, setColor, sec, setSec }) => {
  const tog = (k) => setSec(s => ({ ...s, [k]: !s[k] }));
  const previewRef = useRef(null);
  const scrollToPreview = () => { const el = previewRef.current; if (!el) return; const t = setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 160); return () => clearTimeout(t); };
  // mobil (<768px): rang yoki qismlar o'zgarganda
  const firstM = useRef(true);
  useEffect(() => {
    if (firstM.current) { firstM.current = false; return; }
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;
    return scrollToPreview();
    // eslint-disable-next-line
  }, [`${color}|${sec.button ? 1 : 0}${sec.cards ? 1 : 0}${sec.banner ? 1 : 0}`]);
  // desktop (>=768px): rang tanlanganda
  const firstD = useRef(true);
  useEffect(() => {
    if (firstD.current) { firstD.current = false; return; }
    if (!color) return;
    if (typeof window === 'undefined' || window.innerWidth < 768) return;
    return scrollToPreview();
    // eslint-disable-next-line
  }, [color]);
  return (
    <Zoomable>
    <div className="split">
      <Col>
        {/* PROMPT — yuqorida: tugmalarni bosgan sari shu yerda yig'iladi */}
        <p className="flow-label">{tr({ uz: "Sizning buyrug'ingiz — pastdagi tugmalar bilan yig'iladi", ru: 'Ваша команда — собирается кнопками ниже' })}</p>
        <PromptLine topic={topic} style={style} color={color} sections={sec} />
        <p className="builder-cue">{tr({ uz: "Pastdagi 4 guruhdan tanlang ↓ — har bosishda buyruq va o'ngdagi sayt darhol o'zgaradi", ru: 'Выбирайте из 4 групп ниже ↓ — с каждым нажатием команда и сайт справа сразу меняются' })}</p>
        <p className="flow-label">{tr({ uz: '1. Mavzu (nima)', ru: '1. Тема (что)' })}</p>
        <div className="chiprow">{TOPICS.map(([v, l]) => <button key={v} className={`chip ${topic === v ? 'chip-on' : ''}`} onClick={() => setTopic(v)}>{tr(l)}</button>)}</div>
        <p className="flow-label">{tr({ uz: "2. Uslub (qanday ko'rinishda)", ru: '2. Стиль (как выглядит)' })}</p>
        <div className="chiprow">{STYLES.map(([v, l]) => <button key={v} className={`chip ${style === v ? 'chip-on' : ''}`} onClick={() => setStyle(v)}>{tr(l)}</button>)}</div>
        <p className="flow-label">{tr({ uz: '3. Rang', ru: '3. Цвет' })}</p>
        <div className="chiprow">{COLORS_LIST.map(([v, l]) => <button key={v} className={`chip ${color === v ? 'chip-on' : ''}`} onClick={() => setColor(v)}><span style={{ width: 11, height: 11, borderRadius: '50%', background: COLOR_HEX[v], display: 'inline-block' }} />{tr(l)}</button>)}</div>
        <p className="flow-label">{tr({ uz: '4. Qismlar (tafsilot)', ru: '4. Части (детали)' })}</p>
        <div className="chiprow">{SECTIONS.map(([k, l]) => <button key={k} className={`chip ${sec[k] ? 'chip-on' : ''}`} onClick={() => tog(k)}>{sec[k] ? '✓ ' : '+ '}{tr(l)}</button>)}</div>
      </Col>
      <Col>
        <p className="flow-label">{tr({ uz: 'Natija — jonli yangilanadi', ru: 'Результат — обновляется вживую' })}</p>
        <div ref={previewRef}><Browser url="mening-promo.uz"><LandingPreview draft topic={topic} style={style} color={color} sections={sec} /></Browser></div>
      </Col>
    </div>
    </Zoomable>
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
        <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Свернуть' }) : tr({ uz: 'Kattalashtirish', ru: 'Развернуть' })} title={big ? tr({ uz: 'Kichraytirish', ru: 'Свернуть' }) : tr({ uz: 'Kattalashtirish', ru: 'Развернуть' })}>{big ? '✕' : '⛶'}</button>
        {children}
      </div>
    </>
  );
};

// ===== SCREEN 0 — HOOK (noaniq prompt -> bo'sh natija) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  useAudio([{ id: 's0', text: "AI'ga shunchaki «sayt yasab ber» desangiz — nima chiqadi? Noaniq buyruqni yuboring va o'ngdagi natijaga qarang: kutganingizday chiqmaydi, chunki AI miyangizni o'qiy olmaydi.", trigger: 'on_mount', waits_for: null }]);
  const [phase, setPhase] = useState(storedAnswer ? 'built' : 'idle');
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const OPTS = [
    { id: 'a', label: tr({ uz: "AI nima xohlayotganimni bilmadi — juda kam tushuntirdim", ru: 'AI не понял, чего я хочу — я слишком мало объяснил' }) },
    { id: 'b', label: tr({ uz: "AI buzilgan, shuning uchun bo'sh chiqdi", ru: 'AI сломался, поэтому вышло пусто' }) },
    { id: 'c', label: tr({ uz: "Internet sekin bo'lgani uchun", ru: 'Из-за медленного интернета' }) }
  ];
  const send = () => { clearTimeout(timer.current); setPhase('building'); timer.current = setTimeout(() => setPhase('built'), 1100); };
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  const built = phase === 'built';
  return (
    <Stage eyebrow={{ uz: 'Kirish', ru: 'Введение' }} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 820 }}>{tr({ uz: <>AI'ga shunchaki <span className="italic" style={{ color: T.accent }}>«sayt yasab ber»</span> desangiz — nima chiqadi?</>, ru: <>Что получится, если сказать AI просто <span className="italic" style={{ color: T.accent }}>«сделай сайт»</span>?</> })}</h1>
        <Mentor>{tr({ uz: "1-darsda har bir narsani qo'lda qurdik. AI esa saytni soniyalarda yasaydi! Quyidagi qisqa, noaniq buyruqni agentga yuboring va o'ngdagi natijaga diqqat bilan qarang — kutganingizday chiqadimi?", ru: 'На 1-м уроке мы всё строили руками. А AI делает сайт за секунды! Отправьте агенту короткую размытую команду ниже и внимательно посмотрите на результат справа — вышло ли так, как вы ждали?' })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Sizning buyrug'ingiz", ru: 'Ваша команда' })}</p>
            <div className="promptbox">{tr({ uz: <>Menga <span className="pb-slot">sayt</span> yasab ber.</>, ru: <>Сделай мне <span className="pb-slot">сайт</span>.</> })}</div>
            <button className="btn" onClick={send} disabled={phase === 'building'} style={{ alignSelf: 'flex-start' }}>{phase === 'building' ? tr({ uz: 'Quryapti…', ru: 'Строит…' }) : (built ? tr({ uz: '↻ Qayta yuborish', ru: '↻ Отправить заново' }) : tr({ uz: 'Agentga yuborish', ru: 'Отправить агенту' }))}</button>
            {built && <p className="hook-ack fade-step" style={{ marginTop: 4 }}>{tr({ uz: "Kutganday chiqmadimi? O'ngda — buning sababini toping.", ru: 'Не то, что ждали? Справа — найдите причину.' })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija', ru: 'Результат' })}</p>
            <Browser url="ai-natija.uz">
              {phase === 'idle' && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: '(hali yuborilmadi)', ru: '(ещё не отправлено)' })}</p>}
              {phase === 'building' && <BuildingPreview />}
              {built && <div className="result-reveal"><LandingPreview draft /></div>}
            </Browser>
            {built && <UstaBubble tone="warn">So'zma-so'z bajardim — lekin kam aytdingiz!</UstaBubble>}
            {built && (
              <div className="fade-step">
                <p className="eyebrow" style={{ color: T.ink2, margin: '0 0 9px' }}>{tr({ uz: "Nega natija bunchalik bo'sh?", ru: 'Почему результат такой пустой?' })}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {OPTS.map(o => { const on = picked === o.id; return (
                    <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                      <span className="radio">{on && <span className="radio-dot" />}</span><span>{o.label}</span>
                    </button>); })}
                </div>
                {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>To'g'ri! AI o'ta tez, lekin u sizning miyangizni o'qiy olmaydi. <b>Aniq aytsangiz — aniq natija.</b> Bugun yaxshi "prompt" yozishni o'rganamiz.</>, ru: <>Верно! AI очень быстрый, но читать ваши мысли он не умеет. <b>Скажете точно — получите точный результат.</b> Сегодня учимся писать хороший «промпт».</> })}</p>}
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
  useAudio([{ id: 's1', text: "Bugun AI bilan tez va sifatli sayt qurishni o'rganamiz: yaxshi prompt, iteratsiya va natijani tekshirish. Rejamiz bilan tanishing.", trigger: 'on_mount', waits_for: null }]);
  const STEPS = [
    { text: tr({ uz: 'AI bilan tezlik — soatlar emas, soniyalar', ru: 'Скорость с AI — секунды, а не часы' }), tag: 'wow' },
    { text: tr({ uz: 'Yaxshi PROMPT — 4 ingredient', ru: 'Хороший ПРОМПТ — 4 ингредиента' }), tag: tr({ uz: 'mavzu·uslub·rang·qism', ru: 'тема·стиль·цвет·части' }) },
    { text: tr({ uz: 'Yomon vs yaxshi prompt', ru: 'Плохой vs хороший промпт' }), tag: '' },
    { text: tr({ uz: "Iteratsiya — qayta so'rab yaxshilash", ru: 'Итерация — улучшать повторным запросом' }), tag: '' },
    { text: tr({ uz: 'Tekshirish — AI xatosini topish', ru: 'Проверка — найти ошибку AI' }), tag: '' },
    { text: tr({ uz: "O'z promo sahifangizni qurish", ru: 'Построить свою промо-страницу' }), tag: '' }
  ];
  const ING = [['1', tr({ uz: 'MAVZU', ru: 'ТЕМА' }), tr({ uz: 'Qanaqa sahifa', ru: 'Какая страница' })], ['2', tr({ uz: 'USLUB', ru: 'СТИЛЬ' }), tr({ uz: "Qanday ko'rinishda", ru: 'Как выглядит' })], ['3', tr({ uz: 'RANG', ru: 'ЦВЕТ' }), tr({ uz: 'Asosiy rang', ru: 'Основной цвет' })], ['4', tr({ uz: 'QISMLAR', ru: 'ЧАСТИ' }), tr({ uz: "Nimalar bo'lsin", ru: 'Что внутри' })]];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <div className="speed-quote">
        <p className="sq-eyebrow">{tr({ uz: 'Bugungi asosiy qoida', ru: 'Главное правило сегодня' })}</p>
        <p className="sq-text">{tr({ uz: <>AI <span className="sq-fast">tezlik</span> beradi — <span className="sq-quality">sifatni</span> siz ta'minlaysiz.</>, ru: <>AI даёт <span className="sq-fast">скорость</span> — <span className="sq-quality">качество</span> обеспечиваете вы.</> })}</p>
      </div>
      <p className="flow-label">{tr({ uz: 'Yaxshi promptning 4 ingredienti', ru: '4 ингредиента хорошего промпта' })}</p>
      <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
        {ING.map(([n, name, d]) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.paper, borderRadius: 11, padding: '11px 13px', boxShadow: `0 5px 14px -6px rgba(${T.shadowBase},0.14)` }}>
            <span className="num-badge" style={{ width: 26, height: 26, fontSize: 12 }}>{n}</span>
            <div><div style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: 13 }}>{name}</div><div style={{ fontSize: 11, color: T.ink2 }}>{d}</div></div>
          </div>
        ))}
      </div>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 6 qadam', ru: 'Сегодня 6 шагов' })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{s.text}</span>{s.tag && <span className="step-tag">{s.tag}</span>}</span></li>))}
      </ol>
    </Col>
  );
  return (
    <Stage eyebrow={{ uz: 'Reja', ru: 'План' }} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI hammasini yasaydi — unda nega <span className="italic" style={{ color: T.accent }}>biz</span> kerakmiz?</>, ru: <>AI делает всё сам — зачем тогда <span className="italic" style={{ color: T.accent }}>мы</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI — juda kuchli ishchi: soniyada butun sahifa yasaydi. Ammo u sizning <b style={{ color: T.ink }}>so'zlaringizga</b> qarab ishlaydi. Shuning uchun bugun eng muhim mahorat — <b style={{ color: T.ink }}>yaxshi prompt (buyruq)</b> yozishni o'rganamiz, 6 qadamda.</>, ru: <>AI — очень мощный работник: за секунду делает целую страницу. Но работает он по вашим <b style={{ color: T.ink }}>словам</b>. Поэтому сегодня главный навык — учимся писать <b style={{ color: T.ink }}>хороший промпт (команду)</b>, за 6 шагов.</> })}</Mentor>
        {!isNarrow ? (
          <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable>
        ) : !showSteps ? (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{PreviewBlock}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "6 qadamni ko'rish", ru: 'Посмотреть 6 шагов' })}</button></div>
        ) : (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Qoidani ko'rish", ru: '↩ Посмотреть правило' })}</button>{StepsBlock}</div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — WOW (yaxshi prompt -> soniyada sayt) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: 's2', text: "Endi aniq buyruq beramiz — to'rt ingredient bilan. Yuboring va kuzating: AI butun bir sahifani bir necha soniyada yasaydi.", trigger: 'on_mount', waits_for: null }]);
  const [phase, setPhase] = useState(storedAnswer ? 'built' : 'idle');
  const timer = useRef(null);
  const built = phase === 'built';
  const done = built;
  useEffect(() => () => clearTimeout(timer.current), []);
  const send = () => { clearTimeout(timer.current); setPhase('building'); timer.current = setTimeout(() => setPhase('built'), 1300); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Tezlik', ru: 'Скорость' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval yuboring', ru: 'Сначала отправьте' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Aniq buyruq bersak, AI <span className="italic" style={{ color: T.accent }}>qanchalik tez</span> quradi?</>, ru: <>Если дать точную команду — <span className="italic" style={{ color: T.accent }}>насколько быстро</span> построит AI?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Endi <b style={{ color: T.ink }}>aniq</b> buyruq beramiz — 4 ingredient bilan. Yuboring va kuzating: 1-darsda 5 ta narsani soatlab qurgan edik. AI esa butun bir sahifani <b style={{ color: T.ink }}>bir necha soniyada</b> yasaydi.</>, ru: <>Теперь дадим <b style={{ color: T.ink }}>точную</b> команду — с 4 ингредиентами. Отправьте и наблюдайте: на 1-м уроке мы часами строили 5 элементов. А AI делает целую страницу <b style={{ color: T.ink }}>за несколько секунд</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Tayyor yaxshi buyruq', ru: 'Готовая хорошая команда' })}</p>
            <PromptLine topic="tadbir" style="oynoqi" color="siyohrang" sections={{ button: true, cards: true, banner: true }} />
            <button className="btn" onClick={send} disabled={phase === 'building'} style={{ alignSelf: 'flex-start' }}>{phase === 'building' ? tr({ uz: 'Quryapti…', ru: 'Строит…' }) : (built ? tr({ uz: '↻ Qayta yuborish', ru: '↻ Отправить заново' }) : tr({ uz: 'Agentga yuborish', ru: 'Отправить агенту' }))}</button>
            {built && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mana — tugallangan, rangli, chiroyli sahifa. Va bu atigi bir buyruq! AI bergan <b>tezlik</b> shu.</>, ru: <>Вот — законченная, цветная, красивая страница. И это всего одна команда! Вот она — <b>скорость</b>, которую даёт AI.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija', ru: 'Результат' })}</p>
            <Browser url="texno-fest.uz">
              {phase === 'idle' && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: '(buyruqni yuboring)', ru: '(отправьте команду)' })}</p>}
              {phase === 'building' && <BuildingPreview />}
              {built && <div className="result-reveal"><LandingPreview topic="tadbir" style="oynoqi" color="siyohrang" sections={{ button: true, cards: true, banner: true }} /></div>}
            </Browser>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — PROMPT ANATOMIYASI =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: 's3', text: "Yaxshi buyruq to'rt ingredientdan iborat: mavzu, uslub, rang va qismlar. Buyruqdagi rangli qismlarni bosib, har birini bilib oling.", trigger: 'on_mount', waits_for: null }]);
  const [part, setPart] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const done = seen.size >= 2;
  const PARTS = {
    mavzu: { color: T.blue, hex: '#5BC8EC', name: tr({ uz: 'MAVZU', ru: 'ТЕМА' }), word: tr({ uz: "«Pixel Quest» o'yini", ru: 'игра «Pixel Quest»' }), desc: tr({ uz: "Qanaqa sahifa va nima haqida. Masalan: o'yin promo, klub, tadbir yoki ilova. Mahsulot nomini ham aytsangiz — yanada aniq.", ru: 'Какая страница и о чём. Например: промо игры, клуб, событие или приложение. Назовёте имя продукта — будет ещё точнее.' }) },
    uslub: { color: T.accent, hex: '#FF9777', name: tr({ uz: 'USLUB', ru: 'СТИЛЬ' }), word: tr({ uz: "o'ynoqi", ru: 'игривый' }), desc: tr({ uz: "Sahifa qanday ko'rinishda bo'lsin: zamonaviy, o'ynoqi yoki minimal.", ru: 'Как должна выглядеть страница: современная, игривая или минималистичная.' }) },
    rang: { color: T.success, hex: '#6FD79E', name: tr({ uz: 'RANG', ru: 'ЦВЕТ' }), word: tr({ uz: "ko'k", ru: 'синий' }), desc: tr({ uz: "Asosiy rang: ko'k, yashil, to'q sariq yoki siyohrang.", ru: 'Основной цвет: синий, зелёный, оранжевый или фиолетовый.' }) },
    qism: { color: '#A78BFA', hex: '#C4B5FD', name: tr({ uz: 'QISMLAR', ru: 'ЧАСТИ' }), word: tr({ uz: 'tugma va kartalar', ru: 'кнопка и карточки' }), desc: tr({ uz: "Sahifada nimalar bo'lsin: harakat tugmasi, xususiyat kartalari yoki banner.", ru: 'Что должно быть на странице: кнопка действия, карточки преимуществ или баннер.' }) }
  };
  const tap = (k) => { setPart(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const Span = ({ k }) => <span onClick={() => tap(k)} style={{ cursor: 'pointer', color: PARTS[k].hex, fontWeight: 700, background: part === k ? PARTS[k].color + '22' : 'transparent', borderRadius: 5, padding: '1px 5px', outline: part === k ? `2px solid ${PARTS[k].color}` : 'none' }}>{PARTS[k].word}</span>;
  return (
    <Stage eyebrow={{ uz: 'Buyruqning 4 ingredienti', ru: '4 ингредиента команды' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Kamida 2 qismni bosing', ru: 'Нажмите минимум 2 части' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yaxshi buyruq <span className="italic" style={{ color: T.accent }}>nimalardan</span> tashkil topadi?</>, ru: <>Из чего <span className="italic" style={{ color: T.accent }}>состоит</span> хорошая команда?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yaxshi prompt — tasodifiy gap emas, u <b style={{ color: T.ink }}>4 ingredientdan</b> iborat. Pastdagi buyruqdagi rangli qismlarni <b style={{ color: T.ink }}>bosib</b>, har birini bilib oling.</>, ru: <>Хороший промпт — не случайная фраза, он состоит из <b style={{ color: T.ink }}>4 ингредиентов</b>. <b style={{ color: T.ink }}>Нажимайте</b> на цветные части команды ниже и узнайте каждый.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="codebox" style={{ background: T.paper, color: T.ink, fontFamily: "'Manrope'", fontSize: 'clamp(14px,1.9vw,16px)', lineHeight: 2.1, boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.16)` }}>
              {tr({ uz: <>Menga <Span k="mavzu" /> uchun bir sahifali promo-landing yasab ber — <Span k="uslub" /> uslubda, <Span k="rang" /> rangli, <Span k="qism" /> bilan.</>, ru: <>Сделай мне одностраничный промо-лендинг — тема: <Span k="mavzu" />, стиль: <Span k="uslub" />, цвет: <Span k="rang" />, части: <Span k="qism" />.</> })}
            </div>
            {part ? (
              <div className="sk-info fade-step" key={part}>
                <span className="sk-tagbig"><span className="lg-dot" style={{ background: PARTS[part].color, width: 14, height: 14 }} /><span className="sk-wordbadge" style={{ color: PARTS[part].color, background: PARTS[part].color + '22' }}>{PARTS[part].name}</span></span>
                <p className="body" style={{ color: T.ink, margin: '10px 0 0' }}>{PARTS[part].desc}</p>
              </div>
            ) : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Buyruqdagi 4 ta rangli qismni bosing', ru: 'Нажмите на 4 цветные части команды' })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Shu buyruqning natijasi', ru: 'Результат этой команды' })}</p>
            <Browser url="pixel-quest.uz"><LandingPreview topic="oyin" style="oynoqi" color="kok" sections={{ button: true, cards: true, banner: false }} /></Browser>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>4 ingredient = aniq buyruq = aniq natija. Buni eslab qoling: <b>MAVZU · USLUB · RANG · QISMLAR</b>.</>, ru: <>4 ингредиента = точная команда = точный результат. Запомните: <b>ТЕМА · СТИЛЬ · ЦВЕТ · ЧАСТИ</b>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={{ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' }}
    audioText="Yaxshi prompt yomonidan nimasi bilan farq qiladi? To'g'ri javobni tanlang."
    questionText="Yaxshi prompt yomonidan nimasi bilan farq qiladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Yaxshi prompt yomonidan nimasi bilan <span className="italic" style={{ color: T.accent }}>farq qiladi?</span></>, ru: <>Чем хороший промпт <span className="italic" style={{ color: T.accent }}>отличается</span> от плохого?</> })}</h2></>}
    options={[tr({ uz: 'Aniq tafsilot beradi: nima, uslub, rang, qismlar', ru: 'Даёт точные детали: что, стиль, цвет, части' }), tr({ uz: "Shunchaki uzunroq bo'ladi", ru: 'Просто длиннее' }), tr({ uz: 'Faqat inglizcha yoziladi', ru: 'Пишется только по-английски' }), tr({ uz: "Hech qanday farqi yo'q", ru: 'Никакой разницы' })]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! Yaxshi prompt AI'ga aniq aytadi: qanaqa sahifa (mavzu), qanday ko'rinishda (uslub), qaysi rangda va qaysi qismlar bilan. Aniqlik — sifatli natijaning kaliti.", ru: 'Верно! Хороший промпт говорит AI точно: какая страница (тема), как выглядит (стиль), какого цвета и с какими частями. Точность — ключ к качественному результату.' })}
    explainWrong={{
      1: tr({ uz: "Yo'q — gap uzunlikda emas, aniqlikda. Qisqa, lekin 4 ingredientli prompt ham zo'r ishlaydi.", ru: 'Нет — дело не в длине, а в точности. Короткий промпт с 4 ингредиентами тоже отлично работает.' }),
      2: tr({ uz: "Yo'q — til muhim emas. O'zbekcha aniq prompt ham ajoyib natija beradi.", ru: 'Нет — язык не важен. Точный промпт на родном языке тоже даёт отличный результат.' }),
      3: tr({ uz: "Yo'q — farq katta: aniq prompt aniq natija beradi, loyqa prompt bo'sh natija.", ru: 'Нет — разница огромная: точный промпт даёт точный результат, размытый — пустой.' }),
      default: tr({ uz: 'Yaxshi prompt = aniq tafsilot (mavzu, uslub, rang, qismlar).', ru: 'Хороший промпт = точные детали (тема, стиль, цвет, части).' })
    }} />
);

// ===== SCREEN 5 — PROMPT-QURUVCHI =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: 's5', text: "Pastdagi to'rt blokdan tanlang — buyruq jumlasi siz tanlagani sari yig'iladi, o'ngdagi sayt esa darhol o'zgaradi. Har tanlovingiz natijaga qanday ta'sir qilishini ko'ring.", trigger: 'on_mount', waits_for: null }]);
  const [topic, setTopic] = useState(storedAnswer ? 'oyin' : null);
  const [style, setStyle] = useState(storedAnswer ? 'zamonaviy' : null);
  const [color, setColor] = useState(storedAnswer ? 'kok' : null);
  const [sec, setSec] = useState(storedAnswer ? { button: true, cards: true, banner: false } : { button: false, cards: false, banner: false });
  const anySec = sec.button || sec.cards || sec.banner;
  const all4 = topic && style && color && anySec;
  const done = all4;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Prompt-quruvchi', ru: 'Конструктор промпта' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: '4 ingredientni tanlang', ru: 'Выберите 4 ингредиента' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har bir blok natijani <span className="italic" style={{ color: T.accent }}>qanday</span> o'zgartiradi?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>каждый</span> блок меняет результат?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Pastdagi 4 blokdan tanlang — buyruq jumlasi <b style={{ color: T.ink }}>siz tanlagani sari yig'iladi</b>, o'ngdagi sayt esa <b style={{ color: T.ink }}>darhol</b> o'zgaradi. Har bir tanlovingiz natijaga qanday ta'sir qilishini ko'ring.</>, ru: <>Выбирайте из 4 блоков ниже — команда <b style={{ color: T.ink }}>собирается по мере вашего выбора</b>, а сайт справа меняется <b style={{ color: T.ink }}>мгновенно</b>. Смотрите, как каждый ваш выбор влияет на результат.</> })}</Mentor>
        <PromoBuilder topic={topic} setTopic={setTopic} style={style} setStyle={setStyle} color={color} setColor={setColor} sec={sec} setSec={setSec} />
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Sezdingizmi? Har bir blok natijani o'zgartirdi. Siz AI'ni <b>so'z bilan boshqaryapsiz</b> — mana shu prompt mahorati.</>, ru: <>Заметили? Каждый блок менял результат. Вы управляете AI <b>словами</b> — это и есть мастерство промпта.</> })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — YOMON vs YAXSHI PROMPT =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: 's6', text: "Yomon promptni yaxshi prompt bilan solishtiramiz. Ikkalasini ham yuborib, natijadagi farqni o'z ko'zingiz bilan ko'ring.", trigger: 'on_mount', waits_for: null }]);
  const [mode, setMode] = useState('yomon'); // joriy buyruq: yomon | yaxshi
  const [sent, setSent] = useState(null);    // qurilgan buyruq: null | yomon | yaxshi
  const [phase, setPhase] = useState('idle'); // idle | building
  const [seenBuilt, setSeenBuilt] = useState(new Set());
  const timer = useRef(null);
  const done = seenBuilt.size >= 2;
  useEffect(() => () => clearTimeout(timer.current), []);
  const send = () => { clearTimeout(timer.current); setPhase('building'); timer.current = setTimeout(() => { setSent(mode); setSeenBuilt(prev => { const n = new Set(prev); n.add(mode); return n; }); setPhase('idle'); }, 1100); };
  const improve = () => { setMode('yaxshi'); };
  const stale = sent !== null && sent !== mode && phase === 'idle';
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Yomon ⚔️ Yaxshi', ru: 'Плохой ⚔️ Хороший' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Ikki buyruqni ham yuboring', ru: 'Отправьте обе команды' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Nega bir maqsad <span className="italic" style={{ color: T.accent }}>ikki xil</span> natija beradi?</>, ru: <>Почему одна цель даёт <span className="italic" style={{ color: T.accent }}>два разных</span> результата?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Avval <b style={{ color: T.ink }}>loyqa</b> buyruqni yuboramiz va natijani ko'ramiz. So'ng buyruqni <b style={{ color: T.ink }}>yaxshilab</b>, qayta yuboramiz. Ikkala natijani solishtiring — farqni o'z ko'zingiz bilan ko'rasiz.</>, ru: <>Сначала отправим <b style={{ color: T.ink }}>размытую</b> команду и посмотрим результат. Потом <b style={{ color: T.ink }}>улучшим</b> команду и отправим снова. Сравните оба результата — разницу увидите своими глазами.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{mode === 'yomon' ? tr({ uz: 'Buyruq (loyqa)', ru: 'Команда (размытая)' }) : tr({ uz: 'Buyruq (aniq, 4 ingredient)', ru: 'Команда (точная, 4 ингредиента)' })}</p>
            {mode === 'yaxshi'
              ? <PromptLine topic="klub" style="oynoqi" color="yashil" sections={{ button: true, cards: true, banner: true }} />
              : <div className="promptbox">{tr({ uz: <>Menga <span className="pb-slot">klub sayti</span> yasab ber.</>, ru: <>Сделай мне <span className="pb-slot">сайт клуба</span>.</> })}</div>}
            <button className="btn" onClick={send} disabled={phase === 'building'} style={{ alignSelf: 'flex-start' }}>{phase === 'building' ? tr({ uz: 'Quryapti…', ru: 'Строит…' }) : tr({ uz: 'Agentga yuborish', ru: 'Отправить агенту' })}</button>
            {sent === 'yomon' && mode === 'yomon' && phase === 'idle' && <button className="btn-soft" onClick={improve} style={{ alignSelf: 'flex-start' }}>{tr({ uz: 'Buyruqni yaxshilash →', ru: 'Улучшить команду →' })}</button>}
            {stale && <p className="hook-ack fade-step" style={{ margin: 0, color: T.accent }}>{tr({ uz: "Buyruq o'zgardi — endi qayta yuboring.", ru: 'Команда изменилась — отправьте заново.' })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija', ru: 'Результат' })}</p>
            <Browser url={sent === 'yaxshi' ? 'shaxmat-klubi.uz' : 'ai-natija.uz'}>
              {phase === 'building' && <BuildingPreview />}
              {phase === 'idle' && sent === null && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: '(buyruqni yuboring)', ru: '(отправьте команду)' })}</p>}
              {phase === 'idle' && sent === 'yomon' && <div className="result-reveal" key="yomon"><LandingPreview draft /></div>}
              {phase === 'idle' && sent === 'yaxshi' && <div className="result-reveal" key="yaxshi"><LandingPreview topic="klub" style="oynoqi" color="yashil" sections={{ button: true, cards: true, banner: true }} /></div>}
            </Browser>
            {phase === 'idle' && sent === 'yomon' && <UstaBubble tone="warn">Loyqa buyruq — bo'shliqlarni o'zim to'ldirdim!</UstaBubble>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bir xil maqsad, lekin tafsilot bilan natija osmon-u yer farq qiladi. <b>Tafsilot = sifat.</b></>, ru: <>Цель одна, но с деталями результат отличается как небо и земля. <b>Детали = качество.</b></> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — TEST 2 =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={{ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' }}
    audioText="Qaysi buyruq eng yaxshi? Eng aniqini tanlang."
    questionText="O'yin promo sahifa uchun qaysi buyruq eng yaxshi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>O'yin promo sahifa uchun qaysi buyruq <span className="italic" style={{ color: T.accent }}>eng yaxshi?</span></>, ru: <>Какая команда для промо-страницы игры <span className="italic" style={{ color: T.accent }}>самая лучшая?</span></> })}</h2></>}
    options={[tr({ uz: 'Menga biror narsa qilib ber', ru: 'Сделай мне что-нибудь' }), tr({ uz: "Ko'k rangli, zamonaviy o'yin promo sahifasi — sarlavha, tugma va 3 ta karta bilan", ru: 'Синяя современная промо-страница игры — с заголовком, кнопкой и 3 карточками' }), tr({ uz: 'Chiroyli va zamonaviy qilib ber', ru: 'Сделай красиво и современно' }), tr({ uz: "O'yin haqida sayt qil", ru: 'Сделай сайт про игру' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! Bu buyruqda 4 ingredient bor: mavzu (o'yin promo), uslub (zamonaviy), rang (ko'k) va qismlar (tugma, kartalar). AI aniq nima qilishni biladi.", ru: 'Верно! В этой команде есть 4 ингредиента: тема (промо игры), стиль (современный), цвет (синий) и части (кнопка, карточки). AI точно знает, что делать.' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — «biror narsa» juda loyqa. AI nima qilishni bilmaydi, natija tasodifiy bo'ladi.", ru: 'Нет — «что-нибудь» слишком размыто. AI не знает, что делать, результат будет случайным.' }),
      2: tr({ uz: "Yo'q — «chiroyli, zamonaviy» faqat uslub. Mavzu, rang va qismlar aytilmagan — yarmi yetishmaydi.", ru: 'Нет — «красиво, современно» это только стиль. Тема, цвет и части не названы — половины не хватает.' }),
      3: tr({ uz: "Yo'q — bunda faqat mavzu bor. Uslub, rang va qismlar yo'q, AI qolganini o'zi taxmin qiladi.", ru: 'Нет — здесь только тема. Стиля, цвета и частей нет — остальное AI додумает сам.' }),
      default: tr({ uz: 'Eng yaxshi buyruq 4 ingredientni aniq aytadi.', ru: 'Лучшая команда точно называет 4 ингредиента.' })
    }} />
);

// ===== SCREEN 8 — ITERATSIYA =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: 's8', text: "AI birinchi urinishda xohlaganingizday qilmasa — tashlab ketmaysiz, qayta va aniqroq so'raysiz. Bu iteratsiya. Natijani kamida ikki marta yaxshilang.", trigger: 'on_mount', waits_for: null }]);
  const BASE = { topic: 'ilova', style: 'zamonaviy', color: 'sariq', sec: { button: true, cards: true, banner: false } };
  const [st, setSt] = useState(BASE);
  const [log, setLog] = useState([]);
  const [usedIds, setUsedIds] = useState(new Set());
  const done = usedIds.size >= 2;
  const doneRef = useScrollIntoViewOnMobile(done);
  const FOLLOWS = [
    { id: 'f1', label: tr({ uz: "Rangni yashilga o'zgartir", ru: 'Поменяй цвет на зелёный' }), apply: (s) => ({ ...s, color: 'yashil' }) },
    { id: 'f2', label: tr({ uz: "Uslubni o'ynoqi qil", ru: 'Сделай стиль игривым' }), apply: (s) => ({ ...s, style: 'oynoqi' }) },
    { id: 'f3', label: tr({ uz: "Banner qo'sh", ru: 'Добавь баннер' }), apply: (s) => ({ ...s, sec: { ...s.sec, banner: true } }) },
    { id: 'f4', label: tr({ uz: 'Siyohrang qil', ru: 'Сделай фиолетовым' }), apply: (s) => ({ ...s, color: 'siyohrang' }) }
  ];
  const apply = (f) => { if (usedIds.has(f.id)) return; setSt(f.apply); setLog(l => [...l, f.label]); setUsedIds(prev => { const n = new Set(prev); n.add(f.id); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Iteratsiya', ru: 'Итерация' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Kamida 2 marta yaxshilang', ru: 'Улучшите минимум 2 раза' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI birinchi urinishda <span className="italic" style={{ color: T.accent }}>mukammal</span> qiladimi?</>, ru: <>Делает ли AI <span className="italic" style={{ color: T.accent }}>идеально</span> с первой попытки?</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI birinchi urinishda har doim mukammal qilmaydi — bu normal. Siz <b style={{ color: T.ink }}>qayta so'raysiz</b>: "rangni o'zgartir", "banner qo'sh". Bu — <b style={{ color: T.ink }}>iteratsiya</b>. Quyidagi buyruqlarni bering va sayt qadam-baqadam yaxshilanishini ko'ring.</>, ru: <>AI не всегда делает идеально с первой попытки — это нормально. Вы <b style={{ color: T.ink }}>просите снова</b>: «поменяй цвет», «добавь баннер». Это — <b style={{ color: T.ink }}>итерация</b>. Давайте команды ниже и смотрите, как сайт улучшается шаг за шагом.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Qo'shimcha buyruqlar", ru: 'Дополнительные команды' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FOLLOWS.map(f => <button key={f.id} className={`chip ${usedIds.has(f.id) ? 'chip-on' : ''}`} disabled={usedIds.has(f.id)} onClick={() => apply(f)} style={{ justifyContent: 'flex-start', opacity: usedIds.has(f.id) ? 0.6 : 1 }}>{usedIds.has(f.id) ? '✓ ' : '+ '}{f.label}</button>)}
            </div>
            {log.length > 0 && (
              <div className="frame" style={{ padding: '12px 14px' }}>
                <p className="flow-label" style={{ margin: '0 0 7px' }}>{tr({ uz: 'Sizning buyruqlaringiz', ru: 'Ваши команды' })}</p>
                {log.map((l, i) => <div key={i} style={{ display: 'flex', gap: 7, fontSize: 13, marginBottom: 3 }}><span style={{ color: T.accent, fontWeight: 700 }}>{i + 1}.</span><span>{l}</span></div>)}
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Sayt — qadam-baqadam yaxshilanadi', ru: 'Сайт — улучшается шаг за шагом' })}</p>
            <Browser url="focusly.uz"><LandingPreview topic={st.topic} style={st.style} color={st.color} sections={st.sec} /></Browser>
            {done && <div ref={doneRef} className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Mana iteratsiya kuchi! Har bir kichik buyruq saytni mukammallikka yaqinlashtiradi. Mukammal natija — bir emas, bir necha qadam.', ru: 'Вот сила итерации! Каждая маленькая команда приближает сайт к идеалу. Идеальный результат — не один шаг, а несколько.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEST 3 =====
const Screen9 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={{ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' }}
    audioText="AI birinchi urinishda xohlaganingizday qilmasa, nima qilasiz?"
    questionText="AI birinchi urinishda xohlaganingizday qilmasa, nima qilasiz?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>AI birinchi urinishda <span className="italic" style={{ color: T.accent }}>xohlaganingizday</span> qilmasa, nima qilasiz?</>, ru: <>AI с первой попытки сделал <span className="italic" style={{ color: T.accent }}>не так, как вы хотели</span> — что делать?</> })}</h2></>}
    options={[tr({ uz: "Hammasini qo'lda qayta yozaman", ru: 'Перепишу всё руками' }), tr({ uz: 'Tashlab ketaman', ru: 'Брошу и уйду' }), tr({ uz: "Qayta, aniqroq so'rayman (iteratsiya)", ru: 'Попрошу снова, точнее (итерация)' }), tr({ uz: '"AI yomon" deb xafa bo\'laman', ru: 'Обижусь: «AI плохой»' })]} correctIdx={2}
    explainCorrect={tr({ uz: "To'g'ri! Bu — iteratsiya. «Rangni o'zgartir», «tugma qo'sh» kabi qo'shimcha buyruqlar bilan natijani qadam-baqadam yaxshilaysiz.", ru: 'Верно! Это — итерация. Дополнительными командами вроде «поменяй цвет», «добавь кнопку» вы шаг за шагом улучшаете результат.' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — qo'lda qayta yozish AI tezligini yo'qotadi. Qayta so'rash (iteratsiya) ancha tez.", ru: 'Нет — переписывать руками значит потерять скорость AI. Попросить снова (итерация) гораздо быстрее.' }),
      1: tr({ uz: "Yo'q — birinchi natija oxirgisi emas. Bir-ikki qo'shimcha buyruq bilan ajoyib bo'ladi.", ru: 'Нет — первый результат не последний. Одна-две дополнительные команды — и будет отлично.' }),
      3: tr({ uz: "Yo'q — AI yomon emas, shunchaki aniqroq yo'naltirish kerak. Qayta so'rang.", ru: 'Нет — AI не плохой, его просто нужно точнее направить. Попросите снова.' }),
      default: tr({ uz: "Yoqmasa — qayta, aniqroq so'raysiz. Bu iteratsiya.", ru: 'Не нравится — просите снова, точнее. Это итерация.' })
    }} />
);

// ===== SCREEN 10 — TEKSHIRISH (AI xatosini topish) =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: 's10', text: "AI so'rovni har doim aniq tushunadimi? Natijani buyruq bilan solishtiring: qaysi qism boshqacha chiqqan? Topib, aniqlashtiring.", trigger: 'on_mount', waits_for: null }]);
  const [found, setFound] = useState(storedAnswer ? 'rang' : null);
  const [fixed, setFixed] = useState(!!storedAnswer);
  const isFound = found === 'rang';
  const done = fixed;
  const ASPECTS = [['mavzu', tr({ uz: 'Mavzu', ru: 'Тема' })], ['rang', tr({ uz: 'Rang', ru: 'Цвет' })], ['tugma', tr({ uz: 'Tugma', ru: 'Кнопка' })], ['ok', tr({ uz: 'Hammasi joyida', ru: 'Всё на месте' })]];
  const click = (a) => { if (isFound) return; setFound(a); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Tekshirish', ru: 'Проверка' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : (isFound ? { uz: 'Endi aniqlashtiring', ru: 'Теперь уточните' } : { uz: 'Farqni toping', ru: 'Найдите отличие' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI so'rovni har doim <span className="italic" style={{ color: T.accent }}>aniq</span> tushunadimi?</>, ru: <>Всегда ли AI понимает запрос <span className="italic" style={{ color: T.accent }}>точно</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI ba'zan buyruqni biroz <b style={{ color: T.ink }}>boshqacha</b> tushunadi — bu tabiiy, do'stingiz ham shunday qilishi mumkin. Siz <b style={{ color: T.ink }}>ko'k</b> rangli o'yin sahifasi so'radingiz, AI yasab berdi. Endi solishtiring: natija buyruqqa <b style={{ color: T.ink }}>to'liq mos keldimi?</b> Qaysi qism boshqacha chiqqan?</>, ru: <>Иногда AI понимает команду чуть <b style={{ color: T.ink }}>иначе</b> — это естественно, друг тоже мог бы так. Вы попросили страницу игры в <b style={{ color: T.ink }}>синем</b> цвете, AI её сделал. Теперь сравните: результат <b style={{ color: T.ink }}>полностью совпал</b> с командой? Какая часть вышла другой?</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Sizning buyrug'ingiz", ru: 'Ваша команда' })}</p>
            <PromptLine topic="oyin" style="zamonaviy" color="kok" sections={{ button: true }} />
            <p className="flow-label" style={{ marginTop: 4 }}>{tr({ uz: 'AI natijasi', ru: 'Результат AI' })}</p>
            <Browser url="pixel-quest.uz"><LandingPreview topic="oyin" style="zamonaviy" color={fixed ? 'kok' : 'sariq'} sections={{ button: true }} /></Browser>
          </Col>
          <Col>
            {!fixed && <>
              <p className="flow-label">{tr({ uz: 'Natijaning qaysi qismi buyruqdan farq qiladi?', ru: 'Какая часть результата отличается от команды?' })}</p>
              <div className="chiprow">{ASPECTS.map(([k, l]) => <button key={k} className={`chip ${found === k ? 'chip-on' : ''}`} disabled={isFound} onClick={() => click(k)}>{l}</button>)}</div>
            </>}
            {!isFound && found && found !== 'rang' && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu qism aslida to'g'ri. Buyruqni va rangni yana solishtiring — qaysi <b>rangda</b> so'radingiz, qaysi rangda chiqdi?</>, ru: <>Эта часть на самом деле верна. Сравните команду и цвет ещё раз — какой <b>цвет</b> вы просили и какой получился?</> })}</p></div>}
            {!isFound && !found && <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'Buyruqdagi har bir ingredientni natija bilan solishtiring: mavzu? rang? tugma?', ru: 'Сравните каждый ингредиент команды с результатом: тема? цвет? кнопка?' })}</p></div>}
            {isFound && !fixed && <>
              <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: 'Topdingiz!', ru: 'Нашли!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Siz <b>ko'k</b> so'ragandingiz, Ustabot uni <b>to'q sariq</b> deb tushunibdi. Muammo yo'q — qabul aktida belgilab, qayta buyuramiz.</>, ru: <>Вы просили <b>синий</b>, а Устабот понял его как <b>оранжевый</b>. Не беда — отметим в акте приёмки и закажем заново.</> })}</p></div>
              <AcceptanceReport
                checks={[{ label: { uz: "Mavzu mos? (o'yin)", ru: 'Тема совпала? (игра)' }, ok: true }, { label: { uz: "Rang mos? (ko'k)", ru: 'Цвет совпал? (синий)' }, ok: false }, { label: { uz: 'Tugma bor?', ru: 'Кнопка есть?' }, ok: true }, { label: { uz: "Ortiqcha yo'q?", ru: 'Ничего лишнего?' }, ok: true }]}
                onRedo={() => setFixed(true)} redoLabel={{ uz: "Rangni ko'kka tuzat", ru: 'Исправь цвет на синий' }} />
            </>}
            {fixed && <>
              <AcceptanceReport done checks={[{ label: { uz: "Mavzu mos? (o'yin)", ru: 'Тема совпала? (игра)' }, ok: true }, { label: { uz: "Rang mos? (ko'k)", ru: 'Цвет совпал? (синий)' }, ok: true }, { label: { uz: 'Tugma bor?', ru: 'Кнопка есть?' }, ok: true }, { label: { uz: "Ortiqcha yo'q?", ru: 'Ничего лишнего?' }, ok: true }]} />
              <div className="takeaway fade-step"><div className="ta-bulb" style={{ fontSize: 24, fontWeight: 800, color: T.success }}>✓</div><p className="ta-h">{tr({ uz: 'Tekshirdingiz va aniqlashtirdingiz!', ru: 'Вы проверили и уточнили!' })}</p><p className="ta-sub">{tr({ uz: 'Ustabot quradi, siz qabul aktida solishtirib aniqlik kiritasiz — ajoyib jamoa.', ru: 'Устабот строит, вы сверяете по акту приёмки и уточняете — отличная команда.' })}</p></div>
            </>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — AI: KUCHLI vs EHTIYOT =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: 's11', text: "AI nimada kuchli va siz nimani tekshirasiz? Ikkala kartani bosib ko'ring: AI tezlik beradi, siz sifatni ta'minlaysiz.", trigger: 'on_mount', waits_for: null }]);
  const CARDS = {
    kuch: { name: tr({ uz: 'AI nimada KUCHLI', ru: 'В чём AI СИЛЁН' }), color: T.success, items: [tr({ uz: 'Tezlik — soniyalarda quradi', ru: 'Скорость — строит за секунды' }), tr({ uz: "Ko'p variant taklif qiladi", ru: 'Предлагает много вариантов' }), tr({ uz: 'Dizayn va bezakda usta', ru: 'Мастер дизайна и оформления' }), tr({ uz: 'Zerikarli ishlarni bajaradi', ru: 'Берёт на себя скучную работу' })] },
    tekshir: { name: tr({ uz: 'Siz nimani tekshirasiz', ru: 'Что проверяете вы' }), color: T.blue, items: [tr({ uz: "So'raganim chiqdimi?", ru: 'Вышло то, что я просил?' }), tr({ uz: "Ortiqcha narsa yo'qmi?", ru: 'Нет ли лишнего?' }), tr({ uz: "Matn to'g'ri yozilganmi?", ru: 'Правильно ли написан текст?' }), tr({ uz: 'Hammasi ishlayaptimi?', ru: 'Всё ли работает?' })] }
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 2;
  const tap = (k) => { setActive(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'AI bilan ishlash', ru: 'Работа с AI' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `${seen.size}/2 ko'ring`, ru: `Посмотрите ${seen.size}/2` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI bilan eng <span className="italic" style={{ color: T.accent }}>zo'r natijani</span> qanday olamiz?</>, ru: <>Как получить с AI <span className="italic" style={{ color: T.accent }}>самый крутой результат</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI — ajoyib va juda foydali ishchi. Ba'zan adashishi ham mumkin — bu mutlaqo normal, hammaning ishida shunday bo'ladi. Sirri oddiy: <b style={{ color: T.ink }}>birga ishlaysiz</b> — AI tez quradi, siz natijani tekshirib, kerak bo'lsa aniqlashtirib qo'yasiz. Ikkala kartani bosib ko'ring.</>, ru: <>AI — замечательный и очень полезный работник. Иногда он может ошибаться — это совершенно нормально, так бывает у всех. Секрет прост: <b style={{ color: T.ink }}>работайте вместе</b> — AI быстро строит, а вы проверяете результат и при необходимости уточняете. Нажмите на обе карточки.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.keys(CARDS).map(k => (
                <button key={k} onClick={() => tap(k)} style={{ display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 14, padding: '15px 16px', background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${CARDS[k].color}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: 'all 0.18s' }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: CARDS[k].color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 16, color: T.ink }}>{CARDS[k].name}</span>
                  {seen.has(k) && <span style={{ marginLeft: 'auto', color: T.success }}>✓</span>}
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {active ? (
              <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span style={{ width: 14, height: 14, borderRadius: 4, background: CARDS[active].color }} /><span className="sk-wordbadge" style={{ color: CARDS[active].color, background: CARDS[active].color + '22' }}>{CARDS[active].name}</span></span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 11 }}>
                  {CARDS[active].items.map((e, i) => (<div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', background: T.bg, borderRadius: 8, padding: '8px 11px' }}><span style={{ color: CARDS[active].color }}>•</span><span className="body" style={{ margin: 0, color: T.ink2 }}>{e}</span></div>))}
                </div>
              </div>
            ) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Bir kartani bosing', ru: 'Нажмите на карточку' })}</p></div> : null)}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Qoida oddiy: AI'dan <b>tezlik</b> uchun foydalaning, natijani <b>o'zingiz tekshiring</b> va kerak bo'lsa aniqroq qayta so'rang. Shunda har doim zo'r natija.</>, ru: <>Правило простое: используйте AI ради <b>скорости</b>, результат <b>проверяйте сами</b> и при необходимости просите точнее. Тогда результат всегда будет отличным.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — O'Z PROMO SAHIFANG =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onPracticeDone, onNext, onPrev }) => {
  useAudio([{ id: 's12', text: "Endi to'liq erkinlik sizda! Yoqtirgan mavzu, uslub, rang va qismlarni tanlab, o'zingizning promo sahifangizni quring va nashr qiling.", trigger: 'on_mount', waits_for: null }]);
  const [topic, setTopic] = useState(storedAnswer ? 'tadbir' : null);
  const [style, setStyle] = useState(storedAnswer ? 'oynoqi' : null);
  const [color, setColor] = useState(storedAnswer ? 'siyohrang' : null);
  const [sec, setSec] = useState(storedAnswer ? { button: true, cards: true, banner: true } : { button: false, cards: false, banner: false });
  const [published, setPublished] = useState(!!storedAnswer);
  const anySec = sec.button || sec.cards || sec.banner;
  const all4 = topic && style && color && anySec;
  const done = published;
  const pubRef = useScrollIntoView(published); // deploy natijasi mobil + desktop'da ham ko'rinishga kelsin
  // PromoBuilder-praktika: nashr qilinganda mentorga «tugatdi» signali + 🏅 nishon (bir marta)
  useEffect(() => { if (done && storedAnswer === undefined) { onAnswer(screen, { correct: true, picked: true }); if (onPracticeDone) onPracticeDone(screen); } }, [done]); // eslint-disable-line
  return (
    <Stage eyebrow={{ uz: "O'z loyihangiz", ru: 'Ваш проект' }} screen={screen} mentorCollapsible navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Sahifani nashr qiling', ru: 'Опубликуйте страницу' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>o'zingiz</span> qanday sayt yaratasiz?</>, ru: <>Какой сайт вы теперь создадите <span className="italic" style={{ color: T.accent }}>сами</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Endi to'liq erkinlik sizda! Yoqtirgan mavzu, uslub, rang va qismlarni tanlab, <b style={{ color: T.ink }}>o'zingizning</b> promo sahifangizni quring. Tayyor bo'lgach — uni <b style={{ color: T.ink }}>nashr qiling</b> (deploy) va dunyoga ulashing.</>, ru: <>Теперь полная свобода! Выберите любимую тему, стиль, цвет и части и постройте <b style={{ color: T.ink }}>свою</b> промо-страницу. Когда будет готова — <b style={{ color: T.ink }}>опубликуйте</b> её (deploy) и поделитесь с миром.</> })}</Mentor>
        <PromoBuilder topic={topic} setTopic={setTopic} style={style} setStyle={setStyle} color={color} setColor={setColor} sec={sec} setSec={setSec} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn" disabled={!all4 || published} onClick={() => setPublished(true)} style={{ opacity: all4 ? 1 : 0.5 }}>{published ? tr({ uz: '✓ Nashr qilindi', ru: '✓ Опубликовано' }) : tr({ uz: 'Nashr qilish (deploy)', ru: 'Опубликовать (deploy)' })}</button>
          {!all4 && !published && <span className="mono small" style={{ color: T.ink3 }}>{tr({ uz: 'avval 4 ingredientni tanlang', ru: 'сначала выберите 4 ингредиента' })}</span>}
          {published && <span className="mono small" style={{ color: T.success }}>https://mening-promo.netlify.app</span>}
        </div>
        {published && <div ref={pubRef} className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Tabriklaymiz! Siz AI bilan to'liq sahifa qurib, uni nashr qildingiz — havolani do'stlaringizga yuborsangiz bo'ladi. Mana shu — tez, sifatli loyiha.", ru: 'Поздравляем! Вы построили с AI целую страницу и опубликовали её — ссылку можно отправить друзьям. Вот это — быстрый и качественный проект.' })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — BITTA USUL, KO'P SAYT =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: 's13', text: "Bitta usul bilan nechta xil sayt qura olasiz? Faqat mavzuni almashtirib, butunlay boshqa saytlarni yasang.", trigger: 'on_mount', waits_for: null }]);
  const [topic, setTopic] = useState('oyin');
  const [sent, setSent] = useState(null);     // qurilgan mavzu
  const [phase, setPhase] = useState('idle');  // idle | building
  const [builtTopics, setBuiltTopics] = useState(new Set());
  const timer = useRef(null);
  const done = builtTopics.size >= 2;
  useEffect(() => () => clearTimeout(timer.current), []);
  const send = () => { clearTimeout(timer.current); setPhase('building'); timer.current = setTimeout(() => { setSent(topic); setBuiltTopics(prev => { const n = new Set(prev); n.add(topic); return n; }); setPhase('idle'); }, 900); };
  const stale = sent !== null && sent !== topic && phase === 'idle';
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Tez-tez', ru: 'Ещё и ещё' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Kamida 2 mavzu yuboring', ru: 'Отправьте минимум 2 темы' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta usul bilan <span className="italic" style={{ color: T.accent }}>nechta xil</span> sayt qura olasiz?</>, ru: <>Сколько <span className="italic" style={{ color: T.accent }}>разных</span> сайтов можно построить одним способом?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Eng zo'r tomoni: bitta usulni o'rgandingiz, endi <b style={{ color: T.ink }}>faqat mavzuni almashtirib</b>, butunlay boshqa saytni yasaysiz. Mavzuni tanlang, <b style={{ color: T.ink }}>yuboring</b> — keyin boshqa mavzuni tanlab, yana yuboring.</>, ru: <>Самое крутое: вы выучили один способ, и теперь, <b style={{ color: T.ink }}>меняя только тему</b>, делаете совершенно другой сайт. Выберите тему, <b style={{ color: T.ink }}>отправьте</b> — потом выберите другую и отправьте снова.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Mavzuni tanlang', ru: 'Выберите тему' })}</p>
            <div className="chiprow fade-up delay-1">{TOPICS.map(([v, l]) => <button key={v} className={`chip ${topic === v ? 'chip-on' : ''}`} onClick={() => setTopic(v)}>{tr(l)}</button>)}</div>
            <div className="promptbox">{tr({ uz: <>Menga <span className="pb-slot" key={topic}>{tr(TOPIC_PROMPT[topic])}</span> uchun bir sahifali promo-landing yasab ber. Uslubi <span className="pb-slot">o'ynoqi</span>, asosiy rang <span className="pb-slot">siyohrang</span>. Yuqorida katta sarlavha va qisqa tavsif, hamda <span className="pb-slot">harakat tugmasi, 3 ta karta</span> bo'lsin. Mobil va kompyuterda chiroyli ko'rinsin.</>, ru: <>Сделай мне одностраничный промо-лендинг для <span className="pb-slot" key={topic}>{tr(TOPIC_PROMPT[topic])}</span>. Стиль — <span className="pb-slot">игривый</span>, основной цвет — <span className="pb-slot">фиолетовый</span>. Сверху большой заголовок и короткое описание, а также <span className="pb-slot">кнопка действия, 3 карточки</span>. Пусть красиво смотрится и на телефоне, и на компьютере.</> })}</div>
            <button className="btn" onClick={send} disabled={phase === 'building'} style={{ alignSelf: 'flex-start' }}>{phase === 'building' ? tr({ uz: 'Quryapti…', ru: 'Строит…' }) : tr({ uz: 'Agentga yuborish', ru: 'Отправить агенту' })}</button>
            {stale && <p className="hook-ack fade-step" style={{ margin: 0, color: T.accent }}>{tr({ uz: "Yangi mavzu tanlandi — yuborib ko'ring.", ru: 'Выбрана новая тема — попробуйте отправить.' })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija — har mavzuga boshqa sayt', ru: 'Результат — на каждую тему свой сайт' })}</p>
            <Browser url={sent ? `${sent}.uz` : 'promo.uz'} key={sent || 'none'}>
              {phase === 'building' && <BuildingPreview />}
              {phase === 'idle' && sent === null && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: '(mavzu tanlab, yuboring)', ru: '(выберите тему и отправьте)' })}</p>}
              {phase === 'idle' && sent && <div className="result-reveal"><LandingPreview topic={sent} style="oynoqi" color="siyohrang" sections={{ button: true, cards: true, banner: false }} /></div>}
            </Browser>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ko'rdingizmi? O'yin, klub, tadbir, ilova — bitta usul bilan hammasi. Endi siz <b>istalgancha sayt</b> qura olasiz.</>, ru: <>Видели? Игра, клуб, событие, приложение — всё одним способом. Теперь вы можете построить <b>сколько угодно сайтов</b>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — ANTIGRAVITY (haqiqiy asbob) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: 's14', text: "Antigravity — siz uyda ishlaydigan haqiqiy asbob. Demoni ishga tushirib, muhit bilan tanishing.", trigger: 'on_mount', waits_for: null }]);
  const [phase, setPhase] = useState(storedAnswer ? 'done' : 'idle'); // idle | plan | building | done
  const timer = useRef(null);
  const done = phase === 'done';
  const doneRef = useScrollIntoViewOnMobile(done);
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => { clearTimeout(timer.current); setPhase('plan'); timer.current = setTimeout(() => { setPhase('building'); timer.current = setTimeout(() => setPhase('done'), 1200); }, 1000); };
  const PLAN = [tr({ uz: 'Sahifa strukturasini yarataman', ru: 'Создам структуру страницы' }), tr({ uz: "Sarlavha, tugma va kartalarni qo'shaman", ru: 'Добавлю заголовок, кнопку и карточки' }), tr({ uz: "Tanlangan rang va uslubni qo'llayman", ru: 'Применю выбранные цвет и стиль' })];
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Haqiqiy asbob', ru: 'Настоящий инструмент' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Demoni ishga tushiring', ru: 'Запустите демо' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bu usulni endi <span className="italic" style={{ color: T.accent }}>haqiqiy loyihada</span> qanday ishlatamiz?</>, ru: <>Как использовать этот способ <span className="italic" style={{ color: T.accent }}>в настоящем проекте</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bugun o'rgangan usul haqiqiy <b style={{ color: T.ink }}>Antigravity</b> muhitida aynan shunday ishlaydi: siz oddiy tilda yozasiz, agent <b style={{ color: T.ink }}>reja</b> tuzadi, quradi va brauzerda ko'rsatadi — yoqmasa qayta so'raysiz. Demoni ishga tushiring.</>, ru: <>Способ, который вы выучили сегодня, в настоящей среде <b style={{ color: T.ink }}>Antigravity</b> работает точно так же: вы пишете простым языком, агент составляет <b style={{ color: T.ink }}>план</b>, строит и показывает в браузере — не нравится, просите снова. Запустите демо.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Siz Antigravity'ga yozasiz", ru: 'Вы пишете в Antigravity' })}</p>
            <PromptLine topic="ilova" style="minimal" color="kok" sections={{ button: true, cards: true }} />
            <button className="btn" onClick={run} disabled={phase === 'plan' || phase === 'building'} style={{ alignSelf: 'flex-start' }}>{phase === 'plan' ? tr({ uz: 'Reja tuzyapti…', ru: 'Составляет план…' }) : (phase === 'building' ? tr({ uz: 'Quryapti…', ru: 'Строит…' }) : (done ? tr({ uz: '↻ Yana', ru: '↻ Ещё раз' }) : tr({ uz: "Antigravity'ga yuborish", ru: 'Отправить в Antigravity' })))}</button>
            {(phase === 'plan' || phase === 'building' || done) && (
              <div className="ai-card fade-step">
                <div className="ai-row"><span className="ai-badge" style={{ background: T.ink }}>Agent</span><span className="ai-bubble">{tr({ uz: 'Rejam:', ru: 'Мой план:' })}</span></div>
                {PLAN.map((p, i) => <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}><span style={{ color: phase === 'plan' ? T.ink3 : T.success }}>{phase === 'plan' ? '○' : '✓'}</span><span>{p}</span></div>)}
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Antigravity brauzeri', ru: 'Браузер Antigravity' })}</p>
            <Browser url="focusly.uz">
              {phase === 'idle' && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: '(demoni ishga tushiring)', ru: '(запустите демо)' })}</p>}
              {(phase === 'plan' || phase === 'building') && <p className="small" style={{ margin: 0, opacity: 0.6, textAlign: 'center', padding: '24px 0' }}>{phase === 'plan' ? tr({ uz: 'Reja tuzilyapti…', ru: 'Составляется план…' }) : tr({ uz: 'Quryapti…', ru: 'Строит…' })}</p>}
              {done && <LandingPreview topic="ilova" style="minimal" color="kok" sections={{ button: true, cards: true }} />}
            </Browser>
            {done && <div ref={doneRef} className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Aynan shu oqim! Uyga vazifada haqiqiy Antigravity'da 4-ingredientli buyruq bilan o'z saytingizni quring.", ru: 'Именно такой поток! В домашнем задании постройте свой сайт в настоящем Antigravity командой из 4 ингредиентов.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — YAKUNIY (to'liq buyruq tuzish) =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: 's15', text: "Yakuniy amaliy mashq: to'rt ingredientni to'ldirib, o'z buyrug'ingizni tuzing va natijani ko'ring.", trigger: 'on_mount', waits_for: null }]);
  const [topic, setTopic] = useState(storedAnswer?.correct ? 'tadbir' : null);
  const [style, setStyle] = useState(storedAnswer?.correct ? 'zamonaviy' : null);
  const [color, setColor] = useState(storedAnswer?.correct ? 'kok' : null);
  const [sec, setSec] = useState(storedAnswer?.correct ? { button: true, cards: true, banner: false } : { button: false, cards: false, banner: false });
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const passedRef = useScrollIntoViewOnMobile(passed);
  const anySec = sec.button || sec.cards || sec.banner;
  const all4 = topic && style && color && anySec;
  useEffect(() => { if (all4 && !passed) { setPassed(true); onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'To\'liq 4-ingredientli buyruq tuzish', studentAnswer: `${topic}/${style}/${color}`, correct: true, firstAttemptCorrect: true, solved: true, picked: `${topic}/${style}/${color}` }); } }, [all4]);
  return (
    <Stage eyebrow={{ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' }} screen={screen} mentorCollapsible navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "4 ingredientni to'ldiring", ru: 'Заполните 4 ингредиента' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi sinov: <span className="italic" style={{ color: T.accent }}>to'liq</span> buyruq tuzing</>, ru: <>Последнее испытание: составьте <span className="italic" style={{ color: T.accent }}>полную</span> команду</> })}</h2></div>
        <Mentor>{tr({ uz: <>Vazifa: <b style={{ color: T.ink }}>maktab konsertiga promo sahifa</b> kerak. To'liq, sifatli buyruq tuzing — <b style={{ color: T.ink }}>4 ingredientning hammasini</b> tanlang: mavzu, uslub, rang va kamida bitta qism. Hammasi to'lganda buyruq tayyor bo'ladi.</>, ru: <>Задача: нужна <b style={{ color: T.ink }}>промо-страница школьного концерта</b>. Составьте полную качественную команду — выберите <b style={{ color: T.ink }}>все 4 ингредиента</b>: тему, стиль, цвет и минимум одну часть. Когда всё заполнено, команда готова.</> })}</Mentor>
        <PromoBuilder topic={topic} setTopic={setTopic} style={style} setStyle={setStyle} color={color} setColor={setColor} sec={sec} setSec={setSec} />
        <AcceptanceReport done={all4} checks={[{ label: { uz: 'Mavzu tanlandi?', ru: 'Тема выбрана?' }, ok: !!topic }, { label: { uz: 'Uslub tanlandi?', ru: 'Стиль выбран?' }, ok: !!style }, { label: { uz: 'Rang tanlandi?', ru: 'Цвет выбран?' }, ok: !!color }, { label: { uz: 'Kamida bitta qism?', ru: 'Минимум одна часть?' }, ok: anySec }]} />
        {passed
          ? <div ref={passedRef} className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Mukammal! To'liq 4-ingredientli buyruq — aniq, sifatli natija beradi. Ustabot endi aynan so'raganingizni quradi.", ru: 'Идеально! Полная команда из 4 ингредиентов даёт точный, качественный результат. Теперь Устабот построит именно то, что вы просили.' })}</p></div>
          : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr({ uz: '4 ingredient kerak: mavzu + uslub + rang + kamida bitta qism.', ru: 'Нужны 4 ингредиента: тема + стиль + цвет + минимум одна часть.' })}</p>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 16 — YAKUN =====
// ===== 🃏 FLASHCARDS (Quizlet-uslub takrorlash) — kalit so'zlar kartalarda =====
const AI_FLASHCARDS = [
  { front: { uz: "AI'ga beriladigan buyruq nima deyiladi?", ru: 'Как называется команда, которую дают AI?' }, back: { uz: 'Prompt', ru: 'Промпт' }, note: { uz: "buyruq qanchalik aniq — natija shunchalik aniq", ru: 'насколько точна команда — настолько точен результат' } },
  { front: { uz: "Kod yozmasdan, so'z bilan tasvirlab sayt qurish nima deyiladi?", ru: 'Как называется создание сайта словами, без написания кода?' }, back: 'Vibecoding', note: { uz: 'siz aytasiz — AI quradi', ru: 'вы говорите — AI строит' } },
  { front: { uz: 'Yaxshi promptning 4 ingredienti qaysilar?', ru: 'Какие 4 ингредиента у хорошего промпта?' }, back: { uz: 'Mavzu · Uslub · Rang · Qismlar', ru: 'Тема · Стиль · Цвет · Части' }, note: { uz: "to'rttasi bor — buyruq aniq", ru: 'есть все четыре — команда точная' } },
  { front: { uz: "Promptdagi «uslub» ingredienti nimani belgilaydi?", ru: 'Что задаёт ингредиент «стиль» в промпте?' }, back: { uz: "Sahifa ko'rinishini", ru: 'Внешний вид страницы' }, note: { uz: "zamonaviy, o'ynoqi yoki minimal", ru: 'современный, игривый или минималистичный' } },
  { front: { uz: "«Menga sayt yasab ber» — bu qanaqa prompt?", ru: '«Сделай мне сайт» — какой это промпт?' }, back: { uz: 'Loyqa prompt', ru: 'Размытый промпт' }, note: { uz: "aniq emas — natija ham tasodifiy chiqadi", ru: 'команда неточная — и результат случайный' } },
  { front: { uz: "Natija yoqmasa, qayta va aniqroq so'rash nima deyiladi?", ru: 'Как называется повторный, более точный запрос, если результат не понравился?' }, back: { uz: 'Iteratsiya', ru: 'Итерация' }, note: { uz: "«rangni yashilga o'zgartir», «banner qo'sh»", ru: '«поменяй цвет на зелёный», «добавь баннер»' } },
  { front: { uz: 'AI sahifani yasab bergach, birinchi navbatda nima qilasiz?', ru: 'AI сделал страницу — что вы делаете в первую очередь?' }, back: { uz: 'Tekshiraman', ru: 'Проверяю' }, note: { uz: "natijani buyruq bilan solishtirasiz: rang, mavzu, tugma mosmi?", ru: 'сверяете результат с командой: цвет, тема, кнопка совпали?' } },
  { front: { uz: "AI'dan nimani olasiz, o'zingiz nimani ta'minlaysiz?", ru: 'Что вы получаете от AI, а что обеспечиваете сами?' }, back: { uz: 'AI — tezlik, siz — sifat', ru: 'AI — скорость, вы — качество' }, note: { uz: "birga ishlaganda natija eng zo'r chiqadi", ru: 'вместе получается лучший результат' } },
  { front: { uz: 'Reja tuzib, sahifani mustaqil quradigan AI yordamchisi nima deyiladi?', ru: 'Как называется AI-помощник, который сам составляет план и строит страницу?' }, back: { uz: 'Agent', ru: 'Агент' }, note: { uz: "avval rejani ko'rsatadi, siz tasdiqlaysiz", ru: 'сначала показывает план, вы подтверждаете' } },
  { front: { uz: 'Bitta sahifadan iborat reklama sayti nima deyiladi?', ru: 'Как называется рекламный сайт из одной страницы?' }, back: { uz: 'Promo-landing', ru: 'Промо-лендинг' }, note: { uz: 'sarlavha, tavsif, tugma va kartalar', ru: 'заголовок, описание, кнопка и карточки' } },
  { front: { uz: 'Tayyor saytni internetga chiqarish nima deyiladi?', ru: 'Как называется публикация готового сайта в интернете?' }, back: { uz: 'Deploy (nashr qilish)', ru: 'Deploy (публикация)' }, note: { uz: "shundan keyin havolani do'stlaringizga yuborasiz", ru: 'после этого можно отправить ссылку друзьям' } },
  { front: { uz: 'Uyda shu usulda ishlaydigan haqiqiy AI-muhit qaysi?', ru: 'В какой настоящей AI-среде можно так работать дома?' }, back: 'Antigravity', note: { uz: 'siz yozasiz, agent reja tuzadi va quradi', ru: 'вы пишете, агент составляет план и строит' } },
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'tushuncha yodlandi', ru: 'понятий выучено' })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Учим' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span><span className="fc-cue">{tr({ uz: <>Javobni o'ylang 🤔 <span className="fc-tap">bosing</span></>, ru: <>Подумайте над ответом 🤔 <span className="fc-tap">нажмите</span></> })}</span></div>
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

// ===== ScreenFlashcards — kalit so'zlarni tez takrorlash (summarydan ko'chirilgan glossariy) =====
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useAudio([{ id: 'sflash', text: `O'zingizni sinab ko'ring. Har kartada bir savol — javobini o'ylang, keyin kartani bosing.`, trigger: 'on_mount', waits_for: null }]);
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={{ uz: 'Takrorlash', ru: 'Повторение' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={AI_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

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
  const RECAP = [tr({ uz: "AI tezlik beradi — sifatni siz ta'minlaysiz", ru: 'AI даёт скорость — качество обеспечиваете вы' }), tr({ uz: 'Yaxshi prompt = 4 ingredient: mavzu, uslub, rang, qismlar', ru: 'Хороший промпт = 4 ингредиента: тема, стиль, цвет, части' }), tr({ uz: "Yomon prompt = bo'sh natija; aniq prompt = chiroyli natija", ru: 'Плохой промпт = пустой результат; точный промпт = красивый результат' }), tr({ uz: "Iteratsiya — qayta so'rab natijani yaxshilash", ru: 'Итерация — улучшать результат повторным запросом' }), tr({ uz: 'Doim tekshiring — AI xato qilishi mumkin', ru: 'Всегда проверяйте — AI может ошибаться' })];
  const HOMEWORK = [{ b: tr({ uz: "Antigravity'da", ru: 'В Antigravity' }), t: tr({ uz: '— 4-ingredientli buyruq bilan bitta promo sahifa qurdiring', ru: '— постройте одну промо-страницу командой из 4 ингредиентов' }) }, { b: tr({ uz: 'Iteratsiya', ru: 'Итерация' }), t: tr({ uz: "— natijani kamida 2 marta qayta so'rab yaxshilang", ru: '— улучшите результат минимум 2 повторными запросами' }) }, { b: tr({ uz: 'Tekshiring', ru: 'Проверьте' }), t: tr({ uz: "— so'raganingiz chiqdimi? Ortiqcha narsa yo'qmi?", ru: '— вышло ли то, что просили? Нет ли лишнего?' }) }];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={{ uz: 'Tayyor', ru: 'Готово' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: '2-praktika tugadi', ru: 'Практика 2 завершена' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi AI bilan <span className="italic" style={{ color: T.accent }}>tez va sifatli</span> sayt qura olasiz</>, ru: <>Теперь вы можете строить с AI сайты <span className="italic" style={{ color: T.accent }}>быстро и качественно</span></> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: "Zo'r! Yaxshi prompt, iteratsiya va tekshirishni egalladingiz. Keyingi loyihada xuddi shu boshqaruvni — buyruq, qayta so'rash, tekshirish — butun bir mini-do'konga qo'llaysiz.", ru: 'Класс! Вы освоили хороший промпт, итерацию и проверку. В следующем проекте примените то же управление — команда, повторный запрос, проверка — к целому мини-магазину.' }) : tr({ uz: "Yaxshi harakat! Buyruqning 4 ingredientini bir-ikki ekranni qayta ko'rib mustahkamlang.", ru: 'Хорошая попытка! Закрепите 4 ингредиента команды, пересмотрев пару экранов.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} disabled={studentWait} liveOn={studentLive} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: 'Antigravity bilan mashq qiling:', ru: 'Потренируйтесь с Antigravity:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>))}</ul><p className="hw-note">{tr({ uz: "Esda tuting: AI tezlik beradi — sifatni siz ta'minlaysiz.", ru: 'Помните: AI даёт скорость — качество обеспечиваете вы.' })}</p></div>
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
// ============================================================ LESSON ROOT
// Podium yorliqlari (scored indeks -> qisqa nom)
const Q_LABELS = { 4: { uz: '1 — Yaxshi prompt', ru: '1 — Хороший промпт' }, 7: { uz: '2 — Eng yaxshi buyruq', ru: '2 — Лучшая команда' }, 9: { uz: '3 — Iteratsiya', ru: '3 — Итерация' }, 15: { uz: "4 — To'liq buyruq", ru: '4 — Полная команда' } };

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
const INLINE_KEYS = { s4: 0, s7: 1, s9: 2, s15: -1 };

const ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  useAudio([{ id: 's15b', text: "Mana natijalar! Kim g'olib bo'ldi — reyting va podiumni ko'ring.", trigger: 'on_mount', waits_for: null }]);
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
    // FAQAT baholanadigan testlar hisoblanadi — praktikaning «tugatdi» belgisi (idx 500+)
    // reytingga aralashmasin (u faqat MentorPracticeOverlay uchun yoziladi)
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
    <Stage eyebrow={{ uz: 'Natijalar', ru: 'Результаты' }} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} /></>}>
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
                      <span className="qstat-lbl">{Q_LABELS[q] ? tr(Q_LABELS[q]) : `#${q}`}{hard && ' ⚠️'}</span>
                      <span className="mstats-track"><span className="mstats-fill" style={{ width: `${pct}%`, background: hard ? T.accent : T.success }} /></span>
                      <span className="mono qstat-n">{okN}/{qa.length}</span>
                    </div>
                  );
                })}
              </div>
              {live.mode === 'mentor' && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.', ru: '⚠️ — вопросы, на которых класс споткнулся. Рекомендуется объяснить ещё раз.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== 🏅 ACHIEVEMENTS (nishonlar) — AI-praktikadagi real bosqichlar =====
const ACHIEVEMENTS = {
  prompt:  { icon: '🎯', name: 'Prompt Pro',  desc: { uz: 'Yaxshi promptni yomonidan ajratdingiz', ru: 'Вы отличили хороший промпт от плохого' } },
  best:    { icon: '🏆', name: 'Best Brief',  desc: { uz: 'Eng aniq buyruqni tanladingiz', ru: 'Вы выбрали самую точную команду' } },
  iterate: { icon: '🔁', name: 'Iterator',    desc: { uz: 'Iteratsiya bilan natijani yaxshiladingiz', ru: 'Вы улучшили результат итерацией' } },
  builder: { icon: '🚀', name: 'Ship It!',    desc: { uz: "O'z promo saytingizni qurib nashr qildingiz", ru: 'Вы построили и опубликовали свой промо-сайт' } },
};
// Ekran id → nishon (recordAnswer'da faqat SCORED test ekranida, data.correct bo'lsa beriladi).
// 'builder' — PromoBuilder-praktika tugatilganda (runPractice done) beriladi.
const ACH_TRIGGERS = { s4: 'prompt', s7: 'best', s9: 'iterate' };

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

// ===== ⚡ CODE STRIKE — MUSTAHKAMLASH ARENASI =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi kod/prompt tokenlari (dars-DNK: AI bilan qurish tili)
const QZ_BG_SHAPES = [
  { ch: 'prompt',   l: 6,  t: 18, s: 30, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: { uz: 'mavzu', ru: 'тема' },    l: 82, t: 12, s: 26, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: { uz: 'uslub', ru: 'стиль' },    l: 9,  t: 74, s: 30, c: 'rgba(255,110,70,0.15)',  d: 27, dl: 0.8 },
  { ch: { uz: 'rang', ru: 'цвет' },     l: 76, t: 70, s: 26, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: { uz: 'qismlar', ru: 'части' },  l: 46, t: 86, s: 28, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: 'deploy',   l: 66, t: 24, s: 22, c: 'rgba(80,200,255,0.14)',  d: 17, dl: 0.4 },
  { ch: { uz: 'iteratsiya', ru: 'итерация' }, l: 22, t: 36, s: 22, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: 'agent',    l: 92, t: 46, s: 24, c: 'rgba(120,235,175,0.13)', d: 24, dl: 1.3 },
  { ch: { uz: 'sayt', ru: 'сайт' },     l: 2,  t: 46, s: 24, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: "Vibecoding'da asosiy qoida qaysi?", ru: 'Главное правило вайбкодинга?' }, opts: [{ uz: "AI hammasini o'zi hal qiladi", ru: 'AI сам всё решает' }, { uz: 'Kod yozish shart emas', ru: 'Писать код не обязательно' }, { uz: "AI tezlik beradi — sifatni siz ta'minlaysiz", ru: 'AI даёт скорость — качество обеспечиваете вы' }, { uz: 'Faqat ingliz tili kerak', ru: 'Нужен только английский' }], correct: 2 },
  { q: { uz: '«Prompt» nima?', ru: 'Что такое «промпт»?' }, opts: [{ uz: 'Saytning rangi', ru: 'Цвет сайта' }, { uz: 'Internet brauzeri', ru: 'Интернет-браузер' }, { uz: 'Fayl kengaytmasi', ru: 'Расширение файла' }, { uz: "AI'ga beriladigan buyruq/ko'rsatma", ru: 'Команда/инструкция для AI' }], correct: 3 },
  { q: { uz: 'Yaxshi promptning 4 ingredienti qaysi?', ru: '4 ингредиента хорошего промпта?' }, opts: [{ uz: 'Mavzu, uslub, rang, qismlar', ru: 'Тема, стиль, цвет, части' }, { uz: 'Ism, yosh, shahar, maktab', ru: 'Имя, возраст, город, школа' }, 'HTML, CSS, JS, PHP', { uz: 'Sarlavha, rasm, video, audio', ru: 'Заголовок, картинка, видео, аудио' }], correct: 0 },
  { q: { uz: '«Menga sayt yasab ber» — bu qanaqa prompt?', ru: '«Сделай мне сайт» — какой это промпт?' }, opts: [{ uz: 'Aniq va sifatli', ru: 'Точный и качественный' }, { uz: "Loyqa — bo'sh natija beradi", ru: 'Размытый — даст пустой результат' }, { uz: 'Eng yaxshi variant', ru: 'Лучший вариант' }, { uz: "To'liq 4 ingredientli", ru: 'Полный, из 4 ингредиентов' }], correct: 1 },
  { q: { uz: 'Yaxshi prompt yomonidan nimasi bilan farq qiladi?', ru: 'Чем хороший промпт отличается от плохого?' }, opts: [{ uz: "Uzunroq bo'ladi", ru: 'Он длиннее' }, { uz: 'Faqat inglizcha', ru: 'Только по-английски' }, { uz: 'Aniq tafsilot beradi', ru: 'Даёт точные детали' }, { uz: "Hech qanday farqi yo'q", ru: 'Никакой разницы' }], correct: 2 },
  { q: { uz: "AI natijani birinchi urinishda yoqmasa, to'g'ri yo'l qaysi?", ru: 'Результат AI с первого раза не понравился — правильный путь?' }, opts: [{ uz: 'Tashlab ketish', ru: 'Бросить' }, { uz: "Xafa bo'lish", ru: 'Обидеться' }, { uz: "Qo'lda qayta yozish", ru: 'Переписать руками' }, { uz: "Qayta, aniqroq so'rash (iteratsiya)", ru: 'Попросить снова, точнее (итерация)' }], correct: 3 },
  { q: { uz: '«Iteratsiya» nima?', ru: 'Что такое «итерация»?' }, opts: [{ uz: "Saytni o'chirish", ru: 'Удалить сайт' }, { uz: "Qadam-baqadam qayta so'rab yaxshilash", ru: 'Шаг за шагом улучшать повторными запросами' }, { uz: 'Rasmni kesish', ru: 'Обрезать картинку' }, { uz: 'Domen sotib olish', ru: 'Купить домен' }], correct: 1 },
  { q: { uz: 'Promptdagi «uslub» ingredienti nimani belgilaydi?', ru: 'Что задаёт ингредиент «стиль» в промпте?' }, opts: [{ uz: 'Qanaqa sahifa (mavzu)', ru: 'Какая страница (тема)' }, { uz: 'Asosiy rang', ru: 'Основной цвет' }, { uz: "Sahifa qanday ko'rinishda (zamonaviy/minimal)", ru: 'Как выглядит страница (современно/минимал)' }, { uz: "Qaysi qismlar bo'lishi", ru: 'Какие будут части' }], correct: 2 },
  { q: { uz: 'AI yasagan saytni chiqargach eng muhim qadam?', ru: 'AI выдал сайт — самый важный шаг после?' }, opts: [{ uz: 'Darhol nashr qilish', ru: 'Сразу опубликовать' }, { uz: "Faylni o'chirish", ru: 'Удалить файл' }, { uz: 'Hech nima qilmaslik', ru: 'Ничего не делать' }, { uz: 'Natijani tekshirish (xatosini topish)', ru: 'Проверить результат (найти ошибку)' }], correct: 3 },
  { q: { uz: "Promo-landing sahifada odatda nima bo'ladi?", ru: 'Что обычно есть на промо-лендинге?' }, opts: [{ uz: 'Katta sarlavha, tavsif, tugma, kartalar', ru: 'Большой заголовок, описание, кнопка, карточки' }, { uz: "Faqat bo'sh ekran", ru: 'Только пустой экран' }, { uz: 'Faqat matn fayli', ru: 'Только текстовый файл' }, { uz: 'Excel jadval', ru: 'Таблица Excel' }], correct: 0 },
  { q: { uz: "«Ko'k rangli, zamonaviy o'yin promo — sarlavha, tugma, 3 karta» — bu prompt qanaqa?", ru: '«Синяя современная промо игры — заголовок, кнопка, 3 карточки» — какой это промпт?' }, opts: [{ uz: 'Noaniq', ru: 'Неточный' }, { uz: '4 ingredientli, aniq va yaxshi', ru: 'Из 4 ингредиентов, точный и хороший' }, { uz: 'Juda qisqa va foydasiz', ru: 'Слишком короткий и бесполезный' }, { uz: 'Faqat rang haqida', ru: 'Только про цвет' }], correct: 1 },
  { q: { uz: "Nega AI'ga aniq buyruq berish muhim?", ru: 'Почему важно давать AI точную команду?' }, opts: [{ uz: "AI miyani o'qiy olmaydi — aniq aytsangiz aniq natija", ru: 'AI не читает мысли — скажете точно, получите точный результат' }, { uz: "Aniqlik natijaga ta'sir qilmaydi", ru: 'Точность не влияет на результат' }, { uz: 'AI faqat rasm chizadi', ru: 'AI только рисует картинки' }, { uz: 'Buyruq qancha qisqa, shuncha yaxshi', ru: 'Чем короче команда, тем лучше' }], correct: 0 },
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
          <span key={i} className={`cs-tok ${i % 2 ? 'back' : 'front'}`} style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: `clamp(9px, ${Math.round(s.s * 0.4)}px, ${Math.round(s.s * 0.6)}px)`, '--d': `${s.d}s`, animationDelay: `-${s.dl * 3}s` }}>{tr(s.ch)}</span>
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
    const TOK = ['prompt', 'AI', '.uz', '<h1>', tr({ uz: 'sayt', ru: 'сайт' }), 'deploy', 'CTA', tr({ uz: 'rang', ru: 'цвет' })];
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
          <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{tr(s.ch)}</span>
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
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают 🔥 бонус!' })}</p>
          {solo && isStudent && <p className="qz-sub" style={{ color: '#FFC94D' }}>📖 {tr({ uz: "Mashq rejimi — o'z tezligingizda ishlaysiz, natija faqat sizga ko'rinadi.", ru: 'Режим тренировки — работаете в своём темпе, результат виден только вам.' })}</p>}
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>▶ {tr({ uz: 'Testni boshlash', ru: 'Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">⏳ {tr({ uz: 'Mentor testni boshlashini kuting…', ru: 'Ждите, пока ментор начнёт тест…' })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>▶ {tr({ uz: 'Boshlash', ru: 'Старт' })}</button>}
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Быстрее! ⏱' })}</span>}
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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: "🏁 Natijani ko'rish", ru: '🏁 Посмотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Следующий →' })}</button>}
        </div>
      )}

      {/* ===== YAKUN — PODIUM ===== */}
      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <div className="qz-brand sm"><QzBolt size={48} /><span className="qz-wm">Code<span className="qz-wm-h">Strike</span></span></div>
          <h2 className="qz-h" style={{ fontSize: 'clamp(20px,3.4vw,30px)' }}>{tr({ uz: 'Test yakunlandi! 🎉', ru: 'Тест завершён! 🎉' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? tr({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · лучший стрик 🔥x${soloScore.maxStreak}` }) : ''}</p>
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
                      {b && <span className="qz-pod-pts">{b.pts} ball · {b.ok}/{QUIZ_BANK.length}</span>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ {tr({ uz: 'Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: 'Пройти тест ещё раз — тренировка (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

// PromoBuilder-praktika ekrani (o'z promo saytini qurib nashr qilish) — signal + mentor paneli shu yerdan.
const PRACTICE_AFTER = {
  12: { title: { uz: "O'z promo sahifangiz", ru: 'Ваша промо-страница' }, brief: { uz: "O'quvchilar 4 ingredientli prompt bilan o'z promo saytini qurib, nashr qilishadi (deploy).", ru: 'Ученики собирают промпт из 4 ингредиентов, строят свой промо-сайт и публикуют его (deploy).' } },
};

export default function PracticeLesson2({ lang: langProp, onFinished }) {
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
  const [mentorPractice, setMentorPractice] = useState(null); // jonli mentor praktika paneli
  const startTimeRef = useRef(saved?.startedAt || Date.now());
  // 🏅 Nishonlar (StrictMode-safe: earnedRef + Set)
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
  // 🃏 Flashcard jonli darsda FAQAT MENTORGA ko'rinadi (proyektorda jamoaviy takrorlash); jonli o'quvchidan yashirin.
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });
  // PromoBuilder-praktika tugatildi (o'quvchi o'z saytini nashr qildi): mentorga signal + 🏅 nishon.
  // (plain function — live keyin e'lon qilinadi; faqat chaqirilganda o'qiladi, TDZ yo'q)
  const practiceDone = (fromScreen) => {
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_DONE_BASE + fromScreen, `practice-${fromScreen}`, 0, true, 0);
    earn('builder');
  };
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && _m.scored && _m.scope === 'final' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);
    // 🏅 nishon — FAQAT scored test ekranida, to'g'ri javob bo'lsa (tekin nishon yo'q)
    if (_m && _m.scored && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]);
  };
  const reset = () => { progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); setMentorPractice(null); startTimeRef.current = Date.now(); };
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
  // MENTOR jonli: praktika ekraniga yetganda «kim tugatdi» panelini ochadi (overlay)
  useEffect(() => {
    const entry = PRACTICE_AFTER[screen];
    if (entry && live.mode === 'mentor') setMentorPractice({ ...entry, fromScreen: screen });
    else setMentorPractice(null);
  }, [screen, live.mode]); // eslint-disable-line

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
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
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
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); display: flex; align-items: center; justify-content: center; }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
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

        /* === USTABOT (robot-usta pufakchasi) === */
        .usta-bubble { display: flex; align-items: flex-start; gap: 9px; margin-top: 9px; padding: 10px 13px 10px 11px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 4px 14px 14px 14px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.2); transform-origin: 14px top; animation: usta-in 0.36s cubic-bezier(.34,1.42,.5,1); }
        /* Robot pufakcha — burchakdan (yuz tomonidan) yumshoq pop, engil overshoot; qo'pol emas */
        @keyframes usta-in { 0% { opacity: 0; transform: translateY(7px) scale(0.9); } 62% { opacity: 1; transform: translateY(-1px) scale(1.015); } 100% { opacity: 1; transform: none; } }
        .usta-bubble.usta-warn { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .usta-bubble.usta-sm { margin-top: 6px; padding: 7px 11px 7px 9px; }
        .usta-face { font-size: 20px; line-height: 1.1; flex-shrink: 0; filter: drop-shadow(0 1px 2px rgba(${T.shadowBase},0.25)); animation: usta-face-pop 0.44s cubic-bezier(.34,1.6,.4,1) 0.04s both; }
        /* Robot yuzi bir zumda "gapiradi" — juda kichik pop */
        @keyframes usta-face-pop { 0% { transform: scale(0.5) rotate(-14deg); } 60% { transform: scale(1.14) rotate(5deg); } 100% { transform: scale(1) rotate(0); } }
        .usta-sm .usta-face { font-size: 16px; }
        .usta-say { font-size: 13px; font-weight: 600; color: ${T.ink}; line-height: 1.35; }
        .usta-sm .usta-say { font-size: 12px; font-weight: 500; color: ${T.ink2}; }

        /* === LANDING DRAFT (so'zma-so'z literal render) === */
        /* Chip tanlanganda o'sha qism darhol emas — SILLIQ morflashadi: qiyshiqlik to'g'rilanadi,
           rang/romka/burchak yumshoq oqib o'zgaradi (sakrash yo'q). «Dubl» tuzatishi ham shu orqali oqadi. */
        .lp-live > div, .lp-live h3, .lp-live button, .lp-live span, .lp-live p { transition: background 0.5s ease, background-color 0.5s ease, border-radius 0.45s cubic-bezier(.4,0,.2,1), border-color 0.45s ease, transform 0.48s cubic-bezier(.34,1.15,.4,1), color 0.4s ease; }
        .lp-draft-badge { position: absolute; top: 7px; right: 7px; background: #12121a; color: #c6ff00; font-size: 10px; font-weight: 800; padding: 3px 7px; border-radius: 6px; transform: rotate(4deg); box-shadow: 0 3px 8px -3px rgba(0,0,0,0.4); }
        .lp-draft-empty { display: flex; flex-direction: column; align-items: center; gap: 4px; border: 2.5px dashed ${T.ink3}; border-radius: 8px; padding: 18px 12px; }
        .lp-draft-q { font-size: 30px; font-weight: 800; color: ${T.ink3}; line-height: 1; }
        .lp-draft-emptxt { font-size: 12px; color: ${T.ink3}; font-style: italic; }
        .lp-draft-notes { display: flex; flex-direction: column; gap: 4px; margin-top: 2px; }

        /* === QABUL AKTI (acceptance report) === */
        .accept-akt { background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 13px; padding: 12px 14px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); }
        .accept-akt.akt-happy { border-color: ${T.success}; background: ${T.successSoft}; }
        .akt-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .akt-title { font-family: 'Source Serif 4',serif; font-weight: 600; font-size: 14.5px; color: ${T.ink}; }
        .akt-client { font-size: 22px; line-height: 1; transition: transform 0.2s; }
        /* Mijoz 😕→🤩 bo'lganda kichik xursand pop (aynan qabul akti "happy" holatida) */
        .akt-happy .akt-client { transform: scale(1.15); animation: client-pop 0.5s cubic-bezier(.34,1.55,.4,1); }
        @keyframes client-pop { 0% { transform: scale(0.55) rotate(-14deg); } 55% { transform: scale(1.34) rotate(7deg); } 100% { transform: scale(1.15) rotate(0); } }
        .akt-list { list-style: none; display: flex; flex-direction: column; gap: 5px; }
        .akt-list li { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; }
        .akt-mark { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; font-size: 11px; font-weight: 800; flex-shrink: 0; }
        .akt-ok { color: ${T.ink}; } .akt-ok .akt-mark { background: ${T.successSoft}; color: ${T.success}; }
        .akt-bad { color: ${T.ink2}; } .akt-bad .akt-mark { background: ${T.accentSoft}; color: ${T.accent}; }
        .akt-redo { margin-top: 11px; align-self: flex-start; }

        /* Harakat kamaytirilsa — yangi USTABOT/draft animatsiyalari tinch (faqat oniy fade, morf/pop yo'q) */
        @media (prefers-reduced-motion: reduce) {
          .usta-bubble { animation: acu-fade 0.25s ease both; transform: none; }
          .usta-face { animation: none; }
          .lp-live > div, .lp-live h3, .lp-live button, .lp-live span, .lp-live p { transition: none; }
          .akt-happy .akt-client { animation: none; transform: scale(1.15); }
        }

        /* === LAYOUT === */
        .screen { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
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

        /* === PROMPT-QURUVCHI === */
        .chiprow { display: flex; flex-wrap: wrap; gap: 8px; }
        .promptbox { background: ${T.paper}; border-radius: 12px; padding: 13px 15px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-size: clamp(13px,1.6vw,14.5px); line-height: 2; color: ${T.ink}; }
        .pb-slot { display: inline-flex; align-items: center; background: ${T.accentSoft}; color: ${T.accent}; font-weight: 700; border-radius: 6px; padding: 2px 8px; margin: 0 1px; animation: slot-pop 0.34s cubic-bezier(.34,1.45,.5,1); }
        @keyframes slot-pop { 0% { transform: scale(0.5); opacity: 0; } 55% { transform: scale(1.14); } 100% { transform: scale(1); opacity: 1; } }
        .pb-ph { display: inline-flex; align-items: center; border: 1.5px dashed ${T.ink3}; color: ${T.ink3}; border-radius: 6px; padding: 1px 8px; margin: 0 1px; font-style: italic; }
        .builder-cue { font-family: 'Manrope'; font-weight: 500; font-size: 12px; color: ${T.ink2}; margin: -2px 0 2px; display: flex; align-items: center; gap: 6px; }

        /* === SPEED QUOTE (Screen1 qora karta — yangilangan) === */
        @keyframes quote-in { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes sheen { 0% { background-position: -60% 0; } 100% { background-position: 160% 0; } }
        @keyframes sq-underline { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .speed-quote { position: relative; overflow: hidden; border-radius: 16px; padding: clamp(20px,3.2vw,30px); text-align: center; background: radial-gradient(130% 150% at 50% -10%, #262A33 0%, #15171D 58%, #0B0C10 100%); box-shadow: 0 18px 44px -14px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.07); animation: quote-in 0.5s cubic-bezier(.34,1.2,.4,1); }
        .speed-quote::after { content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.08) 50%, transparent 62%); background-size: 220% 100%; animation: sheen 3.4s ease-in-out 0.7s infinite; pointer-events: none; }
        .speed-quote .sq-eyebrow { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin: 0 0 11px; position: relative; }
        .speed-quote .sq-text { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(18px,3vw,26px); line-height: 1.3; margin: 0; color: #F4F1EA; position: relative; }
        .sq-fast { color: ${T.accent}; font-style: italic; position: relative; text-shadow: 0 0 18px rgba(255,79,40,0.45); }
        .sq-fast::after { content: ''; position: absolute; left: 0; right: 0; bottom: -3px; height: 2px; background: ${T.accent}; border-radius: 2px; transform: scaleX(0); transform-origin: left; animation: sq-underline 0.5s cubic-bezier(.4,0,.2,1) forwards 0.55s; box-shadow: 0 0 10px ${T.accent}; }
        .sq-quality { color: #FFC56B; font-style: italic; text-shadow: 0 0 18px rgba(255,197,107,0.4); }

        /* === NATIJA REVEAL + "QURYAPTI" SKELETON === */
        @keyframes result-reveal { from { opacity: 0; transform: translateY(9px) scale(0.97); } to { opacity: 1; transform: none; } }
        .result-reveal { animation: result-reveal 0.42s cubic-bezier(.34,1.18,.5,1); }
        @keyframes bs-shimmer { 0% { background-position: 180% 0; } 100% { background-position: -180% 0; } }
        .build-skel { display: flex; flex-direction: column; gap: 11px; padding: 10px 2px; }
        .build-skel .bs-bar { height: 13px; border-radius: 7px; background: linear-gradient(90deg, #ECEAE4 25%, #FAF8F3 50%, #ECEAE4 75%); background-size: 200% 100%; animation: bs-shimmer 1.15s ease-in-out infinite; }
        .build-skel .bs-lg { height: 34px; border-radius: 10px; }
        .build-note { text-align: center; font-size: 11.5px; color: ${T.ink3}; margin: 6px 0 0; font-family: 'JetBrains Mono'; letter-spacing: 0.04em; }

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

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

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

        /* backtick chip (fmtCode) — test/arena savol matnidagi kod bo'lagi */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        /* === ✍️ MENTOR PRAKTIKA OVERLAY === */
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
        .fc-tag { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(30px,6vw,46px); letter-spacing: -0.02em; }
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

        /* ===== ⚡ CODESTRIKE — CTA (dars ichida) ===== */
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
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Praktika', ru: 'Практика' }} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onPracticeDone={practiceDone} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
              {mentorPractice && <MentorPracticeOverlay entry={mentorPractice} live={live} onClose={() => { setMentorPractice(null); next(); }} />}
            </>
          )}
        </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>
  );
}
