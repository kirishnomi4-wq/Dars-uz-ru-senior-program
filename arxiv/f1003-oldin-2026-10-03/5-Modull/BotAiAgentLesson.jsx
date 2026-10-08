import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 5-MODUL (Telegram bot + AI) · DARS 10 — «AI-agent yaratish» — PLATFORM STANDARD v18 (AUDIOSIZ)
// Manba-haqiqat: feedback/F-0928-QA-5modul/10-BotAiAgent-v2.md (MD-birinchi, F-1001).
// Asosiy model (A11): Maqsad olinadi → Idrok → Qaror → Amal → maqsadga yetdimi? Agentga siz beradigan uch narsa:
//   maqsad, asboblar (tool — agent chaqira oladigan funksiya), chegara (guardrail).
// Asboblar to'plami (A14): checkOrder() · saveOrder() · arrangeDelivery() · chargeCard() · cancelOrder().
// Olam: AvtoPizza boti — «2 ta Pepperoni, Chilonzor 5-kvartal».
// INTERAKTIV: s0 ikki bot · s3 agent sikli · s5 agentni qurish (cycleBuilder) · s7 asbob tanlash (toolPicker) ·
//   s9 pul yechishdan oldin tasdiq (guardKeeper) · s11 amal xavfsizligi (safeActor) · s12 agent ishda ·
//   s15 FINAL: tartibni yig'ish (DragDropOrder) · amaliyot: aistudio.google.com'da asbob chaqiruvi.
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium.
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
const useLang = () => useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return useCallback((node) => {
    if (node === null || node === undefined) return '';
    if (typeof node === 'string') return node;
    if (React.isValidElement(node)) return node;
    if (node[lang] !== undefined) return node[lang];
    return node.uz ?? node.ru ?? '';
  }, [lang]);
};
// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
// UZ-etalon (analytics/payload uchun — til almashsa ham bir xil qiymat ketadi)
const uzOf = (node) => (node && typeof node === 'object' && !React.isValidElement(node)) ? (node.uz ?? node.ru ?? '') : node;
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

const LESSON_META = { lessonId: 'bot-ai-agent-05-10-v18', lessonTitle: { uz: 'AI-agent yaratish', ru: "Создание ИИ-агента" } };
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
            <div key={id} className={`ach-pop-row ${got ? 'got' : ''}`}><span className="ach-pop-ic">{got ? a.icon : '🔒'}</span><span className="ach-pop-nm">{a.name}</span></div>
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
const NavNext = ({ disabled, label, onClick, optionalLive }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  const goOn = tr({ uz: 'Davom etish', ru: 'Продолжить' });
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: "Подождите ментора" }) : (freeRide && disabled ? goOn : (tr(label) || goOn))}</button>;
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
// ⚡ To'g'ri javob pozitsiyalari ATAYIN har xil (2 · 0 · 3 · 1) — «doim A» naqshi yo'q, o'qimay bosgan ball to'plamaydi.
// s15 (yakuniy DragDropOrder) — REAL kalit: picked=0 sentinel → 1-urinishda topdi (tartib to'g'ri yig'ilgandagina onSolved chaqiriladi).
const INLINE_KEYS = { s4: 2, s8: 0, s10: 3, s14: 1, s15: 0, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI). Matn 🎓 Metodist tomonidan sayqallanadi.
const RECAPS = {
  4: {
    title: { uz: "AI-bot va AI-agent farqi", ru: 'Разница между ИИ-ботом и ИИ-агентом' },
    cards: [
      { ic: "1", h: { uz: "AI-bot", ru: "ИИ-бот" }, body: { uz: "AI faqat javob matnini yozadi.", ru: "ИИ только пишет текст ответа." } },
      { ic: "saveOrder()", h: { uz: "AI-agent", ru: "ИИ-агент" }, body: { uz: "AI keyingi qadamni tanlaydi va asbob chaqiradi.", ru: "ИИ выбирает следующий шаг и вызывает инструмент." } },
      { ic: "3", h: { uz: "Bitta javob va sikl", ru: "Один ответ и цикл" }, body: { uz: "Bot bitta javob bilan to'xtaydi, agent maqsadga yetguncha sikl bo'ylab ishlaydi.", ru: "Бот останавливается на одном ответе, а агент работает по циклу, пока не достигнет цели." }, ask: { uz: "AI-bot bilan AI-agentning asosiy farqi nima?", ru: "В чём главная разница между ИИ-ботом и ИИ-агентом?" } },
    ]
  },
  8: {
    title: { uz: "Agent ishni qanday bajaradi", ru: "Как агент выполняет работу" },
    cards: [
      { ic: "1", h: { uz: "Idrok", ru: 'Восприятие' }, body: { uz: "Vaziyatni ko'radi: xabar va bazadagi ma'lumot.", ru: "Видит ситуацию: сообщение и данные в базе." } },
      { ic: "2", h: { uz: "Qaror", ru: 'Решение' }, body: { uz: "AI maqsadga qarab asbob tanlaydi.", ru: "ИИ выбирает инструмент, исходя из цели." } },
      { ic: "saveOrder()", h: { uz: "Amal", ru: 'Действие' }, body: { uz: <>Asbob chaqiriladi (masalan, <code className="qcode">saveOrder()</code>) va natija qaytadi.</>, ru: <>Вызывается инструмент (например, <code className="qcode">saveOrder()</code>), и возвращается результат.</> }, ask: { uz: "Agent ishni nima orqali bajaradi?", ru: "С помощью чего агент выполняет работу?" } },
    ]
  },
  10: {
    title: { uz: "Nega sikl takrorlanadi", ru: "Почему цикл повторяется" },
    cards: [
      { ic: "1", h: { uz: "Natijani ko'radi", ru: 'Смотрит на результат' }, body: { uz: "Har Amaldan keyin agent natijaga qaraydi, bu yangi Idrok.", ru: "После каждого Действия агент смотрит на результат — это новое Восприятие." } },
      { ic: "2", h: { uz: "Maqsadga yetdimi?", ru: "Цель достигнута?" }, body: { uz: "Yetmagan bo'lsa, keyingi qadamni tanlaydi.", ru: "Если нет — выбирает следующий шаг." } },
      { ic: "3", h: { uz: "Takrorlanadi", ru: "Повторяется" }, body: { uz: "Maqsadga yetguncha Idrok → Qaror → Amal.", ru: "Пока цель не достигнута: Восприятие → Решение → Действие." }, ask: { uz: "Agent bitta amaldan keyin nima qiladi?", ru: 'Что агент делает после одного действия?' } },
    ]
  },
  14: {
    title: { uz: "Chegara — agent nimani qila oladi", ru: "Ограничение — что агенту можно делать" },
    cards: [
      { ic: "1", h: { uz: "Cheklangan asboblar", ru: 'Ограниченный набор инструментов' }, body: { uz: "Agentga faqat kerakli asboblar beriladi.", ru: "Агенту дают только нужные инструменты." } },
      { ic: "chargeCard()", h: { uz: "Tasdiq so'rash", ru: 'Спросить подтверждение' }, body: { uz: "Xavfli amaldan (pul yechish, bekor qilish) oldin odamdan tasdiq so'raladi.", ru: "Перед опасным действием (списание денег, отмена) у человека спрашивают подтверждение." } },
      { ic: "3", h: { uz: "Odam nazorati", ru: 'Контроль человека' }, body: { uz: "Shubhali holat odamga uzatiladi.", ru: "Спорную ситуацию передают человеку." }, ask: { uz: "Agent pul yechishdan oldin nima qilishi kerak?", ru: 'Что агент должен сделать перед списанием денег?' } },
    ]
  },
  15: {
    title: { uz: "Agent qanday ishlaydi", ru: "Как работает агент" },
    cards: [
      { ic: "1", h: { uz: "Maqsad olinadi", ru: "Цель получена" }, body: { uz: "Agent vazifani oladi.", ru: "Агент получает задачу." } },
      { ic: "2", h: { uz: "Idrok → Qaror → Amal", ru: "Восприятие → Решение → Действие" }, body: { uz: "Vaziyatni ko'radi, asbob tanlaydi, uni chaqiradi.", ru: "Видит ситуацию, выбирает инструмент и вызывает его." } },
      { ic: "3", h: { uz: "Maqsadga yetdimi?", ru: "Цель достигнута?" }, body: { uz: "Yetmagan bo'lsa, yana Idrok.", ru: "Если нет — снова Восприятие." }, vis: <RcFlow items={[{ uz: 'Maqsad olinadi', ru: "Цель получена" }, { uz: 'Idrok', ru: 'Восприятие' }, { uz: 'Qaror', ru: 'Решение' }, { uz: 'Amal', ru: 'Действие' }, { uz: "Maqsadga yetdimi?", ru: "Цель достигнута?" }]} />, ask: { uz: "Agent ishi nimadan boshlanadi?", ru: "С чего начинается работа агента?" } },
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
        <div className={`rc-ic ${/^\d+$/.test(card.ic) ? 'num' : 'code'}`}>{card.ic}</div>
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
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующая →' })}</button>}
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
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>{tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }} /></div>
      {reveal ? (
        <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri ✅", ru: 'верно ✅' })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: 'xato ❌', ru: 'неверно ❌' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ожидаем ⏳' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi 📨', ru: 'ответили 📨' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ожидаем ⏳' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: '🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o\'quvchilar ekranida ham birdan ochiladi.', ru: '🙈 Кто что выбрал и сколько ✅/❌ — пока скрыто. По кнопке «Открыть результат» всё откроется сразу и у Вас, и на экранах учеников.' })}</p>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тема осталась непонятной для класса. Перед продолжением советуем короткое повторение.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: 'Qayta tushuntirish —', ru: 'Объяснить заново —' })} {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. При желании перед продолжением коротко повторите.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс усвоил тему. Спокойно продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: `Javob berganlar kam (${answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.`, ru: `Ответивших мало (${answered}) — по процентам выводы делать трудно. Оцените сами.` })}</p>}
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
    if (audioText) { audio.triggerEvent('option_picked'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? (audioOk || "To'g'ri.") : (audioWrong || "Unchalik emas. Qaytadan urinib ko'ring.")); }, 300); } // AUDIOSIZ — ko'rinmaydi
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
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing", ru: "Живой урок — одна попытка, подумайте перед нажатием" })}</p>}
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
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас Вы узнаете верный ответ.' })
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

// ===== MOCK TERMINAL =====
const Term = ({ title = 'Terminal', children, minH }) => (
  <div className="term"><div className="term-bar"><span className="bb-dots"><i /><i /><i /></span><span className="term-title">{title}</span></div><div className="term-body" style={{ minHeight: minH }}>{children}</div></div>
);
const TLine = ({ cmd, out, col }) => (
  <div className="el-in tline">{cmd ? <><span style={{ color: CODE.str }}>$</span> <span style={{ color: CODE.text }}>{cmd}</span></> : <span style={{ color: col || CODE.comment }}>{out}</span>}</div>
);

// ===== TELEGRAM CHAT (jonli ko'rinish) =====
// Avatar — sarlavhaning bosh harfi (A4: emoji yo'q)
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
const TgChat = ({ title = 'AvtoPizza', status, children, minH }) => (
  <div className="tg">
    <div className="tg-head"><span className="tg-ava" aria-hidden="true">{String(tr(title)).charAt(0)}</span><span className="tg-name">{tr(title)}<span className="tg-status">{tr(status) || tr({ uz: 'bot · onlayn', ru: 'бот · онлайн' })}</span></span></div>
    <TgBody minH={minH}>{children}</TgBody>
  </div>
);
const Bubble = ({ from = 'bot', children, muted, thinking }) => <div className={`tg-bubble ${from} el-in ${muted ? 'muted' : ''}`}>{thinking ? <span className="gen-dots inline"><i /><i /><i /></span> : children}</div>;
// ===== AGENT KARTASI (s5: maqsad · asboblar · chegara) =====
const PromptCard = ({ children, who, tone }) => (
  <div className={`prompt-card ${tone || ''}`}><span className="prompt-who">{tr(who) || tr({ uz: 'Agent kartasi', ru: "Карточка агента" })}</span><div className="prompt-text">{children}</div></div>
);

function DragDropOrder({ items, hints, onSolved, onChange, onWrong, loopFrom, loopTo }) {
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
  // A7 (s15): to'g'ri yig'ilgach loopFrom-joydan loopTo-joyga qaytuvchi strelka chiziladi (sikl Idrok'ka qaytadi)
  const [loopBox, setLoopBox] = useState(null);
  useLayoutEffect(() => {
    if (!solved || loopFrom == null || loopTo == null) { setLoopBox(null); return; }
    const a = slotRefs.current[loopTo], b = slotRefs.current[loopFrom];
    if (!a || !b) return;
    const top = a.offsetTop + a.offsetHeight / 2;
    setLoopBox({ top, height: b.offsetTop + b.offsetHeight / 2 - top });
  }, [solved, loopFrom, loopTo]);
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
            {sid ? <button key={sid} className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr(byId[sid].label)}</button> : <span className="dd-hint">{hints ? tr(hints[i]) : tr({ uz: 'bu yerga joylang', ru: 'поместите сюда' })}</span>}
          </div>
        ))}
        {loopBox && <><span className="dd-loop" style={{ top: loopBox.top, height: loopBox.height }} aria-hidden="true" /><i className="dd-loop-head" style={{ top: loopBox.top - 4 }} aria-hidden="true" /></>}
      </div>
      {!solved && <div className="dd-pool">
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>}
      {wrong && !solved && <div className="dd-wrong">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang.", ru: "Порядок неверный — нажмите на блок, верните его и разложите заново." })}</div>}
    </div>
  );
}

