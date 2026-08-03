import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';

// ============================================================
// PM 3-DARS — DEMO DAY: 3 DAQIQALIK NUTQ (ota-onalar oldida) — PLATFORM STANDARD v19
// G'oya: har bir sayt — kimningdir REAL muammosiga yechim.
// Fikrlash yo'li: MUAMMO (qanday qiyinchilik) → KIM (kim uchun) → YECHIM (sayt qanday yordam beradi).
// Namunaviy darslik (JsIntro) dizayn tili: Split interaktiv demolar, animatsiyalar, rangli panellar.
// Har ekran global savol bilan ochiladi. Portfolioga urg'u yo'q.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

// 🎨 PM-STUDIA IDENTITET (PM_DARS_ETALON 1-bo'lim) — barcha PM darslar shu palitrada.
// Texnik darslar (Htmllesson/JsIntro) dekori bu yerga KO'CHIRILMAYDI (F-0730-06).
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB', link: '#5B3DE6',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
};
const CODE = { bg: '#241C4F', text: '#EFEBFF', tag: '#B99BFF', attr: '#FFD380', str: '#7DD181', comment: '#7C74A8', punct: '#A79FD0' };
const G = "'Source Serif 4', Georgia, serif"; // PM-STUDIA tipografikasi (PmLesson2 etaloni)
// Mentor avatar — hostlangan rasm (11.1 standart, LMS'da assets papkasi yo'q)
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';


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
    } catch { setJoinError("Mentor kodi noto'g'ri yoki ulanishda xato."); }
    finally { setBusy(false); }
  }, [lessonId]);

  const joinStudent = useCallback(async (raw, rawNick) => {
    const p = (raw || '').replace(/\D/g, '');
    const nick = (rawNick || '').trim();
    if (p.length < 4) { setJoinError("Kodni to'liq kiriting."); return; }
    if (nick.length < 2) { setJoinError('Ismingizni kiriting (kamida 2 harf).'); return; }
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
  const gateTitle = title || { uz: 'Jonli dars', ru: 'Живой урок' }; // default render-vaqtida (modul-yuklanishda UZ'da qotmasin)
  const [code, setCode] = useState('');
  const [nick, setNick] = useState(() => nickRead()); // oldingi darsda yozgan ismi tayyor chiqadi
  const [mentorCode, setMentorCode] = useState('');
  const [role, setRole] = useState('student');
  const card = { position: 'relative', width: '100%', maxWidth: 420, background: LT.paper, borderRadius: 20, padding: 'clamp(24px,4vw,36px)', boxShadow: '0 10px 40px -12px rgba(58,53,48,0.22)', display: 'flex', flexDirection: 'column', gap: 18 };
  const wrap = { minHeight: 'calc(100dvh / var(--lz, 1))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 };
  const link = { background: 'none', border: 'none', color: LT.ink3, fontSize: 13, cursor: 'pointer', alignSelf: 'center' };
  if (role === 'mentor') {
    return (<div style={wrap}><div style={card}>
      <div style={{ textAlign: 'center' }}><h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '0 0 4px' }}>{tr({ uz: '🧑‍🏫 Mentor kirishi', ru: '🧑‍🏫 Вход для ментора' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor kodini kiriting.', ru: 'Введите код ментора.' })}</p></div>
      <input value={mentorCode} onChange={e => setMentorCode(e.target.value)} type="password" autoFocus placeholder={tr({ uz: 'Mentor kodi', ru: 'Код ментора' })} onKeyDown={e => { if (e.key === 'Enter') live.startMentor(mentorCode); }} style={{ width: '100%', padding: '14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 18, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: 'Tekshirilmoqda…', ru: 'Проверяем…' }) : tr({ uz: 'Kirish →', ru: 'Войти →' })}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
      <button onClick={() => { setRole('student'); setMentorCode(''); }} style={link}>{tr({ uz: '← Orqaga', ru: '← Назад' })}</button>
    </div></div>);
  }
  return (<div style={wrap}><div style={card}>
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{tr(gateTitle)}</div><h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Подключиться к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и своё имя.' })}</p></div>
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
  // 🔴 Katta PIN (LiveBigCode) AUTO-ochilmaydi — faqat «📺 Ko'rsatish» tugmasi ochadi
  // (auto-open bo'lsa onboarding tur ortida spotlight bo'sh chiqadi).
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
    return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: '👨‍🏫 Mentor:', ru: '👨‍🏫 Ментор:' })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

const LangContext = createContext('uz');
const MentorCtx = createContext(null);
const useLang = () => useContext(LangContext);

// UZ-RU: modul-darajali tarjimon (RU_I18N_SPEC 1-bo'lim). Dars mount bo'lganda default
// export __lang'ni o'rnatadi; barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy
// tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
// QAT'IY: tr() ni modul-darajasidagi data ta'rifi ICHIDA chaqirmang — u import paytida,
// til o'rnatilishidan OLDIN ishlaydi va doim 'uz' qaytaradi.
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

// ===== IKONKALAR — abstrakt tushunchalar uchun toza chiziq, real ilovalar uchun rangli brend belgilari =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  // abstrakt tushunchalar — joriy rangda (chiziqli)
  problem: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1 .9-1 1.7" /><path d="M12 16.7h.01" /></svg>),
  solution: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M9.5 18h5" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.8 10.7c.7.6 1 1.1 1 1.8h5.6c0-.7.3-1.2 1-1.8A6 6 0 0 0 12 3z" /></svg>),
  arrow: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={1.9}><path d="M4 12h14" /><path d="M13 6l6 6-6 6" /></svg>),
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
  // real ilovalar — o'z brend ranglari bilan (bolalar taniydigan belgilar)
  youtube: (s = 26) => (<svg viewBox="0 0 24 24" width={s} height={s}><rect x="2" y="5" width="20" height="14" rx="4.2" fill="#FF0000" /><path d="M10 8.6v6.8L15.8 12z" fill="#fff" /></svg>),
  telegram: (s = 26) => (<svg viewBox="0 0 24 24" width={s} height={s}><circle cx="12" cy="12" r="11" fill="#29A9EB" /><path d="M17.9 7.2l-2.05 9.4c-.15.68-.56.84-1.13.52l-3.1-2.28-1.5 1.44c-.16.16-.3.3-.62.3l.22-3.1 5.68-5.13c.25-.22-.05-.34-.38-.12l-7 4.42-3.02-.94c-.66-.2-.67-.66.14-.97l11.8-4.55c.55-.2 1.03.13.98.49z" fill="#fff" /></svg>),
  market: (s = 26) => (<svg viewBox="0 0 24 24" width={s} height={s}><path d="M5 9.5h14V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" fill="#7B3FE4" fillOpacity="0.18" /><path d="M3.4 5.5h17.2l1.05 3.3a2.25 2.25 0 0 1-4.35.55 2.25 2.25 0 0 1-4.3 0 2.25 2.25 0 0 1-4.3 0 2.25 2.25 0 0 1-4.35-.55z" fill="#7B3FE4" /><rect x="9.7" y="13" width="4.6" height="7" rx="0.8" fill="#7B3FE4" /></svg>),
  taxi: (s = 26) => (<svg viewBox="0 0 24 24" width={s} height={s}><path d="M4 16.2l1.5-4.9A2.5 2.5 0 0 1 7.9 9.6h8.2a2.5 2.5 0 0 1 2.4 1.7l1.5 4.9v3a.8.8 0 0 1-.8.8h-1.5a.8.8 0 0 1-.8-.8V19H6.6v.2a.8.8 0 0 1-.8.8H4.3a.8.8 0 0 1-.8-.8z" fill="#FFB300" /><rect x="9" y="6.4" width="6" height="2.6" rx="0.5" fill="#222" /><circle cx="7.6" cy="16.4" r="1.15" fill="#222" /><circle cx="16.4" cy="16.4" r="1.15" fill="#222" /></svg>)
};

const LESSON_META = { lessonId: 'pm-pitch-03-v19', lessonTitle: { uz: 'Demo Day — 3 daqiqalik nutq', ru: 'Демо-день — трёхминутная речь' } };
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'koding',      template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's13b', type: 'stats',      template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcard', template: 'custom',  scored: false, scope: null },
  { id: 's14', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// 🏅 NISHONLAR (Badges) — inglizcha o'yin-nom (istisno), desc o'zbekcha siz-forma
const AchCtx = createContext(null); // olingan nishonlar (Set) — Stage hisoblagichi uchun
const ACHIEVEMENTS = {
  finder:   { icon: '🔍', name: 'Problem Finder!', desc: { uz: "Saytingiz kimga foyda berishini aniqladingiz", ru: "Вы определили, кому помогает ваш сайт" } },
  demoman:  { icon: '🖥️', name: 'Demo Ready!',     desc: { uz: "Demoda nima ko'rsatishni tanladingiz", ru: "Вы выбрали, что показать в демо" } },
  nextlvl:  { icon: '🚀', name: 'Next Level!',     desc: { uz: 'JavaScript nima qo\'shishini to\'g\'ri topdingiz', ru: 'Вы верно нашли, что добавляет JavaScript' } },
  stage:    { icon: '🎤', name: 'Stage Ready!',    desc: { uz: '3 daqiqalik nutqingizni to\'liq yozdingiz', ru: 'Вы полностью записали свою трёхминутную речь' } },
  graduate: { icon: '🏆', name: 'Level Up!',       desc: { uz: 'Demo Day tayyorgarligini to\'liq yakunladingiz', ru: 'Вы полностью завершили подготовку к Демо-дню' } },
};
// Ekran id → nishon (recordAnswer'da correct:true bo'lganda avtomatik beriladi).
// FAQAT ma'noli ekranlar: s3/s7/s10 (scored testlar), s13 (yakuniy repetitsiya).
const ACH_TRIGGERS = { s3: 'finder', s7: 'demoman', s10: 'nextlvl', s13: 'stage' };

// Backtick ichidagi kodni chip qiladi (`<a>` → chip)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* AUDIOSIZ: ovoz tugmasi (AudioIndicator) ko'rsatilmaydi — ovoz allaqachon o'chirilgan */}
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
// 🔔 NAVBAT-PULSI (88-qonun) — «hozir navbat shu elementda» signali.
// Ekranda ISTALGAN LAHZADA faqat BITTA element yonadi. Puls DARHOL emas, harakatsizlikdan
// keyin chiqadi: o'zi bilgan o'quvchi darhol bosadi va pulsni UMUMAN ko'rmaydi — yordam
// faqat ikkilanganga boradi. `active` yolg'onga o'tsa (bosildi/qulflandi) — darhol o'chadi.
const TURN_HINT_MS = 2600;
function useTurnHint(active) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!active) { setOn(false); return; }
    setOn(false);
    const t = setTimeout(() => setOn(true), TURN_HINT_MS);
    return () => clearTimeout(t);
  }, [active]);
  return on;
}

// 🔔 NAVBAT YURISHI (88-qonun) — «hammasini ko'rib chiqish» tipidagi ekranlar uchun.
// Puls BAJARILMAGAN elementlar bo'ylab navbat bilan yuradi: istalgan lahzada faqat BITTASI
// yonadi, bajarilgani navbatdan chiqadi, har harakatdan keyin kutish qaytadan boshlanadi.
// Bitta element qolsa — yurishning ma'nosi qolmaydi, u tinch yonib turadi (masalan sukut
// bo'yicha ochiq turgan juftlikda ko'rilmagani).
const TURN_STEP_MS = 1300;   // bitta elementning navbati
const TURN_PAUSE_MS = 3200;  // aylanish tugagach tanaffus (keyin qaytadan)
function useTurnWalk(pending, enabled = true) {
  const key = pending.join('');
  const [lit, setLit] = useState(null);
  useEffect(() => {
    setLit(null);
    if (!enabled || pending.length === 0) return;
    let on = true, t = null, i = 0;
    if (pending.length === 1) {
      t = setTimeout(() => { if (on) setLit(pending[0]); }, TURN_HINT_MS);
      return () => { on = false; clearTimeout(t); };
    }
    const stepIn = () => {
      if (!on) return;
      setLit(pending[i]);
      t = setTimeout(() => {
        if (!on) return;
        setLit(null);
        i = (i + 1) % pending.length;
        t = setTimeout(stepIn, i === 0 ? TURN_PAUSE_MS : 140);
      }, TURN_STEP_MS);
    };
    t = setTimeout(stepIn, TURN_HINT_MS);
    return () => { on = false; clearTimeout(t); };
  }, [key, enabled]); // eslint-disable-line
  return lit;
}
// Yurish-holatida qisqa «paydo bo'l — turib tur — so'n», yolg'iz qolganda tinch nafas.
const turnCls = (lit, k, walking) => (lit === k ? (walking ? ' turn-ring turn-step' : ' turn-ring') : '');

const NavNext = ({ disabled, label, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  const nextLabel = label || { uz: 'Davom etish', ru: 'Продолжить' }; // default render-vaqtida (modul-yuklanishda UZ'da qotmasin)
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: 'Mentor hali bu sahifaga o\'tmadi', ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(nextLabel))}</button>;
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
// Kalitlar — scored test ekranlarining indekslari (3, 7, 10).
// Har karta: ic (katta emoji), h (sarlavha), body (1-2 gap), vis (ko'rgazma),
// ask (mentor sinfga og'zaki beradigan savol — jonli muloqot uchun).
// ============================================================
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
// RECAPS kontenti — 3 scored inline test (idx 3, 7, 10) × 3 karta, Demo Day nutqi bo'yicha.
const RECAPS = {
  3: {
    title: { uz: 'Sayt nima uchun kerak', ru: 'Зачем нужен сайт' },
    cards: [
      { ic: '🔍', h: { uz: 'Uch narsa bir gapda', ru: 'Три вещи в одном предложении' }, body: { uz: 'Saytning nega kerakligi uch narsadan yig\'iladi: kim ishlatadi, unga nimasi qiyin edi va sayt nimani osonlashtiradi. Uchtasi birga bo\'lsa, zaldagi odam darrov tushunadi.', ru: 'Ответ «зачем сайт» складывается из трёх вещей: кто им пользуется, что ему было трудно и что сайт упрощает. Когда все три вместе — человек в зале понимает сразу.' }, vis: { uz: <RcFlow items={['Kim', 'nimasi qiyin edi', 'nima osonlashdi']} />, ru: <RcFlow items={['Кто', 'что было трудно', 'что стало проще']} /> }, ask: { uz: 'Saytingizni kim ishlatadi — bitta aniq odamni ayting.', ru: 'Кто будет пользоваться вашим сайтом — назовите одного конкретного человека.' } },
      { ic: '🎨', h: { uz: 'Tavsif — bu javob emas', ru: 'Описание — это не ответ' }, body: { uz: '«To\'rtta bo\'limi bor, rangi ko\'k» — bu saytning tashqi ko\'rinishi. Undan sayt kimga foyda berishi bilinmaydi.', ru: '«Четыре раздела, цвет синий» — это внешний вид сайта. Из него не понять, кому сайт приносит пользу.' }, ask: { uz: 'Saytingiz rangini aytsangiz, ota-onangiz nimani bilib oladi?', ru: 'Если вы назовёте цвет сайта, что из этого узна́ют ваши родители?' } },
      { ic: '🧰', h: { uz: 'Texnika ham javob emas', ru: 'Техника — тоже не ответ' }, body: { uz: '«HTML va CSS bilan qildim» — qanday qilganingiz. Nega qilganingiz esa boshqa savol: kimning ishi yengillashdi?', ru: '«Сделал на HTML и CSS» — это КАК вы сделали. А ЗАЧЕМ — другой вопрос: чья работа стала легче?' }, ask: { uz: 'Sizning saytingiz kimning vaqtini tejaydi?', ru: 'Чьё время экономит ваш сайт?' } },
    ],
  },
  7: {
    title: { uz: 'Jonli demoda nima ko\'rsatiladi', ru: 'Что показывают в живом демо' },
    cards: [
      { ic: '🖥️', h: { uz: 'Saytning o\'zi — eng kuchli dalil', ru: 'Сам сайт — самое сильное доказательство' }, body: { uz: 'Zaldagi odam ishlayotgan saytni ko\'rsa, ishonadi. Shuning uchun demo saytning manzilidan ochilishi bilan boshlanadi.', ru: 'Когда человек в зале видит работающий сайт — он верит. Поэтому демо начинается с того, что вы открываете сайт по его адресу.' }, vis: { uz: <RcFlow items={['Ochaman', 'ko\'rsataman', 'aytaman']} />, ru: <RcFlow items={['Открываю', 'показываю', 'рассказываю']} /> }, ask: { uz: 'Ishlayotgan saytni ko\'rgan odam nimaga ishonadi?', ru: 'Во что верит человек, увидевший работающий сайт?' } },
      { ic: '🚫', h: { uz: 'Kod — dasturchilar uchun', ru: 'Код — для программистов' }, body: { uz: 'Kod oynasini ochsangiz, ota-onangiz sayt nima qilishini bilmay qoladi. Kodni sizdan mentor so\'raydi, zal esa natijani ko\'radi.', ru: 'Если открыть окно с кодом, родители так и не поймут, что сайт делает. Код у вас спросит ментор, а зал смотрит на результат.' }, ask: { uz: 'Ota-onangiz kod oynasini ko\'rib nima deb o\'ylaydi?', ru: 'Что подумают ваши родители, увидев окно с кодом?' } },
      { ic: '⏱️', h: { uz: 'Demo — eng katta bo\'lak', ru: 'Демо — самая большая часть' }, body: { uz: '3 daqiqadan bir daqiqasi demoga ketadi. Chunki qolgan hamma gap shu bir daqiqani tayyorlaydi.', ru: 'Из трёх минут одна уходит на демо. Потому что все остальные слова готовят зал именно к этой минуте.' }, ask: { uz: 'Nega demoga eng ko\'p vaqt ajratiladi?', ru: 'Почему на демо отводят больше всего времени?' } },
    ],
  },
  10: {
    title: { uz: 'HTML, CSS va JavaScript farqi', ru: 'Чем различаются HTML, CSS и JavaScript' },
    cards: [
      { ic: '🧱', h: { uz: 'HTML — bo\'limlar', ru: 'HTML — разделы' }, body: { uz: 'HTML sahifaga nima turishini aytadi: sarlavha, matn, rasm joyi. U sahifaning skeleti.', ru: 'HTML говорит, ЧТО стоит на странице: заголовок, текст, место для картинки. Это скелет страницы.' }, vis: { uz: <RcFlow items={['HTML — bo\'limlar', 'CSS — ko\'rinish', 'JS — harakat']} sep="·" />, ru: <RcFlow items={['HTML — разделы', 'CSS — внешний вид', 'JS — действие']} sep="·" /> }, ask: { uz: 'Sahifadagi sarlavhani kim joylashtiradi?', ru: 'Кто ставит на страницу заголовок?' } },
      { ic: '🎨', h: { uz: 'CSS — ko\'rinish', ru: 'CSS — внешний вид' }, body: { uz: 'CSS rang, o\'lcham va joylashuvni beradi. U sahifani chiroyli qiladi, lekin uni harakatga keltirmaydi.', ru: 'CSS задаёт цвет, размер и расположение. Он делает страницу красивой, но не заставляет её двигаться.' }, ask: { uz: 'Matn rangini o\'zgartirish kimning ishi?', ru: 'Чья работа — поменять цвет текста?' } },
      { ic: '⚡', h: { uz: 'JavaScript — harakat', ru: 'JavaScript — действие' }, body: { uz: 'Tugma bosilganda nimadir o\'zgarishi — bu harakat. Savatga qo\'shish, hisoblash, qidirish shu yerdan chiqadi.', ru: 'Нажали кнопку — и что-то изменилось: это действие. Добавить в корзину, посчитать, найти — всё отсюда.' }, ask: { uz: 'Tugma bosilganda hech nima bo\'lmasa, nima yetishmayapti?', ru: 'Если после нажатия кнопки ничего не происходит — чего не хватает?' } },
    ],
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
        {card.ask && <div className="rc-ask">{tr({ uz: '🗣️ Sinfga savol:', ru: '🗣️ Вопрос классу:' })} {tr(card.ask)}</div>}
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
  // «To'g'ri» sanog'ini ustunlar bilan BIR XIL mantiqdan olamiz (picked === correctIdx) —
  // server `correct` ustuni eskirgan bo'lsa ham sanoq va ustunlar hech qachon farq qilmaydi.
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
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Ответили все' }) : tr({ uz: <>Javob berdi: <b>{answered}</b> / {total}</>, ru: <>Ответили: <b>{answered}</b> / {total}</> })}</span>
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
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? tr({ uz: `${n} o'quvchi · ${pct}%`, ru: `учеников: ${n} · ${pct}%` }) : '—'}</span>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тема осталась классу непонятной. Перед тем как идти дальше, стоит коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish — ', ru: '📖 Объяснить заново — ' })}{tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 Верно <b>{pct}%</b> — неплохо. Если хотите, коротко повторите перед тем, как идти дальше.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ Верно <b>{pct}%</b> — класс тему освоил. Спокойно идите дальше!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: `Javob berganlar kam (${answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:`, ru: `Ответивших мало (${answered}) — по проценту выводы делать сложно. Оцените сами:` })}</p>
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

// ===== MENTOR YOZMA-ISH PANELI — s11 (repetitsiya kabinasi) uchun =====
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
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma tugatdi!', ru: '✓ Все закончили!' }) : tr({ uz: <>Tugatdi: <b>{doneN}</b> / {total}</>, ru: <>Закончили: <b>{doneN}</b> / {total}</> })}</span>
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

const PRACTICE_BASE = 500;
const MentorPracticeStats = ({ live, screen, label }) => {
  const statLabel = label || { uz: '👀 Kim bajardi', ru: '👀 Кто выполнил' }; // default render-vaqtida
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
  }, [live && live.pin, screen]);
  if (!live || live.mode !== 'mentor') return null;
  const players = data.players || [];
  const doers = players.filter(p => data.doneIds.has(p.id));
  const waiting = players.filter(p => !data.doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{tr(statLabel)} — {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружаем…' })}</p>
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
// O'QUVCHI ko'radigan sinf-pulsi (45-qonun): «nechta sinfdosh bajardi / bajarmoqda» jonli hisobi.
// MentorPracticeStats bilan BIR XIL zonadan (PRACTICE_BASE+screen) sof O'QISH — ball-relsga yozmaydi.
const StudentPracticePulse = ({ live, screen }) => {
  const [data, setData] = useState(null); // { total, done }
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
  }, [live && live.pin, screen]);
  if (!live || live.mode !== 'student' || !data || data.total === 0) return null;
  const doing = Math.max(0, data.total - data.done);
  return (
    <div className="done-mini fade-up" style={{ alignSelf: 'flex-start' }}>
      {tr({ uz: <>👥 Sinfda: <b>{data.done}</b> bajardi</>, ru: <>👥 В классе: выполнили <b>{data.done}</b></> })}{doing > 0 && <span className="dm-sub">{tr({ uz: `· ✏️ ${doing} hali bajarmoqda`, ru: `· ✏️ ещё выполняют: ${doing}` })}</span>}
    </div>
  );
};

// UZ-RU: analitika-payload doim UZ-ETALON (RU_I18N_SPEC konvensiyasi) — statistika
// ikkala tilda bir xil qiymat bilan yig'ilsin.
const uzOf = (x) => (x && typeof x === 'object' && !React.isValidElement(x)) ? (x.uz ?? '') : x;
const ouz = (arr) => (Array.isArray(arr) ? arr.map(uzOf) : arr);

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
      onAnswer(screen, { stage: scope, screenIdx: screen, question: uzOf(questionText), options: ouz(options), correctIndex: correctIdx, correctAnswer: uzOf(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: uzOf(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: uzOf(questionText), options: ouz(options), correctIndex: correctIdx, correctAnswer: uzOf(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: uzOf(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    if (audioText) { audio.triggerEvent('option_picked'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? (audioOk || "To'g'ri.") : (audioWrong || "Unchalik emas. Qaytadan urinib ko'ring.")); }, 300); } // AUDIOSIZ: ovoz o'chirilgan — matn UZ holicha
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
        <div className="fade-up">{tr(question)}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, жмите обдуманно!' })}</p>}
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
              ? tr({ uz: `✓ To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${uzOf(options[correctIdx])}`, ru: `✓ Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${(options[correctIdx] && options[correctIdx].ru) || uzOf(options[correctIdx])}` })
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? tr({ uz: `To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${uzOf(options[correctIdx])}`, ru: `Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${(options[correctIdx] && options[correctIdx].ru) || uzOf(options[correctIdx])}` })
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? tr(explainCorrect)
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете верный ответ.' })
                : wrongLocked
                  ? tr(explainWrong[picked] ?? explainWrong.default)
                  : solved ? tr(explainCorrect) : tr(explainWrong[picked] ?? explainWrong.default)}
          </p>
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
              Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */}
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: '📖 Qisqa takrorlash — mavzuni yana bir ko\'rish', ru: '📖 Короткое повторение — посмотреть тему ещё раз' })}</button>
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue">{tr({ uz: " · ko'rsatmani ochish ▾", ru: ' · раскрыть указание ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

