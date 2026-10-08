import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 12-Modul · 1-dars (PM, 2-tur) «Mahsulotingizni bir sahifada qanday tanishtirasiz?» — kalit m10-01, 16 ekran.
// Manba-haqiqat: feedback/F-1006-12modul/01-PmLanding-v3.md (GATE M 06.10.2026) + 01-FILTR.md. Kod — src/skelet/NamunaDars.jsx dan.
// Bitta vizual — LendingSahifa (brauzer + sahifa + JamoaTelefon), bitta manba MENTOR_LENDING. Saqlaydi: pm-m10d1-lending (tayanch 8).
// O'qiydi: pm-m9d4-final, pm-m9d5-prd, pm-m9d8-platforma (yo'q bo'lsa ham ekran ishlaydi). PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
// ============================================================

// D3: palitra umumiy qolipdan — neytral 5 · modul rangi 2 · holat 2 (shadowBase — soya, rang tokeni emas)
const T = { ...qolipRang('pm'), shadowBase: '27, 22, 48' };
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
// Payload/analitika uchun UZ-etalon (til almashsa ham hisobot bir xil qoladi)
const ou = (o) => (o && typeof o === 'object' && !React.isValidElement(o)) ? (o.uz ?? '') : o;

// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi.
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang , buildResultDetails, sealPayload, useAutoNext } from '../live/index.js';
// D1–D4 (F-1004 2-qism, 04.10.2026): umumiy qolip — ekran turlari, ikki tugma, 9 token, emojisiz yuza (src/qolip/QOLIP.md)
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QBashorat, QKirish, QReja, QTushuncha, QTest, QTestJavob, QBlok, QKartochka, QYakun, QVoqea, QMustaqil, QQadamlar, QXato, QIzoh, QXulosa } from '../qolip/index.jsx';







const LangContext = createContext('uz');
const MentorCtx = createContext(null); // mobil: yig'iladigan Mentor
const AchCtx = createContext(null); //  olingan nishonlar (Set) — Stage hisoblagichi uchun
const AchMissCtx = createContext(null); //  151-qonun: { missed:Set<ekran id>, miss(idx), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi

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

const LESSON_META = { lessonId: 'pm-m10d1-v1', lessonTitle: { uz: "Mahsulotingizni bir sahifada qanday tanishtirasiz?", ru: 'Как представить продукт на одной странице?' } };
// 16 ekran (MD v3): kirish → reja → sarlavha → 1-savol → foyda → 2-savol → asosiy tugma → Instagram → 3-savol → sahifa matni → besh soniyalik sinov → amaliyot bloki → yakuniy savol → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'sahifa', ru: 'страница' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'sarlavha', ru: 'заголовок' }, l: 66, tp: 16, s: 12, d: 7.5 },
  { t: { uz: 'foyda', ru: 'польза' }, l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'sinov', ru: 'проверка' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'keys',        template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }
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
          <div className="ach-pop-h">🏅 Badges — {count}/{total}</div>
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
              <div className="mono small" style={{ color: T.ink2 }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
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
  const lbl = tr(label) || tr({ uz: 'Davom etish', ru: 'Продолжить' });
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: 'Ждите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
};


