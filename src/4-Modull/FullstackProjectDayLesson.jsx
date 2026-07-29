import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// MA'LUMOT VA BACKEND MODULI · PRAKTIKA 3 — LOYIHA KUNI: AVTOSTOYANKA (React + Node + PostgreSQL) — PLATFORM STANDARD v16 (AUDIOSIZ)
// O'RNI: 4-Modul, "Auth va .env" darsidan KEYIN. Fullstack loyiha kuni — hammasini birlashtiramiz.
//        O'quvchi biladi: Express+pg CRUD (P1), fetch/loading/error/CORS (P2), API/Postman, React.
// Mavzu: AvtoStoyanka — QOROVUL (admin) uchun panel. Joylar to'ri 🟩 bo'sh / 🟥 band. Mashina kiradi/chiqadi, tolov 10 000.
// YANGI: ikki jadval BOG'LANISHI (joylar ◄ joy_id sessiyalar, FK + JOIN) — 32-dars amalda. + PM/UX: foydalanuvchi = qorovul.
// HALQA: ME'MOR (sxema+bog'lanish chizadi) → REJISSYOR (AI'ga endpoint) → NAZORATCHI (panelda sinaydi).
// PEDAGOGIKA: PM tomondan o'ylash (qorovul nimani ko'rishi kerak), vizual his qilish. "sehr" yo'q. AUDIOSIZ. Sarlavhalar = qiziqarli savol.
// SIFAT: javoblar aralashgan (placeCorrect — to'g'ri javob 1-o'rinda emas), har amalda mobil avtoscroll, mentor mobil yig'iladi.
// Yakuniy ekran (s16): mock VS Code — JOIN ON shartini yozish (sessiyalar.joy_id = joylar.id).
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
      const m = String(e?.message || '');
      setJoinError(/ism|band|kod|dars|belgi/i.test(m) ? m : tr({ uz: "Ulanib bo'lmadi. Internetni tekshiring.", ru: 'Не удалось подключиться. Проверьте интернет.' }));
    }
    finally { setBusy(false); }
  }, [lessonId]);

  const selfStudy = useCallback(() => { setMode('self'); liveStore(lessonId, { mode: 'self' }); }, [lessonId]);
  const reportScreen = useCallback((idx) => { if (mode === 'mentor' && pin) liveRpc('advance_session', { p_pin: pin, p_token: tokenRef.current, p_screen: idx }).catch(() => {}); }, [mode, pin]);
  const endSession = useCallback(() => { if (mode === 'mentor' && pin) { liveRpc('end_session', { p_pin: pin, p_token: tokenRef.current }).catch(() => {}); setEnded(true); } }, [mode, pin]);

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

  const quizControl = useCallback(async (state, q) => {
    if (mode !== 'mentor' || !pin) throw new Error('mentor emas');
    await liveRpc('quiz_control', { p_pin: pin, p_token: tokenRef.current, p_state: state, p_q: q ?? -1 });
    setQuiz({ state, q: q ?? -1 });
  }, [mode, pin]);

  const mentorReveal = useCallback((screenIdx) => {
    if (mode !== 'mentor' || !pin) return;
    setRevealScreen(screenIdx);
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
  const [nick, setNick] = useState(() => nickRead());
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
    if (!live.connected) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot('#FFD380')} /> {tr({ uz: '🔄 Qayta ulanmoqda…', ru: '🔄 Переподключение…' })}</div>;
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

const LESSON_META = { lessonId: 'fullstack-projectday-p3-v18', lessonTitle: { uz: 'Praktika: Loyiha kuni — AvtoStoyanka', ru: 'Практика: Проектный день — AvtoStoyanka' } };
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'p1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9b', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'p2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'p3',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's16', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'p4',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'spodium', type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',  type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's17', type: 'summary',     template: 'custom',   scored: false, scope: null }
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
          <div className="ach-pop-h">🏅 {tr({ uz: 'Badges', ru: 'Награды' })} — {count}/{total}</div>
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
    const tgt = e.target;
    if (tgt && tgt.closest && tgt.closest('.mentor')) return;
    setMCollapsed(true);
    const isControl = tgt && tgt.closest && tgt.closest('button, input, a, .vcard, .option, .hook-option, .spot');
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
const NavNext = ({ disabled, label, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  const lbl = label === undefined ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(label);
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
    title: { uz: "Baza — joylar + BOOLEAN + rang", ru: 'База — joylar + BOOLEAN + цвет' },
    cards: [
      { ic: "🗄️", h: { uz: "joylar jadvali — har joy bitta qator", ru: 'таблица joylar — каждое место одна строка' }, body: { uz: <>Panel ortida <b>joylar</b> jadvali turadi: har parking joyi bir qator (id, raqam, bandmi). Bu — panel ko'rsatadigan ma'lumot manbai.</>, ru: <>За панелью стоит таблица <b>joylar</b>: каждое парковочное место — одна строка (id, raqam, bandmi). Это источник данных, которые показывает панель.</> }, vis: <RcFlow items={["joylar", "bandmi", { uz: 'rang', ru: 'цвет' }]} /> },
      { ic: "✅", h: "bandmi = BOOLEAN (true/false)", body: { uz: <>Joy bo'sh yoki bandligi — <b>bandmi BOOLEAN</b> ustunida: false 🟩 (bo'sh), true 🟥 (band). Bu ha/yo'q qiymati.</>, ru: <>Свободно место или занято — хранится в столбце <b>bandmi BOOLEAN</b>: false 🟩 (свободно), true 🟥 (занято). Это значение «да/нет».</> } },
      { ic: "🎨", h: { uz: "Rang bandmi'dan chiqadi", ru: 'Цвет получается из bandmi' }, body: { uz: <>Panelning yashil/qizil rangi to'g'ridan-to'g'ri <b>bandmi</b> qiymatidan hisoblanadi — qorovul o'qimasdan holatni ko'radi.</>, ru: <>Зелёный/красный цвет панели считается прямо из значения <b>bandmi</b> — охранник видит состояние, ничего не читая.</> }, ask: { uz: "Joy bo'sh/bandligini qaysi ustun va tur saqlaydi?", ru: 'Какой столбец и какой тип хранит, свободно место или занято?' } },
    ]
  },
  7: {
    title: { uz: "Bog'lanish — joy_id foreign key", ru: 'Связь — joy_id foreign key' },
    cards: [
      { ic: "🔗", h: { uz: "joy_id ikki jadvalni bog'laydi", ru: 'joy_id связывает две таблицы' }, body: { uz: <>Kunlik tarix <b>sessiyalar</b> jadvalida. Har bir sessiyani <b>joy_id</b> ustuni o'z joyiga bog'laydi: u joylar.id ga ishora qiladi. Bunday bog'lovchi ustun — foreign key.</>, ru: <>Дневная история лежит в таблице <b>sessiyalar</b>. Каждый сеанс столбец <b>joy_id</b> привязывает к своему месту: он указывает на joylar.id. Такой связывающий столбец — foreign key.</> }, vis: <RcFlow items={[{ uz: 'joy', ru: 'место' }, "joy_id", { uz: 'sessiya', ru: 'сеанс' }]} /> },
      { ic: "1️⃣", h: "REFERENCES joylar(id)", body: { uz: <>SQL'da: <b>joy_id INTEGER REFERENCES joylar(id)</b>. Shu yozuv joy_id faqat rostdan bor joyga ishora qilishini ta'minlaydi.</>, ru: <>В SQL: <b>joy_id INTEGER REFERENCES joylar(id)</b>. Эта запись гарантирует, что joy_id указывает только на реально существующее место.</> } },
      { ic: "➕", h: { uz: "one-to-many: bitta joy → ko'p sessiya", ru: 'one-to-many: одно место → много сеансов' }, body: { uz: <>Bitta joy (mas. A2) kun bo'yi ko'p marta band bo'ladi — turli mashinalar. Hammasi bir xil <b>joy_id</b> bilan bog'lanadi.</>, ru: <>Одно место (напр. A2) за день занимают много раз — разные машины. Все сеансы связаны одним и тем же <b>joy_id</b>.</> }, ask: { uz: "Sessiyani joyga qaysi ustun bog'laydi?", ru: 'Какой столбец привязывает сеанс к месту?' } },
    ]
  },
  12: {
    title: { uz: "Backend — POST band / PUT bo'sh", ru: 'Бэкенд — POST занято / PUT свободно' },
    cards: [
      { ic: "🚗", h: { uz: "Kirish = POST (yangi sessiya)", ru: 'Въезд = POST (новый сеанс)' }, body: { uz: <>Mashina kirsa — <b>POST</b> yangi sessiya yozadi va joyni band qiladi (bandmi=true 🟥). Vaqtni <b>NOW()</b> avtomatik qo'yadi.</>, ru: <>Машина въезжает — <b>POST</b> записывает новый сеанс и делает место занятым (bandmi=true 🟥). Время автоматически ставит <b>NOW()</b>.</> }, vis: <RcFlow items={[{ uz: 'kirdi', ru: 'въехала' }, { uz: 'turdi', ru: 'стояла' }, { uz: 'chiqdi', ru: 'выехала' }]} /> },
      { ic: "💸", h: { uz: "Chiqish = PUT (bo'sh + to'lov)", ru: 'Выезд = PUT (свободно + оплата)' }, body: { uz: <>Mashina chiqsa — <b>PUT</b> sessiyani yangilaydi: chiqqan vaqt yoziladi, <b>tolov</b> ustuniga 10 000 tushadi, joy bo'shaydi (bandmi=false 🟩).</>, ru: <>Машина выезжает — <b>PUT</b> обновляет сеанс: записывается время выезда, в столбец <b>tolov</b> падает 10 000, место освобождается (bandmi=false 🟩).</> } },
      { ic: "⏱️", h: { uz: "NOW() — vaqtni server yozadi", ru: 'NOW() — время записывает сервер' }, body: { uz: <>Kirgan/chiqqan vaqtni qo'lda yozmaymiz — <b>NOW()</b> serverda hozirgi vaqtni avtomatik qo'yadi.</>, ru: <>Время въезда/выезда мы не пишем вручную — <b>NOW()</b> на сервере автоматически подставляет текущее время.</> }, ask: { uz: "Mashina kirganda qaysi amal ishlaydi?", ru: 'Какая операция срабатывает, когда машина въезжает?' } },
    ]
  },
  16: {
    title: { uz: "JOIN — ikki jadvalni birlashtirish", ru: 'JOIN — объединение двух таблиц' },
    cards: [
      { ic: "🔍", h: { uz: "sessiyalarda faqat joy_id bor", ru: 'в sessiyalar есть только joy_id' }, body: { uz: <>Kunlik tarixni ochsak, sessiyalarda joy belgisi emas, faqat <b>joy_id</b> (mas. 2) bor. Qorovul "2" nima ekanini bilmaydi.</>, ru: <>Если открыть дневную историю, в сеансах нет обозначения места — только <b>joy_id</b> (напр. 2). Охранник не знает, что такое «2».</> } },
      { ic: "🔗", h: { uz: "JOIN joy_id = id bo'yicha", ru: 'JOIN по joy_id = id' }, body: { uz: <>JOIN ikki jadvalni <b>sessiyalar.joy_id = joylar.id</b> bo'yicha birlashtiradi — shunda joy belgisi (A2) tarixda ko'rinadi.</>, ru: <>JOIN объединяет две таблицы по условию <b>sessiyalar.joy_id = joylar.id</b> — и в истории появляется обозначение места (A2).</> }, vis: <RcFlow items={["joylar + sessiyalar", "JOIN", { uz: 'tarix', ru: 'история' }]} /> },
      { ic: "📋", h: { uz: "Natija: o'qiladigan tarix + tushum", ru: 'Итог: читаемая история + выручка' }, body: { uz: <>JOIN'dan keyin tarix o'qiladigan bo'ladi: joy belgisi, mashina, to'lov. Kunlik tushum esa <b>SUM(tolov)</b> bilan chiqadi — SUM barcha to'lovlarni qo'shib jamlaydi.</>, ru: <>После JOIN история становится читаемой: место, машина, оплата. А дневную выручку даёт <b>SUM(tolov)</b> — SUM складывает все оплаты.</> }, ask: { uz: "Sessiya yoniga joy belgisini qo'shish uchun nima kerak?", ru: 'Что нужно, чтобы рядом с сеансом показать обозначение места?' } },
    ]
  },
  // Eslatma: yakuniy s16 (idx 20) — custom yozma ekran, QuestionScreen EMAS → RecapOverlay u yerda
  // chaqirilmaydi. Shuning uchun 20-kalit YO'Q (etalon DataIntroLesson ham final ekranga recap bermaydi).
  // JOIN ON mavzusi 16-kalitdagi «JOIN — ikki jadvalni birlashtirish» kartalarida qamrab olingan.
};
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
const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
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
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi 📨', ru: 'ответили 📨' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и число ✅/❌ скрыты — по кнопке «Открыть результат» всё появится сразу и у Вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — класс не разобрался в теме. Перед тем как идти дальше, стоит коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по проценту трудно судить. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуется объяснить ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в реальном времени…' })}</p>}
    </div>
  );
}

const QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: 'on_mount', waits_for: { type: 'option_picked' } }] : null);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student'); // jonli dars: BITTA urinish — xato bo'lsa ham qotadi
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
    if (audioText) { audio.triggerEvent('option_picked'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? (audioOk || "To'g'ri.") : (audioWrong || "Unchalik emas. Qaytadan urinib ko'ring.")); }, 300); }
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, подумайте перед нажатием!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
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
              ? <>{tr({ uz: "✓ To'g'ri javob:", ru: '✓ Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? <>{tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(explainCorrect)
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете правильный ответ.' })
                : wrongLocked
                  ? fmtCode(explainWrong[picked] ?? explainWrong.default)
                  : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
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

// ===== KOD RANGLARI =====
const Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;

// ===== AVTOSTOYANKA MA'LUMOTLARI =====
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const FEE = 10000;
const mkSpots = (busy = { 2: '01A123BC', 5: '01B456DE' }) => ([
  { id: 1, raqam: 'A1' }, { id: 2, raqam: 'A2' }, { id: 3, raqam: 'A3' }, { id: 4, raqam: 'A4' },
  { id: 5, raqam: 'B1' }, { id: 6, raqam: 'B2' }, { id: 7, raqam: 'B3' }, { id: 8, raqam: 'B4' }
].map(s => busy[s.id] ? { ...s, bandmi: true, mashina: busy[s.id] } : { ...s, bandmi: false, mashina: null }));

// joylar jadval ustunlari (ME'MOR)
const JOY_COLS = [
  { key: 'id', sql: 'id SERIAL PRIMARY KEY', type: { uz: 'raqam', ru: 'число' }, desc: { uz: "Har bir joyning takrorlanmas raqami — avtomatik o'sadi", ru: 'Уникальный номер каждого места — растёт автоматически' } },
  { key: 'raqam', sql: 'raqam TEXT', type: { uz: 'matn', ru: 'текст' }, desc: { uz: "Joy belgisi — A1, A2, B1... (qorovul o'qiydi)", ru: 'Обозначение места — A1, A2, B1... (его читает охранник)' } },
  { key: 'bandmi', sql: 'bandmi BOOLEAN', type: { uz: "ha/yo'q", ru: 'да/нет' }, desc: { uz: "Joy bandmi? bo'sh = false (🟩), band = true (🟥)", ru: 'Занято ли место? свободно = false (🟩), занято = true (🟥)' } }
];
// sessiyalar jadval ustunlari (kirish-chiqish tarixi)
const SES_COLS = [
  { key: 'id', sql: 'id SERIAL PRIMARY KEY', type: { uz: 'raqam', ru: 'число' }, desc: { uz: "Har bir kirish-chiqishning takrorlanmas raqami", ru: 'Уникальный номер каждого въезда-выезда' } },
  { key: 'joy_id', sql: 'joy_id INTEGER REFERENCES joylar(id)', type: { uz: "bog'lovchi", ru: 'связующий' }, fk: true, desc: { uz: "Qaysi joy? joylar.id ga bog'lanadi — foreign key. SQL'da: joy_id INTEGER REFERENCES joylar(id)", ru: 'Какое место? Привязывается к joylar.id — foreign key. В SQL: joy_id INTEGER REFERENCES joylar(id)' } },
  { key: 'mashina', sql: 'mashina TEXT', type: { uz: 'matn', ru: 'текст' }, desc: { uz: "Mashina davlat raqami — 01A123BC", ru: 'Госномер машины — 01A123BC' } },
  { key: 'kirgan', sql: 'kirgan TIMESTAMP', type: { uz: 'vaqt', ru: 'время' }, desc: { uz: "Mashina kirgan vaqti", ru: 'Время въезда машины' } },
  { key: 'chiqqan', sql: 'chiqqan TIMESTAMP', type: { uz: 'vaqt', ru: 'время' }, desc: { uz: "Chiqqan vaqti (bo'sh = hali turibdi)", ru: 'Время выезда (пусто = ещё стоит)' } },
  { key: 'tolov', sql: 'tolov INTEGER', type: { uz: 'son', ru: 'число' }, desc: { uz: "To'lov — mashina chiqqanda yoziladi, 10 000 so'm", ru: 'Оплата — записывается при выезде, 10 000 сум' } }
];
// sessiyalar namuna ma'lumoti (bog'lanish va JOIN uchun)
const SES_DATA = [
  { id: 1, joy_id: 2, mashina: '01A123BC', tolov: FEE },
  { id: 2, joy_id: 2, mashina: '30K500AA', tolov: FEE },
  { id: 3, joy_id: 5, mashina: '01B456DE', tolov: FEE },
  { id: 4, joy_id: 1, mashina: '75C300BB', tolov: FEE }
];

// ===== QOROVUL PANELI (vizual yulduz) =====
// 🎬 Harakat: holat almashinuvi (bo'sh ⇄ band) key-remount orqali qayta o'ynaydi —
// mashina joyga "kirib keladi" (spot-drive-in) / "chiqib ketadi" (spot-drive-out).
const Spot = ({ spot, onClick, flash, selected, dim, hint }) => (
  <button className={`spot ${spot.bandmi ? 'busy' : 'free'} ${flash ? 'spot-flash' : ''} ${selected ? 'spot-sel' : ''} ${hint && onClick ? 'tap-hint' : ''}`} onClick={onClick} disabled={!onClick} style={{ opacity: dim ? 0.45 : 1, cursor: onClick ? 'pointer' : 'default' }}>
    <span key={spot.bandmi ? 'tb' : 'tf'} className="spot-tag" style={{ background: spot.bandmi ? T.danger : T.success }}>{spot.bandmi ? tr({ uz: 'BAND', ru: 'ЗАНЯТО' }) : tr({ uz: "BO'SH", ru: 'СВОБОДНО' })}</span>
    <span key={spot.bandmi ? 'cb' : 'cf'} className={`spot-ico ${spot.bandmi ? 'drive-in' : 'drive-out'}`}>{spot.bandmi ? '🚗' : '⬚'}</span>
    <span className="spot-num">{spot.raqam}</span>
    {spot.bandmi && spot.mashina && <span key={spot.mashina} className="spot-plate">{spot.mashina}</span>}
  </button>
);
const GuardPanel = ({ spots, onSpotClick, tushum, selectedId, flashId, hintIds, children }) => {
  const band = spots.filter(s => s.bandmi).length;
  const bosh = spots.length - band;
  return (
    <div className="guard">
      <div className="guard-top">
        <span className="guard-title">🅿️ AvtoStoyanka <small>· {tr({ uz: 'qorovul paneli', ru: 'панель охранника' })}</small></span>
        {/* 🎬 hisoblagich o'zgarganda key almashadi → bump (jonli signal) */}
        <span className="guard-stats"><span key={`f${bosh}`} className="gst free">🟩 {bosh}</span><span key={`b${band}`} className="gst busy">🟥 {band}</span></span>
      </div>
      <div className="guard-body">
        <div className="pgrid">{spots.map(s => <Spot key={s.id} spot={s} onClick={onSpotClick ? () => onSpotClick(s) : undefined} flash={flashId === s.id} selected={selectedId === s.id} hint={hintIds ? hintIds.has(s.id) : false} />)}</div>
      </div>
      {(tushum != null || children) && <div className="guard-foot">{tushum != null && <span>{tr({ uz: 'Bugungi tushum:', ru: 'Выручка за сегодня:' })} <b key={tushum} className="guard-sum">{sp(tushum)} {tr({ uz: "so'm", ru: 'сум' })}</b></span>}{children}</div>}
    </div>
  );
};

// jadval (sxema / bog'lanish / JOIN uchun)
const Table = ({ cap, cols, rows, hi, hiCol }) => (
  <div className="db">
    <div className="db-cap">🗄️ <b>{cap}</b> <span>· {rows.length} {tr({ uz: 'qator', ru: 'строк' })}</span></div>
    <div className="db-row db-head" style={{ gridTemplateColumns: `repeat(${cols.length},1fr)` }}>{cols.map(c => <span key={c} style={{ color: c === hiCol ? T.accent : undefined }}>{c}</span>)}</div>
    {rows.map((r, ri) => (
      <div key={ri} className={`db-row el-in ${hi && hi(r) ? 'flash' : ''}`} style={{ gridTemplateColumns: `repeat(${cols.length},1fr)`, animationDelay: `${Math.min(ri, 8) * 45}ms` }}>
        {cols.map(c => <span key={c} style={{ color: c === hiCol ? T.accent : undefined, fontWeight: c === hiCol ? 700 : undefined }}>{r[c]}</span>)}
      </div>
    ))}
  </div>
);

// ===== SCREEN 0 — HOOK (qog'oz bilan kuzatish — chalkash) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [tried, setTried] = useState(!!storedAnswer);
  const [shaking, setShaking] = useState(false);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const poke = () => { setTried(true); setSc(n => n + 1); clearTimeout(timer.current); setShaking(true); timer.current = setTimeout(() => setShaking(false), 450); };
  const OPTS = [
    { id: 'a', label: { uz: "Ko'proq qog'oz va ruchka", ru: 'Больше бумаги и ручек' } },
    { id: 'b', label: { uz: "Bo'sh/band joyni bir qarashda ko'rsatadigan ilova", ru: 'Приложение, где свободные и занятые места видны с одного взгляда' } },
    { id: 'c', label: { uz: "Stoyankani yopish", ru: 'Закрыть стоянку' } }
  ];
  const pick = (v) => { if (picked !== null || !tried) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Loyiha kuni · kirish', ru: 'Проектный день · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 880 }}>{tr({ uz: <>Qorovul qaysi joy bo'shligini <span className="italic" style={{ color: T.accent }}>qog'ozda</span> kuzatib bo'ladimi?</>, ru: <>Сможет ли охранник уследить <span className="italic" style={{ color: T.accent }}>на бумаге</span>, какое место свободно?</> })}</h1>
        <Mentor>{tr({ uz: <>Tasavvur qiling: siz <b style={{ color: T.ink }}>qorovulsiz</b>. Mashinalar kirib-chiqyapti, siz hammasini qog'ozga yozyapsiz. Bitta joyga ikki mashina yozilib qolyapti, kim to'laganini esdan chiqaryapsiz. Qog'ozni bosib ko'ring — u yordam beradimi?</>, ru: <>Представьте: Вы — <b style={{ color: T.ink }}>охранник</b>. Машины въезжают и выезжают, а Вы всё записываете на бумагу. На одно место записываются две машины, Вы забываете, кто оплатил. Нажмите на листок — поможет ли он?</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label fade-up delay-1">{tr({ uz: 'Qorovulning daftari', ru: 'Тетрадь охранника' })}</p>
            <div className={`fade-up delay-1 ${shaking ? 'shake' : ''}`}>
              <div className="paper" onClick={poke}>
                <p className="paper-line">{tr({ uz: "A2 — 01A123BC — to'ladi? ...", ru: 'A2 — 01A123BC — оплатил? ...' })}</p>
                <p className="paper-line">{tr({ uz: "B1 — 01B456DE — ✎ o'chirilgan", ru: 'B1 — 01B456DE — ✎ зачёркнуто' })}</p>
                <p className="paper-line">{tr({ uz: '?? — 30K500AA — qaysi joy?', ru: '?? — 30K500AA — какое место?' })}</p>
                <p className="paper-line" style={{ color: T.danger }}>{tr({ uz: 'A2 — yana?! ikki marta?', ru: 'A2 — опять?! два раза?' })}</p>
                <p className="paper-scribble">{tr({ uz: "— qaysi joy bo'sh??? —", ru: '— какое место свободно??? —' })}</p>
              </div>
            </div>
            {tried && <p className="small fade-step" style={{ color: T.accent, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Qog'oz chalkash — qaysi joy bo'sh, kim to'ladi, bilib bo'lmaydi!", ru: 'Бумага запуталась — не разобрать, какое место свободно и кто оплатил!' })}</p>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: "Qorovulga eng ko'p nima yordam beradi?", ru: 'Что больше всего поможет охраннику?' })}</p>
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
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Avval daftarni bosib ko'ring ←", ru: 'Сначала нажмите на тетрадь ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Aynan! Bugun <b>qorovul uchun</b> stoyanka ilovasini quramiz: bo'sh/band joylar rangda ko'rinadi, mashina kirsa bir bosishda band bo'ladi, chiqsa to'lov yoziladi. To'liq fullstack — front, server va baza birga.</>, ru: <>Именно! Сегодня мы построим приложение стоянки <b>для охранника</b>: свободные/занятые места видны цветом, машина въехала — место занимается одним нажатием, выехала — записывается оплата. Полный fullstack — фронт, сервер и база вместе.</> })}</p>}
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
    { text: { uz: 'Sxema — 2 jadval, bog\'lanish', ru: 'Схема — 2 таблицы, связь' }, tag: { uz: 'ME\'MOR', ru: 'АРХИТЕКТОР' } },
    { text: { uz: 'Backend — kirish / chiqish', ru: 'Бэкенд — въезд / выезд' }, tag: { uz: 'REJISSYOR · AI', ru: 'РЕЖИССЁР · ИИ' } },
    { text: { uz: 'Front — joylar to\'ri', ru: 'Фронт — сетка мест' }, tag: { uz: 'qorovul paneli', ru: 'панель охранника' } },
    { text: { uz: 'Test + tarix (JOIN)', ru: 'Тест + история (JOIN)' }, tag: { uz: 'NAZORATCHI', ru: 'КОНТРОЛЁР' } }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Dars oxirida — sizning qorovul panelingiz', ru: 'В конце урока — Ваша панель охранника' })}</p>
      <GuardPanel spots={mkSpots()} tushum={20000} />
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: "→ bo'sh 🟩 / band 🟥 · bir bosishda kirish-chiqish · tushum hisoblanadi", ru: '→ свободно 🟩 / занято 🟥 · въезд-выезд в одно касание · выручка считается сама' })}</p>
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
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qorovul uchun stoyanka ilovasini <span className="italic" style={{ color: T.accent }}>qanday</span> quramiz?</>, ru: <>Как мы <span className="italic" style={{ color: T.accent }}>построим</span> приложение стоянки для охранника?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bu — <b style={{ color: T.ink }}>loyiha kuni</b>: AvtoIjara'da o'rgangan ko'nikmalarni (CRUD, fetch, baza) endi yangi loyihada — <b style={{ color: T.ink }}>AvtoStoyanka</b>da qo'llaymiz. Ishonasizmi — dars oxirida <b style={{ color: T.ink }}>fullstack</b> loyihani (front + server + baza) o'zingiz yig'asiz. Yana o'sha uch rol: <b style={{ color: T.ink }}>ME'MOR</b> (sxemani chizadi), <b style={{ color: T.ink }}>REJISSYOR</b> (AI'ga buyruq beradi), <b style={{ color: T.ink }}>NAZORATCHI</b> (sinab ko'radi).</>, ru: <>Это — <b style={{ color: T.ink }}>проектный день</b>: навыки из AvtoIjara (CRUD, fetch, база) мы применим в новом проекте — <b style={{ color: T.ink }}>AvtoStoyanka</b>. Поверите ли — к концу урока Вы сами соберёте <b style={{ color: T.ink }}>fullstack</b>-проект (фронт + сервер + база). Снова те же три роли: <b style={{ color: T.ink }}>АРХИТЕКТОР</b> (рисует схему), <b style={{ color: T.ink }}>РЕЖИССЁР</b> (даёт команды ИИ), <b style={{ color: T.ink }}>КОНТРОЛЁР</b> (проверяет).</> })}</Mentor>
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

// ===== SCREEN 2 — PM/UX: QOROVUL UCHUN KO'RINISH =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const PRINC = [
    { id: 'rang', t: { uz: 'Rang bilan holat', ru: 'Состояние цветом' }, d: { uz: "Yashil = bo'sh, qizil = band. Qorovul o'qimasdan, bir qarashda tushunadi.", ru: 'Зелёное = свободно, красное = занято. Охранник понимает с одного взгляда, ничего не читая.' } },
    { id: 'katta', t: { uz: 'Katta, bosiladigan joy', ru: 'Крупные, нажимаемые места' }, d: { uz: "Joylar katta tugma — telefon yoki shoshib turib ham oson bosiladi.", ru: 'Места — большие кнопки: легко нажать даже с телефона или в спешке.' } },
    { id: 'kam', t: { uz: 'Kam matn, tez harakat', ru: 'Мало текста, быстрые действия' }, d: { uz: "Ortiqcha yozuv yo'q. Bir bosishda kirish, bir bosishda chiqish.", ru: 'Никаких лишних надписей. Въезд одним нажатием, выезд одним нажатием.' } }
  ];
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(storedAnswer ? new Set(PRINC.map(p => p.id)) : new Set());
  const [sc, setSc] = useState(0);
  const done = seen.size >= PRINC.length;
  const tap = (id) => { setActive(id); setSc(n => n + 1); setSeen(prev => { const s = new Set(prev); s.add(id); return s; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = PRINC.find(p => p.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'PM · foydalanuvchi', ru: 'PM · пользователь' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : `${tr({ uz: "Qoidalarni ko'ring", ru: 'Посмотрите правила' })} (${seen.size}/3)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bu ilovani <span className="italic" style={{ color: T.accent }}>kim</span> ishlatadi — unga qanday ko'rinish kerak?</>, ru: <><span className="italic" style={{ color: T.accent }}>Кто</span> будет пользоваться этим приложением — и какой интерфейс ему нужен?</> })}</h2></div>
        <Mentor>{tr({ uz: <>PM darslarini eslang: avval <b style={{ color: T.ink }}>foydalanuvchi</b>ni o'ylaymiz. Bu yerda u — <b style={{ color: T.ink }}>qorovul</b>: kompyuter bilimi kam, shoshib turadi. Demak ekran <b style={{ color: T.ink }}>oddiy va tushunarli</b> bo'lishi shart. Uchta qoidani bosib ko'ring — o'ngda ularning natijasi.</>, ru: <>Вспомните уроки PM: сначала думаем о <b style={{ color: T.ink }}>пользователе</b>. Здесь это — <b style={{ color: T.ink }}>охранник</b>: с компьютером знаком слабо, вечно спешит. Значит, экран обязан быть <b style={{ color: T.ink }}>простым и понятным</b>. Нажмите на три правила — справа их результат.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Qorovul uchun 3 qoida (UX — qulay ko'rinish)", ru: '3 правила для охранника (UX — удобный интерфейс)' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PRINC.map(p => (
                <button key={p.id} className={`vcard ${!seen.has(p.id) ? 'tap-hint' : ''}`} onClick={() => tap(p.id)} style={{ boxShadow: active === p.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : undefined }}>
                  <span className="vlbl">{tr(p.t)}</span>
                  <span className={`vseen ${seen.has(p.id) ? 'on' : ''}`} style={{ color: seen.has(p.id) ? T.success : T.ink3 }}>{seen.has(p.id) ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            {cur && <div className="sk-info" key={active}><p className="body" style={{ margin: 0, color: T.ink }}><b style={{ color: T.accent }}>{tr(cur.t)}</b> — {tr(cur.d)}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Shu qoidalar bilan — qorovul paneli', ru: 'С этими правилами — панель охранника' })}</p>
            <GuardPanel spots={mkSpots()} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Mana qorovulga mos panel: rang bilan holat, katta joylar, kam matn. Endi shu ko'rinish ortidagi ma'lumotni — bazani loyihalashtiramiz.", ru: 'Вот панель под охранника: состояние цветом, крупные места, мало текста. Теперь спроектируем данные за этим экраном — базу.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — ME'MOR: 1-JADVAL (joylar) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(storedAnswer ? new Set(JOY_COLS.map(c => c.key)) : new Set());
  const [sc, setSc] = useState(0);
  const done = seen.size >= JOY_COLS.length;
  const tap = (k) => { setActive(k); setSc(n => n + 1); setSeen(prev => { const s = new Set(prev); s.add(k); return s; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = JOY_COLS.find(c => c.key === active);
  return (
    <Stage eyebrow={tr({ uz: "1-qadam · ME'MOR", ru: 'Шаг 1 · АРХИТЕКТОР' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : `${tr({ uz: "Ustunlarni ko'ring", ru: 'Посмотрите столбцы' })} (${seen.size}/${JOY_COLS.length})`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Birinchi jadval — <span className="italic" style={{ color: T.accent }}>joylar</span> haqida nimani saqlaymiz?</>, ru: <>Первая таблица — что мы храним о <span className="italic" style={{ color: T.accent }}>местах</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Panel ortida ma'lumot turishi kerak. Birinchi jadval — <span className="mono">joylar</span>: har bir parking joyi bitta qator. Ustunlarni bosib, nima saqlashini ko'ring — pastda <span className="mono">CREATE TABLE</span> yig'iladi.</>, ru: <>За панелью должны стоять данные. Первая таблица — <span className="mono">joylar</span>: каждое парковочное место — одна строка. Нажимайте на столбцы и смотрите, что они хранят — внизу собирается <span className="mono">CREATE TABLE</span>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'joylar — ustunlar', ru: 'joylar — столбцы' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {JOY_COLS.map(c => (
                <button key={c.key} className={`vcard ${!seen.has(c.key) ? 'tap-hint' : ''}`} onClick={() => tap(c.key)} style={{ boxShadow: active === c.key ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : undefined }}>
                  <span className="vbadge" style={{ background: c.key === 'id' ? T.accent : T.ink }}>{tr(c.type)}</span>
                  <span className="vlbl mono">{c.key}</span>
                  <span className={`vseen ${seen.has(c.key) ? 'on' : ''}`} style={{ color: seen.has(c.key) ? T.success : T.ink3 }}>{seen.has(c.key) ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            {cur && <div className="sk-info" key={active}><p className="body" style={{ margin: 0, color: T.ink }}><b className="mono" style={{ color: T.accent }}>{cur.key}</b> — {tr(cur.desc)}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Tayyor sxema — SQL', ru: 'Готовая схема — SQL' })}</p>
            <pre className="code-box fade-up delay-1" style={{ lineHeight: 1.9 }}>
              <Jx>{'CREATE TABLE'}</Jx>{' joylar ('}{'\n'}
              {JOY_COLS.map(c => (
                <React.Fragment key={c.key}>
                  {'  '}<span style={{ opacity: seen.has(c.key) ? 1 : 0.3, background: active === c.key ? 'rgba(255,79,40,0.16)' : 'transparent', borderRadius: 4, padding: '1px 3px' }}><At>{c.key}</At>{' ' + c.sql.split(' ').slice(1).join(' ')}</span>{c.key !== 'bandmi' ? ',' : ''}{'\n'}
                </React.Fragment>
              ))}
              {');'}
            </pre>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">bandmi BOOLEAN</span> — aynan shu ustun panel rangini boshqaradi: false 🟩, true 🟥. Endi kunlik tarix uchun 2-jadval quramiz.</>, ru: <><span className="mono">bandmi BOOLEAN</span> — именно этот столбец управляет цветом панели: false 🟩, true 🟥. Теперь построим вторую таблицу — для дневной истории.</> })}</p></div>}
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
    questionText="Joy bo'sh yoki bandligini saqlash uchun qaysi ustun?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Joy <span className="italic" style={{ color: T.accent }}>bo'sh/band</span>ligini qaysi ustun saqlaydi?</>, ru: <>Какой столбец хранит, <span className="italic" style={{ color: T.accent }}>свободно или занято</span> место?</> })}</h2></>}
    options={['id SERIAL PRIMARY KEY', 'raqam TEXT', 'bandmi BOOLEAN', 'tolov INTEGER']} correctIdx={2}
    explainCorrect={tr({ uz: "To'g'ri! BOOLEAN — bu ha/yo'q (true/false). bandmi = true bo'lsa joy band (🟥), false bo'lsa bo'sh (🟩). Panel rangi shunga qarab o'zgaradi.", ru: 'Верно! BOOLEAN — это «да/нет» (true/false). Если bandmi = true — место занято (🟥), если false — свободно (🟩). Цвет панели меняется именно по нему.' })}
    explainWrong={{
      0: tr({ uz: "id — takrorlanmas raqam. Bo'sh/band holati uchun bandmi BOOLEAN.", ru: 'id — уникальный номер. Для состояния «свободно/занято» нужен bandmi BOOLEAN.' }),
      1: tr({ uz: "raqam — bu joy belgisi (A1, B2), holat emas. Bo'sh/band uchun bandmi BOOLEAN.", ru: 'raqam — это обозначение места (A1, B2), а не состояние. Для «свободно/занято» — bandmi BOOLEAN.' }),
      3: tr({ uz: "tolov — pul miqdori. Joy holati uchun bandmi BOOLEAN.", ru: 'tolov — сумма денег. Для состояния места — bandmi BOOLEAN.' }),
      default: tr({ uz: "Bo'sh/band = bandmi BOOLEAN (true/false).", ru: 'Свободно/занято = bandmi BOOLEAN (true/false).' })
    }} />
);

// ===== SCREEN 5 — ME'MOR: 2-JADVAL (sessiyalar) + BOG'LANISH =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(storedAnswer ? new Set(SES_COLS.map(c => c.key)) : new Set());
  const [sc, setSc] = useState(0);
  const done = seen.size >= SES_COLS.length;
  const tap = (k) => { setActive(k); setSc(n => n + 1); setSeen(prev => { const s = new Set(prev); s.add(k); return s; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = SES_COLS.find(c => c.key === active);
  return (
    <Stage eyebrow={tr({ uz: "1-qadam · ME'MOR", ru: 'Шаг 1 · АРХИТЕКТОР' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : `${tr({ uz: "Ustunlarni ko'ring", ru: 'Посмотрите столбцы' })} (${seen.size}/${SES_COLS.length})`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugungi kirish-chiqishlarni — <span className="italic" style={{ color: T.accent }}>kunlik tarix</span>ni — qayerga yozamiz?</>, ru: <>Куда записывать сегодняшние въезды-выезды — <span className="italic" style={{ color: T.accent }}>дневную историю</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Qorovulga <b style={{ color: T.ink }}>kunlik tarix</b> kerak: bugun qaysi joyda kim turdi va jami qancha pul yig'ildi. Shuning uchun har bir kirish-chiqishni alohida yozadigan 2-jadval — <span className="mono">sessiyalar</span> — quramiz. Eng muhim ustun <span className="mono">joy_id</span>: u har bir yozuvni o'z joyiga bog'laydi, ya'ni <span className="mono">joylar</span> jadvalidagi <span className="mono">id</span> ga ishora qiladi. Bunday bog'lovchi ustunni <b style={{ color: T.ink }}>foreign key</b> deymiz.</>, ru: <>Охраннику нужна <b style={{ color: T.ink }}>дневная история</b>: кто сегодня стоял на каком месте и сколько денег собралось. Поэтому строим вторую таблицу, где каждый въезд-выезд — отдельная запись: <span className="mono">sessiyalar</span>. Самый важный столбец — <span className="mono">joy_id</span>: он привязывает каждую запись к своему месту, то есть указывает на <span className="mono">id</span> в таблице <span className="mono">joylar</span>. Такой связывающий столбец называется <b style={{ color: T.ink }}>foreign key</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'sessiyalar — ustunlar', ru: 'sessiyalar — столбцы' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {SES_COLS.map(c => (
                <button key={c.key} className={`vcard ${!seen.has(c.key) ? 'tap-hint' : ''}`} onClick={() => tap(c.key)} style={{ boxShadow: active === c.key ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : (c.fk ? `inset 0 0 0 1.5px ${T.blue}55` : undefined) }}>
                  <span className="vbadge" style={{ background: c.fk ? T.blue : (c.key === 'id' ? T.accent : T.ink) }}>{tr(c.type)}</span>
                  <span className="vlbl mono">{c.key}</span>
                  <span className={`vseen ${seen.has(c.key) ? 'on' : ''}`} style={{ color: seen.has(c.key) ? T.success : T.ink3 }}>{seen.has(c.key) ? '✓' : ''}</span>
                </button>
              ))}
            </div>
            {cur && <div className="sk-info" key={active}><p className="body" style={{ margin: 0, color: T.ink }}><b className="mono" style={{ color: cur.fk ? T.blue : T.accent }}>{cur.key}</b> — {tr(cur.desc)}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Ikki jadval — bog'lanish", ru: 'Две таблицы — связь' })}</p>
            <div className="rel fade-up delay-1">
              <div className="rel-box"><b>joylar</b><span className="mono">id</span><span className="mono">raqam</span><span className="mono">bandmi</span></div>
              <div className="rel-link"><span className="rel-key" style={{ color: T.blue }}>joy_id</span><span className="rel-arr">►</span><span className="rel-to mono">joylar.id</span></div>
              <div className="rel-box" style={{ boxShadow: `inset 0 0 0 1.5px ${T.blue}55` }}><b>sessiyalar</b><span className="mono" style={{ color: T.blue }}>joy_id ↗</span><span className="mono">mashina</span><span className="mono">tolov</span></div>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono" style={{ color: T.blue }}>joy_id</span> — ko'prik: har bir yozuvni o'z joyiga ulaydi. Endi kunlik tarix saqlanadi: qaysi joy, qaysi mashina, qancha to'lov.</>, ru: <><span className="mono" style={{ color: T.blue }}>joy_id</span> — мост: соединяет каждую запись со своим местом. Теперь дневная история сохраняется: какое место, какая машина, какая оплата.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — BOG'LANISH VIZUAL (one-to-many) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const SP = mkSpots();
  const [sel, setSel] = useState(storedAnswer ? 2 : null);
  const [seen, setSeen] = useState(storedAnswer ? new Set([2, 5]) : new Set());
  const [sc, setSc] = useState(0);
  const done = seen.size >= 2;
  const pick = (s) => { setSel(s.id); setSc(n => n + 1); setSeen(prev => { const n2 = new Set(prev); n2.add(s.id); return n2; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const selSpot = SP.find(s => s.id === sel);
  const linked = SES_DATA.filter(r => r.joy_id === sel);
  return (
    <Stage eyebrow={tr({ uz: "Bog'lanish", ru: 'Связь' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : `${tr({ uz: '2 ta joyni tekshiring', ru: 'Проверьте 2 места' })} (${seen.size}/2)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta joyda ko'p marta mashina turadi — ularni <span className="italic" style={{ color: T.accent }}>qanday bog'laymiz</span>?</>, ru: <>На одном месте машины стоят много раз — <span className="italic" style={{ color: T.accent }}>как их связать</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Kunlik tarixda bitta joy ko'p marta band qilinadi — turli mashinalar, turli vaqtda. Bu — <b style={{ color: T.ink }}>"bitta → ko'p"</b> bog'lanish. Joyni tanlang: o'sha joyga tegishli barcha sessiyalar (<span className="mono" style={{ color: T.blue }}>joy_id</span> bir xil) yonib chiqadi.</>, ru: <>В дневной истории одно место занимают много раз — разные машины, в разное время. Это связь <b style={{ color: T.ink }}>«один → много»</b>. Выберите место: подсветятся все его сеансы (у них одинаковый <span className="mono" style={{ color: T.blue }}>joy_id</span>).</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Joyni tanlang', ru: 'Выберите место' })}</p>
            <div className="fade-up delay-1"><div className="pgrid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>{SP.map(s => <Spot key={s.id} spot={s} onClick={() => pick(s)} selected={sel === s.id} hint={!done && !seen.has(s.id)} />)}</div></div>
            {selSpot && <div className="sk-info" key={sel}><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b className="mono" style={{ color: T.accent }}>{selSpot.raqam}</b> (id={sel}) joyiga <b>{linked.length}</b> ta sessiya bog'langan.</>, ru: <>К месту <b className="mono" style={{ color: T.accent }}>{selSpot.raqam}</b> (id={sel}) привязано сеансов: <b>{linked.length}</b>.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'sessiyalar — joy_id =', ru: 'sessiyalar — joy_id =' })} {sel ?? '?'}</p>
            <Table cap="sessiyalar" cols={['id', 'joy_id', 'mashina', 'tolov']} rows={SES_DATA.map(r => ({ ...r, tolov: sp(r.tolov) }))} hi={r => r.joy_id === sel} hiCol="joy_id" />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ko'rdingizmi? Bir joyga (mas. A2) bir nechta sessiya <span className="mono" style={{ color: T.blue }}>joy_id</span> orqali bog'langan. Mana shu — ikki jadval bog'lanishi.</>, ru: <>Видите? К одному месту (напр. A2) через <span className="mono" style={{ color: T.blue }}>joy_id</span> привязано несколько сеансов. Это и есть связь двух таблиц.</> })}</p></div>}
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
    questionText="Sessiyani qaysi joyga tegishli ekanini qaysi ustun bog'laydi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Sessiyani <span className="italic" style={{ color: T.accent }}>joyga</span> qaysi ustun bog'laydi?</>, ru: <>Какой столбец привязывает сеанс <span className="italic" style={{ color: T.accent }}>к месту</span>?</> })}</h2></>}
    options={['mashina TEXT', 'joy_id INTEGER', 'tolov INTEGER', 'kirgan TIMESTAMP']} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! joy_id — foreign key: u joylar jadvalidagi id ga ishora qiladi. Shu orqali har sessiya qaysi joyga tegishli ekani aniqlanadi.", ru: 'Верно! joy_id — foreign key: он указывает на id в таблице joylar. Именно по нему видно, к какому месту относится каждый сеанс.' })}
    explainWrong={{
      0: tr({ uz: "mashina — bu davlat raqami, joyga bog'lamaydi. Bog'lovchi — joy_id (foreign key).", ru: 'mashina — это госномер, он не связывает с местом. Связующий столбец — joy_id (foreign key).' }),
      2: tr({ uz: "tolov — pul miqdori. Joyga bog'lovchi ustun — joy_id.", ru: 'tolov — сумма денег. Столбец-связка с местом — joy_id.' }),
      3: tr({ uz: "kirgan — vaqt. Bog'lanish joy_id orqali bo'ladi.", ru: 'kirgan — время. Связь идёт через joy_id.' }),
      default: tr({ uz: "Bog'lovchi = joy_id (foreign key).", ru: 'Связующий столбец = joy_id (foreign key).' })
    }} />
);

// ===== SCREEN 8 — REJISSYOR: MASHINA KIRDI (POST) =====
const BACK_PROMPT = { uz: `Express + pg bilan AvtoStoyanka backend quramiz:
• mashina kirsa — qo'shilsin va joy band bo'lsin
• mashina chiqsa — bo'shatilsin va to'lov yozilsin
• barcha joylar va kunlik tarix ko'rinsin`, ru: `Строим бэкенд AvtoStoyanka на Express + pg:
• машина въехала — добавить сеанс и занять место
• машина выехала — освободить место и записать оплату
• показать все места и дневную историю` };
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: '2-qadam · REJISSYOR (backend)', ru: 'Шаг 2 · РЕЖИССЁР (бэкенд)' })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Promptni AI'ga bering", ru: 'Отправьте промпт ИИ' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Backendni AI'ga <span className="italic" style={{ color: T.accent }}>qanday</span> yozdiramiz?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> поручить ИИ написать бэкенд?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Hammasi <b style={{ color: T.ink }}>aniq va qisqa prompt</b>ga bog'liq. Serverning har bir manzili — <b style={{ color: T.ink }}>endpoint</b>. Har endpoint uchun ikki narsani ayting: qaysi yo'l (path) va u nima qilishi kerak. AI shu ko'rsatma bo'yicha kodni o'zi yozadi. Mana backend uchun tayyor prompt.</>, ru: <>Всё зависит от <b style={{ color: T.ink }}>точного и короткого промпта</b>. Каждый адрес сервера — это <b style={{ color: T.ink }}>endpoint</b>. Для каждого endpoint назовите две вещи: какой путь (path) и что он должен делать. По этой инструкции ИИ сам напишет код. Вот готовый промпт для бэкенда.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Agentga prompt — backend', ru: 'Промпт агенту — бэкенд' })}</p>
            <pre className="prompt-box fade-up delay-1">{tr(BACK_PROMPT)}</pre>
            {!done
              ? <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={() => setDone(true)}>{tr({ uz: "📤 Promptni AI'ga yuborish", ru: '📤 Отправить промпт ИИ' })}</button>
              : <div className="ai-card fade-step"><div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: 'Endpointlar yozildi:', ru: 'Endpoint-ы написаны:' })}</span></div><div className="ai-code"><div className="ai-line ok" style={{ cursor: 'default', whiteSpace: 'pre-wrap' }}>{"app.post('/api/sessiyalar', async (req,res)=>{\n  await pool.query(...);  // sessiyaga INSERT\n  await pool.query(...);  // joylar bandmi=true\n  res.json({status:'kirdi'});\n});\n\napp.put('/api/sessiyalar/:id', async (req,res)=>{\n  await pool.query(...);  // chiqqan + tolov=10000\n  await pool.query(...);  // joylar bandmi=false\n  res.json({status:'chiqdi'});\n});"}</div></div></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Bu backend nima qiladi', ru: 'Что делает этот бэкенд' })}</p>
            <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b style={{ color: T.accent }}>Kirish (POST)</b> — sessiya yoziladi + joy band (🟥). <span className="mono">NOW()</span> vaqtni avtomatik qo'yadi.</>, ru: <><b style={{ color: T.accent }}>Въезд (POST)</b> — записывается сеанс + место занято (🟥). <span className="mono">NOW()</span> ставит время автоматически.</> })}</p></div>
            <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b style={{ color: T.accent }}>Chiqish (PUT)</b> — chiqqan vaqt + 10 000 yoziladi, joy bo'sh (🟩).</>, ru: <><b style={{ color: T.accent }}>Выезд (PUT)</b> — записывается время выезда + 10 000, место свободно (🟩).</> })}</p></div>
            <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b style={{ color: T.accent }}>GET</b> — joylar va tarix (JOIN bilan o'qiladi).</>, ru: <><b style={{ color: T.accent }}>GET</b> — места и история (читается через JOIN).</> })}</p></div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Prompt aniq bo'lgani uchun AI to'g'ri yozdi. Endi shu API'ni ishlatadigan <b>frontni</b> yozdiramiz.</>, ru: <>Промпт был точным — и ИИ написал всё правильно. Теперь поручим ему <b>фронт</b>, который использует этот API.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — REJISSYOR: BACKEND TUSHUNTIRISH (ikki amal chuqurroq) =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? 2 : 0); // 0 boshlang'ich, 1 kirish, 2 chiqish
  const done = step >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const SP = mkSpots({ 2: '01A123BC' });
  const after = step >= 1 ? mkSpots({ 2: '01A123BC', 4: '30A555AA' }) : SP;
  const shown = step >= 2 ? mkSpots({ 4: '30A555AA' }) : after;
  return (
    <Stage eyebrow={tr({ uz: '2-qadam · REJISSYOR (backend)', ru: 'Шаг 2 · РЕЖИССЁР (бэкенд)' })} screen={screen} scrollSignal={step} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Kirish va chiqishni ko'ring", ru: 'Посмотрите въезд и выезд' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endpointlar joyni <span className="italic" style={{ color: T.accent }}>qanday</span> o'zgartiradi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> endpoint-ы меняют место?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Backend yozildi — endi tekshiramiz: har bir endpoint <span className="mono">joylar</span> jadvalini va panel rangini qanday o'zgartiradi. Tugmani bosib, kirish va chiqishni kuzating.</>, ru: <>Бэкенд написан — теперь проверим: как каждый endpoint меняет таблицу <span className="mono">joylar</span> и цвет панели. Нажимайте кнопку и наблюдайте въезд и выезд.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="code-box fade-up delay-1" style={{ minHeight: 70 }}>
              {step === 0 && <span style={{ color: CODE.comment }}>{tr({ uz: '— tugmani bosing —', ru: '— нажмите кнопку —' })}</span>}
              {step === 1 && <span style={{ color: CODE.str }}>{tr({ uz: 'POST /api/sessiyalar → A4 band 🟥 (30A555AA kirdi)', ru: 'POST /api/sessiyalar → A4 занято 🟥 (въехала 30A555AA)' })}</span>}
              {step >= 2 && <><div style={{ color: CODE.str }}>{tr({ uz: 'POST /api/sessiyalar → A4 band 🟥', ru: 'POST /api/sessiyalar → A4 занято 🟥' })}</div><div style={{ color: CODE.str }}>{tr({ uz: "PUT /api/sessiyalar/1 → A2 bo'sh 🟩 (tolov 10 000)", ru: 'PUT /api/sessiyalar/1 → A2 свободно 🟩 (оплата 10 000)' })}</div></>}
            </div>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done} onClick={() => setStep(s => Math.min(s + 1, 2))}>{step === 0 ? tr({ uz: '▶ Mashina kirgizish (POST)', ru: '▶ Впустить машину (POST)' }) : (step === 1 ? tr({ uz: '▶ Mashina chiqarish (PUT)', ru: '▶ Выпустить машину (PUT)' }) : tr({ uz: '✓ Ko\'rdingiz', ru: '✓ Вы посмотрели' }))}</button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Ko'rdingiz: POST joyni band qildi, PUT bo'shatdi va to'lovni yozdi. Backend ishlayapti.", ru: 'Вы увидели: POST занял место, PUT освободил его и записал оплату. Бэкенд работает.' })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'joylar — panelda natija', ru: 'joylar — результат на панели' })}</p>
            <GuardPanel spots={shown} tushum={step >= 2 ? FEE : 0} flashId={step === 1 ? 4 : (step >= 2 ? 2 : null)} />
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9b — REJISSYOR: FRONTEND (qorovul paneli) =====
const FRONT_PROMPT = { uz: `React'da qorovul paneli quramiz:
• barcha joylar to'r bo'lib ko'rinsin (bo'sh yashil, band qizil)
• bo'sh joyga mashina raqamini yozib kirgizish
• band joydan chiqarish (to'lov bilan)
• yuqorida bo'sh/band soni va kunlik tushum`, ru: `Строим панель охранника на React:
• все места видны сеткой (свободные зелёные, занятые красные)
• на свободное место — въезд по госномеру машины
• выезд с занятого места (с оплатой)
• сверху число свободных/занятых и дневная выручка` };
const Screen9b = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: '2-qadam · REJISSYOR (front)', ru: 'Шаг 2 · РЕЖИССЁР (фронт)' })} screen={screen} scrollSignal={done} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Promptni AI'ga bering", ru: 'Отправьте промпт ИИ' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi qorovul <span className="italic" style={{ color: T.accent }}>panelini</span> (front) yozdiramiz.</>, ru: <>Теперь поручим ИИ <span className="italic" style={{ color: T.accent }}>панель</span> охранника (фронт).</> })}</h2></div>
        <Mentor>{tr({ uz: <>Backend tayyor, lekin qorovul kod ko'rmaydi — unga <b style={{ color: T.ink }}>panel</b> kerak. Frontga ham aniq prompt beramiz: nimani ko'rsatsin, qaysi API'ni chaqirsin. Shu prompt AI'ga berilsa — panelni o'zi quradi.</>, ru: <>Бэкенд готов, но охранник кода не видит — ему нужна <b style={{ color: T.ink }}>панель</b>. Для фронта тоже даём точный промпт: что показывать, какой API вызывать. Отдайте этот промпт ИИ — и он сам соберёт панель.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Agentga prompt — frontend', ru: 'Промпт агенту — фронтенд' })}</p>
            <pre className="prompt-box fade-up delay-1">{tr(FRONT_PROMPT)}</pre>
            {!done
              ? <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={() => setDone(true)}>{tr({ uz: "📤 Promptni AI'ga yuborish", ru: '📤 Отправить промпт ИИ' })}</button>
              : <div className="ai-card fade-step"><div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: 'Panel komponenti yozildi:', ru: 'Компонент панели написан:' })}</span></div><div className="ai-code"><div className="ai-line ok" style={{ cursor: 'default', whiteSpace: 'pre-wrap' }}>{"function Panel(){\n  const [joylar,setJoylar]=useState([]);\n  const yukla=()=>fetch('/api/joylar')...;  // joylarni olish\n  useEffect(()=>{ yukla(); },[]);\n  const kirgiz=(joy_id,mashina)=>fetch(...);  // POST → yukla\n  const chiqar=(id,joy_id)=>fetch(...);  // PUT → yukla\n  return <Grid joylar={joylar} .../>;\n}"}</div></div></div>}
          </Col>
          <Col>
            <p className="flow-label">{done ? tr({ uz: 'Natija — qorovul paneli', ru: 'Результат — панель охранника' }) : tr({ uz: 'Front nimani quradi', ru: 'Что строит фронт' })}</p>
            {done
              ? <GuardPanel spots={mkSpots()} tushum={0} />
              : <><div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b style={{ color: T.accent }}>fetch GET</b> — joylarni serverdan oladi.</>, ru: <><b style={{ color: T.accent }}>fetch GET</b> — получает места с сервера.</> })}</p></div><div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b style={{ color: T.accent }}>To'r</b> — bo'sh 🟩 / band 🟥 ko'rsatadi.</>, ru: <><b style={{ color: T.accent }}>Сетка</b> — показывает свободно 🟩 / занято 🟥.</> })}</p></div><div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b style={{ color: T.accent }}>POST / PUT</b> — kirish / chiqish, so'ng qayta yuklash.</>, ru: <><b style={{ color: T.accent }}>POST / PUT</b> — въезд / выезд, затем перезагрузка данных.</> })}</p></div></>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mana panel! Front + backend tayyor. Endi NAZORATCHI sifatida o'zimiz sinab ko'ramiz.</>, ru: <>Вот и панель! Фронт + бэкенд готовы. Теперь испытаем всё сами — в роли КОНТРОЛЁРА.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TEST 3 =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="Mashina kirganda (yangi sessiya) qaysi amal ishlaydi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Mashina <span className="italic" style={{ color: T.accent }}>kirganda</span> qaysi amal?</>, ru: <>Какая операция — когда машина <span className="italic" style={{ color: T.accent }}>въезжает</span>?</> })}</h2></>}
    options={[tr({ uz: 'GET — joylar ro\'yxatini o\'qish', ru: 'GET — прочитать список мест' }), tr({ uz: 'DELETE — sessiyani o\'chirish', ru: 'DELETE — удалить сеанс' }), tr({ uz: 'CSS — panelni chiroyli bezash', ru: 'CSS — красиво оформить панель' }), tr({ uz: 'POST — yangi sessiya yaratish', ru: 'POST — создать новый сеанс' })]} correctIdx={3}
    explainCorrect={tr({ uz: "To'g'ri! Kirish = yangi yozuv = POST (INSERT). Va o'sha joy band qilinadi (UPDATE bandmi=true).", ru: 'Верно! Въезд = новая запись = POST (INSERT). И это место занимается (UPDATE bandmi=true).' })}
    explainWrong={{
      0: tr({ uz: "GET faqat o'qiydi — yangi yozuv qo'shmaydi. Kirish uchun POST kerak (yangi sessiya).", ru: 'GET только читает — новых записей не добавляет. Для въезда нужен POST (новый сеанс).' }),
      1: tr({ uz: "DELETE bor yozuvni o'chiradi. Kirish esa yangi sessiya yaratadi — bu POST.", ru: 'DELETE удаляет существующую запись. А въезд создаёт новый сеанс — это POST.' }),
      2: tr({ uz: "CSS faqat bezaydi, bazaga yozmaydi. Yangi sessiya yaratish — POST.", ru: 'CSS только оформляет, в базу не пишет. Создание нового сеанса — POST.' }),
      default: tr({ uz: "Mashina kirdi = POST (yangi sessiya).", ru: 'Машина въехала = POST (новый сеанс).' })
    }} />
);