// global savol — har ekran shu bilan ochiladi
const Q = ({ children, max = 760 }) => <h2 className="title h-ask fade-up" style={{ maxWidth: max }}>{children}</h2>;

// ===== PM-3 — Demo Day nutqi uchun ikonkalar =====
const p3sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const p3 = {
  hook: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p3sv}><path d="M4 9v6h4l6 4V5L8 9z" /><path d="M17 8.5a4 4 0 0 1 0 7" /></svg>),
  demo: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p3sv}><circle cx="12" cy="12" r="9" /><path d="M10 8.5l5 3.5-5 3.5z" /></svg>),
  film: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p3sv}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M3 15h18M8 4v16M16 4v16" /></svg>),
  mic: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...p3sv}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0" /><path d="M12 17v4M9 21h6" /></svg>)
};
// ===== PM-3 · DEMO DAY — 3 daqiqalik nutq 6 bo'lakka bo'linadi =====
const PITCH_SEC = 180;
const fmtSec = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const BLOKS = [
  { key: 'ilgak',  label: { uz: 'Birinchi savol', ru: 'Первый вопрос' }, sec: 20, color: '#E08A2B', ic: p3.hook(18),      ph: { uz: 'masalan: Kerakli kitobni qidirib, do\'konma-do\'kon yurganmisiz?', ru: 'например: Вы ходили из магазина в магазин в поисках нужной книги?' } },
  { key: 'muammo', label: { uz: 'Muammo', ru: 'Проблема' },              sec: 30, color: '#D6455D', ic: Ico.problem(18),  ph: { uz: 'masalan: Sinfdoshlarim uchun kerakli kitobni topish qiyin edi.', ru: 'например: Моим одноклассникам было трудно найти нужную книгу.' } },
  { key: 'yechim', label: { uz: 'Yechim', ru: 'Решение' },               sec: 25, color: T.blue,    ic: Ico.solution(18), ph: { uz: 'masalan: Saytim — kerakli kitobni bir joydan topib, narxini ko\'rasiz.', ru: 'например: Мой сайт — нужную книгу находите в одном месте и сразу видите цену.' } },
  { key: 'demo',   label: { uz: 'Jonli demo', ru: 'Живое демо' },        sec: 60, color: T.accent,  ic: p3.demo(18),      ph: { uz: 'masalan: Saytimni ochaman, kitoblar ro\'yxatini ko\'rsataman va qanday tanlashni aytaman.', ru: 'например: Открываю свой сайт, показываю список книг и рассказываю, как выбрать.' } },
  { key: 'qildim', label: { uz: 'Qanday qildim', ru: 'Как я это сделал' }, sec: 25, color: '#0E7C86', ic: p3.film(18),    ph: { uz: 'masalan: Bo\'limlarni o\'zim o\'ylab tuzdim, keyin saytni internetga chiqardim.', ru: 'например: Разделы я придумал сам, а потом выложил сайт в интернет.' } },
  { key: 'keyin',  label: { uz: 'Keyingi qadam', ru: 'Следующий шаг' },  sec: 20, color: T.success, ic: Ico.arrow(18),    ph: { uz: 'masalan: Keyingi modulda JavaScript o\'rganaman va savat qo\'shaman.', ru: 'например: В следующем модуле выучу JavaScript и добавлю корзину.' } }
];
const BMAP = {}; BLOKS.forEach(b => { BMAP[b.key] = b; });

// Vaqt-chizig'i — 6 bo'lak, kengligi o'z vaqtiga mos. Dars davomida to'lib boradi.
const TimeLine = ({ active = -1, progress = 0, big }) => (
  <div className={`tl ${big ? 'big' : ''} fade-up`}>
    {BLOKS.map((b, i) => (
      <div key={b.key} className={`tl-seg ${active === i ? 'now' : ''}`} style={{ flex: b.sec, '--tlc': b.color }}>
        <span className="tl-bar" />
        <span className="tl-lb">{tr(b.label)}</span>
        <span className="tl-t mono">{fmtSec(b.sec)}</span>
      </div>
    ))}
    {progress > 0 && <span className="tl-run" style={{ left: `${Math.min(100, progress * 100)}%` }} />}
  </div>
);

// Sayt turlari — o'quvchilar amalda quradigan online do'kon-saytlari.
// Har turda: kim ishlatadi · nimasi qiyin edi · sayt nimani osonlashtiradi · JS bilan nima qo'shiladi.
// Har savolga ATIGI 2 ta namuna beriladi (ro'yxat uzun bo'lsa, o'quvchi o'qimay tanlab qo'yadi).
const SITE_KINDS = [
  {
    key: 'kitob', ic: '📚', name: { uz: 'Kitob do\'koni', ru: 'Книжный магазин' },
    who: [{ uz: 'sinfdoshlarim', ru: 'мои одноклассники' }, { uz: 'kitob o\'qishni yaxshi ko\'radiganlar', ru: 'те, кто любит читать' }],
    pain: [{ uz: 'kerakli kitobni qidirib, do\'konma-do\'kon yurardi', ru: 'ходили из магазина в магазин в поисках нужной книги' }, { uz: 'qaysi kitob borligini oldindan bilmasdi', ru: 'заранее не знали, какие книги есть в наличии' }],
    help: [{ uz: 'hamma kitobni bir joyda ko\'rsatadi', ru: 'показывает все книги в одном месте' }, { uz: 'kitobni uydan chiqmasdan tanlash imkonini beradi', ru: 'позволяет выбрать книгу, не выходя из дома' }],
    hooks: [{ uz: 'Kerakli kitobni qidirib, do\'konma-do\'kon yurganmisiz?', ru: 'Вы ходили из магазина в магазин в поисках нужной книги?' }, { uz: 'Kitob narxini qayerdan bilasiz?', ru: 'А откуда вы узнаёте цену книги?' }],
    yechimPh: { uz: 'masalan: Saytim — kerakli kitobni bir joydan topib, narxini ko\'rasiz.', ru: 'например: Мой сайт — нужную книгу находите в одном месте и сразу видите цену.' },
    js: [{ uz: 'savatga qo\'shish tugmasi', ru: 'кнопка «в корзину»' }, { uz: 'umumiy narxni hisoblash', ru: 'подсчёт общей суммы' }, { uz: 'kitobni nomi bo\'yicha qidirish', ru: 'поиск книги по названию' }, { uz: 'buyurtma yuborish formasi', ru: 'форма отправки заказа' }]
  },
  {
    key: 'kiyim', ic: '👕', name: { uz: 'Kiyim do\'koni', ru: 'Магазин одежды' },
    who: [{ uz: 'sinfdoshlarim', ru: 'мои одноклассники' }, { uz: 'onam kabi band odamlar', ru: 'занятые люди — как моя мама' }],
    pain: [{ uz: 'kerakli o\'lchamni topgunicha bir necha do\'kon aylanardi', ru: 'обходили несколько магазинов, пока найдут нужный размер' }, { uz: 'narxlarni solishtirib, ko\'p vaqt yo\'qotardi', ru: 'теряли много времени, сравнивая цены' }],
    help: [{ uz: 'kiyimlarni o\'lchami bilan bir joyda ko\'rsatadi', ru: 'показывает одежду с размерами в одном месте' }, { uz: 'narxlarni yonma-yon ko\'rsatadi', ru: 'показывает цены рядом друг с другом' }],
    hooks: [{ uz: 'Kerakli o\'lchamni topgunicha necha do\'kon aylangansiz?', ru: 'Сколько магазинов вы обошли, пока нашли нужный размер?' }, { uz: 'Bir kiyimni tanlash qancha vaqt oladi?', ru: 'Сколько времени уходит на выбор одной вещи?' }],
    yechimPh: { uz: 'masalan: Saytim — kiyimni o\'lchami va narxi bilan uydan turib tanlaysiz.', ru: 'например: Мой сайт — выбираете одежду с размером и ценой прямо из дома.' },
    js: [{ uz: 'savatga qo\'shish tugmasi', ru: 'кнопка «в корзину»' }, { uz: 'o\'lcham bo\'yicha saralash', ru: 'отбор по размеру' }, { uz: 'umumiy narxni hisoblash', ru: 'подсчёт общей суммы' }, { uz: 'buyurtma yuborish formasi', ru: 'форма отправки заказа' }]
  },
  {
    key: 'ovqat', ic: '🍕', name: { uz: 'Ovqat buyurtma sayti', ru: 'Сайт заказа еды' },
    who: [{ uz: 'sinfdoshlarim', ru: 'мои одноклассники' }, { uz: 'kechqurun ovqat buyurtma qiladigan oilalar', ru: 'семьи, которые заказывают еду по вечерам' }],
    pain: [{ uz: 'telefon qilib, menyuni so\'rab o\'tirardi', ru: 'звонили по телефону и выспрашивали меню' }, { uz: 'taomning narxini oldindan bilmasdi', ru: 'заранее не знали цену блюда' }],
    help: [{ uz: 'menyuni rasmi va narxi bilan ko\'rsatadi', ru: 'показывает меню с фото и ценой' }, { uz: 'buyurtmani bir necha bosishda beradi', ru: 'даёт оформить заказ в пару нажатий' }],
    hooks: [{ uz: 'Pitsa buyurtma qilish uchun telefon qilganmisiz?', ru: 'Вы звонили по телефону, чтобы заказать пиццу?' }, { uz: 'Menyuni ko\'rmasdan buyurtma berish qulaymi?', ru: 'Удобно ли заказывать, не видя меню?' }],
    yechimPh: { uz: 'masalan: Saytim — menyuni ko\'rib, buyurtmani bir necha bosishda berasiz.', ru: 'например: Мой сайт — смотрите меню и оформляете заказ в пару нажатий.' },
    js: [{ uz: 'savatga qo\'shish tugmasi', ru: 'кнопка «в корзину»' }, { uz: 'umumiy summani hisoblash', ru: 'подсчёт общей суммы' }, { uz: 'buyurtma yuborish formasi', ru: 'форма отправки заказа' }, { uz: 'yetkazish vaqtini tanlash', ru: 'выбор времени доставки' }]
  },
  {
    key: 'dokon', ic: '🛍️', name: { uz: 'Boshqa online do\'kon', ru: 'Другой онлайн-магазин' },
    who: [{ uz: 'sinfdoshlarim', ru: 'мои одноклассники' }, { uz: 'mahalladagi qo\'shnilar', ru: 'соседи по махалле' }],
    pain: [{ uz: 'kerakli narsani arzonroq topolmasdi', ru: 'не могли найти нужную вещь подешевле' }, { uz: 'ortiqcha narsasini sotolmay yurardi', ru: 'никак не могли продать ненужную вещь' }],
    help: [{ uz: 'hamma mahsulotni bir joyda ko\'rsatadi', ru: 'показывает все товары в одном месте' }, { uz: 'narsani bir necha daqiqada sotuvga qo\'yadi', ru: 'выставляет вещь на продажу за пару минут' }],
    hooks: [{ uz: 'Uyingizda ishlatilmay yotgan narsalar bormi?', ru: 'У вас дома лежат вещи, которыми никто не пользуется?' }, { uz: 'Kerakli narsani arzonroq qayerdan topasiz?', ru: 'Где вы находите нужную вещь подешевле?' }],
    yechimPh: { uz: 'masalan: Saytim — mahsulotni tanlab, narxini darrov ko\'rasiz.', ru: 'например: Мой сайт — выбираете товар и сразу видите его цену.' },
    js: [{ uz: 'savatga qo\'shish tugmasi', ru: 'кнопка «в корзину»' }, { uz: 'umumiy narxni hisoblash', ru: 'подсчёт общей суммы' }, { uz: 'mahsulotni qidirish', ru: 'поиск товара' }, { uz: 'buyurtma yuborish formasi', ru: 'форма отправки заказа' }]
  },
  {
    key: 'portfolio', ic: '🙋', name: { uz: 'O\'zim haqimda sayt', ru: 'Сайт о себе' },
    who: [{ uz: 'meni birinchi marta ko\'rgan odam', ru: 'человек, который видит меня впервые' }, { uz: 'to\'garakka qabul qiladigan ustoz', ru: 'преподаватель, который набирает в кружок' }],
    pain: [{ uz: 'men nima qila olishimni bilmasdi', ru: 'не знал, что я умею делать' }, { uz: 'ishlarimni bir joyda ko\'ra olmasdi', ru: 'не мог увидеть мои работы в одном месте' }],
    help: [{ uz: 'ishlarimni bitta sahifada ko\'rsatadi', ru: 'показывает мои работы на одной странице' }, { uz: 'men bilan qanday bog\'lanishni aytadi', ru: 'подсказывает, как со мной связаться' }],
    hooks: [{ uz: 'Sizni birinchi marta ko\'rgan odam nima biladi?', ru: 'Что знает о вас человек, который видит вас впервые?' }, { uz: 'Ishlaringizni qayerda ko\'rsatasiz?', ru: 'Где вы показываете свои работы?' }],
    yechimPh: { uz: 'masalan: Saytim — men nima qila olishimni bir sahifada ko\'rsatadi.', ru: 'например: Мой сайт — на одной странице показывает, что я умею.' },
    js: [{ uz: 'aloqa formasi', ru: 'форма обратной связи' }, { uz: 'ishlar galereyasi', ru: 'галерея работ' }, { uz: 'ishlarni turkumga ajratish', ru: 'разбивка работ по категориям' }, { uz: 'tungi rejim tugmasi', ru: 'кнопка ночного режима' }]
  },
  {
    key: 'boshqa', ic: '⭐', name: { uz: 'Boshqa sayt', ru: 'Другой сайт' },
    who: [{ uz: 'sinfdoshlarim', ru: 'мои одноклассники' }, { uz: 'bir mavzuga qiziqqan odam', ru: 'человек, которому интересна эта тема' }],
    pain: [{ uz: 'kerakli narsani topolmasdi', ru: 'не могли найти нужное' }, { uz: 'kerakli narsani turli joydan qidirardi', ru: 'искали нужное в разных местах' }],
    help: [{ uz: 'hammasini bir joyda ko\'rsatadi', ru: 'показывает всё в одном месте' }, { uz: 'kerakli narsani tez topishga yordam beradi', ru: 'помогает быстро найти нужное' }],
    hooks: [{ uz: 'Sizda ham shunday bo\'lganmi?', ru: 'У вас тоже так бывало?' }, { uz: 'Kerakli narsani qayerdan topasiz?', ru: 'Где вы находите нужное?' }],
    yechimPh: { uz: 'masalan: Saytim — kerakli narsani bir joydan topasiz.', ru: 'например: Мой сайт — нужное находите в одном месте.' },
    js: [{ uz: 'qidiruv maydoni', ru: 'поле поиска' }, { uz: 'aloqa formasi', ru: 'форма обратной связи' }, { uz: 'ro\'yxatni saralash', ru: 'сортировка списка' }, { uz: 'yoqdi tugmasi', ru: 'кнопка «нравится»' }]
  }
];
const KIND_MAP = {}; SITE_KINDS.forEach(s => { KIND_MAP[s.key] = s; });
// Yig'ilgan gap bosh harf bilan boshlansin (o'quvchi kichik harf bilan yozgan bo'lsa ham)
const cap = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);

// Tanish ilovalar o'zini bir jumlada qanday aytadi (namuna — yozishdan oldin ko'riladi)
const ONE_LINERS = {
  youtube: { ic: Ico.youtube(20), name: 'YouTube', line: { uz: 'Sevimli videolaringizni xohlagan vaqtda, bepul ko\'ring.', ru: 'Смотрите любимые видео когда угодно и бесплатно.' } },
  market: { ic: Ico.market(20), name: { uz: 'Bozor', ru: 'Барахолка' }, line: { uz: 'Uydan chiqmasdan e\'lon bering yoki kerakli narsani arzonga toping.', ru: 'Не выходя из дома, дайте объявление или найдите нужное дешевле.' } },
  taxi: { ic: Ico.taxi(20), name: { uz: 'Taksi', ru: 'Такси' }, line: { uz: 'Ko\'chada kutmasdan bir bosishda mashina chaqiring.', ru: 'Вызовите машину одним нажатием, не стоя на улице.' } },
  telegram: { ic: Ico.telegram(20), name: 'Telegram', line: { uz: 'Uzoqdagi do\'stingizga bir zumda va bepul yozing.', ru: 'Напишите далёкому другу мгновенно и бесплатно.' } }
};

// 💾 Nutq matni brauzerda saqlanadi: reload'da yo'qolmaydi, Demo Day kuni joyida turadi.
// Ovoz-yozuv saqlanmaydi (og'ir) — u faqat shu ekranda eshitiladi.
const PITCH_KEY = 'ccPitch3';
const pitch3Read = () => { try { return JSON.parse(localStorage.getItem(PITCH_KEY) || 'null') || {}; } catch (_e) { return {}; } };
const pitch3Write = (o) => { try { localStorage.setItem(PITCH_KEY, JSON.stringify(o)); } catch (_e) { /* saqlash imkoni yo'q */ } };
function usePitch3() {
  const [d, setD] = useState(() => pitch3Read());
  const patch = useCallback((p) => setD(prev => { const n = { ...prev, ...p }; pitch3Write(n); return n; }), []);
  return [d, patch];
}
// Nutq-kartasi qatorlari: saqlangan matn + shu ekranda yozilayotgani birga ko'rinadi
const cardItems = (d, over = {}) => BLOKS.map(b => ({
  label: b.label, color: b.color,
  text: (over[b.key] !== undefined ? over[b.key] : (d[b.key] || '')),
  ph: b.ph
}));

// Mobil: Mentor yopilganda ish maydonini ko'rsatadi (avtoskroll)
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

// Nutq-kartasi (teleprompter) — 6 bo'lak, to'lgani yonadi
// Nutq-kartasi. Ikki holat:
//   mini (dars o'rtasida)  — faqat qaysi bo'lak to'lgani, bitta qator balandlikda (F-0730-12:
//                            qora fonda 6 ta uzun qator o'quvchini o'qishdan sovutardi);
//   to'liq (yakuniy ekran) — barcha bo'lak matni bilan.
const PitchCard = ({ items, minH = 200, mini }) => {
  const doneN = items.filter(i => i.text && i.text.trim()).length;
  if (mini) return (
    <div className="pcm">
      <span className="pcm-h"><span style={{ color: '#A79FD0', display: 'inline-flex' }}>{p3.mic(13)}</span> {tr({ uz: 'Nutqingiz', ru: 'Ваша речь' })}</span>
      <span className="pcm-pills">
        {items.map((it, i) => (
          <span key={i} className={`pcm-pill ${it.text && it.text.trim() ? 'on' : ''}`} style={{ '--pcc': it.color }} title={tr(it.label)}>
            {it.text && it.text.trim() ? '✓' : ''} {tr(it.label)}
          </span>
        ))}
      </span>
      <span className="mono pcm-n">{doneN}/{items.length}</span>
    </div>
  );
  return (
    <div style={{ background: CODE.bg, borderRadius: 14, padding: '16px 17px', minHeight: minH, boxShadow: `0 12px 30px -10px rgba(${T.shadowBase},0.3)`, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 9, borderBottom: `1px solid #ffffff18` }}>
        <span style={{ color: CODE.punct, display: 'inline-flex' }}>{p3.mic(15)}</span>
        <span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.12em', color: CODE.punct, textTransform: 'uppercase' }}>{tr({ uz: '3 daqiqalik nutq', ru: 'Трёхминутная речь' })}</span>
        <span className="mono" style={{ marginLeft: 'auto', fontSize: 10.5, color: CODE.comment }}>{doneN}/{items.length}</span>
      </div>
      {items.map((it, i) => (
        <div key={i} className={`pc-row ${it.text ? 'lit' : ''}`}>
          <span className="mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: it.color, textTransform: 'uppercase' }}>{tr(it.label)}</span>
          <p style={{ fontFamily: G, fontSize: 'clamp(12.5px,1.6vw,14px)', lineHeight: 1.5, color: it.text ? CODE.text : CODE.comment, margin: '3px 0 0', fontStyle: it.text ? 'normal' : 'italic' }}>{it.text || tr(it.ph)}</p>
        </div>
      ))}
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

// ===== 🎤 MIKROFON — o'quvchi gapiradi va o'zini eshitadi =====
// Yozuv FAQAT brauzerda (blob: URL), hech qayerga yuborilmaydi, ekrandan chiqqanda o'chadi.
// Mikrofon yo'q yoki ruxsat berilmasa — jimgina taymer rejimiga tushadi (xato-oyna chiqmaydi).
function MicRecorder({ title, hint }) {
  const micTitle = title || { uz: 'Ovoz chiqarib ayting', ru: 'Произнесите вслух' }; // default render-vaqtida
  const [phase, setPhase] = useState('idle'); // idle | rec | done | off
  const [sec, setSec] = useState(0);
  const [url, setUrl] = useState('');
  const mrRef = useRef(null), chunks = useRef([]), tick = useRef(null), streamRef = useRef(null), urlRef = useRef('');
  const supported = typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && typeof window !== 'undefined' && !!window.MediaRecorder;
  const stopStream = () => {
    clearInterval(tick.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
  };
  useEffect(() => () => { stopStream(); if (urlRef.current) URL.revokeObjectURL(urlRef.current); }, []);
  const start = async () => {
    if (!supported) { setPhase('off'); return; }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = s; chunks.current = [];
      const rec = new MediaRecorder(s); mrRef.current = rec;
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.current.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunks.current, { type: rec.mimeType || 'audio/webm' });
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const u = URL.createObjectURL(blob); urlRef.current = u;
        setUrl(u); setPhase('done'); stopStream();
      };
      rec.start(); setSec(0); setPhase('rec');
      tick.current = setInterval(() => setSec(x => {
        if (x >= 239) { try { rec.stop(); } catch (_e) { /* to'xtagan */ } return 240; }
        return x + 1;
      }), 1000);
    } catch (_e) { setPhase('off'); }
  };
  const stop = () => {
    clearInterval(tick.current);
    try { if (mrRef.current && mrRef.current.state !== 'inactive') mrRef.current.stop(); else setPhase('done'); }
    catch (_e) { setPhase('done'); stopStream(); }
  };
  const again = () => { setPhase('idle'); setSec(0); };
  const mm = Math.floor(sec / 60), ss = String(sec % 60).padStart(2, '0');
  return (
    <div className="mic-box fade-step">
      <div className="mic-head">
        <span className="mic-ic" style={{ color: phase === 'rec' ? T.accent : T.ink2, display: 'inline-flex' }}>{p3.mic(17)}</span>
        <span className="mic-title">{tr(micTitle)}</span>
        {phase === 'rec' && <span className="mic-live"><span className="mic-dot" />{mm}:{ss}</span>}
      </div>
      {phase === 'idle' && <>
        {hint && <p className="mic-hint">{tr(hint)}</p>}
        <button className="btn" onClick={start} style={{ alignSelf: 'flex-start' }}>{tr({ uz: '🎤 Yozishni boshlash', ru: '🎤 Начать запись' })}</button>
        <p className="mic-note">{tr({ uz: "Yozuv faqat shu brauzerda qoladi — hech qayerga yuborilmaydi.", ru: 'Запись остаётся только в этом браузере — никуда не отправляется.' })}</p>
      </>}
      {phase === 'rec' && <>
        <p className="mic-hint">{tr({ uz: "Gapiring — tugatgach «To'xtatish»ni bosing.", ru: 'Говорите — закончите, нажмите «Стоп».' })}</p>
        <button className="btn-soft mic-stop" onClick={stop} style={{ alignSelf: 'flex-start' }}>{tr({ uz: "⏹ To'xtatish", ru: '⏹ Стоп' })}</button>
      </>}
      {phase === 'done' && <>
        <p className="mic-hint">{tr({ uz: "Endi o'zingizni eshiting: birinchi gapingiz qiziqtiradimi?", ru: 'Теперь послушайте себя: ваша первая фраза цепляет?' })}</p>
        <audio className="mic-audio" controls src={url} />
        <button className="btn-soft" onClick={again} style={{ alignSelf: 'flex-start' }}>{tr({ uz: '↺ Qaytadan yozish', ru: '↺ Записать заново' })}</button>
      </>}
      {phase === 'off' && <>
        <p className="mic-hint">{tr({ uz: "Mikrofon ishlamadi — zarari yo'q. Ovoz chiqarib o'zingizga ayting, vaqtni taymer o'lchaydi.", ru: 'Микрофон не сработал — не страшно. Произнесите вслух сами себе, а время отмерит таймер.' })}</p>
        <button className="btn-soft" onClick={() => setPhase('idle')} style={{ alignSelf: 'flex-start' }}>{tr({ uz: "↺ Yana urinib ko'rish", ru: '↺ Попробовать ещё раз' })}</button>
      </>}
    </div>
  );
}