const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{tr(t)}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). Yangi dars — ✔ o'rni MD dagidek: s3 B · s5 D · s8 A · s12 C (yakuniy).
const INLINE_KEYS = { s3: 1, s5: 3, s8: 0, s12: 2 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: PM darsida raqam 1/2/3)
const RECAPS = {
  3: {
    title: { uz: 'Sarlavha: kim uchun va nima foyda', ru: 'Заголовок: для кого и какая польза' },
    cards: [
      { ic: '1', h: { uz: "Sarlavha — sahifaning birinchi qatori.", ru: 'Заголовок — первая строка страницы.' } },
      { ic: '2', h: { uz: 'Bizda u ikki savolga javob beradi: kim uchun va nima foyda.', ru: 'У нас он отвечает на два вопроса: для кого и какая польза.' } },
      { ic: '3', h: { uz: "Nom, texnologiya va bo'limlar ro'yxati bu savollarga javob bermaydi.", ru: 'Название, технология и список разделов на эти вопросы не отвечают.' }, ask: { uz: "«Maydon Jamoa» so'zining o'zidan kim uchun ekani ko'rinadimi?", ru: 'Видно ли из самого названия «Maydon Jamoa», для кого это?' } }
    ]
  },
  5: {
    title: { uz: 'Funksiya va foyda', ru: 'Функция и польза' },
    cards: [
      { ic: '1', h: { uz: 'Funksiya — mahsulot nima qilishi.', ru: 'Функция — то, что делает продукт.' } },
      { ic: '2', h: { uz: 'Foyda — funksiya odamga nima berishi.', ru: 'Польза — то, что функция даёт человеку.' } },
      { ic: '3', h: { uz: "Mentor misolida: «8 / 10» soni — «nechta odam yig'ilganini so'rab o'tirmaysiz».", ru: 'В примере Ментора: число «8 / 10» — «не нужно спрашивать, сколько людей собралось».' }, ask: { uz: 'Mahsulotingizdagi bitta funksiya odamga nima beradi?', ru: 'Что даёт человеку одна функция вашего продукта?' } }
    ]
  },
  8: {
    title: { uz: 'Instagram: yoqqani qoldi', ru: 'Instagram: осталось то, что нравилось' },
    cards: [
      { ic: '1', h: { uz: "Burbn'da funksiya ko'p edi, uni hech kim ishlatmagan.", ru: 'В Burbn было много функций, ими никто не пользовался.' } },
      { ic: '2', h: { uz: 'Asoschilar odamlarga yoqqanidan boshqa hammasini olib tashlagan.', ru: 'Основатели убрали всё, кроме того, что нравилось людям.' } },
      { ic: '3', h: { uz: "Qolgani — rasm, filtr va izohlar: Instagram shunday tug'ilgan.", ru: 'Осталось — фото, фильтры и комментарии: так родился Instagram.' }, ask: { uz: "Sahifangiz bitta gapda nimani va'da qiladi?", ru: 'Что ваша страница обещает одной фразой?' } }
    ]
  },
  12: {
    title: { uz: 'Sahifada hozir ishlaydigan narsa', ru: 'На странице — то, что работает сейчас' },
    cards: [
      { ic: '1', h: { uz: "Sahifani o'qigan odam mahsulotni ochadi.", ru: 'Человек, прочитавший страницу, открывает продукт.' } },
      { ic: '2', h: { uz: 'U sahifada yozilgan narsani mahsulotda topishi kerak.', ru: 'Он должен найти в продукте то, что написано на странице.' } },
      { ic: '3', h: { uz: 'Hali qurilmagan funksiya sahifaga yozilmaydi.', ru: 'Функцию, которую ещё не построили, на страницу не пишут.' }, ask: { uz: 'Mentor sahifasiga nega «eslatma» yozilmadi?', ru: 'Почему на страницу Ментора не написали «напоминание»?' } }
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
        <span className="rc-tag">{tr({ uz: 'Qayta tushuntirish', ru: 'Повторное объяснение' })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        {card.ic && <div className="rc-ic">{card.ic}</div>}
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.vis && <div className="rc-vis">{card.vis}</div>}
        {card.ask && <div className="rc-ask">{tr({ uz: 'Sinfga savol:', ru: 'Вопрос классу:' })} {tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущая' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}${tr({ uz: '-karta', ru: '-я карта' })}`} />)}</div>
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
        <span className="mstats-lbl">{tr({ uz: 'Jonli natija', ru: 'Живой результат' })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>{tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }} /></div>
      {reveal ? (
        <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri", ru: 'верно' })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: 'xato', ru: 'неверно' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda', ru: 'ожидаем' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi', ru: 'ответили' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda', ru: 'ожидаем' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "Kim nimani tanlagani va to'g'ri/xato soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: 'Кто что выбрал и число верных/неверных скрыто — при нажатии «Открыть результат» всё появится сразу и у вас, и на экранах учеников.' })}</p>
      )}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
          const n = data.rows.filter(a => a.picked === i).length;
          const pct = answered ? Math.round((n / answered) * 100) : 0;
          const isC = reveal && i === correctIdx;
          const col = isC ? T.ok : MSTATS_COLORS[i % 4];
          return (
            <div key={i} className={`mstats-row ${reveal && !isC ? 'dimmed' : ''}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? '✓' : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round((n / maxN) * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.ok, fontWeight: 800 } : undefined}>{n > 0 ? `${n} ${tr({ uz: "o'quvchi", ru: 'уч.' })} · ${pct}%` : '—'}</span>
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
              <p className="mstats-verdict-t">{tr({ uz: <>Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>Только <b>{pct}%</b> верных — тема осталась непонятной классу. Перед продолжением коротко повторите.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: 'Qayta tushuntirish — ', ru: 'Объяснить заново — ' })}{tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <><b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <><b>{pct}%</b> верных — неплохо. При желании коротко повторите перед продолжением.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <><b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <><b>{pct}%</b> верных — класс усвоил тему. Смело продолжайте!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — по процентам судить трудно. Оцените сами.</> })}</p>}
          </div>
        );
      })()}
      {waiting.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr({ uz: 'Kutilmoqda:', ru: 'Ожидаем:' })}</span>
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: 'Большинство ошиблось — похоже, тема осталась непонятной. Объясните ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь в реальном времени…' })}</p>}
    </div>
  );
}

const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev, vizual }) => {
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
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' }))} onClick={onNext} /></>}>
      {/* D1/DE-203: ko'rinish — qolip QTest (texnik darslar standarti); mantiq (jonli ball, bitta urinish, mentor ochishi) — shu yerda */}
      <QTest
        savol={tr(question)}
        ogoh={oneShot && !solved && tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing!", ru: 'Живой урок — одна попытка, подумайте перед нажатием!' })}
        variantlar={options.map(opt => fmtCode(tr(opt)))}
        ixcham={picked !== null}
        yopiq={solved || isMentorLive}
        onTanla={pick}
        holat={(i) => isMentorLive
          ? (mReveal ? (i === correctIdx ? 'ok' : 'xira') : undefined)
          : solved
            ? (waiting ? (i === picked ? 'kutish' : undefined) : i === correctIdx ? 'ok' : (wrongLocked && i === picked ? 'xato' : 'xira'))
            : (i === picked ? 'xato' : undefined)}
        javob={(isMentorLive ? mReveal : picked !== null) && (
          <QTestJavob key={`${picked}-${solved}-${waiting}`} tur={waiting ? 'kutish' : (isMentorLive || (solved && !wrongLocked)) ? 'ok' : 'qayta'}
            sarlavha={isMentorLive
              ? <>{tr({ uz: "✓ To'g'ri javob:", ru: '✓ Верный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
              : waiting
                ? tr({ uz: 'Javobingiz qabul qilindi', ru: 'Ваш ответ принят' })
                : wrongLocked
                  ? <>{tr({ uz: "To'g'ri javob:", ru: 'Верный ответ:' })} {String.fromCharCode(65 + correctIdx)} — {fmtCode(tr(options[correctIdx]))}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}>
            <p>{isMentorLive
              ? fmtCode(tr(explainCorrect))
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете верный ответ.' })
                : wrongLocked
                  ? fmtCode(tr(explainWrong[picked] ?? explainWrong.default))
                  : solved ? fmtCode(tr(explainCorrect)) : fmtCode(tr(explainWrong[picked] ?? explainWrong.default))}</p>
            {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi; jonli darsda — reveal'dan keyin */}
            {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
              <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>
            )}
          </QTestJavob>
        )}
      >
        {vizual && (isMentorLive ? mReveal : (solved && revealed)) && <div className="ld-tviz fade-step">{vizual}</div>}
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </QTest>
    </Stage>
  );
};

function ScoreRing({ correct, total }) {
  const PCT = total ? correct / total : 0;
  const col = PCT >= 0.6 ? T.ok : T.accent;
  const R = 50, ST = 9, C = 2 * Math.PI * R;
  const [off, setOff] = useState(C);
  useEffect(() => { const t = setTimeout(() => setOff(C * (1 - PCT)), 200); return () => clearTimeout(t); }, [C, PCT]);
  return (
    <div className="ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke={T.ink2 + '40'} strokeWidth={ST} />
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

const Jx = ({ children }) => <span style={{ color: CODE.tag }}>{children}</span>;
const At = ({ children }) => <span style={{ color: CODE.attr }}>{children}</span>;
const St = ({ children }) => <span style={{ color: CODE.str }}>{children}</span>;
const Cm = ({ children }) => <span style={{ color: CODE.comment, fontStyle: 'italic' }}>{children}</span>;

const Kw = Jx; // kod bo'yog'i: kalit so'z (tag rangi)

// ===== DARSNING BITTA VIZUALI (163, 180) — LendingSahifa: brauzer ramkasi + sahifa + ichida JamoaTelefon; bitta manba MENTOR_LENDING =====
// qolip-maket: ls-tugma ls-tahrir ld-qsavol ld-tanlov ld-trek ld-prd-q ld-mos ld-prd-ix-b ld-prompt-ed ld-yordam-b ld-foy-ok
const cxx = (...a) => a.filter(Boolean).join(' ');
const A = ({ children }) => <span className="italic" style={{ color: T.accent }}>{children}</span>;
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useJonli = () => { const g = useContext(LiveGateCtx) || {}; const live = g.live; return { live, isMentor: !!(live && live.mode === 'mentor'), isStudent: !!(live && live.mode === 'student') }; };
const lsO = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const lsY = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* saqlash yopiq */ } };
const kichik = (s) => (typeof s === 'string' && s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const kichikT = (o) => ({ uz: kichik(o.uz), ru: kichik(o.ru) });
const LEND_KEY = 'pm-m10d1-lending';
const TREK_KEY = 'pm-m9d8-platforma';
const Insta = () => <span className="ld-insta">Instagram</span>;
const Burbn = () => <span className="ld-burbn">Burbn</span>;

// Mentor misoli — tayanch 1.1 aynan (nom — mahsulot nomi, sarlavha emas); uch foyda = «Funksiyadan foydaga» juftliklari (tayanch 9.2)
// «Maydon Jamoa» nomi — 11-Modul tayanch 9.62 yashili (PM palitrasining ok yashilidan farqli; F-1006-389)
const MAYDON_RANG = '#2E9E4F';
const MENTOR_LENDING = {
  nom: 'Maydon Jamoa',
  sarlavha: { uz: "Mahalla futboliga jamoani bir joyda yig'ing", ru: 'Соберите команду для футбола в махалле в одном месте' },
  osti: { uz: "O'yinni e'lon qiling — kim qo'shilgani va kim aniq kelishi ko'rinib turadi.", ru: 'Объявите игру — видно, кто присоединился и кто точно придёт.' },
  tugma: { uz: "Qo'shilmoqchiman", ru: 'Хочу присоединиться' },
  foydalar: [
    { foyda: { uz: 'Bir bosishda jamoadasiz', ru: 'В команде одним нажатием' }, funksiya: { uz: "Har o'yin alohida kartada: «Qo'shilaman» ni bosasiz.", ru: 'Каждая игра — отдельная карточка: нажимаете «Присоединяюсь».' } },
    { foyda: { uz: "Nechta odam yig'ilganini so'rab o'tirmaysiz", ru: 'Не нужно спрашивать, сколько людей собралось' }, funksiya: { uz: "Kartada ko'rinadi: 8 / 10.", ru: 'Видно на карточке: 8 / 10.' } },
    { foyda: { uz: "Kim aniq kelishini o'yindan oldin bilasiz", ru: 'До игры знаете, кто точно придёт' }, funksiya: { uz: "O'yin kuni har kim «Kelaman» ni bosadi.", ru: 'В день игры каждый нажимает «Приду».' } }
  ],
  bolimH: { uz: "Qanday qo'shilaman", ru: 'Как присоединиться' },
  bolim: { uz: "Hozircha o'rnatish havolasi yo'q.", ru: 'Пока ссылки для установки нет.' },
  telefon: { ekran: 'oyinlar', oyin: { kun: { uz: 'Shanba', ru: 'Суббота' }, soat: '18:00', joy: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, bor: 8, kerak: 10 } }
};
// 11-Modul 5-dars PRD matni aynan (2-ekran kartasi)
const MENTOR_PRD = {
  muammo: { uz: "O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.", ru: 'Игрокам перед игрой трудно собрать в команду достаточно людей и узнать, кто точно придёт.' },
  kim: { uz: "Mahalladagi mini-futbol o'yinchilari: tashkilotchi — o'yinni e'lon qiladi, o'yinchi — o'yinga qo'shiladi.", ru: 'Игроки в мини-футбол в махалле: организатор — объявляет игру, игрок — присоединяется к игре.' },
  yechim: { uz: "Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.", ru: 'Организатор объявляет игру, игроки присоединяются одним нажатием и в день игры подтверждают, что придут.' }
};
const ML = (k) => tr(MENTOR_LENDING[k]);
const mentorMatn = (bor = {}) => ({
  nom: MENTOR_LENDING.nom, nomBor: true,
  sarlavha: bor.sarlavha === false ? null : ML('sarlavha'),
  osti: bor.osti === false ? null : ML('osti'),
  tugma: bor.tugma === false ? '' : ML('tugma'),
  foydalar: bor.foydalar === false ? null : MENTOR_LENDING.foydalar.map(f => ({ foyda: tr(f.foyda), funksiya: tr(f.funksiya) })),
  bolimH: ML('bolimH'), bolim: ML('bolim')
});

const Qulf = () => <svg className="ls-qulf" viewBox="0 0 12 14" aria-hidden="true"><rect x="1.5" y="6" width="9" height="7" rx="1.6" /><path d="M3.6 6V4.2a2.4 2.4 0 0 1 4.8 0V6" fill="none" strokeWidth="1.5" /></svg>;
const Doiralar = ({ bor, kerak, yangi }) => <span className="jt-doiralar" aria-hidden="true">{Array.from({ length: kerak }, (_, i) => <i key={i} className={cxx(i < bor && 'bor', yangi && i === bor - 1 && 'yangi')} />)}</span>;

// Telefon = ilova (SABOQ 22–23): o'lchami barqaror 170×272; nom «Maydon Jamoa» o'z rangida, logotip yo'q. ekran: 'oyinlar' | 'oyin'
const JamoaTelefon = ({ ekran = 'oyinlar', oyinKuni, halqa, className, tRef }) => {
  const o = MENTOR_LENDING.telefon.oyin;
  const hSon = halqa === 'son', hKel = halqa === 'kelaman', hTug = halqa === 'tugma';
  return (
    <div className={cxx('jt-tel', className)} ref={tRef}>
      <span className="jt-bar"><b className="jt-nom">{MENTOR_LENDING.nom}</b></span>
      {ekran === 'oyinlar' ? (
        <span className="jt-ekran" key="l">
          <b className="jt-sar">{tr({ uz: "O'yinlar", ru: 'Игры' })}</b>
          <span className="jt-kun">{tr(o.kun)}</span>
          <span className="jt-karta">
            <b>{tr(o.kun)}, {o.soat}</b>
            <span>{tr(o.joy)}</span>
            <b className="jt-son">{o.bor} / {o.kerak}</b>
            <Doiralar bor={o.bor} kerak={o.kerak} />
          </span>
        </span>
      ) : (
        <span className="jt-ekran" key={oyinKuni ? 'k' : 'o'}>
          <span className="jt-orqa">‹ {tr({ uz: "O'yinlar", ru: 'Игры' })}</span>
          <b className="jt-oyin-sar">{tr(o.kun)}, {o.soat}</b>
          <span className="jt-joy">{tr(o.joy)}</span>
          <b className={cxx('jt-son katta', hSon && 'jt-halqa')}>{o.bor} / {o.kerak}</b>
          <Doiralar bor={o.bor} kerak={o.kerak} />
          {oyinKuni
            ? <span className={cxx('jt-btn kel', hKel && 'jt-halqa')}>{tr({ uz: 'Kelaman', ru: 'Приду' })}</span>
            : <span className={cxx('jt-btn', hTug && 'jt-halqa')}>{tr({ uz: "Qo'shilaman", ru: 'Присоединяюсь' })}</span>}
          {oyinKuni && <span className="jt-izoh">{tr({ uz: "O'yin kuni", ru: 'День игры' })}</span>}
        </span>
      )}
    </div>
  );
};

// Brauzer ramkasi + lending. matn: { nom, nomBor, sarlavha, osti, foydalar, tugma ('' — yozuvsiz), bolimH, bolim } · bolak(nom) — ref (uchish va chiziq uchun)
// holat: bo'lak holatlari { sarlavha|osti|foydalar|tugma: 'joriy' | 'yozildi' | 'xato' } · sarlavhaJoy: 'yoq' | 'bosh' | 'halqa' · surildi — sahifa bo'limga suriladi (ichki translateY)
const LendingSahifa = ({ ustida, joylar, matn, nomKatta, sarlavhaJoy = 'yoq', holat = {}, yorliq = {}, tugmaHalqa, onTugma, tugmaBos, surildi, manzil, web, tel = true, parda, pardaUstida, bolak, tahrir, ostida, className, qisqa }) => {
  const ichRef = useRef(null), bolimRef = useRef(null);
  const [siljish, setSiljish] = useState(0);
  useLayoutEffect(() => {
    if (!surildi || !bolimRef.current) { setSiljish(0); return; }
    const kor = ichRef.current && ichRef.current.parentElement;
    const b = bolimRef.current;
    setSiljish(Math.max(0, b.offsetTop + b.offsetHeight + 18 - (kor ? kor.clientHeight : 0)));
  }, [surildi, web]);
  const R = (k) => (bolak ? (el) => bolak(k, el) : undefined);
  const T9 = (k) => (tahrir && tahrir[k] ? <button type="button" className="ls-tahrir" onClick={tahrir[k]} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button> : null);
  const f = matn.foydalar;
  return (
    <div className={cxx('ls-wrap', className)}><div className={cxx('ls-oyna', qisqa && 'qisqa')}>
      <div className="ls-bar"><i /><i /><i /><span className="ls-url"><Qulf /><span key={web ? 'w' : 'l'} className="ls-url-t">{manzil || (web ? '….netlify.app' : 'maydon-jamoa-….netlify.app')}</span></span></div>
      <div className="ls-kor">
        {web ? (
          <div className="ls-web fade-step">
            <span className="ls-web-nom">{matn.nom}</span>
            <b className="ls-web-sar">{tr({ uz: "O'yinlar", ru: 'Игры' })}</b>
            <span className="jt-karta">
              <b>{tr(MENTOR_LENDING.telefon.oyin.kun)}, {MENTOR_LENDING.telefon.oyin.soat}</b>
              <span>{tr(MENTOR_LENDING.telefon.oyin.joy)}</span>
              <b className="jt-son">8 / 10</b>
            </span>
          </div>
        ) : (
          <div className="ls-ichi" ref={ichRef} style={{ transform: siljish ? `translateY(-${siljish}px)` : undefined }}>
            <span className={cxx('ls-nom', nomKatta && 'katta', !matn.nomBor && 'yoq', holat.nom === 'joriy' && 'joriy')} ref={R('nom')}>{matn.nom || tr({ uz: 'mahsulot nomi', ru: 'название продукта' })}{T9('nom')}</span>
            {matn.sarlavha
              ? <h3 className={cxx('ls-sar', holat.sarlavha)} ref={R('sarlavha')}><span key={matn.sarlavha} className="ls-yoz">{matn.sarlavha}</span>{T9('sarlavha')}</h3>
              : (sarlavhaJoy !== 'yoq' || joylar) && <span className={cxx('ls-sar-joy', sarlavhaJoy === 'halqa' && 'ls-halqa', holat.sarlavha === 'joriy' && 'joriy')} ref={R('sarlavha')} />}
            {yorliq.sarlavha && <span className="ls-yorliq" key={String(yorliq.sarlavhaK)}>{yorliq.sarlavha}</span>}
            {matn.osti ? <p className={cxx('ls-osti', holat.osti)} ref={R('osti')}><span key={matn.osti} className="ls-yoz">{matn.osti}</span>{T9('osti')}</p>
              : joylar && <span className={cxx('ls-osti-joy', holat.osti === 'joriy' && 'joriy')} ref={R('osti')} />}
            {yorliq.osti && <span className="ls-yorliq">{yorliq.osti}</span>}
            {yorliq.tugma && <span className="ls-yorliq tepa">{yorliq.tugma}</span>}
            <span className="ls-tugma-q" ref={R('tugma')}>
              <button type="button" className={cxx('ls-tugma', !matn.tugma && 'bosh', tugmaHalqa && 'ls-halqa', tugmaBos && 'bos', holat.tugma)} disabled={!onTugma} onClick={onTugma}>{matn.tugma || '›'}</button>
              {T9('tugma')}
            </span>
            {(tel || f) && (
              <div className="ls-qator">
                {tel && <JamoaTelefon className="ls-tel" />}
                {f && <ul className={cxx('ls-foydalar', holat.foydalar)} ref={R('foydalar')}>
                  {f.map((x, i) => (x.foyda || x.funksiya) ? <li key={i + (x.foyda || '')} style={{ '--d': (0.1 + i * 0.18) + 's' }}><b>{x.foyda}</b><span>{x.funksiya}</span></li> : joylar ? <li key={'j' + i} className="ls-foy-joy" /> : null)}
                  {T9('foydalar')}
                </ul>}
              </div>
            )}
            {matn.bolim && <div className="ls-bolim" ref={bolimRef}><b>{matn.bolimH}</b><span>{matn.bolim}</span></div>}
          </div>
        )}
        {parda && <div className="ls-parda">{pardaUstida}</div>}
        {ustida && <div className="ls-ustida">{ustida}</div>}
      </div>
      </div>
      {ostida}
    </div>
  );
};

// Ixcham artefakt-strip (U-042): «Sahifam · n / 4» — amaliyot ekranida (yakunda yo'q — F-1006-375)
const bolakSoni = (l) => !l ? 0 : [l.sarlavha, l.osti, (l.foydalar || []).filter(Boolean).length === 3 && (l.funksiyaQatori || []).filter(Boolean).length === 3, l.tugma].filter(Boolean).length;
const SahifamStrip = ({ l }) => {
  const n = bolakSoni(l);
  return (
    <div className="ld-strip fade-up">
      <span className="ld-strip-l">{tr({ uz: 'Sahifam', ru: 'Моя страница' })} · {n} / 4</span>
      <span className="ld-strip-t">{l && l.sarlavha ? l.sarlavha : '—'}</span>
      {l && l.tugma && <span className="ld-strip-b">{l.tugma}</span>}
    </div>
  );
};
// O'quvchi sahifasi (9–11-ekranlar): pm-m10d1-lending dan; nom — pm-m9d4-final.goya yoki kalitdagi nom
const oquvchiMatn = (l, nomG) => ({
  nom: (l && l.nom) || nomG || '', nomBor: !!((l && l.nom) || nomG),
  sarlavha: (l && l.sarlavha) || null, osti: (l && l.osti) || null, tugma: (l && l.tugma) || '',
  foydalar: [0, 1, 2].map(i => ({ foyda: (l && l.foydalar && l.foydalar[i]) || '', funksiya: (l && l.funksiyaQatori && l.funksiyaQatori[i]) || '' })),
  bolimH: tr({ uz: "Qanday qo'shilaman", ru: 'Как присоединиться' }), bolim: ''
});

// Real ko'rinishdagi odam (SABOQ 36): bosh, soch, yuz belgisi, rangli kiyim, qo'lida telefon
const Odam = ({ className }) => (
  <svg className={className} viewBox="0 0 72 124" aria-hidden="true">
    <rect x="24" y="80" width="10" height="34" rx="5" fill="#3B3F5C" />
    <rect x="37" y="80" width="10" height="34" rx="5" fill="#3B3F5C" />
    <rect x="20" y="110" width="15" height="7" rx="3.5" fill="#2A2730" />
    <rect x="37" y="110" width="15" height="7" rx="3.5" fill="#2A2730" />
    <rect x="12" y="48" width="10" height="32" rx="5" fill="#E07A5F" />
    <circle cx="17" cy="81" r="4.4" fill="#E3A87C" />
    <rect x="18" y="44" width="36" height="42" rx="13" fill="#E07A5F" />
    <rect x="31" y="38" width="9" height="9" rx="3" fill="#E3A87C" />
    <rect x="50" y="48" width="10" height="20" rx="5" fill="#E07A5F" />
    <rect x="47" y="60" width="20" height="9" rx="4.5" fill="#E07A5F" transform="rotate(-28 57 64)" />
    <rect x="57" y="44" width="9" height="15" rx="2" fill="#2A2730" />
    <circle cx="61" cy="58" r="4" fill="#E3A87C" />
    <circle cx="35.5" cy="27" r="14" fill="#E3A87C" />
    <path d="M21 26 C19 8, 52 8, 50 26 C45 18, 30 17, 21 26 Z" fill="#2E2019" />
    <circle cx="31" cy="28" r="1.7" fill="#2A2730" />
    <circle cx="40" cy="28" r="1.7" fill="#2A2730" />
    <path d="M31.5 34 Q35.5 37 39.5 34" stroke="#8A4B3A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <circle cx="44" cy="32" r="2.2" fill="#E8867A" opacity="0.35" />
  </svg>
);

// Bosish → narsa uchadi (SABOQ 19): manba elementidan nishon elementiga uchadigan yozuv; portal — transformli ota-blokka bog'lanmasin
function useUchish() {
  const [uchlar, setUchlar] = useState([]);
  const kRef = useRef(0);
  const uch = useCallback((fromEl, toEl, matn) => {
    if (!fromEl || !toEl || kamHarakat() || typeof document === 'undefined') return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const k = ++kRef.current;
    setUchlar(u => [...u, { k, matn, x: a.left, y: a.top, dx: b.left - a.left, dy: b.top - a.top }]);
    setTimeout(() => setUchlar(u => u.filter(z => z.k !== k)), 820);
  }, []);
  const qatlam = typeof document !== 'undefined' && uchlar.length > 0
    ? createPortal(uchlar.map(z => <span key={z.k} className="ld-uch" style={{ left: z.x, top: z.y, '--dx': z.dx + 'px', '--dy': z.dy + 'px' }}>{z.matn}</span>), document.body)
    : null;
  return [uch, qatlam];
}
// Ipucha: 40 s harakatsizlikda bitta qator (javobni aytmaydi)
const useIpucha = (faol, dep) => {
  const [ko, setKo] = useState(false);
  useEffect(() => { setKo(false); if (!faol) return undefined; const t = setTimeout(() => setKo(true), 40000); return () => clearTimeout(t); }, [faol, dep]);
  return ko && faol;
};
// Taxmin qatori — yashil xulosaning birinchi, kichik qatori (SABOQ 25; F-1006-372: tanlangan javob qaytarilmaydi — u tepada turibdi)
const TaxminQ = ({ togri, haqiqat }) => (
  <span className={cxx('ld-tx', togri && 'ok')}>{togri
    ? <>{tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение оказалось верным' })} <b>✓</b></>
    : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })} <b className="yoq">✕</b> — {tr({ uz: 'aslida', ru: 'на деле' })}: <b>{haqiqat}</b></>}</span>
);
// Bashorat tanlangach — ixcham qator natijagacha turadi (SABOQ 11)
const BashoratQ = ({ savol, javob }) => <div className="ld-bashq fade-step"><span>{savol}</span><span className="ld-bashq-t">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: <b>{javob}</b></span></div>;

// ===== SCREEN 0 — KIRISH (QKirish; ballsiz — J-026: correct false hammaga; «Aynan!» / «Qiziq fikr!») =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Chiroyli rasm va yorqin ranglar', ru: 'Красивая картинка и яркие цвета' } },
  { id: 'b', label: { uz: 'Kim uchun va nima foyda ekani', ru: 'Для кого это и какая польза' } },
  { id: 'c', label: { uz: "Hamma funksiyalarning ro'yxati", ru: 'Список всех функций' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Sahifada hozir nom va telefon bor — bu kim uchun va nima foyda berishi yozilmagan.</>, ru: <><b>Именно!</b> Сейчас на странице есть название и телефон — не написано, для кого это и какую пользу даёт.</> },
  a: { uz: <><b>Qiziq fikr!</b> Rasm sahifani bezaydi, lekin undan bu kim uchun va nima foyda berishi bilinmaydi.</>, ru: <><b>Интересная мысль!</b> Картинка украшает страницу, но из неё не понять, для кого это и какую пользу даёт.</> },
  c: { uz: <><b>Qiziq fikr!</b> Funksiyalar ham yoziladi, lekin sahifada avval bu kim uchun ekani aytilishi kerak.</>, ru: <><b>Интересная мысль!</b> Функции тоже пишут, но сначала на странице нужно сказать, для кого это.</> }
};
// 0-ekran maketi: sahifada haqiqatan bor narsa — nom, telefon, yozuvsiz tugma (SABOQ 33); sarlavha yo'q; oldida odam va «?» pufagi (SABOQ 36)
const HookMaket = ({ tanlandi }) => (
  <div className="ld-hook">
    <LendingSahifa nomKatta matn={{ nom: MENTOR_LENDING.nom, nomBor: true, tugma: '', bolimH: ML('bolimH'), bolim: ML('bolim') }} sarlavhaJoy={tanlandi ? 'halqa' : 'yoq'} qisqa />
    <div className="ld-hook-odam"><Odam className="ld-odam" /><span className="ld-pufak">?</span></div>
  </div>
);
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} scrollSignal={picked ? 1 : 0} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? tr({ uz: 'Bittasini tanlang', ru: 'Выберите один вариант' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className={cxx('ld-s0', picked === null && 'kutish')}>
        <QKirish zoom={Zoomable}
          sarlavha={tr({ uz: <>Mahsulotingizni bir sahifada <A>qanday tanishtirasiz?</A></>, ru: <>Как представить продукт <A>на одной странице?</A></> })}
          mentor={<Mentor>{tr({ uz: "Mahsulotni hali ko'rmagan odam shu sahifani ochdi: sizningcha, unga birinchi nima yetishmaydi?", ru: 'Эту страницу открыл человек, который ещё не видел продукт: как думаете, чего ему не хватает в первую очередь?' })}</Mentor>}
          maket={<HookMaket tanlandi={picked !== null} />}
          variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick}
          javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
        />
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja; vizual — reja qatorlarining o'z so'zlari bilan, bo'sh chiziq yo'q — SABOQ 33; 2-ekran kashfiyoti ochilmaydi) =====
const REJA = [
  { t: { uz: 'Sahifaning birinchi qatorini yozishni bilib olasiz', ru: 'Научитесь писать первую строку страницы' }, teg: { uz: 'sarlavha', ru: 'заголовок' } },
  { t: { uz: 'Funksiyani odamga beradigan foydaga aylantirasiz', ru: 'Превратите функцию в пользу для человека' }, teg: { uz: 'foyda', ru: 'польза' } },
  { t: { uz: <><Insta /> nimadan boshlanganini ko'rasiz</>, ru: <>Увидите, с чего начинался <Insta /></> }, teg: { uz: 'voqea', ru: 'история' } },
  { t: { uz: 'Sahifani sherigingiz bilan sinab, internetga chiqarasiz', ru: 'Проверите страницу с партнёром и выложите в интернет' }, teg: { uz: 'sinov', ru: 'проверка' } }
];
const RejaChizma = () => (
  <div className="ld-reja">
    <div className="ld-reja-bar"><i /><i /><i /><span className="ld-reja-url" style={{ '--d': '2.4s' }}><Qulf />….netlify.app</span></div>
    <div className="ld-reja-ichi">
      <span className="ld-rj nom" style={{ '--d': '0s' }}>{MENTOR_LENDING.nom}</span>
      <span className="ld-rj sar" style={{ '--d': '0.4s' }}>{tr({ uz: 'sarlavha', ru: 'заголовок' })}</span>
      <span className="ld-rj tug" style={{ '--d': '0.8s' }}>{tr({ uz: 'tugma', ru: 'кнопка' })}</span>
      <div className="ld-rj-qator">
        <span className="ld-rj tel" style={{ '--d': '1.2s' }}><b>{MENTOR_LENDING.nom}</b><i>8 / 10</i></span>
        <span className="ld-rj-foy">{[0, 1, 2].map(i => <span key={i} className="ld-rj foy" style={{ '--d': (1.6 + i * 0.4) + 's' }}>{tr({ uz: 'foyda', ru: 'польза' })}</span>)}</span>
      </div>
    </div>
  </div>
);
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun mahsulotingizni tanishtiradigan <A>sahifa yozasiz.</A></>, ru: <>Сегодня вы напишете <A>страницу о своём продукте.</A></> })}
      mentor={<Mentor>{tr({ uz: "11-Modulda mahsulotingizni qurdingiz va sinadingiz. Bugungi matnni o'zingiz yozasiz, kodini esa agent yig'adi.", ru: 'В 11-м модуле вы построили и проверили свой продукт. Сегодняшний текст пишете сами, а код соберёт агент.' })}</Mentor>}
      chapYorliq={<>{tr({ uz: 'Dars oxirida: sarlavha, foyda va bitta tugma', ru: 'В конце урока: заголовок, польза и одна кнопка' })} <code className="ld-teg">lending</code></>}
      chap={<RejaChizma />}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — SARLAVHA (QTushuncha markaziy: bashorat → savol-tugmalar → sarlavha PRD so'zlaridan yoziladi; tugagach natija fokusga) =====
const S2_TAXMIN = [
  { k: 'olib', t: { uz: 'Sahifadan olib tashlanadi', ru: 'Убирается со страницы' } },
  { k: 'kichik', ok: true, t: { uz: 'Tepada kichik bo\'lib turadi', ru: 'Остаётся маленьким наверху' } },
  { k: 'katta', t: { uz: 'Eng katta yozuv bo\'lib qoladi', ru: 'Остаётся самой крупной надписью' } }
];
const S2_SAVOL = { uz: "Sarlavha yozilgach, «Maydon Jamoa» nomi qanday turadi?", ru: 'Как будет выглядеть название «Maydon Jamoa», когда появится заголовок?' };
const S2_SAVOLLAR = [
  { savol: { uz: 'Kim uchun?', ru: 'Для кого?' }, prd: 'kim', ajraladi: { uz: "Mahalladagi mini-futbol o'yinchilari", ru: 'Игроки в мини-футбол в махалле' }, yorliq: { uz: 'kim uchun', ru: 'для кого' } },
  { savol: { uz: 'Nima foyda?', ru: 'Какая польза?' }, prd: 'muammo', ajraladi: { uz: "jamoaga yetarli odam yig'ishda", ru: 'собрать в команду достаточно людей' }, yorliq: { uz: 'kim uchun · nima foyda', ru: 'для кого · какая польза' } },
  { savol: { uz: 'Qanday qilib?', ru: 'Каким образом?' }, prd: 'yechim', ajraladi: null, yorliq: { uz: 'sarlavha osti', ru: 'подзаголовок' } }
];
const S2_QISMI = { uz: 'Mahalla futboliga', ru: 'Для футбола в махалле' };
const PRD_QATOR = [
  { k: 'muammo', l: { uz: 'Muammo', ru: 'Проблема' } },
  { k: 'kim', l: { uz: 'Kim uchun', ru: 'Для кого' } },
  { k: 'yechim', l: { uz: 'Yechim', ru: 'Решение' } }
];
const Ajrat = ({ matn, qism, on }) => {
  if (!on) return <>{matn}</>;
  if (!qism || matn.indexOf(qism) < 0) return <mark className="ld-mark">{matn}</mark>;
  const i = matn.indexOf(qism);
  return <>{matn.slice(0, i)}<mark className="ld-mark">{qism}</mark>{matn.slice(i + qism.length)}</>;
};
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [q, setQ] = useState(storedAnswer ? 3 : 0);
  const done = q >= 3;
  const tugadi = useTugadi(done, 1300, !!storedAnswer);
  const ipucha = useIpucha(!!taxmin && !done, q);
  const [uch, qatlam] = useUchish();
  const els = useRef({});
  const btnRef = useRef([]);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const bos = (i) => {
    if (i !== q) return;
    const s = S2_SAVOLLAR[i];
    const nishon = i === 2 ? 'osti' : 'sarlavha';
    uch(btnRef.current[i], els.current[nishon] || els.current.sarlavha, tr(s.ajraladi || MENTOR_PRD.yechim).slice(0, 40));
    setQ(i + 1);
  };
  const tx = S2_TAXMIN.find(x => x.k === taxmin);
  const matn = { nom: MENTOR_LENDING.nom, nomBor: true, tugma: '', bolimH: ML('bolimH'), bolim: ML('bolim'),
    sarlavha: q >= 2 ? ML('sarlavha') : q === 1 ? tr(S2_QISMI) : null, osti: q >= 3 ? ML('osti') : null };
  const yor = q === 1 ? tr(S2_SAVOLLAR[0].yorliq) : q >= 2 ? tr(S2_SAVOLLAR[1].yorliq) : null;
  const sahifa = (
    <LendingSahifa matn={matn} nomKatta={q === 0} sarlavhaJoy={q === 0 ? 'bosh' : 'yoq'}
      holat={{ sarlavha: q === 1 ? 'joriy' : q === 2 ? 'yozildi' : undefined, osti: q === 3 && !tugadi ? 'yozildi' : undefined }}
      yorliq={{ sarlavha: q > 0 && yor, sarlavhaK: q, osti: q >= 3 && tr(S2_SAVOLLAR[2].yorliq) }}
      bolak={(k, el) => { els.current[k] = el; }}
      ostida={done && <div className="ld-atama fade-step"><span className="ld-atama-y">lending</span><QIzoh>{tr({ uz: 'Mahsulotni bitta sahifada tanishtiradigan sayt — lending deyiladi.', ru: 'Сайт, который представляет продукт на одной странице, называется лендингом.' })}</QIzoh></div>} />
  );
  const prdKarta = (
    <div className={cxx('ld-prd', tugadi && 'ixcham')}>
      <div className="ld-prd-h"><span className="q-yorliq">{tr({ uz: '11-Moduldan · PRD', ru: 'Из 11-го модуля · PRD' })}</span><span className="ld-teg">{tr({ uz: 'Mentor misoli', ru: 'пример Ментора' })}</span></div>
      {!tugadi && PRD_QATOR.map(r => {
        const faol = S2_SAVOLLAR.findIndex(s => s.prd === r.k);
        const on = faol >= 0 && q === faol + 1;
        return <p key={r.k} className={cxx('ld-prd-q', on && 'on')}><b>{tr(r.l)}:</b> <Ajrat matn={tr(MENTOR_PRD[r.k])} qism={S2_SAVOLLAR[faol] && S2_SAVOLLAR[faol].ajraladi && tr(S2_SAVOLLAR[faol].ajraladi)} on={on} /></p>;
      })}
      {!tugadi && taxmin && <div className="ld-qsavollar">
        {S2_SAVOLLAR.map((s, i) => (
          <button key={i} ref={el => { btnRef.current[i] = el; }} type="button" className={cxx('ld-qsavol', i < q && 'ok', i === q && 'ld-halqa')} disabled={i !== q} onClick={() => bos(i)}>{i < q ? '✓ ' : ''}{tr(s.savol)}</button>
        ))}
      </div>}
      {ipucha && <p className="ld-ipucha fade-step">{tr({ uz: "O'ngdagi yoqilgan savolni bosing — sahifada nima o'zgarishini ko'ring.", ru: 'Нажмите на активный вопрос справа — посмотрите, что изменится на странице.' })}</p>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · sarlavha', ru: 'Понятие · заголовок' })} screen={screen} scrollSignal={q} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Savollarni bosing', ru: 'Нажмите на вопросы' })} (${q}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Sahifaning birinchi qatoriga <A>nima yoziladi?</A></>, ru: <>Что пишут <A>в первую строку</A> страницы?</> })}
        mentor={<Mentor>{tr({ uz: "Sarlavhaning so'zlari 11-Moduldagi PRD dan olinadi: o'ngdagi savollarni birma-bir bosing.", ru: 'Слова заголовка берутся из PRD 11-го модуля: нажимайте вопросы справа по одному.' })}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S2_SAVOL)} variantlar={S2_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} />
          : !done && <BashoratQ savol={tr(S2_SAVOL)} javob={tr(tx.t)} />}
        vizual={tugadi ? <div className="ld-fokus">{prdKarta}{sahifa}</div> : <div className="ld-split">{sahifa}{prdKarta}</div>}
        xulosa={done && <>{tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: 'tepada kichik bo\'lib turadi', ru: 'остаётся маленьким наверху' })} />}{tr({ uz: 'Bizda sarlavha ikki savolga javob beradi: kim uchun va nima foyda. Nom esa tepada kichik turadi.', ru: 'У нас заголовок отвечает на два вопроса: для кого и какая польза. А название — маленькое наверху.' })}</>}
      />
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 3 — 1-SAVOL (QuestionScreen → QTest; ✔ B, INLINE_KEYS.s3 = 1; savol ustida yorliq yo'q — SABOQ 6) =====
const MiniSahifa = ({ children, url }) => <div className="ld-mini"><div className="ls-bar"><i /><i /><i /><span className="ls-url"><Qulf /><span className="ls-url-t">{url || '….netlify.app'}</span></span></div><div className="ld-mini-ichi">{children}</div></div>;
const Screen3 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · sarlavha', ru: 'Проверка · заголовок' })}
    questionText="Sinf uy vazifalari sayti. Qaysi sarlavhada kim uchun va foyda bor?"
    question={tr({ uz: <h2 className="title h-ask">Sinf uy vazifalari sayti. Qaysi sarlavhada <A>kim uchun va foyda</A> bor?</h2>, ru: <h2 className="title h-ask">Сайт домашних заданий класса. В каком заголовке есть <A>для кого и польза</A>?</h2> })}
    options={[
      { uz: '«Vazifalar» — zamonaviy va qulay yangi sayt', ru: '«Задания» — современный и удобный новый сайт' },
      { uz: "Sinfdoshlar, uy vazifasini bir joyda ko'ring", ru: 'Одноклассники, смотрите домашку в одном месте' },
      { uz: 'Fanlar, jadval, fayllar va izohlar bo\'limi', ru: 'Раздел предметов, расписания, файлов и заметок' },
      { uz: "React va NestJS'da qurilgan tezkor yangi sayt", ru: 'Быстрый новый сайт на React и NestJS' }
    ]} correctIdx={1}
    explainCorrect={{ uz: "Kim uchun — sinfdoshlar; foyda — vazifa bir joyda ko'rinadi.", ru: 'Для кого — одноклассники; польза — задания видны в одном месте.' }}
    explainWrong={{
      0: { uz: 'Nom va sifat bor, lekin sayt kim uchun ekani yozilmagan.', ru: 'Есть название и прилагательное, но не написано, для кого сайт.' },
      2: { uz: "Bu bo'limlar ro'yxati — odam nima olishi ko'rinmaydi.", ru: 'Это список разделов — не видно, что получит человек.' },
      3: { uz: 'Texnologiya quruvchiga muhim; odam undan nima oladi?', ru: 'Технология важна строителю; а что получит человек?' },
      default: { uz: 'Ikki savolni bering: kim uchun? nima foyda?', ru: 'Задайте два вопроса: для кого? какая польза?' }
    }}
    vizual={<MiniSahifa><b className="ld-mini-sar"><span className="ld-mini-b">{tr({ uz: 'Sinfdoshlar', ru: 'Одноклассники' })}<i>{tr({ uz: 'kim uchun', ru: 'для кого' })}</i></span>, {tr({ uz: 'uy vazifasini', ru: 'домашку' })} <span className="ld-mini-b">{tr({ uz: "bir joyda ko'ring", ru: 'смотрите в одном месте' })}<i>{tr({ uz: 'nima foyda', ru: 'какая польза' })}</i></span></b></MiniSahifa>} />
);

// ===== SCREEN 4 — FUNKSIYADAN FOYDAGA (QTushuncha ketma-ket, 4 karta; SABOQ 9/13): telefon chapda · bitta karta o'ngda · juftliklar telefon yonida =====
const JUFTLIKLAR = [
  { funksiya: { uz: "«Qo'shilaman» tugmasi", ru: 'Кнопка «Присоединяюсь»' }, halqa: 'tugma', togri: 0,
    tanlov: [kichikT(MENTOR_LENDING.foydalar[0].foyda), { uz: "bosilsa ro'yxatga yozadi", ru: 'при нажатии записывает в список' }, { uz: "Backend'ga so'rov yuboradi", ru: 'отправляет запрос в Backend' }] },
  { funksiya: { uz: '«8 / 10» soni', ru: 'Число «8 / 10»' }, halqa: 'son', togri: 1,
    tanlov: [{ uz: "qo'shilganlar va kerakli odam soni yoziladi", ru: 'пишется число присоединившихся и нужных людей' }, kichikT(MENTOR_LENDING.foydalar[1].foyda), { uz: "son har qo'shilishda bittaga oshib boradi", ru: 'число растёт на один при каждом присоединении' }] },
  { funksiya: { uz: '«Kelaman» belgisi', ru: 'Отметка «Приду»' }, halqa: 'kelaman', oyinKuni: true, togri: 2,
    tanlov: [{ uz: "belgi faqat o'yin kuni ekranda paydo bo'ladi", ru: 'отметка появляется на экране только в день игры' }, { uz: "bosilganda tasdiq Backend'ga yozib qo'yiladi", ru: 'при нажатии подтверждение записывается в Backend' }, kichikT(MENTOR_LENDING.foydalar[2].foyda)] },
  { nom: { uz: "O'yindan oldin eslatma", ru: 'Напоминание перед игрой' }, haliYoq: true, togri: 1,
    tanlov: [{ uz: 'Sahifaga yoziladi', ru: 'Пишется на страницу' }, { uz: 'Hozircha yozilmaydi', ru: 'Пока не пишется' }] }
];
const S4_CHIP = [{ uz: "«Qo'shilaman»", ru: '«Присоединяюсь»' }, { uz: '«8 / 10»', ru: '«8 / 10»' }, { uz: '«Kelaman»', ru: '«Приду»' }, { uz: 'Eslatma', ru: 'Напоминание' }];
const S4_XATO = [{ uz: "Bu funksiya nima qilishi — odam nima olishi emas.", ru: 'Это то, что делает функция, — а не то, что получает человек.' }, { uz: "Ilovada eslatma hali yo'q — telefonga qarang.", ru: 'Напоминания в приложении ещё нет — посмотрите на телефон.' }];
const S4_YORDAM = [{ uz: "Shu funksiya tufayli o'yinchi nimani qilmay qo'yadi yoki nimani biladi?", ru: 'Что игрок перестаёт делать или что узнаёт благодаря этой функции?' }, { uz: 'Sahifani o\'qigan odam ilovani ochganda shu narsani topadimi?', ru: 'Найдёт ли это человек, прочитавший страницу, когда откроет приложение?' }];
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const [k, setK] = useState(storedAnswer ? 4 : 0);
  const [xato, setXato] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [silk, setSilk] = useState(0);
  const [yangi, setYangi] = useState(-1);
  const wrongRef = useRef(false);
  const done = k >= 4;
  const tugadi = useTugadi(done, 1200, !!storedAnswer);
  const [uch, qatlam] = useUchish();
  const tanlovRef = useRef([]), royxatRef = useRef(null), qutiRef = useRef(null);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    const first = !wrongRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: first, firstAttemptCorrect: first, solved: true, picked: true });
  }, [done]); // eslint-disable-line
  useEffect(() => { if (yangi < 0) return undefined; const t = setTimeout(() => setYangi(-1), 1100); return () => clearTimeout(t); }, [yangi]);
  const j = JUFTLIKLAR[Math.min(k, 3)];
  const tanla = (i) => {
    if (done) return;
    if (i !== j.togri) {
      wrongRef.current = true; if (achMiss) achMiss.miss(screen);
      setXato(tr(S4_XATO[j.haliYoq ? 1 : 0])); setYordam(true); setSilk(s => s + 1);
      return;
    }
    uch(tanlovRef.current[i], j.haliYoq ? qutiRef.current : royxatRef.current, tr(j.tanlov[i]));
    setXato(null); setYordam(false); setYangi(k); setK(k + 1);
  };
  const yozilgan = JUFTLIKLAR.slice(0, Math.min(k, 3));
  const sahifaMatn = { ...mentorMatn({ tugma: false }) };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · foyda', ru: 'Понятие · польза' })} screen={screen} scrollSignal={k} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Funksiyalarni oching', ru: 'Откройте функции' })} (${k}/4)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Funksiya odamga <A>nima beradi?</A></>, ru: <>Что функция <A>даёт человеку?</A></> })}
        mentor={<Mentor>{tr({ uz: "Telefonda ajralib turgan funksiyaga qarang va u odamga nima berishini o'ngdagi kartadan tanlang.", ru: 'Посмотрите на выделенную функцию в телефоне и выберите в карточке справа, что она даёт человеку.' })}</Mentor>}
        bashorat={!tugadi && <QQadamlar qadamlar={S4_CHIP.map(tr)} joriy={done ? undefined : k} />}
        vizual={tugadi
          ? <div className="ld-fokus">
              <LendingSahifa matn={sahifaMatn} holat={{ foydalar: 'yozildi' }} />
              <div className="ld-tashqi"><span className="ld-eslatma-chip">{tr({ uz: 'Eslatma', ru: 'Напоминание' })}</span><span className="ld-tashqi-y">{tr({ uz: "hali yo'q", ru: 'ещё нет' })}</span></div>
              <QIzoh>{tr({ uz: 'Mentor sahifasida har foyda katta yozilgan, ostida — uni beradigan funksiya.', ru: 'На странице Ментора каждая польза написана крупно, под ней — функция, которая её даёт.' })}</QIzoh>
            </div>
          : <div className="ld-split ld-s4">
              <div className="ld-s4-chap">
                <JamoaTelefon ekran="oyin" oyinKuni={!!j.oyinKuni} halqa={!done && !j.haliYoq ? j.halqa : null} />
                {k > 0 && <div className="ld-juft-kol">
                  {<div className="ld-atama fade-step"><span className="ld-atama-y">{tr({ uz: 'foyda', ru: 'польза' })}</span><QIzoh>{tr({ uz: 'Funksiya odamga nima berishi — foyda deyiladi.', ru: 'То, что функция даёт человеку, называется пользой.' })}</QIzoh></div>}
                  <ul className="ld-juftlar" ref={royxatRef}>
                    {yozilgan.map((p, i) => <li key={i} className={cxx(yangi === i && 'yangi')}><span className="ld-jf">{tr(p.funksiya)}</span><i className="ld-chiz" aria-hidden="true" /><b>{tr(p.tanlov[p.togri])}</b></li>)}
                  </ul>
                  {k >= 3 && <div className={cxx('ld-quti', k >= 4 && 'tushdi')} ref={qutiRef}><span className="ld-quti-y">{tr({ uz: "hali yo'q", ru: 'ещё нет' })}</span>{k >= 4 && <span className="ld-eslatma-chip">{tr({ uz: 'Eslatma', ru: 'Напоминание' })}</span>}</div>}
                </div>}
              </div>
              {!done && <div key={k} className={cxx('ld-karta', xato && 'err')}>
                <span className="q-yorliq">{j.haliYoq ? tr({ uz: 'roadmap: keyinroq', ru: 'roadmap: позже' }) : tr({ uz: 'funksiya', ru: 'функция' })}</span>
                <b className="ld-karta-nom">{tr(j.haliYoq ? j.nom : j.funksiya)}</b>
                {j.haliYoq && <span className="ld-kulrang">{tr({ uz: "ilovada hali yo'q", ru: 'в приложении ещё нет' })}</span>}
                <div key={silk} className={cxx('ld-tanlovlar', 'ld-halqa-guruh', silk > 0 && 'silk')}>
                  {j.tanlov.map((t, i) => <button key={i} ref={el => { tanlovRef.current[i] = el; }} type="button" className="ld-tanlov" onClick={() => tanla(i)}>{tr(t)}</button>)}
                </div>
                {xato && <QXato>{xato}</QXato>}
                {yordam && <p className="ld-yordam fade-step">{tr(S4_YORDAM[j.haliYoq ? 1 : 0])}</p>}
              </div>}
            </div>}
        xulosa={done && tr({ uz: "Bu misolda sahifaga funksiya nomi emas, uning foydasi yozildi — hali yo'q eslatma esa yozilmadi.", ru: 'В этом примере на страницу написали не название функции, а её пользу — а напоминание, которого ещё нет, не написали.' })}
      />
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 5 — 2-SAVOL (QuestionScreen; ✔ D, INLINE_KEYS.s5 = 3) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Tekshiruv · funksiya va foyda', ru: 'Проверка · функция и польза' })}
    questionText="To'garaklar sayti xaritani ko'rsatadi. Qaysi gap foydani aytadi?"
    question={tr({ uz: <h2 className="title h-ask">To'garaklar sayti xaritani ko'rsatadi. Qaysi gap <A>foydani</A> aytadi?</h2>, ru: <h2 className="title h-ask">Сайт кружков показывает карту. Какая фраза говорит о <A>пользе</A>?</h2> })}
    options={[
      { uz: "Xarita manzillarni Database'dan oladi", ru: 'Карта берёт адреса из Database' },
      { uz: 'Xarita telefon ekraniga moslashtirilgan', ru: 'Карта адаптирована под экран телефона' },
      { uz: 'Tugma bilan xaritani kattalashtirasiz', ru: 'Кнопкой увеличиваете карту' },
      { uz: "Yaqin to'garakni xaritadan tez topasiz", ru: 'Быстро находите ближний кружок на карте' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "Bu gap odam nima olishini aytadi: yaqin to'garakni topadi.", ru: 'Эта фраза говорит, что получит человек: найдёт ближний кружок.' }}
    explainWrong={{
      0: { uz: 'Bu sayt qanday ishlashi — odam nima olishi emas.', ru: 'Это то, как работает сайт, — а не то, что получит человек.' },
      1: { uz: 'Bu sayt qanday qurilgani; odam undan nima oladi?', ru: 'Это то, как построен сайт; а что получит человек?' },
      2: { uz: "Bu funksiyaning o'zi: kattalashtirish nima beradi?", ru: 'Это сама функция: а что даёт увеличение?' },
      default: { uz: 'Funksiya tufayli odam nimaga erishadi — shuni qidiring.', ru: 'Ищите, чего человек добьётся благодаря функции.' }
    }}
    vizual={<ul className="ld-juftlar mini"><li><span className="ld-jf">{tr({ uz: "to'garaklar xaritasi", ru: 'карта кружков' })}</span><i className="ld-chiz" aria-hidden="true" /><b>{tr({ uz: "yaqin to'garakni tez topasiz", ru: 'быстро находите ближний кружок' })}</b></li></ul>} />
);

// ===== SCREEN 6 — ASOSIY TUGMA (QTushuncha: bashorat → «Qo'shilmoqchiman» → sahifa bo'limga suriladi, Umami sanaydi; trek chipi) =====
const S6_TAXMIN = [
  { k: 'hech', t: { uz: 'Hech narsa ochilmaydi', ru: 'Ничего не открывается' } },
  { k: 'bolim', ok: true, t: { uz: "Shu sahifadagi bo'lim", ru: 'Раздел на этой же странице' } },
  { k: 'sayt', t: { uz: "Boshqa sayt — ilova do'koni", ru: 'Другой сайт — магазин приложений' } }
];
const S6_SAVOL = { uz: "«Qo'shilmoqchiman» bosilganda nima ochiladi?", ru: 'Что откроется при нажатии «Хочу присоединиться»?' };
// Umami hisoblagichi (9-Modul ko'rinishi, chizilgan, logotipsiz; SABOQ 24 — bitta jonli son)
const UmamiSanoq = ({ son, ixcham }) => (
  <div className={cxx('ld-umami', ixcham && 'ixcham')}>
    <span className="ld-umami-n">Umami</span>
    <span className="ld-umami-l">{tr({ uz: 'tugma bosilishi', ru: 'нажатия кнопки' })}:</span>
    <b key={son} className={cxx('ld-umami-s', son > 0 && 'yangi')}>{son}</b>
    {son > 0 && <code className="ld-umami-h fade-step">qoshilmoqchiman</code>}
  </div>
);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [son, setSon] = useState(storedAnswer ? 1 : 0);
  const [trek, setTrek] = useState('mobil');
  const [webBos, setWebBos] = useState(!!storedAnswer);
  const [bos, setBos] = useState(false);
  const done = son >= 1;
  const tugadi = useTugadi(done && webBos, 1500, !!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'tushuncha', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  useEffect(() => { if (!bos) return undefined; const t = setTimeout(() => setBos(false), 260); return () => clearTimeout(t); }, [bos]);
  const bosish = () => { setBos(true); setSon(n => n + 1); if (trek === 'web') setWebBos(true); };
  const webKor = trek === 'web' && webBos && !tugadi;
  const tx = S6_TAXMIN.find(x => x.k === taxmin);
  const webMi = trek === 'web', mobilMi = trek === 'mobil';
  const halqa = !!taxmin && (mobilMi ? son === 0 : !webBos);
  const sahifa = (
    <LendingSahifa matn={mentorMatn()} tugmaHalqa={halqa} onTugma={taxmin && !tugadi ? bosish : undefined} tugmaBos={bos}
      surildi={trek === 'mobil' && son > 0 && !tugadi} web={webKor} manzil={webKor ? '….netlify.app' : undefined}
      yorliq={{ tugma: son > 0 && tr({ uz: 'asosiy tugma', ru: 'главная кнопка' }) }}
      ostida={<>
        {webKor && <span className="ld-kulrang fade-step">{tr({ uz: 'web-trekda tugma saytni ochadi', ru: 'в веб-треке кнопка открывает сайт' })}</span>}
        {son > 0 && <QIzoh>{tr({ uz: 'Sahifadagi odamni bitta harakatga chaqiradigan tugma — asosiy tugma. 2-Modulda buni CTA deb atagansiz.', ru: 'Кнопка, которая зовёт человека на странице к одному действию, — главная кнопка. Во 2-м модуле вы называли её CTA.' })}</QIzoh>}
      </>} />
  );
  const ong = (
    <div className="ld-s6-ong">
      <UmamiSanoq son={son} ixcham={tugadi} />
      {done && !tugadi && <div className="ld-treklar fade-step">
        <button type="button" className={cxx('ld-trek', mobilMi && 'on')} onClick={() => setTrek('mobil')}>{tr({ uz: 'Mobil trek', ru: 'Мобильный трек' })}</button>
        <button type="button" className={cxx('ld-trek', webMi && 'on', !webBos && !webMi && 'ld-halqa')} onClick={() => setTrek('web')}>{tr({ uz: 'Web-trek', ru: 'Веб-трек' })}</button>
      </div>}
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · tugma', ru: 'Понятие · кнопка' })} screen={screen} scrollSignal={son} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Tugmani bosing', ru: 'Нажмите кнопку' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Tugma odamni <A>qayerga olib boradi?</A></>, ru: <>Куда кнопка <A>ведёт человека?</A></> })}
        mentor={<Mentor>{tr({ uz: "Ilovani o'rnatish havolasi hali yo'q, sahifada esa tugma bor: uni bosib ko'ring.", ru: 'Ссылки для установки приложения ещё нет, а кнопка на странице есть: нажмите её.' })}</Mentor>}
        bashorat={!taxmin
          ? <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr(S6_SAVOL)} variantlar={S6_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} />
          : !done && <BashoratQ savol={tr(S6_SAVOL)} javob={tr(tx.t)} />}
        vizual={tugadi ? <div className="ld-fokus">{ong}{sahifa}</div> : <div className="ld-split">{sahifa}{ong}</div>}
        xulosa={done && <>{tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: "shu sahifadagi bo'lim", ru: 'раздел на этой же странице' })} />}{tr({ uz: "Bizda lending uch bo'lakdan iborat: sarlavha, uchta foyda va bitta asosiy tugma. U bor narsaga olib boradi.", ru: 'У нас лендинг состоит из трёх частей: заголовок, три пользы и одна главная кнопка. Она ведёт к тому, что есть.' })}</>}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — INSTAGRAM (QVoqea, PM keys K3 — faqat bank matni; SABOQ 2, 3, 8, 26). Manba: PM_Prompt_v8.md K3 · tayanch 5 =====
const INSTAGRAM_KADR = [
  { h: <Burbn />, m: { uz: "Burbn — Instagram asoschilarining birinchi ilovasi. Unda qayerdaligini belgilash, rejalar va rasm bor edi: funksiya ko'p, lekin uni hech kim ishlatmagan.", ru: 'Burbn — первое приложение основателей Instagram. В нём были отметка, где ты находишься, планы и фото: функций много, но им никто не пользовался.' } },
  { h: { uz: 'Yoqqani qoldi', ru: 'Осталось то, что нравилось' }, m: { uz: 'Asoschilar odamlarga yoqqanidan boshqa hammasini olib tashlagan. Qolgani — rasm, filtr va izohlar.', ru: 'Основатели убрали всё, кроме того, что нравилось людям. Осталось — фото, фильтры и комментарии.' } },
  { h: <Insta />, m: { uz: "Instagram shunday tug'ilgan. 2010-yil oktabr — birinchi kuni 25 000 ta ro'yxatdan o'tish.", ru: 'Так родился Instagram. Октябрь 2010 года — в первый день 25 000 регистраций.' } }
];
const IG_TAXMIN = [
  { k: 'qosh', t: { uz: "Yana funksiya qo'shgan", ru: 'Добавили ещё функции' } },
  { k: 'qoldir', t: { uz: 'Hammasini qoldirgan', ru: 'Оставили всё' } },
  { k: 'olib', ok: true, t: { uz: "Ko'pini olib tashlagan", ru: 'Убрали большую часть' } }
];
const IG_SAVOL = { uz: 'Asoschilar funksiyalar bilan nima qilgan?', ru: 'Что основатели сделали с функциями?' };
const IG_MENYU = [{ k: 'belgi', t: { uz: 'Belgilash', ru: 'Отметка' } }, { k: 'reja', t: { uz: 'Rejalar', ru: 'Планы' } }, { k: 'rasm', t: { uz: 'Rasm', ru: 'Фото' } }];
const IgBelgi = ({ k }) => (
  <svg className="ig-ic" viewBox="0 0 16 16" aria-hidden="true">
    {k === 'belgi' && <path d="M8 1.5a4.5 4.5 0 0 1 4.5 4.5c0 3.4-4.5 8.5-4.5 8.5S3.5 9.4 3.5 6A4.5 4.5 0 0 1 8 1.5Zm0 2.7a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Z" />}
    {k === 'reja' && <path d="M3 2.5h10a1 1 0 0 1 1 1V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Zm0 3V13h10V5.5H3Zm2 2h2v2H5v-2Z" />}
    {k === 'rasm' && <path d="M2.5 3.5h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Zm1 7h9l-3-4-2.2 2.7L6 7.5l-2.5 3Z" />}
  </svg>
);
const RasmChizma = () => (
  <svg className="ig-rasm-svg" viewBox="0 0 120 80" aria-hidden="true">
    <rect width="120" height="80" fill="#BFE0F5" />
    <circle cx="92" cy="20" r="9" fill="#FFD27A" />
    <path d="M0 80 L34 38 L56 62 L76 44 L120 80 Z" fill="#5F9E7A" />
    <path d="M0 80 L22 58 L44 80 Z" fill="#3E7C5B" />
  </svg>
);
const Sanagich = ({ gacha }) => {
  const [n, setN] = useState(kamHarakat() ? gacha : 0);
  useEffect(() => {
    if (kamHarakat()) return undefined;
    let raf = 0; const t0 = performance.now();
    const qadam = (t) => { const p = Math.min(1, (t - t0) / 1400); setN(Math.round(gacha * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(qadam); };
    raf = requestAnimationFrame(qadam);
    return () => cancelAnimationFrame(raf);
  }, [gacha]);
  return <>{n.toLocaleString('ru-RU').replace(/ /g, ' ')}</>;
};
// Sahna: chizilgan telefon. 1/3 — Burbn menyusi (3 nomli qator; nomsiz kulrang qatorlar yo'q — SABOQ 33, 07.10 savol 3); 2/3 — qatorlar so'nadi, «Rasm» kattalashadi, filtr va izoh qatori; 3/3 — nom «Instagram», sana va hisoblagich
const InstagramSahna = ({ b }) => (
  <div className="ig-sahna">
    <div className="ig-tel">
      <span className="ig-nom" key={b >= 2 ? 'i' : 'b'}>{b >= 2 ? <Insta /> : <Burbn />}</span>
      {b === 0 && <div className="ig-menyu">
        {IG_MENYU.map((m, i) => <span key={m.k} className="ig-q" style={{ '--i': i }}><IgBelgi k={m.k} />{tr(m.t)}</span>)}
      </div>}
      {b === 1 && <div className="ig-menyu ket">
        {IG_MENYU.slice(0, 2).map((m, i) => <span key={m.k} className="ig-q" style={{ '--i': i }}><IgBelgi k={m.k} />{tr(m.t)}</span>)}
      </div>}
      {b >= 1 && <div className={cxx('ig-rasm', b === 1 && 'kir')}>
        <RasmChizma />
        <span className="ig-filtr" aria-hidden="true"><i /><i /><i /><i /></span>
        <span className="ig-izoh"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3h12v8H6l-3 3v-3H2z" /></svg><em /></span>
      </div>}
    </div>
  </div>
);
const IgSon = () => (
  <div className="ig-son fade-step">
      <span className="ig-sana">{tr({ uz: '2010-yil oktabr', ru: 'октябрь 2010 года' })}</span>
      <span className="ig-son-l">{tr({ uz: 'birinchi kuni:', ru: 'в первый день:' })}</span>
      <b className="ig-son-b"><Sanagich gacha={25000} /></b>
      <span className="ig-son-l">{tr({ uz: "ro'yxatdan o'tish", ru: 'регистраций' })}</span>
      <span className="ld-kulrang">{tr({ uz: 'Shu voqeaning soni — sizga maqsad emas.', ru: 'Это число этой истории — не цель для вас.' })}</span>
    </div>
);
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [b, setB] = useState(storedAnswer ? 2 : 0);
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const done = b >= 2;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'keys', screenIdx: screen, correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const kadr = INSTAGRAM_KADR[b];
  const kutish = b === 0 && !taxmin;
  const tx = IG_TAXMIN.find(x => x.k === taxmin);
  const yorliq = <><Insta /> · {b + 1}/3</>;
  const keyingi = () => { if (b < 2) setB(b + 1); else onNext(); };
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: 'Из мира бизнеса' })} screen={screen} scrollSignal={b} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={kutish} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Voqea davomi', ru: 'Продолжение истории' })} (${b + 1}/3)`} onClick={keyingi} /></>}>
      <QVoqea
        sarlavha={tr({ uz: <><Insta /> <A>nimadan boshlangan?</A></>, ru: <>С чего <A>начинался</A> <Insta />?</> })}
        nuqtalar={<>
          <Mentor key={'m' + b}>{tr(kadr.m)}</Mentor>
          <div className="ld-nuq"><span className="ld-nuq-l">{yorliq}</span>{INSTAGRAM_KADR.map((_, i) => <i key={i} className={i < b ? 'ok' : i === b ? 'cur' : ''} />)}</div>
        </>}
        karta={<div className="ld-voqea">
          {b === 0 && <p className="ld-tanish"><Insta /> — {tr({ uz: 'rasm va video ulashiladigan ilova.', ru: 'приложение, где делятся фото и видео.' })}</p>}
          <span className="ld-voqea-h" key={'h' + b}>{tr(kadr.h)}</span>
          {taxmin && !done && <BashoratQ savol={tr(IG_SAVOL)} javob={tr(tx.t)} />}
          <div className={cxx('ld-voqea-qator', (kutish || done) && 'ikki')}>
            <Zoomable><InstagramSahna b={b} /></Zoomable>
            {kutish && <QBashorat yorliq={yorliq} savol={tr(IG_SAVOL)} variantlar={IG_TAXMIN.map(x => ({ k: x.k, t: tr(x.t) }))} tanlov={taxmin} onTanla={setTaxmin} />}
            {done && <IgSon />}
          </div>
          {done && <QXulosa>{tx && <TaxminQ togri={!!tx.ok} haqiqat={tr({ uz: "ko'pini olib tashlagan", ru: 'убрали большую часть' })} />}{tr({ uz: 'Bu voqeada hamma funksiya oldinga chiqarilmagan. Lendingda ham — muhim foydalar va bitta tugma.', ru: 'В этой истории не все функции вывели вперёд. В лендинге тоже — важные пользы и одна кнопка.' })}</QXulosa>}
        </div>}
      />
    </Stage>
  );
};