// ===== SCREEN 11 — CASE: NAZORATCHI (panelni jonli sinash) =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [spots, setSpots] = useState(mkSpots());
  const [sel, setSel] = useState(null);
  const [tushum, setTushum] = useState(0);
  const [didIn, setDidIn] = useState(!!storedAnswer);
  const [didOut, setDidOut] = useState(!!storedAnswer);
  const [plate, setPlate] = useState('');
  const [sc, setSc] = useState(0);
  const done = didIn && didOut;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const selSpot = spots.find(s => s.id === sel);
  // 🎬 server javobi tushgan joyni halqa to'lqini bilan belgilaymiz (harakat javobni tasdiqlaydi)
  const [flashId, setFlashId] = useState(null);
  const flashTmr = useRef(null);
  useEffect(() => () => { if (flashTmr.current) clearTimeout(flashTmr.current); }, []);
  const pulse = (id) => { setFlashId(id); if (flashTmr.current) clearTimeout(flashTmr.current); flashTmr.current = setTimeout(() => setFlashId(null), 800); };
  const pickSpot = (s) => { setSel(s.id); setPlate(''); };
  const enter = () => { const p = plate.trim(); if (!p) return; const id = sel; setSpots(prev => prev.map(s => s.id === id ? { ...s, bandmi: true, mashina: p } : s)); setDidIn(true); setSel(null); setPlate(''); setSc(n => n + 1); pulse(id); };
  const exit = () => { const id = sel; setSpots(prev => prev.map(s => s.id === id ? { ...s, bandmi: false, mashina: null } : s)); setTushum(t => t + FEE); setDidOut(true); setSel(null); setSc(n => n + 1); pulse(id); };
  // 🎬 tap-hint: nima qilish kerakligini panel o'zi ko'rsatadi (bo'sh → keyin band)
  const hintIds = useMemo(() => {
    if (sel != null) return new Set();
    if (!didIn) return new Set(spots.filter(s => !s.bandmi).map(s => s.id));
    if (!didOut) return new Set(spots.filter(s => s.bandmi).map(s => s.id));
    return new Set();
  }, [spots, didIn, didOut, sel]);
  return (
    <Stage eyebrow={tr({ uz: '3-qadam · NAZORATCHI', ru: 'Шаг 3 · КОНТРОЛЁР' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Bir kirish + bir chiqishni sinang", ru: 'Проверьте один въезд + один выезд' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi sinaymiz — panel <span className="italic" style={{ color: T.accent }}>jonlanadimi</span>?</>, ru: <>Теперь проверим — панель <span className="italic" style={{ color: T.accent }}>оживёт</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana qorovul paneli, ma'lumot serverdan. <b style={{ color: T.ink }}>Bo'sh joyni</b> bosing → mashina kirgizing (POST) → 🟥. <b style={{ color: T.ink }}>Band joyni</b> bosing → chiqaring (PUT) → 🟩 va 10 000 yoziladi. Ikkalasini ham sinang.</>, ru: <>Вот панель охранника, данные с сервера. Нажмите <b style={{ color: T.ink }}>свободное место</b> → впустите машину (POST) → 🟥. Нажмите <b style={{ color: T.ink }}>занятое место</b> → выпустите её (PUT) → 🟩 и запишется 10 000. Проверьте оба действия.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Amal paneli', ru: 'Панель действий' })}</p>
            {!selSpot && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "O'ngdan joyni tanlang →", ru: 'Выберите место справа →' })}</p></div>}
            {selSpot && !selSpot.bandmi && (
              <div className="frame fade-step" style={{ padding: 14 }}>
                <p className="note-h" style={{ color: T.success }}>🟩 {selSpot.raqam} — {tr({ uz: 'kiruvchi mashina', ru: 'въезжающая машина' })}</p>
                <p className="small" style={{ color: T.ink2, margin: '0 0 9px' }}>{tr({ uz: 'Mashina davlat raqamini yozing:', ru: 'Введите госномер машины:' })}</p>
                <input className="plate-input" value={plate} onChange={e => setPlate(e.target.value.toUpperCase())} onKeyDown={e => { if (e.key === 'Enter') enter(); }} placeholder="01 A 123 BC" spellCheck={false} autoCapitalize="characters" autoCorrect="off" />
                <button className="btn" disabled={!plate.trim()} onClick={enter} style={{ marginTop: 10 }}>{tr({ uz: '🚗 Kirgizish (POST)', ru: '🚗 Впустить (POST)' })}</button>
              </div>
            )}
            {selSpot && selSpot.bandmi && (
              <div className="frame fade-step" style={{ padding: 14, boxShadow: `inset 0 0 0 1.5px ${T.danger}55` }}>
                <p className="note-h" style={{ color: T.danger }}>🟥 {selSpot.raqam} — {tr({ uz: 'band', ru: 'занято' })} ({selSpot.mashina})</p>
                <p className="small" style={{ color: T.ink2, margin: '0 0 9px' }}>{tr({ uz: "Mashina chiqyapti — to'lov olinadi:", ru: 'Машина выезжает — берём оплату:' })}</p>
                <button className="btn" onClick={exit} style={{ background: T.success }}>{tr({ uz: 'Chiqarish', ru: 'Выпустить' })} · {sp(FEE)} {tr({ uz: "so'm", ru: 'сум' })} (PUT)</button>
              </div>
            )}
            <div className="fade-up delay-2" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              <span className="tagpill" style={{ color: didIn ? T.success : T.ink3 }}>{didIn ? '✓' : '○'} {tr({ uz: 'Kirish (POST)', ru: 'Въезд (POST)' })}</span>
              <span className="tagpill" style={{ color: didOut ? T.success : T.ink3 }}>{didOut ? '✓' : '○'} {tr({ uz: 'Chiqish (PUT)', ru: 'Выезд (PUT)' })}</span>
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Qorovul paneli', ru: 'Панель охранника' })}</p>
            <GuardPanel spots={spots} onSpotClick={pickSpot} tushum={tushum} selectedId={sel} flashId={flashId} hintIds={hintIds} />
            {done && <div className="takeaway fade-step"><div className="ta-bulb">🎉</div><p className="ta-h">{tr({ uz: 'Panel ishlayapti!', ru: 'Панель работает!' })}</p><p className="ta-sub">{tr({ uz: 'Kirish 🟥, chiqish 🟩 + tushum. Front, server, baza — birga.', ru: 'Въезд 🟥, выезд 🟩 + выручка. Фронт, сервер, база — вместе.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — JOIN (tarix o'qiladigan bo'ladi) =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [joined, setJoined] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = joined;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const doJoin = () => { setJoined(true); setSc(n => n + 1); };
  const RAQAM = { 1: 'A1', 2: 'A2', 5: 'B1' };
  return (
    <Stage eyebrow={tr({ uz: 'JOIN · tarix', ru: 'JOIN · история' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "JOIN bilan birlashtiring", ru: 'Объедините через JOIN' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qorovul <span className="italic" style={{ color: T.accent }}>kunlik tarix</span>ni ochdi — lekin joy "2" deb chiqyapti, A2 qayerda?</>, ru: <>Охранник открыл <span className="italic" style={{ color: T.accent }}>дневную историю</span> — но место показано как «2». Где A2?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Qorovul kunlik tarixni ko'rmoqchi: kim, qaysi joy, qancha. Lekin sessiyalarda faqat <span className="mono" style={{ color: T.blue }}>joy_id</span> bor (mas. 2) — joy belgisi (<b style={{ color: T.ink }}>A2</b>) esa <span className="mono">joylar</span> jadvalida. <b style={{ color: T.ink }}>JOIN</b> ikki jadvalni <span className="mono">joy_id = id</span> bo'yicha birlashtiradi — shunda tarix o'qiladigan bo'ladi.</>, ru: <>Охранник хочет видеть дневную историю: кто, какое место, сколько. Но в сеансах есть только <span className="mono" style={{ color: T.blue }}>joy_id</span> (напр. 2) — а обозначение места (<b style={{ color: T.ink }}>A2</b>) лежит в таблице <span className="mono">joylar</span>. <b style={{ color: T.ink }}>JOIN</b> объединяет две таблицы по <span className="mono">joy_id = id</span> — и история становится читаемой.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{joined ? tr({ uz: 'JOIN natijasi — o\'qiladi', ru: 'Результат JOIN — читается' }) : tr({ uz: 'sessiyalar — joy_id raqam', ru: 'sessiyalar — joy_id числом' })}</p>
            {/* 🎬 JOIN bosilganda jadval "sakrab" emas — sk-swapin bilan silliq almashadi */}
            <div key={joined ? 'joined' : 'raw'} className={joined ? 'sk-swapin' : ''}>
              {!joined
                ? <Table cap="sessiyalar" cols={['joy_id', 'mashina', 'tolov']} rows={SES_DATA.map(r => ({ joy_id: r.joy_id, mashina: r.mashina, tolov: sp(r.tolov) }))} hiCol="joy_id" />
                : <Table cap="sessiyalar JOIN joylar" cols={['raqam', 'mashina', 'tolov']} rows={SES_DATA.map(r => ({ raqam: RAQAM[r.joy_id] || ('id' + r.joy_id), mashina: r.mashina, tolov: sp(r.tolov) }))} hiCol="raqam" />}
            </div>
            {!joined && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: '"joy_id: 2" — qaysi joy? Qorovul tushunmaydi.', ru: '«joy_id: 2» — какое это место? Охранник не понимает.' })}</p>}
          </Col>
          <Col>
            <pre className="code-box fade-up delay-1" style={{ lineHeight: 1.85 }}>
              <Jx>{'SELECT'}</Jx>{' raqam, mashina, tolov'}{'\n'}
              <Jx>{'FROM'}</Jx>{' sessiyalar'}{'\n'}
              <Jx>{'JOIN'}</Jx>{' joylar'}{'\n'}
              {'  '}<At>{'ON sessiyalar.joy_id = joylar.id'}</At>{';'}
            </pre>
            {!joined && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={doJoin}>{tr({ uz: '▶ JOIN bilan birlashtirish', ru: '▶ Объединить через JOIN' })}</button>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Endi <b>A2</b> ko'rinadi! JOIN <span className="mono" style={{ color: T.blue }}>joy_id</span> va <span className="mono">id</span> ni moslab, ikki jadvaldan birga ma'lumot oldi. Bog'lanish shuning uchun kerak edi.</>, ru: <>Теперь видно <b>A2</b>! JOIN сопоставил <span className="mono" style={{ color: T.blue }}>joy_id</span> и <span className="mono">id</span> и взял данные сразу из двух таблиц. Вот зачем нужна была связь.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — TEST 4 =====
const Screen13 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="Sessiya yoniga joy belgisini (A2) qo'shib ko'rsatish uchun nima kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Sessiya yoniga <span className="italic" style={{ color: T.accent }}>joy belgisini</span> qo'shish uchun?</>, ru: <>Что нужно, чтобы показать рядом с сеансом <span className="italic" style={{ color: T.accent }}>обозначение места</span>?</> })}</h2></>}
    options={[tr({ uz: 'DELETE — eski sessiyalarni o\'chirish', ru: 'DELETE — удалить старые сеансы' }), tr({ uz: 'Sessiyalarga yangi ustun qo\'shish', ru: 'Добавить в sessiyalar новый столбец' }), tr({ uz: 'JOIN — ikki jadvalni birlashtirish', ru: 'JOIN — объединить две таблицы' }), tr({ uz: 'CSS — jadvalga rang berish', ru: 'CSS — раскрасить таблицу' })]} correctIdx={2}
    explainCorrect={tr({ uz: "To'g'ri! JOIN ikki jadvalni bog'lovchi ustun (joy_id = id) bo'yicha birlashtiradi — natijada sessiya bilan joy belgisi birga ko'rinadi.", ru: 'Верно! JOIN объединяет две таблицы по связующему столбцу (joy_id = id) — и сеанс показывается вместе с обозначением места.' })}
    explainWrong={{
      0: tr({ uz: "DELETE o'chiradi, birlashtirmaydi. Bu yerda ikki jadvalni birga o'qish kerak — JOIN.", ru: 'DELETE удаляет, а не объединяет. Здесь нужно читать две таблицы вместе — JOIN.' }),
      1: tr({ uz: "Yangi ustun shart emas: joy belgisi allaqachon joylar jadvalida bor. Uni JOIN olib keladi.", ru: 'Новый столбец не нужен: обозначение места уже есть в таблице joylar. Его принесёт JOIN.' }),
      3: tr({ uz: "CSS faqat bezaydi, ikki jadvalni birlashtirmaydi. Buning yo'li — JOIN.", ru: 'CSS только оформляет, таблицы он не объединяет. Путь здесь один — JOIN.' }),
      default: tr({ uz: "Ikki jadvalni birlashtirish = JOIN.", ru: 'Объединить две таблицы = JOIN.' })
    }} />
);

// ===== SCREEN 14 — TO'LIQ PANEL (amaliyot) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [spots, setSpots] = useState(mkSpots({ 2: '01A123BC' }));
  const [sel, setSel] = useState(null);
  const [tushum, setTushum] = useState(0);
  const [tarix, setTarix] = useState([]);
  const [acts, setActs] = useState(storedAnswer ? 3 : 0);
  const [plate, setPlate] = useState('');
  const [sc, setSc] = useState(0);
  const done = acts >= 3;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const selSpot = spots.find(s => s.id === sel);
  // 🎬 har amal halqa to'lqini bilan "muhrlanadi"
  const [flashId, setFlashId] = useState(null);
  const flashTmr = useRef(null);
  useEffect(() => () => { if (flashTmr.current) clearTimeout(flashTmr.current); }, []);
  const pulse = (id) => { setFlashId(id); if (flashTmr.current) clearTimeout(flashTmr.current); flashTmr.current = setTimeout(() => setFlashId(null), 800); };
  const pickSpot = (s) => { setSel(s.id); setPlate(''); };
  const enter = () => { const p = plate.trim(); if (!p) return; const id = sel; setSpots(prev => prev.map(s => s.id === id ? { ...s, bandmi: true, mashina: p } : s)); setSel(null); setPlate(''); setActs(a => a + 1); setSc(n => n + 1); pulse(id); };
  const exit = () => { const spt = selSpot; const id = sel; setSpots(prev => prev.map(s => s.id === id ? { ...s, bandmi: false, mashina: null } : s)); setTushum(t => t + FEE); setTarix(prev => [{ k: Date.now() + Math.random(), raqam: spt.raqam, mashina: spt.mashina, tolov: FEE }, ...prev]); setSel(null); setActs(a => a + 1); setSc(n => n + 1); pulse(id); };
  // 🎬 hali amal qilinmagan bo'lsa — panel "bosing" deb chaqiradi
  const hintIds = useMemo(() => (acts === 0 && sel == null) ? new Set(spots.map(s => s.id)) : new Set(), [acts, sel, spots]);
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot · to'liq panel", ru: 'Практика · полная панель' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : `${tr({ uz: 'Kamida 3 amal qiling', ru: 'Сделайте минимум 3 действия' })} (${Math.min(acts, 3)}/3)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Stoyanka boshqaruv paneli — <span className="italic" style={{ color: T.accent }}>hammasi joyidami</span>?</>, ru: <>Панель управления стоянкой — <span className="italic" style={{ color: T.accent }}>всё ли на месте</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Endi to'liq panel sizniki. Bir nechta mashinani <b style={{ color: T.ink }}>kirgizing</b> va <b style={{ color: T.ink }}>chiqaring</b> — bo'sh/band soni, tushum va tarix jonli yangilanishini kuzating. Qorovul aynan shunday ishlatadi.</>, ru: <>Теперь полная панель — Ваша. <b style={{ color: T.ink }}>Впустите</b> и <b style={{ color: T.ink }}>выпустите</b> несколько машин — смотрите, как вживую обновляются число свободных/занятых, выручка и история. Охранник пользуется ей именно так.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Amal', ru: 'Действие' })}</p>
            {!selSpot && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Joyni tanlang →', ru: 'Выберите место →' })}</p></div>}
            {selSpot && !selSpot.bandmi && (
              <div className="frame fade-step" style={{ padding: 13 }}>
                <p className="note-h" style={{ color: T.success }}>🟩 {selSpot.raqam} — {tr({ uz: 'kiruvchi mashina', ru: 'въезжающая машина' })}</p>
                <input className="plate-input" value={plate} onChange={e => setPlate(e.target.value.toUpperCase())} onKeyDown={e => { if (e.key === 'Enter') enter(); }} placeholder="01 A 123 BC" spellCheck={false} autoCapitalize="characters" autoCorrect="off" />
                <button className="btn" disabled={!plate.trim()} onClick={enter} style={{ marginTop: 9 }}>{tr({ uz: '🚗 Kirgizish (POST)', ru: '🚗 Впустить (POST)' })}</button>
              </div>
            )}
            {selSpot && selSpot.bandmi && (
              <div className="frame fade-step" style={{ padding: 13, boxShadow: `inset 0 0 0 1.5px ${T.danger}55` }}>
                <p className="note-h" style={{ color: T.danger }}>🟥 {selSpot.raqam} — {selSpot.mashina}</p>
                <button className="btn" onClick={exit} style={{ background: T.success }}>{tr({ uz: 'Chiqarish', ru: 'Выпустить' })} · {sp(FEE)} {tr({ uz: "so'm", ru: 'сум' })}</button>
              </div>
            )}
            <p className="flow-label" style={{ margin: '4px 0 0' }}>{tr({ uz: 'Tarix (JOIN bilan)', ru: 'История (через JOIN)' })}</p>
            {tarix.length ? <div className="tarix">{tarix.map((t, i) => <div key={t.k ?? i} className="tarix-row el-in"><span className="mono" style={{ color: T.accent }}>{t.raqam}</span><span className="mono">{t.mashina}</span><span style={{ marginLeft: 'auto', fontWeight: 700 }}>{sp(t.tolov)}</span></div>)}</div>
              : <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Chiqishlar shu yerda yoziladi…', ru: 'Выезды будут записываться здесь…' })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Qorovul paneli', ru: 'Панель охранника' })}</p>
            <GuardPanel spots={spots} onSpotClick={pickSpot} tushum={tushum} selectedId={sel} flashId={flashId} hintIds={hintIds} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "🎉 To'liq ishlaydigan panel! Bo'sh/band, tushum, tarix — hammasi jonli. Mana — sizning fullstack loyihangiz.", ru: '🎉 Полностью рабочая панель! Свободно/занято, выручка, история — всё живое. Вот он — Ваш fullstack-проект.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — QOIDA: XULOSA =====
const Screen15 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Qoida · xulosa', ru: 'Правило · вывод' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Oxirgi qadam →', ru: 'Последний шаг →' }} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Fullstack loyiha — <span className="italic" style={{ color: T.accent }}>bir qarashda</span> nima?</>, ru: <>Fullstack-проект — что это, <span className="italic" style={{ color: T.accent }}>если одним взглядом</span>?</> })}</h2></div>
      <Mentor>{tr({ uz: <>Siz bugun <b style={{ color: T.ink }}>fullstack</b> loyihani yig'dingiz: front (qorovul paneli) + server (kirish/chiqish) + baza (2 jadval). Eng muhim yangilik — <b style={{ color: T.ink }}>ikki jadval bog'lanishi</b>: <span className="mono">joy_id</span> ↔ <span className="mono">id</span>, ularni <span className="mono">JOIN</span> birga ko'rsatadi.</>, ru: <>Сегодня Вы собрали <b style={{ color: T.ink }}>fullstack</b>-проект: фронт (панель охранника) + сервер (въезд/выезд) + база (2 таблицы). Главная новинка — <b style={{ color: T.ink }}>связь двух таблиц</b>: <span className="mono">joy_id</span> ↔ <span className="mono">id</span>, вместе их показывает <span className="mono">JOIN</span>.</> })}</Mentor>
      <Zoomable>
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Loyiha qismlari', ru: 'Части проекта' })}</p>
          <div className="roadmap">
            <div className="step-card"><span className="step-num">01</span><span className="step-body"><span className="step-text">{tr({ uz: 'Baza — 2 jadval', ru: 'База — 2 таблицы' })}</span><span className="step-tag">joylar ◄ joy_id sessiyalar</span></span></div>
            <div className="step-card"><span className="step-num">02</span><span className="step-body"><span className="step-text">{tr({ uz: 'Server — kirish/chiqish', ru: 'Сервер — въезд/выезд' })}</span><span className="step-tag">POST · PUT</span></span></div>
            <div className="step-card"><span className="step-num">03</span><span className="step-body"><span className="step-text">{tr({ uz: 'Front — qorovul paneli', ru: 'Фронт — панель охранника' })}</span><span className="step-tag">🟩 / 🟥</span></span></div>
            <div className="step-card"><span className="step-num">04</span><span className="step-body"><span className="step-text">{tr({ uz: 'Tarix — JOIN', ru: 'История — JOIN' })}</span><span className="step-tag">joy_id = id</span></span></div>
          </div>
        </Col>
        <Col>
          <p className="flow-label">{tr({ uz: 'Yodda tuting', ru: 'Запомните' })}</p>
          <div className="frame-success"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>Bog'lanish</b>: joy_id foreign key joylar.id ga ishora qiladi; <b>JOIN</b> ularni birga ko'rsatadi.</>, ru: <><b>Связь</b>: foreign key joy_id указывает на joylar.id; <b>JOIN</b> показывает их вместе.</> })}</p></div>
          <div className="frame" style={{ padding: 14 }}><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>PM darsidan: avval <b style={{ color: T.ink }}>foydalanuvchi</b>ni (qorovul) o'ylang. Rollar: <b style={{ color: T.ink }}>ME'MOR</b> (loyihachi), <b style={{ color: T.ink }}>REJISSYOR</b> (buyruq beruvchi), <b style={{ color: T.ink }}>NAZORATCHI</b> (sinovchi).</>, ru: <>Из урока PM: сначала думайте о <b style={{ color: T.ink }}>пользователе</b> (охраннике). Роли: <b style={{ color: T.ink }}>АРХИТЕКТОР</b> (проектирует), <b style={{ color: T.ink }}>РЕЖИССЁР</b> (даёт команды), <b style={{ color: T.ink }}>КОНТРОЛЁР</b> (проверяет).</> })}</p></div>
        </Col>
      </Split>
      </Zoomable>
    </div>
  </Stage>
);