// ===== ⏱️ SAHNA-TAYMERI — 3 daqiqa, 6 bo'lak yugurib boradi =====
function StageTimer({ onDone }) {
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);
  const startHint = useTurnHint(!running && sec === 0);  // 🔔 taymerni bosishga chorlov
  useEffect(() => () => clearInterval(ref.current), []);
  const start = () => {
    if (running) return;
    setSec(0); setRunning(true); clearInterval(ref.current);
    ref.current = setInterval(() => setSec(s => {
      if (s + 1 >= PITCH_SEC) { clearInterval(ref.current); setRunning(false); if (onDone) onDone(); return PITCH_SEC; }
      return s + 1;
    }), 1000);
  };
  const reset = () => { clearInterval(ref.current); setRunning(false); setSec(0); };
  const left = PITCH_SEC - sec;
  const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0');
  let acc = 0, cur = -1;
  BLOKS.forEach((b, i) => { if (sec >= acc && sec < acc + b.sec) cur = i; acc += b.sec; });
  const over = sec >= PITCH_SEC;
  const now = cur >= 0 ? BLOKS[cur] : null;
  return (
    <div className="stg fade-step">
      <div className="stg-top">
        <span className="stg-clock" style={{ color: over ? T.success : (running ? T.accent : T.ink) }}>{mm}:{ss}</span>
        <div className="stg-say">
          <span className="stg-lbl">{over ? tr({ uz: 'Vaqt tugadi', ru: 'Время вышло' }) : (running ? tr({ uz: 'Hozir aytasiz', ru: 'Сейчас говорите' }) : tr({ uz: 'Sahna-taymeri', ru: 'Сценический таймер' }))}</span>
          <span className="stg-now" style={{ color: now && running ? now.color : T.ink2 }}>
            {over ? tr({ uz: '3 daqiqaga sig\'dingizmi?', ru: 'Уложились в 3 минуты?' }) : (running && now ? tr(now.label) : tr({ uz: 'Bosing — vaqt yura boshlaydi', ru: 'Нажмите — время пойдёт' }))}
          </span>
        </div>
        {!running && <button className={`btn${startHint ? ' turn-ring' : ''}`} onClick={start}>{over ? tr({ uz: '↺ Yana', ru: '↺ Ещё раз' }) : tr({ uz: '▶ Repetitsiya', ru: '▶ Репетиция' })}</button>}
        {running && <button className="btn-soft" onClick={reset}>{tr({ uz: "⏹ To'xtatish", ru: '⏹ Стоп' })}</button>}
      </div>
      <TimeLine active={running ? cur : -1} progress={sec / PITCH_SEC} />
    </div>
  );
}