// ===== SCREEN 8 — 3-SAVOL (QuestionScreen; ✔ A, INLINE_KEYS.s8 = 0) =====
const IgMini = () => (
  <div className="ig-mini">
    <span className="ig-mini-q" /><span className="ig-mini-q" />
    <span className="ig-mini-r"><RasmChizma /><b>{tr({ uz: 'Rasm', ru: 'Фото' })}</b></span>
    <span className="ig-mini-q" />
  </div>
);
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: "Tekshiruv · Instagram'dagidek", ru: 'Проверка · как в Instagram' })}
    questionText="Sahifaga hamma funksiyani yozmoqchisiz. Instagram voqeasi nimani eslatadi?"
    question={tr({ uz: <h2 className="title h-ask">Sahifaga hamma funksiyani yozmoqchisiz. <Insta /> voqeasi <A>nimani eslatadi?</A></h2>, ru: <h2 className="title h-ask">Хотите написать на страницу все функции. О чём <A>напоминает</A> история <Insta />?</h2> })}
    options={[
      { uz: 'Odamlarga yoqqan bittasini oldinga chiqarishni', ru: 'Выводить вперёд то одно, что понравилось людям' },
      { uz: "Funksiya ko'p bo'lsa, odam ham ko'p kelishini", ru: 'Что при множестве функций придёт много людей' },
      { uz: "Birinchi kunning o'zida juda ko'p odam kelishini", ru: 'Что в первый же день придёт очень много людей' },
      { uz: 'Rasm va filtr har bir mahsulotga kerakligini', ru: 'Что фото и фильтры нужны каждому продукту' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Bu voqeada ko'p funksiyadan odamlarga yoqqani qoldi.", ru: 'В этой истории из множества функций осталось то, что нравилось людям.' }}
    explainWrong={{
      1: { uz: "Burbn'da funksiya ko'p edi — uni kim ishlatgan edi?", ru: 'В Burbn было много функций — а кто ими пользовался?' },
      2: { uz: "Bu shu voqeaning soni — sahifangizga qoida emas.", ru: 'Это число этой истории — не правило для вашей страницы.' },
      3: { uz: "Bu Instagram'da qolgani; sizda odamlarga nima yoqdi?", ru: 'Это то, что осталось в Instagram; а что понравилось людям у вас?' },
      default: { uz: "Asoschilar ko'p funksiya bilan nima qilganini eslang.", ru: 'Вспомните, что основатели сделали с множеством функций.' }
    }}
    vizual={<IgMini />} />
);

// ===== SCREEN 9 — SAHIFA MATNI (QMustaqil, ketma-ket karta — SABOQ 9, 13, 17, 29): o'quvchi sahifasi chapda jonli to'ladi · bitta katta karta o'ngda =====
const TUTUQ_RE = new RegExp('[' + String.fromCharCode(0x2BB, 0x2BC, 0x2018, 0x2019, 0x60) + ']', 'g');
const normS = (s) => String(s || '').toLowerCase().replace(TUTUQ_RE, "'").replace(/\s+/g, ' ').trim();
const SIFAT_RE = /(^|[^a-z'])(eng yaxshi|zamonaviy|qulay|sifatli|ajoyib)/;
const KELAJAK_RE = /(^|[^a-z'])(tez orada|yaqinda|keyinroq|rejada|bo'ladi)(?![a-z'])/;
const SHAXSIY_RE = /(\d[\s()+-]*){7,}|@/;
const sozSoni = (s) => normS(s).split(' ').filter(Boolean).length;
const S9_XABAR = {
  bosh: { uz: "Bu bo'lak bo'sh — sahifada joyi ko'rinmay qoladi.", ru: 'Эта часть пуста — на странице её место останется пустым.' },
  nom: { uz: "Bu nomga o'xshaydi: kim uchun va nima foyda?", ru: 'Похоже на название: для кого и какая польза?' },
  sifat: { uz: "Bu umumiy so'z — odam aynan nima oladi?", ru: 'Это общее слово — что именно получит человек?' },
  kelajak: { uz: "Hali yo'q narsa bo'lsa — sahifaga yozilmaydi.", ru: 'Если этого ещё нет — на страницу не пишется.' },
  funksiya: { uz: 'Bu funksiya nomi — u odamga nima beradi?', ru: 'Это название функции — что оно даёт человеку?' },
  takror: { uz: 'Bu foyda yuqorida bor — boshqasini yozing.', ru: 'Эта польза уже есть выше — напишите другую.' },
  tugma: { uz: "Tugma yozuvi qisqa bo'lsin: bir-uch so'z.", ru: 'Надпись на кнопке — коротко: одно-три слова.' },
  shaxsiy: { uz: 'Sahifaga telefon va akkaunt nomi yozilmaydi.', ru: 'На страницу не пишут телефон и имя аккаунта.' }
};
// Tekshiruv (PM-032: «bo'sh» va «shaxsiy» bloklaydi, qolgani yumshoq — ikkinchi «Saqlash» bilan o'tadi). Qaytaradi: { x: kalit, blok, m: maydon } | null
// «Uch foyda» bittadan (F-1006-373): faqat i-juft tekshiriladi; takror — boshqa saqlangan foydalar bilan (ctx.boshqa)
function s9TekshirJuft(i, f0, q0, ctx = {}) {
  if (!String(f0 || '').trim()) return { x: 'bosh', blok: true, m: 'f' };
  if (!String(q0 || '').trim()) return { x: 'bosh', blok: true, m: 'q' };
  if (SHAXSIY_RE.test(String(f0))) return { x: 'shaxsiy', blok: true, m: 'f' };
  if (SHAXSIY_RE.test(String(q0))) return { x: 'shaxsiy', blok: true, m: 'q' };
  const f = normS(f0), q = normS(q0);
  if (KELAJAK_RE.test(f)) return { x: 'kelajak', m: 'f' };
  if (KELAJAK_RE.test(q)) return { x: 'kelajak', m: 'q' };
  if (SIFAT_RE.test(f)) return { x: 'sifat', m: 'f' };
  if ((ctx.funksiyalar || []).some(fn => fn && normS(fn) === f)) return { x: 'funksiya', m: 'f' };
  if ((ctx.boshqa || []).some((p, j) => j !== i && p && normS(p) === f)) return { x: 'takror', m: 'f' };
  return null;
}
function s9Tekshir(k, v, ctx = {}) {
  const bosh = (s) => !String(s || '').trim();
  const shax = (s) => SHAXSIY_RE.test(String(s || ''));
  if (bosh(v)) return { x: 'bosh', blok: true };
  if (shax(v)) return { x: 'shaxsiy', blok: true };
  const n = normS(v);
  if (k === 'sarlavha') {
    if (sozSoni(v) <= 2 || (ctx.nom && n === normS(ctx.nom))) return { x: 'nom' };
    if (SIFAT_RE.test(n)) return { x: 'sifat' };
  }
  if (k === 'tugma' && sozSoni(v) > 3) return { x: 'tugma' };
  return null;
}
// Umami hodisa nomi — tugma yozuvidan (kichik lotin, apostrofsiz, chiziqcha, ≤50; o'quvchi tahrirlamaydi — 01-FILTR 4)
const hodisaNomi = (s) => normS(s).replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
const S9_BOLAK = {
  nom: { h: { uz: 'Mahsulot nomi', ru: 'Название продукта' }, max: 40 },
  sarlavha: { h: { uz: 'Sarlavha', ru: 'Заголовок' }, savol: { uz: 'Kim uchun va nima foyda?', ru: 'Для кого и какая польза?' }, ph: { uz: 'Bir qator, odamga qaratib', ru: 'Одна строка, обращённая к человеку' }, max: 60,
    yordam: { uz: "Mentor misolida: «Mahalla futboliga jamoani bir joyda yig'ing» — odamga qaratib yozilgan.", ru: 'В примере Ментора: «Соберите команду для футбола в махалле в одном месте» — обращено к человеку.' } },
  osti: { h: { uz: 'Sarlavha osti', ru: 'Подзаголовок' }, savol: { uz: "Bu qanday bo'ladi?", ru: 'Как это происходит?' }, ph: { uz: 'Bir gap', ru: 'Одно предложение' }, max: 110,
    yordam: { uz: "Mentor misolida: «O'yinni e'lon qiling — kim qo'shilgani va kim aniq kelishi ko'rinib turadi.»", ru: 'В примере Ментора: «Объявите игру — видно, кто присоединился и кто точно придёт.»' } },
  foydalar: { h: { uz: 'Uch foyda', ru: 'Три пользы' }, max: 50,
    yordam: { uz: "Mentor misolida: «Nechta odam yig'ilganini so'rab o'tirmaysiz», ostida «Kartada ko'rinadi: 8 / 10.» — avval odam nima oladi, keyin qaysi funksiya beradi.", ru: 'В примере Ментора: «Не нужно спрашивать, сколько людей собралось», под ней «Видно на карточке: 8 / 10.» — сначала что получает человек, потом какая функция это даёт.' } },
  tugma: { h: { uz: 'Asosiy tugma', ru: 'Главная кнопка' }, savol: { uz: 'Odam nima qiladi?', ru: 'Что сделает человек?' }, ph: { uz: "Bir-uch so'z", ru: 'Одно-три слова' }, max: 24,
    yordam: { uz: "Mentor misolida: «Qo'shilmoqchiman» — odam o'z nomidan aytadigan bitta so'z.", ru: 'В примере Ментора: «Хочу присоединиться» — слова, которые человек говорит от себя.' } }
};
const goyaNomi = (g) => { if (!g) return ''; const v = g.goya; return typeof v === 'string' ? v.trim() : (v && typeof v === 'object' ? String(v.nom || v.t || v.uz || '').trim() : ''); };
const lendingOl = () => lsO(LEND_KEY) || {};
const lendingYoz = (patch) => { const l = { ...lendingOl(), ...patch, savedAt: Date.now() }; lsY(LEND_KEY, l); return l; };
const bolakTayyor = (l, k) => k === 'foydalar' ? (l.foydalar || []).filter(x => String(x || '').trim()).length === 3 && (l.funksiyaQatori || []).filter(x => String(x || '').trim()).length === 3 : !!String(l[k] || '').trim();
const Hisob = ({ v, max }) => <span className={cxx('ld-hisob', String(v || '').length >= max && 'chek')}>{String(v || '').length} / {max}</span>;
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [fin] = useState(() => lsO('pm-m9d4-final'));
  const [prd] = useState(() => lsO('pm-m9d5-prd'));
  const nomG = goyaNomi(fin);
  const [l, setL] = useState(lendingOl);
  const tartib = useMemo(() => [...(nomG ? [] : ['nom']), 'sarlavha', 'osti', 'foydalar', 'tugma'], [nomG]);
  const [tahrirK, setTahrirK] = useState(() => { try { const t = sessionStorage.getItem('ld-tahrir'); sessionStorage.removeItem('ld-tahrir'); return t || null; } catch { return null; } });
  const birinchi = tartib.find(k => !bolakTayyor(l, k)) || null;
  const joriyK = tahrirK || birinchi;
  const n = bolakSoni(l);
  const done = tartib.every(k => bolakTayyor(l, k));
  const bosh = (k) => k === 'foydalar' ? { foydalar: [0, 1, 2].map(i => (l.foydalar || [])[i] || ''), funksiyaQatori: [0, 1, 2].map(i => (l.funksiyaQatori || [])[i] || '') } : (l[k] || '');
  // Qiymat o'z bo'lagi bilan saqlanadi: bo'lak almashgan birinchi chizishda eski qiymat (matn) «Uch foyda» shakliga tushmasin (oq ekran edi — 07.10 o'z sinovim)
  const [qiyH, setQiyH] = useState(() => ({ k: joriyK, v: joriyK ? bosh(joriyK) : '' }));
  const qiy = qiyH.k === joriyK ? qiyH.v : (joriyK ? bosh(joriyK) : '');
  const setQiy = (f) => setQiyH(h => { const cur = h.k === joriyK ? h.v : (joriyK ? bosh(joriyK) : ''); return { k: joriyK, v: typeof f === 'function' ? f(cur) : f }; });
  const [xato, setXato] = useState(null);
  const [yumshoq, setYumshoq] = useState(null);
  const [yordam, setYordam] = useState(false);
  const [prdOchiq, setPrdOchiq] = useState(false);
  const [erkin, setErkin] = useState({ muammo: '', yechim: '' });
  const [yangiK, setYangiK] = useState(null);
  // «Uch foyda» — bir vaqtda bitta juft (F-1006-373): fi — ochiq juft; saqlangan juftni bosib qayta ochish mumkin (fiT)
  const [fiT, setFiT] = useState(null);
  const juftBor = (i) => !!(String((l.foydalar || [])[i] || '').trim() && String((l.funksiyaQatori || [])[i] || '').trim());
  const fiBosh = [0, 1, 2].find(i => !juftBor(i));
  const fi = fiT != null ? fiT : (fiBosh != null ? fiBosh : 0);
  const [uch, qatlam] = useUchish();
  const els = useRef({}), inpRef = useRef(null);
  useEffect(() => { setQiy(joriyK ? bosh(joriyK) : ''); setXato(null); setYumshoq(null); setYordam(false); setFiT(null); }, [joriyK]); // eslint-disable-line
  useEffect(() => { if (!yangiK) return undefined; const t = setTimeout(() => setYangiK(null), 1100); return () => clearTimeout(t); }, [yangiK]);
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'Sahifa matni', solved: true, correct: true, picked: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  }, [done]); // eslint-disable-line
  const funksiyalar = (prd && Array.isArray(prd.funksiyalar) ? prd.funksiyalar : []).map(x => (typeof x === 'string' ? x : (x && (x.nom || x.t)) || ''));
  const saqlaJuft = () => {
    const f0 = qiy.foydalar[fi], q0 = qiy.funksiyaQatori[fi];
    const t = s9TekshirJuft(fi, f0, q0, { funksiyalar, boshqa: l.foydalar || [] });
    const imzo = JSON.stringify([fi, f0, q0]);
    if (t && (t.blok || !(yumshoq && yumshoq.imzo === imzo && yumshoq.x === t.x))) { setXato(t); if (!t.blok) setYumshoq({ x: t.x, imzo }); return; }
    const fArr = [0, 1, 2].map(i => (i === fi ? String(f0).trim() : String((l.foydalar || [])[i] || '')));
    const qArr = [0, 1, 2].map(i => (i === fi ? String(q0).trim() : String((l.funksiyaQatori || [])[i] || '')));
    const patch = { foydalar: fArr, funksiyaQatori: qArr };
    if (!l.nom && nomG) patch.nom = nomG;
    const yangi = lendingYoz({ manzil: null, sinov: null, ...lendingOl(), ...patch });
    uch(inpRef.current, els.current.foydalar, String(f0).slice(0, 40));
    setYangiK('foydalar'); setL(yangi); setXato(null); setYumshoq(null); setFiT(null);
    if (bolakTayyor(yangi, 'foydalar')) setTahrirK(null);
  };
  const saqla = () => {
    if (!joriyK) return;
    if (joriyK === 'foydalar') { saqlaJuft(); return; }
    const t = s9Tekshir(joriyK, qiy, { nom: l.nom || nomG, funksiyalar });
    const imzo = JSON.stringify(qiy);
    if (t && (t.blok || !(yumshoq && yumshoq.imzo === imzo && yumshoq.x === t.x))) { setXato(t); if (!t.blok) setYumshoq({ x: t.x, imzo }); return; }
    const patch = { [joriyK]: String(qiy).trim() };
    if (joriyK === 'tugma') patch.hodisa = hodisaNomi(qiy);
    if (!l.nom && nomG) patch.nom = nomG;
    const yangi = lendingYoz({ manzil: null, sinov: null, ...lendingOl(), ...patch });
    uch(inpRef.current, els.current[joriyK], String(qiy).slice(0, 40));
    setYangiK(joriyK); setL(yangi); setTahrirK(null); setXato(null); setYumshoq(null);
  };
  const B = joriyK && S9_BOLAK[joriyK];
  const xf = !!(xato && xato.m === 'f'), xq = !!(xato && xato.m === 'q');
  const juftOch = (i) => { setFiT(i); setXato(null); setYumshoq(null); };
  const karta = B && (
    <div key={joriyK} className={cxx('ld-karta', 'ld-s9-karta', xato && 'err')}>
      <span className="q-yorliq">{tr(B.h)}{joriyK !== 'nom' && <> · {tartib.filter(k => k !== 'nom').indexOf(joriyK) + 1} / 4</>}</span>
      {B.savol && <b className="ld-karta-nom">{tr(B.savol)}</b>}
      {joriyK === 'foydalar' ? (
        <div className="ld-foy-form" ref={inpRef}>
          {[0, 1, 2].some(i => i !== fi && juftBor(i)) && <div className="ld-foy-oklar">
            {[0, 1, 2].map(i => (i !== fi && juftBor(i)
              ? <button key={i} type="button" className="ld-foy-ok fade-step" onClick={() => juftOch(i)} aria-label={`${tr({ uz: 'Foyda', ru: 'Польза' })} ${i + 1} · ${tr({ uz: 'tahrirlash', ru: 'редактировать' })}`}><i>✓</i><b>{l.foydalar[i]}</b><span>{l.funksiyaQatori[i]}</span></button>
              : null))}
          </div>}
          <div key={'j' + fi} className="ld-foy-juft ld-kirish">
            <span className="ld-foy-n">{tr({ uz: 'Foyda', ru: 'Польза' })} {fi + 1} / 3</span>
            <label className="ld-maydon">
              <input className={cxx('ld-inp', xf && 'err', !qiy.foydalar[fi] && 'ld-halqa-i')} value={qiy.foydalar[fi]} maxLength={50} aria-label={`${tr({ uz: 'Foyda', ru: 'Польза' })} ${fi + 1}`} placeholder={tr({ uz: 'Foyda — odam nima oladi?', ru: 'Польза — что получит человек?' })}
                onChange={(e) => { const v = e.target.value; setQiy(q => ({ ...q, foydalar: q.foydalar.map((x, j) => (j === fi ? v : x)) })); }} />
              <Hisob v={qiy.foydalar[fi]} max={50} />
            </label>
            <label className="ld-maydon">
              <input className={cxx('ld-inp', xq && 'err')} value={qiy.funksiyaQatori[fi]} maxLength={70} aria-label={tr({ uz: 'Funksiya qatori', ru: 'Строка функции' })} placeholder={tr({ uz: 'Funksiya qatori — qaysi funksiya beradi?', ru: 'Строка функции — какая функция это даёт?' })}
                onChange={(e) => { const v = e.target.value; setQiy(q => ({ ...q, funksiyaQatori: q.funksiyaQatori.map((x, j) => (j === fi ? v : x)) })); }} onKeyDown={(e) => { if (e.key === 'Enter') saqla(); }} />
              <Hisob v={qiy.funksiyaQatori[fi]} max={70} />
            </label>
            {funksiyalar[fi] && <em className="ld-prd-fn">PRD: {funksiyalar[fi]}</em>}
          </div>
          <span className="ld-kulrang">{tr({ uz: 'Faqat hozir ishlaydigan funksiyaning foydasi.', ru: 'Только польза функции, которая работает сейчас.' })}</span>
        </div>
      ) : (
        <label className="ld-maydon">
          <input ref={inpRef} className={cxx('ld-inp', 'katta', xato && 'err', !String(qiy).trim() && 'ld-halqa-i')} value={qiy} maxLength={B.max} placeholder={B.ph ? tr(B.ph) : ''} onChange={(e) => setQiy(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saqla(); }} />
          <Hisob v={qiy} max={B.max} />
        </label>
      )}
      {xato && <QXato>{tr(S9_XABAR[xato.x])}</QXato>}
      {xato && !xato.blok && <span className="ld-kulrang">{tr({ uz: 'Shunday qoldirsangiz — yana «Saqlash»ni bosing.', ru: 'Если оставить так — снова нажмите «Сохранить».' })}</span>}
      {yordam && B.yordam && <p className="ld-yordam fade-step">{tr(B.yordam)}</p>}
      <div className="ld-karta-tug">
        {B.yordam && <QTugma ikkinchi onClick={() => setYordam(y => !y)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })}</QTugma>}
        <QTugma className={cxx((joriyK === 'foydalar' ? String(qiy.foydalar[fi]).trim() && String(qiy.funksiyaQatori[fi]).trim() : String(qiy).trim()) && 'ld-halqa')} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
      </div>
    </div>
  );
  const prdQator = (prd || fin) ? (
    <div className={cxx('ld-prd-ix', prdOchiq && 'ochiq')}>
      <button type="button" className="ld-prd-ix-b" onClick={() => setPrdOchiq(o => !o)} aria-expanded={prdOchiq}>{tr({ uz: '11-Moduldan · PRD', ru: 'Из 11-го модуля · PRD' })} <span>{prdOchiq ? '▴' : '▾'}</span></button>
      {prdOchiq && <div className="ld-prd-ix-t fade-step">
        {fin && fin.muammoGapi && <p><b>{tr({ uz: 'Muammo', ru: 'Проблема' })}:</b> {fin.muammoGapi}</p>}
        {prd && prd.kim && <p><b>{tr({ uz: 'Kim uchun', ru: 'Для кого' })}:</b> {prd.kim}</p>}
        {prd && prd.yechim && <p><b>{tr({ uz: 'Yechim', ru: 'Решение' })}:</b> {prd.yechim}</p>}
        {funksiyalar.filter(Boolean).length > 0 && <p><b>{tr({ uz: 'Uchta asosiy funksiya', ru: 'Три основные функции' })}:</b> {funksiyalar.filter(Boolean).join(' · ')}</p>}
      </div>}
    </div>
  ) : (
    <div className="ld-prd-ix erkin">
      <label className="ld-maydon"><input className="ld-inp" value={erkin.muammo} aria-label={tr({ uz: 'Muammo gapi', ru: 'Фраза проблемы' })} placeholder={tr({ uz: 'Muammo gapi — kim nimadan qiynaladi?', ru: 'Фраза проблемы — кому и что мешает?' })} onChange={(e) => setErkin(x => ({ ...x, muammo: e.target.value }))} /></label>
      <label className="ld-maydon"><input className="ld-inp" value={erkin.yechim} aria-label={tr({ uz: 'Yechim', ru: 'Решение' })} placeholder={tr({ uz: 'Yechim — mahsulot nima qiladi?', ru: 'Решение — что делает продукт?' })} onChange={(e) => setErkin(x => ({ ...x, yechim: e.target.value }))} /></label>
    </div>
  );
  const matn = oquvchiMatn(l, nomG);
  const holat = {};
  tartib.forEach(k => { if (k === joriyK && !done) holat[k] = 'joriy'; if (yangiK === k) holat[k] = 'yozildi'; });
  if (xato && joriyK) holat[joriyK] = 'xato';
  const tahrir = done && !tahrirK ? Object.fromEntries(tartib.map(k => [k, () => setTahrirK(k)])) : null;
  const sahifa = (
    <div className="ld-s9-chap">
      <span className="ld-sahifam" key={n}>{tr({ uz: 'Sahifam', ru: 'Моя страница' })} · <b>{n} / 4</b></span>
      <LendingSahifa joylar matn={matn} holat={holat} tel={false} bolak={(k, el) => { els.current[k] = el; }} tahrir={tahrir} />
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · sahifa matni', ru: 'Самостоятельная работа · текст страницы' })} screen={screen} scrollSignal={n} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Yana', ru: 'Ещё' })} ${4 - n} ${tr({ uz: "ta bo'lak yozing", ru: 'частей напишите' })}`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Sahifangiz matnini <A>bo'lakma-bo'lak</A> yozing.</>, ru: <>Напишите текст страницы <A>по частям</A>.</> })}
        mentor={<Mentor>{(prd || fin)
          ? tr({ uz: 'Muammo gapingiz va yechimingiz 11-Moduldan keldi — ularga qarab avval sarlavhani yozing.', ru: 'Ваша фраза проблемы и решение пришли из 11-го модуля — глядя на них, сначала напишите заголовок.' })
          : tr({ uz: "Avval muammo gapingiz va yechimingizni bir qatordan yozing, keyin sarlavhaga o'ting.", ru: 'Сначала напишите в одну строку фразу проблемы и решение, потом переходите к заголовку.' })}</Mentor>}
        qadamlar={!isMentor && prdQator}
        forma={isMentor
          ? <LendingSahifa matn={mentorMatn()} />
          : (done && !tahrirK) ? <div className="ld-fokus">{sahifa}<QXulosa>{tr({ uz: 'Sahifangiz matni tayyor: sarlavha, uch foyda va bitta asosiy tugma.', ru: 'Текст вашей страницы готов: заголовок, три пользы и одна главная кнопка.' })}</QXulosa></div>
            : <div className="ld-split">{sahifa}{karta}</div>}
      >
        <MentorPracticeStats live={live} screen={screen} />
      </QMustaqil>
      {qatlam}
    </Stage>
  );
};

// ===== SCREEN 10 — BESH SONIYALIK SINOV (QMustaqil, juftlik + yakka rejim, 3 qism) =====
const S10_SAVOL = [{ uz: 'Bu nima?', ru: 'Что это?' }, { uz: 'Kim uchun?', ru: 'Для кого?' }, { uz: 'Bu yerda nima qilish mumkin?', ru: 'Что здесь можно сделать?' }];
const S10_BOLAK = ['sarlavha', 'sarlavha', 'tugma'];
function BeshSoniya({ onTugadi }) {
  const [q, setQ] = useState(5);
  useEffect(() => { const t = setInterval(() => setQ(x => Math.max(0, x - 1)), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (q === 0) onTugadi(); }, [q]); // eslint-disable-line
  return <span className="ld-sanoq" key={q}>{q}</span>;
}
function Chiziqlar({ boxRef, juftlar, dep }) {
  const [ch, setCh] = useState([]);
  useLayoutEffect(() => {
    const box = boxRef.current; if (!box) return undefined;
    const run = () => {
      const z = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lz')) || 1;
      const r = box.getBoundingClientRect();
      setCh(juftlar.map(j => {
        const a = j.a(), b = j.b(); if (!a || !b) return null;
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const yon = ra.left >= rb.right - 4;
        return { x1: ((yon ? ra.left : ra.left + ra.width / 2) - r.left) / z, y1: ((yon ? ra.top + ra.height / 2 : ra.top) - r.top) / z, x2: ((yon ? rb.right : rb.left + rb.width / 2) - r.left) / z, y2: ((yon ? rb.top + rb.height / 2 : rb.bottom) - r.top) / z, h: j.h };
      }).filter(Boolean));
    };
    run(); const t = setTimeout(run, 500);
    window.addEventListener('resize', run);
    return () => { clearTimeout(t); window.removeEventListener('resize', run); };
  }, [dep]); // eslint-disable-line
  return <svg className="ld-chiziq-svg" aria-hidden="true">{ch.map((c, i) => <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} className={cxx('ld-chiziq', c.h)} />)}</svg>;
}
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isStudent } = useJonli();
  const [fin] = useState(() => lsO('pm-m9d4-final'));
  const [l, setL] = useState(lendingOl);
  const juft = isStudent && bolakSoni(l) > 0;
  const s0 = storedAnswer && storedAnswer.sinov;
  const [qism, setQism] = useState(s0 ? 3 : 1);
  const [yur, setYur] = useState(false);
  const [javob, setJavob] = useState(() => (s0 ? s0.javoblar : []));
  const [qiy, setQiy] = useState('');
  const [ochildi, setOchildi] = useState(!!s0);
  const [mos, setMos] = useState(() => (s0 ? s0.mos : [null, null, null]));
  const boxRef = useRef(null), els = useRef({}), pufRef = useRef([]);
  const belgilandi = mos.filter(m => m !== null).length;
  const done = belgilandi >= 3;
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    const sinov = { tur: juft ? 'sherik' : 'mashq', javoblar: javob, mos };
    setL(lendingYoz({ manzil: null, ...lendingOl(), sinov }));
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'Besh soniyalik sinov', solved: true, correct: true, picked: true, sinov });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  }, [done]); // eslint-disable-line
  const saqla = (v) => { const j = [...javob, v]; setJavob(j); setQiy(''); if (j.length >= 3) setQism(3); };
  const sQ = javob.length;
  const chip = juft ? [{ uz: "Ko'rsatish", ru: 'Показ' }, { uz: "So'rash", ru: 'Вопросы' }, { uz: 'Solishtirish', ru: 'Сравнение' }] : [{ uz: "Ko'rish", ru: 'Просмотр' }, { uz: 'Yozish', ru: 'Запись' }, { uz: 'Solishtirish', ru: 'Сравнение' }];
  const ish = (m, i) => { if (mos[i] !== null || !ochildi) return; setMos(x => x.map((y, k) => (k === i ? m : y))); };
  const tahrir = (k) => { try { sessionStorage.setItem('ld-tahrir', k); } catch { /* yopiq */ } onPrev(); };
  const xulosa = !done ? null : !juft
    ? tr({ uz: 'Bu mashq edi: sahifani o\'zingiz bilasiz. Sinov — uni hali ko\'rmagan odam bilan, uyga vazifada.', ru: 'Это было упражнение: страницу вы знаете сами. Проверка — с человеком, который её ещё не видел, в домашнем задании.' })
    : mos.every(Boolean)
      ? tr({ uz: 'Bu sinovda sherigingiz uch savolga ham sahifadagidek javob berdi. Bitta sinov — kuzatuv, isbot emas.', ru: 'В этой проверке партнёр ответил на все три вопроса так, как на странице. Одна проверка — наблюдение, не доказательство.' })
      : tr({ uz: `${mos.filter(m => m === false).length} ta javob sahifaga mos kelmadi — o'sha bo'lakni qayta o'qing. Bitta sinov — kuzatuv, isbot emas.`, ru: `${mos.filter(m => m === false).length} ответа не совпали со страницей — перечитайте эту часть. Одна проверка — наблюдение, не доказательство.` });
  const kelmadi = (k) => S10_BOLAK.some((b, i) => b === k && mos[i] === false);
  const parda = qism < 3 ? !yur : !ochildi;
  const sahifa = (
    <LendingSahifa joylar matn={oquvchiMatn(l, goyaNomi(fin))} tel={false} parda={parda}
      ustida={qism === 1 && yur && <BeshSoniya onTugadi={() => { setYur(false); setQism(2); }} />}
      bolak={(k, el) => { els.current[k] = el; }}
      tahrir={done ? Object.fromEntries(['sarlavha', 'tugma'].filter(kelmadi).map(k => [k, () => tahrir(k)])) : null}
      pardaUstida={qism === 1 && !yur
        ? <QTugma className="ld-halqa" onClick={() => setYur(true)}>{tr({ uz: '5 soniyani boshlash', ru: 'Запустить 5 секунд' })}</QTugma>
        : qism === 3 && !ochildi ? <QTugma className="ld-halqa" onClick={() => setOchildi(true)}>{tr({ uz: 'Ochish', ru: 'Открыть' })}</QTugma> : null}
      ostida={<>
        {qism === 1 && <span className="ld-kulrang">{tr({ uz: '5 soniya — shu mashqning qoidasi.', ru: '5 секунд — правило этого упражнения.' })}</span>}
        {done && <div className="ld-atama fade-step"><span className="ld-atama-y">{juft ? tr({ uz: 'besh soniyalik sinov', ru: 'пятисекундная проверка' }) : tr({ uz: 'mashq', ru: 'упражнение' })}</span>
          <QIzoh>{juft ? tr({ uz: 'Sherik sahifani 5 soniya ko\'rib, nima va kim uchun ekanini aytdi — besh soniyalik sinov shu.', ru: 'Партнёр 5 секунд смотрел на страницу и сказал, что это и для кого, — это и есть пятисекундная проверка.' })
            : tr({ uz: 'Sherik bilan qilinsa, bu — besh soniyalik sinov; hozirgisi — mashq: sahifani o\'zingiz bilasiz.', ru: 'Если делать с партнёром, это — пятисекундная проверка; сейчас — упражнение: страницу вы знаете сами.' })}</QIzoh></div>}
      </>} />
  );
  const savolKarta = qism === 2 && sQ < 3 && (
    <div key={sQ} className="ld-karta">
      <span className="q-yorliq">{sQ + 1} / 3</span>
      <b className="ld-karta-nom">{tr(S10_SAVOL[sQ])}</b>
      <input className={cxx('ld-inp', 'katta', !qiy.trim() && 'ld-halqa-i')} value={qiy} maxLength={120} placeholder={juft ? tr({ uz: 'U nima dedi?', ru: 'Что он сказал?' }) : tr({ uz: 'Nima esda qoldi?', ru: 'Что запомнилось?' })} onChange={(e) => setQiy(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && qiy.trim()) saqla(qiy.trim()); }} />
      {juft && <span className="ld-kulrang">{tr({ uz: 'Sherigingiz ismini yozmang — faqat javobini.', ru: 'Не пишите имя партнёра — только ответ.' })}</span>}
      <div className="ld-karta-tug">
        <QTugma ikkinchi onClick={() => saqla('')}>{juft ? tr({ uz: 'Javob bermadi', ru: 'Не ответил' }) : tr({ uz: 'Eslay olmadim', ru: 'Не вспомнил' })}</QTugma>
        <QTugma className={cxx(qiy.trim() && 'ld-halqa')} disabled={!qiy.trim()} onClick={() => saqla(qiy.trim())}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
      </div>
    </div>
  );
  const javobQator = javob.length > 0 && qism === 2 && <ul className="ld-javoblar">{javob.map((j, i) => <li key={i} className="fade-step"><span>{tr(S10_SAVOL[i])}</span><b>{j || '—'}</b></li>)}</ul>;
  const pufaklar = qism === 3 && (
    <div className="ld-pufaklar">
      {S10_SAVOL.map((s, i) => (
        <div key={i} ref={el => { pufRef.current[i] = el; }} className={cxx('ld-puf', mos[i] === true && 'ok', mos[i] === false && 'yoq', ochildi && mos[i] === null && i === mos.indexOf(null) && 'ld-halqa')}>
          <span className="ld-puf-s">{tr(s)}</span>
          <b className="ld-puf-j">{javob[i] || '—'}</b>
          {ochildi && mos[i] === null && <span className="ld-puf-tug">
            <button type="button" className="ld-mos" onClick={() => ish(true, i)}>{tr({ uz: 'Mos keldi', ru: 'Совпало' })}</button>
            <button type="button" className="ld-mos" onClick={() => ish(false, i)}>{tr({ uz: 'Mos kelmadi', ru: 'Не совпало' })}</button>
          </span>}
        </div>
      ))}
      {ochildi && <span className="ld-kulrang">{tr({ uz: 'Bu mashqda: javob mos kelmasa, chiziq ko\'rsatgan bo\'lakni qayta ko\'rasiz.', ru: 'В этом упражнении: если ответ не совпал, перечитайте часть, на которую указывает линия.' })}</span>}
    </div>
  );
  return (
    <Stage eyebrow={juft ? tr({ uz: 'Juftlikda ish', ru: 'Работа в паре' }) : tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} scrollSignal={qism * 10 + sQ + belgilandi} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Solishtiring', ru: 'Сравните' })} (${belgilandi}/3)`} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={juft ? tr({ uz: <>Sherigingiz 5 soniyada <A>nimani tushunadi?</A></>, ru: <>Что партнёр <A>поймёт за 5 секунд?</A></> }) : tr({ uz: <>5 soniyadan keyin sahifadan <A>nima esda qoladi?</A></>, ru: <>Что <A>запомнится</A> со страницы через 5 секунд?</> })}
        mentor={<Mentor>{juft ? tr({ uz: 'Ekranni sherigingizga buring va «5 soniyani boshlash»ni bosing — keyin unga uch savol berasiz.', ru: 'Поверните экран к партнёру и нажмите «Запустить 5 секунд» — потом зададите ему три вопроса.' })
          : tr({ uz: "Sahifangizni 5 soniya ko'ring, keyin uch savolga ekranga qaramasdan, yoddan javob yozing.", ru: 'Посмотрите на свою страницу 5 секунд, потом ответьте на три вопроса по памяти, не глядя на экран.' })}</Mentor>}
        qadamlar={<QQadamlar qadamlar={chip.map(tr)} joriy={done ? undefined : qism - 1} />}
        forma={<div className={cxx('ld-split', 'ld-s10', qism === 1 && 'bitta')} ref={boxRef}>
          {sahifa}
          {qism === 2 && <div className="ld-s10-ong">{javobQator}{savolKarta}</div>}
          {pufaklar}
          {qism === 3 && ochildi && <Chiziqlar boxRef={boxRef} dep={mos.join() + (ochildi ? 1 : 0)} juftlar={S10_SAVOL.map((_, i) => ({ a: () => pufRef.current[i], b: () => els.current[S10_BOLAK[i]], h: mos[i] === true ? 'ok' : mos[i] === false ? 'yoq' : '' }))} />}
        </div>}
      >
        {done && <QXulosa>{xulosa}</QXulosa>}
        <MentorPracticeStats live={live} screen={screen} />
      </QMustaqil>
    </Stage>
  );
};

