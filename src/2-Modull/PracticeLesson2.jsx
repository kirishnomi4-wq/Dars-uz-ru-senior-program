import React, { useState, useEffect, useRef, useCallback, createContext, useContext, useMemo } from 'react';
import { createPortal } from 'react-dom'; // F-1015-362: «Avval tayyorlaning» oynasi .lesson-root ga (fade-up transform ichida fixed ishlamaydi)

// Mentor avatar — hostlangan rasm (11.1 standart, 2026-07-09). Lokal import EMAS.
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PRAKTIKA 2-DARS — AI BILAN TEZ SIFATLI SAYT (promo landing) — PLATFORM STANDARD v16
// F-1015-336 (16.10, foydalanuvchi bilan sahifama-sahifa): 19 → 8 ekran. O'quvchi O'Z mavzusiga promo sahifa quradi (VS Code + gemini.google.com + Copilot):
//        yaxshi prompt = 4 qism (mavzu · uslub · rang · bo'limlar) — forma, o'ngda maket shu yozuvdan jonli quriladi; iteratsiya; Copilot bilan bo'lim.
// Asosiy xabar: "AI tezlik beradi — SIFATni siz ta'minlaysiz." Antigravity ishlatilmaydi (18+). Oldingi 19 ekranli: arxiv/F-1015-practice2-oldin/.
// Toza dizayn — ortiqcha emoji yo'q; ma'no so'z va tipografiya bilan beriladi.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