// ===== AGENT DATA (AvtoPizza boti; asboblar to'plami — A14) =====
// AI-bot va AI-agent (s2) — 3 jihat
const VS_ROWS = [
  { id: 'steps', k: { uz: 'Necha qadam?', ru: 'Сколько шагов?' }, bot: { uz: 'bitta: xabar → javob', ru: "один: сообщение → ответ" }, agent: { uz: 'bir nechta: maqsadga yetguncha sikl', ru: "несколько: цикл, пока цель не достигнута" } },
  { id: 'hands', k: { uz: 'Nima bilan ishlaydi?', ru: "С чем работает?" }, bot: { uz: 'faqat matn bilan', ru: "только с текстом" }, agent: { uz: <>asboblar bilan: siz yozgan funksiyalar (<code className="qcode">saveOrder()</code> kabi)</>, ru: <>с инструментами: функциями, которые написали вы (как <code className="qcode">saveOrder()</code>)</> } },
  { id: 'input', k: { uz: 'Siz nima berasiz?', ru: 'Что даёте Вы?' }, bot: { uz: 'system prompt: qanday javob yozsin', ru: "system prompt: каким писать ответ" }, agent: { uz: 'maqsad, asboblar va chegara', ru: "цель, инструменты и ограничение" } }
];
// Agent sikli (s3)
const PHASES = [
  { id: 'perceive', label: { uz: 'Idrok', ru: 'Восприятие' } },
  { id: 'decide', label: { uz: 'Qaror', ru: 'Решение' } },
  { id: 'act', label: { uz: 'Amal', ru: 'Действие' } }
];
const CYCLE_STEPS = [
  { phase: 'perceive', txt: { uz: "Mijoz yozdi: «2 ta Pepperoni». Agent xabarni o'qidi. Pepperoni bugun bormi — hali noma'lum.", ru: "Клиент написал: «2 Пепперони». Агент прочитал сообщение. Есть ли сегодня Пепперони — пока неизвестно." } },
  { phase: 'decide', txt: { uz: "Avval Pepperoni borligini bilish kerak → `checkOrder` asbobini tanlaydi.", ru: "Сначала нужно узнать, есть ли Пепперони → выбирает инструмент `checkOrder`." } },
  { phase: 'act', txt: { uz: "`checkOrder()` chaqirildi → natija: «Pepperoni bor». Maqsadga hali yetmadi.", ru: "`checkOrder()` вызван → результат: «Пепперони есть». Цель ещё не достигнута." } },
  { phase: 'perceive', txt: { uz: "Natijani o'qidi: Pepperoni bor, buyurtma esa hali bazada yo'q.", ru: "Прочитал результат: Пепперони есть, а заказа в базе ещё нет." } },
  { phase: 'decide', txt: { uz: "Endi buyurtmani saqlash kerak → `saveOrder` asbobini tanlaydi.", ru: "Теперь нужно сохранить заказ → выбирает инструмент `saveOrder`." } },
  { phase: 'act', txt: { uz: "`saveOrder()` chaqirildi → buyurtma bazaga yozildi. Maqsadga yetdi — sikl to'xtaydi.", ru: "`saveOrder()` вызван → заказ записан в базу. Цель достигнута — цикл останавливается." } }
];
// Asboblar (s6) — butun darsda bitta to'plam (A14)
const TOOLS = [
  { id: 'check', tok: 'checkOrder()', desc: { uz: "Taom borligini yoki buyurtma qaysi holatda ekanini tekshiradi.", ru: "Проверяет, есть ли блюдо или в каком состоянии заказ." } },
  { id: 'save', tok: 'saveOrder()', desc: { uz: "Buyurtmani bazaga (PostgreSQL) yozadi.", ru: "Записывает заказ в базу (PostgreSQL)." } },
  { id: 'deliver', tok: 'arrangeDelivery()', desc: { uz: "Yetkazishni rejalaydi: kuryerga manzil va vaqtni beradi.", ru: "Оформляет доставку: передаёт курьеру адрес и время." } },
  { id: 'charge', tok: 'chargeCard()', desc: { uz: "Mijoz kartasidan pul yechadi.", ru: "Списывает деньги с карты клиента." } },
  { id: 'cancel', tok: 'cancelOrder()', desc: { uz: "Buyurtmani bekor qiladi.", ru: "Отменяет заказ." } }
];
// s7 — asboblar paneli vaziyat tartibidan boshqa tartibda (4-savol A)
const TOOL_PICK_ORDER = ['save', 'cancel', 'deliver', 'check', 'charge'];
// Asbob tanlash vaziyatlari (s7)
const SITUATIONS = [
  { id: 'q1', sit: { uz: "Mijoz yozdi: «Buyurtmam qayerda?»", ru: "Клиент написал: «Где мой заказ?»" }, tool: 'check' },
  { id: 'q2', sit: { uz: "Pul yechildi, lekin buyurtma hali bazada yo'q", ru: "Деньги списаны, но заказа в базе ещё нет" }, tool: 'save' },
  { id: 'q3', sit: { uz: "Buyurtma bazaga yozildi. Endi uni kuryerga berish kerak", ru: "Заказ записан в базу. Теперь его нужно передать курьеру" }, tool: 'deliver' }
];
// Agentni qurish (s5): maqsad + asboblar + chegara. To'g'ri variant o'rni aralash (4-savol A) — tekshiruv `ok` bayrog'i
// bo'yicha (indeks emas); har xato variantning o'z yozuvi bor.
const AGENT_BUILD = [
  { id: 'goal', q: { uz: 'Maqsad?', ru: 'Цель?' }, k: { uz: 'MAQSAD:', ru: 'ЦЕЛЬ:' }, opts: [
    { id: 'g-answer', t: { uz: "Buyurtma haqidagi savollarga javob yozish", ru: "Писать ответы на вопросы о заказе" }, err: { uz: "Faqat javob yozish — AI-botning ishi.", ru: "Только писать ответы — это работа ИИ-бота." } },
    { id: 'g-accept', ok: true, t: { uz: "Buyurtmani qabul qilib, yetkazishga tayyorlash", ru: 'Принять заказ и подготовить его к доставке' } },
    { id: 'g-check', t: { uz: "Taom bor-yo'qligini tekshirish", ru: "Проверять, есть ли блюдо" }, err: { uz: "Bu — bitta qadam, maqsad emas.", ru: "Это один шаг, а не цель." } }
  ] },
  { id: 'tools', q: { uz: 'Asboblar?', ru: 'Инструменты?' }, k: { uz: 'ASBOBLAR:', ru: 'ИНСТРУМЕНТЫ:' }, opts: [
    { id: 't-fun', t: { uz: "sendSticker, changeAvatar, playMusic, setTheme, sendGif", ru: "sendSticker, changeAvatar, playMusic, setTheme, sendGif" }, err: { uz: "Bu asboblar buyurtmaga kerak emas.", ru: "Эти инструменты для заказа не нужны." } },
    { id: 't-admin', t: { uz: "changePrice, banUser, refundAll, deleteMenu, sendAds", ru: "changePrice, banUser, refundAll, deleteMenu, sendAds" }, err: { uz: "Bu asboblar buyurtmani qabul qilishga kerak emas.", ru: "Эти инструменты не нужны, чтобы принять заказ." } },
    { id: 't-order', ok: true, t: { uz: "checkOrder, saveOrder, arrangeDelivery, chargeCard, cancelOrder", ru: "checkOrder, saveOrder, arrangeDelivery, chargeCard, cancelOrder" } }
  ] },
  { id: 'guard', q: { uz: 'Chegara?', ru: 'Ограничение?' }, k: { uz: 'CHEGARA:', ru: "ОГРАНИЧЕНИЕ:" }, opts: [
    { id: 'c-confirm', ok: true, t: { uz: "Pul yechish yoki bekor qilishdan oldin odamdan tasdiq so'rasin", ru: "Перед списанием денег или отменой пусть спросит подтверждение у человека" } },
    { id: 'c-auto', t: { uz: "Mijoz so'rasa, har amalni tasdiqsiz bajarsin", ru: "Если клиент попросит, пусть выполняет любое действие без подтверждения" }, err: { uz: "Agent xato tushunsa, pul haqiqatan yechiladi.", ru: "Если агент поймёт неверно, деньги спишутся по-настоящему." } },
    { id: 'c-none', t: { uz: "Hech qanday amal qilmay, faqat javob yozsin", ru: "Пусть ничего не делает, а только пишет ответы" }, err: { uz: "Unda u yana AI-bot bo'lib qoladi.", ru: "Тогда он снова станет ИИ-ботом." } }
  ] }
];
const buildOk = (row) => row.opts.find(o => o.ok);
// Amal xavfsizligi (s11): qaysi amalga odam tasdig'i kerak?
const ACT_SAFETY = [
  { id: 'a1', text: { uz: <>Buyurtma holatini tekshirish — <code className="qcode">checkOrder()</code></>, ru: <>Проверить состояние заказа — <code className="qcode">checkOrder()</code></> }, danger: false },
  { id: 'a2', text: { uz: <>Buyurtmani bekor qilish — <code className="qcode">cancelOrder()</code></>, ru: <>Отменить заказ — <code className="qcode">cancelOrder()</code></> }, danger: true },
  { id: 'a3', text: { uz: <>Buyurtmani bazaga yozish — <code className="qcode">saveOrder()</code></>, ru: <>Записать заказ в базу — <code className="qcode">saveOrder()</code></> }, danger: false }
];
// Chegaralar (s13)
const GUARDS = [
  { id: 'limit', label: { uz: 'Cheklangan asboblar', ru: 'Ограниченный набор инструментов' }, desc: { uz: "Agentga faqat kerakli asboblarni bering. Masalan, buyurtma agentiga narxni o'zgartirish yoki mijozni bloklash asbobini bermang: bermagan asbobini u chaqira olmaydi.", ru: "Давайте агенту только нужные инструменты. Например, агенту заказов не давайте инструмент, который меняет цену или блокирует клиента: инструмент, которого у него нет, он вызвать не сможет." } },
  { id: 'confirm', label: { uz: "Tasdiq so'rash", ru: 'Спросить подтверждение' }, desc: { uz: "Xavfli amaldan oldin (pul yechish, bekor qilish) agent mijoz yoki admindan tasdiq so'raydi.", ru: "Перед опасным действием (списание денег, отмена) агент спрашивает подтверждение у клиента или админа." } },
  { id: 'human', label: { uz: 'Odam nazorati', ru: 'Контроль человека' }, desc: { uz: "Murakkab yoki shubhali holatni agent odamga, masalan AvtoPizza adminiga, uzatadi. Inglizcha nomi — human-in-the-loop.", ru: "Сложную или спорную ситуацию агент передаёт человеку, например админу AvtoPizza. По-английски это называется human-in-the-loop." } }
];
// Final (s15): agent qanday ishlaydi — 5 bo'lak (A11)
const FLOW = [
  { id: 'goal', label: { uz: 'Maqsad olinadi', ru: "Цель получена" } },
  { id: 'perceive', label: { uz: 'Idrok', ru: 'Восприятие' } },
  { id: 'decide', label: { uz: 'Qaror', ru: 'Решение' } },
  { id: 'act', label: { uz: 'Amal', ru: 'Действие' } },
  { id: 'check', label: { uz: 'Maqsadga yetdimi?', ru: "Цель достигнута?" } }
];
const FLOW_ITEMS = FLOW.map(f => ({ id: f.id, label: f.label }));

// ===== SCREEN 0 — HOOK: ikki bot, bir xil buyurtma =====
// Javob izohi tanlovga qarab: «Aynan!» faqat to'g'ri variantga, qolganiga neytral «Qiziq fikr!» (A8)
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Kodida xato bor — bot buzilgan", ru: "В коде ошибка — бот сломан" }, ack: { uz: <><b>Qiziq fikr!</b> Lekin ikkala bot ham ishladi — farq «Baza» qatorida.</>, ru: <><b>Интересная мысль!</b> Но оба бота сработали — разница в строке «База».</> } },
  { id: 'b', label: { uz: "Bazaga yozadigan funksiyani chaqira olmaydi", ru: "Не может вызвать функцию, которая пишет в базу" }, ack: { uz: <><b>Aynan!</b> «Qabul qilindi» deb yozish bilan buyurtma bazaga tushmaydi — AI-agent buning uchun <code className="qcode">saveOrder()</code> ni chaqirdi.</>, ru: <><b>Именно!</b> От слов «заказ принят» заказ в базу не попадает — ИИ-агент для этого вызвал <code className="qcode">saveOrder()</code>.</> } },
  { id: 'c', label: { uz: "Internet sekin ishlab, xabar kechikdi", ru: "Интернет работал медленно, и сообщение опоздало" }, ack: { uz: <><b>Qiziq fikr!</b> Lekin ikkala javob ham vaqtida keldi — farq «Baza» qatorida.</>, ru: <><b>Интересная мысль!</b> Но оба ответа пришли вовремя — разница в строке «База».</> } }
];
const HOOK_USER = { uz: "2 ta Pepperoni, Chilonzor 5-kvartal. Buyurtmani rasmiylashtiring", ru: "2 Пепперони, Чиланзар 5-квартал. Оформите заказ" };
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [phase, setPhase] = useState(storedAnswer ? 3 : 0); // 0 — kutish · 1 — yozmoqda · 2 — javob + Baza · 3 — savol
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const poke = () => {
    if (phase > 0) return;
    setPhase(1); setSc(n => n + 1);
    timers.current.push(setTimeout(() => { setPhase(2); setSc(n => n + 1); }, 800));
    timers.current.push(setTimeout(() => { setPhase(3); setSc(n => n + 1); }, 2100));
  };
  const pick = (v) => { if (picked !== null || phase < 3) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  const cur = HOOK_OPTS.find(o => o.id === picked);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: "Вступление" })} screen={screen} scrollSignal={sc} navContent={<NavNext disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr({ uz: <>Qaysi bot buyurtmani <span className="italic" style={{ color: T.accent }}>haqiqatan</span> qabul qiladi?</>, ru: <>Какой бот <span className="italic" style={{ color: T.accent }}>действительно</span> принимает заказ?</> })}</h1>
        <Mentor>{tr({ uz: "6-darsda botingizga AI ulagansiz: u system prompt bo'yicha javob yozadi. Bunday botni bugun AI-bot deb ataymiz. Ikki botga bir xil buyurtma keldi — tugmani bosing va ularni solishtiring.", ru: "На 6-м уроке вы подключили к боту ИИ: он пишет ответы по system prompt. Сегодня такого бота мы называем ИИ-ботом. Двум ботам пришёл один и тот же заказ — нажмите кнопку и сравните их." })}</Mentor>
        <Zoomable><Split>
          <Col>
            <TgChat title={{ uz: 'AvtoPizza · AI-bot', ru: "AvtoPizza · ИИ-бот" }} status={{ uz: 'bot', ru: "бот" }} minH={110}>
              <Bubble from="user">{tr(HOOK_USER)}</Bubble>
              {phase === 1 && <Bubble from="bot" thinking />}
              {phase >= 2 && <Bubble from="bot">{tr({ uz: 'Albatta! Buyurtmangiz qabul qilindi.', ru: "Конечно! Ваш заказ принят." })}</Bubble>}
            </TgChat>
            {phase >= 2 && <div className="ag-db fade-step"><span className="ag-db-k">{tr({ uz: 'Baza', ru: "База" })}</span><span className="ag-db-line"><span className="ag-db-none">{tr({ uz: "yangi buyurtma yo'q", ru: "новых заказов нет" })}</span></span></div>}
          </Col>
          <Col>
            <TgChat title={{ uz: 'AvtoPizza · AI-agent', ru: "AvtoPizza · ИИ-агент" }} status={{ uz: 'agent', ru: "агент" }} minH={110}>
              <Bubble from="user">{tr(HOOK_USER)}</Bubble>
              {phase === 1 && <Bubble from="bot" thinking />}
              {phase >= 2 && <Bubble from="bot">{tr({ uz: 'Buyurtmangiz qabul qilindi: 2 ta Pepperoni. Taxminan 30 daqiqada yetkazamiz.', ru: "Ваш заказ принят: 2 Пепперони. Привезём примерно через 30 минут." })}</Bubble>}
            </TgChat>
            {phase >= 2 && <div className="ag-db fade-step">
              <span className="ag-db-k">{tr({ uz: 'Baza', ru: "База" })}</span>
              <span className="ag-db-line"><code className="qcode">saveOrder()</code><i className="ag-arr" aria-hidden="true" /><span className="ag-db-new">{tr({ uz: <>yangi buyurtma: 2 ta Pepperoni, <span style={{ whiteSpace: 'nowrap' }}>Chilonzor 5-kvartal</span></>, ru: <>новый заказ: 2 Пепперони, <span style={{ whiteSpace: 'nowrap' }}>Чиланзар 5-квартал</span></> })}</span></span>
              <span className="ag-db-line ag-db-late"><code className="qcode">arrangeDelivery()</code><span className="ag-db-to" aria-hidden="true">→</span><span>{tr({ uz: 'kuryer belgilandi', ru: "курьер назначен" })}</span></span>
            </div>}
          </Col>
        </Split></Zoomable>
        <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={poke} disabled={phase > 0}>{phase > 0 ? tr({ uz: '✓ Solishtirildi', ru: '✓ Сравнили' }) : tr({ uz: "▶ Ikki botni solishtirish", ru: '▶ Сравнить двух ботов' })}</button>
        {phase >= 3 && <div className="col fade-step">
          <p className="body" style={{ margin: 0, fontWeight: 700, color: T.ink }}>{tr({ uz: 'AI-botda nima yetishmaydi?', ru: 'Чего не хватает ИИ-боту?' })}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {HOOK_OPTS.map(o => {
              const on = picked === o.id;
              return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>);
            })}
          </div>
          {cur && <p className="hook-ack fade-step">{tr(cur.ack)}</p>}
        </div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA =====