// ===== SCREEN 0 — ILGAK: zalda ota-onangiz =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const audio = useAudio([{ id: 's0', text: `Tasavvur qiling: zalda ota-onangiz o'tiribdi, siz sahnadasiz. Bitta kitob do'koni sayti — ikki xil aytilgan. Ikkala variantni bosib o'qing, keyin qaysi biri ushlashini tanlang.`, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [v, setV] = useState('quruq');
  const [seenBoth, setSeenBoth] = useState(false);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const cmpHint = useTurnHint(!seenBoth);            // 🔔 avval ikkala variantni o'qing
  const voteHint = useTurnHint(seenBoth && picked === null); // 🔔 keyin sabab tanlang
  const TEXT = {
    quruq: { uz: 'Assalomu alaykum. Men sayt qildim. HTML va CSS ishlatdim. Mana, ko\'ring.', ru: 'Здравствуйте. Я сделал сайт. Использовал HTML и CSS. Вот, посмотрите.' },
    jonli: { uz: 'Kerakli kitobni qidirib, do\'konma-do\'kon yurganmisiz? Men shuning uchun kitob do\'koni saytini qildim — hozir ochib ko\'rsataman.', ru: 'Вы ходили из магазина в магазин в поисках нужной книги? Именно поэтому я сделал сайт книжного магазина — сейчас открою и покажу.' }
  };
  const OPTS = [
    { id: 'a', label: { uz: 'Ikkinchisi chiroyliroq yozilgani uchun', ru: 'Потому что второй написан красивее' } },
    { id: 'b', label: { uz: 'Ikkinchisi zaldagi odamga tanish qiyinchilikdan boshlagani uchun', ru: 'Потому что второй начинается с трудности, знакомой человеку в зале' } },
    { id: 'c', label: { uz: 'Ikkinchisi uzunroq gapirgani uchun', ru: 'Потому что второй говорит дольше' } }
  ];
  const pick = (id) => { if (picked !== null) return; setPicked(id); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: true }); audio.triggerEvent('option_picked'); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Вступление' })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 800 }}>{tr({ uz: <>Ota-onangiz oldida <span className="italic" style={{ color: T.accent }}>birinchi gapingiz</span> qanday bo'ladi?</>, ru: <>Какой будет ваша <span className="italic" style={{ color: T.accent }}>первая фраза</span> перед родителями?</> })}</h1>
        <Mentor>{tr({ uz: "Zalda ota-onangiz o'tiribdi, siz sahnadasiz. Bitta kitob do'koni sayti — ikki xil aytilgan. Ikkalasini bosib o'qing.", ru: 'В зале сидят ваши родители, вы на сцене. Один и тот же сайт книжного магазина — рассказан двумя способами. Нажмите и прочитайте оба.' })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${v === 'quruq' ? 'chip-on' : ''}`} onClick={() => setV('quruq')}>{tr({ uz: '1-variant', ru: 'Вариант 1' })}</button>
              <button className={`chip ${v === 'jonli' ? 'chip-on' : ''}${cmpHint ? ' turn-ring' : ''}`} onClick={() => { setV('jonli'); setSeenBoth(true); }}>{tr({ uz: '2-variant', ru: 'Вариант 2' })}</button>
            </div>
            <div key={v} className="demo-swap" style={{ background: T.paper, borderRadius: 14, padding: '18px 17px', boxShadow: `0 8px 20px -7px rgba(${T.shadowBase},0.16)`, borderLeft: `4px solid ${v === 'jonli' ? T.success : T.ink3}` }}>
              <span style={{ color: v === 'jonli' ? T.success : T.ink3, display: 'inline-flex' }}>{p3.mic(18)}</span>
              <p style={{ fontFamily: G, fontSize: 'clamp(15px,2vw,17px)', lineHeight: 1.55, color: T.ink, margin: '9px 0 0' }}>{tr(TEXT[v])}</p>
            </div>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Sizningcha, nega ikkinchisi ushlaydi?', ru: 'Как вы думаете, почему второй цепляет?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map((o, oi) => { const on = picked === o.id; return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}${voteHint ? ` turn-ring turn-wave w${oi + 1}` : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>); })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Sayt ikkalasida ham bir xil — lekin <b>qanday aytish</b> hammasini hal qiladi. Bugun ota-onangiz oldida aytadigan <b>3 daqiqalik nutq</b>ingizni tayyorlaymiz.</>, ru: <>Сайт в обоих случаях один и тот же — но всё решает <b>то, как вы о нём говорите</b>. Сегодня подготовим вашу <b>трёхминутную речь</b> для родителей.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — 3 DAQIQA QANDAY BO'LINADI =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's1', text: `Demo Day — ota-onangiz zalda o'tiradi, siz sahnada saytingizni ko'rsatasiz. Vaqtingiz uch daqiqa. Bu uch daqiqa oltita bo'lakka bo'linadi va eng kattasi — jonli demo. Bugun shu oltita bo'lakni birma-bir to'ldiramiz.`, trigger: 'on_mount', waits_for: null }]);
  const STEPS = [
    { text: { uz: 'Saytingiz qanday qiyinchilikni yengillashtirishini aniqlaysiz', ru: 'Определите, какую трудность облегчает ваш сайт' }, tag: '' },
    { text: { uz: 'Har bo\'lakni o\'z so\'zingiz bilan yozasiz', ru: 'Каждую часть напишете своими словами' }, tag: '' },
    { text: { uz: 'Ota-onangiz beradigan savollarga javob tayyorlaysiz', ru: 'Подготовите ответы на вопросы родителей' }, tag: '' },
    { text: { uz: 'Ovoz chiqarib repetitsiya qilasiz — sahna-taymeri bilan', ru: 'Отрепетируете вслух — со сценическим таймером' }, tag: { uz: 'sahna', ru: 'сцена' } }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const TimeBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: "3 daqiqa shunday bo'linadi", ru: 'Вот как делятся 3 минуты' })}</p>
      <TimeLine active={-1} big />
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: "→ Eng katta bo'lak — jonli demo: saytingizni ochib ko'rsatasiz", ru: '→ Самая большая часть — живое демо: вы открываете и показываете свой сайт' })}</p>
    </Col>
  );
  const StepsBlock = (<Col><p className="flow-label">{tr({ uz: 'Bugun nima qilasiz', ru: 'Что вы сделаете сегодня' })}</p><ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span>{s.tag && <span className="step-tag">{tr(s.tag)}</span>}</span></li>))}</ol></Col>);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sahnadagi <span className="italic" style={{ color: T.accent }}>3 daqiqangiz</span> nimalarga bo'linadi?</>, ru: <>На что делятся ваши <span className="italic" style={{ color: T.accent }}>3 минуты</span> на сцене?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Demo Day yaqinlashdi: ota-onangiz zalda o'tiradi, siz sahnada saytingizni ko'rsatasiz. Vaqtingiz — <b style={{ color: T.ink }}>3 daqiqa</b>. Bu vaqt oltita bo'lakka bo'linadi, eng kattasi — <b style={{ color: T.ink }}>jonli demo</b>.</>, ru: <>Демо-день близко: родители сидят в зале, вы на сцене показываете свой сайт. Времени — <b style={{ color: T.ink }}>3 минуты</b>. Оно делится на шесть частей, и самая большая — <b style={{ color: T.ink }}>живое демо</b>.</> })}</Mentor>
        {!isNarrow ? (<Zoomable><Split>{TimeBlock}{StepsBlock}</Split></Zoomable>) : !showSteps ? (<div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{TimeBlock}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "Bugungi qadamlarni ko'rish", ru: 'Посмотреть сегодняшние шаги' })}</button></div>) : (<div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: '↩ Vaqt taqsimotiga qaytish', ru: '↩ Вернуться к делению времени' })}</button>{StepsBlock}</div>)}
      </div>
    </Stage>
  );
};

// Muammo-qidiruv qatori — komponent SCREEN TASHQARISIDA turadi: aks holda har bosishda
// qayta yaratilib, «o'zim yozaman» maydonidan fokus uchib ketardi.
const PfRow = ({ n, q, field, value, setValue, list, own, setOwn }) => (
  <div className={`pf-row ${value && value.trim() ? 'done' : ''}`}>
    <p className="pf-q">{n && <span className="pf-n">{n}</span>}{tr(q)}</p>
    <div className="pf-opts">
      {/* Tanlangan qiymat — KO'RINADIGAN tildagi matn (o'quvchining o'z gapi shundan yig'iladi) */}
      {list.map((o, oi) => (
        <button key={oi} className={`pf-chip ${value === tr(o) && !own ? 'on' : ''}`} onClick={() => { setValue(tr(o)); setOwn(field, false); }}>{tr(o)}</button>
      ))}
      <button className={`pf-chip own ${own ? 'on' : ''}`} onClick={() => { setOwn(field, true); setValue(''); }}>{tr({ uz: "➕ o'zim yozaman", ru: '➕ напишу сам' })}</button>
    </div>
    {own && <input className="pf-input" autoFocus value={value} onChange={e => setValue(e.target.value)} placeholder={`${tr({ uz: 'masalan:', ru: 'например:' })} ${tr(list[0])}`} />}
  </div>
);

// ===== SCREEN 2 — SAYTIM QANDAY QIYINCHILIKNI YENGILLASHTIRADI =====
// Savollar BIRMA-BIR chiqadi: bir ekranda 9 ta tanlov turgani o'quvchini bosib qo'yardi (F-0730-07).
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's2', text: `Siz sayt qildingiz — lekin u kimning ishini yengillashtiradi? Ko'pchilik buni birinchi marta shu yerda o'ylaydi. Avval sayt turingizni tanlang, so'ng savollarga birma-bir javob bering.`, trigger: 'on_mount', waits_for: null }]);
  const [d, patch] = usePitch3();
  const [kind, setKind] = useState(d.kind || null);
  const [who, setWho] = useState(d.who || '');
  const [pain, setPain] = useState(d.pain || '');
  const [help, setHelp] = useState(d.help || '');
  const [own, setOwn] = useState({ who: false, pain: false, help: false });
  const K = kind ? KIND_MAP[kind] : null;
  const vals = { who, pain, help };
  const setters = { who: setWho, pain: setPain, help: setHelp };
  const QS = [
    { field: 'who', q: { uz: 'Saytingizni kim ishlatadi?', ru: 'Кто будет пользоваться вашим сайтом?' }, list: K ? K.who : [] },
    { field: 'pain', q: { uz: 'Unga ilgari nimasi qiyin edi?', ru: 'Что раньше было для него трудным?' }, list: K ? K.pain : [] },
    { field: 'help', q: { uz: 'Saytingiz nimani osonlashtiradi?', ru: 'Что упрощает ваш сайт?' }, list: K ? K.help : [] }
  ];
  const answered = QS.filter(x => vals[x.field].trim()).length;
  const step = Math.min(answered, QS.length - 1);   // hozir ochiq savol
  const done = !!(kind && answered === QS.length);
  const workRef = useRef(null);
  useEffect(() => {
    if (!done) return;
    patch({ kind, who, pain, help, muammo: tr({ uz: `${cap(who)} ${pain}. Mening saytim ${help}.`, ru: `${cap(who)} ${pain}. Мой сайт ${help}.` }) });
    if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true });
  }, [done, who, pain, help, kind]); // eslint-disable-line
  const chooseKind = (k) => { setKind(k); setWho(''); setPain(''); setHelp(''); setOwn({ who: false, pain: false, help: false }); };
  const setOwnField = useCallback((field, v) => setOwn(p => ({ ...p, [field]: v })), []);
  const kindLit = useTurnWalk(kind ? [] : SITE_KINDS.map(x => x.key)); // 🔔 turini tanlashga chorlov
  return (
    <Stage eyebrow={tr({ uz: 'Muammo-qidiruv', ru: 'Поиск проблемы' })} screen={screen} narrow audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : (kind ? { uz: `Javob bering (${answered}/3)`, ru: `Ответьте (${answered}/3)` } : { uz: 'Sayt turingizni tanlang', ru: 'Выберите тип сайта' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saytingiz kimning ishini <span className="italic" style={{ color: T.accent }}>yengillashtiradi</span>?</>, ru: <>Чью работу <span className="italic" style={{ color: T.accent }}>облегчает</span> ваш сайт?</> })}</h2></div>
        <Mentor>{tr({ uz: "Sayt tayyor — lekin u kimga kerakligini aytish qiyin. Uchta savolga javob bersangiz, javoblaringizdan bitta gap yig'iladi. Avval qanday sayt qilganingizni tanlang.", ru: 'Сайт готов — но сказать, кому он нужен, трудно. Ответите на три вопроса — из ваших ответов соберётся одна фраза. Сначала выберите, какой сайт вы сделали.' })}</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        <div ref={workRef} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
          <div className="kind-grid fade-up delay-1">
            {SITE_KINDS.map(s => (
              <button key={s.key} className={`kind-card ${kind === s.key ? 'on' : ''}${turnCls(kindLit, s.key, true)}`} onClick={() => chooseKind(s.key)}>
                <span className="kind-ic">{s.ic}</span><span className="kind-nm">{tr(s.name)}</span>
              </button>
            ))}
          </div>
          {K && QS.map((x, i) => {
            if (i > step) return null;                       // keyingi savol hali ochilmagan
            return (
              <div key={x.field} className="fade-step" style={{ animationDelay: `${i * 0.05}s` }}>
                <PfRow n={i + 1} q={x.q} field={x.field} value={vals[x.field]} setValue={setters[x.field]} list={x.list} own={own[x.field]} setOwn={setOwnField} />
              </div>
            );
          })}
          {done && (
            <div className="frame-success fade-step">
              <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tr({ uz: 'Saytingiz nima uchun kerak', ru: 'Зачем нужен ваш сайт' })}</p>
              <p className="body" style={{ margin: 0, color: T.ink, fontSize: 'clamp(14px,1.9vw,16px)' }}>{tr({ uz: <><b>{cap(who)}</b> {pain}. Mening saytim <b>{help}</b>.</>, ru: <><b>{cap(who)}</b> {pain}. Мой сайт <b>{help}</b>.</> })}</p>
              <p className="small" style={{ margin: '8px 0 0', color: T.ink2 }}>{tr({ uz: "Mana shu gap — nutqingizning muammo bo'lagi. U keyingi ekranda joyiga tushadi.", ru: 'Вот эта фраза — часть «Проблема» вашей речи. На следующем экране она встанет на своё место.' })}</p>
            </div>
          )}
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — TEST 1 =====
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    audioText="Qaysi gap saytingiz nima uchun kerakligini aytadi?"
    questionText={{ uz: 'Qaysi gap saytingiz nima uchun kerakligini aytadi?', ru: 'Какая фраза говорит, зачем нужен ваш сайт?' }}
    question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Qaysi gap saytingiz <span className="italic" style={{ color: T.accent }}>nima uchun</span> kerakligini aytadi?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Какая фраза говорит, <span className="italic" style={{ color: T.accent }}>зачем</span> нужен ваш сайт?</h2></> }}
    options={[
      { uz: 'Saytimda to\'rtta bo\'lim bor, rangi ko\'k', ru: 'На моём сайте четыре раздела, цвет синий' },
      { uz: 'Sinfdoshlarim kerakli kitobni qayerdan topishni bilmasdi. Saytim hammasini bir joyda ko\'rsatadi', ru: 'Мои одноклассники не знали, где найти нужную книгу. Мой сайт показывает всё в одном месте' },
      { uz: 'Saytimni HTML va CSS bilan qildim', ru: 'Свой сайт я сделал на HTML и CSS' },
      { uz: 'Saytim juda chiroyli chiqdi', ru: 'Мой сайт получился очень красивым' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! Bu gapda KIM bor (sinfdoshlarim), unga nimasi qiyin edi bor va sayt nimani osonlashtirgani bor. Shuning uchun tinglovchi saytning nega kerakligini tushunadi.", ru: 'Верно! В этой фразе есть КТО (одноклассники), что ему было трудно и что сайт упростил. Поэтому слушатель понимает, зачем сайт нужен.' }}
    explainWrong={{
      0: { uz: 'Bu — saytning tavsifi: nechta bo\'lim va qanday rang. Zaldagi odam bundan saytning kimga kerakligini bilmaydi.', ru: 'Это описание сайта: сколько разделов и какой цвет. Из этого человек в зале не поймёт, кому сайт нужен.' },
      2: { uz: 'Bu — qanday qilganingiz, nega qilganingiz emas. Sayt kimning ishini yengillashtiradi?', ru: 'Это КАК вы сделали, а не ЗАЧЕМ. Чью работу облегчает сайт?' },
      3: { uz: 'Bu — sizning bahoyingiz. Zaldagi odam uchun saytning kimga foyda berishi muhimroq.', ru: 'Это ваша оценка. Человеку в зале важнее, кому сайт приносит пользу.' },
      default: { uz: 'Saytning nega kerakligi uch narsadan yig\'iladi: kim ishlatadi, unga nimasi qiyin edi, sayt nimani osonlashtiradi.', ru: 'Ответ «зачем сайт» складывается из трёх вещей: кто пользуется, что ему было трудно, что сайт упрощает.' }
    }} />
);

// ===== SCREEN 4 — 1-2-BO'LAK: BIRINCHI SAVOL + MUAMMO =====
// Ekran ataylab yalang'och: namuna-chiplar va nutq-kartasi olib tashlandi (F-0730-11) —
// ikkita maydon va mikrofon. Namuna mentor gapida bir marta aytiladi, maydonda turmaydi.
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's4', text: `Endi nutqingizning birinchi ikki bo'lagini yozamiz. Birinchi savol — zalga beradigan savolingiz. Muammo esa oldingi ekranda yig'ilgan gapingiz, u allaqachon joyida turibdi. Yozib bo'lgach, mikrofonni bosing va ovoz chiqarib ayting.`, trigger: 'on_mount', waits_for: { type: 'typed_ok' } }]);
  const [d, patch] = usePitch3();
  const [ilgak, setIlgak] = useState(d.ilgak || '');
  const [muammo, setMuammo] = useState(d.muammo || '');
  const done = ilgak.trim().length >= 3 && muammo.trim().length >= 3;
  const prevDone = useRef(false);
  const workRef = useRef(null);
  useEffect(() => {
    if (!done) return;
    patch({ ilgak, muammo });
    if (!prevDone.current) { prevDone.current = true; audio.triggerEvent('typed_ok'); }
    if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true });
  }, [done, ilgak, muammo]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Birinchi savol', ru: 'Первый вопрос' })} screen={screen} narrow audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Ikkala bo'lakni to'ldiring", ru: 'Заполните обе части' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Zalga beradigan <span className="italic" style={{ color: T.accent }}>birinchi savolingiz</span> qanday?</>, ru: <>Какой будет ваш <span className="italic" style={{ color: T.accent }}>первый вопрос</span> залу?</> })}</h2></div>
        <Mentor>{tr({ uz: "Nutq savol bilan boshlansa, zaldagi odam o'zi haqida o'ylab qoladi. Kitob do'koni sayti uchun u shunday bo'lardi: «Kerakli kitobni qidirib, do'konma-do'kon yurganmisiz?» Endi o'z saytingiz uchun shunday savol yozing.", ru: 'Когда речь начинается с вопроса, человек в зале задумывается о себе. Для сайта книжного магазина он был бы таким: «Вы ходили из магазина в магазин в поисках нужной книги?» Теперь напишите такой вопрос для своего сайта.' })}</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        <div ref={workRef} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
          <div className="fld fade-up delay-1">
            <div className="fld-h"><span style={{ color: BMAP.ilgak.color, display: 'inline-flex' }}>{BMAP.ilgak.ic}</span><span className="fld-lbl">{tr({ uz: '1. Birinchi savol', ru: '1. Первый вопрос' })}</span><span className="fld-sec mono">0:20</span></div>
            <textarea value={ilgak} onChange={e => setIlgak(e.target.value)} placeholder={tr({ uz: 'Savolingizni yozing…', ru: 'Напишите свой вопрос…' })} rows={2} className="fld-ta" />
          </div>
          <div className="fld fade-up delay-2">
            <div className="fld-h"><span style={{ color: BMAP.muammo.color, display: 'inline-flex' }}>{BMAP.muammo.ic}</span><span className="fld-lbl">{tr({ uz: '2. Muammo', ru: '2. Проблема' })}</span><span className="fld-sec mono">0:30</span></div>
            {d.muammo && <p className="fld-note">{tr({ uz: "Oldingi ekranda yig'ilgan gapingiz shu yerga tushdi — xohlasangiz, o'zgartiring.", ru: 'Фраза, собранная на прошлом экране, встала сюда — при желании измените её.' })}</p>}
            <textarea value={muammo} onChange={e => setMuammo(e.target.value)} placeholder={tr({ uz: 'Kim uchun va nimasi qiyin edi?', ru: 'Для кого и что было трудным?' })} rows={3} className="fld-ta" />
          </div>
          {done && <MicRecorder title={{ uz: "Shu ikki bo'lakni ovoz chiqarib ayting", ru: 'Произнесите эти две части вслух' }} hint={{ uz: "Yozib oling — keyin o'zingizni eshitasiz. Taxminan 50 soniya vaqt oladi.", ru: 'Запишите — потом послушаете себя. Займёт примерно 50 секунд.' }} />}
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5 — 3-BO'LAK: YECHIM (bitta ish — bitta jumla) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's5', text: `Uchinchi bo'lak — yechim. Bu yerda faqat bitta ish bor: saytingiz nima qilishini bitta jumlada aytish. Avval tanish ilovalar buni qanday qilishini ko'ring, keyin o'zingiznikini yozing.`, trigger: 'on_mount', waits_for: { type: 'typed_ok' } }]);
  const [d, patch] = usePitch3();
  const K = d.kind ? KIND_MAP[d.kind] : null;
  const [yechim, setYechim] = useState(d.yechim || '');
  const [ex, setEx] = useState(null);
  const exHint = useTurnHint(!ex);                   // 🔔 avval namunani ko'ring
  const done = yechim.trim().length >= 3;
  const prevDone = useRef(false);
  useEffect(() => {
    if (!done) return;
    patch({ yechim });
    if (!prevDone.current) { prevDone.current = true; audio.triggerEvent('typed_ok'); }
    if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true });
  }, [done, yechim]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Yechim', ru: 'Решение' })} screen={screen} narrow audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Bitta jumla yozing', ru: 'Напишите одну фразу' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saytingiz nima qilishini <span className="italic" style={{ color: T.accent }}>bir jumlada</span> ayting</>, ru: <>Скажите <span className="italic" style={{ color: T.accent }}>одной фразой</span>, что делает ваш сайт</> })}</h2></div>
        <Mentor>{tr({ uz: "Tanish ilovalar o'zini bitta jumlada tushuntiradi. Nomlardan birini bosing — o'sha ilovaning jumlasini ko'rasiz.", ru: 'Знакомые приложения объясняют себя одной фразой. Нажмите на любое название — увидите его фразу.' })}</Mentor>
        <div className="one-strip fade-up delay-1">
          {Object.keys(ONE_LINERS).map(k => (
            <button key={k} className={`one-tab ${ex === k ? 'on' : ''}${exHint && k === 'market' ? ' turn-ring' : ''}`} onClick={() => setEx(k)}>
              <span style={{ display: 'inline-flex' }}>{ONE_LINERS[k].ic}</span>{tr(ONE_LINERS[k].name)}
            </button>
          ))}
        </div>
        {ex && <p className="one-line fade-step" key={ex}>«{tr(ONE_LINERS[ex].line)}»</p>}
        <div className="fld fade-up delay-2">
          <div className="fld-h"><span style={{ color: BMAP.yechim.color, display: 'inline-flex' }}>{BMAP.yechim.ic}</span><span className="fld-lbl">{tr({ uz: "Endi o'zingiznikini yozing", ru: 'Теперь напишите свою' })}</span><span className="fld-sec mono">0:25</span></div>
          <textarea value={yechim} onChange={e => setYechim(e.target.value)} placeholder={K ? tr(K.yechimPh) : tr({ uz: 'masalan: Saytim — kerakli kitobni bir joydan topasiz.', ru: 'например: Мой сайт — нужную книгу находите в одном месте.' })} rows={2} className="fld-ta" />
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Yozildi. Sahnada shu jumlani aytganingizdan keyin darrov saytni ochasiz.', ru: 'Записано. На сцене сразу после этой фразы вы открываете сайт.' })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — 4-BO'LAK: JONLI DEMO (eng katta bo'lak) =====
const DEMO_STEPS = [
  { key: 'och', n: 1, label: { uz: 'Saytni ochaman', ru: 'Открываю сайт' }, color: T.accent, body: { uz: 'Brauzerni ochib, saytingiz manzilini terasiz. Zal saytning haqiqatan ishlayotganini ko\'radi.', ru: 'Открываете браузер и набираете адрес своего сайта. Зал видит, что сайт правда работает.' } },
  { key: 'korsat', n: 2, label: { uz: 'Asosiy qismini ko\'rsataman', ru: 'Показываю главную часть' }, color: T.blue, body: { uz: 'Saytdagi eng muhim bir joyni ko\'rsatasiz — hammasini emas. Masalan kitoblar ro\'yxatini.', ru: 'Показываете одно самое важное место на сайте — не всё подряд. Например, список книг.' } },
  { key: 'ayt', n: 3, label: { uz: 'Nima qilish mumkinligini aytaman', ru: 'Рассказываю, что тут можно сделать' }, color: T.success, body: { uz: 'Zaldagi odam nima qila olishini aytasiz: «bu yerdan kitob tanlanadi, narxi ko\'rinadi».', ru: 'Говорите, что человек в зале может сделать: «здесь выбираете книгу, здесь видно её цену».' } }
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's6', text: `To'rtinchi bo'lak — jonli demo, nutqingizning eng katta qismi. U uch qadamdan iborat. Har qadamni bosib oching.`, trigger: 'on_mount', waits_for: null }]);
  const [d, patch] = usePitch3();
  const [open, setOpen] = useState(new Set());
  const [link, setLink] = useState(d.link || '');
  const done = open.size >= DEMO_STEPS.length;
  const stepLit = useTurnWalk(DEMO_STEPS.filter(x => !open.has(x.key)).map(x => x.key)); // 🔔
  const tap = (k) => setOpen(p => { const n = new Set(p); n.add(k); return n; });
  useEffect(() => {
    if (!done) return;
    patch({ demo: tr({ uz: 'Saytimni ochaman, asosiy qismini ko\'rsataman va nima qilish mumkinligini aytaman.', ru: 'Открываю свой сайт, показываю главную часть и рассказываю, что тут можно сделать.' }) });
    if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true });
  }, [done]); // eslint-disable-line
  const saveLink = (v) => { setLink(v); patch({ link: v.trim() }); };
  return (
    <Stage eyebrow={tr({ uz: 'Jonli demo', ru: 'Живое демо' })} screen={screen} narrow audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Qadamlarni oching (${open.size}/3)`, ru: `Откройте шаги (${open.size}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saytingizni sahnada <span className="italic" style={{ color: T.accent }}>qanday</span> ko'rsatasiz?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> вы покажете свой сайт на сцене?</> })}</h2></div>
        <Mentor>{tr({ uz: "Jonli demo — nutqingizning eng uzun qismi, bir daqiqa. Uni uchga bo'lib qo'ysangiz, sahnada adashmaysiz. Har qadamni bosib oching.", ru: 'Живое демо — самая длинная часть речи, целая минута. Разделите её на три шага — и на сцене не собьётесь. Нажмите и раскройте каждый шаг.' })}</Mentor>
        <div className="dstep-list">
          {DEMO_STEPS.map(st => {
            const on = open.has(st.key);
            return (
              <button key={st.key} className={`dstep ${on ? 'on' : ''}${turnCls(stepLit, st.key, true)}`} onClick={() => tap(st.key)} style={{ '--dsc': st.color }}>
                <span className="dstep-n">{on ? '✓' : st.n}</span>
                <span className="dstep-col">
                  <span className="dstep-lb">{tr(st.label)}</span>
                  {on && <span className="dstep-body fade-step">{tr(st.body)}</span>}
                </span>
              </button>
            );
          })}
        </div>
        {done && (
          <div className="fld fade-step">
            <div className="fld-h"><span className="fld-lbl">{tr({ uz: 'Saytingiz manzili', ru: 'Адрес вашего сайта' })}</span><span className="fld-opt">{tr({ uz: 'ixtiyoriy', ru: 'необязательно' })}</span></div>
            <p className="fld-note">{tr({ uz: "Manzilni bilsangiz — yozib qo'ying, yakunda cheklistingizda turadi. Bilmasangiz, bo'sh qoldiring: davom etishga xalaqit bermaydi.", ru: 'Знаете адрес — впишите, он попадёт в ваш итоговый чек-лист. Не знаете — оставьте пустым: идти дальше это не мешает.' })}</p>
            <input className="fld-inp mono" value={link} onChange={e => saveLink(e.target.value)} placeholder={tr({ uz: 'masalan: mening-saytim.netlify.app', ru: 'например: moy-sayt.netlify.app' })} />
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — TEST 2 (jonli demo) =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    audioText="Jonli demoda zaldagi odamga nimani ko'rsatasiz?"
    questionText={{ uz: "Jonli demoda zaldagi odamga nimani ko'rsatasiz?", ru: 'Что вы покажете человеку в зале в живом демо?' }}
    question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Jonli demoda ota-onangizga <span className="italic" style={{ color: T.accent }}>nimani</span> ko'rsatasiz?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}><span className="italic" style={{ color: T.accent }}>Что</span> вы покажете родителям в живом демо?</h2></> }}
    options={[
      { uz: 'VS Code oynasini — kod qanday yozilganini', ru: 'Окно VS Code — как написан код' },
      { uz: 'GitHub\'dagi papkani va fayllar ro\'yxatini', ru: 'Папку на GitHub и список файлов' },
      { uz: 'Saytning o\'zini: ochib, asosiy qismini', ru: 'Сам сайт: открыть и показать главную часть' },
      { uz: 'Netlify\'ning sozlamalar sahifasini', ru: 'Страницу настроек Netlify' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! Saytning o'zi — eng kuchli dalil. Zaldagi odam ishlayotgan saytni ko'radi va ishonadi.", ru: 'Верно! Сам сайт — самое сильное доказательство. Человек в зале видит работающий сайт и верит.' }}
    explainWrong={{
      0: { uz: 'Kod — dasturchilar uchun. Ota-onangiz kodni ko\'rib sayt nima qilishini bilmaydi. Nimani ko\'rsa, darrov tushunadi?', ru: 'Код — для программистов. По коду родители не поймут, что сайт делает. А что они поймут сразу?' },
      1: { uz: 'Fayllar ro\'yxati saytning ishlayotganini ko\'rsatmaydi. Zaldagi odam nimani ko\'rmoqchi?', ru: 'Список файлов не показывает, что сайт работает. А что хочет увидеть человек в зале?' },
      3: { uz: 'Sozlamalar sahifasi — sizning ish qurolingiz. Demo esa natijani ko\'rsatadi.', ru: 'Страница настроек — ваш рабочий инструмент. А демо показывает результат.' },
      default: { uz: 'Demoda saytning o\'zi ochiladi: siz uni ochasiz va asosiy qismini ko\'rsatasiz.', ru: 'В демо открывается сам сайт: вы его открываете и показываете главную часть.' }
    }} />
);

// ===== SCREEN 8 — 5-BO'LAK: QANDAY QILDIM =====
const TECH_ROWS = [
  { key: 'html', lbl: { uz: 'Bo\'limlar', ru: 'Разделы' }, tech: { uz: 'HTML teglari bilan sahifa strukturasini yaratdim', ru: 'Создал структуру страницы с помощью HTML-тегов' }, human: { uz: 'Saytning bo\'limlarini o\'zim o\'ylab tuzdim: sarlavha, matn va rasm joylari', ru: 'Разделы сайта я придумал сам: заголовок, текст и места для картинок' } },
  { key: 'css', lbl: { uz: 'Ko\'rinish', ru: 'Внешний вид' }, tech: { uz: 'CSS orqali stillarni elementlarga qo\'lladim', ru: 'Применил стили к элементам через CSS' }, human: { uz: 'Rang va joylashuvni tanlab, saytga shu ko\'rinishni berdim', ru: 'Подобрал цвет и расположение — и сайт стал таким на вид' } },
  { key: 'deploy', lbl: { uz: 'Internet', ru: 'Интернет' }, tech: { uz: 'Repozitoriyani Netlify\'ga deploy qildim', ru: 'Задеплоил репозиторий на Netlify' }, human: { uz: 'Saytni internetga chiqardim — endi uni hamma ko\'rib, ishlata oladi', ru: 'Выложил сайт в интернет — теперь его может открыть и использовать любой' } }
];
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's8', text: `Beshinchi bo'lak — qanday qilganingiz. Bu yerda bitta tuzoq bor: dasturchilar tilida aytsangiz, ota-onangiz tushunmaydi. Har juftlikdan ota-onangiz tushunadigan variantni tanlang.`, trigger: 'on_mount', waits_for: null }]);
  const [d, patch] = usePitch3();
  const [pick, setPick] = useState({});
  const [wrong, setWrong] = useState(null);
  const allGood = TECH_ROWS.every(r => pick[r.key] === 'human');
  const workRef = useRef(null);
  const set = (k, v) => { if (allGood) return; setPick(p => ({ ...p, [k]: v })); setWrong(v === 'tech' ? k : null); };
  const rowLit = useTurnWalk(TECH_ROWS.filter(r => pick[r.key] !== 'human').map(r => r.key)); // 🔔
  useEffect(() => {
    if (!allGood) return;
    patch({ qildim: TECH_ROWS.map(r => tr(r.human)).join('. ') + '.' });
    if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true });
  }, [allGood]); // eslint-disable-line
  const items = cardItems(d, { qildim: allGood ? TECH_ROWS.map(r => tr(r.human)).join('. ') + '.' : '' });
  return (
    <Stage eyebrow={tr({ uz: 'Qanday qildim', ru: 'Как я это сделал' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!allGood} label={allGood ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Tushunarli variantni tanlang', ru: 'Выберите понятный вариант' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qanday qilganingizni <span className="italic" style={{ color: T.accent }}>tushunarli</span> qilib ayting</>, ru: <>Расскажите <span className="italic" style={{ color: T.accent }}>понятно</span>, как вы это сделали</> })}</h2></div>
        <Mentor>{tr({ uz: "Ota-onangiz «HTML» va «CSS» so'zlarini eshitsa, nima qilganingizni tasavvur qila olmaydi. Har juftlikdan ular tushunadigan variantni tanlang.", ru: 'Услышав слова «HTML» и «CSS», родители не смогут представить, что вы сделали. В каждой паре выберите вариант, понятный им.' })}</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        <Zoomable>
        <div className="split" ref={workRef}>
          <Col>
            {TECH_ROWS.map(r => (
              <div key={r.key}>
                <p className="flow-label" style={{ margin: '0 0 6px' }}>{tr(r.lbl)}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {['tech', 'human'].map(v => {
                    const on = pick[r.key] === v;
                    const ok = on && v === 'human';
                    return (
                      <button key={v} className={v === 'human' ? turnCls(rowLit, r.key, true).trim() : undefined} onClick={() => set(r.key, v)} style={{ textAlign: 'left', position: 'relative', border: 'none', cursor: 'pointer', borderRadius: 10, padding: '10px 13px', fontFamily: G, fontSize: 13, color: ok ? '#fff' : T.ink, background: ok ? T.success : (on ? T.accentSoft : T.paper), boxShadow: ok ? `0 6px 14px -6px ${T.success}` : `0 5px 14px -8px rgba(${T.shadowBase},0.16)`, transition: 'all 0.16s' }}>«{tr(r[v])}»</button>
                    );
                  })}
                </div>
                {wrong === r.key && <p className="small" style={{ color: T.accent, margin: '6px 0 0' }}>{tr({ uz: "Bu — dasturchilar tili. Zaldagi odam bu gapdan nima qilganingizni tasavvur qila oladimi? Ikkinchisini o'qing.", ru: 'Это язык программистов. Сможет ли человек в зале представить по этой фразе, что вы сделали? Прочитайте вторую.' })}</p>}
              </div>
            ))}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Nutq-kartangiz', ru: 'Ваша карточка речи' })}</p>
            <PitchCard items={items} mini />
            {allGood && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Mana shu uch gapni sahnada aytasiz. Ular «men shuni o'zim qildim» degan ma'noni ota-onangiz tushunadigan tilda yetkazadi.", ru: 'Именно эти три фразы вы скажете на сцене. Они передают мысль «я сделал это сам» на языке, понятном родителям.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — 6-BO'LAK: KEYINGI QADAM (JS) =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's9', text: `Oxirgi bo'lak — keyingi qadam. Saytingiz ko'rinadi, lekin hali harakat qilmaydi: tugmani bossangiz hech nima o'zgarmaydi. Harakatni JavaScript beradi, uni keyingi modulda o'rganasiz. Ikkita tugmani sinab ko'ring, keyin saytingizga qo'shmoqchi bo'lgan ikkita imkoniyatni tanlang.`, trigger: 'on_mount', waits_for: null }]);
  const [d, patch] = usePitch3();
  const K = d.kind ? KIND_MAP[d.kind] : SITE_KINDS[0];
  const [dead, setDead] = useState(0);
  const [cart, setCart] = useState(0);
  const [sel, setSel] = useState([]);
  const tried = dead > 0 && cart > 0;
  const done = tried && sel.length === 2;
  const deadHint = useTurnHint(dead === 0);                    // 🔔 avval o'lik tugma
  const liveHint = useTurnHint(dead > 0 && cart === 0);        // 🔔 keyin jonli tugma
  // sel — TANLANGAN JS-imkoniyat KALITLARI (indeks-satr), matn EMAS: til almashganda tanlov buzilmasin
  const selLit = useTurnWalk(tried && sel.length < 2 && K ? K.js.map((_j, i) => String(i)).filter(i => !sel.includes(i)) : []);
  const workRef = useRef(null);
  const toggle = (x) => setSel(p => p.includes(x) ? p.filter(y => y !== x) : (p.length >= 2 ? p : [...p, x]));
  const selText = (n) => (K && sel[n] !== undefined ? tr(K.js[Number(sel[n])]) : '');
  const keyinLine = () => tr({ uz: `Keyingi modulda JavaScript o'rganaman va saytimga ${selText(0)} va ${selText(1)} qo'shaman.`, ru: `В следующем модуле выучу JavaScript и добавлю на сайт ${selText(0)} и ${selText(1)}.` });
  useEffect(() => {
    if (!done) return;
    patch({ keyin: keyinLine(), next2: sel.map(i => (K ? uzOf(K.js[Number(i)]) : i)) });
    if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true });
  }, [done, sel]); // eslint-disable-line
  const items = cardItems(d, { keyin: done ? keyinLine() : '' });
  return (
    <Stage eyebrow={tr({ uz: 'Keyingi qadam', ru: 'Следующий шаг' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : (!tried ? { uz: "Ikkala tugmani bosib ko'ring", ru: 'Нажмите обе кнопки' } : { uz: `Ikkitasini tanlang (${sel.length}/2)`, ru: `Выберите две (${sel.length}/2)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saytingizga keyin <span className="italic" style={{ color: T.accent }}>nima</span> qo'shasiz?</>, ru: <><span className="italic" style={{ color: T.accent }}>Что</span> вы добавите на сайт дальше?</> })}</h2></div>
        <Mentor>{tr({ uz: "Saytingiz ko'rinadi, lekin hali harakat qilmaydi. Ikkala tugmani bosib solishtiring — farqni o'zingiz ko'rasiz.", ru: 'Ваш сайт виден, но пока не действует. Нажмите обе кнопки и сравните — разницу увидите сами.' })}</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        <Zoomable>
        <div className="split" ref={workRef}>
          <Col>
            <p className="flow-label">{tr({ uz: 'Ikkala tugmani bosing', ru: 'Нажмите обе кнопки' })}</p>
            <div className="js-demo fade-up delay-1">
              <div className="js-half">
                <span className="js-tag">{tr({ uz: 'Hozirgi saytingiz', ru: 'Ваш сайт сейчас' })}</span>
                <button className={`js-btn dead${deadHint ? ' turn-ring' : ''}`} onClick={() => setDead(n => n + 1)}>{tr({ uz: "Savatga qo'shish", ru: 'В корзину' })}</button>
                <p className="js-out">{dead === 0 ? tr({ uz: "bosib ko'ring", ru: 'нажмите' }) : tr({ uz: "Bosildi, lekin hech nima o'zgarmadi", ru: 'Нажали, но ничего не изменилось' })}</p>
              </div>
              <div className="js-half">
                <span className="js-tag live">{tr({ uz: "JavaScript qo'shilgach", ru: 'Когда добавится JavaScript' })}</span>
                <button className={`js-btn live${liveHint ? ' turn-ring' : ''}`} onClick={() => setCart(n => n + 1)}>{tr({ uz: "Savatga qo'shish", ru: 'В корзину' })}</button>
                <p className="js-out">{cart === 0 ? tr({ uz: "bosib ko'ring", ru: 'нажмите' }) : tr({ uz: `Savatda ${cart} ta mahsulot`, ru: `В корзине товаров: ${cart}` })}</p>
              </div>
            </div>
            {tried && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Farq shunda: HTML bo'limlarni qo'yadi, CSS ko'rinishini beradi, <b>JavaScript esa tugma bosilganda nima bo'lishini hal qiladi</b>. Uni keyingi modulda o'rganasiz.</>, ru: <>Разница вот в чём: HTML ставит разделы, CSS задаёт внешний вид, <b>а JavaScript решает, что произойдёт при нажатии кнопки</b>. Его вы выучите в следующем модуле.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Saytingizga qaysi ikkitasini qo'shmoqchisiz?", ru: 'Какие две вещи вы хотите добавить на сайт?' })}</p>
            <div className="pf-opts fade-up delay-2" style={{ opacity: tried ? 1 : 0.5, pointerEvents: tried ? 'auto' : 'none' }}>
              {K.js.map((j, ji) => { const k = String(ji); return <button key={k} className={`pf-chip ${sel.includes(k) ? 'on' : ''}${turnCls(selLit, k, true)}`} onClick={() => toggle(k)}>{sel.includes(k) ? '✓ ' : ''}{tr(j)}</button>; })}
            </div>
            {!tried && <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Avval chapdagi ikkala tugmani bosib ko'ring.", ru: 'Сначала нажмите обе кнопки слева.' })}</p>}
            <PitchCard items={items} mini />
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
    audioText="HTML va CSS qila olmaydigan, JavaScript qila oladigan ish qaysi?"
    questionText={{ uz: 'HTML va CSS qila olmaydigan, JavaScript qila oladigan ish qaysi?', ru: 'Что умеет JavaScript, но не умеют HTML и CSS?' }}
    question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>HTML va CSS qila olmaydigan, <span className="italic" style={{ color: T.accent }}>JavaScript</span> qila oladigan ish qaysi?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Что умеет <span className="italic" style={{ color: T.accent }}>JavaScript</span>, но не умеют HTML и CSS?</h2></> }}
    options={[
      { uz: 'Sarlavha shriftini kattalashtirish', ru: 'Увеличить шрифт заголовка' },
      { uz: 'Sahifaga rasm qo\'yish', ru: 'Поставить на страницу картинку' },
      { uz: 'Tugma bosilganda mahsulotni savatga qo\'shish', ru: 'При нажатии кнопки добавить товар в корзину' },
      { uz: 'Matn rangini ko\'k qilish', ru: 'Сделать текст синим' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! Tugma bosilganda nimadir o'zgarishi — bu harakat. Harakatni JavaScript beradi, uni keyingi modulda o'rganasiz.", ru: 'Верно! Когда после нажатия кнопки что-то меняется — это действие. Действие даёт JavaScript, его вы выучите в следующем модуле.' }}
    explainWrong={{
      0: { uz: 'Shrift o\'lchami — ko\'rinish, uni CSS hal qiladi. Tugma bosilganda nima bo\'lishini kim hal qiladi?', ru: 'Размер шрифта — внешний вид, это решает CSS. А кто решает, что будет при нажатии кнопки?' },
      1: { uz: 'Rasm qo\'yish — bo\'lim, uni HTML hal qiladi. Sahifada nimadir o\'zgarishi uchun nima kerak?', ru: 'Поставить картинку — это раздел, это решает HTML. А что нужно, чтобы на странице что-то изменилось?' },
      3: { uz: 'Matn rangi — ko\'rinish, uni CSS beradi. JavaScript esa harakatni beradi.', ru: 'Цвет текста — внешний вид, его задаёт CSS. А JavaScript даёт действие.' },
      default: { uz: 'HTML — bo\'limlar, CSS — ko\'rinish, JavaScript — harakat: bosilganda nima bo\'lishi.', ru: 'HTML — разделы, CSS — внешний вид, JavaScript — действие: что произойдёт при нажатии.' }
    }} />
);

// ===== SCREEN 11 — OTA-ONA SAVOLLARI =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's11', text: `Nutqdan keyin savollar boshlanadi. Uchta savol bor — deyarli har yili shular so'raladi. Har biriga to'g'ri javobni tanlang.`, trigger: 'on_mount', waits_for: null }]);
  const [d] = usePitch3();
  const mine = d.who && d.help
    ? tr({ uz: `Saytim ${d.who}ga kerak: ${d.help}.`, ru: `Мой сайт нужен: ${d.who} — ${d.help}.` })
    : tr({ uz: 'Saytim sinfdoshlarimga kerak: kerakli kitobni bir joydan topishga yordam beradi.', ru: 'Мой сайт нужен моим одноклассникам: он помогает найти нужную книгу в одном месте.' });
  const CARDS = [
    { q: { uz: 'Buni rostdan o\'zing qildingmi?', ru: 'Ты правда сделал это сам?' }, opts: [
      { t: { uz: 'Mentor o\'rgatdi, saytni o\'zim qildim.', ru: 'Ментор научил, а сайт я сделал сам.' }, ok: true },
      { t: { uz: 'Ha, hech kim yordam bermadi.', ru: 'Да, мне никто не помогал.' }, ok: false, why: { uz: 'Bu — halol javob emas. O\'rganganingizni aytish kuchsizlik emas: mentor o\'rgatdi, ishni siz qildingiz.', ru: 'Это нечестный ответ. Сказать, что вы учились, — не слабость: ментор научил, а работу сделали вы.' } },
      { t: { uz: 'Bilmadim, shunchaki chiqib qoldi.', ru: 'Не знаю, как-то само получилось.' }, ok: false, why: { uz: 'Bu javob mehnatingizni yashiradi. Saytni kim qilganini aniq ayting.', ru: 'Такой ответ прячет ваш труд. Скажите прямо, кто сделал сайт.' } }
    ] },
    { q: { uz: 'Bunga qancha vaqt ketdi?', ru: 'Сколько времени на это ушло?' }, opts: [
      { t: { uz: 'Bir necha kun — har darsda o\'rganganlarimni loyihamda ishlatdim.', ru: 'Несколько дней — на каждом уроке я применял выученное в своём проекте.' }, ok: true },
      { t: { uz: 'Bilmadim, hisoblamadim.', ru: 'Не знаю, не считал.' }, ok: false, why: { uz: 'Aniq javob mehnatingizni ko\'rsatadi. Nechta darsda ishlaganingizni eslang.', ru: 'Точный ответ показывает ваш труд. Вспомните, на скольких уроках вы над ним работали.' } },
      { t: { uz: 'Besh daqiqada tayyor bo\'ldi.', ru: 'Да за пять минут сделал.' }, ok: false, why: { uz: 'Bu qilgan ishingizni arzonlashtiradi. Rostini ayting — u ancha ta\'sirli.', ru: 'Так вы обесцениваете свою работу. Скажите как есть — это звучит куда сильнее.' } }
    ] },
    { q: { uz: 'Bu kimga kerak?', ru: 'А кому это нужно?' }, opts: [
      { t: mine, ok: true },
      { t: { uz: 'Hammaga kerak.', ru: 'Всем нужно.' }, ok: false, why: { uz: '«Hamma» — juda mavhum. Aynan kim ishlatadi va unga qanday foyda beradi?', ru: '«Все» — слишком расплывчато. Кто именно им пользуется и какую пользу получает?' } },
      { t: { uz: 'Bilmadim, shunchaki qildim.', ru: 'Не знаю, просто сделал.' }, ok: false, why: { uz: 'Buni siz darsning boshida aniqlagansiz — o\'sha gapingizni ayting.', ru: 'Вы определили это в начале урока — скажите ту самую фразу.' } }
    ] }
  ];
  const [ans, setAns] = useState({});
  const done = CARDS.every((_, i) => ans[i] && ans[i].ok);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const choose = (i, o) => { if (ans[i] && ans[i].ok) return; setAns(p => ({ ...p, [i]: o })); };
  const cardLit = useTurnWalk(CARDS.map((_, i) => i).filter(i => !(ans[i] && ans[i].ok)).map(String)); // 🔔
  return (
    <Stage eyebrow={tr({ uz: 'Savol-javob', ru: 'Вопросы и ответы' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Repetitsiyaga →', ru: 'К репетиции →' } : { uz: `Javob tayyorlang (${CARDS.filter((_, i) => ans[i] && ans[i].ok).length}/3)`, ru: `Подготовьте ответы (${CARDS.filter((_, i) => ans[i] && ans[i].ok).length}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Nutqdan keyin beriladigan <span className="italic" style={{ color: T.accent }}>savollarga</span> tayyormisiz?</>, ru: <>Готовы к <span className="italic" style={{ color: T.accent }}>вопросам</span>, которые зададут после речи?</> })}</h2></div>
        <Mentor>{tr({ uz: "Nutq tugagach savollar boshlanadi — va ular deyarli har yili bir xil. Har savolga to'g'ri javobni tanlang; tanlangan javob sizning tayyor javobingiz bo'lib qoladi.", ru: 'После речи начинаются вопросы — и почти каждый год они одни и те же. Выберите к каждому верный ответ; выбранный ответ и станет вашим заготовленным.' })}</Mentor>
        <Zoomable>
        <div className="qa-grid">
          {CARDS.map((c, i) => {
            const a = ans[i];
            return (
              <div key={i} className={`qa-card ${a && a.ok ? 'ok' : ''}${turnCls(cardLit, String(i), true)}`}>
                <p className="qa-q">{tr(c.q)}</p>
                <div className="qa-opts">
                  {c.opts.map((o, j) => {
                    const on = a === o;
                    const solved = a && a.ok;
                    let cls = 'qa-opt';
                    if (solved && o.ok) cls += ' good';
                    else if (on && !o.ok) cls += ' bad';
                    return <button key={j} className={cls} disabled={!!solved} onClick={() => choose(i, o)}>{tr(o.t)}</button>;
                  })}
                </div>
                {a && !a.ok && <p className="qa-why">{tr(a.why)}</p>}
                {a && a.ok && <p className="qa-ok">{tr({ uz: '✓ Tayyor javobingiz', ru: '✓ Ваш готовый ответ' })}</p>}
              </div>
            );
          })}
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== HTML SINTAKSIS-LINTERI (manba: src/compilator/HtmlCompiler.jsx — qator raqami bilan xato) =====
const KOD_VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
// Yopish tegi IXTIYORIY bo'lgan elementlar — brauzer o'zi yopadi, «yopilmagan» deb qizarmasin
const KOD_OPTIONAL = new Set(['li', 'p', 'td', 'th', 'tr', 'dt', 'dd', 'option', 'thead', 'tbody', 'tfoot']);
const KOD_BLOCK = new Set(['address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'main', 'menu', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul']);
function kodClosesOnOpen(open, top) {
  if (top === 'li') return open === 'li';
  if (top === 'p') return open === 'p' || KOD_BLOCK.has(open);
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
  const stack = [];
  const n = src.length;
  let i = 0, line = 1, col = 1;
  const here = () => ({ line, col });
  const step = () => { if (src[i] === '\n') { line++; col = 1; } else { col++; } i++; };
  const skipTo = (idx) => { while (i < idx && i < n) step(); };
  while (i < n) {
    if (src[i] !== '<') { step(); continue; }
    const next = src[i + 1];
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      if (end === -1) { errors.push({ ...here(), msg: tr({ uz: "Izoh yopilmagan — oxiriga --> qo'ying", ru: 'Комментарий не закрыт — поставьте в конце -->' }) }); break; }
      skipTo(end + 3); continue;
    }
    if (next === '!') {
      const end = src.indexOf('>', i);
      if (end === -1) { errors.push({ ...here(), msg: tr({ uz: '<! ... > yopilmagan', ru: '<! ... > не закрыт' }) }); break; }
      skipTo(end + 1); continue;
    }
    if (next === '/') {
      const start = here();
      let j = i + 2, name = '';
      while (j < n && /[a-zA-Z0-9-]/.test(src[j])) { name += src[j]; j++; }
      while (j < n && src[j] !== '>') j++;
      if (j >= n) { errors.push({ line: start.line, msg: tr({ uz: `</${name}> to'liq emas — oxiriga > qo'ying`, ru: `</${name}> не дописан — поставьте в конце >` }) }); break; }
      const lname = name.toLowerCase();
      while (stack.length && KOD_OPTIONAL.has(stack[stack.length - 1].name) && stack[stack.length - 1].name !== lname && stack.some((s, idx) => s.name === lname && idx < stack.length - 1)) stack.pop();
      if (stack.length === 0) {
        errors.push({ line: start.line, msg: tr({ uz: `Ortiqcha yopuvchi teg </${name}> — unga mos ochuvchi teg yo'q`, ru: `Лишний закрывающий тег </${name}> — для него нет открывающего` }) });
      } else {
        const top = stack[stack.length - 1];
        if (top.name === lname) { stack.pop(); }
        else {
          const idx = stack.map(s => s.name).lastIndexOf(lname);
          if (idx === -1) errors.push({ line: start.line, msg: tr({ uz: `</${name}> ga mos ochuvchi teg yo'q — nom xato yozilgan bo'lishi mumkin`, ru: `Для </${name}> нет открывающего тега — возможно, имя написано с ошибкой` }) });
          else { errors.push({ line: top.line, msg: tr({ uz: `<${top.name}> yopilmagan — </${top.name}> kutilgan edi, </${name}> keldi`, ru: `<${top.name}> не закрыт — ожидался </${top.name}>, а пришёл </${name}>` }) }); stack.length = idx; }
        }
      }
      skipTo(j + 1); continue;
    }
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
      if (quote && j >= n) { errors.push({ line: start.line, msg: tr({ uz: `<${name}> ichida tirnoq (${quote}) yopilmagan`, ru: `Внутри <${name}> не закрыта кавычка (${quote})` }) }); break; }
      if (strayLt) { errors.push({ line: start.line, msg: tr({ uz: `<${name} tegi > bilan yopilmagan`, ru: `Тег <${name} не закрыт символом >` }) }); skipTo(j); continue; }
      if (!closed && j >= n) { errors.push({ line: start.line, msg: tr({ uz: `<${name} tegi > bilan yopilmagan`, ru: `Тег <${name} не закрыт символом >` }) }); break; }
      const lname = name.toLowerCase();
      while (stack.length && kodClosesOnOpen(lname, stack[stack.length - 1].name)) stack.pop();
      if (!selfClose && !KOD_VOID.has(lname)) stack.push({ name: lname, line: start.line });
      skipTo(j); continue;
    }
    step();
  }
  for (const t of stack) {
    if (KOD_OPTIONAL.has(t.name)) continue;
    errors.push({ line: t.line, msg: tr({ uz: `<${t.name}> ochiq qoldi — </${t.name}> bilan yoping`, ru: `<${t.name}> остался открытым — закройте его через </${t.name}>` }) });
  }
  return errors;
}

// ===== TUZILMA-TEKSHIRUVI — DOMParser ctx ($ / $) ustida, 4 shart =====
// Har shart uchun maslahat HARAKATGA CHORLAYDI (nima yozish kerakligini aytadi), ayblamaydi (66-qonun).
const KOD_CONDS = [
  // Tekshiruv TEG-asosli (checkStructure) — yorliq tarjimasi tekshiruvga ta'sir qilmaydi
  { id: 'c1', label: { uz: 'Tepada <header> bor', ru: 'Наверху есть <header>' } },
  { id: 'c2', label: { uz: 'Ichida <h1> — saytingiz nomi', ru: 'Внутри <h1> — название вашего сайта' } },
  { id: 'c3', label: { uz: 'Ichida <p> — yechim jumlangiz', ru: 'Внутри <p> — ваша фраза-решение' } },
  { id: 'c4', label: { uz: "Pastda <main> va <h2> bo'lim sarlavhasi", ru: 'Ниже <main> и <h2> — заголовок раздела' } },
];
function checkStructure(html) {
  const res = { c1: false, c2: false, c3: false, c4: false, hints: {} };
  if (typeof DOMParser === 'undefined') return res;
  const parsed = new DOMParser().parseFromString(html || '', 'text/html');
  const body = parsed.body;
  const one = (sel) => { try { return body.querySelector(sel); } catch (_e) { return null; } };
  const txt = (el) => (el && el.textContent ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  const header = one('header');
  const main = one('main');

  // ① <header> — sahifaning tepa qavati
  if (!header) res.hints.c1 = tr({ uz: "Sahifa tepasida <header> yo'q. <header> ... </header> yozing — Demo Day kuni zal birinchi shuni ko'radi.", ru: 'Наверху страницы нет <header>. Напишите <header> ... </header> — в Демо-день зал увидит это первым.' });
  else res.c1 = true;

  // ② <h1> — saytning nomi (header ICHIDA)
  const h1 = one('header h1');
  if (!header) res.hints.c2 = tr({ uz: "Avval <header> ni qo'ying, keyin uning ichiga <h1> yozasiz.", ru: 'Сначала поставьте <header>, а внутрь него напишете <h1>.' });
  else if (!h1) res.hints.c2 = tr({ uz: "<header> ichida <h1> yo'q — saytingiz nomini <h1>...</h1> ichiga yozing.", ru: 'Внутри <header> нет <h1> — напишите название сайта внутри <h1>...</h1>.' });
  else if (txt(h1).length < 2) res.hints.c2 = tr({ uz: "<h1> bo'sh turibdi — ichiga saytingiz nomini yozing.", ru: '<h1> пустой — впишите внутрь название вашего сайта.' });
  else res.c2 = true;

  // ③ <p> — nutqingizdagi YECHIM jumlasi (header ICHIDA, h1 dan keyin)
  const p = one('header p');
  if (!header) res.hints.c3 = tr({ uz: "Avval <header> ni qo'ying.", ru: 'Сначала поставьте <header>.' });
  else if (!p) res.hints.c3 = tr({ uz: "<header> ichida <p> yo'q — yechim jumlangizni <p>...</p> ichiga yozing.", ru: 'Внутри <header> нет <p> — напишите свою фразу-решение внутри <p>...</p>.' });
  else if (txt(p).length < 15) res.hints.c3 = tr({ uz: "Bu jumla juda qisqa. Nutqingizdagi yechim jumlasini to'liq yozing — sayt nima qilishini aytadigan gap.", ru: 'Фраза слишком короткая. Напишите фразу-решение из своей речи полностью — ту, что говорит, что делает сайт.' });
  else res.c3 = true;

  // ④ <main> va uning ichidagi bo'lim sarlavhasi
  const h2 = one('main h2');
  if (!main) res.hints.c4 = tr({ uz: "<header> dan keyin <main> ... </main> qo'shing — asosiy qism o'sha yerda turadi.", ru: 'После <header> добавьте <main> ... </main> — основная часть стоит там.' });
  else if (one('header main') || one('main header')) res.hints.c4 = tr({ uz: "<main> va <header> yonma-yon turadi — biri ikkinchisining ichida bo'lmaydi.", ru: '<main> и <header> стоят рядом — один не вкладывается в другой.' });
  else if (!h2) res.hints.c4 = tr({ uz: "<main> ichida <h2> yo'q — bo'lim sarlavhasini <h2>...</h2> ichiga yozing.", ru: 'Внутри <main> нет <h2> — напишите заголовок раздела внутри <h2>...</h2>.' });
  else if (txt(h2).length < 2) res.hints.c4 = tr({ uz: "<h2> bo'sh turibdi — bo'lim nomini yozing.", ru: '<h2> пустой — впишите название раздела.' });
  else res.c4 = true;

  return res;
}

const KOD_PREVIEW_CSS = `
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#FBFAFE;color:#1B1630;line-height:1.55}
  header{background:#1B1630;color:#fff;padding:16px 20px}
  header h2{margin:0 0 4px;font-size:18px;font-family:Georgia,serif}
  header p{margin:0;font-size:13px;color:#CFC7F0}
  main{padding:18px 20px;display:flex;flex-direction:column;gap:16px}
  main h2{margin:0 0 4px;font-size:16px;font-family:Georgia,serif;color:#5B3DE6}
  main p{margin:0;font-size:14px;color:#565073;overflow-wrap:anywhere}
  footer{background:#EBE5FD;color:#565073;padding:14px 20px;font-size:13px}
  footer p{margin:0;overflow-wrap:anywhere}
  h2,p{overflow-wrap:anywhere;min-width:0}
`;
const kodWrapDoc = (code) => `<!doctype html><html lang="uz"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><style>${KOD_PREVIEW_CSS}</style></head>
<body>${code}</body></html>`;

// Placeholder-namuna: muharrir BO'SH boshlanadi, xira namuna ko'rinib turadi.
// Nusxa-ko'chirishga qarshi: faqat SKELET ko'rinadi — bo'limlar nomi/tartibi berilmaydi.
const KOD_PLACEHOLDER = {
  uz: `<!-- Bu xira NAMUNA. Yozishni boshlasangiz o'chadi — o'zingiz yozing. -->
<header>
  <h1>... saytingiz nomi ...</h1>
  <p>... yechim jumlangiz ...</p>
</header>

<main>
  <h2>... bo'lim nomi ...</h2>
  <p>... bir gap izoh ...</p>
</main>`,
  ru: `<!-- Это бледный ОБРАЗЕЦ. Начнёте писать — он исчезнет, пишите своё. -->
<header>
  <h1>... название вашего сайта ...</h1>
  <p>... ваша фраза-решение ...</p>
</header>

<main>
  <h2>... название раздела ...</h2>
  <p>... одно предложение-пояснение ...</p>
</main>`
};

// Reload-himoya: o'quvchi yozgan kod F5 da yo'qolmasin — lesson-scoped kalit
const KODING_KEY = 'pm-m1d14-koding';
const readKoding = () => { try { const v = JSON.parse(localStorage.getItem(KODING_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
// F-0801-01: kompilyator ochiq-yopiqligi ham saqlanadi — fon-tabda Chrome sahifani
// qayta yuklasa (Memory Saver), o'quvchi kompilyator ICHIGA qaytadi, praktika-sahifaga emas.
const writeKodingOpen = (open) => { try { const p = readKoding() || {}; localStorage.setItem(KODING_KEY, JSON.stringify({ ...p, open })); } catch {} };

// ===== TO'LIQ-EKRAN KOMPILYATOR — tepada topshiriq + jonli shart-chiplar,
// chapda muharrir (Tab = 2 probel, ▶), o'ngda jonli brauzer-natija, pastda navigatsiya.
function StrukturaCompiler({ initialCode, onContinue, onBack }) {
  const [code, setCode] = useState(initialCode || '');
  const [src, setSrc] = useState(initialCode || ''); // debounce'dan keyingi tekshiriladigan matn
  // Yozgan sari O'ZI tekshiriladi (400ms) + kod jonli saqlanadi (F5 da yo'qolmasin)
  useEffect(() => {
    const t = setTimeout(() => {
      setSrc(code);
      try { const prev = readKoding(); localStorage.setItem(KODING_KEY, JSON.stringify({ code, done: !!(prev && prev.done), open: true })); } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [code]);
  const res = useMemo(() => checkStructure(src), [src]);
  const errs = useMemo(() => lintHtml(src), [src]);
  const doc = useMemo(() => kodWrapDoc(src), [src]);
  const okN = KOD_CONDS.filter(c => res[c.id]).length;
  const passed = okN === KOD_CONDS.length && errs.length === 0;
  const firstHint = KOD_CONDS.map(c => (res[c.id] ? null : res.hints[c.id])).find(Boolean);
  const runNow = () => setSrc(code);
  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target, s = el.selectionStart, en = el.selectionEnd;
      setCode(code.slice(0, s) + '  ' + code.slice(en));
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    }
  };
  return (
    <div className="shc-root">
      <div className="shc-wrap">
        <header className="shc-top">
          <span className="shc-eyebrow">{tr({ uz: 'Koding · yakuniy ish', ru: 'Кодинг · итоговая работа' })}</span>
          <h1 className="shc-title">{tr({ uz: '«OLX» sahifasining tuzilishini yozing', ru: 'Напишите структуру страницы «OLX»' })}</h1>
          <p className="shc-brief">{tr({ uz: <>Uchta teg: <span className="mono">header</span> (sayt nomi) · <span className="mono">main</span> (asosiy qism) · <span className="mono">footer</span> (havolalar va aloqa). <span className="mono">main</span> ichida 4 bo'lim — har biri <span className="mono">h2</span> sarlavha + <span className="mono">p</span> izoh. Bo'limlar: <b>Isbot</b> · <b>Harakat</b> · <b>Muammo</b> · <b>Qanday ishlaydi</b> — <b>to'g'ri tartibda</b> joylang.</>, ru: <>Три тега: <span className="mono">header</span> (название сайта) · <span className="mono">main</span> (основная часть) · <span className="mono">footer</span> (ссылки и контакты). Внутри <span className="mono">main</span> — 4 раздела, у каждого заголовок <span className="mono">h2</span> + пояснение <span className="mono">p</span>. Разделы: <b>Доказательство</b> · <b>Действие</b> · <b>Проблема</b> · <b>Как это работает</b> — расставьте <b>в правильном порядке</b>.</> })}</p>
          <div className="shc-chips">
            <span className="shc-count">{okN}/{KOD_CONDS.length}</span>
            {KOD_CONDS.map((c, i) => (
              <span key={c.id} className={`shc-chip ${res[c.id] ? 'ok' : ''}`}>
                <span className="shc-dot">{res[c.id] ? '✓' : i + 1}</span>{tr(c.label)}
              </span>
            ))}
          </div>
          {errs.length > 0
            ? <p className="shc-err">⚠ {tr({ uz: `${errs[0].line}-qator:`, ru: `Строка ${errs[0].line}:` })} {errs[0].msg}{errs.length > 1 ? tr({ uz: ` (yana ${errs.length - 1} ta sintaksis xatosi)`, ru: ` (ещё синтаксических ошибок: ${errs.length - 1})` }) : ''}</p>
            : (!passed && firstHint && <p className="shc-hint">💡 {firstHint}</p>)}
        </header>
        <main className="shc-split">
          <section className="shc-pane">
            <div className="shc-bar dark">
              <span className="bb-dots"><i /><i /><i /></span>
              <span className="shc-tab">index.html</span>
              <button className="shc-mini" onClick={runNow}>{tr({ uz: '▶ Ishga tushirish', ru: '▶ Запустить' })}</button>
            </div>
            <textarea className="shc-code" value={code} spellCheck={false} autoCapitalize="off" autoCorrect="off" onChange={e => setCode(e.target.value)} onKeyDown={onKeyDown} placeholder={tr(KOD_PLACEHOLDER)} />
          </section>
          <section className="shc-pane">
            <div className="shc-bar">
              <span className="bb-dots"><i /><i /><i /></span>
              <span className="shc-url"><span className="lock">●</span>olx.uz</span>
              <span className="shc-live">{tr({ uz: 'jonli', ru: 'вживую' })}</span>
            </div>
            <iframe className="shc-frame" title={tr({ uz: 'Jonli natija', ru: 'Живой результат' })} sandbox="" srcDoc={doc} />
          </section>
        </main>
        <footer className="shc-bottom">
          <button className="shc-ghost" onClick={onBack}>{tr({ uz: '← Darsga qaytish', ru: '← Вернуться к уроку' })}</button>
          <button className="shc-ghost" onClick={() => setCode('')}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button>
          <div className="shc-status">
            {passed
              ? <span className="shc-ok-msg">{tr({ uz: "✓ Sahifa tuzilishi to'g'ri yig'ildi!", ru: '✓ Структура страницы собрана верно!' })}</span>
              : <span className="shc-wait-msg">{tr({ uz: "Shartlarni bajaring — natija o'ngda jonli ko'rinadi", ru: 'Выполните условия — результат виден справа вживую' })}</span>}
          </div>
          <button className="shc-next" disabled={!passed} onClick={() => passed && onContinue({ code })}>{tr({ uz: 'Davom etish →', ru: 'Продолжить →' })}</button>
        </footer>
      </div>
    </div>
  );
}

const ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  // Erkin (mustaqil) rejim — jonli sessiya yo'q. Takrorlash-yo'li faqat shu yerda ko'rinadi.
  const isSelf = !live || live.mode === 'self';
  const [pitch] = usePitch3();
  const kodUrl = (pitch.link && pitch.link.trim()) || tr({ uz: 'sizning-saytingiz.netlify.app', ru: 'vash-sayt.netlify.app' });
  const workRef = useRef(null);
  // F-0801-01: qayta yuklanishda (Chrome fon-tabni bo'shatgan bo'lsa) kompilyator o'zi qayta ochiladi
  const [open, setOpen] = useState(() => { const s = readKoding(); return !!(s && s.open); });
  const [st, setSt] = useState(() => {
    const saved = readKoding();
    return { code: storedAnswer?.code || (saved && saved.code) || '', done: !!(storedAnswer && storedAnswer.solved) || !!(saved && saved.done) };
  });
  const { code, done } = st;
  // Navbat (88-qonun): kompilyator ochilmagan bo'lsa tugma o'zi chorlaydi. Kompilyator
  // ochilgan paytda tugma ko'rinmaydi, shuning uchun puls ham to'xtaydi.
  const openHint = useTurnHint(!done && !open);
  // Reload'dan keyin signal qayta ketsin — mentor panelida «bajarmagan» bo'lib qolmasin
  useEffect(() => {
    if (done && storedAnswer === undefined) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  }, []); // eslint-disable-line
  const finishPractice = ({ code: newCode }) => {
    setOpen(false);
    setSt({ code: newCode, done: true });
    try { localStorage.setItem(KODING_KEY, JSON.stringify({ code: newCode, done: true, open: false })); } catch {}
    if (!done) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code: newCode, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  return (
    <Stage eyebrow={tr({ uz: 'Koding · 🛠 kompilyator', ru: 'Кодинг · 🛠 компилятор' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval kompilyatorda yozing', ru: 'Сначала напишите в компиляторе' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yechim jumlangizni saytingiz tepasiga chiqaradigan <span className="italic" style={{ color: T.accent }}>kod</span> yozamiz</>, ru: <>Напишем <span className="italic" style={{ color: T.accent }}>код</span>, который выведет вашу фразу-решение наверх сайта</> })}</h2></div>
        <Mentor>{tr({ uz: <>Demo Day kuni zal saytingizni ochganda birinchi shu jumlani o'qiydi — shuning uchun uni sahifa tepasiga qo'yamiz. Pastdagi <b style={{ color: T.ink }}>«Kompilyatorni ochish»</b> tugmasini bosing: nima yozishni o'sha yerda ko'rsatamiz.</>, ru: <>В Демо-день, открыв ваш сайт, зал первым делом прочитает именно эту фразу — поэтому мы ставим её наверх страницы. Нажмите кнопку <b style={{ color: T.ink }}>«Открыть компилятор»</b> ниже: что писать — покажем там.</> })}</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        <div className="stq fade-up delay-1" ref={workRef}>
          <div className="stq-code">
            <span className="stq-code-bar"><span className="bb-dots"><i /><i /><i /></span>index.html</span>
            <code className="stq-code-body">
              <span className="stq-l t">&lt;header&gt;</span>
              <span className="stq-l dim">   &lt;h1&gt; {tr({ uz: 'sayt nomi', ru: 'название сайта' })}</span>
              <span className="stq-l dim">   &lt;p&gt; {tr({ uz: 'yechim jumlangiz', ru: 'ваша фраза-решение' })}</span>
              <span className="stq-l t">&lt;/header&gt;</span>
              <span className="stq-l m">&lt;main&gt;</span>
              <span className="stq-l dim">   &lt;h2&gt; + &lt;p&gt;</span>
              <span className="stq-l m">&lt;/main&gt;</span>
            </code>
          </div>
          <span className="stq-arrow" aria-hidden="true">➜</span>
          <div className="stq-page">
            <div className="stq-pbar"><span className="bb-dots"><i /><i /><i /></span><span className="stq-purl"><span className="lock">●</span>{kodUrl}</span></div>
            <div className="stq-top">&lt;header&gt;</div>
            <div className="stq-mid">
              <span className="stq-tag">&lt;main&gt;</span>
              {[0, 1].map(i => <span key={i} className="stq-row" style={{ animationDelay: `${0.5 + i * 0.16}s` }}><i /><em /></span>)}
            </div>
          </div>
        </div>
        <div className="stq-cta fade-up delay-2">
          <button className={`kod-launch-btn${openHint ? ' turn-ring' : ''}`} onClick={() => { setOpen(true); writeKodingOpen(true); }}>{done ? tr({ uz: '↻ Kompilyatorni qayta ochish', ru: '↻ Открыть компилятор заново' }) : tr({ uz: '🛠 Kompilyatorni ochish', ru: '🛠 Открыть компилятор' })}</button>
          {done && <span className="stq-cta-sub">{tr({ uz: 'Bajarildi — xohlasangiz kodni yana sayqallang', ru: 'Выполнено — при желании доработайте код' })}</span>}
          {/* 🔓 TAKRORLASH-YO'LI — FAQAT erkin rejimda va FAQAT bajarilmagan holatda.
              Nima uchun: praktika bajarilganda brauzer xotirasiga yoziladi va qaytib kelganda
              darvoza o'zi ochiq bo'ladi. Lekin bola sinfda BOSHQA qurilmada bajargan bo'lsa,
              buni dastur BILA OLMAYDI (login yo'q, PIN esa dars tugagach yopiladi). O'sha
              yagona holat uchun — o'zidan so'raymiz.
              🔴 Bu havola FAQAT eshikni ochadi: nishon bermaydi, «bajarildi» deb yozmaydi,
              serverga signal yubormaydi, xotiraga saqlanmaydi. Jonli darsda ko'rinmaydi. */}
          {!done && isSelf && (
            <button className="stq-skip" onClick={onNext}>{tr({ uz: '✓ Bu mashqni sinfda bajarganman — davom etish →', ru: '✓ Это задание я выполнил в классе — продолжить →' })}</button>
          )}
        </div>
        {done && <div className="done-mini fade-step" style={{ alignSelf: 'center' }}>{tr({ uz: '✅ Ishladi!', ru: '✅ Получилось!' })} <span className="dm-sub">{tr({ uz: '— yechim jumlangiz endi saytingiz tepasida turibdi', ru: '— ваша фраза-решение теперь стоит наверху сайта' })}</span></div>}
        {isMentor && <details className="stq-mnote-d"><summary>{tr({ uz: '👨‍🏫 Eslatma — faqat sizga', ru: '👨‍🏫 Заметка — только для вас' })}</summary><p>{tr({ uz: "Topshiriqni o'quvchilar bajaradi, siz kuzatasiz. «Davom etish» siz uchun ochiq.", ru: 'Задание выполняют ученики, вы наблюдаете. «Продолжить» для вас открыто.' })}</p></details>}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={{ uz: "🛠 Kodni yozib bo'lganlar", ru: '🛠 Кто уже написал код' }} />
      </div>
      {open && <StrukturaCompiler initialCode={code} onContinue={finishPractice} onBack={() => { setOpen(false); writeKodingOpen(false); }} />}
    </Stage>
  );
};

// ===== SCREEN 13 — 🎤 REPETITSIYA (yakuniy ish) =====
// Ekran ataylab bitta ustunda va uch blokda: nutq (o'qiladi) → taymer → mikrofon.
// 6 ta tahrir-maydoni, o'z-baho ro'yxati va yon-karta olib tashlandi (F-0730-14): bu ekranda
// o'quvchi YOZMAYDI — u GAPIRADI. Tahrir kerak bo'lsa, «✎ Tahrirlash» ochadi.
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentorLive = !!(gate.live && gate.live.mode === 'mentor');
  const audio = useAudio([{ id: 's13', text: `Mana eng muhim qadam — repetitsiya. Nutqingiz yig'ilgan: uni o'qib chiqing, keyin taymerni bosing va ovoz chiqarib ayting. Mikrofon yozib oladi, siz o'zingizni eshitasiz.`, trigger: 'on_mount', waits_for: { type: 'typed_ok' } }]);
  const [d, patch] = usePitch3();
  const [txt, setTxt] = useState(() => { const o = {}; BLOKS.forEach(b => { o[b.key] = d[b.key] || ''; }); return o; });
  const [edit, setEdit] = useState(false);
  const filled = BLOKS.filter(b => (txt[b.key] || '').trim().length >= 3).length;
  const passed = filled >= BLOKS.length;
  const prevPassed = useRef(false);
  const upd = (k, v) => setTxt(p => ({ ...p, [k]: v }));
  useEffect(() => {
    patch(txt);
    if (passed && !prevPassed.current) {
      prevPassed.current = true;
      onAnswer(screen, { correct: true, stage: 'final', screenIdx: screen, pitch: txt });
      audio.triggerEvent('typed_ok');
    }
  }, [txt, passed]); // eslint-disable-line
  useEffect(() => { if (!passed) setEdit(true); }, [passed]);
  return (
    <Stage eyebrow={tr({ uz: 'Repetitsiya', ru: 'Репетиция' })} screen={screen} narrow audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? false : !passed} label={isMentorLive ? { uz: 'Davom etish', ru: 'Продолжить' } : (passed ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `To'ldiring (${filled}/6)`, ru: `Заполните (${filled}/6)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi nutqingizni <span className="italic" style={{ color: T.accent }}>ovoz chiqarib</span> ayting</>, ru: <>Теперь произнесите свою речь <span className="italic" style={{ color: T.accent }}>вслух</span></> })}</h2></div>
        <Mentor>{tr({ uz: "Nutqingiz yig'ildi. Uni bir marta o'qib chiqing, so'ng taymerni bosing va ovoz chiqarib ayting — mikrofon yozib oladi.", ru: 'Ваша речь собрана. Прочитайте её один раз, потом нажмите таймер и произнесите вслух — микрофон запишет.' })}</Mentor>
        {passed && !storedAnswer && <Confetti />}

        {!edit ? (
          <div className="tp fade-up">
            <div className="tp-h">
              <span className="tp-t">{tr({ uz: 'Nutqingiz', ru: 'Ваша речь' })}</span>
              <button className="tp-edit" onClick={() => setEdit(true)}>{tr({ uz: '✎ Tahrirlash', ru: '✎ Редактировать' })}</button>
            </div>
            {BLOKS.map(b => (
              <p key={b.key} className="tp-row">
                <span className="tp-lb" style={{ color: b.color }}>{tr(b.label)}</span>
                <span className="tp-tx">{txt[b.key]}</span>
              </p>
            ))}
          </div>
        ) : (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {BLOKS.map(b => {
              const ok = (txt[b.key] || '').trim().length >= 3;
              return (
                <div key={b.key} className={`bk ${ok ? 'ok' : ''}`}>
                  <div className="bk-h">
                    <span style={{ color: ok ? T.success : b.color, display: 'inline-flex' }}>{ok ? Ico.check(15) : b.ic}</span>
                    <span className="bk-lbl">{tr(b.label)}</span>
                    <span className="bk-sec mono">{fmtSec(b.sec)}</span>
                  </div>
                  <textarea value={txt[b.key]} onChange={e => upd(b.key, e.target.value)} placeholder={tr(b.ph)} rows={2} className="fld-ta" />
                </div>
              );
            })}
            {passed && <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setEdit(false)}>{tr({ uz: "✓ Tayyor — nutqni ko'rish", ru: '✓ Готово — посмотреть речь' })}</button>}
          </div>
        )}

        {passed && !edit && <StageTimer />}
        {passed && !edit && <MicRecorder title={{ uz: "O'zingizni yozib oling", ru: 'Запишите себя' }} hint={{ uz: "Boshidan oxirigacha ayting, keyin eshiting — qaysi joyda to'xtab qolyapsiz?", ru: 'Скажите от начала до конца, потом послушайте — где вы запинаетесь?' }} />}
        {isMentorLive && <MentorWorkStats live={gate.live} screenIdx={screen} taskLabel={{ uz: 'Nutq yozilmoqda', ru: 'Пишут речь' }} />}
      </div>
    </Stage>
  );
};

// 💻 Uyga-vazifa kapsulasi fonida suzuvchi xira so'z-tokenlar — dars DNK'si (CodeStrike cs-sky oilasi)
const HW_TOKENS = [
  { t: '🎤',        l: 5,  tp: 16, s: 13, d: 6.5 },
  { t: { uz: 'muammo', ru: 'проблема' }, l: 80, tp: 12, s: 11, d: 7.5 },
  { t: { uz: 'yechim', ru: 'решение' },  l: 12, tp: 70, s: 11, d: 8 },
  { t: { uz: 'demo', ru: 'демо' },       l: 68, tp: 76, s: 12, d: 6 },
  { t: '3:00',      l: 86, tp: 52, s: 10, d: 9 },
  { t: { uz: 'sahna', ru: 'сцена' },     l: 36, tp: 8,  s: 10, d: 7 },
  { t: '👏',        l: 3,  tp: 44, s: 13, d: 8.5 },
];

// ===== SCREEN 14 — YAKUN + DEMO DAY CHEKLISTI =====
const Screen14 = ({ screen, answers, onReset, onPrev, onFinish }) => {
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
  const [d] = usePitch3();
  const openArena = async () => {
    if (isMentorL && quizSt === 'off') { try { await _live.quizControl('lobby', -1); } catch (_e) { return; } }
    setArenaSolo(studentSolo); setArena(true);
  };
  const audio = useAudio([{ id: 's14', text: "Tabriklaymiz! Nutqingiz tayyor: oltita bo'lak va savollarga tayyor javoblar. Matningiz brauzeringizda saqlandi — Demo Day kuni shu darsni ochsangiz, joyida turadi. Omad!", trigger: 'on_mount', waits_for: null }]);
  const RECAP = [
    { uz: 'Saytingiz kimning ishini yengillashtirishini bir gapda aytasiz', ru: 'Одной фразой говорите, чью работу облегчает ваш сайт' },
    { uz: '3 daqiqa 6 bo\'lakka bo\'linadi, eng kattasi — jonli demo', ru: '3 минуты делятся на 6 частей, самая большая — живое демо' },
    { uz: 'Qanday qilganingizni ota-onangiz tushunadigan tilda aytasiz', ru: 'Рассказываете, как вы это сделали, на понятном родителям языке' },
    { uz: 'Ota-onangiz beradigan savollarga tayyor javobingiz bor', ru: 'На вопросы родителей у вас есть готовые ответы' }
  ];
  const HOMEWORK = [
    { b: { uz: 'Bugun uyda ayting', ru: 'Сегодня расскажите дома' }, t: { uz: '— ota-onangizga 3 daqiqada aytib bering', ru: '— расскажите родителям за 3 минуты' } },
    { b: { uz: 'Do\'stingizga ayting', ru: 'Расскажите другу' }, t: { uz: '— u 3 daqiqada tushundimi?', ru: '— он понял за 3 минуты?' } },
    { b: { uz: 'Manzilni yozib qo\'ying', ru: 'Запишите адрес' }, t: { uz: '— telefoningiz yozuvlarida tursin', ru: '— пусть лежит в заметках телефона' } }
  ];
  // 💻 Amaliy topshiriq tugmasi — etalon naqshi (zaryad-effekt, so'ng izoh)
  const [hwNote, setHwNote] = useState(false);
  const [hwCharge, setHwCharge] = useState(false);
  const fireHw = () => {
    if (hwCharge) return;
    setHwCharge(true);
    setTimeout(() => { setHwNote(true); setHwCharge(false); }, 500);
  };
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const earned = useContext(AchCtx);
  const achTotal = Object.keys(ACHIEVEMENTS).length;
  const achGot = earned ? earned.size : 0;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">{Ico.check(11)}</span> {tr({ uz: 'Demo Day tayyorgarligi tugadi', ru: 'Подготовка к Демо-дню завершена' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi siz sahnada <span className="italic" style={{ color: T.accent }}>3 daqiqa</span> gapira olasiz.</>, ru: <>Теперь вы можете говорить на сцене <span className="italic" style={{ color: T.accent }}>3 минуты</span>.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} disabled={studentWait} liveOn={studentLive} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        {d.ilgak && (
          <div className="dd-card fade-up d2">
            <div className="dd-card-h">{tr({ uz: '🎤 Demo Day nutqingiz', ru: '🎤 Ваша речь на Демо-день' })}{d.link ? <span className="mono dd-link"> · {d.link}</span> : null}</div>
            <PitchCard items={cardItems(d)} minH={0} />
            <p className="dd-note">{tr({ uz: 'Matningiz shu brauzerda saqlandi — Demo Day kuni shu darsni ochsangiz, joyida turadi.', ru: 'Ваш текст сохранён в этом браузере — откроете урок в Демо-день, он будет на месте.' })}</p>
          </div>
        )}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span style={{ color: T.success, display: 'inline-flex' }}>{Ico.check(15)}</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck" style={{ display: 'inline-flex' }}>{Ico.check(15)}</span><span>{tr(r)}</span></li>))}</ul></div>
        </div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${hwCharge ? 'charging' : ''}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, '--d': `${k.d}s` }}>{tr(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span>
            <span className="hw-big-s">{tr({ uz: "Nutqni uyda aytib ko'rish →", ru: 'Проговорить речь дома →' })}</span>
          </button>
        </div>
        {hwNote && <div className="card hw fade-step"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "Uyda aytib ko'rgan o'quvchi sahnada kamroq hayajonlanadi.", ru: 'Кто проговорил речь дома, тот меньше волнуется на сцене.' })}</p></div>}
        {/* Nishon-ro'yxati — SHAXSIY hisob, mentor proyektorida ko'rsatilmaydi (90-qonun) */}
        {!isMentorL && <div className="card ach-coll fade-up d4">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '🏅 Nishonlaringiz', ru: '🏅 Ваши награды' })} — {achGot}/{achTotal}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(earned && earned.has(id)); return (
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
const Q_LABELS = {
  3: { uz: 'Sayt nima uchun kerak', ru: 'Зачем нужен сайт' },
  7: { uz: "Demoda nima ko'rsatiladi", ru: 'Что показывают в демо' },
  10: { uz: 'JavaScript nima qiladi', ru: 'Что делает JavaScript' },
  13: { uz: '3 daqiqalik nutq (yakuniy)', ru: 'Трёхминутная речь (итог)' }
};

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
const INLINE_KEYS = { s3: 1, s7: 2, s10: 2, s13: -1 };

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
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{isLive ? tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>g'oliblarimiz</span></>, ru: <>Наши <span className="italic" style={{ color: T.accent }}>победители</span> сегодня</> }) : tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш <span className="italic" style={{ color: T.accent }}>результат</span> сегодня</> })}</h2></div>
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
              {live.mode === 'mentor' && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.', ru: 'Вопросы со значком ⚠️ — темы, на которых класс споткнулся. Стоит объяснить заново.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== ⚡ CODESTRIKE (CoddyCamp jonli test arenasi) =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi Demo Day tokenlari
const QZ_BG_SHAPES = [
  { ch: '🎬',       l: 6,  t: 18, s: 40, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: { uz: 'nutq', ru: 'речь' }, l: 84, t: 12, s: 30, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: '🎤',       l: 9,  t: 74, s: 38, c: 'rgba(255,110,70,0.15)',  d: 27, dl: 0.8 },
  { ch: 'Demo Day', l: 76, t: 70, s: 24, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: '3:00',     l: 46, t: 86, s: 28, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: '👏',       l: 66, t: 24, s: 34, c: 'rgba(80,200,255,0.14)',  d: 17, dl: 0.4 },
  { ch: { uz: 'savol', ru: 'вопрос' }, l: 24, t: 36, s: 24, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: { uz: 'demo', ru: 'демо' },    l: 92, t: 46, s: 24, c: 'rgba(120,235,175,0.13)', d: 24, dl: 1.3 },
  { ch: { uz: 'sahna', ru: 'сцена' },  l: 2,  t: 46, s: 22, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: 'Demo Day nutqi qancha davom etadi?', ru: 'Сколько длится речь на Демо-дне?' }, opts: [{ uz: '3 daqiqa', ru: '3 минуты' }, { uz: 'Yarim soat', ru: 'Полчаса' }, { uz: '10 soniya', ru: '10 секунд' }, { uz: 'Qancha xohlasangiz, shuncha', ru: 'Сколько захотите' }], correct: 0 },
  { q: { uz: "Nutqning eng katta bo'lagi qaysi?", ru: 'Какая часть речи самая большая?' }, opts: [{ uz: 'Salomlashuv', ru: 'Приветствие' }, { uz: "Jonli demo — saytni ochib ko'rsatish", ru: 'Живое демо — открыть и показать сайт' }, { uz: 'Qanday qilganingiz', ru: 'Как вы это сделали' }, { uz: 'Rahmat aytish', ru: 'Слова благодарности' }], correct: 1 },
  { q: { uz: 'Nutq nima bilan boshlanadi?', ru: 'С чего начинается речь?' }, opts: [{ uz: 'Saytning nomini aytish bilan', ru: 'С названия сайта' }, { uz: 'Uzun salomlashuv bilan', ru: 'С длинного приветствия' }, { uz: 'Zalga beriladigan savol bilan', ru: 'С вопроса залу' }, { uz: 'Qaysi dasturda qilinganini aytish bilan', ru: 'С рассказа, в какой программе он сделан' }], correct: 2 },
  { q: { uz: 'Saytingiz nega kerakligi qanday aytiladi?', ru: 'Как объяснить, зачем нужен ваш сайт?' }, opts: [{ uz: 'Nechta bo\'limi borligi bilan', ru: 'Через число разделов' }, { uz: 'Qaysi rangda qilinganligi bilan', ru: 'Через цвет сайта' }, { uz: 'Necha kun ishlaganingiz bilan', ru: 'Через число дней работы' }, { uz: 'Kim ishlatishi va unga nimasi qiyin edi bilan', ru: 'Через то, кто им пользуется и что ему было трудно' }], correct: 3 },
  { q: { uz: 'Jonli demoda nima ochiladi?', ru: 'Что открывают в живом демо?' }, opts: [{ uz: "Saytning o'zi — manzilidan", ru: 'Сам сайт — по его адресу' }, { uz: 'VS Code oynasi', ru: 'Окно VS Code' }, { uz: 'GitHub papkasi', ru: 'Папку на GitHub' }, { uz: 'Netlify sozlamalari', ru: 'Настройки Netlify' }], correct: 0 },
  { q: { uz: 'Ota-onangizga qaysi gap tushunarli?', ru: 'Какая фраза понятна вашим родителям?' }, opts: [{ uz: '«Semantik struktura yaratdim»', ru: '«Я создал семантическую структуру»' }, { uz: "«Bo'limlarni o'zim qo'ydim: sarlavha, matn, rasm»", ru: '«Разделы я расставил сам: заголовок, текст, картинка»' }, { uz: '«Stillarni kaskad bo\'yicha qo\'lladim»', ru: '«Я применил стили каскадом»' }, { uz: '«Repozitoriyani deploy qildim»', ru: '«Я задеплоил репозиторий»' }], correct: 1 },
  { q: { uz: 'HTML sahifada nimani hal qiladi?', ru: 'Что решает HTML на странице?' }, opts: [{ uz: "Tugma bosilganda nima bo'lishini", ru: 'Что произойдёт при нажатии кнопки' }, { uz: 'Sahifa qanchalik tez ochilishini', ru: 'Насколько быстро откроется страница' }, { uz: 'Sahifada qanday bo\'limlar turishini', ru: 'Какие разделы стоят на странице' }, { uz: "Rang va o'lchamni", ru: 'Цвет и размер' }], correct: 2 },
  { q: { uz: 'CSS nimani beradi?', ru: 'Что даёт CSS?' }, opts: [{ uz: "Savatga qo'shish imkonini", ru: 'Возможность добавить в корзину' }, { uz: "Ma'lumotni saqlashni", ru: 'Сохранение данных' }, { uz: 'Sahifa manzilini', ru: 'Адрес страницы' }, { uz: "Rang, o'lcham va joylashuvni", ru: 'Цвет, размер и расположение' }], correct: 3 },
  { q: { uz: "Tugma bosilganda savatga qo'shilishi — kimning ishi?", ru: 'Добавление в корзину по нажатию кнопки — чья это работа?' }, opts: ['JavaScript', 'HTML', 'CSS', 'Netlify'], correct: 0 },
  { q: { uz: "«Buni o'zing qildingmi?» degan savolga qanday javob beriladi?", ru: 'Как отвечают на вопрос «Ты сделал это сам?»' }, opts: [{ uz: '«Bilmadim, shunchaki chiqib qoldi»', ru: '«Не знаю, как-то само получилось»' }, { uz: "«Mentor o'rgatdi, saytni o'zim qildim»", ru: '«Ментор научил, а сайт я сделал сам»' }, { uz: '«Hech kim yordam bermadi»', ru: '«Мне никто не помогал»' }, { uz: '«Bu savolga javob bermayman»', ru: '«На этот вопрос я не отвечаю»' }], correct: 1 },
  { q: { uz: 'Jonli demo necha qadamdan iborat?', ru: 'Из скольких шагов состоит живое демо?' }, opts: [{ uz: 'Bitta — shunchaki saytni ochish', ru: 'Из одного — просто открыть сайт' }, { uz: 'Ikkita: ochaman va yopaman', ru: 'Из двух: открываю и закрываю' }, { uz: "Uchta: ochaman · ko'rsataman · aytaman", ru: 'Из трёх: открываю · показываю · рассказываю' }, { uz: "Har bir bo'limni birma-bir ko'rsataman", ru: 'Показываю каждый раздел по очереди' }], correct: 2 },
  { q: { uz: "Nutqni yozib bo'lgach nima qilinadi?", ru: 'Что делают, когда речь написана?' }, opts: [{ uz: 'Darhol unutiladi', ru: 'Сразу забывают' }, { uz: 'Ikki barobar uzaytiriladi', ru: 'Удлиняют вдвое' }, { uz: "Qog'ozga yozib qo'yiladi", ru: 'Переписывают на бумагу' }, { uz: 'Ovoz chiqarib, taymer bilan repetitsiya qilinadi', ru: 'Репетируют вслух с таймером' }], correct: 3 },
];
const quizPts = (elapsedMs) => elapsedMs <= 500 ? 1000 : Math.max(0, Math.round(1000 * (1 - (Math.min(elapsedMs, QUIZ_MS) / QUIZ_MS) / 2)));
// 🎬 QzFX — arena foni: suzuvchi uchqun + bog'lovchi "web" chiziqlari + Demo Day tokenlari (sahna energiyasi).
// reduced-motion: matchMedia bilan darhol chiqadi (harakat yo'q). L1 QzFX mexanikasi, TOK Demo Day mavzusidan.
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = __lang === 'ru' ? ['речь', 'демо', '🎬', '🎤', '👏', 'вопрос', '3:00'] : ['nutq', 'demo', '🎬', '🎤', '👏', 'savol', '3:00'];
    const em = [], toks = [];
    for (let i = 0; i < 26; i++) em.push({ x: Math.random() * W, y: Math.random() * H, z: .3 + Math.random() * .7, ph: Math.random() * 6.28, sw: .3 + Math.random() * .6 });
    for (let i = 0; i < 7; i++) toks.push({ x: Math.random() * W, y: Math.random() * H, z: .4 + Math.random() * .9, vx: (Math.random() - .5) * .16, t: TOK[i % TOK.length], r: (Math.random() - .5) * .5 });
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
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nПотом кнопкой «⚔️ Продолжить» вы вернётесь ровно на это место.\n\nВсё равно закрыть?' }))) return;
    }
    onClose();
  };

  return (
    <div className="qz-arena">
      <QzFX />
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => (
          <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{tr(s.ch)}</span>
        ))}
      </div>
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
          <CsWordmark stats={false} />
          <h2 className="qz-h">{tr({ uz: 'Mustahkamlash Testi', ru: 'Тест на закрепление' })}</h2>
          <p className="qz-sub">{tr({ uz: `${QUIZ_BANK.length} savol · har biriga ${QUIZ_MS / 1000} soniya · tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!`, ru: `Вопросов: ${QUIZ_BANK.length} · на каждый ${QUIZ_MS / 1000} секунд · чем быстрее верный ответ, тем больше баллов. Ответы подряд дают 🔥 бонус!` })}</p>
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz.', ru: 'Ошиблись — 0 баллов. Возьмёте на следующем.' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling.", ru: 'Время вышло — 0 баллов. Будьте быстрее.' })}</span>}
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
          <div className="qz-brand sm"><QzBolt size={48} /><span className="qz-wm">Code<span className="qz-wm-h">Strike</span></span></div>
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: `ball · ${soloScore.ok}/${QUIZ_BANK.length} to'g'ri`, ru: `баллов · верно ${soloScore.ok}/${QUIZ_BANK.length}` })}{soloScore.maxStreak >= 2 ? tr({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · лучшая серия 🔥x${soloScore.maxStreak}` }) : ''}</p>
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
                      {b && <span className="qz-pod-pts">{b.pts} {tr({ uz: 'ball', ru: 'б.' })} · {b.ok}/{QUIZ_BANK.length}</span>}
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

// 🃏 FLASHCARDS — aktiv takrorlash (3D flip + o'z-o'zini baholash). Demo Day nutqi mavzusi, 12 karta.
const PM3_FLASHCARDS = [
  { front: { uz: 'Demo Day nima?', ru: 'Что такое Демо-день?' }, back: { uz: 'Taqdim qilish kuni', ru: 'День презентации' }, note: { uz: 'ota-onangiz oldida saytingizni ko\'rsatasiz', ru: 'вы показываете свой сайт родителям' } },
  { front: { uz: 'Nutq qancha davom etadi?', ru: 'Сколько длится речь?' }, back: { uz: '3 daqiqa', ru: '3 минуты' }, note: { uz: '6 bo\'lakka bo\'linadi', ru: 'делится на 6 частей' } },
  { front: { uz: 'Nutqning 1-bo\'lagi qaysi?', ru: 'Какая 1-я часть речи?' }, back: { uz: 'Birinchi savol', ru: 'Первый вопрос' }, note: { uz: 'zalga beriladi, o\'ylantiradi', ru: 'задаётся залу, заставляет задуматься' } },
  { front: { uz: 'Nutqning 2-bo\'lagi qaysi?', ru: 'Какая 2-я часть речи?' }, back: { uz: 'Muammo', ru: 'Проблема' }, note: { uz: 'kim ishlatadi va unga nimasi qiyin edi', ru: 'кто пользуется и что ему было трудно' } },
  { front: { uz: 'Nutqning 3-bo\'lagi qaysi?', ru: 'Какая 3-я часть речи?' }, back: { uz: 'Yechim', ru: 'Решение' }, note: { uz: 'sayt nima qiladi — bir jumlada', ru: 'что делает сайт — одной фразой' } },
  { front: { uz: 'Eng katta bo\'lak qaysi?', ru: 'Какая часть самая большая?' }, back: { uz: 'Jonli demo', ru: 'Живое демо' }, note: { uz: '1 daqiqa — saytni ochib ko\'rsatasiz', ru: '1 минута — открываете и показываете сайт' } },
  { front: { uz: 'Demoda nima ochiladi?', ru: 'Что открывают в демо?' }, back: { uz: 'Saytning o\'zi', ru: 'Сам сайт' }, note: { uz: 'manzilidan ochiladi, kod emas', ru: 'открывается по адресу, а не код' } },
  { front: { uz: 'HTML nimani hal qiladi?', ru: 'Что решает HTML?' }, back: { uz: 'Bo\'limlarni', ru: 'Разделы' }, note: { uz: 'sarlavha, matn, rasm joyi', ru: 'заголовок, текст, место для картинки' } },
  { front: { uz: 'CSS nimani beradi?', ru: 'Что даёт CSS?' }, back: { uz: 'Ko\'rinishni', ru: 'Внешний вид' }, note: { uz: 'rang, o\'lcham, joylashuv', ru: 'цвет, размер, расположение' } },
  { front: { uz: 'JavaScript nimani beradi?', ru: 'Что даёт JavaScript?' }, back: { uz: 'Harakatni', ru: 'Действие' }, note: { uz: 'tugma bosilganda nima bo\'lishi', ru: 'что произойдёт при нажатии кнопки' } },
  { front: { uz: '«Buni o\'zing qildingmi?»', ru: '«Ты сделал это сам?»' }, back: { uz: 'Mentor o\'rgatdi, saytni o\'zim qildim', ru: 'Ментор научил, а сайт я сделал сам' }, note: { uz: 'halol javob ishonchni oshiradi', ru: 'честный ответ вызывает доверие' } },
  { front: { uz: 'Jonli demo qanday ketadi?', ru: 'Как идёт живое демо?' }, back: { uz: 'Ochaman · ko\'rsataman · aytaman', ru: 'Открываю · показываю · рассказываю' }, note: { uz: 'uch qadam — sahnada adashmaysiz', ru: 'три шага — на сцене не собьётесь' } },
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{tr({ uz: `${total}/${total} karta takrorlandi`, ru: `Повторено карточек: ${total}/${total}` })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda", ru: '↻ Учу' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span><span className="fc-cue">{tr({ uz: "Javobni o'ylang 🤔", ru: 'Подумайте над ответом 🤔' })} <span className="fc-tap">{tr({ uz: 'bosing', ru: 'нажмите' })}</span></span></div>
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

const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 'sflash', text: `O'zingizni sinab ko'ring. Har kartada bir savol — javobini o'ylang, keyin kartani bosing.`, trigger: 'on_mount', waits_for: null }]);
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={PM3_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// 🏅 To'liq-ekran nishon bayrami (harakat sifati → Animatsiya, KO'RINISH → Dizayn)
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
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}

// ⚡ CODESTRIKE wordmark + bolt (arena lobbyda/done'da ko'rsatiladi). Brend RANGLAR → Dizayn.
const QzBolt = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className="qz-bolt">
    <defs><linearGradient id="qzbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF8A3D" /><stop offset="1" stopColor="#5B3DE6" /></linearGradient></defs>
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
          <span className="cs-hud-i">🏆 PODIUM</span>
        </div>
      )}
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>
  );
};


export default function PmLesson3({ lang: langProp, onFinished }) {
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
  // jonli o'quvchidan yashirin — sakrab o'tiladi. Erkin qilinsa / uzilsa / self — ochiladi.
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
  useEffect(() => { if (screen === TOTAL_SCREENS - 1) earn('graduate'); }, [screen]); // eslint-disable-line

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
      answers: SCREEN_META.map((s, i) => answers[i]).filter(Boolean)
    };
    if (typeof onFinished === 'function') onFinished(payload);
  };

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenCoding, Screen13, ScreenPodium, ScreenFlashcards, Screen14];
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
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(27,22,48,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes dl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.16); } }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        /* 1) Tashqi aura — kapsula orqasidagi nafas oluvchi binafsha nur-gardish */
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        /* 2) Suzuvchi xira tokenlar — dars so'zlari kapsula osmonida */
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: rgba(255,255,255,0.15); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        /* 3) Zaryad-effekt — bosilganda kapsula yorishib "otiladi" */
        .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
        @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.05); } 100% { filter: brightness(1); transform: scale(1); } }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; text-shadow: 0 2px 12px rgba(0,0,0,0.25); }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent); transform: skewX(-18deg); animation: hw-shine 3.2s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 0 rgba(124,58,237,.35); } 50% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 34px rgba(124,58,237,.68), 0 0 84px rgba(124,58,237,.4), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 11px rgba(124,58,237,0); } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none; } .hw-big-wrap::before { opacity: 0.55; } }
        .hw-cta-note { margin: 9px 0 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; }

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
        .mstats-chip.badc { background: ${T.accentSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.accent}; }
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
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }

        /* ===== 🛠 KODING — praktika-panel, aylantirish-vizual va TO'LIQ-EKRAN KOMPILYATOR ===== */
        .lp-mstats { background: ${T.paper}; border-radius: 14px; padding: 13px 15px; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); min-width: 0; overflow-wrap: anywhere; }
        .done-mini { display: inline-flex; align-items: center; gap: 7px; flex-wrap: wrap; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 7px 15px; min-width: 0; overflow-wrap: anywhere; }
        .done-mini .dm-sub { font-weight: 500; color: ${T.ink2}; }
        /* 🔓 Takrorlash-yo'li: JIM matn-havola. Ataylab tugma EMAS va ataylab xira —
           asosiy harakat (kompilyatorni ochish) bilan raqobatlashmasin, faqat kerak
           bo'lganga ko'rinsin. Hoverda aniqlashadi. */
        .stq-skip { margin-top: 2px; background: none; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-decoration: underline; text-underline-offset: 3px; padding: 4px 6px; border-radius: 8px; transition: color 0.15s; }
        .stq-skip:hover { color: ${T.accent}; }
        .stq-mnote-d { align-self: flex-start; min-width: 0; }
        .stq-mnote-d summary { cursor: pointer; list-style: none; display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 700; color: ${T.blue}; background: ${T.blueSoft}; border-radius: 99px; padding: 6px 13px; user-select: none; transition: box-shadow 0.15s; }
        .stq-mnote-d summary::-webkit-details-marker { display: none; }
        .stq-mnote-d summary:hover { box-shadow: 0 4px 12px -6px rgba(14,134,196,0.4); }
        .stq-mnote-d[open] summary { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
        .stq-mnote-d p { margin: 0; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600; color: ${T.blue}; background: ${T.blueSoft}; border-radius: 0 11px 11px 11px; padding: 9px 13px; max-width: 430px; overflow-wrap: anywhere; }

        /* Aylantirish-vizual: teg-skelet ➜ yig'ilgan sahifa (bu darsning O'Z ko'rinishi) */
        .stq { display: flex; align-items: center; gap: clamp(10px,1.8vw,18px); }
        @media (max-width: 760px) { .stq { flex-direction: column; align-items: stretch; } .stq-arrow { transform: rotate(90deg); align-self: center; } }
        .stq-code { flex: 1; min-width: 0; border-radius: 14px; overflow: hidden; background: #10141F; box-shadow: 0 12px 28px -12px rgba(${T.shadowBase},0.4); }
        .stq-code-bar { display: flex; align-items: center; gap: 8px; background: #141C2B; padding: 8px 13px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #7E92B4; }
        .stq-code-body { display: flex; flex-direction: column; padding: clamp(12px,1.8vw,18px) clamp(14px,2vw,20px); font-family: 'JetBrains Mono', monospace; font-size: clamp(11.5px,1.4vw,13.5px); line-height: 1.75; }
        .stq-l { white-space: pre; }
        .stq-l.t { color: #FFD8A8; } .stq-l.m { color: #A9C7FF; } .stq-l.f { color: #B6F0C8; } .stq-l.dim { color: #6C7A94; }
        .stq-arrow { font-size: clamp(20px,2.8vw,28px); color: ${T.accent}; flex-shrink: 0; }
        .stq-page { flex: 1; min-width: 0; border-radius: 14px; overflow: hidden; background: ${T.paper}; box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.3), 0 0 0 1px ${T.line}; display: flex; flex-direction: column; }
        .stq-pbar { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .stq-purl { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; display: flex; align-items: center; gap: 6px; }
        .stq-top { background: ${T.ink}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.06em; padding: 11px 14px; }
        .stq-mid { position: relative; padding: 16px 14px 14px; display: flex; flex-direction: column; gap: 9px; background: #FBFAFE; }
        .stq-tag { position: absolute; top: 5px; right: 10px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
        .stq-row { display: flex; flex-direction: column; gap: 5px; opacity: 0; animation: fade-step 0.45s ease-out forwards; }
        .stq-row i { height: 9px; width: 42%; border-radius: 4px; background: ${T.accent}; opacity: 0.75; }
        .stq-row em { height: 6px; width: 88%; border-radius: 4px; background: ${T.ink3}; opacity: 0.35; }
        .stq-foot { background: ${T.accentSoft}; color: ${T.accent}; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.06em; padding: 10px 14px; }
        @media (prefers-reduced-motion: reduce) { .stq-row { opacity: 1; animation: none; } }
        .stq-cta { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .stq-cta-sub { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-align: center; }
        .kod-launch-btn { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,1.9vw,17px); background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 15px 34px; cursor: pointer; box-shadow: 0 14px 30px -8px rgba(91,61,230,0.6); transition: transform 0.18s, box-shadow 0.18s; }
        .kod-launch-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -8px rgba(110,75,255,0.72); }

        /* To'liq-ekran kompilyator (Htmllesson1 relslari, PM-STUDIA palitrasi) */
        .shc-root { position: fixed; inset: 0; z-index: 2100; background: radial-gradient(120% 80% at 50% -10%, ${T.accentSoft} 0%, rgba(235,229,253,0) 46%), ${T.bg}; overflow: hidden; animation: fade-step 0.3s ease-out; }
        .shc-wrap { width: 100%; max-width: 1160px; height: 100dvh; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; gap: clamp(9px,1.4vw,14px); padding: clamp(12px,2vw,26px); }
        .shc-top { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; min-width: 0; }
        .shc-eyebrow { font-family: 'Manrope', sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 800; color: ${T.accent}; }
        .shc-title { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(19px,2.6vw,28px); margin: 0; color: ${T.ink}; line-height: 1.15; }
        .shc-brief { margin: 0; color: ${T.ink2}; font-size: clamp(12.5px,1.4vw,14.5px); line-height: 1.55; max-width: 72ch; overflow-wrap: anywhere; }
        .shc-brief b { color: ${T.ink}; }
        .shc-chips { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 7px; margin-top: 3px; }
        .shc-count { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; color: #fff; background: ${T.accent}; padding: 6px 11px; border-radius: 99px; }
        .shc-chip { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; background: ${T.paper}; padding: 5px 13px 5px 6px; border-radius: 99px; border: 1px solid ${T.line}; transition: all 0.22s ease; }
        .shc-chip.ok { color: ${T.ink}; border-color: ${T.success}44; background: ${T.successSoft}; }
        .shc-dot { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: ${T.bg}; color: ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; transition: all 0.25s; }
        .shc-chip.ok .shc-dot { background: ${T.success}; color: #fff; }
        .shc-hint.shc-hint { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 8px 15px; border-radius: 11px; max-width: 72ch; line-height: 1.5; overflow-wrap: anywhere; }
        .shc-err.shc-err { margin: 2px 0 0; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: ${T.err}; background: ${T.errSoft}; padding: 7px 14px; border-radius: 10px; max-width: 72ch; line-height: 1.5; overflow-wrap: anywhere; }
        .shc-split { flex: none; height: 56vh; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(10px,1.5vw,16px); }
        .shc-pane { display: flex; flex-direction: column; min-height: 0; min-width: 0; border-radius: 16px; overflow: hidden; background: ${T.paper}; box-shadow: 0 1px 0 ${T.line}, 0 18px 40px -24px rgba(${T.shadowBase},0.35); }
        .shc-bar { display: flex; align-items: center; gap: 10px; padding: 9px 14px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; color: ${T.ink2}; border-bottom: 1px solid ${T.line}; background: ${T.bg}; }
        .shc-bar.dark { background: #141C2B; color: #A7B6D6; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .shc-tab { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: #fff; background: rgba(255,255,255,0.14); padding: 4px 12px; border-radius: 8px; box-shadow: inset 0 -2px 0 ${T.accent}; }
        .shc-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; display: flex; align-items: center; gap: 6px; }
        .shc-mini { margin-left: auto; background: ${T.accent}; color: #fff; border: none; border-radius: 9px; padding: 6px 13px; font-size: 11.5px; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; flex-shrink: 0; }
        .shc-live { margin-left: auto; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: ${T.success}; background: ${T.successSoft}; padding: 4px 9px; border-radius: 99px; font-weight: 800; }
        .shc-code { flex: 1; min-height: 0; resize: none; border: none; outline: none; background: #10141F; color: #E8E5DD; font-family: 'JetBrains Mono', monospace; font-size: 13.5px; line-height: 1.7; padding: 16px 18px; tab-size: 2; white-space: pre; overflow: auto; caret-color: ${T.accentVivid}; }
        .shc-code::placeholder { color: #5B6B86; font-style: italic; }
        .shc-frame { flex: 1; min-height: 0; width: 100%; border: none; background: #FBFAFE; }
        .shc-bottom { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .shc-ghost { background: transparent; border: 1px solid transparent; color: ${T.ink2}; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; padding: 11px 16px; border-radius: 12px; transition: all 0.15s; }
        .shc-ghost:hover { background: ${T.paper}; color: ${T.ink}; border-color: ${T.line}; }
        .shc-status { margin-left: auto; min-width: 0; }
        .shc-ok-msg { color: ${T.success}; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; }
        .shc-wait-msg { color: ${T.ink3}; font-family: 'Manrope', sans-serif; font-size: 13px; }
        .shc-next { background: ${T.accent}; color: #fff; border: none; border-radius: 13px; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 15px; cursor: pointer; padding: 13px 28px; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.55); transition: all 0.2s; }
        .shc-next:hover:not(:disabled) { transform: translateY(-2px); }
        .shc-next:disabled { background: #D7D8DE; color: #fff; cursor: not-allowed; box-shadow: none; }
        @media (max-width: 820px) { .shc-split { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; height: 62vh; } }
        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); border-left: 4px solid #E8A13A; }
        .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
        .mstats-verdict.few { background: rgba(156,151,180,0.12); border-left: 4px solid ${T.ink3}; }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(91,61,230,0.55); }
        .rc-open.soft { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); }
        .rc-open-mini { align-self: flex-start; margin-top: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
        .rc-open-mini:hover { transform: translateY(-1px); }

        .ach-coll { display: flex; flex-direction: column; gap: 10px; }
        .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
        .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #F5F1FE); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line || T.ink3 + '33'}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
        /* === 🔔 NAVBAT-PULSI (88-qonun · 1-C bo'lim) — etalondan aynan ko'chirildi === */
        .turn-hint { animation: turn-hint 1.9s ease-in-out infinite; }
        /* Tugmadan boshqa elementlar uchun (chip, karta, zona): halqa ALOHIDA qatlamda chiziladi —
           elementning o'z soyasi/foniga tegmaydi va layout'ni surmaydi (pointer-events yo'q). */
        .turn-ring { position: relative; }
        .turn-ring::after {
          content: ''; position: absolute; inset: -3px; border-radius: inherit; pointer-events: none;
          border: 2px solid ${T.accent}; opacity: 0; animation: turn-ring 1.9s ease-in-out infinite;
        }
        @keyframes turn-ring { 0%, 100% { opacity: 0; } 50% { opacity: 0.65; } }
        /* Navbat TO'LQINI: bir guruh variant birma-bir yonadi. Kechikishlar shunday tanlanganki,
           istalgan lahzada FAQAT BITTASI ko'rinadi (har biri ~0.4s, kechikish 0.7s). Cheklangan
           (4 aylanish) — sekin o'qiydigan o'quvchi peripheral harakatdan charchamasin. */
        .turn-wave::after { animation-name: turn-wave; animation-duration: 2.1s; animation-iteration-count: 4; }
        @keyframes turn-wave { 0%, 100% { opacity: 0; } 12% { opacity: 0.7; } 30% { opacity: 0; } }
        .turn-wave.w2::after { animation-delay: 0.7s; }
        .turn-wave.w3::after { animation-delay: 1.4s; }
        /* Navbat YURISHI: bitta qadam — paydo bo'ladi, turadi, so'nadi (bir marta). */
        .turn-step::after { animation-name: turn-step; animation-duration: 1.3s; animation-iteration-count: 1; }
        @keyframes turn-step { 0% { opacity: 0; } 20% { opacity: 0.68; } 78% { opacity: 0.68; } 100% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .turn-hint, .turn-ring::after { animation: none; } .turn-ring::after { opacity: 0; } }

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
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .option:hover:not(:disabled) { background: #FDFBF7; transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -8px rgba(18,169,104,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.5 !important; box-shadow: none !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.34) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.2); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(91,61,230,0.4); }
        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 9px 14px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -6px rgba(${T.shadowBase},0.22); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover { transform: translateY(-1px); }

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
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
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
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

        /* === FRAME === */
        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(91,61,230,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(18,169,104,0.22); }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === BRAUZER MAKETI (HTML darslar dizayni) === */
        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 12px 30px -8px rgba(${T.shadowBase},0.2); }
        .bp-bar { background: #f0eee8; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-url { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; display: flex; align-items: center; gap: 6px; } .lock { color: ${T.success}; font-size: 8px; }
        .bp-body { padding: clamp(13px,2.2vw,18px); }
        .pg-in { animation: pg-in 0.38s cubic-bezier(.2,.7,.2,1); } @keyframes pg-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .site-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid ${T.ink3}40; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .site-brand { display: inline-flex; align-items: center; gap: 8px; } .site-logo { width: 24px; height: 24px; border-radius: 6px; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 13px; } .site-name { font-family: 'Manrope'; font-weight: 700; color: ${T.ink}; font-size: 14px; }
        .site-nav { display: inline-flex; gap: 12px; font-family: 'Manrope'; font-size: 12px; color: ${T.ink2}; }
        .site-h3 { font-family: ''Source Serif 4', Georgia, serif'; font-size: clamp(16px,2.2vw,21px); color: ${T.ink}; margin: 0 0 8px; }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
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

        /* === CONN === */
        .conn-flow { display: flex; align-items: center; justify-content: center; gap: 6px; background: ${T.paper}; border-radius: 16px; padding: 24px 16px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.14); }
        .conn-node { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; transition: opacity 0.3s; }
        .conn-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .conn-sub { font-family: 'JetBrains Mono'; font-size: 10px; color: ${T.ink3}; text-align: center; }
        .conn-link { display: flex; align-items: center; gap: 3px; flex: 1; max-width: 150px; }
        .conn-line { flex: 1; height: 3px; background: ${T.success}; border-radius: 2px; transition: background 0.3s; }
        .conn-sig { display: inline-flex; }
        .conn-link.cut .conn-line { background: ${T.ink3}; opacity: 0.5; border-top: 2px dashed ${T.accent}; height: 0; }
        .conn-link.cut { animation: shake 0.3s; }
        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }

        /* === ALGO BUILD === */
        .algo-build { background: ${T.paper}; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.14); }
        .algo-line { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; background: ${T.bg}; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 22px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; } .ta-bulb { } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

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
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.12); overflow: hidden; }
        .gloss-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 17px; cursor: pointer; } .gloss-head .lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; } .gloss-toggle { font-size: 18px; color: ${T.ink2}; }
        .gloss-body { padding: 0 17px 15px; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; line-height: 1.7; animation: fade-step 0.3s; } .gloss-body b { color: ${T.ink}; }

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
        .mstats-warn.mstats-warn { /* F-0803-27 · e'tibor: bu qoida shu faylda IKKI marta yozilgan (3399 va shu yer) */ margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); border-left: 4px solid #E8A13A; }
        .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
        .mstats-verdict.few { background: rgba(167,166,162,0.12); border-left: 4px solid ${T.ink3}; }
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

        /* ===== ⚡ CODESTRIKE — CTA (yakun sahifasida) ===== */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; background: linear-gradient(135deg, #FFF3EA, #FFE7DC); border: 1px solid #F3D9CC; border-radius: 20px; padding: clamp(16px,2.4vw,22px) clamp(18px,2.6vw,26px); box-shadow: 0 16px 40px -18px rgba(91,61,230,0.28); }
        .qz-cta-txt { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 3px; }
        .qz-cta-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(16px,2.2vw,20px); color: #121826; }
        .qz-cta-s { font-family: 'Manrope'; font-weight: 500; font-size: 13px; color: #525A6B; }
        .qz-cta-btn { background: linear-gradient(170deg,#FF8A3D,#5B3DE6); color: #fff; border: none; border-radius: 14px; padding: 13px 24px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 12px 24px -8px rgba(91,61,230,0.6); transition: transform 0.2s; }
        .qz-cta-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.03); }
        .qz-cta-btn:disabled { background: #E9E6DF; color: #98A0B4; cursor: default; box-shadow: none; }
        .qz-cta.ready .qz-cta-btn { animation: qz-pulse 1.1s ease-in-out infinite; }
        @keyframes qz-pulse { 0%,100% { transform: scale(1); box-shadow: 0 8px 22px -8px rgba(91,61,230,0.7); } 50% { transform: scale(1.06); box-shadow: 0 10px 30px -6px rgba(91,61,230,0.95); } }

        /* ===== ⚡ ARENA — issiq CoddyCamp muhiti ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(91,61,230,0.14) 0%, rgba(91,61,230,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
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
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(91,61,230,0.32)); }
        .qz-wm { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,5vw,46px); letter-spacing: -0.03em; color: #F2ECFF; line-height: 1; text-shadow: 0 0 22px rgba(150,95,255,0.4); }
        .qz-wm-h { color: #FF6A3D; }
        .qz-logo { font-size: clamp(44px,8vw,72px); line-height: 1; }
        .qz-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(22px,4vw,36px); color: #F2ECFF; margin: 0; text-align: center; letter-spacing: -0.02em; text-shadow: 0 0 24px rgba(150,95,255,0.35); }
        .qz-sub { font-family: 'Manrope'; font-size: clamp(13px,1.9vw,16px); color: #B9A8E6; margin: 0; text-align: center; max-width: 540px; line-height: 1.55; font-weight: 500; }
        .qz-sub b { color: #F2ECFF; }
        .qz-dimtxt { color: #8C86A8; font-family: 'Manrope'; font-size: 14px; font-style: italic; }
        .qz-lobby-players { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; max-width: 640px; }
        .qz-pchip { background: rgba(255,255,255,0.06); border: 1.5px solid rgba(186,140,255,0.34); color: #F2ECFF; font-family: 'Manrope'; font-weight: 700; font-size: 14px; border-radius: 99px; padding: 7px 16px; box-shadow: 0 0 18px rgba(124,58,237,0.2); animation: qz-pop 0.4s cubic-bezier(.34,1.5,.4,1); }
        .qz-pchip.me { background: linear-gradient(170deg,#FF8A3D,#5B3DE6); color: #fff; border-color: transparent; box-shadow: 0 0 22px rgba(91,61,230,0.45); }
        @keyframes qz-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .qz-btn { background: linear-gradient(170deg,#FF8A3D,#5B3DE6); color: #fff; border: none; border-radius: 14px; padding: 13px 26px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 14px 26px -10px rgba(91,61,230,0.6), inset 0 2px 0 rgba(255,255,255,0.3); transition: transform 0.18s; }
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
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        /* === .qcode kod-chip (backtick) — CHIP STILI → Dizayn === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode, .qz-opt .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }

        /* === 🎬 TREYLER-MONTAJ (DragDrop) === */
        .dd { display: flex; flex-direction: column; gap: 13px; }
        /* === 📜 TELEPROMPTER — repetitsiyada nutq o'qish uchun (yozish uchun emas) === */
        .tp { background: ${T.paper}; border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 11px; box-shadow: 0 10px 26px -16px rgba(${T.shadowBase},0.22); }
        .tp-h { display: flex; align-items: center; gap: 10px; padding-bottom: 9px; border-bottom: 1px solid ${T.line}; }
        .tp-t { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink3}; }
        .tp-edit { margin-left: auto; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border: none; border-radius: 99px; padding: 6px 13px; cursor: pointer; transition: all 0.16s; }
        .tp-edit:hover { background: ${T.accent}; color: #fff; }
        .tp-row { display: flex; flex-direction: column; gap: 3px; margin: 0; }
        .tp-lb { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; }
        .tp-tx { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(14px,1.9vw,16.5px); line-height: 1.5; color: ${T.ink}; }

        /* === 🎤 NUTQ-KARTASI · MINI — dars o'rtasida faqat holat ko'rinadi === */
        .pcm { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; background: ${T.paper}; border-radius: 12px; padding: 10px 13px; box-shadow: 0 6px 16px -11px rgba(${T.shadowBase},0.18); }
        .pcm-h { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; }
        .pcm-pills { display: flex; flex-wrap: wrap; gap: 5px; flex: 1; min-width: 0; }
        .pcm-pill { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 10.5px; color: ${T.ink3}; background: ${T.bg}; border-radius: 99px; padding: 4px 9px; white-space: nowrap; transition: all 0.25s; }
        .pcm-pill.on { color: #fff; background: var(--pcc); }
        .pcm-n { font-size: 11px; color: ${T.ink3}; font-weight: 700; }

        /* === 🎤 NUTQ-KARTASI — bo'lak to'lganda yonadi === */
        .pc-row { transition: opacity .2s; }
        .pc-row.lit { animation: pc-light 0.5s cubic-bezier(.2,.8,.25,1) both; }
        @keyframes pc-light { 0% { opacity: 0; transform: translateY(7px) scale(0.99); filter: brightness(1.9); } 55% { filter: brightness(1.35); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: brightness(1); } }

        /* === ⏱️ VAQT-CHIZIG'I — 3 daqiqa 6 bo'lakka bo'linadi === */
        .tl { display: flex; gap: 5px; position: relative; align-items: stretch; }
        .tl-seg { display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 8px 7px 9px; border-radius: 11px; background: ${T.paper}; box-shadow: 0 5px 14px -9px rgba(${T.shadowBase},0.18); transition: all 0.3s; }
        .tl-bar { display: block; height: 5px; border-radius: 99px; background: var(--tlc); opacity: 0.35; transition: opacity 0.3s, height 0.3s; }
        .tl-lb { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11px; color: ${T.ink2}; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; }
        .tl-t { font-size: 10px; color: ${T.ink3}; }
        .tl.big .tl-seg { padding: 12px 11px 13px; }
        .tl.big .tl-lb { font-size: 12.5px; color: ${T.ink}; }
        .tl.big .tl-bar { height: 7px; }
        .tl-seg.now { background: ${T.bg}; box-shadow: inset 0 0 0 2px var(--tlc), 0 10px 22px -10px rgba(${T.shadowBase},0.28); transform: translateY(-2px); }
        .tl-seg.now .tl-bar { opacity: 1; height: 8px; }
        .tl-seg.now .tl-lb { color: var(--tlc); }
        .tl-run { position: absolute; top: -3px; bottom: -3px; width: 2px; background: ${T.accent}; border-radius: 99px; box-shadow: 0 0 8px 1px rgba(91,61,230,0.5); transition: left 1s linear; }

        /* === 🎤 MIKROFON-QUTISI === */
        .mic-box { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 14px; padding: 14px 16px; box-shadow: 0 8px 22px -12px rgba(${T.shadowBase},0.2); }
        .mic-head { display: flex; align-items: center; gap: 8px; }
        .mic-title { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .mic-live { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 700; color: ${T.accent}; }
        .mic-dot { width: 9px; height: 9px; border-radius: 50%; background: ${T.accent}; animation: mic-pulse 1.1s ease-in-out infinite; }
        @keyframes mic-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.78); } }
        .mic-hint { font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.ink2}; margin: 0; line-height: 1.45; }
        .mic-note { font-family: 'Manrope', sans-serif; font-size: 11.5px; color: ${T.ink3}; margin: 0; }
        .mic-audio { width: 100%; height: 36px; }
        .mic-stop { color: ${T.accent}; font-weight: 700; }

        /* === 🎬 SAHNA-TAYMERI === */
        .stg { display: flex; flex-direction: column; gap: 11px; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 26px -14px rgba(${T.shadowBase},0.24); }
        .stg-top { display: flex; align-items: center; gap: 13px; flex-wrap: wrap; }
        .stg-clock { font-family: 'Fraunces', serif; font-size: 34px; line-height: 1; min-width: 74px; font-variant-numeric: tabular-nums; transition: color 0.3s; }
        .stg-say { flex: 1; min-width: 130px; display: flex; flex-direction: column; gap: 2px; }
        .stg-lbl { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; }
        .stg-now { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; transition: color 0.3s; }

        /* === ✍️ YOZUV-MAYDONLARI === */
        .fld { background: ${T.paper}; border-radius: 13px; padding: 12px 14px; box-shadow: 0 6px 16px -9px rgba(${T.shadowBase},0.16); display: flex; flex-direction: column; gap: 8px; }
        .fld-h { display: flex; align-items: center; gap: 9px; }
        .fld-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .fld-sec { margin-left: auto; font-size: 11px; color: ${T.ink3}; }
        .fld-note { font-family: 'Manrope', sans-serif; font-size: 12px; color: ${T.ink2}; margin: 0; line-height: 1.4; }
        .fld-ta, .fld-inp { width: 100%; font-family: 'Source Serif 4', Georgia, serif; font-size: 13.5px; color: ${T.ink}; background: ${T.bg}; border: none; border-radius: 9px; padding: 9px 11px; outline: none; line-height: 1.45; box-sizing: border-box; }
        .fld-ta { resize: vertical; min-height: 40px; }
        .fld-inp { font-size: 13px; }
        .fld-ta:focus, .fld-inp:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
        .samp { display: flex; flex-wrap: wrap; gap: 6px; }
        .samp-chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: ${T.bg}; border: none; border-radius: 99px; padding: 7px 12px; cursor: pointer; transition: all 0.16s; text-align: left; }
        .samp-chip:hover { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}44; }
        .samp-chip.on { background: ${T.accentSoft}; color: ${T.accent}; }
        .samp-line { font-family: 'Source Serif 4', Georgia, serif; font-style: italic; font-size: 13.5px; color: ${T.ink}; margin: 0; padding: 9px 12px; background: ${T.bg}; border-radius: 9px; }

        /* === 🔍 SAYT TURI + MUAMMO-QIDIRUV === */
        .kind-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
        .kind-card { display: flex; align-items: center; gap: 9px; text-align: left; cursor: pointer; border: none; border-radius: 12px; padding: 12px 12px; background: ${T.paper}; box-shadow: 0 6px 16px -9px rgba(${T.shadowBase},0.16); transition: all 0.18s; }
        .kind-card:hover { transform: translateY(-1px); }
        .kind-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -8px rgba(91,61,230,0.24); }
        .kind-ic { font-size: 21px; line-height: 1; }
        .kind-nm { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; color: ${T.ink}; }
        .pf-row { display: flex; flex-direction: column; gap: 7px; }
        .pf-q { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.ink}; margin: 0; }
        .pf-opts { display: flex; flex-wrap: wrap; gap: 7px; }
        .pf-chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; transition: all 0.16s; box-shadow: 0 4px 12px -7px rgba(${T.shadowBase},0.2); text-align: left; }
        .pf-chip:hover { transform: translateY(-1px); }
        .pf-chip.on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -6px rgba(91,61,230,0.42); }
        .pf-chip.own { color: ${T.ink2}; font-style: italic; }
        .pf-input { width: 100%; font-family: 'Source Serif 4', Georgia, serif; font-size: 13px; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 9px; padding: 9px 12px; outline: none; box-shadow: inset 0 0 0 1.5px ${T.accent}55; box-sizing: border-box; }
        .pf-row { background: ${T.paper}; border-radius: 13px; padding: 13px 15px; box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.16); transition: box-shadow 0.25s; }
        .pf-row.done { box-shadow: inset 0 0 0 1.5px ${T.success}55, 0 6px 16px -10px rgba(18,169,104,0.18); }
        .pf-n { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; margin-right: 8px; }
        .pf-row.done .pf-n { background: ${T.successSoft}; color: ${T.success}; }

        /* === 💬 BIR JUMLALI NAMUNA (tanish ilovalar) === */
        .one-strip { display: flex; flex-wrap: wrap; gap: 7px; }
        .one-tab { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; background: ${T.paper}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; transition: all 0.16s; box-shadow: 0 4px 12px -8px rgba(${T.shadowBase},0.2); }
        .one-tab:hover { transform: translateY(-1px); }
        .one-tab.on { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 6px 14px -8px rgba(91,61,230,0.3); }
        .one-line.one-line { font-family: 'Source Serif 4', Georgia, serif; font-style: italic; font-size: clamp(15px,2.1vw,18px); line-height: 1.5; color: ${T.ink}; margin: 0; padding: 15px 18px; background: ${T.paper}; border-radius: 14px; border-left: 4px solid ${T.accent}; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.2); }

        /* === 🖥️ JONLI DEMO — 3 qadam (bosilganda ochiladi) === */
        .dstep-list { display: flex; flex-direction: column; gap: 10px; }
        .dstep { display: flex; align-items: flex-start; gap: 13px; text-align: left; width: 100%; border: none; cursor: pointer; border-radius: 14px; padding: 15px 17px; background: ${T.paper}; box-shadow: 0 7px 18px -11px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
        .dstep:hover { transform: translateY(-1px); }
        .dstep.on { cursor: default; box-shadow: inset 0 0 0 1.5px var(--dsc), 0 10px 24px -14px rgba(${T.shadowBase},0.26); }
        .dstep-n { flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; color: #fff; background: ${T.ink3}; transition: background 0.25s; }
        .dstep.on .dstep-n { background: var(--dsc); }
        .dstep-col { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        .dstep-lb { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,15.5px); color: ${T.ink}; }
        .dstep-body { font-family: 'Manrope', sans-serif; font-size: 13px; line-height: 1.5; color: ${T.ink2}; }
        .fld-opt { margin-left: auto; font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; color: ${T.ink3}; background: ${T.bg}; border-radius: 99px; padding: 3px 9px; }

        /* === ⚡ JS FARQI (ikki tugma) === */
        .js-demo { display: flex; gap: 10px; }
        .js-half { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; background: ${T.paper}; border-radius: 13px; padding: 13px; box-shadow: 0 6px 16px -9px rgba(${T.shadowBase},0.16); }
        .js-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink3}; }
        .js-tag.live { color: ${T.success}; }
        .js-btn { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; border: none; border-radius: 9px; padding: 9px 14px; cursor: pointer; transition: all 0.16s; }
        .js-btn.dead { background: ${T.bg}; color: ${T.ink2}; }
        .js-btn.dead:active { transform: scale(0.97); }
        .js-btn.live { background: ${T.success}; color: #fff; }
        .js-btn.live:active { transform: scale(0.94); }
        .js-out { font-family: 'Manrope', sans-serif; font-size: 12px; color: ${T.ink2}; margin: 0; min-height: 17px; }

        /* === 👨‍👩‍👦 SAVOL-JAVOB KARTALARI === */
        .qa-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 11px; }
        .qa-card { background: ${T.paper}; border-radius: 14px; padding: 13px 15px; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 6px 18px -10px rgba(${T.shadowBase},0.18); transition: box-shadow 0.25s; }
        .qa-card.ok { box-shadow: inset 0 0 0 1.5px ${T.success}55, 0 6px 18px -10px rgba(18,169,104,0.2); }
        .qa-q { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: 15px; color: ${T.ink}; margin: 0; }
        .qa-opts { display: flex; flex-direction: column; gap: 7px; }
        .qa-opt { font-family: 'Source Serif 4', Georgia, serif; font-size: 12.5px; color: ${T.ink}; text-align: left; background: ${T.bg}; border: none; border-radius: 9px; padding: 9px 11px; cursor: pointer; transition: all 0.16s; line-height: 1.4; }
        .qa-opt:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}44; }
        .qa-opt:disabled { cursor: default; opacity: 0.5; }
        .qa-opt.good { background: ${T.successSoft}; color: ${T.success}; font-weight: 600; opacity: 1 !important; }
        .qa-opt.bad { background: ${T.accentSoft}; color: ${T.accent}; }
        .qa-why { font-family: 'Manrope', sans-serif; font-size: 12px; color: ${T.accent}; margin: 0; line-height: 1.45; }
        .qa-ok { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; color: ${T.success}; margin: 0; }

        /* === 🎤 REPETITSIYA: bo'lak-kartalari + o'z-o'zini baholash === */
        .bk { background: ${T.paper}; border-radius: 12px; padding: 11px 13px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 6px 16px -9px rgba(${T.shadowBase},0.16); transition: box-shadow 0.2s; }
        .bk.ok { box-shadow: inset 0 0 0 1.5px ${T.success}, 0 6px 16px -9px rgba(18,169,104,0.16); }
        .bk-h { display: flex; align-items: center; gap: 8px; }
        .bk-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: ${T.ink}; }
        .bk-sec { margin-left: auto; font-size: 10.5px; color: ${T.ink3}; }
        .selfck { background: ${T.paper}; border-radius: 13px; padding: 12px 14px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.18); }
        .selfck-h { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: ${T.ink}; margin: 0 0 2px; }
        .selfck-row { display: flex; align-items: center; gap: 9px; font-family: 'Manrope', sans-serif; font-size: 12.5px; color: ${T.ink2}; background: transparent; border: none; cursor: pointer; text-align: left; padding: 4px 0; transition: color 0.16s; }
        .selfck-row.on { color: ${T.success}; font-weight: 600; }
        .selfck-box { width: 19px; height: 19px; border-radius: 6px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #fff; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.ink3}66; transition: all 0.18s; }
        .selfck-row.on .selfck-box { background: ${T.success}; box-shadow: none; }

        /* === 🎬 DEMO DAY CHEKLISTI (yakun) === */
        .dd-card { background: ${T.paper}; border-radius: 16px; padding: 15px 18px; box-shadow: 0 10px 26px -14px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 9px; }
        .dd-card-h { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .dd-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .dd-list li { font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.ink}; line-height: 1.45; }
        .dd-note { font-family: 'Manrope', sans-serif; font-size: 11.5px; color: ${T.ink2}; margin: 0; }
        .dd-link { font-size: 11.5px; color: ${T.ink3}; font-weight: 500; }

        /* === 🃏 FLASHCARDS (3D flip) === */
        .fc-center { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding-top: 4px; }
        .fc { display: flex; flex-direction: column; gap: 11px; max-width: 520px; width: 100%; }
        .fc-top { display: flex; justify-content: space-between; align-items: center; }
        .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
        .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
        .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
        .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
        @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
        .fc-bar { height: 7px; background: #E8E4DC; border-radius: 99px; overflow: hidden; }
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #FF8A3D, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
        .fc-cardwrap { perspective: 1200px; position: relative; }
        .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid #E8E4DC; z-index: -1; }
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
        @keyframes fc-stamp { from { transform: translate(-50%,-50%) scale(0); } }
        .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .fc-card.flip { transform: rotateY(180deg); }
        .fc-card:not(.flip):hover { transform: translateY(-3px); }
        .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
        .fc-front { background: ${T.paper}; border: 2px solid #E8E4DC; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, #FF8A3D, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(91,61,230,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; }
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
        .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid #E8E4DC; color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
        .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
        .fc-done-emoji { font-size: 40px; }
        .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
        .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }

        /* === 🏅 NISHON — yuqori panel hisoblagichi + to'liq-ekran bayram === */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid #E8E4DC; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(91,61,230,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(91,61,230,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(91,61,230,0); } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 232px; background: ${T.paper}; border: 1px solid #E8E4DC; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        /* === Jonli-dars xabari — sekundar UI, xira (11.15) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }
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

        /* Summary — 🏅 nishonlar kolleksiyasi */


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

        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } .fc-fly, .acu-medal, .acu-rays, .mic-dot, .pc-row.lit { animation: none !important; } .pc-row.lit { opacity: 1 !important; transform: none !important; filter: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
          <div className="lesson-root">
            {live.mode === 'choosing' ? (
              <LiveGate live={live} title={{ uz: '1-Modul', ru: 'Модуль 1' }} />
            ) : (
              <>
                <Current screen={screen} storedAnswer={answers[screen]} answers={answers} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
                <LiveBadge live={live} total={TOTAL_SCREENS} />
                {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
              </>
            )}
          </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>
  );
}
