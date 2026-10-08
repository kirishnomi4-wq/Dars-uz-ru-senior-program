import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 5-MODUL (BOTLAR) · 3-DARS — «TELEGRAM BOT API + TUGMALAR» — PLATFORM STANDARD v18 (AUDIOSIZ)
// Manba-haqiqat: feedback/F-0928-QA-5modul/03-BotApiButtons-v2.md (MD-birinchi, GATE M). Modul qoidalari A1–A9, U1–U3.
// Maqsad: 1-darsdagi hodisa → handler → javob modeli Telegraf kodida — token (.env + dotenv), xabar yo'li,
//   /start handleri, ctx, buyruq · inline tugma (callback → bot.action) · reply klaviatura (matn → bot.hears),
//   fallback handler — bot.on('text'), bot.launch(). Kod — bitta bot.js (CommonJS, node bot.js).
// INTERAKTIV: s7 ikki xil tugma (navbat bilan) · s9 MARKAZIY «uch hodisa — uch handler» · s11 javob boshqa chatga ·
//   s12 fallback handler · s13 /help javobi · s15 FINAL bot.js tartibi (DragDropOrder).
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

// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi.
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang , buildResultDetails, sealPayload, useAutoNext } from '../live/index.js';







const LangContext = createContext('uz');
const MentorCtx = createContext(null);
const AchCtx = createContext(null);
const AchMissCtx = createContext(null); // 🏅 151-qonun: { missed:Set<ekran id>, miss(idx), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi

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

