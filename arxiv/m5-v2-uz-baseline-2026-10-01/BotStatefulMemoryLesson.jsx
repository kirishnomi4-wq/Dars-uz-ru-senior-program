import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 5-MODUL (Telegram bot + AI) · 4-DARS — «BOT ESLAB QOLADI — HOLAT VA POSTGRESQL» — PLATFORM STANDARD v18 (AUDIOSIZ)
// Manba-haqiqat: feedback/F-0928-QA-5modul/04-BotStatefulMemory-v2.md (MD-birinchi, 01.10).
// Asosiy model: holat — suhbat qaysi bosqichda va mijoz nimani tanlagan. U chat.id bo'yicha ajratiladi (sessiya)
//   va PostgreSQL'da saqlanadi. Har xabar: SELECT → holat tekshiriladi → javob va yangi holat → UPDATE;
//   yangi mijozga avval INSERT. O'xshatish (metafora) yo'q — React darslaridagi tajriba bilan bog'lanadi.
// INTERAKTIV: s2 holatsiz bot · s3 MARKAZIY holat qo'shish (xabar → holat strelkasi) · s6 MARKAZIY qayta ishga tushirish ·
//   s7 umumiy holat (aralashuv) · s9 har mijozga sessiya · s13 SQL bo'shliqlari (navbat bilan) · s15 FINAL oqim (DragDropOrder).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium (ball to'g'riligi — ⚡ Jonli roli).
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================
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

// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi.
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang , buildResultDetails, sealPayload, useAutoNext } from '../live/index.js';







const LangContext = createContext('uz');

// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
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

const LESSON_META = { lessonId: 'bot-stateful-memory-05-03-v18', lessonTitle: { uz: 'Bot eslab qoladi — holat va PostgreSQL', ru: "Бот запоминает — состояние и PostgreSQL" } };
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
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `s15` — final (picked 0/1 sentinel, correct maydoni haqiqiy). `practice: -1` — sentinel (variant yo'q).
// ⚠️ Variant TARTIBI/qiymatlari 🎓 Metodist + ⚡ Jonli rollari tomonidan qayta balanslanadi — shu map ular bilan sinxron bo'lsin.
// ⚡ To'g'ri javob pozitsiyalari ATAYIN har xil (2 · 1 · 3 · 0) — «doim A» naqshi yo'q, o'qimay bosgan ball to'plamaydi.
// s15 (yakuniy debug) — REAL kalit: picked=0 → 1-urinishda topdi (to'g'ri), picked=1 → 1-urinishda xato bosdi.
const INLINE_KEYS = { s4: 2, s8: 1, s10: 3, s14: 0, s15: 0, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI). Matn 🎓 Metodist tomonidan sayqallanadi.
const RECAPS = {
  4: {
    title: { uz: 'Bot nega unutadi', ru: 'Почему бот забывает' },
    cards: [
      { ic: 1, h: { uz: 'Holat saqlanmasa, har xabar — alohida hodisa', ru: "Без состояния каждое сообщение — отдельное событие" }, body: { uz: 'Bot hodisani oladi, javob beradi va keyingisini yangidan boshlaydi.', ru: "Бот получает событие, отвечает и начинает следующее с нуля." } },
      { ic: 2, h: { uz: 'Shuning uchun «Tushunmadim» deydi', ru: "Поэтому он говорит «Не понял»" }, body: { uz: '«Katta» kabi qisqa javob qaysi savolga tegishli ekanini bilmaydi.', ru: "Он не знает, к какому вопросу относится короткий ответ вроде «Большая»." } },
      { ic: { code: 'holat = "OLCHAM_KUTYAPMAN"' }, h: { uz: 'Yechim — holat', ru: "Решение — состояние" }, body: { uz: "Suhbat qaysi bosqichda ekanini saqlasak, bot qayerda to'xtaganini biladi.", ru: "Если сохранять, на каком этапе диалог, бот будет знать, где остановился." }, ask: { uz: 'Bot nega bir necha xabardan keyin adashadi?', ru: 'Почему бот путается через несколько сообщений?' } },
    ]
  },
  8: {
    title: { uz: 'Dastur xotirasi va PostgreSQL', ru: "Память программы и PostgreSQL" },
    cards: [
      { ic: { code: 'const holatlar = {}' }, h: { uz: 'Koddagi obyekt — tez, lekin vaqtinchalik', ru: "Объект в коде — быстро, но временно" }, body: { uz: 'U dastur xotirasida (RAM) turadi.', ru: "Он хранится в памяти программы (RAM)." } },
      { ic: 2, h: { uz: "Qayta ishga tushsa — yo'qoladi", ru: "При перезапуске — пропадает" }, body: { uz: "Xotiradagi hamma holat o'chadi.", ru: "Все состояния в памяти стираются." } },
      { ic: { code: 'CREATE TABLE users' }, h: { uz: 'PostgreSQL — doimiy', ru: "PostgreSQL — постоянное хранилище" }, body: { uz: "Ma'lumot diskda, bot qayta ishga tushsa ham qoladi.", ru: "Данные на диске и остаются даже после перезапуска бота." }, ask: { uz: "Bot o'chib-yonganda qaysi ma'lumot saqlanib qoladi?", ru: 'Какие данные сохранятся после перезапуска бота?' } },
    ]
  },
  10: {
    title: { uz: 'Ikki mijoz aralashmasligi uchun', ru: 'Чтобы два клиента не перепутались' },
    cards: [
      { ic: 1, h: { uz: 'Bitta umumiy holat — xavfli', ru: "Одно общее состояние — опасно" }, body: { uz: 'Oxirgi yozuv oldingisining ustiga yoziladi.', ru: "Последняя запись затирает предыдущую." } },
      { ic: { code: 'holatlar[ctx.chat.id]' }, h: { uz: "Har mijozga o'z sessiyasi", ru: "Каждому клиенту — своя сессия" }, body: { uz: "Holat `chat.id` bo'yicha alohida saqlanadi.", ru: "Состояние хранится отдельно по `chat.id`." } },
      { ic: 3, h: { uz: 'Natija', ru: "Результат" }, body: { uz: "Har kim o'z buyurtmasini oladi.", ru: "Каждый получает свой заказ." }, ask: { uz: 'Ikki mijoz aralashib ketmasligi uchun nima kerak?', ru: 'Что нужно, чтобы два клиента не перепутались?' } },
    ]
  },
  14: {
    title: { uz: 'INSERT, SELECT, UPDATE', ru: 'INSERT, SELECT, UPDATE' },
    cards: [
      { ic: { code: 'INSERT' }, h: { uz: 'INSERT — yangi qator', ru: 'INSERT — новая строка' }, body: { uz: "Yangi mijoz kelganda jadvalga qator qo'shiladi.", ru: "Когда приходит новый клиент, в таблицу добавляется строка." } },
      { ic: { code: 'SELECT' }, h: { uz: "SELECT — o'qish", ru: 'SELECT — чтение' }, body: { uz: "Mavjud mijozning holatini o'qib olish uchun.", ru: "Чтобы прочитать состояние существующего клиента." } },
      { ic: { code: 'UPDATE' }, h: { uz: 'UPDATE — yangilash', ru: 'UPDATE — обновление' }, body: { uz: "Holat o'zgarganda mavjud qator yangilanadi, yangisi qo'shilmaydi.", ru: "Когда состояние меняется, существующая строка обновляется, новая не добавляется." }, ask: { uz: 'Yangi mijoz uchun qaysi SQL ishlatiladi?', ru: 'Какой SQL используется для нового клиента?' } },
    ]
  },
  15: {
    title: { uz: 'Holatli botning xabar oqimi', ru: "Поток сообщения в боте с состоянием" },
    cards: [
      { ic: 1, h: { uz: 'Avval — xabar keladi', ru: 'Сначала — приходит сообщение' }, body: { uz: 'Hammasi shundan boshlanadi.', ru: "С этого всё начинается." } },
      { ic: { code: 'SELECT' }, h: { uz: "Keyin — o'qish va tekshirish", ru: "Потом — чтение и проверка" }, body: { uz: "Bot mijoz holatini o'qiydi (SELECT) va tekshiradi.", ru: "Бот читает состояние клиента (SELECT) и проверяет его." } },
      { ic: { code: 'UPDATE' }, h: { uz: 'Eng oxiri — saqlash', ru: "В самом конце — сохранение" }, body: { uz: 'Yangi holat bazaga yoziladi (UPDATE).', ru: "Новое состояние записывается в базу (UPDATE)." }, vis: <RcFlow items={[{ uz: 'Xabar', ru: 'Сообщение' }, 'SELECT', { uz: 'Tekshirish', ru: "Проверка" }, { uz: 'Javob', ru: "Ответ" }, 'UPDATE']} />, ask: { uz: 'Xabar kelganda bot birinchi nima qiladi?', ru: 'Что бот делает первым, когда приходит сообщение?' } },
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
        <span className="rc-tag">{tr({ uz: 'Qayta tushuntirish', ru: "Объяснить заново" })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        {card.ic && typeof card.ic === 'object' ? <div className="rc-ic code"><span>{card.ic.code}</span></div> : <div className="rc-ic num">{card.ic}</div>}
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{fmtCode(tr(card.body))}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">{tr({ uz: 'Sinfga savol:', ru: "Вопрос классу:" })} {tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Назад' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}${tr({ uz: '-karta', ru: '-я карточка' })}`} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: '✓ Tushunarli — davom etamiz', ru: '✓ Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Далее →' })}</button>}
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
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Ответили все' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
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
        <p className="mstats-hidden">{tr({ uz: '🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o\'quvchilar ekranida ham birdan ochiladi.', ru: '🙈 Кто что выбрал и сколько ✅/❌ — пока скрыто. По кнопке «Открыть результат» откроется сразу и у Вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>⚠️ Верно всего <b>{pct}%</b> — тема классу не зашла. Перед продолжением коротко повторите.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: 'Qayta tushuntirish', ru: 'Объяснить заново' })} — {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. При желании коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс тему освоил. Смело продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — по процентам вывод делать трудно. Оцените сами.</> })}</p>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Объясните заново.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в реальном времени…' })}</p>}
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
  // MENTOR (proyektor): o'zi javob BERMAYDI — «Natijani ochish» bosilguncha to'g'ri javob yashirin saqlanadi.
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
  // KAHOOT REVEAL: jonli darsda javob bosilgach to'g'ri/XATO ham yashirin — faqat «javob qabul qilindi».
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
              if (waiting) { if (i === picked) cls += ' option-wait'; } // faqat neytral belgi — to'g'ri/xato hali yashirin
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
              ? <>{tr({ uz: "✓ To'g'ri javob:", ru: '✓ Правильный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
              : waiting
                ? tr({ uz: 'Javobingiz qabul qilindi', ru: "Ваш ответ принят" })
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
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi.
              Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */}
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — ещё раз взглянуть на тему" })}</button>
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


const Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: 'italic' }}>{children}</span>;


// ===== 📱 TELEGRAM CHAT (jonli ko'rinish) =====
const TgChat = ({ title = { uz: 'AvtoPizza bot', ru: "AvtoPizza bot" }, children, minH }) => (
  <div className="tg">
    <div className="tg-head"><span className="tg-ava" aria-hidden="true">{String(tr(title)).charAt(0)}</span><span className="tg-name">{tr(title)}<span className="tg-status">{tr({ uz: 'bot · onlayn', ru: 'бот · онлайн' })}</span></span></div>
    <div className="tg-body" style={{ minHeight: minH }}>{children}</div>
  </div>
);
const Bubble = ({ from = 'bot', children, muted, ln }) => <div data-ln={ln} className={`tg-bubble ${from} el-in ${muted ? 'muted' : ''}`}>{children}</div>;
const TgTyping = () => <div className="tg-bubble bot el-in tg-typing"><span /><span /><span /></div>;


// ===== A7: STRELKA — xabar → holat bog'lanishi (konteyner ichidagi [data-ln] elementlar orasida SVG chiziq) =====
// links: [{ from, to, still }] — still: avvalgi strelka (qayta chizilmaydi). k o'zgarsa — yangisi ~0.8 s da chiziladi.
// prefers-reduced-motion: chiziq darhol to'liq turadi (CSS).
const LinkArrows = ({ wrapRef, links, k }) => {
  const [segs, setSegs] = useState([]);
  useEffect(() => {
    const w = wrapRef.current;
    if (!w || !links || !links.length) { setSegs([]); return undefined; }
    let raf = 0;
    const calc = () => {
      const wr = w.getBoundingClientRect();
      const sc = w.offsetWidth ? wr.width / w.offsetWidth : 1;
      const bx = (r) => ({ l: (r.left - wr.left) / sc, t: (r.top - wr.top) / sc, w: r.width / sc, h: r.height / sc });
      const box = (el) => bx(el.getBoundingClientRect());
      const out = [];
      links.forEach((ln) => {
        const a = w.querySelector(`[data-ln="${ln.from}"]`);
        const b = w.querySelector(`[data-ln="${ln.to}"]`);
        if (!a || !b) return;
        const A = box(a), B = box(b);
        let x1, y1, x2, y2, c1x, c1y, c2x, c2y, d = null;
        if (A.l + A.w <= B.l - 4) {
          x1 = A.l + A.w; y1 = A.t + A.h / 2; x2 = B.l - 2; y2 = B.t + B.h / 2;
          const dx = Math.max(24, (x2 - x1) / 2); c1x = x1 + dx; c1y = y1; c2x = x2 - dx; c2y = y2;
          // ln.row: uch qator QIYMATIGA tegadi, chiziq esa yorliq matnini kesmaydi —
          // qatorlar orasidagi bo'shliqdan yorliq oxirigacha boradi, keyin qiymatga ko'tariladi.
          const rowEl = ln.row ? w.querySelector(`[data-ln="${ln.row}"]`) : null;
          const kEl = rowEl ? rowEl.querySelector('.daf-k') : null;
          if (rowEl && kEl) {
            const R = box(rowEl);
            const rg = document.createRange(); rg.selectNodeContents(kEl);
            const K = bx(rg.getBoundingClientRect());
            const ly = y1 >= y2 ? R.t + R.h : R.t;
            const sx = K.l + K.w + 4;
            if (R.l > x1 + 8 && sx < x2 - 12) {
              const d1 = Math.max(16, (R.l - x1) / 2);
              c2x = x2 - 12; c2y = y2;
              d = `M${x1} ${y1} C${x1 + d1} ${y1} ${R.l - d1} ${ly} ${R.l} ${ly} L${sx} ${ly} C${sx + 10} ${ly} ${c2x} ${c2y} ${x2} ${y2}`;
            }
          }
        } else if (B.l + B.w <= A.l - 4) {
          x1 = A.l; y1 = A.t + A.h / 2; x2 = B.l + B.w + 2; y2 = B.t + B.h / 2;
          const dx = Math.max(24, (x1 - x2) / 2); c1x = x1 - dx; c1y = y1; c2x = x2 + dx; c2y = y2;
        } else if (A.t + A.h <= B.t) {
          x1 = A.l + A.w / 2; y1 = A.t + A.h; x2 = B.l + B.w / 2; y2 = B.t - 2;
          const dy = Math.max(18, (y2 - y1) / 2); c1x = x1; c1y = y1 + dy; c2x = x2; c2y = y2 - dy;
        } else {
          x1 = A.l + A.w / 2; y1 = A.t; x2 = B.l + B.w / 2; y2 = B.t + B.h + 2;
          const dy = Math.max(18, (y1 - y2) / 2); c1x = x1; c1y = y1 - dy; c2x = x2; c2y = y2 + dy;
        }
        const ang = Math.atan2(y2 - c2y, x2 - c2x) * 180 / Math.PI;
        out.push({ key: `${ln.from}>${ln.to}`, d: d || `M${x1} ${y1} C${c1x} ${c1y} ${c2x} ${c2y} ${x2} ${y2}`, x2, y2, ang, still: !!ln.still });
      });
      setSegs(out);
    };
    const t = setTimeout(() => { raf = requestAnimationFrame(calc); }, 340); // kirish animatsiyalari (el-in, fade) tugagach o'lchanadi
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(calc); }) : null;
    if (ro) ro.observe(w);
    window.addEventListener('resize', calc);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); if (ro) ro.disconnect(); window.removeEventListener('resize', calc); };
  }, [k]); // eslint-disable-line
  if (!segs.length) return null;
  return (
    <svg className="ln-svg" aria-hidden="true">
      {segs.map(s => (
        <g key={`${s.key}-${k}`} className={s.still ? 'ln-still' : 'ln-draw'}>
          <path d={s.d} pathLength="1" className="ln-path" />
          <polygon points="0,0 -9,-5 -9,5" transform={`translate(${s.x2} ${s.y2}) rotate(${s.ang})`} className="ln-head" />
        </g>
      ))}
    </svg>
  );
};


