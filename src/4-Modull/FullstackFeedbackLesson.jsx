import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// MA'LUMOT VA BACKEND MODULI · PRAKTIKA 4 — FEEDBACK BILAN YAXSHILASH: AVTOSTOYANKA UPGRADE — PLATFORM STANDARD v16 (AUDIOSIZ)
// O'RNI: 4-Modul oxiri (P3 — Loyiha kuni'dan KEYIN). Butun modul va praktikalar zanjirining YAKUNI.
//        O'quvchi biladi: backend CRUD (P1), fullstack ulash (P2), bog'lanish+JOIN+loyiha kuni (P3), PM/UX.
// Mavzu: P3'dagi AvtoStoyanka panelini sinfdoshlarga ko'rsatib, FIKR yig'ib, tartib bilan YAXSHILASH (upgrade).
// YANGI KO'NIKMA: mahsulotni yaxshilash sikli — qur → ko'rsat → fikr ol → sarala (Impact/Effort) → upgrade → qayta test. (PM)
// UPGRADE'lar (user tanladi): (1) chiqishda tasdiq (2) dashboard bo'sh/band/tushum (3) Settings narx (UPDATE) (4) Settings joylar soni.
// PEDAGOGIKA: dasturchi o'z ishiga yaqin — foydalanuvchi fikri kamchilikni ochadi. "sehr" yo'q. AUDIOSIZ. Sarlavhalar = qiziqarli savol.
// SIFAT: test variantlari statik aralash tartibda (correctIdx=INLINE_KEYS), har amalda mobil avtoscroll, mentor mobil yig'iladi.
// Yakuniy ekran (s16): mock VS Code — chiqishda tasdiq (confirm) yozish.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
  danger: '#C2362B', dangerSoft: '#FAE3E0', amber: '#B45309',
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

