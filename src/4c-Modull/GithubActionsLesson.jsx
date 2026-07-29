import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 4c-MODUL (CI/CD) · DARS 2 — «GITHUB ACTIONS: YO'L XARITASINI YOZISH» — PLATFORM STANDARD v18 (AUDIOSIZ)
// Maqsad: o'quvchi .github/workflows/ci.yml yo'l xaritasini o'zi quradi (on: / runs-on: / steps:) va
//         yozgan xaritasi bo'yicha LENTA (belt) aynan shunday aylanishini KO'RADI (real oqibat: yashil/qizil).
// 🛫 METAFORA — UCHISH LENTASI (aeroport bagaj lentasi, 4c bo'ylab yagona):
//   commit=yig'ilgan chamadon · push=lentaga qo'yish · pipeline=LENTA · job=NUQTA · step=AMAL ·
//   install=📦 YIG'ISH · test=🔍 SKANER · lint=📐 O'LCHAM RAMKASI · build=🎁 O'RASH · deploy=✈️ UCHIRISH ·
//   runner=LENTA MASHINASI (runs-on) · workflow YAML=YO'L XARITASI (ci.yml) · on:push=START SIGNALI ·
//   artefakt=O'RALGAN YUK · yashil/qizil=YASHIL/QIZIL CHIROQ · logs=LENTA JURNALI · secrets=SEYF+MAXFIY KALIT ·
//   matrix=PARALLEL LENTALAR · cache=YAQIN JAVON · status badge=TABLO.
//   Nuqtalarda ODAM ham, ROBOT ham turmaydi — MASHINA turadi. «zavod/robot/konveyer/qo'riqchi/retsept/sir» — TAQIQ.
// MARKAZIY INTERAKTIV: s17 «Yo'l xaritasini yozing» — bola on:/runs-on/steps'ni o'zi tuzadi, «Lentaga qo'ying»
//   bosadi, xaritasi bo'yicha lenta AYNAN shunday aylanadi (bo'sh on: → aylanmaydi, bo'sh runs-on: → mashina yo'q,
//   SKANER yo'q/tartib xato → buzuq yuk to'g'ridan-to'g'ri foydalanuvchi telefoniga uchadi).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium (ball to'g'riligi — ⚡ Jonli roli).
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA',
  danger: '#C2362B', dangerSoft: '#FAE3E0', amber: '#B45309', line: '#E9E6DF',
  shadowBase: '58, 53, 48'
};
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };

// ============================================================
// JONLI SESSIYA INFRA — InternetLesson/ReactIntro bilan bir xil (liveRpc/useLiveSession/LiveGate)
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
const LIVE_NICK_KEY = 'liveNickname';
const nickRead = () => { try { return localStorage.getItem(LIVE_NICK_KEY) || ''; } catch { return ''; } };
const nickStore = (n) => { try { localStorage.setItem(LIVE_NICK_KEY, n); } catch {} };
async function liveList(path) {
  const r = await fetch(`${LIVE_SUPABASE_URL}/rest/v1/${path}`, { headers: _liveHdr });
  if (!r.ok) throw new Error(`list: ${r.status}`);
  return r.json();
}
const livePlayers = (pin) => liveList(`live_players?pin=eq.${encodeURIComponent(pin)}&select=id,nickname,joined_at&order=joined_at.asc`);
const liveAnswers = (pin, screenIdx) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}${screenIdx == null ? '&screen_idx=lt.100' : `&screen_idx=eq.${screenIdx}`}&select=player_id,screen_idx,picked,correct,elapsed_ms`);
const liveQuizAnswers = (pin) => liveList(`live_answers?pin=eq.${encodeURIComponent(pin)}&screen_idx=gte.100&select=player_id,screen_idx,picked,correct,elapsed_ms`);

function useLiveSession(lessonId, answerKey) {
  const keyRef = useRef(answerKey); keyRef.current = answerKey;
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
  const [quiz, setQuiz] = useState({ state: 'off', q: -1 });
  const [revealScreen, setRevealScreen] = useState(-1);
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

  useEffect(() => {
    if (mode !== 'mentor' || !pin) return;
    let on = true;
    liveGet(pin).then(row => {
      if (!on) return;
      if (!row || row.status === 'ended') { liveClear(lessonId); setPin(null); tokenRef.current = null; setMode('choosing'); setEnded(false); return; }
      syncQuiz(row);
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
  // 🔴 11.11: bigOpen HECH QACHON avtomatik `true` bo'lmaydi — faqat «📺 Ko'rsatish» tugmasi ochadi (onboarding'ga xalaqit bermasin)
  if (live.mode === 'mentor') {
    if (live.ended) return <div className="live-badge" style={_liveBadgeS}><span style={_liveDot(LT.ink3)} /> {tr({ uz: "🔓 O'quvchilar erkin qilindi", ru: '🔓 Ученики отпущены в свободный режим' })}</div>;
    return (<>
      {bigOpen && <LiveBigCode pin={live.pin} onClose={() => setBigOpen(false)} />}
      <div className="live-badge" style={_liveBadgeS}>
        <span style={_liveDot(LT.success)} /> {tr({ uz: 'Kod:', ru: 'Код:' })} <b style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}>{fmtPin(live.pin)}</b>
        {nPlayers !== null && <span style={{ color: LT.ink2 }}>👥 {nPlayers}</span>}
        <button onClick={() => setBigOpen(true)} title={tr({ uz: "Kodni katta ko'rsatish", ru: 'Показать код крупно' })} style={{ marginLeft: 6, background: LT.ink, color: '#fff', border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: "📺 Ko'rsatish", ru: '📺 Показать' })}</button>
        <button onClick={() => { if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: 'Отпустить учеников? Дальше они продолжат сами.' }))) live.endSession(); }} style={{ background: LT.accentSoft, color: LT.accent, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: '🔓 Erkin qilish', ru: '🔓 Отпустить' })}</button>
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
const MentorCtx = createContext(null);
const AchCtx = createContext(null);
const LiveGateCtx = createContext(null);

const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

const getAudioEngine = () => null;
const useAudio = () => ({ muted: true, isPlaying: false, currentSegment: null, waitingFor: null, triggerEvent: () => {}, replay: () => {}, toggleMute: () => {} });

// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
const ou = (o) => (o && o.uz) || o; // UZ-etalon: jonli-analytics payload matnlari uchun

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

const LESSON_META = { lessonId: 'github-actions-4c-02-v18', lessonTitle: { uz: "GitHub Actions — yo'l xaritasini yozish", ru: 'GitHub Actions — написание карты маршрута' } };
// 23 ekran · 4.1 oqim: hook → reja → (exploration↔test)× → markaziy builder → debugging(final) → praktika → podium → flashcard → summary
const SCREEN_META = [
  { id: 's0',       type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',       type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',       type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',       type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',       type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',       type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',       type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',       type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',       type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's9',       type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10',      type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11',      type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's12',      type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's13',      type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's14',      type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's15',      type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's16',      type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's17',      type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's18',      type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'practice', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards',  template: 'custom',   scored: false, scope: null },
  { id: 's19',      type: 'summary',     template: 'custom',   scored: false, scope: null }
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
        <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Развернуть' })} title={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Развернуть' })}>{big ? '✕' : '⛶'}</button>
        {children}
      </div>
    </>
  );
};
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

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

const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `practice: -1` — sentinel (variant yo'q).
// ⚠️ Variant TARTIBI/qiymatlari 🎓 Metodist + ⚡ Jonli rollari tomonidan qayta balanslanadi.
// s18 (yakuniy — jurnaldan sabab topish) — REAL kalit: picked=0 → 1-urinishda topdi (to'g'ri), picked=1 → 1-urinishda xato bosdi.
const INLINE_KEYS = { s4: 2, s7: 0, s10: 3, s15: 1, s18: 0, practice: -1 };

const RECAPS = {
  4: {
    title: { uz: "Yo'l xaritasi qayerda yashaydi", ru: 'Где живёт карта маршрута' },
    cards: [
      { ic: '🗂️', h: { uz: 'Aniq manzil', ru: 'Точный адрес' }, body: { uz: <><span className="mono">.github/workflows/</span> ichidagi har <span className="mono">.yml</span> fayl — alohida yo'l xaritasi. GitHub aynan shu papkani qidiradi.</>, ru: <>Каждый <span className="mono">.yml</span>-файл внутри <span className="mono">.github/workflows/</span> — отдельная карта маршрута. GitHub ищет именно эту папку.</> } },
      { ic: '📛', h: { uz: 'Nom muhim emas, joy muhim', ru: 'Имя не важно — важно место' }, body: { uz: <>Faylni istalgan nom bilan atash mumkin (masalan <span className="mono">ci.yml</span>), lekin u albatta <span className="mono">.github/workflows/</span> ichida turishi kerak.</>, ru: <>Файл можно назвать как угодно (например <span className="mono">ci.yml</span>), но лежать он обязан внутри <span className="mono">.github/workflows/</span>.</> } },
      { ic: '🚫', h: { uz: 'Boshqa joyda ishlamaydi', ru: 'В другом месте не сработает' }, body: { uz: <>Fayl boshqa papkada tursa, GitHub uni umuman ko'rmaydi — lenta hech qachon aylanmaydi.</>, ru: <>Если файл лежит в другой папке, GitHub его просто не увидит — лента никогда не закрутится.</> }, ask: { uz: "Yo'l xaritasi qaysi papkada saqlanadi?", ru: 'В какой папке хранится карта маршрута?' } },
    ]
  },
  7: {
    title: { uz: "Yo'l xaritasi ichidagi ierarxiya", ru: 'Иерархия внутри карты маршрута' },
    cards: [
      { ic: '🗺️', h: { uz: "Eng katta — yo'l xaritasi", ru: 'Самое большое — карта маршрута' }, body: { uz: <><b style={{ color: T.ink }}>Workflow</b> — butun <span className="mono">ci.yml</span> fayli. Ichida bir yoki bir nechta nuqta (job) bo'ladi.</>, ru: <><b style={{ color: T.ink }}>Workflow</b> — весь файл <span className="mono">ci.yml</span>. Внутри него — одна или несколько точек (job).</> } },
      { ic: '🛑', h: { uz: "Nuqta — o'z mashinasida", ru: 'Точка — на своей машине' }, body: { uz: <><b style={{ color: T.ink }}>Job</b> (nuqta) o'z alohida lenta mashinasida ishlaydi. <span className="mono">runs-on</span> shu darajada yoziladi.</>, ru: <><b style={{ color: T.ink }}>Job</b> (точка) работает на своей отдельной машине ленты. <span className="mono">runs-on</span> пишется именно на этом уровне.</> } },
      { ic: '🔧', h: { uz: 'Amal — eng kichik birlik', ru: 'Шаг — самая маленькая единица' }, body: { uz: <><b style={{ color: T.ink }}>Step</b> (amal) — bitta harakat. Nuqta ichida ketma-ket bir nechta amal bo'ladi.</>, ru: <><b style={{ color: T.ink }}>Step</b> (шаг) — одно действие. Внутри точки шаги идут друг за другом.</> }, vis: <RcFlow items={['🗺️ Workflow', { uz: '🛑 Nuqta (job)', ru: '🛑 Точка (job)' }, { uz: '🔧 Amal (step)', ru: '🔧 Шаг (step)' }]} />, ask: { uz: "Yo'l xaritasi ichida nima birinchi, nima oxirgi turadi?", ru: 'Что в карте маршрута самое внешнее, а что — самое маленькое?' } },
    ]
  },
  10: {
    title: { uz: 'Signal va mashina', ru: 'Сигнал и машина' },
    cards: [
      { ic: '🚦', h: { uz: 'on: — qachon', ru: 'on: — когда' }, body: { uz: <><span className="mono">on: push</span> — lenta har push'da o'zi ishga tushadi. Bu START SIGNALI.</>, ru: <><span className="mono">on: push</span> — лента сама запускается при каждом пуше. Это СТАРТ-СИГНАЛ.</> } },
      { ic: '🖥️', h: { uz: 'runs-on: — qayerda', ru: 'runs-on: — где' }, body: { uz: <><span className="mono">runs-on: ubuntu-latest</span> — GitHub sizga bepul, toza lenta mashinasi beradi.</>, ru: <><span className="mono">runs-on: ubuntu-latest</span> — GitHub бесплатно выдаёт вам чистую машину ленты.</> } },
      { ic: '🔗', h: { uz: 'Ikkalasi birga', ru: 'Только вместе' }, body: { uz: <>Signal bo'lmasa — lenta aylanmaydi. Mashina bo'lmasa — lenta aylansa ham hech narsa bajarilmaydi.</>, ru: <>Нет сигнала — лента не закрутится. Нет машины — лента крутится, но ничего не выполняется.</> }, ask: { uz: 'on: va runs-on qaysi savollarga javob beradi?', ru: 'На какие вопросы отвечают on: и runs-on?' } },
    ]
  },
  15: {
    title: { uz: 'Amal turlari — uses va run', ru: 'Виды шагов — uses и run' },
    cards: [
      { ic: '🧩', h: { uz: 'uses — tayyor amal', ru: 'uses — готовый шаг' }, body: { uz: <>Marketplace'dagi tayyor amalni chaqiradi, masalan <span className="mono">actions/checkout@v4</span>.</>, ru: <>Вызывает готовый шаг из Marketplace, например <span className="mono">actions/checkout@v4</span>.</> } },
      { ic: '⌨️', h: { uz: 'run — buyruq', ru: 'run — команда' }, body: { uz: <>Oddiy terminal buyrug'i, masalan <span className="mono">npm install</span> yoki <span className="mono">npm test</span>.</>, ru: <>Обычная команда терминала, например <span className="mono">npm install</span> или <span className="mono">npm test</span>.</> } },
      { ic: '🔍', h: { uz: 'Skanerni unutmang', ru: 'Не забудьте сканер' }, body: { uz: <><span className="mono">npm test</span> — bu SKANER. Uni tashlab ketsangiz, buzuq yuk to'g'ridan-to'g'ri uchib ketadi.</>, ru: <><span className="mono">npm test</span> — это СКАНЕР. Пропустите его — и сломанный груз улетит без проверки.</> }, ask: { uz: 'uses bilan run orasidagi farq nima?', ru: 'В чём разница между uses и run?' } },
    ]
  },
  18: {
    title: { uz: 'Jurnaldan sababni topish', ru: 'Найти причину в журнале' },
    cards: [
      { ic: '📜', h: { uz: 'Jurnal — hamma narsani yozadi', ru: 'Журнал записывает всё' }, body: { uz: <>Har amal LENTA JURNALIGA yoziladi: qaysi nuqta yashil, qaysi biri qizil bo'lgani ko'rinadi.</>, ru: <>Каждый шаг записывается в ЖУРНАЛ ЛЕНТЫ: видно, какая точка зелёная, а какая покраснела.</> } },
      { ic: '🔍', h: { uz: 'Skanersiz — xavfli', ru: 'Без сканера — опасно' }, body: { uz: <>🔍 SKANER (<span className="mono">npm test</span>) o'tkazib yuborilsa, kod tekshirilmasdan to'g'ridan-to'g'ri uchiriladi.</>, ru: <>Если пропустить 🔍 СКАНЕР (<span className="mono">npm test</span>), код улетит дальше без всякой проверки.</> } },
      { ic: '🛠️', h: { uz: 'Tuzatib qayta yuboring', ru: 'Почините и отправьте снова' }, body: { uz: <>Sababni topgach, yo'l xaritasini tuzating va qaytadan lentaga qo'ying — endi yashil chiqadi.</>, ru: <>Нашли причину — поправьте карту маршрута и снова положите груз на ленту: теперь загорится зелёный.</> }, ask: { uz: 'Qizil chiroq yonganda birinchi qayerga qaraysiz?', ru: 'Куда вы смотрите первым делом, когда загорается красный?' } },
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
        <span className="rc-tag">{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Объяснение заново' })}</span>
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
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Дальше →' })}</button>}
      </div>
    </div>
  );
}

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
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и сколько ✅/❌ — скрыто. После «Открыть результат» всё появится сразу и у вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — класс не понял эту тему. Прежде чем идти дальше, стоит коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish — ', ru: '📖 Объяснение заново — ' })}{tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответов мало ({answered}) — делать выводы по процентам рано. Оцените сами.</> })}</p>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Рекомендуем объяснить заново.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников будут появляться здесь в реальном времени…' })}</p>}
    </div>
  );
}

const QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
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
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval natijani oching', ru: 'Сначала откройте результат' }) : solved ? { uz: 'Davom etish', ru: 'Продолжить' } : (oneShot ? { uz: 'Javob tanlang', ru: 'Выберите ответ' } : { uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
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
                <span style={{ flex: 1 }}>{fmtCode(tr(opt))}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? <>{tr({ uz: "✓ To'g'ri javob:", ru: '✓ Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> {tr({ uz: "· ko'rsatmani ochish ▾", ru: '· развернуть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

const Kw = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: 'italic' }}>{children}</span>;

const CodeFile = ({ name, children, minH }) => (
  <div className="editor">
    <div className="editor-bar"><span className="bb-dots"><i /><i /><i /></span><span className="editor-tab">{name}</span></div>
    <div className="editor-body" style={{ minHeight: minH }}><pre className="editor-code">{children}</pre></div>
  </div>
);

const Term = ({ title = 'Terminal', children, minH }) => (
  <div className="term"><div className="term-bar"><span className="bb-dots"><i /><i /><i /></span><span className="term-title">{title}</span></div><div className="term-body" style={{ minHeight: minH }}>{children}</div></div>
);
const TLine = ({ cmd, out, col, delay }) => (
  <div className="el-in tline" style={delay ? { animationDelay: `${delay}s` } : undefined}>{cmd ? <><span style={{ color: CODE.str }}>$</span> <span style={{ color: CODE.text }}>{cmd}</span></> : <span style={{ color: col || CODE.comment }}>{out}</span>}</div>
);

// ===== LENTA NATIJASI (BeltRun — nuqta + amallar ro'yxati, yashil/qizil chiroq) =====
const BELT_STEPS_PASS = [{ label: { uz: "📦 YIG'ISH", ru: '📦 СБОРКА' }, ok: true }, { label: { uz: '🔍 SKANER', ru: '🔍 СКАНЕР' }, ok: true }, { label: { uz: "🎁 O'RASH", ru: '🎁 УПАКОВКА' }, ok: true }, { label: { uz: '✈️ UCHIRISH', ru: '✈️ ВЗЛЁТ' }, ok: true }];
const BELT_STEPS_FAIL = [{ label: { uz: "📦 YIG'ISH", ru: '📦 СБОРКА' }, ok: true }, { label: { uz: '🔍 SKANER', ru: '🔍 СКАНЕР' }, ok: false }, { label: { uz: "🎁 O'RASH", ru: '🎁 УПАКОВКА' }, ok: null }, { label: { uz: '✈️ UCHIRISH', ru: '✈️ ВЗЛЁТ' }, ok: null }];
const BeltRun = ({ status = 'pass', steps }) => {
  const list = steps || (status === 'pass' ? BELT_STEPS_PASS : BELT_STEPS_FAIL);
  return (
    <div className="ghrun">
      <div className="ghrun-head">
        <span className={`ghrun-badge ${status}`}>{status === 'pass' ? tr({ uz: '✓ YASHIL CHIROQ', ru: '✓ ЗЕЛЁНЫЙ СВЕТ' }) : tr({ uz: '✗ QIZIL CHIROQ', ru: '✗ КРАСНЫЙ СВЕТ' })}</span>
        <span className="ghrun-title">{tr({ uz: 'Lenta · on: push · #14', ru: 'Лента · on: push · #14' })}</span>
      </div>
      <div className="ghrun-job">
        <div className="ghrun-jobname"><span style={{ color: status === 'pass' ? T.success : T.danger }}>{status === 'pass' ? '✓' : '✗'}</span> {tr({ uz: 'nuqta · ubuntu-latest', ru: 'точка · ubuntu-latest' })}</div>
        <div className="ghrun-steps">
          {list.map((s, i) => (<div className={`ghrun-step el-in ${s.ok === true && (s.label.uz || s.label).includes('UCHIRISH') ? 'plane-ok' : ''}`} key={i} style={{ animationDelay: `${i * 0.12}s` }}><span className="ghrun-ck" style={{ color: s.ok === true ? T.success : s.ok === false ? T.danger : T.ink3 }}>{s.ok === true ? '✓' : s.ok === false ? '✗' : '·'}</span><span>{tr(s.label)}</span></div>))}
        </div>
      </div>
    </div>
  );
};

// ===== FAYL-TREE EXPLORER (.github/workflows) =====
const FileTree = ({ revealed }) => (
  <div className="tree">
    <div className="tree-row" style={{ paddingLeft: 0 }}>{tr({ uz: '📁 mening-loyiham', ru: '📁 мой-проект' })}</div>
    {revealed >= 1 && <div className="tree-row hl el-in" style={{ paddingLeft: 18 }}>📁 .github</div>}
    {revealed >= 2 && <div className="tree-row hl el-in" style={{ paddingLeft: 36 }}>📁 workflows</div>}
    {revealed >= 3 && <div className="tree-row hl el-in" style={{ paddingLeft: 54 }}>📄 ci.yml</div>}
    <div className="tree-row dim" style={{ paddingLeft: 18 }}>📁 src</div>
    <div className="tree-row dim" style={{ paddingLeft: 18 }}>📄 package.json</div>
  </div>
);

// ===== PHONE PREVIEW — foydalanuvchi telefonidagi sayt (lenta oqibati) =====
const PhonePreview = ({ state }) => (
  <div className={`phone ${state}`}>
    <div className="phone-notch" />
    <div className="phone-scr">
      {state === 'ok' && <><span className="phone-ic">✅</span><span className="phone-t">{tr({ uz: 'Sayt ishlayapti', ru: 'Сайт работает' })}</span></>}
      {state === 'bad' && <><span className="phone-ic">💥</span><span className="phone-t">{tr({ uz: 'Buzuq sayt chiqdi', ru: 'Открылся сломанный сайт' })}</span></>}
      {state === 'idle' && <><span className="phone-ic">📱</span><span className="phone-t" style={{ color: T.ink3 }}>{tr({ uz: 'hali hech narsa yuborilmadi', ru: 'пока ничего не отправлено' })}</span></>}
    </div>
  </div>
);

// ===== DRAG-DROP TARTIB (reusable, StrictMode-safe — Htmllesson1 naqshi) =====
function DragDropOrder({ items, hints, onSolved, doneText }) {
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
            {sid ? <button key={sid} className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr(byId[sid].label)}</button> : <span className="dd-hint">{hints ? tr(hints[i]) : tr({ uz: 'bu yerga joylang', ru: 'положите сюда' })}</span>}
          </div>
        ))}
      </div>
      <div className="dd-pool">
        {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: 'Порядок неверный — нажмите на блок, верните его и разложите заново' })}</span>}
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>
      {solved && <div className="dd-done">✓ {tr(doneText) || tr({ uz: "To'g'ri tartib!", ru: 'Правильный порядок!' })}</div>}
      {wrong && !solved && <div className="dd-wrong">{tr({ uz: '⚠️ Tartib xato — qayta joylang.', ru: '⚠️ Порядок неверный — разложите заново.' })}</div>}
    </div>
  );
}

// ===== SCREEN 0 — HOOK: lentaga qo'ydingiz, lekin hech kim tekshirmadi =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [tried, setTried] = useState(!!storedAnswer);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const OPTS = [
    { id: 'a', label: { uz: "Har push'dan keyin o'zim qo'lda npm test yozaman", ru: 'После каждого пуша буду сам вручную запускать npm test' } },
    { id: 'b', label: { uz: "GitHub Actions sozlayman — lenta har push'da o'zi tekshiradi", ru: 'Настрою GitHub Actions — лента сама проверит каждый пуш' } },
    { id: 'c', label: { uz: "Testni umuman tashlab qo'yaman", ru: 'Вообще откажусь от тестов' } }
  ];
  const poke = () => { setTried(true); setSc(n => n + 1); };
  const pick = (v) => { if (picked !== null || !tried) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 880 }}>{tr({ uz: <>Chamadonni lentaga qo'ydingiz (push) — endi uni <span className="italic" style={{ color: T.accent }}>kim tekshiradi</span>?</>, ru: <>Вы положили чемодан на ленту (push) — а <span className="italic" style={{ color: T.accent }}>кто его проверит</span>?</> })}</h1>
        <Mentor>{tr({ uz: "O'tgan darsda lenta g'oyasini tushundik. Endi lentaga qo'yib ko'ring (push) — va kim tekshirishini kuzating.", ru: 'На прошлом уроке мы разобрали идею ленты. Теперь положите чемодан на ленту (push) — и посмотрите, кто его проверит.' })}</Mentor>
        <Zoomable><Split>
          <Col>
            <Term title="bash" minH={120}>
              <TLine cmd="git push origin main" />
              {tried && <>
                <TLine out="main -> main" />
                <TLine out={tr({ uz: "✓ chamadon lentaga qo'yildi", ru: '✓ чемодан положен на ленту' })} col={CODE.str} />
                <TLine out={tr({ uz: '... skaner? hech kim ishga tushirmadi', ru: '... сканер? никто не запустил' })} col="#FF8A7A" />
              </>}
            </Term>
            <button className={`btn-soft ${tried ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} onClick={poke} disabled={tried}>{tried ? tr({ uz: "✓ Lentaga qo'yildi", ru: '✓ Положено на ленту' }) : '▶ git push'}</button>
            {tried && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Chamadon lentaga tushdi — lekin <b>uni hech kim tekshirmadi</b>. Ichida nima borligi noma'lum. Buni avtomatlashtirsak-chi?</>, ru: <>Чемодан попал на ленту — но <b>его никто не проверил</b>. Что внутри — неизвестно. А если это автоматизировать?</> })}</p></div>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: "Har push'da tekshiruvni qanday avtomatik ishga tushiramiz?", ru: 'Как автоматически запускать проверку при каждом пуше?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null || !tried} style={{ opacity: !tried ? 0.55 : 1 }} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>);
              })}
            </div>
            {!tried && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Avval push'ni bosing ←", ru: 'Сначала нажмите push ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Aynan! <b>GitHub Actions</b> — repozitoriyangiz ichidagi bepul lenta tizimi. Unga bir marta yo'l xaritasi (ci.yml) berasiz, u <b>har push'da</b> lentani o'zi aylantiradi. Bugun shu yo'l xaritasini o'zingiz yozasiz.</>, ru: <>Именно! <b>GitHub Actions</b> — бесплатная система ленты прямо в вашем репозитории. Один раз даёте ей карту маршрута (ci.yml) — и она <b>при каждом пуше</b> сама крутит ленту. Сегодня вы напишете эту карту сами.</> })}</p>}
          </Col>
        </Split></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: { uz: "GitHub Actions nima va yo'l xaritasi qayerda yashaydi", ru: 'Что такое GitHub Actions и где живёт карта маршрута' }, tag: '.github/workflows' },
    { text: { uz: "Yo'l xaritasi ierarxiyasi", ru: 'Иерархия карты маршрута' }, tag: { uz: 'Workflow → Nuqta → Amal', ru: 'Workflow → Точка → Шаг' } },
    { text: { uz: 'START SIGNALI va LENTA MASHINASI', ru: 'СТАРТ-СИГНАЛ и МАШИНА ЛЕНТЫ' }, tag: 'on: · runs-on:' },
    { text: { uz: "O'z yo'l xaritangizni yozib, lentani aylantirasiz", ru: 'Напишете свою карту маршрута и запустите ленту' }, tag: "npm test" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const Preview = (
    <Col>
      <p className="flow-label">{tr({ uz: "Dars oxirida — har push'da shu chiqadi", ru: 'К концу урока — вот что будет при каждом пуше' })}</p>
      <BeltRun status="pass" />
      <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Lentaga qo'ydingiz → GitHub Actions o'zi chamadonni oldi, tekshirdi va <b style={{ color: T.success }}>yashil chiroq ✓</b> berdi. Hech narsa qo'lda emas.</>, ru: <>Вы положили на ленту → GitHub Actions сам взял чемодан, проверил и дал <b style={{ color: T.success }}>зелёный свет ✓</b>. Ничего вручную.</> })}</p></div>
    </Col>
  );
  const StepsB = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 4 qadam', ru: '4 шага на сегодня' })}</p>
      <ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span><span className="step-tag">{tr(s.tag)}</span></span></li>))}</ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Lentani <span className="italic" style={{ color: T.accent }}>o'zimiz</span> qanday quramiz?</>, ru: <>Как нам <span className="italic" style={{ color: T.accent }}>самим</span> построить ленту?</> })}</h2></div>
        <Mentor>{tr({ uz: <>GitHub Actions — lentani boshqaradigan tizim. Siz unga kichik bir <b style={{ color: T.ink }}>yo'l xaritasi</b> (ci.yml) yozasiz, qolganini u bajaradi. Mana natija va 4 qadam.</>, ru: <>GitHub Actions — система, которая управляет лентой. Вы пишете ей небольшую <b style={{ color: T.ink }}>карту маршрута</b> (ci.yml), остальное она делает сама. Вот результат и 4 шага.</> })}</Mentor>
        {!isNarrow ? (<Zoomable><Split>{Preview}{StepsB}</Split></Zoomable>)
          : !showSteps ? <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{Preview}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "4 qadamni ko'rish", ru: 'Показать 4 шага' })}</button></div>
            : <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Natijani ko'rish", ru: '↩ Показать результат' })}</button>{StepsB}</div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — GITHUB ACTIONS NIMA (lenta tizimi) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [show, setShow] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = show;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · lenta tizimi', ru: 'Понятие · система ленты' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Lentani ko'ring", ru: 'Посмотрите ленту' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>GitHub Actions — bu <span className="italic" style={{ color: T.accent }}>aslida nima</span>?</>, ru: <>GitHub Actions — что это <span className="italic" style={{ color: T.accent }}>на самом деле</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>GitHub Actions — GitHub'ning o'z xizmati: <b style={{ color: T.ink }}>bepul</b>, alohida server kerak emas. Siz yo'l xaritasini yozasiz, lenta har push'da o'zi aylanadi. Natijani <b style={{ color: T.ink }}>Actions</b> bo'limida ko'rasiz. Tugmani bosing.</>, ru: <>GitHub Actions — собственный сервис GitHub: <b style={{ color: T.ink }}>бесплатный</b>, отдельный сервер не нужен. Вы пишете карту маршрута — и лента сама крутится при каждом пуше. Результат смотрите во вкладке <b style={{ color: T.ink }}>Actions</b>. Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="frame" style={{ borderLeft: `4px solid ${T.danger}` }}><p className="note-h" style={{ color: T.danger }}>{tr({ uz: '🐌 Lentasiz', ru: '🐌 Без ленты' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Lentaga qo'yasiz — keyin o'zingiz eslab, qo'lda <span className="mono">npm test</span> yozasiz. Eslamasangiz — tekshiruv yo'q.</>, ru: <>Пушите — а потом сами вспоминаете и вручную набираете <span className="mono">npm test</span>. Забыли — проверки нет.</> })}</p></div>
            <button className={`btn ${show ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} disabled={show} onClick={() => { setShow(true); setSc(n => n + 1); }}>{show ? tr({ uz: "✓ Ko'rdingiz", ru: '✓ Посмотрели' }) : tr({ uz: 'Lenta bilan-chi?', ru: 'А с лентой?' })}</button>
          </Col>
          <Col>
            {show
              ? <><div className="frame fade-step" style={{ borderLeft: `4px solid ${T.success}` }}><p className="note-h" style={{ color: T.success }}>🛫 GitHub Actions</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Push'ni <b>sezadi</b> va yo'l xaritasi bo'yicha lentani o'zi aylantiradi. Bepul, GitHub ichida, har safar. Natija — Actions bo'limida.</>, ru: <><b>Замечает</b> пуш и сам крутит ленту по карте маршрута. Бесплатно, внутри GitHub, каждый раз. Результат — во вкладке Actions.</> })}</p></div><div className="fade-step"><BeltRun status="pass" /></div></>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Tugmani bosing ←', ru: 'Нажмите кнопку ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Lenta tayyor turibdi — faqat unga yo'l xaritasi berishimiz kerak. Bu xarita qayerda saqlanadi?", ru: 'Лента наготове — осталось дать ей карту маршрута. А где эта карта хранится?' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — QAYERDA YASHAYDI (.github/workflows) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [revealed, setRevealed] = useState(storedAnswer ? 3 : 0);
  const [sc, setSc] = useState(0);
  const done = revealed >= 3;
  const NOTES = [
    { uz: 'Loyiha ildizida maxsus papka — .github bilan boshlanadi.', ru: 'В корне проекта — специальная папка, начинается с .github.' },
    { uz: "Uning ichida workflows papkasi — barcha yo'l xaritalari shu yerda.", ru: 'Внутри неё — папка workflows: все карты маршрута лежат здесь.' },
    { uz: "ci.yml — bizning yo'l xaritamiz. GitHub bu papkani o'zi topadi va ishga tushiradi.", ru: 'ci.yml — наша карта маршрута. GitHub сам находит эту папку и запускает её.' }
  ];
  const go = () => { setRevealed(r => Math.min(r + 1, 3)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · joylashuv', ru: 'Понятие · расположение' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Yo'lni oching", ru: 'Откройте путь' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yo'l xaritasi <span className="italic" style={{ color: T.accent }}>qayerda</span> saqlanadi?</>, ru: <>Карта маршрута — <span className="italic" style={{ color: T.accent }}>где</span> она хранится?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yo'l xaritasi aniq bir joyga yoziladi: <span className="mono">.github/workflows/ci.yml</span>. Bu nomlar <b style={{ color: T.ink }}>aniq shunday</b> bo'lishi kerak — GitHub shu papkani o'zi qidiradi. Yo'lni qadam-baqadam oching.</>, ru: <>Карта маршрута пишется в строго определённое место: <span className="mono">.github/workflows/ci.yml</span>. Названия должны быть <b style={{ color: T.ink }}>именно такими</b> — GitHub сам ищет эту папку. Откройте путь шаг за шагом.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <FileTree revealed={revealed} />
            <button className={`btn ${done ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} disabled={done} onClick={go}>{done ? tr({ uz: '✓ ci.yml topildi', ru: '✓ ci.yml найден' }) : (revealed === 0 ? tr({ uz: '+ .github papkasini ochish', ru: '+ открыть папку .github' }) : revealed === 1 ? tr({ uz: '+ workflows papkasini ochish', ru: '+ открыть папку workflows' }) : tr({ uz: '+ ci.yml faylini ochish', ru: '+ открыть файл ci.yml' }))}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'izoh', ru: 'пояснение' })}</p>
            {revealed === 0
              ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Papkani oching ←', ru: 'Откройте папку ←' })}</p></div>
              : <div className="sk-info fade-step" key={revealed}><p className="body" style={{ margin: 0, color: T.ink }}>{tr(NOTES[revealed - 1])}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Yodda tuting: <span className="mono">.github/workflows/</span> ichidagi har <span className="mono">.yml</span> fayl — alohida yo'l xaritasi. Endi shu faylning ichini yozamiz.</>, ru: <>Запомните: каждый <span className="mono">.yml</span>-файл внутри <span className="mono">.github/workflows/</span> — отдельная карта маршрута. Теперь напишем содержимое этого файла.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    questionText="Yo'l xaritasi (workflow) fayli qayerda saqlanadi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Yo'l xaritasi fayli <span className="italic" style={{ color: T.accent }}>qayerda</span> saqlanadi?</>, ru: <>Файл карты маршрута — <span className="italic" style={{ color: T.accent }}>где</span> он хранится?</> })}</h2></>}
    options={[{ uz: 'src/ papkasi ichida — bu yerga hech qachon yozilmaydi', ru: 'В папке src/ — там, где лежит код проекта' }, { uz: 'package.json fayli ichida', ru: 'Внутри файла package.json' }, { uz: '.github/workflows/ papkasida, .yml fayl sifatida', ru: 'В папке .github/workflows/, в виде .yml-файла' }, { uz: "Hech qayerda — GitHub o'zi biladi", ru: 'Нигде — GitHub сам всё знает' }]} correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! Yo'l xaritasi fayllari .github/workflows/ papkasida .yml kengaytmasi bilan yashaydi. GitHub bu papkani avtomatik topadi.", ru: 'Верно! Файлы карт маршрута живут в папке .github/workflows/ с расширением .yml. GitHub находит эту папку автоматически.' }}
    explainWrong={{
      0: { uz: "src/ — bu loyiha kodi uchun. Yo'l xaritasi esa .github/workflows/ ichida bo'ladi.", ru: 'src/ — для кода проекта. А карта маршрута живёт в .github/workflows/.' },
      1: { uz: "package.json — paketlar va scriptlar uchun. Yo'l xaritasi alohida .yml faylda.", ru: 'package.json — для пакетов и скриптов. Карта маршрута — отдельный .yml-файл.' },
      3: { uz: "GitHub aniq joyni qidiradi: .github/workflows/. Bo'lmasa — hech narsa ishlamaydi.", ru: 'GitHub ищет строго определённое место: .github/workflows/. Иначе ничего не заработает.' },
      default: { uz: "To'g'risi — .github/workflows/ papkasidagi .yml fayl.", ru: 'Правильный ответ — .yml-файл в папке .github/workflows/.' }
    }} />
);

