import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 5-MODUL (Telegram bot + AI) · 6-DARS — «BOT ICHIDA AI» — PLATFORM STANDARD v18 (AUDIOSIZ) · MD v2: feedback/F-0928-QA-5modul/06-BotAiBrain-v2.md
// Maqsad: AvtoPizza botining handleri javobni AI'dan oladi. O'quvchi system prompt (kim · qanday · nima haqida),
//         suhbat tarixi va kontekst oynasi, temperature va faktni tekshirish (hallutsinatsiya) bilan ishlashni o'rganadi.
// Atamalar (A1): AI · prompt · system prompt · suhbat tarixi · kontekst oynasi · temperature · hallutsinatsiya · AI API kaliti.
// INTERAKTIV: s0 hook (system prompt'siz javob) · s1 javob yo'li chizmasi · s3 noaniq/aniq prompt · s5 MARKAZIY #1 system prompt
//   (Prompt Writer) · s6 ikki alohida so'rov · s7 MARKAZIY #2 kontekst oynasi (Context Keeper) · s9 MARKAZIY #3 temperature
//   (Temperature Tuner) · s11 MARKAZIY #4 faktni tekshirish (Fact Checker) · s15 FINAL: handler AI bilan ishlash tartibi (DragDropOrder).
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

// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi.
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang , buildResultDetails, sealPayload, useAutoNext } from '../live/index.js';







const LangContext = createContext('uz');
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const AchMissCtx = createContext(null); // 🏅 151-qonun: { missed:Set<ekran id>, miss(idx), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi

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

const LESSON_META = { lessonId: 'bot-ai-brain-05-04-v18', lessonTitle: { uz: 'Bot ichida AI', ru: "ИИ внутри бота" } };
// 20 ekran · 4.1 oqim: hook → reja → (exploration↔test)× → markaziy o'yin → builder → debugging-final → praktika → podium → flashcard → summary
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
  // bo'sh ustunda ⛶ va yorliq yolg'iz osilmasin (F-0926-01, 111-qonun): mazmun DOM bo'yicha o'lchanadi —
  // children ko'pincha doim mavjud <div> (ichi bo'sh), shuning uchun React.Children yetmaydi.
  const zref = useRef(null);
  const [hasContent, setHasContent] = useState(true);
  // ⛶ bo'sh joy ustida osilmasin (ZBTN, 159-qonun): tugma ostidagi ustunda ko'rinadigan narsa yo'q bo'lsa — yashirin.
  const [zFloat, setZFloat] = useState(false);
  useEffect(() => {
    const el = zref.current; if (!el || typeof MutationObserver === 'undefined') return;
    const ink = (n) => {
      if (!el.contains(n) || n === el || n.classList?.contains('zoom-btn') || n.closest?.('.zoom-btn')) return false;
      if (/^(IMG|svg|CANVAS|INPUT|TEXTAREA|BUTTON|VIDEO|SELECT|path|rect|circle|line|polygon)$/.test(n.tagName)) return true;
      if ([...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim())) return true;
      const cs = getComputedStyle(n); const bg = cs.backgroundColor.match(/[\d.]+/g);
      return (bg && (bg.length < 4 || Number(bg[3]) > 0.05)) || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none';
    };
    const run = () => {
      const zb = el.querySelector(':scope > .zoom-btn');
      if (!zb || el.classList.contains('zoom-on')) { setZFloat(false); return; }
      const r = zb.getBoundingClientRect(), zr = el.getBoundingClientRect(); if (!r.width) return;
      let hit = false;
      for (let y = r.top; y < Math.min(r.top + 220, zr.bottom) && !hit; y += 18) for (const x of [r.left - 30, r.left - 140]) {
        if (x < zr.left) continue; if (document.elementsFromPoint(x, y).some(ink)) { hit = true; break; }
      }
      setZFloat(!hit);
    };
    let raf = 0; const sch = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(run); };
    sch(); const t = setTimeout(sch, 700); // fade-kirish tugagach yana bir bor
    const mo = new MutationObserver(sch); mo.observe(el, { childList: true, subtree: true, characterData: true });
    window.addEventListener('resize', sch);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); mo.disconnect(); window.removeEventListener('resize', sch); };
  }, []);
  useLayoutEffect(() => {
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
      <div ref={zref} className={`zoomable ${big ? 'zoom-on' : ''}${hasContent ? '' : ' z-empty'}${zFloat ? ' z-float' : ''}`}>
        {hasContent && <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })} title={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })}>{big ? '✕' : '⛶'}</button>}
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
          <div className="ach-pop-h">{tr({ uz: 'Nishonlar', ru: "Значки" })} — {count}/{total}</div>
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
  const collapseOn = isNarrow && !mentorStatic; // F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi
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
              <div className="mono small" style={{ color: T.ink3, whiteSpace: 'nowrap' }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
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
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: "Подождите Ментора" }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(label))}</button>;
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
    title: { uz: 'Aniq prompt — foydali javob', ru: "Точный промпт — полезный ответ" },
    cards: [
      { ic: '1', h: { uz: "AI promptni o'qiydi", ru: "ИИ читает промпт" }, body: { uz: "AI faqat promptda yozilganini ko'radi, qolganini o'zi taxmin qiladi.", ru: "ИИ видит только то, что написано в промпте, а остальное додумывает сам." } },
      { ic: '2', h: { uz: 'Noaniq prompt', ru: "Неточный промпт" }, body: { uz: "«Yordam bering» dan AI nima kerakligini bilmaydi va aniqlashtiruvchi savol beradi.", ru: "Из «Помогите» ИИ не понимает, что нужно, и задаёт уточняющий вопрос." } },
      { ic: '3', h: { uz: 'Aniq prompt', ru: "Точный промпт" }, body: { uz: "Kim uchun va nima kerakligi yozilsa, javob foydali bo'ladi.", ru: "Если написать, для кого и что нужно, ответ будет полезным." }, ask: { uz: '«Yordam bering» promptini qanday aniqroq qilasiz?', ru: "Как сделать промпт «Помогите» точнее?" } },
    ]
  },
  8: {
    title: { uz: 'Kontekst oynasi', ru: "Окно контекста" },
    cards: [
      { ic: '1', h: { uz: 'Oyna cheklangan', ru: "Окно ограничено" }, body: { uz: "AI bir so'rovda ma'lum hajmdagi matnni ko'radi: system prompt, suhbat tarixi va yangi xabar shunga sig'ishi kerak.", ru: "За один запрос ИИ видит текст ограниченного объёма: system prompt, история диалога и новое сообщение должны в него поместиться." } },
      { ic: '2', h: { uz: 'Eng eskisi chiqadi', ru: "Самое старое выходит" }, body: { uz: "Tarix uzaysa, bot eng eski xabarlarni olib tashlaydi va AI ularni endi ko'rmaydi.", ru: "Когда история растёт, бот убирает самые старые сообщения, и ИИ их больше не видит." } },
      { ic: '3', h: { uz: 'Yechim — baza', ru: "Решение — база" }, body: { uz: "Ism, manzil kabi muhim ma'lumot bazaga saqlanadi va har so'rovda system prompt'ga qo'shiladi.", ru: "Важные данные, например имя и адрес, сохраняют в базу и при каждом запросе добавляют в system prompt." }, ask: { uz: 'Tarix uzaysa, qaysi xabar birinchi chiqib ketadi?', ru: "Какое сообщение выйдет первым, когда история вырастет?" } },
    ]
  },
  10: {
    title: { uz: 'Temperature', ru: "Temperature" },
    cards: [
      { ic: 'temperature: 0.1', h: { uz: "Past — qat'iy", ru: 'Низко — строго' }, body: { uz: "Temperature past bo'lsa, AI deyarli bir xil javob beradi; aniq ma'lumot uchun shu tanlanadi.", ru: "При низкой temperature ИИ отвечает почти одинаково — её выбирают для точных данных." } },
      { ic: 'temperature: 1.5', h: { uz: 'Baland — erkin', ru: "Высоко — свободно" }, body: { uz: "Baland bo'lsa, javob har safar boshqacha; ijodiy matn uchun qulay.", ru: "При высокой temperature ответ каждый раз другой — это удобно для творческого текста." } },
      { ic: '3', h: { uz: "To'g'rilikni kafolatlamaydi", ru: "Правильность не гарантирует" }, body: { uz: 'Past qiymatda ham javob menyu bilan tekshiriladi.', ru: "Даже при низком значении ответ сверяют с меню." }, ask: { uz: 'Menyuni bir xil aytish uchun qaysi temperature tanlanadi?', ru: "Какую temperature выбрать, чтобы меню звучало всегда одинаково?" } },
    ]
  },
  14: {
    title: { uz: 'Faktni tekshirish — hallutsinatsiya', ru: "Проверка фактов — галлюцинация" },
    cards: [
      { ic: '1', h: { uz: 'Ishonchli ohang', ru: "Уверенный тон" }, body: { uz: "AI noto'g'ri javobni ham ishonch bilan yozadi.", ru: "Даже неверный ответ ИИ пишет уверенно." } },
      { ic: '2', h: { uz: "To'qib chiqarilgan fakt", ru: "Выдуманный факт" }, body: { uz: "«Ananasli pitsa» kabi menyuda yo'q narsani ham aytishi mumkin; bu hallutsinatsiya.", ru: "Он может назвать то, чего нет в меню, например «пиццу с ананасом»; это галлюцинация." } },
      { ic: '3', h: { uz: 'Yechim — manba bilan solishtirish', ru: "Решение — сверка с источником" }, body: { uz: 'Narx va taom nomi bazadagi menyu bilan solishtiriladi.', ru: "Цену и название блюда сверяют с меню в базе." }, ask: { uz: "AI javobidagi qaysi ma'lumotni albatta tekshirish kerak?", ru: "Какие данные в ответе ИИ нужно обязательно проверять?" } },
    ]
  },
  15: {
    title: { uz: 'Handler AI bilan: 5 qadam', ru: "Handler с ИИ: 5 шагов" },
    cards: [
      { ic: 'ctx.message.text', h: { uz: 'Avval — xabar va kontekst', ru: "Сначала — сообщение и контекст" }, body: { uz: "Mijoz xabari keladi, bot unga system prompt va suhbat tarixini qo'shadi.", ru: "Приходит сообщение клиента, бот добавляет к нему system prompt и историю диалога." } },
      { ic: 'soraAI({ systemPrompt, tarix, xabar })', h: { uz: 'Keyin — AI javobi', ru: "Потом — ответ ИИ" }, body: { uz: "AI API shu hammasini o'qib, javob yozadi.", ru: "AI API читает всё это и пишет ответ." } },
      { ic: 'ctx.reply(javob)', h: { uz: 'Oxiri — tekshirish va yuborish', ru: "В конце — проверка и отправка" }, body: { uz: 'Javob menyu bilan tekshiriladi, keyin mijozga ketadi va tarixga yoziladi.', ru: "Ответ сверяют с меню, потом он уходит клиенту и записывается в историю." }, vis: { uz: <RcFlow items={['Xabar', 'System prompt + tarix', 'AI javobi', 'Tekshirish', 'Yuborish']} />, ru: <RcFlow items={['Сообщение', 'System prompt + история', 'Ответ ИИ', 'Проверка', 'Отправка']} /> }, ask: { uz: 'Nega javob yuborishdan oldin tekshiriladi?', ru: "Почему ответ проверяют до отправки?" } },
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
        <span className="rc-tag">{tr({ uz: 'Qayta tushuntirish', ru: "Объясняем заново" })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className={`rc-ic ${String(card.ic).length > 2 ? 'code' : 'num'}`}>{card.ic}</div>
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.vis && <div className="rc-vis">{tr(card.vis)}</div>}
        {card.ask && <div className="rc-ask">{tr({ uz: 'Sinfga savol:', ru: "Вопрос классу:" })} {tr(card.ask)}</div>}
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
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>{tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>}
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тема классу не зашла. Перед продолжением советуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: 'Qayta tushuntirish — ', ru: 'Объяснить заново — ' })}{tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 Верно <b>{pct}%</b> — неплохо. При желании коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Советуем объяснить заново.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в живом режиме…' })}</p>}
    </div>
  );
}

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
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
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: "Живой урок — одна попытка, жмите обдуманно!" })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: picked !== null ? 8 : 11 }}>
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
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: picked !== null ? 'clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)' : 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
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
                ? tr({ uz: 'Javobingiz qabul qilindi', ru: "Ваш ответ принят" })
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
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — взглянуть на тему ещё раз" })}</button>
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

// ===== TELEGRAM CHAT (jonli ko'rinish) — avatar: sarlavhaning bosh harfi (emoji emas, A4) · holat: CSS nuqta =====
// F-1002-85 · 169-qonun: chat oynasi balandligi cheklangan (CSS .tg-body max-height), har yangi xabarda eng pastga tushadi
const TgBody = ({ minH, children }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.scrollHeight <= el.clientHeight + 2) return;
    let kam = false; try { kam = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* eski brauzer */ }
    el.scrollTo({ top: el.scrollHeight, behavior: kam ? 'auto' : 'smooth' });
  });
  return <div className="tg-body" ref={ref} style={{ minHeight: minH }}>{children}</div>;
};
const TgChat = ({ title = { uz: 'AvtoPizza', ru: "AvtoPizza" }, ava, status, children, minH }) => (
  <div className="tg">
    <div className="tg-head"><span className="tg-ava">{ava || String(tr(title) || '?').charAt(0)}</span><span className="tg-name">{tr(title)}{status && <span className="tg-status">{tr(status)}</span>}</span></div>
    <TgBody minH={minH}>{children}</TgBody>
  </div>
);
const Bubble = ({ from = 'bot', children, muted, thinking }) => <div className={`tg-bubble ${from} el-in ${muted ? 'muted' : ''}`}>{thinking ? <span className="gen-dots inline"><i /><i /><i /></span> : children}</div>;
const TgBtns = ({ items }) => <div className="tg-btns el-in">{items.map((b, i) => <span key={i} className="tg-btn">{b}</span>)}</div>;
// ===== SYSTEM PROMPT / PROMPT kartasi =====
const PromptCard = ({ children, who = { uz: 'SYSTEM PROMPT', ru: "SYSTEM PROMPT" }, tone }) => (
  <div className={`prompt-card ${tone || ''}`}><span className="prompt-who">{tr(who)}</span><p className="prompt-text">{children}</p></div>
);
// ===== JAVOB YO'LI CHIZMASI (1-ekran): mijoz xabari → handler → AI API → javob; strelkalar navbat bilan chiziladi =====
const AiFlow = () => (
  <div className="af">
    <div className="af-node" style={{ animationDelay: '0s' }}><b><span className="af-ic" aria-hidden="true">📩</span>{tr({ uz: 'Mijoz xabari', ru: "Сообщение клиента" })}</b><small>{tr({ uz: 'hodisa', ru: "событие" })}</small></div>
    <span className="af-arr" style={{ animationDelay: '0.15s' }} />
    <div className="af-node" style={{ animationDelay: '0.4s' }}><b><span className="af-ic" aria-hidden="true">📄</span>handler</b></div>
    <span className="af-arr" style={{ animationDelay: '0.55s' }} />
    <div className="af-node ai" style={{ animationDelay: '0.8s' }}><b><span className="af-ic" aria-hidden="true">🧠</span>AI API</b><small>{tr({ uz: 'system prompt · suhbat tarixi · temperature', ru: "system prompt · история диалога · temperature" })}</small></div>
    <span className="af-arr" style={{ animationDelay: '0.95s' }} />
    <div className="af-node out" style={{ animationDelay: '1.2s' }}><b><span className="af-ic" aria-hidden="true">💬</span>{tr({ uz: 'javob', ru: "ответ" })}</b></div>
  </div>
);

function DragDropOrder({ items, hints, onSolved, doneText, onChange, onWrong }) {
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
  useEffect(() => { if (wrong) onWrong && onWrong(); }, [wrong]); // eslint-disable-line
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
      <div className={`dd-slots ${solved ? 'solved' : ''}`}>
        {slots.map((sid, i) => (
          <div key={i} ref={el => (slotRefs.current[i] = el)} className={`dd-slot ${sid ? 'filled' : ''} ${solved && sid ? 'ok' : ''} ${wrong && sid && sid !== order[i] ? 'bad' : ''}`}>
            <span className="dd-slotn">{i + 1}</span>
            {sid ? <button key={sid} className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr(byId[sid].label)}</button> : <span className="dd-hint">{hints ? tr(hints[i]) : tr({ uz: 'bu yerga joylang', ru: 'поместите сюда' })}</span>}
          </div>
        ))}
      </div>
      <div className="dd-pool">
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>
      {solved && doneText && <div className="dd-done">✓ {tr(doneText)}</div>}
      {wrong && !solved && <div className="dd-wrong">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang.", ru: "Порядок неверный — нажмите на часть, чтобы вернуть её, и поставьте заново." })}</div>}
    </div>
  );
}