const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { uz: "AI-bot va AI-agent — farqi nimada", ru: "ИИ-бот и ИИ-агент — в чём разница", tag: { uz: "farq", ru: "разница" } },
    { uz: "Agent sikli: Idrok → Qaror → Amal", ru: "Цикл агента: Восприятие → Решение → Действие", tag: { uz: "3 qadam", ru: "3 шага" } },
    { uz: "Asbob (tool) — agent chaqira oladigan funksiya", ru: "Инструмент (tool) — функция, которую агент может вызвать", tag: { uz: "kod", ru: "код" } },
    { uz: "Maqsad, asboblar va chegara bilan agent qurish", ru: "Строим агента: цель, инструменты и ограничение", tag: { uz: "qurish", ru: "сборка" } }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const Scheme = (
    <div className="ag-scheme fade-up delay-1">
      <div className="ag-sc-box">
        <span className="ag-sc-k">{tr({ uz: 'Siz berasiz:', ru: "Вы даёте:" })}</span>
        <b className="ag-sc-v">{tr({ uz: 'Maqsad · Asboblar · Chegara', ru: "Цель · Инструменты · Ограничение" })}</b>
      </div>
      <span className="ag-sc-arr" aria-hidden="true">→</span>
      <div className="ag-sc-box">
        <span className="ag-sc-k">{tr({ uz: 'Agent:', ru: "Агент:" })}</span>
        <span className="ag-sc-v"><b>{tr({ uz: 'Idrok → Qaror → Amal', ru: "Восприятие → Решение → Действие" })}</b> ↻</span>
        <span className="ag-sc-n">{tr({ uz: '(maqsadga yetguncha)', ru: "(пока цель не достигнута)" })}</span>
      </div>
    </div>
  );
  const StepsB = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 4 qadam', ru: '4 шага на сегодня' })}</p>
      <ol className="roadmap">{STEPS.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.5 + i * 0.18}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s)}</span>{s.tag && <span className="step-tag">{tr(s.tag)}</span>}</span></li>))}</ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun: <span className="italic" style={{ color: T.accent }}>AI-agent</span> — o'zi ishni bajaradigan bot.</>, ru: <>Сегодня: <span className="italic" style={{ color: T.accent }}>ИИ-агент</span> — бот, который сам выполняет работу.</> })}</h2></div>
        <Mentor>{tr({ uz: "O'tgan darsda botni mijozlar fikriga qarab o'zingiz yaxshiladingiz. Bugun botga maqsad berasiz: keyingi qadamni u o'zi tanlaydi — lekin faqat siz bergan asboblar va chegara ichida.", ru: "На прошлом уроке вы сами улучшили бота по отзывам клиентов. Сегодня вы дадите боту цель: следующий шаг он выберет сам — но только в рамках инструментов и ограничения, которые дали вы." })}</Mentor>
        {!isNarrow ? (<Split><Col>{Scheme}</Col>{StepsB}</Split>)
          : !showSteps ? <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{Scheme}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "4 qadamni ko'rish", ru: 'Посмотреть 4 шага' })}</button></div>
            : <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Chizmani ko'rish", ru: "↩ Посмотреть схему" })}</button>{StepsB}</div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 2 — AI-BOT va AI-AGENT (3 jihat) =====
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(VS_ROWS.map(r => r.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= VS_ROWS.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = VS_ROWS.find(r => r.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · farq', ru: 'Понятие · разница' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `3 farqni ko'ring (${seen.size}/3)`, ru: `Посмотрите 3 отличия (${seen.size}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AI-bot va AI-agent: <span className="italic" style={{ color: T.accent }}>farq qayerda?</span></>, ru: <>ИИ-бот и ИИ-агент: <span className="italic" style={{ color: T.accent }}>в чём разница?</span></> })}</h2></div>
        <Mentor>{tr({ uz: "Ikkalasining ichida bir xil AI bo'lishi mumkin. Farq — AI'ga nima berilganida va u nima qila olishida. Har jihatni bosing.", ru: "Внутри у обоих может быть один и тот же ИИ. Разница — в том, что дали ИИ и что он может делать. Нажмите на каждый признак." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {VS_ROWS.map(r => <button key={r.id} className={`gchip ${seen.has(r.id) ? 'seen' : 'tap-wave'} ${active === r.id ? 'cur' : ''}`} onClick={() => tap(r.id)}>{tr(r.k)}<span className="ag-chev" aria-hidden="true">{seen.has(r.id) ? '✓' : '›'}</span></button>)}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "AI-botda AI javob matnini yozadi. AI-agentda AI qadamni tanlaydi, ishni esa siz yozgan asbob bajaradi.", ru: "В ИИ-боте ИИ пишет текст ответа. В ИИ-агенте ИИ выбирает шаг, а работу выполняет ваш инструмент." })}</p></div>}
          </Col>
          <Col>
            {cur
              ? <div className="fade-step" key={active} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p className="flow-label">{tr(cur.k)}</p>
                  <div className="sk-info"><p className="note-h" style={{ color: T.ink2 }}>{tr({ uz: 'AI-bot', ru: 'ИИ-бот' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.bot)}</p></div>
                  <div className="sk-info"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: 'AI-agent', ru: 'ИИ-агент' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.agent)}</p></div>
                </div>
              : null}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — AGENT SIKLI (qadam-baqadam) =====
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [step, setStep] = useState(storedAnswer ? CYCLE_STEPS.length : 0);
  const [sc, setSc] = useState(0);
  const done = step >= CYCLE_STEPS.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const curPhase = step === 0 ? null : CYCLE_STEPS[step - 1].phase;
  const curP = curPhase ? PHASES.find(p => p.id === curPhase) : null;
  const advance = () => { if (!done) { setStep(n => n + 1); setSc(n => n + 1); } };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · sikl', ru: 'Понятие · цикл' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Siklni yuriting (${step}/${CYCLE_STEPS.length})`, ru: `Пройдите цикл (${step}/${CYCLE_STEPS.length})` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Agent sikli: <span className="italic" style={{ color: T.accent }}>Idrok → Qaror → Amal</span>.</>, ru: <>Цикл агента: <span className="italic" style={{ color: T.accent }}>три шага</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Agent bitta amal bilan to'xtamaydi: har Amaldan keyin natijani ko'radi va keyingi qadamni tanlaydi. Tugmani bosing va bitta buyurtma uchun sikl necha marta takrorlanishini kuzating.", ru: "Агент не останавливается на одном действии: после каждого Действия он смотрит на результат и выбирает следующий шаг. Нажмите кнопку и проследите, сколько раз повторится цикл для одного заказа." })}</Mentor>
        <div className="ag-cyc fade-up delay-1">
          <p className="ag-goal"><b>{tr({ uz: 'Maqsad:', ru: "Цель:" })}</b> {tr({ uz: 'Buyurtmani qabul qilish', ru: "Принять заказ" })}</p>
          <div className="ag-cyc-flow">
            {PHASES.map((p, i) => <React.Fragment key={p.id}><span className={`ag-cyc-node ${curPhase === p.id ? 'on' : ''}`}>{tr(p.label)}</span>{i < PHASES.length - 1 && <span className="ag-cyc-arr" aria-hidden="true">→</span>}</React.Fragment>)}
            <span className="ag-cyc-ret" aria-hidden="true">↻</span>
            {step >= 3 && <><span className="ag-cyc-back" aria-hidden="true" /><span className="ag-cyc-head" aria-hidden="true" /></>}
          </div>
        </div>
        <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done} onClick={advance}>{done ? tr({ uz: '✓ Maqsadga yetdi', ru: "✓ Цель достигнута" }) : step === 0 ? tr({ uz: '▶ Siklni boshlash', ru: '▶ Запустить цикл' }) : tr({ uz: 'Keyingi qadam →', ru: 'Следующий шаг →' })}</button>
        {step > 0 && <div className="sk-info fade-step" key={step}><p className="note-h">{tr(curP.label)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{fmtCode(tr(CYCLE_STEPS[step - 1].txt))}</p></div>}
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Sikl ikki marta aylandi: avval tekshirdi, keyin saqladi. Keyingi asbobni agent natijaga qarab o'zi tanladi.", ru: "Цикл прошёл дважды: сначала проверил, потом сохранил. Следующий инструмент агент выбирал сам по результату." })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 (bu qanday bot) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' })}
    questionText="Botdagi AI qadamlarni o'zi tanladi: avval Pepperoni borligini tekshirdi, keyin buyurtmani bazaga yozdi, oxirida yetkazishni rejaladi. Bu qanday bot?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Botdagi AI qadamlarni o'zi tanladi: avval Pepperoni borligini tekshirdi, keyin buyurtmani bazaga yozdi, oxirida yetkazishni rejaladi. <span className="italic" style={{ color: T.accent }}>Bu qanday bot?</span></>, ru: <>ИИ в боте сам выбрал шаги: сначала проверил, есть ли Пепперони, потом записал заказ в базу, а в конце запланировал доставку. <span className="italic" style={{ color: T.accent }}>Что это за бот?</span></> })}</h2></>}
    options={[tr({ uz: "AI-bot — AI javob matnini yozib beradi", ru: "ИИ-бот — ИИ пишет текст ответа" }), tr({ uz: "Oddiy skript — bir marta ishlab, to'xtaydi", ru: "Обычный скрипт — сработает один раз и остановится" }), tr({ uz: "AI-agent — maqsad sari asboblarni ishlatadi", ru: "ИИ-агент — использует инструменты, чтобы достичь цели" }), tr({ uz: "Handlerli bot — oldindan yozilgan javob beradi", ru: "Бот с handler-ами — даёт заранее написанный ответ" })]} correctIdx={2}
    explainCorrect={tr({ uz: "Qadamlarni AI o'zi tanladi va har qadamda asbob chaqirdi — bu AI-agent.", ru: "ИИ сам выбрал шаги и на каждом шаге вызывал инструмент — это ИИ-агент." })}
    explainWrong={{
      0: tr({ uz: "AI-bot faqat javob matnini yozadi — bazaga yozish yoki yetkazishni rejalash uchun asbob chaqirmaydi.", ru: "ИИ-бот только пишет текст ответа — он не вызывает инструменты, чтобы записать заказ в базу или запланировать доставку." }),
      1: tr({ uz: "Oddiy skript bir marta yuqoridan pastga ishlaydi va qadamlarni o'zi tanlamaydi. Bu yerda qadamlarni AI tanladi.", ru: "Обычный скрипт один раз выполняется сверху вниз и сам шаги не выбирает. Здесь шаги выбрал ИИ." }),
      3: tr({ uz: "Handlerli botda har hodisaga javobni siz oldindan yozasiz. Bu yerda esa qadamlarni AI o'zi tanladi.", ru: "В боте с handler-ами ответ на каждое событие вы пишете заранее. А здесь шаги ИИ выбрал сам." }),
      default: tr({ uz: "Qadamlarni AI o'zi tanlab, asboblarni chaqirgan bo'lsa — bu AI-agent.", ru: "Если ИИ сам выбрал шаги и вызвал инструменты — это ИИ-агент." })
    }} />
);