const T = {
  bg: '#F6F4EF', ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2',
  paper: '#FFFFFF', accent: '#FF4F28', accentSoft: '#FFE8E1', accentVivid: '#FF4F28',
  success: '#1F7A4D', successSoft: '#E3F0E8', blue: '#019ACB', blueSoft: '#E2F4FA', link: '#1a56db',
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


// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi.
import { arenaOrder, useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang , buildResultDetails, sealPayload, useAutoNext, FinishBtn, liveToast } from '../live/index.js';
import { UygaVazifaKarta } from '../qolip/UygaVazifaKarta.jsx'; // F-1023-03: uyga vazifa v2 kartasi
// F-1023-03: uyga vazifa — LMS'dagi «Uyga vazifa: Practice: AI-Agent 1» bilan bir xil (uyga-vazifa-v2/lms/paket.json, 3-9). scripts/hw-v2-kartalar.mjs yozadi.
const HW_V2 = {"id":"3-9","tur":"compiler","nom":{"uz":"Uyga vazifa: Practice: AI-Agent 1","ru":"Домашнее задание: Practice: AI-Agent 1"},"matn":{"uz":"Promo sahifangizga \"Tariflar\" bo'limini compiler'dagi AI-agent bilan qo'shing.\n\n1. Agentga bo'lim uchun aniq prompt yozing: nechta karta, har kartada nima (nom, narx, 3 ta imkoniyat), qaysi rang va uslub.\n2. Promptni index.html tepasiga izoh qilib qo'ying: <!-- prompt: … -->.\n3. 3 ta tarif kartasi, har birida «Tanlash» tugmasi.\n4. «Tanlash» bosilsa, o'sha karta ajralib tursin, pastda «Siz tanladingiz: <nom>» chiqsin; boshqasini tanlasa — almashsin.\n5. Natija bir urinishda chiqmasa — ikkinchi, aniqlashtiruvchi promptni ham izohga qo'shing.","ru":"Добавьте на промо-страницу раздел «Тарифы» с помощью AI-агента в компиляторе.\n\n1. Напишите агенту точный промпт для раздела: сколько карточек, что в каждой (название, цена, 3 возможности), какой цвет и стиль.\n2. Вставьте промпт комментарием вверху index.html: <!-- prompt: … -->.\n3. 3 карточки тарифов, в каждой — кнопка «Выбрать».\n4. При нажатии «Выбрать» эта карточка выделяется, а внизу появляется «Вы выбрали: <название>»; если выбрать другую — выбор меняется.\n5. Если с первого раза не получилось — добавьте в комментарий и второй, уточняющий промпт."}};







const LangContext = createContext('uz');
const MentorCtx = createContext(null);
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — yuqori panel hisoblagichi uchun
const AchMissCtx = createContext(null); // 🏅 151-qonun: { missed:Set<ekran id>, miss(idx), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi

// backtick chiplar: `siyohrang` matn ichida chip bo'lib chiqadi (test/arena savollarida)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split(/(`[^`]+`)/g).map((p, i) => (p.startsWith('`') && p.endsWith('`') ? <code key={i} className="qcode">{p.slice(1, -1)}</code> : p))
  : s;

// ===== AUDIO (AUDIOSIZ stub) — ovoz o'chirilgan, faqat segment-struktura saqlanadi =====
const useLang = () => useContext(LangContext);
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

// ===== Kod bo'yoqlari (syntax highlight) =====
const KW = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const NUM = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const STR = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const FN = ({ children }) => <span style={{ color: CODE.punct }}>{children}</span>;
const CM = ({ children }) => <span style={{ color: CODE.comment }}>{children}</span>;

const LESSON_META = { lessonId: 'practice-02-ai-promo-v18', lessonTitle: { uz: 'Praktika 2 — AI bilan tez sayt', ru: 'Практика 2 — Быстрый сайт через AI' } };
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
  { id: 's7',  type: 'test',     template: 'MCScreen', scored: true,  scope: 'final' }, // F-1015-336: yagona ballik (eski s7, kalit B saqlandi)
  { id: 'a4',  type: 'practice', template: 'custom',   scored: false, scope: null }, // F-1015-337: wow effekt (JS) — testdan keyin
  { id: 's15b', type: 'stats',   template: 'custom',   scored: false, scope: null },
  { id: 's16', type: 'summary',  template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

const Split = ({ children }) => <div className="split">{children}</div>;
const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, mentorCollapsible }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  // mentorCollapsible: desktopda ham mentor yig'ilsin (pastki qism bosilganda/skroll qilinganda)
  const collapseOn = isNarrow && !mentorStatic; // F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi
  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px + 60px
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); }, [screen]);
  const setCollapsed = (v) => {
    setMCollapsed(v);
    if (v === false && contentRef.current) { const el = contentRef.current; requestAnimationFrame(() => { if (el) el.scrollTo({ top: 0, behavior: 'auto' }); }); }
  };
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
const NavNext = ({ disabled, label = { uz: 'Davom etish', ru: 'Продолжить' }, onClick, optionalLive, mentorLock }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
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

// ===== KO'P TANLOVLI TEST =====

// ===== 📖 QAYTA TUSHUNTIRISH (recap) — jonli darsda mentor past natijada ochadi =====
const RECAP_NEED_PCT = 60;   // shundan past — qayta tushuntirish TAVSIYA etiladi
const RECAP_GOOD_PCT = 75;   // shundan yuqori — sinf o'zlashtirdi, bemalol davom
const RECAP_MIN_ANSWERS = 3; // foizga ishonch uchun kamida shuncha javob kerak
// ============================================================
// 📖 QAYTA TUSHUNTIRISH (recap) — test natijasi past chiqsa mentor proyektorda
// ochib, og'zaki qayta tushuntiradi (server sinxronsiz — o'quvchilar qulflangan,
// proyektorga qaraydi). Xato qilgan o'quvchi o'z qurilmasida ham ochishi mumkin.
// Kalitlar — scored test ekranlarining indekslari (4, 7, 9). s15 — amaliy final (recapsiz).
// Har karta: ic (katta emoji), h (sarlavha), body (1-2 gap), vis (ko'rgazma),
// ask (mentor sinfga og'zaki beradigan savol — jonli muloqot uchun).
// ============================================================
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
// RECAPS kontenti — Stage 4'da JS-intro testlariga to'ldiriladi (hozircha bo'sh)
const RECAPS = {
  // idx 5 — s7: «Qaysi so'rov eng aniq?» (F-1015-336: yagona ballik)
  5: {
    title: { uz: "Qaysi buyruq eng yaxshi?", ru: 'Какая команда лучшая?' },
    cards: [
      { ic: "🏆", h: { uz: "Eng aniq buyruq g'olib", ru: 'Побеждает самая точная команда' }, body: { uz: <>Eng yaxshi buyruq <b>rang, uslub va bo'limlarni</b> aniq aytadi.</>, ru: <>Лучшая команда точно называет <b>цвет, стиль и части</b>.</> }, vis: <RcFlow items={[{ uz: 'Rang', ru: 'Цвет' }, { uz: 'Stil', ru: 'Стиль' }, { uz: 'Sarlavha', ru: 'Заголовок' }, { uz: '3 karta', ru: '3 карточки' }]} />, ask: { uz: "«Chiroyli qilib ber» — chiroylini har kim boshqacha tasavvur qiladi. AI nimani chizadi?", ru: '«Сделай красиво» — красиво каждый представляет по-своему. Что нарисует AI?' } },
      { ic: "🍕", h: { uz: "Prompt = pitsa buyurtmasi", ru: 'Промпт = заказ пиццы' }, body: { uz: <>«Ovqat olib kel» emas, «katta pepperoni pitsa» desangiz, aynan xohlaganingizni olasiz.</>, ru: <>Скажете не «принеси поесть», а «большую пепперони» — получите именно то, что хотели.</> } },
      { ic: "🧩", h: { uz: "Bo'limlarni sanab ber", ru: 'Перечислите части' }, body: { uz: <>Yaxshi buyruqda sahifaning <b>bo'limlari</b> aytiladi: sarlavha, tugma, 3 ta karta.</>, ru: <>В хорошей команде названы <b>части</b> страницы: заголовок, кнопка, 3 карточки.</> }, vis: <RcFlow items={[{ uz: 'Sarlavha', ru: 'Заголовок' }, { uz: 'Tugma', ru: 'Кнопка' }, { uz: '3 karta', ru: '3 карточки' }]} /> },
    ]
  },
};

// Overlay — ekran ustida (indekslarga tegmaydi)
// Overlay — ekran USTIDA ochiladi (indekslarga tegmaydi), slayd-slayd o'tiladi.
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
        {card.ask && showAsk && <div className="rc-ask">🗣️ {tr({ uz: 'Sinfga savol:', ru: 'Вопрос классу:' })} {tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущая' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}-${tr({ uz: 'karta', ru: 'карточка' })}`} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: 'Tushunarli', ru: 'Понятно' })}</button>
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
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и счёт ✅/❌ скрыты — при нажатии «Открыть результат» всё откроется сразу и у вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>⚠️ Только <b>{pct}%</b> верно — класс не понял эту тему. Перед тем как продолжить, стоит коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>📖 {tr({ uz: 'Eslatma', ru: 'Напоминание' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. Если хотите, коротко повторите перед тем, как идти дальше.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс освоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по проценту судить сложно. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 {tr({ uz: 'Eslatma', ru: 'Напоминание' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Объясните ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь вживую…' })}</p>}
    </div>
  );
}

// ===== ✍️ MENTOR PRAKTIKA OVERLAY (jonli) — praktika-ekranda mentor kim tugatganini ko'radi =====
// Signal zonasi: PRACTICE_DONE_BASE(500)+fromScreen — test(<100)/arena(100+) bilan to'qnashmaydi.
const PRACTICE_DONE_BASE = 500;
function MentorPracticeOverlay({ entry, live, onClose }) {
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
  const total = data.players ? data.players.length : 0;
  const doneN = data.rows.length;
  const allIn = total > 0 && doneN >= total;
  const doneIds = new Set(data.rows.map(r => r.player_id));
  return (
    <div className="mp-overlay">
      <div className="mp-card">
        <div className="mp-eyebrow">✍️ {tr({ uz: 'Amaliyot · jonli', ru: 'Практика · вживую' })}</div>
        <h2 className="mp-title">{tr(entry.title)}</h2>
        <p className="mp-brief">{tr(entry.brief)}</p>
        <div className="mp-flow">
          <span className="mp-step cur">{tr({ uz: "1 · O'quvchilar o'z qurilmasida prompt yig'ib, sahifa qurmoqda", ru: '1 · Ученики собирают промпт и строят страницу на своих устройствах' })}</span>
          <span className="mp-arr">→</span>
          <span className="mp-step">{tr({ uz: "2 · Mentor doskada namuna qurib ko'rsatadi", ru: '2 · Ментор строит образец на доске' })}</span>
        </div>
        {data.players === null ? (
          <p className="mstats-wait">{tr({ uz: 'Ulanish…', ru: 'Подключение…' })}</p>
        ) : (
          <div className="mstats" style={{ marginTop: 2 }}>
            <div className="mstats-head">
              <span className="mstats-lbl">👨‍🎓 {tr({ uz: 'Praktikani tugatdi', ru: 'Завершили практику' })}</span>
              <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma tugatdi!', ru: '✓ Все закончили!' }) : <>{tr({ uz: 'Tugatdi:', ru: 'Закончили:' })} <b>{doneN}</b> / {total}</>}</span>
            </div>
            <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((doneN / total) * 100) : 0}%` }} /></div>
            {total > 0 && (
              <div className="mstats-waitrow" style={{ marginTop: 10 }}>
                {data.players.map(p => <span key={p.id} className="mstats-wait-chip" style={doneIds.has(p.id) ? { background: T.successSoft, color: T.success, fontWeight: 700 } : undefined}>{doneIds.has(p.id) ? '✓ ' : '✏️ '}{p.nickname}</span>)}
              </div>
            )}
            {total === 0 && <p className="mstats-wait">{tr({ uz: "Hali o'quvchi qo'shilmagan — ular praktikani boshlashi bilan bu yerda ✓ chiqadi…", ru: 'Пока никто не подключился — как только ученики начнут практику, здесь появятся ✓…' })}</p>}
          </div>
        )}
        <div className="mp-actions">
          <button className="mp-next" onClick={onClose} style={{ marginLeft: 'auto' }}>{tr({ uz: 'Keyingi mavzuga →', ru: 'К следующей теме →' })}</button>
        </div>
        <p className="mp-tip">{tr({ uz: "💡 Ko'pchilik tugatgach, aynan shu mashqni doskada birga qurib ko'rsating — shunda o'quvchilar o'zini tekshiradi va mavzu mustahkamlanadi.", ru: '💡 Когда большинство закончит, соберите это же упражнение вместе на доске — так ученики проверят себя, и тема закрепится.' })}</p>
      </div>
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
      if (!fpPractice) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    // Har urinish tarixga (LMS analitika, 0005): ball emas, yozuv; modulsiz eski darsda recordAttempt yo'q
    if (live && live.recordAttempt && !fpPractice) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options: options, picked: options[i], correct: options[correctIdx], lang: (typeof __lang !== 'undefined' && __lang === 'ru') ? 'ru' : 'uz' });
    if (audioText) { audio.triggerEvent('option_picked'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? (audioOk || "To'g'ri.") : (audioWrong || "Unchalik emas. Qaytadan urinib ko'ring.")); }, 300); }
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
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext mentorLock disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval natijani oching', ru: 'Сначала откройте результат' }) : solved ? { uz: 'Davom etish', ru: 'Продолжить' } : (oneShot ? { uz: 'Javob tanlang', ru: 'Выберите ответ' } : { uz: "To'g'ri javobni toping", ru: 'Найдите правильный ответ' })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: 'flex-start', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, думайте перед нажатием!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: picked !== null ? 8 : 11 }}>
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
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: picked !== null ? 'clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)' : 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(opt)}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          {(isMentorLive || waiting || wrongLocked) && (<p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? fmtCode(`✓ ${tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`)
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? fmtCode(`${tr({ uz: "To'g'ri javob:", ru: 'Правильный ответ:' })} ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`)
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>)}
          <p className="body" style={{ margin: 0 }}>
            {!isMentorLive && !waiting && !wrongLocked && <b className="fb-mark" style={{ color: solved ? T.success : T.accent, marginRight: 6 }}>{solved ? tr({ uz: "✓ To'g'ri.", ru: '✓ Верно.' }) : tr({ uz: '✗ Xato.', ru: '✗ Неверно.' })}</b>}
            {fmtCode(isMentorLive
              ? explainCorrect
              : waiting
                ? tr({ uz: "Javobingiz qabul qilindi. Mentor «Natijani ochish»ni bosganda to'g'ri javob hammada birdan ko'rinadi.", ru: 'Ваш ответ принят. Когда ментор нажмёт «Открыть результат», правильный ответ появится у всех сразу.' })
                : wrongLocked
                  ? (explainWrong[picked] ?? explainWrong.default)
                  : solved ? explainCorrect : (explainWrong[picked] ?? explainWrong.default))}
          </p>
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
              Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */}
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

// ===== BROWSER (jonli sayt preview) =====
const Browser = ({ url = 'mening-saytim.uz', children, dark = false }) => (
  <div className={`browser ${dark ? 'browser-dark' : ''}`}>
    <div className="browser-bar">
      <span className="browser-dot" style={{ background: '#FF5F56' }} />
      <span className="browser-dot" style={{ background: '#FFBD2E' }} />
      <span className="browser-dot" style={{ background: '#27C93F' }} />
      <span className="browser-url">{url}</span>
    </div>
    <div className="browser-body">{children}</div>
  </div>
);

// ===== FLOW (Hodisa -> Reaksiya -> O'zgarish) =====
const Flow = ({ step }) => {
  const NODES = [{ n: '1', l: 'Hodisa' }, { n: '2', l: 'Reaksiya' }, { n: '3', l: "O'zgarish" }];
  return (
    <div className="flow">
      {NODES.map((nd, i) => (
        <React.Fragment key={i}>
          <div className={`flow-node ${step >= i + 1 ? 'on' : ''}`}><span className="flow-n">{nd.n}</span><span>{nd.l}</span></div>
          {i < 2 && <span className="flow-arrow">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

// Kichik sayt kartasi (ko'p ekranda qayta ishlatiladi)
const SiteCard = ({ name = 'Akmal', role = 'Veb-dasturchi · 14 yosh', children }) => (
  <div className="site-card">
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className="site-ava">{(name && name.trim()[0]) || 'A'}</div>
      <div>
        <div className="site-name">{name}</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>{role}</div>
      </div>
    </div>
    {children}
  </div>
);

// ===== PROMO MA'LUMOTLARI =====
const PROMO = {
  oyin:   { tag: { uz: "O'yin", ru: 'Игра' }, title: 'PIXEL QUEST', sub: { uz: "Yangi sarguzasht o'yini — hoziroq sinab ko'ring", ru: 'Новая приключенческая игра — попробуйте прямо сейчас' }, cta: { uz: "O'ynash", ru: 'Играть' }, cards: [{ uz: '3D olam', ru: '3D-мир' }, { uz: 'Reytinglar', ru: 'Рейтинги' }, { uz: '100 daraja', ru: '100 уровней' }] },
  klub:   { tag: { uz: 'Jamoa', ru: 'Команда' }, title: 'SKY HAWKS', sub: { uz: 'Maktab basketbol jamoasi — sinov har payshanba', ru: 'Школьная баскетбольная команда — отбор по четвергам' }, cta: { uz: 'Sinovga yozilish', ru: 'Записаться на отбор' }, cards: [{ uz: 'Murabbiy', ru: 'Тренер' }, { uz: 'Turnirlar', ru: 'Турниры' }, { uz: 'Forma', ru: 'Форма' }] },
  tadbir: { tag: { uz: 'Turnir', ru: 'Турнир' }, title: 'CYBER CUP', sub: { uz: 'Yilning eng katta kibersport turniri', ru: 'Самый большой киберспортивный турнир года' }, cta: { uz: "Ro'yxatdan o'tish", ru: 'Зарегистрироваться' }, cards: [{ uz: 'Sovrinlar', ru: 'Призы' }, { uz: "5 ta o'yin", ru: '5 игр' }, { uz: 'Jonli efir', ru: 'Прямой эфир' }] },
  ilova:  { tag: { uz: 'Blog', ru: 'Блог' }, title: 'GAME REVIEW', sub: { uz: "Har hafta — yangi o'yin sharhi", ru: 'Каждую неделю — новый обзор игры' }, cta: { uz: "Obuna bo'lish", ru: 'Подписаться' }, cards: [{ uz: 'Video sharh', ru: 'Видеообзор' }, { uz: 'Maslahatlar', ru: 'Советы' }, { uz: "Sovrinli o'yinlar", ru: 'Розыгрыши' }] }
};
const STYLE_LABEL = { zamonaviy: { uz: 'zamonaviy', ru: 'современный' }, oynoqi: { uz: 'quvnoq', ru: 'весёлый' }, minimal: { uz: 'minimal', ru: 'минималистичный' } };
const COLOR_HEX = { kok: '#2563EB', yashil: '#1F9D55', sariq: '#F59E0B', siyohrang: '#7C3AED' };
// Mavzu fotosi — natija «haqiqiy saytga» o'xshasin (F-0922-52, mentor: «medialar qo'shib»).
// Rasm ustiga TANLANGAN RANG pardasi tushadi — aks holda dars o'rgatayotgan «rang» ingredienti
// ko'rinmay qoladi. Rasm yuklanmasa pastdagi to'liq gradient qoladi (156-qonun 4-band).
const TOPIC_PHOTO = {
  oyin:   { img: 'https://go.coddycamp.uz/uploads/media_library/75a3bc4b356c9424af27d20f0af03a1d.jpg', alt: { uz: 'Piksel uslubidagi sarguzasht o\'yini manzarasi', ru: 'Сцена приключенческой игры в пиксельном стиле' } },
  klub:   { img: 'https://go.coddycamp.uz/uploads/media_library/42c17f8b1519dc539fe95d5feae80373.jpg', alt: { uz: 'Maktab hovlisidagi basketbol o\'yini', ru: 'Игра в баскетбол на школьной площадке' } },
  tadbir: { img: 'https://go.coddycamp.uz/uploads/media_library/dd05e4614372468693c0235d88280a7f.jpg', alt: { uz: 'Kibersport turniri zali — o\'yinchilar va katta ekran', ru: 'Зал киберспортивного турнира — игроки и большой экран' } },
  ilova:  { img: 'https://go.coddycamp.uz/uploads/media_library/e85744abdf0e49106b7c08e4917e98f1.jpg', alt: { uz: 'Bloger ish stoli — mikrofon, kamera va monitor', ru: 'Рабочий стол блогера — микрофон, камера и монитор' } },
};
const COLOR_LABEL = { kok: { uz: "ko'k", ru: 'синий' }, yashil: { uz: 'yashil', ru: 'зелёный' }, sariq: { uz: "to'q sariq", ru: 'оранжевый' }, siyohrang: { uz: 'binafsha', ru: 'фиолетовый' } };
const TOPICS = [['oyin', { uz: "O'yin", ru: 'Игра' }], ['klub', { uz: 'Jamoa', ru: 'Команда' }], ['tadbir', { uz: 'Turnir', ru: 'Турнир' }], ['ilova', { uz: 'Blog', ru: 'Блог' }]];
const STYLES = [['zamonaviy', { uz: 'Zamonaviy', ru: 'Современный' }], ['oynoqi', { uz: 'Quvnoq', ru: 'Весёлый' }], ['minimal', { uz: 'Minimal', ru: 'Минимал' }]];
const COLORS_LIST = [['kok', { uz: "Ko'k", ru: 'Синий' }], ['yashil', { uz: 'Yashil', ru: 'Зелёный' }], ['sariq', { uz: "To'q sariq", ru: 'Оранжевый' }], ['siyohrang', { uz: 'Binafsha', ru: 'Фиолетовый' }]];
const SECTIONS = [['button', { uz: 'Tugma', ru: 'Кнопка' }], ['cards', { uz: 'Kartalar', ru: 'Карточки' }], ['banner', { uz: 'Banner', ru: 'Баннер' }]];
// YAKUNIY ekran (s15) uchun qo'shimcha ikki band — buyruq kuchayadi (F-0922-53, mentor: «kuchliroq, ko'proq promptli»).
// Boshqa ekranlarda ko'rinmaydi: dars 4 ingredientni o'rgatadi, yakunda esa o'quvchi to'liqroq buyruq tuzadi.
const AUDIENCES = [['osmir', { uz: "O'smirlar", ru: 'Подростки' }], ['oquvchi', { uz: "Maktab o'quvchilari", ru: 'Школьники' }], ['otaona', { uz: 'Ota-onalar', ru: 'Родители' }]];
const AUDIENCE_PROMPT = { osmir: { uz: "o'smirlar", ru: 'подростков' }, oquvchi: { uz: "maktab o'quvchilari", ru: 'школьников' }, otaona: { uz: 'ota-onalar', ru: 'родителей' } };
const AUDIENCE_SUB = { osmir: { uz: "o'smirlar uchun", ru: 'для подростков' }, oquvchi: { uz: "maktab o'quvchilari uchun", ru: 'для школьников' }, otaona: { uz: 'ota-onalar uchun', ru: 'для родителей' } };
const CTAS = [['boshlash', { uz: 'Boshlash', ru: 'Начать' }], ['royxat', { uz: "Ro'yxatdan o'tish", ru: 'Записаться' }], ['batafsil', { uz: 'Batafsil', ru: 'Подробнее' }]];
const CTA_LABEL = Object.fromEntries(CTAS);

// Real loyihaga yaqin nomlar — prompt "o'yinchoq" emas, AI'ga aytsa ishlaydigan darajada
const TOPIC_PROMPT = { oyin: { uz: '«Pixel Quest» o\'yini', ru: 'игры «Pixel Quest»' }, klub: { uz: '«Sky Hawks» basketbol jamoasi', ru: 'баскетбольной команды «Sky Hawks»' }, tadbir: { uz: '«Cyber Cup» kibersport turniri', ru: 'киберспортивного турнира «Cyber Cup»' }, ilova: { uz: '«Game Review» blog-kanali', ru: 'блог-канала «Game Review»' } };
// Natija-brauzerining manzili mavzuga mos bo'lsin (kalit emas, brend nomi ko'rinadi).
const TOPIC_URL = { oyin: 'pixel-quest.uz', klub: 'sky-hawks.uz', tadbir: 'cyber-cup.uz', ilova: 'game-review.uz' };
const SECTION_PROMPT = { button: { uz: 'harakat tugmasi', ru: 'кнопка действия' }, cards: { uz: '3 ta karta', ru: '3 карточки' }, banner: { uz: 'maxsus taklif banneri', ru: 'баннер спецпредложения' } };
const sectionPromptWords = (s = {}) => Object.keys(SECTION_PROMPT).filter(k => s[k]).map(k => tr(SECTION_PROMPT[k]));

// key={val} — qiymat o'zgarganda slot qayta yuklanib "pop" animatsiyasi beradi (qaysi bo'lim o'zgarganini ko'rsatadi)
const Slot = ({ val, ph }) => val ? <span className="pb-slot" key={val}>{val}</span> : <span className="pb-ph">{ph}</span>;

// Prompt — tabiiy gap; slotlar tanlovga qarab to'ladi.
// F-0803-26 (109-qonun): dars 4 ingredientni o'rgatadi, shuning uchun promptda ham AYNAN
// shu 4 tasi ko'rinadi. Ilgari oxirida «Mobil va kompyuterda chiroyli ko'rinsin» beshinchi
// gap turardi — u hech qayerda o'rgatilmaydi, tekshirilmaydi, lekin har ekranda bitta qator
// egallab, ingredientlarni ko'zdan yashirardi.
const PromptLine = ({ topic, style, color, sections, audience, cta, scroll }) => {
  const secs = sectionPromptWords(sections);
  const extra = audience !== undefined || cta !== undefined;   // yakuniy ekran rejimi
  return (
    <div className={scroll ? 'promptbox pb-scroll' : 'promptbox'}>
      {tr({
        uz: <>Menga <Slot val={topic ? tr(TOPIC_PROMPT[topic]) : null} ph="mavzu" /> uchun promo sahifa yasab ber.{' '}
          Stili <Slot val={style ? tr(STYLE_LABEL[style]) : null} ph="stil" />, asosiy rang <Slot val={color ? tr(COLOR_LABEL[color]) : null} ph="rang" />.{' '}
          Sahifada <Slot val={secs.length ? secs.join(', ') : null} ph="qismlar" /> bo'lsin.
          {extra && <> Sahifa <Slot val={audience ? tr(AUDIENCE_PROMPT[audience]) : null} ph="kimga" /> uchun.{' '}
            Tugmada <Slot val={cta ? '«' + tr(CTA_LABEL[cta]) + '»' : null} ph="tugma yozuvi" /> deb yozilsin.</>}</>,
        ru: <>Сделай мне промо-страницу для <Slot val={topic ? tr(TOPIC_PROMPT[topic]) : null} ph="тема" />.{' '}
          Стиль — <Slot val={style ? tr(STYLE_LABEL[style]) : null} ph="стиль" />, основной цвет — <Slot val={color ? tr(COLOR_LABEL[color]) : null} ph="цвет" />.{' '}
          На странице — <Slot val={secs.length ? secs.join(', ') : null} ph="части" />.
          {extra && <> Страница для <Slot val={audience ? tr(AUDIENCE_PROMPT[audience]) : null} ph="для кого" />.{' '}
            На кнопке напиши <Slot val={cta ? '«' + tr(CTA_LABEL[cta]) + '»' : null} ph="надпись кнопки" />.</>}</>
      })}
    </div>
  );
};

// ============================================================
// USTABOT — so'zma-so'z bajaruvchi robot-usta. Bola = boshliq.
// Noaniq buyruq → bo'shliqlarni kulgili literal to'ldiradi + pufakchada sabab aytadi.
// Personaj bir xil: 🤖 robot-usta. UstaBubble hamma joyda bir uslub.
// ============================================================
const USTABOT_FACE = '🤖';
const UstaBubble = ({ children, tone = 'note', small = false }) => (
  <div className={`abot-bubble abot-${tone}${small ? ' abot-sm' : ''}`}>
    <span className="abot-face" aria-hidden>{USTABOT_FACE}</span>
    <span className="abot-say">{children}</span>
  </div>
);

// QABUL AKTI — mijoz nomidan tekshiruv varag'i: har band ✓/✗, burchakda mijoz-emoji (😕→🤩).
// Xato topilsa «Dubl 2 — …» qayta-buyruq tugmasi Agentni tuzatishga yuboradi.
const AcceptanceReport = ({ checks, onRedo, redoLabel, done }) => {
  const allOk = checks.every(c => c.ok);
  const face = done && allOk ? '🤩' : allOk ? '🙂' : '😕';
  return (
    <div className={`accept-akt${done && allOk ? ' akt-happy' : ''} fade-step`}>
      <div className="akt-head">
        <span className="akt-title">{/* F-0926-06: sarlavha emojisi olindi (H3) */}{tr({ uz: 'Qabul akti', ru: 'Акт приёмки' })}</span>
        <span className="akt-client" title={tr({ uz: 'Mijoz kayfiyati', ru: 'Настроение клиента' })}>{face}</span>
      </div>
      <ul className="akt-list">
        {checks.map((c, i) => <li key={i} className={c.ok ? 'akt-ok' : 'akt-bad'}><span className="akt-mark">{c.ok ? '✓' : '✗'}</span>{tr(c.label)}</li>)}
      </ul>
      {!allOk && onRedo && <button className="btn akt-redo" onClick={onRedo}>↻ {tr({ uz: 'Dubl 2', ru: 'Дубль 2' })} — {tr(redoLabel)}</button>}
    </div>
  );
};

// Jonli promo-sahifa preview
const LandingPreview = ({ topic, style: styleIn, color: colorIn, sections = {}, noaniq = false, draft = false, audience, cta }) => {
  // DRAFT rejim: tanlanmagan ingredientni Agent so'zma-so'z (kulgili) to'ldiradi.
  // FAQAT ko'rinish — tanlov/gating'ga ta'sir qilmaydi. Chip tanlanganda o'sha qism darhol silliqqa almashadi.
  if (draft) {
    const hasTopic = !!topic, hasStyle = !!styleIn, hasColor = !!colorIn;
    const anySec = !!(sections.button || sections.cards || sections.banner);
    const p = hasTopic ? PROMO[topic] : null;
    const c = hasColor ? (COLOR_HEX[colorIn] || T.accent) : null;
    const minimal = styleIn === 'minimal';
    const radius = styleIn === 'oynoqi' ? 18 : minimal ? 6 : 12;
    // Foto faqat mavzu+stil+rang tanlanganda: rang yo'q bo'lsa neon-to'qnashuv «rangni aytmadingiz» signalini beradi
    const dph = (hasTopic && hasStyle && hasColor && !minimal) ? TOPIC_PHOTO[topic] : null;
    const heroBg = hasColor ? (minimal ? '#FFFFFF' : (dph
        ? `linear-gradient(135deg, ${c}d9, ${c}73), url(${dph.img}) center 42%/cover, linear-gradient(135deg, ${c}, ${c}cc)`
        : `linear-gradient(135deg, ${c}, ${c}cc)`))
      : 'repeating-linear-gradient(45deg, #ff1493 0 14px, #c6ff00 14px 28px)'; // kesik-ok: rang yo'q → neon to'qnashuv, «rang aytilmadi» signali (F-0926-06)
    const heroColor = hasColor ? (minimal ? T.ink : '#fff') : '#12121a';
    const heroBorder = hasStyle ? (minimal && hasColor ? `2px solid ${c}` : 'none') : '2.5px dashed #12121a';
    const heroTilt = hasStyle ? 'none' : 'rotate(-2.2deg)'; // uslub yo'q → qiyshiq/aralash
    // F-0803-26 (72-bo'lim): har yetishmagan ingredient uchun alohida pufakcha bor edi — 4 tasi
    // ustma-ust turib, ko'rinishning yarmini yeb qo'yardi. Endi HAR ingredient bitta signal
    // oladi: rang → xerodagi nishoncha, qismlar → «?» bo'sh romka, mavzu/uslub → mana shu
    // bitta qator (ularning yo'qligi rasmda ko'rinsa-da, so'zsiz tushunilmaydi).
    const missing = [];
    if (!hasTopic) missing.push(tr({ uz: 'mavzu', ru: 'тему' }));
    if (!hasStyle) missing.push(tr({ uz: 'uslub', ru: 'стиль' }));
    const missUz = missing.join(' va ');
    const notes = missing.length
      ? [tr({ uz: `${missUz.charAt(0).toUpperCase()}${missUz.slice(1)}ni aytmadingiz — o'zim to'ldirdim`, ru: `Вы не назвали ${missing.join(' и ')} — заполнил сам` })]
      : [];
    return (
      <div className="lp-draft lp-live" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div role={dph ? 'img' : undefined} aria-label={dph ? tr(dph.alt) : undefined} style={{ background: heroBg, textShadow: dph ? '0 1px 6px rgba(0,0,0,0.35)' : undefined, color: heroColor, borderRadius: hasStyle ? radius : 5, padding: 'clamp(16px,3vw,22px)', border: heroBorder, textAlign: 'center', transform: heroTilt, position: 'relative' }}>
          {!hasColor && <span className="lp-draft-badge">{tr({ uz: "Rangni o'zim tanladim! 🎨", ru: 'Цвет выбрал сам! 🎨' })}</span>}
          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.9 }}>{hasTopic ? tr(p.tag) : tr({ uz: 'Sayt', ru: 'Сайт' })}</span>
          <h3 style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 700, fontSize: 'clamp(20px,4vw,30px)', margin: '5px 0 6px', lineHeight: 1.08, transform: hasStyle ? 'none' : 'rotate(1.4deg)' }}>{hasTopic ? tr(p.title) : tr({ uz: 'SAYT', ru: 'САЙТ' })}</h3>
          <p style={{ fontSize: 13, margin: 0, opacity: 0.92, fontStyle: hasTopic ? 'normal' : 'italic' }}>{hasTopic ? tr(p.sub) + (audience ? ' — ' + tr(AUDIENCE_SUB[audience]) : '') : tr({ uz: "Bla-bla lorem — bu yerda matn bo'lishi kerak edi…", ru: 'Бла-бла лорем — тут должен был быть текст…' })}</p>
          {sections.button && <button data-dark-ok="qoralama-sayt maketi: rang aytilmagan tugma (F-0926-06)" style={{ marginTop: 13, border: 'none', borderRadius: Math.max((hasStyle ? radius : 5) - 4, 6), padding: '9px 18px', fontFamily: "'Manrope'", fontWeight: 700, fontSize: 13, cursor: 'pointer', background: hasColor ? '#fff' : '#12121a', color: hasColor ? c : '#c6ff00', transform: hasStyle ? 'none' : 'rotate(-1.6deg)' }}>{cta ? tr(CTA_LABEL[cta]) : (hasTopic ? tr(p.cta) : tr({ uz: 'Tugma', ru: 'Кнопка' }))}</button>}
        </div>
        {sections.cards && p && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {p.cards.map((cd, i) => (
              <div key={i} style={{ background: T.paper, borderRadius: 8, padding: '11px 6px', textAlign: 'center', boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.16)`, transform: hasStyle ? 'none' : `rotate(${i % 2 ? 2.2 : -2.2}deg)` }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c || '#ff1493', margin: '0 auto 6px' }} />
                <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink }}>{tr(cd)}</div>
              </div>
            ))}
          </div>
        )}
        {sections.banner && <div style={{ background: hasColor ? `${c}1f` : 'rgba(255,20,147,0.14)', color: hasColor ? c : '#ff1493', borderRadius: 8, padding: '9px 12px', fontSize: 12.5, fontWeight: 700, textAlign: 'center', transform: hasStyle ? 'none' : 'rotate(-1deg)' }}>{tr({ uz: '★ Maxsus taklif — faqat shu hafta!', ru: '★ Спецпредложение — только на этой неделе!' })}</div>}
        {!anySec && <div className="lp-draft-empty"><span className="lp-draft-q">?</span><span className="lp-draft-emptxt">{tr({ uz: "Qism yo'q — bo'sh romka qoldi", ru: 'Частей нет — осталась пустая рамка' })}</span></div>}
        {notes.length > 0 && <div className="lp-draft-notes">{notes.map((n, i) => <UstaBubble key={i} small>{n}</UstaBubble>)}</div>}
      </div>
    );
  }
  const style = styleIn || 'zamonaviy';
  const color = colorIn || 'kok';
  if (noaniq || !topic) {
    return (
      <div style={{ textAlign: 'center', padding: '26px 16px' }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#E6E1D8', margin: '0 auto 10px' }} />
        <p style={{ fontFamily: "'Source Serif 4',serif", fontWeight: 600, fontSize: 17, margin: '0 0 4px', color: T.ink2 }}>{tr({ uz: 'Sayt', ru: 'Сайт' })}</p>
        <p style={{ fontSize: 12.5, margin: 0, color: T.ink3, fontStyle: 'italic' }}>{tr({ uz: "Bu yerda biror narsa bo'lishi kerak edi…", ru: 'Здесь должно было что-то быть…' })}</p>
      </div>
    );
  }
  const p = PROMO[topic];
  const c = COLOR_HEX[color] || T.accent;
  const radius = style === 'oynoqi' ? 18 : style === 'minimal' ? 6 : 12;
  const minimal = style === 'minimal';
  const ph = minimal ? null : TOPIC_PHOTO[topic];   // «minimal» stil sodda qoladi — bu stil farqini ko'rsatadi
  return (
    <div className="lp-live" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div role={ph ? 'img' : undefined} aria-label={ph ? tr(ph.alt) : undefined}
        style={{ background: minimal ? '#FFFFFF' : (ph
          ? `linear-gradient(135deg, ${c}d9, ${c}73), url(${ph.img}) center 42%/cover, linear-gradient(135deg, ${c}, ${c}cc)`
          : `linear-gradient(135deg, ${c}, ${c}cc)`),
          textShadow: ph ? '0 1px 6px rgba(0,0,0,0.35)' : undefined, color: minimal ? T.ink : '#fff', borderRadius: radius, padding: 'clamp(16px,3vw,22px)', border: minimal ? `2px solid ${c}` : 'none', textAlign: minimal ? 'left' : 'center' }}>
        <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: minimal ? c : 'rgba(255,255,255,0.9)' }}>{tr(p.tag)}</span>
        <h3 style={{ fontFamily: "'Source Serif 4',serif", fontWeight: style === 'oynoqi' ? 700 : 600, fontSize: 'clamp(20px,4vw,30px)', margin: '5px 0 6px', lineHeight: 1.08 }}>{tr(p.title)}</h3>
        <p style={{ fontSize: 13, margin: 0, opacity: minimal ? 0.75 : 0.95 }}>{tr(p.sub)}{audience ? ' — ' + tr(AUDIENCE_SUB[audience]) : ''}</p>
        {sections.button && <button style={{ marginTop: 13, border: 'none', borderRadius: Math.max(radius - 4, 6), padding: '9px 18px', fontFamily: "'Manrope'", fontWeight: 700, fontSize: 13, cursor: 'pointer', background: minimal ? c : '#fff', color: minimal ? '#fff' : c }}>{cta ? tr(CTA_LABEL[cta]) : tr(p.cta)}</button>}
      </div>
      {sections.cards && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {p.cards.map((cd, i) => (
            <div key={i} style={{ background: T.paper, borderRadius: Math.max(radius - 4, 6), padding: '11px 6px', textAlign: 'center', boxShadow: `0 4px 12px -6px rgba(${T.shadowBase},0.16)` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, margin: '0 auto 6px' }} />
              <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink }}>{tr(cd)}</div>
            </div>
          ))}
        </div>
      )}
      {sections.banner && <div style={{ background: `${c}1f`, color: c, borderRadius: Math.max(radius - 4, 6), padding: '9px 12px', fontSize: 12.5, fontWeight: 700, textAlign: 'center' }}>{tr({ uz: '★ Maxsus taklif — faqat shu hafta!', ru: '★ Спецпредложение — только на этой неделе!' })}</div>}
    </div>
  );
};