// ===== AI XUSUSIYATLARI (2-ekran) =====
const AI_FACTS = [
  { id: 'know', label: { uz: "Ko'p matndan o'rgangan", ru: "Обучен на множестве текстов" }, desc: { uz: <>AI modeli juda ko'p matn asosida o'qitilgan, shuning uchun turli mavzularda gapira oladi. Lekin AvtoPizza menyusini u bilmaydi — buni unga aytish kerak.</>, ru: <>Модель ИИ обучена на огромном количестве текстов, поэтому может говорить на разные темы. Но меню AvtoPizza она не знает — его нужно ей сообщить.</> } },
  { id: 'tired', label: { uz: 'Har safar biroz boshqacha yozadi', ru: "Каждый раз пишет немного по-разному" }, desc: { uz: <>AI javobni so'zma-so'z tanlab yozadi. Shuning uchun bir xil savolga ikki marta bir xil javob bermasligi mumkin.</>, ru: <>ИИ выбирает ответ слово за словом. Поэтому на один и тот же вопрос он может дважды ответить по-разному.</> } },
  { id: 'forget', label: { uz: "Oldingi so'rovni o'zi eslamaydi", ru: "Сам не помнит прошлый запрос" }, desc: { uz: <>Bot yuborgan har so'rov AI uchun alohida. Oldingi xabarlarni AI faqat bot ularni so'rovga qo'shib yuborsa biladi — buni tez orada sinab ko'rasiz.</>, ru: <>Каждый запрос от бота для ИИ отдельный. О прошлых сообщениях ИИ знает, только если бот добавит их в запрос, — скоро вы это проверите.</> } }
];