function DragDropOrder({ items, hints, slotLabels, onSolved, onChange }) {
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
  // A7: to'g'ri yig'ilgach oxirgi qadamdan 1-qadamga qaytuvchi strelka (keyingi xabar — yana shu oqim)
  const [loop, setLoop] = useState(null);
  useLayoutEffect(() => {
    if (!solved) { setLoop(null); return; }
    const a = slotRefs.current[0], b = slotRefs.current[order.length - 1];
    if (!a || !b) return;
    const y1 = b.offsetTop + b.offsetHeight / 2, y2 = a.offsetTop + a.offsetHeight / 2;
    setLoop({ d: `M0 ${y1} C-22 ${y1} -22 ${y2} -2 ${y2}`, y2 });
  }, [solved]); // eslint-disable-line
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
  // Natija va xato yozuvi — ekranning o'zida, bitta (KOD 12): bu yerda faqat uyalar va hovuz.
  return (
    <div className="dd fade-up">
      <div className="dd-slots">
        {slots.map((sid, i) => (
          <div key={i} ref={el => (slotRefs.current[i] = el)} className={`dd-slot ${sid ? 'filled' : ''} ${solved && sid ? 'ok' : ''} ${wrong && sid && sid !== order[i] ? 'bad' : ''}`}>
            <span className={`dd-slotn ${slotLabels ? 'wide' : ''}`}>{slotLabels ? tr(slotLabels[i]) : i + 1}</span>
            {sid ? <button key={sid} className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr(byId[sid].label)}</button> : <span className="dd-hint">{hints ? tr(hints[i]) : tr({ uz: "bu yerga qo'ying", ru: "поместите сюда" })}</span>}
          </div>
        ))}
        {loop && <svg className="ln-svg dd-loop" aria-hidden="true"><g className="ln-draw"><path d={loop.d} pathLength="1" className="ln-path" /><polygon points="0,0 -9,-5 -9,5" transform={`translate(-2 ${loop.y2})`} className="ln-head" /></g></svg>}
      </div>
      <div className="dd-pool">
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>
    </div>
  );
}


// ===== SUHBAT HOLATI PANELI (mijoz · holat · tanlov) — sarlavha ekran bo'yicha prop bilan =====
// chg: o'zgargan qatorlar (['holat','tanlov']) — qisqa yonadi; ln: strelka uchi uchun data-ln.
const HolatPanel = ({ title, mijoz, holat, tanlov, chg = [], ln }) => (
  <div className="daf-page fade-step" data-ln={ln}>
    <div className="daf-page-h">{tr(title)}</div>
    {mijoz !== undefined && <div className="daf-row"><span className="daf-k">{tr({ uz: 'mijoz', ru: 'клиент' })}</span><span className={`daf-v ${chg.includes('mijoz') ? 'chg' : ''}`}>{tr(mijoz)}</span></div>}
    <div className="daf-row" data-ln={ln ? `${ln}-holat` : undefined}><span className="daf-k">{tr({ uz: 'holat', ru: "состояние" })}</span><span className={`daf-v hl mono ${chg.includes('holat') ? 'chg' : ''}`} data-ln={ln ? `${ln}-holat-v` : undefined}>{tr(holat)}</span></div>
    <div className="daf-row"><span className="daf-k">{tr({ uz: 'tanlov', ru: 'выбор' })}</span><span className={`daf-v ${chg.includes('tanlov') ? 'chg' : ''}`}>{tr(tanlov)}</span></div>
  </div>
);

// ===== POSTGRESQL JADVAL KO'RINISHI (users) =====
const DB_COLS = [{ k: 'id', h: 'id' }, { k: 'tg', h: 'telegram_id' }, { k: 'ism', h: 'ism' }, { k: 'holat', h: 'holat' }, { k: 'tanlov', h: 'tanlov' }];
const DbTable = ({ rows, hlRow, hlCol, newRow }) => (
  <div className="dbt-wrap">
    <div className="dbt-cap">{tr({ uz: 'jadval:', ru: "таблица:" })} <span className="mono">users</span></div>
    <div className="dbt-scroll">
    <table className="dbt">
      <thead><tr>{DB_COLS.map(c => <th key={c.k} className={hlCol === c.k ? 'hlh' : ''}>{c.h}</th>)}</tr></thead>
      <tbody>
        {rows.length === 0
          ? <tr className="empty"><td colSpan={DB_COLS.length}>{tr({ uz: "— jadval bo'sh —", ru: '— таблица пуста —' })}</td></tr>
          : rows.map((r, ri) => (
              <tr key={ri} className={`${hlRow === ri ? 'hl' : ''} ${newRow === ri ? 'rowin' : ''}`}>
                {DB_COLS.map(c => <td key={c.k} className={(hlCol === c.k && hlRow === ri) ? 'hlc' : ''}>{r[c.k] && typeof r[c.k] === 'object' ? tr(r[c.k]) : r[c.k]}</td>)}
              </tr>
            ))}
      </tbody>
    </table>
    </div>
  </div>
);

// ===== SCREEN 0 — HOOK: Aziza «Pepperoni» deb yozdi, bot tushunmadi =====
// Ballsiz hook: savol tugmadan keyin chiqadi; tanlangan variant neytral ramka (U1); javob izohi tanlovga qarab uch xil.
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Bot buzilgan, dasturi ishlamay qoldi', ru: "Бот сломался, программа перестала работать" } },
  { id: 'b', label: { uz: "Bot har xabarni alohida ko'radi, oldingisini eslamaydi", ru: "Бот видит каждое сообщение отдельно и не помнит предыдущее" } },
  { id: 'c', label: { uz: "Internet sekin, xabarning bir qismi yo'qoldi", ru: "Интернет медленный, часть сообщения потерялась" } }
];
const HOOK_ACK = {
  b: { uz: <><b>Aynan!</b> Bu bot oldingi xabarlarni saqlamaydi: «Pepperoni» kelganda o'zi «Qaysi pitsa?» deb so'raganini bilmaydi. Botga holat kerak — suhbat qaysi bosqichda ekanini saqlaydigan yozuv.</>, ru: <><b>Именно!</b> Этот бот не хранит прошлые сообщения: когда приходит «Пепперони», он не знает, что сам спросил «Какую пиццу?». Боту нужно состояние — запись о том, на каком этапе диалог.</> },
  a: { uz: <><b>Qiziq fikr!</b> Lekin bot ishlayapti: u «Pepperoni» ga javob berdi. U faqat o'zi «Qaysi pitsa?» deb so'raganini saqlamaydi. Botga holat kerak — suhbat qaysi bosqichda ekanini saqlaydigan yozuv.</>, ru: <><b>Интересная мысль!</b> Но бот работает: он ответил на «Пепперони». Он просто не хранит то, что сам спросил «Какую пиццу?». Боту нужно состояние — запись о том, на каком этапе диалог.</> },
  c: { uz: <><b>Qiziq fikr!</b> Lekin xabar yetib keldi: bot «Pepperoni» ga javob berdi. U faqat o'zi «Qaysi pitsa?» deb so'raganini saqlamaydi. Botga holat kerak — suhbat qaysi bosqichda ekanini saqlaydigan yozuv.</>, ru: <><b>Интересная мысль!</b> Но сообщение дошло: бот ответил на «Пепперони». Он просто не хранит то, что сам спросил «Какую пиццу?». Боту нужно состояние — запись о том, на каком этапе диалог.</> }
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [tried, setTried] = useState(!!storedAnswer);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const poke = () => { setTried(true); setSc(n => n + 1); };
  const pick = (v) => { if (picked !== null || !tried) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: "Введение" })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr({ uz: <>Aziza <span className="italic" style={{ color: T.accent }}>«Pepperoni»</span> deb yozdi, bot esa tushunmadi. Nega?</>, ru: <>Азиза написала <span className="italic" style={{ color: T.accent }}>«Пепперони»</span>, а бот не понял. Почему?</> })}</h1>
        <Mentor>{tr({ uz: "3-darsda botingizga handler va tugmalar yozdingiz. Endi mijoz bir necha xabar bilan buyurtma beryapti. Tugmani bosing va bot qanday javob berishini kuzating.", ru: "На 3-м уроке Вы написали для своего бота handler и кнопки. Теперь клиент делает заказ в несколько сообщений. Нажмите кнопку и посмотрите, как отвечает бот." })}</Mentor>
        <Zoomable><Split>
          <Col>
            <TgChat title={{ uz: 'AvtoPizza bot', ru: "AvtoPizza bot" }} minH={150}>
              <Bubble from="bot">{tr({ uz: 'Salom! Nima buyurtma qilasiz?', ru: 'Привет! Что заказываете?' })}</Bubble>
              {tried && <><Bubble from="user">{tr({ uz: 'Pitsa buyurtma qilaman', ru: 'Хочу заказать пиццу' })}</Bubble>
                <Bubble from="bot">{tr({ uz: 'Ajoyib! Qaysi pitsa?', ru: 'Отлично! Какую пиццу?' })}</Bubble>
                <Bubble from="user">{tr({ uz: 'Pepperoni', ru: 'Пепперони' })}</Bubble>
                <Bubble from="bot">{tr({ uz: 'Nima pepperoni? Tushunmadim.', ru: "Какое пепперони? Не понял." })}</Bubble></>}
            </TgChat>
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={poke} disabled={tried}>{tried ? tr({ uz: "✓ Suhbatni ko'rdingiz", ru: '✓ Вы увидели диалог' }) : tr({ uz: '▶ Suhbatni davom ettirish', ru: '▶ Продолжить диалог' })}</button>
          </Col>
          <Col>
            {tried && <>
              <p className="eyebrow fade-step" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Sizningcha, bot nega adashdi?', ru: "Как Вы думаете, почему бот ошибся?" })}</p>
              <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {HOOK_OPTS.map(o => { const on = picked === o.id; return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>); })}
              </div>
              {picked !== null && HOOK_ACK[picked] && <p className="hook-ack fade-step">{tr(HOOK_ACK[picked])}</p>}
            </>}
          </Col>
        </Split></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  // U1: qadamlar — oddiy raqamli ro'yxat, yorliq-teglarsiz
  const STEPS = [
    { uz: 'Bot nega unutadi — holatsiz bot', ru: "Почему бот забывает — бот без состояния" },
    { uz: "Holat: dastur xotirasida va PostgreSQL'da", ru: "Состояние: в памяти программы и в PostgreSQL" },
    { uz: 'Ikki mijoz — har biriga alohida sessiya', ru: "Два клиента — каждому отдельная сессия" },
    { uz: 'Xabar oqimi: SELECT → tekshirish → UPDATE, yangi mijozga INSERT', ru: "Поток сообщения: SELECT → проверка → UPDATE, новому клиенту — INSERT" }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const Preview = (
    <Col>
      <p className="flow-label">{tr({ uz: 'dars oxirida — bot suhbatni eslab qoladi', ru: "в конце урока — бот запоминает диалог" })}</p>
      <TgChat title={{ uz: 'AvtoPizza bot · holat bilan', ru: "AvtoPizza bot · с состоянием" }} minH={0}>
        <Bubble from="user">{tr({ uz: 'Katta', ru: "Большая" })}</Bubble>
        <Bubble from="bot">{tr({ uz: 'Yaxshi, Aziza: katta Pepperoni. Endi manzilingizni yuboring.', ru: "Хорошо, Азиза: большая Пепперони. Теперь отправьте свой адрес." })}</Bubble>
      </TgChat>
    </Col>
  );
  const StepsB = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 4 qadam', ru: '4 шага сегодня' })}</p>
      <ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s)}</span></span></li>))}</ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun botingiz suhbatni <span className="italic" style={{ color: T.accent }}>eslab qolishni</span> o'rganadi.</>, ru: <>Сегодня Ваш бот научится <span className="italic" style={{ color: T.accent }}>запоминать</span> диалог.</> })}</h2></div>
        <Mentor>{tr({ uz: "1-darsda buyurtma suhbatini ko'rgansiz: manzil kelganda bot qaysi pitsa tanlanganini bilishi kerak edi. Buning uchun holat kerak. Bugun botga holat qo'shamiz va uni backend darslaridan tanish PostgreSQL'da saqlaymiz.", ru: "На 1-м уроке Вы видели диалог заказа: когда приходит адрес, бот должен знать, какую пиццу выбрали. Для этого нужно состояние. Сегодня добавим боту состояние и будем хранить его в PostgreSQL, знакомом Вам по урокам backend." })}</Mentor>
        {!isNarrow ? (<Zoomable><Split>{Preview}{StepsB}</Split></Zoomable>)
          : !showSteps ? <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{Preview}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "4 qadamni ko'rish", ru: 'Посмотреть 4 шага' })}</button></div>
            : <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Natijani ko'rish", ru: '↩ Посмотреть результат' })}</button>{StepsB}</div>}
      </div>
    </Stage>
  );
};


