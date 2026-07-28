import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';

// ============================================================
// HTML 1-DARS — PLATFORM STANDARD v15 (Notion: design_system + platform_contract + infrastructure_v1)
// Arxitektura va asosiy dizayn — Notiondan. 17 ekran bizning kontentimiz.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// Eslatma: ekran-spetsifik widget bezaklari page-by-page bosqichida yakuniy sayqal oladi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E1F3FA', link: '#1a56db',
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
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun

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
      <button onClick={() => { setRole('student'); setMentorCode(''); }} style={link}>← {tr({ uz: 'Orqaga', ru: 'Назад' })}</button>
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
  // Katta PIN AUTO-OCHILMAYDI — faqat «📺 Ko'rsatish» tugmasi ochadi (onboarding turi bilan to'qnashmasin).
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
    if (!live.connected) return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot('#FFD380')} /> 🔄 {tr({ uz: 'Qayta ulanmoqda…', ru: 'Переподключаемся…' })}</div>;
    return <div data-tour="live" className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 👨‍🏫 {tr({ uz: 'Mentor:', ru: 'Ментор:' })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

const LangContext = createContext('uz');
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback((node) => {
    if (node === null || node === undefined) return '';
    if (typeof node === 'string') return node;
    if (React.isValidElement(node)) return node;
    if (node[lang] !== undefined) return node[lang];
    return node.uz ?? node.ru ?? '';
  }, [lang]);
};
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

const LESSON_META = { lessonId: 'git-github-01-v18', lessonTitle: { uz: 'Git va GitHub — kod uchun vaqt mashinasi', ru: 'Git и GitHub — машина времени для кода' } };
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
  { id: 's14b', type: 'challenge',  template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's15b', type: 'stats',      template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcard', template: 'custom',  scored: false, scope: null },
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

const CodeBox = ({ children }) => <pre className="code-box">{children}</pre>;
const Tg = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const Sr = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Preview = ({ children, title = 'preview.html', minH }) => (
  <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">{title}</span></div><div className="bp-body" style={{ minHeight: minH }}>{children}</div></div>
);
const Split = ({ children }) => <div className="split">{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

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
      <button data-tour="ach" className={`ach-counter ${bump ? 'bump' : ''} ${count > 0 ? 'has' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Badges" title="Badges">
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
          <div data-tour="progress" className="progress-track"><div className="progress-bar" style={{ width: `${((screen + 1) / totalScreens) * 100}%` }} /></div>
          <div className="chrome">
            <div className="chrome-left eyebrow"><span className="dot" /><span>{eyebrow}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* AUDIOSIZ: ovoz tugmasi (AudioIndicator) ko'rsatilmaydi — ovoz allaqachon o'chirilgan */}
              <AchCounter />
              <div className="mono small" style={{ color: T.ink3 }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
            </div>
          </div>
        </div>
        <div ref={contentRef} onClick={onContentClick} className={`stage-content ${narrow ? 'narrow' : ''}`} style={{ paddingLeft: padH, paddingRight: padH }}>{children}</div>
        {navContent && <div className="stage-nav" style={{ paddingLeft: padH, paddingRight: padH }}>{navContent}</div>}
      </div>
    </MentorCtx.Provider>
  );
};
const NavBack = ({ onPrev }) => <button className="btn-ghost" onClick={onPrev} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Orqaga', ru: 'Назад' })}</button>;
const NavNext = ({ disabled, label = null, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  const lbl = label != null ? tr(label) : tr({ uz: 'Davom etish', ru: 'Продолжить' });
  return <button data-tour="next" className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
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
// RECAPS — har scored test uchun «Qayta tushuntirish» kartalari (kalit = ekran indeksi, Q_LABELS bilan bir xil)
const RECAPS = {
  // idx 4 — s4: «Git asosan nima qiladi?» (nazariya: Git = checkpoint / versiya nazorati)
  4: {
    title: { uz: 'Git — kod uchun vaqt mashinasi', ru: 'Git — машина времени для кода' }, cards: [
      { ic: '🎮', h: { uz: 'Git — kod uchun checkpoint', ru: 'Git — чекпоинт для кода' },
        body: { uz: <>Kompyuter o'yinida qiyin joyga yetganda <b>checkpoint</b> (saqlash nuqtasi) qo'yasiz. O'lib qolsangiz — boshidan emas, o'sha nuqtadan davom etasiz. <b>Git</b> kodingiz uchun aynan shunday ishlaydi.</>, ru: <>В компьютерной игре перед сложным местом вы ставите <b>checkpoint</b> (точку сохранения). Проиграете — продолжите не с начала, а с этой точки. <b>Git</b> работает с вашим кодом точно так же.</> },
        vis: <RcFlow items={[{ uz: "🎮 O'yin", ru: '🎮 Игра' }, { uz: '🚩 Checkpoint', ru: '🚩 Чекпоинт' }, { uz: '↩️ Qaytish', ru: '↩️ Возврат' }]} />,
        ask: { uz: "Qaysi o'yinlarda checkpoint bo'ladi?", ru: 'В каких играх бывают чекпоинты?' } },
      { ic: '🕐', h: { uz: 'Har holatni eslab qoladi', ru: 'Запоминает каждое состояние' },
        body: { uz: <>Git — <b>versiya nazorati</b> tizimi: u kodning <b>har bir holatini</b> eslab qoladi. Xato qilsangiz, eski holatga bemalol qaytasiz — hech narsa yo'qolmaydi.</>, ru: <>Git — система <b>контроля версий</b>: она запоминает <b>каждое состояние</b> кода. Ошибётесь — спокойно вернётесь к старой версии, ничего не потеряется.</> },
        vis: <RcFlow items={[{ uz: "Kod o'zgardi", ru: 'Код изменился' }, { uz: 'Git eslab qoldi', ru: 'Git запомнил' }, { uz: 'Orqaga qaytish', ru: 'Возврат назад' }]} /> },
      { ic: '☝️', h: { uz: 'Git nima QILMAYDI', ru: 'Чего Git НЕ делает' },
        body: { uz: <>Git kodni <b>ranglamaydi</b> (bu — CSS ishi), internetni tezlashtirmaydi va rasm tahrirlamaydi. Uning bitta vazifasi bor: kod <b>versiyalarini saqlash</b> va orqaga qaytarish.</>, ru: <>Git не <b>раскрашивает</b> код (это работа CSS), не ускоряет интернет и не редактирует картинки. У него одна задача: <b>сохранять версии</b> кода и возвращать их назад.</> },
        vis: <RcFlow items={[{ uz: 'Versiyani saqlaydi', ru: 'Сохраняет версии' }, { uz: 'Orqaga qaytaradi', ru: 'Возвращает назад' }]} sep="·" />,
        ask: { uz: "Git kodni saqlaydi — yana nima qiladi?", ru: 'Git сохраняет код — а что ещё он делает?' } },
    ]
  },
  // idx 6 — s5b: «commit nima deb ataladi?» (nazariya: commit = surat, add → commit)
  6: {
    title: { uz: 'commit — kodning surati', ru: 'commit — снимок кода' }, cards: [
      { ic: '📸', h: { uz: 'commit — kodning surati', ru: 'commit — снимок кода' },
        body: { uz: <>Har bir saqlash — <b className="mono">commit</b>. Bu kodingizning o'sha lahzadagi <b>surati</b> (xuddi fotosurat), qisqa <b>izoh</b> bilan: nima o'zgardi.</>, ru: <>Каждое сохранение — <b className="mono">commit</b> (коммит). Это <b>снимок</b> вашего кода в тот момент (как фотография) с коротким <b>комментарием</b>: что изменилось.</> },
        vis: <RcFlow items={[{ uz: 'Kod', ru: 'Код' }, '📸 commit', { uz: 'Izoh', ru: 'Комментарий' }]} /> },
      { ic: '🛒', h: { uz: 'Avval add, keyin commit', ru: 'Сначала add, потом commit' },
        body: { uz: <>commit ikki qadamda bo'ladi: <b className="mono">git add</b> — qaysi fayllarni saqlashni tanlaysiz (xuddi savatga solganday), keyin <b className="mono">git commit</b> — ularni izoh bilan saqlaysiz.</>, ru: <>Коммит делается в два шага: <b className="mono">git add</b> — выбираете, какие файлы сохранить (как будто кладёте в корзину), затем <b className="mono">git commit</b> — сохраняете их с комментарием.</> },
        vis: <RcFlow items={['git add', 'git commit']} /> },
      { ic: '🕐', h: { uz: 'Har commit — alohida nuqta', ru: 'Каждый коммит — отдельная точка' },
        body: { uz: <>Har commit'ning <b>izohi</b>, <b>vaqti</b> va maxsus raqami (<b className="mono">hash</b>) bo'ladi. Shu tufayli istalgan eski commit'ni topib, o'sha holatga qaytishingiz mumkin.</>, ru: <>У каждого коммита есть <b>комментарий</b>, <b>время</b> и специальный номер (<b className="mono">hash</b>). Поэтому можно найти любой старый коммит и вернуться к тому состоянию.</> },
        ask: { uz: "commit izohiga nima yozgan bo'lardingiz?", ru: 'Что бы вы написали в комментарии коммита?' } },
    ]
  },
  // idx 10 — s9: «git push nima qiladi?» (nazariya: tarix, GitHub bulut, push/pull)
  10: {
    title: { uz: 'push — bulutga yuborish', ru: 'push — отправка в облако' }, cards: [
      { ic: '💻', h: { uz: 'Kod ikki joyda yashaydi', ru: 'Код живёт в двух местах' },
        body: { uz: <>Kodingiz ikki joyda turadi: <b>kompyuteringizda</b> (lokal) va <b>bulutda</b> (GitHub). Maqsad — ikkalasini bir xil holatda tutish.</>, ru: <>Ваш код находится в двух местах: <b>на компьютере</b> (локально) и <b>в облаке</b> (GitHub). Цель — держать оба в одинаковом состоянии.</> },
        vis: <RcFlow items={[{ uz: '💻 Lokal', ru: '💻 Локально' }, '☁️ GitHub']} sep="·" /> },
      { ic: '⬆️', h: { uz: 'push — sizdan bulutga', ru: 'push — от вас в облако' },
        body: { uz: <><b className="mono">git push</b> — kompyuteringizdagi yangi <b>commit'larni</b> GitHub'ga (bulutga) yuboradi. Endi kod bulutda ham xavfsiz turadi.</>, ru: <><b className="mono">git push</b> — отправляет новые <b>коммиты</b> с вашего компьютера на GitHub (в облако). Теперь код в безопасности и в облаке.</> },
        vis: <RcFlow items={['💻 commit', '⬆️ push', '☁️ GitHub']} /> },
      { ic: '⬇️', h: { uz: 'pull — bulutdan sizga', ru: 'pull — из облака к вам' },
        body: { uz: <><b className="mono">git pull</b> — buning teskarisi: bulutdagi yangi commit'larni <b>kompyuteringizga</b> oladi. Do'stingiz o'zgarish qo'shsa, pull bilan olasiz.</>, ru: <><b className="mono">git pull</b> — наоборот: забирает новые коммиты из облака <b>на ваш компьютер</b>. Если друг добавил изменения, вы получите их через pull.</> },
        vis: <RcFlow items={['☁️ GitHub', '⬇️ pull', { uz: '💻 Lokal', ru: '💻 Локально' }]} />,
        ask: { uz: "push va pull — qaysi biri bulutga yuboradi?", ru: 'push и pull — какая из них отправляет в облако?' } },
    ]
  },
  // idx 13 — s12: «GitHub nima uchun kerak?» (nazariya: GitHub bulut, repo, jamoa)
  13: {
    title: { uz: 'GitHub — bulutdagi uy', ru: 'GitHub — дом в облаке' }, cards: [
      { ic: '☁️', h: { uz: "GitHub — kodning bulutdagi uyi", ru: 'GitHub — облачный дом кода' },
        body: { uz: <>Git kompyuteringizda ishlaydi. Kompyuter buzilsa-chi? <b>GitHub</b> — kodning <b>bulutdagi nusxasi</b>: internetda xavfsiz saqlanadi va istalgan joydan ochiladi.</>, ru: <>Git работает на вашем компьютере. А если компьютер сломается? <b>GitHub</b> — это <b>облачная копия</b> кода: она надёжно хранится в интернете и открывается откуда угодно.</> },
        vis: <RcFlow items={['💻 Git', '☁️ GitHub']} sep="·" /> },
      { ic: '👥', h: { uz: 'Birga ishlash uchun', ru: 'Для совместной работы' },
        body: { uz: <>GitHub'ning eng kuchli tomoni — <b>jamoa bilan ishlash</b>. Boshqaning loyihasini <b className="mono">clone</b> qilib nusxalaysiz, o'zgartirasiz va push qilasiz. Millionlab dasturchi shunday birga ishlaydi.</>, ru: <>Самая сильная сторона GitHub — <b>работа в команде</b>. Чужой проект вы копируете командой <b className="mono">clone</b>, меняете и делаете push. Так вместе работают миллионы программистов.</> },
        vis: <RcFlow items={['clone', { uz: "o'zgartir", ru: 'измени' }, 'push']} /> },
      { ic: '📦', h: { uz: 'Repo — bitta loyiha uyi', ru: 'Репо — дом одного проекта' },
        body: { uz: <><b>Repository</b> (qisqacha <b>repo</b>) — Git kuzatadigan loyiha papkasi. Ichida barcha fayllar, commit tarixi va <b className="mono">README</b> (loyiha tavsifi) — hammasi birga turadi.</>, ru: <><b>Repository</b> (коротко <b>репо</b>) — папка проекта, за которой следит Git. Внутри все файлы, история коммитов и <b className="mono">README</b> (описание проекта) — всё в одном месте.</> },
        ask: { uz: "Birinchi rep'ingiz nima haqida bo'lardi?", ru: 'О чём был бы ваш первый репозиторий?' } },
    ]
  },
  // idx 17 — s15 (yozma, yakuniy): «commit buyrug'ini o'zingiz yozing» (nazariya: to'liq aylana + commit shakli)
  17: {
    title: { uz: "To'liq aylana va commit buyrug'i", ru: 'Полный цикл и команда commit' }, cards: [
      { ic: '🔄', h: { uz: 'Git ish-oqimi — bitta aylana', ru: 'Рабочий цикл Git — один круг' },
        body: { uz: <>Har o'zgarishdan keyin bir xil aylana takrorlanadi: <b className="mono">add</b> (tanlash) → <b className="mono">commit</b> (surat qilish) → <b className="mono">push</b> (bulutga yuborish). Tartib muhim!</>, ru: <>После каждого изменения повторяется один и тот же цикл: <b className="mono">add</b> (выбрать) → <b className="mono">commit</b> (сделать снимок) → <b className="mono">push</b> (отправить в облако). Порядок важен!</> },
        vis: <RcFlow items={['add', 'commit', 'push']} /> },
      { ic: '⌨️', h: { uz: "commit buyrug'i — uch qism", ru: 'Команда commit — три части' },
        body: { uz: <>To'liq buyruq: <b className="mono">git commit</b> (buyruq) + <b className="mono">-m</b> (izoh bayrog'i) + <b>qo'shtirnoq</b> ichida izoh. Masalan: <b className="mono">git commit -m "birinchi commit"</b>.</>, ru: <>Полная команда: <b className="mono">git commit</b> (команда) + <b className="mono">-m</b> (флаг комментария) + комментарий в <b>кавычках</b>. Например: <b className="mono">git commit -m "birinchi commit"</b>.</> },
        vis: <RcFlow items={['git commit', '-m', { uz: '"izoh"', ru: '"комментарий"' }]} /> },
      { ic: '⚠️', h: { uz: "commit'siz push ishlamaydi", ru: 'push без коммита не работает' },
        body: { uz: <>Faqat <b className="mono">add</b> qilib, to'g'ridan push qilsangiz — xato chiqadi. <b>Saqlanmagan</b> narsani yuborib bo'lmaydi. Avval <b className="mono">commit</b> bilan surat oling, keyin push.</>, ru: <>Если сделать только <b className="mono">add</b> и сразу push — будет ошибка. <b>Несохранённое</b> отправить нельзя. Сначала сделайте снимок командой <b className="mono">commit</b>, потом push.</> },
        ask: { uz: "add'dan keyin, push'dan oldin qaysi qadam kerak?", ru: 'Какой шаг нужен после add и перед push?' } },
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
        <span className="mstats-lbl">✍️ {tr(taskLabel)}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma tugatdi!', ru: '✓ Все закончили!' }) : <>{tr({ uz: 'Tugatdi:', ru: 'Закончили:' })} <b>{doneN}</b> / {total}</>}</span>
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((doneN / total) * 100) : 0}%` }} /></div>
      {total > 0 && (
        <div className="mstats-waitrow">
          {data.players.map(p => <span key={p.id} className="mstats-wait-chip" style={doneIds.has(p.id) ? { background: T.successSoft, color: T.success, fontWeight: 700 } : undefined}>{doneIds.has(p.id) ? '✓ ' : '✏️ '}{p.nickname}</span>)}
        </div>
      )}
      {doneN === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar yozib tugatishi bilan shu yerda ✓ belgisi chiqadi…", ru: 'Как только ученики допишут, здесь появится значок ✓…' })}</p>}
    </div>
  );
}

