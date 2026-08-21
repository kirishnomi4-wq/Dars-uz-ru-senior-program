import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';

// ============================================================
// PRAKTIKA 3-DARS — DEKOMPOZITSIYA (mini-do'kon, 1-qism) — PLATFORM STANDARD v16
// Mavzu: AI'ni ochishdan oldin rejalashtirish; bo'laklash (katta -> kichik qadam);
//        MVP (shart vs keyin); qadamlarni tartiblash; qadam -> buyruq; o'zakni AI bilan qurish.
// Loyiha: mini-do'kon — MVP o'zagi (mahsulotlar ro'yxati + narx). Savat/jami -> 4-dars.
// Asosiy xabar: "Avval bo'laklab rejalashtir, keyin AI'ni och. Siz — arxitektor."
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
    <button onClick={() => live.joinStudent(code, nick)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: 'Ulanmoqda…', ru: 'Подключаем…' }) : tr({ uz: "Qo'shilish →", ru: 'Присоединиться →' })}</button>
    {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
    <button onClick={() => { setRole('mentor'); setCode(''); }} title="Mentor" aria-label="Mentor" style={{ position: 'absolute', bottom: 10, right: 12, background: 'none', border: 'none', fontSize: 16, opacity: 0.3, cursor: 'pointer', lineHeight: 1, padding: 4 }}>🧑‍🏫</button>
  </div></div>);
}

function LiveBadge({ live, total }) {
  const [bigOpen, setBigOpen] = useState(false);
  const [nPlayers, setNPlayers] = useState(null);
  // Katta PIN ekrani AVTOMATIK ochilmaydi — dars oq holda, onboarding bilan ochiladi.
  // Mentor kodni ko'rsatmoqchi bo'lganda «📺 Ko'rsatish» tugmasini bosadi (pastda).
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
    if (live.ended) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "🔓 O'quvchilar erkin qilindi", ru: '🔓 Ученики отпущены — свободный режим' })}</div>;
    return (<>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div data-tour="live" className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr({ uz: 'Kod:', ru: 'Код:' })} <b style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr({ uz: "Kodni katta ko'rsatish", ru: 'Показать код крупно' })} style={{ marginLeft: 6, background: LT.ink, color: '#fff', border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: "📺 Ko'rsatish", ru: '📺 Показать' })}</button>
        <button onClick={() => { if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: 'Отпустить учеников? Дальше они продолжат самостоятельно.' }))) live.endSession(); }} style={{ background: LT.accentSoft, color: LT.accent, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: '🔓 Erkin qilish', ru: '🔓 Отпустить' })}</button>
      </div>
    </>);
  }
  if (live.mode === 'student') {
    if (live.status === 'ended') return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: "🔓 Erkin rejim — o'zingiz davom eting", ru: '🔓 Свободный режим — продолжайте сами' })}</div>;
    if (!live.mentorAlive) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: '⚠️ Mentor uzildi — erkin rejim', ru: '⚠️ Ментор отключился — свободный режим' })}</div>;
    if (!live.connected) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot('#FFD380')} /> {tr({ uz: '🔄 Qayta ulanmoqda…', ru: '🔄 Переподключение…' })}</div>;
    return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 👨‍🏫 {tr({ uz: 'Mentor:', ru: 'Ментор:' })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

const LangContext = createContext('uz');
const MentorCtx = createContext(null);
const AchCtx = createContext(null);
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

const LESSON_META = { lessonId: 'practice-03-decompose-v18', lessonTitle: { uz: 'Praktika 3 — Dekompozitsiya (mini-do\'kon)', ru: 'Практика 3 — Декомпозиция (мини-магазин)' } };
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
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'exploration', template: 'custom',   scored: false, scope: null },
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
const NavNext = ({ disabled, label = { uz: 'Davom etish', ru: 'Продолжить' }, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не открыл эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(label))}</button>;
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
// Kalitlar — MCQ scored test ekranlarining indekslari (4, 7, 10; s15 — final drag, recap yo'q).
// Har karta: ic (katta emoji), h (sarlavha), body (1-2 gap), vis (ko'rgazma),
// ask (mentor sinfga og'zaki beradigan savol — jonli muloqot uchun).
// ============================================================
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
// RECAPS kontenti — Stage 4'da JS-intro testlariga to'ldiriladi (hozircha bo'sh)
const RECAPS = {
  // s4 — "MVP nima degani?" → Eng kichik, lekin ishlaydigan versiya
  4: {
    title: { uz: "MVP — eng kichik ishlaydigan versiya", ru: 'MVP — минимальная работающая версия' },
    cards: [
      {
        ic: "🛹",
        h: { uz: "MVP = eng kichik, lekin ISHLAYDIGAN versiya", ru: 'MVP = самая маленькая, но РАБОТАЮЩАЯ версия' },
        body: { uz: <>MVP degani <b>eng kichik</b>, lekin allaqachon <b>ishlaydigan</b> mahsulot. Uni skeytbordga o'xshating: bola bir joydan ikkinchi joyga borishi uchun to'liq mashina shart emas — avval skeytbord ham yetadi. Skeytbord kichkina, lekin haqiqatan yumaladi va ish beradi.</>, ru: <>MVP — это <b>самый маленький</b>, но уже <b>работающий</b> продукт. Представьте скейтборд: чтобы добраться из точки А в точку Б, не нужна целая машина — сначала хватит и скейтборда. Он маленький, но реально едет и делает своё дело.</> },
        vis: { uz: <RcFlow items={["Skeytbord", "Samokat", "Velosiped", "Mashina"]} />, ru: <RcFlow items={["Скейтборд", "Самокат", "Велосипед", "Машина"]} /> },
        ask: { uz: "Mini-do'konning eng kichik 'skeytbordi' — bu nima bo'ladi?", ru: 'Какой самый маленький «скейтборд» будет у мини-магазина?' }
      },
      {
        ic: "🎨",
        h: { uz: "MVP — chiroyli ham, qimmat ham, oxirgi ham EMAS", ru: 'MVP — НЕ самое красивое, НЕ самое дорогое и НЕ финальное' },
        body: { uz: <>Ko'pchilik adashadi: MVP eng chiroyli dizayn yoki eng qimmat funksiya deb o'ylashadi. Yo'q — MVP <b>chiroyliligi bilan emas, ishlashi bilan</b> baholanadi. Bezak, ranglar, qo'shimcha funksiyalar keyin qo'shiladi.</>, ru: <>Многие путаются: думают, что MVP — это самый красивый дизайн или самая дорогая функция. Нет — MVP оценивается <b>не красотой, а тем, что он работает</b>. Украшения, цвета и дополнительные функции добавят потом.</> },
        vis: { uz: <RcFlow items={["Ishlaydimi?", "Ha", "Demak MVP tayyor"]} sep="→" />, ru: <RcFlow items={["Работает?", "Да", "Значит, MVP готов"]} sep="→" /> }
      },
      {
        ic: "🚀",
        h: { uz: "Nega avval MVP?", ru: 'Почему сначала MVP?' },
        body: { uz: <>Kichik ishlaydigan versiyani tez yasab, sinab ko'rasiz. Agar yaxshi bo'lsa — ustiga qo'shib o'stirasiz. <b>Avval kichik, keyin katta</b> — barcha mashhur ilovalar shunday boshlangan.</>, ru: <>Маленькую работающую версию можно быстро собрать и проверить. Если всё ок — достраиваете сверху. <b>Сначала маленькое, потом большое</b> — все известные приложения начинались именно так.</> },
      },
    ]
  },

  // s7 — "Mini-do'kon qurishni nimadan boshlaysiz?" → Mahsulotlar ro'yxatidan (poydevor)
  7: {
    title: { uz: "Poydevordan boshlash — mahsulotlar ro'yxati", ru: 'Начинаем с фундамента — списка товаров' },
    cards: [
      {
        ic: "🧱",
        h: { uz: "Har doim POYDEVORDAN boshlaymiz", ru: 'Всегда начинаем с ФУНДАМЕНТА' },
        body: { uz: <>Uy qurganda tomdan emas, <b>poydevordan</b> boshlaysiz — pastdagi asos bo'lmasa, ustidagi hech narsa turmaydi. Do'konda ham xuddi shunday: eng asosiy narsa — <b>mahsulotlar ro'yxati</b>. U bo'lmasa, savat ham, to'lov ham ma'nosiz.</>, ru: <>Дом строят не с крыши, а <b>с фундамента</b> — без основы внизу ничего сверху не удержится. С магазином так же: самое главное — <b>список товаров</b>. Без него и корзина, и оплата теряют смысл.</> },
        vis: { uz: <RcFlow items={["Poydevor", "Devor", "Tom"]} />, ru: <RcFlow items={["Фундамент", "Стены", "Крыша"]} /> },
        ask: { uz: "Do'konda savat bor-u, mahsulotlar ro'yxati yo'q — nima savatga solamiz?", ru: 'В магазине есть корзина, но нет списка товаров — что мы будем в неё класть?' }
      },
      {
        ic: "🚫",
        h: { uz: "Login, reklama, sharhlar — poydevor EMAS", ru: 'Логин, реклама, отзывы — НЕ фундамент' },
        body: { uz: <>Login tizimi, reklama bannerlari yoki sharhlar bo'limi — bular do'konning <b>bezagi va qo'shimchasi</b>, o'zagi emas. Ularsiz ham do'kon ishlaydi. Shuning uchun ulardan boshlamaymiz.</>, ru: <>Система логина, рекламные баннеры или раздел отзывов — это <b>украшение и дополнение</b> магазина, а не его ядро. Магазин работает и без них. Поэтому мы с них не начинаем.</> },
        vis: { uz: <RcFlow items={["Mahsulotlar ro'yxati", "keyin narx", "keyin savat"]} sep="→" />, ru: <RcFlow items={["Список товаров", "потом цены", "потом корзина"]} sep="→" /> }
      },
      {
        ic: "🏗️",
        h: { uz: "Tartib: avval asos, keyin ustiga qo'shamiz", ru: 'Порядок: сначала основа, потом достраиваем' },
        body: { uz: <>Avval ko'rinadigan, ishlaydigan <b>ro'yxatni</b> quramiz. Keyin narx, keyin savat qo'shiladi. <b>Pastdan yuqoriga</b> — har qadam avvalgisining ustiga qo'yiladi.</>, ru: <>Сначала строим видимый, работающий <b>список</b>. Потом добавляются цены, потом корзина. <b>Снизу вверх</b> — каждый шаг кладётся поверх предыдущего.</> },
      },
    ]
  },

  // s10 — "Bu bosqichda do'konning qaysi qismini qurdik?" → Mahsulot katalogi: ro'yxat + narx (MVP o'zagi)
  10: {
    title: { uz: "Biz qurgan qism — katalog (ro'yxat + narx)", ru: 'Что мы построили — каталог (список + цены)' },
    cards: [
      {
        ic: "📋",
        h: { uz: "Biz MVP o'zagini qurdik: ro'yxat + narx", ru: 'Мы построили ядро MVP: список + цены' },
        body: { uz: <>Shu bosqichda do'konning <b>o'zagini</b> — mahsulotlar ro'yxati va ularning narxini qurib oldik. Bu do'konning <b>vitrinasi</b>: mijoz nima borligini va qancha turishini ko'radi. Bu allaqachon ishlaydigan MVP o'zagi.</>, ru: <>На этом этапе мы построили <b>ядро</b> магазина — список товаров и их цены. Это <b>витрина</b> магазина: клиент видит, что есть и сколько стоит. И это уже работающее ядро MVP.</> },
        vis: { uz: <RcFlow items={["Mahsulot nomi", "+ narx", "= katalog"]} sep="" />, ru: <RcFlow items={["Название товара", "+ цена", "= каталог"]} sep="" /> },
        ask: { uz: "Bizning ekranda hozir ko'rinib turgan narsa nima — ro'yxatmi yoki to'lov oynasimi?", ru: 'Что сейчас видно на нашем экране — список или окно оплаты?' }
      },
      {
        ic: "🛒",
        h: { uz: "Savat va to'lov — hali qurilmagan", ru: 'Корзина и оплата — ещё не построены' },
        body: { uz: <>«Savat va to'lov tizimi» yoki «hamma narsa tayyor» degan javob noto'g'ri: biz hali <b>faqat katalogni</b> qildik. Savat va jami narx <b>keyingi darsda</b> qo'shiladi.</>, ru: <>Ответ «корзина и система оплаты» или «всё уже готово» — неверный: пока мы сделали <b>только каталог</b>. Корзина и итоговая сумма появятся <b>на следующем уроке</b>.</> },
        vis: { uz: <RcFlow items={["Katalog ✅", "Savat ⏳", "To'lov ⏳"]} />, ru: <RcFlow items={["Каталог ✅", "Корзина ⏳", "Оплата ⏳"]} /> }
      },
      {
        ic: "🎯",
        h: { uz: "O'zi nimani qurganingizni bilish muhim", ru: 'Важно знать, что именно Вы построили' },
        body: { uz: <>Yaxshi quruvchi doim <b>qayerda turganini</b> biladi: nima tayyor, nima keyingi navbatda. Biz endigina <b>poydevorni</b> — katalogni bitirdik, do'kon hali to'liq emas.</>, ru: <>Хороший строитель всегда знает, <b>где он находится</b>: что готово, что на очереди. Мы только что закончили <b>фундамент</b> — каталог, магазин ещё не полный.</> },
      },
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
        {card.vis && <div className="rc-vis">{tr(card.vis)}</div>}
        {card.ask && <div className="rc-ask">🗣️ {tr({ uz: 'Sinfga savol:', ru: 'Вопрос классу:' })} {tr(card.ask)}</div>}
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
  // «To'g'ri» sanog'ini ustunlar bilan BIR XIL mantiqdan olamiz (picked === correctIdx) — eskirgan a.correct emas
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
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi 📨', ru: 'ответили 📨' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и счёт ✅/❌ скрыты — по кнопке «Открыть результат» всё откроется одновременно и у Вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — класс не понял эту тему. Прежде чем идти дальше, стоит коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответов мало ({answered}) — делать выводы по процентам рано. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь вживую…' })}</p>}
    </div>
  );
}

