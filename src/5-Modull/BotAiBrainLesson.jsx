import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 5-MODUL (Telegram bot + AI) · DARS 4 — «BOTJON O'YLAY BOSHLAYDI — MASLAHATCHI (AI)» — PLATFORM STANDARD v18 (AUDIOSIZ)
// Maqsad: o'quvchi LLM (🧭 MASLAHATCHI)ni botga «maslahatchi» sifatida tushunadi: 📜 YO'RIQNOMA (system prompt) —
//         xulqni belgilaydi, STOL USTI (kontekst oynasi) cheklangan va eskisi tushib ketadi, ERKINLIK MURVATI
//         (temperature) javobni qat'iy/xilma-xil qiladi, MASLAHATCHI ba'zan o'ylab topib (hallutsinatsiya) yolg'on
//         gapiradi — javobini har doim TEKSHIRISH kerak.
// 🤖 METAFORA — «BOTJON» (butun modul uchun yagona lug'at) + BU DARSNING YANGI BUYUMLARI:
//   🧭 MASLAHATCHI (LLM/model) — juda ko'p o'qigan, lekin SIZNI ESLAMAYDI (har safar hammasini qayta aytish kerak).
//   topshiriq=prompt · 📜 YO'RIQNOMA=system prompt (doimiy qoida) · STOL USTI=kontekst oynasi (joyi cheklangan,
//   to'lsa eng eski varaq tushib ketadi) · ERKINLIK MURVATI=temperature (past=qat'iy/bir xil, baland=erkin/xayolparast).
// INTERAKTIV BEAT'lar: s3 «Yomon topshiriq vs yaxshi topshiriq» · s5 MARKAZIY #1: «Yo'riqnomani o'zi yozadi»
//   (Rule Writer) · s6 «Ikki xabar — Maslahatchi eslamaydi» · s7 MARKAZIY #2: «Stol usti sinovi» (Table Manager) ·
//   s9 MARKAZIY #3: «Erkinlik murvati» (Dial Master) · s11 MARKAZIY #4: «Fact Checker — o'ylab topilgan pitsa» ·
//   s15 FINAL: xavfsiz ishlash sikli tartibi (DragDropOrder).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium (ball to'g'riligi — ⚡ Jonli roli).
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
  danger: '#C2362B', dangerSoft: '#FAE3E0', amber: '#B45309',
  line: '#E9E6DF',
  shadowBase: '58, 53, 48'
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
    if (nick.length < 2) { setJoinError(tr({ uz: 'Ismingizni kiriting (kamida 2 harf).', ru: 'Введите Ваше имя (минимум 2 буквы).' })); return; }
    setBusy(true); setJoinError('');
    try {
      const row = await liveGet(p);
      if (!row) { setJoinError(tr({ uz: 'Bunday kod topilmadi.', ru: 'Такой код не найден.' })); setBusy(false); return; }
      if (row.lesson_id && row.lesson_id !== lessonId) { setJoinError(tr({ uz: 'Bu kod boshqa darsga tegishli.', ru: 'Этот код относится к другому уроку.' })); setBusy(false); return; }
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
      <div style={{ fontSize: 'clamp(13px,2vw,18px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: LT.accent, marginBottom: 'clamp(14px,3vw,28px)' }}>{tr({ uz: "Jonli darsga qo'shilish", ru: 'Присоединиться к живому уроку' })}</div>
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
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{tr(title)}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Присоединиться к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и Ваше имя.' })}</p></div>
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
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "🔓 O'quvchilar erkin qilindi", ru: '🔓 Ученики освобождены' })}</div>;
    return (<>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr({ uz: 'Kod:', ru: 'Код:' })} <b style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr({ uz: "Kodni katta ko'rsatish", ru: 'Показать код крупно' })} style={{ marginLeft: 6, background: LT.ink, color: '#fff', border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: "📺 Ko'rsatish", ru: '📺 Показать' })}</button>
        <button onClick={() => { if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: 'Освободить учеников? Дальше они пойдут самостоятельно.' }))) live.endSession(); }} style={{ background: LT.accentSoft, color: LT.accent, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: '🔓 Erkin qilish', ru: '🔓 Освободить' })}</button>
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
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const LiveGateCtx = createContext(null); // JONLI: mentor-gate + live obyekti (Jonli roli Provider bilan ulaydi)

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

const LESSON_META = { lessonId: 'bot-ai-brain-05-04-v18', lessonTitle: { uz: 'Botjon o\'ylay boshlaydi — Maslahatchi (AI)', ru: 'Бот начинает думать' } };
// 20 ekran · 4.1 oqim: hook → reja → (exploration↔test)× → markaziy o'yin → builder → debugging-final → praktika → podium → flashcard → summary
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'builder',     template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's15', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'practice', type: 'practice',   template: 'custom', scored: false, scope: null },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }
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
            <div key={id} className={`ach-pop-row ${got ? 'got' : ''}`}><span className="ach-pop-ic">{got ? a.icon : '🔒'}</span><span className="ach-pop-nm">{tr(a.name)}</span></div>
          ); })}
        </div>
      )}
    </div>
  );
}

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, scrollSignal }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768); // mobil: Mentor yig'ilish rejimi
  const collapseOn = isNarrow && !mentorStatic; // ba'zi sahifalarda Mentor yig'ilmaydi
  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px + 60px
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); }, [screen]); // har ekranda Mentor ochiq holatdan boshlanadi
  // mobil: yangi bo'lak ochilganda pastga silliq surish (scrollSignal o'zgarsa)
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
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(label))}</button>;
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

const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `s15` — final (picked 0/1 sentinel, correct maydoni haqiqiy). `practice: -1` — sentinel (variant yo'q).
// ⚠️ Variant TARTIBI/qiymatlari 🎓 Metodist + ⚡ Jonli rollari tomonidan qayta balanslanadi — shu map ular bilan sinxron bo'lsin.
// ⚡ To'g'ri javob pozitsiyalari ATAYIN har xil (2 · 0 · 3 · 1) — «doim A» naqshi yo'q, o'qimay bosgan ball to'plamaydi.
// s15 (yakuniy DragDropOrder) — REAL kalit: picked=0 sentinel → 1-urinishda topdi (tartib to'g'ri yig'ilgandagina onSolved chaqiriladi).
const INLINE_KEYS = { s4: 2, s8: 0, s10: 3, s14: 1, s15: 0, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI). Matn 🎓 Metodist tomonidan sayqallanadi.
const RECAPS = {
  4: {
    title: { uz: "Maslahatchiga vazifa aytish kerak", ru: 'Советчику нужно поставить задачу' },
    cards: [
      { ic: "📚", h: { uz: "Juda ko'p biladi", ru: 'Знает очень много' }, body: { uz: <>🧭 Maslahatchi ko'p mavzuni biladi — lekin unga <b>nima haqida gapirish</b> kerakligi aytilmagan bo'lsa, hammasini gapiraveradi.</>, ru: <>🧭 Советчик знает массу тем — но если ему не сказали, <b>о чём именно говорить</b>, он расскажет обо всём подряд.</> } },
      { ic: "🙈", h: { uz: "Vazifasiz — adashadi", ru: 'Без задачи — теряется' }, body: { uz: <>Vazifasi (📜 yo'riqnoma) aytilmagan Maslahatchi mijozga <b>kerak bo'lmagan</b> narsalarni ham aytadi.</>, ru: <>Советчик без задачи (📜 инструкции) расскажет клиенту и то, что ему <b>совсем не нужно</b>.</> } },
      { ic: "📜", h: { uz: "Yechim — yo'riqnoma", ru: 'Решение — инструкция' }, body: { uz: <>Kim, qanday, qaysi chegarada gapirishini yozib bersangiz — javob aniq bo'ladi.</>, ru: <>Если написать, кто он, как говорит и в каких рамках — ответ станет точным.</> }, ask: { uz: "Yo'riqnomasiz Maslahatchi nega adashadi?", ru: 'Почему без инструкции Советчик теряется?' } },
    ]
  },
  8: {
    title: { uz: "Stol usti — kontekst oynasi", ru: 'Поверхность стола — окно контекста' },
    cards: [
      { ic: "🗂️", h: { uz: "Joyi cheklangan", ru: 'Места мало' }, body: { uz: <>Suhbat uchun ajratilgan «stol usti» cheklangan — u faqat oxirgi bir necha xabarni sig'diradi.</>, ru: <>«Стол», отведённый под разговор, ограничен — на нём помещается лишь несколько последних сообщений.</> } },
      { ic: "🍂", h: { uz: "Eng eski varaq tushadi", ru: 'Падает самый старый листок' }, body: { uz: <>Stol to'lsa, <b>eng eski xabar</b> tushib ketadi va Maslahatchi uni unutadi.</>, ru: <>Когда стол заполнен, <b>самое старое сообщение</b> падает вниз — и Советчик о нём забывает.</> } },
      { ic: "📓", h: { uz: "Yechim — daftar", ru: 'Решение — тетрадь' }, body: { uz: <>Muhim ma'lumotni (ism, buyurtma) 📓 daftarga yozib qo'ysangiz, u yo'qolmaydi.</>, ru: <>Если записать важное (имя, заказ) в 📓 тетрадь, оно не потеряется.</> }, ask: { uz: "Stol to'lganda qaysi xabar birinchi tushib ketadi?", ru: 'Какое сообщение упадёт первым, когда стол заполнится?' } },
    ]
  },
  10: {
    title: { uz: "Erkinlik murvati — temperature", ru: 'Ручка свободы — temperature' },
    cards: [
      { ic: "❄️", h: { uz: "Past — qat'iy", ru: 'Низко — строго' }, body: { uz: <>Murvat past bo'lsa, Maslahatchi <b>deyarli bir xil</b> javob beradi — aniqlik kerak bo'lganda shu tanlanadi.</>, ru: <>При низкой ручке Советчик отвечает <b>почти одинаково</b> — так выбирают, когда нужна точность.</> } },
      { ic: "🔥", h: { uz: "Baland — erkin", ru: 'Высоко — свободно' }, body: { uz: <>Murvat baland bo'lsa, javob har safar <b>boshqacha</b> bo'ladi — ijodkorlik uchun yaxshi.</>, ru: <>При высокой ручке ответ каждый раз <b>другой</b> — это хорошо для творчества.</> } },
      { ic: "⚠️", h: { uz: "Xavf — o'ylab topish", ru: 'Опасность — выдумки' }, body: { uz: <>Baland murvatda Maslahatchi ba'zan haqiqatga to'g'ri kelmaydigan narsa aytishi mumkin.</>, ru: <>При высокой ручке Советчик иногда говорит то, чего на самом деле нет.</> }, ask: { uz: "Menyuni bir xil aytish uchun qaysi murvat tanlanadi?", ru: 'Какую ручку выбрать, чтобы меню звучало всегда одинаково?' } },
    ]
  },
  14: {
    title: { uz: "Faktlarni tekshirish — hallutsinatsiya", ru: 'Проверка фактов — галлюцинация' },
    cards: [
      { ic: "🧭", h: { uz: "Maslahatchi ishonchli tuyuladi", ru: 'Советчик звучит уверенно' }, body: { uz: <>Maslahatchi hatto noto'g'ri javobni ham <b>ishonchli ohangda</b> aytadi.</>, ru: <>Даже неверный ответ Советчик произносит <b>уверенным тоном</b>.</> } },
      { ic: "🍍", h: { uz: "O'ylab topilgan fakt", ru: 'Выдуманный факт' }, body: { uz: <>«Ananasli pitsa» kabi mavjud bo'lmagan narsani ham aytib qo'yishi mumkin — bu hallutsinatsiya.</>, ru: <>Он может назвать то, чего нет — например «пиццу с ананасом». Это и есть галлюцинация.</> } },
      { ic: "🔍", h: { uz: "Yechim — solishtirib tekshirish", ru: 'Решение — сверять' }, body: { uz: <>Narx va faktlarni har doim haqiqiy manba (menyu) bilan solishtiring.</>, ru: <>Цены и факты всегда сверяйте с настоящим источником (с меню).</> }, ask: { uz: "Maslahatchi javobini qachon tekshirish kerak?", ru: 'Когда нужно проверять ответ Советчика?' } },
    ]
  },
  15: {
    title: { uz: "Xavfsiz ishlash sikli", ru: 'Цикл безопасной работы' },
    cards: [
      { ic: "📜", h: { uz: "Avval — yo'riqnoma", ru: 'Сначала — инструкция' }, body: { uz: <>Birinchi qadam — Maslahatchiga <b>aniq vazifa</b> berish (kim, qanday, chegara).</>, ru: <>Первый шаг — дать Советчику <b>чёткую задачу</b> (кто он, как говорит, где границы).</> } },
      { ic: "🎚️", h: { uz: "Keyin — murvat va javob", ru: 'Потом — ручка и ответ' }, body: { uz: <>Vaziyatga mos murvat tanlanadi, so'ng Maslahatchidan <b>javob</b> olinadi.</>, ru: <>Выбираем подходящую ручку, затем получаем от Советчика <b>ответ</b>.</> } },
      { ic: "🔍", h: { uz: "Eng oxiri — tekshirish va daftar", ru: 'В самом конце — проверка и тетрадь' }, body: { uz: <>Javob tekshiriladi, muhimi 📓 daftarga yoziladi.</>, ru: <>Ответ проверяем, важное записываем в 📓 тетрадь.</> }, vis: { uz: <RcFlow items={['📜 Yo\'riqnoma', '🎚️ Murvat', '💬 Javob', '🔍 Tekshirish', '📓 Daftar']} />, ru: <RcFlow items={['📜 Инструкция', '🎚️ Ручка', '💬 Ответ', '🔍 Проверка', '📓 Тетрадь']} /> }, ask: { uz: "Nega tekshirish javobni olishdan keyin bo'ladi?", ru: 'Почему проверка идёт после получения ответа?' } },
    ]
  }
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
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: '✓ Tushunarli — davom etamiz', ru: '✓ Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Дальше →' })}</button>}
      </div>
    </div>
  );
}
// MENTOR (proyektor): jonli test statistikasi — «Natijani ochish»gacha ✅/❌ soni yashirin (Kahoot-reveal).
// Sanoq FAQAT bitta manbadan: picked === correctIdx (server-kalit bilan mos).
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
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : tr({ uz: <>Javob berdi: <b>{answered}</b> / {total}</>, ru: <>Ответили: <b>{answered}</b> / {total}</> })}</span>
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
        <p className="mstats-hidden">{tr({ uz: '🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o\'quvchilar ekranida ham birdan ochiladi.', ru: '🙈 Кто что выбрал и сколько ✅/❌ — пока скрыто. Нажмёте «Открыть результат» — откроется сразу и у Вас, и на экранах учеников.' })}</p>
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
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? tr({ uz: `${n} o'quvchi · ${pct}%`, ru: `${n} учеников · ${pct}%` }) : '—'}</span>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тема классу не зашла. Перед продолжением советуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish — ', ru: '📖 Объяснить заново — ' })}{tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 Верно <b>{pct}%</b> — неплохо. При желании коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ Верно <b>{pct}%</b> — класс тему усвоил. Спокойно продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: `Javob berganlar kam (${answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.`, ru: `Ответивших мало (${answered}) — по процентам вывод делать сложно. Оцените сами.` })}</p>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Советуем объяснить заново.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в живом режиме…' })}</p>}
    </div>
  );
}

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: 'on_mount', waits_for: { type: 'option_picked' } }] : null);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student'); // jonli dars: BITTA urinish — xato bo'lsa ham qotadi
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now()); // tezlik: savol ochilgandan bosishgacha (teng ballda hal qiladi)
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  // MENTOR (proyektor): o'zi javob BERMAYDI — «Natijani ochish» bosilguncha to'g'ri javob sir saqlanadi.
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
  // 📖 Qayta tushuntirish (recap) — natija past chiqsa mentor ochadi; o'quvchi xato qilsa o'zi ham ochishi mumkin
  const [recapOpen, setRecapOpen] = useState(false);
  const hasRecap = !!RECAPS[screen];
  const doReveal = () => { setMReveal(true); if (live) live.mentorReveal(screen); if (storedAnswer === undefined) onAnswer(screen, { mentorRevealed: true }); };
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
  // KAHOOT REVEAL: jonli darsda javob bosilgach to'g'ri/XATO ham sir — faqat «javob qabul qilindi».
  // Mentor «Natijani ochish»/keyingi sahifa/dars tugashi bilan hammada birdan ochiladi.
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed; // javob qotdi — natija mentordan kutilmoqda
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, жмите обдуманно!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (isMentorLive) {
              if (mReveal) { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; } // reveal'gacha hammasi neytral
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
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете верный ответ.' })
                : wrongLocked
                  ? fmtCode(explainWrong[picked] ?? explainWrong.default)
                  : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
          </p>
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi.
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue">{tr({ uz: " · ko'rsatmani ochish ▾", ru: ' · открыть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

const Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: 'italic' }}>{children}</span>;