// `...` bilan belgilangan kod atamalarini (buyruq, teg) matndan ajratib chip qilib ko'rsatadi.
// Savol, variant va izoh satrlarida ishlatiladi: "`git add` fayllarni tanlaydi" → git add chipda.
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

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
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';
const Mentor = ({ children }) => {
  const ctx = useContext(MentorCtx) || {};
  const enabled = !!ctx.enabled;
  const collapsed = enabled && ctx.collapsed;
  const expand = (e) => { e.stopPropagation(); if (ctx.setCollapsed) ctx.setCollapsed(false); };
  return (
    <div data-tour="mentor" className={`mentor fade-up ${enabled ? 'mentor-mob' : ''} ${collapsed ? 'is-collapsed' : ''}`} onClick={collapsed ? expand : undefined} role={collapsed ? 'button' : undefined}>
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
  const audio = useAudio([{ id: 's0', text: `Loyiha ustida ishlayapsiz. Bir narsani o'zgartirib — saqlaysiz. Yana o'zgartirib — yana saqlaysiz. Tez orada papkangiz to'la bo'ladi: loyiha, loyiha2, loyiha_final, loyiha_oxirgi_ROST... Endi xato qildingiz, lekin uchinchi versiya yaxshiroq edi. Qaysi biriga qaytasiz? Buning aqlli yo'li bormi?`, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const FILES = [{ uz: 'loyiha.html', ru: 'proekt.html' }, { uz: 'loyiha2.html', ru: 'proekt2.html' }, { uz: 'loyiha_final.html', ru: 'proekt_final.html' }, { uz: 'loyiha_final_ROST.html', ru: 'proekt_final_TOCHNO.html' }, { uz: 'loyiha_oxirgi(1).html', ru: 'proekt_posledniy(1).html' }];
  const [saved, setSaved] = useState(storedAnswer ? FILES.length : 1);
  const OPTS = [
    { id: 'a', label: { uz: "Yo'q — har safar yangi nom bilan saqlayverish kerak", ru: 'Нет — каждый раз нужно сохранять под новым именем' } },
    { id: 'b', label: { uz: 'Ha — maxsus dastur har bir versiyani eslab qoladi', ru: 'Да — специальная программа запоминает каждую версию' } },
    { id: 'c', label: { uz: "Eski faylni o'chirib, qaytadan yozish kerak", ru: 'Нужно удалить старый файл и написать заново' } }
  ];
  const save = () => setSaved(s => Math.min(s + 1, FILES.length));
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); audio.triggerEvent('option_picked'); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 760 }}>{tr({ uz: <>Xato qildingiz — kodni <span className="italic" style={{ color: T.accent }}>orqaga</span> qaytarib bo'ladimi?</>, ru: <>Вы ошиблись — можно ли <span className="italic" style={{ color: T.accent }}>откатить</span> код назад?</> })}</h1>
        <Mentor>{tr({ uz: <>Bir narsani o'zgartirib <b style={{ color: T.ink }}>saqlaysiz</b>. Yana — yana saqlaysiz. Tez orada papka to'la: <span className="mono">loyiha_final_ROST.html</span>… Endi 3-versiya yaxshiroq edi. Qaysi biriga qaytasiz? Tugmani bosib, tartibsizlikni ko'ring.</>, ru: <>Вы что-то меняете и <b style={{ color: T.ink }}>сохраняете</b>. Ещё раз — и снова сохраняете. Скоро папка забита: <span className="mono">proekt_final_TOCHNO.html</span>… А теперь оказалось, что третья версия была лучше. К какой вернётесь? Нажмите кнопку и посмотрите на этот хаос.</> })}</Mentor>
        <Split>
          <Col>
            <div className="flow-label">{tr({ uz: 'Papkangiz', ru: 'Ваша папка' })}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 150 }}>
              {FILES.slice(0, saved).map((f, i) => (
                <div key={i} className="fade-step" style={{ display: 'flex', alignItems: 'center', gap: 9, background: T.paper, borderRadius: 9, padding: '9px 13px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: T.ink, boxShadow: '0 4px 12px -6px rgba(58,53,48,0.18)' }}>
                  <span>📄</span><span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{tr(f)}</span>
                  {i === saved - 1 && saved > 1 && <span className="mono small" style={{ color: T.accent, flexShrink: 0 }}>{tr({ uz: 'yangi', ru: 'новый' })}</span>}
                </div>
              ))}
            </div>
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={save} disabled={saved >= FILES.length}>{saved >= FILES.length ? tr({ uz: '🤯 Tamom — chalkashlik!', ru: '🤯 Всё — полная путаница!' }) : tr({ uz: '💾 Yana saqlash', ru: '💾 Сохранить ещё раз' })}</button>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: "Buning aqlli yo'li bormi?", ru: 'Есть ли способ умнее?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => { const on = picked === o.id; return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>); })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>To'g'ri yo'nalish! Maxsus dastur — <b>Git</b> — har bir o'zgarishni eslab qoladi va istalgan nuqtaga qaytaradi. Xuddi <b>vaqt mashinasi</b> kabi.</>, ru: <>Верное направление! Специальная программа — <b>Git</b> — запоминает каждое изменение и возвращает к любой точке. Прямо как <b>машина времени</b>.</> })}</p>}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's1', text: `Bugun Git va GitHub bilan tanishamiz — bu dasturchining eng muhim quroli. 5 qadamda kodingizni xavfsiz saqlash, istalgan nuqtaga orqaga qaytish va uni bulutga — GitHub'ga yuborishni o'rganamiz.`, trigger: 'on_mount', waits_for: null }]);
  const STEPS = [
    { text: { uz: 'Git nima?', ru: 'Что такое Git?' }, tag: { uz: 'versiya nazorati', ru: 'контроль версий' } },
    { text: { uz: 'commit — saqlangan nuqta', ru: 'commit — точка сохранения' }, tag: 'snapshot' },
    { text: { uz: 'Tarix — vaqt mashinasi', ru: 'История — машина времени' }, tag: { uz: 'orqaga qaytish', ru: 'возврат назад' } },
    { text: { uz: 'GitHub — bulutdagi uy', ru: 'GitHub — дом в облаке' }, tag: 'github.com' },
    { text: { uz: 'push — bulutga yuborish', ru: 'push — отправка в облако' }, tag: '' }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const JOURNEY = [{ ic: '✏️', l: { uz: "O'zgartirish", ru: 'Изменение' } }, { ic: '💾', l: 'commit' }, { ic: '🕐', l: { uz: 'Tarix', ru: 'История' } }, { ic: '☁️', l: 'GitHub' }, { ic: '👥', l: { uz: 'Jamoa', ru: 'Команда' } }];
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: "Dars oxirida bilasiz — bu yo'lni", ru: 'К концу урока вы будете знать этот путь' })}</p>
      <Zoomable>
      <div className="jmini fade-up delay-1">
        {JOURNEY.map((j, i) => (<React.Fragment key={i}><div className="jmini-node" style={{ animationDelay: `${i * 0.1}s` }}><span className="jmini-ic">{j.ic}</span><span className="jmini-l">{tr(j.l)}</span></div>{i < JOURNEY.length - 1 && <span className="jmini-arr" style={{ animationDelay: `${i * 0.18}s` }}>→</span>}</React.Fragment>))}
      </div>
      </Zoomable>
      <p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>…va kodingiz <b style={{ color: T.ink }}>hech qachon</b> yo'qolmaydi.</>, ru: <>…и ваш код <b style={{ color: T.ink }}>никогда</b> не потеряется.</> })}</p>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: '5 qadam', ru: '5 шагов' })}</p>
      <ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span>{s.tag && <span className="step-tag">{tr(s.tag)}</span>}</span></li>))}</ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kodingiz uchun <span className="italic" style={{ color: T.accent }}>vaqt mashinasi</span> quramiz</>, ru: <>Построим <span className="italic" style={{ color: T.accent }}>машину времени</span> для вашего кода</> })}</h2><p className="body fade-up delay-1" style={{ margin: '6px 0 0', color: T.ink2, maxWidth: 580 }}>{tr({ uz: <><b style={{ color: T.ink }}>«Vaqt mashinasi»</b> — bu istalgan paytda kodning <b style={{ color: T.ink }}>eski holatiga qaytish</b> imkoni. Xato qilsangiz ham, kechagi (yoki bir haftalik) kodga bemalol qaytasiz. Git aynan shuni beradi.</>, ru: <><b style={{ color: T.ink }}>«Машина времени»</b> — это возможность в любой момент <b style={{ color: T.ink }}>вернуть код к старому состоянию</b>. Даже если ошибётесь, спокойно вернётесь к вчерашнему (или недельной давности) коду. Именно это даёт Git.</> })}</p></div>
        <Mentor>{tr({ uz: <>Bugun <b style={{ color: T.ink }}>Git</b> va <b style={{ color: T.ink }}>GitHub</b> bilan tanishamiz — dasturchining eng muhim quroli. <b style={{ color: T.ink }}>5 qadamda</b> kodni saqlash, orqaga qaytish va bulutga yuborishni o'rganamiz.</>, ru: <>Сегодня познакомимся с <b style={{ color: T.ink }}>Git</b> и <b style={{ color: T.ink }}>GitHub</b> — важнейшим инструментом программиста. За <b style={{ color: T.ink }}>5 шагов</b> научимся сохранять код, откатываться назад и отправлять код в облако.</> })}</Mentor>
        {!isNarrow ? (<Split>{PreviewBlock}{StepsBlock}</Split>)
          : !showSteps ? (<div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{PreviewBlock}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>📋 {tr({ uz: "5 qadamni ko'rish", ru: 'Посмотреть 5 шагов' })}</button></div>)
          : (<div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>↩ {tr({ uz: "Yo'lni ko'rish", ru: 'Посмотреть путь' })}</button>{StepsBlock}</div>)}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — MINORA QURUVCHI (checkpoint-o'yin) =====
// Holat-mashina: blocks (balandlik) · cp (checkpoint-balandlik | null) · photos (📸 tarix)
// crash + qutqarish (cp'dan tiklash) = done. Matn — PLACEHOLDER (Metodist moslaydi).
const S2_HASHES = ['a1b2c3d', 'e4f5a6b', 'c7d8e9f', 'b9a8c7d', 'd2c3b4a'];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's2', text: `Git — versiya nazorati tizimi. Minora quruvchini tasavvur qiling: blok ustiga blok qo'yasiz. Ba'zan «Checkpoint» bosib, minoraning suratini olasiz — bu commit. Agar bug chiqib minora qulasa, checkpoint bo'lsa — o'sha suratdan tiklanasiz, boshidan emas! Blok qo'ying, checkpoint qo'ying va bug'ni bosib ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  const [blocks, setBlocks] = useState(storedAnswer ? 3 : 0);
  const [cp, setCp] = useState(storedAnswer ? 3 : null);
  const [photos, setPhotos] = useState(storedAnswer?.photos || []);
  const [anim, setAnim] = useState(null);          // null | 'fall' | 'rewind'
  const [rescued, setRescued] = useState(!!storedAnswer); // kamida bir marta checkpoint-QUTQARISH bo'ldimi
  const [crashed, setCrashed] = useState(false);   // butun minora quladi (checkpointsiz)
  const [celebrate, setCelebrate] = useState(false);
  const done = rescued;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, photos }); }, [done]); // eslint-disable-line
  const putBlock = () => { if (anim) return; setCrashed(false); setBlocks(b => b + 1); };
  const checkpoint = () => {
    if (anim || blocks === 0) return;
    setCp(blocks); setCrashed(false);
    setPhotos(p => [{ n: blocks, hash: S2_HASHES[p.length % S2_HASHES.length] }, ...p]);
  };
  const bug = () => {
    if (anim || blocks === 0) return;
    setAnim('fall'); setCelebrate(false);
    if (cp === null) {
      // Checkpoint yo'q — butun minora qulaydi, boshidan
      setTimeout(() => { setBlocks(0); setCrashed(true); setAnim(null); }, 520);
    } else {
      // Checkpoint bor — cp'dan yuqorisi qulaydi, so'ng cp holatiga tiklanadi
      setTimeout(() => {
        setBlocks(cp); setCrashed(false); setRescued(true); setCelebrate(true);
        setAnim('rewind');
        setTimeout(() => setAnim(null), 520);
        setTimeout(() => setCelebrate(false), 2200);
      }, 520);
    }
  };
  const heights = Array.from({ length: blocks }, (_, i) => i + 1); // 1..blocks
  const twrCls = `twr ${anim === 'fall' ? 'falling' : ''} ${anim === 'rewind' ? 'rewinding' : ''}`;
  return (
    <Stage eyebrow="Git" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Minorangizni qutqaring', ru: 'Спасите свою башню' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Git aslida <span className="italic" style={{ color: T.accent }}>nima</span>?</>, ru: <>Что же такое Git <span className="italic" style={{ color: T.accent }}>на самом деле</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Git — <b style={{ color: T.ink }}>versiya nazorati</b> tizimi. <b style={{ color: T.ink }}>Minora quruvchi</b>ni tasavvur qiling: blok qo'yasiz, ba'zan <b style={{ color: T.ink }}>Checkpoint</b> bosib suratga olasiz (commit). Bug chiqsa — checkpoint bo'lsa o'sha suratdan tiklanasiz, boshidan emas!</>, ru: <>Git — система <b style={{ color: T.ink }}>контроля версий</b>. Представьте <b style={{ color: T.ink }}>строителя башни</b>: вы ставите блоки и иногда нажимаете <b style={{ color: T.ink }}>Checkpoint</b>, делая снимок (коммит). Случится баг — если есть чекпоинт, восстановитесь с этого снимка, а не с нуля!</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <div className="flow-label">{tr({ uz: 'Minora', ru: 'Башня' })}</div>
            <div className="twr-wrap fade-up delay-2">
              <div className={twrCls}>
                {heights.length === 0
                  ? <span className="twr-empty">{crashed ? tr({ uz: '💥 Minora quladi — boshidan', ru: '💥 Башня рухнула — всё сначала' }) : tr({ uz: "Blok qo'ying — minora o'sadi", ru: 'Ставьте блоки — башня растёт' })}</span>
                  : heights.map(h => (
                      // --fi = qulash navbat indeksi (0 = eng tepa, birinchi qulaydi; pastdagilar kattaroq = keyinroq)
                      <div key={h} className={`twr-block ${h === cp ? 'flag' : ''}`} style={{ '--fi': blocks - h }}>
                        {h === cp && <span className="twr-flag">🚩</span>}
                      </div>
                    ))}
              </div>
              <div className="twr-h">{tr({ uz: <><b>{blocks}</b>-qavat</>, ru: <>Этаж <b>{blocks}</b></> })}{cp !== null && <span style={{ color: T.success, fontWeight: 700 }}>{tr({ uz: <> · 🚩 {cp}-qavatda checkpoint</>, ru: <> · 🚩 чекпоинт на этаже {cp}</> })}</span>}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn" onClick={putBlock} disabled={!!anim}>▶ {tr({ uz: "Blok qo'yish", ru: 'Поставить блок' })}</button>
              <button className="btn-soft" onClick={checkpoint} disabled={!!anim || blocks === 0}>💾 Checkpoint (commit)</button>
              <button className="btn-soft" onClick={bug} disabled={!!anim || blocks === 0}>💥 Bug!</button>
            </div>
          </div>
          <div className="col">
            {done ? (
              <div className="frame-success fade-step"><p className="small mono" style={{ margin: '0 0 4px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ {tr({ uz: 'Checkpoint sizni qutqardi', ru: 'Чекпоинт вас спас' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bug minorani qulatdi, lekin faqat <b>saqlanmagan</b> bloklar yo'qoldi — qolgani <b>🚩 checkpoint</b> suratida xavfsiz. Git ham xuddi shunday: har <b>commit</b> — vaqt mashinasidagi qaytish nuqtasi.</>, ru: <>Баг обрушил башню, но пропали только <b>несохранённые</b> блоки — остальное в безопасности на снимке <b>🚩 checkpoint</b>. Git работает так же: каждый <b>commit</b> — точка возврата в машине времени.</> })}</p></div>
            ) : crashed ? (
              <div className="frame-soft fade-step"><p className="small mono" style={{ margin: '0 0 4px', fontWeight: 600, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>💥 {tr({ uz: 'Hech nima saqlanmagan edi', ru: 'Ничего не было сохранено' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Voy! Butun minora quladi va butun mehnatingiz yo'qoldi — hech qayerda surat yo'q edi. Xafa bo'lmang: keyingi safar avval <b>💾 Checkpoint</b> qo'ying, keyin bemalol tajriba qiling.</>, ru: <>Ой! Вся башня рухнула, и весь труд пропал — нигде не было снимка. Не расстраивайтесь: в следующий раз сначала поставьте <b>💾 Checkpoint</b>, а потом смело экспериментируйте.</> })}</p></div>
            ) : (<div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Bir necha blok qo'ying, <b>Checkpoint</b> bosing, keyin <b>Bug!</b>ni bosib ko'ring — minorangizni qutqaring.</>, ru: <>Поставьте несколько блоков, нажмите <b>Checkpoint</b>, затем нажмите <b>Bug!</b> — и спасите свою башню.</> })}</p></div>)}
            <div className="frame-soft"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>Git</b> — kodning har bir holatini surat qilib saqlaydi. Checkpoint = <span className="mono">commit</span>.</>, ru: <><b>Git</b> сохраняет каждое состояние кода как снимок. Checkpoint = <span className="mono">commit</span>.</> })}</p></div>
            {photos.length > 0 && (
              <div className="col" style={{ gap: 8 }}>
                <div className="flow-label">📸 {tr({ uz: 'Suratlar', ru: 'Снимки' })}</div>
                {photos.map((p, i) => (
                  <div key={i} className="gcommit">
                    <span className="gcommit-dot">📸</span>
                    <span className="gcommit-body"><span className="gcommit-msg">{tr({ uz: `${p.n}-qavat saqlandi`, ru: `Сохранён этаж ${p.n}` })}</span><span className="gcommit-meta">commit {p.hash} · {tr({ uz: 'hozir', ru: 'сейчас' })}</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </Zoomable>
      </div>
      {celebrate && <Confetti />}
    </Stage>
  );
};
// ===== SCREEN 3 — COMMIT (snapshot) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's3', text: `Git kodni qanday saqlaydi? Har bir saqlash — commit deyiladi. commit — bu kodingizning o'sha lahzadagi surati, xuddi fotosurat kabi. Unga qisqa izoh yozasiz: nima o'zgardi. Rangni o'zgartirib, surat oling — commit qiling.`, trigger: 'on_mount', waits_for: null }]);
  const COLORS = [{ n: { uz: 'qora', ru: 'чёрный' }, c: '#0E0E10' }, { n: { uz: "ko'k", ru: 'синий' }, c: '#019ACB' }, { n: { uz: 'qizil', ru: 'красный' }, c: '#FF4F28' }, { n: { uz: 'yashil', ru: 'зелёный' }, c: '#1F7A4D' }];
  const HASHES = ['a1b2c3d', 'e4f5a6b', 'c7d8e9f', 'b9a8c7d'];
  const [ci, setCi] = useState(0);
  const [commits, setCommits] = useState(storedAnswer?.commits || []);
  const done = commits.length > 0;
  const change = () => setCi(i => (i + 1) % COLORS.length);
  const commit = () => {
    const col = COLORS[ci];
    const next = [{ n: col.n, hash: HASHES[commits.length % HASHES.length], c: col.c }, ...commits];
    setCommits(next);
    if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, commits: next });
  };
  return (
    <Stage eyebrow="commit" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Surat oling (commit)', ru: 'Сделайте снимок (commit)' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Git o'zgarishni qanday <span className="italic" style={{ color: T.accent }}>eslab qoladi</span>?</>, ru: <>Как Git <span className="italic" style={{ color: T.accent }}>запоминает</span> изменения?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Git'da har bir saqlash — <b style={{ color: T.ink }}>commit</b>. Bu kodingizning o'sha lahzadagi <b style={{ color: T.ink }}>surati</b> 📸, qisqa izoh bilan. Rangni o'zgartirib, surat oling.</>, ru: <>В Git каждое сохранение — <b style={{ color: T.ink }}>commit</b>. Это <b style={{ color: T.ink }}>снимок</b> вашего кода в тот момент 📸, с коротким комментарием. Поменяйте цвет и сделайте снимок.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <div className="flow-label">{tr({ uz: 'Kodingiz', ru: 'Ваш код' })}</div>
            <pre className="code-box fade-up delay-2" style={{ minHeight: 50 }}><Tg>{'<h1 '}</Tg><At>style</At>=<Sr>{`"color:${COLORS[ci].c}"`}</Sr><Tg>{'>'}</Tg>{tr({ uz: 'Salom', ru: 'Привет' })}<Tg>{'</h1>'}</Tg></pre>
            <Preview title="index.html" minH={64}><h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,3vw,28px)', color: COLORS[ci].c, margin: 0 }}>{tr({ uz: 'Salom', ru: 'Привет' })}</h1></Preview>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn-soft" onClick={change}>🎨 {tr({ uz: "Rangini o'zgartirish", ru: 'Поменять цвет' })}</button>
              <button className="btn" onClick={commit}>📸 {tr({ uz: 'commit qilish', ru: 'Сделать commit' })}</button>
            </div>
          </div>
          <div className="col">
            <div className="flow-label">{tr({ uz: 'commit tarixi', ru: 'история коммитов' })}</div>
            {commits.length === 0 ? (
              <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: `Hali surat yo'q — "commit qilish"ni bosing`, ru: 'Пока нет снимков — нажмите «Сделать commit»' })}</p></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {commits.map((c, i) => (
                  <div key={i} className="gcommit">
                    <span className="gcommit-dot">📸</span>
                    <span className="gcommit-body"><span className="gcommit-msg">{tr({ uz: 'Sarlavha rangi:', ru: 'Цвет заголовка:' })} {tr(c.n)}</span><span className="gcommit-meta">commit {c.hash} · {tr({ uz: 'hozir', ru: 'сейчас' })}</span></span>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: c.c, flexShrink: 0, alignSelf: 'center' }} />
                  </div>
                ))}
              </div>
            )}
            {done && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Har commit — alohida surat: <b>izoh</b> + <b>vaqt</b> + maxsus raqam (<span className="mono">hash</span>). Tarix saqlanib qoladi.</>, ru: <>Каждый commit — отдельный снимок: <b>комментарий</b> + <b>время</b> + специальный номер (<span className="mono">hash</span>). История сохраняется.</> })}</p></div>}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST (Git nima qiladi) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    audioText="Git dasturchiga asosan nima beradi — uning asosiy vazifasi nima?"
    questionText="Git asosan nima qiladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Git asosan <span className="italic" style={{ color: T.accent }}>nima</span> qiladi?</>, ru: <>Что Git делает <span className="italic" style={{ color: T.accent }}>в основном</span>?</> })}</h2></>}
    options={[{ uz: 'Versiyalarni saqlab, orqaga qaytaradi', ru: 'Сохраняет версии и возвращает назад' }, { uz: "Kodni chiroyli ranglarga bo'yaydi", ru: 'Красиво раскрашивает код' }, { uz: 'Internet tezligini oshirib beradi', ru: 'Ускоряет интернет' }, { uz: 'Rasm va suratlarni tahrirlab beradi', ru: 'Редактирует фото и картинки' }]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! Git — versiya nazorati: u kodning har bir versiyasini (commit) saqlaydi va istalgan nuqtaga qaytaradi.", ru: 'Верно! Git — контроль версий: он сохраняет каждую версию кода (commit) и возвращает к любой точке.' })}
    explainWrong={{ 1: tr({ uz: 'Ranglash — CSS ishi. Git esa kod versiyalarini saqlaydi.', ru: 'Раскрашивание — работа CSS. А Git сохраняет версии кода.' }), 2: tr({ uz: "Internet tezligi Git bilan bog'liq emas. Git versiyalarni boshqaradi.", ru: 'Скорость интернета с Git не связана. Git управляет версиями.' }), 3: tr({ uz: 'Rasm tahrirlash — Git vazifasi emas. U kod tarixini saqlaydi.', ru: 'Редактирование картинок — не задача Git. Он хранит историю кода.' }), default: tr({ uz: 'Git kod versiyalarini saqlaydi va orqaga qaytaradi.', ru: 'Git сохраняет версии кода и возвращает назад.' }) }} />
);

