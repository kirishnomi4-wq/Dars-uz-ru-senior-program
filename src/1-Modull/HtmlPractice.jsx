import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
// Kod kompilyatori — UMUMIY modul (F-0808-03). Ilgari har dars o'z nusxasini saqlardi;
// endi bitta manba: har yaxshilanish hamma darsga birdan tegadi.
import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';
// 11.1 standart (2026-07-09): mentor avatari — hostlangan RASM (lokal import EMAS).
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';
// 11.10 real rasm: preview'da o'quvchi profil rasmi (PHOTO_SET.profil, qizcha).
const PROFILE_IMG = 'https://go.coddycamp.uz/uploads/media_library/58ebafabd92e2e3a80d86b7bb7e88eda.png';

// ============================================================
// HTML PRAKTIKA — PLATFORM STANDARD v15/v16
// O'quvchi o'z PORTFOLIO saytini HTML bilan quradi (bezaksiz — CSS keyingi darsda).
// Bo'limlar: Header · Men haqimda · Loyihalar · Aloqa · Footer (qisqa, skrolsiz).
// Markup toza va semantik — CSS praktikasida aynan shu struktura style qilinadi.
// Murojaat: O'quvchiga "SIZ" deb. Sarlavhalar — savol shaklida (metodika).
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
  line: '#E9E6DF', shadowBase: '58, 53, 48'
};
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };

// 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const AchCtx = createContext(null);
// Praktika-tugadi signali: o'quvchi kod mashqini bajarib bo'lgach 500+screenIdx ga yoziladi (jonli darsda mentor paneli o'qiydi).
const PRACTICE_DONE_BASE = 500;

const LangContext = createContext('uz');
const MentorCtx = createContext(null);
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

const LESSON_META = { lessonId: 'html-practice-portfolio-v2', lessonTitle: { uz: 'HTML Praktika — Portfolio sayt', ru: 'HTML практика — портфолио' } };
const HW_TOKENS = [
  { t: { uz: 'amaliyot', ru: 'практика' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'loyiha', ru: 'проект' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'mashq', ru: 'упражнение' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'natija', ru: 'результат' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'build',       template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'build',       template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's7',  type: 'build',       template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'build',       template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'build',       template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'build',       template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's14', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's16', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'spodium', type: 'podium',  template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's17', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// ===== Kichik yordamchi komponentlar =====
const Tg = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const Sr = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Preview = ({ children, title = 'portfolio.html', minH }) => (
  <div className="bp-window"><div className="bp-bar"><span className="bb-dots"><i /><i /><i /></span><span className="bp-title">{title}</span></div><div className="bp-body" style={{ minHeight: minH }}>{children}</div></div>
);
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
  const lbl = tr(label ?? { uz: 'Davom etish', ru: 'Продолжить' });
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  // freeRide: jonli o'quvchi individual gate'ga qaramay davom etadi (jamoaviy oqim to'xtamasin) — TESTLARDA ishlatilmaydi
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
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

// ===== TEST (ko'p tanlovli) =====
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
  // MENTOR (proyektor): o'zi javob bermaydi — statistikani kuzatadi, «Natijani ochish» bosganda reveal.
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
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect; // ball: 1-urinishni qotiramiz
    const optTexts = options.map(o => tr(o)); // payload'ga doim string yoziladi ({uz,ru} obyekt emas)
    if (oneShot) {
      // Jonli dars: javob darhol qotadi (to'g'ri ham, xato ham) va serverga yoziladi
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: optTexts, correctIndex: correctIdx, correctAnswer: optTexts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: optTexts[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: optTexts, correctIndex: correctIdx, correctAnswer: optTexts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: optTexts[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    if (audioText) { audio.triggerEvent('option_picked'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? (audioOk || "To'g'ri.") : (audioWrong || "Unchalik emas. Qaytadan urinib ko'ring.")); }, 300); }
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx; // jonli darsda xato bosib qotgan
  // KAHOOT REVEAL: jonli darsda javob bosilgach to'g'ri/xato sir saqlanadi — mentor «Natijani ochish»,
  // keyingi ekran, yoki dars tugagach hammada birdan ochiladi. Erkin/self rejimda darhol ko'rinadi.
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed; // javob qotdi — natija mentordan kutilmoqda
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval natijani oching', ru: 'Сначала откройте результат' }) : solved ? { uz: 'Davom etish', ru: 'Продолжить' } : (oneShot ? { uz: 'Javob tanlang', ru: 'Выберите ответ' } : { uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>⚡ {tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: 'Живой урок — одна попытка, думайте перед кликом!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
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
              ? fmtCode(tr({ uz: `✓ To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}`, ru: `✓ Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}` }))
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? fmtCode(tr({ uz: `To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}`, ru: `Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}` }))
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {fmtCode(tr(isMentorLive
              ? explainCorrect
              : waiting
                ? { uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас вы узнаете верный ответ.' }
                : wrongLocked
                  ? (explainWrong[picked] ?? explainWrong.default)
                  : solved ? explainCorrect : (explainWrong[picked] ?? explainWrong.default)))}
          </p>
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish", ru: 'открыть подсказку' })} ▾</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

// ===== Portfolio ma'lumotlari va jonli "bezaksiz brauzer" ko'rinishi =====
const usePortfolio = (answers) => ({
  name: (answers?.[3]?.name || '').trim() || 'Aziza Karimova',
  role: (answers?.[3]?.role || '').trim() || tr({ uz: 'Frontend dasturchi', ru: 'Frontend-разработчик' })
});
const firstName = (name) => (name.trim().split(/\s+/)[0] || 'aziza').toLowerCase().replace(/[^a-z]/g, '') || 'aziza';

// parts: 'header','nav','about','projects','contact','footer'
const SiteRender = ({ name, role, parts }) => {
  const has = (p) => parts.includes(p);
  return (
    <div className="raw">
      {has('header') && (
        <header>
          <h1>{name}</h1>
          <p>{role}</p>
          {has('nav') && (<nav><a>{tr({ uz: 'Men haqimda', ru: 'Обо мне' })}</a><a>{tr({ uz: 'Loyihalar', ru: 'Проекты' })}</a><a>{tr({ uz: 'Aloqa', ru: 'Контакты' })}</a></nav>)}
        </header>
      )}
      {has('header') && (has('about') || has('projects') || has('contact') || has('footer')) && <hr />}
      {has('about') && (
        <section>
          <h2>{tr({ uz: 'Men haqimda', ru: 'Обо мне' })}</h2>
          <img className="raw-img" src={PROFILE_IMG} alt={tr({ uz: 'Profil rasmi', ru: 'Фото профиля' })} />
          <p>{tr({ uz: "Salom! Men HTML o'rganayotgan o'quvchiman.", ru: 'Привет! Я ученик, изучаю HTML.' })}</p>
        </section>
      )}
      {has('projects') && (
        <section>
          <h2>{tr({ uz: 'Loyihalarim', ru: 'Мои проекты' })}</h2>
          <ul><li><a>{tr({ uz: 'To-Do ilova', ru: 'To-Do приложение' })}</a></li><li><a>{tr({ uz: 'Ob-havo sayti', ru: 'Сайт погоды' })}</a></li></ul>
        </section>
      )}
      {has('contact') && (
        <section>
          <h2>{tr({ uz: 'Aloqa', ru: 'Контакты' })}</h2>
          <p>{tr({ uz: "Men bilan bog'lanish uchun:", ru: 'Чтобы связаться со мной:' })}</p>
          <a>{firstName(name)}@gmail.com</a>
        </section>
      )}
      {has('footer') && <footer><p>© 2026 {name}</p></footer>}
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

// ===== SCREEN 0 — HOOK =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const audio = useAudio([{ id: 's0', text: `Nazariyani amalga aylantiramiz! Bugun siz o'zingizning portfolio saytingizni — shaxsiy saytingizni — noldan quryapsiz, faqat HTML bilan. Keyingi darsda esa uni CSS bilan chiroyli qilamiz. Avval ayting: portfolio sayt nima uchun kerak?`, trigger: 'on_mount', waits_for: { type: 'option_picked' } }]);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const OPTS = [
    { id: 'a', label: { uz: "O'zingizni, ishlaringiz va aloqangizni bir joyda ko'rsatish uchun", ru: 'Чтобы показать себя, свои работы и контакты в одном месте' } },
    { id: 'b', label: { uz: "Faqat dasturchilar ko'radigan maxfiy sahifa uchun", ru: 'Для секретной страницы, которую видят только программисты' } },
    { id: 'c', label: { uz: "O'yin o'ynash uchun", ru: 'Чтобы играть в игры' } }
  ];
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); audio.triggerEvent('option_picked'); };
  return (
    <Stage eyebrow={tr({ uz: 'Praktika · kirish', ru: 'Практика · вход' })} screen={screen} audioState={audio} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up" style={{ maxWidth: 800 }}>{tr({ uz: <>O'zingizni dunyoga qanday <span className="italic" style={{ color: T.accent }}>tanishtirasiz</span>?</>, ru: <>Как вы <span className="italic" style={{ color: T.accent }}>представите</span> себя миру?</> })}</h1>
        <Mentor>{tr({ uz: <>Bugun siz o'zingizning <b style={{ color: T.ink }}>portfolio saytingizni</b> noldan quryapsiz — faqat HTML bilan. Keyingi darsda uni CSS bilan bezaymiz. Avval ayting: portfolio sayt nima uchun kerak?</>, ru: <>Сегодня вы строите свой <b style={{ color: T.ink }}>сайт-портфолио</b> с нуля — только на HTML. На следующем уроке украсим его с помощью CSS. Сначала скажите: зачем нужен сайт-портфолио?</> })}</Mentor>
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: 'Dars oxirida — sizning saytingiz', ru: 'В конце урока — ваш сайт' })}</p>
            <Preview title="portfolio.html" minH={160}>
              {picked !== null
                ? <div className="fade-step"><SiteRender name="Aziza Karimova" role={tr({ uz: 'Frontend dasturchi', ru: 'Frontend-разработчик' })} parts={['header', 'nav', 'about']} /></div>
                : <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: "Hozircha bo'sh sahifa — uni birga to'ldiramiz…", ru: 'Пока страница пустая — заполним её вместе…' })}</p>}
            </Preview>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Sizningcha, portfolio nima uchun kerak?', ru: 'Как вы думаете, зачем нужно портфолио?' })}</p>
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {OPTS.map(o => { const on = picked === o.id; return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>); })}
            </div>
            {picked !== null && <p className="hook-ack fade-step">{tr({ uz: "Aniq! Portfolio — o'zingizni, ishlaringiz va aloqangizni bir joyda ko'rsatadigan shaxsiy sayt. Bugun shuni 0 dan quramiz.", ru: 'Точно! Портфолио — личный сайт, который показывает вас, ваши работы и контакты в одном месте. Сегодня построим его с нуля.' })}</p>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's1', text: `Saytingiz 5 ta bo'limdan iborat bo'ladi: sarlavha — ismingiz va kasbingiz, men haqimda, loyihalar, aloqa va eng pastda footer. Har bir bo'limni birma-bir o'z qo'lingiz bilan quramiz. Ishonasizmi — dars oxirida o'ngdagi saytni o'zingiz qurasiz!`, trigger: 'on_mount', waits_for: null }]);
  const STEPS = [
    { text: { uz: 'Sarlavha — ism va kasb', ru: 'Шапка — имя и профессия' }, tag: 'header' },
    { text: { uz: 'Men haqimda — rasm va matn', ru: 'Обо мне — фото и текст' }, tag: 'section' },
    { text: { uz: 'Loyihalar — ishlaringiz', ru: 'Проекты — ваши работы' }, tag: 'ul / li' },
    { text: { uz: 'Aloqa — sizni topishlari uchun', ru: 'Контакты — чтобы вас нашли' }, tag: 'a' },
    { text: { uz: 'Footer — pastki qism', ru: 'Footer — нижняя часть' }, tag: 'footer' }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const stepBtnRef = useRef(null);
  const scrollToBtn = () => { if (stepBtnRef.current) stepBtnRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  const PreviewBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: "Tayyor sayt — dars oxirida shunday bo'ladi", ru: 'Готовый сайт — таким он будет в конце урока' })}</p>
      <Preview title="portfolio.html" minH={200}>
        <SiteRender name="Aziza Karimova" role={tr({ uz: 'Frontend dasturchi', ru: 'Frontend-разработчик' })} parts={['header', 'nav', 'about', 'projects', 'contact', 'footer']} />
      </Preview>
    </Col>
  );
  const StepsBlock = (
    <Col>
      <p className="flow-label">{tr({ uz: "5 bo'lim", ru: '5 разделов' })}</p>
      <ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.text)}</span><span className="step-tag">{`<${s.tag.split(' ')[0]}>`}</span></span></li>))}</ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} audioState={audio} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: "Birinchi bo'limga →", ru: 'К первому разделу →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bu sayt sizni qanday <span className="italic" style={{ color: T.accent }}>tanishtiradi</span>?</>, ru: <>Как этот сайт <span className="italic" style={{ color: T.accent }}>представит</span> вас?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har bir bo'limni birma-bir <b style={{ color: T.ink }}>o'z qo'lingiz bilan</b> quramiz. <b style={{ color: T.ink }}>Ishonasizmi —</b> dars oxirida o'ngdagi saytni o'zingiz qura olasiz. Tayyor bo'lsangiz — boshladik! Sayt ustiga bosing</>, ru: <>Каждый раздел построим по очереди <b style={{ color: T.ink }}>своими руками</b>. <b style={{ color: T.ink }}>Поверите ли —</b> к концу урока вы сами сможете собрать сайт справа. Готовы — поехали! Нажмите на сайт</> })}</Mentor>
        {!isNarrow ? (<Split>{PreviewBlock}{StepsBlock}</Split>)
          : !showSteps ? (<div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)', cursor: 'pointer' }} onClick={scrollToBtn}>{PreviewBlock}<p className="small" style={{ margin: 0, color: T.ink2, textAlign: 'center', fontStyle: 'italic' }}>{tr({ uz: '👆 Saytni bosing — keyin "5 bo\'limni ko\'rish"', ru: '👆 Нажмите на сайт — потом «Посмотреть 5 разделов»' })}</p><button ref={stepBtnRef} className="btn" style={{ alignSelf: 'flex-start' }} onClick={(e) => { e.stopPropagation(); setShowSteps(true); }}>📋 {tr({ uz: "5 bo'limni ko'rish", ru: 'Посмотреть 5 разделов' })}</button></div>)
          : (<div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>↩ {tr({ uz: "Tayyor saytni ko'rish", ru: 'Посмотреть готовый сайт' })}</button>{StepsBlock}</div>)}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — SKELET =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's2', text: `Har qanday sayt — bu bloklar to'plami, ustma-ust joylashgan. Bizning saytimizning skeleti ham shunday: yuqorida sarlavha, o'rtada bo'limlar, eng pastida footer. Tugmani bosib, skeletni ko'ring — keyin har bir blokni HTML bilan to'ldiramiz.`, trigger: 'on_mount', waits_for: null }]);
  const BLOCKS = [
    { tag: 'header', l: 'Sarlavha (ism)' },
    { tag: 'section', l: 'Men haqimda' },
    { tag: 'section', l: 'Loyihalar' },
    { tag: 'section', l: 'Aloqa' },
    { tag: 'footer', l: 'Footer' }
  ];
  const [shown, setShown] = useState(!!storedAnswer);
  const [dragDone, setDragDone] = useState(!!storedAnswer);
  const done = dragDone;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={tr({ uz: 'Skelet', ru: 'Скелет' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Birinchi blokni quramiz →', ru: 'Строим первый блок →' } : (shown ? { uz: "Skeletni yig'ing", ru: 'Соберите скелет' } : { uz: "Skeletni ko'ring", ru: 'Посмотрите скелет' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sayt <span className="italic" style={{ color: T.accent }}>nimalardan</span> tuzilgan?</>, ru: <>Из чего <span className="italic" style={{ color: T.accent }}>состоит</span> сайт?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har qanday sayt — <b style={{ color: T.ink }}>bloklar to'plami</b>, ustma-ust joylashgan. Yuqorida sarlavha, o'rtada bo'limlar, pastda footer. Avval skeletni ko'ring, keyin <b style={{ color: T.ink }}>o'zingiz to'g'ri tartibda yig'ing</b>.</>, ru: <>Любой сайт — <b style={{ color: T.ink }}>набор блоков</b>, лежащих друг на друге. Сверху шапка, посередине разделы, внизу footer. Сначала посмотрите скелет, потом <b style={{ color: T.ink }}>соберите его сами в верном порядке</b>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            {!shown ? (<>
              <div className="skel-stack fade-up delay-2">
                {BLOCKS.map((b, i) => (
                  <div key={i} className="skel-block" style={{ transitionDelay: `${i * 0.07}s` }}>
                    <span className="skel-tag">{`<${b.tag}>`}</span>
                    <span className="skel-l">…</span>
                  </div>
                ))}
              </div>
              <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShown(true)}>🧱 {tr({ uz: "Skeletni ko'rsatish", ru: 'Показать скелет' })}</button>
            </>) : (
              <div className="sk-buildbox">
                <p className="eyebrow" style={{ color: T.accent, margin: '0 0 2px' }}>🧲 {tr({ uz: "Endi o'zingiz yig'ing", ru: 'Теперь соберите сами' })}</p>
                <p className="body" style={{ margin: '0 0 10px', color: T.ink2, fontSize: 13.5 }}>{tr({ uz: "Bo'laklarni to'g'ri tartibda joylang — sudrab yoki bosib. Yuqoridan pastga: header → bo'limlar → footer.", ru: 'Расставьте блоки в верном порядке — перетаскивая или нажимая. Сверху вниз: header → разделы → footer.' })}</p>
                <DragDropOrder items={SKELET_PIECES} hints={[{ uz: 'eng yuqorida', ru: 'в самом верху' }, { uz: "birinchi bo'lim", ru: 'первый раздел' }, { uz: "ikkinchi bo'lim", ru: 'второй раздел' }, { uz: "uchinchi bo'lim", ru: 'третий раздел' }, { uz: 'eng pastda', ru: 'в самом низу' }]} onSolved={() => setDragDone(true)} />
              </div>
            )}
          </div>
          <div className="col">
            <div className="frame-wait"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>Asosiy:</b> sahifani bo'laklarga bo'lamiz. Har bo'lak — alohida teg: <span className="mono">{'<header>'}</span>, <span className="mono">{'<section>'}</span>, <span className="mono">{'<footer>'}</span>. Ularni birma-bir to'ldiramiz.</>, ru: <><b>Главное:</b> делим страницу на части. Каждая часть — отдельный тег: <span className="mono">{'<header>'}</span>, <span className="mono">{'<section>'}</span>, <span className="mono">{'<footer>'}</span>. Заполним их по очереди.</> })}</p></div>
            {dragDone && <div className="frame-success fade-step"><p className="small mono" style={{ margin: '0 0 4px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ {tr({ uz: "Skeletni o'zingiz yig'dingiz", ru: 'Вы сами собрали скелет' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Endi har bir bo'sh blokni teglar bilan to'ldiramiz. Birinchi — sarlavha (header).", ru: 'Теперь заполним каждый пустой блок тегами. Первый — шапка (header).' })}</p></div>}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — BUILD: HEADER (shaxsiy) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's3', text: `Birinchi blok — sarlavha. Bu yerda ikkita narsa bor: ismingiz va kasbingiz. Ismingizni eng katta sarlavha — h1 teg ichiga, kasbingizni esa oddiy matn — p teg ichiga yozamiz. Ismingiz va kasbingizni yozing, keyin "Headerni qo'shish" tugmasini bosing.`, trigger: 'on_mount', waits_for: null }]);
  const [name, setName] = useState(storedAnswer?.name ?? '');
  const [role, setRole] = useState(storedAnswer?.role ?? '');
  const [done, setDone] = useState(!!storedAnswer);
  const dispName = (name.trim() || 'Aziza Karimova');
  const dispRole = (role.trim() || tr({ uz: 'Frontend dasturchi', ru: 'Frontend-разработчик' }));
  const add = () => { setDone(true); onAnswer(screen, { correct: true, name: name.trim(), role: role.trim() }); };
  return (
    <Stage eyebrow="Build · Header" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Headerni qo'shing", ru: 'Добавьте header' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saytingiz qanday <span className="italic" style={{ color: T.accent }}>boshlanadi</span>?</>, ru: <>С чего <span className="italic" style={{ color: T.accent }}>начинается</span> ваш сайт?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Eng yuqoridagi blok — <b style={{ color: T.ink }}>header</b>. Ismingizni <span className="mono">{'<h1>'}</span> (asosiy sarlavha), kasbingizni <span className="mono">{'<p>'}</span> (oddiy matn) ichiga yozamiz. To'ldiring va qo'shing.</>, ru: <>Самый верхний блок — <b style={{ color: T.ink }}>header</b>. Имя запишем в <span className="mono">{'<h1>'}</span> (главный заголовок), профессию — в <span className="mono">{'<p>'}</span> (обычный текст). Заполните и добавьте.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <div className="build-in fade-up delay-2">
              <span className="fld-label">{tr({ uz: 'Ismingiz (h1)', ru: 'Ваше имя (h1)' })}</span>
              <input className="text-input" value={name} placeholder={tr({ uz: 'masalan: Aziza Karimova', ru: 'например: Азиза Каримова' })} onChange={e => setName(e.target.value)} />
              <span className="fld-label" style={{ marginTop: 4 }}>{tr({ uz: "Kasbingiz / yo'nalishingiz (p)", ru: 'Ваша профессия / направление (p)' })}</span>
              <input className="text-input" value={role} placeholder={tr({ uz: 'masalan: Frontend dasturchi', ru: 'например: Frontend-разработчик' })} onChange={e => setRole(e.target.value)} />
            </div>
            <pre className="code-box fade-up delay-2"><Tg>{'<header>'}</Tg>{'\n  '}<Tg>{'<h1>'}</Tg>{dispName}<Tg>{'</h1>'}</Tg>{'\n  '}<Tg>{'<p>'}</Tg>{dispRole}<Tg>{'</p>'}</Tg>{'\n'}<Tg>{'</header>'}</Tg></pre>
            {!done && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={add}>➕ {tr({ uz: "Headerni qo'shish", ru: 'Добавить header' })}</button>}
          </div>
          <div className="col">
            <div className="flow-label">{tr({ uz: 'Brauzerda (hozircha bezaksiz)', ru: 'В браузере (пока без оформления)' })}</div>
            <Preview title="portfolio.html" minH={140}>
              {done ? <div className="fade-step"><SiteRender name={dispName} role={dispRole} parts={['header']} /></div>
                : <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: '"Headerni qo\'shish" ni bosing — sarlavha shu yerda chiqadi', ru: 'Нажмите «Добавить header» — заголовок появится здесь' })}</p>}
            </Preview>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">{'<h1>'}</span> — sahifadagi eng katta, eng muhim sarlavha. Bir sahifada bitta <span className="mono">{'<h1>'}</span> bo'ladi.</>, ru: <><span className="mono">{'<h1>'}</span> — самый большой и главный заголовок страницы. На странице бывает один <span className="mono">{'<h1>'}</span>.</> })}</p></div>}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST (h1) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    audioText="Sahifadagi eng katta, eng asosiy sarlavha qaysi teg bilan yoziladi?"
    questionText="Eng katta, asosiy sarlavha qaysi teg?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Sahifadagi <span className="italic" style={{ color: T.accent }}>eng katta</span>, asosiy sarlavha (ismingiz) qaysi teg bilan yoziladi?</>, ru: <>Каким тегом пишется <span className="italic" style={{ color: T.accent }}>самый большой</span>, главный заголовок страницы (ваше имя)?</> })}</h2></>}
    options={['`<p>`', '`<h1>`', '`<h6>`', '`<title>`']} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! `<h1>` — sahifadagi eng katta va eng muhim sarlavha (ismingiz). Har sahifada bitta `<h1>` bo'ladi.", ru: 'Верно! `<h1>` — самый большой и главный заголовок страницы (ваше имя). На странице бывает один `<h1>`.' }}
    explainWrong={{ 0: { uz: "`<p>` — oddiy matn (paragraf), sarlavha emas. Eng katta sarlavha — `<h1>`.", ru: '`<p>` — обычный текст (абзац), а не заголовок. Самый большой заголовок — `<h1>`.' }, 2: { uz: "`<h6>` — eng kichik sarlavha. Eng kattasi — `<h1>`.", ru: '`<h6>` — самый маленький заголовок. Самый большой — `<h1>`.' }, 3: { uz: "`<title>` — brauzer yorlig'idagi nom, sahifa ichida ko'rinmaydi. Asosiy sarlavha — `<h1>`.", ru: '`<title>` — имя на вкладке браузера, внутри страницы его не видно. Главный заголовок — `<h1>`.' }, default: { uz: "Eng katta sarlavha — `<h1>`.", ru: 'Самый большой заголовок — `<h1>`.' } }} />
);

