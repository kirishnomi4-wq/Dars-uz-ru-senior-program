import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 6-MODUL (Tizim arxitekturasi) · DARS 1 — «KOMPONENTLARDAN TIZIM» — PLATFORM STANDARD v18 (AUDIOSIZ)
// Maqsad: o'quvchi real mahsulot — bu KOMPONENTLAR TIZIMI ekanini tushunadi: Frontend + Backend + Database + AI + Bot,
//         va ular orasida ma'lumot qanday OQISHINI ko'radi. O'z mahsuloti arxitekturasini chizadi.
// ASOSIY MODEL (F-0929 MD v2): Foydalanuvchi → Frontend → Backend → Database → ekranda natija. Texnik nom asosiy;
//   o'xshatish faqat s2 kartalarida, bir marta («…ga o'xshatish mumkin»). Backend = Node.js (NestJS).
// INTERAKTIV BEAT'lar: s2 5 qism (3 asosiy + 2 qo'shimcha) · s3 so'rov yo'li (request/response) ·
//   s6 Database = doimiy xotira · s9 qismni o'chirish · s10 ko'p kirish yo'li (web/bot/mobil) ·
//   s15 FINAL: ma'lumot yo'lini to'g'ri tartibda yig'ish (qolip QTartib).
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium (ball to'g'riligi — ⚡ Jonli roli).
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

// D3: palitra umumiy qolipdan — neytral 5 · modul rangi 2 · holat 2 (shadowBase — soya, rang tokeni emas)
const T = { ...qolipRang('tex'), shadowBase: '58, 53, 48' };
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QKarta, QChip, QBashorat, QTaxmin, QQadamlar, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QKartochka, QYakun } from '../qolip/index.jsx';







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

