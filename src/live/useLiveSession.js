// Jonli sessiya hook'i — 98 darsdagi inline nusxadan ko'chirildi (2026-09-03), PIN-yo'l mantig'i AYNAN.
// Mentor PIN yaratadi → o'quvchilar PIN bilan qo'shiladi → mentordan OLDINGA o'tolmaydi (orqaga mumkin)
// → «Erkin qilish» bosilganda hammaga erkinlik. Server: dars-api (liveClient.js).
//
// LMS-ko'prik (liveToken): token kelganda server orqali avto-kirish. Rejimlar:
//   mentor · student (jonli) · solo (shaxsiy sessiya, server-ball, oxirgi ekranda tugaydi)
//   review (tugagan urinish — javoblar ko'rinadi, yozilmaydi) · self (kodsiz, o'zi ko'radi) · choosing (darvoza)
// Darslar 'student'/'mentor' bo'lmagan har rejimni 'self' kabi ko'radi — solo/review shu tufayli qo'shimcha kodsiz ishlaydi.
import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { asText, logAttempt, logArena, resetResultDetails, unsealPayload, arenaStart as rdArenaStart, arenaDone as rdArenaDone, arenaPlace as rdArenaPlace, podiumExpected } from './resultDetails.js';
import { arenaPlaceOf, finishHold } from './podium.js';
import { tr, getLiveLang } from './i18n.js';
import { setCheckReporter } from './checkReport.js';
import {
  LIVE_ENABLED, LIVE_POLL_MS, LIVE_POLL_MAX_MS, LIVE_HEARTBEAT_MS, LIVE_STALE_MS, LMS_SOLO_RECHECK_MS,
  liveRpc, liveGet, liveRead, liveStore, liveClear, nickStore, livePlayers, liveQuizAnswers,
  lmsJoin, lmsRestart, peekTokenRole,
} from './liveClient.js';
import { setProgressChannel } from './progressSync.js';
import { BUILD_LESSON_VERSION } from './lessonVersion.js';
import { setDarsApi } from './resultSchema.js';
import { uzEtalon } from './uzEtalon.js';
import { PRACTICE_CHECKED } from './practiceMeta.js';
import { notePreviewProps } from './previewMode.js';

// Ekranlar shu kontekst orqali «qulf»ni va live obyektini oladi: { locked, live }
export const LiveGateCtx = createContext(null);
export const useLiveLock = () => { const c = useContext(LiveGateCtx); return !!(c && c.locked); };

const STORED_MODES = ['self', 'student', 'mentor', 'solo', 'review'];

// F-1112-01: dars tili serverga (urinish tili → analitikada lms_question_id: uz/ru LMS qatori). Eski server (0018 gacha)
// `lang` maydonini bilmaydi va 400 validation_failed qaytaradi — shunda o'sha so'rov langsiz qayta yuboriladi; qayta urinish
// o'tsa (sabab aynan `lang`) bu sahifada `lang` boshqa yuborilmaydi. Boshqa xatolar o'zgarishsiz qaytariladi.
let langRejected = false;
async function withLangRetry(send) {
  if (langRejected) return send(null);
  try { return await send(getLiveLang()); }
  catch (e) {
    if (!(e && e.status === 400 && e.code === 'validation_failed')) throw e;
    const res = await send(null);
    langRejected = true;
    return res;
  }
}

/**
 * @param {string} lessonId
 * @param {Record<string, number>|null} answerKey
 * @param {{ liveToken?: string|null, lessonVersion?: string|null, screenMeta?: Array<{ id?: string }>, arena?: { total: number, quizMs: number, baseIdx: number } }} [opts]
 *   screenMeta — darsning SCREEN_META (F-1112-01: ekranning doimiy id'si screen_open va tekshiruv urinishlarida)
 *   arena — darsning QUIZ_BANK.length, QUIZ_MS, QUIZ_BASE_IDX (CodeStrike podium o'rnini hisoblash uchun)
 */