// ===== MOCK TERMINAL =====
const Term = ({ title = 'Terminal', children, minH }) => (
  <div className="term"><div className="term-bar"><span className="bb-dots"><i /><i /><i /></span><span className="term-title">{tr(title)}</span></div><div className="term-body" style={{ minHeight: minH }}>{children}</div></div>
);
const TLine = ({ cmd, out, col }) => (
  <div className="el-in tline">{cmd ? <><span style={{ color: CODE.str }}>$</span> <span style={{ color: CODE.text }}>{cmd}</span></> : <span style={{ color: col || CODE.comment }}>{out}</span>}</div>
);

// ===== 📱 TELEGRAM CHAT (jonli ko'rinish) =====
const TgChat = ({ title = { uz: 'Botjon', ru: 'Ботик' }, ava = '🤖', status = { uz: 'bot · onlayn', ru: 'бот · онлайн' }, children, minH }) => (
  <div className="tg">
    <div className="tg-head"><span className="tg-ava">{ava}</span><span className="tg-name">{tr(title)}<span className="tg-status">{tr(status)}</span></span></div>
    <div className="tg-body" style={{ minHeight: minH }}>{children}</div>
  </div>
);
const Bubble = ({ from = 'bot', children, muted, thinking }) => <div className={`tg-bubble ${from} el-in ${muted ? 'muted' : ''}`}>{thinking ? <span className="gen-dots inline"><i /><i /><i /></span> : children}</div>;
const TgBtns = ({ items }) => <div className="tg-btns el-in">{items.map((b, i) => <span key={i} className="tg-btn">{b}</span>)}</div>;
// ===== 📜 YO'RIQNOMA (system prompt) kartasi =====
const PromptCard = ({ children, who = { uz: "📜 YO'RIQNOMA", ru: '📜 ИНСТРУКЦИЯ' }, tone }) => (
  <div className={`prompt-card ${tone || ''}`}><span className="prompt-who">{tr(who)}</span><p className="prompt-text">{children}</p></div>
);
// ===== 🎒 JIHOZLAR PANELI (butun 5-modulda qayta ishlatiladi) =====
const GEAR_SLOTS = [
  { id: 'key',   ico: '🔑', label: { uz: 'Kalit', ru: 'Ключ' } },
  { id: 'sheet', ico: '📋', label: { uz: "Qoidalar varag'i", ru: 'Лист правил' } },
  { id: 'btn',   ico: '🔘', label: { uz: 'Tugmalar', ru: 'Кнопки' } },
  { id: 'env',   ico: '✉️', label: { uz: 'Konvert (ctx)', ru: 'Конверт (ctx)' } },
  { id: 'note',  ico: '📓', label: { uz: 'Holat daftari', ru: 'Тетрадь состояния' } },
  { id: 'menu',  ico: '🧭', label: { uz: "Yo'l-yo'riq", ru: 'Наставление' } },
  { id: 'tools', ico: '🧰', label: { uz: 'Vositalar', ru: 'Инструменты' } },
  { id: 'star',  ico: '⭐', label: { uz: 'AI yordamchi', ru: 'AI-помощник' } }
];
const GearPanel = ({ active = [] }) => (
  <div className="gear-panel">
    {GEAR_SLOTS.map(g => (
      <div key={g.id} className={`gear-slot ${active.includes(g.id) ? 'on' : ''}`}>
        <span className="gear-ico">{g.ico}</span>
        <span className="gear-lbl">{tr(g.label)}</span>
      </div>
    ))}
  </div>
);

function DragDropOrder({ items, hints, onSolved, doneText, onChange }) {
  const order = items.map(x => x.id);
  const byId = useMemo(() => Object.fromEntries(items.map(x => [x.id, x])), [items]);
  // YAGONA holat — pool va slots birga (setState ichida setState YO'Q → StrictMode'da dublikat bo'lmaydi)
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
  useEffect(() => { onChange && onChange(slots); }, [slots]); // eslint-disable-line
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
            {sid ? <button key={sid} className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr(byId[sid].label)}</button> : <span className="dd-hint">{hints ? tr(hints[i]) : tr({ uz: 'bu yerga joylang', ru: 'поместите сюда' })}</span>}
          </div>
        ))}
      </div>
      <div className="dd-pool">
        {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: 'Порядок неверный — нажмите на кусочек, верните его и разложите заново' })}</span>}
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>
      {solved && <div className="dd-done">✓ {tr(doneText) || tr({ uz: "To'g'ri tartib!", ru: 'Порядок верный!' })}</div>}
      {wrong && !solved && <div className="dd-wrong">{tr({ uz: '⚠️ Tartib xato — qayta joylang.', ru: '⚠️ Порядок неверный — разложите заново.' })}</div>}
    </div>
  );
}

// ===== 🧭 MASLAHATCHI MA'LUMOTLARI =====
const MASLAHATCHI_FACTS = [
  { id: 'know',   ico: '📚', label: { uz: "Juda ko'p o'qigan", ru: 'Прочитал очень много' },  desc: { uz: <>🧭 Maslahatchi juda ko'p matn o'qib "o'rgangan" — deyarli har qanday mavzuda gapira oladi.</>, ru: <>🧭 Советчик «выучился», прочитав огромное количество текстов — говорить может почти на любую тему.</> } },
  { id: 'tired',  ico: '⚡', label: { uz: 'Charchamaydi', ru: 'Не устаёт' },       desc: { uz: <>U tunu-kun, minglab savolga bir vaqtning o'zida javob bera oladi — hech qachon charchamaydi.</>, ru: <>Он отвечает на тысячи вопросов одновременно, днём и ночью — и никогда не устаёт.</> } },
  { id: 'forget', ico: '🙈', label: { uz: 'Sizni ESLAMAYDI', ru: 'Вас НЕ ПОМНИТ' },    desc: { uz: <>Eng muhimi: har safar u siz bilan <b>birinchi marta</b> gaplashayotgandek. Avvalgi suhbatni o'zi eslamaydi — hammasini qayta aytish kerak.</>, ru: <>Самое главное: каждый раз он общается с Вами как <b>в первый раз</b>. Прошлый разговор он не помнит — всё придётся рассказать заново.</> } }
];

// ===== SCREEN 0 — HOOK: Maslahatchi yo'riqnomasiz hamma narsani gapiradi =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [tried, setTried] = useState(!!storedAnswer);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const OPTS = [
    { id: 'a', label: { uz: "Maslahatchiga vazifasi aytilmagan — u nima haqida gapirish kerakligini bilmaydi", ru: 'Советчику не поставили задачу — он не знает, о чём именно говорить' } },
    { id: 'b', label: { uz: "Maslahatchi mijozni tanimay qoldi", ru: 'Советчик не узнал клиента' } },
    { id: 'c', label: { uz: "Internet sekin ishlagan edi", ru: 'Интернет работал медленно' } }
  ];
  const poke = () => { setTried(true); setSc(n => n + 1); };
  const pick = (v) => { if (picked !== null || !tried) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={{ uz: 'Loyiha · kirish', ru: 'Проект · вход' }} screen={screen} scrollSignal={sc} navContent={<NavNext disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 880 }}>{tr({ uz: <>Mijoz «Pitsa haqida ayting» deb yozdi. 🧭 Maslahatchi esa <span className="italic" style={{ color: T.accent }}>hammasini</span> gapirib berdi.</>, ru: <>Клиент написал «Расскажите про пиццу». А 🧭 Советчик рассказал <span className="italic" style={{ color: T.accent }}>вообще всё</span>.</> })}</h1>
        <Mentor>{tr({ uz: <>Botimizga endi 🧭 <b style={{ color: T.ink }}>Maslahatchi</b> (AI) ulanmoqda. Lekin unga hali hech narsa aytmadik — nima bo'lishini ko'ring. Tugmani bosing.</>, ru: <>К нашему боту подключается 🧭 <b style={{ color: T.ink }}>Советчик</b> (AI). Но мы ему пока ничего не сказали — посмотрите, что выйдет. Нажмите кнопку.</> })}</Mentor>
        <Zoomable><Split>
          <Col>
            <TgChat title={{ uz: '🧭 Maslahatchi', ru: '🧭 Советчик' }} ava="🧭" status={{ uz: "yo'riqnomasiz", ru: 'без инструкции' }} minH={140}>
              <Bubble from="user">{tr({ uz: 'Pitsa haqida ayting', ru: 'Расскажите про пиццу' })}</Bubble>
              {tried && <Bubble from="bot">{tr({ uz: "Pitsa — Italiyada, Neapol shahrida paydo bo'lgan taom 🍕 Uning tarixi asrlar davomida rivojlangan: Margarita, Marinara, Kalzone kabi turlari bor. Yevropa va Amerikada juda mashhur, har mamlakatda o'ziga xos retsepti bor...", ru: 'Пицца — блюдо, появившееся в Италии, в городе Неаполь 🍕 Её история развивалась веками: есть Маргарита, Маринара, Кальцоне. Очень популярна в Европе и Америке, в каждой стране свой рецепт...' })}</Bubble>}
            </TgChat>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={poke} disabled={tried}>{tried ? tr({ uz: '✓ Topshiriq yuborildi', ru: '✓ Задание отправлено' }) : tr({ uz: '▶ Topshiriqni yuborish', ru: '▶ Отправить задание' })}</button>
          </Col>
          <Col>
            <TgChat title={{ uz: 'Mijoz', ru: 'Клиент' }} ava="🙋" status={{ uz: "do'kon chatida", ru: 'в чате магазина' }} minH={60}>
              {tried && <Bubble from="user">{tr({ uz: "Menga do'koningizdagi pitsalar kerak edi 😕", ru: 'Мне нужны были пиццы из Вашего магазина 😕' })}</Bubble>}
            </TgChat>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Nega Maslahatchi shunday javob berdi?', ru: 'Почему Советчик ответил именно так?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null || !tried} style={{ opacity: !tried ? 0.55 : 1 }} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>);
              })}
            </div>
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Avval tugmani bosing ←', ru: 'Сначала нажмите кнопку ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Aynan! 🧭 Maslahatchi juda ko'p biladi, lekin unga <b>vazifasi</b> aytilmasa — u nima haqida, qanday gapirishni bilmaydi. Bugun unga <b>📜 yo'riqnoma</b> yozishni o'rganamiz.</>, ru: <>Именно! 🧭 Советчик знает очень много, но если ему не поставить <b>задачу</b> — он не знает, о чём и как говорить. Сегодня научимся писать ему <b>📜 инструкцию</b>.</> })}</p>}
          </Col>
        </Split></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA + JIHOZLAR PANELI =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: { uz: '🧭 Maslahatchini tanishtiramiz', ru: '🧭 Знакомимся с Советчиком' }, tag: { uz: 'kim u', ru: 'кто он' } },
    { text: { uz: '📜 Yo\'riqnoma yozamiz', ru: '📜 Пишем инструкцию' }, tag: { uz: 'xulq', ru: 'поведение' } },
    { text: { uz: 'Stol usti va murvatni sinaymiz', ru: 'Пробуем стол и ручку' }, tag: { uz: 'xotira · erkinlik', ru: 'память · свобода' } },
    { text: { uz: 'Javobni tekshirishni o\'rganamiz', ru: 'Учимся проверять ответ' }, tag: { uz: 'ishonch', ru: 'доверие' } }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const Preview = (
    <Col>
      <p className="flow-label">{tr({ uz: 'dars oxirida — aniq va ishonchli javob', ru: 'в конце урока — точный и надёжный ответ' })}</p>
      <TgChat title={{ uz: '🧭 Maslahatchi', ru: '🧭 Советчик' }} ava="🧭" status={{ uz: "yo'riqnoma bilan", ru: 'с инструкцией' }} input={false} minH={0}>
        <Bubble from="user">{tr({ uz: 'Bolalarim uchun nimani tavsiya qilasiz?', ru: 'Что посоветуете для моих детей?' })}</Bubble>
        <Bubble from="bot">{tr({ uz: "Bizning menyuda Margarita zo'r tanlov — achchiq emas, hammaga yoqadi 🧀 Kichik o'lcham ham bor. Buyurtma beraylikmi?", ru: 'В нашем меню Маргарита — отличный выбор: не острая, нравится всем 🧀 Есть и маленький размер. Оформляем заказ?' })}</Bubble>
      </TgChat>
      <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Tayyor javob emas — Maslahatchi 📜 yo'riqnomaga qarab, aniq va mavzuga mos javob yozadi. Mana shuni bugun quramiz.", ru: 'Это не заготовка — Советчик пишет точный и уместный ответ, опираясь на 📜 инструкцию. Именно это мы сегодня и построим.' })}</p></div>
    </Col>
  );
  const StepsB = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 4 qadam', ru: '4 шага на сегодня' })}</p>
      <ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span><span className="step-tag">{tr(s.tag)}</span></span></li>))}</ol>
      <GearPanel active={['key', 'sheet', 'btn', 'env', 'note', 'menu']} />
    </Col>
  );
  return (
    <Stage eyebrow={{ uz: 'Reja', ru: 'План' }} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Botjoningizga <span className="italic" style={{ color: T.accent }}>o'ylaydigan maslahatchi</span> ulaymiz.</>, ru: <>Подключим к Вашему Ботику <span className="italic" style={{ color: T.accent }}>думающего советчика</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Hozirgacha Botjon faqat 📋 qoidalar varag'idan qator qidirdi. Bugun unga 🧭 <b style={{ color: T.ink }}>Maslahatchi</b> (AI) ulanadi — u o'ylab javob yozadi. Yangi jihoz yondi: 🧭 <b style={{ color: T.ink }}>Yo'l-yo'riq</b>.</>, ru: <>До сих пор Ботик только искал строку в 📋 листе правил. Сегодня к нему подключается 🧭 <b style={{ color: T.ink }}>Советчик</b> (AI) — он пишет ответ, подумав. Загорелось новое снаряжение: 🧭 <b style={{ color: T.ink }}>Наставление</b>.</> })}</Mentor>
        {!isNarrow ? (<Zoomable><Split>{Preview}{StepsB}</Split></Zoomable>)
          : !showSteps ? <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{Preview}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "4 qadamni ko'rish", ru: 'Посмотреть 4 шага' })}</button></div>
            : <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Natijani ko'rish", ru: '↩ Посмотреть результат' })}</button>{StepsB}</div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — MASLAHATCHI KIM? (uch fakt) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(MASLAHATCHI_FACTS.map(a => a.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= MASLAHATCHI_FACTS.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = MASLAHATCHI_FACTS.find(a => a.id === active);
  return (
    <Stage eyebrow={{ uz: 'Tanishuv · Maslahatchi', ru: 'Знакомство · Советчик' }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : tr({ uz: `3 faktni ko'ring (${seen.size}/3)`, ru: `Посмотрите 3 факта (${seen.size}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>🧭 <span className="italic" style={{ color: T.accent }}>Maslahatchi</span> — u kim o'zi?</>, ru: <>🧭 <span className="italic" style={{ color: T.accent }}>Советчик</span> — кто он вообще?</> })}</h2></div>
        <Mentor>{tr({ uz: "Maslahatchi — botning yangi buyumi. U hech qachon uxlamaydi, lekin bitta g'alati xususiyati bor. Har faktni bosing.", ru: 'Советчик — новая вещь в снаряжении бота. Он никогда не спит, но у него есть одна странность. Нажмите на каждый факт.' })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {MASLAHATCHI_FACTS.map(a => <button key={a.id} className="gchip" onClick={() => tap(a.id)} style={seen.has(a.id) ? { boxShadow: `inset 0 0 0 1.5px ${T.success}`, color: T.success } : undefined}>{seen.has(a.id) ? '✓ ' : ''}{a.ico} {tr(a.label)}</button>)}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="note-h"><span style={{ fontSize: 18, marginRight: 6 }}>{cur.ico}</span>{tr(cur.label)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.desc)}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Faktni bosing ←', ru: 'Нажмите на факт ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Eng muhimi — <b>u sizni eslamaydi</b>. Shuning uchun uni to'g'ri yo'naltirish (📜 yo'riqnoma) juda muhim. Buni keyingi ekranlarda sinaymiz.</>, ru: <>Самое главное — <b>он Вас не помнит</b>. Поэтому так важно правильно его направить (📜 инструкция). Это проверим на следующих экранах.</> })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — YOMON TOPSHIRIQ vs YAXSHI TOPSHIRIQ (kichik) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [tried, setTried] = useState(storedAnswer ? new Set(['bad', 'good']) : new Set());
  const [sc, setSc] = useState(0);
  const done = tried.size >= 2;
  const send = (kind) => { setTried(prev => new Set(prev).add(kind)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Sinov · topshiriq', ru: 'Проба · задание' }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : tr({ uz: `Ikkalasini yuboring (${tried.size}/2)`, ru: `Отправьте оба (${tried.size}/2)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Yomon</span> topshiriq va <span className="italic" style={{ color: T.accent }}>yaxshi</span> topshiriq.</>, ru: <><span className="italic" style={{ color: T.accent }}>Плохое</span> задание и <span className="italic" style={{ color: T.accent }}>хорошее</span> задание.</> })}</h2></div>
        <Mentor>{tr({ uz: "Topshiriq (prompt) qanchalik aniq bo'lsa, javob ham shunchalik foydali bo'ladi. Ikkala tugmani bosib solishtiring.", ru: 'Чем точнее задание (промпт), тем полезнее ответ. Нажмите обе кнопки и сравните.' })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'yomon topshiriq', ru: 'плохое задание' })}</p>
            <PromptCard who={{ uz: 'topshiriq', ru: 'задание' }}>{tr({ uz: 'Yordam bering', ru: 'Помогите' })}</PromptCard>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} disabled={tried.has('bad')} onClick={() => send('bad')}>{tried.has('bad') ? tr({ uz: '✓ Yuborildi', ru: '✓ Отправлено' }) : tr({ uz: '▶ Yomon topshiriqni yuborish', ru: '▶ Отправить плохое задание' })}</button>
            {tried.has('bad') && <TgChat title={{ uz: '🧭 Maslahatchi', ru: '🧭 Советчик' }} ava="🧭" input={false} minH={0}><Bubble from="bot">{tr({ uz: 'Albatta, nimada yordam kerak? Bu juda keng savol — aniqroq ayta olasizmi: qaysi mavzu, qaysi vazifa?', ru: 'Конечно, в чём нужна помощь? Вопрос очень широкий — уточните: какая тема, какая задача?' })}</Bubble></TgChat>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'yaxshi topshiriq', ru: 'хорошее задание' })}</p>
            <PromptCard who={{ uz: 'topshiriq', ru: 'задание' }}>{tr({ uz: "Pitsa Bek do'koni uchun 3 ta qisqa salomlashuv jumlasi yozing", ru: 'Напишите 3 коротких приветствия для магазина «Пицца Бек»' })}</PromptCard>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} disabled={tried.has('good')} onClick={() => send('good')}>{tried.has('good') ? tr({ uz: '✓ Yuborildi', ru: '✓ Отправлено' }) : tr({ uz: '▶ Yaxshi topshiriqni yuborish', ru: '▶ Отправить хорошее задание' })}</button>
            {tried.has('good') && <TgChat title={{ uz: '🧭 Maslahatchi', ru: '🧭 Советчик' }} ava="🧭" input={false} minH={0}><Bubble from="bot">{tr({ uz: '1) Xush kelibsiz, Pitsa Bek sizga eng mazali pitsani taklif qiladi! 🍕 2) Assalomu alaykum! Qaysi pitsani xohlaysiz? 3) Salom! Bugun sizga qanday yordam beray?', ru: '1) Добро пожаловать! «Пицца Бек» предложит Вам самую вкусную пиццу! 🍕 2) Здравствуйте! Какую пиццу желаете? 3) Привет! Чем сегодня помочь?' })}</Bubble></TgChat>}
          </Col>
        </div></Zoomable>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Aniq topshiriq — aniq javob. Xuddi shu mantiq 📜 yo'riqnoma uchun ham amal qiladi: keyingi ekranda uni yozamiz.", ru: 'Точное задание — точный ответ. Та же логика работает и для 📜 инструкции: на следующем экране напишем её.' })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    questionText="Nega Maslahatchi mijozga kerak bo'lmagan narsalar haqida gapirdi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Nega 🧭 <span className="mono" style={{ color: T.accent }}>Maslahatchi</span> mijozga kerak bo'lmagan narsalar haqida gapirdi?</>, ru: <>Почему 🧭 <span className="mono" style={{ color: T.accent }}>Советчик</span> рассказал клиенту то, что тому не нужно?</> })}</h2></>}
    options={[tr({ uz: "Chunki internet sekin ishlagan edi shu payt", ru: 'Потому что в тот момент интернет работал медленно' }), tr({ uz: "Chunki mijoz savolni harflar bilan noto'g'ri yozgan", ru: 'Потому что клиент написал вопрос с ошибками' }), tr({ uz: "Chunki unga aniq vazifa (yo'riqnoma) aytilmagan edi", ru: 'Потому что ему не поставили чёткую задачу (инструкцию)' }), tr({ uz: "Chunki Maslahatchi charchab, dam olishga chiqib ketgan", ru: 'Потому что Советчик устал и ушёл отдыхать' })]} correctIdx={2}
    explainCorrect={tr({ uz: "To'g'ri! Maslahatchi juda ko'p biladi, lekin unga vazifasi (📜 yo'riqnoma) aytilmasa — u nima haqida, qanday gapirishni bilmaydi. Shuning uchun keng va tartibsiz javob beradi.", ru: 'Верно! Советчик знает очень много, но если не дать ему задачу (📜 инструкцию) — он не знает, о чём и как говорить. Отсюда широкий и беспорядочный ответ.' })}
    explainWrong={{
      0: tr({ uz: "Internet tezligiga aloqasi yo'q — muammo javobning mazmunida.", ru: 'Скорость интернета ни при чём — проблема в содержании ответа.' }),
      1: tr({ uz: "Savol tushunarli yozilgan edi. Muammo — Maslahatchiga vazifa aytilmaganida.", ru: 'Вопрос был написан понятно. Проблема в том, что Советчику не поставили задачу.' }),
      3: tr({ uz: "Maslahatchi charchamaydi. Muammo — unga vazifasi aytilmaganida.", ru: 'Советчик не устаёт. Проблема в том, что ему не поставили задачу.' }),
      default: tr({ uz: "Sabab — Maslahatchiga vazifasi (yo'riqnoma) aytilmagan edi.", ru: 'Причина — Советчику не поставили задачу (инструкцию).' })
    }} />
);