// ===== SCREEN 5 — BUILD: NAV =====
const Screen5 = ({ screen, answers, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's5', text: `Endi menyu qo'shamiz — bo'limlarga o'tadigan havolalar. Havola bosilsa, boshqa joyga olib boradigan teg — bu a, ya'ni anchor. To'g'ri tegni tanlang, menyu jonlanadi.`, trigger: 'on_mount', waits_for: null }]);
  const OPTS = ['<p>', '<a>', '<li>', '<img>'];
  const CORRECT = '<a>';
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const solved = picked === CORRECT;
  const pf = usePortfolio(answers);
  const pick = (o) => { if (solved) return; setPicked(o); if (o === CORRECT && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: o }); };
  return (
    <Stage eyebrow={tr({ uz: 'Build · Navigatsiya', ru: 'Build · Навигация' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!solved} label={solved ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "To'g'ri tegni tanlang", ru: 'Выберите верный тег' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bo'limlar orasida qanday <span className="italic" style={{ color: T.accent }}>yuriladi</span>?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>переходить</span> между разделами?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Header ichiga <b style={{ color: T.ink }}>menyu</b> qo'shamiz — bosilsa bo'limga o'tadigan havolalar. Bosiladigan havola tegi qaysi? Tanlang — bo'sh joy <span className="slot">?</span> to'ladi.</>, ru: <>Внутрь header добавим <b style={{ color: T.ink }}>меню</b> — ссылки, ведущие к разделам. Какой тег у кликабельной ссылки? Выберите — пустое место <span className="slot">?</span> заполнится.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <pre className="code-box fade-up delay-2"><Tg>{'<nav>'}</Tg>{'\n  '}<span className={`slot ${solved ? 'filled' : ''}`}>{solved ? '<a href="#about">' : '<?>'}</span>{tr({ uz: 'Men haqimda', ru: 'Обо мне' })}<span className={`slot ${solved ? 'filled' : ''}`}>{solved ? '</a>' : '</?>'}</span>{'\n  '}<span style={{ opacity: 0.55 }}>{tr({ uz: '… (yana 2 ta havola)', ru: '… (ещё 2 ссылки)' })}</span>{'\n'}<Tg>{'</nav>'}</Tg></pre>
            <p className="fld-label">{tr({ uz: "Bo'sh joyga qaysi teg mos keladi?", ru: 'Какой тег подходит в пустое место?' })}</p>
            <div className="tagpick fade-up delay-3">
              {OPTS.map(o => { const isC = o === CORRECT; let cls = 'chip'; if (picked === o) cls += isC ? ' chip-on' : ' chip-wrong'; return (<button key={o} className={cls} disabled={solved} onClick={() => pick(o)}><span className="mono">{o}</span></button>); })}
            </div>
            <FeedbackBlock show={picked !== null} isCorrect={solved}>
              <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: solved ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Yana urinib ko'ring", ru: 'Попробуйте ещё раз' })}</p>
              <p className="body" style={{ margin: 0 }}>{solved ? tr({ uz: <>Aniq! <span className="mono">{'<a>'}</span> (anchor) — bosiladigan havola. <span className="mono">href</span> atributi qayerga o'tishni ko'rsatadi.</>, ru: <>Точно! <span className="mono">{'<a>'}</span> (anchor) — кликабельная ссылка. Атрибут <span className="mono">href</span> указывает, куда переходить.</> }) : tr({ uz: "Bu teg havola emas. Bosilganda boshqa joyga o'tkazadigan teg — anchor.", ru: 'Этот тег — не ссылка. Тег, который при клике ведёт в другое место, — anchor.' })}</p>
            </FeedbackBlock>
          </div>
          <div className="col">
            <div className="flow-label">{tr({ uz: 'Brauzerda', ru: 'В браузере' })}</div>
            <Preview title="portfolio.html" minH={140}>
              {solved ? <div className="fade-step"><SiteRender name={pf.name} role={pf.role} parts={['header', 'nav']} /></div>
                : <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: "To'g'ri tegni tanlang — menyu havolalari paydo bo'ladi", ru: 'Выберите верный тег — появятся ссылки меню' })}</p>}
            </Preview>
            {solved && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Havolalar hozir <b>ko'k va tagi chizilgan</b> — bu brauzerning standart ko'rinishi. CSS darsida ularni chiroyli qilamiz.</>, ru: <>Ссылки сейчас <b>синие и подчёркнутые</b> — это стандартный вид браузера. На уроке CSS сделаем их красивыми.</> })}</p></div>}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — TEST (a / havola) =====
const Screen6 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    audioText="Boshqa sahifaga yoki bo'limga o'tkazadigan, bosiladigan havola qaysi teg bilan yaratiladi?"
    questionText="Bosiladigan havola qaysi teg?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Boshqa bo'lim yoki saytga o'tkazadigan, <span className="italic" style={{ color: T.accent }}>bosiladigan havola</span> qaysi teg bilan yaratiladi?</>, ru: <>Каким тегом создаётся <span className="italic" style={{ color: T.accent }}>кликабельная ссылка</span>, ведущая в другой раздел или на другой сайт?</> })}</h2></>}
    options={['`<nav>`', '`<p>`', '`<link>`', '`<a>`']} correctIdx={3}
    explainCorrect={{ uz: "To'g'ri! `<a>` (anchor) — bosiladigan havola. `href` atributi qayerga o'tishni ko'rsatadi: `<a href=…>`.", ru: 'Верно! `<a>` (anchor) — кликабельная ссылка. Атрибут `href` указывает, куда переходить: `<a href=…>`.' }}
    explainWrong={{ 0: { uz: "`<nav>` — menyuni o'rab turadigan idish. Ichidagi har bir havola — `<a>`.", ru: '`<nav>` — контейнер, оборачивающий меню. Каждая ссылка внутри — `<a>`.' }, 1: { uz: "`<p>` — oddiy matn. Bosiladigan havola — `<a>`.", ru: '`<p>` — обычный текст. Кликабельная ссылка — `<a>`.' }, 2: { uz: "`<link>` — boshqa narsa (masalan CSS fayl ulash) uchun. Ko'rinadigan havola — `<a>`.", ru: '`<link>` — для другого (например, подключить CSS-файл). Видимая ссылка — `<a>`.' }, default: { uz: "Bosiladigan havola — `<a>` tegi.", ru: 'Кликабельная ссылка — тег `<a>`.' } }} />
);