// ===== MENTOR YOZMA-ISH PANELI — s15 yakuniy amaliy sinov uchun =====
// O'quvchining yozgan MATNI serverga bormaydi (jadval sxemasi) — faqat «tugatdi»
// belgisi boradi. Mentor kim tugatgani/kim ishlayotganini jonli ko'radi.
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
      {doneN === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar yozib tugatishi bilan shu yerda ✓ belgisi chiqadi…", ru: 'Как только ученик закончит, здесь появится значок ✓…' })}</p>}
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
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval natijani oching', ru: 'Сначала откройте результат' }) : solved ? { uz: 'Davom etish', ru: 'Продолжить' } : (oneShot ? { uz: 'Javob tanlang', ru: 'Выберите ответ' } : { uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, думайте перед кликом!' })}</p>}
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
              ? `✓ ${tr({ uz: "To'g'ri javob:", ru: 'Верный ответ:' })} ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? `${tr({ uz: "To'g'ri javob:", ru: 'Верный ответ:' })} ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? explainCorrect
              : waiting
                ? tr({ uz: "Javobingiz saqlandi. Mentor «Natijani ochish»ni bosganda to'g'ri javob hammada birdan ko'rinadi.", ru: 'Ваш ответ сохранён. Когда ментор нажмёт «Открыть результат», верный ответ появится у всех одновременно.' })
                : wrongLocked
                  ? (explainWrong[picked] ?? explainWrong.default)
                  : solved ? explainCorrect : (explainWrong[picked] ?? explainWrong.default)}
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
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">{tr({ uz: "to'g'ri javob", ru: 'верно' })}</div></div>
    </div>
  );
}

// ===== MENTOR =====
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';
const Mentor = ({ children }) => {
  const ctx = useContext(MentorCtx) || {};
  const enabled = !!ctx.enabled;
  const collapsed = enabled && ctx.collapsed;
  const expand = (e) => { e.stopPropagation(); if (ctx.setCollapsed) ctx.setCollapsed(false); };
  return (
    <div className={`mentor fade-up ${enabled ? 'mentor-mob' : ''} ${collapsed ? 'is-collapsed' : ''}`} onClick={collapsed ? expand : undefined} role={collapsed ? 'button' : undefined}>
      <div className="mentor-ava" aria-hidden="true"><img src={MENTOR_IMG} alt="" /></div>
      <div className="mentor-col">
        <span className="mentor-name">Mentor{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish ▾", ru: 'открыть подсказку ▾' })}</span>}</span>
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
const SiteCard = ({ name = 'Akmal', role = tr({ uz: 'Veb-dasturchi · 14 yosh', ru: 'Веб-разработчик · 14 лет' }), children }) => (
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

// ===== MINI-DO'KON MA'LUMOTLARI =====
const PRODUCTS = [
  { name: { uz: 'Kitob', ru: 'Книга' }, price: '35 000', emoji: '📚', tint: '#2563EB' },
  { name: { uz: 'Daftar', ru: 'Тетрадь' }, price: '12 000', emoji: '📓', tint: '#1F9D55' },
  { name: { uz: 'Ruchka', ru: 'Ручка' }, price: '5 000', emoji: '✏️', tint: '#F59E0B' },
  { name: { uz: 'Sumka', ru: 'Рюкзак' }, price: '90 000', emoji: '🎒', tint: '#7C3AED' }
];

// Mini-do'kon preview (katalog). L3: narx bor, savat yo'q.
const ShopPreview = ({ showPrice = true, showCart = false, accent = '#2563EB', missing = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 'clamp(15px,2.2vw,18px)', color: T.ink }}>{tr({ uz: "MAKTAB DO'KONI", ru: 'ШКОЛЬНЫЙ МАГАЗИН' })}</span>
      {showCart && <span style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: 11.5, color: accent, background: `${accent}1f`, borderRadius: 99, padding: '3px 10px' }}>{tr({ uz: 'Savat: 0', ru: 'Корзина: 0' })}</span>}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 7 }}>
      {PRODUCTS.map((p, i) => (
        <div key={i} style={{ background: T.paper, borderRadius: 9, padding: '7px 9px', boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.16)`, display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: missing ? '#E6E1D8' : `${p.tint || accent}22`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{missing ? '' : p.emoji}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: T.ink, whiteSpace: 'nowrap' }}>{tr(p.name)}</div>
            {showPrice
              ? <div style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: 11.5, color: accent }}>{p.price} {tr({ uz: "so'm", ru: 'сум' })}</div>
              : <div style={{ fontSize: 10.5, color: T.accent, fontStyle: 'italic' }}>{missing ? tr({ uz: "narx yo'q", ru: 'нет цены' }) : ''}</div>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Yo'l-xarita: qayerdamiz va keyin nima (bosqichlar tasmasi)
const JourneyBar = ({ stages }) => (
  <div className="journey fade-up">
    {stages.map((s, i) => (
      <React.Fragment key={i}>
        <div className={`jn jn-${s.state}`}>
          <span className="jn-dot">{s.state === 'done' ? '✓' : i + 1}</span>
          <span className="jn-txt"><span className="jn-lbl">{s.label}</span><span className="jn-tag">{s.tag}</span></span>
        </div>
        {i < stages.length - 1 && <span className="jn-line" />}
      </React.Fragment>
    ))}
  </div>
);

// "Agent quryapti…" — jonli shimmer skeleton
const BuildingPreview = () => (
  <div className="build-skel">
    <div className="bs-bar bs-lg" />
    <div className="bs-bar" style={{ width: '72%' }} />
    <div className="bs-bar" style={{ width: '90%' }} />
    <p className="build-note">{tr({ uz: 'Agent quryapti…', ru: 'Агент строит…' })}</p>
  </div>
);

// Restoran sayti MVP preview (yakuniy natija) — menyu + narx
const REST_MENU = [
  { name: { uz: 'Osh', ru: 'Плов' }, price: '30 000', emoji: '🍚', tint: '#E0892B' },
  { name: { uz: "Lag'mon", ru: 'Лагман' }, price: '28 000', emoji: '🍜', tint: '#C2410C' },
  { name: { uz: 'Somsa', ru: 'Самса' }, price: '8 000', emoji: '🥟', tint: '#B45309' },
  { name: { uz: 'Choy', ru: 'Чай' }, price: '3 000', emoji: '🍵', tint: '#1F7A4D' }
];
const RestaurantPreview = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
    <span style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 'clamp(15px,2.2vw,18px)', color: T.ink }}>{tr({ uz: 'MILLIY TAOMLAR', ru: 'НАЦИОНАЛЬНАЯ КУХНЯ' })}</span>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 7 }}>
      {REST_MENU.map((p, i) => (
        <div key={i} style={{ background: T.paper, borderRadius: 9, padding: '7px 9px', boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.16)`, display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: `${p.tint}22`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{p.emoji}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: T.ink, whiteSpace: 'nowrap' }}>{tr(p.name)}</div>
            <div style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: 11.5, color: '#C2410C' }}>{p.price} {tr({ uz: "so'm", ru: 'сум' })}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// MVP / keyin uchun xususiyatlar
const FEATURES = [
  { id: 'list', label: { uz: "Mahsulotlar ro'yxati", ru: 'Список товаров' }, mvp: true },
  { id: 'price', label: { uz: 'Har biriga narx', ru: 'Цена у каждого' }, mvp: true },
  { id: 'cart', label: { uz: "Savatga qo'shish", ru: 'Добавление в корзину' }, mvp: false },
  { id: 'total', label: { uz: 'Jami narx hisobi', ru: 'Подсчёт итоговой суммы' }, mvp: false },
  { id: 'search', label: { uz: 'Qidiruv', ru: 'Поиск' }, mvp: false },
  { id: 'login', label: { uz: 'Foydalanuvchi login', ru: 'Логин пользователя' }, mvp: false }
];

// Mobil avtoskroll
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