// ===== SCREEN 2 — HOLATSIZ BOT =====
const PIZZA_STEPS = [
  { u: { uz: 'Pitsa buyurtma qilaman', ru: 'Хочу заказать пиццу' }, b: { uz: 'Ajoyib! Qaysi pitsa?', ru: 'Отлично! Какую пиццу?' } },
  { u: { uz: 'Pepperoni', ru: 'Пепперони' }, b: { uz: 'Nima pepperoni? Tushunmadim.', ru: "Какое пепперони? Не понял." } },
  { u: { uz: 'Pepperoni pitsa haqida gapiryapman', ru: 'Я говорю про пиццу пепперони' }, b: { uz: "Qaysi o'lchamda? Kichikmi, kattami?", ru: 'Какого размера? Маленькая или большая?' } },
  { u: { uz: 'Katta', ru: 'Большая' }, b: { uz: 'Nima katta? Tushunmadim.', ru: "Что большая? Не понял." } }
];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? PIZZA_STEPS.length : 0);
  const [sc, setSc] = useState(0);
  const done = step >= PIZZA_STEPS.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const advance = () => { if (!done) { setStep(n => n + 1); setSc(n => n + 1); } };
  return (
    <Stage eyebrow={tr({ uz: 'Tajriba · holatsiz bot', ru: "Опыт · бот без состояния" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Suhbatni davom ettiring', ru: 'Продолжите диалог' })} (${step}/${PIZZA_STEPS.length})`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Holatsiz bot har xabarni <span className="italic" style={{ color: T.accent }}>birinchi marta ko'rgandek</span> qabul qiladi.</>, ru: <>Бот без состояния принимает каждое сообщение <span className="italic" style={{ color: T.accent }}>так, будто видит его впервые</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Aziza pitsa buyurtma qilmoqchi. Botda hali holat yo'q. Tugmani bosib suhbatni davom ettiring va o'ngda bot nimani bilishini kuzating.", ru: "Азиза хочет заказать пиццу. Состояния у бота пока нет. Нажимайте кнопку, продолжайте диалог и следите справа, что знает бот." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <TgChat title={{ uz: 'AvtoPizza bot · holatsiz', ru: "AvtoPizza bot · без состояния" }} minH={190}>
              {PIZZA_STEPS.slice(0, step).map((m, i) => (<React.Fragment key={i}><Bubble from="user">{tr(m.u)}</Bubble><Bubble from="bot">{tr(m.b)}</Bubble></React.Fragment>))}
            </TgChat>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done} onClick={advance}>{done ? tr({ uz: '✓ Aziza buyurtmasiz ketdi', ru: "✓ Азиза ушла без заказа" }) : step === 0 ? tr({ uz: '▶ Yozishni boshlash', ru: '▶ Начать переписку' }) : tr({ uz: 'Keyingi xabar →', ru: 'Следующее сообщение →' })}</button>
          </Col>
          <Col>
            <div className="sk-info"><p className="note-h">{tr({ uz: 'Bot nimani biladi', ru: "Что знает бот" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{step === 0 ? tr({ uz: 'Hali hech narsa — birinchi xabarni kutyapti.', ru: "Пока ничего — ждёт первого сообщения." }) : tr({ uz: 'Faqat hozirgi xabarni. Oldingilarini eslamaydi.', ru: "Только текущее сообщение. Предыдущие он не помнит." })}</p></div>
            {done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Aziza ikki marta «Tushunmadim» javobini oldi. Bot «Pepperoni» va «Katta» ni oldi, lekin ular qaysi savolga javob ekanini bilmadi: o'zi nima so'raganini eslamaydi. Unga <b>holat</b> kerak.</>, ru: <>Азиза дважды получила ответ «Не понял». Бот получил «Пепперони» и «Большая», но не знал, на какой вопрос это ответы: он не помнит, что сам спрашивал. Ему нужно <b>состояние</b>.</> })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — MARKAZIY: BOTGA HOLAT QO'SHAMIZ (xabar → holat strelkasi, A7) =====
// A10: holat qiymatlari butun darsda bir xil yozuvda (PITSA_KUTYAPMAN · OLCHAM_KUTYAPMAN · … · TAYYOR).
const HOLAT_STEPS = [
  { u: { uz: 'Pitsa buyurtma qilaman', ru: 'Хочу заказать пиццу' }, b: { uz: 'Ajoyib! Qaysi pitsa?', ru: 'Отлично! Какую пиццу?' }, holat: 'PITSA_KUTYAPMAN', tanlov: '—', chg: ['holat'] },
  { u: { uz: 'Pepperoni', ru: 'Пепперони' }, b: { uz: "Pepperoni — yaxshi tanlov! Qaysi o'lchamda?", ru: "Пепперони — отличный выбор! Какого размера?" }, holat: 'OLCHAM_KUTYAPMAN', tanlov: { uz: 'Pepperoni', ru: 'Пепперони' }, chg: ['holat', 'tanlov'] },
  { u: { uz: 'Katta', ru: 'Большая' }, b: { uz: 'Rahmat! Buyurtmangiz: katta Pepperoni. Manzilni yuboring.', ru: "Спасибо! Ваш заказ: большая Пепперони. Отправьте адрес." }, holat: 'MANZIL_KUTYAPMAN', tanlov: { uz: 'Pepperoni, katta', ru: "Пепперони, большая" }, chg: ['holat', 'tanlov'] }
];
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [attached, setAttached] = useState(!!storedAnswer);
  const [step, setStep] = useState(storedAnswer ? HOLAT_STEPS.length : 0);
  const [sc, setSc] = useState(0);
  const wrapRef = useRef(null);
  const done = attached && step >= HOLAT_STEPS.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const attach = () => { setAttached(true); setSc(n => n + 1); };
  const advance = () => { if (!done) { setStep(n => n + 1); setSc(n => n + 1); } };
  const cur = step > 0 ? HOLAT_STEPS[step - 1] : null;
  const arrows = step > 0 && !storedAnswer ? [{ from: 'u-last', to: 'hp-holat-v', row: 'hp-holat' }] : [];
  return (
    <Stage eyebrow={tr({ uz: 'Markaziy · holat', ru: "Главное · состояние" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (!attached ? tr({ uz: "Holat qo'shing", ru: "Добавьте состояние" }) : `${tr({ uz: 'Suhbatni kuzating', ru: 'Следите за диалогом' })} (${step}/${HOLAT_STEPS.length})`)} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Botga holat qo'shamiz — endi u suhbatni <span className="italic" style={{ color: T.accent }}>eslab qoladi</span>.</>, ru: <>Добавляем боту состояние — теперь он <span className="italic" style={{ color: T.accent }}>запоминает</span> диалог.</> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: T.ink }}>Holat</b> — bot suhbat haqida eslab qoladigan yozuv: suhbat qaysi bosqichda va mijoz nimani tanlagan. Holat qo'shing, keyin xabarlarni birma-bir oching va o'ngda holat qanday o'zgarishini kuzating.</>, ru: <><b style={{ color: T.ink }}>Состояние</b> — запись, которую бот хранит о диалоге: на каком он этапе и что выбрал клиент. Добавьте состояние, затем открывайте сообщения по одному и следите справа, как меняется состояние.</> })}</Mentor>
        <Zoomable><div className="split ln-wrap" ref={wrapRef}>
          <Col>
            {!attached ? (
              <div className="frame-dash" style={{ textAlign: 'center' }}>
                <p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Botda hali holat yo'q.", ru: "У бота пока нет состояния." })}</p>
                <button className="btn" onClick={attach}>{tr({ uz: "Holat qo'shish", ru: "Добавить состояние" })}</button>
              </div>
            ) : (
              <>
                <TgChat title={{ uz: 'AvtoPizza bot · holat bilan', ru: "AvtoPizza bot · с состоянием" }} minH={190}>
                  {HOLAT_STEPS.slice(0, step).map((m, i) => (<React.Fragment key={i}><Bubble from="user" ln={i === step - 1 ? 'u-last' : undefined}>{tr(m.u)}</Bubble><Bubble from="bot">{tr(m.b)}</Bubble></React.Fragment>))}
                </TgChat>
                <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done} onClick={advance}>{done ? tr({ uz: '✓ Buyurtma qabul qilindi', ru: '✓ Заказ принят' }) : step === 0 ? tr({ uz: '▶ Yozishni boshlash', ru: '▶ Начать переписку' }) : tr({ uz: 'Keyingi xabar →', ru: 'Следующее сообщение →' })}</button>
              </>
            )}
          </Col>
          <Col>
            <HolatPanel key={`${attached}-${step}`} ln="hp" title={{ uz: 'Suhbat holati', ru: "Состояние диалога" }}
              mijoz={attached ? { uz: 'Aziza', ru: 'Азиза' } : '—'} holat={cur ? cur.holat : '—'} tanlov={cur ? cur.tanlov : '—'}
              chg={cur ? cur.chg : (attached ? ['mijoz'] : [])} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Har xabardan keyin holat yangilandi. Shuning uchun «Katta» endi ma'noli: bot holatdan o'zi o'lcham so'raganini biladi. Holatni eslab qoladigan bot <b>holatli (stateful) bot</b> deb ataladi.</>, ru: <>После каждого сообщения состояние обновлялось. Поэтому «Большая» теперь понятна: из состояния бот знает, что сам спросил размер. Бот, который запоминает состояние, называется <b>ботом с состоянием (stateful)</b>.</> })}</p></div>}
          </Col>
          <LinkArrows wrapRef={wrapRef} links={arrows} k={step} />
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 (✔ o'rni: 2) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    questionText="Bot o'zi o'lcham so'radi, lekin «Katta» javobini tushunmadi. Nega?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Bot o'zi o'lcham so'radi, lekin <span className="italic" style={{ color: T.accent }}>«Katta»</span> javobini tushunmadi. Nega?</>, ru: <>Бот сам спросил размер, но не понял ответ <span className="italic" style={{ color: T.accent }}>«Большая»</span>. Почему?</> })}</h2></>}
    options={[tr({ uz: "Internet sekin bo'lib, xabar Bot API'ga yetmadi", ru: "Интернет был медленный, сообщение не дошло до Bot API" }), tr({ uz: 'Mijoz juda tez yozdi, handler ulgurmay qoldi', ru: "Клиент писал слишком быстро, handler не успел" }), tr({ uz: "Bot holatni saqlamaydi, o'z savolini eslamaydi", ru: "Бот не хранит состояние и не помнит свой вопрос" }), tr({ uz: 'Telegram xabarlarni aralash tartibda yetkazdi', ru: "Telegram доставил сообщения вперемешку" })]} correctIdx={2}
    explainCorrect={tr({ uz: "Bot holatni saqlamaydi, shuning uchun «Katta» qaysi savolga javob ekanini bilmaydi.", ru: "Бот не хранит состояние, поэтому не знает, на какой вопрос отвечает «Большая»." })}
    explainWrong={{
      0: tr({ uz: "Xabar yetib kelgan: bot unga javob berdi. Muammo — bot o'z savolini eslamaydi.", ru: "Сообщение дошло: бот на него ответил. Проблема — бот не помнит свой вопрос." }),
      1: tr({ uz: "Tezlik sabab emas: handler har xabarni oladi. Muammo — oldingi xabar hech qayerda saqlanmaydi.", ru: "Дело не в скорости: handler получает каждое сообщение. Проблема — предыдущее сообщение нигде не сохраняется." }),
      3: tr({ uz: 'Telegram bitta chatdagi xabarlarni kelgan tartibida yetkazadi. Muammo boshqa joyda.', ru: "Telegram доставляет сообщения одного чата в том порядке, в каком они пришли. Проблема в другом." }),
      default: tr({ uz: "Holat saqlanmasa, bot har xabarni alohida ko'radi va oldingisini eslamaydi.", ru: "Если состояние не хранится, бот видит каждое сообщение отдельно и не помнит предыдущее." })
    }} />
);


// ===== SCREEN 5 — HOLAT KODDAGI OBYEKTDA (dastur xotirasi) =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [show, setShow] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = show;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Kod · dastur xotirasi', ru: "Код · память программы" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Kamchiligini ko'ring", ru: 'Посмотрите на минус' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Holatni saqlashning eng sodda yo'li — <span className="italic" style={{ color: T.accent }}>koddagi obyekt</span>.</>, ru: <>Самый простой способ хранить состояние — <span className="italic" style={{ color: T.accent }}>объект в коде</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Holatni oddiy JavaScript obyektida saqlash mumkin. Mijoz bot bilan shaxsiy chatda yozadi, shuning uchun uning holati chat raqami — <code className="qcode">ctx.chat.id</code> bo'yicha yoziladi. Bu ishlaydi, lekin bitta jiddiy kamchiligi bor. Tugmani bosing.</>, ru: <>Состояние можно хранить в обычном объекте JavaScript. Клиент пишет боту в личном чате, поэтому его состояние записывается по номеру чата — <code className="qcode">ctx.chat.id</code>. Это работает, но есть один серьёзный минус. Нажмите кнопку.</> })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <pre className="code-box" style={{ lineHeight: 1.9 }}>
              <Cm>{tr({ uz: "// Har chatning holati — oddiy obyektda", ru: "// Состояние каждого чата — в обычном объекте" })}</Cm>{'\n'}
              <Jx>const</Jx>{" holatlar = {}"}{'   '}<Cm>{'// { chat.id: holat }'}</Cm>{'\n\n'}
              <Cm>{tr({ uz: '// Mijoz pitsani tanladi:', ru: '// Клиент выбрал пиццу:' })}</Cm>{'\n'}
              {"holatlar[ctx.chat.id] = "}<St>"OLCHAM_KUTYAPMAN"</St>{'\n\n'}
              <Cm>{tr({ uz: '// Keyingi xabar kelganda:', ru: '// Когда приходит следующее сообщение:' })}</Cm>{'\n'}
              <Jx>const</Jx>{' holat = holatlar[ctx.chat.id]'}
            </pre>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={show} onClick={() => { setShow(true); setSc(n => n + 1); }}>{show ? tr({ uz: "✓ Ko'rdingiz", ru: '✓ Вы увидели' }) : tr({ uz: 'Kamchiligi nimada?', ru: "В чём минус?" })}</button>
          </Col>
          <Col>
            {show
              ? <div className="frame-warn fade-step"><p className="body zb-notch" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu obyekt <b>dastur xotirasida (RAM)</b> turadi. Bot qayta ishga tushsa, xotira tozalanadi va barcha holatlar yo'qoladi: suhbat o'rtasidagi mijozlar boshidan boshlashga majbur bo'ladi. React darslarida ham shunday edi: sahifani yangilasangiz, xotiradagi ro'yxat yo'qolardi. Yechim — holatni <b>PostgreSQL'ga</b> yozish.</>, ru: <>Этот объект хранится <b>в памяти программы (RAM)</b>. При перезапуске бота память очищается и все состояния пропадают: клиентам посреди диалога придётся начинать сначала. На уроках React было так же: если обновить страницу, список в памяти пропадал. Решение — записывать состояние <b>в PostgreSQL</b>.</> })}</p></div>
              : null}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — MARKAZIY: QAYTA ISHGA TUSHIRISH (RAM qatori o'chib boradi, A7) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [restarted, setRestarted] = useState(!!storedAnswer);
  const [wiping, setWiping] = useState(false);
  const [sc, setSc] = useState(0);
  const done = restarted;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const restart = () => {
    if (restarted || wiping) return;
    const calm = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm) { setRestarted(true); setSc(n => n + 1); return; }
    setWiping(true);
    setTimeout(() => { setWiping(false); setRestarted(true); setSc(n => n + 1); }, 850);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Markaziy · qayta ishga tushirish', ru: "Главное · перезапуск" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Botni qayta ishga tushiring', ru: 'Перезапустите бота' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Botni <span className="italic" style={{ color: T.accent }}>qayta ishga tushiring</span>: nima qoladi, nima yo'qoladi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Перезапустите</span> бота: что останется, а что пропадёт?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bot serveri vaqti-vaqti bilan qayta ishga tushadi: yangi versiya chiqqanda yoki nosozlikdan keyin. Tugmani bosing va ikkala qutiga qarang.", ru: "Сервер бота время от времени перезапускается: когда выходит новая версия или после сбоя. Нажмите кнопку и посмотрите на оба блока." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className={`mem-box ${restarted ? 'gone' : ''}`}>
              <p className="note-h" style={{ color: restarted ? T.danger : T.ink2 }}>{tr({ uz: 'Dastur xotirasi (RAM) — vaqtinchalik', ru: "Память программы (RAM) — временная" })}</p>
              {restarted
                ? <p className="body" style={{ margin: 0, color: T.danger }}>{tr({ uz: "bo'sh — holatlar yo'qoldi", ru: "пусто — состояния пропали" })}</p>
                : <p className={`body mono mem-line ${wiping ? 'wipe' : ''}`} style={{ margin: 0, color: T.ink }}>holatlar = {'{'} 558210300: "MANZIL_KUTYAPMAN" {'}'}</p>}
            </div>
            <div className="mem-box keep">
              <p className="note-h" style={{ color: T.success }}>{tr({ uz: 'PostgreSQL — doimiy', ru: "PostgreSQL — постоянное хранилище" })}</p>
              <p className="body mono" style={{ margin: 0, color: T.ink }}>users: 558210300 · Aziza · MANZIL_KUTYAPMAN</p>
            </div>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={restarted || wiping} onClick={restart}>{restarted ? tr({ uz: '✓ Bot qayta ishga tushdi', ru: "✓ Бот перезапущен" }) : tr({ uz: 'Botni qayta ishga tushirish', ru: "Перезапустить бота" })}</button>
          </Col>
          <Col>
            {restarted
              ? <div className="frame-success fade-step"><p className="body zb-notch" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Dastur xotirasi bo'shab qoldi, <b>PostgreSQL'dagi qator esa joyida</b>. Shuning uchun holatni PostgreSQL'ga yozamiz: bot qayta ishga tushgach, Azizaning holatini bazadan o'qiydi va suhbat shu joydan davom etadi.</>, ru: <>Память программы опустела, <b>а строка в PostgreSQL на месте</b>. Поэтому состояние записываем в PostgreSQL: после перезапуска бот читает состояние Азизы из базы, и диалог продолжается с того же места.</> })}</p></div>
              : null}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — IKKI MIJOZ: UMUMIY HOLAT (aralashuv; strelkalar bitta qutiga, A7) =====