// ===== SCREEN 16 — YAKUNIY (VS Code: JOIN ON) =====
const Screen16 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [value, setValue] = useState(storedAnswer?.picked || '');
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const norm = value.replace(/\s+/g, ' ').trim();
  const valid = /^(sessiyalar|s)\s*\.\s*joy_id\s*=\s*(joylar|j)\s*\.\s*id$/i.test(norm) || /^(joylar|j)\s*\.\s*id\s*=\s*(sessiyalar|s)\s*\.\s*joy_id$/i.test(norm);
  const hasJoyId = /joy_id/i.test(value);
  const hasId = /joylar\s*\.\s*id|\bj\s*\.\s*id/i.test(value);
  useEffect(() => {
    if (valid && !passed) {
      setPassed(true);
      onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'VS Code: JOIN ON shartini yozing', studentAnswer: value, correct: true, firstAttemptCorrect: true, solved: true, picked: value });
    }
  }, [valid]);
  const Ln = ({ n, children }) => (<div className="vsc-line"><span className="vsc-ln">{n}</span><span style={{ whiteSpace: 'pre' }}>{children}</span></div>);
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} scrollSignal={passed} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Bog'lanish shartini yozing", ru: 'Напишите условие связи' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: <span className="italic" style={{ color: T.accent }}>bog'lanish</span> shartini o'zingiz yozing.</>, ru: <>Последний шаг: напишите условие <span className="italic" style={{ color: T.accent }}>связи</span> сами.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Tarixni o'qiladigan qilish uchun JOIN kerak — ikki jadval <b style={{ color: T.ink }}>qaysi ustunlar bo'yicha</b> bog'lanadi? <span className="mono">ON</span> dan keyin yozing: <span className="mono">sessiyalar.joy_id = joylar.id</span>.</>, ru: <>Чтобы история читалась, нужен JOIN — <b style={{ color: T.ink }}>по каким столбцам</b> связываются две таблицы? Напишите после <span className="mono">ON</span>: <span className="mono">sessiyalar.joy_id = joylar.id</span>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="vsc fade-up delay-2">
              <div className="vsc-bar"><span className="vsc-tab on"><span style={{ color: CODE.str }}>🟢</span> tarix.sql <span style={{ color: CODE.comment, marginLeft: 4 }}>×</span></span></div>
              <div className="vsc-body">
                <Ln n={1}><Jx>{'SELECT'}</Jx>{' raqam, mashina, tolov'}</Ln>
                <Ln n={2}><Jx>{'FROM'}</Jx>{' sessiyalar'}</Ln>
                <Ln n={3}><Jx>{'JOIN'}</Jx>{' joylar'}</Ln>
                <div className="vsc-line">
                  <span className="vsc-ln">4</span>
                  <span style={{ whiteSpace: 'pre' }}>{'  '}<span style={{ color: CODE.attr }}>ON</span>{' '}</span>
                  <input className={`vsc-input ${valid ? 'ok' : ''}`} value={value} onChange={e => setValue(e.target.value)} placeholder="sessiyalar.joy_id = joylar.id" spellCheck={false} autoCapitalize="off" autoCorrect="off" />
                </div>
              </div>
            </div>
            <div className="fade-up delay-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tagpill" style={{ opacity: hasJoyId ? 1 : 0.4 }}>{hasJoyId ? '✓' : '1'} sessiyalar.joy_id</span>
              <span className="tagpill" style={{ opacity: hasId ? 1 : 0.4 }}>{hasId ? '✓' : '2'} joylar.id</span>
            </div>
            {passed && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ Mukammal! Ikki jadval bog'landi — tarix endi joy belgisi bilan o'qiladi. Loyihangiz to'liq tayyor!", ru: '✓ Отлично! Две таблицы связаны — история теперь читается с обозначением места. Ваш проект полностью готов!' })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija — tarix', ru: 'результат — история' })}</p>
            {valid
              ? <Table cap="sessiyalar JOIN joylar" cols={['raqam', 'mashina', 'tolov']} rows={[{ raqam: 'A2', mashina: '01A123BC', tolov: sp(FEE) }, { raqam: 'B1', mashina: '01B456DE', tolov: sp(FEE) }]} hiCol="raqam" />
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: "ON sharti yozilmaguncha jadvallar bog'lanmaydi…", ru: 'Пока условие ON не написано, таблицы не связаны…' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 17 — YAKUN =====
const Screen17 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
    { uz: "PM: avval foydalanuvchini (qorovul) o'ylab, unga mos sodda panel qurdik", ru: 'PM: сначала подумали о пользователе (охраннике) и построили простую панель под него' },
    { uz: "Baza: 2 jadval — joylar ◄ joy_id sessiyalar (foreign key bog'lanishi)", ru: 'База: 2 таблицы — joylar ◄ joy_id sessiyalar (связь через foreign key)' },
    { uz: "Server: kirish (POST) joyni band qiladi, chiqish (PUT) bo'shatib to'lovni yozadi", ru: 'Сервер: въезд (POST) занимает место, выезд (PUT) освобождает его и записывает оплату' },
    { uz: "Front: 🟩/🟥 panel — rang to'g'ridan-to'g'ri bandmi ustunidan chiqadi", ru: 'Фронт: панель 🟩/🟥 — цвет берётся прямо из столбца bandmi' },
    { uz: "JOIN: ikki jadvalni joy_id = id bo'yicha birlashtirdik — tarix o'qiladigan bo'ldi", ru: 'JOIN: объединили две таблицы по joy_id = id — история стала читаемой' }
  ];
  const HOMEWORK = [
    { b: { uz: "Yangi joy qo'shing", ru: 'Добавьте новые места' }, t: { uz: "— stoyankaga C1, C2 joylarini qo'shib, panelda ko'rining", ru: '— добавьте на стоянку места C1, C2 и посмотрите их на панели' } },
    { b: { uz: "Vaqtga qarab to'lov", ru: 'Оплата по времени' }, t: { uz: "— 1 soat = 5 000 so'm qilib, to'lovni turgan vaqtdan hisoblang", ru: '— сделайте 1 час = 5 000 сум и считайте оплату от времени стоянки' } },
    { b: { uz: 'Tushum hisoboti', ru: 'Отчёт по выручке' }, t: { uz: "— kunlik jami tushumni chiqaring (SUM to'lovlarni qo'shib jamlaydi)", ru: '— выведите дневную общую выручку (SUM складывает все оплаты)' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Fullstack loyiha kuni tugadi', ru: 'Fullstack проектный день завершён' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>AvtoStoyanka panelini <span className="italic" style={{ color: T.accent }}>o'zingiz qurdingiz</span>.</>, ru: <>Панель AvtoStoyanka <span className="italic" style={{ color: T.accent }}>Вы построили сами</span>.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: "Tabriklaymiz! Siz bo'sh qog'ozdan boshlab, haqiqiy qorovul ishlata oladigan ilovani qurdingiz: baza, server va panel — hammasi bir butun bo'lib ishlayapti. Shu bilan stoyanka ochildi 🚦", ru: 'Поздравляем! Начав с чистого листа, Вы построили приложение, которым может пользоваться настоящий охранник: база, сервер и панель работают как единое целое. Стоянка открыта 🚦' }) : tr({ uz: "Yaxshi harakat — loyiha tayyor! Bog'lanish (joy_id) va JOIN qismini bir-ikki ekranda qayta ko'rib chiqing, shunda hamma bo'lak joyiga tushadi.", ru: 'Хорошая работа — проект готов! Пересмотрите пару экранов про связь (joy_id) и JOIN — и все кусочки встанут на место.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь Вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: 'Antigravity bilan panelni kengaytiring:', ru: 'Расширьте панель вместе с Antigravity:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "🚀 Loyihangiz tayyor! Keyingi praktikada — uni sinfdoshlaringizga ko'rsatamiz, fikr (feedback) yig'amiz va yaxshilaymiz.", ru: '🚀 Ваш проект готов! На следующей практике покажем его одноклассникам, соберём фидбек и улучшим.' })}</p></div>
        </div>
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