// ===== SCREEN 5 — MARKAZIY #1: YO'RIQNOMANI O'ZI YOZADI =====
const YR_SLOTS = [
  { id: 'who',   q: { uz: 'Kim?', ru: 'Кто он?' },            opts: [{ uz: "Pitsa Bek do'konining yordamchisi", ru: 'помощник магазина «Пицца Бек»' }, { uz: "Umuman hamma narsani biladigan ensiklopediya", ru: 'энциклопедия, знающая вообще всё' }, { uz: "Faqat o'zi haqida gapiradigan yordamchi", ru: 'помощник, который говорит только о себе' }], right: 0 },
  { id: 'how',   q: { uz: 'Qanday gapirsin?', ru: 'Как ему говорить?' }, opts: [{ uz: 'Qisqa, samimiy, aniq', ru: 'коротко, дружелюбно, чётко' }, { uz: "Imkon qadar uzun va batafsil, hech narsani qisqartirmasin", ru: 'как можно длиннее и подробнее, ничего не сокращая' }, { uz: "Faqat 'ha' yoki 'yo'q' deb javob bersin", ru: 'только «да» или «нет»' }], right: 0 },
  { id: 'limit', q: { uz: 'Chegara?', ru: 'Границы?' },        opts: [{ uz: "Faqat do'kon menyusi haqida gaplashsin", ru: 'Говори только о меню магазина' }, { uz: 'Istalgan mavzuda erkin gaplashaversin', ru: 'Говори свободно на любую тему' }, { uz: 'Hech qanday savolga javob bermasin', ru: 'Не отвечай ни на один вопрос' }], right: 0 }
];
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [choice, setChoice] = useState(() => storedAnswer ? { who: 0, how: 0, limit: 0 } : {});
  const wrongEverRef = useRef(!!(storedAnswer && storedAnswer.correct === false));
  const [tried, setTried] = useState(false);
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const allRight = YR_SLOTS.every(s => choice[s.id] === s.right);
  const done = YR_SLOTS.every(s => choice[s.id] !== undefined) && allRight;
  const pick = (slotId, idx, right) => {
    setTried(true);
    if (idx !== right) wrongEverRef.current = true;
    setChoice(c => ({ ...c, [slotId]: idx }));
    setSc(n => n + 1);
  };
  useEffect(() => {
    if (done && !fired.current) { fired.current = true; onAnswer(screen, { stage: 'builder', screenIdx: screen, correct: !wrongEverRef.current, picked: true, solved: true }); }
  }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Markaziy · #1', ru: 'Ключевое · #1' }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Yo'riqnomani yig'ing", ru: 'Соберите инструкцию' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>📜 <span className="italic" style={{ color: T.accent }}>Yo'riqnomani</span> o'zingiz yozing.</>, ru: <>📜 <span className="italic" style={{ color: T.accent }}>Инструкцию</span> напишите сами.</> })}</h2></div>
        <Mentor>{tr({ uz: "Har savolga bittadan javob tanlang — birga qo'shilib, Maslahatchiga beriladigan 📜 yo'riqnoma bo'ladi. Noto'g'ri variant ham tanlanishi mumkin — ehtiyot bo'ling.", ru: 'На каждый вопрос выберите по одному ответу — вместе они и станут 📜 инструкцией для Советчика. Неверный вариант тоже можно выбрать — будьте внимательны.' })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            {YR_SLOTS.map(s => (
              <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p className="flow-label">{tr(s.q)}</p>
                {s.opts.map((o, i) => {
                  const sel = choice[s.id] === i;
                  const wrongPick = sel && i !== s.right;
                  return (<button key={i} className={`pick-row ${sel ? 'sel' : ''} ${wrongPick ? 'shake' : ''}`} onClick={() => pick(s.id, i, s.right)}><span style={{ flex: 1 }}>{tr(o)}</span><span className="pick-plus">{sel ? (i === s.right ? '✓' : '✗') : '▶'}</span></button>);
                })}
              </div>
            ))}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "yig'ilayotgan yo'riqnoma", ru: 'собираемая инструкция' })}</p>
            <PromptCard who={{ uz: "📜 YO'RIQNOMA", ru: '📜 ИНСТРУКЦИЯ' }} tone={done ? 'live' : ''}>
              {tr({
                uz: <>Sen {choice.who !== undefined ? tr(YR_SLOTS[0].opts[choice.who]) : '…'}san. {choice.how !== undefined ? tr(YR_SLOTS[1].opts[choice.how]) : '…'} gapir. {choice.limit !== undefined ? tr(YR_SLOTS[2].opts[choice.limit]) : '…'}.</>,
                ru: <>Ты — {choice.who !== undefined ? tr(YR_SLOTS[0].opts[choice.who]) : '…'}. Говори {choice.how !== undefined ? tr(YR_SLOTS[1].opts[choice.how]) : '…'}. {choice.limit !== undefined ? tr(YR_SLOTS[2].opts[choice.limit]) : '…'}.</>
              })}
            </PromptCard>
            {tried && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Ba'zi javoblar hali noto'g'ri — ✗ belgisini toping va to'g'risini tanlang.", ru: 'Часть ответов пока неверна — найдите значок ✗ и выберите правильный.' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Zo'r! Endi Maslahatchiga aniq vazifa berildi: <b>kim, qanday, qaysi chegarada</b>. Shu 3 savol — har qanday yo'riqnomaning skeleti.</>, ru: <>Отлично! Теперь у Советчика есть чёткая задача: <b>кто он, как говорит, в каких рамках</b>. Эти 3 вопроса — скелет любой инструкции.</> })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — MASLAHATCHI SIZNI ESLAMAYDI (kichik) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? 2 : 0);
  const [sc, setSc] = useState(0);
  const done = step >= 2;
  const advance = () => { setStep(s => Math.min(s + 1, 2)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Sinov · xotira', ru: 'Проба · память' }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Ikkinchi xabarni yuborish', ru: 'Отправьте второе сообщение' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ikki xabar — Maslahatchi <span className="italic" style={{ color: T.accent }}>eslaydimi?</span></>, ru: <>Два сообщения — <span className="italic" style={{ color: T.accent }}>вспомнит ли</span> Советчик?</> })}</h2></div>
        <Mentor>{tr({ uz: 'Bir suhbatda ikki marta yozamiz. Ikkinchisida Maslahatchi birinchisini eslab qoladimi? Tugmani bosing.', ru: 'Напишем в одном разговоре дважды. Вспомнит ли Советчик во второй раз первое сообщение? Нажмите кнопку.' })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <TgChat title={{ uz: '🧭 Maslahatchi', ru: '🧭 Советчик' }} ava="🧭" input={false} minH={100}>
              <Bubble from="user">{tr({ uz: 'Salom, mening ismim Aziz.', ru: 'Здравствуйте, меня зовут Азиз.' })}</Bubble>
              <Bubble from="bot">{tr({ uz: 'Salom, Aziz! Sizga qanday yordam bera olaman?', ru: 'Здравствуйте, Азиз! Чем могу помочь?' })}</Bubble>
            </TgChat>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} disabled={step >= 1} onClick={advance}>{step >= 1 ? tr({ uz: '✓ Yuborildi', ru: '✓ Отправлено' }) : tr({ uz: '▶ Ikkinchi xabarni yuborish', ru: '▶ Отправить второе сообщение' })}</button>
          </Col>
          <Col>
            {step >= 1 ? (
              <TgChat title={{ uz: '🧭 Maslahatchi', ru: '🧭 Советчик' }} ava="🧭" input={false} minH={100}>
                <Bubble from="user">{tr({ uz: 'Ismim nima edi?', ru: 'Как меня зовут?' })}</Bubble>
                {step === 1 && <Bubble from="bot" thinking />}
                {step >= 2 && <Bubble from="bot">{tr({ uz: 'Kechirasiz, ismingizni bilmayman 😅 Menga har safar hammasini qaytadan aytishingiz kerak.', ru: 'Извините, Вашего имени я не знаю 😅 Каждый раз всё нужно рассказывать мне заново.' })}</Bubble>}
              </TgChat>
            ) : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Chapdagi tugmani bosing ←', ru: 'Нажмите кнопку слева ←' })}</p></div>}
            {step === 1 && <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={advance}>{tr({ uz: "Javobni ko'rish", ru: 'Посмотреть ответ' })}</button>}
            {done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Ko'rdingizmi? Ismini unutdi. Sabab shu — Maslahatchi sizni eslamaydi. Lekin muammo battarroq: suhbat uzayganda ham ma'lumot yo'qolib ketishi mumkin. Buni keyingi ekranda ko'ramiz.", ru: 'Видели? Имя он забыл. Причина та же — Советчик Вас не помнит. Но проблема ещё серьёзнее: при длинном разговоре данные тоже теряются. Это увидим на следующем экране.' })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — MARKAZIY #2: STOL USTI SINOVI (kontekst oynasi) =====
const DESK_MSGS = [
  { id: 'p1', text: { uz: 'Salom!', ru: 'Здравствуйте!' } },
  { id: 'p2', text: { uz: 'Ismim: Aziz', ru: 'Моё имя: Азиз' } },
  { id: 'p3', text: { uz: "Bugun ob-havo yaxshi ekan", ru: 'Сегодня хорошая погода' } },
  { id: 'p4', text: { uz: 'Menga Margarita kerak', ru: 'Мне нужна Маргарита' } },
  { id: 'p5', text: { uz: 'Manzil: Chilonzor', ru: 'Адрес: Чиланзар' } }
];
const DESK_MAX = 4;
function Desk({ onAllSent, sentAll }) {
  const [count, setCount] = useState(sentAll ? DESK_MSGS.length : 0);
  const [fellId, setFellId] = useState(null);
  const send = () => {
    if (count >= DESK_MSGS.length) return;
    const next = count + 1;
    if (next > DESK_MAX) setFellId(DESK_MSGS[next - DESK_MAX - 1].id);
    setCount(next);
    if (next === DESK_MSGS.length && onAllSent) onAllSent();
  };
  const visible = DESK_MSGS.slice(Math.max(0, count - DESK_MAX), count);
  return (
    <Col>
      <p className="flow-label">{tr({ uz: `stol usti — sig'imi ${DESK_MAX} varaq`, ru: `поверхность стола — вмещает ${DESK_MAX} листка` })}</p>
      <div className="desk">
        <div className="desk-slots">
          {fellId && <div className="desk-paper fell" key={`fell-${fellId}`}>{tr(DESK_MSGS.find(m => m.id === fellId)?.text)}{tr({ uz: ' — tushib ketdi 🍂', ru: ' — упало 🍂' })}</div>}
          {visible.map((m, i) => <div key={m.id} className={`desk-paper ${i === 0 && count >= DESK_MAX ? 'oldest' : ''}`}>{tr(m.text)}</div>)}
          {visible.length === 0 && <span className="desk-full" style={{ color: T.ink3, fontWeight: 400 }}>{tr({ uz: "bo'sh", ru: 'пусто' })}</span>}
        </div>
        {count >= DESK_MAX && count < DESK_MSGS.length && <p className="desk-full">{tr({ uz: "⚠️ Stol to'ldi — keyingi xabar kelsa, eng eskisi tushib ketadi", ru: '⚠️ Стол заполнен — придёт следующее сообщение, и самое старое упадёт' })}</p>}
      </div>
      <button className="btn-soft" style={{ alignSelf: 'flex-start' }} disabled={count >= DESK_MSGS.length} onClick={send}>{count >= DESK_MSGS.length ? tr({ uz: '✓ Barchasi yuborildi', ru: '✓ Всё отправлено' }) : tr({ uz: `▶ Xabar yuborish (${count}/${DESK_MSGS.length})`, ru: `▶ Отправить сообщение (${count}/${DESK_MSGS.length})` })}</button>
    </Col>
  );
}
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [sentAll, setSentAll] = useState(!!storedAnswer);
  const [choice, setChoice] = useState(storedAnswer ? (storedAnswer.picked ?? 'p2') : null);
  const [sc, setSc] = useState(0);
  const CANDIDATES = ['p3', 'p2', 'p5'];
  const done = sentAll && choice !== null;
  const fired = useRef(!!storedAnswer);
  useEffect(() => { if (done && !fired.current) { fired.current = true; onAnswer(screen, { stage: 'central', screenIdx: screen, correct: choice === 'p2', picked: choice, solved: true }); } }, [done, choice]);
  const pick = (id) => { if (choice !== null) return; setChoice(id); setSc(n => n + 1); };
  return (
    <Stage eyebrow={{ uz: 'Markaziy · #2', ru: 'Ключевое · #2' }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Sinovni bajaring', ru: 'Выполните пробу' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Stol usti sinovi — <span className="italic" style={{ color: T.accent }}>joyi cheklangan</span>.</>, ru: <>Проба стола — <span className="italic" style={{ color: T.accent }}>места мало</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Suhbat uzun bo'lsa, xabarlar «stol ustiga» to'planadi. Stol to'lsa — eng eski varaq tushib ketadi. Xabarlarni birma-bir yuboring va kuzating.", ru: 'Когда разговор длинный, сообщения копятся «на столе». Стол заполнился — самый старый листок падает. Отправляйте сообщения по одному и наблюдайте.' })}</Mentor>
        <Zoomable><div className="split">
          <Desk onAllSent={() => setSentAll(true)} sentAll={sentAll} />
          <Col>
            <p className="flow-label">{tr({ uz: "qaysi ma'lumot 📓 daftarga yozilishi kerak edi?", ru: 'какую запись нужно было занести в 📓 тетрадь?' })}</p>
            {!sentAll && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Avval barcha xabarlarni yuboring ←', ru: 'Сначала отправьте все сообщения ←' })}</p></div>}
            {sentAll && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {CANDIDATES.map(id => {
                  const m = DESK_MSGS.find(x => x.id === id);
                  const sel = choice === id;
                  return <button key={id} className={`pick-row ${sel ? 'sel' : ''}`} disabled={choice !== null} onClick={() => pick(id)}><span style={{ flex: 1 }}>{tr(m.text)}</span><span className="pick-plus">{sel ? (id === 'p2' ? '✓' : '✗') : '▶'}</span></button>;
                })}
              </div>
            )}
            {done && choice === 'p2' && <div className="desk-note fade-step">{tr({ uz: "✓ To'g'ri! «Ismim: Aziz» — muhim ma'lumot, u tushib ketishga eng yaqin edi. Uni 📓 daftarga yozib qo'yish kerak.", ru: '✓ Верно! «Моё имя: Азиз» — важные данные, и они были ближе всего к падению. Их нужно записать в 📓 тетрадь.' })}</div>}
            {done && choice !== 'p2' && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Bu unchalik muhim emas. Eng muhimi — «Ismim: Aziz» edi, chunki u eng eski va tushib ketishga yaqin turgan mijoz ma'lumoti.", ru: 'Это не так важно. Главным было «Моё имя: Азиз» — самые старые данные клиента, ближе всего к падению.' })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST 2 =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    questionText="Stol usti (kontekst oynasi) to'lib ketsa, nima sodir bo'ladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Stol usti (kontekst oynasi) <span className="italic" style={{ color: T.accent }}>to'lib ketsa</span>, nima sodir bo'ladi?</>, ru: <>Что произойдёт, когда стол (окно контекста) <span className="italic" style={{ color: T.accent }}>заполнится</span>?</> })}</h2></>}
    options={[tr({ uz: "Eng eski xabar tushib ketadi va unutiladi", ru: 'Самое старое сообщение упадёт и забудется' }), tr({ uz: "Maslahatchi butunlay o'chib qoladi", ru: 'Советчик полностью выключится' }), tr({ uz: "Yangi xabarlar qabul qilinmay qoladi", ru: 'Новые сообщения перестанут приниматься' }), tr({ uz: "Barcha eski xabarlar avtomatik daftarga yoziladi", ru: 'Все старые сообщения сами запишутся в тетрадь' })]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! Stol usti (kontekst oynasi) cheklangan. To'lganda eng eski varaq (xabar) tushib ketadi va Maslahatchi shu ma'lumotni endi bilmaydi — shuning uchun muhim narsani daftarga yozib qo'yish kerak.", ru: 'Верно! Стол (окно контекста) ограничен. Когда он заполняется, самый старый листок (сообщение) падает, и Советчик этих данных больше не знает — поэтому важное записывают в тетрадь.' })}
    explainWrong={{
      1: tr({ uz: "Maslahatchi ishlashda davom etadi — faqat eski xabarni unutadi.", ru: 'Советчик продолжает работать — он лишь забывает старое сообщение.' }),
      2: tr({ uz: "Yangi xabarlar bemalol qabul qilinadi — muammo faqat eskisining unutilishida.", ru: 'Новые сообщения принимаются спокойно — проблема только в забывании старых.' }),
      3: tr({ uz: "Avtomatik hech narsa yozilmaydi — muhimini o'zingiz daftarga yozishingiz kerak.", ru: 'Само ничего не записывается — важное в тетрадь заносите Вы.' }),
      default: tr({ uz: "Stol to'lsa, eng eski xabar tushib ketadi va unutiladi.", ru: 'Когда стол заполнен, самое старое сообщение падает и забывается.' })
    }} />
);

// ===== SCREEN 9 — MARKAZIY #3: ERKINLIK MURVATI =====
const DIAL_REPLIES = {
  low: [{ uz: "Bizda Margarita va Pepperoni bor.", ru: 'У нас есть Маргарита и Пепперони.' }, { uz: "Bizda Margarita va Pepperoni bor.", ru: 'У нас есть Маргарита и Пепперони.' }, { uz: "Bizda Margarita va Pepperoni bor.", ru: 'У нас есть Маргарита и Пепперони.' }],
  high: [{ uz: "Bizda Margarita, Pepperoni va ajoyib taomlar bor!", ru: 'У нас есть Маргарита, Пепперони и много чего вкусного!' }, { uz: "Menyuda ko'p narsa bor — masalan ananasli pitsa 3 000 so'm 🍍", ru: 'В меню много всего — например, пицца с ананасом за 3 000 сумов 🍍' }, { uz: "Bugun Margarita va yangi maxsus taklifimiz bor, albatta sinab ko'ring!", ru: 'Сегодня есть Маргарита и наше новое спецпредложение — обязательно попробуйте!' }]
};
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seenLow, setSeenLow] = useState(!!storedAnswer);
  const [seenHigh, setSeenHigh] = useState(!!storedAnswer);
  const [choice, setChoice] = useState(storedAnswer ? (storedAnswer.picked ?? 'low') : null);
  const [sc, setSc] = useState(0);
  const bothSeen = seenLow && seenHigh;
  const done = bothSeen && choice !== null;
  const fired = useRef(!!storedAnswer);
  useEffect(() => { if (done && !fired.current) { fired.current = true; onAnswer(screen, { stage: 'central', screenIdx: screen, correct: choice === 'low', picked: choice, solved: true }); } }, [done, choice]);
  const seeLow = () => { setSeenLow(true); setSc(n => n + 1); };
  const seeHigh = () => { setSeenHigh(true); setSc(n => n + 1); };
  const pick = (v) => { if (choice !== null) return; setChoice(v); setSc(n => n + 1); };
  return (
    <Stage eyebrow={{ uz: 'Markaziy · #3', ru: 'Ключевое · #3' }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Ikkalasini sinab ko'ring", ru: 'Попробуйте оба' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>🎚️ <span className="italic" style={{ color: T.accent }}>Erkinlik murvati</span> — qat'iymi, erkinmi?</>, ru: <>🎚️ <span className="italic" style={{ color: T.accent }}>Ручка свободы</span> — строго или свободно?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bir xil savolni 3 marta beramiz — «Bizda qanday pitsalar bor?». Murvatni bosib, javoblarni solishtiring.", ru: 'Зададим один и тот же вопрос 3 раза — «Какие у вас есть пиццы?». Нажмите на ручку и сравните ответы.' })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="dial-row">
              <button className={`dial-btn ${seenLow ? 'on' : ''}`} onClick={seeLow}>{tr({ uz: '❄️ Past (0.1)', ru: '❄️ Низко (0.1)' })}</button>
              <button className={`dial-btn ${seenHigh ? 'on' : ''}`} onClick={seeHigh}>{tr({ uz: '🔥 Baland (1.5)', ru: '🔥 Высоко (1.5)' })}</button>
            </div>
            {seenLow && <TgChat title={{ uz: '🧭 Maslahatchi · past', ru: '🧭 Советчик · низко' }} ava="🧭" input={false} minH={0}>{DIAL_REPLIES.low.map((r, i) => <Bubble from="bot" key={`l${i}`}>{tr(r)}</Bubble>)}</TgChat>}
            {seenHigh && <TgChat title={{ uz: '🧭 Maslahatchi · baland', ru: '🧭 Советчик · высоко' }} ava="🧭" input={false} minH={0}>{DIAL_REPLIES.high.map((r, i) => <Bubble from="bot" key={`h${i}`}>{tr(r)}</Bubble>)}</TgChat>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'vaziyat: menyuni har doim BIR XIL va ANIQ aytish kerak — qaysi murvat?', ru: 'ситуация: меню нужно называть всегда ОДИНАКОВО и ТОЧНО — какая ручка?' })}</p>
            {!bothSeen ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Avval ikkalasini ham sinab ko'ring ←", ru: 'Сначала попробуйте оба варианта ←' })}</p></div> : (
              <div className="dial-row">
                <button className={`dial-btn ${choice === 'low' ? 'on' : ''}`} disabled={choice !== null} onClick={() => pick('low')}>{tr({ uz: '❄️ Past (0.1)', ru: '❄️ Низко (0.1)' })}</button>
                <button className={`dial-btn ${choice === 'high' ? 'on' : ''}`} disabled={choice !== null} onClick={() => pick('high')}>{tr({ uz: '🔥 Baland (1.5)', ru: '🔥 Высоко (1.5)' })}</button>
              </div>
            )}
            {done && choice === 'low' && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ To'g'ri! Past murvat — qat'iy va bir xil javob beradi. Menyu kabi aniqlik kerak bo'lgan joyda shu tanlanadi.", ru: '✓ Верно! Низкая ручка даёт строгий и одинаковый ответ. Там, где нужна точность — например в меню — выбирают её.' })}</p></div>}
            {done && choice === 'high' && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Baland murvatda javob har safar boshqacha bo'ladi — hatto «ananasli pitsa» kabi yo'q narsani ham aytishi mumkin. Menyu uchun bu xavfli.", ru: 'При высокой ручке ответ каждый раз другой — он даже может назвать несуществующую «пиццу с ананасом». Для меню это опасно.' })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TEST 3 =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    questionText="Erkinlik murvati baland qilib qo'yilsa, nima bo'ladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>🎚️ <span className="mono" style={{ color: T.accent }}>Erkinlik murvati</span> baland qilib qo'yilsa, nima bo'ladi?</>, ru: <>Что будет, если 🎚️ <span className="mono" style={{ color: T.accent }}>ручку свободы</span> поставить высоко?</> })}</h2></>}
    options={[tr({ uz: "Maslahatchi har doim sezilarli darajada tezroq javob qaytaradi", ru: 'Советчик всегда будет отвечать заметно быстрее' }), tr({ uz: "Javoblar har doim bir xil bo'lib qoladi", ru: 'Ответы станут всегда одинаковыми' }), tr({ uz: "Internetni sezilarli darajada ko'proq sarflaydi", ru: 'Заметно вырастет расход интернета' }), tr({ uz: "Javoblar xilma-xil, hatto o'ylab topilishi mumkin", ru: 'Ответы станут разными, а иногда и выдуманными' })]} correctIdx={3}
    explainCorrect={tr({ uz: "To'g'ri! Murvat baland bo'lsa, Maslahatchi erkin va xilma-xil javob beradi — lekin bu ba'zan haqiqatga to'g'ri kelmaydigan (o'ylab topilgan) javobga ham olib kelishi mumkin.", ru: 'Верно! При высокой ручке Советчик отвечает свободно и разнообразно — но иногда это приводит к ответу, не соответствующему действительности (выдуманному).' })}
    explainWrong={{
      0: tr({ uz: "Tezlikka aloqasi yo'q — murvat javobning xilma-xilligini boshqaradi.", ru: 'Со скоростью это не связано — ручка управляет разнообразием ответа.' }),
      1: tr({ uz: "Aksincha — past murvat bir xil javob beradi, baland murvat xilma-xil.", ru: 'Наоборот — одинаковые ответы даёт низкая ручка, высокая даёт разные.' }),
      2: tr({ uz: "Internet sarfiga aloqasi yo'q.", ru: 'С расходом интернета это не связано.' }),
      default: tr({ uz: "Baland murvat — xilma-xil, ba'zan noto'g'ri o'ylab topilgan javob.", ru: 'Высокая ручка — разные ответы, иногда выдуманные и неверные.' })
    }} />
);

