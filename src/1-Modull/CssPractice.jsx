import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from 'react';
import { createPortal } from 'react-dom'; // F-1015-362: «Avval tayyorlaning» oynasi .lesson-root ga (fade-up transform ichida fixed ishlamaydi)

// F-1015-303: kompilyator olindi — amaliyot o'quvchining kompyuterida (VS Code + Gemini + Live Server).


const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// CSS PRAKTIKA — PLATFORM STANDARD v15/v16  (v2 — noldan qayta qurilgan)
// O'quvchi HTML praktikasida qurgan PORTFOLIO saytiga CSS bilan jon kiritadi.
// Bezaksiz (browser default) → chiroyli, markazlashgan professional sayt.
// FAQAT o'rgatilgan xususiyatlar: color, background-color, font-family,
//   font-size, font-weight, text-align, padding, margin
//   + display:flex, gap, justify-content, align-items (CSS 2-dars).
// :hover / transition / border-radius — DARS MAVZUSI EMAS (faqat oxirida bonus).
// Murojaat: O'quvchiga "SIZ". Sarlavhalar — savol shaklida (metodika).


// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E1F3FB', link: '#1a56db', line: '#E9E6DF',
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


// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi.
import { arenaOrder, useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang , buildResultDetails, sealPayload, useAutoNext, FinishBtn, liveToast } from '../live/index.js';
import { UygaVazifaKarta } from '../qolip/UygaVazifaKarta.jsx'; // F-1023-03: uyga vazifa v2 kartasi
// F-1023-03: uyga vazifa — LMS'dagi «Uyga vazifa: CSS Praktika» bilan bir xil (uyga-vazifa-v2/lms/paket.json, 2-11). scripts/hw-v2-kartalar.mjs yozadi.
const HW_V2 = {"id":"2-11","tur":"file","nom":{"uz":"Uyga vazifa: CSS Praktika","ru":"Домашнее задание: Практика CSS"},"matn":{"uz":"AI yozgan style.css'ni endi o'zingiz o'zgartiring.\n\n1. F12 → Styles'da sinab ko'ring, keyin 3 ta o'zgarishni style.css ga o'zingiz yozing: asosiy rang, kartochkalar orasidagi gap, kartochka ichidagi padding.\n2. style.css tepasiga izoh: qaysi 3 qatorni o'zgartirdingiz.\n3. Oldin va keyin skrinshotlari.\n4. Saytda yana qaysi 3 sahifa bo'lishini yozing — 13-darsda ularni qo'shasiz.\n\nNima tekshiriladi:\n— oldin/keyin farqi ko'rinadi\n— izohda 3 o'zgarish\n— o'zgarishlar o'tilgan xossalar bilan\n— 3 sahifa nomi.","ru":"Теперь сами измените style.css, который написал AI.\n\n1. Попробуйте в F12 → Styles, потом сами впишите 3 изменения в style.css: основной цвет, gap между карточками, padding внутри карточки.\n2. Вверху style.css — комментарий: какие 3 строки вы изменили.\n3. Скриншоты «до» и «после».\n4. Напишите, какие ещё 3 страницы будут на сайте — на 13-м уроке вы их добавите.\n\nЧто проверяется:\n— видна разница до/после\n— в комментарии 3 изменения\n— изменения сделаны пройденными свойствами\n— названия 3 страниц."}};
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const AchMissCtx = createContext(null); // 🏅 151-qonun: { missed:Set<ekran id>, miss(idx), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi








const LangContext = createContext('uz');
const MentorCtx = createContext(null);
const useLang = () => useContext(LangContext);

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