// 🃏 Qayta ishlatiladigan FLASHCARDS — aktiv takrorlash (3D flip + o'z-o'zini baholash).
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
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda", ru: '↻ Учится' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })} · <b>{known}</b></span></div>
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
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : (<p className="fc-hint">{tr({ uz: "👆 Kartani bosing — javobni ko'rasiz", ru: '👆 Нажмите на карточку — увидите ответ' })}</p>)}
    </div>
  );
}

// 🃏 FLASHCARD KARTALARI (front=savol, back=qisqa javob, note=bir qatorlik izoh)
const STOYANKA_FLASHCARDS = [
  { front: { uz: "Parking joylari haqidagi ma'lumot qaysi jadvalda turadi?", ru: 'В какой таблице лежат данные о парковочных местах?' }, back: "joylar", note: { uz: 'Har joy — bitta qator: id, raqam, bandmi', ru: 'Каждое место — одна строка: id, raqam, bandmi' } },
  { front: { uz: "Joy bo'sh yoki bandligini qaysi ustun saqlaydi?", ru: 'Какой столбец хранит, свободно место или занято?' }, back: "bandmi (BOOLEAN)", note: { uz: "false 🟩 — bo'sh, true 🟥 — band", ru: 'false 🟩 — свободно, true 🟥 — занято' } },
  { front: { uz: 'Panelning yashil yoki qizil rangi qayerdan olinadi?', ru: 'Откуда берётся зелёный или красный цвет панели?' }, back: { uz: 'bandmi qiymatidan', ru: 'Из значения bandmi' }, note: { uz: "Qorovul hech narsa o'qimasdan holatni ko'radi", ru: 'Охранник видит состояние, ничего не читая' } },
  { front: { uz: 'Kunlik kirish-chiqish tarixi qaysi jadvalga yoziladi?', ru: 'В какую таблицу пишется дневная история въездов-выездов?' }, back: "sessiyalar", note: { uz: 'Ustunlari: joy_id, mashina, tolov, vaqt', ru: 'Столбцы: joy_id, mashina, tolov, время' } },
  { front: { uz: "Sessiyani o'z joyiga qaysi ustun bog'laydi?", ru: 'Какой столбец привязывает сеанс к его месту?' }, back: "joy_id", note: { uz: "Bunday bog'lovchi ustun — foreign key, u joylar.id ga ishora qiladi", ru: 'Такой связывающий столбец — foreign key, он указывает на joylar.id' } },
  { front: { uz: "Bitta joyga kun bo'yi nechta sessiya to'g'ri keladi?", ru: 'Сколько сеансов за день приходится на одно место?' }, back: { uz: "Ko'p (one-to-many)", ru: 'Много (one-to-many)' }, note: { uz: 'A2 joyini kun davomida turli mashinalar band qiladi', ru: 'Место A2 за день занимают разные машины' } },
  { front: { uz: 'Mashina kirganda server qaysi amalni bajaradi?', ru: 'Какую операцию выполняет сервер, когда машина въезжает?' }, back: "POST", note: { uz: 'Yangi sessiya yoziladi, bandmi = true 🟥', ru: 'Записывается новый сеанс, bandmi = true 🟥' } },
  { front: { uz: 'Mashina chiqqanda qaysi amal ishlaydi?', ru: 'Какая операция срабатывает, когда машина выезжает?' }, back: "PUT", note: { uz: "Chiqqan vaqt va to'lov yoziladi, bandmi = false 🟩", ru: 'Пишется время выезда и оплата, bandmi = false 🟩' } },
  { front: { uz: 'Kirgan va chiqqan vaqtni kim yozadi?', ru: 'Кто записывает время въезда и выезда?' }, back: "NOW()", note: { uz: "Vaqtni qo'lda yozmaysiz — server o'zi qo'yadi", ru: 'Время не пишете вручную — сервер ставит сам' } },
  { front: { uz: "Tarixda joy_id o'rniga A2 belgisi ko'rinishi uchun nima kerak?", ru: 'Что нужно, чтобы в истории вместо joy_id было видно A2?' }, back: "JOIN", note: "ON sessiyalar.joy_id = joylar.id" },
  { front: { uz: 'Kunlik jami tushumni qaysi buyruq hisoblaydi?', ru: 'Какая команда считает общую дневную выручку?' }, back: "SUM(tolov)", note: { uz: "SUM barcha to'lovlarni qo'shib jamlaydi", ru: 'SUM складывает все оплаты' } },
  { front: { uz: 'Qorovul uchun panel qanday qilib yasaladi?', ru: 'Каким делают экран панели для охранника?' }, back: { uz: 'Rangli, katta tugmali, kam matnli', ru: 'Цветным, с крупными кнопками, с малым текстом' }, note: { uz: "Qorovul o'qib o'tirmaydi — bir qarashda tushunishi kerak", ru: 'Охранник не читает — он должен понять с одного взгляда' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tushunchalarni <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <>Быстро <span className="italic" style={{ color: T.accent }}>повторим понятия</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Loyihani topshirishdan oldin bugungi tushunchalarni takrorlaymiz. Har kartada bir savol — <b style={{ color: T.ink }}>javobini</b> o'ylang, keyin kartani bosib tekshiring. <b style={{ color: T.ink }}>Bildim</b> yoki <b style={{ color: T.ink }}>Takrorlash</b> bilan baholang.</>, ru: <>Перед сдачей проекта повторим сегодняшние понятия. На каждой карточке — вопрос: подумайте, <b style={{ color: T.ink }}>каким будет ответ</b>, затем нажмите на карточку и проверьте себя. Оцените кнопками <b style={{ color: T.ink }}>Знаю</b> или <b style={{ color: T.ink }}>Повторить</b>.</> })}</Mentor>
        <div className="fc-center"><Flashcards cards={STOYANKA_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== 🏅 ACHIEVEMENTS (nishonlar) — REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  architect: { icon: '🏗️', name: 'Schema Master!', desc: { uz: "ME'MOR sinovi: jadval ustuni va tipini to'g'ri tanladingiz", ru: 'Испытание АРХИТЕКТОРА: Вы верно выбрали столбец и тип таблицы' } },
  wired:     { icon: '🔌', name: 'Wired Up!',    desc: { uz: "REJISSYOR sinovi: kirish amalini (POST) to'g'ri topdingiz", ru: 'Испытание РЕЖИССЁРА: Вы верно нашли операцию въезда (POST)' } },
  joiner:    { icon: '🔗', name: 'Join Champ!',  desc: { uz: "JOIN bilan ikki jadvalni birlashtirishni bildingiz", ru: 'Вы разобрались, как объединять две таблицы через JOIN' } },
  opened:    { icon: '🚦', name: 'Grand Opening!', desc: { uz: "Yakuniy sinov: bog'lanish shartini o'zingiz yozdingiz", ru: 'Финальное испытание: Вы сами написали условие связи' } },
};
// Ekran id → nishon (recordAnswer'da, MA'NOLI solve: FAQAT ballik testlar — SCORED_IDX [4,7,12,16,20])
const ACH_TRIGGERS = { s4: 'architect', s10: 'wired', s13: 'joiner', s16: 'opened' };

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

// SCORED_IDX → mavzu yorlig'i (podium savol-nuqtalari uchun)
const Q_LABELS = { 4: { uz: "1 — Bandmi (BOOLEAN)", ru: '1 — Занятость (BOOLEAN)' }, 7: { uz: "2 — Bog'lovchi (joy_id)", ru: '2 — Связка (joy_id)' }, 12: { uz: "3 — Kirish (POST)", ru: '3 — Въезд (POST)' }, 16: { uz: "4 — Birlashtirish (JOIN)", ru: '4 — Объединение (JOIN)' }, 20: { uz: "5 — Yakuniy (JOIN ON)", ru: '5 — Финал (JOIN ON)' } };
// Server-baholash javob kaliti (mentor ochganda avto-yuklanadi). s16 = -1 (yakuniy amaliy).
const INLINE_KEYS = { s4: 2, s7: 1, s10: 3, s13: 2, s16: -1 };

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
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появляется рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не подключился.' })}</p></div>
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
              {live.mode === 'mentor' && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.', ru: 'Вопросы со знаком ⚠️ — темы, где класс споткнулся. Рекомендуется объяснить их ещё раз.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];

// Arena foni: suzuvchi tokenlar — dars mavzusidan (fullstack · baza · JOIN)
const QZ_BG_SHAPES = [
  { ch: 'CREATE TABLE', l: 5,  t: 10, s: 26, c: 'rgba(120,235,175,0.15)', d: 19, dl: 0 },
  { ch: 'joy_id',       l: 84, t: 7,  s: 28, c: 'rgba(80,200,255,0.16)',  d: 23, dl: 1.5 },
  { ch: 'JOIN',         l: 8,  t: 72, s: 30, c: 'rgba(80,200,255,0.15)',  d: 27, dl: 0.8 },
  { ch: 'POST',         l: 80, t: 68, s: 28, c: 'rgba(120,235,175,0.15)', d: 21, dl: 2.2 },
  { ch: 'PUT',          l: 44, t: 86, s: 28, c: 'rgba(255,110,70,0.14)',  d: 25, dl: 1.1 },
  { ch: 'GET',          l: 66, t: 26, s: 26, c: 'rgba(120,235,175,0.14)', d: 17, dl: 0.4 },
  { ch: 'fetch',        l: 26, t: 34, s: 26, c: 'rgba(80,200,255,0.13)',  d: 20, dl: 1.9 },
  { ch: '🅿️',           l: 55, t: 5,  s: 26, c: 'rgba(255,110,70,0.16)',  d: 22, dl: 0.6 },
  { ch: 'REFERENCES',   l: 91, t: 42, s: 22, c: 'rgba(203,173,255,0.14)', d: 24, dl: 1.3 },
  { ch: 'BOOLEAN',      l: 2,  t: 45, s: 24, c: 'rgba(120,235,175,0.14)', d: 26, dl: 2.6 },
  { ch: 'NOW()',        l: 38, t: 58, s: 24, c: 'rgba(203,173,255,0.13)', d: 18, dl: 1.2 },
  { ch: '🟩',           l: 70, t: 50, s: 24, c: 'rgba(120,235,175,0.18)', d: 23, dl: 0.3 },
];

const QUIZ_BANK = [
  { q: { uz: "Baza (2 jadval) nima uchun kerak?", ru: 'Зачем нужна база (2 таблицы)?' }, opts: [{ uz: "Ma'lumotni saqlash va bog'lash uchun", ru: 'Чтобы хранить и связывать данные' }, { uz: "Faqat rang berish uchun", ru: 'Только чтобы задавать цвета' }, { uz: "Sahifani bezash uchun", ru: 'Чтобы украшать страницу' }, { uz: "Internet tezligini oshirib berish uchun", ru: 'Чтобы ускорять интернет' }], correct: 0 },
  { q: { uz: "Joy bandligi qaysi turda saqlanadi?", ru: 'В каком типе хранится занятость места?' }, opts: [{ uz: "`TEXT` (matn)", ru: '`TEXT` (текст)' }, { uz: "`SERIAL` (raqam)", ru: '`SERIAL` (число)' }, "`BOOLEAN` (true/false)", { uz: "`TIMESTAMP` (sana va vaqt)", ru: '`TIMESTAMP` (дата и время)' }], correct: 2 },
  { q: { uz: "Sessiyani joyga qaysi ustun bog'laydi?", ru: 'Какой столбец привязывает сеанс к месту?' }, opts: ["`mashina`", "`joy_id`", "`tolov`", "`kirgan`"], correct: 1 },
  { q: { uz: "`REFERENCES joylar(id)` nima beradi?", ru: 'Что даёт `REFERENCES joylar(id)`?' }, opts: [{ uz: "Yangi jadval yaratib beradi", ru: 'Создаёт новую таблицу' }, { uz: "Ustunga rang qo'shib beradi", ru: 'Добавляет столбцу цвет' }, { uz: "So'rov tezligini oshiradi", ru: 'Ускоряет запросы' }, { uz: "Foreign key bog'lanishi beradi", ru: 'Даёт связь foreign key' }], correct: 3 },
  { q: { uz: "Mashina kirganda qaysi amal ishlaydi?", ru: 'Какая операция срабатывает при въезде машины?' }, opts: [ "`DELETE`", "`GET`","`POST`", "`CSS`"], correct: 2 },
  { q: { uz: "Mashina chiqqanida qaysi amal ishlaydi?", ru: 'Какая операция срабатывает при выезде машины?' }, opts: ["`GET`", "`DELETE`", "`POST`", "`PUT`"], correct: 3 },
  { q: { uz: "Ikki jadvalni birga o'qish uchun?", ru: 'Чем читать две таблицы вместе?' }, opts: [ "`JOIN`", "`DELETE`","`INSERT`", "`DROP`"], correct: 0 },
  { q: { uz: "JOIN `ON` sharti qanday yoziladi?", ru: 'Как пишется условие `ON` у JOIN?' }, opts: ["`id = mashina`", "`joy_id = id`", "`raqam = joy`", "`tolov = id`"], correct: 1 },
  { q: { uz: "Joylarni panelga qanday olamiz?", ru: 'Как получить места на панель?' }, opts: [ "`DROP`", "`PUT`", "`DELETE`","`GET`"], correct: 3 },
  { q: { uz: "Panel rangi nimaga qarab o'zgaradi?", ru: 'От чего зависит цвет панели?' }, opts: ["`mashina`", "`bandmi`", "`tolov`", "`id`"], correct: 1 },
  { q: { uz: "Qorovulga eng yaxshi panel qanday?", ru: 'Какая панель лучше всего для охранника?' }, opts: [{ uz: "Ko'p matn va mayda tugmalar", ru: 'Много текста и мелкие кнопки' }, { uz: "Faqat raqamli quruq jadval", ru: 'Сухая таблица из одних цифр' }, { uz: "Rang + katta tugma + kam matn", ru: 'Цвет + крупные кнопки + мало текста' }, { uz: "Uzun ko'rsatma matni bilan", ru: 'С длинной инструкцией' }], correct: 2 },
  { q: { uz: "Fullstack loyiha nimalardan iborat?", ru: 'Из чего состоит fullstack-проект?' }, opts: [ { uz: "Front + server + baza", ru: 'Фронт + сервер + база' }, { uz: "Faqat ma'lumotlar bazasi", ru: 'Только база данных' }, { uz: "Faqat frontend qismi", ru: 'Только фронтенд' }, { uz: "Faqat rang va bezaklar", ru: 'Только цвета и украшения' }], correct: 0 },
];

const quizPts = (elapsedMs) => elapsedMs <= 500 ? 1000 : Math.max(0, Math.round(1000 * (1 - (Math.min(elapsedMs, QUIZ_MS) / QUIZ_MS) / 2)));
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

function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['CREATE TABLE', 'joy_id', 'JOIN', 'POST', 'PUT', 'GET', 'fetch', 'REFERENCES', 'BOOLEAN', 'NOW()'];
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
  const [phase, setPhase] = useState('lobby');
  const [qi, setQi] = useState(-1);
  const [remaining, setRemaining] = useState(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState({});
  const [players, setPlayers] = useState([]);
  const [qRows, setQRows] = useState([]);
  const [answeredN, setAnsweredN] = useState(0);
  const [classEnded, setClassEnded] = useState(false);
  const seenQRef = useRef(-1);
  const qStartRef = useRef(0);
  const deadlineRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (!isStudent || solo || !live.playerId) return;
    liveQuizAnswers(live.pin).then(rows => {
      const mine = {};
      rows.filter(r => r.player_id === live.playerId).forEach(r => { mine[r.screen_idx - QUIZ_BASE_IDX] = { picked: r.picked, correct: r.correct, elapsed: r.elapsed_ms }; });
      setMyAnswers(m => ({ ...mine, ...m }));
    }).catch(() => {});
  }, []); // eslint-disable-line

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

      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме тренировки' })}</button>
        </div>
      )}

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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: '🏁 Natijani ko\'rish', ru: '🏁 Посмотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Далее →' })}</button>}
        </div>
      )}

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
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загрузка…' })}</p>
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
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Отмечайте каждый шаг по мере выполнения. Когда закончите, нажмите <b style={{ color: T.ink }}>«Выполнил(а)»</b> — наставник следит за прогрессом.</> })}</Mentor>
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
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: 'Отлично! Задание выполнено. Наставник проверит и переведёт Вас на следующий шаг.' })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
}