// ===== SCREEN 11 — MARKAZIY #4: FACT CHECKER =====
const MENU_REAL = [{ uz: "Margarita — 35 000 so'm", ru: 'Маргарита — 35 000 сумов' }, { uz: "Pepperoni — 42 000 so'm", ru: 'Пепперони — 42 000 сумов' }, { uz: "To'rt pishloqli — 48 000 so'm", ru: 'Четыре сыра — 48 000 сумов' }];
const CLAIMS = [
  { id: 'c1', text: { uz: "Margarita — 35 000 so'm", ru: 'Маргарита — 35 000 сумов' }, real: true },
  { id: 'c2', text: { uz: "Ananasli pitsa — 30 000 so'm", ru: 'Пицца с ананасом — 30 000 сумов' }, real: false },
  { id: 'c3', text: { uz: "Pepperoni — 42 000 so'm", ru: 'Пепперони — 42 000 сумов' }, real: true }
];
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [answers, setAnswers] = useState(() => storedAnswer ? (storedAnswer.claimAnswers || { c1: true, c2: false, c3: true }) : {});
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const done = CLAIMS.every(c => answers[c.id] !== undefined);
  const allCorrect = CLAIMS.every(c => answers[c.id] === c.real);
  useEffect(() => { if (done && !fired.current) { fired.current = true; onAnswer(screen, { stage: 'central', screenIdx: screen, correct: allCorrect, picked: true, solved: true, claimAnswers: answers }); } }, [done, allCorrect]);
  const mark = (id, val) => { if (answers[id] !== undefined) return; setAnswers(a => ({ ...a, [id]: val })); setSc(n => n + 1); };
  return (
    <Stage eyebrow={{ uz: 'Markaziy · #4', ru: 'Ключевое · #4' }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : tr({ uz: `Har da'voni tekshiring (${Object.keys(answers).length}/3)`, ru: `Проверьте каждое утверждение (${Object.keys(answers).length}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>🔍 <span className="italic" style={{ color: T.accent }}>Fact Checker</span> — Maslahatchi rost aytdimi?</>, ru: <>🔍 <span className="italic" style={{ color: T.accent }}>Fact Checker</span> — Советчик сказал правду?</> })}</h2></div>
        <Mentor>{tr({ uz: "Maslahatchi menyu haqida 3 ta gap aytdi. Har birini haqiqiy menyu bilan solishtirib, ✅ Rost yoki ❌ O'ylab topilgan deb belgilang.", ru: 'Советчик сказал о меню 3 вещи. Сверьте каждую с настоящим меню и отметьте: ✅ Правда или ❌ Выдумка.' })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'haqiqiy menyu', ru: 'настоящее меню' })}</p>
            <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{MENU_REAL.map(m => tr(m)).join(' · ')}</p></div>
            <p className="flow-label">{tr({ uz: "Maslahatchining da'volari", ru: 'утверждения Советчика' })}</p>
            {CLAIMS.map(c => {
              const a = answers[c.id];
              const isDone = a !== undefined;
              const rowCls = isDone ? (a === c.real ? 'ok done' : 'bad done') : '';
              return (
                <div key={c.id} className={`claim-row ${rowCls}`}>
                  <span className="claim-txt">{tr(c.text)}</span>
                  <span className="claim-btns">
                    <button className={`claim-btn pick ${a === true ? 'correct' : ''}`} disabled={isDone} onClick={() => mark(c.id, true)}>{tr({ uz: '✅ Rost', ru: '✅ Правда' })}</button>
                    <button className={`claim-btn pick ${a === false ? 'correct' : ''}`} disabled={isDone} onClick={() => mark(c.id, false)}>{tr({ uz: "❌ O'ylab topilgan", ru: '❌ Выдумка' })}</button>
                  </span>
                </div>
              );
            })}
          </Col>
          <Col>
            {!done ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Har da'voni menyu bilan solishtiring ←", ru: 'Сверьте каждое утверждение с меню ←' })}</p></div>
              : allCorrect ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ Ajoyib! «Ananasli pitsa» menyuda yo'q edi — bu Maslahatchining o'ylab topgan (hallutsinatsiya) javobi. Har doim shunday tekshiring.", ru: '✓ Отлично! «Пиццы с ананасом» в меню не было — это выдумка Советчика (галлюцинация). Проверяйте всегда именно так.' })}</p></div>
              : <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Diqqat: «Ananasli pitsa» aslida menyuda YO'Q — Maslahatchi buni o'zi o'ylab topgan. Narx va faktlarni har doim manba bilan solishtiring.", ru: 'Внимание: «пиццы с ананасом» в меню НЕТ — Советчик её выдумал. Цены и факты всегда сверяйте с источником.' })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — CASE: PITSA BEK TO'LIQ SUHBAT =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const STEPS = [
    { u: { uz: 'Salom! Och qornimga nima maslahat berasiz? 😅', ru: 'Привет! Что посоветуете голодному человеку? 😅' }, b: { uz: "Salom! 😊 Pitsa Bek menyusidan Pepperoni tavsiya qilaman — go'shtli va to'yimli 🍕 Yoki klassik Margarita?", ru: 'Здравствуйте! 😊 Из меню «Пицца Бек» советую Пепперони — мясная и сытная 🍕 Или классическую Маргариту?' } },
    { u: { uz: "Achchiq narsa yoqmaydi menga", ru: 'Острое я не люблю' }, b: { uz: "Unda Margarita aynan siz uchun — achchiq emas, yumshoq pishloqli 🧀 Olib beraymi?", ru: 'Тогда Маргарита — как раз для Вас: не острая, с мягким сыром 🧀 Оформляем?' } },
    { u: { uz: 'Ha, bittasini olaman', ru: 'Да, возьму одну' }, b: { uz: "Zo'r tanlov! 🎉 Margarita — 35 000 so'm. Manzilingizni yuborsangiz, buyurtmani rasmiylashtiramiz 📍", ru: 'Отличный выбор! 🎉 Маргарита — 35 000 сумов. Пришлите адрес, и мы оформим заказ 📍' } }
  ];
  const [shown, setShown] = useState(storedAnswer ? STEPS.length : 0);
  const [phase, setPhase] = useState('idle');
  const [sc, setSc] = useState(0);
  const done = shown >= STEPS.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const advance = () => {
    if (phase === 'think') return;
    setPhase('think'); setSc(n => n + 1);
    setTimeout(() => { setShown(n => Math.min(n + 1, STEPS.length)); setPhase('idle'); setSc(n => n + 1); }, 850);
  };
  return (
    <Stage eyebrow={{ uz: 'Hayotiy · Pitsa Bek', ru: 'Из жизни · Пицца Бек' }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : tr({ uz: `Suhbatni davom ettiring (${shown}/3)`, ru: `Продолжите разговор (${shown}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yo'riqnoma bilan — javob endi <span className="italic" style={{ color: T.accent }}>aniq va ishonchli</span>.</>, ru: <>С инструкцией ответ стал <span className="italic" style={{ color: T.accent }}>точным и надёжным</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Endi 📜 yo'riqnoma va menyu bilan qurollangan Maslahatchi qanday ishlashini ko'ring. Tugmani bosib suhbatni davom ettiring.", ru: 'Посмотрите, как работает Советчик, вооружённый 📜 инструкцией и меню. Нажимайте кнопку и продолжайте разговор.' })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <TgChat title={{ uz: '🧭 Maslahatchi', ru: '🧭 Советчик' }} ava="🧭" minH={200} input={false}>
              {STEPS.slice(0, shown).map((s, i) => (
                <React.Fragment key={i}>
                  <Bubble from="user">{tr(s.u)}</Bubble>
                  <Bubble from="bot">{tr(s.b)}</Bubble>
                </React.Fragment>
              ))}
              {phase === 'think' && <Bubble from="bot" thinking />}
              {shown === 0 && phase !== 'think' && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: '6px 2px' }}>{tr({ uz: 'Tugmani bosing — mijoz yozadi.', ru: 'Нажмите кнопку — клиент напишет.' })}</p>}
            </TgChat>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done || phase === 'think'} onClick={advance}>{done ? tr({ uz: "✓ Buyurtma yo'lga qo'yildi", ru: '✓ Заказ оформлен' }) : shown === 0 ? tr({ uz: "▶ Suhbatni boshlash", ru: '▶ Начать разговор' }) : tr({ uz: 'Keyingi savol →', ru: 'Следующий вопрос →' })}</button>
          </Col>
          <Col>
            <div className="sk-info"><p className="note-h">{tr({ uz: '📜 Har javob ortida', ru: '📜 За каждым ответом' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Yo'riqnoma («Pitsa Bek yordamchisisan, faqat menyu haqida gapir») + haqiqiy menyu — javoblar aniq va tekshirilgan.", ru: 'Инструкция («Ты помощник «Пицца Бек», говори только о меню») + настоящее меню — ответы точные и проверенные.' })}</p></div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Ko'rdingizmi farqni? Hozirgi javoblar to'qib chiqarilmagan — narxlar ham haqiqiy menyudan. Aniq yo'riqnoma + tekshirish = ishonchli Maslahatchi.", ru: 'Видите разницу? Эти ответы не выдуманы — и цены взяты из настоящего меню. Точная инструкция + проверка = надёжный Советчик.' })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — XAVFSIZLIK + XARAJAT =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Amalda · 2 nuqta', ru: 'На практике · 2 момента' }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Tushunding ✓', ru: 'Понятно ✓' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Maslahatchini ulashdan oldin — <span className="italic" style={{ color: T.accent }}>2 ta</span> amaliy nuqta.</>, ru: <>Перед подключением Советчика — <span className="italic" style={{ color: T.accent }}>2</span> практических момента.</> })}</h2></div>
        <Mentor>{tr({ uz: 'Maslahatchi zo\'r, lekin ikki narsani yodda tuting: kalit xavfsizligi va xarajat.', ru: 'Советчик хорош, но помните о двух вещах: безопасность ключа и расходы.' })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="sk-info"><p className="note-h">{tr({ uz: "🔑 1. API kalit — .env'da", ru: '🔑 1. API-ключ — в .env' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>AI API kaliti ham token kabi maxfiy — <span className="mono">.env</span>'da saqlanadi, kodda ochiq emas, git'ga tushmaydi.</>, ru: <>AI API-ключ так же секретен, как токен — хранится в <span className="mono">.env</span>, в коде открыто не лежит и в git не попадает.</> })}</p></div>
            <div className="sk-info"><p className="note-h">{tr({ uz: '💰 2. Har topshiriq — xarajat', ru: '💰 2. Каждое задание — это расход' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Maslahatchiga har murojaat ozgina pul sarflaydi. Shuning uchun oddiy ishlarni tugmalar bilan, faqat erkin savollarni Maslahatchi bilan hal qiling.', ru: 'Каждое обращение к Советчику стоит немного денег. Поэтому простые задачи решайте кнопками, а Советчику оставьте только свободные вопросы.' })}</p></div>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} disabled={done} onClick={() => { setDone(true); setSc(n => n + 1); }}>{done ? tr({ uz: '✓ Tushundim', ru: '✓ Понял' }) : tr({ uz: 'Tushundim ✓', ru: 'Понятно ✓' })}</button>
          </Col>
          <Col>
            <div className="sk-info"><p className="note-h">{tr({ uz: '📍 Bugungi qoidalar — qisqacha', ru: '📍 Сегодняшние правила — коротко' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "📜 aniq yo'riqnoma → 📓 muhimini daftarga → 🎚️ vaziyatga mos murvat → 🔍 javobni tekshirish.", ru: '📜 точная инструкция → 📓 важное в тетрадь → 🎚️ ручка под ситуацию → 🔍 проверка ответа.' })}</p></div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Ana shu 4 qoida bilan Maslahatchi ishonchli yordamchiga aylanadi.', ru: 'С этими 4 правилами Советчик становится надёжным помощником.' })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — TEST 4 =====
const Screen14 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    questionText="Maslahatchi 'Bizda ananasli pitsa bor' desa, nima qilish kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>🧭 Maslahatchi <span className="italic" style={{ color: T.accent }}>«Bizda ananasli pitsa bor»</span> desa, nima qilish kerak?</>, ru: <>Что делать, если 🧭 Советчик скажет <span className="italic" style={{ color: T.accent }}>«У нас есть пицца с ананасом»</span>?</> })}</h2></>}
    options={[tr({ uz: "Darhol ishonib, mijozga aytaverish kerak", ru: 'Сразу поверить и передать клиенту' }), tr({ uz: "Menyu bilan solishtirib tekshirish kerak", ru: 'Сверить с меню и проверить' }), tr({ uz: "Erkinlik murvatini butunlay o'chirib qo'yish kerak", ru: 'Полностью отключить ручку свободы' }), tr({ uz: "Botni darhol butunlay o'chirish kerak", ru: 'Немедленно выключить бота целиком' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! Maslahatchi ba'zan o'zi o'ylab topgan (hallutsinatsiya) javob berishi mumkin. Har qanday faktni, ayniqsa narx va mahsulotlarni, haqiqiy manba (menyu) bilan solishtirib tekshirish kerak.", ru: 'Верно! Советчик иногда выдаёт выдуманный (галлюцинация) ответ. Любой факт, особенно цены и товары, нужно сверять с настоящим источником — с меню.' })}
    explainWrong={{
      0: tr({ uz: "Tekshirmasdan ishonish xavfli — Maslahatchi o'ylab topgan bo'lishi mumkin.", ru: 'Верить без проверки опасно — Советчик мог это выдумать.' }),
      2: tr({ uz: "Murvatni o'chirish yechim emas — javobni har doim tekshirish kerak.", ru: 'Отключение ручки — не решение: ответ проверять нужно всегда.' }),
      3: tr({ uz: "Botni o'chirish shart emas — muammo yechimi tekshirishda.", ru: 'Выключать бота незачем — решение проблемы в проверке.' }),
      default: tr({ uz: "Har doim menyu/fakt bilan solishtirib tekshiring.", ru: 'Всегда сверяйте с меню и фактами.' })
    }} />
);

// ===== SCREEN 15 — YAKUNIY: XAVFSIZ ISHLASH TSIKLI =====
const SAFE_CYCLE = [
  { id: 'instruct', ico: '📜', label: { uz: "Aniq yo'riqnoma yozish", ru: 'Написать точную инструкцию' } },
  { id: 'dial',     ico: '🎚️', label: { uz: 'Murvatni vaziyatga sozlash', ru: 'Настроить ручку под ситуацию' } },
  { id: 'ask',      ico: '💬', label: { uz: 'Maslahatchidan javob olish', ru: 'Получить ответ от Советчика' } },
  { id: 'check',    ico: '🔍', label: { uz: 'Javobni tekshirish', ru: 'Проверить ответ' } },
  { id: 'note',     ico: '📓', label: { uz: "Muhimini daftarga yozish", ru: 'Записать важное в тетрадь' } }
];
const SAFE_CYCLE_ITEMS = SAFE_CYCLE.map(c => ({ id: c.id, label: { uz: `${c.ico} ${c.label.uz}`, ru: `${c.ico} ${c.label.ru}` } }));
const SAFE_CYCLE_ORDER = SAFE_CYCLE.map(c => c.id);
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [solved, setSolved] = useState(!!storedAnswer);
  const fired = useRef(!!storedAnswer);
  const onSolved = () => { if (!fired.current) { fired.current = true; setSolved(true); onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Xavfsiz ishlash siklini to'g'ri tartibda joylang", correct: true, firstAttemptCorrect: true, solved: true, picked: 0 }); } };
  const [recapOpen, setRecapOpen] = useState(false);
  return (
    <Stage eyebrow={{ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' }} screen={screen} scrollSignal={solved ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!solved} label={solved ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Siklni yig'ing", ru: 'Соберите цикл' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: <span className="italic" style={{ color: T.accent }}>xavfsiz ishlash siklini</span> yig'ing.</>, ru: <>Последний шаг: соберите <span className="italic" style={{ color: T.accent }}>цикл безопасной работы</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Maslahatchidan foydalanishning to'g'ri tartibini eslang: avval nima yoziladi, so'ng nima sozlanadi, oxirida nima tekshiriladi?", ru: 'Вспомните правильный порядок работы с Советчиком: что пишем сначала, что настраиваем потом, что проверяем в конце?' })}</Mentor>
        <DragDropOrder
          items={SAFE_CYCLE_ITEMS}
          hints={[{ uz: "1-qadam", ru: 'Шаг 1' }, { uz: "2-qadam", ru: 'Шаг 2' }, { uz: "3-qadam", ru: 'Шаг 3' }, { uz: "4-qadam", ru: 'Шаг 4' }, { uz: "5-qadam", ru: 'Шаг 5' }]}
          onSolved={onSolved}
          doneText={{ uz: "Xavfsiz ishlash sikli tayyor!", ru: 'Цикл безопасной работы готов!' }}
        />
        {solved && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Tartib: <b>Yo'riqnoma → Murvat → Javob → Tekshirish → Daftar</b>. Shu sikl bilan Maslahatchi ishonchli yordamchiga aylanadi.</>, ru: <>✓ Порядок: <b>Инструкция → Ручка → Ответ → Проверка → Тетрадь</b>. С этим циклом Советчик становится надёжным помощником.</> })}</p></div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  ruleWriter:   { icon: '📜', name: 'Rule Writer',   desc: { uz: "Siz Maslahatchiga aniq yo'riqnoma yozdingiz — kim, qanday, qaysi chegarada", ru: 'Вы написали Советчику точную инструкцию — кто он, как говорит, в каких рамках' } },
  tableManager: { icon: '📓', name: 'Table Manager', desc: { uz: "Stol usti to'lganini topib, muhim ma'lumotni daftarga ko'chirdingiz", ru: 'Вы заметили, что стол заполнен, и перенесли важные данные в тетрадь' } },
  dialMaster:   { icon: '🎚️', name: 'Dial Master',   desc: { uz: "Erkinlik murvatini vaziyatga to'g'ri sozladingiz — narxga past murvat", ru: 'Вы верно настроили ручку свободы под ситуацию — для цен низкая ручка' } },
  factChecker:  { icon: '🔍', name: 'Fact Checker',  desc: { uz: "Maslahatchining o'ylab topgan pitsasini menyu bilan solishtirib tutdingiz", ru: 'Вы поймали выдуманную Советчиком пиццу, сверив её с меню' } },
};
// Ekran id → nishon. ❗ FAQAT ma'noli, real-xato-imkonli ekranlar: s5 (yo'riqnoma builder — noto'g'ri chip tanlansa
// `wrongEverRef` yonadi va `correct:false` ketadi) · s7 (stol usti — 3 nomzoddan noto'g'risini tanlash mumkin) ·
// s9 (murvat — Baland ham tanlanishi mumkin) · s11 (fact-check — barcha da'vo noto'g'ri belgilanishi mumkin).
// Exploration/toggle ekranlarga BOG'LANMAYDI (ular har bosishda correct:true qaytaradi — nishon tekin bo'lmasin).
const ACH_TRIGGERS = { s5: 'ruleWriter', s7: 'tableManager', s9: 'dialMaster', s11: 'factChecker' };

function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr({ uz: `Yangi nishon: ${tr(ach.name)}`, ru: `Новый значок: ${tr(ach.name)}` })}>
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
          <span className="acu-name">{tr(ach.name)}</span>
          {ach.desc && <span className="acu-desc">{tr(ach.desc)}</span>}
        </div>
        <span className="acu-tap">{tr({ uz: 'bosib davom eting', ru: 'нажмите, чтобы продолжить' })}</span>
      </div>
    </div>
  );
}
// Navbatda bittasi ko'rsatiladi — tugagach keyingisi chiqadi
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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 8, 10, 14, 15)
const Q_LABELS = { 4: { uz: "1 — Yo'riqnoma", ru: '1 — Инструкция' }, 8: { uz: '2 — Stol usti', ru: '2 — Стол' }, 10: { uz: '3 — Erkinlik murvati', ru: '3 — Ручка свободы' }, 14: { uz: '4 — Faktlarni tekshirish', ru: '4 — Проверка фактов' }, 15: { uz: '5 — Xavfsiz sikl', ru: '5 — Безопасный цикл' } };
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si (Maslahatchi atamalari)
const QZ_BG_SHAPES = [
  { ch: 'prompt',        l: 5,  t: 10, s: 32, d: 19, dl: 0 },
  { ch: '🧭',             l: 85, t: 8,  s: 32, d: 23, dl: 1.5 },
  { ch: 'system',        l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'temperature',   l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: '.env',          l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: 'context window', l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: { uz: 'daftar', ru: 'тетрадь' },        l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: '📜',             l: 55, t: 5,  s: 22, d: 22, dl: 0.6 },
  { ch: '✗',             l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '✓',             l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: { uz: 'hallutsinatsiya', ru: 'галлюцинация' }, l: 34, t: 62, s: 18, d: 29, dl: 3.4 },
  { ch: '🎚️',            l: 2,  t: 30, s: 26, d: 28, dl: 3.1 },
  { ch: { uz: 'stol usti', ru: 'стол' },     l: 60, t: 90, s: 20, d: 31, dl: 4.2 },
  { ch: 'token',         l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3, mexanik ketma-ketlik yo'q).
// 🎓 Metodist: savol matni va variant uzunliklari sayqallanadi · ⚡ Jonli: `correct` qiymatlari INLINE_KEYS bilan sinxron tekshiriladi.
const QUIZ_BANK = [
  { q: { uz: "Maslahatchiga vazifasi aytilmasa (yo'riqnomasiz), u qanday javob beradi?", ru: 'Как ответит Советчик, если ему не поставить задачу (без инструкции)?' }, opts: [{ uz: "Hech qanday javob bermaydi", ru: 'Не ответит вообще' }, { uz: "Keng va tartibsiz javob beradi", ru: 'Ответит широко и беспорядочно' }, { uz: "Faqat 'tushunmadim' deydi", ru: 'Скажет только «не понял»' }, { uz: "Avtomatik ravishda o'chib qoladi", ru: 'Автоматически выключится' }], correct: 1 },
  { q: { uz: "📜 Yo'riqnoma (system prompt) nimani belgilaydi?", ru: '📜 Что задаёт инструкция (system prompt)?' }, opts: [{ uz: "Internetning ulanish tezligini", ru: 'Скорость интернет-соединения' }, { uz: "Botning rangi va shriftini", ru: 'Цвет и шрифт бота' }, { uz: "Serverning jismoniy joylashuvini", ru: 'Физическое расположение сервера' }, { uz: "Uning xulqi va chegarasini", ru: 'Его поведение и границы' }], correct: 3 },
  { q: { uz: "Topshiriq (prompt) nima?", ru: 'Что такое задание (промпт)?' }, opts: [{ uz: "Foydalanuvchi yuborgan savol", ru: 'Вопрос, отправленный пользователем' }, { uz: "Botning ichki xatolik jurnali", ru: 'Внутренний журнал ошибок бота' }, { uz: "Server manzili", ru: 'Адрес сервера' }, { uz: "Telegram kanali nomi", ru: 'Название Telegram-канала' }], correct: 0 },
  { q: { uz: "Stol usti (kontekst oynasi) nima uchun cheklangan?", ru: 'Почему стол (окно контекста) ограничен?' }, opts: [{ uz: "Chunki Maslahatchi charchaydi", ru: 'Потому что Советчик устаёт' }, { uz: "Chunki internet tezligi juda past ekan", ru: 'Потому что интернет слишком медленный' }, { uz: "Joyi cheklangan, hammasi sig'maydi", ru: 'Места мало — всё не помещается' }, { uz: "Chunki bu qonun talabi", ru: 'Потому что этого требует закон' }], correct: 2 },
  { q: { uz: "Stol to'lib ketsa, qaysi varaq tushib ketadi?", ru: 'Какой листок упадёт, когда стол заполнится?' }, opts: [{ uz: "Eng yangi varaq", ru: 'Самый новый листок' }, { uz: "Eng eski varaq", ru: 'Самый старый листок' }, { uz: "Eng qisqa varaq", ru: 'Самый короткий листок' }, { uz: "Tasodifiy varaq", ru: 'Случайный листок' }], correct: 1 },
  { q: { uz: "Muhim ma'lumot (masalan, mijoz ismi) yo'qolib ketmasligi uchun nima qilinadi?", ru: 'Что сделать, чтобы важные данные (например, имя клиента) не потерялись?' }, opts: [{ uz: "Uni 📓 daftarga yozib qo'yish", ru: 'Записать их в 📓 тетрадь' }, { uz: "Stol ustini kattalashtirish", ru: 'Увеличить стол' }, { uz: "Erkinlik murvatini pasaytirish", ru: 'Опустить ручку свободы' }, { uz: "Maslahatchini qayta ishga tushirish", ru: 'Перезапустить Советчика' }], correct: 0 },
  { q: { uz: "Erkinlik murvati past bo'lsa (masalan 0.1), javob qanday bo'ladi?", ru: 'Каким будет ответ при низкой ручке свободы (например 0.1)?' }, opts: [{ uz: "Har safar butunlay boshqacha", ru: 'Каждый раз совершенно другим' }, { uz: "Har doim xato", ru: 'Всегда неверным' }, { uz: "Juda uzun", ru: 'Очень длинным' }, { uz: "Qat'iy va deyarli bir xil", ru: 'Строгим и почти одинаковым' }], correct: 3 },
  { q: { uz: "Erkinlik murvati baland bo'lganda (masalan 1.5) qanday xavf paydo bo'lishi mumkin?", ru: 'Какая опасность появляется при высокой ручке свободы (например 1.5)?' }, opts: [{ uz: "Bot butunlay to'xtaydi", ru: 'Бот полностью остановится' }, { uz: "O'zi o'ylab topgan narsa aytishi mumkin", ru: 'Может сказать то, что сам выдумал' }, { uz: "Internet butunlay va qaytarilmas tarzda uzilib qoladi", ru: 'Интернет отключится насовсем и безвозвратно' }, { uz: "Kalit oshkor bo'ladi", ru: 'Ключ станет открытым' }], correct: 1 },
  { q: { uz: "Do'kon menyusini har doim bir xil va aniq aytish kerak bo'lsa, qaysi murvat tanlanadi?", ru: 'Какую ручку выбрать, если меню магазина нужно называть всегда одинаково и точно?' }, opts: [{ uz: "Baland (1.5)", ru: 'Высокую (1.5)' }, { uz: "O'rtacha, xohlagancha", ru: 'Среднюю, как получится' }, { uz: "Past (0.1)", ru: 'Низкую (0.1)' }, { uz: "Murvat ahamiyatsiz", ru: 'Ручка не имеет значения' }], correct: 2 },
  { q: { uz: "Maslahatchi 'Bizda ananasli pitsa bor' desa-yu, menyuda bunday pitsa bo'lmasa, bu nima deyiladi?", ru: 'Советчик говорит «У нас есть пицца с ананасом», а в меню её нет. Как это называется?' }, opts: [{ uz: "To'g'ri javob", ru: 'Верный ответ' }, { uz: "Bu doim xizmat oynasining jiddiy texnik xatoligi", ru: 'Это всегда серьёзная техническая ошибка сервиса' }, { uz: "Kalit xavfi", ru: 'Угроза ключу' }, { uz: "O'ylab topish — tekshirish kerak", ru: 'Выдумка — нужно проверять' }], correct: 3 },
  { q: { uz: "Maslahatchi javobini qachon tekshirish kerak?", ru: 'Когда нужно проверять ответ Советчика?' }, opts: [{ uz: "Har doim tekshirish kerak", ru: 'Проверять нужно всегда' }, { uz: "Hech qachon, u doim to'g'ri", ru: 'Никогда, он всегда прав' }, { uz: "Faqat murvat past bo'lsa", ru: 'Только когда ручка низкая' }, { uz: "Faqat mijoz so'rasa", ru: 'Только если клиент попросит' }], correct: 0 },
  { q: { uz: "AI API kaliti qayerda saqlanadi?", ru: 'Где хранится AI API-ключ?' }, opts: [{ uz: "Ochiq kodda, hammaga ko'rinadigan joyda", ru: 'В открытом коде, на виду у всех' }, { uz: "Chatda mijozga yuboriladi", ru: 'Отправляется клиенту в чат' }, { uz: ".env faylda — maxfiy, git'ga tushmaydi", ru: 'В файле .env — секретно, в git не попадает' }, { uz: "Hech qayerda saqlanmaydi", ru: 'Нигде не хранится' }], correct: 2 },
];

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
          <span className="cs-hud-i">{tr({ uz: '🏆 PODIUM', ru: '🏆 ПОДИУМ' })}</span>
        </div>
      )}
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{tr(hint)}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>
  );
};
// ===== ⚡ MUSTAHKAMLASH-JANG (Kahoot arena) — signal zonasi: 100+ (test <100, praktika 500+ bilan to'qnashmaydi) =====
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
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

// Jonli fon: suzuvchi uchqunlar + «web» chiziqlari + kod tokenlari (canvas)
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    // Arena tokenlari — SHU darsning mavzusidan (Botjon): dekorativ suzuvchi kod-bo'laklari
    const TOK = ['/start', '🔑', '.env', 'signal→amal', 'bot.hears', 'ctx.reply', 'webhook', '401', '↻', 'fallback'];
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
  const [phase, setPhase] = useState('lobby'); // lobby | q | reveal | done
  const [qi, setQi] = useState(-1);
  const [remaining, setRemaining] = useState(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState({}); // {qi: {picked, correct, elapsed}}
  const [players, setPlayers] = useState([]);
  const [qRows, setQRows] = useState([]);
  const [answeredN, setAnsweredN] = useState(0);
  const [classEnded, setClassEnded] = useState(false);
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

  // Taymer — 100ms; vaqt tugasa javob ochiladi. MENTOR serverni ham 'r' ga o'tkazadi.
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
      if (typeof window !== 'undefined' && !window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закрыть, ученики останутся ждать на арене.\nВсё равно закрыть?' }))) return;
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

      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме практики' })}</button>
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
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Подождите, ментор начнёт тест…' })}</p>}
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
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length}{tr({ uz: ' — natija', ru: ' — результат' })}</span>
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
                : <span className="qz-res-t">{my ? tr({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: 'Ошибка — 0 баллов. В следующий раз получится! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Будьте быстрее! ⏱' })}</span>}
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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: '🏁 Natijani ko\'rish', ru: '🏁 Посмотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Дальше →' })}</button>}
        </div>
      )}

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: `ball · ${soloScore.ok}/${QUIZ_BANK.length} to'g'ri${soloScore.maxStreak >= 2 ? ` · eng uzun streak 🔥x${soloScore.maxStreak}` : ''}`, ru: `баллов · ${soloScore.ok}/${QUIZ_BANK.length} верно${soloScore.maxStreak >= 2 ? ` · самая длинная серия 🔥x${soloScore.maxStreak}` : ''}` })}</p>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест заново — практика (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

// ===== 🏆 PODIUM / STATISTIKA — jonli reyting (jonli-ulanishni ⚡ Jonli qiladi; self-mode fallback tayyor) =====
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
    <Stage eyebrow={{ uz: 'Natijalar', ru: 'Результаты' }} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победил</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — 🥇🥈🥉 подиум.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Загружаем результаты…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не присоединился.' })}</p></div>
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
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== 🛠️ JONLI PRAKTIKA (reusable) — o'quvchi VS Code'da bajaradi, ustoz kuzatadi =====
// signal zonasi: <100 test · 100+ arena · 500+ praktika (to'qnashmaydi).
const PRACTICE_BASE = 500;
// Mentor ko'rinishi sloti — "kim bajardi" jonli chiplar paneli. JONLI roli to'ldiradi.
const MentorPracticeStats = ({ live, screen }) => {
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        // Praktika signali 500+ zonasida (test <100, arena 100+ bilan to'qnashmaydi)
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
      <div className="card-lbl" style={{ color: T.blue }}>{tr({ uz: '👀 Kim bajardi — ', ru: '👀 Кто выполнил — ' })}{doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружаем…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не присоединился.' })}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.successSoft, color: T.success }}>✓ {p.nickname}</span>)}
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ opacity: 0.6 }}>⏳ {p.nickname}</span>)}
        </div>
      )}
    </div>
  );
};
function ScreenLivePractice({ title, task, checklist, screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, place = { uz: 'kompyuteringizda', ru: 'на своём компьютере' } }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const [checked, setChecked] = useState(() => new Set());
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const toggle = (i) => setChecked(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; });
  const complete = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: (title && title.uz) || title, solved: true, correct: true, picked: true }); // UZ-etalon (analitika)
    // JONLI: praktika bajarilgani serverga yoziladi (500+ zona — reytingga aralashmaydi, faqat mentor ko'radi)
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  // JONLI: mentor keyingi sahifaga o'tmaguncha NavNext qulf bo'ladi (optionalLive + LiveGateCtx gate). Hozircha done bo'lsa ochiq.
  const audio = useAudio([{ id: `practice_${screen}`, text: `Endi navbat sizda — bu topshiriqni o'z ${(place && place.uz) || place} bajarasiz. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={eyebrow || { uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' }} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z {tr(place)}</b> bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>{tr(place)}</b>. Проходите шаги и отмечайте их. В конце нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — наставник следит.</> })}</Mentor>
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
              {done ? tr({ uz: '✓ Bajarildi — ustozni kuting', ru: '✓ Выполнено — ждите наставника' }) : tr({ uz: '✅ Bajardim', ru: '✅ Выполнил' })}
            </button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: 'Отлично! Задание выполнено. Наставник проверит и переведёт на следующий шаг.' })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
}

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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{tr({ uz: `${total}/${total} atama yodlandi`, ru: `${total}/${total} терминов запомнено` })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda · ", ru: '↻ Учим · ' })}<b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim · ', ru: '✓ Знаю · ' })}<b>{known}</b></span></div>
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

// 🛠️ PRAKTIKA — o'quvchi AI chatda yo'riqnoma yozib sinaydi (mentor-gate, kod kiritilmaydi)
const ScreenBotPractice = (props) => (
  <ScreenLivePractice {...props} eyebrow={{ uz: 'Amaliyot · Maslahatchi', ru: 'Практика · Советчик' }} place={{ uz: 'kompyuteringizda', ru: 'на своём компьютере' }}
    title={{ uz: "O'z Maslahatchingiz uchun yo'riqnoma yozing", ru: 'Напишите инструкцию для своего Советчика' }}
    task={{ uz: "AI chat (masalan, Claude yoki ChatGPT) oching. O'z do'koningiz (yoki istalgan mavzu) uchun aniq 📜 yo'riqnoma yozing: kim, qanday ohangda gapiradi va qaysi chegarada. Keyin bir xil savolni ikki marta bering va javoblarni solishtiring.", ru: 'Откройте AI-чат (например, Claude или ChatGPT). Напишите точную 📜 инструкцию для своего магазина (или любой темы): кто он, каким тоном говорит и в каких рамках. Потом задайте один и тот же вопрос дважды и сравните ответы.' }}
    checklist={[
      { uz: "AI chat sahifasini oching (masalan, `claude.ai`)", ru: 'Откройте страницу AI-чата (например, `claude.ai`)' },
      { uz: "`Sen ... yordamchisisan. Faqat ... haqida gaplash.` shaklida yo'riqnoma yozing", ru: 'Напишите инструкцию вида `Ты помощник ... . Говори только про ... .`' },
      { uz: "Bitta savolni yuboring va javobni o'qing", ru: 'Отправьте один вопрос и прочитайте ответ' },
      { uz: "Xuddi shu savolni yana bir marta yuboring — javoblarni solishtiring", ru: 'Отправьте тот же вопрос ещё раз — сравните ответы' },
      { uz: "Imkoni bo'lsa, murvat (temperature)ni past/baland qilib ikki xil javob oling", ru: 'Если получится, поставьте ручку (temperature) низко и высоко — получите два разных ответа' },
    ]} />
);

// 🃏 FLASHCARD KARTALARI — 12 atama (Maslahatchi tili)
const BOT_FLASHCARDS = [
  { front: { uz: "Juda ko'p o'qigan, lekin sizni eslamaydigan yordamchini nima deb ataymiz?", ru: 'Как мы называем помощника, который очень много прочитал, но Вас не помнит?' }, back: { uz: 'Maslahatchi', ru: 'Советчик' }, note: { uz: 'LLM — har suhbatni noldan boshlaydi', ru: 'LLM — каждый разговор начинает с нуля' } },
  { front: { uz: "Maslahatchiga yuborgan savolingiz nima deb ataladi?", ru: 'Как называется вопрос, который Вы отправили Советчику?' }, back: { uz: 'Topshiriq', ru: 'Задание' }, note: { uz: "prompt — bir savol, bir topshiriq", ru: 'промпт — один вопрос, одно задание' } },
  { front: { uz: "Maslahatchi kim ekanini va qanday gapirishini nima belgilaydi?", ru: 'Что задаёт, кто такой Советчик и как он говорит?' }, back: { uz: "Yo'riqnoma", ru: 'Инструкция' }, note: { uz: 'system prompt: kim, qanday ohangda, qaysi chegarada', ru: 'system prompt: кто он, каким тоном, в каких рамках' } },
  { front: { uz: "Suhbat sig'adigan, joyi cheklangan maydonni nima deb ataymiz?", ru: 'Как мы называем ограниченную площадку, куда помещается разговор?' }, back: { uz: 'Stol usti', ru: 'Поверхность стола' }, note: { uz: 'kontekst oynasi — faqat oxirgi bir necha xabar sig\'adi', ru: 'окно контекста — помещается лишь несколько последних сообщений' } },
  { front: { uz: "Stol usti to'lganda qaysi xabar tushib ketadi?", ru: 'Какое сообщение падает, когда стол заполнен?' }, back: { uz: 'Eng eski xabar', ru: 'Самое старое сообщение' }, note: { uz: 'Maslahatchi uni butunlay unutadi', ru: 'Советчик забывает его полностью' } },
  { front: { uz: "Muhim ma'lumot yo'qolmasligi uchun qayerga yoziladi?", ru: 'Куда записывают важное, чтобы оно не потерялось?' }, back: { uz: 'Daftarga', ru: 'В тетрадь' }, note: { uz: 'ism va buyurtma daftarda saqlanadi', ru: 'имя и заказ хранятся в тетради' } },
  { front: { uz: "Javob qat'iy yoki erkin bo'lishini qaysi sozlama belgilaydi?", ru: 'Какая настройка задаёт, будет ответ строгим или свободным?' }, back: { uz: 'Erkinlik murvati', ru: 'Ручка свободы' }, note: { uz: 'temperature — past yoki baland qilinadi', ru: 'temperature — ставится низко или высоко' } },
  { front: { uz: "Murvat past bo'lganda javob qanday bo'ladi?", ru: 'Каким получается ответ при низкой ручке?' }, back: { uz: "Qat'iy va bir xil", ru: 'Строгим и одинаковым' }, note: { uz: 'menyu narxini aytishga shu mos', ru: 'подходит, чтобы называть цены из меню' } },
  { front: { uz: "Murvat baland bo'lganda javob qanday bo'ladi?", ru: 'Каким получается ответ при высокой ручке?' }, back: { uz: 'Erkin va har safar boshqacha', ru: 'Свободным и каждый раз разным' }, note: { uz: 'ijodiy matn uchun qulay', ru: 'удобно для творческого текста' } },
  { front: { uz: "Maslahatchi o'ylab topgan, haqiqatga to'g'ri kelmaydigan javob nima deyiladi?", ru: 'Как называется ответ, который Советчик выдумал и который не совпадает с правдой?' }, back: { uz: 'Hallutsinatsiya', ru: 'Галлюцинация' }, note: { uz: 'masalan menyuda yo\'q «ananasli pitsa»', ru: 'например «пицца с ананасом», которой нет в меню' } },
  { front: { uz: "Maslahatchi aytgan narxni qanday ishonchli qilasiz?", ru: 'Как Вы делаете названную Советчиком цену надёжной?' }, back: { uz: 'Menyu bilan solishtiraman', ru: 'Сверяю с меню' }, note: { uz: 'javobni haqiqiy manba bilan tekshirish', ru: 'проверка ответа по настоящему источнику' } },
  { front: { uz: "AI kaliti qaysi faylda saqlanadi?", ru: 'В каком файле хранится ключ AI?' }, back: '.env', note: { uz: 'kalit maxfiy, kodga ochiq yozilmaydi', ru: 'ключ секретный, в код открыто не пишется' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={{ uz: 'Takrorlash', ru: 'Повторение' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Maslahatchi atamalarini <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Быстро повторим</span> термины Советчика.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Darsni yakunlashdan oldin bugungi atamalarni takrorlaymiz. Har kartada bir savol — <b style={{ color: T.ink }}>javobini</b> o'ylang, keyin kartani bosib tekshiring. <b style={{ color: T.ink }}>Bildim</b> yoki <b style={{ color: T.ink }}>Takrorlash</b> bilan baholang.</>, ru: <>Перед завершением урока повторим сегодняшние термины. На каждой карточке вопрос — подумайте, <b style={{ color: T.ink }}>каким будет ответ</b>, затем нажмите на карточку и проверьте. Оцените себя: <b style={{ color: T.ink }}>Знаю</b> или <b style={{ color: T.ink }}>Повторить</b>.</> })}</Mentor>
        <div className="fc-center"><Flashcards cards={BOT_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== YAKUN (4.2: ScoreRing + CodeStrike CTA + RECAP/Uyga vazifa + 🏅 kolleksiya) =====
const SummaryScreen = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
    { uz: "🧭 Maslahatchi juda ko'p biladi, lekin sizni ESLAMAYDI — har safar hammasini qayta aytish kerak", ru: '🧭 Советчик знает очень много, но Вас НЕ ПОМНИТ — каждый раз всё нужно рассказывать заново' },
    { uz: "📜 Yo'riqnoma (system prompt) — kim, qanday ohangda va qaysi chegarada gapirishini belgilaydi", ru: '📜 Инструкция (system prompt) задаёт, кто он, каким тоном и в каких рамках говорит' },
    { uz: "Stol usti (kontekst oynasi) cheklangan — to'lsa eng eski xabar tushib ketadi, muhimini daftarga yozib qo'ying", ru: 'Стол (окно контекста) ограничен — когда он заполнен, самое старое сообщение падает; важное записывайте в тетрадь' },
    { uz: "Erkinlik murvati (temperature): past — qat'iy va bir xil, baland — erkin, lekin ba'zan o'ylab topadi", ru: 'Ручка свободы (temperature): низко — строго и одинаково, высоко — свободно, но иногда с выдумками' },
    { uz: "Maslahatchi yolg'on gapirishi (hallutsinatsiya) mumkin — javobini har doim faktlar bilan solishtirib tekshiring", ru: 'Советчик может сказать неправду (галлюцинация) — всегда сверяйте его ответ с фактами' }
  ];
  const HOMEWORK = [
    { b: { uz: 'Yozing', ru: 'Напишите' }, t: { uz: "— o'z loyihangiz uchun aniq yo'riqnoma (system prompt) yozing: kim, qanday, qaysi chegarada", ru: '— точную инструкцию (system prompt) для своего проекта: кто он, как говорит, в каких рамках' } },
    { b: { uz: 'Sinang', ru: 'Попробуйте' }, t: { uz: '— bir xil savolni ikki marta bering va Maslahatchi eslay olmasligini o\'z ko\'zingiz bilan ko\'ring', ru: '— задайте один и тот же вопрос дважды и своими глазами увидите, что Советчик не помнит' } },
    { b: { uz: 'Tekshiring', ru: 'Проверьте' }, t: { uz: '— Maslahatchidan biror fakt so\'rang va uni haqiqiy manba bilan solishtirib tasdiqlang', ru: '— спросите у Советчика какой-нибудь факт и подтвердите его, сверив с настоящим источником' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={{ uz: 'Tayyor', ru: 'Готово' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: "Botjon o'ylay boshladi", ru: 'Ботик начал думать' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi 🧭 Maslahatchi siz uchun <span className="italic" style={{ color: T.accent }}>sehr emas</span> — boshqariladigan vosita.</>, ru: <>Теперь 🧭 Советчик для Вас <span className="italic" style={{ color: T.accent }}>не магия</span>, а управляемый инструмент.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: "Tabriklaymiz! Yo'riqnoma yozishni, stol usti va erkinlik murvatini, faktlarni tekshirishni bilib oldingiz. Endi Maslahatchini xavfsiz ishlatishga tayyorsiz.", ru: 'Поздравляем! Вы научились писать инструкцию, разобрались со столом и ручкой свободы, освоили проверку фактов. Теперь Вы готовы безопасно работать с Советчиком.' }) : tr({ uz: "Yaxshi harakat! Yo'riqnoma va faktlarni tekshirish mavzularini mustahkamlash uchun bir-ikki ekranni qayta ko'ring.", ru: 'Хорошая попытка! Чтобы закрепить темы инструкции и проверки фактов, пересмотрите пару экранов.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? { uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' } : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь Вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "🚀 Keyingi dars — Botjon o'z javobidan fikr-mulohaza (fidbek) asosida o'zini yaxshilashni o'rganadi!", ru: '🚀 Следующий урок — Ботик научится улучшать себя на основе отклика (фидбека) о своих ответах!' })}</p></div>
        </div>
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '🏅 Nishonlaringiz — ', ru: '🏅 Ваши значки — ' })}{(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
              <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={tr(a.desc)}>
                <span className="ach-badge-ic">{got ? a.icon : '🔒'}</span>
                <span className="ach-badge-name">{tr(a.name)}</span>
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
export default function BotAiBrainLesson({ lang: langProp, onFinished }) {
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
    const upd = () => { const z = Math.min(1.5, Math.max(1, window.innerWidth / 1920)); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // Javob kaliti: inline testlar + jang savollari (QUIZ_BANK'dan) — mentor ochganda set_quiz_keys bilan serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  // 🃏 Flashcard ekrani jonli darsda (mentor boshqaruvida) o'quvchida ko'rsatilmaydi
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat REAL solve)
    // Yakuniy debug-gate (s15) — XATO javob ham serverga ketadi (aks holda xato qilgan o'quvchi podiumda umuman ko'rinmaydi).
    if (_m && _m.scored && _m.scope === 'final' && data && data.solved && live.mode === 'student') live.submitAnswer(idx, _m.id, data.picked ?? 1, !!data.correct, data.elapsedMs || 0);
  };
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenBotPractice, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
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
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
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
        /* frame-warn — FAQAT haqiqiy xato/yiqilish (401/400/500, noto'g'ri tanlov): dangerSoft, yo'lakdagi rz-crash bilan bir tilda */
        .frame-warn { background: ${T.dangerSoft}; border-left: 4px solid ${T.danger}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(194,54,43,0.22); }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === LAYOUT === */
        .screen { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === 🧭 MASLAHATCHI DARSI: 📜 yo'riqnoma kartasi / stol usti / erkinlik murvati / fakt-tekshiruv === */
        .prompt-card { background: ${CODE.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.28); }
        .prompt-card.live { box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.blue}88; }
        .prompt-who { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; letter-spacing: 0.06em; color: ${CODE.attr}; }
        .prompt-text { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.5; color: ${CODE.text}; }
        .gen-dots.inline { display: inline-flex; gap: 4px; } .gen-dots.inline i { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: 0.5; animation: gd-blink 1s ease-in-out infinite; } .gen-dots.inline i:nth-child(2){animation-delay:.15s} .gen-dots.inline i:nth-child(3){animation-delay:.3s}
        @keyframes gd-blink { 0%,100%{opacity:.3} 50%{opacity:1} }

        .desk { display: flex; flex-direction: column; gap: 10px; }
        .desk-slots { position: relative; min-height: 128px; background: ${T.bg}; border-radius: 14px; padding: 12px; display: flex; flex-direction: column-reverse; gap: 6px; overflow: hidden; }
        .desk-paper { display: flex; align-items: center; gap: 9px; background: ${T.paper}; border-radius: 9px; padding: 8px 11px; font-size: 12.5px; color: ${T.ink}; box-shadow: 0 4px 10px -5px rgba(${T.shadowBase},0.22); }
        .desk-paper.oldest { box-shadow: 0 4px 10px -5px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.danger}88; }
        .desk-paper.fell { animation: desk-fall 0.6s ease-in forwards; }
        @keyframes desk-fall { to { transform: translateY(140px) rotate(14deg); opacity: 0; } }
        .desk-full { color: ${T.danger}; font-weight: 700; }
        .desk-note { background: ${T.successSoft}; border-radius: 10px; padding: 9px 12px; font-size: 12.5px; color: ${T.success}; font-weight: 600; }

        .dial-row { display: flex; gap: 9px; flex-wrap: wrap; }
        .dial-btn { flex: 1; min-width: 130px; background: ${T.paper}; border: none; border-radius: 12px; padding: 12px 14px; cursor: pointer; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); transition: all 0.18s; }
        .dial-btn:hover:not(:disabled) { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.24); }
        .dial-btn.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .dial-gauge { height: 8px; border-radius: 99px; background: linear-gradient(90deg, ${T.blue}, ${T.accent}); position: relative; }
        .dial-gauge-dot { position: absolute; top: 50%; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 2px 8px -2px rgba(${T.shadowBase},0.5), 0 0 0 3px ${T.ink}; transform: translate(-50%,-50%); transition: left 0.3s cubic-bezier(.4,0,.2,1); }

        .claim-row { display: flex; align-items: center; gap: 10px; background: ${T.paper}; border-radius: 12px; padding: 10px 13px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .claim-txt { flex: 1; min-width: 0; font-size: 13.5px; color: ${T.ink}; }
        .claim-btns { display: flex; gap: 6px; flex-shrink: 0; }
        .claim-btn { border: none; border-radius: 8px; padding: 6px 10px; font-family: 'Manrope'; font-weight: 700; font-size: 12px; cursor: pointer; background: ${T.bg}; color: ${T.ink2}; }
        .claim-btn.pick { box-shadow: inset 0 0 0 1.5px ${T.ink3}; }
        .claim-row.ok .claim-btn.pick.correct { background: ${T.successSoft}; color: ${T.success}; }
        .claim-row.bad .claim-btn.pick.correct { background: ${T.dangerSoft}; color: ${T.danger}; }
        .claim-row.done .claim-btn:disabled { opacity: 0.55; cursor: default; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; white-space: pre-wrap; } .ai-line:hover { background: rgba(255,255,255,0.06); }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
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
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }

        /* === 4-MODUL: KOD QUTISI === */
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

        /* === JSON KO'RINISHI === */

        /* === MA'LUMOT JADVALI === */

        /* === SXEMA JADVAL-KARTOCHKASI === */

        /* === BOG'LANISH TUGMASI (s10) === */

        /* === TANLASH QATORI (s13) === */

        /* === YAKUNIY SXEMA KANVAS (s15) === */

        /* === Instagram POST KARTOCHKASI === */

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }
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
        .fc-tag { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(24px,5vw,40px); letter-spacing: -0.02em; text-wrap: balance; }
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

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }

        /* === 🏅 ACHIEVEMENTS — hisoblagich + to'liq-ekran bayram === */
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

        /* === Konfetti (yakun bayrami) === */
        .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
        .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.3); }
        @keyframes confetti-fall { 0% { transform: translateY(-24px) rotate(0deg); opacity: 0; } 8% { opacity: 1; } 55% { transform: translateY(48vh) translateX(22px) rotate(320deg); } 100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }

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
        .pod-my b { color: ${T.success}; } /* 11.16: o'quvchining O'Z natijasi YASHIL (qizil faqat xato javob uchun) */
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

        /* === ⚡ CODE STRIKE — CTA neon-kapsula (arena STRUKTURASI ⚡ Jonliniki) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px;
          background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%);
          border: 1.5px solid rgba(186,140,255,0.72);
          box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32);
          animation: cs-ignite 1.5s ease-out both, cs-breathe 3.8s ease-in-out 1.5s infinite; }
        @keyframes cs-ignite { 0% { opacity: .22; filter: saturate(.25) brightness(.55); box-shadow: none; } 32% { opacity: .3; filter: saturate(.3) brightness(.6); box-shadow: none; } 38% { opacity: 1; filter: none; } 44% { opacity: .38; filter: saturate(.4) brightness(.65); } 51% { opacity: 1; filter: none; } 57% { opacity: .55; filter: saturate(.5) brightness(.75); } 66%, 100% { opacity: 1; filter: none; } }
        @keyframes cs-breathe { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(110,55,210,.6), 0 0 40px rgba(140,72,255,.75), 0 0 96px rgba(140,72,255,.42), inset 0 0 60px rgba(140,72,255,.44); } }
        .cs-ring { position: absolute; inset: 0; border-radius: inherit; padding: 2.5px; pointer-events: none; z-index: 4;
          background: conic-gradient(from var(--csa), transparent 0 80%, rgba(201,166,255,0) 80%, rgba(201,166,255,.9) 91%, #FFFFFF 96%, transparent 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;
          animation: cs-current 3.4s linear infinite; }
        @keyframes cs-current { to { --csa: 360deg; } }
        .cs-sky { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .cs-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-weight: 700; line-height: 1; user-select: none; color: rgba(203,173,255,.32); text-shadow: 0 0 12px rgba(150,95,255,.4); animation: cs-float ease-in-out infinite; animation-duration: calc(var(--d,22s) / var(--spd,1)); will-change: transform; }
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
        @keyframes cs-bolt-strike { 0%, 100% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); } 5% { filter: drop-shadow(0 0 26px rgba(230,205,255,1)) brightness(2.4); transform: translateY(2px) scale(1.14); } 9% { filter: drop-shadow(0 0 7px rgba(170,120,255,.55)) brightness(.9); transform: translateY(0) scale(.97); } 13% { filter: drop-shadow(0 0 20px rgba(215,185,255,.95)) brightness(1.8); transform: translateY(1px) scale(1.07); } 20% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); } }
        .cs-spark { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: #E7D9FF; box-shadow: 0 0 9px rgba(190,150,255,.95); opacity: 0; pointer-events: none; }
        .cs-spark.s1 { top: 6%; left: 72%; --sx: 15px; --sy: -16px; }
        .cs-spark.s2 { top: 50%; left: -10%; --sx: -17px; --sy: -10px; animation-delay: .3s !important; }
        .cs-spark.s3 { top: 80%; left: 74%; --sx: 13px; --sy: 12px; animation-delay: .55s !important; }
        .cs-cap:hover .cs-spark { animation: cs-spark-fly .9s ease-out infinite; }
        @keyframes cs-spark-fly { 0% { opacity: 0; transform: translate(0,0) scale(.4); } 22% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--sx,14px), var(--sy,-16px)) scale(1); } }
        .cs-word { position: relative; z-index: 2; display: inline-block; font-family: 'Manrope','Manrope Fallback',sans-serif; font-weight: 900; font-style: italic; font-size: clamp(30px,6.2vw,72px); letter-spacing: .015em; line-height: 1.06; white-space: nowrap; padding-right: .06em; background: linear-gradient(180deg,#FFFFFF 10%,#E4D6FF 46%,#A97CFF 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: cs-wglow 2.8s ease-in-out infinite; }
        .cs-word::before { content: attr(data-text); position: absolute; left: 0; top: 0; width: 100%; padding-right: inherit; pointer-events: none; background: linear-gradient(100deg, transparent 34%, rgba(255,255,255,.95) 48%, rgba(255,255,255,.4) 54%, transparent 66%); background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: cs-glint 3.4s cubic-bezier(.6,0,.4,1) infinite; }
        @keyframes cs-wglow { 0%,100% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 14px rgba(150,90,255,.5)); } 50% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 27px rgba(172,112,255,.95)); } }
        @keyframes cs-glint { 0% { background-position: 135% 0; } 60%,100% { background-position: -55% 0; } }
        .cs-clickable:hover .cs-word { animation-duration: 1.4s; }
        .cs-hud { position: relative; z-index: 2; display: flex; gap: clamp(7px,1.1vw,11px); align-items: center; justify-content: center; flex-wrap: wrap; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
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
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
        .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
        @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .cs-charging { animation: cs-charge .45s ease-in forwards !important; }
        @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
        .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none; background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%); animation: cs-portal-in .9s ease-in-out both; }
        @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }
        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }
        /* ===== ⚡ JONLI QATLAM CSS (Kahoot-kutish · MentorTestStats · CodeStrike arena · qcode-chip) — L1 etalondan ===== */
        /* --- Kahoot-kutish holatlari (jonli test) --- */
        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

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

        /* === ⚡ CTA (yakun sahifasida) === */
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

        /* --- kod-atama chip (fmtCode) arena variantlari --- */
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        /* --- CodeStrike bolt FX qatlami --- */
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

        /* tap-hint affordance: bosilmagan karta "meni bos" deb pulslaydi */
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 0 rgba(255,79,40,0.4); } 70%,100% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 8px rgba(255,79,40,0); } }

        /* Kahoot-kutish: tanlangan variant javob ochilguncha nafas oladi */
        .option-wait { animation: opt-wait-breathe 2s ease-in-out infinite; }
        @keyframes opt-wait-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.012); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }

        /* ============ 5-MODUL · BOTJON DARSI CSS ============ */

        /* TERMINAL (retyped — reusable qatlamdan tashqarida, shu yerda kerak) */
        .term { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .term-bar { background: #2D2D2D; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .term-title { font-family: 'JetBrains Mono'; font-size: 11px; color: #C9D1D9; }
        .term-body { background: #1E1E1E; padding: 12px 13px; min-height: 60px; }
        .tline { font-family: 'JetBrains Mono'; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.8; color: ${CODE.text}; word-break: break-word; }

        /* ===== 📱 TELEGRAM CHAT ===== */
        .tg { border-radius: 14px; overflow: hidden; box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.26); border: 1px solid rgba(167,166,162,0.2); }
        .tg-head { background: linear-gradient(180deg,#5A9FD4,#4E8FC0); padding: 10px 14px; display: flex; align-items: center; gap: 10px; }
        .tg-ava { width: 30px; height: 30px; border-radius: 50%; background: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .tg-name { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: #fff; display: flex; flex-direction: column; line-height: 1.25; }
        .tg-status { font-weight: 500; font-size: 10.5px; color: #DCEBF7; }
        .tg-body { background: #CFD9E0; background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 18px 18px; padding: 13px 12px; display: flex; flex-direction: column; gap: 7px; }
        .tg-bubble { max-width: 82%; padding: 8px 12px; border-radius: 14px; font-family: 'Manrope'; font-weight: 500; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; box-shadow: 0 1px 2px rgba(0,0,0,0.12); word-break: break-word; }
        .tg-bubble.bot { align-self: flex-start; background: #fff; color: #0E0E10; border-bottom-left-radius: 5px; }
        .tg-bubble.user { align-self: flex-end; background: #EFFDDE; color: #0E0E10; border-bottom-right-radius: 5px; }
        .tg-bubble.muted { opacity: 0.55; }
        .tg-btns { align-self: flex-start; display: flex; flex-wrap: wrap; gap: 5px; max-width: 92%; }
        .tg-btn { font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: #2E6FA6; background: rgba(255,255,255,0.92); padding: 6px 11px; border-radius: 9px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .tg-typing { display: flex; gap: 4px; align-items: center; padding: 11px 13px; }
        .tg-typing span { width: 6px; height: 6px; border-radius: 50%; background: ${T.ink3}; animation: tg-typing-bounce 1s ease-in-out infinite; }
        .tg-typing span:nth-child(2) { animation-delay: 0.15s; } .tg-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes tg-typing-bounce { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-3px); opacity: 1; } }


        /* ===== 🎒 JIHOZLAR PANELI ===== */
        .gear-panel { display: flex; flex-wrap: wrap; gap: 8px; }
        .gear-slot { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 76px; background: ${T.paper}; border-radius: 12px; padding: 10px 9px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); opacity: 0.4; }
        .gear-slot.on { opacity: 1; box-shadow: inset 0 0 0 1.5px ${T.success}, 0 6px 16px -6px rgba(31,122,77,0.26); background: ${T.successSoft}; }
        .gear-ico { font-size: 20px; } .gear-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10px; color: ${T.ink}; text-align: center; }

        /* ===== 🔑 XIZMAT OYNASI (s5) ===== */
        .sw-chain { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
        .sw-node { position: relative; display: flex; flex-direction: column; align-items: center; gap: 2px; font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.ink}; background: ${T.paper}; border-radius: 12px; padding: 10px 12px; min-width: 78px; text-align: center; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .sw-arrow { color: ${T.ink3}; font-weight: 800; font-size: 16px; transition: opacity 0.25s; } .sw-arrow.off { opacity: 0.3; }
        .sw-socket.has-key { box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .sw-socket.empty { box-shadow: inset 0 0 0 1.5px ${T.danger}; background: ${T.dangerSoft}; }
        .sw-chip { font-size: 20px; cursor: grab; touch-action: none; user-select: none; margin-top: 4px; }
        .sw-chip:active { cursor: grabbing; }
        .sw-401 { font-family: 'JetBrains Mono'; font-weight: 800; font-size: 13px; color: ${T.danger}; margin-top: 4px; }
        .sw-outzone { display: flex; align-items: center; gap: 10px; background: ${T.paper}; border-radius: 12px; padding: 12px 14px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); min-height: 20px; }
        .sw-outzone-empty { border: 1.5px dashed ${T.ink3}55; box-shadow: none; background: transparent; }

        /* ===== 🔑 KALIT (s6) ===== */
        .bot-status { display: flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; background: ${T.paper}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .bot-status-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.ink3}; flex-shrink: 0; }
        .bot-status.on .bot-status-dot { background: ${T.success}; box-shadow: 0 0 8px rgba(31,122,77,0.55); }
        .bot-status.deaf .bot-status-dot { background: #E8A13A; }
        .bot-status.danger { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 1.5px ${T.danger}55; animation: bot-status-danger 1.4s ease-in-out infinite; }
        .bot-status.danger .bot-status-dot { background: ${T.danger}; box-shadow: 0 0 8px rgba(194,54,43,0.55); }
        @keyframes bot-status-danger { 0%,100% { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 1.5px ${T.danger}55; } 50% { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 5px ${T.danger}22; } }
        @media (prefers-reduced-motion: reduce) { .bot-status.danger { animation: none; } }

        /* ===== 📋 TUNGI SMENA (s7 markaziy) ===== */
        .ns-sheet { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 14px; padding: 12px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ns-row { display: flex; align-items: center; gap: 8px; }
        .ns-rown { width: 20px; height: 20px; border-radius: 6px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ns-cell { flex: 1; min-height: 40px; border-radius: 10px; border: 1.5px dashed ${T.ink3}66; display: flex; align-items: center; padding: 4px 6px; }
        .ns-cell.filled { border-style: solid; border-color: ${T.line}; }
        .ns-eq { color: ${T.ink3}; font-weight: 800; }
        .ns-hint { color: ${T.ink3}; font-style: italic; font-size: 11.5px; margin: 0 auto; }
        .ns-chip { font-family: 'Manrope'; font-weight: 700; font-size: 12px; border: none; border-radius: 9px; padding: 7px 10px; cursor: grab; touch-action: none; user-select: none; width: 100%; text-align: left; }
        .ns-chip:active { cursor: grabbing; }
        .ns-chip.sig { background: linear-gradient(170deg, #FF8A3D, ${T.accent}); color: #fff; }
        .ns-chip.act { background: linear-gradient(170deg, #34B27A, ${T.success}); color: #fff; }
        .ns-chip.pool { width: auto; }
        .ns-pools { display: flex; flex-direction: column; gap: 8px; }
        .ns-pool-row { display: flex; flex-wrap: wrap; gap: 6px; min-height: 36px; padding: 8px; border-radius: 12px; background: ${T.bg}; }
        .ns-shift { display: flex; flex-direction: column; gap: 8px; }
        .ns-shift-cards { display: flex; flex-direction: column; gap: 7px; }
        .ns-cust { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: ${T.paper}; border-radius: 11px; padding: 10px 13px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.14); transition: all 0.4s ease; }
        .ns-cust-name { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink}; }
        .ns-cust-msg { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .ns-cust.ok { box-shadow: inset 0 0 0 1.5px ${T.success}; } .ns-cust.ok .ns-cust-msg { color: ${T.success}; }
        .ns-cust.wrong { box-shadow: inset 0 0 0 1.5px #E8A13A; } .ns-cust.wrong .ns-cust-msg { color: #B45309; }
        .ns-cust.silent { opacity: 0.45; transform: translateY(4px) grayscale(1); box-shadow: inset 0 0 0 1.5px ${T.ink3}; } .ns-cust.silent .ns-cust-msg { color: ${T.ink3}; }
        .ns-cust.wait { opacity: 0.55; }
        .ns-cust-dots { font-family: 'JetBrains Mono'; color: ${T.ink3}; animation: ns-dots-pulse 3s ease-in-out infinite; }
        @keyframes ns-dots-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .ns-cust-dots { animation: none; } }

        /* ===== 🔑 TOKEN ===== */
        .token-box { display: flex; align-items: center; gap: 10px; background: ${CODE.bg}; border-radius: 12px; padding: 13px 15px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .token-key { font-size: 18px; animation: token-key-glow 1.8s ease-in-out infinite; }
        @keyframes token-key-glow { 0%,100% { filter: drop-shadow(0 0 0 rgba(255,211,128,0)); } 50% { filter: drop-shadow(0 0 6px rgba(255,211,128,0.85)); } }
        @media (prefers-reduced-motion: reduce) { .token-key { animation: none; } }
        .token-val { font-size: clamp(12px,1.5vw,14px); color: ${CODE.str}; letter-spacing: 0.04em; }
        .token-mask { color: ${CODE.comment}; letter-spacing: 0.06em; }

        /* ===== KARTA-QATOR (kim javob beradi / rejimlar) ===== */
        .vcard { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover:not(:disabled) { transform: translateY(-1px); }
        .vlbl { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .vseen { margin-left: auto; font-weight: 700; }
        .role-ico { font-size: 20px; flex-shrink: 0; }

        /* ===== PICK ROWS (sxema ulash) ===== */
        .pick-row { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 10px; padding: 11px 13px; cursor: pointer; transition: all 0.16s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; }
        .pick-row:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.22); }
        .pick-row.sel { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.28); background: ${T.accentSoft}; }
        .pick-row.picked { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; cursor: default; }
        .pick-plus { margin-left: auto; font-weight: 700; color: ${T.ink3}; } .pick-row.picked .pick-plus { color: ${T.success}; } .pick-row.sel .pick-plus { color: ${T.accent}; }

        /* ===== WIRE (sxema natijasi) ===== */
        .wire { background: ${T.paper}; border-radius: 14px; padding: 13px 15px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 7px; }
        .wire-row { display: flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink}; }
        .wire-ico { font-size: 15px; flex-shrink: 0; }
        .wire-t { color: ${T.ink}; }
        .wire-arrow { color: ${T.accent}; font-weight: 800; }
        @keyframes rz-shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: rz-shake 0.4s ease; }

        .cj-items { display: flex; flex-wrap: wrap; gap: 9px; }
        .itm-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; width: clamp(84px,15vw,104px); background: ${T.paper}; border: none; border-radius: 13px; padding: 11px 7px 9px; cursor: pointer; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.2); transition: all 0.16s; }
        .itm-card:hover:not(:disabled) { transform: translateY(-2px); }
        .itm-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -8px rgba(255,79,40,0.3); }
        .itm-card:disabled { cursor: not-allowed; opacity: 0.75; }
        .itm-ico { font-size: 20px; }
        .itm-nm { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 10.5px; color: ${T.ink}; text-align: center; }
        .itm-check { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border-radius: 50%; background: ${T.accent}; color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px -2px rgba(255,79,40,0.5); }
        .itm-fix { margin-top: 4px; font-family: 'Manrope'; font-weight: 700; font-size: 10px; background: ${T.successSoft}; color: ${T.success}; border: none; border-radius: 8px; padding: 3px 7px; cursor: pointer; }

        /* Bo'shliqlarni to'ldirish (s13 builder) */
        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .blank-group { display: flex; flex-direction: column; gap: 6px; }
        .blank-group .bg-lbl { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .blank-row { display: flex; flex-wrap: wrap; gap: 7px; }

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi. Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        .gchip.tap-hint, .btn-soft.tap-hint, .itm-card.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }

        .dd { display: flex; flex-direction: column; gap: 13px; }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; position: relative; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 58px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; box-shadow: 0 5px 14px -9px rgba(${T.shadowBase},0.2); transition: border-color .18s, background .18s, box-shadow .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; box-shadow: 0 8px 18px -10px rgba(${T.shadowBase},0.26); }
        /* to'g'ri terilganda — qadamlar KETMA-KET tasdiqlanadi (yuqoridan pastga to'lqin) */
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; animation: dd-ok-pop 0.42s cubic-bezier(.3,1.5,.5,1); }
        .dd-slot.ok:nth-child(2) { animation-delay: 0.07s; } .dd-slot.ok:nth-child(3) { animation-delay: 0.14s; }
        .dd-slot.ok:nth-child(4) { animation-delay: 0.21s; } .dd-slot.ok:nth-child(5) { animation-delay: 0.28s; }
        @keyframes dd-ok-pop { 0%,100% { transform: scale(1); } 45% { transform: scale(1.025); } }
        .dd-slot.bad { border-color: ${T.danger}; background: ${T.dangerSoft}; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        /* SNAP — bo'lak slotga tushganda "qulflandi" hissi (fill-mode YO'Q — sudrash transform'i erkin qolsin) */
        .dd-chip.in { animation: dd-snap 0.32s cubic-bezier(.3,1.6,.5,1); }
        @keyframes dd-snap { 0% { transform: scale(1.14) rotate(-2deg); } 55% { transform: scale(0.97) rotate(0.5deg); } 100% { transform: scale(1) rotate(0); } }
        .dd-slotn { width: 26px; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; box-shadow: none; }
        .dd-slot.bad .dd-slotn { background: ${T.danger}; color: #fff; box-shadow: none; }
        .dd-hint { flex: 1; min-width: 0; color: ${T.ink3}; font-style: italic; font-size: 13px; line-height: 1.35; }
        .dd-slot .dd-chip { min-width: 168px; text-align: left; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${T.bg}; position: relative; z-index: 1; }
        .dd-pool-empty { color: ${T.ink3}; font-size: 12.5px; font-style: italic; align-self: center; }
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip:hover { transform: translateY(-2px); }
        .dd-chip:active { cursor: grabbing; }
        .dd-done { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .dd-wrong { font-weight: 700; color: ${T.danger}; font-size: 13.5px; }

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi (11.7). Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        /* 11.15 — jonli badge xira, hover'da tiniq (proyektorda xalaqit bermaydi) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* S21 — har og'ir animatsiyaga TINCH variant. */
        @media (prefers-reduced-motion: reduce) {
          .itm-card.tap-hint, .gchip.tap-hint, .btn-soft.tap-hint,
          .dd-chip.in, .dd-slot.ok, .dd-slot.bad, .shake, .tg-typing span, .desk-paper.fell { animation: none !important; }
        }

      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Botjon darsi', ru: 'Урок про Ботика' }} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} live={live} />
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