const LESSON_META = { lessonId: 'css-practice-portfolio-v3', lessonTitle: { uz: 'CSS Praktika — Demo Day saytini bezaymiz', ru: 'CSS практика — оформляем сайт для Demo Day' } }; // lessonId — LMS kaliti, o'zgarmaydi (F-1015-309)
const HW_TOKENS = [
  { t: { uz: 'amaliyot', ru: 'практика' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'loyiha', ru: 'проект' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'mashq', ru: 'упражнение' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'natija', ru: 'результат' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',     template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',     template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 'a3',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 's16', type: 'test',     template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'a4',  type: 'practice', template: 'custom',   scored: false, scope: null }, // F-1015-316: kartochkalar o'rniga — loyihani tekshirish va yaxshilash
  { id: 'spodium', type: 'podium',  template: 'custom', scored: false, scope: null },
  { id: 's17', type: 'summary',  template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// ===== Kichik yordamchi komponentlar =====
const Split = ({ children, three }) => <div className={three ? 'split split3' : 'split'}>{children}</div>; // §34: three — uch ustun (s0)
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

// ===== fmtCode — matn ichidagi `kod` bo'laklarini chip qiladi (11.8) =====
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

// 🏅 Nishon hisoblagichi — yuqori panelda doim ko'rinadi; bosilganda kolleksiya popover
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

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic; // F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi
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
              {/* AUDIOSIZ: ovoz tugmasi ko'rsatilmaydi */}
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
const NavNext = ({ disabled, label = { uz: 'Davom etish', ru: 'Продолжить' }, onClick, optionalLive, mentorLock }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked); // jonli o'quvchi mentordan o'zib ketolmaydi
  const live = gate && gate.live;
  // freeRide: jonli o'quvchi mashq/eksploratsiya ekranida qotmaydi (mentor proyektorda ko'rsatadi) — testlarga QO'YILMAYDI
  // F-1012: mentor (jonli dars va LMS preview) topshiriqqa qulflanmaydi; o'quvchi allaqachon o'tgan ekranga qaytsa ham qulf yo'q
  // F-1013-02: test ekrani (mentorLock) — mentor avval «Natijani ochish» bosadi, keyin o'tadi (odatiy tartib saqlanadi)
  const freeRide = !!((optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive) || (live && live.mode === 'mentor' && !mentorLock) || (gate && gate.passed));
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(label))}</button>;
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
const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A']; // A B C D — brend-neytral
const RECAP_NEED_PCT = 60;   // shundan past — qayta tushuntirish tavsiya etiladi
const RECAP_GOOD_PCT = 75;   // shundan yuqori — sinf o'zlashtirdi
const RECAP_MIN_ANSWERS = 3; // foizga ishonch uchun kamida shuncha javob

// ===== 📖 QAYTA TUSHUNTIRISH (recap) — har scored test uchun 3 karta =====
// Kalitlar — scored inline test ekranlarining indekslari (4, 6, 8, 11, 14).
// Har karta: ic (katta emoji), h (sarlavha), body (1-2 gap), vis (ko'rgazma),
// ask (mentor sinfga og'zaki beradigan savol — jonli muloqot uchun).
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
const RECAPS = {
  // idx 5 — s16: «Kartochkalarni bir qatorga qaysi qoida tizadi?» (display: flex)
  5: {
    title: { uz: 'Yonma-yon: display: flex va gap', ru: 'В ряд: display: flex и gap' }, cards: [
      { ic: '📐', h: { uz: 'display: flex — bir qatorga', ru: 'display: flex — в один ряд' },
        body: { uz: <><b className="mono">display: flex</b> ichidagi elementlarni <b>bir qatorga</b> tizadi.</>, ru: <><b className="mono">display: flex</b> выстраивает вложенные элементы <b>в один ряд</b>.</> },
        vis: <RcFlow items={['ul', 'display: flex', 'li · li · li']} /> },
      { ic: '↔️', h: { uz: "gap va padding", ru: 'gap и padding' },
        body: { uz: <><b className="mono">gap</b> — kartochkalar <b>orasidagi</b> bo'shliq, <b className="mono">padding</b> — kartochka <b>ichidagi</b>.</>, ru: <><b className="mono">gap</b> — промежуток <b>между</b> карточками, <b className="mono">padding</b> — отступ <b>внутри</b> карточки.</> },
        vis: <RcFlow items={[{ uz: "gap — orasida", ru: 'gap — между' }, { uz: 'padding — ichida', ru: 'padding — внутри' }]} sep="·" /> },
      { ic: '❓', h: { uz: "O'zingizni tekshiring", ru: 'Проверьте себя' },
        body: { uz: <>Qoida <b>ro'yxatning o'ziga</b> (<b className="mono">ul</b>) beriladi — kartochkalarga emas.</>, ru: <>Правило задаётся <b>самому списку</b> (<b className="mono">ul</b>) — не карточкам.</> },
        vis: <RcFlow items={['ul', '{ display: flex; }']} sep="·" />,
        ask: { uz: "Kartochkalar ustma-ust tursa, qaysi qoidani qo'shasiz?", ru: 'Если карточки стоят друг под другом, какое правило добавите?' } },
    ]
  },
};

function RecapOverlay({ screenIdx, onClose, showAsk }) {
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
        <span className="rc-tag">📖 {tr({ uz: 'Eslatma', ru: 'Напоминание' })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && showAsk && <div className="rc-ask">🗣️ {tr({ uz: 'Sinfga savol', ru: 'Вопрос классу' })}: {tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← {tr({ uz: 'Oldingi', ru: 'Назад' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-karta`, ru: `карточка ${k + 1}` })} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: 'Tushunarli', ru: 'Понятно' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi', ru: 'Дальше' })} →</button>}
      </div>
    </div>
  );
}

// MENTOR (proyektor) jonli statistika + Kahoot «Natijani ochish». «To'g'ri» sanog'i
// ustunlar bilan BIR XIL mantiqdan (picked === correctIdx) — server `a.correct` eskirmasin.
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
  const waitingPl = data.players.filter(p => !answeredIds.has(p.id));
  const maxN = Math.max(1, ...options.map((_, i) => data.rows.filter(a => a.picked === i).length));
  return (
    <div className="mstats fade-up">
      <div className="mstats-head">
        <span className="mstats-lbl">📊 {tr({ uz: 'Jonli natija', ru: 'Живой результат' })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : <>{tr({ uz: 'Javob berdi', ru: 'Ответили' })}: <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>🔓 {tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>}
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
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и число ✅/❌ скрыты — по нажатию «Открыть результат» всё откроется одновременно и у вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — тема осталась непонятой классом. Перед продолжением коротко повторите.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr({ uz: 'Eslatma', ru: 'Напоминание' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. Если хотите, коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — по проценту трудно судить. Оцените сами.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Eslatma', ru: 'Напоминание' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
          </div>
        );
      })()}
      {waitingPl.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">⏳ {tr({ uz: 'Kutilmoqda', ru: 'Ожидаем' })}:</span>
          {waitingPl.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waitingPl.length > 8 && <span className="mstats-wait-chip more">+{waitingPl.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: '⚠️ Большинство ошиблись — похоже, тема осталась непонятой. Объясните ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь вживую…' })}</p>}
    </div>
  );
}

const QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _am = useContext(AchMissCtx);
  const fpPractice = !!(_am && _am.practice); // 151-qonun 6-band: «Qaytadan» mashq-o'tishi — hech qayerga yozilmaydi
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: 'on_mount', waits_for: { type: 'option_picked' } }] : null);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student'); // jonli dars: BITTA urinish — xato bo'lsa ham qotadi
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now()); // tezlik: savol ochilgandan bosishgacha (teng ballda hal qiladi)
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  // MENTOR (proyektor): o'zi javob BERMAYDI — statistikani kuzatadi, «Natijani ochish» bosadi.
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
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect; // ball: 1-urinishni qotiramiz
    const optTexts = options.map(o => tr(o)); // payload'ga doim string yoziladi ({uz,ru} obyekt emas)
    if (oneShot) {
      // Jonli dars: javob darhol qotadi (to'g'ri ham, xato ham) va serverga yoziladi
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: optTexts, correctIndex: correctIdx, correctAnswer: optTexts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: optTexts[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      if (!fpPractice) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: optTexts, correctIndex: correctIdx, correctAnswer: optTexts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: optTexts[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    // Har urinish tarixga (LMS analitika, 0005): ball emas, yozuv; modulsiz eski darsda recordAttempt yo'q
    if (live && live.recordAttempt && !fpPractice) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options: optTexts, picked: optTexts[i], correct: optTexts[correctIdx], lang: (typeof __lang !== 'undefined' && __lang === 'ru') ? 'ru' : 'uz' });
    if (audioText) { audio.triggerEvent('option_picked'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? (audioOk || "To'g'ri.") : (audioWrong || "Unchalik emas. Qaytadan urinib ko'ring.")); }, 300); }
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx; // jonli darsda xato bosib qotgan
  // KAHOOT REVEAL: jonli darsda javob bosilgach to'g'ri/xato ham sir — faqat «qabul qilindi».
  // Mentor «Natijani ochish» / keyingi sahifa / dars tugashi — hammada birdan ochiladi.
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed; // javob qotdi — natija mentordan kutilmoqda
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext mentorLock disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval natijani oching', ru: 'Сначала откройте результат' }) : solved ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' }} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: 'flex-start', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>⚡ {tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: 'Живой урок — одна попытка, думайте перед нажатием!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: picked !== null ? 8 : 11 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (isMentorLive) {
              if (mReveal) { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; } // reveal'gacha neytral
            } else if (solved) {
              if (waiting) { if (i === picked) cls += ' option-wait'; } // to'g'ri/xato hali sir
              else { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; if (wrongLocked && i === picked) cls += ' option-picked-wrong'; }
            }
            else if (i === picked) cls += ' option-picked-wrong';
            const showGreenLetter = isMentorLive ? (mReveal && i === correctIdx) : (solved && revealed && i === correctIdx);
            return (
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: picked !== null ? 'clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)' : 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(tr(opt))}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          {(isMentorLive || waiting || wrongLocked) && (<p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? tr({ uz: `✓ To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}`, ru: `✓ Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}` })
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? tr({ uz: `To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}`, ru: `Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${tr(options[correctIdx])}` })
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>)}
          <p className="body" style={{ margin: 0 }}>
            {!isMentorLive && !waiting && !wrongLocked && <b className="fb-mark" style={{ color: solved ? T.success : T.accent, marginRight: 6 }}>{solved ? tr({ uz: "✓ To'g'ri.", ru: '✓ Верно.' }) : tr({ uz: '✗ Xato.', ru: '✗ Неверно.' })}</b>}
            {isMentorLive
              ? fmtCode(tr(explainCorrect))
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Скоро узнаете правильный ответ.' })
                : wrongLocked
                  ? fmtCode(tr(explainWrong[picked] ?? explainWrong.default))
                  : solved ? fmtCode(tr(explainCorrect)) : fmtCode(tr(explainWrong[picked] ?? explainWrong.default))}
          </p>
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi. Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */}
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>📖 {tr({ uz: 'Eslatma', ru: 'Напоминание' })}</button>
          )}
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} showAsk={isMentorLive} />}
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish ▾", ru: 'открыть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

// ===== F-1015-309 · CSS Praktika v2: Demo Day saytining bosh sahifasi (GATE V2 — Q1–Q5 A) =====
// Qolip — pilot v1 (F-1015-303): vazifa · prompt maslahati · natija surati; «Davom etish»; isbot yo'q.
// Ip — ccDemoDay (PmLesson1 → VsCodeLesson → shu dars → DeployLesson → PmLesson3).

// ----- Demo Day g'oyasi (ccDemoDay) — VsCodeLesson / DeployLesson bilan bir kalit -----
const DEMO_KEY = 'ccDemoDay';
const demoRead = () => { try { const v = JSON.parse(localStorage.getItem(DEMO_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const demoWrite = (patch) => { try { localStorage.setItem(DEMO_KEY, JSON.stringify({ ...(demoRead() || {}), ...patch, savedAt: Date.now() })); } catch { /* saqlab bo'lmadi */ } };
// Uslublar — DeployLesson dagi bilan AYNAN (Q3 A: tanlov shu darsga ko'chdi); ekranda emojisiz
const STYLES = [
  { id: 'minimal', name: { uz: 'Minimalist', ru: 'Минимализм' }, sub: { uz: 'oq fon, tinch', ru: 'белый фон, спокойный' },
    desc: { uz: "oq fon, ko'p bo'sh joy, qora matn va bitta urg'u rang. Shrift sodda va tinch.", ru: 'белый фон, много воздуха, чёрный текст и один акцентный цвет. Шрифт простой и спокойный.' } },
  { id: 'yorqin', name: { uz: 'Yorqin', ru: 'Яркий' }, sub: { uz: 'quvnoq ranglar', ru: 'весёлые цвета' },
    desc: { uz: "yorqin ranglar (to'q sariq va ko'k), katta sarlavhalar, quvnoq ohang.", ru: 'яркие цвета (оранжевый и синий), крупные заголовки, весёлое настроение.' } },
  { id: 'qorongi', name: { uz: "Qorong'i", ru: 'Тёмный' }, sub: { uz: "to'q fon, oq matn", ru: 'тёмный фон, белый текст' },
    desc: { uz: "to'q fon, oq matn, yashil urg'u rang. Shrift zamonaviy.", ru: 'тёмный фон, белый текст, зелёный акцент. Шрифт современный.' } },
  { id: 'gradient', name: { uz: 'Gradient', ru: 'Градиент' }, sub: { uz: "rang o'tishlari", ru: 'переливы цвета' },
    desc: { uz: "binafsha va pushti rang o'tishli fonlar, yumshoq soyalar, dumaloq burchaklar.", ru: 'фоны с фиолетово-розовыми переходами, мягкие тени, скруглённые углы.' } },
];
// ccDemoDay — uslub va shu darsda yozilgan loyiha (css: { nom, muammo, talab }); eski muammo/yechim o'qilmaydi (F-1015-313)
const useDemo = () => {
  const [d, setD] = useState(() => demoRead() || {});
  const set = (patch) => { demoWrite(patch); setD(demoRead() || {}); };
  return { d, set };
};
const USLUB_STD = 'yorqin'; // tanlanmaguncha maket va prompt — rangli «Yorqin» (F-1015-313: «haqiqiy, rangli sayt»)

// ----- Bitta vizual: Demo Day bosh sahifasi — DOIM namuna, haqiqiy rangli landing (F-1015-313), 3 holat × 4 uslub -----
const DS_AFZAL = [
  { ic: 'kal', h: { uz: 'Jadval', ru: 'Расписание' }, p: { uz: "Hamma to'garak vaqti bitta sahifada.", ru: 'Время всех кружков на одной странице.' } },
  { ic: 'pin', h: { uz: 'Manzil', ru: 'Адрес' }, p: { uz: "Qaysi xonada bo'lishini bilasiz.", ru: 'Знаете, в каком кабинете занятие.' } },
  { ic: 'tel', h: { uz: 'Telefonda', ru: 'В телефоне' }, p: { uz: "Uydan ham, yo'lda ham ochiladi.", ru: 'Открывается и дома, и в дороге.' } },
];
const DS_JADVAL = [
  { t: { uz: 'Robototexnika', ru: 'Робототехника' }, v: '15:00', x: { uz: '204-xona', ru: 'каб. 204' }, c: '#2563eb' },
  { t: { uz: 'Shaxmat', ru: 'Шахматы' }, v: '16:30', x: { uz: '112-xona', ru: 'каб. 112' }, c: '#d97706' },
  { t: { uz: 'Futbol', ru: 'Футбол' }, v: '17:00', x: { uz: 'Stadion', ru: 'Стадион' }, c: '#16a34a' },
];
const DsIkon = ({ t }) => (
  <svg className="ds-ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {t === 'kal' && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>}
    {t === 'pin' && <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>}
    {t === 'tel' && <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>}
  </svg>
);
// F-1015-314: bosh qism rasmi — kod ichida chizilgan (tashqi rasm yo'q → darhol ochiladi); telefon ichida jadval + to'garak belgilari
const DsIll = () => (
  <svg className="ds-svg" viewBox="0 0 300 230" aria-hidden="true">
    <circle className="il-b1" cx="225" cy="70" r="62" /><circle className="il-b2" cx="70" cy="175" r="48" /><circle className="il-b3" cx="270" cy="190" r="22" />
    <g transform="translate(108,14)">
      <rect className="il-phone" width="104" height="204" rx="18" />
      <rect className="il-screen" x="6" y="10" width="92" height="184" rx="13" />
      <rect className="il-notch" x="38" y="16" width="28" height="5" rx="2.5" />
      <rect className="il-bar" x="14" y="30" width="76" height="22" rx="7" />
      <text className="il-bar-t" x="22" y="45">{tr({ uz: 'Dushanba', ru: 'Понедельник' })}</text>
      {DS_JADVAL.map((r, i) => (
        <g key={i} transform={`translate(14,${60 + i * 40})`}>
          <rect className={`il-r${i + 1}`} width="76" height="34" rx="8" />
          <rect width="4" height="34" rx="2" style={{ fill: r.c }} />
          <text className="il-t" x="10" y="14">{tr(r.t)}</text>
          <text className="il-v" x="10" y="26">{r.v} · {tr(r.x)}</text>
        </g>
      ))}
    </g>
    <g transform="translate(36,46)"><circle className="il-c" r="26" /><rect className="il-robot" x="-12" y="-9" width="24" height="18" rx="5" /><circle className="il-eye" cx="-5" cy="0" r="3" /><circle className="il-eye" cx="5" cy="0" r="3" /><rect className="il-robot" x="-1.5" y="-16" width="3" height="7" /><circle className="il-robot" cy="-17" r="3" /></g>
    <g transform="translate(262,128)"><circle className="il-c" r="24" /><path className="il-chess" d="M-7 12h14v-4h-2l-2-8 4-4-3-6h-6l1 5-5 5 2 8h-3z" /></g>
    <g transform="translate(44,128)"><circle className="il-c" r="20" /><circle className="il-ball-o" r="11" /><path className="il-ball" d="M0-5l4.5 3.3-1.7 5.2h-5.6l-1.7-5.2z" /></g>
  </svg>
);
const DemoSahifa = ({ holat = 'uslub', uslub = USLUB_STD, halqa = null }) => {
  const cls = ['ds', holat === 'xom' ? 'ds-xom' : `ds-${uslub}`, holat === 'rang' ? 'ds-rang' : ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div className="ds-bar"><span className="bb-dots"><i /><i /><i /></span><span className="ds-url">mening-saytim · Live Server</span></div>
      <div className="ds-body">
        <div className="ds-hd">
          <span className="ds-logo"><i className="ds-mark" aria-hidden="true" />{tr({ uz: "To'garak jadvali", ru: 'Расписание кружков' })}</span>
          <span className="ds-nav"><span>{tr({ uz: 'Jadval', ru: 'Расписание' })}</span><span>{tr({ uz: 'Aloqa', ru: 'Контакты' })}</span></span>
          <span className="ds-cta">{tr({ uz: 'Kirish', ru: 'Войти' })}</span>
        </div>
        <div className={`ds-hero ${halqa === 'hero' ? 'ds-halqa' : ''}`}>
          <div className="ds-hero-t">
            <p className="ds-tag">{tr({ uz: "Maktab to'garaklari · 2026", ru: 'Школьные кружки · 2026' })}</p>
            <p className="ds-h1">{tr({ uz: "To'garak jadvali endi telefoningizda", ru: 'Расписание кружков теперь в телефоне' })}</p>
            <p className="ds-p">{tr({ uz: "Jadval faqat devorda edi — endi uni uydan ham ko'rasiz.", ru: 'Расписание висело только на стене — теперь его видно и из дома.' })}</p>
            <div className="ds-btns"><span className="ds-tugma">{tr({ uz: "Jadvalni ko'rish", ru: 'Открыть расписание' })}</span><span className="ds-tugma2">{tr({ uz: 'Batafsil', ru: 'Подробнее' })}</span></div>
          </div>
          <DsIll />
        </div>
        <div className={`ds-kartalar ${halqa === 'karta' ? 'ds-halqa' : ''}`}>
          {DS_AFZAL.map((k, i) => <div key={i} className="ds-karta"><span className="ds-bub"><DsIkon t={k.ic} /></span><p className="ds-h2">{tr(k.h)}</p><p className="ds-p">{tr(k.p)}</p></div>)}
        </div>
        <div className="ds-ft">{tr({ uz: "To'garak jadvali · 2026", ru: 'Расписание кружков · 2026' })}</div>
      </div>
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish): bosh sahifa — odam avval nimani ko'radi? =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Sayt qaysi muammoni hal qilishini', ru: 'Какую проблему решает сайт' } },
  { id: 'b', label: { uz: "Saytning hamma sahifalari ro'yxatini", ru: 'Список всех страниц сайта' } },
  { id: 'c', label: { uz: 'Saytni kim yasaganini', ru: 'Кто сделал сайт' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const demo = useDemo();
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const isNarrow = useIsMobile(768);
  const resultRef = useRef(null);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: v === 'a' });
    if (isNarrow) setTimeout(() => { if (resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 140);
  };
  return (
    <Stage eyebrow={tr({ uz: 'CSS Praktika · kirish', ru: 'CSS практика · введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? { uz: 'Javobni tanlang', ru: 'Выберите ответ' } : { uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <h1 className="title h-title fade-up">{tr({ uz: <>Saytingizga kirgan odam avval <span className="italic" style={{ color: T.accent }}>nimani</span> ko'radi?</>, ru: <>Что человек <span className="italic" style={{ color: T.accent }}>первым</span> увидит на вашем сайте?</> })}</h1>
        <Mentor>{tr({ uz: <>Bugun Demo Day saytingizning bosh sahifasi shunday bo'ladi. Unga qarang va javobni tanlang.</>, ru: <>Сегодня главная страница вашего сайта для Demo Day станет такой. Посмотрите на неё и выберите ответ.</> })}</Mentor>
        <Split>
          <Col><p className="flow-label">{tr({ uz: 'Bugun oxirida · namuna', ru: 'Сегодня к концу · образец' })}</p><DemoSahifa holat="uslub" uslub={demo.d.uslub || USLUB_STD} /></Col>
          <Col>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HOOK_OPTS.map((o) => { const on = picked === o.id; return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>); })}
            </div>
            <div ref={resultRef} className="am-javob-joy">{picked !== null && (
              <div className={`${picked === 'a' ? 'frame-success' : 'frame-soft'} fade-step`}>
                <p className="body" style={{ margin: 0, color: T.ink }}>{picked === 'a'
                  ? tr({ uz: <><b>Aynan!</b> Bosh sahifa bir qarashda aytadi: qanday muammo va sayt uni qanday hal qiladi.</>, ru: <><b>Именно!</b> Главная страница с первого взгляда говорит: какая проблема и как сайт её решает.</> })
                  : tr({ uz: <><b>Qiziq fikr!</b> Sarlavhaga qarang: u muammoga yechimni aytadi — odam shuni birinchi ko'radi.</>, ru: <><b>Интересная мысль!</b> Посмотрите на заголовок: он называет решение проблемы — его человек видит первым.</> })}</p>
              </div>
            )}</div>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda natija namunasi · o'ngda «Avval tayyorlaning» (alohida karta) + 3 blok =====
const REJA_BLOK = [
  { t: { uz: 'Loyiha va bosh sahifa', ru: 'Проект и главная страница' }, tag: 'HTML' },
  { t: { uz: 'Dizayn', ru: 'Дизайн' }, tag: { uz: 'uslub', ru: 'стиль' } },
  { t: { uz: "O'z rangingiz", ru: 'Ваш цвет' }, tag: 'Ctrl+H' }
];
const TAYYOR = [
  { uz: <>Ish stolida <span className="qcode">mening-saytim</span> papkasini yarating va VS Code'da oching.</>, ru: <>Создайте на рабочем столе папку <span className="qcode">mening-saytim</span> и откройте её в VS Code.</> },
  { uz: <>Ichida <span className="qcode">index.html</span> va <span className="qcode">style.css</span> yarating; <span className="qcode">index.html</span> da <span className="qcode">!</span> + Tab, Go Live.</>, ru: <>Создайте внутри <span className="qcode">index.html</span> и <span className="qcode">style.css</span>; в <span className="qcode">index.html</span> — <span className="qcode">!</span> + Tab, Go Live.</> },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' }
];
// F-1015-362: pastga ochilmaydi — o'rtada oyna (⛶ kabi); ✕, Esc yoki fon bilan yopiladi, fokus tugmaga qaytadi; portal — .lesson-root (zoom va CSS shu yerda)
const TayyorTugma = () => {
  const [ochiq, setOchiq] = useState(false);
  const [korgan, setKorgan] = useState(false);
  const btnRef = useRef(null);
  const yopRef = useRef(null);
  const yop = () => { setOchiq(false); setTimeout(() => btnRef.current && btnRef.current.focus(), 0); };
  useEffect(() => {
    if (!ochiq) return;
    const onKey = (e) => { if (e.key === 'Escape') yop(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    yopRef.current && yopRef.current.focus();
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [ochiq]);
  const sarlavha = <>{tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })} · {tr({ uz: `${TAYYOR.length} qadam`, ru: `${TAYYOR.length} шага` })}</>;
  return (
    <div className="am-tt-w fade-up delay-1"><div className={`am-tayyor am-tt ${korgan ? '' : 'am-tt-nafas'}`}>
      <button ref={btnRef} type="button" className="am-tt-btn" aria-haspopup="dialog" aria-expanded={ochiq} onClick={() => { setOchiq(true); setKorgan(true); }}>
        <span className="am-tayyor-h">{sarlavha}</span>
        <span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && createPortal(<>
        <div className="zoom-backdrop" onClick={yop} />
        <div className="am-tt-oyna" role="dialog" aria-modal="true" aria-label={tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })}>
          <div className="am-tt-oyna-h"><span className="am-tayyor-h">{sarlavha}</span><button ref={yopRef} type="button" className="am-tt-yop" onClick={yop} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button></div>
          <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{tr(x)}</span></li>)}</ol>
          <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Davom etish».", ru: 'Готово — «Продолжить».' })}</p>
        </div>
      </>, (btnRef.current && btnRef.current.closest('.lesson-root')) || document.body)}
    </div></div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => {
  const demo = useDemo();
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun Demo Day saytingizni <span className="italic" style={{ color: T.accent }}>boshlaysiz</span></>, ru: <>Сегодня вы <span className="italic" style={{ color: T.accent }}>начинаете</span> сайт для Demo Day</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bugun bosh sahifa: HTML'ni Gemini tez yozadi, asosiy vaqt — dizaynga. Qolgan sahifalar — Netlify darsida.</>, ru: <>Сегодня — главная страница: HTML быстро пишет Gemini, основное время — на дизайн. Остальные страницы — на уроке Netlify.</> })}</Mentor>
        <div className="am-reja">
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</p>
            <DemoSahifa holat="uslub" uslub={demo.d.uslub || USLUB_STD} />
          </Col>
          <Col>
            <TayyorTugma />
            <p className="flow-label" style={{ marginTop: 6 }}>{tr({ uz: 'Bugungi 3 blok', ru: '3 блока сегодня' })}</p>
            <ol className="roadmap">{REJA_BLOK.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.t)}</span><span className="step-tag">{tr(s.tag)}</span></span></li>))}</ol>
          </Col>
        </Split>
        </div>
      </div>
    </Stage>
  );
};

// ===== a1 · a2 · a3 — AMALIYOT BLOKLARI (F-1015-310: to'liq prompt + nusxalash, tugmasiz qadamlar) =====
// Uslub bo'yicha aniq dizayn talablari — promptga qo'yiladi (rang kodlari maket bilan bir xil, kontrast ≥ 4.5)
const USLUB_SPEC = {
  minimal: { font: 'Inter', rang: { uz: 'fon #ffffff, matn #16181d, urg\'u rang #d4380d', ru: 'фон #ffffff, текст #16181d, акцентный цвет #d4380d' }, menyu: { uz: "pastida ingichka kulrang chiziq", ru: 'под ним тонкая серая линия' }, karta: { uz: "oq fon, ingichka ramka, yumshoq soya, burchak 12px", ru: 'белый фон, тонкая рамка, мягкая тень, углы 12px' } },
  yorqin: { font: 'Nunito', rang: { uz: "fon #fff8ef, matn #16181d, menu foni ko'k #1d4ed8 (oq yozuv), urg'u rang #c2410c", ru: 'фон #fff8ef, текст #16181d, фон меню синий #1d4ed8 (белый текст), акцентный цвет #c2410c' }, menyu: { uz: "ko'k fonda oq yozuv", ru: 'белый текст на синем фоне' }, karta: { uz: "oq fon, rangli ramka, katta soya, burchak 16px", ru: 'белый фон, цветная рамка, большая тень, углы 16px' } },
  qorongi: { font: 'Poppins', rang: { uz: "fon #0f172a, matn #f1f5f9, kartalar #1e293b, urg'u rang #34d399 (tugma yozuvi to'q)", ru: 'фон #0f172a, текст #f1f5f9, карточки #1e293b, акцентный цвет #34d399 (текст кнопки тёмный)' }, menyu: { uz: "pastida to'q kulrang chiziq", ru: 'под ним тёмно-серая линия' }, karta: { uz: "to'q fon #1e293b, ingichka ramka, burchak 12px", ru: 'тёмный фон #1e293b, тонкая рамка, углы 12px' } },
  gradient: { font: 'Poppins', rang: { uz: "fon #fdf4ff, matn #16181d, bosh qism foni binafsha-pushti gradient (#ede9fe → #fce7f3), urg'u rang #7e22ce", ru: 'фон #fdf4ff, текст #16181d, фон главного блока — фиолетово-розовый градиент (#ede9fe → #fce7f3), акцентный цвет #7e22ce' }, menyu: { uz: "pastida ingichka chiziq", ru: 'под ним тонкая линия' }, karta: { uz: "oq fon, yumshoq binafsha soya, burchak 16px", ru: 'белый фон, мягкая фиолетовая тень, углы 16px' } },
};
const AMALIYOT = {
  a1: {
    eyebrow: { uz: 'Amaliyot 1 · HTML', ru: 'Практика 1 · HTML' },
    title: { uz: "Loyihangizni yozing — Gemini HTML'ni quradi.", ru: 'Опишите проект — Gemini соберёт HTML.' },
    forma: true, ongdaQadam: true,
    qadamlar: [
      { uz: "Loyihangizni yozing va «Saqlash»ni bosing — prompt tayyor bo'ladi.", ru: 'Опишите проект и нажмите «Сохранить» — промпт будет готов.' },
      { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring.", ru: '«Скопировать промпт» → вставьте в gemini.google.com и отправьте.' },
      { uz: "Javobdagi kodni `index.html` ga qo'ying (bor kod o'rniga), `Ctrl+S`.", ru: 'Вставьте код из ответа в `index.html` (вместо старого), `Ctrl+S`.' },
      { uz: "Live Server'da qarang: menu, sarlavha, tugmalar, 3 karta, footer — hammasi bormi? Yo'q bo'lsa, Gemini'ga aniq yozing: «… qo'shilmagan, qo'sh».", ru: 'Посмотрите в Live Server: меню, заголовок, кнопки, 3 карточки, footer — всё есть? Если нет, напишите Gemini точно: «… нет, добавь».' }
    ],
    prompt: (p) => ({ uz: `Demo Day loyiham — «${p.nom}» — uchun bosh sahifa: index.html'ni yoz.\nMuammo: ${p.muammo}.\nSaytda bo'lsin: ${p.talab}.\nTuzilishi:\n– tepada: chapda sayt nomi, o'ngda menu (Bosh sahifa, Aloqa) va bitta tugma;\n– bosh qism: kichik yozuv, katta sarlavha (saytim nima qilishini aytsin), muammo haqida bitta gap, ikki tugma;\n– 3 ta karta: talablarimdan 3 tasi, har birida qisqa sarlavha va bitta gap;\n– eng pastda footer: sayt nomi va yil.\nHar qismga tushunarli class nomi ber: header, hero, kartalar, karta, footer.\nstyle.css <link> bilan ulangan bo'lsin. CSS yozma, faqat HTML. To'liq faylni qaytar.`, ru: `Напиши index.html — главную страницу моего проекта для Demo Day «${p.nom}».\nПроблема: ${p.muammo}.\nНа сайте должно быть: ${p.talab}.\nСтруктура:\n– вверху: слева название сайта, справа меню (Главная, Контакты) и одна кнопка;\n– главный блок: маленькая надпись, крупный заголовок (что делает мой сайт), одна фраза о проблеме, две кнопки;\n– 3 карточки: 3 моих требования, в каждой короткий заголовок и одна фраза;\n– внизу footer: название сайта и год.\nДай частям понятные class: header, hero, kartalar, karta, footer.\nПодключи style.css через <link>. CSS не пиши, только HTML. Верни файл целиком.` }),
    holat: 'xom', halqa: null,
    osti: { uz: "HTML — sahifaning tuzilmasi: hamma qism bor, lekin hali bezaksiz.", ru: 'HTML — структура страницы: все части на месте, но пока без оформления.' },
  },
  a2: {
    eyebrow: { uz: 'Amaliyot 2 · dizayn', ru: 'Практика 2 · дизайн' },
    title: { uz: 'Saytingiz uchun uslub tanlang.', ru: 'Выберите стиль для сайта.' },
    uslubTanlov: true,
    qadamlar: [
      { uz: "«Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi `{…}` o'rniga `index.html` kodingizni qo'ying.", ru: '«Скопировать промпт» → вставьте в Gemini, вместо `{…}` в конце — код вашего `index.html`.' },
      { uz: "Javobdagi kodni `style.css` ga qo'ying, `Ctrl+S`.", ru: 'Вставьте код из ответа в `style.css`, `Ctrl+S`.' },
      { uz: "Live Server'dagi natijani «Kutilgan natija» surati bilan solishtiring.", ru: 'Сравните результат в Live Server с картинкой «Ожидаемый результат».' }
    ],
    prompt: (p, st) => {
      const sp = USLUB_SPEC[st.id];
      return { uz: `Bosh sahifamga zamonaviy dizayn ber — faqat style.css'ni yoz, HTML'ni o'zgartirma.\nUslub: ${st.name.uz} — ${st.desc.uz}\nRanglar: ${sp.rang.uz}.\nShrift: Google Fonts'dagi «${sp.font}» (style.css boshida @import bilan); sarlavhalar qalin.\nMenyu: chapda sayt nomi, o'ngda linklar; ${sp.menyu.uz}.\nBosh qism: sahifa markazida, sarlavha 48px, ostida kulrang matn; tugma urg'u rangda, yumaloq burchak, sichqoncha ustida biroz to'qroq.\n3 ta karta: bir qatorda, orasida 24px; ${sp.karta.uz}.\nSahifa eni 1000px dan oshmasin, markazda. Telefonda kartalar ustma-ust tursin.\nMana kodim: {index.html kodini shu yerga qo'ying}`,
        ru: `Сделай моей главной странице современный дизайн — пиши только style.css, HTML не меняй.\nСтиль: ${st.name.ru} — ${st.desc.ru}\nЦвета: ${sp.rang.ru}.\nШрифт: «${sp.font}» из Google Fonts (через @import в начале style.css); заголовки жирные.\nМеню: слева название сайта, справа ссылки; ${sp.menyu.ru}.\nГлавный блок: по центру страницы, заголовок 48px, под ним серый текст; кнопка акцентного цвета, скруглённая, при наведении чуть темнее.\n3 карточки: в один ряд, промежуток 24px; ${sp.karta.ru}.\nШирина страницы не больше 1000px, по центру. В телефоне карточки друг под другом.\nВот мой код: {вставьте сюда код index.html}` };
    },
    holat: 'uslub', halqa: 'karta',
    osti: { uz: "Gemini javobida kartalarni yonma-yon qo'ygan `display: flex` va `gap` ni toping.", ru: 'Найдите в ответе Gemini `display: flex` и `gap` — они ставят карточки в ряд.' },
  },
  a3: {
    eyebrow: { uz: "Amaliyot 3 · Gemini'siz", ru: 'Практика 3 · без Gemini' },
    title: { uz: "Saytga o'zingiz tanlagan rangni bering.", ru: 'Дайте сайту цвет, который выбрали сами.' },
    qadamlar: [
      (acc) => ({ uz: `\`style.css\` da asosiy rangni toping — tugma va sarlavhalarda takrorlanadigan kod (sizning uslubingizda — \`${acc}\`).`, ru: `Найдите в \`style.css\` основной цвет — код, который повторяется в кнопке и заголовках (в вашем стиле — \`${acc}\`).` }),
      { uz: "`Ctrl+H` bosing: yuqori qatorga eski rangni, pastkisiga yangisini yozing va `Ctrl+Alt+Enter` bosing — hammasi birdan almashadi.", ru: 'Нажмите `Ctrl+H`: в верхнюю строку — старый цвет, в нижнюю — новый, и нажмите `Ctrl+Alt+Enter` — заменится всё сразу.' },
      { uz: "`Ctrl+S` — Live Server'da sahifaga qarang.", ru: '`Ctrl+S` — посмотрите на страницу в Live Server.' }
    ],
    yordam: { uz: "Rang kodini bilmasangiz — VS Code'da rang kodi yonidagi kichik kvadratni bosing, rang tanlagich ochiladi.", ru: 'Не знаете код цвета — нажмите в VS Code на маленький квадрат рядом с кодом цвета, откроется палитра.' },
    holat: 'rang', halqa: null, masalanYorliq: true,
  }
};
const USLUB_ACC = { minimal: '#d4380d', yorqin: '#c2410c', qorongi: '#34d399', gradient: '#7e22ce' }; // USLUB_SPEC dagi urg'u rang
const LOYIHA_MAYDON = [
  { k: 'nom', l: { uz: 'Loyihangiz nomi', ru: 'Название проекта' }, ph: { uz: "masalan: To'garak jadvali", ru: 'например: Расписание кружков' } },
  { k: 'muammo', l: { uz: 'Qanday muammoni hal qiladi?', ru: 'Какую проблему решает?' }, ph: { uz: "masalan: jadval faqat devorda — uydan ko'rib bo'lmaydi", ru: 'например: расписание только на стене — из дома не посмотришь' } },
  { k: 'talab', l: { uz: "Saytda nima bo'lsin? (talablaringiz)", ru: 'Что должно быть на сайте? (ваши требования)' }, ph: { uz: "masalan: to'garaklar jadvali, xona raqami, ustoz ismi", ru: 'например: расписание кружков, номер кабинета, имя учителя' } },
];
const PromptBlok = ({ matn, tayyor }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-karta fade-up delay-2">
      {tayyor && <p className="am-tayyor-ok">{tr(tayyor)}</p>}
      <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Prompt', ru: 'Промпт' })}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Promptni nusxalash', ru: 'Скопировать промпт' })}</button></div>
      <pre className="am-masalan">{matn}</pre>
    </div>
  );
};
const Qadamlar = ({ b, uslub, cls = '' }) => (
  <div className={`am-karta ${cls}`}>
    <p className="flow-label">{tr({ uz: 'Qadamlar', ru: 'Шаги' })}</p>
    <ol className="am-qadam">{b.qadamlar.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(typeof x === 'function' ? x(USLUB_ACC[uslub]) : x))}</span></li>)}</ol>
    {b.yordam && <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(b.yordam)}</p>}
  </div>
);
const ScreenAmaliyot = ({ screen, onNext, onPrev }) => {
  const b = AMALIYOT[SCREEN_META[screen].id];
  const demo = useDemo();
  const uslub = demo.d.uslub || USLUB_STD;
  const st = STYLES.find(s => s.id === uslub) || STYLES[0];
  const css = demo.d.css || {};
  const [lp, setLp] = useState({ nom: css.nom || '', muammo: css.muammo || '', talab: css.talab || '' });
  const [yigil, setYigil] = useState(!!css.saqlangan); // F-1015-316: saqlangach forma yig'iladi, «Tahrirlash» bilan ochiladi
  const yoz = (k, v) => { const n = { ...lp, [k]: v }; setLp(n); demo.set({ css: { ...(demo.d.css || {}), ...n }, ...(n.nom.trim() && n.muammo.trim() ? { yechim: n.nom.trim(), muammo: n.muammo.trim() } : {}) }); };
  const toliq = LOYIHA_MAYDON.every(m => lp[m.k].trim().length >= 3);
  const saqla = () => { if (!toliq) return; demo.set({ css: { ...(demo.d.css || {}), ...lp, saqlangan: true } }); setYigil(true); };
  // bosqichma-bosqich: a1 — saqlangach (tahrirlashda ham prompt jonli yangilanadi); a2 — uslub tanlangach
  const ochiq = b.forma ? (toliq && !!(demo.d.css && demo.d.css.saqlangan)) : b.uslubTanlov ? !!demo.d.uslub : true;
  const matn = b.prompt && ochiq ? tr(b.forma ? b.prompt({ nom: lp.nom.trim(), muammo: lp.muammo.trim(), talab: lp.talab.trim() }) : b.prompt(null, st)) : null;
  return (
    <Stage eyebrow={tr(b.eyebrow)} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(b.title)}</h2></div>
        <Split>
          <Col>
            {b.forma && !yigil && <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Loyihangiz', ru: 'Ваш проект' })}</p>
              {LOYIHA_MAYDON.map((m, i) => <label key={m.k} className="am-maydon"><span>{tr(m.l)}</span><input className="am-input" value={lp[m.k]} placeholder={tr(m.ph)} autoFocus={i === 0 && !lp.nom} onChange={e => yoz(m.k, e.target.value)} /></label>)}
              <button type="button" className="am-saqla" disabled={!toliq} onClick={saqla}>{tr(toliq ? { uz: 'Saqlash', ru: 'Сохранить' } : { uz: "Uchala qatorni to'ldiring", ru: 'Заполните три строки' })}</button>
            </div>}
            {b.forma && yigil && <div className="am-karta am-loyiha am-ochil">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Loyihangiz', ru: 'Ваш проект' })}</p><button type="button" className="am-nusxa" onClick={() => setYigil(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button></div>
              <p className="am-loyiha-nom">{lp.nom}</p>
              <p className="body" style={{ margin: 0, color: T.ink }}><b>{tr({ uz: 'Muammo:', ru: 'Проблема:' })}</b> {lp.muammo}</p>
              <p className="body" style={{ margin: 0, color: T.ink }}><b>{tr({ uz: 'Talablar:', ru: 'Требования:' })}</b> {lp.talab}</p>
            </div>}
            {b.uslubTanlov && <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Uslub', ru: 'Стиль' })}</p>
              <div className="am-uslub">{STYLES.map(s => <button key={s.id} type="button" className={`am-uslub-btn ${demo.d.uslub === s.id ? 'on' : ''}`} onClick={() => demo.set({ uslub: s.id })}><b>{tr(s.name)}</b><span>{tr(s.sub)}</span></button>)}</div>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(demo.d.uslub ? { uz: 'Har kim boshqa uslub tanlasa, sinfda bir xil sayt chiqmaydi.', ru: 'Если каждый выберет свой стиль, в классе не будет одинаковых сайтов.' } : { uz: "Uslubni tanlang — keyin prompt va qadamlar ochiladi.", ru: 'Выберите стиль — затем откроются промпт и шаги.' })}</p>
            </div>}
            {ochiq && matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={b.forma ? { uz: "Prompt tayyor — endi Gemini orqali quring.", ru: 'Промпт готов — теперь стройте с помощью Gemini.' } : null} /></div>}
            {!b.ongdaQadam && ochiq && <Qadamlar b={b} uslub={uslub} cls="am-ochil" />}
          </Col>
          <Col>
            {b.ongdaQadam ? <Qadamlar b={b} uslub={uslub} cls="fade-up delay-2" /> : <>
              <p className="flow-label">{tr(b.masalanYorliq ? { uz: 'Kutilgan natija · masalan', ru: 'Ожидаемый результат · например' } : { uz: 'Kutilgan natija · namuna', ru: 'Ожидаемый результат · образец' })}</p>
              <DemoSahifa holat={b.holat} uslub={uslub} halqa={b.halqa} />
              {b.osti && <p className="small am-osti">{fmtCode(tr(b.osti))}</p>}
            </>}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a4 — YAXSHILASH (F-1015-316: kartochkalar o'rniga): saytni ro'yxat bo'yicha tekshirish → bitta kamchilik → prompt; dars oxirigacha takror =====
const TEKSHIR = [
  { uz: 'Menudagi linklar bosiladimi?', ru: 'Ссылки в меню нажимаются?' },
  { uz: "Oynani toraytiring: telefonda kartalar sig'adimi?", ru: 'Сузьте окно: карточки помещаются на телефоне?' },
  { uz: 'Hamma matn sizning loyihangiz haqidami?', ru: 'Весь текст — про ваш проект?' },
  { uz: 'Tugma va sarlavhalar bir xil rangdami?', ru: 'Кнопки и заголовки одного цвета?' },
  { uz: 'Eng pastda footer bormi?', ru: 'Внизу есть footer?' },
];
const YAX_QADAM = {
  qadamlar: [
    { uz: "Ro'yxat bo'yicha saytingizga qarang va bitta kamchilikni tanlang.", ru: 'Проверьте сайт по списку и выберите один недочёт.' },
    { uz: 'Uni yozing — prompt yig\'iladi.', ru: 'Опишите его — промпт соберётся.' },
    { uz: "«Promptni nusxalash» → Gemini'ga yuboring, javobdagi kodni faylga qo'ying, `Ctrl+S`.", ru: '«Скопировать промпт» → отправьте в Gemini, вставьте код из ответа в файл, `Ctrl+S`.' },
    { uz: '«Keyingi kamchilik» — va yana. Dars oxirigacha.', ru: '«Следующий недочёт» — и снова. До конца урока.' }
  ]
};
const YAX_MAYDON = [
  { k: 'yoqmadi', l: { uz: 'Nima yoqmadi?', ru: 'Что не нравится?' }, ph: { uz: "masalan: telefonda kartalar sig'mayapti", ru: 'например: на телефоне карточки не помещаются' } },
  { k: 'qanday', l: { uz: "Qanday bo'lsin?", ru: 'Как должно быть?' }, ph: { uz: "masalan: telefonda kartalar ustma-ust tursin", ru: 'например: на телефоне карточки друг под другом' } },
];
const ScreenYaxshilash = ({ screen, onNext, onPrev }) => {
  const demo = useDemo();
  const [f, setF] = useState({ yoqmadi: '', qanday: '' });
  const [soni, setSoni] = useState(() => (demo.d.css && demo.d.css.yaxshi) || 0);
  const tayyor = YAX_MAYDON.every(m => f[m.k].trim().length >= 3);
  const keyingi = () => { const n = soni + 1; setSoni(n); demo.set({ css: { ...(demo.d.css || {}), yaxshi: n } }); setF({ yoqmadi: '', qanday: '' }); };
  const matn = tayyor ? tr({ uz: `Saytimni yaxshila — faqat shu joyni o'zgartir, qolganiga tegma.\nYoqmagani: ${f.yoqmadi.trim()}.\nQanday bo'lsin: ${f.qanday.trim()}.\nO'zgargan faylni to'liq qaytar.\nMana kodim: {index.html va style.css kodini shu yerga qo'ying}`, ru: `Улучши мой сайт — меняй только это место, остальное не трогай.\nНе нравится: ${f.yoqmadi.trim()}.\nКак должно быть: ${f.qanday.trim()}.\nВерни изменённый файл целиком.\nВот мой код: {вставьте сюда код index.html и style.css}` }) : null;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 4 · yaxshilash', ru: 'Практика 4 · улучшение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: 'Saytingizni tekshiring va yaxshilang.', ru: 'Проверьте и улучшите сайт.' })}</h2></div>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Bitta kamchilik', ru: 'Один недочёт' })}</p>{soni > 0 && <span className="am-soni">{tr({ uz: `Yaxshilandi: ${soni}`, ru: `Улучшено: ${soni}` })}</span>}</div>
              {YAX_MAYDON.map((m, i) => <label key={m.k} className="am-maydon"><span>{tr(m.l)}</span><input className="am-input" value={f[m.k]} placeholder={tr(m.ph)} autoFocus={i === 0} onChange={e => setF({ ...f, [m.k]: e.target.value })} /></label>)}
            </div>
            {matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={{ uz: "Prompt tayyor — Gemini'ga yuboring.", ru: 'Промпт готов — отправьте в Gemini.' }} /></div>}
            {matn && <button type="button" className="am-saqla am-ochil" onClick={keyingi}>{tr({ uz: 'Keyingi kamchilik', ru: 'Следующий недочёт' })}</button>}
          </Col>
          <Col>
            <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Saytingizni tekshiring', ru: 'Проверьте сайт' })}</p>
              <ul className="am-band">{TEKSHIR.map((x, i) => <li key={i}>{tr(x)}</li>)}</ul>
            </div>
            <Qadamlar b={YAX_QADAM} uslub={demo.d.uslub || USLUB_STD} cls="fade-up delay-2" />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== s16 — TOPSHIRISH (QTest, yagona ballik): ✔ C =====