const LESSON_META = { lessonId: 'bot-api-buttons-05-02-v18', lessonTitle: { uz: 'Telegram Bot API + tugmalar', ru: "Telegram Bot API + кнопки" } };
// 20 ekran · 4.1 oqim: hook → reja → (exploration↔test)× → markaziy o'yin → konvert → fallback → builder → final → praktika → podium → flashcard → summary
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
      <div ref={zref} className={`zoomable ${big ? 'zoom-on' : ''}${hasContent ? '' : ' z-empty'}${zFloat ? ' z-float' : ''}`}>
        {hasContent && <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })} title={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })}>{big ? '✕' : '⛶'}</button>}
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
          <div className="ach-pop-h">{tr({ uz: 'Nishonlar', ru: "Значки" })} — {count}/{total}</div>
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
  const collapseOn = isNarrow && !mentorStatic; // F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi
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
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: "Подождите ментора" }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr(label))}</button>;
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
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI). `ic` — karta belgisi: kod misoli yoki raqam (U3).
const RECAPS = {
  4: {
    title: { uz: 'Token — .env faylida', ru: "Токен — в файле .env" },
    cards: [
      { ic: "new Telegraf('1234…')", h: { uz: 'Token kodda yozilmaydi', ru: "Токен не пишут в коде" }, body: { uz: <>Kod Git'ga chiqsa, tokenni ko'rgan odam botni boshqara oladi.</>, ru: <>Если код попадёт в Git, любой, кто увидит токен, сможет управлять ботом.</> } },
      { ic: 'BOT_TOKEN=...', h: { uz: '.env faylida saqlanadi', ru: "Хранится в файле .env" }, body: { uz: <><b>.env</b> .gitignore'da, Git uni commit qilmaydi.</>, ru: <><b>.env</b> указан в .gitignore, Git его не коммитит.</> } },
      { ic: 'process.env.BOT_TOKEN', h: { uz: 'Kod faqat nomini o\'qiydi', ru: "Код читает только имя" }, body: { uz: <><span className="mono">process.env.BOT_TOKEN</span>; faylni <b>dotenv</b> yuklaydi.</>, ru: <><span className="mono">process.env.BOT_TOKEN</span>; файл загружает <b>dotenv</b>.</> }, ask: { uz: 'Token nega .env faylida saqlanadi?', ru: "Почему токен хранят в файле .env?" } },
    ]
  },
  8: {
    title: { uz: 'Ikki xil tugma', ru: 'Два вида кнопок' },
    cards: [
      { ic: "Markup.button.callback('Pitsa', 'pizza')", h: { uz: 'Inline tugma', ru: "Inline-кнопка" }, body: { uz: <>Xabar tagida turadi. Bosilsa, chatga matn yozilmaydi, botga <b>callback</b> keladi.</>, ru: <>Стоит под сообщением. При нажатии в чат ничего не пишется, боту приходит <b>callback</b>.</> } },
      { ic: "Markup.keyboard([['Pitsa']])", h: { uz: 'Reply klaviatura', ru: "Reply-клавиатура" }, body: { uz: <>Klaviatura o'rnida turadi. Bosilsa, tugma matni oddiy <b>xabar</b> bo'lib ketadi.</>, ru: <>Стоит на месте клавиатуры. При нажатии текст кнопки уходит обычным <b>сообщением</b>.</> } },
      { ic: '3', h: { uz: 'Farqni eslab qoling', ru: 'Запомните разницу' }, body: { uz: <>inline → callback → <span className="mono">bot.action</span>; reply → matn → <span className="mono">bot.hears</span>.</>, ru: <>inline → callback → <span className="mono">bot.action</span>; reply → текст → <span className="mono">bot.hears</span>.</> }, ask: { uz: 'Ikkalasi bosilganda nima farq qiladi?', ru: "Чем они отличаются при нажатии?" } },
    ]
  },
  10: {
    title: { uz: 'Handler hodisani ushlaydi', ru: "Handler ловит событие" },
    cards: [
      { ic: "bot.action('pizza', …)", h: { uz: 'Callback → bot.action', ru: "Callback → bot.action" }, body: { uz: <><span className="mono">bot.action('pizza')</span> tugma ma'lumoti 'pizza' bo'lganda ishlaydi.</>, ru: <><span className="mono">bot.action('pizza')</span> срабатывает, когда данные кнопки — 'pizza'.</> } },
      { ic: "bot.hears('Pitsa', …)", h: { uz: 'Matn → bot.hears', ru: "Текст → bot.hears" }, body: { uz: <><span className="mono">bot.hears('Pitsa')</span> matn aynan «Pitsa» bo'lganda ishlaydi.</>, ru: <><span className="mono">bot.hears('Pitsa')</span> срабатывает, когда текст ровно «Pitsa».</> } },
      { ic: '3', h: { uz: "Handler yo'q — javob yo'q", ru: "Нет handler-а — нет ответа" }, body: { uz: <>Hodisa keladi, lekin uni ushlaydigan handler bo'lmasa, bot jim qoladi.</>, ru: <>Событие приходит, но если нет handler-а, который его ловит, бот молчит.</> }, ask: { uz: 'Inline tugma bosilishini qaysi handler ushlaydi?', ru: "Какой handler ловит нажатие inline-кнопки?" } },
    ]
  },
  14: {
    title: { uz: 'Buyruqlar', ru: "Команды" },
    cards: [
      { ic: '/menu', h: { uz: '/ bilan boshlanadi', ru: 'Начинаются с /' }, body: { uz: <><span className="mono">/start</span>, <span className="mono">/help</span>, <span className="mono">/menu</span> — buyruqlar.</>, ru: <><span className="mono">/start</span>, <span className="mono">/help</span>, <span className="mono">/menu</span> — команды.</> } },
      { ic: "bot.command('menu', …)", h: { uz: 'Kodda — bot.command', ru: "В коде — bot.command" }, body: { uz: <><span className="mono">bot.command('menu', ...)</span> /menu ni ushlaydi; /start uchun — <span className="mono">bot.start</span>.</>, ru: <><span className="mono">bot.command('menu', ...)</span> ловит /menu; для /start — <span className="mono">bot.start</span>.</> } },
      { ic: '3', h: { uz: "Handler yo'q — javob yo'q", ru: "Нет handler-а — нет ответа" }, body: { uz: <>Buyruq keldi, lekin unga handler bo'lmasa, bot javob bermaydi.</>, ru: <>Команда пришла, но если для неё нет handler-а, бот не ответит.</> }, ask: { uz: 'Buyruq oddiy xabardan nimasi bilan farq qiladi?', ru: "Чем команда отличается от обычного сообщения?" } },
    ]
  },
  15: {
    title: { uz: 'bot.js tartibi', ru: "Порядок в bot.js" },
    cards: [
      { ic: 'process.env.BOT_TOKEN', h: { uz: 'Avval', ru: "Сначала" }, body: { uz: <>Token o'qiladi (<span className="mono">process.env.BOT_TOKEN</span>).</>, ru: <>Читается токен (<span className="mono">process.env.BOT_TOKEN</span>).</> } },
      { ic: 'new Telegraf(token)', h: { uz: 'Keyin', ru: "Потом" }, body: { uz: <>Bot yaratiladi: <span className="mono">new Telegraf(token)</span>, ya'ni bot (Telegraf obyekti).</>, ru: <>Создаётся бот: <span className="mono">new Telegraf(token)</span>, то есть бот (объект Telegraf).</> } },
      { ic: 'bot.launch()', h: { uz: "Handlerlar, so'ng ishga tushirish", ru: "Handler-ы, затем запуск" }, body: { uz: <>start, action, keyin fallback handler; <b>eng oxiri</b> launch().</>, ru: <>start, action, потом fallback handler; <b>в самом конце</b> launch().</> }, vis: <RcFlow items={['Token', 'Bot', 'start', 'action', 'fallback', 'launch']} />, ask: { uz: 'Nega launch() eng oxirida, fallback esa handlerlardan keyin turadi?', ru: "Почему launch() в самом конце, а fallback стоит после handler-ов?" } },
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
        <div className={`rc-ic ${/^\d+$/.test(String(card.ic)) ? 'num' : 'code'}`}>{card.ic}</div>
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тема осталась непонятной классу. Перед продолжением советуем коротко повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: 'Qayta tushuntirish —', ru: 'Объяснить заново —' })} {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 Верно <b>{pct}%</b> — неплохо. При желании коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Советуем объяснить заново.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в живом режиме…' })}</p>}
    </div>
  );
}

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _am = useContext(AchMissCtx);
  const fpPractice = !!(_am && _am.practice); // 151-qonun 6-band: «Qaytadan» mashq-o'tishi — hech qayerga yozilmaydi
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
      if (!fpPractice) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: ou(questionText), options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    // Har urinish tarixga (LMS analitika, 0005): ball emas, yozuv; modulsiz eski darsda recordAttempt yo'q
    if (live && live.recordAttempt && !fpPractice) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: ou(questionText), options: options.map(ou), picked: ou(options[i]), correct: ou(options[correctIdx]), lang: (typeof __lang !== 'undefined' && __lang === 'ru') ? 'ru' : 'uz' });
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
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: "Живой урок — одна попытка, подумайте перед нажатием!" })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: picked !== null ? 8 : 11 }}>
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
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: picked !== null ? 'clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)' : 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
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
                ? tr({ uz: 'Javobingiz qabul qilindi', ru: "Ваш ответ принят" })
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
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: 'Qisqa takrorlash — mavzuni yana bir ko\'rish', ru: "Короткое повторение — взглянуть на тему ещё раз" })}</button>
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

// ============================================================ BOT MAVZUSI KOMPONENTLARI

// Avatar — harf (A4: chatda emoji yo'q). `ref` — bog'lanish chizig'i uchun (A7).
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
const TgChat = ({ title = { uz: 'AvtoPizza bot', ru: 'AvtoPizza bot' }, sub = { uz: 'bot · onlayn', ru: 'бот · онлайн' }, ava = 'AP', verified, children, replyKb, input = true, minH }) => (
  <div className="tg">
    <div className="tg-head">
      <span className="tg-ava">{ava}</span>
      <span className="tg-name">{tr(title)}{verified && <span className="tg-badge">✓</span>}<span className="tg-status">{tr(sub)}</span></span>
    </div>
    <TgBody minH={minH}>{children}</TgBody>
    {replyKb && <div className="tg-replykb">{replyKb.map((row, ri) => <div key={ri} className="tg-replykb-row">{row.map((b, bi) => <span key={bi} ref={b.ref} className={`tg-replykb-btn ${b.onClick ? 'is-live' : ''} ${b.hint ? 'tap-hint' : ''}`} onClick={b.onClick}>{tr(b.label)}</span>)}</div>)}</div>}
    {input && <div className="tg-input"><span className="tg-input-field">{replyKb ? tr({ uz: 'Tugmani tanlang…', ru: 'Выберите кнопку…' }) : tr({ uz: 'Xabar yozing…', ru: 'Напишите сообщение…' })}</span><span className="tg-send">➤</span></div>}
  </div>
);
const Bubble = ({ from = 'bot', children, inline, bref }) => (
  <div className={`tg-bubble-wrap ${from}`}>
    <div ref={bref} className={`tg-bubble ${from} el-in`}>{children}</div>
    {inline && <div className="tg-inline el-in">{inline.map((row, ri) => <div key={ri} className="tg-inline-row">{row.map((b, bi) => <span key={bi} ref={b.ref} className={`tg-inline-btn ${b.fired ? 'fired' : ''} ${b.onClick ? 'is-live' : ''} ${b.hint ? 'tap-hint' : ''}`} onClick={b.onClick}>{tr(b.label)}{b.fired && <i className="tg-inline-spark" aria-hidden="true" />}</span>)}</div>)}</div>}
  </div>
);

// A7: bog'lanish chizig'i — elementlar orasida bir marta chiziladi (segmentlar ketma-ket, jami ~0.8–1 s).
// Koordinatalar o'rovchi (wrapRef, position: relative) ichida; CSS zoom / kattalashtirish nisbati hisobga olinadi.
// cols: ustunlararo chiziq — tor ekranda (760px dan kam) CSS bilan yashiriladi, ustunlar ustma-ust tushadi (N20).
function LinkLine({ wrapRef, refs, show, tone = 'accent', cols = false }) {
  const [segs, setSegs] = useState(null);
  useEffect(() => {
    if (!show) { setSegs(null); return; }
    const calc = () => {
      const w = wrapRef.current; if (!w) return;
      const els = refs.map(r => r && r.current).filter(Boolean);
      if (els.length < 2) { setSegs(null); return; }
      const wr = w.getBoundingClientRect();
      const k = w.offsetWidth ? wr.width / w.offsetWidth : 1;
      const box = (el) => { const r = el.getBoundingClientRect(); return { l: (r.left - wr.left) / k, t: (r.top - wr.top) / k, w: r.width / k, h: r.height / k }; };
      const bs = els.map(box);
      const out = [];
      for (let i = 1; i < bs.length; i++) {
        const a = bs[i - 1], b = bs[i];
        const acx = a.l + a.w / 2, acy = a.t + a.h / 2, bcx = b.l + b.w / 2, bcy = b.t + b.h / 2;
        const horiz = (b.l >= a.l + a.w) || (a.l >= b.l + b.w);
        let x0, y0, x1, y1, c;
        if (horiz && i === 1 && a.h < 48) {
          // kichik manba (chat tugmasi) — chiziq uning ostidan chiqadi, qo'shni tugma ustidan o'tmaydi
          const right = bcx > acx;
          x0 = acx; y0 = a.t + a.h; x1 = right ? b.l : b.l + b.w; y1 = bcy;
          c = `${x0.toFixed(1)} ${(y0 + 46).toFixed(1)}, ${(right ? x1 - 60 : x1 + 60).toFixed(1)} ${y1.toFixed(1)}`;
        } else if (horiz) {
          const right = bcx > acx;
          x0 = right ? a.l + a.w : a.l; y0 = acy; x1 = right ? b.l : b.l + b.w; y1 = bcy;
          const mx = (x0 + x1) / 2; c = `${mx.toFixed(1)} ${y0.toFixed(1)}, ${mx.toFixed(1)} ${y1.toFixed(1)}`;
        } else {
          const down = bcy > acy;
          x0 = acx; y0 = down ? a.t + a.h : a.t; x1 = bcx; y1 = down ? b.t : b.t + b.h;
          const my = (y0 + y1) / 2; c = `${x0.toFixed(1)} ${my.toFixed(1)}, ${x1.toFixed(1)} ${my.toFixed(1)}`;
        }
        out.push({ d: `M ${x0.toFixed(1)} ${y0.toFixed(1)} C ${c}, ${x1.toFixed(1)} ${y1.toFixed(1)}`, x1, y1 });
      }
      setSegs(out);
    };
    const raf = requestAnimationFrame(calc);
    window.addEventListener('resize', calc);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', calc); };
  }, [show]); // eslint-disable-line
  if (!segs) return null;
  const dur = segs.length > 1 ? 0.5 : 0.8;
  const last = segs[segs.length - 1];
  return (
    <svg className={`link-svg ${tone}${cols ? ' cols' : ''}`} aria-hidden="true">
      {segs.map((s, i) => <path key={i} className="link-path" d={s.d} pathLength="1" style={{ animationDuration: `${dur}s`, animationDelay: `${i * dur}s` }} />)}
      <circle className="link-dot" cx={last.x1} cy={last.y1} r="4" style={{ animationDelay: `${segs.length * dur}s` }} />
    </svg>
  );
}

// Yig'ilgan qadam (A6): bitta qator, ✓ bilan; ↻ — qayta ochish
const FoldRow = ({ children, onClick, open }) => (onClick
  ? <button type="button" className={`fold-row is-btn fade-step ${open ? 'open' : ''}`} onClick={onClick}><span className="fold-ck">✓</span><span className="fold-t">{children}</span><span className="fold-re" aria-hidden="true">↻</span></button>
  : <div className="fold-row fade-step"><span className="fold-ck">✓</span><span className="fold-t">{children}</span></div>);

const FAKE_TOKEN = '1234567890:AA-namuna-token';

// F-1002-82 · 167-qonun: har qatlamda bitta belgi (modul lug'ati: 📱 Telegram · 📦 Telegraf · 📄 kod-fayl)
const STACK = [
  { id: 'tg', ic: '📱', label: { uz: 'Telegram', ru: 'Telegram' }, sub: { uz: 'foydalanuvchi yozadi', ru: 'пишет пользователь' }, desc: { uz: 'Foydalanuvchi xabar yozadigan joy. Botlar Telegram bilan Telegram Bot API orqali gaplashadi.', ru: "Здесь пользователь пишет сообщение. Боты общаются с Telegram через Telegram Bot API." } },
  { id: 'telegraf', ic: '📦', label: { uz: 'Telegraf', ru: 'Telegraf' }, sub: { uz: 'aloqani bajaradi', ru: 'держит связь' }, desc: { uz: "Node.js kutubxonasi. Telegram Bot API bilan aloqani o'zi bajaradi — siz unga faqat token berasiz.", ru: "Библиотека Node.js. Связь с Telegram Bot API берёт на себя — вы даёте ей только токен." } },
  { id: 'botjs', ic: '📄', label: { uz: 'bot.js', ru: "bot.js" }, sub: { uz: 'handlerlar', ru: "handler-ы" }, desc: { uz: "Siz yozadigan fayl. Handlerlar shu yerda: `bot.start`, `bot.command`, `bot.hears`, `bot.action`. Handler javob yozadi, Telegraf uni Telegram'ga yuboradi.", ru: "Файл, который пишете вы. Здесь живут handler-ы: `bot.start`, `bot.command`, `bot.hears`, `bot.action`. Handler пишет ответ, Telegraf отправляет его в Telegram." } }
];

const HANDLER_PARTS = [
  { id: 'start', tok: 'bot.start', desc: { uz: "/start buyrug'i uchun handler. Foydalanuvchi botni ochib /start bosganda ishga tushadi.", ru: "Handler для команды /start. Срабатывает, когда пользователь открывает бота и нажимает /start." } },
  { id: 'ctx', tok: 'ctx', desc: { uz: "Shu hodisa haqidagi ma'lumot: kim yozdi, nima yozdi, qaysi chatdan. Ichini keyingi ekranda ochamiz.", ru: "Данные об этом событии: кто написал, что написал, из какого чата. Заглянем внутрь на следующем экране." } },
  { id: 'reply', tok: 'ctx.reply', desc: { uz: "Javob yuboradigan metod: xabarni kelgan chatning o'ziga yuboradi. Bu — 1-darsdagi javob.", ru: "Метод, который отправляет ответ: шлёт сообщение в тот же чат, откуда оно пришло. Это и есть ответ из 1-го урока." } }
];

// accept — to'g'ri deb qabul qilinadigan tartiblar (KOD 13: start ↔ action ikkalasi ham to'g'ri) · flow — [dan, gacha] uya: to'g'ri yig'ilgach strelka (A7)
function DragDropOrder({ items, hints, onSolved, doneText, onChange, accept, flow }) {
  const order = items.map(x => x.id);
  const orders = accept && accept.length ? accept : [order];
  const byId = useMemo(() => Object.fromEntries(items.map(x => [x.id, x])), [items]);
  const [st, setSt] = useState(() => {
    const a = order.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return { pool: a, slots: order.map(() => null) };
  });
  const { pool, slots } = st;
  const slotRefs = useRef([]);
  const full = slots.every(s => s !== null);
  const solved = full && orders.some(o => o.every((id, i) => slots[i] === id));
  const wrong = full && !solved;
  const [flowBox, setFlowBox] = useState(null);
  useEffect(() => { if (solved) onSolved && onSolved(); }, [solved]); // eslint-disable-line
  useEffect(() => { onChange && onChange(slots); }, [slots]); // eslint-disable-line
  useEffect(() => {
    if (!solved || !flow) { setFlowBox(null); return; }
    const a = slotRefs.current[flow[0]], b = slotRefs.current[flow[1]];
    if (!a || !b) return;
    const top = a.offsetTop + a.offsetHeight / 2;
    setFlowBox({ top, height: b.offsetTop + b.offsetHeight / 2 - top });
  }, [solved]); // eslint-disable-line
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
        {flowBox && <span className="dd-flow" style={{ top: flowBox.top, height: flowBox.height }} aria-hidden="true" />}
      </div>
      <div className="dd-pool">
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>
      {solved && doneText && <div className="dd-done">✓ {tr(doneText)}</div>}
    </div>
  );
}

// ===== SCREEN 0 — HOOK: 1-darsda ochilgan botga /start — javob yo'q =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [sent, setSent] = useState(!!storedAnswer);
  const [quiet, setQuiet] = useState(!!storedAnswer);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const OPTS = [
    { id: 'a', label: { uz: "Bot hali @BotFather tekshiruvidan o'tib bo'lmagan", ru: "Бот ещё не прошёл проверку @BotFather" } },
    { id: 'b', label: { uz: "Botda hali kod yo'q, /start ni ushlaydigan handler ham yo'q", ru: "В боте ещё нет кода, нет и handler-а, который ловит /start" } },
    { id: 'c', label: { uz: "Yangi bot bir kun o'tgach javob bera boshlaydi", ru: "Новый бот начинает отвечать только через день" } }
  ];
  useEffect(() => {
    if (!sent || quiet) return;
    const t = setTimeout(() => { setQuiet(true); setSc(n => n + 1); }, 1500);
    return () => clearTimeout(t);
  }, [sent, quiet]);
  const send = () => { if (sent) return; setSent(true); setSc(n => n + 1); };
  const pick = (v) => { if (picked !== null || !quiet) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr({ uz: <>Botingizga /start yuboring. <span className="italic" style={{ color: T.accent }}>Nima bo'larkin?</span></>, ru: <>Отправьте боту /start. <span className="italic" style={{ color: T.accent }}>Что произойдёт?</span></> })}</h1>
        <Mentor>{tr({ uz: <>O'tgan darsda botingizning birinchi foydalanuvchilari qaysi guruhlardan kelishini rejalashtirdingiz. Ularning har biri avval /start bosadi. Tugmani bosing va ular nimani ko'rishini kuzating.</>, ru: <>На прошлом уроке вы спланировали, из каких групп придут первые пользователи вашего бота. Каждый из них сначала нажмёт /start. Нажмите кнопку и посмотрите, что они увидят.</> })}</Mentor>
        <Zoomable><Split>
          <Col>
            <p className="small chat-note">{tr({ uz: <>1-darsda: @BotFather botingizni ochdi va token berdi — <span className="mono">7***:AA***xZ</span></>, ru: <>На 1-м уроке: @BotFather открыл вашего бота и выдал токен — <span className="mono">7***:AA***xZ</span></> })}</p>
            <TgChat sub={{ uz: 'sizning botingiz', ru: "ваш бот" }} input={false} minH={110}>
              {sent && <Bubble from="user">/start</Bubble>}
            </TgChat>
            {quiet && <p className="small chat-quiet fade-step">{tr({ uz: 'Javob kelmadi.', ru: "Ответа нет." })}</p>}
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={send} disabled={sent}>{sent ? tr({ uz: '✓ /start yuborildi', ru: "✓ /start отправлен" }) : tr({ uz: '▶ /start yuborish', ru: "▶ Отправить /start" })}</button>
          </Col>
          <Col>
            {quiet && <>
              <p className="eyebrow fade-up" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Bot nega javob bermadi?', ru: "Почему бот не ответил?" })}</p>
              <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {OPTS.map(o => {
                  const on = picked === o.id;
                  return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>);
                })}
              </div>
              {picked !== null && <p className="hook-ack fade-step">{picked === 'b'
                ? tr({ uz: <><b>Aynan!</b> @BotFather botni ochdi va token berdi, lekin javobni kod beradi: /start ni handler ushlashi kerak.</>, ru: <><b>Именно!</b> @BotFather открыл бота и выдал токен, но отвечает код: /start должен поймать handler.</> })
                : tr({ uz: <><b>Qiziq fikr!</b> Tekshiruv ham, kutish ham yo'q — botda hali kod yo'q: /start ni ushlaydigan handler kerak.</>, ru: <><b>Интересная мысль!</b> Ни проверки, ни ожидания нет — в боте ещё нет кода: нужен handler для /start.</> })}</p>}
            </>}
          </Col>
        </Split></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { uz: 'Token kodda: .env va dotenv', ru: "Токен в коде: .env и dotenv", tag: { uz: "dotenv", ru: "dotenv" } },
    { uz: 'Xabar botga qanday yetib keladi: Telegram → Telegraf → bot.js', ru: "Как сообщение доходит до бота: Telegram → Telegraf → bot.js", tag: { uz: "Telegraf", ru: "Telegraf" } },
    { uz: '/start handleri va ctx', ru: "Handler /start и ctx", tag: { uz: "ctx", ru: "ctx" } },
    { uz: 'Buyruqlar, inline tugma va reply klaviatura', ru: "Команды, inline-кнопка и reply-клавиатура", tag: { uz: "Markup", ru: "Markup" } }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const Preview = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Dars oxirida bu menyuning har qismini tushuntirib bera olasiz', ru: "К концу урока вы сможете объяснить каждую часть этого меню" })}</p>
      <TgChat input={false} minH={0} replyKb={[[{ label: { uz: 'Biz haqimizda', ru: "О нас" } }]]}>
        <Bubble from="user">/menu</Bubble>
        <Bubble from="bot" inline={[[{ label: { uz: 'Pitsa', ru: "Пицца" } }, { label: { uz: 'Ichimlik', ru: "Напитки" } }]]}>{tr({ uz: "Salom! AvtoPizza'ga xush kelibsiz. Nima qilamiz?", ru: "Привет! Добро пожаловать в AvtoPizza. Что делаем?" })}</Bubble>
      </TgChat>
      <p className="small chat-note">{tr({ uz: 'Buyruq — / bilan boshlanadigan xabar: /start, /help, /menu.', ru: "Команда — сообщение, которое начинается с /: /start, /help, /menu." })}</p>
    </Col>
  );
  const StepsB = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 4 qadam', ru: '4 шага на сегодня' })}</p>
      <ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s)}</span>{s.tag && <span className="step-tag">{tr(s.tag)}</span>}</span></li>))}</ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun botingiz <span className="italic" style={{ color: T.accent }}>javob beradi</span> va tugmalar ko'rsatadi.</>, ru: <>Сегодня ваш бот <span className="italic" style={{ color: T.accent }}>ответит</span> и покажет кнопки.</> })}</h2></div>
        <Mentor>{tr({ uz: <>1-darsda <b style={{ color: T.ink }}>hodisa → handler → javob</b> modelini ko'rdingiz. Bugun uni Telegraf kodida yozasiz. Chapdagi menyuda uch xil hodisa bor: buyruq, inline tugma va reply klaviatura — har biriga o'z handleri kerak.</>, ru: <>На 1-м уроке вы видели модель <b style={{ color: T.ink }}>событие → handler → ответ</b>. Сегодня вы напишете её в коде Telegraf. В меню слева три вида событий: команда, inline-кнопка и reply-клавиатура — каждому нужен свой handler.</> })}</Mentor>
        {!isNarrow ? (<Zoomable><Split>{Preview}{StepsB}</Split></Zoomable>)
          : !showSteps ? <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{Preview}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "4 qadamni ko'rish", ru: 'Посмотреть 4 шага' })}</button></div>
            : <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Menyuni ko'rish", ru: "↩ Посмотреть меню" })}</button>{StepsB}</div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — TOKEN KODDA: .env + dotenv =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [show, setShow] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = show;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · token', ru: "Понятие · токен" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Xavfsiz usulni ko'ring", ru: 'Посмотрите безопасный способ' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Token kodda <span className="italic" style={{ color: T.accent }}>qanday o'qiladi</span>?</>, ru: <>Как токен <span className="italic" style={{ color: T.accent }}>читается в коде</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>1-darsda tokenni .env faylida saqlash kerakligini ko'rdingiz. Endi bu kodda qanday ko'rinishini ko'ramiz. Tugmani bosing.</>, ru: <>На 1-м уроке вы видели, что токен нужно хранить в файле .env. Теперь посмотрим, как это выглядит в коде. Нажмите кнопку.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <p className="flow-label" style={{ color: T.danger }}>{tr({ uz: 'Xato: token kodda ochiq', ru: "Ошибка: токен открыто в коде" })}</p>
            <CodeFile name="bot.js" minH={70}>
              <Kw>const</Kw>{' bot = '}<Kw>new</Kw>{' '}<At>Telegraf</At>{'('}<St>'{FAKE_TOKEN}'</St>{')'}{'\n'}
              <Cm>{tr({ uz: "// kod Git'ga chiqsa, token ham u bilan chiqadi", ru: "// если код попадёт в Git, токен уйдёт вместе с ним" })}</Cm>
            </CodeFile>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={show} onClick={() => { setShow(true); setSc(n => n + 1); }}>{show ? tr({ uz: "✓ Ko'rdingiz", ru: '✓ Вы посмотрели' }) : tr({ uz: "To'g'ri usul qanday?", ru: 'А как правильно?' })}</button>
          </Col>
          <Col>
            {show ? <>
              <p className="flow-label" style={{ color: T.success }}>{tr({ uz: "To'g'ri: token .env faylida", ru: "Правильно: токен в файле .env" })}</p>
              <CodeFile name=".env" minH={0}>
                <At>BOT_TOKEN</At>{'='}{FAKE_TOKEN}{'\n'}
                <Cm>{tr({ uz: "# .env fayli .gitignore'da — Git uni commit qilmaydi", ru: "# файл .env указан в .gitignore — Git его не коммитит" })}</Cm>
              </CodeFile>
              <CodeFile name="bot.js" minH={0}>
                <At>require</At>{'('}<St>'dotenv'</St>{').'}<At>config</At>{'()   '}<Cm>{tr({ uz: '// .env faylini process.env ga yuklaydi', ru: "// загружает файл .env в process.env" })}</Cm>{'\n'}
                <Kw>const</Kw>{' bot = '}<Kw>new</Kw>{' '}<At>Telegraf</At>{'(process.env.'}<At>BOT_TOKEN</At>{')'}
              </CodeFile>
            </> : null}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Xuddi <span className="mono">JWT_SECRET</span> kabi: kodda token emas, nomi turadi — <span className="mono">process.env.BOT_TOKEN</span>. .env ni <span className="mono">dotenv</span> yuklaydi.</>, ru: <>Как <span className="mono">JWT_SECRET</span>: в коде не токен, а его имя — <span className="mono">process.env.BOT_TOKEN</span>. Файл .env загружает <span className="mono">dotenv</span>.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — XABAR YO'LI: Telegram → Telegraf → bot.js (A7: yo'l va javob strelkasi chiziladi) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(STACK.map(s => s.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= STACK.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const cur = STACK.find(s => s.id === active);
  const play = done ? 1 : 0; // uchala qatlam ochilganda xabar yo'li bir marta qayta o'ynaydi
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · xabar yo'li", ru: "Понятие · путь сообщения" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Qatlamlarni ko'ring (${seen.size}/3)`, ru: `Посмотрите слои (${seen.size}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Xabar botingizga <span className="italic" style={{ color: T.accent }}>qanday yetib keladi</span>?</>, ru: <>Как сообщение <span className="italic" style={{ color: T.accent }}>доходит до вашего бота</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>1-darsda bu yo'lni sxemada ko'rdingiz. Endi har qismini kod bilan bog'laymiz. Har qatlamni bosing.</>, ru: <>На 1-м уроке вы видели этот путь на схеме. Теперь свяжем каждую часть с кодом. Нажмите на каждый слой.</> })}</Mentor>
        {/* F-1002-82 · 167-qonun: tushuncha-oqim sahnasi — xabar-pufak yo'l bo'ylab yuradi, javob qaytish chizig'idan qaytadi */}
        <div className="xpn fade-up">
          <div className="xpn-row">
            {STACK.map(s => (
              <button key={s.id} type="button" className={`xpn-node ${seen.has(s.id) ? 'on' : 'tap-wave'} ${active === s.id ? 'sel' : ''}`} onClick={() => tap(s.id)}>
                <span className="xpn-mk" aria-hidden="true">{seen.has(s.id) ? '✓' : '›'}</span>
                <span className="xpn-ic" aria-hidden="true">{s.ic}</span>
                <span className="xpn-lbl">{tr(s.label)}</span>
                <span className="xpn-sub">{tr(s.sub)}</span>
              </button>
            ))}
          </div>
          <div className="xpn-track" aria-hidden="true"><i className="xpn-go" /><span className="xpn-pill msg" key={`m${play}`}>/start</span></div>
          <div className="xpn-track back" aria-hidden="true"><i className="xpn-ret" /><span className="xpn-ret-lbl">{tr({ uz: 'javob', ru: "ответ" })}</span><span className="xpn-pill rep" key={`r${play}`}>{tr({ uz: 'Salom!', ru: "Привет!" })}</span></div>
        </div>
        {cur && <div className="sk-info fade-step" key={active}><p className="note-h">{tr(cur.label)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{fmtCode(tr(cur.desc))}</p></div>}
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Siz faqat handlerlarni yozasiz — Telegram bilan aloqani Telegraf bajaradi. Bugun hammasi bitta bot.js faylida.</>, ru: <>Вы пишете только handler-ы — связь с Telegram берёт на себя Telegraf. Сегодня всё в одном файле bot.js.</> })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 =====
const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    questionText={{ uz: "Bot tokenini qayerda saqlash to'g'ri?", ru: "Где правильно хранить токен бота?" }}
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Bot <span className="mono" style={{ color: T.accent }}>tokenini</span> qayerda saqlash <span className="italic" style={{ color: T.accent }}>to'g'ri</span>?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите правильный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Где <span className="italic" style={{ color: T.accent }}>правильно</span> хранить <span className="mono" style={{ color: T.accent }}>токен</span> бота?</h2></> })}
    options={[
      { uz: "bot.js ichida — new Telegraf(...) qatorining o'zida", ru: "В bot.js — прямо в строке new Telegraf(...)" },
      { uz: '.env faylida — kod uni process.env.BOT_TOKEN orqali o\'qiydi', ru: "В файле .env — код читает его через process.env.BOT_TOKEN" },
      { uz: 'README.md ichida — jamoa tokenni tez topishi uchun', ru: "В README.md — чтобы коллеги быстро находили токен" },
      { uz: "Bot tavsifida — @BotFather'dagi tavsif maydonida", ru: "В описании бота — в поле описания у @BotFather" }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Token .env faylida turadi, kod uni process.env.BOT_TOKEN orqali o'qiydi.", ru: "Токен лежит в файле .env, код читает его через process.env.BOT_TOKEN." }}
    explainWrong={{
      0: { uz: "Kod Git'ga chiqsa, token ham u bilan chiqadi — kodni ko'rgan odam botingizni boshqara oladi.", ru: "Если код попадёт в Git, токен уйдёт вместе с ним — любой, кто увидит код, сможет управлять вашим ботом." },
      2: { uz: "README — hammaga ochiq hujjat. Uni o'qigan har kim tokenni ko'radi.", ru: "README — открытый для всех документ. Каждый, кто его прочтёт, увидит токен." },
      3: { uz: "Bot tavsifini botni ochgan har bir odam ko'radi — token hammaga ochiq bo'lib qoladi.", ru: "Описание бота видит каждый, кто открыл бота, — токен станет доступен всем." },
      default: { uz: "Token .env faylida saqlanadi: kod uni process.env.BOT_TOKEN orqali o'qiydi, Git esa .env ni commit qilmaydi.", ru: "Токен хранится в файле .env: код читает его через process.env.BOT_TOKEN, а Git не коммитит .env." }
    }} />
);

// ===== SCREEN 5 — /start HANDLERI =====
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
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Birinchi handler: <span className="italic" style={{ color: T.accent }}>/start</span> kelganda bot salom yozadi.</>, ru: <>Первый handler: на <span className="italic" style={{ color: T.accent }}>/start</span> бот здоровается.</> })}</h2></div>
        <Mentor>{tr({ uz: <>1-darsdagi «<b style={{ color: T.ink }}>/start → salom</b>» endi haqiqiy kodda. Uch qismni bosib, har biri nima qilishini oching.</>, ru: <>«<b style={{ color: T.ink }}>/start → привет</b>» из 1-го урока теперь в настоящем коде. Нажмите на три части и узнайте, что делает каждая.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <CodeFile name="bot.js" minH={110}>
              <Kw>bot</Kw>{'.'}<At>start</At>{'(('}<Kw>ctx</Kw>{') => {'}{'\n'}
              {'  '}<Kw>ctx</Kw>{'.'}<At>reply</At>{'('}<St>'Salom!'</St>{')'}{'\n'}
              {'})'}
            </CodeFile>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {HANDLER_PARTS.map(p => <button key={p.id} className={`gchip open-chip ${seen.has(p.id) ? 'seen' : 'tap-wave'} ${active === p.id ? 'sel' : ''}`} onClick={() => tap(p.id)}><span className="mono">{p.tok}</span><span className="open-mk" aria-hidden="true">{seen.has(p.id) ? '✓' : '›'}</span></button>)}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="note-h"><span className="mono" style={{ color: T.accent }}>{cur.tok}</span></p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.desc)}</p></div>
              : null}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — ctx ICHIDA NIMA BOR =====
