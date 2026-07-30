import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 5-MODUL (BOTLAR) · DARS 2 — «BOT API + TUGMALAR — BOTJON MULOQOT QILADI» — PLATFORM STANDARD v18 (AUDIOSIZ)
// Maqsad: o'quvchi Botjonga muloqot qo'shadi — chaqiruv so'zlari, ✉️ konvert (ctx), 🔘 xabar ustidagi
//         tugma (inline) va pastdagi tugmalar taxtasi (reply), 📋 qoidalar varag'i (signal → amal) va
//         oxirgi qator (fallback) — hech qachon jim qolmaydigan bot.
// 🎒 METAFORA — BOTJON (5 darsda o'zgarmaydi): bot=Botjon · token=🔑 KALIT · .env=qulfli tortma ·
//   Bot API=xizmat oynasi · handler=📋 varaqdagi qator · trigger=signal, action=amal · komanda=chaqiruv so'zi ·
//   ctx=✉️ KONVERT · inline tugma=xabar ustidagi tugma · reply tugma=pastdagi tugmalar taxtasi ·
//   polling=o'zi so'rab turish, webhook=qo'ng'iroq · fallback=oxirgi qator · rate limit=tezlik cheklovi.
// INTERAKTIV BEAT'lar: s9 MARKAZIY «Tugmalar taxtasini quring» (signal→amal qoidalar varag'i) ·
//   s11 KONVERT tajribasi (javobni noto'g'ri odamga yuborish → tuzatish) ·
//   s12 «Oxirgi qator» — fallback + tezlik cheklovi mini-tajriba · s15 FINAL bot.ts tartibi (DragDropOrder).
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
// Nickname — qurilma bo'ylab BITTA (darsga bog'lanmagan kalit)
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
    if (nick.length < 2) { setJoinError(tr({ uz: 'Ismingizni kiriting (kamida 2 harf).', ru: 'Введите своё имя (минимум 2 буквы).' })); return; }
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
      <div style={{ fontSize: 'clamp(13px,2vw,18px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: LT.accent, marginBottom: 'clamp(14px,3vw,28px)' }}>{tr({ uz: "Jonli darsga qo'shilish", ru: 'Присоединиться к живому уроку' })}</div>
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
    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: LT.accent }}>{tr(title)}</div><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '6px 0 4px' }}>{tr({ uz: "Darsga qo'shilish", ru: 'Присоединиться к уроку' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor bergan kodni va ismingizni kiriting.', ru: 'Введите код от ментора и своё имя.' })}</p></div>
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
        <button onClick={() => { if (window.confirm(tr({ uz: "O'quvchilarni ozod qilasizmi? Ular o'zlari erkin davom etadi.", ru: 'Освободить учеников? Дальше они продолжат самостоятельно.' }))) live.endSession(); }} style={{ background: LT.accentSoft, color: LT.accent, border: 'none', borderRadius: 99, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tr({ uz: '🔓 Erkin qilish', ru: '🔓 Освободить' })}</button>
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
// payload/analytics uchun UZ-etalon (4-Modul konvensiyasi)
const ou = (o) => (o && typeof o === 'object' && !React.isValidElement(o)) ? (o.uz ?? '') : o;

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

const LESSON_META = { lessonId: 'bot-api-buttons-05-02-v18', lessonTitle: { uz: 'Bot API + tugmalar: Botjon muloqot qiladi', ru: 'Bot API и кнопки: Ботик общается' } };
// 20 ekran · 4.1 oqim: hook → reja → (exploration↔test)× → markaziy o'yin → konvert → fallback → builder → final → praktika → podium → flashcard → summary
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

// ⚡ JONLI: javob kaliti. `s15` — final (picked 0/1 sentinel). `practice: -1` — sentinel (variant yo'q).
const INLINE_KEYS = { s4: 1, s8: 3, s10: 0, s14: 2, s15: 0, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI).
const RECAPS = {
  4: {
    title: { uz: '🔑 Kalit — .env ichida', ru: '🔑 Ключ — внутри .env' },
    cards: [
      { ic: '🔑', h: { uz: 'Token — Botjonning kaliti', ru: 'Токен — ключ Ботика' }, body: { uz: <>Token — Botjon uchun <b>kalit</b>. U kimda bo'lsa, bot o'sha kishiniki.</>, ru: <>Токен — это <b>ключ</b> от Ботика. У кого ключ, того и бот.</> } },
      { ic: '🗄️', h: { uz: 'Qulfli tortma — .env', ru: 'Запертый ящик — .env' }, body: { uz: <>Kalit <b>.env</b> — qulfli tortmada saqlanadi, u git'ga tushmaydi.</>, ru: <>Ключ хранится в <b>.env</b> — запертом ящике, он не попадает в git.</> } },
      { ic: '🚫', h: { uz: 'Kodda ochiq yozilmaydi', ru: 'Открыто в коде не пишут' }, body: { uz: <>Kalitni kodning ichiga ochiq yozsangiz — hamma ko'radi va Botjonni o'g'irlaydi.</>, ru: <>Если написать ключ прямо в коде — его увидят все и уведут вашего Ботика.</> }, ask: { uz: 'Token nega .env"da saqlanadi?', ru: 'Почему токен хранят в .env?' } },
    ]
  },
  8: {
    title: { uz: '🔘✉️ Ikki xil tugma', ru: '🔘✉️ Два вида кнопок' },
    cards: [
      { ic: '🔘', h: { uz: 'Xabar ustidagi tugma (inline)', ru: 'Кнопка под сообщением (inline)' }, body: { uz: <>Xabarga yopishadi. Bosilsa hech narsa yozilmaydi — yashirin <b>signal</b> ketadi.</>, ru: <>Прилипает к сообщению. При нажатии ничего не пишется — уходит скрытый <b>сигнал</b>.</> } },
      { ic: '⌨️', h: { uz: 'Pastdagi tugmalar taxtasi (reply)', ru: 'Нижняя панель кнопок (reply)' }, body: { uz: <>Klaviatura o'rnida turadi. Bosilsa — <b>matn</b> xuddi o'zi yozgandek yuboriladi.</>, ru: <>Стоит на месте клавиатуры. При нажатии отправляется <b>текст</b> — будто вы сами его написали.</> } },
      { ic: '🔀', h: { uz: 'Farqni eslab qoling', ru: 'Запомните разницу' }, body: { uz: <>Inline = callback (jim signal). Reply = matn xabar.</>, ru: <>Inline = callback (тихий сигнал). Reply = текстовое сообщение.</> }, ask: { uz: 'Ikkalasi qanday farq qiladi?', ru: 'Чем они отличаются?' } },
    ]
  },
  10: {
    title: { uz: '📋 Qator — signalni ushlaydi', ru: '📋 Строка — ловит сигнал' },
    cards: [
      { ic: '🔘', h: { uz: 'Tugma signali → shu qator', ru: 'Сигнал кнопки → эта строка' }, body: { uz: <>Xabar ustidagi tugma signalini <b>bot.action(...)</b> qatori ushlaydi.</>, ru: <>Сигнал кнопки под сообщением ловит строка <b>bot.action(...)</b>.</> } },
      { ic: '⌨️', h: { uz: 'Matn signali → boshqa qator', ru: 'Текстовый сигнал → другая строка' }, body: { uz: <><b>bot.hears(...)</b> — reply tugma yoki oddiy matnni ushlaydi.</>, ru: <><b>bot.hears(...)</b> ловит reply-кнопку или обычный текст.</> } },
      { ic: '🚫', h: { uz: "Qator yo'q bo'lsa", ru: 'Если строки нет' }, body: { uz: <>Signal ketadi, lekin uni ushlaydigan qator bo'lmasa — Botjon hech narsa qilmaydi.</>, ru: <>Сигнал уходит, но если ловить его некому — Ботик ничего не сделает.</> }, ask: { uz: 'Signalni qator qanday ushlaydi?', ru: 'Как строка ловит сигнал?' } },
    ]
  },
  14: {
    title: { uz: "/ chaqiruv so'zlari", ru: '/ слова-вызовы' },
    cards: [
      { ic: '📜', h: { uz: '/ bilan boshlanadi', ru: 'Начинаются с /' }, body: { uz: <>Chaqiruv so'zlari (<span className="mono">/start</span>, <span className="mono">/help</span>) qiyshiq chiziq bilan boshlanadi.</>, ru: <>Слова-вызовы (<span className="mono">/start</span>, <span className="mono">/help</span>) начинаются с косой черты.</> } },
      { ic: '📋', h: { uz: "Telegram ro'yxatga chiqaradi", ru: 'Telegram выводит их списком' }, body: { uz: <>Bunday so'zlarni Telegram avtomatik <b>buyruqlar ro'yxatida</b> ko'rsatadi.</>, ru: <>Такие слова Telegram автоматически показывает в <b>списке команд</b>.</> } },
      { ic: '🔕', h: { uz: "Qator yo'q — Botjon jim", ru: 'Нет строки — Ботик молчит' }, body: { uz: <>Chaqiruv so'zi yozilsa-yu, varaqda qatori bo'lmasa — Botjon javob bermaydi.</>, ru: <>Если слово-вызов написали, а строки для него на листе нет — Ботик не ответит.</> }, ask: { uz: "Chaqiruv so'zlari nimasi bilan alohida?", ru: 'Чем особенны слова-вызовы?' } },
    ]
  },
  15: {
    title: { uz: '📋 bot.ts tartibi', ru: '📋 Порядок в bot.ts' },
    cards: [
      { ic: '🔑', h: { uz: "Avval — kalit o'qiladi", ru: 'Сначала — читается ключ' }, body: { uz: <>Birinchi qator — token <span className="mono">.env</span>'dan o'qiladi.</>, ru: <>Первая строка — токен читается из <span className="mono">.env</span>.</> } },
      { ic: '🤖', h: { uz: 'Keyin — Botjon yaratiladi', ru: 'Потом — создаётся Ботик' }, body: { uz: <>Token bilan Botjon (Telegraf obyekti) yaratiladi.</>, ru: <>С токеном создаётся Ботик (объект Telegraf).</> } },
      { ic: '📋', h: { uz: "Qoidalar, so'ng ishga tushirish", ru: 'Правила, затем запуск' }, body: { uz: <>Handlerlar (start, action, fallback) yoziladi — <b>eng oxiri</b> launch().</>, ru: <>Пишутся обработчики (start, action, fallback) — и <b>в самом конце</b> launch().</> }, vis: <RcFlow items={['🔑 Token', '🤖 Bot', '📋 start', '🔘 action', '🔕 fallback', '🚀 launch']} />, ask: { uz: 'Nega launch() eng oxirida turadi?', ru: 'Почему launch() стоит в самом конце?' } },
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
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Ответили все' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
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
        <p className="mstats-hidden">{tr({ uz: '🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o\'quvchilar ekranida ham birdan ochiladi.', ru: '🙈 Кто что выбрал и сколько ✅/❌ — пока скрыто. По нажатию «Открыть результат» откроется сразу и у вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тема осталась непонятной классу. Перед продолжением советуем коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirish —', ru: '📖 Объяснить заново —' })} {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 Верно <b>{pct}%</b> — неплохо. При желании коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qisqa takrorlash', ru: '📖 Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ Верно <b>{pct}%</b> — класс усвоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: `Javob berganlar kam (${answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.`, ru: `Ответивших мало (${answered}) — сложно судить по проценту. Оцените сами.` })}</p>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Советуем объяснить заново.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в живом режиме…' })}</p>}
    </div>
  );
}

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
      onAnswer(screen, { stage: scope, screenIdx: screen, question: ou(questionText), options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: ou(questionText), options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
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
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: '📖 Qisqa takrorlash — mavzuni yana bir ko\'rish', ru: '📖 Короткое повторение — взглянуть на тему ещё раз' })}</button>
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue">{tr({ uz: " · ko'rsatmani ochish ▾", ru: ' · открыть подсказку ▾' })}</span>}</span>
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

// ============================================================ BOTJON MAVZUSI KOMPONENTLARI

const TgChat = ({ title = { uz: 'AvtoPizza bot', ru: 'AvtoPizza bot' }, sub = { uz: 'bot · onlayn', ru: 'бот · онлайн' }, ava = '🤖', verified, children, replyKb, input = true, minH }) => (
  <div className="tg">
    <div className="tg-head">
      <span className="tg-ava">{ava}</span>
      <span className="tg-name">{tr(title)}{verified && <span className="tg-badge">✓</span>}<span className="tg-status">{tr(sub)}</span></span>
    </div>
    <div className="tg-body" style={{ minHeight: minH }}>{children}</div>
    {replyKb && <div className="tg-replykb">{replyKb.map((row, ri) => <div key={ri} className="tg-replykb-row">{row.map((b, bi) => <span key={bi} className="tg-replykb-btn" onClick={b.onClick}>{tr(b.label)}</span>)}</div>)}</div>}
    {input && <div className="tg-input"><span className="tg-input-field">{replyKb ? tr({ uz: 'Tugmani tanlang…', ru: 'Выберите кнопку…' }) : tr({ uz: 'Xabar yozing…', ru: 'Напишите сообщение…' })}</span><span className="tg-send">➤</span></div>}
  </div>
);
const Bubble = ({ from = 'bot', children, inline }) => (
  <div className={`tg-bubble-wrap ${from}`}>
    <div className={`tg-bubble ${from} el-in`}>{children}</div>
    {inline && <div className="tg-inline el-in">{inline.map((row, ri) => <div key={ri} className="tg-inline-row">{row.map((b, bi) => <span key={bi} className={`tg-inline-btn ${b.fired ? 'fired' : ''}`} onClick={b.onClick}>{tr(b.label)}{b.fired && <i className="tg-inline-spark" aria-hidden="true" />}</span>)}</div>)}</div>}
  </div>
);

const FAKE_TOKEN = '7843129005:AAH9zK_mQ2vNqL8xQ';
const BF_STEPS = [
  { u: '/newbot', b: { uz: "Salom! Yangi bot yaratamiz. Botingizga qanday nom (ko'rinadigan ism) qo'yamiz?", ru: 'Привет! Создаём нового бота. Какое имя (видимое название) дадим вашему боту?' } },
  { u: 'AvtoPizza', b: { uz: "Yaxshi tanlov. Endi bot uchun username tanlang — u majburiy ravishda 'bot' bilan tugashi kerak.", ru: "Хороший выбор. Теперь выберите username для бота — он обязательно должен заканчиваться на 'bot'." } },
  { u: 'avto_pizza_bot', b: { uz: 'Tabriklayman! 🎉 Botingiz tayyor. Mana uning kaliti (token) — uni hech kimga bermang:', ru: 'Поздравляю! 🎉 Ваш бот готов. Вот его ключ (токен) — никому его не давайте:' } }
];

const STACK = [
  { id: 'tg', ico: '✈️', label: { uz: 'Telegram', ru: 'Telegram' }, desc: { uz: 'Mijozning xabarlari shu yerda. Tashqi dunyoga xizmat oynasi (Bot API) orqali ulanadi.', ru: 'Здесь сообщения клиента. С внешним миром связывается через служебное окно (Bot API).' } },
  { id: 'telegraf', ico: '📦', label: { uz: 'Telegraf', ru: 'Telegraf' }, desc: { uz: "Node.js kutubxonasi — xizmat oynasi bilan gaplashishni o'zi bajaradi. Siz kalitni berasiz, u ulanadi.", ru: 'Библиотека Node.js — сама общается со служебным окном. Вы даёте ключ, она подключается.' } },
  { id: 'service', ico: '🤖', label: { uz: 'Bot Service', ru: 'Bot Service' }, desc: { uz: "Botjonning o'zi — sizning qoidalar varag'ingiz: bot.start, bot.hears, bot.action. signal → amal shu yerda yoziladi.", ru: 'Сам Ботик — ваш лист правил: bot.start, bot.hears, bot.action. Сигнал → действие пишется здесь.' } },
  { id: 'module', ico: '🧩', label: { uz: 'Nest Module', ru: 'Nest Module' }, desc: { uz: "Servisni Nest ilovasiga ulaydi — xuddi 4-modulda Car / Book resurslari kabi. Tanish, to'g'rimi?", ru: 'Подключает сервис к Nest-приложению — точно как ресурсы Car / Book в 4-м модуле. Знакомо, правда?' } }
];

const HANDLER_PARTS = [
  { id: 'start', tok: 'bot.start', desc: { uz: "signal: mijoz /start chaqiruv so'zini yuborganda ishga tushadi (1-darsdagi signal — endi kodda).", ru: 'сигнал: срабатывает, когда клиент отправляет слово-вызов /start (тот самый сигнал из 1-го урока — теперь в коде).' } },
  { id: 'ctx', tok: 'ctx', desc: { uz: '✉️ konvert — kelgan xabar haqida hamma narsa: kim yubordi (ctx.from), matn (ctx.message.text) va qayerga javob berish (ctx.reply).', ru: '✉️ конверт — всё о пришедшем сообщении: кто отправил (ctx.from), текст (ctx.message.text) и куда отвечать (ctx.reply).' } },
  { id: 'reply', tok: 'ctx.reply', desc: { uz: "amal: Botjonning javobi — mijozga xabar qaytaradi. Bu — 1-darsdagi amal.", ru: 'действие: ответ Ботика — отправляет сообщение клиенту. Это то самое действие из 1-го урока.' } }
];

function DragDropOrder({ items, hints, onSolved, doneText, onChange }) {
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
        {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: 'Порядок неверный — нажмите на блок, чтобы вернуть, и разложите заново' })}</span>}
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>
      {solved && <div className="dd-done">✓ {tr(doneText) || tr({ uz: "To'g'ri tartib!", ru: 'Верный порядок!' })}</div>}
      {wrong && !solved && <div className="dd-wrong">{tr({ uz: '⚠️ Tartib xato — qayta joylang.', ru: '⚠️ Порядок неверный — разложите заново.' })}</div>}
    </div>
  );
}

// ===== SCREEN 0 — HOOK: BotFather'da Botjon tug'iladi =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [step, setStep] = useState(storedAnswer ? BF_STEPS.length : 0);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const revealed = step >= BF_STEPS.length;
  const OPTS = [
    { id: 'a', label: { uz: 'Avval chiroyli logo va rang tanlayman', ru: 'Сначала выберу красивый логотип и цвет' } },
    { id: 'b', label: { uz: "Kalitni (tokenni) olaman — usiz Botjonim xizmat oynasi bilan gaplasha olmaydi", ru: 'Получу ключ (токен) — без него мой Ботик не сможет говорить со служебным окном' } },
    { id: 'c', label: { uz: "Hech narsa — Botjon allaqachon o'zi ishlaydi", ru: 'Ничего — Ботик и так уже сам работает' } }
  ];
  const advance = () => { setStep(n => Math.min(n + 1, BF_STEPS.length)); setSc(n => n + 1); };
  const pick = (v) => { if (picked !== null || !revealed) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 880 }}>{tr({ uz: <>1-darsda Botjonning sxemasini chizdingiz. Lekin u qog'ozda. Haqiqiy Botjon <span className="italic" style={{ color: T.accent }}>qanday tug'iladi</span>?</>, ru: <>На 1-м уроке вы нарисовали схему Ботика. Но она на бумаге. А как <span className="italic" style={{ color: T.accent }}>рождается</span> настоящий Ботик?</> })}</h1>
        <Mentor>{tr({ uz: <>Telegram'da bot yaratadigan rasmiy bot bor — <b style={{ color: T.ink }}>@BotFather</b>. U bilan suhbatlashib Botjoningizni ochasiz. Tugmani bosib, butun jarayonni ko'ring.</>, ru: <>В Telegram есть официальный бот, который создаёт ботов — <b style={{ color: T.ink }}>@BotFather</b>. Поговорив с ним, вы откроете своего Ботика. Нажмите кнопку и посмотрите весь процесс.</> })}</Mentor>
        <Zoomable><Split>
          <Col>
            <TgChat title={{ uz: 'BotFather', ru: 'BotFather' }} sub={{ uz: 'rasmiy · bot yaratuvchi', ru: 'официальный · создатель ботов' }} ava="🧙" verified input={false} minH={170}>
              {BF_STEPS.slice(0, step).map((s, i) => (
                <React.Fragment key={i}>
                  <Bubble from="user">{s.u}</Bubble>
                  <Bubble from="bot">{tr(s.b)}</Bubble>
                </React.Fragment>
              ))}
              {revealed && <div className="token-bubble el-in"><span className="token-key">🔑</span><span className="token-val mono">{FAKE_TOKEN}</span></div>}
              {step === 0 && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: '6px 2px' }}>{tr({ uz: 'Suhbat hali boshlanmagan — tugmani bosing.', ru: 'Разговор ещё не начат — нажмите кнопку.' })}</p>}
            </TgChat>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={advance} disabled={revealed}>{revealed ? tr({ uz: '✓ Botjon yaratildi — kalit olindi', ru: '✓ Ботик создан — ключ получен' }) : step === 0 ? tr({ uz: '▶ BotFather bilan suhbat', ru: '▶ Разговор с BotFather' }) : tr({ uz: `Keyingi qadam (${step}/3)`, ru: `Следующий шаг (${step}/3)` })}</button>
            {revealed && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>3 ta xabar bilan Botjon tug'ildi — va sizga <b>🔑 kalit</b> berildi. Bu kalit — kalit kimda bo'lsa, Botjon o'shaniki.</>, ru: <>Три сообщения — и Ботик родился, а вам выдали <b>🔑 ключ</b>. У кого ключ, того и Ботик.</> })}</p></div>}
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Botjon yaratilgach, birinchi nima muhim?', ru: 'Что важнее всего сразу после создания Ботика?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => {
                const on = picked === o.id;
                return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null || !revealed} style={{ opacity: !revealed ? 0.55 : 1 }} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>);
              })}
            </div>
            {!revealed && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Avval BotFather suhbatini oching ←', ru: 'Сначала откройте разговор с BotFather ←' })}</p>}
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>Aynan! <b>🔑 Kalit</b> — eng muhim narsa. Bugun: Botjonga <b>muloqot</b> qo'shamiz — chaqiruv so'zlari, ✉️ konvert va tugmalar.</>, ru: <>Именно! <b>🔑 Ключ</b> — самое главное. Сегодня добавим Ботику <b>общение</b>: слова-вызовы, ✉️ конверт и кнопки.</> })}</p>}
          </Col>
        </Split></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { text: { uz: '🔑 Kalit va qulfli tortma (.env)', ru: '🔑 Ключ и запертый ящик (.env)' }, tag: { uz: 'kalit', ru: 'ключ' } },
    { text: { uz: 'Arxitektura: NestJS + Telegraf', ru: 'Архитектура: NestJS + Telegraf' }, tag: { uz: 'tuzilma', ru: 'структура' } },
    { text: { uz: "Chaqiruv so'zi va ✉️ konvert (ctx)", ru: '✉️ Слово-вызов и конверт (ctx)' }, tag: { uz: 'kod', ru: 'код' } },
    { text: { uz: "Tugmalar taxtasini quring — 📋 qoidalar varag'i", ru: '📋 Соберите панель кнопок — лист правил' }, tag: { uz: "markaziy o'yin", ru: 'главная игра' } }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const Preview = (
    <Col>
      <p className="flow-label">{tr({ uz: 'dars oxirida — shu ishlaydigan menyuni tushunasiz', ru: 'к концу урока вы поймёте это работающее меню' })}</p>
      <TgChat input={false} minH={0}>
        <Bubble from="user">/menu</Bubble>
        <Bubble from="bot" inline={[[{ label: { uz: '🍕 Menyu', ru: '🍕 Меню' } }, { label: { uz: '🛒 Buyurtma', ru: '🛒 Заказ' } }], [{ label: { uz: 'ℹ️ Biz haqimizda', ru: 'ℹ️ О нас' } }]]}>{tr({ uz: "Salom! 👋 AvtoPizza'ga xush kelibsiz. Nima qilamiz?", ru: 'Привет! 👋 Добро пожаловать в AvtoPizza. Что делаем?' })}</Bubble>
      </TgChat>
      <div className="sk-info"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "/menu (chaqiruv so'zi) → salom + tugmalar. Har tugma o'z signalini yuboradi, 📋 varaqdagi qator ushlaydi. Mana shuni quramiz.", ru: '/menu (слово-вызов) → приветствие + кнопки. Каждая кнопка шлёт свой сигнал, а строка на 📋 листе его ловит. Вот это и соберём.' })}</p></div>
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
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Endi Botjonga <span className="italic" style={{ color: T.accent }}>muloqotni</span> qo'shamiz.</>, ru: <>Теперь добавим Ботику <span className="italic" style={{ color: T.accent }}>общение</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>1-darsda <b style={{ color: T.ink }}>signal → amal</b> sxemasini tushundingiz. Bugun Botjon <b style={{ color: T.ink }}>gapiradigan</b> bo'ladi: kalit olamiz, chaqiruv so'zi va ✉️ konvertni o'rganamiz, keyin tugmalar taxtasini o'zingiz qurasiz. Mana natija va 4 qadam.</>, ru: <>На 1-м уроке вы разобрали схему <b style={{ color: T.ink }}>сигнал → действие</b>. Сегодня Ботик <b style={{ color: T.ink }}>заговорит</b>: получим ключ, разберём слово-вызов и ✉️ конверт, а потом вы сами соберёте панель кнопок. Вот результат и 4 шага.</> })}</Mentor>
        {!isNarrow ? (<Zoomable><Split>{Preview}{StepsB}</Split></Zoomable>)
          : !showSteps ? <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{Preview}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "4 qadamni ko'rish", ru: 'Посмотреть 4 шага' })}</button></div>
            : <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Natijani ko'rish", ru: '↩ Посмотреть результат' })}</button>{StepsB}</div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — 🔑 KALIT + qulfli tortma (.env) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [show, setShow] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = show;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Kalit · .env', ru: 'Ключ · .env' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Xavfsiz usulni ko'ring", ru: 'Посмотрите безопасный способ' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>🔑 Kalit — Botjonning eng qadrli buyumi. Uni <span className="italic" style={{ color: T.accent }}>qayerda saqlash</span> kerak?</>, ru: <>🔑 Ключ — самая ценная вещь Ботика. А <span className="italic" style={{ color: T.accent }}>где его хранить</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Kalit maxfiy. Agar uni to'g'ridan-to'g'ri kodga yozsangiz va git'ga yuborsangiz — <b style={{ color: T.danger }}>hamma ko'radi</b> va Botjoningizni o'g'irlaydi. To'g'ri usulni ko'ring.</>, ru: <>Ключ секретный. Если написать его прямо в коде и отправить в git — <b style={{ color: T.danger }}>его увидят все</b> и уведут вашего Ботика. Посмотрите, как правильно.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label" style={{ color: T.danger }}>{tr({ uz: '❌ Xato — kodda ochiq', ru: '❌ Ошибка — открыто в коде' })}</p>
            <CodeFile name="bot.ts" minH={70}>
              <Kw>const</Kw>{' bot = '}<Kw>new</Kw>{' '}<At>Telegraf</At>{'('}<St>'{FAKE_TOKEN}'</St>{')'}{'\n'}
              <Cm>{tr({ uz: "// ❌ git'ga tushadi — hamma o'qiydi!", ru: '// ❌ попадёт в git — прочитают все!' })}</Cm>
            </CodeFile>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={show} onClick={() => { setShow(true); setSc(n => n + 1); }}>{show ? tr({ uz: "✓ Ko'rdingiz", ru: '✓ Вы посмотрели' }) : tr({ uz: "To'g'ri usul qanday?", ru: 'А как правильно?' })}</button>
          </Col>
          <Col>
            {show ? <>
              <p className="flow-label" style={{ color: T.success }}>{tr({ uz: "✅ To'g'ri — qulfli tortmada (.env)", ru: '✅ Правильно — в запертом ящике (.env)' })}</p>
              <CodeFile name=".env" minH={0}>
                <At>BOT_TOKEN</At>{'='}{FAKE_TOKEN}{'\n'}
                <Cm>{tr({ uz: "// .gitignore'da → git'ga TUSHMAYDI", ru: '// в .gitignore → в git НЕ ПОПАДЁТ' })}</Cm>
              </CodeFile>
              <CodeFile name="bot.ts" minH={0}>
                <Kw>const</Kw>{' bot = '}<Kw>new</Kw>{' '}<At>Telegraf</At>{'(process.env.'}<At>BOT_TOKEN</At>{')'}{'\n'}
                <Cm>{tr({ uz: '// ✅ kod toza, kalit maxfiy', ru: '// ✅ код чистый, ключ секретный' })}</Cm>
              </CodeFile>
            </> : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Tugmani bosing ←', ru: 'Нажмите кнопку ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Kalit <span className="mono">.env</span> — qulfli tortmada yashaydi (4-modulda auth'da ko'rgansiz). Kod undan <span className="mono">process.env.BOT_TOKEN</span> orqali o'qiydi. Kalit hech qachon git'ga tushmaydi.</>, ru: <>Ключ живёт в <span className="mono">.env</span> — запертом ящике (вы видели это в 4-м модуле, в auth). Код читает его через <span className="mono">process.env.BOT_TOKEN</span>. В git ключ не попадает никогда.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — ARXITEKTURA: NestJS + Telegraf =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(STACK.map(s => s.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= STACK.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const cur = STACK.find(s => s.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Arxitektura', ru: 'Архитектура' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Qatlamlarni ko'ring (${seen.size}/4)`, ru: `Посмотрите слои (${seen.size}/4)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Botjoningiz <span className="italic" style={{ color: T.accent }}>NestJS</span> ichida yashaydi.</>, ru: <>Ваш Ботик живёт внутри <span className="italic" style={{ color: T.accent }}>NestJS</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yodingizdami — 4-modulda NestJS resurslari (Car, Book) qurgansiz. Botjon ham xuddi shunday: <b style={{ color: T.ink }}>Telegraf</b> kutubxonasi xizmat oynasi bilan gaplashadi, sizning 📋 qoidalar varag'ingiz esa Nest service ichida yashaydi. Har qatlamni bosing.</>, ru: <>Помните — в 4-м модуле вы строили ресурсы NestJS (Car, Book). С Ботиком так же: библиотека <b style={{ color: T.ink }}>Telegraf</b> говорит со служебным окном, а ваш 📋 лист правил живёт внутри Nest-сервиса. Нажмите на каждый слой.</> })}</Mentor>
        <div className="fade-up"><div className="archflow">
          {STACK.map((s, i) => (
            <React.Fragment key={s.id}>
              {i > 0 && <span className="archflow-arrow">→</span>}
              <div className={`archnode ${seen.has(s.id) ? 'on' : ''}`}><span className="archnode-ico">{s.ico}</span><span className="archnode-lbl">{tr(s.label)}</span></div>
            </React.Fragment>
          ))}
        </div></div>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {STACK.map(s => <button key={s.id} className="gchip" onClick={() => tap(s.id)} style={seen.has(s.id) ? { boxShadow: `inset 0 0 0 1.5px ${T.success}`, color: T.success } : undefined}>{seen.has(s.id) ? '✓ ' : ''}{s.ico} {tr(s.label)}</button>)}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="note-h"><span style={{ fontSize: 18, marginRight: 6 }}>{cur.ico}</span>{tr(cur.label)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.desc)}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Qatlamni bosing ←', ru: 'Нажмите на слой ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Siz faqat <b>Bot Service</b>ga 📋 qatorlar yozasiz (signal → amal). Telegraf va xizmat oynasi aloqasini o'zi hal qiladi. Nest bilimingiz to'g'ridan-to'g'ri ishlaydi.</>, ru: <>Вы пишете 📋 строки только в <b>Bot Service</b> (сигнал → действие). Связь между Telegraf и служебным окном решается сама. Ваши знания Nest работают напрямую.</> })}</p></div>}
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
    questionText={{ uz: "Bot kalitini (tokenni) qayerda saqlash to'g'ri?", ru: 'Где правильно хранить ключ бота (токен)?' }}
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-sub" style={{ marginTop: 8 }}>Bot <span className="mono" style={{ color: T.accent }}>kalitini</span> qayerda saqlash <span className="italic" style={{ color: T.accent }}>to'g'ri</span>?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите правильный ответ</p><h2 className="title h-sub" style={{ marginTop: 8 }}>Где <span className="italic" style={{ color: T.accent }}>правильно</span> хранить <span className="mono" style={{ color: T.accent }}>ключ</span> бота?</h2></> })}
    options={[
      { uz: "To'g'ridan-to'g'ri bot.ts faylining ichida ochiq yozib qo'yamiz", ru: 'Напишем открыто прямо внутри файла bot.ts' },
      { uz: ".env faylda — u .gitignore'da turadi, git'ga hech qachon tushmaydi", ru: 'В файле .env — он указан в .gitignore и в git не попадает никогда' },
      { uz: "README.md faylida, boshqalar ham ko'rib turishi uchun ochiq qoldiramiz", ru: 'В файле README.md — оставим открыто, чтобы и другие видели' },
      { uz: "Hech qayerda saqlamaymiz, har safar BotFather'dan qayta so'raymiz", ru: 'Нигде не храним, каждый раз заново спросим у BotFather' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! Kalit .env faylda saqlanadi, u .gitignore'ga qo'shiladi — shuning uchun git'ga (va GitHub'ga) tushmaydi. Kod undan process.env.BOT_TOKEN orqali o'qiydi. Maxfiylik saqlanadi.", ru: 'Верно! Ключ хранится в файле .env, а он добавлен в .gitignore — поэтому в git (и на GitHub) не попадает. Код читает его через process.env.BOT_TOKEN. Секрет сохранён.' }}
    explainWrong={{
      0: { uz: "Xavfli — kodda ochiq kalit git'ga tushadi va hamma ko'radi, Botjoningizni o'g'irlaydi. .env ishlating.", ru: 'Опасно — открытый в коде ключ попадёт в git, его увидят все и уведут вашего Ботика. Используйте .env.' },
      2: { uz: "README — ochiq hujjat, hamma o'qiydi. Kalit maxfiy bo'lishi kerak — .env'da saqlang.", ru: 'README — открытый документ, его читают все. Ключ должен быть секретным — храните в .env.' },
      3: { uz: "BotFather kalitni faqat bir marta beradi (yoki qayta tiklash kerak). Uni .env'da xavfsiz saqlash kerak.", ru: 'BotFather выдаёт ключ один раз (иначе придётся сбрасывать). Его нужно безопасно хранить в .env.' },
      default: { uz: "Kalit .env faylda saqlanadi — maxfiy va git'ga tushmaydi.", ru: 'Ключ хранится в файле .env — он секретный и в git не попадает.' }
    }} />
);

// ===== SCREEN 5 — /start HANDLER (📋 birinchi qator) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(HANDLER_PARTS.map(p => p.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= HANDLER_PARTS.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const cur = HANDLER_PARTS.find(p => p.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Kod · /start', ru: 'Код · /start' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `3 qismni oching (${seen.size}/3)`, ru: `Откройте 3 части (${seen.size}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Birinchi qator: <span className="italic" style={{ color: T.accent }}>/start</span> kelganda Botjon javob bersin.</>, ru: <>Первая строка: пусть Ботик отвечает, когда придёт <span className="italic" style={{ color: T.accent }}>/start</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana 1-darsdagi "<b style={{ color: T.ink }}>/start → salom</b>" sxemasi tirik kodda. Pastdagi 3 qismni bosib, har biri nima qilishini oching.</>, ru: <>Вот схема «<b style={{ color: T.ink }}>/start → привет</b>» из 1-го урока, уже в живом коде. Нажмите на 3 части ниже и узнайте, что делает каждая.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name="bot.service.ts" minH={120}>
              <Kw>bot</Kw>{'.'}<At>start</At>{'(('}<Kw>ctx</Kw>{') => {'}{'\n'}
              {'  '}<Kw>ctx</Kw>{'.'}<At>reply</At>{'('}<St>'Salom! 👋'</St>{')'}{'\n'}
              {'})'}
            </CodeFile>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {HANDLER_PARTS.map(p => <button key={p.id} className="gchip" onClick={() => tap(p.id)} style={seen.has(p.id) ? { boxShadow: `inset 0 0 0 1.5px ${T.success}`, color: T.success } : undefined}>{seen.has(p.id) ? '✓ ' : ''}<span className="mono">{p.tok}</span></button>)}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="note-h"><span className="mono" style={{ color: T.accent }}>{cur.tok}</span></p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.desc)}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Kod qismini bosing ←', ru: 'Нажмите на часть кода ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">bot.start</span> = signal, <span className="mono">ctx.reply</span> = amal. Aynan 1-darsdagi mantiq — faqat endi Telegraf yozilish qoidasida.</>, ru: <><span className="mono">bot.start</span> = сигнал, <span className="mono">ctx.reply</span> = действие. Та же логика, что в 1-м уроке — только теперь записана по правилам Telegraf.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — ✉️ ctx (KONVERT) umumiy ko'rinishi =====
const CTX_FIELDS = [
  { id: 'from', tok: 'ctx.from', val: { uz: '{ id: 5012, first_name: "Aziza" }', ru: '{ id: 5012, first_name: "Aziza" }' }, desc: { uz: "Kim yozdi — mijoz haqidagi ma'lumot.", ru: 'Кто написал — сведения о клиенте.' } },
  { id: 'text', tok: 'ctx.message.text', val: { uz: '"Salom"', ru: '"Привет"' }, desc: { uz: 'Mijoz yuborgan matn.', ru: 'Текст, который отправил клиент.' } },
  { id: 'reply', tok: 'ctx.reply(...)', val: { uz: '→ qayerga javob berish', ru: '→ куда отвечать' }, desc: { uz: 'Javob qanday va kimga qaytarilishi (amal).', ru: 'Как и кому вернётся ответ (действие).' } }
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(CTX_FIELDS.map(f => f.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= CTX_FIELDS.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const cur = CTX_FIELDS.find(f => f.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Kod · ✉️ konvert', ru: 'Код · ✉️ конверт' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Konvert ichini oching (${seen.size}/3)`, ru: `Загляните в конверт (${seen.size}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="mono" style={{ color: T.accent }}>ctx</span> — har xabar bilan keladigan <span className="italic" style={{ color: T.accent }}>✉️ konvert</span>.</>, ru: <><span className="mono" style={{ color: T.accent }}>ctx</span> — <span className="italic" style={{ color: T.accent }}>✉️ конверт</span>, который приходит с каждым сообщением.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har qatorga <b style={{ color: T.ink }}>ctx</b> (context) keladi — bu signal bilan birga kelgan "konvert": kim yozdi, nima yozdi va qayerga javob berish kerak. Ichidagi 3 narsani bosib ko'ring.</>, ru: <>В каждую строку приходит <b style={{ color: T.ink }}>ctx</b> (context) — «конверт», пришедший вместе с сигналом: кто написал, что написал и куда отвечать. Нажмите на 3 вещи внутри него.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="env-card">
              <p className="flow-label" style={{ marginBottom: 8 }}>{tr({ uz: '✉️ ctx — konvert ichida', ru: '✉️ ctx — внутри конверта' })}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {CTX_FIELDS.map(f => <button key={f.id} className={`pick-row ${seen.has(f.id) ? 'picked' : ''} ${active === f.id ? 'sel' : ''}`} onClick={() => tap(f.id)}><span className="mono" style={{ flex: 1 }}>{f.tok}</span><span className="pick-plus">{seen.has(f.id) ? '✓' : '+'}</span></button>)}
              </div>
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="note-h"><span className="mono" style={{ color: T.accent }}>{cur.tok}</span></p><p className="mono small" style={{ color: T.success, margin: '0 0 6px' }}>{tr(cur.val)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.desc)}</p></div>
              : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Konvert ichini bosing ←', ru: 'Нажмите внутри конверта ←' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Demak <span className="mono">ctx</span> orqali Botjoningiz kim bilan, nima haqida gaplashayotganini biladi va to'g'ri manzilga javob bera oladi. Keyinroq bu manzil xato bo'lsa nima bo'lishini ko'ramiz.</>, ru: <>Значит, через <span className="mono">ctx</span> ваш Ботик знает, с кем и о чём говорит, и может ответить по верному адресу. Дальше посмотрим, что будет, если адрес окажется неверным.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — IKKI XIL TUGMA: inline vs reply =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [mode, setMode] = useState('inline');
  const [tried, setTried] = useState(storedAnswer ? new Set(['inline', 'reply']) : new Set(['inline']));
  const [cb, setCb] = useState(null);
  const [sent, setSent] = useState([]);
  const [sc, setSc] = useState(0);
  const done = tried.size >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const switchMode = (m) => { setMode(m); setTried(prev => new Set(prev).add(m)); setCb(null); setSc(n => n + 1); };
  const inlineClick = (label, data) => { setCb({ label, data }); setSc(n => n + 1); };
  const replyClick = (label) => { setSent(s => [...s, label]); setSc(n => n + 1); };
  return (
    <Stage eyebrow={tr({ uz: 'Tugmalar · maydon', ru: 'Кнопки · площадка' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Ikkala turni sinab ko'ring", ru: 'Попробуйте оба вида' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ikki xil tugma: <span className="italic" style={{ color: T.accent }}>xabar ustidagi</span> va <span className="italic" style={{ color: T.accent }}>pastdagi taxta</span>. Farqini his qiling.</>, ru: <>Два вида кнопок: <span className="italic" style={{ color: T.accent }}>под сообщением</span> и <span className="italic" style={{ color: T.accent }}>нижняя панель</span>. Почувствуйте разницу.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yuqoridagi tugmalar bilan rejimni almashtiring va tugmalarni bosib ko'ring. <b style={{ color: T.ink }}>Xabar ustidagi tugma (inline)</b> — bosilsa hech narsa yozilmaydi, signal jimgina ketadi. <b style={{ color: T.ink }}>Pastdagi tugmalar taxtasi (reply)</b> — bosilsa matn yoziladi.</>, ru: <>Переключайте режим кнопками сверху и понажимайте кнопки. <b style={{ color: T.ink }}>Кнопка под сообщением (inline)</b> — при нажатии ничего не пишется, сигнал уходит тихо. <b style={{ color: T.ink }}>Нижняя панель кнопок (reply)</b> — при нажатии пишется текст.</> })}</Mentor>
        <div className="seg fade-up">
          <button className={`seg-btn ${mode === 'inline' ? 'on' : ''}`} onClick={() => switchMode('inline')}>{tr({ uz: '🔘 Xabar ustidagi tugma', ru: '🔘 Кнопка под сообщением' })} {tried.has('inline') && '✓'}</button>
          <button className={`seg-btn ${mode === 'reply' ? 'on' : ''}`} onClick={() => switchMode('reply')}>{tr({ uz: '⌨️ Tugmalar taxtasi', ru: '⌨️ Панель кнопок' })} {tried.has('reply') && '✓'}</button>
        </div>
        <Zoomable>
        <div className="split">
          <Col>
            {mode === 'inline'
              ? <TgChat key="inline" input={false} minH={150}>
                  <Bubble from="user">/menyu</Bubble>
                  <Bubble from="bot" inline={[[{ label: { uz: '🍕 Pizza', ru: '🍕 Пицца' }, fired: cb?.data === 'pizza', onClick: () => inlineClick({ uz: '🍕 Pizza', ru: '🍕 Пицца' }, 'pizza') }, { label: { uz: '🥤 Ichimlik', ru: '🥤 Напиток' }, fired: cb?.data === 'drink', onClick: () => inlineClick({ uz: '🥤 Ichimlik', ru: '🥤 Напиток' }, 'drink') }], [{ label: { uz: '🛒 Savat', ru: '🛒 Корзина' }, fired: cb?.data === 'cart', onClick: () => inlineClick({ uz: '🛒 Savat', ru: '🛒 Корзина' }, 'cart') }]]}>{tr({ uz: 'Menyuni tanlang:', ru: 'Выберите из меню:' })}</Bubble>
                </TgChat>
              : <TgChat key="reply" minH={150} replyKb={[[{ label: { uz: '🍕 Pizza', ru: '🍕 Пицца' }, onClick: () => replyClick({ uz: '🍕 Pizza', ru: '🍕 Пицца' }) }, { label: { uz: '🥤 Ichimlik', ru: '🥤 Напиток' }, onClick: () => replyClick({ uz: '🥤 Ichimlik', ru: '🥤 Напиток' }) }], [{ label: { uz: '🛒 Savat', ru: '🛒 Корзина' }, onClick: () => replyClick({ uz: '🛒 Savat', ru: '🛒 Корзина' }) }]]}>
                  <Bubble from="bot">{tr({ uz: "Tugmani bosing — u xabar bo'lib yuboriladi:", ru: 'Нажмите кнопку — она отправится как сообщение:' })}</Bubble>
                  {sent.map((s, i) => <Bubble key={i} from="user">{tr(s)}</Bubble>)}
                </TgChat>}
          </Col>
          <Col>
            {mode === 'inline' ? <>
              <div className="sk-info"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: '🔘 Xabar ustidagi tugma', ru: '🔘 Кнопка под сообщением' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Xabarning tagiga yopishadi. Bosilganda matn YUBORMAYDI — yashirin <b>signal</b> jo'natadi. Botjon uni <span className="mono">bot.action(...)</span> bilan ushlaydi.</>, ru: <>Прилипает под сообщением. При нажатии текст НЕ отправляет — шлёт скрытый <b>сигнал</b>. Ботик ловит его через <span className="mono">bot.action(...)</span>.</> })}</p></div>
              {cb ? <div className="frame-success fade-step" key={cb.data}><p className="body mono" style={{ margin: 0, color: T.ink, fontSize: 13 }}>{tr({ uz: '⚡ signal keldi →', ru: '⚡ пришёл сигнал →' })} <b style={{ color: T.success }}>action: '{cb.data}'</b><br />{tr({ uz: "(chat tarixiga yangi xabar qo'shilmadi)", ru: '(в историю чата новое сообщение не добавилось)' })}</p></div>
                : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Chapdagi tugmani bosing ←', ru: 'Нажмите кнопку слева ←' })}</p></div>}
            </> : <>
              <div className="sk-info"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: '⌨️ Pastdagi tugmalar taxtasi', ru: '⌨️ Нижняя панель кнопок' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Klaviatura o'rnida turadi. Bosilganda u oddiy <b>matn xabar</b> sifatida yuboriladi. Botjon uni <span className="mono">bot.hears(...)</span> bilan ushlaydi.</>, ru: <>Стоит на месте клавиатуры. При нажатии отправляется как обычное <b>текстовое сообщение</b>. Ботик ловит его через <span className="mono">bot.hears(...)</span>.</> })}</p></div>
              {sent.length > 0 ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ko'rdingizmi — bosilgan tugma <b>mijozning xabari</b> bo'lib chatga qo'shildi. Xabar ustidagi tugmada bunday bo'lmagandi.</>, ru: <>Видите — нажатая кнопка добавилась в чат как <b>сообщение клиента</b>. С кнопкой под сообщением такого не было.</> })}</p></div>
                : <div className="frame-dash"><p className="small" style={{ color: T.ink3, textAlign: 'center', fontStyle: 'italic', margin: 0 }}>{tr({ uz: 'Pastdagi tugmani bosing ←', ru: 'Нажмите кнопку внизу ←' })}</p></div>}
            </>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Qoida: tez tanlov/menyu uchun <b>xabar ustidagi tugma</b>, doimiy klaviatura (asosiy buyruqlar) uchun <b>pastdagi taxta</b> ishlatiladi.</>, ru: <>Правило: для быстрого выбора и меню берут <b>кнопку под сообщением</b>, а для постоянной клавиатуры (основные команды) — <b>нижнюю панель</b>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST 2 =====
const Screen8 = (props) => (
  <QuestionScreen {...props} idx={8} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    questionText={{ uz: 'Inline va reply tugma orasidagi asosiy farq nima?', ru: 'В чём главное отличие inline-кнопки от reply-кнопки?' }}
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-sub" style={{ marginTop: 8 }}>Xabar ustidagi tugma va pastdagi taxta orasidagi asosiy <span className="italic" style={{ color: T.accent }}>farq</span>?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите правильный ответ</p><h2 className="title h-sub" style={{ marginTop: 8 }}>Главное <span className="italic" style={{ color: T.accent }}>отличие</span> кнопки под сообщением от нижней панели?</h2></> })}
    options={[
      { uz: 'Ikkalasi bir xil ishlaydi, faqat rangi va shakli farq qiladi, xolos', ru: 'Обе работают одинаково, отличаются только цветом и формой, и всё' },
      { uz: 'Xabar ustidagi tugma faqat rasm yuboradi, taxta esa faqat matn yuborishi mumkin', ru: 'Кнопка под сообщением шлёт только картинку, а панель — только текст' },
      { uz: 'Pastdagi taxta pulga, xabar ustidagi tugma esa bepulga ishlatiladi hozircha', ru: 'Нижняя панель платная, а кнопка под сообщением пока бесплатная' },
      { uz: 'Xabar ustidagi tugma yashirin signal yuboradi, taxta esa matn xabar yuboradi', ru: 'Кнопка под сообщением шлёт скрытый сигнал, а панель — текстовое сообщение' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "To'g'ri! Xabar ustidagi tugma (inline) xabarga yopishadi va yashirin signal (bot.action ushlaydi) yuboradi. Pastdagi taxta (reply) esa oddiy matn xabar (bot.hears ushlaydi) yuboradi.", ru: 'Верно! Кнопка под сообщением (inline) прилипает к сообщению и шлёт скрытый сигнал (его ловит bot.action). А нижняя панель (reply) шлёт обычное текстовое сообщение (его ловит bot.hears).' }}
    explainWrong={{
      0: { uz: 'Rang emas — xulq-atvori farq qiladi: biri yashirin signal, ikkinchisi ochiq matn yuboradi.', ru: 'Дело не в цвете — отличается поведение: одна шлёт скрытый сигнал, другая открытый текст.' },
      1: { uz: 'Ikkalasi ham matn yoki menyu uchun ishlatiladi. Farq — qanday signal yuborishida.', ru: 'Обе используются для текста или меню. Разница — в том, какой сигнал они шлют.' },
      2: { uz: "Pullik/bepul degan narsa yo'q — ikkalasi ham bepul. Farq — signal turi.", ru: 'Платного/бесплатного тут нет — обе бесплатны. Разница в виде сигнала.' },
      default: { uz: 'Xabar ustidagi tugma → signal (yashirin); pastdagi taxta → matn (ochiq).', ru: 'Кнопка под сообщением → сигнал (скрытый); нижняя панель → текст (открытый).' }
    }} />
);

// ===== ★ SCREEN 9 — MARKAZIY O'YIN: «TUGMALAR TAXTASINI QURING» =====
const SIGNALS = [
  { id: 'cmd_menu', kind: 'command', chip: { uz: '/menu', ru: '/menu' }, chatLabel: { uz: '/menu', ru: '/menu' }, ruleLabel: "bot.command('menu', ...)", desc: { uz: "Chaqiruv so'zi — mijoz /menu yozganda ishga tushadi.", ru: 'Слово-вызов — срабатывает, когда клиент пишет /menu.' }, reply: { uz: 'Menyu: 🍕 Pizza · 🥤 Ichimlik · 🛒 Buyurtma', ru: 'Меню: 🍕 Пицца · 🥤 Напиток · 🛒 Заказ' } },
  { id: 'btn_pizza', kind: 'inline', chip: { uz: '🍕 Pizza', ru: '🍕 Пицца' }, chatLabel: null, ruleLabel: "bot.action('pizza', ...)", desc: { uz: 'Xabar ustidagi tugma — bosilsa yashirin signal ketadi.', ru: 'Кнопка под сообщением — при нажатии уходит скрытый сигнал.' }, reply: { uz: '🍕 Pizza tanlandi! Buyurtma qabul qilindi.', ru: '🍕 Пицца выбрана! Заказ принят.' } },
  { id: 'btn_about', kind: 'reply', chip: { uz: 'ℹ️ Biz haqimizda', ru: 'ℹ️ О нас' }, chatLabel: { uz: 'ℹ️ Biz haqimizda', ru: 'ℹ️ О нас' }, ruleLabel: "bot.hears('ℹ️ Biz haqimizda', ...)", desc: { uz: 'Pastdagi taxta tugmasi — bosilsa matn yuboriladi.', ru: 'Кнопка нижней панели — при нажатии отправляется текст.' }, reply: { uz: 'AvtoPizza — 2020 yildan beri xizmatingizdamiz!', ru: 'AvtoPizza — к вашим услугам с 2020 года!' } }
];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [wired, setWired] = useState(() => new Set());
  const [tested, setTested] = useState(() => new Set());
  const [chatLog, setChatLog] = useState([]);
  const [unwiredHits, setUnwiredHits] = useState({});
  const [everDone, setEverDone] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = everDone;
  const fired = useRef(!!storedAnswer);
  useEffect(() => {
    if (wired.size >= SIGNALS.length && tested.size >= SIGNALS.length && !fired.current) {
      fired.current = true; setEverDone(true);
      onAnswer(screen, { stage: 'case', screenIdx: screen, question: "Tugmalar taxtasini to'liq ulang", correct: true, solved: true, picked: true }); // payload UZ-etalon
    }
  }, [wired, tested]); // eslint-disable-line
  const wire = (id) => { setWired(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  const trySignal = (sig) => {
    setSc(n => n + 1);
    const isWired = wired.has(sig.id);
    if (sig.chatLabel) setChatLog(l => [...l, { from: 'user', text: sig.chatLabel, k: l.length }]);
    if (isWired) {
      setChatLog(l => [...l, { from: 'bot', text: sig.reply, k: l.length }]);
      setTested(prev => new Set(prev).add(sig.id));
    } else {
      setUnwiredHits(h => ({ ...h, [sig.id]: (h[sig.id] || 0) + 1 }));
    }
  };
  const walkedAway = Object.entries(unwiredHits).find(([, n]) => n >= 3);
  const misfires = Object.values(unwiredHits).reduce((a, b) => a + b, 0);
  return (
    <Stage eyebrow={tr({ uz: 'Markaziy · tugmalar taxtasi', ru: 'Главное · панель кнопок' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Barchasini ulang va sinang (${wired.size}/3 ulandi, ${tested.size}/3 sinaldi)`, ru: `Подключите и проверьте все (${wired.size}/3 подключено, ${tested.size}/3 проверено)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Botjonga <span className="italic" style={{ color: T.accent }}>tugmalar taxtasini</span> o'zingiz ulang.</>, ru: <>Подключите Ботику <span className="italic" style={{ color: T.accent }}>панель кнопок</span> сами.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Pastda 3 xil signal bor: chaqiruv so'zi, xabar ustidagi tugma va pastdagi taxta tugmasi. Avval ularni <b style={{ color: T.ink }}>sinab ko'ring</b> — ulanmagan holda hech narsa bo'lmaydi. Keyin 📋 <b style={{ color: T.ink }}>qoidalar varag'iga</b> qo'shib, qayta sinang.</>, ru: <>Ниже 3 вида сигналов: слово-вызов, кнопка под сообщением и кнопка нижней панели. Сначала <b style={{ color: T.ink }}>попробуйте</b> их — пока они не подключены, ничего не произойдёт. Потом добавьте строки в 📋 <b style={{ color: T.ink }}>лист правил</b> и попробуйте снова.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <TgChat title={{ uz: 'AvtoPizza bot', ru: 'AvtoPizza bot' }} minH={170} input={false}>
              <Bubble from="bot">{tr({ uz: "Signal yuboring, natijani ko'ring 👇", ru: 'Отправьте сигнал и посмотрите результат 👇' })}</Bubble>
              {chatLog.map(l => <Bubble key={l.k} from={l.from}>{tr(l.text)}</Bubble>)}
            </TgChat>
            {!walkedAway && misfires > 0 && <div className="mini-cust wait fade-step"><span className="mini-cust-msg">{tr({ uz: '😐 Mijoz signal yubordi, javob kutmoqda', ru: '😐 Клиент отправил сигнал и ждёт ответа' })}<span className="mini-cust-dots"> . . .</span></span></div>}
            {walkedAway && <div className="mini-cust silent fade-step"><span className="mini-cust-msg">{tr({ uz: '😕 Mijoz: "Buzuqmi bu?" — va ketib qoldi.', ru: '😕 Клиент: «Он сломан?» — и ушёл.' })}</span></div>}
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {SIGNALS.map(s => <button key={s.id} className="gchip" onClick={() => trySignal(s)}>{s.kind === 'inline' ? '🔘' : s.kind === 'reply' ? '⌨️' : '📜'} {tr(s.chip)} {tested.has(s.id) ? '✓' : ''}</button>)}
            </div>
            <p className="small" style={{ color: T.ink3, margin: 0 }}>{tr({ uz: '👆 Yuqoridagi chiplar — mijoz signalni yuborishini taqlid qiladi.', ru: '👆 Фишки выше изображают, как клиент отправляет сигнал.' })}</p>
          </Col>
          <Col>
            <div className="env-card">
              <p className="flow-label" style={{ marginBottom: 8 }}>{tr({ uz: "📋 Qoidalar varag'i (signal → amal)", ru: '📋 Лист правил (сигнал → действие)' })}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {SIGNALS.map(s => {
                  const on = wired.has(s.id);
                  return (
                    <button key={s.id} className={`pick-row code ${on ? 'picked' : ''}`} disabled={on} onClick={() => wire(s.id)}>
                      <span className="mono" style={{ flex: 1, fontSize: 12 }}>{s.ruleLabel}</span>
                      <span className="pick-plus">{on ? '✓' : tr({ uz: "+ qator qo'shish", ru: '+ добавить строку' })}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {wired.size > 0 && wired.size < SIGNALS.length && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Ulanmagan signal bosilsa — tugma bor, lekin varaqda qator yo'q. Chapdagi tugmani qayta bosib tekshiring.", ru: 'Если нажать неподключённый сигнал — кнопка есть, а строки на листе нет. Нажмите кнопку слева ещё раз и проверьте.' })}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "🎉 3 ta signal ham ulandi va ishladi: chaqiruv so'zi, xabar ustidagi tugma, pastdagi taxta. Tugma — bu faqat ko'rinish; ish 📋 varaqdagi qatordan chiqadi.", ru: '🎉 Все 3 сигнала подключены и сработали: слово-вызов, кнопка под сообщением, нижняя панель. Кнопка — это только вид; работу делает строка на 📋 листе.' })}</p></div>}
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
    questionText={{ uz: 'Xabar ustidagi tugma bosilganda kelgan signalni qaysi qator ushlaydi?', ru: 'Какая строка ловит сигнал от нажатия кнопки под сообщением?' }}
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-sub" style={{ marginTop: 8 }}>Xabar ustidagi tugma bosilganda kelgan signalni qaysi qator <span className="italic" style={{ color: T.accent }}>ushlaydi</span>?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите правильный ответ</p><h2 className="title h-sub" style={{ marginTop: 8 }}>Какая строка <span className="italic" style={{ color: T.accent }}>ловит</span> сигнал от нажатия кнопки под сообщением?</h2></> })}
    options={[
      { uz: "bot.action('pizza', ...) — xabar ustidagi tugmadan kelgan signalni ushlaydi", ru: "bot.action('pizza', ...) — ловит сигнал от кнопки под сообщением" },
      { uz: "bot.hears('pizza', ...) — faqat oddiy matn xabarlarni ushlaydi, tugmani emas", ru: "bot.hears('pizza', ...) — ловит только обычные текстовые сообщения, но не кнопку" },
      { uz: "bot.start(...) — faqat /start chaqiruv so'zini ushlaydi, tugma signalini emas", ru: 'bot.start(...) — ловит только слово-вызов /start, но не сигнал кнопки' },
      { uz: 'bot.launch() — Botjonni ishga tushiradi, hech qanday signalni ushlamaydi', ru: 'bot.launch() — запускает Ботика и не ловит никаких сигналов' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "To'g'ri! Xabar ustidagi tugma yashirin signal yuboradi — uni bot.action(...) ushlaydi. (Pastdagi taxta tugmasi esa matn yuboradi va uni bot.hears(...) ushlaydi.)", ru: 'Верно! Кнопка под сообщением шлёт скрытый сигнал — его ловит bot.action(...). (А кнопка нижней панели шлёт текст, и его ловит bot.hears(...).)' }}
    explainWrong={{
      1: { uz: 'bot.hears matn xabarni (pastdagi taxta) ushlaydi. Xabar ustidagi tugma uchun bot.action kerak.', ru: 'bot.hears ловит текстовое сообщение (нижнюю панель). Для кнопки под сообщением нужен bot.action.' },
      2: { uz: "bot.start faqat /start chaqiruv so'zini ushlaydi, tugma signalini emas.", ru: 'bot.start ловит только слово-вызов /start, но не сигнал кнопки.' },
      3: { uz: 'bot.launch() — Botjonni ishga tushiradi, qator emas. Xabar ustidagi tugma uchun bot.action ishlatiladi.', ru: 'bot.launch() запускает Ботика, это не строка-обработчик. Для кнопки под сообщением берут bot.action.' },
      default: { uz: 'Xabar ustidagi tugma signali → bot.action(...) ushlaydi.', ru: 'Сигнал кнопки под сообщением → его ловит bot.action(...).' }
    }} />
);

// ===== SCREEN 11 — ✉️ KONVERT TAJRIBASI: noto'g'ri manzil =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [fixed, setFixed] = useState(!!storedAnswer);
  const [tested, setTested] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const done = fixed && tested;
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onAnswer(screen, { stage: 'case', screenIdx: screen, question: "Konvert manzilini toping va tuzating", correct: true, solved: true, picked: true });
    }
  }, [done]); // eslint-disable-line
  const send = () => { setTested(true); setSc(n => n + 1); };
  const fix = () => { setFixed(true); setTested(false); setSc(n => n + 1); };
  return (
    <Stage eyebrow={tr({ uz: '✉️ Konvert · xato manzil', ru: '✉️ Конверт · неверный адрес' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Manzilni tuzating va sinang', ru: 'Исправьте адрес и проверьте' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Javob <span className="italic" style={{ color: T.accent }}>noto'g'ri odamga</span> ketsa nima bo'ladi?</>, ru: <>Что будет, если ответ уйдёт <span className="italic" style={{ color: T.accent }}>не тому человеку</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>✉️ Konvertda "qayerga javob berish" maydoni bor. Kod xato yozilsa, javob <b style={{ color: T.danger }}>boshqa mijozga</b> ketadi. Aziza savol yubordi, lekin kod Valining manziliga javob yozadi — buni sinab ko'ring, keyin tuzating.</>, ru: <>В ✉️ конверте есть поле «куда отвечать». Если код написан неверно, ответ уйдёт <b style={{ color: T.danger }}>другому клиенту</b>. Азиза задала вопрос, а код пишет ответ на адрес Вали — попробуйте, а потом исправьте.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Aziza — savol yubordi, javob kutmoqda', ru: 'Азиза — задала вопрос, ждёт ответа' })}</p>
            <TgChat title={{ uz: 'Aziza', ru: 'Азиза' }} ava="👩" input={false} minH={90}>
              <Bubble from="user">{tr({ uz: 'Pizza qancha turadi?', ru: 'Сколько стоит пицца?' })}</Bubble>
              {!fixed && tested && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: '6px 2px' }}>{tr({ uz: '⏳ Javob kelmadi…', ru: '⏳ Ответа не пришло…' })}</p>}
              {fixed && tested && <Bubble from="bot">{tr({ uz: "30 000 so'm, yetkazib berish bilan!", ru: '30 000 сумов, вместе с доставкой!' })}</Bubble>}
            </TgChat>
            <CodeFile name="bot.service.ts" minH={0}>
              <Kw>bot</Kw>{'.'}<At>hears</At>{"('narx', ("}<Kw>ctx</Kw>{') => {'}{'\n'}
              {'  '}{fixed ? <Kw>ctx</Kw> : <span style={{ color: CODE.tag, textDecoration: 'line-through' }}>valiChatId</span>}{'.'}<At>reply</At>{'('}<St>{"'30 000 so'm…'"}</St>{')'}{'\n'}
              {'})'}
              {!fixed && <><br /><Cm>{tr({ uz: "// ❌ noto'g'ri manzilga (Vali) yozilgan", ru: '// ❌ написано на неверный адрес (Вали)' })}</Cm></>}
              {fixed && <><br /><Cm>{tr({ uz: '// ✅ ctx — signal yuborgan Azizaga javob beradi', ru: '// ✅ ctx — отвечает Азизе, которая отправила сигнал' })}</Cm></>}
            </CodeFile>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Vali — bunday savol bermagan edi', ru: 'Вали — такого вопроса не задавал' })}</p>
            <TgChat title={{ uz: 'Vali', ru: 'Вали' }} ava="🧑" input={false} minH={90}>
              {!fixed && tested && <Bubble from="bot">{tr({ uz: "30 000 so'm, yetkazib berish bilan!", ru: '30 000 сумов, вместе с доставкой!' })}</Bubble>}
              {!fixed && tested && <p className="small" style={{ color: T.danger, fontStyle: 'italic', margin: '6px 2px' }}>{tr({ uz: '😳 Vali: "Men bunday savol bermagandim!"', ru: '😳 Вали: «Я такого не спрашивал!»' })}</p>}
              {(fixed || !tested) && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: '6px 2px' }}>{fixed ? tr({ uz: 'Endi bu chatga hech narsa kelmaydi ✓', ru: 'Теперь в этот чат ничего не приходит ✓' }) : tr({ uz: 'Hali sinalmagan — «Signalni sinash» tugmasini bosing ←', ru: 'Ещё не проверено — нажмите «Проверить сигнал» ←' })}</p>}
            </TgChat>
            {!tested && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={send}>{tr({ uz: '▶ Signalni sinash', ru: '▶ Проверить сигнал' })}</button>}
            {tested && !fixed && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Javob <b>Valiga</b> ketdi — Aziza hech narsa olmadi! Kod konvertdagi <span className="mono">ctx</span>'ni emas, boshqa mijozning manzilini ishlatgan.</>, ru: <>Ответ ушёл <b>Вали</b> — а Азиза не получила ничего! Код взял не <span className="mono">ctx</span> из конверта, а адрес другого клиента.</> })}</p><button className="btn-soft" style={{ marginTop: 8 }} onClick={fix}>{tr({ uz: '🔧 Konvert manzilini tuzatish', ru: '🔧 Исправить адрес в конверте' })}</button></div>}
            {fixed && !tested && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={send}>{tr({ uz: '▶ Qayta sinash', ru: '▶ Проверить снова' })}</button>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✅ Endi kod <span className="mono">ctx.reply(...)</span> ishlatadi — u har doim <b>signal yuborgan mijozga</b> javob beradi, boshqa hech kimga emas.</>, ru: <>✅ Теперь код использует <span className="mono">ctx.reply(...)</span> — он всегда отвечает <b>тому клиенту, который отправил сигнал</b>, и никому больше.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — OXIRGI QATOR (fallback) + tezlik cheklovi =====
const RATE_LIMIT_N = 8;
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [fallbackOn, setFallbackOn] = useState(!!storedAnswer);
  const [chatLog, setChatLog] = useState([]);
  const [tested, setTested] = useState(false);
  const [rateClicks, setRateClicks] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const done = fallbackOn && tested;
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onAnswer(screen, { stage: 'case', screenIdx: screen, question: "Oxirgi qator (fallback) qo'shildi va sinaldi", correct: true, solved: true, picked: true });
    }
  }, [done]); // eslint-disable-line
  const sendUnknown = () => {
    setSc(n => n + 1);
    setChatLog(l => [...l, { from: 'user', text: { uz: 'Necha soatda yetib boradi?', ru: 'За сколько часов доедет?' }, k: l.length }]);
    if (fallbackOn) { setChatLog(l => [...l, { from: 'bot', text: { uz: 'Kechirasiz, tushunmadim 🤔 /menu bosing yordam uchun.', ru: 'Извините, не понял 🤔 Нажмите /menu — там подсказка.' }, k: l.length }]); setTested(true); }
  };
  const addFallback = () => { setFallbackOn(true); setSc(n => n + 1); };
  const rateClick = () => {
    if (rateLimited) return;
    const n = rateClicks + 1; setRateClicks(n); setSc(n2 => n2 + 1);
    if (n >= RATE_LIMIT_N) setRateLimited(true);
  };
  const rateReset = () => { setRateClicks(0); setRateLimited(false); };
  return (
    <Stage eyebrow={tr({ uz: 'Oxirgi qator · fallback', ru: 'Последняя строка · fallback' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Fallback qo'shing va sinang", ru: 'Добавьте fallback и проверьте' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Botjon hech qachon <span className="italic" style={{ color: T.accent }}>jim qolmasin</span>.</>, ru: <>Пусть Ботик никогда не <span className="italic" style={{ color: T.accent }}>молчит</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mijoz varaqdagi hech bir qatorga mos kelmaydigan narsa yozsa nima bo'ladi? Avval sinab ko'ring, keyin <b style={{ color: T.ink }}>oxirgi qator</b> (fallback) qo'shib, Botjonni "jim qolmaslikka" o'rgating.</>, ru: <>Что будет, если клиент напишет то, под что нет ни одной строки на листе? Сначала попробуйте, потом добавьте <b style={{ color: T.ink }}>последнюю строку</b> (fallback) и научите Ботика «не молчать».</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "1) Noma'lum xabar yuborish", ru: '1) Отправить незнакомое сообщение' })}</p>
            <TgChat title={{ uz: 'AvtoPizza bot', ru: 'AvtoPizza bot' }} minH={130} input={false}>
              <Bubble from="bot">{tr({ uz: 'Salom! /menu bosing.', ru: 'Привет! Нажмите /menu.' })}</Bubble>
              {chatLog.map(l => <Bubble key={l.k} from={l.from}>{tr(l.text)}</Bubble>)}
              {chatLog.length > 0 && !fallbackOn && <p className="small" style={{ color: T.ink3, fontStyle: 'italic', margin: '6px 2px' }}>{tr({ uz: '🔇 Botjon jim qoldi…', ru: '🔇 Ботик промолчал…' })}</p>}
            </TgChat>
            <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={sendUnknown}>{tr({ uz: "✉️ Noma'lum xabar yuborish", ru: '✉️ Отправить незнакомое сообщение' })}</button>
            {!fallbackOn && chatLog.length > 0 && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Hech bir qatorga mos kelmadi — Botjon <b>jim</b> qoldi. Mijoz tashvishlanadi: "Ishlayaptimi bu?"</>, ru: <>Не подошло ни под одну строку — Ботик <b>промолчал</b>. Клиент начинает волноваться: «Он вообще работает?»</> })}</p><button className="btn" style={{ marginTop: 8 }} onClick={addFallback}>{tr({ uz: "📋 Oxirgi qatorni varaqqa qo'shish", ru: '📋 Добавить последнюю строку на лист' })}</button></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✅ Endi <span className="mono">bot.on('text', ...)</span> — oxirgi qator — hech qanday qatorga mos kelmagan xabarga ham javob beradi. Botjon endi hech qachon jim qolmaydi.</>, ru: <>✅ Теперь <span className="mono">bot.on('text', ...)</span> — последняя строка — отвечает даже на сообщение, под которое нет ни одной строки. Ботик больше никогда не молчит.</> })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: '2) Tezlik cheklovi (rate limit)', ru: '2) Ограничение скорости (rate limit)' })}</p>
            <div className="sk-info">
              <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: '🍕 tugmasini juda tez-tez bosib ko\'ring — xizmat oynasi qanday himoyalanishini kuzating.', ru: '🍕 Понажимайте кнопку очень часто — посмотрите, как защищается служебное окно.' })}</p>
            </div>
            <button className={`gchip ${rateLimited ? '' : 'tap-hint'}`} disabled={rateLimited} onClick={rateClick} style={{ alignSelf: 'flex-start' }}>{tr({ uz: '🍕 Pizza', ru: '🍕 Пицца' })} ({rateClicks}/{RATE_LIMIT_N})</button>
            {rateLimited && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>⏱ <b>429</b> — xizmat oynasi vaqtincha yopildi. Juda tez-tez signal yuborilsa, Telegram javob berishni to'xtatadi. Sekinroq yuboring.</>, ru: <>⏱ <b>429</b> — служебное окно временно закрылось. Если слать сигналы слишком часто, Telegram перестаёт отвечать. Отправляйте медленнее.</> })}</p><button className="btn-soft" style={{ marginTop: 8 }} onClick={rateReset}>{tr({ uz: '↻ Qayta urinish', ru: '↻ Попробовать снова' })}</button></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — BUILDER: chaqiruv so'zlari ro'yxati =====
// ⚠️ UZ-RU: `correct` va `wrong` kalitlari — til-mustaqil ICHKI id'lar (o'zgarmaydi).
// Ko'rinadigan matn `options[].t` ichida {uz,ru} bo'lib turadi.
const CMD_BLANKS = [
  { key: 'start', label: '/start —', correct: 'run', options: [
      { id: 'run', t: { uz: 'Botni ishga tushiradi', ru: 'Запускает бота' } },
      { id: 'off', t: { uz: "Botni butunlay o'chirib tashlaydi", ru: 'Полностью выключает бота' } },
      { id: 'img', t: { uz: 'Faqat rasm yuboradi', ru: 'Отправляет только картинку' } }
    ], wrong: { off: { uz: "/start Botjonni O'CHIRMAYDI — u ishga tushirib, salomlashadi.", ru: '/start НЕ выключает Ботика — он запускает его и здоровается.' }, img: { uz: "/start rasm bilan bog'liq emas — u suhbatni boshlaydi.", ru: '/start не связан с картинками — он начинает разговор.' } } },
  { key: 'help', label: '/help —', correct: 'help', options: [
      { id: 'help', t: { uz: "Yordam va buyruqlar ro'yxatini ko'rsatadi", ru: 'Показывает помощь и список команд' } },
      { id: 'pass', t: { uz: 'Mijozning parolini qayta tiklaydi', ru: 'Восстанавливает пароль клиента' } },
      { id: 'reinstall', t: { uz: "Botni butunlay qayta o'rnatadi", ru: 'Полностью переустанавливает бота' } }
    ], wrong: { pass: { uz: "Botlarda odatda parol tizimi yo'q — /help yordam ko'rsatadi.", ru: 'У ботов обычно нет системы паролей — /help показывает помощь.' }, reinstall: { uz: "/help hech narsani o'rnatmaydi — faqat ma'lumot beradi.", ru: '/help ничего не устанавливает — только даёт информацию.' } } },
  { key: 'menu', label: '/menu —', correct: 'menu', options: [
      { id: 'menu', t: { uz: 'Menyuni qayta ochadi', ru: 'Снова открывает меню' } },
      { id: 'kick', t: { uz: 'Mijozni chatdan chiqarib yuboradi', ru: 'Выгоняет клиента из чата' } },
      { id: 'token', t: { uz: "Botning kalitini ko'rsatadi", ru: 'Показывает ключ бота' } }
    ], wrong: { kick: { uz: "/menu hech kimni chiqarib yubormaydi — u menyuni ko'rsatadi.", ru: '/menu никого не выгоняет — он показывает меню.' }, token: { uz: "Kalit hech qachon mijozga ko'rsatilmaydi — bu maxfiy.", ru: 'Ключ клиенту не показывают никогда — он секретный.' } } }
];
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [filled, setFilled] = useState(() => (storedAnswer ? Object.fromEntries(CMD_BLANKS.map(b => [b.key, b.correct])) : {}));
  const [wrongKey, setWrongKey] = useState(null);
  const [wrongMsg, setWrongMsg] = useState('');
  const wrongEverRef = useRef(storedAnswer ? (storedAnswer.correct === false) : false);
  const [sc, setSc] = useState(0);
  const done = CMD_BLANKS.every(b => filled[b.key] === b.correct);
  const fired = useRef(!!storedAnswer);
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onAnswer(screen, { stage: 'builder', screenIdx: screen, question: "Chaqiruv so'zlari ro'yxatini to'ldiring", correct: !wrongEverRef.current, solved: true, picked: true });
    }
  }, [done]); // eslint-disable-line
  const pick = (blank, optId) => {
    if (filled[blank.key] === blank.correct) return;
    if (optId === blank.correct) { setFilled(f => ({ ...f, [blank.key]: optId })); setWrongKey(null); setSc(n => n + 1); }
    else { wrongEverRef.current = true; setWrongKey(blank.key); setWrongMsg(blank.wrong[optId] || { uz: "Bu to'g'ri emas.", ru: 'Это неверно.' }); setTimeout(() => setWrongKey(k => (k === blank.key ? null : k)), 500); }
  };
  const labelOf = (blank) => { const o = blank.options.find(x => x.id === filled[blank.key]); return o ? tr(o.t) : ''; };
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot · chaqiruv so'zlari", ru: 'Практика · слова-вызовы' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Ro'yxatni to'ldiring", ru: 'Заполните список' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Telegram ko'rsatadigan <span className="italic" style={{ color: T.accent }}>buyruqlar ro'yxatini</span> o'zingiz to'ldiring.</>, ru: <>Заполните <span className="italic" style={{ color: T.accent }}>список команд</span>, который показывает Telegram.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Chaqiruv so'zlari <span className="mono">/</span> bilan boshlanadi — Telegram ularni avtomatik ro'yxatga chiqaradi. Har buyruq nima qilishini to'g'ri chipdan tanlab to'ldiring.</>, ru: <>Слова-вызовы начинаются с <span className="mono">/</span> — Telegram автоматически выводит их списком. Выберите нужную фишку и заполните, что делает каждая команда.</> })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: "📋 Telegram — buyruqlar ro'yxati", ru: '📋 Telegram — список команд' })}</p>
            <div className="env-card">
              {CMD_BLANKS.map(b => (
                <div key={b.key} className="pick-row" style={{ cursor: 'default' }}><span className="mono" style={{ minWidth: 62 }}>/{b.key}</span><span style={{ flex: 1, color: filled[b.key] ? T.ink : T.ink3, fontStyle: filled[b.key] ? 'normal' : 'italic' }}>{labelOf(b) || '____'}</span></div>
              ))}
            </div>
          </Col>
          <Col>
            {CMD_BLANKS.map(b => (
              <div key={b.key} className="blank-group">
                <span className="bg-lbl">{b.label}</span>
                <div className="blank-row">
                  {b.options.map(opt => {
                    const okChosen = filled[b.key] === opt.id;
                    return <button key={opt.id} className={`gchip ${wrongKey === b.key ? 'shake' : ''} ${filled[b.key] === b.correct ? '' : 'tap-hint'}`} disabled={filled[b.key] === b.correct} onClick={() => pick(b, opt.id)} style={okChosen ? { boxShadow: `inset 0 0 0 1.5px ${T.success}`, color: T.success } : undefined}>{okChosen ? '✓ ' : ''}{tr(opt.t)}</button>;
                  })}
                </div>
              </div>
            ))}
            {wrongKey && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr(wrongMsg)}</p></div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Ro'yxat to'ldi! Mijoz endi / yozganda Telegram unga tanish buyruqlarni taklif qiladi.", ru: 'Список заполнен! Теперь, когда клиент напишет /, Telegram предложит ему знакомые команды.' })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — TEST 4 =====