const Screen16 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Topshirish', ru: 'Сдача' })}
    questionText="Kartochkalarni bir qatorga qaysi qoida tizadi?"
    question={<><h2 className="title h-ask">{tr({ uz: <>Kartochkalarni bir qatorga qaysi <span className="italic" style={{ color: T.accent }}>qoida</span> tizadi?</>, ru: <>Какое <span className="italic" style={{ color: T.accent }}>правило</span> ставит карточки в один ряд?</> })}</h2><div style={{ marginTop: 'clamp(10px,1.6vw,14px)' }}><Mentor>{tr({ uz: "Avval sahifangizni ustozga ko'rsating. Keyin savolga javob bering.", ru: 'Сначала покажите страницу учителю. Потом ответьте на вопрос.' })}</Mentor></div></>}
    options={['`ul { text-align: center; }`', '`li { margin: 0 auto; }`', '`ul { display: flex; }`', '`li { padding: 16px; }`']} correctIdx={2}
    explainCorrect={{ uz: '`display: flex` ichidagi elementlarni bir qatorga tizadi.', ru: '`display: flex` выстраивает вложенные элементы в один ряд.' }}
    explainWrong={{ 0: { uz: '`text-align` matnni joylaydi, kartochkalarni emas.', ru: '`text-align` выравнивает текст, а не карточки.' }, 1: { uz: "`margin: 0 auto` bitta blokni markazga qo'yadi.", ru: '`margin: 0 auto` ставит один блок по центру.' }, 3: { uz: "`padding` — kartochka ichidagi bo'shliq.", ru: '`padding` — отступ внутри карточки.' }, default: { uz: "Elementlarni yonma-yon qo'yadigan qoidani eslang.", ru: 'Вспомните правило, которое ставит элементы в ряд.' } }} />
);