// ===== SCREEN 7 — BUILD: ABOUT (img) =====
const Screen7 = ({ screen, answers, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's7', text: `Endi "Men haqimda" bo'limi. Bu yerda rasm bor — img teg orqali. Rasmga qaysi faylni ko'rsatishni src atributi aytadi. To'g'ri atributni tanlang, rasm joylashadi.`, trigger: 'on_mount', waits_for: null }]);
  const OPTS = ['href', 'src', 'alt', 'link'];
  const CORRECT = 'src';
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const solved = picked === CORRECT;
  const pf = usePortfolio(answers);
  const pick = (o) => { if (solved) return; setPicked(o); if (o === CORRECT && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: o }); };
  return (
    <Stage eyebrow={tr({ uz: 'Build · Men haqimda', ru: 'Build · Обо мне' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!solved} label={solved ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "To'g'ri atributni tanlang", ru: 'Выберите верный атрибут' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingiz haqingizda qanday <span className="italic" style={{ color: T.accent }}>aytasiz</span>?</>, ru: <>Как вы <span className="italic" style={{ color: T.accent }}>расскажете</span> о себе?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bu bo'lim <span className="mono">{'<section>'}</span> ichida: sarlavha <span className="mono">{'<h2>'}</span>, rasm <span className="mono">{'<img>'}</span> va matn <span className="mono">{'<p>'}</span>. Rasm fayliga qaysi atribut yo'l ko'rsatadi? Tanlang.</>, ru: <>Этот раздел внутри <span className="mono">{'<section>'}</span>: заголовок <span className="mono">{'<h2>'}</span>, картинка <span className="mono">{'<img>'}</span> и текст <span className="mono">{'<p>'}</span>. Какой атрибут указывает путь к файлу картинки? Выберите.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <pre className="code-box fade-up delay-2"><Tg>{'<section '}</Tg><At>id</At>=<Sr>"about"</Sr><Tg>{'>'}</Tg>{'\n  '}<Tg>{'<h2>'}</Tg>{tr({ uz: 'Men haqimda', ru: 'Обо мне' })}<Tg>{'</h2>'}</Tg>{'\n  '}<Tg>{'<img '}</Tg><span className={`slot ${solved ? 'filled' : ''}`}>{solved ? 'src' : '?'}</span>=<Sr>"rasm.jpg"</Sr> <At>alt</At>=<Sr>{tr({ uz: '"Mening rasmim"', ru: '"Моё фото"' })}</Sr><Tg>{'>'}</Tg>{'\n  '}<Tg>{'<p>'}</Tg>{tr({ uz: "Salom! Men o'quvchiman.", ru: 'Привет! Я ученик.' })}<Tg>{'</p>'}</Tg>{'\n'}<Tg>{'</section>'}</Tg></pre>
            <p className="fld-label">{tr({ uz: "Rasm fayliga qaysi atribut yo'l ko'rsatadi?", ru: 'Какой атрибут указывает путь к файлу картинки?' })}</p>
            <div className="tagpick fade-up delay-3">
              {OPTS.map(o => { const isC = o === CORRECT; let cls = 'chip'; if (picked === o) cls += isC ? ' chip-on' : ' chip-wrong'; return (<button key={o} className={cls} disabled={solved} onClick={() => pick(o)}><span className="mono">{o}</span></button>); })}
            </div>
            <FeedbackBlock show={picked !== null} isCorrect={solved}>
              <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: solved ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Yana urinib ko'ring", ru: 'Попробуйте ещё раз' })}</p>
              <p className="body" style={{ margin: 0 }}>{solved ? tr({ uz: <><span className="mono">src</span> (source) — rasm faylining manzili. <span className="mono">alt</span> esa rasm yuklanmasa, o'rniga chiqadigan matn.</>, ru: <><span className="mono">src</span> (source) — адрес файла картинки. А <span className="mono">alt</span> — текст, который появится вместо картинки, если она не загрузилась.</> }) : tr({ uz: <>Bu atribut rasm manzilini ko'rsatmaydi. Manzil uchun — <span className="mono">src</span>.</>, ru: <>Этот атрибут не указывает адрес картинки. Для адреса — <span className="mono">src</span>.</> })}</p>
            </FeedbackBlock>
          </div>
          <div className="col">
            <div className="flow-label">{tr({ uz: 'Brauzerda', ru: 'В браузере' })}</div>
            <Preview title="portfolio.html" minH={140}>
              {solved ? <div className="fade-step"><SiteRender name={pf.name} role={pf.role} parts={['about']} /></div>
                : <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: "To'g'ri atributni tanlang — bo'lim chiqadi", ru: 'Выберите верный атрибут — раздел появится' })}</p>}
            </Preview>
            {solved && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">{'<img>'}</span> — yopiladigan jufti yo'q (bo'sh teg). U <span className="mono">src</span> (manzil) va <span className="mono">alt</span> (muqobil matn) atributlari bilan ishlaydi.</>, ru: <><span className="mono">{'<img>'}</span> — без закрывающей пары (пустой тег). Он работает с атрибутами <span className="mono">src</span> (адрес) и <span className="mono">alt</span> (альтернативный текст).</> })}</p></div>}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST (alt) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    audioText="Rasm yuklanmasa yoki ko'rinmasa, uning o'rniga matn ko'rsatadigan atribut qaysi?"
    questionText="Rasm o'rniga matn ko'rsatadigan atribut?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: "«Men haqimda» rasmingiz yuklanmasa, uning o'rniga matn ko'rsatadigan (va ko'rish imkoni cheklanganlar uchun muhim) atribut qaysi?", ru: 'Если фото из «Обо мне» не загрузится, какой атрибут покажет вместо него текст (важный и для людей с нарушением зрения)?' })}</h2></>}
    options={['`src`', '`href`', '`alt`', '`title`']} correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! `alt` (alternative) — rasm chiqmasa o'rniga ko'rsatiladigan matn. Ekran o'qigichlar ham shu matnni o'qiydi.", ru: 'Верно! `alt` (alternative) — текст, который показывается вместо картинки, если она не появилась. Скринридеры тоже читают этот текст.' }}
    explainWrong={{ 0: { uz: "`src` — rasm faylining manzili. O'rniga matn esa — `alt`.", ru: '`src` — адрес файла картинки. А текст вместо неё — `alt`.' }, 1: { uz: "`href` — bu havola (`<a>`) uchun. Rasm matni — `alt`.", ru: '`href` — это для ссылки (`<a>`). Текст картинки — `alt`.' }, 3: { uz: "`title` — sichqoncha ustiga kelganda chiqadigan maslahat. Asosiy muqobil matn — `alt`.", ru: '`title` — подсказка при наведении мыши. Основной альтернативный текст — `alt`.' }, default: { uz: "Rasm o'rniga matn — `alt` atributi.", ru: 'Текст вместо картинки — атрибут `alt`.' } }} />
);

// ===== SCREEN 9 — BUILD: LOYIHALAR (ul / li + a) =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's9', text: `Loyihalar bo'limini ro'yxat bilan yasaymiz. Tartibsiz ro'yxat — ul, va har bir loyiha alohida element — li ichida, bosish uchun havola — a bilan. Pastdagi loyihalarni bosib, ro'yxatga qo'shing. Kamida ikkita qo'shing.`, trigger: 'on_mount', waits_for: null }]);
  const POOL = [{ uz: 'To-Do ilova', ru: 'To-Do приложение' }, { uz: 'Ob-havo sayti', ru: 'Сайт погоды' }, { uz: 'Kalkulyator', ru: 'Калькулятор' }, { uz: 'Shaxsiy blog', ru: 'Личный блог' }];
  const [added, setAdded] = useState(storedAnswer?.added ?? []);
  const done = added.length >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, added }); }, [done, added]);
  const add = (s) => { if (added.includes(s)) return; setAdded(a => [...a, s]); };
  return (
    <Stage eyebrow={tr({ uz: 'Build · Loyihalar', ru: 'Build · Проекты' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Yana ${2 - added.length} ta qo'shing`, ru: `Добавьте ещё ${2 - added.length}` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Loyihalaringizni qanday <span className="italic" style={{ color: T.accent }}>ro'yxatlaysiz</span>?</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>оформить списком</span> ваши проекты?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Loyihalar — ro'yxat: <span className="mono">{'<ul>'}</span> butun ro'yxat, ichida har biri <span className="mono">{'<li>'}</span>, va bosish uchun <span className="mono">{'<a>'}</span> havola. Pastdagi loyihalarni bosing — har biri yangi <span className="mono">{'<li>'}</span> bo'lib qo'shiladi.</>, ru: <>Проекты — это список: <span className="mono">{'<ul>'}</span> — весь список, внутри каждый пункт — <span className="mono">{'<li>'}</span>, а для клика — ссылка <span className="mono">{'<a>'}</span>. Нажимайте проекты внизу — каждый добавится новым <span className="mono">{'<li>'}</span>.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <p className="fld-label">{tr({ uz: "Loyiha qo'shing (kamida 2 ta)", ru: 'Добавьте проект (минимум 2)' })}</p>
            <div className="tagpick fade-up delay-2">
              {POOL.map(p => { const s = tr(p); return (<button key={p.uz} className={`chip ${added.includes(s) ? 'chip-on' : ''}`} disabled={added.includes(s)} onClick={() => add(s)}>{added.includes(s) ? '✓ ' : '+ '}{s}</button>); })}
            </div>
            <pre className="code-box fade-up delay-3"><Tg>{'<ul>'}</Tg>{added.length === 0 ? <span style={{ opacity: 0.5 }}>{'\n  '}{tr({ uz: "… loyiha qo'shing", ru: '… добавьте проект' })}</span> : added.map((s, i) => (<React.Fragment key={i}>{'\n  '}<Tg>{'<li>'}</Tg><Tg>{'<a '}</Tg><At>href</At>=<Sr>"#"</Sr><Tg>{'>'}</Tg>{s}<Tg>{'</a>'}</Tg><Tg>{'</li>'}</Tg></React.Fragment>))}{'\n'}<Tg>{'</ul>'}</Tg></pre>
          </div>
          <div className="col">
            <div className="flow-label">{tr({ uz: 'Brauzerda', ru: 'В браузере' })}</div>
            <Preview title="portfolio.html" minH={140}>
              {added.length > 0 ? (
                <div className="raw fade-step"><h2>{tr({ uz: 'Loyihalarim', ru: 'Мои проекты' })}</h2><ul>{added.map((s, i) => <li key={i}><a>{s}</a></li>)}</ul></div>
              ) : <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: "Loyiha qo'shing — ro'yxat shu yerda o'sadi", ru: 'Добавляйте проекты — список растёт здесь' })}</p>}
            </Preview>
            {done && <div className="frame-success fade-step"><p className="small mono" style={{ margin: '0 0 4px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ {tr({ uz: "Ro'yxat tayyor", ru: 'Список готов' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Har bir <span className="mono">{'<li>'}</span> — alohida loyiha, ichidagi <span className="mono">{'<a>'}</span> esa uni ochadigan havola.</>, ru: <>Каждый <span className="mono">{'<li>'}</span> — отдельный проект, а <span className="mono">{'<a>'}</span> внутри — ссылка, которая его открывает.</> })}</p></div>}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TEST (ul/ol) =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    audioText="Tartibi muhim bo'lmagan, nuqtali ro'yxat qaysi teg bilan yaratiladi?"
    questionText="Tartibsiz (nuqtali) ro'yxat qaysi teg?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Loyihalar ro'yxatida tartib muhim emas. <span className="italic" style={{ color: T.accent }}>Tartibsiz (nuqtali)</span> ro'yxat qaysi teg bilan yaratiladi?</>, ru: <>В списке проектов порядок не важен. Каким тегом создаётся <span className="italic" style={{ color: T.accent }}>маркированный (с точками)</span> список?</> })}</h2></>}
    options={['`<ol>`', '`<ul>`', '`<li>`', '`<dl>`']} correctIdx={1}
    explainCorrect={{ uz: "To'g'ri! `<ul>` (unordered list) — tartibsiz, nuqtali ro'yxat. Ichidagi har bir element — `<li>`.", ru: 'Верно! `<ul>` (unordered list) — маркированный список с точками. Каждый элемент внутри — `<li>`.' }}
    explainWrong={{ 0: { uz: "`<ol>` (ordered list) — raqamli, tartibli ro'yxat. Nuqtalisi — `<ul>`.", ru: '`<ol>` (ordered list) — нумерованный, упорядоченный список. С точками — `<ul>`.' }, 2: { uz: "`<li>` — ro'yxat elementi. Uni o'rab turadigan idish — `<ul>`.", ru: '`<li>` — элемент списка. Контейнер, который его оборачивает, — `<ul>`.' }, 3: { uz: "`<dl>` — boshqa tur (ta'rif ro'yxati). Oddiy nuqtali ro'yxat — `<ul>`.", ru: '`<dl>` — другой вид (список определений). Обычный маркированный список — `<ul>`.' }, default: { uz: "Nuqtali ro'yxat — `<ul>`.", ru: 'Маркированный список — `<ul>`.' } }} />
);

// ===== SCREEN 11 — BUILD: ALOQA (mailto) =====
const Screen11 = ({ screen, answers, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's11', text: `Portfolioning eng muhim qismi — sizni qanday topishlari. Aloqa bo'limiga email havolasini qo'yamiz. Bosilganda pochta dasturi ochilishi uchun manzil oldiga maxsus belgi yoziladi. Qaysi biri? Tanlang.`, trigger: 'on_mount', waits_for: null }]);
  const OPTS = ['http://', 'mailto:', 'tel:', '#'];
  const CORRECT = 'mailto:';
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const solved = picked === CORRECT;
  const pf = usePortfolio(answers);
  const pick = (o) => { if (solved) return; setPicked(o); if (o === CORRECT && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: o }); };
  return (
    <Stage eyebrow={tr({ uz: 'Build · Aloqa', ru: 'Build · Контакты' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!solved} label={solved ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "To'g'ri variantni tanlang", ru: 'Выберите верный вариант' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sizni qanday <span className="italic" style={{ color: T.accent }}>topishadi</span>?</>, ru: <>Как вас <span className="italic" style={{ color: T.accent }}>найдут</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Portfolioning eng muhim qismi — odamlar siz bilan <b style={{ color: T.ink }}>bog'lana olishi</b>. Email havolasini qo'yamiz: bosilganda pochta dasturi ochilishi uchun <span className="mono">href</span> ichida manzil oldiga maxsus belgi qo'yiladi. Qaysi biri?</>, ru: <>Самая важная часть портфолио — чтобы люди могли <b style={{ color: T.ink }}>связаться</b> с вами. Поставим email-ссылку: чтобы по клику открывалась почтовая программа, в <span className="mono">href</span> перед адресом ставится специальная пометка. Какая?</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <pre className="code-box fade-up delay-2"><Tg>{'<section '}</Tg><At>id</At>=<Sr>"contact"</Sr><Tg>{'>'}</Tg>{'\n  '}<Tg>{'<h2>'}</Tg>{tr({ uz: 'Aloqa', ru: 'Контакты' })}<Tg>{'</h2>'}</Tg>{'\n  '}<Tg>{'<a '}</Tg><At>href</At>=<Sr>"</Sr><span className={`slot ${solved ? 'filled' : ''}`}>{solved ? 'mailto:' : '?'}</span><Sr>{firstName(pf.name)}@gmail.com"</Sr><Tg>{'>'}</Tg>Email<Tg>{'</a>'}</Tg>{'\n'}<Tg>{'</section>'}</Tg></pre>
            <p className="fld-label">{tr({ uz: "Email manzili oldiga nima qo'yiladi?", ru: 'Что ставится перед email-адресом?' })}</p>
            <div className="tagpick fade-up delay-3">
              {OPTS.map(o => { const isC = o === CORRECT; let cls = 'chip'; if (picked === o) cls += isC ? ' chip-on' : ' chip-wrong'; return (<button key={o} className={cls} disabled={solved} onClick={() => pick(o)}><span className="mono">{o}</span></button>); })}
            </div>
            <FeedbackBlock show={picked !== null} isCorrect={solved}>
              <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: solved ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Yana urinib ko'ring", ru: 'Попробуйте ещё раз' })}</p>
              <p className="body" style={{ margin: 0 }}>{solved ? tr({ uz: <><span className="mono">mailto:</span> — email havolasi. Bosilsa, pochta dasturi shu manzilga (masalan <span className="mono">{firstName(pf.name)}@gmail.com</span>) xat yozish uchun ochiladi.</>, ru: <><span className="mono">mailto:</span> — email-ссылка. По клику откроется почтовая программа, чтобы написать письмо на этот адрес (например <span className="mono">{firstName(pf.name)}@gmail.com</span>).</> }) : tr({ uz: <>Bu email uchun emas. Email havolasi <span className="mono">mailto:</span> bilan boshlanadi.</>, ru: <>Это не для email. Email-ссылка начинается с <span className="mono">mailto:</span>.</> })}</p>
            </FeedbackBlock>
          </div>
          <div className="col">
            <div className="flow-label">{tr({ uz: 'Brauzerda', ru: 'В браузере' })}</div>
            <Preview title="portfolio.html" minH={140}>
              {solved ? <div className="fade-step"><SiteRender name={pf.name} role={pf.role} parts={['contact']} /></div>
                : <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: "To'g'ri variantni tanlang — aloqa bo'limi chiqadi", ru: 'Выберите верный вариант — появится раздел контактов' })}</p>}
            </Preview>
            {solved && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu havola <b>gmail.com</b> bilan ham, istalgan pochta bilan ham ishlaydi — <span className="mono">mailto:</span> har qanday email manziliga mos keladi.</>, ru: <>Эта ссылка работает и с <b>gmail.com</b>, и с любой другой почтой — <span className="mono">mailto:</span> подходит к любому email-адресу.</> })}</p></div>}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — BUILD: FOOTER =====