const Screen14 = (props) => (
  <QuestionScreen {...props} idx={14} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    questionText={{ uz: "/start va /help kabi chaqiruv so'zlari nimasi bilan alohida?", ru: 'Чем особенны слова-вызовы вроде /start и /help?' }}
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-sub" style={{ marginTop: 8 }}><span className="mono" style={{ color: T.accent }}>/start</span> va <span className="mono" style={{ color: T.accent }}>/help</span> kabi chaqiruv so'zlari nimasi bilan <span className="italic" style={{ color: T.accent }}>alohida</span>?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите правильный ответ</p><h2 className="title h-sub" style={{ marginTop: 8 }}>Чем <span className="italic" style={{ color: T.accent }}>особенны</span> слова-вызовы вроде <span className="mono" style={{ color: T.accent }}>/start</span> и <span className="mono" style={{ color: T.accent }}>/help</span>?</h2></> })}
    options={[
      { uz: 'Ular faqat mentor kompyuterida ishlaydi, boshqa hech joyda ishlamaydi', ru: 'Они работают только на компьютере ментора и больше нигде' },
      { uz: "Ular botni butunlay o'chirib qo'yadi va qayta yoqish kerak bo'ladi", ru: 'Они полностью выключают бота, и его придётся включать заново' },
      { uz: "Ular / bilan boshlanadi, Telegram esa ularni ro'yxatda ko'rsatadi", ru: 'Они начинаются с /, а Telegram показывает их в списке' },
      { uz: 'Ular faqat rasm va video yuborish uchun ishlatiladigan buyruqlar, xolos', ru: 'Это команды только для отправки картинок и видео, и всё' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! Chaqiruv so'zlari / bilan boshlanadi va Telegram ularni avtomatik ravishda buyruqlar ro'yxatida ko'rsatadi — mijoz ularni bir qarashda ko'radi.", ru: 'Верно! Слова-вызовы начинаются с / и Telegram автоматически показывает их в списке команд — клиент видит их с первого взгляда.' }}
    explainWrong={{
      0: { uz: "Bunday cheklov yo'q — chaqiruv so'zlari istalgan qurilmada bir xil ishlaydi.", ru: 'Такого ограничения нет — слова-вызовы одинаково работают на любом устройстве.' },
      1: { uz: "Chaqiruv so'zi botni o'chirmaydi — u faqat tegishli qatorni ishga tushiradi.", ru: 'Слово-вызов не выключает бота — оно лишь запускает соответствующую строку.' },
      3: { uz: "Chaqiruv so'zlari matn bilan bog'liq, rasm/video bilan emas.", ru: 'Слова-вызовы связаны с текстом, а не с картинками и видео.' },
      default: { uz: "Chaqiruv so'zlari / bilan boshlanadi va ro'yxatga chiqadi.", ru: 'Слова-вызовы начинаются с / и попадают в список.' }
    }} />
);

// ===== SCREEN 15 — FINAL: bot.ts'ni to'g'ri tartibda yig'ish (DragDropOrder) =====
const BOT_LINES = [
  { id: 'env', label: '🔑 const token = process.env.BOT_TOKEN', note: { uz: "kalit .env'dan o'qiladi", ru: 'ключ читается из .env' } },
  { id: 'create', label: '🤖 const bot = new Telegraf(token)', note: { uz: 'Botjon yaratiladi (kalit bilan)', ru: 'создаётся Ботик (с ключом)' } },
  { id: 'start', label: "📋 bot.start((ctx) => ctx.reply('Salom!', menu))", note: { uz: '/start signal → menyu (amal)', ru: 'сигнал /start → меню (действие)' } },
  { id: 'action', label: "🔘 bot.action('pizza', (ctx) => ctx.reply('🍕'))", note: { uz: 'tugma signali → amal', ru: 'сигнал кнопки → действие' } },
  { id: 'fallback', label: "🔕 bot.on('text', (ctx) => ctx.reply('Tushunmadim'))", note: { uz: 'oxirgi qator — jim qolmaslik', ru: 'последняя строка — чтобы не молчать' } },
  { id: 'launch', label: '🚀 bot.launch()', note: { uz: 'Botjonni ishga tushiradi (kutadi)', ru: 'запускает Ботика (и ждёт)' } }
];
const BOT_ORDER = BOT_LINES.map(l => l.id);
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  const [consequence, setConsequence] = useState(null);
  const hadWrongRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect === false) : false);
  const fired = useRef(!!storedAnswer);
  const [recapOpen, setRecapOpen] = useState(false);
  const onSolved = () => {
    if (fired.current) { setDone(true); return; }
    fired.current = true;
    const firstOk = !hadWrongRef.current;
    setDone(true);
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: "bot.ts qatorlarini to'g'ri tartibda joylang", correct: firstOk, firstAttemptCorrect: firstOk, solved: true, picked: firstOk ? 0 : 1 });
  };
  const onChange = (slots) => {
    if (fired.current) return;
    const full = slots.every(s => s !== null);
    if (!full) { setConsequence(null); return; }
    const solved = slots.every((s, i) => s === BOT_ORDER[i]);
    if (solved) { setConsequence(null); return; }
    hadWrongRef.current = true;
    const launchIdx = slots.indexOf('launch');
    const fallbackIdx = slots.indexOf('fallback');
    setConsequence(launchIdx >= 0 && fallbackIdx >= 0 && launchIdx < fallbackIdx ? 'launch-early' : 'wrong');
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Итог · практика' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "bot.ts'ni yig'ing", ru: 'Соберите bot.ts' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: <span className="italic" style={{ color: T.accent }}>bot.ts</span>ni to'g'ri tartibda yig'ing.</>, ru: <>Последний шаг: соберите <span className="italic" style={{ color: T.accent }}>bot.ts</span> в правильном порядке.</> })}</h2></div>
        <Mentor>{tr({ uz: 'Bo\'laklarni sudrab to\'g\'ri tartibga joylang. Diqqat: agar 🚀 ishga tushirishni 🔕 oxirgi qatordan oldin qo\'ysangiz — oqibatini ko\'rasiz.', ru: 'Перетащите блоки в правильном порядке. Внимание: если поставить 🚀 запуск перед 🔕 последней строкой — увидите последствия.' })}</Mentor>
        <DragDropOrder
          items={BOT_LINES}
          hints={[
            { uz: "avval kalit o'qiladi", ru: 'сначала читается ключ' },
            { uz: 'keyin Botjon yaratiladi', ru: 'потом создаётся Ботик' },
            { uz: 'keyin /start javob beradi', ru: 'потом отвечает /start' },
            { uz: 'keyin tugma signalini ushlaydi', ru: 'потом ловится сигнал кнопки' },
            { uz: "keyin oxirgi qator qo'shiladi", ru: 'потом добавляется последняя строка' },
            { uz: 'eng oxiri ishga tushiriladi', ru: 'в самом конце — запуск' }
          ]}
          doneText={{ uz: "To'g'ri: kalit → Botjon → /start → tugma → oxirgi qator → ishga tushirish.", ru: 'Верно: ключ → Ботик → /start → кнопка → последняя строка → запуск.' }}
          onSolved={onSolved}
          onChange={onChange} />
        {consequence === 'launch-early' && !done && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>{tr({ uz: "😕 Botjon ishga tushdi, lekin oxirgi qator hali yo'q!", ru: '😕 Ботик запустился, а последней строки ещё нет!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Notanish xabarlarga Botjon hamon jim qoladi. Tartibni to\'g\'rilang.', ru: 'На незнакомые сообщения Ботик по-прежнему молчит. Исправьте порядок.' })}</p></div>}
        {consequence === 'wrong' && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qaytadan joylang.", ru: 'Порядок неверный — нажмите на блок, чтобы вернуть, и разложите заново.' })}</p></div>}
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "✓ Tayyor bot fayli: kalit → Botjon → 📋 signal → 🔘 tugma → 🔕 oxirgi qator → 🚀 ishga tushirish. Mana shu — to'liq muloqot qiladigan Botjon.", ru: '✓ Готовый файл бота: ключ → Ботик → 📋 сигнал → 🔘 кнопка → 🔕 последняя строка → 🚀 запуск. Вот он — Ботик, который полноценно общается.' })}</p>
          {hadWrongRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: '📖 Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  buttonMaster:  { icon: '🔘', name: 'Button Master',  desc: { uz: "Tugmalar taxtasini to'liq ulab, ishga tushirdingiz", ru: 'Полностью подключили панель кнопок и запустили её' } },
  rightEnvelope: { icon: '✉️', name: 'Right Envelope', desc: { uz: "Konvert manzili xatosini topib to'g'riladingiz", ru: 'Нашли и исправили ошибку в адресе конверта' } },
  neverSilent:   { icon: '🔔', name: 'Never Silent',   desc: { uz: "Oxirgi qator (fallback) qo'shib, Botjonni hech qachon jim qoldirmadingiz", ru: 'Добавили последнюю строку (fallback) — Ботик больше не молчит' } },
  commandWriter: { icon: '📜', name: 'Command Writer', desc: { uz: "Buyruqlar ro'yxatini birorta xato tanlamasdan to'g'ri to'ldirdingiz", ru: 'Заполнили список команд правильно, без единой ошибки' } },
};
// Ekran id → nishon. ❗ FAQAT ma'noli, xato qilish MUMKIN bo'lgan ekranlar.
const ACH_TRIGGERS = { s9: 'buttonMaster', s11: 'rightEnvelope', s12: 'neverSilent', s13: 'commandWriter' };

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

