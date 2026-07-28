import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 4c-MODUL (CI/CD) · DARS 4 — «LOYIHA KUNI: PROFESSIONAL LENTA» — PLATFORM STANDARD v18 (AUDIOSIZ)
// Maqsad: 1-3-darslarda qurilgan to'liq lentani (install→test→build→deploy) professional darajaga
//         chiqarish: PARALLEL LENTALAR (matrix), YAQIN JAVON (cache), SEYF (secrets),
//         SINOV REYSI→HAQIQIY REYS (staging→production) va ESKI YUKNI QAYTARISH (rollback).
// ✈️ BIRLASHTIRUVCHI DUNYO — UCHISH LENTASI (4c-modulga yagona lug'at, 1-dars bilan 1:1):
//   commit = yig'ilgan chamadon · push = lentaga qo'yish · pipeline = LENTA · stage/job = NUQTA · step = AMAL
//   install = 📦 YIG'ISH · test = 🔍 SKANER · lint = 📐 O'LCHAM RAMKASI · build = 🎁 O'RASH · deploy = ✈️ UCHIRISH
//   runner = LENTA MASHINASI · workflow YAML = YO'L XARITASI (ci.yml) · on: push = START SIGNALI
//   artefakt = O'RALGAN YUK · yashil/qizil = YASHIL/QIZIL CHIROQ · skipped = o'tkazib yuborildi
//   logs = LENTA JURNALI · rollback = ESKI YUKNI QAYTARISH · secret = SEYF/MAXFIY KALIT · production = yo'lovchi qo'lida
//   matrix = PARALLEL LENTALAR · cache = YAQIN JAVON · staging = SINOV REYSI
// INTERAKTIV BEAT'lar: s2-s3 Matrix (3 muhit parallel, biri qizil) · s5-s6 Cache (40s→8s kontrast) ·
//   s9 SEYF (ochiq matn → seyf, real 2-bosqichli tuzatish) · s12 production muammo (PhoneMock broken) ·
//   s13 MARKAZIY: «Professional lenta» — 4 yaxshilash + rollback · s15 FINAL: tartib + oqibat (DragDropOrder).
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
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{tr(title)}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Присоединиться к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и своё имя.' })}</p></div>
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
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "🔓 O'quvchilar erkin qilindi", ru: '🔓 Ученики отпущены в свободный режим' })}</div>;
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
    return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> 👨‍🏫 {tr({ uz: 'Mentor:', ru: 'Ментор:' })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
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

const LESSON_META = { lessonId: 'full-pro-pipeline-4c-04-v18', lessonTitle: { uz: "Loyiha kuni: professional lenta", ru: 'Проектный день: профессиональная лента' } };
// 20 ekran · 4.1 oqim: hook → reja → (exploration↔test)× → markaziy o'yin (builder) → final (order+consequence) → praktika → podium → flashcard → summary
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'builder',     template: 'custom',   scored: false, scope: null },
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