// ===== SCREEN 5 — COMMIT JARAYONI (add -> commit) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's5', text: `commit ikki qadamda bo'ladi. Avval git add — qaysi fayllarni saqlashni tanlaysiz, xuddi savatga solganday. Keyin git commit — ularni izoh bilan saqlaysiz. Tugmalarni bosib, faylni o'zgartirgandan saqlangangacha bo'lgan yo'lni ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  const [stage, setStage] = useState(storedAnswer ? 2 : 0);
  const done = stage >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const STATUS = [{ ic: '🔴', l: { uz: "o'zgartirildi", ru: 'изменён' }, cls: 'gst-mod' }, { ic: '🟢', l: { uz: 'tayyorlandi (staged)', ru: 'подготовлен (staged)' }, cls: 'gst-staged' }, { ic: '✅', l: { uz: 'saqlandi (committed)', ru: 'сохранён (committed)' }, cls: 'gst-done' }];
  const cur = STATUS[stage];
  const add = () => { if (stage === 0) setStage(1); };
  const commit = () => { if (stage === 1) setStage(2); };
  return (
    <Stage eyebrow={tr({ uz: 'commit jarayoni', ru: 'процесс коммита' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Saqlang (add → commit)', ru: 'Сохраните (add → commit)' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saqlashdan oldin <span className="italic" style={{ color: T.accent }}>nima bo'ladi</span>?</>, ru: <>Что происходит <span className="italic" style={{ color: T.accent }}>перед сохранением</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Avval <span className="mono">git add</span> — qaysi fayllarni saqlashni tanlaysiz (xuddi savatga solganday). Keyin <span className="mono">git commit</span> — ularni <b style={{ color: T.ink }}>izoh bilan</b> saqlaysiz. Tugmalarni bosing.</>, ru: <>Сначала <span className="mono">git add</span> — выбираете, какие файлы сохранить (как будто кладёте в корзину). Затем <span className="mono">git commit</span> — сохраняете их <b style={{ color: T.ink }}>с комментарием</b>. Нажимайте кнопки.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <div className="flow-label">{tr({ uz: 'Fayl holati', ru: 'Состояние файла' })}</div>
            <div className="gfile fade-up delay-2"><span style={{ fontSize: 18 }}>📄</span><span className="gfile-name">index.html</span><span className={`gfile-status ${cur.cls}`}>{cur.ic} {tr(cur.l)}</span></div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn" onClick={add} disabled={stage !== 0}>📥 git add</button>
              <button className="btn" onClick={commit} disabled={stage !== 1}>💾 git commit</button>
            </div>
            <div className="frame-soft"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>add</b> → fayllarni tanlash. <b>commit</b> → izoh bilan saqlash. Ikkisi birga.</>, ru: <><b>add</b> → выбрать файлы. <b>commit</b> → сохранить с комментарием. Работают вместе.</> })}</p></div>
          </div>
          <div className="col">
            <div className="flow-label">{tr({ uz: 'Terminal', ru: 'Терминал' })}</div>
            <div className="term fade-up delay-2">
              <span className="term-row"><span className="term-prompt">$ </span><span className="term-cmd">{stage >= 1 ? 'git add index.html' : '_'}</span></span>
              {stage >= 2 && <span className="term-row"><span className="term-prompt">$ </span><span className="term-cmd">{tr({ uz: `git commit -m "yangi o'zgarish"`, ru: 'git commit -m "новое изменение"' })}</span></span>}
              {stage >= 2 && <span className="term-row"><span className="term-ok">{tr({ uz: `[main a1b2c3d] yangi o'zgarish`, ru: '[main a1b2c3d] новое изменение' })}</span></span>}
              {stage >= 2 && <span className="term-row"><span className="term-out"> {tr({ uz: `1 fayl o'zgardi`, ru: '1 файл изменён' })}</span></span>}
            </div>
            {done && (<div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>add</b> faylni tanladi, <b>commit</b> uni izoh bilan saqladi. Checkpoint tayyor!</>, ru: <><b>add</b> выбрал файл, <b>commit</b> сохранил его с комментарием. Чекпоинт готов!</> })}</p></div>)}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5b — TEST (commit nima) =====