// ===== SCREEN 5 — YAML (bo'sh joy = ierarxiya) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const PARTS = [
    { id: 'kv', t: 'key: value', d: { uz: 'Sodda juftlik: kalit va qiymat. Masalan name: CI yoki runs-on: ubuntu-latest.', ru: 'Простая пара: ключ и значение. Например name: CI или runs-on: ubuntu-latest.' } },
    { id: 'list', t: { uz: "- ro'yxat", ru: '- список' }, d: { uz: "Chiziqcha (-) ro'yxat elementi. steps: ostidagi har bir - — alohida amal.", ru: 'Дефис (-) — элемент списка. Каждый - под steps: — отдельный шаг.' } },
    { id: 'indent', t: { uz: "bo'sh joy = ierarxiya", ru: 'отступ = иерархия' }, d: { uz: "Chap tomondagi bo'sh joy kim kimning ichidaligini bildiradi. steps: — nuqta ichida, nuqta — yo'l xaritasi ichida.", ru: 'Отступ слева показывает, кто внутри кого. steps: — внутри точки, а точка — внутри карты маршрута.' } }
  ];
  const [seen, setSeen] = useState(storedAnswer ? new Set(PARTS.map(p => p.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= PARTS.length;
  const tap = (id) => { setActive(id); setSeen(prev => { const s = new Set(prev); s.add(id); return s; }); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = PARTS.find(p => p.id === active);
  const FullYml = (
    <CodeFile name=".github/workflows/ci.yml" minH={180}>
      <At>name</At>{': CI'}{'\n'}
      <At>on</At>{': '}<Kw>push</Kw>{'\n'}
      <At>jobs</At>{':'}{'\n'}
      {'  '}<At>test</At>{':'}{'\n'}
      {'    '}<At>runs-on</At>{': ubuntu-latest'}{'\n'}
      {'    '}<At>steps</At>{':'}{'\n'}
      {'      - '}<At>uses</At>{': '}<St>actions/checkout@v4</St>{'\n'}
      {'      - '}<At>run</At>{': '}<St>npm test</St>
    </CodeFile>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · YAML', ru: 'Понятие · YAML' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `3 qoidani ko'ring (${seen.size}/3)`, ru: `Посмотрите 3 правила (${seen.size}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>YAML nima — nega <span className="italic" style={{ color: T.accent }}>bo'sh joy</span> muhim?</>, ru: <>Что такое YAML — почему <span className="italic" style={{ color: T.accent }}>отступ</span> так важен?</> })}</h2></div>
        <Mentor>{tr({ uz: <>ci.yml — YAML tilida. Unda qavs yo'q: <b style={{ color: T.ink }}>bo'sh joy (chekinish)</b> qaysi qator qaysining ichida turishini bildiradi. 3 ta qoidani bosib o'rganing — keyin yo'l xaritasi tushunarli bo'ladi.</>, ru: <>ci.yml написан на языке YAML. Скобок в нём нет: <b style={{ color: T.ink }}>отступ (пробелы слева)</b> показывает, какая строка внутри какой. Нажмите и изучите 3 правила — после них карта маршрута станет понятной.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>{FullYml}</Col>
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {PARTS.map(p => <button key={p.id} className={`gchip ${seen.has(p.id) ? '' : 'tap-hint'}`} onClick={() => tap(p.id)} style={seen.has(p.id) ? { boxShadow: `inset 0 0 0 1.5px ${T.success}`, color: T.success } : undefined}>{seen.has(p.id) ? '✓ ' : ''}{tr(p.t)}</button>)}
            </div>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="note-h"><span className="mono" style={{ color: T.accent }}>{tr(cur.t)}</span></p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.d)}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Qoidani bosing ←', ru: 'Нажмите на правило ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Bo'sh joy noto'g'ri bo'lsa — yo'l xaritasi ishlamaydi. Endi ierarxiyaning 3 darajasini ko'ramiz.", ru: 'Если отступ неправильный — карта маршрута не сработает. Теперь посмотрим 3 уровня иерархии.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — WORKFLOW → JOB → STEP = YO'L XARITASI → NUQTA → AMAL =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const LEVELS = [
    { id: 'workflow', icon: '🗺️', t: 'Workflow', en: { uz: "yo'l xaritasi", ru: 'карта маршрута' }, d: { uz: "Butun lenta rejasi — bitta ci.yml fayl. name: va on: shu darajada. Ichida bir yoki bir nechta nuqta (job) bo'ladi.", ru: 'Весь план ленты — один файл ci.yml. name: и on: живут на этом уровне. Внутри — одна или несколько точек (job).' } },
    { id: 'job', icon: '🛑', t: 'Job', en: { uz: 'nuqta', ru: 'точка' }, d: { uz: "Bitta tekshiruv nuqtasi — o'z mashinasida (runner) ishlaydi. runs-on: shu yerda. Bir nechta nuqta parallel ishlashi mumkin.", ru: 'Одна точка проверки — работает на своей машине (runner). runs-on: пишется здесь. Несколько точек могут работать параллельно.' } },
    { id: 'step', icon: '🔧', t: 'Step', en: { uz: 'amal', ru: 'шаг' }, d: { uz: "Bitta harakat: buyruq (run:) yoki tayyor amal (uses:). Amallar ketma-ket, yuqoridan pastga bajariladi.", ru: 'Одно действие: команда (run:) или готовый шаг (uses:). Шаги выполняются по порядку, сверху вниз.' } }
  ];
  const [seen, setSeen] = useState(storedAnswer ? new Set(LEVELS.map(l => l.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= LEVELS.length;
  const tap = (id) => { setActive(id); setSeen(prev => { const s = new Set(prev); s.add(id); return s; }); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = LEVELS.find(l => l.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ierarxiya', ru: 'Понятие · иерархия' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `3 darajani ko'ring (${seen.size}/3)`, ru: `Посмотрите 3 уровня (${seen.size}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yo'l xaritasi ichida nima — <span className="italic" style={{ color: T.accent }}>Workflow → Job → Step</span> qanday joylashgan?</>, ru: <>Что внутри карты маршрута — как устроены <span className="italic" style={{ color: T.accent }}>Workflow → Job → Step</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bu darsning markazi. <b style={{ color: T.ink }}>Yo'l xaritasi</b> ichida <b style={{ color: T.ink }}>nuqta</b>, nuqta ichida <b style={{ color: T.ink }}>amal</b>. Har darajani bosing.</>, ru: <>Это сердце урока. Внутри <b style={{ color: T.ink }}>карты маршрута</b> — <b style={{ color: T.ink }}>точка</b>, внутри точки — <b style={{ color: T.ink }}>шаг</b>. Нажмите на каждый уровень.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LEVELS.map((l, i) => (
                <button key={l.id} className={`vcard ${seen.has(l.id) ? '' : 'tap-hint'}`} onClick={() => tap(l.id)} style={{ marginLeft: i * 16, boxShadow: active === l.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : undefined }}>
                  <span className="role-ico">{l.icon}</span>
                  <span className="vlbl">{l.t}</span>
                  <span className="role-r mono">{tr(l.en)}</span>
                  <span className="vseen" style={{ color: seen.has(l.id) ? T.success : T.ink3 }}>{seen.has(l.id) ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="frame fade-step" key={active}><p className="note-h"><span style={{ fontSize: 20, marginRight: 6 }}>{cur.icon}</span>{cur.t} <span className="mono" style={{ color: T.ink3, marginLeft: 6, fontSize: 12 }}>({tr(cur.en)})</span></p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.d)}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Darajani bosing ←', ru: 'Нажмите на уровень ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Workflow ⊃ Job ⊃ Step. ci.yml'da bu bo'sh joy orqali ko'rinadi: steps nuqta ichida, nuqta esa yo'l xaritasi ichida.", ru: 'Workflow ⊃ Job ⊃ Step. В ci.yml это видно по отступам: steps внутри точки, а точка — внутри карты маршрута.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — TEST 2 =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    questionText="Workflow, job va step qanday joylashgan?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <>Yo'l xaritasi, nuqta va amal qanday <span className="italic" style={{ color: T.accent }}>joylashgan</span>?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>устроены</span> карта маршрута, точка и шаг?</> })}</h2></>}
    options={[{ uz: "Yo'l xaritasi ichida nuqta, nuqta ichida amal", ru: 'Внутри карты маршрута — точка, внутри точки — шаг' }, { uz: "Amal ichida nuqta, nuqta ichida yo'l xaritasi", ru: 'Внутри шага — точка, внутри точки — карта маршрута' }, { uz: 'Uchchalasi ham bir xil darajada', ru: 'Все три — на одном уровне' }, { uz: "Nuqta ichida yo'l xaritasi, yo'l xaritasi ichida amal", ru: 'Внутри точки — карта маршрута, внутри карты — шаг' }]} correctIdx={0}
    explainCorrect={{ uz: "To'g'ri! Workflow ⊃ Job ⊃ Step. Eng katta — yo'l xaritasi, uning ichida nuqtalar, har nuqta ichida amallar.", ru: 'Верно! Workflow ⊃ Job ⊃ Step. Самое большое — карта маршрута, в ней точки, в каждой точке — шаги.' }}
    explainWrong={{
      1: { uz: "Teskari — eng katta yo'l xaritasi, eng kichigi amal. Amal hech narsani o'z ichiga olmaydi.", ru: 'Наоборот — самое большое карта маршрута, самое маленькое шаг. Шаг ничего в себя не вмещает.' },
      2: { uz: "Bir xil daraja emas — ular ichma-ich joylashgan (ierarxiya).", ru: 'Уровни не одинаковые — они вложены друг в друга (иерархия).' },
      3: { uz: "Yo'l xaritasi eng tashqarida — u nuqta ichiga kira olmaydi.", ru: 'Карта маршрута — самая внешняя, она не поместится внутри точки.' },
      default: { uz: "To'g'risi: Yo'l xaritasi ⊃ Nuqta ⊃ Amal.", ru: 'Правильно: карта маршрута ⊃ точка ⊃ шаг.' }
    }} />
);

// ===== SCREEN 8 — START SIGNALI (on:) =====
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const TRIG = [
    { id: 'push', t: 'push', d: { uz: "Chamadon lentaga qo'yilganda (push) — eng keng tarqalgan. Biz aynan shuni ishlatamiz.", ru: 'Когда чемодан кладут на ленту (push) — самый распространённый вариант. Именно его мы и используем.' }, spin: { uz: "har push'da", ru: 'при каждом пуше' } },
    { id: 'pull_request', t: 'pull_request', d: { uz: 'PR ochilganda/yangilanganda — kodni birlashtirishdan oldin tekshirish uchun.', ru: 'Когда открывается или обновляется PR — чтобы проверить код до слияния.' }, spin: { uz: 'PR ochilganda', ru: 'при открытии PR' } },
    { id: 'schedule', t: 'schedule', d: { uz: 'Belgilangan vaqtda (cron), masalan har kecha — vaqtli tekshiruvlar uchun.', ru: 'В назначенное время (cron), например каждую ночь — для проверок по расписанию.' }, spin: { uz: 'har kecha', ru: 'каждую ночь' } }
  ];
  const [seen, setSeen] = useState(storedAnswer ? new Set(TRIG.map(t => t.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= TRIG.length;
  const tap = (id) => { setActive(id); setSeen(prev => { const s = new Set(prev); s.add(id); return s; }); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = TRIG.find(t => t.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · START SIGNALI', ru: 'Понятие · СТАРТ-СИГНАЛ' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Signallarni ko'ring (${seen.size}/3)`, ru: `Посмотрите сигналы (${seen.size}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="mono" style={{ color: T.accent }}>on:</span> — lenta <span className="italic" style={{ color: T.accent }}>qachon</span> aylanadi?</>, ru: <><span className="mono" style={{ color: T.accent }}>on:</span> — <span className="italic" style={{ color: T.accent }}>когда</span> закрутится лента?</> })}</h2></div>
        <Mentor>{tr({ uz: <><span className="mono">on:</span> — yo'l xaritasining <b style={{ color: T.ink }}>START SIGNALI</b>: qaysi hodisa lentani aylantiradi. Bizning maqsad — <span className="mono">on: push</span>. Uchala signalni bosib ko'ring va lenta qachon aylanishini ko'ring.</>, ru: <><span className="mono">on:</span> — <b style={{ color: T.ink }}>СТАРТ-СИГНАЛ</b> карты маршрута: какое событие запускает ленту. Наша цель — <span className="mono">on: push</span>. Понажимайте все три сигнала и посмотрите, когда крутится лента.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name="ci.yml" minH={90}>
              <At>name</At>{': CI'}{'\n'}
              <At>on</At>{': '}<Kw>{active || 'push'}</Kw>{'   '}<Cm>{tr({ uz: '# START SIGNALI', ru: '# СТАРТ-СИГНАЛ' })}</Cm>{'\n'}
              <At>jobs</At>{':'}{' ...'}
            </CodeFile>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {TRIG.map(t => <button key={t.id} className={`gchip ${seen.has(t.id) ? '' : 'tap-hint'}`} onClick={() => tap(t.id)} style={seen.has(t.id) ? { boxShadow: `inset 0 0 0 1.5px ${T.success}`, color: T.success } : undefined}>{seen.has(t.id) ? '✓ ' : ''}{t.t}</button>)}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="note-h"><span className="mono" style={{ color: T.accent }}>on: {cur.t}</span></p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.d)}</p><p className="small mono" style={{ margin: '8px 0 0', color: T.success, fontWeight: 700 }}>{tr({ uz: '🔄 Lenta aylanadi:', ru: '🔄 Лента крутится:' })} {tr(cur.spin)}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Signalni bosing ←', ru: 'Нажмите на сигнал ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Biz <span className="mono">on: push</span> ishlatamiz — har push'da tekshiruv boshlansin. <b>on: bo'sh qolsa — lenta umuman aylanmaydi.</b> Endi nuqta qaysi mashinada ishlashini ko'ramiz.</>, ru: <>Мы используем <span className="mono">on: push</span> — пусть проверка стартует при каждом пуше. <b>Если on: пустой — лента вообще не закрутится.</b> Теперь посмотрим, на какой машине работает точка.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — LENTA MASHINASI (runs-on) =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [show, setShow] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = show;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · LENTA MASHINASI', ru: 'Понятие · МАШИНА ЛЕНТЫ' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Mashinani ko'ring", ru: 'Посмотрите машину' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="mono" style={{ color: T.accent }}>runs-on</span> — nuqta <span className="italic" style={{ color: T.accent }}>qaysi mashinada</span> ishlaydi?</>, ru: <><span className="mono" style={{ color: T.accent }}>runs-on</span> — <span className="italic" style={{ color: T.accent }}>на какой машине</span> работает точка?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Tekshiruv bir joyda ishlashi kerak. <span className="mono">runs-on: ubuntu-latest</span> — GitHub sizga <b style={{ color: T.ink }}>bepul, toza LENTA MASHINASI</b> beradi. Har safar yangi mashinada — toza sharoitda. Tugmani bosing.</>, ru: <>Проверке нужно где-то работать. <span className="mono">runs-on: ubuntu-latest</span> — GitHub выдаёт вам <b style={{ color: T.ink }}>бесплатную, чистую МАШИНУ ЛЕНТЫ</b>. Каждый раз новая машина — чистые условия. Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name="ci.yml" minH={110}>
              <At>jobs</At>{':'}{'\n'}
              {'  '}<At>test</At>{':'}{'\n'}
              {'    '}<At>runs-on</At>{': '}<Kw>ubuntu-latest</Kw>{'\n'}
              {'    '}<At>steps</At>{': ...'}
            </CodeFile>
            <button className={`btn ${show ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} disabled={show} onClick={() => { setShow(true); setSc(n => n + 1); }}>{show ? tr({ uz: '✓ Mashina tayyorlandi', ru: '✓ Машина готова' }) : tr({ uz: '▶ Mashina qayerdan keladi?', ru: '▶ Откуда берётся машина?' })}</button>
          </Col>
          <Col>
            {show
              ? <Term title={tr({ uz: 'GitHub — lenta mashinasi', ru: 'GitHub — машина ленты' })} minH={90}><TLine out={tr({ uz: '🖥  ubuntu-latest ishga tushdi', ru: '🖥  ubuntu-latest запущен' })} col={CODE.str} /><TLine out={tr({ uz: 'toza muhit · Node, npm tayyor', ru: 'чистая среда · Node и npm готовы' })} /><TLine out={tr({ uz: 'nuqta shu mashinada bajariladi', ru: 'точка выполняется на этой машине' })} /></Term>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Tugmani bosing ←', ru: 'Нажмите кнопку ←' })}</p></div>}
            <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>💡 Linux (ubuntu) eng tez va arzon. Kerak bo'lsa <span className="mono">windows-latest</span> yoki <span className="mono">macos-latest</span> ham bor.</>, ru: <>💡 Linux (ubuntu) — самый быстрый и дешёвый. Если нужно, есть и <span className="mono">windows-latest</span>, и <span className="mono">macos-latest</span>.</> })}</p></div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mashina tayyor. <b>runs-on: bo'sh qolsa — lenta mashinasi tayinlanmaydi</b>, nuqta hech narsa bajara olmaydi. Endi mashinada nima bajarilishini (amallarni) yozamiz.</>, ru: <>Машина готова. <b>Если runs-on: пустой — машина ленты не назначится</b>, и точка ничего не выполнит. Теперь напишем, что делать на машине — шаги.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TEST 3 =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    questionText="ci.yml'da on: push va runs-on: nimaga javob beradi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <><span className="mono" style={{ color: T.accent }}>on: push</span> va <span className="mono" style={{ color: T.accent }}>runs-on</span> <span className="italic" style={{ color: T.accent }}>nimaga</span> javob beradi?</>, ru: <><span className="mono" style={{ color: T.accent }}>on: push</span> и <span className="mono" style={{ color: T.accent }}>runs-on</span> — <span className="italic" style={{ color: T.accent }}>за что</span> они отвечают?</> })}</h2></>}
    options={[{ uz: "Ikkalasi ham aynan bir xil narsani anglatadi, hech qanday farqi yo'q butunlay", ru: 'Оба означают ровно одно и то же, никакой разницы между ними нет' }, { uz: "runs-on kodni serverga o'zi push qilib yuboradi", ru: 'runs-on сам пушит код на сервер' }, { uz: 'on: push — mashinani tanlaydi, runs-on — qachonligini', ru: 'on: push выбирает машину, а runs-on — время запуска' }, { uz: "on: push qachon, runs-on qaysi mashinada ishlashini belgilaydi", ru: 'on: push задаёт когда, runs-on — на какой машине работать' }]} correctIdx={3}
    explainCorrect={{ uz: "To'g'ri! on: push — START SIGNALI (qachon). runs-on — LENTA MASHINASI (qaysi mashinada). Ikkalasi birga bo'lmasa, lenta ishlamaydi.", ru: 'Верно! on: push — СТАРТ-СИГНАЛ (когда). runs-on — МАШИНА ЛЕНТЫ (на какой машине). Без любого из них лента не заработает.' }}
    explainWrong={{
      0: { uz: "Yo'q — ular boshqa-boshqa savollarga javob beradi: biri qachon, biri qayerda.", ru: 'Нет — они отвечают на разные вопросы: один «когда», другой «где».' },
      1: { uz: "runs-on push qilmaydi — u faqat nuqta ishlaydigan mashinani tanlaydi.", ru: 'runs-on ничего не пушит — он лишь выбирает машину, на которой работает точка.' },
      2: { uz: "Aksincha: on: — qachon, runs-on — qayerda.", ru: 'Наоборот: on: — когда, runs-on — где.' },
      default: { uz: "on: push qachon, runs-on qaysi mashinada ishlashini belgilaydi.", ru: 'on: push задаёт когда, runs-on — на какой машине.' }
    }} />
);

// ===== SCREEN 11 — AMAL TURLARI: uses vs run =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const KINDS = [
    { id: 'uses', icon: '🧩', t: 'uses', d: { uz: "Marketplace'dan tayyor amal — boshqalar yozgan 'detal'. Masalan uses: actions/checkout@v4 — repodagi kodni mashinaga olib keladi.", ru: 'Готовый шаг из Marketplace — «деталь», написанная другими. Например uses: actions/checkout@v4 — приносит код из репозитория на машину.' } },
    { id: 'run', icon: '⌨️', t: 'run', d: { uz: "Oddiy terminal buyrug'i — xuddi o'zingiz yozgandek. Masalan run: npm install yoki run: npm test.", ru: 'Обычная команда терминала — как будто вы набрали её сами. Например run: npm install или run: npm test.' } }
  ];
  const [seen, setSeen] = useState(storedAnswer ? new Set(KINDS.map(k => k.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= KINDS.length;
  const tap = (id) => { setActive(id); setSeen(prev => { const s = new Set(prev); s.add(id); return s; }); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = KINDS.find(k => k.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · amal turlari', ru: 'Понятие · виды шагов' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `2 turni ko'ring (${seen.size}/2)`, ru: `Посмотрите 2 вида (${seen.size}/2)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Amal qanday yoziladi — <span className="italic" style={{ color: T.accent }}>uses</span>mi yoki <span className="italic" style={{ color: T.accent }}>run</span>mi?</>, ru: <>Как записать шаг — через <span className="italic" style={{ color: T.accent }}>uses</span> или <span className="italic" style={{ color: T.accent }}>run</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har amal yo tayyor blok chaqiradi (<span className="mono">uses</span>), yo buyruq bajaradi (<span className="mono">run</span>). Ikkalasini bosib ko'ring.</>, ru: <>Каждый шаг либо вызывает готовый блок (<span className="mono">uses</span>), либо выполняет команду (<span className="mono">run</span>). Нажмите на оба.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {KINDS.map(k => (
                <button key={k.id} className={`vcard ${seen.has(k.id) ? '' : 'tap-hint'}`} onClick={() => tap(k.id)} style={{ boxShadow: active === k.id ? `inset 0 0 0 1.5px ${T.accent}, 0 8px 20px -6px rgba(${T.shadowBase},0.2)` : undefined }}>
                  <span className="role-ico">{k.icon}</span>
                  <span className="vlbl mono">{k.t}:</span>
                  <span className="vseen" style={{ color: seen.has(k.id) ? T.success : T.ink3 }}>{seen.has(k.id) ? '✓' : ''}</span>
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="frame fade-step" key={active}><p className="note-h"><span style={{ fontSize: 18, marginRight: 6 }}>{cur.icon}</span><span className="mono" style={{ color: T.accent }}>{cur.t}:</span></p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.d)}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Turini bosing ←', ru: 'Нажмите на вид ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>uses</b> — tayyor detal, <b>run</b> — buyruq. Endi standart amallarning to'g'ri tartibini yig'amiz.</>, ru: <><b>uses</b> — готовая деталь, <b>run</b> — команда. Теперь соберём стандартные шаги в правильном порядке.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — DRAG-DROP: 4 STANDART AMAL TARTIBI =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  const ITEMS = [
    { id: 'checkout', label: '🧩 uses: actions/checkout@v4' },
    { id: 'node', label: '🧩 uses: actions/setup-node@v4' },
    { id: 'install', label: { uz: "⌨️ run: npm install (📦 YIG'ISH)", ru: '⌨️ run: npm install (📦 СБОРКА)' } },
    { id: 'test', label: { uz: '⌨️ run: npm test (🔍 SKANER)', ru: '⌨️ run: npm test (🔍 СКАНЕР)' } }
  ];
  const HINTS = [{ uz: '1 — kodni mashinaga olib keladi', ru: '1 — приносит код на машину' }, { uz: "2 — Node.js o'rnatadi", ru: '2 — устанавливает Node.js' }, { uz: "3 — kutubxonalarni yig'adi", ru: '3 — собирает библиотеки' }, { uz: "4 — kodni skanerdan o'tkazadi", ru: '4 — прогоняет код через сканер' }];
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · tartib', ru: 'Практика · порядок' })} screen={screen} scrollSignal={done ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Amallarni tartiblang', ru: 'Расставьте шаги' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har yo'l xaritasi qaysi <span className="italic" style={{ color: T.accent }}>4 amal</span>dan boshlanadi?</>, ru: <>С каких <span className="italic" style={{ color: T.accent }}>4 шагов</span> начинается почти каждая карта маршрута?</> })}</h2></div>
        <Mentor>{tr({ uz: "Tartib muhim: avval kodni olamiz, Node o'rnatamiz, kutubxonalarni yig'amiz, keyin skaner qilamiz. Bo'laklarni sudrab to'g'ri tartibga joylang.", ru: 'Порядок важен: сначала берём код, ставим Node, собираем библиотеки, потом сканируем. Перетащите блоки в правильном порядке.' })}</Mentor>
        <DragDropOrder items={ITEMS} hints={HINTS} doneText={{ uz: "checkout → setup-node → install → test — to'g'ri tartib!", ru: 'checkout → setup-node → install → test — правильный порядок!' }}
          onSolved={() => { if (!done) { setDone(true); if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); } }} />
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "checkout → setup-node → install → test. Endi bu tartibni yo'l xaritasida o'zingiz yozasiz.", ru: 'checkout → setup-node → install → test. Теперь вы сами запишете этот порядок в карте маршрута.' })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — PARALLEL LENTALAR (matrix) =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [run, setRun] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const LANES = [{ v: 'Node 18' }, { v: 'Node 20' }, { v: 'Node 22' }];
  useEffect(() => { if (run && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [run]);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · PARALLEL LENTALAR', ru: 'Понятие · ПАРАЛЛЕЛЬНЫЕ ЛЕНТЫ' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!run} label={run ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: '3 lentani ishga tushiring', ru: 'Запустите 3 ленты' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta yukni <span className="italic" style={{ color: T.accent }}>3 sharoitda birdan</span> tekshirish — matrix</>, ru: <>Проверить один груз <span className="italic" style={{ color: T.accent }}>сразу в 3 условиях</span> — matrix</> })}</h2></div>
        <Mentor>{tr({ uz: <>Ba'zan bir xil kodni bir nechta Node versiyasida sinash kerak. <span className="mono">matrix</span> yozsangiz — bitta chamadon <b style={{ color: T.ink }}>bir vaqtning o'zida</b> bir nechta PARALLEL LENTADA tekshiriladi. Tugmani bosing.</>, ru: <>Иногда один и тот же код надо проверить на нескольких версиях Node. Напишите <span className="mono">matrix</span> — и один чемодан <b style={{ color: T.ink }}>одновременно</b> проверится на нескольких ПАРАЛЛЕЛЬНЫХ ЛЕНТАХ. Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name="ci.yml" minH={130}>
              {'  '}<At>test</At>{':'}{'\n'}
              {'    '}<At>strategy</At>{':'}{'\n'}
              {'      '}<At>matrix</At>{':'}{'\n'}
              {'        '}<At>node</At>{': ['}<St>18</St>{', '}<St>20</St>{', '}<St>22</St>{']'}{'\n'}
              {'    '}<At>runs-on</At>{': ubuntu-latest'}
            </CodeFile>
            <button className={`btn ${run ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} disabled={run} onClick={() => { setRun(true); setSc(n => n + 1); }}>{run ? tr({ uz: "✓ 3 lenta ishlab bo'ldi", ru: '✓ 3 ленты отработали' }) : tr({ uz: '▶ matrix ishga tushiring', ru: '▶ запустить matrix' })}</button>
          </Col>
          <Col>
            <div className="matrix-lanes">
              {LANES.map((l, i) => (
                <div key={l.v} className={`matrix-lane ${run ? 'go' : ''}`} style={{ animationDelay: `${i * 0.15}s` }}>
                  <span className="matrix-v mono">{l.v}</span>
                  <div className="matrix-track"><span className="matrix-cap" /></div>
                  {run && <span className="matrix-ok">{tr({ uz: "✓ o'tdi", ru: '✓ прошло' })}</span>}
                </div>
              ))}
            </div>
            {run && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "3 lenta bir vaqtda aylandi — kodingiz Node 18, 20 va 22'da birdan sinaldi. Bittasi yiqilsa ham, qaysi versiyada muammo borligi darhol ko'rinadi.", ru: '3 ленты крутились одновременно — ваш код разом проверился на Node 18, 20 и 22. Даже если одна упадёт, сразу видно, в какой версии проблема.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — YAQIN JAVON (cache) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [run, setRun] = useState(!!storedAnswer);
  const [t1, setT1] = useState(0);
  const [t2, setT2] = useState(0);
  const [sc, setSc] = useState(0);
  useEffect(() => {
    if (!run) return;
    const i1 = setInterval(() => setT1(v => Math.min(40, v + 2)), 90);
    const i2 = setInterval(() => setT2(v => Math.min(8, v + 1)), 90);
    return () => { clearInterval(i1); clearInterval(i2); };
  }, [run]);
  const done = run && t1 >= 40 && t2 >= 8;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · YAQIN JAVON', ru: 'Понятие · БЛИЖНЯЯ ПОЛКА' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Ikkalasini solishtiring', ru: 'Сравните оба' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Cache</span> — YAQIN JAVON nima uchun tezlashtiradi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Cache</span> — почему БЛИЖНЯЯ ПОЛКА ускоряет работу?</> })}</h2></div>
        <Mentor>{tr({ uz: <>📦 YIG'ISH har safar noldan yuklasa — sekin. <span className="mono">cache</span> — o'tgan safargi tayyor javobni <b style={{ color: T.ink }}>yaqin joyda</b> saqlab qo'yadi. Ikkala holatni solishtiring.</>, ru: <>Если 📦 СБОРКА каждый раз качает всё с нуля — это медленно. <span className="mono">cache</span> хранит прошлый готовый результат <b style={{ color: T.ink }}>под рукой</b>. Сравните оба случая.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name="ci.yml" minH={90}>
              {'      - '}<At>uses</At>{': '}<St>actions/cache@v4</St>{'\n'}
              {'        '}<At>with</At>{':'}{'\n'}
              {'          '}<At>path</At>{': node_modules'}
            </CodeFile>
            <button className={`btn ${run ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} disabled={run} onClick={() => { setRun(true); setSc(n => n + 1); }}>{run ? tr({ uz: '✓ Solishtirildi', ru: '✓ Сравнили' }) : tr({ uz: '▶ Ikkalasini yoqing', ru: '▶ Включите оба' })}</button>
          </Col>
          <Col>
            <div className="cache-timers">
              <div className="cache-t">
                <span className="flow-label">{tr({ uz: "Cache'siz", ru: 'Без cache' })}</span>
                <div className="cache-bar"><span style={{ width: `${(t1 / 40) * 100}%`, background: T.danger }} /></div>
                <span className="mono cache-n">{t1}s</span>
              </div>
              <div className="cache-t">
                <span className="flow-label">{tr({ uz: 'Cache bilan', ru: 'С cache' })}</span>
                <div className="cache-bar"><span style={{ width: `${(t2 / 8) * 100}%`, background: T.success }} /></div>
                <span className="mono cache-n">{t2}s</span>
              </div>
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Cache bilan 📦 YIG'ISH 5 baravar tezlashdi — noldan yuklamay, yaqin javobdan foydalandi.", ru: 'С cache 📦 СБОРКА ускорилась в 5 раз — не качала с нуля, а взяла готовое с ближней полки.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — TEST 4 =====
const Screen15 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    questionText="uses va run orasidagi farq nima?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-sub" style={{ marginTop: 8 }}>{tr({ uz: <><span className="mono" style={{ color: T.accent }}>uses</span> bilan <span className="mono" style={{ color: T.accent }}>run</span> orasidagi <span className="italic" style={{ color: T.accent }}>farq</span> nima?</>, ru: <>В чём <span className="italic" style={{ color: T.accent }}>разница</span> между <span className="mono" style={{ color: T.accent }}>uses</span> и <span className="mono" style={{ color: T.accent }}>run</span>?</> })}</h2></>}
    options={[{ uz: 'uses va run — ikkalasi ham aynan bir xil ishni bajaradi', ru: 'uses и run делают ровно одно и то же' }, { uz: 'uses tayyor amalni chaqiradi, run buyruq bajaradi', ru: 'uses вызывает готовый шаг, run выполняет команду' }, { uz: 'matrix — faqat bitta lentani tezlashtiradi', ru: 'matrix лишь ускоряет одну-единственную ленту' }, { uz: "cache har doim skanerni o'chirib qo'yadi", ru: 'cache всегда отключает сканер' }]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! uses — marketplace'dagi tayyor amalni chaqiradi (masalan checkout). run — oddiy terminal buyrug'i (masalan npm test).", ru: 'Верно! uses вызывает готовый шаг из Marketplace (например checkout). run — обычная команда терминала (например npm test).' }}
    explainWrong={{
      0: { uz: "Yo'q — uses tayyor blok, run esa siz yozadigan buyruq. Ular boshqa-boshqa.", ru: 'Нет — uses это готовый блок, а run — команда, которую пишете вы. Это разные вещи.' },
      2: { uz: "Aksincha — matrix bir yukni bir nechta PARALLEL lentada birdan tekshiradi.", ru: 'Наоборот — matrix проверяет один груз сразу на нескольких ПАРАЛЛЕЛЬНЫХ лентах.' },
      3: { uz: "Cache skanerni o'chirmaydi — u faqat 📦 YIG'ISHni tezlashtiradi.", ru: 'Cache не выключает сканер — он лишь ускоряет 📦 СБОРКУ.' },
      default: { uz: "uses tayyor amal chaqiradi, run buyruq bajaradi.", ru: 'uses вызывает готовый шаг, run выполняет команду.' }
    }} />
);

// ===== SCREEN 16 — SEYF va MAXFIY KALIT (secrets) =====
const Screen16 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [tried, setTried] = useState(() => new Set(storedAnswer?.tried || []));
  const [sc, setSc] = useState(0);
  const done = tried.has('open') && tried.has('safe');
  const go = (id) => { setTried(prev => { const s = new Set(prev); s.add(id); return s; }); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, tried: ['open', 'safe'] }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · SEYF', ru: 'Понятие · СЕЙФ' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Ikkalasini sinang', ru: 'Испытайте оба' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Maxfiy kalitni <span className="italic" style={{ color: T.accent }}>qayerga</span> yozamiz?</>, ru: <><span className="italic" style={{ color: T.accent }}>Куда</span> записать секретный ключ?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yo'l xaritasida ba'zan API kalit kerak bo'ladi. Uni <b style={{ color: T.danger }}>ochiq yozish</b> yoki <b style={{ color: T.success }}>SEYFga qo'yish</b> mumkin. Ikkalasini sinab ko'ring — oqibati boshqacha.</>, ru: <>Иногда карте маршрута нужен API-ключ. Его можно <b style={{ color: T.danger }}>написать открыто</b> или <b style={{ color: T.success }}>убрать в СЕЙФ</b>. Попробуйте оба варианта — последствия разные.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name={tr({ uz: 'ci.yml (xato)', ru: 'ci.yml (ошибка)' })} minH={60}>
              {'      - '}<At>run</At>{': '}<St>curl -H "Authorization: sk_live_9a8f..."</St>
            </CodeFile>
            <button className={`btn-soft ${tried.has('open') ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} onClick={() => go('open')} disabled={tried.has('open')}>{tried.has('open') ? tr({ uz: '✓ Sinaldi', ru: '✓ Проверено' }) : tr({ uz: "▶ Ochiq yozib ko'rish", ru: '▶ Написать открыто' })}</button>
            {tried.has('open') && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>💥 Kalit ochiq yo'l xaritasida qoldi — repo public bo'lsa, <b>butun dunyo</b> uni ko'rishi mumkin.</>, ru: <>💥 Ключ остался в открытой карте маршрута — если репозиторий публичный, его увидит <b>весь мир</b>.</> })}</p></div>}
          </Col>
          <Col>
            <CodeFile name={tr({ uz: "ci.yml (to'g'ri)", ru: 'ci.yml (правильно)' })} minH={60}>
              {'      - '}<At>run</At>{': '}<St>{"curl -H \"Authorization: ${{ secrets.API_KEY }}\""}</St>
            </CodeFile>
            <button className={`btn-soft ${tried.has('safe') ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} onClick={() => go('safe')} disabled={tried.has('safe')}>{tried.has('safe') ? tr({ uz: '✓ Sinaldi', ru: '✓ Проверено' }) : tr({ uz: "▶ SEYFga qo'yib ko'rish", ru: '▶ Убрать в СЕЙФ' })}</button>
            {tried.has('safe') && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "🔒 Kalit SEYFda (Settings → Secrets) — jurnalda ham, kodda ham hech qachon ochiq ko'rinmaydi.", ru: '🔒 Ключ в СЕЙФЕ (Settings → Secrets) — ни в журнале, ни в коде он никогда не покажется открыто.' })}</p></div>}
          </Col>
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Qoida: maxfiy kalit doim <span className="mono">{"${{ secrets.NOM }}"}</span> orqali — hech qachon to'g'ridan-to'g'ri yozilmaydi.</>, ru: <>Правило: секретный ключ — всегда через <span className="mono">{"${{ secrets.NOM }}"}</span>, и никогда напрямую.</> })}</p></div>}
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 17 — 🛫 MARKAZIY: «YO'L XARITASINI YOZING» (RouteBuilder) =====
const RB_TRIGGERS = [{ id: 'push', t: 'push' }, { id: 'pull_request', t: 'pull_request' }, { id: 'schedule', t: 'schedule' }];
const RB_RUNNERS = [{ id: 'ubuntu-latest', t: 'ubuntu-latest' }, { id: 'windows-latest', t: 'windows-latest' }, { id: 'macos-latest', t: 'macos-latest' }];
const RB_ORDER = ['checkout', 'node', 'install', 'test'];
const RB_CAND = [
  { id: 'checkout', label: '🧩 uses: actions/checkout@v4', real: true },
  { id: 'node', label: '🧩 uses: actions/setup-node@v4', real: true },
  { id: 'install', label: "⌨️ run: npm install", real: true },
  { id: 'test', label: { uz: '⌨️ run: npm test  🔍 SKANER', ru: '⌨️ run: npm test  🔍 СКАНЕР' }, real: true },
  { id: 'pushline', label: '⌨️ run: git push', real: false },
  { id: 'printline', label: "⌨️ run: print('test')", real: false },
];
const RB_LABEL = Object.fromEntries(RB_CAND.map(c => [c.id, c.label]));

function simulateBelt(trigger, runner, steps) {
  if (!trigger) return { key: 'no-trigger', spin: false, phone: 'idle' };
  if (!runner) return { key: 'no-runner', spin: true, machine: false, phone: 'idle' };
  const hasTest = steps.includes('test');
  const hasBad = steps.some(s => !RB_CAND.find(c => c.id === s)?.real);
  const orderOk = JSON.stringify(steps) === JSON.stringify(RB_ORDER);
  if (orderOk) return { key: 'success', spin: true, machine: true, success: true, phone: 'ok' };
  if (!hasTest) return { key: 'no-scan', spin: true, machine: true, success: false, phone: 'bad' };
  if (hasBad) return { key: 'bad-step', spin: true, machine: true, success: false, phone: 'bad' };
  return { key: 'wrong-order', spin: true, machine: true, success: false, phone: 'bad' };
}
const RB_JOURNAL = {
  'no-trigger': [{ uz: '⏸ Lenta START SIGNALINI kutmoqda…', ru: '⏸ Лента ждёт СТАРТ-СИГНАЛ…' }, { uz: "on: bo'sh — hech qachon aylanmaydi.", ru: 'on: пустой — она никогда не закрутится.' }],
  'no-runner': [{ uz: '🔄 START SIGNALI keldi — lenta aylanishga urindi…', ru: '🔄 СТАРТ-СИГНАЛ пришёл — лента попыталась закрутиться…' }, { uz: "✗ runs-on bo'sh — bu nuqta uchun mashina yo'q.", ru: '✗ runs-on пустой — для этой точки нет машины.' }, { uz: 'Hech qanday amal bajarilmadi.', ru: 'Ни один шаг не выполнен.' }],
  'no-scan': [{ uz: '🔄 Lenta aylandi — ubuntu-latest mashinasi tayinlandi.', ru: '🔄 Лента закрутилась — назначена машина ubuntu-latest.' }, { uz: "📦 YIG'ISH ✓", ru: '📦 СБОРКА ✓' }, { uz: "🔍 SKANER — topilmadi, o'tkazib yuborildi ⚠️", ru: '🔍 СКАНЕР — не найден, пропущен ⚠️' }, { uz: "🎁 O'RASH ✓ (tekshirilmagan kod bilan)", ru: '🎁 УПАКОВКА ✓ (с непроверенным кодом)' }, { uz: "✈️ UCHIRISH — yuk yo'lovchi qo'liga uchdi", ru: '✈️ ВЗЛЁТ — груз улетел прямо в руки пассажиру' }, { uz: "💥 Foydalanuvchi buzuq saytni ko'rdi.", ru: '💥 Пользователь увидел сломанный сайт.' }],
  'bad-step': [{ uz: '🔄 Lenta aylandi — ubuntu-latest mashinasi tayinlandi.', ru: '🔄 Лента закрутилась — назначена машина ubuntu-latest.' }, { uz: "📦 YIG'ISH ✓", ru: '📦 СБОРКА ✓' }, { uz: "🔍 SKANER — steps ichida tegishli bo'lmagan amal bor ⚠️", ru: '🔍 СКАНЕР — в steps есть посторонний шаг ⚠️' }, { uz: "🎁 O'RASH ✓", ru: '🎁 УПАКОВКА ✓' }, { uz: "✈️ UCHIRISH — yuk yo'lovchi qo'liga uchdi", ru: '✈️ ВЗЛЁТ — груз улетел прямо в руки пассажиру' }, { uz: "💥 Foydalanuvchi buzuq saytni ko'rdi.", ru: '💥 Пользователь увидел сломанный сайт.' }],
  'wrong-order': [{ uz: '🔄 Lenta aylandi — ubuntu-latest mashinasi tayinlandi.', ru: '🔄 Лента закрутилась — назначена машина ubuntu-latest.' }, { uz: '⚠️ Amallar tartibi xato — SKANER kerakli joyda emas.', ru: '⚠️ Порядок шагов неверный — СКАНЕР стоит не там, где нужно.' }, { uz: "🎁 O'RASH ✓ (noto'g'ri tartibda)", ru: '🎁 УПАКОВКА ✓ (в неверном порядке)' }, { uz: "✈️ UCHIRISH — yuk yo'lovchi qo'liga uchdi", ru: '✈️ ВЗЛЁТ — груз улетел прямо в руки пассажиру' }, { uz: "💥 Foydalanuvchi buzuq saytni ko'rdi.", ru: '💥 Пользователь увидел сломанный сайт.' }],
  'success': [{ uz: '🔄 Lenta aylandi — ubuntu-latest mashinasi tayinlandi.', ru: '🔄 Лента закрутилась — назначена машина ubuntu-latest.' }, { uz: "📦 YIG'ISH ✓", ru: '📦 СБОРКА ✓' }, { uz: '🔍 SKANER ✓', ru: '🔍 СКАНЕР ✓' }, { uz: "🎁 O'RASH ✓", ru: '🎁 УПАКОВКА ✓' }, { uz: '✈️ UCHIRISH ✓ — YASHIL CHIROQ', ru: '✈️ ВЗЛЁТ ✓ — ЗЕЛЁНЫЙ СВЕТ' }, { uz: "✅ Foydalanuvchi yangi saytni ko'rdi.", ru: '✅ Пользователь увидел новый сайт.' }]
};
const Screen17 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [trigger, setTrigger] = useState(storedAnswer?.trigger || '');
  const [runner, setRunner] = useState(storedAnswer?.runner || '');
  const [steps, setSteps] = useState(storedAnswer?.steps || []);
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);
  const [solvedOnce, setSolvedOnce] = useState(!!storedAnswer?.correct);
  const [sc, setSc] = useState(0);
  const sendTimer = useRef(null);
  useEffect(() => () => clearTimeout(sendTimer.current), []);
  const toggleStep = (id) => setSteps(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const send = () => {
    if (sending) return;
    setResult(null); setSending(true); setSc(n => n + 1);
    sendTimer.current = setTimeout(() => {
      const r = simulateBelt(trigger, runner, steps);
      setSending(false); setResult(r); setSc(n => n + 1);
      if (r.success && !solvedOnce) {
        setSolvedOnce(true);
        onAnswer(screen, { stage: 'case', screenIdx: screen, trigger, runner, steps, correct: true, picked: true });
      }
    }, 780);
  };
  return (
    <Stage eyebrow={tr({ uz: "🛫 Markaziy · yo'l xaritasi", ru: '🛫 Центральный · карта маршрута' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!solvedOnce} label={solvedOnce ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Lentani yashil qiling', ru: 'Сделайте ленту зелёной' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yo'l xaritasini <span className="italic" style={{ color: T.accent }}>o'zingiz</span> yozing.</>, ru: <>Напишите карту маршрута <span className="italic" style={{ color: T.accent }}>сами</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>START SIGNALINI, LENTA MASHINASINI va amallarni tanlang, so'ng <b style={{ color: T.ink }}>«🚀 Lentaga qo'ying»</b> bosing. Xaritangiz qanday yozilgan bo'lsa — lenta <b style={{ color: T.ink }}>aynan shunday</b> aylanadi. Xato bo'lsa — tuzatib qayta yuboring.</>, ru: <>Выберите СТАРТ-СИГНАЛ, МАШИНУ ЛЕНТЫ и шаги, затем нажмите <b style={{ color: T.ink }}>«🚀 Положить на ленту»</b>. Как написана ваша карта — <b style={{ color: T.ink }}>ровно так</b> и закрутится лента. Ошиблись — поправьте и отправьте снова.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: '1 · START SIGNALI (on:)', ru: '1 · СТАРТ-СИГНАЛ (on:)' })}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {RB_TRIGGERS.map(t => <button key={t.id} className="gchip" onClick={() => setTrigger(t.id)} style={trigger === t.id ? { boxShadow: `inset 0 0 0 1.5px ${T.accent}`, color: T.accent } : undefined}>{trigger === t.id ? '● ' : ''}{t.t}</button>)}
              {trigger && <button className="gchip" onClick={() => setTrigger('')} style={{ color: T.ink3 }}>{tr({ uz: '✕ tozalash', ru: '✕ сбросить' })}</button>}
            </div>
            <p className="flow-label" style={{ marginTop: 6 }}>{tr({ uz: '2 · LENTA MASHINASI (runs-on)', ru: '2 · МАШИНА ЛЕНТЫ (runs-on)' })}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {RB_RUNNERS.map(r => <button key={r.id} className="gchip" onClick={() => setRunner(r.id)} style={runner === r.id ? { boxShadow: `inset 0 0 0 1.5px ${T.accent}`, color: T.accent } : undefined}>{runner === r.id ? '● ' : ''}{r.t}</button>)}
              {runner && <button className="gchip" onClick={() => setRunner('')} style={{ color: T.ink3 }}>{tr({ uz: '✕ tozalash', ru: '✕ сбросить' })}</button>}
            </div>
            <p className="flow-label" style={{ marginTop: 6 }}>{tr({ uz: '3 · AMALLAR (steps) — bosgan tartibingizda yoziladi', ru: '3 · ШАГИ (steps) — запишутся в порядке нажатий' })}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {RB_CAND.map(c => <button key={c.id} className="pick-row" style={{ width: 'auto', boxShadow: steps.includes(c.id) ? `inset 0 0 0 1.5px ${T.success}` : undefined }} onClick={() => toggleStep(c.id)}><span>{tr(c.label)}</span><span className="pick-plus">{steps.includes(c.id) ? '✓' : '+'}</span></button>)}
            </div>
            <CodeFile name=".github/workflows/ci.yml" minH={100}>
              <At>on</At>{': '}{trigger ? <Kw>{trigger}</Kw> : <span className="line-empty">___</span>}{'\n'}
              <At>runs-on</At>{': '}{runner ? <Kw>{runner}</Kw> : <span className="line-empty">___</span>}{'\n'}
              <At>steps</At>{':'}{'\n'}
              {steps.length === 0
                ? <span className="line-empty">{tr({ uz: "      # amal yo'q", ru: '      # шагов нет' })}</span>
                : steps.map((sid, i) => <React.Fragment key={i}>{i > 0 ? '\n' : ''}{'      - '}{tr(RB_LABEL[sid])}</React.Fragment>)}
            </CodeFile>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={sending} onClick={send}>{sending ? tr({ uz: '● Lenta aylanmoqda…', ru: '● Лента крутится…' }) : tr({ uz: "🚀 Lentaga qo'ying", ru: '🚀 Положить на ленту' })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'natija', ru: 'результат' })}</p>
            {sending
              ? <div className="belt-run spin sending">
                  <span className="belt-light off" />
                  <span className="belt-lbl">{tr({ uz: '🔄 LENTA AYLANMOQDA…', ru: '🔄 ЛЕНТА КРУТИТСЯ…' })}</span>
                  <span className="belt-suitcase" aria-hidden="true">🧳</span>
                </div>
              : !result
              ? <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: "Xaritangizni tayyorlang → «🚀 Lentaga qo'ying» ←", ru: 'Подготовьте карту → «🚀 Положить на ленту» ←' })}</p></div>
              : <>
                <div className={`belt-run ${result.spin ? 'spin' : ''}`}>
                  <span className={`belt-light ${result.success ? 'green' : result.key === 'no-trigger' ? 'off' : 'red'}`} />
                  <span className="belt-lbl">{result.key === 'no-trigger' ? tr({ uz: 'AYLANMAYAPTI', ru: 'НЕ КРУТИТСЯ' }) : result.key === 'no-runner' ? tr({ uz: "MASHINA YO'Q", ru: 'НЕТ МАШИНЫ' }) : result.success ? tr({ uz: 'YASHIL CHIROQ', ru: 'ЗЕЛЁНЫЙ СВЕТ' }) : tr({ uz: 'QIZIL CHIROQ', ru: 'КРАСНЫЙ СВЕТ' })}</span>
                </div>
                <div className="term fade-step">
                  <div className="term-bar"><span className="bb-dots"><i /><i /><i /></span><span className="term-title">{tr({ uz: 'Lenta jurnali', ru: 'Журнал ленты' })}</span></div>
                  <div className="term-body">{RB_JOURNAL[result.key].map((l, i) => { const lt = tr(l); return <TLine key={i} delay={i * 0.12} out={lt} col={lt.includes('💥') || lt.includes('✗') ? '#FF8A7A' : lt.includes('✓') || lt.includes('✅') ? CODE.str : undefined} />; })}</div>
                </div>
                <PhonePreview state={result.phone} />
                {result.success && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="plane-lift">🎉</span> Yo'l xaritangiz to'g'ri! START SIGNALI bor, LENTA MASHINASI bor, amallar to'g'ri tartibda — <span className="plane-lift">✈️</span> samolyot uchdi.</>, ru: <><span className="plane-lift">🎉</span> Ваша карта верна! Есть СТАРТ-СИГНАЛ, есть МАШИНА ЛЕНТЫ, шаги в правильном порядке — <span className="plane-lift">✈️</span> самолёт взлетел.</> })}</p></div>}
                {!result.success && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{result.key === 'no-trigger' ? tr({ uz: "on: bo'sh — lenta hech qachon aylanmaydi. Signal tanlang.", ru: 'on: пустой — лента никогда не закрутится. Выберите сигнал.' }) : result.key === 'no-runner' ? tr({ uz: "runs-on bo'sh — nuqta uchun mashina tayinlanmagan. Mashina tanlang.", ru: 'runs-on пустой — точке не назначена машина. Выберите машину.' }) : result.key === 'no-scan' ? tr({ uz: "🔍 SKANER (npm test) yo'q — buzuq yuk to'g'ridan-to'g'ri uchib ketdi.", ru: '🔍 СКАНЕРА (npm test) нет — сломанный груз улетел без проверки.' }) : result.key === 'bad-step' ? tr({ uz: "Amallar orasida yo'l xaritasiga tegishli bo'lmagan qator bor — uni olib tashlang.", ru: 'Среди шагов есть строка, которой не место в карте маршрута — уберите её.' }) : tr({ uz: "Amallar tartibi xato — checkout → setup-node → install → test tartibida bo'lishi kerak.", ru: 'Порядок шагов неверный — нужно: checkout → setup-node → install → test.' })}</p></div>}
              </>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 18 — YAKUNIY: LENTA JURNALI (debug, real xato imkoniyati, 1-urinish) =====
const S18_JOURNAL = [{ uz: "📦 YIG'ISH ✓", ru: '📦 СБОРКА ✓' }, { uz: "🎁 O'RASH ✓", ru: '🎁 УПАКОВКА ✓' }, { uz: "✈️ UCHIRISH — yuk yo'lovchi qo'liga uchdi", ru: '✈️ ВЗЛЁТ — груз улетел прямо в руки пассажиру' }, { uz: "💥 Foydalanuvchi buzuq saytni ko'rdi", ru: '💥 Пользователь увидел сломанный сайт' }];
const S18_OPTS = [
  { uz: '🔍 SKANER (npm test) bosqichi tashlab ketilgan edi', ru: '🔍 Шаг СКАНЕР (npm test) был пропущен' },
  { uz: "on: push signali noto'g'ri yozilgan edi", ru: 'Сигнал on: push был написан неверно' },
  { uz: "runs-on qatorida mashina ko'rsatilmagan edi", ru: 'В строке runs-on не была указана машина' },
  { uz: 'Internet uzilib, natija yetib bormagan edi', ru: 'Интернет оборвался, и результат не дошёл' }
];
const S18_EXPLAIN = {
  1: { uz: "on: push to'g'ri yozilgan bo'lsa, lenta muammosiz aylandi — jurnalda buni ko'rasiz.", ru: 'on: push написан верно — лента закрутилась без проблем, это видно в журнале.' },
  2: { uz: "Mashina bor edi (📦 YIG'ISH va 🎁 O'RASH bajarildi) — muammo boshqa joyda.", ru: 'Машина была (📦 СБОРКА и 🎁 УПАКОВКА выполнились) — проблема в другом.' },
  3: { uz: "Internet emas — jurnalda barcha amallar muvaffaqiyatli yozilgan, faqat biri yo'q.", ru: 'Дело не в интернете — в журнале все шаги записаны успешно, просто одного не хватает.' },
  default: { uz: "Jurnalni diqqat bilan qaytadan o'qing: qaysi amal umuman ko'rinmayapti?", ru: 'Перечитайте журнал внимательно: какой шаг вообще не появился?' }
};
const Screen18 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [picked, setPicked] = useState(storedAnswer?.uiPicked ?? null);
  const [recapOpen, setRecapOpen] = useState(false);
  const done = picked !== null;
  const correctIdx = 0;
  const pick = (i) => {
    if (done) return;
    setPicked(i);
    const isCorrect = i === correctIdx;
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'Lenta jurnali — qizil chiroq sababi', uiPicked: i, correct: isCorrect, solved: true, picked: isCorrect ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · LENTA JURNALI', ru: 'Финал · ЖУРНАЛ ЛЕНТЫ' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Sababni toping', ru: 'Найдите причину' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qizil chiroq yondi — <span className="italic" style={{ color: T.accent }}>sababini</span> jurnaldan toping.</>, ru: <>Загорелся красный — найдите <span className="italic" style={{ color: T.accent }}>причину</span> в журнале.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Foydalanuvchi telefonida buzuq sayt chiqdi. Quyidagi LENTA JURNALIGA qarang va sababni toping. <b style={{ color: T.accent }}>Faqat bitta urinish bor</b> — diqqat bilan tanlang.</>, ru: <>На телефоне пользователя открылся сломанный сайт. Посмотрите на ЖУРНАЛ ЛЕНТЫ ниже и найдите причину. <b style={{ color: T.accent }}>Попытка всего одна</b> — выбирайте внимательно.</> })}</Mentor>
        <Split>
          <Col>
            <div className="term">
              <div className="term-bar"><span className="bb-dots"><i /><i /><i /></span><span className="term-title">{tr({ uz: 'Lenta jurnali — run #22', ru: 'Журнал ленты — run #22' })}</span></div>
              <div className="term-body">{S18_JOURNAL.map((l, i) => { const lt = tr(l); return <TLine key={i} out={lt} col={lt.includes('💥') ? '#FF8A7A' : lt.includes('✓') ? CODE.str : undefined} />; })}</div>
            </div>
            <PhonePreview state="bad" />
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Nega qizil chiroq yondi?', ru: 'Почему загорелся красный свет?' })}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {S18_OPTS.map((o, i) => {
                let cls = 'option';
                if (done) { if (i === correctIdx) cls += ' option-correct'; else if (i === picked) cls += ' option-picked-wrong'; else cls += ' option-wrong'; }
                return (
                  <button key={i} className={cls} disabled={done} onClick={() => pick(i)} style={{ padding: 'clamp(12px,1.8vw,16px) clamp(14px,2.2vw,20px)', fontSize: 'clamp(14px,1.7vw,16px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="mono small" style={{ minWidth: 20, color: done && i === correctIdx ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                    <span style={{ flex: 1 }}>{tr(o)}</span>
                  </button>
                );
              })}
            </div>
            {done && <div className={picked === correctIdx ? 'frame-success fade-step' : 'frame-warn fade-step'}><p className="body" style={{ margin: 0, color: T.ink }}>{picked === correctIdx ? tr({ uz: "To'g'ri! Jurnalda 🔍 SKANER umuman ko'rinmaydi — u tashlab ketilgan, shuning uchun buzuq yuk to'g'ridan-to'g'ri uchib ketdi.", ru: 'Верно! В журнале 🔍 СКАНЕР вообще не появился — его пропустили, поэтому сломанный груз улетел без проверки.' }) : tr(S18_EXPLAIN[picked] || S18_EXPLAIN.default)}</p>
              {picked !== correctIdx && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: '📖 Короткое повторение — взглянуть на тему ещё раз' })}</button>}
            </div>}
          </Col>
        </Split>
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

const ACHIEVEMENTS = {
  greenLight:   { icon: '🟢', name: 'Green Light',   desc: { uz: "Yo'l xaritasi faylining aniq manzilini topdingiz", ru: 'Вы нашли точный адрес файла карты маршрута' } },
  runwayClear:  { icon: '🛫', name: 'Runway Clear',  desc: { uz: "Amal turlarini — uses va run farqini — to'g'ri aniqladingiz", ru: 'Вы верно определили виды шагов — разницу между uses и run' } },
  routeWriter:  { icon: '🗺️', name: 'Route Writer',  desc: { uz: "O'z yo'l xaritangizni yozib, lentani muvaffaqiyatli aylantirdingiz", ru: 'Вы написали свою карту маршрута и успешно запустили ленту' } },
  logDetective: { icon: '🔍', name: 'Log Detective', desc: { uz: "Jurnaldan qizil chiroq sababini 1-urinishda topdingiz", ru: 'Вы нашли причину красного света в журнале с первой попытки' } },
};
// ❗ FAQAT ma'noli ekranlar: s4/s10 (SCORED test) · s15 (SCORED test) · s17 (markaziy — real oqibat) · s18 (real debug, 1-urinish).
const ACH_TRIGGERS = { s4: 'greenLight', s15: 'runwayClear', s17: 'routeWriter', s18: 'logDetective' };

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

// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 7, 10, 15, 18)
const Q_LABELS = { 4: { uz: "1 — Yo'l xaritasi joyi", ru: '1 — Место карты маршрута' }, 7: { uz: '2 — Ierarxiya', ru: '2 — Иерархия' }, 10: { uz: '3 — Signal & mashina', ru: '3 — Сигнал и машина' }, 15: { uz: '4 — Amal turlari', ru: '4 — Виды шагов' }, 18: { uz: '5 — Jurnal', ru: '5 — Журнал' } };
const QUIZ_MS = 15000;
const QZ_BG_SHAPES = [
  { ch: 'on:',         l: 5,  t: 10, s: 32, d: 19, dl: 0 },
  { ch: 'runs-on',     l: 85, t: 8,  s: 26, d: 23, dl: 1.5 },
  { ch: 'push',        l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'uses',        l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: 'steps',       l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: 'matrix',      l: 66, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: 'cache',       l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'ci.yml',      l: 55, t: 5,  s: 24, d: 22, dl: 0.6 },
  { ch: '✗',           l: 91, t: 42, s: 30, d: 24, dl: 1.3 },
  { ch: '✓',           l: 16, t: 52, s: 30, d: 26, dl: 2.6 },
  { ch: 'checkout',    l: 34, t: 62, s: 18, d: 29, dl: 3.4 },
  { ch: 'secrets',     l: 2,  t: 30, s: 22, d: 28, dl: 3.1 },
  { ch: 'run:',        l: 60, t: 90, s: 22, d: 31, dl: 4.2 },
  { ch: '✈️',          l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3, mexanik ketma-ketlik yo'q).
// 🎓 Metodist: savol matni va variant uzunliklari sayqallanadi · ⚡ Jonli: `correct` qiymatlari sinxron tekshiriladi.
const QUIZ_BANK = [
  { q: { uz: "`.github/workflows/ci.yml` — bu fayl nima?", ru: '`.github/workflows/ci.yml` — что это за файл?' }, opts: [{ uz: "Loyihaning butun manba kodi shu yerda saqlanadi, boshqa hech narsa yo'q", ru: 'Здесь хранится весь исходный код проекта, и больше ничего' }, { uz: "Yo'l xaritasi — lentaning ishini belgilaydi", ru: 'Карта маршрута — она определяет работу ленты' }, { uz: "Foydalanuvchi ko'radigan saytning zaxira nusxasi", ru: 'Резервная копия сайта, который видит пользователь' }, { uz: "GitHub'ning o'zi uchun yashirin ichki sozlamalar", ru: 'Скрытые внутренние настройки самого GitHub' }], correct: 1 },
  { q: { uz: "`on: push` nima uchun kerak?", ru: 'Зачем нужен `on: push`?' }, opts: [{ uz: "Lentani har push'da avtomatik ishga tushiradi", ru: 'Автоматически запускает ленту при каждом пуше' }, { uz: "Repozitoriyni butunlay o'chirib tashlash buyrug'i", ru: 'Команда полностью удалить репозиторий' }, { uz: 'Faqat loyiha hujjatlarini yangilab turish uchun', ru: 'Только чтобы обновлять документацию проекта' }, { uz: "Har push'dan keyin kodni qo'lda serverga joylash kerak bo'ladi", ru: 'После каждого пуша придётся вручную выкладывать код на сервер' }], correct: 0 },
  { q: { uz: "`runs-on: ubuntu-latest` nimani bildiradi?", ru: 'Что означает `runs-on: ubuntu-latest`?' }, opts: [{ uz: "Faqat Ubuntu tizimida yozish mumkin degan ma'no", ru: 'Что писать код можно только в системе Ubuntu' }, { uz: "Loyihaning nomi aynan shunday bo'lishi shart, boshqacha bo'lmaydi", ru: 'Что проект обязан называться именно так и никак иначе' }, { uz: 'Lentani aylantiradigan mashina — GitHub bepul beradi', ru: 'Машина, которая крутит ленту — GitHub даёт её бесплатно' }, { uz: 'Testlar hech qachon ishga tushmaydi degan belgi', ru: 'Знак, что тесты никогда не запустятся' }], correct: 2 },
  { q: { uz: "📦 YIG'ISH nuqtasida nima bajariladi?", ru: 'Что происходит в точке 📦 СБОРКА?' }, opts: [{ uz: "Loyiha kerak qiladigan kutubxonalar o'rnatiladi", ru: 'Устанавливаются библиотеки, которые нужны проекту' }, { uz: "Yozilgan kod o'lcham ramkasi bo'yicha tekshiriladi", ru: 'Код проверяется по рамке-измерителю' }, { uz: "Tayyor sayt foydalanuvchiga to'g'ridan-to'g'ri yuboriladi, hech narsa tekshirilmaydi", ru: 'Готовый сайт сразу отправляется пользователю безо всякой проверки' }, { uz: 'Avvalgi eski yuk qaytadan tiklab olinadi', ru: 'Восстанавливается прошлый старый груз' }], correct: 0 },
  { q: { uz: "🔍 SKANER nuqtasi tushirib qoldirilsa nima bo'ladi?", ru: 'Что будет, если пропустить точку 🔍 СКАНЕР?' }, opts: [{ uz: 'Lenta odatdagidan biroz sekinroq aylanib qoladi, xolos', ru: 'Лента просто будет крутиться чуть медленнее, и всё' }, { uz: "GitHub bu bosqichni avtomatik o'zi qo'shib qo'yadi, siz hech narsa qilmaysiz", ru: 'GitHub сам автоматически добавит этот шаг, вам ничего делать не надо' }, { uz: "Buzuq yuk to'g'ridan-to'g'ri foydalanuvchiga uchib ketadi", ru: 'Сломанный груз улетит прямо к пользователю' }, { uz: 'Faqat ogohlantirish chiqadi, yuk baribir tekshiriladi', ru: 'Выйдет только предупреждение, груз всё равно проверят' }], correct: 2 },
  { q: { uz: 'Amallar (steps) qanday tartibda bajariladi?', ru: 'В каком порядке выполняются шаги (steps)?' }, opts: [{ uz: "Har safar tasodifiy, boshqa-boshqa tartibda ishlaydi, hech qanday qoida yo'q", ru: 'Каждый раз в случайном, разном порядке — никаких правил нет' }, { uz: 'Yozilgan tartibda, yuqoridan pastga ketma-ket bajariladi', ru: 'В написанном порядке, сверху вниз, друг за другом' }, { uz: 'Eng oxirgi yozilgan amal birinchi bajariladi', ru: 'Последний написанный шаг выполняется первым' }, { uz: "Barcha amallar bir vaqtning o'zida, tartibsiz", ru: 'Все шаги одновременно, без всякого порядка' }], correct: 1 },
  { q: { uz: "`uses: actions/checkout@v4` amali nima qiladi?", ru: 'Что делает шаг `uses: actions/checkout@v4`?' }, opts: [{ uz: "Loyihadagi butun kodni izsiz o'chirib tashlaydi", ru: 'Бесследно удаляет весь код проекта' }, { uz: 'Yangi bir lenta mashinasini alohida sotib oladi', ru: 'Отдельно покупает новую машину ленты' }, { uz: "Testlarni siz o'rniga avtomatik yozib beradi, o'zi tekshirib chiqadi", ru: 'Автоматически пишет тесты за вас и сам всё проверяет' }, { uz: 'Repodagi kodni lenta mashinasiga olib keladi', ru: 'Приносит код из репозитория на машину ленты' }], correct: 3 },
  { q: { uz: 'PARALLEL LENTALAR (matrix) nima uchun ishlatiladi?', ru: 'Для чего используются ПАРАЛЛЕЛЬНЫЕ ЛЕНТЫ (matrix)?' }, opts: [{ uz: "Bitta yukni ikki qismga bo'lib yuborish uchun", ru: 'Чтобы разделить один груз на две части и отправить' }, { uz: "Lenta mashinasini butunlay to'xtatib, o'chirish uchun", ru: 'Чтобы полностью остановить и выключить машину ленты' }, { uz: 'Bitta yukni bir nechta sharoitda birdan sinash uchun', ru: 'Чтобы проверить один груз сразу в нескольких условиях' }, { uz: "Faqat rasm fayllarini siqib kichraytirish uchun, boshqa vazifasi yo'q", ru: 'Только чтобы сжимать картинки, других задач нет' }], correct: 2 },
  { q: { uz: 'YAQIN JAVON (cache) nima beradi?', ru: 'Что даёт БЛИЖНЯЯ ПОЛКА (cache)?' }, opts: [{ uz: "Faqat mentorning o'z kompyuterida ishlaydi", ru: 'Работает только на компьютере ментора' }, { uz: 'Har safar hamma narsani qaytadan noldan yuklaydi, hech narsa saqlanmaydi', ru: 'Каждый раз всё заново качает с нуля, ничего не сохраняет' }, { uz: "Skanerlash bosqichini butunlay o'chirib qo'yadi", ru: 'Полностью отключает этап сканирования' }, { uz: 'Noldan yuklamay, tayyor javobdan foydalanib tezlashtiradi', ru: 'Ускоряет работу: берёт готовое, а не качает с нуля' }], correct: 3 },
  { q: { uz: "Maxfiy kalitni to'g'ridan-to'g'ri yo'l xaritasiga ochiq yozsangiz nima bo'ladi?", ru: 'Что будет, если написать секретный ключ прямо в карте маршрута открыто?' }, opts: [{ uz: "Butun dunyo uni ochiq holda ko'rishi mumkin bo'ladi", ru: 'Его сможет увидеть весь мир в открытом виде' }, { uz: "Faqat siz ko'rasiz, boshqa hech kim ko'ra olmaydi, hammasi maxfiy", ru: 'Его увидите только вы, больше никто — всё секретно' }, { uz: "Hech narsa — GitHub uni avtomatik yashirib qo'yadi, xavotir yo'q", ru: 'Ничего — GitHub автоматически его спрячет, не волнуйтесь' }, { uz: 'Lenta bu holatda umuman ishga tushmay qoladi', ru: 'Лента в этом случае вообще не запустится' }], correct: 0 },
  { q: { uz: "`${{ secrets.API_KEY }}` yozuvi nimani bildiradi?", ru: 'Что означает запись `${{ secrets.API_KEY }}`?' }, opts: [{ uz: "Kalitni oddiy matn sifatida ekranga to'g'ridan-to'g'ri chiqarish", ru: 'Вывести ключ на экран обычным текстом' }, { uz: 'Kalitni seyfdan xavfsiz shaklda olib kelish', ru: 'Безопасно достать ключ из сейфа' }, { uz: "Kalitni boshqa bir loyihaga ko'chirib qo'yish", ru: 'Скопировать ключ в другой проект' }, { uz: "Kalitni butunlay o'chirib, izsiz yo'q qilib tashlash", ru: 'Полностью удалить ключ без следа' }], correct: 1 },
  { q: { uz: "TABLO (status badge) nimani ko'rsatadi?", ru: 'Что показывает ТАБЛО (status badge)?' }, opts: [{ uz: "Loyihaning umumiy fayl hajmini ko'rsatadi", ru: 'Общий размер файлов проекта' }, { uz: 'Serverning qaysi mamlakatda joylashganini', ru: 'В какой стране находится сервер' }, { uz: "Nechta o'quvchi darsni tugatganini ko'rsatib beradi, statistika chiqaradi", ru: 'Сколько учеников закончили урок — выводит статистику' }, { uz: 'Repo sahifasida lenta yashilmi yoki qizilmi ekanini', ru: 'Зелёная лента сейчас или красная — прямо на странице репо' }], correct: 3 },
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
          <span className="cs-hud-i">{tr({ uz: '🏆 PODIUM', ru: '🏆 ПОДИУМ' })}</span>
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
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C'];
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
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
    const TOK = ['on:', 'runs-on', 'uses', 'run:', 'steps', '✓', '✗', 'push', 'matrix'];
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
      if (typeof window !== 'undefined' && !window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закрыть, ученики останутся ждать в арене.\nВсё равно закрыть?' }))) return;
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
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее правильный ответ — тем больше баллов. Серия верных ответов подряд даёт 🔥 бонус!' })}</p>
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
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length} {tr({ uz: '— natija', ru: '— результат' })}</span>
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
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас на ${myRank + 1}-м месте` })}</span>}
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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: "🏁 Natijani ko'rish", ru: '🏁 Показать результат' }) : tr({ uz: 'Keyingi →', ru: 'Дальше →' })}</button>}
        </div>
      )}

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? tr({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · лучшая серия 🔥x${soloScore.maxStreak}` }) : ''}</p>
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
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{myRank + 1}-{tr({ uz: "o'rin", ru: 'е место' })}</b> · {board[myRank].pts} {tr({ uz: 'ball', ru: 'баллов' })}</p>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест ещё раз — практика (в таблицу не идёт)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

// ===== 🏆 PODIUM / STATISTIKA — jonli reyting =====
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
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победил</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{myIdx + 1}-{tr({ uz: "o'rin", ru: 'е место' })}</b> ({board[myIdx].okCount}/{totalQ} {tr({ uz: "to'g'ri", ru: 'верно' })})</p>}
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

// ===== 🛠️ JONLI PRAKTIKA (reusable) — o'quvchi o'z repoda bajaradi, mentor kuzatadi =====
const PRACTICE_BASE = 500;
const MentorPracticeStats = ({ live, screen }) => {
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
      <div className="card-lbl" style={{ color: T.blue }}>{tr({ uz: '👀 Kim bajardi —', ru: '👀 Кто выполнил —' })} {doers.length}/{players.length}</div>
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
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot · o'z repongizda", ru: 'Практика · в вашем репозитории' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z GitHub repongizda</b> bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — mentor kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>в своём GitHub-репозитории</b>. Отмечайте каждый шаг по мере выполнения. Закончив, нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — ментор следит за прогрессом.</> })}</Mentor>
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
              {done ? tr({ uz: '✓ Bajarildi — mentorni kuting', ru: '✓ Выполнено — ждите ментора' }) : tr({ uz: '✅ Bajardim', ru: '✅ Выполнил' })}
            </button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Zo'r! Yo'l xaritangizni yozdingiz. Mentor tekshirib, keyingi qadamga o'tkazadi.", ru: 'Отлично! Вы написали свою карту маршрута. Ментор проверит и переведёт вас на следующий шаг.' })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
}
const ScreenGaPractice = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "O'z repongizga yo'l xaritasini yozing", ru: 'Напишите карту маршрута в своём репозитории' }}
    task={{ uz: "O'z GitHub repongizda .github/workflows/ci.yml faylini yarating: on: push, runs-on: ubuntu-latest va steps: checkout + npm install + npm test. Push qiling va Actions bo'limida yashil ✓ ni kuting.", ru: 'В своём GitHub-репозитории создайте файл .github/workflows/ci.yml: on: push, runs-on: ubuntu-latest и steps: checkout + npm install + npm test. Запушьте и дождитесь зелёной ✓ во вкладке Actions.' }}
    checklist={[
      { uz: "Repo ildizida `.github/workflows/` papkasini yarating", ru: 'Создайте папку `.github/workflows/` в корне репозитория' },
      { uz: "Ichiga `ci.yml` faylini qo'shing", ru: 'Добавьте внутрь файл `ci.yml`' },
      { uz: '`on: push` va `runs-on: ubuntu-latest` yozing', ru: 'Напишите `on: push` и `runs-on: ubuntu-latest`' },
      { uz: '`steps:` ostiga checkout, setup-node, npm install, npm test qatorlarini yozing', ru: 'Под `steps:` запишите строки checkout, setup-node, npm install, npm test' },
      { uz: "Push qiling va GitHub'dagi Actions bo'limida yashil ✓ ni kuzating", ru: 'Запушьте и следите за зелёной ✓ во вкладке Actions на GitHub' },
    ]} />
);

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
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda", ru: '↻ Учим' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })} · <b>{known}</b></span></div>
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

// 🃏 FLASHCARD KARTALARI — 12 atama (UCHISH LENTASI lug'ati)
const GA_FLASHCARDS = [
  { front: { uz: "Yo'l xaritasi fayli qaysi papkada turishi kerak?", ru: 'В какой папке должен лежать файл карты маршрута?' }, back: '.github/workflows/', note: { uz: "Boshqa papkada tursa, GitHub uni umuman ko'rmaydi", ru: 'Если файл лежит в другой папке, GitHub его вообще не увидит' } },
  { front: { uz: "Lenta qachon ishga tushishini qaysi kalit so'z belgilaydi?", ru: 'Какое ключевое слово задаёт, когда запускается лента?' }, back: 'on:', note: { uz: "on: push — har push'da lenta o'zi aylanadi", ru: 'on: push — лента сама крутится при каждом push' } },
  { front: { uz: 'Nuqta qaysi mashinada ishlashini qaysi qator aytadi?', ru: 'Какая строка говорит, на какой машине работает точка?' }, back: 'runs-on', note: { uz: 'runs-on: ubuntu-latest — GitHub bepul toza mashina beradi', ru: 'runs-on: ubuntu-latest — GitHub бесплатно даёт чистую машину' } },
  { front: { uz: "Yo'l xaritasidagi bitta katta bosqich qanday ataladi?", ru: 'Как называется один большой этап карты маршрута?' }, back: 'job', note: { uz: "Nuqta: har job o'z alohida lenta mashinasida ishlaydi", ru: 'Точка: каждый job работает на своей отдельной машине ленты' } },
  { front: { uz: 'Nuqta ichidagi bitta harakat qanday ataladi?', ru: 'Как называется одно действие внутри точки?' }, back: 'step', note: { uz: 'Amal: amallar yozilgan tartibda, yuqoridan pastga bajariladi', ru: 'Шаг: шаги идут сверху вниз, в том порядке, как записаны' } },
  { front: { uz: "Marketplace'dagi tayyor amalni qaysi so'z chaqiradi?", ru: 'Каким словом вызывают готовый шаг из Marketplace?' }, back: 'uses', note: { uz: 'masalan uses: actions/checkout@v4', ru: 'например uses: actions/checkout@v4' } },
  { front: { uz: "Terminal buyrug'ini qaysi so'z bilan yozasiz?", ru: 'Каким словом записывают команду терминала?' }, back: 'run', note: { uz: 'masalan run: npm test — bu SKANER amali', ru: 'например run: npm test — это шаг СКАНЕР' } },
  { front: { uz: 'Kodni repodan lenta mashinasiga qaysi amal olib keladi?', ru: 'Какой шаг приносит код из репозитория на машину ленты?' }, back: 'actions/checkout@v4', note: { uz: "Eng birinchi amal: kodsiz mashina bo'sh turadi", ru: 'Самый первый шаг: без кода машина стоит пустая' } },
  { front: { uz: 'Bitta kodni bir nechta sharoitda birdan sinash uchun nima yoziladi?', ru: 'Что пишут, чтобы проверить один код сразу в нескольких условиях?' }, back: 'matrix', note: { uz: 'Parallel lentalar: bir nechta versiya bir vaqtda tekshiriladi', ru: 'Параллельные ленты: несколько версий проверяются одновременно' } },
  { front: { uz: 'Paketlarni har safar noldan yuklamaslik uchun nima yordam beradi?', ru: 'Что помогает не качать пакеты заново каждый раз?' }, back: 'cache', note: { uz: 'Yaqin javon: tayyorini oladi, lenta tezroq aylanadi', ru: 'Ближняя полка: берёт готовое, лента крутится быстрее' } },
  { front: { uz: 'Maxfiy kalitni qayerda saqlaysiz?', ru: 'Где вы храните секретный ключ?' }, back: 'secrets', note: { uz: "Seyf: kodda faqat ${{ secrets.API_KEY }} ko'rinadi", ru: 'Сейф: в коде видно только ${{ secrets.API_KEY }}' } },
  { front: { uz: "Lenta qizil bo'lsa, sababni qayerdan qidirasiz?", ru: 'Лента покраснела — где вы ищете причину?' }, back: { uz: 'Lenta jurnalidan', ru: 'В журнале ленты' }, note: { uz: "Jurnal qaysi amal va nega to'xtaganini yozib boradi", ru: 'Журнал записывает, какой шаг и почему остановился' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Lenta atamalarini <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <>Быстро <span className="italic" style={{ color: T.accent }}>повторим термины</span> ленты.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Darsni yakunlashdan oldin bugungi atamalarni takrorlaymiz. Har kartada bir savol — <b style={{ color: T.ink }}>javobini</b> o'ylang, keyin kartani bosib tekshiring. <b style={{ color: T.ink }}>Bildim</b> yoki <b style={{ color: T.ink }}>Takrorlash</b> bilan baholang.</>, ru: <>Перед финалом повторим сегодняшние термины. На каждой карточке — вопрос: подумайте, <b style={{ color: T.ink }}>каким будет ответ</b>, затем нажмите на карточку и проверьте себя. Оцените кнопками <b style={{ color: T.ink }}>Знаю</b> или <b style={{ color: T.ink }}>Повторить</b>.</> })}</Mentor>
        <div className="fc-center"><Flashcards cards={GA_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 19 — YAKUN (4.2: ScoreRing + CodeStrike CTA + RECAP/Uyga vazifa + 🏅 kolleksiya) =====
const Screen19 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
    { uz: "GitHub Actions — GitHub ichidagi bepul lenta tizimi; yo'l xaritasi .github/workflows/ci.yml", ru: 'GitHub Actions — бесплатная система ленты внутри GitHub; карта маршрута — .github/workflows/ci.yml' },
    { uz: "Workflow → Job → Step (yo'l xaritasi → nuqta → amal)", ru: 'Workflow → Job → Step (карта маршрута → точка → шаг)' },
    { uz: 'on: push — START SIGNALI; runs-on — LENTA MASHINASI', ru: 'on: push — СТАРТ-СИГНАЛ; runs-on — МАШИНА ЛЕНТЫ' },
    { uz: 'uses (tayyor amal) + run (buyruq); checkout → setup-node → install → test', ru: 'uses (готовый шаг) + run (команда); checkout → setup-node → install → test' },
    { uz: "Maxfiy kalit — SEYFda (${{ secrets.NOM }}), hech qachon ochiq emas", ru: 'Секретный ключ — в СЕЙФЕ (${{ secrets.NOM }}), никогда не в открытую' },
    { uz: 'Qizil chiroq sababi — LENTA JURNALIDA', ru: 'Причина красного света — в ЖУРНАЛЕ ЛЕНТЫ' }
  ];
  const HOMEWORK = [
    { b: { uz: "Qo'shing", ru: 'Добавьте' }, t: { uz: "— o'z repongizga .github/workflows/ci.yml fayl yarating", ru: '— создайте в своём репозитории файл .github/workflows/ci.yml' } },
    { b: { uz: 'Yozing', ru: 'Напишите' }, t: { uz: '— on: push va steps: checkout + npm install + npm test', ru: '— on: push и steps: checkout + npm install + npm test' } },
    { b: { uz: "Ko'ring", ru: 'Посмотрите' }, t: { uz: "— lentaga qo'yib, Actions bo'limida yashil chiroqni kuzating", ru: '— запушьте и наблюдайте зелёный свет во вкладке Actions' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: "Birinchi yo'l xaritangizni yozdingiz", ru: 'Вы написали свою первую карту маршрута' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi lenta har push'da <span className="italic" style={{ color: T.accent }}>o'zi aylanadi</span>.</>, ru: <>Теперь лента <span className="italic" style={{ color: T.accent }}>крутится сама</span> при каждом пуше.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: "Tabriklaymiz! GitHub Actions, ci.yml, Workflow→Job→Step, on:push va birinchi yo'l xaritasini o'zlashtirdingiz.", ru: 'Поздравляем! Вы освоили GitHub Actions, ci.yml, Workflow→Job→Step, on:push и написали первую карту маршрута.' }) : tr({ uz: "Yaxshi harakat! START SIGNALI va LENTA MASHINASINI mustahkamlash uchun bir-ikki ekranni qayta ko'ring.", ru: 'Хорошая попытка! Чтобы закрепить СТАРТ-СИГНАЛ и МАШИНУ ЛЕНТЫ, пересмотрите пару экранов.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: "🚀 Keyingi dars — bitta yukni to'liq lentadan o'tkazamiz: 🔍 skaner + 🎁 o'rash + ✈️ uchirish!", ru: '🚀 Следующий урок — проведём один груз через всю ленту: 🔍 сканер + 🎁 упаковка + ✈️ взлёт!' })}</p></div>
        </div>
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '🏅 Nishonlaringiz —', ru: '🏅 Ваши значки —' })} {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function GithubActionsLesson({ lang: langProp, onFinished }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState({});
  const startTimeRef = useRef(Date.now());
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
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, window.innerWidth / 1920)); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]);
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

  // SCREEN_META bilan 1:1 (23 ekran)
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16, Screen17, Screen18, ScreenGaPractice, ScreenPodium, ScreenFlashcards, Screen19];
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
        .el-in { animation: el-pop 0.3s ease-out; animation-fill-mode: backwards; }
        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        .btn { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.ink}; color: ${T.bg}; border: none; border-radius: 12px; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 14px; font-size: 12.5px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.6; cursor: not-allowed; }
        .gchip { font-family: 'JetBrains Mono'; font-weight: 600; font-size: 12px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); } .gchip:hover:not(:disabled) { transform: translateY(-1px); }
        .tagpill { font-family: 'JetBrains Mono'; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); }

        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope'; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; animation: opt-wait-breathe 2s ease-in-out infinite; }
        @keyframes opt-wait-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.012); } }
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        .vcard { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover:not(:disabled) { transform: translateY(-1px); }
        .vcard:disabled { cursor: default; }
        .vlbl { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .vseen { margin-left: auto; font-weight: 700; }
        .role-ico { font-size: 20px; flex-shrink: 0; } .role-r { font-size: 11.5px; color: ${T.ink2}; font-weight: 600; }

        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: contain; transform: scale(1.12); }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope'; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .hook-option:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope'; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        .h-title { font-size: clamp(22px,4vw,38px); } .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(255,79,40,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(255,79,40,0.55); }

        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(15px,2.5vw,22px); box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }
        .frame-warn { background: ${T.dangerSoft}; border-left: 4px solid ${T.danger}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        .screen { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; color: ${T.accent}; flex-shrink: 0; min-width: 38px; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 600; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .note-h { font-weight: 700; font-size: 13.5px; margin: 0 0 5px; display: flex; align-items: center; }

        /* VS CODE-USLUB EDITOR */
        .editor { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .editor-bar { background: #2D2D2D; padding: 7px 11px; display: flex; align-items: center; gap: 9px; }
        .editor-tab { font-family: 'JetBrains Mono'; font-size: 11px; color: #C9D1D9; background: #1E1E1E; padding: 4px 11px; border-radius: 6px 6px 0 0; word-break: break-all; }
        .editor-body { background: ${CODE.bg}; padding: 12px 14px; }
        .editor-code { font-family: 'JetBrains Mono'; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.75; color: ${CODE.text}; white-space: pre-wrap; word-break: break-word; margin: 0; }
        .line-empty { color: ${CODE.comment}; font-style: italic; }
        .code-line { display: flex; align-items: center; flex-wrap: wrap; }

        /* PICK-ROW (steps/candidates) */
        .pick-row { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 10px; padding: 10px 12px; cursor: pointer; transition: all 0.16s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); font-family: 'JetBrains Mono'; font-size: 11.5px; color: ${T.ink}; }
        .pick-row:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.22); }
        .pick-row:disabled { cursor: default; }
        .pick-plus { margin-left: auto; font-weight: 700; color: ${T.ink3}; }

        /* TERMINAL */
        .term { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .term-bar { background: #2D2D2D; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; } .bb-dots i { width: 9px; height: 9px; border-radius: 50%; } .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .term-title { font-family: 'JetBrains Mono'; font-size: 11px; color: #C9D1D9; }
        .term-body { background: #1E1E1E; padding: 12px 13px; min-height: 60px; }
        .tline { font-family: 'JetBrains Mono'; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.8; color: ${CODE.text}; word-break: break-word; }

        /* LENTA NATIJASI (BeltRun) — pastida cheksiz aylanuvchi lenta chizig'i (1-dars pipe-track naqshi) */
        .ghrun { position: relative; background: ${T.paper}; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
        .ghrun::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 3px; border-radius: 99px; background-image: repeating-linear-gradient(90deg, ${T.ink3}70 0 9px, transparent 9px 19px); background-size: 38px 100%; animation: belt-scroll 1s linear infinite; opacity: 0.45; }
        .ghrun-head { display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-bottom: 1px solid rgba(167,166,162,0.22); }
        .ghrun-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 99px; }
        .ghrun-badge.pass { background: ${T.successSoft}; color: ${T.success}; }
        .ghrun-badge.fail { background: ${T.dangerSoft}; color: ${T.danger}; }
        .ghrun-title { font-family: 'JetBrains Mono'; font-size: 12px; color: ${T.ink2}; }
        .ghrun-job { padding: 11px 14px; }
        .ghrun-jobname { font-family: 'JetBrains Mono'; font-size: 12.5px; font-weight: 700; color: ${T.ink}; margin-bottom: 9px; display: flex; align-items: center; gap: 7px; }
        .ghrun-steps { display: flex; flex-direction: column; gap: 6px; padding-left: 8px; }
        .ghrun-step { font-family: 'JetBrains Mono'; font-size: 11.5px; color: ${T.ink2}; display: flex; align-items: center; gap: 9px; }
        .ghrun-ck { font-weight: 800; min-width: 12px; }
        .ghrun-step.plane-ok .ghrun-ck { display: inline-block; animation: plane-launch 0.9s cubic-bezier(.3,.75,.4,1) both; animation-delay: 0.5s; }
        @keyframes belt-scroll { to { background-position: -38px 0; } }
        @keyframes plane-launch { 0% { transform: translate(0,0) rotate(0deg); } 55% { transform: translate(13px,-11px) rotate(-8deg); } 100% { transform: translate(0,0) rotate(0deg); } }

        /* FAYL-TREE */
        .tree { background: ${CODE.bg}; border-radius: 12px; padding: 13px 15px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .tree-row { font-family: 'JetBrains Mono'; font-size: 12.5px; line-height: 1.95; color: ${CODE.text}; display: flex; align-items: center; }
        .tree-row.hl { color: ${CODE.attr}; font-weight: 700; }
        .tree-row.dim { opacity: 0.45; }

        /* 🛫 BELT RUN (markaziy builder natijasi) — pastida cheksiz aylanuvchi lenta chizig'i */
        .belt-run { position: relative; overflow: hidden; display: flex; align-items: center; gap: 12px; background: ${T.paper}; border-radius: 14px; padding: 14px 18px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
        .belt-run::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 3px; border-radius: 99px; background-image: repeating-linear-gradient(90deg, ${T.ink3}70 0 9px, transparent 9px 19px); background-size: 38px 100%; animation: belt-scroll 1s linear infinite; opacity: 0.45; }
        .belt-light { position: relative; width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px rgba(0,0,0,0.08); }
        .belt-light.green { background: ${T.success}; box-shadow: 0 0 0 4px ${T.successSoft}; }
        .belt-light.red { background: ${T.danger}; box-shadow: 0 0 0 4px ${T.dangerSoft}; }
        .belt-light.off { background: ${T.ink3}; }
        .belt-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 13px; letter-spacing: 0.06em; color: ${T.ink}; }
        .belt-run.spin .belt-light.green { animation: belt-pulse 1.2s ease-in-out infinite; }
        .belt-run.spin .belt-light.red { animation: belt-fail-pulse 0.5s ease-in-out 2, belt-fail-shake 0.5s ease; }
        .belt-run.sending .belt-light.off { animation: belt-pulse-off 0.7s ease-in-out infinite; }
        .belt-run.sending .belt-suitcase { position: absolute; left: 8px; bottom: 6px; font-size: 14px; animation: belt-suitcase-move 0.9s linear infinite; }
        @keyframes belt-pulse { 0%,100% { box-shadow: 0 0 0 4px ${T.successSoft}; } 50% { box-shadow: 0 0 0 8px ${T.successSoft}; } }
        @keyframes belt-pulse-off { 0%,100% { box-shadow: 0 0 0 4px rgba(167,166,162,0.35); } 50% { box-shadow: 0 0 0 8px rgba(167,166,162,0.5); } }
        @keyframes belt-fail-pulse { 0%,100% { box-shadow: 0 0 0 4px ${T.dangerSoft}; } 50% { box-shadow: 0 0 0 9px ${T.dangerSoft}; } }
        @keyframes belt-fail-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(4px); } }
        @keyframes belt-suitcase-move { from { left: 8px; } to { left: calc(100% - 26px); } }
        .plane-lift { display: inline-block; animation: plane-launch 0.9s cubic-bezier(.3,.75,.4,1) both; }
        .tline-stag { animation-fill-mode: backwards; }

        /* 📱 PHONE PREVIEW */
        .phone { width: 108px; margin: 0 auto; background: ${T.ink}; border-radius: 20px; padding: 8px 6px; box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.35); }
        .phone-notch { width: 34px; height: 5px; border-radius: 4px; background: rgba(255,255,255,0.25); margin: 0 auto 6px; }
        .phone-scr { min-height: 92px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; padding: 8px; text-align: center; }
        .phone.ok .phone-scr { background: ${T.successSoft}; }
        .phone.bad .phone-scr { background: ${T.dangerSoft}; }
        .phone.idle .phone-scr { background: ${T.bg}; }
        .phone-ic { font-size: 24px; }
        .phone-t { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; color: ${T.ink}; line-height: 1.3; }

        /* PARALLEL LENTALAR (matrix) */
        .matrix-lanes { display: flex; flex-direction: column; gap: 10px; }
        .matrix-lane { display: flex; align-items: center; gap: 10px; background: ${T.paper}; border-radius: 12px; padding: 10px 14px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); opacity: 0; }
        .matrix-lane.go { animation: fade-in-up 0.4s ease-out forwards; }
        .matrix-v { min-width: 62px; font-weight: 700; color: ${T.ink}; }
        .matrix-track { flex: 1; height: 8px; background: ${T.bg}; border-radius: 99px; overflow: hidden; position: relative; }
        .matrix-lane.go .matrix-cap { display: block; height: 100%; width: 40%; background: ${T.accent}; border-radius: 99px; animation: matrix-run 1s ease-out forwards; }
        @keyframes matrix-run { from { transform: translateX(-100%); } to { transform: translateX(250%); } }
        .matrix-ok { color: ${T.success}; font-weight: 700; font-size: 12.5px; }

        /* YAQIN JAVON (cache) taymerlari */
        .cache-timers { display: flex; flex-direction: column; gap: 14px; }
        .cache-t { display: flex; flex-direction: column; gap: 5px; }
        .cache-bar { height: 10px; background: ${T.bg}; border-radius: 99px; overflow: hidden; }
        .cache-bar span { display: block; height: 100%; border-radius: 99px; transition: width 0.15s linear; }
        .cache-n { font-size: 12.5px; color: ${T.ink2}; }

        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: shake 0.4s ease; }

        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.12); overflow: hidden; }

        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; }

        /* 🧲 DRAG-DROP TARTIB */
        .dd { display: flex; flex-direction: column; gap: 13px; }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; position: relative; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 58px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; box-shadow: 0 5px 14px -9px rgba(${T.shadowBase},0.2); transition: border-color .18s, background .18s, box-shadow .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; box-shadow: 0 8px 18px -10px rgba(${T.shadowBase},0.26); }
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; animation: dd-ok-pop 0.42s cubic-bezier(.3,1.5,.5,1); }
        .dd-slot.ok:nth-child(2) { animation-delay: 0.07s; } .dd-slot.ok:nth-child(3) { animation-delay: 0.14s; }
        .dd-slot.ok:nth-child(4) { animation-delay: 0.21s; }
        @keyframes dd-ok-pop { 0%,100% { transform: scale(1); } 45% { transform: scale(1.025); } }
        .dd-slot.bad { border-color: ${T.danger}; background: ${T.dangerSoft}; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
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

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi. Bosilgach pulsatsiya TO'XTAYDI. */
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 0 rgba(255,79,40,0.4); } 70%,100% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 8px rgba(255,79,40,0); } }
        .tree-row.tap-hint, .gchip.tap-hint, .btn-soft.tap-hint, .btn.tap-hint, .vcard.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }

        /* 11.15 — jonli badge xira, hover'da tiniq */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

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

        /* === ⚡ CODE STRIKE — CTA neon-kapsula === */
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

        /* === MENTOR STATISTIKASI (jonli test) === */
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
        @media (max-width: 640px) { .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; } .rc-dots { width: 100%; order: -1; } .rc-btn { font-size: 13px; padding: 11px 16px; } }

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
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

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

        @media (prefers-reduced-motion: reduce) {
          .dd-chip.in, .dd-slot.ok, .dd-slot.bad, .tree-row.tap-hint, .gchip.tap-hint, .btn-soft.tap-hint, .btn.tap-hint, .vcard.tap-hint,
          .belt-run.spin .belt-light.green, .matrix-lane.go .matrix-cap,
          .ghrun::after, .belt-run::after, .belt-run.spin .belt-light.red, .belt-run.sending .belt-light.off,
          .belt-run.sending .belt-suitcase, .ghrun-step.plane-ok .ghrun-ck, .plane-lift { animation: none !important; }
        }
      `}</style>
      <AchCtx.Provider value={earned}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'GitHub Actions darsi', ru: 'Урок GitHub Actions' }} />
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
