import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// M2-D13 (PmLesson6) — SISTEMANI QANDAY PITCH QILISH — 2-TUR PM dars
// G'oya: o'quvchi 8-12-darslarda O'ZI qurgan saytni kod bilmaydigan odamga tushuntiradi.
// Misol-ip (91/95/96): maktab yonidagi lavash do'koni sayti; tinglovchi — do'kon egasi.
// Imzo-vizual: TUSHUNISH CHIZIG'I — tanish so'zda ko'tariladi, kasbiy so'zda tushadi.
// Mexanikalar: SO'Z-ELAGI · TINGLOVCHI-JAVOBI · UCH QATLAM · s12 «Bitta gap» (modul-yakuni).
// Artefakt: pm-m2d7-mvp + pm-m1d2-cards → pm-m2d13-pitch (5 bo'lak).
// Keys: K12 Airbnb pitch deck (s5). Senariy: pm-senariylar/M2-D13-Pitch.md
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

// ============================================================
// 🎨 PM-STUDIA IDENTITET (PM_DARS_ETALON 1-bo'lim — barcha PM darslar shu palitrada)
// «Mahsulot-menejerning ish stoli»: chuqur indigo brend + studio-qog'oz fon.
// Rang-qonun (M2-D13 semantikasi): accent(indigo)=brend/e'tibor · success(yashil)=TUSHUNILDI,
// sodda so'z · amber(sarg'ish)=OGOHLANTIRISH, kasbiy so'z (jargon) — xato EMAS ·
// err(qizil)=FAQAT haqiqiy xato (kod ishlamadi) · blue(ko'k)=info/mentor-eslatma.
// CODESTRIKE arenasi o'z brendida (issiq coral) qoladi — u platforma mahsuloti.
// ============================================================
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB', link: '#5B3DE6',
  // amber — «kasbiy so'z / hali tushunilmadi» ogohlantirish oilasi (P0 NIMA-slot rangi bilan bir xil)
  amber: '#B77A16', amberLine: '#E8A13A', amberSoft: '#FBEED6',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
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
const LT = { bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4', paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', success: '#12A968' };
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
    } catch { setJoinError(tr({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: 'Неверный код наставника или ошибка подключения.' })); }
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
const _liveBadgeS = { position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 9998, background: LT.paper, border: `1px solid ${LT.ink3}55`, borderRadius: 99, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: LT.ink2, boxShadow: '0 2px 10px rgba(40,34,82,0.12)', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', maxWidth: '92vw' };
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

function LiveGate({ live, title = tr({ uz: 'Jonli dars', ru: 'Живой урок' }) }) {
  const [code, setCode] = useState('');
  const [nick, setNick] = useState(() => nickRead()); // oldingi darsda yozgan ismi tayyor chiqadi
  const [mentorCode, setMentorCode] = useState('');
  const [role, setRole] = useState('student');
  const card = { position: 'relative', width: '100%', maxWidth: 420, background: LT.paper, borderRadius: 20, padding: 'clamp(24px,4vw,36px)', boxShadow: '0 10px 40px -12px rgba(40,34,82,0.22)', display: 'flex', flexDirection: 'column', gap: 18 };
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
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{title}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Подключиться к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и своё имя.' })}</p></div>
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
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "🔓 O'quvchilar erkin qilindi", ru: '🔓 Ученики переведены в свободный режим' })}</div>;
    return (<>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr({ uz: 'Kod:', ru: 'Код:' })} <b style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr({ uz: "Kodni katta ko'rsatish", ru: 'Показать код крупно' })} style={{ marginLeft: 6, background: LT.ink, color: '#fff', border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: "📺 Ko'rsatish", ru: '📺 Показать' })}</button>
        <button onClick={() => { if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: 'Перевести учеников в свободный режим? Дальше они пойдут сами.' }))) live.endSession(); }} style={{ background: LT.accentSoft, color: LT.accent, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: '🔓 Erkin qilish', ru: '🔓 Свободный режим' })}</button>
      </div>
    </>);
  }
  if (live.mode === 'student') {
    if (live.status === 'ended') return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: "🔓 Erkin rejim — o'zingiz davom eting", ru: '🔓 Свободный режим — идите дальше сами' })}</div>;
    if (!live.mentorAlive) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: '⚠️ Mentor uzildi — erkin rejim', ru: '⚠️ Ментор отключился — свободный режим' })}</div>;
    if (!live.connected) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot('#FFD380')} /> {tr({ uz: '🔄 Qayta ulanmoqda…', ru: '🔄 Переподключаемся…' })}</div>;
    return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 👨‍🏫 Mentor: {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

const LangContext = createContext('uz');
// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi.
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
const MentorCtx = createContext(null);
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun

// Kod atamalarini backtick bilan belgilab, mono-chipga aylantiradi (savol/variant/izoh/arena)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

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

// ===== IKONKALAR =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
  x: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.2}><path d="M6 6l12 12M18 6L6 18" /></svg>),
  arrow: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={1.9}><path d="M4 12h14" /><path d="M13 6l6 6-6 6" /></svg>),
  user: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-3.6 3.2-5.8 7-5.8s7 2.2 7 5.8" /></svg>),
  heart: (s = 22, fill) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} fill={fill ? 'currentColor' : 'none'}><path d="M12 20s-7-4.4-9.2-8.6C1.3 8.3 3 5 6.2 5c2 0 3 1.2 3.8 2.3C10.9 6.2 11.9 5 14 5c3.2 0 4.9 3.3 3.4 6.4C19.2 15.6 12 20 12 20z" /></svg>),
  chat: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M4 5h16v11H9l-4 4v-4H4z" /></svg>),
  problem: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1 .9-1 1.7" /><path d="M12 16.7h.01" /></svg>),
  clock: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>)
};

// PM-6 belgilar: demo(play), tana qatlamlari (skelet/teri/harakat), qo'l, medal, mikrofon
const p6sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const p6 = {
  play: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p6sv}><circle cx="12" cy="12" r="9" /><path d="M10 8.4l5.5 3.6L10 15.6z" /></svg>),
  frame: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p6sv}><rect x="4" y="5" width="16" height="14" rx="1.5" /><path d="M4 9h16M9 9v10" /></svg>),
  palette: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p6sv}><path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.6 1.5-1.3 0-.4-.2-.7-.4-1-.2-.3-.4-.5-.4-.9 0-.7.6-1.3 1.3-1.3H15a6 6 0 0 0 6-6c0-4.4-4-8.5-9-7.5z" /><circle cx="8" cy="11" r="1" /><circle cx="12" cy="8" r="1" /><circle cx="16" cy="11" r="1" /></svg>),
  bolt: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p6sv}><path d="M13 2.5L4.5 13.5H10l-1 8 9.5-12.5H13z" /></svg>),
  hand: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p6sv}><path d="M8.5 11V6a1.5 1.5 0 0 1 3 0v4M11.5 10V5a1.5 1.5 0 0 1 3 0v5M14.5 11V7a1.5 1.5 0 0 1 3 0v6c0 3.3-2.4 6-6 6-2.3 0-3.8-1-4.9-2.7l-2-3.3a1.5 1.5 0 0 1 2.6-1.5L8.5 13" /></svg>),
  mic: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p6sv}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0" /><path d="M12 17v4M9 21h6" /></svg>),
  medal: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p6sv}><circle cx="12" cy="15" r="5.5" /><path d="M9 10L6.5 3M15 10l2.5-7M10 15l1.4 1.4L14 13.8" /></svg>),
  spark: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p6sv}><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1" /></svg>)
};

const LESSON_META = { lessonId: 'pm-m2d13-v1', lessonTitle: { uz: 'Sistemani qanday pitch qilish', ru: 'Как рассказать о системе' } };
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'recap',       template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's15', type: 'homework',    template: 'custom',   scored: false, scope: null },
  { id: 's16', type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 's17', type: 'arena',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's19', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// ===== 🛠️ JONLI PRAKTIKA signal-zonasi (500+): test <100 · arena 100+ bilan to'qnashmaydi =====
const PRACTICE_BASE = 500;
// ===== DARS KALITLARI (lesson-scoped) =====
const PITCH_KEY = 'pm-m2d13-pitch';       // chiqish-artefakt: 5 bo'lakli pitch matni
const HOOK_KEY = 'pm-m2d13-hook-choice';  // hook tanlovi (keys-ekranida qaytariladi)
const KODING_KEY = 'pm-m2d13-code';       // koding avto-saqlovi
const HW_KEY = 'pm-m2d13-hw';             // uyga vazifa shartnomasi
const REFLECT_KEY = 'pm-m2d13-reflect';   // recap: bir qatorlik javob
const CARDS_KEY = 'pm-m1d2-cards';        // kirish: M1-D2 auditoriya-kartasi
const MVP_KEY = 'pm-m2d7-mvp';            // kirish: M2-D7 MVP ro'yxati
const readLS = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const writeLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ===== KONSEPT LEKSIKONI =====
// Kasbiy so'zlar (jargon) — jonli tekshiruv ro'yxati (s2 da ochiladi, s9/s11 da tekshiriladi).
// UZ-RU: ikkala tildagi o'zaklar (ANALOGY bilan bir naqsh) — RU o'quvchi «база данных» yozsa ham
// SO'Z-ELAGI ishlashi shart. Ro'yxatdagilar TURLANMAGAN O'ZAK: «funksi» → funksiya/funksiyalar,
// «функци» → функция/функции. Lotincha qisqartmalar (api, html) ikkala tilda ham bir xil yoziladi.
// ⚠️ Kirillcha «апи» ATAYLAB YO'Q — u «написали» ichiga tushib yolg'on trevoga berardi.
const JARGON = {
  uz: ['massiv', 'obyekt', 'funksi', 'sikl', 'shart', 'kod', 'brauzer', 'baza', "ma'lumotlar bazasi",
    'server', 'deploy', 'komponent', 'repozitori', 'front', 'back'],
  // «данных» — «база/базу/базе данных» ning barcha turlanishini bir o'zak bilan tutadi
  ru: ['массив', 'объект', 'функци', 'цикл', 'услови', 'код', 'браузер', 'данных', 'база', 'сервер', 'деплой', 'компонент', 'репозитори', 'фронтенд', 'бэкенд', 'бекенд'],
  both: ['javascript', 'html', 'css', 'localstorage', 'api'],
};
const JARGON_WORDS = [...JARGON.uz, ...JARGON.ru, ...JARGON.both];
// O'zak topilsa — o'quvchi YOZGAN to'liq so'zni qaytaramiz (xabarda «funksiyalar» chiqsin, «funksi» emas)
const wholeWordAt = (raw, at, len) => {
  // apostrof (o', g') — o'zbekcha so'zning ICHIDA, shuning uchun ajratuvchi emas
  const isW = (c) => !!c && !/[\s.,!?;:()«»"—–-]/.test(c);
  let s = at, e = at + len;
  while (s > 0 && isW(raw[s - 1])) s--;
  while (e < raw.length && isW(raw[e])) e++;
  return raw.slice(s, e);
};
const findJargon = (text) => {
  const raw = String(text || '');
  const low = raw.toLowerCase();
  for (const stem of JARGON_WORDS) {
    const at = low.indexOf(stem);
    if (at !== -1) return wholeWordAt(raw, at, stem.length);
  }
  return null;
};
// Sistemaning uch qatlami + do'kon dunyosidagi o'xshatishi
const LAYERS3 = [
  { key: 'korinish', name: { uz: "Ko'rinadigan qism", ru: 'Видимая часть' }, ask: { uz: 'Mijoz ekranda nimani ko\'radi?', ru: 'Что клиент видит на экране?' }, right: { uz: 'Peshtaxta', ru: 'Прилавок' }, color: T.blue },
  { key: 'ishlash', name: { uz: 'Ishni bajaradigan qism', ru: 'Часть, которая делает работу' }, ask: { uz: 'Sayt qanday ishni o\'zi bajaradi?', ru: 'Какую работу сайт делает сам?' }, right: { uz: 'Oshpaz', ru: 'Повар' }, color: T.accent },
  { key: 'malumot', name: { uz: "Ma'lumot saqlanadigan joy", ru: 'Место хранения данных' }, ask: { uz: 'Sayt nimani eslab qoladi?', ru: 'Что сайт запоминает?' }, right: { uz: 'Javon', ru: 'Полка' }, color: T.success }
];

const Split = ({ children, refEl }) => <div className="split" ref={refEl}>{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic;
  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px + 60px
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); }, [screen]);
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
const NavNext = ({ disabled, label = tr({ uz: 'Davom etish', ru: 'Продолжить' }), onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? 'Mentor hali bu sahifaga o\'tmadi' : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? '⏳ Mentorni kuting' : (freeRide && disabled ? 'Davom etish' : label)}</button>;
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
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
// RECAPS kontenti — Stage 4'da JS-intro testlariga to'ldiriladi (hozircha bo'sh)
const RECAPS = {
  3: {
    title: { uz: "Kasbiy so'z nega yetib bormaydi", ru: 'Почему профессиональное слово не доходит' },
    cards: [
      { ic: "🧑‍🍳",
        h: { uz: "Tinglovchining boshida rasm hosil bo'lmaydi", ru: 'В голове слушателя не появляется картинка' },
        body: { uz: <>«Ma'lumotlar bazasi» — <b>faqat shu ishni qiladigan odamlar biladigan so'z</b>. Do'kon egasi uni eshitadi, lekin ko'z oldida hech qanday rasm paydo bo'lmaydi. Shuning uchun u gapni tashlab yuboradi.</>, ru: <>«База данных» — <b>слово, которое знают только те, кто этим занимается</b>. Хозяин магазина его слышит, но перед глазами не возникает никакой картинки. Поэтому он пропускает фразу мимо ушей.</> },
        vis: { uz: <RcFlow items={["Notanish so'z", "Rasm yo'q", "Gap tashlab yuborildi"]} />, ru: <RcFlow items={['Незнакомое слово', 'Картинки нет', 'Фразу пропустили']} /> } },
      { ic: "📏",
        h: { uz: 'Muammo uzunlikda emas', ru: 'Дело не в длине' },
        body: { uz: <>«Peshtaxta» so'zi ham uzun, lekin tushunarli. Demak masala <b>uzunlikda emas</b>, balki so'zning tinglovchiga tanish yoki notanishligida.</>, ru: <>Слово «прилавок» тоже длинное, но понятное. Значит, дело <b>не в длине</b>, а в том, знакомо слушателю слово или нет.</> } },
      { ic: "🔁",
        h: { uz: 'Tashlamaysiz — almashtirasiz', ru: 'Не выбрасываете — заменяете' },
        body: { uz: <>Kasbiy so'zni gapdan olib tashlash shart emas: uning o'rniga <b>tanish so'z yoki o'xshatish</b> qo'yasiz. «Massiv» → «ro'yxat». Ma'no qoladi, tushunish paydo bo'ladi.</>, ru: <>Профессиональное слово не обязательно убирать из фразы: вместо него вы ставите <b>знакомое слово или сравнение</b>. «Массив» → «список». Смысл остаётся, понимание появляется.</> },
        ask: { uz: "Saytingizdagi qaysi so'zni do'kon egasi tushunmaydi?", ru: 'Какое слово с вашего сайта хозяин магазина не поймёт?' } },
    ]
  },
  6: {
    title: { uz: "Birinchi gap kim haqida bo'ladi", ru: 'О ком будет первая фраза' },
    cards: [
      { ic: "🎯",
        h: { uz: 'Birinchi gap — tinglovchi haqida', ru: 'Первая фраза — о слушателе' },
        body: { uz: <>Tushuntirish <b>tinglovchi oladigan foydadan</b> boshlanadi: «Endi mijoz narxni bilish uchun telefon qilmaydi». Sayt nimadan qurilgani — keyingi gap.</>, ru: <>Объяснение начинается <b>с пользы для слушателя</b>: «Теперь клиенту не нужно звонить, чтобы узнать цену». Из чего собран сайт — это следующая фраза.</> },
        vis: { uz: <RcFlow items={["Foyda", "Keyin — qurilishi"]} />, ru: <RcFlow items={['Польза', 'Потом — устройство']} /> } },
      { ic: "🧱",
        h: { uz: "«To'rtta sahifa bor» — bu qurilish", ru: '«Тут четыре страницы» — это устройство' },
        body: { uz: <>Sahifa soni, ro'yxatlar, qaysi tilda yozilgani — bularning hammasi <b>qurilish haqida</b>. Tinglovchi ularni eshitib «xo'sh, menga nima?» deb qoladi.</>, ru: <>Число страниц, списки, на каком языке написано — всё это <b>про устройство</b>. Слушатель это слышит и думает: «ну и что мне с этого?»</> } },
      { ic: "🧾",
        h: { uz: '«Ikki hafta ishladim» — siz haqingizda', ru: '«Я работал две недели» — это о вас' },
        body: { uz: <>Bu gap sizning mehnatingiz haqida. Tinglovchi esa <b>o'zi haqidagi</b> gapdan tez ushlaydi. Mehnatingizni oxirida ayta olasiz.</>, ru: <>Эта фраза о вашем труде. А слушатель быстрее цепляется за фразу <b>о себе</b>. О своей работе вы расскажете в конце.</> },
        ask: { uz: 'Saytingizning birinchi gapi kim haqida?', ru: 'О ком первая фраза про ваш сайт?' } },
    ]
  },
  8: {
    title: { uz: "O'xshatish qayerdan olinadi", ru: 'Откуда берётся сравнение' },
    cards: [
      { ic: "🏪",
        h: { uz: "Tinglovchining o'z dunyosidan", ru: 'Из мира самого слушателя' },
        body: { uz: <>Yaxshi o'xshatish tinglovchi <b>har kuni ko'radigan narsadan</b> olinadi: peshtaxta, oshpaz, javon. U tasavvur qilishi bilan tushunish paydo bo'ladi.</>, ru: <>Хорошее сравнение берётся из того, <b>что слушатель видит каждый день</b>: прилавок, повар, полка. Как только он это представил — появляется понимание.</> },
        vis: { uz: <RcFlow items={["Peshtaxta", "Oshpaz", "Javon"]} />, ru: <RcFlow items={['Прилавок', 'Повар', 'Полка']} /> } },
      { ic: "🚫",
        h: { uz: "Ikkinchi notanish so'z — o'xshatish emas", ru: 'Второе незнакомое слово — не сравнение' },
        body: { uz: <>«Server xotirasi» yoki «massiv» — bu o'xshatish emas, <b>yana bitta notanish so'z</b>. Tushunish o'rniga yana bir savol paydo bo'ladi.</>, ru: <>«Память сервера» или «массив» — это не сравнение, а <b>ещё одно незнакомое слово</b>. Вместо понимания появляется новый вопрос.</> } },
      { ic: "🌫️",
        h: { uz: '«Ichki qism» — noaniq', ru: '«Внутренняя часть» — расплывчато' },
        body: { uz: <>«Kompyuterning ichki qismi» hech qanday aniq narsani ko'rsatmaydi. Yaxshi o'xshatish <b>bitta aniq narsani</b> ko'rsatadi — javonni ko'z oldiga keltirish oson.</>, ru: <>«Внутренняя часть компьютера» не показывает ничего конкретного. Хорошее сравнение показывает <b>одну конкретную вещь</b> — полку легко представить.</> },
        ask: { uz: "Saytingiz eslab qoladigan narsa do'konda nimaga o'xshaydi?", ru: 'На что в магазине похоже то, что запоминает ваш сайт?' } },
    ]
  },
  14: {
    title: { uz: '«Tushunmadim» — birinchi nimani tekshirasiz', ru: '«Не понял» — что проверяете первым' },
    cards: [
      { ic: "🔎",
        h: { uz: "Avval so'zlarni tekshiring", ru: 'Сначала проверьте слова' },
        body: { uz: <>Tushunmaslikning birinchi sababi — <b>gapda qolib ketgan kasbiy so'z</b>. Uni topib, tanish so'z yoki o'xshatish bilan almashtirasiz.</>, ru: <>Первая причина непонимания — <b>профессиональное слово, оставшееся во фразе</b>. Вы его находите и заменяете знакомым словом или сравнением.</> },
        vis: { uz: <RcFlow items={["So'zni top", "Almashtir", "Qayta ayt"]} />, ru: <RcFlow items={['Найдите слово', 'Замените', 'Скажите заново']} /> } },
      { ic: "🔊",
        h: { uz: 'Ovoz va uzunlik — ikkinchi darajali', ru: 'Громкость и длина — дело второе' },
        body: { uz: <>U «eshitmadim» demadi, <b>«tushunmadim»</b> dedi — demak ovoz yetgan. Qisqa gap ham tushunarsiz bo'lishi mumkin, uzunlik ham asosiy sabab emas.</>, ru: <>Он сказал не «не расслышал», а <b>«не понял»</b> — значит, звук дошёл. Короткая фраза тоже бывает непонятной, так что и длина здесь не главная причина.</> } },
      { ic: "🧑‍🍳",
        h: { uz: "Sinov — tinglovchining o'zi", ru: 'Проверка — сам слушатель' },
        body: { uz: <>Eng ishonchli tekshiruv: <b>qayta ayting va savolini eshiting</b>. Uning savoli qaysi bo'lak tushunarsiz qolganini aniq ko'rsatadi.</>, ru: <>Самая надёжная проверка: <b>скажите заново и выслушайте его вопрос</b>. Его вопрос точно покажет, какая часть осталась непонятной.</> },
        ask: { uz: 'Oxirgi marta kim sizga «tushunmadim» degan edi?', ru: 'Кто последним сказал вам «не понял»?' } },
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
        <span className="rc-tag">{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Объясняем заново' })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.vis && <div className="rc-vis">{tr(card.vis)}</div>}
        {card.ask && <div className="rc-ask">{tr({ uz: '🗣️ Sinfga savol: ', ru: '🗣️ Вопрос классу: ' })}{tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущая' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: '✓ Tushunarli — davom etamiz', ru: '✓ Понятно — идём дальше' })}</button>
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
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Ответили все' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
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
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и сколько ✅/❌ — скрыто. Нажмёте «Открыть результат» — откроется сразу и у вас, и на экранах учеников.' })}</p>
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
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? `${n} o'quvchi · ${pct}%` : '—'}</span>
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
              <p className="mstats-verdict-t">⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish — ', ru: '📖 Объяснить заново — ' })}{tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish — ', ru: '📖 Объяснить заново — ' })}{tr(RECAPS[screenIdx]?.title)}</button>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Стоит объяснить заново.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь вживую…' })}</p>}
    </div>
  );
}

// AUDIOSIZ dars — useAudio/getAudioEngine zaglushkasi (QuestionScreen imzosi saqlanadi, TTS yo'q)
const getAudioEngine = () => null;
const useAudio = () => ({ muted: true, isPlaying: false, currentSegment: null, triggerEvent: () => {}, replay: () => {}, toggleMute: () => {} });

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
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, жмите обдуманно!' })}</p>}
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
              ? <>✓ To'g'ri javob: {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? <>To'g'ri javob: {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
                  : solved ? "To'g'ri" : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(explainCorrect)
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете верный ответ.' })
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
        <span className="mentor-name">Mentor{collapsed && <span className="mentor-cue"> {tr({ uz: "· ko'rsatmani ochish ▾", ru: '· открыть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

const Q = ({ children, max = 760 }) => <h2 className="title h-title fade-up" style={{ maxWidth: max }}>{children}</h2>;
const IcoChip = ({ color = T.accent, soft = T.accentSoft, children, size = 46, className = '' }) => (
  <span className={className} style={{ width: size, height: size, borderRadius: 13, background: soft, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{children}</span>
);

const MentorCollapseScroll = ({ targetRef }) => {
  const ctx = useContext(MentorCtx) || {};
  const prev = useRef(false);
  useEffect(() => {
    if (ctx.enabled && ctx.collapsed && !prev.current && targetRef && targetRef.current) {
      const el = targetRef.current;
      setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 420);
    }
    prev.current = !!ctx.collapsed;
  }, [ctx.collapsed, ctx.enabled, targetRef]);
  return null;
};

// ===== 🧑‍🏫 MENTOR-ESLATMA (proyektor-sir): default yopiq chip, bosilsa ochiladi =====
const MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [open, setOpen] = useState(false);
  if (!live || live.mode !== 'mentor') return null;
  if (!open) return (
    <button type="button" className="mnote-chip" onClick={() => setOpen(true)} title={tr({ uz: 'Mentorga eslatma — bosib oching', ru: 'Заметка ментору — нажмите' })}>📋 {tr({ uz: 'Eslatma', ru: 'Заметка' })}</button>
  );
  return (
    <div className="mnote fade-up" onClick={() => setOpen(false)} title={tr({ uz: 'Yopish uchun bosing', ru: 'Нажмите, чтобы закрыть' })}>
      <span className="mnote-lbl">🧑‍🏫 {tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}<span className="mnote-x">✕</span></span>
      <p className="mnote-body">{children}</p>
    </div>
  );
};
// Mentor gating (31-qonun): jonli darsda amaliyotni o'quvchilar bajaradi, mentor kuzatadi
const MentorWatchLine = ({ live }) => {
  if (!live || live.mode !== 'mentor') return null;
  return <p className="mwatch">👨‍🏫 {tr({ uz: 'Jonli darsda bu ishni o\'quvchilar bajaradi — siz kuzatasiz; «Davom etish» siz uchun ochiq.', ru: 'На живом уроке это делают ученики — вы наблюдаете; «Продолжить» для вас открыто.' })}</p>;
};

// ===== 🛠️ JONLI PRAKTIKA panellari (mentor ko'radi / o'quvchi pulsni ko'radi) =====
const MentorPracticeStats = ({ live, screen, label }) => {
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ players, doneIds: new Set(rows.map(r => r.player_id)) });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, screen]); // eslint-disable-line
  if (!live || live.mode !== 'mentor') return null;
  const players = data.players || [];
  const doers = players.filter(p => data.doneIds.has(p.id));
  const waiting = players.filter(p => !data.doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{label || tr({ uz: '👀 Kim bajardi', ru: '👀 Кто выполнил' })} — {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загрузка…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не подключился.' })}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.successSoft, color: T.success, fontWeight: 700 }}>✓ {p.nickname}</span>)}
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.accentSoft, color: T.accent, fontWeight: 700 }}>✏️ {p.nickname}</span>)}
        </div>
      )}
    </div>
  );
};
// 45-qonun: o'quvchiga ko'rinadigan sinf-pulsi (ismlarsiz, sof O'QISH)
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
  }, [live && live.pin, screen]); // eslint-disable-line
  if (!live || live.mode !== 'student' || !data || data.total === 0) return null;
  const doing = Math.max(0, data.total - data.done);
  return (
    <div className="done-mini fade-up" style={{ alignSelf: 'flex-start' }}>
      👥 {tr({ uz: 'Sinfda:', ru: 'В классе:' })} <b>{data.done}</b> {tr({ uz: 'bajardi', ru: 'выполнили' })}{doing > 0 && <span className="dm-sub">· ✏️ {doing} {tr({ uz: 'hali bajarmoqda', ru: 'ещё выполняют' })}</span>}
    </div>
  );
};

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
        <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })}>{big ? '✕' : '⛶'}</button>
        {children}
      </div>
    </>
  );
};