// ===== SCREEN 5 — AGENTNI QURISH (maqsad → asboblar → chegara, navbat bilan) → nishon cycleBuilder =====
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  // choice: { qator id → variant id }; qatorni faqat `ok` variant yopadi (nishon sharti — variant bo'yicha, indeks emas)
  const [choice, setChoice] = useState(() => storedAnswer ? Object.fromEntries(AGENT_BUILD.map(r => [r.id, buildOk(r).id])) : {});
  const [wrongPick, setWrongPick] = useState(null);
  const wrongEverRef = useRef(!!(storedAnswer && storedAnswer.correct === false));
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const chosen = (r) => r.opts.find(o => o.id === choice[r.id]);
  const rowDone = (r) => { const o = chosen(r); return !!(o && o.ok); };
  const done = AGENT_BUILD.every(rowDone);
  const curRow = AGENT_BUILD.find(r => !rowDone(r));
  const pick = (row, opt) => {
    if (opt.ok) { setChoice(c => ({ ...c, [row.id]: opt.id })); setWrongPick(null); }
    else { wrongEverRef.current = true; if (achMiss) achMiss.miss(screen); setWrongPick({ row: row.id, opt: opt.id, k: Date.now() }); }
    setSc(n => n + 1);
  };
  const reopen = (row) => { setChoice(c => { const n = { ...c }; delete n[row.id]; return n; }); setWrongPick(null); setSc(n => n + 1); };
  useEffect(() => { if (done && !fired.current) { fired.current = true; onAnswer(screen, { stage: 'builder', screenIdx: screen, correct: !wrongEverRef.current, picked: true, solved: true }); } }, [done]);
  const errOpt = wrongPick && curRow && wrongPick.row === curRow.id ? curRow.opts.find(o => o.id === wrongPick.opt) : null;
  return (
    <Stage eyebrow={tr({ uz: 'Markaziy · qurish', ru: 'Ключевое · сборка' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Agentni yig'ing", ru: 'Соберите агента' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Agentni quring: <span className="italic" style={{ color: T.accent }}>maqsad, asboblar, chegara</span>.</>, ru: <>Соберите агента: <span className="italic" style={{ color: T.accent }}>цель, инструменты, ограничение</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Agentga uch narsani siz berasiz: nima qilsin (maqsad), nima bilan qilsin (asboblar), nimani so'ramasdan qilmasin (chegara). Har qatorda mos variantni tanlang.", ru: "Три вещи агенту даёте вы: что делать (цель), чем делать (инструменты), чего не делать без спроса (ограничение). В каждой строке выберите подходящий вариант." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            {AGENT_BUILD.map(r => {
              if (rowDone(r)) return (
                <div key={r.id} className="ag-done-row fade-step">
                  <span className="ag-done-t"><b>{tr(r.q).replace('?', ':')}</b> {tr(chosen(r).t)}</span>
                  <span className="ag-done-ok" aria-hidden="true">✓</span>
                  {!done && <button className="ag-redo" onClick={() => reopen(r)} aria-label={tr({ uz: "O'zgartirish", ru: "Изменить" })}>↻</button>}
                </div>
              );
              if (r !== curRow) return null;
              return (
                <div key={r.id} className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <p className="flow-label">{tr(r.q)}</p>
                  {r.opts.map(o => {
                    const bad = !!(errOpt && errOpt.id === o.id);
                    return (<button key={o.id} className={`pick-row ${bad ? 'bad shake' : ''}`} onClick={() => pick(r, o)}><span className={r.id === 'tools' ? 'mono' : undefined} style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>{tr(o.t)}</span><span className="pick-plus">{bad ? '✗' : '▶'}</span></button>);
                  })}
                  {errOpt && <div className="frame-warn fade-step" key={wrongPick.k}><p className="body" style={{ margin: 0, color: T.ink }}>{tr(errOpt.err)}</p></div>}
                </div>
              );
            })}
          </Col>
          <Col>
            <PromptCard tone={done ? 'live' : ''}>
              {AGENT_BUILD.map(r => <p key={r.id} className="ag-pc-row"><span className="ag-pc-k">{tr(r.k)}</span> {rowDone(r) ? tr(chosen(r).t) : '…'}</p>)}
            </PromptCard>
            {!done && <AchRule screen={screen} />}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Agent tayyor. Amaliyotda shu uch qismni o'zingiz yozasiz.", ru: "Агент готов. В практике вы напишете эти три части сами." })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 6 — ASBOB NIMA (5 asbob) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(TOOLS.map(t => t.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= TOOLS.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = TOOLS.find(t => t.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · asbob', ru: "Понятие · инструмент" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `5 asbobni oching (${seen.size}/5)`, ru: `Откройте 5 инструментов (${seen.size}/5)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Asbob (tool) — agent chaqira oladigan <span className="italic" style={{ color: T.accent }}>funksiya</span>.</>, ru: <>Инструмент (tool) — <span className="italic" style={{ color: T.accent }}>функция</span>, которую агент может вызвать.</> })}</h2></div>
        <Mentor>{tr({ uz: "Asbobni siz yozasiz — oddiy JS funksiya, xuddi handler ichidagi kod kabi. AI o'zi faqat matn yozadi; bazaga yozish yoki kartadan pul yechishni asbob bajaradi. Har asbobni bosing.", ru: "Инструмент пишете вы — это обычная JS-функция, как код внутри handler. Сам ИИ только пишет текст, а записывает в базу или списывает деньги с карты инструмент. Нажмите на каждый инструмент." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {TOOLS.map(t => <button key={t.id} className={`gchip ${seen.has(t.id) ? 'seen' : 'tap-wave'} ${active === t.id ? 'cur' : ''}`} onClick={() => tap(t.id)}><span className="mono">{t.tok}</span><span className="ag-chev" aria-hidden="true">{seen.has(t.id) ? '✓' : '›'}</span></button>)}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Agent faqat siz bergan asboblar bilan ishlaydi. Pul yechish va bekor qilishga chegara qo'yiladi — xato qimmat.", ru: "Агент работает только с вашими инструментами. На списание денег и отмену ставят ограничение — ошибка дорога." })}</p></div>}
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="note-h"><span className="mono" style={{ color: T.accent, fontSize: 13 }}>{cur.tok}</span></p><p className="body" style={{ margin: '6px 0 0', color: T.ink }}>{tr(cur.desc)}</p></div>
              : null}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — QAROR: vaziyatga mos asbob → nishon toolPicker =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [idx, setIdx] = useState(storedAnswer ? SITUATIONS.length : 0);
  const [wrong, setWrong] = useState(null);
  const [shakeId, setShakeId] = useState(null);
  const wrongEverRef = useRef(!!(storedAnswer && storedAnswer.correct === false));
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const done = idx >= SITUATIONS.length;
  useEffect(() => { if (done && !fired.current) { fired.current = true; onAnswer(screen, { stage: 'central', screenIdx: screen, correct: !wrongEverRef.current, picked: true, solved: true }); } }, [done]);
  const cur = done ? null : SITUATIONS[idx];
  const choose = (toolId) => {
    if (done) return;
    if (toolId === cur.tool) { setWrong(null); setIdx(n => n + 1); setSc(n => n + 1); }
    else { wrongEverRef.current = true; if (achMiss) achMiss.miss(screen); setWrong(toolId); setShakeId(toolId); setTimeout(() => setShakeId(w => (w === toolId ? null : w)), 450); setSc(n => n + 1); }
  };
  const pickTools = TOOL_PICK_ORDER.map(id => TOOLS.find(t => t.id === id));
  return (
    <Stage eyebrow={tr({ uz: 'Qaror · asbob tanlash', ru: "Решение · выбор инструмента" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Asbobni tanlang (${idx}/${SITUATIONS.length})`, ru: `Выберите инструмент (${idx}/${SITUATIONS.length})` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaror qadami: vaziyatga <span className="italic" style={{ color: T.accent }}>mos asbobni</span> tanlang.</>, ru: <>Решение: выберите <span className="italic" style={{ color: T.accent }}>подходящий инструмент</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Haqiqiy agentda qaysi asbobni chaqirishni AI tanlaydi. Hozir uning o'rnida siz tanlang.", ru: "В настоящем агенте, какой инструмент вызвать, выбирает ИИ. Сейчас выберите вы вместо него." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={cur.id}><p className="note-h" style={{ color: T.accent }}>{tr({ uz: 'Vaziyat', ru: "Ситуация" })} {idx + 1}/{SITUATIONS.length}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.sit)}</p></div>
              : <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Siz vaziyatni ko'rdingiz (Idrok) va asbobni tanladingiz (Qaror) — uni chaqirish esa Amal.", ru: "Вы увидели ситуацию (Восприятие) и выбрали инструмент (Решение), а вызвать его — это Действие." })}</p></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Avval qaysi asbob kerak?', ru: "Какой инструмент нужен сначала?" })}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {pickTools.map(t => (
                <button key={t.id} className={`pick-row ${shakeId === t.id ? 'shake' : ''}`} disabled={done} onClick={() => choose(t.id)}>
                  <span className="mono" style={{ flex: 1 }}>{t.tok}</span><span className="pick-plus">▶</span>
                </button>
              ))}
            </div>
            {!done && <AchRule screen={screen} />}
            {wrong && !done && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Bu vaziyatga boshqa asbob kerak — vaziyatni qayta o'qing.", ru: "Для этой ситуации нужен другой инструмент — перечитайте её." })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST 2 (agent ishni qanday bajaradi) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' })}
    questionText="AI-agent ishni qanday bajaradi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>AI-agent ishni qanday <span className="italic" style={{ color: T.accent }}>bajaradi</span>?</>, ru: <>Как ИИ-агент <span className="italic" style={{ color: T.accent }}>выполняет</span> работу?</> })}</h2></>}
    options={[tr({ uz: "Maqsadga mos asbobni tanlab chaqiradi", ru: "Выбирает подходящий для цели инструмент и вызывает его" }), tr({ uz: "Faqat matn yozib beradi, ishni odam qiladi", ru: "Только пишет текст, а работу делает человек" }), tr({ uz: "Kod yozilmasa ham, o'zi bajarib qo'yadi", ru: "Сам всё сделает, даже если код не написан" }), tr({ uz: "Oldindan belgilangan bitta amalni takrorlaydi", ru: "Повторяет одно заранее заданное действие" })]} correctIdx={0}
    explainCorrect={tr({ uz: "AI asbobni tanlaydi, uni esa siz yozgan kod bajaradi.", ru: "ИИ выбирает инструмент, а выполняет его код, который написали вы." })}
    explainWrong={{
      1: tr({ uz: "Faqat matn yozish — bu AI-bot. Agent asbob chaqirib, ishni o'zi bajaradi.", ru: "Только писать текст — это ИИ-бот. Агент вызывает инструмент и сам выполняет работу." }),
      2: tr({ uz: "Asboblar — siz yozgan oddiy funksiyalar. Ularsiz agent bazaga ham, kuryerga ham yeta olmaydi.", ru: "Инструменты — это обычные функции, которые написали вы. Без них агент не доберётся ни до базы, ни до курьера." }),
      3: tr({ uz: "Agent vaziyatga qarab har xil asbobni tanlaydi. Doim bitta amalni takrorlash — agent emas.", ru: "Агент по ситуации выбирает разные инструменты. Всё время повторять одно действие — это не агент." }),
      default: tr({ uz: "Agent maqsadga mos asbobni tanlab chaqiradi.", ru: 'Агент выбирает подходящий цели инструмент и вызывает его.' })
    }} />
);

