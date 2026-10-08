import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 5-MODUL (Telegram bot + AI) · 9-DARS — «FIKR VA ITERATSIYA» — PLATFORM STANDARD v18 (AUDIOSIZ) · MD v2 (F-0928-QA-5modul/09)
// Maqsad: bot ishga tushgandan keyin mijozlar fikrini tinglash, aniq va noaniq fikrni ajratish, voronkada eng katta
//         yo'qotishni topish, chastota va ta'sirga qarab birinchi tuzatishni tanlash, tuzatib, qayta o'lchash.
// Asosiy model: iteratsiya — tingla → guruhla → tanla → tuzat → qayta tingla; versiyalar v1 → v2 → v3.
// INTERAKTIV: s7 markaziy — saralash (aniq / noaniq, dasta) → voronka → ustuvorlik → oqibat → yangi fikr ·
//   s13 — prompt uch qismdan yig'iladi · s15 FINAL: iteratsiya tartibi (DragDropOrder).
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
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const AchMissCtx = createContext(null); // 🏅 151-qonun: { missed:Set<ekran id>, miss(idx, bosqich?), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi

// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
// Analitika-payload uchun UZ-etalon (4-Modul konvensiyasi): jonli/statistika doim UZ matn ko'radi.
const ou = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node.uz ?? node.ru ?? '';
};

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