// ===== SCREEN 0 — HOOK (rejasiz boshlash) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [phase, setPhase] = useState(storedAnswer ? 'built' : 'idle');
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const OPTS = [
    { id: 'a', label: tr({ uz: "Avval vazifani bo'laklab, reja tuzmadik", ru: 'Мы не разбили задачу на части и не составили план' }) },
    { id: 'b', label: tr({ uz: 'AI juda sekin ishlagani uchun', ru: 'Потому что AI работал слишком медленно' }) },
    { id: 'c', label: tr({ uz: "Kompyuter eski bo'lgani uchun", ru: 'Потому что компьютер старый' }) }
  ];
  const send = () => { clearTimeout(timer.current); setPhase('building'); timer.current = setTimeout(() => setPhase('built'), 1200); };
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  const built = phase === 'built';
  const builtRef = useScrollIntoViewOnMobile(built);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 820 }}>{tr({ uz: <>To'g'ridan-to'g'ri <span className="italic" style={{ color: T.accent }}>"do'kon yasab ber"</span> desak — nima bo'ladi?</>, ru: <>Что будет, если сразу сказать: <span className="italic" style={{ color: T.accent }}>«сделай мне магазин»</span>?</> })}</h1>
        <Mentor>{tr({ uz: <>Endi kichik sahifa emas, butun bir <b style={{ color: T.ink }}>onlayn do'kon</b> kerak. Vasvasaga berilib, AI'ga rejasiz "do'kon yasab ber" deb yuboramiz. Tugmani bosing va natijaga qarang — bu yetarlimi?</>, ru: <>Теперь нужна не маленькая страничка, а целый <b style={{ color: T.ink }}>онлайн-магазин</b>. Поддадимся соблазну и без плана отправим AI «сделай магазин». Нажмите кнопку и посмотрите на результат — этого достаточно?</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Sizning buyrug'ingiz", ru: 'Ваша команда' })}</p>
            <div className="promptbox">{tr({ uz: <>Menga <span className="pb-slot">onlayn do'kon</span> yasab ber.</>, ru: <>Сделай мне <span className="pb-slot">онлайн-магазин</span>.</> })}</div>
            <button className="btn" onClick={send} disabled={phase === 'building'} style={{ alignSelf: 'flex-start' }}>{phase === 'building' ? tr({ uz: 'Quryapti…', ru: 'Строит…' }) : (built ? tr({ uz: '↻ Qayta yuborish', ru: '↻ Отправить ещё раз' }) : tr({ uz: 'Agentga yuborish', ru: 'Отправить агенту' }))}</button>
            {built && <p className="hook-ack fade-step" style={{ marginTop: 4 }}>{tr({ uz: "Chala chiqdi — narxlar yo'q, tartib yo'q. O'ngda: nega shunday?", ru: 'Получилось сыро — нет цен, нет порядка. Справа: почему так?' })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija', ru: 'Результат' })}</p>
            <div ref={builtRef}><Browser url="dokon.uz">
              {phase === 'idle' && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: '(hali yuborilmadi)', ru: '(пока не отправлено)' })}</p>}
              {phase === 'building' && <p className="small" style={{ margin: 0, opacity: 0.6, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: 'Agent quryapti…', ru: 'Агент строит…' })}</p>}
              {built && <ShopPreview showPrice={false} missing />}
            </Browser></div>
            {built && (
              <div className="fade-step">
                <p className="eyebrow" style={{ color: T.ink2, margin: '0 0 9px' }}>{tr({ uz: 'Nega natija chala chiqdi?', ru: 'Почему результат получился сырым?' })}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {OPTS.map(o => { const on = picked === o.id; return (
                    <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                      <span className="radio">{on && <span className="radio-dot" />}</span><span>{o.label}</span>
                    </button>); })}
                </div>
                {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>To'g'ri! Katta vazifani <b>bo'laklamasak</b>, AI ham, biz ham adashamiz. Usta uy qurishdan oldin <b>chizma</b> chizadi. Bugun aynan shuni — rejalashtirishni — o'rganamiz.</>, ru: <>Верно! Если не <b>разбить</b> большую задачу, запутаются и AI, и мы. Мастер перед стройкой чертит <b>чертёж</b>. Сегодня учимся именно этому — планированию.</> })}</p>}
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
    { text: tr({ uz: 'Nega reja kerak? — rejasiz tartibsizlik', ru: 'Зачем нужен план? — без плана хаос' }), tag: '' },
    { text: tr({ uz: "Bo'laklash — katta vazifa, kichik qadamlar", ru: 'Разбиение — большая задача, маленькие шаги' }), tag: '' },
    { text: tr({ uz: 'MVP — eng kichik ishlaydigan versiya', ru: 'MVP — минимальная работающая версия' }), tag: tr({ uz: 'shart vs keyin', ru: 'нужно vs потом' }) },
    { text: tr({ uz: 'Qadamlarni tartiblash', ru: 'Расставляем шаги по порядку' }), tag: '1·2·3' },
    { text: tr({ uz: "Qadamni AI buyrug'iga aylantirish", ru: 'Превращаем шаг в команду для AI' }), tag: '' },
    { text: tr({ uz: "O'zakni AI bilan qurish", ru: 'Строим ядро вместе с AI' }), tag: tr({ uz: 'katalog', ru: 'каталог' }) }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <div className="fade-up frame" style={{ background: T.ink, color: '#fff', textAlign: 'center', padding: '20px 18px' }}>
        <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 8px' }}>{tr({ uz: 'Bugungi asosiy qoida', ru: 'Главное правило дня' })}</p>
        <p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 'clamp(18px,3vw,24px)', lineHeight: 1.25, margin: 0 }}>{tr({ uz: <>Avval <span style={{ color: T.accent, fontStyle: 'italic' }}>bo'laklab rejalashtir</span>, keyin AI'ni och.</>, ru: <>Сначала <span style={{ color: T.accent, fontStyle: 'italic' }}>разбей и спланируй</span>, потом открывай AI.</> })}</p>
        <p className="body" style={{ color: 'rgba(255,255,255,0.85)', margin: '10px 0 0' }}>{tr({ uz: <>Siz — <b style={{ color: '#fff' }}>arxitektor</b>, AI — quruvchi.</>, ru: <>Вы — <b style={{ color: '#fff' }}>архитектор</b>, AI — строитель.</> })}</p>
      </div>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 6 qadam', ru: '6 шагов на сегодня' })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{s.text}</span>{s.tag && <span className="step-tag">{s.tag}</span>}</span></li>))}
      </ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Katta loyihani qanday <span className="italic" style={{ color: T.accent }}>boshlaymiz?</span></>, ru: <>Как <span className="italic" style={{ color: T.accent }}>начать</span> большой проект?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Katta ishni AI ham bir zarbda mukammal qila olmaydi — uni avval <b style={{ color: T.ink }}>bo'laklarga</b> bo'lish kerak. Yaxshi dasturchi AI'ni ochishdan oldin <b style={{ color: T.ink }}>rejani</b> tuzadi. Bugun mini-do'kon misolida shuni o'rganamiz, 6 qadamda.</>, ru: <>Даже AI не сделает большую работу идеально с одного удара — сначала её нужно разбить <b style={{ color: T.ink }}>на части</b>. Хороший разработчик составляет <b style={{ color: T.ink }}>план</b> до того, как открыть AI. Сегодня учимся этому на примере мини-магазина — за 6 шагов.</> })}</Mentor>
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

// ===== SCREEN 2 — KATTA G'OYA (bo'laklash) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const PIECES = [tr({ uz: "Mahsulotlar ro'yxati", ru: 'Список товаров' }), tr({ uz: 'Narxlar', ru: 'Цены' }), tr({ uz: "Savatga qo'shish", ru: 'Добавление в корзину' }), tr({ uz: 'Jami narx', ru: 'Итоговая сумма' }), tr({ uz: 'Qidiruv', ru: 'Поиск' }), tr({ uz: 'Login', ru: 'Логин' })];
  const [open, setOpen] = useState(!!storedAnswer);
  const done = open;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: "Bo'laklash", ru: 'Разбиение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Vazifani bo'laklang", ru: 'Разбейте задачу' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Katta vazifa aslida <span className="italic" style={{ color: T.accent }}>ko'p kichik</span> qadam</>, ru: <>Большая задача — это <span className="italic" style={{ color: T.accent }}>много маленьких</span> шагов</> })}</h2></div>
        <Mentor>{tr({ uz: <>"Onlayn do'kon" — bu bitta ulkan, qo'rqinchli vazifaga o'xshaydi. Lekin uni <b style={{ color: T.ink }}>bo'laklarga</b> ajratsak, har biri kichik va bajariladigan bo'lib qoladi. Tugmani bosib, ulkan vazifani bo'laklang.</>, ru: <>«Онлайн-магазин» звучит как одна огромная, пугающая задача. Но если разбить её <b style={{ color: T.ink }}>на части</b>, каждая станет маленькой и выполнимой. Нажмите кнопку и разбейте гигантскую задачу.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className={`big-task ${open ? 'is-split' : ''}`}>
              <p className="big-task-title">{tr({ uz: "ONLAYN DO'KON", ru: 'ОНЛАЙН-МАГАЗИН' })}</p>
              <p className="big-task-sub">{open ? tr({ uz: "6 ta kichik qadamga bo'lindi ↓", ru: 'разбита на 6 маленьких шагов ↓' }) : tr({ uz: "bitta ulkan, qo'rqinchli vazifa", ru: 'одна огромная, пугающая задача' })}</p>
            </div>
            <button className="btn" onClick={() => setOpen(true)} disabled={open} style={{ alignSelf: 'flex-start' }}>{open ? tr({ uz: "✓ Bo'laklandi", ru: '✓ Разбито' }) : tr({ uz: "Vazifani bo'laklash ↓", ru: 'Разбить задачу ↓' })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Kichik qadamlar', ru: 'Маленькие шаги' })}</p>
            {open ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PIECES.map((p, i) => (
                  <div key={i} className="piece-card" style={{ animationDelay: `${i * 0.08}s` }}>
                    <span className="piece-num">{i + 1}</span>
                    <span className="piece-label">{p}</span>
                  </div>
                ))}
              </div>
            ) : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Chap tomondagi tugmani bosing', ru: 'Нажмите кнопку слева' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Ko\'rdingizmi? Bitta "qo\'rqinchli" vazifa — 6 ta oddiy qadamga aylandi. Endi har birini alohida bajara olamiz.', ru: 'Видите? Одна «страшная» задача превратилась в 6 простых шагов. Теперь каждый можно сделать отдельно.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — MVP: SHART vs KEYIN =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [placed, setPlaced] = useState(storedAnswer ? Object.fromEntries(FEATURES.map(f => [f.id, f.mvp ? 'mvp' : 'keyin'])) : {});
  const correctBucket = (f) => (f.mvp ? 'mvp' : 'keyin');
  const allCorrect = FEATURES.every(f => placed[f.id] === correctBucket(f));
  const done = allCorrect;
  const place = (f, bucket) => setPlaced(p => ({ ...p, [f.id]: bucket }));
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow="MVP" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Hammasini to'g'ri joylang", ru: 'Разложите всё правильно' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Avval nimani qurish <span className="italic" style={{ color: T.accent }}>shart?</span></>, ru: <>Что строить <span className="italic" style={{ color: T.accent }}>обязательно</span> в первую очередь?</> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: T.ink }}>MVP</b> — eng kichik, lekin <b style={{ color: T.ink }}>ishlaydigan</b> versiya. Do'kon uchun eng zarur narsa — mahsulot va narxni ko'rsatish. Savat, qidiruv, login ham kerak, lekin ularni <b style={{ color: T.ink }}>keyin</b> qo'shamiz. Har bir xususiyatni to'g'ri joylang.</>, ru: <><b style={{ color: T.ink }}>MVP</b> — самая маленькая, но <b style={{ color: T.ink }}>работающая</b> версия. Для магазина самое необходимое — показать товары и цены. Корзина, поиск и логин тоже нужны, но их добавим <b style={{ color: T.ink }}>потом</b>. Разложите каждую функцию правильно.</> })}</Mentor>
        <Zoomable>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FEATURES.map(f => {
            const b = placed[f.id];
            const ok = b === correctBucket(f);
            const wrong = b && !ok;
            return (
              <div key={f.id} className="frame" style={{ padding: '11px 14px', display: 'flex', flexDirection: 'column', gap: wrong ? 7 : 0, boxShadow: ok ? `inset 0 0 0 2px ${T.success}, 0 6px 16px -6px rgba(31,122,77,0.2)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 'clamp(13px,1.7vw,15px)', color: T.ink, minWidth: 130 }}>{ok && <span style={{ color: T.success, marginRight: 6 }}>✓</span>}{tr(f.label)}</span>
                  <div style={{ display: 'flex', gap: 7 }}>
                    <button className={`chip ${b === 'mvp' ? (ok ? '' : '') : ''}`} onClick={() => place(f, 'mvp')} style={{ background: b === 'mvp' ? (ok ? T.success : T.accent) : T.paper, color: b === 'mvp' ? '#fff' : T.ink, boxShadow: `0 4px 12px -5px rgba(${T.shadowBase},0.18)` }}>{tr({ uz: 'Shart (MVP)', ru: 'Нужно (MVP)' })}</button>
                    <button className={`chip`} onClick={() => place(f, 'keyin')} style={{ background: b === 'keyin' ? (ok ? T.success : T.accent) : T.paper, color: b === 'keyin' ? '#fff' : T.ink, boxShadow: `0 4px 12px -5px rgba(${T.shadowBase},0.18)` }}>{tr({ uz: 'Keyin', ru: 'Потом' })}</button>
                  </div>
                </div>
                {wrong && <p className="small" style={{ margin: 0, color: T.accent }}>{f.mvp ? tr({ uz: "Bu MVP uchun shart — do'kon busiz bo'lmaydi.", ru: 'Это обязательно для MVP — без этого магазин не работает.' }) : tr({ uz: 'Muhim, lekin birinchi bosqichda shart emas — keyin qo\'shamiz.', ru: 'Важно, но на первом этапе не обязательно — добавим потом.' })}</p>}
              </div>
            );
          })}
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Zo'r! MVP = mahsulotlar ro'yxati + narx. Qolgani — keyingi bosqich. Mana shu — aqlli rejalashtirish.", ru: 'Отлично! MVP = список товаров + цены. Остальное — следующий этап. Вот это и есть умное планирование.' })}</p></div>}
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · Вопрос 1' })}
    questionText={tr({ uz: 'MVP nima?', ru: 'Что такое MVP?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <><span className="mono" style={{ color: T.accent }}>MVP</span> nima degani?</>, ru: <>Что означает <span className="mono" style={{ color: T.accent }}>MVP</span>?</> })}</h2></>}
    audioText="MVP nima degani? To'rt variantdan eng to'g'risini tanlang."
    options={[tr({ uz: 'Eng kichik, lekin ishlaydigan versiya', ru: 'Самая маленькая, но работающая версия' }), tr({ uz: 'Eng chiroyli, jozibali dizayn', ru: 'Самый красивый, эффектный дизайн' }), tr({ uz: 'Eng qimmat, murakkab funksiya', ru: 'Самая дорогая, сложная функция' }), tr({ uz: 'Loyihaning oxirgi, tayyor varianti', ru: 'Последняя, готовая версия проекта' })]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! MVP — eng kam xususiyat bilan, lekin haqiqatan ishlaydigan birinchi versiya. Avval shuni quramiz, qolganini keyin qo'shamiz.", ru: 'Верно! MVP — первая версия с минимумом функций, которая уже реально работает. Сначала строим её, остальное добавляем потом.' })}
    explainWrong={{
      1: tr({ uz: "Yo'q — chiroyli dizayn keyin bo'ladi. MVP — avvalo ishlaydigan eng kichik versiya.", ru: 'Нет — красивый дизайн будет потом. MVP — прежде всего минимальная работающая версия.' }),
      2: tr({ uz: "Yo'q — qimmat funksiya emas. MVP — eng zarur, eng oddiy ishlaydigan qism.", ru: 'Нет — не дорогая функция. MVP — самая необходимая, простейшая работающая часть.' }),
      3: tr({ uz: "Yo'q — oxirgisi emas, aksincha birinchi ishlaydigan versiya. Keyin yaxshilanadi.", ru: 'Нет — не последняя, а наоборот первая работающая версия. Потом её улучшают.' }),
      default: tr({ uz: 'MVP — eng kichik ishlaydigan versiya.', ru: 'MVP — минимальная работающая версия.' })
    }} />
);

// ===== SCREEN 5 — QADAMLARNI TARTIBLASH (dekompozitsiya-gate: sudrab tartiblash) =====
const DECOMP_STEPS = [
  { id: 'list', label: { uz: "Mahsulotlar ro'yxatini yarat", ru: 'Создай список товаров' } },
  { id: 'price', label: { uz: "Har biriga narx qo'sh", ru: 'Добавь цену каждому' } },
  { id: 'style', label: { uz: 'Chiroyli kartalarga joyla', ru: 'Оформи в красивые карточки' } }
];
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [dragDone, setDragDone] = useState(!!storedAnswer);
  const done = dragDone;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Tartiblash', ru: 'Порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "To'g'ri tartibni tuzing", ru: 'Соберите верный порядок' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>MVP'ni <span className="italic" style={{ color: T.accent }}>nimadan</span> boshlaymiz?</>, ru: <>С чего <span className="italic" style={{ color: T.accent }}>начинаем</span> MVP?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Endi MVP qadamlarini <b style={{ color: T.ink }}>to'g'ri tartibda</b> qo'yamiz. Uy poydevordan quriladi: avval mahsulotlar, keyin narx, so'ng chiroyli ko'rinish. Bo'laklarni <b style={{ color: T.ink }}>sudrab</b> qurilish tartibiga joylang.</>, ru: <>Теперь расставим шаги MVP <b style={{ color: T.ink }}>в правильном порядке</b>. Дом строится с фундамента: сначала товары, потом цены, затем красивый вид. <b style={{ color: T.ink }}>Перетащите</b> блоки в порядок стройки.</> })}</Mentor>
        <Zoomable>
          <DragDropOrder items={DECOMP_STEPS} hints={[{ uz: 'poydevor — eng avval', ru: 'фундамент — в самом начале' }, { uz: "poydevor ustiga — o'rtadagi qadam", ru: 'поверх фундамента — средний шаг' }, { uz: 'eng oxirida — bezak', ru: 'в самом конце — украшение' }]} onSolved={() => setDragDone(true)} />
          {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "To'g'ri! Avval poydevor (mahsulotlar), keyin narx, oxirida bezak. To'g'ri tartib — tez va aniq qurilish.", ru: 'Верно! Сначала фундамент (товары), потом цены, в конце украшение. Правильный порядок — быстрая и точная стройка.' })}</p></div>}
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — QADAM -> PROMPT (har buyruq → o'z natijasi) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const OPTS = [
    { id: 'a', label: tr({ uz: "ro'yxat", ru: 'список' }), good: false, why: tr({ uz: "Bitta so'z — AI «nimaning» ro'yxati ekanini bilmaydi.", ru: 'Одно слово — AI не знает, список «чего» нужен.' }) },
    { id: 'b', label: tr({ uz: "Maktab do'koni uchun 4 ta mahsulotdan iborat ro'yxat yarat — har birining nomi bilan", ru: 'Создай список из 4 товаров для школьного магазина — с названием каждого' }), good: true },
    { id: 'c', label: tr({ uz: 'biror narsa qil', ru: 'сделай что-нибудь' }), good: false, why: tr({ uz: "Mutlaqo noaniq — natija tasodifiy va bo'sh chiqadi.", ru: 'Совершенно неясно — результат будет случайным и пустым.' }) }
  ];
  const [picked, setPicked] = useState(storedAnswer ? 'b' : null);
  const [phase, setPhase] = useState(storedAnswer ? 'done' : 'idle'); // idle | building | done
  const timer = useRef(null);
  const good = picked === 'b' && phase === 'done';
  const done = good;
  useEffect(() => () => clearTimeout(timer.current), []);
  const pick = (id) => { if (good) return; clearTimeout(timer.current); setPicked(id); setPhase('building'); timer.current = setTimeout(() => setPhase('done'), 850); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = OPTS.find(o => o.id === picked);
  const showResult = picked && phase === 'done';
  return (
    <Stage eyebrow={tr({ uz: 'Qadam → buyruq', ru: 'Шаг → команда' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Aniq buyruqni tanlang', ru: 'Выберите точную команду' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bir buyruq — bir <span className="italic" style={{ color: T.accent }}>natija</span>. Qaysi biri aniq?</>, ru: <>Одна команда — один <span className="italic" style={{ color: T.accent }}>результат</span>. Какая из них точная?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Reja tayyor. Endi <b style={{ color: T.ink }}>1-qadamni</b> ("Mahsulotlar ro'yxatini yarat") AI buyrug'iga aylantiramiz. Har buyruqni bosib ko'ring — o'ngda AI <b style={{ color: T.ink }}>aynan shu buyruqdan</b> nima chiqarishini ko'rasiz. Aniq buyruq → aniq natija.</>, ru: <>План готов. Теперь превратим <b style={{ color: T.ink }}>шаг 1</b> («Создай список товаров») в команду для AI. Нажимайте на каждую команду — справа увидите, что AI выдаст <b style={{ color: T.ink }}>именно из неё</b>. Точная команда → точный результат.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="frame" style={{ padding: '12px 15px', display: 'flex', alignItems: 'center', gap: 10 }}><span className="num-badge" style={{ width: 26, height: 26, fontSize: 12 }}>1</span><span style={{ fontWeight: 600, color: T.ink }}>{tr({ uz: "Mahsulotlar ro'yxatini yarat", ru: 'Создай список товаров' })}</span></div>
            <p className="flow-label">{tr({ uz: 'Buyruqni tanlang — natijani solishtiring', ru: 'Выберите команду — сравните результат' })}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {OPTS.map(o => <button key={o.id} className={`hook-option ${picked === o.id ? 'on' : ''}`} disabled={good} onClick={() => pick(o.id)}><span className="radio">{picked === o.id && <span className="radio-dot" />}</span><span>{o.label}</span></button>)}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'AI natijasi', ru: 'Результат AI' })}</p>
            <Browser url="maktab-dokoni.uz">
              {!picked && <p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0, padding: '24px 0' }}>{tr({ uz: 'Chapdan buyruq tanlang', ru: 'Выберите команду слева' })}</p>}
              {picked && phase === 'building' && <BuildingPreview />}
              {showResult && cur.good && <div className="result-reveal"><ShopPreview showPrice={false} accent="#2563EB" /></div>}
              {showResult && !cur.good && (
                <div className="result-reveal" style={{ textAlign: 'center', padding: '14px 8px' }}>
                  <div style={{ fontSize: 30, marginBottom: 6 }}>🤷</div>
                  <p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 16, margin: '0 0 4px', color: T.ink2 }}>{tr({ uz: "Bo'sh natija", ru: 'Пустой результат' })}</p>
                  <p className="small" style={{ margin: 0, color: T.ink3, fontStyle: 'italic' }}>{tr({ uz: 'AI buyruqni tushunmadi…', ru: 'AI не понял команду…' })}</p>
                </div>
              )}
            </Browser>
            {showResult && !cur.good && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}><b>«{cur.label}»</b> — {cur.why} {tr({ uz: 'Mahsulot soni va nimasi kerakligini ayting.', ru: 'Скажите, сколько товаров и что именно нужно.' })}</p></div>}
            {good && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Mana! Aniq buyruq → AI 4 ta mahsulotni ro'yxat qildi. 1-qadam bajarildi. Keyingi qadam — narx qo'shish.", ru: 'Вот! Точная команда → AI составил список из 4 товаров. Шаг 1 выполнен. Следующий шаг — добавить цены.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — TEST 2 =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · Вопрос 2' })}
    questionText={tr({ uz: "Mini-do'kon qurishni nimadan boshlaysiz?", ru: 'С чего Вы начнёте строить мини-магазин?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Mini-do'kon qurishni <span className="italic" style={{ color: T.accent }}>nimadan</span> boshlaysiz?</>, ru: <>С чего <span className="italic" style={{ color: T.accent }}>начнёте</span> строить мини-магазин?</> })}</h2></>}
    audioText="Mini-do'kon qurishni nimadan boshlaymiz? Qaysi qism poydevor — o'ylab tanlang."
    options={[tr({ uz: 'Foydalanuvchi login tizimidan', ru: 'С системы логина пользователей' }), tr({ uz: "Mahsulotlar ro'yxatidan", ru: 'Со списка товаров' }), tr({ uz: 'Reklama bannerlaridan', ru: 'С рекламных баннеров' }), tr({ uz: "Mijoz sharhlari bo'limidan", ru: 'С раздела отзывов клиентов' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! Mahsulotlar ro'yxati — do'konning poydevori. Busiz qolgan hamma narsa (savat, qidiruv) ma'nosiz. Poydevordan boshlanadi.", ru: 'Верно! Список товаров — фундамент магазина. Без него всё остальное (корзина, поиск) бессмысленно. Начинают с фундамента.' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — login muhim, lekin u poydevor emas. Avval mahsulotlar bo'lishi kerak.", ru: 'Нет — логин важен, но это не фундамент. Сначала должны быть товары.' }),
      2: tr({ uz: "Yo'q — reklama keyin. Avval sotadigan mahsulot ro'yxati kerak.", ru: 'Нет — реклама потом. Сначала нужен список товаров, которые продаём.' }),
      3: tr({ uz: "Yo'q — sharhlar mahsulotga yoziladi. Demak avval mahsulotlar ro'yxati.", ru: 'Нет — отзывы пишут на товары. Значит, сначала список товаров.' }),
      default: tr({ uz: "Poydevor — mahsulotlar ro'yxati.", ru: 'Фундамент — список товаров.' })
    }} />
);

// ===== SCREEN 8 — O'ZAKNI AI BILAN QURISH =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [phase, setPhase] = useState(storedAnswer ? 'done' : 'idle'); // idle | planned | building | done
  const timer = useRef(null);
  const done = phase === 'done';
  const doneRef = useScrollIntoViewOnMobile(done);
  const PLAN = [tr({ uz: "Mahsulotlar ro'yxatini yarataman", ru: 'Создам список товаров' }), tr({ uz: "Har biriga narx qo'shaman", ru: 'Добавлю цену каждому' }), tr({ uz: 'Chiroyli kartalarga joylayman', ru: 'Оформлю в красивые карточки' })];
  useEffect(() => () => clearTimeout(timer.current), []);
  const send = () => { clearTimeout(timer.current); setPhase('planned'); };
  const approve = () => { clearTimeout(timer.current); setPhase('building'); timer.current = setTimeout(() => setPhase('done'), 1300); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Asosini qurish', ru: 'Строим основу' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Asosini qurib oling', ru: 'Постройте основу' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Reja tayyor — endi AI <span className="italic" style={{ color: T.accent }}>birinchi ishlaydigan versiyani</span> quradi</>, ru: <>План готов — теперь AI построит <span className="italic" style={{ color: T.accent }}>первую работающую версию</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana eng yoqimli qism! Bugun do'konning <b style={{ color: T.ink }}>asosini</b> quramiz — ya'ni mahsulotlar ro'yxati va narx (savat, qidiruv keyin qo'shiladi). Reja aniq bo'lgani uchun AI'ga ishonch bilan topshiramiz: avval u <b style={{ color: T.ink }}>rejani</b> ko'rsatadi — siz <b style={{ color: T.ink }}>tasdiqlaysiz</b> — keyin quradi.</>, ru: <>А вот и самая приятная часть! Сегодня мы строим <b style={{ color: T.ink }}>основу</b> магазина — список товаров и цены (корзина и поиск добавятся потом). План точный, поэтому уверенно поручаем AI: сначала он показывает <b style={{ color: T.ink }}>план</b> — Вы <b style={{ color: T.ink }}>подтверждаете</b> — потом он строит.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'MVP rejasi (3 qadam)', ru: 'План MVP (3 шага)' })}</p>
            <button className="btn" onClick={send} disabled={phase !== 'idle' && phase !== 'done'} style={{ alignSelf: 'flex-start' }}>{phase === 'idle' || phase === 'done' ? tr({ uz: 'Agentga yuborish', ru: 'Отправить агенту' }) : (phase === 'building' ? tr({ uz: 'Quryapti…', ru: 'Строит…' }) : tr({ uz: 'Reja tayyor', ru: 'План готов' }))}</button>
            {(phase === 'planned' || phase === 'building' || done) && (
              <div className="ai-card fade-step">
                <div className="ai-row"><span className="ai-badge" style={{ background: T.ink }}>Agent</span><span className="ai-bubble">{phase === 'planned' ? tr({ uz: 'Rejam — tasdiqlaysizmi?', ru: 'Мой план — подтверждаете?' }) : (phase === 'building' ? tr({ uz: 'Quryapman…', ru: 'Строю…' }) : tr({ uz: 'Bajardim', ru: 'Готово' }))}</span></div>
                {PLAN.map((p, i) => <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}><span style={{ color: phase === 'planned' ? T.ink3 : T.success }}>{phase === 'planned' ? '○' : '✓'}</span><span>{p}</span></div>)}
                {phase === 'planned' && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={approve}>{tr({ uz: 'Rejani tasdiqlash', ru: 'Подтвердить план' })}</button>}
                {phase === 'building' && <p className="ai-prompt" style={{ color: T.accent }}>{tr({ uz: 'Kod yozilyapti…', ru: 'Пишется код…' })}</p>}
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Do'konning asosiy qismi", ru: 'Основная часть магазина' })}</p>
            <Browser url="maktab-dokoni.uz">
              {phase === 'idle' && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: '(rejani yuboring)', ru: '(отправьте план)' })}</p>}
              {phase === 'planned' && <p className="small" style={{ margin: 0, opacity: 0.6, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: 'Tasdiqlashni kutyapti…', ru: 'Ждёт подтверждения…' })}</p>}
              {phase === 'building' && <BuildingPreview />}
              {done && <div className="result-reveal"><ShopPreview showPrice accent="#2563EB" /></div>}
            </Browser>
            {done && <div ref={doneRef} className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Asosiy qism tayyor! Mahsulotlar va narxlar ko'rinyapti — bu birinchi <b>ishlaydigan</b> versiya (MVP). Rejasiz boshdagi tartibsizlikni eslang — farqni his qildingizmi?</>, ru: <>Основа готова! Товары и цены видны — это первая <b>работающая</b> версия (MVP). Вспомните хаос без плана в начале — чувствуете разницу?</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — O'ZAKNI TEKSHIRISH =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const CHECKS = [
    { id: 'c1', label: tr({ uz: "Mahsulotlar ko'rinyaptimi?", ru: 'Товары видны?' }), note: tr({ uz: 'Ha — 4 ta mahsulot bor.', ru: 'Да — есть 4 товара.' }) },
    { id: 'c2', label: tr({ uz: 'Har biriga narx bormi?', ru: 'У каждого есть цена?' }), note: tr({ uz: "Ha — har biriga narx qo'shilgan.", ru: 'Да — цена добавлена каждому.' }) },
    { id: 'c3', label: tr({ uz: 'Savat bormi?', ru: 'Корзина есть?' }), note: tr({ uz: "Yo'q — va bu normal! Savat keyingi bosqichda.", ru: 'Нет — и это нормально! Корзина на следующем этапе.' }) }
  ];
  const [ok, setOk] = useState(storedAnswer ? new Set(['c1', 'c2', 'c3']) : new Set());
  const done = ok.size >= CHECKS.length;
  const check = (id) => setOk(prev => { const n = new Set(prev); n.add(id); return n; });
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Tekshirish', ru: 'Проверка' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Hammasini tekshiring', ru: 'Проверьте всё' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Asosiy qism <span className="italic" style={{ color: T.accent }}>rejaga mos</span> chiqdimi?</>, ru: <>Основа получилась <span className="italic" style={{ color: T.accent }}>по плану</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI qurdi — endi siz <b style={{ color: T.ink }}>arxitektor</b> sifatida tekshirasiz: rejada nima bo'lsa, o'shalar bormi? Har bir savolni bosib, do'kon bilan solishtiring. (Savat yo'qligi — xato emas, u keyingi bosqichda.)</>, ru: <>AI построил — теперь Вы, как <b style={{ color: T.ink }}>архитектор</b>, проверяете: всё ли из плана на месте? Нажимайте на каждый вопрос и сверяйте с магазином. (Отсутствие корзины — не ошибка, она на следующем этапе.)</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Do'konning asosiy qismi", ru: 'Основная часть магазина' })}</p>
            <Browser url="maktab-dokoni.uz"><ShopPreview showPrice accent="#2563EB" /></Browser>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Tekshiruv ro'yxati", ru: 'Чек-лист проверки' })}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CHECKS.map(c => {
                const done1 = ok.has(c.id);
                return (
                  <button key={c.id} onClick={() => check(c.id)} disabled={done1} style={{ textAlign: 'left', border: 'none', borderRadius: 11, padding: '11px 14px', background: T.paper, cursor: done1 ? 'default' : 'pointer', boxShadow: done1 ? `inset 0 0 0 2px ${T.success}` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span style={{ color: done1 ? T.success : T.ink3, fontWeight: 700 }}>{done1 ? '✓' : '○'}</span><span style={{ fontWeight: 600, fontSize: 14, color: T.ink }}>{c.label}</span></div>
                    {done1 && <p className="small fade-step" style={{ margin: '6px 0 0 18px', color: T.ink2 }}>{c.note}</p>}
                  </button>
                );
              })}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Asosiy qism rejaga to'liq mos! Mahsulot va narx bor, savat esa ataylab keyinga qoldirilgan. Bu — nazoratli, rejali ishlash.", ru: 'Основа полностью соответствует плану! Товары и цены есть, а корзина сознательно отложена на потом. Это и есть контролируемая работа по плану.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TEST 3 =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · Вопрос 3' })}
    questionText={tr({ uz: "Bu bosqichda do'konning qaysi qismini qurdik?", ru: 'Какую часть магазина мы построили на этом этапе?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Bu bosqichda do'konning <span className="italic" style={{ color: T.accent }}>qaysi qismini</span> qurdik?</>, ru: <>Какую <span className="italic" style={{ color: T.accent }}>часть магазина</span> мы построили на этом этапе?</> })}</h2></>}
    audioText="Bu bosqichda do'konning qaysi qismini qurdik? To'g'ri javobni tanlang."
    options={[tr({ uz: "Mahsulot katalogi: ro'yxat va narx", ru: 'Каталог товаров: список и цены' }), tr({ uz: "Savat va to'lov tizimi to'liq", ru: 'Корзину и систему оплаты полностью' }), tr({ uz: "Hamma narsa — do'kon butunlay tayyor", ru: 'Всё — магазин полностью готов' }), tr({ uz: "Faqat login va ro'yxatdan o'tish", ru: 'Только логин и регистрацию' })]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! Biz MVP o'zagini — mahsulotlar ro'yxati va narxlarni — qurdik. Savat, jami narx va boshqalari keyingi darsda qo'shiladi.", ru: 'Верно! Мы построили ядро MVP — список товаров и цены. Корзина, итоговая сумма и остальное добавятся на следующем уроке.' })}
    explainWrong={{
      1: tr({ uz: "Yo'q — savat va to'lov hali yo'q, ular keyingi bosqich. Biz katalogni qurdik.", ru: 'Нет — корзины и оплаты ещё нет, это следующий этап. Мы построили каталог.' }),
      2: tr({ uz: "Yo'q — hammasi tugamadi. Biz faqat o'zakni (katalog) qurdik, davomi bor.", ru: 'Нет — ещё не всё. Мы построили только ядро (каталог), продолжение впереди.' }),
      3: tr({ uz: "Yo'q — login MVP'ga kirmadi. Biz mahsulot ro'yxati va narxni qurdik.", ru: 'Нет — логин не вошёл в MVP. Мы построили список товаров и цены.' }),
      default: tr({ uz: "Biz MVP o'zagini qurdik: ro'yxat va narx.", ru: 'Мы построили ядро MVP: список и цены.' })
    }} />
);

// ===== SCREEN 11 — KEYINGI BOSQICH (4-darsga ko'prik) =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const CARDS = {
    bugun: { name: tr({ uz: 'Bugun qurdik', ru: 'Построили сегодня' }), color: T.success, items: [tr({ uz: "Mahsulotlar ro'yxati", ru: 'Список товаров' }), tr({ uz: 'Har biriga narx', ru: 'Цена у каждого' }), tr({ uz: 'Chiroyli katalog', ru: 'Красивый каталог' })] },
    keyin: { name: tr({ uz: 'Keyingi darsda', ru: 'На следующем уроке' }), color: T.accent, items: [tr({ uz: "Savatga qo'shish", ru: 'Добавление в корзину' }), tr({ uz: 'Jami narx hisobi', ru: 'Подсчёт итоговой суммы' }), tr({ uz: 'Bug tuzatish va deploy', ru: 'Исправление багов и деплой' })] }
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 2;
  const tap = (k) => { setActive(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Keyingi bosqich', ru: 'Следующий этап' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `${seen.size}/2 ko'ring`, ru: `Посмотрите ${seen.size}/2` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Asosiy qism tayyor — <span className="italic" style={{ color: T.accent }}>keyin nima?</span></>, ru: <>Основа готова — <span className="italic" style={{ color: T.accent }}>что дальше?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Rejaning kuchi shunda: nima qilinganini va nima qolganini <b style={{ color: T.ink }}>aniq bilasiz</b>. Bugun do'konning asosini qurdik. Keyingi darsda uni <b style={{ color: T.ink }}>to'liq MVP</b>ga aylantiramiz — savat va jami narx qo'shamiz, so'ng internetga chiqaramiz (deploy). Quyidagi yo'l-xarita buni ko'rsatadi:</>, ru: <>В этом сила плана: Вы <b style={{ color: T.ink }}>точно знаете</b>, что сделано и что осталось. Сегодня мы построили основу магазина. На следующем уроке превратим её в <b style={{ color: T.ink }}>полный MVP</b> — добавим корзину и итоговую сумму, а затем выложим в интернет (деплой). Дорожная карта ниже показывает это:</> })}</Mentor>
        <JourneyBar stages={[
          { label: tr({ uz: 'Asosiy qism', ru: 'Основа' }), tag: tr({ uz: 'bugun bajardik', ru: 'сделали сегодня' }), state: 'done' },
          { label: tr({ uz: "To'liq MVP", ru: 'Полный MVP' }), tag: tr({ uz: 'keyingi dars', ru: 'следующий урок' }), state: 'cur' },
          { label: tr({ uz: 'Deploy', ru: 'Деплой' }), tag: tr({ uz: "do'kon tayyor", ru: 'магазин готов' }), state: 'next' }
        ]} />
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
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Qadam-baqadam: bugun o'zak, keyingi darsda to'liq MVP. Mana shu — professional ishlash usuli.", ru: 'Шаг за шагом: сегодня ядро, на следующем уроке полный MVP. Так работают профессионалы.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// Qayta ishlatiladigan MVP-taxta (s12, s15)
const MvpRows = ({ items, placed, setPlaced }) => {
  const cb = (f) => (f.mvp ? 'mvp' : 'keyin');
  return (
    <Zoomable>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(f => {
        const b = placed[f.id];
        const ok = b === cb(f);
        const wrong = b && !ok;
        return (
          <div key={f.id} className="frame" style={{ padding: '11px 14px', display: 'flex', flexDirection: 'column', gap: wrong ? 7 : 0, boxShadow: ok ? `inset 0 0 0 2px ${T.success}, 0 6px 16px -6px rgba(31,122,77,0.2)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 'clamp(13px,1.7vw,15px)', color: T.ink, minWidth: 120 }}>{ok && <span style={{ color: T.success, marginRight: 6 }}>✓</span>}{tr(f.label)}</span>
              <div style={{ display: 'flex', gap: 7 }}>
                <button className="chip" onClick={() => setPlaced(p => ({ ...p, [f.id]: 'mvp' }))} style={{ background: b === 'mvp' ? (ok ? T.success : T.accent) : T.paper, color: b === 'mvp' ? '#fff' : T.ink, boxShadow: `0 4px 12px -5px rgba(${T.shadowBase},0.18)` }}>{tr({ uz: 'Shart (MVP)', ru: 'Нужно (MVP)' })}</button>
                <button className="chip" onClick={() => setPlaced(p => ({ ...p, [f.id]: 'keyin' }))} style={{ background: b === 'keyin' ? (ok ? T.success : T.accent) : T.paper, color: b === 'keyin' ? '#fff' : T.ink, boxShadow: `0 4px 12px -5px rgba(${T.shadowBase},0.18)` }}>{tr({ uz: 'Keyin', ru: 'Потом' })}</button>
              </div>
            </div>
            {wrong && <p className="small" style={{ margin: 0, color: T.accent }}>{f.mvp ? tr({ uz: 'Bu MVP uchun shart.', ru: 'Это обязательно для MVP.' }) : tr({ uz: 'Muhim, lekin keyingi bosqich uchun.', ru: 'Важно, но для следующего этапа.' })}</p>}
          </div>
        );
      })}
    </div>
    </Zoomable>
  );
};

// ===== SCREEN 12 — O'Z DEKOMPOZITSIYANG (to-do ilova) =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const TODO = [
    { id: 'add', label: tr({ uz: "Vazifa qo'shish", ru: 'Добавление задачи' }), mvp: true },
    { id: 'list', label: tr({ uz: "Vazifalar ro'yxati", ru: 'Список задач' }), mvp: true },
    { id: 'check', label: tr({ uz: 'Bajarildi deb belgilash', ru: 'Отметка «выполнено»' }), mvp: true },
    { id: 'remind', label: tr({ uz: 'Eslatma (notification)', ru: 'Напоминание (notification)' }), mvp: false },
    { id: 'tags', label: tr({ uz: 'Ranglar va teglar', ru: 'Цвета и теги' }), mvp: false },
    { id: 'stats', label: tr({ uz: 'Statistika', ru: 'Статистика' }), mvp: false }
  ];
  const [placed, setPlaced] = useState(storedAnswer ? Object.fromEntries(TODO.map(f => [f.id, f.mvp ? 'mvp' : 'keyin'])) : {});
  const done = TODO.every(f => placed[f.id] === (f.mvp ? 'mvp' : 'keyin'));
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: "O'z dekompozitsiyangiz", ru: 'Ваша декомпозиция' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "MVP'ni belgilang", ru: 'Отметьте MVP' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>boshqa</span> loyihani bo'laklang</>, ru: <>Теперь разбейте <span className="italic" style={{ color: T.accent }}>другой</span> проект</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mahorat boshqa loyihalarga ham mos. Mana — <b style={{ color: T.ink }}>vazifalar ilovasi (to-do)</b>. Uning xususiyatlarini MVP (eng zarur, ishlaydigan) va keyin (bonus) ga ajrating.</>, ru: <>Этот навык подходит и для других проектов. Вот <b style={{ color: T.ink }}>приложение задач (to-do)</b>. Разделите его функции на MVP (самое нужное, работающее) и «потом» (бонус).</> })}</Mentor>
        <MvpRows items={TODO} placed={placed} setPlaced={setPlaced} />
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Mukammal! To-do ilovaning MVP'si — vazifa qo'shish, ro'yxat va belgilash. Eslatma, teglar, statistika — keyin. Siz dekompozitsiyani egalladingiz!", ru: 'Идеально! MVP приложения to-do — добавление задачи, список и отметка. Напоминания, теги, статистика — потом. Вы освоили декомпозицию!' })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — HAYOTDA (dekompozitsiya har joyda) =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const CARDS = {
    apps: { name: tr({ uz: "Mashhur ilovalar MVP'dan boshlangan", ru: 'Известные приложения начинались с MVP' }), color: T.success, items: [tr({ uz: 'Instagram — avval faqat rasm ulashish', ru: 'Instagram — сначала только обмен фото' }), tr({ uz: 'YouTube — avval oddiy video yuklash', ru: 'YouTube — сначала простая загрузка видео' }), tr({ uz: 'Keyin sekin-asta yangi funksiyalar', ru: 'Потом постепенно новые функции' })] },
    life: { name: tr({ uz: 'Dekompozitsiya — hayotda ham', ru: 'Декомпозиция — и в жизни тоже' }), color: T.blue, items: [tr({ uz: 'Uy qurish — chizmadan boshlanadi', ru: 'Стройка дома начинается с чертежа' }), tr({ uz: 'Ovqat — retsept qadamlari', ru: 'Еда — шаги рецепта' }), tr({ uz: 'Sayohat — bosqichma-bosqich reja', ru: 'Путешествие — поэтапный план' })] }
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
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bu usulni <span className="italic" style={{ color: T.accent }}>kim</span> ishlatadi?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>пользуется</span> этим методом?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Dekompozitsiya va MVP — bu o'yin emas, <b style={{ color: T.ink }}>haqiqiy dasturchilar va startaplar</b> aynan shunday ishlaydi. Hatto kundalik hayotda ham. Ikkala kartani ko'ring.</>, ru: <>Декомпозиция и MVP — не игра: именно так работают <b style={{ color: T.ink }}>настоящие разработчики и стартапы</b>. И даже в повседневной жизни. Посмотрите обе карточки.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.keys(CARDS).map(k => (
                <button key={k} onClick={() => tap(k)} style={{ display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 14, padding: '15px 16px', background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${CARDS[k].color}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: 'all 0.18s' }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: CARDS[k].color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 15, color: T.ink }}>{CARDS[k].name}</span>
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
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Katta narsa — kichik qadamlardan. MVP'dan boshlab, sekin-asta o'stiriladi. Siz endi shunday fikrlaysiz.", ru: 'Большое складывается из маленьких шагов. Начинают с MVP и постепенно растят. Теперь Вы мыслите именно так.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — ANTIGRAVITY (rejani tasdiqlash odati) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [phase, setPhase] = useState(storedAnswer ? 'done' : 'idle'); // idle | planned | building | done
  const timer = useRef(null);
  const done = phase === 'done';
  const doneRef = useScrollIntoViewOnMobile(done);
  const PLAN = [tr({ uz: "Mahsulotlar ro'yxatini yarataman", ru: 'Создам список товаров' }), tr({ uz: "Har biriga narx qo'shaman", ru: 'Добавлю цену каждому' }), tr({ uz: 'Chiroyli kartalarga joylayman', ru: 'Оформлю в красивые карточки' })];
  useEffect(() => () => clearTimeout(timer.current), []);
  const send = () => { clearTimeout(timer.current); setPhase('planned'); };
  const approve = () => { clearTimeout(timer.current); setPhase('building'); timer.current = setTimeout(() => setPhase('done'), 1300); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Haqiqiy asbob', ru: 'Настоящий инструмент' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Demoni ko'ring", ru: 'Посмотрите демо' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Antigravity'da <span className="italic" style={{ color: T.accent }}>rejani</span> qanday tasdiqlaymiz?</>, ru: <>Как подтвердить <span className="italic" style={{ color: T.accent }}>план</span> в Antigravity?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Haqiqiy <b style={{ color: T.ink }}>Antigravity</b>da eng muhim odat: agent quryotganidan oldin <b style={{ color: T.ink }}>rejasini ko'rsatadi</b>. Siz uni o'qiysiz — to'g'ri bo'lsa tasdiqlaysiz, noto'g'ri bo'lsa tuzatasiz. Demoni ko'ring.</>, ru: <>В настоящем <b style={{ color: T.ink }}>Antigravity</b> самая важная привычка: прежде чем строить, агент <b style={{ color: T.ink }}>показывает план</b>. Вы его читаете — если всё верно, подтверждаете, если нет — правите. Посмотрите демо.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Antigravity'ga topshiriq", ru: 'Задание для Antigravity' })}</p>
            <div className="promptbox">{tr({ uz: <>Maktab do'koni uchun mahsulot katalogini qur — <span className="pb-slot">ro'yxat</span> va <span className="pb-slot">narx</span> bilan.</>, ru: <>Построй каталог товаров для школьного магазина — со <span className="pb-slot">списком</span> и <span className="pb-slot">ценами</span>.</> })}</div>
            <button className="btn" onClick={send} disabled={phase !== 'idle' && phase !== 'done'} style={{ alignSelf: 'flex-start' }}>{phase === 'idle' || phase === 'done' ? tr({ uz: "Antigravity'ga yuborish", ru: 'Отправить в Antigravity' }) : (phase === 'building' ? tr({ uz: 'Quryapti…', ru: 'Строит…' }) : tr({ uz: 'Reja tayyor', ru: 'План готов' }))}</button>
            {(phase === 'planned' || phase === 'building' || done) && (
              <div className="ai-card fade-step">
                <div className="ai-row"><span className="ai-badge" style={{ background: T.ink }}>Agent</span><span className="ai-bubble">{phase === 'planned' ? tr({ uz: 'Rejam — tasdiqlaysizmi?', ru: 'Мой план — подтверждаете?' }) : (phase === 'building' ? tr({ uz: 'Quryapman…', ru: 'Строю…' }) : tr({ uz: 'Bajardim', ru: 'Готово' }))}</span></div>
                {PLAN.map((p, i) => <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}><span style={{ color: phase === 'planned' ? T.ink3 : T.success }}>{phase === 'planned' ? '○' : '✓'}</span><span>{p}</span></div>)}
                {phase === 'planned' && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={approve}>{tr({ uz: "Rejani o'qidim — tasdiqlash", ru: 'План прочитан — подтверждаю' })}</button>}
                {phase === 'building' && <p className="ai-prompt" style={{ color: T.accent }}>{tr({ uz: 'Kod yozilyapti…', ru: 'Пишется код…' })}</p>}
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Antigravity brauzeri', ru: 'Браузер Antigravity' })}</p>
            <Browser url="maktab-dokoni.uz">
              {phase === 'idle' && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: '(topshiriqni yuboring)', ru: '(отправьте задание)' })}</p>}
              {(phase === 'planned' || phase === 'building') && <p className="small" style={{ margin: 0, opacity: 0.6, textAlign: 'center', padding: '24px 0' }}>{phase === 'planned' ? tr({ uz: 'Tasdiqlashni kutyapti…', ru: 'Ждёт подтверждения…' }) : tr({ uz: 'Quryapti…', ru: 'Строит…' })}</p>}
              {done && <ShopPreview showPrice accent="#2563EB" />}
            </Browser>
            {done && <div ref={doneRef} className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Aynan shu! Uyga vazifada o'z g'oyangizni Antigravity'da quring: avval reja, o'qing, tasdiqlang, keyin o'zak.", ru: 'Именно так! В домашнем задании постройте свою идею в Antigravity: сначала план — прочитайте, подтвердите, потом ядро.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — YAKUNIY (restoran sayti dekompozitsiyasi) =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const REST = [
    { id: 'menu', label: tr({ uz: 'Taomlar menyusi', ru: 'Меню блюд' }), mvp: true },
    { id: 'price', label: tr({ uz: 'Narxlar', ru: 'Цены' }), mvp: true },
    { id: 'order', label: tr({ uz: 'Onlayn buyurtma', ru: 'Онлайн-заказ' }), mvp: false },
    { id: 'review', label: tr({ uz: 'Mijoz sharhlari', ru: 'Отзывы клиентов' }), mvp: false }
  ];
  const [placed, setPlaced] = useState(storedAnswer?.correct ? Object.fromEntries(REST.map(f => [f.id, f.mvp ? 'mvp' : 'keyin'])) : {});
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const passedRef = useScrollIntoViewOnMobile(passed);
  const allCorrect = REST.every(f => placed[f.id] === (f.mvp ? 'mvp' : 'keyin'));
  useEffect(() => { if (allCorrect && !passed) { setPassed(true); onAnswer(screen, { stage: 'final', screenIdx: screen, question: tr({ uz: 'Restoran sayti dekompozitsiyasi (MVP)', ru: 'Декомпозиция сайта ресторана (MVP)' }), studentAnswer: JSON.stringify(placed), correct: true, firstAttemptCorrect: true, solved: true, picked: 'ok' }); } }, [allCorrect]);
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "MVP'ni to'g'ri belgilang", ru: 'Отметьте MVP правильно' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi sinov: <span className="italic" style={{ color: T.accent }}>restoran sayti</span></>, ru: <>Последнее испытание: <span className="italic" style={{ color: T.accent }}>сайт ресторана</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Vazifa: <b style={{ color: T.ink }}>restoran sayti</b> uchun MVP'ni rejalashtiring. Qaysi xususiyat eng zarur (shart), qaysi biri keyin? Har birini to'g'ri joylang.</>, ru: <>Задача: спланируйте MVP для <b style={{ color: T.ink }}>сайта ресторана</b>. Какая функция самая необходимая (нужно), а какая — потом? Разложите каждую правильно.</> })}</Mentor>
        <MvpRows items={REST} placed={placed} setPlaced={setPlaced} />
        {passed ? (
          <div ref={passedRef} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px,1.6vw,14px)' }}>
            <p className="flow-label">{tr({ uz: 'Natija — restoran saytining ishlaydigan asosi', ru: 'Результат — работающая основа сайта ресторана' })}</p>
            <div className="result-reveal" style={{ maxWidth: 470 }}><Browser url="milliy-taomlar.uz"><RestaurantPreview /></Browser></div>
            <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Mukammal! Menyu va narx — eng zarur asos, sayt shu zahoti ishlaydi. Onlayn buyurtma va sharhlar esa keyingi bosqich. Siz endi istalgan loyihani rejalashtira olasiz!', ru: 'Идеально! Меню и цены — самая необходимая основа, сайт сразу работает. Онлайн-заказ и отзывы — следующий этап. Теперь Вы можете спланировать любой проект!' })}</p></div>
          </div>
        ) : <p className="body" style={{ margin: 0, color: T.ink3, fontSize: 13 }}>{tr({ uz: "Eslatma: restoranni ko'rsatish uchun avval menyu va narx kerak.", ru: 'Подсказка: чтобы показать ресторан, сначала нужны меню и цены.' })}</p>}
        {isMentorLive && <MentorWorkStats live={_live} screenIdx={screen} taskLabel={tr({ uz: "Restoran sayti MVP'sini rejalashtirish", ru: 'Планирование MVP сайта ресторана' })} />}
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
  const RECAP = [tr({ uz: "Rejasiz boshlash — tartibsizlik; avval bo'laklash kerak", ru: 'Начинать без плана — хаос; сначала нужно разбить' }), tr({ uz: "Katta vazifa = ko'p kichik qadam (dekompozitsiya)", ru: 'Большая задача = много маленьких шагов (декомпозиция)' }), tr({ uz: 'MVP — eng kichik ishlaydigan versiya (shart vs keyin)', ru: 'MVP — минимальная работающая версия (нужно vs потом)' }), tr({ uz: 'Qadamlar tartibi: poydevordan boshlanadi', ru: 'Порядок шагов: начинаем с фундамента' }), tr({ uz: "O'zakni AI bilan quramiz — reja, tasdiq, natija", ru: 'Ядро строим вместе с AI — план, подтверждение, результат' })];
  const HOMEWORK = [{ b: tr({ uz: "O'z g'oyangiz", ru: 'Своя идея' }), t: tr({ uz: "— bitta loyiha o'ylab, uni qadamlarga bo'ling", ru: '— придумайте один проект и разбейте его на шаги' }) }, { b: tr({ uz: "MVP'ni belgilang", ru: 'Отметьте MVP' }), t: tr({ uz: '— qaysi xususiyat shart, qaysi biri keyin?', ru: '— какая функция нужна сейчас, а какая потом?' }) }, { b: tr({ uz: "Antigravity'da", ru: 'В Antigravity' }), t: tr({ uz: "— rejani tasdiqlab, o'zakni qurdiring", ru: '— подтвердите план и постройте ядро' }) }];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: '3-praktika tugadi', ru: 'Практика 3 завершена' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi siz — loyihaning <span className="italic" style={{ color: T.accent }}>arxitektori</span></>, ru: <>Теперь Вы — <span className="italic" style={{ color: T.accent }}>архитектор</span> проекта</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} disabled={studentWait} liveOn={studentLive} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: 'Rejalashtirishni mashq qiling:', ru: 'Потренируйте планирование:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>))}</ul><p className="hw-note">{tr({ uz: "Esda tuting: avval o'ylab bo'laklang, keyin AI'ni oching.", ru: 'Помните: сначала подумайте и разбейте, потом открывайте AI.' })}</p></div>}
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
const Q_LABELS = { 4: { uz: "1 — MVP nima", ru: '1 — Что такое MVP' }, 7: { uz: "2 — Nimadan boshlash", ru: '2 — С чего начать' }, 10: { uz: "3 — Nima qurdik", ru: '3 — Что построили' }, 15: { uz: "4 — Loyiha 5 qadami", ru: '4 — Декомпозиция проекта' } };

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
const INLINE_KEYS = { s4: 0, s7: 1, s10: 0, s15: -1 };

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
    // Reytingga FAQAT baholanadigan (scored) test ekranlari hisoblanadi
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
                      <span className="qstat-lbl">{tr(Q_LABELS[q]) || `#${q}`}{hard && ' ⚠️'}</span>
                      <span className="mstats-track"><span className="mstats-fill" style={{ width: `${pct}%`, background: hard ? T.accent : T.success }} /></span>
                      <span className="mono qstat-n">{okN}/{qa.length}</span>
                    </div>
                  );
                })}
              </div>
              {live.mode === 'mentor' && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.', ru: '⚠️ — вопросы, на которых класс споткнулся. Рекомендуем объяснить ещё раз.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
//  🔧 INTERAKTIV QATLAMLAR (Htmllesson1 / HtmlPractice etalonidan) — dekompozitsiya darsiga moslangan
// ============================================================

// backtick chiplar: `so'z` matn ichida chip bo'lib chiqadi (test/arena savollarida)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split(/(`[^`]+`)/g).map((p, i) => (p.startsWith('`') && p.endsWith('`') ? <code key={i} className="qcode">{p.slice(1, -1)}</code> : p))
  : s;

// 🔀 Qayta ishlatiladigan DRAG-DROP ORDER — qadamlarni o'zi sudrab to'g'ri tartibga qo'yadi (StrictMode-safe: yagona atomik holat).
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
            {sid ? <button className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr(byId[sid].label)}</button> : <span className="dd-hint">{hints ? tr(hints[i]) : tr({ uz: 'bu yerga joylang', ru: 'положите сюда' })}</span>}
          </div>
        ))}
      </div>
      <div className="dd-pool">
        {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: 'Порядок неверный — нажмите на блок, верните его и разложите заново' })}</span>}
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>
      {solved && <div className="dd-done">{tr({ uz: "✓ To'g'ri! Qadamlar aynan shu tartibda.", ru: '✓ Верно! Шаги именно в таком порядке.' })}</div>}
      {wrong && !solved && <div className="dd-wrong">{tr({ uz: '⚠️ Tartib xato — qayta joylang.', ru: '⚠️ Порядок неверный — разложите заново.' })}</div>}
    </div>
  );
}

// 🃏 Qayta ishlatiladigan FLASHCARDS — aktiv takrorlash (3D flip + o'z-o'zini baholash).
const PLANNING_FLASHCARDS = [
  { front: { uz: "Katta vazifani kichik qadamlarga bo'lish qanday ataladi?", ru: 'Как называется разбиение большой задачи на маленькие шаги?' }, back: { uz: 'Dekompozitsiya', ru: 'Декомпозиция' }, note: { uz: "avval bo'laklaymiz, keyin quramiz", ru: 'сначала разбиваем, потом строим' } },
  { front: { uz: 'MVP nima degani?', ru: 'Что значит MVP?' }, back: { uz: 'Eng kichik ishlaydigan versiya', ru: 'Минимальная работающая версия' }, note: { uz: 'skeytbord ham manzilga olib boradi', ru: 'скейтборд тоже довезёт до места' } },
  { front: { uz: "AI'ni ochishdan oldin nima tayyorlaysiz?", ru: 'Что Вы готовите до того, как открыть AI?' }, back: { uz: 'Reja', ru: 'План' }, note: { uz: "avval o'ylaymiz, keyin buyruq beramiz", ru: 'сначала думаем, потом даём команду' } },
  { front: { uz: "Mini-do'konni qaysi qismidan boshlaymiz?", ru: 'С какой части начинаем мини-магазин?' }, back: { uz: "Mahsulotlar ro'yxatidan", ru: 'Со списка товаров' }, note: { uz: "bu poydevor — usiz savat bekor", ru: 'это фундамент — без него корзина не нужна' } },
  { front: { uz: "Do'kon MVP o'zagi nimalardan iborat?", ru: 'Из чего состоит ядро MVP магазина?' }, back: { uz: "Ro'yxat va narx", ru: 'Список и цены' }, note: { uz: "katalog — mijoz ko'radigan vitrina", ru: 'каталог — витрина, которую видит клиент' } },
  { front: { uz: 'Loyihada siz qaysi rolni bajarasiz?', ru: 'Какую роль в проекте выполняете Вы?' }, back: { uz: 'Arxitektor', ru: 'Архитектор' }, note: { uz: 'siz reja tuzasiz, AI quradi', ru: 'Вы составляете план, AI строит' } },
  { front: { uz: 'Login va reklama MVP uchun shartmi?', ru: 'Логин и реклама обязательны для MVP?' }, back: { uz: "Yo'q", ru: 'Нет' }, note: { uz: "bular bezak — keyin qo'shiladi", ru: 'это украшение — добавим потом' } },
  { front: { uz: 'Aniq buyruq nima beradi?', ru: 'Что даёт точная команда?' }, back: { uz: 'Aniq natija', ru: 'Точный результат' }, note: { uz: "«4 mahsulotli ro'yxat» — «biror narsa qil» emas", ru: '«список из 4 товаров», а не «сделай что-нибудь»' } },
  { front: { uz: 'Agent qurishdan oldin nima qiladi?', ru: 'Что делает агент, прежде чем строить?' }, back: { uz: "Rejasini ko'rsatadi", ru: 'Показывает свой план' }, note: { uz: 'siz tasdiqlaysiz — keyin quradi', ru: 'Вы подтверждаете — и он строит' } },
  { front: { uz: "To'g'ri qurilish tartibi qanday?", ru: 'Какой порядок стройки верный?' }, back: { uz: "Ro'yxat → narx → ko'rinish", ru: 'Список → цены → вид' }, note: { uz: 'pastdan yuqoriga: avval asos', ru: 'снизу вверх: сначала основа' } },
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'atama yodlandi', ru: 'терминов выучено' })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Учим' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
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

// ===== ScreenFlashcards — Quizlet-uslub takrorlash (kalit so'zlar → kartalar) =====
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={PLANNING_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

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

// ⚡ CODE STRIKE — neon-kapsula (CTA'da bosiladi, lobbyda brend-lavha). Ichida darsning QZ_BG_SHAPES tokenlari suzadi.
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
          <span className="cs-hud-i">🏆 PODIUM</span>
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
    const TOK = ['MVP', tr({ uz: 'reja', ru: 'план' }), tr({ uz: 'qadam', ru: 'шаг' }), '→', tr({ uz: "o'zak", ru: 'ядро' }), '1.', '2.', ';'];
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

// ===== 🏅 ACHIEVEMENTS (nishonlar) — dekompozitsiya praktikasidagi real bosqichlar =====
const ACHIEVEMENTS = {
  mvp:       { icon: '🎯', name: 'MVP!',      desc: { uz: 'MVP — eng kichik ishlaydigan versiyani tushundingiz', ru: 'Вы поняли MVP — минимальную работающую версию' } },
  planner:   { icon: '🧭', name: 'Planner!',  desc: { uz: "Qadamlarni to'g'ri tartibga sudrab qo'ydingiz", ru: 'Вы перетащили шаги в правильный порядок' } },
  architect: { icon: '📐', name: 'Architect!', desc: { uz: 'Nimadan boshlashni bildingiz — poydevordan', ru: 'Вы узнали, с чего начинать — с фундамента' } },
  graduate:  { icon: '🏆', name: 'Level Up!', desc: { uz: 'Dekompozitsiya praktikasini yakunladingiz', ru: 'Вы завершили практику по декомпозиции' } },
};
// Ekran id → nishon (recordAnswer'da faqat SCORED test / challenge-gate ekranda, data.correct bo'lsa beriladi)
const ACH_TRIGGERS = { s4: 'mvp', s5: 'planner', s10: 'architect' };

// 🏅 TO'LIQ-EKRAN NISHON BAYRAMI
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

// ===== ⚔️ MUSTAHKAMLASH-JANG (CodeStrike arena) =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi kod/reja tokenlari (dars-DNK — rejalashtirish atamalari)
const QZ_BG_SHAPES = [
  { ch: 'MVP',    l: 6,  t: 18, s: 30, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: { uz: 'reja', ru: 'план' },   l: 82, t: 12, s: 26, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: '1.',     l: 9,  t: 74, s: 30, c: 'rgba(255,110,70,0.15)',  d: 27, dl: 0.8 },
  { ch: { uz: 'qadam', ru: 'шаг' },  l: 76, t: 70, s: 26, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: { uz: "o'zak", ru: 'ядро' },  l: 46, t: 86, s: 28, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: '→',      l: 66, t: 24, s: 22, c: 'rgba(80,200,255,0.14)',  d: 17, dl: 0.4 },
  { ch: '2.',     l: 22, t: 36, s: 22, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: { uz: 'shart', ru: 'нужно' },  l: 92, t: 46, s: 24, c: 'rgba(120,235,175,0.13)', d: 24, dl: 1.3 },
  { ch: '3.',     l: 2,  t: 46, s: 24, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: 'Dekompozitsiya nima?', ru: 'Что такое декомпозиция?' }, opts: [{ uz: "Vazifani kichik qadamlarga bo'lish", ru: 'Разбить задачу на маленькие шаги' }, { uz: "Kodni butunlay o'chirib tashlash", ru: 'Полностью удалить код' }, { uz: 'Sahifaga rang va shrift tanlash', ru: 'Выбрать цвета и шрифты для страницы' }, { uz: 'Tayyor saytni serverga joylash', ru: 'Выложить готовый сайт на сервер' }], correct: 0 },
  { q: { uz: "MVP nima ma'noni beradi?", ru: 'Что означает MVP?' }, opts: [{ uz: 'Eng qimmat, murakkab versiya', ru: 'Самая дорогая, сложная версия' }, { uz: 'Eng kichik ishlaydigan versiya', ru: 'Минимальная работающая версия' }, { uz: 'Eng chiroyli, jozibali dizayn', ru: 'Самый красивый, эффектный дизайн' }, { uz: 'Loyihaning oxirgi varianti', ru: 'Финальная версия проекта' }], correct: 1 },
  { q: { uz: "AI'ni ochishdan oldin nima qilish kerak?", ru: 'Что нужно сделать до открытия AI?' }, opts: [{ uz: "Rejani tuzish (bo'laklash)", ru: 'Составить план (разбить задачу)' }, { uz: "Darhol 'do'kon yasab ber' deyish", ru: 'Сразу сказать «сделай магазин»' }, { uz: 'Kompyuterni yangilash', ru: 'Обновить компьютер' }, { uz: 'Sahifa rangini tanlash', ru: 'Выбрать цвет страницы' }], correct: 0 },
  { q: { uz: "Mini-do'kon MVP o'zagi nimadan iborat?", ru: 'Из чего состоит ядро MVP мини-магазина?' }, opts: [{ uz: 'Login va parol tizimi', ru: 'Система логина и пароля' }, { uz: "Sun'iy intellekt chat-boti", ru: 'Чат-бот с искусственным интеллектом' }, { uz: 'Reklama bannerlari va aksiyalar', ru: 'Рекламные баннеры и акции' }, { uz: "Mahsulotlar ro'yxati va narx", ru: 'Список товаров и цены' }], correct: 3 },
  { q: { uz: "Do'kon qurishni qaysi qadamdan boshlaymiz?", ru: 'С какого шага начинаем строить магазин?' }, opts: [{ uz: "Savatga qo'shish tugmasidan", ru: 'С кнопки «в корзину»' }, { uz: 'Qidiruv oynasidan', ru: 'С окна поиска' }, { uz: "Mahsulotlar ro'yxatidan", ru: 'Со списка товаров' }, { uz: "To'lov va bank kartasidan", ru: 'С оплаты и банковской карты' }], correct: 2 },
  { q: { uz: "Qaysi biri MVP uchun SHART emas (keyin qo'shiladi)?", ru: 'Что НЕ обязательно для MVP (добавляется потом)?' }, opts: [{ uz: "Mahsulotlar ro'yxati", ru: 'Список товаров' }, { uz: 'Har biriga narx', ru: 'Цена у каждого' }, { uz: 'Qidiruv va login', ru: 'Поиск и логин' }, { uz: 'Mahsulot nomi va rasmi', ru: 'Название и фото товара' }], correct: 2 },
  { q: { uz: "Dasturchi loyihada kim rolini o'ynaydi?", ru: 'Какую роль в проекте играет разработчик?' }, opts: [{ uz: 'Arxitektor (rejani tuzadi)', ru: 'Архитектор (составляет план)' }, { uz: 'Faqat chetdan kuzatuvchi', ru: 'Просто наблюдатель со стороны' }, { uz: "AI o'rniga qo'l bilan quruvchi", ru: 'Строит всё руками вместо AI' }, { uz: "Hech qanday rol o'ynamaydi", ru: 'Не играет никакой роли' }], correct: 0 },
  { q: { uz: 'Aniq buyruq nega muhim?', ru: 'Почему важна точная команда?' }, opts: [{ uz: "Chiroyliroq ko'rinadi", ru: 'Выглядит красивее' }, { uz: 'Aniq buyruq → aniq natija', ru: 'Точная команда → точный результат' }, { uz: "Tezroq yozib bo'ladi", ru: 'Быстрее печатать' }, { uz: "AI'ni ortiqcha charchatmaydi", ru: 'Не утомляет AI лишний раз' }], correct: 1 },
  { q: { uz: 'Qaysi buyruq eng aniq?', ru: 'Какая команда самая точная?' }, opts: [{ uz: "Menga bir ro'yxat qilib ber", ru: 'Сделай мне какой-нибудь список' }, { uz: 'Biror yaxshi narsa qilib ber', ru: 'Сделай что-нибудь хорошее' }, { uz: "Maktab do'koni uchun 4 mahsulotli ro'yxat", ru: 'Список из 4 товаров для школьного магазина' }, { uz: 'Chiroyliroq qilib yasab ber', ru: 'Сделай покрасивее' }], correct: 2 },
  { q: { uz: "To'g'ri qurilish tartibi qaysi?", ru: 'Какой порядок стройки верный?' }, opts: [{ uz: "Ko'rinish → narx → ro'yxat", ru: 'Вид → цены → список' }, { uz: "Bezak → ro'yxat → narx", ru: 'Украшение → список → цены' }, { uz: "Narx → ro'yxat → login", ru: 'Цены → список → логин' }, { uz: "Ro'yxat → narx → ko'rinish", ru: 'Список → цены → вид' }], correct: 3 },
  { q: { uz: 'Agent quryotganidan oldin nima qiladi?', ru: 'Что делает агент, прежде чем строить?' }, opts: [{ uz: 'Darhol qurishga kirishadi', ru: 'Сразу начинает строить' }, { uz: "Rejasini ko'rsatib, tasdiq so'raydi", ru: 'Показывает план и просит подтверждения' }, { uz: "Kompyuterni o'chirib qo'yadi", ru: 'Выключает компьютер' }, { uz: "Qanday rang kerakligini so'raydi", ru: 'Спрашивает, какой нужен цвет' }], correct: 1 },
  { q: { uz: 'Mashhur ilovalar qanday boshlangan?', ru: 'Как начинались известные приложения?' }, opts: [{ uz: 'Barcha funksiyalar bilan birdan', ru: 'Сразу со всеми функциями' }, { uz: 'Login sahifasidan boshlab', ru: 'Со страницы логина' }, { uz: "Faqat reklama e'loni bilan", ru: 'Только с рекламного объявления' }, { uz: "Oddiy MVP'dan, keyin o'stirilgan", ru: 'С простого MVP, потом росли' }], correct: 3 },
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
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закрыть, ученики останутся ждать в арене.\nПотом можно вернуться сюда же через «⚔️ Продолжить».\n\nВсё равно закрыть?' }))) return;
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
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме тренировки' })}</button>
        </div>
      )}

      {/* ===== LOBBY ===== */}
      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Серия верных ответов даёт бонус 🔥!' })}</p>
          {solo && isStudent && <p className="qz-sub" style={{ color: '#FFC94D' }}>{tr({ uz: "📖 Mashq rejimi — o'z tezligingizda ishlaysiz, natija faqat sizga ko'rinadi.", ru: '📖 Режим тренировки — работаете в своём темпе, результат виден только Вам.' })}</p>}
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
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'лучшая серия' })} 🔥x${soloScore.maxStreak}` : ''}</p>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест ещё раз — тренировка (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

export default function PracticeLesson3({ lang: langProp, onFinished }) {
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
  // 🃏 Flashcard jonli darsda FAQAT MENTORGA ko'rinadi; jonli o'quvchidan yashirin — sakrab o'tiladi.
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
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat SCORED test / challenge-gate)
  };
  const reset = () => { progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  // F-0730-01: har o'zgarishda progress saqlanadi (screen + javoblar + nishonlar + boshlangan vaqt)
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned]);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  // 🏅 Yakuniy ekranga yetganda: bitiruvchi nishoni
  useEffect(() => { if (screen === TOTAL_SCREENS - 1) earn('graduate'); }, [screen]); // eslint-disable-line

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

        /* === NATIJA REVEAL + "QURYAPTI" SKELETON === */
        @keyframes result-reveal { from { opacity: 0; transform: translateY(9px) scale(0.97); } to { opacity: 1; transform: none; } }
        .result-reveal { animation: result-reveal 0.42s cubic-bezier(.34,1.18,.5,1); }
        @keyframes bs-shimmer { 0% { background-position: 180% 0; } 100% { background-position: -180% 0; } }
        .build-skel { display: flex; flex-direction: column; gap: 11px; padding: 10px 2px; }
        .build-skel .bs-bar { height: 13px; border-radius: 7px; background: linear-gradient(90deg, #ECEAE4 25%, #FAF8F3 50%, #ECEAE4 75%); background-size: 200% 100%; animation: bs-shimmer 1.15s ease-in-out infinite; }
        .build-skel .bs-lg { height: 34px; border-radius: 10px; }
        .build-note { text-align: center; font-size: 11.5px; color: ${T.ink3}; margin: 6px 0 0; font-family: 'JetBrains Mono'; letter-spacing: 0.04em; }

        /* === KATTA VAZIFA (qora karta, bo'linish) + KICHIK QADAM KARTALARI === */
        @keyframes piece-pop { 0% { opacity: 0; transform: translateY(-7px) scale(0.9); } 60% { transform: scale(1.025); } 100% { opacity: 1; transform: none; } }
        @keyframes split-pulse { 0% { box-shadow: 0 14px 34px -14px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.07); } 50% { box-shadow: 0 14px 34px -14px rgba(255,79,40,0.5), inset 0 0 0 1px rgba(255,79,40,0.4); } 100% { box-shadow: 0 14px 34px -14px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.07); } }
        .big-task { border-radius: 16px; text-align: center; padding: clamp(24px,4vw,32px) 18px; background: radial-gradient(130% 150% at 50% -10%, #262A33 0%, #15171D 60%, #0B0C10 100%); box-shadow: 0 14px 34px -14px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.07); transition: transform 0.3s ease; }
        .big-task.is-split { transform: scale(0.97); animation: split-pulse 1.4s ease-in-out; }
        .big-task-title { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(22px,4vw,30px); margin: 0; color: #F4F1EA; }
        .big-task-sub { font-family: 'Manrope', sans-serif; font-size: clamp(12px,1.6vw,13.5px); margin: 7px 0 0; color: rgba(255,255,255,0.62); }
        .big-task.is-split .big-task-sub { color: #FFC56B; font-weight: 600; }
        .piece-card { display: flex; align-items: center; gap: 11px; background: ${T.paper}; border-radius: 11px; padding: 11px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); opacity: 0; animation: piece-pop 0.42s cubic-bezier(.34,1.4,.5,1) forwards; }
        .piece-num { width: 26px; height: 26px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono'; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .piece-label { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13.5px,1.8vw,15px); color: ${T.ink}; }

        /* === YO'L-XARITA (journey) === */
        .journey { display: flex; align-items: stretch; gap: 6px; flex-wrap: wrap; }
        .jn { flex: 1; min-width: 130px; display: flex; align-items: center; gap: 9px; background: ${T.paper}; border-radius: 12px; padding: 10px 12px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .jn-dot { width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 800; font-size: 12px; color: #fff; flex-shrink: 0; }
        .jn-txt { display: flex; flex-direction: column; min-width: 0; }
        .jn-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .jn-tag { font-family: 'Manrope', sans-serif; font-size: 11px; color: ${T.ink3}; }
        .jn-done { box-shadow: inset 0 0 0 1.5px ${T.success}, 0 6px 16px -6px rgba(31,122,77,0.25); }
        .jn-done .jn-dot { background: ${T.success}; }
        .jn-cur { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.28); }
        .jn-cur .jn-dot { background: ${T.accent}; }
        .jn-next .jn-dot { background: ${T.ink3}; }
        .jn-line { align-self: center; width: 14px; height: 2px; background: ${T.ink3}; opacity: 0.4; flex-shrink: 0; border-radius: 2px; }
        @media (max-width: 640px) { .jn-line { display: none; } .jn { min-width: 100%; } }

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
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); display: flex; align-items: center; justify-content: center; }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        /* === Jonli panel (LiveBadge) — xira turadi, ustiga borilganda tiniqlashadi (kontentni to'smaydi) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

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

        /* === PROMPT-QURUVCHI === */
        .chiprow { display: flex; flex-wrap: wrap; gap: 8px; }
        .promptbox { background: ${T.paper}; border-radius: 12px; padding: 12px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-size: clamp(13px,1.6vw,14.5px); line-height: 2; color: ${T.ink}; }
        .pb-slot { display: inline-flex; align-items: center; background: ${T.accentSoft}; color: ${T.accent}; font-weight: 700; border-radius: 6px; padding: 2px 8px; margin: 0 1px; }
        .pb-ph { display: inline-flex; align-items: center; border: 1.5px dashed ${T.ink3}; color: ${T.ink3}; border-radius: 6px; padding: 1px 8px; margin: 0 1px; font-style: italic; }

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
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.12); overflow: hidden; }
        .gloss-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 17px; cursor: pointer; } .gloss-head .lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; } .gloss-toggle { font-size: 18px; color: ${T.ink2}; }
        .gloss-body { padding: 0 17px 15px; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; line-height: 1.7; animation: fade-step 0.3s; } .gloss-body b { color: ${T.ink}; }

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

        /* === ⚔️ ARENA — to'liq ekran, tiniq qorong'u muhit === */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px);
          background:
            radial-gradient(120% 85% at 50% -18%, rgba(88,58,200,0.55) 0%, rgba(88,58,200,0) 55%),
            radial-gradient(70% 60% at 108% 112%, rgba(196,37,126,0.30) 0%, rgba(196,37,126,0) 60%),
            radial-gradient(55% 45% at -8% 108%, rgba(19,104,206,0.28) 0%, rgba(19,104,206,0) 60%),
            linear-gradient(168deg, #241560 0%, #170F3D 52%, #0D0826 100%);
        }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; }
        @keyframes qz-drift { 0%,100% { transform: translate(0,0) rotate(-7deg) scale(1); } 50% { transform: translate(22px,-28px) rotate(9deg) scale(1.07); } }
        @media (prefers-reduced-motion: reduce) { .qz-shp { animation: none; } }
        .qz-x { position: fixed; top: 14px; right: 16px; z-index: 10600; width: 38px; height: 38px; border-radius: 50%; border: none; background: rgba(255,255,255,0.12); color: #fff; font-size: 16px; cursor: pointer; transition: background 0.2s; }
        .qz-x:hover { background: rgba(255,255,255,0.25); }
        .qz-view { position: relative; z-index: 1; width: 100%; max-width: 780px; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,2.4vw,22px); margin: auto; }
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
        .qz-mypl b { color: #FFC94D; }
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

        /* === 🔡 KOD CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }

        /* === 🔀 DRAG&DROP ORDER (reusable) === */
        .dd { display: flex; flex-direction: column; gap: 13px; }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 56px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; transition: border-color .18s, background .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; }
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; }
        .dd-slot.bad { border-color: #E24848; background: #FBE9E9; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        .dd-slotn { width: 26px; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; }
        .dd-hint { color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${T.bg}; }
        .dd-pool-empty { color: ${T.ink3}; font-size: 12.5px; font-style: italic; align-self: center; }
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip:hover { transform: translateY(-2px); }
        .dd-chip:active { cursor: grabbing; }
        .dd-slots, .dd-pool { position: relative; }
        .dd-pool { z-index: 1; }
        .dd-done { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .dd-wrong { font-weight: 700; color: #E24848; font-size: 13.5px; }

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

        /* === ⚡ CODE STRIKE — neon-kapsula (arenaga portal) === */
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px;
          background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%);
          border: 1.5px solid rgba(186,140,255,0.72);
          box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32);
          animation: cs-ignite 1.5s ease-out both, cs-breathe 3.8s ease-in-out 1.5s infinite; }
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
        .cs-ring { position: absolute; inset: 0; border-radius: inherit; padding: 2.5px; pointer-events: none; z-index: 4;
          background: conic-gradient(from var(--csa), transparent 0 80%, rgba(201,166,255,0) 80%, rgba(201,166,255,.9) 91%, #FFFFFF 96%, transparent 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;
          animation: cs-current 3.4s linear infinite; }
        @keyframes cs-current { to { --csa: 360deg; } }
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
        .cs-row { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: clamp(14px,2.6vw,30px); }
        .csn-boltwrap { position: relative; display: inline-flex; flex: none; }
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
        .cs-hud { position: relative; z-index: 2; display: flex; gap: clamp(7px,1.1vw,11px); align-items: center; justify-content: center; flex-wrap: wrap;
          font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
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
        .qz-brand { display: flex; align-items: center; gap: 12px; }
        .qz-brand.sm { gap: 9px; }
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(255,79,40,0.32)); }
        .qz-wm { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,5vw,46px); letter-spacing: -0.03em; color: #F2ECFF; line-height: 1; text-shadow: 0 0 22px rgba(150,95,255,0.4); }
        .qz-wm-h { color: #FF6A3D; }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
          <div className="lesson-root">
            {live.mode === 'choosing' ? (
              <LiveGate live={live} title={tr({ uz: 'Praktika', ru: 'Практика' })} />
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