// ===== SCREEN 12 — YAKUNIY SAVOL (QuestionScreen; ✔ C, INLINE_KEYS.s12 = 2; scope final) =====
const Screen12 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })}
    questionText="Mahsulotingizda bitta funksiya hali yo'q. Uni sahifaga foyda qilib yozasizmi?"
    question={tr({ uz: <h2 className="title h-ask">Mahsulotingizda bitta funksiya hali yo'q. Uni sahifaga <A>foyda qilib yozasizmi?</A></h2>, ru: <h2 className="title h-ask">В вашем продукте одной функции ещё нет. <A>Напишете</A> её на страницу как пользу?</h2> })}
    options={[
      { uz: "Ha — u baribir yaqin kunlarda qo'shiladi", ru: 'Да — её всё равно скоро добавят' },
      { uz: 'Ha — kichik harflar bilan eng pastga yozasiz', ru: 'Да — напишете мелко в самом низу' },
      { uz: "Yo'q — sahifaga hozir ishlaydigani yoziladi", ru: 'Нет — на страницу пишут то, что работает сейчас' },
      { uz: "Yo'q — yangi funksiya odamlarga kerak emas", ru: 'Нет — новая функция людям не нужна' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "Sahifani o'qigan odam mahsulotda shu narsani topishi kerak.", ru: 'Человек, прочитавший страницу, должен найти это в продукте.' }}
    explainWrong={{
      0: { uz: "Qo'shilguncha odam uni mahsulotda topa olmaydi.", ru: 'Пока её не добавили, человек не найдёт её в продукте.' },
      1: { uz: 'Kichik harf ham va\'da: odam uni mahsulotda topadimi?', ru: 'Мелкий шрифт — тоже обещание: найдёт ли человек это в продукте?' },
      3: { uz: "Funksiya kerak bo'lishi mumkin — gap u hozir yo'qligida.", ru: 'Функция может быть нужна — дело в том, что её сейчас нет.' },
      default: { uz: "Sahifani o'qigan odam mahsulotda nimani topadi?", ru: 'Что найдёт в продукте человек, прочитавший страницу?' }
    }}
    vizual={<div className="ld-tashqi mini"><span className="ld-eslatma-chip">{tr({ uz: 'Eslatma', ru: 'Напоминание' })}</span><span className="ld-tashqi-y">{tr({ uz: "hali yo'q", ru: 'ещё нет' })}</span></div>} />
);

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  benefitFinder: { icon: '🎯', name: 'Benefit Finder!', desc: { uz: "Uch funksiyaning foydasini va hali yo'q funksiyani birinchi urinishda ajratdingiz", ru: 'С первой попытки различили пользу трёх функций и функцию, которой ещё нет' } },
  pageWriter: { icon: '✍️', name: 'Page Writer!', desc: { uz: 'Sahifangiz uchun sarlavha, uch foyda va tugma yozuvini yozdingiz', ru: 'Написали для своей страницы заголовок, три пользы и надпись кнопки' } },
  fiveSeconds: { icon: '⏱️', name: 'Five Seconds!', desc: { uz: "Sahifangizni besh soniyalik ko'rishdan keyin uch savol bilan solishtirdingiz", ru: 'После пятисекундного просмотра сравнили страницу по трём вопросам' } },
  pageOnline: { icon: '🌐', name: 'Page Online!', desc: { uz: 'Sahifangizni internetga chiqardingiz', ru: 'Выложили свою страницу в интернет' } },
};
// Ekran id → nishon: s4 — to'rt kartada birinchi urinish (to'g'ri/xato bor) · s9, s10, s11 — qilingan ish (tekin emas, S-034)
const ACH_TRIGGERS = { s4: 'benefitFinder', s9: 'pageWriter', s10: 'fiveSeconds', s11: 'pageOnline' };

function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={`${tr({ uz: 'Yangi nishon', ru: 'Новый значок' })}: ${ach.name}`}>
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
  const COLORS = [T.accent, T.ok, T.accent, '#FFD380', '#FF7755', '#7DD181'];
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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 3, 5, 8, 12)
const Q_LABELS = {
  3: { uz: '1 — Sarlavha', ru: '1 — Заголовок' },
  5: { uz: '2 — Funksiya va foyda', ru: '2 — Функция и польза' },
  8: { uz: '3 — Instagram', ru: '3 — Instagram' },
  12: { uz: "4 — Hali yo'q funksiya", ru: '4 — Функции ещё нет' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning o'z atamalari (MD «Fon so'zlari», R-008: {uz, ru}; emoji yo'q)
const QZ_BG_SHAPES = [
  { ch: { uz: 'lending', ru: 'лендинг' }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'sarlavha', ru: 'заголовок' }, l: 82, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'foyda', ru: 'польза' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'funksiya', ru: 'функция' }, l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'tugma', ru: 'кнопка' }, l: 45, t: 86, s: 24, d: 25, dl: 1.1 },
  { ch: { uz: 'sahifa', ru: 'страница' }, l: 64, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'sinov', ru: 'проверка' }, l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: 'Umami', l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang — 12 savol, ✔ o'rni MD dagidek: A 1·6·11 · B 2·7·12 · C 3·8·9 · D 4·5·10 (3/3/3/3)
const QUIZ_BANK = [
  { q: { uz: 'Sherigingiz sarlavhaga faqat mahsulot nomini yozdi. Nima yetishmaydi?', ru: 'Партнёр написал в заголовок только название продукта. Чего не хватает?' }, opts: [{ uz: 'Kim uchun va nima foyda', ru: 'Для кого и какая польза' }, { uz: 'Rang va shrift kattaligi', ru: 'Цвета и размера шрифта' }, { uz: 'Narxi va chiqqan sanasi', ru: 'Цены и даты выхода' }, { uz: 'Logotipi va nomning rangi', ru: 'Логотипа и цвета названия' }], correct: 0 },
  { q: { uz: 'Mentor lendingida «Maydon Jamoa» nomi qayerda turadi?', ru: 'Где в лендинге Ментора стоит название «Maydon Jamoa»?' }, opts: [{ uz: "Sarlavha o'rnida, katta yozuv", ru: 'На месте заголовка, крупно' }, { uz: 'Sahifa tepasida, kichik yozuv', ru: 'Наверху страницы, мелко' }, { uz: 'Faqat tugmaning ichida, qalin', ru: 'Только внутри кнопки, жирно' }, { uz: 'Sahifaning eng pastida, xira', ru: 'В самом низу страницы, бледно' }], correct: 1 },
  { q: { uz: "Kutubxona sayti kitob bor-yo'qligini ko'rsatadi. Foydasi qaysi?", ru: 'Сайт библиотеки показывает, есть ли книга. Где польза?' }, opts: [{ uz: "Sayt kitob ro'yxatini saqlaydi", ru: 'Сайт хранит список книг' }, { uz: 'Qidiruvga kitob nomini yozasiz', ru: 'Пишете название книги в поиск' }, { uz: 'Kutubxonaga bekorga bormaysiz', ru: 'Не ходите в библиотеку зря' }, { uz: "Ro'yxat har kuni yangilanadi", ru: 'Список обновляется каждый день' }], correct: 2 },
  { q: { uz: "Mentor sahifasiga «o'yindan oldin eslatma» nega yozilmadi?", ru: 'Почему на страницу Ментора не написали «напоминание перед игрой»?' }, opts: [{ uz: "Eslatma o'yinchilarga yoqmagani uchun", ru: 'Потому что напоминание не понравилось игрокам' }, { uz: "Sahifada bo'sh joy qolmagani uchun", ru: 'Потому что на странице не осталось места' }, { uz: 'Eslatma juda uzun yozilgani uchun', ru: 'Потому что напоминание написано слишком длинно' }, { uz: 'Ilovada u hali qurilmagani uchun', ru: 'Потому что в приложении его ещё не построили' }], correct: 3 },
  { q: { uz: "Mentor lendingidagi «Qanday qo'shilaman» bo'limida hozir nima yozilgan?", ru: 'Что сейчас написано в разделе «Как присоединиться» лендинга Ментора?' }, opts: [{ uz: 'Ilovani do\'kondan yuklab olish havolasi', ru: 'Ссылка на скачивание приложения из магазина' }, { uz: "Ism va telefon raqami so'raladigan forma", ru: 'Форма, где спрашивают имя и телефон' }, { uz: "O'yinlar ro'yxati va «8 / 10» sonlari", ru: 'Список игр и числа «8 / 10»' }, { uz: "Hozircha o'rnatish havolasi yo'qligi", ru: 'Что ссылки для установки пока нет' }], correct: 3 },
  { q: { uz: "Sahifangizda «Batafsil», «Yozilish» va «Bog'lanish» tugmalari bor. Bu darsda nima qilasiz?", ru: 'На вашей странице кнопки «Подробнее», «Записаться» и «Связаться». Что делаете на этом уроке?' }, opts: [{ uz: 'Bitta asosiy tugmani qoldirasiz', ru: 'Оставляете одну главную кнопку' }, { uz: 'Uchalasini bir qatorga terasiz', ru: 'Ставите все три в один ряд' }, { uz: "Yana bitta yangi tugma qo'shasiz", ru: 'Добавляете ещё одну новую кнопку' }, { uz: "Tugmalarni kichikroq qilib qo'yasiz", ru: 'Делаете кнопки поменьше' }], correct: 0 },
  { q: { uz: "Asoschilar Burbn'da qaysi funksiyalarni qoldirgan?", ru: 'Какие функции основатели оставили в Burbn?' }, opts: [{ uz: 'Eng qiyin qurilganlarini', ru: 'Самые сложные в постройке' }, { uz: 'Odamlarga yoqqanlarini', ru: 'Те, что нравились людям' }, { uz: "O'zlariga yoqqanlarini", ru: 'Те, что нравились им самим' }, { uz: "Oxirgi qo'shilganlarini", ru: 'Последние добавленные' }], correct: 1 },
  { q: { uz: 'Instagram voqeasidagi «25 000» soni sizga nimani bildiradi?', ru: 'Что для вас значит число «25 000» в истории Instagram?' }, opts: [{ uz: 'Birinchi kun uchun eng kam natijani', ru: 'Минимальный результат для первого дня' }, { uz: "Har lending yetishi kerak bo'lgan sonni", ru: 'Число, до которого должен дойти каждый лендинг' }, { uz: 'Shu voqeaning sonini, sizga maqsad emas', ru: 'Число этой истории, не цель для вас' }, { uz: 'Sahifa sarlavhasiga yoziladigan sonni', ru: 'Число, которое пишут в заголовок страницы' }], correct: 2 },
  { q: { uz: 'Sahifangizga ism va telefon uchun forma qo\'ymoqchisiz. Bu darsda qanday qilinadi?', ru: 'Хотите поставить на страницу форму для имени и телефона. Как это делается на этом уроке?' }, opts: [{ uz: "Forma asosiy tugmaning ostiga qo'yiladi", ru: 'Форму ставят под главной кнопкой' }, { uz: "Formada faqat telefon raqami so'rab olinadi", ru: 'В форме спрашивают только номер телефона' }, { uz: "Forma qo'yilmaydi: sahifa ma'lumot olmaydi", ru: 'Форму не ставят: страница не собирает данные' }, { uz: "Forma faqat mobil trekdagi sahifada bo'ladi", ru: 'Форма есть только на странице мобильного трека' }], correct: 2 },
  { q: { uz: "Besh soniyalik sinovda sherigingiz «Kim uchun?» savoliga javob bera olmadi. Qaysi bo'lakni qayta o'qiysiz?", ru: 'В пятисекундной проверке партнёр не ответил на вопрос «Для кого?». Какую часть перечитаете?' }, opts: [{ uz: 'Uchta foyda qatorini', ru: 'Строки трёх польз' }, { uz: 'Tugmaning yozuvini', ru: 'Надпись кнопки' }, { uz: 'Sahifaning manzilini', ru: 'Адрес страницы' }, { uz: 'Sahifa sarlavhasini', ru: 'Заголовок страницы' }], correct: 3 },
  { q: { uz: 'Agent sahifani yig\'di. Matnni qanday tekshirasiz?', ru: 'Агент собрал страницу. Как проверите текст?' }, opts: [{ uz: "Yozganingiz bilan so'zma-so'z solishtirib", ru: 'Сравнив слово в слово с тем, что написали' }, { uz: "Agentning yozgan hisobotini o'qib chiqib", ru: 'Прочитав отчёт, который написал агент' }, { uz: "Sahifa brauzerda ochilganiga qarab qo'yib", ru: 'Посмотрев, что страница открылась в браузере' }, { uz: 'Papkadagi fayllar sonini sanab chiqib', ru: 'Посчитав число файлов в папке' }], correct: 0 },
  { q: { uz: 'Tugma nechta marta bosilganini qayerdan bilasiz?', ru: 'Где узнаете, сколько раз нажали кнопку?' }, opts: [{ uz: "Netlify'dagi sayt sozlamalaridan", ru: 'Из настроек сайта в Netlify' }, { uz: "Umami'dagi hodisalar ro'yxatidan", ru: 'Из списка событий в Umami' }, { uz: "GitHub'dagi commit ro'yxatidan", ru: 'Из списка коммитов в GitHub' }, { uz: 'Telefondagi brauzer tarixidan', ru: 'Из истории браузера в телефоне' }], correct: 1 },
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
    // Arena tokenlari — SHU darsning mavzusidan (arxitektura): dekorativ suzuvchi kod-bo'laklari
    const TOK = ['Frontend', '🗄️', 'Backend', 'front→back', 'request', 'response', 'API', '⚙️', '🖥️', 'client'];
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
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают 🔥 бонус!' })}</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>{tr({ uz: '▶ Testni boshlash', ru: '▶ Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Ждите, пока ментор начнёт тест…' })}</p>}
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
                : <span className="qz-res-t">{my ? tr({ uz: "Adashdingiz — 0 ball. Keyingisida olasiz! 💪", ru: 'Мимо — 0 баллов. Возьмёте на следующем! 💪' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling! ⏱", ru: 'Время вышло — 0 баллов. Побыстрее! ⏱' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: 'Siz hozir:', ru: 'Вы сейчас:' })} {myRank + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</span>}
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
              <p className="qz-sub">{tr({ uz: 'ball', ru: 'баллов' })} · {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? ` · ${tr({ uz: 'eng uzun streak', ru: 'лучший стрик' })} 🔥x${soloScore.maxStreak}` : ''}</p>
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
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: 'Siz', ru: 'Вы' })} — <b>{myRank + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</b> · {board[myRank].pts} {tr({ uz: 'ball', ru: 'баллов' })}</p>}
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
        <div className="head head-c"><h2 className="title h-title fade-up">{tr({ uz: <>Kim <span className="italic" style={{ color: T.accent }}>g'olib</span>?</>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>победитель</span>?</> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Вы в самостоятельном режиме. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: 'Siz', ru: 'Вы' })} — <b>{myIdx + 1}{tr({ uz: "-o'rin", ru: '-е место' })}</b> ({board[myIdx].okCount}/{totalQ} {tr({ uz: "to'g'ri", ru: 'верно' })})</p>}
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
      <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Kim bajardi', ru: 'Кто выполнил' })} — {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink2, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загружается…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink2, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не присоединился.' })}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.okFon, color: T.ok }}>✓ {p.nickname}</span>)}
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ opacity: 0.6 }}>{p.nickname}</span>)}
        </div>
      )}
    </div>
  );
};