const LangContext = createContext('uz');
const MentorCtx = createContext(null);

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
      <button onClick={() => { setRole('student'); setMentorCode(''); }} style={link}>← {tr({ uz: 'Orqaga', ru: 'Назад' })}</button>
    </div></div>);
  }
  return (<div style={wrap}><div style={card}>
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{tr(title)}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Присоединиться к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и своё имя.' })}</p></div>
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

const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const LiveGateCtx = createContext(null); // JONLI: mentor-gate + live obyekti (Jonli roli Provider bilan ulaydi)

// Matn ichidagi `kod` bo'laklarini chip qilib ko'rsatadi (qcode)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

// AUDIOSIZ dars — useAudio/getAudioEngine zaglushkasi (QuestionScreen imzosi saqlanadi, TTS yo'q)
const getAudioEngine = () => null;
const useAudio = () => ({ muted: true, isPlaying: false, currentSegment: null, waitingFor: null, triggerEvent: () => {}, replay: () => {}, toggleMute: () => {} });

// ===== TRACKER (sinfdosh fikrlari holati — App-scope) =====
const TrackerCtx = createContext(null);
const TRK_LIST = [
  { id: 'f1', who: 'Aziz', color: '#E05A2B', short: { uz: 'Tasdiq', ru: 'Подтверждение' } },
  { id: 'f2', who: 'Laylo', color: '#019ACB', short: { uz: 'Dashboard', ru: 'Дашборд' } },
  { id: 'f3', who: 'Bek', color: '#B45309', short: { uz: 'Narx', ru: 'Цена' } },
  { id: 'f4', who: 'Diana', color: '#1F7A4D', short: { uz: 'Joylar', ru: 'Места' } }
];
const TRK_MAP = { s7: ['f1'], s8: ['f2'], s11: ['f3', 'f4'] };
// TrackerStrip har ekranda qayta ulanadi — «yangi yashil» avatar FAQAT bir marta porlasin (modul-scope xotira)
const TRK_SEEN = { ids: new Set() };
function TrackerStrip() {
  const resolved = useContext(TrackerCtx);
  const [seen, setSeen] = useState(() => new Set(TRK_SEEN.ids));
  useEffect(() => {
    if (!resolved) return;
    let fresh = false;
    resolved.forEach(id => { if (!TRK_SEEN.ids.has(id)) { TRK_SEEN.ids.add(id); fresh = true; } });
    if (!fresh) return;
    const t = setTimeout(() => setSeen(new Set(TRK_SEEN.ids)), 950); // pop tugagach — klass olinadi
    return () => clearTimeout(t);
  }, [resolved]);
  if (!resolved) return null;
  const n = TRK_LIST.filter(x => resolved.has(x.id)).length;
  const anyFresh = TRK_LIST.some(x => resolved.has(x.id) && !seen.has(x.id));
  return (
    <div className="trk">
      <span className="trk-lbl">{tr({ uz: 'Sinfdosh fikrlari', ru: 'Отзывы одноклассников' })}</span>
      <span className="trk-avas">
        {TRK_LIST.map(x => { const on = resolved.has(x.id); const pop = on && !seen.has(x.id); return (
          <span key={x.id} className={`trk-ava ${on ? 'on' : ''} ${pop ? 'pop' : ''}`} title={`${x.who} — ${tr(x.short)}${on ? ' ✓' : ''}`} style={on ? { background: x.color } : undefined}>{x.who.charAt(0)}{on && <span className="trk-tick">✓</span>}</span>
        ); })}
      </span>
      <span className={`trk-n ${anyFresh ? 'bump' : ''}`}>{n}/4</span>
    </div>
  );
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

const LESSON_META = { lessonId: 'fullstack-feedback-p4-v18', lessonTitle: { uz: 'Praktika: Feedback bilan yaxshilash — AvtoStoyanka', ru: 'Практика: Доработка по фидбеку — AvtoStoyanka' } };
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's14', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's16', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's16p', type: 'practice',   template: 'custom',   scored: false, scope: null },
  { id: 'spodium', type: 'podium',  template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
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
  const padH = isMobile ? 12 : 60;
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
    const isControl = tgt && tgt.closest && tgt.closest('button, input, a, .vcard, .option, .hook-option, .spot, .fb');
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><AchCounter /><div className="mono small" style={{ color: T.ink3 }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div></div>
          </div>
        </div>
        <div className="trk-rail" style={{ paddingLeft: padH, paddingRight: padH }}><TrackerStrip /></div>
        <div ref={contentRef} onClick={onContentClick} onScroll={onContentScroll} className={`stage-content ${narrow ? 'narrow' : ''}`} style={{ paddingLeft: padH, paddingRight: padH }}>{children}</div>
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
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (label ?? tr({ uz: 'Davom etish', ru: 'Продолжить' })))}</button>;
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

// JONLI JAVOB KALITI — har SCORED ekranning displayed-tartibdagi correctIdx'iga AYNAN teng (s16 yozma → -1 sentinel). Kalitni ⚡ Jonli tekshiradi.
const INLINE_KEYS = { s4: 2, s6: 1, s10: 3, s13: 0, s16: -1 };
const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
const RECAPS = {
  4: {
    title: { uz: "Foydali fikr — aniq muammoni ko'rsatadi", ru: 'Полезный отзыв указывает на конкретную проблему' },
    cards: [
      { ic: "🗣️", h: { uz: "«Zo'r!» yetarli emas", ru: '«Круто!» — недостаточно' }, body: { uz: <>Maqtov yoqimli, lekin <b>nima qilishni</b> aytmaydi. U yo'nalish bermaydi.</>, ru: <>Похвала приятна, но не говорит, <b>что делать</b>. Она не даёт направления.</> } },
      { ic: "🎯", h: { uz: "Foydali fikr — aniq", ru: 'Полезный отзыв — конкретный' }, body: { uz: <>Aniq fikr <b>muammoni</b> ko'rsatadi: «chiqishda tasdiq yo'q» — uni to'g'ridan-to'g'ri tuzatsa bo'ladi.</>, ru: <>Конкретный отзыв показывает <b>проблему</b>: «нет подтверждения при выезде» — её можно сразу исправить.</> } },
      { ic: "✅", h: { uz: "Amalga oshsa bo'ladigan", ru: 'Выполнимый' }, body: { uz: <>Eng foydali fikr — <b>aniq</b> va <b>amalga oshsa bo'ladigan</b>.</>, ru: <>Самый полезный отзыв — <b>конкретный</b> и <b>выполнимый</b>.</> }, ask: { uz: "Qaysi fikr foydaliroq: «zo'r ekan» yoki «tasdiq so'ramadi»?", ru: 'Какой отзыв полезнее: «круто» или «не спросил подтверждение»?' } }
    ]
  },
  6: {
    title: { uz: "Saralash — avval qaysi birini?", ru: 'Приоритизация — что делаем сначала?' },
    cards: [
      { ic: "📊", h: { uz: "Foyda / Mehnat doskasi", ru: 'Доска Польза / Усилия' }, body: { uz: <>Fikrlarni <b>foyda</b> va <b>mehnat</b> bo'yicha 4 katakka joylaymiz.</>, ru: <>Раскладываем отзывы по 4 клеткам: по <b>пользе</b> и <b>усилиям</b>.</> } },
      { ic: "⭐", h: { uz: "«Avval shu» katagi", ru: 'Клетка «Сначала это»' }, body: { uz: <>Ko'p foyda + kam mehnat = <b>avval</b> qilinadi (bizda tasdiq va dashboard).</>, ru: <>Много пользы + мало усилий = делаем <b>сначала</b> (у нас — подтверждение и дашборд).</> } },
      { ic: "⚠️", h: { uz: "Eng qiyini avval — xato", ru: 'Сначала самое сложное — ошибка' }, body: { uz: <>Qiyin ish ko'p vaqt oladi, natija kech ko'rinadi. Avval — ko'p foyda + kam mehnat.</>, ru: <>Сложная работа занимает много времени, результат виден поздно. Сначала — много пользы + мало усилий.</> }, ask: { uz: "Avval qaysi katakdan boshlaymiz?", ru: 'С какой клетки начинаем?' } }
    ]
  },
  10: {
    title: { uz: "UPDATE — mavjudni o'zgartirish", ru: 'UPDATE — изменение существующего' },
    cards: [
      { ic: "✏️", h: { uz: "Narx allaqachon bor", ru: 'Цена уже есть' }, body: { uz: <>Narx bazada bor — uni <b>o'zgartiramiz</b>, yangi qator qo'shmaymiz.</>, ru: <>Цена уже в базе — мы её <b>изменяем</b>, а не добавляем новую строку.</> } },
      { ic: "🔁", h: { uz: "UPDATE vs INSERT", ru: 'UPDATE vs INSERT' }, body: { uz: <><b>UPDATE</b> mavjud qatorni o'zgartiradi, <b>INSERT</b> yangisini qo'shadi.</>, ru: <><b>UPDATE</b> изменяет существующую строку, <b>INSERT</b> добавляет новую.</> } },
      { ic: "⚙️", h: { uz: "Sozlama = bazada", ru: 'Настройка = в базе' }, body: { uz: <>Kod o'zgarmaydi — sozlama <b>bazada</b> UPDATE bilan saqlanadi.</>, ru: <>Код не меняется — настройка хранится <b>в базе</b> через UPDATE.</> }, ask: { uz: "Mavjud narxni o'zgartirish uchun qaysi SQL amali?", ru: 'Какая SQL-команда изменяет существующую цену?' } }
    ]
  },
  13: {
    title: { uz: "Yaxshilash sikli", ru: 'Цикл улучшения' },
    cards: [
      { ic: "🔄", h: { uz: "To'xtovsiz sikl", ru: 'Непрерывный цикл' }, body: { uz: <>Qur → ko'rsat → fikr ol → sarala → upgrade → <b>yana ko'rsat</b>.</>, ru: <>Построй → покажи → собери отзывы → приоритизируй → апгрейд → <b>снова покажи</b>.</> } },
      { ic: "👥", h: { uz: "Foydalanuvchi fikri", ru: 'Отзыв пользователя' }, body: { uz: <>O'zingiz hammasini ko'ra olmaysiz — <b>foydalanuvchi fikri</b> kamchilikni ochadi.</>, ru: <>Сами Вы всего не увидите — <b>отзыв пользователя</b> вскрывает недочёты.</> } },
      { ic: "🚀", h: { uz: "Mahsulot o'sadi", ru: 'Продукт растёт' }, body: { uz: <>Qurib unutish emas — fikr bilan doimo <b>yaxshilanadi</b>.</>, ru: <>Не «построил и забыл» — продукт постоянно <b>улучшается</b> благодаря отзывам.</> }, ask: { uz: "Mahsulotni yaxshilash sikli qanday?", ru: 'Как выглядит цикл улучшения продукта?' } }
    ]
  }
};
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
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← {tr({ uz: 'Oldingi', ru: 'Назад' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>✓ {tr({ uz: 'Tushunarli — davom etamiz', ru: 'Понятно — продолжаем' })}</button>
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
        <p className="mstats-hidden">🙈 {tr({ uz: "Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: 'Кто что выбрал и число ✅/❌ скрыто — по нажатию «Открыть результат» оно появится сразу и у Вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — тема осталась непонятной классу. Перед продолжением рекомендуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по процентам вывод сделать сложно. Оцените сами:</> })}</p>
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
      {reveal && struggling && <p className="mstats-warn">⚠️ {tr({ uz: "Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: 'Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь вживую…' })}</p>}
    </div>
  );
}

// Test variantlari STATIK aralash tartibda (har savolda to'g'ri javob har xil pozitsiyada — s4:2, s6:1, s10:3, s13:0).
// correctIdx = displayed tartibdagi to'g'ri javob indeksi; INLINE_KEYS ham AYNAN shu indeks (server-kalit bilan mos).
const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student');
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
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>⚡ {tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: 'Живой урок — одна попытка, нажимайте обдуманно!' })}</p>}
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
              ? <>✓ {tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
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
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">{tr({ uz: "to'g'ri javob", ru: 'правильных ответов' })}</div></div>
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
const Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: 'italic' }}>{children}</span>;

// ===== AVTOSTOYANKA =====
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const mkSpots = (busy = { 2: '01A123BC', 5: '01B456DE' }, count = 8) => {
  const labels = [];
  for (let i = 0; i < count; i++) { const row = String.fromCharCode(65 + Math.floor(i / 4)); labels.push(row + (i % 4 + 1)); }
  return labels.map((raqam, i) => { const id = i + 1; return busy[id] ? { id, raqam, bandmi: true, mashina: busy[id] } : { id, raqam, bandmi: false, mashina: null }; });
};

// Qorovul paneli — yangilanadigan (tushum, statlar) bilan
const Spot = ({ spot, onClick, flash, dim, small }) => (
  <button className={`spot ${spot.bandmi ? 'busy' : 'free'} ${flash ? 'spot-flash' : ''} ${small ? 'spot-sm' : ''}`} onClick={onClick} disabled={!onClick} style={{ opacity: dim ? 0.45 : 1, cursor: onClick ? 'pointer' : 'default' }}>
    <span className="spot-tag" style={{ background: spot.bandmi ? T.danger : T.success }}>{spot.bandmi ? tr({ uz: 'BAND', ru: 'ЗАНЯТО' }) : tr({ uz: "BO'SH", ru: 'СВОБОДНО' })}</span>
    <span className="spot-ico">{spot.bandmi ? '🚗' : '⬚'}</span>
    <span className="spot-num">{spot.raqam}</span>
    {!small && spot.bandmi && spot.mashina && <span className="spot-plate">{spot.mashina}</span>}
  </button>
);
const GuardPanel = ({ spots, onSpotClick, tushum, dash, cols = 4, flashId, onSettings }) => {
  const band = spots.filter(s => s.bandmi).length;
  const bosh = spots.length - band;
  const small = spots.length > 12;
  return (
    <div className="guard">
      <div className="guard-top">
        <span className="guard-title">🅿️ AvtoStoyanka <small>· {tr({ uz: 'qorovul paneli', ru: 'панель охранника' })}</small></span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!dash && <span className="guard-stats"><span className="gst free">🟩 {bosh}</span><span className="gst busy">🟥 {band}</span></span>}
          {onSettings && <button className="gear" onClick={onSettings} title={tr({ uz: 'Sozlamalar', ru: 'Настройки' })}>⚙︎</button>}
        </span>
      </div>
      {dash && (
        <div className="dash">
          <div className="dash-card"><span className="dash-num" style={{ color: T.success }}>{bosh}</span><span className="dash-lbl">🟩 {tr({ uz: "Bo'sh", ru: 'Свободно' })}</span></div>
          <div className="dash-card"><span className="dash-num" style={{ color: T.danger }}>{band}</span><span className="dash-lbl">🟥 {tr({ uz: 'Band', ru: 'Занято' })}</span></div>
          <div className="dash-card"><span className="dash-num" style={{ color: T.ink }}>{sp(tushum || 0)}</span><span className="dash-lbl">💰 {tr({ uz: 'Tushum', ru: 'Выручка' })}</span></div>
        </div>
      )}
      <div className="guard-body">
        <div className="pgrid" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>{spots.map(s => <Spot key={s.id} spot={s} onClick={onSpotClick ? () => onSpotClick(s) : undefined} flash={flashId === s.id} small={small} />)}</div>
      </div>
      {!dash && tushum != null && <div className="guard-foot"><span>{tr({ uz: 'Bugungi tushum:', ru: 'Выручка за сегодня:' })} <b>{sp(tushum)} {tr({ uz: "so'm", ru: 'сум' })}</b></span></div>}
    </div>
  );
};

// rangli harf-avatar (zamonaviy ko'rinish)
const Ava = ({ name, color, sm }) => (
  <span className={`ava ${sm ? 'ava-sm' : ''}`} style={{ background: color }}>{name.charAt(0)}</span>
);
// feedback kartasi
const FbCard = ({ fb, onClick, on, seen }) => (
  // bosilmagan fikr — tap-hint pulsatsiyasi bilan chaqiradi; hal bo'lgani — ✓ (11.7 affordance)
  <button className={`fb ${on ? 'fb-on' : ''} ${onClick && seen === false && !on ? 'tap-hint' : ''}`} onClick={onClick} disabled={!onClick}>
    <Ava name={fb.who} color={fb.color} />
    <span className="fb-col"><span className="fb-who">{fb.who}</span><span className="fb-text">"{tr(fb.text)}"</span></span>
    {seen !== undefined && <span className={`fb-seen ${seen ? 'ok' : ''}`} style={{ color: seen ? T.success : T.ink3 }}>{seen ? '✓' : ''}</span>}
  </button>
);

// sinfdosh fikrlari (4 ta)
const FEEDBACK = [
  { id: 'f1', who: 'Aziz', color: '#E05A2B', short: { uz: 'Tasdiq', ru: 'Подтверждение' }, text: { uz: "Band joyni bosgan zahoti chiqib ketdi — 'rostdanmi?' deb so'ramadi", ru: "Нажал на занятое место — машина сразу выехала, даже 'точно?' не спросило" }, quad: 'Q1', part: 'Chiqish' },
  { id: 'f2', who: 'Laylo', color: '#019ACB', short: { uz: 'Dashboard', ru: 'Дашборд' }, text: { uz: "Nechta joy bo'sh, nechtasi band — darrov ko'rinmadi", ru: 'Сколько мест свободно, сколько занято — сразу не видно' }, quad: 'Q1', part: "Ko'rinish" },
  { id: 'f3', who: 'Bek', color: '#B45309', short: { uz: 'Narx', ru: 'Цена' }, text: { uz: "Narx 10 000 da qotib qolgan — o'zgartirib bo'lmaydi", ru: 'Цена застряла на 10 000 — изменить нельзя' }, quad: 'Q2', part: 'Narx' },
  { id: 'f4', who: 'Diana', color: '#1F7A4D', short: { uz: 'Joylar', ru: 'Места' }, text: { uz: "Stoyanka kattalashdi — 8 joy yetmaydi", ru: 'Стоянка выросла — 8 мест не хватает' }, quad: 'Q3', part: "Sig'im" }
];
const PART_OPTS = ['Chiqish', "Ko'rinish", 'Narx', "Sig'im"];
// UZ-RU: PART_OPTS qiymatlari solishtiruv-kalit (f.part === p) — TARJIMA QILINMAYDI; faqat render-yorliq:
const PART_LABELS = { 'Chiqish': { uz: 'Chiqish', ru: 'Выход' }, "Ko'rinish": { uz: "Ko'rinish", ru: 'Обзор' }, 'Narx': { uz: 'Narx', ru: 'Цена' }, "Sig'im": { uz: "Sig'im", ru: 'Вместимость' } };
// Noto'g'ri katakka tashlaganda oqibat-simulyatsiya izohlari (Screen5 doskasi)
const CONSEQ = {
  f1: { Q2: { uz: "Aziz topgan xato xavfli — uni «Rejaga ol»ga surib qo'ysangiz, pul yo'qotish davom etadi. U aslida «⭐ Avval shu».", ru: 'Ошибка, которую нашёл Aziz, опасна — отложите её в «Запланируй», и потеря денег продолжится. На самом деле это «⭐ Сначала это».' }, Q3: { uz: "Tasdiqni «Oson, keyin»ga qo'ysangiz, tasodifiy chiqarish qolaveradi — bu xavfli. U «⭐ Avval shu».", ru: 'Отправите подтверждение в «Легко, потом» — случайный выезд останется, а это опасно. Это «⭐ Сначала это».' }, Q4: { uz: "«Shart emas» emas! Tasdiq — eng muhim tuzatish, u «⭐ Avval shu».", ru: 'Никак не «Не нужно»! Подтверждение — самое важное исправление, это «⭐ Сначала это».' } },
  f2: { Q2: { uz: "Dashboard — oson ish, uni «Rejaga ol»ga surish shart emas. U «⭐ Avval shu».", ru: 'Дашборд — лёгкая работа, незачем откладывать её в «Запланируй». Это «⭐ Сначала это».' }, Q3: { uz: "Dashboard ko'p foyda beradi — «Oson, keyin» emas, u «⭐ Avval shu».", ru: 'Дашборд приносит много пользы — не «Легко, потом», а «⭐ Сначала это».' }, Q4: { uz: "«Shart emas» emas — Laylo topgan muammo muhim. U «⭐ Avval shu».", ru: 'Не «Не нужно» — проблема, которую нашла Laylo, важна. Это «⭐ Сначала это».' } },
  f3: { Q1: { uz: "Narxni o'zgartirish ancha ish talab qiladi — «⭐ Avval shu» emas. U «Rejaga ol».", ru: 'Изменение цены требует немало работы — это не «⭐ Сначала это». Это «Запланируй».' }, Q3: { uz: "Narx foyda beradi, lekin mehnat ko'p — «Oson, keyin» emas, u «Rejaga ol».", ru: 'Цена даёт пользу, но труда много — не «Легко, потом», а «Запланируй».' }, Q4: { uz: "Kerak, lekin keyinroq — «Shart emas» emas. U «Rejaga ol».", ru: 'Нужно, но позже — не «Не нужно». Это «Запланируй».' } },
  f4: { Q1: { uz: "Joylar sonini ko'paytirish oson, lekin hozircha kam foyda beradi — 8 joy hali yetib turibdi. «⭐ Avval shu»ga qo'ysangiz, Aziz topgan xavfli xato hal bo'lmay qoladi. U «Oson, keyin».", ru: 'Увеличить число мест легко, но пока это даёт мало пользы — 8 мест ещё хватает. Поставите в «⭐ Сначала это» — опасная ошибка, которую нашёл Aziz, останется нерешённой. Это «Легко, потом».' }, Q2: { uz: "Hozircha kam foyda beradi — «Rejaga ol» emas, u «Oson, keyin».", ru: 'Пока пользы мало — не «Запланируй», а «Легко, потом».' }, Q4: { uz: "Kelajakda kerak bo'ladi — «Shart emas» emas. U «Oson, keyin».", ru: 'Пригодится в будущем — не «Не нужно». Это «Легко, потом».' } }
};

// yondan ochiladigan Sozlamalar paneli (drawer)
const SettingsDrawer = ({ open, narx, setNarx, count, setCount, onSave, onClose, dirty }) => {
  if (!open) return null;
  return (
    <>
      <div className="drawer-bd" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-top"><span className="drawer-title">⚙︎ {tr({ uz: 'Sozlamalar', ru: 'Настройки' })}</span><button className="drawer-x" onClick={onClose}>✕</button></div>
        <p className="set-lbl">{tr({ uz: "Soatlik narx (so'm)", ru: 'Цена в час (сум)' })}</p>
        <input className="set-input" value={narx} onChange={e => setNarx(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" />
        <p className="set-lbl" style={{ marginTop: 13 }}>{tr({ uz: 'Joylar soni', ru: 'Число мест' })}</p>
        <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
          {[8, 12, 20].map(n => <button key={n} className="btn-soft" onClick={() => setCount(n)} style={count === n ? { boxShadow: `inset 0 0 0 1.5px ${T.accent}`, color: T.accent, background: T.accentSoft } : undefined}>{n}</button>)}
        </div>
        <button className="btn" disabled={!dirty} onClick={onSave} style={{ marginTop: 15, width: '100%' }}>💾 {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
      </div>
    </>
  );
};
const QUAD = {
  Q1: { lbl: { uz: '⭐ Avval shu', ru: '⭐ Сначала это' }, sub: { uz: "ko'p foyda · kam mehnat", ru: 'много пользы · мало усилий' }, color: T.success },
  Q2: { lbl: { uz: 'Rejaga ol', ru: 'Запланируй' }, sub: { uz: "ko'p foyda · ko'p mehnat", ru: 'много пользы · много усилий' }, color: T.amber },
  Q3: { lbl: { uz: 'Oson, keyin', ru: 'Легко, потом' }, sub: { uz: 'kam foyda · kam mehnat', ru: 'мало пользы · мало усилий' }, color: T.blue },
  Q4: { lbl: { uz: 'Shart emas', ru: 'Не нужно' }, sub: { uz: "kam foyda · ko'p mehnat", ru: 'мало пользы · много усилий' }, color: T.ink3 }
};

// ===== SCREEN 0 — HOOK (Demo Day: tasdiqsiz chiqarish) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [spots, setSpots] = useState(mkSpots());
  const [tried, setTried] = useState(!!storedAnswer);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const oops = (s) => { if (!s.bandmi) return; setSpots(prev => prev.map(x => x.id === s.id ? { ...x, bandmi: false, mashina: null } : x)); setTried(true); setSc(n => n + 1); };
  const OPTS = [
    { id: 'a', label: { uz: "Hech narsa — panel zo'r", ru: 'Ничего — панель и так отличная' } },
    { id: 'b', label: { uz: 'Foydalanuvchidan fikr olib, yaxshilash kerak', ru: 'Собрать отзывы пользователей и улучшить' } },
    { id: 'c', label: { uz: "Panelni o'chirib tashlash", ru: 'Удалить панель совсем' } }
  ];
  const pick = (v) => { if (picked !== null || !tried) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Demo Day · kirish', ru: 'Demo Day · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 880 }}>{tr({ uz: <>Siz qurdingiz — lekin u boshqaga <span className="italic" style={{ color: T.accent }}>qulaymi</span>?</>, ru: <>Вы построили — но <span className="italic" style={{ color: T.accent }}>удобно ли</span> это другому?</> })}</h1>
        <Mentor>{tr({ uz: <>Demo Day: sinfdoshingiz <b style={{ color: T.ink }}>Aziz</b> panelni sinab ko'ryapti. Band joyni bossa nima bo'larkin? Bitta <b style={{ color: T.ink }}>band (🟥)</b> joyni bosib ko'ring — Azizning o'rnida.</>, ru: <>Demo Day: Ваш одноклассник <b style={{ color: T.ink }}>Aziz</b> тестирует панель. Что будет, если нажать на занятое место? Нажмите на одно <b style={{ color: T.ink }}>занятое (🟥)</b> место — побудьте на месте Aziza.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label fade-up delay-1">{tr({ uz: 'Aziz panelni sinayapti', ru: 'Aziz тестирует панель' })}</p>
            <div className="fade-up delay-1"><GuardPanel spots={spots} onSpotClick={oops} /></div>
            {tried && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>😳 Aziz: <i>{tr({ uz: `"Voy! Shoshib bosdim — joy darrov bo'shab ketdi, 'rostdanmi?' ham demadi. To'lovni ham yozmadim shekilli..."`, ru: `«Ой! Нажал впопыхах — место сразу освободилось, никакого "точно?" не спросило. Кажется, и оплату не записал...»` })}</i></p></div>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Panel tayyor edi — endi nima qilamiz?', ru: 'Панель была готова — что делаем дальше?' })}</p>
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
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Avval band joyni bosib ko'ring ←", ru: 'Сначала нажмите на занятое место ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Biz o'z ishimizga juda yaqinmiz — kamchilikni o'zimiz ko'rmaymiz. Aziz esa uni bir bosishda topdi. Bugun <b>sinfdoshlardan fikr yig'ib</b>, panelni tartib bilan <b>yaxshilaymiz</b> (upgrade).</>, ru: <>Мы слишком близко к своей работе — сами недочёт не видим. А Aziz нашёл его с одного клика. Сегодня мы <b>соберём отзывы одноклассников</b> и по порядку <b>улучшим</b> панель (upgrade).</> })}</p>}
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
    { text: { uz: "Ko'rsatamiz — Demo Day", ru: 'Показываем — Demo Day' }, tag: 'PM' },
    { text: { uz: "Fikr yig'amiz — aniq", ru: 'Собираем отзывы — конкретные' }, tag: 'feedback' },
    { text: { uz: 'Saralaymiz — qaysi avval', ru: 'Приоритизируем — что сначала' }, tag: { uz: 'Foyda / Mehnat', ru: 'Польза / Усилия' } },
    { text: { uz: 'Upgrade qilamiz + qayta test', ru: 'Апгрейдим + повторный тест' }, tag: { uz: 'AI bilan', ru: 'с AI' } }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Dars oxirida — yangilangan panel', ru: 'В конце урока — обновлённая панель' })}</p>
      <GuardPanel spots={mkSpots()} tushum={20000} dash />
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: '→ tasdiq · dashboard · sozlamalar (narx, joylar soni)', ru: '→ подтверждение · дашборд · настройки (цена, число мест)' })}</p>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Yaxshilash sikli', ru: 'Цикл улучшения' })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span>{s.tag && <span className="step-tag">{tr(s.tag)}</span>}</span></li>))}
      </ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tayyor ilovani <span className="italic" style={{ color: T.accent }}>qanday</span> yaxshilaymiz?</>, ru: <>Готовое приложение — <span className="italic" style={{ color: T.accent }}>как</span> его улучшить?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yaxshi dasturchi shunchaki qurmaydi — <b style={{ color: T.ink }}>ko'rsatadi, fikr oladi va yaxshilaydi</b>. Bu — <b style={{ color: T.ink }}>sikl</b>: aylanma yo'l, oxiriga yetgach yana boshidan takrorlanadi. Bugun shu siklni o'tamiz: panelni ko'rsatamiz, sinfdosh fikrlarini yig'amiz, eng muhimini tanlaymiz va AI bilan yaxshilaymiz.</>, ru: <>Хороший разработчик не просто строит — он <b style={{ color: T.ink }}>показывает, собирает отзывы и улучшает</b>. Это — <b style={{ color: T.ink }}>цикл</b>: круговой путь, который, дойдя до конца, повторяется снова. Сегодня пройдём этот цикл: покажем панель, соберём отзывы одноклассников, выберем самое важное и улучшим с AI.</> })}</Mentor>
        {!isNarrow ? (
          <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable>
        ) : !showSteps ? (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "Siklning 4 qadamini ko'rish", ru: 'Показать 4 шага цикла' })}</button>
          </div>
        ) : (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>↩ {tr({ uz: "Natijani ko'rish", ru: 'Посмотреть результат' })}</button>
            {StepsBlock}
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — YAXSHI vs UMUMIY FIKR =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const SAMPLES = [
    { id: 'a', text: { uz: "Zo'r ekan, menga yoqdi! 👍", ru: 'Круто, мне понравилось! 👍' }, good: false, why: { uz: 'Umumiy maqtov — nimani yaxshilashni aytmaydi.', ru: 'Общая похвала — не говорит, что улучшать.' } },
    { id: 'b', text: { uz: "Band joyni bosganda tasdiq so'ramadi", ru: 'При нажатии на занятое место не спросило подтверждение' }, good: true, why: { uz: "Aniq muammo — to'g'ridan-to'g'ri tuzatsa bo'ladi.", ru: 'Конкретная проблема — можно сразу исправить.' } },
    { id: 'c', text: { uz: "Hmm, bilmadim, normalga o'xshaydi", ru: 'Хм, не знаю, вроде нормально' }, good: false, why: { uz: "Noaniq — hech qanday yo'nalish bermaydi.", ru: 'Расплывчато — не даёт никакого направления.' } },
    { id: 'd', text: { uz: "Nechta joy bo'shligi darrov ko'rinmaydi", ru: 'Не видно сразу, сколько мест свободно' }, good: true, why: { uz: "Aniq — qanday yaxshilashni ko'rsatadi.", ru: 'Конкретно — показывает, как улучшить.' } }
  ];
  const [ans, setAns] = useState(storedAnswer ? Object.fromEntries(SAMPLES.map(s => [s.id, s.good])) : {});
  const [sc, setSc] = useState(0);
  const done = Object.keys(ans).length >= SAMPLES.length;
  const mark = (s, val) => { if (ans[s.id] !== undefined) return; setAns(prev => ({ ...prev, [s.id]: val })); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'PM · fikr', ru: 'PM · отзыв' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Har fikrni baholang', ru: 'Оцените каждый отзыв' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qanday fikr foydali — <span className="italic" style={{ color: T.accent }}>"zo'r"</span>mi yoki aniqmi?</>, ru: <>Какой отзыв полезен — <span className="italic" style={{ color: T.accent }}>«круто»</span> или конкретный?</> })}</h2></div>
        <Mentor>{tr({ uz: <>"Zo'r ekan!" — yoqimli, lekin <b style={{ color: T.ink }}>nima qilishni</b> aytmaydi. Foydali fikr — <b style={{ color: T.ink }}>aniq</b> va <b style={{ color: T.ink }}>amalga oshsa bo'ladigan</b>. Har fikrni baholang: foydalimi yoki umumiy?</>, ru: <>«Круто!» — приятно, но не говорит, <b style={{ color: T.ink }}>что делать</b>. Полезный отзыв — <b style={{ color: T.ink }}>конкретный</b> и <b style={{ color: T.ink }}>выполнимый</b>. Оцените каждый отзыв: полезный или общий?</> })}</Mentor>
        <Zoomable>
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {SAMPLES.map(s => {
            const a = ans[s.id];
            return (
              <div key={s.id} className="frame" style={{ padding: '12px 14px', boxShadow: a === undefined ? undefined : `inset 0 0 0 1.5px ${a === s.good ? T.success : T.accent}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span className="body" style={{ flex: 1, minWidth: 180, color: T.ink }}>"{tr(s.text)}"</span>
                  {a === undefined
                    ? <span style={{ display: 'flex', gap: 6 }}><button className="btn-soft" onClick={() => mark(s, true)}>👍 {tr({ uz: 'Foydali', ru: 'Полезный' })}</button><button className="btn-soft" onClick={() => mark(s, false)}>👎 {tr({ uz: 'Umumiy', ru: 'Общий' })}</button></span>
                    : <span className="tagpill" style={{ color: s.good ? T.success : T.ink3 }}>{s.good ? <>👍 {tr({ uz: 'Foydali', ru: 'Полезный' })}</> : <>👎 {tr({ uz: 'Umumiy', ru: 'Общий' })}</>}</span>}
                </div>
                {a !== undefined && <p className="small fade-step" style={{ margin: '8px 0 0', color: a === s.good ? T.success : T.accent }}>{a === s.good ? '✓ ' : '✗ '}{tr(s.why)}</p>}
              </div>
            );
          })}
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Endi bilasiz: foydali fikr — aniq muammoni ko'rsatadi. Shunday fikrlarni yig'amiz.", ru: 'Теперь Вы знаете: полезный отзыв указывает на конкретную проблему. Такие отзывы мы и соберём.' })}</p></div>}
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — 4 FIKRNI YIG'ISH + MATCH-TAG =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [active, setActive] = useState(null);
  const [matched, setMatched] = useState(storedAnswer ? Object.fromEntries(FEEDBACK.map(f => [f.id, f.part])) : {});
  const [wrongPick, setWrongPick] = useState(null);
  const [sc, setSc] = useState(0);
  const done = Object.keys(matched).length >= FEEDBACK.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const tap = (f) => { setActive(f.id); setWrongPick(null); setSc(n => n + 1); };
  const cur = FEEDBACK.find(f => f.id === active);
  const pickPart = (p) => {
    if (!cur || matched[cur.id]) return;
    if (p === cur.part) { setMatched(prev => ({ ...prev, [cur.id]: p })); setWrongPick(null); setSc(n => n + 1); }
    else { setWrongPick(p); setTimeout(() => setWrongPick(w => w === p ? null : w), 900); }
  };
  return (
    <Stage eyebrow={tr({ uz: "Fikr yig'ish", ru: 'Сбор отзывов' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Fikrlarni belgilang', ru: 'Отметьте отзывы' })} (${Object.keys(matched).length}/4)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sinfdoshlar <span className="italic" style={{ color: T.accent }}>nima dedi</span>?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>сказали</span> одноклассники?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Demo Day'da to'rt kishi panelni sinadi va aniq fikr berdi. Har fikrni bosib o'qing, so'ng u <b style={{ color: T.ink }}>panelning qaysi qismiga</b> tegishli ekanini belgilang.</>, ru: <>На Demo Day четверо протестировали панель и дали конкретные отзывы. Нажмите на каждый отзыв, прочитайте, затем отметьте, <b style={{ color: T.ink }}>к какой части панели</b> он относится.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FEEDBACK.map(f => <FbCard key={f.id} fb={f} onClick={() => tap(f)} on={active === f.id} seen={!!matched[f.id]} />)}
            </div>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Tanlangan fikr', ru: 'Выбранный отзыв' })}</p>
            {cur
              ? <div className="frame fade-step" key={active}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}><Ava name={cur.who} color={cur.color} /><span className="fb-who">{cur.who}</span></div>
                  <p className="body" style={{ margin: 0, color: T.ink }}>"{tr(cur.text)}"</p>
                  <p className="small mono" style={{ margin: '10px 0 6px', color: T.ink2 }}>{tr({ uz: 'Bu qaysi qismga tegishli?', ru: 'К какой части это относится?' })}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {PART_OPTS.map(p => {
                      const ok = matched[cur.id] === p;
                      const bad = wrongPick === p;
                      return <button key={p} className="btn-soft" disabled={!!matched[cur.id]} onClick={() => pickPart(p)} style={ok ? { background: T.successSoft, color: T.success, boxShadow: `inset 0 0 0 1.5px ${T.success}` } : bad ? { background: T.accentSoft, color: T.accent, animation: 'dd-shake 0.4s' } : undefined}>{ok ? '✓ ' : ''}{tr(PART_LABELS[p])}</button>;
                    })}
                  </div>
                  {matched[cur.id] && <p className="small fade-step" style={{ margin: '9px 0 0', color: T.success }}>✓ {tr({ uz: "To'g'ri — yechim:", ru: 'Верно — решение:' })} {tr(cur.short)}</p>}
                </div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Fikrni bosib o'qing ←", ru: 'Нажмите на отзыв и прочитайте ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "4 ta aniq fikr yig'ildi. Lekin hammasini birdan qilib bo'lmaydi — qaysi birini avval qilamiz? Endi saralaymiz.", ru: 'Собраны 4 конкретных отзыва. Но всё сразу сделать нельзя — что делаем первым? Теперь приоритизируем.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    questionText={tr({ uz: 'Qaysi fikr eng foydali?', ru: 'Какой отзыв самый полезный?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Qaysi fikr <span className="italic" style={{ color: T.accent }}>eng foydali</span>?</>, ru: <>Какой отзыв <span className="italic" style={{ color: T.accent }}>самый полезный</span>?</> })}</h2></>}
    options={[tr({ uz: `"Umuman zo'r ekan!" — quruq maqtov`, ru: '«Вообще круто!» — пустая похвала' }), tr({ uz: `"Bilmadim, normalga o'xshaydi" — noaniq`, ru: '«Не знаю, вроде нормально» — расплывчато' }), tr({ uz: `"Chiqishda tasdiq yo'q" — aniq muammo`, ru: '«Нет подтверждения при выезде» — конкретная проблема' }), tr({ uz: '"Rangi juda chiroyli ekan" — bezak haqida', ru: '«Цвет очень красивый» — про оформление' })]} correctIdx={2}
    explainCorrect={tr({ uz: "To'g'ri! Aniq, amalga oshsa bo'ladigan fikr — eng foydalisi. U to'g'ridan-to'g'ri nimani tuzatishni ko'rsatadi.", ru: 'Верно! Конкретный, выполнимый отзыв — самый полезный. Он прямо показывает, что исправлять.' })}
    explainWrong={{
      0: tr({ uz: 'Maqtov yoqimli, lekin nimani yaxshilashni aytmaydi. Foydali fikr — aniq.', ru: 'Похвала приятна, но не говорит, что улучшать. Полезный отзыв — конкретный.' }),
      1: tr({ uz: "Noaniq fikr yo'nalish bermaydi. Foydali fikr — aniq muammoni ko'rsatadi.", ru: 'Расплывчатый отзыв не даёт направления. Полезный отзыв указывает на конкретную проблему.' }),
      3: tr({ uz: "Bezak haqidagi fikr ham bor, lekin eng foydalisi — aniq ishlash muammosini ko'rsatgani.", ru: 'Отзыв про оформление тоже бывает, но самый полезный — тот, что указывает на конкретную проблему в работе.' }),
      default: tr({ uz: "Eng foydali fikr — aniq va amalga oshsa bo'ladigan.", ru: 'Самый полезный отзыв — конкретный и выполнимый.' })
    }} />
);

// ===== SCREEN 5 — USTUVORLIK DOSKASI (haqiqiy DragDrop — pointer + DOM transform) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const initSlots = () => { const s = { Q1: [], Q2: [], Q3: [], Q4: [] }; if (storedAnswer) FEEDBACK.forEach(f => s[f.quad].push(f.id)); return s; };
  const [slots, setSlots] = useState(initSlots);
  const [armed, setArmed] = useState(null);
  const [overQ, setOverQ] = useState(null);
  const [rejectQ, setRejectQ] = useState(null);   // noto'g'ri katak — «meni emas» silkinishi
  const [note, setNote] = useState(null);
  const [sc, setSc] = useState(0);
  const quadRefs = useRef({});
  const cardRefs = useRef({});
  const overRef = useRef(null);   // hover'ni faqat O'ZGARGANDA state'ga yozamiz (sudrash pirillamasin)
  const placedIds = Object.values(slots).flat();
  const pool = FEEDBACK.filter(f => !placedIds.includes(f.id));
  const done = pool.length === 0;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  // Rad etish silkinishi — IMPERATIV (WAAPI): sudrashning inline transform'i bilan urishmaydi
  const shakeCard = (fid) => {
    const el = cardRefs.current[fid];
    if (!el || !el.animate) return;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }],
      { duration: 420, easing: 'cubic-bezier(.36,.07,.19,.97)' });
  };
  const place = (fid, q) => {
    const f = FEEDBACK.find(x => x.id === fid);
    if (!f || placedIds.includes(fid)) return;
    if (f.quad === q) {
      setSlots(prev => ({ ...prev, [q]: [...prev[q], f.id] })); setNote(null); setArmed(null); setSc(n => n + 1);
    } else {
      setArmed(null); setNote({ id: f.id, q, text: (CONSEQ[f.id] && CONSEQ[f.id][q]) || { uz: `${f.who}ning fikri ${QUAD[q].lbl.uz}ga to'g'ri kelmaydi — u aslida ${QUAD[f.quad].lbl.uz}.`, ru: `Отзыв ${f.who} не подходит в «${QUAD[q].lbl.ru}» — на самом деле это «${QUAD[f.quad].lbl.ru}».` } }); setSc(n => n + 1);
      setRejectQ(q); setTimeout(() => setRejectQ(r => r === q ? null : r), 460);
      shakeCard(f.id);
    }
  };
  const setOver = (q) => { if (overRef.current !== q) { overRef.current = q; setOverQ(q); } };
  const hitQuad = (x, y) => {
    let t = null;
    Object.keys(quadRefs.current).forEach(q => {
      const el = quadRefs.current[q]; if (!el) return;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) t = q;
    });
    return t;
  };
  // Sudrash — asl kartani DOM transform bilan suramiz (state emas → pirillamaydi;
  // `position:fixed` klon YO'Q → ekran pastida chiqmaydi). Pointer: sichqon HAM, barmoq HAM.
  const down = (ev, fid) => {
    if (ev.button != null && ev.button !== 0) return;
    ev.preventDefault();
    const el = ev.currentTarget; const sx = ev.clientX, sy = ev.clientY; let moved = false;
    el.style.transition = 'none'; el.style.zIndex = '30'; el.style.willChange = 'transform';
    const mv = (e) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) > 5) { moved = true; el.classList.add('vcard-lift'); setArmed(fid); }
      if (!moved) return;
      el.style.transform = `translate(${dx}px,${dy}px) scale(1.045) rotate(-1.6deg)`;
      setOver(hitQuad(e.clientX, e.clientY));
    };
    const clear = () => { el.classList.remove('vcard-lift'); el.style.zIndex = ''; el.style.willChange = ''; el.style.transform = ''; el.style.transition = ''; };
    const up = (e) => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
      setOver(null);
      if (!moved) { clear(); setArmed(a => a === fid ? null : fid); return; }   // sudramadi = tap → armed
      const q = hitQuad(e.clientX, e.clientY);
      const f = FEEDBACK.find(x => x.id === fid);
      if (q && f && f.quad === q) { clear(); place(fid, q); return; }           // to'g'ri katak → chip «chirt» o'tiradi
      el.style.transition = 'transform .26s cubic-bezier(.34,1.35,.4,1)';       // aks holda — joyiga qaytib o'tiradi (settle)
      el.style.transform = '';
      setTimeout(() => { clear(); if (q) place(fid, q); }, 260);                // qaytgach — oqibat-simulyatsiya
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  };
  const onDropQ = (q) => { setOver(null); if (armed) place(armed, q); };
  const inviteCards = !armed && placedIds.length === 0;   // hali hech narsa qo'yilmagan → kartalar «meni sudra» deb chaqiradi
  return (
    <Stage eyebrow={tr({ uz: 'Ustuvorlik doskasi', ru: 'Доска приоритетов' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Fikrlarni saralang', ru: 'Рассортируйте отзывы' })} (${placedIds.length}/4)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Avval <span className="italic" style={{ color: T.accent }}>qaysi birini</span> qilamiz?</>, ru: <>Что делаем <span className="italic" style={{ color: T.accent }}>в первую очередь</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Siz — jamoa rahbari. Bu — <b style={{ color: T.ink }}>ustuvorlik doskasi</b>: 4 katak, ikki o'lchov — <b style={{ color: T.ink }}>foyda</b> (qancha naf beradi) va <b style={{ color: T.ink }}>mehnat</b> (qancha ish talab qiladi). Har fikr-kartani o'z katagiga <b style={{ color: T.ink }}>sudrang</b> (yoki kartani bosing, keyin katakni). Noto'g'ri katak nima bo'lishini ko'rsatadi.</>, ru: <>Вы — лидер команды. Это — <b style={{ color: T.ink }}>доска приоритетов</b>: 4 клетки, два измерения — <b style={{ color: T.ink }}>польза</b> (сколько даёт) и <b style={{ color: T.ink }}>усилия</b> (сколько работы требует). <b style={{ color: T.ink }}>Перетащите</b> каждую карточку-отзыв в свою клетку (или нажмите карточку, потом клетку). Неверная клетка покажет, что случится.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Fikr-kartalar', ru: 'Карточки-отзывы' })} {armed && tr({ uz: '— endi katakni bosing', ru: '— теперь нажмите клетку' })}</p>
            {pool.length
              ? <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>{pool.map((f, i) => (
                  /* kirish-animatsiyasi O'RAMDA — kartaning o'zida sudrash transform'i va tap-hint erkin qoladi */
                  <div key={f.id} className="vc-in" style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                    <button ref={el => (cardRefs.current[f.id] = el)} className={`vcard ${armed === f.id ? 'vcard-armed' : ''} ${inviteCards ? 'tap-hint' : ''}`} onPointerDown={e => down(e, f.id)}>
                      <Ava name={f.who} color={f.color} sm /><span className="vlbl">{tr(f.short)}</span><span className="small" style={{ color: T.ink3, marginLeft: 'auto' }}>{armed === f.id ? tr({ uz: 'katakni tanlang', ru: 'выберите клетку' }) : tr({ uz: 'sudrang →', ru: 'тащите →' })}</span>
                    </button>
                  </div>
                ))}</div>
              : <div className="frame-success board-done"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Hammasi joylandi! <b style={{ color: T.success }}>⭐ Avval shu</b> katagidagilar — <b>Tasdiq</b> va <b>Dashboard</b> — ko'p foyda, kam mehnat. Shulardan boshlaymiz.</>, ru: <>Всё разложено! В клетке <b style={{ color: T.success }}>⭐ Сначала это</b> — <b>Подтверждение</b> и <b>Дашборд</b> — много пользы, мало усилий. С них и начнём.</> })}</p></div>}
            {note && <div key={`${note.id}-${note.q}`} className="frame-warn conseq"><p className="body" style={{ margin: 0, color: T.ink }}><span className="conseq-ic">⚠️</span> {tr(note.text)}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Foyda / Mehnat doskasi', ru: 'Доска Польза / Усилия' })}</p>
            <div className="mx-head"><span /><span className="mx-cap">{tr({ uz: 'Kam mehnat', ru: 'Мало усилий' })}</span><span className="mx-cap">{tr({ uz: "Ko'p mehnat", ru: 'Много усилий' })}</span></div>
            <div className="mx-grid">
              <span className="mx-rowcap">{tr({ uz: <>Ko'p<br />foyda</>, ru: <>Много<br />пользы</> })}</span>
              {['Q1', 'Q2'].map(q => (
                <div key={q} ref={el => (quadRefs.current[q] = el)} className={`quad drop ${slots[q].length ? 'filled' : 'empty'} ${overQ === q ? 'over' : ''} ${rejectQ === q ? 'reject' : ''} ${armed && overQ !== q && !slots[q].length ? 'q-invite' : ''}`} style={{ boxShadow: (overQ === q || slots[q].length) ? `inset 0 0 0 1.5px ${QUAD[q].color}` : 'none', outline: (overQ === q || slots[q].length) ? 'none' : `1.5px dashed ${QUAD[q].color}55`, outlineOffset: -3, background: overQ === q ? `${QUAD[q].color}14` : undefined }} onClick={() => onDropQ(q)}>
                  <span className="quad-lbl" style={{ color: QUAD[q].color }}>{tr(QUAD[q].lbl)}</span>
                  <div className="quad-items">{FEEDBACK.filter(f => f.quad === q && placedIds.includes(f.id)).map(f => <span key={f.id} className="quad-chip qd-settle" style={{ background: QUAD[q].color }}>{tr(f.short)}</span>)}</div>
                </div>
              ))}
              <span className="mx-rowcap">{tr({ uz: <>Kam<br />foyda</>, ru: <>Мало<br />пользы</> })}</span>
              {['Q3', 'Q4'].map(q => (
                <div key={q} ref={el => (quadRefs.current[q] = el)} className={`quad drop ${slots[q].length ? 'filled' : 'empty'} ${overQ === q ? 'over' : ''} ${rejectQ === q ? 'reject' : ''} ${armed && overQ !== q && !slots[q].length ? 'q-invite' : ''}`} style={{ boxShadow: (overQ === q || slots[q].length) ? `inset 0 0 0 1.5px ${QUAD[q].color}` : 'none', outline: (overQ === q || slots[q].length) ? 'none' : `1.5px dashed ${QUAD[q].color}55`, outlineOffset: -3, background: overQ === q ? `${QUAD[q].color}14` : undefined }} onClick={() => onDropQ(q)}>
                  <span className="quad-lbl" style={{ color: QUAD[q].color }}>{tr(QUAD[q].lbl)}</span>
                  <div className="quad-items">{FEEDBACK.filter(f => f.quad === q && placedIds.includes(f.id)).map(f => <span key={f.id} className="quad-chip qd-settle" style={{ background: QUAD[q].color }}>{tr(f.short)}</span>)}</div>
                </div>
              ))}
            </div>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — TEST 2 =====
const Screen6 = (props) => (
  <QuestionScreen {...props} idx={6} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    questionText={tr({ uz: 'Avval qaysi tuzatishni qilish kerak?', ru: 'Какое исправление нужно сделать первым?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Avval <span className="italic" style={{ color: T.accent }}>qaysi</span> tuzatishni qilamiz?</>, ru: <>Какое исправление делаем <span className="italic" style={{ color: T.accent }}>первым</span>?</> })}</h2></>}
    options={[tr({ uz: 'Eng qiyinini — u qiziqroq va murakkabroq', ru: 'Самое сложное — оно интереснее и посерьёзнее' }), tr({ uz: "Ko'p foyda + kam mehnat beradiganini", ru: 'То, что даёт много пользы при малых усилиях' }), tr({ uz: 'Kam foyda beradiganini — u tezroq bitadi', ru: 'То, что даёт мало пользы — быстрее закончится' }), tr({ uz: "Tasodifan tanlaganini — farqi yo'q", ru: 'Случайное — без разницы' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! Ko'p foyda + kam mehnat = eng aqlli boshlanish. Tez natija, katta yaxshilanish (bizda — tasdiq va dashboard).", ru: 'Верно! Много пользы + мало усилий = самое умное начало. Быстрый результат, большое улучшение (у нас — подтверждение и дашборд).' })}
    explainWrong={{
      0: tr({ uz: "Qiyin ish ko'p vaqt oladi, natija kech ko'rinadi. Avval — ko'p foyda + kam mehnat.", ru: 'Сложная работа занимает много времени, результат виден поздно. Сначала — много пользы + мало усилий.' }),
      2: tr({ uz: 'Kam foyda beradiganidan boshlash — vaqtni behuda sarflash. Avval foydalisini qilamiz.', ru: 'Начинать с малополезного — трата времени. Сначала делаем полезное.' }),
      3: tr({ uz: "Tasodif emas — tartib bilan: ko'p foyda + kam mehnat avval.", ru: 'Не случайно, а по порядку: сначала много пользы + мало усилий.' }),
      default: tr({ uz: "Avval — ko'p foyda + kam mehnat.", ru: 'Сначала — много пользы + мало усилий.' })
    }} />
);

// ===== SCREEN 7 — UPGRADE 1: CHIQISHDA TASDIQ =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [spots, setSpots] = useState(mkSpots());
  const [asking, setAsking] = useState(null);
  const [built, setBuilt] = useState(!!storedAnswer);
  const [didConfirm, setDidConfirm] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = built && didConfirm;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const clickSpot = (s) => { if (!built || !s.bandmi) return; setAsking(s); setSc(n => n + 1); };
  const confirmExit = () => { setSpots(prev => prev.map(x => x.id === asking.id ? { ...x, bandmi: false, mashina: null } : x)); setAsking(null); setDidConfirm(true); setSc(n => n + 1); };
  return (
    <Stage eyebrow={tr({ uz: 'Upgrade 1 · tasdiq', ru: 'Upgrade 1 · подтверждение' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (built ? tr({ uz: "Band joyni chiqarib ko'ring", ru: 'Выпустите занятое место' }) : tr({ uz: "Tasdiqni qo'shing", ru: 'Добавьте подтверждение' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tasodifiy chiqarishni qanday <span className="italic" style={{ color: T.accent }}>to'xtatamiz</span>?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>остановить</span> случайный выезд?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Birinchi upgrade — <b style={{ color: T.ink }}>chiqishda tasdiq</b>. Endi chiqarishdan oldin "Rostdan chiqarilsinmi?" deb so'raydi. AI'ga buyruq beramiz, keyin o'zingiz sinaysiz.</>, ru: <>Первый апгрейд — <b style={{ color: T.ink }}>подтверждение при выезде</b>. Теперь перед выездом панель спросит: «Точно выпустить?». Дадим команду AI, потом проверите сами.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Agentga prompt', ru: 'Промпт агенту' })}</p>
            <pre className="prompt-box fade-up delay-1">{tr({ uz: `Chiqarishdan oldin tasdiq so'rasin:
"Rostdan chiqarilsinmi?" → Ha bo'lsa chiqarsin,
Bekor bo'lsa hech narsa o'zgarmasin.`, ru: `Перед выездом пусть спросит подтверждение:
«Точно выпустить?» → Если Да — выпустить,
если Отмена — ничего не менять.` })}</pre>
            {!built
              ? <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={() => { setBuilt(true); setSc(n => n + 1); }}>📤 {tr({ uz: "AI'ga yuborish", ru: 'Отправить AI' })}</button>
              : <div className="ai-card fade-step"><div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: "Tasdiq qo'shildi:", ru: 'Подтверждение добавлено:' })}</span></div><div className="ai-code"><div className="ai-line ok" style={{ cursor: 'default', whiteSpace: 'pre-wrap' }}>{tr({ uz: "function chiqar(id){\n  if(confirm('Rostdan chiqarilsinmi?')){\n    // PUT /api/sessiyalar/:id\n  }\n}", ru: "function chiqar(id){\n  if(confirm('Точно выпустить?')){\n    // PUT /api/sessiyalar/:id\n  }\n}" })}</div></div></div>}
            {built && !didConfirm && <p className="small" style={{ color: T.accent, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Endi o'ngdagi band joyni bosing — tasdiq chiqadi.", ru: 'Теперь нажмите занятое место справа — появится подтверждение.' })}</p>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Yangilangan panel', ru: 'Обновлённая панель' })}</p>
            <GuardPanel spots={spots} onSpotClick={built ? clickSpot : undefined} />
            {asking && (
              <div className="frame fade-step" style={{ boxShadow: `inset 0 0 0 1.5px ${T.danger}, 0 8px 22px -6px rgba(${T.shadowBase},0.2)` }}>
                <p className="note-h" style={{ color: T.danger }}>{tr({ uz: 'Rostdan chiqarilsinmi?', ru: 'Точно выпустить?' })}</p>
                <p className="body" style={{ margin: '0 0 11px', color: T.ink }}>{asking.raqam} ({asking.mashina}) {tr({ uz: "chiqariladi va to'lov yoziladi.", ru: 'будет выпущено, оплата запишется.' })}</p>
                <div style={{ display: 'flex', gap: 9 }}>
                  <button className="btn-soft" onClick={() => { setAsking(null); setSc(n => n + 1); }}>{tr({ uz: 'Bekor', ru: 'Отмена' })}</button>
                  <button className="btn" style={{ background: T.success }} onClick={confirmExit}>{tr({ uz: 'Ha, chiqarilsin', ru: 'Да, выпустить' })}</button>
                </div>
              </div>
            )}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ Endi tasodifiy chiqarish yo'q — panel avval so'raydi. Aziz topgan muammo hal bo'ldi!", ru: '✓ Случайного выезда больше нет — панель сначала спрашивает. Проблема, которую нашёл Aziz, решена!' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — UPGRADE 2: DASHBOARD =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [on, setOn] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = on;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Upgrade 2 · dashboard', ru: 'Upgrade 2 · дашборд' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Dashboardni yoqing', ru: 'Включите дашборд' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qorovul holatni <span className="italic" style={{ color: T.accent }}>bir qarashda</span> ko'rsinmi?</>, ru: <>Пусть охранник видит всё <span className="italic" style={{ color: T.accent }}>с одного взгляда</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Laylo: "nechta bo'sh, nechta band — darrov ko'rinmadi". Yechim — <b style={{ color: T.ink }}>dashboard</b> (holat paneli): yuqorida yirik raqamlar bilan bo'sh joy, band joy va kunlik tushum turadi. Tugmani bosib, eski va yangi ko'rinishni solishtiring.</>, ru: <>Laylo: «сколько свободно, сколько занято — сразу не видно». Решение — <b style={{ color: T.ink }}>дашборд</b> (панель состояния): сверху крупными цифрами свободные места, занятые и дневная выручка. Нажмите кнопку и сравните старый и новый вид.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{on ? tr({ uz: 'Yangi — dashboard bilan', ru: 'Новый — с дашбордом' }) : tr({ uz: 'Eski — kichik sanagich', ru: 'Старый — маленький счётчик' })}</p>
            <GuardPanel spots={mkSpots()} tushum={30000} dash={on} />
          </Col>
          <Col>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={on} onClick={() => { setOn(true); setSc(n => n + 1); }}>{on ? tr({ uz: '✓ Dashboard yoqildi', ru: '✓ Дашборд включён' }) : tr({ uz: '▶ Dashboardni yoqish', ru: '▶ Включить дашборд' })}</button>
            <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "🟩 bo'sh va 🟥 band soni — yirik, ranglar bilan.", ru: '🟩 свободные и 🟥 занятые — крупно, с цветами.' })}</p></div>
            <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "💰 kunlik tushum ham darrov ko'rinadi.", ru: '💰 дневная выручка тоже видна сразу.' })}</p></div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ Endi qorovul boshini ko'tarib, bir soniyada hammasini ko'radi. Laylo ham mamnun!", ru: '✓ Теперь охранник поднимает голову и за секунду видит всё. Laylo довольна!' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — UPGRADE 3: REJISSYOR — SOZLAMALAR PANELINI AI QO'SHADI =====
const SET_PROMPT = { uz: `Panelga ⚙ "Sozlamalar" tugmasi qo'sh.
Bosilsa — yondan panel ochilsin:
• narxni o'zgartirish
• joylar sonini tanlash (8 / 12 / 20)
"Saqlash"da panel darrov yangilansin.`, ru: `Добавь на панель кнопку ⚙ «Настройки».
По нажатию — пусть открывается боковая панель:
• изменение цены
• выбор числа мест (8 / 12 / 20)
При «Сохранить» панель сразу обновляется.` };
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [built, setBuilt] = useState(!!storedAnswer);
  const [opened, setOpened] = useState(!!storedAnswer);
  const [drawer, setDrawer] = useState(false);
  const [narx, setNarx] = useState('10000');
  const [count, setCount] = useState(8);
  const [sc, setSc] = useState(0);
  const done = built && opened;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const open = () => { setDrawer(true); setOpened(true); setSc(n => n + 1); };
  return (
    <Stage eyebrow={tr({ uz: 'Upgrade 3 · sozlamalar', ru: 'Upgrade 3 · настройки' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (built ? tr({ uz: '⚙ ni bosib oching', ru: 'Нажмите ⚙ и откройте' }) : tr({ uz: "Promptni AI'ga bering", ru: 'Отправьте промпт AI' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Narx va joylarni qorovul <span className="italic" style={{ color: T.accent }}>o'zi sozlasin</span> — qanday qilamiz?</>, ru: <>Пусть охранник <span className="italic" style={{ color: T.accent }}>сам настраивает</span> цену и места — как это сделать?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bek va Diana topgan muammo: narx va joylar soni kodda qotib qolgan. Yechim — <b style={{ color: T.ink }}>yondan ochiladigan Sozlamalar paneli</b>: qorovul narx va joylar sonini o'zi o'zgartiradi. Buni AI'ga aniq prompt berib qo'shamiz — keyin o'zingiz ochib ko'rasiz.</>, ru: <>Проблема, которую нашли Bek и Diana: цена и число мест зашиты в коде. Решение — <b style={{ color: T.ink }}>боковая панель Настроек</b>: охранник сам меняет цену и число мест. Добавим её, дав AI точный промпт — потом откроете сами.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">Agentga prompt</p>
            <pre className="prompt-box fade-up delay-1">{tr(SET_PROMPT)}</pre>
            {!built
              ? <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={() => { setBuilt(true); setSc(n => n + 1); }}>📤 {tr({ uz: "Promptni AI'ga yuborish", ru: 'Отправить промпт AI' })}</button>
              : <div className="ai-card fade-step"><div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">⚙ {tr({ uz: "Sozlamalar paneli qo'shildi:", ru: 'Панель настроек добавлена:' })}</span></div><div className="ai-code"><div className="ai-line ok" style={{ cursor: 'default', whiteSpace: 'pre-wrap' }}>{tr({ uz: "const [show,setShow]=useState(false);\n<button onClick={()=>setShow(true)}>⚙ Sozlamalar</button>\n{show && <Drawer narx={narx} joylar={count} onSave={saqla}/>}\n// saqla: UPDATE sozlamalar + joylar", ru: "const [show,setShow]=useState(false);\n<button onClick={()=>setShow(true)}>⚙ Настройки</button>\n{show && <Drawer narx={narx} joylar={count} onSave={saqla}/>}\n// saqla: UPDATE sozlamalar + joylar" })}</div></div></div>}
          </Col>
          <Col>
            <p className="flow-label">{built ? tr({ uz: "Natija — ⚙ ni bosib ko'ring", ru: 'Результат — нажмите ⚙' }) : tr({ uz: 'Natija', ru: 'Результат' })}</p>
            <div style={{ position: 'relative' }}>
              <GuardPanel spots={mkSpots()} tushum={20000} dash onSettings={built ? open : undefined} />
              <SettingsDrawer open={drawer} narx={narx} setNarx={setNarx} count={count} setCount={setCount} dirty onSave={() => setDrawer(false)} onClose={() => setDrawer(false)} />
            </div>
            {!built && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Prompt yuborilgach, panelda ⚙ paydo bo'ladi.", ru: 'После отправки промпта на панели появится ⚙.' })}</p>}
            {built && !opened && <p className="small" style={{ color: T.accent, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Yuqori o'ngdagi ⚙ ni bosing — panel yondan ochiladi.", ru: 'Нажмите ⚙ справа вверху — панель откроется сбоку.' })}</p>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Mana yondan ochiladigan Sozlamalar paneli! Endi narx va joylar sonini shu yerda boshqarasiz — keyingi qadamda o'zingiz sinab ko'rasiz.", ru: 'Вот боковая панель Настроек! Теперь цена и число мест управляются здесь — на следующем шаге попробуете сами.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TEST 3 =====
const Screen10 = (props) => (
  <QuestionScreen {...props} idx={10} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    questionText={tr({ uz: "Mavjud narxni o'zgartirish uchun qaysi SQL amali?", ru: 'Какая SQL-команда изменяет существующую цену?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Mavjud narxni <span className="italic" style={{ color: T.accent }}>o'zgartirish</span> uchun?</>, ru: <>Что нужно, чтобы <span className="italic" style={{ color: T.accent }}>изменить</span> существующую цену?</> })}</h2></>}
    options={[tr({ uz: "INSERT — jadvalga yangi qator qo'shish", ru: 'INSERT — добавить новую строку в таблицу' }), tr({ uz: "DELETE — jadvaldan qatorni o'chirish", ru: 'DELETE — удалить строку из таблицы' }), tr({ uz: "SELECT — jadvaldan ma'lumot o'qish", ru: 'SELECT — прочитать данные из таблицы' }), tr({ uz: "UPDATE — mavjud qatorni o'zgartirish", ru: 'UPDATE — изменить существующую строку' })]} correctIdx={3}
    explainCorrect={tr({ uz: "To'g'ri! Narx allaqachon bor — uni o'zgartiramiz, yangi qator qo'shmaymiz. Mavjudni o'zgartirish = UPDATE.", ru: 'Верно! Цена уже есть — мы её изменяем, а не добавляем новую строку. Изменить существующее = UPDATE.' })}
    explainWrong={{
      0: tr({ uz: "INSERT yangi qator qo'shadi — bizda narx bor, uni o'zgartiramiz: UPDATE.", ru: 'INSERT добавляет новую строку — а у нас цена уже есть, её меняем: UPDATE.' }),
      1: tr({ uz: "DELETE o'chiradi. Narxni o'zgartirish — UPDATE.", ru: 'DELETE удаляет. Изменить цену — UPDATE.' }),
      2: tr({ uz: "SELECT faqat o'qiydi. O'zgartirish uchun UPDATE.", ru: 'SELECT только читает. Для изменения — UPDATE.' }),
      default: tr({ uz: "Mavjudni o'zgartirish = UPDATE.", ru: 'Изменить существующее = UPDATE.' })
    }} />
);

// ===== SCREEN 11 — CASE · SOZLAMALARNI O'ZINGIZ ISHLATING (drawer) =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [drawer, setDrawer] = useState(false);
  const [narx, setNarx] = useState('10000');
  const [savedNarx, setSavedNarx] = useState(storedAnswer ? 15000 : 10000);
  const [count, setCount] = useState(storedAnswer ? 12 : 8);
  const [applied, setApplied] = useState(storedAnswer ? 12 : 8);
  const [changed, setChanged] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = changed;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const dirty = (parseInt(narx, 10) || 0) !== savedNarx || count !== applied;
  const save = () => { const v = parseInt(narx, 10) || savedNarx; setSavedNarx(v); setApplied(count); setDrawer(false); setChanged(true); setSc(n => n + 1); };
  const spots = mkSpots({ 2: '01A123BC', 5: '01B456DE' }, applied);
  const cols = applied > 12 ? 5 : 4;
  return (
    <Stage eyebrow={tr({ uz: 'Sozlamalar · amaliyot', ru: 'Настройки · практика' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: '⚙ ni ochib, sozlab saqlang', ru: 'Откройте ⚙, настройте и сохраните' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi o'zingiz — narx va joylarni <span className="italic" style={{ color: T.accent }}>sozlang</span>.</>, ru: <>Теперь сами — <span className="italic" style={{ color: T.accent }}>настройте</span> цену и места.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Paneldagi <b style={{ color: T.ink }}>⚙</b> ni bosing — yondan Sozlamalar ochiladi. <b style={{ color: T.ink }}>Narxni</b> o'zgartiring (mas. 15 000), <b style={{ color: T.ink }}>joylar sonini</b> ko'paytiring (12), so'ng <b style={{ color: T.ink }}>Saqlash</b>. Panel darrov yangilanadi — bu bazada <span className="mono">UPDATE</span>.</>, ru: <>Нажмите <b style={{ color: T.ink }}>⚙</b> на панели — сбоку откроются Настройки. Измените <b style={{ color: T.ink }}>цену</b> (напр. 15 000), увеличьте <b style={{ color: T.ink }}>число мест</b> (12), затем <b style={{ color: T.ink }}>Сохранить</b>. Панель сразу обновится — это <span className="mono">UPDATE</span> в базе.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Joriy sozlamalar', ru: 'Текущие настройки' })}</p>
            <div className="frame" style={{ padding: 15 }}>
              <div className="set-row" style={{ borderBottom: `1px solid ${T.bg}`, paddingBottom: 9 }}><span className="set-lbl">{tr({ uz: 'Soatlik narx', ru: 'Цена в час' })}</span><span className="set-val">{sp(savedNarx)} {tr({ uz: "so'm", ru: 'сум' })}</span></div>
              <div className="set-row" style={{ paddingTop: 9 }}><span className="set-lbl">{tr({ uz: 'Joylar soni', ru: 'Число мест' })}</span><span className="set-val">{applied} {tr({ uz: 'ta', ru: 'шт.' })}</span></div>
            </div>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              <span className="tagpill" style={{ color: savedNarx !== 10000 ? T.success : T.ink3 }}>{savedNarx !== 10000 ? '✓' : '○'} {tr({ uz: "Narx o'zgardi", ru: 'Цена изменена' })}</span>
              <span className="tagpill" style={{ color: applied !== 8 ? T.success : T.ink3 }}>{applied !== 8 ? '✓' : '○'} {tr({ uz: "Joylar ko'paydi", ru: 'Мест стало больше' })}</span>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Sozlamalar saqlandi! Kod o'zgarmadi — qorovul panelni o'zi boshqardi. Ilova endi <b>sozlanadigan</b> va <b>o'sib boradigan</b>.</>, ru: <>✓ Настройки сохранены! Код не менялся — охранник сам управлял панелью. Приложение теперь <b>настраиваемое</b> и <b>растущее</b>.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Panel', ru: 'Панель' })} — {applied} {tr({ uz: 'joy', ru: 'мест' })} · {sp(savedNarx)} {tr({ uz: "so'm", ru: 'сум' })}</p>
            <div style={{ position: 'relative' }}>
              <GuardPanel spots={spots} tushum={30000} dash cols={cols} onSettings={() => setDrawer(true)} />
              <SettingsDrawer open={drawer} narx={narx} setNarx={setNarx} count={count} setCount={setCount} dirty={dirty} onSave={save} onClose={() => setDrawer(false)} />
            </div>
            {!drawer && !done && <p className="small" style={{ color: T.accent, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Yuqori o'ngdagi ⚙ ni bosing →", ru: 'Нажмите ⚙ справа вверху →' })}</p>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TO'LIQ YANGILANGAN PANEL (sinash) =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [spots, setSpots] = useState(mkSpots({ 2: '01A123BC', 5: '01B456DE' }, 12));
  const [asking, setAsking] = useState(null);
  const [tushum, setTushum] = useState(0);
  const [acts, setActs] = useState(storedAnswer ? 2 : 0);
  const [sc, setSc] = useState(0);
  const done = acts >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const click = (s) => { if (s.bandmi) { setAsking(s); setSc(n => n + 1); } };
  const confirmExit = () => { setSpots(prev => prev.map(x => x.id === asking.id ? { ...x, bandmi: false, mashina: null } : x)); setTushum(t => t + 15000); setAsking(null); setActs(a => a + 1); setSc(n => n + 1); };
  return (
    <Stage eyebrow={tr({ uz: 'Qayta test', ru: 'Повторный тест' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bandlarni tasdiq bilan chiqaring', ru: 'Выпустите занятые с подтверждением' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yangilangan panel — endi <span className="italic" style={{ color: T.accent }}>qanday ishlaydi</span>?</>, ru: <>Обновлённая панель — <span className="italic" style={{ color: T.accent }}>как она работает</span> теперь?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Hamma upgrade bir joyda: <b style={{ color: T.ink }}>dashboard</b>, <b style={{ color: T.ink }}>12 joy</b>, narx <b style={{ color: T.ink }}>15 000</b>, va <b style={{ color: T.ink }}>tasdiq</b>. Band joylarni chiqarib ko'ring — endi avval so'raydi, tushum yangi narxda o'sadi.</>, ru: <>Все апгрейды в одном месте: <b style={{ color: T.ink }}>дашборд</b>, <b style={{ color: T.ink }}>12 мест</b>, цена <b style={{ color: T.ink }}>15 000</b> и <b style={{ color: T.ink }}>подтверждение</b>. Попробуйте выпустить занятые места — теперь панель сначала спрашивает, а выручка растёт по новой цене.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Yangilangan qorovul paneli', ru: 'Обновлённая панель охранника' })}</p>
            <GuardPanel spots={spots} onSpotClick={click} tushum={tushum} dash cols={4} />
          </Col>
          <Col>
            {asking
              ? <div className="frame fade-step" style={{ boxShadow: `inset 0 0 0 1.5px ${T.danger}` }}>
                <p className="note-h" style={{ color: T.danger }}>{tr({ uz: 'Rostdan chiqarilsinmi?', ru: 'Точно выпустить?' })}</p>
                <p className="body" style={{ margin: '0 0 11px', color: T.ink }}>{asking.raqam} ({asking.mashina}) — {tr({ uz: "to'lov", ru: 'оплата' })} {sp(15000)} {tr({ uz: "so'm", ru: 'сум' })}.</p>
                <div style={{ display: 'flex', gap: 9 }}><button className="btn-soft" onClick={() => { setAsking(null); setSc(n => n + 1); }}>{tr({ uz: 'Bekor', ru: 'Отмена' })}</button><button className="btn" style={{ background: T.success }} onClick={confirmExit}>{tr({ uz: 'Ha, chiqarilsin', ru: 'Да, выпустить' })}</button></div>
              </div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Band (🟥) joyni bosing — tasdiq chiqadi', ru: 'Нажмите занятое (🟥) место — появится подтверждение' })}</p></div>}
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              <span className="tagpill" style={{ color: T.success }}>✓ {tr({ uz: 'Tasdiq', ru: 'Подтверждение' })}</span>
              <span className="tagpill" style={{ color: T.success }}>✓ {tr({ uz: 'Dashboard', ru: 'Дашборд' })}</span>
              <span className="tagpill" style={{ color: T.success }}>✓ {tr({ uz: 'Narx 15 000', ru: 'Цена 15 000' })}</span>
              <span className="tagpill" style={{ color: T.success }}>✓ {tr({ uz: '12 joy', ru: '12 мест' })}</span>
            </div>
            {done && <div className="takeaway fade-step"><div className="ta-bulb">🎉</div><p className="ta-h">{tr({ uz: 'Panel yaxshilandi!', ru: 'Панель улучшена!' })}</p><p className="ta-sub">{tr({ uz: '4 fikr → 4 upgrade. Foydalanuvchi mamnun.', ru: '4 отзыва → 4 апгрейда. Пользователь доволен.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — TEST 4 =====
const Screen13 = (props) => (
  <QuestionScreen {...props} idx={13} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    questionText={tr({ uz: 'Mahsulotni yaxshilash sikli qanday?', ru: 'Как выглядит цикл улучшения продукта?' })}
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Mahsulotni <span className="italic" style={{ color: T.accent }}>yaxshilash sikli</span> qanday?</>, ru: <>Как выглядит <span className="italic" style={{ color: T.accent }}>цикл улучшения</span> продукта?</> })}</h2></>}
    options={[tr({ uz: "Qur → ko'rsat → fikr ol → sarala → upgrade", ru: 'Построй → покажи → собери отзывы → приоритизируй → апгрейд' }), tr({ uz: "Qur → e'lon qil → boshqa qaytib tegma", ru: 'Построй → объяви → больше не трогай' }), tr({ uz: "Qur → fikr so'rama → o'zi bilgancha tuzat", ru: 'Построй → не спрашивай отзывов → чини по-своему' }), tr({ uz: 'Qur → hamma yaxshilanishni birdan qil', ru: 'Построй → сделай все улучшения разом' })]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! Yaxshi mahsulot — qurib, foydalanuvchiga ko'rsatib, fikr olib, eng muhimini saralab, yaxshilanadi. Bu — to'xtovsiz sikl.", ru: 'Верно! Хороший продукт строится, показывается пользователю, собирает отзывы, приоритизирует важное и улучшается. Это — непрерывный цикл.' })}
    explainWrong={{
      1: tr({ uz: "Qurib unutish — mahsulot o'smaydi. Foydalanuvchi fikri bilan yaxshilanadi.", ru: '«Построил и забыл» — продукт не растёт. Он улучшается благодаря отзывам пользователей.' }),
      2: tr({ uz: "O'zingiz hammasini ko'ra olmaysiz — foydalanuvchi fikri kamchilikni ochadi.", ru: 'Сами Вы всего не увидите — отзыв пользователя вскрывает недочёты.' }),
      3: tr({ uz: "Hammasini birdan qilib bo'lmaydi — saralab, eng muhimidan boshlaymiz.", ru: 'Всё сразу сделать нельзя — приоритизируем и начинаем с самого важного.' }),
      default: tr({ uz: "Sikl: qur → ko'rsat → fikr → sarala → upgrade.", ru: 'Цикл: построй → покажи → отзывы → приоритизируй → апгрейд.' })
    }} />
);

// ===== SCREEN 14 — MODUL SAYOHATI (P1→P4) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const JOURNEY = [
    { n: { uz: 'Praktika 1', ru: 'Практика 1' }, t: { uz: 'Backend CRUD', ru: 'Backend CRUD' }, d: { uz: 'Express + PostgreSQL, sxema, pool.query', ru: 'Express + PostgreSQL, схема, pool.query' }, emoji: '🗄️' },
    { n: { uz: 'Praktika 2', ru: 'Практика 2' }, t: { uz: 'Fullstack ulash', ru: 'Fullstack-соединение' }, d: { uz: 'fetch ↔ API, loading/error, CORS', ru: 'fetch ↔ API, loading/error, CORS' }, emoji: '🔗' },
    { n: { uz: 'Praktika 3', ru: 'Практика 3' }, t: { uz: 'Loyiha kuni', ru: 'День проекта' }, d: { uz: "2 jadval bog'lanishi (JOIN), qorovul paneli", ru: 'связь 2 таблиц (JOIN), панель охранника' }, emoji: '🅿️' },
    { n: { uz: 'Praktika 4', ru: 'Практика 4' }, t: { uz: 'Feedback bilan yaxshilash', ru: 'Доработка по фидбеку' }, d: { uz: 'Demo → fikr → sarala → upgrade', ru: 'Демо → отзывы → приоритизация → апгрейд' }, emoji: '💬' }
  ];
  const [seen, setSeen] = useState(storedAnswer ? new Set([0, 1, 2, 3]) : new Set());
  const [sc, setSc] = useState(0);
  const done = seen.size >= JOURNEY.length;
  const tap = (i) => { setSeen(prev => { const s = new Set(prev); s.add(i); return s; }); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Sayohat', ru: 'Путешествие' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Bosqichlarni ko'ring", ru: 'Просмотрите этапы' })} (${seen.size}/4)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>4-modulda <span className="italic" style={{ color: T.accent }}>nimalarni</span> qurdingiz?</>, ru: <>Что Вы <span className="italic" style={{ color: T.accent }}>построили</span> в 4-м модуле?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bitta yo'l — to'rt qadam. Noldan boshlab, to'liq fullstack ilova qurdingiz va uni yaxshiladingiz. Har bosqichni bosib eslang.", ru: 'Один путь — четыре шага. С нуля Вы построили полноценное fullstack-приложение и улучшили его. Нажмите на каждый этап и вспомните.' })}</Mentor>
        <div className="journey fade-up delay-1">
          {JOURNEY.map((j, i) => (
            <button key={i} className={`jrow ${seen.has(i) ? 'jrow-on' : ''}`} onClick={() => tap(i)}>
              <span className="jemoji">{j.emoji}</span>
              <span className="jn">{tr(j.n)}</span>
              <span className="jcol"><span className="jt">{tr(j.t)}</span>{seen.has(i) && <span className="jd fade-step">{tr(j.d)}</span>}</span>
              <span style={{ marginLeft: 'auto', color: seen.has(i) ? T.success : T.ink3, fontWeight: 700 }}>{seen.has(i) ? '✓' : '○'}</span>
            </button>
          ))}
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mana butun yo'l: baza → server → ulanish → loyiha → yaxshilash. Endi siz <b>fullstack quruvchisiz</b>.</>, ru: <>Вот весь путь: база → сервер → соединение → проект → улучшение. Теперь Вы — <b>fullstack-строитель</b>.</> })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — QOIDA: YAXSHI DASTURCHI =====
const Screen15 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Qoida · xulosa', ru: 'Правило · вывод' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Oxirgi qadam →', ru: 'Последний шаг →' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yaxshi dasturchi nimasi bilan <span className="italic" style={{ color: T.accent }}>ajralib turadi</span>?</>, ru: <>Чем <span className="italic" style={{ color: T.accent }}>выделяется</span> хороший разработчик?</> })}</h2></div>
      <Mentor>{tr({ uz: <>Kod yozish — yarmi. Yaxshi dasturchi mahsulotni <b style={{ color: T.ink }}>foydalanuvchi uchun</b> doimo yaxshilab boradi. Bu — to'xtovsiz sikl.</>, ru: <>Писать код — половина дела. Хороший разработчик постоянно улучшает продукт <b style={{ color: T.ink }}>для пользователя</b>. Это — непрерывный цикл.</> })}</Mentor>
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Yaxshilash sikli', ru: 'Цикл улучшения' })}</p>
          <div className="roadmap">
            <div className="step-card"><span className="step-num">01</span><span className="step-body"><span className="step-text">{tr({ uz: 'Qur', ru: 'Построй' })}</span><span className="step-tag">{tr({ uz: 'ishlaydigan mahsulot', ru: 'работающий продукт' })}</span></span></div>
            <div className="step-card"><span className="step-num">02</span><span className="step-body"><span className="step-text">{tr({ uz: "Ko'rsat va fikr ol", ru: 'Покажи и собери отзывы' })}</span><span className="step-tag">{tr({ uz: 'aniq fikr (feedback)', ru: 'конкретный отзыв (feedback)' })}</span></span></div>
            <div className="step-card"><span className="step-num">03</span><span className="step-body"><span className="step-text">{tr({ uz: 'Sarala', ru: 'Приоритизируй' })}</span><span className="step-tag">{tr({ uz: 'foyda / mehnat doskasi', ru: 'доска польза / усилия' })}</span></span></div>
            <div className="step-card"><span className="step-num">04</span><span className="step-body"><span className="step-text">{tr({ uz: 'Upgrade qil', ru: 'Сделай апгрейд' })}</span><span className="step-tag">{tr({ uz: "→ yana ko'rsat", ru: '→ снова покажи' })}</span></span></div>
          </div>
        </Col>
        <Col>
          <p className="flow-label">{tr({ uz: 'Yodda tuting', ru: 'Запомните' })}</p>
          <div className="frame-success"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>O'z ishingizga juda yaqinsiz — <b>foydalanuvchi fikri</b> kamchilikni ochadi.</>, ru: <>Вы слишком близко к своей работе — <b>отзыв пользователя</b> вскрывает недочёты.</> })}</p></div>
          <div className="frame" style={{ padding: 14 }}><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Foydali fikr — <b style={{ color: T.ink }}>aniq</b>. Saralash — <b style={{ color: T.ink }}>ko'p foyda + kam mehnat</b> avval. Sozlama — kodda emas, <b style={{ color: T.ink }}>bazada</b> (UPDATE).</>, ru: <>Полезный отзыв — <b style={{ color: T.ink }}>конкретный</b>. Приоритизация — сначала <b style={{ color: T.ink }}>много пользы + мало усилий</b>. Настройка — не в коде, а <b style={{ color: T.ink }}>в базе</b> (UPDATE).</> })}</p></div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== SCREEN 16 — YAKUNIY (VS Code: chiqishda tasdiq — confirm) =====
const Screen16 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [value, setValue] = useState(storedAnswer?.picked || '');
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const norm = value.replace(/\s+/g, '').trim();
  const valid = /^confirm$/i.test(norm);
  useEffect(() => {
    if (valid && !passed) {
      setPassed(true);
      onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'VS Code: chiqishda tasdiq — confirm yozing', studentAnswer: value, correct: true, firstAttemptCorrect: true, solved: true, picked: value });
    }
  }, [valid]);
  const Ln = ({ n, children }) => (<div className="vsc-line"><span className="vsc-ln">{n}</span><span style={{ whiteSpace: 'pre' }}>{children}</span></div>);
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} scrollSignal={passed} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!passed} label={passed ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Tasdiqni o'zingiz yozing", ru: 'Напишите подтверждение сами' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: chiqishda <span className="italic" style={{ color: T.accent }}>tasdiqni</span> o'zingiz yozing.</>, ru: <>Последний шаг: напишите <span className="italic" style={{ color: T.accent }}>подтверждение</span> при выезде сами.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Birinchi upgrade — chiqishda "Rostdan chiqarilsinmi?". Buni <span className="mono">confirm(...)</span> qiladi: foydalanuvchidan <b style={{ color: T.ink }}>Ha / Yo'q</b> so'raydi. Ha bo'lsa chiqaradi. Bo'sh joyga shu so'zni yozing.</>, ru: <>Первый апгрейд — «Точно выпустить?» при выезде. Это делает <span className="mono">confirm(...)</span>: спрашивает у пользователя <b style={{ color: T.ink }}>Да / Нет</b>. Если Да — выпускает. Впишите это слово в пустое поле.</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="vsc fade-up delay-2">
              <div className="vsc-bar"><span className="vsc-tab on"><span style={{ color: '#61DAFB' }}>⚛</span> Panel.jsx <span style={{ color: '#6E7681', marginLeft: 4 }}>×</span></span></div>
              <div className="vsc-body">
                <Ln n={1}><Jx>{'function'}</Jx><span style={{ color: '#DCDCAA' }}> chiqar</span>{'(id) {'}</Ln>
                <div className="vsc-line">
                  <span className="vsc-ln">2</span>
                  <span style={{ whiteSpace: 'pre' }}>{'  '}<Jx>if</Jx>{' ( '}</span>
                  <input className={`vsc-input ${valid ? 'ok' : ''}`} value={value} onChange={e => setValue(e.target.value)} placeholder="confirm" spellCheck={false} autoCapitalize="off" autoCorrect="off" style={{ maxWidth: 130 }} />
                  <span style={{ whiteSpace: 'pre', color: '#D4D4D4' }}>{tr({ uz: "('Rostdan chiqarilsinmi?') ) {", ru: "('Точно выпустить?') ) {" })}</span>
                </div>
                <Ln n={3}>{'    '}<Cm>{'// PUT /api/sessiyalar/:id'}</Cm></Ln>
                <Ln n={4}>{'  }'}</Ln>
                <Ln n={5}>{'}'}</Ln>
              </div>
            </div>
            <div className="fade-up delay-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tagpill" style={{ opacity: valid ? 1 : 0.4 }}>{valid ? '✓' : '1'} confirm(...)</span>
            </div>
            {passed && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ Mukammal! Endi chiqarishdan oldin panel so'raydi — tasodifiy o'chirish yo'q. Aziz topgan muammo hal!", ru: '✓ Отлично! Теперь перед выездом панель спрашивает — случайного удаления нет. Проблема, которую нашёл Aziz, решена!' })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija — panelda', ru: 'результат — на панели' })}</p>
            {valid
              ? <div className="frame fade-step" style={{ boxShadow: `inset 0 0 0 1.5px ${T.danger}` }}><p className="note-h" style={{ color: T.danger }}>{tr({ uz: 'Rostdan chiqarilsinmi?', ru: 'Точно выпустить?' })}</p><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: 'A2 (01A123BC) chiqariladi.', ru: 'A2 (01A123BC) будет выпущено.' })}</p><div style={{ display: 'flex', gap: 9 }}><span className="btn-soft">{tr({ uz: 'Bekor', ru: 'Отмена' })}</span><span className="btn" style={{ background: T.success }}>{tr({ uz: 'Ha, chiqarilsin', ru: 'Да, выпустить' })}</span></div></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: 'confirm yozilmaguncha tasdiq chiqmaydi…', ru: 'пока не написан confirm, подтверждение не появится…' })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 17 — YAKUN (MODUL FINALI) =====
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
    { uz: "Mahsulotni qurib, foydalanuvchiga ko'rsatib, fikr olish", ru: 'Построить продукт, показать пользователю и собрать отзывы' },
    { uz: 'Aniq fikr (feedback) — umumiy maqtov emas', ru: 'Конкретный отзыв (feedback) — а не общая похвала' },
    { uz: "Saralash: Foyda / Mehnat doskasida ko'p foyda + kam mehnat avval", ru: 'Приоритизация: на доске Польза / Усилия сначала много пользы + мало усилий' },
    { uz: 'Upgrade: tasdiq, dashboard, sozlamalar (narx UPDATE, joylar soni)', ru: 'Апгрейды: подтверждение, дашборд, настройки (цена через UPDATE, число мест)' },
    { uz: '4-MODUL: baza → server → ulanish → loyiha → yaxshilash', ru: '4-Й МОДУЛЬ: база → сервер → соединение → проект → улучшение' }
  ];
  const HOMEWORK = [
    { b: { uz: "Fikr yig'ing", ru: 'Соберите отзывы' }, t: { uz: "— o'z loyihangizni 2-3 kishiga ko'rsatib, aniq fikr so'rang", ru: '— покажите свой проект 2-3 людям и попросите конкретный отзыв' } },
    { b: { uz: 'Saralang', ru: 'Приоритизируйте' }, t: { uz: "— fikrlarni foyda/mehnat bo'yicha tartiblang", ru: '— разложите отзывы по пользе/усилиям' } },
    { b: { uz: 'Bitta upgrade', ru: 'Один апгрейд' }, t: { uz: "— eng yuqorisini AI bilan tuzating va qayta ko'rsating", ru: '— исправьте самый важный с AI и покажите снова' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor · modul finali', ru: 'Готово · финал модуля' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: '4-modul yakunlandi', ru: 'Модуль 4 завершён' })} 🎓</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Siz endi <span className="italic" style={{ color: T.accent }}>fullstack quruvchisiz</span>.</>, ru: <>Теперь Вы — <span className="italic" style={{ color: T.accent }}>fullstack-строитель</span>.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: "Tabriklaymiz! Ilova qurasiz, ulagasiz, foydalanuvchi fikri bilan yaxshilaysiz — haqiqiy dasturchi yo'li.", ru: 'Поздравляем! Вы строите приложение, соединяете его и улучшаете по отзывам пользователей — путь настоящего разработчика.' }) : tr({ uz: "Yaxshi harakat! Feedback sikli va sozlamalar (UPDATE) qismini qayta ko'rib chiqing.", ru: 'Хорошая попытка! Пересмотрите часть про цикл фидбека и настройки (UPDATE).' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь Вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>📝 {tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "O'z loyihangizda siklni o'tang:", ru: 'Пройдите цикл на своём проекте:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">🎉 {tr({ uz: "Backend modulini tamomladingiz: baza, server, fullstack ulanish va mahsulotni yaxshilash — hammasi sizning qo'lingizda!", ru: 'Вы завершили модуль Backend: база, сервер, fullstack-соединение и улучшение продукта — всё в Ваших руках!' })}</p></div>
        </div>
        {!isMentorL && <div className="card ach-coll fade-up d3">
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
        </div>}
      </div>
    </Stage>
  );
};

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
      <div className="card-lbl" style={{ color: T.blue }}>👀 {tr({ uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загрузка…' })}</p>
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
function ScreenLivePractice({ title, task, checklist, screen, storedAnswer, onAnswer, onNext, onPrev, live }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const [checked, setChecked] = useState(() => new Set());
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const toggle = (i) => setChecked(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; });
  const complete = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: (title && title.uz) || title, solved: true, correct: true, picked: true }); // payload — UZ-etalon
    // JONLI: praktika bajarilgani serverga yoziladi (500+ zona — reytingga aralashmaydi, faqat mentor ko'radi)
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  // JONLI: mentor keyingi sahifaga o'tmaguncha NavNext qulf bo'ladi (optionalLive + LiveGateCtx gate). Hozircha done bo'lsa ochiq.
  const audio = useAudio([{ id: `practice_${screen}`, text: `Endi navbat sizda — bu topshiriqni o'z kompyuteringizda, VS Code'da bajarasiz. Loyihangizni sinfdoshlaringizga ko'rsatib, aniq fikr so'raysiz, fikrlarni Foyda / Mehnat doskasiga joylaysiz va eng muhim bittasini yaxshilaysiz. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Выполняйте и отмечайте каждый этап. Когда закончите, нажмите кнопку <b style={{ color: T.ink }}>«Выполнил»</b> — наставник наблюдает.</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="lp-task fade-up delay-1">
              <div className="lp-task-h"><span className="lp-task-badge">{tr({ uz: 'TOPSHIRIQ', ru: 'ЗАДАНИЕ' })}</span></div>
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr(task)}</p>
            </div>
            <MentorPracticeStats live={_live} screen={screen} />
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Bosqichlar — belgilab boring', ru: 'Этапы — отмечайте по ходу' })}</p>
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
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: 'Отлично! Задание выполнено. Наставник проверит и переведёт Вас на следующий шаг.' })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
}

const ScreenFeedbackPractice = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "O'z loyihangizni yaxshilang", ru: 'Улучшите свой проект' }}
    task={{ uz: "O'z loyihangizni 2-3 sinfdoshingizga ko'rsating, aniq fikr so'rang, fikrlarni Foyda / Mehnat doskasiga joylang, eng muhimini tanlang va shu bittasini AI bilan tuzatib qayta ko'rsating.", ru: 'Покажите свой проект 2-3 одноклассникам, попросите конкретные отзывы, разложите их на доске Польза / Усилия, выберите самый важный и исправьте его с AI, затем покажите снова.' }}
    checklist={[
      { uz: "2-3 sinfdoshingizga loyihani ko'rsating va `nima chalkash edi?` deb aniq fikr so'rang", ru: 'Покажите проект 2-3 одноклассникам и попросите конкретный отзыв: `что было непонятно?`' },
      { uz: "Yig'ilgan fikrlarni Foyda / Mehnat doskasiga yozing — har birini o'z katagiga joylang", ru: 'Запишите собранные отзывы на доску Польза / Усилия — каждый в свою клетку' },
      { uz: "«⭐ Avval shu» katagidan bitta yaxshilanishni tanlang (ko'p foyda + kam mehnat)", ru: 'Выберите одно улучшение из клетки «⭐ Сначала это» (много пользы + мало усилий)' },
      { uz: "Shu bitta yaxshilanishni AI'ga aniq prompt berib tuzattiring", ru: 'Исправьте это одно улучшение, дав AI точный промпт' },
      { uz: "Yangilangan loyihani qayta ko'rsating va fikr yaxshilanganini tekshiring", ru: 'Покажите обновлённый проект снова и проверьте, что отзывы стали лучше' }
    ]} />
);

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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'atama yodlandi', ru: 'терминов выучено' })}</p><button className="fc-btn ghost" onClick={restart}>↻ {tr({ uz: 'Qaytadan takrorlash', ru: 'Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Учим' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
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
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>✗ {tr({ uz: 'Takrorlash', ru: 'Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })}</button></div>)
        : (<p className="fc-hint">👆 {tr({ uz: "Kartani bosing — javobni ko'rasiz", ru: 'Нажмите карточку — увидите ответ' })}</p>)}
    </div>
  );
}

// 🃏 FEEDBACK FLASHCARD KARTALARI (front=savol, back=qisqa javob, note=bir qatorlik izoh)
const FB_FLASHCARDS = [
  { front: { uz: 'Foydalanuvchining mahsulot haqidagi fikri qanday ataladi?', ru: 'Как называется мнение пользователя о продукте?' }, back: 'Feedback', note: { uz: "Feedback — fikr; aniq bo'lsagina foydali", ru: 'Feedback — отзыв; полезен, только когда конкретен' } },
  { front: { uz: "Nega «Zo'r ekan!» yetarli fikr emas?", ru: 'Почему «Круто!» — недостаточный отзыв?' }, back: { uz: 'Nimani yaxshilashni aytmaydi', ru: 'Не говорит, что улучшать' }, note: { uz: "Maqtov yoqimli, lekin yo'nalish bermaydi", ru: 'Похвала приятна, но не даёт направления' } },
  { front: { uz: "Eng foydali fikr qanday bo'ladi?", ru: 'Каким бывает самый полезный отзыв?' }, back: { uz: "Aniq va bajarsa bo'ladigan", ru: 'Конкретным и выполнимым' }, note: { uz: "Masalan: «chiqishda tasdiq so'ralmadi»", ru: 'Например: «при выезде не спросили подтверждение»' } },
  { front: { uz: "«Yoqmadi» degan fikrni qanday foydali qilasiz?", ru: 'Как сделать отзыв «не понравилось» полезным?' }, back: { uz: "Aniq muammoni so'raysiz", ru: 'Спрашиваете конкретную проблему' }, note: { uz: "«Aynan nimasi chalkash edi?» deb so'raysiz", ru: 'Спрашиваете: «что именно было непонятно?»' } },
  { front: { uz: 'Doskadagi Impact va Effort nimani bildiradi?', ru: 'Что означают Impact и Effort на доске?' }, back: { uz: 'Foyda va mehnat', ru: 'Польза и усилия' }, note: { uz: 'Impact — qancha naf, Effort — qancha ish', ru: 'Impact — сколько пользы, Effort — сколько работы' } },
  { front: { uz: 'Fikrlarni saralash uchun qaysi doskadan foydalanasiz?', ru: 'Какой доской пользуетесь, чтобы расставить отзывы по важности?' }, back: { uz: 'Foyda / Mehnat doskasi', ru: 'Доска Польза / Усилия' }, note: { uz: 'Har fikr 4 katakdan biriga tushadi', ru: 'Каждый отзыв попадает в одну из 4 клеток' } },
  { front: { uz: 'Doskaning qaysi katagidagi ishni birinchi qilasiz?', ru: 'Работу из какой клетки доски делаете первой?' }, back: { uz: "Ko'p foyda + kam mehnat", ru: 'Много пользы + мало усилий' }, note: { uz: '«⭐ Avval shu» katagi — natija tez chiqadi', ru: 'Клетка «⭐ Сначала это» — результат виден быстро' } },
  { front: { uz: 'Nega «eng qiyinini avval qilamiz» xato?', ru: 'Почему «сначала самое сложное» — ошибка?' }, back: { uz: "Natija kech ko'rinadi", ru: 'Результат виден поздно' }, note: { uz: "Qiyin ish ko'p vaqt oladi, foyda esa kutib qoladi", ru: 'Сложная работа занимает много времени, а польза ждёт' } },
  { front: { uz: "Band joydan tasodifan chiqib ketishni nima to'xtatadi?", ru: 'Что остановит случайный выезд с занятого места?' }, back: { uz: 'Tasdiq (confirm)', ru: 'Подтверждение (confirm)' }, note: { uz: "Muhim amaldan oldin «rostdanmi?» — Ha / Yo'q", ru: 'Перед важным действием «точно?» — Да / Нет' } },
  { front: { uz: "Bo'sh, band va tushumni bir qarashda nima ko'rsatadi?", ru: 'Что показывает свободно, занято и выручку с одного взгляда?' }, back: 'Dashboard', note: { uz: 'Dashboard — holat paneli, sanashga hojat yo\'q', ru: 'Дашборд — панель состояния, считать не нужно' } },
  { front: { uz: "Bazadagi mavjud narxni qaysi SQL amali o'zgartiradi?", ru: 'Какая SQL-команда меняет уже существующую цену в базе?' }, back: 'UPDATE', note: { uz: "UPDATE mavjud qatorni o'zgartiradi, INSERT yangisini qo'shadi", ru: 'UPDATE меняет существующую строку, INSERT добавляет новую' } },
  { front: { uz: 'Mahsulotni yaxshilash sikli qanday ketadi?', ru: 'Как идёт цикл улучшения продукта?' }, back: { uz: "Qur → ko'rsat → fikr ol → sarala → upgrade", ru: 'Построй → покажи → собери отзывы → приоритизируй → апгрейд' }, note: { uz: 'Keyin yana ko\'rsatasiz — sikl takrorlanadi', ru: 'Потом показываете снова — цикл повторяется' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tushunchalarni <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <>Быстро <span className="italic" style={{ color: T.accent }}>повторим</span> понятия.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Darsni yakunlashdan oldin bugun o'rgangan tushunchalarni takrorlaymiz. Har kartada bir savol — <b style={{ color: T.ink }}>javobini</b> o'ylang, keyin kartani bosib tekshiring.</>, ru: <>Перед завершением урока повторим выученные сегодня понятия. На каждой карточке — вопрос: подумайте, <b style={{ color: T.ink }}>каким будет ответ</b>, потом нажмите карточку и проверьте.</> })}</Mentor>
        <div className="fc-center"><Flashcards cards={FB_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — dars davomidagi REAL bosqichlar uchun =====
const ACHIEVEMENTS = {
  prioritizer:  { icon: '🎯', name: 'Prioritizer!',  desc: { uz: "Fikrlarni Foyda / Mehnat doskasiga to'g'ri joyladingiz", ru: 'Вы правильно разложили отзывы на доске Польза / Усилия' } },
  configurator: { icon: '⚙️', name: 'Configurator!', desc: { uz: "Mavjud narxni o'zgartirish UPDATE ekanini topdingiz", ru: 'Вы определили, что изменение существующей цены — это UPDATE' } },
  shipper:      { icon: '🚀', name: 'Shipper!',      desc: { uz: "Mahsulotni yaxshilash siklini to'g'ri ko'rsatdingiz", ru: 'Вы правильно указали цикл улучшения продукта' } },
  guardian:     { icon: '🛡️', name: 'Guardian!',     desc: { uz: "Chiqishda tasdiqni (confirm) o'zingiz yozdingiz", ru: 'Вы сами написали подтверждение (confirm) при выезде' } }
};
// Ekran id → nishon (recordAnswer'da, faqat REAL solve bilan: SCORED test / DragDrop challenge).
// ⚠️ Exploration/case ekranlarga BOG'LANMAYDI — u yerda xato qilish imkoni yo'q, nishon tekin beriladi.
const ACH_TRIGGERS = { s5: 'prioritizer', s10: 'configurator', s13: 'shipper', s16: 'guardian' };
function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr({ uz: 'Yangi nishon:', ru: 'Новый значок:' })} ${ach.name}`}>
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

// Podium savol yorliqlari (SCORED_IDX indekslariga mos)
const Q_LABELS = { 4: { uz: '1 — fikr', ru: '1 — отзыв' }, 6: { uz: '2 — sarala', ru: '2 — приоритет' }, 10: { uz: '3 — UPDATE', ru: '3 — UPDATE' }, 13: { uz: '4 — sikl', ru: '4 — цикл' }, 16: { uz: '5 — tasdiq', ru: '5 — подтверждение' } };
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si
const QZ_BG_SHAPES = [
  { ch: 'feedback',  l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: 'Impact',    l: 84, t: 7,  s: 30, d: 23, dl: 1.5 },
  { ch: 'Effort',    l: 8,  t: 72, s: 30, d: 27, dl: 0.8 },
  { ch: 'confirm',   l: 78, t: 68, s: 30, d: 21, dl: 2.2 },
  { ch: 'UPDATE',    l: 44, t: 86, s: 28, d: 25, dl: 1.1 },
  { ch: 'dashboard', l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: '⭐',        l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: 'upgrade',   l: 55, t: 5,  s: 28, d: 22, dl: 0.6 },
  { ch: 'Settings',  l: 91, t: 42, s: 24, d: 24, dl: 1.3 },
  { ch: '🅿️',       l: 2,  t: 45, s: 30, d: 26, dl: 2.6 }
];
// ⚔️ Mustahkamlash-jang savollari (12: 3/3/3/3) — to'g'ri javoblar 4 pozitsiyaga teng taqsimlangan.
const QUIZ_BANK = [
  { q: { uz: 'Qaysi fikr eng foydali?', ru: 'Какой отзыв самый полезный?' }, opts: [ { uz: "«Rangi chiroyli, ko'zga yoqadi» — bezak", ru: '«Цвет красивый, радует глаз» — оформление' }, { uz: "«Umuman zo'r ekan, juda yoqdi!» — maqtov", ru: '«Вообще круто, очень понравилось!» — похвала' }, { uz: "«Bilmadim, normalga o'xshaydi» — noaniq", ru: '«Не знаю, вроде нормально» — расплывчато' }, { uz: "«Chiqishda tasdiq yo'q» — aniq muammo", ru: '«Нет подтверждения при выезде» — конкретная проблема' }], correct: 3 },
  { q: { uz: "«Zo'r ekan!» nega yetarli fikr emas?", ru: 'Почему «Круто!» — недостаточный отзыв?' }, opts: [{ uz: 'Uzoq yozilgani uchun yaxshi fikr', ru: 'Длинный отзыв — значит хороший' }, { uz: 'Nimani yaxshilashni aytmaydi', ru: 'Не говорит, что улучшать' }, { uz: "Har doim yolg'on bo'lib chiqadi", ru: 'Всегда оказывается неправдой' }, { uz: 'Faqat mentor aytishi mumkin', ru: 'Так может говорить только ментор' }], correct: 1 },
  { q: { uz: "«Yoqmadi» ni foydali fikrga qanday aylantiramiz?", ru: 'Как превратить «не понравилось» в полезный отзыв?' }, opts: [{ uz: "E'tibor bermay, o'zimizcha davom etamiz", ru: 'Не обращаем внимания и продолжаем по-своему' }, { uz: "«Ko'proq yoqsin» deb qayta so'raymiz", ru: 'Переспрашиваем: «пусть понравится больше»' }, { uz: "Aniq muammoni so'raymiz: nima chalkash edi?", ru: 'Спрашиваем конкретную проблему: что было непонятно?' }, { uz: "Xafa bo'lib loyihani butunlay o'chiramiz", ru: 'Обижаемся и удаляем проект совсем' }], correct: 2 },
  { q: { uz: 'Doskaning qaysi katagidagi ishni avval qilamiz?', ru: 'Из какой клетки доски делаем работу первой?' }, opts: [ { uz: "Ko'p foyda + kam mehnat", ru: 'Много пользы + мало усилий' }, { uz: "Ko'p foyda + ko'p mehnat", ru: 'Много пользы + много усилий' }, { uz: 'Kam foyda + kam mehnat', ru: 'Мало пользы + мало усилий' }, { uz: "Kam foyda + ko'p mehnat", ru: 'Мало пользы + много усилий' }], correct: 0 },
  { q: { uz: "«Eng qiyinini avval qilamiz» nega xato?", ru: 'Почему «сначала самое сложное» — ошибка?' }, opts: [ { uz: 'Qiyin ish har doim mutlaqo befoyda', ru: 'Сложная работа всегда совсем бесполезна' }, { uz: "Ko'p vaqt oladi, natija kech ko'rinadi", ru: 'Занимает много времени, результат виден поздно' }, { uz: 'Oson ishlar umuman qilinmay qoladi', ru: 'Лёгкие дела вообще останутся несделанными' }, { uz: "Foyda hech qachon muhim bo'lmaydi", ru: 'Польза никогда не бывает важна' }], correct: 1 },
  { q: { uz: "Ko'p foyda beradigan, lekin katta ish qayerga?", ru: 'Куда идёт работа с большой пользой, но большим трудом?' }, opts: [ { uz: '«Rejaga ol» — keyin bajaramiz', ru: '«Запланируй» — сделаем позже' }, { uz: '«⭐ Avval shu» — hoziroq qilamiz', ru: '«⭐ Сначала это» — делаем прямо сейчас' }, { uz: '«Shart emas» — tashlab ketamiz', ru: '«Не нужно» — бросаем' }, { uz: "«Oson, keyin» — bo'sh vaqtda", ru: '«Легко, потом» — в свободное время' }], correct: 0 },
  { q: { uz: "Band joyni tasodifan chiqarishni nima to'xtatadi?", ru: 'Что остановит случайный выезд с занятого места?' }, opts: [{ uz: "Dashboard panelini qo'shish", ru: 'Добавить панель дашборда' }, { uz: 'Soatlik narxni oshirish', ru: 'Поднять цену за час' }, { uz: "Joylar sonini ko'paytirish", ru: 'Увеличить число мест' }, { uz: 'Chiqishda tasdiq (confirm)', ru: 'Подтверждение при выезде (confirm)' }], correct: 3 },
  { q: { uz: "Bo'sh/band/tushumni bir qarashda ko'rsatadigan upgrade?", ru: 'Какой апгрейд показывает свободно/занято/выручку с одного взгляда?' }, opts: [{ uz: 'Chiqishda tasdiq (confirm)', ru: 'Подтверждение при выезде (confirm)' }, { uz: 'Joylar sonini kamaytirish', ru: 'Уменьшение числа мест' }, { uz: 'Dashboard (holat paneli)', ru: 'Дашборд (панель состояния)' }, { uz: 'Soatlik narxni yashirish', ru: 'Скрытие цены за час' }], correct: 2 },
  { q: { uz: "Narx va joylar sonini qorovul o'zi sozlashi uchun?", ru: 'Что нужно, чтобы охранник сам настраивал цену и число мест?' }, opts: [{ uz: 'Sozlamalar (Settings) paneli', ru: 'Панель настроек (Settings)' }, { uz: 'Kodni har safar qayta yozish', ru: 'Каждый раз переписывать код' }, { uz: 'Har safar yangi sayt ochish', ru: 'Каждый раз открывать новый сайт' }, { uz: 'Hech narsa — bu imkonsiz ish', ru: 'Ничего — это невозможно' }], correct: 0 },
  { q: { uz: "Mavjud narxni o'zgartirish uchun qaysi SQL amali?", ru: 'Какая SQL-команда изменяет существующую цену?' }, opts: [{ uz: "INSERT — jadvalga yangi qator qo'shadi", ru: 'INSERT — добавляет новую строку в таблицу' }, { uz: "DELETE — jadvaldan qatorni o'chiradi", ru: 'DELETE — удаляет строку из таблицы' }, { uz: "UPDATE — mavjud qatorni o'zgartiradi", ru: 'UPDATE — изменяет существующую строку' }, { uz: "SELECT — jadvaldan ma'lumot o'qiydi", ru: 'SELECT — читает данные из таблицы' }], correct: 2 },
  { q: { uz: 'UPDATE va INSERT farqi nimada?', ru: 'В чём разница между UPDATE и INSERT?' }, opts: [{ uz: "Ikkalasi ham bir xil ishlaydi, farqi yo'q", ru: 'Оба работают одинаково, разницы нет' }, { uz: "UPDATE mavjudni o'zgartiradi, INSERT yangi qo'shadi", ru: 'UPDATE изменяет существующее, INSERT добавляет новое' }, { uz: "INSERT mavjudni o'zgartiradi, UPDATE yangi qo'shadi", ru: 'INSERT изменяет существующее, UPDATE добавляет новое' }, { uz: 'Faqat nomi bilan farq qiladi, ishi bir xil', ru: 'Отличаются только названием, работа одна' }], correct: 1 },
  { q: { uz: 'Mahsulotni yaxshilash sikli qanday?', ru: 'Как выглядит цикл улучшения продукта?' }, opts: [{ uz: "Qur → e'lon qil → boshqa qaytib tegma", ru: 'Построй → объяви → больше не трогай' }, { uz: "Qur → fikr so'rama → o'zi bilgancha tuzat", ru: 'Построй → не спрашивай отзывов → чини по-своему' }, { uz: 'Qur → hamma yaxshilanishni birdan qil', ru: 'Построй → сделай все улучшения разом' }, { uz: "Qur → ko'rsat → fikr ol → sarala → upgrade", ru: 'Построй → покажи → собери отзывы → приоритизируй → апгрейд' }], correct: 3 }
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
// ===== ⚔️ MUSTAHKAMLASH-JANG (Kahoot arena) — signal zonasi: 100+ (test <100, praktika 500+ bilan to'qnashmaydi) =====
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
    const TOK = ['feedback', 'Impact', 'Effort', 'confirm', 'UPDATE', 'dashboard', '⭐', 'upgrade', 'Settings', '🅿️'];
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
      if (typeof window !== 'undefined' && !window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nВсё равно закрыть?' }))) return;
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
          <span>⚠️ {tr({ uz: "Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: 'Живой урок завершён — продолжите тест сами:' })}</span>
          <button className="qz-btn" onClick={startPractice}>📖 {tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме практики' })}</button>
        </div>
      )}

      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее правильный ответ — тем больше баллов. Серия правильных ответов даёт 🔥 бонус!' })}</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>▶ {tr({ uz: 'Testni boshlash', ru: 'Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">⏳ {tr({ uz: 'Mentor testni boshlashini kuting…', ru: 'Подождите, пока ментор начнёт тест…' })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>▶ {tr({ uz: 'Boshlash', ru: 'Начать' })}</button>}
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
          {my && !isMentor && !solo && <p className="qz-waitmsg">✔ {tr({ uz: 'Javob qabul qilindi — natijani kuting…', ru: 'Ответ принят — ждите результат…' })}</p>}
          {isMentor && (
            <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">✓ {tr({ uz: 'Hamma javob berdi!', ru: 'Все ответили!' })}</span>}
              <button className="qz-btn" onClick={() => ctrl('r', qi)}>⏹ {tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Мимо — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Быстрее! ⏱' })}</span>}
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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: "🏁 Natijani ko'rish", ru: '🏁 Посмотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Следующий →' })}</button>}
        </div>
      )}

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">🏆 {tr({ uz: 'Test yakunlandi!', ru: 'Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? tr({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · лучшая серия 🔥x${soloScore.maxStreak}` }) : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ {tr({ uz: 'Qayta ishlash', ru: 'Пройти заново' })}</button>
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
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: 'Siz', ru: 'Вы' })} — <b>{myRank + 1}-{tr({ uz: "o'rin", ru: 'место' })}</b> · {board[myRank].pts} {tr({ uz: 'ball', ru: 'баллов' })}</p>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ {tr({ uz: 'Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: 'Пройти тест заново — практика (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: 'Siz', ru: 'Вы' })} — <b>{myIdx + 1}-{tr({ uz: "o'rin", ru: 'место' })}</b> ({board[myIdx].okCount}/{totalQ} {tr({ uz: "to'g'ri", ru: 'верно' })})</p>}
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
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT
export default function FullstackFeedbackLesson({ lang: langProp, onFinished }) {
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
  // Sinfdosh-tracker (App-scope)
  const trkRef = useRef(new Set());
  const [resolved, setResolved] = useState(() => new Set());
  // ETALON — 1920px (InternetLesson): keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, window.innerWidth / 1920)); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // Javob kaliti: inline testlar + praktika signali + jang savollari (mentor ochganda set_quiz_keys bilan serverga yuklanadi)
  // `practice: -1` — ScreenLivePractice «Bajardim» signali (500+ zona) baholanmaydigan sentinel; kalitsiz qolsa server uni noaniq javob deb ko'radi.
  const answerKey = { ...INLINE_KEYS, practice: -1, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
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
    if (_m && data && data.correct) {
      if (ACH_TRIGGERS[_m.id]) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat REAL solve)
      if (TRK_MAP[_m.id]) { TRK_MAP[_m.id].forEach(fid => trkRef.current.add(fid)); setResolved(new Set(trkRef.current)); }
      // JONLI: yakuniy yozma test (s16, scope 'final' — QuestionScreen EMAS, custom ekran) serverga yoziladi,
      // aks holda podiumda 5-nuqta (tasdiq) o'quvchida bo'sh qoladi. QuestionScreen testlari o'zi pick()'da yuboradi.
      if (_m.scored && _m.scope === 'final' && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);
    }
  };
  const reset = () => { progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); earnedRef.current = new Set(); setEarned(new Set()); trkRef.current = new Set(); setResolved(new Set()); };
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16, ScreenFeedbackPractice, ScreenPodium, ScreenFlashcards, Screen17];
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
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.6; cursor: not-allowed; }
        .pick-on { background: ${T.accentSoft} !important; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }

        /* === VCARD === */
        .vcard { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 12px 15px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover { transform: translateY(-1px); }
        .vlbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }

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

        /* === AI CARD / PROMPT === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 12.5px; color: ${CODE.text}; padding: 7px 9px; border-radius: 6px; white-space: pre-wrap; line-height: 1.6; }
        .ai-line.ok { background: rgba(31,122,77,0.16); }
        .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .prompt-box { background: #FFF8F3; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 13px 15px; margin: 0; font-family: 'JetBrains Mono', monospace; font-size: clamp(11.5px,1.4vw,13px); line-height: 1.7; color: ${T.ink}; white-space: pre-wrap; word-break: break-word; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.18); }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
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

        /* === QOROVUL PANELI === */
        .guard { border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.2); }
        .guard-top { background: ${CODE.bg}; color: #fff; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .guard-title { font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; } .guard-title small { font-weight: 500; color: ${CODE.punct}; }
        .guard-stats { display: flex; gap: 8px; } .gst { font-family: 'Manrope'; font-weight: 800; font-size: 12px; padding: 3px 9px; border-radius: 99px; } .gst.free { background: rgba(31,122,77,0.25); } .gst.busy { background: rgba(194,54,43,0.3); }
        .guard-body { padding: 12px; }
        .guard-foot { padding: 9px 14px; background: ${T.bg}; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; } .guard-foot b { color: ${T.ink}; }
        .gear { border: none; background: rgba(255,255,255,0.15); color: #fff; width: 28px; height: 28px; border-radius: 8px; font-size: 15px; cursor: pointer; transition: all 0.18s; display: inline-flex; align-items: center; justify-content: center; }
        .gear:hover { background: ${T.accent}; transform: rotate(45deg); }
        /* yondan ochiladigan Sozlamalar paneli */
        .drawer-bd { position: absolute; inset: 0; background: rgba(14,14,16,0.25); border-radius: 14px; z-index: 4; animation: fade-step 0.2s ease; }
        .drawer { position: absolute; top: 0; right: 0; height: 100%; width: min(82%,250px); background: #fff; box-shadow: -10px 0 28px -10px rgba(${T.shadowBase},0.4); border-radius: 0 14px 14px 0; padding: 15px; z-index: 5; overflow-y: auto; animation: drawer-in 0.28s cubic-bezier(.2,.7,.2,1); }
        @keyframes drawer-in { from { transform: translateX(100%); opacity: 0.5; } to { transform: none; opacity: 1; } }
        .drawer-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .drawer-title { font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .drawer-x { border: none; background: ${T.bg}; width: 26px; height: 26px; border-radius: 7px; cursor: pointer; font-size: 12px; color: ${T.ink2}; }
        .drawer-x:hover { background: ${T.dangerSoft}; color: ${T.danger}; }
        .set-val { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .dash { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; padding: 11px 12px; background: ${T.bg}; }
        .dash-card { background: #fff; border-radius: 11px; padding: 9px 6px; display: flex; flex-direction: column; align-items: center; gap: 2px; box-shadow: 0 4px 12px -7px rgba(${T.shadowBase},0.2); }
        .dash-num { font-family: 'Fraunces', serif; font-size: clamp(18px,3vw,24px); line-height: 1; }
        .dash-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 9.5px; color: ${T.ink2}; }
        .pgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .spot { border: none; border-radius: 12px; padding: 10px 6px; display: flex; flex-direction: column; align-items: center; gap: 3px; min-height: 80px; justify-content: center; position: relative; transition: all 0.2s; }
        .spot.spot-sm { min-height: 58px; padding: 6px 3px; gap: 1px; }
        .spot.free { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px rgba(31,122,77,0.28); }
        .spot.busy { background: ${T.dangerSoft}; box-shadow: inset 0 0 0 1.5px rgba(194,54,43,0.35); }
        .spot:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.28); }
        .spot-tag { font-family: 'Manrope'; font-weight: 800; font-size: 8px; color: #fff; padding: 1px 7px; border-radius: 99px; letter-spacing: 0.04em; }
        .spot-sm .spot-tag { font-size: 7px; padding: 1px 5px; }
        .spot-ico { font-size: 21px; line-height: 1; } .spot-sm .spot-ico { font-size: 15px; }
        .spot.free .spot-ico { color: ${T.ink3}; opacity: 0.5; }
        .spot-num { font-family: 'JetBrains Mono'; font-weight: 800; font-size: 14px; } .spot-sm .spot-num { font-size: 11px; }
        .spot.free .spot-num { color: ${T.success}; } .spot.busy .spot-num { color: ${T.danger}; }
        .spot-plate { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 8.5px; color: ${T.danger}; }

        /* === FEEDBACK KARTASI === */
        .fb { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; background: #fff; border: none; border-radius: 12px; padding: 11px 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .fb:hover:not(:disabled) { transform: translateY(-1px); }
        .fb-on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22); }
        .ava { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 15px; color: #fff; box-shadow: 0 4px 10px -4px rgba(${T.shadowBase},0.35); }
        .ava-sm { width: 26px; height: 26px; font-size: 12px; }
        .fb-col { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .fb-who { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; }
        .fb-text { font-family: 'Manrope'; font-weight: 500; font-size: 12.5px; color: ${T.ink}; line-height: 1.4; }
        .fb-seen { margin-left: auto; font-weight: 700; flex-shrink: 0; display: inline-block; }
        .fb-seen.ok { animation: fb-tick 0.44s cubic-bezier(.3,1.6,.4,1); }   /* javob MUHRLANDI */
        @keyframes fb-tick { 0% { transform: scale(0) rotate(-25deg); } 60% { transform: scale(1.35) rotate(6deg); } 100% { transform: scale(1) rotate(0); } }
        .fb.tap-hint { animation: tap-hint 1.9s ease-in-out infinite; }       /* o'qilmagan fikr «meni bos» deydi */
        @media (prefers-reduced-motion: reduce) { .fb.tap-hint, .fb-seen.ok { animation: none !important; } }

        /* === MATRITSA === */
        .mx-head { display: grid; grid-template-columns: 42px 1fr 1fr; gap: 6px; margin-bottom: 4px; }
        .mx-cap { font-family: 'Manrope'; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: ${T.ink2}; text-align: center; }
        .mx-grid { display: grid; grid-template-columns: 42px 1fr 1fr; gap: 6px; align-items: stretch; }
        .mx-rowcap { font-family: 'Manrope'; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; color: ${T.ink2}; display: flex; align-items: center; justify-content: center; text-align: center; }
        .quad { background: #fff; border-radius: 11px; padding: 9px; min-height: 70px; display: flex; flex-direction: column; gap: 6px; }
        .quad-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; }
        .quad-items { display: flex; flex-wrap: wrap; gap: 5px; }
        .quad-chip { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; color: #fff; padding: 3px 9px; border-radius: 99px; }

        /* === SETTINGS === */
        .set-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .set-lbl { font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink2}; }
        .set-input { width: 100%; margin-top: 9px; font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; text-align: center; padding: 11px 12px; border-radius: 10px; border: 1.5px dashed ${T.ink3}; background: ${T.bg}; color: ${T.ink}; outline: none; transition: border-color 0.2s, background 0.2s; }
        .set-input:focus { border-color: ${T.accent}; background: #fff; }

        /* === MODUL SAYOHATI === */
        .journey { display: flex; flex-direction: column; gap: 8px; }
        .jrow { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; background: #fff; border: none; border-radius: 12px; padding: 12px 15px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .jrow:hover { transform: translateY(-1px); }
        .jrow-on { box-shadow: inset 0 0 0 1.5px ${T.success}44, 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .jemoji { font-size: 22px; } .jn { font-family: 'JetBrains Mono'; font-weight: 800; font-size: 12px; color: ${T.accent}; flex-shrink: 0; white-space: nowrap; }
        .jcol { display: flex; flex-direction: column; gap: 2px; } .jt { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; } .jd { font-family: 'Manrope'; font-size: 11.5px; color: ${T.ink2}; }

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
      
        /* === TRACKER (sinfdosh fikrlari) === */
        .trk-rail { flex-shrink: 0; background: ${T.bg}; }
        .trk { display: flex; align-items: center; gap: 8px; padding: 5px 0 2px; }
        .trk-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; }
        .trk-avas { display: flex; gap: 5px; }
        .trk-ava { position: relative; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.ink3}; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.danger}66; transition: all 0.25s; }
        .trk-ava.on { color: #fff; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.4); }
        .trk-tick { position: absolute; bottom: -3px; right: -3px; font-size: 8px; background: #fff; border-radius: 50%; width: 12px; height: 12px; display: flex; align-items: center; justify-content: center; color: ${T.success}; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        .trk-n { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 11px; color: ${T.ink2}; display: inline-block; }
        /* sikl AYLANGANI ko'rinsin: fikr hal bo'ldi → avatar yashilga sakraydi, hisoblagich bump */
        .trk-ava.pop { animation: trk-pop 0.72s cubic-bezier(.3,1.5,.4,1); }
        @keyframes trk-pop { 0% { transform: scale(1); } 30% { transform: scale(1.34) rotate(-8deg); } 60% { transform: scale(0.94) rotate(4deg); } 100% { transform: scale(1) rotate(0); } }
        .trk-ava.pop .trk-tick { animation: trk-tick-pop 0.45s cubic-bezier(.3,1.6,.4,1) 0.18s backwards; }
        @keyframes trk-tick-pop { from { transform: scale(0); } }
        .trk-n.bump { animation: trk-bump 0.6s cubic-bezier(.3,1.5,.4,1); }
        @keyframes trk-bump { 0%,100% { transform: scale(1); } 40% { transform: scale(1.32); } }
        @media (prefers-reduced-motion: reduce) { .trk-ava.pop, .trk-ava.pop .trk-tick, .trk-n.bump { animation: none !important; } }
        /* === DRAG DOSKA (Screen5) === */
        /* karta = sudraladigan predmet. touch-action:none → barmoq sudraganda sahifa siljimaydi (mobil) */
        .vcard { touch-action: none; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent; cursor: grab; }
        .vcard:active { cursor: grabbing; }
        .vc-in { animation: fade-step 0.34s ease-out backwards; }   /* pool kartalari birin-ketin kiradi (o'ram) */
        .vcard-armed { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.3) !important; }
        /* KO'TARILISH (lift): karta qo'lga olindi — chuqur soya + accent kontur */
        .vcard.vcard-lift { transition: none !important; cursor: grabbing; box-shadow: 0 26px 46px -14px rgba(${T.shadowBase},0.5), inset 0 0 0 2px ${T.accent} !important; }
        /* «meni sudra» — hali birorta karta joylanmagan bo'lsa (affordance) */
        .vcard.tap-hint { animation: tap-hint 1.9s ease-in-out infinite; }
        @keyframes tap-hint { 0%, 100% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16), inset 0 0 0 0 rgba(255,79,40,0); } 50% { box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16), inset 0 0 0 2px rgba(255,79,40,0.4); } }
        /* bo'sh katak = punktir taklif · to'lgan/ustida = to'liq chiziq (rang KATAKNIKI, qizil emas) */
        .quad.drop { cursor: pointer; transition: box-shadow 0.18s, background 0.18s, outline-color 0.18s, transform 0.18s cubic-bezier(.34,1.3,.4,1); }
        .quad.drop.empty { background: ${T.paper}; }
        .quad.drop.empty .quad-lbl { opacity: 0.72; }
        .quad.drop.over { transform: scale(1.035); }   /* karta ustimda — katak «ochiladi» */
        .quad.drop.over .quad-lbl { opacity: 1; }
        /* karta ko'tarilgan — bo'sh kataklar chaqiradi (nafas olish) */
        .quad.drop.q-invite { animation: q-invite 1.6s ease-in-out infinite; }
        @keyframes q-invite { 0%,100% { transform: scale(1); outline-offset: -3px; } 50% { transform: scale(1.02); outline-offset: 1px; } }
        .quad.drop.reject { animation: dd-shake 0.42s; }   /* noto'g'ri katak — «meni emas» */
        @keyframes dd-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        /* to'g'ri katakka «chirt» o'tirish (settle) */
        .quad-chip.qd-settle { animation: qd-settle 0.5s cubic-bezier(.3,1.5,.45,1) both; }
        @keyframes qd-settle { 0% { opacity: 0; transform: translateY(-10px) scale(0.5) rotate(-8deg); } 55% { opacity: 1; transform: translateY(0) scale(1.16) rotate(2deg); } 75% { transform: scale(0.95); } 100% { opacity: 1; transform: none; } }
        /* OQIBAT-SIMULYATSIYA — noto'g'ri qaror nimaga olib kelishini ko'rsatadi */
        .conseq { animation: conseq-in 0.42s cubic-bezier(.3,1.28,.4,1) both; }
        @keyframes conseq-in { 0% { opacity: 0; transform: translateY(-7px) scale(0.97); } 100% { opacity: 1; transform: none; } }
        .conseq-ic { display: inline-block; transform-origin: 50% 80%; animation: conseq-wob 0.6s ease-in-out 0.12s 2; }
        @keyframes conseq-wob { 0%,100% { transform: rotate(0) scale(1); } 25% { transform: rotate(-12deg) scale(1.14); } 75% { transform: rotate(12deg) scale(1.14); } }
        .board-done { animation: conseq-in 0.46s cubic-bezier(.3,1.35,.4,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .vcard.tap-hint, .quad.drop.q-invite, .conseq-ic, .quad.drop.reject { animation: none !important; }
          .quad.drop.over { transform: none; }
          .vc-in, .quad-chip.qd-settle, .conseq, .board-done { animation: fade-step 0.2s ease-out both !important; }
        }
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
        /* Jonli panel — odatda XIRA (kontentni to'smaydi), hover'da tiniqlashadi (11.15) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
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

        /* --- kod-atama chip (fmtCode) arena variantlari --- */
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        /* --- CodeStrike bolt FX qatlami --- */
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .qz-bolt { filter: drop-shadow(0 8px 18px rgba(255,79,40,0.32)); }

      `}</style>
      <AchCtx.Provider value={earned}>
      <TrackerCtx.Provider value={resolved}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Feedback bilan yaxshilash darsi', ru: 'Урок доработки по фидбеку' }} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
            </>
          )}
        </div>
      </LiveGateCtx.Provider>
      </TrackerCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>
  );
}
