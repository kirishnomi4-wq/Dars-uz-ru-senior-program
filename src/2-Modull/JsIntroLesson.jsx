import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

// 11.1 standart — mentor avatar hostlangan rasm (lokal import EMAS: LMS'da assets papkasi yo'q)
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 07-DARS — JAVASCRIPT MODULIGA KIRISH: SISTEMA VA ALGORITM — PLATFORM STANDARD v16
// Mavzu: Sistema (inson tanasi: komponentlar + bog'lanishlar),
//        Algoritm = retsept (ertalabki tartib: ketma-ketlik, shart, sikl).
// Sof tushuncha — JS kodisiz. Keyingi darsda haqiqiy JavaScript yoziladi.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
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
const LIVE_POLL_MS = 2500, LIVE_POLL_MAX_MS = 15000, LIVE_HEARTBEAT_MS = 10000, LIVE_STALE_MS = 60000;
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
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/live_sessions?pin=eq.${encodeURIComponent(pin)}&select=lesson_id,max_screen,status,updated_at,quiz_state,quiz_q,quiz_started_at,reveal_screen`, { headers: _liveHdr });
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
  const keyRef = useRef(answerKey); keyRef.current = answerKey; // javob kaliti — mentor darsni ochganda serverga avto-yuklanadi (SQL shart emas)
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
        setMentorScreen(p => p === row.max_screen ? p : row.max_screen);
        setStatus(p => p === row.status ? p : row.status);
        syncQuiz(row);
        if (row.updated_at !== lastUpdatedRef.current) { lastUpdatedRef.current = row.updated_at; lastSeenRef.current = Date.now(); liveStore(lessonId, { mode: 'student', pin, lastScreen: row.max_screen, playerId: playerRef.current?.id, playerToken: playerRef.current?.token, nickname: nickRef.current }); }
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
    const id = setInterval(() => { liveRpc('session_heartbeat', { p_pin: pin, p_token: tokenRef.current }).catch(() => {}); }, LIVE_HEARTBEAT_MS);
    return () => { on = false; clearInterval(id); };
  }, [mode, pin, lessonId]); // eslint-disable-line

  const startMentor = useCallback(async (mentorCode) => {
    setBusy(true); setJoinError('');
    try {
      const res = await liveRpc('create_session', { p_lesson_id: lessonId, p_mentor_code: (mentorCode || '').trim() });
      const row = Array.isArray(res) ? res[0] : res;
      if (!row?.pin) throw new Error('no pin');
      tokenRef.current = row.token; setPin(row.pin); setMode('mentor'); setEnded(false);
      liveStore(lessonId, { mode: 'mentor', pin: row.pin, token: row.token });
      // Javob kalitini serverga avto-yuklash (mentor-kod bilan) — bu dars uchun endi kalit SQL SHART EMAS
      if (keyRef.current) liveRpc('set_quiz_keys', { p_lesson_id: lessonId, p_mentor_code: (mentorCode || '').trim(), p_keys: keyRef.current }).catch(() => {});
    } catch { setJoinError(tr({ uz: "Mentor kodi noto'g'ri yoki ulanishda xato.", ru: 'Код ментора неверный или ошибка соединения.' })); }
    finally { setBusy(false); }
  }, [lessonId]);

  const joinStudent = useCallback(async (raw, rawNick) => {
    const p = (raw || '').replace(/\D/g, '');
    const nick = (rawNick || '').trim();
    if (p.length < 4) { setJoinError(tr({ uz: "Kodni to'liq kiriting.", ru: 'Введите код полностью.' })); return; }
    if (nick.length < 2) { setJoinError(tr({ uz: 'Ismingizni kiriting (kamida 2 harf).', ru: 'Введите ваше имя (минимум 2 буквы).' })); return; }
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
      setPin(p); setMentorScreen(row.max_screen); setStatus(row.status); setMode('student');
      liveStore(lessonId, { mode: 'student', pin: p, lastScreen: row.max_screen, playerId: player.player_id, playerToken: player.token, nickname: nick });
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

  return { mode, pin, mentorScreen, status, mentorAlive, connected, ended, joinError, busy, startMentor, joinStudent, selfStudy, reportScreen, endSession, submitAnswer, quiz, quizControl, revealScreen, mentorReveal, playerId: playerRef.current?.id || null, nickname: nickRef.current };
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

function LiveGate({ live, title }) {
  title = title || tr({ uz: 'Jonli dars', ru: 'Живой урок' });
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
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{title}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Присоединиться к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и своё имя.' })}</p></div>
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
    if (!live.connected) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot('#FFD380')} /> {tr({ uz: '🔄 Qayta ulanmoqda…', ru: '🔄 Переподключаемся…' })}</div>;
    return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.success)} /> {tr({ uz: '👨‍🏫 Mentor:', ru: '👨‍🏫 Ментор:' })} {Math.min(live.mentorScreen + 1, total)} / {total}{live.nickname && <span style={{ color: LT.ink3 }}>· {live.nickname}</span>}</div>;
  }
  return null;
}

const LangContext = createContext('uz');
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
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

const LESSON_META = { lessonId: 'js-intro-01-v18', lessonTitle: { uz: 'Sistema va Algoritm', ru: 'Система и алгоритм' } };
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
  { id: 's15', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's15b', type: 'stats',      template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcard', template: 'custom',  scored: false, scope: null },
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// ===== 🏅 ACHIEVEMENTS (nishonlar) — dars davomidagi real bosqichlar uchun =====
const ACHIEVEMENTS = {
  scout:     { icon: '🔍', name: 'System Scout',  desc: { uz: "Atrofdagi sistemani tanidingiz", ru: 'Вы распознали систему вокруг себя' } },
  recipe:    { icon: '📋', name: 'Recipe Master', desc: { uz: "Algoritm — retseptni o'zlashtirdingiz", ru: 'Вы освоили алгоритм — рецепт' } },
  bughunter: { icon: '🐞', name: 'Bug Hunter',    desc: { uz: 'Chalkash dasturni tuzatib RUN qildingiz', ru: 'Вы починили запутанную программу и нажали RUN' } },
  graduate:  { icon: '🏆', name: 'Level Up!',     desc: { uz: "Sistema va algoritm darsini to'liq yakunladingiz", ru: 'Вы полностью прошли урок о системе и алгоритме' } },
};
// Ekran id → nishon (recordAnswer'da avtomatik beriladi — FAQAT scored+correct ekranga)
const ACH_TRIGGERS = { s4: 'scout', s9: 'recipe', s15: 'bughunter' };

const Split = ({ children }) => <div className="split">{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

// 🏅 Badges hisoblagichi (Stage chrome'ida) — bosilganda kolleksiya ochiladi
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

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768); // mobil: Mentor yig'ilish rejimi
  const collapseOn = isNarrow && !mentorStatic; // ba'zi sahifalarda Mentor yig'ilmaydi
  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px konteyner + 60px padding
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
  label = label || tr({ uz: 'Davom etish', ru: 'Продолжить' });
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked); // jonli darsda mentordan oldinga o'tib bo'lmaydi
  // optionalLive: animatsiya-mashq sahifalari. Jonli dars DAVOMIDA (o'quvchi hali ozod
  // qilinmagan) bajarish majburiy emas — mentor proyektorda ko'rsatadi, o'quvchi orqada
  // qolmasin. Erkin rejimda (ended / mentor uzilgan / self) yana MAJBURIY bo'ladi.
  // Testlar va s15 (yakuniy amaliy) optionalLive bermaydi — doim majburiy.
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : label)}</button>;
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
// RECAPS kontenti — har scored MC test uchun «Qayta tushuntirish» kartalari (s4, s5b, s9, s12)
const RECAPS = {
  4: {
    title: { uz: "Sistema nima?", ru: 'Что такое система?' },
    cards: [
      { ic: "🧩", h: { uz: "Sistema — birga ishlovchi qismlar", ru: 'Система — части, работающие вместе' },
        body: { uz: <>Sistema — bu <b>birga ishlaydigan komponentlar</b> va ularning <b>bog'lanishlari</b>. Bitta yaxlit narsa emas, aksincha ko'p qismning jamoasi.</>, ru: <>Система — это <b>компоненты, работающие вместе</b>, и их <b>связи</b>. Это не один цельный предмет, а команда из многих частей.</> },
        vis: <RcFlow items={[{ uz: "🫀 yurak", ru: '🫀 сердце' }, { uz: "🫁 o'pka", ru: '🫁 лёгкие' }, { uz: "🩸 qon", ru: '🩸 кровь' }]} sep="+" />,
        ask: { uz: "Sinfimiz sistema bo'la oladimi? Qaysi qismlardan iborat?", ru: 'Может ли наш класс быть системой? Из каких частей он состоит?' } },
      { ic: "🚗", h: { uz: "Bir qism yetmaydi", ru: 'Одной части мало' },
        body: { uz: <>Faqat <b>bitta g'ildirak</b> mashina emas. Mashina bo'lishi uchun dvigatel, g'ildirak, rul — hammasi <b>birga</b> ishlashi kerak.</>, ru: <>Одно <b>колесо</b> — это ещё не машина. Чтобы получилась машина, двигатель, колёса и руль должны работать <b>вместе</b>.</> },
        vis: <RcFlow items={[{ uz: "😕 bitta g'ildirak", ru: '😕 одно колесо' }, { uz: "🔧 hamma qism birga", ru: '🔧 все части вместе' }, { uz: "🚗 mashina", ru: '🚗 машина' }]} /> },
      { ic: "🎯", h: { uz: "Umumiy maqsad uchun", ru: 'Ради общей цели' },
        body: { uz: <>Sistemaning qismlari <b>tasodifiy</b> emas — ular <b>bitta maqsad</b> uchun birlashgan. Inson tanasi yashash uchun, mashina yurish uchun.</>, ru: <>Части системы собраны <b>не случайно</b> — их объединяет <b>одна цель</b>. Тело человека — чтобы жить, машина — чтобы ехать.</> } },
    ]
  },
  6: {
    title: { uz: "Bog'lanish nima?", ru: 'Что такое связь?' },
    cards: [
      { ic: "🔗", h: { uz: "Bog'lanish — qismlar orasidagi yo'l", ru: 'Связь — путь между частями' },
        body: { uz: <>Bog'lanish — bu qismlar <b>bir-biriga ta'sir o'tkazadigan yo'l</b>. U eng katta qism ham, sistemaning nomi ham emas.</>, ru: <>Связь — это <b>путь, по которому части влияют друг на друга</b>. Это не самая большая часть и не название системы.</> },
        vis: <RcFlow items={[{ uz: "🫀 yurak", ru: '🫀 сердце' }, { uz: "🩸 qon yuboradi", ru: '🩸 гонит кровь' }, { uz: "🫁 o'pka", ru: '🫁 лёгкие' }]} />,
        ask: { uz: "Uyda svet va vaklyuchatel orasida qanday bog'lanish bor?", ru: 'Какая связь дома между лампочкой и выключателем?' } },
      { ic: "🚦", h: { uz: "Ta'sir bir qismdan ikkinchisiga o'tadi", ru: 'Действие переходит от части к части' },
        body: { uz: <>Yurak <b>qon haydaydi</b>, qon o'pkaga <b>kislorod</b> uchun boradi. Bir qismning ishi ikkinchisiga <b>o'tib</b> ketadi — mana bu bog'lanish.</>, ru: <>Сердце <b>гонит кровь</b>, кровь идёт в лёгкие за <b>кислородом</b>. Работа одной части <b>передаётся</b> другой — вот это и есть связь.</> },
        vis: <RcFlow items={[{ uz: "👆 bosdim", ru: '👆 нажал' }, { uz: "⚡ tok o'tdi", ru: '⚡ ток прошёл' }, { uz: "💡 chiroq yondi", ru: '💡 лампа загорелась' }]} /> },
      { ic: "🎯", h: { uz: "Bog'lanishsiz — sistema emas", ru: 'Без связей — не система' },
        body: { uz: <>Agar qismlar <b>bir-biriga ta'sir qilmasa</b>, ular shunchaki alohida narsalar. Aynan bog'lanishlar ularni <b>bitta sistema</b> qiladi.</>, ru: <>Если части <b>не влияют друг на друга</b>, это просто отдельные предметы. Именно связи делают их <b>одной системой</b>.</> } },
    ]
  },
  10: {
    title: { uz: "Shart (agar...bo'lsa)", ru: 'Условие (если... то)' },
    cards: [
      { ic: "🌦️", h: { uz: "Shart — tanlov qadami", ru: 'Условие — шаг выбора' },
        body: { uz: <>«AGAR yomg'ir bo'lsa, soyabon ol» — bu <b>shart</b>. Bir narsa <b>rost bo'lsa</b> — bir ish qilamiz, bo'lmasa — qilmaymiz.</>, ru: <>«ЕСЛИ идёт дождь — возьми зонт» — это <b>условие</b>. Если что-то <b>верно</b> — делаем одно, если нет — не делаем.</> },
        vis: <RcFlow items={[{ uz: "🌧️ yomg'ir bormi?", ru: '🌧️ идёт дождь?' }, { uz: "☂️ ha → soyabon", ru: '☂️ да → зонт' }, { uz: "😎 yo'q → olmaymiz", ru: '😎 нет → не берём' }]} />,
        ask: { uz: "Kunlik hayotdan yana bitta «agar...bo'lsa» misolini kim aytadi?", ru: 'Кто назовёт ещё один пример «если... то» из повседневной жизни?' } },
      { ic: "🚦", h: { uz: "Sikldan farqi", ru: 'Чем отличается от цикла' },
        body: { uz: <>Shart <b>bir marta</b> tekshiradi va yo'l tanlaydi. Sikl esa bir ishni <b>ko'p marta takrorlaydi</b> — bular boshqa-boshqa narsa.</>, ru: <>Условие проверяет <b>один раз</b> и выбирает путь. А цикл <b>повторяет действие много раз</b> — это разные вещи.</> },
        vis: <RcFlow items={[{ uz: "🚦 yashil bo'lsa → yur", ru: '🚦 зелёный → иди' }, { uz: "🔴 qizil bo'lsa → to'xta", ru: '🔴 красный → стой' }]} sep="·" /> },
      { ic: "🎯", h: { uz: "«bo'lsa» so'ziga qara", ru: 'Ищите слово «если»' },
        body: { uz: <>Gapda <b>«agar... bo'lsa»</b> bo'lsa — bu deyarli har doim <b>shart</b>. U qadamni holatga qarab tanlaydi.</>, ru: <>Если во фразе есть <b>«если... то»</b> — это почти всегда <b>условие</b>. Оно выбирает шаг в зависимости от ситуации.</> } },
    ]
  },
  13: {
    title: { uz: "Sikl (takrorlash)", ru: 'Цикл (повторение)' },
    cards: [
      { ic: "🔁", h: { uz: "Sikl — takrorlash qadami", ru: 'Цикл — шаг повторения' },
        body: { uz: <>Bir xil amalni <b>ko'p marta</b> takrorlash uchun <b>sikl</b> ishlatamiz. Har safar qaytadan yozib o'tirmaymiz.</>, ru: <>Чтобы повторить одно действие <b>много раз</b>, используем <b>цикл</b>. Не пишем его заново каждый раз.</> },
        vis: <RcFlow items={[{ uz: "🪜 zina 1", ru: '🪜 ступенька 1' }, { uz: "🪜 zina 2", ru: '🪜 ступенька 2' }, { uz: "🪜 zina 3", ru: '🪜 ступенька 3' }, { uz: "🔁 takror", ru: '🔁 повтор' }]} />,
        ask: { uz: "Tishni yuvishda cho'tkani necha marta yuqoriga-pastga yuritamiz — bu sikls mi?", ru: 'Сколько раз мы водим щёткой вверх-вниз, когда чистим зубы, — это цикл?' } },
      { ic: "🏃", h: { uz: "Misol: 10 marta o'tir-tur", ru: 'Пример: 10 приседаний' },
        body: { uz: <>«10 marta o'tir-tur qil» — bu <b>sikl</b>. Bitta harakat <b>10 marta qaytariladi</b>. Shartdan farqi: sikl takrorlaydi, shart tanlaydi.</>, ru: <>«Присядь 10 раз» — это <b>цикл</b>. Одно движение <b>повторяется 10 раз</b>. Отличие от условия: цикл повторяет, условие выбирает.</> },
        vis: <RcFlow items={["1", "2", "3", "…", "10"]} sep="·" /> },
      { ic: "🎯", h: { uz: "«ko'p marta» = sikl", ru: '«много раз» = цикл' },
        body: { uz: <>Agar bir ish <b>bir necha marta qaytarilsa</b> — bu sikl. «takror», «har safar», «necha marta» so'zlari sikldan darak beradi.</>, ru: <>Если действие повторяется <b>несколько раз</b> — это цикл. Слова «повтори», «каждый раз», «сколько раз» указывают на цикл.</> } },
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
        <span className="rc-tag">{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Объясняем ещё раз' })}</span>
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
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Назад' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}${tr({ uz: '-karta', ru: '-я карточка' })}`} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: '✓ Tushunarli — davom etamiz', ru: '✓ Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Дальше →' })}</button>}
      </div>
    </div>
  );
}