export function useLiveSession(lessonId, answerKey, opts = {}) {
  // F-1015: preview (Bilimlar bazasi) — doim ustun: token e'tiborsiz, eski liveSession tiklanmaydi, rejim 'self'.
  // 'self' qoldiriladi (yangi rejim nomi emas): 20 dars `live.mode === 'self'` ni alohida tekshiradi.
  const previewRef = useRef(null);
  if (previewRef.current === null) previewRef.current = notePreviewProps(opts);
  const preview = previewRef.current;
  const liveToken = preview ? null : (opts.liveToken || null);
  const lessonVersion = opts.lessonVersion || BUILD_LESSON_VERSION; // L1: yig'ma versiyasi (build-lms define) — join/restart/progress'ga
  // F-1112-01 (Shahzoda §2): ekranning DOIMIY id'si (SCREEN_META[i].id) — screen_open va tekshiruv urinishlari shu id bilan
  // yoziladi (ekran raqami versiyada siljiydi, id — yo'q). Dars bermasa — eski `s<raqam>` shakli.
  const screenMetaRef = useRef(null); screenMetaRef.current = Array.isArray(opts.screenMeta) ? opts.screenMeta : null;
  const screenIdOf = (idx) => {
    const m = screenMetaRef.current && screenMetaRef.current[idx];
    return (m && typeof m.id === 'string' && m.id ? m.id : `s${idx}`).slice(0, 64);
  };
  const keyRef = useRef(answerKey); keyRef.current = answerKey; // javob kaliti — mentor darsni ochganda serverga avto-yuklanadi (SQL shart emas)
  useEffect(() => { unsealPayload(lessonId); }, [lessonId]); // F-0918-07: dars har ochilganda onFinished muhri toza — eski sessiya yuki yangi urinishga o'tmaydi
  const initRef = useRef(undefined);
  if (initRef.current === undefined) initRef.current = LIVE_ENABLED && !preview ? liveRead(lessonId) : null;
  const init = initRef.current;
  const [mode, setMode] = useState(() => {
    if (!LIVE_ENABLED || preview) return 'self';
    if (init && STORED_MODES.includes(init.mode)) return init.mode;
    return 'choosing';
  });
  const [pin, setPin] = useState(init?.pin || null);
  const tokenRef = useRef(init?.token || null);
  const playerRef = useRef(init?.playerId ? { id: init.playerId, token: init.playerToken } : null);
  const sessionRef = useRef(init?.sessionId || null); // LMS jonli sessiya id'si — CodeStrike podium `game_id` (28.10)
  const nickRef = useRef(init?.nickname || '');
  const [mentorScreen, setMentorScreen] = useState(init?.lastScreen || 0);
  const mentorScreenRef = useRef(0); mentorScreenRef.current = mentorScreen; // L6: screen_open by_student taxmini
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
  const [quiz, setQuiz] = useState({ state: 'off', q: -1 }); // Mustahkamlash-jang holati (serverdan)
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
        if (row.updated_at !== lastUpdatedRef.current) { lastUpdatedRef.current = row.updated_at; lastSeenRef.current = Date.now(); liveStore(lessonId, { mode: 'student', pin, lastScreen: mScr, maxScreen: mMax, playerId: playerRef.current?.id, playerToken: playerRef.current?.token, nickname: nickRef.current, sessionId: sessionRef.current }); }
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
      syncQuiz(row); // mentor sahifani yangilagan bo'lsa — jang holati tiklanadi
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
      // Javob kalitini serverga avto-yuklash (mentor-kod bilan) — bu dars uchun endi kalit SQL SHART EMAS
      if (keyRef.current) liveRpc('set_quiz_keys', { p_lesson_id: lessonId, p_mentor_code: (mentorCode || '').trim(), p_keys: keyRef.current }).catch(() => {});
    } catch (e) {
      // 🔴 F-0912-07: UCH SABAB — UCH XABAR. Ilgari hammasi bitta qatorga yig'ilgandi
      // («kod noto'g'ri YOKI ulanishda xato»), va server yetib bo'lmaganda mentor kodni
      // qidirib vaqt yo'qotardi. O'quvchi yo'li (joinStudent) allaqachon shunday ajratadi.
      // Status YO'Q = fetch otildi (tarmoq uzuq, CORS, server o'chiq) — bunda mentorga
      // zaxira-yo'l aytiladi: jonli rejimsiz ham dars o'tish mumkin (3-daraja).
      const st = e && e.status;
      setJoinError(
        (st === 401 || st === 403)
          ? tr({ uz: "Mentor kodi noto'g'ri.", ru: 'Неверный код ментора.' })
          : st
            ? tr({ uz: `Server javob bermadi (xato ${st}). Birozdan keyin urinib ko'ring.`, ru: `Сервер не ответил (ошибка ${st}). Попробуйте чуть позже.` })
            : tr({
                uz: "Serverga ulanib bo'lmadi. Internetni tekshiring — yoki «← Orqaga» bosib, «O'zim mustaqil ko'raman» bilan darsni jonli rejimsiz o'tkazing.",
                ru: 'Не удалось подключиться к серверу. Проверьте интернет — или нажмите «← Назад» и выберите «Смотрю самостоятельно», чтобы провести урок без живого режима.',
              })
      );
    }
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
      if (row.lesson_id && row.lesson_id !== lessonId) { setJoinError(tr({ uz: 'Bu kod boshqa darsga tegishli.', ru: 'Этот код относится к другому уроку.' })); setBusy(false); return; }
      if (row.status !== 'live') { setJoinError(tr({ uz: 'Bu dars allaqachon yakunlangan.', ru: 'Этот урок уже завершён.' })); setBusy(false); return; }
      const res = await liveRpc('join_session', { p_pin: p, p_nickname: nick });
      const player = Array.isArray(res) ? res[0] : res;
      if (!player?.player_id) throw new Error('no player');
      playerRef.current = { id: player.player_id, token: player.token }; sessionRef.current = null;
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
  // L6 (S10): o'quvchi ekrani almashganda serverga `screen_open` (faqat LMS urinishi bor student/solo; PIN-o'yinchi va self — yo'q).
  // Har almashishda bitta so'rov (server bir xil ekranni takrorlamaydi). by_student — taxmin: jonli darsda mentor hozir ochgan
  // ekranga tushish «mentor o'tkazdi» (false), boshqasi — o'quvchi o'zi. Server bu RPC ni bilmasa (eski server) — 404 dan keyin to'xtaydi.
  const screenOpenRef = useRef({ off: false, last: null });
  const curScreenRef = useRef(null); // F-1112-01: o'quvchining joriy ekrani — reportCheck urinishni shu ekranga yozadi
  const reportScreen = useCallback((idx) => {
    if (Number.isInteger(idx) && idx >= 0) curScreenRef.current = idx;
    if (mode === 'mentor' && pin) { liveRpc('advance_session', { p_pin: pin, p_token: tokenRef.current, p_screen: idx }).catch(() => {}); return; }
    const so = screenOpenRef.current;
    if ((mode !== 'student' && mode !== 'solo') || !pin || !playerRef.current || so.off || !lmsTokenRef.current || !Number.isInteger(idx) || idx < 0 || so.last === `${pin}:${idx}`) return;
    so.last = `${pin}:${idx}`;
    const byStudent = !(mode === 'student' && idx === mentorScreenRef.current);
    liveRpc('screen_open', { p_pin: pin, p_player_id: playerRef.current.id, p_token: playerRef.current.token, p_screen: idx, p_screen_id: screenIdOf(idx), p_by_student: byStudent, p_client_ts: Date.now() })
      .catch((e) => { if (e && (e.status === 404 || e.status === 400)) so.off = true; });
  }, [mode, pin]);
  const endSession = useCallback(() => { if (mode === 'mentor' && pin) { liveRpc('end_session', { p_pin: pin, p_token: tokenRef.current }).catch(() => {}); setEnded(true); } }, [mode, pin]);

  // O'quvchi javobini serverga yozish — birinchi javob qotadi (server unique). Jonli VA solo rejimda.
  // Tarmoq uzilsa 3 martagacha qayta uriniladi (javob yo'qolmasin).
  const practiceOffRef = useRef(false); // L3: eski server record_practice'ni bilmasa — to'xtaydi
  const checkedScreensRef = useRef(new Set()); // F-1112-01: reportCheck urinish yozgan ekranlar — submitAnswer ularga ortiqcha amaliyot yozuvi qo'shmaydi
  const submitAnswer = useCallback((screenIdx, questionId, picked, correct, elapsedMs) => {
    // Arena (quiz-N) javobi — onFinished detallariga (2026-09-10). F-1023-01: jonli VA solo (uyda, mentorsiz) — birinchi o'yin hisob;
    // solo'da serverga YOZILMAYDI (yolg'iz o'quvchi arena_top_1 nishoni/tanga olib qolmasin), faqat natija-JSON (`codestrike`).
    const isArena = /^quiz-\d+$/.test(String(questionId || ''));
    if (isArena && mode === 'student') { logArena(lessonId, questionId, { picked, correct, elapsedMs, mode }); setArenaRev((n) => n + 1); } // F-1029-01: CodeStrike faqat ustozga ulangan jonli darsda hisob — solo'da yozilmaydi (played:false → Learn)
    if (isArena && mode === 'solo') return;
    if ((mode !== 'student' && mode !== 'solo') || !pin || !playerRef.current) return;
    const body = {
      p_pin: pin, p_player_id: playerRef.current.id, p_token: playerRef.current.token,
      p_screen: screenIdx, p_question_id: questionId || '', p_picked: picked,
      p_correct: !!correct, p_elapsed_ms: Math.max(0, Math.round(elapsedMs || 0))
    };
    const attempt = (n) => { liveRpc('submit_answer', body).catch(() => { if (n < 3) setTimeout(() => attempt(n + 1), 3000 * (n + 1)); }); };
    attempt(0);
    // L3 (F-1109-01 B, 25 §5 practice): amaliyot ekrani — ball bilan birga `record_practice` (faqat LMS urinishi; bizning baza).
    //   practice-N (LMS kompilyator praktikasi tugadi) va INLINE_KEYS -1 («Bajardim») → checked=false, correct=null;
    //   practiceMeta.js dagi kalitli yakuniy ekran → checked=true, correct. Matn (≤300) markaziy olinmaydi — dars bermaydi.
    if (!lmsTokenRef.current || practiceOffRef.current || isArena) return;
    if (checkedScreensRef.current.has(`${pin}:${playerRef.current.id}:${screenIdx}`)) return; // F-1112-01: bu urinishda ekranning har tekshiruvi allaqachon yozilgan (reportCheck)
    const qid = String(questionId || '');
    const pm = /^practice-(\d+)$/.exec(qid);
    const key = keyRef.current && Object.prototype.hasOwnProperty.call(keyRef.current, qid) ? keyRef.current[qid] : undefined;
    const kind = pm ? 'done' : key === -1 ? 'done' : (PRACTICE_CHECKED[lessonId] || []).includes(qid) ? 'checked' : null;
    if (!kind) return;
    const scr = pm ? Number(pm[1]) : screenIdx;
    if (!Number.isInteger(scr) || scr < 0 || scr > 9999) return;
    liveRpc('record_practice', { p_pin: pin, p_player_id: playerRef.current.id, p_token: playerRef.current.token, p_screen: scr, p_screen_id: qid.slice(0, 64),
      p_checked: kind === 'checked', p_correct: kind === 'checked' ? !!correct : null })
      .catch((e) => { if (e && (e.status === 404 || e.status === 400)) practiceOffRef.current = true; });
  }, [mode, pin, lessonId]);

  // F-1112-01 (Shahzoda §3б/§3в): dars ichidagi tekshiriladigan topshiriq — HAR tekshirish alohida urinish (server 50 tagacha),
  // to'g'ri/noto'g'ri va o'quvchi matni (≤300, faqat bizning bazada; konnektorga faqat ≥5 o'quvchidagi bir xil xato chiqadi).
  // Umumiy komponentlar checkReport.reportCheck orqali chaqiradi (bu hook uni ro'yxatdan o'tkazadi). Faqat LMS urinishi (student/solo).
  const reportCheck = useCallback(({ correct, text = null, id = null, sub = null } = {}) => {
    const scr = curScreenRef.current;
    if ((mode !== 'student' && mode !== 'solo') || !pin || !playerRef.current || !lmsTokenRef.current || practiceOffRef.current) return;
    if (!Number.isInteger(scr) || scr < 0 || scr > 9999 || typeof correct !== 'boolean') return;
    checkedScreensRef.current.add(`${pin}:${playerRef.current.id}:${scr}`); // urinish (sessiya + o'yinchi) bo'yicha — qayta boshlash yangi kalit
    liveRpc('record_practice', { p_pin: pin, p_player_id: playerRef.current.id, p_token: playerRef.current.token, p_screen: scr,
      p_screen_id: (id || (sub ? `${screenIdOf(scr)}:${sub}` : screenIdOf(scr))).slice(0, 64), p_checked: true, p_correct: correct, p_text: typeof text === 'string' && text ? text.slice(0, 300) : null })
      .catch((e) => { if (e && (e.status === 404 || e.status === 400)) practiceOffRef.current = true; });
  }, [mode, pin]);
  useEffect(() => setCheckReporter(reportCheck), [reportCheck]);

  // BUG-01 v2: arena o'yini chegarasi (dars QuizArena'si chaqiradi). Faqat natija yoziladigan rejimlarda (student / solo).
  // L6/S10 (25 §2): arena savoli o'quvchi EKRANIDA ko'rsatildi — dars har yangi savolda arenaStart'ni chaqiradi (172 dars, BUG-01 v2).
  // Jonli LMS o'quvchisi uchun serverga `arena_shown` (birinchisi qotadi — Learn avtomatik hisobi shu lahzadan). Solo — yo'q (arena
  // natijasi solo'da serverga ketmaydi). Eski server (RPC yo'q) — 404/400 dan keyin to'xtaydi.
  const quizRef = useRef(quiz); quizRef.current = quiz;
  const arenaShownRef = useRef({ off: false, pin: null });
  const arenaStart = useCallback((run) => {
    if (mode === 'student' || mode === 'solo') rdArenaStart(lessonId, { run, mode, pin });
    const as = arenaShownRef.current;
    if (mode !== 'student' || !pin || !playerRef.current || !lmsTokenRef.current || as.off || as.pin === pin) return;
    as.pin = pin;
    const player = playerRef.current;
    // savol raqami: hook holati (bo'lsa) yoki sessiya qatori — dars o'z so'rovida ko'rgan savol (bitta qo'shimcha so'rov, sessiyada bir marta)
    const qNow = quizRef.current;
    (qNow && qNow.state === 'q' && qNow.q >= 0 ? Promise.resolve(qNow.q) : liveGet(pin).then((row) => (row && row.quiz_state === 'q' ? row.quiz_q : -1)))
      .then((qq) => {
        if (!(qq >= 0)) { as.pin = null; return null; } // savol hali yo'q — keyingi arenaStart'da yana
        return liveRpc('arena_shown', { p_pin: pin, p_player_id: player.id, p_token: player.token, p_question_id: `quiz-${qq}`, p_order: qq + 1 });
      })
      .catch((e) => { as.pin = null; if (e && (e.status === 404 || e.status === 400)) as.off = true; });
  }, [mode, pin, lessonId]);
  const arenaDone = useCallback(() => { if (mode === 'student' || mode === 'solo') rdArenaDone(lessonId); }, [mode, lessonId]);
  // ── CodeStrike podium (Abdulloh QA 28.10, PODIUM-02/03) ──────────────────────────────────────────────────────────────
  // Yakuniy o'rin faqat mentor testni yakunlagach (quiz_state 'done'), serverdan SHUNDAN KEYIN yuklangan jadvaldan hisoblanadi —
  // oraliq jadval yakuniy deb yozilmaydi. Yuklash xato bo'lsa o'rin yozilmaydi, qayta uriniladi. Arena oynasi yopiq bo'lsa ham ishlaydi.
  // Faqat LMS orqali kirgan jonli o'quvchi (game_id = sessiya id'si), birinchi o'yini jonli va kamida bitta javob bergan bo'lsa.
  // podiumWait — o'rin kutilmoqda: «Tamom» (holdFinish) yukni ushlab turadi, o'rin yozilishi bilan o'zi yuboradi.
  // Kutish tugaydi: o'rin yozildi · arena yakunlanmay sinf yopildi yoki mentor uzildi (podium yo'q — dars podiumsiz yakunlanadi).
  const arenaOptsRef = useRef(null); arenaOptsRef.current = opts.arena || null;
  const [arenaRev, setArenaRev] = useState(0); // jonli arena javobi yozildi — podium kutilishi qayta ko'riladi
  const [podiumWait, setPodiumWait] = useState(false);
  const podiumWaitRef = useRef(false); podiumWaitRef.current = podiumWait;
  const quizState = quiz.state;
  useEffect(() => {
    const expected = mode === 'student' && !!sessionRef.current && !!arenaOptsRef.current && podiumExpected(lessonId, pin);
    if (!expected) { setPodiumWait(false); return; }
    if (quizState !== 'done') { setPodiumWait(status !== 'ended' && mentorAlive); return; }
    setPodiumWait(true);
    let on = true, t = null, delay = 1500;
    const run = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(pin), liveQuizAnswers(pin)]);
        if (!on) return;
        const place = arenaPlaceOf(players, rows, playerRef.current?.id, arenaOptsRef.current);
        if (place >= 1) { rdArenaPlace(lessonId, { gameId: sessionRef.current, pin, place }); setPodiumWait(false); return; }
      } catch { if (!on) return; } // tarmoq xatosi — eski jadval yozilmaydi, qayta uriniladi
      delay = Math.min(delay * 2, 15000);
      t = setTimeout(run, delay);
    };
    run();
    return () => { on = false; clearTimeout(t); };
  }, [mode, pin, lessonId, quizState, status, mentorAlive, arenaRev]);
  // «Tamom» ushlagichi: dars finishLesson boshida holdFinish(finishLesson) chaqiradi; true — yuk hozir yuborilmaydi.
  const heldFinishRef = useRef(null);
  const skipPodiumRef = useRef(false);
  const [finishHeld, setFinishHeld] = useState(false);
  const holdFinish = useCallback((fn) => {
    if (skipPodiumRef.current || !podiumWaitRef.current || typeof fn !== 'function') return false;
    heldFinishRef.current = fn; finishHold.set(true); setFinishHeld(true); return true;
  }, []);
  const releaseFinish = useCallback(() => { const fn = heldFinishRef.current; heldFinishRef.current = null; setFinishHeld(false); if (fn) fn(); finishHold.set(false); }, []);
  useEffect(() => { if (finishHeld && !podiumWait) releaseFinish(); }, [finishHeld, podiumWait, releaseFinish]);
  // Zaxira chiqish (o'quvchi o'zi tanlaydi, kutish uzoq cho'zilsa): podiumsiz yakunlash — bonus yo'q, natija saqlanadi.
  const finishWithoutPodium = useCallback(() => { skipPodiumRef.current = true; releaseFinish(); }, [releaseFinish]);

  // Har urinish TARIXGA (LMS analitika, 0005): ball emas, yozuv. Jonli va solo rejimda. Birinchi urinishda server
  // ball-qatorini ham qo'yadi — shuning uchun solo'da submitAnswer chaqirilmasa ham natija to'g'ri chiqadi.
  // texts — savol/variant matni (faqat ko'rsatish uchun), 300 belgigacha qirqiladi.
  const recordAttempt = useCallback((screenIdx, questionId, picked, elapsedMs, texts) => {
    logAttempt(lessonId, screenIdx, { picked, texts, elapsedMs }); // onFinished detallari uchun — har rejimda (self ham)
    if ((mode !== 'student' && mode !== 'solo') || !pin || !playerRef.current) return;
    texts = uzEtalon(lessonId, questionId, texts, picked); // F-1109-07: serverga yozuv doim UZ-etalon (RU da lang:'ru' qoladi)
    const lang = texts && texts.lang === 'ru' ? 'ru' : 'uz';
    const cut = (v) => { const x = asText(v, lang); return typeof x === 'string' ? x.slice(0, 300) : undefined; }; // L4: {uz,ru} → matn
    const t = texts && typeof texts === 'object' ? {
      question: cut(texts.question),
      options: Array.isArray(texts.options) ? texts.options.slice(0, 6).map((o) => cut(o) ?? '') : undefined,
      picked: cut(texts.picked), correct: cut(texts.correct),
      lang: texts.lang === 'ru' ? 'ru' : 'uz',
    } : undefined;
    if (t) for (const k of Object.keys(t)) if (t[k] === undefined) delete t[k];
    const body = {
      p_pin: pin, p_player_id: playerRef.current.id, p_token: playerRef.current.token,
      p_screen: screenIdx, p_question_id: questionId || '', p_picked: picked,
      p_elapsed_ms: Math.max(0, Math.round(elapsedMs || 0)), ...(t ? { p_texts: t } : {}),
    };
    const attempt = (n) => { liveRpc('record_attempt', body).catch(() => { if (n < 3) setTimeout(() => attempt(n + 1), 3000 * (n + 1)); }); };
    attempt(0);
  }, [mode, pin]);

  // Mustahkamlash-jang boshqaruvi (faqat mentor): 'lobby' | 'q' | 'r' | 'done'
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

  // ============================================================ LMS-KO'PRIK (liveToken)
  // Token kelganda server haqiqati ustun: LMS aytgan holatga o'tamiz (localStorage'dagi eski holat emas).
  // lms.state: idle | joining | choose | joined | none | error
  const [lms, setLms] = useState({ state: 'idle', choices: null, message: '' });
  const [attempt, setAttempt] = useState(null);            // { id, kind, status, reached_end, … }
  const [serverProgress, setServerProgress] = useState(null); // { …progress, seq } — useServerProgress qo'llaydi
  const lmsTokenRef = useRef(null);

  const openChannel = useCallback((tok, att) => {
    if (!att || att.status !== 'active') { setProgressChannel(lessonId, null); return; }
    setProgressChannel(lessonId, {
      token: tok, attemptId: att.id, status: 'active', lessonVersion,
      onFinished: (info) => setAttempt((a) => (a && a.id === att.id ? { ...a, status: 'finished', finish_reason: info?.reason || 'completed' } : a)),
    });
  }, [lessonId, lessonVersion]);

  const applyServerSession = useCallback((p, tok) => {
    if (!p || typeof p !== 'object') return false;
    // L2 (25 §8): brauzer yuki bog'lanishi — urinish, sessiya kaliti (server bilan bir xil), urinish versiyasi
    const att = p.attempt && p.attempt.id ? p.attempt : null;
    setDarsApi(lessonId, att && p.mode !== 'mentor' ? { attempt_id: att.id, session_key: p.session_key ?? null, lesson_version: att.lesson_version ?? lessonVersion ?? null, v2: p.result_schema === 2 } : null,
      { auto: !!att && att.status === 'active' && (p.mode === 'student' || p.mode === 'solo') });
    const prog = p.progress ? { ...p.progress, seq: Date.now() + Math.random() } : null;
    if (p.mode === 'mentor' && p.pin && p.token) {
      tokenRef.current = p.token; setPin(p.pin); setEnded(false); setJoinError(''); setMode('mentor');
      liveStore(lessonId, { mode: 'mentor', pin: p.pin, token: p.token });
      setAttempt(null); setProgressChannel(lessonId, null);
      return true;
    }
    if (p.mode === 'student' && p.pin && p.playerId && p.playerToken) {
      playerRef.current = { id: p.playerId, token: p.playerToken }; sessionRef.current = typeof p.session_id === 'string' ? p.session_id : null;
      nickRef.current = p.nickname || ''; if (p.nickname) nickStore(p.nickname);
      lastUpdatedRef.current = null; lastSeenRef.current = Date.now();
      const scr = p.lastScreen || 0, mx = Math.max(p.maxScreen || 0, scr);
      setPin(p.pin); setMentorScreen(scr); setMentorMax(mx); setStatus('live'); setJoinError(''); setMode('student');
      liveStore(lessonId, { mode: 'student', pin: p.pin, lastScreen: scr, maxScreen: mx, playerId: p.playerId, playerToken: p.playerToken, nickname: p.nickname, attemptId: p.attempt?.id, sessionId: sessionRef.current });
      setAttempt(p.attempt || null); if (prog) setServerProgress(prog); openChannel(tok, p.attempt);
      return true;
    }
    if (p.mode === 'solo' && p.pin && p.playerId && p.playerToken) {
      playerRef.current = { id: p.playerId, token: p.playerToken }; sessionRef.current = null;
      nickRef.current = p.nickname || ''; if (p.nickname) nickStore(p.nickname);
      setPin(p.pin); setStatus('live'); setJoinError(''); setMode('solo');
      liveStore(lessonId, { mode: 'solo', pin: p.pin, playerId: p.playerId, playerToken: p.playerToken, nickname: p.nickname, attemptId: p.attempt?.id });
      setAttempt(p.attempt || null); if (prog) setServerProgress(prog); openChannel(tok, p.attempt);
      return true;
    }
    if (p.mode === 'review') {
      setJoinError(''); setMode('review');
      liveStore(lessonId, { mode: 'review', attemptId: p.attempt?.id });
      setAttempt(p.attempt || null); if (prog) setServerProgress(prog); setProgressChannel(lessonId, null);
      return true;
    }
    return false;
  }, [lessonId, lessonVersion, openChannel]);

  // sessionId — «tanlov» ekranidan (o'quvchi 2+ guruhda va ikkalasida jonli dars bo'lsa)
  const joinWithToken = useCallback(async (sessionId) => {
    const tok = lmsTokenRef.current;
    if (!tok) return;
    setLms((s) => ({ ...s, state: 'joining', message: '' }));
    try {
      const body = { lesson_id: lessonId };
      if (lessonVersion) body.lesson_version = lessonVersion;
      if (sessionId) body.session_id = sessionId;
      if (keyRef.current && peekTokenRole(tok) === 'mentor') body.answer_key = keyRef.current; // kalitni faqat mentor yuboradi
      const res = await withLangRetry((lang) => lmsJoin(tok, lang ? { ...body, lang } : body)); // F-1112-01: dars tili
      if (res && Array.isArray(res.choose)) { setLms({ state: 'choose', choices: res.choose, message: '' }); return; }
      if (applyServerSession(res, tok)) { setLms({ state: 'joined', choices: null, message: '' }); return; }
      setLms({ state: 'error', choices: null, message: '' });
    } catch (e) {
      const code = (e && e.code) || '';
      setLms({ state: code === 'no_active_session' ? 'none' : 'error', choices: null, message: String((e && e.message) || '') });
    }
  }, [lessonId, lessonVersion, applyServerSession]);

  // Ko'rishdan / tugagan solo'dan — yangi urinish (server yangi solo sessiya ochadi, progress toza)
  const restartAttempt = useCallback(async () => {
    resetResultDetails(lessonId, { keepArena: true }); // urinishlar tarixi va yutuq-vaqtlari yangi urinish uchun tozalanadi; CodeStrike birinchi o'yini qoladi (BUG-01)
    const tok = lmsTokenRef.current;
    if (!tok) return false;
    setBusy(true);
    try {
      const res = await withLangRetry((lang) => lmsRestart(tok, lessonId, lessonVersion, lang)); // F-1112-01: dars tili
      return applyServerSession(res, tok);
    } catch (e) {
      setJoinError(String((e && e.message) || tr({ uz: "Qaytadan boshlab bo'lmadi.", ru: 'Не удалось начать заново.' })));
      return false;
    } finally { setBusy(false); }
  }, [lessonId, lessonVersion, applyServerSession]);

  useEffect(() => {
    if (!LIVE_ENABLED || !liveToken || lmsTokenRef.current === liveToken) return;
    lmsTokenRef.current = liveToken;
    joinWithToken();
  }, [liveToken, joinWithToken]);

  // F-0910-01: o'quvchi mentordan OLDIN kirgan bo'lsa server unga solo beradi. Mentor keyin dars ochsa, server faol solo'ni
  // yopib o'quvchini jonli sessiyaga kiritadi (join-service 1-qadam) — buni klient har LMS_SOLO_RECHECK_MS da JIMGINA so'raydi:
  // lms.state tegilmaydi (darvoza-karta chiqmaydi), javob solo bo'lsa hech narsa o'zgarmaydi. Fon-tabda so'ramaydi,
  // tab qaytganda darhol so'raydi. `choose` javobi (o'quvchi ikki guruhda, ikkalasida jonli dars) e'tiborsiz — solo davom.
  const [liveJoinedNote, setLiveJoinedNote] = useState(false); // «Mentor darsni boshladi» belgisi (LiveBadge, 8 s)
  const attemptId = attempt?.id || null, attemptStatus = attempt?.status || null;
  useEffect(() => {
    if (mode !== 'solo' || lms.state !== 'joined' || !attemptId || attemptStatus !== 'active') return;
    const tok = lmsTokenRef.current;
    if (!tok || peekTokenRole(tok) !== 'student') return;
    let on = true, inFlight = false;
    const recheck = async () => {
      if (!on || inFlight || (typeof document !== 'undefined' && document.hidden)) return;
      inFlight = true;
      try {
        const body = { lesson_id: lessonId };
        if (lessonVersion) body.lesson_version = lessonVersion;
        const res = await withLangRetry((lang) => lmsJoin(tok, lang ? { ...body, lang } : body)); // F-1112-01: dars tili
        if (!on || !res || res.mode !== 'student') return;
        resetResultDetails(lessonId, { keepArena: true }); // solo urinishning tarixi jonli urinishga aralashmasin; CodeStrike birinchi o'yini qoladi (BUG-01 v2)
        if (applyServerSession(res, tok)) setLiveJoinedNote(true);
      } catch { /* tarmoq/server xatosi — solo davom etadi, keyingi so'rovda yana */ }
      finally { inFlight = false; }
    };
    const id = setInterval(recheck, LMS_SOLO_RECHECK_MS);
    const onVis = () => { if (typeof document !== 'undefined' && !document.hidden) recheck(); };
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVis);
    return () => { on = false; clearInterval(id); if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVis); };
  }, [mode, lms.state, attemptId, attemptStatus, lessonId, lessonVersion, applyServerSession]);
  useEffect(() => {
    if (!liveJoinedNote) return;
    const t = setTimeout(() => setLiveJoinedNote(false), 8000);
    return () => clearTimeout(t);
  }, [liveJoinedNote]);

  // Komponent yopilsa — kutilayotgan progress darhol ketadi, kanal yopiladi
  useEffect(() => () => setProgressChannel(lessonId, null), [lessonId]);

  return {
    mode, pin, mentorScreen, mentorMax, status, mentorAlive, connected, ended, joinError, busy,
    startMentor, joinStudent, selfStudy, reportScreen, endSession, submitAnswer, arenaStart, arenaDone, podiumWait, finishHeld, holdFinish, finishWithoutPodium, recordAttempt, quiz, quizControl, revealScreen, mentorReveal,
    playerId: playerRef.current?.id || null, nickname: nickRef.current,
    lms, joinWithToken, hasLmsToken: !!liveToken, attempt, serverProgress, restartAttempt, liveJoinedNote,
    preview,
  };
}
