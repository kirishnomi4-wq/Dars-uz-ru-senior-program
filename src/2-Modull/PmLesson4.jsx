import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';

// ============================================================
// PM M2-D2 — MUAMMODAN YECHIMGA: har imkoniyat qaysi qiyinchilikni yo'qotadi?
// 2-TUR (sof PM): o'quvchi O'Z artefaktini yozadi — 3 juftlik-karta (qiyinchilik ↔ imkoniyat).
// Kirish-artefakt: pm-m1d2-cards (M1-D2 auditoriya-kartasi) · Chiqish: pm-m2d2-features.
// Misol-ipi: savdo markazidagi kinoteatr sayti. Keys: Uzum (faqat keys-ekranida).
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================
// 🎨 PM-STUDIA IDENTITET (PM_DARS_ETALON 1-bo'lim) — barcha PM darslar shu palitrada.
// Texnik darslar (Htmllesson/JsIntro) dekori bu yerga KO'CHIRILMAYDI (F-0730-06).
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB', link: '#5B3DE6',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  // 🟠 Amber — PM slot-semantikasi (P0 bilan bir xil qiymatlar). Bu darsda amber = QIYINCHILIK,
  // yashil (success) = IMKONIYAT. Ikkovi s1·s2·s4·s8·s10·s11·yakunda AYNAN shu juftlikda qoladi.
  amber: '#E8A13A', amberInk: '#B77A16', amberSoft: '#FBEED6',
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

// ===== IKONKALAR — abstrakt tushunchalar uchun toza chiziq =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  problem: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.4 2.4 0 1 1 3.3 2.2c-.7.4-1 .9-1 1.7" /><path d="M12 16.7h.01" /></svg>),
  solution: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv}><path d="M9.5 18h5" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-3.8 10.7c.7.6 1 1.1 1 1.8h5.6c0-.7.3-1.2 1-1.8A6 6 0 0 0 12 3z" /></svg>),
  arrow: (s = 22) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={1.9}><path d="M4 12h14" /><path d="M13 6l6 6-6 6" /></svg>),
  check: (s = 18) => (<svg viewBox="0 0 24 24" width={s} height={s} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>)
};