// ===== SCREEN 17 — YAKUN =====
const Screen17 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  // F-0803-08: uyga vazifa kapsulasi — bosilganda topshiriq kartasi ochiladi
  const [hwOpen, setHwOpen] = useState(false);
  const [hwCharge, setHwCharge] = useState(false);
  const fireHw = () => { if (hwCharge || hwOpen) return; setHwCharge(true); setTimeout(() => { setHwOpen(true); setHwCharge(false); }, 500); };
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
  const csLocked = !!(_live && (_live.mode === 'solo' || _live.mode === 'review' || studentSolo)); // F-1029-01: CodeStrike faqat ustozga ulangan jonli darsda — uyda/ko'rishda/sinf tugaganda yopiq, LMS Learn ochadi
  const openArena = async () => {
    if (isMentorL && quizSt === 'off') { try { await _live.quizControl('lobby', -1); } catch (e) { console.warn('[arena]', e); liveToast({ uz: "Jonli arena ochilmadi: server javob bermadi. Mashq rejimida ochildi — o'quvchilar ekranida ko'rinmaydi.", ru: 'Живая арена не открылась: сервер не ответил. Открыта в режиме тренировки — на экранах учеников не видна.' }); setArenaSolo(true); setArena(true); return; } }
    setArenaSolo(studentSolo); setArena(true);
  };
  const audio = useAudio([{ id: 's17', text: "Tabriklayman! Demo Day saytingizning bosh sahifasi tayyor: HTML'ni Gemini yozdi, uslubni siz tanladingiz va rangni o'zingiz berdingiz.", trigger: 'on_mount', waits_for: null }]);
  const RECAP = [{ uz: "Gemini'ga HTML'ni qismlari bilan aniq so'raysiz", ru: 'Точно просите у Gemini HTML с перечнем частей' }, { uz: 'Uslubni so\'z bilan tasvirlab, dizayn olasiz', ru: 'Описываете стиль словами и получаете дизайн' }, { uz: '`display: flex` + `gap` — kartalar bir qatorda', ru: '`display: flex` + `gap` — карточки в один ряд' }, { uz: "Rangni butun faylda `Ctrl+H` bilan o'zingiz almashtirasiz", ru: 'Сами меняете цвет во всём файле через `Ctrl+H`' }, { uz: "Saytni ro'yxat bo'yicha tekshirib, aniq so'rov bilan yaxshilaysiz", ru: 'Проверяете сайт по списку и улучшаете его точным запросом' }];
  const HW_ITEMS = HOMEWORK.items;
  // Kalit so'zlar (GLOSSARY) olib tashlandi — takrorlash Flashcard sahifasida (4.2 etalon).
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><FinishBtn className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Tugatish', ru: 'Завершить' })} ✓</FinishBtn></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><div className="hero-chips"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'CSS praktika tugadi', ru: 'CSS практика завершена' })}</span><span className="score-chip fade-up">{correct}/{total} {tr({ uz: "to'g'ri", ru: 'верно' })}</span></div><h2 className="title h-title fade-up d1">{tr({ uz: <>Siz <span className="italic" style={{ color: T.accent }}>dizayner</span> bo'ldingiz.</>, ru: <>Вы стали <span className="italic" style={{ color: T.accent }}>дизайнером</span>.</> })}</h2>{/* 54-qonun (P0 PmUserStory / PmLesson2 qarori): h-sub qatori YO'Q - sarlavha o'zi yetadi. */}</div></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark
            stats={false}
            liveOn={studentLive}
            disabled={studentWait || csLocked}
            onClick={(studentWait || csLocked) ? undefined : openArena}
            hint={csLocked ? tr({ uz: "CodeStrike sinfda, ustoz bilan o'ynaladi", ru: 'CodeStrike — в классе, с ментором' }) : studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' })
              : studentSolo ? tr({ uz: "📖 Testni o'zim ishlash →", ru: '📖 Пройти тест самому →' })
              : studentLive ? (quizSt === 'done' ? tr({ uz: "🏆 Natijalarni ko'rish →", ru: '🏆 Посмотреть результаты →' }) : tr({ uz: '🔥 Testga kirish →', ru: '🔥 Войти в тест →' }))
              : isMentorL ? (quizSt === 'off' ? tr({ uz: '⚡ Testni ochish →', ru: '⚡ Открыть тест →' }) : tr({ uz: '⚡ Davom ettirish →', ru: '⚡ Продолжить →' }))
              : tr({ uz: '⚡ Testni ishlash →', ru: '⚡ Пройти тест →' })}
          />
        </div>
        {arena && <QuizArena live={(isMentorL && arenaSolo) ? { mode: 'self' } : (_live || { mode: 'self' })} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bezay olasiz', ru: 'Теперь вы умеете оформлять' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.06}s` }}><span className="ck">✓</span><span>{fmtCode(tr(r))}</span></li>))}</ul></div>
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${hwCharge ? 'charging' : ''}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, '--d': `${k.d}s` }}>{tr(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span>
            <span className="hw-big-s">{tr({ uz: "Topshiriqni ko'rish →", ru: 'Посмотреть задание →' })}</span>
          </button>
        </div>
        {hwOpen && <UygaVazifaKarta v={HW_V2} tr={tr} />}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: 'Nishonlaringiz', ru: 'Ваши награды' })} — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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