// Kod-bo'laklarni (`teg`, AGAR, TAKRORLA) chip qilib ko'rsatadi — backtick orasidagi matn .qcode chip bo'ladi
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

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
  // serverdagi eskirishi mumkin bo'lgan `a.correct` boolean'iga tayanmaymiz — aks holda
  // pastdagi ustun «to'g'ri javobda 1 o'quvchi», yuqoridagi sanoq esa «1 xato» deb zid chiqadi.
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
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ожидаем ⏳' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi 📨', ru: 'ответили 📨' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ожидаем ⏳' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и счёт ✅/❌ скрыты — при нажатии «Открыть результат» всё появится сразу и у вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — класс не понял эту тему. Перед тем как идти дальше, лучше коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Объяснить ещё раз' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. Если хотите, коротко повторите перед тем, как идти дальше.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс усвоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответов пока мало ({answered}) — по проценту трудно судить. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Объяснить ещё раз' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>
        );
      })()}
      {waiting.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr({ uz: '⏳ Kutilmoqda:', ru: '⏳ Ожидаем:' })}</span>
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблись — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз.' })}</p>}
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
      {doneN === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar yozib tugatishi bilan shu yerda ✓ belgisi chiqadi…", ru: 'Как только ученики закончат писать, здесь появится значок ✓…' })}</p>}
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
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || live.mentorScreen > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed; // javob qotdi — natija mentordan kutilmoqda
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, думайте перед нажатием!' })}</p>}
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
              ? fmtCode(`${tr({ uz: "✓ To'g'ri javob:", ru: '✓ Правильный ответ:' })} ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`)
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? fmtCode(`${tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`)
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? explainCorrect
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Скоро вы узнаете правильный ответ.' })
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> {tr({ uz: "· ko'rsatmani ochish ▾", ru: '· открыть подсказку ▾' })}</span>}</span>
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