const LESSON_META = { lessonId: 'bot-feedback-05-06-v18', lessonTitle: { uz: 'Foydalanuvchi fikri va iteratsiya', ru: 'Отзывы пользователей и итерация' } };
// 20 ekran · 4.1 oqim: hook → reja → (exploration↔test)× → markaziy interaktiv → builder → final → praktika → podium → flashcard → summary
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
        {hasContent && <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={tr(big ? { uz: 'Kichraytirish', ru: 'Уменьшить' } : { uz: 'Kattalashtirish', ru: 'Увеличить' })} title={tr(big ? { uz: 'Kichraytirish', ru: 'Уменьшить' } : { uz: 'Kattalashtirish', ru: 'Увеличить' })}>{big ? '✕' : '⛶'}</button>}
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
      <button className={`ach-counter ${bump ? 'bump' : ''} ${count > 0 ? 'has' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Nishonlar" title="Nishonlar">
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `s15` — final (picked 0/1 sentinel, correct maydoni haqiqiy). `practice: -1` — sentinel (variant yo'q).
// ⚠️ Variant TARTIBI/qiymatlari 🎓 Metodist + ⚡ Jonli rollari tomonidan qayta balanslanadi — shu map ular bilan sinxron bo'lsin.
// ⚡ To'g'ri javob pozitsiyalari ATAYIN har xil (1 · 2 · 0 · 3) — «doim A» naqshi yo'q, o'qimay bosgan ball to'plamaydi.
// s15 (yakuniy) — REAL kalit: picked=0 → 1-urinishda topdi (to'g'ri), picked=1 → 1-urinishda xato bosdi.
const INLINE_KEYS = { s4: 1, s8: 2, s10: 0, s14: 3, s15: 0, practice: -1 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI). Matn 🎓 Metodist tomonidan sayqallanadi.
const RECAPS = {
  4: {
    title: { uz: "Fikr turlari — har biri o'z ishini talab qiladi", ru: "Виды отзывов — каждый требует своего действия" },
    cards: [
      { ic: '1', h: { uz: 'Bug — tuzatiladi', ru: "Баг — его чинят" }, body: { uz: <>«Bot manzilimni qayta so'radi» — bot <b>kutilgan ishni</b> bajarmayapti.</>, ru: <>«Бот снова спросил мой адрес» — бот не делает <b>то, что от него ждут</b>.</> } },
      { ic: '2', h: { uz: "Taklif — o'ylab ko'riladi", ru: "Предложение — его обдумывают" }, body: { uz: <>Botda hali yo'q narsa so'ralsa, uni <b>darrov qo'shmaysiz</b>.</>, ru: <>Если просят то, чего в боте ещё нет, вы <b>не добавляете это сразу</b>.</> } },
      { ic: '3', h: { uz: 'Maqtov — saqlanadi', ru: 'Похвала — её берегут' }, body: { uz: <>Aniq maqtov nima yaxshi ishlayotganini ko'rsatadi, tuzatishda uni <b>buzmang</b>.</>, ru: <>Конкретная похвала показывает, что работает хорошо, — при правке это <b>не сломайте</b>.</> }, ask: { uz: "«Bot manzilimni 2 marta so'radi» — bu qanday fikr?", ru: "«Бот 2 раза спросил мой адрес» — что это за отзыв?" } },
    ]
  },
  8: {
    title: { uz: "Ustuvorlik — chastota va ta'sir", ru: "Приоритет — частота и влияние" },
    cards: [
      { ic: '1', h: { uz: "Bitta shikoyat — tasodif bo'lishi mumkin", ru: "Одна жалоба может быть случайностью" }, body: { uz: <>Bir kishi aytgan narsaga <b>darrov ergashmang</b>.</>, ru: <>То, что сказал один человек, <b>не спешите сразу делать</b>.</> } },
      { ic: '2', h: { uz: "Ko'pchilik va og'riq — birinchi", ru: "Много людей и сильная боль — первым" }, body: { uz: <>Eng ko'p odam aytgan <b>va</b> eng qattiq qiynagan muammo birinchi tuzatiladi.</>, ru: <>Проблему, о которой сказали больше всего людей <b>и</b> которая мешает сильнее всего, чинят первой.</> } },
      { ic: '3', h: { uz: '«Hozir emas» ham qaror', ru: "«Не сейчас» — тоже решение" }, body: { uz: <>Vaqt oz — kam ta'sirli fikrga <b>«hozir emas»</b> deyish botning asosiy ishini saqlaydi.</>, ru: <>Времени мало — сказать идее с малым влиянием <b>«не сейчас»</b> значит сохранить главную работу бота.</> }, ask: { uz: "Nega hamma fikrni birdan qila olmaymiz?", ru: 'Почему нельзя сделать все идеи сразу?' } },
    ]
  },
  10: {
    title: { uz: 'Fokus — kimga foyda beradi', ru: 'Фокус — кому это полезно' },
    cards: [
      { ic: '1', h: { uz: 'Bir kishi — hamma emas', ru: "Один человек — ещё не все" }, body: { uz: <>Bitta o'ziga xos so'rov <b>kamdan-kam</b> ko'pchilikka foyda beradi.</>, ru: <>Одна особая просьба <b>редко</b> приносит пользу большинству.</> } },
      { ic: '2', h: { uz: "Hamma taklifni qo'shmang", ru: "Не добавляйте все предложения" }, body: { uz: <>Har taklifni qo'shsangiz, bot <b>chalkashadi va og'irlashadi</b>.</>, ru: <>Если добавлять каждое предложение, бот <b>запутается и потяжелеет</b>.</> } },
      { ic: '3', h: { uz: "Ko'pchilikka foyda — birinchi", ru: "Польза большинству — первой" }, body: { uz: <>Vaqtni <b>ko'pchilikka ta'sir qiladigan</b> ishga sarflaysiz.</>, ru: <>Время вы тратите на то, что <b>влияет на большинство</b>.</> }, ask: { uz: "100 kishidan bittasi tor so'rov aytsa — nima qilamiz?", ru: "Один из 100 просит что-то узкое — что делаем?" } },
    ]
  },
  14: {
    title: { uz: 'Iteratsiya — tuzatishdan keyin ham davom etadi', ru: "Итерация продолжается и после правки" },
    cards: [
      { ic: '1', h: { uz: 'Tuzatish — taxmin', ru: 'Правка — это предположение' }, body: { uz: <>Ishladimi-yo'qmi, buni <b>qayta o'lchash</b> ko'rsatadi.</>, ru: <>Сработало или нет — покажет <b>повторное измерение</b>.</> } },
      { ic: '2', h: { uz: "Qayta o'lchaysiz", ru: "Измеряете заново" }, body: { uz: <>Versiya chiqqach, o'sha shikoyat <b>kamaydimi</b> — tekshirasiz.</>, ru: <>Когда версия вышла, проверяете: <b>стало ли меньше</b> той жалобы.</> } },
      { ic: '3', h: { uz: 'Keyingi iteratsiya', ru: "Следующая итерация" }, body: { uz: <>Tuzatgandan keyin ham <b>tinglashda davom etasiz</b> — bot shunday yaxshilanib boradi.</>, ru: <>И после правки вы <b>продолжаете слушать</b> — так бот становится лучше.</> }, ask: { uz: "Eng katta shikoyatni tuzatdingiz — endi nima?", ru: 'Вы починили то, на что жаловались больше всего, — что дальше?' } },
    ]
  },
  15: {
    title: { uz: 'Iteratsiya — tartib muhim', ru: "Итерация — порядок важен" },
    cards: [
      { ic: '1', h: { uz: 'Avval — tingla', ru: 'Сначала — слушай' }, body: { uz: <>Mijozlar fikrini <b>yig'asiz</b>, hali hech narsani tuzatmaysiz.</>, ru: <>Вы <b>собираете</b> отзывы клиентов и пока ничего не чините.</> } },
      { ic: '2', h: { uz: 'Guruhla, keyin tanla', ru: 'Сгруппируй, потом выбирай' }, body: { uz: <>Bir xil fikrlarni <b>birlashtirasiz</b>, so'ng chastota va ta'sirga qarab <b>tanlaysiz</b>.</>, ru: <>Одинаковые отзывы <b>объединяете</b>, затем <b>выбираете</b> по частоте и влиянию.</> } },
      { ic: '3', h: { uz: 'Tuzat va qayta tingla', ru: 'Почини и слушай снова' }, body: { uz: <>Tuzatgandan keyin yana <b>tinglaysiz</b> — keyingi iteratsiya shu yerdan boshlanadi.</>, ru: <>После правки снова <b>слушаете</b> — отсюда начинается следующая итерация.</> }, vis: { uz: <RcFlow items={['Tingla', 'Guruhla', 'Tanla', 'Tuzat', 'Qayta tingla']} />, ru: <RcFlow items={['Слушай', 'Группируй', 'Выбирай', 'Чини', 'Слушай снова']} /> }, ask: { uz: "Nega «tuzat» eng oxirgi qadam emas?", ru: 'Почему «почини» — не последний шаг?' } },
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
        <div className="rc-ic">{card.ic}</div>
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
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и сколько ✅/❌ — пока скрыто. По кнопке «Открыть результат» всё откроется сразу и у вас, и на экранах учеников.' })}</p>
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
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? `${n} ${tr({ uz: "o'quvchi", ru: 'учеников' })} · ${pct}%` : '—'}</span>
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
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тема классу не зашла. Перед продолжением стоит быстро её повторить.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: 'Qayta tushuntirish —', ru: 'Объяснить заново —' })} {tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 Верно <b>{pct}%</b> — неплохо. При желании повторите тему перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ Верно <b>{pct}%</b> — класс освоил тему. Спокойно продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: `Javob berganlar kam (${answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.`, ru: `Ответивших мало (${answered}) — по процентам судить трудно. Оцените сами.` })}</p>}
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
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      if (!fpPractice) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options: options.map(ou), correctIndex: correctIdx, correctAnswer: ou(options[correctIdx]), picked: i, studentAnswerIndex: i, studentAnswer: ou(options[i]), correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    // Har urinish tarixga (LMS analitika, 0005): ball emas, yozuv; modulsiz eski darsda recordAttempt yo'q
    if (live && live.recordAttempt && !fpPractice) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options: options.map(ou), picked: ou(options[i]), correct: ou(options[correctIdx]), lang: (typeof __lang !== 'undefined' && __lang === 'ru') ? 'ru' : 'uz' });
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
    <Stage eyebrow={tr(eyebrow)} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval natijani oching', ru: 'Сначала откройте результат' }) : solved ? { uz: 'Davom etish', ru: 'Продолжить' } : (oneShot ? { uz: 'Javob tanlang', ru: 'Выберите ответ' } : { uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' })} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{tr(question)}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: "Живой урок — одна попытка, подумайте перед нажатием!" })}</p>}
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
                <span style={{ flex: 1 }}>{fmtCode(tr(opt))}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? <>{tr({ uz: "✓ To'g'ri javob:", ru: '✓ Верный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
              : waiting
                ? tr({ uz: 'Javobingiz qabul qilindi', ru: "Ваш ответ принят" })
                : wrongLocked
                  ? <>{tr({ uz: "To'g'ri javob:", ru: 'Верный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(tr(explainCorrect))
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете верный ответ.' })
                : wrongLocked
                  ? fmtCode(tr(explainWrong[picked] ?? explainWrong.default))
                  : solved ? fmtCode(tr(explainCorrect)) : fmtCode(tr(explainWrong[picked] ?? explainWrong.default))}
          </p>
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi.
              Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */}
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — посмотреть тему ещё раз" })}</button>
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue">{tr({ uz: " · ko'rsatmani ochish ▾", ru: ' · раскрыть подсказку ▾' })}</span>}</span>
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
const TgChat = ({ title = 'AvtoPizza', children, minH }) => (
  <div className="tg">
    <div className="tg-head"><span className="tg-ava">{String(tr(title)).charAt(0)}</span><span className="tg-name">{tr(title)}<span className="tg-status">{tr({ uz: 'bot · onlayn', ru: 'бот · онлайн' })}</span></span></div>
    <TgBody minH={minH}>{children}</TgBody>
  </div>
);
const Bubble = ({ from = 'bot', children, muted }) => <div className={`tg-bubble ${from} el-in ${muted ? 'muted' : ''}`}>{children}</div>;
const TgBtns = ({ items }) => <div className="tg-btns el-in">{items.map((b, i) => <span key={i} className="tg-btn">{b}</span>)}</div>;
function DragDropOrder({ items, hints, onSolved, onChange, cycle }) {
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
      {/* A7: to'g'ri yig'ilgach 5-qadamdan 1-qadamga qaytuvchi strelka chiziladi (keyingi iteratsiya boshlanadi) */}
      <div className={`dd-slots ${cycle ? 'has-cycle' : ''}`}>
        {slots.map((sid, i) => (
          <div key={i} ref={el => (slotRefs.current[i] = el)} className={`dd-slot ${sid ? 'filled' : ''} ${solved && sid ? 'ok' : ''} ${wrong && sid && sid !== order[i] ? 'bad' : ''}`}>
            <span className="dd-slotn">{hints ? tr(hints[i]) : i + 1}</span>
            {sid ? <button key={sid} className="dd-chip in" onPointerDown={(e) => down(e, sid, i)}>{tr(byId[sid].label)}</button> : <span className="dd-hint">{tr({ uz: "bu yerga qo'ying", ru: "поместите сюда" })}</span>}
          </div>
        ))}
        {cycle && solved && <span className="dd-cycle" aria-hidden="true" />}
      </div>
      <div className="dd-pool">
        {pool.map(id => <button key={id} className="dd-chip" onPointerDown={(e) => down(e, id, 'pool')}>{tr(byId[id].label)}</button>)}
      </div>
      {wrong && !solved && <div className="dd-wrong">{tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang.", ru: "Порядок неверный — нажмите на блок, чтобы вернуть его, и разложите заново." })}</div>}
    </div>
  );
}

// ===== FIKR MANBALARI (s2) =====
const FEEDBACK_SOURCES = [
  { id: 'direct', label: { uz: "To'g'ridan-to'g'ri xabar", ru: "Прямое сообщение" }, desc: { uz: "Foydalanuvchi botga shikoyat yoki taklifni o'zi yozadi.", ru: "Пользователь сам пишет боту жалобу или предложение." } },
  { id: 'drop', label: { uz: 'Ketib qolish (drop-off)', ru: "Уход (drop-off)" }, desc: { uz: "Ko'p odam suhbatning bir joyida to'xtab, ketib qoladi. O'sha qadamda nimadir xalaqit beryapti — sababini tekshirasiz.", ru: "Многие останавливаются в одном месте диалога и уходят. На этом шаге что-то мешает — вы проверяете причину." } },
  { id: 'repeat', label: { uz: 'Takror savollar', ru: 'Повторные вопросы' }, desc: { uz: "Bir xil savol qayta-qayta berilsa, bot biror narsani aniq ko'rsatmayapti.", ru: "Если один и тот же вопрос задают снова и снова, бот что-то показывает неясно." } },
  { id: 'error', label: { uz: 'Xato yozuvlari (loglar)', ru: "Записи об ошибках (логи)" }, desc: { uz: "Bot dasturining xato yozuvlari u qayerda buzilayotganini ko'rsatadi.", ru: "Записи об ошибках в программе бота показывают, где он ломается." } }
];

// ===== SAVOL BERISH (s3) — bo'sh savol va bo'lib o'tgan ishni so'rash (8-dars) =====
const ASK_MODES = [
  { id: 'bad', label: { uz: '«Botimiz yoqdimi?»', ru: "«Вам понравился наш бот?»" }, d: { uz: "Bo'sh savol. Javobi odatda «ha, zo'r» bo'ladi — undan nimani tuzatish kerakligi bilinmaydi.", ru: "Пустой вопрос. Ответ обычно «да, супер» — из него не понять, что нужно чинить." } },
  { id: 'good', label: { uz: '«Oxirgi buyurtmada qayerda to\'xtab qoldingiz?»', ru: "«Где вы остановились при последнем заказе?»" }, d: { uz: "Bo'lib o'tgan ishni so'raydi, javobda aniq joy bo'ladi: «menyu tugmasini topolmadim». Tuzatishni shu javobdan boshlasa bo'ladi.", ru: "Спрашивает о том, что уже было, и в ответе есть конкретное место: «не нашёл кнопку меню». С такого ответа можно начать правку." } }
];

// ===== CHASTOTA (s5) — bir xil shikoyatlar guruhlanadi =====
const COMPLAINTS_5 = [
  { id: 'addr', label: { uz: "Manzilni qayta so'raydi", ru: 'Снова спрашивает адрес' }, n: 18 },
  { id: 'price', label: { uz: "Narx ko'rinmaydi", ru: 'Не видно цены' }, n: 12 },
  { id: 'long', label: { uz: "Javoblar juda uzun", ru: 'Ответы слишком длинные' }, n: 5 },
  { id: 'gluten', label: { uz: "Glutensiz pitsa yo'q", ru: "Нет безглютеновой пиццы" }, n: 3 }
];
const COMPLAINTS_MAX = 18;

// ===== NOANIQ → ANIQ (s6) =====
const VAGUE_PAIRS = [
  { id: 'p1', xom: { uz: "«Menyu chalkash»", ru: '«Меню запутанное»' }, concrete: { uz: "Har pitsa yoniga narxi va 2–3 so'zli tavsifi qo'shilsin.", ru: "Рядом с каждой пиццей добавить цену и описание в 2–3 слова." } },
  { id: 'p2', xom: { uz: "«Bot meni tushunmaydi»", ru: '«Бот меня не понимает»' }, concrete: { uz: "System prompt'ga: savol noaniq bo'lsa, bot aniqlashtiruvchi savol bersin.", ru: "В system prompt: если вопрос неясный, бот задаёт уточняющий вопрос." } },
  { id: 'p3', xom: { uz: "«Sekin javob beradi»", ru: '«Отвечает медленно»' }, concrete: { uz: "Oddiy savollarga (menyu, manzil) bot AI'siz, tugma bilan tez javob bersin.", ru: "На простые вопросы (меню, адрес) бот отвечает быстро, кнопками, без ИИ." } }
];

// ===== MARKAZIY (s7): bir haftalik fikrlar — saralash → voronka → ustuvorlik → oqibat → yangi fikr =====
// `valuable` qiymati o'zgarmaydi (true = «Aniq» savat, false = «Noaniq» savat).
const WEEK_FEEDBACK = [
  { id: 'c1', txt: { uz: 'Yaxshi bot', ru: "Хороший бот" }, valuable: false, why: { uz: "Umumiy maqtov: nimasi yaxshi ekani aytilmagan — «Nimasi yoqdi?» deb so'rash kerak.", ru: "Общая похвала: не сказано, что именно хорошо, — нужно спросить «Что понравилось?»." } },
  { id: 'c2', txt: { uz: "Menyu tugmasini topolmadim, /start bosdim, hech narsa chiqmadi", ru: 'Не нашёл кнопку меню, нажал /start — ничего не появилось' }, valuable: true, why: { uz: "Aniq muammo (menyu tugmasi) va aniq joy (/start dan keyin) aytilgan — tuzatsa bo'ladi.", ru: "Названа конкретная проблема (кнопка меню) и конкретное место (после /start) — можно чинить." } },
  { id: 'c3', txt: { uz: 'Buyurtma berdim, javob 5 daqiqada keldi', ru: 'Сделал заказ, ответ пришёл через 5 минут' }, valuable: true, why: { uz: "Aniq muammo (sekinlik) va o'lchov (5 daqiqa) bor — tuzatsa bo'ladi.", ru: "Есть конкретная проблема (медленно) и измерение (5 минут) — можно чинить." } },
  { id: 'c4', txt: { uz: 'Bot ahmoq', ru: 'Бот тупой' }, valuable: false, why: { uz: "Nimasi yoqmagani aytilmagan — «Qayerda qiynaldingiz?» deb so'rash kerak.", ru: "Не сказано, что именно не понравилось, — нужно спросить «Где вам было трудно?»." } },
  { id: 'c5', txt: { uz: "Manzilni yozdim, lekin bot uni eslamadi, qaytadan so'radi", ru: 'Написал адрес, но бот его не запомнил и спросил снова' }, valuable: true, why: { uz: "Aniq bug: bot manzilni holatda saqlamagan, qayerda buzilgani aniq.", ru: "Явный баг: бот не сохранил адрес в состоянии, место поломки понятно." } },
  { id: 'c6', txt: { uz: "Narxni so'radim, boshqa narx aytdi", ru: 'Спросил цену — назвал другую' }, valuable: true, why: { uz: "Aniq bug: botdagi AI narxni o'zi o'ylab topgan (6-darsda buni ko'rgansiz). Qayerda xato ekani aniq.", ru: "Явный баг: ИИ в боте сам придумал цену (вы видели это на 6-м уроке). Понятно, где ошибка." } },
  { id: 'c7', txt: { uz: "Ajoyib, hammasi juda yoqdi", ru: "Супер, всё очень понравилось" }, valuable: false, why: { uz: "Aniq joy aytilmagan — nimasi yoqqanini so'rash kerak.", ru: "Конкретное место не названо — нужно спросить, что именно понравилось." } },
  { id: 'c8', txt: { uz: "Boshqa bot menga ko'proq yoqadi", ru: "Другой бот мне нравится больше" }, valuable: false, why: { uz: "Qaysi bot, nimasi yoqqani aytilmagan — avval so'rash kerak.", ru: "Не сказано, какой бот и что в нём нравится, — сначала нужно спросить." } }
];

// Ikki savatga saralash — dasta: bitta joriy karta ochiq; to'g'ri savatga tushgach keyingisi chiqadi.
// Noto'g'ri savatda karta qaytadi va izoh chiqadi (izoh keyingi to'g'ri joylashgacha turadi).
function FeedbackSort({ items, onSolved, onWrong }) {
  const [idx, setIdx] = useState(0);
  const [placed, setPlaced] = useState({ green: [], gray: [] });
  const [shakeId, setShakeId] = useState(null);
  const [why, setWhy] = useState(null);
  const greenRef = useRef(null); const grayRef = useRef(null);
  const byId = useMemo(() => Object.fromEntries(items.map(x => [x.id, x])), [items]);
  const total = items.length;
  const done = idx >= total;
  const cur = done ? null : items[idx];
  useEffect(() => { if (done) onSolved && onSolved(); }, [done]); // eslint-disable-line
  const place = (item, basket) => {
    if (!item) return;
    const okBasket = item.valuable ? 'green' : 'gray';
    if (basket !== okBasket) {
      setWhy(item.why); setShakeId(item.id); if (onWrong) onWrong();   // 151-qonun: noto'g'ri savat — urinish
      setTimeout(() => setShakeId(x => (x === item.id ? null : x)), 550);
      return;
    }
    setWhy(null);
    setPlaced(p => ({ ...p, [basket]: [...p[basket], item.id] }));
    setIdx(i => i + 1);
  };
  const down = (ev, item) => {
    if (ev.button != null && ev.button !== 0) return;
    ev.preventDefault();
    const el = ev.currentTarget; const sx = ev.clientX, sy = ev.clientY; let moved = false;
    el.style.transition = 'none'; el.style.zIndex = '9999';
    const mv = (e) => { const dx = e.clientX - sx, dy = e.clientY - sy; if (!moved && Math.abs(dx) + Math.abs(dy) > 5) moved = true; if (moved) el.style.transform = `translate(${dx}px,${dy}px) scale(1.04) rotate(-2deg)`; };
    const finish = () => { el.style.zIndex = ''; el.style.transform = ''; el.style.transition = ''; };
    const up = (e) => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      finish();
      if (!moved) return;
      const inside = (r) => r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (inside(greenRef.current && greenRef.current.getBoundingClientRect())) place(item, 'green');
      else if (inside(grayRef.current && grayRef.current.getBoundingClientRect())) place(item, 'gray');
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  return (
    <div className="fs fade-up">
      {cur ? (
        <div className="fs-deck">
          <p className="small fs-hint">{tr({ uz: 'Kartani sudrab savatga tashlang yoki bosib tanlang —', ru: "Перетащите карточку в корзину или нажмите и выберите —" })} <b className="mono">{idx + 1}/{total}</b></p>
          <div className="fs-stack">
            <button key={cur.id} className={`fs-card fade-step ${shakeId === cur.id ? 'shake' : ''}`} onPointerDown={(e) => down(e, cur)}>{tr(cur.txt)}</button>
          </div>
          <div className="fs-quick">
            <button className="fs-quick-btn green" onClick={() => place(cur, 'green')}>{tr({ uz: 'Aniq', ru: "Конкретный" })}</button>
            <button className="fs-quick-btn gray" onClick={() => place(cur, 'gray')}>{tr({ uz: 'Noaniq', ru: "Неконкретный" })}</button>
          </div>
          {why && <p className="fs-wrong-why fade-step">{tr(why)}</p>}
        </div>
      ) : <p className="fs-done">{tr({ uz: '✓ Hammasi saralandi', ru: '✓ Всё разобрано' })}</p>}
      <div className="fs-baskets">
        <div ref={greenRef} className="fs-basket green">
          <span className="fs-basket-h">{tr({ uz: <><b>Aniq</b> — muammo va joyi aytilgan</>, ru: <><b>Конкретный</b> — названы проблема и место</> })}</span>
          <div className="fs-basket-body">{placed.green.map(id => <span key={id} className="fs-placed">{tr(byId[id].txt)}</span>)}</div>
        </div>
        <div ref={grayRef} className="fs-basket gray">
          <span className="fs-basket-h">{tr({ uz: <><b>Noaniq</b> — avval aniqlashtirish kerak</>, ru: <><b>Неконкретный</b> — сначала нужно уточнить</> })}</span>
          <div className="fs-basket-body">{placed.gray.map(id => <span key={id} className="fs-placed">{tr(byId[id].txt)}</span>)}</div>
        </div>
      </div>
    </div>
  );
}

// Voronka: har qadamda nechta mijoz qolgani (100 → 40 → 35)
const FUNNEL_STEPS = [
  { id: 'start', label: { uz: '/start bosdi', ru: 'Нажал /start' }, n: 100 },
  { id: 'menu', label: { uz: 'Menyuni ochdi', ru: 'Открыл меню' }, n: 40 },
  { id: 'order', label: { uz: 'Buyurtma berdi', ru: 'Сделал заказ' }, n: 35 }
];
// Ustuvorlik tanlovi — ballsiz; to'g'ri variant 2-o'rinda (4-savol A), tekshiruv id bo'yicha
const FIX_CHOICES = [
  { id: 'rude', label: { uz: '«Bot ahmoq» sharhiga javob yozish', ru: 'Ответить на отзыв «Бот тупой»' } },
  { id: 'menu', label: { uz: 'Menyu tugmasini tuzatish', ru: 'Починить кнопку меню' } }
];

// ===== SCREEN 0 — HOOK: bot bir haftadan beri ishlayapti, fikrlar kela boshladi =====
// A6: kirganda — chat (faqat birinchi mijoz xabari) va tugma; bosilgach uch xabar birin-ketin → savol va 3 variant → izoh.
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [msgs, setMsgs] = useState(storedAnswer ? 3 : 0);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const tried = msgs > 0;
  const qOpen = msgs >= 3;
  const tRef = useRef([]);
  useEffect(() => () => tRef.current.forEach(clearTimeout), []);
  const poke = () => {
    if (tried) return;
    setMsgs(1); setSc(n => n + 1);
    tRef.current.push(setTimeout(() => { setMsgs(2); setSc(n => n + 1); }, 550));
    tRef.current.push(setTimeout(() => { setMsgs(3); setSc(n => n + 1); }, 1100));
  };
  const OPTS = [
    { id: 'a', label: { uz: "Hech narsa: bot ishlayapti, shikoyat bo'lib turadi", ru: "Ничего: бот работает, жалобы бывают всегда" } },
    { id: 'b', label: { uz: "Fikrlarni o'qib, eng ko'p takrorlanganini tuzataman", ru: "Прочитаю отзывы и починю то, что повторяется чаще всего" } },
    { id: 'c', label: { uz: "Botni noldan, butunlay qayta yozaman", ru: "Перепишу бота с нуля, полностью" } }
  ];
  const pick = (v) => { if (picked !== null || !qOpen) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: "Введение" })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr({ uz: <>Mijozlar AvtoPizza boti haqida <span className="italic" style={{ color: T.accent }}>nima</span> deyapti?</>, ru: <>Что клиенты <span className="italic" style={{ color: T.accent }}>говорят</span> о боте AvtoPizza?</> })}</h1>
        <Mentor>{tr({ uz: "AvtoPizza boti bir haftadan beri ishlayapti. Eng yaxshi mahsulot ham birinchi versiyada mukammal bo'lmaydi. Foydalanuvchilar uni siz o'ylamagan tomondan ishlatadi. Tugmani bosib, kelgan fikrlarni ko'ring.", ru: "Бот AvtoPizza работает уже неделю. Даже лучший продукт в первой версии не идеален. Пользователи применяют его так, как вы и не думали. Нажмите кнопку и посмотрите пришедшие отзывы." })}</Mentor>
        <Zoomable><Split>
          <Col>
            <TgChat title="AvtoPizza" minH={140}>
              <Bubble from="user">{tr({ uz: "Manzilimni 2 marta so'radi", ru: "Спросил мой адрес 2 раза" })}</Bubble>
              {msgs >= 1 && <Bubble from="user">{tr({ uz: "Narxni ko'rsatmaydi, noqulay", ru: 'Не показывает цену, неудобно' })}</Bubble>}
              {msgs >= 2 && <Bubble from="user">{tr({ uz: "Glutensiz pitsa qo'shing!", ru: "Добавьте безглютеновую пиццу!" })}</Bubble>}
              {msgs >= 3 && <Bubble from="user">{tr({ uz: 'Tez va qulay, rahmat!', ru: "Быстро и удобно, спасибо!" })}</Bubble>}
            </TgChat>
            <button className={`btn ${tried ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} onClick={poke} disabled={tried}>{tried ? tr({ uz: '✓ Fikrlar keldi', ru: '✓ Отзывы пришли' }) : tr({ uz: "▶ Mijozlar nima dedi?", ru: '▶ Что сказали клиенты?' })}</button>
          </Col>
          <Col>
            {qOpen && <>
              <p className="eyebrow fade-up" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Birinchi nima qilasiz?', ru: "Что вы сделаете первым?" })}</p>
              <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {OPTS.map(o => {
                  const on = picked === o.id;
                  return (<button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>);
                })}
              </div>
            </>}
            {picked === 'b' && <p className="hook-ack fade-step">{tr({ uz: <><b>Aynan!</b> Fikrlarni tinglaysiz, eng muhimini tuzatasiz va yana tinglaysiz. Shu takror <b>iteratsiya</b> deyiladi.</>, ru: <><b>Именно!</b> Вы слушаете отзывы, чините самое важное и снова слушаете. Такой повтор называется <b>итерацией</b>.</> })}</p>}
            {picked !== null && picked !== 'b' && <p className="hook-ack fade-step">{tr({ uz: <><b>Qiziq fikr!</b> Noldan yozsangiz ishlaydigan qismlar ham yo'qoladi. Yo'li — tinglash, tuzatish, yana tinglash: <b>iteratsiya</b>.</>, ru: <><b>Интересная мысль!</b> Если переписать с нуля, пропадут и работающие части. Путь — слушать, чинить, снова слушать: <b>итерация</b>.</> })}</p>}
          </Col>
        </Split></Zoomable>
      </div>
    </Stage>
  );
};

const Screen1 = ({ screen, onNext, onPrev }) => {
  const STEPS = [
    { uz: 'Fikrlarni turlarga ajratish: bug, taklif, maqtov', ru: "Разделить отзывы по видам: баг, предложение, похвала", tag: { uz: "turlar", ru: "виды" } },
    { uz: "Guruhlab, ustuvorlik qo'yish: chastota va ta'sir", ru: "Сгруппировать и расставить приоритет: частота и влияние", tag: { uz: "tanlov", ru: "выбор" } },
    { uz: "Noaniq fikrni aniq o'zgarishga aylantirish", ru: 'Превратить неконкретный отзыв в конкретное изменение', tag: { uz: "aniqlik", ru: "точность" } },
    { uz: "Qayta o'lchash va keyingi iteratsiya", ru: "Повторное измерение и следующая итерация", tag: { uz: "o'lchov", ru: "измерение" } }
  ];
  const isNarrow = useIsMobile(768);
  const [showSteps, setShowSteps] = useState(false);
  const Preview = (
    <Col>
      <p className="flow-label">{tr({ uz: "dars oxirida — ikki shikoyati tuzatilgan bot: manzil bir marta so'raladi, narx ko'rinadi", ru: "в конце урока — бот с двумя исправленными жалобами: адрес спрашивается один раз, цена видна" })}</p>
      <TgChat title="AvtoPizza" minH={0}>
        <Bubble from="user">{tr({ uz: 'Margarita, Chilonzor 5', ru: 'Маргарита, Чиланзар 5' })}</Bubble>
        <Bubble from="bot">{tr({ uz: "Qabul qilindi: Margarita — 35 000 so'm. Manzil: Chilonzor 5.", ru: "Принято: Маргарита — 35 000 сумов. Адрес: Чиланзар 5." })}</Bubble>
      </TgChat>
    </Col>
  );
  const StepsB = (
    <Col>
      <p className="flow-label">{tr({ uz: 'Bugungi 4 qadam', ru: '4 шага на сегодня' })}</p>
      <ol className="roadmap">{STEPS.map((t, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(t)}</span>{t.tag && <span className="step-tag">{tr(t.tag)}</span>}</span></li>))}</ol>
    </Col>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic scrollSignal={showSteps} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive label={{ uz: 'Boshlaymiz →', ru: 'Начинаем →' }} onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun: mijozlar fikridan botning <span className="italic" style={{ color: T.accent }}>yangi versiyasigacha</span>.</>, ru: <>Сегодня: от отзывов клиентов до <span className="italic" style={{ color: T.accent }}>новой версии</span> бота.</> })}</h2></div>
        <Mentor>{tr({ uz: "5-darsda botni o'zingiz test qilib, xatosini tuzatgansiz — bu ham iteratsiya edi. 8-darsda botingizni ishlatgan odamdan so'radingiz. Bugun xatoni foydalanuvchilar aytadi, siz esa qaysi birini birinchi tuzatishni tanlaysiz.", ru: "На 5-м уроке вы сами тестировали бота и исправляли ошибку — это тоже была итерация. На 8-м уроке вы спрашивали человека, который пользовался вашим ботом. Сегодня об ошибке говорят пользователи, а вы выбираете, какую чинить первой." })}</Mentor>
        {!isNarrow ? (<Zoomable><Split>{Preview}{StepsB}</Split></Zoomable>)
          : !showSteps ? <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}>{Preview}<button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(true)}>{tr({ uz: "4 qadamni ko'rish", ru: 'Посмотреть 4 шага' })}</button></div>
            : <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vw,16px)' }}><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => setShowSteps(false)}>{tr({ uz: "↩ Natijani ko'rish", ru: '↩ Посмотреть результат' })}</button>{StepsB}</div>}
      </div>
    </Stage>
  );
};