// Mobil: berilgan element paydo bo'lganda/o'zgarganda unga avtoskroll (faqat <768px)
function useScrollIntoViewOnMobile(trigger) {
  const ref = useRef(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!trigger) return;
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 160);
    return () => clearTimeout(t);
  }, [trigger]);
  return ref;
}

// Barcha ekranlarda (mobil + desktop) avtoskroll — masalan "deploy" natijasi har doim ko'rinishi uchun
function useScrollIntoView(trigger) {
  const ref = useRef(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!trigger) return;
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 180);
    return () => clearTimeout(t);
  }, [trigger]);
  return ref;
}

// "Agent quryapti…" — jonli shimmer skeleton (oddiy matndan ko'ra tushunarliroq)
const BuildingPreview = () => (
  <div className="build-skel">
    <div className="bs-bar bs-lg" />
    <div className="bs-bar" style={{ width: '72%' }} />
    <div className="bs-bar" style={{ width: '92%' }} />
    <div className="bs-bar" style={{ width: '60%' }} />
    <p className="build-note">{tr({ uz: 'Agent quryapti…', ru: 'Агент строит…' })}</p>
  </div>
);

// Prompt-quruvchi (4 blok) — mobilda rang/qismlar tanlanganda natijaga avtoskroll;
// desktopda esa rang (3-blok) tanlanganda ham natijaga avtoskroll
// `footer` — natija ostiga qo'yiladigan blok (13-ekrandagi «Nashr qilish» tugmasi). U quruvchi
// tugmalari ostida turganda 720px ekrandan pastga tushib ketardi (F-0803-26 / F-0803-19 sinfi);
// natija yonida esa ma'nosi ham to'g'ri: «mana sahifangiz — endi uni chiqaring».
const PromoBuilder = ({ topic, setTopic, style, setStyle, color, setColor, sec, setSec, footer, audience, setAudience, cta, setCta, promptRef, promptTools }) => {
  const tog = (k) => setSec(s => ({ ...s, [k]: !s[k] }));
  const previewRef = useRef(null);
  const scrollToPreview = () => { const el = previewRef.current; if (!el) return; const t = setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 160); return () => clearTimeout(t); };
  // mobil (<768px): rang yoki qismlar o'zgarganda
  const firstM = useRef(true);
  useEffect(() => {
    if (firstM.current) { firstM.current = false; return; }
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;
    return scrollToPreview();
    // eslint-disable-next-line
  }, [`${color}|${sec.button ? 1 : 0}${sec.cards ? 1 : 0}${sec.banner ? 1 : 0}`]);
  // desktop (>=768px): rang tanlanganda
  const firstD = useRef(true);
  useEffect(() => {
    if (firstD.current) { firstD.current = false; return; }
    if (!color) return;
    if (typeof window === 'undefined' || window.innerWidth < 768) return;
    return scrollToPreview();
    // eslint-disable-next-line
  }, [color]);
  return (
    <Zoomable>
    <div className="split">
      <Col>
        {/* PROMPT — yuqorida: tugmalarni bosgan sari shu yerda yig'iladi */}
        <div className="pb-head"><p className="flow-label" style={{ margin: 0 }}>{tr({ uz: "Sizning buyrug'ingiz", ru: 'Ваша команда' })}</p>{promptTools}</div>
        <div ref={promptRef}><PromptLine topic={topic} style={style} color={color} sections={sec}
          audience={setAudience ? audience : undefined} cta={setCta ? cta : undefined} scroll={!!promptTools} /></div>
        {/* F-0803-26 (109-qonun): 4 guruh — yorliq va tugmalar BIR qatorda. Ilgari har guruh
            ikki qator egallardi (sarlavha + tugmalar) va ustiga takroriy «pastdagi 4 guruhdan
            tanlang…» qatori bor edi — natijada 3- va 4-guruh 720px ekrandan pastga tushib,
            majburiy darvoza ko'rinmay qolardi (F-0803-19 bug-sinfi). */}
        <div className="pb-group"><span className="pb-glabel">{tr({ uz: '1 · Mavzu', ru: '1 · Тема' })}</span>
          <div className="chiprow">{TOPICS.map(([v, l]) => <button key={v} className={`chip ${topic === v ? 'chip-on' : ''}`} onClick={() => setTopic(v)}>{tr(l)}</button>)}</div></div>
        <div className="pb-group"><span className="pb-glabel">{tr({ uz: '2 · Stil', ru: '2 · Стиль' })}</span>
          <div className="chiprow">{STYLES.map(([v, l]) => <button key={v} className={`chip ${style === v ? 'chip-on' : ''}`} onClick={() => setStyle(v)}>{tr(l)}</button>)}</div></div>
        <div className="pb-group"><span className="pb-glabel">{tr({ uz: '3 · Rang', ru: '3 · Цвет' })}</span>
          <div className="chiprow">{COLORS_LIST.map(([v, l]) => <button key={v} className={`chip ${color === v ? 'chip-on' : ''}`} onClick={() => setColor(v)}><span style={{ width: 11, height: 11, borderRadius: '50%', background: COLOR_HEX[v], display: 'inline-block' }} />{tr(l)}</button>)}</div></div>
        <div className="pb-group"><span className="pb-glabel">{tr({ uz: '4 · Qismlar', ru: '4 · Части' })}</span>
          <div className="chiprow">{SECTIONS.map(([k, l]) => <button key={k} className={`chip ${sec[k] ? 'chip-on' : ''}`} onClick={() => tog(k)}>{sec[k] ? '✓ ' : '+ '}{tr(l)}</button>)}</div></div>
        {setAudience && <div className="pb-group"><span className="pb-glabel">{tr({ uz: '5 · Kimga', ru: '5 · Для кого' })}</span>
          <div className="chiprow">{AUDIENCES.map(([v, l]) => <button key={v} className={`chip ${audience === v ? 'chip-on' : ''}`} onClick={() => setAudience(v)}>{tr(l)}</button>)}</div></div>}
        {setCta && <div className="pb-group"><span className="pb-glabel">{tr({ uz: '6 · Tugma yozuvi', ru: '6 · Надпись кнопки' })}</span>
          <div className="chiprow">{CTAS.map(([v, l]) => <button key={v} className={`chip ${cta === v ? 'chip-on' : ''}`} onClick={() => setCta(v)}>{tr(l)}</button>)}</div></div>}
        {footer}
      </Col>
      <Col>
        <p className="flow-label">{tr({ uz: 'Natija — jonli yangilanadi', ru: 'Результат — обновляется вживую' })}</p>
        <div ref={previewRef}><Browser url="mening-promo.uz"><LandingPreview draft topic={topic} style={style} color={color} sections={sec}
          audience={setAudience ? audience : undefined} cta={setCta ? cta : undefined} /></Browser></div>
      </Col>
    </div>
    </Zoomable>
  );
};

// Animatsiyani katta ekranda ko'rish uchun o'rovchi — ⛶ tugma, holat saqlanadi
const Zoomable = ({ children, off = false }) => { // F-0926-06: off — ⛶ bo'sh ustun ustida yolg'iz qolmasin (CssLesson1 naqshi)
  const [big, setBig] = useState(false);
  // bo'sh ustunda ⛶ va yorliq yolg'iz osilmasin (F-0926-01, 111-qonun): mazmun DOM bo'yicha o'lchanadi
  const zref = useRef(null);
  const [hasContent, setHasContent] = useState(true);
  useEffect(() => {
    const el = zref.current; if (!el) return;
    const kids = [...el.childNodes].filter(n => !(n.nodeType === 1 && n.classList.contains('zoom-btn')));
    const c = kids.some(n => (n.textContent || '').trim().length > 0 || (n.nodeType === 1 && n.querySelector('img,svg,canvas,input,textarea,video,iframe,button')));
    if (c !== hasContent) setHasContent(c);
  });
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
      <div ref={zref} className={`zoomable ${big ? 'zoom-on' : ''}${hasContent ? '' : ' z-empty'}`}>
        {hasContent && !off && <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Свернуть' }) : tr({ uz: 'Kattalashtirish', ru: 'Развернуть' })} title={big ? tr({ uz: 'Kichraytirish', ru: 'Свернуть' }) : tr({ uz: 'Kattalashtirish', ru: 'Развернуть' })}>{big ? '✕' : '⛶'}</button>}
        {children}
      </div>
    </>
  );
};