const Screen12 = ({ screen, answers, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's12', text: `Oxirgi blok — footer, ya'ni sahifaning pastki qismi. Bu yerda odatda mualliflik belgisi va yil yoziladi. Footer uchun qaysi teg ishlatiladi? Tanlang.`, trigger: 'on_mount', waits_for: null }]);
  const OPTS = ['<header>', '<footer>', '<section>', '<main>'];
  const CORRECT = '<footer>';
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const solved = picked === CORRECT;
  const pf = usePortfolio(answers);
  const pick = (o) => { if (solved) return; setPicked(o); if (o === CORRECT && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: o }); };
  return (
    <Stage eyebrow="Build · Footer" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!solved} label={solved ? { uz: "Saytni yig'amiz →", ru: 'Собираем сайт →' } : { uz: "To'g'ri tegni tanlang", ru: 'Выберите верный тег' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sahifa qanday <span className="italic" style={{ color: T.accent }}>yakunlanadi</span>?</>, ru: <>Чем <span className="italic" style={{ color: T.accent }}>завершается</span> страница?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Eng pastki blok — <b style={{ color: T.ink }}>footer</b> ("oyoq" degani). Bu yerda mualliflik <span className="mono">©</span> va yil yoziladi. Pastki qism uchun qaysi teg? Tanlang.</>, ru: <>Самый нижний блок — <b style={{ color: T.ink }}>footer</b> (значит «нога»). Здесь пишут авторство <span className="mono">©</span> и год. Какой тег для нижней части? Выберите.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <pre className="code-box fade-up delay-2"><span className={`slot ${solved ? 'filled' : ''}`}>{solved ? '<footer>' : '<?>'}</span>{'\n  '}<Tg>{'<p>'}</Tg>© 2026 {pf.name}<Tg>{'</p>'}</Tg>{'\n'}<span className={`slot ${solved ? 'filled' : ''}`}>{solved ? '</footer>' : '</?>'}</span></pre>
            <p className="fld-label">{tr({ uz: 'Sahifaning pastki qismi qaysi teg?', ru: 'Какой тег у нижней части страницы?' })}</p>
            <div className="tagpick fade-up delay-3">
              {OPTS.map(o => { const isC = o === CORRECT; let cls = 'chip'; if (picked === o) cls += isC ? ' chip-on' : ' chip-wrong'; return (<button key={o} className={cls} disabled={solved} onClick={() => pick(o)}><span className="mono">{o}</span></button>); })}
            </div>
            <FeedbackBlock show={picked !== null} isCorrect={solved}>
              <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: solved ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Yana urinib ko'ring", ru: 'Попробуйте ещё раз' })}</p>
              <p className="body" style={{ margin: 0 }}>{solved ? tr({ uz: <><span className="mono">{'<footer>'}</span> — sahifaning eng pastki, yakuniy qismi. Mualliflik, yil va aloqa shu yerga joylashadi.</>, ru: <><span className="mono">{'<footer>'}</span> — самая нижняя, завершающая часть страницы. Авторство, год и контакты живут здесь.</> }) : tr({ uz: <>Bu teg pastki qism uchun emas. Sahifa "oyog'i" — <span className="mono">{'<footer>'}</span>.</>, ru: <>Этот тег не для нижней части. «Нога» страницы — <span className="mono">{'<footer>'}</span>.</> })}</p>
            </FeedbackBlock>
          </div>
          <div className="col">
            <div className="flow-label">{tr({ uz: 'Brauzerda', ru: 'В браузере' })}</div>
            <Preview title="portfolio.html" minH={140}>
              {solved ? <div className="fade-step"><SiteRender name={pf.name} role={pf.role} parts={['footer']} /></div>
                : <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: "To'g'ri tegni tanlang — footer chiqadi", ru: 'Выберите верный тег — footer появится' })}</p>}
            </Preview>
            {solved && <div className="frame-success fade-step"><p className="small mono" style={{ margin: '0 0 4px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ {tr({ uz: "Barcha bo'limlar tayyor", ru: 'Все разделы готовы' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "5 blok ham qurildi! Endi hammasini bitta sahifaga yig'amiz.", ru: 'Все 5 блоков построены! Теперь соберём всё на одну страницу.' })}</p></div>}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — TEST (footer) =====
const Screen13 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 5-savol', ru: 'Упражнение · вопрос 5' })}
    audioText="Sahifaning eng pastida, mualliflik va yil joylashadigan qism qaysi teg bilan belgilanadi?"
    questionText="Sahifaning eng pastki qismi qaysi teg?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Sahifaning <span className="italic" style={{ color: T.accent }}>eng pastida</span> (mualliflik ©, yil) joylashadigan qism qaysi teg bilan belgilanadi?</>, ru: <>Каким тегом обозначается часть в <span className="italic" style={{ color: T.accent }}>самом низу</span> страницы (авторство ©, год)?</> })}</h2></>}
    options={['`<header>`', '`<nav>`', '`<section>`', '`<footer>`']} correctIdx={3}
    explainCorrect={{ uz: "To'g'ri! `<footer>` — sahifaning eng pastki, yakuniy qismi: mualliflik, yil, aloqa. Nomi ham 'oyoq' (foot) degani.", ru: 'Верно! `<footer>` — самая нижняя, завершающая часть страницы: авторство, год, контакты. Название и значит «нога» (foot).' }}
    explainWrong={{ 0: { uz: "`<header>` — aksincha, eng yuqoridagi qism (sarlavha). Pastdagi — `<footer>`.", ru: '`<header>` — наоборот, самая верхняя часть (шапка). Нижняя — `<footer>`.' }, 1: { uz: "`<nav>` — menyu (havolalar). Pastki qism — `<footer>`.", ru: '`<nav>` — меню (ссылки). Нижняя часть — `<footer>`.' }, 2: { uz: "`<section>` — oddiy bo'lim. Maxsus pastki qism — `<footer>`.", ru: '`<section>` — обычный раздел. Специальная нижняя часть — `<footer>`.' }, default: { uz: "Eng pastki qism — `<footer>`.", ru: 'Самая нижняя часть — `<footer>`.' } }} />
);

// ===== SCREEN 14 — DEBUGGING (o'quvchi xatoni o'zi topadi) =====
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's14', text: `Endi siz teglarni bilasiz — demak xatoni ham topa olasiz. AI "Men haqimda" bo'limingiz uchun kod yozdi, lekin bitta xato qoldirdi: bir teg ochilgan, ammo yopilmagan. Qaysi qatorda? Bosib toping.`, trigger: 'on_mount', waits_for: { type: 'error_found' } }]);
  const [done, setDone] = useState(!!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const DBG_LINES = [
    { text: <><span className="tg">&lt;section&gt;</span></> },
    { text: { uz: <><span className="tg">&lt;h2&gt;</span>Men haqimda<span className="tg">&lt;/h2&gt;</span></>, ru: <><span className="tg">&lt;h2&gt;</span>Обо мне<span className="tg">&lt;/h2&gt;</span></> } },
    { text: { uz: <><span className="tg">&lt;p&gt;</span>Salom! Men HTML o'rganyapman.</>, ru: <><span className="tg">&lt;p&gt;</span>Привет! Я изучаю HTML.</> }, bug: true },
    { text: <><span className="tg">&lt;/section&gt;</span></> },
  ];
  const DBG_FIXED = { uz: <><span className="tg">&lt;p&gt;</span>Salom! Men HTML o'rganyapman.<span className="tg">&lt;/p&gt;</span></>, ru: <><span className="tg">&lt;p&gt;</span>Привет! Я изучаю HTML.<span className="tg">&lt;/p&gt;</span></> };
  return (
    <Stage eyebrow="Debugging" screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Xatoni toping', ru: 'Найдите ошибку' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI kod yozdi — siz uni <span className="italic" style={{ color: T.accent }}>tekshirasiz</span>.</>, ru: <>AI написал код — вы его <span className="italic" style={{ color: T.accent }}>проверяете</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI kod yozishda zo'r yordamchi. Lekin <b style={{ color: T.ink }}>odamlar ham, AI ham</b> ba'zan kichik xato qiladi. Shuni topib tuzatish — <b style={{ color: T.ink }}>debugging</b> deyiladi, va bu eng zo'r mahorat. AI yozgan kodda bitta teg yopilmagan — qaysi qatorda? Bosing.</>, ru: <>AI — отличный помощник в написании кода. Но <b style={{ color: T.ink }}>и люди, и AI</b> иногда делают маленькие ошибки. Найти и исправить их — это <b style={{ color: T.ink }}>дебаггинг</b>, и это крутой навык. В коде от AI один тег не закрыт — в какой строке? Нажмите.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <div className="col">
            <div className="ai-card fade-up delay-2">
              <div className="ai-row"><span className="ai-badge">AI</span><span className="ai-bubble">{tr({ uz: 'Mana, "Men haqimda" bo\'limi tayyor!', ru: 'Вот, раздел «Обо мне» готов!' })}</span></div>
              <DebugChallenge lines={DBG_LINES} fixed={DBG_FIXED} explain={{ uz: <><span className="mono">{'<p>'}</span> ochilgan edi, lekin <span className="mono">{'</p>'}</span> bilan yopilmagan edi — endi to'g'ri.</>, ru: <><span className="mono">{'<p>'}</span> был открыт, но не закрыт <span className="mono">{'</p>'}</span> — теперь всё верно.</> }} onSolved={() => setDone(true)} />
            </div>
          </div>
          <div className="col">
            {!done
              ? (<div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Endi siz teglarni bilasiz — AI yozgan kodni <b style={{ color: T.ink }}>tekshira olasiz</b>. Qaysi teg ochilib, yopilmagan?</>, ru: <>Теперь вы знаете теги — значит, можете <b style={{ color: T.ink }}>проверить</b> код, написанный AI. Какой тег открылся, но не закрылся?</> })}</p></div>)
              : (<>
              <div className="flow-label">{tr({ uz: "Endi sahifa to'g'ri ishlaydi", ru: 'Теперь страница работает правильно' })}</div>
              <Preview title="portfolio.html" minH={110}><div className="raw fade-step"><h2>{tr({ uz: 'Men haqimda', ru: 'Обо мне' })}</h2><p>{tr({ uz: "Salom! Men HTML o'rganyapman.", ru: 'Привет! Я изучаю HTML.' })}</p></div></Preview>
              <div className="takeaway fade-step"><div className="ta-bulb">🛠️</div><p className="ta-h">{tr({ uz: 'Topdingiz va tuzatdingiz — bu debugging!', ru: 'Нашли и исправили — это и есть дебаггинг!' })}</p><p className="ta-sub">{tr({ uz: "AI tez yozadi, siz tekshirib tuzatasiz — zo'r jamoa", ru: 'AI быстро пишет, вы проверяете и чините — отличная команда' })}</p></div>
            </>)}
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — YIG'ISH (to'liq portfolio) =====
const Screen15 = ({ screen, answers, storedAnswer, onAnswer, onNext, onPrev }) => {
  const pf = usePortfolio(answers);
  const audio = useAudio([{ id: 's15', text: `Mana eng zo'r qismi — barcha bloklarni bitta sahifaga yig'amiz. Tugmani bosing va o'z portfolio saytingiz to'liq ko'rinishda paydo bo'lsin. Hozir u bezaksiz, oddiy — bu normal. Keyingi darsda CSS bilan uni chiroyli qilamiz.`, trigger: 'on_mount', waits_for: null }]);
  const ALL = ['header', 'nav', 'about', 'projects', 'contact', 'footer'];
  const isNarrow = useIsMobile(768);
  const [built, setBuilt] = useState(storedAnswer ? ALL : []);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const endRef = useRef(null);
  const done = built.length >= ALL.length;
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const followDown = () => { if (!isNarrow) return; requestAnimationFrame(() => { if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); }); };
  const assemble = () => {
    clearTimeout(timer.current); setBuilt([]); setRunning(true);
    const tick = (i) => { setBuilt(ALL.slice(0, i)); followDown(); if (i < ALL.length) timer.current = setTimeout(() => tick(i + 1), 460); else setRunning(false); };
    timer.current = setTimeout(() => tick(1), 250);
  };
  return (
    <Stage eyebrow={tr({ uz: "Saytni yig'ish", ru: 'Сборка сайта' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Yakuniy savol →', ru: 'Финальный вопрос →' } : { uz: "Avval saytni yig'ing", ru: 'Сначала соберите сайт' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Hammasini bitta <span className="italic" style={{ color: T.accent }}>saytga</span> yig'amizmi?</>, ru: <>Соберём всё в один <span className="italic" style={{ color: T.accent }}>сайт</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mana eng zo'r qismi! Tugmani bosing — barcha bloklar <b style={{ color: T.ink }}>birma-bir</b> yig'ilib, sizning to'liq portfolio saytingiz paydo bo'ladi. Bezaksiz — bu normal, CSS keyin.</>, ru: <>Вот самая крутая часть! Нажмите кнопку — все блоки соберутся <b style={{ color: T.ink }}>один за другим</b>, и появится ваш полный сайт-портфолио. Без оформления — это нормально, CSS потом.</> })}</Mentor>
        <Zoomable>
        <div className="split" style={{ alignItems: 'stretch' }}>
          <div className="col">
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={assemble} disabled={running}>{running ? tr({ uz: "Yig'ilmoqda…", ru: 'Собирается…' }) : (done ? tr({ uz: "↻ Yana yig'ish", ru: '↻ Собрать ещё раз' }) : tr({ uz: "▶ Saytni yig'ish", ru: '▶ Собрать сайт' }))}</button>
            <div className="asm-list fade-up delay-2">
              {ALL.map((p, i) => (<div key={p} className={`asm-row ${built.includes(p) ? 'on' : ''}`}><span className="asm-ic">{built.includes(p) ? '✓' : (i + 1)}</span><span className="mono small">{`<${p}>`}</span></div>))}
            </div>
            {done && <div className="frame-success fade-step" style={{ marginTop: 'auto' }}><p className="small mono" style={{ margin: '0 0 4px', fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em' }}>✓ {tr({ uz: 'Sayt tayyor!', ru: 'Сайт готов!' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu — to'liq <b>HTML</b> bilan qurilgan, ishlaydigan sayt. Keyingi darsda CSS bilan ranglar va chiroyli ko'rinish beramiz.</>, ru: <>Это работающий сайт, целиком построенный на <b>HTML</b>. На следующем уроке добавим цвета и красивый вид с помощью CSS.</> })}</p></div>}
          </div>
          <div className="col">
            <div className="flow-label">{pf.name} — portfolio.html</div>
            <Preview title="portfolio.html" minH={210}>
              {built.length > 0 ? <SiteRender name={pf.name} role={pf.role} parts={built} />
                : <p style={{ fontFamily: 'Georgia, serif', color: T.ink3, fontStyle: 'italic', margin: 0, textAlign: 'center' }}>{tr({ uz: '"Saytni yig\'ish" ni bosing — to\'liq saytingiz shu yerda paydo bo\'ladi', ru: 'Нажмите «Собрать сайт» — ваш полный сайт появится здесь' })}</p>}
            </Preview>
            <div ref={endRef} aria-hidden="true" />
          </div>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 16 — YAKUNIY TEST =====
const Screen16 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy savol', ru: 'Финальный вопрос' })}
    audioText="Portfolio sahifangiz to'g'ri tartibda qanday joylashadi? Yuqoridan pastga qarab."
    questionText="Bo'limlar to'g'ri tartibi qaysi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: 'Butun saytni eslang', ru: 'Вспомните весь сайт' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Portfolio sahifangiz <span className="italic" style={{ color: T.accent }}>yuqoridan pastga</span> qanday tartibda joylashadi?</>, ru: <>В каком порядке идёт ваша страница портфолио <span className="italic" style={{ color: T.accent }}>сверху вниз</span>?</> })}</h2></>}
    options={[{ uz: 'Footer → Header → Men haqimda → Loyihalar → Aloqa', ru: 'Footer → Header → Обо мне → Проекты → Контакты' }, { uz: 'Men haqimda → Header → Loyihalar → Aloqa → Footer', ru: 'Обо мне → Header → Проекты → Контакты → Footer' }, { uz: 'Header → Men haqimda → Loyihalar → Aloqa → Footer', ru: 'Header → Обо мне → Проекты → Контакты → Footer' }, { uz: 'Header → Loyihalar → Men haqimda → Footer → Aloqa', ru: 'Header → Проекты → Обо мне → Footer → Контакты' }]} correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! Yuqorida header (ism), keyin bo'limlar (men haqimda, loyihalar, aloqa), eng pastda footer.", ru: 'Верно! Сверху header (имя), затем разделы (обо мне, проекты, контакты), в самом низу footer.' }}
    explainWrong={{ 0: { uz: "Footer eng pastda bo'lishi kerak, yuqorida emas. Header — birinchi.", ru: 'Footer должен быть в самом низу, а не сверху. Header — первый.' }, 1: { uz: 'Header birinchi bo\'ladi — "Men haqimda" undan keyin keladi.', ru: 'Header идёт первым — «Обо мне» после него.' }, 3: { uz: "Boshlanishi to'g'ri, lekin Footer eng oxirida bo'lishi kerak.", ru: 'Начало верное, но Footer должен быть в самом конце.' }, default: { uz: "To'g'ri tartib: Header → bo'limlar → Footer.", ru: 'Верный порядок: Header → разделы → Footer.' } }} />
);

// ===== SCREEN 17 — YAKUN =====
const Screen17 = ({ screen, answers, achievements, onReset, onPrev, onFinish, onHomework }) => {
  // F-0803-08: uyga vazifa kapsulasi — bosilganda topshiriq kartasi ochiladi
  const [hwOpen, setHwOpen] = useState(false);
  const [hwCharge, setHwCharge] = useState(false);
  const fireHw = () => { if (hwCharge || hwOpen) return; setHwCharge(true); setTimeout(() => { setHwOpen(true); setHwCharge(false); }, 500); };
  const pf = usePortfolio(answers);
  const audio = useAudio([{ id: 's17', text: "Tabriklayman! Siz o'z qo'lingiz bilan to'liq portfolio saytini HTML bilan qurdingiz: header, navigatsiya, men haqimda, loyihalar, aloqa va footer. Hozir u bezaksiz. Keyingi darsda esa aynan shu saytga CSS bilan jon kiritamiz — ranglar, shriftlar, chiroyli joylashuv. Tayyor bo'ling!", trigger: 'on_mount', waits_for: null }]);
  const RECAP = [{ uz: 'header — sahifa sarlavhasi (ism, kasb)', ru: 'header — шапка страницы (имя, профессия)' }, { uz: 'h1, h2 — sarlavhalar bosqichi', ru: 'h1, h2 — ступени заголовков' }, { uz: 'nav va a — menyu havolalari', ru: 'nav и a — ссылки меню' }, { uz: "section — alohida bo'limlar", ru: 'section — отдельные разделы' }, { uz: 'img (src, alt) — rasm', ru: 'img (src, alt) — картинка' }, { uz: "ul va li — ro'yxat", ru: 'ul и li — список' }, { uz: 'a + mailto — email havola', ru: 'a + mailto — email-ссылка' }, { uz: 'footer — pastki qism', ru: 'footer — нижняя часть' }];
  const HOMEWORK = [{ b: { uz: "O'zgartiring", ru: 'Измените' }, t: { uz: "— loyihalar ro'yxatiga yana bitta ish qo'shing", ru: '— добавьте в список проектов ещё одну работу' } }, { b: { uz: "To'ldiring", ru: 'Дополните' }, t: { uz: '— "Men haqimda" matnini o\'zingiz haqingizda yozing', ru: '— напишите текст «Обо мне» о себе' } }, { b: { uz: 'Tayyorlaning', ru: 'Подготовьтесь' }, t: { uz: '— keyingi darsda shu saytga CSS beramiz', ru: '— на следующем уроке дадим этому сайту CSS' } }];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
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
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'CSS bilan bezashni boshlash →', ru: 'Начать оформление с CSS →' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'HTML praktika tugadi', ru: 'HTML-практика завершена' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>{pf.name} — <span className="italic" style={{ color: T.accent }}>portfolio</span> tayyor.</>, ru: <>{pf.name} — <span className="italic" style={{ color: T.accent }}>портфолио</span> готово.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} disabled={studentWait} liveOn={studentLive} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz qura olasiz', ru: 'Теперь вы умеете строить' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.06}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${hwCharge ? 'charging' : ''}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, '--d': `${k.d}s` }}>{tr(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span>
            <span className="hw-big-s">{tr({ uz: 'Amaliy topshiriqni bajarish →', ru: 'Выполнить практическое задание →' })}</span>
          </button>
        </div>
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>🔧 {tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Saytingizni o'zingizniki qiling:", ru: 'Сделайте сайт по-настоящему своим:' })}</p><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: 'Keyingi darsda aynan shu portfolioga CSS bilan jon kiritamiz! 🎨', ru: 'На следующем уроке именно это портфолио оживим с помощью CSS! 🎨' })}</p></div>}
        {/* 🏠 UYGA VAZIFA — amaliy topshiriq kompilyatorda bajariladi. Mentor proyektorida
            KO'RSATILMAYDI: uy ishi shaxsiy (sahna ↔ daftar tamoyili). */}
        {!isMentorL && onHomework && (
          <div className="hw-big-wrap fade-up d4">
            <button className="hw-big" onClick={onHomework}>
              <span className="hw-big-shine" aria-hidden="true" />
              <span className="hw-big-t">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span>
              <span className="hw-big-s">{tr({ uz: 'Amaliy topshiriqni boshlash →', ru: 'Начать практическое задание →' })}</span>
            </button>
          </div>
        )}
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

// ===== ScreenFlashcards — Quizlet-uslub takrorlash (glossary → kartalar) =====
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 'sflash', text: `O'zingizni sinab ko'ring. Har kartada bir savol — javobini o'ylang, keyin kartani bosing.`, trigger: 'on_mount', waits_for: null }]);
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={HTML_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};



// backtick chiplar: `<h1>` matn ichida chip bo'lib chiqadi (test/arena savollarida)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split(/(`[^`]+`)/g).map((p, i) => (p.startsWith('`') && p.endsWith('`') ? <code key={i} className="qcode">{p.slice(1, -1)}</code> : p))
  : s;


// ============================================================
// ⚡ JONLI DARS (live) — Kahoot uslubida: PIN, mentor, o'quvchilar, jonli test.
// InternetLesson/Htmllesson1 bilan bir xil infra. O'chirish: LIVE_SUPABASE_URL='' .
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
// F-0801-01 (102-qonun): ochiq praktika-oynasi ham saqlanadi — Chrome fon-tabni bo'shatib
// sahifani qayta yuklasa, o'quvchi praktika ICHIGA qaytadi, ortidagi darsga emas.
const _pracKey = (id) => `ccPractice:${id}`;
const pracRead = (id) => { try { const v = JSON.parse(localStorage.getItem(_pracKey(id)) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const pracWrite = (id, o) => { try { localStorage.setItem(_pracKey(id), JSON.stringify(o)); } catch {} };
const pracClear = (id) => { try { localStorage.removeItem(_pracKey(id)); } catch {} };
// Kod-saqlov kaliti: har praktika o'z kaliti bilan (bir darsda bir necha praktika bor)
// (kodni o'qish/yozishning o'zi endi kompilyator modulida — dars faqat kalitni beradi)
const codeKeyOf = (id, kind) => `ccCode:${id}:${kind}`;
// Nickname — qurilma bo'ylab BITTA (darsga bog'lanmagan kalit)
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
      // Javob kalitini serverga avto-yuklash (mentor-kod bilan) — server-baholash uchun SHART.
      // Busiz server javoblarni kalitsiz baholaydi va hammasini «xato» deb hisoblaydi (podium 0/5).
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

  // O'quvchi javobini serverga yozish — birinchi javob qotadi (server unique). Tarmoq uzilsa 3 martagacha qayta uriniladi.
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

  // Kahoot-reveal (faqat mentor): «Natijani ochish» — to'g'ri javob barcha o'quvchilar ekranida ham birdan ochiladi
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
      <button onClick={onClose} style={{ marginTop: 'clamp(22px,4vw,40px)', background: LT.accent, color: '#fff', border: 'none', borderRadius: 14, padding: 'clamp(12px,1.6vw,16px) clamp(24px,3vw,36px)', fontSize: 'clamp(15px,1.8vw,18px)', fontWeight: 700, cursor: 'pointer' }}>{tr({ uz: 'Darsni boshlash', ru: 'Начать урок' })} →</button>
    </div>
  );
}

function LiveGate({ live, title = { uz: 'Jonli dars', ru: 'Живой урок' } }) {
  const [code, setCode] = useState('');
  const [nick, setNick] = useState(() => nickRead());
  const [mentorCode, setMentorCode] = useState('');
  const [role, setRole] = useState('student');
  const cardS = { position: 'relative', width: '100%', maxWidth: 420, background: LT.paper, borderRadius: 20, padding: 'clamp(24px,4vw,36px)', boxShadow: '0 10px 40px -12px rgba(58,53,48,0.22)', display: 'flex', flexDirection: 'column', gap: 18 };
  const wrap = { minHeight: 'calc(100dvh / var(--lz, 1))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 };
  const link = { background: 'none', border: 'none', color: LT.ink3, fontSize: 13, cursor: 'pointer', alignSelf: 'center' };
  if (role === 'mentor') {
    return (<div style={wrap}><div style={cardS}>
      <div style={{ textAlign: 'center' }}><h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,28px)', color: LT.ink, margin: '0 0 4px' }}>🧑‍🏫 {tr({ uz: 'Mentor kirishi', ru: 'Вход для ментора' })}</h2><p style={{ color: LT.ink2, fontSize: 14, margin: 0 }}>{tr({ uz: 'Mentor kodini kiriting.', ru: 'Введите код ментора.' })}</p></div>
      <input value={mentorCode} onChange={e => setMentorCode(e.target.value)} type="password" autoFocus placeholder={tr({ uz: 'Mentor kodi', ru: 'Код ментора' })} onKeyDown={e => { if (e.key === 'Enter') live.startMentor(mentorCode); }} style={{ width: '100%', padding: '14px', border: `2px solid ${LT.ink3}55`, borderRadius: 14, fontSize: 18, fontWeight: 600, textAlign: 'center', outline: 'none' }} />
      <button onClick={() => live.startMentor(mentorCode)} disabled={live.busy} style={_liveBtnPri}>{live.busy ? tr({ uz: 'Tekshirilmoqda…', ru: 'Проверяем…' }) : tr({ uz: 'Kirish →', ru: 'Войти →' })}</button>
      {live.joinError && <div style={{ color: LT.accent, fontSize: 13, textAlign: 'center' }}>{live.joinError}</div>}
      <button onClick={() => { setRole('student'); setMentorCode(''); }} style={link}>← {tr({ uz: 'Orqaga', ru: 'Назад' })}</button>
    </div></div>);
  }
  return (<div style={wrap}><div style={cardS}>
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
  // Katta PIN ekrani AVTOMATIK ochilmaydi — mentor «📺 Ko'rsatish» bosadi.
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

// ===== 📖 QAYTA TUSHUNTIRISH (recap) — har scored test uchun 3 karta (mentor «Qayta tushuntirish» bosganda) =====
const RECAPS = {
  // idx 4 — s4: «Eng katta, asosiy sarlavha qaysi teg?» (portfolio: ismingiz)
  4: {
    title: { uz: 'Sarlavhalar: h1 va boshqalar', ru: 'Заголовки: h1 и другие' }, cards: [
      { ic: '🔤', h: { uz: 'h1 — eng katta sarlavha', ru: 'h1 — самый большой заголовок' },
        body: { uz: <>Portfolioingizda ismingiz eng katta, eng muhim sarlavha — <b className="mono">&lt;h1&gt;</b> ichiga yoziladi. Bir sahifada faqat <b>bitta</b> <b className="mono">&lt;h1&gt;</b> bo'ladi.</>, ru: <>В вашем портфолио имя — самый большой и главный заголовок, он пишется внутри <b className="mono">&lt;h1&gt;</b>. На странице бывает только <b>один</b> <b className="mono">&lt;h1&gt;</b>.</> },
        ask: { uz: 'Sizning portfolioingizda h1 ichiga nima yoziladi?', ru: 'Что пишется внутри h1 в вашем портфолио?' } },
      { ic: '📉', h: { uz: 'h2, h3 — kichikroq sarlavhalar', ru: 'h2, h3 — заголовки поменьше' },
        body: { uz: <>Sarlavhalar <b>bosqichma-bosqich</b> kichrayadi: <b className="mono">&lt;h1&gt;</b> eng katta, keyin <b className="mono">&lt;h2&gt;</b>, <b className="mono">&lt;h3&gt;</b> … <b className="mono">&lt;h6&gt;</b> eng kichik. Bo'lim sarlavhalari (Men haqimda, Loyihalar) — <b className="mono">&lt;h2&gt;</b>.</>, ru: <>Заголовки уменьшаются <b>ступенями</b>: <b className="mono">&lt;h1&gt;</b> самый большой, затем <b className="mono">&lt;h2&gt;</b>, <b className="mono">&lt;h3&gt;</b> … <b className="mono">&lt;h6&gt;</b> самый маленький. Заголовки разделов (Обо мне, Проекты) — <b className="mono">&lt;h2&gt;</b>.</> } },
      { ic: '📰', h: { uz: 'p — oddiy matn', ru: 'p — обычный текст' },
        body: { uz: <><b className="mono">&lt;p&gt;</b> — sarlavha emas, <b>oddiy matn</b> (paragraf). Kasbingiz va tanishtiruv matni shu tegga yoziladi.</>, ru: <><b className="mono">&lt;p&gt;</b> — не заголовок, а <b>обычный текст</b> (абзац). Ваша профессия и текст-представление пишутся этим тегом.</> },
        ask: { uz: "Kasbingiz qaysi tegga yoziladi — h1'gami yoki p'gami?", ru: 'Каким тегом пишется ваша профессия — h1 или p?' } },
    ]
  },
  // idx 6 — s6: «Bosiladigan havola qaysi teg?» (portfolio: menyu, aloqa)
  6: {
    title: { uz: 'Havolalar: a tegi', ru: 'Ссылки: тег a' }, cards: [
      { ic: '🔗', h: { uz: 'a — bosiladigan havola', ru: 'a — кликабельная ссылка' },
        body: { uz: <><b className="mono">&lt;a&gt;</b> (anchor) — bosilganda boshqa joyga <b>olib boradigan</b> havola. Menyu va aloqa havolalari shu teg bilan yasaladi.</>, ru: <><b className="mono">&lt;a&gt;</b> (anchor) — ссылка, которая при клике <b>ведёт</b> в другое место. Меню и контактные ссылки делаются этим тегом.</> } },
      { ic: '🧭', h: { uz: 'href — qayerga olib boradi', ru: 'href — куда ведёт' },
        body: { uz: <>Havola qayerga o'tishini <b className="mono">href</b> atributi ko'rsatadi: <b className="mono">&lt;a href="#about"&gt;</b> — «Men haqimda» bo'limiga olib boradi.</>, ru: <>Куда перейдёт ссылка, указывает атрибут <b className="mono">href</b>: <b className="mono">&lt;a href="#about"&gt;</b> — ведёт к разделу «Обо мне».</> } },
      { ic: '📂', h: { uz: 'nav — menyu idishi', ru: 'nav — контейнер меню' },
        body: { uz: <><b className="mono">&lt;nav&gt;</b> — menyuni <b>o'rab turadigan idish</b>. Ichida bir nechta <b className="mono">&lt;a&gt;</b> havola bo'ladi.</>, ru: <><b className="mono">&lt;nav&gt;</b> — контейнер, <b>оборачивающий меню</b>. Внутри несколько ссылок <b className="mono">&lt;a&gt;</b>.</> },
        ask: { uz: "Menyudagi har bir havola qaysi teg bilan yoziladi?", ru: 'Каким тегом пишется каждая ссылка в меню?' } },
    ]
  },
  // idx 8 — s8: «Rasm o'rniga matn ko'rsatadigan atribut?» (portfolio: Men haqimda rasmi)
  8: {
    title: { uz: 'Rasmlar: img, src, alt', ru: 'Картинки: img, src, alt' }, cards: [
      { ic: '🖼️', h: { uz: "img — rasm qo'yish", ru: 'img — вставить картинку' },
        body: { uz: <><b className="mono">&lt;img&gt;</b> — sahifaga rasm qo'yadi. Bu <b>bo'sh teg</b>: yopuvchi jufti yo'q, atributlar bilan ishlaydi.</>, ru: <><b className="mono">&lt;img&gt;</b> — вставляет картинку на страницу. Это <b>пустой тег</b>: у него нет закрывающей пары, он работает с атрибутами.</> } },
      { ic: '📍', h: { uz: 'src — rasm manzili', ru: 'src — адрес картинки' },
        body: { uz: <><b className="mono">src</b> (source) — brauzerga <b>qaysi faylni</b> ko'rsatishni aytadi: <b className="mono">&lt;img src="men.jpg"&gt;</b>.</>, ru: <><b className="mono">src</b> (source) говорит браузеру, <b>какой файл</b> показать: <b className="mono">&lt;img src="men.jpg"&gt;</b>.</> } },
      { ic: '💬', h: { uz: "alt — o'rniga chiqadigan matn", ru: 'alt — текст вместо картинки' },
        body: { uz: <><b className="mono">alt</b> — rasm <b>yuklanmasa</b>, o'rniga chiqadigan matn. Ko'rish imkoni cheklanganlar uchun ham muhim: ekran o'qigich shu matnni o'qiydi.</>, ru: <><b className="mono">alt</b> — текст, который появится, если картинка <b>не загрузилась</b>. Важен и для людей с нарушением зрения: скринридер читает именно его.</> },
        ask: { uz: "Rasm chiqmay qolsa, foydalanuvchi nimani ko'radi?", ru: 'Что увидит пользователь, если картинка не показалась?' } },
    ]
  },
  // idx 10 — s10: «Tartibsiz (nuqtali) ro'yxat qaysi teg?» (portfolio: loyihalar)
  10: {
    title: { uz: "Ro'yxatlar: ul, ol, li", ru: 'Списки: ul, ol, li' }, cards: [
      { ic: '•', h: { uz: "ul — nuqtali ro'yxat", ru: 'ul — маркированный список' },
        body: { uz: <><b className="mono">&lt;ul&gt;</b> (unordered list) — <b>tartibsiz</b>, nuqtali ro'yxat. Loyihalaringiz ro'yxati shu teg bilan yasaladi.</>, ru: <><b className="mono">&lt;ul&gt;</b> (unordered list) — <b>неупорядоченный</b> список с точками. Список ваших проектов делается этим тегом.</> } },
      { ic: '🔢', h: { uz: "ol — raqamli ro'yxat", ru: 'ol — нумерованный список' },
        body: { uz: <><b className="mono">&lt;ol&gt;</b> (ordered list) — <b>raqamli</b>, tartibli ro'yxat. Tartib muhim bo'lgan joylarda ishlatiladi.</>, ru: <><b className="mono">&lt;ol&gt;</b> (ordered list) — <b>нумерованный</b>, упорядоченный список. Используется там, где важен порядок.</> } },
      { ic: '📄', h: { uz: 'li — bitta band', ru: 'li — один пункт' },
        body: { uz: <><b className="mono">&lt;li&gt;</b> (list item) — ro'yxatning <b>bitta bandi</b>. Har bir loyiha alohida <b className="mono">&lt;li&gt;</b> bo'ladi, hammasi <b className="mono">&lt;ul&gt;</b> ichida.</>, ru: <><b className="mono">&lt;li&gt;</b> (list item) — <b>один пункт</b> списка. Каждый проект — отдельный <b className="mono">&lt;li&gt;</b>, и все внутри <b className="mono">&lt;ul&gt;</b>.</> },
        ask: { uz: 'Uchta loyiha bo\'lsa, nechta li kerak bo\'ladi?', ru: 'Если проектов три, сколько нужно li?' } },
    ]
  },
  // idx 13 — s13: «Sahifaning eng pastki qismi qaysi teg?» (portfolio: footer)
  13: {
    title: { uz: 'Sahifa qismlari: header va footer', ru: 'Части страницы: header и footer' }, cards: [
      { ic: '🔝', h: { uz: 'header — yuqori qism', ru: 'header — верхняя часть' },
        body: { uz: <><b className="mono">&lt;header&gt;</b> — sahifaning eng <b>yuqori</b> qismi: ism, kasb va menyu shu yerda turadi.</>, ru: <><b className="mono">&lt;header&gt;</b> — самая <b>верхняя</b> часть страницы: имя, профессия и меню живут здесь.</> } },
      { ic: '🔻', h: { uz: 'footer — pastki qism', ru: 'footer — нижняя часть' },
        body: { uz: <><b className="mono">&lt;footer&gt;</b> — sahifaning eng <b>pastki</b> qismi: mualliflik, yil, aloqa. Nomi ham «oyoq» (foot) degani.</>, ru: <><b className="mono">&lt;footer&gt;</b> — самая <b>нижняя</b> часть страницы: авторство, год, контакты. Название и значит «нога» (foot).</> } },
      { ic: '🧱', h: { uz: 'section — alohida bo\'lim', ru: 'section — отдельный раздел' },
        body: { uz: <><b className="mono">&lt;section&gt;</b> — sahifadagi <b>alohida bo'lim</b>: «Men haqimda», «Aloqa» kabi qismlar shunday yasaladi.</>, ru: <><b className="mono">&lt;section&gt;</b> — <b>отдельный раздел</b> страницы: части вроде «Обо мне», «Контакты» делаются так.</> },
        ask: { uz: 'Sahifaning eng pastida qaysi teg turadi?', ru: 'Какой тег стоит в самом низу страницы?' } },
    ]
  },
  // idx 16 — s16: «Bo'limlar to'g'ri tartibi qaysi?» (portfolio: butun sahifa)
  16: {
    title: { uz: 'Sahifa tartibi (yuqoridan pastga)', ru: 'Порядок страницы (сверху вниз)' }, cards: [
      { ic: '📐', h: { uz: 'Header — birinchi', ru: 'Header — первый' },
        body: { uz: <>Sahifa <b>yuqoridan</b> boshlanadi: eng tepada <b className="mono">&lt;header&gt;</b> — ism, kasb va menyu.</>, ru: <>Страница начинается <b>сверху</b>: в самом верху <b className="mono">&lt;header&gt;</b> — имя, профессия и меню.</> } },
      { ic: '📚', h: { uz: "Bo'limlar — o'rtada", ru: 'Разделы — посередине' },
        body: { uz: <>Header'dan keyin <b>bo'limlar</b> keladi: «Men haqimda» → «Loyihalar» → «Aloqa». Har biri alohida <b className="mono">&lt;section&gt;</b>.</>, ru: <>После header идут <b>разделы</b>: «Обо мне» → «Проекты» → «Контакты». Каждый — отдельный <b className="mono">&lt;section&gt;</b>.</> } },
      { ic: '🏁', h: { uz: 'Footer — oxirgi', ru: 'Footer — последний' },
        body: { uz: <>Eng <b>pastda</b> — <b className="mono">&lt;footer&gt;</b>. Demak tartib: header → bo'limlar → footer.</>, ru: <>В самом <b>низу</b> — <b className="mono">&lt;footer&gt;</b>. Значит порядок: header → разделы → footer.</> },
        ask: { uz: 'Butun portfolioingizni yuqoridan pastga aytib bering.', ru: 'Назовите всё своё портфолио сверху вниз.' } },
    ]
  },
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
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← {tr({ uz: 'Oldingi', ru: 'Предыдущая' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-karta`, ru: `карточка ${k + 1}` })} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>✓ {tr({ uz: 'Tushunarli — davom etamiz', ru: 'Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi', ru: 'Дальше' })} →</button>}
      </div>
    </div>
  );
}
// ===== MENTOR STATISTIKASI (jonli test paneli — picked===correctIdx) =====
const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60, RECAP_GOOD_PCT = 75, RECAP_MIN_ANSWERS = 3;
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
  // «To'g'ri» sanog'i ustunlar bilan BIR XIL mantiqdan (picked === correctIdx) — serverdagi eskirgan a.correct'ga tayanmaymiz.
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
        <p className="mstats-hidden">🙈 {tr({ uz: "Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: 'Кто что выбрал и число ✅/❌ скрыто — по кнопке «Открыть результат» всё появится одновременно и у вас, и на экранах учеников.' })}</p>
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
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? tr({ uz: `${n} o'quvchi · ${pct}%`, ru: `${n} уч. · ${pct}%` }) : '—'}</span>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlash tavsiya etiladi.</>, ru: <>⚠️ Только <b>{pct}%</b> верных — тема осталась непонятной классу. Перед продолжением рекомендуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верных — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верных — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по проценту судить сложно. Оцените сами:</> })}</p>
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
      {reveal && struggling && <p className="mstats-warn">⚠️ {tr({ uz: "Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntirish tavsiya etiladi.", ru: 'Большинство ошиблись — похоже, тема осталась непонятной. Рекомендуем объяснить ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в реальном времени…' })}</p>}
    </div>
  );
}

function MentorPracticeOverlay({ entry, live, onClose }) {
  const uiLang = useLang(); // kompilyator modulga til propi bilan uzatiladi
  const [view, setView] = useState('watch'); // 'watch' | 'demo'
  const [data, setData] = useState({ players: null, rows: [] });
  const doneIdx = PRACTICE_DONE_BASE + entry.fromScreen;
  useEffect(() => {
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, doneIdx)]);
        if (on) setData({ players, rows });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live.pin, doneIdx]);

  if (view === 'demo') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg }}>
        <HtmlCompiler task={entry.task} starterCode={entry.starter} lang={uiLang} onContinue={() => setView('watch')} onBack={() => setView('watch')} />
      </div>
    );
  }

  const total = data.players ? data.players.length : 0;
  const doneN = data.rows.length;
  const allIn = total > 0 && doneN >= total;
  const doneIds = new Set(data.rows.map(r => r.player_id));
  return (
    <div className="mp-overlay">
      <div className="mp-card">
        <div className="mp-eyebrow">✍️ {tr({ uz: 'Amaliyot · jonli', ru: 'Практика · live' })}</div>
        <h2 className="mp-title">{tr(entry.task.title)}</h2>
        <p className="mp-brief">{tr(entry.task.brief)}</p>
        <div className="mp-flow">
          <span className="mp-step cur">1 · {tr({ uz: "O'quvchilar o'z qurilmasida yozmoqda", ru: 'Ученики пишут на своих устройствах' })}</span>
          <span className="mp-arr">→</span>
          <span className="mp-step">2 · {tr({ uz: "Mentor doskada yozib ko'rsatadi", ru: 'Ментор показывает решение на доске' })}</span>
        </div>
        {data.players === null ? (
          <p className="mstats-wait">{tr({ uz: 'Ulanish…', ru: 'Подключение…' })}</p>
        ) : (
          <div className="mstats" style={{ marginTop: 2 }}>
            <div className="mstats-head">
              <span className="mstats-lbl">👨‍🎓 {tr({ uz: 'Praktikani tugatdi', ru: 'Закончили практику' })}</span>
              <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma tugatdi!', ru: '✓ Все закончили!' }) : <>{tr({ uz: 'Tugatdi:', ru: 'Закончили:' })} <b>{doneN}</b> / {total}</>}</span>
            </div>
            <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((doneN / total) * 100) : 0}%` }} /></div>
            {total > 0 && (
              <div className="mstats-waitrow" style={{ marginTop: 10 }}>
                {data.players.map(p => <span key={p.id} className="mstats-wait-chip" style={doneIds.has(p.id) ? { background: T.successSoft, color: T.success, fontWeight: 700 } : undefined}>{doneIds.has(p.id) ? '✓ ' : '✏️ '}{p.nickname}</span>)}
              </div>
            )}
            {total === 0 && <p className="mstats-wait">{tr({ uz: "Hali o'quvchi qo'shilmagan — ular praktikani boshlashi bilan bu yerda ✓ chiqadi…", ru: 'Ученики ещё не подключились — как только они начнут практику, здесь появится ✓…' })}</p>}
          </div>
        )}
        <div className="mp-actions">
          <button className="mp-demo" onClick={() => setView('demo')}>🖊 {tr({ uz: "Doskada yozib ko'rsatish", ru: 'Показать решение на доске' })}</button>
          <button className="mp-next" onClick={onClose}>{tr({ uz: 'Keyingi mavzuga', ru: 'К следующей теме' })} →</button>
        </div>
        <p className="mp-tip">💡 {tr({ uz: "Ko'pchilik tugatgach, aynan shu mashqni doskada birga yozing — shunda o'quvchilar o'zini tekshiradi va mavzu mustahkamlanadi.", ru: 'Когда закончит большинство, напишите это же упражнение вместе на доске — так ученики проверят себя, а тема закрепится.' })}</p>
      </div>
    </div>
  );
}


// Portfolio skeletini o'quvchi o'zi to'g'ri tartibda yig'adi (DragDropOrder uchun)
const SKELET_PIECES = [
  { id: 'header',   label: { uz: '<header> — sarlavha (ism, kasb)', ru: '<header> — шапка (имя, профессия)' } },
  { id: 'about',    label: { uz: '<section> — Men haqimda', ru: '<section> — Обо мне' } },
  { id: 'projects', label: { uz: '<section> — Loyihalar', ru: '<section> — Проекты' } },
  { id: 'contact',  label: { uz: '<section> — Aloqa', ru: '<section> — Контакты' } },
  { id: 'footer',   label: { uz: '<footer> — pastki qism', ru: '<footer> — нижняя часть' } },
];

function DragDropOrder({ items, hints, onSolved }) {
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
  // Sudrash — asl chip elementini DOM transform bilan suramiz (state yo'q → pirillamaydi;
  // transform lokal → `position:fixed` muammosi yo'q, ekran pastida chiqmaydi).
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
      else { el.style.transition = 'transform .2s cubic-bezier(.34,1.3,.4,1)'; el.style.transform = ''; setTimeout(() => finish(el), 210); } // pool'ga qaytadi
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  return (
    <div className="dd fade-up">
      <div className="dd-slots">
        {slots.map((sid, i) => (
          <div key={i} ref={el => (slotRefs.current[i] = el)} className={`dd-slot ${sid ? 'filled' : ''} ${solved && sid ? 'ok' : ''} ${wrong && sid && sid !== order[i] ? 'bad' : ''}`}>
            <span className="dd-slotn">{i + 1}</span>
            {sid ? <button className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr(byId[sid].label)}</button> : <span className="dd-hint">{hints ? tr(hints[i]) : tr({ uz: 'bu yerga joylang', ru: 'поместите сюда' })}</span>}
          </div>
        ))}
      </div>
      <div className="dd-pool">
        {pool.length === 0 && !solved && <span className="dd-pool-empty">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang", ru: 'Порядок неверный — нажмите на блок, верните его и расставьте заново' })}</span>}
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>
      {solved && <div className="dd-done">✓ {tr({ uz: "To'g'ri! Skelet aynan shu tartibda.", ru: 'Верно! Скелет именно в таком порядке.' })}</div>}
      {wrong && !solved && <div className="dd-wrong">⚠️ {tr({ uz: 'Tartib xato — qayta joylang.', ru: 'Порядок неверный — расставьте заново.' })}</div>}
    </div>
  );
}

// 🐞 Qayta ishlatiladigan DEBUG CHALLENGE — buzuq koddan xato qatorni topib bosish → tuzatiladi.
// Boshqa darsga: `lines` (bittasida bug:true), `fixed` (to'g'ri qator), `explain` almashtiriladi.
function DebugChallenge({ lines, fixed, explain, onSolved }) {
  const bugIdx = lines.findIndex(l => l.bug);
  const [picked, setPicked] = useState(-1);
  const [wrongIdx, setWrongIdx] = useState(-1);
  const solved = picked === bugIdx;
  useEffect(() => { if (solved) onSolved && onSolved(); }, [solved]); // eslint-disable-line
  const click = (i) => {
    if (solved) return;
    if (i === bugIdx) setPicked(i);
    else { setWrongIdx(i); setTimeout(() => setWrongIdx(w => (w === i ? -1 : w)), 500); }
  };
  return (
    <div className="dbg fade-up">
      <div className="dbg-code">
        {lines.map((l, i) => (
          <div key={i} className={`dbg-line ${solved && i === bugIdx ? 'fixed' : ''} ${wrongIdx === i ? 'wrong' : ''}`} onClick={() => click(i)}>
            <span className="dbg-ln">{i + 1}</span>
            <span className="dbg-txt">{solved && i === bugIdx ? tr(fixed) : tr(l.text)}</span>
            {solved && i === bugIdx && <span className="dbg-badge">✓ {tr({ uz: 'tuzatildi', ru: 'исправлено' })}</span>}
          </div>
        ))}
      </div>
      {!solved
        ? <p className="dbg-hint">👆 {tr({ uz: 'Xato bor qatorni toping va bosing', ru: 'Найдите строку с ошибкой и нажмите на неё' })}</p>
        : <div className="dbg-ok">✓ {tr({ uz: 'Topdingiz!', ru: 'Нашли!' })} {tr(explain)}</div>}
    </div>
  );
}

// 🃏 Qayta ishlatiladigan FLASHCARDS — aktiv takrorlash (3D flip + o'z-o'zini baholash + spaced recall).
// Boshqa darsga: faqat `cards` ({ front, back, note }) almashtiriladi.
const HTML_FLASHCARDS = [
  { front: { uz: 'Ism, kasb va menyu sahifaning qaysi qismida turadi?', ru: 'В какой части страницы стоят имя, профессия и меню?' }, back: '<header>', note: { uz: 'sahifaning eng yuqori qismi', ru: 'самая верхняя часть страницы' } },
  { front: { uz: 'Menyu havolalarini qaysi teg bir joyga yig\'adi?', ru: 'Какой тег собирает ссылки меню в одно место?' }, back: '<nav>', note: { uz: 'ichida bir nechta <a> havola turadi', ru: 'внутри стоят несколько ссылок <a>' } },
  { front: { uz: 'Portfolioda ismingizni qaysi teg bilan yozasiz?', ru: 'Каким тегом вы пишете своё имя в портфолио?' }, back: '<h1>', note: { uz: 'sahifada bitta bo\'ladi; bo\'lim sarlavhasi — <h2>', ru: 'на странице он один; заголовок раздела — <h2>' } },
  { front: { uz: 'Kasbingiz va tanishtiruv matni qaysi teg ichiga yoziladi?', ru: 'В какой тег пишется профессия и текст-представление?' }, back: '<p>', note: { uz: 'p — oddiy matn (paragraf), sarlavha emas', ru: 'p — обычный текст (абзац), не заголовок' } },
  { front: { uz: '«Loyihalar» kabi alohida bo\'limni qaysi teg yasaydi?', ru: 'Какой тег делает отдельный раздел вроде «Проекты»?' }, back: '<section>', note: { uz: 'har bo\'lim uchun alohida section', ru: 'для каждого раздела свой section' } },
  { front: { uz: 'Sahifaga rasm qo\'yish uchun qaysi teg kerak?', ru: 'Какой тег нужен, чтобы вставить картинку на страницу?' }, back: '<img>', note: { uz: 'yopuvchi tegi yo\'q, src va alt bilan ishlaydi', ru: 'закрывающего тега нет, работает с src и alt' } },
  { front: { uz: 'Rasm faylining manzili qaysi atributga yoziladi?', ru: 'В какой атрибут пишется адрес файла картинки?' }, back: 'src', note: '<img src="men.jpg">' },
  { front: { uz: 'Rasm yuklanmasa, uning joyida qaysi atribut matni chiqadi?', ru: 'Текст какого атрибута появится, если картинка не загрузилась?' }, back: 'alt', note: { uz: 'shu matnni ekran o\'qigich dasturi ham o\'qib beradi', ru: 'этот текст читает и программа-скринридер' } },
  { front: { uz: 'Loyihalar ro\'yxatini qaysi teg boshlaydi?', ru: 'С какого тега начинается список проектов?' }, back: '<ul>', note: { uz: 'nuqtali ro\'yxat; raqamlisi — <ol>', ru: 'список с точками; нумерованный — <ol>' } },
  { front: { uz: 'Ro\'yxatning bitta bandi qaysi teg bilan yoziladi?', ru: 'Каким тегом пишется один пункт списка?' }, back: '<li>', note: { uz: 'har bir band <ul> ichida turadi', ru: 'каждый пункт стоит внутри <ul>' } },
  { front: { uz: 'Bosiladigan havolani qaysi teg yasaydi?', ru: 'Какой тег делает кликабельную ссылку?' }, back: '<a>', note: { uz: 'qayerga olib borishini href aytadi; xat uchun — mailto:', ru: 'куда ведёт — говорит href; для письма — mailto:' } },
  { front: { uz: 'Mualliflik va yil sahifaning qaysi qismiga yoziladi?', ru: 'В какую часть страницы пишутся авторство и год?' }, back: '<footer>', note: { uz: 'sahifaning eng pastki qismi', ru: 'самая нижняя часть страницы' } },
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'karta yodlandi', ru: 'карточек выучено' })}</p><button className="fc-btn ghost" onClick={restart}>↻ {tr({ uz: 'Qaytadan takrorlash', ru: 'Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Учу' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span><span className="fc-cue">{tr({ uz: "Javobni o'ylang", ru: 'Подумайте над ответом' })} 🤔 <span className="fc-tap">{tr({ uz: 'bosing', ru: 'нажмите' })}</span></span></div>
          <div className="fc-face fc-back">{fcAnswer(tr(card.back))}{card.note && <span className="fc-note">{tr(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>✗ {tr({ uz: 'Takrorlash', ru: 'Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })}</button></div>)
        : (<p className="fc-hint">👆 {tr({ uz: "Kartani bosing — javobni ko'rasiz", ru: 'Нажмите на карточку — увидите ответ' })}</p>)}
    </div>
  );
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


// ===== 🏅 ACHIEVEMENTS (nishonlar) — portfolio praktikasidagi real bosqichlar =====
const ACHIEVEMENTS = {
  built:    { icon: '🧲', name: 'Built It!',   desc: { uz: "Portfolio skeletini o'zingiz yig'dingiz", ru: 'Вы сами собрали скелет портфолио' } },
  coder:    { icon: '🏷️', name: 'Tag It!',     desc: { uz: "Birinchi kodni o'z qo'lingiz bilan yozdingiz", ru: 'Вы своими руками написали первый код' } },
  debugger: { icon: '🐞', name: 'Nice Catch!', desc: { uz: 'Buzuq kodni topib tuzatdingiz', ru: 'Вы нашли и исправили сломанный код' } },
  graduate: { icon: '🏆', name: 'Level Up!',   desc: { uz: 'Portfolio praktikasini yakunladingiz', ru: 'Вы завершили практику портфолио' } },
};
// Ekran id → nishon (recordAnswer'da faqat SCORED/challenge ekranda, data.correct bo'lsa beriladi)
const ACH_TRIGGERS = { s2: 'built', s14: 'debugger' };

// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI — yorqin nurlar, medal portlashi, uchqunlar, zarba to'lqini
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
// Navbatda bittasi ko'rsatiladi (to'liq-ekran bayram) — tugagach keyingisi chiqadi
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}


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

// ===== 🏆 «BUGUNGI G'OLIBLARIMIZ» — PODIUM / STATISTIKA SAHIFASI =====
// Etalon: CssLesson1.jsx ScreenPodium + PmUserStoryLesson (solo-ko'rinishda nishonlar).
// Jonli darsda — guruh reytingi (🥇🥈🥉); mustaqil o'qishda — shaxsiy natija + nishonlar.
// Podium yorliqlari (scored ekran indeksi -> qisqa mavzu nomi)
const PODIUM_LABELS = {
  4:  { uz: 'h1 — asosiy sarlavha',   ru: 'h1 — главный заголовок' },
  6:  { uz: 'a — havola',             ru: 'a — ссылка' },
  8:  { uz: 'alt — rasm matni',       ru: 'alt — текст картинки' },
  10: { uz: "ul — ro'yxat",           ru: 'ul — список' },
  13: { uz: 'footer — pastki qism',   ru: 'footer — нижняя часть' },
  16: { uz: "Bo'limlar tartibi (yakuniy)", ru: 'Порядок разделов (финал)' }
};

const ScreenPodium = ({ screen, answers, achievements, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const isMentorL = !!(live && live.mode === 'mentor');
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
  // FAQAT baholanadigan testlar hisoblanadi — praktika «tugatdi» signali (500+) reytingga aralashmaydi
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
  const achN = achievements ? achievements.size : 0;
  const achTotal = Object.keys(ACHIEVEMENTS).length;

  // 🏅 Nishonlar bloki — mentor proyektorida ko'rsatilmaydi (u sinf ekrani, shaxsiy natija emas)
  const Badges = () => (
    <div className="card ach-coll fade-up d2">
      <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: 'Nishonlaringiz', ru: 'Ваши значки' })} — {achN}/{achTotal}</div>
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
  );

  return (
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{isLive
          ? tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>g'oliblarimiz</span></>, ru: <>Наши <span className="italic" style={{ color: T.accent }}>победители</span> сегодня</> })
          : tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш <span className="italic" style={{ color: T.accent }}>результат</span> сегодня</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div style={{ width: '100%' }}><Badges /></div>
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верных)</> })}</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>🏆 {tr({ uz: "To'liq reyting", ru: 'Полный рейтинг' })}</div>
              <div className="pod-list">
                {board.map((b, i) => (
                  <div key={b.id} className={`pod-row ${live.playerId === b.id ? 'me' : ''}`}>
                    <span className="mono pod-rank">{i + 1}</span>
                    <span className="pod-row-name">{b.nickname}</span>
                    <span className="pod-row-dots">{SCORED_IDX.map(q => { const a = rows.find(r => r.player_id === b.id && r.screen_idx === q); return <span key={q} className={`pod-dot ${a ? (a.correct ? 'ok' : 'bad') : ''}`} title={tr(PODIUM_LABELS[q])} />; })}</span>
                    <span className="mono pod-row-score">{b.okCount}/{totalQ}</span>
                    <span className="mono pod-row-time">{fmtT(b.time)}</span>
                  </div>
                ))}
              </div>
            </div>
            {!isMentorL && <Badges />}
            {/* Savollar bo'yicha — qaysi mavzu qiyin bo'ldi */}
            <div className="card fade-up d3">
              <div className="card-lbl" style={{ color: T.blue }}>📊 {tr({ uz: "Savollar bo'yicha", ru: 'По вопросам' })}</div>
              <div className="pod-qstats">
                {SCORED_IDX.map(q => {
                  const qa = rows.filter(r => r.screen_idx === q);
                  const okN = qa.filter(r => r.correct).length;
                  const pct = qa.length ? Math.round((okN / qa.length) * 100) : 0;
                  const hard = qa.length >= 2 && pct < 50;
                  return (
                    <div key={q} className="qstat-row">
                      <span className="qstat-lbl">{PODIUM_LABELS[q] ? tr(PODIUM_LABELS[q]) : `#${q}`}{hard && ' ⚠️'}</span>
                      <span className="mstats-track"><span className="mstats-fill" style={{ width: `${pct}%`, background: hard ? T.accent : T.success }} /></span>
                      <span className="mono qstat-n">{okN}/{qa.length}</span>
                    </div>
                  );
                })}
              </div>
              {isMentorL && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntirish tavsiya etiladi.', ru: 'Вопросы со значком ⚠️ — темы, где класс споткнулся. Рекомендуем объяснить их ещё раз.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// Inline testlar javob kaliti (kalit = SCREEN_META id; qiymat = to'g'ri variant indeksi).
// Mentor darsni ochganda set_quiz_keys orqali serverga avto-yuklanadi (SQL shart emas).
// HAR biri QuestionScreen'ga uzatilgan correctIdx BILAN AYNAN mos bo'lishi shart (2.4 ↔ server-baholash).
const INLINE_KEYS = { s4: 1, s6: 3, s8: 2, s10: 1, s13: 3, s16: 2 };

const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi kod tokenlari (kodlash maktabi hissi)
// Fon tokenlari — DARS MAVZUSIDAN (portfolio strukturasi): semantik teglar + havola.
const QZ_BG_SHAPES = [
  { ch: '<header>',  l: 6,  t: 18, s: 30, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: '<section>', l: 82, t: 12, s: 26, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: '<img>',     l: 9,  t: 74, s: 30, c: 'rgba(255,110,70,0.15)',  d: 27, dl: 0.8 },
  { ch: '<footer>',  l: 76, t: 70, s: 26, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: '<nav>',     l: 46, t: 86, s: 28, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: 'href',      l: 66, t: 24, s: 22, c: 'rgba(80,200,255,0.14)',  d: 17, dl: 0.4 },
  { ch: 'mailto:',   l: 22, t: 36, s: 22, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: '<a>',       l: 92, t: 46, s: 24, c: 'rgba(120,235,175,0.13)', d: 24, dl: 1.3 },
  { ch: '<ul>',      l: 2,  t: 46, s: 24, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: "Portfolioda `</footer>` kabi yopuvchi teg qaysi belgi bilan boshlanadi?", ru: 'С какого символа начинается закрывающий тег вроде `</footer>` в портфолио?' }, opts: ["`\\`", "`!`", "`#`", "`/`"], correct: 3 },
  { q: { uz: "Sarlavha teglari orasida eng KICHIGI qaysi?", ru: 'Какой из тегов заголовков — самый МАЛЕНЬКИЙ?' }, opts: ["`h1`", "`h3`", "`h6`", "`p`"], correct: 2 },
  { q: { uz: "Loyihalar ro'yxatini (nuqtali) qaysi teg boshlaydi?", ru: 'Какой тег начинает список проектов (с точками)?' }, opts: ["`ul`", "`ol`", "`li`", "`a`"], correct: 0 },
  { q: { uz: "Loyihalar ro'yxatida har bir loyiha qaysi tegga o'raladi?", ru: 'В какой тег оборачивается каждый проект в списке?' }, opts: ["`ul`", "`li`", "`ol`", "`dd`"], correct: 1 },
  { q: { uz: "Aloqa havolasida manzil qaysi atributga yoziladi?", ru: 'В какой атрибут пишется адрес в контактной ссылке?' }, opts: ["`src`", "`link`", "`href`", "`url`"], correct: 2 },
  { q: { uz: "Sahifa `title` ichidagi matn qayerda ko'rinadi?", ru: 'Где виден текст из `title` страницы?' }, opts: [{ uz: "Sahifaning o'rtasida", ru: 'В центре страницы' }, { uz: "Brauzer yorlig'ida", ru: 'На вкладке браузера' }, { uz: 'Tugmaning ustida', ru: 'На кнопке' }, { uz: "Hech qayerda ko'rinmaydi", ru: 'Нигде не виден' }], correct: 1 },
  { q: { uz: "Ko'rinmaydigan sozlamalar (`title`, `meta`) qaysi qismga yoziladi?", ru: 'В какую часть пишутся невидимые настройки (`title`, `meta`)?' }, opts: ["`body`", "`p`", "`head`", "`h1`"], correct: 2 },
  { q: { uz: "Ismingizni QALIN (bold) qilish uchun qaysi teg?", ru: 'Какой тег сделает ваше имя ЖИРНЫМ (bold)?' }, opts: ["`strong`", "`em`", "`p`", "`i`"], correct: 0 },
  { q: { uz: "`<!DOCTYPE html>` nimani bildiradi?", ru: 'Что означает `<!DOCTYPE html>`?' }, opts: [{ uz: 'Sahifaning fon rangini', ru: 'Цвет фона страницы' }, { uz: "Rasm qo'shilishini", ru: 'Добавление картинки' }, { uz: 'Sahifa tugaganini', ru: 'Конец страницы' }, { uz: 'HTML5 hujjat ekanini', ru: 'Что это документ HTML5' }], correct: 3 },
  { q: { uz: "Sahifa skeletining to'g'ri tartibi qaysi?", ru: 'Какой порядок скелета страницы верный?' }, opts: [{ uz: "`head` ichida `html` va `body`", ru: '`html` и `body` внутри `head`' }, { uz: "`body` ichida `head` va `html`", ru: '`head` и `html` внутри `body`' }, { uz: "`title` ichida `head`", ru: '`head` внутри `title`' }, { uz: "`html` ichida `head` va `body`", ru: '`head` и `body` внутри `html`' }], correct: 3 },
  { q: { uz: "Portfolio kodini o'qib, saytga aylantiradigan dastur qaysi?", ru: 'Какая программа читает код портфолио и превращает его в сайт?' }, opts: [{ uz: 'Server', ru: 'Сервер' }, { uz: 'Brauzer', ru: 'Браузер' }, 'Word', { uz: 'Fayl menejeri', ru: 'Файловый менеджер' }], correct: 1 },
  { q: { uz: "Kasbingizni QIYA (kursiv) qilish uchun qaysi teg?", ru: 'Какой тег сделает вашу профессию НАКЛОННОЙ (курсив)?' }, opts: ["`em`", "`ul`", "`a`", "`h1`"], correct: 0 },
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
          <span className="cs-hud-i">🏆 {tr({ uz: 'PODIUM', ru: 'ПОДИУМ' })}</span>
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
    const TOK = ['<h1>', '</ul>', '<a>', 'href', '{ }', '//', '<li>', ';'];
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
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закрыть, ученики останутся ждать в арене.\nПотом можно вернуться ровно к этому месту через «⚔️ Продолжить».\n\nВсё равно закрыть?' }))) return;
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
          <span>⚠️ {tr({ uz: "Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: 'Живой урок завершён — продолжите тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>📖 {tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме тренировки' })}</button>
        </div>
      )}

      {/* ===== LOBBY ===== */}
      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают 🔥 бонус!' })}</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>▶ {tr({ uz: 'Testni boshlash', ru: 'Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">⏳ {tr({ uz: 'Mentor testni boshlashini kuting…', ru: 'Ждите, пока ментор начнёт тест…' })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>▶ {tr({ uz: 'Boshlash', ru: 'Начать' })}</button>}
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
          {my && !isMentor && !solo && <p className="qz-waitmsg">✔ {tr({ uz: 'Javob qabul qilindi — natijani kuting…', ru: 'Ответ принят — ждите результат…' })}</p>}
          {isMentor && (
            <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">✓ {tr({ uz: 'Hamma javob berdi!', ru: 'Все ответили!' })}</span>}
              <button className="qz-btn" onClick={() => ctrl('r', qi)}>⏹ {tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Побыстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас: ${myRank + 1}-е место` })}</span>}
            </div>
          )}
          {!solo && (
            <div className="qz-board">
              <div className="qz-board-h">🏆 {tr({ uz: 'TOP-5', ru: 'ТОП-5' })}</div>
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
          <h2 className="qz-h" style={{ fontSize: 'clamp(20px,3.4vw,30px)' }}>{tr({ uz: 'Test yakunlandi!', ru: 'Тест завершён!' })} 🎉</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: `ball · ${soloScore.ok}/${QUIZ_BANK.length} to'g'ri${soloScore.maxStreak >= 2 ? ` · eng uzun streak 🔥x${soloScore.maxStreak}` : ''}`, ru: `баллов · ${soloScore.ok}/${QUIZ_BANK.length} верных${soloScore.maxStreak >= 2 ? ` · лучший стрик 🔥x${soloScore.maxStreak}` : ''}` })}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ {tr({ uz: 'Qayta ishlash', ru: 'Пройти ещё раз' })}</button>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ {tr({ uz: 'Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: 'Пройти тест ещё раз — тренировка (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}


// ============================================================
//  PRAKTIKA — KOD COMPILATOR (portfolio bo'limlari). AYNAN 3 topshiriq.
//  PRACTICE_AFTER[screenIdx] orqali shu ekrandan KEYIN ochiladi. Shartlar C.* (HAQIQIY DOM tahlili).
// ============================================================

// — P1: HEADER (Screen3 — header build — dan keyin) —
const TASK_HEADER = {
  eyebrow: { uz: 'Praktika · header', ru: 'Практика · header' },
  title: { uz: "O'z headeringizni yozing", ru: 'Напишите свой header' },
  brief: { uz: "Portfolio sarlavhasini o'zingiz yozing: ismingizni `<h1>` ichiga, kasbingizni `<p>` ichiga. To'g'ri bo'lsa \u201cDavom etish\u201d yonadi.", ru: 'Напишите шапку портфолио сами: имя — внутри `<h1>`, профессию — внутри `<p>`. Когда всё верно, загорится «Продолжить».' },
  requirements: [
    { id: 'h1', label: { uz: '<h1> — ismingiz', ru: '<h1> — ваше имя' }, check: C.text('h1', { uz: "`<h1>` ichiga ismingizni yozing", ru: 'Напишите своё имя внутри `<h1>`' }) },
    { id: 'p',  label: { uz: '<p> — kasbingiz', ru: '<p> — ваша профессия' }, check: C.text('p', { uz: "`<p>` ichiga kasbingizni yozing", ru: 'Напишите свою профессию внутри `<p>`' }) },
  ],
};
const STARTER_HEADER = `<!-- Bu yerga yozing -->
`;

// — P2: LOYIHALAR RO'YXATI (Screen9 — projects build — dan keyin) —
const TASK_LIST = {
  eyebrow: { uz: 'Praktika · loyihalar', ru: 'Практика · проекты' },
  title: { uz: "Loyihalar ro'yxatini yasang", ru: 'Сделайте список проектов' },
  brief: { uz: "Loyihalaringizni ro'yxat qilib yozing: `<ul>` ichida kamida 2 ta `<li>`.", ru: 'Оформите свои проекты списком: минимум 2 `<li>` внутри `<ul>`.' },
  requirements: [
    { id: 'ul', label: { uz: '<ul> — ro\'yxat', ru: '<ul> — список' }, check: C.has('ul', { uz: "`<ul>` ro'yxat tegini qo'shing", ru: 'Добавьте тег списка `<ul>`' }) },
    { id: 'li', label: { uz: 'kamida 2 ta <li>', ru: 'минимум 2 <li>' }, check: C.count('li', 2, { uz: "`<ul>` ichida kamida 2 ta `<li>` band yozing", ru: 'Напишите минимум 2 пункта `<li>` внутри `<ul>`' }) },
  ],
};
const STARTER_LIST = `<!-- Bu yerga yozing -->
`;

// — P3: YAKUNIY — to'liq portfolio (Screen15 — yig'ish — dan keyin) —
const TASK_FINAL = {
  eyebrow: { uz: 'Praktika · yakuniy', ru: 'Практика · финал' },
  title: { uz: "Hammasi birga — o'z portfolioingiz", ru: 'Всё вместе — ваше портфолио' },
  brief: { uz: "Bugun o'rgangan hamma narsa: sarlavha + bo'lim + ro'yxat + havola. Portfolioni noldan o'zingiz yig'asiz.", ru: 'Всё, что вы выучили сегодня: заголовок + раздел + список + ссылка. Собираете портфолио с нуля сами.' },
  requirements: [
    { id: 'h1', label: { uz: '<h1> — sarlavha (ism)', ru: '<h1> — заголовок (имя)' }, check: C.text('h1', { uz: "`<h1>` ichiga sarlavha yozing", ru: 'Напишите заголовок внутри `<h1>`' }) },
    { id: 'h2', label: { uz: '<h2> — bo\'lim sarlavhasi', ru: '<h2> — заголовок раздела' }, check: C.text('h2', { uz: "`<h2>` ichiga bo'lim sarlavhasini yozing", ru: 'Напишите заголовок раздела внутри `<h2>`' }) },
    { id: 'li', label: { uz: 'ro\'yxatda kamida 2 ta <li>', ru: 'в списке минимум 2 <li>' }, check: C.count('li', 2, { uz: "`<ul>` ichida kamida 2 ta `<li>` band yozing", ru: 'Напишите минимум 2 пункта `<li>` внутри `<ul>`' }) },
    { id: 'a',  label: { uz: '<a> havola — href bilan', ru: '<a> ссылка — с href' }, check: C.attr('a', 'href', { uz: "`<a href=\"...\">matn</a>` havola qo'shing", ru: 'Добавьте ссылку `<a href="...">текст</a>`' }) },
  ],
};
const STARTER_FINAL = `<!-- Bu yerga yozing -->
`;

// Praktika handoff xaritasi: shu ekran INDEKSIDAN keyin qaysi praktika chaqiriladi.
const PRACTICE_AFTER = {
  3:  { task: TASK_HEADER, starter: STARTER_HEADER }, // 1) Header (h1/p)
  9:  { task: TASK_LIST,   starter: STARTER_LIST },   // 2) Loyihalar ro'yxati (ul/li)
  15: { task: TASK_FINAL,  starter: STARTER_FINAL },  // 3) Yakuniy (noldan portfolio)
};


// ============================================================ LESSON ROOT
export default function HtmlPractice({ lang: langProp, onFinished, onPractice }) {
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
  const [practice, setPractice] = useState(null);        // lokal overlay: { task, starter, done } yoki null
  const [mentorPractice, setMentorPractice] = useState(null); // jonli mentor paneli (Jonli ulaydi)
  const startTimeRef = useRef(saved?.startedAt || Date.now());
  // ⚡ JONLI (live) — javob kaliti: inline testlar + arena savollari; mentor ochganda serverga yuklanadi.
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey);
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
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
  // 🃏 Flashcard jonli darsda FAQAT MENTORGA ko'rinadi (proyektorda jamoaviy takrorlash);
  // jonli o'quvchidan yashirin — sakrab o'tiladi. «Erkin qilish» / uzilish / self'da ochiladi.
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const advance = () => setScreen(s => {
    let n = Math.min(s + 1, TOTAL_SCREENS - 1);
    if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
    return n;
  });
  // Praktikani ishga tushiradi: production'da onPractice (LMS), lokalda overlay.
  const runPractice = (entry, fromScreen) => {
    const done = () => {
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_DONE_BASE + fromScreen, `practice-${fromScreen}`, 0, true, 0);
      earn('coder'); // 🏅 birinchi praktikada kod yozildi
      pracClear(LESSON_META.lessonId); setPractice(null); advance();
    };
    if (typeof onPractice === 'function') Promise.resolve(onPractice(entry.task)).then(done);
    else { pracWrite(LESSON_META.lessonId, { kind: `s${fromScreen}`, screen: fromScreen }); setPractice({ ...entry, done, codeKey: codeKeyOf(LESSON_META.lessonId, `s${fromScreen}`) }); }
  };
  // "Davom etish": shu ekrandan keyin praktika bo'lsa — compilatorni ochadi.
  // 🏠 UYGA VAZIFA PRAKTIKASI (yakun-sahifadagi tugma) — yakuniy topshiriq.
  // Dars-ichi mashqidan farqi: keyingi ekranga O'TKAZMAYDI (oxirgi sahifa) va serverga
  // «bajardim» signali YUBORMAYDI — bu uy ishi, sinf ishi emas.
  const openHomeworkPractice = () => {
    const entry = { task: TASK_FINAL, starter: STARTER_FINAL };
    if (typeof onPractice === 'function') Promise.resolve(onPractice(entry.task)).catch(() => {});
    else {
      pracWrite(LESSON_META.lessonId, { kind: 'hw' });
      setPractice({ ...entry, codeKey: codeKeyOf(LESSON_META.lessonId, 'hw'), done: () => { pracClear(LESSON_META.lessonId); setPractice(null); } });
    }
  };
  // F-0801-01: qayta yuklanishda ochiq praktika tiklanadi (qaysi biri ochilgan bo'lsa — o'sha
  // qayta quriladi; `done` shu yerda yangidan bog'lanadi).
  useEffect(() => {
    if (typeof onPractice === 'function') return; // production: overlay ishlatilmaydi
    const p = pracRead(LESSON_META.lessonId);
    if (!p) return;
    if (p.kind === 'hw') { openHomeworkPractice(); return; }
    const entry = PRACTICE_AFTER[p.screen];
    if (entry) runPractice(entry, p.screen);
    else pracClear(LESSON_META.lessonId); // dars o'zgargan — eskirgan saqlov tashlanadi
  }, []); // eslint-disable-line

  const next = () => {
    const entry = PRACTICE_AFTER[screen];
    if (!entry) { advance(); return; }
    // 🔴 DARS-ICHI PRAKTIKASI FAQAT JONLI DARSDA (2026-07-29): mashq faqat o'quvchi mentorga
    // ULANGAN va sessiya davom etayotganda ochiladi. Mentor «Erkin qilish»ni bossa, uzilib qolsa
    // yoki bola mustaqil o'qiyotgan bo'lsa — mashq OCHILMAYDI, u yakun-sahifadagi «Uyga vazifa»
    // tugmasi orqali bajaradi.
    if (!(live && (live.mode === 'mentor' || (live.mode === 'student' && live.status !== 'ended' && live.mentorAlive)))) { advance(); return; }
    if (live && live.mode === 'mentor') { setMentorPractice({ ...entry, fromScreen: screen }); advance(); }
    else runPractice(entry, screen);
  };
  const prev = () => setScreen(s => {
    let n = Math.max(s - 1, 0);
    if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0);
    return n;
  });
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    // Server-baholash: jonli o'quvchi javobini QuestionScreen o'zi (real picked+elapsed bilan) submitAnswer qiladi —
    // bu yerda takroriy submit YO'Q (aks holda picked=0 birinchi yozilib, taqsimotni buzardi).
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat SCORED/challenge ekran)
  };
  const reset = () => { progClear(LESSON_META.lessonId); pracClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); setPractice(null); setMentorPractice(null); startTimeRef.current = Date.now(); };
  // F-0730-01: har o'zgarishda progress saqlanadi (screen + javoblar + nishonlar + boshlangan vaqt)
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned]);
  // MENTOR: joriy ekranni serverga e'lon qiladi (o'quvchilar gate uchun)
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  // 🏅 Yakuniy ekranga yetganda: bitiruvchi nishoni
  useEffect(() => { if (screen === TOTAL_SCREENS - 1) earn('graduate'); }, [screen]); // eslint-disable-line

  // ETALON — 1920px avto-zoom (InternetLesson): keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);

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

  // Tartib SCREEN_META bilan AYNAN bir xil: …s16 (yakuniy test) → spodium (g'oliblar) → sflash → s17 (yakun)
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16, ScreenPodium, ScreenFlashcards, Screen17];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }
        .bp-body ul { list-style-type: disc; list-style-position: outside; padding-left: 24px; }
        .bp-body li { display: list-item; }

        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        /* 🔴 F-0808-02: dars matnidagi kod-bo'laklarida ham ligatura o'chiriladi — bola
           yopuvchi tegni AYNAN o'zi ko'rsin (kompilyatordagi bilan bir xil qoida). */
        .mono, .code-box, .qcode, .skel-tag, .ai-line, .dbg-line, .dd-chip, .text-input,
        .fc-tag.mono-all, .fc-tag .fc-kw, .bp-title, .step-tag { font-feature-settings: "liga" 0, "calt" 0; }

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

        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }
        .chip-wrong { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .chip:disabled { opacity: 0.55; cursor: not-allowed; }

        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: contain; transform: scale(1.12); }
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

        .text-input { width: 100%; font-family: 'JetBrains Mono', monospace; font-size: clamp(14px,1.8vw,16px); font-weight: 500; padding: 11px 13px; border: none; border-radius: 12px; background: ${T.paper}; color: ${T.ink}; outline: none; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: box-shadow 0.2s; }
        .text-input:focus { box-shadow: 0 10px 22px -6px rgba(255,79,40,0.3), 0 0 0 1px rgba(255,79,40,0.2); }

        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(12.5px,1.6vw,14.5px); line-height: 1.55; padding: clamp(12px,2.2vw,18px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.16); }
        .bp-bar { background: #f0eee8; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-title { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink3}; }
        .bp-body { padding: clamp(12px,2.2vw,18px); }

        .h-title { font-size: clamp(22px,4vw,38px); }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }

        /* === Jonli panel (LiveBadge) — xira turadi, ustiga borilganda tiniqlashadi (kontentni to'smaydi) === */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(255,79,40,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(255,79,40,0.55), 0 0 3px rgba(255,79,40,0.4); }

        .frame-soft { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-left: 4px solid ${T.success}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.accentSoft}; border-left: 4px solid ${T.accent}; border-radius: 12px; padding: 12px 15px; }
        /* frame-wait — neytral info (ko'k): xato ham, muvaffaqiyat ham EMAS (11.6) */
        .frame-wait { background: ${T.blueSoft}; border-left: 4px solid ${T.blue}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        /* === MENTOR PRAKTIKA PANELI (jonli mentor rejimi) — etalon L1 === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
        .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.blue}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
        .mstats-prog-fill.full { background: ${T.success}; }
        .mstats-waitrow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .mstats-wait-chip { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.07); border-radius: 99px; padding: 3px 10px; }
        .mstats-wait-chip.more { color: ${T.ink3}; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        /* === Mentor TEST-reveal paneli (Kahoot) — etalon L1'dan === */
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.ink}; color: #fff; border: none; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(255,79,40,0.5); }
        .mstats-reveal.ready { background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(255,79,40,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(255,79,40,0.55); } }
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
        .mstats-wait-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; }
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }

        /* === 🏆 «BUGUNGI G'OLIBLARIMIZ» — PODIUM / STATISTIKA SAHIFASI === */
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
        @media (prefers-reduced-motion: reduce) { .pod-bar { transition: none; } }

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
        /* option-wait — jonli javob qotdi, natija sir (neytral ko'k) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        .mp-overlay { position: fixed; inset: 0; z-index: 2000; background: ${T.bg}; display: flex; align-items: center; justify-content: center; padding: clamp(16px,3vw,34px); overflow: auto; }
        .mp-card { width: 100%; max-width: 640px; background: ${T.paper}; border-radius: 22px; padding: clamp(22px,3.4vw,36px); box-shadow: 0 24px 60px -24px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 14px; animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        .mp-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; }
        .mp-title { font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(22px,3.2vw,30px); color: ${T.ink}; margin: 0; line-height: 1.15; }
        .mp-brief { margin: 0; font-size: clamp(13.5px,1.8vw,15px); line-height: 1.55; color: ${T.ink2}; }
        .mp-flow { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin: 2px 0 4px; }
        .mp-step { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.06); border-radius: 99px; padding: 6px 13px; }
        .mp-step.cur { color: ${T.success}; background: ${T.successSoft}; }
        .mp-arr { color: ${T.ink3}; font-weight: 700; }
        .mp-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
        .mp-demo { flex: 1; min-width: 200px; padding: 14px 20px; border: none; border-radius: 14px; background: ${T.ink}; color: ${T.paper}; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.4); transition: transform 0.15s; }
        .mp-demo:hover { transform: translateY(-2px); }
        .mp-next { flex: 1; min-width: 160px; padding: 14px 20px; border: 1.5px solid rgba(${T.shadowBase},0.16); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.15s; }
        .mp-next:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .mp-tip { margin: 2px 0 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink3}; }

        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }
        .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; background: none; padding: 0; }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }
        /* 🏠 UYGA VAZIFA — amaliy topshiriqqa chorlaydigan kapsula (darsning O'Z rangida) */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, ${T.accent}66, ${T.accent}00 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: none; border-radius: 22px; cursor: pointer; background: linear-gradient(160deg, ${T.accent} 0%, ${T.accent} 52%, ${T.ink} 100%); color: #fff; animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; text-shadow: 0 2px 12px rgba(0,0,0,0.25); }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent); transform: skewX(-18deg); animation: hw-shine 3.2s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 18px 40px -14px ${T.accent}99, 0 0 0 0 ${T.accent}59; } 50% { box-shadow: 0 20px 48px -14px ${T.accent}bb, 0 0 0 11px ${T.accent}00; } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before { animation: none; } .hw-big-wrap::before { opacity: 0.55; } }
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.12); overflow: hidden; }
        .gloss-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 17px; cursor: pointer; } .gloss-head .lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; } .gloss-toggle { font-size: 18px; color: ${T.ink2}; }
        .gloss-body { padding: 0 17px 15px; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; line-height: 1.7; animation: fade-step 0.3s; } .gloss-body b { color: ${T.ink}; }

        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* ============ HTML PRAKTIKA — qo'shimcha ============ */
        /* Bezaksiz "xom" brauzer ko'rinishi (browser default) */
        .raw { font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.4; }
        .raw h1 { font-size: 2em; font-weight: bold; margin: 0.4em 0 0.2em; }
        .raw h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0 0.2em; }
        .raw p { margin: 0.5em 0; }
        .raw nav { display: flex; gap: 14px; flex-wrap: wrap; margin: 6px 0; }
        .raw a { color: #0000ee; text-decoration: underline; cursor: pointer; }
        .raw ul { padding-left: 28px; margin: 0.4em 0; list-style: disc outside; }
        .raw li { display: list-item; margin: 2px 0; }
        .raw hr { border: none; border-top: 1px solid #cfcfcf; margin: 10px 0; }
        .raw section { margin: 10px 0; }
        .raw footer { margin-top: 12px; color: #444; font-size: 0.85em; }
        .raw-img { display: block; width: 92px; height: 64px; object-fit: cover; background: #e9e9e9; border: 1px solid #c2c2c2; margin: 4px 0; }

        /* Kod ichidagi to'ldiriladigan bo'sh joy (slot) */
        .slot { display: inline-block; min-width: 30px; padding: 0 7px; border-radius: 6px; background: rgba(255,79,40,0.20); box-shadow: inset 0 0 0 1.5px ${T.accent}; color: ${T.accent}; font-weight: 700; }
        .slot.filled { background: rgba(31,122,77,0.18); box-shadow: inset 0 0 0 1.5px ${T.success}; color: ${CODE.str}; }

        .build-in { display: flex; flex-direction: column; gap: 7px; }
        .fld-label { font-family: 'Manrope'; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: ${T.ink2}; }
        .tagpick { display: flex; flex-wrap: wrap; gap: 8px; }

        /* Skelet bloklari */
        .skel-stack { display: flex; flex-direction: column; gap: 7px; }
        .skel-block { display: flex; align-items: center; gap: 12px; background: ${T.paper}; border: 1.5px dashed ${T.ink3}; border-radius: 10px; padding: 11px 14px; opacity: 0.5; transition: all 0.4s; }
        .skel-block.on { opacity: 1; border-style: solid; border-color: ${T.accent}40; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .skel-tag { font-family: 'JetBrains Mono'; font-size: 12px; font-weight: 600; color: ${CODE.tag}; background: ${CODE.bg}; padding: 3px 9px; border-radius: 6px; flex-shrink: 0; }
        .skel-l { font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; }

        /* Yig'ish ro'yxati */
        .asm-list { display: flex; flex-direction: column; gap: 6px; }
        .asm-row { display: flex; align-items: center; gap: 11px; background: ${T.paper}; border-radius: 10px; padding: 9px 13px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.12); opacity: 0.5; transition: all 0.35s; }
        .asm-row.on { opacity: 1; box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .asm-ic { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 12px; box-shadow: inset 0 0 0 2px ${T.ink3}; color: ${T.ink2}; transition: all 0.35s; }
        .asm-row.on .asm-ic { background: ${T.success}; color: #fff; box-shadow: inset 0 0 0 2px ${T.success}; }

        /* AI debugging kartasi */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; }
        .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; }
        .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 4px 7px; border-radius: 6px; transition: all 0.15s; }
        .ai-line:hover { background: rgba(255,255,255,0.06); }
        .ai-line .tg { color: ${CODE.tag}; }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; }
        .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; }

        /* ============ 🔧 INTERAKTIV QATLAMLAR CSS (L1 etaloni) ============ */
        .qcode { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        /* === 🧲 DRAG&DROP (reusable) === */
        .sk-buildbox { display: flex; flex-direction: column; animation: sk-swapin 0.5s cubic-bezier(.34,1.3,.4,1); }
        @keyframes sk-swapin { from { opacity: 0; transform: translateY(12px) scale(0.96); } to { opacity: 1; transform: none; } }
        .dd { display: flex; flex-direction: column; gap: 13px; }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 56px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; transition: border-color .18s, background .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; }
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; }
        .dd-slot.bad { border-color: #E24848; background: #FBE9E9; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        .dd-slotn { width: 26px; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; }
        .dd-hint { color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${T.bg}; }
        .dd-pool-empty { color: ${T.ink3}; font-size: 12.5px; font-style: italic; align-self: center; }
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip:hover { transform: translateY(-2px); }
        .dd-chip:active { cursor: grabbing; }
        .dd-slots, .dd-pool { position: relative; }
        .dd-pool { z-index: 1; } /* sudralgan pool chip slotlar ustida ko'rinsin */
        .dd-done { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .dd-wrong { font-weight: 700; color: #E24848; font-size: 13.5px; }

        /* === 🐞 DEBUG CHALLENGE (reusable) === */
        .dbg-box { display: flex; flex-direction: column; border-top: 1.5px dashed ${T.line}; padding-top: 12px; margin-top: 6px; animation: sk-swapin 0.5s cubic-bezier(.34,1.3,.4,1); }
        .dbg { display: flex; flex-direction: column; gap: 10px; }
        .dbg-code { background: ${CODE.bg}; border-radius: 14px; padding: 10px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 10px 26px -14px rgba(${T.shadowBase},0.4); overflow-x: auto; }
        .dbg-line { display: flex; align-items: center; gap: 12px; font-family: 'JetBrains Mono', monospace; font-size: clamp(13px,1.8vw,15px); color: ${CODE.text}; padding: 8px 12px; border-radius: 9px; cursor: pointer; border: 1.5px solid transparent; transition: background .15s, border-color .15s; white-space: nowrap; }
        .dbg-line:hover { background: rgba(255,255,255,0.06); }
        .dbg-line.wrong { border-color: #E24848; background: rgba(226,72,72,0.16); animation: dd-shake .4s; }
        .dbg-line.fixed { border-color: ${T.success}; background: rgba(18,169,104,0.16); cursor: default; }
        .dbg-ln { color: ${CODE.comment}; font-size: 12px; min-width: 16px; text-align: right; flex-shrink: 0; }
        .dbg-txt { flex: 1; }
        .dbg-badge { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.success}; background: rgba(18,169,104,0.2); border-radius: 99px; padding: 3px 9px; flex-shrink: 0; }
        .dbg-hint { margin: 0; font-size: 13px; color: ${T.ink3}; font-style: italic; }
        .dbg-ok { font-weight: 700; color: ${T.success}; font-size: 14px; background: ${T.successSoft}; border-radius: 12px; padding: 10px 14px; }

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
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #FF8A3D, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
        .fc-cardwrap { perspective: 1200px; position: relative; }
        .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid ${T.line}; z-index: -1; }
        .fc-cardwrap::before { transform: translateY(7px) scale(0.965); opacity: 0.7; }
        .fc-cardwrap::after { transform: translateY(15px) scale(0.93); opacity: 0.4; }
        /* Quizlet uslubi: karta rangli muhr bilan chapga (✗ qizil) / o'ngga (✓ yashil) uchib ketadi */
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
        .fc-back { background: linear-gradient(160deg, #FF8A3D, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(255,79,40,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
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
        /* === 🏅 ACHIEVEMENTS === */
        /* ===== 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI ===== */
        .acu-overlay { position: fixed; inset: 0; z-index: 11000; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;
          background: radial-gradient(circle at 50% 42%, rgba(20,14,6,0.34) 0%, rgba(10,8,14,0.72) 62%, rgba(8,6,12,0.86) 100%);
          animation: acu-bg-in 0.35s ease-out, acu-bg-out 0.55s ease-in 3.45s forwards; }
        @keyframes acu-bg-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes acu-bg-out { to { opacity: 0; } }
        /* Aylanuvchi nur burjlari (butun ekran) */
        .acu-rays { position: absolute; top: 50%; left: 50%; width: 170vmax; height: 170vmax; transform: translate(-50%,-50%); pointer-events: none;
          background: repeating-conic-gradient(from 0deg, rgba(255,201,77,0.16) 0deg 7deg, transparent 7deg 20deg);
          -webkit-mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%); mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%);
          animation: acu-spin 16s linear infinite, acu-fade 0.6s ease-out; }
        @keyframes acu-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes acu-fade { from { opacity: 0; } to { opacity: 1; } }
        /* Markaziy yorug'lik */
        .acu-glow { position: absolute; top: 42%; left: 50%; width: 78vmin; height: 78vmin; transform: translate(-50%,-50%); pointer-events: none; filter: blur(4px);
          background: radial-gradient(circle, rgba(255,224,150,0.62) 0%, rgba(255,150,60,0.30) 38%, rgba(255,120,40,0) 68%);
          animation: acu-glow-pulse 2.2s ease-in-out infinite, acu-fade 0.5s ease-out; }
        @keyframes acu-glow-pulse { 0%,100% { opacity: 0.85; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08); } }
        /* Zarba to'lqini (halqa) */
        .acu-ring { position: absolute; top: 42%; left: 50%; width: 130px; height: 130px; border-radius: 50%; border: 3px solid rgba(255,240,200,0.85); transform: translate(-50%,-50%) scale(0.3); pointer-events: none; animation: acu-shock 1s cubic-bezier(.2,.7,.3,1) forwards; }
        .acu-ring.d2 { border-color: rgba(255,180,90,0.6); animation-delay: 0.22s; }
        @keyframes acu-shock { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.9; } 100% { transform: translate(-50%,-50%) scale(6.5); opacity: 0; } }
        /* Sahna (medal + matn) */
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
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #FFF3EC); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
        /* Yuqori paneldagi nishon hisoblagichi */
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

        /* ===== ⚡ CODESTRIKE — CTA (dars ichida) ===== */
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


      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
          <div className="lesson-root">
            {live.mode === 'choosing' ? (
              <LiveGate live={live} title={{ uz: '1-Modul · Praktika', ru: 'Модуль 1 · Практика' }} />
            ) : (
              <>
                <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} onHomework={openHomeworkPractice} />
                {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
                <LiveBadge live={live} total={TOTAL_SCREENS} />
              </>
            )}
            {/* F-0808-02: kompilyator `document.body` ga PORTAL bilan chiqariladi.
                `.lesson-root` da `zoom: var(--lz)` bor; overlay uning ichida turganda
                2560x1400 ekranda kompilyator 1866px bo'lib ketib, pastki 466px (shu jumladan
                «Davom etish» tugmasi) ekrandan chiqib ketardi. Portal zoomdan chiqaradi.
                React konteksti (til/jonli) portalda ham saqlanadi. */}
            {practice && createPortal(
              <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg }}>
                <HtmlCompiler task={practice.task} starterCode={practice.starter} storageKey={practice.codeKey} lang={lang} onContinue={practice.done} onBack={() => { pracClear(LESSON_META.lessonId); setPractice(null); }} />
              </div>,
              document.body
            )}
            {mentorPractice && <MentorPracticeOverlay entry={mentorPractice} live={live} onClose={() => setMentorPractice(null)} />}
          </div>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>
  );
}