const MIX_MSGS = [
  { who: { uz: 'Aziza', ru: 'Азиза' }, u: { uz: 'Pepperoni olmoqchiman', ru: "Хочу Пепперони" } },
  { who: { uz: 'Bek', ru: 'Бек' }, u: { uz: 'Menga Margarita', ru: "Мне Маргариту" } },
  { who: { uz: 'Aziza', ru: 'Азиза' }, u: { uz: "Katta o'lchamda, iltimos", ru: 'Большого размера, пожалуйста' } }
];
// umumiy holat har xabardan keyin ustiga yoziladi — oxirgi yozuv qoladi
const MIX_PAGE_AFTER = [{ uz: 'Pepperoni (Aziza)', ru: "Пепперони (Азиза)" }, { uz: 'Margarita (Bek)', ru: "Маргарита (Бек)" }, { uz: 'Margarita, katta (kimniki?)', ru: "Маргарита, большая (чья?)" }];
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? MIX_MSGS.length : 0);
  const [sc, setSc] = useState(0);
  const wrapRef = useRef(null);
  const done = step >= MIX_MSGS.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const advance = () => { if (!done) { setStep(n => n + 1); setSc(n => n + 1); } };
  // har xabardan bitta qutiga strelka: oldingilari turadi, yangisi chiziladi
  const arrows = MIX_MSGS.slice(0, step).map((_, i) => ({ from: `mx-${i}`, to: 'mx-box', still: i < step - 1 || !!storedAnswer }));
  return (
    <Stage eyebrow={tr({ uz: 'Muammo · ikki mijoz', ru: 'Проблема · два клиента' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Xabarlarni ko'ring", ru: 'Посмотрите сообщения' })} (${step}/${MIX_MSGS.length})`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Aziza va Bek bir vaqtda yozyapti. Holat ikkalasiga <span className="italic" style={{ color: T.accent }}>bitta</span> bo'lsa-chi?</>, ru: <>Азиза и Бек пишут одновременно. А если состояние у них <span className="italic" style={{ color: T.accent }}>одно</span> на двоих?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Faraz qiling: kodda holat <code className="qcode">chat.id</code> bo'yicha ajratilmagan — hamma mijoz uchun bitta o'zgaruvchi. Tugmani bosing va holat qanday o'zgarishini kuzating.</>, ru: <>Представьте: в коде состояние не разделено по <code className="qcode">chat.id</code> — одна переменная на всех клиентов. Нажмите кнопку и следите, как меняется состояние.</> })}</Mentor>
        <Zoomable><div className="split ln-wrap" ref={wrapRef}>
          <Col>
            <div className="mix-chat">
              {MIX_MSGS.slice(0, step).map((m, i) => (<div key={i} className="mix-line el-in"><span className="mix-who">{tr(m.who)}:</span><span className="mix-txt" data-ln={`mx-${i}`}>{tr(m.u)}</span></div>))}
            </div>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done} onClick={advance}>{done ? tr({ uz: "✓ Hammasi ko'rildi", ru: '✓ Всё просмотрено' }) : step === 0 ? tr({ uz: '▶ Xabarlarni boshlash', ru: '▶ Запустить сообщения' }) : tr({ uz: 'Keyingi xabar →', ru: 'Следующее сообщение →' })}</button>
          </Col>
          <Col>
            <HolatPanel key={step} ln="mx-box" title={{ uz: 'Umumiy holat (hamma uchun bitta)', ru: "Общее состояние (одно на всех)" }}
              mijoz="?" holat="OLCHAM_KUTYAPMAN" tanlov={step > 0 ? MIX_PAGE_AFTER[step - 1] : '—'} />
            {done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Oxirgi qatorda «Margarita, katta» turibdi, lekin «Katta» ni <b>Aziza</b> yozgan edi. Holat bitta bo'lgani uchun Bekning Margaritasi Azizaning Pepperonisi ustiga yozildi. Endi Aziza Bekning pitsasini oladi.</>, ru: <>В последней строке стоит «Маргарита, большая», но «Большого размера» писала <b>Азиза</b>. Состояние одно, поэтому Маргарита Бека записалась поверх Пепперони Азизы. Теперь Азиза получит пиццу Бека.</> })}</p></div>}
          </Col>
          <LinkArrows wrapRef={wrapRef} links={arrows} k={step} />
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST 2 (Safe Storage; ✔ o'rni: 1) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} idx={8} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    questionText="Bot serveri birdan o'chib qoldi. Qaysi holat yo'qolmaydi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Bot serveri birdan <span className="italic" style={{ color: T.accent }}>o'chib qoldi</span>. Qaysi holat yo'qolmaydi?</>, ru: <>Сервер бота вдруг <span className="italic" style={{ color: T.accent }}>выключился</span>. Какое состояние не пропадёт?</> })}</h2></>}
    options={[tr({ uz: 'Koddagi oddiy JavaScript obyektiga yozilgan holat', ru: "Состояние, записанное в обычный JavaScript-объект в коде" }), tr({ uz: "PostgreSQL'dagi users jadvaliga yozilgan holat", ru: "Состояние, записанное в таблицу users в PostgreSQL" }), tr({ uz: "Handler ichidagi o'zgaruvchiga yozilgan holat", ru: "Состояние, записанное в переменную внутри handler-а" }), tr({ uz: "Hech qaysi: server o'chsa, hammasi yo'qoladi", ru: "Никакое: если сервер выключится, пропадёт всё" })]} correctIdx={1}
    explainCorrect={tr({ uz: "PostgreSQL ma'lumotni diskka yozadi — server qayta ishga tushsa ham u joyida qoladi.", ru: "PostgreSQL записывает данные на диск — даже после перезапуска сервера они остаются на месте." })}
    explainWrong={{
      0: tr({ uz: "Bu obyekt dastur xotirasida (RAM) turadi — bot qayta ishga tushsa, bo'shab qoladi.", ru: "Этот объект хранится в памяти программы (RAM) — при перезапуске бота он опустеет." }),
      2: tr({ uz: "Handler ichidagi o'zgaruvchi ham dastur xotirasida — u keyingi xabargacha ham saqlanmaydi.", ru: "Переменная внутри handler-а тоже в памяти программы — она не сохраняется даже до следующего сообщения." }),
      3: tr({ uz: "PostgreSQL'ga yozilgan holat saqlanib qoladi — hammasi yo'qolmaydi.", ru: "Состояние, записанное в PostgreSQL, сохранится — пропадает не всё." }),
      default: tr({ uz: "Qayta ishga tushgandan keyin faqat PostgreSQL'ga yozilgan holat qoladi.", ru: "После перезапуска остаётся только состояние, записанное в PostgreSQL." })
    }} />
);


// ===== SCREEN 9 — TUZATISH: HAR MIJOZGA SESSIYA (ikki strelka — har biri o'z sessiyasiga, A7) =====
// A11: Aziza — chat.id 558210300, Pepperoni · Bek — 604417829, Margarita.
const SESS_CLIENTS = [
  { id: 'aziza', name: { uz: 'Aziza', ru: 'Азиза' }, chatId: '558210300', tanlov0: { uz: 'Pepperoni', ru: 'Пепперони' }, msg: { uz: 'Katta', ru: 'Большая' }, order: { uz: 'Pepperoni, katta', ru: "Пепперони, большая" } },
  { id: 'bek', name: { uz: 'Bek', ru: 'Бек' }, chatId: '604417829', tanlov0: { uz: 'Margarita', ru: "Маргарита" }, msg: { uz: 'Kichik', ru: "Маленькая" }, order: { uz: 'Margarita, kichik', ru: "Маргарита, маленькая" } }
];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(SESS_CLIENTS.map(c => c.id)) : new Set());
  const [together, setTogether] = useState(!!storedAnswer);
  const [showRes, setShowRes] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const wrapRef = useRef(null);
  const bothSeen = seen.size >= SESS_CLIENTS.length;
  const done = bothSeen && together && showRes;
  const tap = (id) => { setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  const all = () => {
    if (together || !bothSeen) return;
    setTogether(true); setSc(n => n + 1);
    setTimeout(() => { setShowRes(true); setSc(n => n + 1); }, 1000); // avval xabarlar va strelkalar, keyin natija
  };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const arrows = together ? SESS_CLIENTS.map(c => ({ from: `sm-${c.id}`, to: `ss-${c.id}`, still: !!storedAnswer })) : [];
  return (
    <Stage eyebrow={tr({ uz: 'Tuzatish · sessiya', ru: "Исправление · сессия" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Ikkalasini birdan sinang', ru: 'Попробуйте обоих сразу' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har mijozga <span className="italic" style={{ color: T.accent }}>alohida holat</span>.</>, ru: <>Каждому клиенту — <span className="italic" style={{ color: T.accent }}>отдельное состояние</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: T.ink }}>Sessiya</b> — bitta mijozning holati, boshqalarnikidan alohida. Bot uni <code className="qcode">chat.id</code> bo'yicha topadi. Avval har mijozni bosing, keyin ikkalasini birdan sinang.</>, ru: <><b style={{ color: T.ink }}>Сессия</b> — состояние одного клиента, отдельно от других. Бот находит его по <code className="qcode">chat.id</code>. Сначала нажмите на каждого клиента, потом попробуйте обоих сразу.</> })}</Mentor>
        <Zoomable>
        <div className="split ln-wrap" ref={wrapRef}>
          <Col>
            <div className="sess-list fade-up delay-1">
              {SESS_CLIENTS.map(c => { const open = seen.has(c.id); return (
                <div key={c.id} className="sess-item">
                  <button className={`vcard ${open ? 'seen' : ''}`} onClick={() => tap(c.id)} aria-expanded={open}>
                    <span className="vlbl">{tr(c.name)} <span style={{ color: T.ink2, fontWeight: 500 }}>{tr({ uz: "· o'z sessiyasi", ru: "· своя сессия" })}</span></span>
                    <span className="vseen" style={{ color: open ? T.success : T.ink3 }}>{open ? '✓' : '›'}</span>
                  </button>
                  {open && <div className="sess-box fade-step" data-ln={`ss-${c.id}`}>
                    <div className="daf-row"><span className="daf-k" style={{ textTransform: 'none' }}>chat.id</span><span className="daf-v mono">{c.chatId}</span></div>
                    <div className="daf-row"><span className="daf-k">{tr({ uz: 'holat', ru: "состояние" })}</span><span className="daf-v hl mono">{together ? 'MANZIL_KUTYAPMAN' : 'OLCHAM_KUTYAPMAN'}</span></div>
                    <div className="daf-row"><span className="daf-k">{tr({ uz: 'tanlov', ru: 'выбор' })}</span><span className="daf-v">{tr(together ? c.order : c.tanlov0)}</span></div>
                  </div>}
                </div>
              ); })}
            </div>
            {bothSeen && <button className="btn fade-step" style={{ alignSelf: 'flex-start' }} disabled={together} onClick={all}>{together ? tr({ uz: '✓ Ikkalasi birdan yozdi', ru: '✓ Оба написали одновременно' }) : tr({ uz: '▶ Ikkalasi birdan yozsin', ru: '▶ Пусть напишут оба сразу' })}</button>}
          </Col>
          <Col>
            {together && <div className="sess-msgs">
              {SESS_CLIENTS.map(c => <div key={c.id} className="tg-bubble user el-in sess-msg" data-ln={`sm-${c.id}`}><span className="sess-who">{tr(c.name)}</span>{tr(c.msg)}</div>)}
            </div>}
            {showRes && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>
              {SESS_CLIENTS.map(c => <React.Fragment key={c.id}><b>{tr(c.name)}</b> — {tr(c.order)}<br /></React.Fragment>)}
              {tr({ uz: "Ikkala javob bir vaqtda keldi, lekin har biri o'z sessiyasiga tushdi — hech narsa aralashmadi.", ru: "Оба ответа пришли одновременно, но каждый попал в свою сессию — ничего не перепуталось." })}
            </p></div>}
          </Col>
          <LinkArrows wrapRef={wrapRef} links={arrows} k={together ? 1 : 0} />
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TEST 3 (No Mix-Up; ✔ o'rni: 3) =====
const Screen10 = (props) => (
  <QuestionScreen {...props} idx={10} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    questionText="Aziza va Bek bir vaqtda buyurtma beryapti. Ularning suhbati aralashmasligi uchun nima kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Aziza va Bek bir vaqtda buyurtma beryapti. Ularning suhbati <span className="italic" style={{ color: T.accent }}>aralashmasligi</span> uchun nima kerak?</>, ru: <>Азиза и Бек заказывают одновременно. Что нужно, чтобы их диалоги <span className="italic" style={{ color: T.accent }}>не перепутались</span>?</> })}</h2></>}
    options={[tr({ uz: "Ikkala mijozning holatini bitta umumiy o'zgaruvchida saqlash", ru: "Хранить состояние обоих клиентов в одной общей переменной" }), tr({ uz: 'Har mijoz uchun alohida bot ochib, alohida token berish', ru: "Создать каждому клиенту отдельного бота и отдельный токен" }), tr({ uz: "Umumiy holatni obyektda emas, PostgreSQL'da saqlash", ru: "Хранить общее состояние не в объекте, а в PostgreSQL" }), tr({ uz: 'Har mijozga alohida sessiya ochib, holatini unda saqlash', ru: "Открыть каждому клиенту сессию и хранить состояние в ней" })]} correctIdx={3}
    explainCorrect={tr({ uz: "Har mijozning holati o'z `chat.id` si bo'yicha alohida saqlanadi.", ru: "Состояние каждого клиента хранится отдельно по его `chat.id`." })}
    explainWrong={{
      0: tr({ uz: "Bitta umumiy o'zgaruvchi aralashuvga olib keladi: oxirgi yozuv oldingisining ustiga yoziladi.", ru: "Одна общая переменная приводит к путанице: последняя запись затирает предыдущую." }),
      1: tr({ uz: "Har mijozga alohida bot kerak emas: bitta bot holatni `chat.id` bo'yicha ajratsa yetadi.", ru: "Отдельный бот каждому клиенту не нужен: достаточно, чтобы один бот разделял состояние по `chat.id`." }),
      2: tr({ uz: "PostgreSQL holatni saqlab qoladi, lekin u hammaga bitta bo'lsa, baribir aralashadi.", ru: "PostgreSQL сохранит состояние, но если оно одно на всех, путаница всё равно будет." }),
      default: tr({ uz: 'Har mijozning holatini alohida sessiyada saqlash kerak.', ru: "Состояние каждого клиента нужно хранить в отдельной сессии." })
    }} />
);

// ===== SCREEN 11 — POSTGRESQL: users JADVALI (holat — urg'u rangida) =====
const SCHEMA_COLS = [
  { id: 'tg', tok: 'telegram_id', desc: { uz: "Mijozning Telegram raqami; shaxsiy chatda u `ctx.chat.id` ga teng. Bot mijozning qatorini shu raqam bilan topadi.", ru: "Telegram-номер клиента; в личном чате он равен `ctx.chat.id`. По этому номеру бот находит строку клиента." } },
  { id: 'ism', tok: 'ism', desc: { uz: "Mijozning ismi. Bir marta so'raladi va keyingi safar ham kerak bo'ladi.", ru: "Имя клиента. Его спрашивают один раз, и оно пригодится в следующий раз." } },
  { id: 'holat', tok: 'holat', desc: { uz: "Suhbat hozir qaysi bosqichda, masalan `MANZIL_KUTYAPMAN`. Keyingi xabarni bot shu qiymatga qarab tushunadi.", ru: "На каком этапе сейчас диалог, например `MANZIL_KUTYAPMAN`. По этому значению бот понимает следующее сообщение." } },
  { id: 'tanlov', tok: 'tanlov', desc: { uz: "Mijoz hozirgacha nimani tanlagani, masalan «Pepperoni, katta». Buyurtma oxirida bot shu yerdan o'qiydi.", ru: "Что клиент уже выбрал, например «Пепперони, большая». В конце заказа бот читает это отсюда." } }
];
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(SCHEMA_COLS.map(c => c.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= SCHEMA_COLS.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const cur = SCHEMA_COLS.find(c => c.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'PostgreSQL · users jadvali', ru: "PostgreSQL · таблица users" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: '4 ustunni oching', ru: 'Откройте 4 колонки' })} (${seen.size}/4)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Holat PostgreSQL'da: <span className="italic" style={{ color: T.accent }}>users</span> jadvali.</>, ru: <>Состояние в PostgreSQL: таблица <span className="italic" style={{ color: T.accent }}>users</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Backend darslarida PostgreSQL'da jadval yaratgansiz. Bot uchun ham shunday jadval kerak: har mijoz — bitta qator, uning sessiyasi shu qatorda saqlanadi. Har ustunni bosib, nima saqlashini o'qing.", ru: "На уроках backend Вы создавали таблицы в PostgreSQL. Боту нужна такая же таблица: каждый клиент — одна строка, и его сессия хранится в этой строке. Нажмите на каждую колонку и прочитайте, что она хранит." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <pre className="code-box" style={{ lineHeight: 1.9 }}>
              <Jx>CREATE TABLE</Jx>{' users ('}{'\n'}
              {'  '}<At>id</At>{'           '}<Jx>SERIAL</Jx>{' PRIMARY KEY,'}{'\n'}
              {'  '}<At>telegram_id</At>{'  '}<Jx>BIGINT</Jx>{' NOT NULL UNIQUE,'}{'\n'}
              {'  '}<At>ism</At>{'          '}<Jx>TEXT</Jx>{','}{'\n'}
              <span className="code-hl">{'  '}<At>holat</At>{'        '}<Jx>TEXT</Jx>{' NOT NULL,'}</span>{'\n'}
              {'  '}<At>tanlov</At>{'       '}<Jx>TEXT</Jx>{'\n'}
              {')'}
            </pre>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {SCHEMA_COLS.map(c => <button key={c.id} className={`gchip ${c.id === 'holat' ? 'gchip-hl' : ''} ${seen.has(c.id) ? 'seen' : ''}`} onClick={() => tap(c.id)}><span className="mono">{c.tok}</span><span className="gchip-mk">{seen.has(c.id) ? '✓' : '›'}</span></button>)}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="note-h zb-notch"><span className="mono" style={{ color: T.accent, fontSize: 12 }}>{cur.tok}</span></p><p className="body" style={{ margin: 0, color: T.ink }}>{fmtCode(tr(cur.desc))}</p></div>
              : null}
            {done && <DbTable rows={[{ id: 1, tg: '558210300', ism: 'Aziza', holat: 'MANZIL_KUTYAPMAN', tanlov: { uz: 'Pepperoni, katta', ru: "Пепперони, большая" } }]} hlCol="holat" hlRow={0} />}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — HAYOTIY: AVTOPIZZA BUYURTMASI (holat va tanlov paneli) =====
const ORDER_STEPS = [
  { u: '/start', b: { uz: "Salom! Pitsa o'lchamini tanlang: kichik yoki katta?", ru: "Привет! Выберите размер пиццы: маленькая или большая?" }, holat: 'OLCHAM_KUTYAPMAN', tanlov: '—' },
  { u: { uz: 'Katta', ru: 'Большая' }, b: { uz: "Yaxshi! Qo'shimcha pishloq qo'shaymi? (ha / yo'q)", ru: "Отлично! Добавить дополнительный сыр? (да / нет)" }, holat: 'QOSHIMCHA_KUTYAPMAN', tanlov: { uz: 'katta', ru: "большая" } },
  { u: { uz: 'Ha', ru: 'Да' }, b: { uz: "Qo'shdim. Endi manzilingizni yuboring.", ru: "Добавил. Теперь отправьте свой адрес." }, holat: 'MANZIL_KUTYAPMAN', tanlov: { uz: 'katta, pishloq', ru: "большая, сыр" } },
  { u: { uz: 'Chilonzor 5-uy', ru: 'Чиланзар, дом 5' }, b: { uz: "Rahmat! Buyurtma: katta, qo'shimcha pishloq bilan, Chilonzor 5-uy. Qabul qilindi.", ru: "Спасибо! Заказ: большая, с дополнительным сыром, Чиланзар, дом 5. Принят." }, holat: 'TAYYOR', tanlov: { uz: 'katta, pishloq, Chilonzor 5-uy', ru: "большая, сыр, Чиланзар, дом 5" } }
];
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [shown, setShown] = useState(storedAnswer ? ORDER_STEPS.length : 0);
  const [phase, setPhase] = useState('idle');
  const [sc, setSc] = useState(0);
  const done = shown >= ORDER_STEPS.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const advance = () => {
    if (phase === 'think') return;
    setPhase('think'); setSc(n => n + 1);
    setTimeout(() => { setShown(n => Math.min(n + 1, ORDER_STEPS.length)); setPhase('idle'); setSc(n => n + 1); }, 750);
  };
  const cur = shown > 0 ? ORDER_STEPS[shown - 1] : null;
  return (
    <Stage eyebrow={tr({ uz: 'Hayotiy · buyurtma', ru: 'Из жизни · заказ' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Buyurtmani yig'ing", ru: 'Соберите заказ' })} (${shown}/4)`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AvtoPizza buyurtmasi <span className="italic" style={{ color: T.accent }}>qadam-baqadam</span>.</>, ru: <>Заказ в AvtoPizza <span className="italic" style={{ color: T.accent }}>шаг за шагом</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Buyurtmani qadam-baqadam oching va har javobdan keyin holat qanday o'zgarishini kuzating.", ru: "Открывайте заказ шаг за шагом и следите, как меняется состояние после каждого ответа." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <TgChat title={{ uz: 'AvtoPizza bot', ru: "AvtoPizza bot" }} minH={210}>
              {ORDER_STEPS.slice(0, shown).map((s, i) => (<React.Fragment key={i}><Bubble from="user">{tr(s.u)}</Bubble><Bubble from="bot">{tr(s.b)}</Bubble></React.Fragment>))}
              {phase === 'think' && <TgTyping />}
            </TgChat>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done || phase === 'think'} onClick={advance}>{done ? tr({ uz: '✓ Buyurtma qabul qilindi', ru: '✓ Заказ принят' }) : shown === 0 ? tr({ uz: '▶ Buyurtmani boshlash', ru: '▶ Начать заказ' }) : tr({ uz: 'Keyingi javob →', ru: 'Следующий ответ →' })}</button>
          </Col>
          <Col>
            <HolatPanel key={shown} title={{ uz: 'Suhbat holati · Aziza', ru: "Состояние диалога · Азиза" }} holat={cur ? cur.holat : '—'} tanlov={cur ? cur.tanlov : '—'} />
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Bot «Katta» va «Ha» kabi qisqa javoblarni holatga qarab tushundi. Har xabarda u holatni bazadan o'qiydi va yangisini yozadi — shuning uchun o'rtada qayta ishga tushsa ham, suhbat shu joydan davom etadi.", ru: "Бот понял короткие ответы вроде «Большая» и «Да» по состоянию. На каждом сообщении он читает состояние из базы и записывает новое — поэтому, даже если бот перезапустится посреди заказа, диалог продолжится с того же места." })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};


// ===== SCREEN 13 — AMALIYOT: SQL SO'ROVLARI (bo'shliqlar navbat bilan, A6) =====
// Ballsiz (faqat SQL Writer nishoni): variantlar aralash (4-savol A), nishon sharti variant MATNI bo'yicha (indeks emas).
const SQL_BLANKS = [
  { key: 'sel', correct: 'SELECT', options: ['UPDATE', 'SELECT', 'INSERT'], wrong: { UPDATE: { uz: "UPDATE — ma'lumotni o'zgartiradi; bu yerda esa avval o'qish kerak.", ru: "UPDATE — изменяет данные; а здесь сначала нужно прочитать." }, INSERT: { uz: "INSERT — yangi qator qo'shadi; bu yerda mavjud qatorni o'qiymiz.", ru: "INSERT — добавляет новую строку; а здесь мы читаем существующую." } } },
  { key: 'upd', correct: 'UPDATE', options: ['SELECT', 'DELETE', 'UPDATE'], wrong: { SELECT: { uz: "SELECT faqat o'qiydi; bu yerda holatni yangilash kerak.", ru: "SELECT только читает; а здесь нужно обновить состояние." }, DELETE: { uz: "DELETE qatorni o'chiradi; bizga esa holatni yangilash kerak.", ru: "DELETE удаляет строку; а нам нужно обновить состояние." } } },
  { key: 'ins', correct: 'INSERT', options: ['SELECT', 'INSERT', 'UPDATE'], wrong: { SELECT: { uz: "SELECT mavjud qatorni o'qiydi, yangi qator qo'shmaydi.", ru: "SELECT читает существующую строку и не добавляет новую." }, UPDATE: { uz: "UPDATE faqat mavjud qatorni o'zgartiradi — yangi mijozning qatori hali yo'q.", ru: "UPDATE изменяет только существующую строку — а строки нового клиента ещё нет." } } }
];
const SQL_TAILS = [' * FROM users WHERE telegram_id = $1', ' users SET holat = $1 WHERE telegram_id = $2', ' INTO users (telegram_id, holat) VALUES ($1, $2)'];
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [filled, setFilled] = useState(() => (storedAnswer ? Object.fromEntries(SQL_BLANKS.map(b => [b.key, b.correct])) : {}));
  const [shakeKey, setShakeKey] = useState(null);
  const [wrongMsg, setWrongMsg] = useState('');
  const wrongEverRef = useRef(storedAnswer ? (storedAnswer.correct === false) : false);
  const [sc, setSc] = useState(0);
  const done = SQL_BLANKS.every(b => filled[b.key] === b.correct);
  const curIdx = SQL_BLANKS.findIndex(b => filled[b.key] !== b.correct);
  const cur = curIdx >= 0 ? SQL_BLANKS[curIdx] : null;
  const fired = useRef(!!storedAnswer);
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onAnswer(screen, { stage: 'builder', screenIdx: screen, question: "SQL bo'shliqlarini to'ldiring", correct: !wrongEverRef.current, solved: true, picked: true });
    }
  }, [done]); // eslint-disable-line
  const pick = (blank, val) => {
    if (filled[blank.key] === blank.correct) return;
    if (val === blank.correct) { setFilled(f => ({ ...f, [blank.key]: val })); setWrongMsg(''); setShakeKey(null); setSc(n => n + 1); }
    else { wrongEverRef.current = true; if (achMiss) achMiss.miss(screen); setShakeKey(blank.key); setWrongMsg(tr(blank.wrong[val]) || tr({ uz: "Bu to'g'ri emas.", ru: 'Это неверно.' })); setTimeout(() => setShakeKey(k => (k === blank.key ? null : k)), 500); }
  };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · SQL', ru: "Практика · SQL" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Bo'shliqlarni to'ldiring", ru: 'Заполните пропуски' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Holat bilan ishlaydigan <span className="italic" style={{ color: T.accent }}>uchta SQL so'rovi</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Три SQL-запроса</span> для работы с состоянием.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Handler bu so'rovlarni backend darslaridagidek <code className="qcode">pool.query(...)</code> bilan yuboradi. Bo'shliqlarni navbat bilan to'ldiring.</>, ru: <>Handler отправляет эти запросы через <code className="qcode">pool.query(...)</code>, как на уроках backend. Заполните пропуски по очереди.</> })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <p className="flow-label">SQL</p>
            <pre className="code-box" style={{ lineHeight: 1.9 }}>
              {SQL_BLANKS.map((b, i) => (
                <React.Fragment key={b.key}>
                  <span className={`sql-blank ${i === curIdx ? 'cur' : ''} ${filled[b.key] ? 'ok' : ''}`}>{filled[b.key] || '____'}</span>{SQL_TAILS[i]}{i < SQL_BLANKS.length - 1 ? '\n\n' : ''}
                </React.Fragment>
              ))}
            </pre>
          </Col>
          <Col>
            {cur && (
              <div key={cur.key} className="blank-group fade-step">
                <span className="bg-lbl">{curIdx + 1}{tr({ uz: "-bo'shliq", ru: "-й пропуск" })}</span>
                <div className="blank-row">
                  {cur.options.map(opt => <button key={opt} className={`gchip tap-hint ${shakeKey === cur.key ? 'shake' : ''}`} onClick={() => pick(cur, opt)}>{opt}</button>)}
                </div>
                {wrongMsg && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{wrongMsg}</p></div>}
              </div>
            )}
            {!done && <AchRule screen={screen} />}
            {done && <div className="frame-success fade-step"><p className="body zb-notch" style={{ margin: 0, color: T.ink }}>{fmtCode(tr({ uz: "To'g'ri: `SELECT` holatni o'qiydi, `UPDATE` holatni yangilaydi, `INSERT` yangi mijozga qator qo'shadi.", ru: "Верно: `SELECT` читает состояние, `UPDATE` обновляет состояние, `INSERT` добавляет строку новому клиенту." }))}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — TEST 4 (✔ o'rni: 0) =====
const Screen14 = (props) => (
  <QuestionScreen {...props} idx={14} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    questionText="Mijoz birinchi marta /start bosdi, jadvalda uning qatori hali yo'q. Qaysi buyruq kerak?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Mijoz birinchi marta <span className="mono" style={{ color: T.accent }}>/start</span> bosdi, jadvalda uning qatori <span className="italic" style={{ color: T.accent }}>hali yo'q</span>. Qaysi buyruq kerak?</>, ru: <>Клиент впервые нажал <span className="mono" style={{ color: T.accent }}>/start</span>, его строки в таблице <span className="italic" style={{ color: T.accent }}>ещё нет</span>. Какая команда нужна?</> })}</h2></>}
    options={[tr({ uz: "INSERT — jadvalga yangi qator qo'shadi", ru: "INSERT — добавляет в таблицу новую строку" }), tr({ uz: "SELECT — mavjud qatorni o'qiydi", ru: "SELECT — читает существующую строку" }), tr({ uz: "UPDATE — mavjud qatorni o'zgartiradi", ru: "UPDATE — изменяет существующую строку" }), tr({ uz: "DELETE — mavjud qatorni o'chiradi", ru: "DELETE — удаляет существующую строку" })]} correctIdx={0}
    explainCorrect={tr({ uz: "Yangi mijozni SELECT topmaydi, shuning uchun unga INSERT bilan qator qo'shiladi.", ru: "SELECT не найдёт нового клиента, поэтому ему добавляют строку через INSERT." })}
    explainWrong={{
      1: tr({ uz: "SELECT o'qiydi, lekin yangi mijozning qatori hali yo'q — u hech narsa topmaydi.", ru: "SELECT читает, но строки нового клиента ещё нет — он ничего не найдёт." }),
      2: tr({ uz: "UPDATE mavjud qatorni o'zgartiradi — yangi mijozning qatori hali yo'q.", ru: "UPDATE изменяет существующую строку — а строки нового клиента ещё нет." }),
      3: tr({ uz: "DELETE o'chiradi — bizga esa yangi qator kerak.", ru: "DELETE удаляет — а нам нужна новая строка." }),
      default: tr({ uz: "Yangi qator INSERT bilan qo'shiladi.", ru: "Новая строка добавляется через INSERT." })
    }} />
);

// ===== SCREEN 15 — YAKUNIY: HOLATLI BOTNING XABAR OQIMI (DragDropOrder; to'g'rida qaytuvchi strelka, A7) =====
const FLOW = [
  { id: 'msg', label: { uz: 'Xabar keladi', ru: 'Приходит сообщение' } },
  { id: 'select', label: { uz: "SELECT — holat bazadan o'qiladi", ru: "SELECT — состояние читается из базы" } },
  { id: 'check', label: { uz: 'Holat tekshiriladi', ru: "Состояние проверяется" } },
  { id: 'act', label: { uz: 'Javob va yangi holat tanlanadi', ru: "Выбираются ответ и новое состояние" } },
  { id: 'update', label: { uz: 'UPDATE — yangi holat yoziladi', ru: "UPDATE — записывается новое состояние" } }
];
const FLOW_ITEMS = FLOW.map(f => ({ id: f.id, label: f.label }));
const FLOW_ORDER = FLOW.map(f => f.id);
const FLOW_SLOTS = FLOW.map((_, i) => ({ uz: `${i + 1}-qadam`, ru: `Шаг ${i + 1}` }));
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  const [consequence, setConsequence] = useState(null); // null | 'early-update' | 'wrong'
  // 8-A / 151-qonun: xato to'liq urinish progressga (`missed`) yoziladi — F5 dan keyin ham birinchi urinish «xato» qoladi
  const achMiss = useContext(AchMissCtx);
  const hadWrongRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect === false) : !!(achMiss && achMiss.missed.has(SCREEN_META[screen].id)));
  const fired = useRef(!!storedAnswer);
  const [recapOpen, setRecapOpen] = useState(false);
  const onSolved = () => {
    if (fired.current) { setDone(true); return; }
    fired.current = true;
    const firstOk = !hadWrongRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    setDone(true);
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Holatli botning xabar oqimini yig'ing", correct: firstOk, firstAttemptCorrect: firstOk, solved: true, picked: firstOk ? 0 : 1 });
  };
  const onChange = (slots) => {
    if (fired.current) return;
    const full = slots.every(s => s !== null);
    if (!full) { setConsequence(null); return; }
    const solved = slots.every((s, i) => s === FLOW_ORDER[i]);
    if (solved) { setConsequence(null); return; }
    hadWrongRef.current = true; if (achMiss) achMiss.miss(screen);
    const updateIdx = slots.indexOf('update');
    const selectIdx = slots.indexOf('select');
    setConsequence(updateIdx >= 0 && selectIdx >= 0 && updateIdx < selectIdx ? 'early-update' : 'wrong');
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Oqimni yig'ing", ru: 'Соберите поток' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: holatli botning <span className="italic" style={{ color: T.accent }}>xabar oqimini</span> yig'ing.</>, ru: <>Последний шаг: соберите <span className="italic" style={{ color: T.accent }}>поток сообщения</span> бота с состоянием.</> })}</h2></div>
        <Mentor>{tr({ uz: "Aziza jadvalda bor va yangi xabar yozdi. Bo'laklarni sudrab to'g'ri tartibga qo'ying.", ru: "Азиза уже есть в таблице и написала новое сообщение. Перетащите блоки в правильном порядке." })}</Mentor>
        <DragDropOrder
          items={FLOW_ITEMS}
          slotLabels={FLOW_SLOTS}
          onSolved={onSolved}
          onChange={onChange} />
        {consequence === 'early-update' && !done && <div className="frame-warn fade-step"><p className="note-h" style={{ color: T.danger }}>{tr({ uz: "Bot holatni o'qimasdan yozib yubordi.", ru: "Бот записал состояние, не прочитав его." })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "UPDATE SELECT'dan oldin bo'lsa, bot suhbat qaysi bosqichda ekanini bilmay turib yangi holat yozadi — mijoz noto'g'ri savol olishi mumkin.", ru: "Если UPDATE стоит перед SELECT, бот записывает новое состояние, не зная, на каком этапе диалог, — клиент может получить не тот вопрос." })}</p></div>}
        {consequence === 'wrong' && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang.", ru: "Порядок неверный — нажмите на блок, чтобы вернуть его, и поставьте заново." })}</p></div>}
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Oqim tayyor: <b>xabar keladi → SELECT → holat tekshiriladi → javob va yangi holat tanlanadi → UPDATE</b>, keyin bot javobni yuboradi. Yangi mijozni SELECT topmaydi — shunda bot avval INSERT bilan qator qo'shadi.</>, ru: <>✓ Поток готов: <b>приходит сообщение → SELECT → состояние проверяется → выбираются ответ и новое состояние → UPDATE</b>, затем бот отправляет ответ. Нового клиента SELECT не найдёт — тогда бот сначала добавляет строку через INSERT.</> })}</p>
          {hadWrongRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — ещё раз взглянуть на тему" })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};


// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  safeNotes:    { icon: '🗄️', name: 'Safe Storage',  desc: { uz: "Bot qayta ishga tushsa ham yo'qolmaydigan joyni tanladingiz", ru: "Вы выбрали место, которое не теряется при перезапуске бота" } },
  noMixUp:      { icon: '👥', name: 'No Mix-Up',     desc: { uz: "Ikki mijozning suhbati aralashmaydigan yo'lni tanladingiz", ru: "Вы выбрали способ, при котором диалоги двух клиентов не путаются" } },
  sqlWriter:    { icon: '📝', name: 'SQL Writer',    desc: { uz: "SQL bo'shliqlarini birinchi urinishda to'g'ri to'ldirdingiz", ru: "Вы с первой попытки верно заполнили пропуски в SQL" } },
  memoryKeeper: { icon: '🔁', name: 'State Flow',    desc: { uz: "Holatli botning xabar oqimini birinchi urinishda to'g'ri yig'dingiz", ru: "Вы с первой попытки верно собрали поток сообщения бота с состоянием" } },
};
// Ekran id → nishon. ❗ FAQAT ma'noli ekranlar: s8 (Safe Storage — SCORED test), s10 (No Mix-Up — SCORED test),
// s15 (State Flow — yakuniy DragDropOrder challenge), s13 (SQL Writer — builder, `wrongEverRef` orqali xato imkoni
// REAL: noto'g'ri chip tanlansa `correct:false` ketadi, ya'ni nishon tekin emas). Exploration/toggle ekranlarga BOG'LANMAYDI.
const ACH_TRIGGERS = { s8: 'safeNotes', s10: 'noMixUp', s15: 'memoryKeeper', s13: 'sqlWriter' };

// 🏅 151-qonun: amaliy topshiriq nishoni faqat BIRINCHI urinishga beriladi. Shart OLDINDAN aytiladi; birinchi urinish
// xato bo'lsa — jazosiz qisqa xabar (`once` — qayta urinishi yo'q ekran). Mentor ekranida, «Qaytadan» mashq-o'tishida va
// nishon olingach ko'rinmaydi. Matn — MATN_KORPUS §183 (hamma darsda aynan bir xil).
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
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr({ uz: 'Yangi nishon:', ru: 'Новый значок:' })} ${tr(ach.name)}`}>
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
const Q_LABELS = { 4: { uz: '1 — Holatsiz bot', ru: "1 — Бот без состояния" }, 8: { uz: '2 — Xotira va baza', ru: "2 — Память и база" }, 10: { uz: '3 — Ikki mijoz', ru: '3 — Два клиента' }, 14: { uz: '4 — INSERT/SELECT/UPDATE', ru: '4 — INSERT/SELECT/UPDATE' }, 15: { uz: '5 — Oqim tartibi', ru: '5 — Порядок потока' } };
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si (holat atamalari)
const QZ_BG_SHAPES = [
  { ch: 'SELECT',      l: 5,  t: 10, s: 32, d: 19, dl: 0 },
  { ch: 'chat.id',     l: 85, t: 8,  s: 32, d: 23, dl: 1.5 },
  { ch: 'UPDATE',      l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'INSERT',      l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: 'holat',       l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'sessiya', ru: 'сессия' }, l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: 'PostgreSQL',  l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'tanlov',      l: 55, t: 5,  s: 22, d: 22, dl: 0.6 },
  { ch: '✗',           l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '✓',           l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: 'WHERE',       l: 34, t: 62, s: 20, d: 29, dl: 3.4 },
  { ch: { uz: 'baza', ru: 'база' }, l: 2,  t: 30, s: 26, d: 28, dl: 3.1 },
  { ch: 'users',       l: 60, t: 90, s: 20, d: 31, dl: 4.2 },
  { ch: 'NOT NULL',    l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3, mexanik ketma-ketlik yo'q).
// 🎓 Metodist: savol matni sayqallanadi · ⚡ Jonli: `correct` qiymatlari INLINE_KEYS bilan sinxron tekshiriladi.
const QUIZ_BANK = [
  { q: { uz: "Bot nega bir necha xabardan keyin oldingi javobni unutadi?", ru: "Почему бот через несколько сообщений забывает предыдущий ответ?" }, opts: [{ uz: "Internet aloqasi beqaror bo'lib, xabar yo'qoladi", ru: "Интернет нестабилен, и сообщение теряется по пути" }, { uz: "Mijoz xabarlarni juda tez ketma-ket yuborib turadi", ru: "Клиент шлёт сообщения слишком быстро одно за другим" }, { uz: "Bot holatni saqlamaydi, har xabarni alohida ko'radi", ru: "Бот не хранит состояние — каждое сообщение отдельно" }, { uz: "Telegram xabarlarni tasodifiy tartibda yetkazadi", ru: "Telegram доставляет сообщения в случайном порядке" }], correct: 2 },
  { q: { uz: "Aziza va Bek bir vaqtda botga yozsa, suhbatlari aralashmasligi uchun nima kerak?", ru: "Азиза и Бек пишут боту одновременно. Что нужно, чтобы их диалоги не перепутались?" }, opts: [{ uz: "Ikkalasining holatini bitta o'zgaruvchida saqlash", ru: "Хранить состояние обоих в одной переменной" }, { uz: "Har mijozga alohida bot ochib, alohida token berish", ru: "Создать каждому клиенту отдельного бота и токен" }, { uz: "Umumiy holatni obyektda emas, PostgreSQL'da saqlash", ru: "Хранить общее состояние не в объекте, а в PostgreSQL" }, { uz: "Har mijozga alohida sessiya ochib, holatni saqlash", ru: "Открыть каждому отдельную сессию и хранить состояние" }], correct: 3 },
  { q: { uz: "Bot serveri qayta ishga tushganda qaysi ma'lumot saqlanib qoladi?", ru: "Какие данные сохранятся, когда сервер бота перезапустится?" }, opts: [{ uz: "PostgreSQL jadvaliga yozilgan ma'lumot", ru: "Данные, записанные в таблицу PostgreSQL" }, { uz: "Koddagi JavaScript obyektidagi holat ma'lumoti", ru: "Состояние в JavaScript-объекте в коде" }, { uz: "Hech qaysi, hammasi birdan yo'qoladi", ru: "Никакие, всё пропадёт сразу" }, { uz: "Handler ichidagi o'zgaruvchidagi ma'lumot", ru: "Данные в переменной внутри handler-а" }], correct: 0 },
  { q: { uz: "Bot «pitsa o'lchamini kutyapman» degan yozuvni saqladi. Bu yozuv nima deyiladi?", ru: "Бот сохранил запись «жду размер пиццы». Как называется эта запись?" }, opts: [{ uz: "Webhook — Telegram xabarni botga o'zi yuboradigan usul", ru: "Webhook — способ, когда Telegram сам отправляет сообщение боту" }, { uz: "Holat — suhbat hozir qaysi bosqichda ekanini bildiradi", ru: "Состояние — показывает, на каком этапе сейчас диалог" }, { uz: "Token — bot sizniki ekanini tasdiqlaydigan maxfiy qator", ru: "Токен — секретная строка, подтверждающая, что бот Ваш" }, { uz: "Fallback — hech bir handler mos kelmaganda ishlaydi", ru: "Fallback — срабатывает, когда не подошёл ни один handler" }], correct: 1 },
  { q: { uz: "SELECT buyrug'i botga nima uchun kerak?", ru: "Зачем боту команда SELECT?" }, opts: [{ uz: "Yangi mijozni jadvalga qo'shib qo'yish uchun", ru: "Чтобы добавить нового клиента в таблицу" }, { uz: "Mavjud ma'lumotni bazadan o'chirish uchun", ru: "Чтобы удалить существующие данные из базы" }, { uz: "Jadval tuzilishini o'zgartirib qurish uchun", ru: "Чтобы изменить и перестроить структуру таблицы" }, { uz: "Mijoz va uning holatini bazadan o'qish uchun", ru: "Чтобы прочитать клиента и его состояние из базы" }], correct: 3 },
  { q: { uz: "Yangi mijoz birinchi marta /start bosdi, jadvalda uning qatori hali yo'q. Qaysi buyruq kerak?", ru: "Новый клиент впервые нажал /start, его строки в таблице ещё нет. Какая команда нужна?" }, opts: [{ uz: "SELECT — mavjud qatorni bazadan o'qiydi", ru: "SELECT — читает существующую строку из базы" }, { uz: "INSERT — jadvalga yangi qator qo'shadi", ru: "INSERT — добавляет в таблицу новую строку" }, { uz: "UPDATE — mavjud qatorni o'zgartiradi", ru: "UPDATE — изменяет существующую строку" }, { uz: "DELETE — mavjud qatorni o'chiradi", ru: "DELETE — удаляет существующую строку" }], correct: 1 },
  { q: { uz: "Mijoz javob bergach, bot holatni keyingi bosqichga qanday o'tkazadi?", ru: "Как бот переводит состояние на следующий этап, когда клиент ответил?" }, opts: [{ uz: "UPDATE bilan holatni yangi qiymatga o'zgartiradi", ru: "Через UPDATE меняет состояние на новое значение" }, { uz: "INSERT bilan har safar yangi qator qo'shib boradi", ru: "Через INSERT каждый раз добавляет новую строку" }, { uz: "SELECT bilan holatni bazadan qayta o'qib oladi", ru: "Через SELECT заново читает состояние из базы" }, { uz: "DELETE bilan eski holatni o'chirib tashlaydi", ru: "Через DELETE удаляет старое состояние" }], correct: 0 },
  { q: { uz: "Koddagi oddiy JavaScript obyektida saqlangan holatning eng katta kamchiligi nima?", ru: "В чём главный минус состояния, которое хранится в обычном JavaScript-объекте в коде?" }, opts: [{ uz: "Bu usul botni juda sekinlashtirib qo'yadi", ru: "Этот способ сильно замедляет бота" }, { uz: "Bu usul diskda juda ko'p joy egallaydi", ru: "Этот способ занимает много места на диске" }, { uz: "Bot qayta ishga tushsa, hammasi yo'qoladi", ru: "При перезапуске бота всё пропадает" }, { uz: "Uni bir vaqtda faqat bitta mijoz ishlata oladi", ru: "Им может пользоваться только один клиент за раз" }], correct: 2 },
  { q: { uz: "users jadvalidagi `holat` ustuni nima uchun kerak?", ru: "Зачем в таблице users колонка `holat`?" }, opts: [{ uz: "Mijozning ismini saqlab qo'yish uchun", ru: "Чтобы сохранить имя клиента" }, { uz: "Mijoz tanlagan pitsani saqlab qo'yish uchun", ru: "Чтобы сохранить пиццу, которую выбрал клиент" }, { uz: "Suhbat qaysi bosqichda ekanini saqlash uchun", ru: "Чтобы хранить, на каком этапе диалог" }, { uz: "Xabar yuborilgan vaqtni yozib qo'yish uchun", ru: "Чтобы записать время отправки сообщения" }], correct: 2 },
  { q: { uz: "Nega har mijozga alohida sessiya berish muhim?", ru: "Почему важно давать каждому клиенту отдельную сессию?" }, opts: [{ uz: "Har kimning suhbati o'zida qoladi, aralashmaydi", ru: "Диалог каждого остаётся своим и не смешивается" }, { uz: "Bot shundan keyin ancha tezroq ishlay boshlaydi", ru: "После этого бот начинает работать заметно быстрее" }, { uz: "Bot qayta ishga tushsa ham, holat saqlanib qoladi", ru: "Даже после перезапуска бота состояние сохранится" }, { uz: "Bu faqat juda katta va murakkab botlarga kerak", ru: "Это нужно только очень большим и сложным ботам" }], correct: 0 },
  { q: { uz: "Holatli bot xabar olganda birinchi nima qiladi?", ru: "Что бот с состоянием делает первым, получив сообщение?" }, opts: [{ uz: "Har safar mijozni jadvalga yangidan INSERT qiladi", ru: "Каждый раз заново делает INSERT клиента в таблицу" }, { uz: "Mijoz va uning holatini SELECT bilan o'qiydi", ru: "Читает клиента и его состояние через SELECT" }, { uz: "Avval yangi holatni UPDATE bilan yozib qo'yadi", ru: "Сначала записывает новое состояние через UPDATE" }, { uz: "Mijozdan ismini har safar qaytadan so'raydi", ru: "Каждый раз заново спрашивает у клиента имя" }], correct: 1 },
  { q: { uz: "Bot qayta ishga tushgandan keyin ham suhbatni davom ettirishi uchun nima kerak?", ru: "Что нужно, чтобы бот продолжил диалог даже после перезапуска?" }, opts: [{ uz: "Mijoz /start buyrug'ini qaytadan bosishi kerak", ru: "Клиент должен снова нажать /start" }, { uz: "Bot internetga avvalgidan tezroq ulanishi kerak", ru: "Бот должен подключаться к интернету быстрее" }, { uz: "Holat koddagi oddiy obyektda saqlanib turishi kerak", ru: "Состояние должно храниться в обычном объекте в коде" }, { uz: "Holat PostgreSQL bazasida saqlangan bo'lishi kerak", ru: "Состояние должно храниться в базе PostgreSQL" }], correct: 3 },
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
    // Arena tokenlari — SHU darsning mavzusidan (holat): dekorativ suzuvchi kod-bo'laklari
    const TOK = ['SELECT', 'UPDATE', 'INSERT', 'holat', 'tanlov', { uz: 'sessiya', ru: 'сессия' }, 'WHERE', 'users', 'chat.id', 'PostgreSQL'];
    const em = [], toks = [];
    for (let i = 0; i < 26; i++) em.push({ x: Math.random() * W, y: Math.random() * H, z: .3 + Math.random() * .7, ph: Math.random() * 6.28, sw: .3 + Math.random() * .6 });
    for (let i = 0; i < 9; i++) toks.push({ x: Math.random() * W, y: Math.random() * H, z: .4 + Math.random() * .9, vx: (Math.random() - .5) * .16, t: tr(TOK[i % TOK.length]), r: (Math.random() - .5) * .5 });
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
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест сами:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме тренировки' })}</button>
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
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Ждём, когда ментор начнёт тест…' })}</p>}
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz! 💪', ru: 'Ошибка — 0 баллов. В следующем получится! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Будьте быстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: 'Siz hozir:', ru: 'Вы сейчас:' })} {myRank + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</span>}
            </div>
          )}
          {!solo && (
            <div className="qz-board">
              <div className="qz-board-h">{tr({ uz: '🏆 TOP-5', ru: '🏆 ТОП-5' })}</div>
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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: "🏁 Natijani ko'rish", ru: '🏁 Посмотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Далее →' })}</button>}
        </div>
      )}

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'лучшая серия' })} 🔥x${soloScore.maxStreak}` : ''}</p>
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
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{myRank + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</b> · {board[myRank].pts} {tr({ uz: 'ball', ru: 'баллов' })}</p>}
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест заново — тренировка (в таблицу не попадёт)' })}</button>}
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
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — 🥇🥈🥉 подиум.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Загружаем результаты…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu darsga hali hech kim qo'shilmagan.", ru: "К этому уроку пока никто не присоединился." })}</p></div>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{myIdx + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</b> ({board[myIdx].okCount}/{totalQ} {tr({ uz: "to'g'ri", ru: 'верно' })})</p>}
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