const LESSON_META = { lessonId: 'sys-arch-06-01-v18', lessonTitle: { uz: 'Komponentlardan tizim', ru: 'Система из компонентов' } };
// 19 ekran · 4.1 oqim: hook → reja → (exploration↔test)× → case → debugging-final → podium → flashcard → summary
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
  { id: 's9',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's12', type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's15', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). `s15` — final (picked 0/1 sentinel, correct maydoni haqiqiy). `practice: -1` — sentinel (variant yo'q).
// ⚠️ Variant TARTIBI/qiymatlari 🎓 Metodist + ⚡ Jonli rollari tomonidan qayta balanslanadi — shu map ular bilan sinxron bo'lsin.
// ⚡ To'g'ri javob pozitsiyalari ATAYIN har xil (3 · 0 · 2 · 3) — «doim A» naqshi yo'q, o'qimay bosgan ball to'plamaydi.
// s15 (yakuniy debug) — REAL kalit: picked=0 → 1-urinishda topdi (to'g'ri), picked=1 → 1-urinishda xato bosdi.
const INLINE_KEYS = { s4: 3, s8: 0, s11: 2, s14: 3, s15: 0 };
// 📖 RECAPS — har SCORED test uchun 3 karta (kalit = ekran INDEKSI). Matn 🎓 Metodist tomonidan sayqallanadi.
const RECAPS = {
  4: {
    title: { uz: "Database — doimiy saqlash joyi", ru: 'Database — место постоянного хранения' },
    cards: [
      { ic: null, h: { uz: "Database eslab qoladi", ru: 'Database помнит' }, body: { uz: <>Mahsulot, buyurtma va foydalanuvchilar <b>Database'da</b> doimiy saqlanadi.</>, ru: <>Товары, заказы и пользователи постоянно хранятся <b>в Database</b>.</> } },
      { ic: null, h: { uz: "Frontend ko'rsatadi", ru: 'Frontend показывает' }, body: { uz: <>Sahifa yangilansa, faqat ekranda turgan ma'lumot yo'qoladi.</>, ru: <>Если обновить страницу, пропадут только данные, которые были на экране.</> } },
      { ic: null, h: { uz: "Backend tashiydi", ru: 'Backend переносит' }, body: { uz: <>So'rovni tekshirib Database'ga yozadi, lekin o'zi doimiy saqlamaydi.</>, ru: <>Проверяет запрос и записывает данные в Database, но сам их постоянно не хранит.</> }, ask: { uz: "Mahsulot va buyurtmalar aslida qayerda saqlanadi?", ru: 'Где на самом деле хранятся товары и заказы?' } },
    ]
  },
  8: {
    title: { uz: "So'rovning yo'li", ru: 'Путь запроса' },
    cards: [
      { ic: null, h: { uz: "Frontend'dan boshlanadi", ru: 'Всё начинается с Frontend' }, body: { uz: <>Foydalanuvchi tugmani bosadi, Frontend <b>Backend'ga</b> so'rov yuboradi.</>, ru: <>Пользователь нажимает кнопку, Frontend отправляет запрос <b>в Backend</b>.</> } },
      { ic: null, h: { uz: "Backend Database bilan ishlaydi", ru: 'Backend работает с Database' }, body: { uz: <>So'rovni qabul qiladi, <b>Database'ga</b> yozadi yoki o'qiydi.</>, ru: <>Принимает запрос, записывает данные <b>в Database</b> или читает их оттуда.</> } },
      { ic: null, h: { uz: "Javob orqaga qaytadi", ru: 'Ответ возвращается обратно' }, body: { uz: <>Natija o'sha yo'l bilan ekranga qaytadi; bizning tizimda Frontend Database'ga to'g'ridan bormaydi.</>, ru: <>Результат тем же путём возвращается на экран; в нашей системе Frontend не обращается к Database напрямую.</> }, ask: { uz: "«Savatga» bosilganda so'rov qaysi yo'l bilan boradi?", ru: 'Каким путём идёт запрос при нажатии «В корзину»?' } },
    ]
  },
  11: {
    title: { uz: "Ko'p kirish yo'li — bitta tizim", ru: 'Много точек входа — одна система' },
    cards: [
      { ic: null, h: { uz: "Har biri alohida kirish", ru: 'Каждая — отдельный вход' }, body: { uz: <>Web sayt, Telegram bot, mobil ilova — <b>uch xil kirish yo'li</b>.</>, ru: <>Веб-сайт, Telegram-бот, мобильное приложение — <b>три разные точки входа</b>.</> } },
      { ic: null, h: { uz: "Markaz bitta", ru: 'Центр один' }, body: { uz: <>Hammasi <b>bitta Backend va Database'ga</b> ulanadi.</>, ru: <>Все они подключены <b>к одному и тому же Backend и Database</b>.</> } },
      { ic: null, h: { uz: "Ma'lumot umumiy", ru: 'Данные общие' }, body: { uz: <>Bir joyda berilgan buyurtma boshqasida ham ko'rinadi.</>, ru: <>Заказ, сделанный в одном месте, виден и в другом.</> }, ask: { uz: "Web va bot bir xil buyurtmani qanday ko'radi?", ru: 'Как сайт и бот видят один и тот же заказ?' } },
    ]
  },
  14: {
    title: { uz: "Yangi kirish yo'li — kam ish", ru: 'Новая точка входа — мало работы' },
    cards: [
      { ic: null, h: { uz: "Backend tayyor", ru: 'Backend уже готов' }, body: { uz: <>Backend va Database har qanday kirish yo'li bilan ishlaydi.</>, ru: <>Backend и Database работают с любой точкой входа.</> } },
      { ic: null, h: { uz: "Mobil — yana bir Frontend", ru: 'Мобильное — ещё один Frontend' }, body: { uz: <>Mobil ilova (React Native) <b>o'sha Backend'ga</b> ulanadi.</>, ru: <>Мобильное приложение (React Native) подключается <b>к тому же Backend</b>.</> } },
      { ic: null, h: { uz: "Arxitektura vaqt tejaydi", ru: 'Архитектура экономит время' }, body: { uz: <>Tizimni tushunsangiz, ish ancha kamayadi.</>, ru: <>Если понимаете систему, работы становится намного меньше.</> }, ask: { uz: "Mavjud tizimga mobil ilovani qanday qo'shasiz?", ru: 'Как добавить мобильное приложение к существующей системе?' } },
    ]
  },
  15: {
    title: { uz: "Ma'lumot yo'li — tartib muhim", ru: 'Путь данных — порядок важен' },
    cards: [
      { ic: null, h: { uz: "Avval foydalanuvchi", ru: 'Сначала — пользователь' }, body: { uz: <>U <b>tugmani bosadi</b>.</>, ru: <>Он <b>нажимает кнопку</b>.</> } },
      { ic: null, h: { uz: "Keyin Backend va Database", ru: 'Затем — Backend и Database' }, body: { uz: <>So'rov Frontend'dan Backend'ga, undan Database'ga boradi.</>, ru: <>Запрос идёт из Frontend в Backend, а оттуда — в Database.</> } },
      { ic: null, h: { uz: "Oxirida natija", ru: 'В конце — результат' }, body: { uz: <>Javob eng oxirida ekranga qaytadi.</>, ru: <>Ответ возвращается на экран в самом конце.</> }, vis: <RcFlow items={[{ uz: 'Foydalanuvchi', ru: 'Пользователь' }, { uz: 'Frontend', ru: 'Frontend' }, { uz: 'Backend', ru: 'Backend' }, { uz: 'Database', ru: 'Database' }, { uz: 'Natija', ru: 'Результат' }]} />, ask: { uz: "Nega bizning tizimda so'rov to'g'ridan Database'ga bormaydi?", ru: 'Почему в нашей системе запрос не идёт в Database напрямую?' } },
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

// ===== VS CODE FAYL MOK (arxitektura chizmasi) =====
const CodeFile = ({ name, children, minH }) => (
  <div className="editor">
    <div className="editor-bar"><span className="bb-dots"><i /><i /><i /></span><span className="editor-tab">{name}</span></div>
    <div className="editor-body" style={{ minHeight: minH }}><pre className="editor-code">{children}</pre></div>
  </div>
);

// ===== BRAUZER OYNA MOK (onlayn xarid sayti — web sahifa) =====
const ShopMock = ({ title = 'onlayn-xarid', children, minH }) => (
  <div className="shopwin">
    <div className="shopwin-bar"><span className="sw-dots"><i /><i /><i /></span><span className="sw-url">onlayn-xarid.uz</span></div>
    <div className="shopwin-body" style={{ minHeight: minH }}>{children}</div>
  </div>
);

// DragDropOrder → qolip QTartib (188, DE-203: tartib-mashqi bitta manbadan)

// qolip-maket: smap-n sm-joy fb-tomon   (D2: chizilgan maketning bosiladigan qismlari — tugma darajasi emas)
// ===== TIZIM XARITASI — bitta manba (180, MD v3 B): 0–3, 7, 9, 12, 13-ekranlar shundan o'qiydi =====
// x/y — katta xaritadagi joy (foiz) · qx — bir qatorli kichik xaritadagi joy (1, 9-ekran)
const SYS_NODES = [
  { id: 'user',  nom: { uz: 'Foydalanuvchi', ru: 'Пользователь' }, tex: null, ish: { uz: 'bosadi', ru: 'нажимает' }, x: 15, y: 50, qx: 14 },
  { id: 'front', nom: 'Frontend', tex: 'React', ish: { uz: "ko'rsatadi", ru: 'показывает' }, x: 43, y: 15, qx: 39 },
  { id: 'back',  nom: 'Backend', tex: 'Node.js (NestJS)', ish: { uz: 'hisoblaydi, tekshiradi', ru: 'считает, проверяет' }, x: 43, y: 50, qx: 64 },
  { id: 'db',    nom: 'Database', tex: 'PostgreSQL', ish: { uz: 'eslab qoladi', ru: 'запоминает' }, x: 43, y: 85, qx: 87 },
  { id: 'ai',    nom: 'AI', tex: 'Claude', ish: { uz: 'maslahat beradi', ru: 'советует' }, x: 80, y: 30 },
  { id: 'bot',   nom: 'Bot', tex: 'Telegram', ish: { uz: "yana bir kirish yo'li", ru: 'ещё одна точка входа' }, x: 80, y: 70 },
];
const SYS_BY = Object.fromEntries(SYS_NODES.map(n => [n.id, n]));
const QISMLAR = ['front', 'back', 'db', 'ai', 'bot'];
const ek = (a, b) => [a, b].sort().join('-');
const ASOSIY_YOL = [ek('user', 'front'), ek('front', 'back'), ek('back', 'db')];
const hamma = (ids, h) => Object.fromEntries(ids.map(id => [id, h]));

// Tugun belgilari — chizilgan (186), emoji emas (196): odam · brauzer oynasi · server · baza silindri · AI uchquni · chat
const SysBelgi = ({ id }) => (
  <svg className="smap-ic" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {id === 'user' && <><circle cx="8" cy="5.4" r="2.6" /><path d="M3 14c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6" /></>}
    {id === 'front' && <><rect x="1.8" y="2.6" width="12.4" height="10.8" rx="1.6" /><path d="M1.8 5.8h12.4" /></>}
    {id === 'back' && <><rect x="2.4" y="2.2" width="11.2" height="4.8" rx="1" /><rect x="2.4" y="9" width="11.2" height="4.8" rx="1" /><path d="M5 4.6h.01M5 11.4h.01" strokeWidth="2.2" /></>}
    {id === 'db' && <><ellipse cx="8" cy="3.8" rx="5.2" ry="1.9" /><path d="M2.8 3.8v8.4c0 1 2.3 1.9 5.2 1.9s5.2-.9 5.2-1.9V3.8" /><path d="M2.8 8c0 1 2.3 1.9 5.2 1.9s5.2-.9 5.2-1.9" /></>}
    {id === 'ai' && <path d="M8 1.8l1.4 4.8 4.8 1.4-4.8 1.4L8 14.2l-1.4-4.8L1.8 8l4.8-1.4z" />}
    {id === 'bot' && <path d="M3 3h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H7.2L4.5 13.4V11H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />}
  </svg>
);

// SysMap — darsning bitta vizuali (163). nodes: { id: 'kul' | 'ochiq' | 'joriy' | 'ok' | 'off' } (yo'q — chizilmaydi)
// edges: { 'a-b': 'kul' | 'on' (ma'lumot oqyapti) | 'ok' | 'err' | 'uzuq' | '… yangi' (chizilib chiqadi) }
// konvert: tugun id · konvertTur: 'sorov' | 'javob' · aylanma: konvert yo'l bo'ylab aylanib turadi (1-ekran)
// bosiladi: Set — halqa va bosish (168) · vazifa: tugun ostida 2–3 so'zli vazifa · qator: bir qatorli · izoh: { id: matn } · pufak: { id: matn }
const SysMap = ({ nodes, edges = {}, konvert = null, konvertTur = 'sorov', aylanma = false, onNode, bosiladi, vazifa = false, qator = false, izoh = {}, pufak = {}, silk = null }) => {
  const pos = (n) => (qator ? { x: n.qx, y: 50 } : { x: n.x, y: n.y });
  return (
    <div className={`smap${qator ? ' qator' : ''}`}>
      <svg className="smap-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {Object.entries(edges).map(([k, h]) => {
          const [a, b] = k.split('-'); const A = SYS_BY[a], B = SYS_BY[b];
          if (!A || !B) return null;
          const p = pos(A), q = pos(B);
          return <line key={`${k}-${h}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className={`smap-e ${h}`} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      {SYS_NODES.filter(n => nodes[n.id] && (!qator || n.qx != null)).map(n => {
        const h = nodes[n.id]; const can = !!(bosiladi && bosiladi.has(n.id)); const p = pos(n);
        const ost = izoh[n.id] != null ? izoh[n.id] : (vazifa && h !== 'kul' ? tr(n.ish) : null);
        return (
          <button key={`${n.id}-${h === 'kul' ? 'k' : 'v'}`} type="button" className={`smap-n ${h}${can ? ' q-halqa' : ''}${silk === n.id ? ' q-silk' : ''}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }} disabled={!can} onClick={() => can && onNode && onNode(n.id)}
            aria-label={h === 'kul' ? tr({ uz: 'Hali ochilmagan qism', ru: 'Ещё не открытая часть' }) : tr(n.nom)}>
            {h === 'kul' ? <i className="smap-yoq" aria-hidden="true" /> : <span className="smap-nom"><SysBelgi id={n.id} /><b>{tr(n.nom)}</b></span>}
            {ost && <small>{ost}</small>}
            {pufak[n.id] && <span className={`smap-pufak${p.x > 70 ? ' ong' : ''}`} key={pufak[n.id]}>{pufak[n.id]}</span>}
          </button>
        );
      })}
      {aylanma && <span className="smap-konvert aylanma" aria-hidden="true" />}
      {!aylanma && konvert && SYS_BY[konvert] && <span className={`smap-konvert ${konvertTur}${pufak[konvert] ? ' yetdi' : ''}`} style={{ left: `${pos(SYS_BY[konvert]).x}%`, top: `${pos(SYS_BY[konvert]).y}%` }} aria-hidden="true" />}
    </div>
  );
};

// SiteMock — hook'dagi sayt maketi (MD v3): holat 'odatiy' | 'yuklanish' | 'bosh' · savat — son · jami — narx yig'indisi chiqadimi
// pufak — AI taklifi · joylar: Set — bosiladigan joylar (168) · ochildi: Set — ochilgan joylar · onJoy(id)
const SiteMock = ({ holat = 'odatiy', savat = 0, jami = false, pufak = false, telegram = false, joylar, ochildi, onJoy, miltilla = false, url = 'onlayn-xarid.uz' }) => {
  const J = (id, cls, children) => {
    const can = !!(joylar && joylar.has(id)); const on = !!(ochildi && ochildi.has(id));
    return <button type="button" className={`sm-joy ${cls}${can ? ' q-halqa' : ''}${on ? ' ochiq' : ''}`} disabled={!can} onClick={() => can && onJoy && onJoy(id)}>{children}</button>;
  };
  return (
    <div className={`shopwin${miltilla ? ' sm-miltilla' : ''}`}>
      <div className="shopwin-bar"><span className="sw-dots"><i /><i /><i /></span><span className="sw-url">{url}</span></div>
      <div className="shopwin-body sm-body">
        {holat === 'bosh' ? <div className="sm-bosh" aria-label={tr({ uz: "Bo'sh oyna", ru: 'Пустое окно' })} /> : (
          <>
            <div className="sm-top">
              <span className="sm-logo">onlayn-xarid</span>
              {J('db', 'sm-savat', <>{tr({ uz: 'Savat', ru: 'Корзина' })} <b key={savat} className="sm-son">{savat}</b></>)}
            </div>
            {holat === 'yuklanish' ? (
              <div className="sm-yuk"><span className="sm-spin" aria-hidden="true" />{tr({ uz: 'Yuklanmoqda…', ru: 'Загрузка…' })}</div>
            ) : (
              <>
                {J('front', 'sm-mahsulot', <><span>{tr({ uz: 'Telefon', ru: 'Телефон' })}</span><b>2 500 000</b></>)}
                <div className="sm-mahsulot"><span>{tr({ uz: 'Quloqchin', ru: 'Наушники' })}</span><b>300 000</b></div>
                <div className="sm-past">
                  {J('back', 'sm-savatga', tr({ uz: 'Savatga', ru: 'В корзину' }))}
                  {jami && <span className="sm-jami fade-step">{tr({ uz: 'Jami', ru: 'Итого' })}: <b>2 800 000</b></span>}
                </div>
                {pufak && J('ai', 'sm-pufak fade-step', tr({ uz: "G'ilof ham olasizmi?", ru: 'Возьмёте ещё чехол?' }))}
              </>
            )}
            {telegram && J('bot', 'sm-tg', tr({ uz: 'Telegram orqali buyurtma', ru: 'Заказ через Telegram' }))}
          </>
        )}
      </div>
    </div>
  );
};

// ===== SO'ROVNING YO'LI (15-ekran finali) =====
const FLOW = [
  { id: 'user', label: { uz: 'Foydalanuvchi', ru: 'Пользователь' } },
  { id: 'front', label: { uz: 'Frontend', ru: 'Frontend' } },
  { id: 'back', label: { uz: 'Backend', ru: 'Backend' } },
  { id: 'db', label: { uz: 'Database', ru: 'Database' } },
  { id: 'render', label: { uz: 'Ekranda natija', ru: 'Результат на экране' } }
];

// ===== SCREEN 0 — KIRISH (QKirish: texnik darslar standarti — radio-variant) =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Bitta narsa — shunchaki «sayt»", ru: 'Одна штука — просто «сайт»' } },
  { id: 'b', label: { uz: "Bir nechta qism birga ishlaydigan tizim", ru: 'Система, в которой вместе работают несколько частей' } },
  { id: 'c', label: { uz: "Faqat dizayn va rasmlar", ru: 'Только дизайн и картинки' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [tried, setTried] = useState(!!storedAnswer);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [sc, setSc] = useState(0);
  const poke = () => { setTried(true); setSc(n => n + 1); };
  const pick = (v) => { if (picked !== null || !tried) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  return (
    <Stage eyebrow={tr({ uz: 'Modul · kirish', ru: 'Модуль · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Bitta xarid sayti ortida <span className="italic" style={{ color: T.accent }}>nechta qism</span> ishlaydi?</>, ru: <>Сколько <span className="italic" style={{ color: T.accent }}>частей</span> работает за одним интернет-магазином?</> })}
        mentor={<Mentor>{tr({ uz: "Foydalanuvchi faqat sahifani ko'radi. Tugmani bosing — sahifa ortini ochamiz.", ru: 'Пользователь видит только страницу. Нажмите кнопку — заглянем за неё.' })}</Mentor>}
        maket={<>
          {!tried
            ? <SiteMock />
            : <div className="fade-step"><SysMap nodes={{ user: 'ochiq', ...hamma(QISMLAR, 'kul') }} edges={hamma([...ASOSIY_YOL, ek('back', 'ai'), ek('back', 'bot')], 'kul')} izoh={{ user: tr({ uz: "sahifani ko'radi", ru: 'видит страницу' }) }} /></div>}
          <QTugma ikkinchi onClick={poke} disabled={tried}>{tried ? tr({ uz: '✓ Ochildi: ortida 5 qism', ru: '✓ Открыто: за ней 5 частей' }) : tr({ uz: '▶ Ortida nima bor?', ru: '▶ Что там за ней?' })}</QTugma>
        </>}
        savol={tr({ uz: 'Sayt aslida nima?', ru: 'Что такое сайт на самом деле?' })}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.label) }))} tanlov={picked} onTanla={pick} yopiq={!tried}
        javob={picked !== null && <p className="hook-ack fade-step">{picked === 'b'
          ? tr({ uz: <><b>Aynan!</b> Sayt — bu tizim: beshta qism birga ishlaydi.</>, ru: <><b>Именно!</b> Сайт — это система: пять частей работают вместе.</> })
          : tr({ uz: <><b>Qiziq fikr!</b> Ekranda bitta sahifa, lekin ortida beshta qism birga ishlaydi.</>, ru: <><b>Интересная мысль!</b> На экране одна страница, но за ней вместе работают пять частей.</> })}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja: «01 · matn · teg» standarti; chapda yo'l bo'ylab yurgan so'rov) =====
const REJA = [
  { t: { uz: 'Tizimning 5 qismi — har biri nima qiladi', ru: '5 частей системы — что делает каждая' }, teg: { uz: 'qismlar', ru: 'части' } },
  { t: { uz: "So'rov qanday yuradi", ru: 'Как идёт запрос' }, teg: { uz: "so'rov yo'li", ru: 'путь запроса' } },
  { t: { uz: "Ko'p kirish yo'li, bitta tizim", ru: 'Много точек входа, одна система' }, teg: 'web · bot · mobil' },
  { t: { uz: "O'z loyihangiz chizmasi", ru: 'Схема вашего проекта' }, teg: { uz: 'chizma', ru: 'схема' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun qismlarni <span className="italic" style={{ color: T.accent }}>bitta tizimga</span> ulaymiz.</>, ru: <>Сегодня соединим части <span className="italic" style={{ color: T.accent }}>в одну систему</span>.</> })}
      mentor={<Mentor>{tr({ uz: "Oldingi modullarda har qismni alohida qurdingiz. Endi ularni bitta chizmada ko'ramiz — buni arxitektura deyishadi.", ru: 'В прошлых модулях вы строили каждую часть отдельно. Теперь увидим их на одной схеме — это называют архитектурой.' })}</Mentor>}
      chapYorliq={tr({ uz: "Dars oxirida shu chizmani o'zingiz yig'asiz", ru: 'В конце урока вы сами соберёте эту схему' })}
      chap={<><SysMap aylanma nodes={hamma(['user', 'front', 'back', 'db'], 'ochiq')} edges={hamma(ASOSIY_YOL, 'on')} vazifa /><QIzoh>{tr({ uz: "So'rov yo'l bo'ylab boradi, javob yashil bo'lib qaytadi.", ru: 'Запрос идёт по пути, ответ возвращается зелёным.' })}</QIzoh></>}
      ongYorliq={tr({ uz: 'Bugungi 4 qadam', ru: '4 шага на сегодня' })}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}
    />
  </Stage>
);

// ===== SCREEN 2 — TUSHUNCHA · 5 qism (maketdagi joy → xaritadagi tugun) =====
// tugadi={false} — ataylab: maket va xarita juftligi natijaning o'zi (foydalanuvchi: «ancha yaxshi», F-1004-49)
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [seen, setSeen] = useState(() => new Set(storedAnswer ? QISMLAR : []));
  const [last, setLast] = useState(null);
  const [sc, setSc] = useState(0);
  const done = seen.size >= QISMLAR.length;
  const joy = (id) => { setLast(id); setSeen(prev => new Set(prev).add(id)); setSc(n => n + 1); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const nodes = { user: 'ochiq', ...Object.fromEntries(QISMLAR.map(id => [id, !seen.has(id) ? 'kul' : id === last && !done ? 'joriy' : 'ochiq'])) };
  const edges = Object.fromEntries([...ASOSIY_YOL, ek('back', 'ai'), ek('back', 'bot')].map(k => [k, k.split('-').every(id => id === 'user' || seen.has(id)) ? 'on' : 'kul']));
  const L = last && SYS_BY[last];
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · 5 qism', ru: 'Понятие · 5 частей' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: '5 qismni toping', ru: 'Найдите 5 частей' })} (${seen.size}/5)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={false}
        sarlavha={tr({ uz: <>Sayt ortidagi har qism <span className="italic" style={{ color: T.accent }}>nima qiladi?</span></>, ru: <>Что <span className="italic" style={{ color: T.accent }}>делает</span> каждая часть за сайтом?</> })}
        mentor={<Mentor>{tr({ uz: "Maketdagi narsani bosing — u qaysi qismning ishi ekanini xarita ko'rsatadi.", ru: 'Нажмите на элемент макета — карта покажет, какая часть за него отвечает.' })}</Mentor>}
        harakat={<SiteMock savat={seen.has('db') ? 2 : 0} jami={seen.has('back')} pufak telegram joylar={new Set(QISMLAR.filter(id => !seen.has(id)))} ochildi={seen} onJoy={joy} />}
        vizual={<>
          <SysMap nodes={nodes} edges={edges} vazifa />
          {L && !done && <QIzoh>{tr(L.nom)}{L.tex ? ` · ${L.tex}` : ''} — {tr(L.ish)}</QIzoh>}
        </>}
        xulosa={done && tr({ uz: "Beshta qism — bitta tizim: uchtasi asosiy, AI va Bot qo'shimcha.", ru: 'Пять частей — одна система: три основные, AI и Bot — дополнительные.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — TAJRIBA · so'rov yo'li (bashorat → so'rov ham, javob ham bosqichma-bosqich bosib yuriladi, F-1004-51) =====
const YOL3 = [
  { kut: 'front', dan: 'user', qadam: { uz: 'Foydalanuvchi «Savatga» bosdi', ru: 'Пользователь нажал «В корзину»' }, izoh: { uz: 'Frontend bosishni qabul qildi.', ru: 'Frontend принял нажатие.' } },
  { kut: 'back', dan: 'front', qadam: { uz: "Frontend → Backend: so'rov", ru: 'Frontend → Backend: запрос' }, izoh: { uz: "Backend so'rovni (request) qabul qildi va tekshirdi.", ru: 'Backend принял запрос (request) и проверил его.' } },
  { kut: 'db', dan: 'back', qadam: { uz: 'Backend → Database: yozish', ru: 'Backend → Database: запись' }, izoh: { uz: 'Database buyurtmani saqladi.', ru: 'Database сохранила заказ.' } },
  { kut: 'back', dan: 'db', javob: true, qadam: { uz: 'Database → Backend: javob', ru: 'Database → Backend: ответ' }, izoh: { uz: 'Database «saqlandi» deb javob qaytardi.', ru: 'Database ответила: «сохранено».' } },
  { kut: 'front', dan: 'back', javob: true, qadam: { uz: 'Backend → Frontend: ekran yangilandi', ru: 'Backend → Frontend: экран обновился' }, izoh: { uz: 'Backend javob (response) qaytardi — savatda 1 ta.', ru: 'Backend вернул ответ (response) — в корзине 1.' } },
];
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(storedAnswer ? YOL3.length : 0);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(null);
  const [sc, setSc] = useState(0);
  const done = n >= YOL3.length;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  const tRef = useRef(null);
  useEffect(() => () => clearTimeout(tRef.current), []);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const konvert = n === 0 ? 'user' : YOL3[n - 1].kut;
  const javobda = n >= 3;
  const bos = (id) => {
    if (done) return;
    if (id !== YOL3[n].kut) {
      setXato(javobda
        ? tr({ uz: "Javob ham shu yo'l bilan orqaga qaytadi.", ru: 'Ответ возвращается тем же путём.' })
        : konvert === 'front' && id === 'db'
          ? tr({ uz: "Bizning tizimda Frontend Database'ga to'g'ridan bormaydi.", ru: 'В нашей системе Frontend не ходит в Database напрямую.' })
          : tr({ uz: "Konvert chiziq bo'ylab keyingi qismga yuradi.", ru: 'Конверт идёт по линии к следующей части.' }));
      setSilk(id); clearTimeout(tRef.current); tRef.current = setTimeout(() => setSilk(null), 340);
      return;
    }
    setXato(null); setN(n + 1); setSc(s => s + 1);
  };
  // so'rov o'tgan chiziq — oqim (on); javob qaytgan chiziq — yashil (ok)
  const holat = (a, b) => {
    const k = ek(a, b);
    const javobOtdi = YOL3.some((q, i) => i < n && q.javob && ek(q.dan, q.kut) === k);
    const sorovOtdi = YOL3.some((q, i) => i < n && !q.javob && ek(q.dan, q.kut) === k);
    return javobOtdi || (done && k === ek('user', 'front')) ? 'ok' : sorovOtdi ? 'on' : 'kul';
  };
  const edges = { [ek('user', 'front')]: holat('user', 'front'), [ek('front', 'back')]: holat('front', 'back'), [ek('back', 'db')]: holat('back', 'db') };
  const nodes = { user: 'ochiq', front: 'ochiq', back: 'ochiq', db: 'ochiq', [konvert]: done ? 'ok' : 'joriy' };
  const TAXMIN = [{ k: 'db', t: tr({ uz: "Database'ga", ru: 'В Database' }) }, { k: 'back', t: tr({ uz: "Backend'ga", ru: 'В Backend' }) }];
  return (
    <Stage eyebrow={tr({ uz: "Tajriba · so'rov yo'li", ru: 'Опыт · путь запроса' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : `${tr({ uz: "Yo'lni yuring", ru: 'Пройдите путь' })} (${n}/${YOL3.length})`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>«Savatga» bosilgach so'rov <span className="italic" style={{ color: T.accent }}>qayerga boradi?</span></>, ru: <>Куда <span className="italic" style={{ color: T.accent }}>идёт запрос</span> после «В корзину»?</> })}
        mentor={<Mentor>{tr({ uz: "So'rovni o'zingiz yo'naltiring: har qadamda keyingi qismni bosing.", ru: 'Направьте запрос сами: на каждом шаге нажимайте следующую часть.' })}</Mentor>}
        bashorat={!taxmin && <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Frontend'dan keyin so'rov qayerga boradi?", ru: 'Куда идёт запрос после Frontend?' })} variantlar={TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        harakat={taxmin && <QKarta yorliq={tr({ uz: 'Qadamlar', ru: 'Шаги' })}>
          <QQadamlar qadamlar={YOL3.map(q => tr(q.qadam))} joriy={done ? undefined : n} />
          {n > 0 && <QIzoh>{tr(YOL3[n - 1].izoh)}</QIzoh>}
          {xato && <QXato>{xato}</QXato>}
        </QKarta>}
        vizual={taxmin && <SysMap nodes={nodes} edges={edges} konvert={konvert} konvertTur={javobda ? 'javob' : 'sorov'} bosiladi={done ? null : new Set(['user', 'front', 'back', 'db'].filter(id => id !== konvert))} onNode={bos} silk={silk} izoh={{ user: tr({ uz: `savat: ${done ? 1 : 0}`, ru: `корзина: ${done ? 1 : 0}` }) }} />}
        natija={done && taxmin && <QTaxmin togri={taxmin === 'back'}>{taxmin === 'back'
          ? tr({ uz: <>Taxminingiz to'g'ri chiqdi: Frontend'dan keyin — <b>Backend</b>.</>, ru: <>Ваше предположение верно: после Frontend — <b>Backend</b>.</> })
          : tr({ uz: <>Taxminingiz: Database · haqiqatda: <b>Backend</b></>, ru: <>Ваше предположение: Database · на деле: <b>Backend</b></> })}</QTaxmin>}
        xulosa={done && tr({ uz: "So'rov Frontend → Backend → Database yuradi, javob shu yo'l bilan qaytadi.", ru: 'Запрос идёт Frontend → Backend → Database, ответ возвращается тем же путём.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 4 — TEST 1 (INLINE_KEYS.s4 = 3) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="Mahsulotlar, buyurtmalar va foydalanuvchilar qayerda doimiy saqlanadi?"
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Mahsulotlar, buyurtmalar va foydalanuvchilar qayerda <span className="italic" style={{ color: T.accent }}>doimiy saqlanadi</span>?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Где <span className="italic" style={{ color: T.accent }}>постоянно хранятся</span> товары, заказы и пользователи?</h2></> })}
    options={[
      { uz: "Frontend'da — foydalanuvchi ularni ko'radi", ru: 'В Frontend — их видит пользователь' },
      { uz: "Backend'da — so'rovlar shu yerdan o'tadi", ru: 'В Backend — через него идут запросы' },
      { uz: "AI'da — u hamma savolga javob beradi", ru: 'В AI — он отвечает на любой вопрос' },
      { uz: "Database'da — sahifa yangilansa ham qoladi", ru: 'В Database — останутся и после обновления' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "To'g'ri! Doimiy ma'lumot Database'da (PostgreSQL) saqlanadi. Frontend ma'lumotni ko'rsatadi, Backend uni tekshirib Database'ga yozadi, saqlash esa Database'ning vazifasi.", ru: 'Верно! Постоянные данные хранятся в Database (PostgreSQL). Frontend показывает данные, Backend проверяет их и записывает в Database, а хранить их — задача Database.' }}
    explainWrong={{
      0: { uz: "Frontend ma'lumotni ko'rsatadi, lekin doimiy saqlamaydi: sahifa yangilansa, ekrandagi ma'lumot yo'qolishi mumkin.", ru: 'Frontend показывает данные, но постоянно их не хранит: после обновления страницы данные с экрана могут пропасть.' },
      1: { uz: "Backend so'rovni tekshiradi va Database'ga yozadi, lekin ma'lumotni o'zi doimiy saqlamaydi.", ru: 'Backend проверяет запрос и записывает данные в Database, но сам постоянно их не хранит.' },
      2: { uz: "AI maslahat beradi, lekin ma'lumotni saqlamaydi.", ru: 'AI даёт советы, но данные не хранит.' },
      default: { uz: "Doimiy ma'lumot Database'da (PostgreSQL) saqlanadi.", ru: 'Постоянные данные хранятся в Database (PostgreSQL).' }
    }} />
);

// ===== SCREEN 8 — TEST 2 (INLINE_KEYS.s8 = 0) =====
const Screen8 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Foydalanuvchi «Savatga» bosdi. So'rov qaysi yo'l bilan boradi?"
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Foydalanuvchi «Savatga» bosdi. So'rov qaysi <span className="italic" style={{ color: T.accent }}>yo'l</span> bilan boradi?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Пользователь нажал «В корзину». Каким <span className="italic" style={{ color: T.accent }}>путём</span> пойдёт запрос?</h2></> })}
    options={[
      { uz: "Frontend → Backend → Database, javob orqaga qaytadi", ru: 'Frontend → Backend → Database, ответ возвращается обратно' },
      { uz: "Frontend → Database, Backend'ni chetlab o'tadi", ru: 'Frontend → Database, в обход Backend' },
      { uz: "Frontend ichida qoladi, hech qayerga chiqmaydi", ru: 'Остаётся внутри Frontend и никуда не уходит' },
      { uz: "Database → Backend → Frontend, teskari yo'nalishda", ru: 'Database → Backend → Frontend, в обратную сторону' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "To'g'ri! So'rov Frontend'dan Backend'ga, undan Database'ga boradi; javob esa shu yo'l bilan ekranga qaytadi. Bizning tizimda Frontend Database bilan to'g'ridan ishlamaydi — hamma so'rov Backend orqali o'tadi.", ru: 'Верно! Запрос идёт из Frontend в Backend, а оттуда в Database; ответ тем же путём возвращается на экран. В нашей системе Frontend не работает с Database напрямую — все запросы проходят через Backend.' }}
    explainWrong={{
      1: { uz: "Bizning tizimda Frontend Database'ga to'g'ridan ulanmaydi: so'rovni Backend tekshiradi, parol va qoidalar ham Backend'da turadi.", ru: 'В нашей системе Frontend не подключается к Database напрямую: запрос проверяет Backend, и пароли с правилами тоже находятся в Backend.' },
      2: { uz: "So'rov Frontend ichida qolsa, hech narsa saqlanmaydi. U Backend va Database'ga borishi kerak.", ru: 'Если запрос останется внутри Frontend, ничего не сохранится. Он должен дойти до Backend и Database.' },
      3: { uz: "Yo'nalish teskari: avval Frontend so'rov yuboradi, keyin Backend va Database ishlaydi. Javob esa orqaga qaytadi.", ru: 'Направление обратное: сначала Frontend отправляет запрос, потом работают Backend и Database. А ответ возвращается назад.' },
      default: { uz: "Frontend → Backend → Database, javob orqaga qaytadi.", ru: 'Frontend → Backend → Database, ответ возвращается обратно.' }
    }} />
);

// ===== SCREEN 11 — TEST 3 (INLINE_KEYS.s11 = 2) =====
const Screen11 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="Web sayt va bot bir xil buyurtmalarni ko'rishi uchun nima qilinadi?"
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Web sayt va bot <span className="italic" style={{ color: T.accent }}>bir xil</span> buyurtmalarni ko'rishi uchun nima qilinadi?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Что нужно сделать, чтобы веб-сайт и бот видели <span className="italic" style={{ color: T.accent }}>одни и те же</span> заказы?</h2></> })}
    options={[
      { uz: "Har biri uchun alohida Database quriladi", ru: 'Для каждого строится отдельная Database' },
      { uz: "Ma'lumot har biriga qo'lda ko'chiriladi", ru: 'Данные копируют в каждый вручную' },
      { uz: "Ikkalasi bitta Backend va Database'ga ulanadi", ru: 'Оба подключаются к одному Backend и Database' },
      { uz: "Buning iloji yo'q — ular alohida ishlaydi", ru: 'Это невозможно — они работают отдельно' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "To'g'ri! Web va bot — ikki xil kirish yo'li, lekin ikkalasi bitta Backend va Database'ga ulanadi. Shuning uchun bir joyda berilgan buyurtma boshqasida ham ko'rinadi. Mobil ilova ham xuddi shunday ulanadi.", ru: 'Верно! Веб-сайт и бот — две разные точки входа, но оба подключены к одному Backend и Database. Поэтому заказ, сделанный в одном месте, виден и в другом. Мобильное приложение подключается точно так же.' }}
    explainWrong={{
      0: { uz: "Alohida Database bo'lsa, ma'lumot bo'linib ketadi. To'g'risi — bitta umumiy Backend va Database.", ru: 'С отдельной Database данные разделятся. Правильно — один общий Backend и Database.' },
      1: { uz: "Qo'lda ko'chirish sekin va xatoga olib keladi. Bitta umumiy Database'ga ulansa, ma'lumot o'zi bir xil bo'ladi.", ru: 'Ручное копирование медленное и ведёт к ошибкам. Если подключиться к одной общей Database, данные совпадут сами.' },
      3: { uz: "Aksincha, bu oson: ikkala kirish yo'lini bitta Backend'ga ulaysiz.", ru: 'Наоборот, это просто: обе точки входа вы подключаете к одному Backend.' },
      default: { uz: "Bitta Backend va Database — ko'p kirish yo'li.", ru: 'Один Backend и Database — много точек входа.' }
    }} />
);

// ===== SCREEN 14 — TEST 4 (mobil ko'prik, INLINE_KEYS.s14 = 3) =====
const Screen14 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="Web tizimingizga mobil ilova qo'shmoqchisiz. Eng kam ish bilan qanday qilasiz?"
    question={tr({ uz: <><p className="eyebrow" style={{ color: T.accent }}>To'g'ri javobni tanlang</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Web tizimingizga <span className="italic" style={{ color: T.accent }}>mobil ilova</span> qo'shmoqchisiz. Eng kam ish bilan qanday qilasiz?</h2></>, ru: <><p className="eyebrow" style={{ color: T.accent }}>Выберите верный ответ</p><h2 className="title h-ask" style={{ marginTop: 8 }}>Хотите добавить к своей веб-системе <span className="italic" style={{ color: T.accent }}>мобильное приложение</span>. Как сделать это с наименьшими усилиями?</h2></> })}
    options={[
      { uz: "Hammasini noldan: yangi Frontend, Backend, Database", ru: 'Всё с нуля: новые Frontend, Backend, Database' },
      { uz: "Mobil ilova uchun alohida Database quraman", ru: 'Построю для мобильного отдельную Database' },
      { uz: "Iloji yo'q — mobil ilova butunlay boshqa narsa", ru: 'Невозможно — мобильное приложение совсем другое' },
      { uz: "Mobil Frontend yozib, bor Backend'ga ulayman", ru: 'Напишу мобильный Frontend и подключу к готовому Backend' }
    ]} correctIdx={3}
    explainCorrect={{ uz: "To'g'ri! Backend va Database tayyor — ular har qanday kirish yo'li bilan ishlaydi. Mobil ilova — yana bir Frontend (React Native), u o'sha Backend'ga ulanadi. Arxitekturani tushunsangiz, ish ancha kamayadi.", ru: 'Верно! Backend и Database уже готовы — они работают с любой точкой входа. Мобильное приложение — ещё один Frontend (React Native), и он подключается к тому же Backend. Если понимаете архитектуру, работы становится намного меньше.' }}
    explainWrong={{
      0: { uz: "Backend va Database'ni qayta yozish shart emas — ular tayyor. Faqat yangi Frontend qo'shasiz.", ru: 'Переписывать Backend и Database не нужно — они уже готовы. Вы добавляете только новый Frontend.' },
      1: { uz: "Alohida Database ma'lumotni bo'lib yuboradi. Mobil ilova o'sha umumiy Database bilan ishlashi kerak.", ru: 'Отдельная Database разделит данные. Мобильное приложение должно работать с той же общей Database.' },
      2: { uz: "Aksincha — mobil ilova ham yana bir Frontend. Shu modulning 9–11-darslarida aynan shuni qilamiz.", ru: 'Наоборот — мобильное приложение тоже ещё один Frontend. Именно этим мы займёмся на 9–11-м уроках этого модуля.' },
      default: { uz: "Yangi Frontend yozib, mavjud Backend va Database'ga ulaysiz.", ru: 'Пишете новый Frontend и подключаете его к существующим Backend и Database.' }
    }} />
);

// ===== SCREEN 15 — YAKUNIY: ma'lumot yo'lini to'g'ri tartibda yig'ish (qolip QTartib) =====
const Screen15 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  // Ball — birinchi TO'LIQ urinish (MCQ bilan bir xil o'lchov, 8-A): hamma katak to'lib tartib xato chiqsa — urinish xato
  const achMiss = useContext(AchMissCtx);
  const wrongEverRef = useRef(false);
  const onWrong = () => { wrongEverRef.current = true; if (achMiss) achMiss.miss(screen); };
  // label — {uz,ru} obyekt (shablon-stringga obyekt qo'shilsa «[object Object]» chiqardi)
  const items = FLOW.map(f => ({ id: f.id, label: { uz: `${f.label.uz}`, ru: `${f.label.ru}` } }));
  const hints = [
    { uz: "tugmani bosadi", ru: 'нажимает кнопку' },
    { uz: "ko'rsatadi va so'rov yuboradi", ru: 'показывает и отправляет запрос' },
    { uz: "tekshiradi va hisoblaydi", ru: 'проверяет и считает' },
    { uz: "doimiy saqlaydi", ru: 'хранит постоянно' },
    { uz: "javob ekranga qaytadi", ru: 'ответ возвращается на экран' }
  ];
  const firedRef = useRef(!!storedAnswer);
  const [done, setDone] = useState(!!storedAnswer);
  const [recapOpen, setRecapOpen] = useState(false);
  const solve = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setDone(true);
    const first = !wrongEverRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Ma'lumot yo'lini to'g'ri tartibda yig'ing", options: FLOW.map(f => ou(f.label)), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · amaliy', ru: 'Итог · практика' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Yo'lni yig'ing", ru: 'Соберите путь' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ma'lumot yo'lini <span className="italic" style={{ color: T.accent }}>to'g'ri tartibda</span> yig'ing.</>, ru: <>Соберите путь данных <span className="italic" style={{ color: T.accent }}>в правильном порядке</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Foydalanuvchi tugmani bosganda ma'lumot qayerdan qayerga boradi? Bo'laklarni to'g'ri joyiga qo'ying.", ru: 'Куда идут данные, когда пользователь нажимает кнопку? Разложите блоки по правильным местам.' })}</Mentor>
        <Zoomable>
          <QTartib onWrong={onWrong}
            items={items.map(x => ({ id: x.id, label: tr(x.label) }))}
            hints={hints.map(h => tr(h))}
            onSolved={solve}
            xatoMatn={tr({ uz: "Tartib xato — bo'lakni bosib qaytaring va qayta joylang.", ru: 'Порядок неверный — нажмите на блок, чтобы вернуть его, и разложите заново.' })}
          />
        </Zoomable>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Yo'l tayyor: <b>Foydalanuvchi → Frontend → Backend → Database → ekran</b>.</>, ru: <>Путь готов: <b>Пользователь → Frontend → Backend → Database → экран</b>.</> })}</p>
          {wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== SCREEN 5 — CHEGARA · Frontend yoki Backend? (ishni o'z tomoniga joylash → oyna/server jonlanadi, F-1004-52/53) =====
const ISHLAR5 = [
  { id: 'tugma', tomon: 'front', t: { uz: "Tugmani ko'rsatadi", ru: 'Показывает кнопку' }, xato: { uz: "Tugma ekranda ko'rinadi — bu Frontend ishi.", ru: 'Кнопка видна на экране — это работа Frontend.' } },
  { id: 'narx', tomon: 'back', t: { uz: 'Narxni hisoblaydi', ru: 'Считает цену' }, xato: { uz: "Narxni foydalanuvchi o'zgartira olmasin — bu Backend ishi.", ru: 'Пользователь не должен менять цену — это работа Backend.' } },
  { id: 'rasm', tomon: 'front', t: { uz: "Rasmni ko'rsatadi", ru: 'Показывает картинку' }, xato: { uz: "Rasm ekranda ko'rinadi — bu Frontend ishi.", ru: 'Картинка видна на экране — это работа Frontend.' } },
  { id: 'parol', tomon: 'back', t: { uz: 'Parolni tekshiradi', ru: 'Проверяет пароль' }, xato: { uz: 'Parolni brauzerda tekshirish xavfli — bu Backend ishi.', ru: 'Проверять пароль в браузере опасно — это работа Backend.' } },
  { id: 'savat', tomon: 'front', t: { uz: 'Savatni chizadi', ru: 'Рисует корзину' }, xato: { uz: "Savat ekranda ko'rinadi — bu Frontend ishi.", ru: 'Корзина видна на экране — это работа Frontend.' } },
  { id: 'yoz', tomon: 'back', t: { uz: "Buyurtmani Database'ga yozadi", ru: 'Записывает заказ в Database' }, xato: { uz: 'Database bilan faqat Backend gaplashadi.', ru: 'С Database разговаривает только Backend.' } },
];
const SERVER_QATOR = { narx: 'narx = 2 500 000 + 300 000\n     = 2 800 000', parol: "parol tekshirildi: to'g'ri", yoz: 'INSERT buyurtma → Database' };
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [joyda, setJoyda] = useState(() => new Set(storedAnswer ? ISHLAR5.map(x => x.id) : []));
  const [tanlangan, setTanlangan] = useState(null);
  const [xato, setXato] = useState(null);
  const [silk, setSilk] = useState(null);
  const [oxirgi, setOxirgi] = useState(null);
  const done = joyda.size >= ISHLAR5.length;
  const tugadi = useTugadi(done, 1000, !!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const qoy = (tomon) => {
    const x = ISHLAR5.find(i => i.id === tanlangan); if (!x) return;
    if (x.tomon !== tomon) { setXato(tr(x.xato)); setSilk(x.id); setTimeout(() => setSilk(null), 340); setTanlangan(null); return; }
    setXato(null); setJoyda(prev => new Set(prev).add(x.id)); setOxirgi(x.id); setTanlangan(null);
  };
  const qolgan = ISHLAR5.filter(x => !joyda.has(x.id));
  const bor = (id) => joyda.has(id);
  const yangi = (id) => (oxirgi === id ? ' fb-yangi' : '');
  return (
    <Stage eyebrow={tr({ uz: 'Chegara · Frontend va Backend', ru: 'Граница · Frontend и Backend' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: '6 ishni joylang', ru: 'Разложите 6 задач' })} (${joyda.size}/6)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} vizualAvval={false}
        sarlavha={tr({ uz: <>Bu ishni Frontend qiladimi yoki <span className="italic" style={{ color: T.accent }}>Backend?</span></>, ru: <>Эту работу делает Frontend или <span className="italic" style={{ color: T.accent }}>Backend?</span></> })}
        mentor={<Mentor>{tr({ uz: "Boshida ko'pchilik shu ikkisini adashtiradi. Ishni bosing, keyin uning tomonini bosing.", ru: 'Поначалу многие их путают. Нажмите на задачу, потом — на её сторону.' })}</Mentor>}
        harakat={<QKarta yorliq={tr({ uz: 'Ishlar', ru: 'Задачи' })}>
          {qolgan.length > 0 && <div className="q-col" style={{ gap: 7 }}>
            {qolgan.map(x => <QChip key={x.id} holat={tanlangan === x.id ? 'on' : undefined} silk={silk === x.id} onClick={() => { setTanlangan(x.id); setXato(null); }}>{tr(x.t)}</QChip>)}
          </div>}
          {tanlangan && <QIzoh>{tr({ uz: 'Endi tomonni bosing: brauzer yoki server.', ru: 'Теперь нажмите сторону: браузер или сервер.' })}</QIzoh>}
          {xato && <QXato>{xato}</QXato>}
        </QKarta>}
        vizual={<div className={`fb-ikki${tanlangan ? ' tanlov' : ''}${done ? ' tayyor' : ''}`}>
          <button type="button" className={`fb-tomon fb-brauzer${tanlangan ? ' q-halqa' : ''}`} disabled={!tanlangan} onClick={() => qoy('front')}>
            <span className="fb-bar"><span className="sw-dots"><i /><i /><i /></span><span className="fb-url">onlayn-xarid.uz</span></span>
            <span className="fb-tana">
              <span className="fb-nom">Frontend · {tr({ uz: 'brauzer', ru: 'браузер' })}</span>
              {bor('rasm') ? <span className={`fb-rasm${yangi('rasm')}`}><svg viewBox="0 0 40 24" width="40" height="24" aria-hidden="true"><path d="M2 22l10-12 8 8 6-6 12 10z" fill="currentColor" opacity="0.35" /><circle cx="31" cy="6" r="3" fill="currentColor" opacity="0.5" /></svg>{tr({ uz: 'Telefon', ru: 'Телефон' })}</span> : <span className="fb-skelet" />}
              {bor('savat') ? <span className={`fb-savat${yangi('savat')}`}>{tr({ uz: 'Savat', ru: 'Корзина' })} <b>2</b></span> : <span className="fb-skelet qisqa" />}
              {bor('tugma') ? <span className={`fb-tugma${yangi('tugma')}`}>{tr({ uz: 'Savatga', ru: 'В корзину' })}</span> : <span className="fb-skelet tugma" />}
            </span>
          </button>
          <span className={`fb-api${done ? ' on' : ''}`} aria-hidden="true"><span className="fb-api-t">API</span>{done && <><i className="fb-paket" /><i className="fb-paket qayt" /></>}</span>
          <button type="button" className={`fb-tomon fb-server${tanlangan ? ' q-halqa' : ''}`} disabled={!tanlangan} onClick={() => qoy('back')}>
            <span className="fb-sbar"><span className={`fb-led${joyda.size ? ' on' : ''}`} />Backend · server</span>
            <span className="fb-log">
              {['narx', 'parol', 'yoz'].map(id => bor(id) ? <span key={id} className={`fb-qator${yangi(id)}`}>{SERVER_QATOR[id]}</span> : <span key={id} className="fb-qator bosh">…</span>)}
            </span>
          </button>
        </div>}
        xulosa={done && tr({ uz: "Ko'rinadigani — Frontend, qoida va hisob — Backend; ular API orqali gaplashadi.", ru: 'Видимое — Frontend, правила и расчёты — Backend; они общаются через API.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 6 — TAJRIBA · Database = xotira (bashorat → sahifani yangilash) =====
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [yangi, setYangi] = useState(!!storedAnswer);
  const [mil, setMil] = useState(false);
  const tugadi = useTugadi(yangi, 700, !!storedAnswer);
  useEffect(() => { if (yangi && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [yangi]); // eslint-disable-line
  const yangila = () => { setMil(true); setTimeout(() => { setMil(false); setYangi(true); }, 420); };
  const TAXMIN = [
    { k: 'ikkalasi', t: tr({ uz: 'Ikkalasida ham qoladi', ru: 'Останется в обоих' }) },
    { k: 'dbsiz', t: tr({ uz: "Database'sizda yo'qoladi", ru: 'Пропадёт там, где нет Database' }) },
    { k: 'yoq', t: tr({ uz: "Ikkalasida ham yo'qoladi", ru: 'Пропадёт в обоих' }) },
  ];
  const tx = TAXMIN.find(t => t.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tajriba · Database', ru: 'Опыт · Database' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!yangi} label={yangi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : tr({ uz: 'Sahifani yangilang', ru: 'Обновите страницу' })} onClick={onNext} /></>}>
      <QTushuncha keng zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Sahifani yangilasangiz, savat <span className="italic" style={{ color: T.accent }}>nima bo'ladi?</span></>, ru: <>Что будет с корзиной, если <span className="italic" style={{ color: T.accent }}>обновить страницу?</span></> })}
        mentor={<Mentor>{tr({ uz: 'Ikki saytni solishtiring: birida Database yo\'q, birida bor.', ru: 'Сравните два сайта: в одном нет Database, в другом есть.' })}</Mentor>}
        bashorat={!taxmin && <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: 'Ikkala saytda savat nima bo\'ladi?', ru: 'Что будет с корзиной на обоих сайтах?' })} variantlar={TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        vizual={taxmin && <div className="db-ikki">
          <div className="q-col"><span className="q-yorliq">{tr({ uz: "Database'siz", ru: 'Без Database' })}</span><SiteMock savat={yangi ? 0 : 2} miltilla={mil} /></div>
          <div className="q-col"><span className="q-yorliq">{tr({ uz: 'Database bilan · PostgreSQL', ru: 'С Database · PostgreSQL' })}</span><SiteMock savat={2} miltilla={mil} />{yangi && <span className="db-saqladi fade-step">{tr({ uz: 'Database: savat saqlandi', ru: 'Database: корзина сохранена' })}</span>}</div>
        </div>}
        harakat={taxmin && !yangi && <QTugma onClick={yangila} disabled={mil}>{tr({ uz: 'Sahifani yangilash', ru: 'Обновить страницу' })}</QTugma>}
        natija={yangi && tx && <QTaxmin togri={taxmin === 'dbsiz'}>{taxmin === 'dbsiz'
          ? tr({ uz: <>Taxminingiz to'g'ri chiqdi: <b>Database'sizda yo'qoldi</b>.</>, ru: <>Ваше предположение верно: <b>пропала там, где нет Database</b>.</> })
          : <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {tx.t} · {tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{tr({ uz: "Database'sizda yo'qoldi", ru: 'пропала там, где нет Database' })}</b></>}</QTaxmin>}
        xulosa={yangi && tr({ uz: "Database'ga yozilgan ma'lumot qoladi, faqat ekranda turgani yo'qoladi.", ru: 'Данные, записанные в Database, остаются; пропадает только то, что было на экране.' })}
      />
    </Stage>
  );
};

// Telegram chat maketi (7, 10-ekran): sarlavha · kelgan xabar · yuborilgan xabar
const TgMock = ({ yubordi, matn, son }) => (
  <div className="tg-mock">
    <div className="tg-bar"><span className="tg-ava">OX</span><span className="tg-nomi">onlayn-xarid bot</span></div>
    <div className="tg-tana">
      <span className="tg-xabar kel">{tr({ uz: 'Nima buyurtma qilasiz?', ru: 'Что будете заказывать?' })}</span>
      {yubordi && <span className="tg-xabar men" key={matn}>{matn}</span>}
    </div>
    {son != null && <div className="tg-db">Database · {tr({ uz: 'buyurtmalar', ru: 'заказов' })}: <b key={son}>{son}</b></div>}
  </div>
);

// ===== SCREEN 7 — TUSHUNCHA · AI va Bot qayerga ulanadi? (xaritada ulash → sayt va chat o'zgaradi) =====
const Screen7 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [ulangan, setUlangan] = useState(() => new Set(storedAnswer ? ['ai', 'bot'] : []));
  const [qism, setQism] = useState(null);
  const [yomon, setYomon] = useState(null);
  const [xato, setXato] = useState(null);
  const done = ulangan.size >= 2;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  const tRef = useRef(null);
  useEffect(() => () => clearTimeout(tRef.current), []);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const bos = (id) => {
    if (id === 'ai' || id === 'bot') { setQism(id); setXato(null); return; }
    if (!qism) return;
    if (id === 'back') { setUlangan(prev => new Set(prev).add(qism)); setQism(null); setXato(null); return; }
    setYomon(ek(qism, id)); clearTimeout(tRef.current); tRef.current = setTimeout(() => setYomon(null), 1200);
    setXato(qism === 'ai'
      ? tr({ uz: "AI'ni Backend chaqiradi — kalit va qoidalar shu yerda.", ru: 'AI вызывает Backend — ключ и правила здесь.' })
      : tr({ uz: "Bot ham Backend orqali ishlaydi — Database'ga o'zi yozmaydi.", ru: 'Бот тоже работает через Backend — в Database сам не пишет.' }));
    setQism(null);
  };
  const nodes = { user: 'ochiq', front: 'ochiq', back: 'ochiq', db: 'ochiq', ai: ulangan.has('ai') ? 'ok' : qism === 'ai' ? 'joriy' : 'ochiq', bot: ulangan.has('bot') ? 'ok' : qism === 'bot' ? 'joriy' : 'ochiq' };
  const edges = { ...hamma(ASOSIY_YOL, 'kul'), ...(ulangan.has('ai') ? { [ek('back', 'ai')]: 'ok yangi' } : {}), ...(ulangan.has('bot') ? { [ek('back', 'bot')]: 'ok yangi' } : {}), ...(yomon ? { [yomon]: 'err' } : {}) };
  const bosiladi = done ? null : new Set(qism ? ['front', 'back', 'db', ...['ai', 'bot'].filter(x => !ulangan.has(x))] : ['ai', 'bot'].filter(x => !ulangan.has(x)));
  return (
    <Stage eyebrow={tr({ uz: "Qo'shimcha qismlar · AI va Bot", ru: 'Дополнительные части · AI и Bot' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Ikkalasini ulang', ru: 'Подключите обе' })} (${ulangan.size}/2)`} onClick={onNext} /></>}>
      <QTushuncha keng harakatAvval zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>AI va Bot tizimning <span className="italic" style={{ color: T.accent }}>qaysi qismiga</span> ulanadi?</>, ru: <>К <span className="italic" style={{ color: T.accent }}>какой части</span> системы подключаются AI и Bot?</> })}
        mentor={<Mentor>{tr({ uz: "Ikkala qismni xaritaga ulang va saytda nima o'zgarishini ko'ring.", ru: 'Подключите обе части к карте и посмотрите, что изменится на сайте.' })}</Mentor>}
        harakat={<>
          <QIzoh>{qism
            ? tr({ uz: `${qism === 'ai' ? 'AI' : 'Bot'} tanlandi — endi u ulanadigan qismni bosing.`, ru: `Выбран ${qism === 'ai' ? 'AI' : 'Bot'} — теперь нажмите часть, к которой он подключается.` })
            : tr({ uz: 'Xaritada AI yoki Bot tugunini bosing.', ru: 'Нажмите на карте узел AI или Bot.' })}</QIzoh>
          {xato && <QXato>{xato}</QXato>}
        </>}
        vizual={<div className="ai-ikki">
          <SysMap nodes={nodes} edges={edges} bosiladi={bosiladi} onNode={bos} />
          <div className="q-col">
            <SiteMock savat={1} pufak={ulangan.has('ai')} />
            <TgMock yubordi={ulangan.has('bot')} matn={tr({ uz: 'Telefon buyuraman', ru: 'Закажу телефон' })} son={ulangan.has('bot') ? 2 : 1} />
          </div>
        </div>}
        xulosa={done && tr({ uz: "AI va Bot qo'shimcha qismlar; ikkalasi ham o'sha Backend'ga ulanadi.", ru: 'AI и Bot — дополнительные части; обе подключаются к тому же Backend.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 9 — TAJRIBA · bitta qismni o'chiring (kalit → xarita va sayt o'zgaradi) =====
const OCHIR = [
  { id: 'front', qator: { uz: "Ko'radigan hech narsa yo'q.", ru: 'Смотреть не на что.' } },
  { id: 'back', qator: { uz: 'Javob kelmayapti.', ru: 'Ответ не приходит.' } },
  { id: 'db', qator: { uz: "Ma'lumot saqlanmadi: savat bo'sh.", ru: 'Данные не сохранились: корзина пуста.' } },
];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [ochiq, setOchiq] = useState(null);
  const [sinalgan, setSinalgan] = useState(() => new Set(storedAnswer ? OCHIR.map(o => o.id) : []));
  const done = sinalgan.size >= OCHIR.length;
  const tugadi = useTugadi(done, 1500, !!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  useEffect(() => { if (tugadi) setOchiq(null); }, [tugadi]); // ish tugadi — hamma qism yana yoqiladi, tizim to'liq ishlaydi
  const kalit = (id) => { setOchiq(o => (o === id ? null : id)); setSinalgan(prev => new Set(prev).add(id)); };
  const nodes = { user: 'ochiq', front: 'ok', back: 'ok', db: 'ok', ...(ochiq ? { [ochiq]: 'off' } : {}) };
  const edges = Object.fromEntries(ASOSIY_YOL.map(k => [k, ochiq && k.split('-').includes(ochiq) ? 'uzuq' : 'on']));
  const O = OCHIR.find(o => o.id === ochiq);
  return (
    <Stage eyebrow={tr({ uz: "Tajriba · qismni o'chirish", ru: 'Опыт · отключить часть' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: '3 qismni sinang', ru: 'Проверьте 3 части' })} (${sinalgan.size}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Bitta qismni o'chirsangiz, sayt <span className="italic" style={{ color: T.accent }}>nima bo'ladi?</span></>, ru: <>Что будет с сайтом, если <span className="italic" style={{ color: T.accent }}>отключить одну часть?</span></> })}
        mentor={<Mentor>{tr({ uz: 'Qismni o\'chiring va saytga qarang.', ru: 'Отключите часть и посмотрите на сайт.' })}</Mentor>}
        harakat={<QKarta yorliq={tr({ uz: "O'chirish kaliti", ru: 'Выключатель' })}>
          {OCHIR.map(o => <QChip key={o.id} holat={ochiq === o.id ? 'on' : undefined} onClick={() => kalit(o.id)}>
            {SYS_BY[o.id].nom} — {ochiq === o.id ? tr({ uz: "o'chiq", ru: 'выключен' }) : tr({ uz: 'yoqilgan', ru: 'включён' })}{sinalgan.has(o.id) && ochiq !== o.id ? ' ✓' : ''}
          </QChip>)}
        </QKarta>}
        vizual={<>
          <SysMap qator nodes={nodes} edges={edges} />
          <SiteMock holat={ochiq === 'front' ? 'bosh' : ochiq === 'back' ? 'yuklanish' : 'odatiy'} savat={ochiq === 'db' ? 0 : 2} />
          {O && <QXato>{tr(O.qator)}</QXato>}
        </>}
        xulosa={done && tr({ uz: 'Uchala asosiy qism kerak: biri ko\'rsatadi, biri boshqaradi, biri eslab qoladi.', ru: 'Нужны все три основные части: одна показывает, одна управляет, одна запоминает.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 10 — TUSHUNCHA · ko'p kirish yo'li (brauzer · Telegram · telefon → bitta Backend → bitta jadval, F-1004-54) =====
const KIRISH10 = [
  { id: 'web', nom: { uz: 'Brauzer', ru: 'Браузер' }, mahsulot: { uz: 'Telefon', ru: 'Телефон' } },
  { id: 'bot', nom: { uz: 'Telegram bot', ru: 'Telegram-бот' }, mahsulot: { uz: 'Quloqchin', ru: 'Наушники' } },
  { id: 'mobil', nom: { uz: 'Mobil ilova', ru: 'Мобильное приложение' }, mahsulot: { uz: "G'ilof", ru: 'Чехол' } },
];
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [qatorlar, setQatorlar] = useState(() => (storedAnswer ? KIRISH10.map(k => k.id) : []));
  const [oqim, setOqim] = useState(null);
  const done = qatorlar.length >= KIRISH10.length;
  const tugadi = useTugadi(done, 900, !!storedAnswer);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const ber = (id) => { if (qatorlar.includes(id) || oqim) return; setOqim(id); setTimeout(() => { setQatorlar(q => [...q, id]); setOqim(null); }, 750); };
  const tugma = (k) => <QChip holat={qatorlar.includes(k.id) ? 'ok' : undefined} disabled={qatorlar.includes(k.id) || !!oqim} className={qatorlar.includes(k.id) ? '' : 'q-halqa'} onClick={() => ber(k.id)}>{qatorlar.includes(k.id) ? tr({ uz: '✓ Yuborildi', ru: '✓ Отправлено' }) : tr({ uz: 'Buyurtma', ru: 'Заказать' })}</QChip>;
  const son = qatorlar.length;
  return (
    <Stage eyebrow={tr({ uz: "Tizim · ko'p kirish yo'li", ru: 'Система · много точек входа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "3 yo'ldan buyurtma bering", ru: 'Закажите 3 путями' })} (${son}/3)`} onClick={onNext} /></>}>
      <QTushuncha keng zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Saytdan va botdan berilgan buyurtma <span className="italic" style={{ color: T.accent }}>qayerga tushadi?</span></>, ru: <>Куда <span className="italic" style={{ color: T.accent }}>попадает заказ</span> с сайта и из бота?</> })}
        mentor={<Mentor>{tr({ uz: "Uchala kirish yo'lidan buyurtma bering va Database'ga qarang.", ru: 'Сделайте заказ через все три точки входа и посмотрите на Database.' })}</Mentor>}
        vizual={<div className="kr-tizim">
          <div className="kr-uch">
            {/* brauzer */}
            <div className={`kr-maket web${oqim === 'web' ? ' oqyapti' : ''}`}>
              <span className="kr-bar"><span className="sw-dots"><i /><i /><i /></span><span className="fb-url">onlayn-xarid.uz</span></span>
              <span className="kr-tana">
                <span className="kr-mahsulot">{tr(KIRISH10[0].mahsulot)}<b>2 500 000</b></span>
                {tugma(KIRISH10[0])}
              </span>
              {oqim === 'web' && <i className="kr-uchish" />}
            </div>
            {/* Telegram */}
            <div className={`kr-maket bot${oqim === 'bot' ? ' oqyapti' : ''}`}>
              <span className="tg-bar"><span className="tg-ava">OX</span><span className="tg-nomi">onlayn-xarid bot</span></span>
              <span className="kr-tana tg-tana">
                <span className="tg-xabar kel">{tr({ uz: 'Nima buyurtma qilasiz?', ru: 'Что будете заказывать?' })}</span>
                {qatorlar.includes('bot') && <span className="tg-xabar men">{tr(KIRISH10[1].mahsulot)}</span>}
                {tugma(KIRISH10[1])}
              </span>
              {oqim === 'bot' && <i className="kr-uchish" />}
            </div>
            {/* telefon (191) */}
            <div className={`kr-maket mobil${oqim === 'mobil' ? ' oqyapti' : ''}`}>
              <span className="kr-notch" aria-hidden="true" />
              <span className="kr-appbar">onlayn-xarid</span>
              <span className="kr-tana">
                <span className="kr-mahsulot">{tr(KIRISH10[2].mahsulot)}<b>90 000</b></span>
                {tugma(KIRISH10[2])}
              </span>
              {oqim === 'mobil' && <i className="kr-uchish" />}
            </div>
          </div>
          <div className={`kr-backend${oqim ? ' on' : ''}`}><SysBelgi id="back" /> Backend · Node.js (NestJS)</div>
          <div className="kr-jadval mono">
            <span className="kr-jh"><SysBelgi id="db" /> Database · {tr({ uz: 'buyurtmalar', ru: 'заказы' })} · {son}</span>
            {son === 0 && <span className="kr-bosh">{tr({ uz: "hali bo'sh", ru: 'пока пусто' })}</span>}
            {qatorlar.map((id, i) => { const k = KIRISH10.find(x => x.id === id); return <span key={id} className={`kr-q${i === son - 1 && !tugadi ? ' yangi' : ''}`}>#{i + 1} · {id} · {tr(k.mahsulot)}</span>; })}
          </div>
        </div>}
        xulosa={done && tr({ uz: "Backend va Database bitta, kirish yo'llari ko'p. Mobil ilovani 9–11-darslarda quramiz.", ru: 'Backend и Database одни, точек входа много. Мобильное приложение построим на уроках 9–11.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 12 — CASE · ikki foydalanuvchi, bitta tizim (bashorat → qadamlar → konvert xaritada sakrab yuradi, F-1004-55) =====
const CASE12 = [
  { qadam: { uz: 'Saytdan buyurtma', ru: 'Заказ с сайта' }, izoh: { uz: "Frontend so'rovni Backend'ga yubordi.", ru: 'Frontend отправил запрос в Backend.' }, yol: ['user', 'front', 'back'], on: [ek('user', 'front'), ek('front', 'back')] },
  { qadam: { uz: 'Backend yozdi', ru: 'Backend записал' }, izoh: { uz: "Backend buyurtmani Database'ga yozdi.", ru: 'Backend записал заказ в Database.' }, yol: ['back', 'db'], on: [ek('back', 'db')], qator: '#1 · web · Telefon' },
  { qadam: { uz: 'Botdan buyurtma', ru: 'Заказ из бота' }, izoh: { uz: 'Botga «Telefon buyuraman» xabari keldi.', ru: 'В бот пришло сообщение «Закажу телефон».' }, yol: ['bot'], on: [], pufak: { bot: { uz: 'Telefon buyuraman', ru: 'Закажу телефон' } } },
  { qadam: { uz: 'Backend yozdi', ru: 'Backend записал' }, izoh: { uz: "Bot o'sha Backend orqali o'sha jadvalga yozdi.", ru: 'Бот через тот же Backend записал в ту же таблицу.' }, yol: ['bot', 'back', 'db'], on: [ek('back', 'bot')], qator: '#2 · bot · Telefon' },
  { qadam: { uz: 'AI tavsiya', ru: 'Совет AI' }, izoh: { uz: "AI ikkala xaridorga «G'ilof ham olasizmi?» deb taklif qildi.", ru: 'AI предложил обоим покупателям: «Возьмёте ещё чехол?»' }, yol: ['back', 'ai'], on: [ek('back', 'ai')], pufak: { ai: { uz: "G'ilof ham olasizmi?", ru: 'Возьмёте ещё чехол?' } } },
  { qadam: { uz: 'Natija', ru: 'Итог' }, izoh: { uz: "Ikki kirish yo'li — bitta Backend, bitta Database.", ru: 'Две точки входа — один Backend, одна Database.' }, yol: [], on: [] },
];
const CASE_HAMMA = [...ASOSIY_YOL, ek('back', 'ai'), ek('back', 'bot')];
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(storedAnswer ? CASE12.length : 0);
  const [konvert, setKonvert] = useState(null);
  const [yurmoqda, setYurmoqda] = useState(false);
  const done = n >= CASE12.length;
  const tugadi = useTugadi(done, 1200, !!storedAnswer);
  const tRef = useRef([]);
  useEffect(() => () => tRef.current.forEach(clearTimeout), []);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  // har qadamda konvert yo'l bo'ylab tugundan tugunga sakraydi (600 ms/qadam)
  const keyingi = () => {
    if (yurmoqda || done) return;
    const q = CASE12[n]; tRef.current.forEach(clearTimeout); tRef.current = [];
    setN(n + 1);
    if (!q.yol.length) { setKonvert(null); return; }
    setYurmoqda(true); setKonvert(q.yol[0]);
    q.yol.slice(1).forEach((id, k) => tRef.current.push(setTimeout(() => setKonvert(id), 620 * (k + 1))));
    tRef.current.push(setTimeout(() => setYurmoqda(false), 620 * q.yol.length));
  };
  const otgan = CASE12.slice(0, n);
  const edges = done ? hamma(CASE_HAMMA, 'ok') : { ...hamma(CASE_HAMMA, 'kul'), ...Object.fromEntries(otgan.flatMap(q => q.on).map(k => [k, 'on'])) };
  const nodes = { ...hamma(['user', 'front', 'back', 'db', 'ai', 'bot'], 'ochiq'), ...(!done && konvert ? { [konvert]: 'joriy' } : {}), ...(done ? hamma(['back', 'db'], 'ok') : {}) };
  const qatorlar = otgan.filter(q => q.qator).map(q => q.qator);
  const pufak = !done && n > 0 && CASE12[n - 1].pufak ? Object.fromEntries(Object.entries(CASE12[n - 1].pufak).map(([k, v]) => [k, tr(v)])) : {};
  const TAXMIN = [{ k: 'bitta', t: tr({ uz: 'Bitta', ru: 'В одну' }) }, { k: 'ikkita', t: tr({ uz: 'Ikkita', ru: 'В две' }) }];
  return (
    <Stage eyebrow={tr({ uz: "Hayotiy · to'liq tizim", ru: 'Жизненный пример · полная система' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : `${tr({ uz: 'Tizimni kuzating', ru: 'Следите за системой' })} (${n}/${CASE12.length})`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Ikki foydalanuvchi — bitta tizim. <span className="italic" style={{ color: T.accent }}>Nima bo'ladi?</span></>, ru: <>Два пользователя — одна система. <span className="italic" style={{ color: T.accent }}>Что будет?</span></> })}
        mentor={<Mentor>{tr({ uz: 'Bir xaridor saytdan, ikkinchisi botdan buyurtma beradi. Qadamlarni kuzating.', ru: 'Один покупатель заказывает с сайта, второй — из бота. Следите за шагами.' })}</Mentor>}
        bashorat={!taxmin && <QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={tr({ uz: "Ikki buyurtma nechta Database'ga yoziladi?", ru: 'Во сколько Database запишутся два заказа?' })} variantlar={TAXMIN} tanlov={taxmin} onTanla={setTaxmin} />}
        harakat={taxmin && <QKarta yorliq={tr({ uz: 'Qadamlar', ru: 'Шаги' })}>
          <QQadamlar qadamlar={CASE12.map(q => tr(q.qadam))} joriy={done ? undefined : n} />
          {n > 0 && <QIzoh>{tr(CASE12[n - 1].izoh)}</QIzoh>}
          {!done && <QTugma onClick={keyingi} disabled={yurmoqda}>{n === 0 ? tr({ uz: 'Boshlash', ru: 'Начать' }) : tr({ uz: 'Keyingi qadam', ru: 'Следующий шаг' })}</QTugma>}
        </QKarta>}
        vizual={taxmin && <>
          <SysMap nodes={nodes} edges={edges} konvert={done ? null : konvert} pufak={pufak} />
          <div className="kr-jadval mono">
            <span className="kr-jh"><SysBelgi id="db" /> Database · {tr({ uz: 'buyurtmalar', ru: 'заказы' })} · {qatorlar.length}</span>
            {qatorlar.length === 0 ? <span className="kr-bosh">{tr({ uz: "hali bo'sh", ru: 'пока пусто' })}</span> : qatorlar.map((q, i) => <span key={q} className={`kr-q${i === qatorlar.length - 1 && !done ? ' yangi' : ''}`}>{q}</span>)}
          </div>
        </>}
        natija={done && <QTaxmin togri={taxmin === 'bitta'}>{taxmin === 'bitta'
          ? tr({ uz: <>Taxminingiz to'g'ri chiqdi: <b>bitta Database</b>.</>, ru: <>Ваше предположение верно: <b>одна Database</b>.</> })
          : tr({ uz: <>Taxminingiz: ikkita · haqiqatda: <b>bitta Database</b></>, ru: <>Ваше предположение: две · на деле: <b>одна Database</b></> })}</QTaxmin>}
        xulosa={done && tr({ uz: "Ikki kirish yo'li, bitta Database. Shu tizimni 13-darsda to'liq qurasiz.", ru: 'Две точки входа, одна Database. Эту систему вы полностью построите на 13-м уроке.' })}
      />
    </Stage>
  );
};

// ===== SCREEN 13 — AMALDA · chizmani o'zingiz chizing (qism qo'shish + ulash → fayl jonli yoziladi, F-1004-56) =====
const CHIZMA = ['user', 'front', 'back', 'db', 'ai'];
const ULASH = { [ek('user', 'front')]: 'Foydalanuvchi → Frontend', [ek('front', 'back')]: "Frontend ↔ Backend   (API: so'rov / javob)", [ek('back', 'db')]: 'Backend → Database', [ek('back', 'ai')]: 'Backend → AI' };
const qismQatori = (id) => `[${tr(SYS_BY[id].nom)}${SYS_BY[id].tex ? ' · ' + SYS_BY[id].tex : ''}]`;
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const [qism, setQism] = useState(() => (storedAnswer ? CHIZMA.slice() : []));
  const [ulan, setUlan] = useState(() => (storedAnswer ? Object.keys(ULASH) : []));
  const [birinchi, setBirinchi] = useState(null);
  const [yomon, setYomon] = useState(null);
  const [xato, setXato] = useState(null);
  const [fayl, setFayl] = useState(() => (storedAnswer ? [...CHIZMA.map(qismQatori), ...Object.values(ULASH)] : []));
  const done = qism.length >= CHIZMA.length && ulan.length >= Object.keys(ULASH).length;
  const tugadi = useTugadi(done, 1100, !!storedAnswer);
  const tRef = useRef(null);
  useEffect(() => () => clearTimeout(tRef.current), []);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const qosh = (id) => { if (qism.includes(id)) return; setQism(q => [...q, id]); setFayl(f => [...f, qismQatori(id)]); };
  const bos = (id) => {
    if (!birinchi) { setBirinchi(id); setXato(null); return; }
    if (birinchi === id) { setBirinchi(null); return; }
    const k = ek(birinchi, id); setBirinchi(null);
    if (ulan.includes(k)) return;
    if (!ULASH[k]) {
      setYomon(k); clearTimeout(tRef.current); tRef.current = setTimeout(() => setYomon(null), 1200);
      setXato(tr({ uz: "So'rov Backend orqali o'tadi.", ru: 'Запрос проходит через Backend.' }));
      return;
    }
    setXato(null); setUlan(u => [...u, k]); setFayl(f => [...f, ULASH[k]]);
  };
  const nodes = Object.fromEntries(qism.map(id => [id, birinchi === id ? 'joriy' : done ? 'ok' : 'ochiq']));
  const edges = { ...Object.fromEntries(ulan.map((k, i) => [k, i === ulan.length - 1 && !done ? 'ok yangi' : 'ok'])), ...(yomon ? { [yomon]: 'err' } : {}) };
  return (
    <Stage eyebrow={tr({ uz: 'Amalda · chizma', ru: 'На практике · схема' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: "Chizmani yig'ing", ru: 'Соберите схему' })} (${qism.length + ulan.length}/9)`} onClick={onNext} /></>}>
      <QTushuncha keng harakatAvval zoom={Zoomable} tugadi={tugadi}
        sarlavha={tr({ uz: <>Kod yozishdan oldin <span className="italic" style={{ color: T.accent }}>tizimni chizing</span>.</>, ru: <>Перед кодом <span className="italic" style={{ color: T.accent }}>нарисуйте систему</span>.</> })}
        mentor={<Mentor>{tr({ uz: 'Tajribali dasturchi avval chizma chizadi. Qismlarni qo\'shib, ularni ulang.', ru: 'Опытный разработчик сначала рисует схему. Добавьте части и соедините их.' })}</Mentor>}
        harakat={<>
          <div className="q-variantlar">
            {CHIZMA.map(id => <QChip key={id} holat={qism.includes(id) ? 'ok' : undefined} disabled={qism.includes(id)} onClick={() => qosh(id)}>{qism.includes(id) ? '✓' : '+'} {tr(SYS_BY[id].nom)}</QChip>)}
          </div>
          <QIzoh>{birinchi ? tr({ uz: `${tr(SYS_BY[birinchi].nom)} tanlandi — ulanadigan qismni bosing.`, ru: `Выбран ${tr(SYS_BY[birinchi].nom)} — нажмите часть, с которой он соединяется.` }) : tr({ uz: 'Ulash uchun xaritada ikki qismni ketma-ket bosing.', ru: 'Чтобы соединить, нажмите на карте две части подряд.' })}</QIzoh>
          {xato && <QXato>{xato}</QXato>}
        </>}
        vizual={<div className="ch-ikki">
          <SysMap nodes={nodes} edges={edges} bosiladi={done ? null : new Set(qism)} onNode={bos} />
          <CodeFile name="arxitektura.txt" minH={200}>{fayl.length
            ? fayl.map((q, i) => <span key={i} className={i === fayl.length - 1 && !done ? 'fl-yangi' : undefined}>{q}{'\n'}</span>)
            : <span className="fl-bosh">{tr({ uz: "Qism qo'shing — shu yerda yoziladi.", ru: 'Добавьте часть — она появится здесь.' })}</span>}</CodeFile>
        </div>}
        xulosa={done && tr({ uz: "Chizma bilan jamoaga ham, AI'ga ham tizimni bitta rasmda tushuntirasiz.", ru: 'Схемой вы объясните систему одной картинкой — и команде, и AI.' })}
      >
        {done && <QIzoh>{tr({ uz: "3-darsda tizim tuzishning sinab ko'rilgan usullarini — arxitektura patternlarini o'rganamiz.", ru: 'На 3-м уроке изучим проверенные способы строить системы — архитектурные паттерны.' })}</QIzoh>}
      </QTushuncha>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar) — faqat REAL bosqichlar uchun (tekin emas) =====
const ACHIEVEMENTS = {
  cityBuilder:  { icon: '🗄️', name: 'Data Keeper',   desc: { uz: "Database doimiy xotira ekanini topdingiz", ru: 'Вы поняли, что Database — постоянная память' } },
  requestRoute: { icon: '🛣️', name: 'Request Route', desc: { uz: "So'rovning to'g'ri yo'lini bildingiz", ru: 'Вы знаете верный путь запроса' } },
  cityOnline:   { icon: '🌐', name: 'One Backend',    desc: { uz: "Ko'p kirish yo'li, bitta tizim — g'oyani tushundingiz", ru: 'Много точек входа, одна система — вы поняли идею' } },
  powerGrid:    { icon: '📱', name: 'New Door',       desc: { uz: "Tizimga yangi kirish yo'li (mobil) qo'shdingiz", ru: 'Вы добавили к системе новую точку входа (мобильное)' } },
};
// Ekran id → nishon. ❗ FAQAT SCORED test ekranlariga (correct=to'g'ri javob): s4 · s8 · s11 · s14.
// Exploration/toggle ekranlarga BOG'LANMAYDI (ular har bosishda correct:true beradi — nishon tekin bo'lib qolardi).
const ACH_TRIGGERS = { s4: 'cityBuilder', s8: 'requestRoute', s11: 'cityOnline', s14: 'powerGrid' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 8, 11, 14, 15)
const Q_LABELS = {
  4: { uz: '1 — Database', ru: '1 — Database' },
  8: { uz: "2 — So'rov yo'li", ru: '2 — Путь запроса' },
  11: { uz: "3 — Ko'p kirish yo'li", ru: '3 — Много точек входа' },
  14: { uz: "4 — Mobil qo'shish", ru: '4 — Добавить мобильное' },
  15: { uz: "5 — Yo'l tartibi", ru: '5 — Порядок пути' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi tokenlar — darsning "DNK"si (arxitektura atamalari)
const QZ_BG_SHAPES = [
  { ch: 'Frontend',    l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: '🗄️',          l: 85, t: 8,  s: 32, d: 23, dl: 1.5 },
  { ch: 'Backend',     l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: 'request',     l: 76, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: 'API',         l: 45, t: 86, s: 26, d: 25, dl: 1.1 },
  { ch: 'response',    l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: 'Database',    l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: 'front→back',  l: 55, t: 5,  s: 22, d: 22, dl: 0.6 },
  { ch: '🖥️',          l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '⚙️',          l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: 'client',      l: 34, t: 62, s: 22, d: 29, dl: 3.4 },
  { ch: '🧠',          l: 2,  t: 30, s: 26, d: 28, dl: 3.1 },
  { ch: 'server',      l: 60, t: 90, s: 22, d: 31, dl: 4.2 },
  { ch: { uz: 'tizim', ru: 'система' },       l: 20, t: 16, s: 22, d: 18, dl: 2.9 },
];
// ⚡ Mustahkamlash-jang savollari — to'g'ri javoblar 4 pozitsiyaga TENG (12 savol: 3/3/3/3, mexanik ketma-ketlik yo'q).
// 🎓 Metodist: savol matni va variant uzunliklari sayqallanadi · ⚡ Jonli: `correct` qiymatlari INLINE_KEYS bilan sinxron tekshiriladi.
const QUIZ_BANK = [
  { q: { uz: "Mahsulot, buyurtma va foydalanuvchilar qayerda doimiy saqlanadi?", ru: 'Где постоянно хранятся товары, заказы и пользователи?' }, opts: [{ uz: "Database'da", ru: 'В Database' }, { uz: "Frontend'da", ru: 'В Frontend' }, { uz: "Backend'da", ru: 'В Backend' }, { uz: "AI'da", ru: 'В AI' }], correct: 0 },
  { q: { uz: "Frontend asosan nima qiladi?", ru: 'Чем в основном занимается Frontend?' }, opts: [{ uz: "Ma'lumotni doimiy saqlaydi", ru: 'Постоянно хранит данные' }, { uz: "Narx va to'lovni hisoblaydi", ru: 'Считает цену и оплату' }, { uz: "Foydalanuvchiga ma'lumotni ko'rsatadi", ru: 'Показывает данные пользователю' }, { uz: "Database'ga to'g'ridan yozadi", ru: 'Пишет прямо в Database' }], correct: 2 },
  { q: { uz: "«Savatga» bosilganda so'rov qaysi yo'l bilan boradi?", ru: 'Каким путём идёт запрос при нажатии «В корзину»?' }, opts: [{ uz: "Frontend → Database, Backend'siz", ru: 'Frontend → Database, без Backend' }, { uz: "Frontend ichida qoladi", ru: 'Остаётся внутри Frontend' }, { uz: "Frontend → Backend → Database, javob orqaga", ru: 'Frontend → Backend → Database, ответ обратно' }, { uz: "Database → Backend → Frontend", ru: 'Database → Backend → Frontend' }], correct: 2 },
  { q: { uz: "Bizning tizimda Frontend nega Database'ga to'g'ridan ulanmaydi?", ru: 'Почему в нашей системе Frontend не подключается к Database напрямую?' }, opts: [{ uz: "Database juda sekin ishlaydi", ru: 'Database работает слишком медленно' }, { uz: "Xavfsizlik uchun: Backend orqali o'tadi", ru: 'Ради безопасности: путь идёт через Backend' }, { uz: "Ular boshqa tilda yozilgan", ru: 'Они написаны на разных языках' }, { uz: "Buni texnik jihatdan qilib bo'lmaydi", ru: 'Технически так сделать нельзя' }], correct: 1 },
  { q: { uz: "Backend'ning asosiy vazifasi nima?", ru: 'В чём главная задача Backend?' }, opts: [{ uz: "Sahifa dizaynini chizadi", ru: 'Рисует дизайн страницы' }, { uz: "Foydalanuvchiga to'g'ridan ko'rinadi", ru: 'Видна пользователю напрямую' }, { uz: "Faqat matnni tarjima qiladi", ru: 'Только переводит текст' }, { uz: "Qoidalarni bajaradi, Database'ga yozadi", ru: 'Выполняет правила, пишет в Database' }], correct: 3 },
  { q: { uz: "Web sayt va Telegram bot bir xil buyurtmalarni qanday ko'radi?", ru: 'Как веб-сайт и Telegram-бот видят одни и те же заказы?' }, opts: [{ uz: "Bitta Backend va Database'ga ulanadi", ru: 'Подключены к одному Backend и Database' }, { uz: "Har biriga alohida Database quriladi", ru: 'Для каждого строят отдельную Database' }, { uz: "Ma'lumot qo'lda ko'chiriladi", ru: 'Данные копируют вручную' }, { uz: "Buning umuman iloji yo'q", ru: 'Это вообще невозможно' }], correct: 0 },
  { q: { uz: "«Ko'p kirish yo'li, bitta tizim» nimani anglatadi?", ru: 'Что означает «много точек входа, одна система»?' }, opts: [{ uz: "Har kirish yo'liga alohida tizim kerak", ru: 'Каждой точке входа нужна своя система' }, { uz: "Bitta kirish yo'li hamma uchun yetadi", ru: 'Одной точки входа хватит всем' }, { uz: "Faqat web sayt bo'lishi mumkin", ru: 'Может быть только веб-сайт' }, { uz: "Web, bot va mobil bitta Backend'ga ulanadi", ru: 'Веб, бот и мобильное подключены к одному Backend' }], correct: 3 },
  { q: { uz: "Database o'chirilsa nima bo'ladi?", ru: 'Что будет, если отключить Database?' }, opts: [{ uz: "Hech narsa o'zgarmaydi", ru: 'Ничего не изменится' }, { uz: "Ma'lumot saqlanmaydi, yo'qoladi", ru: 'Данные не сохраняются и пропадают' }, { uz: "Faqat sahifa ranglari o'chadi", ru: 'Погаснут только цвета страницы' }, { uz: "Tizim tezroq ishlay boshlaydi", ru: 'Система начнёт работать быстрее' }], correct: 1 },
  { q: { uz: "Mavjud tizimga mobil ilova qo'shishning eng oson yo'li?", ru: 'Самый простой способ добавить мобильное приложение к готовой системе?' }, opts: [{ uz: "Hammasini noldan qayta yozish", ru: 'Переписать всё с нуля' }, { uz: "Yangi Frontend yozib, Backend'ga ulash", ru: 'Написать новый Frontend и подключить к Backend' }, { uz: "Mobil uchun alohida Database qurish", ru: 'Построить для мобильного отдельную Database' }, { uz: "Buning umuman iloji yo'q", ru: 'Это вообще невозможно' }], correct: 1 },
  { q: { uz: "AI tizimda qanday rol o'ynaydi?", ru: 'Какую роль играет AI в системе?' }, opts: [{ uz: "Ma'lumotni doimiy saqlaydi", ru: 'Постоянно хранит данные' }, { uz: "Barcha qarorlarni yolg'iz qiladi", ru: 'Принимает все решения в одиночку' }, { uz: "Maslahat va tavsiya beradi", ru: 'Даёт советы и рекомендации' }, { uz: "Sahifani foydalanuvchiga ko'rsatadi", ru: 'Показывает страницу пользователю' }], correct: 2 },
  { q: { uz: "Ma'lumot qaysi tartibda yuradi?", ru: 'В каком порядке идут данные?' }, opts: [{ uz: "Database → Backend → Frontend → ekran → foydalanuvchi", ru: 'Database → Backend → Frontend → экран → пользователь' }, { uz: "Backend → Database → Frontend → foydalanuvchi → ekran", ru: 'Backend → Database → Frontend → пользователь → экран' }, { uz: "Frontend → Database → Backend → foydalanuvchi → ekran", ru: 'Frontend → Database → Backend → пользователь → экран' }, { uz: "Foydalanuvchi → Frontend → Backend → Database → ekran", ru: 'Пользователь → Frontend → Backend → Database → экран' }], correct: 3 },
  { q: { uz: "Kod yozishdan oldin arxitekturani chizish nega foydali?", ru: 'Чем полезно нарисовать архитектуру до написания кода?' }, opts: [{ uz: "Qaysi qism nima qilishini aniqlaydi", ru: 'Проясняет, какая часть что делает' }, { uz: "Kodni o'zi avtomatik yozib beradi", ru: 'Само автоматически напишет код' }, { uz: "Serverni ancha tezlashtiradi", ru: 'Заметно ускорит сервер' }, { uz: "Sahifa dizaynini chiroyli qiladi", ru: 'Делает дизайн страницы красивее' }], correct: 0 },
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

// 🃏 Kartochka mexanikasi va ko'rinishi — qolipda: QKartochka (DE-204, texnik darslar standarti aynan).
// 🃏 FLASHCARD KARTALARI — arxitektura atamalari (texnik nom + qisqa izoh)
const ARCH_FLASHCARDS = [
  { front: { uz: "Foydalanuvchi ko'radigan qism qanday ataladi?", ru: 'Как называется часть, которую видит пользователь?' }, back: 'Frontend', note: { uz: "Sahifa, tugmalar, rasmlar", ru: 'Страница, кнопки, картинки' } },
  { front: { uz: "So'rovni qabul qilib, qoidalarni bajaradigan qism qaysi?", ru: 'Какая часть принимает запросы и выполняет правила?' }, back: 'Backend', note: { uz: "So'rovni tekshiradi, hisoblaydi, Database'ga yozadi", ru: 'Проверяет запрос, считает, пишет в Database' } },
  { front: { uz: "Mahsulot va buyurtmalar qayerda doimiy saqlanadi?", ru: 'Где постоянно хранятся товары и заказы?' }, back: 'Database', note: { uz: "Sahifa yangilansa ham yo'qolmaydi", ru: 'Не пропадает даже после обновления страницы' } },
  { front: { uz: "Frontend va Backend qaysi yo'l orqali gaplashadi?", ru: 'По какому пути общаются Frontend и Backend?' }, back: 'API', note: { uz: "So'rov boradi, javob qaytadi", ru: 'Запрос уходит, ответ возвращается' } },
  { front: { uz: "Tugma bosilganda Backend'ga yuboriladigan xabar nima deyiladi?", ru: 'Как называется сообщение, которое уходит в Backend при нажатии кнопки?' }, back: { uz: "So'rov (request)", ru: 'Запрос (request)' }, note: { uz: "Frontend'dan Backend'ga boradi", ru: 'Идёт из Frontend в Backend' } },
  { front: { uz: "Backend so'rovga qaytaradigan natija nima deyiladi?", ru: 'Как называется результат, который Backend возвращает на запрос?' }, back: { uz: "Javob (response)", ru: 'Ответ (response)' }, note: { uz: "O'sha yo'l bilan ekranga qaytadi", ru: 'Возвращается на экран тем же путём' } },
  { front: { uz: "«Savatga» bosilganda so'rov qaysi yo'l bilan boradi?", ru: 'Каким путём идёт запрос при нажатии «В корзину»?' }, back: { uz: "Frontend → Backend → Database", ru: 'Frontend → Backend → Database' }, note: { uz: "Javob keyin orqaga qaytadi", ru: 'Потом ответ возвращается обратно' } },
  { front: { uz: "Bizning tizimda Frontend nega Database'ga to'g'ridan ulanmaydi?", ru: 'Почему в нашей системе Frontend не подключается к Database напрямую?' }, back: { uz: "Xavfsizlik uchun", ru: 'Ради безопасности' }, note: { uz: "Parol va qoidalar Backend'da turadi", ru: 'Пароли и правила находятся в Backend' } },
  { front: { uz: "AI tizimda nima qiladi?", ru: 'Что делает AI в системе?' }, back: { uz: "Maslahat beradi", ru: 'Даёт советы' }, note: { uz: "Uni Backend chaqiradi", ru: 'Его вызывает Backend' } },
  { front: { uz: "Web sayt va Telegram bot bitta tizim bo'la oladimi?", ru: 'Могут ли сайт и Telegram-бот быть одной системой?' }, back: { uz: "Ha", ru: 'Да' }, note: { uz: "Ikkalasi bitta Backend va Database'ga ulanadi", ru: 'Оба подключены к одному Backend и Database' } },
  { front: { uz: "Tayyor tizimga mobil ilova qanday qo'shiladi?", ru: 'Как к готовой системе добавляют мобильное приложение?' }, back: { uz: "Yangi Frontend yozib", ru: 'Написав новый Frontend' }, note: { uz: "Backend'ni qaytadan qurish shart emas", ru: 'Перестраивать Backend не нужно' } },
  { front: { uz: "Ma'lumot yo'li kimdan boshlanadi?", ru: 'С кого начинается путь данных?' }, back: { uz: "Foydalanuvchidan", ru: 'С пользователя' }, note: { uz: "U tugmani bosadi, keyin so'rov yo'lga chiqadi", ru: 'Он нажимает кнопку, и запрос отправляется в путь' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <QKartochka til={__lang} cards={ARCH_FLASHCARDS.map(c => ({ front: tr(c.front), back: tr(c.back), note: c.note && tr(c.note) }))} />
      </div>
    </Stage>
  );
};

// ===== YAKUN — qolipdan: QYakun (DE-204). CODE STRIKE va arena — jonli o'yin qatlami, darsda =====
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
  const RECAP = [
    { uz: "Real ilova — bir nechta qism birga ishlaydigan tizim", ru: 'Настоящее приложение — система, в которой вместе работают несколько частей' },
    { uz: "5 qism: Frontend, Backend, Database — asosiy; AI va Bot — qo'shimcha", ru: '5 частей: Frontend, Backend, Database — основные; AI и Bot — дополнительные' },
    { uz: "Ma'lumot yo'li: Foydalanuvchi → Frontend → Backend → Database → ekran", ru: 'Путь данных: Пользователь → Frontend → Backend → Database → экран' },
    { uz: "Bitta Backend va Database, ko'p kirish yo'li (web, bot, mobil)", ru: 'Один Backend и Database, много точек входа (веб, бот, мобильное)' },
    { uz: "Kod yozishdan oldin tizim chizmasini (arxitekturani) chizish kerak", ru: 'Прежде чем писать код, нужно нарисовать схему системы (архитектуру)' }
  ];
  const HOMEWORK = [
    { b: { uz: "Chizing", ru: 'Нарисуйте' }, t: { uz: "— o'z loyihangiz arxitekturasini chizing: unda qaysi qismlar bor?", ru: '— нарисуйте архитектуру своего проекта: какие в нём есть части?' } },
    { b: { uz: "Yo'l", ru: 'Путь' }, t: { uz: "— bitta amal uchun (masalan, «buyurtma berish») so'rov yo'lini chizib chiqing", ru: '— нарисуйте путь запроса для одного действия (например, «оформить заказ»)' } },
    { b: { uz: "Kirish yo'llari", ru: 'Точки входа' }, t: { uz: "— loyihangizga qaysilari kerak: web, bot, mobil?", ru: '— какие из них нужны вашему проекту: веб, бот, мобильное?' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <QYakun til={__lang}
        chip={tr({ uz: "Tizimni ko'ra boshladingiz", ru: 'Вы начали видеть систему' })}
        togri={correct} jami={total}
        sarlavha={tr({ uz: <>Endi sayt siz uchun <span className="italic" style={{ color: T.accent }}>bitta sahifa emas</span> — tizim.</>, ru: <>Теперь сайт для вас <span className="italic" style={{ color: T.accent }}>не одна страница</span> — система.</> })}
        cta={<>
          <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
            <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
          </div>
          {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        </>}
        recap={RECAP.map(tr)}
        uyga={HOMEWORK.map(h => ({ b: tr(h.b), t: tr(h.t) }))}
        keyingi={tr({ uz: <>Keyingi dars — <b>Bitta gapni uch kishi bir xil tushunadimi?</b> Kod yozishdan oldin g'oyani bitta varaqqa yozishni o'rganamiz.</>, ru: <>Следующий урок — <b>Поймут ли одну фразу трое одинаково?</b> Научимся записывать идею на одном листе, прежде чем писать код.</> })}
        hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
        nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}
      />
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function SystemArchitectureLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === PILOT (MD v3 + F-1004 3-qism): tizim xaritasi — darsning bitta vizuali (163, 180) === */
        .smap { position: relative; width: 100%; height: clamp(240px,27vw,280px); background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; flex-shrink: 0; }
        .smap.qator { height: 112px; }
        .smap.qator .smap-n { min-width: 0; padding: 6px 8px; }
        .smap.qator .smap-n b { font-size: 12px; }
        .smap.qator .smap-nom { gap: 4px; }
        .smap-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        .smap-e { stroke: ${T.line}; stroke-width: 2.2; transition: stroke 0.3s; }
        .smap-e.on { stroke: ${T.accent}; stroke-dasharray: 7 6; animation: smap-oqim 0.9s linear infinite; } /* ma'lumot oqyapti */
        .smap-e.ok { stroke: ${T.ok}; }
        .smap-e.err { stroke: ${T.err}; stroke-dasharray: 5 4; }
        .smap-e.uzuq { stroke: ${T.line}; stroke-dasharray: 2 6; }
        .smap-e.yangi { stroke-dasharray: 900; stroke-dashoffset: 900; animation: smap-chiz 0.75s ease-out forwards; } /* yangi chiziq chizilib chiqadi */
        @keyframes smap-oqim { to { stroke-dashoffset: -13; } }
        @keyframes smap-chiz { to { stroke-dashoffset: 0; } }
        .smap-n { position: absolute; transform: translate(-50%,-50%); min-width: 100px; max-width: 146px; padding: 7px 11px; border-radius: 11px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: 'Manrope', sans-serif; display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; cursor: default; z-index: 2; transition: border-color 0.25s, background 0.25s, opacity 0.25s; animation: smap-pop 0.42s cubic-bezier(.3,1.45,.5,1) both; }
        @keyframes smap-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.6); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .smap-nom { display: inline-flex; align-items: center; gap: 6px; }
        .smap-ic { color: ${T.accent}; flex-shrink: 0; }
        .smap-n b { font-weight: 800; font-size: 13px; color: ${T.ink}; line-height: 1.2; }
        .smap-n small { font-size: 11px; font-weight: 600; color: ${T.ink2}; line-height: 1.25; }
        .smap-n.kul { background: ${T.bg}; border-style: dashed; min-height: 34px; justify-content: center; }
        .smap-yoq { display: block; width: 40px; height: 6px; border-radius: 99px; background: ${T.line}; }
        .smap-n.joriy { border-color: ${T.accent}; }
        .smap-n.joriy::before { content: ''; position: absolute; inset: -2px; border-radius: inherit; animation: smap-puls 1.6s ease-out infinite; pointer-events: none; }
        @keyframes smap-puls { 0% { box-shadow: 0 0 0 0 ${fon(T.accent, 0.45)}; } 100% { box-shadow: 0 0 0 10px ${fon(T.accent, 0)}; } }
        .smap-n.ok { border-color: ${T.ok}; background: linear-gradient(${T.okFon}, ${T.okFon}), ${T.paper}; }
        .smap-n.ok b, .smap-n.ok .smap-ic { color: ${T.ok}; }
        .smap-n.off { opacity: 0.5; border-style: dashed; background: ${T.bg}; }
        .smap-n.off .smap-ic { color: ${T.ink2}; }
        .smap-n:not(:disabled) { cursor: pointer; }
        .smap-n:not(:disabled):hover { border-color: ${T.accent}; }
        .smap-n.q-silk { animation: smap-silk 0.32s ease-in-out; }
        @keyframes smap-silk { 0%, 100% { transform: translate(-50%,-50%); } 25% { transform: translate(calc(-50% - 5px),-50%); } 75% { transform: translate(calc(-50% + 5px),-50%); } }
        .smap-pufak { position: absolute; bottom: calc(100% + 9px); left: 50%; transform: translateX(-50%); white-space: nowrap; background: ${T.ink}; color: #fff; font-size: 11.5px; font-weight: 700; padding: 6px 10px; border-radius: 10px; animation: q-kir 0.3s ease-out; z-index: 4; }
        .smap-pufak.ong { left: auto; right: -4px; transform: none; } .smap-pufak.ong::after { left: auto; right: 22px; margin-left: 0; } /* o'ng chetdagi tugun — pufak xaritadan chiqmaydi */
        .smap-pufak::after { content: ''; position: absolute; top: 100%; left: 50%; margin-left: -5px; border: 5px solid transparent; border-top-color: ${T.ink}; }
        /* konvert — chizilgan xat (so'rov: modul rangi · javob: yashil) */
        .smap-konvert { position: absolute; width: 20px; height: 14px; border-radius: 3px; background: ${T.accent}; box-shadow: 0 0 0 3px ${T.paper}, 0 5px 12px -3px rgba(${T.shadowBase},0.4); transform: translate(-50%,-190%); transition: left 0.6s cubic-bezier(.45,.05,.25,1), top 0.6s cubic-bezier(.45,.05,.25,1), background 0.3s; pointer-events: none; z-index: 3; }
        .smap-konvert::before { content: ''; position: absolute; left: 0; top: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 7px solid rgba(255,255,255,0.55); }
        .smap-konvert.javob { background: ${T.ok}; }
        .smap-konvert.yetdi { opacity: 0; transition: left 0.6s cubic-bezier(.45,.05,.25,1), top 0.6s cubic-bezier(.45,.05,.25,1), opacity 0.25s 0.6s; } /* xabar yetib keldi — o'rnini pufak egallaydi */
        .smap-pufak { animation-delay: 0.55s !important; animation-fill-mode: both !important; }
        .smap-konvert.aylanma { transform: translate(-50%,-50%); z-index: 1; transition: none; animation: smap-aylan2 7s ease-in-out infinite; } /* yo'l bo'ylab aylanadi, tugunlar ortidan o'tadi — nomni yopmaydi */
        .smap.qator .smap-konvert.aylanma { top: 50%; animation-name: smap-aylan; animation-duration: 5.2s; }
        @keyframes smap-aylan2 { 0% { left: 15%; top: 50%; background: ${T.accent}; } 14% { left: 43%; top: 15%; } 28% { left: 43%; top: 50%; } 42% { left: 43%; top: 85%; background: ${T.accent}; } 50% { left: 43%; top: 85%; background: ${T.ok}; } 64% { left: 43%; top: 50%; } 78% { left: 43%; top: 15%; } 92% { left: 15%; top: 50%; background: ${T.ok}; } 100% { left: 15%; top: 50%; background: ${T.accent}; } }
        @keyframes smap-aylan { 0% { left: 14%; background: ${T.accent}; } 44% { left: 87%; background: ${T.accent}; } 50% { left: 87%; background: ${T.ok}; } 94% { left: 14%; background: ${T.ok}; } 100% { left: 14%; background: ${T.accent}; } }
        @media (max-width: 560px) { .smap.qator .smap-n { padding: 4px 5px; } .smap.qator .smap-n b { font-size: 10px; } .smap.qator .smap-ic { display: none; } }
        @media (max-width: 560px) { .smap-n { min-width: 74px; max-width: 104px; padding: 5px 6px; } .smap-n b { font-size: 11.5px; } .smap-n small { font-size: 10px; } .smap-ic { width: 12px; height: 12px; } .smap { height: 250px; } .smap.qator { height: 96px; } }
        /* === PILOT: sayt maketi (SiteMock) === */
        .sm-body { gap: 7px; padding: 12px; }
        .sm-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .sm-logo { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .sm-joy { font-family: 'Manrope', sans-serif; border: 1.5px solid transparent; background: none; cursor: default; padding: 0; text-align: left; color: ${T.ink}; }
        .sm-joy:not(:disabled) { cursor: pointer; }
        .sm-joy.ochiq { border-color: ${T.ok}; }
        .sm-savat { font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 99px; padding: 4px 10px; }
        .sm-savat b { color: ${T.ink}; font-variant-numeric: tabular-nums; display: inline-block; animation: smap-pop2 0.4s cubic-bezier(.3,1.6,.5,1); }
        @keyframes smap-pop2 { from { transform: scale(1.7); color: ${T.accent}; } to { transform: scale(1); } }
        .sm-mahsulot { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 12px; background: ${T.bg}; border-radius: 9px; font-size: 13.5px; font-weight: 600; color: ${T.ink}; width: 100%; }
        .sm-mahsulot b { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: ${T.ink2}; }
        .sm-past { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .sm-savatga { background: ${T.accent}; color: #fff !important; border-radius: 9px; padding: 7px 14px; font-weight: 700; font-size: 12.5px; }
        .sm-jami { font-family: 'Manrope'; font-size: 12.5px; font-weight: 600; color: ${T.ink2}; } .sm-jami b { color: ${T.ink}; font-family: 'JetBrains Mono', monospace; }
        .sm-pufak { align-self: flex-start; font-size: 12.5px; font-weight: 700; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 12px 12px 12px 3px; padding: 7px 11px; }
        .sm-tg { align-self: flex-end; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; border: 1px solid ${T.line} !important; border-radius: 99px; padding: 4px 10px; }
        .sm-yuk { display: flex; align-items: center; gap: 9px; justify-content: center; min-height: 112px; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink2}; }
        .sm-spin { width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid ${T.line}; border-top-color: ${T.accent}; animation: sm-spin 0.8s linear infinite; }
        @keyframes sm-spin { to { transform: rotate(360deg); } }
        .sm-bosh { min-height: 150px; background: #fff; }
        .sm-miltilla .shopwin-body { animation: sm-mil 0.42s ease-in-out; }
        @keyframes sm-mil { 0%, 100% { opacity: 1; } 50% { opacity: 0.15; } }
        /* === PILOT: 5-ekran — brauzer (yorug') · API · server (qorong'i), F-1004-52 === */
        .q-col > .fb-ikki { flex-grow: 1; } /* ikki ustun bir balandlikda */
        .fb-ikki { display: grid; grid-template-columns: minmax(0,1fr) 54px minmax(0,1fr); align-items: stretch; min-width: 0; }
        .fb-tomon { display: flex; flex-direction: column; text-align: left; padding: 0; border: 1.5px solid ${T.line}; border-radius: 14px; overflow: hidden; font-family: 'Manrope', sans-serif; cursor: default; min-width: 0; transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s; }
        .fb-ikki.tanlov .fb-tomon { cursor: pointer; border-color: ${T.accent}; }
        .fb-ikki.tanlov .fb-tomon:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -12px ${fon(T.accent, 0.55)}; }
        .fb-ikki.tayyor .fb-tomon { border-color: ${T.ok}; }
        .fb-brauzer { background: ${T.paper}; }
        .fb-bar { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .fb-url { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; background: ${T.paper}; border-radius: 6px; padding: 2px 8px; }
        .fb-tana { display: flex; flex-direction: column; gap: 8px; padding: 12px; flex: 1; }
        .fb-nom { font-size: 10.5px; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; }
        .fb-skelet { height: 32px; border-radius: 8px; background: linear-gradient(90deg, ${T.bg} 0%, ${T.paper} 50%, ${T.bg} 100%); background-size: 200% 100%; animation: fb-shim 1.8s ease-in-out infinite; }
        .fb-skelet.qisqa { width: 55%; height: 26px; } .fb-skelet.tugma { width: 42%; height: 30px; }
        @keyframes fb-shim { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
        .fb-rasm { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; background: ${T.bg}; color: ${T.ink}; font-weight: 700; font-size: 13px; }
        .fb-rasm svg { color: ${T.accent}; flex-shrink: 0; }
        .fb-savat { align-self: flex-start; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 99px; padding: 5px 11px; } .fb-savat b { color: ${T.accent}; }
        .fb-tugma { align-self: flex-start; background: ${T.accent}; color: #fff; font-weight: 700; font-size: 12.5px; border-radius: 9px; padding: 7px 14px; }
        .fb-yangi { animation: fb-kir 0.55s cubic-bezier(.3,1.5,.5,1) both; }
        @keyframes fb-kir { from { opacity: 0; transform: scale(0.82) translateY(6px); } to { opacity: 1; transform: none; } }
        .fb-server { background: ${CODE.bg}; border-color: ${CODE.bg}; }
        .fb-ikki.tanlov .fb-server { border-color: ${T.accent}; }
        .fb-ikki.tayyor .fb-server { border-color: ${T.ok}; }
        .fb-sbar { display: flex; align-items: center; gap: 8px; padding: 9px 12px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.08); color: ${CODE.punct}; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; }
        .fb-led { width: 8px; height: 8px; border-radius: 50%; background: ${CODE.comment}; flex-shrink: 0; }
        .fb-led.on { background: ${T.ok}; box-shadow: 0 0 0 3px ${fon(T.ok, 0.25)}; animation: fb-led 1.4s ease-in-out infinite; }
        @keyframes fb-led { 50% { opacity: 0.4; } }
        .fb-log { display: flex; flex-direction: column; gap: 8px; padding: 12px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.45; color: ${CODE.text}; flex: 1; }
        .fb-qator { white-space: pre-wrap; overflow-wrap: anywhere; }
        .fb-qator::before { content: '$ '; color: ${CODE.str}; }
        .fb-qator.bosh, .fb-qator.bosh::before { color: ${CODE.comment}; }
        .fb-api { position: relative; display: flex; align-items: center; justify-content: center; }
        .fb-api::before { content: ''; position: absolute; left: 6px; right: 6px; top: 50%; height: 2px; background: ${T.line}; }
        .fb-api.on::before { background: ${T.ok}; }
        .fb-api-t { position: relative; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; padding: 1px 5px; border-radius: 4px; transform: translateY(-16px); }
        .fb-paket { position: absolute; top: 50%; left: 6px; width: 11px; height: 8px; margin-top: -4px; border-radius: 2px; background: ${T.accent}; animation: fb-yur 1.8s ease-in-out infinite; }
        .fb-paket.qayt { background: ${T.ok}; animation-delay: 0.9s; animation-direction: reverse; }
        @keyframes fb-yur { 0% { left: 6px; opacity: 0; } 15%, 85% { opacity: 1; } 100% { left: calc(100% - 17px); opacity: 0; } }
        @media (max-width: 560px) { .fb-ikki { grid-template-columns: minmax(0,1fr); } .fb-api { min-height: 40px; } .fb-api::before { left: 50%; right: auto; top: 0; bottom: 0; width: 2px; height: auto; } .fb-paket { display: none; } .fb-api-t { transform: translateX(22px); } }
        /* === PILOT: 6-ekran — ikki sayt === */
        .db-ikki { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,20px); }
        @media (max-width: 640px) { .db-ikki { grid-template-columns: minmax(0,1fr); } }
        .db-saqladi { align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ok}; background: ${T.okFon}; border-radius: 99px; padding: 4px 10px; }
        /* === PILOT: 7-ekran — xarita + sayt/chat · Telegram chat maketi === */
        .ai-ikki { display: grid; grid-template-columns: minmax(0,1.15fr) minmax(0,0.85fr); gap: clamp(12px,2vw,20px); align-items: start; }
        .ch-ikki { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,20px); align-items: start; }
        @media (max-width: 860px) { .ai-ikki, .ch-ikki { grid-template-columns: minmax(0,1fr); } }
        .tg-mock { display: flex; flex-direction: column; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; overflow: hidden; }
        .tg-bar { display: flex; align-items: center; gap: 8px; padding: 8px 11px; border-bottom: 1px solid ${T.line}; background: ${T.bg}; }
        .tg-ava { width: 24px; height: 24px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-size: 9.5px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tg-nomi { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink}; }
        .tg-tana { display: flex; flex-direction: column; gap: 6px; padding: 10px 11px; }
        .tg-xabar { max-width: 85%; font-family: 'Manrope'; font-size: 12.5px; font-weight: 600; padding: 7px 10px; border-radius: 12px; line-height: 1.35; }
        .tg-xabar.kel { align-self: flex-start; background: ${T.bg}; color: ${T.ink}; border-bottom-left-radius: 3px; }
        .tg-xabar.men { align-self: flex-end; background: ${T.accentSoft}; color: ${T.ink}; border-bottom-right-radius: 3px; animation: fb-kir 0.45s cubic-bezier(.3,1.5,.5,1) both; }
        .tg-db { padding: 8px 11px; border-top: 1px solid ${T.line}; font-family: 'Manrope'; font-size: 12px; font-weight: 600; color: ${T.ink2}; }
        .tg-db b { color: ${T.ink}; font-family: 'JetBrains Mono', monospace; display: inline-block; animation: smap-pop2 0.4s cubic-bezier(.3,1.6,.5,1); }
        /* === PILOT: 10/12-ekran — brauzer · Telegram · telefon → Backend → jadval, F-1004-54 === */
        .kr-tizim { display: flex; flex-direction: column; gap: 12px; }
        .kr-uch { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; align-items: stretch; }
        @media (max-width: 640px) { .kr-uch { grid-template-columns: minmax(0,1fr); } }
        .kr-maket { position: relative; display: flex; flex-direction: column; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; min-width: 0; transition: border-color 0.25s, box-shadow 0.25s; }
        .kr-maket.oqyapti { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.15)}; }
        .kr-bar { display: flex; align-items: center; gap: 8px; padding: 7px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; border-radius: 14px 14px 0 0; }
        .kr-maket .tg-bar { border-radius: 14px 14px 0 0; }
        .kr-tana { display: flex; flex-direction: column; gap: 8px; padding: 11px 12px; flex: 1; }
        .kr-mahsulot { display: flex; justify-content: space-between; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; background: ${T.bg}; border-radius: 8px; padding: 8px 10px; }
        .kr-mahsulot b { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: ${T.ink2}; font-weight: 600; }
        .kr-maket .q-chip { align-self: flex-end; padding: 7px 13px; margin-top: auto; }
        .kr-maket.mobil { border: 3px solid ${T.ink}; border-radius: 22px; padding-top: 6px; } /* 191: telefon ramkasi */
        .kr-maket.mobil.oqyapti { border-color: ${T.accent}; }
        .kr-notch { align-self: center; width: 54px; height: 6px; border-radius: 99px; background: ${T.ink}; margin-bottom: 6px; }
        .kr-appbar { margin: 0 9px; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 12px; padding: 7px 10px; border-radius: 10px; }
        .kr-uchish { position: absolute; left: 50%; bottom: -4px; width: 18px; height: 12px; margin-left: -9px; border-radius: 3px; background: ${T.accent}; animation: kr-uch 0.75s cubic-bezier(.5,0,.6,1) forwards; z-index: 2; }
        @keyframes kr-uch { 0% { transform: translateY(-10px); opacity: 0; } 25% { opacity: 1; } 100% { transform: translateY(40px) scale(0.7); opacity: 0; } }
        .kr-backend { display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; padding: 10px; transition: border-color 0.25s, box-shadow 0.25s; }
        .kr-backend.on { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.12)}; }
        .kr-jadval { display: flex; flex-direction: column; gap: 4px; background: ${CODE.bg}; color: ${CODE.text}; border-radius: 12px; padding: 10px 12px; font-size: 12px; min-height: 64px; }
        .kr-jh { display: flex; align-items: center; gap: 6px; font-weight: 800; color: ${CODE.punct}; font-size: 11px; letter-spacing: 0.04em; }
        .kr-jh .smap-ic { color: ${CODE.punct}; }
        .kr-bosh { color: ${CODE.comment}; font-style: italic; }
        .kr-q { padding: 2px 6px; border-radius: 5px; }
        .kr-q.yangi { animation: kr-qator 1.3s ease-out both; }
        @keyframes kr-qator { 0% { opacity: 0; transform: translateX(-8px); background: ${fon(T.accent, 0.5)}; } 30% { opacity: 1; transform: none; } 100% { background: transparent; } }
        /* === PILOT: 14-ekran — fayl jonli yoziladi === */
        .fl-yangi { background: rgba(255,255,255,0.1); animation: fl-kir 0.5s ease-out both; }
        @keyframes fl-kir { from { opacity: 0; } to { opacity: 1; } }
        .fl-bosh { color: ${CODE.comment}; font-style: italic; }
        @media (prefers-reduced-motion: reduce) {
          .smap-konvert, .smap-e, .smap-n { transition: none; }
          .smap-n, .smap-n::before, .smap-e.on, .smap-e.yangi, .smap-konvert.aylanma, .sm-spin, .sm-miltilla .shopwin-body, .sm-savat b, .fb-skelet, .fb-yangi, .fb-led.on, .fb-paket, .tg-xabar.men, .tg-db b, .kr-uchish, .kr-q.yangi, .fl-yangi { animation: none; }
          .smap-e.yangi { stroke-dashoffset: 0; }
          .smap-konvert.aylanma { left: 43%; top: 50%; }
        }

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
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }

        /* === OPSIYALAR === */

        .gchip { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; padding: 8px 13px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 3px 10px -5px rgba(${T.shadowBase},0.2); display: inline-flex; align-items: center; gap: 6px; } .gchip:hover:not(:disabled) { transform: translateY(-1px); } .gchip:disabled { opacity: 0.4; cursor: not-allowed; }

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
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI (radio) === */
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
        .frame-success { background: ${T.okFon}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        /* frame-warn — FAQAT haqiqiy xato/yiqilish (401/400/500, noto'g'ri tanlov): dangerSoft, yo'lakdagi rz-crash bilan bir tilda */
        .frame-warn { background: ${T.errFon}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(194,54,43,0.22); }

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
        .hint { background: ${T.bg}; border: 1.5px dashed ${T.ink2}; border-radius: 12px; padding: 14px 16px; font-size: clamp(13px,1.5vw,14px); color: ${T.ink2}; }

        /* === AI CARD === */
        .ai-card { background: ${T.paper}; border-radius: 14px; padding: 15px 17px; display: flex; flex-direction: column; gap: 11px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ai-row { display: flex; align-items: center; gap: 9px; } .ai-badge { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: #fff; background: ${T.accent}; padding: 3px 9px; border-radius: 6px; } .ai-bubble { font-size: 13px; color: ${T.ink2}; }
        .ai-code { background: ${CODE.bg}; border-radius: 9px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
        .ai-line { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; color: ${CODE.text}; cursor: pointer; padding: 7px 9px; border-radius: 6px; transition: all 0.15s; white-space: pre-wrap; } .ai-line:hover { background: rgba(255,255,255,0.06); }
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }
        .ai-prompt { font-size: 12px; color: ${T.ink2}; margin: 0; font-style: italic; } .note-h { font-weight: 700; font-size: 13px; margin: 0 0 4px; }
        .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; } .ta-bulb { font-size: 34px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; } .ta-sub { color: ${T.accent}; font-weight: 600; font-size: 13px; margin: 0; }

        /* === YAKUN === */
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink2}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }

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
        .lp-step.on { background: ${T.okFon}; color: ${T.ok}; box-shadow: inset 0 0 0 1.5px ${T.ok}55; }
        .lp-check { width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.ink2}55; transition: all 0.16s; }
        .lp-step.on .lp-check { background: ${T.ok}; color: #fff; box-shadow: none; animation: lp-check-pop 0.34s cubic-bezier(.3,1.5,.5,1); }
        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .lp-step-t { flex: 1; min-width: 0; }
        .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 13px; padding: 14px 20px; background: ${T.accent}; color: #fff; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.34); transition: all 0.18s; margin-top: 2px; }
        .lp-done-btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.5); }
        .lp-done-btn.is-done { background: ${T.okFon}; color: ${T.ok}; box-shadow: inset 0 0 0 1.5px ${T.ok}66; cursor: default; animation: lp-done-pop 0.44s cubic-bezier(.3,1.35,.5,1); }
        .lp-done-btn:disabled:not(.is-done) { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
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
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(255,79,40,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink2}; font-size: 11.5px; }
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
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(255,79,40,0.22); }

        /* === MENTOR STATISTIKASI (jonli test + yozma ish panellari) === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(255,79,40,0.5); }
        .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(255,79,40,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(255,79,40,0.55); } }
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
        .mstats-chip.ansc { background: rgba(255,79,40,0.10); } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.accent}; }
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
        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); }
        .mstats-verdict.good { background: ${T.okFon}; }
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

        /* ============ 6-MODUL · SHAHAR ARXITEKTURASI CSS ============ */

        /* TERMINAL (retyped — reusable qatlamdan tashqarida, shu yerda kerak) */
        .term { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .term-bar { background: #2D2D2D; padding: 8px 11px; display: flex; align-items: center; gap: 9px; }
        .term-title { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: #C9D1D9; }
        .term-body { background: #1E1E1E; padding: 12px 13px; min-height: 60px; }
        .tline { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.8; color: ${CODE.text}; word-break: break-word; }

        /* ===== SIGNAL SAYOHATI: signal → 📋 qoidalar varag'i → amal ===== */
        .bflow { display: flex; align-items: stretch; gap: 6px; flex-wrap: wrap; }
        .bnode { flex: 1; min-width: 84px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; text-align: center; background: ${T.paper}; border-radius: 13px; padding: 12px 9px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); opacity: 0.4; transform: scale(0.96); transition: all 0.35s cubic-bezier(.4,0,.2,1); }
        .bnode.on { opacity: 1; transform: scale(1); }
        .bnode.trig.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.3); }
        .bnode.sheet.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.3); }
        .bnode.sheet.thinking { animation: think-pulse 0.7s ease-in-out infinite; }
        .bnode.act.on { background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}, 0 8px 18px -6px rgba(31,122,77,0.3); }
        .bnode-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink}; line-height: 1.2; }
        .bnode-tag { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.06em; color: ${T.ink2}; }
        .bflow-arrow { align-self: center; font-size: 22px; font-weight: 800; color: ${T.ink2}; opacity: 0.35; transition: all 0.35s; }
        .bflow-arrow.on { color: ${T.accent}; opacity: 1; }
        @keyframes think-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }

        /* ===== 🎒 JIHOZLAR PANELI ===== */
        .gear-panel { display: flex; flex-wrap: wrap; gap: 8px; }
        .gear-slot { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 76px; background: ${T.paper}; border-radius: 12px; padding: 10px 9px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); opacity: 0.4; }
        .gear-slot.on { opacity: 1; box-shadow: inset 0 0 0 1.5px ${T.ok}, 0 6px 16px -6px rgba(31,122,77,0.26); background: ${T.okFon}; }
        .gear-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 10px; color: ${T.ink}; text-align: center; }

        /* ===== 🔑 XIZMAT OYNASI (s5) ===== */
        .sw-chain { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
        .sw-node { position: relative; display: flex; flex-direction: column; align-items: center; gap: 2px; font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.ink}; background: ${T.paper}; border-radius: 12px; padding: 10px 12px; min-width: 78px; text-align: center; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .sw-arrow { color: ${T.ink2}; font-weight: 800; font-size: 16px; transition: opacity 0.25s; } .sw-arrow.off { opacity: 0.3; }
        .sw-socket.has-key { box-shadow: inset 0 0 0 1.5px ${T.ok}; }
        .sw-socket.empty { box-shadow: inset 0 0 0 1.5px ${T.err}; background: ${T.errFon}; }
        .sw-chip { font-size: 20px; cursor: grab; touch-action: none; user-select: none; margin-top: 4px; }
        .sw-chip:active { cursor: grabbing; }
        .sw-401 { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; color: ${T.err}; margin-top: 4px; }
        .sw-outzone { display: flex; align-items: center; gap: 10px; background: ${T.paper}; border-radius: 12px; padding: 12px 14px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); min-height: 20px; }
        .sw-outzone-empty { border: 1.5px dashed ${T.ink2}55; box-shadow: none; background: transparent; }

        /* ===== holat chizig'i (status indikatori) ===== */
        .bot-status { display: flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; background: ${T.paper}; border-radius: 12px; padding: 12px 15px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16); }
        .bot-status-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.ink2}; flex-shrink: 0; }
        .bot-status.on .bot-status-dot { background: ${T.ok}; box-shadow: 0 0 8px rgba(31,122,77,0.55); }
        .bot-status.deaf .bot-status-dot { background: #E8A13A; }
        .bot-status.danger { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 1.5px ${T.err}55; animation: bot-status-danger 1.4s ease-in-out infinite; }
        .bot-status.danger .bot-status-dot { background: ${T.err}; box-shadow: 0 0 8px rgba(194,54,43,0.55); }
        @keyframes bot-status-danger { 0%,100% { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 1.5px ${T.err}55; } 50% { box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.16), 0 0 0 5px ${T.err}22; } }
        @media (prefers-reduced-motion: reduce) { .bot-status.danger { animation: none; } }

        /* ===== 📋 TUNGI SMENA (s7 markaziy) ===== */
        .ns-sheet { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 14px; padding: 12px; box-shadow: 0 8px 20px -6px rgba(${T.shadowBase},0.14); }
        .ns-row { display: flex; align-items: center; gap: 8px; }
        .ns-rown { width: 20px; height: 20px; border-radius: 6px; background: ${T.bg}; color: ${T.ink2}; font-weight: 800; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ns-cell { flex: 1; min-height: 40px; border-radius: 10px; border: 1.5px dashed ${T.ink2}66; display: flex; align-items: center; padding: 4px 6px; }
        .ns-cell.filled { border-style: solid; border-color: ${T.line}; }
        .ns-eq { color: ${T.ink2}; font-weight: 800; }
        .ns-hint { color: ${T.ink2}; font-style: italic; font-size: 11.5px; margin: 0 auto; }
        .ns-chip { font-family: 'Manrope'; font-weight: 700; font-size: 12px; border: none; border-radius: 9px; padding: 7px 10px; cursor: grab; touch-action: none; user-select: none; width: 100%; text-align: left; }
        .ns-chip:active { cursor: grabbing; }
        .ns-chip.sig { background: linear-gradient(170deg, #FF8A3D, ${T.accent}); color: #fff; }
        .ns-chip.act { background: linear-gradient(170deg, #34B27A, ${T.ok}); color: #fff; }
        .ns-chip.pool { width: auto; }
        .ns-pools { display: flex; flex-direction: column; gap: 8px; }
        .ns-pool-row { display: flex; flex-wrap: wrap; gap: 6px; min-height: 36px; padding: 8px; border-radius: 12px; background: ${T.bg}; }
        .ns-shift { display: flex; flex-direction: column; gap: 8px; }
        .ns-shift-cards { display: flex; flex-direction: column; gap: 7px; }
        .ns-cust { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: ${T.paper}; border-radius: 11px; padding: 10px 13px; box-shadow: 0 5px 14px -7px rgba(${T.shadowBase},0.14); transition: all 0.4s ease; }
        .ns-cust-name { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink}; }
        .ns-cust-msg { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .ns-cust.ok { box-shadow: inset 0 0 0 1.5px ${T.ok}; } .ns-cust.ok .ns-cust-msg { color: ${T.ok}; }
        .ns-cust.wrong { box-shadow: inset 0 0 0 1.5px #E8A13A; } .ns-cust.wrong .ns-cust-msg { color: #B45309; }
        .ns-cust.silent { opacity: 0.45; transform: translateY(4px) grayscale(1); box-shadow: inset 0 0 0 1.5px ${T.ink2}; } .ns-cust.silent .ns-cust-msg { color: ${T.ink2}; }
        .ns-cust.wait { opacity: 0.55; }
        .ns-cust-dots { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; color: ${T.ink2}; animation: ns-dots-pulse 3s ease-in-out infinite; }
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
        .pick-row.picked { background: ${T.okFon}; color: ${T.ok}; box-shadow: inset 0 0 0 1.5px ${T.ok}; cursor: default; }
        .pick-plus { margin-left: auto; font-weight: 700; color: ${T.ink2}; } .pick-row.picked .pick-plus { color: ${T.ok}; } .pick-row.sel .pick-plus { color: ${T.accent}; }

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
        .itm-fix { margin-top: 4px; font-family: 'Manrope'; font-weight: 700; font-size: 10px; background: ${T.okFon}; color: ${T.ok}; border: none; border-radius: 8px; padding: 3px 7px; cursor: pointer; }

        /* Bo'shliqlarni to'ldirish (s13 builder) */
        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .blank-group { display: flex; flex-direction: column; gap: 6px; }
        .blank-group .bg-lbl { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .blank-row { display: flex; flex-wrap: wrap; gap: 7px; }

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi. Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        .gchip.tap-hint, .btn-soft.tap-hint, .itm-card.tap-hint { animation: tap-hint-pulse 1.9s ease-in-out infinite; }

        /* to'g'ri terilganda — qadamlar KETMA-KET tasdiqlanadi (yuqoridan pastga to'lqin) */
        /* SNAP — bo'lak slotga tushganda "qulflandi" hissi (fill-mode YO'Q — sudrash transform'i erkin qolsin) */

        /* tap-hint affordance — bosilmagan kartalar "meni bos" deb pulslaydi (11.7). Bosilgach pulsatsiya TO'XTAYDI = progress signali. */
        /* 11.15 — jonli badge xira, hover'da tiniq (proyektorda xalaqit bermaydi) */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(58,53,48,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        /* ===== 🏙️ SHAHAR KONTENT KOMPONENTLARI (arxitektura darsi) ===== */
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope'; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        /* VS CODE FAYL */
        .editor { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.2); }
        .editor-bar { background: #2D2D2D; padding: 7px 11px; display: flex; align-items: center; gap: 9px; }
        .editor-tab { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: #C9D1D9; background: #1E1E1E; padding: 4px 11px; border-radius: 6px 6px 0 0; word-break: break-all; }
        .editor-body { background: ${CODE.bg}; padding: 12px 14px; }
        .editor-code { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(11px,1.4vw,12.5px); line-height: 1.75; color: ${CODE.text}; white-space: pre-wrap; word-break: break-word; margin: 0; }

        /* BRAUZER OYNA (onlayn xarid sayti) */
        .shopwin { border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px -8px rgba(${T.shadowBase},0.3); border: 1px solid rgba(167,166,162,0.22); }
        .shopwin-bar { background: #E8E4DC; padding: 8px 12px; display: flex; align-items: center; gap: 9px; }
        .sw-dots { display: flex; gap: 5px; } .sw-dots i { width: 9px; height: 9px; border-radius: 50%; } .sw-dots i:first-child { background: #ff5f57; } .sw-dots i:nth-child(2) { background: #febc2e; } .sw-dots i:nth-child(3) { background: #28c840; }
        .sw-url { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; background: #fff; padding: 3px 10px; border-radius: 6px; }
        .shopwin-body { background: #fff; padding: 14px; display: flex; flex-direction: column; gap: 8px; }
        .sw-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; background: ${T.bg}; border-radius: 9px; font-size: 14px; color: ${T.ink}; }
        .sw-price { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; color: ${T.ink2}; }
        .sw-btn { align-self: flex-start; background: ${T.accent}; color: #fff; border: none; border-radius: 9px; padding: 8px 16px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; cursor: default; }
        .sw-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.accent}; text-align: center; }
        .comp-pill { font-family: 'Manrope'; font-weight: 700; font-size: 12px; padding: 5px 11px; border-radius: 99px; background: ${T.paper}; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.2); }
        @keyframes rev-in { from { opacity: 0; transform: translateY(-6px) scale(0.96); } to { opacity: 1; transform: none; } }
        .r-in { animation: rev-in 0.4s ease-out both; }

        /* ===== ARIZA OQIMI (data-flow tracer) ===== */
        .flow-row { display: flex; align-items: center; flex-wrap: wrap; gap: 3px; justify-content: center; padding: 8px 0; }
        .flow-row.mini { gap: 2px; }
        .fl-node { display: flex; flex-direction: column; align-items: center; gap: 3px; background: ${T.paper}; border-radius: 12px; padding: 10px 11px; min-width: 74px; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.16); transition: all 0.3s; opacity: 0.5; }
        .flow-row.mini .fl-node { min-width: 62px; padding: 8px 8px; opacity: 1; }
        .fl-node.done { opacity: 1; background: ${T.okFon}; box-shadow: inset 0 0 0 1.5px ${T.ok}; }
        .fl-node.on { opacity: 1; background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 18px -4px rgba(255,79,40,0.45); transform: translateY(-3px); animation: fl-pulse 1.1s infinite ease-in-out; }
        .fl-node.broken { opacity: 1; background: ${T.errFon}; box-shadow: inset 0 0 0 2px ${T.err}; }
        @keyframes fl-pulse { 0%,100% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 16px -6px rgba(255,79,40,0.4); } 50% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 24px -2px rgba(255,79,40,0.65); } }
        .fl-node-ico { font-size: 19px; line-height: 1; }
        .fl-node-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 9.5px; color: ${T.ink}; text-align: center; }
        .fl-track { position: relative; width: 26px; height: 3px; background: rgba(167,166,162,0.4); border-radius: 2px; flex-shrink: 0; }
        .fl-packet { position: absolute; top: -5px; left: 0; width: 13px; height: 13px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 10px 2px rgba(255,79,40,0.6); animation: fl-move 0.65s ease forwards; }
        @keyframes fl-move { from { left: -7px; opacity: 0; } 25% { opacity: 1; } to { left: calc(100% - 6px); opacity: 1; } }

        /* ===== DARVOZALAR XARITASI (ko'p eshik) ===== */
        .clients-map { display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; padding: 6px 0; }
        .cm-clients { display: flex; flex-direction: column; gap: 7px; }
        .cm-client { display: flex; align-items: center; gap: 8px; background: ${T.paper}; border-radius: 10px; padding: 8px 12px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); opacity: 0.5; transition: all 0.25s; min-width: 120px; }
        .cm-client.on { opacity: 1; box-shadow: inset 0 0 0 1.5px ${T.ok}, 0 5px 14px -6px rgba(31,122,77,0.26); }
        .cm-client.sel { opacity: 1; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .cm-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink}; }
        .cm-arrow { color: ${T.ink2}; font-weight: 700; font-size: 18px; }
        .cm-core { display: flex; flex-direction: column; gap: 7px; }
        .cm-core-node { display: flex; align-items: center; gap: 8px; background: ${T.ink}; color: #fff; border-radius: 10px; padding: 8px 14px; font-size: 17px; }
        .cm-core-node span { font-family: 'Manrope'; font-weight: 700; font-size: 12px; }

        /* ===== ARXIV XOTIRA QUTISI ===== */
        .mem-box { background: ${T.paper}; border-radius: 12px; padding: 14px 16px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.16); transition: all 0.35s; }
        .mem-box.keep { background: ${T.okFon}; }
        .mem-box.gone { background: ${T.errFon}; }

        /* ===== AGENT / AI KARTA (keyingi dars) ===== */
        .agent-card { background: ${T.accentSoft}; border-radius: 10px; padding: 13px 16px; }
        .agent-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.accent}; display: block; margin-bottom: 5px; letter-spacing: 0.04em; }
        .agent-msg { font-family: 'Manrope'; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; margin: 0; line-height: 1.55; }
        .agent-msg b { color: ${T.ink}; }

        /* ===== AGENT STEP (case: to'liq tizim) ===== */
        .agent-step { display: flex; flex-direction: column; gap: 4px; background: ${T.paper}; border-radius: 10px; padding: 10px 13px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .agent-step.done { background: ${T.okFon}; }
        .as-phase { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; color: ${T.accent}; letter-spacing: 0.04em; }
        .agent-step.done .as-phase { color: ${T.ok}; }
        .as-txt { font-family: 'Manrope'; font-weight: 500; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; }

        /* S21 — har og'ir animatsiyaga TINCH variant. */
        @media (prefers-reduced-motion: reduce) {
          .itm-card.tap-hint, .gchip.tap-hint, .btn-soft.tap-hint,
          .shake, .fl-node.on { animation: none !important; }
        }

      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr({ uz: 'Tizim arxitekturasi darsi', ru: 'Урок об архитектуре системы' })} />
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