const ScreenPractice1 = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "ME'MOR: baza — 2 jadval va bog'lanish", ru: 'АРХИТЕКТОР: база — 2 таблицы и связь' }}
    task={{ uz: "VS Code'da yangi loyiha oching va AI yordamchisiga (Antigravity) ikki bog'langan jadval sxemasini yozdiring: joylar va sessiyalar. Sessiyalardagi joy_id — foreign key: u joylar jadvalidagi id ga ishora qiladi. Reja tasdiqlangach, kelgan SQL kodini o'qing va 4-5 ta namuna joy qo'shing.", ru: 'Откройте новый проект в VS Code и поручите ИИ-помощнику (Antigravity) написать схему двух связанных таблиц: joylar и sessiyalar. joy_id в sessiyalar — foreign key: он указывает на id в таблице joylar. Когда план подтверждён, прочитайте полученный SQL-код и добавьте 4-5 примерных мест.' }}
    checklist={[
      { uz: "Terminalda `npm create vite@latest avto-stoyanka` buyrug'ini yozing — React (JavaScript) tanlang", ru: 'В терминале выполните `npm create vite@latest avto-stoyanka` — выберите React (JavaScript)' },
      { uz: "AI'ga sxemani buyuring: `joylar` (id, raqam, `bandmi BOOLEAN`) va `sessiyalar` (id, joy_id, mashina, tolov, kirgan)", ru: 'Поручите ИИ схему: `joylar` (id, raqam, `bandmi BOOLEAN`) и `sessiyalar` (id, joy_id, mashina, tolov, kirgan)' },
      { uz: "Bog'lanishni alohida ayting: `joy_id` → `joylar(id)` — bu foreign key", ru: 'Отдельно назовите связь: `joy_id` → `joylar(id)` — это foreign key' },
      { uz: "Rejani tasdiqlang va kelgan `CREATE TABLE` kodini o'qing: ikkala jadval ham bormi?", ru: 'Подтвердите план и прочитайте полученный `CREATE TABLE`: обе таблицы на месте?' },
      { uz: "4-5 ta namuna joy (A1, A2, B1…) qo'shishni so'rang va jadvalga qarab tekshiring", ru: 'Попросите добавить 4-5 примерных мест (A1, A2, B1…) и проверьте по таблице' },
    ]} />
);
const ScreenPractice2 = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "REJISSYOR: server — kirish va chiqish", ru: 'РЕЖИССЁР: сервер — въезд и выезд' }}
    task={{ uz: "AI'ga serverning ikki endpointini yozdiring: mashina kirganda POST, chiqqanda PUT. Kelgan kodni o'qing va Postman'da POST'ni sinab ko'ring — joy rostdan band bo'ldimi?", ru: 'Поручите ИИ два endpoint-а сервера: POST при въезде машины, PUT при выезде. Прочитайте полученный код и проверьте POST в Postman — место действительно стало занятым?' }}
    checklist={[
      { uz: "AI'ga buyuring: `POST /api/sessiyalar` — yangi sessiya yozsin, joyni band qilsin (`bandmi=true`), vaqtni `NOW()` qo'ysin", ru: 'Поручите ИИ: `POST /api/sessiyalar` — пусть запишет новый сеанс, займёт место (`bandmi=true`) и поставит время `NOW()`' },
      { uz: "AI'ga buyuring: `PUT /api/sessiyalar/:id` — chiqqan vaqtni yozsin, `tolov=10000` qo'ysin, joyni bo'shatsin (`bandmi=false`)", ru: 'Поручите ИИ: `PUT /api/sessiyalar/:id` — пусть запишет время выезда, поставит `tolov=10000` и освободит место (`bandmi=false`)' },
      { uz: "Kelgan kodni o'qing: har bir endpointda ikkita amal (sessiyaga yozish + joyni yangilash) bormi?", ru: 'Прочитайте код: в каждом endpoint есть два действия (запись сеанса + обновление места)?' },
      { uz: "Postman'da `POST` so'rovini yuboring: yangi sessiya qo'shildimi, joy 🟥 band bo'ldimi?", ru: 'Отправьте `POST`-запрос в Postman: сеанс добавился, место стало 🟥 занятым?' },
    ]} />
);
const ScreenPractice3 = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "REJISSYOR: qorovul paneli (front)", ru: 'РЕЖИССЁР: панель охранника (фронт)' }}
    task={{ uz: "AI'ga qorovul panelini yozdiring: joylarni GET bilan yuklasin va har joyni katta rangli tugma qilib ko'rsatsin (bo'sh 🟩 yashil, band 🟥 qizil). So'ng panelni qorovulga moslab soddalashtiring va brauzerda sinang.", ru: 'Поручите ИИ панель охранника: пусть загрузит места через GET и покажет каждое крупной цветной кнопкой (свободно 🟩 зелёная, занято 🟥 красная). Затем упростите панель под охранника и проверьте в браузере.' }}
    checklist={[
      { uz: "AI'ga buyuring: joylarni `GET` bilan yuklasin — har joy katta tugma: bo'sh 🟩 yashil, band 🟥 qizil", ru: 'Поручите ИИ: загрузить места через `GET` — каждое место крупная кнопка: свободно 🟩 зелёная, занято 🟥 красная' },
      { uz: "AI'ga buyuring: bo'sh joy bosilsa `POST` (mashina kiradi), band joy bosilsa `PUT` (mashina chiqadi)", ru: 'Поручите ИИ: клик по свободному месту — `POST` (машина въезжает), по занятому — `PUT` (машина выезжает)' },
      { uz: "Qorovulga moslang: kam matn, katta tugma, kunlik tushum eng tepada ko'rinsin", ru: 'Подстройте под охранника: мало текста, крупные кнопки, дневная выручка на самом верху' },
      { uz: "Brauzerda `localhost` ni oching va sinang: bir bosishda kirish va chiqish ishlayaptimi?", ru: 'Откройте `localhost` в браузере и проверьте: въезд и выезд работают в одно нажатие?' },
    ]} />
);
const ScreenPractice4 = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "NAZORATCHI: qorovul sinovi va ochilish", ru: 'КОНТРОЛЁР: испытание охранником и открытие' }}
    task={{ uz: "Kunlik tarixni JOIN bilan chiqaring va tushumni tekshiring. So'ng panelni yoningizdagi do'stingizga bering — bu «QOROVUL SINOVI»: u hech narsa tushuntirmasangiz ham bir bosishda mashina kirgiza oladimi? Ishlasa, «Bajardim» tugmasini bosing va stoyankani oching.", ru: 'Выведите дневную историю через JOIN и проверьте выручку. Затем дайте панель соседу — это «ИСПЫТАНИЕ ОХРАННИКОМ»: сможет ли он одним нажатием впустить машину без Ваших объяснений? Если работает — нажмите «Выполнил(а)» и откройте стоянку.' }}
    checklist={[
      { uz: "AI'ga buyuring: bugungi tarix `JOIN` bilan chiqsin — `sessiyalar JOIN joylar ON joy_id = id` (joy belgisi, mashina, to'lov)", ru: 'Поручите ИИ: вывести сегодняшнюю историю через `JOIN` — `sessiyalar JOIN joylar ON joy_id = id` (место, машина, оплата)' },
      { uz: "Kunlik jami tushumni chiqarishni so'rang — `SUM(tolov)` barcha to'lovlarni qo'shib jamlaydi", ru: 'Попросите вывести дневную общую выручку — `SUM(tolov)` складывает все оплаты' },
      { uz: "QOROVUL SINOVI: panelni do'stingizga bering — tushuntirmasangiz ham bir bosishda mashina kirgiza oldimi?", ru: 'ИСПЫТАНИЕ ОХРАННИКОМ: дайте панель другу — смог ли он без объяснений впустить машину одним нажатием?' },
      { uz: "Ishlasa, «Bajardim» tugmasini bosing va 🚦 stoyankani rasman oching", ru: 'Если работает — нажмите «Выполнил(а)» и 🚦 официально откройте стоянку' },
    ]} />
);