// ===== 🛠️ JONLI PRAKTIKA — o'quvchi topshiriqni bajaradi, Mentor kuzatadi (qadamlar navbat bilan, A6) =====
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
      <div className="card-lbl" style={{ color: T.blue }}>{tr({ uz: '👀 Kim bajardi', ru: '👀 Кто выполнил' })} — {doers.length}/{players.length}</div>
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
function ScreenLivePractice({ title, task, checklist, screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, place = { uz: 'kompyuteringizda', ru: 'на своём компьютере' } }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved));
  // A6: qadamlar bittadan — joriy qadam to'liq, bajarilganlari ✓ bilan bitta qatorga yig'iladi, keyingilari hali ko'rinmaydi
  const [stepIdx, setStepIdx] = useState(() => (storedAnswer && storedAnswer.solved ? checklist.length : 0));
  const [sc, setSc] = useState(0);
  const complete = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: (title && title.uz) || title, solved: true, correct: true, picked: true });
    // JONLI: praktika bajarilgani serverga yoziladi (500+ zona — reytingga aralashmaydi, faqat mentor ko'radi)
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  const stepDone = () => {
    if (done || stepIdx >= checklist.length) return;
    const n = stepIdx + 1;
    setStepIdx(n); setSc(x => x + 1);
    if (n >= checklist.length) complete();
  };
  return (
    <Stage eyebrow={tr(eyebrow) || tr({ uz: 'Amaliyot · VS Code', ru: 'Практика · VS Code' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr({ uz: "Topshiriqni qog'ozda bajaring. Har qadamdan keyin «Bajardim» ni bosing — keyingisi ochiladi.", ru: "Выполните задание на бумаге. После каждого шага нажимайте «Готово» — откроется следующий." })}</Mentor>
        <div className="split">
          <Col>
            <div className="lp-task fade-up delay-1">
              <div className="lp-task-h"><span className="lp-task-badge">{tr({ uz: 'TOPSHIRIQ', ru: 'ЗАДАНИЕ' })}</span></div>
              <p className="body" style={{ margin: 0, color: T.ink }}>{fmtCode(tr(task))}</p>
            </div>
            <MentorPracticeStats live={_live} screen={screen} />
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Qadamlar', ru: "Шаги" })}</p>
            <div className="lp-steps fade-up delay-2">
              {checklist.slice(0, stepIdx).map((c, i) => (
                <div key={i} className="lp-step on lp-compact"><span className="lp-check">✓</span><span className="lp-step-t">{fmtCode(tr(c))}</span></div>
              ))}
              {stepIdx < checklist.length && (
                <div key={`cur-${stepIdx}`} className="lp-step lp-cur fade-step">
                  <span className="lp-check">{stepIdx + 1}</span>
                  <span className="lp-step-t">{fmtCode(tr(checklist[stepIdx]))}</span>
                  <button className="btn lp-step-btn" onClick={stepDone}>{tr({ uz: 'Bajardim', ru: "Готово" })}</button>
                </div>
              )}
            </div>
            {done && <button className="lp-done-btn is-done" disabled>{tr({ uz: '✓ Bajarildi — Mentorni kuting', ru: "✓ Выполнено — ждите Ментора" })}</button>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Vazifani bajardingiz. Mentor tekshirib, keyingi qadamga o'tkazadi.", ru: "Вы выполнили задание. Ментор проверит и переведёт на следующий шаг." })}</p></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
}


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
    <div className="fc-done fade-up"><span className="fc-done-emoji">✓</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'atama yodlandi', ru: 'терминов выучено' })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda", ru: '↻ Учу' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
        <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
          <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span></div>
          <div className="fc-face fc-back">{fcAnswer(tr(card.back))}{card.note && <span className="fc-note">{fmtCode(tr(card.note))}</span>}</div>
        </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={again}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={knew}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : (<p className="fc-hint" />)}
    </div>
  );
}


