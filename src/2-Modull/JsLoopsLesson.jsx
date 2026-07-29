import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

// ============================================================
// 10-DARS — JAVASCRIPT: SIKLLAR (for, while) + MASSIVNI AYLANIB CHIQISH — PLATFORM STANDARD v16
// Mavzu: takrorlash (sikl), for sikli (3 qism: boshlanish, shart, qadam),
//        while sikli (shart bajarilguncha), massiv (ro'yxat, indeks 0 dan),
//        massivni aylanib chiqish (sikl + massiv[i] + .length).
// Hook: 30 ta do'stga bir xil xabarni qo'lda yozish — takrorlash dardi.
// AUDIOSIZ versiya — Mentor matni qoladi, TTS yo'q.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
  sun: '#C77A00', sunSoft: '#FBEBC8',
  shadowBase: '58, 53, 48', line: '#E9E6DF'
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
      <button onClick={onClose} style={{ marginTop: 'clamp(22px,4vw,40px)', background: LT.accent, color: '#fff', border: 'none', borderRadius: 14, padding: 'clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)', fontSize: 'clamp(15px,1.8vw,18px)', fontWeight: 700, cursor: 'pointer' }}>{tr({ uz: 'Darsni boshlash', ru: 'Начать урок' })} →</button>
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
      <button onClick={() => { setRole('student'); setMentorCode(''); }} style={link}>← {tr({ uz: 'Orqaga', ru: 'Назад' })}</button>
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
  // Katta PIN ekrani AVTOMATIK ochilmaydi — mentor «📺 Ko'rsatish» tugmasi bilan ochadi.
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
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> 🔓 {tr({ uz: "O'quvchilar erkin qilindi", ru: 'Ученики отпущены в свободный режим' })}</div>;
    return (<>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr({ uz: 'Kod:', ru: 'Код:' })} <b style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr({ uz: "Kodni katta ko'rsatish", ru: 'Показать код крупно' })} style={{ marginLeft: 6, background: LT.ink, color: '#fff', border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>📺 {tr({ uz: "Ko'rsatish", ru: 'Показать' })}</button>
        <button onClick={() => { if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: 'Отпустить учеников? Дальше они продолжат самостоятельно.' }))) live.endSession(); }} style={{ background: LT.accentSoft, color: LT.accent, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>🔓 {tr({ uz: 'Erkin qilish', ru: 'Отпустить' })}</button>
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
const MentorCtx = createContext(null);
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun

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

// `matn` ichidagi kod-atamalarni .qcode chipga o'raydi (savol/variant/izohlar uchun)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

const LESSON_META = { lessonId: 'js-loops-01-v18', lessonTitle: { uz: 'JavaScript — Sikllar (for, while)', ru: 'JavaScript — Циклы (for, while)' } };
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

// ===== KO'P TANLOVLI TEST (audiosiz) =====

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
// RECAPS kontenti — inline MC testlar (s4, s5b, s9, s12) uchun «Qayta tushuntirish» modali
const RECAPS = {
  // s4 — "for siklida 'i++' nima vazifani bajaradi?" (to'g'ri: Har aylanishdan keyin i ni 1 ga oshiradi — qadam)
  4: {
    title: { uz: "i++ — sikl qadami", ru: 'i++ — шаг цикла' },
    cards: [
      {
        ic: "👣",
        h: { uz: "i++ — bu bir qadam oldinga", ru: 'i++ — это один шаг вперёд' },
        body: { uz: <>for siklining oxiridagi <b>i++</b> — bu <b>qadam</b>. Har aylanishdan so'ng u <b>i ni 1 ga oshiradi</b>. Xuddi konveyer har aylanishda bir quti oldinga surilgandek.</>, ru: <>В конце цикла for стоит <b>i++</b> — это <b>шаг</b>. После каждой итерации он <b>увеличивает i на 1</b>. Как конвейер, который за каждый оборот продвигает коробку вперёд.</> },
        vis: <RcFlow items={["i = 0", "i++", "i = 1", "i++", "i = 2"]} />,
        ask: { uz: "Konveyer bir marta aylansa, sanagich nechtaga oshadi?", ru: 'Если конвейер сделает один оборот, на сколько вырастет счётчик?' }
      },
      {
        ic: "🔁",
        h: { uz: "For siklining 3 qismi", ru: 'Три части цикла for' },
        body: { uz: <>for da uch qism bor: <b>boshlanish</b> (i = 0), <b>shart</b> (i qachongacha?) va <b>qadam</b> (i++). i++ aynan uchinchisi — sanoqni oldinga suradi, shu tufayli sikl bir kun to'xtaydi.</>, ru: <>У for три части: <b>старт</b> (i = 0), <b>условие</b> (до какого i?) и <b>шаг</b> (i++). i++ — именно третья: она двигает счёт вперёд, поэтому цикл однажды остановится.</> },
        vis: <RcFlow items={[{ uz: "boshlanish", ru: 'старт' }, { uz: "shart", ru: 'условие' }, { uz: "qadam i++", ru: 'шаг i++' }]} sep="·" />
      },
      {
        ic: "⏭️",
        h: { uz: "To'xtatmaydi, oshiradi", ru: 'Не останавливает, а увеличивает' },
        body: { uz: <>i++ siklni <b>to'xtatmaydi</b> va massiv ham yaratmaydi — u faqat <b>i ni bittaga oshiradi</b>. Agar i++ bo'lmasa, i o'zgarmay qolib, sikl <b>cheksiz</b> aylanaverardi.</>, ru: <>i++ цикл <b>не останавливает</b> и массив не создаёт — он лишь <b>увеличивает i на единицу</b>. Без i++ значение i не менялось бы, и цикл крутился бы <b>бесконечно</b>.</> }
      }
    ]
  },

  // s5b — "for (let i = 1; i <= 3; i++) console.log(i) — qaysi sonlar chiqadi?" (to'g'ri: 1, 2, 3)
  6: {
    title: { uz: "1, 2, 3 chiqadi", ru: 'Выведется 1, 2, 3' },
    cards: [
      {
        ic: "🔢",
        h: { uz: "i ni birma-bir sanaymiz", ru: 'Считаем i по одному' },
        body: { uz: <>i <b>1</b> dan boshlanadi, har qadamda <b>1 ga oshadi</b> va <b>i &lt;= 3</b> to'g'ri turgan ekan aylanaveradi. Shuning uchun konsolga <b>1, 2, 3</b> chiqadi.</>, ru: <>i начинается с <b>1</b>, на каждом шаге <b>растёт на 1</b> и крутится, пока <b>i &lt;= 3</b> истинно. Поэтому в консоль выйдут <b>1, 2, 3</b>.</> },
        vis: <RcFlow items={["1", "2", "3"]} />,
        ask: { uz: "i = 4 bo'lganda i <= 3 sharti rostmi? Sikl davom etadimi?", ru: 'При i = 4 условие i <= 3 истинно? Цикл продолжится?' }
      },
      {
        ic: "🛑",
        h: { uz: "3 da to'xtaydi, 4 chiqmaydi", ru: 'На 3 остановится, 4 не выйдет' },
        body: { uz: <>i = 3 da <b>3 &lt;= 3</b> hali rost — 3 chiqadi. Keyin i = 4 bo'ladi va <b>4 &lt;= 3</b> yolg'on — sikl to'xtaydi. Shu bois <b>4 chiqmaydi</b>. Belgi <b>&lt;=</b> bo'lgani uchun 3 ham qamraladi.</>, ru: <>При i = 3 условие <b>3 &lt;= 3</b> ещё истинно — 3 печатается. Потом i = 4, а <b>4 &lt;= 3</b> уже ложь — цикл останавливается. Поэтому <b>4 не выводится</b>. Благодаря знаку <b>&lt;=</b> тройка тоже попадает.</> },
        vis: <RcFlow items={[{ uz: "3 <= 3 rost", ru: '3 <= 3 истина' }, { uz: "chop: 3", ru: 'печать: 3' }, { uz: "4 <= 3 yolg'on", ru: '4 <= 3 ложь' }, "stop"]} />
      },
      {
        ic: "🧭",
        h: { uz: "Teskari emas — oldinga", ru: 'Не назад — вперёд' },
        body: { uz: <>Sonlar <b>1 dan 3 ga qarab</b> oshib boradi (i++ oshiradi), shu bois javob <b>3, 2, 1</b> emas. Boshlanish nuqtasi (1) va qadam yo'nalishi (oshirish) tartibni belgilaydi.</>, ru: <>Числа растут <b>от 1 к 3</b> (i++ увеличивает), поэтому ответ не <b>3, 2, 1</b>. Стартовая точка (1) и направление шага (вверх) задают порядок.</> }
      }
    ]
  },

  // s9 — "mevalar = ['olma','banan','uzum']. mevalar[0] nima?" (to'g'ri: "olma")
  10: {
    title: { uz: "Sanoq 0 dan boshlanadi", ru: 'Счёт начинается с 0' },
    cards: [
      {
        ic: "🍎",
        h: { uz: "[0] — birinchi element", ru: '[0] — первый элемент' },
        body: { uz: <>Massivda sanoq <b>1 dan emas, 0 dan</b> boshlanadi. Shuning uchun <b>mevalar[0]</b> — bu <b>birinchi</b> meva, ya'ni <b>"olma"</b>. Banan esa mevalar[1].</>, ru: <>В массиве счёт начинается <b>не с 1, а с 0</b>. Поэтому <b>mevalar[0]</b> — это <b>первый</b> фрукт, то есть <b>"olma"</b>. А банан — mevalar[1].</> },
        vis: <RcFlow items={["[0] olma", "[1] banan", "[2] uzum"]} sep="·" />,
        ask: { uz: "Unda \"uzum\" ni chaqirish uchun qaysi indeksni yozamiz?", ru: 'А какой индекс напишем, чтобы получить "uzum"?' }
      },
      {
        ic: "🏢",
        h: { uz: "Kundalik misol — qavat 0", ru: 'Пример из жизни — этаж 0' },
        body: { uz: <>Ba'zi liftlarda birinchi qavat <b>0</b> deb belgilanadi. Massiv ham xuddi shunday: <b>0-o'rin = birinchisi</b>. Indeks — bu qutining tartib raqami, u nolabosh.</>, ru: <>В некоторых лифтах первый этаж обозначен как <b>0</b>. Массив устроен так же: <b>место 0 = первое</b>. Индекс — это номер коробки, и он начинается с нуля.</> },
        vis: <RcFlow items={[{ uz: "0 = 1-o'rin", ru: '0 = 1-е место' }, { uz: "1 = 2-o'rin", ru: '1 = 2-е место' }]} sep="·" />
      },
      {
        ic: "⚠️",
        h: { uz: "Oxirgisi length dan 1 kam", ru: 'Последний на 1 меньше length' },
        body: { uz: <>3 ta meva bo'lsa, indekslar <b>0, 1, 2</b> — oxirgisi <b>uzum = [2]</b>, [3] esa yo'q. Ya'ni oxirgi indeks har doim <b>uzunlikdan bitta kam</b> bo'ladi.</>, ru: <>Если фруктов 3, индексы — <b>0, 1, 2</b>: последний <b>uzum = [2]</b>, а [3] не существует. То есть последний индекс всегда <b>на единицу меньше длины</b>.</> }
      }
    ]
  },

  // s12 — "5 ta nom bor massiv. for (i=0; i<dostlar.length; i++) necha marta ishlaydi?" (to'g'ri: 5 marta)
  13: {
    title: { uz: ".length — necha marta?", ru: '.length — сколько раз?' },
    cards: [
      {
        ic: "🔁",
        h: { uz: "Har element uchun bir marta", ru: 'По разу на каждый элемент' },
        body: { uz: <>Sikl massivning <b>har bir elementi</b> uchun bir marta aylanadi. 5 ta nom bo'lsa — sikl <b>5 marta</b> ishlaydi. <b>dostlar.length</b> esa aynan «5» ni beradi.</>, ru: <>Цикл делает по одной итерации <b>на каждый элемент</b> массива. Если имён 5 — цикл сработает <b>5 раз</b>. А <b>dostlar.length</b> как раз даёт «5».</> },
        vis: <RcFlow items={["i=0", "i=1", "i=2", "i=3", "i=4"]} />,
        ask: { uz: "5 ta do'stga xabar yuborsangiz, «yubor» tugmasini necha marta bosasiz?", ru: 'Если отправить сообщение 5 друзьям, сколько раз нажмёте «отправить»?' }
      },
      {
        ic: "📏",
        h: { uz: ".length — elementlar soni", ru: '.length — число элементов' },
        body: { uz: <><b>.length</b> massivda nechta element borligini aytadi. i <b>0 dan boshlanib</b>, i &lt; 5 to'g'ri turganicha yuradi: 0, 1, 2, 3, 4 — bu <b>rosa 5 ta</b> qadam.</>, ru: <><b>.length</b> говорит, сколько элементов в массиве. i идёт <b>с 0</b>, пока i &lt; 5 истинно: 0, 1, 2, 3, 4 — это <b>ровно 5</b> шагов.</> },
        vis: <RcFlow items={["0,1,2,3,4", { uz: "5 ta qadam", ru: '5 шагов' }]} sep="·" />
      },
      {
        ic: "🎯",
        h: { uz: "Nega 4 emas, 6 emas?", ru: 'Почему не 4 и не 6?' },
        body: { uz: <>Sanoq 0 dan boshlangani uchun 0..4 — 5 ta qadamni beradi (4 emas). <b>i &lt; length</b> belgisi (kichik, teng emas) 5-indeksga o'tkazmaydi, shu bois <b>6 marta ham emas</b>.</>, ru: <>Счёт начинается с 0, поэтому 0..4 — это 5 шагов (а не 4). Знак <b>i &lt; length</b> (строго меньше) не пускает к индексу 5, поэтому и <b>не 6 раз</b>.</> }
      }
    ]
  }
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
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← {tr({ uz: 'Oldingi', ru: 'Предыдущая' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
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
  // «To'g'ri» sanog'ini ustunlar bilan BIR XIL mantiqdan olamiz (picked === correctIdx),
  // eskirgan a.correct'da hisoblasak sanoq ustunlarga zid chiqadi (S2 saboq)
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
        <p className="mstats-hidden">🙈 {tr({ uz: "Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: 'Кто что выбрал и число ✅/❌ скрыто — по кнопке «Открыть результат» всё появится одновременно и у вас, и на экранах учеников.' })}</p>
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
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? tr({ uz: `${n} o'quvchi · ${pct}%`, ru: `${n} уч. · ${pct}%` }) : '—'}</span>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — тема осталась непонятной классу. Перед продолжением рекомендуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
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
      {reveal && struggling && <p className="mstats-warn">⚠️ {tr({ uz: "Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: 'Большинство ошиблись — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз.' })}</p>}
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
      {doneN === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar yozib tugatishi bilan shu yerda ✓ belgisi chiqadi…", ru: 'Как только ученики закончат, здесь появится значок ✓…' })}</p>}
    </div>
  );
}

// AUDIOSIZ stub: bu faylda audio-dvijok yo'q edi, lekin QuestionScreen useAudio/getAudioEngine'ni
// chaqiradi (eskidan qolgan ReferenceError). No-op stub — xatti-harakat o'zgarmaydi, crash yo'qoladi.
const getAudioEngine = () => null;
function useAudio() { return { isPlaying: false, currentSegment: null, waitingFor: null, muted: true, triggerEvent: () => {}, replay: () => {}, toggleMute: () => {}, stop: () => {} }; }

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

// ===== MENTOR (matn, audiosiz) =====
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';
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

// Terminal (console.log natijasi)
const Terminal = ({ lines, empty = { uz: '// natija shu yerda chiqadi…', ru: '// результат появится здесь…' }, title = 'console' }) => (
  <div className="term">
    <div className="term-bar"><span className="term-dot" style={{ background: '#FF5F56' }} /><span className="term-dot" style={{ background: '#FFBD2E' }} /><span className="term-dot" style={{ background: '#27C93F' }} /><span className="term-title">{tr(title)}</span></div>
    <div className="term-body">
      {lines.length === 0 ? <p className="term-empty">{tr(empty)}</p> : lines.map((l, i) => (
        <div key={i} className="term-line"><span className="term-arrow">›</span><span>{l}</span></div>
      ))}
    </div>
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

// ===== 🏭 SIKL ZAVODI — qayta ishlatiladigan konveyer mashina (skelet) =====
// Boshqariladigan (controlled) prezentatsion komponent: `count` — hozirgi i, ota-komponent
// sikl vaqtini boshqaradi. 3 rangli dastak = for'ning 3 qismi; markazda i-tablo (odometr);
// har aylanishda 1 quti pastdagi yashikka tushadi. cheksiz=true → qutilar toshib qizaradi.
// whileMode → «Shart» dastagi «Datchik»ga aylanadi. load → massiv-yuk (quti yorliqlari).
// HARAKAT SIFATI (quti tushishi, dastak tortilishi, silliqlik) — ✨ Animatsiya roli.
const SiklZavodi = ({ count = 0, max = 5, init = 'i = 1', cond = 'i <= 5', step = 'i++', load = null, cheksiz = false, whileMode = false, done = false, onStep, onAuto, manual = false, compact = false }) => {
  const n = Math.max(0, count);
  const zeroBased = /=\s*0/.test(init);
  const boxes = Array.from({ length: n }, (_, k) => (load ? (load[k] ?? '?') : (zeroBased ? k : k + 1)));
  const overflow = cheksiz && n >= max + 3;
  return (
    <div className={`zavod ${overflow ? 'zavod-cheksiz' : ''} ${done && !cheksiz ? 'zavod-done' : ''} ${compact ? 'zavod-sm' : ''}`}>
      <div className="zavod-levers">
        <div className="zv-lever zv-init"><span className="zv-lbl">{tr({ uz: 'Boshlanish', ru: 'Старт' })}</span><span className="zv-code">{init}</span></div>
        <div className="zv-lever zv-cond"><span className="zv-lbl">{whileMode ? tr({ uz: 'Datchik', ru: 'Датчик' }) : tr({ uz: 'Shart', ru: 'Условие' })}</span><span className="zv-code">{cond}</span></div>
        <div className="zv-lever zv-step"><span className="zv-lbl">{tr({ uz: 'Qadam', ru: 'Шаг' })}</span><span className="zv-code">{step}</span></div>
      </div>
      <div className="zavod-body">
        <div className="zavod-tablo">
          <span className="zv-tablo-lbl">i</span>
          <span className="zv-tablo-num" key={n}>{n || '·'}</span>
        </div>
        <div className="zavod-belt" aria-hidden="true">
          <span className="zv-belt-arrow">›</span><span className="zv-belt-arrow">›</span><span className="zv-belt-arrow">›</span>
        </div>
        {manual && (
          <div className="zavod-controls">
            {onStep && <button className="btn-soft" onClick={onStep} disabled={done || overflow}>🔧 {tr({ uz: 'Bir marta aylantirish', ru: 'Прокрутить один раз' })}</button>}
            {onAuto && <button className="zv-start" onClick={onAuto} disabled={done || overflow}>⚡ {tr({ uz: 'AUTO — hammasini', ru: 'AUTO — всё сразу' })}</button>}
          </div>
        )}
      </div>
      <div className="zavod-bin">
        {boxes.length === 0
          ? <span className="zv-bin-empty">{tr({ uz: "// yashik hali bo'sh", ru: '// ящик пока пуст' })}</span>
          : boxes.map((b, k) => <span key={k} className="zv-box" style={{ animationDelay: `${Math.min(k * 0.025, 0.32)}s` }}>{load ? '🎁' : '📦'}<b>{String(b)}</b></span>)}
      </div>
      {overflow
        ? <div className="zavod-alert">⚠️ {tr({ uz: "CHEKSIZ! — qadam shartga yaqinlashmayapti, mashina to'xtamayapti", ru: 'БЕСКОНЕЧНО! — шаг не приближает к условию, машина не останавливается' })}</div>
        : done && <div className="zavod-ding">🔔 {tr({ uz: "Tayyor! — shart buzildi, sikl to'xtadi", ru: 'Готово! — условие нарушилось, цикл остановился' })}</div>}
    </div>
  );
};

// ===== SCREEN 0 — HOOK (takrorlash dardi) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const NEED = 30;
  const [count, setCount] = useState(0);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const OPTS = [
    { id: 'a', label: { uz: "Bittalab — 1000 marta qo'lda yozaman", ru: 'По одному — напишу вручную 1000 раз' } },
    { id: 'b', label: { uz: "Sikl bilan — bir marta yozib, takrorlataman", ru: 'Циклом — напишу один раз и заставлю повторять' } },
    { id: 'c', label: { uz: "Umuman yozmayman", ru: 'Вообще не буду писать' } }
  ];
  const write = () => setCount(c => Math.min(c + 1, NEED));
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 780 }}>{tr({ uz: <>30 ta do'stingizga bir xil xabarni <span className="italic" style={{ color: T.accent }}>bittalab</span> yozasizmi?</>, ru: <>Будете писать 30 друзьям одно и то же <span className="italic" style={{ color: T.accent }}>по одному</span>?</> })}</h1>
        <Mentor>{tr({ uz: <>Tasavvur qiling: bayramda 30 ta sinfdoshingizga <b style={{ color: T.ink }}>"Bayram muborak!"</b> deb yozmoqchisiz. Bittalab yozsangiz — qo'lingiz charchaydi. Tugmani bir necha marta bosing-chi, qancha zerikarli ekanini his qiling.</>, ru: <>Представьте: на праздник вы хотите написать 30 одноклассникам <b style={{ color: T.ink }}>«С праздником!»</b>. Писать по одному — рука устанет. Понажимайте кнопку несколько раз и почувствуйте, насколько это скучно.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Qo'lda yuborilgan xabarlar", ru: 'Сообщения, отправленные вручную' })}</p>
            <div className="msg-list fade-up delay-1">
              {count === 0 ? (
                <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{tr({ uz: '// hali bittasi ham yuborilmadi', ru: '// пока не отправлено ни одного' })}</p>
              ) : Array.from({ length: count }).map((_, i) => (
                <div key={i} className="msg-line el-in"><span className="msg-ok">✅</span><span>{tr({ uz: `Do'st #${i + 1} — "Bayram muborak!"`, ru: `Друг #${i + 1} — «С праздником!»` })}</span></div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button className={`btn ${count >= 20 ? 'btn-tired' : ''}`} onClick={write} disabled={count >= NEED} style={{ alignSelf: 'flex-start' }}>{count >= NEED ? tr({ uz: '😮‍💨 Charchadim…', ru: '😮‍💨 Я устал…' }) : tr({ uz: '✍️ Yana bittasini yozish', ru: '✍️ Написать ещё одно' })}</button>
              <span className="mono small" style={{ color: T.ink3 }}>{count} / {NEED}</span>
            </div>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'Charchoq darajasi', ru: 'Уровень усталости' })} <span className="face-pop" key={count === 0 ? 0 : count < 12 ? 1 : count < 21 ? 2 : count < 30 ? 3 : 4} style={{ fontSize: 15 }}>{count < 12 ? '🙂' : count < 21 ? '😐' : count < 30 ? '😓' : '😮‍💨'}</span></span>
                <span className="mono small" style={{ color: count < NEED * 0.5 ? T.success : count < NEED * 0.8 ? '#C77800' : T.accent }}>{Math.round((count / NEED) * 100)}%</span>
              </div>
              <div className="fatigue"><div className="fatigue-bar" style={{ width: `${(count / NEED) * 100}%`, color: count < NEED * 0.5 ? T.success : count < NEED * 0.8 ? '#E6A100' : T.accent, background: count < NEED * 0.5 ? T.success : count < NEED * 0.8 ? '#E6A100' : T.accent }} /></div>
            </div>
            {count >= 5 && count < NEED && <p className="hook-ack fade-step">{tr({ uz: <>Hali <b>{NEED - count} ta</b> qoldi… va bu atigi 30 ta. 1000 ta bo'lsa-chi? 😅</>, ru: <>Осталось ещё <b>{NEED - count}</b>… и это всего 30. А если 1000? 😅</> })}</p>}
            <div className="fade-up delay-2"><SiklZavodi count={count} max={NEED} init="i = 1" cond={`i <= ${NEED}`} step="i++" load={Array.from({ length: NEED }, (_, k) => k + 1)} manual onAuto={() => setCount(NEED)} done={count >= NEED} compact /></div>
            {count >= NEED && <p className="hook-ack fade-step">{tr({ uz: <>⚡ Bir zarbada 30 tasi tayyor! Mana <b>sikl</b> — mehnatni kompyuterga o'tkazadi.</>, ru: <>⚡ Одним махом готовы все 30! Вот что такое <b>цикл</b> — он перекладывает труд на компьютер.</> })}</p>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Dasturchi 1000 ta xabarni qanday yozadi?', ru: 'Как программист напишет 1000 сообщений?' })}</p>
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
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>To'g'ri yo'l — <b>sikl</b>! Bir marta yozasiz, kompyuter uni 1000 marta takrorlaydi. Bugun shuni o'rganamiz.</>, ru: <>Верный путь — <b>цикл</b>! Вы пишете один раз, а компьютер повторит 1000 раз. Этому сегодня и научимся.</> })}</p>}
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
    { text: { uz: 'Sikl nima? — takrorlash', ru: 'Что такое цикл? — повторение' }, tag: '' },
    { text: { uz: 'for sikli — 3 qism', ru: 'Цикл for — 3 части' }, tag: { uz: 'boshlanish · shart · qadam', ru: 'старт · условие · шаг' } },
    { text: { uz: 'while sikli — shart bajarilguncha', ru: 'Цикл while — пока верно условие' }, tag: '' },
    { text: { uz: "Massiv — qiymatlar ro'yxati", ru: 'Массив — список значений' }, tag: '[0], [1], [2]' },
    { text: { uz: 'Massivni aylanib chiqish — sikl + massiv', ru: 'Обход массива — цикл + массив' }, tag: '' }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 2 katta vosita', ru: 'Два больших инструмента дня' })}</p>
      <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="frame" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
          <span className="ic-spin" style={{ fontSize: 32 }}>🔁</span>
          <div><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, color: T.ink, margin: 0, fontSize: 'clamp(16px,2.2vw,19px)' }}>{tr({ uz: 'SIKL', ru: 'ЦИКЛ' })}</p><p className="body" style={{ margin: '2px 0 0', color: T.ink2 }}>{tr({ uz: "Bir amalni ko'p marta takrorlaydi (for, while)", ru: 'Повторяет действие много раз (for, while)' })}</p></div>
        </div>
        <div className="frame" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
          <span className="ic-float" style={{ fontSize: 32 }}>📚</span>
          <div style={{ flex: 1 }}><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, color: T.ink, margin: 0, fontSize: 'clamp(16px,2.2vw,19px)' }}>{tr({ uz: 'MASSIV', ru: 'МАССИВ' })}</p><p className="body" style={{ margin: '2px 0 0', color: T.ink2 }}>{tr({ uz: "Bitta o'zgaruvchida qiymatlar ro'yxati", ru: 'Список значений в одной переменной' })}</p>
            <div className="mini-arr">{[0, 1, 2].map(i => <span key={i} className="mini-cell" style={{ animationDelay: `${i * 0.45}s` }}>{i}</span>)}</div>
          </div>
        </div>
      </div>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>→ {tr({ uz: 'ikkalasini birga ishlatsak — haqiqiy kuch!', ru: 'вместе они — настоящая сила!' })}</p>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: '5 qadam', ru: '5 шагов' })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span>{s.tag && <span className="step-tag">{tr(s.tag)}</span>}</span></li>))}
      </ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Dangasa</span> dasturchi bo'lishni o'rganamiz!</>, ru: <>Учимся быть <span className="italic" style={{ color: T.accent }}>ленивым</span> программистом!</> })}</h2>
        </div>
        <Mentor>{tr({ uz: <>Yaxshi dasturchi <b style={{ color: T.ink }}>takrorlashni yoqtirmaydi</b>. Bir ishni 100 marta yozish o'rniga, u <b style={{ color: T.ink }}>siklga</b> "100 marta takrorla" deydi. Bugun ikkita vositani ochamiz — <b style={{ color: T.ink }}>sikl</b> va <b style={{ color: T.ink }}>massiv</b> — 5 ta qadamda.</>, ru: <>Хороший программист <b style={{ color: T.ink }}>не любит повторяться</b>. Вместо того чтобы писать одно и то же 100 раз, он говорит <b style={{ color: T.ink }}>циклу</b>: «повтори 100 раз». Сегодня откроем два инструмента — <b style={{ color: T.ink }}>цикл</b> и <b style={{ color: T.ink }}>массив</b> — за 5 шагов.</> })}</Mentor>
        {!isNarrow ? (
          <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable>
        ) : !showSteps ? (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>📋 {tr({ uz: "Bugungi 5 qadamni ko'rish", ru: 'Посмотреть 5 шагов урока' })}</button>
          </div>
        ) : (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>↩ {tr({ uz: "Vositalarni ko'rish", ru: 'Посмотреть инструменты' })}</button>
            {StepsBlock}
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — SIKL NIMA (siklsiz vs sikl bilan) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [mode, setMode] = useState('manual');
  const [seen, setSeen] = useState(new Set(['manual']));
  const done = seen.size >= 2;
  const set = (m) => { setMode(m); setSeen(prev => { const n = new Set(prev); n.add(m); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Sikl nima', ru: 'Что такое цикл' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Ikkala usulni ko'ring", ru: 'Посмотрите оба способа' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta ishni <span className="italic" style={{ color: T.accent }}>5 marta</span> — qanday yozamiz?</>, ru: <>Одно действие <span className="italic" style={{ color: T.accent }}>5 раз</span> — как это написать?</> })}</h2></div>
        <Mentor>{tr({ uz: <>"Salom" so'zini 5 marta chop etmoqchimiz. <b style={{ color: T.ink }}>Siklsiz</b> — har birini alohida yozasiz (5 qator). <b style={{ color: T.ink }}>Sikl bilan</b> — bir marta yozib, "5 marta takrorla" deysiz. Ikkala tugmani bosib solishtiring.</>, ru: <>Хотим напечатать слово «Salom» 5 раз. <b style={{ color: T.ink }}>Без цикла</b> — пишете каждое отдельно (5 строк). <b style={{ color: T.ink }}>С циклом</b> — пишете один раз и говорите «повтори 5 раз». Нажмите обе кнопки и сравните.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${mode === 'manual' ? 'chip-on' : ''}`} onClick={() => set('manual')}>😕 {tr({ uz: 'Siklsiz', ru: 'Без цикла' })}</button>
              <button className={`chip ${mode === 'loop' ? 'chip-on' : ''}`} onClick={() => set('loop')}>🔁 {tr({ uz: 'Sikl bilan', ru: 'С циклом' })}</button>
            </div>
            <div className="codebox demo-swap" key={mode}>
              {mode === 'manual' ? (
                <>
                  <div><FN>console</FN>.<FN>log</FN>(<STR>{tr({ uz: '"Salom"', ru: '"Привет"' })}</STR>)</div>
                  <div><FN>console</FN>.<FN>log</FN>(<STR>{tr({ uz: '"Salom"', ru: '"Привет"' })}</STR>)</div>
                  <div><FN>console</FN>.<FN>log</FN>(<STR>{tr({ uz: '"Salom"', ru: '"Привет"' })}</STR>)</div>
                  <div><FN>console</FN>.<FN>log</FN>(<STR>{tr({ uz: '"Salom"', ru: '"Привет"' })}</STR>)</div>
                  <div><FN>console</FN>.<FN>log</FN>(<STR>{tr({ uz: '"Salom"', ru: '"Привет"' })}</STR>)</div>
                  <div><CM>{tr({ uz: "// 5 qator… 100 marta bo'lsa-chi?", ru: '// 5 строк… а если надо 100 раз?' })}</CM></div>
                </>
              ) : (
                <>
                  <div><KW>for</KW> (<KW>let</KW> i = <NUM>1</NUM>; i &lt;= <NUM>5</NUM>; i++) {'{'}</div>
                  <div style={{ paddingLeft: 18 }}><FN>console</FN>.<FN>log</FN>(<STR>{tr({ uz: '"Salom"', ru: '"Привет"' })}</STR>)</div>
                  <div>{'}'}</div>
                  <div><CM>{tr({ uz: '// 1 qator → 5 marta. 100 marta ham shu!', ru: '// 1 строка → 5 раз. И для 100 — та же!' })}</CM></div>
                </>
              )}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija (ikkalasida bir xil)', ru: 'Результат (одинаковый в обоих)' })}</p>
            <Terminal lines={Array.from({ length: 5 }, () => tr({ uz: 'Salom', ru: 'Привет' }))} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Natija aynan bir xil! Lekin <b>sikl</b> bilan kod qisqa, o'zgartirishi oson. Mana shuning uchun sikl kerak.</>, ru: <>✓ Результат абсолютно одинаковый! Но с <b>циклом</b> код короче и его легко менять. Вот зачем нужен цикл.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — for ANATOMIYASI =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const N = 5;
  const [out, setOut] = useState(storedAnswer ? Array.from({ length: N }, (_, i) => i + 1) : []);
  const [iVal, setIVal] = useState(storedAnswer ? N : 0);
  const [running, setRunning] = useState(false);
  const [part, setPart] = useState(null);
  const timer = useRef(null);
  const done = out.length >= N;
  const PARTS = {
    init: { color: T.blue, num: '1', name: { uz: 'Boshlanish', ru: 'Старт' }, code: 'let i = 1', stair: { uz: 'Konveyer qaysi sondan boshlaydi', ru: 'С какого числа конвейер стартует' }, desc: { uz: 'Sanagich qaysi sondan boshlanadi. Bu yerda i = 1 — birinchi quti.', ru: 'С какого числа начинается счётчик. Здесь i = 1 — первая коробка.' } },
    cond: { color: T.sun, num: '2', name: { uz: 'Shart', ru: 'Условие' }, code: 'i <= 5', stair: { uz: 'Konveyer qachongacha aylanadi', ru: 'До каких пор конвейер крутится' }, desc: { uz: "Qachongacha davom etadi. i 5 dan oshmaguncha sikl ishlaydi; shart buzilsa — to'xtaydi.", ru: 'Пока цикл продолжается: он работает, пока i не превысит 5; условие нарушилось — стоп.' } },
    step: { color: T.success, num: '3', name: { uz: 'Qadam', ru: 'Шаг' }, code: 'i++', stair: { uz: 'Har aylanishda sanagich qancha oshadi', ru: 'На сколько счётчик растёт за оборот' }, desc: { uz: "Har aylanishdan keyin i qanday o'zgaradi. i++ — i ga +1 (bir quti oldinga).", ru: 'Как меняется i после каждой итерации. i++ — это +1 к i (одна коробка вперёд).' } }
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current); setOut([]); setIVal(0); setRunning(true);
    const tick = (i) => {
      setIVal(i); setOut(prev => [...prev, i]);
      if (i < N) timer.current = setTimeout(() => tick(i + 1), 620);
      else setRunning(false);
    };
    timer.current = setTimeout(() => tick(1), 350);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'for sikli', ru: 'Цикл for' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval ishga tushiring', ru: 'Сначала запустите' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kompyuter 1 dan 5 gacha <span className="italic" style={{ color: T.accent }}>qanday</span> ko'tariladi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> компьютер поднимается от 1 до 5?</> })}</h2></div>
        <Mentor>{tr({ uz: <>for — bu uch dastakli konveyer: <b style={{ color: T.blue }}>qaysi sondan boshlansin</b>, <b style={{ color: T.sun }}>qachongacha aylansin</b>, va <b style={{ color: T.success }}>har safar sanagich qancha oshsin</b>. Mana shu 3 sozlama qavs ichida turadi. Rangli qismlarni <b style={{ color: T.ink }}>bosib</b> bilib oling, so'ng "Ishga tushir"ni bosing.</>, ru: <>for — конвейер с тремя рычагами: <b style={{ color: T.blue }}>с какого числа начать</b>, <b style={{ color: T.sun }}>до каких пор крутиться</b> и <b style={{ color: T.success }}>на сколько увеличивать счётчик</b>. Эти 3 настройки стоят в скобках. <b style={{ color: T.ink }}>Нажмите</b> на цветные части, чтобы разобраться, а потом — «Запустить».</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="codebox fade-up delay-1" style={{ fontSize: 'clamp(13px,1.8vw,15px)' }}>
              <div>
                <KW>for</KW> (
                <span className="for-pt for-init" onClick={() => setPart('init')} style={{ cursor: 'pointer', outline: part === 'init' ? `2px solid ${T.blue}` : 'none' }}>let i = 1</span>;{' '}
                <span className="for-pt for-cond" onClick={() => setPart('cond')} style={{ cursor: 'pointer', outline: part === 'cond' ? `2px solid ${T.sun}` : 'none' }}>i &lt;= 5</span>;{' '}
                <span className="for-pt for-step" onClick={() => setPart('step')} style={{ cursor: 'pointer', outline: part === 'step' ? `2px solid ${T.success}` : 'none' }}>i++</span>) {'{'}
              </div>
              <div style={{ paddingLeft: 18 }}><FN>console</FN>.<FN>log</FN>(<STR>{tr({ uz: '"Salom"', ru: '"Привет"' })}</STR>, i)</div>
              <div>{'}'}</div>
            </div>
            {part ? (
              <div className="sk-info fade-step" key={part}>
                <span className="sk-tagbig"><span className="lg-dot" style={{ background: PARTS[part].color, width: 14, height: 14 }} /><span className="sk-wordbadge" style={{ color: PARTS[part].color, background: PARTS[part].color + '22' }}>{PARTS[part].num}. {tr(PARTS[part].name)}</span><span className="mono" style={{ color: T.ink2 }}>{PARTS[part].code}</span></span>
                <p className="body" style={{ color: T.ink, margin: '10px 0 0' }}>⚙️ <b>{tr(PARTS[part].stair)}.</b> {tr(PARTS[part].desc)}</p>
              </div>
            ) : (
              <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>👆 {tr({ uz: 'Koddagi 3 ta rangli qismni bosing', ru: 'Нажмите на 3 цветные части кода' })}</p></div>
            )}
          </Col>
          <Col>
            <div className="fade-up delay-1"><SiklZavodi count={iVal} max={N} init="i = 1" cond="i <= 5" step="i++" done={done} /></div>
            <Terminal lines={out.map(v => `${tr({ uz: 'Salom', ru: 'Привет' })} ${v}`)} empty={{ uz: '// ▶ ishga tushiring', ru: '// ▶ запустите' }} />
            <button className="btn" onClick={run} disabled={running} style={{ alignSelf: 'flex-start' }}>{running ? tr({ uz: 'Bajarilmoqda…', ru: 'Выполняется…' }) : (done ? tr({ uz: '↻ Yana ishga tushir', ru: '↻ Запустить ещё раз' }) : tr({ uz: '▶ Ishga tushir', ru: '▶ Запустить' }))}</button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ i 1→2→3→4→5 bo'ldi, har safar bir marta ishladi. i = 6 bo'lganda shart (<span className="mono">i &lt;= 5</span>) buzildi — sikl to'xtadi.</>, ru: <>✓ i прошёл 1→2→3→4→5, каждый раз срабатывая по одному. При i = 6 условие (<span className="mono">i &lt;= 5</span>) нарушилось — цикл остановился.</> })}</p></div>}
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
    questionText="for siklida 'i++' nima vazifani bajaradi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>for siklidagi <span className="mono" style={{ color: T.accent }}>i++</span> nima qiladi?</>, ru: <>Что делает <span className="mono" style={{ color: T.accent }}>i++</span> в цикле for?</> })}</h2></>}
    options={[{ uz: "Siklni boshlang'ich qiymatini belgilaydi", ru: 'Задаёт начальное значение цикла' }, { uz: 'Har aylanishdan keyin i ni 1 ga oshiradi', ru: 'После каждой итерации увеличивает i на 1' }, { uz: "Siklni butunlay to'xtatib qo'yadi", ru: 'Полностью останавливает цикл' }, { uz: 'Yangi massiv yaratadi', ru: 'Создаёт новый массив' }]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! i++ — bu qadam. Har bir aylanishdan so'ng i qiymati 1 ga oshadi va shart qaytadan tekshiriladi.", ru: 'Верно! i++ — это шаг. После каждой итерации значение i растёт на 1, и условие проверяется снова.' }}
    explainWrong={{
      0: { uz: "Yo'q — boshlang'ich qiymat «let i = 1» qismi. i++ esa qadam — har safar i ni o'zgartiradi.", ru: 'Нет — начальное значение задаёт часть «let i = 1». А i++ — шаг: он меняет i каждый раз.' },
      2: { uz: "Yo'q — siklni shart to'xtatadi (i <= 5 buzilganda). i++ esa i ni oshiradi.", ru: 'Нет — цикл останавливает условие (когда i <= 5 нарушится). А i++ увеличивает i.' },
      3: { uz: "Yo'q — massiv boshqa narsa. i++ faqat i ni 1 ga oshiradi.", ru: 'Нет — массив тут ни при чём. i++ лишь увеличивает i на 1.' },
      default: { uz: 'i++ — qadam: har aylanishdan keyin i ni 1 ga oshiradi.', ru: 'i++ — шаг: после каждой итерации увеличивает i на 1.' }
    }} />
);

// ===== SCREEN 5 — PARAMETRLARNI O'ZGARTIRISH =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [end, setEnd] = useState(5);
  const [step, setStep] = useState(1);
  const [seen, setSeen] = useState(new Set(['5-1']));
  const done = seen.size >= 2;
  const mark = (e, s) => setSeen(prev => { const n = new Set(prev); n.add(`${e}-${s}`); return n; });
  const setE = (e) => { setEnd(e); mark(e, step); };
  const setS = (s) => { setStep(s); mark(end, s); };
  const nums = []; for (let i = 1; i <= end; i += step) nums.push(i);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Siklni boshqarish', ru: 'Управление циклом' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Parametrni o'zgartiring", ru: 'Измените параметр' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Siklni <span className="italic" style={{ color: T.accent }}>o'zingiz</span> boshqarib ko'ring</>, ru: <>Попробуйте управлять циклом <span className="italic" style={{ color: T.accent }}>сами</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>3 qismni o'zgartirsangiz — sikl boshqacha ishlaydi. <b style={{ color: T.ink }}>Shart</b>ni o'zgartiring (qachongacha) yoki <b style={{ color: T.ink }}>qadam</b>ni (qancha sakraydi). Pastdagi natija darhol o'zgaradi.</>, ru: <>Поменяете эти части — цикл заработает иначе. Измените <b style={{ color: T.ink }}>условие</b> (до каких пор) или <b style={{ color: T.ink }}>шаг</b> (на сколько прыгать). Результат внизу изменится сразу.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Shart — i qachongacha?', ru: 'Условие — до какого i?' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              {[5, 8, 12].map(e => <button key={e} className={`chip ${end === e ? 'chip-on' : ''}`} onClick={() => setE(e)}>i &lt;= {e}</button>)}
            </div>
            <p className="flow-label" style={{ marginTop: 4 }}>{tr({ uz: 'Qadam — qancha sakraydi?', ru: 'Шаг — на сколько прыгает?' })}</p>
            <div className="fade-up delay-2" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${step === 1 ? 'chip-on' : ''}`} onClick={() => setS(1)}>i++ {tr({ uz: '(bir-bir)', ru: '(по одному)' })}</button>
              <button className={`chip ${step === 2 ? 'chip-on' : ''}`} onClick={() => setS(2)}>i += 2 {tr({ uz: '(ikki-ikki)', ru: '(по два)' })}</button>
            </div>
            <div className="codebox" style={{ marginTop: 6 }}>
              <div><KW>for</KW> (<KW>let</KW> i = <NUM>1</NUM>; <span className="for-pt for-cond">i &lt;= {end}</span>; <span className="for-pt for-step">{step === 1 ? 'i++' : 'i += 2'}</span>) {'{'}</div>
              <div style={{ paddingLeft: 18 }}><FN>console</FN>.<FN>log</FN>(i)</div>
              <div>{'}'}</div>
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: <>Natija — {nums.length} ta son</>, ru: <>Результат — чисел: {nums.length}</> })}</p>
            <div className="numline fade-up delay-1">
              {Array.from({ length: 12 }, (_, k) => k + 1).map(n => (
                <span key={n} className={`num-cell ${nums.includes(n) ? 'hit' : ''}`}>{n}</span>
              ))}
            </div>
            <Terminal lines={nums.map(String)} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Ko'rdingizmi? Bitta sonni o'zgartirdingiz — butun natija o'zgardi. Qadam <b>2</b> bo'lsa, sikl sonlarni <b>sakrab</b> o'tadi. Sikl moslashuvchan!</>, ru: <>✓ Видели? Поменяли одно число — изменился весь результат. Если шаг <b>2</b>, цикл идёт по числам <b>прыжками</b>. Цикл гибкий!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5b — TEST 2 (siklni o'qib tushunish) =====
const Screen5b = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv', ru: 'Проверка' })}
    questionText="for (let i = 1; i <= 3; i++) console.log(i) — konsolda qaysi sonlar chiqadi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "Siklni o'qing", ru: 'Прочитайте цикл' })}</p><h2 className="title h-sub" style={{ margin: '8px 0 2px' }}>{tr({ uz: <>Bu sikl konsolga <span className="italic" style={{ color: T.accent }}>qaysi sonlarni</span> yozadi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Какие числа</span> этот цикл выведет в консоль?</> })}</h2><div className="codebox" style={{ marginTop: 10, marginBottom: 4 }}><div><KW>for</KW> (<KW>let</KW> i = <NUM>1</NUM>; i &lt;= <NUM>3</NUM>; i++) {'{'}</div><div style={{ paddingLeft: 18 }}><FN>console</FN>.<FN>log</FN>(i)</div><div>{'}'}</div></div></>}
    options={['1, 2, 3', '1, 2', '1, 2, 3, 4', '3, 2, 1']} correctIdx={0}
    explainCorrect={{ uz: "To'g'ri! i = 1 dan boshlanadi va «i <= 3» bo'lgancha ishlaydi: 1, 2, 3. i = 4 bo'lganda shart buziladi — sikl to'xtaydi.", ru: 'Верно! i начинается с 1 и работает, пока «i <= 3»: 1, 2, 3. При i = 4 условие нарушается — цикл останавливается.' }}
    explainWrong={{
      1: { uz: "Deyarli! Shart «i <= 3» — ya'ni 3 ham kiradi (3 <= 3 — to'g'ri). Demak 1, 2, 3.", ru: 'Почти! Условие «i <= 3» — значит, 3 тоже входит (3 <= 3 — истина). Итого 1, 2, 3.' },
      2: { uz: "Yo'q — i = 4 bo'lganda «4 <= 3» noto'g'ri, sikl to'xtaydi. 4 chiqmaydi. Faqat 1, 2, 3.", ru: 'Нет — при i = 4 условие «4 <= 3» ложно, цикл останавливается. 4 не выводится. Только 1, 2, 3.' },
      3: { uz: "Yo'q — i++ i ni oshiradi (1 dan yuqoriga), kamaytirmaydi. Demak 1, 2, 3 tartibda.", ru: 'Нет — i++ увеличивает i (от 1 вверх), а не уменьшает. Значит порядок 1, 2, 3.' },
      default: { uz: 'Boshlanish 1, shart «i <= 3» → 1, 2, 3.', ru: 'Старт 1, условие «i <= 3» → 1, 2, 3.' }
    }} />
);

// ===== SCREEN 6 — while SIKLI =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const STEP = 20;
  const [suv, setSuv] = useState(storedAnswer ? 100 : 0);
  const [iter, setIter] = useState(storedAnswer ? 5 : 0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const done = suv >= 100;
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current); setSuv(0); setIter(0); setRunning(true);
    const tick = (v, c) => {
      setSuv(v); setIter(c);
      if (v < 100) timer.current = setTimeout(() => tick(Math.min(v + STEP, 100), c + 1), 480);
      else setRunning(false);
    };
    timer.current = setTimeout(() => tick(STEP, 1), 350);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'while sikli', ru: 'Цикл while' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Idishni to'ldiring", ru: 'Наполните сосуд' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Necha marta takrorlashni <span className="italic" style={{ color: T.accent }}>bilmasak-chi?</span></>, ru: <>А если <span className="italic" style={{ color: T.accent }}>не знаем</span>, сколько раз повторять?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Zavodda idishni suv bilan to'ldiryapsiz — necha marta quyishni oldindan sanaysizmi? Yo'q! Bu yerda «Shart» dastagi o'rniga <b style={{ color: T.ink }}>datchik</b> turadi — u faqat bitta narsani kuzatadi: <b style={{ color: T.ink }}>"to'lmaguncha quyaver"</b>. <span className="mono" style={{ color: T.accent }}>while</span> ham aynan shunday ishlaydi: shart (datchik) <b style={{ color: T.ink }}>rost ekan</b> — takrorlayveradi, to'lib rost bo'lmay qolsa — to'xtaydi.</>, ru: <>На заводе вы наполняете сосуд водой — считаете заранее, сколько раз налить? Нет! Здесь вместо рычага «Условие» стоит <b style={{ color: T.ink }}>датчик</b> — он следит за одним: <b style={{ color: T.ink }}>«лей, пока не наполнится»</b>. <span className="mono" style={{ color: T.accent }}>while</span> работает точно так же: пока условие (датчик) <b style={{ color: T.ink }}>истинно</b> — повторяет, перестало быть истинным — останавливается.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="codebox fade-up delay-1">
              <div><KW>let</KW> suv = <NUM>0</NUM></div>
              <div><KW>while</KW> (<span className="for-pt for-cond">suv &lt; 100</span>) {'{'}</div>
              <div style={{ paddingLeft: 18 }}>suv += <NUM>20</NUM> <CM>{tr({ uz: '// yana quyamiz', ru: '// подливаем ещё' })}</CM></div>
              <div>{'}'}</div>
            </div>
            <button className="btn" onClick={run} disabled={running} style={{ alignSelf: 'flex-start' }}>{running ? tr({ uz: 'Quyilmoqda…', ru: 'Наливается…' }) : (done ? tr({ uz: '↻ Yana', ru: '↻ Ещё раз' }) : tr({ uz: '💧 Suv quyishni boshlash', ru: '💧 Начать наливать воду' }))}</button>
            <p className="body" style={{ margin: 0, color: T.ink2, fontSize: 13 }}>{tr({ uz: 'Aylanishlar:', ru: 'Итераций:' })} <b style={{ color: T.accent, fontFamily: "'JetBrains Mono',monospace" }}>{iter}</b>{tr({ uz: ' marta', ru: '' })}</p>
          </Col>
          <Col>
            <div className="glass-wrap fade-up delay-1">
              <span className="tap-emoji">🚰{running && <span className="drip">💧</span>}</span>
              <div className="glass">
                <div className="glass-fill" style={{ height: `${suv}%` }}>{suv > 0 && suv < 100 && <div className="glass-wave" />}</div>
                <span className="glass-pct">{suv}%</span>
                {running && suv > 0 && <span className="splash" key={suv}>+20</span>}
              </div>
              <div className="cond-pill" style={{ background: suv < 100 ? T.successSoft : T.accentSoft, color: suv < 100 ? T.success : T.accent }}>suv {suv} &lt; 100 → {suv < 100 ? tr({ uz: '✓ yana quy', ru: '✓ лей ещё' }) : tr({ uz: "✗ to'xta", ru: '✗ стоп' })}</div>
              <p className="mono small" style={{ color: T.ink3, margin: 0 }}>{tr({ uz: `${iter}-aylanish`, ru: `итерация ${iter}` })}</p>
            </div>
            <div className="fade-up delay-2"><SiklZavodi count={iter} max={5} whileMode init="suv = 0" cond="suv < 100" step="suv += 20" done={done} compact /></div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Idish to'ldi! Sikl 5 marta ishladi — biz buni oldindan sanamadik, datchik (<span className="mono">suv &lt; 100</span>) o'zi to'xtatdi. Mana <b>while</b>ning farqi.</>, ru: <>✓ Сосуд полон! Цикл сработал 5 раз — мы это заранее не считали, датчик (<span className="mono">suv &lt; 100</span>) остановил его сам. В этом и отличие <b>while</b>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — for vs while =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const CARDS = {
    forc: { ic: '🔢', name: 'for', when: { uz: "Necha marta — OLDINDAN MA'LUM", ru: 'Сколько раз — ИЗВЕСТНО ЗАРАНЕЕ' }, ex: [{ uz: '5 marta sakra', ru: 'прыгни 5 раз' }, { uz: "30 ta do'stga yoz", ru: 'напиши 30 друзьям' }, { uz: '1 dan 100 gacha sana', ru: 'сосчитай от 1 до 100' }] },
    whilec: { ic: '❓', name: 'while', when: { uz: "Necha marta — NOMA'LUM (shartga bog'liq)", ru: 'Сколько раз — НЕИЗВЕСТНО (зависит от условия)' }, ex: [{ uz: "jon tugaguncha o'yna", ru: 'играй, пока не кончатся жизни' }, { uz: "parol to'g'ri bo'lguncha so'ra", ru: 'спрашивай пароль, пока он не совпадёт' }, { uz: "idish to'lguncha quy", ru: 'лей, пока сосуд не наполнится' }] }
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 2;
  const tap = (k) => { setActive(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow="for ⚔️ while" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `${seen.size}/2 ko'ring`, ru: `Просмотрите ${seen.size}/2` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaysi birini <span className="italic" style={{ color: T.accent }}>qachon</span> ishlatamiz?</>, ru: <>Какой из них <span className="italic" style={{ color: T.accent }}>когда</span> использовать?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Ikkalasi ham takrorlaydi. Farq <b style={{ color: T.ink }}>bitta savolda</b>: necha marta takrorlashni <b style={{ color: T.ink }}>oldindan bilamizmi?</b> Bilsak — <b style={{ color: T.accent }}>for</b>. Bilmasak, faqat shart bo'lsa — <b style={{ color: T.accent }}>while</b>. Ikkala kartani bosing.</>, ru: <>Оба повторяют. Разница — в <b style={{ color: T.ink }}>одном вопросе</b>: <b style={{ color: T.ink }}>знаем ли заранее</b>, сколько раз повторять? Знаем — <b style={{ color: T.accent }}>for</b>. Не знаем, есть только условие — <b style={{ color: T.accent }}>while</b>. Нажмите обе карточки.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.keys(CARDS).map(k => (
                <button key={k} onClick={() => tap(k)} style={{ display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 14, padding: '15px 16px', background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: 'all 0.18s' }}>
                  <span className={k === 'whilec' ? 'pulse-q' : 'ic-float'} style={{ fontSize: 28 }}>{CARDS[k].ic}</span>
                  <span className="mono" style={{ fontWeight: 700, fontSize: 18, color: T.accent }}>{CARDS[k].name}</span>
                  {seen.has(k) && <span style={{ marginLeft: 'auto', color: T.success, fontSize: 15 }}>✓</span>}
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {active ? (
              <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span className={active === 'whilec' ? 'pulse-q' : 'ic-float'} style={{ fontSize: 24 }}>{CARDS[active].ic}</span><span className="sk-wordbadge">{CARDS[active].name}</span></span>
                <p className="body" style={{ color: T.ink, margin: '11px 0 9px', fontWeight: 600 }}>{tr(CARDS[active].when)}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {CARDS[active].ex.map((e, i) => (<div key={i} className="ex-row" style={{ display: 'flex', gap: 8, alignItems: 'center', background: T.bg, borderRadius: 8, padding: '8px 11px', animationDelay: `${0.05 + i * 0.09}s` }}><span style={{ color: T.accent }}>•</span><span className="body" style={{ margin: 0, color: T.ink2 }}>{tr(e)}</span></div>))}
                </div>
              </div>
            ) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Bir kartani bosing', ru: 'Нажмите на карточку' })}</p></div> : null)}
            {done && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Esda tuting: <b>for</b> = sanab bo'ladigan ishlar, <b>while</b> = "qachongacha?" deb so'raydigan ishlar.</>, ru: <>Запомните: <b>for</b> — задачи, которые можно сосчитать, <b>while</b> — задачи с вопросом «до каких пор?».</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — MASSIV (ro'yxat) =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const ARR = [{ e: '🍎', n: 'olma' }, { e: '🍌', n: 'banan' }, { e: '🍇', n: 'uzum' }, { e: '🍓', n: 'qulupnay' }];
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 2;
  const tap = (i) => { setActive(i); setSeen(prev => { const n = new Set(prev); n.add(i); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Massiv', ru: 'Массив' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Elementlarni bosing', ru: 'Нажимайте на элементы' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ko'p narsani <span className="italic" style={{ color: T.accent }}>bitta joyda</span> qanday saqlaymiz?</>, ru: <>Как хранить много всего <span className="italic" style={{ color: T.accent }}>в одном месте</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>4 ta meva uchun 4 ta alohida o'zgaruvchi (<span className="mono">meva1, meva2…</span>) yasash — noqulay. 100 ta bo'lsa-chi? Yaxshisi — hammasini bitta <b style={{ color: T.ink }}>massivga</b>, raqamlangan qator qutilarga joylaymiz. Eng qizig'i: qutilar <b style={{ color: T.accent }}>1 dan emas, 0 dan</b> sanaladi! Dasturlashda shunday qabul qilingan: birinchi element — 0-o'rinda. Har bir qutini bosib ko'ring.</>, ru: <>Делать 4 отдельные переменные для 4 фруктов (<span className="mono">meva1, meva2…</span>) — неудобно. А если их 100? Лучше сложить всё в один <b style={{ color: T.ink }}>массив</b> — ряд пронумерованных коробок. Самое интересное: коробки считаются <b style={{ color: T.accent }}>не с 1, а с 0</b>! Так принято в программировании: первый элемент — на месте 0. Нажмите на каждую коробку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="codebox fade-up delay-1">
              <div><KW>const</KW> mevalar = [<STR>"olma"</STR>, <STR>"banan"</STR>, <STR>"uzum"</STR>, <STR>"qulupnay"</STR>]</div>
            </div>
            <p className="flow-label">{tr({ uz: 'Qutilar — indeksini bosing', ru: 'Коробки — нажмите на индекс' })}</p>
            <div className="arr-row">
              {ARR.map((it, i) => (
                <button key={i} className={`arr-cell ex-row ${active === i ? 'on' : ''}`} onClick={() => tap(i)} style={{ animationDelay: `${0.15 + i * 0.09}s` }}>
                  <span className="arr-emoji">{it.e}</span>
                  <span className="arr-name">{it.n}</span>
                  <span className="arr-idx">[{i}]</span>
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {active !== null ? (
              <div className="sk-info fade-step" key={active}>
                <p className="flow-label" style={{ margin: '0 0 8px' }}>{tr({ uz: 'Indeks orqali olamiz', ru: 'Получаем по индексу' })}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                  <span className="mono" style={{ fontSize: 'clamp(18px,3vw,24px)', color: T.ink }}>mevalar[<span style={{ color: T.accent, fontWeight: 700 }}>{active}</span>]</span>
                  <span className="mono" style={{ color: T.ink3, fontSize: 20 }}>→</span>
                  <span style={{ fontSize: 26 }}>{ARR[active].e}</span>
                  <span className="mono" style={{ fontSize: 'clamp(16px,2.4vw,20px)', color: T.success, fontWeight: 700 }}>"{ARR[active].n}"</span>
                </div>
                <p className="body" style={{ color: T.ink, margin: '12px 0 0' }}>{active === 0 ? tr({ uz: <>🎯 <b>Indeks 0</b> — eng birinchi element! Sanash noldan boshlanadi, shuning uchun "olma" — nolinchi.</>, ru: <>🎯 <b>Индекс 0</b> — самый первый элемент! Счёт идёт с нуля, поэтому "olma" — нулевая.</> }) : tr({ uz: <>Bu <b>{active + 1}-element</b>, lekin indeksi <b>{active}</b> — chunki 0 dan sanadik.</>, ru: <>Это <b>{active + 1}-й элемент</b>, но его индекс <b>{active}</b> — потому что считали с 0.</> })}</p>
              </div>
            ) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Bir qutini bosing — indeksini ko'ring", ru: 'Нажмите на коробку — увидите её индекс' })}</p></div> : null)}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Birinchi element <b>[0]</b>, oxirgisi <b>[3]</b>. Bu "0 dan sanash" — dasturlashning eng mashhur "tuzog'i". Endi bilasiz! 😉</>, ru: <>✓ Первый элемент <b>[0]</b>, последний <b>[3]</b>. Этот «счёт с нуля» — самая известная «ловушка» программирования. Теперь вы в курсе! 😉</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEST 3 (indeks) =====
const Screen9 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    questionText="mevalar = ['olma','banan','uzum']. mevalar[0] nima?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><div className="codebox" style={{ marginTop: 10, marginBottom: 6 }}><div><KW>const</KW> mevalar = [<STR>"olma"</STR>, <STR>"banan"</STR>, <STR>"uzum"</STR>]</div></div><h2 className="title h-sub" style={{ marginTop: 6 }}>{tr({ uz: <><span className="mono" style={{ color: T.accent }}>mevalar[0]</span> nimaga teng?</>, ru: <>Чему равно <span className="mono" style={{ color: T.accent }}>mevalar[0]</span>?</> })}</h2></>}
    options={['"banan"', '"olma"', { uz: "Xato — [0] yo'q", ru: 'Ошибка — [0] не существует' }, '"uzum"']} correctIdx={1}
    explainCorrect={{ uz: `To'g'ri! Indeks 0 dan boshlanadi, shuning uchun mevalar[0] — birinchi element, ya'ni "olma".`, ru: 'Верно! Индекс начинается с 0, поэтому mevalar[0] — первый элемент, то есть "olma".' }}
    explainWrong={{
      0: { uz: 'Yo\'q — "banan" ikkinchi element, uning indeksi [1]. [0] esa birinchi — "olma".', ru: 'Нет — "banan" второй элемент, его индекс [1]. А [0] — первый, это "olma".' },
      2: { uz: "Yo'q — [0] aniq bor: u birinchi elementni bildiradi (indeks 0 dan boshlanadi).", ru: 'Нет — [0] точно существует: это первый элемент (индекс начинается с 0).' },
      3: { uz: 'Yo\'q — "uzum" uchinchi element, indeksi [2]. [0] — "olma".', ru: 'Нет — "uzum" третий элемент, его индекс [2]. [0] — это "olma".' },
      default: { uz: 'Indeks 0 dan boshlanadi → mevalar[0] = "olma".', ru: 'Индекс начинается с 0 → mevalar[0] = "olma".' }
    }} />
);

// ===== SCREEN 10 — MASSIVNI AYLANIB CHIQISH =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const ARR = [{ e: '🍎', n: 'olma' }, { e: '🍌', n: 'banan' }, { e: '🍇', n: 'uzum' }, { e: '🍓', n: 'qulupnay' }];
  const N = ARR.length;
  const [hi, setHi] = useState(-1);
  const [out, setOut] = useState(storedAnswer ? ARR.map(a => a.n) : []);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const done = out.length >= N;
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current); setOut([]); setHi(-1); setRunning(true);
    const tick = (i) => {
      setHi(i); setOut(prev => [...prev, ARR[i].n]);
      if (i < N - 1) timer.current = setTimeout(() => tick(i + 1), 640);
      else { setRunning(false); timer.current = setTimeout(() => setHi(-1), 700); }
    };
    timer.current = setTimeout(() => tick(0), 350);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Aylanib chiqish', ru: 'Обход массива' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval ishga tushiring', ru: 'Сначала запустите' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sikl massivni <span className="italic" style={{ color: T.accent }}>birma-bir</span> o'qiydi</>, ru: <>Цикл читает массив <span className="italic" style={{ color: T.accent }}>по одному</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana eng kuchli birikma! <b style={{ color: T.ink }}>for</b> sikli massivning har bir elementini <b style={{ color: T.ink }}>birma-bir ko'rib chiqadi</b> — buni "ro'yxatni <b style={{ color: T.ink }}>aylanib chiqish</b>" deymiz. <span className="mono" style={{ color: T.accent }}>i</span> indeks bo'ladi (0, 1, 2…), <span className="mono" style={{ color: T.accent }}>.length</span> esa massivda nechta element borligini aytadi. Ishga tushiring.</>, ru: <>Вот самая мощная связка! Цикл <b style={{ color: T.ink }}>for</b> просматривает каждый элемент массива <b style={{ color: T.ink }}>по одному</b> — это называется «<b style={{ color: T.ink }}>обход</b> списка». <span className="mono" style={{ color: T.accent }}>i</span> будет индексом (0, 1, 2…), а <span className="mono" style={{ color: T.accent }}>.length</span> говорит, сколько элементов в массиве. Запускайте.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="codebox fade-up delay-1">
              <div><KW>for</KW> (<KW>let</KW> i = <NUM>0</NUM>; i &lt; mevalar.<FN>length</FN>; i++) {'{'}</div>
              <div style={{ paddingLeft: 18 }}><FN>console</FN>.<FN>log</FN>(mevalar[<span style={{ color: T.accent }}>i</span>])</div>
              <div>{'}'}</div>
            </div>
            <div className="arr-row fade-up delay-2">
              {ARR.map((it, i) => (
                <div key={i} className={`arr-cell ${hi === i ? 'scan' : ''}`}>
                  <span className="arr-emoji">{it.e}</span>
                  <span className="arr-name">{it.n}</span>
                  <span className="arr-idx">[{i}]</span>
                </div>
              ))}
            </div>
            <button className="btn" onClick={run} disabled={running} style={{ alignSelf: 'flex-start' }}>{running ? tr({ uz: 'Aylanyapti…', ru: 'Обходит…' }) : (done ? tr({ uz: '↻ Yana', ru: '↻ Ещё раз' }) : tr({ uz: '▶ Ishga tushir', ru: '▶ Запустить' }))}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija (har bir element)', ru: 'Результат (каждый элемент)' })}</p>
            <Terminal lines={out} empty={{ uz: '// ▶ ishga tushiring', ru: '// ▶ запустите' }} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Sikl massivning 4 ta elementini birma-bir chop etdi. <span className="mono">i &lt; .length</span> tufayli oxiriga yetganda o'zi to'xtadi — qancha element bo'lsa ham ishlaydi!</>, ru: <>✓ Цикл напечатал 4 элемента массива по одному. Благодаря <span className="mono">i &lt; .length</span> он сам остановился в конце — и так с любым числом элементов!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — HAYOTIY MISOL (hook yechimi) =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const NAMES = ['Ali', 'Laylo', 'Bobur'];
  const N = NAMES.length;
  const [out, setOut] = useState(storedAnswer ? NAMES.map(n => `${tr({ uz: 'Bayram muborak', ru: 'С праздником' })}, ${n}`) : []);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const done = out.length >= N;
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current); setOut([]); setRunning(true);
    const tick = (i) => {
      setOut(prev => [...prev, `${tr({ uz: 'Bayram muborak', ru: 'С праздником' })}, ${NAMES[i]}`]);
      if (i < N - 1) timer.current = setTimeout(() => tick(i + 1), 460);
      else setRunning(false);
    };
    timer.current = setTimeout(() => tick(0), 300);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Hayotiy misol', ru: 'Пример из жизни' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Hammaga yuboring', ru: 'Отправьте всем' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Esingizdami — <span className="italic" style={{ color: T.accent }}>30 ta xabar?</span> Mana yechim!</>, ru: <>Помните — <span className="italic" style={{ color: T.accent }}>30 сообщений?</span> Вот решение!</> })}</h2></div>
        <Mentor>{tr({ uz: <>Dars boshida do'stlarga qo'lda yozayotgan edingiz. Endi qo'lingizda kuchli usul bor: do'stlar ro'yxatini massivga solamiz, sikl esa ro'yxatni <b style={{ color: T.ink }}>aylanib chiqib</b>, <b style={{ color: T.ink }}>har biriga</b> tabrik yozadi — bir marta yozib! Tugmani bosing.</>, ru: <>В начале урока вы писали друзьям вручную. Теперь у вас мощный приём: кладём список друзей в массив, а цикл <b style={{ color: T.ink }}>обходит</b> список и пишет поздравление <b style={{ color: T.ink }}>каждому</b> — написали один раз! Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="codebox fade-up delay-1" style={{ lineHeight: 2 }}>
              <div><KW>const</KW> dostlar = [<STR>"Ali"</STR>, <STR>"Laylo"</STR>, <STR>"Bobur"</STR>]</div>
              <div style={{ marginTop: 10 }}><KW>for</KW> (<KW>let</KW> i = <NUM>0</NUM>; i &lt; dostlar.<FN>length</FN>; i++) {'{'}</div>
              <div style={{ paddingLeft: 16 }}><FN>console</FN>.<FN>log</FN>(<STR>{tr({ uz: '"Bayram muborak, "', ru: '"С праздником, "' })}</STR> + dostlar[i])</div>
              <div>{'}'}</div>
            </div>
            <button className="btn" onClick={run} disabled={running} style={{ alignSelf: 'flex-start' }}>{running ? tr({ uz: 'Yuborilmoqda…', ru: 'Отправляется…' }) : (done ? tr({ uz: '↻ Yana yuborish', ru: '↻ Отправить ещё раз' }) : tr({ uz: '🎉 Hammaga tabrik yuborish', ru: '🎉 Отправить всем поздравление' }))}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Sikl har bir do'stga yuboryapti", ru: 'Цикл отправляет каждому другу' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {NAMES.map((nm, i) => {
                const got = out.length > i;
                return (
                  <div key={i} className={`friend-card ${got ? 'got' : ''}`}>
                    <span className="friend-ava">{['🧑', '👩', '🧔'][i]}</span>
                    <div><div className="friend-name">{nm}</div><div className="friend-msg">{got ? `"${tr({ uz: 'Bayram muborak', ru: 'С праздником' })}, ${nm}"` : tr({ uz: 'navbatini kutyapti…', ru: 'ждёт своей очереди…' })}</div></div>
                    <span className="friend-status">{got ? '✅' : '✉️'}</span>
                  </div>
                );
              })}
            </div>
            <Terminal lines={out} empty={{ uz: '// ▶ tugmani bosing', ru: '// ▶ нажмите кнопку' }} title={{ uz: 'xabarlar', ru: 'сообщения' }} />
            <div className="fade-up delay-2"><SiklZavodi count={out.length} max={N} init="i = 0" cond="i < dostlar.length" step="i++" load={NAMES} done={done} compact /></div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ 3 ta shaxsiy tabrik — <b>bitta sikl bilan</b>! Ro'yxatda 1000 ta nom bo'lsa ham, kod aynan shu qoladi. Mana dasturchining "dangasaligi" — aslida zukkolik!</>, ru: <>✓ 3 личных поздравления — <b>одним циклом</b>! Даже если в списке 1000 имён, код останется тем же. Вот она, «лень» программиста — на самом деле смекалка!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TEST 4 (aylanib chiqish) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    questionText="dostlar massivida 5 ta nom bor. for (i=0; i<dostlar.length; i++) sikli necha marta ishlaydi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><div className="codebox" style={{ marginTop: 10, marginBottom: 6 }}><div><CM>{tr({ uz: '// dostlar = 5 ta nom', ru: '// dostlar = 5 имён' })}</CM></div><div><KW>for</KW> (<KW>let</KW> i = <NUM>0</NUM>; i &lt; dostlar.<FN>length</FN>; i++) {'{ … }'}</div></div><h2 className="title h-sub" style={{ marginTop: 6 }}>{tr({ uz: <>Sikl <span className="italic" style={{ color: T.accent }}>necha marta</span> ishlaydi?</>, ru: <>Цикл сработает <span className="italic" style={{ color: T.accent }}>сколько раз</span>?</> })}</h2></>}
    options={[{ uz: '4 marta', ru: '4 раза' }, { uz: '5 marta', ru: '5 раз' }, { uz: '6 marta', ru: '6 раз' }, { uz: 'Cheksiz', ru: 'Бесконечно' }]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! .length = 5, sikl i = 0, 1, 2, 3, 4 bo'lganda ishlaydi — ya'ni 5 marta, har bir element uchun bir marta.", ru: 'Верно! .length = 5, цикл работает при i = 0, 1, 2, 3, 4 — то есть 5 раз, по разу на каждый элемент.' }}
    explainWrong={{
      0: { uz: "Yo'q — bu klassik «±1» xato. i 0,1,2,3,4 — bu 5 ta qiymat. Demak 5 marta.", ru: 'Нет — это классическая ошибка «±1». i идёт 0,1,2,3,4 — это 5 значений. Значит 5 раз.' },
      2: { uz: "Yo'q — i 5 bo'lganda «5 < 5» noto'g'ri, sikl to'xtaydi. Demak 6 emas, 5 marta.", ru: 'Нет — при i = 5 условие «5 < 5» ложно, цикл останавливается. Значит не 6, а 5 раз.' },
      3: { uz: "Yo'q — i++ tufayli i oshadi va shart bir kun buziladi. Cheksiz emas — 5 marta.", ru: 'Нет — благодаря i++ значение i растёт, и условие однажды нарушится. Не бесконечно — 5 раз.' },
      default: { uz: '.length = 5 → i 0..4 → 5 marta.', ru: '.length = 5 → i 0..4 → 5 раз.' }
    }} />
);

// ===== SCREEN 13 — AMALIYOT: O'Z SIKLINGNI QUR =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const MSGS = [{ uz: 'Men dasturchiman!', ru: 'Я программист!' }, { uz: "Sikl — bu kuch!", ru: 'Цикл — это сила!' }];
  const [n, setN] = useState(5);
  const [msgIdx, setMsgIdx] = useState(0);
  const [out, setOut] = useState([]);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(!!storedAnswer);
  const timer = useRef(null);
  const done = ran;
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current); setOut([]); setRunning(true);
    const msg = tr(MSGS[msgIdx]);
    const tick = (i) => {
      setOut(prev => [...prev, `${i}. ${msg}`]);
      if (i < n) timer.current = setTimeout(() => tick(i + 1), 360);
      else { setRunning(false); setRan(true); }
    };
    timer.current = setTimeout(() => tick(1), 300);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot · o'z siklingiz", ru: 'Практика · ваш цикл' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Siklni ishga tushiring', ru: 'Запустите цикл' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.4vw,14px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>siz</span> sikl quring</>, ru: <>Теперь цикл строите <span className="italic" style={{ color: T.accent }}>вы</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Navbat sizga! <b style={{ color: T.ink }}>Necha marta</b> takrorlashni va <b style={{ color: T.ink }}>qaysi xabarni</b> tanlang, keyin "Ishga tushir"ni bosing. Kod o'zgarishini va natijani kuzating.</>, ru: <>Ваш ход! Выберите, <b style={{ color: T.ink }}>сколько раз</b> повторять и <b style={{ color: T.ink }}>какое сообщение</b>, затем нажмите «Запустить». Следите, как меняется код и результат.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Necha marta? (shart)', ru: 'Сколько раз? (условие)' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              {[3, 5, 7].map(v => <button key={v} className={`chip ${n === v ? 'chip-on' : ''}`} onClick={() => { setN(v); setRan(false); }}>{tr({ uz: `${v} marta`, ru: `${v} ${v === 3 ? 'раза' : 'раз'}` })}</button>)}
            </div>
            <p className="flow-label" style={{ marginTop: 4 }}>{tr({ uz: 'Qaysi xabar?', ru: 'Какое сообщение?' })}</p>
            <div className="fade-up delay-2" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {MSGS.map((m, i) => <button key={i} className={`chip ${msgIdx === i ? 'chip-on' : ''}`} onClick={() => { setMsgIdx(i); setRan(false); }}>"{tr(m)}"</button>)}
            </div>
            <div className="codebox" style={{ marginTop: 6 }}>
              <div><KW>for</KW> (<KW>let</KW> i = <NUM>1</NUM>; i &lt;= <NUM>{n}</NUM>; i++) {'{'}</div>
              <div style={{ paddingLeft: 18 }}><FN>console</FN>.<FN>log</FN>(i + <STR>". {tr(MSGS[msgIdx])}"</STR>)</div>
              <div>{'}'}</div>
            </div>
            <button className="btn" onClick={run} disabled={running} style={{ alignSelf: 'flex-start' }}>{running ? tr({ uz: 'Bajarilmoqda…', ru: 'Выполняется…' }) : tr({ uz: '▶ Ishga tushir', ru: '▶ Запустить' })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Sizning natijangiz', ru: 'Ваш результат' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', alignItems: 'center', gap: 13, background: T.paper, borderRadius: 12, padding: '12px 18px', boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)` }}>
              <span className="rep-badge burst" key={out.length}>{out.length}</span>
              <div><div className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'marta bajarildi', ru: 'раз выполнено' })}</div><div className="mono small" style={{ color: T.ink2 }}>{tr({ uz: `${n} martadan`, ru: `из ${n}` })}</div></div>
              {done && <span className="burst" key="cel" style={{ marginLeft: 'auto', fontSize: 30 }}>🎉</span>}
            </div>
            <Terminal lines={out} empty={{ uz: '// parametrni tanlab, ishga tushiring', ru: '// выберите параметры и запустите' }} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Zo'r! Siz haqiqiy sikl qurdingiz va ishga tushirdingiz. Parametrni o'zgartirib, yana sinab ko'ring.</>, ru: <>✓ Класс! Вы собрали настоящий цикл и запустили его. Поменяйте параметры и попробуйте ещё.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — DEBUGGING (cheksiz sikl: i-- xato, top → tuzat) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [picked, setPicked] = useState(storedAnswer ? 'step' : null);
  const [fixed, setFixed] = useState(!!storedAnswer);
  const found = picked === 'step';
  const done = fixed;
  const click = (part) => { if (found) return; setPicked(part); };
  const fix = () => setFixed(true);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Debugging', ru: 'Дебаггинг' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Yakuniy sinov →', ru: 'Финальное испытание →' }) : (found ? tr({ uz: 'Endi tuzating', ru: 'Теперь исправьте' }) : tr({ uz: 'Xatoni toping', ru: 'Найдите ошибку' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bu sikl <span className="italic" style={{ color: T.accent }}>to'xtamayapti</span> — nega?</>, ru: <>Этот цикл <span className="italic" style={{ color: T.accent }}>не останавливается</span> — почему?</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI 1 dan 5 gacha sanaydigan sikl yozdi, lekin u <b style={{ color: T.ink }}>cheksiz</b> aylanyapti! Sir <b style={{ color: T.ink }}>qadam</b> qismida yashiringan. Diqqat bilan o'qing: i 5 ga <b style={{ color: T.ink }}>yaqinlashyaptimi</b>? Xato qismni toping va bosing.</>, ru: <>ИИ написал цикл, считающий от 1 до 5, но он крутится <b style={{ color: T.ink }}>бесконечно</b>! Секрет спрятан в части <b style={{ color: T.ink }}>шаг</b>. Читайте внимательно: i вообще <b style={{ color: T.ink }}>приближается</b> к 5? Найдите ошибочную часть и нажмите на неё.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="ai-card fade-up delay-1">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: '1 dan 5 gacha sanaymiz:', ru: 'Считаем от 1 до 5:' })}</span></div>
              <div className="ai-code">
                <div className="ai-line" style={{ cursor: 'default' }}>
                  <KW>for</KW> (
                  <span onClick={() => click('init')} style={{ cursor: found ? 'default' : 'pointer' }}>let i = 1</span>;{' '}
                  <span onClick={() => click('cond')} style={{ cursor: found ? 'default' : 'pointer' }}>i &lt;= 5</span>;{' '}
                  <span className={found ? (fixed ? 'tok-ok' : 'tok-bad') : ''} onClick={() => click('step')} style={{ cursor: found ? 'default' : 'pointer' }}>{fixed ? 'i++' : 'i--'}</span>) {'{'}
                </div>
                <div className="ai-line" style={{ cursor: 'default', paddingLeft: 16 }}><FN>console</FN>.<FN>log</FN>(i)</div>
                <div className="ai-line" style={{ cursor: 'default' }}>{'}'}</div>
              </div>
              {!found && <p className="ai-prompt">{tr({ uz: 'Qaysi qism xato? Ustiga bosing.', ru: 'Какая часть с ошибкой? Нажмите на неё.' })}</p>}
              {found && !fixed && (<button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={fix}>🔧 {tr({ uz: 'i-- ni i++ ga almashtirish', ru: 'Заменить i-- на i++' })}</button>)}
              {fixed && <p className="ai-prompt" style={{ color: T.success, fontStyle: 'normal', fontWeight: 600 }}>✓ {tr({ uz: "Tuzatildi — endi i oshadi va sikl 5 da to'xtaydi!", ru: 'Исправлено — теперь i растёт, и цикл остановится на 5!' })}</p>}
            </div>
            {!fixed ? (
              <div className="term fade-up delay-2">
                <div className="term-bar"><span className="term-dot" style={{ background: '#FF5F56' }} /><span className="term-dot" style={{ background: '#FFBD2E' }} /><span className="term-dot" style={{ background: '#27C93F' }} /><span className="term-title">console</span></div>
                <div className="term-body">{[1, 0, -1, -2].map((v, k) => <div key={k} className="term-line"><span className="term-arrow" style={{ color: T.accent }}>›</span><span>{v}</span></div>)}<div className="term-line warn-pulse" style={{ color: T.accent }}><span className="term-arrow" style={{ color: T.accent }}>›</span><span>⋮</span></div><p className="term-empty warn-pulse" style={{ color: T.accent }}>⚠️ {tr({ uz: 'i kamayyapti — 5 ga hech yetmaydi, cheksiz!', ru: 'i уменьшается — до 5 не дойдёт никогда, бесконечно!' })}</p></div>
              </div>
            ) : (
              <div className="term fade-step">
                <div className="term-bar"><span className="term-dot" style={{ background: '#FF5F56' }} /><span className="term-dot" style={{ background: '#FFBD2E' }} /><span className="term-dot" style={{ background: '#27C93F' }} /><span className="term-title">console</span></div>
                <div className="term-body">{[1, 2, 3, 4, 5].map(v => <div key={v} className="term-line"><span className="term-arrow">›</span><span>{v}</span></div>)}<p className="term-empty" style={{ color: T.success }}>✓ {tr({ uz: "5 marta ishladi va to'xtadi", ru: 'сработал 5 раз и остановился' })}</p></div>
              </div>
            )}
          </Col>
          <Col>
            {!found && (
              picked && picked !== 'step'
                ? (<div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu qism to'g'ri. {picked === 'init' ? 'Boshlanish (i = 1) — joyida.' : 'Shart (i <= 5) — joyida.'} Xato esa <b>qadam</b> qismida — i qaysi tomonga o'zgaryapti?</>, ru: <>Эта часть верна. {picked === 'init' ? 'Старт (i = 1) — на месте.' : 'Условие (i <= 5) — на месте.'} А ошибка в части <b>шаг</b> — в какую сторону меняется i?</> })}</p></div>)
                : (<div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Eslang: sikl to'xtashi uchun i <b style={{ color: T.ink }}>shartga yaqinlashishi</b> kerak. Bu yerda i 5 ga tomon ketyaptimi yoki undan <b style={{ color: T.ink }}>uzoqlashyaptimi?</b></>, ru: <>Помните: чтобы цикл остановился, i должен <b style={{ color: T.ink }}>приближаться к условию</b>. Здесь i идёт к 5 или <b style={{ color: T.ink }}>удаляется от неё?</b></> })}</p></div>)
            )}
            {found && !fixed && (<div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>✓ {tr({ uz: 'Topdingiz!', ru: 'Нашли!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">i--</span> i ni <b>kamaytiradi</b> (1, 0, -1, …) — 5 ga hech qachon yetmaydi. To'g'risi: <span className="mono">i++</span>. Chap tugmani bosing →</>, ru: <><span className="mono">i--</span> <b>уменьшает</b> i (1, 0, -1, …) — до 5 не дойдёт никогда. Правильно: <span className="mono">i++</span>. Нажмите кнопку слева →</> })}</p></div>)}
            {fixed && (<div className="takeaway fade-step"><div className="ta-bulb">🛠️</div><p className="ta-h">{tr({ uz: 'Topdingiz va tuzatdingiz — bu debugging!', ru: 'Нашли и исправили — это дебаггинг!' })}</p><p className="ta-sub">{tr({ uz: 'Cheksiz sikl — qadam shartga yaqinlashmaganda yuz beradi', ru: 'Бесконечный цикл случается, когда шаг не приближает к условию' })}</p></div>)}
            <div className="fade-up delay-2"><SiklZavodi count={fixed ? 5 : 8} max={5} init="i = 1" cond="i <= 5" step={fixed ? 'i++' : 'i--'} cheksiz={!fixed} done={fixed} compact /></div>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — YAKUNIY (for siklni o'zi yozadi) =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const isMentorLive = !!(_gate.live && _gate.live.mode === 'mentor'); // proyektorda mentor kod yozmaydi — gate uni qulflamasin
  const [value, setValue] = useState(storedAnswer?.picked || '');
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const v = value.trim();
  const hasFor = /^for\b/.test(v);
  const hasParen = /^for\s*\(.+\)/.test(v);
  const hasCond = /(<=|<|>=|>)/.test(v);
  const hasStep = /(\+\+|\+=)/.test(v);
  const hasBrace = /\{/.test(v);
  const valid = /^for\s*\([^)]*(<=|<|>=|>)[^)]*(\+\+|\+=)[^)]*\)\s*\{/.test(v);
  useEffect(() => { if (valid && !passed) { setPassed(true); onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'for siklini yozing', studentAnswer: value, correct: true, firstAttemptCorrect: true, solved: true, picked: value }); } }, [valid]);
  // Qo'shimcha mini-mashqlar: while sharti + i++ qadami (yengil input-validatsiya, kompilatorsiz)
  const [wv, setWv] = useState(storedAnswer?.correct ? 'i <= 10' : '');
  const [sv, setSv] = useState(storedAnswer?.correct ? 'i += 2' : '');
  const whileOk = /i\s*<=?\s*1[01]/.test(wv.trim());
  const stepOk = /\+=\s*2|i\s*=\s*i\s*\+\s*2/.test(sv.trim());
  const allDone = passed && whileOk && stepOk;
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? false : !allDone} label={isMentorLive ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (allDone ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (passed ? tr({ uz: "Mini-mashqlarni to'ldiring", ru: 'Заполните мини-задания' }) : tr({ uz: 'Siklni yozing', ru: 'Напишите цикл' })))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: <span className="mono italic" style={{ color: T.accent }}>for</span> siklini o'zingiz yozing.</>, ru: <>Последний шаг: напишите цикл <span className="mono italic" style={{ color: T.accent }}>for</span> сами.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Navbat sizga! 1 dan 5 gacha sanaydigan <span className="mono">for</span> siklini yozing. Pastda <b style={{ color: T.ink }}>namuna</b> turibdi — xuddi shunday yozing. To'g'ri yozsangiz, har bir belgi <b style={{ color: T.success }}>yashil</b> yonadi. ✓</>, ru: <>Ваш ход! Напишите цикл <span className="mono">for</span>, считающий от 1 до 5. Внизу есть <b style={{ color: T.ink }}>образец</b> — пишите точно так же. Напишете верно — каждая метка загорится <b style={{ color: T.success }}>зелёным</b>. ✓</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Namuna — shunday yozing', ru: 'Образец — пишите так же' })}</p>
            <div className="codebox fade-up delay-1" style={{ opacity: 0.85 }}>
              <div><KW>for</KW> (<KW>let</KW> i = <NUM>1</NUM>; i &lt;= <NUM>5</NUM>; i++) {'{'}</div>
            </div>
            <p className="flow-label" style={{ marginTop: 4 }}>{tr({ uz: 'Bu yerga yozing 👇', ru: 'Пишите сюда 👇' })}</p>
            <input className="fade-up delay-2" value={value} onChange={e => setValue(e.target.value)} placeholder={'for (let i = 1; i <= 5; i++) {'} spellCheck={false} autoCapitalize="off" autoCorrect="off" style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: 16, padding: '14px 16px', borderRadius: 12, border: 'none', background: T.paper, color: T.ink, outline: 'none', transition: 'box-shadow 0.2s', boxShadow: valid ? `0 0 0 2px ${T.success}, 0 8px 20px -8px rgba(${T.shadowBase},0.2)` : `0 4px 14px -6px rgba(${T.shadowBase},0.16)` }} />
            <div className="fade-up delay-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tagpill" style={{ opacity: hasFor ? 1 : 0.4 }}>{hasFor ? '✓' : '1'} for</span>
              <span className="tagpill" style={{ opacity: hasParen ? 1 : 0.4 }}>{hasParen ? '✓' : '2'} ( ... )</span>
              <span className="tagpill" style={{ opacity: hasCond ? 1 : 0.4 }}>{hasCond ? '✓' : '3'} {tr({ uz: 'shart', ru: 'условие' })}</span>
              <span className="tagpill" style={{ opacity: hasStep ? 1 : 0.4 }}>{hasStep ? '✓' : '4'} i++</span>
              <span className="tagpill" style={{ opacity: hasBrace ? 1 : 0.4 }}>{hasBrace ? '✓' : '5'} {'{'}</span>
            </div>
            {passed
              ? (<div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>✓ {tr({ uz: "Zo'r! Bu to'g'ri for sikli — endi kompyuter takrorlashni o'zi bajaradi!", ru: 'Класс! Это правильный цикл for — теперь компьютер повторяет сам!' })}</p></div>)
              : (<p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr({ uz: <>3 qism: boshlanish, shart (&lt; yoki &lt;=), qadam (i++). Oxirida {'{'} ni unutmang.</>, ru: <>3 части: старт, условие (&lt; или &lt;=), шаг (i++). Не забудьте {'{'} в конце.</> })}</p>)}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija', ru: 'результат' })}</p>
            <div style={{ background: T.paper, borderRadius: 14, minHeight: 130, padding: '20px', boxShadow: `0 8px 22px -10px rgba(${T.shadowBase},0.16)`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              {valid
                ? <div className="fade-step"><div style={{ fontSize: 36 }}>🔁</div><p style={{ fontFamily: "'Source Serif 4',serif", color: T.success, fontWeight: 700, margin: '8px 0 4px', fontSize: 'clamp(16px,2.4vw,20px)' }}>{tr({ uz: 'Sikl tayyor!', ru: 'Цикл готов!' })}</p><p className="mono small" style={{ margin: 0, color: T.ink2 }}>1 → 2 → 3 → 4 → 5</p></div>
                : <p style={{ fontFamily: "'Source Serif 4',serif", color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "To'liq yozing:", ru: 'Напишите полностью:' })} <span className="mono" style={{ fontStyle: 'normal' }}>{'for ( ... ) {'}</span></p>}
            </div>
          </Col>
        </div>
        </Zoomable>
        <div className="split fade-up delay-3">
          <div className="mini-task">
            <p className="flow-label">{tr({ uz: <>Mini-mashq 1 — <b>while</b> sharti</>, ru: <>Мини-задание 1 — условие <b>while</b></> })}</p>
            <p className="body" style={{ margin: '0 0 8px', color: T.ink2, fontSize: 13 }}>{tr({ uz: <>i <b>10 dan oshmaguncha</b> davom etsin. Shartni yozing:</>, ru: <>Пусть продолжается, пока i <b>не превысит 10</b>. Напишите условие:</> })}</p>
            <input value={wv} onChange={e => setWv(e.target.value)} placeholder={'i <= 10'} spellCheck={false} autoCapitalize="off" autoCorrect="off" style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: 15, padding: '11px 14px', borderRadius: 11, border: 'none', background: T.paper, color: T.ink, outline: 'none', boxShadow: whileOk ? `0 0 0 2px ${T.success}` : `0 4px 14px -6px rgba(${T.shadowBase},0.16)` }} />
            {whileOk && <p className="body" style={{ margin: '8px 0 0', color: T.success, fontSize: 13, fontWeight: 600 }}>✓ {tr({ uz: "To'g'ri — i 10 gacha davom etadi.", ru: 'Верно — i идёт до 10.' })}</p>}
          </div>
          <div className="mini-task">
            <p className="flow-label">{tr({ uz: <>Mini-mashq 2 — <b>qadam</b></>, ru: <>Мини-задание 2 — <b>шаг</b></> })}</p>
            <p className="body" style={{ margin: '0 0 8px', color: T.ink2, fontSize: 13 }}>{tr({ uz: <>Har aylanishda i <b>2 ga oshsin</b> (juft sonlar). Qadamni yozing:</>, ru: <>Пусть i растёт <b>на 2</b> за итерацию (чётные числа). Напишите шаг:</> })}</p>
            <input value={sv} onChange={e => setSv(e.target.value)} placeholder={'i += 2'} spellCheck={false} autoCapitalize="off" autoCorrect="off" style={{ width: '100%', fontFamily: "'JetBrains Mono', monospace", fontSize: 15, padding: '11px 14px', borderRadius: 11, border: 'none', background: T.paper, color: T.ink, outline: 'none', boxShadow: stepOk ? `0 0 0 2px ${T.success}` : `0 4px 14px -6px rgba(${T.shadowBase},0.16)` }} />
            {stepOk && <p className="body" style={{ margin: '8px 0 0', color: T.success, fontSize: 13, fontWeight: 600 }}>✓ {tr({ uz: "To'g'ri — i 2, 4, 6, 8, 10 bo'ladi.", ru: 'Верно — i будет 2, 4, 6, 8, 10.' })}</p>}
          </div>
        </div>
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
  const RECAP = [{ uz: "Sikl — bir amalni ko'p marta takrorlaydi", ru: 'Цикл повторяет действие много раз' }, { uz: 'for — 3 qism: boshlanish, shart, qadam', ru: 'for — 3 части: старт, условие, шаг' }, { uz: 'while — shart rost ekan takrorlaydi', ru: 'while повторяет, пока условие истинно' }, { uz: 'Massiv — qutilar qatori, indeks 0 dan', ru: 'Массив — ряд коробок, индекс с 0' }, { uz: 'Aylanib chiqish — for + massiv[i] + .length', ru: 'Обход — for + massiv[i] + .length' }];
  const HOMEWORK = [{ b: { uz: '1 dan 20 gacha', ru: 'От 1 до 20' }, t: { uz: '— for sikli bilan barcha sonlarni chop eting', ru: '— выведите все числа циклом for' } }, { b: { uz: "O'z ro'yxatingiz", ru: 'Свой список' }, t: { uz: '— 5 ta sevimli narsangizni massivga solib, sikl bilan aylanib chiqing', ru: '— положите 5 любимых вещей в массив и обойдите его циклом' } }, { b: { uz: 'Juft sonlar', ru: 'Чётные числа' }, t: { uz: '— 2 dan 10 gacha faqat juft sonlarni chiqaring (i += 2)', ru: '— выведите только чётные от 2 до 10 (i += 2)' } }];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })} ✓</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>takrorlashni</span> kompyuterga topshirasiz.</>, ru: <>Теперь <span className="italic" style={{ color: T.accent }}>повторение</span> вы поручаете компьютеру.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: 'Tabriklaymiz! for, while va massivni aylanib chiqish — hammasini egalladingiz. Bu — dasturlashning yuragi.', ru: 'Поздравляем! for, while и обход массива — вы освоили всё. Это — сердце программирования.' }) : tr({ uz: "Yaxshi harakat! Sikllar muhim — bir-ikki ekranni qayta ko'rib mustahkamlang.", ru: 'Хорошая попытка! Циклы важны — пересмотрите пару экранов и закрепите.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark
            stats={false}
            liveOn={studentLive}
            disabled={studentWait}
            onClick={studentWait ? undefined : openArena}
            hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined}
          />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>📝 {tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: 'Sikllar bilan mashq qiling:', ru: 'Потренируйтесь с циклами:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "Sikllar — eng ko'p ishlatiladigan vosita. Mashq qilsangiz, qo'lingizga o'tirib qoladi! 🚀", ru: 'Циклы — самый используемый инструмент. Потренируетесь — и рука набьётся! 🚀' })}</p></div>
        </div>
        <div className="card ach-coll fade-up d3">
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
        </div>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT
// Podium yorliqlari (scored indeks -> qisqa nom)
const Q_LABELS = { 4: { uz: "1 — i++ qadami", ru: '1 — шаг i++' }, 6: { uz: "2 — Sikl natijasi", ru: '2 — Результат цикла' }, 10: { uz: "3 — Massiv indeksi", ru: '3 — Индекс массива' }, 13: { uz: "4 — Necha marta", ru: '4 — Сколько раз' }, 16: { uz: "5 — for yoz", ru: '5 — Напиши for' } };

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
const INLINE_KEYS = { s4: 1, s5b: 0, s9: 1, s12: 1, s15: -1 };

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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верных)</> })}</p>}
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
              {live.mode === 'mentor' && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.', ru: 'Вопросы со значком ⚠️ — темы, где класс споткнулся. Рекомендуем объяснить их ещё раз.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== ⚔️ MUSTAHKAMLASH-JANG (Kahoot arena) =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi sikl-tokenlari (kodlash maktabi hissi)
const QZ_BG_SHAPES = [
  { ch: 'for',    l: 6,  t: 18, s: 36, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: '{ }',    l: 84, t: 12, s: 34, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: 'i++',    l: 9,  t: 74, s: 30, c: 'rgba(255,110,70,0.15)',  d: 27, dl: 0.8 },
  { ch: 'while',  l: 76, t: 70, s: 28, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: 'i <= 5', l: 44, t: 86, s: 26, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: 'i--',    l: 66, t: 24, s: 24, c: 'rgba(80,200,255,0.14)',  d: 17, dl: 0.4 },
  { ch: ';',      l: 24, t: 36, s: 26, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: 'i=1',    l: 92, t: 46, s: 24, c: 'rgba(120,235,175,0.13)', d: 24, dl: 1.3 },
  { ch: '[ ]',    l: 2,  t: 46, s: 26, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: "`for` siklining 3 qismi to'g'ri tartibda qaysi?", ru: 'Три части цикла `for` в правильном порядке?' }, opts: [{ uz: "boshlanish, shart, qadam", ru: 'старт, условие, шаг' }, { uz: "shart, qadam, boshlanish", ru: 'условие, шаг, старт' }, { uz: "qadam, boshlanish, shart", ru: 'шаг, старт, условие' }, { uz: "faqat shart", ru: 'только условие' }], correct: 0 },
  { q: { uz: "`let i = 1` — for siklining qaysi qismi?", ru: '`let i = 1` — какая это часть цикла for?' }, opts: [{ uz: "Boshlanish", ru: 'Старт' }, { uz: "Shart", ru: 'Условие' }, { uz: "Qadam", ru: 'Шаг' }, { uz: "Tana", ru: 'Тело' }], correct: 0 },
  { q: { uz: "`for (let i = 0; i < 3; i++)` sikli necha marta ishlaydi?", ru: 'Сколько раз сработает цикл `for (let i = 0; i < 3; i++)`?' }, opts: ["3", "2", "4", { uz: "cheksiz", ru: 'бесконечно' }], correct: 0 },
  { q: { uz: "`i++` har aylanishda `i` ni nima qiladi?", ru: 'Что `i++` делает с `i` на каждой итерации?' }, opts: [{ uz: "1 ga kamaytiradi", ru: 'уменьшает на 1' }, { uz: "1 ga oshiradi", ru: 'увеличивает на 1' }, { uz: "0 qiladi", ru: 'обнуляет' }, { uz: "o'zgartirmaydi", ru: 'не меняет' }], correct: 1 },
  { q: { uz: "Sikl qachon to'xtaydi?", ru: 'Когда цикл останавливается?' }, opts: [{ uz: "`i = 0` bo'lganda", ru: 'когда `i = 0`' }, { uz: "Shart noto'g'ri (`false`) bo'lganda", ru: 'когда условие ложно (`false`)' }, { uz: "Hech qachon to'xtamaydi", ru: 'никогда не останавливается' }, { uz: "Birinchi aylanishdan keyin", ru: 'после первой итерации' }], correct: 1 },
  { q: { uz: "Cheksiz sikl qachon yuzaga keladi?", ru: 'Когда возникает бесконечный цикл?' }, opts: [{ uz: "Shart juda katta bo'lsa", ru: 'если условие слишком большое' }, { uz: "Qadam shartga yaqinlashmasa", ru: 'если шаг не приближает к условию' }, { uz: "Massiv bo'sh bo'lsa", ru: 'если массив пустой' }, { uz: "`i` ni yozib qo'ysak", ru: 'если записать `i`' }], correct: 1 },
  { q: { uz: "Massivda indekslar nechadan boshlanadi?", ru: 'С чего начинаются индексы в массиве?' }, opts: [{ uz: "1 dan", ru: 'с 1' }, { uz: "-1 dan", ru: 'с -1' }, { uz: "0 dan", ru: 'с 0' }, { uz: "uzunligidan", ru: 'с длины' }], correct: 2 },
  { q: { uz: "`['a','b','c']` massivida `'c'` ning indeksi qaysi?", ru: "Какой индекс у `'c'` в массиве `['a','b','c']`?" }, opts: ["1", "3", "2", "0"], correct: 2 },
  { q: { uz: "`massiv.length` nimani beradi?", ru: 'Что даёт `massiv.length`?' }, opts: [{ uz: "Birinchi element", ru: 'Первый элемент' }, { uz: "Oxirgi indeksni", ru: 'Последний индекс' }, { uz: "Elementlar sonini", ru: 'Число элементов' }, { uz: "Massiv nomini", ru: 'Имя массива' }], correct: 2 },
  { q: { uz: "`for (let i=1; i<=10; i+=2)` qaysi sonlarni beradi?", ru: 'Какие числа даст `for (let i=1; i<=10; i+=2)`?' }, opts: ["1,2,3,...,10", { uz: "faqat 10", ru: 'только 10' }, "2,4,6,8,10", "1,3,5,7,9"], correct: 3 },
  { q: { uz: "`while` sikli qachon ishlaydi?", ru: 'Когда работает цикл `while`?' }, opts: [{ uz: "Massiv mavjud bo'lganda", ru: 'Пока существует массив' }, { uz: "Faqat bir marta ishlaydi", ru: 'Только один раз' }, { uz: "Har doim aniq 10 marta", ru: 'Всегда ровно 10 раз' }, { uz: "Shart to'g'ri (`true`) bo'lguncha", ru: 'Пока условие истинно (`true`)' }], correct: 3 },
  { q: { uz: "Massivni to'liq aylanish uchun shart qanday yoziladi?", ru: 'Как пишется условие для полного обхода массива?' }, opts: ["`i <= massiv.length`", "`i == massiv.length`", "`i > 0`", "`i < massiv.length`"], correct: 3 },
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

// Jonli fon: suzuvchi uchqunlar + «web» chiziqlari + sikl tokenlari (canvas)
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['for', 'while', 'i++', 'i<=5', '{ }', 'i=1', '[ ]', ';'];
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
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закрыть, ученики останутся ждать в арене.\nПотом можно вернуться ровно к этому месту через «⚔️ Продолжить».\n\nВсё равно закрыть?' }))) return;
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
          <button className="qz-btn" onClick={startPractice}>📖 {tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме тренировки' })}</button>
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
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>▶ {tr({ uz: 'Testni boshlash', ru: 'Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">⏳ {tr({ uz: 'Mentor testni boshlashini kuting…', ru: 'Ждите, пока ментор начнёт тест…' })}</p>}
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Xato — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Побыстрее! ⏱' })}</span>}
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
              <p className="qz-sub">{tr({ uz: `ball · ${soloScore.ok}/${QUIZ_BANK.length} to'g'ri${soloScore.maxStreak >= 2 ? ` · eng uzun streak 🔥x${soloScore.maxStreak}` : ''}`, ru: `баллов · ${soloScore.ok}/${QUIZ_BANK.length} верных${soloScore.maxStreak >= 2 ? ` · лучший стрик 🔥x${soloScore.maxStreak}` : ''}` })}</p>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ {tr({ uz: 'Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: 'Пройти тест ещё раз — тренировка (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

// ===== 🏅 ACHIEVEMENTS (nishonlar) — dars davomidagi real bosqichlar uchun =====
const ACHIEVEMENTS = {
  loopstarter:    { icon: '🔁', name: 'Loop Starter',    desc: { uz: "Birinchi sikl testini yechdingiz", ru: 'Вы решили первый тест по циклам' } },
  infinitytamer:  { icon: '♾️', name: 'Infinity Tamer',  desc: { uz: "Cheksiz siklni topib to'xtatdingiz", ru: 'Вы нашли и остановили бесконечный цикл' } },
  assemblymaster: { icon: '🔧', name: 'Assembly Master', desc: { uz: "Birinchi siklingizni o'zingiz yozdingiz", ru: 'Вы сами написали свой первый цикл' } },
  graduate:       { icon: '🏆', name: 'Level Up!',       desc: { uz: "Sikllar darsini to'liq yakunladingiz", ru: 'Вы полностью завершили урок о циклах' } },
};
// Ekran id → nishon (recordAnswer'da avtomatik beriladi — faqat SCORED test / challenge)
const ACH_TRIGGERS = { s4: 'loopstarter', s14: 'infinitytamer', s15: 'assemblymaster' };
// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI — yorqin nurlar, medal portlashi, uchqunlar, zarba to'lqini
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
// 🏅 Yuqori paneldagi nishon hisoblagichi — doim ko'rinadi, yangi olinganda pulslaydi, bosilsa ro'yxat chiqadi
function AchCounter() {
  const earned = useContext(AchCtx);
  const count = earned ? earned.size : 0;
  const total = Object.keys(ACHIEVEMENTS).length;
  const prevRef = useRef(count);
  const [bump, setBump] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (count > prevRef.current) { setBump(true); const t = setTimeout(() => setBump(false), 800); prevRef.current = count; return () => clearTimeout(t); }
    prevRef.current = count;
  }, [count]);
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

// ===== 🃏 FLASHCARDS (reusable, 3D flip — Quizlet uslubi) =====
const JS_LOOPS_FLASHCARDS = [
  { front: { uz: 'Amalni bir necha marta takrorlaydigan vosita', ru: 'Инструмент, повторяющий действие несколько раз' }, back: { uz: 'Sikl', ru: 'Цикл' }, note: 'for · while' },
  { front: { uz: "Sanab bo'ladigan sikl (3 qism)", ru: 'Цикл со счётом (3 части)' }, back: 'for', note: { uz: 'boshlanish; shart; qadam', ru: 'старт; условие; шаг' } },
  { front: { uz: "Shartga bog'liq sikl", ru: 'Цикл, зависящий от условия' }, back: 'while', note: { uz: "shart true bo'lguncha", ru: 'пока условие true' } },
  { front: { uz: 'Sikl boshida qiymat beriladi', ru: 'Значение задаётся в начале цикла' }, back: 'i = 1', note: { uz: 'boshlanish', ru: 'старт' } },
  { front: { uz: 'Sikl davom etish sharti', ru: 'Условие продолжения цикла' }, back: 'i <= 5', note: { uz: "true bo'lsa aylanadi", ru: 'крутится, пока true' } },
  { front: { uz: 'Har aylanishda i ni 1 ga oshiradi', ru: 'Увеличивает i на 1 за итерацию' }, back: 'i++', note: { uz: 'qadam', ru: 'шаг' } },
  { front: { uz: "Sikl qachon to'xtaydi", ru: 'Когда цикл останавливается' }, back: { uz: "Shart false bo'lganda", ru: 'Когда условие false' }, note: { uz: 'shart buzilsa', ru: 'условие нарушилось' } },
  { front: { uz: "Hech to'xtamaydigan sikl", ru: 'Цикл, который не останавливается' }, back: { uz: 'Cheksiz sikl', ru: 'Бесконечный цикл' }, note: { uz: 'qadam shartga yaqinlashmasa', ru: 'шаг не приближает к условию' } },
  { front: { uz: "Qiymatlar ro'yxati", ru: 'Список значений' }, back: { uz: 'Massiv', ru: 'Массив' }, note: "['a','b','c']" },
  { front: { uz: 'Element raqami (0 dan boshlanadi)', ru: 'Номер элемента (начинается с 0)' }, back: { uz: 'Indeks', ru: 'Индекс' }, note: 'massiv[0]' },
  { front: { uz: 'Massivdagi elementlar soni', ru: 'Число элементов в массиве' }, back: 'massiv.length', note: { uz: "3 ta bo'lsa → 3", ru: 'если их 3 → 3' } },
  { front: { uz: "Massivning har elementini ko'rib chiqish", ru: 'Просмотр каждого элемента массива' }, back: { uz: 'Aylanib chiqish', ru: 'Обход' }, note: 'for + massiv.length' },
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'atama yodlandi', ru: 'терминов выучено' })}</p><button className="fc-btn ghost" onClick={restart}>↻ {tr({ uz: 'Qaytadan takrorlash', ru: 'Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Учим' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span><span className="fc-cue">{tr({ uz: 'Javob nima?', ru: 'Какой ответ?' })} 🤔 <span className="fc-tap">{tr({ uz: 'bosing', ru: 'нажмите' })}</span></span></div>
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
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Atamalarni <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <>Быстро <span className="italic" style={{ color: T.accent }}>повторим термины</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Darsni yakunlashdan oldin bugun o'rgangan atamalarni takrorlaymiz. Har kartada bir vazifa — <b style={{ color: T.ink }}>javobni</b> o'ylang, keyin kartani bosib tekshiring. <b style={{ color: T.ink }}>Bildim</b> yoki <b style={{ color: T.ink }}>Takrorlash</b> bilan baholang.</>, ru: <>Перед завершением урока повторим сегодняшние термины. На каждой карточке — задание: подумайте над <b style={{ color: T.ink }}>ответом</b>, затем нажмите на карточку и проверьте себя. Оцените кнопками <b style={{ color: T.ink }}>Знаю</b> или <b style={{ color: T.ink }}>Повторить</b>.</> })}</Mentor>
        <div className="fc-center"><Flashcards cards={JS_LOOPS_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

export default function JsLoopsLesson({ lang: langProp, onFinished }) {
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
  // 🃏 Flashcard jonli darsda FAQAT MENTORGA ko'rinadi (proyektorda jamoaviy
  // takrorlash uchun); jonli o'quvchidan yashirin — sakrab o'tiladi.
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () =>
    live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
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
  const reset = () => { setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  // 🏅 Yakuniy ekranga yetganda: bitiruvchi nishoni
  useEffect(() => { if (screen === TOTAL_SCREENS - 1) earn('graduate'); }, [screen]); // eslint-disable-line

  // Javob kaliti: inline testlar + jang savollari (QUIZ_BANK'dan) — mentor ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line

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

        /* === CODEBOX === */
        .codebox { background: ${CODE.bg}; border-radius: 12px; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: clamp(12.5px,1.6vw,14.5px); color: ${CODE.text}; line-height: 1.75; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.18); overflow-x: hidden; }
        .codebox > div { white-space: pre-wrap; word-break: break-word; }
        .for-pt { border-radius: 5px; padding: 1px 5px; font-weight: 700; }
        .for-init { background: rgba(1,154,203,0.22); color: #5BC8EC; }
        .for-cond { background: rgba(230,161,0,0.24); color: #F5C874; }
        .for-step { background: rgba(31,122,77,0.28); color: #6FD79E; }
        .tok-bad { background: rgba(255,79,40,0.22); color: #FF9777; border-radius: 4px; padding: 1px 4px; }
        .tok-ok { background: rgba(31,122,77,0.28); color: #6FD79E; border-radius: 4px; padding: 1px 4px; }

        /* === AI CARD / DEBUGGING / TAGPILL === */
        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: clamp(12.5px,1.7vw,14px); color: ${CODE.text}; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; white-space: pre-wrap; word-break: break-word; }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

        /* === TERMINAL === */
        .term { background: ${CODE.bg}; border-radius: 12px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.18); overflow: hidden; }
        .term-bar { display: flex; align-items: center; gap: 6px; padding: 9px 13px; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .term-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .term-title { font-family: 'JetBrains Mono'; font-size: 11px; color: ${CODE.comment}; margin-left: 6px; }
        .term-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 5px; font-family: 'JetBrains Mono'; font-size: clamp(12.5px,1.6vw,14px); color: ${CODE.text}; min-height: 64px; }
        .term-line { display: flex; gap: 9px; animation: el-pop 0.25s ease-out; }
        .term-arrow { color: ${T.success}; flex-shrink: 0; }
        .term-empty { color: ${CODE.comment}; font-style: italic; margin: 0; font-family: 'JetBrains Mono'; font-size: 13px; }

        /* === IWATCH (i qiymati) === */
        .iwatch { display: flex; align-items: baseline; gap: 9px; background: ${T.paper}; border-radius: 12px; padding: 12px 18px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .iwatch-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink3}; }
        .iwatch-eq { font-family: 'JetBrains Mono'; font-size: 18px; color: ${T.ink2}; }
        .iwatch-num { font-family: 'Fraunces', serif; font-size: clamp(34px,7vw,52px); color: ${T.accent}; line-height: 1; }

        /* === LEGEND === */
        .legend { display: flex; flex-direction: column; gap: 7px; }
        .legend-row { display: flex; align-items: center; gap: 9px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink}; }
        .legend-row b { font-weight: 700; }
        .lg-dot { width: 11px; height: 11px; border-radius: 3px; flex-shrink: 0; }

        /* === ARRAY === */
        .arr-row { display: flex; flex-wrap: wrap; gap: 9px; }
        .arr-cell { display: flex; flex-direction: column; align-items: center; gap: 3px; border: none; cursor: pointer; background: ${T.paper}; border-radius: 12px; padding: 12px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: all 0.18s; font-family: 'Manrope'; }
        .arr-cell:hover { transform: translateY(-2px); }
        .arr-cell.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 22px -6px rgba(255,79,40,0.35); transform: translateY(-3px) scale(1.04); background: ${T.accentSoft}; }
        .arr-cell.scan { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 22px -6px rgba(255,79,40,0.4); background: ${T.accentSoft}; transform: translateY(-3px) scale(1.04); }
        .arr-emoji { font-size: 26px; }
        .arr-name { font-weight: 600; font-size: 12.5px; color: ${T.ink}; }
        .arr-idx { font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${T.accent}; }

        /* === GLASS (while) === */
        .glass-wrap { display: flex; flex-direction: column; align-items: center; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: 20px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .glass { position: relative; width: 86px; height: 124px; border: 3px solid ${T.ink3}; border-top: none; border-radius: 6px 6px 16px 16px; overflow: hidden; background: rgba(1,154,203,0.04); }
        .glass-fill { position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(180deg, #4FC3E8, #019ACB); transition: height 0.45s cubic-bezier(.4,0,.2,1); }
        .glass-pct { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 18px; color: ${T.ink}; mix-blend-mode: difference; filter: invert(1); }

        /* === MSG LIST (hook) === */
        .msg-list { display: flex; flex-direction: column; gap: 6px; max-height: 230px; overflow-y: auto; background: ${T.paper}; border-radius: 12px; padding: 13px 15px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .msg-line { display: flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-size: 13.5px; color: ${T.ink}; }
        .msg-ok { flex-shrink: 0; }

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
        .mini-task { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.14); } .mini-task b { color: ${T.ink}; }

        /* === 🏭 SIKL ZAVODI (konveyer mashina skeleti) === */
        .zavod { position: relative; display: flex; flex-direction: column; gap: 12px; background: linear-gradient(160deg, #FFFFFF, #F1EDE4); border: 1.5px solid ${T.line}; border-radius: 18px; padding: 16px; box-shadow: 0 12px 30px -14px rgba(${T.shadowBase},0.22); transition: border-color 0.3s, box-shadow 0.3s, background 0.3s; }
        .zavod-sm { padding: 12px; gap: 9px; }
        .zavod.zavod-cheksiz { border-color: ${T.accent}; background: linear-gradient(160deg, #FFF3EF, #FFE1D7); box-shadow: 0 0 0 3px ${T.accentSoft}, 0 14px 34px -12px rgba(255,79,40,0.4); animation: zv-shake 0.5s ease-in-out infinite; }
        @keyframes zv-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
        @media (prefers-reduced-motion: reduce) { .zavod.zavod-cheksiz { animation: none; } }
        .zavod.zavod-done { border-color: ${T.success}; background: linear-gradient(160deg, #FFFFFF, #EAF6EE); }
        .zavod-levers { display: flex; gap: 8px; }
        .zv-lever { position: relative; flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; border-radius: 11px; padding: 10px 6px 8px; text-align: center; overflow: hidden; }
        .zv-lever::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
        .zv-lever .zv-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.04em; }
        .zv-lever .zv-code { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .zv-init { background: ${T.blueSoft}; box-shadow: inset 0 0 0 1.5px ${T.blue}55; } .zv-init .zv-lbl { color: ${T.blue}; } .zv-init::before { background: ${T.blue}; }
        .zv-cond { background: ${T.sunSoft}; box-shadow: inset 0 0 0 1.5px ${T.sun}55; } .zv-cond .zv-lbl { color: ${T.sun}; } .zv-cond::before { background: ${T.sun}; }
        .zv-step { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}55; } .zv-step .zv-lbl { color: ${T.success}; } .zv-step::before { background: ${T.success}; }
        .zavod-body { display: flex; align-items: center; gap: 12px; }
        .zavod-tablo { flex-shrink: 0; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 90px; height: 72px; border-radius: 14px; background: linear-gradient(180deg, #1F2B40, #141C2B); border: 2px solid #2C3A52; box-shadow: inset 0 2px 8px rgba(0,0,0,0.55), 0 5px 14px -7px rgba(0,0,0,0.45); }
        .zavod-sm .zavod-tablo { width: 78px; height: 62px; }
        .zv-tablo-lbl { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #7DD181; letter-spacing: 0.16em; opacity: 0.85; }
        .zv-tablo-num { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 34px; line-height: 1; color: #7DD181; text-shadow: 0 0 14px rgba(125,209,129,0.7); animation: zv-flip 0.3s cubic-bezier(.34,1.4,.4,1); }
        .zavod-sm .zv-tablo-num { font-size: 28px; }
        .zavod-cheksiz .zavod-tablo { border-color: #7A2A1E; box-shadow: inset 0 2px 8px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,79,40,0.35), 0 5px 14px -7px rgba(0,0,0,0.45); }
        .zavod-cheksiz .zv-tablo-lbl { color: #FFB4A0; }
        .zavod-cheksiz .zv-tablo-num { color: #FF8A6E; text-shadow: 0 0 14px rgba(255,79,40,0.75); }
        @keyframes zv-flip { from { transform: translateY(-40%); opacity: 0; } }
        .zavod-belt { flex: 1; display: flex; align-items: center; justify-content: space-around; height: 22px; border-radius: 99px; background: repeating-linear-gradient(90deg, ${T.ink3}33 0 8px, transparent 8px 16px); background-size: 16px 100%; animation: zv-belt-move 0.85s linear infinite; }
        @keyframes zv-belt-move { to { background-position: -16px 0; } }
        .zavod-cheksiz .zavod-belt { animation-duration: 0.24s; }
        .zavod-done .zavod-belt { animation-play-state: paused; }
        .zv-belt-arrow { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${T.ink3}; font-size: 15px; transition: color 0.3s; animation: zv-arrow-flow 1.05s linear infinite; }
        .zv-belt-arrow:nth-child(2) { animation-delay: 0.18s; }
        .zv-belt-arrow:nth-child(3) { animation-delay: 0.36s; }
        @keyframes zv-arrow-flow { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        .zavod-cheksiz .zv-belt-arrow { color: ${T.accent}; animation-duration: 0.42s; }
        .zavod-done .zv-belt-arrow { animation-play-state: paused; opacity: 0.55; }
        .zavod-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .zv-start { font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: #FFFFFF; background: linear-gradient(180deg, #2FA968, #1F7A4D); border: none; border-radius: 12px; padding: 12px 20px; cursor: pointer; box-shadow: 0 8px 18px -6px rgba(31,122,77,0.55), inset 0 1px 0 rgba(255,255,255,0.25); transition: transform 0.12s, box-shadow 0.2s, filter 0.2s; }
        .zv-start:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 24px -7px rgba(31,122,77,0.6), inset 0 1px 0 rgba(255,255,255,0.25); }
        .zv-start:active:not(:disabled) { transform: translateY(1px); }
        .zv-start:disabled { filter: grayscale(0.5) opacity(0.55); cursor: default; }
        .zavod-bin { display: flex; flex-wrap: wrap; gap: 6px; min-height: 44px; align-content: flex-start; background: ${T.bg}; border-radius: 12px; padding: 9px; box-shadow: inset 0 2px 8px -4px rgba(${T.shadowBase},0.2); }
        .zv-bin-empty { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink3}; font-style: italic; }
        .zv-box { position: relative; display: inline-flex; align-items: center; gap: 3px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: ${T.ink}; background: ${T.paper}; border-radius: 8px; padding: 4px 8px; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.25); transform-origin: top center; animation: zv-box-drop 0.5s cubic-bezier(.34,1.56,.5,1) both; }
        .zv-box b { color: ${T.accent}; }
        @keyframes zv-box-drop { 0% { opacity: 0; transform: translateY(-24px) scale(0.55); } 55% { opacity: 1; transform: translateY(3px) scale(1.1); } 75% { transform: translateY(-1px) scale(0.96); } 100% { transform: translateY(0) scale(1); } }
        .zavod-cheksiz .zv-box { animation: zv-box-jitter 0.34s ease-in-out infinite; }
        @keyframes zv-box-jitter { 0%,100% { transform: translateY(0) rotate(-2.5deg); } 50% { transform: translateY(-2px) rotate(2.5deg); } }
        .zavod-done .zavod-tablo { animation: zv-ding 0.75s ease-out; }
        @keyframes zv-ding { 0% { box-shadow: inset 0 2px 8px rgba(0,0,0,0.55), 0 0 0 0 rgba(125,209,129,0), 0 5px 14px -7px rgba(0,0,0,0.45); } 28% { box-shadow: inset 0 2px 8px rgba(0,0,0,0.55), 0 0 0 7px rgba(125,209,129,0.55), 0 5px 14px -7px rgba(0,0,0,0.45); } 100% { box-shadow: inset 0 2px 8px rgba(0,0,0,0.55), 0 0 0 0 rgba(125,209,129,0), 0 5px 14px -7px rgba(0,0,0,0.45); } }
        .zavod-done .zv-tablo-num { animation: zv-flip 0.3s cubic-bezier(.34,1.4,.4,1), zv-ding-glow 0.75s ease-out; }
        @keyframes zv-ding-glow { 0%,100% { text-shadow: 0 0 14px rgba(125,209,129,0.7); } 30% { text-shadow: 0 0 22px rgba(125,209,129,1), 0 0 6px #fff; } }
        @media (prefers-reduced-motion: reduce) {
          .zavod-belt, .zv-belt-arrow { animation: none !important; }
          .zv-box, .zavod-cheksiz .zv-box { animation: fade-step 0.3s both !important; }
          .zavod-done .zavod-tablo, .zavod-done .zv-tablo-num { animation: none !important; }
        }
        .zavod-alert { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; text-align: center; }
        .zavod-ding { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.success}; background: ${T.successSoft}; border-radius: 10px; padding: 9px 12px; text-align: center; animation: fade-step 0.3s; }
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
        .fc-card { position: relative; height: clamp(160px,26vw,188px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
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

        /* === 🏅 ACHIEVEMENTS — to'liq-ekran nishon bayrami === */
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

        /* kod atamasi chipi — savol/variant/izohlarda oddiy matndan ajralib turadi */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        /* Jonli holat lentasi — sokin (0.4), hover'da to'liq ko'rinadi */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* ===== QO'SHIMCHA ANIMATSIYALAR (v16 yaxshilash) ===== */
        /* S0 — charchoq o'lchagich */
        .fatigue { height: 11px; border-radius: 99px; background: rgba(167,166,162,0.28); overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.12); }
        .fatigue-bar { height: 100%; border-radius: 99px; transition: width 0.35s cubic-bezier(.4,0,.2,1), background 0.35s ease; box-shadow: 0 0 10px -2px currentColor; }
        @keyframes wobble { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-2.5deg)} 75%{transform:rotate(2.5deg)} }
        .btn-tired { animation: wobble 0.45s ease-in-out infinite; }
        @keyframes pop-face { 0%{transform:scale(0.4); opacity:0;} 60%{transform:scale(1.25);} 100%{transform:scale(1); opacity:1;} }
        .face-pop { display: inline-block; animation: pop-face 0.4s cubic-bezier(.34,1.4,.4,1); }

        /* S1 — reja ikonkalari */
        @keyframes spin360 { to { transform: rotate(360deg); } }
        .ic-spin { display: inline-block; animation: spin360 2.6s linear infinite; }
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .ic-float { display: inline-block; animation: floaty 2.4s ease-in-out infinite; }
        .mini-arr { display: flex; gap: 5px; margin-top: 9px; }
        .mini-cell { width: 27px; height: 27px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; color: ${T.ink2}; background: ${T.bg}; animation: cellwave 2.4s ease-in-out infinite; }
        @keyframes cellwave { 0%,100%{ background: ${T.bg}; color: ${T.ink2}; transform: translateY(0);} 50%{ background: ${T.accent}; color:#fff; transform: translateY(-5px); box-shadow: 0 6px 14px -5px rgba(255,79,40,0.45);} }

        /* S3 — for dastaklari */
        .stair-strip { display: flex; align-items: flex-end; gap: 6px; height: 104px; background: ${T.paper}; border-radius: 12px; padding: 10px 12px 8px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .stair-col { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 3px; height: 100%; }
        .stair-bar { width: 100%; border-radius: 5px 5px 0 0; background: rgba(167,166,162,0.3); transition: background 0.35s ease, box-shadow 0.35s ease; }
        .stair-bar.lit { background: linear-gradient(180deg, #6FD79E, ${T.success}); box-shadow: 0 0 14px rgba(31,122,77,0.4); }
        .stair-walker { font-size: 19px; animation: hop 0.5s ease; }
        @keyframes hop { 0%{transform:translateY(-9px)} 60%{transform:translateY(2px)} 100%{transform:translateY(0)} }
        .stair-n { font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; color: ${T.ink3}; }
        .stair-bar.lit + .stair-n, .stair-col.on .stair-n { color: ${T.success}; }

        /* S5 — son chizig'i */
        .numline { display: flex; flex-wrap: wrap; gap: 5px; }
        .num-cell { width: 31px; height: 31px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12.5px; background: ${T.bg}; color: ${T.ink3}; transition: all 0.3s cubic-bezier(.4,0,.2,1); }
        .num-cell.hit { background: ${T.accent}; color: #fff; transform: translateY(-3px) scale(1.06); box-shadow: 0 6px 15px -5px rgba(255,79,40,0.5); }

        /* S6 — stakan qo'shimchalari */
        .glass-wave { position: absolute; top: -5px; left: -4%; width: 108%; height: 11px; background: #5BC8EC; border-radius: 50%; animation: bob 1.05s ease-in-out infinite; }
        @keyframes bob { 0%,100%{transform: scaleX(1.05) translateY(0);} 50%{transform: scaleX(0.95) translateY(2px);} }
        .tap-emoji { font-size: 30px; position: relative; display: inline-block; }
        .drip { position: absolute; left: 50%; top: 88%; font-size: 14px; animation: dripfall 0.5s linear infinite; }
        @keyframes dripfall { 0%{ opacity: 0; transform: translate(-50%, 0);} 20%{opacity:1;} 100%{ opacity: 0; transform: translate(-50%, 46px);} }
        .splash { position: absolute; top: 10px; left: 50%; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 15px; color: ${T.blue}; animation: floatup 0.72s ease-out; }
        @keyframes floatup { from { opacity: 1; transform: translate(-50%, 8px);} to { opacity: 0; transform: translate(-50%, -24px);} }
        .cond-pill { font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 700; padding: 6px 13px; border-radius: 99px; transition: all 0.3s ease; }

        /* S7 — karta ikonkalari + misol satrlari */
        @keyframes pulseq { 0%,100%{transform:scale(1); opacity:1;} 50%{transform:scale(1.16); opacity:0.65;} }
        .pulse-q { display:inline-block; animation: pulseq 1.4s ease-in-out infinite; }
        .ex-row { animation: el-pop 0.32s ease-out both; }

        /* S11 — do'stlar */
        .friend-card { display: flex; align-items: center; gap: 11px; background: ${T.paper}; border-radius: 12px; padding: 10px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: all 0.4s cubic-bezier(.4,0,.2,1); opacity: 0.5; }
        .friend-card.got { opacity: 1; box-shadow: inset 0 0 0 1.5px ${T.success}, 0 8px 20px -6px rgba(31,122,77,0.25); }
        .friend-ava { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; background: ${T.accentSoft}; flex-shrink: 0; transition: background 0.35s; }
        .friend-card.got .friend-ava { background: ${T.successSoft}; animation: hop 0.5s ease; }
        .friend-name { font-weight: 600; font-size: 14px; color: ${T.ink}; }
        .friend-msg { font-size: 12px; color: ${T.ink2}; }
        .friend-status { margin-left: auto; font-size: 17px; }

        /* S13 — takror hisoblagich */
        .rep-badge { font-family: 'Fraunces', serif; font-size: clamp(30px,7vw,48px); color: ${T.accent}; line-height: 1; }
        @keyframes burstpop { 0%{transform:scale(0); opacity:0;} 55%{transform:scale(1.3);} 100%{transform:scale(1); opacity:1;} }
        .burst { display: inline-block; animation: burstpop 0.5s cubic-bezier(.34,1.4,.4,1); }

        /* S14 — xato silkinishi */
        @keyframes shakeX { 0%,100%{transform:translateX(0)} 18%{transform:translateX(-3px)} 38%{transform:translateX(3px)} 58%{transform:translateX(-2px)} 78%{transform:translateX(2px)} }
        .tok-bad { animation: shakeX 0.42s ease; }
        @keyframes warnpulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        .warn-pulse { animation: warnpulse 1s ease-in-out infinite; }

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
            <LiveGate live={live} title={{ uz: 'JS darsi', ru: 'Урок JS' }} />
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