// 🚦 «Stoyanka ochilish akti» — qurilish holati tracker strip (barcha ekran ustida)
const TRACKER_STEPS = [
  { id: 'p1', ic: '🏗️', label: { uz: 'Sxema', ru: 'Схема' } },
  { id: 'p2', ic: '🔌', label: { uz: 'Backend', ru: 'Бэкенд' } },
  { id: 'p3', ic: '🅿️', label: { uz: 'Panel', ru: 'Панель' } },
  { id: 'p4', ic: '🚦', label: { uz: 'Sinov', ru: 'Проверка' } },
];
function DeliveryTracker({ answers }) {
  const idxOf = (id) => SCREEN_META.findIndex(m => m.id === id);
  const doneCount = TRACKER_STEPS.filter(st => answers[idxOf(st.id)] && answers[idxOf(st.id)].solved).length;
  const allDone = doneCount >= TRACKER_STEPS.length;
  // 🎬 «OCHILISH AKTI» — 4/4 bo'lgan lahzada bir marta: shlagbaum ko'tariladi + uchqun burjlari
  const [act, setAct] = useState(false);
  const firedRef = useRef(false);
  useEffect(() => {
    if (!allDone || firedRef.current) return;
    firedRef.current = true;
    setAct(true);
    const t = setTimeout(() => setAct(false), 2800);
    return () => clearTimeout(t);
  }, [allDone]);
  return (
    <div className={`dtrack ${allDone ? 'shipped' : ''} ${act ? 'act' : ''}`} aria-label={tr({ uz: 'AvtoStoyanka — qurilish holati', ru: 'AvtoStoyanka — статус стройки' })}>
      <span className="dtrack-lbl">🏗️ AvtoStoyanka</span>
      <div className="dtrack-steps">
        {TRACKER_STEPS.map((st, i) => {
          const on = !!(answers[idxOf(st.id)] && answers[idxOf(st.id)].solved);
          // --i → ketma-ket to'lish (bir vaqtda bir nechtasi yonsa ham navbat bilan)
          return <span key={st.id} style={{ '--i': i }} className={`dtrack-step ${on ? 'on' : ''}`}><span className="dtrack-mark">{on ? '✓' : '☐'}</span> {st.ic} {tr(st.label)}</span>;
        })}
      </div>
      {/* 🚦 Shlagbaum: yopiq turadi → 4/4 da ko'tariladi */}
      <span className={`dtrack-gate ${allDone ? 'up' : ''}`} aria-hidden="true"><i className="dtrack-arm" /></span>
      {allDone && <span className="dtrack-ship">{tr({ uz: '🚦 Stoyanka ochildi', ru: '🚦 Стоянка открыта' })}</span>}
      {act && <span className="dtrack-burst" aria-hidden="true">{Array.from({ length: 12 }).map((_, i) => <i key={i} style={{ '--a': `${i * 30}deg`, animationDelay: `${(i % 4) * 0.06}s` }} />)}</span>}
    </div>
  );
}