// 🛠️ PRAKTIKA — o'quvchi loyihasida jadval sxemasini kengaytiradi (mentor-gate, kod kiritilmaydi)
const ScreenDbPractice = (props) => (
  <ScreenLivePractice {...props} eyebrow={{ uz: 'Amaliyot · loyihalash', ru: 'Практика · проектирование' }} place={{ uz: 'loyihangizda', ru: 'в своём проекте' }}
    title={{ uz: 'Botingiz uchun users jadvalini loyihalang', ru: "Спроектируйте таблицу users для Вашего бота" }}
    task={{ uz: "1-darsda ochgan botingiz uchun users jadvalini qog'ozda loyihalang: qaysi ustunlar kerak, holat qayerda saqlanadi va qaysi SQL qachon ishlatiladi. Bugun kod yozmaysiz — faqat loyihalaysiz.", ru: "Спроектируйте на бумаге таблицу users для бота, которого Вы создали на 1-м уроке: какие колонки нужны, где хранится состояние и какой SQL когда используется. Сегодня Вы не пишете код — только проектируете." }}
    checklist={[
      { uz: 'Botingizga qaysi ustunlar kerakligini yozing: `telegram_id`, `ism`, …', ru: "Запишите, какие колонки нужны Вашему боту: `telegram_id`, `ism`, …" },
      { uz: "Ro'yxatga `holat` ustunini qo'shing (`TEXT NOT NULL`).", ru: "Добавьте в список колонку `holat` (`TEXT NOT NULL`)." },
      { uz: 'Xabar kelganda avval qaysi SQL ishlatilishini yozing.', ru: "Запишите, какой SQL используется первым, когда приходит сообщение." },
      { uz: "Holat o'zgarganda qaysi SQL ishlatilishini yozing.", ru: "Запишите, какой SQL используется, когда меняется состояние." },
      { uz: 'Yangi mijoz uchun qaysi SQL kerakligini yozing.', ru: "Запишите, какой SQL нужен для нового клиента." },
    ]} />
);