// ===== SCREEN 9 — PUL YECHISHDAN OLDIN (tasdiq) → nishon guardKeeper =====
const SUM_450 = "450 000 so'm";
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [choice, setChoice] = useState(storedAnswer ? (storedAnswer.picked ?? 'confirm') : null);
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const done = choice !== null;
  useEffect(() => { if (done && !fired.current) { fired.current = true; onAnswer(screen, { stage: 'central', screenIdx: screen, correct: choice === 'confirm', picked: choice, solved: true }); } }, [done, choice]);
  const pick = (v) => { if (choice !== null) return; if (v !== 'confirm' && achMiss) achMiss.miss(screen); setChoice(v); setSc(n => n + 1); };
  return (
    <Stage eyebrow={tr({ uz: 'Xavfsizlik · tasdiq', ru: "Безопасность · подтверждение" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Qarorni tanlang", ru: 'Выберите решение' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Agent pul yechmoqchi. <span className="italic" style={{ color: T.accent }}>Qanday qilish to'g'ri?</span></>, ru: <>Агент хочет списать деньги. <span className="italic" style={{ color: T.accent }}>Как сделать правильно?</span></> })}</h2></div>
        <Mentor>{tr({ uz: "Agent asbob bilan real ish qiladi, jumladan pul yechadi. Xato qilsa, pul ham haqiqatan yechiladi. Vaziyatni o'qing va tanlang.", ru: "Агент с помощью инструментов делает настоящую работу, в том числе списывает деньги. Если он ошибётся, деньги тоже спишутся по-настоящему. Прочитайте ситуацию и выберите." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="sk-info"><p className="note-h" style={{ color: T.accent }}>{tr({ uz: 'Vaziyat', ru: "Ситуация" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Mijoz 5 ta katta pitsa buyurdi. Agent <code className="qcode">chargeCard()</code> bilan uning kartasidan <b>{SUM_450}</b> yechmoqchi.</>, ru: <>Клиент заказал 5 больших пицц. Агент хочет с помощью <code className="qcode">chargeCard()</code> списать с его карты <b>450 000 сумов</b>.</> })}</p></div>
          </Col>
          <Col>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <button className={`pick-row ${choice === 'auto' ? 'bad' : ''}`} disabled={choice !== null} onClick={() => pick('auto')}><span style={{ flex: 1 }}>{tr({ uz: "Mijoz o'zi buyurdi — agent tasdiqsiz yechaversin", ru: "Клиент сам заказал — пусть агент списывает без подтверждения" })}</span><span className="pick-plus">{choice === 'auto' ? '✗' : '▶'}</span></button>
              <button className={`pick-row ${choice === 'confirm' ? 'picked' : ''}`} disabled={choice !== null} onClick={() => pick('confirm')}><span style={{ flex: 1 }}>{tr({ uz: "Yechishdan oldin mijozdan summani tasdiqlatsin", ru: "Пусть перед списанием клиент подтвердит сумму" })}</span><span className="pick-plus">{choice === 'confirm' ? '✓' : '▶'}</span></button>
            </div>
            <AchRule screen={screen} once />
            {done && choice === 'confirm' && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Agent 5 o'rniga 15 deb tushungan bo'lsa ham, tasdiq xatoni pul yechilmasdan to'xtatadi.", ru: "Даже если агент понял 15 вместо 5, подтверждение остановит ошибку до списания денег." })}</p></div>}
            {done && choice === 'auto' && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Mijoz summani tasdiqlamagan: xato — ortiqcha pul ketadi.", ru: "Клиент не подтвердил сумму: ошибка — спишутся лишние деньги." })}</p></div>}
            {done && choice === 'confirm' && (
              <div className="ag-seq">
                <div className="ag-seq-head"><span>{tr({ uz: 'Agent', ru: "Агент" })}</span><span>{tr({ uz: 'Mijoz', ru: "Клиент" })}</span></div>
                <div className="ag-seq-row"><span className="ag-seq-msg">{tr({ uz: `«${SUM_450} yechilsinmi?»`, ru: '«Списать 450 000 сумов?»' })}</span><i className="ag-seq-line to-r" aria-hidden="true" /></div>
                <div className="ag-seq-row"><span className="ag-seq-msg">{tr({ uz: '«Ha»', ru: "«Да»" })}</span><i className="ag-seq-line to-l" aria-hidden="true" /></div>
                <div className="ag-seq-call"><code className="qcode">chargeCard()</code></div>
              </div>
            )}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TEST 3 (Amaldan keyin) =====
const Screen10 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' })}
    questionText="Agentning maqsadi — buyurtmani qabul qilib, yetkazishga tayyorlash. U buyurtmani saqladi. Endi nima qiladi?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Agentning maqsadi — buyurtmani qabul qilib, yetkazishga tayyorlash. U buyurtmani <span className="italic" style={{ color: T.accent }}>saqladi</span>. Endi nima qiladi?</>, ru: <>Цель агента — принять заказ и подготовить его к доставке. Он <span className="italic" style={{ color: T.accent }}>сохранил</span> заказ. Что он сделает дальше?</> })}</h2></>}
    options={[tr({ uz: "Mijozga «qabul qilindi» deb yozib, ishni tugatadi", ru: "Напишет клиенту «заказ принят» и закончит работу" }), tr({ uz: "Mijoz keyingi buyruq yozishini kutib turadi", ru: "Будет ждать, пока клиент напишет следующую команду" }), tr({ uz: "Buyurtmani yana bir marta bazaga yozadi", ru: "Ещё раз запишет заказ в базу" }), tr({ uz: "Natijani ko'radi va keyingi qadamni tanlaydi", ru: 'Смотрит на результат и выбирает следующий шаг' })]} correctIdx={3}
    explainCorrect={tr({ uz: "Yetkazish hali rejalanmagan — maqsadga yetmadi, shuning uchun agent keyingi qadamni tanlaydi.", ru: "Доставка ещё не запланирована — цель не достигнута, поэтому агент выбирает следующий шаг." })}
    explainWrong={{
      0: tr({ uz: "Yetkazish hali rejalanmagan: maqsadga yetmay turib ish tugamaydi.", ru: "Доставка ещё не запланирована: пока цель не достигнута, работа не закончена." }),
      1: tr({ uz: "Keyingi buyruqni kutish — AI-botning ishi. Agent keyingi qadamni o'zi tanlaydi.", ru: "Ждать следующую команду — это работа ИИ-бота. Агент сам выбирает следующий шаг." }),
      2: tr({ uz: "Buyurtma allaqachon saqlangan — natijani ko'rgan agent uni qayta yozmaydi.", ru: "Заказ уже сохранён — агент видит результат и второй раз его не записывает." }),
      default: tr({ uz: "Agent natijani ko'radi va maqsadga yetguncha sikl davom etadi.", ru: "Агент смотрит на результат, и цикл продолжается, пока цель не достигнута." })
    }} />
);

// ===== SCREEN 11 — AMAL XAVFSIZLIGI (navbat bilan, bitta urinish) → nishon safeActor =====
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [ans, setAns] = useState(() => storedAnswer ? (storedAnswer.actAnswers || { a1: false, a2: true, a3: false }) : {});
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const done = ACT_SAFETY.every(a => ans[a.id] !== undefined);
  const allCorrect = ACT_SAFETY.every(a => ans[a.id] === a.danger);
  const curA = ACT_SAFETY.find(a => ans[a.id] === undefined);
  useEffect(() => { if (done && !fired.current) { fired.current = true; onAnswer(screen, { stage: 'central', screenIdx: screen, correct: allCorrect, picked: true, solved: true, actAnswers: ans }); } }, [done, allCorrect]);
  const mark = (id, val) => { if (ans[id] !== undefined) return; const a = ACT_SAFETY.find(x => x.id === id); if (a && val !== a.danger && achMiss) achMiss.miss(screen); setAns(prev => ({ ...prev, [id]: val })); setSc(n => n + 1); };
  const L_SELF = { uz: "O'zi", ru: "Сам" };
  const L_CONF = { uz: 'Tasdiq kerak', ru: "Нужно подтверждение" };
  return (
    <Stage eyebrow={tr({ uz: 'Markaziy · xavfsizlik', ru: 'Ключевое · безопасность' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Har amalni belgilang (${Object.keys(ans).length}/3)`, ru: `Отметьте каждое действие (${Object.keys(ans).length}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaysi amalga <span className="italic" style={{ color: T.accent }}>odam tasdig'i</span> kerak?</>, ru: <>Какому действию нужно <span className="italic" style={{ color: T.accent }}>подтверждение человека</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "Har amalni belgilang: agent uni o'zi bajarsinmi yoki avval odamdan tasdiq so'rasinmi? Har qatorda bitta urinish.", ru: "Отметьте каждое действие: агент выполнит его сам или сначала спросит подтверждение у человека? В каждой строке одна попытка." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            {ACT_SAFETY.map(a => {
              const v = ans[a.id];
              if (v !== undefined) return (
                <div key={a.id} className={`claim-row done ${v === a.danger ? 'ok' : 'bad'} fade-step`}>
                  <span className="claim-txt">{tr(a.text)}</span>
                  <span className="ag-claim-res">{v === a.danger ? '✓' : '✕'} {tr(v ? L_CONF : L_SELF)}</span>
                </div>
              );
              if (a !== curA) return null;
              return (
                <div key={a.id} className="claim-row fade-step">
                  <span className="claim-txt">{tr(a.text)}</span>
                  <span className="claim-btns">
                    <button className="claim-btn pick" onClick={() => mark(a.id, false)}>{tr(L_SELF)}</button>
                    <button className="claim-btn pick" onClick={() => mark(a.id, true)}>{tr(L_CONF)}</button>
                  </span>
                </div>
              );
            })}
            <AchRule screen={screen} once />
          </Col>
          <Col>
            {!done ? null
              : allCorrect ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Tekshirish va saqlash tasdiqsiz bajariladi; bekor qilish buyurtmani yo'qotadi — uni odam tasdiqlaydi.", ru: "Проверка и сохранение идут без подтверждения; отмена удаляет заказ — её подтверждает человек." })}</p></div>
              : <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Bekor qilish buyurtmani yo'qotadi — odam tasdig'i kerak.", ru: "Отмена удаляет заказ — нужно подтверждение человека." })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — AGENT ISHDA (8 qadam) =====
const AGENT_RUN = [
  { kind: 'perceive', phase: { uz: 'Idrok', ru: 'Восприятие' }, txt: { uz: "Mijoz: «2 ta Pepperoni, Chilonzor 5-kvartal». Agent xabarni o'qidi.", ru: "Клиент: «2 Пепперони, Чиланзар 5-квартал». Агент прочитал сообщение." }, tool: null },
  { kind: 'decide', phase: { uz: 'Qaror', ru: 'Решение' }, txt: { uz: "Avval Pepperoni borligini tekshiraman.", ru: "Сначала проверю, есть ли Пепперони." }, tool: 'checkOrder()' },
  { kind: 'act', phase: { uz: 'Amal', ru: 'Действие' }, txt: { uz: "Natija: «Pepperoni bor».", ru: "Результат: «Пепперони есть»." }, tool: 'checkOrder()' },
  { kind: 'decide', phase: { uz: 'Idrok · Qaror', ru: "Восприятие · Решение" }, txt: { uz: "Pepperoni bor, buyurtma hali bazada yo'q → saqlayman.", ru: "Пепперони есть, заказа в базе ещё нет → сохраню." }, tool: 'saveOrder()' },
  { kind: 'act', phase: { uz: 'Amal', ru: 'Действие' }, txt: { uz: "Natija: buyurtma bazaga yozildi.", ru: "Результат: заказ записан в базу." }, tool: 'saveOrder()' },
  { kind: 'decide', phase: { uz: 'Idrok · Qaror', ru: "Восприятие · Решение" }, txt: { uz: "Buyurtma saqlandi, yetkazish hali rejalanmagan → rejalayman.", ru: "Заказ сохранён, доставка ещё не запланирована → запланирую." }, tool: 'arrangeDelivery()' },
  { kind: 'act', phase: { uz: 'Amal', ru: 'Действие' }, txt: { uz: "Natija: kuryer taxminan 30 daqiqada yetkazadi.", ru: "Результат: курьер привезёт примерно через 30 минут." }, tool: 'arrangeDelivery()' },
  { kind: 'done', phase: { uz: 'Maqsadga yetdi', ru: "Цель достигнута" }, txt: { uz: "Buyurtma qabul qilindi va yetkazishga tayyor. Sikl to'xtaydi, mijozga javob ketadi.", ru: "Заказ принят и готов к доставке. Цикл останавливается, клиенту уходит ответ." }, tool: null }
];
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [shown, setShown] = useState(storedAnswer ? AGENT_RUN.length : 0);
  const [sc, setSc] = useState(0);
  const done = shown >= AGENT_RUN.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const advance = () => { if (!done) { setShown(n => n + 1); setSc(n => n + 1); } };
  const calledTools = AGENT_RUN.slice(0, shown).filter(s => s.kind === 'act').map(s => s.tool);
  const curStep = shown > 0 ? AGENT_RUN[shown - 1] : null;
  const isAct = !!(curStep && curStep.kind === 'act');
  // A7: Amal qadamida asbob nomidan «Chaqirilgan asboblar» kartasiga chiziq chiziladi (≤760px da ustunlararo chiziq yo'q)
  const wrapRef = useRef(null), toolRef = useRef(null), chipRef = useRef(null);
  const [wire, setWire] = useState(null);
  useLayoutEffect(() => {
    if (!isAct) { setWire(null); return; }
    const calc = () => {
      const w = wrapRef.current, a = toolRef.current, b = chipRef.current;
      if (!w || !a || !b || window.innerWidth <= 760) { setWire(null); return; }
      const wr = w.getBoundingClientRect(); const k = w.offsetWidth ? wr.width / w.offsetWidth : 1;
      const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
      const x1 = (ar.right - wr.left) / k + 4, y1 = (ar.top + ar.height / 2 - wr.top) / k;
      const x2 = (br.left - wr.left) / k - 4, y2 = (br.top + br.height / 2 - wr.top) / k;
      if (x2 <= x1) { setWire(null); return; }
      setWire({ d: `M${x1},${y1} C${x1 + (x2 - x1) * 0.5},${y1} ${x1 + (x2 - x1) * 0.5},${y2} ${x2},${y2}`, k: shown });
    };
    setWire(null);
    const t = setTimeout(calc, 320); // kartaning kirish harakati tugagach o'lchanadi
    window.addEventListener('resize', calc);
    return () => { clearTimeout(t); window.removeEventListener('resize', calc); };
  }, [shown, isAct]);
  return (
    <Stage eyebrow={tr({ uz: 'Hayotiy · agent ishda', ru: "Из жизни · агент в работе" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Agentni kuzating (${shown}/${AGENT_RUN.length})`, ru: `Следите за агентом (${shown}/${AGENT_RUN.length})` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta xabar — agent ishni <span className="italic" style={{ color: T.accent }}>oxirigacha</span> bajaradi.</>, ru: <>Одно сообщение — агент доводит работу <span className="italic" style={{ color: T.accent }}>до конца</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Bu — siz yig'gan agent: maqsadi buyurtmani qabul qilib, yetkazishga tayyorlash. Tugmani bosing va u har qadamda nima qilishini kuzating.", ru: "Это агент, которого вы собрали: его цель — принять заказ и подготовить его к доставке. Нажмите кнопку и проследите, что он делает на каждом шаге." })}</Mentor>
        <Zoomable><div className="split ag-run" ref={wrapRef}>
          {wire && <svg className="ag-wire" aria-hidden="true"><path key={wire.k} d={wire.d} pathLength="1" /></svg>}
          <Col>
            <p className="flow-label">{tr({ uz: 'Agent qadamlari (mijoz ularni ko\'rmaydi)', ru: "Шаги агента (клиент их не видит)" })}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {AGENT_RUN.slice(0, shown).map((s, i) => i < shown - 1
                ? <div key={i} className="ag-run-row"><span className="lp-check">✓</span><b>{tr(s.phase)}</b>{s.tool && <code className="qcode">{s.tool}</code>}</div>
                : <div key={i} className="sk-info fade-step">
                    <p className="note-h" style={{ margin: '0 0 3px' }}>{tr(s.phase)} {s.tool && <code className="qcode" ref={toolRef} style={{ marginLeft: 6 }}>{s.tool}</code>}</p>
                    <p className="body" style={{ margin: 0, color: T.ink }}>{tr(s.txt)}</p>
                  </div>)}
            </div>
            <button className="btn" style={{ alignSelf: 'flex-start' }} disabled={done} onClick={advance}>{done ? tr({ uz: '✓ Maqsadga yetdi', ru: "✓ Цель достигнута" }) : shown === 0 ? tr({ uz: '▶ Agentni ishga tushirish', ru: '▶ Запустить агента' }) : tr({ uz: 'Keyingi qadam →', ru: 'Следующий шаг →' })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Mijoz ko'radigan chat", ru: "Чат, который видит клиент" })}</p>
            <TgChat title={{ uz: 'AvtoPizza · AI-agent', ru: "AvtoPizza · ИИ-агент" }} status={{ uz: 'agent', ru: "агент" }} minH={90}>
              <Bubble from="user">{tr({ uz: '2 ta Pepperoni, Chilonzor 5-kvartal', ru: "2 Пепперони, Чиланзар 5-квартал" })}</Bubble>
              {done && <Bubble from="bot">{tr({ uz: <>2 ta Pepperoni qabul qilindi. Chilonzor <span style={{ whiteSpace: 'nowrap' }}>5-kvartalga</span> taxminan 30 daqiqada yetkazamiz.</>, ru: <>2 Пепперони приняты. Привезём на Чиланзар <span style={{ whiteSpace: 'nowrap' }}>5-квартал</span> примерно через 30 минут.</> })}</Bubble>}
            </TgChat>
            <div className="sk-info"><p className="note-h">{tr({ uz: 'Chaqirilgan asboblar', ru: "Вызванные инструменты" })}</p>{calledTools.length === 0 ? <p className="body" style={{ margin: 0, color: T.ink3, fontStyle: 'italic' }}>{tr({ uz: "hali yo'q", ru: 'пока нет' })}</p> : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{calledTools.map((t, i) => { const fresh = isAct && i === calledTools.length - 1; return <span key={t} ref={fresh ? chipRef : undefined} className={`ag-called mono ${fresh ? 'fresh' : ''}`}>{t}</span>; })}</div>}</div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Bitta xabarga agent uchta asbobni chaqirdi. Tartibni o'zi tanladi — lekin faqat siz bergan asboblar orasidan.", ru: "На одно сообщение агент вызвал три инструмента. Порядок он выбрал сам — но только из инструментов, которые дали вы." })}</p></div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — CHEGARALAR (3 tur) =====
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(GUARDS.map(g => g.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= GUARDS.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]);
  const cur = GUARDS.find(g => g.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Xavfsizlik · chegara', ru: "Безопасность · ограничение" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `3 chegarani ko'ring (${seen.size}/3)`, ru: `Посмотрите 3 ограничения (${seen.size}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Agent real ish qiladi — unga <span className="italic" style={{ color: T.accent }}>chegara</span> kerak.</>, ru: <>Агент делает настоящую работу — ему нужно <span className="italic" style={{ color: T.accent }}>ограничение</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Chegara (inglizcha guardrail) agent nimani qila olishini va nimani so'ramasdan qilmasligini belgilaydi. Uch turini bosib ko'ring.", ru: "Ограничение (по-английски guardrail) определяет, что агенту можно делать и чего он не делает без спроса. Нажмите на каждый из трёх видов." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {GUARDS.map(g => <button key={g.id} className={`gchip ${seen.has(g.id) ? 'seen' : 'tap-wave'} ${active === g.id ? 'cur' : ''}`} onClick={() => tap(g.id)}>{tr(g.label)}<span className="ag-chev" aria-hidden="true">{seen.has(g.id) ? '✓' : '›'}</span></button>)}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Agentga erkinlik asta-sekin beriladi: avval kam asbob va ko'proq tasdiq, ishonch ortgani sari — ko'proq.", ru: "Свободу агенту дают постепенно: сначала мало инструментов и больше подтверждений, а по мере роста доверия — больше." })}</p></div>}
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="note-h" style={{ margin: '0 0 4px' }}>{tr(cur.label)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.desc)}</p></div>
              : null}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — TEST 4 (pul yechishdan oldin) =====
const Screen14 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' })}
    questionText="Agent mijozning kartasidan pul yechishidan oldin nima muhim?"
    question={<><p className="eyebrow" style={{ color: T.accent }}>{tr({ uz: "To'g'ri javobni tanlang", ru: 'Выберите верный ответ' })}</p><h2 className="title h-ask" style={{ marginTop: 8 }}>{tr({ uz: <>Agent mijozning kartasidan <span className="italic" style={{ color: T.accent }}>pul yechishidan</span> oldin nima muhim?</>, ru: <>Что важно, прежде чем агент <span className="italic" style={{ color: T.accent }}>спишет деньги</span> с карты клиента?</> })}</h2></>}
    options={[tr({ uz: "Unga hamma ishda to'liq erkinlik berib qo'yish", ru: "Дать ему полную свободу во всём" }), tr({ uz: "Faqat kerakli asboblarni berish va tasdiq so'ratish", ru: "Дать только нужные инструменты и требовать подтверждение" }), tr({ uz: "Pul yechilgach, mijozga xabar yuborib qo'yish", ru: "После списания отправить клиенту сообщение" }), tr({ uz: "Javob berish tezligini iloji boricha oshirish", ru: "Как можно сильнее ускорить ответ" })]} correctIdx={1}
    explainCorrect={tr({ uz: "Xato pul yechilmasdan oldin to'xtashi kerak — chegara shuning uchun.", ru: "Ошибка должна остановиться до списания денег — для этого и нужно ограничение." })}
    explainWrong={{
      0: tr({ uz: "To'liq erkinlik xavfli: agent xato qilsa, pul haqiqatan yechiladi. Chegara kerak.", ru: "Полная свобода опасна: если агент ошибётся, деньги спишутся по-настоящему. Нужно ограничение." }),
      2: tr({ uz: "Xabar pul yechilgandan keyin ketadi — xatoni to'xtata olmaydi. Tasdiq pul yechilishidan oldin so'raladi.", ru: "Сообщение уходит после списания — ошибку оно не остановит. Подтверждение спрашивают до списания денег." }),
      3: tr({ uz: "Bu yerda tezlik asosiy emas — xavfsizlik muhim: kerakli asboblar va tasdiq.", ru: "Здесь главное не скорость, а безопасность: нужные инструменты и подтверждение." }),
      default: tr({ uz: "Pul yechishdan oldin chegara kerak: faqat kerakli asboblar va odam tasdig'i.", ru: "Перед списанием денег нужно ограничение: только нужные инструменты и подтверждение человека." })
    }} />
);

// ===== SCREEN 15 — YAKUNIY: agent qanday ishlashini yig'ish =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [solved, setSolved] = useState(!!storedAnswer);
  const fired = useRef(!!storedAnswer);
  // Ball — birinchi TO'LIQ urinish (MCQ bilan bir xil o'lchov, 8-A): hamma katak to'lib tartib xato chiqsa — urinish xato
  const achMiss = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const isMentorLive = !!(gate.live && gate.live.mode === 'mentor');
  const wrongEverRef = useRef(false);
  const [hadWrong, setHadWrong] = useState(false);
  const onWrong = () => { wrongEverRef.current = true; setHadWrong(true); if (achMiss) achMiss.miss(screen); };
  const onSolved = () => { if (!fired.current) { fired.current = true; setSolved(true); const first = !wrongEverRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id)); onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Oxirgi qadam: agent qanday ishlashini to'g'ri tartibda yig'ing.", correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 }); } };
  const [recapOpen, setRecapOpen] = useState(false);
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Финал · практика' })} screen={screen} scrollSignal={solved ? 1 : 0} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!solved} label={solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Tartibni yig'ing", ru: "Соберите порядок" })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: agent ishini <span className="italic" style={{ color: T.accent }}>tartibga</span> soling.</>, ru: <>Последний шаг: расставьте работу агента <span className="italic" style={{ color: T.accent }}>по порядку</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Bo'laklarni sudrab to'g'ri tartibga qo'ying.", ru: "Перетащите блоки в правильном порядке." })}</Mentor>
        <DragDropOrder
          items={FLOW_ITEMS}
          hints={[{ uz: '1-qadam', ru: 'Шаг 1' }, { uz: '2-qadam', ru: 'Шаг 2' }, { uz: '3-qadam', ru: 'Шаг 3' }, { uz: '4-qadam', ru: 'Шаг 4' }, { uz: '5-qadam', ru: 'Шаг 5' }]}
          onSolved={onSolved}
          onWrong={onWrong}
          loopFrom={4}
          loopTo={1}
        />
        {hadWrong && !solved && !isMentorLive && RECAPS[screen] && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — взглянуть на тему ещё раз" })}</button>}
        {solved && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Tartib to'g'ri: maqsadga yetmaguncha agent yana Idrok'ka qaytadi.", ru: "Порядок верный: пока цель не достигнута, агент снова возвращается к Восприятию." })}</p></div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  cycleBuilder: { icon: '🧰', name: 'Agent Builder',   desc: { uz: "Agentga maqsad, asboblar va chegara berdingiz", ru: "Вы дали агенту цель, инструменты и ограничение" } },
  toolPicker:   { icon: '🔧', name: 'Tool Picker',     desc: { uz: "Har vaziyatga mos asbobni tanladingiz", ru: "Вы выбрали подходящий инструмент для каждой ситуации" } },
  guardKeeper:  { icon: '🛡️', name: 'Guardrail Keeper', desc: { uz: "Pul yechishdan oldin tasdiq so'rashni tanladingiz", ru: "Вы решили спрашивать подтверждение перед списанием денег" } },
  safeActor:    { icon: '✋', name: 'Safe Actor',       desc: { uz: "Qaysi amalga odam tasdig'i kerakligini to'g'ri belgiladingiz", ru: "Вы верно отметили, какому действию нужно подтверждение человека" } },
};
// Ekran id → nishon. ❗ FAQAT ma'noli, real-xato-imkonli ekranlar: s5 (builder — noto'g'ri chip tanlansa
// `wrongEverRef` yonadi va `correct:false` ketadi) · s7 (case — nomzodlardan noto'g'risini tanlash mumkin) ·
// s9 (central — noto'g'ri variant ham tanlanishi mumkin) · s11 (belgilash — barcha element noto'g'ri belgilanishi mumkin).
// Exploration/toggle ekranlarga BOG'LANMAYDI (ular har bosishda correct:true qaytaradi — nishon tekin bo'lmasin).
const ACH_TRIGGERS = { s5: 'cycleBuilder', s7: 'toolPicker', s9: 'guardKeeper', s11: 'safeActor' };

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
const Q_LABELS = {
  4: { uz: '1 — AI-agent nima', ru: "1 — Что такое ИИ-агент" },
  8: { uz: '2 — Asbob', ru: "2 — Инструмент" },
  10: { uz: '3 — Amaldan keyin', ru: "3 — После Действия" },
  14: { uz: '4 — Chegara', ru: "4 — Ограничение" },
  15: { uz: '5 — Agent sikli', ru: '5 — Цикл агента' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si (AI-agent atamalari)
const QZ_BG_SHAPES = [
  { ch: 'agent',   l: 5,  t: 10, s: 32, d: 19, dl: 0 },
  { ch: 'asbob',   l: 82, t: 8,  s: 28, d: 23, dl: 1.5 },
  { ch: 'maqsad',  l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'idrok',   l: 76, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: 'qaror',   l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: 'amal',    l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: 'chegara', l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: 'sikl',    l: 55, t: 5,  s: 22, d: 22, dl: 0.6 },
  { ch: '✗',       l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '✓',       l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
];
// ⚡ Mustahkamlash-jang savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3, mexanik ketma-ketlik yo'q).
// 🎓 Metodist: savol matni va variant uzunliklari sayqallanadi · ⚡ Jonli: `correct` qiymatlari INLINE_KEYS bilan sinxron tekshiriladi.
const QUIZ_BANK = [
  { q: { uz: "AI-bot va AI-agentning asosiy farqi nima?", ru: "В чём главная разница между ИИ-ботом и ИИ-агентом?" }, opts: [{ uz: "Agentning rangi va shrifti boshqacha bo'ladi", ru: "У агента другой цвет и шрифт" }, { uz: "Agent maqsad sari qadamlarni o'zi tanlaydi", ru: "Агент сам выбирает шаги к цели" }, { uz: "Ular orasida hech qanday farq yo'q", ru: "Между ними нет никакой разницы" }, { uz: "Agent botdan ancha sekin ishlaydi", ru: "Агент работает намного медленнее бота" }], correct: 1 },
  { q: { uz: "Agent siklidagi «Amal» qadami nima?", ru: "Что такое шаг «Действие» в цикле агента?" }, opts: [{ uz: "Mijozning keyingi xabarini kutish", ru: "Ждать следующее сообщение клиента" }, { uz: "Salom berib, menyuni yuborish", ru: "Поздороваться и отправить меню" }, { uz: "O'zini o'chirib, ishni to'xtatish", ru: "Выключить себя и остановить работу" }, { uz: "Tanlangan asbobni chaqirish", ru: "Вызвать выбранный инструмент" }], correct: 3 },
  { q: { uz: "Asbob (tool) nima?", ru: "Что такое инструмент (tool)?" }, opts: [{ uz: "Agent chaqira oladigan funksiya", ru: "Функция, которую агент может вызвать" }, { uz: "Botning rang va shrift sozlamasi", ru: 'Настройка цвета и шрифта бота' }, { uz: "Server joylashgan IP-manzil", ru: "IP-адрес, где находится сервер" }, { uz: "Internetga ulanish tezligi", ru: 'Скорость подключения к интернету' }], correct: 0 },
  { q: { uz: "Agent qaysi asbobni chaqirishni qanday tanlaydi?", ru: "Как агент выбирает, какой инструмент вызвать?" }, opts: [{ uz: "Ro'yxatdagi birinchi asbobni oladi", ru: "Берёт первый инструмент в списке" }, { uz: "AI tasodifan, tavakkaliga tanlaydi", ru: "ИИ выбирает случайно, наугад" }, { uz: "AI maqsad va vaziyatga qarab tanlaydi", ru: "ИИ выбирает по цели и ситуации" }, { uz: "Har safar odam qo'lda tanlab beradi", ru: "Каждый раз вручную выбирает человек" }], correct: 2 },
  { q: { uz: "Agent bitta amalni bajardi. Endi nima qiladi?", ru: 'Агент выполнил одно действие. Что дальше?' }, opts: [{ uz: "Ish tugadi deb, shu zahoti to'xtaydi", ru: "Решает, что работа закончена, и сразу останавливается" }, { uz: "Natijani ko'rib, keyingi qadamni tanlaydi", ru: "Смотрит на результат и выбирает следующий шаг" }, { uz: "O'sha amalni yana bir marta bajaradi", ru: "Выполняет то же действие ещё раз" }, { uz: "Mijoz keyingi buyruq yozishini kutadi", ru: "Ждёт, пока клиент напишет следующую команду" }], correct: 1 },
  { q: { uz: "Agentga siz qaysi uch narsani berasiz?", ru: "Какие три вещи вы даёте агенту?" }, opts: [{ uz: "Maqsad, asboblar va chegara", ru: "Цель, инструменты и ограничение" }, { uz: "Faqat system prompt: qanday javob yozsin", ru: "Только system prompt: каким писать ответ" }, { uz: "Har hodisa uchun tayyor javob matni", ru: "Готовый текст ответа на каждое событие" }, { uz: "Bot tokeni va server manzili", ru: "Токен бота и адрес сервера" }], correct: 0 },
  { q: { uz: "Chegara (guardrail) nima uchun kerak?", ru: "Зачем нужно ограничение (guardrail)?" }, opts: [{ uz: "Botni chiroyliroq ko'rsatish uchun", ru: "Чтобы бот выглядел красивее" }, { uz: "Javob tezligini oshirish uchun", ru: "Чтобы ускорить ответ" }, { uz: "Mijozga rang tanlab berish uchun", ru: "Чтобы подобрать клиенту цвет" }, { uz: "Agentni xavfli amaldan to'xtatish uchun", ru: "Чтобы остановить агента перед опасным действием" }], correct: 3 },
  { q: { uz: "Agent pul yechishdan oldin nima qilishi kerak?", ru: "Что агент должен сделать перед списанием денег?" }, opts: [{ uz: "Tasdiqsiz, o'zi yechaverishi", ru: "Списывать сам, без подтверждения" }, { uz: "Odamdan tasdiq so'rashi", ru: "Спросить подтверждение у человека" }, { uz: "Botni o'chirib qo'yishi", ru: "Выключить бота" }, { uz: "Imkon boricha tez yechishi", ru: "Списать как можно быстрее" }], correct: 1 },
  { q: { uz: "Odam nazorati (human-in-the-loop) nimani anglatadi?", ru: "Что означает контроль человека (human-in-the-loop)?" }, opts: [{ uz: "Agent hamma ishni yolg'iz bajaradi", ru: "Агент делает всю работу в одиночку" }, { uz: "Odam jarayonga umuman aralashmaydi", ru: 'Человек вообще не вмешивается в процесс' }, { uz: "Muhim holatda qarorni odam qiladi", ru: "В важной ситуации решение принимает человек" }, { uz: "Mijoz botdan butunlay bloklanadi", ru: "Клиента полностью блокируют в боте" }], correct: 2 },
  { q: { uz: "«Cheklangan asboblar» chegarasi nimani bildiradi?", ru: 'Что означает ограничение «ограниченный набор инструментов»?' }, opts: [{ uz: "Asboblar sekinroq ishlay boshlaydi", ru: "Инструменты начинают работать медленнее" }, { uz: "Hamma asboblar bepul bo'ladi", ru: "Все инструменты становятся бесплатными" }, { uz: "Agentga barcha asboblar beriladi", ru: "Агенту дают все инструменты" }, { uz: "Agentga faqat kerakli asboblar beriladi", ru: "Агенту дают только нужные инструменты" }], correct: 3 },
  { q: { uz: "Agent sikli qaysi tartibda ishlaydi?", ru: "В каком порядке работает цикл агента?" }, opts: [{ uz: "Idrok → Qaror → Amal → yana Idrok", ru: "Восприятие → Решение → Действие → снова Восприятие" }, { uz: "Amal → Idrok → Qaror → yana Amal", ru: "Действие → Восприятие → Решение → снова Действие" }, { uz: "Qaror → Amal → Idrok → yana Qaror", ru: "Решение → Действие → Восприятие → снова Решение" }, { uz: "Idrok → Amal → Qaror → yana Idrok", ru: "Восприятие → Действие → Решение → снова Восприятие" }], correct: 0 },
  { q: { uz: "Agent siklida «Qaror» qadamini kim bajaradi?", ru: "Кто выполняет шаг «Решение» в цикле агента?" }, opts: [{ uz: "Mijoz har safar qo'lda tanlaydi", ru: "Клиент каждый раз выбирает вручную" }, { uz: "Hech kim — qadam o'z-o'zidan o'tadi", ru: "Никто — шаг проходит сам собой" }, { uz: "AI — qaysi asbob kerakligini tanlaydi", ru: "ИИ — выбирает, какой инструмент нужен" }, { uz: "Asbob o'zi hal qiladi, AI faqat kutadi", ru: "Инструмент решает сам, а ИИ только ждёт" }], correct: 2 },
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
    // Arena tokenlari — MD «Arena fonida suzuvchi so'zlar»
    const TOK = ['agent', 'asbob', 'maqsad', 'idrok', 'qaror', 'amal', 'chegara', 'sikl', '✓', '✗'];
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
      if (typeof window !== 'undefined' && !window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nВсё равно закрыть?' }))) return;
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
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме тренировки' })}</button>
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
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Ждите, ментор начнёт тест…' })}</p>}
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
                : <span className="qz-res-t">{my ? tr({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: 'Неверно — 0 баллов. В следующий раз получится! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Будьте быстрее! ⏱' })}</span>}
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
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'самая длинная серия' })} 🔥x${soloScore.maxStreak}` : ''}</p>
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
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест заново — тренировка (в таблицу не идёт)' })}</button>}
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
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
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
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не подключился.' })}</p></div>
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
      <div className="card-lbl" style={{ color: T.blue }}>{tr({ uz: '👀 Kim bajardi —', ru: '👀 Кто выполнил —' })} {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружаем…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не подключился.' })}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.successSoft, color: T.success }}>✓ {p.nickname}</span>)}
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ opacity: 0.6 }}>⏳ {p.nickname}</span>)}
        </div>
      )}
    </div>
  );
};
// Namuna kod kartasi — «Nusxalash» tugmasi bilan (navigator.clipboard; xato bo'lsa jim)
const SampleCard = ({ n, title, code }) => {
  const text = typeof code === 'string' ? code : tr(code);
  const [copied, setCopied] = useState(false);
  const tRef = useRef(0);
  useEffect(() => () => clearTimeout(tRef.current), []);
  const copy = () => {
    try {
      const p = navigator.clipboard && navigator.clipboard.writeText(text);
      if (p && p.then) p.then(() => { setCopied(true); clearTimeout(tRef.current); tRef.current = setTimeout(() => setCopied(false), 1600); }).catch(() => {});
    } catch (e) { /* jim */ }
  };
  return (
    <div className="smp-card fade-up delay-1">
      <div className="smp-head">
        <span className="smp-title">{tr(n)} — <b>{tr(title)}</b></span>
        <button type="button" className={`smp-copy ${copied ? 'ok' : ''}`} onClick={copy}>{copied ? tr({ uz: '✓ Nusxalandi', ru: "✓ Скопировано" }) : tr({ uz: 'Nusxalash', ru: "Копировать" })}</button>
      </div>
      <pre className="smp-code">{text}</pre>
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">✓</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'atama yodlandi', ru: 'терминов запомнено' })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda ·", ru: '↻ Учим ·' })} <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim ·', ru: '✓ Знаю ·' })} <b>{known}</b></span></div>
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

// PRAKTIKA — aistudio.google.com'da haqiqiy asbob chaqiruvi (22-savol A, 01.10): maqsad va chegara — System instructions,
// asboblar — Function calling. Model asbobni chaqiradi, natijani o'quvchi qaytaradi (mentor-gate).
// Namuna ikki tilli: o'quvchi o'z tilidagi matnni nusxalaydi; kalitlar (taom, soni, manzil) bir xil.
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
  <ScreenBlok {...props} eyebrow={{ uz: 'Amaliyot · agent', ru: 'Практика · агент' }} tail="git checkout -f dars-10-done"
    title={{ uz: <>Agentga ikki asbob bering: <span className="italic" style={{ color: T.accent }}>qaysisini</span> chaqiradi?</>, ru: <>Дайте агенту два инструмента: <span className="italic" style={{ color: T.accent }}>какой</span> он вызовет?</> }}
    mentor={{ uz: <>Darsda ko'rgan <code className="qcode">checkOrder</code> va <code className="qcode">saveOrder</code> endi haqiqiy funksiya bo'ladi — chaqirishni agent o'zi hal qiladi; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <><code className="qcode">checkOrder</code> и <code className="qcode">saveOrder</code> с урока станут настоящими функциями — когда их вызвать, решит агент; начните с <b style={{ color: T.ink }}>«1 · Открыть»</b>.</> }}
    steps={[
      { h: { uz: 'Ochish', ru: 'Открыть' }, t: { uz: "Antigravity'da `TelegramBotNest`, `npm run start:dev`. 6-dars kaliti `.env` da.", ru: "В Antigravity — `TelegramBotNest`, `npm run start:dev`. Ключ с 6-го урока в `.env`." } },
      { h: { uz: 'Prompt', ru: 'Промпт' }, t: { uz: "«Nusxalash», Antigravity'ga.", ru: "«Скопировать», в Antigravity." }, prompt: [
        { uz: "AiService ga Gemini function calling qo'sh. Ikki asbob: checkOrder(taom, soni) — taom PITSALAR da bormi, narxini qaytaradi; saveOrder(taom, soni, manzil) — BuyurtmaService.yoz bilan bazaga yozadi.", ru: "Добавь в AiService function calling Gemini. Два инструмента: checkOrder(taom, soni) — есть ли блюдо в PITSALAR, возвращает цену; saveOrder(taom, soni, manzil) — пишет в базу через BuyurtmaService.yoz." },
        { uz: "System prompt'ga: «MAQSAD: buyurtmani qabul qilib bazaga yozish. CHEGARA: taom borligini tekshirmasdan buyurtma yozilmasin.»", ru: "В system prompt: «MAQSAD: принять заказ и записать в базу. CHEGARA: не записывать заказ, не проверив, что блюдо есть.»" },
        { uz: "Model asbob chaqirsa — funksiyani bajar, natijani modelga qaytar, u keyingi qadamni o'zi tanlasin; oxirgi matnni mijozga yoz. Tugmalar va /start o'zgarmasin.", ru: "Если модель вызывает инструмент — выполни функцию, верни результат модели, следующий шаг она выберет сама; итоговый текст отправь клиенту. Кнопки и /start не меняются." }
      ] },
      { h: { uz: 'Ishga tushirish', ru: 'Запустить' }, t: { uz: "terminal xatosiz; konsolga har asbob chaqiruvi yozilsin (`checkOrder → …`, `saveOrder → …`).", ru: "терминал без ошибок; в консоль пишется каждый вызов инструмента (`checkOrder → …`, `saveOrder → …`)." }, err: { uz: "Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: "Если ошибка: «Вышла такая ошибка: {ошибка}. Исправь.»" } },
      { h: { uz: 'Telegramda tekshirish', ru: 'Проверить в Telegram' }, t: { uz: "«2 ta Pepperoni, Chilonzor 5» → konsolda avval `checkOrder`, keyin `saveOrder`; botda tasdiq; `/buyurtmalarim` da yangi qator. Keyin «3 ta Shaurma, Yunusobod» → `checkOrder` yo'q deydi, `saveOrder` chaqirilmaydi.", ru: "«2 ta Pepperoni, Chilonzor 5» → в консоли сначала `checkOrder`, потом `saveOrder`; в боте подтверждение; в `/buyurtmalarim` новая строка. Потом «3 ta Shaurma, Yunusobod» → `checkOrder` говорит «нет», `saveOrder` не вызывается." } }
    ]}
    chat={[
      { from: 'user', t: { uz: '2 ta Pepperoni, Chilonzor 5', ru: '2 Pepperoni, Чиланзар 5' } },
      { from: 'bot', t: { uz: "Tekshirdim: Pepperoni bor. Buyurtma saqlandi: 2 × Pepperoni · Chilonzor 5 — 110 000 so'm.", ru: "Проверил: Pepperoni есть. Заказ сохранён: 2 × Pepperoni · Чиланзар 5 — 110 000 сумов." } },
      { from: 'user', t: { uz: '3 ta Shaurma, Yunusobod', ru: '3 шаурмы, Юнусабад' } },
      { from: 'bot', t: { uz: "Shaurma menyuda yo'q — buyurtma yozilmadi. Pitsa tanlaysizmi?", ru: "Шаурмы в меню нет — заказ не записан. Выберете пиццу?" } }
    ]}
    doneText={{ uz: 'Keyingi qadamni agent tanladi, ishni siz yozgan asbob bajardi.', ru: "Следующий шаг выбрал агент, работу сделал инструмент, который написали вы." }} />
);

// 🃏 FLASHCARD KARTALARI — 12 atama (AI-agent tili)
const BOT_FLASHCARDS = [
  { front: { uz: "Maqsad olib, asboblar bilan qadamma-qadam ish bajaradigan bot nima deb ataladi?", ru: "Как называется бот, который получает цель и шаг за шагом выполняет работу с помощью инструментов?" }, back: { uz: "AI-agent", ru: "ИИ-агент" }, note: { uz: "Masalan, buyurtmani tekshiradi, saqlaydi, yetkazishni rejalaydi", ru: "Например, проверяет заказ, сохраняет его, планирует доставку" } },
  { front: { uz: "AI faqat javob matnini yozadigan bot qanday ataladi?", ru: "Как называется бот, в котором ИИ только пишет текст ответа?" }, back: { uz: "AI-bot", ru: "ИИ-бот" }, note: { uz: "6-darsdagi bot: system prompt bo'yicha javob yozadi", ru: "Бот с 6-го урока: пишет ответы по system prompt" } },
  { front: { uz: "Agent sikli qaysi uch qadamdan iborat?", ru: 'Из каких трёх шагов состоит цикл агента?' }, back: { uz: "Idrok, Qaror, Amal", ru: "Восприятие, Решение, Действие" }, note: { uz: "Maqsadga yetguncha takrorlanadi", ru: "Повторяется, пока цель не достигнута" } },
  { front: { uz: "Agent vaziyatni qaysi qadamda ko'radi?", ru: "На каком шаге агент видит ситуацию?" }, back: { uz: "Idrok", ru: "Восприятие" }, note: { uz: "Xabar, bazadagi ma'lumot va oldingi Amal natijasi", ru: "Сообщение, данные в базе и результат прошлого Действия" } },
  { front: { uz: "Qaysi asbobni chaqirishni agent qaysi qadamda tanlaydi?", ru: "На каком шаге агент выбирает, какой инструмент вызвать?" }, back: { uz: "Qaror", ru: "Решение" }, note: { uz: "Tanlovni AI maqsadga qarab qiladi", ru: "Выбор делает ИИ, исходя из цели" } },
  { front: { uz: "Agent asbobni qaysi qadamda chaqiradi?", ru: "На каком шаге агент вызывает инструмент?" }, back: { uz: "Amal", ru: "Действие" }, note: { uz: "Masalan, `saveOrder()` buyurtmani bazaga yozadi", ru: "Например, `saveOrder()` записывает заказ в базу" } },
  { front: { uz: "Agent chaqira oladigan funksiya nima deb ataladi?", ru: "Как называется функция, которую агент может вызвать?" }, back: { uz: "Asbob (tool)", ru: "Инструмент (tool)" }, note: { uz: "Uni siz yozasiz, agent faqat tanlaydi", ru: "Его пишете вы, а агент только выбирает" } },
  { front: { uz: "Agentga siz qaysi uch narsani berasiz?", ru: "Какие три вещи вы даёте агенту?" }, back: { uz: "Maqsad, asboblar, chegara", ru: "Цель, инструменты, ограничение" }, note: { uz: "Keyingi qadamni agent shular ichida tanlaydi", ru: "Следующий шаг агент выбирает в этих рамках" } },
  { front: { uz: "Agent Amaldan keyin nima qiladi?", ru: "Что агент делает после Действия?" }, back: { uz: "Natijani ko'radi", ru: 'Смотрит на результат' }, note: { uz: "Maqsadga yetmagan bo'lsa — yana Idrok", ru: "Если цель не достигнута — снова Восприятие" } },
  { front: { uz: "Agent nimani qila olishi va nimani so'ramasdan qilmasligini nima belgilaydi?", ru: "Что определяет, что агенту можно делать и чего он не делает без спроса?" }, back: { uz: "Chegara (guardrail)", ru: "Ограничение (guardrail)" }, note: { uz: "Masalan, agentga faqat kerakli asboblar beriladi", ru: "Например, агенту дают только нужные инструменты" } },
  { front: { uz: "Pul yechish kabi xavfli amaldan oldin agent nima so'raydi?", ru: 'Что агент спрашивает перед опасным действием, например списанием денег?' }, back: { uz: "Odam tasdig'ini", ru: "Подтверждение человека" }, note: { uz: "Tasdiqsiz xavfli amal bajarilmaydi", ru: "Без подтверждения опасное действие не выполняется" } },
  { front: { uz: "Murakkab holatni agent odamga uzatishi nima deyiladi?", ru: "Как называется, когда агент передаёт сложную ситуацию человеку?" }, back: { uz: "Odam nazorati", ru: "Контроль человека" }, note: { uz: "Inglizcha: human-in-the-loop", ru: "По-английски: human-in-the-loop" } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
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
    { uz: "AI-bot javob matnini yozadi; AI-agent maqsad sari keyingi qadamni o'zi tanlab, asbob chaqiradi", ru: "ИИ-бот пишет текст ответа; ИИ-агент сам выбирает следующий шаг к цели и вызывает инструмент" },
    { uz: "Agent sikli: Idrok → Qaror → Amal — maqsadga yetguncha takrorlanadi", ru: "Цикл агента: Восприятие → Решение → Действие — повторяется, пока цель не достигнута" },
    { uz: "Asbob (tool) — agent chaqira oladigan funksiya: uni siz yozasiz, qaysi birini chaqirishni AI tanlaydi", ru: "Инструмент (tool) — функция, которую агент может вызвать: её пишете вы, а какую вызвать — выбирает ИИ" },
    { uz: "Agentga siz maqsad, asboblar va chegara berasiz — keyingi qadamni u shular ichida tanlaydi", ru: "Вы даёте агенту цель, инструменты и ограничение — следующий шаг он выбирает в этих рамках" },
    { uz: "Xavfli amaldan (pul yechish, bekor qilish) oldin agent odamdan tasdiq so'raydi", ru: "Перед опасным действием (списание денег, отмена) агент спрашивает подтверждение у человека" }
  ];
  const HOMEWORK = [
    { b: { uz: 'Loyihalang', ru: 'Спроектируйте' }, t: { uz: "— o'z botingiz uchun bitta maqsad va 3–4 ta asbob yozing", ru: "— напишите для своего бота одну цель и 3–4 инструмента" } },
    { b: { uz: 'Chegaralang', ru: 'Ограничьте' }, t: { uz: "— qaysi amal xavfli (pul yechish, bekor qilish)? Unga odam tasdig'ini qo'ying yoki bu asbobni bermang", ru: "— какое действие опасно (списание денег, отмена)? Поставьте на него подтверждение человека или не давайте агенту этот инструмент" } },
    { b: { uz: "Sinab ko'ring", ru: "Попробуйте" }, t: { uz: "— aistudio.google.com'da o'z botingizning ikki asbobini yozing va ikki xil xabarda model qaysi asbobni chaqirishini ko'ring", ru: "— на aistudio.google.com напишите два инструмента своего бота и посмотрите, какой инструмент модель вызовет на два разных сообщения" } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'AI-agent qanday ishlashini bilasiz', ru: "Вы знаете, как работает ИИ-агент" })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi AI-agent qanday ishlashini <span className="italic" style={{ color: T.accent }}>bilasiz</span>.</>, ru: <>Теперь вы <span className="italic" style={{ color: T.accent }}>знаете</span>, как работает ИИ-агент.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: "Подождите ментора" }) : undefined} />
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: <>Keyingi dars — <b>«Botingiz yaxshi ishlayotganini qaysi raqam aytadi?»</b> Botingiz foydali ekanini ko'rsatadigan bitta bosh raqamni va unga yordam beradigan uch raqamni tanlaymiz.</>, ru: <>Следующий урок — <b>«Какое число скажет, что ваш бот работает хорошо?»</b> Выберем одно главное число, которое показывает, что ваш бот полезен, и три числа, которые ему помогают.</> })}</p></div>}
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
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function BotAiAgentLesson({ lang: langProp, onFinished, liveToken }) {
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
        .zoomable:not(.z-empty):not(.zoom-on) { padding-top: 36px; } /* U2: ⛶ matn ustiga tushmaydi — unga joy ajratilgan */
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
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; border: 1px solid ${T.line}; box-shadow: none; animation: fade-step 0.3s; } /* U1: ma'lumot kartasi — belgisiz va soyasiz */
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === 🧰 AI-AGENT DARSI: agent kartasi / asboblar / tool-pick / guardrails / amal xavfsizligi === */
        .prompt-card { background: ${CODE.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.28); }
        .prompt-card.live { box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.blue}88; }
        .prompt-who { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 11px; letter-spacing: 0.06em; color: ${CODE.attr}; }
        .prompt-text { margin: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; line-height: 1.5; color: ${CODE.text}; }
        .gen-dots.inline { display: inline-flex; gap: 4px; } .gen-dots.inline i { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: 0.5; animation: gd-blink 1s ease-in-out infinite; } .gen-dots.inline i:nth-child(2){animation-delay:.15s} .gen-dots.inline i:nth-child(3){animation-delay:.3s}
        @keyframes gd-blink { 0%,100%{opacity:.3} 50%{opacity:1} }

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
        .fc-done-emoji { font-size: 40px; color: ${T.success}; font-weight: 800; line-height: 1; }
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
        .rc-ic.code { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: clamp(15px,2.4vw,22px); line-height: 1.3; background: ${CODE.bg}; color: ${CODE.text}; border-radius: 12px; padding: 10px 16px; max-width: 100%; overflow-wrap: anywhere; }
        .rc-ic.num { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(28px,4.6vw,44px); color: ${T.accent}; background: ${T.accentSoft}; width: clamp(56px,9vw,78px); height: clamp(56px,9vw,78px); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
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
        .tg-ava { width: 30px; height: 30px; border-radius: 50%; background: #fff; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: #4E8FC0; flex-shrink: 0; }
        .tg-name { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: #fff; display: flex; flex-direction: column; line-height: 1.25; }
        .tg-status { font-weight: 500; font-size: 10.5px; color: #DCEBF7; }
        .tg-body { background: #CFD9E0; background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 18px 18px; padding: 13px 12px; display: flex; flex-direction: column; gap: 10px; } /* U2: xabarlar orasida bir xil ~10px */
        /* F-1002-83 · 168-qonun: bosib ochiladigan, hali ochilmagan element navbat bilan yengil pulslaydi (outline — halqa-soyani buzmaydi) */
        .tap-wave { animation: tap-wave 2.2s ease-out infinite; }
        .tap-wave:nth-child(2) { animation-delay: 0.35s; } .tap-wave:nth-child(3) { animation-delay: 0.7s; } .tap-wave:nth-child(4) { animation-delay: 1.05s; } .tap-wave:nth-child(5) { animation-delay: 1.4s; } .tap-wave:nth-child(6) { animation-delay: 1.75s; }
        @keyframes tap-wave { 0% { outline: 2px solid rgba(255,79,40,0.5); outline-offset: 0; } 70%, 100% { outline: 2px solid rgba(255,79,40,0); outline-offset: 6px; } }
        @media (prefers-reduced-motion: reduce) { .tap-wave { animation: none; outline: 1.5px solid rgba(255,79,40,0.35); outline-offset: 2px; } }
        .tg-body { max-height: clamp(260px, 48vh, 420px); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; } /* F-1002-85 · 169-qonun: chat cho'zilmaydi, ichki skrol */
        .tg-bubble { max-width: 82%; padding: 8px 12px; border-radius: 14px; font-family: 'Manrope'; font-weight: 500; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; box-shadow: 0 1px 2px rgba(0,0,0,0.12); word-break: normal; overflow-wrap: break-word; hyphens: none; } /* U2: so'z ichida bo'linmaydi */
        .tg-bubble.bot { align-self: flex-start; background: #fff; color: #0E0E10; border-bottom-left-radius: 5px; }
        .tg-bubble.user { align-self: flex-end; background: #EFFDDE; color: #0E0E10; border-bottom-right-radius: 5px; }
        .tg-bubble.muted { opacity: 0.55; }
        .tg-btns { align-self: flex-start; display: flex; flex-wrap: wrap; gap: 5px; max-width: 92%; }
        .tg-btn { font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: #2E6FA6; background: rgba(255,255,255,0.92); padding: 6px 11px; border-radius: 9px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .tg-typing { display: flex; gap: 4px; align-items: center; padding: 11px 13px; }
        .tg-typing span { width: 6px; height: 6px; border-radius: 50%; background: ${T.ink3}; animation: tg-typing-bounce 1s ease-in-out infinite; }
        .tg-typing span:nth-child(2) { animation-delay: 0.15s; } .tg-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes tg-typing-bounce { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-3px); opacity: 1; } }



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
        .pick-row { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 10px; padding: 8px 12px; cursor: pointer; transition: all 0.16s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; }
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
          .dd-chip.in, .dd-slot.ok, .dd-slot.bad, .shake, .tg-typing span { animation: none !important; }
        }

        /* ===== AI-AGENT DARSI (10-dars v2) — yangi bloklar ===== */
        .gchip .ag-chev { font-weight: 800; color: ${T.ink3}; margin-left: 2px; } /* U1: ochiladigan tugmada doimiy chevron, bosilgach ✓ */
        .gchip.seen { box-shadow: inset 0 0 0 1.5px ${T.success}; color: ${T.success}; }
        .gchip.seen .ag-chev { color: ${T.success}; }
        .gchip.cur { box-shadow: inset 0 0 0 2px ${T.ink}; color: ${T.ink}; }
        /* s0 — har chat ostidagi «Baza» qatori */
        .ag-db { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 12px; padding: 10px 13px; font-size: 13px; color: ${T.ink}; }
        .ag-db-k { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        .ag-db-line { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; min-width: 0; }
        .ag-db-none { color: ${T.ink3}; font-style: italic; }
        .ag-arr { position: relative; display: inline-block; width: 30px; height: 2px; background: ${T.accent}; transform-origin: left center; animation: ag-draw-x 0.8s ease-out both; }
        .ag-arr::after { content: ''; position: absolute; right: -1px; top: -4px; border: 5px solid transparent; border-left: 7px solid ${T.accent}; border-right: 0; }
        @keyframes ag-draw-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .ag-db-new { flex: 1 1 0; min-width: 0; font-weight: 700; color: ${T.success}; animation: ag-appear 0.4s ease-out 0.8s both; } /* matn strelkaning o'ng tomonida turadi, o'z ichida o'raladi */
        .ag-db-late { animation: ag-appear 0.4s ease-out 1.1s both; }
        .ag-db-to { color: ${T.ink3}; font-weight: 800; }
        @keyframes ag-appear { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        /* s1 — statik chizma: siz berasiz → agent */
        .ag-scheme { display: flex; align-items: stretch; gap: 10px; }
        .ag-sc-box { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 14px 16px; }
        .ag-sc-k { font-family: 'Manrope'; font-weight: 800; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        .ag-sc-v { font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .ag-sc-n { font-size: 12.5px; color: ${T.ink2}; }
        .ag-sc-arr { align-self: center; font-weight: 800; font-size: 20px; color: ${T.accent}; }
        @media (max-width: 760px) { .ag-scheme { flex-direction: column; } .ag-sc-arr { transform: rotate(90deg); } }
        /* s3 — agent sikli: maqsad qatori, oqim, Amal → Idrok qaytuvchi strelka */
        .ag-cyc { display: flex; flex-direction: column; gap: 10px; }
        .ag-goal.ag-goal { margin: 0; font-size: 14px; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; padding: 8px 12px; align-self: flex-start; }
        .ag-cyc-flow { position: relative; display: flex; align-items: center; padding-bottom: 24px; align-self: flex-start; }
        .ag-cyc-node { width: 92px; text-align: center; font-weight: 700; font-size: 14px; padding: 9px 6px; border-radius: 11px; background: ${T.paper}; color: ${T.ink2}; border: 1px solid ${T.line}; transition: all 0.3s; }
        .ag-cyc-node.on { background: ${T.accent}; color: #fff; border-color: ${T.accent}; box-shadow: 0 6px 16px -6px rgba(255,79,40,0.45); }
        .ag-cyc-arr { width: 24px; text-align: center; font-weight: 800; color: ${T.ink3}; }
        .ag-cyc-ret { margin-left: 8px; font-weight: 800; font-size: 18px; color: ${T.accent}; }
        .ag-cyc-back { position: absolute; left: 46px; width: 232px; bottom: 2px; height: 18px; border: 2px solid ${T.accent}; border-top: 0; border-radius: 0 0 12px 12px; animation: ag-draw-back 0.8s ease-out both; }
        .ag-cyc-head { position: absolute; left: 41px; bottom: 19px; border: 6px solid transparent; border-bottom: 8px solid ${T.accent}; border-top: 0; animation: ag-appear 0.2s ease-out 0.75s both; } /* uch — klip tashqarisida, chiziq yetib kelgach chiqadi */
        @keyframes ag-draw-back { from { clip-path: inset(0 0 0 100%); } to { clip-path: inset(0 0 0 0); } }
        /* s5 — agentni qurish: yig'ilgan qator va xato variant */
        .ag-done-row { display: flex; align-items: center; gap: 9px; background: ${T.successSoft}; color: ${T.success}; border-radius: 10px; padding: 8px 12px; font-size: 13.5px; min-width: 0; }
        .ag-done-t { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: ${T.ink}; }
        .ag-done-ok { font-weight: 800; color: ${T.success}; }
        .ag-redo { border: none; background: ${T.paper}; color: ${T.ink2}; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; font-weight: 800; flex-shrink: 0; box-shadow: inset 0 0 0 1px ${T.line}; }
        .ag-redo:hover { color: ${T.ink}; }
        .pick-row.bad { background: ${T.dangerSoft}; box-shadow: inset 0 0 0 1.5px ${T.danger}; }
        .pick-row.bad .pick-plus { color: ${T.danger}; }
        .ag-pc-row { margin: 0; overflow-wrap: anywhere; }
        .ag-pc-k { color: ${CODE.attr}; font-weight: 700; }
        /* s9 — tasdiq tartibi: Agent → Mijoz → Agent → chargeCard() */
        .ag-seq { display: flex; flex-direction: column; gap: 8px; padding: 4px 2px; }
        .ag-seq-head { display: flex; justify-content: space-between; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.ink2}; }
        .ag-seq-row { display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .ag-seq-msg { font-size: 13px; color: ${T.ink}; animation: ag-appear 0.3s ease-out both; }
        .ag-seq-row:nth-of-type(3) .ag-seq-msg { animation-delay: 0.4s; }
        .ag-seq-line { position: relative; display: block; width: 100%; height: 2px; background: ${T.accent}; animation: ag-draw-x 0.4s ease-out both; }
        .ag-seq-line.to-r { transform-origin: left center; }
        .ag-seq-line.to-r::after { content: ''; position: absolute; right: -1px; top: -4px; border: 5px solid transparent; border-left: 7px solid ${T.accent}; border-right: 0; }
        .ag-seq-line.to-l { transform-origin: right center; animation-delay: 0.4s; }
        .ag-seq-line.to-l::after { content: ''; position: absolute; left: -1px; top: -4px; border: 5px solid transparent; border-right: 7px solid ${T.accent}; border-left: 0; }
        .ag-seq-call { align-self: flex-start; animation: ag-appear 0.4s ease-out 0.8s both; }
        /* s11 — belgilangan qator bitta qatorga yig'iladi */
        .claim-row.done.ok { background: ${T.successSoft}; }
        .claim-row.done.bad { background: ${T.dangerSoft}; }
        .ag-claim-res { flex-shrink: 0; font-weight: 700; font-size: 12.5px; }
        .claim-row.done.ok .ag-claim-res { color: ${T.success}; }
        .claim-row.done.bad .ag-claim-res { color: ${T.danger}; }
        /* s12 — agent ishda: yig'ilgan qadamlar, asbob → «Chaqirilgan asboblar» chizig'i */
        .ag-run { position: relative; }
        .ag-wire { position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; z-index: 2; }
        .ag-wire path { fill: none; stroke: ${T.accent}; stroke-width: 2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: ag-draw-path 0.8s ease-out forwards; }
        @keyframes ag-draw-path { to { stroke-dashoffset: 0; } }
        .ag-run-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: ${T.ink2}; padding: 5px 10px; border-radius: 9px; background: ${T.paper}; border: 1px solid ${T.line}; min-width: 0; }
        .ag-run-row .lp-check { width: 18px; height: 18px; font-size: 10px; background: ${T.successSoft}; color: ${T.success}; box-shadow: none; }
        .ag-called { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; padding: 6px 10px; border-radius: 99px; background: ${T.bg}; color: ${T.ink}; }
        .ag-called.fresh { animation: ag-appear 0.4s ease-out 1.05s both; }
        @media (max-width: 760px) { .ag-wire { display: none; } .ag-called.fresh { animation-delay: 0.2s; } }
        /* s15 — to'g'ri yig'ilgach 5-joydan 2-joyga (Idrok) qaytuvchi strelka */
        .dd-loop { position: absolute; right: 10px; width: 22px; border: 2px solid ${T.success}; border-left: 0; border-radius: 0 12px 12px 0; pointer-events: none; animation: dd-loop-draw 0.9s ease-out both; }
        .dd-loop-head { position: absolute; right: 32px; border: 5px solid transparent; border-right: 8px solid ${T.success}; border-left: 0; pointer-events: none; animation: ag-appear 0.2s ease-out 0.85s both; }
        @keyframes dd-loop-draw { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0 0 0 0); } }
        /* amaliyot — namuna kod kartalari (telefonda gorizontal aylanadi, sahifa kengaymaydi) va navbatli qadamlar */
        .smp-card { min-width: 0; max-width: 100%; background: ${CODE.bg}; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.3); }
        .smp-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .smp-title { font-family: 'Manrope'; font-size: 12.5px; color: ${CODE.punct}; min-width: 0; }
        .smp-title b { color: ${CODE.text}; }
        .smp-copy { flex-shrink: 0; border: none; border-radius: 8px; padding: 6px 11px; font-family: 'Manrope'; font-weight: 700; font-size: 12px; cursor: pointer; background: rgba(255,255,255,0.12); color: ${CODE.text}; transition: background 0.2s; }
        .smp-copy:hover { background: rgba(255,255,255,0.2); }
        .smp-copy.ok { background: ${T.success}; color: #fff; }
        .smp-code { margin: 0; padding: 12px 14px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(11.5px,1.4vw,13px); line-height: 1.55; color: ${CODE.text}; white-space: pre; overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch; }
        .lp-step.lp-cur { cursor: default; flex-wrap: wrap; }
        .lp-step.lp-cur:hover { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .lp-step-btn { margin-left: auto; padding: 8px 16px; font-size: 13px; }
        .lp-done-row { cursor: default; padding: 8px 13px; }
        .lp-one { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lp-one .qcode { white-space: nowrap; overflow-wrap: normal; }
        .lp-extra.lp-extra { margin: 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 11px; padding: 10px 13px; }
        @media (prefers-reduced-motion: reduce) {
          .ag-arr, .ag-db-new, .ag-db-late, .ag-cyc-back, .ag-seq-msg, .ag-seq-line, .ag-seq-call, .ag-wire path, .ag-called.fresh, .dd-loop, .dd-loop-head, .ag-cyc-head { animation: none !important; }
          .ag-wire path { stroke-dashoffset: 0; }
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
            <LiveGate live={live} title={{ uz: 'AI-agent yaratish', ru: "Создание ИИ-агента" }} />
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