const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `s15` — final (picked 0/1 sentinel, correct maydoni haqiqiy). `practice: -1` — sentinel (variant yo'q).
// ⚠️ Variant TARTIBI/qiymatlari 🎓 Metodist + ⚡ Jonli rollari tomonidan qayta balanslanadi — shu map ular bilan sinxron bo'lsin.
// ⚡ To'g'ri javob pozitsiyalari ATAYIN har xil (1 · 3 · 0 · 2) — «doim A» naqshi yo'q, o'qimay bosgan ball to'plamaydi.
// s15 (yakuniy debug) — REAL kalit: picked=0 → 1-urinishda topdi (to'g'ri), picked=1 → 1-urinishda xato bosdi.
const INLINE_KEYS = { s4: 1, s8: 3, s10: 0, s14: 2, s15: 0, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI). Matn 🎓 Metodist tomonidan sayqallanadi.
const RECAPS = {
  4: {
    title: { uz: "Matrix — parallel lentalar", ru: 'Matrix — параллельные ленты' },
    cards: [
      { ic: "🧬", h: { uz: "Bir nechta muhit", ru: 'Несколько сред' }, body: { uz: <>Matrix bitta yukni <b>bir necha muhitda</b> (masalan Node 18/20/22) bir vaqtda tekshiradi.</>, ru: <>Matrix проверяет один груз <b>в нескольких средах</b> (например, Node 18/20/22) одновременно.</> } },
      { ic: "🔍", h: { uz: "Muammoni oldindan topadi", ru: 'Находит проблему заранее' }, body: { uz: <>Bitta muhitda yashil, boshqasida qizil bo'lishi mumkin — matrix buni <b>productiondan oldin</b> ko'rsatadi.</>, ru: <>В одной среде может быть зелёный, в другой — красный. Matrix покажет это <b>до продакшена</b>.</> } },
      { ic: "🚦", h: { uz: "Faqat singan muhit qizil", ru: 'Красной становится только сломанная среда' }, body: { uz: <>Qolgan muhitlar davom etadi — aynan qaysi sharoitda singani aniq bo'ladi.</>, ru: <>Остальные среды продолжают работать — и сразу видно, в каких именно условиях всё сломалось.</> }, ask: { uz: "Matrix nechta muhitni bir vaqtda tekshiradi?", ru: 'Сколько сред matrix проверяет одновременно?' } },
    ]
  },
  8: {
    title: { uz: "Cache — yaqin javon", ru: 'Cache — ближняя полка' },
    cards: [
      { ic: "💨", h: { uz: "Birinchi reys sekin", ru: 'Первый рейс медленный' }, body: { uz: <>Yaqin javon bo'lmasa, har reysda paketlar <b>noldan</b> yuklanadi — 40 soniya.</>, ru: <>Без ближней полки пакеты на каждом рейсе загружаются <b>с нуля</b> — 40 секунд.</> } },
      { ic: "⚡", h: { uz: "Keyingi reys tez", ru: 'Следующий рейс быстрый' }, body: { uz: <>Yaqin javon bilan avvalgi paketlar saqlanadi — 8 soniya, <b>5 baravar tezroq</b>.</>, ru: <>С ближней полкой прежние пакеты сохраняются — 8 секунд, <b>в 5 раз быстрее</b>.</> } },
      { ic: "📦", h: { uz: "Nima saqlanadi", ru: 'Что сохраняется' }, body: { uz: <>Odatda <span className="mono">node_modules</span> — o'zgarmagan paketlarni qayta yuklash shart emas.</>, ru: <>Обычно <span className="mono">node_modules</span> — незачем заново скачивать пакеты, которые не менялись.</> }, ask: { uz: "Yaqin javon (cache) nimani tezlashtiradi?", ru: 'Что ускоряет ближняя полка (cache)?' } },
    ]
  },
  10: {
    title: { uz: "Seyf — maxfiy kalit", ru: 'Сейф — секретный ключ' },
    cards: [
      { ic: "🔓", h: { uz: "Ochiq yozilsa — xavfli", ru: 'Записан открыто — опасно' }, body: { uz: <>Kalit yo'l xaritasida ochiq yozilsa, repo ochiq bo'lganda <b>hamma uni ko'radi</b>.</>, ru: <>Если ключ записан в маршрутной карте открыто, то в открытом репозитории <b>его увидят все</b>.</> } },
      { ic: "🔐", h: { uz: "Seyfga qo'yilsa — xavfsiz", ru: 'Лежит в сейфе — безопасно' }, body: { uz: <>Platformaning maxsus seyfiga saqlanadi, kod ichida faqat <span className="mono">{'${{ secrets.API_KEY }}'}</span> ko'rinadi.</>, ru: <>Хранится в специальном сейфе платформы, а в коде видно только <span className="mono">{'${{ secrets.API_KEY }}'}</span>.</> } },
      { ic: "🛡️", h: { uz: "Jurnalda ham yashirin", ru: 'Скрыт даже в журнале' }, body: { uz: <>Seyfdagi qiymat lenta jurnalida ham yulduzchalar bilan yashiriladi.</>, ru: <>Значение из сейфа даже в журнале ленты закрывается звёздочками.</> }, ask: { uz: "Maxfiy kalit qayerda saqlanishi kerak?", ru: 'Где должен храниться секретный ключ?' } },
    ]
  },
  14: {
    title: { uz: "Rollback — eski yukni qaytarish", ru: 'Rollback — возврат старого багажа' },
    cards: [
      { ic: "💥", h: { uz: "Yangi yuk buzuq chiqdi", ru: 'Новый багаж оказался сломанным' }, body: { uz: <>Ba'zan sinov reysida yashil bo'lgan yuk ham haqiqiy reysda kutilmagan xato beradi.</>, ru: <>Иногда даже груз, зелёный на тестовом рейсе, на настоящем рейсе выдаёт неожиданную ошибку.</> } },
      { ic: "⏪", h: { uz: "Bir bosishda qaytarish", ru: 'Возврат в один клик' }, body: { uz: <>Rollback — oldingi <b>ishlaydigan</b> yukka darhol qaytish.</>, ru: <>Rollback — мгновенное возвращение к прежнему <b>рабочему</b> багажу.</> } },
      { ic: "🛡️", h: { uz: "Yo'lovchi tinch", ru: 'Пассажир спокоен' }, body: { uz: <>Tez rollback qilinsa, ko'pchilik yo'lovchi muammoni sezmay ham qoladi.</>, ru: <>Если откатиться быстро, большинство пассажиров даже не заметит проблему.</> }, ask: { uz: "Eski yukni qaytarish (rollback) qachon ishlatiladi?", ru: 'Когда используется возврат старого багажа (rollback)?' } },
    ]
  },
  15: {
    title: { uz: "Professional lenta tartibi", ru: 'Порядок профессиональной ленты' },
    cards: [
      { ic: "🧬", h: { uz: "Avval — parallel tekshirish", ru: 'Сначала — параллельная проверка' }, body: { uz: <>Matrix bir nechta muhitda birdan tekshiradi.</>, ru: <>Matrix проверяет сразу в нескольких средах.</> } },
      { ic: "🔐", h: { uz: "Keyin — seyfdan kalit", ru: 'Потом — ключ из сейфа' }, body: { uz: <>O'rash va uchirish uchun kerakli maxfiy kalitlar seyfdan olinadi.</>, ru: <>Секретные ключи для упаковки и взлёта берутся из сейфа.</> } },
      { ic: "🛫", h: { uz: "Sinov reysi, keyin haqiqiy reys", ru: 'Тестовый рейс, потом настоящий' }, body: { uz: <>Avval sinov reysida tekshiriladi, keyingina haqiqiy reysga chiqadi.</>, ru: <>Сначала проверка на тестовом рейсе, и только потом выход на настоящий рейс.</> }, vis: <RcFlow items={['🧬 Matrix', '💨 Cache', '🔐 Secret', '🛫 Staging', '✈️ Production']} />, ask: { uz: "Sinov reysi va haqiqiy reys tartibi qanday bo'lishi kerak?", ru: 'В каком порядке идут тестовый и настоящий рейсы?' } },
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
        <span className="rc-tag">{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Разбор ещё раз' })}</span>
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
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и счёт ✅/❌ скрыты — по нажатию «Открыть результат» всё откроется сразу и у вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — класс не разобрался в этой теме. Прежде чем идти дальше, стоит коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Разбор ещё раз' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите, прежде чем продолжать.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — судить по процентам рано. Оцените сами.</> })}</p>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Стоит объяснить её ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в реальном времени…' })}</p>}
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
  const ouz = (o) => (o && o.uz) || o; // analytics-payload: UZ-etalon matn
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
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ouz), correctIndex: correctIdx, correctAnswer: ouz(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ouz(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ouz), correctIndex: correctIdx, correctAnswer: ouz(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ouz(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
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
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, подумайте, прежде чем нажать!' })}</p>}
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
                <span style={{ flex: 1 }}>{fmtCode(tr(opt))}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? <>✓ {tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? <>{tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(tr(explainCorrect))
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете правильный ответ.' })
                : wrongLocked
                  ? fmtCode(tr(explainWrong[picked] ?? explainWrong.default))
                  : solved ? fmtCode(tr(explainCorrect)) : fmtCode(tr(explainWrong[picked] ?? explainWrong.default))}
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish", ru: 'открыть подсказку' })} ▾</span>}</span>
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
  <div className="term"><div className="term-bar"><span className="bb-dots"><i /><i /><i /></span><span className="term-title">{title}</span></div><div className="term-body" style={{ minHeight: minH }}>{children}</div></div>
);
const TLine = ({ cmd, out, col }) => (
  <div className="el-in tline">{cmd ? <><span style={{ color: CODE.str }}>$</span> <span style={{ color: CODE.text }}>{cmd}</span></> : <span style={{ color: col || CODE.comment }}>{out}</span>}</div>
);

// ===== LENTA (PIPELINE) NUQTALARI =====
const POINTS = [
  { id: 'install', icon: '📦', label: { uz: "Yig'ish", ru: 'Сборка' }, cmd: 'npm install', d: { uz: "Kerakli paketlarni o'rnatadi — toza muhitda boshlaydi.", ru: 'Устанавливает нужные пакеты — начинает в чистой среде.' } },
  { id: 'test',    icon: '🔍', label: { uz: 'Skaner', ru: 'Сканер' },  cmd: 'npm test',    d: { uz: "Testlarni ishga tushiradi — kod to'g'ri ishlayaptimi?", ru: 'Запускает тесты — правильно ли работает код?' } },
  { id: 'lint',    icon: '📐', label: { uz: "O'lcham ramkasi", ru: 'Калибр' }, cmd: 'eslint .', d: { uz: "Kod qoidalarga mos yozilganini tekshiradi.", ru: 'Проверяет, что код написан по правилам.' } },
  { id: 'build',   icon: '🎁', label: { uz: "O'rash", ru: 'Упаковка' },  cmd: 'npm run build', d: { uz: "Yukni internetga tayyor holatga o'raydi (optimizatsiya qiladi).", ru: 'Упаковывает груз в готовый для интернета вид (оптимизирует).' } },
  { id: 'deploy',  icon: '✈️', label: { uz: 'Uchirish', ru: 'Взлёт' }, cmd: 'deploy',      d: { uz: "Tayyor yukni internetga — yo'lovchi qo'liga chiqaradi.", ru: 'Отправляет готовый груз в интернет — в руки пассажира.' } }
];
const badgeOf = (s) => (s === 'pass' ? '✓' : s === 'fail' ? '✗' : s === 'run' ? '●' : s === 'skip' ? '—' : ' ');
const Belt = ({ statuses = {} }) => {
  // 🧳 lenta ustida siljiydigan chamadon belgisi — hozir qaysi nuqtada ekanini ko'rsatadi
  const runIdx = POINTS.findIndex(p => statuses[p.id] === 'run');
  const passIdx = POINTS.reduce((acc, p, i) => (statuses[p.id] === 'pass' ? i : acc), -1);
  const failed = POINTS.some(p => statuses[p.id] === 'fail');
  const markerIdx = runIdx >= 0 ? runIdx : passIdx;
  const showMarker = markerIdx >= 0 && !failed;
  const pct = POINTS.length > 1 ? (markerIdx / (POINTS.length - 1)) * 100 : 0;
  return (
    <div className="pipe-track">
      {showMarker && <span className="pipe-suitcase" style={{ left: `${pct}%` }} aria-hidden="true">🧳</span>}
      <div className="pipe">
        {POINTS.map((p, i) => (
          <React.Fragment key={p.id}>
            {i > 0 && <span className="pipe-arrow">→</span>}
            <div className={`pipe-step ${statuses[p.id] || ''}`} data-id={p.id}>
              <span className="pipe-ico">{p.icon}</span>
              <span className="pipe-lbl">{tr(p.label)}</span>
              <span className="pipe-badge">{badgeOf(statuses[p.id])}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
const ALL_PASS = { install: 'pass', test: 'pass', lint: 'pass', build: 'pass', deploy: 'pass' };

// ===== 📱 TELEFON MOCK — foydalanuvchi ekrani (doim ko'rinadi) =====
const PhoneMock = ({ state = 'old' }) => (
  <div className="phone-mock">
    <div className="phone-body">
      <span className="phone-notch" />
      <div className={`phone-screen ${state}`}>
        <div className="phone-face old-face"><span>🧳</span><p>{tr({ uz: 'Sayt ishlayapti', ru: 'Сайт работает' })}</p><span className="phone-ok">{tr({ uz: '✓ joriy versiya', ru: '✓ текущая версия' })}</span></div>
        <div className="phone-face new-face"><span>🎉</span><p>{tr({ uz: 'Yangi versiya!', ru: 'Новая версия!' })}</p><span className="phone-ok">{tr({ uz: '✓ yangilandi', ru: '✓ обновлено' })}</span></div>
        <div className="phone-face broken-face"><span>💥</span><p>{tr({ uz: 'Sayt buzildi', ru: 'Сайт сломался' })}</p><span className="phone-ok">{tr({ uz: '✗ xato', ru: '✗ ошибка' })}</span></div>
      </div>
    </div>
    <p className="phone-lbl">{tr({ uz: '📱 foydalanuvchi ekrani', ru: '📱 экран пользователя' })}</p>
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
            {sid ? <button key={sid} className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr(byId[sid].label)}</button> : <span className="dd-hint">{hints ? tr(hints[i]) : tr({ uz: 'bu yerga joylang', ru: 'положите сюда' })}</span>}
          </div>
        ))}
      </div>
      <div className="dd-pool">
        {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: 'Порядок неверный — нажмите на блок, верните его и разложите заново' })}</span>}
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>
      {solved && <div className="dd-done">✓ {tr(doneText || { uz: "To'g'ri tartib!", ru: 'Правильный порядок!' })}</div>}
      {wrong && !solved && <div className="dd-wrong">{tr({ uz: '⚠️ Tartib xato — qayta joylang.', ru: '⚠️ Порядок неверный — разложите заново.' })}</div>}
    </div>
  );
}

// ===== SCREEN 0 — HOOK: bitta lenta yetarli emas =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [tried, setTried] = useState(!!storedAnswer);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const OPTS = [
    { id: 'a', label: { uz: "Productionni ham xuddi shu bitta muhitga moslab qo'yaman", ru: 'Подгоню продакшен под эту же единственную среду' } },
    { id: 'b', label: { uz: "Bir nechta muhitda (masalan Node 18/20/22) parallel tekshiraman", ru: 'Проверю параллельно в нескольких средах (например, Node 18/20/22)' } },
    { id: 'c', label: { uz: "E'tibor bermayman — ilgari ham baribir ishlagan edi", ru: 'Не обращу внимания — раньше же как-то работало' } }
  ];
  const poke = () => { setTried(true); setSc(n => n + 1); };
  const pick = (v) => { if (picked !== null || !tried) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 880 }}>{tr({ uz: <>Lentangiz yashil chiqdi — lekin productionda sayt <span className="italic" style={{ color: T.accent }}>ishlamay qoldi</span>. Nega?</>, ru: <>Ваша лента зелёная — но в продакшене сайт <span className="italic" style={{ color: T.accent }}>перестал работать</span>. Почему?</> })}</h1>
        <Mentor>{tr({ uz: <>Oldingi darslarda to'liq lentani qurdingiz: <b style={{ color: T.ink }}>Yig'ish → Skaner → O'rash → Uchirish</b>. Hammasi yashil edi. Lekin production serverda boshqa muhit ishlatilar ekan. Tugmani bosing — nima bo'lganini ko'ramiz.</>, ru: <>На прошлых уроках вы собрали полную ленту: <b style={{ color: T.ink }}>Сборка → Сканер → Упаковка → Взлёт</b>. Всё было зелёным. Но оказалось, что на продакшен-сервере другая среда. Нажмите кнопку — посмотрим, что случилось.</> })}</Mentor>
        <Zoomable><Split>
          <Col>
            <Term title={tr({ uz: 'lenta jurnali', ru: 'журнал ленты' })} minH={150}>
              <TLine cmd="npm test" />
              <TLine out={tr({ uz: '✓ testlar yashil (Node 20 muhitida)', ru: '✓ тесты зелёные (в среде Node 20)' })} col={CODE.str} />
              <TLine cmd="deploy → production" />
              {tried && <>
                <TLine out={tr({ uz: "⚠ production Node 18'da ishlaydi", ru: '⚠ продакшен работает на Node 18' })} col="#FF8A7A" />
                <TLine out={tr({ uz: "✗ sayt production'da xato beryapti", ru: '✗ на продакшене сайт выдаёт ошибку' })} col="#FF8A7A" />
              </>}
            </Term>
            <button className={`btn-soft ${tried ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} onClick={poke} disabled={tried}>{tried ? tr({ uz: '✓ Sabab topildi', ru: '✓ Причина найдена' }) : tr({ uz: '▶ Production serverni tekshirish', ru: '▶ Проверить продакшен-сервер' })}</button>
            {tried && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Lenta faqat <b>bitta muhitda</b> (Node 20) tekshirilgan edi. Production esa boshqa versiyada ishlar ekan — farq shu yerda chiqdi.</>, ru: <>Лента проверялась только <b>в одной среде</b> (Node 20). А продакшен работает на другой версии — вот где вылезла разница.</> })}</p></div>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Bunday holatni qanday oldini olamiz?', ru: 'Как предотвратить такую ситуацию?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null || !tried} style={{ opacity: !tried ? 0.55 : 1 }} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>);
              })}
            </div>
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Avval tugmani bosing ←', ru: 'Сначала нажмите кнопку ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Aynan! Bugun lentangizni <b>professional darajaga</b> chiqaramiz: parallel lentalar, yaqin javon, seyf va sinov reysi bilan.</>, ru: <>Именно! Сегодня выведем вашу ленту <b>на профессиональный уровень</b>: параллельные ленты, ближняя полка, сейф и тестовый рейс.</> })}</p>}
          </Col>
        </Split></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: { uz: 'Parallel lentalar — bir nechta muhitda birdan tekshirish', ru: 'Параллельные ленты — проверка сразу в нескольких средах' }, tag: 'matrix' },
    { text: { uz: 'Yaqin javon — paketlarni qayta yuklamaslik', ru: 'Ближняя полка — не скачивать пакеты заново' }, tag: 'cache' },
    { text: { uz: 'Seyf — maxfiy kalitni xavfsiz saqlash', ru: 'Сейф — безопасное хранение секретного ключа' }, tag: 'secrets' },
    { text: { uz: 'Sinov reysi — haqiqiy reysdan oldin tekshirish', ru: 'Тестовый рейс — проверка перед настоящим рейсом' }, tag: 'staging' },
    { text: { uz: "Eski yukni qaytarish — muammo bo'lsa bir bosishda", ru: 'Возврат старого багажа — в один клик, если что-то пошло не так' }, tag: 'rollback' }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const Preview = (
    <Col>
      <p className="flow-label">{tr({ uz: "Dars oxirida — shu lentani yig'asiz", ru: 'К концу урока вы соберёте вот эту ленту' })}</p>
      <Belt statuses={ALL_PASS} />
      <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bitta yuk endi <b>3 muhitda</b> birdan tekshiriladi, <b style={{ color: T.success }}>yaqin javondan</b> tez o'tadi, kalitlar <b>seyfda</b>, va avval <b>sinov reysida</b> ko'riladi.</>, ru: <>Один груз теперь проверяется сразу <b>в 3 средах</b>, быстро проходит через <b style={{ color: T.success }}>ближнюю полку</b>, ключи — <b>в сейфе</b>, и сначала всё смотрится <b>на тестовом рейсе</b>.</> })}</p></div>
    </Col>
  );
  const StepsB = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 5 qadam', ru: 'Сегодняшние 5 шагов' })}</p>
      <ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span><span className="step-tag">{s.tag}</span></span></li>))}</ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={tr({ uz: 'Boshlaymiz →', ru: 'Начнём →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Lentani <span className="italic" style={{ color: T.accent }}>professional darajaga</span> qanday chiqaramiz?</>, ru: <>Как вывести ленту <span className="italic" style={{ color: T.accent }}>на профессиональный уровень</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bugun lentangizga 4 ta yaxshilash qo'shamiz — <b style={{ color: T.ink }}>tez, xavfsiz, qaytariladigan</b> bo'lishi uchun. Mana natija va unga olib boradigan 5 qadam.</>, ru: <>Сегодня добавим к вашей ленте 4 улучшения — чтобы она стала <b style={{ color: T.ink }}>быстрой, безопасной и обратимой</b>. Вот результат и 5 шагов, которые к нему ведут.</> })}</Mentor>
        {!isNarrow ? (<Zoomable><Split>{Preview}{StepsB}</Split></Zoomable>)
          : !showSteps ? <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{Preview}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "5 qadamni ko'rish", ru: 'Посмотреть 5 шагов' })}</button></div>
            : <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Lentani ko'rish", ru: '↩ Посмотреть ленту' })}</button>{StepsB}</div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — MATRIX NIMA (3 muhit) =====
const MATRIX_ENVS = [
  { id: 'node18', icon: '🟩', label: 'Node 18', d: { uz: "Ba'zi eski serverlar hali shu versiyada ishlaydi — moslikni shu yerda tekshiramiz.", ru: 'Некоторые старые серверы всё ещё работают на этой версии — здесь проверяем совместимость.' } },
  { id: 'node20', icon: '🟦', label: 'Node 20', d: { uz: "Hozirgi standart versiya — asosiy ishlab chiqish shu yerda boradi.", ru: 'Текущая стандартная версия — основная разработка идёт здесь.' } },
  { id: 'node22', icon: '🟨', label: 'Node 22', d: { uz: "Eng yangi versiya — kelajakda o'tish uchun oldindan tayyorlanamiz.", ru: 'Самая новая версия — заранее готовимся к будущему переходу.' } }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(MATRIX_ENVS.map(e => e.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= MATRIX_ENVS.length;
  const tap = (id) => { setActive(id); setSeen(prev => { const s = new Set(prev); s.add(id); return s; }); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const cur = MATRIX_ENVS.find(e => e.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · matrix', ru: 'Понятие · matrix' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "3 muhitni ko'ring", ru: 'Посмотрите 3 среды' })} (${seen.size}/3)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Parallel lentalar — bitta yuk, <span className="italic" style={{ color: T.accent }}>bir nechta muhit</span>.</>, ru: <>Параллельные ленты — один груз, <span className="italic" style={{ color: T.accent }}>несколько сред</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: T.ink }}>Matrix</b> — bitta yukni bir vaqtning o'zida bir necha muhitda parallel tekshiradi. Har muhitni bosing.</>, ru: <><b style={{ color: T.ink }}>Matrix</b> проверяет один груз параллельно в нескольких средах одновременно. Нажмите на каждую среду.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MATRIX_ENVS.map(e => (
                <button key={e.id} className={`vcard ${seen.has(e.id) ? '' : 'tap-hint'}`} onClick={() => tap(e.id)} style={{ boxShadow: active === e.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : undefined }}>
                  <span className="role-ico">{e.icon}</span>
                  <span className="vlbl">{e.label}</span>
                  <span className="vseen" style={{ color: seen.has(e.id) ? T.success : T.ink3 }}>{seen.has(e.id) ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="frame fade-step" key={active}><p className="note-h"><span style={{ fontSize: 18, marginRight: 6 }}>{cur.icon}</span>{cur.label}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.d)}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Muhitni bosing ←', ru: 'Нажмите на среду ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>3 muhit — bitta yo'l xaritasida <span className="mono">strategy: matrix</span> bilan yoziladi. Endi hammasi birga qanday aylanishini ko'ramiz.</>, ru: <>3 среды описываются в одной маршрутной карте через <span className="mono">strategy: matrix</span>. Теперь посмотрим, как всё это крутится вместе.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — MATRIX PAYOFF: parallel aylanadi, biri sinadi =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [status, setStatus] = useState({});
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const run = () => {
    if (running || done) return;
    setRunning(true); setSc(n => n + 1);
    setStatus({ node18: 'run', node20: 'run', node22: 'run' });
    timer.current = setTimeout(() => {
      setStatus({ node18: 'fail', node20: 'pass', node22: 'pass' });
      setRunning(false); setDone(true); setSc(n => n + 1);
    }, 900);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Payoff · matrix', ru: 'Эффект · matrix' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Matrixni ishga tushiring', ru: 'Запустите matrix' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>3 muhit birdan aylanadi — <span className="italic" style={{ color: T.accent }}>qaysi biri sinadi</span>?</>, ru: <>3 среды крутятся одновременно — <span className="italic" style={{ color: T.accent }}>какая из них сломается</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Endi matrixni ishga tushiramiz. Uchala muhit <b style={{ color: T.ink }}>bir vaqtda</b> ishlaydi. Bittasi qizil bersa — aynan qaysi muhitda muammo borligini darrov bilasiz.</>, ru: <>Теперь запустим matrix. Все три среды работают <b style={{ color: T.ink }}>одновременно</b>. Если одна даст красный — вы сразу узнаете, в какой именно среде проблема.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={running || done} onClick={run}>{done ? tr({ uz: '✓ Matrix yakunlandi', ru: '✓ Matrix завершён' }) : (running ? tr({ uz: '● Parallel ishlayapti…', ru: '● Работают параллельно…' }) : tr({ uz: '▶ Matrixni ishga tushirish', ru: '▶ Запустить matrix' }))}</button>
            <div className="cj-items fade-up delay-1">
              {MATRIX_ENVS.map(e => (
                <div key={e.id} className={`itm-card ${status[e.id] === 'fail' ? 'on' : ''}`} style={status[e.id] === 'pass' ? { boxShadow: `inset 0 0 0 2px ${T.success}` } : undefined}>
                  <span className="itm-ico">{e.icon}</span>
                  <span className="itm-nm">{e.label}</span>
                  <span className="mono small" style={{ color: status[e.id] === 'fail' ? T.danger : status[e.id] === 'pass' ? T.success : T.ink3 }}>{status[e.id] === 'run' ? tr({ uz: '● ishlayapti', ru: '● работает' }) : status[e.id] === 'pass' ? tr({ uz: '✓ yashil', ru: '✓ зелёный' }) : status[e.id] === 'fail' ? tr({ uz: '✗ qizil', ru: '✗ красный' }) : '—'}</span>
                </div>
              ))}
            </div>
          </Col>
          <Col>
            {done
              ? <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>{tr({ uz: '🟩 Node 18 — qizil', ru: '🟩 Node 18 — красный' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Aynan Node 18'da eski funksiya ishlamayapti. Node 20 va 22 — yashil. Endi qaysi muhitda tuzatish kerakligi <b>aniq</b>.</>, ru: <>Именно на Node 18 старая функция не работает. Node 20 и 22 — зелёные. Теперь <b>точно ясно</b>, в какой среде чинить.</> })}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Tugmani bosing ←', ru: 'Нажмите кнопку ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Agar matrix bo'lmaganida — bu xato faqat productionda, foydalanuvchi oldida chiqqan bo'lardi.", ru: 'Если бы не matrix — эта ошибка всплыла бы только в продакшене, на глазах у пользователя.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 (matrix) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    questionText="Parallel lentalar (matrix) nima uchun kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Parallel lentalar (matrix) <span className="italic" style={{ color: T.accent }}>nima uchun</span> kerak?</>, ru: <>Зачем нужны <span className="italic" style={{ color: T.accent }}>параллельные ленты</span> (matrix)?</> })}</h2></>}
    options={[{ uz: "Maxfiy kalitlarni xavfsiz joyda saqlab qo'yish uchun", ru: 'Чтобы хранить секретные ключи в надёжном месте' }, { uz: "Bir nechta muhitda (masalan, Node versiyalarida) bir vaqtda tekshirish uchun", ru: 'Чтобы проверять в нескольких средах (например, версиях Node) одновременно' }, { uz: "Faqat bitta muhitda, lekin avvalgidan tezroq tekshirish uchun", ru: 'Чтобы проверять только в одной среде, но быстрее, чем раньше' }, { uz: "Productionni sinov reysisiz, tekshiruvsiz to'g'ridan-to'g'ri ishga tushirish uchun", ru: 'Чтобы запускать продакшен сразу, без тестового рейса и проверок' }]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! Matrix bitta yukni bir nechta muhitda bir vaqtning o'zida tekshiradi — muhitga bog'liq xatolarni productiondan oldin topib beradi.", ru: 'Верно! Matrix проверяет один груз в нескольких средах одновременно — и находит ошибки, зависящие от среды, ещё до продакшена.' }}
    explainWrong={{
      0: { uz: "Kalitlarni saqlash — seyf (secrets) ishi. Matrix esa turli muhitda tekshiradi.", ru: 'Хранение ключей — работа сейфа (secrets). А matrix проверяет в разных средах.' },
      2: { uz: "Aksincha — matrix bir emas, bir NECHTA muhitda parallel tekshiradi.", ru: 'Наоборот — matrix проверяет параллельно не в одной, а в НЕСКОЛЬКИХ средах.' },
      3: { uz: "Sinov reysisiz to'g'ridan-to'g'ri chiqarish — bu xavfli yo'l, matrix bunga aloqasi yo'q.", ru: 'Выпускать без тестового рейса — опасный путь, и matrix тут ни при чём.' },
      default: { uz: "Matrix = bir nechta muhitda bir vaqtda tekshirish.", ru: 'Matrix = одновременная проверка в нескольких средах.' }
    }} />
);

// ===== SCREEN 5 — CACHE YO'Q: birinchi reys sekin =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [ran, setRan] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = ran;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: "Muammo · kesh yo'q", ru: 'Проблема · без кеша' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Install ishga tushiring', ru: 'Запустите install' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har push'da <span className="italic" style={{ color: T.accent }}>hamma paket qaytadan</span> yuklanadi?</>, ru: <>При каждом push <span className="italic" style={{ color: T.accent }}>все пакеты заново</span> скачиваются?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yaqin javon bo'lmasa, lenta har safar <span className="mono">npm install</span>ni noldan bajaradi — bitta harf o'zgargan bo'lsa ham. Tugmani bosing va vaqtni kuzating.</>, ru: <>Без ближней полки лента каждый раз выполняет <span className="mono">npm install</span> с нуля — даже если изменилась одна буква. Нажмите кнопку и следите за временем.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <Term title={tr({ uz: 'install (keshsiz)', ru: 'install (без кеша)' })} minH={90}>
              <TLine cmd="npm install" />
              {ran && <TLine out={tr({ uz: '1247 paket yuklanmoqda… 0 tasi keshdan', ru: '1247 пакетов скачивается… 0 из кеша' })} col="#FF8A7A" />}
            </Term>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={ran} onClick={() => { setRan(true); setSc(n => n + 1); }}>{ran ? tr({ uz: '✓ Yuklandi', ru: '✓ Загружено' }) : '▶ npm install'}</button>
          </Col>
          <Col>
            <div className="timer-row fade-up delay-2">
              <div className={`timer-chip ${ran ? 'danger' : ''}`}><span className="tc-lbl">{tr({ uz: 'Keshsiz reys', ru: 'Рейс без кеша' })}</span><span className="tc-val">{ran ? tr({ uz: '40 son', ru: '40 сек' }) : '—'}</span></div>
            </div>
            {done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "40 soniya — faqat install uchun. Va bu har push'da takrorlanadi. Buni tezlashtirsak-chi?", ru: '40 секунд — только на install. И так при каждом push. А если ускорить?' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — CACHE BOR: kontrast 40s → 8s =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [ran, setRan] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = ran;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Yechim · yaqin javon', ru: 'Решение · ближняя полка' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Keshdan install qiling', ru: 'Сделайте install из кеша' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yaqin javon bilan — <span className="italic" style={{ color: T.accent }}>qancha tezroq</span>?</>, ru: <>С ближней полкой — <span className="italic" style={{ color: T.accent }}>насколько быстрее</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yaqin javon avvalgi reysda yuklangan paketlarni saqlab qo'yadi. Keyingi reysda ular <b style={{ color: T.ink }}>qayta yuklanmaydi</b>. Tugmani bosing.</>, ru: <>Ближняя полка сохраняет пакеты, загруженные в прошлом рейсе. В следующем рейсе они <b style={{ color: T.ink }}>не скачиваются заново</b>. Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <Term title={tr({ uz: 'install (kesh bilan)', ru: 'install (с кешем)' })} minH={90}>
              <TLine cmd="npm install" />
              {ran && <TLine out={tr({ uz: '1247 paket — 1240 tasi keshdan topildi ✓', ru: '1247 пакетов — 1240 нашлись в кеше ✓' })} col={CODE.str} />}
            </Term>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={ran} onClick={() => { setRan(true); setSc(n => n + 1); }}>{ran ? tr({ uz: '✓ Yuklandi', ru: '✓ Загружено' }) : tr({ uz: '▶ npm install (kesh bilan)', ru: '▶ npm install (с кешем)' })}</button>
          </Col>
          <Col>
            <div className="timer-row fade-up delay-2">
              <div className="timer-chip danger"><span className="tc-lbl">{tr({ uz: 'Keshsiz', ru: 'Без кеша' })}</span><span className="tc-val">{tr({ uz: '40 son', ru: '40 сек' })}</span></div>
              <div className={`timer-chip ${ran ? 'success' : ''}`}><span className="tc-lbl">{tr({ uz: 'Kesh bilan', ru: 'С кешем' })}</span><span className="tc-val">{ran ? tr({ uz: '8 son', ru: '8 сек' }) : '—'}</span></div>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>40 soniyadan 8 soniyaga — <b>5 baravar tezroq</b>. Bu ayniqsa matrix bilan muhim: 3 muhit, har birida kesh bo'lsa jami vaqt sezilarli qisqaradi.</>, ru: <>С 40 секунд до 8 — <b>в 5 раз быстрее</b>. Это особенно важно с matrix: сред три, и если кеш есть в каждой, общее время заметно сокращается.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — CACHE NIMA SAQLANADI (yo'l xaritasida) =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [show, setShow] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = show;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · cache kaliti', ru: 'Понятие · ключ кеша' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Yo'l xaritasini ko'ring", ru: 'Посмотрите маршрутную карту' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yo'l xaritasida <span className="italic" style={{ color: T.accent }}>cache qanday</span> yoziladi?</>, ru: <>Как записывается <span className="italic" style={{ color: T.accent }}>cache</span> в маршрутной карте?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yaqin javon uchun yo'l xaritasiga bitta amal qo'shiladi — <span className="mono">cache</span>. U qaysi papkani saqlashni va qaysi kalit bilan topishni biladi.</>, ru: <>Для ближней полки в маршрутную карту добавляется одно действие — <span className="mono">cache</span>. Оно знает, какую папку сохранять и по какому ключу её находить.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <pre className="code-box" style={{ lineHeight: 1.9 }}>
              {'- '}<At>uses</At>{': actions/cache@v4'}{'\n'}
              {'  '}<At>with</At>{':'}{'\n'}
              {'    '}<At>path</At>{': '}<St>node_modules</St>{'\n'}
              {'    '}<At>key</At>{': '}<St>{"${{ hashFiles('package-lock.json') }}"}</St>
            </pre>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} disabled={show} onClick={() => { setShow(true); setSc(n => n + 1); }}>{show ? tr({ uz: "✓ Ko'rdingiz", ru: '✓ Посмотрели' }) : tr({ uz: '▶ Bu nimani bildiradi?', ru: '▶ Что это значит?' })}</button>
          </Col>
          <Col>
            {show
              ? <div className="sk-info fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">path</span> — qaysi papka saqlanadi (<span className="mono">node_modules</span>). <span className="mono">key</span> — paketlar ro'yxati o'zgarmagan bo'lsa, oldingi keshdan foydalaniladi.</>, ru: <><span className="mono">path</span> — какая папка сохраняется (<span className="mono">node_modules</span>). <span className="mono">key</span> — если список пакетов не менялся, используется прежний кеш.</> })}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Tugmani bosing ←', ru: 'Нажмите кнопку ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">package-lock.json</span> o'zgarsa — kalit ham o'zgaradi, kesh yangilanadi. O'zgarmasa — eski keshdan foydalaniladi.</>, ru: <>Если <span className="mono">package-lock.json</span> изменится — изменится и ключ, кеш обновится. Не изменится — берётся старый кеш.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST 2 (cache) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} idx={8} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    questionText="Yaqin javon (cache) nimaga yordam beradi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Yaqin javon (cache) <span className="italic" style={{ color: T.accent }}>nimaga</span> yordam beradi?</>, ru: <>Чем помогает <span className="italic" style={{ color: T.accent }}>ближняя полка</span> (cache)?</> })}</h2></>}
    options={[{ uz: "Bir nechta muhitda (masalan, turli Node versiyalarida) parallel test o'tkazadi", ru: 'Проводит параллельные тесты в нескольких средах (например, в разных версиях Node)' }, { uz: "Kod sifatini avtomatik tekshirib, xatolarni ekranda ko'rsatib beradi", ru: 'Автоматически проверяет качество кода и показывает ошибки на экране' }, { uz: "Maxfiy kalitlarni xavfsiz joyda saqlab, kod ichidan yashiradi", ru: 'Хранит секретные ключи в надёжном месте и прячет их из кода' }, { uz: "Har reysda paketlarni qaytadan yuklamaslik orqali vaqtni tejaydi", ru: 'Экономит время: не скачивает пакеты заново на каждом рейсе' }]} correctIdx={3}
    explainCorrect={{ uz: "To'g'ri! Yaqin javon avvalgi reysda yuklangan paketlarni saqlab qo'yadi — keyingi reys sezilarli tezroq o'tadi.", ru: 'Верно! Ближняя полка сохраняет пакеты, загруженные в прошлом рейсе, — следующий рейс проходит заметно быстрее.' }}
    explainWrong={{
      0: { uz: "Parallel test — matrix ishi. Cache install bosqichini tezlashtiradi.", ru: 'Параллельные тесты — работа matrix. Cache ускоряет этап install.' },
      1: { uz: "Sifat tekshiruvi — bu boshqa vosita. Cache esa vaqtni tejaydi.", ru: 'Проверка качества — это другой инструмент. Cache же экономит время.' },
      2: { uz: "Kalitlarni saqlash — seyf (secrets) ishi. Cache paketlarni saqlaydi.", ru: 'Хранение ключей — работа сейфа (secrets). Cache хранит пакеты.' },
      default: { uz: "Cache = takroriy install'ni tezlashtiradi.", ru: 'Cache = ускоряет повторный install.' }
    }} />
);

// ===== SCREEN 9 — HAYOTIY · SEYF: ochiq matndan seyfga (real 2-bosqichli tuzatish — Vault Keeper badge) =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [openSeen, setOpenSeen] = useState(!!storedAnswer);
  const [secured, setSecured] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = secured;
  const fired = useRef(!!storedAnswer);
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onAnswer(screen, { stage: 'case', screenIdx: screen, question: "Maxfiy kalitni seyfga xavfsiz joylang", correct: true, solved: true, picked: true });
    }
  }, [done]); // eslint-disable-line
  const showOpen = () => { setOpenSeen(true); setSc(n => n + 1); };
  const secure = () => { if (!openSeen) return; setSecured(true); setSc(n => n + 1); };
  return (
    <Stage eyebrow={tr({ uz: 'Hayotiy · seyf', ru: 'Из жизни · сейф' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (openSeen ? tr({ uz: 'Seyfga joylang', ru: 'Положите в сейф' }) : tr({ uz: "Ochiq holatni ko'ring", ru: 'Посмотрите открытый вариант' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Maxfiy kalitni yo'l xaritasiga <span className="italic" style={{ color: T.accent }}>qanday yozasiz</span>?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>записать секретный ключ</span> в маршрутную карту?</> })}</h2></div>
        <Mentor>{tr({ uz: <>API kaliti kerak. Avval uni <b style={{ color: T.ink }}>ochiq matn</b> sifatida yozib ko'ring — nima bo'lishini ko'rasiz. Keyin <b style={{ color: T.ink }}>seyfga</b> joylab tuzating.</>, ru: <>Нужен API-ключ. Сначала попробуйте записать его <b style={{ color: T.ink }}>открытым текстом</b> — увидите, что будет. Потом исправьте: положите его <b style={{ color: T.ink }}>в сейф</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <pre className="code-box" style={{ lineHeight: 1.9 }}>
              {'- '}<At>run</At>{': deploy --key='}{!secured ? <St>"sk-a91f7c2e..."</St> : <span style={{ color: CODE.str }}>{'${{ secrets.API_KEY }}'}</span>}
            </pre>
            {!openSeen && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={showOpen}>{tr({ uz: "▶ Repo'ni ochiq holda ko'rish", ru: '▶ Посмотреть репозиторий в открытом виде' })}</button>}
            {openSeen && !secured && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={secure}>{tr({ uz: '🔐 Seyfga joylash', ru: '🔐 Положить в сейф' })}</button>}
          </Col>
          <Col>
            {!openSeen && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Tugmani bosing ←', ru: 'Нажмите кнопку ←' })}</p></div>}
            {openSeen && !secured && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>{tr({ uz: "😱 Repo ochiq — kalit ko'rinib turibdi!", ru: '😱 Репозиторий открыт — ключ на виду!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Har kim repo'ni ko'rib, kalitni <b>nusxalab olishi</b> mumkin. Bu — xavfsizlik teshigi. Endi seyfga joylab tuzating.</>, ru: <>Любой может открыть репозиторий и <b>скопировать ключ</b>. Это дыра в безопасности. Теперь исправьте — положите его в сейф.</> })}</p></div>}
            {secured && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Endi kalit seyfda — kod ichida faqat <span className="mono">{'${{ secrets.API_KEY }}'}</span> ko'rinadi, haqiqiy qiymat hech qayerda ochiq yozilmaydi va lenta jurnalida ham yulduzchalar bilan yashiriladi.</>, ru: <>Теперь ключ в сейфе — в коде видно только <span className="mono">{'${{ secrets.API_KEY }}'}</span>, настоящее значение нигде не записано открыто, и даже в журнале ленты оно закрыто звёздочками.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TEST 3 (secrets — Vault Keeper trigger ekranidan keyin) =====
const Screen10 = (props) => (
  <QuestionScreen {...props} idx={10} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    questionText="Maxfiy kalitni ci.yml faylida qanday ishlatish xavfsiz?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Maxfiy kalitni <span className="italic" style={{ color: T.accent }}>qanday</span> ishlatish xavfsiz?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>безопасно</span> использовать секретный ключ?</> })}</h2></>}
    options={[{ uz: "Seyfga saqlab, ${{ secrets.API_KEY }} orqali chaqirish", ru: 'Хранить в сейфе и вызывать через ${{ secrets.API_KEY }}' }, { uz: "Commit izohiga (commit message) yozib, keyin push qilish", ru: 'Записать в сообщение коммита (commit message) и сделать push' }, { uz: "README faylining eng boshiga alohida qatorga yozib qo'yish", ru: 'Записать отдельной строкой в самом начале файла README' }, { uz: "To'g'ridan-to'g'ri ochiq matn sifatida faylning ichiga yozib qo'yish", ru: 'Записать прямо в файл открытым текстом' }]} correctIdx={0}
    explainCorrect={{ uz: "To'g'ri! Maxfiy kalit hech qachon kod ichida ochiq yozilmaydi — u seyfga saqlanadi va yo'l xaritasida faqat ${{ secrets.API_KEY }} orqali chaqiriladi.", ru: 'Верно! Секретный ключ никогда не пишется в коде открыто — он хранится в сейфе, а в маршрутной карте вызывается только через ${{ secrets.API_KEY }}.' }}
    explainWrong={{
      1: { uz: "Commit izohi ham hammaga ko'rinadi — seyf emas.", ru: 'Сообщение коммита тоже видно всем — это не сейф.' },
      2: { uz: "README ham ochiq fayl — kalit u yerda ham xavfsiz emas.", ru: 'README — тоже открытый файл, ключ там не в безопасности.' },
      3: { uz: "Ochiq matn — repo ochiq bo'lsa, hamma kalitni ko'radi. Bu xavfli.", ru: 'Открытый текст — если репозиторий открыт, ключ увидят все. Это опасно.' },
      default: { uz: "Maxfiy kalit — faqat seyfdan, ${{ secrets.API_KEY }} orqali.", ru: 'Секретный ключ — только из сейфа, через ${{ secrets.API_KEY }}.' }
    }} />
);

// ===== SCREEN 11 — SINOV REYSI VA HAQIQIY REYS =====
const STAGE_MODES = [
  { id: 'staging', icon: '🛫', label: { uz: 'Sinov reysi (staging)', ru: 'Тестовый рейс (staging)' }, d: { uz: "Yo'lovchisiz sinov parvozi — yangi yukni haqiqiy foydalanuvchilardan alohida muhitda tekshirasiz.", ru: 'Пробный полёт без пассажиров — вы проверяете новый груз в среде, отделённой от настоящих пользователей.' } },
  { id: 'production', icon: '✈️', label: { uz: 'Haqiqiy reys (production)', ru: 'Настоящий рейс (production)' }, d: { uz: "Yo'lovchi (foydalanuvchi) qo'lidagi muhit — faqat sinov reysida hammasi yashil bo'lgandan keyin shu yerga chiqadi.", ru: 'Среда в руках пассажира (пользователя) — сюда груз попадает только после того, как на тестовом рейсе всё зелёное.' } }
];
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(STAGE_MODES.map(m => m.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= STAGE_MODES.length;
  const tap = (id) => { setActive(id); setSeen(prev => { const s = new Set(prev); s.add(id); return s; }); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const cur = STAGE_MODES.find(m => m.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · staging', ru: 'Понятие · staging' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Ikkalasini ko'ring", ru: 'Посмотрите оба' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Haqiqiy reysdan oldin — <span className="italic" style={{ color: T.accent }}>sinov reysi</span>.</>, ru: <>Перед настоящим рейсом — <span className="italic" style={{ color: T.accent }}>тестовый рейс</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Yangi yuk to'g'ridan-to'g'ri yo'lovchi qo'liga chiqmaydi. Avval alohida muhitda sinaladi. Ikkala muhitni bosing.", ru: 'Новый груз не попадает сразу в руки пассажира. Сначала его проверяют в отдельной среде. Нажмите на обе среды.' })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {STAGE_MODES.map(m => (
                <button key={m.id} className={`vcard ${seen.has(m.id) ? '' : 'tap-hint'}`} onClick={() => tap(m.id)} style={{ boxShadow: active === m.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : undefined }}>
                  <span className="role-ico">{m.icon}</span>
                  <span className="vlbl">{tr(m.label)}</span>
                  <span className="vseen" style={{ color: seen.has(m.id) ? T.success : T.ink3 }}>{seen.has(m.id) ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="frame fade-step" key={active}><p className="note-h"><span style={{ fontSize: 20, marginRight: 6 }}>{cur.icon}</span>{tr(cur.label)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.d)}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Muhitni bosing ←', ru: 'Нажмите на среду ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Tartib muhim: avval <b>sinov reysi</b>, keyingina <b>haqiqiy reys</b>. Hech qachon teskari emas.</>, ru: <>Порядок важен: сначала <b>тестовый рейс</b>, и только потом <b>настоящий</b>. И никогда наоборот.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — CASE: production'da kutilmagan muammo =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [broke, setBroke] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = broke;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Hayotiy · production', ru: 'Из жизни · production' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Yangi yukni chiqarish', ru: 'Выпустить новый багаж' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sinov reysi yashil edi — <span className="italic" style={{ color: T.accent }}>haqiqiy reysda</span> nima bo'ldi?</>, ru: <>Тестовый рейс был зелёным — что случилось <span className="italic" style={{ color: T.accent }}>на настоящем рейсе</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "Ba'zan sinov reysida yashil bo'lgan yuk ham haqiqiy reysda kutilmagan xato beradi (masalan, boshqa ma'lumotlar hajmi tufayli). Tugmani bosing.", ru: 'Иногда груз, зелёный на тестовом рейсе, на настоящем рейсе выдаёт неожиданную ошибку (например, из-за другого объёма данных). Нажмите кнопку.' })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={broke} onClick={() => { setBroke(true); setSc(n => n + 1); }}>{broke ? tr({ uz: "✓ Yangi yuk production'ga chiqdi", ru: '✓ Новый багаж вышел в продакшен' }) : tr({ uz: "✈️ Yangi yukni production'ga chiqarish", ru: '✈️ Выпустить новый багаж в продакшен' })}</button>
            {broke && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>{tr({ uz: "💥 Production'da xato chiqdi", ru: '💥 В продакшене ошибка' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Foydalanuvchilar hozir <b>buzuq sayt</b>ni ko'rmoqda. Darhol biror narsa qilish kerak.</>, ru: <>Пользователи прямо сейчас видят <b>сломанный сайт</b>. Нужно срочно что-то делать.</> })}</p></div>}
          </Col>
          <Col>
            <PhoneMock state={broke ? 'broken' : 'old'} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Endi vaqt hisobga kirdi. Yechim — <b>eski yukni qaytarish</b>. Keyingi ekranda buni bir bosishda qilamiz.</>, ru: <>Теперь счёт идёт на минуты. Решение — <b>вернуть старый багаж</b>. На следующем экране сделаем это в один клик.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== ★ SCREEN 13 — MARKAZIY BUILDER: «PROFESSIONAL LENTA» — Pro Pipeline badge =====
const IMPROVEMENTS = [
  { id: 'matrix', icon: '🧬', label: { uz: 'Parallel lentalar', ru: 'Параллельные ленты' }, before: { uz: "1 muhitda tekshiriladi — production'da kutilmagan xato chiqishi mumkin", ru: 'Проверка в 1 среде — в продакшене может вылезти неожиданная ошибка' }, after: { uz: "3 muhitda (Node 18/20/22) parallel tekshiriladi — muammo oldindan ko'rinadi", ru: 'Параллельная проверка в 3 средах (Node 18/20/22) — проблема видна заранее' } },
  { id: 'cache', icon: '💨', label: { uz: 'Yaqin javon', ru: 'Ближняя полка' }, before: { uz: 'Har reysda 40 soniya install', ru: 'На каждом рейсе install занимает 40 секунд' }, after: { uz: 'Kesh bilan 8 soniya install — 5 baravar tez', ru: 'С кешем install за 8 секунд — в 5 раз быстрее' } },
  { id: 'secret', icon: '🔐', label: { uz: 'Seyf', ru: 'Сейф' }, before: { uz: "Kalit ochiq matnda — repo ochiq bo'lsa ko'rinadi", ru: 'Ключ открытым текстом — в открытом репозитории виден всем' }, after: { uz: 'Kalit seyfda — kod ichida hech qachon ochiq yozilmaydi', ru: 'Ключ в сейфе — в коде никогда не пишется открыто' } },
  { id: 'staging', icon: '🛫', label: { uz: 'Sinov reysi', ru: 'Тестовый рейс' }, before: { uz: "To'g'ridan-to'g'ri haqiqiy reysga chiqadi", ru: 'Груз уходит сразу на настоящий рейс' }, after: { uz: "Avval sinov reysida tekshiriladi, keyin haqiqiy reysga", ru: 'Сначала проверка на тестовом рейсе, потом настоящий рейс' } }
];
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [on, setOn] = useState(() => new Set());
  const [rolledBack, setRolledBack] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const allOn = on.size >= IMPROVEMENTS.length;
  const done = rolledBack;
  const fired = useRef(!!storedAnswer);
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onAnswer(screen, { stage: 'builder', screenIdx: screen, question: "4 yaxshilashni yoqib, eski yukni qaytaring", correct: true, solved: true, picked: true });
    }
  }, [done]); // eslint-disable-line
  const toggle = (id) => { setOn(prev => { const s = new Set(prev); if (s.has(id)) s.delete(id); else s.add(id); return s; }); setSc(n => n + 1); };
  const rollback = () => { if (!allOn) return; setRolledBack(true); setSc(n => n + 1); };
  return (
    <Stage eyebrow={tr({ uz: 'Markaziy · professional lenta', ru: 'Центральный · профессиональная лента' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (allOn ? tr({ uz: 'Eski yukni qaytaring', ru: 'Верните старый багаж' }) : `${tr({ uz: 'Yaxshilashlarni yoqing', ru: 'Включите улучшения' })} (${on.size}/4)`)} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Lentani <span className="italic" style={{ color: T.accent }}>o'zingiz</span> professional darajaga chiqaring.</>, ru: <>Выведите ленту на профессиональный уровень <span className="italic" style={{ color: T.accent }}>сами</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>4 ta yaxshilashni birma-bir yoqing — har birida <b style={{ color: T.ink }}>oldin/keyin</b> farqni ko'rasiz. Hammasi yoqilgach, oldingi ekrandagi buzuq yukni <b style={{ color: T.ink }}>qaytarasiz</b>.</>, ru: <>Включите 4 улучшения по одному — в каждом увидите разницу <b style={{ color: T.ink }}>до/после</b>. Когда все включены, <b style={{ color: T.ink }}>вернёте</b> сломанный багаж с прошлого экрана.</> })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {IMPROVEMENTS.map(im => {
                const isOn = on.has(im.id);
                return (
                  <button key={im.id} className={`vcard ${isOn ? '' : 'tap-hint'}`} onClick={() => toggle(im.id)} style={{ boxShadow: isOn ? `inset 0 0 0 1.5px ${T.success}, 0 8px 20px -6px rgba(31,122,77,0.2)` : undefined }}>
                    <span className="role-ico">{im.icon}</span>
                    <span className="vlbl">{tr(im.label)}</span>
                    <span className="vseen" style={{ color: isOn ? T.success : T.ink3 }}>{isOn ? tr({ uz: '✓ yoqilgan', ru: '✓ включено' }) : tr({ uz: 'yoqish', ru: 'включить' })}</span>
                  </button>
                );
              })}
            </div>
            {allOn && !done && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={rollback}>{tr({ uz: '🔁 Eski yukni qaytarish (rollback)', ru: '🔁 Вернуть старый багаж (rollback)' })}</button>}
          </Col>
          <Col>
            {IMPROVEMENTS.map(im => on.has(im.id) && (
              <div key={im.id} className="sk-info fade-step">
                <p className="note-h"><span style={{ fontSize: 16, marginRight: 6 }}>{im.icon}</span>{tr(im.label)}</p>
                <p className="small" style={{ margin: '0 0 4px', color: T.danger }}>{tr({ uz: 'Oldin:', ru: 'До:' })} {tr(im.before)}</p>
                <p className="small" style={{ margin: 0, color: T.success }}>{tr({ uz: 'Keyin:', ru: 'После:' })} {tr(im.after)}</p>
              </div>
            ))}
            {on.size === 0 && <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Chapdan yaxshilashni yoqing ←', ru: 'Включите улучшение слева ←' })}</p></div>}
            {allOn && !done && <PhoneMock state="broken" />}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "🎉 Bir bosishda oldingi ishlaydigan yukka qaytdingiz — foydalanuvchi endi yana ishlaydigan saytni ko'radi. Lenta endi professional: tez, xavfsiz, qaytariladigan.", ru: '🎉 В один клик вы вернулись к прежнему рабочему багажу — пользователь снова видит работающий сайт. Лента теперь профессиональная: быстрая, безопасная, обратимая.' })}</p><PhoneMock state="new" /></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — TEST 4 (rollback) =====
const Screen14 = (props) => (
  <QuestionScreen {...props} idx={14} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    questionText="Yangi versiya productionda buzuq chiqdi. Nima qilasiz?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Yangi yuk production'da buzuq chiqdi. <span className="italic" style={{ color: T.accent }}>Nima qilasiz</span>?</>, ru: <>Новый багаж в продакшене оказался сломанным. <span className="italic" style={{ color: T.accent }}>Что будете делать</span>?</> })}</h2></>}
    options={[{ uz: "Hech narsa qilmayman, o'zi tuzalib ketadi deb kutaman", ru: 'Ничего — подожду, вдруг само починится' }, { uz: "Yaqin javonni (cache) butunlay o'chirib, install'ni noldan qayta ishga tushiraman", ru: 'Полностью отключу кеш (cache) и запущу install заново с нуля' }, { uz: "Eski yukni qaytarish (rollback) bilan darhol oldingi versiyaga qaytaman", ru: 'Сразу вернусь к прежней версии через rollback (возврат старого багажа)' }, { uz: "Parallel lentalar sonini yana ko'paytirib, qaytadan sinab ko'raman", ru: 'Увеличу количество параллельных лент и попробую ещё раз' }]} correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! Rollback — muammoli yangi yukdan darhol oldingi ishlaydigan yukka qaytish. Bu eng tez va ishonchli yechim.", ru: 'Верно! Rollback — мгновенный возврат от проблемного нового багажа к прежнему рабочему. Это самое быстрое и надёжное решение.' }}
    explainWrong={{
      0: { uz: "Kutish — foydalanuvchi shu vaqtda buzuq saytni ko'raveradi. Darhol harakat kerak.", ru: 'Ждать нельзя — всё это время пользователь видит сломанный сайт. Действовать нужно сразу.' },
      1: { uz: "Cache'ni o'chirish muammoni hal qilmaydi — bu boshqa yaxshilash.", ru: 'Отключение кеша проблему не решит — это другое улучшение.' },
      3: { uz: "Matrix sonini ko'paytirish ham hozirgi buzuq versiyani tuzatmaydi.", ru: 'Больше параллельных лент — но текущую сломанную версию это не починит.' },
      default: { uz: "Muammo chiqsa — rollback bilan darhol qaytiladi.", ru: 'Если возникла проблема — сразу откатываемся через rollback.' }
    }} />
);

// ===== SCREEN 15 — FINAL: professional lenta tartibi + oqibat (Order Matters badge) =====
const PRO_ITEMS = [
  { id: 'matrix', label: { uz: "🧬 Matrix — parallel tekshirish", ru: '🧬 Matrix — параллельная проверка' } },
  { id: 'cache', label: { uz: "💨 Cache — tezroq yig'ish", ru: '💨 Cache — быстрее сборка' } },
  { id: 'secret', label: { uz: "🔐 Secret — seyfdan kalit", ru: '🔐 Secret — ключ из сейфа' } },
  { id: 'staging', label: { uz: '🛫 Staging — sinov reysi', ru: '🛫 Staging — тестовый рейс' } },
  { id: 'production', label: { uz: '✈️ Production — haqiqiy reys', ru: '✈️ Production — настоящий рейс' } }
];
const PRO_ORDER = PRO_ITEMS.map(i => i.id);
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  const [consequence, setConsequence] = useState(null); // null | 'skip-staging' | 'wrong'
  const hadWrongRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect === false) : false);
  const fired = useRef(!!storedAnswer);
  const [recapOpen, setRecapOpen] = useState(false);
  const onSolved = () => {
    if (fired.current) { setDone(true); return; }
    fired.current = true;
    const firstOk = !hadWrongRef.current;
    setDone(true);
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Professional lenta bosqichlarini to'g'ri tartibda joylang", correct: firstOk, firstAttemptCorrect: firstOk, solved: true, picked: firstOk ? 0 : 1 });
  };
  const onChange = (slots) => {
    if (fired.current) return;
    const full = slots.every(s => s !== null);
    if (!full) { setConsequence(null); return; }
    const solved = slots.every((s, i) => s === PRO_ORDER[i]);
    if (solved) { setConsequence(null); return; }
    hadWrongRef.current = true;
    const prodIdx = slots.indexOf('production');
    const stageIdx = slots.indexOf('staging');
    setConsequence(prodIdx >= 0 && stageIdx >= 0 && prodIdx < stageIdx ? 'skip-staging' : 'wrong');
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Lentani yig'ing", ru: 'Соберите ленту' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: professional lentani <span className="italic" style={{ color: T.accent }}>to'g'ri tartibda</span> yig'ing.</>, ru: <>Последний шаг: соберите профессиональную ленту <span className="italic" style={{ color: T.accent }}>в правильном порядке</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Bosqichlarni sudrab to'g'ri tartibga joylang. Diqqat: agar ✈️ Production'ni 🛫 Staging'dan oldin qo'ysangiz — oqibatini ko'rasiz. Keyin to'g'rilaysiz.", ru: 'Перетащите этапы в правильный порядок. Внимание: если поставите ✈️ Production раньше 🛫 Staging — увидите последствия. Потом исправите.' })}</Mentor>
        <DragDropOrder
          items={PRO_ITEMS}
          hints={[{ uz: "avval nima parallel tekshiriladi", ru: 'сначала — что проверяется параллельно' }, { uz: "keyin qanday tezlashtiriladi", ru: 'потом — как это ускоряется' }, { uz: "keyin qayerdan kalit olinadi", ru: 'потом — откуда берётся ключ' }, { uz: "keyin qayerda sinaladi", ru: 'потом — где проходит проверка' }, { uz: "eng oxiri qayerga chiqadi", ru: 'в самом конце — куда всё выходит' }]}
          doneText={{ uz: "To'g'ri: Matrix → Cache → Secret → Staging → Production.", ru: 'Верно: Matrix → Cache → Secret → Staging → Production.' }}
          onSolved={onSolved}
          onChange={onChange} />
        {consequence === 'skip-staging' && !done && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>{tr({ uz: '💥 Sinov reysisiz haqiqiy reysga chiqib ketdi!', ru: '💥 Улетело на настоящий рейс без тестового!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Tekshirilmagan yuk to'g'ridan-to'g'ri yo'lovchi qo'liga tushdi. Tartibni to'g'rilang.", ru: 'Непроверенный груз попал прямо в руки пассажира. Исправьте порядок.' })}</p><PhoneMock state="broken" /></div>}
        {consequence === 'wrong' && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qaytadan joylang.", ru: 'Порядок неверный — нажмите на блок, верните его и разложите заново.' })}</p></div>}
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Professional lenta tayyor: <b>Matrix → Cache → Secret → Staging → Production</b>. Muammo chiqsa — rollback bilan bir bosishda qaytarasiz.</>, ru: <>✓ Профессиональная лента готова: <b>Matrix → Cache → Secret → Staging → Production</b>. Если возникнет проблема — вернётесь через rollback в один клик.</> })}</p><PhoneMock state="new" />
          {hadWrongRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: '📖 Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};


// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  multiRunner: { icon: '🧬', name: 'Multi-Runner', desc: { uz: "Parallel lentalar (matrix) nima ekanini tushundingiz", ru: 'Вы разобрались, что такое параллельные ленты (matrix)' } },
  vaultKeeper: { icon: '🔐', name: 'Vault Keeper', desc: { uz: "Maxfiy kalitni qayerda xavfsiz saqlashni to'g'ri topdingiz", ru: 'Вы правильно определили, где безопасно хранить секретный ключ' } },
  proPipeline: { icon: '🏎️', name: 'Pro Pipeline', desc: { uz: "Production'da muammo chiqqanda rollback yechimini to'g'ri topdingiz", ru: 'Вы верно выбрали rollback при проблеме в продакшене' } },
  orderMatters: { icon: '🔀', name: 'Order Matters', desc: { uz: "Professional lenta tartibini 1-urinishda to'g'ri terdingiz", ru: 'Вы собрали порядок профессиональной ленты с 1-й попытки' } },
};
// Ekran id → nishon. ❗ FAQAT SCORED (haqiqiy xato qilish yo'li bor) ekranlarga bog'lanadi: s4, s8, s10, s14, s15.
// ⚠️ s9 (seyf case) va s13 (builder) — chiziqli/majburiy oqim, xato qilib bo'lmaydi (tugma bosishlar ketma-ket majburiy) →
// shu sabab nishonlar mavzudosh SCORED savollarga ko'chirildi: vaultKeeper→s10 (seyf/secrets savoli), proPipeline→s14 (rollback savoli).
const ACH_TRIGGERS = { s4: 'multiRunner', s10: 'vaultKeeper', s14: 'proPipeline', s15: 'orderMatters' };

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
const Q_LABELS = { 4: '1 — Matrix', 8: '2 — Cache', 10: '3 — Secret', 14: '4 — Rollback', 15: '5 — Tartib' };
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si (professional lenta atamalari)
const QZ_BG_SHAPES = [
  { ch: 'matrix',      l: 5,  t: 10, s: 32, d: 19, dl: 0 },
  { ch: '🧬',           l: 85, t: 8,  s: 32, d: 23, dl: 1.5 },
  { ch: 'cache',       l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'secrets',     l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: 'staging',     l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: 'rollback',    l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: 'node 18/20/22', l: 26, t: 34, s: 20, d: 20, dl: 1.9 },
  { ch: 'ci.yml',      l: 55, t: 5,  s: 26, d: 22, dl: 0.6 },
  { ch: '✗',           l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '✓',           l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: 'production',  l: 34, t: 62, s: 20, d: 29, dl: 3.4 },
  { ch: '💨',           l: 2,  t: 30, s: 26, d: 28, dl: 3.1 },
  { ch: '🔐',           l: 60, t: 90, s: 20, d: 31, dl: 4.2 },
  { ch: '🛫',           l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3, mexanik ketma-ketlik yo'q).
// 🎓 Metodist: savol matni va variant uzunliklari sayqallanadi · ⚡ Jonli: `correct` qiymatlari INLINE_KEYS bilan sinxron tekshiriladi.
const QUIZ_BANK = [
  { q: { uz: "Parallel lentalar (matrix) nima uchun ishlatiladi?", ru: 'Для чего используются параллельные ленты (matrix)?' }, opts: [{ uz: "Bir nechta muhitda (masalan, Node versiyalarida) bir vaqtda sinash uchun", ru: 'Чтобы тестировать одновременно в нескольких средах (например, версиях Node)' }, { uz: "Faqat production serverini qayta yuklab, ishga tushirish uchun ishlatiladi", ru: 'Чтобы просто перезагружать и запускать продакшен-сервер' }, { uz: "Kodni faqat bitta muhitda biroz sekinroq tekshirish uchun maxsus ishlatiladi", ru: 'Чтобы проверять код в одной-единственной среде, но чуть медленнее' }, { uz: "Maxfiy kalitlarni bitta joyga yig'ib, doim yashirib qo'yish uchun ishlatiladi", ru: 'Чтобы собрать секретные ключи в одном месте и всегда их прятать' }], correct: 0 },
  { q: { uz: "Yaqin javon (cache) nimani tezlashtiradi?", ru: 'Что ускоряет ближняя полка (cache)?' }, opts: [{ uz: "Foydalanuvchi brauzeridagi sahifa render bo'lish tezligini oshirib beradi", ru: 'Скорость отрисовки страницы в браузере пользователя' }, { uz: "Faqat production serverining internetga ulanish tezligini oshirib beradi", ru: 'Только скорость подключения продакшен-сервера к интернету' }, { uz: "Testlarning ichidagi mantiqiy hisob-kitoblarini bajarish tezligini oshiradi", ru: 'Скорость логических вычислений внутри тестов' }, { uz: "Paketlarni qaytadan yuklamaslik orqali install bosqichini tezlashtiradi", ru: 'Этап install — пакеты не скачиваются заново' }], correct: 3 },
  { q: { uz: "Maxfiy kalitni (masalan API_KEY) yo'l xaritasiga qanday yozish xavfsiz?", ru: 'Как безопасно записать секретный ключ (например, API_KEY) в маршрутную карту?' }, opts: [{ uz: "To'g'ridan-to'g'ri ochiq matn sifatida faylning ichiga yozib qo'yiladi", ru: 'Записать прямо в файл открытым текстом' }, { uz: "README faylining eng boshiga alohida qatorga yozib qo'yiladi", ru: 'Записать отдельной строкой в самом начале README' }, { uz: "Seyfga saqlab, keyin maxsus belgi orqali chaqirib ishlatiladi", ru: 'Сохранить в сейфе и вызывать через специальную запись' }, { uz: "Commit izohiga (commit message) yozib, keyin push qilib yuboriladi", ru: 'Записать в сообщение коммита и отправить push' }], correct: 2 },
  { q: { uz: "Sinov reysi (staging) nima uchun kerak bo'ladi?", ru: 'Зачем нужен тестовый рейс (staging)?' }, opts: [{ uz: "Kodni to'g'ridan-to'g'ri yo'lovchi qo'liga tezroq yetkazish uchun kerak", ru: 'Чтобы быстрее доставить код прямо в руки пассажира' }, { uz: "Haqiqiy reysdan oldin yo'lovchisiz alohida sinab ko'rish uchun", ru: 'Чтобы отдельно всё проверить без пассажиров перед настоящим рейсом' }, { uz: "Parallel lentalarni bitta katta lentaga birlashtirib qo'yish uchun kerak", ru: 'Чтобы объединить параллельные ленты в одну большую ленту' }, { uz: "Maxfiy kalitlarni ochiq holda saqlab qo'yish uchun ishlatiladi doimo", ru: 'Чтобы всегда хранить секретные ключи в открытом виде' }], correct: 1 },
  { q: { uz: "Yangi o'ralgan yuk productionda buzuq chiqdi. Eng tez yechim nima bo'ladi?", ru: 'Новый упакованный багаж в продакшене оказался сломанным. Какое решение самое быстрое?' }, opts: [{ uz: "Yaqin javonni (cache) to'liq tozalab, yana boshidan yuklab olinadi", ru: 'Полностью очистить кеш (cache) и загрузить всё заново' }, { uz: "Barcha maxfiy kalitlarni butunlay o'chirib, so'ngra yangidan yaratib qo'yiladi", ru: 'Удалить все секретные ключи и создать их заново' }, { uz: "Parallel lentalar sonini yana ko'proq oshirib, qayta sinab ko'riladi", ru: 'Увеличить количество параллельных лент и попробовать снова' }, { uz: "Eski yukni qaytarish (rollback) bilan oldingi versiyaga darhol qaytiladi", ru: 'Сразу вернуться к прежней версии через rollback (возврат старого багажа)' }], correct: 3 },
  { q: { uz: "Matrix'da 3 muhitdan biri (masalan Node 18) qizil chiroq bersa nima bo'ladi?", ru: 'Что будет, если в matrix одна из 3 сред (например, Node 18) даст красный свет?' }, opts: [{ uz: "Aynan o'sha muhit qizil ko'rinadi, qaysi sharoitda singani aniqlanadi", ru: 'Красной станет именно эта среда — сразу ясно, в каких условиях всё сломалось' }, { uz: "Qolgan ikkita muhit ham avtomatik ravishda qizil bo'lib qolaveradi", ru: 'Остальные две среды тоже автоматически станут красными' }, { uz: "Butun lenta darhol butunlay o'chib, hammasi qayta o'rnatilishi kerak bo'ladi", ru: 'Вся лента сразу выключится, и всё придётся переустанавливать' }, { uz: "Barcha muhitlar birlashib, o'rtacha bitta natija chiqarib beriladi", ru: 'Все среды объединятся и выдадут один усреднённый результат' }], correct: 0 },
  { q: { uz: "Yaqin javon (cache) qanday qilib ishlaydi?", ru: 'Как работает ближняя полка (cache)?' }, opts: [{ uz: "Har reysda hamma narsani doim noldan boshlab qayta yozib chiqaveradi", ru: 'На каждом рейсе всегда всё переделывает заново с нуля' }, { uz: "Avvalgi reysda yuklangan paketlarni saqlab, keyin qayta ishlatiladi", ru: 'Сохраняет пакеты с прошлого рейса и использует их снова' }, { uz: "Testlar natijasini butunlay eslab qolib, qayta ishga tushirmaydi", ru: 'Запоминает результаты тестов и больше их не запускает' }, { uz: "Faqat maxfiy kalitlarni saqlaydi, boshqa hech narsani saqlamaydi", ru: 'Хранит только секретные ключи и больше ничего' }], correct: 1 },
  { q: { uz: "Seyf (secrets) qayerda saqlanishi kerak bo'ladi?", ru: 'Где должны храниться секреты (secrets)?' }, opts: [{ uz: "ci.yml faylining o'zida, hammaga ochiq matn sifatida turadi doimo", ru: 'Прямо в файле ci.yml, открытым текстом на виду у всех' }, { uz: "Lenta jurnalining (logs) eng oxirgi qatoriga yozib qo'yiladi", ru: 'В самой последней строке журнала ленты (logs)' }, { uz: "Platformaning maxsus xavfsiz seyf sozlamalar bo'limida saqlanadi", ru: 'В специальном безопасном разделе-сейфе в настройках платформы' }, { uz: "Foydalanuvchiga ochiq ko'rinadigan README faylida saqlanadi", ru: 'В файле README, открытом для любого пользователя' }], correct: 2 },
  { q: { uz: "Sinov reysi (staging) va haqiqiy reys (production) orasidagi farq nima?", ru: 'В чём разница между тестовым рейсом (staging) и настоящим (production)?' }, opts: [{ uz: "Sinov reysida yo'lovchi yo'q, haqiqiy reysda esa yo'lovchi bor", ru: 'На тестовом рейсе пассажиров нет, а на настоящем — есть' }, { uz: "Sinov reysi faqat dushanba kunlari ishga tushib, keyin o'chadi", ru: 'Тестовый рейс запускается только по понедельникам, а потом отключается' }, { uz: "Ikkalasi ham aslida bir xil, faqat nomlari boshqacha qo'yilgan", ru: 'На самом деле они одинаковые, просто названия разные' }, { uz: "Haqiqiy reys hech qachon hech qanday tekshiruvdan o'tmasligi kerak", ru: 'Настоящий рейс вообще не должен проходить никаких проверок' }], correct: 0 },
  { q: { uz: "Eski yukni qaytarish (rollback) qachon ishlatilishi kerak bo'ladi?", ru: 'Когда нужно использовать возврат старого багажа (rollback)?' }, opts: [{ uz: "Har push'da, sharoitidan qat'i nazar har doim ishlatilishi kerak", ru: 'При каждом push, всегда и независимо от ситуации' }, { uz: "Yangi versiya productionda muammo chiqarganda, tez qaytish uchun", ru: 'Когда новая версия дала сбой в продакшене — чтобы быстро вернуться' }, { uz: "Yaqin javon (cache) hali bo'sh bo'lgan paytda ishlatilishi kerak", ru: 'Когда ближняя полка (cache) ещё пустая' }, { uz: "Faqat matrix barcha muhitlarda to'liq yashil bo'lgan paytda ishlatiladi", ru: 'Только когда matrix полностью зелёный во всех средах' }], correct: 1 },
  { q: { uz: "Parallel lentalar foydali — turli muhitda kod boshqacha ishlashi mumkinmi?", ru: 'Параллельные ленты полезны — а может ли код в разных средах работать по-разному?' }, opts: [{ uz: "Ha, lekin bu faqat yakshanba kunlari shunday bo'lib qoladi", ru: 'Да, но только по воскресеньям' }, { uz: "Yo'q, barcha muhitlarda kod har doim aynan bir xil ishlaydi", ru: 'Нет, во всех средах код всегда работает одинаково' }, { uz: "Yo'q, matrix faqat sayt dizaynini tekshiradi, kodni umuman tekshirmaydi", ru: 'Нет, matrix проверяет только дизайн сайта, а код — вообще нет' }, { uz: "Ha, chunki turli muhitlarda kod har xil natija berishi mumkin bo'ladi", ru: 'Да, ведь в разных средах код может давать разный результат' }], correct: 3 },
  { q: { uz: "Professional lentada to'g'ri tartib qanday bo'lishi kerak?", ru: 'Каким должен быть правильный порядок в профессиональной ленте?' }, opts: [{ uz: "Avval production ishga tushadi, so'ngra sinov reysi (staging) boshlanadi", ru: 'Сначала запускается production, затем начинается тестовый рейс (staging)' }, { uz: "Avval rollback qilinib, keyin yangi yuk chiqarib yuboriladi", ru: 'Сначала делается rollback, потом выпускается новый багаж' }, { uz: "Avval sinov reysi (staging), so'ngra haqiqiy reys (production)", ru: 'Сначала тестовый рейс (staging), затем настоящий рейс (production)' }, { uz: "Avval seyf o'chiriladi, keyin kod yozishga kirishiladi", ru: 'Сначала отключается сейф, потом начинают писать код' }], correct: 2 },
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
    // Arena tokenlari — SHU darsning mavzusidan (professional lenta): dekorativ suzuvchi kod-bo'laklari
    const TOK = ['matrix', 'cache', 'secrets', 'staging', 'rollback', 'ci.yml', 'runner', '✓', '✗', 'node 20'];
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
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме практики' })}</button>
        </div>
      )}

      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Серия верных ответов подряд даёт 🔥 бонус!' })}</p>
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Xato — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. Возьмёте своё на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Побыстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: <>Siz hozir: {myRank + 1}-o'rin</>, ru: <>Вы сейчас на {myRank + 1}-м месте</> })}</span>}
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

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: <>ball · {soloScore.ok}/{QUIZ_BANK.length} to'g'ri{soloScore.maxStreak >= 2 ? ` · eng uzun streak 🔥x${soloScore.maxStreak}` : ''}</>, ru: <>баллов · {soloScore.ok}/{QUIZ_BANK.length} верных{soloScore.maxStreak >= 2 ? ` · лучшая серия 🔥x${soloScore.maxStreak}` : ''}</> })}</p>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест ещё раз — практика (в таблицу не записывается)' })}</button>}
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верных)</> })}</p>}
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
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: (title && title.uz) || title, solved: true, correct: true, picked: true });
    // JONLI: praktika bajarilgani serverga yoziladi (500+ zona — reytingga aralashmaydi, faqat mentor ko'radi)
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  // JONLI: mentor keyingi sahifaga o'tmaguncha NavNext qulf bo'ladi (optionalLive + LiveGateCtx gate). Hozircha done bo'lsa ochiq.
  const audio = useAudio([{ id: `practice_${screen}`, text: `Endi navbat sizda — bu topshiriqni o'z kompyuteringizda bajarasiz. ci.yml faylini yozing, push qiling va lentani jonli kuzating. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — ustoz kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Отмечайте каждый шаг по мере выполнения. Когда закончите, нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — наставник следит за прогрессом.</> })}</Mentor>
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
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.", ru: 'Отлично! Задание выполнено. Наставник проверит и переведёт вас на следующий шаг.' })}</p></div>}
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'atama yodlandi', ru: 'терминов выучено' })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Изучается' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span><span className="fc-cue">{tr({ uz: 'Qaysi tushuncha?', ru: 'Какое это понятие?' })} 🤔 <span className="fc-tap">{tr({ uz: 'bosing', ru: 'нажмите' })}</span></span></div>
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

// 🛠️ PRAKTIKA — 4c backend: HtmlCompiler YO'Q, o'quvchi GitHub'da bajaradi (mentor-gate)
const ScreenProPractice = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "O'z loyihangizga professional yaxshilashlarni qo'shing", ru: 'Добавьте профессиональные улучшения в свой проект' }}
    task={{ uz: "Repo'dagi ci.yml faylini yaxshilang: bir nechta muhitda parallel test (matrix), paketlarni tezlashtiruvchi kesh (cache) va maxfiy kalitni seyfda saqlash (secrets) qo'shing. Keyin push qilib, Actions bo'limida natijani kuzating.", ru: 'Улучшите файл ci.yml в репозитории: добавьте параллельные тесты в нескольких средах (matrix), ускоряющий кеш пакетов (cache) и хранение секретного ключа в сейфе (secrets). Затем сделайте push и следите за результатом в разделе Actions.' }}
    checklist={[
      { uz: "`ci.yml` ichiga `strategy: matrix` bilan 2-3 muhit (masalan `node-version: [18, 20, 22]`) qo'shing", ru: 'Добавьте в `ci.yml` 2-3 среды через `strategy: matrix` (например `node-version: [18, 20, 22]`)' },
      { uz: "`actions/cache@v4` bilan `node_modules`'ni keshlang", ru: 'Закешируйте `node_modules` с помощью `actions/cache@v4`' },
      { uz: "Har qanday maxfiy qiymatni `${{ secrets.NOM }}` orqali chaqiring — hech qachon ochiq yozmang", ru: 'Любое секретное значение вызывайте через `${{ secrets.NOM }}` — никогда не пишите его открыто' },
      { uz: "O'zgarishni push qiling", ru: 'Сделайте push изменений' },
      { uz: "`Actions` bo'limini oching — 3 muhit parallel aylanayotganini kuzating", ru: 'Откройте раздел `Actions` — понаблюдайте, как 3 среды крутятся параллельно' },
    ]} />
);

// 🃏 FLASHCARD KARTALARI — 12 atama (professional lenta tili)
const PRO_FLASHCARDS = [
  { front: { uz: "Bitta kodni bir nechta muhitda (Node 18/20/22) bir vaqtda tekshirish", ru: 'Проверка одного кода в нескольких средах (Node 18/20/22) одновременно' }, back: 'Matrix', note: { uz: 'parallel lentalar', ru: 'параллельные ленты' } },
  { front: { uz: "Avvalgi reysda yuklangan paketlarni saqlab, keyingi reysni tezlashtirish", ru: 'Сохранение пакетов с прошлого рейса, чтобы ускорить следующий' }, back: 'Cache', note: { uz: 'yaqin javon', ru: 'ближняя полка' } },
  { front: { uz: "Maxfiy kalitlar saqlanadigan xavfsiz joy", ru: 'Безопасное место для хранения секретных ключей' }, back: 'Secret', note: { uz: 'seyf', ru: 'сейф' } },
  { front: { uz: "Haqiqiy reysdan oldin yo'lovchisiz sinab ko'rish muhiti", ru: 'Среда для проверки без пассажиров перед настоящим рейсом' }, back: 'Staging', note: { uz: 'sinov reysi', ru: 'тестовый рейс' } },
  { front: { uz: "Yo'lovchi (foydalanuvchi) qo'lidagi haqiqiy muhit", ru: 'Настоящая среда в руках пассажира (пользователя)' }, back: 'Production', note: { uz: 'haqiqiy reys', ru: 'настоящий рейс' } },
  { front: { uz: "Productionda muammo chiqsa oldingi versiyaga darhol qaytish", ru: 'Мгновенный возврат к прежней версии при проблеме в продакшене' }, back: 'Rollback', note: { uz: "eski yukni qaytarish", ru: 'возврат старого багажа' } },
  { front: { uz: "ci.yml'da bir nechta muhitni sanab beruvchi kalit so'z", ru: 'Ключевое слово, перечисляющее несколько сред в ci.yml' }, back: 'strategy: matrix', note: { uz: 'YAML kaliti', ru: 'ключ YAML' } },
  { front: { uz: "Maxfiy kalitni ishlatish sintaksisi", ru: 'Синтаксис использования секретного ключа' }, back: '${{ secrets.API_KEY }}', note: { uz: 'seyfdan chaqirish', ru: 'вызов из сейфа' } },
  { front: { uz: "Kesh saqlanadigan joy nomi (odatda)", ru: 'Что обычно кешируется (название папки)' }, back: 'node_modules', note: { uz: 'paketlar papkasi', ru: 'папка пакетов' } },
  { front: { uz: "Bitta muhitda yashil, boshqasida qizil bo'lishi — buni nima ko'rsatadi", ru: 'В одной среде зелёный, в другой красный — что это показывает' }, back: { uz: 'Matrix natijasi', ru: 'Результат matrix' }, note: { uz: "muhitga bog'liq xato", ru: 'ошибка, зависящая от среды' } },
  { front: { uz: "Sinov reysida (staging) kim yo'q?", ru: 'Кого нет на тестовом рейсе (staging)?' }, back: { uz: "Yo'lovchi (real foydalanuvchi)", ru: 'Пассажира (реального пользователя)' }, note: { uz: 'xavfsiz test muhiti', ru: 'безопасная тестовая среда' } },
  { front: { uz: "Rollback qanchalik tez bo'lsa, foydalanuvchi muammoni...", ru: 'Чем быстрее rollback, тем пользователь проблему...' }, back: { uz: 'Kamroq sezadi', ru: 'Меньше замечает' }, note: { uz: 'tezkorlik = ishonch', ru: 'скорость = доверие' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Professional lenta atamalarini <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <>Быстро повторим <span className="italic" style={{ color: T.accent }}>термины профессиональной ленты</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Darsni yakunlashdan oldin bugungi atamalarni takrorlaymiz. Har kartada bir topishmoq — <b style={{ color: T.ink }}>qaysi atama</b> ekanini o'ylang, keyin kartani bosib tekshiring. <b style={{ color: T.ink }}>Bildim</b> yoki <b style={{ color: T.ink }}>Takrorlash</b> bilan baholang.</>, ru: <>Перед завершением урока повторим сегодняшние термины. На каждой карточке — загадка: подумайте, <b style={{ color: T.ink }}>какой это термин</b>, потом нажмите на карточку и проверьте себя. Оцените кнопками <b style={{ color: T.ink }}>Знаю</b> или <b style={{ color: T.ink }}>Повторить</b>.</> })}</Mentor>
        <div className="fc-center"><Flashcards cards={PRO_FLASHCARDS} /></div>
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
    { uz: "Matrix — bitta yukni bir nechta muhitda (masalan Node versiyalarida) parallel tekshiradi", ru: 'Matrix — проверяет один груз параллельно в нескольких средах (например, версиях Node)' },
    { uz: "Cache — avvalgi paketlarni saqlab, keyingi reysni sezilarli tezlashtiradi", ru: 'Cache — сохраняет прежние пакеты и заметно ускоряет следующий рейс' },
    { uz: "Secret — maxfiy kalitlar hech qachon ochiq yozilmaydi, faqat seyfdan chaqiriladi", ru: 'Secret — секретные ключи никогда не пишутся открыто, только вызываются из сейфа' },
    { uz: "Staging → Production — avval sinov reysida, keyin haqiqiy reysga chiqariladi", ru: 'Staging → Production — сначала тестовый рейс, потом выход на настоящий' },
    { uz: "Rollback — production'da muammo chiqsa, bir bosishda eski yukka qaytiladi", ru: 'Rollback — при проблеме в продакшене возврат к старому багажу в один клик' }
  ];
  const HOMEWORK = [
    { b: { uz: "Qo'shing", ru: 'Добавьте' }, t: { uz: "— o'z loyihangizga matrix bilan kamida 2 muhitni sinash", ru: '— проверку минимум 2 сред через matrix в своём проекте' } },
    { b: { uz: 'Sozlang', ru: 'Настройте' }, t: { uz: "— node_modules uchun cache qo'shing va vaqt farqini o'lchang", ru: '— добавьте cache для node_modules и измерьте разницу во времени' } },
    { b: { uz: 'Tekshiring', ru: 'Проверьте' }, t: { uz: "— loyihangizda hech qanday maxfiy kalit ochiq yozilmaganini tekshiring", ru: '— что в вашем проекте ни один секретный ключ не записан открыто' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: "Professional lentani yig'dingiz", ru: 'Вы собрали профессиональную ленту' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi lentangiz — <span className="italic" style={{ color: T.accent }}>tez, xavfsiz, qaytariladigan</span>.</>, ru: <>Теперь ваша лента — <span className="italic" style={{ color: T.accent }}>быстрая, безопасная, обратимая</span>.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: "Tabriklaymiz! Matrix, cache, seyf, sinov reysi va rollback — professional lentaning barcha qismlarini bilib oldingiz.", ru: 'Поздравляем! Matrix, cache, сейф, тестовый рейс и rollback — вы разобрались во всех частях профессиональной ленты.' }) : tr({ uz: "Yaxshi harakat! Matrix, seyf va rollback mavzularini mustahkamlash uchun bir-ikki ekranni qayta ko'ring.", ru: 'Хорошая работа! Чтобы закрепить matrix, сейф и rollback, пересмотрите пару экранов.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "🚀 Loyiha kuni davom etadi — endi bu professional lentani o'z bitiruv loyihangizga qo'llaysiz!", ru: '🚀 Проектный день продолжается — теперь примените эту профессиональную ленту в своём выпускном проекте!' })}</p></div>
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
export default function FullProPipelineLesson({ lang: langProp, onFinished }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenProPractice, ScreenPodium, ScreenFlashcards, SummaryScreen];
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

        /* ============ 4c-MODUL · CI/CD DARSI CSS ============ */

        /* TERMINAL (retyped — reusable qatlamdan tashqarida, shu yerda kerak) */
        .term { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .term-bar { background: #2D2D2D; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .term-title { font-family: 'JetBrains Mono'; font-size: 11px; color: #C9D1D9; }
        .term-body { background: #1E1E1E; padding: 12px 13px; min-height: 60px; }
        .tline { font-family: 'JetBrains Mono'; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.8; color: ${CODE.text}; word-break: break-word; }

        /* LENTA (pipeline) status-strip — s1/s3/s6/s7 preview */
        /* pipe-track — lenta ostidagi cheksiz aylanuvchi chiziqlar (doim sekin harakatlanadi, "lenta ishlayapti" hissi) */
        .pipe-track { position: relative; border-radius: 14px; overflow: visible; padding: 20px 2px 9px; }
        .pipe-track::after { content: ''; position: absolute; left: 0; right: 0; bottom: 2px; height: 3px; border-radius: 99px; background-image: repeating-linear-gradient(90deg, ${T.ink3}70 0 9px, transparent 9px 19px); background-size: 38px 100%; animation: belt-scroll 1s linear infinite; opacity: 0.55; }
        @keyframes belt-scroll { to { background-position: -38px 0; } }
        /* 🧳 chamadon — hozirgi nuqtaga qarab lenta ustida siljiydi */
        .pipe-suitcase { position: absolute; top: 0; font-size: 16px; transform: translateX(-50%); transition: left 0.6s cubic-bezier(.4,0,.2,1); z-index: 2; filter: drop-shadow(0 3px 5px rgba(${T.shadowBase},0.35)); }
        @media (prefers-reduced-motion: reduce) { .pipe-suitcase { transition: none; } }
        .pipe { position: relative; z-index: 1; display: flex; align-items: center; flex-wrap: wrap; gap: 5px; padding: 4px 0; }
        .pipe-step { position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; background: ${T.paper}; border-radius: 11px; padding: 9px 11px; min-width: 66px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); transition: all 0.25s, opacity 0.35s; }
        .pipe-ico { font-size: 19px; line-height: 1; display: inline-block; }
        .pipe-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; color: ${T.ink}; }
        .pipe-badge { font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 800; min-height: 13px; line-height: 1; color: ${T.ink3}; }
        .pipe-arrow { color: ${T.ink3}; font-weight: 700; font-size: 14px; }
        /* 🔍 SKANER: nuqta ustida yuqoridan pastga o'tuvchi ko'k tekshiruv nuri */
        .pipe-step.run { box-shadow: inset 0 0 0 1.5px ${T.blue}, 0 5px 14px -6px rgba(1,154,203,0.3); animation: pipe-run-pulse 0.9s ease-in-out infinite; }
        .pipe-step.run::after { content: ''; position: absolute; left: 0; right: 0; top: -45%; height: 45%; background: linear-gradient(180deg, transparent, rgba(1,154,203,0.75), transparent); animation: scan-sweep 0.8s ease-in-out infinite; pointer-events: none; }
        @keyframes scan-sweep { 0% { top: -45%; } 100% { top: 115%; } }
        @keyframes pipe-run-pulse { 0%,100% { box-shadow: inset 0 0 0 1.5px ${T.blue}, 0 5px 14px -6px rgba(1,154,203,0.3); } 50% { box-shadow: inset 0 0 0 1.5px ${T.blue}, 0 8px 18px -6px rgba(1,154,203,0.45); } }
        .pipe-step.run .pipe-badge { color: ${T.blue}; }
        .pipe-step.pass { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .pipe-step.pass .pipe-badge { color: ${T.success}; }
        /* ✈️ UCHISH: faqat Uchirish nuqtasi yashil bo'lganda — samolyot sirg'alib ko'tariladi */
        .pipe-step[data-id="deploy"].pass .pipe-ico { animation: plane-launch 0.9s cubic-bezier(.3,.75,.4,1) both; }
        @keyframes plane-launch { 0% { transform: translate(0,0) rotate(0deg); } 55% { transform: translate(13px,-11px) rotate(-8deg); } 100% { transform: translate(0,0) rotate(0deg); } }
        /* 🚦 QIZIL CHIROQ: lenta shu nuqtada TO'XTAYDI — 2 marta qizil pulsatsiya + chamadon titraydi */
        .pipe-step.fail { background: ${T.dangerSoft}; box-shadow: inset 0 0 0 1.5px ${T.danger}; animation: pipe-fail-pulse 0.5s ease-in-out 2, pipe-fail-shake 0.5s ease; }
        @keyframes pipe-fail-pulse { 0%,100% { box-shadow: inset 0 0 0 1.5px ${T.danger}, 0 0 0 0 rgba(194,54,43,0); } 50% { box-shadow: inset 0 0 0 1.5px ${T.danger}, 0 0 0 6px rgba(194,54,43,0.32); } }
        @keyframes pipe-fail-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(4px); } }
        .pipe-step.fail .pipe-badge { color: ${T.danger}; }
        /* keyingi nuqtalar — lenta to'xtaganda so'nib qoladi, chiziqlar ham qotadi */
        .pipe-step.skip { opacity: 0.35; }
        .pipe-track:has(.pipe-step.fail)::after { animation-play-state: paused; opacity: 0.25; }
        @keyframes rz-shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: rz-shake 0.4s ease; }

        /* Qo'lda-yuk / vasvasali tugma vaqt taymerlari (s2/s3) */
        .timer-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .timer-chip { flex: 1; min-width: 130px; display: flex; flex-direction: column; gap: 3px; background: ${T.paper}; border-radius: 12px; padding: 12px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); }
        .timer-chip .tc-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .timer-chip .tc-val { font-family: 'JetBrains Mono'; font-weight: 800; font-size: clamp(20px,3vw,28px); color: ${T.ink}; }
        .timer-chip.danger .tc-val { color: ${T.danger}; }
        .timer-chip.success .tc-val { color: ${T.success}; }
        .tempt-btn { font-family: 'Manrope'; font-weight: 700; font-size: 13px; background: ${T.dangerSoft}; color: ${T.danger}; border: 1.5px dashed ${T.danger}88; border-radius: 12px; padding: 10px 15px; cursor: pointer; transition: all 0.18s; align-self: flex-start; }
        .tempt-btn:hover { background: ${T.danger}; color: #fff; border-style: solid; }

        /* 📱 TELEFON MOCK — foydalanuvchi ekrani (doim ko'rinadi) */
        .phone-mock { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .phone-body { position: relative; width: clamp(96px,14vw,128px); height: clamp(176px,24vw,232px); background: #16171B; border-radius: 22px; padding: 8px; box-shadow: 0 14px 30px -12px rgba(${T.shadowBase},0.4), inset 0 0 0 2px #2A2B31; }
        .phone-notch { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 34px; height: 5px; border-radius: 99px; background: #2A2B31; z-index: 2; }
        .phone-screen { position: relative; width: 100%; height: 100%; border-radius: 15px; overflow: hidden; background: ${T.bg}; }
        .phone-face { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; text-align: center; padding: 8px; opacity: 0; transition: opacity 0.5s ease; }
        .phone-face span:first-child { font-size: 26px; }
        .phone-face p { margin: 0; font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.ink}; }
        .phone-ok { font-family: 'JetBrains Mono'; font-size: 9px; font-weight: 700; }
        .phone-screen.old .old-face { opacity: 1; }
        .phone-screen.new .new-face { opacity: 1; }
        .phone-screen.broken .broken-face { opacity: 1; }
        .old-face .phone-ok { color: ${T.ink2}; }
        .new-face .phone-ok, .new-face span:first-child { color: ${T.success}; }
        .broken-face .phone-ok, .broken-face span:first-child { color: ${T.danger}; }
        .phone-lbl { font-family: 'Manrope'; font-weight: 600; font-size: 10.5px; color: ${T.ink3}; }

        /* 🧳 CHAMADON / BUYUM KARTALARI — s2, s5, s7, s9 markaziy o'yin */
        .cj-items { display: flex; flex-wrap: wrap; gap: 9px; }
        .itm-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; width: clamp(84px,15vw,104px); background: ${T.paper}; border: none; border-radius: 13px; padding: 11px 7px 9px; cursor: pointer; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.2); transition: all 0.16s; }
        .itm-card:hover:not(:disabled) { transform: translateY(-2px); }
        .itm-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -8px rgba(255,79,40,0.3); }
        .itm-card:disabled { cursor: not-allowed; opacity: 0.75; }
        .itm-ico { font-size: 20px; }
        .itm-nm { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 10.5px; color: ${T.ink}; text-align: center; }
        .itm-check { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border-radius: 50%; background: ${T.accent}; color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px -2px rgba(255,79,40,0.5); }
        .itm-fix { margin-top: 4px; font-family: 'Manrope'; font-weight: 700; font-size: 10px; background: ${T.successSoft}; color: ${T.success}; border: none; border-radius: 8px; padding: 3px 7px; cursor: pointer; }

        /* MUHIT/VARIANT KARTALARI (vcard) — s2 matrix, s11 staging, s13 builder ro'yxati */
        .vcard { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover:not(:disabled) { transform: translateY(-1px); }
        .vcard:disabled { cursor: default; }
        .vlbl { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .vseen { margin-left: auto; font-weight: 700; }
        .role-ico { font-size: 20px; flex-shrink: 0; }

        /* LENTA JURNALI — terminal-uslub log */
        .belt-log { background: ${CODE.bg}; border-radius: 12px; padding: 11px 13px; display: flex; flex-direction: column; gap: 3px; min-height: 54px; max-height: 200px; overflow-y: auto; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.22); }
        .belt-log-line { font-family: 'JetBrains Mono'; font-size: 12px; line-height: 1.7; color: ${CODE.text}; animation: el-pop 0.25s ease-out; white-space: pre-wrap; word-break: break-word; }
        .belt-log-line.ok { color: #7DD181; }
        .belt-log-line.bad { color: #FF8B7A; }
        .belt-log-line.skip { color: ${CODE.comment}; font-style: italic; }
        .belt-log-empty { font-family: 'JetBrains Mono'; font-size: 12px; color: ${CODE.comment}; font-style: italic; }

        /* YO'L XARITASI bo'shliqlari (s13 builder) */
        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .blank-group { display: flex; flex-direction: column; gap: 6px; }
        .blank-group .bg-lbl { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .blank-row { display: flex; flex-wrap: wrap; gap: 7px; }

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi. Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        .gchip.tap-hint, .btn-soft.tap-hint, .itm-card.tap-hint, .vcard.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }

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
          .pipe-step.run, .pipe-step.fail, .belt-log-line, .itm-card.tap-hint, .gchip.tap-hint, .btn-soft.tap-hint, .vcard.tap-hint,
          .dd-chip.in, .dd-slot.ok, .dd-slot.bad, .tempt-btn, .shake,
          .pipe-track::after, .pipe-step.run::after, .pipe-step[data-id="deploy"].pass .pipe-ico { animation: none !important; }
          .phone-face { transition: opacity 0.16s linear !important; }
        }

      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Professional lenta darsi', ru: 'Урок профессиональной ленты' }} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} live={live} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />
            </>
          )}
        </div>
      </LiveGateCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>
  );
}