const Q_LABELS = {
  4: { uz: '1 — Kalit', ru: '1 — Ключ' },
  8: { uz: '2 — Tugma turi', ru: '2 — Вид кнопки' },
  10: { uz: '3 — Qator', ru: '3 — Строка' },
  14: { uz: "4 — Chaqiruv so'zi", ru: '4 — Слово-вызов' },
  15: { uz: '5 — Tartib', ru: '5 — Порядок' }
};
const QUIZ_MS = 15000;
const QZ_BG_SHAPES = [
  { ch: '/start',     l: 5,  t: 10, s: 32, d: 19, dl: 0 },
  { ch: '🔑',           l: 85, t: 8,  s: 32, d: 23, dl: 1.5 },
  { ch: 'ctx.reply',   l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'bot.action',  l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: '.env',        l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: 'bot.hears',   l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: '/menu',       l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'Telegraf',    l: 55, t: 5,  s: 26, d: 22, dl: 0.6 },
  { ch: '✉️',           l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '✓',           l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: 'fallback',    l: 34, t: 62, s: 20, d: 29, dl: 3.4 },
  { ch: 'inline',      l: 2,  t: 30, s: 26, d: 28, dl: 3.1 },
  { ch: 'reply',       l: 60, t: 90, s: 20, d: 31, dl: 4.2 },
  { ch: '429',         l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3).
const QUIZ_BANK = [
  { q: { uz: 'Bot kaliti (tokeni) qayerda saqlanishi kerak?', ru: 'Где должен храниться ключ (токен) бота?' }, opts: [
      { uz: "Kodning ichida ochiq, hammaga ko'rinadigan joyda saqlanadi", ru: 'Открыто внутри кода, на виду у всех' },
      { uz: "README faylida, hujjat sifatida yozib qo'yiladi doim", ru: 'В файле README, всегда записывается как документация' },
      { uz: ".env faylda — git'ga tushmaydigan alohida maxfiy joyda", ru: 'В файле .env — в отдельном секретном месте, которое не попадает в git' },
      { uz: "Hech qayerda, har ishga tushirishda qo'lda kiritiladi doim", ru: 'Нигде, при каждом запуске всегда вводится вручную' }
    ], correct: 2 },
  { q: { uz: 'Telegraf nima?', ru: 'Что такое Telegraf?' }, opts: [
      { uz: 'Bot API bilan gaplashishga yordam beruvchi Node.js kutubxonasi', ru: 'Библиотека Node.js, которая помогает говорить с Bot API' },
      { uz: "Foydalanuvchi xabarlarini saqlaydigan alohida ma'lumotlar bazasi", ru: 'Отдельная база данных для хранения сообщений пользователей' },
      { uz: 'Botga rasm va video yuklab beradigan tashqi servis nomi', ru: 'Название внешнего сервиса, который загружает боту фото и видео' },
      { uz: "Telegram ilovasining o'zi, kutubxona bilan aloqasi yo'q narsa", ru: 'Само приложение Telegram, к библиотекам отношения не имеет' }
    ], correct: 0 },
  { q: { uz: '`ctx` (context) nimani anglatadi?', ru: 'Что означает `ctx` (context)?' }, opts: [
      { uz: 'Botning umumiy sozlamalari saqlanadigan alohida konfiguratsiya fayli', ru: 'Отдельный файл конфигурации с общими настройками бота' },
      { uz: 'Foydalanuvchining shaxsiy Telegram parolini doimiy saqlaydigan maxfiy obyekt', ru: 'Секретный объект, постоянно хранящий личный пароль пользователя от Telegram' },
      { uz: "Serverning joriy vaqtini ko'rsatadigan texnik yordamchi funksiya", ru: 'Техническая вспомогательная функция, показывающая текущее время сервера' },
      { uz: 'Har xabar bilan keladigan konvert — kim yozdi va qayerga javob berish', ru: 'Конверт, приходящий с каждым сообщением — кто написал и куда отвечать' }
    ], correct: 3 },
  { q: { uz: 'Inline tugma bosilganda nima yuboriladi?', ru: 'Что отправляется при нажатии inline-кнопки?' }, opts: [
      { uz: "Foydalanuvchi yozgandek oddiy matn xabari chatga qo'shiladi", ru: 'В чат добавляется обычное текстовое сообщение, будто его написал пользователь' },
      { uz: 'Chatga hech narsa yozilmaydi, yashirin signal (callback) ketadi', ru: 'В чат ничего не пишется, уходит скрытый сигнал (callback)' },
      { uz: 'Avtomatik ravishda darhol yangi surat fayli serverga yuklab yuboriladi', ru: 'Автоматически и сразу на сервер загружается новый файл с картинкой' },
      { uz: "Bot darhol o'zini o'zi qayta ishga tushiradi va qayta ochiladi", ru: 'Бот сразу перезапускает сам себя и открывается заново' }
    ], correct: 1 },
  { q: { uz: "Reply tugma bosilganda nima sodir bo'ladi?", ru: 'Что происходит при нажатии reply-кнопки?' }, opts: [
      { uz: 'Hech narsa bo\'lmaydi, tugma faqat bezak sifatida turaveradi', ru: 'Ничего не происходит, кнопка остаётся просто украшением' },
      { uz: "Tugmadagi matn xuddi o'zi yozgandek chatga xabar bo'lib qo'shiladi", ru: 'Текст кнопки добавляется в чат сообщением, будто вы сами его написали' },
      { uz: "Bot darhol suhbatni butunlay to'xtatib, chatni tark etadi", ru: 'Бот сразу полностью прекращает разговор и покидает чат' },
      { uz: 'Foydalanuvchining shaxsiy Telegram akkaunti avtomatik butunlay o\'chirib yuboriladi', ru: 'Личный аккаунт пользователя в Telegram автоматически полностью удаляется' }
    ], correct: 1 },
  { q: { uz: '`bot.action(...)` qaysi signalni ushlaydi?', ru: 'Какой сигнал ловит `bot.action(...)`?' }, opts: [
      { uz: "Faqat /start kabi chaqiruv so'zlarini, boshqasini ushlamaydi", ru: 'Только слова-вызовы вроде /start, больше ничего не ловит' },
      { uz: 'Reply tugmadan kelgan oddiy matn xabarlarini shu yerda doimo ushlaydi', ru: 'Здесь всегда ловятся обычные текстовые сообщения от reply-кнопки' },
      { uz: 'Xabar ustidagi tugma bosilganda kelgan yashirin signalni ushlaydi', ru: 'Скрытый сигнал от нажатия кнопки под сообщением' },
      { uz: 'Faqat rasm va fayllarni qabul qilish uchun ishlatiladi doimo', ru: 'Всегда используется только для приёма картинок и файлов' }
    ], correct: 2 },
  { q: { uz: '`bot.hears(...)` qaysi signalni ushlaydi?', ru: 'Какой сигнал ловит `bot.hears(...)`?' }, opts: [
      { uz: 'Reply tugma yoki foydalanuvchi yozgan oddiy matn xabarini ushlaydi', ru: 'Reply-кнопку или обычное текстовое сообщение, написанное пользователем' },
      { uz: 'Faqat xabar ustidagi tugmadan kelgan yashirin signalni ushlaydi', ru: 'Только скрытый сигнал от кнопки под сообщением' },
      { uz: "Botning doimiy ishga tushish-o'chirish holatini kuzatadigan texnik signalni ushlaydi", ru: 'Технический сигнал, следящий за постоянным включением-выключением бота' },
      { uz: 'Faqat ovozli xabarlarni tinglab, matnga aylantiradigan funksiya', ru: 'Функция, которая слушает только голосовые сообщения и переводит их в текст' }
    ], correct: 0 },
  { q: { uz: 'Fallback (oxirgi qator) nima uchun kerak?', ru: 'Зачем нужен fallback (последняя строка)?' }, opts: [
      { uz: "Botni tezroq ishga tushirish uchun, boshqa foydasi yo'q unda", ru: 'Чтобы бот запускался быстрее, другой пользы от него нет' },
      { uz: 'Faqat rasm yuborilganda xato xabarini chiqarish uchun kerak', ru: 'Нужен только чтобы показать ошибку при отправке картинки' },
      { uz: "Kalitni maxfiy saqlash uchun qo'shimcha himoya qatlami sifatida", ru: 'Как дополнительный слой защиты, чтобы хранить ключ в секрете' },
      { uz: 'Hech qaysi qatorga mos kelmagan xabarga ham javob berish uchun', ru: 'Чтобы ответить даже на сообщение, под которое не подошла ни одна строка' }
    ], correct: 3 },
  { q: { uz: 'Tezlik cheklovi (rate limit) nimani anglatadi?', ru: 'Что означает ограничение скорости (rate limit)?' }, opts: [
      { uz: 'Botning internetga ulanish tezligini sekinlashtiradigan sozlama', ru: 'Настройка, замедляющая скорость подключения бота к интернету' },
      { uz: "Foydalanuvchining telefon tezligini o'lchaydigan ichki funksiya", ru: 'Внутренняя функция, измеряющая скорость телефона пользователя' },
      { uz: 'Bot javobining shrift o\'lchamini avtomatik kichraytiradigan qoida', ru: 'Правило, автоматически уменьшающее размер шрифта в ответе бота' },
      { uz: 'Juda tez-tez signal yuborilsa xizmat oynasi vaqtincha yopiladi', ru: 'Если слать сигналы слишком часто, служебное окно временно закрывается' }
    ], correct: 3 },
  { q: { uz: 'Polling nimani bildiradi?', ru: 'Что означает polling?' }, opts: [
      { uz: "Telegram serveri botga qo'ng'iroq qilib xabar yetkazishi", ru: 'Сервер Telegram сам звонит боту и доставляет сообщение' },
      { uz: "Bot o'zi Telegram'dan yangi xabar bormi deb so'rab turishi", ru: 'Бот сам регулярно спрашивает у Telegram, нет ли новых сообщений' },
      { uz: 'Foydalanuvchi ovozini yozib olib, matnga aylantirish jarayoni', ru: 'Процесс записи голоса пользователя и перевода его в текст' },
      { uz: "Botning barcha xabarlarini butunlay o'chirib tashlash amali", ru: 'Действие, полностью удаляющее все сообщения бота' }
    ], correct: 1 },
  { q: { uz: '`bot.launch()` nima qiladi?', ru: 'Что делает `bot.launch()`?' }, opts: [
      { uz: 'Yangi maxfiy kalit avtomatik yaratadi va eskisini butunlay bekor qilib tashlaydi', ru: 'Автоматически создаёт новый секретный ключ и полностью отменяет старый' },
      { uz: "Botni Telegram'dan butunlay o'chirib, hisobni yopib qo'yadi", ru: 'Полностью удаляет бота из Telegram и закрывает его аккаунт' },
      { uz: 'Botni ishga tushiradi — u signallarni kutib, qatorlarga javob beradi', ru: 'Запускает бота — он ждёт сигналы и отвечает по строкам' },
      { uz: 'Faqat bot rasmini va nomini yangilaydigan texnik buyruq', ru: 'Техническая команда, которая обновляет только аватар и имя бота' }
    ], correct: 2 },
  { q: { uz: "/start va /help kabi chaqiruv so'zlari qanday belgi bilan boshlanadi?", ru: 'С какого знака начинаются слова-вызовы вроде /start и /help?' }, opts: [
      { uz: "Qiyshiq chiziq (/) bilan — Telegram ularni ro'yxatda ko'rsatadi", ru: 'С косой черты (/) — Telegram показывает их в списке' },
      { uz: 'Yulduzcha (*) bilan — bular maxsus admin buyruqlari hisoblanadi', ru: 'Со звёздочки (*) — это считаются особые админские команды' },
      { uz: 'Ikki nuqta (:) bilan — bular faqat kod ichida ishlatiladigan belgi', ru: 'С двоеточия (:) — этот знак используется только внутри кода' },
      { uz: "Hech qanday belgisiz — oddiy so'z sifatida yoziladi va yuboriladi", ru: 'Без всякого знака — пишутся и отправляются как обычное слово' }
    ], correct: 0 },
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
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{tr(hint)}</span>}
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
    const TOK = ['🔑', '✉️', '/start', 'ctx.reply', 'bot.action', '429', 'fallback', 'inline', 'reply'];
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
      if (typeof window !== 'undefined' && !window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закрыть, ученики останутся ждать на арене.\nВсё равно закрыть?' }))) return;
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
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжайте тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме практики' })}</button>
        </div>
      )}

      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Подряд верные ответы дают 🔥 бонус!' })}</p>
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. В следующий раз получится! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Будьте быстрее! ⏱' })}</span>}
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

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: `ball · ${soloScore.ok}/${QUIZ_BANK.length} to'g'ri`, ru: `баллов · ${soloScore.ok}/${QUIZ_BANK.length} верно` })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'самая длинная серия' })} 🔥x${soloScore.maxStreak}` : ''}</p>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест заново — практика (в таблицу не идёт)' })}</button>}
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
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появляется рейтинг всей группы — 🥇🥈🥉 подиум.' })}</p></div>
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

// ===== 🛠️ JONLI PRAKTIKA (reusable) =====
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
function ScreenLivePractice({ title, task, checklist, screen, storedAnswer, onAnswer, onNext, onPrev, live }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const [checked, setChecked] = useState(() => new Set());
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const toggle = (i) => setChecked(prev => { const s = new Set(prev); if (s.has(i)) s.delete(i); else s.add(i); return s; });
  const complete = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(title), solved: true, correct: true, picked: true }); // payload UZ-etalon
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z kompyuteringizda</b> — VS Code'da bajaring. Har bosqichni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — mentor kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>на своём компьютере</b> — в VS Code. Отмечайте каждый шаг по мере выполнения. В конце нажмите <b style={{ color: T.ink }}>«Выполнил»</b> — ментор следит.</> })}</Mentor>
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
              {done ? tr({ uz: '✓ Bajarildi — mentorni kuting', ru: '✓ Выполнено — подождите ментора' }) : tr({ uz: '✅ Bajardim', ru: '✅ Выполнил' })}
            </button>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Zo'r! Vazifani bajardingiz. Mentor tekshirib, keyingi qadamga o'tkazadi.", ru: 'Отлично! Задание выполнено. Ментор проверит и переведёт вас к следующему шагу.' })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
}

const ScreenBotPractice = (props) => (
  <ScreenLivePractice {...props}
    title={{ uz: "O'z Botjoningizga menyu tugmalari qo'shing", ru: 'Добавьте своему Ботику кнопки меню' }}
    task={{ uz: "BotFather'dan olgan (yoki mashq uchun yaratgan) botingizga /menu chaqiruv so'zini va kamida 2 ta xabar ustidagi tugmani qo'shing. Har tugma uchun bot.action qatorini yozing va oxiriga fallback (bot.on('text', ...)) qatorini qo'shing.", ru: "Добавьте своему боту, полученному у BotFather (или созданному для практики), слово-вызов /menu и минимум 2 кнопки под сообщением. Для каждой кнопки напишите строку bot.action, а в конце добавьте строку fallback (bot.on('text', ...))." }}
    checklist={[
      { uz: '`.env` faylga `BOT_TOKEN` (kalitni) yozing', ru: 'Запишите `BOT_TOKEN` (ключ) в файл `.env`' },
      { uz: "`bot.command('menu', ...)` bilan 2 ta xabar ustidagi tugmali menyu chiqaring", ru: "Через `bot.command('menu', ...)` выведите меню с 2 кнопками под сообщением" },
      { uz: 'Har tugma uchun `bot.action(...)` qatorini yozing', ru: 'Для каждой кнопки напишите строку `bot.action(...)`' },
      { uz: "Oxiriga `bot.on('text', ...)` — oxirgi qator (fallback) qo'shing", ru: "В конец добавьте `bot.on('text', ...)` — последнюю строку (fallback)" },
      { uz: "`bot.launch()` bilan Botjonni ishga tushiring va Telegram'da sinab ko'ring", ru: 'Запустите Ботика через `bot.launch()` и попробуйте его в Telegram' },
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{tr({ uz: `${total}/${total} atama yodlandi`, ru: `${total}/${total} терминов выучено` })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda ·", ru: '↻ Учим ·' })} <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim ·', ru: '✓ Знаю ·' })} <b>{known}</b></span></div>
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

// 🃏 FLASHCARD KARTALARI — 12 atama (Botjon muloqoti tili)
const BOT_FLASHCARDS = [
  { front: { uz: "Xizmat oynasi bilan gaplashishni siz o'rniga qaysi Node.js kutubxonasi bajaradi?", ru: 'Какая библиотека Node.js общается со служебным окном вместо вас?' }, back: 'Telegraf', note: { uz: "Siz kalitni berasiz — u o'zi ulanadi", ru: 'Вы даёте ключ — она подключается сама' } },
  { front: { uz: "Botjonning kalitini kodga ochiq yozmasdan qaysi fayldan olasiz?", ru: 'Из какого файла берётся ключ Ботика, чтобы не писать его открыто в коде?' }, back: '.env', note: { uz: "Kodda faqat process.env.BOT_TOKEN turadi, kalit git'ga tushmaydi", ru: 'В коде стоит только process.env.BOT_TOKEN, ключ не попадает в git' } },
  { front: { uz: "Har kelgan xabar bilan birga keladigan konvert kodda qanday yoziladi?", ru: 'Как в коде пишется конверт, который приходит с каждым сообщением?' }, back: 'ctx', note: { uz: "Ichida kim yozgani (ctx.from), matn (ctx.message.text) va javob yo'li bor", ru: 'Внутри — кто написал (ctx.from), текст (ctx.message.text) и путь для ответа' } },
  { front: { uz: "Mijozga javob xabarini qaysi buyruq yuboradi?", ru: 'Какая команда отправляет клиенту ответное сообщение?' }, back: 'ctx.reply(...)', note: { uz: "Bu — 1-darsdan tanish amal", ru: 'Это знакомое по 1-му уроку действие' } },
  { front: { uz: "/start chaqiruv so'zini qaysi qator ushlaydi?", ru: 'Какая строка ловит слово-вызов /start?' }, back: 'bot.start(...)', note: { uz: "Mijoz botni birinchi marta ochganda shu qator ishlaydi", ru: 'Эта строка срабатывает, когда клиент впервые открывает бота' } },
  { front: { uz: "Chaqiruv so'zlari qaysi belgi bilan boshlanadi?", ru: 'С какого знака начинаются слова-вызовы?' }, back: { uz: 'Qiyshiq chiziq (/)', ru: 'Косая черта (/)' }, note: { uz: "Telegram bunday so'zlarni buyruqlar ro'yxatida ko'rsatadi", ru: 'Такие слова Telegram показывает в списке команд' } },
  { front: { uz: "Xabarning ustiga yopishib turadigan tugma qanday ataladi?", ru: 'Как называется кнопка, которая прилипает к сообщению?' }, back: { uz: 'Inline tugma', ru: 'Inline-кнопка' }, note: { uz: "Bosilganda suhbatga hech qanday matn yozilmaydi", ru: 'При нажатии в чат не пишется никакой текст' } },
  { front: { uz: "Klaviatura o'rnida turadigan tugmalar taxtasi qanday ataladi?", ru: 'Как называется панель кнопок, которая стоит на месте клавиатуры?' }, back: { uz: 'Reply tugmalar', ru: 'Reply-кнопки' }, note: { uz: "Bosilsa, matn xuddi o'zingiz yozgandek yuboriladi", ru: 'При нажатии текст уходит так, будто вы написали его сами' } },
  { front: { uz: "Xabar ustidagi tugma bosilganda ketadigan yashirin signal nima deyiladi?", ru: 'Как называется скрытый сигнал при нажатии кнопки под сообщением?' }, back: 'Callback', note: { uz: "Jim signal — suhbatda ko'rinmaydi", ru: 'Тихий сигнал — в чате его не видно' } },
  { front: { uz: "Callback signalini qaysi qator ushlaydi?", ru: 'Какая строка ловит сигнал callback?' }, back: 'bot.action(...)', note: { uz: "Reply tugma matnini esa bot.hears(...) ushlaydi", ru: 'А текст reply-кнопки ловит bot.hears(...)' } },
  { front: { uz: "Hech qaysi qatorga mos kelmagan xabarga kim javob beradi?", ru: 'Кто отвечает на сообщение, под которое не подошла ни одна строка?' }, back: { uz: 'Fallback qatori', ru: 'Строка fallback' }, note: { uz: "U bo'lmasa, Botjon jim qoladi", ru: 'Без неё Ботик промолчит' } },
  { front: { uz: "Botjonni ishga tushiradigan va faylning eng oxirida turadigan buyruq qaysi?", ru: 'Какая команда запускает Ботика и стоит в самом конце файла?' }, back: 'bot.launch()', note: { uz: "Avval hamma qoidalar yoziladi, keyin bot ishga tushadi", ru: 'Сначала пишутся все правила, потом бот запускается' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Muloqot atamalarini <span className="italic" style={{ color: T.accent }}>tez takrorlaymiz</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Быстро повторим</span> термины общения.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Darsni yakunlashdan oldin bugungi atamalarni takrorlaymiz. Har kartada bir savol — <b style={{ color: T.ink }}>javobini</b> o'ylang, keyin kartani bosib tekshiring. <b style={{ color: T.ink }}>Bildim</b> yoki <b style={{ color: T.ink }}>Takrorlash</b> bilan baholang.</>, ru: <>Перед тем как завершить урок, повторим сегодняшние термины. На каждой карточке вопрос — подумайте, <b style={{ color: T.ink }}>каким будет ответ</b>, потом нажмите на карточку и проверьте. Оцените себя кнопкой <b style={{ color: T.ink }}>Знаю</b> или <b style={{ color: T.ink }}>Повторить</b>.</> })}</Mentor>
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
    { uz: 'Botjon @BotFather orqali yaratiladi va 🔑 kalit (token) oladi', ru: 'Ботик создаётся через @BotFather и получает 🔑 ключ (токен)' },
    { uz: "Kalit .env — qulfli tortmada saqlanadi, git'ga tushmaydi", ru: 'Ключ хранится в .env — запертом ящике, и в git не попадает' },
    { uz: 'Har qatorga ✉️ konvert (ctx) keladi — kim yozdi va qayerga javob berish', ru: 'В каждую строку приходит ✉️ конверт (ctx) — кто написал и куда отвечать' },
    { uz: 'Xabar ustidagi tugma (inline) → signal; pastdagi taxta (reply) → matn', ru: 'Кнопка под сообщением (inline) → сигнал; нижняя панель (reply) → текст' },
    { uz: "📋 Qoidalar varag'i signal → amal bog'laydi; oxirgi qator (fallback) hech qachon jim qoldirmaydi", ru: '📋 Лист правил связывает сигнал → действие; последняя строка (fallback) не даёт молчать' }
  ];
  const HOMEWORK = [
    { b: { uz: 'Yarating', ru: 'Создайте' }, t: { uz: "— Telegram'da @BotFather'ga /newbot yuborib, o'z Botjoningizni oching", ru: '— отправьте /newbot в @BotFather в Telegram и откройте своего Ботика' } },
    { b: { uz: 'Saqlang', ru: 'Сохраните' }, t: { uz: '— olgan kalitingizni .env faylga BOT_TOKEN sifatida yozing (hech kimga bermang)', ru: '— запишите полученный ключ в файл .env как BOT_TOKEN (никому не давайте)' } },
    { b: { uz: "Qo'shing", ru: 'Добавьте' }, t: { uz: "— botingizga /menu chaqiruv so'zi, 2 ta tugma va bitta oxirgi qator (fallback) qo'shing", ru: '— своему боту слово-вызов /menu, 2 кнопки и одну последнюю строку (fallback)' } }
  ];
  const GLOSSARY = [
    { b: 'BotFather', t: { uz: '— bot yaratadigan rasmiy Telegram bot', ru: '— официальный бот Telegram, который создаёт ботов' } },
    { b: 'token', t: { uz: "— Botjonning maxfiy kaliti (.env'da)", ru: '— секретный ключ Ботика (в .env)' } },
    { b: 'Telegraf', t: { uz: '— Node.js bot kutubxonasi', ru: '— библиотека Node.js для ботов' } },
    { b: 'ctx', t: { uz: '— context: xabar haqidagi ✉️ konvert', ru: '— context: ✉️ конверт о сообщении' } },
    { b: 'bot.start', t: { uz: "— /start chaqiruv so'zini ushlaydi", ru: '— ловит слово-вызов /start' } },
    { b: 'inline', t: { uz: '— xabar ustidagi tugma (signal)', ru: '— кнопка под сообщением (сигнал)' } },
    { b: 'reply', t: { uz: '— pastdagi tugmalar taxtasi (matn)', ru: '— нижняя панель кнопок (текст)' } },
    { b: 'bot.action', t: { uz: '— xabar ustidagi tugma signalini ushlaydi', ru: '— ловит сигнал кнопки под сообщением' } },
    { b: 'bot.hears', t: { uz: '— matn / reply tugma signalini ushlaydi', ru: '— ловит текст / сигнал reply-кнопки' } },
    { b: 'fallback', t: { uz: '— oxirgi qator, hech qachon jim qolmaslik uchun', ru: '— последняя строка, чтобы никогда не молчать' } },
    { b: 'rate limit', t: { uz: '— tezlik cheklovi (429)', ru: '— ограничение скорости (429)' } },
    { b: 'bot.launch', t: { uz: '— Botjonni ishga tushiradi', ru: '— запускает Ботика' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  const [open, setOpen] = useState(false);
  const glossRef = useRef(null);
  const isNarrow = useIsMobile(768);
  const toggleGloss = () => setOpen(o => { const nv = !o; if (nv && isNarrow) setTimeout(() => { if (glossRef.current) glossRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 80); return nv; });
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Botjoningiz endi muloqot qiladi', ru: 'Ваш Ботик теперь общается' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Botjon endi <span className="italic" style={{ color: T.accent }}>gapiradi</span> va tugmalari bor.</>, ru: <>Теперь Ботик <span className="italic" style={{ color: T.accent }}>говорит</span>, и у него есть кнопки.</> })}</h2><p className="body h-sub fade-up d2">{PASSED ? tr({ uz: 'Tabriklaymiz! Kalit, ✉️ konvert, xabar ustidagi tugma/pastdagi taxta farqini va oxirgi qatorni bilib oldingiz.', ru: 'Поздравляем! Вы разобрались с ключом, ✉️ конвертом, разницей между кнопкой под сообщением и нижней панелью, и с последней строкой.' }) : tr({ uz: "Yaxshi harakat! Konvert manzili va tugma turlari farqini mustahkamlash uchun bir-ikki ekranni qayta ko'ring.", ru: 'Хорошая попытка! Пересмотрите пару экранов, чтобы закрепить адрес конверта и разницу между видами кнопок.' })}</p></div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? { uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' } : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="split">
          <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
          <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '📝 Uyga vazifa', ru: '📝 Домашнее задание' })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: '🚀 Keyingi dars — Stateful logika + PostgreSQL: Botjonga 📓 xotira beramiz, mijoz va suhbat holatini saqlaymiz!', ru: '🚀 Следующий урок — stateful-логика + PostgreSQL: дадим Ботику 📓 память и будем хранить состояние клиента и разговора!' })}</p></div>
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
        <div ref={glossRef} className="gloss fade-up d4" style={{ scrollMarginBottom: 16 }}><div className="gloss-head" onClick={toggleGloss}><span className="lbl">{tr({ uz: "💡 Kalit so'zlar (takrorlash)", ru: '💡 Ключевые слова (повторение)' })}</span><span className="gloss-toggle">{open ? '−' : '+'}</span></div>{open && (<div className="gloss-body">{GLOSSARY.map((g, i) => (<span key={i}><b>{g.b}</b> {tr(g.t)}{i < GLOSSARY.length - 1 ? ' · ' : ''}</span>))}</div>)}</div>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function BotApiButtonsLesson({ lang: langProp, onFinished }) {
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

        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; }

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

        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.dangerSoft}; border-left: 4px solid ${T.danger}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(194,54,43,0.22); }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        .screen { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .note-h { font-weight: 700; font-size: 13.5px; margin: 0 0 5px; display: flex; align-items: center; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === HERO / YAKUN === */
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

        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }
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
        .ach-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
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

        /* ===== ⚡ JONLI QATLAM CSS (Kahoot-kutish · MentorTestStats · CodeStrike arena · qcode-chip) ===== */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; animation: opt-wait-breathe 2s ease-in-out infinite; }
        @keyframes opt-wait-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.012); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

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

        @keyframes tap-hint-pulse { 0% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 0 rgba(255,79,40,0.4); } 70%,100% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 8px rgba(255,79,40,0); } }
        .gchip.tap-hint, .btn-soft.tap-hint, .pick-row.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }

        /* ============ 5-MODUL · BOTJON DARSI CSS ============ */

        /* ===== TELEGRAM CHAT (realistik ko'rinish) ===== */
        .tg { border-radius: 16px; overflow: hidden; box-shadow: 0 12px 30px -8px rgba(${T.shadowBase},0.3); border: 1px solid rgba(167,166,162,0.22); }
        .tg-head { background: linear-gradient(180deg,#5A9FD4,#4E8FC0); padding: 10px 14px; display: flex; align-items: center; gap: 10px; }
        .tg-ava { width: 32px; height: 32px; border-radius: 50%; background: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
        .tg-name { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: #fff; display: flex; flex-direction: column; line-height: 1.25; position: relative; }
        .tg-badge { position: absolute; left: -16px; top: 1px; width: 13px; height: 13px; border-radius: 50%; background: #fff; color: #4E8FC0; font-size: 9px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; }
        .tg-status { font-weight: 500; font-size: 10.5px; color: #DCEBF7; }
        .tg-body { background: #CAD7E0; background-image: radial-gradient(rgba(255,255,255,0.45) 1px, transparent 1px); background-size: 18px 18px; padding: 13px 12px; display: flex; flex-direction: column; gap: 4px; }
        .tg-bubble-wrap { display: flex; flex-direction: column; max-width: 86%; gap: 0; }
        .tg-bubble-wrap.user { align-self: flex-end; align-items: flex-end; }
        .tg-bubble-wrap.bot { align-self: flex-start; align-items: flex-start; }
        .tg-bubble { padding: 8px 12px; border-radius: 14px; font-family: 'Manrope'; font-weight: 500; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; box-shadow: 0 1px 2px rgba(0,0,0,0.12); word-break: break-word; margin-bottom: 3px; }
        .tg-bubble.bot { background: #fff; color: #0E0E10; border-bottom-left-radius: 5px; }
        .tg-bubble.user { background: #EFFDDE; color: #0E0E10; border-bottom-right-radius: 5px; }
        .tg-inline { display: flex; flex-direction: column; gap: 4px; width: 100%; margin-bottom: 2px; }
        .tg-inline-row { display: flex; gap: 4px; }
        .tg-inline-btn { position: relative; flex: 1; text-align: center; background: rgba(255,255,255,0.96); color: #2E78B5; font-family: 'Manrope'; font-weight: 600; font-size: 12px; padding: 9px 8px; border-radius: 9px; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.1); transition: all 0.15s; }
        .tg-inline-btn:hover { background: #fff; transform: translateY(-1px); }
        .tg-inline-btn.fired { animation: tg-inline-ping 0.5s ease-out; }
        .tg-inline-spark { position: absolute; inset: -6px; border-radius: 12px; border: 1.5px solid #2E78B5; opacity: 0; pointer-events: none; animation: tg-inline-spark-ring 0.5s ease-out; }
        @keyframes tg-inline-ping { 0% { box-shadow: 0 1px 2px rgba(0,0,0,0.1); } 40% { box-shadow: 0 0 0 5px rgba(46,120,181,0.28), 0 1px 2px rgba(0,0,0,0.1); } 100% { box-shadow: 0 1px 2px rgba(0,0,0,0.1); } }
        @keyframes tg-inline-spark-ring { 0% { opacity: 0.9; transform: scale(0.85); } 100% { opacity: 0; transform: scale(1.35); } }
        @media (prefers-reduced-motion: reduce) { .tg-inline-btn.fired, .tg-inline-spark { animation: none !important; } }
        .tg-replykb { background: #E4E8EC; padding: 6px; display: flex; flex-direction: column; gap: 5px; border-top: 1px solid rgba(0,0,0,0.07); }
        .tg-replykb-row { display: flex; gap: 5px; }
        .tg-replykb-btn { flex: 1; text-align: center; background: #fff; color: #0E0E10; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 10px 8px; border-radius: 8px; cursor: pointer; box-shadow: 0 1px 1px rgba(0,0,0,0.14); transition: all 0.15s; }
        .tg-replykb-btn:hover { background: #F4F4F2; transform: translateY(-1px); }
        .tg-input { display: flex; align-items: center; gap: 10px; background: #fff; padding: 10px 14px; border-top: 1px solid rgba(0,0,0,0.06); }
        .tg-input-field { flex: 1; color: #A7A6A2; font-family: 'Manrope'; font-size: 13px; }
        .tg-send { color: #5A9FD4; font-size: 17px; }

        /* ===== MIJOZ KARTOCHKASI — ulanmagan signal (jimlik naqshi) ===== */
        .mini-cust { margin-top: 6px; padding: 9px 13px; border-radius: 11px; background: ${T.paper}; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); transition: all 0.4s ease; align-self: flex-start; }
        .mini-cust-msg { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .mini-cust.wait .mini-cust-dots { animation: ns-dots-pulse 3s ease-in-out infinite; display: inline-block; }
        .mini-cust.silent { opacity: 0.45; transform: translateY(6px) grayscale(1); box-shadow: inset 0 0 0 1.5px ${T.ink3}; }
        .mini-cust.silent .mini-cust-msg { color: ${T.danger}; }
        @keyframes ns-dots-pulse { 0%,100% { opacity: 0.35; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .mini-cust, .mini-cust-dots { animation: none !important; transition: none !important; } }

        /* ===== TOKEN (🔑 kalit) ===== */
        .token-bubble { align-self: flex-start; display: flex; align-items: center; gap: 8px; background: ${CODE.bg}; border-radius: 12px; padding: 10px 13px; max-width: 92%; box-shadow: 0 2px 4px rgba(0,0,0,0.18); }
        .token-key { font-size: 16px; }
        .token-val { font-size: clamp(11px,1.4vw,13px); color: ${CODE.str}; letter-spacing: 0.03em; word-break: break-all; }

        /* ===== ARXITEKTURA / STACK OQIMI ===== */
        .archflow { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; padding: 4px 0; }
        .archnode { display: flex; flex-direction: column; align-items: center; gap: 3px; background: ${T.paper}; border-radius: 11px; padding: 10px 10px; min-width: 78px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); transition: all 0.25s; }
        .archnode.on { box-shadow: inset 0 0 0 1.5px ${T.success}, 0 6px 16px -6px rgba(31,122,77,0.26); background: ${T.successSoft}; }
        .archnode-ico { font-size: 19px; line-height: 1; }
        .archnode-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10px; color: ${T.ink}; text-align: center; }
        .archflow-arrow { color: ${T.ink3}; font-weight: 700; font-size: 15px; }

        /* ===== SEGMENT TOGGLE ===== */
        .seg { display: inline-flex; gap: 5px; background: ${T.paper}; padding: 5px; border-radius: 12px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); align-self: flex-start; flex-wrap: wrap; }
        .seg-btn { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.5vw,13.5px); padding: 9px 15px; border-radius: 9px; border: none; background: transparent; color: ${T.ink2}; cursor: pointer; transition: all 0.18s; }
        .seg-btn:hover:not(.on) { background: ${T.bg}; }
        .seg-btn.on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }

        /* ===== ENV-CARD / PICK-ROW (konvert, qoidalar varag'i) ===== */
        .env-card { background: ${T.paper}; border-radius: 14px; padding: 14px 16px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .pick-row { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 10px; padding: 11px 13px; cursor: pointer; transition: all 0.16s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; }
        .pick-row:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.22); }
        .pick-row.code { background: ${CODE.bg}; color: ${CODE.text}; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.26); }
        .pick-row.sel { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.28); background: ${T.accentSoft}; }
        .pick-row.picked { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; cursor: default; }
        .pick-row.code.picked { background: ${T.successSoft}; color: ${T.success}; }
        .pick-row:disabled { cursor: default; }
        .pick-plus { margin-left: auto; font-weight: 700; color: ${T.ink3}; } .pick-row.picked .pick-plus { color: ${T.success}; } .pick-row.sel .pick-plus { color: ${T.accent}; }

        /* ===== YO'L XARITASI bo'shliqlari (s13 builder) ===== */
        .blank-group { display: flex; flex-direction: column; gap: 6px; }
        .blank-group .bg-lbl { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .blank-row { display: flex; flex-wrap: wrap; gap: 7px; }

        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: shake 0.4s ease; }

        /* ===== DRAG & DROP (DragDropOrder — reusable) ===== */
        .dd { display: flex; flex-direction: column; gap: 13px; }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; position: relative; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 58px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; box-shadow: 0 5px 14px -9px rgba(${T.shadowBase},0.2); transition: border-color .18s, background .18s, box-shadow .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; box-shadow: 0 8px 18px -10px rgba(${T.shadowBase},0.26); }
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; animation: dd-ok-pop 0.42s cubic-bezier(.3,1.5,.5,1); }
        .dd-slot.ok:nth-child(2) { animation-delay: 0.07s; } .dd-slot.ok:nth-child(3) { animation-delay: 0.14s; }
        .dd-slot.ok:nth-child(4) { animation-delay: 0.21s; } .dd-slot.ok:nth-child(5) { animation-delay: 0.28s; }
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

        /* 11.15 — jonli badge xira, hover'da tiniq (proyektorda xalaqit bermaydi) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        @media (prefers-reduced-motion: reduce) {
          .dd-chip.in, .dd-slot.ok, .dd-slot.bad, .shake, .gchip.tap-hint, .btn-soft.tap-hint, .pick-row.tap-hint { animation: none !important; }
        }
      `}</style>
      <div className="lesson-root">
        {live.mode === 'choosing' ? (
          <LiveGate live={live} title={{ uz: 'Botjon muloqot qiladi', ru: 'Ботик общается' }} />
        ) : (
          <AchCtx.Provider value={earned}>
          <LiveGateCtx.Provider value={{ locked, live }}>
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} live={live} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
            </>
          </LiveGateCtx.Provider>
          </AchCtx.Provider>
        )}
      </div>
    </LangContext.Provider>
  );
}