// ===== SCREEN 11 — SAHIFA INTERNETGA (amaliyot bloki: QBlok 4 qadam + QPrompt; holat va jonli signal shu ulagichda, 172/173) =====
// Blok bayrog'i — faqat oxirgi (tekshiruv) «Bajardim»idan (tayanch 9.36 h); 3-qadamdan keyin «Davom etish» ochiladi (Netlify qolsa — uyga vazifa ①), bayroq qo'yilmaydi.
const S11_ORTDA = ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'cd maydon-jamoa', 'git checkout -f m12-dars-01-done'];
const promptSatrlar = (l, nom) => {
  const v = (x, joy) => (x && String(x).trim()) || joy;
  const f = (i) => v(l.foydalar && l.foydalar[i], '{' + (i + 1) + '-foyda}');
  const q = (i) => v(l.funksiyaQatori && l.funksiyaQatori[i], '{' + (i + 1) + '-funksiya qatori}');
  return [
    "Qayerda: repo ildizida yangi `lending/` papkasi — `index.html` va `style.css`. Boshqa papkalarga tegma.",
    "Nima qilsin: bitta sahifali statik sayt — oddiy HTML va CSS, yig'ish buyrug'isiz. Matnni aynan shunday yoz, bitta so'zini ham o'zgartirma:",
    'nom — «' + v(nom, '{mahsulot nomi}') + '» · sarlavha — «' + v(l.sarlavha, '{sarlavha}') + '» · sarlavha osti — «' + v(l.osti, '{sarlavha osti}') + '» ·',
    'uch foyda, har biri katta yozuv va ostida bitta qator — «' + f(0) + '», ostida «' + q(0) + '» · «' + f(1) + '», ostida «' + q(1) + '» · «' + f(2) + '», ostida «' + q(2) + '» · asosiy tugma — «' + v(l.tugma, '{tugma yozuvi}') + '».',
    'Tugma bosilganda: {tugma ochadigan joy}',
    "Sahifada mahsulot maketi bo'lsin — HTML va CSS bilan chizilgan, surat emas: {maketda nima ko'rinadi}. Sahifa adaptiv: telefon kengligida bir ustun.",
    "Nima buzilmasin: boshqa papkalar o'zgarmasin. Sahifada forma va kiritish maydoni bo'lmasin — ism, telefon, email so'ralmaydi. O'zgargan fayllarni ayt."
  ];
};
// Yordam — Mentor misolidagi to'liq prompt (mobil trek); web-trekda farqi bir gap (tugma saytni ochadi, `prototip/` va `backend/`)
const mentorPrompt = (web) => [
  "Qayerda: repo ildizida yangi `lending/` papkasi — `index.html` va `style.css`. Boshqa papkalarga tegma.",
  "Nima qilsin: bitta sahifali statik sayt — oddiy HTML va CSS, yig'ish buyrug'isiz. Matnni aynan shunday yoz, bitta so'zini ham o'zgartirma:",
  "nom — «Maydon Jamoa» · sarlavha — «Mahalla futboliga jamoani bir joyda yig'ing» · sarlavha osti — «O'yinni e'lon qiling — kim qo'shilgani va kim aniq kelishi ko'rinib turadi.» ·",
  "uch foyda, har biri katta yozuv va ostida bitta qator — «Bir bosishda jamoadasiz», ostida «Har o'yin alohida kartada: «Qo'shilaman» ni bosasiz.» · «Nechta odam yig'ilganini so'rab o'tirmaysiz», ostida «Kartada ko'rinadi: 8 / 10.» · «Kim aniq kelishini o'yindan oldin bilasiz», ostida «O'yin kuni har kim «Kelaman» ni bosadi.» · asosiy tugma — «Qo'shilmoqchiman».",
  web ? 'Tugma bosilganda saytim ochilsin: {sayt manzili}' : "Tugma bosilganda sahifa pastdagi «Qanday qo'shilaman» bo'limiga o'tsin; bo'lim matni: «Hozircha o'rnatish havolasi yo'q.»",
  "Sahifada telefon maketi bo'lsin — HTML va CSS bilan chizilgan, surat emas: «O'yinlar» ekrani, namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10». Sahifa adaptiv: telefon kengligida bir ustun.",
  web ? "Nima buzilmasin: `prototip/` va `backend/` o'zgarmasin. Sahifada forma va kiritish maydoni bo'lmasin — ism, telefon, email so'ralmaydi. O'zgargan fayllarni ayt."
    : "Nima buzilmasin: `mobil/`, `backend/` va `prototip/` o'zgarmasin. Sahifada forma va kiritish maydoni bo'lmasin — ism, telefon, email so'ralmaydi. O'zgargan fayllarni ayt."
];
const NAMUNA_JOY = {
  mobil: { uz: "masalan: sahifa pastidagi «Qanday qo'shilaman» bo'limi; bo'lim matni: «Hozircha o'rnatish havolasi yo'q.»", ru: 'например: раздел «Как присоединиться» внизу страницы; текст раздела: «Пока ссылки для установки нет.»' },
  web: { uz: 'masalan: saytim — https://….netlify.app', ru: 'например: мой сайт — https://….netlify.app' },
  maket: { uz: "masalan: «O'yinlar» ekrani, namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10» — namuna ma'lumot, haqiqiy odamlar emas", ru: 'например: экран «Игры», пример игры «Суббота, 18:00 · Поле махалли · 8 / 10» — пример данных, не реальные люди' }
};
const Bp = ({ children }) => <span className="ld-bp">{fmtCode(children)}</span>;
// Kutilgan natija — Mentor lendingi bir marta o'zi yuradi: tugma bosiladi → sahifa bo'limga suriladi
const NatijaSahifa = () => {
  const [b, setB] = useState(kamHarakat() ? 2 : 0);
  useEffect(() => {
    if (kamHarakat()) return undefined;
    const t1 = setTimeout(() => setB(1), 1400), t2 = setTimeout(() => setB(2), 1750);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div className="ld-natija">
      <LendingSahifa matn={mentorMatn()} tugmaBos={b === 1} tugmaHalqa={false} surildi={b === 2} qisqa />
    </div>
  );
};
const ScreenA1 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useJonli();
  const [l] = useState(lendingOl);
  const [fin] = useState(() => lsO('pm-m9d4-final'));
  const [trek, setTrek] = useState(() => { const p = lsO(TREK_KEY); return p && (p.trek === 'web' || p.trek === 'mobil') ? p.trek : null; });
  const trekBor = useRef(!!trek);
  const [stepN, setStepN] = useState(() => (storedAnswer && Number.isInteger(storedAnswer.qadam) ? storedAnswer.qadam : 0));
  const [manzil, setManzil] = useState(() => l.manzil || '');
  const [satr, setSatr] = useState(() => promptSatrlar(l, l.nom || goyaNomi(fin)));
  const [tahrir, setTahrir] = useState(false);
  const [yordam, setYordam] = useState(false);
  const done = stepN >= 4;
  const manzilOk = /^https?:\/\/\S+\.\S+/.test(manzil.trim());
  const yoz = (n, m) => {
    const solved = n >= 4;
    const bor = solved && /^https?:\/\/\S+\.\S+/.test((m || '').trim());
    if (solved) lendingYoz({ sinov: null, ...lendingOl(), manzil: bor ? m.trim() : null });
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'Sahifa internetga', qadam: n, solved, correct: bor, picked: true, manzil: bor ? m.trim() : null });
    if (solved && live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  const bajardim = () => { if (isMentor || done) return; const n = stepN + 1; setStepN(n); yoz(n, manzil); };
  const qaytar = (i) => { if (done || isMentor) return; setStepN(i); yoz(i, manzil); };
  const trekTanla = (t) => { setTrek(t); lsY(TREK_KEY, { ...(lsO(TREK_KEY) || {}), trek: t }); };
  const namunaJoy = trek ? [NAMUNA_JOY[trek]] : [NAMUNA_JOY.mobil, NAMUNA_JOY.web];
  const qadamlar = [
    { h: tr({ uz: 'Ochish', ru: 'Открыть' }), t: <>
      <Bp>{tr({ uz: "Antigravity'da o'z repo'ngizni oching. Terminalda `git status` — o'zgargan fayl yo'q bo'lsin; ro'yxatda `.env` ko'rinmasin (ko'rinsa — avval `.gitignore` ga qo'shing).", ru: 'Откройте свой репозиторий в Antigravity. В терминале `git status` — изменённых файлов быть не должно; в списке не должно быть `.env` (если есть — сначала добавьте в `.gitignore`).' })}</Bp>
      {!trekBor.current && <span className="ld-trek-tan">{[['mobil', { uz: 'Mobil ilova', ru: 'Мобильное приложение' }], ['web', { uz: 'Sayt', ru: 'Сайт' }]].map(([k, t]) => <button key={k} type="button" className={cxx('ld-trek', trek === k && 'on')} onClick={() => trekTanla(k)}>{tr(t)}</button>)}</span>}
    </> },
    { h: tr({ uz: 'Prompt', ru: 'Промпт' }), t: <>
      <Bp>{tr({ uz: "talabning matn qatorlari mustaqil ishingizdan to'ldirilgan (tahrirlash mumkin). Qalin ikki joyni o'zingiz yozing — kulrang namunaga qarang, «Nusxalash»ni bosing, Antigravity'ga yuboring:", ru: 'текстовые строки требования заполнены из вашей самостоятельной работы (можно редактировать). Два выделенных места напишите сами — посмотрите на серый пример, нажмите «Скопировать», отправьте в Antigravity:' })}</Bp>
    </>, prompt: satr, kimga: 'Antigravity', xato: <>
      <span className="ld-prompt-tah"><button type="button" className="ld-prompt-ed" onClick={() => setTahrir(x => !x)} aria-label={tr({ uz: 'Tahrirlash', ru: 'Редактировать' })}>✎</button></span>
      {tahrir && <textarea className="ld-prompt-ta" value={satr.join('\n')} onChange={(e) => setSatr(e.target.value.split('\n'))} rows={8} />}
      {namunaJoy.map((nj, i) => <span key={i} className="ld-namuna"><code className="qcode">{'{tugma ochadigan joy}'}</code> — {tr(nj)}</span>)}
      <span className="ld-namuna"><code className="qcode">{"{maketda nima ko'rinadi}"}</code> — {tr(NAMUNA_JOY.maket)}</span>
      <button type="button" className="ld-yordam-b" onClick={() => setYordam(y => !y)} aria-expanded={yordam}>{tr({ uz: 'Yordam', ru: 'Подсказка' })} {yordam ? '▴' : '▾'}</button>
      {yordam && <span className="ld-yordam-p"><span className="ld-yp-y">{tr({ uz: 'Mentor misoli', ru: 'пример Ментора' })}</span>{mentorPrompt(trek === 'web').map((s, i) => <span key={i} className="ld-yp-satr">{s}</span>)}</span>}
    </> },
    { h: tr({ uz: 'Ishga tushirish', ru: 'Запуск' }), t: <>
      <Bp>{"agent tugatgach `lending/index.html` ni brauzerda oching. Agentning hisobotiga emas, sahifaning o'ziga qarang: matnni mustaqil ishdagi yozuvingiz bilan so'zma-so'z solishtiring (tepadagi ixcham sahifa shu uchun turibdi)."}</Bp>
      <Bp>{"`git status` — faqat `lending/` ichidagi fayllar o'zgargan. Mos kelmagan so'zni agentga bitta gap bilan yozing: «Sarlavha so'zma-so'z shunday bo'lsin: {sarlavha}. Tuzat.»"}</Bp>
      <Bp>{'Keyin `git add lending/index.html lending/style.css` → `git commit -m "12-modul 1-dars: lending"` → `git push`.'}</Bp>
      <Bp>{"Netlify: app.netlify.com da akkauntingizga kiring (2-Modulda ochgansiz) → yangi loyiha qo'shing («Add new project») → GitHub'dan import → o'z repo'ngiz. Sozlamada: Base directory — bo'sh (repo ildizi); Build command — bo'sh (yig'ish yo'q); Publish directory — `lending`."}</Bp>
      <Bp>{"Havola chiqadi: `….netlify.app`. Netlify sahifani chiqarguncha kutish paytida telefoningizda brauzerni ochib qo'ying. Sahifa ochilmasa — avval Netlify sozlamasida Publish directory `lending` ekanini tekshiring; keyin xato qatorini agentga yuboring (`.env` qiymatlarini emas)."}</Bp>
      <Bp>{"Vaqt tugayotgan bo'lsa — push qilib qo'ying: Netlify va tekshiruv — uyga vazifa ①."}</Bp>
    </> },
    { h: tr({ uz: 'Telefonda tekshirish', ru: 'Проверка на телефоне' }), t: <>
      <Bp>{"telefonda `….netlify.app` havolasini oching va talabning har qatorini tekshiring: (1) sahifa bir ustunda, matn mustaqil ishdagi bilan bir xil; (2) asosiy tugmani bosing — mobil trekda sahifa bo'limga o'tishi, web-trekda saytingiz ochilishi kerak."}</Bp>
      <Bp>{'Mos kelmagan qatorni agentga yozing. Oxirida havolani shu yerga yozing:'}</Bp>
      <span className="ld-maydon ld-manzil"><span>{tr({ uz: 'Sahifa manzili', ru: 'Адрес страницы' })}</span><input className={cxx('ld-inp', !manzil.trim() && stepN === 3 && 'ld-halqa-i', manzilOk && 'ok')} value={manzil} placeholder="https://….netlify.app" onChange={(e) => setManzil(e.target.value)} /></span>
      <Bp>{"Tugma bosilishini sanash (Umami) — uyga vazifa ②: sahifa manzili endi ma'lum, Umami'da saytni shu manzil bilan qo'shasiz."}</Bp>
    </> }
  ];
  const yashil = done && !!(storedAnswer && storedAnswer.manzil || (manzilOk && done));
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · lending', ru: 'Практика · лендинг' })} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={stepN < 3} label={stepN >= 3 ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <QBlok til={__lang} zoom={Zoomable}
        sarlavha={tr({ uz: <>Sahifangizni yig'ing va <A>internetga chiqaring.</A></>, ru: <>Соберите страницу и <A>выложите в интернет.</A></> })}
        mentor={<><Mentor>{tr({ uz: "Sahifa matni tayyor — endi agent uni sahifaga aylantiradi; «1 · Ochish»dan boshlang.", ru: 'Текст страницы готов — теперь агент превратит его в страницу; начните с «1 · Открыть».' })}</Mentor><SahifamStrip l={l} /></>}
        qadamlar={qadamlar} joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentor}
        tugadi={yashil} tugadiMatn={tr({ uz: 'Sahifangiz internetda: matnini va tugmasini telefonda o\'zingiz tekshirdingiz.', ru: 'Ваша страница в интернете: текст и кнопку вы сами проверили на телефоне.' })}
        natija={<NatijaSahifa />} natijaYorliq={tr({ uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · пример: Maydon Jamoa' })}
        pastki={<MentorPracticeStats live={live} screen={screen} />}>
        <p className="ld-ortda">{fmtCode(tr({ uz: "Ortda qoldingizmi — Mentor misolini yangi papkada oching: `", ru: 'Отстали — откройте пример Ментора в новой папке: `' }) + S11_ORTDA[0] + '` · `' + S11_ORTDA[1] + '` · `' + S11_ORTDA[2] + '`')}</p>
      </QBlok>
    </Stage>
  );
};

// ===== KARTOCHKALAR — alohida ekran, Mentorsiz (SABOQ 12, 16); birinchi bosishgacha karta yuzi halqada =====
const KARTOCHKALAR = [
  { front: { uz: 'Lending nima?', ru: 'Что такое лендинг?' }, back: { uz: 'Mahsulotni bitta sahifada tanishtiradigan sayt', ru: 'Сайт, который представляет продукт на одной странице' } },
  { front: { uz: "Bizda lending qaysi uch bo'lakdan iborat?", ru: 'Из каких трёх частей у нас состоит лендинг?' }, back: { uz: 'Sarlavha, uchta foyda va bitta asosiy tugma', ru: 'Заголовок, три пользы и одна главная кнопка' } },
  { front: { uz: 'Sarlavha qaysi ikki savolga javob beradi?', ru: 'На какие два вопроса отвечает заголовок?' }, back: { uz: 'Kim uchun va nima foyda', ru: 'Для кого и какая польза' } },
  { front: { uz: 'Funksiya bilan foydaning farqi nima?', ru: 'Чем функция отличается от пользы?' }, back: { uz: 'Funksiya — mahsulot nima qilishi; foyda — u odamga nima berishi', ru: 'Функция — что делает продукт; польза — что он даёт человеку' } },
  { front: { uz: 'Mentor misolida «8 / 10» sonining foydasi qanday yozilgan?', ru: 'Как в примере Ментора написана польза числа «8 / 10»?' }, back: { uz: "«nechta odam yig'ilganini so'rab o'tirmaysiz»", ru: '«не нужно спрашивать, сколько людей собралось»' } },
  { front: { uz: 'Hali qurilmagan funksiya sahifaga yoziladimi?', ru: 'Пишут ли на страницу функцию, которую ещё не построили?' }, back: { uz: "Yo'q: sahifaga hozir ishlaydigan narsa yoziladi", ru: 'Нет: на страницу пишут то, что работает сейчас' } },
  { front: { uz: 'Asosiy tugma nima?', ru: 'Что такое главная кнопка?' }, back: { uz: 'Sahifadagi odamni bitta harakatga chaqiradigan tugma', ru: 'Кнопка, которая зовёт человека на странице к одному действию' } },
  { front: { uz: 'Mentor lendingida tugma bosilganda nima ochiladi?', ru: 'Что открывается в лендинге Ментора при нажатии кнопки?' }, back: { uz: "Sahifadagi «Qanday qo'shilaman» bo'limi", ru: 'Раздел «Как присоединиться» на странице' } },
  { front: { uz: "Nega lendingda forma yo'q?", ru: 'Почему в лендинге нет формы?' }, back: { uz: "Sahifa shaxsiy ma'lumot yig'maydi: ism ham, telefon ham so'ralmaydi", ru: 'Страница не собирает личные данные: не спрашивают ни имя, ни телефон' } },
  { front: { uz: 'Besh soniyalik sinovda sherikka qaysi uch savol beriladi?', ru: 'Какие три вопроса задают партнёру в пятисекундной проверке?' }, back: { uz: 'Bu nima? Kim uchun? Bu yerda nima qilish mumkin?', ru: 'Что это? Для кого? Что здесь можно сделать?' } },
  { front: { uz: "Burbn'dan nima qoldi?", ru: 'Что осталось от Burbn?' }, back: { uz: "Rasm, filtr va izohlar — ilova Instagram bo'ldi", ru: 'Фото, фильтры и комментарии — приложение стало Instagram' } },
  { front: { uz: "Lending telefonda qanday ko'rinadi?", ru: 'Как лендинг выглядит на телефоне?' }, back: { uz: 'Adaptiv: telefon kengligida bir ustun', ru: 'Адаптивно: одна колонка по ширине телефона' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const belgila = (e) => { if (e.target && e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <A>sinab ko'ring.</A></>, ru: <>Проверьте <A>себя.</A></> })}</h2></div>
        <div className={cxx('ld-flash', !bosildi && 'yangi')} onClickCapture={belgila} onKeyDownCapture={(e) => { if (e.key === 'Enter' || e.key === ' ') belgila(e); }}>
          <QKartochka til={__lang} cards={KARTOCHKALAR.map(c => ({ front: tr(c.front), back: tr(c.back) }))} />
          {!bosildi && <p className="ld-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== UYGA VAZIFA — PM HwCard (P-025: «Kim bilan · Nechta · Muddat» + raqamli qadamlar; alohida .homework.jsx yo'q) =====
const HW_KARTA = [
  { k: { uz: 'Kim bilan', ru: 'С кем' }, v: { uz: "sahifangizni hali ko'rmagan 2 kishi — uydagilar yoki do'stingiz", ru: '2 человека, которые ещё не видели вашу страницу, — домашние или друг' } },
  { k: { uz: 'Nechta', ru: 'Сколько' }, v: { uz: '2 ta besh soniyalik sinov', ru: '2 пятисекундные проверки' } },
  { k: { uz: 'Muddat', ru: 'Срок' }, v: { uz: 'keyingi darsgacha', ru: 'до следующего урока' } }
];
const hwQadam = (hodisa) => [
  { uz: "Sahifa hali internetga chiqmagan bo'lsa — push qiling va Netlify'ga chiqaring; havolani darsdagi «Sahifa manzili» maydoniga yozing.", ru: 'Если страница ещё не в интернете — сделайте push и выложите на Netlify; ссылку впишите в поле «Адрес страницы» на уроке.' },
  { uz: "Tugma bosilishini sanashni ulang: `cloud.umami.is` da akkauntingizga kiring (9-Modulda ochgansiz) → «Websites» → «Add website»: Name — mahsulotingiz nomi va «lending», Domain — sahifangiz manzili → «Save» → saytingiz yonidagi «Edit» → «Tracking code» dagi bir qator kodni nusxalang (u maxfiy emas — sahifa kodida hammaga ko'rinadi). Agentga: «`lending/index.html` ning `<head>` qismiga shu skriptni qo'sh: {skript}. Tugma bosilganda Umami'ga `" + hodisa + "` hodisasi yozilsin. Umami yuklanmasa ham tugma ishlasin. Boshqa fayllarga tegma.» → push → sahifada tugmani bosing, Umami'da saytingiz sahifasini yangilang: hodisalar orasida `" + hodisa + "` ko'rinishi kerak (reklama to'sgichi yoqilgan brauzerda yozilmasligi mumkin). Umami akkauntingiz bo'lmasa — Mentor o'z akkauntida sayt qo'shib beradi.",
    ru: 'Подключите подсчёт нажатий кнопки: войдите в аккаунт на `cloud.umami.is` (открывали в 9-м модуле) → «Websites» → «Add website»: Name — название продукта и «lending», Domain — адрес страницы → «Save» → «Edit» рядом с сайтом → скопируйте одну строку кода из «Tracking code» (она не секретная — видна всем в коде страницы). Агенту: «Добавь этот скрипт в `<head>` файла `lending/index.html`: {skript}. При нажатии кнопки пусть в Umami пишется событие `' + hodisa + '`. Кнопка должна работать, даже если Umami не загрузился. Другие файлы не трогай.» → push → нажмите кнопку на странице, обновите страницу сайта в Umami: среди событий должно быть `' + hodisa + '` (в браузере с блокировщиком рекламы может не записаться). Нет аккаунта Umami — Ментор добавит сайт в своём аккаунте.' },
  { uz: "Sahifani o'z telefoningizda har biriga 5 soniya ko'rsating va uch savolni bering: «Bu nima?» · «Kim uchun?» · «Bu yerda nima qilish mumkin?». Javoblarni qog'ozga yozing — ismini emas, kimligini («akam», «sinfdoshim»). Havolani guruhlarga yubormang.", ru: 'Покажите страницу каждому на своём телефоне 5 секунд и задайте три вопроса: «Что это?» · «Для кого?» · «Что здесь можно сделать?». Запишите ответы на бумаге — не имя, а кто это («брат», «одноклассник»). Не отправляйте ссылку в группы.' },
  { uz: "Ikkalasi ham javob bera olmagan savol bo'lsa — o'sha bo'lakni darsdagi matnda tuzating, agentga «Sahifadagi {bo'lak} shunday bo'lsin: {yangi matn}. Tuzat.» deb yozing va push qiling — sahifa odatda o'zi yangilanadi. Ikki kishi — kuzatuv, isbot emas.", ru: 'Если на какой-то вопрос не ответили оба — исправьте эту часть в тексте урока, напишите агенту «{часть} на странице пусть будет такой: {новый текст}. Исправь.» и сделайте push — страница обычно обновляется сама. Два человека — наблюдение, не доказательство.' }
];
const HwCard = ({ keyingi, hodisa }) => (
  <div className="card ld-hw fade-up">
    <div className="card-lbl acc">{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
    <div className="ld-hw-karta">{HW_KARTA.map((r, i) => <div key={i} className="ld-hw-q"><span className="ld-hw-k">{tr(r.k)}</span><span className="ld-hw-v">{tr(r.v)}</span></div>)}</div>
    <ol className="ld-hw-qadam">{hwQadam(hodisa).map((q, i) => <li key={i}><i>{['①', '②', '③', '④'][i]}</i><span>{fmtCode(tr(q))}</span></li>)}</ol>
    {keyingi && <span className="ld-hw-keyingi">{keyingi}</span>}
  </div>
);

// ===== YAKUN — qolipdan: QYakun (DE-204) + holatga qarab sarlavha (sinf 1). Standart: chip · ball · sarlavha · CODE STRIKE · «Endi siz bilasiz» · uyga vazifa · nishonlar (F-1006-375: sinov chipi, «Bugungi asosiy fikr», «Sahifam» qatori olib tashlandi) =====
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
  // «Endi siz bilasiz» — bugungi asosiy fikrni takrorlamaydi (T-048)
  const RECAP = [
    { uz: 'Lending — mahsulotni bitta sahifada tanishtiradigan sayt.', ru: 'Лендинг — сайт, который представляет продукт на одной странице.' },
    { uz: 'Bizda sarlavha ikki savolga javob beradi: kim uchun va nima foyda.', ru: 'У нас заголовок отвечает на два вопроса: для кого и какая польза.' },
    { uz: 'Foyda — funksiya odamga nima berishi; sahifaga hozir ishlaydigan funksiyaning foydasi yoziladi.', ru: 'Польза — то, что функция даёт человеку; на страницу пишут пользу функции, которая работает сейчас.' },
    { uz: 'Asosiy tugma odamni bitta harakatga chaqiradi va hozir bor narsaga olib boradi.', ru: 'Главная кнопка зовёт человека к одному действию и ведёт к тому, что есть сейчас.' },
    { uz: "Burbn'dan odamlarga yoqqani qoldi: rasm, filtr va izohlar.", ru: 'От Burbn осталось то, что нравилось людям: фото, фильтры и комментарии.' }
  ];
  const l = lendingOl();
  const blokQ = (answers[11] && Number.isInteger(answers[11].qadam)) ? answers[11].qadam : 0;
  const n = bolakSoni(l);
  // Sarlavha holatga qarab va rost (07.10 savollar 1–2): «yig'ildi» — faqat 3-qadam «Ishga tushirish»dan keyin; hech narsa yozilmagan bo'lsa — «boshlandi» emas
  const holat = isMentorL || (l.manzil && blokQ >= 4) ? 'internet' : blokQ >= 3 ? 'yigildi' : n >= 4 ? 'matn' : n >= 1 ? 'boshlandi' : 'yoq';
  const SARLAVHA = {
    internet: { uz: <>Sahifangizni yozdingiz va <A>internetga chiqardingiz.</A></>, ru: <>Вы написали страницу и <A>выложили её в интернет.</A></> },
    yigildi: { uz: <>Sahifa yig'ildi — <A>internetga chiqarish qoldi.</A></>, ru: <>Страница собрана — <A>осталось выложить в интернет.</A></> },
    matn: { uz: <>Sahifa matni tayyor — <A>yig'ish qoldi.</A></>, ru: <>Текст страницы готов — <A>осталось собрать.</A></> },
    boshlandi: { uz: <>Sahifa matni boshlandi — <A>qolganini yozing.</A></>, ru: <>Текст страницы начат — <A>допишите остальное.</A></> },
    yoq: { uz: <>Sahifa matni hali yozilmagan — <A>uyda yozib chiqing.</A></>, ru: <>Текст страницы ещё не написан — <A>напишите его дома.</A></> }
  };
  const toliq = holat === 'internet';
  const keyingi = tr({ uz: <>Keyingi dars — <b>«WebSocket: ekran o'zi yangilanadigan ulanish»</b></>, ru: <>Следующий урок — <b>«WebSocket: соединение, при котором экран обновляется сам»</b></> });
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className={cxx('ld-yakun', !toliq && 'belgisiz')}>
        <QYakun til={__lang}
          chip={tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })}
          togri={correct} jami={total}
          sarlavha={tr(SARLAVHA[holat])}
          cta={<>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tr)}
          uyga={<HwCard keyingi={keyingi} hodisa={l.hodisa || '{hodisa nomi}'} />}
          keyingi={keyingi}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
        />
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PmLandingLesson({ lang: langProp, onFinished, liveToken }) {
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
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]); //  nishon (faqat SCORED test — REAL solve)
    // Yakuniy gate (s15) — XATO javob ham serverga ketadi (aks holda xato qilgan o'quvchi podiumda umuman ko'rinmaydi).
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, ScreenA1, Screen12, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        ${qolipCss(T)}
        /* === DARSNING O'Z VIZUALI — LendingSahifa (brauzer + sahifa) va JamoaTelefon. Faqat qolip tokenlari (D3); brend rangi Instagram — nom yorlig'ida === */
        /* ikki klassli selektor: keyingi «.zoomable position relative» qoidasi oynani joyidan siljitib, ekran chetidan kesardi (F-1006-386) */
        .zoomable.zoom-on, .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        /* ⛶ oynasi ekran markazida: ota-blokdagi animatsiya/transform «position: fixed»ni o'ziga bog'lab, oynani siljitib kesardi (A2 natijasi — F-1006-386) */
        .lesson-root :has(.zoom-on) { animation: none !important; transform: none !important; filter: none !important; will-change: auto !important; contain: none !important; }
        @media (max-width: 1199px) { .zoomable:not(.z-float):not(.zoom-on) { padding-top: 36px; } .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn { top: 0; right: 0; } }
        .lesson-root .q-ekran > ol.q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
        .ls-parda .q-btn { align-self: center; margin: 0; }
        .lesson-root .q-mustaqil { max-width: none; }
        .ls-wrap { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .ls-oyna { --lsh: 400px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px -16px rgba(${T.shadowBase},0.35); display: flex; flex-direction: column; min-width: 0; }
        .ls-oyna.qisqa { --lsh: 340px; }
        .ls-bar { display: flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; flex: none; }
        .ls-bar > i { width: 9px; height: 9px; border-radius: 50%; background: ${fon(T.ink, 0.16)}; flex: none; }
        .ls-url { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; height: 22px; margin-left: 6px; padding: 0 10px; border-radius: 999px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; }
        .ls-qulf { width: 10px; height: 12px; flex: none; fill: ${T.ok}; stroke: ${T.ok}; }
        .ls-url-t { overflow: hidden; text-overflow: ellipsis; animation: ld-kir 0.35s ease-out both; }
        .ls-kor { position: relative; height: var(--lsh); overflow: hidden; }
        .ls-ichi { padding: 16px 18px 24px; display: flex; flex-direction: column; gap: 8px; transition: transform 0.7s cubic-bezier(.4,0,.2,1); }
        .ls-nom { align-self: flex-start; font-weight: 800; font-size: 13px; color: ${MAYDON_RANG}; letter-spacing: 0.01em; transition: font-size 0.6s cubic-bezier(.4,0,.2,1), margin 0.6s; }
        .ls-nom.katta { font-size: clamp(26px,3.2vw,34px); margin: 14px 0 4px; letter-spacing: -0.01em; }
        .ls-nom.yoq { color: ${T.ink2}; font-weight: 600; font-style: italic; }
        h3.ls-sar { margin: 0 0 0 -4px; padding: 2px 4px; font-size: clamp(19px,2.2vw,24px); line-height: 1.2; font-weight: 800; color: ${T.ink}; letter-spacing: -0.01em; border-radius: 8px; }
        h3.ls-sar.joriy { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .ls-yoz { display: inline-block; animation: ld-yoz 0.5s ease-out both; }
        h3.ls-sar.yozildi, p.ls-osti.yozildi, .ls-foydalar.yozildi { animation: ld-yashil 1.1s ease-out; }
        h3.ls-sar.xato, p.ls-osti.xato, .ls-foydalar.xato { background: ${T.errFon}; }
        .ls-sar-joy { display: block; height: 34px; border: 2px dashed ${fon(T.ink, 0.22)}; border-radius: 8px; margin: 2px 0; animation: ld-kir 0.4s ease-out both; }
        .ls-sar-joy.joriy, .ls-osti-joy.joriy, .ls-foydalar.joriy .ls-foy-joy { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .ls-osti-joy { display: block; width: 80%; height: 22px; border: 2px dashed ${fon(T.ink, 0.22)}; border-radius: 6px; }
        .ls-foydalar li.ls-foy-joy { height: 34px; border: 2px dashed ${fon(T.ink, 0.22)}; border-radius: 8px; animation: none; }
        .ls-nom.joriy { box-shadow: inset 0 0 0 1.5px ${T.accent}; border-radius: 6px; padding: 0 4px; }
        .ls-tugma.joriy { outline: 2px dashed ${T.accent}; outline-offset: 2px; }
        .ls-yorliq { align-self: flex-start; font-size: 11px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 999px; padding: 2px 9px; animation: ld-kir 0.4s ease-out both; }
        .ls-yorliq.tepa { color: ${T.accent}; background: ${T.accentSoft}; }
        p.ls-osti { margin: 0; font-size: 13.5px; line-height: 1.45; color: ${T.ink2}; border-radius: 6px; }
        .ls-tugma-q { display: flex; align-items: center; gap: 6px; align-self: flex-start; }
        .ls-tugma { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; border: none; border-radius: 10px; padding: 9px 16px; background: ${T.accent}; color: #fff; cursor: pointer; transition: transform 0.15s, box-shadow 0.2s; }
        .ls-tugma:disabled { cursor: default; }
        .ls-tugma.bosh { min-width: 118px; font-size: 15px; line-height: 1; }
        .ls-tugma.bos { transform: scale(0.92); box-shadow: 0 0 0 5px ${fon(T.accent, 0.25)}; }
        .ls-qator { display: flex; gap: 14px; align-items: flex-start; margin-top: 6px; }
        .ls-tel { flex: none; zoom: 0.72; } /* sahifa ichidagi telefon — sahifadagi skrinshot kabi kichik; ramka uni kesmaydi (F-1006-369, global: maketda hech narsa kesilmaydi) */
        .ls-foydalar { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; flex: 1; min-width: 0; border-radius: 8px; }
        .ls-foydalar li { display: flex; flex-direction: column; gap: 2px; animation: ld-kir 0.5s ease-out var(--d, 0s) both; }
        .ls-foydalar li b { font-size: 13.5px; font-weight: 800; color: ${T.ink}; line-height: 1.25; }
        .ls-foydalar li span { font-size: 12px; color: ${T.ink2}; line-height: 1.35; }
        .ls-bolim { margin-top: 28px; padding: 14px; border-radius: 12px; background: ${T.bg}; display: flex; flex-direction: column; gap: 4px; }
        .ls-bolim b { font-size: 15px; color: ${T.ink}; }
        .ls-bolim span { font-size: 13px; color: ${T.ink2}; }
        .ls-parda { position: absolute; inset: 0; z-index: 3; display: flex; align-items: center; justify-content: center; background: ${T.ink}; animation: ld-parda 0.45s ease-out both; }
        .ls-tahrir { margin-left: 6px; width: 24px; height: 24px; border-radius: 6px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; font-size: 12px; line-height: 1; vertical-align: middle; flex: none; }
        .ls-web { padding: 16px 18px; display: flex; flex-direction: column; gap: 8px; }
        .ls-web-nom { font-weight: 800; font-size: 13px; color: ${MAYDON_RANG}; }
        .ls-web-sar { font-size: 18px; font-weight: 800; color: ${T.ink}; }
        .jt-tel { position: relative; width: 170px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 6px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .jt-bar { display: flex; align-items: center; justify-content: center; height: 16px; flex: none; }
        .jt-nom { font-weight: 800; font-size: 12.5px; color: ${MAYDON_RANG}; letter-spacing: 0.01em; }
        .jt-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; animation: ld-ekran 0.35s ease-out both; }
        .jt-sar { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .jt-kun { margin-top: 4px; font-size: 11px; font-weight: 700; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.05em; }
        .jt-karta { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11.5px; color: ${T.ink2}; }
        .jt-karta b { font-size: 12.5px; color: ${T.ink}; }
        .jt-son { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 800; color: ${T.ink}; margin-top: 4px; }
        .jt-son.katta { font-size: 22px; align-self: flex-start; border-radius: 8px; padding: 0 4px; }
        .jt-doiralar { display: grid; grid-template-columns: repeat(5, 12px); gap: 5px; margin: 4px 0; }
        .jt-doiralar i { width: 12px; height: 12px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; }
        .jt-doiralar i.bor { border: 0; background: ${fon(T.ink, 0.38)}; }
        .jt-doiralar i.yangi { background: ${T.accent}; }
        .jt-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .jt-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .jt-joy { font-size: 12px; color: ${T.ink2}; }
        .jt-btn { margin-top: auto; flex: none; display: flex; align-items: center; justify-content: center; height: 30px; border-radius: 10px; background: ${T.accent}; color: #fff; font-size: 12px; font-weight: 800; }
        .jt-btn.kel { background: ${T.ok}; }
        .jt-izoh { font-size: 10.5px; color: ${T.ink2}; text-align: center; }
        .jt-halqa { outline: 2.5px solid ${T.accent}; outline-offset: 3px; }
        /* Halqa (SABOQ 32): accent halqa doim, yengil to'lqin — scale 1.03, shaffoflik 0.35, sikl 2.4 s, 3 marta; guruhda bitta */
        .ld-halqa, .ls-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .ld-halqa::after, .ls-halqa::after { content: ''; position: absolute; inset: -6px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: ld-tolqin 2.4s ease-in-out 0.4s 3; }
        /* Variantlar va tanlov chiplari: guruh atrofida ramka YO'Q — har birining o'z yengil accent chegarasi (F-1006-370/371, foydalanuvchi: «donavoy», general) */
        .ld-halqa-guruh > .ld-tanlov { border-color: ${fon(T.accent, 0.55)}; box-shadow: 0 6px 14px -10px ${fon(T.accent, 0.5)}; }
        .ld-s0.kutish .q-variant:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${fon(T.accent, 0.55)}, 0 6px 16px -8px ${fon(T.accent, 0.3)}; }
        .q-bashorat:not(:has(.q-chip.on)) .q-chip:not(:disabled) { border-color: ${fon(T.accent, 0.6)}; box-shadow: 0 4px 12px -9px ${fon(T.accent, 0.5)}; }
        .ld-halqa-i { border-color: ${T.accent} !important; animation: ld-tolqin-i 2.4s ease-in-out 0.4s 3; }
        .ld-s0 { display: contents; }
        .ld-hook { position: relative; }
        .ld-hook-odam { position: absolute; right: 12%; bottom: 14px; width: 70px; }
        .ld-odam { display: block; width: 70px; height: auto; animation: ld-kir 0.5s ease-out 0.3s both; }
        .ld-pufak { position: absolute; top: -22px; right: -20px; width: 34px; height: 34px; border-radius: 50%; background: ${T.paper}; border: 2px solid ${T.ink}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; color: ${T.accent}; animation: ld-tush 0.45s cubic-bezier(.3,1.4,.5,1) 0.7s both; }
        .ld-teg { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; text-transform: none; letter-spacing: 0; color: ${T.ink2}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; padding: 1px 7px; }
        .ld-insta { font-weight: 800; font-style: normal; background: linear-gradient(90deg,#F58529,#DD2A7B 55%,#8134AF); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .ld-burbn { font-weight: 800; font-style: normal; color: ${T.ink}; }
        .ld-reja { border: 1.5px solid ${T.line}; border-radius: 12px; background: ${T.paper}; overflow: hidden; }
        .ld-reja-bar { display: flex; align-items: center; gap: 5px; height: 26px; padding: 0 9px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .ld-reja-bar > i { width: 7px; height: 7px; border-radius: 50%; background: ${fon(T.ink, 0.16)}; }
        .ld-reja-url { margin-left: 6px; display: inline-flex; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; padding: 2px 8px; background: ${T.paper}; border-radius: 999px; animation: ld-kir 0.4s ease-out var(--d, 0s) both; }
        .ld-reja-ichi { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        .ld-rj { animation: ld-kir 0.45s ease-out var(--d, 0s) both; }
        .ld-rj.nom { font-weight: 800; font-size: 11.5px; color: ${MAYDON_RANG}; }
        .ld-rj.sar { font-size: 20px; font-weight: 800; color: ${T.ink}; }
        .ld-rj.tug { align-self: flex-start; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 11.5px; border-radius: 8px; padding: 5px 12px; }
        .ld-rj-qator { display: flex; gap: 10px; align-items: flex-start; }
        .ld-rj.tel { width: 70px; height: 104px; border: 1.5px solid ${T.ink}; border-radius: 12px; padding: 6px; display: flex; flex-direction: column; gap: 8px; align-items: center; flex: none; }
        .ld-rj.tel b { font-size: 8.5px; color: ${T.ok}; }
        .ld-rj.tel i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: ${T.ink}; background: ${T.bg}; border: 1px solid ${T.line}; border-radius: 6px; padding: 6px 4px; width: 100%; text-align: center; }
        .ld-rj-foy { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0; }
        .ld-rj.foy { font-weight: 700; font-size: 13px; color: ${T.ink}; padding: 6px 10px; border-radius: 8px; background: ${T.bg}; }
        .ld-strip { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; min-width: 0; }
        .ld-strip-l { flex: none; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: ${T.accent}; }
        .ld-strip-t { flex: 1; min-width: 0; font-weight: 700; font-size: 13px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ld-strip-b { flex: none; max-width: 140px; font-size: 11.5px; font-weight: 800; color: #fff; background: ${T.accent}; border-radius: 7px; padding: 3px 9px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ld-uch { position: fixed; z-index: 1200; pointer-events: none; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 8px; padding: 4px 10px; max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.4); animation: ld-uch 0.78s cubic-bezier(.5,0,.3,1) forwards; }
        .ld-tx { display: block; margin-bottom: 4px; font-size: 12.5px; font-weight: 700; color: ${T.ink2}; } /* 2-dars bilan bir: kichik qator, quti qalin bo'lmaydi (F-1006-372/380) */
        .ld-tx b { color: ${T.ink}; } .ld-tx.ok, .ld-tx.ok b { color: ${T.ok}; } .ld-tx b.yoq { color: ${T.err}; }
        .ld-bashq { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 9px 14px; border-radius: 12px; background: ${T.accentSoft}; font-size: 13px; color: ${T.ink2}; }
        .ld-bashq-t b { color: ${T.accent}; }
        .ld-split { display: grid; grid-template-columns: minmax(0,1.12fr) minmax(0,1fr); gap: clamp(16px,2.6vw,28px); align-items: start; }
        .ld-fokus { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 660px; margin: 0 auto; }
        .ld-prd { background: ${T.paper}; border-radius: 14px; padding: 14px 16px; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.2); display: flex; flex-direction: column; gap: 8px; }
        .ld-prd.ixcham { padding: 8px 14px; box-shadow: none; border: 1px solid ${T.line}; }
        .ld-prd-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        p.ld-prd-q { margin: 0; padding: 4px 6px; font-size: 13.5px; line-height: 1.45; color: ${T.ink2}; border-radius: 8px; transition: background 0.3s; }
        p.ld-prd-q b { color: ${T.ink}; }
        p.ld-prd-q.on { background: ${T.accentSoft}; }
        .ld-mark { background: ${fon(T.accent, 0.18)}; color: ${T.ink}; border-radius: 4px; padding: 0 2px; font-weight: 700; }
        .ld-qsavollar { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
        .ld-qsavol { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; padding: 9px 14px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .ld-qsavol:disabled { cursor: default; opacity: 0.5; }
        .ld-qsavol.ok { opacity: 1; background: ${T.okFon}; border-color: transparent; color: ${T.ok}; }
        .ld-qsavol.ld-halqa { opacity: 1; border-color: ${T.accent}; color: ${T.accent}; }
        p.ld-ipucha { margin: 0; font-size: 12.5px; color: ${T.ink2}; }
        .ld-atama { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; animation: ld-kir 0.5s ease-out both; }
        .ld-atama-y { font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 11px; }
        .ld-tviz { margin-top: 4px; }
        .ld-mini { max-width: 460px; border: 1.5px solid ${T.line}; border-radius: 12px; overflow: hidden; background: ${T.paper}; }
        .ld-mini-ichi { padding: 16px 16px 30px; }
        .ld-mini-sar { font-size: 17px; font-weight: 800; line-height: 1.5; color: ${T.ink}; }
        .ld-mini-b { position: relative; display: inline-block; border-bottom: 2px solid ${T.accent}; }
        .ld-mini-b i { position: absolute; left: 0; top: 100%; margin-top: 3px; font-style: normal; font-size: 10.5px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; }
        .ld-split.ld-s4 { grid-template-columns: auto minmax(0,1fr); }
        .ld-s4 .ld-juft-kol { flex: none; width: 230px; }
        .ld-s4-chap { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-start; }
        .ld-juft-kol { flex: 1; min-width: 150px; display: flex; flex-direction: column; gap: 10px; }
        ul.ld-juftlar { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .ld-juftlar li { display: flex; flex-direction: column; gap: 3px; padding: 8px 10px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; animation: ld-kir 0.45s ease-out both; }
        .ld-juftlar li.yangi { animation: ld-kir 0.45s ease-out both, ld-yashil 1.1s ease-out; }
        .ld-juftlar.mini { max-width: 420px; }
        .ld-jf { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; }
        .ld-chiz { display: block; width: 28px; height: 1.5px; background: ${fon(T.ink, 0.25)}; }
        .ld-juftlar li b { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .ld-quti { display: flex; align-items: center; gap: 8px; min-height: 40px; padding: 6px 10px; border-radius: 10px; border: 1.5px dashed ${fon(T.ink, 0.25)}; background: ${T.bg}; animation: ld-kir 0.4s ease-out both; }
        .ld-quti-y { font-size: 11px; font-weight: 700; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.05em; }
        .ld-quti.tushdi .ld-eslatma-chip { animation: ld-tush 0.45s cubic-bezier(.3,1.4,.5,1) both; }
        .ld-eslatma-chip { font-size: 12.5px; font-weight: 800; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 999px; padding: 4px 12px; }
        .ld-tashqi { align-self: flex-start; display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 12px; border: 1.5px dashed ${fon(T.ink, 0.25)}; }
        .ld-tashqi.mini { margin-top: 2px; }
        .ld-tashqi-y { font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .ld-karta { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.22); display: flex; flex-direction: column; gap: 10px; animation: ld-karta 0.45s cubic-bezier(.2,.9,.3,1.1) both; transition: background 0.3s; min-width: 0; }
        .ld-karta.err { background: ${T.errFon}; }
        .ld-karta-nom { font-size: clamp(17px,2vw,20px); font-weight: 800; color: ${T.ink}; line-height: 1.25; }
        .ld-kulrang { display: block; font-size: 12.5px; color: ${T.ink2}; }
        .ld-tanlovlar { display: flex; flex-direction: column; gap: 8px; }
        .ld-tanlovlar.silk { animation: ld-silk 0.4s ease-in-out; }
        .ld-tanlov { text-align: left; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 600; color: ${T.ink}; padding: 11px 14px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; cursor: pointer; transition: border-color 0.2s, background 0.2s; animation: ld-kir 0.4s ease-out both; }
        .ld-tanlov:nth-child(2) { animation-delay: 0.08s; } .ld-tanlov:nth-child(3) { animation-delay: 0.16s; }
        .ld-tanlov:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        p.ld-yordam { margin: 0; font-size: 13px; color: ${T.ink}; background: ${T.bg}; border-radius: 10px; padding: 8px 12px; }
        .ld-s6-ong { display: flex; flex-direction: column; gap: 12px; }
        .ld-umami { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 10px; padding: 14px 16px; border-radius: 14px; background: ${T.paper}; border: 1px solid ${T.line}; box-shadow: 0 8px 22px -12px rgba(${T.shadowBase},0.22); }
        .ld-umami.ixcham { padding: 8px 12px; box-shadow: none; }
        .ld-umami-n { width: 100%; font-weight: 800; font-size: 12px; letter-spacing: 0.04em; color: ${T.ink}; }
        .ld-umami.ixcham .ld-umami-n { width: auto; }
        .ld-umami-l { font-size: 13px; color: ${T.ink2}; }
        .ld-umami-s { font-family: 'JetBrains Mono', monospace; font-size: 30px; font-weight: 800; color: ${T.ink}; }
        .ld-umami.ixcham .ld-umami-s { font-size: 16px; }
        .ld-umami-s.yangi { color: ${T.accent}; animation: ld-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .ld-umami-h { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${T.ink}; background: ${T.bg}; border-radius: 6px; padding: 2px 8px; }
        .ld-treklar, .ld-trek-tan { display: flex; flex-wrap: wrap; gap: 8px; }
        .ld-trek-tan { margin-top: 8px; }
        .ld-trek { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; padding: 7px 14px; border-radius: 999px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .ld-trek.on { background: ${T.accentSoft}; border-color: ${T.accent}; color: ${T.accent}; }
        .ld-voqea { display: flex; flex-direction: column; gap: 12px; }
        p.ld-tanish { margin: 0; font-size: 14px; color: ${T.ink2}; }
        .ld-voqea-h { font-weight: 800; font-size: 15px; color: ${T.ink}; animation: ld-kir 0.4s ease-out both; }
        .ld-nuq { display: flex; align-items: center; gap: 8px; margin: 2px 0; }
        .ld-nuq-l { font-weight: 800; font-size: 12px; color: ${T.ink2}; margin-right: 4px; }
        .ld-nuq > i { width: 26px; height: 6px; border-radius: 99px; background: ${T.line}; }
        .ld-nuq > i.ok { background: ${T.ok}; } .ld-nuq > i.cur { background: ${T.accent}; }
        .ld-voqea-qator { display: flex; justify-content: center; text-align: left; }
        .ld-voqea-qator.ikki { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 18px; align-items: center; }
        .ig-sahna { display: flex; align-items: center; justify-content: center; padding: 12px 28px; border-radius: 14px; background: ${T.bg}; }
        .ig-tel { width: 180px; height: 280px; flex: none; border: 2px solid ${T.ink}; border-radius: 26px; background: ${T.paper}; padding: 10px; display: flex; flex-direction: column; gap: 8px; overflow: hidden; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); }
        .ig-nom { text-align: center; font-size: 17px; animation: ld-kir 0.45s ease-out both; }
        .ig-menyu { display: flex; flex-direction: column; gap: 6px; }
        .ig-q { display: flex; align-items: center; gap: 8px; height: 28px; padding: 0 10px; border-radius: 8px; background: ${T.bg}; font-size: 12.5px; font-weight: 700; color: ${T.ink}; animation: ld-kir 0.4s ease-out calc(var(--i) * 0.08s) both; overflow: hidden; }
        .ig-menyu.ket .ig-q { animation: ld-ket 0.5s ease-in calc(var(--i) * 0.22s) both; }
        .ig-ic { width: 14px; height: 14px; fill: ${T.ink2}; flex: none; }
        .ig-rasm { display: flex; flex-direction: column; gap: 8px; animation: ld-rasm 0.6s ease-out both; }
        .ig-rasm.kir { animation-delay: 1.1s; }
        .ig-rasm-svg { display: block; width: 100%; height: auto; border-radius: 8px; }
        .ig-filtr { display: flex; gap: 8px; justify-content: center; }
        .ig-filtr i { width: 22px; height: 22px; border-radius: 50%; background: #BFE0F5; border: 2px solid ${T.paper}; box-shadow: 0 0 0 1px ${T.line}; }
        .ig-filtr i:nth-child(2) { background: #F3C98B; } .ig-filtr i:nth-child(3) { background: #C9B6E8; } .ig-filtr i:nth-child(4) { background: #A9D3B8; }
        .ig-izoh { display: flex; align-items: center; gap: 6px; }
        .ig-izoh svg { width: 14px; height: 14px; fill: none; stroke: ${T.ink2}; stroke-width: 1.5; flex: none; }
        .ig-izoh em { flex: 1; height: 7px; border-radius: 99px; background: ${fon(T.ink, 0.12)}; }
        .ig-son { display: flex; flex-direction: column; gap: 4px; max-width: 230px; }
        .ig-sana { align-self: flex-start; font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 999px; padding: 3px 10px; }
        .ig-son-l { font-size: 13px; color: ${T.ink2}; }
        .ig-son-b { font-family: 'JetBrains Mono', monospace; font-size: clamp(30px,4vw,40px); font-weight: 800; color: ${T.ink}; line-height: 1.1; }
        .ig-mini { width: 150px; border: 2px solid ${T.ink}; border-radius: 18px; padding: 8px; display: flex; flex-direction: column; gap: 5px; background: ${T.paper}; }
        .ig-mini-q { height: 10px; border-radius: 99px; background: ${fon(T.ink, 0.1)}; }
        .ig-mini-r { display: flex; flex-direction: column; gap: 3px; padding: 5px; border-radius: 8px; background: ${T.accentSoft}; }
        .ig-mini-r b { font-size: 11.5px; text-align: center; color: ${T.ink}; }
        .ld-s9-chap { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .ld-sahifam { align-self: flex-start; font-size: 12px; font-weight: 800; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.05em; animation: ld-kir 0.4s ease-out both; }
        .ld-sahifam b { color: ${T.accent}; }
        .ld-maydon { display: flex; flex-direction: column; gap: 4px; font-size: 12px; font-weight: 700; color: ${T.ink2}; min-width: 0; }
        .ld-inp { width: 100%; font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 500; color: ${T.ink}; padding: 10px 12px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .ld-inp:focus { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.15)}; }
        .ld-inp.katta { font-size: 16px; padding: 12px 14px; }
        .ld-inp.err { border-color: ${T.err}; background: ${T.errFon}; }
        .ld-inp.ok { border-color: ${T.ok}; }
        .ld-hisob { align-self: flex-end; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; color: ${T.ink2}; }
        .ld-hisob.chek { color: ${T.accent}; }
        .ld-foy-form { display: flex; flex-direction: column; gap: 10px; }
        .ld-foy-juft { display: grid; gap: 6px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        /* «Uch foyda» bittadan (F-1006-373): saqlangan juftlar — ixcham ✓ qator (bosib tahrirlanadi); ochiq juft karta bo'lib kiradi */
        .ld-foy-n { font-size: 12px; font-weight: 800; color: ${T.accent}; }
        .ld-foy-oklar { display: flex; flex-direction: column; gap: 6px; }
        .ld-foy-ok { display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 8px; align-items: baseline; text-align: left; padding: 7px 10px; border-radius: 10px; border: 1px solid ${fon(T.ok, 0.35)}; background: ${fon(T.ok, 0.06)}; font-family: 'Manrope', sans-serif; cursor: pointer; }
        .ld-foy-ok:hover { border-color: ${T.ok}; }
        .ld-foy-ok i { grid-row: span 2; font-style: normal; font-weight: 800; color: ${T.ok}; }
        .ld-foy-ok b { font-size: 13px; font-weight: 700; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ld-foy-ok span { font-size: 12px; color: ${T.ink2}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ld-kirish { animation: ld-juft-kir 0.45s cubic-bezier(.3,1.2,.5,1) both; }
        @keyframes ld-juft-kir { from { opacity: 0; transform: translateX(18px) scale(0.98); } to { opacity: 1; transform: none; } }
        .ld-prd-fn { font-style: normal; font-weight: 600; color: ${T.ink2}; }
        .ld-s9-karta { gap: 12px; }
        .ld-prd-ix.ochiq { box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.25); }
        .ld-karta-tug { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 8px; }
        .ld-prd-ix { border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; padding: 6px 10px; }
        .ld-prd-ix-b { width: 100%; display: flex; justify-content: space-between; align-items: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; background: none; border: none; cursor: pointer; padding: 4px 2px; }
        .ld-prd-ix-t { display: flex; flex-direction: column; gap: 4px; padding: 4px 2px 6px; }
        .ld-prd-ix-t p { margin: 0; font-size: 13px; color: ${T.ink2}; line-height: 1.4; }
        .ld-prd-ix-t b { color: ${T.ink}; }
        .ld-prd-ix.erkin { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 10px; }
        .ld-s10 { position: relative; }
        .ld-s10.bitta { grid-template-columns: minmax(0, 640px); justify-content: center; }
        .ld-s10-ong { display: flex; flex-direction: column; gap: 10px; }
        ul.ld-javoblar { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .ld-javoblar li { display: flex; gap: 10px; align-items: baseline; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; }
        .ld-javoblar li span { flex: none; color: ${T.ink2}; }
        .ld-javoblar li b { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: ${T.ink}; }
        .ls-ustida { position: absolute; top: 10px; right: 10px; z-index: 4; display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: ${T.paper}; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.4); border: 2px solid ${T.accent}; }
        .ld-sanoq { font-family: 'JetBrains Mono', monospace; font-size: 40px; font-weight: 800; color: ${T.accent}; animation: ld-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .ld-pufaklar { display: flex; flex-direction: column; gap: 12px; }
        .ld-puf { position: relative; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px 14px 14px 4px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; animation: ld-kir 0.4s ease-out both; }
        .ld-puf.ok { border-color: ${T.ok}; background: ${T.okFon}; }
        .ld-puf.yoq { border-style: dashed; border-color: ${fon(T.ink, 0.3)}; }
        .ld-puf-s { font-size: 11.5px; font-weight: 800; color: ${T.ink2}; }
        .ld-puf-j { font-size: 14px; color: ${T.ink}; overflow-wrap: anywhere; }
        .ld-puf-tug { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .ld-mos { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; padding: 6px 12px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; cursor: pointer; }
        .ld-mos:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .ld-chiziq-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; z-index: 2; }
        .ld-chiziq { stroke: ${fon(T.ink, 0.35)}; stroke-width: 1.5; stroke-dasharray: 600; stroke-dashoffset: 600; animation: ld-chiz 0.7s ease-out forwards; }
        .ld-chiziq.ok { stroke: ${T.ok}; stroke-width: 2; }
        .ld-chiziq.yoq { stroke: ${fon(T.ink, 0.3)}; stroke-dasharray: 5 4; stroke-dashoffset: 0; animation: none; }
        .q-blok-t > .ld-bp:first-of-type { display: inline; margin: 0; }
        .ld-bp { display: block; margin-top: 6px; }
        .ld-prompt-tah { display: flex; justify-content: flex-end; }
        .ld-prompt-ed { width: 28px; height: 28px; border-radius: 8px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.accent}; cursor: pointer; }
        .ld-prompt-ta { display: block; width: 100%; margin-top: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.5; padding: 8px 10px; border-radius: 10px; border: 1.5px solid ${T.accent}; background: ${T.paper}; color: ${T.ink}; resize: vertical; }
        .ld-namuna { display: block; margin-top: 4px; font-size: 12px; line-height: 1.45; color: ${T.ink2}; }
        .ld-yordam-b { margin-top: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: ${T.accent}; background: ${T.accentSoft}; border: none; border-radius: 8px; padding: 6px 12px; cursor: pointer; }
        .ld-yordam-p { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; padding: 10px 12px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }
        .ld-yp-y { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .ld-yp-satr { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.5; color: ${T.ink}; overflow-wrap: anywhere; }
        .ld-manzil { margin-top: 8px; }
        .ld-natija { display: flex; flex-direction: column; gap: 8px; }
        p.ld-ortda { margin: 6px 0 0; font-size: 12.5px; line-height: 1.6; color: ${T.ink2}; }
        .ld-flash.yangi .fc-card:not(.flip) .fc-front { box-shadow: 0 0 0 3px ${T.accent}; animation: ld-halqa-k 2.4s ease-in-out 0.4s 3; }
        @keyframes ld-halqa-k { 0%, 100% { box-shadow: 0 0 0 3px ${T.accent}; } 50% { box-shadow: 0 0 0 3px ${T.accent}, 0 0 0 7px ${fon(T.accent, 0.3)}; } }
        p.ld-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.ld-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; animation: ld-puls 2.4s ease-in-out 3; }
        .ld-hw { display: flex; flex-direction: column; gap: 12px; }
        .ld-hw-karta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .ld-hw-q { display: flex; flex-direction: column; gap: 2px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
        .ld-hw-k { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${T.ink2}; }
        .ld-hw-v { font-size: 13px; font-weight: 700; color: ${T.ink}; }
        ol.ld-hw-qadam { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .ld-hw-qadam li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: ${T.ink}; }
        .ld-hw-qadam li i { flex: none; font-style: normal; font-weight: 800; color: ${T.accent}; }
        .ld-hw-keyingi { font-size: 13px; color: ${T.ink2}; }
        .ld-yakun { display: contents; }
        .ld-yakun.belgisiz .done-chip .tick { display: none; }
        @keyframes ld-kir { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes ld-yoz { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
        @keyframes ld-yashil { 0%, 45% { background: ${T.okFon}; } 100% { background: transparent; } }
        @keyframes ld-tush { from { opacity: 0; transform: translateY(-14px) scale(0.6); } to { opacity: 1; transform: none; } }
        @keyframes ld-pop { from { transform: scale(1.35); } to { transform: none; } }
        @keyframes ld-ekran { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: none; } }
        @keyframes ld-karta { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes ld-silk { 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
        @keyframes ld-uch { to { transform: translate(var(--dx), var(--dy)) scale(0.92); opacity: 0.15; } }
        @keyframes ld-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes ld-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        @keyframes ld-jt { 0%, 100% { outline-offset: 3px; } 50% { outline-offset: 5px; } }
        @keyframes ld-puls { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.03); opacity: 0.65; } }
        @keyframes ld-parda { from { transform: translateY(-100%); } to { transform: none; } }
        @keyframes ld-ket { to { opacity: 0; transform: translateX(-24px); height: 0; padding-top: 0; padding-bottom: 0; margin: -3px 0; } }
        @keyframes ld-rasm { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: none; } }
        @keyframes ld-chiz { to { stroke-dashoffset: 0; } }
        @media (max-width: 760px) { .ld-split, .ld-split.ld-s4 { grid-template-columns: 1fr; } .ld-s4 .ld-juft-kol { width: auto; flex: 1; } }
        @media (max-width: 640px) {
          .ld-voqea-qator.ikki { grid-template-columns: 1fr; }
          .ls-oyna { --lsh: 430px; } .ls-oyna.qisqa { --lsh: 360px; }
          .ls-ichi { padding: 12px 12px 20px; } .ls-qator { gap: 10px; }
          .ls-foydalar li b { font-size: 12.5px; } .ls-foydalar li span { font-size: 11.5px; }
          .ig-sahna { flex-direction: column; } .ld-hw-karta { grid-template-columns: 1fr; } .ld-prd-ix.erkin { grid-template-columns: 1fr; }
          .ld-hook-odam { right: 6%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ls-url-t, .ls-yoz, h3.ls-sar.yozildi, p.ls-osti.yozildi, .ls-foydalar.yozildi, .ls-sar-joy, .ls-yorliq, .ls-foydalar li, .ls-parda, .jt-ekran, .jt-halqa,
          .ld-halqa::after, .ls-halqa::after, .ld-halqa-i, .ld-odam, .ld-pufak, .ld-reja-url, .ld-rj,
          .ld-uch, .ld-atama, .ld-juftlar li, .ld-quti, .ld-quti.tushdi .ld-eslatma-chip, .ld-karta, .ld-tanlovlar.silk, .ld-tanlov, .ld-umami-s.yangi, .ld-voqea-h,
          .ig-nom, .ig-q, .ig-menyu.ket .ig-q, .ig-rasm, .ld-sahifam, .ld-sanoq, .ld-puf, .ld-chiziq, .ld-flash.yangi .fc-card:not(.flip) .fc-front, p.ld-fc-ipucha i, .ld-kirish { animation: none !important; }
          .ig-menyu.ket { display: none; }
          .ls-ichi, .ls-nom, .ls-tugma { transition: none !important; }
        }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px ${fon(T.accent, 0.35)}, 0 0 0 1px ${fon(T.accent, 0.12)}; }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px ${fon(T.accent, 0.55)}; }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .zoomable { position: relative; }
        .zoomable.z-float > .zoom-btn { visibility: hidden; } /* ⛶ bo'sh joy ustida osilmasin (ZBTN, 159-qonun) */
        .flow-label:has(+ .zoomable.z-empty) { display: none; } /* bo'sh ustun ustida yorliq yolg'iz osilmasin (bridge 40-band, F-0926-01) */
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        /* F-1004-12: ⛶ matn ustiga tushmasin. Keng ekranda tugma kontentdan tashqarida, o'ng chetda turadi;
           torroq ekranda ichkarida qoladi va o'ng ustunning birinchi yorlig'iga o'ngdan 40 px joy beriladi. */
        @media (min-width: 1200px) { .zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: -42px; } .zoomable.z-float:not(.zoom-on) > .zoom-btn { visibility: visible; } }
        @media (max-width: 1199px) { .zoomable:not(.z-float):not(.zoom-on) > .split > :last-child > :is(p, h2, h3, h4, .eyebrow, .flow-label, .note-h):first-child, .zoomable:not(.z-float):not(.zoom-on) > .zoom-btn + :is(p, h2, h3, h4, .eyebrow, .flow-label, .note-h) { padding-right: 40px; } }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI (radio) === */
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }


        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
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
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px ${fon(T.accent, 0.55)}; }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px ${fon(T.accent, 0.55)}, 0 0 3px ${fon(T.accent, 0.4)}; }
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px ${fon(T.accent, 0.22)}; }
        .frame-success { background: ${T.okFon}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .head-c { text-align: center; align-items: center; } /* F-1003-04: natija ekrani — bitta o'q */
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
        .ai-line.bad { background: ${fon(T.accent, 0.16)}; box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }

        /* === YAKUN === */
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink2}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }

        /* === JSON KO'RINISHI === */

        /* === MA'LUMOT JADVALI === */

        /* === SXEMA JADVAL-KARTOCHKASI === */

        /* === BOG'LANISH TUGMASI (s10) === */

        /* === TANLASH QATORI (s13) === */

        /* === YAKUNIY SXEMA KANVAS (s15) === */

        /* === Instagram POST KARTOCHKASI === */

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }
        .lp-step:hover:not(.on) { box-shadow: 0 8px 18px -7px rgba(${T.shadowBase},0.24); }
        .lp-step.on { background: ${T.okFon}; color: ${T.ok}; box-shadow: inset 0 0 0 1.5px ${T.ok}55; }
        .lp-step.on .lp-check { background: ${T.ok}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes lp-done-pop { 0% { transform: scale(1); } 32% { transform: scale(1.05) translateY(-2px); } 60% { transform: scale(0.98); } 100% { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .lp-step.on .lp-check, .lp-done-btn.is-done { animation: none !important; } }
        .lp-mstats { background: ${T.accentSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }

        /* === 🃏 FLASHCARDS — qolipda: QKartochka (DE-204) === */

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }

        /* === 🏅 ACHIEVEMENTS — hisoblagich + to'liq-ekran bayram === */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px ${fon(T.accent, 0.4)}; }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink2}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px ${fon(T.accent, 0.18)}; } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 222px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink2}; }
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
        .pod-medal { font-size: clamp(26px,4vw,38px); line-height: 1; }
        .pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: ${T.ink}; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-score { font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink2}; }
        .pod-bar { width: 100%; border-radius: 10px 10px 0 0; background: linear-gradient(180deg, ${T.accent}, ${T.accent}BB); box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); }
        .pod-1 .pod-bar { height: clamp(74px,11vw,120px); }
        .pod-2 .pod-bar { height: clamp(52px,8vw,86px); background: linear-gradient(180deg, ${T.ink2}, ${T.ink2}); }
        .pod-3 .pod-bar { height: clamp(38px,6vw,62px); background: linear-gradient(180deg, #C98A3D, #DDA55C); }
        .pod-col.me .pod-name { color: ${T.ok}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.ok}; } /* 11.16: o'quvchining O'Z natijasi YASHIL (qizil faqat xato javob uchun) */
        .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
        .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
        .pod-row.me { background: ${T.okFon}; outline: 1.5px solid ${T.ok}66; }
        .pod-rank { min-width: 22px; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .pod-row-name { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-row-dots { display: flex; gap: 4px; }
        .pod-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(${T.shadowBase},0.15); }
        .pod-dot.ok { background: ${T.ok}; }
        .pod-dot.bad { background: ${T.accent}; }
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
        .pod-row-time { min-width: 46px; text-align: right; font-size: 11.5px; color: ${T.ink2}; }

        /* === ⚡ CODE STRIKE — CTA neon-kapsula (arena STRUKTURASI ⚡ Jonliniki) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px; /* 192 (F-1004-57): CODE STRIKE — kapsula, platforma standarti */
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
        .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
        .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
        @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
        .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none; background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%); animation: cs-portal-in .9s ease-in-out both; }
        @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }
        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }
        /* === MENTOR STATISTIKASI (jonli test + yozma ish panellari) === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px ${fon(T.accent, 0.5)}; }
        .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px ${fon(T.accent, 0.5)}; } 50% { box-shadow: 0 4px 18px 0 ${fon(T.accent, 0.55)}; } }
        .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
        .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.accent}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
        .mstats-prog-fill.full { background: ${T.ok}; }
        .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
        .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
        .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
        .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .mstats-chip.okc  { background: ${T.okFon}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.ok}; }
        .mstats-chip.badc { background: ${T.accentSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.accent}; }
        .mstats-chip.waitc { background: rgba(${T.shadowBase},0.06); } .mstats-chip.waitc .mstats-chip-n, .mstats-chip.waitc .mstats-chip-t { color: ${T.ink2}; }
        .mstats-chip.ansc { background: ${fon(T.accent, 0.10)}; } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.accent}; }
        .mstats-hidden { margin: 0; font-family: 'Manrope'; font-size: 12.5px; font-style: italic; color: ${T.ink2}; }
        .mstats-bars { display: flex; flex-direction: column; gap: 8px; }
        .mstats-row { display: flex; align-items: center; gap: 10px; transition: opacity 0.4s; }
        .mstats-row.dimmed { opacity: 0.4; }
        .mstats-abc { width: 28px; height: 28px; border-radius: 9px; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); }
        .mstats-track { flex: 1; height: 16px; background: rgba(${T.shadowBase},0.07); border-radius: 99px; overflow: hidden; }
        .mstats-fill { display: block; height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(.4,0,.2,1); opacity: 0.85; }
        .mstats-count { min-width: 108px; text-align: right; font-size: 12px; font-weight: 600; color: ${T.ink2}; white-space: nowrap; }
        .mstats-waitrow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .mstats-wait-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .mstats-wait-chip { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.07); border-radius: 99px; padding: 3px 10px; }
        .mstats-wait-chip.more { color: ${T.ink2}; }
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink2}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px ${fon(T.accent, 0.5)}; transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px ${fon(T.accent, 0.55)}; }
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
        .rc-dot.fill { background: ${T.ink2}; }
        .rc-dot.cur { background: ${T.accent}; width: 26px; }
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.accent}; color: #fff; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
        .rc-btn:hover:not(:disabled) { background: ${T.accent}; }
        .rc-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
        .rc-btn.ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
        .rc-btn.ghost:hover:not(:disabled) { background: ${T.paper}; color: ${T.ink}; }
        .rc-btn.done { background: ${T.ok}; color: #fff; }
        .rc-btn.done:hover { background: #17603C; }
        @media (max-width: 640px) {
          .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; }
          .rc-dots { width: 100%; order: -1; }
          .rc-btn { font-size: 13px; padding: 11px 16px; }
        }

        /* === ⚡ CTA (yakun sahifasida) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }

        /* ===== ⚡ ARENA — issiq CoddyCamp muhiti ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, ${fon(T.accent, 0.14)} 0%, ${fon(T.accent, 0)} 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
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
        .qz-pchip.me { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border-color: transparent; box-shadow: 0 0 22px ${fon(T.accent, 0.45)}; }
        @keyframes qz-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .qz-btn { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border: none; border-radius: 14px; padding: 13px 26px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 14px 26px -10px ${fon(T.accent, 0.6)}, inset 0 2px 0 rgba(255,255,255,0.3); transition: transform 0.18s; }
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
        @keyframes tap-hint-pulse { 0% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 0 ${fon(T.accent, 0.4)}; } 70%,100% { box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.18), 0 0 0 8px ${fon(T.accent, 0)}; } }
        .bnode.on { opacity: 1; transform: scale(1); }
        .bnode.trig.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px ${fon(T.accent, 0.3)}; }
        .bnode.sheet.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px ${fon(T.accent, 0.3)}; }
        .bnode.act.on { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}, 0 8px 18px -6px rgba(31,122,77,0.3); }
        .bflow-arrow.on { color: ${T.accent}; opacity: 1; }
        @keyframes think-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .gear-slot.on { opacity: 1; box-shadow: inset 0 0 0 1.5px ${T.ok}, 0 6px 16px -6px rgba(31,122,77,0.26); background: ${T.okFon}; }
        .bot-status.on .bot-status-dot { background: ${T.ok}; box-shadow: 0 0 8px rgba(31,122,77,0.55); }
        @keyframes bot-status-danger { 0%,100% { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 1.5px ${T.err}55; } 50% { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 5px ${T.err}22; } }
        .ns-cell.filled { border-style: solid; border-color: ${T.line}; }
        .ns-cust.ok { box-shadow: inset 0 0 0 1.5px ${T.ok}; } .ns-cust.ok .ns-cust-msg { color: ${T.ok}; }
        @keyframes ns-dots-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes rz-shake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-3px); } }
        .itm-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -8px ${fon(T.accent, 0.3)}; }

        /* to'g'ri terilganda — qadamlar KETMA-KET tasdiqlanadi (yuqoridan pastga to'lqin) */
        /* SNAP — bo'lak slotga tushganda "qulflandi" hissi (fill-mode YO'Q — sudrash transform'i erkin qolsin) */

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi (11.7). Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        /* 11.15 — jonli badge xira, hover'da tiniq (proyektorda xalaqit bermaydi) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* ===== 🏙️ SHAHAR KONTENT KOMPONENTLARI (arxitektura darsi) ===== */
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope'; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }
        @keyframes rev-in { from { opacity: 0; transform: translateY(-6px) scale(0.96); } to { opacity: 1; transform: none; } }
        .fl-node.done { opacity: 1; background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; }
        .fl-node.on { opacity: 1; background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 18px -4px ${fon(T.accent, 0.45)}; transform: translateY(-3px); animation: fl-pulse 1.1s infinite ease-in-out; }
        @keyframes fl-pulse { 0%,100% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 16px -6px ${fon(T.accent, 0.4)}; } 50% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 24px -2px ${fon(T.accent, 0.65)}; } }
        @keyframes fl-move { from { left: -7px; opacity: 0; } 25% { opacity: 1; } to { left: calc(100% - 6px); opacity: 1; } }
        .cm-client.on { opacity: 1; box-shadow: inset 0 0 0 1.5px ${T.ok}, 0 5px 14px -6px rgba(31,122,77,0.26); }
        .agent-step.done { background: ${T.okFon}; }
        .agent-step.done .as-phase { color: ${T.ok}; }

        /* S21 — har og'ir animatsiyaga TINCH variant. */
        @media (prefers-reduced-motion: reduce) {
          .itm-card.tap-hint, .gchip.tap-hint, .btn-soft.tap-hint,
          .shake, .fl-node.on { animation: none !important; }
        }
        /* qaytarilgan keyframes (saralashdan keyin) */
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr(LESSON_META.lessonTitle)} />
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