// ===== SCREEN 0 — HOOK: system prompt'siz AI pitsaning tarixini gapiradi =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  // 0 — faqat mijoz xabari · 1 — yozmoqda · 2 — AI javobi · 3 — mijozning norozi xabari + savol
  const [phase, setPhase] = useState(storedAnswer ? 3 : 0);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const OPTS = [
    { id: 'a', label: { uz: "AI'ga vazifasi aytilmagan, u qaysi do'kon boti ekanini bilmaydi", ru: "ИИ не сказали его задачу — он не знает, для какого магазина работает" } },
    { id: 'b', label: { uz: "Bot savolni AI'ga emas, qidiruv saytiga yubordi", ru: "Бот отправил вопрос не в ИИ, а на поисковый сайт" } },
    { id: 'c', label: { uz: 'Internet sekin ishlab, javob chalkashib ketdi', ru: "Интернет работал медленно, и ответ перепутался" } }
  ];
  const send = () => {
    if (phase > 0) return;
    setPhase(1); setSc(n => n + 1);
    timers.current.push(setTimeout(() => { setPhase(2); setSc(n => n + 1); }, 900));
    timers.current.push(setTimeout(() => { setPhase(3); setSc(n => n + 1); }, 1900));
  };
  const pick = (v) => { if (picked !== null || phase < 3) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={{ uz: 'Kirish', ru: "Вступление" }} screen={screen} scrollSignal={sc} navContent={<NavNext disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr({ uz: <>Mijoz pitsa haqida so'radi. <span className="italic" style={{ color: T.accent }}>AI nima deb javob beradi?</span></>, ru: <>Клиент спросил про пиццу. <span className="italic" style={{ color: T.accent }}>Что ответит ИИ?</span></> })}</h1>
        <Mentor>{tr({ uz: "1-darsda bot faqat handlerda yozilgan javobni yuborardi. Endi AvtoPizza botining handleri mijoz xabarini AI'ga yuboradi va javobni undan oladi. AI'ga hali hech narsa aytilmagan. Tugmani bosing va nima bo'lishini ko'ring.", ru: "На 1-м уроке бот отправлял только ответ, записанный в handler-е. Теперь handler бота AvtoPizza отправляет сообщение клиента в ИИ и получает ответ от него. ИИ пока ничего не сказали. Нажмите кнопку и посмотрите, что будет." })}</Mentor>
        <Zoomable><Split>
          <Col>
            <TgChat title={{ uz: 'AvtoPizza', ru: "AvtoPizza" }} status={{ uz: "AI ulangan · system prompt yo'q", ru: "ИИ подключён · без system prompt" }} minH={140}>
              <Bubble from="user">{tr({ uz: 'Pitsa haqida ayting', ru: 'Расскажите про пиццу' })}</Bubble>
              {phase === 1 && <Bubble from="bot" thinking />}
              {phase >= 2 && <Bubble from="bot">{tr({ uz: "Pitsa Italiyaning Neapol shahrida paydo bo'lgan taom. Uning tarixi bir necha asrga boradi: Margarita, Marinara kabi turlari bor. Bugun u ko'p mamlakatda mashhur, har birida o'z retsepti bor…", ru: "Пицца — блюдо, которое появилось в итальянском городе Неаполь. Её история насчитывает несколько веков: есть Маргарита, Маринара и другие виды. Сегодня она популярна во многих странах, и в каждой свой рецепт…" })}</Bubble>}
              {phase >= 3 && <Bubble from="user">{tr({ uz: "Menga do'koningizdagi pitsalar kerak edi", ru: "Мне нужны были пиццы из вашего магазина" })}</Bubble>}
            </TgChat>
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={send} disabled={phase > 0}>{phase >= 2 ? tr({ uz: '✓ AI javob berdi', ru: "✓ ИИ ответил" }) : tr({ uz: "▶ Xabarni AI'ga yuborish", ru: "▶ Отправить сообщение в ИИ" })}</button>
          </Col>
          <Col>
            {phase >= 3 && <>
              <p className="q-lbl fade-step">{tr({ uz: 'Nega AI shunday javob berdi?', ru: "Почему ИИ ответил именно так?" })}</p>
              <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {OPTS.map(o => {
                  const on = picked === o.id;
                  return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>);
                })}
              </div>
              {picked !== null && <p className="hook-ack fade-step">{picked === 'a'
                ? tr({ uz: <><b>Aynan!</b> AI ko'p narsani biladi, lekin vazifasi aytilmagan: u AvtoPizza boti ekanini bilmaydi. Yechim — system prompt.</>, ru: <><b>Именно!</b> ИИ знает много, но ему не сказали задачу: он не знает, что он бот AvtoPizza. Решение — system prompt.</> })
                : tr({ uz: <><b>Qiziq fikr!</b> Javob tartibli, lekin do'kon haqida emas: AI'ga u AvtoPizza boti ekani aytilmagan. Yechim — system prompt.</>, ru: <><b>Интересная мысль!</b> Ответ связный, но не о магазине: ИИ не сказали, что он бот AvtoPizza. Решение — system prompt.</> })}</p>}
            </>}
          </Col>
        </Split></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA: javob yo'li chizmasi (strelkalar chiziladi) → 4 qadam birma-bir =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { uz: 'AI nimani biladi va nimani bilmaydi', ru: "Что ИИ знает и чего не знает", tag: { uz: "bilim", ru: "знания" } },
    { uz: 'System prompt yozamiz', ru: "Пишем system prompt", tag: { uz: "rol", ru: "роль" } },
    { uz: "Suhbat tarixi va temperature'ni sinaymiz", ru: "Проверяем историю диалога и temperature", tag: { uz: "sozlama", ru: "настройка" } },
    { uz: 'Faktni tekshiramiz', ru: "Проверяем факты", tag: { uz: "fakt", ru: "факт" } }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const Chart = <Col><AiFlow /></Col>;
  const StepsB = (
    <Col>
      <p className="flow-label af-step" style={{ animationDelay: `${isNarrow ? 0 : 1.3}s` }}>{tr({ uz: 'Bugungi 4 qadam', ru: '4 шага на сегодня' })}</p>
      <ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card af-step" style={{ animationDelay: `${(isNarrow ? 0.1 : 1.4) + i * 0.18}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s)}</span>{s.tag && <span className="step-tag">{tr(s.tag)}</span>}</span></li>))}</ol>
    </Col>
  );
  return (
    <Stage eyebrow={{ uz: 'Reja', ru: 'План' }} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun: bot javobni <span className="italic" style={{ color: T.accent }}>AI'dan</span> qanday oladi?</>, ru: <>Сегодня: как бот получает ответ <span className="italic" style={{ color: T.accent }}>от ИИ</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "1-darsda handler javobni o'zi yozilgan matndan olardi. Bugun u javobni AI'dan oladi. AI yaxshi javob yozishi uchun unga nima yuborishni o'rganamiz.", ru: "На 1-м уроке handler брал ответ из заранее написанного текста. Сегодня он получает ответ от ИИ. Разберём, что отправить ИИ, чтобы он написал хороший ответ." })}</Mentor>
        {!isNarrow ? (<Zoomable><Split>{Chart}{StepsB}</Split></Zoomable>)
          : !showSteps ? <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{Chart}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "4 qadamni ko'rish", ru: 'Посмотреть 4 шага' })}</button></div>
            : <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Chizmani ko'rish", ru: "↩ Посмотреть схему" })}</button>{StepsB}</div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — AI NIMANI BILADI (uch xususiyat, bittasi ochiladi) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(AI_FACTS.map(a => a.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= AI_FACTS.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = AI_FACTS.find(a => a.id === active);
  return (
    <Stage eyebrow={{ uz: 'Tushuncha · AI', ru: "Понятие · ИИ" }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : tr({ uz: `Uchalasini oching (${seen.size}/3)`, ru: `Откройте все три (${seen.size}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bot ulanadigan AI nimani biladi va <span className="italic" style={{ color: T.accent }}>nimani bilmaydi</span>?</>, ru: <>Что ИИ знает, а <span className="italic" style={{ color: T.accent }}>чего не знает</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bot javobni AI modelidan oladi, masalan, Gemini'dan. Uning uchta xususiyatini bosib ko'ring.", ru: "Бот получает ответ от модели ИИ, например от Gemini. Нажмите на три её свойства." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            {/* F-1002-83: kirish-animatsiyasi o'rovchida — tugmadagi puls (tap-wave) uni bosib ketmasin */}
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 'inherit' }}>
              {AI_FACTS.map(a => <button key={a.id} className={`pick-row ${active === a.id ? 'sel' : ''} ${seen.has(a.id) ? 'seen' : 'tap-wave'}`} onClick={() => tap(a.id)}><span style={{ flex: 1 }}>{tr(a.label)}</span><span className="pick-plus">{seen.has(a.id) ? '✓' : '›'}</span></button>)}
            </div>
          </Col>
          <Col>
            {cur ? <div className="sk-info fade-step" key={active}><p className="note-h">{tr(cur.label)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.desc)}</p></div> : null}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — NOANIQ va ANIQ PROMPT (solishtirish: o'ng tugma chap javobdan keyin chiqadi) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [tried, setTried] = useState(storedAnswer ? new Set(['bad', 'good']) : new Set());
  const [sc, setSc] = useState(0);
  const done = tried.size >= 2;
  const send = (kind) => { setTried(prev => new Set(prev).add(kind)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Tushuncha · prompt', ru: "Понятие · промпт" }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : tr({ uz: `Ikkalasini yuboring (${tried.size}/2)`, ru: `Отправьте оба (${tried.size}/2)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Noaniq</span> prompt va <span className="italic" style={{ color: T.accent }}>aniq</span> prompt.</>, ru: <><span className="italic" style={{ color: T.accent }}>Неточный</span> промпт и <span className="italic" style={{ color: T.accent }}>точный</span> промпт.</> })}</h2></div>
        <Mentor>{tr({ uz: "Prompt — AI'ga yuboriladigan matn (5-darsda bot kodi uchun yozgansiz). Ikkala promptni yuborib, qaysi javob foydaliroq ekanini solishtiring.", ru: "Промпт — текст, который отправляют ИИ (на 5-м уроке вы писали его для кода бота). Отправьте оба промпта и сравните, какой ответ полезнее." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'noaniq prompt', ru: "неточный промпт" })}</p>
            <PromptCard who={{ uz: 'prompt', ru: "промпт" }}>{tr({ uz: 'Yordam bering', ru: 'Помогите' })}</PromptCard>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={tried.has('bad')} onClick={() => send('bad')}>{tried.has('bad') ? tr({ uz: '✓ Yuborildi', ru: '✓ Отправлено' }) : tr({ uz: '▶ Yuborish', ru: "▶ Отправить" })}</button>
            {tried.has('bad') && <TgChat title={{ uz: 'AI', ru: "ИИ" }} minH={0}><Bubble from="bot">{tr({ uz: 'Albatta. Nimada yordam kerak? Savol juda keng — qaysi mavzu, qaysi vazifa ekanini aniqroq yozing.', ru: "Конечно. В чём нужна помощь? Вопрос очень широкий — напишите точнее, какая тема и какая задача." })}</Bubble></TgChat>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'aniq prompt', ru: "точный промпт" })}</p>
            <PromptCard who={{ uz: 'prompt', ru: "промпт" }}>{tr({ uz: "AvtoPizza do'konining Telegram-boti uchun 3 ta qisqa salomlashuv gapi yozing", ru: "Напишите 3 коротких приветствия для Telegram-бота магазина AvtoPizza" })}</PromptCard>
            {tried.has('bad') && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} disabled={tried.has('good')} onClick={() => send('good')}>{tried.has('good') ? tr({ uz: '✓ Yuborildi', ru: '✓ Отправлено' }) : tr({ uz: '▶ Yuborish', ru: "▶ Отправить" })}</button>}
            {tried.has('good') && <TgChat title={{ uz: 'AI', ru: "ИИ" }} minH={0}><Bubble from="bot">{tr({ uz: "1) Xush kelibsiz! AvtoPizza'da bugun qaysi pitsani tanlaysiz? 2) Assalomu alaykum! Menyuni ko'rish uchun «Menyu» tugmasini bosing. 3) Salom! Buyurtma berishga yordam beraymi?", ru: "1) Добро пожаловать! Какую пиццу выберете сегодня в AvtoPizza? 2) Здравствуйте! Чтобы посмотреть меню, нажмите кнопку «Меню». 3) Привет! Помочь оформить заказ?" })}</Bubble></TgChat>}
          </Col>
        </div></Zoomable>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Aniq prompt — foydali javob. Bot ichida AI'ga u kim ekani va nima qilishi yoziladi — bu system prompt.", ru: "Точный промпт — полезный ответ. В боте ИИ пишут, кто он и что делает, — это system prompt." })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    questionText="AI'dan foydali javob olish uchun prompt qanday yozilishi kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>AI'dan foydali javob olish uchun <span className="italic" style={{ color: T.accent }}>prompt</span> qanday yozilishi kerak?</>, ru: <>Как написать <span className="italic" style={{ color: T.accent }}>промпт</span>, чтобы получить от ИИ полезный ответ?</> })}</h2></>}
    options={[tr({ uz: "Iloji boricha qisqa, bir-ikki so'z bilan", ru: "Как можно короче, в одно-два слова" }), tr({ uz: 'Katta harflar va undov belgilari bilan', ru: "Заглавными буквами и с восклицательными знаками" }), tr({ uz: 'Kim uchun va nima kerakligini aniq aytib', ru: "Чётко написав, для кого и что нужно" }), tr({ uz: 'Bitta savolni bir necha marta takrorlab', ru: "Повторив один вопрос несколько раз" })]} correctIdx={2}
    explainCorrect={tr({ uz: "AI faqat promptda yozilganini ko'radi — kim uchun va nima kerakligini aniq yozing.", ru: "ИИ видит только то, что написано в промпте, — пишите чётко, для кого и что нужно." })}
    explainWrong={{
      0: tr({ uz: "Qisqa prompt ko'pincha noaniq bo'ladi: «Yordam bering» ga AI aniqlashtiruvchi savol qaytardi.", ru: "Короткий промпт часто неточный: на «Помогите» ИИ ответил уточняющим вопросом." }),
      1: tr({ uz: "Katta harf AI'ga yangi ma'lumot bermaydi. Muhimi — nima kerakligi aniq yozilgani.", ru: "Заглавные буквы не дают ИИ новой информации. Главное — чётко написать, что нужно." }),
      3: tr({ uz: "Takrorlash promptni aniqroq qilmaydi: AI'ga yangi ma'lumot qo'shilmaydi.", ru: "Повтор не делает промпт точнее: ИИ не получает новой информации." }),
      default: tr({ uz: 'Foydali javob uchun promptda kim uchun va nima kerakligi aniq yoziladi.', ru: "Для полезного ответа в промпте чётко пишут, для кого и что нужно." })
    }} />
);

// ===== SCREEN 5 — MARKAZIY #1: SYSTEM PROMPT YIG'ISH (navbat: savol → tanlov → ✓ qator → keyingi) =====
// Ballsiz (faqat nishon): to'g'ri variant o'rni har savolda boshqa; shart variantning `ok` bayrog'i bo'yicha (indeks emas).
const YR_SLOTS = [
  { id: 'who', q: { uz: 'Kim?', ru: 'Кто он?' }, opts: [
    { id: 'enc', ok: false, t: { uz: 'Istalgan savolga javob beradigan ensiklopediya', ru: "энциклопедия, которая отвечает на любой вопрос" } },
    { id: 'shop', ok: true, t: { uz: "AvtoPizza do'konining yordamchisi", ru: "помощник магазина AvtoPizza" } },
    { id: 'self', ok: false, t: { uz: "Faqat o'zi haqida gapiradigan yordamchi", ru: 'помощник, который говорит только о себе' } }
  ] },
  { id: 'how', q: { uz: 'Qanday gapirsin?', ru: 'Как ему говорить?' }, opts: [
    { id: 'long', ok: false, t: { uz: 'Imkon qadar uzun va batafsil', ru: "как можно длиннее и подробнее" } },
    { id: 'yesno', ok: false, t: { uz: "Faqat «ha» yoki «yo'q» deb", ru: "только «да» или «нет»" } },
    { id: 'short', ok: true, t: { uz: 'Qisqa, samimiy, aniq', ru: 'коротко, дружелюбно, чётко' } }
  ] },
  { id: 'limit', q: { uz: 'Nima haqida?', ru: "О чём говорить?" }, opts: [
    { id: 'any', ok: false, t: { uz: 'Istalgan mavzuda erkin gaplashaver', ru: "Говори свободно на любую тему" } },
    { id: 'menu', ok: true, t: { uz: 'Faqat menyu va buyurtma haqida gaplash', ru: "Говори только о меню и заказах" } },
    { id: 'none', ok: false, t: { uz: 'Hech qanday savolga javob berma', ru: "Не отвечай ни на один вопрос" } }
  ] }
];
const yrOpt = (slot, choice) => slot.opts.find(o => o.id === choice[slot.id]);
const yrOk = (slot, choice) => { const o = yrOpt(slot, choice); return !!(o && o.ok); };
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [choice, setChoice] = useState(() => storedAnswer ? { who: 'shop', how: 'short', limit: 'menu' } : {});
  const [reopen, setReopen] = useState(null);
  const wrongEverRef = useRef(!!(storedAnswer && storedAnswer.correct === false));
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const done = YR_SLOTS.every(s => yrOk(s, choice));
  const firstOpen = YR_SLOTS.find(s => !yrOk(s, choice));
  const curId = reopen || (firstOpen && firstOpen.id);
  const curSlot = YR_SLOTS.find(s => s.id === curId);
  const curWrong = !!(curSlot && choice[curSlot.id] !== undefined && !yrOk(curSlot, choice));
  const pick = (slot, opt) => {
    if (!opt.ok) {
      wrongEverRef.current = true;
      if (achMiss) achMiss.miss(screen); // 🏅 151-qonun: xato variant — nishon birinchi urinishga (F5 da ham saqlanadi)
    }
    setChoice(c => ({ ...c, [slot.id]: opt.id }));
    if (opt.ok && reopen === slot.id) setReopen(null);
    setSc(n => n + 1);
  };
  useEffect(() => {
    if (done && !fired.current) { fired.current = true; onAnswer(screen, { stage: 'builder', screenIdx: screen, correct: !wrongEverRef.current, picked: true, solved: true }); }
  }, [done]);
  // Kartadagi gap: «Sen …san. … gapir. ….» — «Kim?» javobi gap o'rtasida kichik harf bilan tushadi
  const cardTxt = (slot) => {
    const o = yrOpt(slot, choice);
    if (!o) return '…';
    const s = tr(o.t);
    return slot.id === 'who' && __lang === 'uz' && !/^AvtoPizza/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  };
  return (
    <Stage eyebrow={{ uz: 'Markaziy · system prompt', ru: "Ключевое · system prompt" }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "System prompt'ni yig'ing", ru: "Соберите system prompt" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AvtoPizza boti uchun <span className="italic" style={{ color: T.accent }}>system prompt</span> yozing.</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>system prompt</span> для бота AvtoPizza.</> })}</h2></div>
        <Mentor>{tr({ uz: "System prompt — AI'ga har so'rovdan oldin beriladigan doimiy ko'rsatma: u kim, qanday gapiradi, nima haqida gapiradi. Har savolga bitta javob tanlang.", ru: "System prompt — постоянное указание, которое ИИ получает перед каждым запросом: кто он, как говорит и о чём говорит. На каждый вопрос выберите один ответ." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            {YR_SLOTS.map(s => {
              if (s.id === curId) return (
                <div key={s.id} className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <p className="flow-label">{tr(s.q)}</p>
                  {s.opts.map(o => {
                    const sel = choice[s.id] === o.id;
                    return (<button key={o.id} className={`pick-row ${sel ? 'sel' : ''} ${sel && !o.ok ? 'shake' : ''}`} onClick={() => pick(s, o)}><span style={{ flex: 1 }}>{tr(o.t)}</span><span className="pick-plus">{sel ? (o.ok ? '✓' : '✗') : '▶'}</span></button>);
                  })}
                </div>
              );
              if (yrOk(s, choice)) return (
                <div key={s.id} className="sp-done fade-step">
                  <span className="sp-done-t"><b>{tr(s.q)}</b> — {tr(yrOpt(s, choice).t)}</span>
                  <span className="sp-done-ok">✓</span>
                  <button className="sp-redo" onClick={() => { setReopen(s.id); setSc(n => n + 1); }} aria-label={tr({ uz: "O'zgartirish", ru: "Изменить" })} title={tr({ uz: "O'zgartirish", ru: "Изменить" })}>↻</button>
                </div>
              );
              return null;
            })}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "yig'ilayotgan system prompt", ru: "собираемый system prompt" })}</p>
            <PromptCard who={{ uz: 'SYSTEM PROMPT', ru: "SYSTEM PROMPT" }} tone={done ? 'live' : ''}>
              {tr({
                uz: <>Sen {cardTxt(YR_SLOTS[0])}san. {cardTxt(YR_SLOTS[1])} gapir. {cardTxt(YR_SLOTS[2])}.</>,
                ru: <>Ты — {cardTxt(YR_SLOTS[0])}. Говори {cardTxt(YR_SLOTS[1])}. {cardTxt(YR_SLOTS[2])}.</>
              })}
            </PromptCard>
            {!done && <AchRule screen={screen} />}
            {curWrong && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Bu javob AvtoPizza botiga mos emas — boshqasini tanlang.", ru: "Этот ответ не подходит боту AvtoPizza — выберите другой." })}</p></div>}
            {done && !reopen && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Tayyor — endi AI biladi: u kim, qanday gapiradi va nima haqida gapiradi.', ru: "Готово — теперь ИИ знает, кто он, как говорит и о чём говорит." })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — IKKI ALOHIDA SO'ROV: ikkinchi so'rovda tarix yo'q (har so'rov ostida «bot → AI» strelkasi) =====
const ReqArrow = () => <div className="req-arrow" aria-hidden="true"><span>{tr({ uz: 'bot', ru: "бот" })}</span><i /><span>AI</span></div>;
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? 2 : 0);
  const [sc, setSc] = useState(0);
  const done = step >= 2;
  const advance = () => { setStep(s => Math.min(s + 1, 2)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Sinov · xotira', ru: 'Проба · память' }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Ikkinchi xabarni yuborish', ru: 'Отправьте второе сообщение' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ikki xabar — <span className="italic" style={{ color: T.accent }}>ikki alohida so'rov</span>.</>, ru: <>Два сообщения — <span className="italic" style={{ color: T.accent }}>два отдельных запроса</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Bot har mijoz xabarini AI'ga alohida so'rov qilib yuboradi. Aziza avval ismini aytdi, keyin «Ismim nima edi?» deb so'radi. Ikkinchi xabarni yuboring: AI eslaydimi?", ru: "Бот отправляет каждое сообщение клиента в ИИ отдельным запросом. Азиза сначала назвала своё имя, а потом спросила: «Как меня зовут?» Отправьте второе сообщение: вспомнит ли ИИ?" })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <TgChat title={{ uz: "1-so'rov", ru: "1-й запрос" }} minH={100}>
              <Bubble from="user">{tr({ uz: 'Salom, mening ismim Aziza.', ru: "Здравствуйте, меня зовут Азиза." })}</Bubble>
              <Bubble from="bot">{tr({ uz: 'Salom, Aziza! Sizga qanday yordam beray?', ru: "Здравствуйте, Азиза! Чем могу помочь?" })}</Bubble>
            </TgChat>
            <ReqArrow />
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={step >= 1} onClick={advance}>{step >= 1 ? tr({ uz: '✓ Yuborildi', ru: '✓ Отправлено' }) : tr({ uz: '▶ Ikkinchi xabarni yuborish', ru: '▶ Отправить второе сообщение' })}</button>
          </Col>
          <Col>
            {step >= 1 ? (<>
              <TgChat title={{ uz: "2-so'rov", ru: "2-й запрос" }} status={{ uz: "AI'ga ketdi — faqat shu xabar", ru: "в ИИ ушло только это сообщение" }} minH={100}>
                <Bubble from="user">{tr({ uz: 'Ismim nima edi?', ru: 'Как меня зовут?' })}</Bubble>
                {step === 1 && <Bubble from="bot" thinking />}
                {step >= 2 && <Bubble from="bot">{tr({ uz: 'Kechirasiz, ismingizni bilmayman. Uni menga hali aytmagansiz.', ru: "Извините, я не знаю вашего имени. Вы мне его ещё не называли." })}</Bubble>}
              </TgChat>
              <ReqArrow />
            </>) : null}
            {step === 1 && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={advance}>{tr({ uz: "Javobni ko'rish", ru: 'Посмотреть ответ' })}</button>}
            {done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "AI ismni bilmadi: so'rovga suhbat tarixi qo'shilmagan edi.", ru: "ИИ не узнал имя: к запросу не добавили историю диалога." })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — MARKAZIY #2: KONTEKST OYNASI SINOVI =====
const DESK_MSGS = [
  { id: 'p1', text: { uz: 'Salom!', ru: 'Здравствуйте!' } },
  { id: 'p2', text: { uz: 'Ismim: Aziza', ru: "Моё имя: Азиза" } },
  { id: 'p3', text: { uz: 'Bugun ob-havo yaxshi ekan', ru: "Сегодня хорошая погода" } },
  { id: 'p4', text: { uz: 'Menga Margarita kerak', ru: 'Мне нужна Маргарита' } },
  { id: 'p5', text: { uz: 'Manzil: Chilonzor 5-kvartal', ru: "Адрес: Чиланзар, 5-й квартал" } }
];
const DESK_MAX = 4;
// F-1002-95: oyna chat kabi — eski TEPADA, yangi pastda; 4 katak boshidanoq ko'rinadi, hisoblagich «n / 4»;
// 5-xabarda eng eskisi yuqoriga chiqib, oyna USTIDA kulrang «chiqib ketdi» bo'lib qoladi — qayerga ketgani ko'rinadi.
// «keyingi chiqadi» belgisi faqat oyna to'lganda (4/4) — 5-xabardan keyin yo'q, savol javobi sotilmaydi.
function Desk({ onAllSent, sentAll }) {
  const [count, setCount] = useState(sentAll ? DESK_MSGS.length : 0);
  const [outId, setOutId] = useState(null); // hozir chiqib ketayotgan xabar (animatsiya davomida)
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const send = () => {
    if (count >= DESK_MSGS.length || outId) return;
    const next = count + 1;
    const finish = () => { setOutId(null); setCount(next); if (next === DESK_MSGS.length && onAllSent) onAllSent(); };
    if (next > DESK_MAX) {
      let kam = false; try { kam = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* eski brauzer */ }
      setOutId(DESK_MSGS[next - DESK_MAX - 1].id);
      timer.current = setTimeout(finish, kam ? 0 : 450);
    } else finish();
  };
  const first = Math.max(0, count - DESK_MAX);
  const visible = DESK_MSGS.slice(first, count);                 // eski tepada, yangi pastda
  const ghosts = DESK_MSGS.slice(0, outId ? first + 1 : first);  // oynadan chiqib ketganlar — oyna ustida
  const full = count >= DESK_MAX && count < DESK_MSGS.length && !outId;
  return (
    <Col>
      <div>
        <p className="flow-label" style={{ margin: 0 }}>{tr({ uz: 'kontekst oynasi', ru: 'окно контекста' })}</p>
        <p className="desk-cap">{tr({ uz: "Sinovda 4 ta xabar sig'adi. Haqiqiy AI'da oyna ancha katta, lekin cheksiz emas.", ru: "В этом опыте помещается 4 сообщения. В настоящем ИИ окно намного больше, но не бесконечно." })}</p>
      </div>
      <div className="desk">
        <div className="desk-ghosts">{ghosts.map(m => <span key={m.id} className="desk-ghost"><s>{tr(m.text)}</s> {tr({ uz: 'chiqib ketdi', ru: 'вышло из окна' })}</span>)}</div>
        <div className="desk-slots">
          <span className="desk-cnt">{Math.min(count, DESK_MAX)} / {DESK_MAX}</span>
          {Array.from({ length: DESK_MAX }, (_, i) => {
            const m = visible[i];
            if (!m) return <div key={`e${i}`} className="desk-slot" />;
            const next = i === 0 && full;
            return <div key={m.id} className={`desk-slot f${next ? ' next' : ''}${m.id === outId ? ' out' : ''}`}><span>{tr(m.text)}</span>{next && <span className="desk-next">{tr({ uz: 'keyingi chiqadi', ru: 'выйдет следующим' })}</span>}</div>;
          })}
        </div>
      </div>
      <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={count >= DESK_MSGS.length} onClick={send}>{count >= DESK_MSGS.length ? tr({ uz: '✓ Hammasi yuborildi', ru: "✓ Всё отправлено" }) : tr({ uz: `▶ Xabar yuborish (${count}/${DESK_MSGS.length})`, ru: `▶ Отправить сообщение (${count}/${DESK_MSGS.length})` })}</button>
    </Col>
  );
}
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [sentAll, setSentAll] = useState(!!storedAnswer);
  const [choice, setChoice] = useState(storedAnswer ? (storedAnswer.picked ?? 'p2') : null);
  const [sc, setSc] = useState(0);
  const CANDIDATES = ['p3', 'p2', 'p5'];
  const done = sentAll && choice !== null;
  const fired = useRef(!!storedAnswer);
  useEffect(() => { if (done && !fired.current) { fired.current = true; onAnswer(screen, { stage: 'central', screenIdx: screen, correct: choice === 'p2', picked: choice, solved: true }); } }, [done, choice]);
  const pick = (id) => { if (choice !== null) return; if (id !== 'p2' && achMiss) achMiss.miss(screen); setChoice(id); setSc(n => n + 1); };
  return (
    <Stage eyebrow={{ uz: 'Markaziy · kontekst oynasi', ru: "Ключевое · окно контекста" }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Sinovni bajaring', ru: 'Выполните пробу' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Suhbat tarixi uzaysa <span className="italic" style={{ color: T.accent }}>nima bo'ladi</span>?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>произойдёт</span>, если история диалога станет длинной?</> })}</h2></div>
        <Mentor>{tr({ uz: "Endi bot har so'rovga suhbat tarixini qo'shadi. AI bir so'rovda ko'ra oladigan matn hajmi kontekst oynasi deyiladi. Xabarlarni birma-bir yuboring va oynani kuzating.", ru: "Теперь бот добавляет к каждому запросу историю диалога. Объём текста, который ИИ может увидеть за один запрос, называется окном контекста. Отправляйте сообщения по одному и следите за окном." })}</Mentor>
        <Zoomable><div className="split">
          <Desk onAllSent={() => { setSentAll(true); setSc(n => n + 1); }} sentAll={sentAll} />
          {sentAll && <Col>
            <p className="q-lbl fade-step">{tr({ uz: "Keyingi xabar kelsa, qaysi muhim ma'lumot oynadan chiqib ketadi?", ru: "Какие важные данные выйдут из окна, когда придёт следующее сообщение?" })}</p>
            <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {CANDIDATES.map(id => {
                const m = DESK_MSGS.find(x => x.id === id);
                const sel = choice === id;
                return <button key={id} className={`pick-row ${sel ? 'sel' : ''}`} disabled={choice !== null} onClick={() => pick(id)}><span style={{ flex: 1 }}>{tr(m.text)}</span><span className="pick-plus">{sel ? (id === 'p2' ? '✓' : '✗') : '▶'}</span></button>;
              })}
            </div>
            <AchRule screen={screen} once />
            {done && choice === 'p2' && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "«Ismim: Aziza» endi eng eski xabar — keyingi xabar kelsa, u oynadan chiqadi.", ru: "«Моё имя: Азиза» теперь самое старое сообщение — когда придёт следующее, оно выйдет из окна." })}</p></div>}
            {done && choice !== 'p2' && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "«Ismim: Aziza» oynadan chiqdi — endi AI ismni bilmaydi.", ru: "«Моё имя: Азиза» вышло из окна — теперь ИИ не знает имя." })}</p></div>}
          </Col>}
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST 2 =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    questionText="Suhbat tarixi kontekst oynasiga sig'may qolsa, nima bo'ladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Suhbat tarixi kontekst oynasiga <span className="italic" style={{ color: T.accent }}>sig'may qolsa</span>, nima bo'ladi?</>, ru: <>Что будет, если история диалога <span className="italic" style={{ color: T.accent }}>не поместится</span> в окно контекста?</> })}</h2></>}
    options={[tr({ uz: "Eng eski xabarlar chiqadi va AI ularni ko'rmaydi", ru: "Самые старые сообщения выйдут, и ИИ их не увидит" }), tr({ uz: "AI butunlay ishlashdan to'xtab qoladi", ru: "ИИ полностью перестанет работать" }), tr({ uz: "Bot yangi xabarlarni qabul qilmay qo'yadi", ru: "Бот перестанет принимать новые сообщения" }), tr({ uz: "Eski xabarlar o'zi bazaga yozilib qoladi", ru: "Старые сообщения сами запишутся в базу" })]} correctIdx={0}
    explainCorrect={tr({ uz: "Oyna cheklangan: odatda eng eski xabarlar chiqadi va AI ularni endi ko'rmaydi.", ru: "Окно ограничено: обычно выходят самые старые сообщения, и ИИ их больше не видит." })}
    explainWrong={{
      1: tr({ uz: "AI ishlashda davom etadi — faqat eski xabarlarni endi ko'rmaydi.", ru: "ИИ продолжает работать — он просто больше не видит старые сообщения." }),
      2: tr({ uz: 'Yangi xabarlar qabul qilinadi — oynadan eskisi chiqadi.', ru: "Новые сообщения принимаются — из окна выходит старое." }),
      3: tr({ uz: "O'zi hech narsa saqlanmaydi: muhim ma'lumotni bazaga bot kodi yozadi.", ru: "Само ничего не сохраняется: важные данные в базу записывает код бота." }),
      default: tr({ uz: "Oyna to'lsa, eng eski xabarlar chiqadi va AI ularni ko'rmaydi.", ru: "Когда окно заполнено, самые старые сообщения выходят, и ИИ их не видит." })
    }} />
);