const Screen5b = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv', ru: 'Проверка' })}
    audioText="Kodning bir holatini izoh bilan saqlagan nuqta — bu nima deb ataladi?"
    questionText="Kodning izoh bilan saqlangan nuqtasi nima deb ataladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Mustahkamlash', ru: 'Закрепление' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Kodning izoh bilan saqlangan <span className="italic" style={{ color: T.accent }}>nuqtasi (surati)</span> nima deb ataladi?</>, ru: <>Как называется сохранённая с комментарием <span className="italic" style={{ color: T.accent }}>точка (снимок)</span> кода?</> })}</h2></>}
    options={[{ uz: 'Brauzer', ru: 'Браузер' }, { uz: 'Parol', ru: 'Пароль' }, 'commit', { uz: 'Domen', ru: 'Домен' }]} correctIdx={2}
    explainCorrect={tr({ uz: "To'g'ri! commit — kodning o'sha lahzadagi saqlangan nuqtasi (surati), izoh bilan birga.", ru: 'Верно! commit — сохранённая точка (снимок) кода в тот момент, вместе с комментарием.' })}
    explainWrong={{ 0: tr({ uz: 'Brauzer — saytni ochadigan dastur. Saqlangan nuqta — commit.', ru: 'Браузер — программа, открывающая сайты. Сохранённая точка — commit.' }), 1: tr({ uz: "Parol — maxfiy so'z. Kod surati — commit.", ru: 'Пароль — секретное слово. Снимок кода — commit.' }), 3: tr({ uz: 'Domen — sayt manzili. Kodning saqlangan nuqtasi — commit.', ru: 'Домен — адрес сайта. Сохранённая точка кода — commit.' }), default: tr({ uz: 'Kodning saqlangan surati — commit.', ru: 'Сохранённый снимок кода — commit.' }) }} />
);
// ===== SCREEN 6 — TARIX (vaqt mashinasi) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's6', text: `Endi eng kuchli qism boshlanadi. Har commit tarixda saqlanadi. Istalgan eski commit'ni tanlasangiz, kodingiz aynan o'sha holatga qaytadi — xuddi vaqt mashinasi. Tarixdagi commit'larni bosib, kod qanday o'zgarishini ko'ring.`, trigger: 'on_mount', waits_for: { type: 'time_travel' } }]);
  const HISTORY = [
    { hash: 'c7d8e9f', msg: { uz: "Tugma qo'shildi", ru: 'Добавлена кнопка' }, code: [{ uz: '<h1>Salom</h1>', ru: '<h1>Привет</h1>' }, { uz: '<p>Mening saytim</p>', ru: '<p>Мой сайт</p>' }, { uz: '<button>Obuna</button>', ru: '<button>Подписаться</button>' }] },
    { hash: 'e4f5a6b', msg: { uz: "Paragraf qo'shildi", ru: 'Добавлен абзац' }, code: [{ uz: '<h1>Salom</h1>', ru: '<h1>Привет</h1>' }, { uz: '<p>Mening saytim</p>', ru: '<p>Мой сайт</p>' }] },
    { hash: 'a1b2c3d', msg: { uz: "Boshlang'ich sarlavha", ru: 'Начальный заголовок' }, code: [{ uz: '<h1>Salom</h1>', ru: '<h1>Привет</h1>' }] }
  ];
  const [sel, setSel] = useState(0);
  const [traveled, setTraveled] = useState(!!storedAnswer);
  const done = traveled;
  const pick = (i) => { setSel(i); if (i !== 0 && !traveled) { setTraveled(true); audio.triggerEvent('time_travel'); if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); } };
  const cur = HISTORY[sel];
  return (
    <Stage eyebrow={tr({ uz: 'Tarix', ru: 'История' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Eski commit'ga qayting", ru: 'Вернитесь к старому коммиту' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bir hafta oldingi kodga <span className="italic" style={{ color: T.accent }}>qaytib bo'ladimi</span>?</>, ru: <>Можно ли <span className="italic" style={{ color: T.accent }}>вернуться</span> к коду недельной давности?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har commit tarixda saqlanadi. Istalgan <b style={{ color: T.ink }}>eski commit</b>'ni tanlasangiz, kod aynan o'sha holatga qaytadi — xuddi <b style={{ color: T.ink }}>vaqt mashinasi</b>. Eski commit'ni bosib ko'ring.</>, ru: <>Каждый коммит хранится в истории. Выберете любой <b style={{ color: T.ink }}>старый commit</b> — и код вернётся ровно к тому состоянию, как <b style={{ color: T.ink }}>машина времени</b>. Нажмите на старый коммит.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <div className="flow-label">{tr({ uz: 'commit tarixi (yangidan eskiga)', ru: 'история коммитов (от новых к старым)' })}</div>
            <div className="gtl fade-up delay-2">
              {HISTORY.map((h, i) => (
                <div key={h.hash} className={`gtl-node ${sel === i ? 'on' : ''}`} onClick={() => pick(i)}>
                  <div className="gtl-rail"><span className="gtl-dot" />{i < HISTORY.length - 1 && <span className="gtl-line" />}</div>
                  <div className="gtl-card"><div className="gtl-msg">{tr(h.msg)}{i === 0 && <span style={{ color: T.accent, fontWeight: 700 }}> · {tr({ uz: 'hozir', ru: 'сейчас' })}</span>}</div><div className="gtl-hash">commit {h.hash}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="col">
            <div className="flow-label">{sel === 0 ? tr({ uz: 'Hozirgi kod', ru: 'Текущий код' }) : tr({ uz: `Kod o'sha paytda · ${cur.hash}`, ru: `Код в тот момент · ${cur.hash}` })}</div>
            <pre className="code-box gcode-rewind" key={cur.hash} style={{ minHeight: 90 }}>{cur.code.map(l => tr(l)).join('\n')}</pre>
            {done && sel !== 0 && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Kod <b>{cur.hash}</b> holatiga qaytdi! Hech narsa yo'qolmadi — istalgan paytga sayohat qilsangiz bo'ladi.</>, ru: <>Код вернулся к состоянию <b>{cur.hash}</b>! Ничего не потерялось — можно путешествовать в любой момент времени.</> })}</p></div>}
            {done && sel === 0 && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Yana <b>hozirgi</b> holatga qaytdingiz. Git hammasini eslab turadi.</>, ru: <>Вы снова вернулись к <b>текущему</b> состоянию. Git помнит всё.</> })}</p></div>}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — GITHUB (bulutdagi uy) =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's7', text: `Git kompyuteringizda ishlaydi — bu sizning shaxsiy kundaligingiz. Lekin kompyuter buzilsa-chi? Yoki kodni do'stingizga ko'rsatmoqchi bo'lsangiz? Shu yerda GitHub keladi — bu bulutdagi uy. Kodingiz internetda xavfsiz saqlanadi, istalgan joydan ochiladi va boshqalar bilan ulashasiz. Tugmani bosib, loyihani GitHub'ga joylang.`, trigger: 'on_mount', waits_for: null }]);
  const [uploaded, setUploaded] = useState(!!storedAnswer);
  const done = uploaded;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const BEN = [{ ic: '🛡️', t: { uz: 'Zaxira — kompyuter buzilsa ham kod saqlanadi', ru: 'Резерв — код цел, даже если компьютер сломается' } }, { ic: '🌍', t: { uz: 'Istalgan joydan — uydan, maktabdan ochiladi', ru: 'Откуда угодно — открывается из дома и школы' } }, { ic: '👥', t: { uz: "Ulashish — do'stlar bilan birga ishlaysiz", ru: 'Совместная работа — работаете вместе с друзьями' } }, { ic: '💼', t: { uz: "Portfolio — ishlaringiz ko'rinadi", ru: 'Портфолио — ваши работы видны всем' } }];
  return (
    <Stage eyebrow="GitHub" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "GitHub'ga joylang", ru: 'Загрузите на GitHub' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kompyuter buzilsa, kod <span className="italic" style={{ color: T.accent }}>yo'qoladimi</span>?</>, ru: <>Сломается компьютер — код <span className="italic" style={{ color: T.accent }}>пропадёт</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Git faqat <b style={{ color: T.ink }}>kompyuteringizda</b> ishlaydi. Lekin kompyuter buzilsa yoki yo'qolsa — kod ham ketadimi? Yo'q! <b style={{ color: T.ink }}>GitHub</b> bor — kodning <b style={{ color: T.ink }}>bulutdagi nusxasi</b>. Tugmani bosib, loyihani bulutga joylang.</>, ru: <>Git работает только <b style={{ color: T.ink }}>на вашем компьютере</b>. Но если компьютер сломается или потеряется — код тоже пропадёт? Нет! Есть <b style={{ color: T.ink }}>GitHub</b> — <b style={{ color: T.ink }}>облачная копия</b> кода. Нажмите кнопку и загрузите проект в облако.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <div className="cs fade-up delay-2">
              <div className="cs-node"><span className="cs-ic">💻</span><span className="cs-l">{tr({ uz: <>Git<br />(kompyuteringiz)</>, ru: <>Git<br />(ваш компьютер)</> })}</span></div>
              <div className="cs-wire"><div className={`cs-msg cs-req ${uploaded ? 'on' : ''}`}>⬆️ push</div>{uploaded && <span className="cs-fly cs-fly-r">📦</span>}</div>
              <div className={`cs-node ${uploaded ? 'cs-active' : ''}`}><span className="cs-ic">☁️</span><span className="cs-l">{tr({ uz: <>GitHub<br />(bulut)</>, ru: <>GitHub<br />(облако)</> })}</span></div>
            </div>
            {!uploaded ? <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setUploaded(true)}>☁️ {tr({ uz: "GitHub'ga joylash", ru: 'Загрузить на GitHub' })}</button>
              : <p className="mono small fade-step" style={{ color: T.success, margin: 0, fontWeight: 600 }}>✓ {tr({ uz: 'github.com/siz/loyiha', ru: 'github.com/vy/proekt' })}</p>}
          </div>
          <div className="col">
            <div className="flow-label">{tr({ uz: 'GitHub nima beradi', ru: 'Что даёт GitHub' })}</div>
            {uploaded ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} className="fade-step">
                {BEN.map((b, i) => (<div key={i} className="gfile" style={{ fontFamily: "'Manrope', sans-serif" }}><span style={{ fontSize: 18 }}>{b.ic}</span><span className="gfile-name" style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13.5 }}>{tr(b.t)}</span></div>))}
              </div>
            ) : (<div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "Chapdagi tugmani bosing — kod kompyuterdan bulutga (GitHub) ko'chadi.", ru: 'Нажмите кнопку слева — код переедет с компьютера в облако (GitHub).' })}</p></div>)}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — PUSH & PULL =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's8', text: "Kodingiz ikki joyda — kompyuteringizda va bulutda. push sizdagi commit'larni bulutga yuboradi, pull bulutdagilarni sizga oladi. Bu yerda erkin sinab ko'ring: yangi commit qo'shib push qiling, do'stingiz commit qo'shsa pull qiling. Istagancha qayta-qayta bosib ko'ring.", trigger: 'on_mount', waits_for: null }]);
  const [local, setLocal] = useState(2);
  const [cloud, setCloud] = useState(storedAnswer ? 2 : 1);
  const [anim, setAnim] = useState(null);
  const [didPush, setDidPush] = useState(!!storedAnswer);
  const [didPull, setDidPull] = useState(!!storedAnswer);
  const timer = useRef(null);
  const done = didPush && didPull;
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const newCommit = () => { if (anim) return; setLocal(n => n + 1); };
  const friendCommit = () => { if (anim) return; setCloud(n => n + 1); };
  const push = () => { if (anim || local <= cloud) return; const target = local; setAnim('push'); timer.current = setTimeout(() => { setCloud(target); setAnim(null); setDidPush(true); }, 750); };
  const pull = () => { if (anim || cloud <= local) return; const target = cloud; setAnim('pull'); timer.current = setTimeout(() => { setLocal(target); setAnim(null); setDidPull(true); }, 750); };
  return (
    <Stage eyebrow="push & pull" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "push va pull'ni sinang", ru: 'Попробуйте push и pull' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kodni bulut bilan qanday <span className="italic" style={{ color: T.accent }}>almashasiz</span>?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>обмениваться</span> кодом с облаком?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Kodingiz ikki joyda: kompyuter va bulut. <b style={{ color: T.ink }}>push</b> — sizdagini bulutga yuboradi, <b style={{ color: T.ink }}>pull</b> — bulutdagini sizga oladi. Erkin sinang: commit qo'shib push qiling, do'st commit qo'shsa pull qiling — qayta-qayta.</>, ru: <>Ваш код в двух местах: компьютер и облако. <b style={{ color: T.ink }}>push</b> — отправляет ваше в облако, <b style={{ color: T.ink }}>pull</b> — забирает облачное к вам. Пробуйте свободно: добавьте коммит и сделайте push, друг добавит коммит — сделайте pull, и так сколько угодно.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <div className="cs fade-up delay-2">
              <div className={`cs-node ${local >= cloud ? 'cs-active' : ''}`}><span className="cs-ic">💻</span><span className="cs-l">{tr({ uz: <>Lokal<br /><b>{local} commit</b></>, ru: <>Локально<br /><b>{local} commit</b></> })}</span></div>
              <div className="cs-wire">
                <div className={`cs-msg cs-req ${anim === 'push' ? 'on' : ''}`}>⬆️ push</div>
                <div className={`cs-msg cs-res ${anim === 'pull' ? 'on' : ''}`}>⬇️ pull</div>
                {anim === 'push' && <span className="cs-fly cs-fly-r">📦</span>}
                {anim === 'pull' && <span className="cs-fly cs-fly-l">📦</span>}
              </div>
              <div className={`cs-node ${cloud >= local ? 'cs-active' : ''}`}><span className="cs-ic">☁️</span><span className="cs-l">GitHub<br /><b>{cloud} commit</b></span></div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn" onClick={push} disabled={anim !== null || local <= cloud}>⬆️ git push</button>
              <button className="btn" onClick={pull} disabled={anim !== null || cloud <= local}>⬇️ git pull</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn-soft" onClick={newCommit} disabled={anim !== null}>✏️ {tr({ uz: 'Yangi commit', ru: 'Новый коммит' })}</button>
              <button className="btn-soft" onClick={friendCommit} disabled={anim !== null}>👤 {tr({ uz: "Do'st commit qo'shdi", ru: 'Друг добавил коммит' })}</button>
            </div>
          </div>
          <div className="col">
            {anim === 'push' ? (<div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>⬆️ {tr({ uz: "commit'lar bulutga yuborilmoqda…", ru: 'Коммиты отправляются в облако…' })}</p></div>)
              : anim === 'pull' ? (<div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>⬇️ {tr({ uz: "commit'lar bulutdan olinmoqda…", ru: 'Коммиты загружаются из облака…' })}</p></div>)
                : local > cloud ? (<div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Lokalda <b>{local - cloud}</b> ta yangi commit bor. <b>push</b> bilan bulutga yuboring.</>, ru: <>Локально есть <b>{local - cloud}</b> новых коммита(ов). Отправьте их в облако через <b>push</b>.</> })}</p></div>)
                  : cloud > local ? (<div className="frame-soft"><p className="small mono" style={{ margin: '0 0 4px', fontWeight: 600, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>👤 {tr({ uz: "Do'stdan yangilik", ru: 'Новость от друга' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bulutda <b>{cloud - local}</b> ta yangi commit bor. <b>pull</b> bilan o'zingizga oling.</>, ru: <>В облаке есть <b>{cloud - local}</b> новых коммита(ов). Заберите их себе через <b>pull</b>.</> })}</p></div>)
                    : (<div className="frame-success"><p className="small mono" style={{ margin: '0 0 4px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ {tr({ uz: 'Sinxron', ru: 'Синхронно' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: `Lokal va bulut bir xil! "Yangi commit" yoki "Do'st commit" qo'shib, yana push/pull qiling.`, ru: 'Локально и в облаке одно и то же! Добавьте «Новый коммит» или «Друг добавил коммит» — и снова push/pull.' })}</p></div>)}
            <div style={{ display: 'flex', gap: 16, fontFamily: "'Manrope', sans-serif", fontSize: 13, fontWeight: 600 }}>
              <span style={{ color: didPush ? T.success : T.ink3 }}>{didPush ? '✓' : '○'} {tr({ uz: 'push sinaldi', ru: 'push опробован' })}</span>
              <span style={{ color: didPull ? T.success : T.ink3 }}>{didPull ? '✓' : '○'} {tr({ uz: 'pull sinaldi', ru: 'pull опробован' })}</span>
            </div>
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};
// ===== SCREEN 9 — TEST (push) =====
const Screen9 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    audioText="git push buyrug'i nima qiladi — u kodni qayerga jo'natadi?"
    questionText="git push buyrug'i nima qiladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <><span className="italic" style={{ color: T.accent }}>git push</span> buyrug'i nima qiladi?</>, ru: <>Что делает команда <span className="italic" style={{ color: T.accent }}>git push</span>?</> })}</h2></>}
    options={[{ uz: "Barcha kodni butunlay o'chiradi", ru: 'Полностью удаляет весь код' }, { uz: "Lokal commit'larni bulutga yuboradi", ru: 'Отправляет локальные коммиты в облако' }, { uz: "Sahifaga yangi ranglar qo'shadi", ru: 'Добавляет странице новые цвета' }, { uz: 'Internet tezligini oshirib beradi', ru: 'Ускоряет интернет' }]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! push — lokal kompyuteringizdagi commit'larni GitHub'ga (bulutga) yuboradi.", ru: 'Верно! push отправляет коммиты с вашего компьютера на GitHub (в облако).' })}
    explainWrong={{ 0: tr({ uz: "push o'chirmaydi — aksincha, commit'laringizni bulutga yuboradi.", ru: 'push ничего не удаляет — наоборот, отправляет ваши коммиты в облако.' }), 2: tr({ uz: "Rang — CSS ishi. push esa commit'larni bulutga yuboradi.", ru: 'Цвета — работа CSS. А push отправляет коммиты в облако.' }), 3: tr({ uz: "Internet tezligi push bilan bog'liq emas. U commit'larni yuboradi.", ru: 'Скорость интернета с push не связана. Он отправляет коммиты.' }), default: tr({ uz: "push — lokal commit'larni GitHub'ga yuboradi.", ru: 'push — отправляет локальные коммиты на GitHub.' }) }} />
);

// ===== SCREEN 10 — REPOSITORY =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's10', text: "Kodingiz qayerda yashaydi? Repository'da — qisqacha repo. Repo — bu Git kuzatadigan loyiha papkasi. Ichida barcha fayllar, commit tarixi va README bor. GitHub'dagi repo qismlarini bosib o'rganing.", trigger: 'on_mount', waits_for: null }]);
  const PARTS = {
    name: { label: { uz: 'Repo nomi', ru: 'Имя репо' }, body: { uz: "Repository — Git kuzatadigan loyiha papkasi. Har repo'ning manzili bor: github.com/siz/loyiha.", ru: 'Repository — папка проекта, за которой следит Git. У каждого репо есть адрес: github.com/vy/proekt.' } },
    files: { label: { uz: 'Fayllar', ru: 'Файлы' }, body: { uz: "Loyihaning barcha fayllari shu yerda: index.html, style.css va boshqalar.", ru: 'Здесь все файлы проекта: index.html, style.css и другие.' } },
    readme: { label: 'README.md', body: { uz: "README — loyiha tavsifi. Repo'ni ochgan har kim avval shuni o'qiydi: bu qanday loyiha.", ru: 'README — описание проекта. Каждый, кто откроет репо, сначала читает его: что это за проект.' } },
    commits: { label: { uz: 'commit tarixi', ru: 'история коммитов' }, body: { uz: "Repo barcha commit'larni saqlaydi — butun tarix shu yerda, vaqt mashinasi.", ru: 'Репо хранит все коммиты — вся история здесь, машина времени.' } }
  };
  const KEYS = Object.keys(PARTS);
  const [seen, setSeen] = useState(storedAnswer?.seen || []);
  const [active, setActive] = useState(storedAnswer ? 'name' : null);
  const done = seen.length >= KEYS.length;
  const click = (k) => { setActive(k); setSeen(s => { const ns = s.includes(k) ? s : [...s, k]; if (ns.length >= KEYS.length && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, seen: ns }); return ns; }); };
  return (
    <Stage eyebrow="Repository" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Qismlarni oching (${seen.length}/${KEYS.length})`, ru: `Откройте части (${seen.length}/${KEYS.length})` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Loyihaning hamma narsasi <span className="italic" style={{ color: T.accent }}>qayerda turadi</span>?</>, ru: <>Где <span className="italic" style={{ color: T.accent }}>хранится</span> всё, что есть в проекте?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Loyihangizning fayllari, commit tarixi va tavsifi — hammasi qayerda? <b style={{ color: T.ink }}>Repository</b>'da (qisqacha <b style={{ color: T.ink }}>repo</b>) — Git kuzatadigan loyiha papkasi. GitHub'dagi repo qismlarini bosib o'rganing.</>, ru: <>Файлы проекта, история коммитов и описание — где всё это? В <b style={{ color: T.ink }}>Repository</b> (коротко <b style={{ color: T.ink }}>репо</b>) — папке проекта, за которой следит Git. Нажимайте на части репо на GitHub и изучайте.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <div className="repo fade-up delay-2">
              <div className="repo-top">📦 <b>{tr({ uz: 'mening-saytim', ru: 'moy-sayt' })}</b> <span style={{ marginLeft: 'auto', color: T.ink3, fontSize: 11 }}>Public</span></div>
              <div className={`repo-row ${active === 'name' ? 'on' : ''} ${seen.includes('name') ? 'seen' : ''}`} onClick={() => click('name')}>🔗 {tr({ uz: 'github.com/siz/mening-saytim', ru: 'github.com/vy/moy-sayt' })}</div>
              <div className={`repo-row ${active === 'files' ? 'on' : ''} ${seen.includes('files') ? 'seen' : ''}`} onClick={() => click('files')}>📄 index.html · style.css</div>
              <div className={`repo-row ${active === 'readme' ? 'on' : ''} ${seen.includes('readme') ? 'seen' : ''}`} onClick={() => click('readme')}>📝 README.md</div>
              <div className={`repo-row ${active === 'commits' ? 'on' : ''} ${seen.includes('commits') ? 'seen' : ''}`} onClick={() => click('commits')}>🕐 5 commit</div>
            </div>
          </div>
          <div className="col">
            <div className="flow-label">{tr({ uz: 'Qism haqida', ru: 'Об этой части' })}</div>
            {active ? (
              <div className="sk-info" key={active}><div className="sk-tagbig" style={{ marginBottom: 8 }}><span className="sk-wordbadge">{tr(PARTS[active].label)}</span></div><p className="body" style={{ margin: 0, color: T.ink }}>{tr(PARTS[active].body)}</p></div>
            ) : (<div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Repo qismini bosing — izoh chiqadi', ru: 'Нажмите на часть репо — появится пояснение' })}</p></div>)}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Repo — bitta loyiha uchun bitta uy: fayllar + tarix + tavsif, hammasi birga.', ru: 'Репо — один дом для одного проекта: файлы + история + описание, всё вместе.' })}</p></div>}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — CLONE & JAMOA =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's11', text: "GitHub'ning eng kuchli tomoni — birga ishlash. Boshqaning ochiq loyihasini ko'rdingizmi? clone qilib, butun repo'ni kompyuteringizga nusxalaysiz. Keyin o'zgartirib, push qilasiz. Shunday qilib millionlab dasturchilar bitta loyihada birga ishlaydi. Clone tugmasini bosib ko'ring.", trigger: 'on_mount', waits_for: null }]);
  const [cloned, setCloned] = useState(!!storedAnswer);
  const done = cloned;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Jamoa', ru: 'Команда' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Clone qiling', ru: 'Сделайте clone' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Boshqaning loyihasini qanday <span className="italic" style={{ color: T.accent }}>olasiz</span>?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>получить</span> чужой проект?</> })}</h2></div>
        <Mentor>{tr({ uz: <>GitHub'ning eng kuchli tomoni — <b style={{ color: T.ink }}>birga ishlash</b>. Boshqaning loyihasini <b style={{ color: T.ink }}>clone</b> qilib, butun repo'ni kompyuteringizga nusxalaysiz. Keyin o'zgartirib, push qilasiz. Tugmani bosing.</>, ru: <>Самая сильная сторона GitHub — <b style={{ color: T.ink }}>совместная работа</b>. Чужой проект вы <b style={{ color: T.ink }}>клонируете</b> — копируете весь репозиторий на свой компьютер. Потом меняете и делаете push. Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <div className="cs fade-up delay-2">
              <div className="cs-node cs-active"><span className="cs-ic">☁️</span><span className="cs-l">{tr({ uz: <>GitHub repo<br />(jamoaniki)</>, ru: <>GitHub-репо<br />(командный)</> })}</span></div>
              <div className="cs-wire"><div className={`cs-msg cs-res ${cloned ? 'on' : ''}`}>⬇️ clone</div>{cloned && <span className="cs-fly cs-fly-r">📦</span>}</div>
              <div className={`cs-node ${cloned ? 'cs-active' : ''}`}><span className="cs-ic">💻</span><span className="cs-l">{tr({ uz: <>Sizning<br />kompyuter</>, ru: <>Ваш<br />компьютер</> })}</span></div>
            </div>
            {!cloned ? <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setCloned(true)}>⬇️ git clone</button>
              : <div className="term fade-step"><span className="term-row"><span className="term-prompt">$ </span><span className="term-cmd">{tr({ uz: 'git clone github.com/jamoa/loyiha', ru: 'git clone github.com/komanda/proekt' })}</span></span><span className="term-row"><span className="term-ok">✓ {tr({ uz: 'Nusxalandi — barcha fayl va tarix', ru: 'Скопировано — все файлы и история' })}</span></span></div>}
          </div>
          <div className="col">
            {done ? (
              <div className="frame-success fade-step"><p className="small mono" style={{ margin: '0 0 4px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ {tr({ uz: 'Repo nusxalandi', ru: 'Репо скопирован' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Endi butun loyiha sizda — barcha fayl va commit tarixi bilan. O'zgartirib, <b>push</b> qilsangiz, jamoa sizning hissangizni ko'radi.</>, ru: <>Теперь весь проект у вас — со всеми файлами и историей коммитов. Измените его и сделайте <b>push</b> — команда увидит ваш вклад.</> })}</p></div>
            ) : (<div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <><b>clone</b> — bulutdagi butun repo'ni kompyuteringizga ko'chiradi.</>, ru: <><b>clone</b> — переносит весь облачный репозиторий на ваш компьютер.</> })}</p></div>)}
            <div className="frame-soft"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Millionlab dasturchilar shunday ishlaydi: <b>clone</b> → o'zgartir → <b>push</b>. Bitta loyiha — ko'p odam.</>, ru: <>Так работают миллионы программистов: <b>clone</b> → измени → <b>push</b>. Один проект — много людей.</> })}</p></div>
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};
// ===== SCREEN 12 — TEST (GitHub nima uchun) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    audioText="GitHub asosan nima uchun kerak — uning ikki asosiy foydasi nima?"
    questionText="GitHub asosan nima uchun kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>GitHub asosan <span className="italic" style={{ color: T.accent }}>nima uchun</span> kerak?</>, ru: <><span className="italic" style={{ color: T.accent }}>Для чего</span> в основном нужен GitHub?</> })}</h2></>}
    options={[{ uz: "Faqat onlayn o'yin o'ynash uchun", ru: 'Только для онлайн-игр' }, { uz: "Internet tezligini oshirish uchun", ru: 'Для ускорения интернета' }, { uz: "Rasmlarni chiroyli tahrirlash uchun", ru: 'Для красивой обработки картинок' }, { uz: "Bulutda saqlash va birga ishlash uchun", ru: 'Для хранения в облаке и совместной работы' }]} correctIdx={3}
    explainCorrect={tr({ uz: "To'g'ri! GitHub — kodni bulutda xavfsiz saqlaydi va boshqalar bilan birga ishlash imkonini beradi.", ru: 'Верно! GitHub надёжно хранит код в облаке и даёт возможность работать вместе с другими.' })}
    explainWrong={{ 0: tr({ uz: "GitHub o'yin platformasi emas. U kodni saqlaydi va jamoa ishini birlashtiradi.", ru: 'GitHub — не игровая платформа. Он хранит код и объединяет работу команды.' }), 1: tr({ uz: "Internet tezligi GitHub bilan bog'liq emas. U kodni bulutda saqlaydi.", ru: 'Скорость интернета с GitHub не связана. Он хранит код в облаке.' }), 2: tr({ uz: "Rasm tahrirlash — Photoshop ishi. GitHub kod va loyihalar uchun.", ru: 'Обработка картинок — работа Photoshop. GitHub — для кода и проектов.' }), default: tr({ uz: "GitHub — kodni bulutda saqlash va birga ishlash uchun.", ru: 'GitHub — для хранения кода в облаке и совместной работы.' }) }} />
);

// ===== SCREEN 13 — WORKFLOW SIMULATOR =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's13', text: "Endi o'zingiz to'liq aylanani bajaring. Faylni o'zgartirdingiz. Endi uchta buyruqni tartib bilan bosing: git add fayllarni tanlaydi, git commit saqlaydi, git push GitHub'ga yuboradi. Tartib muhim!", trigger: 'on_mount', waits_for: null }]);
  const CMDS = [
    { cmd: 'git add .', out: { uz: "O'zgarishlar tanlandi (staged)", ru: 'Изменения выбраны (staged)' }, ic: '📥', l: 'add' },
    { cmd: { uz: 'git commit -m "yangi sahifa"', ru: 'git commit -m "новая страница"' }, out: { uz: '[main a1b2c3d] yangi sahifa', ru: '[main a1b2c3d] новая страница' }, ic: '💾', l: 'commit' },
    { cmd: 'git push', out: { uz: "GitHub'ga yuborildi ✓", ru: 'Отправлено на GitHub ✓' }, ic: '⬆️', l: 'push' }
  ];
  const NODES = [{ ic: '✏️', l: { uz: "O'zgartirish", ru: 'Изменение' } }, ...CMDS.map(c => ({ ic: c.ic, l: c.l }))];
  const [step, setStep] = useState(storedAnswer ? CMDS.length : 0);
  const done = step >= CMDS.length;
  const run = (i) => { if (i !== step) return; const ns = step + 1; setStep(ns); if (ns >= CMDS.length && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · workflow', ru: 'Практика · workflow' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Aylanani bajaring', ru: 'Выполните цикл' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>To'liq aylana — <span className="italic" style={{ color: T.accent }}>o'zingiz bajaring</span></>, ru: <>Полный цикл — <span className="italic" style={{ color: T.accent }}>выполните сами</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Faylni o'zgartirdingiz. Endi uchta buyruqni <b style={{ color: T.ink }}>tartib bilan</b> bosing: <span className="mono">add</span> → <span className="mono">commit</span> → <span className="mono">push</span>. Tartib muhim!</>, ru: <>Вы изменили файл. Теперь нажмите три команды <b style={{ color: T.ink }}>по порядку</b>: <span className="mono">add</span> → <span className="mono">commit</span> → <span className="mono">push</span>. Порядок важен!</> })}</Mentor>
        <div className="frame frame-col fade-up delay-2">
          <div className="pz-flow">{NODES.map((s, i) => (<React.Fragment key={i}><div className={`pz-step ${i === 0 || step >= i ? 'on' : ''} ${i > 0 && step + 1 === i ? 'active' : ''}`}><span className="pz-ic">{i === 0 ? '✏️' : (step >= i ? '✓' : s.ic)}</span><span className="pz-lbl">{tr(s.l)}</span></div>{i < NODES.length - 1 && <span className={`pz-arrow ${step >= i ? 'on' : ''}`}>→</span>}</React.Fragment>))}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {CMDS.map((c, i) => (<button key={i} className={`chip ${step === i ? 'chip-on' : ''}`} disabled={step !== i} onClick={() => run(i)}>{c.ic} git {c.l}</button>))}
          </div>
        </div>
        <div className="term fade-up delay-2" style={{ minHeight: 70 }}>
          {step === 0 ? <span className="term-row"><span className="term-out">{tr({ uz: '// Buyruqlarni tartib bilan bosing…', ru: '// Нажимайте команды по порядку…' })}</span></span>
            : CMDS.slice(0, step).map((c, i) => (<React.Fragment key={i}><span className="term-row"><span className="term-prompt">$ </span><span className="term-cmd">{tr(c.cmd)}</span></span><span className="term-row"><span className="term-ok">{tr(c.out)}</span></span></React.Fragment>))}
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mana to'liq aylana: <b>o'zgartir → add → commit → push</b>. Kodingiz endi GitHub'da, xavfsiz!</>, ru: <>Вот полный цикл: <b>измени → add → commit → push</b>. Ваш код теперь на GitHub, в безопасности!</> })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — DEBUGGING (push ishlamadi) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's14', text: "AI sizga buyruqlar berdi, lekin push ishlamadi. Nega? Diqqat bilan qarang: git add bor, git push bor, lekin orasida git commit yo'q! Saqlanmagan narsani yuborib bo'lmaydi. Avval ishga tushiring, keyin yetishmagan qadamni qo'shing.", trigger: 'on_mount', waits_for: { type: 'error_found' } }]);
  const [stage, setStage] = useState(storedAnswer ? 'fixed' : 'idle'); // idle -> failed -> fixed
  const done = stage === 'fixed';
  const fail = () => { if (stage !== 'idle') return; setStage('failed'); audio.triggerEvent('error_found'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff("Mana muammo: git add dan keyin to'g'ridan-to'g'ri push. Orasida git commit yo'q — saqlanmagan o'zgarishni yuborib bo'lmaydi."); }, 300); };
  const fix = () => { setStage('fixed'); if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff("Tuzatildi! Endi git commit bor — o'zgarish saqlandi va push ishladi."); }, 300); };
  return (
    <Stage eyebrow={tr({ uz: 'Debugging', ru: 'Отладка' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (stage === 'failed' ? tr({ uz: 'Endi tuzating', ru: 'Теперь исправьте' }) : tr({ uz: 'Ishga tushiring', ru: 'Запустите' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>push ishlamadi — <span className="italic" style={{ color: T.accent }}>nega</span>?</>, ru: <>push не сработал — <span className="italic" style={{ color: T.accent }}>почему</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI buyruqlar berdi, lekin push ishlamadi. Diqqat bilan qarang: <span className="mono">add</span> bor, <span className="mono">push</span> bor, lekin orasida <b style={{ color: T.ink }}>commit yo'q</b>! Ishga tushiring, keyin tuzating.</>, ru: <>ИИ выдал команды, но push не сработал. Смотрите внимательно: есть <span className="mono">add</span>, есть <span className="mono">push</span>, но между ними <b style={{ color: T.ink }}>нет commit</b>! Запустите, потом исправьте.</> })}</Mentor>
        <div className="split">
          <div className="col">
            <div className="term fade-up delay-2" style={{ minHeight: 100 }}>
              <span className="term-row"><span className="term-prompt">$ </span><span className="term-cmd">git add .</span></span>
              {stage === 'fixed' && <span className="term-row fade-step"><span className="term-prompt">$ </span><span className="term-cmd">{tr({ uz: 'git commit -m "yangi"', ru: 'git commit -m "novoe"' })}</span></span>}
              {stage === 'fixed' && <span className="term-row"><span className="term-ok">{tr({ uz: '[main a1b2c3d] yangi', ru: '[main a1b2c3d] novoe' })}</span></span>}
              <span className="term-row"><span className="term-prompt">$ </span><span className="term-cmd">git push</span></span>
              {stage === 'failed' && <span className="term-row fade-step"><span className="term-err">✗ {tr({ uz: 'Xato: nothing to commit — saqlanmagan', ru: 'Ошибка: nothing to commit — ничего не сохранено' })}</span></span>}
              {stage === 'fixed' && <span className="term-row"><span className="term-ok">✓ {tr({ uz: "GitHub'ga yuborildi", ru: 'Отправлено на GitHub' })}</span></span>}
            </div>
            {stage === 'idle' && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={fail}>▶ {tr({ uz: 'Buyruqlarni bajarish', ru: 'Выполнить команды' })}</button>}
            {stage === 'failed' && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={fix}>🔧 {tr({ uz: "git commit qo'shib tuzatish", ru: 'Исправить, добавив git commit' })}</button>}
            {stage === 'fixed' && <p className="mono small" style={{ color: T.success, margin: 0, fontWeight: 600 }}>✓ {tr({ uz: "add → commit → push — to'g'ri!", ru: 'add → commit → push — верно!' })}</p>}
          </div>
          <div className="col">
            {stage === 'idle' && (<div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: `Buyruqlarni o'qing. "Bajarish"ni bosib, nima bo'lishini ko'ring.`, ru: 'Прочитайте команды. Нажмите «Выполнить» и посмотрите, что будет.' })}</p></div>)}
            {stage === 'failed' && (<div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>❌ {tr({ uz: 'commit tushib qolgan', ru: 'commit пропущен' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">add</span> fayllarni tanladi, lekin <b>commit</b> qilinmadi — saqlangan narsa yo'q. push yuboradigan narsani topolmadi. Chap tomondagi tugma bilan tuzating →</>, ru: <><span className="mono">add</span> выбрал файлы, но <b>commit</b> не сделан — ничего не сохранено. push не нашёл, что отправлять. Исправьте кнопкой слева →</> })}</p></div>)}
            {stage === 'fixed' && (<div className="takeaway fade-step"><div className="ta-bulb">🛠️</div><p className="ta-h">{tr({ uz: 'Yetishmagan qadamni topdingiz!', ru: 'Вы нашли недостающий шаг!' })}</p><p className="ta-sub">{tr({ uz: 'add → commit → push: har biri kerak, tartib bilan', ru: 'add → commit → push: нужен каждый, и по порядку' })}</p></div>)}
          </div>
        </div>
      </div>
    </Stage>
  );
};
// ===== SCREEN 15 — YAKUNIY (yozma) =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's15', text: "Oxirgi qadam: o'zingiz commit buyrug'ini yozing. Uch qism kerak: git commit, so'ng -m bayrog'i, so'ng qo'shtirnoq ichida izoh. Pastdagi namunaga qarab yozing.", trigger: 'on_mount', waits_for: null }]);
  const [val, setVal] = useState(storedAnswer?.picked || '');
  const norm = val.trim();
  const hasCmd = /git\s+commit/i.test(norm);
  const hasM = /-m\b/.test(norm);
  const afterM = hasM ? norm.split(/-m/i).slice(1).join('-m') : '';
  const qmatch = afterM.match(/["'‘’“”]\s*([^"'‘’“”]+?)\s*["'‘’“”]/);
  const hasMsg = hasM && !!qmatch;
  const valid = hasCmd && hasM && hasMsg;
  const solvedRef = useRef(!!storedAnswer);
  useEffect(() => {
    if (valid && !solvedRef.current) {
      solvedRef.current = true;
      onAnswer(screen, { stage: 'final', screenIdx: screen, correct: true, firstAttemptCorrect: true, picked: val });
      const e = getAudioEngine();
      if (e && !audio.muted) setTimeout(() => { if (!audio.muted) e.pushOneOff("Zo'r! git commit, -m va izoh — uchchalasini to'liq yozdingiz."); }, 200);
    }
    // eslint-disable-next-line
  }, [valid]);
  const CHECKS = [{ ok: hasCmd, l: '1. git commit' }, { ok: hasM, l: { uz: `2. -m bayrog'i`, ru: '2. флаг -m' } }, { ok: hasMsg, l: { uz: `3. "izoh" qo'shtirnoqda`, ru: '3. «комментарий» в кавычках' } }];
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!valid} label={valid ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "To'liq buyruqni yozing", ru: 'Напишите команду полностью' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingiz <span className="italic" style={{ color: T.accent }}>commit</span> yozing</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>commit</span> сами</> })}</h2></div>
        <Mentor>{tr({ uz: <>Uch qism kerak: <span className="mono">git commit</span> + <span className="mono">-m</span> + qo'shtirnoq ichida <b style={{ color: T.ink }}>izoh</b>. Namuna: <span className="mono">{`git commit -m "birinchi commit"`}</span>.</>, ru: <>Нужны три части: <span className="mono">git commit</span> + <span className="mono">-m</span> + <b style={{ color: T.ink }}>комментарий</b> в кавычках. Образец: <span className="mono">{`git commit -m "birinchi commit"`}</span>.</> })}</Mentor>
        <div className="split">
          <div className="col">
            <input className="text-input" style={valid ? { boxShadow: `0 8px 22px -6px rgba(31,122,77,0.4), 0 0 0 2px ${T.success}` } : undefined} value={val} placeholder={`git commit -m "..."`} onChange={e => setVal(e.target.value)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {CHECKS.map((c, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: "'Manrope', sans-serif", fontSize: 14, color: c.ok ? T.success : T.ink3, fontWeight: c.ok ? 600 : 500 }}><span style={{ width: 20, height: 20, borderRadius: '50%', background: c.ok ? T.success : 'transparent', boxShadow: c.ok ? 'none' : `inset 0 0 0 2px ${T.ink3}`, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{c.ok ? '✓' : ''}</span>{tr(c.l)}</div>))}
            </div>
          </div>
          <div className="col">
            <div className="flow-label">{tr({ uz: 'Natija', ru: 'Результат' })}</div>
            {valid ? (
              <div className="term fade-step"><span className="term-row"><span className="term-prompt">$ </span><span className="term-cmd">{norm}</span></span><span className="term-row"><span className="term-ok">{tr({ uz: '[main a1b2c3d] saqlandi ✓', ru: '[main a1b2c3d] сохранено ✓' })}</span></span></div>
            ) : (<div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "To'liq buyruqni yozing — natija shu yerda chiqadi", ru: 'Напишите команду полностью — результат появится здесь' })}</p></div>)}
            {valid && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "To'liq commit buyrug'ini o'zingiz yozdingiz! Endi haqiqiy loyihada ishlata olasiz.", ru: 'Вы сами написали полную команду commit! Теперь сможете использовать её в настоящем проекте.' })}</p></div>}
          </div>
        </div>
      </div>
    </Stage>
  );
};

// 🧲 Qayta ishlatiladigan DRAG&DROP TARTIB — bo'laklarni to'g'ri ketma-ketlikda joylash.
// Boshqa darsga: faqat `items` ({ id, label }), `hints`, `onSolved` almashtiriladi.
// YAGONA holat (pool+slots birga) — StrictMode'da dublikat bo'lmaydi (S7 saboq).
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
            {sid ? <button className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr(byId[sid].label)}</button> : <span className="dd-hint">{hints ? tr(hints[i]) : tr({ uz: 'bu yerga joylang', ru: 'поместите сюда' })}</span>}
          </div>
        ))}
      </div>
      <div className="dd-pool">
        {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: 'Порядок неверный — нажмите на блок, верните его и расставьте заново' })}</span>}
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>
      {solved && <div className="dd-done">✓ {tr({ uz: "To'g'ri! Git ish-oqimi aynan shu tartibda.", ru: 'Верно! Рабочий цикл Git именно в таком порядке.' })}</div>}
      {wrong && !solved && <div className="dd-wrong">⚠️ {tr({ uz: 'Tartib xato — qayta joylang.', ru: 'Порядок неверный — расставьте заново.' })}</div>}
    </div>
  );
}