// ===== 🔴 IMZO-VIZUAL: «TUSHUNISH CHIZIG'I» =====
// Do'kon egasining yuzi + vertikal chiziq: tanish so'zda ko'tariladi, kasbiy so'zda tushadi.
// Dars uch joyda qaytaradi: hook (s0) → so'z-elagi (s2) → ustaxona (s9).
const Uline = ({ level, note }) => {
  const lv = Math.max(5, Math.min(100, level));
  const bad = lv < 45;
  return (
    <div className={`ul ${bad ? 'low' : 'high'}`}>
      <span className="ul-face" aria-hidden="true">{bad ? '😕' : lv > 75 ? '🙂' : '🧑‍🍳'}</span>
      <div className="ul-track">
        <span className="ul-grid" aria-hidden="true"><i /><i /><i /></span>
        <span className="ul-fill" style={{ height: `${lv}%` }} />
        <span className="ul-mark" style={{ bottom: `${lv}%` }} aria-hidden="true">{bad ? '▼' : '▲'}</span>
      </div>
      <span className="ul-lbl">{tr({ uz: 'tushunish', ru: 'понимание' })}</span>
      {note && <span className="ul-note">{tr(note)}</span>}
    </div>
  );
};

// ===== SCREEN 0 — HOOK: bir suhbat =====
const HOOK_WORDS = [
  { t: { uz: 'Menyu', ru: 'Меню' } },
  { t: { uz: 'massivda', ru: 'в массиве' }, j: true },
  { t: { uz: 'saqlanadi,', ru: 'хранится,' } },
  { t: { uz: 'sahifa', ru: 'страница' } },
  { t: { uz: 'uni', ru: 'его' } },
  { t: { uz: "ko'rsatadi.", ru: 'показывает.' } }
];
const HOOK_OPTS = [
  { id: 'menyu', t: { uz: 'menyu', ru: 'меню' } },
  { id: 'massiv', t: { uz: 'massiv', ru: 'массив' } },
  { id: 'sahifa', t: { uz: 'sahifa', ru: 'страница' } },
  { id: 'korsatadi', t: { uz: "ko'rsatadi", ru: 'показывает' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [shown, setShown] = useState(storedAnswer ? HOOK_WORDS.length : 0);
  const [playing, setPlaying] = useState(false);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const done = shown >= HOOK_WORDS.length;
  const play = () => {
    if (playing || done) return;
    setPlaying(true); setShown(0);
    let i = 0;
    const t = setInterval(() => {
      i++; setShown(i);
      if (i >= HOOK_WORDS.length) { clearInterval(t); setPlaying(false); }
    }, 620);
  };
  const level = shown === 0 ? 80 : HOOK_WORDS.slice(0, shown).some(w => w.j) ? 16 : 88;
  const pick = (id) => {
    if (picked !== null) return;
    setPicked(id); writeLS(HOOK_KEY, { picked: id });
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: true });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Bir suhbat', ru: 'Один разговор' })} screen={screen} navContent={<NavNext disabled={picked === null} optionalLive label={picked === null ? tr({ uz: "Bitta so'zni belgilang", ru: 'Отметьте одно слово' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 860 }}>{tr({ uz: <>Do'kon egasi so'radi: «Saytim ichida nima bor?» — <span className="italic" style={{ color: T.accent }}>siz javob berdingiz</span>.</>, ru: <>Хозяин магазина спросил: «Что внутри моего сайта?» — <span className="italic" style={{ color: T.accent }}>вы ответили</span>.</> })}</h1>
        <Mentor>{tr({ uz: <>▶ ni bosing: gapingiz so'zma-so'z chiqadi, yonida do'kon egasining <b style={{ color: T.ink }}>tushunish chizig'i</b> harakatlanadi.</>, ru: <>Нажмите ▶: ваша фраза выйдет слово за словом, рядом движется <b style={{ color: T.ink }}>линия понимания</b> хозяина.</> })}</Mentor>
        <MentorNote>{tr({ uz: "To'g'ri javobni aytmang — o'quvchi belgilagach o'zi ochiladi. Bu tanlov keys-ekranida qaytariladi.", ru: 'Не называйте ответ — он откроется после выбора. Этот выбор вернётся на экране кейса.' })}</MentorNote>
        <div className="hk-wrap fade-up delay-1">
          <div className="hk-say">
            <div className="hk-words">
              {HOOK_WORDS.map((w, i) => (
                <span key={i} className={`hk-w ${i < shown ? 'in' : ''} ${w.j && i < shown ? 'jrg' : ''}`}>{tr(w.t)}</span>
              ))}
              {shown === 0 && <span className="hk-ph">{tr({ uz: '▶ ni bosing…', ru: 'Нажмите ▶…' })}</span>}
            </div>
            {!done && <button className="btn hk-play" onClick={play} disabled={playing}>{playing ? tr({ uz: 'Gapirmoqda…', ru: 'Говорит…' }) : tr({ uz: '▶ Gapni chiqarish', ru: '▶ Показать фразу' })}</button>}
          </div>
          <Uline level={level} note={shown === 0 ? null : level < 45 ? { uz: 'chiziq tushdi', ru: 'линия упала' } : { uz: 'chiziq yuqorida', ru: 'линия наверху' }} />
        </div>
        {done && (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p className="eyebrow" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: "Qaysi so'zda chiziq pastga tushdi?", ru: 'На каком слове линия упала?' })}</p>
            <div className="hk-opts">
              {HOOK_OPTS.map(o => { const on = picked === o.id; return (
                <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                  <span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.t)}</span>
                </button>
              ); })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>«Massiv» — bu so'zni faqat kod yozadigan odamlar biladi. Do'kon egasi uni eshitib <b>hech narsani tasavvur qila olmaydi</b>.</>, ru: <>«Массив» знают только те, кто пишет код. Хозяин магазина слышит его и <b>ничего не может представить</b>.</> })}</p>}
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD: jonli natija-preview =====
const PREVIEW_PARTS = [
  { lbl: { uz: 'Kim uchun', ru: 'Для кого' }, txt: { uz: 'Maktab kutubxonasiga kelib turadigan o\'quvchilar uchun', ru: 'Для учеников, которые ходят в школьную библиотеку' } },
  { lbl: { uz: 'Qanday muammo', ru: 'Какая трудность' }, txt: { uz: 'Kerakli kitob bor-yo\'qligini bilish uchun har safar kutubxonaga borish kerak', ru: 'Чтобы узнать, есть ли нужная книга, каждый раз нужно идти в библиотеку' } },
  { lbl: { uz: 'Nima qiladi', ru: 'Что делает' }, txt: { uz: 'Sayt bo\'sh kitoblar ro\'yxatini ko\'rsatadi', ru: 'Сайт показывает список свободных книг' } },
  { lbl: { uz: 'Nega ishlaydi', ru: 'Почему работает' }, txt: { uz: 'Ro\'yxat javondagi yozuvga o\'xshaydi: nima borligi bir joyda turadi', ru: 'Список похож на запись на полке: что есть — всё в одном месте' } },
  { lbl: { uz: 'Nima so\'rayman', ru: 'О чём прошу' }, txt: { uz: 'Kitoblar ro\'yxatini haftada bir marta yangilab berishingizni so\'rayman', ru: 'Прошу обновлять список книг раз в неделю' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    const rm = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rm) { setN(PREVIEW_PARTS.length); return; }
    let i = 0;
    const t = setInterval(() => { i++; setN(i); if (i >= PREVIEW_PARTS.length) clearInterval(t); }, 850);
    return () => clearInterval(t);
  }, []);
  return (
    <Stage eyebrow={tr({ uz: 'Bugungi natija', ru: 'Сегодняшний результат' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Dars oxirida saytingizni <span className="italic" style={{ color: T.accent }}>kod bilmaydigan odamga</span> tushuntira olasiz.</>, ru: <>К концу урока вы объясните свой сайт <span className="italic" style={{ color: T.accent }}>человеку без кода</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Quyida besh bo'lakli yozuv o'z-o'zidan yozilib chiqadi — shunday qisqa taqdimotga <b style={{ color: T.ink }}>pitch</b> deyiladi.</>, ru: <>Ниже сама собой пишется запись из пяти частей — такая короткая презентация называется <b style={{ color: T.ink }}>питч</b>.</> })}</Mentor>
        <div className="pv-wrap fade-up delay-1">
          <div className="pv-card">
            <span className="pv-head">{tr({ uz: 'Namuna: maktab kutubxonasi sayti', ru: 'Пример: сайт школьной библиотеки' })}</span>
            {PREVIEW_PARTS.map((p, i) => (
              <div key={i} className={`pv-slot ${i < n ? 'in' : ''}`}>
                <span className="pv-lbl">{tr(p.lbl)}</span>
                <span className="pv-txt">{i < n ? tr(p.txt) : '…'}</span>
              </div>
            ))}
            {n >= PREVIEW_PARTS.length && <span className="pv-done fade-step">✓ {tr({ uz: 'Besh bo\'lak tayyor', ru: 'Пять частей готовы' })}</span>}
          </div>
          <Uline level={n >= PREVIEW_PARTS.length ? 92 : 78} note={{ uz: 'chiziq yuqorida', ru: 'линия наверху' }} />
        </div>
        <p className="mono small fade-up delay-2" style={{ color: T.accent, margin: 0 }}>{tr({ uz: "→ Bugun O'Z saytingiz uchun shunday besh bo'lakni yozasiz.", ru: '→ Сегодня вы напишете такие пять частей для СВОЕГО сайта.' })}</p>
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — 🔎 SO'Z-ELAGI =====
const SIEVE = [
  { t: { uz: 'Menyu', ru: 'Меню' } },
  { t: { uz: 'massivda', ru: 'в массиве' }, j: true, s: { uz: "ro'yxatda", ru: 'в списке' } },
  { t: { uz: 'saqlanadi,', ru: 'хранится,' } },
  { t: { uz: 'sikl', ru: 'цикл' }, j: true, s: { uz: 'har birini navbat bilan', ru: 'каждый по очереди' } },
  { t: { uz: 'uni', ru: 'его' } },
  { t: { uz: 'sahifaga', ru: 'на страницу' } },
  { t: { uz: 'chiqaradi', ru: 'выводит' } },
  { t: { uz: 'va', ru: 'и' } },
  { t: { uz: 'localStorage', ru: 'localStorage' }, j: true, s: { uz: 'brauzer eslab qoladi', ru: 'браузер запоминает' } },
  { t: { uz: 'buyurtmani', ru: 'заказ' } },
  { t: { uz: 'eslab qoladi.', ru: 'запоминает.' } }
];
const SIEVE_TOTAL = SIEVE.filter(w => w.j).length;
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [found, setFound] = useState(() => new Set(storedAnswer ? SIEVE.map((w, i) => (w.j ? i : null)).filter(i => i !== null) : []));
  const [miss, setMiss] = useState(null);
  const done = found.size >= SIEVE_TOTAL;
  const doneRef = useRef(false);
  useEffect(() => {
    if (done && !doneRef.current) { doneRef.current = true; if (storedAnswer === undefined) onAnswer(screen, { stage: 'sieve', screenIdx: screen, correct: true, picked: SIEVE_TOTAL }); }
  }, [done]); // eslint-disable-line
  const tap = (i) => {
    const w = SIEVE[i];
    if (w.j) { setMiss(null); setFound(p => { const n = new Set(p); n.add(i); return n; }); }
    else setMiss(i);
  };
  const level = 20 + Math.round((found.size / SIEVE_TOTAL) * 72);
  return (
    <Stage eyebrow={tr({ uz: "Kasbiy so'zlar", ru: 'Профессиональные слова' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} optionalLive label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${found.size}/${SIEVE_TOTAL} ${tr({ uz: "so'z topilsin", ru: 'слова найдено' })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,1.8vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bu gap — <span className="italic" style={{ color: T.accent }}>sizniki</span>. Do'kon egasi tushunmaydigan so'zlarni bosing.</>, ru: <>Эта фраза — <span className="italic" style={{ color: T.accent }}>ваша</span>. Нажмите слова, которых хозяин не понимает.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Uchta so'z bor. Topganingizda ostida <b style={{ color: T.ink }}>sodda almashtiruvchisi</b> ochiladi.</>, ru: <>Здесь три слова. Найдёте — под ним откроется <b style={{ color: T.ink }}>простая замена</b>.</> })}</Mentor>
        <div className="sv-wrap fade-up delay-1">
          <div className="sv-sent">
            {SIEVE.map((w, i) => {
              const hit = found.has(i);
              return (
                <span key={i} className="sv-cell">
                  <button className={`sv-w ${hit ? 'hit' : ''} ${miss === i ? 'miss' : ''}`} onClick={() => tap(i)} disabled={hit}>{tr(w.t)}</button>
                  {hit && <span className="sv-simple fade-step">{tr(w.s)}</span>}
                </span>
              );
            })}
          </div>
          <Uline level={level} note={done ? { uz: 'endi tushunarli', ru: 'теперь понятно' } : { uz: 'hali tushunmayapti', ru: 'пока не понимает' }} />
        </div>
        {miss !== null && !found.has(miss) && <p className="sv-neutral fade-step">{tr({ uz: "Bu so'zni do'kon egasi biladi — uni almashtirish shart emas.", ru: 'Это слово хозяин знает — заменять не нужно.' })}</p>}
        {done && (
          <div className="frame-success fade-step">
            <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Faqat shu ishni qiladigan odamlar biladigan so'zga <b>jargon — kasbiy so'z</b> deyiladi. Uni tashlab yubormaysiz, <b>tanish so'z bilan almashtirasiz</b>.</>, ru: <>Слово, которое знают только люди этой профессии, называется <b>жаргон — профессиональное слово</b>. Его не выбрасывают, а <b>заменяют знакомым словом</b>.</> })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — TEST-1 =====
const Screen3 = (p) => (
  <QuestionScreen {...p} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv', ru: 'Проверка' })}
    question={<Q>{tr({ uz: <>«Ma'lumotlar bazasi» so'zi do'kon egasiga <span className="italic" style={{ color: T.accent }}>nega yetib bormaydi</span>?</>, ru: <>Почему слова «база данных» <span className="italic" style={{ color: T.accent }}>не доходят</span> до хозяина магазина?</> })}</Q>}
    questionText={tr({ uz: "«Ma'lumotlar bazasi» so'zi do'kon egasiga nega yetib bormaydi?", ru: 'Почему слова «база данных» не доходят до хозяина магазина?' })}
    options={[
      tr({ uz: "Bu so'z juda uzun, eslab qolish qiyin.", ru: 'Это слово слишком длинное, трудно запомнить.' }),
      tr({ uz: "Bu so'zni faqat shu ishni qiladigan odamlar biladi — do'kon egasi uni eshitib hech narsani tasavvur qila olmaydi.", ru: 'Это слово знают только люди этой профессии — хозяин слышит его и ничего не может представить.' }),
      tr({ uz: "Bu so'z noto'g'ri ishlatilgan — to'g'risi boshqacha aytiladi.", ru: 'Это слово употреблено неверно — правильно говорится иначе.' }),
      tr({ uz: "Do'kon egasi saytga qiziqmaydi.", ru: 'Хозяину магазина сайт неинтересен.' })
    ]}
    correctIdx={1}
    explainCorrect={tr({ uz: "Kasbiy so'z tinglovchining boshida hech qanday rasm hosil qilmaydi — shuning uchun u gapni tashlab yuboradi.", ru: 'Профессиональное слово не создаёт в голове слушателя никакой картины — поэтому он теряет нить.' })}
    explainWrong={{
      0: tr({ uz: "Uzunlik muammo emas: «peshtaxta» ham uzun, lekin tushunarli. Muammo — so'zning tanish emasligida.", ru: 'Длина ни при чём: «прилавок» тоже длинное, но понятное. Дело в незнакомости слова.' }),
      2: tr({ uz: "So'z to'g'ri ishlatilgan. Muammo aniqlikda emas, tinglovchida.", ru: 'Слово употреблено верно. Проблема не в точности, а в слушателе.' }),
      3: tr({ uz: "Aksincha — sayt uniki. U qiziqadi, lekin so'zni tushunmaydi.", ru: 'Наоборот — сайт его. Ему интересно, но слово непонятно.' }),
      default: tr({ uz: "Yana bir bor o'ylab ko'ring.", ru: 'Подумайте ещё раз.' })
    }} />
);

// ===== SCREEN 4 — 🧑‍🍳 TINGLOVCHI-JAVOBI =====
const STARTS = [
  { id: 'a', say: { uz: "«Saytda to'rt sahifa bor.»", ru: '«На сайте четыре страницы.»' }, reply: { uz: '«Xo\'sh, menga nima?»', ru: '«Ну, а мне-то что?»' }, good: false },
  { id: 'b', say: { uz: "«Sayt JavaScript'da yozilgan.»", ru: '«Сайт написан на JavaScript.»' }, reply: { uz: '«Bu nima degani?»', ru: '«Это что значит?»' }, good: false },
  { id: 'c', say: { uz: '«Endi mijoz narxni telefon qilmasdan ko\'radi.»', ru: '«Теперь клиент видит цену, не звоня.»' }, reply: { uz: '«Buni bugunoq ishlataman.»', ru: '«Начну пользоваться сегодня же.»' }, good: true }
];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(() => new Set(storedAnswer ? STARTS.map(s => s.id) : []));
  const [chosen, setChosen] = useState(storedAnswer?.picked ?? null);
  const allSeen = seen.size >= STARTS.length;
  const tap = (id) => {
    setOpen(o => (o === id ? null : id));
    setSeen(p => { const n = new Set(p); n.add(id); return n; });
  };
  const choose = (id) => {
    if (chosen !== null) return;
    setChosen(id);
    onAnswer(screen, { stage: 'starts', screenIdx: screen, picked: id, correct: id === 'c' });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Birinchi gap', ru: 'Первая фраза' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={chosen === null} optionalLive label={!allSeen ? `${seen.size}/3 ${tr({ uz: 'javobni oching', ru: 'ответа открыто' })}` : chosen === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите одну' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,1.8vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Uch xil boshlanish. Har birini bosing va <span className="italic" style={{ color: T.accent }}>do'kon egasi nima deyishini</span> ko'ring.</>, ru: <>Три разных начала. Нажмите каждое и посмотрите, <span className="italic" style={{ color: T.accent }}>что скажет хозяин</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: 'Uchalasini sinab ko\'ring, keyin tinglovchiga tushunarlisini tanlang.', ru: 'Попробуйте все три, затем выберите понятное слушателю.' })}</Mentor>
        <div className="ts-grid fade-up delay-1">
          {STARTS.map(s => {
            const isOpen = open === s.id;
            const isSeen = seen.has(s.id);
            return (
              <div key={s.id} className={`ts-card ${isOpen ? 'open' : ''} ${chosen === s.id ? 'chosen' : ''}`}>
                <button className={`ts-say ${isSeen ? '' : 'tap-hint-card'}`} onClick={() => tap(s.id)}>
                  <span className="ts-say-t">{tr(s.say)}</span>
                  <span className="ts-cue">{isOpen ? '▴' : '▾'}</span>
                </button>
                {isOpen && (
                  <div className="ts-reply fade-step">
                    <span className="ts-face">🧑‍🍳</span>
                    <span className={`ts-reply-t ${s.good ? 'good' : 'bad'}`}>{tr(s.reply)}</span>
                  </div>
                )}
                {allSeen && (
                  <button className={`ts-pick ${chosen === s.id ? 'on' : ''}`} disabled={chosen !== null} onClick={() => choose(s.id)}>
                    {chosen === s.id ? tr({ uz: '✓ Tanlandi', ru: '✓ Выбрано' }) : tr({ uz: 'Shu boshlanishni tanlayman', ru: 'Выбираю это начало' })}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {chosen !== null && (
          <div className={chosen === 'c' ? 'frame-success fade-step' : 'frame-soft fade-step'}>
            <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Gap <b>«nima uchun kerak»</b>dan boshlanadi, «nimadan qurilgan»dan emas.</>, ru: <>Фраза начинается с <b>«зачем это нужно»</b>, а не «из чего построено».</> })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 5 — KEYS-SLAYD (K12) =====
const K_SLIDES = [
  { kind: 'story', t: { uz: "Ikki yigit uy ijarasi haqidagi g'oyasini pul qo'yadigan odamlarga tushuntirishi kerak edi. Ular hech qanday kod ko'rsatmadi — o'nga yaqin oddiy slayd tayyorlashdi.", ru: 'Двое парней должны были объяснить идею аренды жилья тем, кто вкладывает деньги. Они не показали ни строчки кода — сделали около десяти простых слайдов.' } },
  { kind: 'guess', q: { uz: 'Birinchi slaydda nima turgan?', ru: 'Что было на первом слайде?' }, opts: [
      { uz: "Kompaniya haqida ma'lumot", ru: 'Информация о компании' },
      { uz: 'Mahsulot ekranlari', ru: 'Экраны продукта' },
      { uz: 'Odamlarning muammosi', ru: 'Проблема людей' }
    ], right: 2 },
  { kind: 'story', t: { uz: 'Birinchi slaydda odamlarning muammosi turardi: sayohatga chiqqan odam uchun mehmonxona qimmat. Faqat shundan keyin o\'z yechimlarini aytishdi.', ru: 'На первом слайде была проблема людей: для путешественника гостиница дорога. И только потом они рассказали своё решение.' } },
  { kind: 'guess', q: { uz: 'Har slaydda qancha gap bo\'lgan?', ru: 'Сколько мыслей было на каждом слайде?' }, opts: [
      { uz: 'Har slaydda bitta sodda fikr', ru: 'На каждом слайде одна простая мысль' },
      { uz: 'Har slaydda bir necha jumla', ru: 'На каждом слайде несколько предложений' },
      { uz: 'Har slaydda to\'liq izoh matni', ru: 'На каждом слайде полный пояснительный текст' }
    ], right: 0 },
  { kind: 'story', t: { uz: 'Har slaydda bitta sodda fikr turardi: muammo, yechim, bozor, mahsulot, jamoa. Shuning uchun bu taqdimot bugun ham eng ko\'p o\'rganiladiganlardan biri va internetda ochiq turibdi.', ru: 'На каждом слайде была одна простая мысль: проблема, решение, рынок, продукт, команда. Поэтому эту презентацию изучают до сих пор, она открыта в интернете.' } }
];
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? K_SLIDES.length - 1 : 0);
  const [guesses, setGuesses] = useState({});
  const cur = K_SLIDES[step];
  const last = step >= K_SLIDES.length - 1;
  const canNext = cur.kind === 'story' || guesses[step] !== undefined;
  const advance = () => { if (!last && canNext) setStep(s => s + 1); };
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { stage: 'case', screenIdx: screen, correct: true, picked: true }); }, [last]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Keys 📊', ru: 'Кейс 📊' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!last} optionalLive label={last ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval slaydlarni oching', ru: 'Сначала откройте слайды' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,1.8vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Biznes olamidan mashhur voqea: <span className="italic" style={{ color: T.accent }}>Airbnb</span>ning birinchi taqdimoti.</>, ru: <>Известная история из мира бизнеса: первая презентация <span className="italic" style={{ color: T.accent }}>Airbnb</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: 'Slaydlarni birma-bir oching — ikki joyda taxmin qilasiz, ball yo\'q.', ru: 'Открывайте слайды по одному — в двух местах угадаете, баллов нет.' })}</Mentor>
        <div className="ks-dots fade-up">{K_SLIDES.map((_, i) => <span key={i} className={`ks-dot ${i < step ? 'fill' : ''} ${i === step ? 'cur' : ''}`} />)}</div>
        <div className="ks-card fade-step" key={step}>
          {cur.kind === 'story' ? (
            <p className="ks-text">{tr(cur.t)}</p>
          ) : (
            <>
              <p className="ks-q">🎲 {tr(cur.q)}</p>
              <div className="ks-opts">
                {cur.opts.map((o, i) => {
                  const g = guesses[step];
                  const picked = g === i;
                  const showRight = g !== undefined && i === cur.right;
                  return (
                    <button key={i} className={`ks-opt ${picked ? 'on' : ''} ${showRight ? 'right' : ''}`} disabled={g !== undefined}
                      onClick={() => setGuesses(p => ({ ...p, [step]: i }))}>{tr(o)}</button>
                  );
                })}
              </div>
              {guesses[step] !== undefined && (
                <p className="ks-verdict fade-step">{guesses[step] === cur.right
                  ? tr({ uz: '🎯 Topdingiz!', ru: '🎯 Угадали!' })
                  : `${tr({ uz: 'Adashdingiz — asl javob:', ru: 'Не угадали — верный ответ:' })} ${tr(cur.opts[cur.right])}`}</p>
              )}
            </>
          )}
          {last && (
            <p className="ks-hook fade-step">{tr({ uz: 'Airbnb slaydlariga tinglovchi bilmaydigan birorta so\'z kirmagan.', ru: 'В слайды Airbnb не попало ни одного слова, незнакомого слушателю.' })}</p>
          )}
        </div>
        {!last && <button className="btn ks-next" disabled={!canNext} onClick={advance}>{canNext ? tr({ uz: 'Keyingi slayd →', ru: 'Следующий слайд →' }) : tr({ uz: 'Avval bitta variantni belgilang', ru: 'Сначала отметьте один вариант' })}</button>}
        {last && (
          <div className="frame-success fade-step">
            <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Airbnb tinglovchisi ham kod bilmasdi. Endi <b>siz</b> ham do'kon egasiga xuddi shunday tushuntirasiz — birinchi gap uning muammosi bo'lsin.</>, ru: <>Слушатель Airbnb тоже не знал кода. Теперь <b>вы</b> так же объясните хозяину — пусть первая фраза будет о его трудности.</> })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — TEST-2 =====
const Screen6 = (p) => (
  <QuestionScreen {...p} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv', ru: 'Проверка' })}
    question={<Q>{tr({ uz: <>Do'kon egasiga tushuntirishni <span className="italic" style={{ color: T.accent }}>qaysi gapdan</span> boshlaysiz?</>, ru: <>С <span className="italic" style={{ color: T.accent }}>какой фразы</span> вы начнёте объяснение хозяину?</> })}</Q>}
    questionText={tr({ uz: "Do'kon egasiga tushuntirishni qaysi gapdan boshlaysiz?", ru: 'С какой фразы вы начнёте объяснение хозяину?' })}
    options={[
      tr({ uz: "«Saytda to'rtta sahifa va bitta ro'yxat bor.»", ru: '«На сайте четыре страницы и один список.»' }),
      tr({ uz: "«Menyu ro'yxati kodning ichida saqlanadi.»", ru: '«Список меню хранится внутри кода.»' }),
      tr({ uz: "«Endi mijoz narxni bilish uchun telefon qilmaydi — o'zi ko'radi.»", ru: '«Теперь клиент не звонит, чтобы узнать цену — видит сам.»' }),
      tr({ uz: "«Saytni ikki hafta ishlab chiqdim.»", ru: '«Я делал сайт две недели.»' })
    ]}
    correctIdx={2}
    explainCorrect={tr({ uz: 'Birinchi gap tinglovchi oladigan foydani aytadi; qurilishi keyin keladi.', ru: 'Первая фраза говорит о выгоде слушателя; устройство — потом.' })}
    explainWrong={{
      0: tr({ uz: "Bu — nimadan qurilgani. Tinglovchi «xo'sh, menga nima?» deb qoladi.", ru: 'Это про устройство. Слушатель подумает: «а мне-то что?»' }),
      1: tr({ uz: "Bu ham qurilishi haqida, ustiga kasbiy so'z bilan.", ru: 'Это тоже про устройство, да ещё и с профессиональным словом.' }),
      3: tr({ uz: "Bu siz haqingizda. Tinglovchi o'zi haqidagi gapdan tez ushlaydi.", ru: 'Это о вас. Слушатель быстрее цепляется за фразу о себе.' }),
      default: tr({ uz: "Yana bir bor o'ylab ko'ring.", ru: 'Подумайте ещё раз.' })
    }} />
);

// ===== SCREEN 7 — 🌯 UCH QATLAM O'XSHATISHI =====
const L_OPTS = {
  korinish: [
    { t: { uz: "Peshtaxta — mijoz hamma narsani shu yerda ko'radi", ru: 'Прилавок — клиент всё видит здесь' }, ok: true },
    { t: { uz: 'Sahifa kodi', ru: 'Код страницы' }, ok: false },
    { t: { uz: 'Brauzer oynasi', ru: 'Окно браузера' }, ok: false }
  ],
  ishlash: [
    { t: { uz: 'Sikl', ru: 'Цикл' }, ok: false },
    { t: { uz: "Oshpaz — buyurtmani o'zi tayyorlaydi", ru: 'Повар — сам готовит заказ' }, ok: true },
    { t: { uz: 'Server', ru: 'Сервер' }, ok: false }
  ],
  malumot: [
    { t: { uz: "Ma'lumotlar bazasi", ru: 'База данных' }, ok: false },
    { t: { uz: 'Massiv', ru: 'Массив' }, ok: false },
    { t: { uz: 'Javon — nima borligi shu yerda turadi', ru: 'Полка — что есть, лежит здесь' }, ok: true }
  ]
};
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? LAYERS3.length : 0);
  const [wrong, setWrong] = useState(null);
  const done = step >= LAYERS3.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'layers', screenIdx: screen, correct: true, picked: true }); }, [done]); // eslint-disable-line
  const pick = (i) => {
    const layer = LAYERS3[step];
    const opt = L_OPTS[layer.key][i];
    if (opt.ok) { setWrong(null); setStep(s => s + 1); }
    else setWrong(i);
  };
  const cur = done ? null : LAYERS3[step];
  return (
    <Stage eyebrow={tr({ uz: "O'xshatish", ru: 'Сравнение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} optionalLive label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${step}/3 ${tr({ uz: "qatlamga o'xshatish tanlang", ru: 'слоя сопоставлено' })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,1.8vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saytingiz uch qatlamdan iborat. Har qatlamga <span className="italic" style={{ color: T.accent }}>do'konning o'z dunyosidan</span> o'xshatish tanlang.</>, ru: <>Ваш сайт состоит из трёх слоёв. Для каждого выберите сравнение <span className="italic" style={{ color: T.accent }}>из мира магазина</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: 'Har tanlovni tinglovchida sinaymiz — u tushunsa, qatlam yashil qatorga o\'tadi.', ru: 'Каждый выбор проверяем на слушателе — если понял, слой уходит в зелёный ряд.' })}</Mentor>
        <div className="l3-done fade-up">
          {LAYERS3.slice(0, step).map(l => (
            <span key={l.key} className="l3-chip">✓ {tr(l.name)} = {tr(l.right)}</span>
          ))}
        </div>
        {cur && (
          <div className="l3-card fade-step" key={cur.key}>
            <span className="l3-name" style={{ color: cur.color }}>{tr(cur.name)}</span>
            <p className="l3-ask">{tr(cur.ask)}</p>
            <div className="l3-opts">
              {L_OPTS[cur.key].map((o, i) => (
                <button key={i} className={`l3-opt ${wrong === i ? 'bad' : ''}`} onClick={() => pick(i)}>{tr(o.t)}</button>
              ))}
            </div>
            {wrong !== null && <p className="l3-reply fade-step">🧑‍🍳 {tr({ uz: '«Bu so\'zni bilmayman.»', ru: '«Этого слова я не знаю.»' })}</p>}
          </div>
        )}
        {done && (
          <div className="frame-success fade-step">
            <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Yaxshi o'xshatish <b>tinglovchining o'z hayotidan</b> olinadi: peshtaxta, oshpaz, javon — u ularni har kuni ko'radi.</>, ru: <>Хорошее сравнение берут <b>из жизни самого слушателя</b>: прилавок, повар, полка — он видит их каждый день.</> })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST-3 =====
const Screen8 = (p) => (
  <QuestionScreen {...p} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv', ru: 'Проверка' })}
    question={<Q>{tr({ uz: <>Qaysi o'xshatish do'kon egasi uchun <span className="italic" style={{ color: T.accent }}>ishlaydi</span>?</>, ru: <>Какое сравнение <span className="italic" style={{ color: T.accent }}>сработает</span> для хозяина магазина?</> })}</Q>}
    questionText={tr({ uz: "Qaysi o'xshatish do'kon egasi uchun ishlaydi?", ru: 'Какое сравнение сработает для хозяина магазина?' })}
    options={[
      tr({ uz: "«Ma'lumot saqlanadigan joy — bu server xotirasi.»", ru: '«Место хранения данных — это память сервера.»' }),
      tr({ uz: "«Ma'lumot saqlanadigan joy — oshxonadagi javon: nima borligi shu yerda turadi.»", ru: '«Место хранения данных — полка на кухне: что есть, лежит здесь.»' }),
      tr({ uz: "«Ma'lumot saqlanadigan joy — massiv ichida turadi.»", ru: '«Место хранения данных — внутри массива.»' }),
      tr({ uz: "«Ma'lumot saqlanadigan joy — kompyuterning ichki qismi.»", ru: '«Место хранения данных — внутренняя часть компьютера.»' })
    ]}
    correctIdx={1}
    explainCorrect={tr({ uz: "O'xshatish tinglovchining O'Z dunyosidan olingan — u javonni har kuni ko'radi.", ru: 'Сравнение взято из СВОЕГО мира слушателя — полку он видит каждый день.' })}
    explainWrong={{
      0: tr({ uz: "«Server xotirasi» — yana kasbiy so'z; o'xshatish emas, ikkinchi noma'lum so'z.", ru: '«Память сервера» — снова профессиональное слово; это не сравнение, а второе непонятное слово.' }),
      2: tr({ uz: "«Massiv» — kod tili. Do'kon egasi bu so'zni bilmaydi.", ru: '«Массив» — язык кода. Хозяин этого слова не знает.' }),
      3: tr({ uz: "Bu aniq narsani ko'rsatmaydi: «ichki qism» ham noma'lum bo'lib qolaveradi.", ru: 'Это не показывает конкретную вещь: «внутренняя часть» остаётся непонятной.' }),
      default: tr({ uz: "Yana bir bor o'ylab ko'ring.", ru: 'Подумайте ещё раз.' })
    }} />
);

// ===== SCREEN 9 — USTAXONA: 5 bo'lakli pitch matni =====
const PITCH_FIELDS = [
  { key: 'kim', short: { uz: 'Kim uchun', ru: 'Для кого' }, ask: { uz: 'Bu sayt kim uchun?', ru: 'Для кого этот сайт?' }, ph: { uz: 'Kim foydalanadi?..', ru: 'Кто пользуется?..' }, min: 3,
    sample: { uz: 'Maktab yonidan o\'tib ketadigan o\'quvchilar uchun', ru: 'Для учеников, которые проходят мимо школы' } },
  { key: 'muammo', short: { uz: 'Qanday muammo', ru: 'Какая трудность' }, ask: { uz: 'Ular qanday qiyinchilikka duch keladi?', ru: 'С какой трудностью они сталкиваются?' }, ph: { uz: 'Nima qiyin?..', ru: 'Что сложно?..' }, min: 8,
    sample: { uz: 'Narx va bugungi menyuni bilish uchun har safar do\'konga kirish kerak', ru: 'Чтобы узнать цену и меню дня, каждый раз нужно заходить в магазин' } },
  { key: 'qiladi', short: { uz: 'Nima qiladi', ru: 'Что делает' }, ask: { uz: 'Sayt buni qanday hal qiladi?', ru: 'Как сайт это решает?' }, ph: { uz: 'Sayt nima qiladi?..', ru: 'Что делает сайт?..' }, min: 8,
    sample: { uz: 'Sayt bugungi menyuni va narxlarni telefon ekranida ko\'rsatadi', ru: 'Сайт показывает меню дня и цены на экране телефона' } },
  { key: 'ishlaydi', short: { uz: 'Nega ishlaydi', ru: 'Почему работает' }, ask: { uz: 'Sayt buni qanday uddalaydi? Bitta o\'xshatish bilan ayting', ru: 'Как сайт справляется? Скажите одним сравнением' }, ph: { uz: 'Nimaga o\'xshaydi?..', ru: 'На что похоже?..' }, min: 8,
    sample: { uz: 'Bosh sahifa peshtaxtaga o\'xshaydi: hamma narsa bir ko\'rinishda turadi', ru: 'Главная страница похожа на прилавок: всё видно с одного взгляда' } },
  { key: 'soraym', short: { uz: 'Nima so\'rayman', ru: 'О чём прошу' }, ask: { uz: 'Do\'kon egasidan aynan nima kerak?', ru: 'Что именно нужно от хозяина?' }, ph: { uz: 'Nima kerak?..', ru: 'Что нужно?..' }, min: 6,
    sample: { uz: 'Menyu rasmlarini juma kunigacha yuborishingizni so\'rayman', ru: 'Прошу прислать фото меню до пятницы' } }
];
// O'zaklar: UZ da qo'shimchalar oxiriga yopishadi (peshtaxta+ga), RU da o'zak qisqaradi
// (прилавок → на прилавке, полка → как полку) — shuning uchun RU tomonda kesilgan o'zak.
const ANALOGY = { uz: ['peshtaxta', 'oshpaz', 'javon'], ru: ['прилав', 'повар', 'полк'] };
const ANALOGY_WORDS = [...ANALOGY.uz, ...ANALOGY.ru];
const emptyPitch = () => ({ kim: '', muammo: '', qiladi: '', ishlaydi: '', soraym: '' });
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [data, setData] = useState(() => ({ ...emptyPitch(), ...(readLS(PITCH_KEY) || {}) }));
  const [step, setStep] = useState(() => {
    const d = readLS(PITCH_KEY) || {};
    const i = PITCH_FIELDS.findIndex(f => !((d[f.key] || '').trim()));
    return i === -1 ? PITCH_FIELDS.length : i;
  });
  const [val, setVal] = useState('');
  const [showSample, setShowSample] = useState(false);
  const [editKey, setEditKey] = useState(null);
  const done = step >= PITCH_FIELDS.length;
  const cards = readLS(CARDS_KEY);
  const mvp = readLS(MVP_KEY);
  const f = done ? null : PITCH_FIELDS[step];
  const txt = val.trim();
  // Bosqichli tekshiruv (30-qonun): tugma yorlig'i AYNAN qaysi shart qolganini aytadi
  const check = (() => {
    if (!f) return { ok: true, label: null };
    if (txt.length < f.min) return { ok: false, label: { uz: `${step + 1}) ${tr(f.short)} — kamida ${f.min} belgi yozing`, ru: `${step + 1}) ${tr(f.short)} — напишите минимум ${f.min} знаков` } };
    if (f.key === 'kim' && /^(hamma|hamma odam|hamma odamlar|barcha|все|всех|всe|любой|каждый|люди)\b/i.test(txt)) return { ok: false, label: { uz: 'Bitta aniq guruh yozing: kim har kuni bu do\'konga keladi?', ru: 'Назовите одну конкретную группу: кто ходит сюда каждый день?' } };
    if (f.key === 'muammo' && txt.toLowerCase() === (data.kim || '').trim().toLowerCase()) return { ok: false, label: { uz: 'Bu yerda odam emas, uning qiyinchiligi yoziladi', ru: 'Здесь пишут не человека, а его трудность' } };
    const jr = (f.key === 'qiladi' || f.key === 'ishlaydi') ? findJargon(txt) : null;
    if (jr) return { ok: false, jrg: true, label: { uz: `«${jr}» so'zini do'kon egasi tushunmaydi — uning o'rniga nima deysiz?`, ru: `Слово «${jr}» хозяин не поймёт — чем его заменить?` } };
    if (f.key === 'qiladi' && txt.toLowerCase() === (data.muammo || '').trim().toLowerCase()) return { ok: false, label: { uz: 'Bu muammoning takrori. Sayt aynan nima qilishini yozing', ru: 'Это повтор трудности. Напишите, что именно делает сайт' } };
    if (f.key === 'ishlaydi' && !ANALOGY_WORDS.some(w => txt.toLowerCase().includes(w))) return { ok: false, label: { uz: 'Do\'konning o\'z dunyosidan bitta narsani eslang: peshtaxta, oshpaz, javon', ru: 'Вспомните одну вещь из мира магазина: прилавок, повар, полка' } };
    if (f.key === 'soraym' && /(hech narsa|ничего)/i.test(txt)) return { ok: false, label: { uz: 'Har pitch bitta so\'rov bilan tugaydi: rasmlarmi, ruxsatmi, vaqtmi?', ru: 'Каждый питч кончается одной просьбой: фото, разрешение, время?' } };
    return { ok: true, label: null };
  })();
  const save = () => {
    if (!f || !check.ok) return;
    const nd = { ...data, [f.key]: txt };
    setData(nd); setVal(''); setShowSample(false);
    const ns = step + 1;
    setStep(ns);
    writeLS(PITCH_KEY, { ...nd, savedAt: Date.now() });
    if (ns >= PITCH_FIELDS.length) {
      const clean = !PITCH_FIELDS.some(x => findJargon(nd[x.key]));
      onAnswer(screen, { stage: 'workshop', screenIdx: screen, pitch: nd, solved: true, correct: clean });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'ustaxona', 0, true, 0);
    }
  };
  const saveEdit = (k, v) => {
    const nd = { ...data, [k]: v };
    setData(nd); writeLS(PITCH_KEY, { ...nd, savedAt: Date.now() });
  };
  const level = 25 + Math.round((step / PITCH_FIELDS.length) * 68);
  return (
    <Stage eyebrow={tr({ uz: 'Pitch matni', ru: 'Текст питча' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(check.label || { uz: 'Bo\'lakni saqlang', ru: 'Сохраните часть' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,1.8vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Pitch matningizni yozing — <span className="italic" style={{ color: T.accent }}>besh bo'lak, bittalab</span>.</>, ru: <>Напишите свой питч — <span className="italic" style={{ color: T.accent }}>пять частей, по одной</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: 'Har bo\'lakni saqlaganingizda tushunish chizig\'i uni tekshiradi.', ru: 'Когда сохраняете часть, линия понимания её проверяет.' })}</Mentor>
        <MentorNote>{tr({ uz: 'Bu ishni o\'quvchilar bajaradi — siz «Kim bajardi» panelida kuzatasiz. Baholash: 5 bo\'lak saqlangan va kasbiy so\'z qolmagan bo\'lsa — qabul.', ru: 'Это делают ученики — вы следите в панели «Кто выполнил». Приём: 5 частей сохранены и профессиональных слов не осталось.' })}</MentorNote>
        <MentorWatchLine live={live} />
        <div className="wk-steps fade-up">
          {PITCH_FIELDS.map((x, i) => (
            <span key={x.key} className={`wk-step ${i < step ? 'ok' : i === step ? 'cur' : ''}`}>
              <span className="wk-num">{i < step ? '✓' : i + 1}</span><span className="wk-nm">{tr(x.short)}</span>
            </span>
          ))}
        </div>
        {!done ? (
          <div className="wk-body">
            <div className="wk-editor fade-step" key={f.key}>
              <label className="wk-ask" htmlFor="wk-in">{tr(f.ask)}</label>
              <textarea id="wk-in" className="wk-in" rows={3} value={val} onChange={e => setVal(e.target.value)} placeholder={tr(f.ph)} />
              <div className="wk-row">
                <button className="btn-soft" onClick={() => setShowSample(s => !s)}>📋 {tr({ uz: 'Namuna', ru: 'Пример' })}</button>
                <button className="btn wk-save" disabled={!check.ok} onClick={save}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
              </div>
              {showSample && <p className="wk-sample fade-step">{tr(f.sample)}</p>}
              {!check.ok && txt.length > 0 && <p className={`wk-hint fade-step ${check.jrg ? 'jrg' : ''}`}>💡 {tr(check.label)}</p>}
              {step === 0 && cards && (cards.kim || cards.muammo) && (
                <p className="wk-src">{tr({ uz: 'M1-D2 kartangizdan:', ru: 'Из вашей карточки M1-D2:' })} <b>{cards.kim || ''}</b> {cards.muammo ? `· ${cards.muammo}` : ''}</p>
              )}
              {step === 2 && Array.isArray(mvp) && mvp.length > 0 && (
                <p className="wk-src">{tr({ uz: 'M2-D7 ro\'yxatingizdan eng kerakli bittasini tanlang:', ru: 'Выберите самое нужное из вашего списка M2-D7:' })} {mvp.slice(0, 3).map(m => (typeof m === 'string' ? m : m && m.text) || '').filter(Boolean).join(' · ')}</p>
              )}
            </div>
            <Uline level={level} note={{ uz: 'chiziq o\'lchayapti', ru: 'линия измеряет' }} />
          </div>
        ) : (
          <div className="wk-body">
          <div className="wk-final fade-step">
            <div className="done-mini">✅ {tr({ uz: 'Besh bo\'lak tayyor', ru: 'Пять частей готовы' })} <span className="dm-sub">{tr({ uz: '— tahrirlash uchun ✎ belgisidan foydalaning', ru: '— для правки используйте ✎' })}</span></div>
            {PITCH_FIELDS.map(x => (
              <div key={x.key} className="wk-done-row">
                <span className="wk-done-lbl">{tr(x.short)}</span>
                {editKey === x.key ? (
                  <span className="wk-done-edit">
                    <textarea className="wk-in" rows={2} value={data[x.key]} onChange={e => saveEdit(x.key, e.target.value)} />
                    <button className="btn-soft" onClick={() => setEditKey(null)}>{tr({ uz: 'Tayyor', ru: 'Готово' })}</button>
                  </span>
                ) : (
                  <span className="wk-done-txt">{data[x.key]} <button className="wk-edit" onClick={() => setEditKey(x.key)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button></span>
                )}
              </div>
            ))}
          </div>
          {/* 28-qonun: kiritish-vizual (tushunish chizig'i) to'ldirilgach ham YO'QOLMAYDI */}
          <Uline level={96} note={{ uz: 'endi tushunarli', ru: 'теперь понятно' }} />
          </div>
        )}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Pitch matnini yozganlar', ru: '✍️ Кто написал питч' })} />
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TINGLOVCHI KURSISI =====
const SEATS = [
  { id: 1, t: { uz: "«Menyu ma'lumotlar bazasida saqlanadi, sayt uni API orqali oladi.»", ru: '«Меню хранится в базе данных, сайт берёт его через API.»' }, ok: false, why: 'jargon' },
  { id: 2, t: { uz: '«Mijoz endi narxni telefon qilmasdan ko\'radi — menyu saytda doim yangi turadi.»', ru: '«Клиент теперь видит цену без звонка — меню на сайте всегда свежее.»' }, ok: true, why: null },
  { id: 3, t: { uz: '«Saytda beshta sahifa, ikkita tugma va bitta forma bor.»', ru: '«На сайте пять страниц, две кнопки и одна форма.»' }, ok: false, why: 'foyda' }
];
const SEAT_REASONS = [
  { id: 'jargon', t: { uz: "Kasbiy so'z bor", ru: 'Есть профессиональное слово' } },
  { id: 'foyda', t: { uz: 'Foyda aytilmagan', ru: 'Выгода не названа' } },
  { id: 'uzun', t: { uz: 'Juda uzun', ru: 'Слишком длинно' } }
];
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const liveRef = useRef(live); liveRef.current = live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [i, setI] = useState(storedAnswer ? SEATS.length : 0);
  const [res, setRes] = useState(storedAnswer?.res || {});
  const [pend, setPend] = useState(null); // ✕ bosilgan — sabab kutilmoqda
  const done = i >= SEATS.length;
  useEffect(() => {
    if (done && storedAnswer === undefined) {
      const okAll = SEATS.every(s => res[s.id] && res[s.id].verdict === s.ok);
      onAnswer(screen, { stage: 'seat', screenIdx: screen, res, correct: okAll, solved: true });
      const lv = liveRef.current;
      if (lv && lv.mode === 'student') lv.submitAnswer(PRACTICE_BASE + screen, 'kursi', 0, true, 0); // praktika-signali: «Kim javob berdi» paneli shu yozuvni sanaydi
    }
  }, [done]); // eslint-disable-line
  const cur = done ? null : SEATS[i];
  const judge = (verdict) => {
    if (!cur) return;
    if (verdict === false) { setPend(true); return; }
    setRes(r => ({ ...r, [cur.id]: { verdict: true, reason: null } })); setPend(null); setI(v => v + 1);
  };
  const reason = (rid) => {
    setRes(r => ({ ...r, [cur.id]: { verdict: false, reason: rid } })); setPend(null); setI(v => v + 1);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Tinglovchi kursisi', ru: 'Кресло слушателя' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${i}/3 · ${tr({ uz: "To'g'ri yoki noto'g'riga ajrating", ru: 'Разделите на верно и неверно' })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,1.8vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>siz</span> tinglovchi kursisida o'tirasiz.</>, ru: <>Теперь <span className="italic" style={{ color: T.accent }}>вы</span> сидите в кресле слушателя.</> })}</h2></div>
        <Mentor>{tr({ uz: 'Har gapni do\'kon egasi tushunadimi? Bittalab ✓ yoki ✕ ga ajrating.', ru: 'Каждую фразу хозяин поймёт? Разделите по одной.' })}</Mentor>
        <MentorWatchLine live={live} />
        <div className="st-prog fade-up">{SEATS.map((s, k) => <span key={s.id} className={`st-dot ${k < i ? 'fill' : k === i ? 'cur' : ''}`} />)}<span className="st-cnt">{Math.min(i + 1, SEATS.length)}/3</span></div>
        {cur && (
          <div className="st-card fade-step" key={cur.id}>
            <span className="st-face">🧑‍🍳</span>
            <p className="st-t">{tr(cur.t)}</p>
            {!pend ? (
              <div className="st-btns">
                <button className="st-yes" onClick={() => judge(true)}>✓ {tr({ uz: "To'g'ri", ru: 'Верно' })}</button>
                <button className="st-no" onClick={() => judge(false)}>✕ {tr({ uz: "Noto'g'ri", ru: 'Неверно' })}</button>
              </div>
            ) : (
              <div className="st-reasons fade-step">
                <span className="st-rl">{tr({ uz: 'Sabab?', ru: 'Причина?' })}</span>
                {SEAT_REASONS.map(r => <button key={r.id} className="st-reason" onClick={() => reason(r.id)}>{tr(r.t)}</button>)}
              </div>
            )}
          </div>
        )}
        {done && (
          <div className="st-strip fade-step">
            {SEATS.map(s => {
              const r = res[s.id] || {};
              const right = r.verdict === s.ok;
              return (
                <div key={s.id} className={`st-sum ${s.ok ? 'good' : 'bad'}`}>
                  <span className="st-sum-h">{s.ok ? '✓' : '✕'} {right ? tr({ uz: 'javobingiz to\'g\'ri', ru: 'ваш ответ верный' }) : tr({ uz: 'asl kamchilik boshqa', ru: 'настоящий недостаток другой' })}</span>
                  <span className="st-sum-t">{s.ok
                    ? tr({ uz: 'Foyda aytilgan va kasbiy so\'z yo\'q.', ru: 'Выгода названа, профессиональных слов нет.' })
                    : s.why === 'jargon' ? tr({ uz: 'Kasbiy so\'z bor: baza, API.', ru: 'Есть профессиональные слова: база, API.' })
                      : tr({ uz: 'Faqat nimadan qurilgani aytilgan, foyda yo\'q.', ru: 'Сказано только про устройство, выгоды нет.' })}</span>
                </div>
              );
            })}
          </div>
        )}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '👀 Kim javob berdi', ru: '👀 Кто ответил' })} />
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — KODING (to'liq-ekran kompilyator) =====
const KOD_STARTER = `// Saytingiz uch qatlamdan iborat. Har qatlamni do'kon egasi tushunadigan tilda yozing.
const sistema = {
  korinish: "",   // peshtaxta: mijoz ekranda nimani ko'radi?
  ishlash:  "",   // oshpaz: sayt qanday ishni o'zi bajaradi?
  malumot:  ""    // javon: sayt nimani eslab qoladi?
};

const qatlamlar = ["korinish", "ishlash", "malumot"];
const nomlar = {
  korinish: "Ko'rinadigan qism",
  ishlash:  "Ishni bajaradigan qism",
  malumot:  "Ma'lumot saqlanadigan joy"
};

// Bu funksiya bitta qatlamni tayyor gapga aylantiradi.
function oddiyGap(qatlam) {
  return nomlar[qatlam] + ": " + "";
}

// Uchala qatlamni ekranga chiqaring.
for (let i = 0; i < qatlamlar.length; i++) {
  // chiqar(...) ni shu yerda chaqiring
}`;
const KOD_CONDS = [
  { id: 'c1', label: { uz: "Uch qatlam to'ldirilgan", ru: 'Три слоя заполнены' }, hint: { uz: "Har qator ichidagi qo'shtirnoq orasiga o'z javobingizni yozing.", ru: 'Впишите свой ответ между кавычками в каждой строке.' } },
  { id: 'c2', label: { uz: 'Funksiya gap qaytaradi', ru: 'Функция возвращает фразу' }, hint: { uz: "return qatoriga sistema[qatlam] ni qo'shing.", ru: 'Добавьте в строку return выражение sistema[qatlam].' } },
  { id: 'c3', label: { uz: 'Uch qator chiqdi', ru: 'Вышли три строки' }, hint: { uz: "Sikl ichida chiqar(oddiyGap(qatlamlar[i])) deb yozing.", ru: 'Внутри цикла напишите chiqar(oddiyGap(qatlamlar[i])).' } }
];
const KOD_CSS = `*{box-sizing:border-box}body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;margin:0;padding:16px;background:#F2F0FA;color:#1B1630}
#out{display:flex;flex-direction:column;gap:9px}
.k-empty{font-style:italic;color:#9C97B4;font-size:13px;margin:0}
.k-err{font-family:monospace;font-size:13px;color:#E5484D;background:#FCE7E8;border-radius:9px;padding:10px 12px;margin:0;white-space:pre-wrap;word-break:break-word}
.k-card{font-family:'Source Serif 4',Georgia,serif;font-size:15px;line-height:1.5;background:#fff;border-radius:9px;padding:11px 13px;box-shadow:0 5px 14px -8px rgba(40,34,82,.25);border-left:3px solid #E7E3F4;white-space:pre-wrap;word-break:break-word;min-width:0}
.k-card.ok{border-left-color:#12A968}`;
const KOD_HARNESS = (nonce) => `(function(){
  var N=${JSON.stringify(nonce)};
  var out=window.__out||[];var err=null;var c1=false,c2=false,c3=false,bad=null;
  var J=${JSON.stringify(JARGON_WORDS)};
  var W=function(t,at,n){var isW=function(c){return !!c && !/[\\s.,!?;:()«»"—–-]/.test(c);};
    var s=at,e=at+n;while(s>0&&isW(t.charAt(s-1)))s--;while(e<t.length&&isW(t.charAt(e)))e++;return t.slice(s,e);};
  try{
    var s=(typeof sistema!=="undefined")?sistema:null;
    if(s){c1=["korinish","ishlash","malumot"].every(function(k){return typeof s[k]==="string"&&s[k].trim().length>=6;});}
    var probe=(typeof oddiyGap==="function")?oddiyGap("korinish"):null;
    c2=!!(typeof probe==="string"&&s&&s.korinish&&s.korinish.trim().length>0&&probe.indexOf(s.korinish.trim())!==-1);
    c3=out.length===3;
    var joinedRaw=out.join(" ");var joined=joinedRaw.toLowerCase();
    for(var i=0;i<J.length;i++){var at=joined.indexOf(J[i]);if(at!==-1){bad=W(joinedRaw,at,J[i].length);break;}}
  }catch(e){err=String(e&&e.message||e);}
  var esc=function(t){return String(t).replace(/[&<>]/g,function(m){return m==="&"?"&amp;":m==="<"?"&lt;":"&gt;";});};
  var root=document.getElementById("out");
  if(root){
    if(err){root.innerHTML='<p class="k-err">Kod ishlamadi: '+esc(err)+'</p>';}
    else if(!out.length){root.innerHTML='<p class="k-empty">Natija hali chiqmadi — chiqar(...) ni chaqiring.</p>';}
    else{root.innerHTML=out.map(function(l){return '<div class="k-card '+(bad?"":"ok")+'">'+esc(l)+'</div>';}).join("");}
  }
  try{parent.postMessage({__pmKod:true,nonce:N,c1:c1,c2:c2,c3:c3,err:err,bad:bad},"*");}catch(e){}
})();`;
const KOD_wrapDoc = (code, nonce) => `<!doctype html><html lang="uz"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><style>${KOD_CSS}</style>
<script>window.__out=[];window.chiqar=function(v){window.__out.push(String(v));};<\/script>
</head><body><div id="out"></div>
<script>${code}<\/script>
<script>${KOD_HARNESS(nonce)}<\/script>
</body></html>`;
const readKoding = () => readLS(KODING_KEY);
// F-0801-01: kompilyator ochiq-yopiqligi ham saqlanadi — fon-tabda Chrome sahifani
// qayta yuklasa (Memory Saver), o'quvchi kompilyator ICHIGA qaytadi, praktika-sahifaga emas.
const writeKodingOpen = (open) => writeLS(KODING_KEY, { ...(readKoding() || {}), open });
function PmCompiler({ initialCode, onContinue, onBack }) {
  const [code, setCode] = useState(initialCode || '');
  const nonceRef = useRef(0);
  const [doc, setDoc] = useState('');
  const [st, setSt] = useState({ err: null, bad: null, conds: { c1: false, c2: false, c3: false } });
  useEffect(() => {
    const t = setTimeout(() => {
      const nonce = ++nonceRef.current;
      setDoc(KOD_wrapDoc(code, nonce));
      const prev = readKoding();
      writeLS(KODING_KEY, { code, done: !!(prev && prev.done), open: true });
    }, 400);
    return () => clearTimeout(t);
  }, [code]);
  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.__pmKod && d.nonce === nonceRef.current) setSt({ err: d.err || null, bad: d.bad || null, conds: { c1: !!d.c1, c2: !!d.c2, c3: !!d.c3 } });
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const { conds, err, bad } = st;
  const passed = conds.c1 && conds.c2 && conds.c3 && !bad;
  const okN = KOD_CONDS.filter(c => conds[c.id]).length;
  const firstHint = KOD_CONDS.find(c => !conds[c.id]);
  const runNow = () => { const nonce = ++nonceRef.current; setDoc(KOD_wrapDoc(code, nonce)); };
  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target, s = el.selectionStart, en = el.selectionEnd;
      setCode(code.slice(0, s) + '  ' + code.slice(en));
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    }
  };
  return (
    <div className="hcp-root">
      <div className="hcp-wrap">
        <header className="hcp-top">
          <span className="hcp-eyebrow">{tr({ uz: 'Koding · praktika', ru: 'Кодинг · практика' })}</span>
          <h1 className="hcp-title">{tr({ uz: "Saytingizning uch qatlamini sahifada ko'rsatamiz", ru: 'Покажем три слоя вашего сайта на странице' })}</h1>
          <p className="hcp-brief">{tr({ uz: <>Obyektga uch qatlamni yozing, <span className="mono">oddiyGap</span> har qatlamni sodda gapga aylantirsin, sikl uchalasini <span className="mono">chiqar</span> bilan chiqarsin.</>, ru: <>Впишите три слоя в объект, пусть <span className="mono">oddiyGap</span> превращает слой во фразу, а цикл выводит все три через <span className="mono">chiqar</span>.</> })}</p>
          <div className="hcp-checklist">
            <span className="hcp-count">{okN}/{KOD_CONDS.length}</span>
            {KOD_CONDS.map((c, i) => (
              <span key={c.id} className={`hcp-chip ${conds[c.id] ? 'ok' : ''}`} title={tr(c.hint)}>
                <span className="hcp-dot">{conds[c.id] ? '✓' : i + 1}</span>{tr(c.label)}
              </span>
            ))}
            {bad && <span className="hcp-chip warn"><span className="hcp-dot">!</span>⚠️ {tr({ uz: "Kasbiy so'z qoldi", ru: 'Осталось профессиональное слово' })}: {bad}</span>}
          </div>
          {err
            ? <p className="hcp-err">⚠ {tr({ uz: 'Kod ishlamadi', ru: 'Код не сработал' })}: {err}</p>
            : bad ? <p className="hcp-hint jrg">💡 {tr({ uz: `Natijada «${bad}» so'zi qoldi — uni tanish so'z bilan almashtiring.`, ru: `В результате осталось слово «${bad}» — замените его знакомым.` })}</p>
              : (!passed && firstHint && <p className="hcp-hint">💡 {tr(firstHint.hint)}</p>)}
        </header>
        <main className="hcp-split">
          <section className="hcp-pane">
            <div className="hcp-pane-bar dark">
              <span className="bb-dots"><i /><i /><i /></span>
              <span className="hcp-tab">sistema.js</span>
              <button className="hcp-mini" onClick={runNow}>▶ {tr({ uz: 'Ishga tushirish', ru: 'Запустить' })}</button>
            </div>
            <div className="hcp-code-wrap">
              <textarea className="hcp-code" value={code} spellCheck={false} autoCapitalize="off" autoCorrect="off"
                onChange={e => setCode(e.target.value)} onKeyDown={onKeyDown} onCopy={e => e.preventDefault()} onPaste={e => e.preventDefault()} />
            </div>
          </section>
          <section className="hcp-pane">
            <div className="hcp-pane-bar">
              <span className="hcp-pane-name">📺 {tr({ uz: 'Natija', ru: 'Результат' })}</span>
              <span className="hcp-live">{tr({ uz: 'jonli', ru: 'вживую' })}</span>
            </div>
            {doc
              ? <iframe key={nonceRef.current} className="hcp-frame" title={tr({ uz: 'Jonli natija', ru: 'Живой результат' })} sandbox="allow-scripts" srcDoc={doc} />
              : <p style={{ padding: 16, margin: 0 }}>{tr({ uz: 'Yozishni boshlang — natija shu yerda chiqadi.', ru: 'Начните писать — результат появится здесь.' })}</p>}
          </section>
        </main>
        <footer className="hcp-bottom">
          <button className="hcp-ghost" onClick={onBack}>← {tr({ uz: 'Darsga qaytish', ru: 'Вернуться к уроку' })}</button>
          <button className="hcp-ghost" onClick={() => setCode(KOD_STARTER)}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button>
          <div className="hcp-status">
            {passed
              ? <span className="hcp-ok-msg">✓ {tr({ uz: 'Uchala shart bajarildi!', ru: 'Все три условия выполнены!' })}</span>
              : <span className="hcp-wait-msg">🔒 {tr({ uz: "Kod qo'lda yoziladi — nusxalash yopiq", ru: 'Код пишется вручную — копирование закрыто' })}</span>}
          </div>
          <button className="hcp-next" disabled={!passed} onClick={() => passed && onContinue({ code })}>{tr({ uz: 'Davom etish', ru: 'Продолжить' })} →</button>
        </footer>
      </div>
    </div>
  );
}
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const isSelf = !live || live.mode === 'self';
  // F-0801-01: qayta yuklanishda (Chrome fon-tabni bo'shatgan bo'lsa) kompilyator o'zi qayta ochiladi
  const [open, setOpen] = useState(() => { const s = readKoding(); return !!(s && s.open); });
  const [st, setSt] = useState(() => {
    const saved = readKoding();
    return { code: storedAnswer?.code || (saved && saved.code) || KOD_STARTER, done: !!(storedAnswer && storedAnswer.solved) || !!(saved && saved.done) };
  });
  const { code, done } = st;
  useEffect(() => {
    if (done && storedAnswer === undefined) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  }, []); // eslint-disable-line
  const finish = ({ code: nc }) => {
    setOpen(false); setSt({ code: nc, done: true });
    writeLS(KODING_KEY, { code: nc, done: true, open: false });
    if (!done) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code: nc, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  const pitch = readLS(PITCH_KEY) || {};
  const prev = [
    { k: LAYERS3[0], v: pitch.qiladi || tr({ uz: 'Bugungi menyuni ko\'rsatadi', ru: 'Показывает меню дня' }) },
    { k: LAYERS3[2], v: pitch.ishlaydi || tr({ uz: 'Narxlarni eslab qoladi', ru: 'Запоминает цены' }) }
  ];
  return (
    <Stage eyebrow={tr({ uz: 'Koding · 🛠 kompilyator', ru: 'Кодинг · 🛠 компилятор' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval kompilyatorda bajaring', ru: 'Сначала выполните в компиляторе' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi saytingizning uch qatlamini <span className="italic" style={{ color: T.accent }}>sahifada ko'rsatamiz</span>.</>, ru: <>Теперь <span className="italic" style={{ color: T.accent }}>покажем на странице</span> три слоя вашего сайта.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Obyekt, funksiya va sikl — hammasi tanish. Yangisi bitta: <b style={{ color: T.ink }}>uch qatlamni o'z tilingizda yozasiz</b>.</>, ru: <>Объект, функция и цикл вам знакомы. Новое одно: <b style={{ color: T.ink }}>три слоя пишете своими словами</b>.</> })}</Mentor>
        <MentorNote>{tr({ uz: 'Vaqt: 10 daqiqa. Tugallanmasa — uy vazifasining qisqa varianti beriladi.', ru: 'Время: 10 минут. Не успели — даётся короткий вариант домашнего задания.' })}</MentorNote>
        <MentorWatchLine live={live} />
        <div className="kdx fade-up delay-1">
          <div className="kdx-fn">
            <span className="kdx-fn-bar"><span className="bb-dots"><i /><i /><i /></span>sistema.js</span>
            <code className="kdx-fn-code">oddiyGap(<span className="kx-kim">qatlam</span>)</code>
          </div>
          <span className="kdx-arrow" aria-hidden="true">➜</span>
          <div className="kdx-out">
            {prev.map((p, i) => (
              <div key={i} className="kdx-card" style={{ '--kd': `${0.5 + i * 0.3}s` }}><b>{tr(p.k.name)}</b>: {p.v}</div>
            ))}
          </div>
        </div>
        <div className="kdx-cta fade-up delay-2">
          <button className="kod-launch-btn" onClick={() => { setOpen(true); writeKodingOpen(true); }}>{done ? tr({ uz: '↻ Kompilyatorni qayta ochish', ru: '↻ Открыть компилятор снова' }) : tr({ uz: '🛠 Kompilyatorni ochish', ru: '🛠 Открыть компилятор' })}</button>
          {!done && isSelf && <button className="kdx-skip" onClick={onNext}>✓ {tr({ uz: 'Bu mashqni sinfda bajarganman — davom etish →', ru: 'Я делал это упражнение в классе — продолжить →' })}</button>}
        </div>
        <div className="takeaway fade-up delay-2"><span className="ta-bulb">📌</span><p className="ta-h">{tr({ uz: "Sistema — uch qatlam: ko'rinadigan qism, ishni bajaradigan qism va ma'lumot saqlanadigan joy. Uchalasini o'z tilingizda ayta olsangiz — sistemani tushuntira olasiz.", ru: 'Система — три слоя: видимая часть, часть, которая делает работу, и место хранения данных. Скажете все три своими словами — объясните систему.' })}</p></div>
        {done && <div className="done-mini fade-step" style={{ alignSelf: 'center' }}>✅ {tr({ uz: 'Ishladi!', ru: 'Сработало!' })} <span className="dm-sub">{tr({ uz: '— uch qatlam sahifada chiqdi', ru: '— три слоя вышли на страницу' })}</span></div>}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '🛠 Kodni yozib bo\'lganlar', ru: '🛠 Кто дописал код' })} />
      </div>
      {open && <PmCompiler initialCode={code} onContinue={finish} onBack={() => { setOpen(false); writeKodingOpen(false); }} />}
    </Stage>
  );
};

// ===== SCREEN 12 — BITTA GAP (modul-yakuni) =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [p] = useState(() => readLS(PITCH_KEY) || {});
  const [edit, setEdit] = useState(false);
  const build = () => {
    const g = (k, d) => (p[k] && String(p[k]).trim()) || d;
    return tr({
      uz: `${g('kim', "Do'kon mijozlari")} uchun sayt qildim — ilgari ${g('muammo', 'narxni bilish qiyin edi')}, endi ${g('qiladi', 'hammasi ekranda ko\'rinadi')}; u ${g('ishlaydi', 'peshtaxta kabi ishlaydi')}, va sizdan ${g('soraym', 'menyu rasmlari kerak')}.`,
      ru: `Я сделал сайт для: ${g('kim', 'клиенты магазина')} — раньше ${g('muammo', 'узнать цену было трудно')}, теперь ${g('qiladi', 'всё видно на экране')}; он ${g('ishlaydi', 'работает как прилавок')}, и от вас ${g('soraym', 'нужны фото меню')}.`
    });
  };
  const [text, setText] = useState(() => (readLS(PITCH_KEY) || {}).gap || build());
  const saveGap = (v) => { setText(v); writeLS(PITCH_KEY, { ...(readLS(PITCH_KEY) || {}), gap: v }); };
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { stage: 'onesentence', screenIdx: screen, correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Bitta gap', ru: 'Одна фраза' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,1.8vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Besh bo'lak <span className="italic" style={{ color: T.accent }}>bitta gapga</span> yig'ildi.</>, ru: <>Пять частей собрались <span className="italic" style={{ color: T.accent }}>в одну фразу</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: 'Bu gapni ovoz chiqarib bir marta o\'qib chiqing — quloqqa qanday eshitiladi?', ru: 'Прочитайте эту фразу вслух один раз — как она звучит?' })}</Mentor>
        {!edit ? (
          <div className="og-card fade-up delay-1">
            <p className="og-text">{text}</p>
            <button className="btn-soft og-edit" onClick={() => setEdit(true)}>✎ {tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}</button>
          </div>
        ) : (
          <div className="og-card fade-step">
            <textarea className="wk-in" rows={4} value={text} onChange={e => saveGap(e.target.value)} />
            <button className="btn og-edit" onClick={() => setEdit(false)}>{tr({ uz: 'Tayyor', ru: 'Готово' })}</button>
          </div>
        )}
        <div className="og-path fade-up delay-2">
          <span className="og-step">M1-D2 · {tr({ uz: 'kim uchun', ru: 'для кого' })}</span>
          <span className="og-arr">→</span>
          <span className="og-step">M2-D7 · {tr({ uz: "ro'yxatingiz", ru: 'ваш список' })}</span>
          <span className="og-arr">→</span>
          <span className="og-step">{tr({ uz: 'qurgan saytingiz', ru: 'ваш сайт' })}</span>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — RECAP: yoddan ayting =====
const PEER_VERDICTS = [
  { id: 'full', t: { uz: '🙂 Tushundim', ru: '🙂 Понял' } },
  { id: 'half', t: { uz: '😐 Yarim tushundim', ru: '😐 Понял наполовину' } },
  { id: 'none', t: { uz: '😕 Tushunmadim', ru: '😕 Не понял' } }
];
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isSolo = !live || live.mode === 'self';
  const [verdict, setVerdict] = useState(storedAnswer?.verdict ?? null);
  const [line, setLine] = useState(() => (readLS(REFLECT_KEY) || {}).line || '');
  const ok = verdict !== null && line.trim().length >= 3;
  useEffect(() => {
    if (ok && storedAnswer === undefined) onAnswer(screen, { stage: 'recap', screenIdx: screen, verdict, line, correct: true });
  }, [ok, verdict, line]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Yoddan ayting', ru: 'Скажите наизусть' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ok} label={ok ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : verdict === null ? tr({ uz: '① Sherik hukmini belgilang', ru: '① Отметьте оценку напарника' }) : tr({ uz: '② Bir qator yozing', ru: '② Напишите одну строку' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,1.8vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Pitchingizni <span className="italic" style={{ color: T.accent }}>yoddan</span> ayta olasizmi?</>, ru: <>Сможете рассказать питч <span className="italic" style={{ color: T.accent }}>наизусть</span>?</> })}</h2></div>
        <Mentor>{isSolo
          ? tr({ uz: 'Ovoz chiqarib ayting va o\'zingizni baholang.', ru: 'Скажите вслух и оцените себя.' })
          : tr({ uz: 'Ekranga qaramasdan sherigingizga ayting. Sherigingiz uch tugmadan birini bosadi.', ru: 'Расскажите напарнику, не глядя на экран. Он нажмёт одну из трёх кнопок.' })}</Mentor>
        <div className="pv-verdicts fade-up delay-1">
          <span className="pv-vl">{isSolo ? tr({ uz: 'O\'zingizni baholang:', ru: 'Оцените себя:' }) : tr({ uz: 'Sherik hukmi:', ru: 'Оценка напарника:' })}</span>
          {PEER_VERDICTS.map(v => (
            <button key={v.id} className={`chip ${verdict === v.id ? 'chip-on' : ''}`} onClick={() => setVerdict(v.id)}>{tr(v.t)}</button>
          ))}
        </div>
        <div className="rf-box fade-up delay-2">
          <label className="wk-ask" htmlFor="rf-in">{tr({ uz: 'Qaysi bo\'lakni soddalashtirasiz?', ru: 'Какую часть упростите?' })}</label>
          <textarea id="rf-in" className="wk-in" rows={2} value={line} onChange={e => { setLine(e.target.value); writeLS(REFLECT_KEY, { line: e.target.value }); }} placeholder={tr({ uz: 'Bir qator…', ru: 'Одна строка…' })} />
        </div>
        {verdict === 'none' && <p className="wk-hint fade-step">💡 {tr({ uz: 'Qaysi so\'z tushunarsiz chiqdi? Uni tanish so\'z bilan almashtiring.', ru: 'Какое слово оказалось непонятным? Замените его знакомым.' })}</p>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — TEST-4 (final) =====
const Screen14 = (p) => (
  <QuestionScreen {...p} scope="final" eyebrow={tr({ uz: 'Yakuniy savol', ru: 'Итоговый вопрос' })}
    question={<Q>{tr({ uz: <>Do'kon egasi «tushunmadim» dedi. <span className="italic" style={{ color: T.accent }}>Birinchi navbatda</span> nimani tekshirasiz?</>, ru: <>Хозяин сказал «не понял». Что вы проверите <span className="italic" style={{ color: T.accent }}>в первую очередь</span>?</> })}</Q>}
    questionText={tr({ uz: "Pitchingizni eshitgan do'kon egasi «tushunmadim» dedi. Birinchi navbatda nimani tekshirasiz?", ru: 'Хозяин, услышав ваш питч, сказал «не понял». Что проверите первым делом?' })}
    options={[
      tr({ uz: 'Gaplaringiz orasida faqat kod yozadigan odamlar biladigan so\'zlar qolganini.', ru: 'Остались ли во фразах слова, которые знают только пишущие код.' }),
      tr({ uz: 'Ovozingiz yetarlicha baland chiqqanini.', ru: 'Достаточно ли громко звучал ваш голос.' }),
      tr({ uz: 'Nutqingiz necha daqiqa davom etganini.', ru: 'Сколько минут длилась ваша речь.' }),
      tr({ uz: 'Saytning rangi do\'konga mos kelishini.', ru: 'Подходит ли цвет сайта магазину.' })
    ]}
    correctIdx={0}
    explainCorrect={tr({ uz: "Tushunmaslikning birinchi sababi — kasbiy so'z. Uni tanish so'z yoki o'xshatish bilan almashtirasiz.", ru: 'Первая причина непонимания — профессиональное слово. Его заменяют знакомым словом или сравнением.' })}
    explainWrong={{
      1: tr({ uz: 'Ovoz eshitilgan — u «eshitmadim» demadi, «tushunmadim» dedi.', ru: 'Голос был слышен — он сказал не «не расслышал», а «не понял».' }),
      2: tr({ uz: 'Uzunlik ikkinchi darajali: qisqa gap ham tushunarsiz bo\'lishi mumkin.', ru: 'Длина второстепенна: и короткая фраза бывает непонятной.' }),
      3: tr({ uz: 'Rang bu yerda hech narsani hal qilmaydi — gap so\'zlarda.', ru: 'Цвет здесь ничего не решает — дело в словах.' }),
      default: tr({ uz: "Yana bir bor o'ylab ko'ring.", ru: 'Подумайте ещё раз.' })
    }} />
);

// ===== SCREEN 15 — UYGA VAZIFA (shartnoma) =====
const HW_STEPS = [
  { uz: 'Pitchingizni kod bilmaydigan bitta odamga ayting — oila a\'zosi yoki qo\'shningizga.', ru: 'Расскажите питч одному человеку без кода — родному или соседу.' },
  { uz: 'Uning bitta savoliga javob bering va o\'sha savolni pitch matningiz ostiga yozib qo\'ying.', ru: 'Ответьте на один его вопрос и запишите этот вопрос под текстом питча.' },
  { uz: 'Qaysi bo\'lak tushunarsiz chiqqan bo\'lsa — o\'sha bo\'lakni qayta yozing.', ru: 'Какая часть оказалась непонятной — перепишите её.' }
];
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [variant, setVariant] = useState(storedAnswer?.variant ?? (readLS(HW_KEY) || {}).variant ?? null);
  const choose = (v) => { setVariant(v); writeLS(HW_KEY, { variant: v, at: Date.now() }); onAnswer(screen, { stage: 'hw', screenIdx: screen, variant: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={variant === null} label={variant === null ? tr({ uz: 'Variantni tanlang', ru: 'Выберите вариант' }) : tr({ uz: 'Amaliy topshiriqni bajarish →', ru: 'Выполнить практическое задание →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,1.8vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Pitchingizni uyda <span className="italic" style={{ color: T.accent }}>bitta real tinglovchiga</span> ayting.</>, ru: <>Дома расскажите питч <span className="italic" style={{ color: T.accent }}>одному настоящему слушателю</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: 'Ikki variantdan birini tanlang — ikkalasi ham qabul qilinadi.', ru: 'Выберите один из двух вариантов — оба принимаются.' })}</Mentor>
        <MentorNote>{tr({ uz: 'Tekshirish: o\'quvchi tinglovchining savolini yozib kelgan bo\'lsa — vazifa bajarilgan.', ru: 'Проверка: если ученик записал вопрос слушателя — задание выполнено.' })}</MentorNote>
        <div className="hw-card fade-up delay-1">
          <ol className="hw-steps">
            {HW_STEPS.map((s, i) => (<li key={i}><span className="hw-n">{i + 1}</span><span>{tr(s)}</span></li>))}
          </ol>
        </div>
        <div className="hw-vars fade-up delay-2">
          <button className={`hw-var ${variant === 'full' ? 'on' : ''}`} onClick={() => choose('full')}>
            <span className="hw-var-h">{tr({ uz: 'To\'liq · ~20 daqiqa', ru: 'Полный · ~20 минут' })}</span>
            <span className="hw-var-t">{tr({ uz: 'Uchala qadamni bajaraman.', ru: 'Выполню все три шага.' })}</span>
          </button>
          <button className={`hw-var ${variant === 'short' ? 'on' : ''}`} onClick={() => choose('short')}>
            <span className="hw-var-h">{tr({ uz: 'Qisqa · ~10 daqiqa', ru: 'Короткий · ~10 минут' })}</span>
            <span className="hw-var-t">{tr({ uz: 'Pitchni bitta odamga aytaman va uning savolini yozib qo\'yaman.', ru: 'Расскажу питч одному человеку и запишу его вопрос.' })}</span>
          </button>
        </div>
        {variant && <div className="done-mini fade-step">✅ {tr({ uz: 'Shartnoma tuzildi', ru: 'Договор заключён' })}</div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 17 — CODE STRIKE ARENA =====
const ScreenArena = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [arena, setArena] = useState(false);
  const [solo, setSolo] = useState(false);
  const quizSt = (live && live.quiz && live.quiz.state) || 'off';
  const isStudentL = live && live.mode === 'student';
  const isMentorL = live && live.mode === 'mentor';
  const classOver = !!(live && (live.status === 'ended' || !live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== 'done';
  const studentLive = isStudentL && !studentSolo && quizSt !== 'off';
  const studentWait = isStudentL && !studentSolo && quizSt === 'off';
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const openArena = async () => {
    if (isMentorL && quizSt === 'off') { try { await live.quizControl('lobby', -1); } catch { return; } }
    setSolo(studentSolo); setArena(true);
  };
  return (
    <Stage eyebrow="CODE STRIKE" screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>12 savol, har biriga <span className="italic" style={{ color: T.accent }}>15 soniya</span>.</>, ru: <>12 вопросов, на каждый <span className="italic" style={{ color: T.accent }}>15 секунд</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: 'Bugungi darsning hamma mavzusi shu yerda — tez javob bering.', ru: 'Здесь все темы сегодняшнего урока — отвечайте быстро.' })}</Mentor>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={live || { mode: 'self' }} startSolo={solo} onClose={() => setArena(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🃏 FLASHCARDS =====
const PITCH_FLASHCARDS = [
  { front: { uz: 'Pitch nima?', ru: 'Что такое питч?' }, back: { uz: 'Mahsulotni qisqa qilib tushuntirib berish.', ru: 'Короткий рассказ о продукте.' }, note: { uz: 'qisqa taqdimot', ru: 'короткая презентация' } },
  { front: { uz: "Kasbiy so'z (jargon) nima?", ru: 'Что такое профессиональное слово (жаргон)?' }, back: { uz: 'Faqat shu ishni qiladigan odamlar biladigan so\'z.', ru: 'Слово, которое знают только люди этой профессии.' }, note: { uz: 'tinglovchida rasm hosil qilmaydi', ru: 'не создаёт картины у слушателя' } },
  { front: { uz: "O'xshatish (analogiya) nima?", ru: 'Что такое сравнение (аналогия)?' }, back: { uz: 'Notanish narsani tinglovchi taniydigan narsaga o\'xshatib aytish.', ru: 'Рассказать о незнакомом через знакомое слушателю.' }, note: { uz: 'peshtaxta, oshpaz, javon', ru: 'прилавок, повар, полка' } },
  { front: { uz: 'Tushuntirish qaysi gapdan boshlanadi?', ru: 'С какой фразы начинается объяснение?' }, back: { uz: 'Tinglovchi oladigan foydadan.', ru: 'С выгоды слушателя.' }, note: { uz: 'qurilishi keyin keladi', ru: 'устройство — потом' } },
  { front: { uz: 'Sistemaning uch qatlami qaysilar?', ru: 'Какие три слоя у системы?' }, back: { uz: "Ko'rinadigan qism, ishni bajaradigan qism, ma'lumot saqlanadigan joy.", ru: 'Видимая часть, часть, которая делает работу, место хранения данных.' }, note: { uz: 'uchtasi birga — sistema', ru: 'три вместе — система' } },
  { front: { uz: "Ko'rinadigan qism do'konda nimaga o'xshaydi?", ru: 'На что в магазине похожа видимая часть?' }, back: { uz: 'Peshtaxtaga — mijoz shu yerda hamma narsani ko\'radi.', ru: 'На прилавок — клиент всё видит здесь.' }, note: null },
  { front: { uz: "Ma'lumot saqlanadigan joy do'konda nimaga o'xshaydi?", ru: 'На что в магазине похоже место хранения данных?' }, back: { uz: 'Javonga — nima borligi shu yerda turadi.', ru: 'На полку — что есть, лежит здесь.' }, note: null },
  { front: { uz: 'Pitch matni qaysi besh bo\'lakdan iborat?', ru: 'Из каких пяти частей состоит питч?' }, back: { uz: "Kim uchun · qanday muammo · nima qiladi · nega ishlaydi · nima so'rayman.", ru: 'Для кого · какая трудность · что делает · почему работает · о чём прошу.' }, note: null },
  { front: { uz: "Yaxshi o'xshatish qayerdan olinadi?", ru: 'Откуда берут хорошее сравнение?' }, back: { uz: 'Tinglovchining o\'z hayotidan.', ru: 'Из жизни самого слушателя.' }, note: null },
  { front: { uz: 'Pitch nima bilan tugaydi?', ru: 'Чем заканчивается питч?' }, back: { uz: 'Bitta aniq so\'rov bilan.', ru: 'Одной конкретной просьбой.' }, note: null }
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
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Учим' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
          <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
            <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span><span className="fc-cue">{tr({ uz: 'Javobni o\'ylang 🤔', ru: 'Подумайте над ответом 🤔' })} <span className="fc-tap">{tr({ uz: 'bosing', ru: 'нажмите' })}</span></span></div>
            <div className="fc-face fc-back"><span className="fc-tag">{tr(card.back)}</span>{card.note && <span className="fc-note">{tr(card.note)}</span>}</div>
          </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>✗ {tr({ uz: 'Takrorlash', ru: 'Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })}</button></div>)
        : (<p className="fc-hint">👆 {tr({ uz: 'Kartani bosing — javobni ko\'rasiz', ru: 'Нажмите карточку — увидите ответ' })}</p>)}
    </div>
  );
}
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={PITCH_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 19 — SUMMARY =====
const ScreenSummary = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = _gate.live;
  const isMentorL = _live && _live.mode === 'mentor';
  const RECAP_LIST = [
    { uz: 'Sistemani kod bilmaydigan odamga tushuntirish mumkin.', ru: 'Систему можно объяснить человеку без кода.' },
    { uz: "Kasbiy so'z tushuntirmaydi — o'xshatish tushuntiradi.", ru: 'Профессиональное слово не объясняет — объясняет сравнение.' },
    { uz: 'Birinchi gap tinglovchi oladigan foydani aytadi.', ru: 'Первая фраза говорит о выгоде слушателя.' },
    { uz: "Sayt uch qatlamdan iborat: ko'rinadigan qism, ishni bajaradigan qism, ma'lumot saqlanadigan joy.", ru: 'Сайт состоит из трёх слоёв: видимая часть, часть, которая делает работу, место хранения данных.' }
  ];
  const HOMEWORK = [
    { b: { uz: 'Pitchni bitta odamga ayting', ru: 'Расскажите питч одному человеку' }, t: { uz: '— kod bilmaydigan tinglovchiga', ru: '— слушателю без кода' } },
    { b: { uz: 'Savolini yozib qo\'ying', ru: 'Запишите его вопрос' }, t: { uz: '— pitch matningiz ostiga', ru: '— под текстом питча' } },
    { b: { uz: 'Bitta bo\'lakni qayta yozing', ru: 'Перепишите одну часть' }, t: { uz: '— tushunarsiz chiqqanini', ru: '— ту, что оказалась непонятной' } }
  ];
  const GLOSSARY = [
    { b: 'Pitch', t: { uz: '— qisqa taqdimot', ru: '— короткая презентация' } },
    { b: { uz: 'Jargon', ru: 'Жаргон' }, t: { uz: "— kasbiy so'z", ru: '— профессиональное слово' } },
    { b: { uz: 'Analogiya', ru: 'Аналогия' }, t: { uz: "— o'xshatish", ru: '— сравнение' } },
    { b: { uz: 'Sistema', ru: 'Система' }, t: { uz: '— bir-biriga ulangan qismlar to\'plami', ru: '— набор связанных между собой частей' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const pitch = readLS(PITCH_KEY) || {};
  const saved = PITCH_FIELDS.filter(f => (pitch[f.key] || '').trim()).length;
  const [open, setOpen] = useState(false);
  const glossRef = useRef(null);
  const isNarrow = useIsMobile(768);
  const toggleGloss = () => setOpen(o => { const nv = !o; if (nv && isNarrow) setTimeout(() => { if (glossRef.current) glossRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 80); return nv; });
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l">
          <span className="done-chip fade-up"><span className="tick" style={{ color: T.amberLine }}>{p6.medal(13)}</span> {tr({ uz: 'Modulning oxirgi darsi tugadi', ru: 'Последний урок модуля завершён' })}</span>
          <h2 className="title h-title fade-up d1">{tr({ uz: <>Endi siz sistemangizni <span className="italic" style={{ color: T.accent }}>tushuntira olasiz</span>.</>, ru: <>Теперь вы <span className="italic" style={{ color: T.accent }}>сможете объяснить</span> свою систему.</> })}</h2>
          <p className="body h-sub fade-up d2">{PASSED
            ? tr({ uz: 'Bugun sistemani tushuntirishni o\'rgandik. Pitch matningiz saqlandi — uni uyda bitta odamga ayting.', ru: 'Сегодня мы научились объяснять систему. Ваш питч сохранён — расскажите его дома одному человеку.' })
            : tr({ uz: 'Yaxshi harakat! Bir-ikki joyni mustahkamlash uchun darsni qayta ko\'ring.', ru: 'Хорошая работа! Пересмотрите урок, чтобы закрепить пару мест.' })}</p>
        </div>{!isMentorL && <ScoreRing correct={correct} total={total} />}</div>
        <Zoomable>
          <div className="split">
            <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span style={{ color: T.success, display: 'inline-flex' }}>{Ico.check(15)}</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP_LIST.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck" style={{ display: 'inline-flex' }}>{Ico.check(15)}</span><span>{tr(r)}</span></li>))}</ul></div>
            <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">📎 {tr({ uz: 'Pitch matningiz saqlandi:', ru: 'Ваш питч сохранён:' })} {saved}/5</p></div>
          </div>
        </Zoomable>
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
        <div ref={glossRef} className="gloss fade-up d4" style={{ scrollMarginBottom: 16 }}><div className="gloss-head" onClick={toggleGloss}><span className="lbl">{tr({ uz: "Kalit so'zlar (takrorlash)", ru: 'Ключевые слова (повторение)' })}</span><span className="gloss-toggle">{open ? '−' : '+'}</span></div>{open && (<div className="gloss-body">{GLOSSARY.map((g, i) => (<span key={i}><b>{tr(g.b)}</b> {tr(g.t)}{i < GLOSSARY.length - 1 ? ' · ' : ''}</span>))}</div>)}</div>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT
// Podium yorliqlari (scored indeks -> qisqa nom)
const Q_LABELS = { 3: "1 — Kasbiy so'z", 6: "2 — Birinchi gap", 8: "3 — O'xshatish", 14: "4 — «Tushunmadim»" };

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

// ===== 🏅 ACHIEVEMENTS (nishonlar) — dars davomidagi real bosqichlar uchun =====
const ACHIEVEMENTS = {
  jargon:  { icon: '🔎', name: 'Jargon Buster!', desc: { uz: "So'z-elagida uchala kasbiy so'zni o'zingiz topdingiz", ru: 'Вы сами нашли все три профессиональных слова в сите слов' } },
  plain:   { icon: '🗣️', name: 'Plain Talker!',  desc: { uz: "Pitchni kasbiy so'zlarsiz yozdingiz", ru: "Вы написали питч без профессиональных слов" } },
  ear:     { icon: '👂', name: 'Good Ear!',      desc: { uz: "Uchala kartaga to'g'ri hukm chiqardingiz", ru: "Вы верно оценили все три карточки" } },
  speaker: { icon: '🌯', name: 'System Speaker!', desc: { uz: "Sistemaning uch qatlamini kodda ko'rsatdingiz", ru: "Вы показали три слоя системы в коде" } },
};
// Ekran id → nishon (recordAnswer'da avtomatik beriladi). Har biri REAL tekshiriladigan harakatga ulangan.
const ACH_TRIGGERS = { s2: 'jargon', s9: 'plain', s10: 'ear', s11: 'speaker' };
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
// Yuqori paneldagi nishon hisoblagichi (Stage chrome)
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
      <button className={`ach-counter ${bump ? 'bump' : ''} ${count > 0 ? 'has' : ''}`} onClick={() => setOpen(o => !o)} aria-label={tr({ uz: 'Badges', ru: 'Значки' })} title={tr({ uz: 'Badges', ru: 'Значки' })}>
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

// Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi).
// Kalit question_id bo'yicha izlanadi: testlarda u SCREEN_META[i].id ('s3'…), praktikada esa
// submitAnswer'ga berilgan nom ('ustaxona' · 'kursi' · 'koding') — shuning uchun sentinel
// kalitlari AYNAN o'sha nomlar bilan yoziladi (-1 = ishtirok signali, ballga kirmaydi).
const INLINE_KEYS = { s3: 1, s6: 2, s8: 1, s14: 0, ustaxona: -1, kursi: -1, koding: -1 };

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
        <div className="head"><h2 className="title h-title fade-up">Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появляется рейтинг всей группы — пьедестал 🥇🥈🥉.' })}</p></div>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> (верно: {board[myIdx].okCount}/{totalQ})</> })}</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: "🏆 To'liq reyting", ru: '🏆 Полный рейтинг' })}</div>
              <div className="pod-list">
                {board.map((b, i) => (
                  <div key={b.id} className={`pod-row ${live.playerId === b.id ? 'me' : ''}`}>
                    <span className="mono pod-rank">{i + 1}</span>
                    <span className="pod-row-name">{b.nickname}</span>
                    <span className="pod-row-dots">{SCORED_IDX.map(q => { const a = rows.find(r => r.player_id === b.id && r.screen_idx === q); return <span key={q} className={`pod-dot ${a ? (a.correct ? 'ok' : 'bad') : ''}`} title={Q_LABELS[q]} />; })}</span>
                    <span className="mono pod-row-score">{b.okCount}/{totalQ}</span>
                    <span className="mono pod-row-time">{fmtT(b.time)}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* 90(b)-qonun: «📊 Savollar bo'yicha» kartasi OLIB TASHLANDI — mag'lubiyat-tablosi
                butun sinf oldida ko'rsatilmaydi. Mentor bu ma'lumotni dars PAYTIDA
                MentorTestStats orqali, o'z joyida oladi. (P0 va PmLesson2 da ham yo'q.) */}
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
// Arena foni: suzuvchi tokenlar — dars mavzusidan (Demo Day → jonli pitch → efir)
const QZ_BG_SHAPES = [
  { ch: 'pitch',  l: 5,  t: 10, s: 42, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: '🧑‍🍳',     l: 86, t: 7,  s: 40, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: 'peshtaxta', l: 8, t: 72, s: 34, c: 'rgba(150,115,240,0.16)', d: 27, dl: 0.8 },
  { ch: 'javon',  l: 78, t: 68, s: 34, c: 'rgba(120,235,175,0.13)', d: 21, dl: 2.2 },
  { ch: '🥙',      l: 44, t: 86, s: 40, c: 'rgba(203,173,255,0.13)', d: 25, dl: 1.1 },
  { ch: '→',       l: 66, t: 26, s: 46, c: 'rgba(255,110,70,0.13)',  d: 17, dl: 0.4 },
  { ch: '🙂',      l: 26, t: 34, s: 34, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: 'oshpaz', l: 55, t: 5,  s: 26, c: 'rgba(80,200,255,0.14)',  d: 22, dl: 0.6 },
  { ch: 'jargon', l: 93, t: 42, s: 26, c: 'rgba(190,150,255,0.14)', d: 24, dl: 1.3 },
  { ch: '📋',     l: 2,  t: 45, s: 30, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: "Kasbiy so'z (jargon) nima?", ru: 'Что такое профессиональное слово (жаргон)?' }, opts: [
    { uz: 'Faqat shu ishni qiladigan odamlar biladigan so\'z', ru: 'Слово, которое знают только люди этой профессии' },
    { uz: "Uzun so'z", ru: 'Длинное слово' }, { uz: "Xato yozilgan so'z", ru: 'Слово с ошибкой' }, { uz: "Chet el so'zi", ru: 'Иностранное слово' }], correct: 0 },
  { q: { uz: 'Pitch nima?', ru: 'Что такое питч?' }, opts: [
    { uz: 'Kod yozish tartibi', ru: 'Порядок написания кода' }, { uz: "Sayt bo'limlari", ru: 'Разделы сайта' },
    { uz: 'Qisqa qilib tushuntirib berish', ru: 'Короткий рассказ о продукте' }, { uz: 'Sayt manzili', ru: 'Адрес сайта' }], correct: 2 },
  { q: { uz: 'Tushuntirishni nimadan boshlaysiz?', ru: 'С чего начинаете объяснение?' }, opts: [
    { uz: 'Sayt nechta sahifadan iborat', ru: 'Из скольких страниц состоит сайт' },
    { uz: 'Tinglovchi oladigan foyda', ru: 'С выгоды слушателя' },
    { uz: 'Qaysi tilda yozilgani', ru: 'На каком языке написан' }, { uz: 'Necha kun ishlagan', ru: 'Сколько дней работал' }], correct: 1 },
  { q: { uz: "«Massiv» so'zini nima bilan almashtirasiz?", ru: 'Чем заменить слово «массив»?' }, opts: [
    { uz: 'Obyekt', ru: 'Объект' }, { uz: 'Sikl', ru: 'Цикл' }, { uz: 'Baza', ru: 'База' }, { uz: "Ro'yxat", ru: 'Список' }], correct: 3 },
  { q: { uz: "Sistemaning ko'rinadigan qismi — do'konda nima?", ru: 'Видимая часть системы — что это в магазине?' }, opts: [
    { uz: 'Javon', ru: 'Полка' }, { uz: 'Oshxona', ru: 'Кухня' }, { uz: 'Peshtaxta', ru: 'Прилавок' }, { uz: 'Ombor', ru: 'Склад' }], correct: 2 },
  { q: { uz: "Ma'lumot saqlanadigan joy — do'konda nima?", ru: 'Место хранения данных — что это в магазине?' }, opts: [
    { uz: 'Javon', ru: 'Полка' }, { uz: 'Peshtaxta', ru: 'Прилавок' }, { uz: 'Kassa', ru: 'Касса' }, { uz: 'Eshik', ru: 'Дверь' }], correct: 0 },
  { q: { uz: "Yaxshi o'xshatish qayerdan olinadi?", ru: 'Откуда берут хорошее сравнение?' }, opts: [
    { uz: 'Kitobdan', ru: 'Из книги' }, { uz: 'Kod hujjatidan', ru: 'Из документации кода' }, { uz: 'Internetdan', ru: 'Из интернета' },
    { uz: "Tinglovchining o'z hayotidan", ru: 'Из жизни самого слушателя' }], correct: 3 },
  { q: { uz: 'Airbnb birinchi slaydda nimani ko\'rsatgan?', ru: 'Что Airbnb показали на первом слайде?' }, opts: [
    { uz: 'Jamoa', ru: 'Команду' }, { uz: 'Odamlarning muammosi', ru: 'Проблему людей' },
    { uz: 'Mahsulot ekranlari', ru: 'Экраны продукта' }, { uz: 'Narxlar', ru: 'Цены' }], correct: 1 },
  { q: { uz: 'Airbnb slaydlarining har birida nima turgan?', ru: 'Что было на каждом слайде Airbnb?' }, opts: [
    { uz: 'Bitta sodda fikr', ru: 'Одна простая мысль' }, { uz: 'Uzun izoh', ru: 'Длинное пояснение' },
    { uz: 'Kod namunasi', ru: 'Пример кода' }, { uz: 'Grafik', ru: 'График' }], correct: 0 },
  { q: { uz: 'Pitch nima bilan tugaydi?', ru: 'Чем заканчивается питч?' }, opts: [
    { uz: 'Rahmat aytish bilan', ru: 'Словами благодарности' }, { uz: 'Sayt manzili bilan', ru: 'Адресом сайта' },
    { uz: "Kod ko'rsatish bilan", ru: 'Показом кода' }, { uz: "Aniq so'rov bilan", ru: 'Конкретной просьбой' }], correct: 3 },
  { q: { uz: "Sayt ishini o'zi bajaradigan qism do'konda kimga o'xshaydi?", ru: 'Часть, которая делает работу сама, — на кого похожа в магазине?' }, opts: [
    { uz: 'Mijoz', ru: 'Клиент' }, { uz: 'Oshpaz', ru: 'Повар' }, { uz: 'Kuryer', ru: 'Курьер' }, { uz: 'Kassir', ru: 'Кассир' }], correct: 1 },
  { q: { uz: 'Tinglovchi «tushunmadim» dedi — birinchi nimani tekshirasiz?', ru: 'Слушатель сказал «не понял» — что проверите первым?' }, opts: [
    { uz: 'Ovoz balandligini', ru: 'Громкость голоса' }, { uz: 'Nutq uzunligini', ru: 'Длину речи' },
    { uz: "Kasbiy so'z qolganini", ru: 'Остались ли профессиональные слова' }, { uz: 'Slayd rangini', ru: 'Цвет слайда' }], correct: 2 },
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
    // Dekor O'QITADI: kapsulada suzadigan tokenlar SHU darsning atamalari (eski efir-darsniki emas)
    const TOK = ['pitch', 'jargon', 'peshtaxta', 'oshpaz', 'javon', 'sistema', 'qatlam', '🥙'];
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
      if (!window.confirm("Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚡ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?")) return;
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
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме тренировки' })}</button>
        </div>
      )}

      {/* ===== LOBBY ===== */}
      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее правильный ответ — тем больше баллов. Серия верных ответов даёт 🔥 бонус!' })}</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>{tr({ uz: '▶ Testni boshlash', ru: '▶ Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Подождите, пока ментор начнёт тест…' })}</p>}
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
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">{tr({ uz: '✓ Hamma javob berdi!', ru: '✓ Ответили все!' })}</span>}
              <button className="qz-btn" onClick={() => ctrl('r', qi)}>{tr({ uz: '⏹ Natijani ochish', ru: '⏹ Открыть результат' })}</button>
            </div>
          )}
        </div>
      )}

      {/* ===== NATIJA (reveal) ===== */}
      {phase === 'reveal' && Q && (
        <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length} — natija</span>
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
                ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">ball{streakUpTo(qi) >= 2 ? ` · 🔥 x${streakUpTo(qi)} streak` : ''}</span></>
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошиблись — 0 баллов. В следующий раз получится! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Быстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас: ${myRank + 1}-е место` })}</span>}
            </div>
          )}
          {!solo && (
            <div className="qz-board">
              <div className="qz-board-h">{tr({ uz: '🏆 TOP-5', ru: '🏆 ТОП-5' })}</div>
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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? '🏁 Natijani ko\'rish' : tr({ uz: 'Keyingi →', ru: 'Дальше →' })}</button>}
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
              <p className="qz-sub">ball · {soloScore.ok}/{QUIZ_BANK.length} to'g'ri{soloScore.maxStreak >= 2 ? tr({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · лучшая серия 🔥x${soloScore.maxStreak}` }) : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>{tr({ uz: '↻ Qayta ishlash', ru: '↻ Пройти заново' })}</button>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест заново — тренировка (в таблицу не идёт)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

export default function PmLesson6({ lang: langProp, onFinished }) {
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
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat scored testlar)
    if (_m && _m.scored && _m.scope === 'final' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);
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

  const finishLesson = () => {
    progClear(LESSON_META.lessonId); // F-0730-01: yakunlangan dars saqlovi tozalanadi
    live.endSession();
    const scoredMeta = SCREEN_META.filter(s => s.scored);
    const finalMeta = scoredMeta.filter(s => s.scope === 'final');
    const scoredAnswers = SCREEN_META.map((s, i) => (s.scored ? answers[i] : null)).filter(Boolean);
    const correctAnswers = scoredAnswers.filter(a => a.correct).length;
    const finalCorrect = SCREEN_META.map((s, i) => (s.scored && s.scope === 'final' ? answers[i] : null)).filter(Boolean).filter(a => a.correct).length;
    const payload = {
      lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle,
      nickname: live.nickname || null, livePin: live.pin || null, liveMode: live.mode,
      durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scoredMeta.length, correctAnswers,
      scorePercent: scoredMeta.length ? Math.round((correctAnswers / scoredMeta.length) * 100) : 0,
      finalScore: finalCorrect, finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : (scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false),
      answers: SCREEN_META.map((_s, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === 'function') onFinished(payload);
  };

  // ⚠️ TARTIB SCREEN_META bilan AYNAN bir xil (s0…s19)
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenPodium, ScreenArena, ScreenFlashcards, ScreenSummary];
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
        .fade-up { animation: fade-in-up 0.45s cubic-bezier(.2,.7,.2,1) forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        /* tap-hint affordance — bosilmagan interaktiv element "meni bos" deydi, bosilgach o'chadi (✨ Animatsiya) */
        @keyframes tap-hint { 0%,100% { box-shadow: inset 0 0 0 0 rgba(91,61,230,0); } 50% { box-shadow: inset 0 0 0 2px rgba(91,61,230,0.5); } }
        .tap-hint { animation: tap-hint 1.8s ease-in-out infinite; }
        @keyframes tap-hint-card { 0%,100% { box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); } 50% { box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16), inset 0 0 0 2px rgba(91,61,230,0.42); } }
        .tap-hint-card { animation: tap-hint-card 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .tap-hint, .tap-hint-card { animation: none !important; } }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(27,22,48,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

        @keyframes nod { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(4px) rotate(4deg); } }
        .nodder { animation: nod 0.9s ease-in-out infinite; }
        @keyframes veh-pop { 0% { transform: scale(.86) translateY(5px); opacity: 0; } 60% { transform: scale(1.03); } 100% { transform: scale(1); opacity: 1; } }
        .veh-pop { animation: veh-pop .4s cubic-bezier(.2,.7,.2,1); }
        @keyframes feat-pop { 0% { transform: scale(.82); opacity: 0; } 60% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        .feat-pop { animation: feat-pop .34s cubic-bezier(.2,.7,.2,1); }
        .pop-in { opacity: 0; animation: feat-pop .42s cubic-bezier(.2,.7,.2,1) both; }

        /* Idea belgilari jonli animatsiyasi (Screen1) + faol belgi puls (Screen2) */
        @keyframes ico-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.13); } }
        .ico-pulse { animation: ico-pulse 1.5s ease-in-out infinite; }
        @keyframes ico-sway { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        .ico-sway { animation: ico-sway 2.2s ease-in-out infinite; }

        /* Qoida 4-qadam oqimi (Screen14) — navbatma-navbat chiqadi */
        .rule-flow { display: flex; flex-direction: column; gap: 5px; }
        .rule-step { display: flex; align-items: center; gap: 11px; background: ${T.paper}; border-radius: 11px; padding: 10px 13px; box-shadow: 0 6px 16px -9px rgba(${T.shadowBase},0.2); opacity: 0; animation: feat-pop .45s cubic-bezier(.2,.7,.2,1) both; }
        .rule-arrow { text-align: center; color: ${T.ink3}; font-size: 14px; line-height: 1; opacity: 0; animation: fade-step .4s ease-out both; }
        @keyframes shake { 0%,100% { transform: none; } 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
        .shake-x { animation: shake 0.42s; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.ink}; color: ${T.bg}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(91,61,230,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .option:hover:not(:disabled) { background: #FAF9FE; transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -8px rgba(18,169,104,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.5 !important; box-shadow: none !important; }
        .option-picked-wrong { background: ${T.errSoft} !important; color: ${T.err} !important; box-shadow: 0 8px 22px -6px rgba(229,72,77,0.32) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.2); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(91,61,230,0.4); }

        /* === LIVE BADGE (xira — 11.15) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(40,34,82,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -7px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI === */
        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .hook-option:hover:not(:disabled):not(.on) { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.3), inset 0 0 0 1.5px ${T.accent}; }
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
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        .demo-swap { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }

        /* === STAGE === */
        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(156,151,180,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        .progress-track { height: 3px; background: rgba(156,151,180,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

        /* === FRAME === */
        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(91,61,230,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(18,169,104,0.22); }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === SPEC CARD (qora) === */
        .spec-card { background: ${CODE.bg}; border-radius: 14px; padding: 16px 17px; box-shadow: 0 12px 30px -10px rgba(${T.shadowBase},0.3); display: flex; flex-direction: column; gap: 12px; }
        .spec-head { display: flex; align-items: center; gap: 8px; padding-bottom: 9px; border-bottom: 1px solid #ffffff18; }
        .spec-title { font-family: 'JetBrains Mono'; font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #9FB4D8; }
        .spec-lbl { font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
        .spec-text { font-family: 'Georgia, serif'; font-size: clamp(13px,1.7vw,15px); line-height: 1.5; margin: 3px 0 0; }

        /* === LAYOUT === */
        /* 60-qonun: sig'masa SKROLL bo'ladi, bloklar QISILMAYDI (ustma-ust tushmaydi) */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 16px 18px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); animation: fade-step 0.34s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }

        /* === YAKUN === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { display: inline-flex; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; flex-shrink: 0; margin-top: 1px; }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.12); overflow: hidden; }
        .gloss-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 17px; cursor: pointer; } .gloss-head .lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; } .gloss-toggle { font-size: 18px; color: ${T.ink2}; }
        .gloss-body { padding: 0 17px 15px; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; line-height: 1.7; animation: fade-step 0.3s; } .gloss-body b { color: ${T.ink}; }


        /* ============ M2-D13 · PITCH ============ */
        /* Foydalanuvchi kiritmasi ko'rinadigan HAR konteyner: uzun matn kartadan chiqmasin */
        .pv-txt, .wk-done-txt, .og-text, .kdx-card, .wk-sample, .wk-src, .st-t { min-width: 0; overflow-wrap: anywhere; }

        /* 🔴 IMZO-VIZUAL — «TUSHUNISH CHIZIG'I» (darsning yuragi; s0 → s1 → s2 → s9 da AYNAN bir xil til)
           Rang-mantiq: pastda = amber (kasbiy so'z, tinglovchi tushunmadi — bu XATO emas, ogohlantirish),
           yuqorida = yashil (tanish so'z, tushunildi). Belgi (mark) chiziq bo'ylab suriladi va
           ▲/▼ o'qi bilan ko'tarilish/tushish yo'nalishini ochiq aytadi. */
        .ul { display: flex; flex-direction: column; align-items: center; gap: 7px; flex-shrink: 0; width: 96px; }
        .ul-face { font-size: 28px; line-height: 1; transition: transform 0.35s cubic-bezier(.34,1.4,.4,1); }
        .ul.low .ul-face { transform: translateY(3px); }
        .ul.high .ul-face { transform: translateY(-3px); }
        .ul-track { position: relative; width: 14px; height: 142px; border-radius: 99px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; display: flex; align-items: flex-end; }
        .ul-grid { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 0; pointer-events: none; }
        .ul-grid i { display: block; height: 1px; background: ${T.line}; }
        .ul-fill { position: relative; z-index: 1; width: 100%; border-radius: 99px; transition: height 0.55s cubic-bezier(.4,0,.2,1), background 0.4s ease; }
        .ul.low .ul-fill { background: linear-gradient(180deg, ${T.amberLine}, ${T.amberSoft}); }
        .ul.high .ul-fill { background: linear-gradient(180deg, ${T.success}, ${T.successSoft}); }
        .ul-mark { position: absolute; left: 50%; z-index: 2; transform: translate(-50%, 50%); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; color: #fff; transition: bottom 0.55s cubic-bezier(.4,0,.2,1), background 0.4s ease, box-shadow 0.4s ease; }
        .ul.low .ul-mark { background: ${T.amberLine}; box-shadow: 0 5px 14px -5px ${T.amberLine}; }
        .ul.high .ul-mark { background: ${T.success}; box-shadow: 0 5px 14px -5px ${T.success}; animation: ul-breathe 2.6s ease-in-out infinite; }
        @keyframes ul-breathe { 0%,100% { box-shadow: 0 5px 14px -5px ${T.success}; } 50% { box-shadow: 0 5px 20px -2px ${T.success}; } }
        .ul-lbl { font-family: 'Manrope'; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; font-weight: 700; }
        .ul-note { font-family: 'Manrope'; font-size: 11px; font-weight: 700; text-align: center; line-height: 1.3; transition: color 0.35s ease; }
        .ul.low .ul-note { color: ${T.amber}; } .ul.high .ul-note { color: ${T.success}; }
        @media (prefers-reduced-motion: reduce) {
          .ul-face, .ul-fill, .ul-mark, .ul-note { transition: none !important; }
          .ul.high .ul-mark { animation: none !important; }
        }

        /* s0 HOOK */
        /* imzo-sahna qolipi: chapda material — o'ngda tushunish chizig'i (s0/s1/s2/s9 da bir xil) */
        .hk-wrap { display: flex; gap: clamp(12px,2.2vw,22px); align-items: center; }
        .hk-say { flex: 1; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: clamp(14px,2.4vw,20px); box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 12px; }
        .hk-words { display: flex; flex-wrap: wrap; gap: 7px; align-items: baseline; min-height: 54px; }
        .hk-w { font-family: 'Source Serif 4', serif; font-size: clamp(16px,2.3vw,21px); color: ${T.ink}; opacity: 0; transform: translateY(6px); transition: opacity 0.25s, transform 0.25s; }
        .hk-w.in { opacity: 1; transform: none; }
        .hk-w.jrg { color: ${T.amber}; font-weight: 600; box-shadow: inset 0 -3px 0 ${T.amberLine}; }
        .hk-ph { font-family: 'Manrope'; font-size: 14px; color: ${T.ink3}; font-style: italic; }
        .hk-play { align-self: flex-start; }
        .hk-opts { display: flex; flex-direction: column; gap: 9px; max-width: 520px; }

        /* s1 natija-preview */
        .pv-wrap { display: flex; gap: clamp(12px,2.2vw,22px); align-items: center; }
        .pv-card { flex: 1; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: clamp(14px,2.4vw,20px); box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.18); display: flex; flex-direction: column; gap: 9px; }
        .pv-head { font-family: 'Manrope'; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 800; color: ${T.ink3}; }
        .pv-slot { display: flex; flex-direction: column; gap: 2px; padding: 8px 11px; border-radius: 10px; background: ${T.bg}; opacity: 0.35; transition: opacity 0.4s ease, background 0.4s ease; }
        .pv-slot.in { opacity: 1; background: ${T.successSoft}; }
        .pv-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.success}; }
        .pv-txt { font-family: 'Source Serif 4', serif; font-size: clamp(13.5px,1.7vw,15.5px); line-height: 1.45; color: ${T.ink}; }
        .pv-done { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 6px 14px; }
        @media (prefers-reduced-motion: reduce) { .pv-slot { transition: none; } .hk-w { transition: none; } }
        /* 🔴 HARAKAT-DIYETASI: takrorlanuvchi (infinite) va og'ir animatsiyalar reduced-motion'da butunlay o'chadi */
        @media (prefers-reduced-motion: reduce) {
          .ico-pulse, .ico-sway, .nodder, .kdx-arrow, .wk-step.cur .wk-num,
          .mstats-reveal.ready, .ach-counter.bump, .pm-pop, .pm-match, .pm-shake, .shake-x,
          .fc-pill, .fc-fly, .fc-fly.out-knew, .fc-fly.out-again,
          .fc-fly.out-knew::after, .fc-fly.out-again::after,
          .sv-simple, .l3-chip, .st-sum { animation: none !important; opacity: 1 !important; transform: none !important; }
          .fc-card, .fc-bar-fill, .progress-bar, .mstats-fill, .mstats-prog-fill { transition: none !important; }
          .fade-up, .fade-step, .pop-in, .veh-pop, .feat-pop, .kdx-card, .rule-step, .ks-card { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; opacity: 1 !important; }
        }

        /* s2 so'z-elagi */
        .sv-wrap { display: flex; gap: clamp(12px,2.2vw,22px); align-items: center; }
        .sv-sent { flex: 1; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: clamp(14px,2.4vw,20px); box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); display: flex; flex-wrap: wrap; gap: 9px 7px; align-items: flex-start; }
        .sv-cell { display: inline-flex; flex-direction: column; align-items: center; gap: 3px; }
        .sv-w { font-family: 'Source Serif 4', serif; font-size: clamp(15px,2.1vw,19px); color: ${T.ink}; background: none; border: none; border-radius: 7px; padding: 2px 5px; cursor: pointer; transition: all 0.16s; }
        .sv-w:hover:not(:disabled) { background: ${T.bg}; }
        .sv-w.hit { color: ${T.amber}; background: ${T.amberSoft}; text-decoration: line-through; cursor: default; }
        .sv-w.miss { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}33; }
        .sv-simple { font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.success}; background: ${T.successSoft}; border-radius: 7px; padding: 3px 8px; max-width: 160px; text-align: center; line-height: 1.25; box-shadow: inset 0 0 0 1px ${T.success}33; animation: sv-snap 0.4s cubic-bezier(.34,1.5,.4,1); }
        @keyframes sv-snap { 0% { opacity: 0; transform: translateY(-7px) scale(0.85); } 60% { transform: translateY(0) scale(1.06); } 100% { opacity: 1; transform: none; } }
        .sv-neutral { margin: 0; font-family: 'Manrope'; font-size: 13px; color: ${T.ink2}; font-style: italic; }

        /* s4 tinglovchi-javobi */
        .ts-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        @media (max-width: 760px) { .ts-grid { grid-template-columns: 1fr; } }
        .ts-card { background: ${T.paper}; border-radius: 14px; padding: 12px; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 8px 20px -9px rgba(${T.shadowBase},0.18); transition: box-shadow 0.2s; }
        .ts-card.chosen { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.35), inset 0 0 0 2px ${T.accent}; }
        .ts-say { background: ${T.bg}; border: none; border-radius: 11px; padding: 11px 13px; text-align: left; cursor: pointer; display: flex; align-items: flex-start; gap: 8px; }
        .ts-say-t { flex: 1; font-family: 'Source Serif 4', serif; font-size: 14.5px; line-height: 1.4; color: ${T.ink}; }
        .ts-cue { color: ${T.ink3}; font-size: 13px; }
        .ts-reply { display: flex; gap: 8px; align-items: flex-start; padding: 0 4px; }
        .ts-face { font-size: 20px; line-height: 1; }
        .ts-reply-t { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; line-height: 1.4; }
        .ts-reply-t.good { color: ${T.success}; } .ts-reply-t.bad { color: ${T.amber}; }
        .ts-pick { margin-top: auto; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 12px; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; cursor: pointer; }
        .ts-pick.on { background: ${T.accentSoft}; color: ${T.accent}; }
        .ts-pick:disabled { opacity: 0.55; cursor: default; }

        /* s5 keys-slayd */
        .ks-dots { display: flex; gap: 7px; }
        .ks-dot { width: 26px; height: 5px; border-radius: 99px; background: rgba(156,151,180,0.3); transition: background 0.3s; }
        .ks-dot.fill { background: ${T.success}; } .ks-dot.cur { background: ${T.accent}; }
        .ks-card { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,2.6vw,24px); box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.16); display: flex; flex-direction: column; gap: 12px; animation: fade-step 0.34s; }
        .ks-text { font-family: 'Source Serif 4', serif; font-size: clamp(15px,2vw,18px); line-height: 1.55; color: ${T.ink}; margin: 0; }
        .ks-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(15px,2vw,17px); color: ${T.ink}; margin: 0; }
        .ks-opts { display: flex; flex-direction: column; gap: 8px; }
        .ks-opt { background: ${T.bg}; border: none; border-radius: 11px; padding: 11px 14px; text-align: left; font-family: 'Manrope'; font-weight: 600; font-size: 14px; color: ${T.ink}; cursor: pointer; transition: all 0.18s; }
        .ks-opt:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px -8px rgba(${T.shadowBase},0.25); }
        .ks-opt.on { background: ${T.accentSoft}; color: ${T.accent}; }
        .ks-opt.right { background: ${T.successSoft}; color: ${T.success}; }
        .ks-opt:disabled { cursor: default; }
        .ks-verdict { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink2}; }
        .ks-hook { margin: 0; font-family: 'Manrope'; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; background: ${T.bg}; border-radius: 11px; padding: 11px 14px; }
        .ks-next { align-self: flex-start; }

        /* s7 uch qatlam */
        .l3-done { display: flex; flex-wrap: wrap; gap: 8px; }
        .l3-chip { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 6px 13px; box-shadow: inset 0 0 0 1.5px ${T.success}33; animation: l3-stamp 0.42s cubic-bezier(.34,1.5,.4,1); }
        @keyframes l3-stamp { 0% { opacity: 0; transform: scale(1.35); } 55% { opacity: 1; transform: scale(0.96); } 100% { transform: scale(1); } }
        .l3-card { background: ${T.paper}; border-radius: 16px; padding: clamp(14px,2.4vw,22px); box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.16); display: flex; flex-direction: column; gap: 10px; }
        .l3-name { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; }
        .l3-ask { margin: 0; font-family: 'Source Serif 4', serif; font-size: clamp(15px,2vw,18px); color: ${T.ink}; }
        .l3-opts { display: flex; flex-direction: column; gap: 8px; }
        .l3-opt { background: ${T.bg}; border: none; border-radius: 11px; padding: 12px 15px; text-align: left; font-family: 'Manrope'; font-weight: 600; font-size: 14.5px; color: ${T.ink}; cursor: pointer; transition: all 0.18s; }
        .l3-opt:hover { transform: translateY(-1px); box-shadow: 0 8px 18px -8px rgba(${T.shadowBase},0.25); }
        .l3-opt.bad { background: ${T.amberSoft}; color: ${T.amber}; box-shadow: inset 0 0 0 1.5px ${T.amberLine}66; }
        .l3-reply { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.amber}; }

        /* s9 ustaxona */
        .wk-steps { display: flex; flex-wrap: wrap; gap: 10px; }
        .wk-step { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
        .wk-step.ok { color: ${T.success}; } .wk-step.cur { color: ${T.accent}; }
        .wk-num { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; background: rgba(156,151,180,0.2); color: ${T.ink3}; }
        .wk-step.ok .wk-num { background: ${T.success}; color: #fff; }
        .wk-step.cur .wk-num { background: ${T.accent}; color: #fff; animation: ico-pulse 1.6s ease-in-out infinite; }
        .wk-body { display: flex; gap: clamp(12px,2.2vw,22px); align-items: flex-start; }
        .wk-editor { flex: 1; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: clamp(14px,2.4vw,20px); box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.18), inset 0 0 0 2px ${T.accent}22; display: flex; flex-direction: column; gap: 10px; }
        .wk-ask { font-family: 'Manrope'; font-weight: 700; font-size: 14.5px; color: ${T.ink}; }
        .wk-in { width: 100%; min-width: 0; resize: vertical; font-family: 'Manrope', sans-serif; font-size: 15px; line-height: 1.5; color: ${T.ink}; background: ${T.bg}; border: none; border-radius: 12px; padding: 12px 14px; outline: none; box-shadow: inset 0 0 0 1.5px rgba(156,151,180,0.35); overflow-wrap: anywhere; }
        .wk-in:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .wk-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .wk-save { margin-left: auto; }
        .wk-sample { margin: 0; font-family: 'Source Serif 4', serif; font-style: italic; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; background: ${T.bg}; border-radius: 11px; padding: 10px 13px; }
        .wk-hint { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; line-height: 1.5; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 11px; padding: 9px 13px; }
        /* 🟡 kasbiy so'z ushlanganda hint amberga o'tadi — s2 elagi bilan bir xil til */
        .wk-hint.jrg { color: ${T.amber}; background: ${T.amberSoft}; box-shadow: inset 0 0 0 1.5px ${T.amberLine}55; }
        .wk-src { margin: 0; font-family: 'Manrope'; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; }
        .wk-final { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 9px; }
        .wk-done-row { display: flex; gap: 12px; align-items: flex-start; background: ${T.paper}; border-radius: 12px; padding: 11px 14px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); }
        .wk-done-lbl { flex-shrink: 0; width: 122px; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink3}; padding-top: 3px; }
        .wk-done-txt { flex: 1; min-width: 0; font-family: 'Source Serif 4', serif; font-size: 14.5px; line-height: 1.5; color: ${T.ink}; }
        .wk-done-edit { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
        .wk-edit { background: none; border: none; color: ${T.accent}; cursor: pointer; font-size: 14px; padding: 0 4px; }

        /* s10 tinglovchi kursisi */
        .st-prog { display: flex; align-items: center; gap: 7px; }
        .st-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(156,151,180,0.3); }
        .st-dot.fill { background: ${T.success}; } .st-dot.cur { background: ${T.accent}; }
        .st-cnt { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink3}; margin-left: 4px; }
        .st-card { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,2.6vw,24px); box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.16); display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
        .st-face { font-size: 26px; line-height: 1; }
        .st-t { margin: 0; font-family: 'Source Serif 4', serif; font-size: clamp(15px,2.1vw,19px); line-height: 1.5; color: ${T.ink}; }
        .st-btns { display: flex; gap: 10px; }
        .st-yes, .st-no { border: none; border-radius: 11px; padding: 11px 20px; font-family: 'Manrope'; font-weight: 800; font-size: 14px; cursor: pointer; transition: transform 0.16s; }
        .st-yes { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}33; } .st-no { background: ${T.amberSoft}; color: ${T.amber}; box-shadow: inset 0 0 0 1.5px ${T.amberLine}55; }
        .st-yes:hover, .st-no:hover { transform: translateY(-1px); }
        .st-reasons { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .st-rl { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; }
        .st-reason { background: ${T.bg}; border: none; border-radius: 99px; padding: 8px 15px; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink}; cursor: pointer; }
        .st-reason:hover { box-shadow: 0 6px 14px -6px rgba(${T.shadowBase},0.25); }
        .st-strip { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; }
        @media (max-width: 760px) { .st-strip { grid-template-columns: 1fr; } }
        .st-sum { border-radius: 12px; padding: 11px 13px; display: flex; flex-direction: column; gap: 5px; animation: st-slide 0.4s cubic-bezier(.2,.7,.2,1) both; }
        .st-strip > .st-sum:nth-child(2) { animation-delay: 0.09s; } .st-strip > .st-sum:nth-child(3) { animation-delay: 0.18s; }
        @keyframes st-slide { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: none; } }
        .st-sum.good { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}33; } .st-sum.bad { background: ${T.amberSoft}; box-shadow: inset 0 0 0 1.5px ${T.amberLine}44; }
        .st-sum-h { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink}; }
        .st-sum-t { font-family: 'Manrope'; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }

        /* s11 koding — launch-karta */
        .kdx { display: flex; align-items: center; gap: clamp(10px,2vw,18px); flex-wrap: wrap; }
        .kdx-fn { background: ${CODE.bg}; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px -12px rgba(${T.shadowBase},0.35); min-width: 220px; }
        .kdx-fn-bar { display: flex; align-items: center; gap: 9px; padding: 8px 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #A7B6D6; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .bb-dots { display: inline-flex; gap: 4px; } .bb-dots i { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.22); }
        .kdx-fn-code { display: block; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: ${CODE.text}; }
        .kx-kim { color: ${CODE.attr}; }
        .kdx-arrow { font-size: 22px; color: ${T.accent}; animation: ico-pulse 1.6s ease-in-out infinite; }
        .kdx-out { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 8px; }
        .kdx-card { background: ${T.paper}; border-radius: 12px; padding: 11px 14px; font-family: 'Source Serif 4', serif; font-size: 14.5px; line-height: 1.5; color: ${T.ink}; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.18); border-left: 3px solid ${T.accent}; opacity: 0; animation: feat-pop 0.4s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--kd, 0.4s); }
        .kdx-cta { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .kdx-skip { background: none; border: none; color: ${T.ink3}; font-family: 'Manrope'; font-size: 12.5px; cursor: pointer; text-decoration: underline; }
        .kod-launch-btn { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,1.9vw,17px); background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 15px 34px; cursor: pointer; box-shadow: 0 14px 30px -8px rgba(91,61,230,0.6); transition: transform 0.18s, box-shadow 0.18s; }
        .kod-launch-btn:hover { transform: translateY(-2px); }
        .takeaway { display: flex; gap: 11px; align-items: flex-start; background: ${T.accentSoft}; border-radius: 13px; padding: 13px 16px; }
        .ta-bulb { font-size: 17px; line-height: 1.2; }
        .ta-h { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; line-height: 1.55; color: ${T.ink}; }

        /* to'liq-ekran kompilyator */
        .hcp-root { position: fixed; inset: 0; z-index: 2100; background: ${T.bg}; overflow: hidden; animation: fade-step 0.3s ease-out; }
        .hcp-wrap { width: 100%; max-width: 1160px; height: 100dvh; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; gap: clamp(10px,1.6vw,16px); padding: clamp(14px,2.2vw,28px); }
        .hcp-top { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 7px; }
        .hcp-eyebrow { font-family: 'Manrope'; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 800; color: ${T.accent}; }
        .hcp-title { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(19px,2.6vw,28px); margin: 0; color: ${T.ink}; line-height: 1.12; }
        .hcp-brief { margin: 0; color: ${T.ink2}; font-size: clamp(13px,1.5vw,15px); line-height: 1.55; max-width: 64ch; }
        .hcp-checklist { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 5px; }
        .hcp-count { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; color: #fff; background: ${T.accent}; padding: 6px 11px; border-radius: 99px; }
        .hcp-chip { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-size: 13px; font-weight: 500; color: ${T.ink2}; background: ${T.paper}; padding: 6px 14px 6px 7px; border-radius: 99px; box-shadow: inset 0 0 0 1px ${T.line}; transition: all 0.22s ease; }
        .hcp-chip.ok { color: ${T.ink}; font-weight: 600; background: ${T.successSoft}; box-shadow: inset 0 0 0 1px ${T.success}40; }
        .hcp-chip.warn { color: ${T.amber}; font-weight: 700; background: ${T.amberSoft}; box-shadow: inset 0 0 0 1px ${T.amberLine}88; }
        .hcp-chip.warn .hcp-dot { background: ${T.amberLine}; color: #fff; }
        .hcp-dot { flex-shrink: 0; width: 21px; height: 21px; border-radius: 50%; background: ${T.bg}; color: ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
        .hcp-chip.ok .hcp-dot { background: ${T.success}; color: #fff; }
        .hcp-hint { margin: 3px 0 0; font-family: 'Manrope'; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 8px 15px; border-radius: 11px; max-width: 64ch; line-height: 1.5; }
        .hcp-hint.jrg { color: ${T.amber}; background: ${T.amberSoft}; }
        .hcp-err { margin: 3px 0 0; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${T.err}; background: ${T.errSoft}; padding: 7px 14px; border-radius: 10px; max-width: 74ch; line-height: 1.5; overflow-wrap: anywhere; }
        .hcp-split { flex: none; height: 58vh; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(12px,1.6vw,18px); }
        @media (max-width: 760px) { .hcp-split { grid-template-columns: 1fr; height: 62vh; } }
        .hcp-pane { display: flex; flex-direction: column; min-height: 0; border-radius: 18px; overflow: hidden; background: ${T.paper}; box-shadow: 0 18px 40px -22px rgba(${T.shadowBase},0.35); }
        .hcp-pane-bar { display: flex; align-items: center; gap: 10px; padding: 10px 15px; font-family: 'Manrope'; font-size: 12px; font-weight: 600; color: ${T.ink2}; border-bottom: 1px solid ${T.line}; }
        .hcp-pane-bar.dark { background: ${CODE.bg}; color: #A7B6D6; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .hcp-tab { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: #fff; background: rgba(255,255,255,0.14); padding: 5px 13px; border-radius: 9px; }
        .hcp-mini { margin-left: auto; background: ${T.accent}; color: #fff; border: none; border-radius: 9px; padding: 6px 13px; font-size: 11.5px; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; flex-shrink: 0; }
        .hcp-code-wrap { flex: 1; min-height: 0; display: flex; }
        .hcp-code { flex: 1; width: 100%; min-height: 0; resize: none; border: none; outline: none; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 13.5px; line-height: 1.7; padding: 16px 18px; tab-size: 2; white-space: pre; overflow: auto; caret-color: ${T.accentVivid}; }
        .hcp-pane-name { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
        .hcp-live { margin-left: auto; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${T.success}; background: ${T.successSoft}; padding: 4px 9px; border-radius: 99px; font-weight: 800; }
        .hcp-frame { flex: 1; min-height: 0; width: 100%; border: none; background: ${T.bg}; }
        .hcp-bottom { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .hcp-ghost { background: ${T.paper}; color: ${T.ink2}; border: none; border-radius: 12px; padding: 11px 18px; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; cursor: pointer; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.2); }
        .hcp-status { flex: 1; min-width: 0; text-align: center; }
        .hcp-ok-msg { font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; color: ${T.success}; }
        .hcp-wait-msg { font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink3}; }
        .hcp-next { background: ${T.accent}; color: #fff; border: none; border-radius: 12px; padding: 12px 24px; font-family: 'Manrope'; font-weight: 800; font-size: 14px; cursor: pointer; }
        .hcp-next:disabled { opacity: 0.4; cursor: not-allowed; }

        /* s12 bitta gap */
        /* 92(e): gapirish ekrani — matn TELEPROMPTER holatida (tinch, katta, keng qatorlar);
           tahrir «✎ Tahrirlash» ortida. Chap-accent hoshiya = PM «hujjat/indeks-karta» hissi. */
        .og-card { position: relative; align-self: center; width: 100%; max-width: 860px; background: ${T.paper}; border-radius: 20px; border-left: 5px solid ${T.accent}; padding: clamp(22px,3.4vw,36px) clamp(20px,3.6vw,42px) clamp(16px,2.4vw,24px); box-shadow: 0 16px 40px -14px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 14px; align-items: flex-start; }
        .og-card::before { content: '🎙'; position: absolute; top: clamp(14px,2vw,20px); right: clamp(16px,2.4vw,24px); font-size: 18px; opacity: 0.5; animation: og-mic 3.2s ease-in-out infinite; }
        @keyframes og-mic { 0%,100% { opacity: 0.35; transform: none; } 50% { opacity: 0.75; transform: translateY(-2px); } }
        .og-text { margin: 0; font-family: 'Source Serif 4', serif; font-size: clamp(19px,2.9vw,27px); line-height: 1.72; color: ${T.ink}; max-width: 44ch; text-wrap: pretty; }
        .og-edit { align-self: flex-end; }
        @media (prefers-reduced-motion: reduce) { .og-card::before { animation: none !important; opacity: 0.5; } }
        .og-path { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
        .og-step { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink2}; background: ${T.paper}; border-radius: 99px; padding: 6px 13px; box-shadow: 0 4px 12px -7px rgba(${T.shadowBase},0.2); }
        .og-arr { color: ${T.ink3}; font-size: 13px; }

        /* s13 recap */
        .pv-verdicts { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; }
        .pv-vl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; }
        .rf-box { display: flex; flex-direction: column; gap: 8px; max-width: 640px; }

        /* s15 uyga vazifa */
        .hw-card { background: ${T.paper}; border-radius: 16px; padding: clamp(14px,2.4vw,22px); box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.16); }
        .hw-steps { display: flex; flex-direction: column; gap: 11px; list-style: none; }
        .hw-steps li { display: flex; gap: 12px; align-items: flex-start; font-family: 'Manrope'; font-size: 14.5px; line-height: 1.5; color: ${T.ink}; }
        .hw-n { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; }
        .hw-vars { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
        @media (max-width: 760px) { .hw-vars { grid-template-columns: 1fr; } }
        .hw-var { background: ${T.paper}; border: none; border-radius: 14px; padding: 14px 16px; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 8px 20px -9px rgba(${T.shadowBase},0.18); transition: box-shadow 0.2s, transform 0.18s; }
        .hw-var:hover { transform: translateY(-1px); }
        .hw-var.on { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.35), inset 0 0 0 2px ${T.accent}; }
        .hw-var-h { font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .hw-var-t { font-family: 'Manrope'; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }

        /* mentor-eslatma + kuzatuv qatori + praktika panellari */
        /* Proyektor-sir (P0 bilan piksel-mos): yopiq holatda xira punktir chip — o'quvchi diqqatini tortmaydi */
        .mnote-chip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; background: ${T.paper}; border: 1.5px dashed ${T.blue}; color: ${T.blue}; border-radius: 999px; padding: 4px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.04em; cursor: pointer; opacity: 0.4; transition: opacity 0.2s ease, transform 0.2s ease; }
        .mnote-chip:hover, .mnote-chip:focus-visible { opacity: 1; transform: translateY(-1px); }
        @media (hover: none) { .mnote-chip { opacity: 0.6; } }
        .mnote { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: 12px 15px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; }
        .mnote-lbl { display: flex; align-items: center; justify-content: space-between; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.blue}; }
        .mnote-x { color: ${T.ink3}; font-weight: 800; font-size: 10.5px; text-transform: none; letter-spacing: 0; }
        .mnote-body { margin: 0; font-family: 'Manrope'; font-size: clamp(13px,1.5vw,14.5px); line-height: 1.45; color: ${T.ink}; }
        .mwatch { margin: 0; font-family: 'Manrope'; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 8px 13px; }
        .lp-mstats { background: ${T.paper}; border-radius: 14px; padding: 13px 16px; box-shadow: 0 8px 20px -9px rgba(${T.shadowBase},0.16); display: flex; flex-direction: column; gap: 8px; }
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
        @media (max-width: 760px) { .hk-wrap, .pv-wrap, .sv-wrap, .wk-body { flex-direction: column; align-items: stretch; } .ul { align-self: center; } }

        /* MOBIL: yig'iladigan Mentor */
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
        .mstats-reveal:hover { background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(91,61,230,0.5); }
        .mstats-reveal.ready { background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(91,61,230,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(91,61,230,0.55); } }
        .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
        .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.blue}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
        .mstats-prog-fill.full { background: ${T.success}; }
        .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
        .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
        .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
        .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .mstats-chip.okc  { background: ${T.successSoft}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.success}; }
        .mstats-chip.badc { background: ${T.errSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.err}; }
        .mstats-chip.waitc { background: rgba(${T.shadowBase},0.06); } .mstats-chip.waitc .mstats-chip-n, .mstats-chip.waitc .mstats-chip-t { color: ${T.ink2}; }
        .mstats-chip.ansc { background: rgba(14,134,196,0.10); } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.blue}; }
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
        .mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.err}; background: ${T.errSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.errSoft}; border-left: 4px solid ${T.err}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); border-left: 4px solid #E8A13A; }
        .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
        .mstats-verdict.few { background: rgba(156,151,180,0.12); border-left: 4px solid ${T.ink3}; }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(91,61,230,0.55); }
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
        .rc-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(156,151,180,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .rc-dot.fill { background: ${T.ink3}; }
        .rc-dot.cur { background: ${T.accent}; width: 26px; }
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.ink}; color: ${T.bg}; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
        .rc-btn:hover:not(:disabled) { background: ${T.accent}; }
        .rc-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
        .rc-btn.ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
        .rc-btn.ghost:hover:not(:disabled) { background: ${T.paper}; color: ${T.ink}; }
        .rc-btn.done { background: ${T.success}; color: #fff; }
        .rc-btn.done:hover { background: #0E8452; }
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
        .pm-pop { animation: pmPop 0.5s cubic-bezier(.34,1.55,.5,1); }
        @keyframes pmPop { 0% { transform: scale(0.9); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
        .pm-match { animation: pmMatch 0.55s cubic-bezier(.34,1.5,.5,1); }
        @keyframes pmMatch { 0% { transform: scale(1); } 35% { transform: scale(1.06); box-shadow: 0 0 0 5px rgba(18,169,104,0.16); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(18,169,104,0); } }
        .pm-shake { animation: shake 0.4s ease; }
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes dl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.16); } }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }


        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(14,134,196,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(14,134,196,0.22); }


        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(40,34,82,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
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
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
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
        .fc-back { background: linear-gradient(160deg, ${T.accentVivid}, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(91,61,230,0.6); }
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
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #F5F1FF); border: 1.5px solid ${T.accent}55; }
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
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(91,61,230,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(91,61,230,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(91,61,230,0); } }
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
        /* 20-qonun: kapsula ixcham — CODE STRIKE so'z kattaligi o'zgarmaydi, faqat bo'sh joy qisqaradi
           («Mentorni kuting» holatida matndan keyin qalin bo'shliq qolmasin) */
        .cs-cta .cs-cap { padding: clamp(14px,2vw,24px) clamp(22px,3.2vw,40px); gap: clamp(4px,0.7vw,8px); }
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
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr({ uz: 'PM darsi', ru: 'Урок PM' })} />
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