// ============================================================ LESSON ROOT
export default function FullstackProjectDayLesson({ lang: langProp, onFinished }) {
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
  // ETALON — 1920px avto-zoom (--lz): keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, window.innerWidth / 1920)); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
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
  const reset = () => { setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };

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
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scoredMeta.length, correctAnswers,
      scorePercent: scoredMeta.length ? Math.round((correctAnswers / scoredMeta.length) * 100) : 0,
      finalScore: finalCorrect, finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : (scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false),
      answers: SCREEN_META.map((s, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === 'function') onFinished(payload);
  };

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, ScreenPractice1, Screen8, Screen9, Screen9b, Screen10, ScreenPractice2, Screen11, Screen12, Screen13, ScreenPractice3, Screen14, Screen15, Screen16, ScreenPractice4, ScreenPodium, ScreenFlashcards, Screen17];
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
        @keyframes spot-pop { 0% { transform: scale(1); } 45% { transform: scale(1.09); } 100% { transform: scale(1); } }
        .spot-flash { animation: spot-pop 0.45s ease; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.ink}; color: ${T.bg}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.6; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }

        /* === VCARD === */
        .vcard { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 12px 15px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover { transform: translateY(-1px); }
        .vbadge { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; color: #fff; padding: 4px 9px; border-radius: 6px; letter-spacing: 0.02em; }
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
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI === */
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

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 12px; color: ${CODE.text}; padding: 7px 9px; border-radius: 6px; white-space: pre-wrap; line-height: 1.6; }
        .ai-line.ok { background: rgba(31,122,77,0.16); }
        .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
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
        /* 🎬 xulosa punktlari birdaniga emas — navbat bilan chiqadi (stagger) */
        .recap li:nth-child(1) { animation-delay: 0.05s; } .recap li:nth-child(2) { animation-delay: 0.17s; } .recap li:nth-child(3) { animation-delay: 0.29s; } .recap li:nth-child(4) { animation-delay: 0.41s; } .recap li:nth-child(n+5) { animation-delay: 0.53s; }
        @media (prefers-reduced-motion: reduce) { .recap li { animation: none !important; opacity: 1 !important; } }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }

        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        /* AI'ga prompt — ma'lumot bloki (AI rangi = ${T.blue}). Qizil/accent fon FAQAT xato uchun (frame-soft). */
        .prompt-box { background: ${T.paper}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: 13px 15px; margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(11.5px,1.4vw,13px); line-height: 1.7; color: ${T.ink}; white-space: pre-wrap; word-break: break-word; box-shadow: 0 6px 16px -8px rgba(1,154,203,0.2); }
        .plate-input { width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; letter-spacing: 0.06em; text-align: center; padding: 11px 12px; border-radius: 10px; border: 1.5px dashed ${T.ink3}; background: ${T.bg}; color: ${T.ink}; outline: none; transition: border-color 0.2s, background 0.2s; }
        .plate-input:focus { border-color: ${T.accent}; background: #fff; }
        .plate-input::placeholder { color: ${T.ink3}; font-weight: 500; letter-spacing: 0.02em; }

        /* === QOROVUL PANELI === */
        .guard { border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.2); }
        .guard-top { background: ${CODE.bg}; color: #fff; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .guard-title { font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; } .guard-title small { font-weight: 500; color: ${CODE.punct}; }
        .guard-stats { display: flex; gap: 8px; } .gst { font-family: 'Manrope'; font-weight: 800; font-size: 12px; padding: 3px 9px; border-radius: 99px; } .gst.free { background: rgba(31,122,77,0.25); } .gst.busy { background: rgba(194,54,43,0.3); }
        .guard-body { padding: 12px; }
        .guard-foot { padding: 9px 14px; background: ${T.bg}; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; display: flex; align-items: center; justify-content: space-between; gap: 8px; } .guard-foot b { color: ${T.ink}; }
        .pgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .spot { border: none; border-radius: 12px; padding: 10px 6px; display: flex; flex-direction: column; align-items: center; gap: 3px; min-height: 80px; justify-content: center; position: relative; transition: all 0.2s; }
        .spot.free { background: linear-gradient(165deg, #F2F9F4, ${T.successSoft}); box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.28); }
        .spot.busy { background: linear-gradient(165deg, #FDEFEC, ${T.dangerSoft}); box-shadow: inset 0 0 0 1.5px rgba(194,54,43,0.35); }
        .spot:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.28); }
        .spot.spot-sel { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.4); }
        .spot-tag { font-family: 'Manrope'; font-weight: 800; font-size: 8px; color: #fff; padding: 1px 7px; border-radius: 99px; letter-spacing: 0.04em; }
        .spot-ico { font-size: 21px; line-height: 1; }
        .spot.free .spot-ico { color: ${T.ink3}; opacity: 0.5; }
        .spot-num { font-family: 'JetBrains Mono'; font-weight: 800; font-size: 14px; }
        .spot.free .spot-num { color: ${T.success}; } .spot.busy .spot-num { color: ${T.danger}; }
        .spot-plate { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 8.5px; color: ${T.danger}; }

        /* === 🎬 QOROVUL PANELI — BAND/BO'SH JONLI O'TISHI ===
           Rang/fon transition bilan silliq oqadi; mashina joyga "kirib keladi"/"chiqib ketadi". */
        .spot { transition: background 0.35s ease, box-shadow 0.25s ease, transform 0.2s ease, opacity 0.25s ease; }
        /* panel ochilganda joylar navbat bilan chiqadi (stagger).
           fill-mode = backwards (both EMAS): aks holda tugagach "transform: none" qotib qoladi va :hover ko'tarilishi o'lik bo'ladi. */
        .pgrid > .spot { animation: spot-in 0.4s cubic-bezier(.3,1.3,.5,1) backwards; }
        /* .spot.spot-flash (0,2,0) > .pgrid > .spot (0,1,1) — mavjud spot-pop yashab qoladi */
        .spot.spot-flash { animation: spot-pop 0.45s ease; }
        .pgrid > .spot:nth-child(1) { animation-delay: 0.02s; } .pgrid > .spot:nth-child(2) { animation-delay: 0.07s; }
        .pgrid > .spot:nth-child(3) { animation-delay: 0.12s; } .pgrid > .spot:nth-child(4) { animation-delay: 0.17s; }
        .pgrid > .spot:nth-child(5) { animation-delay: 0.22s; } .pgrid > .spot:nth-child(6) { animation-delay: 0.27s; }
        .pgrid > .spot:nth-child(n+7) { animation-delay: 0.32s; }
        @keyframes spot-in { from { opacity: 0; transform: translateY(8px) scale(0.94); } to { opacity: 1; transform: none; } }
        /* mashina kirdi (POST → bandmi=true): chapdan sursilib keladi va "to'xtaydi" */
        .spot-ico.drive-in { animation: spot-drive-in 0.5s cubic-bezier(.22,1.15,.36,1) backwards; }
        @keyframes spot-drive-in { 0% { opacity: 0; transform: translateX(-26px) scale(0.82); } 62% { opacity: 1; transform: translateX(3px) scale(1.08); } 100% { transform: translateX(0) scale(1); } }
        /* mashina chiqdi (PUT → bandmi=false): bo'sh belgisi yumshoq paydo bo'ladi */
        .spot-ico.drive-out { animation: spot-drive-out 0.4s ease backwards; }
        @keyframes spot-drive-out { 0% { opacity: 0; transform: translateX(18px) scale(0.9); } 100% { opacity: 0.5; transform: none; } }
        .spot-tag { animation: spot-tag-pop 0.4s cubic-bezier(.3,1.5,.5,1) backwards; }
        @keyframes spot-tag-pop { 0% { transform: scale(0.5); opacity: 0; } 55% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); } }
        .spot-plate { animation: spot-plate-rise 0.35s ease 0.12s backwards; }
        @keyframes spot-plate-rise { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        /* server javobi tushgan joy — halqa to'lqini */
        .spot-flash::after { content: ""; position: absolute; inset: 0; border-radius: 12px; border: 2px solid ${T.accent}; pointer-events: none; animation: spot-ring 0.7s ease-out forwards; }
        @keyframes spot-ring { 0% { opacity: 0.85; transform: scale(1); } 100% { opacity: 0; transform: scale(1.14); } }
        /* jonli hisoblagich: 🟩/🟥 soni o'zgarganda sakraydi */
        .gst { animation: gst-bump 0.45s cubic-bezier(.3,1.6,.5,1) both; }
        @keyframes gst-bump { 0% { transform: scale(1); } 35% { transform: scale(1.22); } 100% { transform: scale(1); } }
        .guard-sum { display: inline-block; animation: guard-sum-pop 0.5s cubic-bezier(.3,1.5,.5,1) both; }
        @keyframes guard-sum-pop { 0% { transform: translateY(6px) scale(0.85); opacity: 0.2; } 55% { transform: translateY(-2px) scale(1.09); opacity: 1; } 100% { transform: none; opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .pgrid > .spot, .spot-ico.drive-in, .spot-ico.drive-out, .spot-tag, .spot-plate, .spot-flash::after, .gst, .guard-sum { animation: none !important; }
          .spot-ico.drive-out { opacity: 0.5; }
        }

        /* === 🎬 tap-hint affordance — bosilmagan element "meni bos" deydi === */
        /* .vcard: asosiy soyani keyframe ichida saqlaymiz (aks holda animatsiya uni o'chiradi) */
        .vcard.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16), 0 0 0 0 rgba(255,79,40,0.38); } 70%, 100% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16), 0 0 0 8px rgba(255,79,40,0); } }
        /* .spot: inset ramka (free/busy) va spot-in kirishi buzilmasin — halqa ::before orqali */
        .spot.tap-hint::before { content: ""; position: absolute; inset: 0; border-radius: 12px; pointer-events: none; animation: tap-hint-ring 2.1s ease-out infinite; }
        @keyframes tap-hint-ring { 0% { box-shadow: 0 0 0 0 rgba(255,79,40,0.36); } 70%, 100% { box-shadow: 0 0 0 8px rgba(255,79,40,0); } }
        .vseen.on { display: inline-block; animation: vseen-stamp 0.38s cubic-bezier(.3,1.6,.5,1) both; }
        @keyframes vseen-stamp { 0% { transform: scale(0.3) rotate(-18deg); opacity: 0; } 55% { transform: scale(1.35) rotate(4deg); opacity: 1; } 100% { transform: scale(1) rotate(0); } }
        @media (prefers-reduced-motion: reduce) { .vcard.tap-hint, .spot.tap-hint::before, .vseen.on { animation: none !important; } }

        /* === 🎬 rejim/holat almashinuvi — kontent "sakramaydi" === */
        .sk-swapin { animation: sk-swapin 0.42s cubic-bezier(.3,1.15,.4,1) both; }
        @keyframes sk-swapin { 0% { opacity: 0; transform: translateY(10px) scale(0.985); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .sk-swapin { animation: none !important; } }

        /* === DB JADVAL === */
        .db { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.18); background: #fff; }
        .db-cap { background: ${T.line}; padding: 8px 12px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; color: ${T.ink2}; } .db-cap b { color: ${T.ink}; } .db-cap span { color: ${T.ink3}; }
        .db-row { display: grid; gap: 8px; padding: 8px 12px; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; border-top: 1px solid ${T.line}; }
        .db-head { background: ${CODE.bg}; color: ${CODE.punct}; font-weight: 700; border-top: none; }
        .db-row.flash { background: ${T.successSoft}; }

        /* === BOG'LANISH (rel) === */
        .rel { display: flex; flex-direction: column; gap: 8px; align-items: center; }
        .rel-box { width: 100%; background: #fff; border-radius: 11px; padding: 10px 13px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.18); display: flex; flex-wrap: wrap; align-items: center; gap: 8px; } .rel-box b { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink}; margin-right: 4px; } .rel-box .mono { font-size: 11px; color: ${T.ink3}; background: ${T.bg}; padding: 2px 7px; border-radius: 6px; }
        .rel-link { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono'; font-size: 11.5px; } .rel-key { font-weight: 700; } .rel-arr { color: ${T.blue}; font-weight: 700; } .rel-to { color: ${T.ink2}; }

        /* === TARIX === */
        .tarix { display: flex; flex-direction: column; gap: 5px; }
        .tarix-row { display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 9px; padding: 8px 11px; font-family: 'JetBrains Mono'; font-size: 11.5px; box-shadow: 0 3px 10px -6px rgba(${T.shadowBase},0.16); }

        /* === HOOK QOG'OZ === */
        /* Qorovul daftari — LMS yuklaydigan shriftlar bilan (Caveat yuklanmaydi → fallback chalkash bo'lardi) */
        .paper { background: #FCFBF5; border-radius: 10px; padding: 14px 16px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.2); cursor: pointer; background-image: repeating-linear-gradient(transparent, transparent 25px, ${T.line} 25px, ${T.line} 26px); }
        .paper-line { font-family: 'Source Serif 4', Georgia, serif; font-style: italic; font-size: 14.5px; color: ${T.ink2}; line-height: 26px; margin: 0; }
        .paper-scribble { font-family: 'Source Serif 4', Georgia, serif; font-style: italic; font-size: 15.5px; color: ${T.danger}; line-height: 26px; margin: 4px 0 0; transform: rotate(-2deg); font-weight: 600; }

        /* === Jonli panel (LiveBadge) — xira turadi, ustiga borilganda tiniqlashadi (kontentni to'smaydi) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

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

        /* ===================== v18 QATLAMLAR CSS ===================== */
        /* === kod chip (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }

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

        /* === MENTOR STATISTIKASI === */
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

        /* === 📖 QAYTA TUSHUNTIRISH (recap overlay) === */
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

        /* ===== ⚡ JONLI QATLAM CSS (Kahoot-kutish · MentorTestStats · CodeStrike arena · qcode-chip) — L1 etalondan =====
           ⚡ CodeStrike CTA (yakun sahifasida) */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }

        /* ===== ⚡ ARENA ===== */
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
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

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
        .pod-my b { color: ${T.success}; } /* 11.16 — o'z bali YASHIL (qizil faqat xato javob uchun) */
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

        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; animation: opt-wait-breathe 1.9s ease-in-out infinite; }
        @keyframes opt-wait-breathe { 0%,100% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3); } 50% { box-shadow: inset 0 0 0 2px ${T.blue}, 0 10px 26px -6px rgba(1,154,203,0.5); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        /* === 🃏 FLASHCARDS (3D flip) === */
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
        .fc-tag { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(24px,5vw,40px); letter-spacing: -0.02em; }
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

        /* ===== 🏅 NISHON BAYRAMI ===== */
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

        /* ===== ⚡ CODE STRIKE — NEON-KAPSULA ===== */
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
        /* --- CodeStrike bolt FX qatlami --- */
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

        /* === 🛠️ JONLI PRAKTIKA === */
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

        /* === 🏗️ STOYANKA OCHILISH TRACKER === */
        .dtrack { position: fixed; top: 8px; left: 10px; z-index: 9997; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; max-width: min(60vw, 620px); background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 99px; padding: 5px 12px; box-shadow: 0 6px 18px -8px rgba(${T.shadowBase},0.28); font-family: 'Manrope', sans-serif; }
        .dtrack-lbl { font-weight: 800; font-size: 12px; color: ${T.accent}; white-space: nowrap; }
        .dtrack-steps { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .dtrack-step { font-weight: 600; font-size: 11px; color: ${T.ink3}; white-space: nowrap; border-radius: 99px; padding: 2px 8px; transition: color 0.35s ease, background 0.35s ease; }
        /* 🎬 qadamlar KETMA-KET to'ladi: --i har qadamga o'z navbatini beradi */
        .dtrack-step.on { color: #0B6B43; font-weight: 700; background: rgba(18,169,104,0.13); animation: dt-fill 0.55s ease both; animation-delay: calc(var(--i, 0) * 110ms); }
        @keyframes dt-fill { 0% { background: rgba(18,169,104,0); transform: translateY(2px); } 45% { background: rgba(18,169,104,0.3); transform: translateY(-1px); } 100% { background: rgba(18,169,104,0.13); transform: none; } }
        .dtrack-mark { display: inline-block; }
        .dtrack-step.on .dtrack-mark { color: #12A968; animation: dt-mark-pop 0.42s cubic-bezier(.3,1.5,.5,1) both; animation-delay: calc(var(--i, 0) * 110ms + 60ms); }
        @keyframes dt-mark-pop { 0% { transform: scale(0.4); } 45% { transform: scale(1.45); } 100% { transform: scale(1); } }

        /* 🚦 SHLAGBAUM: qurilish davomida yopiq turadi, 4/4 da ko'tariladi */
        .dtrack-gate { position: relative; width: 26px; height: 14px; flex-shrink: 0; display: inline-flex; align-items: center; }
        .dtrack-gate::before { content: ""; position: absolute; left: 0; bottom: 1px; width: 4px; height: 12px; border-radius: 2px; background: ${T.ink3}; }
        .dtrack-arm { position: absolute; left: 2px; top: 5px; width: 24px; height: 4px; border-radius: 2px; transform-origin: left center; background: repeating-linear-gradient(90deg, ${T.danger} 0 6px, #fff 6px 12px); box-shadow: 0 1px 3px rgba(${T.shadowBase},0.35); transform: rotate(0deg); }
        .dtrack-gate.up .dtrack-arm { animation: dt-gate-lift 1s cubic-bezier(.3,1.35,.45,1) 0.35s both; }
        @keyframes dt-gate-lift { 0% { transform: rotate(0deg); } 30% { transform: rotate(6deg); } 100% { transform: rotate(-72deg); } }

        .dtrack-ship { font-weight: 800; font-size: 11.5px; color: #fff; background: #12A968; border-radius: 99px; padding: 3px 10px; white-space: nowrap; box-shadow: 0 4px 14px -4px rgba(18,169,104,0.55); animation: dt-ship-pop 0.6s cubic-bezier(.25,1.5,.45,1) 0.75s both; }
        @keyframes dt-ship-pop { 0% { opacity: 0; transform: translateX(-8px) scale(0.5); } 55% { opacity: 1; transform: translateX(0) scale(1.16); } 100% { transform: translateX(0) scale(1); } }
        .dtrack.shipped { border-color: #12A96866; box-shadow: 0 6px 18px -8px rgba(18,169,104,0.4); }

        /* 🎉 «OCHILISH AKTI» — bir martalik: strip yonadi + nur o'tadi + uchqun burjlari */
        .dtrack.act { animation: dt-open-glow 2.6s ease-out both; overflow: visible; }
        @keyframes dt-open-glow {
          0% { box-shadow: 0 6px 18px -8px rgba(18,169,104,0.4), 0 0 0 0 rgba(18,169,104,0.5); transform: scale(1); }
          14% { box-shadow: 0 10px 30px -8px rgba(18,169,104,0.6), 0 0 0 10px rgba(18,169,104,0); transform: scale(1.045); }
          30% { transform: scale(1); }
          100% { box-shadow: 0 6px 18px -8px rgba(18,169,104,0.4), 0 0 0 0 rgba(18,169,104,0); transform: scale(1); }
        }
        .dtrack-burst { position: absolute; top: 50%; right: 34px; width: 0; height: 0; pointer-events: none; }
        .dtrack-burst i { position: absolute; top: 0; left: 0; width: 5px; height: 5px; margin: -2.5px 0 0 -2.5px; border-radius: 50%; background: #12A968; box-shadow: 0 0 8px rgba(18,169,104,0.9); transform: rotate(var(--a)) translateX(0) scale(0); opacity: 0; animation: dt-spark 1.1s cubic-bezier(.2,.7,.3,1) both; }
        .dtrack-burst i:nth-child(even) { background: ${T.accent}; box-shadow: 0 0 8px rgba(255,79,40,0.9); }
        @keyframes dt-spark { 0% { transform: rotate(var(--a)) translateX(0) scale(0); opacity: 0; } 25% { opacity: 1; transform: rotate(var(--a)) translateX(14px) scale(1.1); } 100% { transform: rotate(var(--a)) translateX(46px) scale(0.3); opacity: 0; } }

        @media (prefers-reduced-motion: reduce) {
          .dtrack-step.on, .dtrack-step.on .dtrack-mark, .dtrack-ship, .dtrack.act, .dtrack-burst i { animation: none !important; }
          .dtrack-gate.up .dtrack-arm { animation: none !important; transform: rotate(-72deg); }
          .dtrack-burst { display: none; }
        }
        @media (max-width: 760px) { .dtrack { max-width: 92vw; top: 6px; padding: 4px 10px; } .dtrack-lbl { font-size: 11px; } .dtrack-gate { display: none; } }
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Loyiha kuni · AvtoStoyanka', ru: 'Проектный день · AvtoStoyanka' }} />
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