// ===== SCREEN 0 — HOOK (noaniq prompt -> bo'sh natija) =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  useAudio([{ id: 's0', text: "AI'ga shunchaki «sayt yasab ber» desangiz — nima chiqadi? Noaniq buyruqni yuboring va o'ngdagi natijaga qarang: kutganingizday chiqmaydi, chunki AI miyangizni o'qiy olmaydi.", trigger: 'on_mount', waits_for: null }]);
  const [phase, setPhase] = useState(storedAnswer ? 'built' : 'idle');
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const OPTS = [
    { id: 'a', label: tr({ uz: "AI nima xohlayotganimni bilmadi — juda kam tushuntirdim", ru: 'AI не понял, чего я хочу — я слишком мало объяснил' }) },
    { id: 'b', label: tr({ uz: "AI buzilgan, shuning uchun bo'sh chiqdi", ru: 'AI сломался, поэтому вышло пусто' }) },
    { id: 'c', label: tr({ uz: "Internet sekin bo'lgani uchun", ru: 'Из-за медленного интернета' }) }
  ];
  const send = () => { clearTimeout(timer.current); setPhase('building'); timer.current = setTimeout(() => setPhase('built'), 1100); };
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  const built = phase === 'built';
  return (
    <Stage eyebrow={{ uz: 'Kirish', ru: 'Введение' }} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        {/* maxWidth 820 → 1000: sarlavha ikki qatordan bittaga tushadi va quyidagi savol-variantlar
            ko'rish zonasiga sig'adi (F-0803-26) */}
        <h1 className="title h-title fade-up">{tr({ uz: <>AI'ga shunchaki <span className="italic" style={{ color: T.accent }}>«sayt yasab ber»</span> desangiz — nima chiqadi?</>, ru: <>Что получится, если сказать AI просто <span className="italic" style={{ color: T.accent }}>«сделай сайт»</span>?</> })}</h1>
        <Mentor>{tr({ uz: "Shu qisqa buyruqni AI'ga yuboring va natijaga qarang — kutganingizday chiqdimi?", ru: 'Отправьте AI эту короткую команду и посмотрите на результат — вышло, как вы ждали?' })}</Mentor>{/* F-0926-06: joy so'zi («quyidagi»/«ниже») olindi (159/11) */}
        <Zoomable>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Sizning buyrug'ingiz", ru: 'Ваша команда' })}</p>
            <div className="promptbox">{tr({ uz: <>Menga <span className="pb-slot">sayt</span> yasab ber.</>, ru: <>Сделай мне <span className="pb-slot">сайт</span>.</> })}</div>
            <button className="btn" onClick={send} disabled={phase === 'building'} style={{ alignSelf: 'flex-start' }}>{phase === 'building' ? tr({ uz: 'Quryapti…', ru: 'Строит…' }) : (built ? tr({ uz: '↻ Qayta yuborish', ru: '↻ Отправить заново' }) : tr({ uz: "AI'ga yuborish", ru: 'Отправить AI' }))}</button>
            {/* F-0803-26: savol va variantlar O'NG ustunda, natija-oynasining OSTIDA turardi —
                720px ekranda ular 394px pastga tushib ketardi. O'quvchi «yuborish»ni bosgach
                faqat rasmni ko'rardi, «Davom etish» esa ochilmasdi (F-0803-19 bug-sinfi,
                foydalanuvchi 11-sahifada aynan shuni aytgan edi). Endi savol chap ustunda —
                bo'sh joyda, buyruq ostida; natija esa o'ngda, yonma-yon turadi. */}
            {built && (
              <div className="fade-step">
                <p className="eyebrow" style={{ color: T.ink2, margin: '0 0 9px' }}>{tr({ uz: "Nega natija bunchalik bo'sh?", ru: 'Почему результат такой пустой?' })}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {OPTS.map(o => { const on = picked === o.id; return (
                    <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                      <span className="radio">{on && <span className="radio-dot" />}</span><span>{o.label}</span>
                    </button>); })}
                </div>
                {picked !== null && <p className="hook-ack fade-step">{tr({ uz: <>{picked === 'a' ? "To'g'ri!" : 'Aslida,'} AI tez, lekin o'ylaganingizni o'qiy olmaydi. <b>Aniq aytsangiz — aniq natija.</b></>, ru: <>Верно! AI быстрый, но мысли ваши читать не умеет. <b>Скажете точно — получите точный результат.</b></> })}</p>}
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija', ru: 'Результат' })}</p>
            <Browser url="ai-natija.uz">
              {phase === 'idle' && <p className="small" style={{ margin: 0, opacity: 0.5, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: '(hali yuborilmadi)', ru: '(ещё не отправлено)' })}</p>}
              {phase === 'building' && <BuildingPreview />}
              {built && <div className="result-reveal"><LandingPreview draft /></div>}
            </Browser>
            {built && <UstaBubble tone="warn">{tr({ uz: "So'zma-so'z bajardim — lekin kam aytdingiz!", ru: 'Выполнил дословно — но вы сказали мало!' })}</UstaBubble>}
          </Col>
        </Split>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (F-1015-336): «Avval tayyorlaning ▾» + «Yaxshi prompt — 4 qism» + 3 blok =====
const TAYYOR = [
  { uz: <>Ish stolida <span className="qcode">promo</span> papkasini yarating va VS Code'da oching; ichida <span className="qcode">index.html</span> va <span className="qcode">style.css</span>, Go Live.</>, ru: <>Создайте на рабочем столе папку <span className="qcode">promo</span> и откройте её в VS Code; внутри <span className="qcode">index.html</span> и <span className="qcode">style.css</span>, Go Live.</> },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' },
  { uz: "Copilot yoqilganini tekshiring — VS Code pastki chizig'ida Copilot belgisi bor.", ru: 'Проверьте, что Copilot включён — в нижней строке VS Code есть значок Copilot.' }
];
const QISMLAR = [{ uz: 'mavzu', ru: 'тема' }, { uz: 'uslub', ru: 'стиль' }, { uz: 'rang', ru: 'цвет' }, { uz: "bo'limlar", ru: 'разделы' }];
const REJA_BLOK = [
  { t: { uz: 'Promo sahifa', ru: 'Промо-страница' }, tag: { uz: 'Gemini · 4 qism', ru: 'Gemini · 4 части' } },
  { t: { uz: 'Yaxshilash', ru: 'Улучшение' }, tag: { uz: "Gemini · aniq so'rov", ru: 'Gemini · точный запрос' } },
  { t: { uz: "Yangi bo'lim", ru: 'Новый раздел' }, tag: 'Copilot' },
  { t: { uz: 'Wow effekt', ru: 'Вау-эффект' }, tag: 'Gemini · JavaScript' }
];
// F-1015-334 (foydalanuvchi, A variant): «Avval tayyorlaning» — ochiladigan, ko'zga tashlanadigan tugma; ochilmaguncha «nafas oladi»
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
    <div className="fade-up delay-1"><div className={`am-tayyor am-tt ${korgan ? '' : 'am-tt-nafas'}`}>
      <button ref={btnRef} type="button" className="am-tt-btn" aria-haspopup="dialog" aria-expanded={ochiq} onClick={() => { setOchiq(true); setKorgan(true); }}>
        <span className="am-tayyor-h">{sarlavha}</span>
        <span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && createPortal(<>
        <div className="zoom-backdrop" onClick={yop} />
        <div className="am-tt-oyna" role="dialog" aria-modal="true" aria-label={tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })}>
          <div className="am-tt-oyna-h"><span className="am-tayyor-h">{sarlavha}</span><button ref={yopRef} type="button" className="am-tt-yop" onClick={yop} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button></div>
          <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{tr(x)}</span></li>)}</ol>
          <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Boshlaymiz».", ru: 'Готово — «Начинаем».' })}</p>
        </div>
      </>, (btnRef.current && btnRef.current.closest('.lesson-root')) || document.body)}
    </div></div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={{ uz: 'Reja', ru: 'План' }} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz', ru: 'Начинаем' }} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun AI'ga <span className="italic" style={{ color: T.accent }}>aniq prompt</span> yozishni o'rganasiz.</>, ru: <>Сегодня научитесь писать AI <span className="italic" style={{ color: T.accent }}>точный промпт</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <><b style={{ color: T.ink }}>Promo sahifa</b> — biror tadbir yoki o'yinni tanishtirib, odamlarni chaqiradigan bitta sahifa. Bugun o'zingiz tanlagan mavzuga shunday sahifa qurasiz. Yaxshi prompt <b style={{ color: T.ink }}>4 qismdan</b> iborat — ularni o'ngda ko'rasiz.</>, ru: <><b style={{ color: T.ink }}>Промо-страница</b> — одна страница, которая знакомит с событием или игрой и зовёт людей. Сегодня построите такую страницу на свою тему. Хороший промпт состоит из <b style={{ color: T.ink }}>4 частей</b> — они справа.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</p>
          <PromoMaket f={promoNamuna()} qoidalar />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: 'Yaxshi prompt — 4 qism', ru: 'Хороший промпт — 4 части' })}</p>
            <div className="am-qism-ro">{QISMLAR.map((q, i) => <span key={i} className="am-qism"><b>{i + 1}</b>{tr(q)}</span>)}</div>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${REJA_BLOK.length} blok`, ru: `${REJA_BLOK.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{REJA_BLOK.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== Bitta vizual — o'quvchi yozganidan jonli quriladigan promo sahifa (4 qism ko'rinib turadi; yetishmagani — uzuq «?») =====
const PROMO_KEY = 'ccPromo';
const promoRead = () => { try { const v = JSON.parse(localStorage.getItem(PROMO_KEY) || 'null'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
const promoWrite = (patch) => { try { localStorage.setItem(PROMO_KEY, JSON.stringify({ ...promoRead(), ...patch, savedAt: Date.now() })); } catch { /* saqlab bo'lmadi */ } };
const PM_USLUB = [{ id: 'zamonaviy', l: { uz: 'Zamonaviy', ru: 'Современный' } }, { id: 'quvnoq', l: { uz: 'Quvnoq', ru: 'Весёлый' } }, { id: 'sodda', l: { uz: 'Sodda', ru: 'Простой' } }];
const PM_RANG = [{ id: 'kok', l: { uz: "Ko'k", ru: 'Синий' }, c: '#1d4ed8' }, { id: 'yashil', l: { uz: 'Yashil', ru: 'Зелёный' }, c: '#15803d' }, { id: 'sariq', l: { uz: "To'q sariq", ru: 'Оранжевый' }, c: '#c2410c' }, { id: 'binafsha', l: { uz: 'Binafsha', ru: 'Фиолетовый' }, c: '#6d28d9' }];
const PM_MISOL = [{ uz: 'Maktab futbol turniri', ru: 'Школьный футбольный турнир' }, { uz: "O'yin klubi", ru: 'Игровой клуб' }, { uz: 'Kibersport turniri', ru: 'Киберспортивный турнир' }];
const PROMO_NAMUNA = { mavzu: { uz: 'Maktab futbol turniri', ru: 'Школьный футбольный турнир' }, tugma: { uz: "Ro'yxatdan o'tish", ru: 'Записаться' }, kartalar: { uz: '25-oktabr, Maktab stadioni, Kubok va medallar', ru: '25 октября, Школьный стадион, Кубок и медали' } };
const promoNamuna = () => ({ mavzu: tr(PROMO_NAMUNA.mavzu), uslub: 'zamonaviy', rang: 'kok', tugma: tr(PROMO_NAMUNA.tugma), kartalar: tr(PROMO_NAMUNA.kartalar) });
const PromoMaket = ({ f = {}, qoidalar = false, wow = null }) => {
  // F-1015-337: wow effektlari namunasi — taymer · konfetti · zarrachalar · 3D kartalar
  const maqsad = useRef(Date.now() + ((12 * 24 + 5) * 60 + 42) * 60000);
  const [hozir, setHozir] = useState(() => Date.now());
  const [konf, setKonf] = useState([]);
  useEffect(() => { if (wow !== 'taymer') return undefined; const t = setInterval(() => setHozir(Date.now()), 1000); return () => clearInterval(t); }, [wow]);
  const portla = () => {
    if (wow !== 'konfetti') return;
    const id = Date.now();
    setKonf(k => [...k, ...Array.from({ length: 26 }, (_, i) => ({ id: `${id}-${i}`, x: (i * 37) % 100, d: (i % 7) * 0.04, r: (i * 53) % 360, c: i % 4 }))]);
    setTimeout(() => setKonf(k => k.filter(p => !p.id.startsWith(`${id}-`))), 1900);
  };
  useEffect(() => { if (wow !== 'konfetti') return undefined; const t = setTimeout(portla, 500); return () => clearTimeout(t); }, [wow]); // eslint-disable-line
  const qoldi = Math.max(0, maqsad.current - hozir);
  const egil = (e) => { if (wow !== 'egilish') return; const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; e.currentTarget.style.transform = `perspective(500px) rotateY(${x * 22}deg) rotateX(${-y * 22}deg) translateY(-4px)`; };
  const qaytar = (e) => { e.currentTarget.style.transform = ''; };
  const rang = PM_RANG.find(r => r.id === f.rang);
  const c = rang ? rang.c : null;
  const uslub = f.uslub || null;
  const kartalar = (f.kartalar || '').split(',').map(x => x.trim()).filter(Boolean).slice(0, 3);
  const bosh = (t, cls = '') => <span className={`pm-yoq ${cls}`}>? {tr(t)}</span>;
  return (
    <div className={`pm-sayt ${uslub ? `pm-${uslub}` : 'pm-uslubsiz'}`} style={{ '--pm': c || '#64748b' }}>
      <div className="pm-bar"><span className="bb-dots"><i /><i /><i /></span><span className="pm-url">promo · Live Server</span></div>
      <div className="pm-body">
        <div className={`pm-hero ${c ? '' : 'pm-rangsiz'}`}>
          {(wow === 'zarra' || konf.length > 0) && <div className="pm-fonqat" aria-hidden="true">
            {wow === 'zarra' && Array.from({ length: 16 }, (_, i) => <i key={i} className="pm-zarra" style={{ left: `${(i * 23) % 96}%`, top: `${(i * 41) % 90}%`, width: 4 + (i % 4) * 2, height: 4 + (i % 4) * 2, animationDuration: `${5 + (i % 5)}s`, animationDelay: `${-(i % 6)}s` }} />)}
            {konf.map(p => <i key={p.id} className={`pm-konf pm-konf${p.c}`} style={{ left: `${p.x}%`, animationDelay: `${p.d}s`, '--r': `${p.r}deg` }} />)}
          </div>}
          {f.mavzu && f.mavzu.trim() ? <p className="pm-h1">{f.mavzu.trim()}</p> : bosh({ uz: 'mavzu', ru: 'тема' }, 'pm-yoq-h')}
          <p className="pm-p">{tr({ uz: 'Bizga qo\'shiling — joylar soni cheklangan!', ru: 'Присоединяйтесь — мест немного!' })}</p>
          {wow === 'taymer' && <div className="pm-taymer" aria-label={tr({ uz: 'Boshlanishigacha', ru: 'До начала' })}>{[[Math.floor(qoldi / 864e5), { uz: 'kun', ru: 'дн' }], [Math.floor(qoldi / 36e5) % 24, { uz: 'soat', ru: 'ч' }], [Math.floor(qoldi / 6e4) % 60, { uz: 'daq', ru: 'мин' }], [Math.floor(qoldi / 1e3) % 60, { uz: 'son', ru: 'сек' }]].map(([v, l], i) => <span key={i}><b>{String(v).padStart(2, '0')}</b><small>{tr(l)}</small></span>)}</div>}
          {f.tugma && f.tugma.trim() ? (wow === 'konfetti' ? <button type="button" className="pm-tugma pm-tugma-btn" onClick={portla}>{f.tugma.trim()}</button> : <span className="pm-tugma">{f.tugma.trim()}</span>) : bosh({ uz: 'tugma', ru: 'кнопка' })}
          {!c && <span className="pm-izoh">{tr({ uz: 'rang aytilmadi', ru: 'цвет не назван' })}</span>}
          {!uslub && <span className="pm-izoh">{tr({ uz: 'uslub aytilmadi', ru: 'стиль не назван' })}</span>}
        </div>
        <div className={`pm-kartalar ${wow === 'egilish' ? 'pm-egil' : ''}`}>{[0, 1, 2].map(i => kartalar[i] ? <div key={i} className="pm-karta" onMouseMove={egil} onMouseLeave={qaytar}><i />{kartalar[i]}</div> : <div key={i} className="pm-karta pm-karta-yoq">?</div>)}</div>
        {qoidalar && <div className="pm-qoida am-ochil"><p className="pm-h2">{tr({ uz: 'Qoidalar', ru: 'Правила' })}</p><ul>{[{ uz: 'Jamoada 7 o\'yinchi', ru: '7 игроков в команде' }, { uz: "O'yin 2 × 20 daqiqa", ru: 'Игра 2 × 20 минут' }, { uz: "Ro'yxat 24-oktabrgacha", ru: 'Запись до 24 октября' }].map((x, i) => <li key={i}>{tr(x)}</li>)}</ul></div>}
        <div className="pm-ft">{(f.mavzu && f.mavzu.trim()) || tr({ uz: 'Promo sahifa', ru: 'Промо-страница' })} · 2026</div>
      </div>
    </div>
  );
};
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
const Qadamlar = ({ b, cls = '' }) => (
  <div className={`am-karta ${cls}`}>
    <p className="flow-label">{tr({ uz: 'Qadamlar', ru: 'Шаги' })}</p>
    <ol className="am-qadam">{b.qadamlar.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
    {b.yordam && <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(b.yordam)}</p>}
  </div>
);
// F-1015-330: a2/a3 da qadamlar bitta tugmada — o'ngdagi namuna ostida, bosilsa ochiladi
// F-1015-372: «Qadamlar» pastga ochilmaydi — o'rtada oyna («Avval tayyorlaning» kabi); ✕, Esc yoki fon bilan yopiladi, fokus tugmaga qaytadi
const QadamTugma = ({ b, cls = '' }) => {
  const [ochiq, setOchiq] = useState(false);
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
  const sarlavha = <>{tr({ uz: 'Qadamlar', ru: 'Шаги' })} · {b.qadamlar.length}</>;
  return (
    <div className={`am-karta am-qt ${cls}`}>
      <button ref={btnRef} type="button" className="am-qt-btn" aria-haspopup="dialog" aria-expanded={ochiq} onClick={() => setOchiq(true)}>
        <span>{sarlavha}</span><span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && createPortal(<>
        <div className="zoom-backdrop" onClick={yop} />
        <div className="am-tt-oyna" role="dialog" aria-modal="true" aria-label={tr({ uz: 'Qadamlar', ru: 'Шаги' })}>
          <div className="am-tt-oyna-h"><span className="am-tayyor-h">{sarlavha}</span><button ref={yopRef} type="button" className="am-tt-yop" onClick={yop} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button></div>
          <ol className="am-qadam">{b.qadamlar.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
        </div>
      </>, (btnRef.current && btnRef.current.closest('.lesson-root')) || document.body)}
    </div>
  );
};

const KodNusxa = ({ yorliq, kod }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(kod); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-kod">
      <div className="am-prompt-h"><p className="flow-label">{tr(yorliq)}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></div>
      <pre className="am-masalan">{kod}</pre>
    </div>
  );
};


// ===== a1 — 4 qismli prompt (forma → Saqlash → prompt; maket yozuvdan jonli) =====
const A1 = {
  qadamlar: [
    { uz: "4 qismni yozing va «Saqlash»ni bosing — prompt tayyor bo'ladi.", ru: 'Заполните 4 части и нажмите «Сохранить» — промпт будет готов.' },
    { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring.", ru: '«Скопировать промпт» → вставьте в gemini.google.com и отправьте.' },
    { uz: "Javobdagi kodlarni `promo` papkasidagi `index.html` va `style.css` ga qo'ying, `Ctrl+S`.", ru: 'Вставьте код из ответа в `index.html` и `style.css` папки `promo`, `Ctrl+S`.' },
    { uz: "Live Server'da solishtiring: mavzu — sarlavhada, rang — tugmada, bo'limlar — kartalarda bormi?", ru: 'Сравните в Live Server: тема — в заголовке, цвет — на кнопке, разделы — в карточках?' }
  ]
};
const a1Prompt = (f) => {
  const u = PM_USLUB.find(x => x.id === f.uslub), r = PM_RANG.find(x => x.id === f.rang);
  return { uz: `${f.mavzu} uchun promo sahifa yasa.\nUslubi ${tr(u.l).toLowerCase()}, asosiy rang ${tr(r.l).toLowerCase()}.\nSahifada: katta sarlavha, «${f.tugma}» tugmasi va 3 ta karta — ${f.kartalar}.\nindex.html va style.css'ni alohida, to'liq yoz.`,
    ru: `Сделай промо-страницу для: ${f.mavzu}.\nСтиль ${tr(u.l).toLowerCase()}, основной цвет ${tr(r.l).toLowerCase()}.\nНа странице: крупный заголовок, кнопка «${f.tugma}» и 3 карточки — ${f.kartalar}.\nНапиши index.html и style.css отдельно и целиком.` };
};
const ScreenPrompt = ({ screen, onNext, onPrev }) => {
  const [f, setF] = useState(() => { const d = promoRead(); return { mavzu: d.mavzu || '', uslub: d.uslub || null, rang: d.rang || null, tugma: d.tugma || '', kartalar: d.kartalar || '' }; });
  const [saqlangan, setSaqlangan] = useState(() => !!promoRead().saqlangan);
  const [yigil, setYigil] = useState(() => !!promoRead().saqlangan);
  const yoz = (k, v) => { setF(n => ({ ...n, [k]: v })); promoWrite({ [k]: v }); };
  const toliq = f.mavzu.trim().length >= 3 && !!f.uslub && !!f.rang && f.tugma.trim().length >= 2 && f.kartalar.trim().length >= 3;
  const saqla = () => { if (!toliq) return; promoWrite({ saqlangan: true }); setSaqlangan(true); setYigil(true); };
  const matn = toliq && saqlangan ? tr(a1Prompt({ ...f, mavzu: f.mavzu.trim(), tugma: f.tugma.trim(), kartalar: f.kartalar.trim() })) : null;
  return (
    <Stage eyebrow={{ uz: 'Amaliyot 1 · 4 qism', ru: 'Практика 1 · 4 части' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: 'Promo sahifangizni bitta aniq prompt bilan quring.', ru: 'Постройте промо-страницу одним точным промптом.' })}</h2></div>
        <Split>
          <Col>
            {!yigil && <div className="am-karta fade-up delay-1">
              <label className="am-maydon"><span>{tr({ uz: '1 · Mavzu — kim uchun, nima', ru: '1 · Тема — для кого, что' })}</span><input className="am-input" value={f.mavzu} placeholder={tr({ uz: 'masalan: Maktab futbol turniri', ru: 'например: Школьный футбольный турнир' })} onChange={e => yoz('mavzu', e.target.value)} /></label>
              <div className="am-chips">{PM_MISOL.map((m, i) => <button key={i} type="button" className="am-chip" onClick={() => yoz('mavzu', tr(m))}>{tr(m)}</button>)}</div>
              <div className="am-maydon"><span>{tr({ uz: '2 · Uslub', ru: '2 · Стиль' })}</span><div className="am-chips">{PM_USLUB.map(u => <button key={u.id} type="button" className={`am-chip ${f.uslub === u.id ? 'on' : ''}`} aria-pressed={f.uslub === u.id} onClick={() => yoz('uslub', u.id)}>{tr(u.l)}</button>)}</div></div>
              <div className="am-maydon"><span>{tr({ uz: '3 · Rang', ru: '3 · Цвет' })}</span><div className="am-chips">{PM_RANG.map(r => <button key={r.id} type="button" className={`am-chip ${f.rang === r.id ? 'on' : ''}`} aria-pressed={f.rang === r.id} onClick={() => yoz('rang', r.id)}><i className="am-chip-rang" style={{ background: r.c }} />{tr(r.l)}</button>)}</div></div>
              <label className="am-maydon"><span>{tr({ uz: "4 · Bo'limlar — tugma yozuvi", ru: '4 · Разделы — надпись кнопки' })}</span><input className="am-input" value={f.tugma} placeholder={tr({ uz: "masalan: Ro'yxatdan o'tish", ru: 'например: Записаться' })} onChange={e => yoz('tugma', e.target.value)} /></label>
              <label className="am-maydon"><span>{tr({ uz: "3 ta karta — vergul bilan", ru: '3 карточки — через запятую' })}</span><input className="am-input" value={f.kartalar} placeholder={tr({ uz: 'masalan: sana, joy, sovrin', ru: 'например: дата, место, приз' })} onChange={e => yoz('kartalar', e.target.value)} /></label>
              <button type="button" className="am-saqla" disabled={!toliq} onClick={saqla}>{tr(toliq ? { uz: 'Saqlash', ru: 'Сохранить' } : { uz: "4 qismni to'ldiring", ru: 'Заполните 4 части' })}</button>
            </div>}
            {yigil && <div className="am-karta am-ochil">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Sizning 4 qismingiz', ru: 'Ваши 4 части' })}</p><button type="button" className="am-nusxa" onClick={() => setYigil(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button></div>
              <p className="am-loyiha-nom">{f.mavzu}</p>
              <p className="am-satr">{tr(PM_USLUB.find(x => x.id === f.uslub).l)} · {tr(PM_RANG.find(x => x.id === f.rang).l)} · «{f.tugma}» · {f.kartalar}</p>
            </div>}
            {matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={{ uz: 'Prompt tayyor — endi Gemini orqali quring.', ru: 'Промпт готов — теперь стройте с помощью Gemini.' }} /></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Natija · yozganingizdan quriladi", ru: 'Результат · строится из вашего текста' })}</p>
            <PromoMaket f={f} />
            <p className="small am-osti">{tr({ uz: "Qaysi qism yetishmasa, sahifada «?» bo'lib turadi — AI uni o'zi to'ldiradi.", ru: 'Если какой-то части нет, на странице стоит «?» — AI заполнит её сам.' })}</p>
            <QadamTugma b={A1} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a2 — iteratsiya (pilot «Yaxshilash» shakli): bitta kamchilik → aniq so'rov; kamida ikki marta =====
const TEKSHIR = [
  { uz: 'Sarlavha mavzuingizni aytyaptimi?', ru: 'Заголовок говорит о вашей теме?' },
  { uz: "Tugma ko'zga tashlanadimi?", ru: 'Кнопка заметна?' },
  { uz: '3 karta bir qatordami?', ru: '3 карточки в один ряд?' },
  { uz: 'Rang hamma joyda bir xilmi?', ru: 'Цвет везде одинаковый?' },
  { uz: "Oynani toraytiring: telefonda sig'adimi?", ru: 'Сузьте окно: помещается на телефоне?' }
];
const YAX_QADAM = {
  qadamlar: [
    { uz: "Ro'yxat bo'yicha sahifangizga qarang va bitta kamchilikni tanlang.", ru: 'Проверьте страницу по списку и выберите один недочёт.' },
    { uz: "Uni aniq yozing: «rang» emas — «tugma rangi to'q yashil bo'lsin».", ru: 'Опишите точно: не «цвет», а «пусть кнопка будет тёмно-зелёной».' },
    { uz: "«Promptni nusxalash» → Gemini'ga yuboring, javobdagi kodni faylga qo'ying, `Ctrl+S`.", ru: '«Скопировать промпт» → отправьте в Gemini, вставьте код из ответа в файл, `Ctrl+S`.' },
    { uz: '«Keyingi kamchilik» — va yana. Kamida ikki marta.', ru: '«Следующий недочёт» — и снова. Минимум два раза.' }
  ]
};
const YAX_MAYDON = [
  { k: 'yoqmadi', l: { uz: 'Nima yoqmadi?', ru: 'Что не нравится?' }, ph: { uz: 'masalan: tugma juda kichik', ru: 'например: кнопка слишком маленькая' } },
  { k: 'qanday', l: { uz: "Qanday bo'lsin?", ru: 'Как должно быть?' }, ph: { uz: "masalan: kattaroq va to'q yashil bo'lsin", ru: 'например: побольше и тёмно-зелёная' } }
];
const ScreenIteratsiya = ({ screen, onNext, onPrev }) => {
  const [f, setF] = useState({ yoqmadi: '', qanday: '' });
  const [soni, setSoni] = useState(() => promoRead().yaxshi || 0);
  const tayyor = YAX_MAYDON.every(m => f[m.k].trim().length >= 3);
  const keyingi = () => { const n = soni + 1; setSoni(n); promoWrite({ yaxshi: n }); setF({ yoqmadi: '', qanday: '' }); };
  const matn = tayyor ? tr({ uz: `Sahifamni yaxshila — faqat shu joyni o'zgartir, qolganiga tegma.\nYoqmagani: ${f.yoqmadi.trim()}.\nQanday bo'lsin: ${f.qanday.trim()}.\nO'zgargan faylni to'liq qaytar.\nMana kodim: {index.html va style.css kodini shu yerga qo'ying}`, ru: `Улучши мою страницу — меняй только это место, остальное не трогай.\nНе нравится: ${f.yoqmadi.trim()}.\nКак должно быть: ${f.qanday.trim()}.\nВерни изменённый файл целиком.\nВот мой код: {вставьте сюда код index.html и style.css}` }) : null;
  return (
    <Stage eyebrow={{ uz: 'Amaliyot 2 · iteratsiya', ru: 'Практика 2 · итерация' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Natijani aniq so'rab yaxshilang.", ru: 'Улучшите результат точными запросами.' })}</h2></div>
        <Mentor>{tr({ uz: <>Birinchi natija kamdan-kam mukammal bo'ladi. Bitta so'rov — <b style={{ color: T.ink }}>bitta o'zgarish</b>: shunda AI nimani o'zgartirganini darrov ko'rasiz.</>, ru: <>Первый результат редко бывает идеальным. Один запрос — <b style={{ color: T.ink }}>одно изменение</b>: так сразу видно, что изменил AI.</> })}</Mentor>
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
              <p className="flow-label">{tr({ uz: 'Sahifangizni tekshiring', ru: 'Проверьте страницу' })}</p>
              <ul className="am-band">{TEKSHIR.map((x, i) => <li key={i}>{tr(x)}</li>)}</ul>
            </div>
            <Qadamlar b={YAX_QADAM} cls="fade-up delay-2" />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a3 — Copilot bilan yangi bo'lim =====
const A3_IZOH = "<!-- qoidalar bo'limi: sarlavha va 3 bandli ro'yxat -->";
const A3 = {
  qadamlar: [
    { uz: "`index.html` da kartalardan keyin izohni qo'ying va `Enter` bosing.", ru: 'В `index.html` после карточек вставьте комментарий и нажмите `Enter`.' },
    { uz: "Kulrang taklif chiqadi — o'qing, to'g'ri bo'lsa `Tab` bilan qabul qiling.", ru: 'Появится серая подсказка — прочитайте, если верно, примите клавишей `Tab`.' },
    { uz: "`Ctrl+S` — brauzerda tekshiring. Qoidalar sizning mavzuingizga mos bo'lmasa, o'zingiz tuzating.", ru: '`Ctrl+S` — проверьте в браузере. Если правила не подходят к вашей теме — исправьте сами.' }
  ]
};
const ScreenBolim = ({ screen, onNext, onPrev }) => {
  const f = promoRead();
  const fx = f.mavzu && f.uslub && f.rang ? f : promoNamuna();
  return (
    <Stage eyebrow={{ uz: 'Amaliyot 3 · Copilot', ru: 'Практика 3 · Copilot' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Copilot bilan sahifaga yangi bo'lim qo'shing.", ru: 'Добавьте раздел на страницу с Copilot.' })}</h2></div>
        <Mentor>{tr({ uz: <>Izoh yozasiz — bo'limni Copilot taklif qiladi. Taklifni qabul qilish yoki o'zgartirish — <b style={{ color: T.ink }}>sizning</b> qaroringiz.</>, ru: <>Пишете комментарий — раздел предлагает Copilot. Принять или изменить — решаете <b style={{ color: T.ink }}>вы</b>.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1"><KodNusxa yorliq={{ uz: 'index.html ga — kartalardan keyin', ru: 'в index.html — после карточек' }} kod={A3_IZOH} /></div>
            <Qadamlar b={A3} cls="fade-up delay-2" />
            <details className="am-yordam"><summary>{tr({ uz: 'Taklif chiqmadimi?', ru: 'Подсказка не появилась?' })}</summary><p>{tr({ uz: "Izohdan keyin Enter'ni yana bir bosing. Baribir chiqmasa — pastki chiziqdagi Copilot belgisini tekshiring yoki shu izohni Gemini'ga yuboring.", ru: 'Нажмите Enter после комментария ещё раз. Если нет — проверьте значок Copilot в нижней строке или отправьте комментарий в Gemini.' })}</p></details>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Kutilgan natija · «Qoidalar» bo'limi", ru: 'Ожидаемый результат · раздел «Правила»' })}</p>
            <PromoMaket f={fx} qoidalar />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};


// ===== a4 — WOW EFFEKT (F-1015-337, testdan keyin): AI JavaScript bilan yozadi; namunada jonli =====
const WOWS = [
  { id: 'taymer', name: { uz: 'Taymer', ru: 'Таймер' }, sub: { uz: 'boshlanishigacha qolgan vaqt', ru: 'сколько осталось до начала' },
    p: { uz: "Bosh qismga tadbir boshlanishigacha qolgan vaqtni ko'rsatadigan taymer qo'sh: kun, soat, daqiqa, soniya — har soniyada yangilansin. Sana — 2026-yil 1-noyabr, soat 09:00.", ru: 'Добавь в главный блок таймер, который показывает, сколько осталось до начала события: дни, часы, минуты, секунды — обновляется каждую секунду. Дата — 1 ноября 2026, 09:00.' } },
  { id: 'konfetti', name: { uz: 'Konfetti', ru: 'Конфетти' }, sub: { uz: 'tugma bosilsa sochiladi', ru: 'разлетается при нажатии' },
    p: { uz: "Asosiy tugma bosilganda ekranga rangli konfetti (qog'ozchalar) sochilsin va 2 soniyada yo'qolsin; ranglari — saytimdagi ranglar.", ru: 'При нажатии на главную кнопку по экрану разлетается цветное конфетти и исчезает за 2 секунды; цвета — как на моём сайте.' } },
  { id: 'zarra', name: { uz: 'Uchar zarrachalar', ru: 'Летающие частицы' }, sub: { uz: 'bosh qism orqasida suzadi', ru: 'плывут за главным блоком' },
    p: { uz: "Bosh qism (hero) orqasida 20 ta kichik oq, yarim shaffof nuqta sekin suzib yursin; matnni yopmasin.", ru: 'За главным блоком (hero) медленно плывут 20 маленьких белых полупрозрачных точек; текст не закрывают.' } },
  { id: 'egilish', name: { uz: '3D kartalar', ru: '3D-карточки' }, sub: { uz: 'sichqoncha ostida egiladi', ru: 'наклоняются под мышкой' },
    p: { uz: "Kartalar sichqoncha ostida 3D egilsin: sichqoncha qayerda bo'lsa, karta o'sha tomonga biroz og'sin; sichqoncha ketganda joyiga qaytsin.", ru: 'Карточки наклоняются в 3D под мышкой: куда мышка — туда немного наклон; когда мышка уходит — возвращаются на место.' } },
];
const A4 = {
  qadamlar: [
    { uz: "«Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi `{…}` o'rniga `index.html` va `style.css` kodingizni qo'ying.", ru: '«Скопировать промпт» → вставьте в Gemini, вместо `{…}` в конце — код `index.html` и `style.css`.' },
    { uz: "Javobdagi kodlarni fayllarga qo'ying; `script.js` bo'lmasa — yarating. `Ctrl+S`.", ru: 'Вставьте код из ответа в файлы; если нет `script.js` — создайте. `Ctrl+S`.' },
    { uz: "Live Server'da sinab ko'ring. Yoqmasa — Gemini'ga aniq yozing; yana birini qo'shmoqchi bo'lsangiz, boshqasini tanlang.", ru: 'Проверьте в Live Server. Не нравится — точно напишите Gemini; хотите ещё — выберите другой.' }
  ]
};
const ScreenWow = ({ screen, onNext, onPrev }) => {
  const [tanlov, setTanlov] = useState(() => promoRead().wow || null);
  const tanla = (id) => { setTanlov(id); promoWrite({ wow: id }); };
  const f = promoRead();
  const fx = f.mavzu && f.uslub && f.rang ? f : promoNamuna();
  const w = WOWS.find(x => x.id === tanlov);
  const matn = w ? tr({ uz: `Promo sahifamga effekt qo'sh. ${w.p.uz}\nJavaScript'ni alohida script.js fayliga yoz va index.html oxirida ula; kerakli CSS'ni style.css ga qo'sh. Bor matn va dizaynimni buzma.\nHarakatni yoqtirmaydiganlar uchun @media (prefers-reduced-motion: reduce) da animatsiya o'chsin.\nO'zgargan fayllarni to'liq qaytar.\nMana kodim: {index.html va style.css kodini shu yerga qo'ying}`, ru: `Добавь на мою промо-страницу эффект. ${w.p.ru}\nJavaScript напиши в отдельном файле script.js и подключи в конце index.html; нужный CSS добавь в style.css. Мои тексты и дизайн не ломай.\nДля тех, кто не любит движение, в @media (prefers-reduced-motion: reduce) анимация отключается.\nВерни изменённые файлы целиком.\nВот мой код: {вставьте сюда код index.html и style.css}` }) : null;
  return (
    <Stage eyebrow={{ uz: 'Amaliyot 4 · wow effekt', ru: 'Практика 4 · вау-эффект' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Sahifangizga AI bilan «wow» effekt qo'shing.", ru: 'Добавьте на страницу «вау»-эффект с AI.' })}</h2></div>
        <Mentor>{tr({ uz: <>Bunday effektni qo'lda yozish uzoq vaqt oladi — AI uni bir necha soniyada yozadi. Sizning ishingiz — uni <b style={{ color: T.ink }}>aniq tasvirlash</b>.</>, ru: <>Писать такой эффект вручную долго — AI напишет его за несколько секунд. Ваша задача — <b style={{ color: T.ink }}>точно его описать</b>.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Effekt', ru: 'Эффект' })}</p>
              <div className="am-uslub">{WOWS.map(x => <button key={x.id} type="button" className={`am-uslub-btn ${tanlov === x.id ? 'on' : ''}`} onClick={() => tanla(x.id)}><b>{tr(x.name)}</b><span>{tr(x.sub)}</span></button>)}</div>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(tanlov ? { uz: "O'ngdagi namunada sinab ko'ring.", ru: 'Попробуйте в образце справа.' } : { uz: "Bittasini tanlang — o'ngdagi namunada ko'rasiz, keyin prompt ochiladi.", ru: 'Выберите один — увидите в образце справа, затем откроется промпт.' })}</p>
            </div>
            {matn && <div className="am-ochil"><PromptBlok matn={matn} /></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Saytingiz · sinab ko'ring", ru: 'Ваш сайт · попробуйте' })}</p>
            <div key={tanlov || 'yoq'}><PromoMaket f={fx} wow={tanlov} /></div>
            {tanlov && <p className="small am-osti">{tr(tanlov === 'konfetti' ? { uz: 'Tugmani bosing.', ru: 'Нажмите кнопку.' } : tanlov === 'egilish' ? { uz: "Sichqonchani kartalar ustida yurgizing.", ru: 'Поводите мышкой над карточками.' } : { uz: 'Bu effektni AI JavaScript bilan yozadi.', ru: 'Этот эффект AI пишет на JavaScript.' })}</p>}
            {matn && <QadamTugma b={A4} cls="am-ochil" />}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — TEST 2 =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={{ uz: 'Topshirish', ru: 'Сдача' }}
    questionText="O'yin promo sahifasi uchun qaysi so'rov eng aniq?"
    question={<h2 className="title h-ask">{tr({ uz: <>O'yin promo sahifasi uchun qaysi so'rov <span className="italic" style={{ color: T.accent }}>eng aniq</span>?</>, ru: <>Какой запрос для промо-страницы игры <span className="italic" style={{ color: T.accent }}>самый точный</span>?</> })}</h2>}
    options={[tr({ uz: '«Menga biror sayt qilib ber, chiroyli bo\'lsin»', ru: '«Сделай мне какой-нибудь сайт, чтобы красиво»' }), tr({ uz: "«Ko'k, zamonaviy o'yin sahifasi: tugma va 3 karta»", ru: '«Синяя современная страница игры: кнопка и 3 карточки»' }), tr({ uz: '«Chiroyli, zamonaviy va yorqin sahifa qilib ber»', ru: '«Сделай красивую, современную и яркую страницу»' }), tr({ uz: "«O'yin haqida sahifa kerak, hammasini o'zing tanla»", ru: '«Нужна страница про игру, всё выбери сам»' })]} correctIdx={1}
    explainCorrect={tr({ uz: "Unda to'rt qism bor: mavzu, uslub, rang va bo'limlar.", ru: 'В нём все четыре части: тема, стиль, цвет и разделы.' })}
    explainWrong={{
      0: tr({ uz: 'Mavzu ham, rang ham aytilmagan.', ru: 'Не названы ни тема, ни цвет.' }),
      2: tr({ uz: "Uslub bor, lekin mavzu va bo'limlar yo'q.", ru: 'Стиль есть, а темы и разделов нет.' }),
      3: tr({ uz: 'Tanlovni AI\'ga berdingiz — natija tasodifiy.', ru: 'Вы отдали выбор AI — результат случайный.' }),
      default: tr({ uz: "4 qismni eslang: qaysi so'rovda hammasi bor?", ru: 'Вспомните 4 части: в каком запросе есть все?' })
    }} />
);

// ===== SCREEN 16 — YAKUN =====
// F-1015-336: kartochkalar ekrani olindi (foydalanuvchi qarori)
const Screen16 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
  const RECAP = [tr({ uz: "AI tezlik beradi — sifatni siz ta'minlaysiz", ru: 'AI даёт скорость — качество обеспечиваете вы' }), tr({ uz: "Yaxshi prompt = 4 qism: mavzu, uslub, rang, bo'limlar", ru: 'Хороший промпт = 4 части: тема, стиль, цвет, разделы' }), tr({ uz: "Iteratsiya — bitta so'rov, bitta o'zgarish", ru: 'Итерация — один запрос, одно изменение' }), tr({ uz: "Copilot taklifini o'qib, keyin qabul qilasiz", ru: 'Подсказку Copilot сначала читаете, потом принимаете' }), tr({ uz: "Murakkab effektni AI yozadi — siz uni aniq tasvirlaysiz", ru: 'Сложный эффект пишет AI — вы точно его описываете' })];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={{ uz: 'Tayyor', ru: 'Готово' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><FinishBtn className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</FinishBtn></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><div className="hero-chips"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: '2-praktika tugadi', ru: 'Практика 2 завершена' })}</span><span className="score-chip fade-up">{correct}/{total} {tr({ uz: "to'g'ri", ru: 'верно' })}</span></div><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi AI bilan <span className="italic" style={{ color: T.accent }}>tez va sifatli</span> sayt qura olasiz</>, ru: <>Теперь вы можете строить с AI сайты <span className="italic" style={{ color: T.accent }}>быстро и качественно</span></> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} disabled={studentWait || csLocked} liveOn={studentLive} onClick={(studentWait || csLocked) ? undefined : openArena} hint={csLocked ? tr({ uz: "CodeStrike sinfda, ustoz bilan o'ynaladi", ru: 'CodeStrike — в классе, с ментором' }) : studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Ждите ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={(isMentorL && arenaSolo) ? { mode: 'self' } : (_live || { mode: 'self' })} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{r}</span></li>))}</ul></div>
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
// ============================================================ LESSON ROOT
// Podium yorliqlari (scored indeks -> qisqa nom)
const Q_LABELS = { 5: { uz: "Eng aniq so'rov", ru: 'Самый точный запрос' } };

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

// Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi). s15 = -1 (yakuniy amaliy).
const INLINE_KEYS = { s7: 1 }; // F-1015-336: s4, s9, s15 olindi

const ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  useAudio([{ id: 's15b', text: "Mana natijalar! Kim g'olib bo'ldi — reyting va podiumni ko'ring.", trigger: 'on_mount', waits_for: null }]);
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
    // FAQAT baholanadigan testlar hisoblanadi — praktikaning «tugatdi» belgisi (idx 500+)
    // reytingga aralashmasin (u faqat MentorPracticeOverlay uchun yoziladi)
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
    <Stage eyebrow={{ uz: 'Natijalar', ru: 'Результаты' }} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head head-c"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верно)</> })}</p>}
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
            {/* Savollar bo'yicha — qaysi mavzu qiyin bo'ldi */}
            <div className="card fade-up d2">
              <div className="card-lbl" style={{ color: T.blue }}>📊 {tr({ uz: "Savollar bo'yicha", ru: 'По вопросам' })}</div>
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
              {live.mode === 'mentor' && <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>{tr({ uz: '⚠️ belgili savollar — sinf qiynalgan mavzular. Qayta tushuntiring.', ru: '⚠️ — вопросы, на которых класс споткнулся. Объясните ещё раз.' })}</p>}
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== 🏅 ACHIEVEMENTS (nishonlar) — AI-praktikadagi real bosqichlar =====
const ACHIEVEMENTS = {
  prompt:  { icon: '🎯', name: 'Prompt Pro',  desc: { uz: "To'rt qismli prompt bilan sahifa qurdingiz", ru: 'Вы построили страницу промптом из четырёх частей' } },
  best:    { icon: '🏆', name: 'Best Brief',  desc: { uz: 'Eng aniq buyruqni tanladingiz', ru: 'Вы выбрали самую точную команду' } },
  iterate: { icon: '🔁', name: 'Iterator',    desc: { uz: "Sahifani aniq so'rab yaxshiladingiz", ru: 'Вы улучшили страницу точными запросами' } },
  builder: { icon: '🚀', name: 'Ship It!',    desc: { uz: "Sahifaga Copilot bilan bo'lim qo'shdingiz", ru: 'Вы добавили раздел с Copilot' } },
};
// Ekran id → nishon (recordAnswer'da faqat SCORED test ekranida, data.correct bo'lsa beriladi).
// 'builder' — PromoBuilder-praktika tugatilganda (runPractice done) beriladi.
// F-1015-336: blok nishonlari «Davom etish»da (bonus; isbot yo'q — ustoz ko'rib turadi); test nishoni — s7
const BLOK_ACH = { a1: 'prompt', a2: 'iterate', a3: 'builder' };
const ACH_TRIGGERS = { s7: 'best' };

// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI — yorqin nurlar, medal portlashi, uchqunlar, zarba to'lqini
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

// ===== ⚡ CODE STRIKE — MUSTAHKAMLASH ARENASI =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi kod/prompt tokenlari (dars-DNK: AI bilan qurish tili)
const QZ_BG_SHAPES = [
  { ch: 'prompt',   l: 6,  t: 18, s: 30, c: 'rgba(203,173,255,0.16)', d: 19, dl: 0 },
  { ch: { uz: 'mavzu', ru: 'тема' },    l: 82, t: 12, s: 26, c: 'rgba(203,173,255,0.13)', d: 23, dl: 1.5 },
  { ch: { uz: 'uslub', ru: 'стиль' },    l: 9,  t: 74, s: 30, c: 'rgba(255,110,70,0.15)',  d: 27, dl: 0.8 },
  { ch: { uz: 'rang', ru: 'цвет' },     l: 76, t: 70, s: 26, c: 'rgba(203,173,255,0.11)', d: 21, dl: 2.2 },
  { ch: { uz: "bo'limlar", ru: 'разделы' },  l: 46, t: 86, s: 28, c: 'rgba(203,173,255,0.14)', d: 25, dl: 1.1 },
  { ch: 'deploy',   l: 66, t: 24, s: 22, c: 'rgba(80,200,255,0.14)',  d: 17, dl: 0.4 },
  { ch: { uz: 'iteratsiya', ru: 'итерация' }, l: 22, t: 36, s: 22, c: 'rgba(203,173,255,0.12)', d: 20, dl: 1.9 },
  { ch: 'Copilot',  l: 92, t: 46, s: 24, c: 'rgba(120,235,175,0.13)', d: 24, dl: 1.3 },
  { ch: { uz: 'sayt', ru: 'сайт' },     l: 2,  t: 46, s: 24, c: 'rgba(203,173,255,0.10)', d: 26, dl: 2.6 },
];
const QUIZ_BANK = [
  { q: { uz: "AI bilan ishlashda asosiy qoida?", ru: "Главное правило работы с AI?" }, opts: [{ uz: "AI hammasini o'zi hal qiladi", ru: "AI сам всё решает" }, { uz: "Kod yozish umuman shart emas", ru: "Писать код вообще не нужно" }, { uz: "AI tezlik, sifat esa sizdan", ru: "AI даёт скорость, качество — вы" }, { uz: "Faqat ingliz tili kerak", ru: "Нужен только английский" }], correct: 2 },
  { q: { uz: "«Prompt» nima?", ru: "Что такое «промпт»?" }, opts: [{ uz: "Saytning asosiy rangi", ru: "Основной цвет сайта" }, { uz: "Internet brauzeri", ru: "Интернет-браузер" }, { uz: "Faylning kengaytmasi", ru: "Расширение файла" }, { uz: "AI'ga beriladigan buyruq", ru: "Команда для AI" }], correct: 3 },
  { q: { uz: 'Yaxshi promptning 4 qismi qaysi?', ru: '4 части хорошего промпта?' }, opts: [{ uz: "Mavzu, uslub, rang, bo'limlar", ru: 'Тема, стиль, цвет, разделы' }, { uz: 'Ism, yosh, shahar, maktab', ru: 'Имя, возраст, город, школа' }, 'HTML, CSS, JS, PHP', { uz: 'Sarlavha, rasm, video, audio', ru: 'Заголовок, картинка, видео, аудио' }], correct: 0 },
  { q: { uz: '«Menga sayt yasab ber» — bu qanaqa prompt?', ru: '«Сделай мне сайт» — какой это промпт?' }, opts: [{ uz: 'Aniq va sifatli', ru: 'Точный и качественный' }, { uz: "Noaniq — bo'sh natija beradi", ru: 'Неточный — даст пустой результат' }, { uz: 'Eng yaxshi variant', ru: 'Лучший вариант' }, { uz: "To'liq, to'rt qismli prompt", ru: 'Полный, из четырёх частей' }], correct: 1 },
  { q: { uz: 'Yaxshi prompt yomonidan nimasi bilan farq qiladi?', ru: 'Чем хороший промпт отличается от плохого?' }, opts: [{ uz: "Uzunroq bo'ladi", ru: 'Он длиннее' }, { uz: 'Faqat inglizcha', ru: 'Только по-английски' }, { uz: 'Aniq tafsilot beradi', ru: 'Даёт точные детали' }, { uz: "Hech qanday farqi yo'q", ru: 'Никакой разницы' }], correct: 2 },
  { q: { uz: "AI natijasi yoqmadi. To'g'ri yo'l qaysi?", ru: "Результат AI не понравился. Как правильно?" }, opts: [{ uz: "Tashlab ketish", ru: "Бросить" }, { uz: "Xafa bo'lib to'xtash", ru: "Расстроиться и остановиться" }, { uz: "Qo'lda qayta yozish", ru: "Переписать вручную" }, { uz: "Aniqroq qayta so'rash", ru: "Попросить снова, точнее" }], correct: 3 },
  { q: { uz: "«Iteratsiya» nima?", ru: "Что такое «итерация»?" }, opts: [{ uz: "Saytni butunlay o'chirish", ru: "Полностью удалить сайт" }, { uz: "Qayta so'rab yaxshilash", ru: "Улучшать, прося снова" }, { uz: "Rasmni kesib olish", ru: "Обрезать картинку" }, { uz: "Domen sotib olish", ru: "Купить домен" }], correct: 1 },
  { q: { uz: "Promptdagi «uslub» qismi nimani belgilaydi?", ru: "Что задаёт часть «стиль» в промпте?" }, opts: [{ uz: "Sahifa mavzusini", ru: "Тему страницы" }, { uz: "Asosiy rangni", ru: "Основной цвет" }, { uz: "Ko'rinish: zamonaviy/sodda", ru: "Вид: современный/простой" }, { uz: "Bo'limlar ro'yxatini", ru: "Список разделов" }], correct: 2 },
  { q: { uz: "AI sayt yasadi. Eng muhim keyingi qadam?", ru: "AI сделал сайт. Самый важный следующий шаг?" }, opts: [{ uz: "Darhol nashr qilish", ru: "Сразу опубликовать" }, { uz: "Faylni o'chirish", ru: "Удалить файл" }, { uz: "Hech nima qilmaslik", ru: "Ничего не делать" }, { uz: "Natijani tekshirish", ru: "Проверить результат" }], correct: 3 },
  { q: { uz: "Promo sahifada odatda nima bo'ladi?", ru: "Что обычно есть на промо-странице?" }, opts: [{ uz: "Sarlavha, tugma, kartalar", ru: "Заголовок, кнопка, карточки" }, { uz: "Faqat bo'sh oq ekran", ru: "Только пустой белый экран" }, { uz: "Faqat matn fayli", ru: "Только текстовый файл" }, { uz: "Excel jadvali", ru: "Таблица Excel" }], correct: 0 },
  { q: { uz: "«Ko'k, zamonaviy o'yin promo, 3 karta» — qanaqa prompt?", ru: "«Синий, современный промо игры, 3 карточки» — какой промпт?" }, opts: [{ uz: "Noaniq", ru: "Неточный" }, { uz: "Aniq, 4 qismli", ru: "Точный, из 4 частей" }, { uz: "Juda qisqa, foydasiz", ru: "Слишком короткий, бесполезный" }, { uz: "Faqat rang haqida", ru: "Только про цвет" }], correct: 1 },
  { q: { uz: "Nega AI'ga aniq buyruq berish muhim?", ru: "Почему важно давать AI точную команду?" }, opts: [{ uz: "AI fikringizni o'qiy olmaydi", ru: "AI не умеет читать мысли" }, { uz: "Aniqlik ta'sir qilmaydi", ru: "Точность ни на что не влияет" }, { uz: "AI faqat rasm chiza oladi", ru: "AI умеет только рисовать" }, { uz: "Qisqa buyruq doim yaxshiroq", ru: "Короткая команда всегда лучше" }], correct: 0 },
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
    const TOK = ['prompt', 'AI', '.uz', '<h1>', tr({ uz: 'sayt', ru: 'сайт' }), 'deploy', 'CTA', tr({ uz: 'rang', ru: 'цвет' })];
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
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать в арене.\nПотом можно вернуться в это же место через «⚔️ Продолжить».\n\nВсё равно закрыть?' }))) return;
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
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают 🔥 бонус!' })}</p>
          {solo && isStudent && <p className="qz-sub" style={{ color: '#FFC94D' }}>📖 {tr({ uz: "Mashq rejimi — o'z tezligingizda ishlaysiz, natija faqat sizga ko'rinadi.", ru: 'Режим тренировки — работаете в своём темпе, результат виден только вам.' })}</p>}
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>▶ {tr({ uz: 'Testni boshlash', ru: 'Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">⏳ {tr({ uz: 'Mentor testni boshlashini kuting…', ru: 'Ждите, пока ментор начнёт тест…' })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>▶ {tr({ uz: 'Boshlash', ru: 'Старт' })}</button>}
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Быстрее! ⏱' })}</span>}
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
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl('done', qi) : autoNext.fireNow()}>{lastQ ? tr({ uz: "🏁 G'oliblarni e'lon qilish", ru: '🏁 Объявить победителей' }) : tr({ uz: 'Keyingi savol →', ru: 'Следующий вопрос →' })}</button>}
          {isMentor && !lastQ && <button className="qz-btn ghost qz-auto" onClick={autoNext.auto ? autoNext.pause : autoNext.resume} title={tr({ uz: "Avto o'tishni to'xtatish — javobni tushuntirish uchun (arena oxirigacha)", ru: 'Остановить авто-переход — чтобы объяснить ответ (до конца арены)' })}>{autoNext.auto ? `${tr({ uz: "To'xtatish", ru: 'Пауза' })}${autoNext.sec ? ` · ${autoNext.sec}` : ''}` : tr({ uz: '▶ Avto', ru: '▶ Авто' })}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: "🏁 Natijani ko'rish", ru: '🏁 Посмотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Следующий →' })}</button>}
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
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? tr({ uz: ` · eng uzun streak 🔥x${soloScore.maxStreak}`, ru: ` · лучший стрик 🔥x${soloScore.maxStreak}` }) : ''}</p>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>↻ {tr({ uz: 'Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: 'Пройти тест ещё раз — тренировка (в таблицу не пишется)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

// PromoBuilder-praktika ekrani (o'z promo saytini qurib nashr qilish) — signal + mentor paneli shu yerdan.
const PRACTICE_AFTER = {}; // F-1015-336: PromoBuilder praktikasi olindi — ish o'quvchining VS Code'ida

export default function PracticeLesson2({ lang: langProp, onFinished, liveToken }) {
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
  const [mentorPractice, setMentorPractice] = useState(null); // jonli mentor praktika paneli
  const startTimeRef = useRef(saved?.startedAt || Date.now());
  // 🏅 Nishonlar (StrictMode-safe: earnedRef + Set)
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

  // ETALON — 1920px (InternetLesson): keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // 🃏 Flashcard jonli darsda FAQAT MENTORGA ko'rinadi (proyektorda jamoaviy takrorlash); jonli o'quvchidan yashirin.
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => {
    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-336: blok «Davom etish»da nishon
    if (blokAch && live.mode !== 'mentor') earn(blokAch);
    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  };
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });
  // PromoBuilder-praktika tugatildi (o'quvchi o'z saytini nashr qildi): mentorga signal + 🏅 nishon.
  // (plain function — live keyin e'lon qilinadi; faqat chaqirilganda o'qiladi, TDZ yo'q)
  const practiceDone = (fromScreen) => {
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_DONE_BASE + fromScreen, `practice-${fromScreen}`, 0, true, 0);
    earn('builder');
  };
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
    if (_m && _m.scored && _m.scope === 'final' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);
    // 🏅 nishon — FAQAT scored test ekranida, to'g'ri javob bo'lsa (tekin nishon yo'q)
    if (_m && _m.scored && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]);
  };
  const reset = () => { if (!firstPassRef.current) { firstPassRef.current = { answers, durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000) }; setFpPractice(true); } progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); setMentorPractice(null); startTimeRef.current = Date.now(); };
  // F-0730-01: har o'zgarishda progress saqlanadi (screen + javoblar + nishonlar + boshlangan vaqt)
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, maxReached, answers, earned: [...earnedRef.current], missed: [...missedRef.current], firstPass: firstPassRef.current, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned, missed, fpPractice]);

  // Javob kaliti: inline testlar + jang savollari (QUIZ_BANK'dan) — mentor ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken, arena: { total: QUIZ_BANK.length, quizMs: QUIZ_MS, baseIdx: QUIZ_BASE_IDX } }); // liveToken — LMS'dan (avval null, keyin keladi)
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS }); // server-progress: davom / ko'rish / toza boshlash
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  // F-1012-03: eng uzoq yetilgan ekran (qayta boshlashda 0) — undan oldingi ekranlarda «Davom etish» qulflanmaydi
  useEffect(() => { setMaxReached(m => (screen === 0 && !Object.keys(answers || {}).length) ? 0 : Math.max(m, screen)); }, [screen, answers]);
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  // MENTOR jonli: praktika ekraniga yetganda «kim tugatdi» panelini ochadi (overlay)
  useEffect(() => {
    const entry = PRACTICE_AFTER[screen];
    if (entry && live.mode === 'mentor') setMentorPractice({ ...entry, fromScreen: screen });
    else setMentorPractice(null);
  }, [screen, live.mode]); // eslint-disable-line

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

  const screens = [Screen0, Screen1, ScreenPrompt, ScreenIteratsiya, ScreenBolim, Screen7, ScreenWow, ScreenPodium, Screen16];
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
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
        @keyframes el-pop { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        .el-in { animation: el-pop 0.3s ease-out; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.accent}; color: #fff; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
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

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 8px; padding: 9px 15px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 0 0 2px ${T.accent}; } /* F-0926-06 (159/10): tanlangan chip yumshoq fon + halqa — 2-Modulning boshqa darslari bilan bir xil */
        /* F-0926-06: bajarilgan qo'shimcha buyruq (s8) — yumshoq yashil, belgi xiralashmaydi */
        .chip.chip-used, .chip.chip-used:disabled { background: ${T.successSoft}; color: ${T.success}; opacity: 1; box-shadow: none; cursor: default; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); display: flex; align-items: center; justify-content: center; }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }
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

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
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
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(255,79,40,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(255,79,40,0.55), 0 0 3px rgba(255,79,40,0.4); }

        /* === FRAME === */
        .frame { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,3vw,24px); border: none; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.accentSoft}; border-radius: 12px; padding: 12px 15px; }
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

        /* === USTABOT (robot pufakchasi) — F-0926-06: klass nomi abot-* ga almashdi (til-lint) === */
        .abot-bubble { display: flex; align-items: flex-start; gap: 9px; margin-top: 9px; padding: 10px 13px 10px 11px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 4px 14px 14px 14px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.2); transform-origin: 14px top; animation: abot-in 0.36s cubic-bezier(.34,1.42,.5,1); }
        /* Robot pufakcha — burchakdan (yuz tomonidan) yumshoq pop, engil overshoot; qo'pol emas */
        @keyframes abot-in { 0% { opacity: 0; transform: translateY(7px) scale(0.9); } 62% { opacity: 1; transform: translateY(-1px) scale(1.015); } 100% { opacity: 1; transform: none; } }
        .abot-bubble.abot-warn { background: ${T.accentSoft}; border-color: ${T.accent}; }
        .abot-bubble.abot-sm { margin-top: 6px; padding: 7px 11px 7px 9px; }
        .abot-face { font-size: 20px; line-height: 1.1; flex-shrink: 0; filter: drop-shadow(0 1px 2px rgba(${T.shadowBase},0.25)); animation: abot-face-pop 0.44s cubic-bezier(.34,1.6,.4,1) 0.04s both; }
        /* Robot yuzi bir zumda "gapiradi" — juda kichik pop */
        @keyframes abot-face-pop { 0% { transform: scale(0.5) rotate(-14deg); } 60% { transform: scale(1.14) rotate(5deg); } 100% { transform: scale(1) rotate(0); } }
        .abot-sm .abot-face { font-size: 16px; }
        .abot-say { font-size: 13px; font-weight: 600; color: ${T.ink}; line-height: 1.35; }
        .abot-sm .abot-say { font-size: 12px; font-weight: 500; color: ${T.ink2}; }

        /* === LANDING DRAFT (so'zma-so'z literal render) === */
        /* Chip tanlanganda o'sha qism darhol emas — SILLIQ morflashadi: qiyshiqlik to'g'rilanadi,
           rang/romka/burchak yumshoq oqib o'zgaradi (sakrash yo'q). «Dubl» tuzatishi ham shu orqali oqadi. */
        .lp-live > div, .lp-live h3, .lp-live button, .lp-live span, .lp-live p { transition: background 0.5s ease, background-color 0.5s ease, border-radius 0.45s cubic-bezier(.4,0,.2,1), border-color 0.45s ease, transform 0.48s cubic-bezier(.34,1.15,.4,1), color 0.4s ease; }
        .lp-draft-badge { position: absolute; top: 7px; right: 7px; background: #12121a; color: #c6ff00; font-size: 10px; font-weight: 800; padding: 3px 7px; border-radius: 6px; transform: rotate(4deg); box-shadow: 0 3px 8px -3px rgba(0,0,0,0.4); }
        .lp-draft-empty { display: flex; flex-direction: column; align-items: center; gap: 4px; border: 2.5px dashed ${T.ink3}; border-radius: 8px; padding: 18px 12px; }
        .lp-draft-q { font-size: 30px; font-weight: 800; color: ${T.ink3}; line-height: 1; }
        .lp-draft-emptxt { font-size: 12px; color: ${T.ink3}; font-style: italic; }
        .lp-draft-notes { display: flex; flex-direction: column; gap: 4px; margin-top: 2px; }

        /* === QABUL AKTI (acceptance report) === */
        .accept-akt { background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 13px; padding: 12px 14px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); }
        .accept-akt.akt-happy { border-color: ${T.success}; background: ${T.successSoft}; }
        .akt-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .akt-title { font-family: 'Source Serif 4',serif; font-weight: 600; font-size: 14.5px; color: ${T.ink}; }
        .akt-client { font-size: 22px; line-height: 1; transition: transform 0.2s; }
        /* Mijoz 😕→🤩 bo'lganda kichik xursand pop (aynan qabul akti "happy" holatida) */
        .akt-happy .akt-client { transform: scale(1.15); animation: client-pop 0.5s cubic-bezier(.34,1.55,.4,1); }
        @keyframes client-pop { 0% { transform: scale(0.55) rotate(-14deg); } 55% { transform: scale(1.34) rotate(7deg); } 100% { transform: scale(1.15) rotate(0); } }
        /* F-0803-26: 4 band ikki ustunda — akt balandligi yarmiga tushadi va «Dubl 2» tugmasi
           ko'rish zonasida qoladi (11-ekran, F-0803-19 sinfi) */
        .akt-list { list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 5px 14px; }
        @media (max-width: 560px) { .akt-list { grid-template-columns: 1fr; } }
        .akt-list li { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; }
        .akt-mark { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; font-size: 11px; font-weight: 800; flex-shrink: 0; }
        .akt-ok { color: ${T.ink}; } .akt-ok .akt-mark { background: ${T.successSoft}; color: ${T.success}; }
        .akt-bad { color: ${T.ink2}; } .akt-bad .akt-mark { background: ${T.accentSoft}; color: ${T.accent}; }
        .akt-redo { margin-top: 11px; align-self: flex-start; }

        /* Harakat kamaytirilsa — yangi USTABOT/draft animatsiyalari tinch (faqat oniy fade, morf/pop yo'q) */
        @media (prefers-reduced-motion: reduce) {
          .abot-bubble { animation: acu-fade 0.25s ease both; transform: none; }
          .abot-face { animation: none; }
          .lp-live > div, .lp-live h3, .lp-live button, .lp-live span, .lp-live p { transition: none; }
          .akt-happy .akt-client { animation: none; transform: scale(1.15); }
        }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .head-c { text-align: center; align-items: center; } /* F-1003-04: natija ekrani — bitta o'q */
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        @media (min-width: 761px) { .split:has(> .col > .flow-label:first-child) > .col:not(:has(> .flow-label:first-child))::before { content: "."; visibility: hidden; font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; } } /* F-1015-371: ikki ustun bloklari bir chiziqdan boshlanadi */
        .num-badge { width: 30px; height: 30px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 14px; flex-shrink: 0; }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .sk-tagbig { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
        .sk-wordbadge { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; padding: 4px 10px; border-radius: 6px; }

        /* === CODEBOX === */
        .codebox { background: ${CODE.bg}; border-radius: 12px; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(12.5px,1.6vw,14.5px); color: ${CODE.text}; line-height: 1.75; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.18); overflow-x: hidden; }
        .codebox > div { white-space: pre-wrap; word-break: break-word; }

        /* === TAGPILL / AI CARD === */
        .tagpill { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.18); transition: opacity 0.2s; }
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.blue}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; }

        /* === BROWSER / SAYT PREVIEW === */
        .browser { background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px -10px rgba(${T.shadowBase},0.22); border: 1px solid rgba(167,166,162,0.25); }
        .browser-bar { display: flex; align-items: center; gap: 6px; padding: 9px 12px; background: #ECEAE4; }
        .browser-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .browser-url { margin-left: 8px; flex: 1; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink3}; background: ${T.paper}; border-radius: 6px; padding: 4px 10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .browser-body { padding: clamp(15px,2.6vw,22px); min-height: 150px; background: ${T.paper}; color: ${T.ink}; transition: background .35s ease, color .35s ease; }
        .browser-dark .browser-bar { background: #11151C; }
        .browser-dark .browser-body { background: #161E2B; color: #E8E5DD; }
        .browser-dark .browser-url { background: #0E141D; color: #7A8699; }

        /* === MINI-SAYT === */
        .site-card { display: flex; flex-direction: column; gap: 13px; align-items: flex-start; }
        .site-ava { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, ${T.accent}, #FF9B7D); display: flex; align-items: center; justify-content: center; font-family: 'Source Serif 4', serif; font-weight: 700; font-size: 24px; color: #fff; flex-shrink: 0; text-transform: uppercase; }
        .site-name { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(17px,2.4vw,21px); }
        .site-like { display: inline-flex; align-items: center; gap: 8px; background: ${T.accentSoft}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 16px; font-family: 'Manrope'; font-weight: 700; font-size: 15px; cursor: pointer; transition: transform .15s; }
        .site-like:active { transform: scale(.94); }
        .shake { animation: shake .36s ease; }
        @keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }

        /* === FLOW (Hodisa->Reaksiya->O'zgarish) === */
        .flow { display: flex; align-items: center; justify-content: center; gap: 5px; flex-wrap: wrap; }
        .flow-node { display: flex; align-items: center; gap: 5px; background: ${T.paper}; border-radius: 9px; padding: 6px 9px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: ${T.ink2}; transition: all .25s; opacity: .45; white-space: nowrap; }
        .flow-node.on { opacity: 1; background: ${T.accent}; color: #fff; transform: translateY(-2px); box-shadow: 0 8px 18px -6px rgba(255,79,40,0.4); }
        .flow-node .flow-n { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; background: rgba(167,166,162,0.3); font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 9.5px; flex-shrink: 0; }
        .flow-node.on .flow-n { background: rgba(255,255,255,0.3); }
        .flow-arrow { color: ${T.ink3}; font-size: 13px; }

        /* === PROMPT-QURUVCHI === */
        .chiprow { display: flex; flex-wrap: wrap; gap: 8px; }
        /* F-0803-26: guruh yorlig'i tugmalar bilan BIR qatorda — 4 guruh ekranga sig'adi */
        .pb-group { display: flex; align-items: center; gap: 10px; }
        .pb-glabel { flex: 0 0 auto; min-width: 58px; font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink2}; }
        /* quruvchi tugmalari biroz ixcham — 4 rang bitta qatorga sig'sin */
        .pb-group .chip { padding: 8px 12px; font-size: clamp(12.5px,1.4vw,14px); }
        @media (max-width: 560px) { .pb-group { flex-direction: column; align-items: flex-start; gap: 5px; } }
        .promptbox { background: ${T.paper}; border-radius: 12px; padding: 13px 15px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-size: clamp(13px,1.6vw,14.5px); line-height: 2; color: ${T.ink}; }
        /* Yakuniy ekran: buyruq uzun — quti ichida skroll, tagida nusxalash tugmasi (F-0922-53) */
        .promptbox.pb-scroll { max-height: clamp(76px,12vh,150px); overflow-y: auto; overscroll-behavior: contain; }
        .promptbox.pb-scroll::-webkit-scrollbar { width: 7px; }
        .promptbox.pb-scroll::-webkit-scrollbar-thumb { background: rgba(${T.shadowBase},0.22); border-radius: 4px; }
        .pb-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        /* 6 bandli yakuniy ekran past noutbukda ham to'liq ko'rinsin (F-0803-19 bug-sinfi) */
        @media (max-height: 780px) {
          .pb-six { gap: 8px !important; }
          .pb-six .col { gap: 7px; }
          .pb-six .pb-group { gap: 8px; }
          .pb-six .pb-group .chip { padding: 6px 11px; }
          .pb-six .promptbox.pb-scroll { max-height: clamp(84px,11vh,124px); }   /* ikki to'liq qator */
          .pb-six .promptbox { line-height: 1.85; padding: 10px 13px; }
        }
        .pb-copy { flex: none; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13px); cursor: pointer; background: transparent; color: ${T.accent}; border: 1.5px solid ${T.accent}55; border-radius: 9px; padding: 6px 13px; transition: all 0.2s; }
        .pb-copy:hover { background: ${T.accent}; color: #fff; border-color: ${T.accent}; }
        .pb-slot { display: inline-flex; align-items: center; background: ${T.accentSoft}; color: ${T.accent}; font-weight: 700; border-radius: 6px; padding: 2px 8px; margin: 0 1px; animation: slot-pop 0.34s cubic-bezier(.34,1.45,.5,1); }
        @keyframes slot-pop { 0% { transform: scale(0.5); opacity: 0; } 55% { transform: scale(1.14); } 100% { transform: scale(1); opacity: 1; } }
        .pb-ph { display: inline-flex; align-items: center; border: 1.5px dashed ${T.ink3}; color: ${T.ink3}; border-radius: 6px; padding: 1px 8px; margin: 0 1px; font-style: italic; }

        /* === SPEED QUOTE (Screen1 qora karta — yangilangan) === */
        @keyframes quote-in { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes sheen { 0% { background-position: -60% 0; } 100% { background-position: 160% 0; } }
        @keyframes sq-underline { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .speed-quote { position: relative; overflow: hidden; border-radius: 16px; padding: clamp(20px,3.2vw,30px); text-align: center; background: radial-gradient(130% 150% at 50% -10%, #262A33 0%, #15171D 58%, #0B0C10 100%); box-shadow: 0 18px 44px -14px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.07); animation: quote-in 0.5s cubic-bezier(.34,1.2,.4,1); }
        .speed-quote::after { content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.08) 50%, transparent 62%); background-size: 220% 100%; animation: sheen 3.4s ease-in-out 0.7s infinite; pointer-events: none; }
        .speed-quote .sq-eyebrow { font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin: 0 0 11px; position: relative; }
        .speed-quote .sq-text { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(18px,3vw,26px); line-height: 1.3; margin: 0; color: #F4F1EA; position: relative; }
        /* F-0803-26: reja-ekranida qoida yolg'iz qoldi — ustunni to'ldirib, markazda tursin */
        .speed-quote.sq-solo { display: flex; flex-direction: column; justify-content: center; min-height: 100%; padding: clamp(26px,4vw,44px); }
        .speed-quote.sq-solo .sq-text { font-size: clamp(21px,3.6vw,32px); }
        .sq-fast { color: ${T.accent}; font-style: italic; position: relative; text-shadow: 0 0 18px rgba(255,79,40,0.45); }
        .sq-fast::after { content: ''; position: absolute; left: 0; right: 0; bottom: -3px; height: 2px; background: ${T.accent}; border-radius: 2px; transform: scaleX(0); transform-origin: left; animation: sq-underline 0.5s cubic-bezier(.4,0,.2,1) forwards 0.55s; box-shadow: 0 0 10px ${T.accent}; }
        .sq-quality { color: #FFC56B; font-style: italic; text-shadow: 0 0 18px rgba(255,197,107,0.4); }

        /* === NATIJA REVEAL + "QURYAPTI" SKELETON === */
        @keyframes result-reveal { from { opacity: 0; transform: translateY(9px) scale(0.97); } to { opacity: 1; transform: none; } }
        .result-reveal { animation: result-reveal 0.42s cubic-bezier(.34,1.18,.5,1); }
        @keyframes bs-shimmer { 0% { background-position: 180% 0; } 100% { background-position: -180% 0; } }
        .build-skel { display: flex; flex-direction: column; gap: 11px; padding: 10px 2px; }
        .build-skel .bs-bar { height: 13px; border-radius: 7px; background: linear-gradient(90deg, #ECEAE4 25%, #FAF8F3 50%, #ECEAE4 75%); background-size: 200% 100%; animation: bs-shimmer 1.15s ease-in-out infinite; }
        .build-skel .bs-lg { height: 34px; border-radius: 10px; }
        .build-note { text-align: center; font-size: 11.5px; color: ${T.ink3}; margin: 6px 0 0; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; letter-spacing: 0.04em; }

        /* === EVENT KARTALAR === */
        .evt-card { display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer; border: none; border-radius: 12px; padding: 13px 15px; background: ${T.paper}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); transition: all .18s; width: 100%; }
        .evt-card:hover { transform: translateY(-1px); }
        .evt-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -6px rgba(255,79,40,0.22); }
        .evt-card .evt-name { font-family: 'Manrope'; font-weight: 600; font-size: 14px; color: ${T.ink}; }
        .evt-card .evt-hint { font-size: 12px; color: ${T.ink2}; }

        /* === IWATCH === */
        .iwatch { display: flex; align-items: baseline; gap: 9px; background: ${T.paper}; border-radius: 12px; padding: 12px 18px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .iwatch-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink3}; }
        .iwatch-eq { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 18px; color: ${T.ink2}; }
        .iwatch-num { font-family: 'Fraunces', serif; font-size: clamp(34px,7vw,52px); color: ${T.accent}; line-height: 1; }

        /* === YAKUN === */
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
        /* F-0803-08 — UYGA VAZIFA KAPSULASI (PmLesson2 etaloni): yakun sahifasida
           «Endi siz bilasiz» dan KEYIN turadi, bosilganda topshiriq kartasi ochiladi. */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; color: rgba(255,255,255,0.16); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
        @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.03); } 100% { filter: brightness(1); } }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent); transform: rotate(8deg); animation: hw-shine 4.6s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(120,60,220,.6), 0 0 40px rgba(124,58,237,.72), 0 0 96px rgba(124,58,237,.4), inset 0 0 60px rgba(124,58,237,.44); } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none !important; } }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; } .hw-note.hw-note { margin: 11px 0 0; font-size: 12px; color: ${T.accent}; font-weight: 600; }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* === MOBIL POLISH (zichroq, toza, gorizontal toshmasin) === */
        @media (max-width: 640px) {
          .stage-content { padding-bottom: clamp(14px,3vw,22px); }
          .screen { gap: 13px; }
          .browser-body { min-height: 84px; padding: 14px 15px; }
          .codebox { font-size: 12.5px; line-height: 1.6; padding: 12px 13px; }
          .mentor-msg { padding: 11px 14px; }
          .site-ava { width: 46px; height: 46px; font-size: 21px; }
          .frame { padding: 15px 16px; }
          .split { gap: 14px; }
          .flow { gap: 4px; }
          .flow-node { padding: 6px 8px; }
        }

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
        .mstats-waitrow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .mstats-wait-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; }
        .mstats-wait-chip { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.07); border-radius: 99px; padding: 3px 10px; }
        .mstats-wait-chip.more { color: ${T.ink3}; }
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); }
        .mstats-verdict.good { background: ${T.successSoft}; }
        .mstats-verdict.few { background: rgba(167,166,162,0.12); }
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

        /* backtick chip (fmtCode) — test/arena savol matnidagi kod bo'lagi */
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        /* === ✍️ MENTOR PRAKTIKA OVERLAY === */
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
        .fc-tag.mono-all { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }
        .fc-tag.prose { font-family: 'Manrope', sans-serif; letter-spacing: -0.005em; }
        .fc-tag .fc-kw { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; }
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

        /* ===== ⚡ ARENA — issiq CoddyCamp muhiti ===== */
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
        .pod-row.me { background: ${T.successSoft}; outline: 1.5px solid ${T.success}66; }
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
        .frame-wait { background: ${T.blueSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }
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
        .am-tayyor-h { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,2vw,19px); color: ${T.ink}; }
        .lesson-root .am-tayyor-l { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .am-tayyor-l li { display: flex; gap: 12px; align-items: flex-start; font-size: clamp(14px,1.6vw,15.5px); color: ${T.ink}; line-height: 1.5; }
        .am-tayyor-n { flex: none; width: 28px; height: 28px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }
        .am-tayyor-s { margin: 0; font-size: 13px; color: ${T.ink2}; }
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
        /* ===== F-1015-330 · qadamlar tugmasi (a2, a3) ===== */
        .am-qt { padding: 0; overflow: hidden; }
        .am-qt-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; background: none; border: none; cursor: pointer; padding: 14px 18px; font: 700 14px 'Manrope', sans-serif; color: ${T.ink}; text-align: left; }
        .am-qt-btn:hover { background: ${T.accentSoft}; }
        .am-qt-btn:focus-visible { outline: 2px solid ${T.accent}; outline-offset: -2px; }
        .am-qt-ic { color: ${T.accent}; font-size: 16px; transition: transform 0.2s; }
        .am-qt.on .am-qt-ic { transform: rotate(180deg); }
        .am-qt > .am-qadam { padding: 0 18px 16px; }
        .am-tt { padding: 0; gap: 0; }
        .am-tt-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: none; border: none; cursor: pointer; text-align: left; padding: clamp(14px,2vw,18px); border-radius: 14px; font: inherit; }
        .am-tt-btn:hover { background: ${T.accentSoft}; }
        .am-tt-btn:focus-visible { outline: 2px solid ${T.accent}; outline-offset: -2px; }
        .am-tt.on .am-qt-ic { transform: rotate(180deg); }
        .am-tt-ich { display: flex; flex-direction: column; gap: 10px; padding: 0 clamp(14px,2vw,18px) clamp(14px,2vw,18px); }
        .am-tt-nafas { animation: am-nafas 2.4s ease-in-out infinite; }
        .am-tayyor.am-tt { box-shadow: none; } /* F-1015-362: yordamchi blok — yumshoq ramka, soyasiz */
        @keyframes am-nafas { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,79,40,0.18); } 50% { box-shadow: 0 0 0 6px rgba(255,79,40,0); } }
        .am-tt-oyna { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(560px,92vw); max-height: calc(88vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(18px,3vw,28px); display: flex; flex-direction: column; gap: 14px; box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        .am-tt-oyna-h { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .am-tt-yop { flex: none; width: 34px; height: 34px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .am-tt-yop:hover { color: ${T.accent}; border-color: ${T.accent}; }
        .am-tt-yop:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .am-yig { width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 12px; border: none; cursor: pointer; text-align: left; font: inherit; padding: 14px 18px; }
        .am-yig-ok { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .am-yig-k { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 13.5px; color: ${T.ink2}; }
        .am-yig:hover .am-yig-k { color: ${T.accent}; }
        .am-yig:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .sk-kotar { animation: sk-kotar 0.5s cubic-bezier(.2,.7,.3,1) both; } /* F-1015-363: prompt yig'ilgach kod oynasi yuqoriga ko'tariladi */
        @keyframes sk-kotar { from { opacity: 0.4; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .sk-bar-nur { animation: sk-bar-nur 1.1s ease-out; }
        @keyframes sk-bar-nur { from { box-shadow: inset 0 -2px 0 rgba(250,204,21,0.9); background: rgba(250,204,21,0.22); } to { box-shadow: inset 0 -2px 0 rgba(250,204,21,0); } }
        @media (prefers-reduced-motion: reduce) { .sk-kotar, .sk-bar-nur, .am-tt-oyna { animation: none !important; } }
        .sk-nur { border-radius: 6px; animation: sk-nur 1.2s ease-out; }
        @keyframes sk-nur { 0%, 35% { background: rgba(250,204,21,0.38); } 100% { background: transparent; } }
        @media (prefers-reduced-motion: reduce) { .am-tt-nafas { animation: none; } }
        .screen > .head + .split { margin-top: clamp(6px,1vw,10px); } /* F-1015-333: mentorsiz ekranda sarlavha bloklarga yopishmasin */
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .bb-dots { display: flex; gap: 5px; } .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        /* ===== F-1015-336 · promo maketi (o'quvchi yozganidan) va forma chiplari ===== */
        .am-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .am-chip { display: inline-flex; align-items: center; gap: 6px; font: 600 12.5px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 999px; padding: 6px 12px; cursor: pointer; }
        .am-chip:hover { border-color: ${T.ink2}; }
        .am-chip.on { border-color: ${T.ink}; background: ${T.paper}; box-shadow: 0 0 0 1.5px ${T.ink}; }
        .am-chip:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .am-chip-rang { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
        .am-qism-ro { display: flex; flex-wrap: wrap; gap: 8px; }
        .am-qism { display: inline-flex; align-items: center; gap: 8px; background: ${T.paper}; border-radius: 999px; padding: 7px 14px 7px 7px; font: 700 14px 'Manrope', sans-serif; color: ${T.ink}; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .am-qism b { width: 22px; height: 22px; border-radius: 50%; background: ${T.accent}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; }
        .pm-sayt { border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.3); font-family: 'Manrope', Arial, sans-serif; }
        .pm-bar { display: flex; align-items: center; gap: 10px; background: #ECE9E1; padding: 7px 12px; }
        .pm-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .pm-body { display: flex; flex-direction: column; gap: 10px; padding: 12px; background: #f8fafc; }
        .pm-hero { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 22px 18px; color: #fff; background: linear-gradient(135deg, var(--pm), color-mix(in srgb, var(--pm), #000 25%)); border-radius: 12px; transition: background 0.3s, border-radius 0.3s; }
        .pm-quvnoq .pm-hero { border-radius: 22px; background: radial-gradient(circle at 85% 20%, color-mix(in srgb, var(--pm), #fff 30%) 0 18%, transparent 19%), linear-gradient(135deg, var(--pm), color-mix(in srgb, var(--pm), #000 20%)); }
        .pm-sodda .pm-hero { background: #fff; color: #0f172a; border: 2px solid var(--pm); border-radius: 6px; }
        .pm-uslubsiz .pm-hero { border: 2px dashed #94a3b8; }
        .pm-rangsiz { background: #e2e8f0 !important; color: #0f172a !important; }
        .lesson-root .pm-h1 { margin: 0; font-size: 21px; font-weight: 800; line-height: 1.15; }
        .lesson-root .pm-p { margin: 0; font-size: 12px; opacity: 0.92; }
        .pm-tugma { background: #fff; color: var(--pm); font-size: 12px; font-weight: 800; padding: 7px 14px; border-radius: 999px; }
        .pm-sodda .pm-tugma { background: var(--pm); color: #fff; }
        .pm-quvnoq .pm-tugma { border-radius: 10px; }
        .pm-rangsiz .pm-tugma { background: #475569; color: #fff; }
        .pm-yoq { display: inline-flex; align-items: center; border: 1.5px dashed currentColor; border-radius: 8px; padding: 4px 10px; font-size: 12px; font-weight: 700; opacity: 0.85; }
        .pm-yoq-h { font-size: 16px; padding: 6px 12px; }
        .pm-izoh { font: 600 10.5px 'JetBrains Mono', monospace; background: rgba(15,23,42,0.75); color: #fff; padding: 2px 8px; border-radius: 6px; }
        .pm-kartalar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .pm-karta { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 6px; font-size: 11.5px; font-weight: 700; color: #0f172a; overflow-wrap: anywhere; }
        .pm-karta i { width: 8px; height: 8px; border-radius: 50%; background: var(--pm); }
        .pm-quvnoq .pm-karta { border-radius: 16px; } .pm-sodda .pm-karta { border-radius: 4px; }
        .pm-karta-yoq { border-style: dashed; border-color: #94a3b8; color: #475569; font-size: 15px; }
        .pm-qoida { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; }
        .lesson-root .pm-h2 { margin: 0 0 4px; font-size: 13px; font-weight: 800; color: #0f172a; }
        .lesson-root .pm-qoida ul { margin: 0; padding-left: 18px; list-style: disc; font-size: 11.5px; color: #334155; line-height: 1.6; }
        .pm-ft { text-align: center; font-size: 10.5px; color: #475569; padding-top: 2px; }
        /* ===== F-1015-337 · reja bitta kartada + wow effektlari (sinflar izohda backtiksiz) ===== */
        .am-reja-k { gap: 10px; }
        .am-yorliq-joy { visibility: hidden; } /* F-1015-338: o'ng karta chapdagi namuna-sayt bilan bir balandlikdan boshlansin */
        @media (max-width: 760px) { .am-yorliq-joy { display: none; } }
        .am-chiziq { border: none; border-top: 1px solid ${T.line}; margin: 4px 0; }
        .lesson-root .am-blok-qator { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .am-blok-qator li { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 15px; color: ${T.ink}; }
        .pm-hero { position: relative; overflow: hidden; }
        .pm-hero > :not(.pm-fonqat) { position: relative; z-index: 1; }
        .pm-fonqat { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .pm-zarra { position: absolute; border-radius: 50%; background: currentColor; opacity: 0.45; animation: pm-suz 6s ease-in-out infinite alternate; }
        @keyframes pm-suz { from { transform: translate(0, 0); } to { transform: translate(18px, -22px); } }
        .pm-konf { position: absolute; top: -10px; width: 7px; height: 11px; border-radius: 2px; animation: pm-tush 1.6s cubic-bezier(.25,.6,.4,1) both; transform: rotate(var(--r)); }
        .pm-konf0 { background: #facc15; } .pm-konf1 { background: #f472b6; } .pm-konf2 { background: #34d399; } .pm-konf3 { background: #fff; }
        @keyframes pm-tush { from { transform: translateY(0) rotate(var(--r)); opacity: 1; } to { transform: translateY(190px) rotate(calc(var(--r) + 220deg)); opacity: 0; } }
        .pm-taymer { display: flex; gap: 6px; }
        .pm-taymer span { display: flex; flex-direction: column; align-items: center; min-width: 42px; padding: 5px 6px; border-radius: 9px; background: rgba(15,23,42,0.28); }
        .pm-sodda .pm-taymer span { background: rgba(15,23,42,0.08); }
        .pm-taymer b { font: 800 15px 'JetBrains Mono', monospace; } .pm-taymer small { font-size: 9.5px; font-weight: 700; opacity: 0.9; }
        .pm-tugma-btn { border: none; cursor: pointer; font-family: inherit; }
        .pm-tugma-btn:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        .pm-egil .pm-karta { transition: transform 0.15s ease-out; animation: pm-tebran 3.2s ease-in-out infinite; transform-style: preserve-3d; }
        .pm-egil .pm-karta:nth-child(2) { animation-delay: 0.6s; } .pm-egil .pm-karta:nth-child(3) { animation-delay: 1.2s; }
        .pm-egil .pm-karta:hover { animation: none; }
        @keyframes pm-tebran { 0%, 100% { transform: perspective(500px) rotateY(0) rotateX(0); } 30% { transform: perspective(500px) rotateY(14deg) rotateX(-6deg) translateY(-3px); } 60% { transform: perspective(500px) rotateY(-10deg) rotateX(5deg); } }
        @media (prefers-reduced-motion: reduce) { .pm-zarra, .pm-konf, .pm-egil .pm-karta { animation: none; } .pm-konf { display: none; } }
        .am-kod { display: flex; flex-direction: column; gap: 6px; }
        .am-kod + .am-kod { margin-top: 6px; }
        .am-uslub-1 { grid-template-columns: minmax(0,1fr); }
        .am-yordam { background: ${T.paper}; border-radius: 12px; padding: 10px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .am-yordam summary { cursor: pointer; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .am-yordam p, .am-yordam pre { margin: 8px 0 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        .lesson-root .am-blok-ro { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .am-blok-ro li { flex-direction: row; align-items: center; gap: 12px; flex-wrap: wrap; }
        .am-blok-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: ${T.accent}; }
        .am-blok-teg { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live, passed: screen < maxReached }}>
        <AchCtx.Provider value={earned}>
        <AchMissCtx.Provider value={achMissVal}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Praktika', ru: 'Практика' }} />
          ) : (
            <>
              <Current key={screen} screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onPracticeDone={practiceDone} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
              {mentorPractice && <MentorPracticeOverlay entry={mentorPractice} live={live} onClose={() => { setMentorPractice(null); next(); }} />}
            </>
          )}
        </div>
        </AchMissCtx.Provider>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>
  );
}