const CTX_FIELDS = [
  { id: 'from', tok: 'ctx.from', val: { uz: '{ id: 5012, first_name: "Aziza" }', ru: '{ id: 5012, first_name: "Aziza" }' }, desc: { uz: "Kim yozdi: foydalanuvchining id raqami va ismi.", ru: "Кто написал: id и имя пользователя." } },
  { id: 'text', tok: 'ctx.message.text', val: { uz: '"Salom"', ru: '"Привет"' }, desc: { uz: 'Foydalanuvchi yuborgan matn.', ru: "Текст, который отправил пользователь." } },
  { id: 'chat', tok: 'ctx.chat', val: { uz: '{ id: 5012, type: "private" }', ru: "{ id: 5012, type: \"private\" }" }, desc: { uz: 'Xabar kelgan chat. ctx.reply javobni aynan shu chatga yuboradi.', ru: "Чат, откуда пришло сообщение. ctx.reply отправляет ответ именно в этот чат." } }
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
    <Stage eyebrow={tr({ uz: 'Kod · ctx', ru: "Код · ctx" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `ctx ichini oching (${seen.size}/3)`, ru: `Откройте ctx (${seen.size}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="mono" style={{ color: T.accent }}>ctx</span> ichida <span className="italic" style={{ color: T.accent }}>nima bor</span>?</>, ru: <>Что лежит <span className="italic" style={{ color: T.accent }}>внутри</span> <span className="mono" style={{ color: T.accent }}>ctx</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>ctx — context so'zining qisqartmasi. Har handler uni hodisa bilan birga oladi. Uni konvertga o'xshatish mumkin: ichida xat, ustida qaytish manzili. Ichidagi uch maydonni bosib ko'ring.</>, ru: <>ctx — сокращение от слова context. Каждый handler получает его вместе с событием. Его можно сравнить с конвертом: внутри письмо, сверху обратный адрес. Нажмите на три поля внутри.</> })}</Mentor>
        <Zoomable>
        <div className="split">
          <Col>
            <div className="env-card">
              <p className="flow-label" style={{ marginBottom: 8 }}>{tr({ uz: 'ctx — Aziza «Salom» deb yozdi', ru: "ctx — Азиза написала «Привет»" })}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {CTX_FIELDS.map(f => <button key={f.id} className={`pick-row ${seen.has(f.id) ? 'picked' : 'tap-wave'} ${active === f.id ? 'sel' : ''}`} onClick={() => tap(f.id)}><span className="mono" style={{ flex: 1 }}>{f.tok}</span><span className="pick-plus" aria-hidden="true">{seen.has(f.id) ? '✓' : '›'}</span></button>)}
              </div>
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="note-h"><span className="mono" style={{ color: T.accent }}>{cur.tok}</span></p><p className="mono small" style={{ color: T.success, margin: '0 0 6px' }}>{tr(cur.val)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.desc)}</p></div>
              : null}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>ctx har hodisada yangi: Aziza yozsa — Azizaniki, Bek yozsa — Bekniki. ctx.reply javobni shu odamga yuboradi.</>, ru: <>ctx новый при каждом событии: пишет Азиза — её данные, пишет Бек — его. ctx.reply отправляет ответ этому человеку.</> })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — IKKI XIL TUGMA: avval inline tugma, keyin reply klaviatura (A6: navbat bilan) =====
const S7_PIZZA = { uz: 'Pitsa', ru: "Пицца" };
const S7_DRINK = { uz: 'Ichimlik', ru: "Напитки" };
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [cb, setCb] = useState(storedAnswer ? 'pizza' : null);                // inline: bosilgan tugma ma'lumoti
  const [txt, setTxt] = useState(storedAnswer ? S7_PIZZA : null);            // reply: chatga tushgan tugma matni
  const [fold, setFold] = useState(storedAnswer ? 2 : 0);                    // nechta qadam yig'ilgan
  const [peek, setPeek] = useState(null);                                    // ↻ bilan qayta ochilgan qadam
  const [sc, setSc] = useState(0);
  const wrapRef = useRef(null), pBtn = useRef(null), dBtn = useRef(null), pData = useRef(null), dData = useRef(null);
  const tried = (cb ? 1 : 0) + (txt ? 1 : 0);
  const done = fold >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  useEffect(() => {
    if (cb && fold === 0) { const t = setTimeout(() => { setFold(1); setPeek(null); setSc(n => n + 1); }, 3600); return () => clearTimeout(t); }
    if (txt && fold === 1) { const t = setTimeout(() => { setFold(2); setPeek(null); setSc(n => n + 1); }, 3000); return () => clearTimeout(t); }
  }, [cb, txt, fold]);
  const inlineClick = (data) => { if (cb) return; setCb(data); setSc(n => n + 1); };
  const replyClick = (label) => { if (txt) return; setTxt(label); setSc(n => n + 1); };
  const togglePeek = (n) => setPeek(p => (p === n ? null : n));
  const step1 = (
    <div className="link-wrap" ref={wrapRef}>
      <div className="split">
        <Col>
          <p className="small chat-note">{tr({ uz: 'Inline tugma — xabarning tagida, unga yopishib turadigan tugma.', ru: "Inline-кнопка — кнопка под сообщением, прикреплённая к нему." })}</p>
          <TgChat input={false} minH={0}>
            <Bubble from="user">/menu</Bubble>
            <Bubble from="bot" inline={[[{ label: S7_PIZZA, ref: pBtn, fired: cb === 'pizza', hint: !cb, onClick: cb ? undefined : () => inlineClick('pizza') }, { label: S7_DRINK, ref: dBtn, fired: cb === 'drink', hint: !cb, onClick: cb ? undefined : () => inlineClick('drink') }]]}>{tr({ uz: 'Menyuni tanlang:', ru: 'Выберите из меню:' })}</Bubble>
          </TgChat>
        </Col>
        <Col>
          <CodeFile name="bot.js" minH={0}>
            <Kw>ctx</Kw>{'.'}<At>reply</At>{'('}<St>{tr({ uz: "'Menyuni tanlang:'", ru: "'Выберите из меню:'" })}</St>{', '}<At>Markup</At>{'.'}<At>inlineKeyboard</At>{'([\n'}
            {'  '}<At>Markup</At>{'.button.'}<At>callback</At>{'('}<St>'Pitsa'</St>{', '}<span ref={pData}><St>'pizza'</St></span>{'),\n'}
            {'  '}<At>Markup</At>{'.button.'}<At>callback</At>{'('}<St>'Ichimlik'</St>{', '}<span ref={dData}><St>'drink'</St></span>{'),\n'}
            {']))'}
          </CodeFile>
          <p className="small chat-note">{tr({ uz: "Markup — Telegraf'ning tugma yasaydigan yordamchisi.", ru: "Markup — помощник Telegraf, который создаёт кнопки." })}</p>
          {cb && <div className="sk-info fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Botga callback keldi: <span className="mono">'{cb}'</span>. Chatga yangi xabar qo'shilmadi.</>, ru: <>Боту пришёл callback: <span className="mono">'{cb}'</span>. В чат новое сообщение не добавилось.</> })}</p><p className="body" style={{ margin: '6px 0 0', color: T.ink }}>{tr({ uz: <>Callback — inline tugma bosilganda botga keladigan hodisa. Ichida tugma ma'lumoti bor — kodda yozilgan <span className="mono">'{cb}'</span>. Uni <span className="mono">bot.action('{cb}', ...)</span> ushlaydi.</>, ru: <>Callback — событие, которое приходит боту при нажатии inline-кнопки. Внутри — данные кнопки из кода: <span className="mono">'{cb}'</span>. Его ловит <span className="mono">bot.action('{cb}', ...)</span>.</> })}</p></div>}
        </Col>
      </div>
      <LinkLine wrapRef={wrapRef} refs={cb === 'drink' ? [dBtn, dData] : [pBtn, pData]} show={!!cb && fold === 0} cols />
    </div>
  );
  const step2 = (
    <div className="split">
      <Col>
        <p className="small chat-note">{tr({ uz: "Reply klaviatura — oddiy klaviatura o'rnida chiqadigan tugmalar.", ru: "Reply-клавиатура — кнопки, которые появляются на месте обычной клавиатуры." })}</p>
        <TgChat minH={0} replyKb={[[{ label: S7_PIZZA, hint: !txt, onClick: txt ? undefined : () => replyClick(S7_PIZZA) }, { label: S7_DRINK, hint: !txt, onClick: txt ? undefined : () => replyClick(S7_DRINK) }]]}>
          <Bubble from="bot">{tr({ uz: 'Tugmani bosing:', ru: "Нажмите кнопку:" })}</Bubble>
          {txt && <Bubble from="user">{tr(txt)}</Bubble>}
        </TgChat>
      </Col>
      <Col>
        <CodeFile name="bot.js" minH={0}>
          <Kw>ctx</Kw>{'.'}<At>reply</At>{'('}<St>{tr({ uz: "'Tugmani bosing:'", ru: "'Нажмите кнопку:'" })}</St>{', '}<At>Markup</At>{'.'}<At>keyboard</At>{'([['}<St>'Pitsa'</St>{', '}<St>'Ichimlik'</St>{']]).'}<At>resize</At>{'())'}
        </CodeFile>
        {txt && <div className="sk-info fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Tugma matni oddiy xabar bo'lib ketdi. Uni <span className="mono">bot.hears('{ou(txt)}', ...)</span> ushlaydi.</>, ru: <>Текст кнопки ушёл обычным сообщением. Его ловит <span className="mono">bot.hears('{ou(txt)}', ...)</span>.</> })}</p></div>}
      </Col>
    </div>
  );
  const row1 = tr({ uz: <>Inline tugma → callback <span className="mono">'{cb}'</span> → <span className="mono">bot.action</span></>, ru: <>Inline-кнопка → callback <span className="mono">'{cb}'</span> → <span className="mono">bot.action</span></> });
  const row2 = tr({ uz: <>Reply klaviatura → matn «{txt ? ou(txt) : ''}» → <span className="mono">bot.hears</span></>, ru: <>Reply-клавиатура → текст «{txt ? ou(txt) : ''}» → <span className="mono">bot.hears</span></> });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ikki xil tugma', ru: "Понятие · два вида кнопок" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Ikkala turni sinang (${tried}/2)`, ru: `Попробуйте оба вида (${tried}/2)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tugma bosilganda botga <span className="italic" style={{ color: T.accent }}>nima ketadi?</span></>, ru: <>Что уходит боту <span className="italic" style={{ color: T.accent }}>при нажатии кнопки?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Telegram botlarida tugmaning ikki turi bor. Avval inline tugmani, keyin reply klaviaturani bosib ko'ring va chatga qarang.</>, ru: <>В Telegram-ботах есть два вида кнопок. Нажмите сначала inline-кнопку, потом reply-клавиатуру и посмотрите на чат.</> })}</Mentor>
        <Zoomable>
          <div className="steps-col">
            {fold === 0 ? <>
              <p className="step-h">{tr({ uz: '1-qadam · Inline tugma', ru: "Шаг 1 · Inline-кнопка" })}</p>
              {step1}
            </> : <>
              <FoldRow open={peek === 1} onClick={() => togglePeek(1)}>{row1}</FoldRow>
              {peek === 1 && step1}
            </>}
            {fold === 1 && <>
              <p className="step-h fade-step">{tr({ uz: '2-qadam · Reply klaviatura', ru: "Шаг 2 · Reply-клавиатура" })}</p>
              {step2}
            </>}
            {fold >= 2 && <>
              <FoldRow open={peek === 2} onClick={() => togglePeek(2)}>{row2}</FoldRow>
              {peek === 2 && step2}
            </>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Inline tugma — shu xabarga tegishli tanlov. Reply klaviatura — doim kerak tugmalar: Menyu, Savat, Yordam.</>, ru: <>Inline-кнопка — выбор для этого сообщения. Reply-клавиатура — кнопки, нужные всегда: Меню, Корзина, Помощь.</> })}</p></div>}
          </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST 2 =====
const Screen8 = (props) => (
  <QuestionScreen {...props} idx={8} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    questionText={{ uz: 'Inline tugma va reply klaviatura tugmasi bosilganda nima farq qiladi?', ru: "Чем отличается нажатие inline-кнопки и кнопки reply-клавиатуры?" }}
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Inline tugma va reply klaviatura tugmasi bosilganda nima <span className="italic" style={{ color: T.accent }}>farq qiladi</span>?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите правильный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Чем <span className="italic" style={{ color: T.accent }}>отличается</span> нажатие inline-кнопки и кнопки reply-клавиатуры?</h2></> })}
    options={[
      { uz: 'Ikkalasi ham tugma matnini chatga oddiy xabar qilib yuboradi', ru: "Обе отправляют текст кнопки в чат обычным сообщением" },
      { uz: 'Inline tugma rasm yuboradi, reply tugmasi esa faqat matn yuboradi', ru: "Inline-кнопка отправляет картинку, а reply-кнопка — только текст" },
      { uz: 'Inline tugma faqat guruhda, reply tugmasi faqat shaxsiy chatda ishlaydi', ru: "Inline-кнопка работает только в группе, reply-кнопка — только в личном чате" },
      { uz: 'Inline tugma chatga matn yozmaydi, reply tugmasi matnini xabar qiladi', ru: "Inline-кнопка не пишет текст в чат, reply-кнопка отправляет свой текст сообщением" }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Inline tugma botga callback yuboradi, reply tugma esa o'z matnini chatga xabar qilib yuboradi.", ru: "Inline-кнопка отправляет боту callback, а reply-кнопка отправляет свой текст в чат сообщением." }}
    explainWrong={{
      0: { uz: "Bu faqat reply klaviaturaga to'g'ri. Inline tugma bosilganda chatga matn yozilmaydi — botga callback keladi.", ru: "Это верно только для reply-клавиатуры. При нажатии inline-кнопки в чат ничего не пишется — боту приходит callback." },
      1: { uz: "Inline tugma rasm yubormaydi: bosilganda botga tugma ma'lumoti keladi, masalan 'pizza'.", ru: "Inline-кнопка не отправляет картинку: при нажатии боту приходят данные кнопки, например 'pizza'." },
      2: { uz: 'Ikkala tugma ham guruhda ham, shaxsiy chatda ham ishlaydi. Farq — bosilganda nima yuborilishida.', ru: "Обе кнопки работают и в группе, и в личном чате. Разница — в том, что отправляется при нажатии." },
      default: { uz: "Inline tugma → callback (chatda ko'rinmaydi); reply klaviatura → oddiy matnli xabar.", ru: "Inline-кнопка → callback (в чате не виден); reply-клавиатура → обычное текстовое сообщение." }
    }} />
);

// ===== ★ SCREEN 9 — MARKAZIY O'YIN: UCH HODISA — UCH HANDLER (A6: navbat bilan · A7: hodisa → handler chizig'i) =====
const S9_STEPS = [
  { id: 'cmd', chip: '/menu', head: { uz: '1-qadam · Buyruq', ru: "Шаг 1 · Команда" }, rule: "bot.command('menu', ...)",
    reply: { uz: 'Menyu. Tanlang:', ru: "Меню. Выберите:" },
    row: { uz: <>/menu → <span className="mono">bot.command('menu')</span></>, ru: <>/menu → <span className="mono">bot.command('menu')</span></> } },
  { id: 'pizza', chip: { uz: 'Pitsa', ru: 'Пицца' }, head: { uz: '2-qadam · Inline tugma', ru: "Шаг 2 · Inline-кнопка" }, rule: "bot.action('pizza', ...)",
    tip: { uz: 'Chatdagi «Pitsa» tugmasini bosing.', ru: "Нажмите кнопку «Пицца» в чате." },
    reply: { uz: "Pitsa tanlandi. Narxi — 30 000 so'm.", ru: "Пицца выбрана. Цена — 30 000 сумов." },
    row: { uz: <>Pitsa → callback <span className="mono">'pizza'</span> → <span className="mono">bot.action</span></>, ru: <>Пицца → callback <span className="mono">'pizza'</span> → <span className="mono">bot.action</span></> } },
  { id: 'about', chip: { uz: 'Biz haqimizda', ru: 'О нас' }, head: { uz: '3-qadam · Reply klaviatura', ru: "Шаг 3 · Reply-клавиатура" }, rule: "bot.hears('Biz haqimizda', ...)",
    tip: { uz: 'Pastdagi «Biz haqimizda» tugmasini bosing.', ru: "Нажмите кнопку «О нас» внизу." },
    reply: { uz: 'AvtoPizza — 2020 yildan beri pitsa yetkazib beramiz.', ru: "AvtoPizza — доставляем пиццу с 2020 года." },
    row: { uz: <>Biz haqimizda → matn → <span className="mono">bot.hears</span></>, ru: <>О нас → текст → <span className="mono">bot.hears</span></> } }
];
const S9_ABOUT = { uz: 'Biz haqimizda', ru: "О нас" };
// F-1002-84: har qadamda bitta ko'rsatma-qator va bitta yorqin harakat; handler yo'qligi chatda BIR MARTA kulrang belgi bilan ko'rinadi
const S9_SILENT = { uz: "bot javob bermadi — handler yo'q", ru: 'бот не ответил — handler-а нет' };
const S9_WHAT = {
  cmd: { uz: 'Hodisani yuboring.', ru: 'Отправьте событие.' },
  wire: { uz: "Bot jim — bu hodisaga handler yo'q. Handler qo'shing.", ru: 'Бот молчит — для этого события нет handler-а. Добавьте handler.' },
  resend: { uz: 'Handler ulandi. Hodisani qayta yuboring.', ru: 'Handler подключён. Отправьте событие ещё раз.' }
};
const S9_DONE_LOG = [
  { from: 'user', text: '/menu', k: 0 },
  { from: 'bot', text: S9_STEPS[0].reply, menu: true, k: 1 },
  { from: 'bot', text: S9_STEPS[1].reply, k: 2 },
  { from: 'user', text: S9_ABOUT, k: 3 },
  { from: 'bot', text: S9_STEPS[2].reply, k: 4 }
];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [cur, setCur] = useState(storedAnswer ? 3 : 0);                       // joriy qadam (3 — hammasi ulangan)
  const [wired, setWired] = useState(() => new Set(storedAnswer ? S9_STEPS.map(s => s.id) : []));
  const [missed, setMissed] = useState({});                                    // qadam → handlersiz yuborishlar soni
  const [log, setLog] = useState(() => (storedAnswer ? S9_DONE_LOG : []));
  const [linkOn, setLinkOn] = useState(false);
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const busy = useRef(false);
  const timers = useRef([]);
  const wrapRef = useRef(null), cmdRef = useRef(null), pizzaRef = useRef(null), aboutRef = useRef(null), ruleRef = useRef(null);
  const done = cur >= S9_STEPS.length;
  const st = S9_STEPS[cur];
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onAnswer(screen, { stage: 'case', screenIdx: screen, question: "Uch hodisani o'z handleriga ulang", correct: true, solved: true, picked: true }); // payload UZ-etalon
    }
  }, [done]); // eslint-disable-line
  const push = (m) => setLog(l => [...l, { ...m, k: l.length }]);
  const send = () => {
    if (busy.current || done) return;
    if (!wired.has(st.id) && missed[st.id]) return;   // F-1002-84: handler qo'shilmaguncha qayta yuborilmaydi — chat cho'zilmaydi
    setSc(n => n + 1);
    if (st.id === 'cmd') push({ from: 'user', text: '/menu', cmd: true });
    if (st.id === 'about') push({ from: 'user', text: S9_ABOUT });
    if (!wired.has(st.id)) { setMissed(m => ({ ...m, [st.id]: 1 })); push({ from: 'sys', text: S9_SILENT }); return; }
    busy.current = true; setLinkOn(true);
    timers.current.push(setTimeout(() => { push({ from: 'bot', text: st.reply, menu: st.id === 'cmd' }); setSc(n => n + 1); }, 1000));
    timers.current.push(setTimeout(() => { setLinkOn(false); setCur(c => c + 1); busy.current = false; setSc(n => n + 1); }, 2400));
  };
  const wire = () => { if (!st || !missed[st.id]) return; setWired(prev => new Set(prev).add(st.id)); setSc(n => n + 1); };
  const lastCmd = log.reduce((a, l) => (l.cmd ? l.k : a), -1);
  const srcRef = st ? (st.id === 'cmd' ? cmdRef : st.id === 'pizza' ? pizzaRef : aboutRef) : null;
  const phase = !st ? 'done' : !missed[st.id] ? 'send' : !wired.has(st.id) ? 'wire' : 'resend';
  return (
    <Stage eyebrow={tr({ uz: 'Markaziy · uch hodisa', ru: "Главное · три события" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Uchala handlerni ulang (${cur}/3)`, ru: `Подключите и проверьте все (${cur}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Uch xil hodisa — uch handler. <span className="italic" style={{ color: T.accent }}>Ularni o'zingiz ulang.</span></>, ru: <>Три вида событий — три handler-а. <span className="italic" style={{ color: T.accent }}>Подключите их сами.</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>Har qadamda avval hodisani yuboring: handler yo'q bo'lsa, bot jim turadi. Keyin handler qo'shing va qayta yuboring.</>, ru: <>На каждом шаге сначала отправьте событие: если handler-а нет, бот молчит. Потом добавьте handler и отправьте снова.</> })}</Mentor>
        <Zoomable>
        <div className="link-wrap" ref={wrapRef}>
        <div className="split">
          <Col>
            <TgChat input={false} minH={150} replyKb={cur >= 2 ? [[{ label: S9_ABOUT, ref: aboutRef, hint: cur === 2 && phase !== 'wire' && !busy.current, onClick: cur === 2 && phase !== 'wire' ? send : undefined }]] : undefined}>
              <Bubble from="bot">{tr({ uz: 'Buyruq yuboring yoki tugmani bosing.', ru: "Отправьте команду или нажмите кнопку." })}</Bubble>
              {log.map(l => <Bubble key={l.k} from={l.from} bref={l.k === lastCmd ? cmdRef : undefined}
                inline={l.menu ? [[{ label: { uz: 'Pitsa', ru: "Пицца" }, ref: pizzaRef, hint: cur === 1 && phase !== 'wire', onClick: cur === 1 && phase !== 'wire' ? send : undefined }, { label: { uz: 'Ichimlik', ru: "Напитки" } }]] : undefined}>{tr(l.text)}</Bubble>)}
            </TgChat>
          </Col>
          <Col>
            <div className="s9-steps">{S9_STEPS.map((s, i) => <span key={s.id} className={`s9-step ${i < cur ? 'ok' : i === cur ? 'cur' : ''}`}>{i < cur ? '✓ ' : `${i + 1} · `}{tr(s.chip)}</span>)}</div>
            <div className="env-card">
              <p className="flow-label mono-lbl" style={{ marginBottom: 8 }}>{tr({ uz: 'bot.js — handlerlar', ru: "bot.js — handler-ы" })}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {S9_STEPS.slice(0, Math.min(cur, S9_STEPS.length)).map(s => <FoldRow key={s.id}>{tr(s.row)}</FoldRow>)}
                {st && (
                  <button ref={ruleRef} className={`pick-row code ${phase === 'resend' ? 'picked' : phase === 'wire' ? 'need tap-hint' : 'wait'}`} disabled={phase !== 'wire'} onClick={wire}>
                    <span className="mono" style={{ flex: 1, fontSize: 12 }}>{st.rule}</span>
                    <span className="pick-plus">{phase === 'resend' ? '✓' : phase === 'wire' ? tr({ uz: "+ handler qo'shish", ru: "+ добавить handler" }) : tr({ uz: "handler yo'q", ru: "handler-а нет" })}</span>
                  </button>
                )}
              </div>
            </div>
            {st && <div className="s9-ctl fade-step" key={`${st.id}-${phase}`}>
              <p className="small chat-note">{tr(phase === 'wire' ? S9_WHAT.wire : phase === 'resend' ? S9_WHAT.resend : (st.tip || S9_WHAT.cmd))}</p>
              {st.id === 'cmd' && <button className={`btn ${phase !== 'wire' ? 'tap-hint' : ''}`} style={{ alignSelf: 'flex-start' }} disabled={phase === 'wire'} onClick={send}>{phase === 'resend' ? tr({ uz: '▶ Qayta yuborish', ru: '▶ Отправить ещё раз' }) : tr({ uz: '▶ /menu yuborish', ru: "▶ Отправить /menu" })}</button>}
            </div>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Uchala hodisa o'z handleriga ulandi: javobni handler beradi.", ru: "Все три события подключены к handler-ам: отвечает handler." })}</p></div>}
          </Col>
        </div>
        <LinkLine wrapRef={wrapRef} refs={[srcRef, ruleRef]} show={linkOn} tone="ok" cols />
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TEST 3 =====
const Screen10 = (props) => (
  <QuestionScreen {...props} idx={10} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    questionText={{ uz: 'Inline tugma bosilishini qaysi handler ushlaydi?', ru: "Какой handler ловит нажатие inline-кнопки?" }}
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Inline tugma bosilishini qaysi handler <span className="italic" style={{ color: T.accent }}>ushlaydi</span>?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите правильный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Какой handler <span className="italic" style={{ color: T.accent }}>ловит</span> нажатие inline-кнопки?</h2></> })}
    options={[
      { uz: "bot.action('pizza', ...) — tugma ma'lumoti 'pizza' bo'lgani uchun", ru: "bot.action('pizza', ...) — потому что данные кнопки — 'pizza'" },
      { uz: "bot.hears('Pitsa', ...) — tugma yozuvi 'Pitsa' bo'lgani uchun", ru: "bot.hears('Pitsa', ...) — потому что надпись на кнопке — 'Pitsa'" },
      { uz: 'bot.start(...) — tugma /start javobidagi menyuda turgani uchun', ru: "bot.start(...) — потому что кнопка стоит в меню из ответа на /start" },
      { uz: "bot.launch() — botni ishga tushiradigan qator bo'lgani uchun", ru: "bot.launch() — потому что эта строка запускает бота" }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Inline tugma bosilganda callback keladi — uni bot.action('pizza', ...) ushlaydi.", ru: "При нажатии inline-кнопки приходит callback — его ловит bot.action('pizza', ...)." }}
    explainWrong={{
      1: { uz: 'bot.hears matnli xabarni ushlaydi. Inline tugma bosilganda «Pitsa» matni yuborilmaydi — callback keladi.', ru: "bot.hears ловит текстовое сообщение. При нажатии inline-кнопки текст «Pitsa» не отправляется — приходит callback." },
      2: { uz: 'bot.start faqat /start buyrug\'ini ushlaydi. Tugma qaysi xabarda turgani ahamiyatsiz — uning bosilishini bot.action ushlaydi.', ru: "bot.start ловит только команду /start. Неважно, в каком сообщении стоит кнопка, — её нажатие ловит bot.action." },
      3: { uz: "bot.launch() botni ishga tushiradi, lekin o'zi hech bir hodisani ushlamaydi — bu handler emas.", ru: "bot.launch() запускает бота, но сам не ловит ни одного события — это не handler." },
      default: { uz: 'Inline tugma bosilishi — callback. Uni bot.action(...) ushlaydi.', ru: "Нажатие inline-кнопки — это callback. Его ловит bot.action(...)." }
    }} />
);

// ===== SCREEN 11 — HAYOTIY: JAVOB BOSHQA CHATGA KETSA (A7: javob yo'nalishi chiziladi) =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [fixed, setFixed] = useState(!!storedAnswer);
  const [tested, setTested] = useState(!!storedAnswer);
  const [leaked, setLeaked] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const wrapRef = useRef(null), azRef = useRef(null), codeRef = useRef(null), valiRef = useRef(null), azReplyRef = useRef(null);
  const done = fixed && tested;
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onAnswer(screen, { stage: 'case', screenIdx: screen, question: 'Javob boshqa chatga ketsa: kodni tuzating', correct: true, solved: true, picked: true }); // payload UZ-etalon
    }
  }, [done]); // eslint-disable-line
  const send = () => { setTested(true); if (!fixed) setLeaked(true); setSc(n => n + 1); };
  const fix = () => { setFixed(true); setTested(false); setSc(n => n + 1); };
  const PRICE = { uz: "Pitsa — 30 000 so'm", ru: "Пицца — 30 000 сумов" };
  return (
    <Stage eyebrow={tr({ uz: 'Hayotiy · xato chat', ru: "Из жизни · не тот чат" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Kodni tuzating va sinang', ru: "Исправьте код и проверьте" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Javob <span className="italic" style={{ color: T.accent }}>noto'g'ri odamga</span> ketsa nima bo'ladi?</>, ru: <>Что будет, если ответ уйдёт <span className="italic" style={{ color: T.accent }}>не тому человеку</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Aziza narxni so'radi. Lekin kodda sinovdan qolgan qator bor: javob doim Valining chatiga yuboriladi. Avval sinab ko'ring, keyin tuzating.</>, ru: <>Азиза спросила цену. Но в коде осталась строка от теста: ответ всегда уходит в чат Вали. Сначала проверьте, потом исправьте.</> })}</Mentor>
        <Zoomable>
        <div className="link-wrap" ref={wrapRef}>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Aziza — «Narxlar» tugmasini bosdi, javob kutyapti', ru: "Азиза — нажала «Цены», ждёт ответа" })}</p>
            <TgChat title={{ uz: 'Aziza', ru: 'Азиза' }} sub={{ uz: '', ru: "" }} ava="A" input={false} minH={90}>
              <Bubble from="user" bref={azRef}>{tr({ uz: 'Narxlar', ru: "Цены" })}</Bubble>
              {leaked && !done && <p className="small chat-quiet">{tr({ uz: 'Javob kelmadi.', ru: "Ответа нет." })}</p>}
              {done && <Bubble from="bot" bref={azReplyRef}>{tr(PRICE)}</Bubble>}
            </TgChat>
            <div ref={codeRef}>
              <CodeFile name="bot.js" minH={0}>
                <Kw>bot</Kw>{'.'}<At>hears</At>{'('}<St>'Narxlar'</St>{', ('}<Kw>ctx</Kw>{') => {'}{'\n'}
                {fixed
                  ? <>{'  '}<Kw>ctx</Kw>{'.'}<At>reply</At>{'('}<St>{tr({ uz: "\"Pitsa — 30 000 so'm\"", ru: "\"Пицца — 30 000 сумов\"" })}</St>{')'}</>
                  : <>{'  '}<Kw>ctx</Kw>{'.telegram.'}<At>sendMessage</At>{'(VALI_ID, '}<St>{tr({ uz: "\"Pitsa — 30 000 so'm\"", ru: "\"Пицца — 30 000 сумов\"" })}</St>{')'}</>}{'\n'}
                {'})'}{'\n'}
                <Cm>{fixed ? tr({ uz: "// ctx.reply — xabar kelgan chatga, ya'ni Azizaga", ru: "// ctx.reply — в чат, откуда пришло сообщение, то есть Азизе" }) : tr({ uz: "// sinovdan qolgan: VALI_ID — Valining chat id'si", ru: "// осталось от теста: VALI_ID — id чата Вали" })}</Cm>
              </CodeFile>
            </div>
            <p className="small chat-note">{tr({ uz: <><span className="mono">ctx.telegram.sendMessage(id, matn)</span> — matnni ko'rsatilgan id'dagi chatga yuboradi.</>, ru: <><span className="mono">ctx.telegram.sendMessage(id, текст)</span> — отправляет текст в чат с указанным id.</> })}</p>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Vali — hech narsa so'ramagan", ru: "Вали — ничего не спрашивал" })}</p>
            <TgChat title={{ uz: 'Vali', ru: 'Вали' }} sub={{ uz: '', ru: "" }} ava="V" input={false} minH={90}>
              {leaked && <Bubble from="bot" bref={valiRef}>{tr(PRICE)}</Bubble>}
              {done && <p className="small chat-quiet">{tr({ uz: 'Yangi xabar kelmadi ✓', ru: "Новых сообщений нет ✓" })}</p>}
            </TgChat>
            {!tested && !fixed && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={send}>{tr({ uz: "▶ Sinab ko'rish", ru: "▶ Проверить" })}</button>}
            {tested && !fixed && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Javob Valiga ketdi: kodda ctx emas, qo'lda yozilgan VALI_ID.</>, ru: <>Ответ ушёл Вали: в коде не ctx, а вписанный вручную VALI_ID.</> })}</p><button className="btn" style={{ marginTop: 8 }} onClick={fix}>{tr({ uz: 'Kodni tuzatish', ru: "Исправить код" })}</button></div>}
            {fixed && !tested && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={send}>{tr({ uz: '▶ Qayta sinash', ru: '▶ Проверить снова' })}</button>}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Endi javob ctx.reply orqali ketadi: xabar qaysi chatdan kelgan bo'lsa, javob ham o'sha chatga boradi.</>, ru: <>Теперь ответ уходит через ctx.reply: из какого чата пришло сообщение, в тот же чат идёт и ответ.</> })}</p></div>}
          </Col>
        </div>
        {tested && !fixed && !storedAnswer && <LinkLine wrapRef={wrapRef} refs={[azRef, codeRef, valiRef]} show tone="bad" cols />}
        {done && !storedAnswer && <LinkLine wrapRef={wrapRef} refs={[codeRef, azReplyRef]} show tone="ok" />}
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — HAYOTIY: FALLBACK HANDLER (bitta ustun) =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [sent, setSent] = useState(!!storedAnswer);
  const [fallbackOn, setFallbackOn] = useState(!!storedAnswer);
  const [tested, setTested] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const done = fallbackOn && tested;
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onAnswer(screen, { stage: 'case', screenIdx: screen, question: "Fallback handler qo'shildi va sinaldi", correct: true, solved: true, picked: true }); // payload UZ-etalon
    }
  }, [done]); // eslint-disable-line
  const ASK = { uz: 'Necha daqiqada yetib keladi?', ru: "Через сколько минут привезут?" };
  const FB = { uz: 'Tushunmadim. Menyu uchun /menu ni bosing.', ru: "Не понял. Чтобы открыть меню, нажмите /menu." };
  const send = () => { setSent(true); setSc(n => n + 1); };
  const addFallback = () => { setFallbackOn(true); setSc(n => n + 1); };
  const resend = () => { setTested(true); setSc(n => n + 1); };
  return (
    <Stage eyebrow={tr({ uz: 'Hayotiy · fallback handler', ru: "Из жизни · fallback handler" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Fallback handler qo'shing va sinang", ru: "Добавьте fallback handler и проверьте" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Mos handler topilmagan matnga ham <span className="italic" style={{ color: T.accent }}>bot javob bersin</span>.</>, ru: <>Пусть <span className="italic" style={{ color: T.accent }}>бот ответит</span> и на текст без handler-а.</> })}</h2></div>
        <Mentor>{tr({ uz: <>1-darsda fallback handler kerakligini ko'rdingiz. Endi uni kodda yozamiz. Avval noma'lum xabar yuboring va nima bo'lishini ko'ring.</>, ru: <>На 1-м уроке вы видели, зачем нужен fallback handler. Теперь напишем его в коде. Сначала отправьте незнакомое сообщение и посмотрите, что будет.</> })}</Mentor>
        <div className="col one-col">
          <TgChat input={false} minH={120}>
            <Bubble from="bot">{tr({ uz: 'Salom! Menyu uchun /menu ni bosing.', ru: "Привет! Чтобы открыть меню, нажмите /menu." })}</Bubble>
            {sent && <Bubble from="user">{tr(ASK)}</Bubble>}
            {sent && <p className="small chat-quiet">{tr({ uz: 'Bot jim qoldi…', ru: "Бот промолчал…" })}</p>}
            {tested && <Bubble from="user">{tr(ASK)}</Bubble>}
            {tested && <Bubble from="bot">{tr(FB)}</Bubble>}
          </TgChat>
          {!sent && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={send}>{tr({ uz: "▶ Noma'lum xabar yuborish", ru: "▶ Отправить незнакомое сообщение" })}</button>}
          {fallbackOn && <CodeFile name="bot.js" minH={0}>
            <Kw>bot</Kw>{'.'}<At>on</At>{'('}<St>'text'</St>{', ('}<Kw>ctx</Kw>{') => '}<Kw>ctx</Kw>{'.'}<At>reply</At>{'('}<St>{tr({ uz: "'Tushunmadim. Menyu uchun /menu ni bosing.'", ru: "'Не понял. Чтобы открыть меню, нажмите /menu.'" })}</St>{'))'}
          </CodeFile>}
          {fallbackOn && !tested && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={resend}>{tr({ uz: '▶ Qayta yuborish', ru: "▶ Отправить снова" })}</button>}
          {sent && !tested && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu xabarga mos handler yo'q — bot jim qoldi.</>, ru: <>Для этого сообщения нет handler-а — бот промолчал.</> })}</p>{!fallbackOn && <button className="btn" style={{ marginTop: 8 }} onClick={addFallback}>{tr({ uz: "Fallback handler qo'shish", ru: "Добавить fallback handler" })}</button>}</div>}
          {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><span className="mono">bot.on('text', ...)</span> handlersiz qolgan matnga javob beradi. U oxirida turadi: oldinda /start ni ham ushlardi.</>, ru: <><span className="mono">bot.on('text', ...)</span> отвечает на текст без своего handler-а. Он стоит последним — раньше он перехватил бы и /start.</> })}</p></div>}
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — AMALIYOT: /help JAVOBI (A6: joriy buyruq qatori ochiq · ballsiz, variantlar aralash, nishon — variant id bo'yicha) =====
// ⚠️ UZ-RU: `correct` va `wrong` kalitlari — til-mustaqil ICHKI id'lar (o'zgarmaydi).
const CMD_BLANKS = [
  { key: 'start', label: '/start —', correct: 'run', options: [
      { id: 'off', t: { uz: "Botni butunlay o'chirib tashlaydi", ru: 'Полностью выключает бота' } },
      { id: 'run', t: { uz: 'Suhbatni boshlaydi: salom va menyu yuboradi', ru: "Начинает разговор: шлёт приветствие и меню" } },
      { id: 'img', t: { uz: 'Faqat rasm yuboradi', ru: 'Отправляет только картинку' } }
    ], wrong: { off: { uz: "/start botni o'chirmaydi — u suhbatni boshlaydi: bot salom va menyu yuboradi.", ru: "/start не выключает бота — он начинает разговор: бот шлёт приветствие и меню." }, img: { uz: "/start rasm bilan bog'liq emas — u suhbatni boshlaydi.", ru: '/start не связан с картинками — он начинает разговор.' } } },
  { key: 'help', label: '/help —', correct: 'help', options: [
      { id: 'pass', t: { uz: 'Mijozning parolini qayta tiklaydi', ru: 'Восстанавливает пароль клиента' } },
      { id: 'reinstall', t: { uz: "Botni qayta o'rnatadi", ru: "Переустанавливает бота" } },
      { id: 'help', t: { uz: "Yordam va buyruqlar ro'yxatini ko'rsatadi", ru: 'Показывает помощь и список команд' } }
    ], wrong: { pass: { uz: "Botlarda odatda parol bo'lmaydi — /help yordam matnini ko'rsatadi.", ru: "У ботов обычно нет пароля — /help показывает текст помощи." }, reinstall: { uz: "/help hech narsani o'rnatmaydi — faqat yordam beradi.", ru: "/help ничего не устанавливает — он только помогает." } } },
  { key: 'menu', label: '/menu —', correct: 'menu', options: [
      { id: 'kick', t: { uz: 'Mijozni chatdan chiqarib yuboradi', ru: 'Выгоняет клиента из чата' } },
      { id: 'menu', t: { uz: 'Menyuni qayta ochadi', ru: 'Снова открывает меню' } },
      { id: 'token', t: { uz: "Botning tokenini ko'rsatadi", ru: "Показывает токен бота" } }
    ], wrong: { kick: { uz: "/menu hech kimni chiqarib yubormaydi — u menyuni ko'rsatadi.", ru: '/menu никого не выгоняет — он показывает меню.' }, token: { uz: "Token maxfiy — uni bot hech kimga ko'rsatmaydi.", ru: "Токен секретный — бот никому его не показывает." } } }
];
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [filled, setFilled] = useState(() => (storedAnswer ? Object.fromEntries(CMD_BLANKS.map(b => [b.key, b.correct])) : {}));
  const [shakeKey, setShakeKey] = useState(null);
  const [wrongMsg, setWrongMsg] = useState(null);
  const wrongEverRef = useRef(storedAnswer ? (storedAnswer.correct === false) : false);
  const [sc, setSc] = useState(0);
  const done = CMD_BLANKS.every(b => filled[b.key] === b.correct);
  const curIdx = CMD_BLANKS.findIndex(b => filled[b.key] !== b.correct);
  const fired = useRef(!!storedAnswer);
  useEffect(() => {
    if (done && !fired.current) {
      fired.current = true;
      onAnswer(screen, { stage: 'builder', screenIdx: screen, question: "/help javobidagi buyruqlar tavsifini to'ldiring", correct: !wrongEverRef.current, solved: true, picked: true });
    }
  }, [done]); // eslint-disable-line
  const pick = (blank, optId) => {
    if (filled[blank.key] === blank.correct) return;
    if (optId === blank.correct) { setFilled(f => ({ ...f, [blank.key]: optId })); setWrongMsg(null); setSc(n => n + 1); }
    else { wrongEverRef.current = true; if (achMiss) achMiss.miss(screen); setShakeKey(blank.key); setWrongMsg(blank.wrong[optId] || { uz: "Bu buyruq bunday ishni bajarmaydi — boshqasini tanlang.", ru: "Эта команда такого не делает — выберите другое." }); setTimeout(() => setShakeKey(k => (k === blank.key ? null : k)), 500); }
  };
  const labelOf = (blank) => { const o = blank.options.find(x => x.id === filled[blank.key]); return o ? tr(o.t) : ''; };
  const curB = curIdx >= 0 ? CMD_BLANKS[curIdx] : null;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · buyruqlar', ru: "Практика · команды" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Ro'yxatni to'ldiring", ru: 'Заполните список' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>/help javobini to'ldiring: <span className="italic" style={{ color: T.accent }}>har buyruq nima qiladi?</span></>, ru: <>Заполните ответ на /help: <span className="italic" style={{ color: T.accent }}>что делает каждая команда?</span></> })}</h2></div>
        <Mentor>{tr({ uz: <>/help bosilganda bot buyruqlar ro'yxatini yuboradi. Har buyruqqa to'g'ri tavsifni tanlang.</>, ru: <>При нажатии /help бот присылает список команд. Выберите для каждой команды правильное описание.</> })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <TgChat input={false} minH={0}>
              <Bubble from="user">/help</Bubble>
              <Bubble from="bot"><span className="help-msg"><span>{tr({ uz: 'Buyruqlar:', ru: "Команды:" })}</span>{CMD_BLANKS.map(b => <span key={b.key} className={`help-line ${filled[b.key] ? 'ok' : ''}`}><span className="mono">/{b.key}</span> — {labelOf(b) || '____'}</span>)}</span></Bubble>
            </TgChat>
          </Col>
          <Col>
            {CMD_BLANKS.map((b, i) => (filled[b.key] === b.correct
              ? <FoldRow key={b.key}><span className="mono">/{b.key}</span> — {labelOf(b)}</FoldRow>
              : i === curIdx ? (
                <div key={b.key} className="blank-group fade-step">
                  <span className="bg-lbl">{b.label}</span>
                  <div className="blank-row">
                    {b.options.map(opt => <button key={opt.id} className={`gchip tap-hint ${shakeKey === b.key ? 'shake' : ''}`} onClick={() => pick(b, opt.id)}>{tr(opt.t)}</button>)}
                  </div>
                  {wrongMsg && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr(wrongMsg)}</p></div>}
                </div>
              ) : null))}
            {!done && curB && <AchRule screen={screen} />}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "/help javobi tayyor — uyga vazifada botingizga qo'shasiz.", ru: "Ответ на /help готов — в домашнем задании добавите его боту." })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — TEST 4 =====
const Screen14 = (props) => (
  <QuestionScreen {...props} idx={14} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    questionText={{ uz: '/start va /help kabi buyruqlar oddiy xabardan nimasi bilan ajralib turadi?', ru: "Чем команды вроде /start и /help отличаются от обычного сообщения?" }}
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}><span className="mono" style={{ color: T.accent }}>/start</span> va <span className="mono" style={{ color: T.accent }}>/help</span> kabi buyruqlar oddiy xabardan nimasi bilan <span className="italic" style={{ color: T.accent }}>ajralib turadi</span>?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите правильный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Чем команды вроде <span className="mono" style={{ color: T.accent }}>/start</span> и <span className="mono" style={{ color: T.accent }}>/help</span> <span className="italic" style={{ color: T.accent }}>отличаются</span> от обычного сообщения?</h2></> })}
    options={[
      { uz: 'Ularni faqat bot egasi yubora oladi, boshqalar yubora olmaydi', ru: "Их может отправить только владелец бота, остальные — нет" },
      { uz: 'Ular bot dasturini qayta ishga tushiradi va suhbatni tozalaydi', ru: "Они перезапускают программу бота и очищают переписку" },
      { uz: 'Ular / bilan boshlanadi va kodda alohida handler bilan ushlanadi', ru: "Они начинаются с / и в коде ловятся отдельным handler-ом" },
      { uz: 'Ular xabar emas: Telegram ularni botga umuman yubormaydi', ru: "Это не сообщения: Telegram вообще не отправляет их боту" }
    ]} correctIdx={2}
    explainCorrect={{ uz: 'Buyruq / bilan boshlanadi va kodda uni bot.command ushlaydi.', ru: "Команда начинается с /, и в коде её ловит bot.command." }}
    explainWrong={{
      0: { uz: 'Buyruqni har qanday foydalanuvchi yubora oladi — /start ni har yangi mijoz birinchi bo\'lib bosadi.', ru: "Команду может отправить любой пользователь — /start первым нажимает каждый новый клиент." },
      1: { uz: 'Buyruq bot dasturini qayta ishga tushirmaydi: u oddiy hodisa, unga mos handler javob beradi.', ru: "Команда не перезапускает программу бота: это обычное событие, на него отвечает подходящий handler." },
      3: { uz: "Buyruq ham botga xabar bo'lib keladi — / bilan boshlanadigan matnli xabar. Shuning uchun uni handler ushlaydi.", ru: "Команда тоже приходит боту сообщением — текстовым, которое начинается с /. Поэтому её ловит handler." },
      default: { uz: 'Buyruq — / bilan boshlanadigan xabar; kodda uni bot.command ushlaydi.', ru: "Команда — сообщение, которое начинается с /; в коде её ловит bot.command." }
    }} />
);

// ===== SCREEN 15 — FINAL: bot.js ni to'g'ri tartibda yig'ish (DragDropOrder) =====
const BOT_LINES = [
  { id: 'env', label: 'const token = process.env.BOT_TOKEN' },
  { id: 'create', label: 'const bot = new Telegraf(token)' },
  { id: 'start', label: { uz: "bot.start((ctx) => ctx.reply('Salom!', menu))", ru: "bot.start((ctx) => ctx.reply('Привет!', menu))" } },
  { id: 'action', label: { uz: "bot.action('pizza', (ctx) => ctx.reply('Pitsa tanlandi'))", ru: "bot.action('pizza', (ctx) => ctx.reply('Пицца выбрана'))" } },
  { id: 'fallback', label: { uz: "bot.on('text', (ctx) => ctx.reply('Tushunmadim'))", ru: "bot.on('text', (ctx) => ctx.reply('Не понял'))" } },
  { id: 'launch', label: 'bot.launch()' }
];
const BOT_ORDER = BOT_LINES.map(l => l.id);
// KOD 13: bot.start va bot.action — har xil hodisa, ikkala tartib ham ishlaydi
const BOT_ACCEPT = [BOT_ORDER, ['env', 'create', 'action', 'start', 'fallback', 'launch']];
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
  const [consequence, setConsequence] = useState(null);
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
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: "bot.js qatorlarini to'g'ri tartibda joylang", correct: firstOk, firstAttemptCorrect: firstOk, solved: true, picked: firstOk ? 0 : 1 });
  };
  const onChange = (slots) => {
    if (fired.current) return;
    const full = slots.every(s => s !== null);
    if (!full) { setConsequence(null); return; }
    if (BOT_ACCEPT.some(o => o.every((id, i) => slots[i] === id))) { setConsequence(null); return; }
    hadWrongRef.current = true; if (achMiss) achMiss.miss(screen);
    const fIdx = slots.indexOf('fallback'), sIdx = slots.indexOf('start'), lIdx = slots.indexOf('launch');
    setConsequence(fIdx < sIdx ? 'fallback-early' : lIdx !== slots.length - 1 ? 'launch-early' : 'wrong');
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Итог · практика' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "bot.js ni yig'ing", ru: "Соберите bot.js" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: <span className="italic" style={{ color: T.accent }}>bot.js</span> ni to'g'ri tartibda yig'ing.</>, ru: <>Последний шаг: соберите <span className="italic" style={{ color: T.accent }}>bot.js</span> в правильном порядке.</> })}</h2></div>
        <Mentor>{tr({ uz: "Bo'laklarni sudrab to'g'ri tartibga qo'ying.", ru: "Перетащите блоки в правильном порядке." })}</Mentor>
        <DragDropOrder
          items={BOT_LINES}
          accept={BOT_ACCEPT}
          flow={[2, 4]}
          hints={[
            { uz: '1-qadam', ru: "Шаг 1" },
            { uz: '2-qadam', ru: "Шаг 2" },
            { uz: '3-qadam', ru: "Шаг 3" },
            { uz: '4-qadam', ru: "Шаг 4" },
            { uz: '5-qadam', ru: "Шаг 5" },
            { uz: '6-qadam', ru: "Шаг 6" }
          ]}
          onSolved={onSolved}
          onChange={onChange} />
        {consequence === 'fallback-early' && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Fallback /start dan oldin turibdi: u /start ni ham ushlaydi.", ru: "Fallback стоит раньше /start: он перехватит и /start." })}</p></div>}
        {consequence === 'launch-early' && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'bot.launch() handlerlardan keyin, faylning oxirida turadi.', ru: "bot.launch() стоит после handler-ов, в конце файла." })}</p></div>}
        {consequence === 'wrong' && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang.", ru: "Порядок неверный — нажмите на блок, чтобы вернуть его, и поставьте заново." })}</p></div>}
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Tayyor: token → bot → handlerlar → fallback → bot.launch(). Telegraf ularni yozilgan tartibda tekshiradi.</>, ru: <>✓ Готово: токен → бот → handler-ы → fallback → bot.launch(). Telegraf проверяет их в порядке записи.</> })}</p>
          {hadWrongRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — взглянуть на тему ещё раз" })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  buttonMaster:  { icon: '🔘', name: 'Callback Catcher', desc: { uz: "Inline tugma bosilishini qaysi handler ushlashini birinchi urinishda topdingiz", ru: "С первой попытки нашли, какой handler ловит нажатие inline-кнопки" } },
  rightEnvelope: { icon: '⌨️', name: 'Command Spotter', desc: { uz: "Buyruq oddiy xabardan nimasi bilan farq qilishini birinchi urinishda topdingiz", ru: "С первой попытки нашли, чем команда отличается от обычного сообщения" } },
  neverSilent:   { icon: '🔔', name: 'Fallback Coder', desc: { uz: "Fallback handlerni kodda qo'shib, sinab ko'rdingiz", ru: "Добавили fallback handler в код и проверили его" } },
  commandWriter: { icon: '📜', name: 'Command Writer', desc: { uz: "Buyruqlar ro'yxatini birinchi urinishda xatosiz to'ldirdingiz", ru: "С первой попытки без ошибок заполнили список команд" } },
};
// Ekran id → nishon. s10, s13, s14 — xato qilish mumkin (birinchi urinishga); s12 `neverSilent` — darsning yagona BONUSI
// (152-qonun: xato yo'li yo'q, tavsif qilingan ishni aytadi).
const ACH_TRIGGERS = { s10: 'buttonMaster', s12: 'neverSilent', s13: 'commandWriter', s14: 'rightEnvelope' }; // Q3-c (19.09): buttonMaster s9 → s10, rightEnvelope s11 → s14 (testlar, birinchi urinish; M2 — nom «Command Spotter»); neverSilent s12 — darsning yagona bonusi (152-qonun)

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
    : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: "Сделаете верно с первой попытки — значок ваш." })}</p>;
};

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
  4: { uz: '1 — Token', ru: "1 — Токен" },
  8: { uz: '2 — Tugma turi', ru: '2 — Вид кнопки' },
  10: { uz: '3 — Handler', ru: "3 — Handler" },
  14: { uz: '4 — Buyruq', ru: "4 — Команда" },
  15: { uz: '5 — Tartib', ru: '5 — Порядок' }
};
const QUIZ_MS = 15000;
const QZ_BG_SHAPES = [
  { ch: '/start',     l: 5,  t: 10, s: 32, d: 19, dl: 0 },
  { ch: 'token',       l: 85, t: 8,  s: 32, d: 23, dl: 1.5 },
  { ch: 'ctx.reply',   l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'bot.action',  l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: '.env',        l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: 'bot.hears',   l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: '/menu',       l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'Telegraf',    l: 55, t: 5,  s: 26, d: 22, dl: 0.6 },
  { ch: 'ctx',         l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '✓',           l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: 'fallback',    l: 34, t: 62, s: 20, d: 29, dl: 3.4 },
  { ch: 'inline',      l: 2,  t: 30, s: 26, d: 28, dl: 3.1 },
  { ch: 'reply',       l: 60, t: 90, s: 20, d: 31, dl: 4.2 },
  { ch: 'bot.start',   l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3).
const QUIZ_BANK = [
  { q: { uz: 'Bot tokeni qayerda saqlanadi?', ru: "Где хранится токен бота?" }, opts: [
      { uz: "Kodning o'zida, new Telegraf(...) qatorida", ru: "В самом коде, в строке new Telegraf(...)" },
      { uz: "README faylida, jamoa ko'rishi uchun", ru: "В файле README, чтобы видели коллеги" },
      { uz: ".env faylida, Git'ga tushmaydigan joyda", ru: "В файле .env, который не попадает в Git" },
      { uz: 'Bot tavsifida, @BotFather sozlamasida', ru: "В описании бота, в настройках @BotFather" }
    ], correct: 2 },
  { q: { uz: 'Telegraf nima?', ru: 'Что такое Telegraf?' }, opts: [
      { uz: 'Bot API bilan ishlashni osonlashtiradigan Node.js kutubxonasi', ru: "Библиотека Node.js, которая упрощает работу с Bot API" },
      { uz: "Foydalanuvchi xabarlarini saqlaydigan SQL ma'lumotlar bazasi", ru: "SQL-база данных, где хранятся сообщения пользователей" },
      { uz: 'Botga rasm va video yuklab beradigan tashqi xizmat', ru: "Внешний сервис, который загружает боту фото и видео" },
      { uz: 'Telegram ilovasining kompyuterda ishlaydigan versiyasi', ru: "Версия приложения Telegram для компьютера" }
    ], correct: 0 },
  { q: { uz: '`ctx` nima?', ru: "Что такое `ctx`?" }, opts: [
      { uz: 'Bot sozlamalari saqlanadigan konfiguratsiya fayli', ru: "Файл конфигурации, где хранятся настройки бота" },
      { uz: 'Foydalanuvchining Telegram parolini saqlaydigan obyekt', ru: "Объект, где хранится пароль пользователя от Telegram" },
      { uz: "Serverning joriy vaqtini ko'rsatadigan funksiya", ru: "Функция, которая показывает текущее время сервера" },
      { uz: "Hodisa haqidagi ma'lumot: kim yozdi va qaysi chatdan", ru: "Данные о событии: кто написал и из какого чата" }
    ], correct: 3 },
  { q: { uz: "Inline tugma bosilganda nima bo'ladi?", ru: "Что происходит при нажатии inline-кнопки?" }, opts: [
      { uz: "Tugma matni chatga oddiy xabar bo'lib qo'shiladi", ru: "Текст кнопки добавляется в чат обычным сообщением" },
      { uz: "Chatga matn yozilmaydi, botga tugma ma'lumoti keladi", ru: "В чат ничего не пишется, боту приходят данные кнопки" },
      { uz: 'Serverga avtomatik yangi rasm fayli yuklanadi', ru: "На сервер автоматически загружается новый файл с картинкой" },
      { uz: "Bot o'zini qayta ishga tushirib, suhbatni tozalaydi", ru: "Бот перезапускает сам себя и очищает переписку" }
    ], correct: 1 },
  { q: { uz: "Reply klaviatura tugmasi bosilganda nima bo'ladi?", ru: "Что происходит при нажатии кнопки reply-клавиатуры?" }, opts: [
      { uz: "Hech narsa: tugma faqat bezak bo'lib turadi", ru: "Ничего: кнопка просто для красоты" },
      { uz: "Tugma matni chatga oddiy xabar bo'lib ketadi", ru: "Текст кнопки уходит в чат обычным сообщением" },
      { uz: "Bot suhbatni to'xtatib, chatdan chiqib ketadi", ru: "Бот прекращает разговор и выходит из чата" },
      { uz: 'Foydalanuvchi akkaunti vaqtincha bloklanadi', ru: "Аккаунт пользователя временно блокируется" }
    ], correct: 1 },
  { q: { uz: '`bot.action(...)` nimani ushlaydi?', ru: "Что ловит `bot.action(...)`?" }, opts: [
      { uz: 'Faqat / bilan boshlanadigan buyruqlarni', ru: "Только команды, которые начинаются с /" },
      { uz: 'Reply klaviaturadan kelgan oddiy matnni', ru: "Обычный текст от reply-клавиатуры" },
      { uz: 'Inline tugma bosilganda keladigan hodisani', ru: "Событие, которое приходит при нажатии inline-кнопки" },
      { uz: 'Foydalanuvchi yuborgan rasm va fayllarni', ru: "Картинки и файлы, которые отправил пользователь" }
    ], correct: 2 },
  { q: { uz: '`bot.hears(...)` nimani ushlaydi?', ru: "Что ловит `bot.hears(...)`?" }, opts: [
      { uz: 'Aniq matnli xabarni, masalan reply tugma matnini', ru: "Сообщение с точным текстом, например текст reply-кнопки" },
      { uz: 'Faqat inline tugma bosilganda keladigan hodisani', ru: "Только событие от нажатия inline-кнопки" },
      { uz: "Botning yoqilgani yoki o'chganini bildiradigan hodisani", ru: "Событие о том, что бот включился или выключился" },
      { uz: 'Faqat ovozli xabarlarni, ularni matnga aylantirib', ru: "Только голосовые сообщения, переводя их в текст" }
    ], correct: 0 },
  { q: { uz: 'Fallback handler nima uchun kerak?', ru: "Зачем нужен fallback handler?" }, opts: [
      { uz: 'Bot dasturi tezroq ishga tushishi uchun', ru: "Чтобы программа бота запускалась быстрее" },
      { uz: 'Faqat rasm kelganda xato xabarini chiqarish uchun', ru: "Чтобы показывать ошибку, только когда пришла картинка" },
      { uz: "Tokenni qo'shimcha qatlam bilan himoyalash uchun", ru: "Чтобы защитить токен дополнительным слоем" },
      { uz: 'Mos handler topilmagan xabarga ham javob berish uchun', ru: "Чтобы отвечать и на сообщение, для которого не нашлось handler-а" }
    ], correct: 3 },
  { q: { uz: '`ctx.reply(...)` javobni qaysi chatga yuboradi?', ru: "В какой чат `ctx.reply(...)` отправляет ответ?" }, opts: [
      { uz: 'Bot egasining shaxsiy chatiga', ru: "В личный чат владельца бота" },
      { uz: 'Botga oxirgi yozgan odamning chatiga', ru: "В чат того, кто последним написал боту" },
      { uz: 'Hamma foydalanuvchilarning chatiga', ru: "В чаты всех пользователей" },
      { uz: "Xabar kelgan chatning o'ziga", ru: "В тот же чат, откуда пришло сообщение" }
    ], correct: 3 },
  { q: { uz: 'Polling nimani bildiradi?', ru: 'Что означает polling?' }, opts: [
      { uz: "Telegram xabarni o'zi botning internetdagi manziliga yuborishi", ru: "Telegram сам отправляет сообщение на интернет-адрес бота" },
      { uz: "Bot Telegram'dan «yangi xabar bormi?» deb qayta-qayta so'rashi", ru: "Бот снова и снова спрашивает у Telegram: «Есть новые сообщения?»" },
      { uz: 'Foydalanuvchi ovozini yozib, matnga aylantirish', ru: "Запись голоса пользователя и перевод его в текст" },
      { uz: "Botning barcha xabarlarini o'chirib tashlash", ru: "Удаление всех сообщений бота" }
    ], correct: 1 },
  { q: { uz: '`bot.launch()` nima qiladi?', ru: 'Что делает `bot.launch()`?' }, opts: [
      { uz: 'Yangi token yaratib, eskisini butunlay bekor qiladi', ru: "Создаёт новый токен и полностью отменяет старый" },
      { uz: "Botni Telegram'dan o'chirib, uning akkauntini yopadi", ru: "Удаляет бота из Telegram и закрывает его аккаунт" },
      { uz: 'Botni ishga tushiradi: bot hodisalarni kuta boshlaydi', ru: "Запускает бота: бот начинает ждать события" },
      { uz: "Faqat botning rasmi va nomini yangilab qo'yadi", ru: "Обновляет только аватар и имя бота" }
    ], correct: 2 },
  { q: { uz: '/start va /help qanday belgi bilan boshlanadi?', ru: "С какого знака начинаются /start и /help?" }, opts: [
      { uz: 'Qiyshiq chiziq (/) bilan', ru: "С косой черты (/)" },
      { uz: 'Yulduzcha (*) bilan', ru: "Со звёздочки (*)" },
      { uz: 'Ikki nuqta (:) bilan', ru: "С двоеточия (:)" },
      { uz: 'Hech qanday belgisiz', ru: "Без всякого знака" }
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
    const TOK = ['token', 'ctx', '/start', 'ctx.reply', 'bot.action', 'bot.hears', 'fallback', 'inline', 'reply'];
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
          <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>
        ))}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>

      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжайте тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме практики' })}</button>
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
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl('done', qi) : autoNext.fireNow()}>{lastQ ? tr({ uz: "🏁 G'oliblarni e'lon qilish", ru: '🏁 Объявить победителей' }) : tr({ uz: 'Keyingi savol →', ru: 'Следующий вопрос →' })}</button>}
          {isMentor && !lastQ && <button className="qz-btn ghost qz-auto" onClick={autoNext.auto ? autoNext.pause : autoNext.resume} title={tr({ uz: "Avto o'tishni to'xtatish — javobni tushuntirish uchun (arena oxirigacha)", ru: 'Остановить авто-переход — чтобы объяснить ответ (до конца арены)' })}>{autoNext.auto ? `${tr({ uz: "To'xtatish", ru: 'Пауза' })}${autoNext.sec ? ` · ${autoNext.sec}` : ''}` : tr({ uz: '▶ Avto', ru: '▶ Авто' })}</button>}
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
// A6: qadamlar bittadan — joriy qadam to'liq, bajarilganlari ✓ bilan bitta qatorga yig'iladi, keyingilari hali ko'rinmaydi.

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
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot · TelegramBotNest', ru: 'Практика · TelegramBotNest' }} tail="git checkout -f dars-03-done"
    title={{ uz: <>Repo'ni oling, botingizga <span className="italic" style={{ color: T.accent }}>menyu</span> qo'shing.</>, ru: <>Возьмите репозиторий, добавьте боту <span className="italic" style={{ color: T.accent }}>меню</span>.</> }}
    mentor={{ uz: <>Shu papka modul oxirigacha sizniki — avval o'z nusxangizni yuklab olasiz, keyin unga /menu qo'shasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Эта папка — ваша до конца модуля: сначала скачиваете свою копию, потом добавляете в неё /menu; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "GitHub'da `github.com/Azizbekcrypto/TelegramBotNest` → «Fork» (o'z nusxangiz). Terminalda:", ru: "На GitHub `github.com/Azizbekcrypto/TelegramBotNest` → «Fork» (ваша копия). В терминале:" }, code: ['git clone https://github.com/{sizning login}/TelegramBotNest.git', 'cd TelegramBotNest', 'npm install'] },
      { h: { uz: 'Token', ru: 'Токен' }, t: { uz: "`.env.example` ni nusxalab `.env` qiling, `BOT_TOKEN=` ga @BotFather bergan tokenni yozing (chatga, skrinshotga emas). `npm run start:dev` → «Telegram bot ulandi». Telegramda `/start` → «Salom! Bot ishlayapti.»", ru: "Скопируйте `.env.example` в `.env`, в `BOT_TOKEN=` впишите токен от @BotFather (не в чат и не на скриншот). `npm run start:dev` → «Telegram bot ulandi». В Telegram `/start` → «Salom! Bot ishlayapti.»" } },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "Antigravity'da papkani oching, «Nusxalash», yuboring.", ru: "откройте папку в Antigravity, «Скопировать», отправьте." }, prompt: [
        { uz: "src/api/telegram/telegram.service.ts ga /menu buyrug'ini qo'sh: «Nima qilamiz?» va 2 ta inline tugma — {1-tugma}, {2-tugma}.", ru: "В src/api/telegram/telegram.service.ts добавь команду /menu: «Nima qilamiz?» и 2 inline-кнопки — {кнопка 1}, {кнопка 2}." },
        { uz: "Har tugma uchun bot.action yoz, ichida ctx.answerCbQuery() chaqir. bot.on('text') fallback eng oxirida qolsin.", ru: "Для каждой кнопки напиши bot.action, внутри вызови ctx.answerCbQuery(). Fallback bot.on('text') оставь в самом конце." }
      ] },
      { h: { uz: 'Telegramda tekshirish', ru: 'Проверить в Telegram' }, t: { uz: "`/menu` → ikki tugma; bosganda javob keladi; boshqa matn → fallback.", ru: "`/menu` → две кнопки; при нажатии приходит ответ; другой текст → fallback." }, err: { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: "Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»" } }
    ]}
    chat={[
      { from: 'user', t: '/start' },
      { from: 'bot', t: { uz: 'Salom! Bot ishlayapti. Menyu uchun /menu ni bosing.', ru: 'Salom! Bot ishlayapti. Menyu uchun /menu ni bosing.' } },
      { from: 'user', t: '/menu' },
      { from: 'bot', t: { uz: 'Nima qilamiz?', ru: 'Nima qilamiz?' }, btns: ['🍕 Pitsa', '❓ Yordam'] },
      { from: 'user', muted: true, t: { uz: '«🍕 Pitsa» bosildi', ru: 'нажата «🍕 Pitsa»' } },
      { from: 'bot', t: { uz: 'Pitsa tanlandi. Keyingi darsda buyurtma saqlanadi.', ru: 'Pitsa tanlandi. Keyingi darsda buyurtma saqlanadi.' } }
    ]}
    doneText={{ uz: 'Repo sizniki, bot javob beradi. 4-darsdan shu papka ustida davom etasiz.', ru: "Репозиторий ваш, бот отвечает. С 4-го урока продолжаете в этой же папке." }} />
);

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
    <div className="fc-done fade-up"><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{tr({ uz: `${total}/${total} atama yodlandi`, ru: `${total}/${total} терминов выучено` })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda ·", ru: '↻ Учим ·' })} <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim ·', ru: '✓ Знаю ·' })} <b>{known}</b></span></div>
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

// FLASHCARD KARTALARI — 12 atama (shu darsda o'rgatilganlar)
const BOT_FLASHCARDS = [
  { front: { uz: "Telegram Bot API bilan aloqani siz o'rniga qaysi Node.js kutubxonasi bajaradi?", ru: "Какая библиотека Node.js берёт на себя связь с Telegram Bot API вместо вас?" }, back: 'Telegraf', note: { uz: "Siz token berasiz — u Bot API'ga ulanadi", ru: "Вы даёте токен — она подключается к Bot API" } },
  { front: { uz: 'Tokenni kodga yozmasdan qaysi fayldan olasiz?', ru: "Из какого файла вы берёте токен, не записывая его в код?" }, back: '.env', note: { uz: 'Kodda faqat process.env.BOT_TOKEN; faylni dotenv yuklaydi', ru: "В коде только process.env.BOT_TOKEN; файл загружает dotenv" } },
  { front: { uz: "Hodisa haqidagi ma'lumot — kim yozdi, qaysi chatdan — kodda qanday ataladi?", ru: "Как в коде называются данные о событии — кто написал, из какого чата?" }, back: 'ctx', note: { uz: 'ctx.from — kim yozdi, ctx.chat — qaysi chat, ctx.message.text — matn', ru: "ctx.from — кто написал, ctx.chat — какой чат, ctx.message.text — текст" } },
  { front: { uz: 'Xabar kelgan chatga javobni kodda nima yuboradi?', ru: "Что в коде отправляет ответ в чат, откуда пришло сообщение?" }, back: 'ctx.reply(...)', note: { uz: '1-darsdagi javob — endi kodda', ru: "Ответ из 1-го урока — теперь в коде" } },
  { front: { uz: "/start buyrug'ini qaysi handler ushlaydi?", ru: "Какой handler ловит команду /start?" }, back: 'bot.start(...)', note: { uz: 'Foydalanuvchi botni birinchi ochganda /start yuboradi', ru: "Пользователь отправляет /start, когда впервые открывает бота" } },
  { front: { uz: 'Buyruq qaysi belgi bilan boshlanadi?', ru: "С какого знака начинается команда?" }, back: { uz: 'Qiyshiq chiziq (/)', ru: 'Косая черта (/)' }, note: { uz: 'Kodda uni bot.command ushlaydi (/start uchun — bot.start)', ru: "В коде её ловит bot.command (для /start — bot.start)" } },
  { front: { uz: 'Xabarning tagida, unga yopishib turadigan tugma qanday ataladi?', ru: "Как называется кнопка, которая стоит под сообщением и прикреплена к нему?" }, back: { uz: 'Inline tugma', ru: 'Inline-кнопка' }, note: { uz: 'Bosilganda chatga matn yozilmaydi', ru: "При нажатии в чат не пишется текст" } },
  { front: { uz: "Oddiy klaviatura o'rnida chiqadigan tugmalar qanday ataladi?", ru: "Как называются кнопки, которые появляются на месте обычной клавиатуры?" }, back: { uz: 'Reply klaviatura', ru: "Reply-клавиатура" }, note: { uz: "Bosilsa, tugma matni oddiy xabar bo'lib ketadi", ru: "При нажатии текст кнопки уходит обычным сообщением" } },
  { front: { uz: 'Inline tugma bosilganda botga keladigan hodisa nima deyiladi?', ru: "Как называется событие, которое приходит боту при нажатии inline-кнопки?" }, back: 'Callback', note: { uz: "Ichida tugma ma'lumoti bor, masalan 'pizza'; chatda ko'rinmaydi", ru: "Внутри — данные кнопки, например 'pizza'; в чате не видно" } },
  { front: { uz: "Callback'ni qaysi handler ushlaydi?", ru: "Какой handler ловит callback?" }, back: 'bot.action(...)', note: { uz: 'Reply tugma matnini esa bot.hears(...) ushlaydi', ru: "А текст reply-кнопки ловит bot.hears(...)" } },
  { front: { uz: 'Mos handler topilmagan matnli xabarga qaysi handler javob beradi?', ru: "Какой handler отвечает на текстовое сообщение, для которого не нашлось handler-а?" }, back: { uz: "bot.on('text', ...)", ru: "bot.on('text', ...)" }, note: { uz: 'Fallback handler — boshqa handlerlardan keyin yoziladi', ru: "Fallback handler — пишется после остальных handler-ов" } },
  { front: { uz: 'Botni ishga tushiradigan, faylning oxirida turadigan qator qaysi?', ru: "Какая строка запускает бота и стоит в конце файла?" }, back: 'bot.launch()', note: { uz: "Polling bilan ishlaydi: bot Telegram'dan yangi xabarlarni so'rab turadi (1-darsda ko'rgansiz)", ru: "Работает через polling: бот запрашивает у Telegram новые сообщения (вы видели это на 1-м уроке)" } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
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
    { uz: "Token .env faylida turadi; kod uni dotenv orqali process.env.BOT_TOKEN dan o'qiydi", ru: "Токен лежит в файле .env; код читает его из process.env.BOT_TOKEN через dotenv" },
    { uz: 'bot.start, bot.command, bot.hears, bot.action — har xil hodisa uchun handler', ru: "bot.start, bot.command, bot.hears, bot.action — handler-ы для разных событий" },
    { uz: "ctx — hodisa haqidagi ma'lumot; ctx.reply javobni xabar kelgan chatga yuboradi", ru: "ctx — данные о событии; ctx.reply отправляет ответ в чат, откуда пришло сообщение" },
    { uz: 'Inline tugma bosilsa — botga callback keladi; reply klaviatura bosilsa — oddiy matn', ru: "Нажали inline-кнопку — боту приходит callback; нажали reply-клавиатуру — обычный текст" },
    { uz: 'Fallback handler boshqa handlerlardan keyin yoziladi, bot.launch() — eng oxirida', ru: "Fallback handler пишут после остальных handler-ов, bot.launch() — в самом конце" }
  ];
  const HOMEWORK = [
    { b: { uz: 'Sinang', ru: "Попробуйте" }, t: { uz: "— amaliyotdagi botni ishga tushirib, uch hodisani tekshiring: /menu buyrug'i, inline tugma, reply klaviatura", ru: "— запустите бота из практики и проверьте три события: команду /menu, inline-кнопку, reply-клавиатуру" } },
    { b: { uz: "Qo'shing", ru: "Добавьте" }, t: { uz: "— /help buyrug'ini qo'shing: u 13-ekrandagi buyruqlar ro'yxatini yuborsin", ru: "— команду /help: пусть она присылает список команд с 13-го экрана" } },
    { b: { uz: 'Tekshiring', ru: "Проверьте" }, t: { uz: "— kodda token yo'qligini, .env esa .gitignore'da ekanini tekshiring", ru: "— что в коде нет токена, а .env указан в .gitignore" } }
  ];
  const GLOSSARY = [
    { b: { uz: 'token', ru: "token" }, t: { uz: "— botning maxfiy kaliti (.env faylida)", ru: "— секретный ключ бота (в файле .env)" } },
    { b: { uz: 'Telegraf', ru: 'Telegraf' }, t: { uz: '— Node.js uchun bot kutubxonasi', ru: "— библиотека ботов для Node.js" } },
    { b: { uz: 'ctx', ru: "ctx" }, t: { uz: "— hodisa haqidagi ma'lumot (context)", ru: "— данные о событии (context)" } },
    { b: { uz: 'bot.start', ru: "bot.start" }, t: { uz: "— /start buyrug'i uchun handler", ru: "— handler для команды /start" } },
    { b: { uz: 'bot.command', ru: "bot.command" }, t: { uz: '— /menu kabi buyruq uchun handler', ru: "— handler для команд вроде /menu" } },
    { b: { uz: 'inline tugma', ru: "inline-кнопка" }, t: { uz: '— xabar tagidagi tugma, bosilsa callback keladi', ru: "— кнопка под сообщением, при нажатии приходит callback" } },
    { b: { uz: 'reply klaviatura', ru: "reply-клавиатура" }, t: { uz: "— klaviatura o'rnidagi tugmalar, bosilsa matn ketadi", ru: "— кнопки на месте клавиатуры, при нажатии уходит текст" } },
    { b: { uz: 'bot.action', ru: "bot.action" }, t: { uz: '— callback uchun handler', ru: "— handler для callback" } },
    { b: { uz: 'bot.hears', ru: "bot.hears" }, t: { uz: '— aniq matn uchun handler', ru: "— handler для точного текста" } },
    { b: { uz: 'fallback handler', ru: "fallback handler" }, t: { uz: '— mos handler topilmagan matnga javob beradi', ru: "— отвечает на текст, для которого не нашлось handler-а" } },
    { b: { uz: 'bot.launch', ru: "bot.launch" }, t: { uz: '— botni ishga tushiradi (polling bilan)', ru: "— запускает бота (через polling)" } }
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
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Handlerlar yozildi', ru: "Handler-ы написаны" })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Botingiz endi buyruqlarga va <span className="italic" style={{ color: T.accent }}>tugmalarga javob beradi</span>.</>, ru: <>Теперь ваш бот отвечает на команды и <span className="italic" style={{ color: T.accent }}>на кнопки</span>.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? { uz: 'Mentorni kuting', ru: "Подождите ментора" } : undefined} />
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyga vazifa', ru: "Домашнее задание" })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: <>Keyingi dars — <b>«Stateful logika + PostgreSQL»</b>. Bot mijoz tanlagan pitsani eslab qoladi: suhbat holatini PostgreSQL bazasida saqlaymiz.</>, ru: <>Следующий урок — <b>«Stateful-логика + PostgreSQL»</b>. Бот запомнит, какую пиццу выбрал клиент: состояние разговора сохраним в базе PostgreSQL.</> })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Nishonlaringiz —', ru: "Ваши значки —" })} {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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
        <div ref={glossRef} className="gloss fade-up d4" style={{ scrollMarginBottom: 16 }}><div className="gloss-head" onClick={toggleGloss}><span className="lbl">{tr({ uz: "Kalit so'zlar (takrorlash)", ru: "Ключевые слова (повторение)" })}</span><span className="gloss-toggle">{open ? '−' : '+'}</span></div>{open && (<div className="gloss-body">{GLOSSARY.map((g, i) => (<span key={i}><b>{tr(g.b)}</b> {tr(g.t)}{i < GLOSSARY.length - 1 ? ' · ' : ''}</span>))}</div>)}</div>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function BotApiButtonsLesson({ lang: langProp, onFinished, liveToken }) {
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
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken }); // liveToken — LMS'dan (avval null, keyin keladi)
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS }); // server-progress: davom / ko'rish / toza boshlash
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
    // Q1 (19.09): UYDA (solo) maxsus test javobi ham serverga — rasmiy natijada sanalsin (oldin faqat jonli darsda
    // yuborilardi → «javobsiz»). `picked` kalitdan: server `data.correct` (birinchi urinish) ni oladi. MCQ o'zi `recordAttempt`
    // bilan yozadi — takrori serverda e'tiborsiz (on conflict do nothing). «Qaytadan» mashqida yuborilmaydi (151-qonun 6-band).
    if (_m && _m.scored && live.mode === 'solo' && !firstPassRef.current && data && (data.solved === true || data.correct === true) && !soloSentRef.current.has(idx)) {
      const key = INLINE_KEYS[_m.id];
      if (Number.isInteger(key)) { soloSentRef.current.add(idx); live.submitAnswer(idx, _m.id, key < 0 ? 0 : (data.correct ? key : (key === 0 ? 1 : 0)), !!data.correct, data.elapsedMs || 0); }
    }
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]);
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

        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FDFBF7; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -6px rgba(255,79,40,0.38) !important; }

        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; }

        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
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
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
        .frame-success { background: ${T.successSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-warn { background: ${T.dangerSoft}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(194,54,43,0.22); }

        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

        .roadmap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
        .step-card { display: flex; align-items: center; gap: 14px; background: ${T.paper}; border-radius: 12px; padding: 13px 16px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.14); } /* F-1002-55: texnik dars kartasi — karta + raqam + teg; bosilmaydi (hover va kursor yo'q) */
        .step-num { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13px; color: ${T.accent}; flex-shrink: 0; }
        .step-body { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .step-text { font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .step-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }

        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.16); animation: fade-step 0.3s; }
        .note-h { font-weight: 700; font-size: 13.5px; margin: 0 0 5px; display: flex; align-items: center; }
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === HERO / YAKUN === */
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

        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .code-box { background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(12px,1.5vw,13.5px); line-height: 1.55; padding: clamp(12px,2.2vw,16px); border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }

        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }
        /* === 🛠️ JONLI PRAKTIKA === */
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

        /* ===== ⚡ JONLI QATLAM CSS (Kahoot-kutish · MentorTestStats · CodeStrike arena · qcode-chip) ===== */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; animation: opt-wait-breathe 2s ease-in-out infinite; }
        @keyframes opt-wait-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.012); } }
        @media (prefers-reduced-motion: reduce) { .option-wait { animation: none !important; } }
        .frame-wait { background: ${T.blueSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

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
        @media (max-width: 640px) { .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; } .rc-dots { width: 100%; order: -1; } .rc-btn { font-size: 13px; padding: 11px 16px; } }

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

        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

        @keyframes tap-hint-pulse { 0% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 0 rgba(255,79,40,0.4); } 70%,100% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 8px rgba(255,79,40,0); } }
        .gchip.tap-hint, .btn-soft.tap-hint, .pick-row.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }

        /* ============ 5-MODUL · BOT DARSI CSS ============ */

        /* ===== TELEGRAM CHAT (realistik ko'rinish) ===== */
        .tg { border-radius: 16px; overflow: hidden; box-shadow: 0 12px 30px -8px rgba(${T.shadowBase},0.3); border: 1px solid rgba(167,166,162,0.22); }
        .tg-head { background: linear-gradient(180deg,#5A9FD4,#4E8FC0); padding: 10px 14px; display: flex; align-items: center; gap: 10px; }
        .tg-ava { width: 32px; height: 32px; border-radius: 50%; background: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
        .tg-name { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: #fff; display: flex; flex-direction: column; line-height: 1.25; position: relative; }
        .tg-badge { position: absolute; left: -16px; top: 1px; width: 13px; height: 13px; border-radius: 50%; background: #fff; color: #4E8FC0; font-size: 9px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; }
        .tg-status { font-weight: 500; font-size: 10.5px; color: #DCEBF7; }
        .tg-body { background: #CAD7E0; background-image: radial-gradient(rgba(255,255,255,0.45) 1px, transparent 1px); background-size: 18px 18px; padding: 13px 12px; display: flex; flex-direction: column; gap: 4px; }
        /* F-1002-83 · 168-qonun: bosib ochiladigan, hali ochilmagan element navbat bilan yengil pulslaydi (outline — halqa-soyani buzmaydi) */
        .tap-wave { animation: tap-wave 2.2s ease-out infinite; }
        .tap-wave:nth-child(2) { animation-delay: 0.35s; } .tap-wave:nth-child(3) { animation-delay: 0.7s; } .tap-wave:nth-child(4) { animation-delay: 1.05s; } .tap-wave:nth-child(5) { animation-delay: 1.4s; } .tap-wave:nth-child(6) { animation-delay: 1.75s; }
        @keyframes tap-wave { 0% { outline: 2px solid rgba(255,79,40,0.5); outline-offset: 0; } 70%, 100% { outline: 2px solid rgba(255,79,40,0); outline-offset: 6px; } }
        @media (prefers-reduced-motion: reduce) { .tap-wave { animation: none; outline: 1.5px solid rgba(255,79,40,0.35); outline-offset: 2px; } }
        .tg-body { max-height: clamp(260px, 48vh, 420px); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; } /* F-1002-85 · 169-qonun: chat cho'zilmaydi, ichki skrol */
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
        .blank-group .bg-lbl { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .blank-row { display: flex; flex-wrap: wrap; gap: 7px; }

        @keyframes shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .shake { animation: shake 0.4s ease; }

        /* ===== DRAG & DROP (DragDropOrder — reusable) ===== */
        .dd { display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,1fr); gap: 13px; align-items: start; } /* §34: keng ekranda uyalar chapda, hovuz o'ngda */
        @media (max-width: 760px) { .dd { grid-template-columns: 1fr; } }
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
        .dd-chip { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip::before { content: '⠿'; margin-right: 7px; opacity: .75; font-weight: 400; } /* F-1002-59: to'ldirilgan gradient chip (6-Modul ko'rinishi, 26.09 oq+chegara varianti bekor), ⠿ ushlagich sudralishni aytadi */
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
        .ach-rule { margin: 8px 0 0; text-align: center; font-size: 13px; line-height: 1.4; color: ${T.ink2}; }
        .ach-rule.lost { font-style: italic; }
        /* ============ 3-DARS v2 (F-0928 QA, MD-birinchi): U1–U3, A6, A7 ============ */
        /* Kod muharriri: uzun qator o'z panelida o'raladi (U2, F-0930-61) */
        .editor { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); min-width: 0; max-width: 100%; }
        .editor-bar { background: #2D2D2D; padding: 7px 11px; display: flex; align-items: center; gap: 9px; }
        .editor-tab { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: #C9D1D9; background: #1E1E1E; padding: 4px 11px; border-radius: 6px 6px 0 0; }
        .editor-body { background: ${CODE.bg}; padding: 12px 14px; overflow-x: auto; }
        .editor-code { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.75; color: ${CODE.text}; white-space: pre-wrap; overflow-wrap: anywhere; margin: 0; }
        /* Kattalashtirish belgisi matn ustiga tushmasin — unga joy ajratiladi (U2) */
        .zoomable:not(.zoom-on):not(.z-empty) { padding-top: 36px; }
        .zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: 0; }
        /* Chat: bir xil oraliq, so'z ichida bo'linmaydi (U2) */
        .tg-body { gap: 10px !important; }
        .tg-bubble { margin-bottom: 0 !important; word-break: normal !important; overflow-wrap: break-word; }
        .tg-bubble-wrap .tg-inline { margin-top: 14px; }
        .tg-ava { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; color: #4E8FC0; letter-spacing: 0.02em; }
        .tg-inline-btn.is-live, .tg-replykb-btn.is-live { cursor: pointer; }
        .tg-inline-btn.tap-hint, .tg-replykb-btn.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }
        .chat-note { margin: 0; color: ${T.ink2}; line-height: 1.45; }
        .chat-quiet { margin: 2px; color: ${T.ink3}; font-style: italic; }
        /* Hook tanlovi ballsiz — neytral to'q ramka (U1) */
        /* Reja: oddiy raqamli ro'yxat — bosilmaydi, tugmaga o'xshamaydi (U1) */
        /* Ochiladigan qism: doimiy belgi, bosilgach ✓ (U1) */
        .open-chip .open-mk { color: ${T.ink3}; font-weight: 800; margin-left: 2px; }
        .open-chip.seen { box-shadow: inset 0 0 0 1.5px ${T.success}; color: ${T.success}; }
        .open-chip.seen .open-mk { color: ${T.success}; }
        .open-chip.sel { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        /* Xabar yo'li (s3): qatlamlar bitta qatorda, yo'l va javob strelkasi chiziladi (A7) */
        /* F-1002-82 · 167-qonun: xabar yo'li sahnasi (3 qatlam + yuruvchi xabar + qaytuvchi javob) */
        .xpn { position: relative; background: ${T.paper}; border-radius: 16px; padding: 14px 14px 64px; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.3); }
        .xpn-row { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(14px,5vw,60px); }
        .xpn-node { position: relative; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 11px 8px 10px; border: none; border-radius: 14px; background: ${T.bg}; color: ${T.ink}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: transform 0.15s; min-width: 0; }
        .xpn-node:hover { transform: translateY(-2px); }
        .xpn-node.on { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .xpn-node.sel { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .xpn-mk { position: absolute; right: 9px; top: 7px; font-weight: 800; font-size: 13px; color: ${T.ink3}; }
        .xpn-node.on .xpn-mk { color: ${T.success}; }
        .xpn-ic { font-size: clamp(24px,3vw,30px); line-height: 1; }
        .xpn-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.6vw,14.5px); }
        .xpn-sub { font-size: 11.5px; color: ${T.ink2}; text-align: center; }
        .xpn-track { position: absolute; left: 16%; right: 16%; bottom: 42px; height: 22px; }
        .xpn-track.back { bottom: 12px; }
        .xpn-go, .xpn-ret { position: absolute; left: 0; right: 0; top: 10px; height: 2px; }
        .xpn-go { background: ${T.ink3}; opacity: 0.6; } .xpn-go::after { content: ''; position: absolute; right: -2px; top: -4px; border-left: 8px solid ${T.ink3}; border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
        .xpn-ret { background: ${T.accent}; opacity: 0.55; } .xpn-ret::before { content: ''; position: absolute; left: -2px; top: -4px; border-right: 8px solid ${T.accent}; border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
        .xpn-ret-lbl { position: absolute; left: 50%; top: -6px; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; color: ${T.accent}; }
        .xpn-pill { position: absolute; top: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; font-weight: 700; padding: 2px 9px; border-radius: 99px; white-space: nowrap; opacity: 0; }
        .xpn-pill.msg { background: #EFFDDE; color: #14301A; box-shadow: 0 2px 6px rgba(0,0,0,0.14); animation: xpn-go 2.2s ease-in-out 0.4s forwards; }
        .xpn-pill.rep { background: #fff; color: #0E0E10; box-shadow: 0 0 0 1px ${T.accent}; animation: xpn-back 1.8s ease-in-out 2.5s forwards; }
        @keyframes xpn-go { 0% { left: -4%; opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { left: 92%; opacity: 0; } }
        @keyframes xpn-back { 0% { left: 92%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: -4%; opacity: 0; } }
        @media (max-width: 560px) { .xpn-row { gap: 8px; } .xpn-sub { display: none; } }
        @keyframes xdraw-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        /* Navbat bilan ochilish (A6): qadam sarlavhasi va yig'ilgan qator */
        .steps-col { display: flex; flex-direction: column; gap: clamp(10px,1.6vw,14px); }
        .step-h { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
        .fold-row { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.successSoft}; color: ${T.success}; border: none; border-radius: 10px; padding: 9px 12px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; }
        .fold-row.is-btn { cursor: pointer; }
        .fold-row.is-btn:hover { box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .fold-ck { font-weight: 800; }
        .fold-t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .fold-re { font-weight: 800; opacity: 0.7; }
        .s9-ctl { display: flex; flex-direction: column; gap: 8px; }
        /* F-1002-84: qadam-chiplari · handler qatori holatlari (yo'q → kerak → ulandi) · chatdagi tizim belgisi */
        .s9-steps { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 2px; }
        .s9-step { font-family: 'Manrope'; font-weight: 700; font-size: 12px; padding: 4px 11px; border-radius: 99px; background: ${T.paper}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .s9-step.cur { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .s9-step.ok { background: ${T.successSoft}; color: ${T.success}; box-shadow: none; }
        .pick-row.code.wait { background: ${T.paper}; color: ${T.ink2}; box-shadow: none; border: 1.5px dashed ${T.line}; }
        .pick-row.code.wait .pick-plus { color: ${T.ink3}; font-weight: 600; }
        .pick-row.code.need { background: ${T.accent}; color: #fff; }
        .pick-row.code.need .pick-plus { color: #fff; }
        .btn.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }
        .tg-bubble-wrap.sys { align-self: center; align-items: center; max-width: 100%; }
        .tg-bubble.sys { background: rgba(14,14,16,0.08); color: #44444C; font-size: 11.5px; font-weight: 600; border-radius: 99px; padding: 4px 11px; box-shadow: none; }
        @media (prefers-reduced-motion: reduce) { .btn.tap-hint { animation: none; } }
        .flow-label.mono-lbl { text-transform: none; letter-spacing: 0; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        .help-msg { display: flex; flex-direction: column; gap: 3px; }
        .help-line { color: ${T.ink2}; }
        .help-line.ok { color: ${T.ink}; }
        .one-col { max-width: 640px; }
        .lp-step.cur { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 6px 16px -6px rgba(255,79,40,0.22); }
        .lp-step.on .lp-step-t { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lp-extra { margin: 0; color: ${T.ink2}; line-height: 1.5; }
        /* Bog'lanish chizig'i (A7) */
        .link-wrap { position: relative; }
        .link-svg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 4; }
        .link-path { fill: none; stroke: ${T.accent}; stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: link-draw 0.8s ease-out forwards; }
        .link-svg.ok .link-path { stroke: ${T.success}; }
        .link-svg.bad .link-path { stroke: ${T.danger}; }
        .link-dot { fill: ${T.accent}; opacity: 0; animation: link-dot 0.2s ease-out forwards; }
        .link-svg.ok .link-dot { fill: ${T.success}; }
        .link-svg.bad .link-dot { fill: ${T.danger}; }
        /* Ustunlararo chiziq: tor ekranda ustunlar ustma-ust tushadi, chiziq matn ustidan o'tmasin (N20, qoida 4) */
        @media (max-width: 760px) { .link-svg.cols { display: none; } }
        @keyframes link-draw { to { stroke-dashoffset: 0; } }
        @keyframes link-dot { to { opacity: 1; } }
        /* Final: to'g'ri yig'ilgach handlerlar bo'ylab strelka (A7) */
        .dd-flow { position: absolute; right: 12px; width: 2px; background: ${T.success}; transform-origin: top center; animation: xdraw-y 1s ease-out both; z-index: 2; pointer-events: none; }
        .dd-flow::after { content: ''; position: absolute; left: -4px; bottom: -2px; border-top: 7px solid ${T.success}; border-left: 5px solid transparent; border-right: 5px solid transparent; }
        @keyframes xdraw-y { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        /* Qisqa takrorlash belgisi: kod misoli yoki raqam (U3) */
        .rc-ic.code { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(14px,2.2vw,20px); font-weight: 700; color: ${CODE.text}; background: ${CODE.bg}; border-radius: 12px; padding: 10px 16px; max-width: 100%; overflow-wrap: anywhere; }
        .rc-ic.num { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) {
          .xpn-pill, .dd-flow, .tg-inline-btn.tap-hint, .tg-replykb-btn.tap-hint { animation: none !important; }
          .link-path { animation: none !important; stroke-dashoffset: 0; }
          .link-dot { animation: none !important; opacity: 1; }
        }
      
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
      <div className="lesson-root">
        {live.mode === 'choosing' ? (
          <LiveGate live={live} title={{ uz: 'Telegram Bot API + tugmalar', ru: "Telegram Bot API + кнопки" }} />
        ) : (
          <AchCtx.Provider value={earned}>
          <AchMissCtx.Provider value={achMissVal}>
          <LiveGateCtx.Provider value={{ locked, live }}>
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} live={live} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
            </>
          </LiveGateCtx.Provider>
          </AchMissCtx.Provider>
          </AchCtx.Provider>
        )}
      </div>
    </LangContext.Provider>
  );
}