// ===== SCREEN 9 — MARKAZIY #3: TEMPERATURE (navbat: 0.1 → 1.5 → savol; ikkala javob to'plami yonma-yon qoladi) =====
const DIAL_REPLIES = {
  low: [{ uz: "Bizda Margarita, Pepperoni va To'rt pishloq bor.", ru: "У нас есть Маргарита, Пепперони и Четыре сыра." }, { uz: "Bizda Margarita, Pepperoni va To'rt pishloq bor.", ru: "У нас есть Маргарита, Пепперони и Четыре сыра." }, { uz: "Bizda Margarita, Pepperoni va To'rt pishloq bor.", ru: "У нас есть Маргарита, Пепперони и Четыре сыра." }],
  high: [{ uz: 'Bizda Margarita va Pepperoni bor — qaysi birini tanlaysiz?', ru: "У нас есть Маргарита и Пепперони — какую выберете?" }, { uz: "Bugun Margarita bilan boshlang, Pepperoni ham bor — albatta sinab ko'ring!", ru: "Начните сегодня с Маргариты, а ещё есть Пепперони — обязательно попробуйте!" }, { uz: "Menyuda Pepperoni va To'rt pishloq — ikkalasi ham mazali!", ru: "В меню Пепперони и Четыре сыра — обе очень вкусные!" }]
};
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
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
  const pick = (v) => { if (choice !== null) return; if (v !== 'low' && achMiss) achMiss.miss(screen); setChoice(v); setSc(n => n + 1); };
  return (
    <Stage eyebrow={{ uz: 'Markaziy · temperature', ru: "Ключевое · temperature" }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Ikkalasini sinab ko'ring", ru: 'Попробуйте оба' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Temperature</span>: javob qat'iy bo'lsinmi yoki erkin?</>, ru: <><span className="italic" style={{ color: T.accent }}>Temperature</span>: ответ строгий или свободный?</> })}</h2></div>
        <Mentor>{tr({ uz: "Temperature — javob qanchalik erkin bo'lishini belgilaydigan son, Gemini'da 0 dan 2 gacha. Bitta savolni — «Bizda qanday pitsalar bor?» — uch marta beramiz. Ikkala qiymatni navbat bilan bosib, javoblarni solishtiring.", ru: "Temperature — число, которое задаёт, насколько свободным будет ответ; в Gemini — от 0 до 2. Один вопрос — «Какие пиццы у нас есть?» — зададим три раза. Нажмите оба значения по очереди и сравните ответы." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            {seenLow
              ? <div className="sp-done fade-step"><span className="sp-done-ok">✓</span><span className="sp-done-t">{tr({ uz: '0.1 sinaldi', ru: "0.1 проверено" })}</span></div>
              : <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={seeLow}>{tr({ uz: "▶ 0.1 bilan so'rash", ru: "▶ Спросить с 0.1" })}</button>}
            {seenLow && <TgChat title={{ uz: 'AvtoPizza · temperature 0.1', ru: "AvtoPizza · temperature 0.1" }} minH={0}>{DIAL_REPLIES.low.map((r, i) => <Bubble from="bot" key={`l${i}`}>{tr(r)}</Bubble>)}</TgChat>}
          </Col>
          <Col>
            {seenLow && (seenHigh
              ? <div className="sp-done fade-step"><span className="sp-done-ok">✓</span><span className="sp-done-t">{tr({ uz: '1.5 sinaldi', ru: "1.5 проверено" })}</span></div>
              : <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} onClick={seeHigh}>{tr({ uz: "▶ 1.5 bilan so'rash", ru: "▶ Спросить с 1.5" })}</button>)}
            {seenHigh && <TgChat title={{ uz: 'AvtoPizza · temperature 1.5', ru: "AvtoPizza · temperature 1.5" }} minH={0}>{DIAL_REPLIES.high.map((r, i) => <Bubble from="bot" key={`h${i}`}>{tr(r)}</Bubble>)}</TgChat>}
          </Col>
        </div></Zoomable>
        {bothSeen && <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p className="q-lbl">{tr({ uz: 'Menyuni har safar bir xil va aniq aytish kerak. Qaysi temperature mos?', ru: "Меню нужно каждый раз называть одинаково и точно. Какая temperature подходит?" })}</p>
          <div className="dial-row">
            <button className={`dial-btn ${choice === 'low' ? 'on' : ''}`} disabled={choice !== null} onClick={() => pick('low')}>{tr({ uz: 'Past (0.1)', ru: "Низкая (0.1)" })}</button>
            <button className={`dial-btn ${choice === 'high' ? 'on' : ''}`} disabled={choice !== null} onClick={() => pick('high')}>{tr({ uz: 'Baland (1.5)', ru: "Высокая (1.5)" })}</button>
          </div>
          <AchRule screen={screen} once />
          {done && choice === 'low' && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Past temperature'da javob deyarli bir xil chiqadi — menyu uchun shu mos.", ru: "При низкой temperature ответ получается почти одинаковым — для меню подходит она." })}</p></div>}
          {done && choice === 'high' && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Baland temperature'da javob har safar o'zgaradi.", ru: "При высокой temperature ответ каждый раз меняется." })}</p></div>}
        </div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TEST 3 =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    questionText="Temperature baland qilib qo'yilsa, nima bo'ladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <><span className="mono" style={{ color: T.accent }}>Temperature</span> baland qilib qo'yilsa, nima bo'ladi?</>, ru: <>Что будет, если <span className="mono" style={{ color: T.accent }}>temperature</span> поставить высокой?</> })}</h2></>}
    options={[tr({ uz: 'AI javobni ancha tezroq yozib beradi', ru: "ИИ будет писать ответ заметно быстрее" }), tr({ uz: 'Javoblar har safar aynan bir xil chiqadi', ru: "Ответы каждый раз будут точно одинаковыми" }), tr({ uz: "Bot internetni ancha ko'proq sarflaydi", ru: "Бот будет тратить заметно больше интернета" }), tr({ uz: "Javoblar har safar boshqacha bo'lishi mumkin", ru: "Ответы каждый раз могут быть разными" })]} correctIdx={3}
    explainCorrect={tr({ uz: "Baland temperature'da javoblar har safar boshqacha bo'lishi mumkin.", ru: "При высокой temperature ответы каждый раз могут быть разными." })}
    explainWrong={{
      0: tr({ uz: "Tezlikka aloqasi yo'q — temperature javob qanchalik erkin bo'lishini belgilaydi.", ru: "Со скоростью это не связано — temperature задаёт, насколько свободным будет ответ." }),
      1: tr({ uz: "Aksincha: bir xil javob past temperature'da bo'ladi.", ru: "Наоборот: одинаковые ответы бывают при низкой temperature." }),
      2: tr({ uz: "Internet sarfiga aloqasi yo'q — temperature faqat javob matniga ta'sir qiladi.", ru: "С расходом интернета это не связано — temperature влияет только на текст ответа." }),
      default: tr({ uz: 'Baland temperature — xilma-xil javob.', ru: "Высокая temperature — разнообразные ответы." })
    }} />
);

// ===== SCREEN 11 — MARKAZIY #4: FAKTNI TEKSHIRISH (gaplar navbat bilan; belgilangach menyudagi mos qatorga chiziq chiziladi) =====
const MENU_REAL = [{ uz: "Margarita — 35 000 so'm", ru: "Маргарита — 35 000 сумов" }, { uz: "Pepperoni — 42 000 so'm", ru: "Пепперони — 42 000 сумов" }, { uz: "To'rt pishloq — 48 000 so'm", ru: "Четыре сыра — 48 000 сумов" }];
const MENU_ROWS = MENU_REAL.map(m => ({ n: { uz: m.uz.split(' — ')[0], ru: m.ru.split(' — ')[0] }, p: { uz: m.uz.split(' — ')[1], ru: m.ru.split(' — ')[1] } })); // jadval ustunlari (F-1002-96)
const CLAIMS = [
  { id: 'c1', text: { uz: "Margarita — 35 000 so'm", ru: "Маргарита — 35 000 сумов" }, real: true, menu: 0 },
  { id: 'c2', text: { uz: "Ananasli pitsa — 30 000 so'm", ru: "Пицца с ананасом — 30 000 сумов" }, real: false, menu: null },
  { id: 'c3', text: { uz: "Pepperoni — 42 000 so'm", ru: "Пепперони — 42 000 сумов" }, real: true, menu: 1 }
];
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [answers, setAnswers] = useState(() => storedAnswer ? (storedAnswer.claimAnswers || { c1: true, c2: false, c3: true }) : {});
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const done = CLAIMS.every(c => answers[c.id] !== undefined);
  const allCorrect = CLAIMS.every(c => answers[c.id] === c.real);
  useEffect(() => { if (done && !fired.current) { fired.current = true; onAnswer(screen, { stage: 'central', screenIdx: screen, correct: allCorrect, picked: true, solved: true, claimAnswers: answers }); } }, [done, allCorrect]);
  const mark = (id, val) => { if (answers[id] !== undefined) return; const c = CLAIMS.find(x => x.id === id); if (c && val !== c.real && achMiss) achMiss.miss(screen); setAnswers(prev => ({ ...prev, [id]: val })); setSc(n => n + 1); };
  // Chiziq: belgilangan gap (o'ng cheti) → menyudagi mos qator (chap cheti); mos qator yo'q bo'lsa chiziq ham yo'q
  const boxRef = useRef(null);
  const claimRefs = useRef({});
  const bubRef = useRef(null); // chiziq pufak chetidan chiqadi (gap pufak ichida)
  const menuRefs = useRef([]);
  const [lines, setLines] = useState([]);
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const calc = () => {
      const b = box.getBoundingClientRect();
      setLines(CLAIMS.filter(c => answers[c.id] !== undefined && c.menu !== null).map(c => {
        const a = claimRefs.current[c.id];
        const m = menuRefs.current[c.menu];
        if (!a || !m) return null;
        const ra = a.getBoundingClientRect();
        const rm = m.getBoundingClientRect();
        const rb = bubRef.current ? bubRef.current.getBoundingClientRect() : ra;
        const x1 = rb.right - b.left, y1 = ra.top + ra.height / 2 - b.top, x2 = rm.left - b.left, y2 = rm.top + rm.height / 2 - b.top;
        const mx = (x1 + x2) / 2;
        return { id: c.id, d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}` };
      }).filter(Boolean));
    };
    calc();
    let t = 0;
    const later = () => { calc(); clearTimeout(t); t = setTimeout(calc, 360); };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(later) : null;
    if (ro) ro.observe(box);
    window.addEventListener('resize', later);
    return () => { clearTimeout(t); if (ro) ro.disconnect(); window.removeEventListener('resize', later); };
  }, [answers]);
  const curIdx = CLAIMS.findIndex(c => answers[c.id] === undefined);
  return (
    <Stage eyebrow={{ uz: 'Markaziy · faktni tekshirish', ru: "Ключевое · проверка фактов" }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : tr({ uz: `Har gapni tekshiring (${Object.keys(answers).length}/3)`, ru: `Проверьте каждое утверждение (${Object.keys(answers).length}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Faktni</span> tekshiring.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>факты</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "AI menyu haqida uchta gap aytdi. Har birini haqiqiy menyu bilan solishtiring — buni inglizcha fact-checking deyishadi.", ru: "ИИ сказал о меню три вещи. Сверьте каждую с настоящим меню — по-английски это называют fact-checking." })}</Mentor>
        <Zoomable>
          <div className="ckbox" ref={boxRef}>
            <svg className="ck-svg" aria-hidden="true">{lines.map(l => <path key={l.id} className="ck-line" d={l.d} pathLength="1" />)}</svg>
            <div className="ck-col">
              <div className="ck-ai">
                <span className="ck-ava" aria-hidden="true">AI</span>
                <div className="ck-bub" ref={bubRef}>
                  <p className="ck-bub-h">{tr({ uz: 'Bizda bor:', ru: 'У нас есть:' })}</p>
                  {CLAIMS.map((c, i) => {
                    const a = answers[c.id];
                    const isDone = a !== undefined;
                    if (!isDone && i !== curIdx) return null;
                    const okMark = isDone && a === c.real;
                    return (
                      <div key={c.id} ref={el => { claimRefs.current[c.id] = el; }} className={`claim-row ${isDone ? (okMark ? 'ok done' : 'bad done') : 'cur fade-step'}`}>
                        <span className="claim-txt">{tr(c.text)}</span>
                        {isDone && <span className={`ck-stamp ${c.real ? 'ok' : 'bad'}`}>{c.real ? tr({ uz: '✓ Rost', ru: '✓ Правда' }) : tr({ uz: "✗ To'qib chiqarilgan", ru: '✗ Выдумано' })}</span>}
                        {!isDone && <span className="claim-btns">
                          <button className="claim-btn pick" onClick={() => mark(c.id, true)}>{tr({ uz: 'Rost', ru: "Правда" })}</button>
                          <button className="claim-btn pick" onClick={() => mark(c.id, false)}>{tr({ uz: "To'qib chiqarilgan", ru: "Выдумано" })}</button>
                        </span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="ck-col">
              <div className="ck-db">
                <div className="ck-db-hd"><span>menyu · PostgreSQL</span><span>{tr({ uz: '3 qator', ru: '3 строки' })}</span></div>
                <table className="ck-tbl"><tbody>
                  {MENU_ROWS.map((m, i) => { const hit = CLAIMS.some(c => c.menu === i && answers[c.id] !== undefined); return <tr key={i} ref={el => { menuRefs.current[i] = el; }} className={hit ? 'hit' : ''}><td>{tr(m.n)}</td><td>{tr(m.p)}</td></tr>; })}
                </tbody></table>
                {answers.c2 !== undefined && <div className="ck-none fade-step">{tr({ uz: "«Ananasli pitsa» — bazada bunday qator yo'q", ru: '«Пицца с ананасом» — такой строки в базе нет' })}</div>}
              </div>
            </div>
          </div>
        </Zoomable>
        <AchRule screen={screen} once />
        {done && (allCorrect
          ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "«Ananasli pitsa» menyuda yo'q — AI to'qib chiqardi. Bu hallutsinatsiya: ishonch bilan aytilgan yolg'on.", ru: "«Пиццы с ананасом» нет в меню — ИИ её выдумал. Это галлюцинация: уверенно сказанная неправда." })}</p></div>
          : <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "«Ananasli pitsa» menyuda yo'q — AI uni to'qib chiqardi.", ru: "«Пиццы с ананасом» нет в меню — ИИ её выдумал." })}</p></div>)}
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — HAYOTIY: AVTOPIZZA SUHBATI (o'ngda — AI'ga har so'rovda nima boradi) =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const STEPS = [
    { u: { uz: 'Salom! Juda ochman, nima tavsiya qilasiz?', ru: "Привет! Очень хочу есть, что посоветуете?" }, b: { uz: "Salom! Menyudan Pepperoni'ni tavsiya qilaman — go'shtli va to'yimli. Yoki klassik Margarita?", ru: "Здравствуйте! Из меню советую Пепперони — мясная и сытная. Или классическую Маргариту?" } },
    { u: { uz: 'Achchiq narsani yoqtirmayman', ru: "Острое я не люблю" }, b: { uz: 'Unda Margarita sizga mos: achchiq emas, yumshoq pishloqli. Buyurtma qilamizmi?', ru: "Тогда вам подойдёт Маргарита: не острая, с мягким сыром. Оформляем заказ?" } },
    { u: { uz: 'Ha, bittasini olaman', ru: 'Да, возьму одну' }, b: { uz: "Ajoyib! Margarita — 35 000 so'm. Manzilingizni yuboring, buyurtmani rasmiylashtiramiz.", ru: "Отлично! Маргарита — 35 000 сумов. Пришлите адрес, и мы оформим заказ." } }
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
  const REQ_IN = [
    { k: { uz: 'System prompt', ru: "System prompt" }, v: { uz: "«Sen AvtoPizza do'konining yordamchisisan. Qisqa, samimiy, aniq gapir. Faqat menyu va buyurtma haqida gaplash.»", ru: "«Ты — помощник магазина AvtoPizza. Говори коротко, дружелюбно, чётко. Говори только о меню и заказах.»" } },
    { k: { uz: 'Menyu (bazadan)', ru: "Меню (из базы)" }, v: { uz: MENU_REAL.map(m => m.uz).join(' · '), ru: MENU_REAL.map(m => m.ru).join(' · ') } },
    { k: { uz: 'Suhbat tarixi', ru: "История диалога" }, v: { uz: 'shu suhbatdagi oldingi xabarlar', ru: "предыдущие сообщения этого разговора" } }
  ];
  return (
    <Stage eyebrow={{ uz: 'Hayotiy · AvtoPizza', ru: "Из жизни · AvtoPizza" }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : tr({ uz: `Suhbatni davom ettiring (${shown}/3)`, ru: `Продолжите разговор (${shown}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AvtoPizza boti AI bilan: <span className="italic" style={{ color: T.accent }}>buyurtmagacha bitta suhbat</span>.</>, ru: <>Бот AvtoPizza с ИИ: <span className="italic" style={{ color: T.accent }}>один разговор до заказа</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Suhbatni qadam-baqadam oching. O'ng tomonda — AI'ga har so'rovda nima borishi.", ru: "Открывайте разговор шаг за шагом. Справа — что уходит в ИИ при каждом запросе." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <TgChat title={{ uz: 'AvtoPizza', ru: "AvtoPizza" }} minH={200}>
              {STEPS.slice(0, shown).map((s, i) => (
                <React.Fragment key={i}>
                  <Bubble from="user">{tr(s.u)}</Bubble>
                  <Bubble from="bot">{tr(s.b)}</Bubble>
                </React.Fragment>
              ))}
              {phase === 'think' && <Bubble from="bot" thinking />}
            </TgChat>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done || phase === 'think'} onClick={advance}>{done ? tr({ uz: '✓ Buyurtma qabul qilindi', ru: "✓ Заказ принят" }) : shown === 0 ? tr({ uz: '▶ Suhbatni boshlash', ru: "▶ Начать разговор" }) : tr({ uz: 'Keyingi savol →', ru: 'Следующий вопрос →' })}</button>
          </Col>
          <Col>
            <div className="sk-info">
              <p className="note-h">{tr({ uz: "So'rov ichida", ru: "Внутри запроса" })}</p>
              {REQ_IN.map((r, i) => <p key={i} className="body req-ln"><b>{tr(r.k)}:</b> {tr(r.v)}</p>)}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "«Bittasini» Margarita ekanini AI suhbat tarixidan bildi. Narx esa AI'dan emas, bazadagi menyudan olindi.", ru: "Что «одну» — это Маргарита, ИИ понял из истории диалога. А цена взята не у ИИ, а из меню в базе." })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — AI BOTGA QANDAY ULANADI (soddalashtirilgan kod + 2 qisqa karta) =====
const AI_CODE = [
  ['', { uz: "// /start va «Menyu» — oddiy handlerlar. Qolgan erkin savol — AI'ga:", ru: "// /start и «Меню» — обычные handler-ы. Остальные свободные вопросы — в ИИ:" }],
  ["bot.on('text', async (ctx) => {", null],
  ['  const tarix = await suhbatTarixi(ctx.from.id) ', { uz: '// bazadan: oldingi xabarlar', ru: "// из базы: предыдущие сообщения" }],
  ['  const javob = await soraAI({', null],
  ['    systemPrompt,             ', { uz: '// kim · qanday · nima haqida + menyu', ru: "// кто · как · о чём + меню" }],
  ['    tarix,', null],
  ['    xabar: ctx.message.text,', null],
  ['    temperature: 0.2,', null],
  ['  })', null],
  ['  await ctx.reply(javob)', null],
  ['})', null]
];
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  return (
    <Stage eyebrow={{ uz: 'Amalda · AI API', ru: "На практике · AI API" }} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Kodni o'qing", ru: "Прочитайте код" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI botga <span className="italic" style={{ color: T.accent }}>qanday ulanadi</span>?</>, ru: <>Как ИИ <span className="italic" style={{ color: T.accent }}>подключается к боту</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bot AI bilan AI API orqali gaplashadi — Telegram bilan Bot API orqali gaplashgani kabi. Kodni ko'rib chiqing.", ru: "Бот общается с ИИ через AI API — так же, как с Telegram через Bot API. Посмотрите код." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="code-win">
              <div className="code-win-h">{tr({ uz: 'bot.js · soddalashtirilgan', ru: "bot.js · упрощённо" })}</div>
              <pre className="code-win-pre">{AI_CODE.map(([c, cm], i) => { const hang = c.length - c.trimStart().length + 2; return <span key={i} className="cw-l" style={{ paddingLeft: hang + 'ch', textIndent: -hang + 'ch' }}>{c}{cm && <Cm>{tr(cm)}</Cm>}</span>; })}</pre>
            </div>
            <p className="desk-cap" style={{ margin: 0 }}>{fmtCode(tr({ uz: '`suhbatTarixi` va `soraAI` — loyiha kunida AI yordamida yozadigan funksiyalaringiz.', ru: "`suhbatTarixi` и `soraAI` — функции, которые вы напишете с помощью ИИ на проектном дне." }))}</p>
          </Col>
          <Col>
            <div className="sk-info"><p className="note-h">{tr({ uz: 'AI API kaliti — .env faylida', ru: "Ключ AI API — в файле .env" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Kodda faqat <span className="mono">process.env.AI_API_KEY</span> turadi.</>, ru: <>В коде стоит только <span className="mono">process.env.AI_API_KEY</span>.</> })}</p></div>
            <div className="sk-info"><p className="note-h">{tr({ uz: "Har so'rov hisobga olinadi", ru: "Каждый запрос учитывается" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'AI API odatda matn hajmiga qarab haq oladi, shuning uchun oddiy ishlarni handler bajaradi.', ru: "AI API обычно берёт плату за объём текста, поэтому простые задачи выполняет handler." })}</p></div>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done} onClick={() => { setDone(true); setSc(n => n + 1); }}>{done ? tr({ uz: '✓ Tushundim', ru: '✓ Понятно' }) : tr({ uz: 'Tushundim ✓', ru: 'Понятно ✓' })}</button>
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — TEST 4 =====
const Screen14 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    questionText="AI «Bizda ananasli pitsa bor» deb yozdi. Nima qilish kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите правильный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>AI <span className="italic" style={{ color: T.accent }}>«Bizda ananasli pitsa bor»</span> deb yozdi. Nima qilish kerak?</>, ru: <>ИИ написал: <span className="italic" style={{ color: T.accent }}>«У нас есть пицца с ананасом»</span>. Что нужно сделать?</> })}</h2></>}
    options={[tr({ uz: 'Ishonib, mijozga shundayligicha yuborish', ru: "Поверить и отправить клиенту как есть" }), tr({ uz: "Menyu bilan solishtirib, tekshirib ko'rish", ru: "Сверить с меню и проверить" }), tr({ uz: "Mijozdan savolni qaytadan yozishni so'rash", ru: "Попросить клиента переписать вопрос" }), tr({ uz: 'Botni to\'xtatib, qayta ishga tushirish', ru: "Остановить бота и запустить заново" })]} correctIdx={1}
    explainCorrect={tr({ uz: "AI menyuda yo'q narsani ham aytishi mumkin — narx va nomni menyu bilan solishtiring.", ru: "ИИ может назвать и то, чего нет в меню, — сверяйте цену и название с меню." })}
    explainWrong={{
      0: tr({ uz: "Tekshirmasdan yuborish xavfli: mijoz menyuda yo'q pitsani buyurtma qiladi.", ru: "Отправлять без проверки опасно: клиент закажет пиццу, которой нет в меню." }),
      2: tr({ uz: 'Muammo mijozning savolida emas, AI javobida. Javob menyu bilan tekshiriladi.', ru: "Проблема не в вопросе клиента, а в ответе ИИ. Ответ сверяют с меню." }),
      3: tr({ uz: "Qayta ishga tushirish javobni to'g'rilamaydi — AI yana shunday yozishi mumkin.", ru: "Перезапуск не исправит ответ — ИИ может снова написать так же." }),
      default: tr({ uz: 'AI javobidagi narx va taomni menyu bilan solishtiring.', ru: "Сверяйте цену и блюдо из ответа ИИ с меню." })
    }} />
);

// ===== SCREEN 15 — YAKUNIY: HANDLER AI BILAN ISHLASH TARTIBI (id va to'g'ri tartib o'zgarmaydi — ball kaliti) =====
const SAFE_CYCLE = [
  { id: 'instruct', label: { uz: 'Mijoz xabari keladi', ru: "Приходит сообщение клиента" } },
  { id: 'dial', label: { uz: "Xabarga system prompt va suhbat tarixi qo'shiladi", ru: "К сообщению добавляются system prompt и история диалога" } },
  { id: 'ask', label: { uz: 'AI API javob yozadi', ru: "AI API пишет ответ" } },
  { id: 'check', label: { uz: 'Javob menyu bilan tekshiriladi', ru: "Ответ сверяется с меню" } },
  { id: 'note', label: { uz: 'Javob yuboriladi va tarixga yoziladi', ru: "Ответ отправляется и записывается в историю" } }
];
const SAFE_CYCLE_ITEMS = SAFE_CYCLE.map(c => ({ id: c.id, label: { uz: `${c.label.uz}`, ru: `${c.label.ru}` } }));
const SAFE_CYCLE_ORDER = SAFE_CYCLE.map(c => c.id);
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [solved, setSolved] = useState(!!storedAnswer);
  const fired = useRef(!!storedAnswer);
  // Ball — birinchi TO'LIQ urinish (MCQ bilan bir xil o'lchov, 8-A): hamma katak to'lib tartib xato chiqsa — urinish xato
  const achMiss = useContext(AchMissCtx);
  const wrongEverRef = useRef(false);
  const [wrongOnce, setWrongOnce] = useState(false);
  const onWrong = () => { wrongEverRef.current = true; setWrongOnce(true); if (achMiss) achMiss.miss(screen); };
  const onSolved = () => { if (!fired.current) { fired.current = true; setSolved(true); const first = !wrongEverRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id)); onAnswer(screen, { stage: 'final', screenIdx: screen, question: 'Handler AI bilan qanday ishlashini tartibga soling', correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 }); } };
  const [recapOpen, setRecapOpen] = useState(false);
  return (
    <Stage eyebrow={{ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' }} screen={screen} scrollSignal={solved ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!solved} label={solved ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Tartibni yig'ing", ru: "Соберите порядок" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: AI bilan javob yo'lini <span className="italic" style={{ color: T.accent }}>tartibga</span> soling.</>, ru: <>Последний шаг: расставьте путь ответа с ИИ <span className="italic" style={{ color: T.accent }}>по порядку</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Mijoz AvtoPizza botiga erkin savol yozdi. Bo'laklarni sudrab to'g'ri tartibga qo'ying.", ru: "Клиент написал боту AvtoPizza свободный вопрос. Перетащите части в правильном порядке." })}</Mentor>
        <DragDropOrder
          items={SAFE_CYCLE_ITEMS}
          hints={[{ uz: '1-qadam', ru: "Шаг 1" }, { uz: '2-qadam', ru: "Шаг 2" }, { uz: '3-qadam', ru: "Шаг 3" }, { uz: '4-qadam', ru: "Шаг 4" }, { uz: '5-qadam', ru: "Шаг 5" }]}
          onSolved={onSolved}
          onWrong={onWrong}
        />
        {solved && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Tartib to'g'ri: <b>xabar → system prompt va tarix → AI javobi → tekshiruv → mijoz</b>. So'ng bot yana kutadi.</>, ru: <>✓ Порядок верный: <b>сообщение → system prompt и история → ответ ИИ → проверка → клиент</b>. Потом бот снова ждёт.</> })}</p></div>}
        {wrongOnce && RECAPS[screen] && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — взглянуть на тему ещё раз" })}</button>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas). id'lar o'zgarmaydi (saqlangan progress) — nom/tavsif MD v2 =====
const ACHIEVEMENTS = {
  ruleWriter:   { icon: '📜', name: 'Prompt Writer',     desc: { uz: 'AvtoPizza boti uchun system prompt yozdingiz', ru: "Вы написали system prompt для бота AvtoPizza" } },
  tableManager: { icon: '🪟', name: 'Context Keeper',    desc: { uz: "Oynadan chiqib ketadigan muhim ma'lumotni topdingiz", ru: "Вы нашли важные данные, которые выходят из окна" } },
  dialMaster:   { icon: '🎚️', name: 'Temperature Tuner', desc: { uz: "Menyu uchun to'g'ri temperature tanladingiz", ru: "Вы выбрали верную temperature для меню" } },
  factChecker:  { icon: '🔍', name: 'Fact Checker',      desc: { uz: "To'qib chiqarilgan pitsani menyu bilan tutdingiz", ru: "Вы поймали выдуманную пиццу, сверив с меню" } },
};
// Ekran id → nishon. ❗ FAQAT ma'noli, real-xato-imkonli ekranlar: s5 (system prompt builder — xato variant tanlansa
// `wrongEverRef` yonadi va `correct:false` ketadi) · s7 (kontekst oynasi — 3 nomzoddan noto'g'risini tanlash mumkin) ·
// s9 (temperature — Baland ham tanlanishi mumkin) · s11 (faktni tekshirish — gap noto'g'ri belgilanishi mumkin).
// Exploration/toggle ekranlarga BOG'LANMAYDI (ular har bosishda correct:true qaytaradi — nishon tekin bo'lmasin).
const ACH_TRIGGERS = { s5: 'ruleWriter', s7: 'tableManager', s9: 'dialMaster', s11: 'factChecker' };

// 🏅 151-qonun: amaliy topshiriq nishoni faqat BIRINCHI urinishga beriladi. Shart OLDINDAN aytiladi; birinchi urinish
// xato bo'lsa — jazosiz qisqa xabar (`once` — qayta urinishi yo'q ekran). Mentor ekranida, «Qaytadan» mashq-o'tishida va
// nishon olingach ko'rinmaydi. Matn — MATN_KORPUS §183; emojisiz shakl — A4 (MD v2 KOD 16).
const AchRule = ({ screen, once }) => {
  const earned = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || (gate.live && gate.live.mode === 'mentor') || (earned && earned.has(ach))) return null;
  const lost = am.missed.has(sid);
  return <p className={`ach-rule ${lost ? 'lost' : ''}`}>{lost
    ? (once ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок давался за первую попытку.' }) : tr({ uz: "Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.", ru: 'Значок давался за первую попытку — теперь спокойно найдите верный ответ.' }))
    : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: "Справитесь с первой попытки — значок ваш." })}</p>;
};

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
const Q_LABELS = { 4: { uz: '1 — Prompt', ru: "1 — Промпт" }, 8: { uz: '2 — Kontekst oynasi', ru: "2 — Окно контекста" }, 10: { uz: '3 — Temperature', ru: "3 — Temperature" }, 14: { uz: '4 — Faktni tekshirish', ru: "4 — Проверка фактов" }, 15: { uz: '5 — Handler tartibi', ru: "5 — Порядок handler-а" } };
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si (AI atamalari, emojisiz — A4)
const QZ_BG_SHAPES = [
  { ch: 'prompt',        l: 5,  t: 10, s: 32, d: 19, dl: 0 },
  { ch: 'AI',            l: 85, t: 8,  s: 32, d: 23, dl: 1.5 },
  { ch: 'system',        l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'temperature',   l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: '.env',          l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'kontekst oynasi', ru: "окно контекста" }, l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: { uz: 'baza', ru: "база" },        l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'AI API',        l: 55, t: 5,  s: 22, d: 22, dl: 0.6 },
  { ch: '✗',             l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '✓',             l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: { uz: 'hallutsinatsiya', ru: 'галлюцинация' }, l: 34, t: 62, s: 18, d: 29, dl: 3.4 },
  { ch: '0.1',           l: 2,  t: 30, s: 26, d: 28, dl: 3.1 },
  { ch: 'handler',       l: 60, t: 90, s: 20, d: 31, dl: 4.2 },
  { ch: { uz: 'suhbat tarixi', ru: "история диалога" }, l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3, mexanik ketma-ketlik yo'q).
// ✔ o'rinlari o'zgarmaydi (MD v2: 1·3·0·2·1·0·3·1·2·3·0·2) — faqat matn.
const QUIZ_BANK = [
  { q: { uz: 'AI\'ga system prompt berilmasa, u mijozga qanday javob beradi?', ru: "Как ИИ ответит клиенту, если ему не дали system prompt?" }, opts: [{ uz: 'Umuman javob bermay, jim qoladi', ru: "Совсем не ответит, промолчит" }, { uz: 'Umumiy, mavzudan chetga chiqqan javob', ru: "Общим ответом, который уходит от темы" }, { uz: "Faqat «tushunmadim» deb yozadi", ru: "Напишет только «не понял»" }, { uz: "Bot o'zi o'chib, qayta yonadi", ru: "Бот сам выключится и включится снова" }], correct: 1 },
  { q: { uz: 'System prompt nimani belgilaydi?', ru: "Что задаёт system prompt?" }, opts: [{ uz: "AI'ning javob yozish tezligini", ru: "Скорость, с которой ИИ пишет ответ" }, { uz: 'Botning rangi va shriftini', ru: "Цвет и шрифт бота" }, { uz: 'Server joylashgan shaharni', ru: "Город, где стоит сервер" }, { uz: "AI'ning xulqi va chegarasini", ru: "Поведение ИИ и его границы" }], correct: 3 },
  { q: { uz: 'Prompt nima?', ru: "Что такое промпт?" }, opts: [{ uz: "AI'ga yuboriladigan so'rov matni", ru: "Текст запроса, который отправляют ИИ" }, { uz: 'Botning xatolar jurnali', ru: "Журнал ошибок бота" }, { uz: "AI API'ning internet manzili", ru: "Интернет-адрес AI API" }, { uz: 'Telegram kanalining nomi', ru: "Название Telegram-канала" }], correct: 0 },
  { q: { uz: 'Kontekst oynasi nima?', ru: "Что такое окно контекста?" }, opts: [{ uz: "AI'ning javob yozish tezligi", ru: "Скорость, с которой ИИ пишет ответ" }, { uz: "Botning Telegram'dagi chat oynasi", ru: "Окно чата бота в Telegram" }, { uz: "AI bir so'rovda ko'radigan matn hajmi", ru: "Объём текста, который ИИ видит за один запрос" }, { uz: 'Bazadagi jadvallar soni', ru: "Количество таблиц в базе" }], correct: 2 },
  { q: { uz: "Suhbat tarixi oynaga sig'masa, qaysi xabar birinchi chiqib ketadi?", ru: "Какое сообщение выйдет первым, если история диалога не поместится в окно?" }, opts: [{ uz: 'Eng yangi xabar', ru: "Самое новое сообщение" }, { uz: 'Eng eski xabar', ru: "Самое старое сообщение" }, { uz: 'Eng qisqa xabar', ru: "Самое короткое сообщение" }, { uz: 'Tasodifiy bir xabar', ru: "Случайное сообщение" }], correct: 1 },
  { q: { uz: "Mijoz ismi yo'qolmasligi uchun bot nima qiladi?", ru: "Что делает бот, чтобы имя клиента не потерялось?" }, opts: [{ uz: "Ismni bazaga saqlab, promptga qo'shadi", ru: "Сохраняет имя в базу и добавляет в промпт" }, { uz: "Kontekst oynasini o'zi kattalashtiradi", ru: "Сам увеличивает окно контекста" }, { uz: "Temperature'ni pastroq qilib qo'yadi", ru: "Ставит temperature пониже" }, { uz: "AI'ni har safar qayta ishga tushiradi", ru: "Каждый раз перезапускает ИИ" }], correct: 0 },
  { q: { uz: "Temperature past bo'lsa (masalan, 0.1), javob qanday bo'ladi?", ru: "Каким будет ответ при низкой temperature (например, 0.1)?" }, opts: [{ uz: 'Har safar butunlay boshqacha', ru: "Каждый раз совсем другим" }, { uz: 'Har safar xato chiqadi', ru: "Каждый раз ошибочным" }, { uz: 'Juda uzun va batafsil', ru: "Очень длинным и подробным" }, { uz: "Qat'iy va deyarli bir xil", ru: 'Строгим и почти одинаковым' }], correct: 3 },
  { q: { uz: "Temperature baland bo'lsa (masalan, 1.5), menyu uchun nima noqulay?", ru: "Что неудобно для меню при высокой temperature (например, 1.5)?" }, opts: [{ uz: "Bot butunlay to'xtab qoladi", ru: "Бот полностью остановится" }, { uz: 'Javob har safar boshqacha chiqadi', ru: "Ответ каждый раз получается другим" }, { uz: 'Internet uzilib qoladi', ru: "Пропадёт интернет" }, { uz: "API kaliti oshkor bo'ladi", ru: "Раскроется ключ API" }], correct: 1 },
  { q: { uz: 'Menyuni har safar bir xil va aniq aytish kerak. Qaysi temperature mos?', ru: "Меню нужно каждый раз называть одинаково и точно. Какая temperature подходит?" }, opts: [{ uz: 'Baland (1.5)', ru: "Высокая (1.5)" }, { uz: "O'rtacha, xohlagancha", ru: 'Средняя, как получится' }, { uz: 'Past (0.1)', ru: "Низкая (0.1)" }, { uz: "Har so'rovda almashtirib", ru: "Менять при каждом запросе" }], correct: 2 },
  { q: { uz: "AI «Bizda ananasli pitsa bor» dedi, menyuda esa bunday pitsa yo'q. Bu nima?", ru: "ИИ сказал «У нас есть пицца с ананасом», а в меню такой пиццы нет. Что это?" }, opts: [{ uz: "To'g'ri javob, hammasi joyida", ru: "Верный ответ, всё в порядке" }, { uz: "Telegram Bot API'ning xatosi", ru: "Ошибка Telegram Bot API" }, { uz: "API kalitining oshkor bo'lishi", ru: "Раскрытие ключа API" }, { uz: 'Hallutsinatsiya, tekshirish kerak', ru: "Галлюцинация, нужно проверить" }], correct: 3 },
  { q: { uz: 'AI javobidagi narxni qachon tekshirish kerak?', ru: "Когда нужно проверять цену в ответе ИИ?" }, opts: [{ uz: 'Mijozga yuborishdan oldin', ru: "Перед отправкой клиенту" }, { uz: 'Hech qachon, AI adashmaydi', ru: "Никогда, ИИ не ошибается" }, { uz: "Faqat temperature past bo'lsa", ru: "Только при низкой temperature" }, { uz: 'Faqat mijoz shikoyat qilsa', ru: "Только если клиент пожалуется" }], correct: 0 },
  { q: { uz: 'AI API kaliti qayerda saqlanadi?', ru: "Где хранится ключ AI API?" }, opts: [{ uz: 'bot.js kodining ichida, ochiq holda', ru: "Внутри кода bot.js, открыто" }, { uz: 'Mijozga chatda yuboriladi', ru: "Отправляется клиенту в чат" }, { uz: '.env faylida, kodda emas', ru: "В файле .env, а не в коде" }, { uz: 'Telegram profil sozlamasida', ru: "В настройках профиля Telegram" }], correct: 2 },
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
    const TOK = ['prompt', 'AI_API_KEY', '.env', 'system prompt', 'soraAI()', 'ctx.reply', 'temperature', 'tarix', '↻', 'AI API'];
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
  // Javob ochilgach keyingi savolga avto o'tish (F-0922-03). Soat faqat MENTOR
  // brauzerida; o'quvchilar server orqali ergashadi. Oxirgi savolda avto YO'Q —
  // «G'oliblarni e'lon qilish» mentorning daqiqasi.
  const autoNext = useAutoNext({
    on: phase === 'reveal' && isMentor && !solo && !lastQ,
    onFire: () => ctrl('q', qi + 1),
    qKey: qi,
  });
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
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме практики' })}</button>
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
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl('done', qi) : autoNext.fireNow()}>{lastQ ? tr({ uz: "🏁 G'oliblarni e'lon qilish", ru: '🏁 Объявить победителей' }) : tr({ uz: 'Keyingi savol →', ru: 'Следующий вопрос →' })}</button>}
          {isMentor && !lastQ && <button className="qz-btn ghost qz-auto" onClick={autoNext.auto ? autoNext.pause : autoNext.resume} title={tr({ uz: "Avto o'tishni to'xtatish — javobni tushuntirish uchun (arena oxirigacha)", ru: 'Остановить авто-переход — чтобы объяснить ответ (до конца арены)' })}>{autoNext.auto ? `${tr({ uz: "To'xtatish", ru: 'Пауза' })}${autoNext.sec ? ` · ${autoNext.sec}` : ''}` : tr({ uz: '▶ Avto', ru: '▶ Авто' })}</button>}
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">✓</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{tr({ uz: `${total}/${total} atama yodlandi`, ru: `${total}/${total} терминов запомнено` })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda · ", ru: '↻ Учим · ' })}<b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim · ', ru: '✓ Знаю · ' })}<b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span></div>
          <div className="fc-face fc-back">{fcAnswer(tr(card.back))}{card.note && <span className="fc-note">{tr(card.note)}</span>}</div>
        </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : (<p className="fc-hint" />)}
    </div>
  );
}

// PRAKTIKA — o'quvchi gemini.google.com'da o'z system prompt'ini sinaydi (mentor-gate, kod kiritilmaydi)
// ===== AMALIYOT BLOKI — repo `TelegramBotNest` ustida (F-1002-114; 5/7/9-dars ScreenBlok qolipi, shu faylning o'zida to'liq) =====
// 4 qadam: ochish → prompt («Nusxalash», {…} joylar) → ishga tushirish → Telegramda tekshirish. O'ngda kutilgan natija (chat). Qulf — bittadan «Bajardim».
const _blkT = (x) => ((x && typeof x === 'object' && !React.isValidElement(x)) ? (x.uz ?? '') : x);
const BlkBtns = ({ items }) => <div className="ab-btns el-in">{items.map((b, i) => <span key={i} className="ab-btn">{tr(b)}</span>)}</div>;
const CodeLines = ({ lines }) => <pre className="ab-code">{lines.map((l, i) => <span key={i}><span className="ab-code-p">$</span> {l}{'\n'}</span>)}</pre>;
function PromptBox({ lines, who }) {
  const [copied, setCopied] = useState(false);
  const plain = lines.map(l => tr(l)).join('\n');
  const copy = async () => { try { await navigator.clipboard.writeText(plain); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  const slot = (t) => t.split(/(\{[^}]+\})/g).map((p, i) => (/^\{.+\}$/.test(p) ? <span key={i} className="ab-slot">{p}</span> : p));
  return (
    <div className="ab-prompt">
      <div className="ab-prompt-h"><span className="ab-who">{tr(who || { uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span><button className="ab-copy" onClick={copy}>{copied ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></div>
      {lines.map((l, i) => { const t = String(tr(l)); return <p key={i} className={`ab-line ${/^[|#]/.test(t) ? 'mono' : ''}`}>{slot(t)}</p>; })}
    </div>
  );
}
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, chat, chatLabel, doneText, tail }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  const [stepN, setStepN] = useState(() => (storedAnswer && storedAnswer.solved ? steps.length : 0));
  const complete = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: _blkT(title), solved: true, correct: true, picked: true });
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); // 500+ zona — faqat mentor ko'radi
  };
  const markStep = () => { if (isMentorLive) return; const n = Math.min(stepN + 1, steps.length); setStepN(n); if (n >= steps.length) complete(); };
  const undo = (i) => { if (done || isMentorLive) return; setStepN(i); };
  const visibleN = isMentorLive ? steps.length : Math.min(stepN + 1, steps.length);
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr(mentor)}</Mentor>
        <div className="split">
          <Col>
            <div className="lp-steps fade-up delay-1">
              {steps.slice(0, visibleN).map((c, i) => {
                const on = i < stepN && !isMentorLive;
                if (on) return (
                  <div key={i} className="lp-step on ab-on">
                    <span className="lp-check">✓</span>
                    <span className="lp-step-t one"><b>{tr(c.h)}</b></span>
                    {!done && <button className="lp-undo" onClick={() => undo(i)} title={tr({ uz: 'Qaytarish', ru: "Вернуть" })} aria-label={tr({ uz: 'Qaytarish', ru: "Вернуть" })}>↻</button>}
                  </div>
                );
                return (
                  <div key={i} className="lp-step ab-cur el-in">
                    <span className="lp-check">{i + 1}</span>
                    <div className="lp-step-body">
                      <span className="lp-step-t"><b>{tr(c.h)}</b> — {fmtCode(tr(c.t))}</span>
                      {c.code && <CodeLines lines={c.code} />}
                      {c.prompt && <PromptBox lines={c.prompt} who={c.who} />}
                      {c.err && <p className="ab-err">{fmtCode(tr(c.err))}</p>}
                      {!isMentorLive && <button className="btn lp-step-btn" onClick={markStep}>{tr({ uz: 'Bajardim', ru: "Готово" })}</button>}
                    </div>
                  </div>
                );
              })}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{fmtCode(tr(doneText))}</p></div>}
            <MentorPracticeStats live={_live} screen={screen} />
          </Col>
          <Col>
            <p className="flow-label">{tr(chatLabel || { uz: 'kutilgan natija · namuna: AvtoPizza', ru: 'ожидаемый результат · пример: AvtoPizza' })}</p>
            <TgChat minH={0}>{chat.map((m, i) => <React.Fragment key={i}><Bubble from={m.from}>{m.muted ? <span className="ab-muted">{tr(m.t)}</span> : tr(m.t)}</Bubble>{m.btns && <BlkBtns items={m.btns} />}</React.Fragment>)}</TgChat>
            <p className="ab-tail">{tr({ uz: 'Ortda qoldingizmi — mentor bilan', ru: 'Отстали — вместе с ментором' })} <code className="qcode">{tail}</code></p>
          </Col>
        </div>
      </div>
    </Stage>
  );
}
const ScreenBotPractice = (props) => (
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot · Gemini', ru: 'Практика · Gemini' }} tail="git checkout -f dars-06-done"
    title={{ uz: <>Botingiz erkin savolga javob bersin: <span className="italic" style={{ color: T.accent }}>Gemini</span>.</>, ru: <>Пусть бот отвечает на свободный вопрос: <span className="italic" style={{ color: T.accent }}>Gemini</span>.</> }}
    mentor={{ uz: <>System prompt'ni gemini.google.com'da sinab ko'rdingiz — endi u botning ichiga kiradi; <b style={{ color: T.ink }}>«1 · Kalit»</b>dan boshlang.</>, ru: <>System prompt вы проверили на gemini.google.com — теперь он попадёт внутрь бота; начните с <b style={{ color: T.ink }}>«1 · Ключ»</b>.</> }}
    steps={[
      { h: { uz: 'Kalit', ru: 'Ключ' }, t: { uz: "aistudio.google.com → «Get API key» → Create → nusxalang → `.env` ga `GEMINI_API_KEY=` (chatga, skrinshotga emas).", ru: "aistudio.google.com → «Get API key» → Create → скопируйте → в `.env` как `GEMINI_API_KEY=` (не в чат и не на скриншот)." } },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "qavsga o'z system prompt'ingizni qo'ying, «Nusxalash», Antigravity'ga.", ru: "в скобки подставьте свой system prompt, «Скопировать», в Antigravity." }, prompt: [
        { uz: "src/api/ai/system-prompt.ts yarat: SYSTEM_PROMPT = «{sen kimsan, qanday gapirasan, faqat nima haqida}» + menyu/ma'lumotlaring.", ru: "Создай src/api/ai/system-prompt.ts: SYSTEM_PROMPT = «{кто ты, как говоришь, только о чём}» + меню/твои данные." },
        { uz: "AiService (@google/genai, model gemini-2.5-flash, systemInstruction: SYSTEM_PROMPT, temperature 0.4); kalit bo'lmasa null qaytarsin.", ru: "AiService (@google/genai, модель gemini-2.5-flash, systemInstruction: SYSTEM_PROMPT, temperature 0.4); если ключа нет — возвращает null." },
        { uz: "bot.on('text') da holat tayyor bo'lsa — AI javobi; null bo'lsa eski «Bu buyruqni bilmayman». Ism so'rash va menyu o'zgarmasin.", ru: "В bot.on('text') при holat = tayyor — ответ ИИ; если null — старое «Bu buyruqni bilmayman». Запрос имени и меню не меняются." }
      ] },
      { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: { uz: 'terminal xatosiz, «Telegram bot ulandi».', ru: 'терминал без ошибок, «Telegram bot ulandi».' }, err: { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: "Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»" } },
      { h: { uz: 'Telegramda tekshirish', ru: 'Проверить в Telegram' }, t: { uz: "mavzuga oid savol → javob system prompt'ga mos; mavzudan tashqari («Ertaga ob-havo?») → chegarada qoladi; narx so'rang → o'z menyungiz bilan solishtiring (mos kelmasa — hallutsinatsiya, system prompt'ga menyuni aniqroq yozing).", ru: "вопрос по теме → ответ по system prompt; не по теме («Какая завтра погода?») → остаётся в рамках; спросите цену → сверьте со своим меню (не совпало — галлюцинация, впишите меню в system prompt точнее)." } }
    ]}
    chat={[
      { from: 'user', t: { uz: "Achchiq bo'lmagani qaysi?", ru: 'Какая не острая?' } },
      { from: 'bot', t: { uz: "Margarita va Pishloqli achchiq emas. Margarita — 45 000 so'm. Tanlaysizmi? /menu", ru: "Margarita и Pishloqli не острые. Margarita — 45 000 сумов. Выбираете? /menu" } },
      { from: 'user', t: { uz: 'Ertaga ob-havo qanday?', ru: 'Какая завтра погода?' } },
      { from: 'bot', t: { uz: 'Men faqat AvtoPizza haqida yordam beraman 🙂 Pitsa tanlaysizmi?', ru: 'Я помогаю только по AvtoPizza 🙂 Выберете пиццу?' } }
    ]}
    doneText={{ uz: "AI botning ichida. Nima deyishini system prompt'ingiz belgilaydi.", ru: "ИИ внутри бота. Что он говорит — решает ваш system prompt." }} />
);

// FLASHCARD KARTALARI — 12 atama (MD v2)
const BOT_FLASHCARDS = [
  { front: { uz: "AI'ga yuboriladigan so'rov matni nima deyiladi?", ru: "Как называется текст запроса, который отправляют ИИ?" }, back: { uz: 'Prompt', ru: "Промпт" }, note: { uz: 'Aniq prompt — foydali javob', ru: "Точный промпт — полезный ответ" } },
  { front: { uz: "AI'ga u kim ekanini, qanday va nima haqida gapirishini aytadigan doimiy ko'rsatma nima?", ru: "Как называется постоянное указание, которое говорит ИИ, кто он, как и о чём ему говорить?" }, back: { uz: 'System prompt', ru: "System prompt" }, note: { uz: "Har so'rovdan oldin beriladi: kim · qanday · nima haqida", ru: "Передаётся перед каждым запросом: кто · как · о чём" } },
  { front: { uz: "Bot AI'ga qo'shib yuboradigan oldingi xabarlar nima deyiladi?", ru: "Как называются прошлые сообщения, которые бот добавляет к запросу в ИИ?" }, back: { uz: 'Suhbat tarixi', ru: "История диалога" }, note: { uz: "AI API oldingi so'rovni o'zi eslamaydi", ru: "AI API сам не помнит прошлый запрос" } },
  { front: { uz: "AI bir so'rovda ko'ra oladigan matn hajmi nima deyiladi?", ru: "Как называется объём текста, который ИИ может увидеть за один запрос?" }, back: { uz: 'Kontekst oynasi', ru: "Окно контекста" }, note: { uz: 'Katta, lekin cheksiz emas', ru: "Большое, но не бесконечное" } },
  { front: { uz: "Tarix oynaga sig'masa, qaysi xabar birinchi chiqib ketadi?", ru: "Какое сообщение выходит первым, если история диалога не помещается в окно?" }, back: { uz: 'Eng eski xabar', ru: 'Самое старое сообщение' }, note: { uz: "AI uni endi ko'rmaydi", ru: "ИИ его больше не видит" } },
  { front: { uz: "Ism, manzil kabi muhim ma'lumot yo'qolmasligi uchun qayerda saqlanadi?", ru: "Где хранят важные данные, например имя и адрес, чтобы они не потерялись?" }, back: { uz: 'Bazada', ru: "В базе" }, note: { uz: "Har so'rovda system prompt'ga qo'shiladi", ru: "При каждом запросе добавляются в system prompt" } },
  { front: { uz: "Javob qanchalik erkin bo'lishini qaysi sozlama belgilaydi?", ru: "Какая настройка задаёт, насколько свободным будет ответ?" }, back: { uz: 'Temperature', ru: "Temperature" }, note: { uz: "Gemini'da 0 dan 2 gacha", ru: "В Gemini — от 0 до 2" } },
  { front: { uz: "Temperature past bo'lsa, javob qanday bo'ladi?", ru: "Каким будет ответ при низкой temperature?" }, back: { uz: 'Deyarli bir xil', ru: "Почти одинаковым" }, note: { uz: "Menyu, narx kabi aniq ma'lumot uchun", ru: "Для точных данных, например меню и цен" } },
  { front: { uz: "Temperature baland bo'lsa, javob qanday bo'ladi?", ru: "Каким будет ответ при высокой temperature?" }, back: { uz: 'Xilma-xil', ru: "Разнообразным" }, note: { uz: "Ijodiy matn uchun qulay; to'g'rilikni esa tekshirish ko'rsatadi", ru: "Удобно для творческого текста; а правильность показывает проверка" } },
  { front: { uz: "AI ishonch bilan aytgan, lekin haqiqatga to'g'ri kelmaydigan javob nima deyiladi?", ru: "Как называется ответ, который ИИ говорит уверенно, но который не соответствует правде?" }, back: { uz: 'Hallutsinatsiya', ru: 'Галлюцинация' }, note: { uz: "Masalan, menyuda yo'q «ananasli pitsa»", ru: "Например, «пицца с ананасом», которой нет в меню" } },
  { front: { uz: 'AI aytgan narxni qanday tekshirasiz?', ru: "Как проверить цену, которую назвал ИИ?" }, back: { uz: 'Menyu bilan solishtiraman', ru: 'Сверяю с меню' }, note: { uz: 'Narx bazadagi menyudan olinadi', ru: "Цену берут из меню в базе" } },
  { front: { uz: 'AI API kaliti qaysi faylda saqlanadi?', ru: "В каком файле хранится ключ AI API?" }, back: { uz: '.env faylida', ru: "В файле .env" }, note: { uz: <>Kodda faqat <code className="qcode">process.env.AI_API_KEY</code> ko'rinadi</>, ru: <>В коде видно только <code className="qcode">process.env.AI_API_KEY</code></> } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={{ uz: 'Takrorlash', ru: 'Повторение' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={BOT_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ===== YAKUN (4.2: ScoreRing + CodeStrike CTA + RECAP/Uyga vazifa + 🏅 kolleksiya) =====
const SummaryScreen = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
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
  const openArena = async () => {
    if (isMentorL && quizSt === 'off') { try { await _live.quizControl('lobby', -1); } catch { return; } }
    setArenaSolo(studentSolo); setArena(true);
  };
  const RECAP = [
    { uz: "AI API oldingi so'rovni eslamaydi — bot unga system prompt va suhbat tarixini har so'rovda yuboradi", ru: "AI API не помнит прошлый запрос — бот при каждом запросе отправляет ему system prompt и историю диалога" },
    { uz: "System prompt AI'ga u kim ekanini, qanday va nima haqida gapirishini aytadi", ru: "System prompt говорит ИИ, кто он, как и о чём ему говорить" },
    { uz: "Kontekst oynasi cheklangan — muhim ma'lumot tarixda emas, bazada saqlanadi", ru: "Окно контекста ограничено — важные данные хранятся не в истории, а в базе" },
    { uz: "Temperature: past — deyarli bir xil javob, baland — xilma-xil. Javob to'g'riligini temperature emas, tekshirish ko'rsatadi", ru: "Temperature: низкая — почти одинаковые ответы, высокая — разнообразные. Правильность ответа показывает не temperature, а проверка" },
    { uz: 'AI hallutsinatsiya qilishi mumkin — narx va faktni menyu bilan solishtiring', ru: "ИИ может галлюцинировать — сверяйте цены и факты с меню" }
  ];
  const HOMEWORK = [
    { b: { uz: 'Yozing', ru: 'Напишите' }, t: { uz: "— o'z botingiz uchun system prompt yozing: kim, qanday gapiradi, nima haqida gapiradi", ru: "— system prompt для своего бота: кто он, как говорит, о чём говорит" } },
    { b: { uz: 'Ajrating', ru: "Разделите" }, t: { uz: '— botingizga keladigan 5 ta xabarni yozing va har biri yoniga belgilang: unga handler javob beradimi yoki AI', ru: "— напишите 5 сообщений, которые придут вашему боту, и у каждого отметьте: ответит handler или ИИ" } },
    { b: { uz: 'Tekshiring', ru: 'Проверьте' }, t: { uz: "— gemini.google.com'da system prompt'ingizni sinang va bitta faktni o'z ma'lumotingiz bilan solishtiring", ru: "— свой system prompt на gemini.google.com и сверьте один факт со своими данными" } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={{ uz: 'Tayyor', ru: 'Готово' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: "Bot javobni AI'dan oladi", ru: "Бот получает ответ от ИИ" })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Botingiz javobni AI'dan oladi — <span className="italic" style={{ color: T.accent }}>siz boshqarasiz</span>.</>, ru: <>Ваш бот получает ответ от ИИ — <span className="italic" style={{ color: T.accent }}>а управляете вы</span>.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? { uz: 'Mentorni kuting', ru: "Подождите Ментора" } : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyga vazifa', ru: "Домашнее задание" })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: bot + DB + AI»</b>. Handler, baza va AI'ni bitta botga yig'asiz va uni kompyuteringiz yopiq bo'lsa ham ishlaydigan serverga joylaysiz.</>, ru: <>Следующий урок — <b>«Проектный день: бот + БД + ИИ»</b>. Вы соберёте handler, базу и ИИ в одного бота и разместите его на сервере, который работает, даже когда ваш компьютер выключен.</> })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Nishonlaringiz — ', ru: "Ваши значки — " })}{(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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
export default function BotAiBrainLesson({ lang: langProp, onFinished, liveToken }) {
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
    if (!sid || missedRef.current.has(sid) || (ach && earnedRef.current.has(ach))) return; // nishonsiz test-ekran ham (ball — birinchi to'liq urinish, F5 dan keyin ham)
    missedRef.current.add(sid);
    setMissed(new Set(missedRef.current));
  }, []);
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice }), [missed, missTry, fpPractice]);
  // ETALON — 1920px (InternetLesson): keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // Javob kaliti: inline testlar + jang savollari (QUIZ_BANK'dan) — mentor ochganda set_quiz_keys bilan serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken }); // liveToken — LMS'dan (avval null, keyin keladi)
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS }); // server-progress: davom / ko'rish / toza boshlash
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
    // Q1 (19.09): UYDA (solo) maxsus test javobi ham serverga — rasmiy natijada sanalsin (oldin faqat jonli darsda
    // yuborilardi → «javobsiz»). `picked` kalitdan: server `data.correct` (birinchi urinish) ni oladi. MCQ o'zi `recordAttempt`
    // bilan yozadi — takrori serverda e'tiborsiz (on conflict do nothing). «Qaytadan» mashqida yuborilmaydi (151-qonun 6-band).
    if (_m && _m.scored && live.mode === 'solo' && !firstPassRef.current && data && (data.solved === true || data.correct === true) && !soloSentRef.current.has(idx)) {
      const key = INLINE_KEYS[_m.id];
      if (Number.isInteger(key)) { soloSentRef.current.add(idx); live.submitAnswer(idx, _m.id, key < 0 ? 0 : (data.correct ? key : (key === 0 ? 1 : 0)), !!data.correct, data.elapsedMs || 0); }
    }
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon (faqat REAL solve)
    // Yakuniy debug-gate (s15) — XATO javob ham serverga ketadi (aks holda xato qilgan o'quvchi podiumda umuman ko'rinmaydi).
    if (_m && _m.scored && _m.scope === 'final' && data && data.solved && live.mode === 'student') live.submitAnswer(idx, _m.id, data.picked ?? 1, !!data.correct, data.elapsedMs || 0);
  };
  const reset = () => { if (!firstPassRef.current) { firstPassRef.current = { answers, durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000) }; setFpPractice(true); } progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  // F-0730-01: har o'zgarishda progress saqlanadi (screen + javoblar + nishonlar + boshlangan vaqt)
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], missed: [...missedRef.current], firstPass: firstPassRef.current, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned, missed, fpPractice]);

  const finishLesson = () => {
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
      durationSec: fp ? fp.durationSec : Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scoredMeta.length, correctAnswers,
      scorePercent: scoredMeta.length ? Math.round((correctAnswers / scoredMeta.length) * 100) : 0,
      finalScore: finalCorrect, finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : (scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false),
      answers: SCREEN_META.map((s, i) => ans[i]).filter(Boolean),
      ...buildResultDetails({ lessonId: LESSON_META.lessonId, screenMeta: SCREEN_META, answers: ans, earned, achievements: ACHIEVEMENTS, arenaBank: QUIZ_BANK })
    };
    if (typeof onFinished === 'function') onFinished(sealPayload(LESSON_META.lessonId, payload));
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
        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }

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
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.accent}; color: #fff; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(255,79,40,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.ink}; border: 1px solid ${T.line}; border-radius: 10px; padding: 8px 14px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoomable:not(.z-empty):not(.zoom-on) { padding-top: 36px; } /* U2: kattalashtirish tugmasiga joy — matn va qatordagi belgi ustiga tushmaydi (F-1001-70) */
        .zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: 0; }
        .zoomable.z-float > .zoom-btn { visibility: hidden; } /* ⛶ bo'sh joy ustida osilmasin (ZBTN, 159-qonun) */
        .flow-label:has(+ .zoomable.z-empty) { display: none; } /* bo'sh ustun ustida yorliq yolg'iz osilmasin (bridge 40-band, F-0926-01) */
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
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.3), inset 0 0 0 1.5px ${T.accent}; } /* F-1002-92 · 170-qonun: tanlov rangi butun kursda bitta — accent (U1 «neytral qora» bekor) */
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.ink}; }
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
        /* frame-warn — FAQAT haqiqiy xato/yiqilish (401/400/500, noto'g'ri tanlov): dangerSoft, yo'lakdagi rz-crash bilan bir tilda */
        .frame-warn { background: ${T.dangerSoft}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(194,54,43,0.22); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        /* === ROADMAP === */
        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); } /* F-1002-55: texnik dars kartasi — karta + raqam + teg; bosilmaydi (hover va kursor yo'q) */
        .step-num { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === 🧭 MASLAHATCHI DARSI: 📜 yo'riqnoma kartasi / stol usti / erkinlik murvati / fakt-tekshiruv === */
        .prompt-card { background: ${CODE.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.28); }
        .prompt-card.live { box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.blue}88; }
        .prompt-who { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 11px; letter-spacing: 0.06em; color: ${CODE.attr}; }
        .prompt-text { margin: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; line-height: 1.5; color: ${CODE.text}; }
        .gen-dots.inline { display: inline-flex; gap: 4px; } .gen-dots.inline i { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: 0.5; animation: gd-blink 1s ease-in-out infinite; } .gen-dots.inline i:nth-child(2){animation-delay:.15s} .gen-dots.inline i:nth-child(3){animation-delay:.3s}
        @keyframes gd-blink { 0%,100%{opacity:.3} 50%{opacity:1} }

        .desk { display: flex; flex-direction: column; gap: 6px; }
        .desk-ghosts { display: flex; flex-direction: column; gap: 4px; min-height: 26px; } /* F-1002-95: chiqib ketganlar oyna USTIDA qoladi — joy oldindan band, sakramaydi */
        .desk-ghost { align-self: flex-start; font-size: 12px; color: ${T.ink2}; background: ${T.line}; border-radius: 99px; padding: 3px 10px; animation: fade-step 0.5s ease-out both; }
        .desk-ghost s { color: ${T.ink3}; }
        .desk-slots { position: relative; background: ${T.bg}; border-radius: 14px; padding: 12px; display: flex; flex-direction: column; gap: 6px; }
        .desk-cnt { position: absolute; right: 10px; top: -10px; font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; background: ${T.paper}; color: ${T.ink2}; padding: 2px 8px; border-radius: 99px; box-shadow: inset 0 0 0 1px ${T.line}; }
        .desk-slot { height: 36px; box-sizing: border-box; border-radius: 9px; border: 1.5px dashed rgba(${T.shadowBase},0.22); } /* bo'sh katak — 4 ta sig'ishi ko'rinadi */
        .desk-slot.f { border: 0; display: flex; align-items: center; gap: 9px; background: ${T.paper}; padding: 0 11px; font-size: 12.5px; color: ${T.ink}; box-shadow: 0 4px 10px -5px rgba(${T.shadowBase},0.22); animation: el-pop 0.3s ease-out; }
        .desk-slot.next { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 4px 10px -5px rgba(${T.shadowBase},0.22); }
        .desk-next { margin-left: auto; font-family: 'JetBrains Mono'; font-size: 10.5px; color: ${T.accent}; white-space: nowrap; }
        .desk-slot.out { animation: desk-out 0.45s ease-in forwards; }
        @keyframes desk-out { to { opacity: 0; transform: translateY(-14px); height: 0; padding: 0; margin-top: -6px; } }
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
        .ai-line { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; white-space: pre-wrap; } .ai-line:hover { background: rgba(255,255,255,0.06); }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink3}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

        /* === YAKUN === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; } .ring-wrap svg { width: 100%; height: 100%; }
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

        /* === 4-MODUL: KOD QUTISI === */
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

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
        .lp-task { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 9px; }
        .lp-task-h { display: flex; align-items: center; gap: 8px; }
        .lp-task-badge { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 10.5px; letter-spacing: 0.12em; color: #fff; background: ${T.accent}; padding: 3px 9px; border-radius: 6px; }
        .lp-steps { display: flex; flex-direction: column; gap: 8px; }
        .lp-step { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 11px; padding: 11px 13px; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; cursor: pointer; transition: all 0.16s; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .lp-step:hover:not(.on) { box-shadow: 0 8px 18px -7px rgba(${T.shadowBase},0.24); }
        .lp-step.on { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .lp-check { width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; background: ${T.bg}; color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.ink3}55; transition: all 0.16s; }
        .lp-step.on .lp-check { background: ${T.success}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .lp-step-t { flex: 1; min-width: 0; }
        .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 13px; padding: 14px 20px; background: ${T.accent}; color: #fff; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.34); transition: all 0.18s; margin-top: 2px; }
        .lp-done-btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.5); }
        .lp-done-btn.is-done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; animation: lp-done-pop 0.44s cubic-bezier(.3,1.35,.5,1); }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done { animation: none !important; } }
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }

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

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }

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
        .cs-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; line-height: 1; user-select: none; color: rgba(203,173,255,.32); text-shadow: 0 0 12px rgba(150,95,255,.4); animation: cs-float ease-in-out infinite; animation-duration: calc(var(--d,22s) / var(--spd,1)); will-change: transform; }
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
        .cs-hud { position: relative; z-index: 2; display: flex; gap: clamp(7px,1.1vw,11px); align-items: center; justify-content: center; flex-wrap: wrap; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
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
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
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
        .frame-wait { background: ${T.blueSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

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

        /* === ⚡ CTA (yakun sahifasida) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }

        /* ===== ⚡ ARENA — issiq CoddyCamp muhiti ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
        .qz-arena::before { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(190,150,255,0.08) 1.1px, transparent 1.2px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; }
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
        .term-title { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: #C9D1D9; }
        .term-body { background: #1E1E1E; padding: 12px 13px; min-height: 60px; }
        .tline { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.8; color: ${CODE.text}; word-break: break-word; }

        /* ===== 📱 TELEGRAM CHAT ===== */
        .tg { border-radius: 14px; overflow: hidden; box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.26); border: 1px solid rgba(167,166,162,0.2); }
        .tg-head { background: linear-gradient(180deg,#5A9FD4,#4E8FC0); padding: 10px 14px; display: flex; align-items: center; gap: 10px; }
        .tg-ava { width: 30px; height: 30px; border-radius: 50%; background: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .tg-name { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: #fff; display: flex; flex-direction: column; line-height: 1.25; }
        .tg-status { font-weight: 500; font-size: 10.5px; color: #DCEBF7; }
        .tg-body { background: #CFD9E0; background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 18px 18px; padding: 13px 12px; display: flex; flex-direction: column; gap: 10px; }
        /* F-1002-83 · 168-qonun: bosib ochiladigan, hali ochilmagan element navbat bilan yengil pulslaydi (outline — halqa-soyani buzmaydi) */
        .tap-wave { animation: tap-wave 2.2s ease-out infinite; }
        .tap-wave:nth-child(2) { animation-delay: 0.35s; } .tap-wave:nth-child(3) { animation-delay: 0.7s; } .tap-wave:nth-child(4) { animation-delay: 1.05s; } .tap-wave:nth-child(5) { animation-delay: 1.4s; } .tap-wave:nth-child(6) { animation-delay: 1.75s; }
        @keyframes tap-wave { 0% { outline: 2px solid rgba(255,79,40,0.5); outline-offset: 0; } 70%, 100% { outline: 2px solid rgba(255,79,40,0); outline-offset: 6px; } }
        @media (prefers-reduced-motion: reduce) { .tap-wave { animation: none; outline: 1.5px solid rgba(255,79,40,0.35); outline-offset: 2px; } }
        .tg-body { max-height: clamp(260px, 48vh, 420px); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; } /* F-1002-85 · 169-qonun: chat cho'zilmaydi, ichki skrol */
        .tg-bubble { max-width: 82%; padding: 8px 12px; border-radius: 14px; font-family: 'Manrope'; font-weight: 500; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; box-shadow: 0 1px 2px rgba(0,0,0,0.12); word-break: normal; overflow-wrap: break-word; hyphens: none; }
        .tg-bubble.bot { align-self: flex-start; background: #fff; color: #0E0E10; border-bottom-left-radius: 5px; }
        .tg-bubble.user { align-self: flex-end; background: #EFFDDE; color: #0E0E10; border-bottom-right-radius: 5px; }
        .tg-bubble.muted { opacity: 0.55; }
        .tg-btns { align-self: flex-start; display: flex; flex-wrap: wrap; gap: 5px; max-width: 92%; margin-top: 4px; }
        .tg-btn { font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: #2E6FA6; background: rgba(255,255,255,0.92); padding: 6px 11px; border-radius: 9px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .tg-typing { display: flex; gap: 4px; align-items: center; padding: 11px 13px; }
        .tg-typing span { width: 6px; height: 6px; border-radius: 50%; background: ${T.ink3}; animation: tg-typing-bounce 1s ease-in-out infinite; }
        .tg-typing span:nth-child(2) { animation-delay: 0.15s; } .tg-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes tg-typing-bounce { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-3px); opacity: 1; } }


        /* ===== 🎒 JIHOZLAR PANELI ===== */
        .gear-panel { display: flex; flex-wrap: wrap; gap: 8px; }
        .gear-slot { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 64px; background: ${T.paper}; border-radius: 12px; padding: 6px 7px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); opacity: 0.4; }
        .gear-slot.on { opacity: 1; box-shadow: inset 0 0 0 1.5px ${T.success}, 0 6px 16px -6px rgba(31,122,77,0.26); background: ${T.successSoft}; }
        .gear-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10px; color: ${T.ink}; text-align: center; }

        /* ===== 🔑 XIZMAT OYNASI (s5) ===== */
        .sw-chain { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
        .sw-node { position: relative; display: flex; flex-direction: column; align-items: center; gap: 2px; font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.ink}; background: ${T.paper}; border-radius: 12px; padding: 10px 12px; min-width: 78px; text-align: center; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .sw-arrow { color: ${T.ink3}; font-weight: 800; font-size: 16px; transition: opacity 0.25s; } .sw-arrow.off { opacity: 0.3; }
        .sw-socket.has-key { box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .sw-socket.empty { box-shadow: inset 0 0 0 1.5px ${T.danger}; background: ${T.dangerSoft}; }
        .sw-chip { font-size: 20px; cursor: grab; touch-action: none; user-select: none; margin-top: 4px; }
        .sw-chip:active { cursor: grabbing; }
        .sw-401 { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; color: ${T.danger}; margin-top: 4px; }
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
        .ns-cust-dots { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; color: ${T.ink3}; animation: ns-dots-pulse 3s ease-in-out infinite; }
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
        /* ===== PICK ROWS (sxema ulash) ===== */
        .pick-row { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 10px; padding: 11px 13px; cursor: pointer; transition: all 0.16s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; }
        .pick-row:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px -6px rgba(${T.shadowBase},0.22); }
        .pick-row.sel { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.28); background: ${T.accentSoft}; }
        .pick-row.picked { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; cursor: default; }
        .pick-plus { margin-left: auto; font-weight: 700; color: ${T.ink3}; } .pick-row.picked .pick-plus { color: ${T.success}; } .pick-row.sel .pick-plus { color: ${T.accent}; }

        /* ===== WIRE (sxema natijasi) ===== */
        .wire { background: ${T.paper}; border-radius: 14px; padding: 13px 15px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 7px; }
        .wire-row { display: flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink}; }
        .wire-t { color: ${T.ink}; }
        .wire-arrow { color: ${T.accent}; font-weight: 800; }
        @keyframes rz-shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: rz-shake 0.4s ease; }

        .cj-items { display: flex; flex-wrap: wrap; gap: 9px; }
        .itm-card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; width: clamp(84px,15vw,104px); background: ${T.paper}; border: none; border-radius: 13px; padding: 11px 7px 9px; cursor: pointer; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.2); transition: all 0.16s; }
        .itm-card:hover:not(:disabled) { transform: translateY(-2px); }
        .itm-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -8px rgba(255,79,40,0.3); }
        .itm-card:disabled { cursor: not-allowed; opacity: 0.75; }
        .itm-nm { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 10.5px; color: ${T.ink}; text-align: center; }
        .itm-check { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border-radius: 50%; background: ${T.accent}; color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px -2px rgba(255,79,40,0.5); }
        .itm-fix { margin-top: 4px; font-family: 'Manrope'; font-weight: 700; font-size: 10px; background: ${T.successSoft}; color: ${T.success}; border: none; border-radius: 8px; padding: 3px 7px; cursor: pointer; }

        /* Bo'shliqlarni to'ldirish (s13 builder) */
        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .blank-group { display: flex; flex-direction: column; gap: 6px; }
        .blank-group .bg-lbl { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .blank-row { display: flex; flex-wrap: wrap; gap: 7px; }

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi. Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        .gchip.tap-hint, .btn-soft.tap-hint, .itm-card.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }

        .dd { display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,1fr); gap: 13px; align-items: start; } /* §34: keng ekranda uyalar chapda, hovuz o'ngda */
        @media (max-width: 760px) { .dd { grid-template-columns: 1fr; } }
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
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip::before { content: '⠿'; margin-right: 7px; opacity: .75; font-weight: 400; } /* F-1002-59: to'ldirilgan gradient chip (6-Modul ko'rinishi, 26.09 oq+chegara varianti bekor), ⠿ ushlagich sudralishni aytadi */
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
          .dd-chip.in, .dd-slot.ok, .dd-slot.bad, .shake, .tg-typing span, .desk-slot.out, .desk-ghost, .ck-stamp { animation: none !important; }
        }

      /* ===== 6-dars v2 (MD 06-BotAiBrain-v2): chizma, navbatli qatorlar, so'rov strelkasi, fakt-chiziq, kod oynasi ===== */
      .q-lbl { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.7vw,16px); line-height: 1.4; color: ${T.ink}; }
      .af { display: flex; flex-direction: column; align-items: flex-start; }
      .af-node { display: flex; flex-direction: column; gap: 2px; background: ${T.paper}; border-radius: 12px; padding: 10px 15px; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.22); animation: af-in 0.3s ease-out both; }
      .af-ic { margin-right: 7px; font-size: 1.05em; } /* F-1002-82 · 167: 📩 hodisa · 📄 handler · 🧠 AI · 💬 javob */
      .af-node b { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.7vw,15.5px); color: ${T.ink}; }
      .af-node small { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; }
      .af-node.ai { box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.blue}; }
      .af-node.out { background: ${T.successSoft}; } .af-node.out b { color: ${T.success}; }
      .af-arr { position: relative; display: block; width: 2px; height: 20px; margin: 3px 0 8px 26px; background: ${T.accent}; transform-origin: top; animation: af-grow 0.25s ease-out both; }
      .af-arr::after { content: ''; position: absolute; left: -4px; bottom: -6px; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${T.accent}; }
      @keyframes af-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      @keyframes af-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      .af-step { animation: fade-in-up 0.4s ease-out both; }
      .roadmap .step-card .step-text { flex: 1; min-width: 0; }
      .pick-row.seen .pick-plus { color: ${T.success}; }
      .sp-done { display: flex; align-items: center; gap: 9px; background: ${T.successSoft}; border-radius: 10px; padding: 9px 12px; font-size: 13.5px; color: ${T.ink}; }
      .sp-done-t { flex: 1; min-width: 0; }
      .sp-done-ok { color: ${T.success}; font-weight: 800; }
      .sp-redo { border: none; background: ${T.paper}; color: ${T.ink2}; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 700; flex-shrink: 0; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.25); }
      .sp-redo:hover { color: ${T.ink}; }
      .req-arrow { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
      .req-arrow i { position: relative; display: block; margin-right: 6px; width: 72px; height: 2px; background: ${T.blue}; transform-origin: left; animation: req-grow 0.7s ease-out both; }
      .req-arrow i::after { content: ''; position: absolute; right: -6px; top: -4px; border-top: 5px solid transparent; border-bottom: 5px solid transparent; border-left: 7px solid ${T.blue}; }
      @keyframes req-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      .desk-cap { margin: 4px 0 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
      .ckbox { position: relative; display: grid; grid-template-columns: minmax(0,1.25fr) minmax(0,1fr); column-gap: clamp(34px,7vw,72px); align-items: start; }
      .ck-col { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
      .ck-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; z-index: 0; }
      .ck-line { fill: none; stroke: ${T.success}; stroke-width: 2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: ck-draw 0.8s ease-out forwards; }
      @keyframes ck-draw { to { stroke-dashoffset: 0; } }
      .ck-ai { display: flex; gap: 8px; align-items: flex-start; } /* F-1002-96: AI gaplari chat-pufagida, baza — jadval kartasi; ikkalasi ko'rinadi */
      .ck-ava { width: 26px; height: 26px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-size: 11px; font-weight: 800; display: grid; place-items: center; flex: none; }
      .ck-bub { flex: 1; min-width: 0; background: ${T.paper}; border-radius: 14px; border-top-left-radius: 5px; padding: 9px 11px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
      .ck-bub-h { margin: 0; font-size: 12px; color: ${T.ink2}; }
      .ck-bub .claim-row { background: ${T.bg}; box-shadow: none; padding: 7px 9px; }
      .ck-bub .claim-row.ok { background: ${T.successSoft}; } .ck-bub .claim-row.bad { background: ${T.dangerSoft}; }
      .ck-stamp { flex: none; font-family: 'JetBrains Mono'; font-weight: 700; font-size: 11.5px; padding: 2px 8px; border-radius: 99px; color: #fff; animation: ck-pop 0.45s cubic-bezier(0.3,1.6,0.5,1) both; }
      .ck-stamp.ok { background: ${T.success}; } .ck-stamp.bad { background: ${T.danger}; }
      @keyframes ck-pop { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .ck-db { background: ${T.paper}; border-radius: 12px; overflow: hidden; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
      .ck-db-hd { display: flex; justify-content: space-between; font-family: 'JetBrains Mono'; font-size: 11px; color: ${T.ink2}; padding: 8px 12px; background: ${T.bg}; }
      .ck-tbl { width: 100%; border-collapse: collapse; font-size: 13px; color: ${T.ink}; }
      .ck-tbl td { padding: 9px 12px; border-top: 1px solid ${T.line}; transition: background 0.3s; }
      .ck-tbl td:last-child { font-family: 'JetBrains Mono'; text-align: right; white-space: nowrap; }
      .ck-tbl tr.hit td { background: ${T.successSoft}; }
      .ck-none { margin: 8px; padding: 7px 10px; border: 1.5px dashed ${T.danger}; border-radius: 8px; font-size: 12px; font-weight: 700; color: ${T.danger}; }
      .claim-row.cur { flex-wrap: wrap; }
      .claim-row.cur .claim-txt { flex-basis: 100%; font-weight: 600; }
      .claim-row.done { flex-wrap: wrap; row-gap: 6px; } .claim-row.done .claim-txt { flex: 1 1 auto; } /* joy yetmasa belgi matn ostiga tushadi, matn yopilmaydi (F-1001-70) */
      .req-ln { margin: 0 0 6px; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; } .req-ln:last-child { margin-bottom: 0; }
      .code-win { border-radius: 12px; overflow: hidden; background: ${CODE.bg}; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.28); }
      .code-win-h { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; color: ${CODE.attr}; padding: 9px 14px; border-bottom: 1px solid rgba(255,255,255,0.08); }
      .code-win-pre { margin: 0; padding: 12px 14px; overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(11.5px,1.4vw,13px); line-height: 1.6; color: ${CODE.text}; }
      .cw-l { display: block; white-space: pre-wrap; padding-left: 2ch; text-indent: -2ch; } /* uzun qator davomi chekinish bilan — yangi kod qatoriga o'xshamaydi; har qatorda o'z chekinishi + 2ch (F-1001-70) */
      .dd-slot { position: relative; }
      .dd-slots.solved .dd-slot:not(:last-child)::after { content: ''; position: absolute; left: 24px; bottom: -11px; width: 2px; height: 11px; background: ${T.success}; transform-origin: top; animation: af-grow 0.22s ease-out both; }
      .dd-slots.solved .dd-slot:nth-child(1)::after { animation-delay: 0.2s; }
      .dd-slots.solved .dd-slot:nth-child(2)::after { animation-delay: 0.42s; }
      .dd-slots.solved .dd-slot:nth-child(3)::after { animation-delay: 0.64s; }
      .dd-slots.solved .dd-slot:nth-child(4)::after { animation-delay: 0.86s; }
      .rc-ic.code { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(14px,2.2vw,19px); line-height: 1.4; background: ${CODE.bg}; color: ${CODE.text}; padding: 8px 14px; border-radius: 10px; max-width: 100%; overflow-wrap: anywhere; }
      .rc-ic.num { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(34px,6vw,52px); color: ${T.accent}; }
      .tg-status::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #7DD181; margin-right: 5px; vertical-align: 1px; }
      .tg-ava { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 14px; color: #4E8FC0; }
      .lp-step-cur { flex-wrap: wrap; cursor: default; }
      .lp-step-cur:hover { box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.14); }
      .lp-step-btn { margin-left: auto; padding: 8px 16px; font-size: 13px; }
      .lp-step-done { cursor: default; padding-top: 8px; padding-bottom: 8px; }
      .lp-step-done .lp-step-t { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      @media (prefers-reduced-motion: reduce) {
        .af-node, .af-arr, .af-step, .req-arrow i, .dd-slots.solved .dd-slot::after { animation: none !important; }
        .ck-line { animation: none !important; stroke-dashoffset: 0; }
      }
      .ach-rule { margin: 8px 0 0; text-align: center; font-size: 13px; line-height: 1.4; color: ${T.ink2}; }
      .ach-rule.lost { font-style: italic; }
      
        /* === AMALIYOT BLOKI (ScreenBlok, F-1002-114 — 5/7/9-dars bilan bir xil ko'rinish; faylning eski .lp-step qoidalaridan mustaqil) === */
        .lp-step.ab-cur { cursor: default; align-items: flex-start; justify-content: flex-start; box-shadow: inset 0 0 0 1.5px ${T.ink}22, 0 8px 18px -7px rgba(${T.shadowBase},0.2); }
        .lp-step.ab-on { cursor: default; padding-top: 8px; padding-bottom: 8px; }
        .lp-step-body { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
        .lp-step.ab-cur .lp-step-btn { padding: 9px 18px; font-size: 14px; margin-left: 0; align-self: flex-start; }
        .lp-step-t.one, .lp-step-t.one .qcode { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lp-step-t b { color: ${T.ink}; } .lp-step.ab-on .lp-step-t b { color: ${T.success}; }
        .lp-undo { flex-shrink: 0; border: none; background: transparent; color: ${T.success}; font-size: 16px; font-weight: 700; cursor: pointer; padding: 2px 6px; border-radius: 8px; }
        .lp-undo:hover { background: ${T.paper}; }
        .ab-prompt { width: 100%; background: ${T.bg}; border-radius: 11px; padding: 10px 12px; box-shadow: inset 0 0 0 1px ${T.line}; display: flex; flex-direction: column; gap: 4px; }
        .ab-prompt-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px; }
        .ab-who { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 10.5px; letter-spacing: 0.06em; color: ${T.ink3}; }
        .ab-copy { font-family: 'Manrope'; font-weight: 700; font-size: 12px; padding: 5px 11px; border-radius: 8px; border: none; background: ${T.paper}; color: ${T.accent}; cursor: pointer; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.25); }
        .ab-copy:hover { background: ${T.accentSoft}; }
        .ab-line { margin: 0; font-size: clamp(12.5px,1.5vw,13.5px); line-height: 1.55; color: ${T.ink}; font-weight: 500; }
        .ab-line.mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; }
        .ab-slot { background: ${T.accentSoft}; color: ${T.accent}; border-radius: 6px; padding: 1px 6px; font-weight: 700; white-space: nowrap; }
        .ab-err { margin: 0; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
        .ab-tail { margin: 0; font-size: 12px; line-height: 1.5; color: ${T.ink3}; }
        .ab-code { width: 100%; margin: 0; white-space: pre-wrap; word-break: break-all; background: ${CODE.bg}; color: ${CODE.text}; border-radius: 10px; padding: 10px 12px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; line-height: 1.6; overflow-x: auto; }
        .ab-code-p { color: ${CODE.str}; }
        .ab-btns { display: flex; flex-wrap: wrap; gap: 5px; align-self: flex-start; max-width: 92%; }
        .ab-btn { font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: #2E6FA6; background: rgba(255,255,255,0.92); padding: 6px 11px; border-radius: 9px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .ab-muted { opacity: 0.72; font-style: italic; }
      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Bot ichida AI', ru: "ИИ внутри бота" }} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} live={live} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
            </>
          )}
        </div>
      </LiveGateCtx.Provider>
      </AchMissCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>
  );
}