// 🃏 FLASHCARD KARTALARI — 12 atama (holat tili)
const MEMORY_FLASHCARDS = [
  { front: { uz: "Holati yo'q bot bir necha xabardan keyin nega adashadi?", ru: "Почему бот без состояния путается уже через несколько сообщений?" }, back: { uz: 'Oldingi xabarni eslamaydi', ru: "Не помнит предыдущее сообщение" }, note: { uz: "Har xabarni alohida hodisa deb ko'radi — bu holatsiz bot", ru: "Он видит каждое сообщение как отдельное событие — это бот без состояния" } },
  { front: { uz: 'Suhbat hozir qaysi bosqichda ekanini bildiradigan yozuv nima?', ru: "Как называется запись о том, на каком этапе сейчас диалог?" }, back: { uz: 'Holat (state)', ru: 'Состояние (state)' }, note: { uz: 'Masalan: `MANZIL_KUTYAPMAN` — bot manzil kutyapti', ru: "Например: `MANZIL_KUTYAPMAN` — бот ждёт адрес" } },
  { front: { uz: 'Holatni eslab qoladigan bot qanday ataladi?', ru: "Как называется бот, который запоминает состояние?" }, back: { uz: 'Holatli bot (stateful)', ru: "Бот с состоянием (stateful)" }, note: { uz: "U suhbat qayerda to'xtaganini biladi", ru: "Он знает, где остановился диалог" } },
  { front: { uz: 'Bitta mijozning boshqalarnikidan alohida saqlanadigan holati nima?', ru: "Как называется состояние одного клиента, которое хранится отдельно от других?" }, back: { uz: 'Sessiya', ru: 'Сессия' }, note: { uz: "Bot uni `chat.id` bo'yicha topadi", ru: "Бот находит её по `chat.id`" } },
  { front: { uz: "Hamma mijozning holati bitta o'zgaruvchida bo'lsa, nima bo'ladi?", ru: "Что будет, если состояние всех клиентов хранится в одной переменной?" }, back: { uz: 'Buyurtmalar aralashadi', ru: 'Заказы перепутаются' }, note: { uz: 'Oxirgi yozuv oldingisining ustiga yoziladi', ru: "Последняя запись затирает предыдущую" } },
  { front: { uz: "Koddagi oddiy obyektdagi holat bot qayta ishga tushsa nima bo'ladi?", ru: "Что станет с состоянием в обычном объекте кода, если бот перезапустится?" }, back: { uz: "Yo'qoladi", ru: 'Пропадёт' }, note: { uz: 'Obyekt dastur xotirasida (RAM) turadi — u vaqtinchalik', ru: "Объект хранится в памяти программы (RAM) — она временная" } },
  { front: { uz: 'Bot qayta ishga tushsa ham holat qolishi uchun uni qayerga yozasiz?', ru: "Куда записать состояние, чтобы оно осталось даже после перезапуска бота?" }, back: 'PostgreSQL', note: { uz: "Baza ma'lumotni diskka yozadi", ru: "База записывает данные на диск" } },
  { front: { uz: 'Bot mijozlari haqidagi yozuvlar qaysi jadvalda turadi?', ru: "В какой таблице лежат записи о клиентах бота?" }, back: 'users', note: { uz: 'Ustunlari: id, telegram_id, ism, holat, tanlov', ru: "Колонки: id, telegram_id, ism, holat, tanlov" } },
  { front: { uz: "Yangi mijoz birinchi marta /start bosganda qaysi SQL buyrug'i ishlatiladi?", ru: 'Какая SQL-команда используется, когда новый клиент впервые нажал /start?' }, back: 'INSERT', note: { uz: "Jadvalga yangi qator qo'shiladi", ru: 'В таблицу добавляется новая строка' } },
  { front: { uz: "Mijozning holatini bazadan o'qish uchun qaysi buyruq kerak?", ru: 'Какая команда нужна, чтобы прочитать состояние клиента из базы?' }, back: 'SELECT', note: { uz: "Mijoz qatori `telegram_id` bo'yicha topiladi", ru: "Строка клиента находится по `telegram_id`" } },
  { front: { uz: "Holat o'zgarganda mavjud qatorni qaysi buyruq yangilaydi?", ru: 'Какая команда обновляет существующую строку, когда состояние изменилось?' }, back: 'UPDATE', note: { uz: "Yangi qator qo'shilmaydi — bori yangilanadi", ru: 'Новая строка не добавляется — обновляется имеющаяся' } },
  { front: { uz: 'Xabar kelganda bot birinchi navbatda nima qiladi?', ru: "Что бот делает в первую очередь, когда приходит сообщение?" }, back: { uz: "Holatni o'qiydi (SELECT)", ru: "Читает состояние (SELECT)" }, note: { uz: 'Keyin holatni tekshiradi, javob va yangi holatni tanlaydi, yangi holatni yozadi (UPDATE)', ru: "Потом проверяет состояние, выбирает ответ и новое состояние, записывает новое состояние (UPDATE)" } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={MEMORY_FLASHCARDS} /></div>
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
    { uz: 'Holat saqlanmasa, bot qisqa javob qaysi savolga tegishli ekanini bilmaydi', ru: "Если состояние не хранится, бот не знает, к какому вопросу относится короткий ответ" },
    { uz: 'Holat — suhbat qaysi bosqichda ekani va mijoz nimani tanlagani', ru: "Состояние — на каком этапе диалог и что выбрал клиент" },
    { uz: "Dastur xotirasidagi holat qayta ishga tushganda yo'qoladi — PostgreSQL'dagisi qoladi", ru: "Состояние в памяти программы пропадает при перезапуске — в PostgreSQL остаётся" },
    { uz: "Har mijozga alohida sessiya kerak — holat `chat.id` bo'yicha ajratiladi", ru: "Каждому клиенту нужна отдельная сессия — состояние разделяется по `chat.id`" },
    { uz: 'Xabar oqimi: SELECT → holatni tekshirish → javob va yangi holat → UPDATE; yangi mijozga avval INSERT', ru: "Поток сообщения: SELECT → проверка состояния → ответ и новое состояние → UPDATE; новому клиенту сначала INSERT" }
  ];
  const HOMEWORK = [
    { b: { uz: 'Holatlarni yozing', ru: "Выпишите состояния" }, t: { uz: "— botingiz suhbati qaysi holatlardan o'tadi? Masalan: `OLCHAM_KUTYAPMAN` → `MANZIL_KUTYAPMAN` → `TAYYOR`", ru: "— через какие состояния проходит диалог Вашего бота? Например: `OLCHAM_KUTYAPMAN` → `MANZIL_KUTYAPMAN` → `TAYYOR`" } },
    { b: { uz: 'Ajrating', ru: 'Разделите' }, t: { uz: "— botingizdagi qaysi ma'lumot vaqtinchalik bo'lsa bo'ladi, qaysi biri PostgreSQL'da saqlanishi kerak?", ru: "— какие данные Вашего бота могут быть временными, а какие нужно хранить в PostgreSQL?" } },
    { b: { uz: "Gemini'dan so'rang", ru: "Спросите Gemini" }, t: { uz: "— gemini.google.com'ga botingizning users jadvalini va holatlarini yozing, so'ng ikki mijoz uchun kod so'rang: yangi mijoz (INSERT) va jadvalda bor mijoz (SELECT → UPDATE).", ru: "— напишите на gemini.google.com таблицу users и состояния Вашего бота, затем попросите код для двух клиентов: нового (INSERT) и уже записанного в таблицу (SELECT → UPDATE)." } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Holatni saqlashni bilasiz', ru: "Вы умеете хранить состояние" })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi botingiz suhbatni <span className="italic" style={{ color: T.accent }}>eslab qoladi</span>.</>, ru: <>Теперь Ваш бот <span className="italic" style={{ color: T.accent }}>запоминает</span> диалог.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: "Подождите Ментора" }) : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь Вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{fmtCode(tr(r))}</span></li>))}</ul></div>
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyga vazifa', ru: "Домашнее задание" })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{fmtCode(tr(h.t))}</span></li>))}</ul><p className="hw-note">{tr({ uz: <>Keyingi dars — <b>«Loyiha kuni: AI bilan bot».</b> Aniq topshiriq yozib, botni AI yordamida qurasiz, uning kodini o'qiysiz va sinab ko'rasiz.</>, ru: <>Следующий урок — <b>«Проектный день: бот с ИИ».</b> Вы напишете чёткое задание, соберёте бота с помощью ИИ, прочитаете его код и проверите его в деле.</> })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Nishonlaringiz', ru: "Ваши значки" })} — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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
export default function BotStatefulMemoryLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenDbPractice, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        .zoomable.z-float > .zoom-btn { visibility: hidden; } /* ⛶ bo'sh joy ustida osilmasin (ZBTN, 159-qonun) */
        .flow-label:has(+ .zoomable.z-empty) { display: none; } /* bo'sh ustun ustida yorliq yolg'iz osilmasin (bridge 40-band, F-0926-01) */
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        /* F-0912-09 · 147-qonun (a): matn zoom tugmasi burchagini aylanib o'tadi.
           Notch qutining hamma holat-matniga qo'yiladi — qaysi holat ekranda turgani tilga bog'liq. */
        .zb-notch::before { content: ''; float: right; width: 28px; height: 28px; }
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
        .hook-option.on { background: ${T.paper}; color: ${T.ink}; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.24), inset 0 0 0 2px ${T.ink}; } /* U1: ballsiz hook — neytral to'q ramka, qizil/yashil emas */
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.ink}; }
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
        .frame-dash { border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); }

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
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); }
        .step-num { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        /* === SK-INFO === */
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }

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
        /* U3: karta belgisi — kod misoli yoki raqam (emoji emas) */
        .rc-ic.num { width: clamp(52px,8vw,72px); height: clamp(52px,8vw,72px); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(24px,4vw,34px); color: ${T.accent}; background: ${T.accentSoft}; }
        .rc-ic.code span { display: inline-block; max-width: 100%; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: clamp(15px,2.4vw,22px); line-height: 1.4; color: ${CODE.text}; background: ${CODE.bg}; border-radius: 12px; padding: clamp(10px,1.6vw,14px) clamp(14px,2.4vw,22px); overflow-wrap: anywhere; }
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

        /* ============ 5-MODUL · BOT DARSI CSS ============ */

        /* ===== 📱 TELEGRAM CHAT ===== */
        .tg { border-radius: 14px; overflow: hidden; box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.26); border: 1px solid rgba(167,166,162,0.2); }
        .tg-head { background: linear-gradient(180deg,#5A9FD4,#4E8FC0); padding: 10px 14px; display: flex; align-items: center; gap: 10px; }
        .tg-ava { width: 30px; height: 30px; border-radius: 50%; background: #fff; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: #4E8FC0; flex-shrink: 0; }
        .tg-name { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: #fff; display: flex; flex-direction: column; line-height: 1.25; }
        .tg-status { font-weight: 500; font-size: 10.5px; color: #DCEBF7; }
        .tg-body { background: #CFD9E0; background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 18px 18px; padding: 13px 12px; display: flex; flex-direction: column; gap: 10px; }
        .tg-bubble { max-width: 82%; padding: 8px 12px; border-radius: 14px; font-family: 'Manrope'; font-weight: 500; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; box-shadow: 0 1px 2px rgba(0,0,0,0.12); word-break: normal; overflow-wrap: break-word; hyphens: none; } /* U2: pufakcha so'z ichida bo'linmaydi */
        .tg-bubble.bot { align-self: flex-start; background: #fff; color: #0E0E10; border-bottom-left-radius: 5px; }
        .tg-bubble.user { align-self: flex-end; background: #EFFDDE; color: #0E0E10; border-bottom-right-radius: 5px; }
        .tg-bubble.muted { opacity: 0.55; }
        .tg-typing { display: flex; gap: 4px; align-items: center; padding: 11px 13px; }
        .tg-typing span { width: 6px; height: 6px; border-radius: 50%; background: ${T.ink3}; animation: tg-typing-bounce 1s ease-in-out infinite; }
        .tg-typing span:nth-child(2) { animation-delay: 0.15s; } .tg-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes tg-typing-bounce { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-3px); opacity: 1; } }

        /* Jihozlar paneli olindi (KOD 2, qaror F-0929-63). */

        /* ===== 📋 IKKI MIJOZ: TUZATISH (s9) ===== */
        .ns-shift-cards { display: flex; flex-direction: column; gap: 7px; }
        .ns-cust { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: ${T.paper}; border-radius: 11px; padding: 10px 13px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.14); transition: all 0.4s ease; }
        .ns-cust-name { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink}; }
        .ns-cust-msg { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .ns-cust.ok { box-shadow: inset 0 0 0 1.5px ${T.success}; } .ns-cust.ok .ns-cust-msg { color: ${T.success}; }

        /* ===== KARTA-QATOR (kim javob beradi / rejimlar) ===== */
        .vcard { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 14px; cursor: pointer; transition: all 0.18s; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); }
        .vcard:hover:not(:disabled) { transform: translateY(-1px); }
        .vlbl { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .vseen { margin-left: auto; font-weight: 700; }
        @keyframes rz-shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: rz-shake 0.4s ease; }

        /* Bo'shliqlarni to'ldirish (s13 builder) */
        .blank-group { display: flex; flex-direction: column; gap: 6px; }
        .blank-group .bg-lbl { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .blank-row { display: flex; flex-wrap: wrap; gap: 7px; }

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi. Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        .gchip.tap-hint, .btn-soft.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }

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
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: ${T.accent}; background: ${T.paper}; border: 2px solid ${T.accent}; border-radius: 11px; padding: 9px 13px; cursor: grab; touch-action: none; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},.35); transition: transform .12s; user-select: none; }
        .dd-chip::before { content: '⠿'; margin-right: 7px; opacity: .55; font-weight: 400; } /* F-0926-05 #5: yumshatildi — oq fon + 2px accent chegara (border: tap-hint animatsiyasi box-shadow'ni o'zgartiradi, halqa yo'qolmasin), ushlagich sudralishni aytadi */
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
          .gchip.tap-hint, .btn-soft.tap-hint,
          .dd-chip.in, .dd-slot.ok, .dd-slot.bad, .shake, .tg-typing span { animation: none !important; }
        }

      
        /* ===== DARSGA XOS QO'SHIMCHA STILLAR (holat/DB vizuallari — v16'dan ko'chirilgan) ===== */
        .agent-card { background: ${T.blueSoft}; border-radius: 10px; padding: 13px 16px; }
        .agent-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.blue}; display: block; margin-bottom: 5px; letter-spacing: 0.04em; }
        .agent-msg { font-family: 'Manrope'; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; margin: 0; line-height: 1.55; }
        .agent-msg b { color: ${T.ink}; }

        .dbt-wrap { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.18); }
        .dbt-cap { background: #2D2D2D; color: #C9D1D9; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; padding: 7px 12px; }
        .dbt-cap .mono { color: ${T.accent}; }
        .dbt { width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(10.5px,1.3vw,12px); background: ${T.paper}; }
        .dbt th { background: ${CODE.bg}; color: ${CODE.text}; font-weight: 600; padding: 7px 9px; text-align: left; font-size: 10px; letter-spacing: 0.03em; white-space: nowrap; }
        .dbt td { padding: 8px 9px; border-top: 1px solid rgba(167,166,162,0.22); color: ${T.ink}; white-space: nowrap; transition: background 0.3s; }
        .dbt tr.hl td { background: ${T.blueSoft}; }
        .dbt td.hlc { background: ${T.accentSoft}; color: ${T.accent}; font-weight: 700; }
        .dbt th.hlh { color: ${CODE.tag}; }
        .dbt-scroll { overflow-x: auto; }
        .dbt .empty td { text-align: center; color: ${T.ink3}; font-style: italic; padding: 16px; }
        @keyframes row-in { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: none; } }
        .dbt tr.rowin td { animation: row-in 0.45s ease; }

        .mem-box { background: ${T.paper}; border-radius: 12px; padding: 14px 16px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); transition: all 0.35s; }
        .mem-box.keep { background: ${T.successSoft}; }
        .mem-box.gone { background: ${T.dangerSoft}; }

        /* Suhbat holati paneli (mijoz · holat · tanlov) */
        .daf-page { background: ${T.paper}; border-radius: 12px; padding: 14px 16px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.18); animation: fade-step 0.3s; }
        .daf-page-h { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.accent}; margin: 0 0 8px; }
        /* qatorlar birma-bir chiqadi (~120ms farq) */
        @keyframes daf-write { from { opacity: 0; transform: translateX(-5px); } to { opacity: 1; transform: translateX(0); } }
        .daf-row { display: flex; align-items: baseline; gap: 8px; padding: 3px 0; font-size: clamp(12.5px,1.5vw,14px); animation: daf-write 0.26s ease-out both; }
        .daf-row:nth-child(2) { animation-delay: 0.05s; }
        .daf-row:nth-child(3) { animation-delay: 0.17s; }
        .daf-row:nth-child(4) { animation-delay: 0.29s; }
        .daf-k { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 10.5px; color: ${T.ink3}; text-transform: uppercase; letter-spacing: 0.06em; min-width: 62px; }
        .daf-v { font-weight: 600; color: ${T.ink}; }
        .daf-v.hl { color: ${T.accent}; }

        /* ikki mijoz — umumiy sahifaga yozilayotgan xabarlar oqimi */
        .mix-chat { display: flex; flex-direction: column; gap: 7px; background: ${T.paper}; border-radius: 12px; padding: 13px 15px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); min-height: 90px; }
        .mix-line { display: flex; gap: 8px; font-size: clamp(13px,1.5vw,14.5px); }
        .mix-who { font-weight: 700; color: ${T.ink2}; flex-shrink: 0; }
        .mix-txt { color: ${T.ink}; }

        /* A7: o'zgargan qiymat qisqa yonadi */
        @keyframes ln-flash { 0% { background: transparent; } 35% { background: ${T.accentSoft}; } 100% { background: transparent; } }
        .daf-v.chg { animation: ln-flash 1s ease-out 0.45s both; border-radius: 5px; padding: 0 4px; margin: 0 -4px; }
        /* A7: strelka (xabar → holat) — SVG chiziq 0.8 s da chiziladi */
        .ln-wrap { position: relative; }
        .ln-svg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 4; }
        .ln-path { fill: none; stroke: ${T.accent}; stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
        .ln-head { fill: ${T.accent}; }
        .ln-draw .ln-path { stroke-dashoffset: 1; animation: ln-draw 0.8s ease-out forwards; }
        .ln-draw .ln-head { opacity: 0; animation: ln-head 0.2s ease-out 0.7s forwards; }
        @keyframes ln-draw { to { stroke-dashoffset: 0; } }
        @keyframes ln-head { to { opacity: 1; } }
        .ln-still .ln-path { opacity: 0.45; } .ln-still .ln-head { opacity: 0.45; }
        /* N20 (qoida 4): telefonda ustunlar ustma-ust — ustunlararo strelka chizilmaydi, ma'no qator matnida va rangda qoladi */
        @media (max-width: 760px) { .split.ln-wrap > .ln-svg { display: none; } }
        .dd-loop { left: 0; top: 0; }
        /* s6: RAM qatori chapdan o'ngga o'chib boradi (0.8 s) */
        @keyframes mem-wipe { from { clip-path: inset(0 0 0 0); opacity: 1; } to { clip-path: inset(0 0 0 100%); opacity: 0.2; } }
        .mem-line.wipe { animation: mem-wipe 0.8s ease-in forwards; }
        /* s11: holat — darsning asosiy ustuni (kodda, tugmada, jadvalda urg'u rangi) */
        .code-hl { background: rgba(255,79,40,0.22); border-radius: 4px; box-shadow: 0 0 0 3px rgba(255,79,40,0.22); }
        .gchip-mk { color: ${T.ink3}; font-weight: 800; }
        .gchip.seen { box-shadow: inset 0 0 0 1.5px ${T.success}; color: ${T.success}; }
        .gchip.seen .gchip-mk { color: ${T.success}; }
        .gchip.gchip-hl { background: ${T.accentSoft}; color: ${T.accent}; }
        .gchip.gchip-hl.seen { box-shadow: inset 0 0 0 1.5px ${T.accent}; color: ${T.accent}; }
        .gchip.gchip-hl .gchip-mk { color: ${T.accent}; }
        /* s13: joriy bo'shliq kodda yonadi */
        .sql-blank { color: ${CODE.attr}; border-radius: 4px; }
        .sql-blank.cur { background: rgba(255,211,128,0.22); box-shadow: 0 0 0 2px rgba(255,211,128,0.5); }
        .sql-blank.ok { color: ${CODE.str}; font-weight: 700; }
        /* s9: sessiya kartalari (ochiladigan — doimiy ›, bosilgach ✓) */
        .sess-list { display: flex; flex-direction: column; gap: 8px; }
        .sess-item { display: flex; flex-direction: column; gap: 6px; }
        .vcard.seen { box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .vseen { font-size: 16px; }
        .sess-box { background: ${T.bg}; border-radius: 10px; padding: 9px 13px; margin-left: 12px; box-shadow: inset 3px 0 0 ${T.ink3}55; }
        .sess-msgs { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
        .tg-bubble.sess-msg { align-self: flex-start; display: flex; flex-direction: column; gap: 2px; }
        .sess-who { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        @media (max-width: 760px) { .sess-list { padding-right: 38px; } } /* U2: ⛶ karta matni ustiga tushmaydi */
        /* s15: slot yorlig'i «1-qadam» */
        .dd-slotn.wide { width: auto; min-width: 26px; padding: 0 8px; white-space: nowrap; font-size: 12px; }
        /* s16: qadamlar navbat bilan */
        .lp-step.lp-compact { padding: 8px 12px; cursor: default; }
        .lp-step.lp-compact .lp-step-t { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lp-step.lp-cur { flex-wrap: wrap; cursor: default; box-shadow: inset 0 0 0 1.5px ${T.ink}22, 0 8px 18px -7px rgba(${T.shadowBase},0.24); }
        .lp-step.lp-cur .lp-step-t { flex: 1 1 200px; }
        .lp-step-btn { margin-left: auto; padding: 9px 18px; }
        @media (prefers-reduced-motion: reduce) {
          .daf-page, .daf-row, .mix-line, .dbt tr.rowin td, .daf-v.chg, .mem-line.wipe { animation: none !important; }
          .ln-draw .ln-path { animation: none !important; stroke-dashoffset: 0; }
          .ln-draw .ln-head { animation: none !important; opacity: 1; }
        }
        .ach-rule { margin: 8px 0 0; text-align: center; font-size: 13px; line-height: 1.4; color: ${T.ink2}; }
        .ach-rule.lost { font-style: italic; }
      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Bot eslab qoladi — holat va PostgreSQL', ru: "Бот запоминает — состояние и PostgreSQL" }} />
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