// ===== SCREEN 0 — HOOK (inson tanasi sistema) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const audio = useAudio([{ id: 's0', text: `Yugurib ketayotganingizni tasavvur qiling. Faqat oyoq ishlayaptimi? Yo'q — yurak tezroq uradi, nafas tezlashadi, miya har bir qadamni boshqaradi. Hammasi bir vaqtda, siz buyurmasdan ham. Bu qanday bo'ladi? "Yugur" tugmasini bosib ko'ring.`, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [view, setView] = useState('rest');
  const ORGANS = [{ ic: '🧠', n: tr({ uz: 'Miya', ru: 'Мозг' }) }, { ic: '🫁', n: tr({ uz: "O'pka", ru: 'Лёгкие' }) }, { ic: '🫀', n: tr({ uz: 'Yurak', ru: 'Сердце' }) }, { ic: '💪', n: tr({ uz: 'Mushaklar', ru: 'Мышцы' }) }];
  const OPTS = [
    { id: 'a', label: tr({ uz: 'Faqat oyoq mushaklari ishlaydi', ru: 'Работают только мышцы ног' }) },
    { id: 'b', label: tr({ uz: "Ko'p a'zo birgalikda ishlaydi", ru: 'Много органов работают вместе' }) },
    { id: 'c', label: tr({ uz: "Hech qanday sa'y-harakatsiz", ru: 'Вообще без каких-либо усилий' }) }
  ];
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); audio.triggerEvent('option_picked'); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 760 }}>{tr({ uz: <>Yugurganda tanangizda <span className="italic" style={{ color: T.accent }}>faqat oyoq</span> ishlaydimi?</>, ru: <>Когда вы бежите, в теле работают <span className="italic" style={{ color: T.accent }}>только ноги</span>?</> })}</h1>
        <Mentor>{tr({ uz: <>Yugurib ketayotganingizni tasavvur qiling. Faqat oyoq ishlayaptimi? Yo'q — yurak tezroq uradi, nafas tezlashadi, miya har bir qadamni boshqaradi. Hammasi bir vaqtda, <b style={{ color: T.ink }}>siz buyurmasdan ham</b>. Bu qanday bo'ladi? <b style={{ color: T.ink }}>"Yugur"</b> tugmasini bosib ko'ring.</>, ru: <>Представьте, что вы бежите. Работают только ноги? Нет — сердце бьётся быстрее, дыхание ускоряется, мозг управляет каждым шагом. Всё одновременно, <b style={{ color: T.ink }}>даже без вашей команды</b>. Как так получается? Нажмите кнопку <b style={{ color: T.ink }}>«Беги»</b> и посмотрите.</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${view === 'rest' ? 'chip-on' : ''}`} onClick={() => setView('rest')}>{tr({ uz: '🧍 Tinch', ru: '🧍 Покой' })}</button>
              <button className={`chip ${view === 'run' ? 'chip-on' : ''}`} onClick={() => setView('run')}>{tr({ uz: '🏃 Yugur', ru: '🏃 Беги' })}</button>
            </div>
            <div className="demo-swap" key={view} style={{ background: T.paper, borderRadius: 14, padding: '18px 16px', boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.14)` }}>
              <p className="flow-label" style={{ marginBottom: 12 }}>{view === 'run' ? tr({ uz: "🏃 Yugurmoqda — a'zolar birga ishlayapti", ru: '🏃 Бежит — органы работают вместе' }) : tr({ uz: '🧍 Tinch holatda', ru: '🧍 В состоянии покоя' })}</p>
              <div className="bpm-row">
                <span className="bpm-heart" style={{ animationDuration: view === 'run' ? '0.42s' : '1s' }}>❤️</span>
                <div className="bpm-info">
                  <span className="bpm-num" style={{ color: view === 'run' ? T.accent : T.ink2 }}>{view === 'run' ? '140' : '72'}</span>
                  <span className="bpm-unit">{tr({ uz: 'zarba / daqiqa', ru: 'ударов / мин' })}</span>
                </div>
                <div className="eq">
                  {[0, 1, 2, 3, 4].map(i => (<span key={i} className="eq-bar" style={{ animationDuration: view === 'run' ? '0.5s' : '1.4s', animationDelay: `${i * 0.08}s`, opacity: view === 'run' ? 1 : 0.45 }} />))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {ORGANS.map((o, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 10, background: view === 'run' ? T.accentSoft : T.bg, boxShadow: view === 'run' ? '0 6px 16px -5px rgba(255,79,40,0.4)' : 'none', transition: 'all 0.3s' }}>
                    <span style={{ fontSize: 22, animation: view === 'run' ? `dl-pulse 0.7s ease-in-out infinite ${i * 0.12}s` : 'none', display: 'inline-block' }}>{o.ic}</span>
                    <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13, color: view === 'run' ? T.accent : T.ink2 }}>{o.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Sizningcha, nega yugura olasiz?', ru: 'Как думаете, почему вы можете бежать?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (
                  <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span>
                    <span>{o.label}</span>
                  </button>
                );
              })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>To'g'ri! Tana — bu <b>sistema</b>: ko'p a'zo birga ishlaydi. Bugun shuni o'rganamiz.</>, ru: <>Верно! Тело — это <b>система</b>: много органов работают вместе. Сегодня мы это и изучим.</> })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's1', text: `Sizga bir sirni aytaman: dasturchilar kod yozishdan oldin boshqacha fikrlaydi. Ularning butun ishi ikkita asosiy tushunchaga — ya'ni 2 ta muhim fikrga — tayanadi: sistema va algoritm. Bugun aynan shu ikkalasini, birma-bir va oddiy misollar bilan o'rganamiz, 5 ta qadamda. Keyin esa — haqiqiy JavaScript.`, trigger: 'on_mount', waits_for: null }]);
  const STEPS = [
    { text: tr({ uz: 'Sistema nima? — komponentlar', ru: 'Что такое система? — компоненты' }), tag: '' },
    { text: tr({ uz: "Bog'lanishlar — qismlar qanday ulanadi", ru: 'Связи — как части соединяются' }), tag: '' },
    { text: tr({ uz: 'Algoritm = retsept', ru: 'Алгоритм = рецепт' }), tag: '' },
    { text: tr({ uz: 'Shart va sikl', ru: 'Условие и цикл' }), tag: tr({ uz: 'agar · takrorla', ru: 'если · повтори' }) },
    { text: tr({ uz: "O'z algoritmingni tuz", ru: 'Составь свой алгоритм' }), tag: '' }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 2 ta asosiy tushuncha', ru: 'Сегодня 2 главные идеи' })}</p>
      <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="frame" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
          <span className="idea-ic idea-ic-sys">🧩</span>
          <div><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, color: T.ink, margin: 0, fontSize: 'clamp(16px,2.2vw,19px)' }}>{tr({ uz: 'SISTEMA', ru: 'СИСТЕМА' })}</p><p className="body" style={{ margin: '2px 0 0', color: T.ink2 }}>{tr({ uz: "Birga ishlaydigan qismlar + bog'lanishlar", ru: 'Части, работающие вместе, + связи' })}</p></div>
        </div>
        <div className="frame" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
          <span className="idea-ic idea-ic-algo">📋</span>
          <div><p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, color: T.ink, margin: 0, fontSize: 'clamp(16px,2.2vw,19px)' }}>{tr({ uz: 'ALGORITM', ru: 'АЛГОРИТМ' })}</p><p className="body" style={{ margin: '2px 0 0', color: T.ink2 }}>{tr({ uz: 'Retsept: ketma-ketlik, shart, sikl', ru: 'Рецепт: последовательность, условие, цикл' })}</p></div>
        </div>
      </div>
      <p className="mono small" style={{ color: T.accent, margin: 0 }}>{tr({ uz: "→ keyingi darsda buni JavaScript'da yozamiz", ru: '→ на следующем уроке напишем это на JavaScript' })}</p>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: '5 qadam', ru: '5 шагов' })}</p>
      <ol className="roadmap">
        {STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{s.text}</span>{s.tag && <span className="step-tag">{s.tag}</span>}</span></li>))}
      </ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head">
          <h2 className="title h-title fade-up"><span className="italic" style={{ color: T.accent }}>{tr({ uz: "Bugun dasturchidek fikrlashni o'rganamiz!", ru: 'Сегодня учимся думать как программист!' })}</span></h2>
        </div>
        <Mentor>{tr({ uz: <>Sizga bir sirni aytaman: dasturchilar kod yozishdan oldin boshqacha <b style={{ color: T.ink }}>fikrlaydi</b>. Ularning butun ishi ikkita asosiy <b style={{ color: T.ink }}>tushunchaga</b> — ya'ni 2 ta muhim fikrga — tayanadi: <b style={{ color: T.ink }}>sistema</b> va <b style={{ color: T.ink }}>algoritm</b>. Bugun aynan shu ikkalasini <b style={{ color: T.ink }}>birma-bir</b>, oddiy misollar bilan o'rganamiz. Keyin esa — haqiqiy <b style={{ color: T.ink }}>JavaScript</b>.</>, ru: <>Открою вам секрет: программисты ещё до написания кода <b style={{ color: T.ink }}>думают</b> по-особенному. Вся их работа держится на двух главных <b style={{ color: T.ink }}>идеях</b>: <b style={{ color: T.ink }}>система</b> и <b style={{ color: T.ink }}>алгоритм</b>. Сегодня разберём их <b style={{ color: T.ink }}>по очереди</b>, на простых примерах. А потом — настоящий <b style={{ color: T.ink }}>JavaScript</b>.</> })}</Mentor>
        {!isNarrow ? (
          <Zoomable><Split>{PreviewBlock}{StepsBlock}</Split></Zoomable>
        ) : !showSteps ? (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            {PreviewBlock}
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "📋 Bugungi 5 qadamni ko'rish", ru: '📋 Посмотреть 5 шагов на сегодня' })}</button>
          </div>
        ) : (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ G'oyalarni ko'rish", ru: '↩ Вернуться к идеям' })}</button>
            {StepsBlock}
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — SISTEMA = KOMPONENTLAR =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's2', text: `Tanangizni bir butun deb o'ylaysiz, to'g'rimi? Aslida u ko'plab qismdan — komponentdan iborat, va har biri o'z ishini bajaradi: miya boshqaradi, yurak qon haydaydi, o'pka kislorod oladi. Har bir a'zoni bosib, vazifasini bilib oling.`, trigger: 'on_mount', waits_for: null }]);
  const PARTS = {
    miya: { ic: '🧠', name: tr({ uz: 'Miya', ru: 'Мозг' }), role: tr({ uz: "Boshqaruv markazi — barcha a'zolarga buyruq beradi.", ru: 'Центр управления — отдаёт команды всем органам.' }) },
    yurak: { ic: '🫀', name: tr({ uz: 'Yurak', ru: 'Сердце' }), role: tr({ uz: 'Nasos — qonni butun tanaga haydaydi.', ru: 'Насос — гонит кровь по всему телу.' }) },
    opka: { ic: '🫁', name: tr({ uz: "O'pka", ru: 'Лёгкие' }), role: tr({ uz: 'Havodan kislorod oladi va qonga beradi.', ru: 'Берут кислород из воздуха и отдают его крови.' }) },
    mushak: { ic: '💪', name: tr({ uz: 'Mushaklar', ru: 'Мышцы' }), role: tr({ uz: "Harakatni bajaradi — yuradi, ko'taradi, yuguradi.", ru: 'Выполняют движение — ходят, поднимают, бегут.' }) }
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size === 4;
  const tap = (k) => { setActive(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Sistema', ru: 'Система' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${seen.size}/4 ${tr({ uz: "a'zo ko'rilgan", ru: 'органа изучено' })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tana <span className="italic" style={{ color: T.accent }}>nimalardan</span> tuzilgan?</>, ru: <>Из чего <span className="italic" style={{ color: T.accent }}>состоит</span> тело?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Tanangizni bir butun deb o'ylaysiz, to'g'rimi? Aslida u ko'plab <b style={{ color: T.ink }}>qismdan (komponentdan)</b> iborat, va har biri o'z ishini bajaradi: miya boshqaradi, yurak qon haydaydi, o'pka kislorod oladi. Har bir a'zoni bosib, vazifasini bilib oling.</>, ru: <>Вы думаете о теле как о едином целом, верно? На самом деле оно состоит из множества <b style={{ color: T.ink }}>частей (компонентов)</b>, и каждая делает свою работу: мозг управляет, сердце гонит кровь, лёгкие берут кислород. Нажмите на каждый орган и узнайте его задачу.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Komponentlar (a'zolar)", ru: 'Компоненты (органы)' })}</p>
            <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {Object.keys(PARTS).map(k => (
                <button key={k} onClick={() => tap(k)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', border: 'none', borderRadius: 14, padding: '16px 10px', background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: 'all 0.18s' }}>
                  <span style={{ fontSize: 30 }}>{PARTS[k].ic}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 13, color: T.ink }}>{PARTS[k].name}</span>
                  {seen.has(k) && <span style={{ color: T.success, fontSize: 12 }}>✓</span>}
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {active ? (
              <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span style={{ fontSize: 26 }}>{PARTS[active].ic}</span><span className="sk-wordbadge">{PARTS[active].name}</span></span>
                <p className="body" style={{ color: T.ink, margin: '11px 0 0' }}>{PARTS[active].role}</p>
              </div>
            ) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Bir a'zoni bosing", ru: 'Нажмите на любой орган' })}</p></div> : null)}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Mana shu — <b>komponentlar</b>. Har biri alohida ishni bajaradi, lekin birga — bitta sistema. Endi ko'ramiz: ular qanday <b>bog'lanadi</b>?</>, ru: <>✓ Вот это — <b>компоненты</b>. Каждый делает свою работу, но вместе они — одна система. Теперь посмотрим: как они <b>связаны</b>?</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — BOG'LANISHLAR =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's3', text: `Komponentlar yolg'iz hech nima qila olmaydi — ular bir-biriga bog'langan. Miya mushakka "qimirla" degan signalni nerv orqali jo'natadi. Lekin shu bog'lanish uzilib qolsa-chi? Tugmani bosib, o'z ko'zingiz bilan ko'ring.`, trigger: 'on_mount', waits_for: null }]);
  const [broken, setBroken] = useState(false);
  const [touched, setTouched] = useState(false);
  const done = touched;
  const toggle = () => { setBroken(b => !b); setTouched(true); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: "Bog'lanishlar", ru: 'Связи' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Bog'lanishni sinab ko'ring", ru: 'Проверьте связь' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qismlar bir-biriga <span className="italic" style={{ color: T.accent }}>qanday</span> ulanadi?</>, ru: <>Как части <span className="italic" style={{ color: T.accent }}>соединяются</span> друг с другом?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Komponentlar yolg'iz hech nima qila olmaydi — ular bir-biriga <b style={{ color: T.ink }}>bog'langan</b>. Miya mushakka "qimirla" signalini <b style={{ color: T.ink }}>nerv</b> orqali jo'natadi. Lekin shu bog'lanish uzilib qolsa-chi? Tugmani bosib, o'z ko'zingiz bilan ko'ring.</>, ru: <>Поодиночке компоненты ничего не могут — они <b style={{ color: T.ink }}>связаны</b> друг с другом. Мозг посылает мышце сигнал «двигайся» через <b style={{ color: T.ink }}>нерв</b>. А если эта связь оборвётся? Нажмите кнопку и посмотрите своими глазами.</> })}</Mentor>
        <Zoomable>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="conn-flow fade-up delay-1">
          <div className="conn-node"><span style={{ fontSize: 34 }}>🧠</span><span className="conn-lbl">{tr({ uz: 'Miya', ru: 'Мозг' })}</span><span className="conn-sub">{tr({ uz: 'buyruq beradi', ru: 'отдаёт команду' })}</span></div>
          <div className={`conn-link ${broken ? 'cut' : ''}`}>
            <span className="conn-line" />
            <span className="conn-sig">{broken ? '✂️' : '⚡'}</span>
            <span className="conn-line" />
          </div>
          <div className="conn-node" style={{ opacity: broken ? 0.45 : 1 }}><span style={{ fontSize: 34 }}>{broken ? '😴' : '💪'}</span><span className="conn-lbl">{tr({ uz: 'Mushak', ru: 'Мышца' })}</span><span className="conn-sub">{broken ? tr({ uz: 'buyruq yetmadi', ru: 'команда не дошла' }) : tr({ uz: 'harakatlanadi', ru: 'двигается' })}</span></div>
        </div>
        <button className="btn" onClick={toggle} style={{ alignSelf: 'flex-start' }}>{broken ? tr({ uz: "🔗 Bog'lanishni ulash", ru: '🔗 Восстановить связь' }) : tr({ uz: "✂️ Bog'lanishni uzish", ru: '✂️ Разорвать связь' })}</button>
        {done && (
          broken
            ? <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bog'lanish uzildi — signal mushakka <b>yetib bormadi</b>, harakat yo'q. Demak sistemada bog'lanish ham komponent kabi muhim!</>, ru: <>Связь оборвалась — сигнал <b>не дошёл</b> до мышцы, движения нет. Значит, связь в системе так же важна, как и компонент!</> })}</p></div>
            : <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ <b>Bog'lanish</b> — qismlar bir-biriga ta'sir o'tkazadigan yo'l. U bo'lmasa, komponentlar yakka qoladi va sistema ishlamaydi.</>, ru: <>✓ <b>Связь</b> — путь, по которому части влияют друг на друга. Без неё компоненты остаются поодиночке, и система не работает.</> })}</p></div>
        )}
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    audioText="Sistema nima? To'g'ri variantni tanlang."
    questionText="Sistema nima?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Sistema nima?', ru: 'Что такое система?' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: 'Sistema nima?', ru: 'Что такое система?' })}</h2></>}
    options={[tr({ uz: "Bo'linmaydigan, ichki qismlari yo'q yaxlit bir narsa", ru: 'Неделимый цельный предмет без внутренних частей' }), tr({ uz: "Birga ishlaydigan komponentlar va ularning bog'lanishlari", ru: 'Компоненты, работающие вместе, и их связи' }), tr({ uz: "Bir-biriga hech qanday aloqasi yo'q tasodifiy narsalar", ru: 'Случайные предметы, никак не связанные между собой' }), tr({ uz: 'Faqat kompyuterga tegishli, boshqa hech narsa emas', ru: 'Что-то только про компьютеры и больше ни про что' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! Sistema — birga ishlaydigan komponentlar (qismlar) va ular orasidagi bog'lanishlardir. Inson tanasi shunga misol.", ru: 'Верно! Система — это компоненты (части), работающие вместе, и связи между ними. Тело человека — отличный пример.' })}
    explainWrong={{ 0: tr({ uz: "Yo'q — sistema aynan ko'p qismdan iborat, bitta bo'linmas narsa emas.", ru: 'Нет — система как раз состоит из многих частей, это не один неделимый предмет.' }), 2: tr({ uz: "Yo'q — sistemadagi qismlar tasodifiy emas, ular birga, maqsad bilan ishlaydi.", ru: 'Нет — части системы не случайны, они работают вместе, ради цели.' }), 3: tr({ uz: "Yo'q — kompyuter ham sistema, lekin sistema faqat kompyuter degani emas. Tana, jamoa ham sistema.", ru: 'Нет — компьютер тоже система, но система — это не только компьютер. Тело и команда — тоже системы.' }), default: tr({ uz: "Sistema — komponentlar va ularning bog'lanishlari.", ru: 'Система — это компоненты и их связи.' }) }} />
);

// ===== SCREEN 5 — ATROFDAGI SISTEMALAR =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's5', text: `Bir marta payqang — endi sistemani hamma joyda ko'ra boshlaysiz. Futbol jamoasi, tanangiz, hatto o'zingiz yasagan sayt ham — bari sistema. Har birini bosib, qismlari va bog'lanishini toping.`, trigger: 'on_mount', waits_for: null }]);
  const EX = {
    tana: { ic: '🫀', title: tr({ uz: 'Inson tanasi', ru: 'Тело человека' }), parts: [tr({ uz: 'miya', ru: 'мозг' }), tr({ uz: 'yurak', ru: 'сердце' }), tr({ uz: "o'pka", ru: 'лёгкие' }), tr({ uz: 'mushaklar', ru: 'мышцы' })], conn: tr({ uz: 'qon tomir va nervlar', ru: 'сосуды и нервы' }), note: tr({ uz: "Bir a'zo to'xtasa, butun tana qiynaladi.", ru: 'Если один орган остановится, страдает всё тело.' }) },
    jamoa: { ic: '⚽', title: tr({ uz: 'Futbol jamoasi', ru: 'Футбольная команда' }), parts: [tr({ uz: "o'yinchilar", ru: 'игроки' }), tr({ uz: 'darvozabon', ru: 'вратарь' }), tr({ uz: 'murabbiy', ru: 'тренер' })], conn: tr({ uz: 'paslar va kelishuv', ru: 'пасы и взаимопонимание' }), note: tr({ uz: "Paslar yo'q bo'lsa, jamoa o'yin qura olmaydi.", ru: 'Без пасов команда не сможет построить игру.' }) },
    sayt: { ic: '🌐', title: tr({ uz: 'Veb-sayt', ru: 'Веб-сайт' }), parts: [tr({ uz: 'brauzer', ru: 'браузер' }), tr({ uz: 'server', ru: 'сервер' }), 'HTML', 'CSS'], conn: tr({ uz: "internet so'rovlari", ru: 'интернет-запросы' }), note: tr({ uz: "Internet darsida ko'rgan so'rov yo'li — ayni shu bog'lanish!", ru: 'Путь запроса из урока об интернете — это и есть та самая связь!' }) },
    bajarbot: { ic: '🤖', title: tr({ uz: 'BAJARBOT (robot)', ru: 'BAJARBOT (робот)' }), parts: [tr({ uz: '👁️ sensor', ru: '👁️ сенсор' }), tr({ uz: '🧠 protsessor', ru: '🧠 процессор' }), tr({ uz: "🦾 qo'l", ru: '🦾 рука' })], conn: tr({ uz: 'ichki signallar', ru: 'внутренние сигналы' }), note: tr({ uz: "Sensor ko'radi, protsessor qaror qiladi, qo'l bajaradi — birga ishlaydi. Bugungi robot-oshpazimiz!", ru: 'Сенсор видит, процессор решает, рука выполняет — всё работает вместе. Наш сегодняшний робот-повар!' }) }
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 4;
  const tap = (k) => { setActive(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Sistemalar atrofda', ru: 'Системы вокруг нас' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${seen.size}/4 ${tr({ uz: "ko'ring", ru: 'посмотрите' })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yana <span className="italic" style={{ color: T.accent }}>qayerda</span> sistema bor?</>, ru: <>Где <span className="italic" style={{ color: T.accent }}>ещё</span> есть системы?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bir marta payqang — endi sistemani <b style={{ color: T.ink }}>hamma joyda</b> ko'ra boshlaysiz. Futbol jamoasi, tanangiz, hatto o'zingiz yasagan <b style={{ color: T.ink }}>sayt</b> ham — bari sistema! Har birini bosib, qismlari va bog'lanishini ko'ring.</>, ru: <>Стоит один раз заметить — и вы начнёте видеть системы <b style={{ color: T.ink }}>повсюду</b>. Футбольная команда, ваше тело, даже <b style={{ color: T.ink }}>сайт</b>, который вы сами сделали, — всё это системы! Нажмите на каждую и посмотрите её части и связи.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {Object.keys(EX).map(k => (
                <button key={k} onClick={() => tap(k)} style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 12, padding: '13px 15px', background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: 'all 0.18s' }}>
                  <span style={{ fontSize: 26 }}>{EX[k].ic}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 15, color: T.ink }}>{EX[k].title}</span>
                  {seen.has(k) && <span style={{ marginLeft: 'auto', color: T.success, fontSize: 14 }}>✓</span>}
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {active ? (
              <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span style={{ fontSize: 24 }}>{EX[active].ic}</span><span className="sk-wordbadge">{EX[active].title}</span></span>
                <p className="flow-label" style={{ margin: '13px 0 7px' }}>{tr({ uz: 'Komponentlar (qismlar)', ru: 'Компоненты (части)' })}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {EX[active].parts.map((p, i) => (<span key={i} className="el-in" style={{ animationDelay: `${i * 0.07}s`, fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 12.5, color: T.ink, background: T.bg, padding: '6px 12px', borderRadius: 99 }}>{p}</span>))}
                </div>
                <div className="el-in" style={{ animationDelay: '0.28s', display: 'flex', alignItems: 'center', gap: 9, marginTop: 12, background: T.successSoft, borderRadius: 10, padding: '10px 13px' }}>
                  <span className="lnk-pulse" style={{ fontSize: 17 }}>🔗</span>
                  <span className="body" style={{ margin: 0, color: T.ink }}><b>{tr({ uz: "Bog'lanish:", ru: 'Связь:' })}</b> {EX[active].conn}</span>
                </div>
                <p className="body" style={{ color: T.ink2, margin: '10px 0 0', fontStyle: 'italic' }}>{EX[active].note}</p>
              </div>
            ) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Bir misolni bosing — qismlari ko'rinadi", ru: 'Нажмите на пример — увидите его части' })}</p></div> : null)}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Har xil narsa — lekin tuzilishi bir xil: <b>qismlar + bog'lanish</b>. Siz yasagan sayt ham aynan shunday sistema edi!</>, ru: <>Предметы разные — а устройство одно: <b>части + связи</b>. Сайт, который вы сделали, был точно такой же системой!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 5b — TEST 2 =====
const Screen5b = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv', ru: 'Проверка' })}
    audioText="Sistemada bog'lanish nima?"
    questionText="Sistemada 'bog'lanish' nima?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Mustahkamlash', ru: 'Закрепление' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Sistemada <span className="italic" style={{ color: T.accent }}>bog'lanish</span> nima?</>, ru: <>Что такое <span className="italic" style={{ color: T.accent }}>связь</span> в системе?</> })}</h2></>}
    options={[tr({ uz: "Qismlar bir-biriga ta'sir o'tkazadigan yo'l", ru: 'Путь, по которому части влияют друг на друга' }), tr({ uz: 'Sistemadagi eng katta va asosiy komponent', ru: 'Самый большой и главный компонент системы' }), tr({ uz: 'Butun sistemaga berilgan umumiy bitta nom', ru: 'Общее название всей системы целиком' }), tr({ uz: 'Rejasiz yuz beradigan tasodifiy hodisa', ru: 'Случайное событие, которое происходит без плана' })]} correctIdx={0}
    explainCorrect={tr({ uz: "To'g'ri! Bog'lanish — komponentlar bir-biriga ta'sir o'tkazadigan, signal yoki ma'lumot uzatadigan yo'l (masalan, nerv yoki internet so'rovi).", ru: 'Верно! Связь — это путь, по которому компоненты влияют друг на друга, передают сигнал или данные (например, нерв или интернет-запрос).' })}
    explainWrong={{
      1: tr({ uz: "Yo'q — bu komponent emas. Bog'lanish — qismlarni ulaydigan yo'l.", ru: 'Нет — это не компонент. Связь — путь, соединяющий части.' }),
      2: tr({ uz: "Yo'q — bog'lanish nom emas, u qismlar orasidagi aloqa.", ru: 'Нет — связь не название, это соединение между частями.' }),
      3: tr({ uz: "Yo'q — bog'lanish tasodif emas, u qismlarni maqsadli ulaydi.", ru: 'Нет — связь не случайность, она соединяет части с целью.' }),
      default: tr({ uz: "Bog'lanish — qismlar bir-biriga ta'sir o'tkazadigan yo'l.", ru: 'Связь — путь, по которому части влияют друг на друга.' })
    }} />
);

// ===== SCREEN 6 — ALGORITM = RETSEPT (ketma-ketlik) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's6', text: `Har kuni ertalab deyarli bir xil ishni qilasiz: uyg'onasiz, yuvinasiz, kiyinasiz... O'ylab ko'rsangiz, bu ham algoritm — maqsadga olib boradigan aniq, ketma-ket qadamlar, xuddi ovqat retsepti kabi. "Boshlash"ni bosib, qadamlarni kuzating.`, trigger: 'on_mount', waits_for: { type: 'flow_done' } }]);
  const STEPS = [
    { ic: '🛏️', h: tr({ uz: "Uyg'onish", ru: 'Проснуться' }) }, { ic: '🚿', h: tr({ uz: 'Yuvinish', ru: 'Умыться' }) }, { ic: '👕', h: tr({ uz: 'Kiyinish', ru: 'Одеться' }) }, { ic: '🍳', h: tr({ uz: 'Nonushta', ru: 'Завтрак' }) }, { ic: '🏫', h: tr({ uz: 'Maktabga', ru: 'В школу' }) }
  ];
  const [step, setStep] = useState(storedAnswer ? STEPS.length : 0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const isNarrow = useIsMobile(768);
  const done = step >= STEPS.length;
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current); setStep(0); setRunning(true);
    const tick = (i) => { setStep(i); if (i < STEPS.length) timer.current = setTimeout(() => tick(i + 1), 560); else { setRunning(false); audio.triggerEvent('flow_done'); } };
    timer.current = setTimeout(() => tick(1), 350);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Algoritm', ru: 'Алгоритм' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Avval ko'ring", ru: 'Сначала посмотрите' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ertalab nimadan <span className="italic" style={{ color: T.accent }}>boshlaysiz</span>?</>, ru: <>С чего <span className="italic" style={{ color: T.accent }}>начинается</span> ваше утро?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har kuni ertalab deyarli bir xil ishni qilasiz: uyg'onasiz, yuvinasiz, kiyinasiz... O'ylab ko'rsangiz, bu ham <b style={{ color: T.ink }}>algoritm</b> — maqsadga olib boradigan aniq, <b style={{ color: T.ink }}>ketma-ket qadamlar</b>, xuddi ovqat retsepti kabi. Tugmani bosib, qadamlarni kuzating.</>, ru: <>Каждое утро вы делаете почти одно и то же: просыпаетесь, умываетесь, одеваетесь... Если подумать, это тоже <b style={{ color: T.ink }}>алгоритм</b> — точные, <b style={{ color: T.ink }}>последовательные шаги</b>, ведущие к цели, прямо как кулинарный рецепт. Нажмите кнопку и понаблюдайте за шагами.</> })}</Mentor>
        <Zoomable>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!isNarrow ? (
          <div className="pz-flow" style={{ justifyContent: 'center' }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`pz-step ${step > i ? 'on' : ''} ${running && step === i + 1 ? 'active' : ''}`} style={{ minWidth: 92 }}>
                  <span style={{ fontSize: 26 }}>{step > i ? s.ic : '○'}</span>
                  <span className="pz-lbl"><b style={{ color: step > i ? T.ink : T.ink2 }}>{s.h}</b></span>
                </div>
                {i < STEPS.length - 1 && <span className={`pz-arrow ${step > i + 1 ? 'on' : ''}`}>→</span>}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="pz-flow-v">
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`pz-rowstep ${step > i ? 'on' : ''} ${running && step === i + 1 ? 'active' : ''}`}>
                  <span className="pz-rowic">{step > i ? s.ic : '○'}</span>
                  <span className="pz-rowtxt"><b>{i + 1}. {s.h}</b></span>
                  {step > i && <span style={{ marginLeft: 'auto', color: T.success, fontSize: 15 }}>✓</span>}
                </div>
                {i < STEPS.length - 1 && <span className={`pz-varrow ${step > i + 1 ? 'on' : ''}`}>↓</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        <button className="btn" onClick={run} disabled={running} style={{ alignSelf: 'flex-start' }}>{running ? tr({ uz: 'Bajarilmoqda…', ru: 'Выполняется…' }) : (done ? tr({ uz: "↻ Yana ko'rsatish", ru: '↻ Показать ещё раз' }) : tr({ uz: '▶ Boshlash', ru: '▶ Начать' }))}</button>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Mana shu — <b>algoritm</b>: aniq qadamlar, aniq <b>tartibda</b>. Kompyuterga ham xuddi shunday aniq qadamlar beramiz.</>, ru: <>✓ Вот это — <b>алгоритм</b>: точные шаги в точном <b>порядке</b>. Компьютеру мы даём такие же точные шаги.</> })}</p></div>}
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — KETMA-KETLIK MUHIM =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's7', text: `BAJARBOT — soqov robot-oshpaz: siz qaysi retseptni bersangiz, aynan o'shani, aynan o'sha tartibda bajaradi. To'g'ri yoki chalkash retseptni tanlab, RUN bosing — natijani o'z ko'zingiz bilan ko'ring. Chalkash bo'lsa, natija kulgili bo'lib qoladi.`, trigger: 'on_mount', waits_for: null }]);
  const CORRECT = [{ ic: '🥣', h: tr({ uz: 'Likobni ol', ru: 'Возьми тарелку' }) }, { ic: '🥚', h: tr({ uz: 'Tuxumni yor', ru: 'Разбей яйцо' }) }, { ic: '🥛', h: tr({ uz: 'Sut quy', ru: 'Налей молоко' }) }, { ic: '🍳', h: tr({ uz: 'Pishir va uzat', ru: 'Приготовь и подай' }) }];
  const MIXED = [{ ic: '🍳', h: tr({ uz: 'Pishir va uzat', ru: 'Приготовь и подай' }) }, { ic: '🥛', h: tr({ uz: 'Sut quy', ru: 'Налей молоко' }) }, { ic: '🥣', h: tr({ uz: 'Likobni ol', ru: 'Возьми тарелку' }) }, { ic: '🥚', h: tr({ uz: 'Tuxumni yor', ru: 'Разбей яйцо' }) }];
  const [order, setOrder] = useState('correct');
  const [phase, setPhase] = useState('idle'); // idle|run|done|fail
  const [running, setRunning] = useState(-1);
  const [ranOnce, setRanOnce] = useState(!!storedAnswer);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const list = order === 'correct' ? CORRECT : MIXED;
  const done = ranOnce; // gate: kamida 1 RUN
  const pick = (o) => { if (phase === 'run') return; setOrder(o); setPhase('idle'); setRunning(-1); };
  // ▶ RUN — BAJARBOT retseptni birma-bir bajaradi (step-executor), oxirida oshxona natijasi
  const run = () => {
    clearTimeout(timer.current); setPhase('run'); setRunning(0);
    const step = (i) => {
      setRunning(i);
      if (i < list.length - 1) timer.current = setTimeout(() => step(i + 1), 500);
      else timer.current = setTimeout(() => { setPhase(order === 'correct' ? 'done' : 'fail'); setRunning(-1); setRanOnce(true); }, 500);
    };
    timer.current = setTimeout(() => step(0), 260);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Ketma-ketlik', ru: 'Последовательность' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (phase === 'run' ? tr({ uz: 'BAJARBOT ishlamoqda…', ru: 'BAJARBOT работает…' }) : tr({ uz: 'RUN bosing', ru: 'Нажмите RUN' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qadamlar <span className="italic" style={{ color: T.accent }}>tartibi</span> muhimmi?</>, ru: <>Важен ли <span className="italic" style={{ color: T.accent }}>порядок</span> шагов?</> })}</h2></div>
        <Mentor>{tr({ uz: <>BAJARBOT — <b style={{ color: T.ink }}>soqov robot-oshpaz</b>: siz qaysi retseptni bersangiz, aynan o'shani, aynan o'sha tartibda bajaradi. <b style={{ color: T.ink }}>To'g'ri</b> yoki <b style={{ color: T.ink }}>chalkash</b> retseptni tanlab, <b style={{ color: T.ink }}>▶ RUN</b> bosing — natijani ko'ring.</>, ru: <>BAJARBOT — <b style={{ color: T.ink }}>наивный робот-повар</b>: какой рецепт вы ему дадите, тот он и выполнит, ровно в том же порядке. Выберите <b style={{ color: T.ink }}>правильный</b> или <b style={{ color: T.ink }}>перепутанный</b> рецепт и нажмите <b style={{ color: T.ink }}>▶ RUN</b> — посмотрите на результат.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', gap: 8 }}>
              <button className={`chip ${order === 'correct' ? 'chip-on' : ''}`} disabled={phase === 'run'} onClick={() => pick('correct')}>{tr({ uz: "✅ To'g'ri retsept", ru: '✅ Правильный рецепт' })}</button>
              <button className={`chip ${order === 'mixed' ? 'chip-on' : ''}`} disabled={phase === 'run'} onClick={() => pick('mixed')}>{tr({ uz: '🔀 Chalkash', ru: '🔀 Перепутанный' })}</button>
            </div>
            <div className="demo-swap" key={order} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {list.map((s, i) => (
                <div key={i} className={`el-in ${phase === 'run' && i === running ? 'cc-active' : ''}`} style={{ animationDelay: `${i * 0.1}s`, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 15px', borderRadius: 12, background: T.paper, boxShadow: `0 6px 16px -6px rgba(${T.shadowBase},0.14)` }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: T.accent }}>{i + 1}</span>
                  <span style={{ fontSize: 22 }}>{s.ic}</span>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, color: T.ink }}>{s.h}</span>
                </div>
              ))}
            </div>
            <button className="btn cc-run" onClick={run} disabled={phase === 'run'} style={{ alignSelf: 'flex-start' }}>{phase === 'run' ? tr({ uz: 'BAJARILMOQDA…', ru: 'ВЫПОЛНЯЕТСЯ…' }) : (ranOnce ? tr({ uz: '↻ Yana RUN', ru: '↻ Ещё раз RUN' }) : '▶ RUN')}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Oshxona sahnasi', ru: 'Кухонная сцена' })}</p>
            <KitchenStage phase={phase} current={running} steps={list.map(s => s.ic)} label={running >= 0 && list[running] ? `${list[running].ic} ${list[running].h}` : ''} failText={tr({ uz: "Pishirdi-yu, likob bo'sh — tuxum qobig'i bilan tovada!", ru: 'Приготовил, а тарелка пуста — яйцо со скорлупой на сковороде!' })} />
            {phase === 'done' && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ To'g'ri tartib — nonushta tayyor! Likob → tuxum → sut → pishir.", ru: '✓ Правильный порядок — завтрак готов! Тарелка → яйцо → молоко → готовка.' })}</p></div>}
            {phase === 'fail' && <div className="frame-warn fade-step"><p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tr({ uz: '😄 Kulgili falokat', ru: '😄 Смешная катастрофа' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>BAJARBOT avval pishirdi — yog' bo'sh likobga quyildi, tuxum qobig'i bilan tovaga tushdi! <b>Tartib o'zgardi — natija buzildi.</b></>, ru: <>BAJARBOT сначала стал готовить — масло вылилось на пустую тарелку, яйцо упало на сковороду вместе со скорлупой! <b>Порядок изменился — результат сломался.</b></> })}</p></div>}
            {done && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>Robot o'ylamaydi — faqat aytilganini qiladi.</b> Shuning uchun algoritmda <b>ketma-ketlik</b> — birinchi qoida.</>, ru: <><b>Робот не думает — он делает только то, что сказано.</b> Поэтому <b>последовательность</b> — первое правило алгоритма.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — SHARTLAR =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's8', text: `BAJARBOTda sensor bor: muzlatgichni tekshiradi. AGAR sut bo'lsa — sut quyadi; aks holda — quruq qo'shadi. Bitta robot, sensordan kelgan javobga qarab ikki xil yo'ldan ketadi. Sensorni almashtirib, BAJARBOT qanday tarmoqlanishini kuzating.`, trigger: 'on_mount', waits_for: null }]);
  const [milk, setMilk] = useState('bor');
  const [seen, setSeen] = useState(new Set(['bor']));
  const has = milk === 'bor';
  const done = seen.size >= 2;
  const toggle = () => { const m = has ? 'yoq' : 'bor'; setMilk(m); setSeen(prev => { const n = new Set(prev); n.add(m); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Shartlar', ru: 'Условия' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Sensorni almashtiring', ru: 'Переключите сенсор' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>BAJARBOT <span className="italic" style={{ color: T.accent }}>qaror</span> qabul qila oladimi?</>, ru: <>Может ли BAJARBOT принимать <span className="italic" style={{ color: T.accent }}>решения</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>BAJARBOTda <b style={{ color: T.ink }}>sensor</b> bor — muzlatgichni tekshiradi. <b style={{ color: T.ink }}>AGAR</b> sut bo'lsa — sut quyadi, <b style={{ color: T.ink }}>AKS HOLDA</b> — quruq qo'shadi. Bitta robot, sensor javobiga qarab ikki xil yo'ldan ketadi — bunga <b style={{ color: T.ink }}>shart</b> deyiladi. Sensorni almashtiring.</>, ru: <>У BAJARBOT есть <b style={{ color: T.ink }}>сенсор</b> — он проверяет холодильник. <b style={{ color: T.ink }}>ЕСЛИ</b> молоко есть — наливает молоко, <b style={{ color: T.ink }}>ИНАЧЕ</b> — готовит всухую. Один робот, но в зависимости от ответа сенсора идёт по двум разным путям — это называется <b style={{ color: T.ink }}>условие</b>. Переключите сенсор.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Muzlatgich sensori:', ru: 'Сенсор холодильника:' })}</p>
            <button onClick={toggle} className="weather-btn fade-up delay-1" style={{ cursor: 'pointer', border: 'none', borderRadius: 16, padding: '24px', background: has ? '#e6f6ee' : '#f1ede6', boxShadow: `0 8px 20px -6px rgba(${T.shadowBase},0.16)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transition: 'all 0.3s', width: '100%' }}>
              <span style={{ fontSize: 48, position: 'relative', zIndex: 1 }}>{has ? '🥛' : '🚫'}</span>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 700, color: T.ink, position: 'relative', zIndex: 1 }}>{has ? tr({ uz: 'Sut bor', ru: 'Молоко есть' }) : tr({ uz: "Sut yo'q", ru: 'Молока нет' })}</span>
              <span className="mono small" style={{ color: T.ink3, position: 'relative', zIndex: 1 }}>{tr({ uz: '↻ almashtirish uchun bosing', ru: '↻ нажмите, чтобы переключить' })}</span>
            </button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'BAJARBOTning qarori', ru: 'Решение BAJARBOT' })}</p>
            <div className="cond-card fade-up delay-1">
              <div className={`cond-line ${has ? 'on' : ''}`}>{tr({ uz: <><span className="cond-kw">AGAR</span> sut 🥛 <span className="cond-kw">BO'LSA</span> → <b>sut quy</b></>, ru: <><span className="cond-kw">ЕСЛИ</span> молоко 🥛 <span className="cond-kw">ЕСТЬ</span> → <b>налей молоко</b></> })}</div>
              <div className={`cond-line ${!has ? 'on' : ''}`}>{tr({ uz: <><span className="cond-kw">AKS HOLDA</span> 🚫 → <b>quruq qo'sh</b></>, ru: <><span className="cond-kw">ИНАЧЕ</span> 🚫 → <b>готовь всухую</b></> })}</div>
            </div>
            <KitchenStage phase="done" result={has ? { icon: '🥛🍳', cap: tr({ uz: 'Sutli nonushta tayyor', ru: 'Завтрак с молоком готов' }) } : { icon: '🥣🥄', cap: tr({ uz: 'Quruq nonushta (sutsiz)', ru: 'Сухой завтрак (без молока)' }) }} />
            {done && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bitta BAJARBOT — sensorga qarab ikki xil ishladi. Mana <b>shart</b>ning kuchi!</>, ru: <>Один BAJARBOT — а сработал по-разному, глядя на сенсор. Вот она, сила <b>условия</b>!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEST 3 (shart) =====
const Screen9 = (props) => (
  <QuestionScreen {...props} idx={9} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    audioText="Agar yomg'ir bo'lsa, soyabon ol — algoritmda bu qanday qism?"
    questionText="'AGAR yomg'ir bo'lsa, soyabon ol' — algoritmda bu qanday qism?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: "«AGAR yomg'ir bo'lsa, soyabon ol» — bu qanday qism?", ru: '«ЕСЛИ идёт дождь — возьми зонт» — что это за часть?' })}</h2></>}
    options={[tr({ uz: 'Sikl (takrorlash)', ru: 'Цикл (повторение)' }), tr({ uz: "Shart (agar...bo'lsa)", ru: 'Условие (если... то)' }), tr({ uz: 'Komponent (qism)', ru: 'Компонент (часть)' }), tr({ uz: "Bog'lanish (aloqa)", ru: 'Связь (соединение)' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! Bu — shart: algoritm vaziyatga qarab («agar...bo'lsa») qaror qabul qiladi.", ru: 'Верно! Это условие: алгоритм принимает решение в зависимости от ситуации («если... то»).' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — sikl bu amalni takrorlash. Bu yerda esa qaror qabul qilinyapti — bu shart.", ru: 'Нет — цикл повторяет действие. А здесь принимается решение — это условие.' }),
      2: tr({ uz: "Yo'q — komponent sistemaning qismi. Bu esa algoritmdagi qaror — shart.", ru: 'Нет — компонент это часть системы. А это решение в алгоритме — условие.' }),
      3: tr({ uz: "Yo'q — bog'lanish qismlarni ulaydi. Bu esa shart: agar...bo'lsa.", ru: 'Нет — связь соединяет части. А это условие: если... то.' }),
      default: tr({ uz: "Bu — shart: agar...bo'lsa...", ru: 'Это условие: если... то...' })
    }} />
);

// ===== SCREEN 10 — SIKLLAR =====
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's10', text: `BAJARBOTga xamirni aralashtirishni buyuramiz. "O'n marta aralashtir" deymiz — buni o'n marta takrorlab aytmaymiz-ku, bir marta aytamiz, son bilan. Kodda ham aynan shunday: bir marta yozasiz, "o'n marta takrorla" deysiz. Bunga sikl deyiladi. Tugmani bosing.`, trigger: 'on_mount', waits_for: { type: 'loop_done' } }]);
  const TOTAL = 10;
  const [count, setCount] = useState(storedAnswer ? TOTAL : 0);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const done = count >= TOTAL;
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = () => {
    clearTimeout(timer.current); setCount(0); setRunning(true);
    const tick = (i) => { setCount(i); if (i < TOTAL) timer.current = setTimeout(() => tick(i + 1), 280); else { setRunning(false); audio.triggerEvent('loop_done'); } };
    timer.current = setTimeout(() => tick(1), 300);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Sikllar', ru: 'Циклы' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Siklni ishga tushiring', ru: 'Запустите цикл' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bir ishni <span className="italic" style={{ color: T.accent }}>takror-takror</span> — qanday qilamiz?</>, ru: <>Как делать одно и то же <span className="italic" style={{ color: T.accent }}>снова и снова</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>BAJARBOTga xamirni aralashtirishni buyuramiz. "10 marta aralashtir" deymiz — buni 10 marta takrorlab aytmaymiz-ku, bir marta aytamiz, son bilan. Kodda ham shunday: bir marta yozasiz, <b style={{ color: T.ink }}>"10 marta takrorla"</b> deysiz. Bunga <b style={{ color: T.ink }}>sikl</b> deyiladi.</>, ru: <>Поручим BAJARBOT перемешать тесто. Мы говорим «перемешай 10 раз» — мы же не повторяем это 10 раз, а говорим один раз, числом. В коде так же: пишете один раз и говорите <b style={{ color: T.ink }}>«повтори 10 раз»</b>. Это называется <b style={{ color: T.ink }}>цикл</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="loop-card fade-up delay-1">
              <p className="loop-kw"><span className="cond-kw">{tr({ uz: 'BAJARBOT: TAKRORLA 10 marta:', ru: 'BAJARBOT: ПОВТОРИ 10 раз:' })}</span></p>
              <div className="squat-stage" key={count}>
                <span className="squat-fig">🤖</span>
                <span className="loop-spin">🔁</span>
                <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, color: T.ink }}>{tr({ uz: 'aralashtir 🥣', ru: 'перемешай 🥣' })}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                <span className={running ? 'loop-num' : ''} key={count} style={{ fontFamily: "'Fraunces',serif", fontSize: 'clamp(40px,8vw,60px)', color: count > 0 ? T.accent : T.ink3, lineHeight: 1 }}>{count}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", color: T.ink3, fontSize: 18 }}>/ {TOTAL} {tr({ uz: 'marta', ru: 'раз' })}</span>
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
                {Array.from({ length: TOTAL }).map((_, i) => (<span key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: i < count ? T.accent : T.ink3 + '33', transform: i === count - 1 && running ? 'scale(1.45)' : 'scale(1)', boxShadow: i === count - 1 && running ? '0 0 10px rgba(255,79,40,0.6)' : 'none', transition: 'all 0.2s' }} />))}
              </div>
            </div>
            <button className="btn cc-run" onClick={run} disabled={running} style={{ alignSelf: 'flex-start' }}>{running ? tr({ uz: 'BAJARILMOQDA…', ru: 'ВЫПОЛНЯЕТСЯ…' }) : (done ? tr({ uz: '↻ Yana', ru: '↻ Ещё раз' }) : tr({ uz: '▶ BAJARBOTni ishga tushir', ru: '▶ Запустить BAJARBOT' }))}</button>
          </Col>
          <Col>
            <div className="frame fade-up delay-2">
              <p className="eyebrow" style={{ color: T.accent, margin: '0 0 6px' }}>{tr({ uz: 'Sikl nimaga kerak?', ru: 'Зачем нужен цикл?' })}</p>
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Tasavvur qiling — 100 marta takrorlash kerak. Sikl bo'lmasa, 100 qator yozardingiz! Sikl bilan — <b>bitta qoida, 100 marta bajariladi.</b></>, ru: <>Представьте: нужно повторить 100 раз. Без цикла вы бы написали 100 строк! А с циклом — <b>одно правило, и оно выполнится 100 раз.</b></> })}</p>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ <b>Sikl</b> — bir amalni belgilangan marta (yoki shart bajarilguncha) takrorlaydi. Dasturchining eng kuchli vositasi.</>, ru: <>✓ <b>Цикл</b> повторяет действие заданное число раз (или пока выполняется условие). Самый мощный инструмент программиста.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — ALGORITMNING 3 G'ISHTI =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's11', text: `Mana eng qiziq haqiqat — va u juda oddiy: butun dunyodagi har bir dastur — o'yinmi, ilovami, sayt-mi — atigi uchta asosiy qismdan quriladi: ketma-ketlik, shart va sikl. Siz ularning uchalasini ham ko'rib bo'ldingiz! Har birini bosib, yodga oling.`, trigger: 'on_mount', waits_for: null }]);
  const BRICKS = {
    seq: { ic: '📋', name: tr({ uz: 'Ketma-ketlik', ru: 'Последовательность' }), ex: tr({ uz: "Qadamlar aniq tartibda: uyg'on → yuvin → kiyin.", ru: 'Шаги в точном порядке: проснись → умойся → оденься.' }) },
    cond: { ic: '🔀', name: tr({ uz: 'Shart', ru: 'Условие' }), ex: tr({ uz: "Vaziyatga qarab qaror: agar yomg'ir bo'lsa — soyabon ol.", ru: 'Решение по ситуации: если идёт дождь — возьми зонт.' }) },
    loop: { ic: '🔁', name: tr({ uz: 'Sikl', ru: 'Цикл' }), ex: tr({ uz: "Takrorlash: o'tirib-turishni 10 marta bajar.", ru: 'Повторение: сделай 10 приседаний.' }) }
  };
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const isNarrow = useIsMobile(768);
  const done = seen.size >= 3;
  const tap = (k) => { setActive(k); setSeen(prev => { const n = new Set(prev); n.add(k); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Algoritm asoslari', ru: 'Основы алгоритма' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${seen.size}/3 ${tr({ uz: 'eslang', ru: 'вспомните' })}`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Algoritm <span className="italic" style={{ color: T.accent }}>nimalardan</span> quriladi?</>, ru: <>Из чего <span className="italic" style={{ color: T.accent }}>строится</span> алгоритм?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana eng qiziq haqiqat — va u juda oddiy: butun dunyodagi <b style={{ color: T.ink }}>har bir dastur</b> — o'yinmi, ilovami — atigi uchta asosiy qismdan quriladi: <b style={{ color: T.ink }}>ketma-ketlik</b>, <b style={{ color: T.ink }}>shart</b> va <b style={{ color: T.ink }}>sikl</b>. Siz uchalasini ham ko'rib bo'ldingiz! Har birini bosing.</>, ru: <>Вот самый интересный факт — и он очень простой: <b style={{ color: T.ink }}>каждая программа</b> в мире — игра или приложение — строится всего из трёх основных частей: <b style={{ color: T.ink }}>последовательность</b>, <b style={{ color: T.ink }}>условие</b> и <b style={{ color: T.ink }}>цикл</b>. Вы уже видели все три! Нажмите на каждую.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.keys(BRICKS).map(k => (
                <button key={k} onClick={() => tap(k)} style={{ display: 'flex', alignItems: 'center', gap: 13, textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 14, padding: '15px 16px', background: T.paper, boxShadow: active === k ? `inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22)` : `0 6px 16px -6px rgba(${T.shadowBase},0.14)`, transition: 'all 0.18s' }}>
                  <span style={{ fontSize: 28 }}>{BRICKS[k].ic}</span>
                  <span style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 18, color: T.ink }}>{BRICKS[k].name}</span>
                  {seen.has(k) && <span style={{ marginLeft: 'auto', color: T.success, fontSize: 15 }}>✓</span>}
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {active ? (
              <div className="sk-info fade-step" key={active}>
                <span className="sk-tagbig"><span style={{ fontSize: 26 }}>{BRICKS[active].ic}</span><span className="sk-wordbadge">{BRICKS[active].name}</span></span>
                <p className="body" style={{ color: T.ink, margin: '11px 0 0' }}>{BRICKS[active].ex}</p>
              </div>
            ) : (!isNarrow ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Bir qismni bosing', ru: 'Нажмите на любую часть' })}</p></div> : null)}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ Mana shu uchtasi — barcha dasturlarning poydevori. Hatto eng katta o'yinlar ham shulardan tuzilgan!", ru: '✓ Вот эти три — фундамент всех программ. Даже самые большие игры собраны из них!' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TEST 4 (sikl) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} idx={12} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    audioText="Bir xil amalni ko'p marta takrorlash uchun algoritmda nima ishlatamiz?"
    questionText="Bir xil amalni ko'p marta takrorlash uchun algoritmda nima ishlatamiz?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: "Bir xil amalni ko'p marta takrorlash uchun nima ishlatamiz?", ru: 'Что мы используем, чтобы повторить одно действие много раз?' })}</h2></>}
    options={[tr({ uz: "Shart (agar...bo'lsa)", ru: 'Условие (если... то)' }), tr({ uz: 'Sikl (takrorlash)', ru: 'Цикл (повторение)' }), tr({ uz: 'Komponent (qism)', ru: 'Компонент (часть)' }), tr({ uz: "Bog'lanish (aloqa)", ru: 'Связь (соединение)' })]} correctIdx={1}
    explainCorrect={tr({ uz: "To'g'ri! Sikl bir amalni belgilangan marta takrorlaydi — uni qayta-qayta yozish shart emas.", ru: 'Верно! Цикл повторяет действие заданное число раз — не нужно писать его снова и снова.' })}
    explainWrong={{
      0: tr({ uz: "Yo'q — shart qaror qabul qiladi (agar...bo'lsa). Takrorlash uchun esa sikl kerak.", ru: 'Нет — условие принимает решение (если... то). А для повторения нужен цикл.' }),
      2: tr({ uz: "Yo'q — komponent sistemaning qismi. Takrorlash — sikl ishi.", ru: 'Нет — компонент это часть системы. Повторение — работа цикла.' }),
      3: tr({ uz: "Yo'q — bog'lanish qismlarni ulaydi. Takrorlash uchun sikl ishlatamiz.", ru: 'Нет — связь соединяет части. Для повторения используем цикл.' }),
      default: tr({ uz: 'Takrorlash uchun — sikl.', ru: 'Для повторения — цикл.' })
    }} />
);

// ===== SCREEN 13 — AMALIYOT: ALGORITM YIG'ISH =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's13', text: `Endi navbat sizga. Quyidagi bloklardan BAJARBOTga dastur yig'ing — qadam, shart va siklni qo'shing. Keyin RUN bosib, robot buyruqlaringizni birma-bir bajarganini ko'ring. Kamida 3 ta blok qo'shing.`, trigger: 'on_mount', waits_for: null }]);
  const BLOCKS = [
    { ic: '🥣', label: tr({ uz: 'Likobni ol', ru: 'Возьми тарелку' }), type: 'qadam' },
    { ic: '🥚', label: tr({ uz: 'Tuxumni yor', ru: 'Разбей яйцо' }), type: 'qadam' },
    { ic: '🥛', label: tr({ uz: 'Sut quy', ru: 'Налей молоко' }), type: 'qadam' },
    { ic: '🍳', label: tr({ uz: 'Pishir', ru: 'Приготовь' }), type: 'qadam' },
    { ic: '🔀', label: tr({ uz: "Agar suyuq → un qo'sh", ru: 'Если жидко → добавь муку' }), type: 'shart' },
    { ic: '🔁', label: tr({ uz: 'Aralashtir × 10', ru: 'Перемешай × 10' }), type: 'sikl' }
  ];
  const MAX = 6;
  const [items, setItems] = useState([]);
  const [phase, setPhase] = useState('idle'); // idle|run|done
  const [running, setRunning] = useState(-1);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const done = items.length >= 3; // gate: kamida 3 blok (o'zgarmadi)
  const add = (b) => { if (items.length >= MAX) return; setItems(prev => [...prev, b]); setPhase('idle'); };
  const reset = () => { clearTimeout(timer.current); setItems([]); setPhase('idle'); setRunning(-1); };
  const program = items.map(b => ({ ic: b.ic, t: b.label, type: b.type }));
  const canRun = items.length >= 1 && phase !== 'run';
  // ▶ RUN — BAJARBOT dastur bloklarini birma-bir bajaradi (erkin qurish — natija playful)
  const run = () => {
    if (items.length < 1) return;
    clearTimeout(timer.current); setPhase('run'); setRunning(0);
    const step = (i) => { setRunning(i); if (i < items.length - 1) timer.current = setTimeout(() => step(i + 1), 450); else timer.current = setTimeout(() => { setPhase('done'); setRunning(-1); }, 450); };
    timer.current = setTimeout(() => step(0), 260);
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · BAJARBOTga dastur', ru: 'Практика · программа для BAJARBOT' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Kamida 3 blok', ru: 'Минимум 3 блока' })} (${items.length}/3)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>BAJARBOTga <span className="italic" style={{ color: T.accent }}>dastur</span> yozing</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>программу</span> для BAJARBOT</> })}</h2></div>
        <Mentor>{tr({ uz: <>Endi navbat sizga. Quyidagi bloklardan BAJARBOTga dastur yig'ing — <b style={{ color: T.ink }}>qadam</b>, <b style={{ color: T.blue }}>shart</b> va <b style={{ color: T.accent }}>sikl</b>ni qo'shing. Keyin <b style={{ color: T.ink }}>▶ RUN</b> bosib, robot buyruqlaringizni bajarganini ko'ring. Kamida 3 ta blok qo'shing.</>, ru: <>Теперь ваша очередь. Соберите из блоков ниже программу для BAJARBOT — добавьте <b style={{ color: T.ink }}>шаг</b>, <b style={{ color: T.blue }}>условие</b> и <b style={{ color: T.accent }}>цикл</b>. Потом нажмите <b style={{ color: T.ink }}>▶ RUN</b> и посмотрите, как робот выполнит ваши команды. Добавьте минимум 3 блока.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "Bloklar — bosib qo'shing", ru: 'Блоки — нажмите, чтобы добавить' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {BLOCKS.map((b, i) => (
                <button key={i} className="gchip" disabled={items.length >= MAX || phase === 'run'} onClick={() => add(b)}>
                  <span style={{ fontSize: 15 }}>{b.ic}</span> {b.label}
                </button>
              ))}
            </div>
            <p className="body fade-up delay-2" style={{ margin: '2px 0 0', color: T.ink3, fontSize: 13 }}>{tr({ uz: <><b style={{ color: T.ink2 }}>Maslahat:</b> kuchli algoritm — qadam + shart + sikl birga.</>, ru: <><b style={{ color: T.ink2 }}>Совет:</b> сильный алгоритм — шаг + условие + цикл вместе.</> })}</p>
            <CommandConsole program={program} running={running} phase={phase} onRun={run} onReset={reset} canRun={canRun} />
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Oshxona sahnasi', ru: 'Кухонная сцена' })}</p>
            <KitchenStage phase={phase} current={running} steps={program.map(b => b.ic)} label={running >= 0 && program[running] ? `${program[running].ic} ${program[running].t}` : ''} result={{ icon: '🍽️', cap: tr({ uz: 'BAJARBOT dasturingizni bajardi', ru: 'BAJARBOT выполнил вашу программу' }) }} />
            {phase === 'done' && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ BAJARBOT buyruqlaringizni <b>aynan siz yozgan tartibda</b> bajardi — bu dastur!</>, ru: <>✓ BAJARBOT выполнил ваши команды <b>ровно в том порядке, как вы написали</b> — это и есть программа!</> })}</p></div>}
            {done && phase !== 'done' && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Zo'r! Siz <b>algoritm</b> tuzdingiz — endi ▶ RUN bosib, robot bajarganini ko'ring.</>, ru: <>Отлично! Вы составили <b>алгоритм</b> — теперь нажмите ▶ RUN и посмотрите, как робот его выполнит.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== 🤖 BAJARBOT — qayta ishlatiladigan sirtlar (KitchenStage + CommandConsole) =====
// Blok tur-ranglari (qadam/shart/sikl) — L1 TYPE_COLOR naqshi
const BAJARBOT_TYPE_COLOR = { qadam: T.ink2, shart: T.blue, sikl: T.accent };
// UZ-RU: blok turi yorlig'i (kalitlar o'zgarmaydi — faqat ko'rinadigan matn)
const BAJARBOT_TYPE_LABEL = { qadam: { uz: 'qadam', ru: 'шаг' }, shart: { uz: 'shart', ru: 'условие' }, sikl: { uz: 'sikl', ru: 'цикл' } };

// KitchenStage — BAJARBOT robot + peshtaxta/likob sahnasi. phase: idle|run|done|fail
// (ko'rinish/animatsiya sayqali — 🎨 Dizayn / ✨ Animatsiya; bu yerda ishlaydigan skelet)
function KitchenStage({ phase, current, label, result, failText, steps }) {
  const face = phase === 'done' ? '🤖😋' : phase === 'fail' ? '🤖😵' : phase === 'run' ? '🤖🦾' : '🤖';
  // RUN paytida likobga tushgan ingredientlar (bosqichma-bosqich to'lish)
  const collected = phase === 'run' && Array.isArray(steps) ? steps.slice(0, Math.max(0, current) + 1) : [];
  return (
    <div className={`kx-stage kx-${phase}`}>
      {/* qo'l — RUN paytida "aralashtiruvchi" harakat */}
      <div className="kx-robot" aria-hidden="true">{face}<span className="kx-hand" aria-hidden="true">{phase === 'run' ? '🥄' : ''}</span></div>
      {/* fail — kulgili tutun to'lqinlari */}
      {phase === 'fail' && <span className="kx-smoke" aria-hidden="true"><span>💨</span><span>💨</span><span>💨</span></span>}
      <div className="kx-counter">
        {phase === 'idle' && <span className="kx-plate kx-empty">🍽️ <span className="kx-cap">{tr({ uz: "bo'sh likob", ru: 'пустая тарелка' })}</span></span>}
        {phase === 'run' && (
          <span className="kx-plate kx-working">
            {collected.length > 0
              ? <span className="kx-fill">{collected.map((ic, i) => <span key={i} className={i === collected.length - 1 ? 'kx-drop' : ''}>{ic}</span>)}</span>
              : <span className="kx-step">{label}</span>}
            <span className="kx-cap">{label ? `${label} · ${tr({ uz: 'bajarilmoqda…', ru: 'выполняется…' })}` : tr({ uz: 'bajarilmoqda…', ru: 'выполняется…' })}</span>
          </span>
        )}
        {phase === 'done' && <span className="kx-plate kx-ok"><span className="kx-served">{result?.icon || '🍽️🍳🥛'}</span> <span className="kx-cap">{result?.cap || tr({ uz: 'Tayyor nonushta!', ru: 'Завтрак готов!' })}</span></span>}
        {phase === 'fail' && <span className="kx-plate kx-bad"><span className="kx-splat">💥🥚</span> <span className="kx-cap">{failText || tr({ uz: 'Falokat — tartib chalkash!', ru: 'Катастрофа — порядок перепутан!' })}</span></span>}
      </div>
    </div>
  );
}

// CommandConsole — buyruq-bloklar stacki + ▶ RUN. program = [{ic,t,type}], onRun/onReset
function CommandConsole({ program, running, phase, onRun, onReset, canRun }) {
  return (
    <div className="cc-console">
      <p className="flow-label">{tr({ uz: 'BAJARBOT dasturi', ru: 'Программа BAJARBOT' })}</p>
      <div className="algo-build" style={{ minHeight: 120 }}>
        {program.length === 0
          ? <p style={{ color: T.ink3, fontStyle: 'italic', margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{tr({ uz: "// bloklarni tartib bilan qo'shing…", ru: '// добавляйте блоки по порядку…' })}</p>
          : program.map((b, i) => (
            <div key={i} className={`algo-line el-in ${phase === 'run' && i === running ? 'cc-active' : ''}`} style={{ borderLeft: `3px solid ${BAJARBOT_TYPE_COLOR[b.type]}` }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", color: T.ink3, fontSize: 12, minWidth: 16 }}>{i + 1}</span>
              <span style={{ fontSize: 16 }}>{b.ic}</span>
              <span style={{ flex: 1, fontFamily: "'Manrope',sans-serif", fontSize: 14, color: T.ink }}>{b.t}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 700, color: BAJARBOT_TYPE_COLOR[b.type], textTransform: 'uppercase', letterSpacing: '0.06em', background: `${BAJARBOT_TYPE_COLOR[b.type]}1A`, padding: '3px 8px', borderRadius: 7 }}>{tr(BAJARBOT_TYPE_LABEL[b.type] || { uz: b.type })}</span>
            </div>
          ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn cc-run" disabled={!canRun || phase === 'run'} onClick={onRun} style={{ alignSelf: 'flex-start' }}>{phase === 'run' ? tr({ uz: 'BAJARILMOQDA…', ru: 'ВЫПОЛНЯЕТСЯ…' }) : '▶ RUN'}</button>
        {program.length > 0 && phase !== 'run' && <button className="btn-soft" onClick={onReset}>{tr({ uz: '↺ Tozalash', ru: '↺ Очистить' })}</button>}
      </div>
    </div>
  );
}

// ===== SCREEN 15 — 🤖 BAJARBOT scored final (s14 debug + s15 tartib birlashtirildi) =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's15', text: `BAJARBOT — soqov robot-oshpaz. Uning dasturi chalkashib ketgan. Bloklarni to'g'ri tartibda joylang, keyin RUN bosing. Tartib chalkash bo'lsa — falokat chiqadi; to'g'ri bo'lsa — tayyor nonushta.`, trigger: 'on_mount', waits_for: { type: 'typed_ok' } }]);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorLive = !!(live && live.mode === 'mentor');
  const STEPS = { bowl: { ic: '🥣', t: tr({ uz: 'Likobni ol', ru: 'Возьми тарелку' }), type: 'qadam' }, egg: { ic: '🥚', t: tr({ uz: 'Tuxumni yor', ru: 'Разбей яйцо' }), type: 'qadam' }, milk: { ic: '🥛', t: tr({ uz: 'Sut quy', ru: 'Налей молоко' }), type: 'qadam' }, stir: { ic: '🔁', t: tr({ uz: 'Aralashtir ×5', ru: 'Перемешай ×5' }), type: 'sikl' }, cook: { ic: '🍳', t: tr({ uz: 'Pishir va uzat', ru: 'Приготовь и подай' }), type: 'qadam' } };
  const CORRECT = ['bowl', 'egg', 'milk', 'stir', 'cook'];
  const SHUFFLED = ['stir', 'milk', 'cook', 'bowl', 'egg'];
  const [order, setOrder] = useState(storedAnswer?.picked || []);
  const [passed, setPassed] = useState(!!storedAnswer?.correct);
  const [phase, setPhase] = useState(storedAnswer?.correct ? 'done' : 'idle'); // idle|run|done|fail
  const [running, setRunning] = useState(-1); // hozir bajarilayotgan blok indeksi
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const program = order.map(id => ({ id, ...STEPS[id] }));
  const canRun = order.length === CORRECT.length;
  const tap = (id) => { if (phase === 'run' || passed || order.includes(id)) return; setOrder(o => [...o, id]); setPhase('idle'); };
  const reset = () => { clearTimeout(timer.current); setOrder([]); setPhase('idle'); setRunning(-1); };
  // ▶ RUN — step-executor: bloklarni birma-bir bajaradi (s10 runner naqshi), oxirida natijani ko'rsatadi
  const run = () => {
    if (!canRun) return;
    clearTimeout(timer.current); setPhase('run'); setRunning(0);
    const step = (i) => {
      setRunning(i);
      if (i < CORRECT.length - 1) { timer.current = setTimeout(() => step(i + 1), 520); }
      else {
        timer.current = setTimeout(() => {
          const ok = order.every((x, k) => x === CORRECT[k]);
          if (ok) {
            setPhase('done'); setPassed(true); setRunning(-1);
            onAnswer(screen, { correct: true, picked: order });
            // Jonli darsda o'quvchi RUN'ni to'g'ri bajarganini serverga yozamiz — mentor «kim tugatdi»ni ko'radi va podium hisoblaydi
            if (live && live.mode === 'student') live.submitAnswer(screen, 's15', 0, true, 0);
            audio.triggerEvent('typed_ok');
            if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(`Zo'r! BAJARBOT to'g'ri tartibda ishladi — nonushta tayyor.`); }, 300);
          } else { setPhase('fail'); setRunning(-1); }
        }, 520);
      }
    };
    timer.current = setTimeout(() => step(0), 300);
  };
  const firstErr = order.findIndex((x, k) => x !== CORRECT[k]);
  return (
    <Stage eyebrow={tr({ uz: '🤖 BAJARBOT · yakuniy', ru: '🤖 BAJARBOT · финал' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? false : !passed} label={isMentorLive ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (passed ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (canRun ? tr({ uz: 'RUN bosing', ru: 'Нажмите RUN' }) : tr({ uz: 'Bloklarni joylang', ru: 'Расставьте блоки' })))} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>BAJARBOTning dasturi <span className="italic" style={{ color: T.accent }}>chalkash</span> — tartibla va RUN bos.</>, ru: <>Программа BAJARBOT <span className="italic" style={{ color: T.accent }}>перепутана</span> — наведите порядок и нажмите RUN.</> })}</h2></div>
        <Mentor>{tr({ uz: <>BAJARBOT — soqov robot-oshpaz: aynan siz aytgan tartibda bajaradi. Bloklarni <b style={{ color: T.ink }}>to'g'ri ketma-ketlikda</b> joylang, keyin <b style={{ color: T.ink }}>▶ RUN</b> bosing. Tartib chalkash bo'lsa — kulgili <b style={{ color: T.ink }}>falokat</b>; to'g'ri bo'lsa — <b style={{ color: T.ink }}>tayyor nonushta</b> 🍽️.</>, ru: <>BAJARBOT — наивный робот-повар: он выполнит всё ровно в том порядке, что вы скажете. Расставьте блоки <b style={{ color: T.ink }}>в правильной последовательности</b>, потом нажмите <b style={{ color: T.ink }}>▶ RUN</b>. Если порядок перепутан — будет смешная <b style={{ color: T.ink }}>катастрофа</b>; если верный — <b style={{ color: T.ink }}>готовый завтрак</b> 🍽️.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Bloklar — tartib bilan bosing', ru: 'Блоки — нажимайте по порядку' })}</p>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
              {SHUFFLED.map(id => {
                const used = order.includes(id);
                return (
                  <button key={id} onClick={() => tap(id)} disabled={used || phase === 'run' || passed} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: used || passed ? 'default' : 'pointer', border: `1.5px solid ${BAJARBOT_TYPE_COLOR[STEPS[id].type]}44`, borderRadius: 12, padding: '12px 15px', background: used ? T.bg : T.paper, opacity: used ? 0.4 : 1, boxShadow: used ? 'none' : `0 6px 16px -6px rgba(${T.shadowBase},0.16)`, fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 15, color: T.ink, transition: 'all 0.18s' }}>
                    <span style={{ fontSize: 18 }}>{STEPS[id].ic}</span> {STEPS[id].t}
                  </button>
                );
              })}
            </div>
            <CommandConsole program={program} running={running} phase={phase} onRun={run} onReset={reset} canRun={canRun} />
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Oshxona sahnasi', ru: 'Кухонная сцена' })}</p>
            <KitchenStage phase={phase} current={running} steps={program.map(b => b.ic)} label={running >= 0 && program[running] ? `${program[running].ic} ${program[running].t}` : ''} />
            {phase === 'done' && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ To'g'ri! BAJARBOT: likob → tuxum → sut → aralashtir → pishir. Mukammal algoritm — nonushta tayyor!", ru: '✓ Верно! BAJARBOT: тарелка → яйцо → молоко → перемешай → приготовь. Идеальный алгоритм — завтрак готов!' })}</p></div>}
            {phase === 'fail' && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: '💥 Falokat!', ru: '💥 Катастрофа!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{firstErr >= 0 ? tr({ uz: `${firstErr + 1}-blok noto'g'ri joyda — BAJARBOT chalkashdi.`, ru: `Блок №${firstErr + 1} не на своём месте — BAJARBOT запутался.` }) : tr({ uz: 'Tartib chalkash.', ru: 'Порядок перепутан.' })} {tr({ uz: <>Xatoni top, «↺ Tozalash» bilan qaytadan tartibla va RUN bos. Xatoni topib tuzatish — bu <b>debugging</b>!</>, ru: <>Найдите ошибку, нажмите «↺ Очистить», расставьте заново и нажмите RUN. Искать и чинить ошибки — это <b>debugging</b>!</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== 🃏 FLASHCARDS — sistema/algoritm tushunchalari (karkas — matnni Metodist sayqallaydi) =====
const JS_FLASHCARDS = [
  { front: { uz: "Birga ishlab, umumiy maqsadga xizmat qiladigan qismlar", ru: 'Части, которые работают вместе ради общей цели' }, back: { uz: 'Sistema', ru: 'Система' }, note: { uz: 'tana · jamoa · sayt', ru: 'тело · команда · сайт' } },
  { front: { uz: "Sistemaning bitta qismi", ru: 'Одна часть системы' }, back: { uz: 'Komponent', ru: 'Компонент' }, note: { uz: "yurak, o'pka…", ru: 'сердце, лёгкие…' } },
  { front: { uz: "Qismlarni bir-biriga ulaydigan aloqa", ru: 'Соединение, связывающее части между собой' }, back: { uz: "Bog'lanish", ru: 'Связь' }, note: { uz: "qismlar orasidagi yo'l", ru: 'путь между частями' } },
  { front: { uz: "Aniq, ketma-ket qadamlar (retsept)", ru: 'Точные, последовательные шаги (рецепт)' }, back: { uz: 'Algoritm', ru: 'Алгоритм' }, note: { uz: 'nima qilish rejasi', ru: 'план действий' } },
  { front: { uz: "Qadamlar bir-biridan keyin, to'g'ri tartibda", ru: 'Шаги один за другим, в правильном порядке' }, back: { uz: 'Ketma-ketlik', ru: 'Последовательность' }, note: { uz: 'tartib muhim', ru: 'порядок важен' } },
  { front: { uz: "«Agar yomg'ir bo'lsa — soyabon ol»", ru: '«Если идёт дождь — возьми зонт»' }, back: { uz: 'Shart', ru: 'Условие' }, note: { uz: "agar…bo'lsa…", ru: 'если… то…' } },
  { front: { uz: "«O'tirib-tur × 10 marta»", ru: '«Присядь × 10 раз»' }, back: { uz: 'Sikl', ru: 'Цикл' }, note: { uz: 'takrorlash', ru: 'повторение' } },
  { front: { uz: "Kompyuter bajaradigan tayyor algoritm", ru: 'Готовый алгоритм, который выполняет компьютер' }, back: { uz: 'Dastur', ru: 'Программа' }, note: { uz: 'kodga aylangan algoritm', ru: 'алгоритм, ставший кодом' } },
  { front: { uz: "Xatoni topib tuzatish", ru: 'Найти и исправить ошибку' }, back: { uz: 'Debugging', ru: 'Debugging' }, note: { uz: 'dasturchi mahorati', ru: 'навык программиста' } },
  { front: { uz: "Nonushta retsepti — bu nimaga misol?", ru: 'Рецепт завтрака — пример чего?' }, back: { uz: 'Algoritm', ru: 'Алгоритм' }, note: { uz: 'qadam-baqadam', ru: 'шаг за шагом' } },
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'tushuncha yodlandi', ru: 'понятий выучено' })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda ·", ru: '↻ Учим ·' })} <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim ·', ru: '✓ Знаю ·' })} <b>{known}</b></span></div>
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

// ===== SCREEN: FLASHCARD TAKRORLASH (yakuniy summarydan oldin) =====
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 'sflash', text: `Darsni yakunlashdan oldin, bugun o'rgangan tushunchalarni tez takrorlaymiz. Har kartada bir izoh — qaysi tushuncha ekanini o'ylang, keyin kartani bosib tekshiring.`, trigger: 'on_mount', waits_for: null }]);
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tushunchalarni <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <>Быстро <span className="italic" style={{ color: T.accent }}>повторим понятия</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Darsni yakunlashdan oldin bugun o'rgangan tushunchalarni takrorlaymiz. Har kartada bir izoh — <b style={{ color: T.ink }}>qaysi tushuncha</b> ekanini o'ylang, keyin kartani bosib tekshiring. <b style={{ color: T.ink }}>Bildim</b> yoki <b style={{ color: T.ink }}>Takrorlash</b> bilan baholang.</>, ru: <>Перед завершением урока повторим понятия, которые вы сегодня узнали. На каждой карточке подсказка — подумайте, <b style={{ color: T.ink }}>какое это понятие</b>, потом нажмите на карточку и проверьте себя. Оценивайте кнопками <b style={{ color: T.ink }}>Знаю</b> или <b style={{ color: T.ink }}>Повторить</b>.</> })}</Mentor>
        <div className="fc-center"><Flashcards cards={JS_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 16 — YAKUN =====
const Screen16 = ({ screen, answers, onReset, onPrev, onFinish }) => {
  const audio = useAudio([{ id: 's16', text: "Tabriklaymiz — bugun siz dasturchining tilida fikrlay boshladingiz! Esda saqlang: sistema — bu qismlar va ularning bog'lanishlari, algoritm esa retsept: ketma-ketlik, shart va sikl. Keyingi darsda eng qizig'i boshlanadi — shu algoritmlarni kompyuterga JavaScript tilida yozamiz.", trigger: 'on_mount', waits_for: null }]);
  // ⚔️ Mustahkamlash testi: jonli darsda mentor ochadi → o'quvchilar kiradi.
  // Dars tugagan / mentor uzilgan bo'lsa — o'quvchi UYDA solo (mashq) ishlaydi.
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [arena, setArena] = useState(false);
  const [arenaSolo, setArenaSolo] = useState(false);
  const quizSt = (live && live.quiz && live.quiz.state) || 'off';
  const isStudentL = live && live.mode === 'student';
  const isMentorL = live && live.mode === 'mentor';
  const classOver = !!(live && (live.status === 'ended' || !live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== 'done';
  const studentLive = isStudentL && !studentSolo && quizSt !== 'off';
  const studentWait = isStudentL && !studentSolo && quizSt === 'off';
  const openArena = async () => {
    if (isMentorL && quizSt === 'off') { try { await live.quizControl('lobby', -1); } catch { return; } }
    setArenaSolo(studentSolo);
    setArena(true);
  };
  const RECAP = [tr({ uz: "Sistema — komponentlar va bog'lanishlar", ru: 'Система — компоненты и связи' }), tr({ uz: 'Atrofdagi sistemalar (tana, jamoa, sayt)', ru: 'Системы вокруг нас (тело, команда, сайт)' }), tr({ uz: 'Algoritm = retsept (aniq qadamlar)', ru: 'Алгоритм = рецепт (точные шаги)' }), tr({ uz: 'Ketma-ketlik — tartib muhim', ru: 'Последовательность — порядок важен' }), tr({ uz: "Shart (agar...bo'lsa) va Sikl (takrorla)", ru: 'Условие (если... то) и Цикл (повтори)' })];
  const HOMEWORK = [{ b: tr({ uz: 'Sistema top', ru: 'Найди систему' }), t: tr({ uz: '— atrofingizdan 1 sistema toping, qismlarini yozing', ru: '— найдите вокруг себя 1 систему и запишите её части' }) }, { b: tr({ uz: 'Algoritm yoz', ru: 'Напиши алгоритм' }), t: tr({ uz: '— maktabga tayyorgarlikni qadam-baqadam yozing', ru: '— распишите сборы в школу шаг за шагом' }) }, { b: tr({ uz: "Shart qo'sh", ru: 'Добавь условие' }), t: tr({ uz: '— "agar... bo\'lsa..." qadamini qo\'shing', ru: '— добавьте шаг «если... то...»' }) }];
  const GLOSSARY = [{ b: tr({ uz: 'Sistema', ru: 'Система' }), t: tr({ uz: '— birga ishlaydigan qismlar', ru: '— части, работающие вместе' }) }, { b: tr({ uz: 'Komponent', ru: 'Компонент' }), t: tr({ uz: '— sistemaning bir qismi', ru: '— одна часть системы' }) }, { b: tr({ uz: "Bog'lanish", ru: 'Связь' }), t: tr({ uz: "— qismlarni ulaydigan yo'l", ru: '— путь, соединяющий части' }) }, { b: tr({ uz: 'Algoritm', ru: 'Алгоритм' }), t: tr({ uz: '— aniq qadamlar (retsept)', ru: '— точные шаги (рецепт)' }) }, { b: tr({ uz: 'Ketma-ketlik', ru: 'Последовательность' }), t: tr({ uz: '— qadamlar tartibi', ru: '— порядок шагов' }) }, { b: tr({ uz: 'Shart', ru: 'Условие' }), t: tr({ uz: '— agar...bo\'lsa...', ru: '— если... то...' }) }, { b: tr({ uz: 'Sikl', ru: 'Цикл' }), t: tr({ uz: '— takrorlash', ru: '— повторение' }) }];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const earned = useContext(AchCtx);
  const [open, setOpen] = useState(false);
  const glossRef = useRef(null);
  const isNarrow = useIsMobile(768);
  const toggleGloss = () => setOpen(o => {
    const nv = !o;
    if (nv && isNarrow) setTimeout(() => { if (glossRef.current) glossRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 80);
    return nv;
  });
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>dasturchidek</span> fikrlaysiz.</>, ru: <>Теперь вы думаете <span className="italic" style={{ color: T.accent }}>как программист</span>.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: 'Tabriklaymiz! Sistema va algoritmni tushundingiz — JavaScript yozishga tayyorsiz.', ru: 'Поздравляем! Вы поняли систему и алгоритм — вы готовы писать на JavaScript.' }) : tr({ uz: "Yaxshi harakat! Bir-ikki joyni mustahkamlash uchun darsni qayta ko'ring.", ru: 'Хорошая попытка! Пересмотрите урок, чтобы закрепить пару мест.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark
            stats={false}
            liveOn={studentLive}
            disabled={studentWait}
            onClick={studentWait ? undefined : openArena}
            hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined}
          />
        </div>
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: 'Atrofingizdagi hayotni algoritm qilib yozing:', ru: 'Опишите жизнь вокруг себя в виде алгоритма:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{h.b}</b> <span className="t">{h.t}</span></li>))}</ul><p className="hw-note">{tr({ uz: 'Keyingi darsda shu algoritmlarni kompyuterga JavaScript tilida yozishni boshlaymiz! 🚀', ru: 'На следующем уроке начнём записывать эти алгоритмы для компьютера на языке JavaScript! 🚀' })}</p></div>
        </div>
        <div className="card fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '🏅 Nishonlaringiz —', ru: '🏅 Ваши награды —' })} {earned ? earned.size : 0}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid" style={{ marginTop: 8 }}>{Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(earned && earned.has(id)); return (
            <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`}><span className="ach-badge-ic">{got ? a.icon : '🔒'}</span><span className="ach-badge-name">{a.name}</span><span className="ach-badge-desc">{got ? tr(a.desc) : '—'}</span></div>
          ); })}</div>
        </div>
        <div ref={glossRef} className="gloss fade-up d4" style={{ scrollMarginBottom: 16 }}><div className="gloss-head" onClick={toggleGloss}><span className="lbl">{tr({ uz: "💡 Kalit so'zlar (takrorlash)", ru: '💡 Ключевые слова (повторение)' })}</span><span className="gloss-toggle">{open ? '−' : '+'}</span></div>{open && (<div className="gloss-body">{GLOSSARY.map((g, i) => (<span key={i}><b>{g.b}</b> {g.t}{i < GLOSSARY.length - 1 ? ' · ' : ''}</span>))}</div>)}</div>
      </div>
      {arena && <QuizArena live={live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })

// Podium savol-statistika yorliqlari (scored indeks → qisqa nom)
const Q_LABELS = { 4: { uz: '1 — Sistema', ru: '1 — Система' }, 6: { uz: "2 — Bog'lanish", ru: '2 — Связь' }, 10: { uz: '3 — Shart (AGAR)', ru: '3 — Условие (ЕСЛИ)' }, 13: { uz: '4 — Sikl (takror)', ru: '4 — Цикл (повтор)' }, 15: { uz: '5 — BAJARBOT dasturi', ru: '5 — Программа BAJARBOT' } };

// Yakun bayrami — konfetti (podium + yuqori natijada)
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

// ===== PODIUM (jonli test yakuni — 1-2-3 o'rin, InternetLesson bilan bir xil) =====
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
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не присоединился.' })}</p></div>
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
                      <span className="qstat-lbl">{Q_LABELS[q] ? tr(Q_LABELS[q]) : `#${q}`}{hard && ' ⚠️'}</span>
                      <span className="mstats-track"><span className="mstats-fill" style={{ width: `${pct}%`, background: hard ? T.accent : T.success }} /></span>
                      <span className="mono qstat-n">{okN}/{qa.length}</span>
                    </div>
                  );
                })}
              </div>
              {live.mode === 'mentor' && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.', ru: 'Вопросы со значком ⚠️ — темы, где класс споткнулся. Рекомендуем объяснить ещё раз.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// ============================================================
// ⚔️ MUSTAHKAMLASH — Kahoot uslubidagi jonli test (12 savol · 20s)
// Mentor quiz_control RPC bilan fazalarni boshqaradi: lobby → q → r → … → done.
// O'quvchilar arenada 1.2s polling bilan sinxron yuradi. Ball — Kahoot formulasi:
// to'g'ri = 1000×(1−(vaqt/20s)/2); ketma-ket 2+ to'g'ri = +100 (streak 🔥).
// Solo (self/mashq) rejimda lokal o'ynaladi, serverga yozilmaydi.
// Javoblar live_answers'da screen_idx = 100 + savol_raqami bilan saqlanadi.
// ============================================================

// ===== ⚔️ MUSTAHKAMLASH-JANG (Kahoot arena — InternetLesson bilan bir xil) =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi neon shakllar (statik pozitsiyalar)
// Fon tokenlari — sintaksissiz KONSEPT darsi uchun algoritm-so'zlari (pre-kod)
const QZ_BG_SHAPES = [
  { ch: 'QADAM',   l: 5,  t: 10, s: 40, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: 'AGAR',    l: 84, t: 8,  s: 36, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: 'TAKRORLA',l: 7,  t: 72, s: 34, c: 'rgba(255,110,70,0.15)',  d: 27, dl: 0.8 },
  { ch: '▶',       l: 82, t: 68, s: 52, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: '1→2→3',   l: 44, t: 86, s: 32, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: 'AGAR',    l: 66, t: 26, s: 26, c: 'rgba(80,200,255,0.14)',  d: 17, dl: 0.4 },
  { ch: 'QADAM',   l: 26, t: 34, s: 24, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: '▶',       l: 55, t: 5,  s: 34, c: 'rgba(120,235,175,0.13)', d: 22, dl: 0.6 },
  { ch: 'TAKRORLA',l: 92, t: 44, s: 22, c: 'rgba(203,173,255,0.10)', d: 24, dl: 1.3 },
  { ch: '1→2→3',   l: 2,  t: 45, s: 24, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
// 12 ta PM savoli — dars kontentidan, chalg'ituvchilari ishonarli
// Server-baholash javob kaliti (dars ichidagi testlar). s15 = -1 (yakuniy amaliy — bajargani hisobga olinadi).
// quiz-N jang savollari QUIZ_BANK'dan avtomatik qo'shiladi. Mentor darsni ochganda serverga avto-yuklanadi (SQL shart emas).
const INLINE_KEYS = { s4: 1, s5b: 0, s9: 1, s12: 1, s15: -1 };

// ⚔️ MUSTAHKAMLASH-JANG savollari (DRAFT — foydalanuvchi tasdiqlaydi). Sistema + Algoritm.
const QUIZ_BANK = [
  { q: { uz: "Sistema — bu asli nima?", ru: 'Что такое система на самом деле?' }, opts: [{ uz: "Bir-biriga bog'lanmagan tasodifiy narsalar to'plami", ru: 'Набор случайных, не связанных между собой предметов' }, { uz: "Birga ishlab, umumiy maqsadga xizmat qiladigan qismlar", ru: 'Части, которые работают вместе ради общей цели' }, { uz: "Faqat kompyuterda ishlaydigan dastur", ru: 'Программа, которая работает только на компьютере' }, { uz: "Bo'linmaydigan bitta katta yaxlit qism", ru: 'Одна большая неделимая цельная часть' }], correct: 1 },
  { q: { uz: "Quyidagilardan qaysi biri SISTEMA?", ru: 'Что из перечисленного — СИСТЕМА?' }, opts: [{ uz: "Yo'lda yotgan bitta oddiy kulrang tosh", ru: 'Один обычный серый камень на дороге' }, { uz: "Ichi bo'sh, yopiq turgan bitta quti", ru: 'Одна пустая закрытая коробка' }, { uz: "Inson tanasi — a'zolar birga ishlaydi", ru: 'Тело человека — органы работают вместе' }, { uz: "Daftar chetidagi alohida bitta harf", ru: 'Одна отдельная буква на краю тетради' }], correct: 2 },
  { q: { uz: "Sistemadagi «komponent» nima?", ru: 'Что такое «компонент» в системе?' }, opts: [{ uz: "Sistemani tashkil qiluvchi bir qism", ru: 'Одна из частей, из которых состоит система' }, { uz: "Butun sistemaga berilgan umumiy nom", ru: 'Общее название всей системы' }, { uz: "Sistemadan butunlay tashqaridagi narsa", ru: 'То, что находится совсем вне системы' }, { uz: "Sistemadagi juda kichik bir xatolik", ru: 'Очень маленькая ошибка в системе' }], correct: 0 },
  { q: { uz: "«Bog'lanish» sistemada nimani bildiradi?", ru: 'Что означает «связь» в системе?' }, opts: [{ uz: "Qismlarni bir-biriga ulaydigan aloqa", ru: 'Соединение, связывающее части друг с другом' }, { uz: "Sistemadagi eng katta va og'ir qism", ru: 'Самая большая и тяжёлая часть системы' }, { uz: "Butun sistemaga berilgan umumiy nom", ru: 'Общее название всей системы' }, { uz: "Keraksiz, ortiqcha bo'sh turgan qism", ru: 'Ненужная, лишняя простаивающая часть' }], correct: 0 },
  { q: { uz: "Algoritm — bu asli nima?", ru: 'Что такое алгоритм на самом деле?' }, opts: [{ uz: "Tartibsiz, chalkash fikrlar to'plami", ru: 'Беспорядочный набор запутанных мыслей' }, { uz: "Aniq, ketma-ket qadamlar (retsept kabi)", ru: 'Точные, последовательные шаги (как рецепт)' }, { uz: "Faqat juda murakkab matematik formula", ru: 'Только очень сложная математическая формула' }, { uz: "Kompyuter mashinasiga berilgan nom", ru: 'Название компьютерной машины' }], correct: 1 },
  { q: { uz: "Nonushta tayyorlash retsepti — bu nimaga misol?", ru: 'Рецепт приготовления завтрака — пример чего?' }, opts: [{ uz: "Sistema", ru: 'Система' }, { uz: "Komponent", ru: 'Компонент' }, { uz: "Algoritm", ru: 'Алгоритм' }, { uz: "Bog'lanish", ru: 'Связь' }], correct: 2 },
  { q: { uz: "Algoritmda qadamlar TARTIBI muhimmi?", ru: 'Важен ли ПОРЯДОК шагов в алгоритме?' }, opts: [{ uz: "Yo'q, qadamlar tartibining farqi yo'q", ru: 'Нет, порядок шагов не имеет значения' }, { uz: "Faqat kompyuterda ishlaganda muhim", ru: 'Важен только при работе на компьютере' }, { uz: "Ha — tartib buzilsa, natija ham buziladi", ru: 'Да — нарушится порядок, сломается и результат' }, { uz: "Faqat eng oxirgi bitta qadam muhim", ru: 'Важен только самый последний шаг' }], correct: 2 },
  { q: { uz: "«AGAR yomg'ir yog'sa — soyabon ol» — bu algoritmning qaysi qismi?", ru: '«ЕСЛИ идёт дождь — возьми зонт» — какая это часть алгоритма?' }, opts: [{ uz: "Ketma-ketlik", ru: 'Последовательность' }, { uz: "Sikl", ru: 'Цикл' }, { uz: "Komponent", ru: 'Компонент' }, { uz: "Shart", ru: 'Условие' }], correct: 3 },
  { q: { uz: "Bir amalni KO'P MARTA takrorlash uchun algoritmda nima ishlatiladi?", ru: 'Что используется в алгоритме, чтобы повторить действие МНОГО РАЗ?' }, opts: [{ uz: "Shart (agar...bo'lsa)", ru: 'Условие (если... то)' }, { uz: "Sikl (takrorlash)", ru: 'Цикл (повторение)' }, { uz: "Bog'lanish (aloqa)", ru: 'Связь (соединение)' }, { uz: "Komponent (qism)", ru: 'Компонент (часть)' }], correct: 1 },
  { q: { uz: "Futbol jamoasi nega sistema hisoblanadi?", ru: 'Почему футбольная команда считается системой?' }, opts: [{ uz: "Chunki maydonda o'yinchi juda ko'p to'plangan", ru: 'Потому что на поле собралось очень много игроков' }, { uz: "Chunki futbol maydoni juda katta va yam-yashil", ru: 'Потому что футбольное поле большое и зелёное' }, { uz: "Chunki o'yin to'pi dumaloq va silliq shaklda bo'ladi", ru: 'Потому что мяч круглый и гладкий' }, { uz: "Chunki o'yinchilar bitta maqsad uchun birga ishlaydi", ru: 'Потому что игроки работают вместе ради одной цели' }], correct: 3 },
  { q: { uz: "Algoritmning 3 asosiy «g'ishti» qaysilar?", ru: 'Какие 3 главных «кирпича» у алгоритма?' }, opts: [{ uz: "Ketma-ketlik, Shart, Sikl", ru: 'Последовательность, Условие, Цикл' }, { uz: "Rang, Shakl, O'lcham", ru: 'Цвет, Форма, Размер' }, { uz: "Kim, Muammo, Yechim", ru: 'Кто, Проблема, Решение' }, { uz: "Boshi, O'rtasi, Oxiri", ru: 'Начало, Середина, Конец' }], correct: 0 },
  { q: { uz: "«Svetofor yashil bo'lsa — yur, qizil bo'lsa — to'xta» — bu qanday qism?", ru: '«Светофор зелёный — иди, красный — стой» — что это за часть?' }, opts: [{ uz: "Sikl (takrorlash)", ru: 'Цикл (повторение)' }, { uz: "Ketma-ketlik (tartib)", ru: 'Последовательность (порядок)' }, { uz: "Bog'lanish (aloqa)", ru: 'Связь (соединение)' }, { uz: "Shart (agar...bo'lsa)", ru: 'Условие (если... то)' }], correct: 3 },
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
          <span className="cs-hud-i">🏆 PODIUM</span>
        </div>
      )}
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>
  );
};

// Jonli fon: suzuvchi uchqunlar + «web» chiziqlari + algoritm tokenlari (canvas)
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['QADAM', 'AGAR', 'TAKRORLA', '▶', '1→2→3', 'SHART', 'SIKL', '→'];
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
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nПотом можно вернуться ровно к этому месту через «⚔️ Продолжить».\n\nВсё равно закрыть?' }))) return;
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
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме практики' })}</button>
        </div>
      )}

      {/* ===== LOBBY ===== */}
      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Серия верных ответов даёт бонус 🔥!' })}</p>
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
                : <span className="qz-res-t">{my ? tr({ uz: "Xato — 0 ball. Keyingisida olasiz! 💪", ru: 'Ошибка — 0 баллов. Возьмёте своё на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Будьте быстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: 'Siz hozir:', ru: 'Вы сейчас:' })} {myRank + 1}-{tr({ uz: "o'rin", ru: 'е место' })}</span>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест ещё раз — практика (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

// ===== SCREEN 16 — YAKUN =====

// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI — nurlar, medal portlashi, uchqunlar
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
          <span className="acu-eyebrow">{tr({ uz: '🏅 Nishon ochildi!', ru: '🏅 Награда открыта!' })}</span>
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

export default function JsIntroLesson({ lang: langProp, onFinished }) {
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

  // ETALON — 1920px (InternetLesson standarti): keng oynada (2K monitor) proportsional
  // kattalashadi, 1920 va undan torda z=1.
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, window.innerWidth / 1920)); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // 🃏 Flashcard jonli darsda FAQAT MENTORGA ko'rinadi (proyektorda jamoaviy takrorlash);
  // jonli o'quvchidan yashirin — sakrab o'tiladi. Mentor «Erkin qilish» qilgach ochiladi.
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && _m.scored && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat scored+correct)
  };
  // 🏅 Yakuniy ekranga yetganda: bitiruvchi nishoni
  useEffect(() => { if (screen === TOTAL_SCREENS - 1) earn('graduate'); }, [screen]); // eslint-disable-line
  const reset = () => { setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); earnedRef.current = new Set(); setEarned(new Set()); setAchToasts([]); };

  // Jonli dars: o'quvchi mentordan oldinga o'tolmaydi (high-water mark)
  // Javob kaliti: inline testlar + jang savollari (QUIZ_BANK'dan) — mentor darsni ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  // Mentor: har sahifa almashganda o'z holatini e'lon qiladi
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line

  const finishLesson = () => {
    live.endSession(); // mentor "Yakunlash" bossa — barcha o'quvchilarga erkinlik
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen5b, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen15, ScreenPodium, ScreenFlashcards, Screen16];
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
        @keyframes dl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.18); } }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        /* === OPTIMALLASHTIRISH (2026) — yangi animatsiyalar === */
        /* p1: yurak urishi / tezlik indikatori */
        .bpm-row { display: flex; align-items: center; gap: 12px; background: ${T.bg}; border-radius: 12px; padding: 10px 14px; margin-bottom: 12px; }
        .bpm-heart { font-size: 24px; display: inline-block; animation: heart-beat 1s ease-in-out infinite; }
        @keyframes heart-beat { 0%,100% { transform: scale(1); } 14% { transform: scale(1.3); } 28% { transform: scale(1); } 42% { transform: scale(1.18); } 56% { transform: scale(1); } }
        .bpm-info { display: flex; flex-direction: column; line-height: 1.05; }
        .bpm-num { font-family: 'Fraunces', serif; font-size: 26px; transition: color 0.3s; }
        .bpm-unit { font-family: 'JetBrains Mono'; font-size: 9px; color: ${T.ink3}; text-transform: uppercase; letter-spacing: 0.07em; }
        .eq { display: flex; align-items: flex-end; gap: 3px; height: 26px; margin-left: auto; }
        .eq-bar { width: 5px; height: 100%; background: ${T.accent}; border-radius: 2px; transform-origin: bottom; animation: eq-bounce 1s ease-in-out infinite; }
        @keyframes eq-bounce { 0%,100% { transform: scaleY(0.28); } 50% { transform: scaleY(1); } }
        /* p2: g'oya emoji badge */
        .idea-ic { width: 54px; height: 54px; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; font-size: 30px; flex-shrink: 0; animation: idea-float 3.2s ease-in-out infinite; }
        .idea-ic-sys { background: ${T.accentSoft}; }
        .idea-ic-algo { background: ${T.blueSoft}; animation-delay: 0.8s; }
        @keyframes idea-float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(-4deg); } }
        /* p6: bog'lanish pulsi */
        .lnk-pulse { display: inline-block; animation: lnk-pulse 1.3s ease-in-out infinite; }
        @keyframes lnk-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.22); } }
        /* p7: ketma-ketlik natija */
        .seq-result { display: flex; align-items: center; gap: 10px; margin-top: 4px; padding: 10px 13px; border-radius: 12px; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; animation: fade-step 0.35s ease-out; }
        /* p8: ob-havo effektlari */
        .weather-btn { position: relative; overflow: hidden; }
        .wx-fx { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .wx-fx i { position: absolute; top: -14%; width: 2px; height: 15px; background: rgba(1,154,203,0.6); border-radius: 2px; animation: rain-fall 0.85s linear infinite; }
        @keyframes rain-fall { to { transform: translateY(170px); opacity: 0.2; } }
        .sun-fx { position: absolute; top: 14px; left: 50%; width: 96px; height: 96px; transform: translateX(-50%); background: radial-gradient(circle, rgba(255,184,0,0.5), transparent 68%); border-radius: 50%; animation: sun-glow 2.6s ease-in-out infinite; pointer-events: none; z-index: 0; }
        @keyframes sun-glow { 0%,100% { transform: translateX(-50%) scale(0.82); opacity: 0.55; } 50% { transform: translateX(-50%) scale(1.16); opacity: 1; } }
        .cond-result { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; margin-top: 4px; padding: 9px 14px; border-radius: 99px; font-family: 'Manrope'; font-weight: 700; font-size: 14px; background: ${T.paper}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.22); animation: veh-pop 0.4s cubic-bezier(.34,1.4,.5,1); }
        @keyframes veh-pop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        /* p12: sikl — squat figurasi */
        .squat-stage { display: flex; align-items: center; gap: 16px; margin: 4px 0 2px; }
        .squat-fig { font-size: 40px; display: inline-block; animation: squat 0.42s ease-out; }
        @keyframes squat { 0% { transform: translateY(0) scaleY(1); } 42% { transform: translateY(11px) scaleY(0.8); } 100% { transform: translateY(0) scaleY(1); } }
        .loop-spin { font-size: 22px; display: inline-block; animation: loop-rot 0.55s ease-in-out; }
        @keyframes loop-rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        /* sikl hisoblagichi — har takrorda puls */
        .loop-num { display: inline-block; animation: loop-num-pop 0.28s cubic-bezier(.3,1.6,.5,1); }
        @keyframes loop-num-pop { 0% { transform: scale(0.7); } 60% { transform: scale(1.22); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .loop-num, .squat-fig, .loop-spin { animation: none !important; } }

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

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }
        .chip:disabled { opacity: 0.4; cursor: not-allowed; }
        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; }
        .tagpill { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }

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

        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.16); }

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

        /* === STEP FLOW (gorizontal) === */
        .pz-flow { display: flex; align-items: flex-start; gap: 4px; overflow-x: auto; padding: 4px 2px 2px; }
        .pz-step { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 88px; flex: 0 0 auto; padding: 10px 6px; border-radius: 12px; transition: background 0.3s; }
        .pz-step.on { background: ${T.successSoft}; }
        .pz-step.active { background: ${T.accentSoft}; }
        .pz-lbl { font-size: 11.5px; text-align: center; color: ${T.ink2}; line-height: 1.3; font-weight: 500; }
        .pz-step.on .pz-lbl { color: ${T.ink}; }
        .pz-arrow { align-self: center; margin-top: 18px; color: ${T.ink3}; font-size: 15px; flex: 0 0 auto; transition: color 0.3s; }
        .pz-arrow.on { color: ${T.success}; }
        /* Vertikal oqim (mobil) */
        .pz-flow-v { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }
        .pz-rowstep { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 12px; background: ${T.bg}; transition: background 0.3s; }
        .pz-rowstep.on { background: ${T.successSoft}; }
        .pz-rowstep.active { background: ${T.accentSoft}; }
        .pz-rowic { font-size: 22px; width: 28px; text-align: center; flex-shrink: 0; }
        .pz-rowtxt { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
        .pz-rowtxt b { font-size: 14px; color: ${T.ink2}; font-weight: 700; }
        .pz-rowstep.on .pz-rowtxt b { color: ${T.ink}; }
        .pz-varrow { align-self: center; color: ${T.ink3}; font-size: 15px; line-height: 1; transition: color 0.3s; }
        .pz-varrow.on { color: ${T.success}; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === CONN (bog'lanish) === */
        .conn-flow { display: flex; align-items: center; justify-content: center; gap: 6px; background: ${T.paper}; border-radius: 16px; padding: 20px 14px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .conn-node { display: flex; flex-direction: column; align-items: center; gap: 3px; flex-shrink: 0; transition: opacity 0.3s; }
        .conn-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .conn-sub { font-family: 'JetBrains Mono'; font-size: 10px; color: ${T.ink3}; text-align: center; }
        .conn-link { display: flex; align-items: center; gap: 3px; flex: 1; max-width: 140px; }
        .conn-line { flex: 1; height: 3px; background: ${T.success}; border-radius: 2px; transition: background 0.3s; }
        .conn-sig { font-size: 18px; }
        .conn-link.cut .conn-line { background: ${T.ink3}; opacity: 0.5; border-top: 2px dashed ${T.accent}; height: 0; }
        .conn-link.cut { animation: shake 0.3s; }
        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }

        /* === COND (shart) === */
        .cond-card { background: ${T.paper}; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .cond-line { position: relative; overflow: hidden; font-family: 'Manrope'; font-size: clamp(13px,1.7vw,15px); color: ${T.ink2}; padding: 9px 12px; border-radius: 10px; background: ${T.bg}; transition: all 0.3s; }
        .cond-line.on { background: ${T.successSoft}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${T.success}; animation: cond-pick 0.5s cubic-bezier(.3,1.4,.5,1); }
        @keyframes cond-pick { 0% { transform: scale(0.97); } 55% { transform: scale(1.025); } 100% { transform: scale(1); } }
        /* tarmoq-yo'li yorishishi — faol shoxchada yugurib o'tuvchi nur */
        .cond-line.on::after { content: ''; position: absolute; top: 0; left: -40%; width: 40%; height: 100%; background: linear-gradient(100deg, transparent, ${T.success}44 45%, ${T.success}66 50%, transparent); animation: cond-flow 0.7s ease-out; }
        @keyframes cond-flow { from { left: -45%; } to { left: 120%; } }
        @media (prefers-reduced-motion: reduce) { .cond-line.on { animation: none !important; } .cond-line.on::after { display: none; } }
        .cond-kw { font-family: 'JetBrains Mono'; font-weight: 700; color: ${T.blue}; font-size: 0.92em; }

        /* === LOOP (sikl) === */
        .loop-card { background: ${T.paper}; border-radius: 14px; padding: 16px 18px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .loop-kw { margin: 0; }
        .loop-act { font-family: 'Manrope'; font-weight: 600; color: ${T.ink}; margin: 4px 0 0; padding-left: 14px; }

        /* === ALGO BUILD === */
        .algo-build { background: ${T.paper}; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 7px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .algo-line { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; background: ${T.bg}; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; } .ai-line:hover { background: rgba(255,255,255,0.06); }
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
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.12); overflow: hidden; }
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

        /* === ⚡ CTA (yakun sahifasida — yorug' CodeStrike) === */
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

        /* ===== ⚡ ARENA — tungi neon CodeStrike muhiti (indigo turnir-foni) ===== */
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
        .pod-row.me { background: rgba(18,169,104,0.12); outline: 1.5px solid #12A968; }
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
        /* === 🃏 FLASHCARDS (reusable, 3D flip) === */
        .fc-center { display: flex; justify-content: center; padding-top: 4px; }
        .fc { display: flex; flex-direction: column; gap: 11px; max-width: 480px; width: 100%; }
        .fc-top { display: flex; justify-content: space-between; align-items: center; }
        .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
        .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
        .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
        .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
        @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
        .fc-bar { height: 7px; background: rgba(167,166,162,0.35); border-radius: 99px; overflow: hidden; }
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #FF8A3D, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
        .fc-cardwrap { perspective: 1200px; position: relative; }
        .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid rgba(167,166,162,0.35); z-index: -1; }
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
        .fc-front { background: ${T.paper}; border: 2px solid rgba(167,166,162,0.35); box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, #FF8A3D, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(255,79,40,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
        .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
        .fc-tap { color: ${T.accent}; font-weight: 700; }
        .fc-tag { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(26px,5vw,40px); letter-spacing: -0.02em; }
        .fc-note { font-family: 'Manrope'; font-size: 14px; opacity: 0.92; }
        .fc-actions { display: flex; gap: 10px; }
        .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
        .fc-btn:hover { transform: translateY(-2px); }
        .fc-btn.knew { background: ${T.success}; color: #fff; box-shadow: 0 10px 22px -10px ${T.success}; }
        .fc-btn.again { background: ${T.paper}; border: 2px solid ${T.accent}66; color: ${T.accent}; }
        .fc-btn.again:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
        .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid rgba(167,166,162,0.35); color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
        .fc-hint { margin: 0; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
        .fc-done-emoji { font-size: 40px; }
        .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
        .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }
        /* === 🤖 BAJARBOT — KitchenStage / CommandConsole (skelet; sayqal → Dizayn/Animatsiya) === */
        .kx-stage { position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 14px; border-radius: 20px; padding: clamp(18px,3vw,28px) clamp(16px,3vw,26px) clamp(14px,2.4vw,22px); background: linear-gradient(180deg, #FFF7F3 0%, #FFEFE8 100%); border: 2px solid ${T.accentSoft}; box-shadow: 0 14px 34px -18px rgba(255,79,40,0.28), inset 0 1px 0 rgba(255,255,255,0.7); min-height: 158px; justify-content: center; transition: background 0.3s, border-color 0.3s; }
        .kx-stage.kx-done { background: linear-gradient(180deg, #F1FAF4 0%, ${T.successSoft} 100%); border-color: ${T.success}55; }
        .kx-stage.kx-fail { background: linear-gradient(180deg, #FFF3EE 0%, ${T.accentSoft} 100%); border-color: ${T.accent}66; }
        .kx-robot { position: relative; font-size: clamp(42px,8vw,60px); line-height: 1; transition: transform 0.25s; filter: drop-shadow(0 8px 10px rgba(255,79,40,0.18)); }
        .kx-stage.kx-run .kx-robot { animation: kx-work 0.6s ease-in-out infinite; }
        @keyframes kx-work { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-6px) rotate(3deg); } }
        .kx-stage.kx-fail .kx-robot { animation: kx-shake 0.4s ease; }
        @keyframes kx-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px) rotate(-4deg); } 75% { transform: translateX(6px) rotate(4deg); } }
        .kx-stage.kx-done .kx-robot { animation: kx-nod 0.7s ease; }
        @keyframes kx-nod { 0%,100% { transform: translateY(0) scale(1); } 30% { transform: translateY(-9px) scale(1.1); } 60% { transform: translateY(0) scale(1); } 80% { transform: translateY(-4px); } }
        /* robot qo'li — har qadamda aralashtiruvchi harakat */
        .kx-hand { position: absolute; right: -6px; bottom: 2px; font-size: 0.42em; transform-origin: bottom left; }
        .kx-stage.kx-run .kx-hand { animation: kx-stir 0.5s ease-in-out infinite; }
        @keyframes kx-stir { 0%,100% { transform: rotate(-22deg) translateY(0); } 50% { transform: rotate(20deg) translateY(-3px); } }
        /* fail — kulgili tutun to'lqinlari */
        .kx-smoke { position: absolute; top: clamp(6px,1.6vw,14px); left: 50%; transform: translateX(-50%); display: flex; gap: 8px; pointer-events: none; }
        .kx-smoke span { font-size: 20px; opacity: 0; animation: kx-smokerise 1.1s ease-out forwards; }
        .kx-smoke span:nth-child(2) { animation-delay: 0.16s; }
        .kx-smoke span:nth-child(3) { animation-delay: 0.32s; }
        @keyframes kx-smokerise { 0% { opacity: 0; transform: translateY(6px) scale(0.6); } 30% { opacity: 0.9; } 100% { opacity: 0; transform: translateY(-26px) scale(1.25) rotate(12deg); } }
        /* to'g'ri natija — likobga bosqichma-bosqich tushayotgan ingredientlar */
        .kx-fill { display: inline-flex; gap: 2px; font-size: clamp(24px,4.6vw,32px); line-height: 1; }
        .kx-drop { display: inline-block; animation: kx-dropin 0.4s cubic-bezier(.3,1.5,.5,1) both; }
        @keyframes kx-dropin { 0% { opacity: 0; transform: translateY(-16px) scale(0.5) rotate(-14deg); } 60% { opacity: 1; transform: translateY(2px) scale(1.15); } 100% { transform: translateY(0) scale(1) rotate(0); } }
        .kx-served { display: inline-block; animation: kx-serve 0.55s cubic-bezier(.28,1.5,.4,1) both; }
        @keyframes kx-serve { 0% { transform: scale(0.4) rotate(-10deg); opacity: 0; } 60% { transform: scale(1.18) rotate(4deg); opacity: 1; } 100% { transform: scale(1) rotate(0); } }
        .kx-splat { display: inline-block; animation: kx-splatpop 0.45s cubic-bezier(.3,1.6,.5,1) both; }
        @keyframes kx-splatpop { 0% { transform: scale(0) rotate(-30deg); } 55% { transform: scale(1.3) rotate(12deg); } 80% { transform: scale(0.92) rotate(-6deg); } 100% { transform: scale(1) rotate(0); } }
        /* peshtaxta — likob/natija shu oq sirtda o'qiladi */
        .kx-counter { display: flex; align-items: center; justify-content: center; min-height: 52px; width: 100%; max-width: 340px; padding: 12px 18px; border-radius: 16px; background: #fff; border: 1.5px solid rgba(255,79,40,0.14); box-shadow: inset 0 2px 6px rgba(58,53,48,0.06), 0 6px 16px -10px rgba(58,53,48,0.2); }
        .kx-plate { display: inline-flex; flex-direction: column; align-items: center; gap: 4px; font-size: clamp(26px,5vw,36px); line-height: 1; }
        .kx-cap { font-family: 'Manrope'; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; text-align: center; }
        .kx-empty { color: ${T.ink3}; }
        .kx-empty .kx-cap { color: ${T.ink3}; }
        .kx-step { font-family: 'Manrope'; font-weight: 800; font-size: clamp(15px,2.4vw,19px); color: ${T.ink}; }
        .kx-ok .kx-cap { color: ${T.success}; }
        .kx-bad .kx-cap { color: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) { .kx-robot, .kx-hand, .kx-smoke span, .kx-drop, .kx-served, .kx-splat { animation: none !important; } .kx-smoke span { opacity: 0.85; } }
        .cc-console { display: flex; flex-direction: column; gap: 8px; }
        /* step-highlight — hozir bajarilayotgan blok yorishadi (executor puls) */
        .cc-active { position: relative; box-shadow: 0 0 0 2px ${T.accent}55; background: ${T.accentSoft}66; animation: cc-exec 0.5s ease-in-out infinite; }
        @keyframes cc-exec { 0%,100% { box-shadow: 0 0 0 2px ${T.accent}55, 0 0 0 0 rgba(255,79,40,0); } 50% { box-shadow: 0 0 0 2px ${T.accent}, 0 6px 18px -4px rgba(255,79,40,0.55); } }
        @media (prefers-reduced-motion: reduce) { .cc-active { animation: none !important; } }
        /* ▶ RUN — katta va jozibali (BAJARBOTni ishga tushiruvchi asosiy amal) */
        .cc-run { background: linear-gradient(170deg,#FF8A3D,#FF4F28) !important; color: #fff !important; font-size: clamp(15px,1.9vw,18px) !important; font-weight: 800 !important; padding: clamp(13px,1.9vw,16px) clamp(26px,3.4vw,38px) !important; border-radius: 14px !important; box-shadow: 0 14px 30px -10px rgba(255,79,40,0.55), inset 0 2px 0 rgba(255,255,255,0.3) !important; letter-spacing: 0.02em; }
        .cc-run:not(:disabled):hover { background: linear-gradient(170deg,#FF9A4D,#FF5A2C) !important; box-shadow: 0 18px 38px -8px rgba(255,79,40,0.7), inset 0 2px 0 rgba(255,255,255,0.3) !important; }
        .cc-run:disabled { background: #E9E6DF !important; color: #98A0B4 !important; box-shadow: none !important; }
        /* .qcode — kod-so'z chip (fmtCode) */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        /* Jonli panel (LiveBadge) — xira turadi, ustiga borilganda tiniqlashadi */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

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
        /* Kolleksiya kartochkalari (summary) */
        .ach-coll { display: flex; flex-direction: column; gap: 10px; }
        .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
        .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #FFF3EC); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed rgba(167,166,162,0.5); opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
        /* Yuqori paneldagi nishon hisoblagichi */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid rgba(167,166,162,0.5); border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(255,79,40,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(255,79,40,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(255,79,40,0); } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 222px; background: ${T.paper}; border: 1px solid rgba(167,166,162,0.5); border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr({ uz: 'JS darsi', ru: 'Урок JS' })} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
            </>
          )}
        </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>
  );
}