// ===== ⚡ MUSTAHKAMLASH-JANG (CodeStrike arena) =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi kod tokenlari (CSS mavzusi: xususiyat, qiymat, selektor)
const QZ_BG_SHAPES = [
  { ch: 'color:',   l: 6,  t: 18, s: 34, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: '{ }',      l: 84, t: 12, s: 34, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: 'padding',  l: 9,  t: 74, s: 26, c: 'rgba(255,110,70,0.15)',  d: 27, dl: 0.8 },
  { ch: '#FF4D26',  l: 76, t: 70, s: 24, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: 'font-size',l: 44, t: 86, s: 24, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: '.card',    l: 66, t: 24, s: 24, c: 'rgba(80,200,255,0.14)',  d: 17, dl: 0.4 },
  { ch: ';',        l: 24, t: 36, s: 30, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: 'margin',   l: 90, t: 46, s: 22, c: 'rgba(120,235,175,0.13)', d: 24, dl: 1.3 },
  { ch: 'bold',     l: 2,  t: 46, s: 22, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: "Matn (harflar) rangini qaysi xususiyat beradi?", ru: 'Какое свойство задаёт цвет текста (букв)?' }, opts: ["color", "background-color", "font-size", "text-align"], correct: 0 },
  { q: { uz: "Element orqa fon rangini qaysi xususiyat beradi?", ru: 'Какое свойство задаёт цвет заднего фона элемента?' }, opts: ["color", "border", "background-color", "margin"], correct: 2 },
  { q: { uz: "Matnni markazga qaysi qiymat qo'yadi?", ru: 'Какое значение ставит текст по центру?' }, opts: ["text-align: left", "text-align: center", "text-align: middle", "align: center"], correct: 1 },
  { q: { uz: "Linklarni bir qatorga tizadigan qoida?", ru: 'Правило, выстраивающее ссылки в один ряд?' }, opts: ["display: block", "display: none", "text-align: center", "display: flex"], correct: 3 },
  { q: { uz: "Flex elementlar orasidagi bo'shliqni nima ochadi?", ru: 'Что раздвигает flex-элементы (промежуток между ними)?' }, opts: ["gap", "padding", "margin-top", "border"], correct: 0 },
  { q: { uz: "Element ICHIDAGI bo'shliq qaysi xususiyat?", ru: 'Какое свойство — отступ ВНУТРИ элемента?' }, opts: ["margin", "gap", "padding", "text-align"], correct: 2 },
  { q: { uz: "Elementlar ORASIDAGI (tashqi) bo'shliq qaysi xususiyat?", ru: 'Какое свойство — отступ МЕЖДУ элементами (внешний)?' }, opts: ["padding", "gap", "border", "margin"], correct: 3 },
  { q: { uz: "CSS qoidasida `h1` — bu qaysi qism?", ru: 'Какая это часть правила CSS — `h1`?' }, opts: [{ uz: 'xususiyat', ru: 'свойство' }, { uz: 'selektor', ru: 'селектор' }, { uz: 'qiymat', ru: 'значение' }, { uz: 'izoh', ru: 'комментарий' }], correct: 1 },
  { q: { uz: "CSS qoidasida `color` — bu qaysi qism?", ru: 'Какая это часть правила CSS — `color`?' }, opts: [{ uz: 'xususiyat', ru: 'свойство' }, { uz: 'selektor', ru: 'селектор' }, { uz: 'qiymat', ru: 'значение' }, { uz: 'teg', ru: 'тег' }], correct: 0 },
  { q: { uz: "Har bir CSS satri qaysi belgi bilan tugaydi?", ru: 'Каким символом заканчивается каждая строка CSS?' }, opts: [{ uz: 'vergul ,', ru: 'запятая ,' }, { uz: 'nuqta .', ru: 'точка .' }, { uz: 'ikki nuqta :', ru: 'двоеточие :' }, { uz: 'nuqta-vergul ;', ru: 'точка с запятой ;' }], correct: 3 },
  { q: { uz: "Flex menuni gorizontal markazga qaysi xususiyat qo'yadi?", ru: 'Какое свойство ставит flex-меню в горизонтальный центр?' }, opts: ["align-items: center", "justify-content: center", "text-align: center", "gap: center"], correct: 1 },
  { q: { uz: "Kartani ekran markaziga qo'yuvchi qiymat?", ru: 'Значение, ставящее карточку в центр экрана?' }, opts: ["margin: 0", "margin: center", "margin: 0 auto", "padding: auto"], correct: 2 },
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
    const TOK = ['color:', 'padding', 'margin', '{ }', 'font-size', ';', '.card', '#FF4D26'];
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
  const [arenaRun] = useState(() => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)); // BUG-01 v2: shu ochilishning o'yin-ID'si (yopib qayta ochish — yangi o'yin)
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
            if (!isMentor && typeof live.arenaStart === 'function') live.arenaStart(arenaRun); // BUG-01 v2
            seenQRef.current = q; qStartRef.current = Date.now();
            deadlineRef.current = Date.now() + QUIZ_MS - (isMentor ? 0 : 700); // polling kechikish kompensatsiyasi
            setQi(q); setRemaining(deadlineRef.current - Date.now()); setPhase('q'); setAnsweredN(0);
          } else if (st === 'r') {
            if (q !== seenQRef.current) { seenQRef.current = q; setQi(q); } // kech kirgan ham natijani ko'radi
            setPhase(p => p === 'done' ? p : 'reveal');
          }
          else if (st === 'done') { setPhase('done'); if (!isMentor && typeof live.arenaDone === 'function') live.arenaDone(); }
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
  const soloStart = (i) => { if (typeof live.arenaStart === 'function') live.arenaStart(arenaRun); seenQRef.current = i; qStartRef.current = Date.now(); deadlineRef.current = Date.now() + QUIZ_MS; setQi(i); setRemaining(QUIZ_MS); setPhase('q'); };
  const soloNext = () => { const n = qi + 1; if (n >= QUIZ_BANK.length) { setPhase('done'); if (typeof live.arenaDone === 'function') live.arenaDone(); } else soloStart(n); };
  const soloReplay = () => { if (typeof live.arenaDone === 'function') live.arenaDone(); setSoloMode(true); setMyAnswers({}); soloStart(0); }; // BUG-01: qayta o'yin — mashq, CodeStrike natijasiga yozilmaydi
  // Jonli test tugagach «qayta ishlash» — mashq rejimiga o'tish (serverga yozilmaydi)
  const startPractice = () => { if (typeof live.arenaDone === 'function') live.arenaDone(); setSoloMode(true); setMyAnswers({}); soloStart(0); };

  const answer = (i) => {
    if (phase !== 'q' || isMentor || myAnswers[qi]) return;
    const elapsed = Math.min(QUIZ_MS, Date.now() - qStartRef.current);
    const correct = i === QUIZ_BANK[qi].correct;
    setMyAnswers(m => ({ ...m, [qi]: { picked: i, correct, elapsed } }));
    if (!soloMode && typeof live.submitAnswer === 'function') live.submitAnswer(QUIZ_BASE_IDX + qi, `quiz-${qi}`, i, correct, elapsed); // F-1023-01: jonli va solo birinchi o'yin hisob (codestrike); mashq (soloMode) emas
    if (solo) setPhase('reveal'); // yolg'iz o'yinda javob darhol ochiladi
  };

  // Joriy streak (shu savolgacha ketma-ket to'g'ri)
  const streakUpTo = (k) => { let s = 0; for (let i = 0; i <= k; i++) { if (myAnswers[i]?.correct) s++; else s = 0; } return s; };
  const myPtsFor = (k) => { const a = myAnswers[k]; if (!a || !a.correct) return 0; return quizPts(a.elapsed) + (streakUpTo(k) >= 2 ? 100 : 0); };

  // Reyting (jonli) / solo hisob
  const board = players.map(p => { const s = quizScore(qRows.filter(r => r.player_id === p.id)); return { id: p.id, nickname: p.nickname, ...s }; }).sort(arenaOrder(players)); // teng ochkoda — oldin qo'shilgan yuqorida; LMS podiumi bilan bitta qoida (28.10)
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
  // Javob ochilgach keyingi savolga avto o'tish (F-0922-03). Soat faqat MENTOR
  // brauzerida; o'quvchilar server orqali ergashadi. Oxirgi savolda avto YO'Q —
  // «G'oliblarni e'lon qilish» mentorning daqiqasi.
  const autoNext = useAutoNext({
    on: phase === 'reveal' && isMentor && !solo && !lastQ,
    onFire: () => ctrl('q', qi + 1),
    qKey: qi,
  });
  const my = qi >= 0 ? myAnswers[qi] : null;

  // Mentor test o'rtasida ✕ bossa — ogohlantiramiz: sinf arenada kutib qoladi.
  const closeArena = () => {
    if (isMentor && !solo && phase !== 'done') {
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚡ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nПотом можно вернуться ровно к этому месту через «⚡ Продолжить».\n\nВсё равно закрыть?' }))) return;
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

      {/* QUTQARUV: jonli dars tugadi/mentor chiqib ketdi — o'quvchi osilib qolmaydi, arenani yopadi.
      F-1029-01: ustozsiz CodeStrike davom etmaydi (mashq yo'q) — berilgan javoblar qoladi */}
      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — CodeStrike to'xtadi.", ru: '⚠️ Живой урок завершён — CodeStrike остановлен.' })}</span>
          <button className="qz-btn" onClick={closeArena}>{tr({ uz: 'Yopish', ru: 'Закрыть' })}</button>
        </div>
      )}

      {/* ===== LOBBY ===== */}
      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: <>{QUIZ_BANK.length} savol · har biriga {QUIZ_MS / 1000} soniya · tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!</>, ru: <>{QUIZ_BANK.length} вопросов · по {QUIZ_MS / 1000} секунд · чем быстрее верный ответ — тем больше баллов. Серия верных ответов даёт 🔥 бонус!</> })}</p>
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
                : <span className="qz-res-t">{tr(my ? { uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' } : { uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Быстрее! ⏱' })}</span>}
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
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl('done', qi) : autoNext.fireNow()}>{tr(lastQ ? { uz: "🏁 G'oliblarni e'lon qilish", ru: '🏁 Объявить победителей' } : { uz: 'Keyingi savol →', ru: 'Следующий вопрос →' })}</button>}
          {isMentor && !lastQ && <button className="qz-btn ghost qz-auto" onClick={autoNext.auto ? autoNext.pause : autoNext.resume} title={tr({ uz: "Avto o'tishni to'xtatish — javobni tushuntirish uchun (arena oxirigacha)", ru: 'Остановить авто-переход — чтобы объяснить ответ (до конца арены)' })}>{autoNext.auto ? `${tr({ uz: "To'xtatish", ru: 'Пауза' })}${autoNext.sec ? ` · ${autoNext.sec}` : ''}` : tr({ uz: '▶ Avto', ru: '▶ Авто' })}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{tr(lastQ ? { uz: "🏁 Natijani ko'rish", ru: '🏁 Посмотреть результат' } : { uz: 'Keyingi →', ru: 'Дальше →' })}</button>}
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
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? tr({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · самая длинная серия 🔥x${soloScore.maxStreak}` }) : ''}</p>
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
                      {b && <span className="qz-pod-pts">{tr({ uz: `${b.pts} ball`, ru: `${b.pts} баллов` })} · {b.ok}/{QUIZ_BANK.length}</span>}
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

// ===== 🏅 ACHIEVEMENTS (nishonlar) — dars davomidagi real bosqichlar uchun =====
// (Nomlar/tavsiflar — Metodist sayqallaydi; struktura + trigger wiring — Quruvchi.)
const ACHIEVEMENTS = {
  spacer:   { icon: '🚀', name: 'Kick Off!',    desc: { uz: 'Demo Day saytingiz bosh sahifasini boshladingiz', ru: 'Вы начали главную страницу сайта для Demo Day' } },
  layout:   { icon: '🎨', name: 'Styled!',      desc: { uz: "Saytingizga o'zingiz tanlagan uslubni berdingiz", ru: 'Вы дали сайту выбранный стиль' } },
  color:    { icon: '🖌️', name: 'Color Master', desc: { uz: "Saytga o'zingiz tanlagan rangni berdingiz", ru: 'Вы дали сайту свой цвет' } },
  graduate: { icon: '🏆', name: 'Designer',     desc: { uz: 'CSS praktikani oxirigacha bajardingiz', ru: 'Вы прошли CSS практику до конца' } },
};
// F-1015-303 (foydalanuvchi qarori): nishon BLOKKA bog'lanadi — blok «Davom etish»da beriladi (bonus, §184; isbot yo'q — ustoz ko'rib turadi).
const BLOK_ACH = { a1: 'spacer', a2: 'layout', a3: 'color' };
// Testga bog'langan nishon yo'q (yagona ballik — s16).
const ACH_TRIGGERS = {};

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
// Navbatda bittasi ko'rsatiladi (to'liq-ekran bayram) — tugagach keyingisi chiqadi
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}

// 🏠 LMS uchun statik uy-vazifa deklaratsiyasi — VS Code'da, o'quvchining o'z kompyuterida (HtmlPractice naqshi: skrinshot yuklanadi)
export const HOMEWORK = {
  type: 'file',
  title: { uz: "Saytingizning qolgan sahifalarini rejalang", ru: 'Спланируйте остальные страницы сайта' },
  brief: {
    uz: "Demo Day saytingiz bosh sahifasi tayyor. Uyda qolgan sahifalarni rejalaysiz — Netlify darsida ularni shu dizaynda qo'shib, saytni internetga chiqarasiz. Bosh sahifa skrinshotini platformaga yuklaysiz.",
    ru: 'Главная страница вашего сайта для Demo Day готова. Дома спланируйте остальные страницы — на уроке Netlify вы добавите их в том же дизайне и выложите сайт в интернет. Скриншот главной страницы загрузите на платформу.'
  },
  items: [
    { uz: "Saytingizda yana qaysi 3 sahifa bo'lishini yozing (masalan, sahifalar.txt)", ru: 'Напишите, какие ещё 3 страницы будут на сайте (например, в файле pages.txt)' },
    { uz: 'Har sahifaga bir gap: unda nima turadi', ru: 'Для каждой страницы — одна фраза: что на ней будет' },
  ],
};

// ===== 🏆 «BUGUNGI G'OLIBLARIMIZ» — PODIUM / STATISTIKA SAHIFASI =====
// Etalon: CssLesson1.jsx ScreenPodium + PmUserStoryLesson (solo-ko'rinishda nishonlar).
// Jonli darsda — guruh reytingi (🥇🥈🥉); mustaqil o'qishda — shaxsiy natija + nishonlar.
// Podium yorliqlari (scored ekran indeksi -> qisqa mavzu nomi)
const PODIUM_LABELS = {
  5: { uz: 'display: flex — kartochkalar qatorda', ru: 'display: flex — карточки в ряд' }
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
      <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: 'Nishonlaringiz', ru: 'Ваши награды' })} — {achN}/{achTotal}</div>
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
        <div className="head head-c"><h2 className="title h-title fade-up">{isLive
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
              {isMentorL && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntiring.', ru: 'Вопросы со значком ⚠️ — темы, где класс споткнулся. Объясните их ещё раз.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// Javob kaliti (INLINE_KEYS) — yagona ballik test (⚡ Jonli tekshiradi/tasdiqlaydi). F-1015-303: s16 — MC, ✔ C.
const INLINE_KEYS = { s16: 2 };


// ============================================================ LESSON ROOT
export default function CssPractice({ lang: langProp, onFinished, liveToken }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
  setLiveLang(lang); // jonli-modul tarjimoni ham shu tilda
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
  const [maxReached, setMaxReached] = useState(() => (saved ? Math.max(saved.maxReached || 0, saved.screen || 0) : 0)); // F-1012-03
  const [answers, setAnswers] = useState(() => (saved && saved.answers) || {});
  const startTimeRef = useRef(saved?.startedAt || Date.now());
  // 🏅 Nishonlar
  const firstPassRef = useRef(saved?.firstPass || null); // 151-qonun 6-band: { answers, durationSec } | null — «Qaytadan»da muhrlanadi
  const soloSentRef = useRef(new Set()); // Q1 (19.09): solo'da maxsus test javobi serverga BIR marta
  const [fpPractice, setFpPractice] = useState(!!saved?.firstPass);
  const earnedRef = useRef(new Set(saved?.earned || []));
  const [earned, setEarned] = useState(() => new Set(saved?.earned || []));
  const [achToasts, setAchToasts] = useState([]);
  const achKeyRef = useRef(0);
  const earn = useCallback((id) => {
    if (firstPassRef.current) return; // 151-qonun: mashq-o'tishida nishonlar MUZLAGAN
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts(t => [...t, { id, k: ++achKeyRef.current }]);
  }, []);
  const missedRef = useRef(new Set(saved?.missed || []));
  const [missed, setMissed] = useState(() => new Set(saved?.missed || []));
  const missTry = useCallback((idx) => {
    const sid = SCREEN_META[idx] && SCREEN_META[idx].id;
    const ach = ACH_TRIGGERS[sid];
    if (!ach || missedRef.current.has(sid) || earnedRef.current.has(ach)) return;
    missedRef.current.add(sid);
    setMissed(new Set(missedRef.current));
  }, []);
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice }), [missed, missTry, fpPractice]);
  // ETALON — 1920px: keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  const advance = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1)); // F-1015-316: kartochkalar ekrani yo'q
  // F-1015-303: amaliyot bloki «Davom etish»da nishon beradi; kompilyator va praktika-signali yo'q.
  const next = () => {
    const ach = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id];
    if (ach && live.mode !== 'mentor') earn(ach);
    advance();
  };
  const prev = () => setScreen(s => Math.max(s - 1, 0));
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    // Q1 (19.09): UYDA (solo) maxsus test javobi ham serverga — rasmiy natijada sanalsin (oldin faqat jonli darsda
    // yuborilardi → «javobsiz»). `picked` kalitdan: server `data.correct` (birinchi urinish) ni oladi. MCQ o'zi `recordAttempt`
    // bilan yozadi — takrori serverda e'tiborsiz (on conflict do nothing). «Qaytadan» mashqida yuborilmaydi (151-qonun 6-band).
    if (_m && _m.scored && live.mode === 'solo' && !firstPassRef.current && data && (data.solved === true || data.correct === true) && !soloSentRef.current.has(idx)) {
      const key = INLINE_KEYS[_m.id];
      if (Number.isInteger(key)) { soloSentRef.current.add(idx); live.submitAnswer(idx, _m.id, key < 0 ? 0 : (data.correct ? key : (key === 0 ? 1 : 0)), !!data.correct, data.elapsedMs || 0); }
    }
    // eski «custom» final uchun edi; MC test o'zi yuboradi (QuestionScreen) — ikkinchi yozuv `picked: 0` bilan ketmasin
    if (_m && _m.scored && _m.scope === 'final' && _m.template !== 'MCScreen' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon
  };
  const reset = () => { if (!firstPassRef.current) { firstPassRef.current = { answers, durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000) }; setFpPractice(true); } progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  // F-0730-01: har o'zgarishda progress saqlanadi (screen + javoblar + nishonlar + boshlangan vaqt)
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, maxReached, answers, earned: [...earnedRef.current], missed: [...missedRef.current], firstPass: firstPassRef.current, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned, missed, fpPractice]);

  // Javob kaliti: inline testlar + jang savollari (⚡ Jonli tekshiradi) — mentor ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken, arena: { total: QUIZ_BANK.length, quizMs: QUIZ_MS, baseIdx: QUIZ_BASE_IDX } }); // liveToken — LMS'dan (avval null, keyin keladi)
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS }); // server-progress: davom / ko'rish / toza boshlash
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  // F-1012-03: eng uzoq yetilgan ekran (qayta boshlashda 0) — undan oldingi ekranlarda «Davom etish» qulflanmaydi
  useEffect(() => { setMaxReached(m => (screen === 0 && !Object.keys(answers || {}).length) ? 0 : Math.max(m, screen)); }, [screen, answers]);
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  // 🏅 Yakuniy ekranga yetganda: bitiruvchi nishoni
  useEffect(() => { if (screen === TOTAL_SCREENS - 1) earn('graduate'); }, [screen]); // eslint-disable-line

  const finishLesson = () => {
    if (typeof live.holdFinish === 'function' && live.holdFinish(finishLesson)) return; // CodeStrike podium: yakuniy o'rin kelguncha yuk ushlab turiladi (28.10)
    progClear(LESSON_META.lessonId); // F-0730-01: yakunlangan dars saqlovi tozalanadi
    live.endSession();
    const fp = firstPassRef.current; // 151-qonun 6-band: «Qaytadan» bosilgan bo'lsa — BIRINCHI o'tish natijasi ketadi
    const ans = fp ? fp.answers : answers;
    const scoredMeta = SCREEN_META.filter(s => s.scored);
    const finalMeta = scoredMeta.filter(s => s.scope === 'final');
    const scoredAnswers = SCREEN_META.map((s, i) => (s.scored ? ans[i] : null)).filter(Boolean);
    const correctAnswers = scoredAnswers.filter(a => a.correct).length;
    const finalAnswers = SCREEN_META.map((s, i) => (s.scored && s.scope === 'final' ? ans[i] : null)).filter(Boolean);
    const finalCorrect = finalAnswers.filter(a => a.correct).length;
    const payload = {
      lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle,
      nickname: live.nickname || null, livePin: live.pin || null, liveMode: live.mode,
      durationSec: fp ? fp.durationSec : Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scoredMeta.length, correctAnswers,
      scorePercent: scoredMeta.length ? Math.round((correctAnswers / scoredMeta.length) * 100) : 0,
      finalScore: finalCorrect, finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : (scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false),
      answers: SCREEN_META.map((_, i) => ans[i]).filter(Boolean),
      ...buildResultDetails({ lessonId: LESSON_META.lessonId, screenMeta: SCREEN_META, answers: ans, earned, achievements: ACHIEVEMENTS, arenaBank: QUIZ_BANK })
    };
    if (typeof onFinished === 'function') onFinished(sealPayload(LESSON_META.lessonId, payload));
  };

  // Tartib SCREEN_META bilan AYNAN bir xil: s0 → s1 → a1 → a2 → a3 → s16 (topshirish) → a4 (yaxshilash) → spodium → s17 (yakun)
  const screens = [Screen0, Screen1, ScreenAmaliyot, ScreenAmaliyot, ScreenAmaliyot, Screen16, ScreenYaxshilash, ScreenPodium, Screen17];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }

        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .zoomable { position: relative; }
        .flow-label:has(+ .zoomable.z-empty) { display: none; } /* bo'sh ustun ustida yorliq yolg'iz osilmasin (bridge 40-band) */
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        .zoom-on .bp-body { max-height: none !important; overflow: visible !important; } /* F-1015-381 (214-qonun): kattalashtirilganda sayt aylantirishsiz to'liq */
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.accent}; color: #fff; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
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
        /* option-wait (jonli test Kahoot kutish holati) + frame-wait (feedback kutish) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        .frame-wait { background: ${T.blueSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }
        /* Mentor (proyektor) jonli test statistikasi + Kahoot reveal */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(255,79,40,0.5); }
        .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
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
        .mstats-verdict { border-radius: 12px; padding: 10px 14px; }
        .mstats-verdict.need { background: ${T.accentSoft}; } .mstats-verdict.maybe { background: rgba(232,161,58,0.14); } .mstats-verdict.good { background: ${T.successSoft}; } .mstats-verdict.few { background: rgba(${T.shadowBase},0.06); }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; margin-top: 8px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(255,79,40,0.5); transition: all 0.2s; }
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
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.accent}; color: #fff; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
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
        .mstats-waitrow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .mstats-wait-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; }
        .mstats-wait-chip { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.07); border-radius: 99px; padding: 3px 10px; }
        .mstats-wait-chip.more { color: ${T.ink3}; }
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
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

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 0 0 2px ${T.accent}, 0 6px 16px -8px rgba(255,79,40,0.3); } /* F-0926-06: baland rang yo'q (159/10) — Soft fon + accent halqa */
        .chip-wrong { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .chip:disabled { opacity: 0.55; cursor: not-allowed; }
        .chip.chip-on:disabled { opacity: 1; } /* F-0926-06 (159/10): tanlangan javob xiralashmasin */

        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); display: flex; align-items: center; justify-content: center; font-size: 22px; line-height: 1; }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(12px,1.7vw,15px) clamp(14px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .hook-option:hover:not(:disabled):not(.on) { box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }

        .text-input { width: 100%; font-size: clamp(14px,1.8vw,16px); font-weight: 500; padding: 12px 14px; border: none; border-radius: 12px; background: ${T.paper}; color: ${T.ink}; outline: none; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: box-shadow 0.2s; }
        .text-input:focus { box-shadow: 0 10px 22px -6px rgba(255,79,40,0.3), 0 0 0 1px rgba(255,79,40,0.2); }

        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(12.5px,1.6vw,14.5px); line-height: 1.6; padding: clamp(12px,2.2vw,18px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

        .bp-window { border-radius: 13px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -6px rgba(${T.shadowBase},0.16); }
        .bp-bar { background: #f0eee8; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bp-title { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink3}; }
        .bp-body { padding: clamp(12px,2.2vw,18px); }

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
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

        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }

        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .head-c { text-align: center; align-items: center; } /* F-1003-04: natija ekrani — bitta o'q */
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .split3 { grid-template-columns: minmax(0,1fr) minmax(0,1fr) minmax(0,0.95fr); gap: clamp(14px,2vw,24px); } /* §34 s0: ikki maket + variantlar */
        .split3 .hook-option { padding: clamp(9px,1.3vw,12px) clamp(13px,1.8vw,16px); }
        @media (max-width: 1000px) { .split3 { grid-template-columns: minmax(0,1fr) minmax(0,1fr); } }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        @media (min-width: 761px) { .split:has(> .col > .flow-label:first-child) > .col:not(:has(> .flow-label:first-child))::before { content: "."; visibility: hidden; font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; } } /* F-1015-371: ikki ustun bloklari bir chiziqdan boshlanadi */

        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .hero-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; } .score-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; font-variant-numeric: tabular-nums; color: ${T.accent}; background: ${T.accentSoft}; padding: 5px 12px; border-radius: 999px; } /* F-1003-04/05: yakunda halqa o'rniga yorliq */
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; background: none; padding: 0; }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }
        /* 🏠 UYGA VAZIFA — amaliy topshiriqqa chorlaydigan kapsula (darsning O'Z rangida) */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
        @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.03); } 100% { filter: brightness(1); } }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; color: rgba(255,255,255,0.16); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent); transform: rotate(8deg); animation: hw-shine 4.6s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(120,60,220,.6), 0 0 40px rgba(124,58,237,.72), 0 0 96px rgba(124,58,237,.4), inset 0 0 60px rgba(124,58,237,.44); } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none !important; } .hw-big-wrap::before { opacity: 0.55; } } /* F-1015-326: uyga vazifa tugmasi — platforma standarti (qolipCss bilan bir xil) */
        @media (max-width: 600px) { .hw-big-wrap::before { inset: -12px 0; } } /* F-1015-319: telefonda nur halqasi yon tomonga chiqmaydi */

        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* Kod ichidagi slot + chiplar + klikli qism (s2) */
        .slot { display: inline-block; min-width: 26px; padding: 0 7px; border-radius: 6px; background: rgba(255,79,40,0.20); box-shadow: inset 0 0 0 1.5px ${T.accent}; color: ${T.accent}; font-weight: 700; }
        .slot.filled { background: rgba(31,122,77,0.18); box-shadow: inset 0 0 0 1.5px ${T.success}; color: ${CODE.str}; }
        /* F-0926-06: savol-yorlig'i klassi olindi — 7 ekranda mentor savolini takrorlardi (159/7) */
        .tagpick { display: flex; flex-wrap: wrap; gap: 8px; }
        .cpart { cursor: pointer; padding: 2px 5px; border-radius: 6px; box-shadow: inset 0 0 0 1.5px transparent; transition: all 0.18s; }
        .cpart:hover { box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.25); }
        .cpart.on { box-shadow: inset 0 0 0 1.5px currentColor; background: rgba(255,255,255,0.06); }
        .clegend { display: flex; flex-wrap: wrap; gap: 8px; }
        .ctab { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; font-weight: 600; color: ${T.ink2}; background: ${T.paper}; padding: 5px 11px; border-radius: 99px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); transition: all 0.2s; }
        .ctab.done { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; }

        /* Yakuniy tekshiruv pillalari */
        .pill-row { display: flex; flex-wrap: wrap; gap: 7px; }
        .tagpill { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: ${T.ink3}; background: ${T.paper}; padding: 5px 10px; border-radius: 99px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.14); transition: all 0.25s; }
        .tagpill.on { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .tp-ic { width: 16px; height: 16px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; box-shadow: inset 0 0 0 1.5px ${T.ink3}; color: ${T.ink3}; }
        .tagpill.on .tp-ic { background: ${T.success}; color: #fff; box-shadow: none; }

        /* Yig'ish ro'yxati */
        .asm-list { display: flex; flex-direction: column; gap: 6px; }
        .asm-row { display: flex; align-items: center; gap: 11px; background: ${T.paper}; border-radius: 10px; padding: 9px 13px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.12); transition: all 0.35s; } /* F-0926-06 (P2, foydalanuvchi A): xiralik olindi — bosiladigan qator o'chiqdek ko'rinardi (159/15); holatni faqat yashil ✓ + yumshoq fon aytadi */
        .asm-row:not(.on):not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 8px 18px -8px rgba(${T.shadowBase},0.25); }
        .asm-row.on { background: ${T.successSoft}; }
        .asm-row, .asm-row:disabled { color: ${T.ink}; } /* F-0926-06 (159/10): bajarilgan qator yozuvi tizim-kulrangiga tushmasin */
        .asm-row.on { opacity: 1; box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .asm-ic { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; box-shadow: inset 0 0 0 2px ${T.ink3}; color: ${T.ink2}; transition: all 0.35s; }
        .asm-row.on .asm-ic { background: ${T.success}; color: #fff; box-shadow: inset 0 0 0 2px ${T.success}; }

        /* ============ PORTFOLIO JONLI KO'RINISHI (.pf) ============ */
        /* Bezaksiz (browser default) holat */
        .pf { font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.4; }
        .pf, .pf * { transition: background 0.4s ease, color 0.35s ease, padding 0.4s ease, margin 0.4s ease, text-align 0.3s ease, box-shadow 0.25s ease; }
        .pf header, .pf section, .pf footer { margin: 10px 0; }
        .pf h1 { font-size: 2em; font-weight: bold; margin: 0.3em 0 0.1em; }
        .pf h2 { font-size: 1.5em; font-weight: bold; margin: 0.4em 0 0.1em; }
        .pf p { margin: 0.4em 0; }
        .pf nav { display: block; margin: 6px 0; }
        .pf nav a { color: #0000ee; text-decoration: underline; margin-right: 12px; cursor: pointer; }
        .pf ul { padding-left: 28px; margin: 0.4em 0; list-style: disc outside; }
        .pf li { display: list-item; margin: 4px 0; }
        .pf li a, .pf .pf-email { color: #0000ee; text-decoration: underline; cursor: pointer; }
        .pf footer { color: #444; font-size: 0.85em; }

        /* page: fon + shrift (tashqi qatlam) */
        .pf-page { background: ${T.bg}; font-family: 'Manrope', sans-serif; color: ${T.ink}; padding: 16px; }
        .pf-page footer { text-align: center; color: ${T.ink3}; font-family: 'Manrope', sans-serif; font-size: 11px; margin-top: 12px; }
        /* center — oq karta, markazda (max-width + margin auto) */
        .pf-center .pf-inner { max-width: 300px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.28); padding: 18px; }
        /* head: sarlavhalar */
        .pf-head .pf-header h1 { color: ${T.accent}; text-align: center; font-size: 1.6em; margin-bottom: 0; }
        .pf-head .pf-header p { text-align: center; color: ${T.ink2}; font-size: 0.95em; margin-top: 2px; }
        .pf-head h2 { color: ${T.ink}; font-size: 1.1em; border-bottom: 2px solid ${T.accentSoft}; padding-bottom: 3px; }
        /* nav: flex + gap + justify-content (CSS 2-dars) */
        .pf-nav .pf-header nav { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; margin-top: 10px; }
        .pf-nav .pf-header nav a { color: ${T.accent}; text-decoration: none; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; margin: 0; }
        /* about: markaz + padding + dasturchi avatar */
        .pf-about .pf-sec-about { text-align: center; padding: 14px 10px; }
        .pf-about .pf-sec-about p { color: ${T.ink2}; font-family: 'Manrope', sans-serif; font-size: 13px; }
        /* list: loyiha kartalari (bg + padding + margin; list-style none bonus) */
        .pf-list .pf-sec-projects ul { list-style: none; padding: 0; margin: 8px 0 0; }
        .pf-list .pf-sec-projects li { background: #FBFAF7; border-radius: 10px; padding: 10px 13px; margin: 8px 0; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.2); }
        .pf-list .pf-sec-projects li a { color: ${T.ink}; text-decoration: none; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; }
        /* btn: aloqa tugmasi (bg + color + padding) */
        .pf-btn .pf-sec-contact { text-align: center; }
        .pf-btn .pf-sec-contact p { color: ${T.ink2}; font-family: 'Manrope', sans-serif; font-size: 13px; }
        .pf-btn .pf-sec-contact .pf-email { display: inline-block; background-color: ${T.accent}; color: #fff; text-decoration: none; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; padding: 10px 20px; border-radius: 10px; box-shadow: 0 6px 16px -5px rgba(255,79,40,0.4); }
      

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
        /* ===== 🏗️ QURUVCHI QATLAMI CSS (ko'chirilgan) ===== */
        /* === 🧩 DRAG-DROP ORDER (s3b — qoida ustaxonasi) === */
        .dd { display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,1fr); gap: 13px; align-items: start; } /* §34: keng ekranda uyalar chapda, hovuz o'ngda */
        @media (max-width: 760px) { .dd { grid-template-columns: 1fr; } }
        .dd-slots { display: flex; flex-direction: column; gap: 9px; }
        .dd-slot { display: flex; align-items: center; gap: 12px; min-height: 46px; border-radius: 14px; border: 2px dashed ${T.ink3}66; background: ${T.paper}; padding: 8px 12px; transition: border-color .18s, background .18s; }
        .dd-slot.filled { border-style: solid; border-color: ${T.line}; }
        .dd-slot.ok { border-color: ${T.success}; background: ${T.successSoft}; }
        .dd-slot.bad { border-color: #E24848; background: #FBE9E9; animation: dd-shake .4s; }
        @keyframes dd-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        .dd-slotn { width: 26px; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dd-slot.ok .dd-slotn { background: ${T.success}; color: #fff; }
        .dd-hint { color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .dd-pool { display: flex; flex-wrap: wrap; gap: 9px; min-height: 48px; padding: 10px; border-radius: 14px; background: ${T.bg}; }
        .dd-pool-empty { color: ${T.ink3}; font-size: 12.5px; font-style: italic; align-self: center; }
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip::before { content: '⠿'; margin-right: 7px; opacity: .75; font-weight: 400; } /* F-1015-352 (F-1002-59): to'ldirilgan gradient chip, ⠿ ushlagich sudralishni aytadi */
        .dd-chip:hover { transform: translateY(-2px); }
        .dd-chip:active { cursor: grabbing; }
        .dd-slots, .dd-pool { position: relative; }
        .dd-pool { z-index: 1; } /* sudralgan pool chip slotlar ustida ko'rinsin */
        .dd-done { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .dd-wrong { font-weight: 700; color: #E24848; font-size: 13.5px; }
        /* === ⚡ CTA (yakun sahifasida) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; background: linear-gradient(135deg, #FFF3EA, #FFE7DC); border: 1px solid #F3D9CC; border-radius: 20px; padding: clamp(16px,2.4vw,22px) clamp(18px,2.6vw,26px); box-shadow: 0 16px 40px -18px rgba(255,79,40,0.28); }
        .qz-cta-txt { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 3px; }
        .qz-cta-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(16px,2.2vw,20px); color: #121826; }
        .qz-cta-s { font-family: 'Manrope'; font-weight: 500; font-size: 13px; color: #525A6B; }
        .qz-cta-btn { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border: none; border-radius: 14px; padding: 13px 24px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 12px 24px -8px rgba(255,79,40,0.6); transition: transform 0.2s; }
        .qz-cta-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.03); }
        .qz-cta-btn:disabled { background: #E9E6DF; color: #98A0B4; cursor: default; box-shadow: none; }
        .qz-cta.ready .qz-cta-btn { animation: qz-pulse 1.1s ease-in-out infinite; }
        @keyframes qz-pulse { 0%,100% { transform: scale(1); box-shadow: 0 8px 22px -8px rgba(255,79,40,0.7); } 50% { transform: scale(1.06); box-shadow: 0 10px 30px -6px rgba(255,79,40,0.95); } }

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
        .cs-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; line-height: 1; user-select: none;
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
          font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
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
          font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
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

        /* ===== ⚡ ARENA — tungi-neon CodeStrike muhiti ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
        .qz-arena::before { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(190,150,255,0.08) 1.1px, transparent 1.2px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; }
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
        .qz-opt { flex: 1; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(14px,2vw,17px); color: #fff; line-height: 1.3; letter-spacing: -0.01em; }
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

        /* xira LiveBadge — asosiy holatda so'niq, hover/fokusda to'liq ko'rinadi */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
        /* ===== 🏗️ QURUVCHI QATLAMI CSS (fmtCode chip, CodeStrike brand, praktika panel, flashcard, badges, celebrate, onboarding) ===== */
        /* fmtCode kod-chip */
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        /* Mentor praktika paneli */
        /* === ✍️ MENTOR PRAKTIKA PANELI (jonli) === */
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
        .mp-demo { flex: 1; min-width: 200px; padding: 14px 20px; border: none; border-radius: 14px; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.4); transition: transform 0.15s; } /* F-0926-06: qora tugma → accent (159/5) */
        .mp-demo:hover { transform: translateY(-2px); }
        .mp-next { flex: 1; min-width: 160px; padding: 14px 20px; border: 1.5px solid rgba(${T.shadowBase},0.16); border-radius: 14px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.15s; }
        .mp-next:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .mp-tip { margin: 2px 0 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink3}; }
        /* Achievements kolleksiya + hisoblagich */
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
        /* AchCelebrate — to'liq-ekran nishon bayrami */
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
        /* ===== F-1015-303/309 · praktika qolipi: amaliyot bloklari va DemoSahifa (izohda backtick yo'q) ===== */
        .am-karta { background: ${T.paper}; border-radius: 14px; padding: clamp(12px,1.8vw,16px) clamp(14px,2vw,18px); display: flex; flex-direction: column; gap: 8px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .lesson-root .am-band { margin: 0; padding-left: 20px; list-style: disc outside; display: flex; flex-direction: column; gap: 5px; font-size: clamp(13px,1.55vw,15px); color: ${T.ink}; line-height: 1.5; }
        .am-masalan { margin: 0; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(11.5px,1.35vw,13px); line-height: 1.6; border-radius: 10px; padding: 12px 14px; white-space: pre-wrap; word-break: break-word; }
        .am-qadam { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .am-qadam li { display: flex; gap: 10px; align-items: flex-start; font-size: clamp(13px,1.55vw,15px); color: ${T.ink}; line-height: 1.5; }
        .am-qn { flex: none; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.ink}; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
        .am-osti { margin: 0; color: ${T.ink2}; line-height: 1.5; }
        .lesson-root .am-hw { margin: 0 0 6px; padding-left: 22px; list-style: decimal outside; display: flex; flex-direction: column; gap: 6px; color: ${T.ink}; }
        .am-uslub { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
        .am-uslub-btn { display: flex; flex-direction: column; gap: 2px; text-align: left; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 10px 12px; font-family: 'Manrope', sans-serif; font-size: 14px; color: ${T.ink}; cursor: pointer; }
        .am-uslub-btn span { font-size: 12.5px; color: ${T.ink2}; }
        .am-uslub-btn.on { border-color: ${T.ink}; background: ${T.paper}; box-shadow: 0 0 0 2px ${T.ink}; }
        .am-javob-joy { min-height: 104px; }
        .am-nusxa { align-self: flex-start; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 9px 16px; font: 700 13px 'Manrope', sans-serif; cursor: pointer; }
        .am-nusxa:hover { background: ${T.accentSoft}; }
        .am-prompt-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .am-tayyor { background: ${T.paper}; border: 1.5px solid rgba(255,79,40,0.35); border-radius: 16px; padding: clamp(14px,2vw,18px); display: flex; flex-direction: column; gap: 10px; box-shadow: 0 10px 24px -10px rgba(255,79,40,0.35); }
        .am-qt-ic { color: ${T.accent}; font-size: 16px; transition: transform 0.2s; }
        .am-tt { padding: 0; gap: 0; }
        .am-tt-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: none; border: none; cursor: pointer; text-align: left; padding: clamp(14px,2vw,18px); border-radius: 14px; font: inherit; }
        .am-tt-btn:hover { background: ${T.accentSoft}; }
        .am-tt-btn:focus-visible { outline: 2px solid ${T.accent}; outline-offset: -2px; }
        .am-tt.on .am-qt-ic { transform: rotate(180deg); }
        .am-tt-nafas { animation: am-nafas 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .am-tt-nafas { animation: none; } }
        .am-tayyor.am-tt { box-shadow: none; } /* F-1015-362: yordamchi blok — yumshoq ramka, soyasiz */
        @keyframes am-nafas { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,79,40,0.18); } 50% { box-shadow: 0 0 0 6px rgba(255,79,40,0); } }
        .am-tt-oyna { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(560px,92vw); max-height: calc(88vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(18px,3vw,28px); display: flex; flex-direction: column; gap: 14px; box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        .am-tt-oyna-h { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .am-tt-yop { flex: none; width: 34px; height: 34px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .am-tt-yop:hover { color: ${T.accent}; border-color: ${T.accent}; }
        .am-tt-yop:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .am-tt-oyna { animation: none !important; } }
        .am-tayyor-h { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,2vw,19px); color: ${T.ink}; }
        .lesson-root .am-tayyor-l { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .am-tayyor-l li { display: flex; gap: 12px; align-items: flex-start; font-size: clamp(14px,1.6vw,15.5px); color: ${T.ink}; line-height: 1.5; }
        .am-tayyor-n { flex: none; width: 28px; height: 28px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }
        .am-tayyor-s { margin: 0; font-size: 13px; color: ${T.ink2}; }
        @media (max-width: 760px) { .am-reja .split > .col:last-child { order: -1; } }
        .am-maydon { display: flex; flex-direction: column; gap: 5px; font-size: 13px; font-weight: 600; color: ${T.ink}; }
        .am-input { width: 100%; font: 500 14px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 10px 12px; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .am-input::placeholder { color: ${T.ink2}; opacity: 0.85; }
        .am-input:hover { border-color: #cfcabe; }
        .am-input:focus { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${T.accentSoft}; }
        .am-saqla { align-self: flex-start; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 9px 18px; font: 700 13px 'Manrope', sans-serif; cursor: pointer; }
        .am-saqla:hover:not(:disabled) { background: ${T.accentSoft}; }
        .am-saqla:disabled { border-color: ${T.line}; color: ${T.ink2}; cursor: default; }
        .am-loyiha-nom { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 18px; color: ${T.ink}; }
        .am-soni { font: 700 12px 'Manrope', sans-serif; color: ${T.success}; background: ${T.successSoft}; border-radius: 999px; padding: 3px 10px; }
        .am-tayyor-ok { margin: 0; font-weight: 700; color: ${T.success}; font-size: 14px; }
        .am-ochil { animation: am-ochil 0.45s cubic-bezier(.2,.7,.3,1) both; }
        @keyframes am-ochil { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .am-ochil { animation: none; } }
        .ds { border-radius: 12px; overflow: hidden; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.3); font-family: 'Manrope', Arial, sans-serif; background: #fff; }
        .ds-bar { display: flex; align-items: center; gap: 10px; background: #ECE9E1; padding: 7px 12px; }
        .ds-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .ds-body { --ds-bg: #fff; --ds-ink: #16181d; --ds-mut: #4b5563; --ds-acc: #d4380d; --ds-acc-ink: #fff; --ds-card: #fff; --ds-line: #e8e8e8; --ds-hd: #fff; --ds-hd-ink: #16181d; --ds-hero: linear-gradient(135deg, #f8fafc, #fff1ec); --ds-bub: #fdeee9; --ds-h1: #16181d; --ds-ill: #fff; background: var(--ds-bg); color: var(--ds-ink); }
        .ds-hd { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--ds-hd); color: var(--ds-hd-ink); font-size: 11.5px; border-bottom: 1px solid var(--ds-line); }
        .ds-logo { display: inline-flex; align-items: center; gap: 6px; font-weight: 800; margin-right: auto; }
        .ds-mark { width: 14px; height: 14px; border-radius: 4px; background: var(--ds-acc); display: inline-block; }
        .ds-nav { display: flex; gap: 12px; opacity: 0.9; }
        .ds-cta { background: var(--ds-acc); color: var(--ds-acc-ink); font-weight: 700; padding: 4px 11px; border-radius: 999px; }
        .ds-hero { display: flex; gap: 14px; align-items: center; padding: 20px 16px; background: var(--ds-hero); flex-wrap: wrap; }
        .ds-hero-t { flex: 1 1 170px; min-width: 0; }
        @media (max-width: 520px) { .ds-svg { flex-basis: 100%; max-width: 290px; } }
        .lesson-root .ds-tag { display: inline-block; margin: 0 0 8px; padding: 3px 9px; border-radius: 999px; background: var(--ds-ill); font-size: 10px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ds-acc); }
        .lesson-root .ds-h1 { margin: 0 0 8px; font-size: 20px; font-weight: 800; line-height: 1.15; color: var(--ds-h1); }
        .ds-p { margin: 0; font-size: 11.5px; line-height: 1.45; color: var(--ds-mut); }
        .ds-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
        .ds-tugma { background: var(--ds-acc); color: var(--ds-acc-ink); font-size: 11.5px; font-weight: 700; padding: 7px 14px; border-radius: 999px; }
        .ds-tugma2 { border: 1.5px solid var(--ds-acc); color: var(--ds-acc); background: var(--ds-ill); font-size: 11.5px; font-weight: 700; padding: 6px 13px; border-radius: 999px; }
        .ds-svg { flex: 0 1 46%; min-width: 150px; max-width: 270px; height: auto; margin: 0 auto; display: block;
          --il-b1: #fed7c7; --il-b2: #e0e7ff; --il-b3: #fde68a; --il-phone: #1e293b; --il-screen: #fff; --il-notch: #cbd5e1; --il-r1: #f8fafc; --il-r2: #fff7ed; --il-r3: #f0fdf4;
          --il-ink: #0f172a; --il-mut: #475569; --il-c: #fff; --il-cl: #e2e8f0; --il-robot: #2563eb; --il-eye: #fff; --il-chess: #0f172a; --il-ball: #16a34a; }
        .ds-svg .il-b1 { fill: var(--il-b1); fill-opacity: 0.75; } .ds-svg .il-b2 { fill: var(--il-b2); fill-opacity: 0.85; } .ds-svg .il-b3 { fill: var(--il-b3); fill-opacity: 0.8; }
        .ds-svg .il-phone { fill: var(--il-phone); } .ds-svg .il-screen { fill: var(--il-screen); } .ds-svg .il-notch { fill: var(--il-notch); }
        .ds-svg .il-bar { fill: var(--ds-acc); } .ds-svg .il-bar-t { fill: var(--ds-acc-ink); font-size: 9px; font-weight: 800; font-family: 'Manrope', Arial, sans-serif; }
        .ds-svg .il-r1 { fill: var(--il-r1); } .ds-svg .il-r2 { fill: var(--il-r2); } .ds-svg .il-r3 { fill: var(--il-r3); }
        .ds-svg .il-t { fill: var(--il-ink); font-size: 8.5px; font-weight: 800; font-family: 'Manrope', Arial, sans-serif; } .ds-svg .il-v { fill: var(--il-mut); font-size: 7.5px; font-family: 'Manrope', Arial, sans-serif; }
        .ds-svg .il-c { fill: var(--il-c); stroke: var(--il-cl); } .ds-svg .il-robot { fill: var(--il-robot); } .ds-svg .il-eye { fill: var(--il-eye); }
        .ds-svg .il-chess { fill: var(--il-chess); } .ds-svg .il-ball { fill: var(--il-ball); } .ds-svg .il-ball-o { fill: var(--il-c); stroke: var(--il-ball); stroke-width: 2.5; }
        .ds-yorqin .ds-svg { --il-b1: #fdba74; --il-b2: #bfdbfe; --il-b3: #fde047; --il-r1: #eff6ff; --il-r2: #fffbeb; --il-r3: #f0fdf4; }
        .ds-qorongi .ds-svg { --il-b1: #134e4a; --il-b2: #1e3a8a; --il-b3: #065f46; --il-phone: #020617; --il-screen: #1e293b; --il-notch: #334155; --il-r1: #0f172a; --il-r2: #0f172a; --il-r3: #0f172a;
          --il-ink: #f1f5f9; --il-mut: #cbd5e1; --il-c: #1e293b; --il-cl: #334155; --il-robot: #34d399; --il-eye: #0f172a; --il-chess: #f1f5f9; --il-ball: #34d399; }
        .ds-gradient .ds-svg { --il-b1: #e9d5ff; --il-b2: #fbcfe8; --il-b3: #c4b5fd; --il-r1: #faf5ff; --il-r2: #fdf2f8; --il-r3: #f5f3ff; --il-robot: #7e22ce; }
        .ds-rang .ds-svg { --il-robot: #15803d; } .ds-rang.ds-qorongi .ds-svg { --il-robot: #fbbf24; --il-ball: #fbbf24; } .ds-rang.ds-gradient .ds-svg { --il-robot: #be185d; }
        .ds-kartalar { display: flex; gap: 10px; padding: 14px 16px 16px; }
        .ds-karta { flex: 1; min-width: 0; background: var(--ds-card); border: 1px solid var(--ds-line); border-radius: 12px; padding: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .ds-bub { width: 28px; height: 28px; border-radius: 9px; background: var(--ds-bub); color: var(--ds-acc); display: inline-flex; align-items: center; justify-content: center; }
        .ds-ic { width: 16px; height: 16px; }
        .ds-h2 { margin: 6px 0 2px; font-size: 12px; font-weight: 800; }
        .ds-ft { text-align: center; font-size: 10.5px; padding: 9px; border-top: 1px solid var(--ds-line); color: var(--ds-mut); }
        .ds-yorqin .ds-body { --ds-bg: #fffaf3; --ds-acc: #c2410c; --ds-hd: #1d4ed8; --ds-hd-ink: #fff; --ds-line: #f3d9bf; --ds-hero: linear-gradient(135deg, #ffedd5 0%, #fde68a 55%, #fdba74 100%); --ds-bub: #ffedd5; --ds-h1: #1e3a8a; }
        .ds-yorqin .ds-cta { background: #fff; color: #1d4ed8; }
        .ds-qorongi .ds-body { --ds-bg: #0f172a; --ds-ink: #f1f5f9; --ds-mut: #cbd5e1; --ds-acc: #34d399; --ds-acc-ink: #0f172a; --ds-card: #1e293b; --ds-line: #334155; --ds-hd: #0f172a; --ds-hd-ink: #f1f5f9; --ds-hero: radial-gradient(circle at 80% 20%, #134e4a 0%, #0f172a 60%); --ds-bub: #134e4a; --ds-h1: #f1f5f9; --ds-ill: #1e293b; }
        .ds-gradient .ds-body { --ds-bg: #fdf4ff; --ds-acc: #7e22ce; --ds-line: #f0d5f5; --ds-hd: #fdf4ff; --ds-hero: linear-gradient(135deg, #ede9fe, #fce7f3); --ds-bub: #f3e8ff; --ds-h1: #4c1d95; }
        .ds-gradient .ds-karta { border-radius: 16px; box-shadow: 0 6px 16px rgba(126,34,206,0.14); }
        .ds-rang .ds-body { --ds-acc: #15803d; --ds-bub: #dcfce7; }
        .ds-rang.ds-qorongi .ds-body { --ds-acc: #fbbf24; --ds-bub: #422006; }
        .ds-rang.ds-gradient .ds-body { --ds-acc: #be185d; --ds-bub: #fce7f3; }
        .ds-xom .ds-body { --ds-bg: #fff; --ds-ink: #000; --ds-mut: #000; --ds-acc: #000; --ds-acc-ink: #1a0dab; --ds-card: transparent; --ds-line: transparent; --ds-hd: #fff; --ds-hd-ink: #000; --ds-hero: #fff; --ds-h1: #000; --ds-ill: #fff; font-family: 'Times New Roman', serif; }
        .ds-xom .ds-hd, .ds-xom .ds-hero, .ds-xom .ds-kartalar { display: block; } .ds-xom .ds-nav { display: flex; gap: 6px; color: #1a0dab; text-decoration: underline; opacity: 1; }
        .ds-xom .ds-mark, .ds-xom .ds-bub, .ds-xom .ds-svg { display: none; } .ds-xom .ds-cta, .ds-xom .ds-tugma, .ds-xom .ds-tugma2 { background: none; border: none; padding: 0; color: #1a0dab; text-decoration: underline; font-weight: 400; }
        .ds-xom .ds-karta { border: none; padding: 2px 0; box-shadow: none; } .lesson-root .ds-xom .ds-tag { color: #000; text-transform: none; letter-spacing: 0; font-weight: 400; padding: 0; background: none; }
        .lesson-root .ds-xom .ds-h1 { font-size: 24px; }
        .ds-halqa { outline: 2.5px dashed ${T.accent}; outline-offset: -3px; border-radius: 10px; }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live, passed: screen < maxReached }}>
        <AchCtx.Provider value={earned}>
        <AchMissCtx.Provider value={achMissVal}>
          <div className="lesson-root">
            {live.mode === 'choosing' ? (
              <LiveGate live={live} title={{ uz: 'CSS Praktika', ru: 'CSS практика' }} />
            ) : (
              <>
                <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
                {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
                <LiveBadge live={live} total={TOTAL_SCREENS} />
              </>
            )}
          </div>
        </AchMissCtx.Provider>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>
  );
}