// 🃏 Qayta ishlatiladigan FLASHCARDS — aktiv takrorlash (3D flip + o'z-o'zini baholash).
// Boshqa darsga: faqat `cards` ({ front, back, note }) almashtiriladi.
const GIT_FLASHCARDS = [
  { front: { uz: 'Kod uchun vaqt mashinasi', ru: 'Машина времени для кода' }, back: 'Git', note: { uz: 'versiya nazorati', ru: 'контроль версий' } },
  { front: { uz: 'Kodning saqlangan surati', ru: 'Сохранённый снимок кода' }, back: 'commit', note: { uz: 'izoh bilan nuqta', ru: 'точка с комментарием' } },
  { front: { uz: 'Loyiha papkasi (kod uyi)', ru: 'Папка проекта (дом кода)' }, back: 'repository', note: { uz: 'qisqa: repo', ru: 'коротко: репо' } },
  { front: { uz: 'Kodning bulutdagi uyi', ru: 'Облачный дом кода' }, back: 'GitHub', note: { uz: 'onlayn platforma', ru: 'онлайн-платформа' } },
  { front: { uz: "O'zgarishni saqlashga tanlash", ru: 'Выбрать изменение для сохранения' }, back: 'git add', note: 'staged' },
  { front: { uz: "Suratni saqlash buyrug'i", ru: 'Команда сохранения снимка' }, back: 'git commit', note: '-m "izoh"' },
  { front: { uz: 'Lokaldan bulutga yuborish', ru: 'Отправить из локального в облако' }, back: 'git push', note: { uz: 'yuqoriga', ru: 'вверх' } },
  { front: { uz: 'Bulutdan lokalga olish', ru: 'Забрать из облака к себе' }, back: 'git pull', note: { uz: 'pastga', ru: 'вниз' } },
  { front: { uz: 'Repo nusxasini olib kelish', ru: 'Скопировать репо себе' }, back: 'git clone', note: { uz: 'birga ishlash', ru: 'совместная работа' } },
  { front: { uz: "commitdagi qisqa izoh bayrog'i", ru: 'Флаг короткого комментария в commit' }, back: '-m', note: 'message' },
  { front: { uz: "Repo holatini ko'rish", ru: 'Посмотреть состояние репо' }, back: 'git status', note: { uz: "nima o'zgardi", ru: 'что изменилось' } },
  { front: { uz: "Commitlar tarixini ko'rish", ru: 'Посмотреть историю коммитов' }, back: 'git log', note: { uz: 'barcha suratlar', ru: 'все снимки' } },
];
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'atama yodlandi', ru: 'терминов выучено' })}</p><button className="fc-btn ghost" onClick={restart}>↻ {tr({ uz: 'Qaytadan takrorlash', ru: 'Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Учу' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span><span className="fc-cue">{tr({ uz: 'Qaysi atama?', ru: 'Какой термин?' })} 🤔 <span className="fc-tap">{tr({ uz: 'bosing', ru: 'нажмите' })}</span></span></div>
          <div className="fc-face fc-back"><span className="fc-tag">{card.back}</span>{card.note && <span className="fc-note">{tr(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>✗ {tr({ uz: 'Takrorlash', ru: 'Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })}</button></div>)
        : (<p className="fc-hint">👆 {tr({ uz: "Kartani bosing — javobni ko'rasiz", ru: 'Нажмите на карточку — увидите ответ' })}</p>)}
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

// ===== 🏅 ACHIEVEMENTS (nishonlar) — dars davomidagi real bosqichlar uchun =====
const ACHIEVEMENTS = {
  timetravel: { icon: '🔍', name: 'Nice Catch!', desc: { uz: "Yetishmagan git-qadamni topib tuzatdingiz", ru: 'Вы нашли и исправили недостающий git-шаг' } },
  quizace:    { icon: '🎯', name: 'Bullseye!',      desc: { uz: "Test savoliga birinchi urinishda to'g'ri javob berdingiz", ru: 'Вы ответили на вопрос теста верно с первой попытки' } },
  gitflow:    { icon: '🔀', name: 'Flow Master!',   desc: { uz: "Git ish-oqimini to'g'ri tartibladingiz", ru: 'Вы правильно расставили рабочий цикл Git' } },
  graduate:   { icon: '🏆', name: 'Level Up!',      desc: { uz: "Git va GitHub darsini to'liq yakunladingiz", ru: 'Вы полностью завершили урок Git и GitHub' } },
};
// Ekran id → nishon (recordAnswer'da avtomatik beriladi) — FAQAT ma'noli ekranga (haqiqiy challenge/scored):
// s14 = debug challenge (yetishmagan qadamni topib TUZATGANDA correct:true otadi) · s9 = scored test · s14b = DragDrop gate g'alabasi
const ACH_TRIGGERS = { s14: 'timetravel', s9: 'quizace', s14b: 'gitflow' };
// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI
function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr({ uz: `Yangi nishon: ${ach.name}`, ru: `Новый значок: ${ach.name}` })}>
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

// ===== 👋 ONBOARDING — coach-mark turi: har qadamda haqiqiy tugmaga spotlight + so'z (rolga qarab, bir marta) =====
const TOUR = {
  learner: [
    { sel: '[data-tour="next"]', ic: '▶', h: { uz: "Oldinga o'tish", ru: 'Переход вперёд' }, body: { uz: <>Tayyor bo'lsangiz, <b>«Davom etish»</b> bilan keyingi qadamga o'tasiz. Yonidagi <b>«Orqaga»</b> bilan qaytasiz.</>, ru: <>Когда будете готовы, переходите дальше кнопкой <b>«Продолжить»</b>. Кнопка <b>«Назад»</b> рядом вернёт вас обратно.</> } },
    { sel: '[data-tour="mentor"]', ic: '🧑‍🏫', h: { uz: 'Mentor yordami', ru: 'Помощь ментора' }, body: { uz: <>Har ekranda mentor nima qilishni tushuntiradi — avval uni <b>o'qing</b>, keyin bajaring.</>, ru: <>На каждом экране ментор объясняет, что делать — сначала <b>прочитайте</b>, потом выполняйте.</> } },
    { sel: '[data-tour="progress"]', ic: '📊', h: { uz: "Progress chizig'i", ru: 'Полоса прогресса' }, body: { uz: <>Bu chiziq dars <b>qancha qolganini</b> ko'rsatadi — to'lgani sari yakunlaysiz.</>, ru: <>Эта полоса показывает, <b>сколько осталось</b> до конца урока — заполнится, значит финиш.</> } },
    { sel: '[data-tour="ach"]', ic: '🏅', h: { uz: 'Nishonlaringiz', ru: 'Ваши значки' }, body: { uz: <>Vazifalarni bajarib, shu yerda <b>nishon</b> yig'asiz. Bosib ro'yxatini ko'rasiz.</>, ru: <>Выполняйте задания и собирайте здесь <b>значки</b>. Нажмите — увидите список.</> } },
  ],
  mentor: [
    { sel: '[data-tour="live"]', ic: '🔢', h: { uz: "Qo'shilish kodi", ru: 'Код подключения' }, body: { uz: <>O'quvchilar shu <b>PIN kod</b> bilan qo'shiladi. Kim qo'shilganini shu yerda ko'rasiz.</>, ru: <>Ученики подключаются по этому <b>PIN-коду</b>. Здесь же видно, кто присоединился.</> } },
    { sel: '[data-tour="next"]', ic: '▶', h: { uz: 'Siz boshqarasiz', ru: 'Вы управляете' }, body: { uz: <><b>«Davom etish»</b> bosganingizda, barcha o'quvchilar birga oldinga o'tadi.</>, ru: <>Когда вы нажимаете <b>«Продолжить»</b>, все ученики переходят вперёд вместе с вами.</> } },
    { sel: '[data-tour="progress"]', ic: '📊', h: { uz: "Progress chizig'i", ru: 'Полоса прогресса' }, body: { uz: <>Dars qaysi bosqichda ekanini shu chiziq ko'rsatadi.</>, ru: <>Эта полоса показывает, на каком этапе сейчас урок.</> } },
  ],
};
function TourGuide({ role, onClose }) {
  const steps = TOUR[role] || TOUR.learner;
  const [i, setI] = useState(0);
  const [rect, setRect] = useState(null);
  const step = steps[i];
  const last = i === steps.length - 1;
  useEffect(() => {
    const el = typeof document !== 'undefined' && document.querySelector(step.sel);
    if (!el) { setRect(null); return; }
    el.scrollIntoView({ block: 'center', behavior: 'auto' });
    const measure = () => { const r = el.getBoundingClientRect(); setRect({ top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom }); };
    const raf = requestAnimationFrame(() => { measure(); });
    const t = setTimeout(measure, 90);
    window.addEventListener('resize', measure);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); else if (e.key === 'ArrowRight') setI(p => Math.min(p + 1, steps.length - 1)); else if (e.key === 'ArrowLeft') setI(p => Math.max(p - 1, 0)); };
    window.addEventListener('keydown', onKey);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); window.removeEventListener('resize', measure); window.removeEventListener('keydown', onKey); };
  }, [i, step.sel, steps.length, onClose]);
  const next = () => last ? onClose() : setI(i + 1);
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const CW = Math.min(300, vw - 24);
  let callStyle = { top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: CW };
  if (rect) {
    const below = rect.bottom + 168 < vh;
    const cx = Math.min(Math.max(rect.left + rect.width / 2, CW / 2 + 12), vw - CW / 2 - 12);
    callStyle = below
      ? { top: rect.bottom + 16, left: cx, transform: 'translateX(-50%)', width: CW }
      : { top: Math.max(12, rect.top - 16), left: cx, transform: 'translate(-50%,-100%)', width: CW };
  }
  return (
    <div className="tg-root">
      {rect
        ? <div className="tg-hole" style={{ top: rect.top - 7, left: rect.left - 7, width: rect.width + 14, height: rect.height + 14 }} />
        : <div className="tg-dim" />}
      <div className="tg-call" style={callStyle}>
        <div className="tg-head"><span className="tg-ic">{step.ic}</span><span className="tg-h">{tr(step.h)}</span><span className="tg-count">{i + 1}/{steps.length}</span></div>
        <p className="tg-body">{tr(step.body)}</p>
        <div className="tg-nav">
          <button className="tg-skip" onClick={onClose}>{tr({ uz: "O'tkazib yuborish", ru: 'Пропустить' })}</button>
          <div className="tg-navr">
            {i > 0 && <button className="tg-btn ghost" onClick={() => setI(i - 1)} aria-label={tr({ uz: 'Oldingi', ru: 'Предыдущий' })}>←</button>}
            <button className="tg-btn go" onClick={next}>{last ? tr({ uz: 'Boshladik!', ru: 'Поехали!' }) : tr({ uz: 'Keyingisi →', ru: 'Дальше →' })}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== SCREEN 14b — GIT ISH-OQIMI GATE (DragDrop tartiblash) =====
// Bo'laklarni to'g'ri ketma-ketlikda joylash — «o'zim qildim» gate (S8 saboq: passiv→aktiv).
const GIT_FLOW_PIECES = [
  { id: 'edit',   label: { uz: "✏️ Faylni o'zgartir", ru: '✏️ Измени файл' } },
  { id: 'add',    label: 'git add' },
  { id: 'commit', label: 'git commit' },
  { id: 'push',   label: 'git push' },
  { id: 'github', label: { uz: "🌐 GitHub'da ko'rinadi", ru: '🌐 Виден на GitHub' } },
];
const ScreenGitFlow = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's14b', text: "Endi butun aylanani o'zingiz tartiblang. Fayl o'zgardi, keyin git add tanlaydi, git commit surat qilib saqlaydi, git push GitHub'ga yuboradi — va u yerda ko'rinadi. Bo'laklarni to'g'ri tartibda joylang.", trigger: 'on_mount', waits_for: null }]);
  const [done, setDone] = useState(!!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · tartib', ru: 'Практика · порядок' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bosqichlarni tartiblang', ru: 'Расставьте шаги по порядку' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Git ish-oqimini <span className="italic" style={{ color: T.accent }}>o'zingiz tartiblang</span></>, ru: <>Расставьте рабочий цикл Git <span className="italic" style={{ color: T.accent }}>сами</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Butun aylanani eslang: <b style={{ color: T.ink }}>o'zgartir → add → commit → push → GitHub</b>. Bo'laklarni to'g'ri tartibda joylang — sudrab yoki bosib.</>, ru: <>Вспомните весь цикл: <b style={{ color: T.ink }}>измени → add → commit → push → GitHub</b>. Расставьте блоки в правильном порядке — перетаскивая или нажимая.</> })}</Mentor>
        <div className="sk-buildbox">
          <DragDropOrder items={GIT_FLOW_PIECES} hints={[{ uz: "ish shu qadamdan boshlanadi", ru: 'работа начинается с этого шага' }, { uz: "o'zgarishni saqlashga tanlash", ru: 'выбрать изменение для сохранения' }, { uz: "surat qilib saqlash", ru: 'сохранить как снимок' }, { uz: "bulutga yuborish", ru: 'отправить в облако' }, { uz: "natijada bulutda ko'rinadi", ru: 'в итоге виден в облаке' }]} onSolved={() => setDone(true)} />
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN FLASHCARDS — teglarni tez takrorlash (podiumdan keyin) =====
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 'sflash', text: "Darsni yakunlashdan oldin bugun o'rgangan Git atamalarini tez takrorlaymiz. Har kartada bir vazifa — qaysi atama yoki buyruq ekanini o'ylang, keyin kartani bosib tekshiring.", trigger: 'on_mount', waits_for: null }]);
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Atamalarni <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <>Быстро <span className="italic" style={{ color: T.accent }}>повторим</span> термины.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bugun o'rgangan Git atama va buyruqlarini takrorlaymiz. Har kartada bir vazifa — <b style={{ color: T.ink }}>qaysi atama</b> ekanini o'ylang, keyin kartani bosib tekshiring. <b style={{ color: T.ink }}>Bildim</b> yoki <b style={{ color: T.ink }}>Takrorlash</b> bilan baholang.</>, ru: <>Повторим термины и команды Git, которые вы сегодня выучили. На каждой карточке одно задание — подумайте, <b style={{ color: T.ink }}>какой это термин</b>, затем нажмите на карточку и проверьте. Оцените себя кнопками <b style={{ color: T.ink }}>Знаю</b> или <b style={{ color: T.ink }}>Повторить</b>.</> })}</Mentor>
        <div className="fc-center"><Flashcards cards={GIT_FLASHCARDS} /></div>
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
  const audio = useAudio([{ id: 's16', text: "Tabriklaymiz! Endi Git va GitHub sirini bilasiz: Git — kod uchun vaqt mashinasi, commit — saqlangan surat, tarix orqali istalgan nuqtaga qaytasiz, GitHub — kodning bulutdagi uyi va jamoa maydoni. push bilan yuborasiz, clone bilan birga ishlaysiz. Endi o'zingizning birinchi repongizni ochishga tayyorsiz!", trigger: 'on_mount', waits_for: null }]);
  const RECAP = [{ uz: 'Git — kod uchun vaqt mashinasi', ru: 'Git — машина времени для кода' }, { uz: 'commit — kodning saqlangan surati', ru: 'commit — сохранённый снимок кода' }, { uz: 'Tarix — istalgan nuqtaga qaytish', ru: 'История — возврат к любой точке' }, { uz: 'GitHub — kodning bulutdagi uyi', ru: 'GitHub — облачный дом кода' }, { uz: 'push / pull — bulut bilan aloqa', ru: 'push / pull — связь с облаком' }, { uz: 'clone — jamoa bilan birga ishlash', ru: 'clone — совместная работа с командой' }];
  const HOMEWORK = [{ b: { uz: "Ro'yxatdan o'ting", ru: 'Зарегистрируйтесь' }, t: { uz: '— github.com da bepul account oching', ru: '— откройте бесплатный аккаунт на github.com' } }, { b: { uz: 'Repo yarating', ru: 'Создайте репо' }, t: { uz: '— birinchi repository: mening-saytim', ru: '— первый repository: moy-sayt' } }, { b: { uz: 'commit qiling', ru: 'Сделайте commit' }, t: { uz: "— fayl qo'shib, izoh bilan saqlang", ru: '— добавьте файл и сохраните с комментарием' } }];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Git va GitHub darsi tugadi', ru: 'Урок Git и GitHub завершён' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Git va GitHub <span className="italic" style={{ color: T.accent }}>sirini</span> ochdingiz.</>, ru: <>Вы раскрыли <span className="italic" style={{ color: T.accent }}>секрет</span> Git и GitHub.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: "Tabriklaymiz! Endi kodingizni Git bilan boshqarib, GitHub'ga joylaysiz.", ru: 'Поздравляем! Теперь вы управляете кодом через Git и выкладываете его на GitHub.' }) : tr({ uz: "Yaxshi harakat! Bir-ikki joyni mustahkamlash uchun darsni qayta ko'ring.", ru: 'Хорошая попытка! Пересмотрите урок, чтобы закрепить пару мест.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
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
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>🔎 {tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: 'Bilimingizni amalda sinang:', ru: 'Проверьте знания на практике:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "GitHub'da birinchi repongizni yaratib, do'stlaringizga ulashing!", ru: 'Создайте на GitHub свой первый репозиторий и поделитесь с друзьями!' })}</p></div>
        </div>
        <div className="card ach-coll fade-up d3">
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
        </div>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
// Podium yorliqlari (scored indeks -> qisqa nom)
const Q_LABELS = { 4: { uz: "Git nima qiladi", ru: 'Что делает Git' }, 6: { uz: "commit nima", ru: 'Что такое commit' }, 10: 'git push', 13: { uz: "GitHub nega kerak", ru: 'Зачем нужен GitHub' }, 17: { uz: "commit buyrug'i yozish (yakuniy)", ru: 'Написать команду commit (финал)' } };

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

// ===== ⚡ CODESTRIKE (CoddyCamp jonli test arenasi — Git mavzusi) =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi Git tokenlari (checkpoint/vaqt mashinasi hissi)
const QZ_BG_SHAPES = [
  { ch: 'commit',  l: 6,  t: 18, s: 30, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: 'git add', l: 82, t: 12, s: 24, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: 'push',    l: 9,  t: 74, s: 30, c: 'rgba(255,110,70,0.15)',  d: 27, dl: 0.8 },
  { ch: '💾',      l: 78, t: 70, s: 34, c: 'rgba(203,173,255,0.5)',  d: 21, dl: 2.2 },
  { ch: 'main',    l: 46, t: 86, s: 28, c: 'rgba(120,235,175,0.13)', d: 25, dl: 1.1 },
  { ch: '📸',      l: 66, t: 24, s: 30, c: 'rgba(203,173,255,0.5)',  d: 17, dl: 0.4 },
  { ch: '.git',    l: 24, t: 36, s: 26, c: 'rgba(80,200,255,0.14)',  d: 20, dl: 1.9 },
  { ch: '🕰️',     l: 92, t: 46, s: 30, c: 'rgba(203,173,255,0.5)',  d: 24, dl: 1.3 },
  { ch: 'commit',  l: 2,  t: 46, s: 24, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: "Git asosan nima ish bajaradi?", ru: 'Чем в основном занимается Git?' }, opts: [{ uz: "Kod versiyalarini saqlab, orqaga qaytaradi", ru: 'Сохраняет версии кода и возвращает назад' }, { uz: "Kodni chiroyli ranglarga bo'yaydi", ru: 'Красиво раскрашивает код' }, { uz: "Internet tezligini oshiradi", ru: 'Ускоряет интернет' }, { uz: "Rasm va suratlarni tahrirlaydi", ru: 'Редактирует фото и картинки' }], correct: 0 },
  { q: { uz: "Kodning izoh bilan saqlangan nuqtasi nima deb ataladi?", ru: 'Как называется сохранённая с комментарием точка кода?' }, opts: [{ uz: "Brauzer", ru: 'Браузер' }, "commit", { uz: "Parol", ru: 'Пароль' }, { uz: "Domen", ru: 'Домен' }], correct: 1 },
  { q: { uz: "git push buyrug'i nima qiladi?", ru: 'Что делает команда git push?' }, opts: [{ uz: "Barcha kodni butunlay o'chiradi", ru: 'Полностью удаляет весь код' }, { uz: "Sahifaga yangi rang qo'shadi", ru: 'Добавляет странице новый цвет' }, { uz: "Lokal commit'larni bulutga yuboradi", ru: 'Отправляет локальные коммиты в облако' }, { uz: "Faylni printerda chop etadi", ru: 'Печатает файл на принтере' }], correct: 2 },
  { q: { uz: "GitHub asosan nima uchun kerak?", ru: 'Для чего в основном нужен GitHub?' }, opts: [{ uz: "Onlayn o'yinlar o'ynash uchun", ru: 'Для онлайн-игр' }, { uz: "Musiqa va video tinglash uchun", ru: 'Для музыки и видео' }, { uz: "Rasmlarni chiroyli tahrirlash", ru: 'Для красивой обработки картинок' }, { uz: "Kodni bulutda saqlash va birga ishlash", ru: 'Хранить код в облаке и работать вместе' }], correct: 3 },
  { q: { uz: "Git qanday tizim deb ataladi?", ru: 'Какой системой называют Git?' }, opts: [{ uz: "Versiya nazorati tizimi", ru: 'Система контроля версий' }, { uz: "Operatsion tizim (OS)", ru: 'Операционная система (ОС)' }, { uz: "Antivirus dasturi", ru: 'Антивирусная программа' }, { uz: "Internet brauzeri", ru: 'Интернет-браузер' }], correct: 0 },
  { q: { uz: "commit'da -m bayrog'i nima uchun?", ru: 'Зачем в commit нужен флаг -m?' }, opts: [{ uz: "Faylni o'chirish", ru: 'Удалить файл' }, { uz: "Izoh (xabar) yozish", ru: 'Написать комментарий (сообщение)' }, { uz: "Rang berish", ru: 'Задать цвет' }, { uz: "Internetga ulanish", ru: 'Подключиться к интернету' }], correct: 1 },
  { q: { uz: "To'g'ri commit buyrug'i qaysi?", ru: 'Какая команда commit написана верно?' }, opts: [{ uz: "git save 'matn'", ru: "git save 'tekst'" }, "commit push now", { uz: "git commit -m \"matn\"", ru: 'git commit -m "tekst"' }, { uz: "git upload -m matn", ru: 'git upload -m tekst' }], correct: 2 },
  { q: { uz: "Eski holatga qaytmoqchisiz. Nima yordam beradi?", ru: 'Хотите вернуться к старой версии. Что поможет?' }, opts: [{ uz: "Brauzer sahifasini yangilash", ru: 'Обновить страницу браузера' }, { uz: "Kompyuterni qayta o'chirish", ru: 'Перезагрузить компьютер' }, { uz: "Butunlay yangi fayl yaratish", ru: 'Создать совершенно новый файл' }, { uz: "Git tarixidagi oldingi commit", ru: 'Предыдущий коммит в истории Git' }], correct: 3 },
  { q: { uz: "Loyihaning GitHub'dagi joyi nima deb ataladi?", ru: 'Как называется место проекта на GitHub?' }, opts: [{ uz: "Repository (repozitoriy)", ru: 'Repository (репозиторий)' }, { uz: "Oddiy fayllar papkasi", ru: 'Обычная папка с файлами' }, { uz: "Maxfiy kirish paroli", ru: 'Секретный пароль для входа' }, { uz: "Sayt domen manzili", ru: 'Доменный адрес сайта' }], correct: 0 },
  { q: { uz: "Nega loyiha_final_ROST.html kabi ko'p nusxa yomon?", ru: 'Почему много копий вроде proekt_final_TOCHNO.html — это плохо?' }, opts: [{ uz: "Kompyuter tez ishlaydi", ru: 'Компьютер работает быстрее' }, { uz: "Chalkashlik ko'payadi", ru: 'Растёт путаница' }, { uz: "Internet tejaladi", ru: 'Экономится интернет' }, { uz: "Kod chiroyli bo'ladi", ru: 'Код становится красивее' }], correct: 1 },
  { q: { uz: "push qilgandan keyin commit'lar qayerda bo'ladi?", ru: 'Где будут коммиты после push?' }, opts: [{ uz: "Faqat mening kompyuterimda", ru: 'Только на моём компьютере' }, { uz: "O'chib ketadi", ru: 'Они исчезнут' }, { uz: "GitHub'da (bulutda) ham", ru: 'И на GitHub (в облаке)' }, { uz: "Qog'ozda", ru: 'На бумаге' }], correct: 2 },
  { q: { uz: "O'yinda commit nimaga to'g'ri keladi?", ru: 'Чему соответствует commit в игре?' }, opts: [{ uz: "Yangi o'yin sotib olish", ru: 'Купить новую игру' }, { uz: "O'yindan butunlay chiqish", ru: 'Совсем выйти из игры' }, { uz: "O'yin ovozini balandlatish", ru: 'Сделать звук игры громче' }, { uz: "Checkpoint (saqlash nuqtasi)", ru: 'Checkpoint (точка сохранения)' }], correct: 3 },
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

// 🎆 Arena jonli qatlami — canvas: suzuvchi uchqunlar + "web" chiziqlari + git tokenlari.
// reduced-motion: umuman ishlamaydi (matchMedia). L1 QzFX bilan bir xil, TOK git-mavzudan.
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['commit', 'push', 'git add', '💾', '📸', 'main', '.git'];
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
          <CsWordmark stats={false} />
          <h2 className="qz-h">{tr({ uz: 'Mustahkamlash Testi', ru: 'Тест на закрепление' })}</h2>
          <p className="qz-sub">{tr({ uz: <>{QUIZ_BANK.length} savol · har biriga {QUIZ_MS / 1000} soniya · tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!</>, ru: <>{QUIZ_BANK.length} вопросов · по {QUIZ_MS / 1000} секунд · чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают 🔥 бонус!</> })}</p>
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
                : <span className="qz-res-t">{my ? tr({ uz: "Xato — 0 ball. Keyingisida olasiz! 💪", ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Побыстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас: ${myRank + 1}-е место` })}</span>}
            </div>
          )}
          {!solo && (
            <div className="qz-board">
              <div className="qz-board-h">🏆 {tr({ uz: 'TOP-5', ru: 'ТОП-5' })}</div>
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

export default function GitLesson({ lang: langProp, onFinished }) {
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
  // 🃏 Flashcard jonli darsda FAQAT MENTORGA ko'rinadi (proyektorda jamoaviy takrorlash);
  // jonli o'quvchidan yashirin — sakrab o'tiladi. Mentor «Erkin qilish» qilgach ochiladi.
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
  const reset = () => { setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };

  // Javob kaliti: inline testlar + jang savollari (QUIZ_BANK'dan) — mentor ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  // 👋 Onboarding — rejim tanlangach bir marta (rolga qarab, localStorage'da eslab qolinadi)
  const [onboard, setOnboard] = useState(false);
  const onboardShownRef = useRef(false);
  const onboardRole = live.mode === 'mentor' ? 'mentor' : 'learner';
  useEffect(() => {
    if (live.mode !== 'choosing' && !onboardShownRef.current) {
      onboardShownRef.current = true;
      let show = true;
      try { if (localStorage.getItem('gitOnboarded_' + onboardRole)) show = false; } catch {}
      if (show) { const t = setTimeout(() => setOnboard(true), 500); return () => clearTimeout(t); } // sahifa chizilib bo'lsin
    }
  }, [live.mode, onboardRole]);
  const closeOnboard = () => { try { localStorage.setItem('gitOnboarded_' + onboardRole, '1'); } catch {} setOnboard(false); };
  // 🏅 Yakuniy ekranga yetganda: bitiruvchi nishoni
  useEffect(() => {
    if (screen === TOTAL_SCREENS - 1) earn('graduate');
  }, [screen]); // eslint-disable-line

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
      answers: SCREEN_META.map((s, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === 'function') onFinished(payload);
  };

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, ScreenGitFlow, Screen15, ScreenPodium, ScreenFlashcards, Screen16];
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
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

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

        .text-input, .prompt-input { width: 100%; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px,1.8vw,16px); font-weight: 500; padding: 11px 13px; border: none; border-radius: 12px; background: ${T.paper}; color: ${T.ink}; outline: none; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: box-shadow 0.2s; }
        .text-input:focus, .prompt-input:focus { box-shadow: 0 10px 22px -6px rgba(255,79,40,0.3), 0 0 0 1px rgba(255,79,40,0.2); }
        .prompt-input { font-family: 'Manrope'; }

        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12.5px,1.6vw,14.5px); line-height: 1.55; padding: clamp(12px,2.2vw,18px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .code-box .tg, .t-tag { color: ${CODE.tag}; }
        .ck.active .t-tag { color: #fff; }
        .t-cm, .cm { color: ${CODE.comment}; font-style: italic; }
        .t-title { color: ${CODE.comment}; font-style: italic; opacity: 0.85; }
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
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
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

        /* === LAYOUT === */
        .screen { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        /* === PROBLEM REVEAL === */
        .pr { display: flex; flex-direction: column; gap: 12px; }
        .mu-block { display: flex; flex-direction: column; gap: 14px; transition: opacity 0.35s, transform 0.35s; }
        .mu-block.leave { opacity: 0; transform: translateY(-8px); }
        .ps-line { display: flex; gap: 10px; align-items: flex-start; }
        .ps-badge { flex-shrink: 0; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 9px; border-radius: 6px; margin-top: 2px; }
        .ps-q { background: ${T.accentSoft}; color: ${T.accent}; }
        .ps-a { background: ${T.successSoft}; color: ${T.success}; }
        .ps-text { font-size: clamp(14px,1.7vw,16px); line-height: 1.5; color: ${T.ink}; }
        .solve-btn { align-self: flex-start; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,15px); padding: 10px 18px; border-radius: 10px; border: none; background: ${T.ink}; color: ${T.bg}; cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 16px -5px rgba(${T.shadowBase},0.3); }
        .solve-btn:hover:not(:disabled) { background: ${T.accent}; }
        .ye-solved, .ye-stack { display: flex; flex-direction: column; gap: 12px; }
        .mu-mini { opacity: 0.7; }
        .idea { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 6px 0; }
        .happy { font-size: 30px; animation: pop 0.5s ease-out; } .idea-bulb { font-size: 22px; animation: pop 0.5s ease-out 0.1s both; }
        @keyframes pop { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .pr-answer { animation: fade-step 0.4s ease-out; }

        .demo-swap { animation: fade-step 0.3s ease-out; }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }
        .dest { display: flex; align-items: center; gap: 14px; background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 14px 18px; }
        .dest-emoji { font-size: 28px; } .dest-title { font-weight: 700; color: ${T.ink}; margin: 0; font-size: clamp(15px,1.8vw,17px); } .dest-sub { color: ${T.ink2}; margin: 2px 0 0; font-size: clamp(13px,1.5vw,14px); }

        /* === RECIPE === */
        .recipe-list { display: flex; flex-direction: column; list-style: none; }
        .recipe-list li { display: flex; align-items: center; gap: 13px; padding: 11px 2px; border-bottom: 1px solid rgba(167,166,162,0.22); transition: all 0.3s; }
        .recipe-list li:last-child { border-bottom: none; }
        .recipe-num { width: 22px; height: 22px; border-radius: 50%; box-shadow: inset 0 0 0 2px ${T.ink3}; background: transparent; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; flex-shrink: 0; transition: all 0.3s; }
        .recipe-list li.on .recipe-num { box-shadow: inset 0 0 0 2px ${T.success}; background: ${T.success}; }
        .recipe-text { font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }

        /* === FLOW ARROW === */
        .flow-arrow { display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 0; }
        .flow-track { width: 2px; height: 10px; background: ${T.ink3}; position: relative; overflow: hidden; border-radius: 2px; }
        .flow-bead { position: absolute; top: -8px; left: -1px; width: 4px; height: 8px; background: ${T.accent}; border-radius: 2px; animation: bead 1.4s linear infinite; }
        @keyframes bead { from { top: -8px; } to { top: 18px; } }
        .flow-chevron { color: ${T.accent}; font-size: 11px; animation: chev 1.4s ease-in-out infinite; }
        @keyframes chev { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        .brauzer-step { display: flex; align-items: center; gap: 12px; background: ${T.paper}; border-radius: 12px; padding: 9px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); animation: fade-step 0.3s; }
        .brauzer-icon { font-size: 20px; } .brauzer-h { font-weight: 700; color: ${T.ink}; margin: 0; font-size: 14px; } .brauzer-sub { color: ${T.ink2}; margin: 1px 0 0; font-size: 12px; font-family: 'JetBrains Mono'; }

        /* === PROFILE CARD === */
        .profile-card { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; padding: 2px 0; animation: fade-step 0.3s; }
        .pf-ava { width: 44px; height: 44px; border-radius: 50%; background: ${T.accent}; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 20px; }
        .pf-name { font-family: 'Georgia, serif'; font-size: clamp(16px,2.2vw,19px); color: ${T.ink}; margin: 0; }
        .pf-bio { color: ${T.ink2}; margin: 0; font-size: 12.5px; }
        .pf-btn { margin-top: 3px; background: ${T.accent}; color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; cursor: default; }

        /* === BSKEL (skeleton anatomy) === */
        .bskel { display: flex; flex-direction: column; gap: 0; }
        .bskel-doctype, .bskel-html, .bskel-tab, .bskel-page { cursor: pointer; transition: all 0.2s; position: relative; }
        .bskel-doctype { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; padding: 6px 10px; border-radius: 8px 8px 0 0; background: ${T.bg}; }
        .bskel-html { border: 2px solid ${T.ink3}; border-radius: 0 8px 12px 12px; padding: 18px 10px 10px; background: ${T.paper}; }
        .bskel-htmllabel { position: absolute; top: -1px; left: 10px; transform: translateY(-50%); font-family: 'JetBrains Mono'; font-size: 10px; color: ${T.ink2}; background: ${T.paper}; padding: 0 6px; }
        .bskel-win { border-radius: 10px; overflow: hidden; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.18); }
        .bskel-tab { background: #f0eee8; padding: 8px 10px; display: flex; align-items: center; gap: 8px; }
        .bskel-dots { display: flex; gap: 4px; } .bskel-dots i { width: 8px; height: 8px; border-radius: 50%; background: ${T.ink3}; }
        .bskel-tabpill { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: #fff; padding: 3px 9px; border-radius: 5px; }
        .bskel-zone { margin-left: auto; font-family: 'JetBrains Mono'; font-size: 10px; color: ${T.ink3}; }
        .bskel-page { background: #fff; padding: 16px; min-height: 80px; }
        .bskel-ptitle { font-family: 'Georgia, serif'; font-size: 18px; color: ${T.ink}; margin: 0 0 4px; } .bskel-ptext { font-family: 'Georgia, serif'; color: ${T.ink2}; margin: 0; font-size: 13px; }
        .bskel-zone-b { position: absolute; bottom: 6px; right: 10px; }
        .bskel-doctype.active, .bskel-html.active, .bskel-tab.active, .bskel-page.active { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
        .bskel-tab.active, .bskel-page.active { background: ${T.accentSoft}; }
        .ck { cursor: pointer; border-radius: 4px; transition: all 0.15s; padding: 0 2px; }
        .ck:hover { background: rgba(255,255,255,0.08); }
        .ck.active { background: ${T.accent}; }
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-chip { font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 600; color: ${CODE.tag}; background: ${CODE.bg}; padding: 4px 9px; border-radius: 6px; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }

        /* === HUG (teg o'raydi) === */
        .hug-wrap { display: flex; justify-content: center; padding: 10px 0; }
        .hug { display: flex; align-items: stretch; gap: 0; transition: gap 0.4s; }
        .hug.on { gap: 4px; }
        .hug-item { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 12px 14px; cursor: pointer; border-radius: 10px; transition: all 0.2s; }
        .hug-tag { background: ${CODE.bg}; } .hug-content { background: ${T.accentSoft}; }
        .hug-item.active { box-shadow: 0 0 0 2px ${T.accent}; }
        .hug-code { font-family: 'JetBrains Mono'; font-weight: 700; font-size: clamp(15px,2vw,18px); }
        .hug-tag .hug-code { color: ${CODE.tag}; } .hug-content .hug-code { color: ${T.accent}; }
        .hug-slash { color: ${CODE.attr}; }
        .hug-lbl { font-family: 'JetBrains Mono'; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink3}; }
        .role-line { background: ${T.paper}; border-radius: 10px; padding: 12px 15px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); animation: fade-step 0.3s; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }
        .pv-h1 { font-family: 'Georgia, serif'; font-size: clamp(22px,3vw,30px); color: ${T.ink}; margin: 0; animation: fade-step 0.4s; }

        /* === LADDER (sarlavhalar) === */
        .ladder { display: flex; flex-direction: column; gap: 6px; }
        .hl-row { display: flex; align-items: center; gap: 13px; padding: 9px 14px; border-radius: 10px; cursor: pointer; transition: all 0.18s; background: ${T.paper}; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.12); }
        .hl-row:hover { box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.2); }
        .hl-row.on { box-shadow: 0 0 0 2px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.25); background: ${T.accentSoft}; }
        .hl-chip { font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 600; color: ${CODE.tag}; background: ${CODE.bg}; padding: 3px 8px; border-radius: 5px; flex-shrink: 0; }
        .hl-text { font-family: 'Georgia, serif'; font-weight: 700; color: ${T.ink}; line-height: 1; }
        .hl-tag { margin-left: auto; font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; background: ${T.accentSoft}; padding: 3px 9px; border-radius: 99px; }
        .hl-note { background: ${T.paper}; border-radius: 10px; padding: 12px 15px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); animation: fade-step 0.3s; }
        .hl-note .nb { font-family: 'JetBrains Mono'; font-weight: 700; color: ${T.accent}; }
        .hl-hint { padding: 10px 2px; }

        /* === MCARD (matn) === */
        .mcard { background: ${T.paper}; border-radius: 14px; padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .mc-head { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .mc-chip { font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 600; color: ${CODE.tag}; background: ${CODE.bg}; padding: 3px 9px; border-radius: 5px; }
        .mc-label { font-weight: 600; font-size: 13px; color: ${T.ink2}; }
        .mc-demo { font-family: 'Georgia, serif'; font-size: clamp(18px,2.5vw,24px); color: ${T.ink}; padding: 8px 0; }
        .w-anim { display: inline-block; transition: all 0.3s; } .w-bold { font-weight: 800; } .w-ital { font-style: italic; }
        .mc-btn { align-self: flex-start; font-family: 'Manrope'; font-weight: 600; font-size: 13px; padding: 8px 15px; border-radius: 9px; border: none; background: ${T.bg}; color: ${T.ink}; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 7px; }
        .mc-btn:hover { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .mc-btn.on { background: ${T.accent}; color: #fff; }
        .mc-btn .ic { font-family: 'Georgia, serif'; }
        .mc-code { font-family: 'JetBrains Mono'; font-size: 12px; color: ${T.ink2}; background: ${T.bg}; padding: 8px 11px; border-radius: 8px; margin: 0; } .mc-code .tg { color: ${CODE.tag}; }

        /* === WHEN / LISTS === */
        .when { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 10px; padding: 11px 15px; }
        .site-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid ${T.ink3}40; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .site-brand { display: inline-flex; align-items: center; gap: 8px; } .site-logo { width: 22px; height: 22px; border-radius: 6px; background: ${T.accent}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 13px; } .site-name { font-family: 'Manrope'; font-weight: 700; color: ${T.ink}; font-size: 14px; }
        .site-nav { display: inline-flex; gap: 11px; font-family: 'Manrope'; font-size: 12px; color: ${T.ink2}; }
        .site-sec { } .site-h3 { font-family: 'Georgia, serif'; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0 0 8px; }
        .site-list { font-family: 'Georgia, serif'; color: ${T.ink}; font-size: clamp(14px,1.8vw,16px); }
        .site-list ul, .site-list ol { padding-left: 24px; } .site-list li { display: list-item; margin: 3px 0; }

        /* === WEB (graf) === */
        .web { position: relative; height: 150px; background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .web-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .web-node { position: absolute; transform: translate(-50%,-50%); font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.ink}; background: ${T.bg}; padding: 5px 10px; border-radius: 99px; cursor: pointer; transition: all 0.2s; white-space: nowrap; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.25); }
        .web-node:hover { transform: translate(-50%,-50%) scale(1.06); }
        .web-node.on { background: ${T.accent}; color: #fff; }
        .web-cap { font-size: clamp(12px,1.5vw,13px); color: ${T.ink2}; margin: 0; line-height: 1.5; }

        .bp-url { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; display: flex; align-items: center; gap: 6px; animation: fade-step 0.3s; } .lock { color: ${T.success}; font-size: 8px; }
        .pg-in { animation: pg-in 0.35s ease-out; } @keyframes pg-in { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
        .site-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; flex-wrap: wrap; gap: 4px; }
        .site-wordmark { font-family: 'Georgia, serif'; font-weight: 700; color: ${T.ink}; font-size: 14px; } .site-tag { font-size: 10px; color: ${T.ink3}; font-family: 'JetBrains Mono'; }
        .pg-h1 { font-family: 'Georgia, serif'; font-size: clamp(20px,2.8vw,26px); color: ${T.ink}; margin: 0 0 7px; } .pg-body { font-family: 'Georgia, serif'; color: ${T.ink2}; font-size: clamp(13px,1.7vw,15px); line-height: 1.55; margin: 0 0 12px; }
        .pg-divider { height: 1px; background: ${T.ink3}30; margin: 0 0 12px; }
        .pg-linklabel { font-family: 'Manrope'; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${T.ink3}; margin: 0 0 8px; }
        .pg-links { display: flex; flex-direction: column; gap: 7px; margin-bottom: 12px; }
        .pg-a { font-family: 'Georgia, serif'; color: ${T.link}; text-decoration: underline; cursor: pointer; font-size: clamp(13px,1.7vw,15px); display: inline-flex; align-items: center; gap: 5px; transition: gap 0.2s; } .pg-a:hover { gap: 9px; } .arr { font-size: 12px; }
        .pg-foot { font-size: 10px; color: ${T.ink3}; margin: 0; font-family: 'Manrope'; }

        .codecard { background: ${T.paper}; border-radius: 12px; padding: 12px 14px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); animation: fade-step 0.3s ease-out forwards; }
        .codecard-top { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; margin: 0 0 8px; display: flex; align-items: center; gap: 7px; } .dotf { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .codeblock { background: ${CODE.bg}; border-radius: 8px; padding: 11px 13px; margin: 0; font-family: 'JetBrains Mono'; font-size: 12px; line-height: 1.6; display: flex; flex-direction: column; } .codeblock .ln { white-space: pre-wrap; word-break: break-word; } .codeblock .tg { color: ${CODE.tag}; }
        .codecap { font-size: 12px; color: ${T.ink2}; margin: 8px 0 0; } .mn { font-family: 'JetBrains Mono'; color: ${T.accent}; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 4px 7px; border-radius: 6px; transition: all 0.15s; } .ai-line:hover { background: rgba(255,255,255,0.06); } .ai-line .tg { color: ${CODE.tag}; }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

        /* === BUILDER === */
        .prompt-row { display: flex; gap: 8px; }
        .prompt-btn { flex-shrink: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; padding: 0 18px; border-radius: 12px; border: none; background: ${T.accent}; color: #fff; cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); } .prompt-btn:hover:not(:disabled) { box-shadow: 0 10px 22px -5px rgba(255,79,40,0.55); } .prompt-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 7px 12px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; } .gt { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.accent}; }
        .gen-line { color: ${CODE.attr}; } .gen-line::after { content: '…'; animation: blink 1s steps(3) infinite; } @keyframes blink { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
        .el-in { animation: fade-step 0.35s ease-out; }

        /* === YOZISH (Screen7) === */
        .yz-card { background: ${T.paper}; border-radius: 14px; padding: 18px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 10px; }
        .yz-line { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-family: 'JetBrains Mono'; font-size: clamp(15px,2vw,18px); }
        .yz-code { color: ${T.ink}; } .yz-code .t-tag { color: ${CODE.tag}; } .yz-done { animation: fade-step 0.3s; }
        .yz-input { font-family: 'JetBrains Mono'; font-size: clamp(15px,2vw,18px); padding: 5px 10px; border: none; border-radius: 8px; background: ${T.bg}; color: ${T.ink}; outline: none; width: 150px; box-shadow: inset 0 0 0 1.5px ${T.accent}40; } .yz-input:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .yz-hint { font-size: 12.5px; color: ${T.ink2}; margin: 0; } .yz-ok { font-size: 13px; color: ${T.success}; font-weight: 600; margin: 0; animation: fade-step 0.3s; } .yz-placeholder { color: ${T.ink3}; font-style: italic; margin: 0; font-family: 'Georgia, serif'; }

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
        /* ============ v16 QO'SHIMCHA CSS ============ */
        /* SCREEN 2 — Hayotdan misol (2-bosqich) */
        .frame-col { display: flex; flex-direction: column; gap: 14px; }
        .savo { gap: 12px; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }
        .pz-head { display: flex; align-items: flex-start; gap: 12px; }
        .pz-emoji { font-size: 26px; line-height: 1; flex-shrink: 0; }
        .pz-title { font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.accent}; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 3px; }
        .pz-sub { font-size: clamp(13px,1.6vw,15px); color: ${T.ink2}; line-height: 1.45; margin: 0; }
        .pz-flow { display: flex; align-items: flex-start; justify-content: center; gap: 4px; overflow-x: auto; padding: 4px 2px 2px; }
        .pz-step { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 88px; flex: 0 0 auto; padding: 10px 6px; border-radius: 12px; transition: background 0.3s; }
        .pz-step.on { background: ${T.successSoft}; }
        .pz-step.active { background: ${T.accentSoft}; }
        .pz-ic { width: 34px; height: 34px; border-radius: 50%; box-shadow: inset 0 0 0 2px ${T.ink3}; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 14px; color: ${T.ink2}; background: transparent; transition: all 0.3s; }
        .pz-step.on .pz-ic { box-shadow: inset 0 0 0 2px ${T.success}; background: ${T.success}; color: #fff; }
        .pz-step.active .pz-ic { box-shadow: inset 0 0 0 2px ${T.accent}; color: ${T.accent}; }
        .pz-lbl { font-size: 11.5px; text-align: center; color: ${T.ink2}; line-height: 1.25; font-weight: 500; }
        .pz-step.on .pz-lbl { color: ${T.ink}; }
        .pz-arrow { align-self: center; margin-top: 16px; color: ${T.ink3}; font-size: 15px; flex: 0 0 auto; transition: color 0.3s; }
        .pz-arrow.on { color: ${T.success}; }
        /* SCREEN 6 — Teg (qo'shtirnoq modeli) */
        .pv-plain { font-family: 'Georgia, serif'; font-size: 14px; color: ${T.ink3}; margin: 0; }
        .tegbuild-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 22px 0 14px; }
        .tegbuild { display: flex; align-items: center; justify-content: center; gap: 5px; min-height: 78px; }
        .tegbuild.on { gap: 4px; }
        .tb-chip { display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 13px 16px; border-radius: 11px; transition: transform 0.55s cubic-bezier(.34,1.25,.4,1), opacity 0.4s; cursor: default; }
        .tegbuild.on .tb-chip { cursor: pointer; }
        .tb-tag { background: ${CODE.bg}; } .tb-content { background: ${T.accentSoft}; }
        .tb-code { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(16px,2.4vw,20px); }
        .tb-tag .tb-code { color: ${CODE.tag}; } .tb-content .tb-code { color: ${T.accent}; }
        .tb-slash { color: ${CODE.attr}; display: inline-block; }
        .tegbuild.on .tb-slash { animation: slashpulse 1.3s ease-in-out 0.55s 2; }
        @keyframes slashpulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.45); } }
        .tb-lbl { font-family: 'JetBrains Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 0.06em; color: ${T.ink3}; transition: opacity 0.3s 0.35s; }
        .tb-open.hide { transform: translateX(-64px) scale(0.82); opacity: 0; }
        .tb-close.hide { transform: translateX(64px) scale(0.82); opacity: 0; }
        .tegbuild:not(.on) .tb-tag .tb-lbl { opacity: 0; }
        .tb-chip.active { box-shadow: 0 0 0 2px ${T.accent}; }
        .tb-bracket { display: flex; flex-direction: column; align-items: center; gap: 4px; opacity: 0; transition: opacity 0.3s 0.5s; }
        .tegbuild-wrap.on .tb-bracket { opacity: 1; }
        .tb-brace { width: 150px; max-width: 70%; height: 9px; border: 1.5px solid ${T.ink3}; border-top: none; border-radius: 0 0 9px 9px; }
        .tb-brace-lbl { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; }
        .slash-callout { display: flex; align-items: center; gap: 13px; background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .slash-big { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 30px; color: ${T.accent}; line-height: 1; flex-shrink: 0; }
        /* SCREEN 8 — Sarlavhalar (gazeta -> teglar qo'nadi) */
        .news-card { display: flex; flex-direction: column; }
        .news-line { display: flex; align-items: center; gap: 12px; padding: 9px 10px; margin: 0 -10px; border-radius: 10px; transition: background 0.4s ease; }
        .news-card.tagged .news-line { background: ${T.bg}; }
        .news-card.tagged .news-headline { background: ${T.accentSoft}; }
        .news-line > h3, .news-line > p { flex: 1; min-width: 0; }
        .tag-badge { flex-shrink: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: ${CODE.tag}; background: ${CODE.bg}; padding: 4px 9px; border-radius: 6px; opacity: 0; transform: translateX(10px) scale(0.9); transition: opacity 0.4s ease, transform 0.45s cubic-bezier(.34,1.25,.4,1); }
        .news-card.tagged .tag-badge { opacity: 1; transform: none; }
        .tag-badge.accent { color: #fff; background: ${T.accent}; box-shadow: 0 4px 12px -4px rgba(255,79,40,0.5); }
        .tag-badge.soft { color: ${T.ink2}; background: ${T.bg}; box-shadow: inset 0 0 0 1px ${T.ink3}55; }
        .news-hint { font-family: 'Manrope'; font-size: 12.5px; color: ${T.ink2}; margin: 12px 0 0; }
        /* Avtoscroll */
        .stage-content { scroll-behavior: smooth; }
        /* MOBIL: yig'iladigan Mentor (skrollni kamaytirish) */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* ============ INTERNET DARS CSS ============ */
        .urlbar { display: flex; align-items: center; gap: 8px; background: ${T.paper}; border-radius: 12px; padding: 8px 8px 8px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); }
        .urlbar-lock { font-size: 13px; flex-shrink: 0; }
        .urlbar-text { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; flex: 1; min-width: 0; }
        .urlbar-input { flex: 1; min-width: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px,1.8vw,16px); border: none; background: transparent; color: ${T.ink}; outline: none; }
        .urlbar-go { flex-shrink: 0; font-family: 'Manrope'; font-weight: 700; font-size: 13px; padding: 8px 16px; border-radius: 9px; border: none; background: ${T.accent}; color: #fff; cursor: pointer; transition: all 0.2s; }
        .urlbar-go:hover:not(:disabled) { box-shadow: 0 6px 14px -4px rgba(255,79,40,0.5); }
        .urlbar-go:disabled { opacity: 0.5; cursor: not-allowed; }
        .urlbar-err { box-shadow: 0 0 0 2px ${T.accent}, 0 6px 16px -6px rgba(255,79,40,0.3); }
        .dompill { display: inline-flex; align-self: center; border-radius: 10px; overflow: hidden; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.18); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(15px,2.2vw,19px); }
        .dpart { padding: 10px 14px; }
        .dpart-name { background: ${T.accentSoft}; color: ${T.accent}; }
        .dpart-tld { background: #E2F1F7; color: ${T.blue}; }
        .dlabels { display: flex; justify-content: center; gap: 18px; font-size: 12px; color: ${T.ink2}; font-family: 'Manrope'; }
        .ipbox { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(16px,2.4vw,20px); color: ${T.blue}; background: #E2F1F7; padding: 10px 16px; border-radius: 10px; }
        .ipbox-sm { font-size: clamp(13px,1.7vw,15px); padding: 5px 10px; }
        .anabox { display: flex; align-items: center; justify-content: center; gap: 12px; background: ${T.paper}; border-radius: 12px; padding: 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); text-align: center; }
        .ana-name { font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink}; }
        .ana-arr { font-family: 'JetBrains Mono'; font-weight: 700; color: ${T.accent}; font-size: 12px; flex-shrink: 0; }
        .ana-num { font-family: 'JetBrains Mono'; font-size: 12px; color: ${T.ink2}; }
        .dns-card { background: ${T.paper}; border-radius: 14px; padding: 14px 16px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 10px; }
        .dns-head { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .dns-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .dns-arr { font-family: 'JetBrains Mono'; font-weight: 700; color: ${T.accent}; }
        .cs { position: relative; display: flex; align-items: stretch; gap: 8px; background: ${T.paper}; border-radius: 14px; padding: 16px 12px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .cs-node { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; flex-shrink: 0; padding: 10px; border-radius: 12px; transition: all 0.3s; min-width: 80px; }
        .cs-node.cs-active { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .cs-node.cs-active .cs-ic { animation: csPop 0.45s cubic-bezier(.34,1.5,.5,1); }
        .cs-ic { font-size: 30px; }
        .cs-l { font-family: 'Manrope'; font-size: 11px; font-weight: 600; color: ${T.ink2}; text-align: center; line-height: 1.2; }
        @keyframes csPop { 0% { transform: scale(1); } 45% { transform: scale(1.28); } 100% { transform: scale(1); } }
        .cs-wire { position: relative; flex: 1; align-self: stretch; min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; min-height: 70px; }
        .cs-wire::before { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 3px; transform: translateY(-50%); border-radius: 2px; background: repeating-linear-gradient(90deg, rgba(167,166,162,0.55) 0 7px, transparent 7px 14px); }
        .cs-msg { position: relative; z-index: 2; font-family: 'JetBrains Mono'; font-size: 11px; padding: 5px 9px; border-radius: 7px; text-align: center; opacity: 0; transform: translateY(5px); transition: all 0.3s; box-shadow: 0 3px 9px -4px rgba(${T.shadowBase},0.3); }
        .cs-req { background: ${T.accentSoft}; color: ${T.accent}; }
        .cs-res { background: ${T.successSoft}; color: ${T.success}; }
        .cs-msg.on { opacity: 1; transform: none; }
        .cs-fly { position: absolute; z-index: 3; top: 50%; margin-top: -14px; width: 28px; height: 28px; border-radius: 8px; background: ${T.paper}; display: flex; align-items: center; justify-content: center; font-size: 15px; box-shadow: 0 5px 14px -3px rgba(${T.shadowBase},0.45), inset 0 0 0 1.5px ${T.accent}; }
        .cs-fly-r { animation: csFlyR 0.72s cubic-bezier(.5,0,.4,1) both; }
        .cs-fly-l { animation: csFlyL 0.72s cubic-bezier(.5,0,.4,1) both; }
        @keyframes csFlyR { 0% { left: 0; opacity: 0; transform: scale(0.5); } 18% { opacity: 1; transform: scale(1); } 82% { opacity: 1; transform: scale(1); } 100% { left: calc(100% - 28px); opacity: 0; transform: scale(0.5); } }
        @keyframes csFlyL { 0% { left: calc(100% - 28px); opacity: 0; transform: scale(0.5); } 18% { opacity: 1; transform: scale(1); } 82% { opacity: 1; transform: scale(1); } 100% { left: 0; opacity: 0; transform: scale(0.5); } }
        .jmini { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; background: ${T.paper}; border-radius: 12px; padding: 14px 12px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .jmini-node { display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .jmini-ic { font-size: 22px; }
        .jmini-l { font-family: 'Manrope'; font-size: 10px; font-weight: 600; color: ${T.ink2}; }
        .jmini-arr { color: ${T.accent}; font-weight: 700; }

        /* ============ GIT/GITHUB DARS CSS ============ */
        /* === 🏗️ MINORA QURUVCHI (Screen2) — sodda vertikal stack (Dizayn sayqallaydi) === */
        .twr-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .twr { display: flex; flex-direction: column-reverse; align-items: center; justify-content: flex-start; gap: 4px; width: 100%; min-height: 200px; padding: 12px 10px; border-radius: 12px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px rgba(167,166,162,0.28); }
        .twr-block { position: relative; width: clamp(80px,58%,150px); height: 26px; border-radius: 7px; background: linear-gradient(180deg, #FF8A3D, ${T.accent}); box-shadow: 0 4px 10px -4px rgba(255,79,40,0.5), inset 0 1.5px 0 rgba(255,255,255,0.32); animation: twrPop 0.4s cubic-bezier(.34,1.45,.5,1); will-change: transform; }
        /* blok qo'shilishi — yuqoridan tushib joylashish spring'i (settle bounce bilan) */
        @keyframes twrPop { 0% { transform: translateY(-24px) scale(0.6); opacity: 0; } 55% { transform: translateY(2px) scale(1.09); opacity: 1; } 76% { transform: translateY(-1px) scale(0.97); } 100% { transform: none; opacity: 1; } }
        .twr-block.flag { background: ${T.successSoft}; box-shadow: 0 4px 10px -4px rgba(31,122,77,0.45), inset 0 0 0 2px ${T.success}; }
        .twr-flag { position: absolute; right: -22px; top: 50%; transform: translateY(-50%); font-size: 16px; }
        /* ===== 💥 MINORA QULASHI — darsning eng dramatik lahzasi =====
           1) butun minora beqarorlikdan silkinadi (twrShake), 2) bloklar KETMA-KET qulaydi:
           tepa avval, pastdagilar keyinroq (--fi stagger) — translateY+rotate+opacity bilan. */
        .twr.falling { animation: twrShake 0.42s cubic-bezier(.36,.07,.19,.97); transform-origin: bottom center; }
        @keyframes twrShake { 0%,100% { transform: translateX(0) rotate(0); } 12% { transform: translateX(-6px) rotate(-1deg); } 26% { transform: translateX(6px) rotate(1.2deg); } 40% { transform: translateX(-5px) rotate(-1deg); } 55% { transform: translateX(4px) rotate(.8deg); } 72% { transform: translateX(-2px) rotate(-.4deg); } 86% { transform: translateX(1px); } }
        .twr.falling .twr-block { animation: twrBlockFall 0.36s cubic-bezier(.55,.08,.9,.35) forwards; animation-delay: calc(var(--fi, 0) * 0.05s); will-change: transform, opacity; }
        .twr.falling .twr-block:nth-child(odd) { --fr: -19deg; }
        @keyframes twrBlockFall { 0% { transform: translateY(0) rotate(0); opacity: 1; } 22% { transform: translateY(-5px) rotate(-2deg); opacity: 1; } 100% { transform: translateY(135px) rotate(var(--fr, 17deg)); opacity: 0; } }
        /* ===== ⏪ QUTQARISH — vaqt-mashinasi tiklashi =====
           gRewind (blur+siljish) container'da; tiklangan bloklar yengil "yashil nafas" oladi. */
        .twr.rewinding { animation: gRewind 0.5s ease-out; }
        .twr.rewinding .twr-block { animation: twrBreathe 0.75s ease-out; }
        @keyframes twrBreathe { 0% { box-shadow: 0 4px 10px -4px rgba(31,122,77,0), inset 0 1.5px 0 rgba(255,255,255,0.32); } 45% { box-shadow: 0 0 0 4px rgba(31,122,77,0.22), 0 5px 16px -4px rgba(31,122,77,0.5), inset 0 1.5px 0 rgba(255,255,255,0.4); transform: scale(1.03); } 100% { box-shadow: 0 4px 10px -4px rgba(31,122,77,0), inset 0 1.5px 0 rgba(255,255,255,0.32); transform: none; } }
        /* reduced-motion: dramatik qulash/rewind o'rniga tinch opacity-only variant */
        @media (prefers-reduced-motion: reduce) {
          .twr.falling { animation: none; }
          .twr.falling .twr-block { animation: twrFadeOut 0.3s ease-out forwards; animation-delay: 0; }
          @keyframes twrFadeOut { to { opacity: 0; } }
          .twr.rewinding { animation: none; }
          .twr.rewinding .twr-block { animation: acu-fade 0.35s ease-out; }
        }
        .twr-empty { color: ${T.ink3}; font-style: italic; font-size: 13px; padding: 30px 0; text-align: center; }
        .twr-h { font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink2}; }
        .twr-h b { color: ${T.accent}; font-size: 16px; }
        .term { background: ${CODE.bg}; border-radius: 12px; padding: 14px 16px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); display: flex; flex-direction: column; gap: 5px; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.6vw,13.5px); line-height: 1.5; overflow-x: auto; }
        .term-row { white-space: pre-wrap; word-break: break-word; }
        .term-prompt { color: ${CODE.str}; } .term-cmd { color: ${CODE.attr}; } .term-out { color: ${CODE.punct}; } .term-err { color: ${CODE.tag}; } .term-ok { color: ${CODE.str}; }
        .gfile { display: flex; align-items: center; gap: 10px; background: ${T.paper}; border-radius: 11px; padding: 12px 15px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); font-family: 'JetBrains Mono', monospace; font-size: 14px; transition: all 0.3s; }
        .gfile-name { color: ${T.ink}; flex: 1; min-width: 0; }
        .gfile-status { font-family: 'Manrope'; font-weight: 700; font-size: 11px; padding: 4px 11px; border-radius: 99px; flex-shrink: 0; }
        .gst-mod { background: ${T.accentSoft}; color: ${T.accent}; } .gst-staged { background: #E2F1F7; color: ${T.blue}; } .gst-done { background: ${T.successSoft}; color: ${T.success}; }
        .gcommit { display: flex; align-items: flex-start; gap: 12px; background: ${T.paper}; border-radius: 11px; padding: 11px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.35s ease-out; }
        .gcommit-dot { width: 32px; height: 32px; border-radius: 50%; background: ${T.accentSoft}; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .gcommit-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
        .gcommit-msg { font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; color: ${T.ink}; }
        .gcommit-meta { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; }
        .gtl { display: flex; flex-direction: column; }
        .gtl-node { display: flex; gap: 13px; cursor: pointer; }
        .gtl-rail { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
        .gtl-dot { width: 16px; height: 16px; border-radius: 50%; box-shadow: inset 0 0 0 3px ${T.paper}, 0 0 0 2px ${T.ink3}; background: ${T.ink3}; transition: all 0.25s; margin-top: 5px; }
        .gtl-line { width: 2px; flex: 1; min-height: 20px; background: rgba(167,166,162,0.35); }
        .gtl-node.on .gtl-dot { box-shadow: inset 0 0 0 3px ${T.paper}, 0 0 0 2px ${T.accent}; background: ${T.accent}; }
        .gtl-card { flex: 1; min-width: 0; padding: 9px 13px; border-radius: 10px; background: ${T.paper}; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); margin-bottom: 8px; transition: all 0.2s; }
        .gtl-node.on .gtl-card { box-shadow: 0 0 0 2px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.25); background: ${T.accentSoft}; }
        .gtl-msg { font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink}; }
        .gtl-hash { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; }
        .repo { background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
        .repo-top { display: flex; align-items: center; gap: 8px; padding: 12px 15px; border-bottom: 1px solid rgba(167,166,162,0.25); font-family: 'JetBrains Mono'; font-size: 13px; color: ${T.ink}; }
        .repo-row { display: flex; align-items: center; gap: 10px; padding: 11px 15px; cursor: pointer; transition: background 0.2s; font-family: 'JetBrains Mono'; font-size: 13px; color: ${T.ink2}; }
        .repo-row:hover { background: ${T.bg}; }
        .repo-row.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 3px 0 0 ${T.accent}; }
        /* tap-hint affordance (L1 bilan bir xil): bosilmagan qatorlar "meni bos" deb pulslaydi; ochilgani ✓ */
        @keyframes tap-hint { 0%, 100% { box-shadow: inset 0 0 0 0 rgba(255,79,40,0); } 50% { box-shadow: inset 0 0 0 2px rgba(255,79,40,0.42); } }
        .repo-row:not(.on):not(.seen) { animation: tap-hint 1.8s ease-in-out infinite; }
        .repo-row.seen:not(.on)::after { content: '✓'; margin-left: auto; color: ${T.success}; font-weight: 800; font-size: 12px; }
        @media (prefers-reduced-motion: reduce) { .repo-row:not(.on):not(.seen) { animation: none; } }
        /* === animatsiya yaxshilashlari (page 2,3,4,8,12) === */
        .jmini-node { animation: jpop 0.45s backwards cubic-bezier(.34,1.5,.5,1); }
        .jmini-arr { animation: jflow 1.8s ease-in-out infinite; }
        @keyframes jpop { from { opacity: 0; transform: scale(0.55); } to { opacity: 1; transform: scale(1); } }
        @keyframes jflow { 0%,100% { opacity: 0.4; transform: translateX(0); } 50% { opacity: 1; transform: translateX(2px); } }
        .gcommit-dot { animation: snapPop 0.5s cubic-bezier(.34,1.5,.5,1); }
        @keyframes snapPop { 0% { transform: scale(0); } 55% { transform: scale(1.3); box-shadow: 0 0 0 6px rgba(255,79,40,0.18); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,79,40,0); } }
        .gtl-node.on .gtl-dot { animation: dotPulse 0.55s cubic-bezier(.34,1.5,.5,1); }
        @keyframes dotPulse { 0% { transform: scale(1); } 50% { transform: scale(1.45); } 100% { transform: scale(1); } }
        .gcode-rewind { animation: gRewind 0.5s ease-out; }
        @keyframes gRewind { 0% { opacity: 0; transform: translateX(-12px); filter: blur(1.5px); } 100% { opacity: 1; transform: none; filter: none; } }


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

        /* ===== ⚡ CODESTRIKE — CTA (dars ichida) ===== */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; background: linear-gradient(135deg, #FFF3EA, #FFE7DC); border: 1px solid #F3D9CC; border-radius: 20px; padding: clamp(16px,2.4vw,22px) clamp(18px,2.6vw,26px); box-shadow: 0 16px 40px -18px rgba(255,79,40,0.28); }
        .qz-cta-txt { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 3px; }
        .qz-cta-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(16px,2.2vw,20px); color: #121826; }
        .qz-cta-s { font-family: 'Manrope'; font-weight: 500; font-size: 13px; color: #525A6B; }
        .qz-cta-btn { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border: none; border-radius: 14px; padding: 13px 24px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 12px 24px -8px rgba(255,79,40,0.6); transition: transform 0.2s; }
        .qz-cta-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.03); }
        .qz-cta-btn:disabled { background: #E9E6DF; color: #98A0B4; cursor: default; box-shadow: none; }
        .qz-cta.ready .qz-cta-btn { animation: qz-pulse 1.1s ease-in-out infinite; }
        @keyframes qz-pulse { 0%,100% { transform: scale(1); box-shadow: 0 8px 22px -8px rgba(255,79,40,0.7); } 50% { transform: scale(1.06); box-shadow: 0 10px 30px -6px rgba(255,79,40,0.95); } }

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

        /* === 🧲 DRAG&DROP (reusable) === */
        .sk-buildbox { display: flex; flex-direction: column; animation: sk-swapin 0.5s cubic-bezier(.34,1.3,.4,1); }
        @keyframes sk-swapin { from { opacity: 0; transform: translateY(12px) scale(0.96); } to { opacity: 1; transform: none; } }
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

        /* === 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI === */
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

        /* === Jonli panel (LiveBadge) — xira turadi, ustiga borilganda tiniqlashadi (kontentni to'smaydi) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* === 👋 ONBOARDING — coach-mark spotlight tur === */
        .tg-root { position: fixed; inset: 0; z-index: 10300; animation: fade-step 0.2s ease-out; }
        .tg-dim { position: absolute; inset: 0; background: rgba(10,8,14,0.6); }
        .tg-hole { position: absolute; border-radius: 12px; box-shadow: 0 0 0 9999px rgba(10,8,14,0.6), 0 0 0 3px #fff, 0 0 26px 5px rgba(255,201,77,0.55); pointer-events: none; transition: top 0.35s cubic-bezier(.4,0,.2,1), left 0.35s cubic-bezier(.4,0,.2,1), width 0.35s cubic-bezier(.4,0,.2,1), height 0.35s cubic-bezier(.4,0,.2,1); }
        .tg-call { position: absolute; z-index: 2; background: ${T.paper}; border-radius: 16px; padding: 14px 16px 12px; box-shadow: 0 22px 54px -16px rgba(0,0,0,0.55); display: flex; flex-direction: column; gap: 8px; animation: tg-pop 0.25s ease-out; transition: top 0.3s cubic-bezier(.4,0,.2,1), left 0.3s cubic-bezier(.4,0,.2,1); }
        @keyframes tg-pop { from { opacity: 0; } }
        .tg-head { display: flex; align-items: center; gap: 8px; }
        .tg-ic { font-size: 20px; line-height: 1; }
        .tg-h { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 15px; color: ${T.ink}; flex: 1; }
        .tg-count { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: #fff; background: ${T.accent}; border-radius: 99px; padding: 2px 8px; }
        .tg-body { font-family: 'Manrope', sans-serif; font-size: 14px; line-height: 1.5; color: ${T.ink2}; margin: 0; }
        .tg-body b { color: ${T.ink}; }
        .tg-nav { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 2px; }
        .tg-skip { background: none; border: none; color: ${T.ink3}; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600; cursor: pointer; padding: 6px 2px; }
        .tg-skip:hover { color: ${T.accent}; }
        .tg-navr { display: flex; align-items: center; gap: 8px; }
        .tg-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; border: none; border-radius: 11px; padding: 9px 16px; cursor: pointer; transition: all 0.16s; }
        .tg-btn.go { background: linear-gradient(135deg,${T.accent},#FF8A3D); color: #fff; box-shadow: 0 8px 20px -6px rgba(255,79,40,0.55); }
        .tg-btn.go:hover { transform: translateY(-1px); }
        .tg-btn.ghost { background: ${T.bg}; color: ${T.ink2}; padding: 9px 12px; }
        .tg-btn.ghost:hover { color: ${T.ink}; }

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
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(255,79,40,0.32)); }

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
              <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {onboard && <TourGuide role={onboardRole} onClose={closeOnboard} />}
            </>
          )}
        </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>
  );
}