const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(FEEDBACK_SOURCES.map(s => s.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= FEEDBACK_SOURCES.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const cur = FEEDBACK_SOURCES.find(s => s.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · fikr manbalari', ru: "Понятие · источники отзывов" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `4 manbani ko'ring (${seen.size}/4)`, ru: `Посмотрите 4 источника (${seen.size}/4)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Fikr faqat <span className="italic" style={{ color: T.accent }}>shikoyatda</span> emas — u 4 joydan keladi.</>, ru: <>Отзыв — это не только <span className="italic" style={{ color: T.accent }}>жалоба</span>: он приходит из 4 мест.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Foydalanuvchi har doim ham «menga bu yoqmadi» deb yozmaydi. Ko'pincha fikr uning <b style={{ color: T.ink }}>xatti-harakatida</b> ko'rinadi: qayerda to'xtaydi, nimani qayta so'raydi. Har manbani bosing.</>, ru: <>Пользователь не всегда пишет «мне это не понравилось». Часто отзыв виден в его <b style={{ color: T.ink }}>поведении</b>: где он останавливается, что переспрашивает. Нажмите на каждый источник.</> })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {FEEDBACK_SOURCES.map(s => <button key={s.id} className={`gchip ${seen.has(s.id) ? 'seen' : 'tap-wave'} ${active === s.id ? 'cur' : ''}`} onClick={() => tap(s.id)}>{tr(s.label)}<span className="gchip-mk" aria-hidden="true">{seen.has(s.id) ? '✓' : '›'}</span></button>)}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "To'g'ridan-to'g'ri xabar aniq, lekin kam keladi. Xatti-harakat (ketish, takror savol) ko'p, lekin yashirin.", ru: "Прямое сообщение точное, но редкое. Поведение (уход, повторный вопрос) частое, но скрытое." })}</p></div>}
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="note-h">{tr(cur.label)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.desc)}</p></div>
              : null}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(ASK_MODES.map(m => m.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= ASK_MODES.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const cur = ASK_MODES.find(m => m.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · savol berish', ru: 'Понятие · как спрашивать' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Ikkala savolni sinang', ru: 'Попробуйте оба вопроса' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qanday <span className="italic" style={{ color: T.accent }}>so'rasangiz</span>, shunday javob olasiz.</>, ru: <>Как <span className="italic" style={{ color: T.accent }}>спросите</span> — такой ответ и получите.</> })}</h2></div>
        <Mentor>{tr({ uz: "8-darsda odamdan bo'lib o'tgan ishini so'rashni o'rgandingiz. Bot ham buyurtmadan keyin mijozdan fikr so'rashi mumkin — savolni shu qoida bilan tuzasiz. Ikkala savolni bosib ko'ring.", ru: "На 8-м уроке вы научились спрашивать человека о том, что уже было. Бот тоже может после заказа спросить у клиента отзыв — вопрос вы составляете по тому же правилу. Нажмите на оба вопроса." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ASK_MODES.map(m => (
                <button key={m.id} className={`vcard ${active === m.id ? 'cur' : ''}`} onClick={() => tap(m.id)}>
                  <span className="vlbl">{tr(m.label)}</span>
                  <span className="vseen" style={{ color: seen.has(m.id) ? T.success : T.ink3 }}>{seen.has(m.id) ? '✓' : '›'}</span>
                </button>
              ))}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="sk-info fade-step" key={active}><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.d)}</p></div>
              : null}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

const Screen4 = (props) => (
  <QuestionScreen {...props} idx={4} scope="module-mikro" eyebrow={{ uz: 'Mashq · 1-savol', ru: 'Практика · вопрос 1' }}
    questionText="Mijoz: «Bot manzilimni 2 marta so'radi». Bu qanday fikr?"
    question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Mijoz: «Bot manzilimni <span className="italic" style={{ color: T.accent }}>2 marta</span> so'radi». Bu qanday fikr?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Клиент: «Бот <span className="italic" style={{ color: T.accent }}>2 раза</span> спросил мой адрес». Что это за отзыв?</h2></> }}
    options={[
      { uz: "Taklif: botda hali yo'q narsa so'ralgan", ru: "Предложение: просят то, чего в боте ещё нет" },
      { uz: "Bug: bot yozilgan manzilni eslab qolmagan", ru: "Баг: бот не запомнил введённый адрес" },
      { uz: "Maqtov: mijoz botdan mamnun ekanini aytgan", ru: "Похвала: клиент говорит, что доволен ботом" },
      { uz: "Shovqin: bunga e'tibor berish shart emas", ru: "Шум: на это можно не обращать внимания" }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Bu bug: bot kutilgan ishni bajarmayapti — manzilni eslab qolmayapti.", ru: "Это баг: бот не делает то, что от него ждут, — не запоминает адрес." }}
    explainWrong={{
      0: { uz: "Taklif — botda hali yo'q narsani so'rash. Bu yerda bor narsa noto'g'ri ishlayapti, demak bu bug.", ru: "Предложение — это просьба о том, чего в боте ещё нет. Здесь то, что есть, работает неправильно, значит, это баг." },
      2: { uz: "Mijoz mamnun emas: u bir narsani ikki marta yozishga majbur bo'ldi. Bu norozilik, maqtov emas.", ru: "Клиент недоволен: ему пришлось писать одно и то же дважды. Это недовольство, а не похвала." },
      3: { uz: "Aksincha, bu aniq fikr: nima buzilgani aytilgan. Ko'p odam shuni yozsa, bug jiddiy.", ru: "Наоборот, это конкретный отзыв: сказано, что сломалось. Если так пишут многие, баг серьёзный." },
      default: { uz: "Bu bug: bot kerakli ishni bajarmayapti.", ru: "Это баг: бот не делает нужную работу." }
    }} />
);

const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [shown, setShown] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const done = shown;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const sorted = [...COMPLAINTS_5].sort((a, b) => b.n - a.n);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · chastota', ru: "Понятие · частота" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Fikrlarni guruhlang', ru: 'Сгруппируйте отзывы' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bir kishi aytsa — tasodif, ko'pchilik aytsa — <span className="italic" style={{ color: T.accent }}>muammo</span>.</>, ru: <>Сказал один — случайность, говорят многие — <span className="italic" style={{ color: T.accent }}>проблема</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har fikrga alohida ergashsangiz, adashasiz. Bir xil shikoyatlarni guruhlab, sanang: nechta odam shu narsani aytgan? Bu son <b style={{ color: T.ink }}>chastota</b> deyiladi. Tugmani bosing.</>, ru: <>Если идти за каждым отзывом отдельно, вы запутаетесь. Сгруппируйте одинаковые жалобы и посчитайте: сколько человек сказали одно и то же? Это число называется <b style={{ color: T.ink }}>частотой</b>. Нажмите кнопку.</> })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <button className={`btn ${shown ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} disabled={shown} onClick={() => { setShown(true); setSc(n => n + 1); }}>{shown ? tr({ uz: '✓ Guruhlandi', ru: '✓ Сгруппировано' }) : tr({ uz: 'Fikrlarni guruhlash', ru: "Сгруппировать отзывы" })}</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              {sorted.map((c, i) => (
                <div key={c.id} className="fn-row">
                  <span className="fn-lbl">{tr(c.label)}</span>
                  <div className="fn-track"><div className={`fn-fill ${shown && i === 0 ? 'top' : ''} ${shown ? '' : 'fn-empty'}`} style={{ width: shown ? `${(c.n / COMPLAINTS_MAX) * 100}%` : '0%' }}>{shown ? c.n : ''}</div></div>
                </div>
              ))}
            </div>
          </Col>
          <Col>
            {shown
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Eng ko'pi — <b>«manzilni qayta so'raydi»</b>: 18 kishi. Son yetmaydi: muammo buyurtmani to'xtatadimi — bu <b>ta'sir</b>.</>, ru: <>Чаще всего — <b>«снова спрашивает адрес»</b>: 18 человек. Одного числа мало: останавливает ли проблема заказ — это <b>влияние</b>.</> })}</p></div>
              : null}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(storedAnswer ? new Set(VAGUE_PAIRS.map(p => p.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= VAGUE_PAIRS.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const cur = VAGUE_PAIRS.find(p => p.id === active);
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · aniq o'zgarish", ru: "Понятие · конкретное изменение" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `3 fikrni oching (${seen.size}/3)`, ru: `Откройте 3 отзыва (${seen.size}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Noaniq fikrni <span className="italic" style={{ color: T.accent }}>aniq vazifaga</span> aylantiring.</>, ru: <>Превратите неконкретный отзыв в <span className="italic" style={{ color: T.accent }}>конкретную задачу</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "«Menyu chalkash» — bu shikoyat, vazifa emas. AI yordamchi bunday gapdan to'g'ri kod yoza olmaydi. Uni aniq o'zgarishga siz aylantirasiz — kerak bo'lsa, avval odamdan aniqlashtirib so'raysiz. Har fikrni bosing.", ru: "«Меню запутанное» — это жалоба, а не задача. По такой фразе ИИ-помощник правильный код не напишет. В конкретное изменение её превращаете вы — если нужно, сначала уточните у человека. Нажмите на каждый отзыв." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {VAGUE_PAIRS.map(p => <button key={p.id} className={`pick-row ${active === p.id ? 'sel' : ''} ${seen.has(p.id) ? 'done-row' : 'tap-wave'}`} onClick={() => tap(p.id)}><span style={{ flex: 1 }}>{tr(p.xom)}</span><span className="pick-plus">{seen.has(p.id) ? '✓' : '›'}</span></button>)}
            </div>
          </Col>
          <Col>
            {cur
              ? <div className="fade-step" key={active} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="sk-info"><p className="note-h" style={{ color: T.ink2 }}>{tr({ uz: 'Foydalanuvchi aytdi', ru: "Пользователь сказал" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.xom)}</p></div>
                  <div className="sk-info va-concrete"><p className="note-h" style={{ color: T.success }}>{tr({ uz: "Aniq o'zgarish", ru: "Конкретное изменение" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.concrete)}</p></div>
                </div>
              : null}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — MARKAZIY: BIR HAFTALIK FIKRLAR =====
// Bosqichlar bittadan: kirish → saralash (dasta) → voronka → ustuvorlik → oqibat → yangi fikr → yakun.
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [stage, setStage] = useState(storedAnswer ? 'done' : 'intro'); // intro → sort → funnel → priority → consequence → loop → done
  const [funnelPick, setFunnelPick] = useState(null);
  const [funnelWrong, setFunnelWrong] = useState(false);
  const [fixPick, setFixPick] = useState(null);
  const [sc, setSc] = useState(0);
  const fired = useRef(!!storedAnswer);
  const flagsRef = useRef({ signalFinder: !!storedAnswer, funnelReader: !!storedAnswer, rightFixFirst: !!storedAnswer });
  const achMiss = useContext(AchMissCtx);                       // 151-qonun
  const wrongRef = useRef({ sort: false, funnel: false, fix: false });   // har bosqich alohida: bir xato boshqa bosqich nishonini o'chirmaydi
  const sid7 = SCREEN_META[screen] && SCREEN_META[screen].id;
  // F5 dan keyin ham eslab qoladi — har bosqich o'z yozuvi bilan (s7:sort · s7:funnel · s7:fix), ekran butunlay emas
  const f5Missed = (part) => !!(achMiss && sid7 && achMiss.missed.has(sid7 + ':' + part));
  const missPart = (part) => { wrongRef.current[part] = true; if (achMiss) achMiss.miss(screen, part); };
  const onSortWrong = () => missPart('sort');
  const done = stage === 'done';
  const bump = () => setSc(n => n + 1);

  const onSortSolved = () => {
    if (!flagsRef.current.signalFinder && !wrongRef.current.sort && !f5Missed('sort')) { flagsRef.current.signalFinder = true; onAnswer(screen, { stage: 'case', screenIdx: screen, signalFinder: true }); }
    setStage('funnel'); bump();
  };
  const pickFunnel = (id) => {
    if (id === 'start-menu') {
      if (!flagsRef.current.funnelReader && !wrongRef.current.funnel && !f5Missed('funnel')) { flagsRef.current.funnelReader = true; onAnswer(screen, { stage: 'case', screenIdx: screen, funnelReader: true }); }
      setFunnelPick(id); setFunnelWrong(false); setStage('priority'); bump();
    } else {
      missPart('funnel');
      setFunnelPick(id); setFunnelWrong(true); bump();
    }
  };
  const pickFix = (id) => {
    setFixPick(id);
    if (id !== 'menu') { missPart('fix'); setStage('consequence'); bump(); return; }
    if (!flagsRef.current.rightFixFirst && !wrongRef.current.fix && !f5Missed('fix')) flagsRef.current.rightFixFirst = true;
    setStage('consequence'); bump();
  };
  const closeLoop = () => {
    if (fired.current) { setStage('done'); return; }
    fired.current = true; setStage('done');
    onAnswer(screen, { stage: 'case', screenIdx: screen, question: "Bir haftalik fikrlar: nimani birinchi tuzatasiz?", correct: true, solved: true, picked: true, rightFixFirst: flagsRef.current.rightFixFirst, signalFinder: flagsRef.current.signalFinder, funnelReader: flagsRef.current.funnelReader });
  };
  // Voronka tanlovi — ballsiz; to'g'ri variant 2-o'rinda (4-savol A), tekshiruv id bo'yicha
  const gaps = [
    { id: 'menu-order', n: FUNNEL_STEPS[1].n - FUNNEL_STEPS[2].n, from: FUNNEL_STEPS[1].label, to: FUNNEL_STEPS[2].label },
    { id: 'start-menu', n: FUNNEL_STEPS[0].n - FUNNEL_STEPS[1].n, from: FUNNEL_STEPS[0].label, to: FUNNEL_STEPS[1].label }
  ];
  return (
    <Stage eyebrow={tr({ uz: "Markaziy · fikrlar ro'yxati", ru: "Главное · список отзывов" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Oxirigacha bajaring', ru: "Пройдите до конца" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bir haftalik fikrlar: nimani <span className="italic" style={{ color: T.accent }}>birinchi</span> tuzatasiz?</>, ru: <>Отзывы за неделю: что вы почините <span className="italic" style={{ color: T.accent }}>первым</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "Botingiz bir hafta ishladi, mijozlar 8 ta fikr yozdi. Avval ularni saralaysiz, keyin mijozlar qayerda ko'p ketib qolganini topasiz va nimani birinchi tuzatishni tanlaysiz.", ru: "Ваш бот проработал неделю, клиенты написали 8 отзывов. Сначала вы их сортируете, затем находите, где клиенты чаще всего уходят, и выбираете, что чинить первым." })}</Mentor>

        {stage === 'intro' && (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="flow-label">{tr({ uz: "Fikrlar ro'yxati — 8 ta fikr", ru: "Список отзывов — 8 отзывов" })}</p>
            <div className="fs-preview">{WEEK_FEEDBACK.map(c => <span key={c.id} className="fs-preview-chip">{tr(c.txt)}</span>)}</div>
            <button className="btn tap-hint" style={{ alignSelf: 'flex-start' }} onClick={() => { setStage('sort'); bump(); }}>{tr({ uz: '▶ Saralashni boshlash', ru: '▶ Начать разбор' })}</button>
          </div>
        )}
        {stage === 'sort' && (
          <div className="fade-step">
            <p className="flow-label">{tr({ uz: 'Har fikrni savatga joylang', ru: "Разложите каждый отзыв по корзинам" })}</p>
            <FeedbackSort items={WEEK_FEEDBACK} onSolved={onSortSolved} onWrong={onSortWrong} />
          </div>
        )}
        {stage === 'funnel' && (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="flow-label">{tr({ uz: "Saralash tugadi. Endi raqamlarga qaraymiz: mijozlar qayerda ketib qoladi?", ru: "Сортировка закончена. Теперь смотрим на цифры: где клиенты уходят?" })}</p>
            <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <><b>Voronka</b> — har qadamda nechta mijoz qolganini ko'rsatadi</>, ru: <><b>Воронка</b> — показывает, сколько клиентов осталось на каждом шаге</> })}</p>
            <div className="fn-funnel">
              {FUNNEL_STEPS.map((s, i) => (
                <div key={s.id} className="fn-step" style={{ width: `${40 + (s.n / FUNNEL_STEPS[0].n) * 60}%`, animationDelay: `${i * 0.33}s` }}>
                  <span className="fn-step-n">{s.n}</span><span className="fn-step-l">{tr(s.label)}</span>
                </div>
              ))}
            </div>
            <p className="flow-label">{tr({ uz: "Qaysi qadamda eng ko'p odam yo'qoldi?", ru: 'На каком шаге потеряли больше всего людей?' })}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {gaps.map(g => (
                <button key={g.id} className={`vcard ${funnelWrong && funnelPick === g.id ? 'shake' : ''}`} onClick={() => pickFunnel(g.id)}>
                  <span className="vlbl">{tr(g.from)} → {tr(g.to)} <span style={{ color: T.ink2, fontWeight: 500 }}>· {g.n} {tr({ uz: 'kishi', ru: 'чел.' })}</span></span>
                  <span className="vseen" style={{ color: T.ink3 }}>›</span>
                </button>
              ))}
            </div>
            {funnelWrong && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Bu yerda kam odam yo'qolgan — qadamlar farqini solishtiring.", ru: "Здесь потеряно мало людей — сравните разницу шагов." })}</p></div>}
          </div>
        )}
        {stage === 'priority' && (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="frame-success"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Topdingiz: 100 kishidan <b>60 tasi</b> menyuni <b>ochmasdan</b> ketgan. Menyuni ochganlardan esa 5 tasigina ketgan.</>, ru: <>Нашли: из 100 человек <b>60</b> ушли, <b>не открыв</b> меню. А из тех, кто открыл меню, ушли только 5.</> })}</p></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FIX_CHOICES.map(f => (
                <button key={f.id} className="vcard" onClick={() => pickFix(f.id)}>
                  <span className="vlbl">{tr(f.label)}</span>
                  <span className="vseen" style={{ color: T.ink3 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {stage === 'consequence' && (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {fixPick === 'menu' ? (
              <div className="frame-success"><p className="note-h" style={{ color: T.success }}>{tr({ uz: 'Menyu tugmasi tuzatildi', ru: "Кнопку меню починили" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bir haftadan keyin voronka: menyuni ochmasdan ketganlar endi 60 emas, <b>15 kishi</b>.</>, ru: <>Воронка через неделю: ушедших, не открыв меню, теперь не 60, а <b>15 человек</b>.</> })}</p></div>
            ) : (
              <div className="frame-warn"><p className="note-h" style={{ color: T.danger }}>{tr({ uz: '«Bot ahmoq» sharhiga javob yozildi', ru: "Написали ответ на отзыв «Бот тупой»" })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Voronka o'zgarmadi: hali ham 60 kishi menyuni ochmasdan ketyapti. Bu sharhda aniq muammo yo'q edi.", ru: "Воронка не изменилась: по-прежнему 60 человек уходят, не открыв меню. В этом отзыве не было конкретной проблемы." })}</p></div>
            )}
            {fixPick !== 'menu'
              ? <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setStage('priority')}>{tr({ uz: '↩ Qaytadan tanlash', ru: '↩ Выбрать заново' })}</button>
              : <button className="btn tap-hint" style={{ alignSelf: 'flex-start' }} onClick={() => { setStage('loop'); bump(); }}>{tr({ uz: 'Iteratsiyani yakunlash →', ru: "Завершить итерацию →" })}</button>}
          </div>
        )}
        {stage === 'loop' && (
          <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="flow-label">{tr({ uz: 'AvtoPizza botiga yangi fikr keldi', ru: "В бот AvtoPizza пришёл новый отзыв" })}</p>
            <TgChat title="AvtoPizza" minH={0}>
              <Bubble from="user">{tr({ uz: 'Endi menyu topildi, rahmat!', ru: "Теперь меню нашлось, спасибо!" })}</Bubble>
            </TgChat>
            <div className="frame-success"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Bitta iteratsiya tugadi, lekin yangi fikrlar kelaveradi. Shuning uchun ish yana tinglashdan boshlanadi.", ru: "Одна итерация закончилась, но новые отзывы продолжают приходить. Поэтому работа снова начинается со слушания." })}</p></div>
            <button className="btn tap-hint" style={{ alignSelf: 'flex-start' }} onClick={closeLoop}>{tr({ uz: '✓ Tushunarli', ru: '✓ Понятно' })}</button>
          </div>
        )}
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Butun yo'l o'tildi: saraladingiz, eng katta yo'qotishni topdingiz, eng ta'sirli tuzatishni tanladingiz.", ru: "Путь пройден: вы отсортировали отзывы, нашли самую большую потерю и выбрали самую влиятельную правку." })}</p></div>}
      </div>
    </Stage>
  );
};

const Screen8 = (props) => (
  <QuestionScreen {...props} idx={8} scope="module-mikro" eyebrow={{ uz: 'Mashq · 2-savol', ru: 'Практика · вопрос 2' }}
    questionText="Vaqtingiz oz. 18 kishi manzil bug'idan (buyurtma to'xtab qoladi), 3 kishi glutensiz pitsa yo'qligidan yozdi. Birinchi nimani qilasiz?"
    question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Vaqtingiz oz. <span className="mono">18</span> kishi manzil bug'idan (buyurtma to'xtab qoladi), <span className="mono">3</span> kishi glutensiz pitsa yo'qligidan yozdi. <span className="italic" style={{ color: T.accent }}>Birinchi</span> nimani qilasiz?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Времени мало. <span className="mono">18</span> человек написали про баг с адресом (заказ останавливается), <span className="mono">3</span> — про то, что нет безглютеновой пиццы. Что вы сделаете <span className="italic" style={{ color: T.accent }}>первым</span>?</h2></> }}
    options={[
      { uz: "Glutensiz pitsani: yangi taom ko'proq mijoz olib keladi", ru: "Безглютеновую пиццу: новое блюдо приведёт больше клиентов" },
      { uz: "Ikkalasini birga: hech bir fikr kutib qolmasin", ru: "Оба сразу: ни один отзыв не должен ждать" },
      { uz: "Manzil bug'ini: u ko'p odamni qattiq qiynayapti", ru: "Баг с адресом: он сильно мешает многим людям" },
      { uz: "Hech birini: bular oddiy shikoyat, jiddiy emas", ru: "Ничего: это обычные жалобы, несерьёзно" }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Manzil bug'i ko'p odamda (18) buyurtmani to'xtatadi — chastota ham, ta'sir ham katta.", ru: "Баг с адресом у многих (18) останавливает заказ — и частота, и влияние большие." }}
    explainWrong={{
      0: { uz: "Yangi taom qiziq, lekin uni 3 kishi so'ragan. Bug esa 18 kishini qiynayapti — u birinchi.", ru: "Новое блюдо — интересно, но его попросили 3 человека. А баг мешает 18 — он первый." },
      1: { uz: "Vaqt oz bo'lsa, ikkalasi ham chala chiqadi. Avval eng kattasini qiling.", ru: "Если времени мало, оба выйдут недоделанными. Сначала сделайте самое крупное." },
      3: { uz: "Aksincha: 18 kishi bir xil shikoyat qilgan — bu jiddiy fikr. Uni birinchi tuzatasiz.", ru: "Наоборот: 18 человек жалуются на одно и то же — это серьёзный отзыв. Его чините первым." },
      default: { uz: "Birinchi — eng ko'p odamni eng qattiq qiynayotgani: manzil bug'i.", ru: "Первым — то, что сильнее всего мешает больше всего людей: баг с адресом." }
    }} />
);

// ===== SCREEN 9 — BITTA TO'LIQ ITERATSIYA (v1 → v2): 5 qadam navbat bilan =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const STAGES = [
    { lbl: { uz: 'Tingla', ru: 'Слушай' }, tone: 'info', txt: { uz: "Bir haftada 38 ta shikoyat keldi.", ru: "За неделю пришло 38 жалоб." } },
    { lbl: { uz: 'Guruhla', ru: 'Группируй' }, tone: 'info', txt: { uz: "Bir xillari birlashtirildi: manzil — 18, narx — 12, uzun javob — 5, glutensiz pitsa — 3.", ru: "Одинаковые объединили: адрес — 18, цена — 12, длинные ответы — 5, безглютеновая пицца — 3." } },
    { lbl: { uz: 'Tanla', ru: 'Выбирай' }, tone: 'info', txt: { uz: "Manzil: eng ko'p odam va kuchli og'riq. Glutensiz taklif kutadi.", ru: "Адрес: больше всего людей и сильная боль. Предложение про безглютеновую пиццу подождёт." } },
    { lbl: { uz: 'Tuzat', ru: 'Чини' }, tone: 'ok', txt: { uz: "AI yordamchiga aniq buyruq: «Manzil kelgach, uni holatga saqla va qayta so'rama». Botning ikkinchi versiyasi — v2 chiqdi.", ru: "Чёткая команда ИИ-помощнику: «Когда придёт адрес, сохрани его в состоянии и не спрашивай снова». Вышла вторая версия бота — v2." } },
    { lbl: { uz: 'Qayta tingla', ru: 'Слушай снова' }, tone: 'ok', txt: { uz: "v2 dan keyin yana fikr yig'asiz: shikoyat kamaydimi va endi nima birinchi?", ru: "После v2 вы снова собираете отзывы: стало ли меньше жалоб и что теперь первое?" } }
  ];
  const [step, setStep] = useState(storedAnswer ? STAGES.length : 0);
  const [sc, setSc] = useState(0);
  const done = step >= STAGES.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const advance = () => { if (!done) { setStep(n => n + 1); setSc(n => n + 1); } };
  return (
    <Stage eyebrow={tr({ uz: 'Hayotiy · iteratsiya', ru: "Из жизни · итерация" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Iteratsiyani yuriting (${step}/${STAGES.length})`, ru: `Пройдите итерацию (${step}/${STAGES.length})` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>AvtoPizza: bitta to'liq <span className="italic" style={{ color: T.accent }}>iteratsiya</span>.</>, ru: <>AvtoPizza: одна полная <span className="italic" style={{ color: T.accent }}>итерация</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Hammasi birga: shikoyatdan yangi versiyagacha. Tugmani bosib, iteratsiyani boshidan oxirigacha yuring.", ru: "Всё вместе: от жалобы до новой версии. Нажимайте кнопку и пройдите итерацию от начала до конца." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {STAGES.slice(0, step).map((s, i) => (
                <div key={i} className={s.tone === 'ok' ? 'frame-success fade-step' : 'sk-info fade-step'}>
                  <p className="note-h" style={{ margin: '0 0 4px' }}>{tr(s.lbl)}</p>
                  <p className="body" style={{ margin: 0, color: T.ink }}>{tr(s.txt)}</p>
                </div>
              ))}
            </div>
            <button className={`btn ${step === 0 && !done ? 'tap-hint' : ''}`} style={{ alignSelf: 'flex-start' }} disabled={done} onClick={advance}>{done ? tr({ uz: '✓ Iteratsiya tugadi', ru: "✓ Итерация пройдена" }) : step === 0 ? tr({ uz: '▶ Tinglashni boshlash', ru: '▶ Начать слушать' }) : tr({ uz: 'Keyingi qadam →', ru: 'Следующий шаг →' })}</button>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Mijoz ko'radigan chat", ru: "Чат, который видит клиент" })}</p>
            {done
              ? <TgChat title="AvtoPizza" minH={0}><Bubble from="user">{tr({ uz: 'Margarita, Chilonzor 5', ru: 'Маргарита, Чиланзар 5' })}</Bubble><Bubble from="bot">{tr({ uz: 'Qabul qilindi: Margarita. Manzil: Chilonzor 5.', ru: "Принято: Маргарита. Адрес: Чиланзар 5." })}</Bubble></TgChat>
              : <TgChat title="AvtoPizza" minH={0}><Bubble from="user">{tr({ uz: 'Margarita, Chilonzor 5', ru: 'Маргарита, Чиланзар 5' })}</Bubble><Bubble from="bot">{tr({ uz: 'Manzilingizni yuboring', ru: "Отправьте ваш адрес" })}</Bubble><Bubble from="user">{tr({ uz: 'Yozgan edim: Chilonzor 5', ru: "Я уже писал: Чиланзар 5" })}</Bubble></TgChat>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

const Screen10 = (props) => (
  <QuestionScreen {...props} idx={10} scope="module-mikro" eyebrow={{ uz: 'Mashq · 3-savol', ru: 'Практика · вопрос 3' }}
    questionText="100 foydalanuvchidan bittasi faqat o'ziga kerak bo'lgan narsani so'radi. Nima qilasiz?"
    question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>100 foydalanuvchidan bittasi faqat <span className="italic" style={{ color: T.accent }}>o'ziga kerak</span> bo'lgan narsani so'radi. Nima qilasiz?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Один пользователь из 100 попросил то, что нужно <span className="italic" style={{ color: T.accent }}>только ему</span>. Что вы сделаете?</h2></> }}
    options={[
      { uz: "Ko'pchilikka keraklisini qilaman, bu so'rov kutadi", ru: "Сделаю то, что нужно большинству, а эта просьба подождёт" },
      { uz: "Darrov qo'shaman: har bir so'rov bajarilishi shart", ru: "Добавлю сразу: каждая просьба должна быть выполнена" },
      { uz: "U foydalanuvchini bloklayman: u xalaqit beryapti", ru: "Заблокирую этого пользователя: он мешает" },
      { uz: "Hamma so'rovni navbati bilan, istisnosiz qo'shaman", ru: "Добавлю все просьбы по очереди, без исключений" }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Vaqtni ko'pchilikka ta'sir qiladigan ishga sarflaysiz — tor so'rov kutadi.", ru: "Время вы тратите на то, что влияет на большинство, — узкая просьба подождёт." }}
    explainWrong={{
      1: { uz: "Har so'rovni qo'shsangiz, bot chalkashib ketadi va ko'pchilik uchun yomonlashadi.", ru: "Если добавлять каждую просьбу, бот запутается и станет хуже для большинства." },
      2: { uz: "Foydalanuvchini bloklash — fikrdan qochish. Xushmuomalalik bilan «hozir emas» deyish kifoya.", ru: "Заблокировать пользователя — значит убежать от отзыва. Достаточно вежливо сказать «не сейчас»." },
      3: { uz: "Hammasini qo'shsangiz, bot ortiqcha og'irlashadi. Qaysi birini qilishni o'zingiz tanlaysiz.", ru: "Если добавить всё, бот станет слишком тяжёлым. Что делать, выбираете вы сами." },
      default: { uz: "Ko'pchilikka foydali ishni birinchi qilasiz, tor so'rovga «hozir emas» deysiz.", ru: "Сначала делаете полезное большинству, а узкой просьбе говорите «не сейчас»." }
    }} />
);

const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const TRAPS = [
    { id: 't1', label: { uz: 'Bir kishi — hamma emas', ru: "Один человек — ещё не все" }, desc: { uz: "Bir kishining taklifini darrov qo'shmang. Jiddiy bug'ni esa bir kishi aytsa ham tekshiring.", ru: "Не добавляйте сразу предложение одного человека. А серьёзный баг проверьте, даже если о нём сказал один." } },
    { id: 't2', label: { uz: "Hamma taklifni qo'shish", ru: "Добавлять все предложения" }, desc: { uz: "Har taklifni qo'shsangiz, bot og'irlashadi va chalkashadi. Botning asosiy ishida qoling.", ru: "Если добавлять каждое предложение, бот потяжелеет и запутается. Держитесь основной работы бота." } },
    { id: 't3', label: { uz: "Maqtovni o'tkazib yuborish", ru: "Пропускать похвалу" }, desc: { uz: "Aniq maqtov («tez yetkazdi») nima yaxshi ishlayotganini aytadi. Tuzatayotganda o'shani buzib qo'ymang.", ru: "Конкретная похвала («быстро доставили») говорит, что работает хорошо. Во время правки не сломайте это." } }
  ];
  const [seen, setSeen] = useState(storedAnswer ? new Set(TRAPS.map(t => t.id)) : new Set());
  const [active, setActive] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= TRAPS.length;
  const tap = (id) => { setActive(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const cur = TRAPS.find(t => t.id === active);
  return (
    <Stage eyebrow={tr({ uz: 'Ehtiyot · tuzoqlar', ru: 'Осторожно · ловушки' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `3 tuzoqni ko'ring (${seen.size}/3)`, ru: `Посмотрите 3 ловушки (${seen.size}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Fikrni qo'llashda <span className="italic" style={{ color: T.accent }}>3 ta tuzoq</span> bor.</>, ru: <>Когда применяете отзывы, есть <span className="italic" style={{ color: T.accent }}>3 ловушки</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Fikrni tinglash yaxshi, lekin uni noto'g'ri qo'llash botni buzadi. Mana 3 ta ko'p uchraydigan xato. Har birini bosing.", ru: "Слушать отзывы — хорошо, но если применять их неправильно, бот сломается. Вот 3 частые ошибки. Нажмите на каждую." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="fade-up delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {TRAPS.map(t => <button key={t.id} className={`gchip ${seen.has(t.id) ? 'seen' : 'tap-wave'} ${active === t.id ? 'cur' : ''}`} onClick={() => tap(t.id)}>{tr(t.label)}<span className="gchip-mk" aria-hidden="true">{seen.has(t.id) ? '✓' : '›'}</span></button>)}
            </div>
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Fikr yo'l ko'rsatadi, lekin buyruq emas: uni saralab, o'lchab qo'llaysiz.", ru: "Отзыв показывает путь, но это не приказ: вы его сортируете, измеряете и только потом применяете." })}</p></div>}
          </Col>
          <Col>
            {cur
              ? <div className="frame-warn fade-step" key={active}><p className="note-h" style={{ margin: '0 0 4px' }}>{tr(cur.label)}</p><p className="body" style={{ margin: 0, color: T.ink }}>{tr(cur.desc)}</p></div>
              : null}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — QAYTA O'LCHASH: v2 ustuni bosilguncha «?»; bosilgach to'lib, 1 gacha qisqaradi va yashil bo'ladi (A7) =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [show, setShow] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const animRef = useRef(false);
  const done = show;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: "O'lchash · natija", ru: 'Измерение · результат' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Natijani tekshiring', ru: 'Проверьте результат' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tuzatdingiz — lekin <span className="italic" style={{ color: T.accent }}>ishladimi</span>? Qayta o'lchaysiz.</>, ru: <>Починили — а <span className="italic" style={{ color: T.accent }}>сработало</span> ли? Измеряете заново.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Tuzatish — hali taxmin. Ishladimi — <b style={{ color: T.ink }}>qayta o'lchab</b> bilasiz: v2 chiqqandan keyin o'sha shikoyat kamaydimi? Tugmani bosing.</>, ru: <>Правка — пока только предположение. Сработала ли она, покажет <b style={{ color: T.ink }}>повторное измерение</b>: после выхода v2 стало ли меньше той жалобы? Нажмите кнопку.</> })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            <div className="sk-info"><p className="note-h">{tr({ uz: '«Manzilni qayta so\'raydi» shikoyati', ru: "Жалоба «снова спрашивает адрес»" })}</p><div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <div className="fn-row"><span className="fn-lbl">{tr({ uz: 'v1 (oldin)', ru: 'v1 (до)' })}</span><div className="fn-track"><div className="fn-fill top" style={{ width: '90%' }}>18</div></div></div>
              <div className="fn-row"><span className="fn-lbl">{tr({ uz: 'v2 (keyin)', ru: 'v2 (после)' })}</span><div className="fn-track">{show
                ? <div className={`fn-fill fn-ok ${animRef.current ? 'fn-measure' : ''}`} style={{ width: '8%' }}>1</div>
                : <span className="fn-q">?</span>}</div></div>
            </div></div>
            <button className={`btn ${show ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} disabled={show} onClick={() => { animRef.current = true; setShow(true); setSc(n => n + 1); }}>{show ? tr({ uz: "✓ O'lchandi", ru: '✓ Измерено' }) : tr({ uz: "▶ Yangi fikrlarni o'lchash", ru: '▶ Измерить новые отзывы' })}</button>
          </Col>
          <Col>
            {show
              ? <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Shikoyat 18 dan 1 ga tushdi — tuzatish <b>ishladi</b>. Endi birinchi o'rinda <b>«narx ko'rinmaydi»</b> (12 kishi).</>, ru: <>Жалоб стало 1 вместо 18 — правка <b>сработала</b>. Теперь на первом месте <b>«не видно цены»</b> (12 человек).</> })}</p></div>
              : null}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

const PromptCard = ({ children, tone }) => (
  <div className={`prompt-card ${tone || ''}`}><p className="prompt-text">{children}</p></div>
);

// ===== SCREEN 13 — AMALIYOT: PROMPT UCH QISMDAN YIG'ILADI (6-dars system prompt yig'ish naqshi) =====
// A6: qismlar bittadan — joriy qism va uning 3 varianti; to'g'ri tanlangach qism «✓ Qayerda — …» qatoriga yig'iladi,
// bo'lagi o'ngdagi promptga tushadi. Ballsiz: to'g'ri variant o'rni aralash, tekshiruv variant id bo'yicha.
const PB_PARTS = [
  { id: 'where', q: { uz: 'Qayerda?', ru: "Где?" }, line: { uz: "bot.js dagi buyurtma tasdig'i xabarida narx yo'q.", ru: "В сообщении о подтверждении заказа в bot.js нет цены." }, opts: [
    { id: 'all', ok: false, t: { uz: 'Butun botda', ru: "Во всём боте" }, why: { uz: "Muammo faqat tasdiq xabarida — butun botni o'zgartirish shart emas.", ru: "Проблема только в сообщении о подтверждении — менять весь бот не нужно." } },
    { id: 'confirm', ok: true, t: { uz: "bot.js dagi buyurtma tasdig'i xabarida", ru: "В сообщении о подтверждении заказа в bot.js" } },
    { id: 'menu', ok: false, t: { uz: 'Menyu tugmasida', ru: "В кнопке меню" }, why: { uz: "Narx menyuda bor — yo'qolgani tasdiq xabarida.", ru: "Цена в меню есть — пропала она в сообщении о подтверждении." } }
  ] },
  { id: 'what', q: { uz: "Nima o'zgarsin?", ru: "Что изменить?" }, line: { uz: "Tasdiq xabariga taom nomi va narxini qo'sh.", ru: "Добавь в сообщение о подтверждении название блюда и цену." }, opts: [
    { id: 'cheap', ok: false, t: { uz: 'Narxlarni pasaytir', ru: "Снизь цены" }, why: { uz: "Narx to'g'ri, faqat ko'rinmayapti.", ru: "Цена правильная, её просто не видно." } },
    { id: 'short', ok: false, t: { uz: 'Tasdiq xabarini qisqartir', ru: "Сократи сообщение о подтверждении" }, why: { uz: "Xabar qisqa emas — unda narx yo'q.", ru: "Сообщение не длинное — в нём нет цены." } },
    { id: 'add', ok: true, t: { uz: "Tasdiq xabariga taom nomi va narxini qo'sh", ru: "Добавь в сообщение о подтверждении название блюда и цену" } }
  ] },
  { id: 'keep', q: { uz: 'Nima buzilmasin?', ru: "Что не сломать?" }, line: { uz: "Manzil bir marta so'ralishi o'zgarmasin.", ru: "Адрес по-прежнему спрашивается один раз." }, opts: [
    { id: 'addr', ok: true, t: { uz: "Manzil bir marta so'ralishi o'zgarmasin", ru: "Адрес по-прежнему спрашивается один раз" } },
    { id: 'btns', ok: false, t: { uz: 'Menyu tugmalari olib tashlansin', ru: "Убрать кнопки меню" }, why: { uz: "Tugmalar ishlayapti — ularni olib tashlash yangi muammo.", ru: "Кнопки работают — убрать их значит создать новую проблему." } },
    { id: 'redo', ok: false, t: { uz: 'Botni noldan qayta yoz', ru: "Перепиши бота с нуля" }, why: { uz: "Ishlab turgan qismlar ham yo'qoladi.", ru: "Пропадут и части, которые уже работают." } }
  ] }
];
const pbOpt = (part, choice) => part.opts.find(o => o.id === choice[part.id]);
const pbOk = (part, choice) => { const o = pbOpt(part, choice); return !!(o && o.ok); };
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [choice, setChoice] = useState(() => storedAnswer ? { where: 'confirm', what: 'add', keep: 'addr' } : {});
  const [reopen, setReopen] = useState(null);
  const [sent, setSent] = useState(!!storedAnswer);
  const [sc, setSc] = useState(0);
  const wrongEverRef = useRef(false);
  const allOk = PB_PARTS.every(p => pbOk(p, choice));
  const firstOpen = PB_PARTS.find(p => !pbOk(p, choice));
  const curId = reopen || (firstOpen && firstOpen.id);
  const done = sent;
  const pick = (part, opt) => {
    if (sent) return;
    if (!opt.ok) wrongEverRef.current = true;
    setChoice(c => ({ ...c, [part.id]: opt.id }));
    if (opt.ok && reopen === part.id) setReopen(null);
    setSc(n => n + 1);
  };
  const send = () => {
    if (sent || !allOk) return;
    setSent(true); setSc(n => n + 1);
    if (storedAnswer === undefined) onAnswer(screen, { stage: 'builder', screenIdx: screen, correct: !wrongEverRef.current, solved: true, picked: true });
  };
  const doneLbl = (part) => tr(part.q).replace(/\?$/, '');
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · aniq prompt', ru: "Практика · чёткий промпт" })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Promptni yig'ing", ru: "Соберите промпт" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>«Narx ko'rinmaydi» — promptni <span className="italic" style={{ color: T.accent }}>o'zingiz yig'ing</span>.</>, ru: <>«Не видно цены» — промпт <span className="italic" style={{ color: T.accent }}>соберите сами</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Sababi: buyurtma tasdiqlanganda bot narxni yozmaydi. AI yordamchiga (sinfda — gemini.google.com) prompt uch qismdan yig'iladi. Har qismga bittadan tanlang.", ru: "Причина: при подтверждении заказа бот не пишет цену. Промпт для ИИ-помощника (в классе — gemini.google.com) собирается из трёх частей. Для каждой части выберите один вариант." })}</Mentor>
        <Zoomable><div className="split">
          <Col>
            {PB_PARTS.map(part => {
              if (!sent && part.id === curId) {
                const sel = pbOpt(part, choice);
                const wrongNow = !!(sel && !sel.ok);
                return (
                  <div key={part.id} className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <p className="flow-label">{tr(part.q)}</p>
                    {part.opts.map(o => {
                      const on = choice[part.id] === o.id;
                      return (<button key={o.id} className={`pick-row ${on ? 'sel' : ''} ${on && !o.ok ? 'wrong shake' : ''}`} onClick={() => pick(part, o)}><span style={{ flex: 1 }}>{tr(o.t)}</span><span className="pick-plus">{on && !o.ok ? '✕' : '›'}</span></button>);
                    })}
                    {wrongNow && <p className="pb-why fade-step" key={sel.id}>{tr(sel.why)}</p>}
                  </div>
                );
              }
              if (pbOk(part, choice)) return (
                <div key={part.id} className="pb-done fade-step">
                  <span className="pb-done-ok">✓</span>
                  <span className="pb-done-t"><b>{doneLbl(part)}</b> — {tr(pbOpt(part, choice).t)}</span>
                  {!sent && <button className="pb-redo" onClick={() => { setReopen(part.id); setSc(n => n + 1); }} aria-label={tr({ uz: "O'zgartirish", ru: "Изменить" })} title={tr({ uz: "O'zgartirish", ru: "Изменить" })}>↻</button>}
                </div>
              );
              return null;
            })}
            {allOk && !reopen && <button className={`btn ${sent ? '' : 'tap-hint'}`} style={{ alignSelf: 'flex-start' }} disabled={sent} onClick={send}>{sent ? tr({ uz: '✓ Tuzatildi', ru: '✓ Починено' }) : tr({ uz: "▶ AI'ga yuborish", ru: "▶ Отправить ИИ" })}</button>}
          </Col>
          <Col>
            <PromptCard tone={allOk ? 'live' : ''}>
              {PB_PARTS.map((part, i) => <React.Fragment key={part.id}>{i > 0 ? ' ' : ''}{pbOk(part, choice) ? tr(part.line) : <span className="pb-gap">…</span>}</React.Fragment>)}
            </PromptCard>
            {sent && <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p className="flow-label" style={{ color: T.success }}>{tr({ uz: 'v3 — tuzatilgandan keyin', ru: "v3 — после правки" })}</p>
              <TgChat title="AvtoPizza" minH={0}>
                <Bubble from="user">{tr({ uz: 'Margarita, Chilonzor 5', ru: 'Маргарита, Чиланзар 5' })}</Bubble>
                <Bubble from="bot">{tr({ uz: "Qabul qilindi: Margarita — 35 000 so'm. Manzil: Chilonzor 5.", ru: "Принято: Маргарита — 35 000 сумов. Адрес: Чиланзар 5." })}</Bubble>
              </TgChat>
            </div>}
          </Col>
        </div></Zoomable>
      </div>
    </Stage>
  );
};

const Screen14 = (props) => (
  <QuestionScreen {...props} idx={14} scope="module-mikro" eyebrow={{ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' }}
    questionText="Eng katta shikoyatni tuzatib, yangi versiyani chiqardingiz. Endi nima qilasiz?"
    question={{ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Eng katta shikoyatni tuzatib, yangi versiyani chiqardingiz. <span className="italic" style={{ color: T.accent }}>Endi</span> nima qilasiz?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Вы починили то, на что жаловались больше всего, и выпустили новую версию. Что вы сделаете <span className="italic" style={{ color: T.accent }}>теперь</span>?</h2></> }}
    options={[
      { uz: "Ish tugadi: bot endi mukammal, fikr kerak emas", ru: "Работа закончена: бот теперь идеален, отзывы не нужны" },
      { uz: "Qolgan hamma kodni ham birdaniga qayta yozaman", ru: "Перепишу сразу и весь остальной код" },
      { uz: "Fikr yig'ishni to'xtataman: ular faqat shovqin", ru: "Перестану собирать отзывы: это только шум" },
      { uz: "Tuzatish ishladimi, yangi fikrlardan tekshiraman", ru: "Проверю по новым отзывам, сработала ли правка" }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Har tuzatishdan keyin yana tinglaysiz — keyingi iteratsiya shundan boshlanadi.", ru: "После каждой правки вы снова слушаете — с этого начинается следующая итерация." }}
    explainWrong={{
      0: { uz: "Mukammal mahsulot bo'lmaydi: ehtiyojlar o'zgaradi, yangi muammolar chiqadi. Tinglashda davom eting.", ru: "Идеального продукта не бывает: потребности меняются, появляются новые проблемы. Продолжайте слушать." },
      1: { uz: "Hammasini birdan qayta yozish xavfli: ishlab turgan qismlar ham buzilishi mumkin. Yaxshilash bittadan, o'lchab boriladi.", ru: "Переписывать всё сразу опасно: могут сломаться и работающие части. Улучшают по одному, с измерением." },
      2: { uz: "Tinglashni to'xtatsangiz, tuzatish ishladimi — bilmay qolasiz.", ru: "Если перестанете слушать, не узнаете, сработала ли правка." },
      default: { uz: "Yangi fikrlarni yig'ib, tuzatish ishladimi — tekshirasiz.", ru: "Вы собираете новые отзывы и проверяете, сработала ли правка." }
    }} />
);

// ===== SCREEN 15 — YAKUNIY: ITERATSIYA QADAMLARINI TO'G'RI TARTIBDA YIG'ISH =====
// Final — bo'laklar hammasi birdan (A6 istisnosi). Joylar «1-qadam…» (tartibni ochib qo'ymaydi).
// A7: to'g'ri yig'ilgach 5-qadamdan 1-qadamga qaytuvchi strelka chiziladi — faqat to'g'ri javobdan keyin.
const FEEDBACK_CYCLE = [
  { id: 'listen', label: { uz: 'Tingla', ru: 'Слушай' } },
  { id: 'group', label: { uz: 'Guruhla', ru: 'Группируй' } },
  { id: 'pick', label: { uz: 'Tanla', ru: 'Выбирай' } },
  { id: 'fix', label: { uz: 'Tuzat', ru: 'Чини' } },
  { id: 'relisten', label: { uz: 'Qayta tingla', ru: 'Слушай снова' } }
];
// Yorliq {uz,ru} bo'lib saqlanadi — DragDropOrder render'da tr() qiladi; tartib-tekshiruv id bo'yicha (til-mustaqil).
const FEEDBACK_CYCLE_ITEMS = FEEDBACK_CYCLE.map(c => ({ id: c.id, label: { uz: `${c.label.uz}`, ru: `${c.label.ru}` } }));
const FEEDBACK_CYCLE_ORDER = FEEDBACK_CYCLE.map(c => c.id);
const CYCLE_SLOTS = [1, 2, 3, 4, 5].map(n => ({ uz: `${n}-qadam`, ru: `Шаг ${n}` }));
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [done, setDone] = useState(!!storedAnswer);
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
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Oxirgi qadam: iteratsiya qadamlarini to'g'ri tartibda yig'ing.", correct: firstOk, firstAttemptCorrect: firstOk, solved: true, picked: firstOk ? 0 : 1 });
  };
  const onChange = (slots) => {
    if (fired.current) return;
    const full = slots.every(s => s !== null);
    if (!full) return;
    const solved = slots.every((s, i) => s === FEEDBACK_CYCLE_ORDER[i]);
    if (!solved) { hadWrongRef.current = true; if (achMiss) achMiss.miss(screen); }
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Итог · практика' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: "Iteratsiyani yig'ing", ru: "Соберите итерацию" }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Oxirgi qadam: iteratsiya qadamlarini <span className="italic" style={{ color: T.accent }}>tartibga</span> soling.</>, ru: <>Последний шаг: расставьте шаги итерации <span className="italic" style={{ color: T.accent }}>по порядку</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Bo'laklarni sudrab to'g'ri tartibga qo'ying.", ru: "Перетащите блоки в верном порядке." })}</Mentor>
        <DragDropOrder
          items={FEEDBACK_CYCLE_ITEMS}
          hints={CYCLE_SLOTS}
          cycle
          onSolved={onSolved}
          onChange={onChange} />
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>✓ Iteratsiya tayyor: <b>tingla → guruhla → tanla → tuzat → qayta tingla</b>. Yangi fikrlar bilan yana boshlanadi.</>, ru: <>✓ Итерация готова: <b>слушай → группируй → выбирай → чини → слушай снова</b>. С новыми отзывами всё начинается заново.</> })}</p>
          {hadWrongRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — посмотреть тему ещё раз" })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== NISHONLAR — faqat REAL bosqichlar uchun (tekin emas). Kalitlar o'zgarmaydi (progress/server), nomi va tavsifi — MD v2 =====
const ACHIEVEMENTS = {
  signalFinder:  { icon: '📡', name: 'Feedback Sorter', desc: { uz: "Aniq va noaniq fikrlarni birinchi urinishda to'g'ri saraladingiz", ru: "Вы с первой попытки верно разложили конкретные и неконкретные отзывы" } },
  funnelReader:  { icon: '🔻', name: 'Funnel Reader',   desc: { uz: "Voronkadagi eng katta yo'qotishni topdingiz", ru: "Вы нашли, где в воронке самая большая потеря" } },
  rightFixFirst: { icon: '🎯', name: 'Right Fix First', desc: { uz: "Eng ta'sirli tuzatishni birinchi tanladingiz", ru: 'Вы первым выбрали самое влиятельное исправление' } },
  loopCloser:    { icon: '🔁', name: 'Full Iteration',  desc: { uz: "Iteratsiya qadamlarini birinchi urinishda to'g'ri tartibladingiz", ru: "Вы с первой попытки расставили шаги итерации в верном порядке" } },
};
// Ekran id → nishon. FAQAT ma'noli ekranlar: s7 (markaziy — saralash/voronka/ustuvorlik, har biri real xato imkoni bilan) uchta
// nishonni o'zi beradi (root recordAnswer bayroqlar bo'yicha) · s15 (final — DragDropOrder, 1-urinishda to'g'ri tartib).
const ACH_TRIGGERS = { s15: 'loopCloser' };

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
const Q_LABELS = {
  4: { uz: '1 — Fikr turi', ru: '1 — Тип отзыва' },
  8: { uz: '2 — Ustuvorlik', ru: '2 — Приоритет' },
  10: { uz: '3 — Fokus', ru: '3 — Фокус' },
  14: { uz: '4 — Tuzatishdan keyin', ru: "4 — После правки" },
  15: { uz: '5 — Iteratsiya tartibi', ru: "5 — Порядок итерации" }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si (fikr va iteratsiya atamalari)
const QZ_BG_SHAPES = [
  { ch: 'iteratsiya',  l: 5,  t: 10, s: 26, d: 19, dl: 0 },
  { ch: 'v2',          l: 85, t: 8,  s: 26, d: 23, dl: 1.5 },
  { ch: 'bug',         l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'taklif',      l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: 'chastota',    l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: "ta'sir",      l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: 'voronka',     l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: '↻',           l: 34, t: 62, s: 20, d: 29, dl: 3.4 },
  { ch: 'fikr',        l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3, mexanik ketma-ketlik yo'q).
// 🎓 Metodist: savol matni va variant uzunliklari sayqallanadi · ⚡ Jonli: `correct` qiymatlari INLINE_KEYS bilan sinxron tekshiriladi.
const QUIZ_BANK = [
  { q: { uz: "Foydalanuvchi: «/start bosdim, menyu tugmasi chiqmadi». Bu qanday fikr?", ru: "Пользователь: «Нажал /start, кнопка меню не появилась». Что это за отзыв?" }, opts: [{ uz: "Maqtov: mijoz botdan mamnun", ru: "Похвала: клиент доволен ботом" }, { uz: "Bug: aniq joy va muammo bor", ru: "Баг: есть конкретное место и проблема" }, { uz: "Taklif: yangi narsa so'ralgan", ru: "Предложение: просят что-то новое" }, { uz: "Shovqin: e'tibor shart emas", ru: "Шум: внимание не нужно" }], correct: 1 },
  { q: { uz: "«Yaxshi bot» degan fikr nega kam foydali?", ru: "Почему отзыв «Хороший бот» мало полезен?" }, opts: [{ uz: "Chunki bu salbiy fikr", ru: "Потому что это негативный отзыв" }, { uz: "Chunki maqtov kam uchraydi", ru: "Потому что похвала встречается редко" }, { uz: "Chunki botni yomon ko'rsatadi", ru: 'Потому что он показывает бота плохим' }, { uz: "Chunki aniq joy aytilmagan", ru: "Потому что не названо конкретное место" }], correct: 3 },
  { q: { uz: "18 kishi bir xil shikoyat qildi, 1 kishi boshqa narsani aytdi. Qaysi birini birinchi ko'rib chiqasiz?", ru: "18 человек пожаловались на одно, 1 человек сказал другое. Что вы рассмотрите первым?" }, opts: [{ uz: "18 kishinikini: ko'pchilik aytgan", ru: "Жалобу 18 человек: так сказало большинство" }, { uz: "1 kishinikini: u eng birinchi yozgan", ru: "Отзыв 1 человека: он написал самым первым" }, { uz: "Ikkalasini ham bir vaqtning o'zida", ru: "Оба одновременно" }, { uz: "Hech birini: bular shunchaki hissiyot", ru: "Ничего: это просто эмоции" }], correct: 0 },
  { q: { uz: "Qaysi tuzatishni birinchi qilishni nimaga qarab tanlaysiz?", ru: "Как вы выбираете, какую правку сделать первой?" }, opts: [{ uz: "Eng jahl bilan yozilgan fikrga qarab", ru: "По отзыву, написанному злее всех" }, { uz: "Eng birinchi kelgan fikrga qarab", ru: "По отзыву, пришедшему самым первым" }, { uz: "Ko'p aytilgani va qattiq qiynaganiga", ru: "По тому, что чаще звучит и сильнее мешает" }, { uz: "O'zimga eng qiziq tuyulganiga qarab", ru: "По тому, что мне самому интереснее" }], correct: 2 },
  { q: { uz: "Voronkada eng katta yo'qotish qayerda ko'rinadi?", ru: "Где в воронке видна самая большая потеря?" }, opts: [{ uz: "Eng ko'p odam turgan birinchi qadamda", ru: "На первом шаге, где больше всего людей" }, { uz: "Odam soni eng ko'p kamaygan joyda", ru: "Там, где число людей упало сильнее всего" }, { uz: "Bot eng sekin javob bergan joyda", ru: "Там, где бот ответил медленнее всего" }, { uz: "Eng ko'p maqtov kelgan qadamda", ru: 'На шаге, где больше всего похвалы' }], correct: 1 },
  { q: { uz: "Menyu tugmasi tuzatilgach, menyuni ochmasdan ketganlar 60 dan 15 ga tushdi. Bu nimani bildiradi?", ru: "После правки кнопки меню ушедших, не открыв меню, стало не 60, а 15. О чём это говорит?" }, opts: [{ uz: "Tuzatish ishlamadi, hamma ketyapti", ru: "Правка не сработала, все уходят" }, { uz: "Sonlar tasodifiy, xulosa chiqmaydi", ru: "Числа случайные, вывода нет" }, { uz: "Botda yana yangi bug paydo bo'ldi", ru: "В боте снова появился новый баг" }, { uz: "Tuzatish ishladi, muammo kamaydi", ru: "Правка сработала, проблема уменьшилась" }], correct: 3 },
  { q: { uz: "«Bot ahmoq» sharhiga javob yozish nega eng ta'sirli tuzatish emas?", ru: "Почему ответ на отзыв «Бот тупой» — не самая влиятельная правка?" }, opts: [{ uz: "Unda nimani tuzatish kerakligi yo'q", ru: "В нём не сказано, что нужно чинить" }, { uz: "Bunday sharhga javob yozib bo'lmaydi", ru: "На такой отзыв нельзя ответить" }, { uz: "Uni yozgan odam botni ishlatmagan", ru: "Его автор не пользовался ботом" }, { uz: "Javob yozish juda ko'p vaqt oladi", ru: "Ответ займёт слишком много времени" }], correct: 0 },
  { q: { uz: "100 kishidan bittasi faqat o'ziga kerak narsani so'radi. Nima qilasiz?", ru: "Один из 100 попросил то, что нужно только ему. Что вы сделаете?" }, opts: [{ uz: "Darrov qo'shaman: har so'rov bajarilsin", ru: "Добавлю сразу: каждая просьба выполняется" }, { uz: "U foydalanuvchini botdan bloklayman", ru: "Заблокирую этого пользователя в боте" }, { uz: "Avval ko'pchilikka keraklisini qilaman", ru: "Сначала сделаю то, что нужно большинству" }, { uz: "Hamma so'rovni navbati bilan qo'shaman", ru: "Добавлю все просьбы по очереди" }], correct: 2 },
  { q: { uz: "Tuzatishdan keyin nima qilasiz?", ru: "Что вы делаете после правки?" }, opts: [{ uz: "Hech narsa: tuzatish albatta ishlaydi", ru: "Ничего: правка точно сработает" }, { uz: "Qayta o'lchayman: shikoyat kamaydimi", ru: "Измерю заново: стало ли меньше жалоб" }, { uz: "Darhol yana katta o'zgarish qilaman", ru: "Сразу сделаю ещё одно большое изменение" }, { uz: "Fikr yig'ishni butunlay to'xtataman", ru: "Совсем перестану собирать отзывы" }], correct: 1 },
  { q: { uz: "Botingizning birinchi versiyasi chiqdi. Ish tugadimi?", ru: "Вышла первая версия вашего бота. Работа закончена?" }, opts: [{ uz: "Yo'q: bot fikr bilan yaxshilanib boradi", ru: "Нет: бот улучшается благодаря отзывам" }, { uz: "Ha: birinchi versiya — tayyor mahsulot", ru: "Да: первая версия — готовый продукт" }, { uz: "Testlarning hammasi o'tib bo'lsa — tugadi", ru: "Если все тесты пройдены — закончена" }, { uz: "Bir hafta shikoyat kelmasa — tugadi", ru: "Если неделю нет жалоб — закончена" }], correct: 0 },
  { q: { uz: "Noaniq fikr («menyu chalkash») aniq o'zgarishdan nimasi bilan farq qiladi?", ru: "Чем неконкретный отзыв («меню запутанное») отличается от конкретного изменения?" }, opts: [{ uz: "Farqi yo'q, ikkalasi bir xil ishlatiladi", ru: "Ничем, оба применяются одинаково" }, { uz: "Noaniq fikr odatda yolg'on bo'ladi", ru: "Неконкретный отзыв обычно бывает ложью" }, { uz: "Aniq o'zgarishni faqat dasturchi tushunadi", ru: "Конкретное изменение понимает только программист" }, { uz: "Fikr shikoyat, aniq o'zgarish esa vazifa", ru: "Отзыв — это жалоба, а изменение — задача" }], correct: 3 },
  { q: { uz: "Aniq maqtovni («tez va qulay, rahmat!») nega e'tiborsiz qoldirmaysiz?", ru: "Почему вы не оставляете без внимания конкретную похвалу («быстро и удобно, спасибо!»)?" }, opts: [{ uz: "Chunki maqtovni ham tuzatish kerak", ru: "Потому что похвалу тоже нужно чинить" }, { uz: "Chunki maqtov yozganga chegirma beriladi", ru: "Потому что за похвалу дают скидку" }, { uz: "Chunki u nima yaxshi ishlashini aytadi", ru: "Потому что она говорит, что работает хорошо" }, { uz: "Chunki maqtovda eng ko'p bug bo'ladi", ru: "Потому что в похвале больше всего багов" }], correct: 2 },
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
    // Arena tokenlari — SHU darsning so'zlari (fikr va iteratsiya): dekorativ suzuvchi bo'laklar
    const TOK = ['iteratsiya', 'chastota', "ta'sir", 'voronka', 'bug', 'taklif', 'v2', 'fikr'];
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
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Ответы подряд дают 🔥 бонус!' })}</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>{tr({ uz: '▶ Testni boshlash', ru: '▶ Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Дождитесь, пока ментор начнёт тест…' })}</p>}
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
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победил</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появляется рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
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

// ===== JONLI PRAKTIKA — o'quvchi o'z kompyuterida bajaradi, Mentor kuzatadi =====
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
  // A6: qadamlar bittadan — joriysi to'liq, bajarilganlari ✓ qatorga yig'iladi, keyingilari hali ko'rinmaydi
  const [cur, setCur] = useState(() => (storedAnswer && storedAnswer.solved ? checklist.length : 0));
  const [sc, setSc] = useState(0);
  const complete = () => {
    if (done) return;
    setDone(true);
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(title), solved: true, correct: true, picked: true });
    // JONLI: praktika bajarilgani serverga yoziladi (500+ zona — reytingga aralashmaydi, faqat mentor ko'radi)
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  const stepDone = () => {
    const next = cur + 1;
    setCur(next); setSc(n => n + 1);
    if (next >= checklist.length) complete();
  };
  // JONLI: mentor keyingi sahifaga o'tmaguncha NavNext qulf bo'ladi (optionalLive + LiveGateCtx gate). Hozircha done bo'lsa ochiq.
  const audio = useAudio([{ id: `practice_${screen}`, text: `Bu topshiriqni o'z ${ou(place)} bajaring. Har qadamni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — Mentor kuzatib turadi.`, trigger: 'on_mount', waits_for: null }]);
  return (
    <Stage eyebrow={tr(eyebrow) || tr({ uz: 'Amaliyot', ru: "Практика" })} screen={screen} audioState={audio} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(title)}</h2></div>
        <Mentor>{tr({ uz: <>Bu topshiriqni <b style={{ color: T.ink }}>o'z {tr(place)}</b> bajaring. Har qadamni bajarib, belgilab boring. Tugagach <b style={{ color: T.ink }}>«Bajardim»</b> tugmasini bosing — Mentor kuzatib turadi.</>, ru: <>Выполните это задание <b style={{ color: T.ink }}>{tr(place)}</b>. Выполняйте шаги по порядку и отмечайте каждый. В конце нажмите <b style={{ color: T.ink }}>«Готово»</b> — Ментор следит за ходом.</> })}</Mentor>
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
              {checklist.map((c, i) => {
                if (i > cur) return null;
                if (i < cur) return (
                  <div key={i} className="lp-step on lp-step-done">
                    <span className="lp-check">✓</span>
                    <span className="lp-step-t">{fmtCode(tr(c))}</span>
                    <button type="button" className="pb-redo" onClick={() => { setCur(i); setSc(n => n + 1); }} aria-label={tr({ uz: 'Qayta ochish', ru: "Открыть снова" })} title={tr({ uz: 'Qayta ochish', ru: "Открыть снова" })}>↻</button>
                  </div>
                );
                return (
                  <div key={i} className="lp-step lp-step-cur fade-step">
                    <span className="lp-check">{i + 1}</span>
                    <span className="lp-step-t">{fmtCode(tr(c))}</span>
                    <button className="btn lp-step-btn" onClick={stepDone}>{tr({ uz: 'Bajardim', ru: "Готово" })}</button>
                  </div>
                );
              })}
            </div>
            {done && cur >= checklist.length && <button className="lp-done-btn is-done" disabled>{tr({ uz: '✓ Bajarildi — Mentorni kuting', ru: "✓ Выполнено — подождите ментора" })}</button>}
            {done && cur >= checklist.length && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Vazifa bajarildi. Mentor tekshirib, keyingi qadamga o'tkazadi.", ru: "Задание выполнено. Ментор проверит и переведёт вас на следующий шаг." })}</p></div>}
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
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda ·", ru: '↻ Учу ·' })} <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim ·', ru: '✓ Знаю ·' })} <b>{known}</b></span></div>
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

// PRAKTIKA — o'quvchi o'z boti uchun fikrlar ro'yxatini tuzadi (mentor-gate, kod kiritilmaydi)
const ScreenBotPractice = (props) => (
  <ScreenLivePractice {...props} eyebrow={{ uz: "Amaliyot · fikrlar ro'yxati", ru: "Практика · список отзывов" }} place={{ uz: 'kompyuteringizda', ru: 'на своём компьютере' }}
    title={{ uz: "O'z botingiz uchun fikrlar ro'yxatini tuzing", ru: "Составьте список отзывов для своего бота" }}
    task={{ uz: "Botingizga keladigan 5 ta fikrni matn fayliga yozing (masalan, `fikrlar.txt`), ularni aniq va noaniqqa ajrating va qaysi birini birinchi tuzatishni tanlang. Bugun kod yozmaysiz — faqat fikrlarni tahlil qilasiz.", ru: "Запишите 5 отзывов, которые может получить ваш бот, в текстовый файл (например, `fikrlar.txt`), разделите их на конкретные и неконкретные и выберите, что чинить первым. Сегодня вы не пишете код — только разбираете отзывы." }}
    checklist={[
      { uz: "5 ta fikr yozing: 8-darsda odamdan eshitgan javoblaringizdan yoki o'zingiz o'ylab (masalan: «tugma ishlamadi», «rahmat, ajoyib»).", ru: "Напишите 5 отзывов: из ответов, которые вы услышали на 8-м уроке, или придумайте сами (например: «кнопка не работала», «спасибо, супер»)." },
      { uz: 'Har fikrni aniq yoki noaniq deb belgilang; noaniqiga aniqlashtiruvchi savol yozing.', ru: "Отметьте каждый отзыв как конкретный или неконкретный; к неконкретному напишите уточняющий вопрос." },
      { uz: "Aniqlari ichidan eng ko'p aytiladigan (chastota) va eng qiynaydiganini (ta'sir) toping.", ru: "Среди конкретных найдите тот, о котором говорят чаще всего (частота), и тот, что мешает сильнее всего (влияние)." },
      { uz: "Shu fikrni bitta aniq o'zgarishga aylantiring.", ru: "Превратите этот отзыв в одно конкретное изменение." },
      { uz: "Aniq o'zgarishni AI uchun bitta gaplik prompt qilib yozing.", ru: "Запишите конкретное изменение как промпт для ИИ в одно предложение." },
    ]} />
);

// FLASHCARD KARTALARI — 12 ta (fikr va iteratsiya tili)
const FEEDBACK_FLASHCARDS = [
  { front: { uz: "Fikr yig'ish → tuzatish → yangi versiya → yana fikr yig'ish. Bu takror nima deyiladi?", ru: "Сбор отзывов → правка → новая версия → снова сбор отзывов. Как называется этот повтор?" }, back: { uz: 'Iteratsiya', ru: "Итерация" }, note: { uz: "Har iteratsiyada bot biroz yaxshilanadi", ru: "С каждой итерацией бот становится немного лучше" } },
  { front: { uz: "Fikrlar qaysi uch turga ajratiladi?", ru: "На какие три вида делятся отзывы?" }, back: { uz: 'Bug, taklif, maqtov', ru: "Баг, предложение, похвала" }, note: { uz: "Har turi o'z ishini talab qiladi: tuzatish, o'ylab ko'rish, saqlash", ru: "Каждый вид требует своего действия: починить, обдумать, сохранить" } },
  { front: { uz: "«Bot manzilimni ikki marta so'radi» — bu qanday fikr?", ru: "«Бот дважды спросил мой адрес» — что это за отзыв?" }, back: { uz: 'Bug', ru: "Баг" }, note: { uz: "Bot kutilgan ishni bajarmayapti — tuzatish kerak", ru: "Бот не делает то, что от него ждут, — нужно чинить" } },
  { front: { uz: "Mijoz botda hali yo'q narsani so'rasa, bu qanday fikr?", ru: "Клиент просит то, чего в боте ещё нет. Что это за отзыв?" }, back: { uz: 'Taklif', ru: 'Предложение' }, note: { uz: "Uni darrov qo'shmaysiz — o'ylab ko'rib qaror qilasiz", ru: "Его не добавляют сразу — сначала обдумывают и решают" } },
  { front: { uz: "Aniq maqtovni nega diqqat bilan o'qiysiz?", ru: "Зачем внимательно читать конкретную похвалу?" }, back: { uz: "Nima yaxshi ishlayotganini ko'rsatadi", ru: 'Она показывает, что работает хорошо' }, note: { uz: "Tuzatayotganda o'sha joyni buzib qo'ymaslik kerak", ru: "Чтобы при правке не сломать это место" } },
  { front: { uz: "Aniq fikr noaniqdan nimasi bilan farq qiladi?", ru: "Чем конкретный отзыв отличается от неконкретного?" }, back: { uz: 'Unda muammo va joy aytilgan', ru: "В нём названы проблема и место" }, note: { uz: "Noaniq fikrni avval aniqlashtirasiz", ru: "Неконкретный отзыв сначала уточняют" } },
  { front: { uz: "Qaysi tuzatishni birinchi qilishni nimaga qarab tanlaysiz?", ru: 'Как вы выбираете, какую правку сделать первой?' }, back: { uz: "Chastota va ta'sirga", ru: "По частоте и влиянию" }, note: { uz: "Nechta odam aytgan va muammo qanchalik qiynagan", ru: "Сколько человек сказали и насколько сильно это мешает" } },
  { front: { uz: "Har qadamda nechta mijoz qolganini ko'rsatadigan chizma nima?", ru: "Как называется схема, которая показывает, сколько клиентов осталось на каждом шаге?" }, back: { uz: 'Voronka', ru: "Воронка" }, note: { uz: "Eng katta yo'qotish — ikki qadam orasidagi eng katta farq", ru: "Самая большая потеря — самая большая разница между двумя шагами" } },
  { front: { uz: "Ko'p odam suhbatning bir joyida to'xtab, ketib qolsa, buni nima deymiz?", ru: "Многие останавливаются в одном месте диалога и уходят. Как это называется?" }, back: { uz: 'Ketib qolish (drop-off)', ru: "Уход (drop-off)" }, note: { uz: "O'sha qadamda nimadir xalaqit beradi — sababini tekshirasiz", ru: "На этом шаге что-то мешает — вы проверяете причину" } },
  { front: { uz: "Kam odamga kerak bo'lgan taklifga nima deysiz?", ru: "Что вы скажете на предложение, нужное немногим?" }, back: { uz: '«Hozir emas»', ru: '«Не сейчас»' }, note: { uz: "Bu e'tiborsizlik emas — botning asosiy ishini saqlash", ru: "Это не пренебрежение, а сохранение главной работы бота" } },
  { front: { uz: "AI yordamchiga berishdan oldin noaniq shikoyatni nimaga aylantirasiz?", ru: "Во что вы превращаете неконкретную жалобу, прежде чем отдать её ИИ-помощнику?" }, back: { uz: "Aniq o'zgarishga", ru: 'В конкретное изменение' }, note: { uz: "Masalan: tasdiq xabariga taom nomi va narxi qo'shilsin", ru: "Например: в сообщение о подтверждении добавить название блюда и цену" } },
  { front: { uz: "Tuzatishni chiqargandan keyin nima qilasiz?", ru: 'Что вы делаете после выпуска правки?' }, back: { uz: "Qayta o'lchaysiz", ru: "Измеряете заново" }, note: { uz: "O'sha shikoyat kamaydimi — tekshirasiz; keyingi iteratsiya shundan boshlanadi", ru: "Проверяете, стало ли меньше той жалобы; с этого начинается следующая итерация" } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={{ uz: 'Yakunlash →', ru: 'Завершить →' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={FEEDBACK_FLASHCARDS} /></div>
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
    { uz: "Mahsulot bir versiya bilan tugamaydi — iteratsiya bilan yaxshilanib boradi", ru: "Продукт не заканчивается одной версией — он улучшается итерациями" },
    { uz: "Aniq fikrda muammo va joy bor; noaniq fikrni avval aniqlashtirasiz", ru: "В конкретном отзыве есть проблема и место; неконкретный сначала уточняете" },
    { uz: "Qaysi birini birinchi tuzatish — chastota va ta'sirga qarab; «hozir emas» deyish ham qaror", ru: "Что чинить первым — решают частота и влияние; сказать «не сейчас» — тоже решение" },
    { uz: "Voronkadan eng katta yo'qotishni topib, o'sha qadamni birinchi tuzatasiz", ru: "Находите в воронке самую большую потерю и чините этот шаг первым" },
    { uz: "Tuzatgandan keyin qayta o'lchaysiz — keyingi iteratsiya shundan boshlanadi", ru: "После правки измеряете заново — с этого начинается следующая итерация" }
  ];
  const HOMEWORK = [
    { b: { uz: "Yig'ing", ru: 'Соберите' }, t: { uz: "— botingizni kamida 3 kishiga sinatib ko'ring va 8-darsdagidek bo'lib o'tgan ishini so'rab, fikrlarini yozib oling", ru: "— дайте попробовать бота хотя бы 3 людям, спросите, как на 8-м уроке, о том, что они делали, и запишите их отзывы" } },
    { b: { uz: 'Tanlang', ru: 'Выберите' }, t: { uz: "— chastota va ta'sirga qarab qaysi birini birinchi tuzatishni belgilang", ru: "— по частоте и влиянию определите, что чинить первым" } },
    { b: { uz: 'Aylantiring', ru: 'Превратите' }, t: { uz: "— eng muhim fikrni AI uchun aniq promptga aylantiring", ru: "— превратите самый важный отзыв в чёткий промпт для ИИ" } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const PASSED = (total ? correct / total : 0) >= 0.6;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Botingizni yaxshiladingiz', ru: "Вы улучшили бота" })}</span><h2 className="title h-title fade-up d1">{tr({ uz: <>Endi botingiz <span className="italic" style={{ color: T.accent }}>foydalanuvchi bilan birga</span> o'sadi.</>, ru: <>Теперь ваш бот растёт <span className="italic" style={{ color: T.accent }}>вместе с пользователем</span>.</> })}</h2>{/* 54-qonun (P0 PmUserStory · PmLesson2 qarori): h-sub qatori YO'Q — sarlavha o'zi yetadi. */}</div><ScoreRing correct={correct} total={total} /></div>
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
        {hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><ul>{HOMEWORK.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul><p className="hw-note">{tr({ uz: <>Keyingi dars — <b>«AI-agent yaratish».</b> Botga maqsad berasiz — keyingi qadamni u o'zi tanlab, asbob chaqiradi: masalan, buyurtmani bazaga saqlaydi.</>, ru: <>Следующий урок — <b>«Создание ИИ-агента».</b> Вы дадите боту цель — следующий шаг он выберет сам и вызовет инструмент: например, сохранит заказ в базу.</> })}</p></div>}
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Nishonlaringiz —', ru: "Ваши значки —" })} {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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
export default function BotIntroLesson({ lang: langProp, onFinished, liveToken }) {
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
  const missTry = useCallback((idx, part) => {
    const sid = SCREEN_META[idx] && (part ? SCREEN_META[idx].id + ':' + part : SCREEN_META[idx].id); // part — ko'p bosqichli ekranda bosqich (s7:sort)
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
    // 🏅 s7 markaziy ekran — uch bosqich, uch nishon (F-0921-20). Bayroqni ekran o'zi qo'yadi:
    // u faqat XATOSIZ bosqichda qo'yiladi (151-qonun), shuning uchun bu yerda qo'shimcha shart kerak emas.
    if (data) { if (data.signalFinder) earn('signalFinder'); if (data.funnelReader) earn('funnelReader'); if (data.rightFixFirst) earn('rightFixFirst'); }
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
        .sk-info { background: ${T.paper}; border-radius: 12px; padding: 15px 17px; box-shadow: none; border: 1px solid ${T.line}; animation: fade-step 0.3s; } /* U1: ma'lumot kartasi — belgisiz, soyasiz */
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink3}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

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

        /* ============ 5-MODUL · 9-DARS CSS ============ */

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
        .tg-body { background: #CFD9E0; background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 18px 18px; padding: 13px 12px; display: flex; flex-direction: column; gap: 7px; }
        /* F-1002-83 · 168-qonun: bosib ochiladigan, hali ochilmagan element navbat bilan yengil pulslaydi (outline — halqa-soyani buzmaydi) */
        .tap-wave { animation: tap-wave 2.2s ease-out infinite; }
        .tap-wave:nth-child(2) { animation-delay: 0.35s; } .tap-wave:nth-child(3) { animation-delay: 0.7s; } .tap-wave:nth-child(4) { animation-delay: 1.05s; } .tap-wave:nth-child(5) { animation-delay: 1.4s; } .tap-wave:nth-child(6) { animation-delay: 1.75s; }
        @keyframes tap-wave { 0% { outline: 2px solid rgba(255,79,40,0.5); outline-offset: 0; } 70%, 100% { outline: 2px solid rgba(255,79,40,0); outline-offset: 6px; } }
        @media (prefers-reduced-motion: reduce) { .tap-wave { animation: none; outline: 1.5px solid rgba(255,79,40,0.35); outline-offset: 2px; } }
        .tg-body { max-height: clamp(260px, 48vh, 420px); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; } /* F-1002-85 · 169-qonun: chat cho'zilmaydi, ichki skrol */
        .tg-bubble { max-width: 82%; padding: 8px 12px; border-radius: 14px; font-family: 'Manrope'; font-weight: 500; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; box-shadow: 0 1px 2px rgba(0,0,0,0.12); word-break: break-word; }
        .tg-bubble.bot { align-self: flex-start; background: #fff; color: #0E0E10; border-bottom-left-radius: 5px; }
        .tg-bubble.user { align-self: flex-end; background: #EFFDDE; color: #0E0E10; border-bottom-right-radius: 5px; }
        .tg-bubble.muted { opacity: 0.55; }
        .tg-btns { align-self: flex-start; display: flex; flex-wrap: wrap; gap: 5px; max-width: 92%; }
        .tg-btn { font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; color: #2E6FA6; background: rgba(255,255,255,0.92); padding: 6px 11px; border-radius: 9px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .tg-typing { display: flex; gap: 4px; align-items: center; padding: 11px 13px; }
        .tg-typing span { width: 6px; height: 6px; border-radius: 50%; background: ${T.ink3}; animation: tg-typing-bounce 1s ease-in-out infinite; }
        .tg-typing span:nth-child(2) { animation-delay: 0.15s; } .tg-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes tg-typing-bounce { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-3px); opacity: 1; } }

        @keyframes think-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }


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
        .pick-row.sel, .pick-row.sel:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.ink}, 0 8px 18px -6px rgba(${T.shadowBase},0.22); background: ${T.bg}; }
        .pick-row.sel.wrong, .pick-row.sel.wrong:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.28); background: ${T.accentSoft}; }
        .pick-row.picked { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; cursor: default; }
        .pick-plus { margin-left: auto; font-weight: 700; color: ${T.ink3}; } .pick-row.picked .pick-plus { color: ${T.success}; } .pick-row.sel .pick-plus { color: ${T.ink}; } .pick-row.sel.wrong .pick-plus { color: ${T.accent}; }

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
        .dd-slotn { min-width: 26px; padding: 0 8px; white-space: nowrap; height: 26px; border-radius: 8px; background: ${T.bg}; color: ${T.ink3}; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: inset 0 0 0 1.5px ${T.line}; }
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
        /* s15 A7: 5-qadamdan 1-qadamga qaytuvchi strelka — faqat to'g'ri yig'ilgach chiziladi */
        .dd-slots.has-cycle { padding-right: 26px; }
        .dd-cycle { position: absolute; right: 4px; top: 29px; bottom: 29px; width: 18px; border: 2px solid ${T.success}; border-left: none; border-radius: 0 12px 12px 0; pointer-events: none; animation: dd-cycle 1s ease-out both; }
        .dd-cycle::before { content: ''; position: absolute; left: -7px; top: -6px; border-right: 8px solid ${T.success}; border-top: 5px solid transparent; border-bottom: 5px solid transparent; opacity: 0; animation: op-in 0.2s ease-out 0.95s forwards; }
        @keyframes dd-cycle { from { clip-path: inset(100% 0 0 -12px); } to { clip-path: inset(-8px 0 0 -12px); } }
        @keyframes op-in { to { opacity: 1; } }

        /* U2: kattalashtirish tugmasiga joy — matn ustiga tushmaydi */
        .zoomable:not(.z-empty):not(.zoom-on) { padding-top: 36px; }
        .zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: 0; }

        /* U1: bosiladigan karta — doimiy belgi, bosilgach ✓ */
        .gchip-mk { margin-left: 7px; font-weight: 800; color: ${T.ink3}; }
        .gchip.seen { box-shadow: inset 0 0 0 1.5px ${T.success}; color: ${T.success}; }
        .gchip.seen .gchip-mk { color: ${T.success}; }
        .gchip.cur { box-shadow: inset 0 0 0 2px ${T.ink}; }
        .vcard.cur { box-shadow: inset 0 0 0 1.5px ${T.ink}, 0 8px 20px -6px rgba(${T.shadowBase},0.2); }
        .va-concrete { border-color: ${T.success}66; }

        /* s5 / s12: ustunlar (son ko'pligi) — noldan o'z soniga o'sadi */
        .fn-row { display: grid; grid-template-columns: minmax(0, 150px) minmax(0, 1fr); align-items: center; gap: 10px; }
        .fn-lbl { font-size: 13px; font-weight: 600; color: ${T.ink}; line-height: 1.3; }
        .fn-track { height: 26px; background: ${T.paper}; box-shadow: inset 0 0 0 1px rgba(${T.shadowBase},0.16); border-radius: 8px; overflow: hidden; display: flex; align-items: center; }
        .fn-fill { height: 100%; min-width: 0; background: ${T.ink3}; color: #fff; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: flex-end; padding: 0 8px; white-space: nowrap; transition: width 0.8s cubic-bezier(.4,0,.2,1), background 0.4s; }
        .fn-fill.top { background: ${T.accent}; }
        .fn-fill.fn-empty { padding: 0; }
        .fn-fill.fn-ok { background: ${T.success}; min-width: 26px; }
        .fn-fill.fn-measure { animation: fn-measure 0.9s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fn-measure { 0% { width: 0; background: ${T.ink3}; } 45% { width: 90%; background: ${T.ink3}; } 100% { width: 8%; background: ${T.success}; } }
        .fn-q { padding: 0 10px; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: ${T.ink3}; }
        @media (max-width: 480px) { .fn-row { grid-template-columns: 1fr; gap: 4px; } }

        /* s7 voronka — pog'onalar yuqoridan pastga birin-ketin chiziladi, soniga qarab torayadi */
        .fn-funnel { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .fn-step { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 40px; padding: 8px 12px; border-radius: 10px; background: ${T.blueSoft}; box-shadow: inset 0 0 0 1.5px ${T.blue}55; transform-origin: center; animation: fn-draw 0.4s ease-out both; }
        .fn-step-n { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 15px; color: ${T.ink}; }
        .fn-step-l { font-size: 13px; font-weight: 600; color: ${T.ink2}; }
        @keyframes fn-draw { from { transform: scaleX(0.2); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }

        /* s7 saralash — dasta: bitta joriy karta, ikki savat (rang — CSS) */
        .fs { display: flex; flex-direction: column; gap: 12px; }
        .fs-preview { display: flex; flex-wrap: wrap; gap: 7px; }
        .fs-preview-chip { font-size: 13px; color: ${T.ink}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 10px; padding: 7px 11px; }
        .fs-deck { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
        .fs-hint { margin: 0; color: ${T.ink2}; }
        .fs-stack { position: relative; width: 100%; max-width: 460px; }
        .fs-card { position: relative; width: 100%; text-align: left; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(14px,1.7vw,16px); line-height: 1.4; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 12px; padding: 14px 16px; cursor: grab; touch-action: none; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.3), 4px 4px 0 -1px ${T.line}, 8px 8px 0 -2px ${T.bg}; }
        .fs-card:active { cursor: grabbing; }
        .fs-quick { display: flex; gap: 8px; flex-wrap: wrap; }
        .fs-quick-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; border: none; border-radius: 10px; padding: 9px 16px; cursor: pointer; transition: all 0.16s; }
        .fs-quick-btn.green { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
        .fs-quick-btn.gray { background: ${T.paper}; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.ink3}88; }
        .fs-quick-btn:hover { transform: translateY(-1px); }
        .fs-wrong-why.fs-wrong-why { margin: 0; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; background: ${T.dangerSoft}; border-radius: 10px; padding: 9px 12px; max-width: 460px; }
        .fs-done { margin: 0; font-weight: 700; color: ${T.success}; font-size: 14px; }
        .fs-baskets { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; }
        @media (max-width: 560px) { .fs-baskets { grid-template-columns: 1fr; } }
        .fs-basket { border-radius: 12px; padding: 10px 12px; min-height: 84px; display: flex; flex-direction: column; gap: 7px; border: 2px dashed; }
        .fs-basket.green { background: ${T.successSoft}; border-color: ${T.success}88; }
        .fs-basket.gray { background: ${T.bg}; border-color: ${T.ink3}88; }
        .fs-basket-h { font-size: 13px; color: ${T.ink}; line-height: 1.35; }
        .fs-basket.green .fs-basket-h b { color: ${T.success}; }
        .fs-basket.gray .fs-basket-h b { color: ${T.ink2}; }
        .fs-basket-body { display: flex; flex-wrap: wrap; gap: 5px; }
        .fs-placed { font-size: 12px; color: ${T.ink2}; background: ${T.paper}; border-radius: 8px; padding: 4px 8px; }

        /* s13 prompt yig'ish — qismlar bittadan, yig'ilgani bitta qatorda */
        .prompt-card { background: ${CODE.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.28); }
        .prompt-card.live { box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.blue}88; }
        .prompt-text { margin: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; line-height: 1.55; color: ${CODE.text}; overflow-wrap: anywhere; }
        .pb-gap { color: ${CODE.comment}; }
        .pb-why.pb-why { margin: 2px 0 0; font-size: 13.5px; line-height: 1.45; color: ${T.ink}; background: ${T.dangerSoft}; border-radius: 10px; padding: 8px 12px; }
        .pb-done { display: flex; align-items: center; gap: 9px; background: ${T.successSoft}; border-radius: 10px; padding: 9px 12px; font-size: 13.5px; color: ${T.ink}; }
        .pb-done-ok { color: ${T.success}; font-weight: 800; }
        .pb-done-t { flex: 1; min-width: 0; }
        .pb-redo { border: none; background: ${T.paper}; color: ${T.ink2}; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 700; flex-shrink: 0; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.25); }
        .pb-redo:hover { color: ${T.ink}; }

        /* s16 A6: amaliyot qadamlari bittadan */
        .lp-step-cur { flex-wrap: wrap; cursor: default; }
        .lp-step-cur:hover { box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.14); }
        .lp-step-btn { margin-left: auto; padding: 8px 16px; font-size: 13px; }
        .lp-step-done { cursor: default; padding-top: 8px; padding-bottom: 8px; }

        @media (prefers-reduced-motion: reduce) { .dd-cycle, .fn-step, .fn-fill.fn-measure { animation: none !important; } .dd-cycle::before { animation: none; opacity: 1; } .fn-fill { transition: none; } }

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

      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={{ uz: 'Fikr va iteratsiya', ru: "Отзывы и итерация" }} />
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