// ============================================================ PM DARS META (M2-D2)
const LESSON_META = { lessonId: 'pm-m2d2-v1', lessonTitle: { uz: 'Muammodan yechimga', ru: 'От проблемы к решению' } };
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'koding',      template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's13', type: 'reflection',  template: 'custom',   scored: false, scope: null },
  // F-0803-04 — YAKUN-TUZILMASI ETALONGA QAYTARILDI (PmLesson2 · P0 PmUserStory):
  // koding → G'OLIBLAR (podium) → FLASHCARD → YAKUN (CodeStrike + uyga vazifa BIR sahifada).
  // Ilgari uy-vazifa (s14) va arena (s16) alohida ekran edi va flashcard arenadan KEYIN qolgan —
  // ikkovi ham summary ichiga qaytarildi. `id` lar ATAYLAB o'zgartirilmadi: ular jonli-server
  // yozuvlariga (submitAnswer) kalit bo'ladi; raqam-uzilishi (s14/s16 yo'q) faqat kosmetik.
  { id: 's15', type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 's17', type: 'flashcard',   template: 'custom',   scored: false, scope: null },
  { id: 's18', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// 🏅 NISHONLAR — faqat REAL tekshiriladigan harakatga
const AchCtx = createContext(null); // olingan nishonlar (Set) — Stage hisoblagichi uchun
const ACHIEVEMENTS = {
  pairFinder: { icon: '🔎', name: 'Pair Finder!', desc: { uz: "Imkoniyatlarni qiyinchiliklarga bog'ladingiz", ru: "Вы связали возможности с трудностями" } },
  matchMaster: { icon: '🧲', name: 'Match Master!', desc: { uz: "Uchala imkoniyatni o'z qiyinchiligiga qo'ydingiz", ru: 'Вы поставили все три возможности к своей трудности' } },
  cardWriter: { icon: '📝', name: 'Card Writer!', desc: { uz: "Uchta juftlik-kartangizni yozib bo'ldingiz", ru: 'Вы дописали все три карточки-пары' } },
  pageMaker: { icon: '🧱', name: 'Page Maker!', desc: { uz: "Juftliklarni ko'rsatadigan kodni yozdingiz", ru: "Вы написали код, который показывает пары" } },
};
// Ekran id → nishon (recordAnswer'da correct:true bo'lganda avtomatik beriladi).
const ACH_TRIGGERS = { s2: 'pairFinder', s4: 'matchMaster', s8: 'cardWriter', s11: 'pageMaker' };

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
// RECAPS — 4 scored test (indeks 3, 5, 9, 12) uchun qayta-tushuntirish kartalari.
const RECAPS = {
  3: {
    title: { uz: 'Imkoniyat qayerdan boshlanadi', ru: 'С чего начинается возможность' },
    cards: [
      { ic: '🎯', h: { uz: 'Avval savol, keyin ish', ru: 'Сначала вопрос, потом работа' }, body: { uz: 'Har imkoniyat bitta savoldan boshlanadi: bu kimning qaysi qiyinchiligini yo\'qotadi? Javob topilmasa, imkoniyat ro\'yxatga kirmaydi.', ru: 'Каждая возможность начинается с одного вопроса: чью и какую трудность она убирает? Если ответа нет — возможность в список не попадает.' }, vis: { uz: <RcFlow items={['Imkoniyat', 'qaysi qiyinchilik?', "ro'yxatga kiradi"]} />, ru: <RcFlow items={['Возможность', 'какая трудность?', 'попадает в список']} /> }, ask: { uz: 'Fon musiqasi kimning qaysi qiyinchiligini yo\'qotadi?', ru: 'Чью и какую трудность убирает фоновая музыка?' } },
    ],
  },
  5: {
    title: { uz: 'Egasiz imkoniyat', ru: 'Возможность без хозяина' },
    cards: [
      { ic: '❓', h: { uz: 'Nega bir kartaga joy topilmadi', ru: 'Почему одной карточке не нашлось места' }, body: { uz: 'Sudrash mashqida uch qiyinchilikka uch javob topildi. To\'rtinchi kartaga qiyinchilik topilmadi — shuning uchun u joysiz qoldi.', ru: 'В упражнении с перетаскиванием у трёх трудностей нашлись три ответа. Для четвёртой карточки трудности не нашлось — поэтому она осталась без места.' }, ask: { uz: 'To\'rtinchi kartani qanday o\'zgartirsak, unga ham qiyinchilik topiladi?', ru: 'Как изменить четвёртую карточку, чтобы и ей нашлась трудность?' } },
    ],
  },
  9: {
    title: { uz: 'Juftlik qanday yoziladi', ru: 'Как пишется пара' },
    cards: [
      { ic: '↔️', h: { uz: 'Chap tomon va o\'ng tomon', ru: 'Левая сторона и правая' }, body: { uz: 'Chapda — odamning qiyinchiligi, o\'ngda — sayt nima qilishi. O\'ng tomon harakat bilan yoziladi va chap tomonni to\'g\'ridan-to\'g\'ri yo\'qotadi.', ru: 'Слева — трудность человека, справа — что делает сайт. Правая сторона пишется действием и напрямую убирает левую.' }, vis: { uz: <RcFlow items={['Qiyinchilik', 'imkoniyat', 'harakat bilan']} />, ru: <RcFlow items={['Трудность', 'возможность', 'через действие']} /> } },
    ],
  },
  12: {
    title: { uz: 'Yangi so\'rov kelganda', ru: 'Когда приходит новая просьба' },
    cards: [
      { ic: '🙋', h: { uz: 'So\'rov hali imkoniyat emas', ru: 'Просьба — ещё не возможность' }, body: { uz: 'So\'rov hali imkoniyat emas. Avval u qaysi qiyinchilikka javob berishi so\'raladi, keyin ro\'yxatga kiritiladi.', ru: 'Просьба — ещё не возможность. Сначала спрашивают, на какую трудность она отвечает, и только потом вносят в список.' }, ask: { uz: 'Kinoteatr egasi yangi narsa so\'rasa, birinchi savolingiz qanday bo\'ladi?', ru: 'Если владелец кинотеатра просит что-то новое — каким будет ваш первый вопрос?' } },
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
// F-0802-11: test SAVOLI sarlavha emas — `h-title` (38px / lh 1.1) 12-20 so'zlik savolda
// qatorlarni bir-biriga yopishtiradi. `h-ask` — arena (`.qz-q`) o'lchoviga tenglashtirilgan.
const Q = ({ children, max = 760 }) => <h2 className="title h-ask fade-up" style={{ maxWidth: max }}>{children}</h2>;

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

// mentor ekrani proyektorda ko'rinadi — eslatma DEFAULT YOPIQ xira chip; bir bosishda
// ochiladi, yana bosishda yopiladi; ekran almashganda komponent unmount bo'lib o'zi yopiladi.
const MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [open, setOpen] = useState(false);
  if (!live || live.mode !== 'mentor') return null;
  if (!open) return (
    <button type="button" className="mnote-chip" onClick={() => setOpen(true)} title={tr({ uz: 'Mentorga eslatma — bosib oching', ru: 'Заметка ментору — нажмите, чтобы открыть' })}>{tr({ uz: '📋 Eslatma', ru: '📋 Заметка' })}</button>
  );
  return (
    <div className="mnote fade-up" onClick={() => setOpen(false)} title={tr({ uz: 'Yopish uchun bosing', ru: 'Нажмите, чтобы закрыть' })}>
      <span className="mnote-lbl">{tr({ uz: '🧑‍🏫 Mentorga eslatma', ru: '🧑‍🏫 Заметка ментору' })}<span className="mnote-x">{tr({ uz: '✕ yopish', ru: '✕ закрыть' })}</span></span>
      <p className="mnote-body">{children}</p>
    </div>
  );
};

// ===== DARS-XOTIRASI (lesson-scoped kalitlar) =====
const HOOK_KEY = 'pm-m2d2-hook-choice';       // s0 tanlovi — s6 keysida qaytariladi (33-qonun)
const PICKED_KEY = 'pm-m2d2-picked';          // s7 da belgilangan 3 qiyinchilik
const FEATURES_KEY = 'pm-m2d2-features';      // CHIQISH-ARTEFAKT: [{qiyinchilik, imkoniyat}]
const REFLECT_KEY = 'pm-m2d2-reflection';     // s13 bir qatorlik yozuv
const M1_CARDS_KEY = 'pm-m1d2-cards';         // KIRISH-ARTEFAKT: M1-D2 auditoriya-kartasi
const lsRead = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsWrite = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const readFeatures = () => { const a = lsRead(FEATURES_KEY); return Array.isArray(a) ? a.filter(c => c && c.qiyinchilik && c.imkoniyat) : []; };

// Zaxira qiyinchiliklar (kinoteatr sayti) — M1 kartasi bo'lmasa ham dars to'xtamaydi (40-qonun)
const FALLBACK_PAINS = [
  { uz: 'Do\'stlar qaysi film qachon boshlanishini bilmaydi', ru: 'Друзья не знают, когда начинается фильм' },
  { uz: 'Zalda bo\'sh joy bormi — bilmasdan boradi', ru: 'Идут, не зная, есть ли в зале свободные места' },
  { uz: 'Chiptani qayerdan olishni bilmaydi', ru: 'Не знает, где взять билет' }
];

// ===== SCREEN 0 — HOOK: ikki ro'yxat yonma-yon, ovoz berish =====
const HOOK_LISTS = [
  {
    id: 'A', name: { uz: 'A-sayt', ru: 'Сайт А' },
    items: [
      { ic: '🎵', t: { uz: 'baland fon musiqasi', ru: 'громкая фоновая музыка' } },
      { ic: '🔄', t: { uz: 'aylanadigan katta logotip', ru: 'большой вращающийся логотип' } },
      { ic: '✨', t: { uz: 'miltillaydigan animatsiya', ru: 'мигающая анимация' } },
      { ic: '📜', t: { uz: '5 sahifalik «biz haqimizda»', ru: '«о нас» на 5 страниц' } }
    ]
  },
  {
    id: 'B', name: { uz: 'B-sayt', ru: 'Сайт Б' },
    items: [
      { ic: '🕒', t: { uz: 'seans jadvali', ru: 'расписание сеансов' } },
      { ic: '💺', t: { uz: 'zal xaritasi', ru: 'карта зала' } },
      { ic: '⭐', t: { uz: 'bugungi mashhur filmlar', ru: 'популярные фильмы сегодня' } },
      { ic: '🎟', t: { uz: 'onlayn chipta', ru: 'билет онлайн' } }
    ]
  }
];
// Payoff — «band → u javob beradigan savol». Atama («imkoniyat/feature») bu yerda
// ATAYLAB yo'q: u 1-ekranda beriladi (hodisa avval, atama keyin). F-0802-10.
const HOOK_PAYOFF = [
  { feat: { uz: 'Seans jadvali', ru: 'Расписание сеансов' }, q: { uz: '«Film qachon boshlanadi?»', ru: '«Когда начинается фильм?»' } },
  { feat: { uz: 'Zal xaritasi', ru: 'Карта зала' }, q: { uz: "«Bo'sh joy bormi?»", ru: '«Есть ли свободные места?»' } },
  { feat: { uz: 'Mashhur filmlar', ru: 'Популярные фильмы' }, q: { uz: '«Qaysi filmni tanlasam?»', ru: '«Какой фильм выбрать?»' } },
  { feat: { uz: 'Onlayn chipta', ru: 'Билет онлайн' }, q: { uz: '«Chiptani qayerdan olaman?»', ru: '«Где взять билет?»' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [pick, setPick] = useState(() => (storedAnswer && storedAnswer.pick) || null);
  const choose = (id) => {
    if (pick) return;
    setPick(id);
    lsWrite(HOOK_KEY, id);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, pick: id, picked: true });
  };
  const waveOn = useTurnHint(!pick);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Начало' })} screen={screen} navContent={<><span /><NavNext disabled={!pick} label={pick ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Bitta ro\'yxatni tanlang', ru: 'Выберите один список' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaysi sayt <span className="italic" style={{ color: T.accent }}>ko'proq chipta</span> sotadi?</>, ru: <>Какой сайт продаст <span className="italic" style={{ color: T.accent }}>больше билетов</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Tasavvur qiling: bitta kinoteatr uchun ikkita turli sayt tayyorlandi. Quyida har birida nima borligi yozilgan — o'qing va sizningcha ko'proq chipta sotadiganini tanlang.</>, ru: <>Представьте: для одного кинотеатра сделали два разных сайта. Ниже написано, что есть на каждом — прочитайте и выберите тот, который, по-вашему, продаст больше билетов.</> })}</Mentor>
        <div className="hk-row fade-up delay-1">
          {HOOK_LISTS.map((l, i) => (
            <button key={l.id} className={`hk-card ${pick === l.id ? 'picked' : ''} ${pick && pick !== l.id ? 'dim' : ''}${!pick && waveOn ? ' turn-ring' : ''}`} disabled={!!pick} onClick={() => choose(l.id)}>
              <span className="hk-name">{tr(l.name)}</span>
              <span className="hk-items">
                {l.items.map((it, k) => <span key={k} className="hk-it"><i>{it.ic}</i>{tr(it.t)}</span>)}
              </span>
              <span className="hk-vote">{pick === l.id ? tr({ uz: '✓ Sizning ovozingiz', ru: '✓ Ваш голос' }) : tr({ uz: 'Shuni tanlayman', ru: 'Выбираю этот' })}</span>
            </button>
          ))}
        </div>
        {pick && (
          <div className="frame-soft fade-step">
            <p className="body" style={{ margin: '0 0 9px' }}>{tr({ uz: <>B-saytdagi <b style={{ color: T.ink }}>har bir band</b> odamning bitta savoliga javob beradi:</>, ru: <>Каждый пункт сайта Б отвечает на <b style={{ color: T.ink }}>один вопрос</b> человека:</> })}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {HOOK_PAYOFF.map((p, i) => (
                <p key={i} className="body" style={{ margin: 0, color: T.ink2 }}><b style={{ color: T.ink }}>{tr(p.feat)}</b> → {tr(p.q)}</p>
              ))}
            </div>
            <p className="body" style={{ margin: '9px 0 0' }}>{tr({ uz: <>A-saytdagilar esa hech qanday savolga javob bermaydi.</>, ru: <>А пункты сайта А не отвечают ни на один вопрос.</> })}</p>
          </div>
        )}
        <MentorNote>{tr({ uz: "Ovozlar bo'linib ketsa muhokamani cho'zmang — payoff-qator o'zi ochadi. «A» degan o'quvchiga qarshi chiqmang: uning tanlovi keys ekranida qaytariladi.", ru: 'Если голоса разделились, не затягивайте обсуждение — строка-ответ откроется сама. Не спорьте с теми, кто выбрал «А»: их выбор вернётся на экране с кейсом.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD: jonli natija-preview «juftlik-lenta» =====
// WOW: dars natijasi o'quvchi ko'z oldida o'zi yozilib chiqadi (CSS-taymlayn; reduced-motion'da darhol).
const DEMO_PAIRS = [
  { pain: { uz: 'Film qachon boshlanishini bilmaydi', ru: 'Не знает, когда начинается фильм' }, feat: { uz: 'Seans jadvali sahifaning tepasida turadi', ru: 'Расписание сеансов стоит наверху страницы' } },
  { pain: { uz: 'Zalda bo\'sh joy bormi — bilmaydi', ru: 'Не знает, есть ли в зале свободные места' }, feat: { uz: 'Zal xaritasi bo\'sh joylarni ko\'rsatadi', ru: 'Карта зала показывает свободные места' } },
  { pain: { uz: 'Film qiziq bo\'ladimi — bilmaydi', ru: 'Не знает, будет ли фильм интересным' }, feat: { uz: 'Treyler saytning o\'zida ochiladi', ru: 'Трейлер открывается прямо на сайте' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Dars oxirida saytning har bandi <span className="italic" style={{ color: T.accent }}>kimga kerakligini</span> yozib olasiz</>, ru: <>К концу урока вы запишете, <span className="italic" style={{ color: T.accent }}>кому нужен</span> каждый пункт сайта</> })}</h2></div>
      <Mentor>{tr({ uz: <>Sayt beradigan har bir aniq foyda — <b style={{ color: T.ink }}>imkoniyat</b> (feature) deyiladi. Bugun har imkoniyatni o'z qiyinchiligiga qo'shib yozasiz — quyida namunasi o'z-o'zidan yozilib chiqadi.</>, ru: <>Каждая конкретная польза, которую даёт сайт, называется <b style={{ color: T.ink }}>возможность</b> (feature). Сегодня вы запишете каждую возможность вместе с её трудностью — образец ниже напишется сам.</> })}</Mentor>
      <div className="jl fade-up delay-1">
        {DEMO_PAIRS.map((p, i) => (
          <div key={i} className="jl-row" style={{ '--rd': `${0.25 + i * 0.55}s` }}>
            <span className="jl-n">{i + 1}</span>
            <span className="jl-pain" style={{ '--fd': `${0.45 + i * 0.55}s` }}>{tr(p.pain)}</span>
            <span className="jl-link" style={{ '--fd': `${0.75 + i * 0.55}s` }} aria-hidden="true">↔</span>
            <span className="jl-feat" style={{ '--fd': `${0.9 + i * 0.55}s` }}>{tr(p.feat)}</span>
          </div>
        ))}
      </div>
      <div className="takeaway fade-up delay-2"><span className="ta-bulb">🎯</span><p className="ta-h">{tr({ uz: 'Dars oxirida sizning uch juftligingiz ham shunday yozilgan bo\'ladi.', ru: 'К концу урока ваши три пары будут записаны точно так же.' })}</p></div>
    </div>
  </Stage>
);

// ===== SCREEN 2 — YADRO: 4 imkoniyat kartasi, bosilsa qaysi qiyinchilikni yo'qotishi ochiladi =====
const OPEN_CARDS = [
  { id: 'jadval', ic: '🕒', t: { uz: 'Seans jadvali', ru: 'Расписание сеансов' }, pain: { uz: 'Do\'stlar qaysi film qachon boshlanishini bilmaydi', ru: 'Друзья не знают, когда начинается фильм' }, empty: false },
  { id: 'joylar', ic: '💺', t: { uz: 'Zal xaritasi', ru: 'Карта зала' }, pain: { uz: 'Zalda bo\'sh joy bormi — bilmasdan boradi', ru: 'Идут, не зная, есть ли в зале свободные места' }, empty: false },
  { id: 'chipta', ic: '🎟', t: { uz: 'Onlayn chipta', ru: 'Билет онлайн' }, pain: { uz: 'Chiptani qayerdan olishni bilmaydi', ru: 'Не знает, где взять билет' }, empty: false },
  { id: 'musiqa', ic: '🎵', t: { uz: 'Fon musiqasi', ru: 'Фоновая музыка' }, pain: { uz: 'Hech kimning qiyinchiligini yo\'qotmaydi', ru: 'Не убирает ничью трудность' }, empty: true }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [open, setOpen] = useState({});   // hozir ochiq turgani (qayta bosilsa yopiladi)
  const [seen, setSeen] = useState(() => (storedAnswer && storedAnswer.seen) || []);
  const allSeen = seen.length >= OPEN_CARDS.length;
  const toggle = (id) => {
    setOpen(p => ({ ...p, [id]: !p[id] }));
    setSeen(p => (p.includes(id) ? p : [...p, id]));
  };
  useEffect(() => {
    if (allSeen && storedAnswer === undefined) onAnswer(screen, { stage: 'exploration', screenIdx: screen, seen, correct: true, picked: true });
  }, [allSeen]); // eslint-disable-line
  const pending = OPEN_CARDS.filter(c => !seen.includes(c.id)).map(c => c.id);
  const lit = useTurnWalk(pending, !allSeen);
  return (
    <Stage eyebrow={tr({ uz: 'Qaysi qiyinchilikka', ru: 'К какой трудности' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!allSeen} label={allSeen ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Kartalarni oching (${seen.length}/4)`, ru: `Откройте карточки (${seen.length}/4)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bu imkoniyat kimning <span className="italic" style={{ color: T.accent }}>qaysi qiyinchiligini</span> yo'qotadi?</>, ru: <>Чью и <span className="italic" style={{ color: T.accent }}>какую трудность</span> убирает эта возможность?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Kinoteatr saytiga to'rtta imkoniyat taklif qilindi. Har birini bosing — ostida u qaysi qiyinchilikni yo'qotishi ochiladi.</>, ru: <>Сайту кинотеатра предложили четыре возможности. Нажмите на каждую — под ней откроется, какую трудность она убирает.</> })}</Mentor>
        <div className="oc-grid fade-up delay-1">
          {OPEN_CARDS.map(c => (
            <div key={c.id} className={`oc ${open[c.id] ? 'on' : ''} ${seen.includes(c.id) ? 'seen' : ''}`}>
              <button className={`oc-top${turnCls(lit, c.id, pending.length > 1)}`} onClick={() => toggle(c.id)} aria-expanded={!!open[c.id]}>
                <span className="oc-ic">{c.ic}</span>
                <span className="oc-t">{tr(c.t)}</span>
                <span className="oc-arw">{open[c.id] ? '▾' : '▸'}</span>
              </button>
              {open[c.id] && (
                <p className={`oc-pain ${c.empty ? 'empty' : ''} fade-step`}>{c.empty ? '— ' : '↳ '}{tr(c.pain)}</p>
              )}
            </div>
          ))}
        </div>
        {allSeen && (
          <div className="frame-success fade-step">
            <p className="body" style={{ margin: 0 }}>{tr({ uz: <>Har imkoniyat bitta qiyinchilikning javobi bo'ladi. Javobi yo'q imkoniyat — ro'yxatdan chiqadi.</>, ru: <>Каждая возможность — это ответ на одну трудность. Возможность без ответа выпадает из списка.</> })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — TEST 1 =====
const Screen3 = (props) => (
  <QuestionScreen
    {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Задание · вопрос 1' })}
    question={<Q>{tr({ uz: <>🎵 Saytga fon musiqasi qo'shmoqchisiz. Avval <span className="italic" style={{ color: T.accent }}>qaysi savolga</span> javob berish kerak?</>, ru: <>🎵 Вы хотите добавить на сайт фоновую музыку. На <span className="italic" style={{ color: T.accent }}>какой вопрос</span> нужно ответить сначала?</> })}</Q>}
    questionText={{ uz: "Fon musiqasi qo'shishdan oldin qaysi savolga javob berish kerak?", ru: 'На какой вопрос нужно ответить, прежде чем добавить фоновую музыку?' }}
    options={[
      { uz: 'Uni yasash necha kun oladi?', ru: 'Сколько дней займёт её сделать?' },
      { uz: 'Sahifaning qaysi joyida turadi?', ru: 'В каком месте страницы она будет стоять?' },
      { uz: 'Bu kimning qaysi qiyinchiligini yo\'qotadi?', ru: 'Чью и какую трудность это убирает?' },
      { uz: 'Boshqa saytlarda bunday imkoniyat bormi?', ru: 'Есть ли такая возможность на других сайтах?' }
    ]}
    correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! Har imkoniyat bitta qiyinchilikning javobi bo'ladi. Javobi topilmasa, imkoniyat ro'yxatdan chiqadi.", ru: 'Верно! Каждая возможность — ответ на одну трудность. Если ответа нет, возможность выпадает из списка.' }}
    explainWrong={{
      0: { uz: 'Vaqtni hisoblash — kerakli ish, lekin u KEYIN keladi. Avval bu imkoniyat umuman kerakmi degan savolga javob topiladi.', ru: 'Считать сроки нужно, но это идёт ПОТОМ. Сначала находят ответ на вопрос, нужна ли эта возможность вообще.' },
      1: { uz: 'Joylashuvni o\'ylash to\'g\'ri — lekin kerak bo\'lmagan narsaning joyi ham kerak bo\'lmaydi.', ru: 'Думать о расположении правильно — но у ненужной вещи и место окажется ненужным.' },
      3: { uz: 'Boshqalarga qarash foydali — lekin ularning qiyinchiligi sizning mijozingiznikidan boshqa bo\'lishi mumkin.', ru: 'Смотреть на других полезно — но их трудности могут отличаться от трудностей вашего клиента.' },
      default: { uz: 'Yana bir bor o\'ylab ko\'ring: imkoniyat qaysi savoldan boshlanadi?', ru: 'Подумайте ещё раз: с какого вопроса начинается возможность?' }
    }}
  />
);

// ===== SCREEN 4 — JUFTLASH: imkoniyat kartasini o'z qiyinchiligiga qo'yish =====
const MATCH_ROWS = [
  { id: 'r1', need: 'jadval', t: { uz: 'Film qachon boshlanishi bilinmaydi', ru: 'Не понять, когда начинается фильм' } },
  { id: 'r2', need: 'joylar', t: { uz: 'Zalda bo\'sh joy bormi — bilinmaydi', ru: 'Не понять, есть ли в зале свободные места' } },
  { id: 'r3', need: 'chipta', t: { uz: 'Chiptani qayerdan olish noma\'lum', ru: 'Неизвестно, где взять билет' } }
];
// F-0802-13: karta = ikona + nom + BIR QATOR tavsif. Tavsif kartaning O'ZI nima ekanini
// aytadi, qaysi qiyinchilikni yopishini AYTMAYDI — juftlash ishi o'quvchida qoladi.
const MATCH_CARDS = [
  { id: 'jadval', ic: '🕒', t: { uz: 'Seans jadvali', ru: 'Расписание сеансов' }, d: { uz: 'Qaysi film qaysi soatda', ru: 'Какой фильм в какое время' } },
  { id: 'joylar', ic: '💺', t: { uz: 'Zal xaritasi', ru: 'Карта зала' }, d: { uz: "Zal sxemasi: band va bo'sh o'rindiqlar", ru: 'Схема зала: занятые и свободные места' } },
  { id: 'chipta', ic: '🎟', t: { uz: 'Onlayn chipta', ru: 'Билет онлайн' }, d: { uz: "To'lov saytning o'zida", ru: 'Оплата прямо на сайте' } },
  { id: 'logo', ic: '🔄', t: { uz: 'Aylanadigan logotip', ru: 'Вращающийся логотип' }, d: { uz: 'Sahifa tepasida aylanib turadi', ru: 'Крутится наверху страницы' } }
];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [place, setPlace] = useState(() => (storedAnswer && storedAnswer.place) || {}); // rowId → cardId
  const [held, setHeld] = useState(null);
  const [shake, setShake] = useState(null);
  // F-0802-13: «javon» zonasi OLIB TASHLANDI — u majburiy emas edi (doneAll uni tekshirmaydi),
  // ya'ni ekranda ish so'ramaydigan blok turardi. Ortiqcha karta shunchaki kartalar orasida
  // qoladi — o'quvchi buni KO'RADI, yozib aytish shart emas. (Javon-mexanikasi 10-ekranda.)
  const used = new Set(Object.values(place));
  const pool = MATCH_CARDS.filter(c => !used.has(c.id));
  const doneAll = MATCH_ROWS.every(r => place[r.id] === r.need);
  useEffect(() => {
    if (doneAll && storedAnswer === undefined) onAnswer(screen, { stage: 'exploration', screenIdx: screen, place, correct: true, picked: true });
  }, [doneAll]); // eslint-disable-line
  const drop = (rowId) => {
    if (!held) return;
    const row = MATCH_ROWS.find(r => r.id === rowId);
    if (row.need !== held || place[rowId]) { setShake(rowId); setTimeout(() => setShake(null), 460); return; }
    setPlace(p => ({ ...p, [rowId]: held })); setHeld(null);
  };
  const takeBack = (id) => { setPlace(p => { const n = { ...p }; Object.keys(n).forEach(k => { if (n[k] === id) delete n[k]; }); return n; }); setHeld(null); };
  const litCard = useTurnWalk(pool.map(c => c.id), !held && !doneAll && pool.length > 0);
  return (
    <Stage eyebrow={tr({ uz: 'Juftlash', ru: 'Соединяем' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!doneAll} label={doneAll ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Kartalarni qo'ying (${Object.keys(place).length}/3)`, ru: `Расставьте карточки (${Object.keys(place).length}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har imkoniyatni <span className="italic" style={{ color: T.accent }}>o'z qiyinchiligiga</span> qo'ying.</>, ru: <>Поставьте каждую возможность <span className="italic" style={{ color: T.accent }}>к своей трудности</span>.</> })}</h2></div>
        <div className={`mt-wrap fade-up delay-1${held ? ' holding' : ''}`}>
          <div className="mt-rows">
            {MATCH_ROWS.map(r => {
              const got = place[r.id];
              const card = got && MATCH_CARDS.find(c => c.id === got);
              return (
                <div key={r.id} className={`mt-row ${got ? 'filled' : ''} ${shake === r.id ? 'shake' : ''}`} onClick={() => drop(r.id)} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); drop(r.id); }}>
                  <span className="mt-pain">{tr(r.t)}</span>
                  <span className="mt-slot">
                    {card ? <span className="mt-chip in" onClick={(e) => { e.stopPropagation(); takeBack(card.id); }}><i>{card.ic}</i>{tr(card.t)}</span>
                      : <span className="mt-empty">{tr({ uz: 'bu yerga qo\'ying', ru: 'поставьте сюда' })}</span>}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-pool">
            <span className="mt-pool-lbl">{tr({ uz: 'Imkoniyat kartalari', ru: 'Карточки возможностей' })}</span>
            {pool.map(c => (
              <button key={c.id} draggable onDragStart={() => setHeld(c.id)} className={`mt-card ${held === c.id ? 'held' : ''}${turnCls(litCard, c.id, pool.length > 1)}`} onClick={() => setHeld(held === c.id ? null : c.id)}>
                <span className="mt-card-ic">{c.ic}</span>
                <span className="mt-card-tx"><span className="mt-card-t">{tr(c.t)}</span><span className="mt-card-d">{tr(c.d)}</span></span>
              </button>
            ))}
          </div>
        </div>
        {doneAll && (
          <div className="frame-success fade-step">
            <p className="body" style={{ margin: 0 }}>{tr({ uz: <>«Aylanadigan logotip»ga joy topilmadi — u hech qanday qiyinchilikka javob bermaydi.</>, ru: <>Для «вращающегося логотипа» места не нашлось — он не отвечает ни на одну трудность.</> })}</p>
          </div>
        )}
        {/* Juftlik-muhokamasi MENTOR eslatmasiga ko'chirildi (F-0802-13): o'quvchi ekranida
            blok qo'shmaydi, jonli darsdagi og'zaki mashq esa saqlanadi. */}
        <MentorNote>{tr({ uz: "Hammasi joylashgach so'rang: to'rtinchi kartani qanday o'zgartirsak, u ham biror qiyinchilikka javob bo'ladi? Juftlikda bir gapda aytishsin.", ru: 'Когда всё расставлено, спросите: как изменить четвёртую карточку, чтобы и она отвечала на трудность? Пусть скажут в парах одним предложением.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5 — TEST 2 =====
const Screen5 = (props) => (
  <QuestionScreen
    {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Задание · вопрос 2' })}
    question={<Q>{tr({ uz: <>🔄 «Aylanadigan logotip» kartasiga <span className="italic" style={{ color: T.accent }}>joy topilmadi</span>. Nima uchun?</>, ru: <>🔄 Для карточки «вращающийся логотип» <span className="italic" style={{ color: T.accent }}>места не нашлось</span>. Почему?</> })}</Q>}
    questionText={{ uz: "«Aylanadigan logotip» kartasiga nima uchun joy topilmadi?", ru: 'Почему для карточки «вращающийся логотип» не нашлось места?' }}
    options={[
      { uz: 'Uni yasash qiyin', ru: 'Её сложно сделать' },
      { uz: 'U hech qanday qiyinchilikni yo\'qotmaydi', ru: 'Она не убирает никакую трудность' },
      { uz: 'Bunday logotip boshqa saytlarda ham bor', ru: 'Такой логотип есть и на других сайтах' },
      { uz: 'Uni telefonda ko\'rish noqulay', ru: 'Её неудобно смотреть на телефоне' }
    ]}
    correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! Uch qiyinchilikning har biriga o'z javobi bor edi, bu kartaga esa qiyinchilik topilmadi.", ru: 'Верно! У каждой из трёх трудностей был свой ответ, а для этой карточки трудности не нашлось.' }}
    explainWrong={{
      0: { uz: 'Qiyinlik haqiqatan hisobga olinadi — lekin bu karta qiyinligi uchun emas, egasi topilmagani uchun qoldi.', ru: 'Сложность действительно учитывают — но эта карточка осталась не из-за сложности, а потому что не нашлось хозяина.' },
      2: { uz: 'Takrorlanish o\'ziga qarab e\'tirozga sabab emas: takrorlangan imkoniyat ham qiyinchilikni yo\'qotsa, qoladi.', ru: 'Повторение само по себе не повод для возражения: повторяющаяся возможность остаётся, если убирает трудность.' },
      3: { uz: 'Telefonda qanday ko\'rinishi muhim savol — lekin karta telefon uchun emas, egasizligi uchun joysiz qoldi.', ru: 'Как это выглядит на телефоне — важный вопрос, но карточка осталась без места не из-за телефона, а из-за отсутствия хозяина.' },
      default: { uz: 'Eslang: karta nima uchun hech qaysi qatorga tushmadi?', ru: 'Вспомните: почему карточка не подошла ни к одной строке?' }
    }}
  />
);

// ===== SCREEN 6 — KEYS-SLAYD: O'zbekistondagi internet-magazin voqeasi =====
const K_SLIDES = [
  {
    ic: '📱', h: { uz: 'Uzumgacha xarid qanday bo\'lgan', ru: 'Как покупали до Uzum' },
    body: { uz: <>Uzumgacha odamlar Telegram va Instagram guruhlaridan xarid qilardi. Sotuvchi rasm qo'yardi, xaridor yozardi — keyin narsani qanday olib ketish <b>o'zining ishi</b> edi.</>, ru: <>До Uzum люди покупали в группах Telegram и Instagram. Продавец выкладывал фото, покупатель писал — а как забрать вещь, было <b>его собственной задачей</b>.</> }
  },
  {
    ic: '🏗', h: { uz: 'U birinchi navbatda nimani qurdi', ru: 'Что он построил в первую очередь' },
    body: { uz: <>Uzum faqat sayt qurmadi. U <b>o'z mashinalarini, topshirish punktlarini va ertasi kuni yetkazib berish xizmatini</b> qurdi. Chunki odamlarning eng katta qiyinchiligi tanlash emas — olgan narsasi qo'liga qanday yetib kelishi edi.</>, ru: <>Uzum построил не только сайт. Он построил <b>свои машины, пункты выдачи и доставку на следующий день</b>. Потому что самой большой трудностью людей был не выбор, а то, как купленное доберётся до их рук.</> },
    predict: {
      ask: { uz: 'Uzum 2022-yil oktyabrda ochildi. Sizningcha, u birinchi navbatda nimani qurdi?', ru: 'Uzum открылся в октябре 2022 года. Как думаете, что он построил в первую очередь?' },
      chips: [
        { ic: '🖥', t: { uz: 'Faqat sayt', ru: 'Только сайт' } },
        { ic: '💳', t: { uz: 'Sayt va to\'lov tizimi', ru: 'Сайт и систему оплаты' } },
        { ic: '🚚', t: { uz: 'Sayt, to\'lov va o\'z yetkazib berish xizmati', ru: 'Сайт, оплату и свою доставку' } }
      ], ans: 2,
      miss: { uz: 'Adashdingiz — asl javob uchinchisi: Uzum o\'z yetkazib berish xizmatini ham qurdi.', ru: 'Не угадали — верный ответ третий: Uzum построил и свою службу доставки.' }
    }
  },
  {
    ic: '📈', h: { uz: 'Bugun undan qancha odam foydalanadi', ru: 'Сколько людей пользуется им сегодня' },
    body: { uz: <>2025-yilda oyiga <b>~17 million odam</b> foydalanadi. 2024-yil martda Uzum mamlakatning birinchi «unicorn»i bo'ldi — bu 1 milliard dollardan yuqori baholangan kompaniya degani (2024-yilda 1,16 mlrd, 2025-yilda 1,5 mlrd).</>, ru: <>В 2025 году им пользуются <b>~17 миллионов человек в месяц</b>. В марте 2024 года Uzum стал первым «единорогом» страны — так называют компанию, оценённую дороже 1 миллиарда долларов (1,16 млрд в 2024-м, 1,5 млрд в 2025-м).</> },
    predict: {
      ask: { uz: 'Bugun Uzumdan oyiga qancha odam foydalanadi?', ru: 'Сколько человек в месяц пользуется Uzum сегодня?' },
      chips: [
        { ic: '1️⃣', t: { uz: '~1 million', ru: '~1 миллион' } },
        { ic: '5️⃣', t: { uz: '~5 million', ru: '~5 миллионов' } },
        { ic: '🔟', t: { uz: '~17 million', ru: '~17 миллионов' } }
      ], ans: 2,
      miss: { uz: 'Asl javob — oyiga ~17 million odam (2025-yil).', ru: 'Верный ответ — ~17 миллионов человек в месяц (2025 год).' }
    }
  }
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gateK = useContext(LiveGateCtx) || {};
  const isMentorK = !!(gateK.live && gateK.live.mode === 'mentor');
  const [i, setI] = useState(0);
  const [bets, setBets] = useState({});
  const last = i === K_SLIDES.length - 1;
  const c = K_SLIDES[i];
  const bet = c.predict ? bets[i] : undefined;
  const betPending = !!(c.predict && bet === undefined);
  const betHint = useTurnHint(betPending && !isMentorK);
  useEffect(() => { if (last && !betPending && storedAnswer === undefined) onAnswer(screen, { stage: 'case', screenIdx: screen, correct: true, picked: true }); }, [last, betPending]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Keys 🛒', ru: 'Кейс 🛒' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={betPending && !isMentorK} label={betPending && !isMentorK ? { uz: 'Avval taxminingizni belgilang', ru: 'Сначала отметьте свою догадку' } : last ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Keyingi bosqich (${i + 1}/${K_SLIDES.length})`, ru: `Следующий шаг (${i + 1}/${K_SLIDES.length})` }} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zbekistonda <span className="italic" style={{ color: T.accent }}>internet-magazin</span> qanday boshlangan?</>, ru: <>Как в Узбекистане начинался <span className="italic" style={{ color: T.accent }}>интернет-магазин</span>?</> })}</h2></div>
        {c.predict && (bet === undefined || isMentorK) ? (
          <div className="kp-bet fade-step" key={`b${i}`}>
            <span className="k-slide-eyebrow">{tr({ uz: '🎲 Avval o\'zingiz belgilab ko\'ring', ru: '🎲 Сначала отметьте сами' })}</span>
            <h3 className="k-slide-h">{tr(c.predict.ask)}</h3>
            <div className="kp-chips">
              {c.predict.chips.map((ch, k) => (
                <button key={k} className={`kp-chip${!isMentorK && betHint ? ' turn-ring' : ''}`} disabled={isMentorK} onClick={() => setBets(p => ({ ...p, [i]: k }))}>
                  <span className="kp-ic">{ch.ic}</span>{tr(ch.t)}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {(!c.predict || bet !== undefined || isMentorK) && (
          <div className={`k-slide fade-step ${c.predict ? 'revealed' : ''}`} key={`s${i}`}>
            <span className="k-slide-eyebrow">{tr({ uz: `Uzum voqeasi · ${i + 1} / ${K_SLIDES.length}`, ru: `История Uzum · ${i + 1} / ${K_SLIDES.length}` })}</span>
            <div className="k-slide-ic">{c.ic}</div>
            <h3 className="k-slide-h">{tr(c.h)}</h3>
            <p className="k-slide-body">{tr(c.body)}</p>
            {c.predict && bet !== undefined && !isMentorK && (
              <span className={`kp-res ${bet === c.predict.ans ? 'hit' : 'miss'}`}>{bet === c.predict.ans ? tr({ uz: '🎯 Topdingiz!', ru: '🎯 Угадали!' }) : tr(c.predict.miss)}</span>
            )}
          </div>
        )}
        <div className="k-dots">{K_SLIDES.map((_, k) => <button key={k} className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-bosqich`, ru: `Шаг ${k + 1}` })} />)}</div>
        {last && !betPending && (
          <div className="frame-soft fade-step">
            <p className="body" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>{tr({ uz: 'Uzum ham eng og\'ir qiyinchilikdan boshlagan. Sizning juftlik-kartangizdagi imkoniyat ham aynan bitta qiyinchilikka qarasin.', ru: 'Uzum тоже начал с самой тяжёлой трудности. Пусть и возможность в вашей карточке-паре смотрит ровно на одну трудность.' })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — O'Z QIYINCHILIKLARINGIZ: uchtasini belgilash =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const own = useMemo(() => {
    const a = lsRead(M1_CARDS_KEY);
    return Array.isArray(a) ? a.map(c => (c && typeof c.muammo === 'string' ? c.muammo.trim() : '')).filter(x => x.length > 3).slice(0, 6) : [];
  }, []);
  const rows = useMemo(() => [...own.map((t, i) => ({ key: `o${i}`, text: t, own: true })), ...FALLBACK_PAINS.map((p, i) => ({ key: `f${i}`, text: p, own: false }))], [own]);
  const [sel, setSel] = useState(() => (storedAnswer && storedAnswer.sel) || []);
  const enough = sel.length >= 3;
  const toggle = (key) => setSel(p => (p.includes(key) ? p.filter(x => x !== key) : (p.length >= 3 ? p : [...p, key])));
  useEffect(() => {
    if (enough) {
      const picked = sel.map(k => { const r = rows.find(x => x.key === k); return r ? tr(r.text) : ''; }).filter(Boolean);
      lsWrite(PICKED_KEY, picked);
      if (storedAnswer === undefined) onAnswer(screen, { stage: 'exploration', screenIdx: screen, sel, correct: true, picked: true });
    }
  }, [enough, sel]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Qiyinchiliklaringiz', ru: 'Ваши трудности' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!enough} label={enough ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Uchtasini belgilang (${sel.length}/3)`, ru: `Отметьте три (${sel.length}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ishga oladigan <span className="italic" style={{ color: T.accent }}>uch qiyinchilikni</span> belgilang.</>, ru: <>Отметьте <span className="italic" style={{ color: T.accent }}>три трудности</span>, с которыми будете работать.</> })}</h2></div>
        {/* F-0802-17: Mentor ish-buyrug'ini TAKRORLAMAYDI (u sarlavhada) — u faqat ro'yxat
            QAYERDAN kelganini va keyin nima bo'lishini aytadi. Ilgari zaxira-tarmoq
            «Sizda saqlangan yozuv topilmadi» deb boshlanardi — o'quvchiga bu tizim-xatosidek
            eshitilardi (foydalanuvchi: «bu backend xatosiga o'xshaydi»). */}
        <Mentor>{own.length > 0
          ? tr({ uz: <>Quyida — o'tgan darsda o'zingiz yozgan qiyinchiliklar. Keyingi ekranda ularga imkoniyat yozasiz.</>, ru: <>Ниже — трудности, которые вы записали на прошлом уроке. На следующем экране напишете к ним возможности.</> })
          : tr({ uz: <>Boshlash uchun kinoteatr misolidan foydalanamiz — quyidagilar sizga tanish. Keyingi ekranda ularga imkoniyat yozasiz.</>, ru: <>Для начала возьмём пример с кинотеатром — эти трудности вам знакомы. На следующем экране напишете к ним возможности.</> })}</Mentor>
        <div className="pk-list fade-up delay-1">
          {rows.map(r => (
            <button key={r.key} className={`pk-row ${sel.includes(r.key) ? 'on' : ''}`} onClick={() => toggle(r.key)}>
              <span className="pk-box">{sel.includes(r.key) ? '✓' : ''}</span>
              <span className="pk-t">{tr(r.text)}</span>
              {r.own && <span className="pk-tag">{tr({ uz: 'sizniki', ru: 'ваша' })}</span>}
            </button>
          ))}
        </div>
        {/* Progress — instruksiya EMAS, holat. Tugagach yashilga o'tadi (ish bitdi belgisi;
            amber/yashil kontent-semantikasiga tegmaydi — bu jarayon belgisi). F-0802-17 */}
        <div className={`pk-count fade-up delay-2${enough ? ' full' : ''}`}>
          <span className="pk-count-ic">{enough ? '✓' : '○'}</span>
          <span><b className="pk-count-n">{sel.length}</b> / 3 {tr({ uz: 'tanlandi', ru: 'выбрано' })}</span>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — USTAXONA: 3 juftlik-karta bittalab yoziladi =====
// (SAMPLES olib tashlandi — F-0803-01: namuna endi imkoniyat maydonining placeholder'ida)
// Harakatsiz sifat-tekshiruvi (ikki til alohida ramkada — aralash-yozuv bo'lmasin)
const FLAT_UZ = /(chiroyli|go'zal|zamonaviy|qulay|yoqimli)/i;
const FLAT_RU = /(красив|современ|удобн|приятн)/i;
const isFlat = (t) => FLAT_UZ.test(t) || FLAT_RU.test(t);
// Darsning O'ZI «foydasiz» deb ko'rsatgan bandlar (hook: fon musiqasi, logotip, animatsiya…) —
// o'quvchi shulardan birini imkoniyat deb yozsa, savol qaytariladi (F-0803-01).
const DECOR_UZ = /(musiq|logotip|animatsi|rang|fon\b|bayram|effekt|chiroy|dizayn)/i;
const DECOR_RU = /(музык|логотип|анимац|цвет|фон\b|праздни|эффект|красив|дизайн)/i;
const isDecor = (t) => DECOR_UZ.test(t) || DECOR_RU.test(t);
const ScreenWorkshop = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const picked = useMemo(() => { const a = lsRead(PICKED_KEY); return Array.isArray(a) ? a : []; }, []);
  const [st, setSt] = useState(() => {
    const saved = readFeatures().slice(0, 3);
    return { saved, draft: { qiyinchilik: '', imkoniyat: '' }, editIdx: -1, done: !!(storedAnswer && storedAnswer.solved) || saved.length >= 3 };
  });
  const { saved, draft, editIdx, done } = st;
  const [focused, setFocused] = useState(false);
  const step = editIdx >= 0 ? editIdx : saved.length;
  // Yangi karta ochilganda qiyinchilik maydoni s7 da belgilangan qator bilan tayyor turadi
  useEffect(() => {
    if (editIdx >= 0) return;
    if (draft.qiyinchilik === '' && picked[saved.length]) setSt(p => ({ ...p, draft: { ...p.draft, qiyinchilik: picked[saved.length] } }));
  }, [saved.length, editIdx]); // eslint-disable-line
  useEffect(() => {
    if (done && storedAnswer === undefined && saved.length >= 3) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'features', cards: saved, solved: true, correct: true, picked: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  }, []); // eslint-disable-line
  const q = (draft.qiyinchilik || '').trim(), f = (draft.imkoniyat || '').trim();
  const canSave = q.length >= 3 && f.length >= 3;
  const others = saved.filter((_, i) => i !== editIdx);
  // F-0803-01 — YOZUVGA JAVOB. Ilgari faqat XATO holatlar aytilardi; to'g'ri yozgan o'quvchi
  // hech qanday javob olmasdi («feedback yo'q» hissi). Endi tekshiruv ikki tomonlama:
  // xato bo'lsa — nima noto'g'riligi; hammasi joyida bo'lsa — TASDIQ.
  // ⚠️ Bu QOIDA-tekshiruvi, sun'iy intellekt emas: dars o'zi belgilagan «foydasiz imkoniyat»
  // so'zlari (musiqa, logotip, animatsiya…) va shakl-xatolari ovlanadi, ma'no emas.
  const fb = !canSave ? null
    : f.toLowerCase() === q.toLowerCase() ? { bad: true, uz: 'Imkoniyat qiyinchilikni takrorlab qo\'ydi. Sayt NIMA QILISHINI yozing.', ru: 'Возможность повторила трудность. Напишите, ЧТО ДЕЛАЕТ сайт.' }
      : isDecor(f) ? { bad: true, uz: 'Bu qaysi qiyinchilikni yo\'qotadi? Chapdagi qatorni o\'qing va shunga javob bo\'ladigan narsani yozing.', ru: 'Какую трудность это убирает? Прочитайте строку слева и напишите то, что на неё отвечает.' }
        : isFlat(f) && f.length < 45 ? { bad: true, uz: 'Bu sayt qanday ko\'rinishini aytadi. Sayt nima qilishini yozing — masalan: ko\'rsatadi, saqlaydi, yuboradi.', ru: 'Это говорит, как выглядит сайт. Напишите, что сайт делает — например: показывает, сохраняет, отправляет.' }
          : others.some(c => (c.qiyinchilik || '').trim().toLowerCase() === q.toLowerCase()) ? { bad: true, uz: 'Bu qiyinchilik ro\'yxatda bor. Boshqasini oling — uch juftlik uch xil qiyinchilikka tegishli.', ru: 'Эта трудность уже в списке. Возьмите другую — три пары относятся к трём разным трудностям.' }
            : f.length <= 10 ? { bad: true, uz: 'Juda qisqa — sayt nima qilishini bir gapda yozing.', ru: 'Слишком коротко — напишите одним предложением, что делает сайт.' }
              : { bad: false, uz: 'Yaxshi — bu imkoniyat chapdagi qiyinchilikka javob beradi. Saqlang.', ru: 'Хорошо — эта возможность отвечает на трудность слева. Сохраняйте.' };
  const saveDraft = () => {
    if (!canSave) return;
    const card = { qiyinchilik: q, imkoniyat: f };
    const cards = editIdx >= 0 ? saved.map((c, i) => (i === editIdx ? card : c)) : [...saved, card];
    lsWrite(FEATURES_KEY, cards);
    const finished = cards.length >= 3;
    if (finished && !done) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'features', cards, solved: true, correct: true, picked: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
    setSt({ saved: cards, draft: { qiyinchilik: '', imkoniyat: '' }, editIdx: -1, done: done || finished });
  };
  const editCard = (i) => setSt(p => ({ ...p, draft: { ...p.saved[i] }, editIdx: i }));
  const setD = (patch) => setSt(p => ({ ...p, draft: { ...p.draft, ...patch } }));
  const allSaved = saved.length >= 3;
  const showEditor = !allSaved || editIdx >= 0;
  const pend = ['qiyinchilik', 'imkoniyat'].filter(k => !(draft[k] || '').trim());
  const litField = useTurnWalk(pend, showEditor && !focused && !isMentor);
  const saveTurn = useTurnHint(showEditor && canSave && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'Ustaxona ✍️', ru: 'Мастерская ✍️' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `✍️ ${saved.length}/3 — juftlikni yozib saqlang`, ru: `✍️ ${saved.length}/3 — запишите и сохраните пару` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>{['Birinchi', 'Ikkinchi', 'Uchinchi'][Math.min(step, 2)]} <span className="italic" style={{ color: T.accent }}>juftlikni</span> yozing.</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>{['первую', 'вторую', 'третью'][Math.min(step, 2)]} пару</span>.</> })}</h2></div>
        {/* F-0803-01: Mentor FAQAT birinchi juftlikda — u uch marta bir xil gapni aytardi
            va o'quvchi uni ikkinchi safar o'qimasdi (106c: takror ko'rsatma = shovqin). */}
        {step === 0 && editIdx < 0 && <Mentor>{tr({ uz: <>Belgilagan qiyinchiligingiz chapda turibdi — uni yo'qotadigan imkoniyatni yozing.</>, ru: <>Отмеченная вами трудность стоит слева — напишите возможность, которая её убирает.</> })}</Mentor>}
        {/* F-0803-01 — PROGRESS: «1—2—3» chizig'i barcha qadamni teng ko'rsatardi va o'quvchi
            qayerdaligi bilinmasdi. Endi uch holat uch xil: BAJARILGAN (yashil ✓) ·
            HOZIRGI (binafsha, to'ldirilgan) · KUTAYOTGAN (xira). Ulovchi chiziqlar
            olib tashlandi — holat-rangi ularsiz ham «yana bittasi qoldi» deb aytadi. */}
        <div className="jw-steps fade-up" aria-label={tr({ uz: `${saved.length}/3 juftlik yozildi`, ru: `Записано пар: ${saved.length}/3` })}>
          {[0, 1, 2].map(i => (
            <span key={i} className={`jws ${saved[i] ? 'on' : (i === step && showEditor) ? 'cur' : 'wait'}`}>
              <i className="jws-n">{saved[i] ? '✓' : i + 1}</i>
              <em className="jws-t">{tr({ uz: `${i + 1}-juftlik`, ru: `Пара ${i + 1}` })}</em>
            </span>
          ))}
        </div>
        {showEditor && (
          <div className="swed fade-up" key={editIdx >= 0 ? `e${editIdx}` : `n${saved.length}`}>
            <span className="swed-tag">{editIdx >= 0 ? tr({ uz: `✎ ${editIdx + 1}-juftlikni tahrirlash`, ru: `✎ Правка пары ${editIdx + 1}` }) : tr({ uz: `✨ ${step + 1}-juftlik`, ru: `✨ Пара ${step + 1}` })}</span>
            <div className="pf-edit">
              <label className={`smini-f pain ${q.length >= 3 ? 'on' : ''}${turnCls(litField, 'qiyinchilik', pend.length > 1)}`}>
                <span>{tr({ uz: 'QIYINCHILIK', ru: 'ТРУДНОСТЬ' })}</span>
                <input value={draft.qiyinchilik} onChange={e => setD({ qiyinchilik: e.target.value })} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={tr({ uz: 'Odamga nimasi qiyin?', ru: 'Что человеку трудно?' })} />
              </label>
              <span className={`pf-link ${canSave ? 'on' : ''}`} aria-hidden="true">↔</span>
              <label className={`smini-f feat ${f.length >= 3 ? 'on' : ''}${turnCls(litField, 'imkoniyat', pend.length > 1)}`}>
                <span>{tr({ uz: 'IMKONIYAT', ru: 'ВОЗМОЖНОСТЬ' })}</span>
                {/* Namuna-akkordeoni olib tashlandi (F-0803-01): misol aynan YOZILADIGAN
                    joyda, placeholder ichida turadi — alohida blok talab qilmaydi. */}
                <input value={draft.imkoniyat} onChange={e => setD({ imkoniyat: e.target.value })} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={tr({ uz: 'Masalan: film vaqtini ko\'rsatadi', ru: 'Например: показывает время фильма' })} />
              </label>
            </div>
            {fb && <p className={`swed-fb ${fb.bad ? 'bad' : 'ok'}`}>{fb.bad ? '🤔' : '✅'} {tr(fb)}</p>}
            <div className="swed-btns">
              {editIdx >= 0 && <button className="btn-ghost" onClick={() => setSt(p => ({ ...p, draft: { qiyinchilik: '', imkoniyat: '' }, editIdx: -1 }))}>{tr({ uz: 'Bekor qilish', ru: 'Отменить' })}</button>}
              {/* Saqlash tugmasi FAQAT ikkala maydon to'lganda chiqadi (F-0803-01): ilgari u
                  doim katta va o'chiq turib ko'zni tortardi, ish esa formada edi. */}
              {canSave && <button className={`swed-save${saveTurn ? ' turn-ring' : ''}`} onClick={saveDraft}>{tr({ uz: '✓ Saqlash', ru: '✓ Сохранить' })}</button>}
            </div>
          </div>
        )}
        {saved.length > 0 && (
          <div className="svd full fade-step">
            {saved.map((c, i) => (
              <div key={i} className={`svd-card ${editIdx === i ? 'editing' : ''}`}>
                <div className="svd-top">
                  <span className="svd-num">✓ {i + 1}</span>
                  <button className="svd-edit" onClick={() => editCard(i)} aria-label={tr({ uz: `${i + 1}-juftlikni tahrirlash`, ru: `Править пару ${i + 1}` })}>{tr({ uz: '✎ Tahrirlash', ru: '✎ Править' })}</button>
                </div>
                <p className="svd-sent"><b style={{ color: T.amberInk }}>{c.qiyinchilik}</b> ↔ <b style={{ color: T.success }}>{c.imkoniyat}</b></p>
              </div>
            ))}
          </div>
        )}
        {allSaved && <div className="done-mini fade-step">{tr({ uz: '✅ Uch juftlik tayyor', ru: '✅ Три пары готовы' })} <span className="dm-sub">{tr({ uz: '— tahrirlash uchun ✎ belgisidan foydalaning', ru: '— для правки используйте значок ✎' })}</span></div>}
        {/* F-0803-01 — OLIB TASHLANDI (106c): uchta qoida ro'yxati (.chk) va ostidagi
            «Bitta savolga javob bering…» ipuchasi. Ikkovi ham hujjat-uslubidagi ko'rsatma
            edi; endi o'sha bilim o'z vaqtida — yozayotganda, javob-qatorida beriladi. */}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={{ uz: '✍️ Uch juftlikni yozib bo\'lganlar', ru: '✍️ Кто записал три пары' }} />
        <MentorNote>{tr({ uz: "Bu amaliyotni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq. Baholash-mezoni: har kartada bitta qiyinchilik va bitta imkoniyat, imkoniyat harakat bilan yozilgan, uch karta uch xil qiyinchilikka tegishli.", ru: 'Это задание выполняют ученики, вы наблюдаете; «Продолжить» для вас открыто. Критерий проверки: в каждой карточке одна трудность и одна возможность, возможность записана действием, три карточки — о трёх разных трудностях.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEST 3 =====
const Screen9 = (props) => (
  <QuestionScreen
    {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Задание · вопрос 3' })}
    question={<Q>{tr({ uz: <>Qaysi juftlik <span className="italic" style={{ color: T.accent }}>to'g'ri</span> yozilgan?</>, ru: <>Какая пара записана <span className="italic" style={{ color: T.accent }}>верно</span>?</> })}</Q>}
    questionText={{ uz: "Qaysi juftlik to'g'ri yozilgan?", ru: 'Какая пара записана верно?' }}
    options={[
      { uz: 'Zalda joy bormi bilinmaydi — sayt chiroyli bo\'lsin', ru: 'Непонятно, есть ли места в зале — пусть сайт будет красивым' },
      { uz: 'Film qachon boshlanishini bilmaydi — seans jadvali sahifaning tepasida turadi', ru: 'Не знает, когда начинается фильм — расписание сеансов стоит наверху страницы' },
      { uz: 'Chiptani qayerdan olishni bilmaydi — sayt tez ochiladi', ru: 'Не знает, где взять билет — сайт быстро открывается' },
      { uz: 'Film qiziqmi bilmaydi — film haqida ko\'proq ma\'lumot beriladi', ru: 'Не знает, интересен ли фильм — даётся больше информации о фильме' }
    ]}
    correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! O'ng tomon sayt nima qilishini aytadi va chap tomondagi qiyinchilikni to'g'ridan-to'g'ri yo'qotadi.", ru: 'Верно! Правая сторона говорит, что делает сайт, и напрямую убирает трудность слева.' }}
    explainWrong={{
      0: { uz: 'Qiyinchilik aniq yozilgan, bu yaxshi. Lekin o\'ng tomon sayt nima QILISHINI aytmaydi: chiroylilik bo\'sh joylarni ko\'rsatmaydi.', ru: 'Трудность записана конкретно — это хорошо. Но правая сторона не говорит, что сайт ДЕЛАЕТ: красота не показывает свободные места.' },
      2: { uz: 'Qiyinchilik hayotdan olingan, to\'g\'ri. Lekin saytning tez ochilishi chiptani qayerdan olishni aytmaydi — javob boshqa narsaga tegib ketgan.', ru: 'Трудность взята из жизни, верно. Но быстрая загрузка сайта не говорит, где взять билет — ответ попал не туда.' },
      3: { uz: 'Yo\'nalish to\'g\'ri tanlangan. Lekin «ko\'proq ma\'lumot» aniq emas: odam saytga kirib nimani ko\'rishi yozilmagan.', ru: 'Направление выбрано верно. Но «больше информации» неконкретно: не написано, что человек увидит, зайдя на сайт.' },
      default: { uz: 'O\'ng tomonga qarang: u sayt nima qilishini harakat bilan aytyaptimi?', ru: 'Посмотрите на правую сторону: говорит ли она действием, что делает сайт?' }
    }}
  />
);

// ===== SCREEN 10 — ORTIQCHASINI TOPING: qiyinchiligi yo'q bandni javonga chiqarish =====
const CLEAN_ITEMS = [
  { id: 'jadval', ic: '🕒', t: { uz: 'Seans jadvali', ru: 'Расписание сеансов' }, pain: { uz: 'Film qachon boshlanishini bilmaydi', ru: 'Не знает, когда начинается фильм' }, extra: false },
  { id: 'chipta', ic: '🎟', t: { uz: 'Onlayn chipta', ru: 'Билет онлайн' }, pain: { uz: 'Chiptani qayerdan olishni bilmaydi', ru: 'Не знает, где взять билет' }, extra: false },
  // F-0803-02: ortiqcha bandning izohi BITTA qisqa hukm — uzun tushuntirish va muhokama-savoli
  // olib tashlandi (ular MentorNote'ga ko'chdi). O'quvchi bir qarashda javobni oladi.
  { id: 'zamonaviy', ic: '⭐', t: { uz: 'Sayt zamonaviy ko\'rinsin', ru: 'Пусть сайт выглядит современно' }, pain: { uz: 'Qaysi qiyinchilikni yo\'qotishi yozilmagan', ru: 'Не написано, какую трудность это убирает' }, extra: true },
  { id: 'joylar', ic: '💺', t: { uz: 'Zal xaritasi', ru: 'Карта зала' }, pain: { uz: 'Zalda bo\'sh joy bormi — bilinmaydi', ru: 'Непонятно, есть ли в зале свободные места' }, extra: false },
  { id: 'bayram', ic: '🎉', t: { uz: 'Bosh sahifada bayram ta\'siri', ru: 'Праздничный эффект на главной' }, pain: { uz: 'Hech qanday qiyinchilikni yo\'qotmaydi', ru: 'Не убирает ни одной трудности' }, extra: true }
];
const ScreenClean = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [open, setOpen] = useState({});
  const [seen, setSeen] = useState(() => (storedAnswer && storedAnswer.seen) || []);
  const [shelf, setShelf] = useState(() => (storedAnswer && storedAnswer.shelf) || []);
  const [warn, setWarn] = useState(null);
  const doneAll = CLEAN_ITEMS.filter(i => i.extra).every(i => shelf.includes(i.id));
  const toggle = (id) => { setOpen(p => ({ ...p, [id]: !p[id] })); setSeen(p => (p.includes(id) ? p : [...p, id])); };
  const toShelf = (it) => {
    if (!it.extra) { setWarn(it.id); setTimeout(() => setWarn(null), 2600); return; }
    setShelf(s => (s.includes(it.id) ? s : [...s, it.id]));
  };
  useEffect(() => {
    if (doneAll && storedAnswer === undefined) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'clean', shelf, solved: true, correct: true, picked: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  }, [doneAll]); // eslint-disable-line
  const pending = CLEAN_ITEMS.filter(i => !seen.includes(i.id)).map(i => i.id);
  const lit = useTurnWalk(pending, pending.length > 0 && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'Ortiqchasini toping', ru: 'Найдите лишнее' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!doneAll && !isMentor} label={doneAll || isMentor ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Keraksizini toping (${shelf.length}/2)`, ru: `Найдите ненужные (${shelf.length}/2)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qiyinchiligi <span className="italic" style={{ color: T.accent }}>yo'q bandni</span> toping.</>, ru: <>Найдите пункт <span className="italic" style={{ color: T.accent }}>без трудности</span>.</> })}</h2></div>
        {/* F-0802-17: bu ekranda Mentor umuman yo'q edi, o'rniga IKKITA ipucha turardi
            (biri sahna + «bosing», ikkinchisi usul). Bittaga birlashtirildi: sahna + USUL.
            «Har bandni bosing» olib tashlandi — bosish o'z affordansidan ko'rinadi. */}
        <Mentor>{tr({ uz: <>Har bir bandga bitta savol bering: <b style={{ color: T.ink }}>bu odamni nimadan qutqaradi?</b> Javob topilmasa — u kerak emas.</>, ru: <>Задайте каждому пункту один вопрос: <b style={{ color: T.ink }}>от чего это избавляет человека?</b> Если ответа нет — он не нужен.</> })}</Mentor>
        <div className="cl-list fade-up delay-1">
          {CLEAN_ITEMS.filter(it => !shelf.includes(it.id)).map(it => (
            <div key={it.id} className={`cl-item ${open[it.id] ? 'on' : ''} ${seen.includes(it.id) && !it.extra ? 'ok' : ''}`}>
              <button className={`cl-top${turnCls(lit, it.id, pending.length > 1)}`} onClick={() => toggle(it.id)} aria-expanded={!!open[it.id]}>
                <span className="cl-ic">{it.ic}</span>
                <span className="cl-t">{tr(it.t)}</span>
                {seen.includes(it.id) && !it.extra && <span className="cl-ok">✓</span>}
                <span className="cl-arw">{open[it.id] ? '▾' : '▸'}</span>
              </button>
              {/* F-0803-02 — OCHILGANDA IKKI NARSA: bitta hukm + bitta harakat.
                  Ilgari bu yerda hukm + tugma + uzun izoh (cl-note) birga chiqardi va
                  o'quvchi «foydalimi yoki yo'qmi?» degan javobni darrov ololmasdi. */}
              {open[it.id] && (
                <div className="cl-body fade-step">
                  <p className={`cl-pain ${it.extra ? 'none' : ''}`}>{it.extra ? '❌ ' : '↳ '}{tr(it.pain)}</p>
                  <button className="cl-shelf-btn" onClick={() => toShelf(it)}>{tr({ uz: '🗑 Bu kerak emas', ru: '🗑 Это не нужно' })}</button>
                  {warn === it.id && <p className="cl-warn">{tr({ uz: 'Bu bandning qiyinchiligi bor — u ro\'yxatda qoladi.', ru: 'У этого пункта есть трудность — он остаётся в списке.' })}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* F-0803-02: «Javon» → «Keraksizlar». «Javon» metaforasini o'quvchi izohsiz
            tushunmasdi; «Keraksizlar» nomning O'ZI nima uchun ekanini aytadi. */}
        <div className="cl-shelf">
          <span className="cl-shelf-lbl">{tr({ uz: '🗑 Keraksizlar', ru: '🗑 Ненужные' })}</span>
          {shelf.map(id => { const it = CLEAN_ITEMS.find(x => x.id === id); return <span key={id} className="cl-chip">{it.ic} {tr(it.t)}</span>; })}
          {shelf.length === 0 && <span className="cl-shelf-empty">{tr({ uz: 'hozircha bo\'sh', ru: 'пока пусто' })}</span>}
        </div>
        {doneAll && <div className="done-mini fade-step">{tr({ uz: '✅ 3 ta foydali band qoldi', ru: '✅ Осталось 3 полезных пункта' })}</div>}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={{ uz: '🗑 Ro\'yxatni tozalaganlar', ru: '🗑 Кто очистил список' }} />
        <MentorNote>{tr({ uz: "Bu mashqni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq. Tuzoqqa tushish xato emas — aynan shu lahza dars mavzusi, ovoz chiqarib muhokama qiling. «Zamonaviy ko'rinsin» chiqqanda so'rang: buni qanday qilib aniq bitta qiyinchilikka bog'lasa bo'ladi?", ru: 'Это упражнение выполняют ученики, вы наблюдаете; «Продолжить» для вас открыто. Попасться в ловушку — не ошибка: именно этот момент и есть тема урока, обсудите вслух.' })}</MentorNote>
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

// ===== TUZILMA-TEKSHIRUVI — ro'yxat bandlari ustida, 3 shart (jonli chip) =====
const KOD_CONDS = [
  { id: 'c1', label: { uz: "Ro'yxatda 3 ta band", ru: 'В списке 3 пункта' } },
  { id: 'c2', label: { uz: 'Har bandda qalin nom', ru: 'В каждом пункте жирное имя' } },
  { id: 'c3', label: { uz: 'Tiredan keyin qiyinchilik', ru: 'После тире — трудность' } },
];
const DASH_RE = /[—–-]/;
function checkList(html) {
  const res = { c1: false, c2: false, c3: false, hints: {} };
  if (typeof DOMParser === 'undefined') return res;
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  const items = Array.from(doc.body.querySelectorAll('li'));
  const txt = (el) => (el && el.textContent ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  // ① Uchta band
  if (items.length < 3) res.hints.c1 = tr({ uz: "Yangi band ochish uchun <li> yozing, matnni yozing, </li> bilan yoping.", ru: 'Чтобы открыть новый пункт, напишите <li>, затем текст и закройте </li>.' });
  else res.c1 = true;
  // ② Har bandda bo'sh bo'lmagan <b>
  const noBold = items.filter(li => { const b = li.querySelector('b'); return !b || txt(b).length < 2; });
  if (items.length === 0) res.hints.c2 = tr({ uz: 'Avval bandlarni yozing, keyin ularning ichiga <b> qo\'shasiz.', ru: 'Сначала напишите пункты, потом добавите внутрь <b>.' });
  else if (noBold.length > 0) res.hints.c2 = tr({ uz: 'Imkoniyat nomini <b> va </b> orasiga yozing — u sahifada qalin chiqadi.', ru: 'Название возможности напишите между <b> и </b> — на странице оно станет жирным.' });
  else res.c2 = true;
  // ③ Tiredan keyin kamida 8 belgilik matn
  const noTail = items.filter(li => { const t = txt(li); const m = t.split(DASH_RE); return m.length < 2 || m[m.length - 1].trim().length < 8; });
  if (items.length === 0) res.hints.c3 = tr({ uz: 'Bandlar yozilgach, har birida tiredan keyin qiyinchilikni yozasiz.', ru: 'Когда пункты написаны, в каждом после тире напишете трудность.' });
  else if (noTail.length > 0) res.hints.c3 = tr({ uz: 'Tiredan keyin bu imkoniyat qaysi qiyinchilikni yo\'qotishini yozing.', ru: 'После тире напишите, какую трудность убирает эта возможность.' });
  else res.c3 = true;
  return res;
}

const KOD_PREVIEW_CSS = `
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#FBFAFE;color:#1B1630;line-height:1.55;padding:18px 20px}
  h2{margin:0 0 12px;font-size:19px;font-family:Georgia,serif;color:#5B3DE6}
  ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:9px}
  li{font-size:14px;color:#565073;overflow-wrap:anywhere}
  li b{color:#1B1630}
  h2,li,p{overflow-wrap:anywhere;min-width:0}
`;
const kodWrapDoc = (code) => `<!doctype html><html lang="uz"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><style>${KOD_PREVIEW_CSS}</style></head>
<body>${code}</body></html>`;

// Boshlang'ich kod: birinchi <li> o'quvchining O'Z 1-juftligidan (bo'lmasa — namuna-fallback, 40-qonun)
const kodStarter = () => {
  const f = readFeatures();
  const first = f[0];
  const feat = first ? first.imkoniyat : tr({ uz: 'Seans jadvali', ru: 'Расписание сеансов' });
  const pain = first ? first.qiyinchilik : tr({ uz: 'film qachon boshlanishini bilmaydi', ru: 'не знает, когда начинается фильм' });
  return `${tr({ uz: '<h2>Kinoteatr sayti nima beradi</h2>', ru: '<h2>Что даёт сайт кинотеатра</h2>' })}

<ul>
  <li><b>${feat}</b> — ${pain}</li>
  ${tr({ uz: '<!-- ← Bu joyga yana ikki band yozasiz -->', ru: '<!-- ← Сюда напишете ещё два пункта -->' })}
</ul>`;
};

// Reload-himoya: o'quvchi yozgan kod F5 da yo'qolmasin — lesson-scoped kalit
const KODING_KEY = 'pm-m2d2-koding';
const readKoding = () => { try { const v = JSON.parse(localStorage.getItem(KODING_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
// F-0801-01: kompilyator ochiq-yopiqligi ham saqlanadi — fon-tabda Chrome sahifani
// qayta yuklasa (Memory Saver), o'quvchi kompilyator ICHIGA qaytadi, praktika-sahifaga emas.
const writeKodingOpen = (open) => { try { const p = readKoding() || {}; localStorage.setItem(KODING_KEY, JSON.stringify({ ...p, open })); } catch {} };

// ===== TO'LIQ-EKRAN KOMPILYATOR — tepada topshiriq + jonli shart-chiplar,
// chapda muharrir (Tab = 2 probel, ▶), o'ngda jonli natija, pastda navigatsiya.
function ListCompiler({ initialCode, onContinue, onBack }) {
  const [code, setCode] = useState(initialCode || '');
  const [src, setSrc] = useState(initialCode || '');
  useEffect(() => {
    const t = setTimeout(() => {
      setSrc(code);
      try { const prev = readKoding(); localStorage.setItem(KODING_KEY, JSON.stringify({ code, done: !!(prev && prev.done), open: true })); } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [code]);
  const res = useMemo(() => checkList(src), [src]);
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
          <span className="shc-eyebrow">{tr({ uz: 'Koding · juftliklar ro\'yxati', ru: 'Кодинг · список пар' })}</span>
          <h1 className="shc-title">{tr({ uz: 'Juftliklaringizni sahifada ko\'rsating', ru: 'Покажите свои пары на странице' })}</h1>
          <p className="shc-brief">{tr({ uz: <>Ro'yxatga yana <b>ikkita band</b> qo'shing. Har bandda imkoniyat nomi <span className="mono">&lt;b&gt;</span> va <span className="mono">&lt;/b&gt;</span> orasida turadi, tiredan keyin esa o'sha imkoniyat yo'qotadigan qiyinchilik yoziladi.</>, ru: <>Добавьте в список ещё <b>два пункта</b>. В каждом название возможности стоит между <span className="mono">&lt;b&gt;</span> и <span className="mono">&lt;/b&gt;</span>, а после тире пишется трудность, которую эта возможность убирает.</> })}</p>
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
            <textarea className="shc-code" value={code} spellCheck={false} autoCapitalize="off" autoCorrect="off" onChange={e => setCode(e.target.value)} onKeyDown={onKeyDown} placeholder={tr({ uz: '<ul> ... </ul> ichiga bandlaringizni yozing', ru: 'Напишите свои пункты внутри <ul> ... </ul>' })} />
          </section>
          <section className="shc-pane">
            <div className="shc-bar">
              <span className="bb-dots"><i /><i /><i /></span>
              <span className="shc-url"><span className="lock">●</span>kino.uz</span>
              <span className="shc-live">{tr({ uz: 'jonli', ru: 'вживую' })}</span>
            </div>
            <iframe className="shc-frame" title={tr({ uz: 'Jonli natija', ru: 'Живой результат' })} sandbox="" srcDoc={doc} />
          </section>
        </main>
        <footer className="shc-bottom">
          <button className="shc-ghost" onClick={onBack}>{tr({ uz: '← Darsga qaytish', ru: '← Вернуться к уроку' })}</button>
          <button className="shc-ghost" onClick={() => setCode(kodStarter())}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button>
          <div className="shc-status">
            {passed
              ? <span className="shc-ok-msg">{tr({ uz: '✓ Uchala shart bajarildi!', ru: '✓ Все три условия выполнены!' })}</span>
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
  const isSelf = !live || live.mode === 'self';
  const workRef = useRef(null);
  // F-0801-01: qayta yuklanishda (Chrome fon-tabni bo'shatgan bo'lsa) kompilyator o'zi qayta ochiladi
  const [open, setOpen] = useState(() => { const s = readKoding(); return !!(s && s.open); });
  const mine = useMemo(() => readFeatures(), []);
  const [st, setSt] = useState(() => {
    const saved = readKoding();
    return { code: (storedAnswer && storedAnswer.code) || (saved && saved.code) || kodStarter(), done: !!(storedAnswer && storedAnswer.solved) || !!(saved && saved.done) };
  });
  const { code, done } = st;
  const openHint = useTurnHint(!done && !open && !isMentor);
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
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi juftliklaringizni <span className="italic" style={{ color: T.accent }}>sahifada</span> ko'rsatamiz.</>, ru: <>Теперь покажем ваши пары <span className="italic" style={{ color: T.accent }}>на странице</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Pastdagi <b style={{ color: T.ink }}>«🛠 Kompilyatorni ochish»</b> tugmasini bosing. Kodni yozadigan va natijani darhol ko'rsatadigan oyna ochiladi.</>, ru: <>Нажмите кнопку <b style={{ color: T.ink }}>«🛠 Открыть компилятор»</b> ниже. Откроется окно, где пишут код и сразу видят результат.</> })}</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        <div className="stq fade-up delay-1" ref={workRef}>
          <div className="stq-code">
            <span className="stq-code-bar"><span className="bb-dots"><i /><i /><i /></span>index.html</span>
            <code className="stq-code-body">
              <span className="stq-l t">&lt;ul&gt;</span>
              <span className="stq-l dim">   &lt;li&gt;&lt;b&gt;{tr({ uz: 'imkoniyat', ru: 'возможность' })}&lt;/b&gt; — {tr({ uz: 'qiyinchilik', ru: 'трудность' })}&lt;/li&gt;</span>
              <span className="stq-l t">&lt;/ul&gt;</span>
            </code>
          </div>
          <span className="stq-arrow" aria-hidden="true">➜</span>
          <div className="stq-page">
            <div className="stq-pbar"><span className="bb-dots"><i /><i /><i /></span><span className="stq-purl"><span className="lock">●</span>kino.uz</span></div>
            <div className="stq-mine">
              <span className="stq-mine-lbl">{tr({ uz: '📒 Bular — o\'z juftliklaringiz', ru: '📒 Это — ваши пары' })}</span>
              {(mine.length > 0 ? mine : [{ qiyinchilik: tr({ uz: 'film qachon boshlanishini bilmaydi', ru: 'не знает, когда начинается фильм' }), imkoniyat: tr({ uz: 'Seans jadvali', ru: 'Расписание сеансов' }) }]).map((c, i) => (
                <span key={i} className="stq-mine-row"><b>{c.imkoniyat}</b> — {c.qiyinchilik}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="stq-cta fade-up delay-2">
          <button className={`kod-launch-btn${openHint ? ' turn-ring' : ''}`} onClick={() => { setOpen(true); writeKodingOpen(true); }}>{done ? tr({ uz: '↻ Kompilyatorni qayta ochish', ru: '↻ Открыть компилятор заново' }) : tr({ uz: '🛠 Kompilyatorni ochish', ru: '🛠 Открыть компилятор' })}</button>
          {done && <span className="stq-cta-sub">{tr({ uz: 'Bajarildi — xohlasangiz kodni yana sayqallang', ru: 'Выполнено — при желании доработайте код' })}</span>}
          {!done && isSelf && (
            <button className="stq-skip" onClick={onNext}>{tr({ uz: '✓ Bu mashqni sinfda bajarganman — davom etish →', ru: '✓ Это задание я выполнил в классе — продолжить →' })}</button>
          )}
        </div>
        {done && <div className="done-mini fade-step" style={{ alignSelf: 'center' }}>{tr({ uz: '✅ Ishladi!', ru: '✅ Получилось!' })} <span className="dm-sub">{tr({ uz: '— sahifadagi har bir band bitta qiyinchilikning javobi. Kod yozilishidan oldin ana shu juftlik yoziladi.', ru: '— каждый пункт страницы отвечает на одну трудность. Эта пара пишется раньше кода.' })}</span></div>}
        {/* Ixtiyoriy qo'shimcha topshiriq MENTOR eslatmasiga ko'chirildi (F-0802-17):
            u vazifani bajarish uchun zarur emas, o'quvchi ekranida esa blok egallardi. */}
        <MentorNote>{tr({ uz: "Ulgurgan o'quvchilarga ayting: to'rtinchi bandni ham qo'shishsin — uyda yozadigan juftligi uchun.", ru: 'Тем, кто успел, скажите: пусть добавят и четвёртый пункт — для пары, которую напишут дома.' })}</MentorNote>
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={{ uz: '🛠 Kodni yozib bo\'lganlar', ru: '🛠 Кто уже написал код' }} />
        <MentorNote>{tr({ uz: "Kodni VS Code'da emas, shu oynada yozadi — 10 daqiqa yetadi. Ulgurmagan o'quvchi uyga vazifada tugatadi, unga qisqa variant beriladi.", ru: 'Код пишут не в VS Code, а в этом окне — 10 минут достаточно. Кто не успел, дописывает в домашнем задании по короткому варианту.' })}</MentorNote>
      </div>
      {open && <ListCompiler initialCode={code} onContinue={finishPractice} onBack={() => { setOpen(false); writeKodingOpen(false); }} />}
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY TEST =====
const Screen12 = (props) => (
  <QuestionScreen
    {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy savol', ru: 'Итоговый вопрос' })}
    question={<Q>{tr({ uz: <>Kinoteatr egasi: «Saytga o'yin qo'shaylik» dedi. <span className="italic" style={{ color: T.accent }}>Birinchi</span> nima qilasiz?</>, ru: <>Владелец кинотеатра сказал: «Давайте добавим на сайт игру». Что сделаете <span className="italic" style={{ color: T.accent }}>первым</span>?</> })}</Q>}
    questionText={{ uz: "Kinoteatr egasi o'yin qo'shishni so'radi. Birinchi nima qilasiz?", ru: 'Владелец кинотеатра попросил добавить игру. Что сделаете первым?' }}
    options={[
      { uz: 'O\'yin kimning qaysi qiyinchiligini yo\'qotishini so\'rayman', ru: 'Спрошу, чью и какую трудность убирает эта игра' },
      { uz: 'Darhol qo\'shaman — egasi shunday xohladi', ru: 'Сразу добавлю — хозяин так захотел' },
      { uz: 'Keyinroq qilamiz deb aytaman', ru: 'Скажу, что сделаем позже' },
      { uz: 'Boshqa kinoteatr saytlarida o\'yin bor-yo\'qligini tekshiraman', ru: 'Проверю, есть ли игра на других сайтах кинотеатров' }
    ]}
    correctIdx={0}
    explainCorrect={{ uz: "To'g'ri! Har imkoniyat shu savoldan boshlanadi. Javob topilsa — o'yin ro'yxatga kiradi, topilmasa — keraksizlarga.", ru: 'Верно! Каждая возможность начинается с этого вопроса. Ответ найдётся — игра попадёт в список, нет — в ненужные.' }}
    explainWrong={{
      1: { uz: 'Egasining so\'zini eshitish shart, bu to\'g\'ri. Lekin so\'rov hali imkoniyat emas: u qaysi qiyinchilikka javob berishi hali noma\'lum.', ru: 'Выслушать хозяина обязательно, это верно. Но просьба — ещё не возможность: пока неизвестно, на какую трудность она отвечает.' },
      2: { uz: 'Ishni tartibga solish kerak, bu rost. Lekin kechiktirish savolga javob bermaydi — o\'yin keyin ham egasiz qoladi.', ru: 'Наводить порядок в работе нужно, это правда. Но отсрочка не отвечает на вопрос — игра и потом останется без хозяина.' },
      3: { uz: 'Boshqalarni ko\'rish foydali odat. Lekin ularda borligi sizning mijozingizga kerakligini isbotlamaydi.', ru: 'Смотреть на других — полезная привычка. Но то, что игра есть у них, не доказывает, что она нужна вашему клиенту.' },
      default: { uz: 'Har imkoniyat qaysi savoldan boshlanishini eslang.', ru: 'Вспомните, с какого вопроса начинается каждая возможность.' }
    }}
  />
);

// ===== SCREEN 13 — YAKUNIY SO'Z: sherikka aytish + bir qator yozuv =====
const CLASS_ASKS = [
  { uz: 'Kimning uch juftligi ham tayyor?', ru: 'У кого готовы все три пары?' },
  { uz: 'Kimda keraksizlarga chiqqan band bor?', ru: 'У кого есть пункт, ушедший в ненужные?' },
  { uz: 'Kim uyda yana bitta juftlik yozmoqchi?', ru: 'Кто дома напишет ещё одну пару?' }
];
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [txt, setTxt] = useState(() => (storedAnswer && storedAnswer.text) || (typeof localStorage !== 'undefined' ? (localStorage.getItem(REFLECT_KEY) || '') : ''));
  const ok = txt.trim().length >= 12;
  useEffect(() => {
    try { localStorage.setItem(REFLECT_KEY, txt); } catch {}
    if (ok && storedAnswer === undefined) onAnswer(screen, { stage: 'reflection', screenIdx: screen, text: txt, picked: true });
  }, [txt, ok]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy so\'z', ru: 'Заключительное слово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!ok && !isMentor} label={ok || isMentor ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Bir qator yozing', ru: 'Напишите одну строку' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta juftligingizni <span className="italic" style={{ color: T.accent }}>yoddan</span> ayta olasizmi?</>, ru: <>Сможете назвать одну свою пару <span className="italic" style={{ color: T.accent }}>по памяти</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Ekranga qaramasdan sherigingizga ayting: qanday qiyinchilik va uni qaysi imkoniyat yo'qotadi? So'ng shu gapni bir qatorga yozing.</>, ru: <>Не глядя на экран, скажите соседу: какая трудность и какая возможность её убирает? Потом запишите эту фразу одной строкой.</> })}</Mentor>
        {/* F-0803-03 — 106e (ko'rsatma → vazifa → javob): «① Sherigingizga ayting» kartasi
            olib tashlandi — Mentor buni allaqachon aytadi; «③ Sinf bilan: qo'l ko'taring»
            esa mentor ish-tartibi, o'quvchi ekranida joyi yo'q → MentorNote'ga. Qoladigan
            yagona VAZIFA — yozish maydoni. */}
        <div className="rf-write fade-up delay-1">
          <textarea className="rf-area" value={txt} onChange={e => setTxt(e.target.value)} rows={3} placeholder={tr({ uz: 'Qiyinchilik ↔ uni yo\'qotadigan imkoniyat', ru: 'Трудность ↔ возможность, которая её убирает' })} />
          <span className="rf-cnt">{ok ? tr({ uz: '✓ Yozildi', ru: '✓ Записано' }) : tr({ uz: 'kamida bir gap', ru: 'хотя бы одно предложение' })}</span>
        </div>
        {/* 🎯 «Aha» lahzasi — dars aynan shu gap bilan yopiladi. Faqat o'quvchi YOZGANDAN
            keyin chiqadi: bu mukofot, ko'rsatma emas (106e ning uchinchi zarbi). */}
        {ok && (
          <div className="rf-aha fade-step">
            <p className="rf-aha-t">{tr({ uz: '🎉 Ajoyib! Endi siz imkoniyatni emas, qiyinchilikni o\'ylaydigan bo\'ldingiz.', ru: '🎉 Отлично! Теперь вы думаете не о возможности, а о трудности.' })}</p>
            <p className="rf-aha-r">{tr({ uz: <><b>🎯 Bugungi qoida:</b> har bir imkoniyat bitta qiyinchilikni yo'qotishi kerak.</>, ru: <><b>🎯 Правило дня:</b> каждая возможность должна убирать одну трудность.</> })}</p>
          </div>
        )}
        <MentorNote>{tr({ uz: "Sinfning uchdan biri «imkoniyat» o'rniga «sayt chiroyli bo'lsin» desa — kartalar ekranidagi fon musiqasini qayta ko'rsating, boshqa misolga o'tmang. Yakunda qo'l ko'tartiring: " + CLASS_ASKS.map(a => a.uz).join(' · '), ru: 'Если треть класса вместо возможности говорит «пусть сайт будет красивым» — снова покажите фоновую музыку с экрана карточек, на другой пример не переходите. В конце попросите поднять руку: ' + CLASS_ASKS.map(a => a.ru).join(' · ') })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA MA'LUMOTLARI (F-0803-04: alohida ekran emas — YAKUN ichida) =====
// F-0803-07: kapsula-tugma PmLesson2 etalonidan qaytarildi — suzuvchi dars-so'zlari bilan
const HW_TOKENS = [
  { t: { uz: 'juftlik', ru: 'пара' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'qiyinchilik', ru: 'трудность' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'imkoniyat', ru: 'возможность' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'keraksiz', ru: 'ненужное' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const HW_ROWS = [
  { b: { uz: 'Nechta', ru: 'Сколько' }, t: { uz: '2 ta yangi juftlik', ru: '2 новые пары' } },
  { b: { uz: 'Qayerdan', ru: 'Откуда' }, t: { uz: 'bugun keraksizlarga chiqqan bandlardan', ru: 'из пунктов, ушедших сегодня в ненужные' } },
  { b: { uz: 'Qayerga', ru: 'Куда' }, t: { uz: 'shu darsning ustaxona ekraniga', ru: 'на экран мастерской этого урока' } }
];
const HW_STEPS = [
  { uz: 'Keraksizlarga chiqqan bandni oling va uni kim uchun kerakli qilishini o\'ylang.', ru: 'Возьмите пункт, ушедший в ненужные, и подумайте, кому его сделать нужным.' },
  { uz: 'Shu odamning qiyinchiligini bir gapda yozing.', ru: 'Запишите трудность этого человека одним предложением.' },
  { uz: 'Uni yo\'qotadigan imkoniyatni yozing va saqlang.', ru: 'Напишите возможность, которая её убирает, и сохраните.' }
];

// ============================================================ LESSON ROOT
// Podium yorliqlari (scored indeks -> qisqa nom)
const Q_LABELS = {
  3: { uz: 'Imkoniyat qaysi savoldan boshlanadi', ru: 'С какого вопроса начинается возможность' },
  5: { uz: 'Egasiz imkoniyat', ru: 'Возможность без хозяина' },
  9: { uz: 'Juftlik qanday yoziladi', ru: 'Как пишется пара' },
  12: { uz: 'Yangi so\'rov kelganda (yakuniy)', ru: 'Когда приходит новая просьба (итог)' }
};

// Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi). Amaliyot ekranlari = -1.
const INLINE_KEYS = { s3: 2, s5: 1, s9: 1, s12: 0, s8: -1, s10: -1, s11: -1 };

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
            {/* 📊 «Savollar bo'yicha» kartasi ATAYLAB YO'Q (etalon qarori — 90-qonun):
                proyektorda butun sinf oldida «0/4» ko'rsatish ochiq mag'lubiyat-tablosi bo'ladi.
                Mentor bu ma'lumotni dars PAYTIDA MentorTestStats orqali oladi — o'z joyida. */}
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
// Arena foni: suzuvchi dars tokenlari
const QZ_BG_SHAPES = [
  { ch: '🎟', l: 6, t: 18, s: 40, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: { uz: 'juftlik', ru: 'пара' }, l: 84, t: 12, s: 30, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: '💺', l: 9, t: 74, s: 38, c: 'rgba(255,110,70,0.15)', d: 27, dl: 0.8 },
  { ch: { uz: 'imkoniyat', ru: 'возможность' }, l: 74, t: 70, s: 24, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: '🗑', l: 46, t: 86, s: 28, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: '🕒', l: 66, t: 24, s: 34, c: 'rgba(80,200,255,0.14)', d: 17, dl: 0.4 },
  { ch: { uz: 'qiyinchilik', ru: 'трудность' }, l: 22, t: 36, s: 24, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: { uz: 'sayt', ru: 'сайт' }, l: 92, t: 46, s: 24, c: 'rgba(120,235,175,0.13)', d: 24, dl: 1.3 },
  { ch: '↔', l: 2, t: 46, s: 22, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: 'Imkoniyat (feature) nima?', ru: 'Что такое возможность (feature)?' }, opts: [{ uz: 'Saytning rangi va shrifti', ru: 'Цвет и шрифт сайта' }, { uz: 'Sayt beradigan bitta aniq foyda-ish', ru: 'Одна конкретная польза, которую даёт сайт' }, { uz: 'Saytning internetdagi manzili', ru: 'Адрес сайта в интернете' }, { uz: 'Saytni ochadigan dastur', ru: 'Программа, которая открывает сайт' }], correct: 1 },
  { q: { uz: 'Har imkoniyat qaysi savolga javob beradi?', ru: 'На какой вопрос отвечает каждая возможность?' }, opts: [{ uz: 'Uni necha kunda yasaymiz?', ru: 'За сколько дней мы её сделаем?' }, { uz: 'U sahifaning qaysi joyida turadi?', ru: 'В каком месте страницы она стоит?' }, { uz: 'U kimning qaysi qiyinchiligini yo\'qotadi?', ru: 'Чью и какую трудность она убирает?' }, { uz: 'U qancha turadi?', ru: 'Сколько она стоит?' }], correct: 2 },
  { q: { uz: 'Hech qanday qiyinchilikka bog\'lanmagan imkoniyat nima bo\'ladi?', ru: 'Что происходит с возможностью, не связанной ни с одной трудностью?' }, opts: [{ uz: 'Ro\'yxatdan chiqariladi', ru: 'Её убирают из списка' }, { uz: 'Eng oxirida qilinadi', ru: 'Её делают в самом конце' }, { uz: 'Ikki marta tekshiriladi', ru: 'Её проверяют дважды' }, { uz: 'Boshqa saytga beriladi', ru: 'Её отдают другому сайту' }], correct: 0 },
  { q: { uz: 'Juftlik-karta nechta bo\'lakdan iborat?', ru: 'Из скольких частей состоит карточка-пара?' }, opts: [{ uz: 'Bittadan', ru: 'Из одной' }, { uz: 'Uchtadan', ru: 'Из трёх' }, { uz: 'To\'rttadan', ru: 'Из четырёх' }, { uz: 'Ikkitadan', ru: 'Из двух' }], correct: 3 },
  { q: { uz: '«Sayt chiroyli bo\'lsin» — bu nimaning javobi?', ru: '«Пусть сайт будет красивым» — ответ на что?' }, opts: [{ uz: 'Seans vaqti noma\'lumligining', ru: 'На неизвестность времени сеанса' }, { uz: 'Hech qanday qiyinchilikning javobi emas', ru: 'Это ответ ни на одну трудность' }, { uz: 'Chipta qayerdan olinishining', ru: 'На то, где взять билет' }, { uz: 'Zalda joy bor-yo\'qligining', ru: 'На то, есть ли места в зале' }], correct: 1 },
  { q: { uz: 'Imkoniyat qanday yozilsa to\'g\'ri bo\'ladi?', ru: 'Как правильно записать возможность?' }, opts: [{ uz: 'Sayt nima qilishini aytadigan harakat bilan', ru: 'Действием, которое говорит, что делает сайт' }, { uz: 'Bitta sifat bilan', ru: 'Одним прилагательным' }, { uz: 'Kinoteatr nomi bilan', ru: 'Названием кинотеатра' }, { uz: 'Sana bilan', ru: 'Датой' }], correct: 0 },
  { q: { uz: 'Uzum ishni nimadan boshlagan?', ru: 'С чего начал Uzum?' }, opts: [{ uz: 'Reklama roliklaridan', ru: 'С рекламных роликов' }, { uz: 'Chiroyli bosh sahifadan', ru: 'С красивой главной страницы' }, { uz: 'O\'z yetkazib berish xizmatidan', ru: 'Со своей службы доставки' }, { uz: 'Chegirmalardan', ru: 'Со скидок' }], correct: 2 },
  { q: { uz: 'Uzumgacha odamlar asosan qayerdan xarid qilardi?', ru: 'Где в основном покупали до Uzum?' }, opts: [{ uz: 'Telegram va Instagram guruhlaridan', ru: 'В группах Telegram и Instagram' }, { uz: 'Faqat bozordan', ru: 'Только на базаре' }, { uz: 'Chet el saytlaridan', ru: 'На зарубежных сайтах' }, { uz: 'Gazeta e\'lonlaridan', ru: 'По объявлениям в газете' }], correct: 0 },
  { q: { uz: 'Uzum qachon mamlakatning birinchi «unicorn»i bo\'ldi?', ru: 'Когда Uzum стал первым «единорогом» страны?' }, opts: [{ uz: '2022-yil oktyabrda', ru: 'В октябре 2022 года' }, { uz: '2023-yil yanvarda', ru: 'В январе 2023 года' }, { uz: '2025-yil dekabrda', ru: 'В декабре 2025 года' }, { uz: '2024-yil martda', ru: 'В марте 2024 года' }], correct: 3 },
  { q: { uz: '«Unicorn» degani nima?', ru: 'Что означает «единорог»?' }, opts: [{ uz: 'Eng ko\'p ishchisi bor kompaniya', ru: 'Компания с самым большим числом работников' }, { uz: '1 milliard dollardan yuqori baholangan kompaniya', ru: 'Компания, оценённая дороже 1 миллиарда долларов' }, { uz: 'Eng eski kompaniya', ru: 'Самая старая компания' }, { uz: 'Faqat internetda ishlaydigan kompaniya', ru: 'Компания, работающая только в интернете' }], correct: 1 },
  { q: { uz: 'Kinoteatr egasi yangi imkoniyat so\'radi. Birinchi nima qilinadi?', ru: 'Владелец кинотеатра попросил новую возможность. Что делают первым?' }, opts: [{ uz: 'Darhol qo\'shiladi', ru: 'Сразу добавляют' }, { uz: 'Narxi hisoblanadi', ru: 'Считают стоимость' }, { uz: 'Qaysi qiyinchilikni yo\'qotishi so\'raladi', ru: 'Спрашивают, какую трудность она убирает' }, { uz: 'Boshqa saytlar ko\'riladi', ru: 'Смотрят другие сайты' }], correct: 2 },
  { q: { uz: 'Juftlik HTML ro\'yxatida qanday yoziladi?', ru: 'Как пара записывается в HTML-списке?' }, opts: [{ uz: 'Sarlavha tegi ichida, bitta so\'z bilan', ru: 'Внутри тега заголовка, одним словом' }, { uz: 'Rasm tegi bilan', ru: 'Тегом картинки' }, { uz: 'Havola tegi ichida', ru: 'Внутри тега ссылки' }, { uz: 'Bir bandda: qalin imkoniyat nomi, tiredan keyin qiyinchilik', ru: 'В одном пункте: жирное название возможности, после тире — трудность' }], correct: 3 },
];

const quizPts = (elapsedMs) => elapsedMs <= 500 ? 1000 : Math.max(0, Math.round(1000 * (1 - (Math.min(elapsedMs, QUIZ_MS) / QUIZ_MS) / 2)));
// 🎬 QzFX — arena foni: suzuvchi uchqun + bog'lovchi "web" chiziqlari + dars tokenlari (jang energiyasi).
// reduced-motion: matchMedia bilan darhol chiqadi (harakat yo'q). L1 QzFX mexanikasi, TOK shu darsning mavzusidan.
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = __lang === 'ru' ? ['пара', 'трудность', '🎟', '💺', '🕒', 'сайт'] : ['juftlik', 'qiyinchilik', '🎟', '💺', '🕒', 'sayt'];
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
              : <span className="qz-ansn">{streakUpTo(qi - 1) >= 2 ? tr({ uz: `🔥 ketma-ket ${streakUpTo(qi - 1)} ta`, ru: `🔥 ${streakUpTo(qi - 1)} подряд` }) : ' '}</span>}
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
                ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr({ uz: 'ball', ru: 'баллов' })}{streakUpTo(qi) >= 2 ? tr({ uz: ` · 🔥 ketma-ket ${streakUpTo(qi)} ta`, ru: ` · 🔥 ${streakUpTo(qi)} подряд` }) : ''}</span></>
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz.', ru: 'Ошиблись — 0 баллов. Возьмёте на следующем.' }) : tr({ uz: 'Vaqt tugadi — 0 ball. Keyingi savolda ulguring.', ru: 'Время вышло — 0 баллов. Успейте на следующем вопросе.' })}</span>}
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

// 🃏 FLASHCARDS — aktiv takrorlash (3D flip). Bugungi tushunchalar, 11 karta.
const PM4_FLASHCARDS = [
  { front: { uz: 'Imkoniyat (feature) nima?', ru: 'Что такое возможность (feature)?' }, back: { uz: 'Sayt beradigan bitta aniq foyda-ish', ru: 'Одна конкретная польза, которую даёт сайт' } },
  { front: { uz: 'Har imkoniyat qaysi savolga javob berishi kerak?', ru: 'На какой вопрос должна отвечать каждая возможность?' }, back: { uz: '«Bu kimning qaysi qiyinchiligini yo\'qotadi?»', ru: '«Чью и какую трудность это убирает?»' } },
  { front: { uz: 'Qiyinchiligi topilmagan imkoniyat nima bo\'ladi?', ru: 'Что происходит с возможностью без трудности?' }, back: { uz: 'Ro\'yxatdan chiqariladi', ru: 'Её убирают из списка' }, note: { uz: 'u hech kimga foyda bermaydi', ru: 'она никому не приносит пользы' } },
  { front: { uz: 'Juftlik-karta nimalardan iborat?', ru: 'Из чего состоит карточка-пара?' }, back: { uz: 'Ikki bo\'lakdan: qiyinchilik va uni yo\'qotadigan imkoniyat', ru: 'Из двух частей: трудность и возможность, которая её убирает' } },
  { front: { uz: 'Imkoniyat sifat bilan yozilsa nima bo\'ladi?', ru: 'Что будет, если записать возможность прилагательным?' }, back: { uz: 'Sayt nima qilishi noma\'lum qoladi', ru: 'Останется неизвестным, что делает сайт' }, note: { uz: 'shuning uchun harakat bilan yoziladi', ru: 'поэтому её пишут действием' } },
  { front: { uz: 'Bitta qiyinchilikka nechta imkoniyatdan boshlanadi?', ru: 'Со скольких возможностей начинают одну трудность?' }, back: { uz: 'Bittadan', ru: 'С одной' }, note: { uz: 'har imkoniyat o\'z qiyinchiligiga qaraydi', ru: 'каждая возможность смотрит на свою трудность' } },
  { front: { uz: 'Uzum ishni nimadan boshlagan?', ru: 'С чего начал Uzum?' }, back: { uz: 'O\'z yetkazib berish xizmatidan', ru: 'Со своей службы доставки' }, note: { uz: 'mashinalar va topshirish punktlari', ru: 'машины и пункты выдачи' } },
  { front: { uz: 'Nima uchun Uzum yetkazib berishdan boshlagan?', ru: 'Почему Uzum начал с доставки?' }, back: { uz: 'Eng katta qiyinchilik shu edi', ru: 'Это была самая большая трудность' }, note: { uz: 'olgan narsasi qo\'liga qanday yetib kelishi', ru: 'как купленное доберётся до рук' } },
  { front: { uz: '«Unicorn» nima degani?', ru: 'Что означает «единорог»?' }, back: { uz: '1 milliard dollardan yuqori baholangan kompaniya', ru: 'Компания, оценённая дороже 1 миллиарда долларов' } },
  { front: { uz: 'Kinoteatr egasi yangi imkoniyat so\'rasa, birinchi nima qilinadi?', ru: 'Если владелец кинотеатра просит новую возможность — что первым?' }, back: { uz: 'Qaysi qiyinchilikni yo\'qotishi so\'raladi', ru: 'Спрашивают, какую трудность она убирает' } },
  { front: { uz: 'Juftlik sahifada qanday ko\'rsatiladi?', ru: 'Как пара показывается на странице?' }, back: { uz: 'Ro\'yxat bandi bilan', ru: 'Пунктом списка' }, note: { uz: 'qalin imkoniyat nomi, tiredan keyin qiyinchilik', ru: 'жирное название возможности, после тире — трудность' } },
];

const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={PM4_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 18 — YAKUN =====
const RECAP_LINES = [
  { uz: 'Har bir imkoniyat bitta qiyinchilikning javobi bo\'ladi.', ru: 'Каждая возможность — это ответ на одну трудность.' },
  { uz: 'Qiyinchiligi topilmagan imkoniyat ro\'yxatdan chiqariladi.', ru: 'Возможность, для которой не нашлось трудности, убирается из списка.' },
  { uz: 'Imkoniyat sayt nima qilishini aytadigan harakat bilan yoziladi.', ru: 'Возможность пишется действием, которое говорит, что делает сайт.' },
  { uz: 'Eng katta internet-magazinlar ham eng og\'ir qiyinchilikdan boshlagan.', ru: 'Даже самые большие интернет-магазины начинали с самой тяжёлой трудности.' }
];
const ScreenSummary = ({ screen, answers, onReset, onPrev, onFinish }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorL = !!(live && live.mode === 'mentor');
  const isLiveLesson = !!(live && (live.mode === 'mentor' || (live.mode === 'student' && live.status !== 'ended')));
  const correct = SCORED_IDX.filter(i => answers[i] && answers[i].correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const earned = useContext(AchCtx);
  const achTotal = Object.keys(ACHIEVEMENTS).length;
  const achGot = earned ? earned.size : 0;
  // ⚔️ CodeStrike — alohida ekran emas, YAKUN ichida (F-0803-04, P0 PmUserStory naqshi)
  const [arena, setArena] = useState(false);
  const [arenaSolo, setArenaSolo] = useState(false);
  const quizSt = (live && live.quiz && live.quiz.state) || 'off';
  const isStudentL = !!(live && live.mode === 'student');
  const classOver = !!(live && (live.status === 'ended' || !live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== 'done';
  const studentLive = isStudentL && !studentSolo && quizSt !== 'off';
  const studentWait = isStudentL && !studentSolo && quizSt === 'off';
  const openArena = async () => {
    if (isMentorL && quizSt === 'off') { try { await live.quizControl('lobby', -1); } catch (_e) { return; } }
    setArenaSolo(studentSolo); setArena(true);
  };
  // 📝 Uyga vazifa — alohida ekran emas, YAKUN ichida
  const [openHw, setOpenHw] = useState(false);
  const [charge, setCharge] = useState(false);
  const fire = () => { if (charge || openHw) return; setCharge(true); setTimeout(() => { setOpenHw(true); setCharge(false); }, 500); };
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      <div className="screen">
        <div className="hero">
          <div className="hero-l">
            <span className="done-chip fade-up"><span className="tick">{Ico.check(11)}</span> {tr({ uz: 'Juftlik-kartalaringiz tayyor', ru: 'Ваши карточки-пары готовы' })}</span>
            <h2 className="title h-title fade-up d1">{isLiveLesson
              ? tr({ uz: <>Bugun har imkoniyatni <span className="italic" style={{ color: T.accent }}>o'z qiyinchiligiga</span> qo'shishni o'rgandik.</>, ru: <>Сегодня мы научились ставить каждую возможность <span className="italic" style={{ color: T.accent }}>к своей трудности</span>.</> })
              : tr({ uz: <>Endi siz har imkoniyatni <span className="italic" style={{ color: T.accent }}>o'z qiyinchiligiga</span> qo'sha olasiz.</>, ru: <>Теперь вы можете ставить каждую возможность <span className="italic" style={{ color: T.accent }}>к своей трудности</span>.</> })}</h2>
            {/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}
          </div>
          {!isMentorL && <ScoreRing correct={correct} total={total} />}
        </div>
        {/* ⚔️ CodeStrike — yakun sahifasining birinchi harakati (P0 naqshi) */}
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : undefined} />
        </div>
        {/* F-0803-07 — YAKUN TARTIBI PmLesson2 ETALONIGA TENGLASHTIRILDI:
            hero → CodeStrike → «Endi siz bilasiz» (to'liq enli) → «Uyga vazifa» kapsulasi.
            «📒 Juftliklaringiz» kartasi OLIB TASHLANDI (foydalanuvchi qarori): o'quvchi o'z
            juftliklarini ustaxona va sahifa-ekranlarida allaqachon ko'rgan — yakunda takror. */}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span style={{ color: T.success, display: 'inline-flex' }}>{Ico.check(15)}</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP_LINES.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck" style={{ display: 'inline-flex' }}>{Ico.check(15)}</span><span>{tr(r)}</span></li>))}</ul></div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${charge ? 'charging' : ''}`} onClick={fire}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, '--d': `${k.d}s` }}>{tr(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span>
            <span className="hw-big-s">{tr({ uz: 'Amaliy topshiriqni bajarish →', ru: 'Выполнить практическое задание →' })}</span>
          </button>
        </div>
        {openHw && (
          <div className="card hw fade-step">
            <ul>{HW_ROWS.map((r, i) => <li key={i}><b>{tr(r.b)}:</b> <span className="t">{tr(r.t)}</span></li>)}</ul>
            <ol className="hw-steps">{HW_STEPS.map((s, i) => <li key={i}><span className="hw-n">{i + 1}</span>{tr(s)}</li>)}</ol>
            <p className="hw-note">{tr({ uz: 'Qisqa variant: kodingni tugating (uchala shart ✓) va ustaxonaga bitta yangi juftlik qo\'shing.', ru: 'Короткий вариант: допишите код (все три условия ✓) и добавьте в мастерскую одну новую пару.' })}</p>
          </div>
        )}
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

export default function PmLesson4({ lang: langProp, onFinished }) {
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
  const startTimeRef = useRef((saved && saved.startedAt) || Date.now());
  // 🏅 Nishonlar
  const earnedRef = useRef(new Set((saved && saved.earned) || []));
  const [earned, setEarned] = useState(() => new Set((saved && saved.earned) || []));
  const [achToasts, setAchToasts] = useState([]);
  const achKeyRef = useRef(0);
  const earn = useCallback((id) => {
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts(t => [...t, { id, k: ++achKeyRef.current }]);
  }, []);

  // ETALON — 1920px: keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // 🃏 Flashcard jonli darsda FAQAT MENTORGA ko'rinadi (proyektorda jamoaviy takrorlash);
  // jonli o'quvchidan yashirin — sakrab o'tiladi. Erkin qilinsa / uzilsa / self — ochiladi.
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 's17');
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
    // MCScreen yakuniy ekranda signal QuestionScreen'dan (haqiqiy picked + vaqt bilan) ketadi —
    // bu yerdan takror yuborilsa (picked:0, elapsed:0) server-yozuvi poygada buzilardi.
    if (_m && _m.scored && _m.scope === 'final' && _m.template !== 'MCScreen' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);
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

  // ⚠️ TARTIB SCREEN_META bilan AYNAN bir xil (indeks-siljish bug-sinfi)
  // ⚠️ TARTIB SCREEN_META bilan AYNAN bir xil (indeks-siljish bug-sinfi, DARS_ETALON 4-bo'lim)
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, ScreenWorkshop, Screen9, ScreenClean, ScreenCoding, Screen12, Screen13, ScreenPodium, ScreenFlashcards, ScreenSummary];
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
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* F-0803-07 — uyga vazifa KAPSULASI PmLesson2 etalonidan qaytarildi
           (foydalanuvchi qarori: yakun tartibi PmLesson2 day bo'lsin). */
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
        /* 🔓 Takrorlash-yo'li: JIM matn-havola. Ataylab tugma EMAS va ataylab xira —
           asosiy harakat (kompilyatorni ochish) bilan raqobatlashmasin, faqat kerak
           bo'lganga ko'rinsin. Hoverda aniqlashadi. */
        .stq-skip { margin-top: 2px; background: none; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-decoration: underline; text-underline-offset: 3px; padding: 4px 6px; border-radius: 8px; transition: color 0.15s; }
        .stq-skip:hover { color: ${T.accent}; }

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
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); border-left: 4px solid ${T.amber}; }
        .mstats-verdict.good { background: ${T.successSoft}; border-left: 4px solid ${T.success}; }
        .mstats-verdict.few { background: rgba(${T.shadowBase},0.08); border-left: 4px solid ${T.ink3}; }
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
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .option:hover:not(:disabled) { background: #FBFAFE; transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -8px rgba(18,169,104,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.5 !important; box-shadow: none !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.34) !important; }


        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -7px rgba(${T.shadowBase},0.16); }

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
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(${T.shadowBase},0.16); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        .progress-track { height: 3px; background: rgba(${T.shadowBase},0.16); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

        /* === FRAME === */
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(91,61,230,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(18,169,104,0.22); }

        /* Kod-oyna / brauzer-oynachasi svetoforchasi (s11 · kompilyator) */
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .lock { color: ${T.success}; font-size: 8px; }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }

        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 22px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; } .ta-bulb { } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; }

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
        .rc-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(${T.shadowBase},0.22); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
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
        /* CodeStrike CTA konteyneri (ko'rinishni .cs-cta neon-kapsulasi beradi) */
        .qz-cta { display: flex; flex-wrap: wrap; }

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
        /* pod-qstats/qstat-* CSS ATAYLAB YO'Q — 90-qonun (10-B): karta bilan birga qoldiqsiz olib tashlandi. */


        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(14,134,196,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(14,134,196,0.22); }

        /* === .qcode kod-chip (backtick) — CHIP STILI → Dizayn === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(${T.shadowBase},0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode, .qz-opt .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }

        /* === 🃏 FLASHCARDS (3D flip) === */
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
        @keyframes fc-stamp { from { transform: translate(-50%,-50%) scale(0); } }
        .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .fc-card.flip { transform: rotateY(180deg); }
        .fc-card:not(.flip):hover { transform: translateY(-3px); }
        .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
        .fc-front { background: ${T.paper}; border: 2px solid ${T.line}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, ${T.accentVivid}, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(91,61,230,0.6); }
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
        .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
        .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
        .fc-done-emoji { font-size: 40px; }
        .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
        .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }

        /* === 🏅 NISHON — yuqori panel hisoblagichi + to'liq-ekran bayram === */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(91,61,230,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(91,61,230,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(91,61,230,0); } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 232px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
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
        /* Kapsula IXCHAM: so'z kattaligi o'zgarmaydi, faqat ichki bo'shliq qisqaradi (P0 qarori). */
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

        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } .fc-fly, .acu-medal, .acu-rays { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }

        /* === K11 SLAYD (s4) === */
        .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        .k-slide::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}, ${T.blue}); }
        .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
        .k-slide-ic { font-size: clamp(40px,7vw,64px); line-height: 1; }
        .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(20px,3.2vw,30px); color: ${T.ink}; margin: 0; }
        .k-slide-body { font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; } .k-slide-body b { color: ${T.ink}; }
        .k-dots { display: flex; gap: 8px; justify-content: center; }
        .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(${T.shadowBase},0.22); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }

        /* === 🎲 KEYS-TAXMIN (s4) — slayd oldidan mikro-tikish; BALL EMAS, sof o'yin === */
        .kp-bet { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        .kp-bet::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: repeating-linear-gradient(90deg, ${T.accent} 0 14px, ${T.accentSoft} 14px 22px); }
        .kp-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .kp-chip { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); padding: 12px 18px; border-radius: 99px; border: none; background: ${T.bg}; color: ${T.ink}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: transform 0.16s, box-shadow 0.16s; }
        .kp-chip:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 10px 20px -8px rgba(${T.shadowBase},0.24); }
        /* press-holat: bosilganda ichkariga cho'kadi (tap affordance) */
        .kp-chip:active { transform: translateY(0) scale(0.94); box-shadow: inset 0 0 0 1.5px ${T.accent}, inset 0 3px 7px -3px rgba(${T.shadowBase},0.25); color: ${T.accent}; }
        .kp-ic { font-size: 19px; }
        /* taxmin natijasi: topdi = yashil · topmadi = NEYTRAL indigo (qizil EMAS — bu ball emas, o'yin) */
        .kp-res { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fade-step 0.3s ease-out; }
        .kp-res.hit { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .kp-res.miss { color: ${T.accent}; background: ${T.accentSoft}; }
        /* reveal: yumshoq indigo glow-to'lqin */
        .k-slide.revealed { animation: fade-step 0.3s ease-out, kp-glow 0.9s ease-out; }
        @keyframes kp-glow { 0% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), 0 0 0 0 rgba(91,61,230,0.4); } 70% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), 0 0 0 16px rgba(91,61,230,0); } 100% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); } }
        @media (prefers-reduced-motion: reduce) { .kp-chip, .kp-chip:hover, .kp-chip:active { transition: none; transform: none; } .k-slide.revealed, .kp-res { animation: none; } }

        /* === USTAXONA: maydon-uslublari (smini-f/swcard-fields — muharrirda ishlatiladi) === */
        @keyframes card-fill-pop { 0% { transform: scale(1); } 40% { transform: scale(1.012) translateY(-2px); } 100% { transform: scale(1); } }
        .smini-f { display: flex; flex-direction: column; gap: 4px; }
        .smini-f span { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.06em; color: ${T.ink3}; }
        .smini-f input { font-family: 'Manrope'; font-weight: 500; font-size: 14px; color: ${T.ink}; border: none; border-radius: 9px; padding: 9px 11px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.18s; width: 100%; }
        .smini-f input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .smini-f.on input { box-shadow: inset 0 0 0 1.5px ${T.success}66; background: ${T.paper}; }
        /* === USTAXONA v3: bittalab-muharrir (swed) + saqlanganlar-daftari (svd) === */
        /* JTBD-portlar (F-0727-58): havodagi 1-2-3 indikator + rangli inputlar */
        .jw-steps { display: flex; align-items: flex-start; justify-content: center; gap: 12px; padding: 2px 0 4px; }
        .jws { display: inline-flex; flex-direction: column; align-items: center; gap: 5px; min-width: 80px; }
        .jws-n { width: clamp(38px,4.6vw,44px); height: clamp(38px,4.6vw,44px); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(15px,1.8vw,18px); font-style: normal; color: ${T.ink3}; border: 2px dashed ${T.ink3}55; background: ${T.paper}; transition: all 0.3s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .jws-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(10.5px,1.3vw,12px); font-style: normal; color: ${T.ink3}; max-width: 110px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .jws.cur .jws-n { border-style: solid; border-color: ${T.accent}; color: ${T.accent}; background: ${T.accentSoft}; animation: jws-pulse 1.6s ease-in-out infinite; }
        .jws.cur .jws-t { color: ${T.accent}; }
        @keyframes jws-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(110,75,255,0.4); } 50% { box-shadow: 0 0 0 9px rgba(110,75,255,0); } }
        /* Navbat maydonlarda yurayotganda qadam-indikatori tinch turadi (88-qonun (a): lahzada bitta) */
        .jw-steps.turn-quiet .jws.cur .jws-n { animation: none; }
        .jws.on .jws-n { border-style: solid; border-color: ${T.success}; background: ${T.success}; color: #fff; }
        .jws.on .jws-t { color: ${T.success}; }
        /* KUTAYOTGAN qadam ataylab xira — ko'z HOZIRGI qadamga boradi (F-0803-01) */
        .jws.wait { opacity: 0.45; }
        .svd.full { width: 100%; display: flex; flex-direction: column; gap: 10px; }
        @media (prefers-reduced-motion: reduce) { .jws.cur .jws-n { animation: none; } }
        .swed { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,2.4vw,22px); display: flex; flex-direction: column; gap: 13px; box-shadow: 0 12px 30px -10px rgba(${T.shadowBase},0.2); border-left: 5px solid ${T.accent}; }
        .swed-tag { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; padding: 4px 12px; border-radius: 99px; color: ${T.accent}; background: ${T.accentSoft}; }
        /* Gap-slotlari formula-konstruktor (s3) ranglarida: bo'sh = xira-punktir, to'lgan = o'z rangi */
        /* F-0803-01 — YOZUVGA JAVOB: xato (binafsha, savol) va tasdiq (yashil) bir joyda,
           forma OSTIDA — o'quvchi yozgan zahoti javob o'sha yerdan chiqadi. */
        /* klass ikki marta — F-0803-27, sabab «.oc-pain.oc-pain» izohida */
        .swed-fb.swed-fb { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; line-height: 1.45; border-radius: 10px; padding: 10px 13px; }
        .swed-fb.bad { color: ${T.accent}; background: ${T.accentSoft}; }
        .swed-fb.ok { color: ${T.success}; background: ${T.successSoft}; }
        .swed-btns { display: flex; gap: 12px; justify-content: flex-end; align-items: center; }
        .swed-save { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 13px 26px; background: ${T.accent}; color: #fff; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.55); transition: all 0.18s; }
        .swed-save:hover:not(:disabled) { background: ${T.accentVivid}; transform: translateY(-1px); }
        .svd { background: linear-gradient(180deg, ${T.paper}, #FBFAFE); border-radius: 16px; padding: 15px 16px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.16); }
        .svd-card { background: ${T.successSoft}; border-radius: 12px; padding: 11px 13px; display: flex; flex-direction: column; gap: 6px; box-shadow: inset 0 0 0 1.5px ${T.success}44; animation: card-fill-pop 0.42s cubic-bezier(.34,1.5,.4,1); }
        .svd-card.editing { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
        @media (prefers-reduced-motion: reduce) { .svd-card { animation: none; } }
        .svd-top { display: flex; align-items: center; gap: 8px; }
        .svd-num { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; color: ${T.success}; }
        .svd-edit { margin-left: auto; background: ${T.paper}; border: none; border-radius: 8px; padding: 0 10px; height: 28px; font-family: 'Manrope'; font-weight: 700; font-size: 12px; white-space: nowrap; color: ${T.ink2}; cursor: pointer; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); transition: color 0.15s, transform 0.15s; }
        .svd-edit:hover { color: ${T.accent}; transform: scale(1.08); }
        .svd-sent { font-size: 13.5px; color: ${T.ink2}; line-height: 1.45; margin: 0; overflow-wrap: anywhere; }
        .svd-sent b { color: ${T.ink}; font-weight: 600; }
        /* === TEKSHIRUVCHI STOLI: bitta katta namuna-karta → hukm → sabab-chip → xulosa-strip === */

        /* === 🧑‍🏫 MENTORGA ESLATMA (proyektor-sir) === */
        .mnote { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 5px; cursor: pointer; }
        .mnote-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.blue}; display: flex; align-items: center; }
        .mnote-x { margin-left: auto; font-weight: 800; font-size: 10.5px; opacity: 0.7; text-transform: none; letter-spacing: 0; }
        .mnote-chip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; background: ${T.paper}; border: 1.5px dashed ${T.blue}; color: ${T.blue}; border-radius: 999px; padding: 4px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.04em; cursor: pointer; opacity: 0.4; transition: opacity 0.2s ease, transform 0.2s ease; }
        .mnote-chip:hover, .mnote-chip:focus-visible { opacity: 1; transform: translateY(-1px); }
        @media (hover: none) { .mnote-chip { opacity: 0.6; } }
        .mnote-body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.45; }
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; min-width: 0; overflow-wrap: anywhere; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
        .lp-mstats { background: ${T.paper}; border-radius: 14px; padding: 13px 15px; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }

        /* === s0 HOOK — ikki ro'yxat yonma-yon === */
        .hk-row { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(12px,2vw,20px); }
        @media (max-width: 700px) { .hk-row { grid-template-columns: 1fr; } }
        .hk-card { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; text-align: left; background: ${T.paper}; border: none; border-radius: 16px; padding: clamp(15px,2.4vw,22px); cursor: pointer; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.22); transition: transform 0.18s, box-shadow 0.18s, opacity 0.25s; min-width: 0; }
        .hk-card:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 16px 32px -12px rgba(${T.shadowBase},0.3); }
        .hk-card:disabled { cursor: default; }
        .hk-card.picked { box-shadow: inset 0 0 0 2.5px ${T.accent}, 0 14px 30px -12px rgba(91,61,230,0.4); }
        .hk-card.dim { opacity: 0.5; }
        .hk-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(15px,2vw,18px); color: ${T.ink}; }
        .hk-items { display: flex; flex-direction: column; gap: 7px; width: 100%; min-width: 0; }
        .hk-it { display: flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,15px); color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; }
        .hk-it i { font-style: normal; font-size: 16px; }
        .hk-vote { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 13px; }
        .hk-card.picked .hk-vote { color: #fff; background: ${T.accent}; }

        /* === s1 JUFTLIK-LENTA — natija-preview o'z-o'zidan yoziladi === */
        .jl { display: flex; flex-direction: column; gap: 10px; }
        .jl-row { display: grid; grid-template-columns: auto minmax(0,1fr) auto minmax(0,1fr); align-items: center; gap: 10px; background: ${T.paper}; border-radius: 14px; padding: 12px 15px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.2); opacity: 0; animation: jl-in 0.45s cubic-bezier(.2,.7,.2,1) forwards; animation-delay: var(--rd, 0.2s); min-width: 0; }
        @keyframes jl-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .jl-n { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; }
        .jl-pain, .jl-feat { font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.6vw,14.5px); border-radius: 10px; padding: 9px 12px; min-width: 0; overflow-wrap: anywhere; opacity: 0; animation: jl-fill 0.5s cubic-bezier(.3,1.4,.45,1) forwards; animation-delay: var(--fd, 0.5s); }
        .jl-pain { color: ${T.amberInk}; background: ${T.amberSoft}; }
        .jl-feat { color: ${T.success}; background: ${T.successSoft}; }
        .jl-link { font-size: 17px; color: ${T.ink3}; opacity: 0; animation: jl-fill 0.4s ease forwards; animation-delay: var(--fd, 0.7s); }
        @keyframes jl-fill { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: none; } }
        @media (max-width: 700px) { .jl-row { grid-template-columns: auto minmax(0,1fr); } .jl-link { display: none; } }
        @media (prefers-reduced-motion: reduce) { .jl-row, .jl-pain, .jl-feat, .jl-link { animation: none; opacity: 1; transform: none; } }

        /* === s2 OCHILADIGAN KARTALAR === */
        .oc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 700px) { .oc-grid { grid-template-columns: 1fr; } }
        .oc { background: ${T.paper}; border-radius: 14px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.2); overflow: hidden; min-width: 0; }
        .oc.seen { box-shadow: inset 0 0 0 1.5px ${T.success}55, 0 8px 20px -10px rgba(${T.shadowBase},0.2); }
        .oc-top { position: relative; width: 100%; display: flex; align-items: center; gap: 10px; background: none; border: none; padding: 13px 15px; cursor: pointer; text-align: left; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; }
        .oc-ic { font-size: 19px; }
        .oc-t { flex: 1; min-width: 0; overflow-wrap: anywhere; }
        .oc-arw { color: ${T.ink3}; font-size: 13px; transition: transform 0.25s ease; }
        .oc.on .oc-arw { transform: rotate(0deg); }
        .oc-top:hover { background: ${T.accentSoft}55; }
        .oc-top:active { transform: scale(0.99); }
        /* Ochilgan matn — QIYINCHILIK, shuning uchun amber (s1/s4/s8 bilan bir xil rang). */
        /* 🔴 F-0803-27 — KLASS IKKI MARTA YOZILGANI ATAYLAB (o'chirmang!): bu <p> elementi,
           yuqoridagi «.lesson-root p { margin:0; padding:0 }» reseti esa aniqligi bo'yicha
           (0,1,1) — bitta klassli qoidadan (0,1,0) KUCHLI. Ya'ni bir marta yozilsa, brauzer
           bu yerdagi margin/padding'ni JIMGINA o'chiradi (fon va burchak qoladi — shuning
           uchun blok «yarim buzuq» ko'rinadi). «.oc-pain.oc-pain» — aniqlik (0,2,0), aynan
           o'sha elementlarni tanlaydi, lekin resetdan ustun turadi. */
        .oc-pain.oc-pain { margin: 0 15px 14px; padding: 9px 12px; border-radius: 10px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; color: ${T.amberInk}; background: ${T.amberSoft}; min-width: 0; overflow-wrap: anywhere; }
        /* Javobi yo'q imkoniyat: fon sahifa foni bilan bir xil bo'lsa, matn kartadan
           tashqarida suzganday ko'rinardi (F-0803-27) — endi ingichka uzuq ramka bilan. */
        .oc-pain.empty { color: ${T.ink3}; background: transparent; border: 1.5px dashed ${T.ink3}66; font-style: italic; }

        /* === s4 JUFTLASH (sudrab-ulash) === */
        .mt-wrap { display: flex; flex-direction: column; gap: 12px; }
        .mt-rows { display: flex; flex-direction: column; gap: 9px; }
        .mt-row { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; align-items: center; background: ${T.paper}; border-radius: 14px; padding: 11px 14px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.18); cursor: pointer; min-width: 0; }
        .mt-row.filled { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 8px 20px -10px rgba(${T.shadowBase},0.18); cursor: default; }
        .mt-row.shake { animation: mt-shake 0.42s; }
        @keyframes mt-shake { 0%,100% { transform: none; } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .mt-pain { font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,15px); color: ${T.amberInk}; background: ${T.amberSoft}; border-radius: 10px; padding: 9px 12px; min-width: 0; overflow-wrap: anywhere; }
        .mt-slot { display: flex; min-width: 0; }
        .mt-empty { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; border: 1.5px dashed ${T.ink3}66; border-radius: 10px; padding: 9px 12px; width: 100%; text-align: center; }
        .mt-pool { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; background: ${T.bg}; border-radius: 14px; padding: 12px 14px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .mt-pool-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink3}; width: 100%; }
        .mt-chip { position: relative; display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 99px; padding: 10px 16px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -9px rgba(${T.shadowBase},0.22); transition: transform 0.16s, box-shadow 0.16s; min-width: 0; overflow-wrap: anywhere; }
        .mt-chip i { font-style: normal; font-size: 16px; }
        /* F-0802-13 — SUDRALADIGAN KARTA: chip emas, ushlanadigan karta (katta ikona + nom + tavsif).
           Qatorga tushgach .mt-chip.in ga aylanadi — kichrayishi «joyiga o'tirdi» degan javob. */
        .mt-card { display: flex; align-items: center; gap: 12px; text-align: left; font-family: 'Manrope', sans-serif; background: ${T.paper}; border: none; border-radius: 14px; padding: 12px 15px; cursor: pointer; flex: 1 1 230px; min-width: 0; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 8px 20px -10px rgba(${T.shadowBase},0.22); transition: transform 0.16s, box-shadow 0.16s; position: relative; }
        .mt-card:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.line}, 0 14px 26px -10px rgba(${T.shadowBase},0.3); }
        .mt-card-ic { font-size: 30px; line-height: 1; flex-shrink: 0; }
        .mt-card-tx { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .mt-card-t { font-weight: 800; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; overflow-wrap: anywhere; }
        .mt-card-d { font-weight: 600; font-size: clamp(11.5px,1.4vw,13px); line-height: 1.35; color: ${T.ink3}; overflow-wrap: anywhere; }
        .mt-card.held { background: ${T.accent}; box-shadow: 0 12px 26px -8px rgba(91,61,230,0.55); animation: mt-held 1.5s ease-in-out infinite; }
        .mt-card.held .mt-card-t { color: #fff; }
        .mt-card.held .mt-card-d { color: #FFFFFFCC; }
        .mt-chip:hover { transform: translateY(-2px); }
        .mt-chip.held { background: ${T.accent}; color: #fff; box-shadow: 0 10px 22px -8px rgba(91,61,230,0.55); animation: mt-held 1.5s ease-in-out infinite; }
        @keyframes mt-held { 0%,100% { box-shadow: 0 10px 22px -8px rgba(91,61,230,0.55), 0 0 0 0 rgba(91,61,230,0.35); } 60% { box-shadow: 0 10px 22px -8px rgba(91,61,230,0.55), 0 0 0 8px rgba(91,61,230,0); } }
        /* Qo'yilgan karta = IMKONIYAT (yashil) + snap-pop */
        .mt-chip.in { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; animation: mt-snap 0.36s cubic-bezier(.34,1.5,.4,1); }
        @keyframes mt-snap { 0% { transform: scale(0.82); } 60% { transform: scale(1.06); } 100% { transform: none; } }
        /* Drop-zona affordance: karta qo'lda turganda faqat bo'sh zonalar yorishadi */
        .mt-wrap.holding .mt-row:not(.filled) { box-shadow: inset 0 0 0 1.5px ${T.accent}55, 0 8px 20px -10px rgba(91,61,230,0.35); animation: mt-zone 1.7s ease-in-out infinite; }
        @keyframes mt-zone { 0%,100% { filter: none; } 55% { filter: brightness(1.03) saturate(1.06); } }

        /* === s7 TANLASH-RO'YXATI === */
        .pk-list { display: flex; flex-direction: column; gap: 8px; }
        /* F-0802-17 — TANLOV SEZILARLI BO'LSIN: butun qator bosiladi (u allaqachon <button>),
           tanlangach fon + halqa + ko'tarilish birga o'zgaradi va belgi «chiqib» keladi.
           Rang ATAYLAB binafsha (accent) — yashil bu darsda IMKONIYAT ma'nosini bildiradi
           (12-qatordagi amber/yashil semantikasi), qiyinchilikka yopishtirib bo'lmaydi. */
        .pk-row { display: flex; align-items: center; gap: 11px; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 13px 15px; cursor: pointer; box-shadow: 0 6px 16px -9px rgba(${T.shadowBase},0.2); font-family: 'Manrope'; font-weight: 600; font-size: clamp(13.5px,1.7vw,15.5px); line-height: 1.4; color: ${T.ink}; min-width: 0; transition: background 0.2s, box-shadow 0.2s, transform 0.2s; }
        .pk-row:hover:not(.on) { background: #FBFAFE; transform: translateY(-1px); }
        .pk-row.on { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 12px 24px -12px rgba(91,61,230,0.45); transform: translateY(-1px); }
        .pk-box { width: 24px; height: 24px; flex-shrink: 0; border-radius: 8px; border: 1.5px solid ${T.ink3}66; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; color: #fff; transition: background 0.18s, border-color 0.18s; }
        .pk-row.on .pk-box { background: ${T.accent}; border-color: ${T.accent}; animation: pk-pop 0.34s cubic-bezier(.34,1.56,.4,1); }
        @keyframes pk-pop { 0% { transform: scale(0.55); } 62% { transform: scale(1.18); } 100% { transform: none; } }
        .pk-t { flex: 1; min-width: 0; overflow-wrap: anywhere; }
        .pk-tag { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.blue}; background: ${T.blueSoft}; border-radius: 99px; padding: 3px 9px; }
        .pk-count { align-self: flex-start; display: inline-flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,15px); color: ${T.ink2}; background: ${T.paper}; border-radius: 99px; padding: 8px 17px; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: color 0.25s, background 0.25s, box-shadow 0.25s; }
        .pk-count-ic { font-size: 15px; color: ${T.ink3}; }
        .pk-count-n { font-size: clamp(16px,2vw,19px); color: ${T.accent}; }
        .pk-count.full { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .pk-count.full .pk-count-ic, .pk-count.full .pk-count-n { color: ${T.success}; }

        /* === s8 USTAXONA: juftlik-muharrir === */
        .pf-edit { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); gap: 10px; align-items: end; }
        @media (max-width: 620px) { .pf-edit { grid-template-columns: 1fr; } .pf-link { justify-self: center; } }
        .pf-link { font-size: 19px; color: ${T.ink3}; padding-bottom: 9px; transition: color 0.25s, transform 0.25s; }
        .pf-link.on { color: ${T.success}; transform: scale(1.15); }
        .smini-f.pain span { color: ${T.amberInk}; } .smini-f.feat span { color: ${T.success}; }
        .smini-f.pain input { box-shadow: inset 0 0 0 1.5px ${T.amber}66; }
        .smini-f.feat input { box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .smini-f.pain input:focus { box-shadow: inset 0 0 0 2px ${T.amber}; }
        .smini-f.feat input:focus { box-shadow: inset 0 0 0 2px ${T.success}; }

        /* === s10 RO'YXAT-TOZALASH === */
        .cl-list { display: flex; flex-direction: column; gap: 9px; }
        .cl-item { background: ${T.paper}; border-radius: 14px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.2); overflow: hidden; min-width: 0; }
        .cl-item.ok { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 8px 20px -10px rgba(${T.shadowBase},0.2); }
        .cl-top { position: relative; width: 100%; display: flex; align-items: center; gap: 10px; background: none; border: none; padding: 13px 15px; cursor: pointer; text-align: left; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; }
        .cl-ic { font-size: 19px; }
        .cl-t { flex: 1; min-width: 0; overflow-wrap: anywhere; }
        .cl-ok { color: ${T.success}; font-weight: 900; }
        .cl-arw { color: ${T.ink3}; font-size: 13px; transition: transform 0.25s ease; }
        .cl-top:hover { background: ${T.accentSoft}55; }
        .cl-top:active { transform: scale(0.99); }
        .cl-ok { animation: mt-snap 0.36s cubic-bezier(.34,1.5,.4,1); }
        .cl-body { display: flex; flex-direction: column; gap: 9px; padding: 0 15px 14px; }
        /* Ochilgan matn — QIYINCHILIK (amber, s1/s4/s8 bilan bir xil). Qiyinchiligi yo'q band — xira-neytral. */
        /* klass ikki marta — F-0803-27, sabab «.oc-pain.oc-pain» izohida */
        .cl-pain.cl-pain { margin: 0; padding: 9px 12px; border-radius: 10px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); color: ${T.amberInk}; background: ${T.amberSoft}; min-width: 0; overflow-wrap: anywhere; }
        .cl-pain.none { color: ${T.ink3}; background: transparent; border: 1.5px dashed ${T.ink3}66; font-style: italic; }
        .cl-shelf-btn { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.accent}; background: ${T.accentSoft}; border: none; border-radius: 99px; padding: 7px 15px; cursor: pointer; transition: transform 0.16s, box-shadow 0.16s; }
        .cl-shelf-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 14px -6px rgba(91,61,230,0.4); }
        /* Maslahat/eslatma — indigo: amber bu darsda FAQAT qiyinchilik, qizil FAQAT haqiqiy xato. */
        .cl-warn.cl-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 8px 11px; animation: fade-step 0.28s ease-out; }
        .cl-shelf { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; border: 1.5px dashed ${T.ink3}66; border-radius: 14px; padding: 12px 14px; }
        .cl-shelf-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink3}; width: 100%; }
        .cl-shelf-empty { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        .cl-chip { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; background: ${T.bg}; border-radius: 99px; padding: 8px 14px; box-shadow: inset 0 0 0 1.5px ${T.line}; min-width: 0; overflow-wrap: anywhere; }

        /* === s11 KODING: o'z juftliklari preview === */
        .stq-mine { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; }
        .stq-mine-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.accent}; }
        /* Juftlik-rangi s1/s4/s8/s10 bilan bir xil: imkoniyat = yashil, qiyinchilik = amber */
        .stq-mine-row { font-family: 'Manrope'; font-weight: 500; font-size: 12.5px; line-height: 1.45; color: ${T.amberInk}; min-width: 0; overflow-wrap: anywhere; }
        .stq-mine-row b { color: ${T.success}; font-weight: 700; }

        /* === s13 YAKUNIY SO'Z === */
        .rf-write { background: ${T.paper}; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.18); min-width: 0; }
        .rf-area { font-family: 'Manrope'; font-weight: 500; font-size: 14px; color: ${T.ink}; border: none; border-radius: 10px; padding: 11px 13px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; resize: vertical; width: 100%; min-width: 0; }
        .rf-area:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .rf-cnt { font-family: 'JetBrains Mono'; font-weight: 600; font-size: 11.5px; color: ${T.ink3}; }
        /* F-0803-03 — «AHA» LAHZASI: dars yozgandan KEYIN bitta qoida bilan yopiladi.
           Bu yagona joyda ekran hissiyot beradi — shuning uchun u boshqa bloklardan
           kattaroq va iliqroq (aksent-gradient), lekin ATIGI ikki qator. */
        .rf-aha { display: flex; flex-direction: column; gap: 8px; border-radius: 16px; padding: clamp(16px,2.4vw,22px) clamp(18px,2.6vw,24px); background: linear-gradient(135deg, ${T.accentSoft} 0%, ${T.successSoft} 100%); box-shadow: inset 0 0 0 1.5px ${T.accent}33; }
        .rf-aha-t { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.1vw,21px); line-height: 1.3; color: ${T.ink}; }
        .rf-aha-r { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink2}; }

        /* === s14 UYGA VAZIFA — qadamlar === */
        .hw-steps { list-style: none; display: flex; flex-direction: column; gap: 8px; margin: 12px 0 0; }
        .hw-steps li { display: flex; align-items: flex-start; gap: 10px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; line-height: 1.45; min-width: 0; overflow-wrap: anywhere; }
        .hw-n { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono'; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }

        /* === HARAKATNI KAMAYTIRISH (prefers-reduced-motion) — bu darsning O'Z ekranlari: s2, s4, s8, s10, s11 ===
           Har og'ir harakat shu yerda o'chadi; ekran-kirish fade'lari ham tinchlanadi. */
        @media (prefers-reduced-motion: reduce) {
          .fade-up, .fade-step { animation: none !important; opacity: 1 !important; transform: none !important; }
          .mt-chip.held, .mt-card.held, .mt-chip.in, .mt-row.shake, .pk-row.on .pk-box, .cl-ok,
          .mt-wrap.holding .mt-row:not(.filled) { animation: none !important; }
          .mt-chip, .mt-chip:hover, .mt-card, .mt-card:hover, .mt-row, .oc-top, .oc-top:active, .cl-top, .cl-top:active,
          .cl-shelf-btn, .cl-shelf-btn:hover, .hk-card, .hk-card:hover, .pk-row, .pf-link,
          .oc-arw, .cl-arw, .swed-save, .swed-save:hover, .kod-launch-btn, .kod-launch-btn:hover,
          .svd-edit, .svd-edit:hover, .rc-open, .rc-open-mini { transition: none !important; transform: none !important; }
          .jws.cur .jws-n, .swed-save, .mstats-reveal.ready { animation: none !important; }
          .oc-pain, .cl-pain, .cl-warn, .done-mini { animation: none !important; }
        }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
          <div className="lesson-root">
            {live.mode === 'choosing' ? (
              <LiveGate live={live} title={{ uz: '2-Modul', ru: 'Модуль 2' }} />
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
