import React, { useState, useEffect, useLayoutEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// 11-Modul · 8-dars «Arxitektura va platforma: web yoki mobil ilova» (kalit m9-08) — MD v3: feedback/F-1005-11modul/08-PlatformChoice-v3.md (GATE M, 08-FILTR).
// Skeletdan (src/skelet/NamunaDars.jsx, konveyer 04.10): infra (Stage · Mentor · Zoomable · jonli ball · test · takrorlash oynasi · nishonlar · arena · podium) — TEGILMAGAN.
// 20 ekran: 0 QKirish · 1 QReja · 2, 3, 5, 6, 10, 12 QTushuncha · 4, 7, 9, 11 test (QTest) · 8 QKod (HtmlCompiler) · 13 QMustaqil · 14 QTartib (final) ·
//   15, 16 amaliyot bloklari (QBlok) · podium · kartochkalar (QKartochka) · yakun (QYakun).
// Bitta vizual — «Maydon Jamoa chizmasi» (JAMOA_CHIZMA + NAMUNA_OYINLAR; TORT_SAVOL, QOSHILISH_YOLI): chapda ramka (telefon/brauzer), o'rtada Backend, o'ngda Database.
// Saqlaydi: pm-m9d8-platforma = { trek: 'web' | 'mobil', javoblar: [4], halQiluvchi: [1–2], asos } (9–14-darslar o'qiydi) · pm-m9d8-code (kod oynasi qoralamasi).
// O'qiydi: pm-m9d5-prd.funksiyalar (A1 prompti) — kalit yo'q bo'lsa ham ekran ishlaydi.
// JONLI: useLiveSession + INLINE_KEYS + CodeStrike arena + Podium. PRODUCTION: <style> ichidagi @import OLIB TASHLANADI.
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
import { qolipRang, fon, qolipCss, useTugadi, QTugma, QChip, QBashorat, QQadamlar, QXato, QIzoh, QKirish, QReja, QTushuncha, QTest, QTestJavob, QTartib, QKod, QMustaqil, QBlok, QKartochka, QYakun } from '../qolip/index.jsx';
import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';







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

const LESSON_META = { lessonId: 'm9-08-v1', lessonTitle: { uz: "Arxitektura va platforma: web yoki mobil ilova", ru: 'Архитектура и платформа: веб или мобильное приложение' } };
// 20 ekran (MD v3): kirish → reja → tushuncha ×2 → test → tushuncha ×2 → test → kod → test → tushuncha → test → tushuncha → mustaqil → final → amaliyot ×2 → podium → kartochkalar → yakun
const HW_TOKENS = [
  { t: { uz: 'chizma', ru: 'схема' }, l: 8, tp: 22, s: 13, d: 6 },
  { t: { uz: 'stek', ru: 'стек' }, l: 68, tp: 16, s: 12, d: 7.5 },
  { t: 'README', l: 24, tp: 70, s: 12, d: 8.5 },
  { t: { uz: 'platforma', ru: 'платформа' }, l: 78, tp: 68, s: 13, d: 6.8 }
];
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's12', type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's14', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'a1',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },
  { id: 'sflash',   type: 'flashcards', template: 'custom', scored: false, scope: null },
  { id: 's19', type: 'summary',     template: 'custom',   scored: false, scope: null }
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

// ⚡ JONLI: javob kaliti (ekran id → to'g'ri variant indeksi). MD ✔: s4 C · s7 A · s9 D · s11 B · s14 — final (picked 0/1 sentinel). `practice: -1` — sentinel (QKod, mustaqil ish, bloklar).
const INLINE_KEYS = { s4: 2, s7: 0, s9: 3, s11: 1, s14: 0, practice: -1 };
// 📖 RECAPS — har ballik test uchun 3 karta (kalit = ekran INDEKSI; S-026: kod qatori bor joyda kod)
const rcKod = (k) => <code className="qcode">{k}</code>;
const RECAPS = {
  4: {
    title: { uz: '8 qatorlardan sanaladi', ru: '8 считается по строкам' },
    cards: [
      { ic: null, h: { uz: <>Har qo'shilish — {rcKod('ishtirokchilar')} dagi bitta qator</>, ru: <>Каждое присоединение — одна строка в {rcKod('ishtirokchilar')}</> }, vis: rcKod('oyin_id · oyinchi_id · holat') },
      { ic: null, h: { uz: "Shu o'yinga qo'shilganlar sanaladi — 8", ru: 'Считаются присоединившиеся к этой игре — 8' }, vis: rcKod('holat: qoshildi') },
      { ic: null, h: { uz: <>10 — {rcKod('oyinlar')} dagi {rcKod('kerak')} ustuni</>, ru: <>10 — столбец {rcKod('kerak')} в {rcKod('oyinlar')}</> }, vis: rcKod('kerak: 10'), ask: { uz: "O'yinchi o'yindan chiqsa, «8 / 10» qanday o'zgaradi?", ru: 'Если игрок выйдет из игры, как изменится «8 / 10»?' } }
    ]
  },
  7: {
    title: { uz: "Ekran so'raganda yangilanadi", ru: 'Экран обновляется, когда запрашивает' },
    cards: [
      { ic: null, h: { uz: "1 · Ekran ochilganda ilova Backend'dan so'raydi.", ru: '1 · При открытии экрана приложение запрашивает Backend.' } },
      { ic: null, h: { uz: "2 · Pastga tortib yangilaganda yana so'raydi.", ru: '2 · При потягивании вниз запрашивает снова.' } },
      { ic: null, h: { uz: "3 · Ekran o'zi yangilanishi (WebSocket) — keyinroq ufqda, 12-Modulda.", ru: '3 · Самообновление экрана (WebSocket) — позже, в 12-м модуле.' }, ask: { uz: "Tashkilotchi ekranni yangilamasa, «Kelaman» belgilarini qachon ko'radi?", ru: 'Если организатор не обновит экран, когда он увидит отметки «Kelaman»?' } }
    ]
  },
  9: {
    title: { uz: <>Tugmaga {rcKod('korsat')} ulanadi</>, ru: <>К кнопке подключается {rcKod('korsat')}</> },
    cards: [
      { ic: null, h: { uz: "Ochilganda bir marta so'raladi", ru: 'При открытии запрашивается один раз' }, vis: rcKod('korsat();') },
      { ic: null, h: { uz: "Tugma bosilganda yana so'raladi", ru: 'При нажатии кнопки запрашивается снова' }, vis: rcKod("yangila.addEventListener('click', korsat)") },
      { ic: null, h: { uz: <>{rcKod('korsat')} so'raydi va ekranga yozadi</>, ru: <>{rcKod('korsat')} запрашивает и пишет на экран</> }, vis: rcKod('son.textContent = sora();'), ask: { uz: <>{rcKod('korsat()')} ni ochilganda chaqirmasak, ekranda nima turadi?</>, ru: <>Если не вызвать {rcKod('korsat()')} при открытии, что будет на экране?</> } }
    ]
  },
  11: {
    title: { uz: "To'rt savol", ru: 'Четыре вопроса' },
    cards: [
      { ic: null, h: { uz: "1 · Qayerda ochadi: yo'lda telefonda yoki uyda kompyuterda.", ru: '1 · Где открывает: в пути на телефоне или дома на компьютере.' } },
      { ic: null, h: { uz: '2 · Telefon imkoniyati kerakmi · 3 · Havola bilan ulashish muhimmi.', ru: '2 · Нужны ли возможности телефона · 3 · Важно ли делиться ссылкой.' } },
      { ic: null, h: { uz: '4 · Qaysi stekni yaxshiroq bilasiz — natija: web yoki mobil + bir gapli asos.', ru: '4 · Какой стек вы знаете лучше — итог: веб или мобильное + обоснование одним предложением.' }, ask: { uz: 'Savollar ikki tomonga tortsa, qanday tanlaysiz?', ru: 'Если вопросы тянут в разные стороны, как выбрать?' } }
    ]
  },
  14: {
    title: { uz: "Qo'shilish yo'li", ru: 'Путь присоединения' },
    cards: [
      { ic: null, h: { uz: "1 · Bosish · 2 · So'rov · 3 · Backend tekshiradi", ru: '1 · Нажатие · 2 · Запрос · 3 · Backend проверяет' } },
      { ic: null, h: { uz: <>4 · Database {rcKod('ishtirokchilar')} ga qator yozadi</>, ru: <>4 · Database записывает строку в {rcKod('ishtirokchilar')}</> } },
      { ic: null, h: { uz: "5 · Boshqa telefon pastga tortadi · 6 · «9 / 10» ko'rinadi", ru: '5 · Другой телефон тянет вниз · 6 · видно «9 / 10»' }, ask: { uz: "5-qadam bo'lmasa, boshqa o'yinchi nimani ko'radi?", ru: 'Если не будет 5-го шага, что увидит другой игрок?' } }
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

// ===== DARSNING O'Z VIZUALI — «Maydon Jamoa chizmasi» (MD: bitta vizual, 163/180; SABOQ 21–23). Bitta manba: NAMUNA_OYINLAR + JAMOA_CHIZMA + TORT_SAVOL + QOSHILISH_YOLI =====
// qolip-maket: pc-tel-btn pc-yangila pc-jadval pc-no-btn
// Chapda ramka (telefon — ilova, brauzer — sayt; o'lcham barqaror 172×272, texnologiya yorlig'i ramka ustida) → o'rtada Backend → o'ngda Database (uch jadval, `_id` chiziqlari SVG).
// Holatlar: kulrang (xira — hali ochilmagan) → oq → accent (on — joriy) → yashil (ok — ishladi). Konvert — so'rov (manba va nishon DOM dan o'lchanadi). Kam harakat rejimida uchish yo'q, holat birdan almashadi (DE-200).
const cxx = (...a) => a.filter(Boolean).join(' ');
// MD belgilari: `kod` — chip, **qalin** — <b>. Satr bo'lmasa (JSX) — o'zgarishsiz.
const tx = (o) => {
  const s = tr(o);
  if (typeof s !== 'string' || (!s.includes('`') && !s.includes('**'))) return s;
  const out = [];
  s.split('`').forEach((p, i) => {
    if (i % 2) { out.push(<code className="qcode" key={'k' + i}>{p}</code>); return; }
    p.split('**').forEach((q, j) => { if (q) out.push(j % 2 ? <b key={'b' + i + '-' + j}>{q}</b> : q); });
  });
  return out;
};
const kamHarakat = () => typeof window !== 'undefined' && !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
// Kechiktirilgan qadamlar: ekrandan chiqilganda hammasi bekor bo'ladi
const useKeyin = () => {
  const ids = useRef([]);
  useEffect(() => () => { ids.current.forEach(clearTimeout); ids.current = []; }, []);
  return useCallback((fn, ms) => { ids.current.push(setTimeout(fn, ms)); }, []);
};
const lsOqi = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsYoz = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* xotira yopiq — dars ishlayveradi */ } };
// Saqlanadigan natija (tayanch 8, aynan): 9–14-darslar o'qiydi — nomlar o'zgarmaydi
const PLATFORMA_KEY = 'pm-m9d8-platforma';
const trekOqi = () => { const o = lsOqi(PLATFORMA_KEY); return o && (o.trek === 'mobil' || o.trek === 'web') ? o.trek : null; };
const halqa = (on) => (on ? 'pc-halqa' : undefined);

// Namuna o'yinlar (tayanch 9.2, aynan; 7-dars bilan bir xil)
const NAMUNA_OYINLAR = [
  { id: 1, kun: { uz: 'Shanba', ru: 'Суббота' }, soat: '18:00', maydon: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, son: 8, kerak: 10 },
  { id: 2, kun: { uz: 'Shanba', ru: 'Суббота' }, soat: '20:00', maydon: { uz: 'Maktab maydoni', ru: 'Школьное поле' }, son: 6, kerak: 10 },
  { id: 3, kun: { uz: 'Yakshanba', ru: 'Воскресенье' }, soat: '10:00', maydon: { uz: 'Park maydoni', ru: 'Поле в парке' }, son: 4, kerak: 8 },
  { id: 4, kun: { uz: 'Yakshanba', ru: 'Воскресенье' }, soat: '17:00', maydon: { uz: 'Mahalla maydoni', ru: 'Поле махалли' }, son: 9, kerak: 10 }
];
// Chizma: qismlar, uch jadval va ustunlari (tayanch 1.6, aynan), bog'lovchi ustunlar, real vaqt nuqtalari, trek bo'yicha birinchi qism
const JAMOA_CHIZMA = {
  ilova: {
    mobil: { nom: { uz: 'ilova', ru: 'приложение' }, tex: 'Expo', texTola: 'Expo (React Native)', joy: { uz: 'telefonda — Expo Go orqali', ru: 'на телефоне — через Expo Go' } },
    web: { nom: { uz: 'sayt', ru: 'сайт' }, tex: 'React', texTola: 'React (Vite)', joy: { uz: 'Netlify', ru: 'Netlify' } }
  },
  backend: { tex: 'NestJS', joy: 'Render' },
  db: { tex: 'Neon', texTola: 'Neon (PostgreSQL)' },
  jadvallar: [
    { nom: 'oyinchilar', ustun: ['id', 'ism', 'telefon', 'parol_hash'], oz: ['id'] },
    { nom: 'oyinlar', ustun: ['id', 'kun', 'soat', 'maydon', 'kerak', 'tashkilotchi_id', 'yaratilgan'], oz: ['id', 'yaratilgan'] },
    { nom: 'ishtirokchilar', ustun: ['oyin_id', 'oyinchi_id', 'holat', 'yaratilgan'], oz: ['yaratilgan'] }
  ],
  bog: { tashkilotchi_id: 'oyinchilar', oyin_id: 'oyinlar', oyinchi_id: 'oyinchilar' },
  realVaqt: ['son', 'doira', 'kelaman']
};
const TEL_EKRAN = { oyinlar: { uz: "O'yinlar", ru: 'Игры' }, elon: { uz: "E'lon berish", ru: 'Подать объявление' }, royxat: { uz: "Ro'yxatdan o'tish", ru: 'Регистрация' } };
const ELON_FORMA = [
  { k: 'kun', l: { uz: 'Kun', ru: 'День' }, v: { uz: 'Yakshanba', ru: 'Воскресенье' } },
  { k: 'soat', l: { uz: 'Soat', ru: 'Время' }, v: { uz: '10:00', ru: '10:00' } },
  { k: 'maydon', l: { uz: 'Maydon', ru: 'Поле' }, v: { uz: 'Park maydoni', ru: 'Поле в парке' } },
  { k: 'kerak', l: { uz: 'Nechta odam', ru: 'Сколько людей' }, v: { uz: '8', ru: '8' } }
];
const ROYXAT_FORMA = [{ uz: 'Ism', ru: 'Имя' }, { uz: 'Telefon', ru: 'Телефон' }, { uz: 'Parol', ru: 'Пароль' }];
const KELADI = [0, 1, 3, 4, 6]; // o'yin kuni ko'rinishi: «Kelaman» belgisi bor doiralar (5-ekran, faqat shu yerda)
const MjNom = () => <b className="pc-mj">Maydon Jamoa</b>;
// Real vaqt nuqtasi belgisi: accent nuqta-halqa + yonida kichik konvert-belgi (boshqa telefondan keladi)
const RvBelgi = () => <span className="pc-rv" aria-hidden="true"><span className="pc-kb" /></span>;

// Ilova ekranlari (ramka ichida)
const OyinlarEkran = ({ royxat = NAMUNA_OYINLAR, yangiId, onOyinlar, oyinlarHalqa }) => (
  <span className="pc-oyinlar">
    <b className="pc-ek-sar">{tr(TEL_EKRAN.oyinlar)}</b>
    {royxat.map((o, i) => (
      <span key={o.id} className={cxx('pc-karta', yangiId === o.id && 'yangi')} style={{ '--d': (0.04 + i * 0.07) + 's' }}>
        <b>{tr(o.kun)}, {o.soat}</b>
        <span>{tr(o.maydon)} · <b className="pc-k-son">{o.son} / {o.kerak}</b></span>
      </span>
    ))}
    {onOyinlar !== undefined && <button type="button" className={cxx('pc-tel-btn', 'tab', halqa(oyinlarHalqa))} disabled={!onOyinlar} onClick={onOyinlar}>{tr(TEL_EKRAN.oyinlar)}</button>}
  </span>
);
// «O'yin» ekrani: kun va soat · maydon · «8 / 10» · 10 ta joy (to'la doiralar va uzuq chiziqli bo'sh joylar) · «Qo'shilaman»
const OyinEkran = ({ son = 8, pop, qoshildi, onQoshil, qoshilHalqa, bosildi, eski, belgi = {}, joriy, kun, tugmaXira }) => {
  const o = NAMUNA_OYINLAR[0];
  const tugma = kun ? { uz: 'Kelaman', ru: 'Приду' } : qoshildi ? { uz: "Qo'shildingiz", ru: 'Вы присоединились' } : { uz: "Qo'shilaman", ru: 'Присоединяюсь' };
  return (
    <span className="pc-oyin">
      <span className="pc-oyin-orqa">‹ {tr(TEL_EKRAN.oyinlar)}</span>
      <span className={cxx('pc-joy', joriy === 'vaqt' && 'joriy')}>
        <b className="pc-oyin-sar">{tr(o.kun)}, {o.soat}</b>
        <span className="pc-oyin-maydon">{tr(o.maydon)}</span>
        {belgi.vaqt && <span className="pc-yozilgan">{tr({ uz: "e'londa yozilgan", ru: 'указано в объявлении' })}</span>}
      </span>
      <span className={cxx('pc-joy', 'pc-son-q', joriy === 'son' && 'joriy')}>
        <b key={String(son) + (pop ? 'p' : '')} className={cxx('pc-son', pop && 'pop', son === null && 'kut')}>{son === null ? '…' : son} / {o.kerak}</b>
        {eski && <span className="pc-eski">{tr({ uz: 'eski', ru: 'старое' })}</span>}
        {belgi.son && <RvBelgi />}
      </span>
      <span className={cxx('pc-joy', 'pc-doiralar', (joriy === 'doira' || joriy === 'kelaman') && 'joriy')}>
        {Array.from({ length: o.kerak }, (_, i) => <i key={i} className={cxx(son !== null && i < son && 'bor', pop && i === son - 1 && 'yangi', kun && KELADI.includes(i) && 'kel', kun && belgi.kelaman && KELADI.includes(i) && 'rv')} />)}
        {belgi.doira && <RvBelgi />}
      </span>
      {onQoshil !== undefined
        ? <button type="button" className={cxx('pc-tel-btn', bosildi && 'bos', qoshildi && 'off', halqa(qoshilHalqa))} disabled={!onQoshil || qoshildi || tugmaXira} onClick={onQoshil}>{tr(tugma)}</button>
        : <span className={cxx('pc-tel-btn', qoshildi && 'off')}>{tr(tugma)}</span>}
    </span>
  );
};
const ElonEkran = ({ joriy = [], onYubor, yuborHalqa, bosildi }) => {
  const yJoriy = joriy.includes('yubor');
  return (
  <span className="pc-forma">
    <b className="pc-ek-sar">{tr(TEL_EKRAN.elon)}</b>
    {ELON_FORMA.map(f => <span key={f.k} className={cxx('pc-maydon', joriy.includes(f.k) && 'joriy')}><small>{tr(f.l)}</small>{tr(f.v)}</span>)}
    {onYubor !== undefined
      ? <button type="button" className={cxx('pc-tel-btn', bosildi && 'bos', halqa(yuborHalqa))} disabled={!onYubor} onClick={onYubor}>{tr({ uz: 'Yuborish', ru: 'Отправить' })}</button>
      : <span className={cxx('pc-tel-btn', yJoriy && 'joriy')}>{tr({ uz: 'Yuborish', ru: 'Отправить' })}</span>}
  </span>
  );
};
const RoyxatEkran = ({ joriy }) => (
  <span className="pc-forma">
    <b className="pc-ek-sar">{tr(TEL_EKRAN.royxat)}</b>
    {ROYXAT_FORMA.map((f, i) => <span key={i} className={cxx('pc-maydon', 'bosh', joriy && 'joriy')}>{tr(f)}</span>)}
    <span className="pc-tel-btn">{tr(TEL_EKRAN.royxat)}</span>
  </span>
);
// Ramka: telefon (ilova) yoki brauzer oynasi (sayt). Ustida — texnologiya yorlig'i yoki rol yorlig'i; ichida «Maydon Jamoa» o'z rangida (logotip yo'q)
const Ramka = ({ tur = 'tel', yorliq, rol, chip, onYangila, yangilaHalqa, oqar, ekranProps = {}, ust, children, className }) => (
  <div className={cxx('pc-ramka', className)}>
    {rol && <span className={cxx('pc-rol', rol.k)}>{rol.t}</span>}
    {yorliq && <span key={yorliq} className="pc-tex">{yorliq}</span>}
    {tur === 'web' ? (
      <div className="pc-brauzer" data-r="web">
        <span className="pc-br-bar">
          {onYangila !== undefined && <button type="button" className={cxx('pc-yangila', halqa(yangilaHalqa))} disabled={!onYangila} onClick={onYangila} aria-label={tr({ uz: 'Yangilash', ru: 'Обновить' })} title={tr({ uz: 'Yangilash', ru: 'Обновить' })}>↻</button>}
          <span className="pc-br-manzil">maydon-jamoa</span>
        </span>
        <span className="pc-br-nom"><MjNom /></span>
        <div className="pc-ekran">{children}</div>
        {oqar && <span className="pc-oqar" aria-hidden="true" />}
      </div>
    ) : (
      <div className="pc-tel" data-r="tel">
        <span className="pc-tel-bar"><MjNom /></span>
        {ust}
        <div {...ekranProps} className={cxx('pc-ekran', ekranProps.className)}>{children}</div>
        {oqar && <span className="pc-oqar" aria-hidden="true" />}
      </div>
    )}
    {chip && <span key={chip} className="pc-joy-chip">{chip}</span>}
  </div>
);
// Backend tuguni: nom (texnologiya 12-ekrangacha yozilmaydi) · ichida bir qatorli holat · ostida bitta so'z
const BeTugun = ({ holat, tex, qator, ichi, ichiK, soz, ozg }) => (
  <div className="pc-tg-ust">
    <div className={cxx('pc-be', holat)} data-n="be">
      <span className="pc-tg-h"><b>Backend</b>{tex && <span className="pc-tg-tex"> · {tex}</span>}</span>
      {qator && <code key={qator} className="pc-tg-q">{qator}</code>}
      {ichi && <span key={ichiK || ichi} className="pc-tg-ichi">{ichi}</span>}
      {ozg && <span key={ozg} className="pc-ozg">{tr({ uz: "o'zgarmadi ✓", ru: 'не изменилось ✓' })}</span>}
    </div>
    {soz && <span className="pc-soz fade-step">{soz}</span>}
  </div>
);
// `_id` chiziqlari: jadval kartasidan bog'langan jadvalga (SVG, DOM dan o'lchanadi — ⛶ va telefonda ham)
const useBoglar = (ref, kalit) => {
  const [yollar, setYollar] = useState([]);
  useLayoutEffect(() => {
    const el = ref.current; if (!el || !kalit) { setYollar([]); return undefined; }
    const olch = () => {
      const br = el.getBoundingClientRect(); const z = el.offsetWidth ? br.width / el.offsetWidth : 1;
      const rel = (r) => ({ l: (r.left - br.left) / z, r: (r.right - br.left) / z, t: (r.top - br.top) / z, b: (r.bottom - br.top) / z });
      const W = el.offsetWidth; const out = [];
      el.querySelectorAll('[data-u]').forEach((u) => {
        const nom = u.getAttribute('data-u'); const ga = JAMOA_CHIZMA.bog[nom]; if (!ga) return;
        const karta = u.closest('[data-j]'); const nish = el.querySelector('[data-j="' + ga + '"]'); if (!karta || !nish) return;
        const a = rel(u.getBoundingClientRect()), c = rel(karta.getBoundingClientRect()), t = rel(nish.getBoundingClientRect());
        const R = W - 9 - out.length * 8, x0 = (a.l + a.r) / 2, yb = c.b + 3, yt = t.t + 13;
        out.push({ k: nom, d: 'M ' + x0 + ' ' + a.b + ' L ' + x0 + ' ' + yb + ' L ' + R + ' ' + yb + ' L ' + R + ' ' + yt + ' L ' + t.r + ' ' + yt, x: t.r, y: yt });
      });
      setYollar(out);
    };
    olch();
    const t1 = setTimeout(olch, 420), t2 = setTimeout(olch, 1300);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(olch) : null;
    if (ro) ro.observe(el);
    window.addEventListener('resize', olch);
    return () => { clearTimeout(t1); clearTimeout(t2); if (ro) ro.disconnect(); window.removeEventListener('resize', olch); };
  }, [kalit]); // eslint-disable-line
  return yollar;
};
// Database tuguni. rejim: 'bosh' — faqat nom · 'nom' — uch jadval nomi · 'ustun' — uch jadval kartasi ustunlari bilan (3-ekran) · 'ish' — `ishtirokchilar` hisoblagichi (6-ekran)
const DbTugun = ({ holat, tex, qator, ichi, ichiK, soz, ozg, rejim = 'bosh', bor, yangi = [], onBos, silk, hashYon, guruh, ishSon = 8, ishYangi, nomYon }) => {
  const ref = useRef(null);
  const kalit = rejim === 'ustun' && bor ? [...bor].filter(u => JAMOA_CHIZMA.bog[u]).join(',') : '';
  const yollar = useBoglar(ref, kalit);
  return (
    <div className="pc-tg-ust db">
      <div ref={ref} className={cxx('pc-db', holat, rejim === 'ustun' && 'ustunli', guruh && 'pc-guruh')} data-n="db">
        <span className="pc-tg-h"><b>Database</b>{tex && <span className="pc-tg-tex"> · {tex}</span>}</span>
        {qator && <code key={qator} className="pc-tg-q">{qator}</code>}
        {ichi && <span key={ichiK || ichi} className="pc-tg-ichi ok">{ichi}</span>}
        {ozg && <span key={ozg} className="pc-ozg">{tr({ uz: "o'zgarmadi ✓", ru: 'не изменилось ✓' })}</span>}
        {rejim === 'nom' && <span className="pc-db-nomlar">{JAMOA_CHIZMA.jadvallar.map(j => <code key={j.nom} data-j={j.nom} className={cxx('pc-db-nom', nomYon && 'yon')}>{j.nom}</code>)}</span>}
        {rejim === 'ustun' && <>
          <span className="pc-oz-iz"><code className="pc-u oz">id</code>{tr({ uz: "Database o'zi to'ldiradi", ru: 'Database заполняет сама' })}</span>
          {JAMOA_CHIZMA.jadvallar.map(j => {
            const ichida = <>
              <code className="pc-jd-n">{j.nom}</code>
              <span className="pc-jd-u">{j.ustun.map(u => (j.oz.includes(u)
                ? <code key={u} className="pc-u oz">{u}</code>
                : bor && bor.has(u)
                  ? <code key={u} data-u={JAMOA_CHIZMA.bog[u] ? u : undefined} className={cxx('pc-u', yangi.includes(u) && 'yangi', JAMOA_CHIZMA.bog[u] && 'bog')}>{u}</code>
                  : <span key={u} className="pc-u joy" aria-hidden="true">?</span>))}</span>
              {hashYon && j.nom === 'oyinchilar' && <span className="pc-hash fade-step">{tr({ uz: "hash — paroldan yasalgan satr: undan parolni qaytarib bo'lmaydi", ru: 'hash — строка, сделанная из пароля: из неё нельзя получить пароль обратно' })}</span>}
            </>;
            return onBos
              ? <button key={j.nom} type="button" data-j={j.nom} className={cxx('pc-jadval', silk === j.nom && 'q-silk')} onClick={() => onBos(j.nom)}>{ichida}</button>
              : <div key={j.nom} data-j={j.nom} className="pc-jadval">{ichida}</div>;
          })}
          {yollar.length > 0 && <svg className="pc-boglar" aria-hidden="true">{yollar.map(y => <g key={y.k}><path d={y.d} /><circle cx={y.x} cy={y.y} r="3" /></g>)}</svg>}
        </>}
        {rejim === 'ish' && (
          <div className="pc-jadval" data-j="ishtirokchilar">
            <code className="pc-jd-n">ishtirokchilar</code>
            <span className="pc-ish-son">{tr({ uz: 'Shanba 18:00:', ru: 'Суббота 18:00:' })} <b key={ishSon} className={cxx(ishYangi && 'pop')}>{ishSon}</b> {tr({ uz: 'qator', ru: 'строк' })}</span>
            {ishYangi && <code className="pc-ish-q">oyin_id: 1 · holat: qoshildi</code>}
          </div>
        )}
      </div>
      {soz && <span className="pc-soz fade-step">{soz}</span>}
    </div>
  );
};
// Chizma: chapda ramka(lar) → Backend → Database (SABOQ 21). ixcham — Backend va Database ustma-ust (Reja ustuni)
const JamoaChizma = ({ boxRef, parvoz = [], tel, be, db, ixcham, pastki, className }) => (
  <div className={cxx('pc-chz', ixcham && 'ixcham', className)} ref={boxRef}>
    <div className="pc-chz-q">
      <div className="pc-chz-tel">{tel}</div>
      <i className="pc-yolak" aria-hidden="true" />
      {ixcham ? <div className="pc-chz-ong">{be}<i className="pc-pastga" aria-hidden="true" />{db}</div> : <>{be}<i className="pc-yolak" aria-hidden="true" />{db}</>}
    </div>
    {pastki}
    {parvoz.map(p => <Konvert key={p.k} p={p} />)}
  </div>
);
// Uchish (SABOQ 19): konvert manbadan nishonga uchadi. Joylar DOM dan o'lchanadi — ⛶ kattalashganda ham, telefonda ustma-ust turganda ham to'g'ri
const PARVOZ_MS = 850;
const useParvoz = () => {
  const box = useRef(null);
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [parvoz, setParvoz] = useState([]);
  const uchir = useCallback((dan, ga, t, tur, ms = PARVOZ_MS) => {
    const b = box.current; if (kam || !b) return;
    const s = b.querySelector(dan), n = b.querySelector(ga); if (!s || !n) return;
    const br = b.getBoundingClientRect(); const z = b.offsetWidth ? br.width / b.offsetWidth : 1;
    const nuqta = (el) => { const r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2 - br.left) / z, y: (r.top + r.height / 2 - br.top) / z }; };
    const p = { k: Math.random().toString(36).slice(2), t, tur, a: nuqta(s), b: nuqta(n), ms };
    setParvoz(x => [...x, p]);
    keyin(() => setParvoz(x => x.filter(y => y.k !== p.k)), ms + 80);
  }, [kam, keyin]);
  return { box, parvoz, uchir, kam, keyin };
};
const Konvert = ({ p }) => (
  <span className={cxx('pc-konvert', p.tur, !p.t && 'nuqta')} aria-hidden="true"
    style={{ left: p.a.x + 'px', top: p.a.y + 'px', '--dx': (p.b.x - p.a.x) + 'px', '--dy': (p.b.y - p.a.y) + 'px', animationDuration: p.ms + 'ms' }}>{p.t && <><i className="pc-kv-ic" />{p.t}</>}</span>
);
const KONVERT = { elon: { uz: "e'lon", ru: 'объявление' }, sorov: { uz: "so'rov", ru: 'запрос' }, javob: { uz: 'javob', ru: 'ответ' } };

// Bashorat (SABOQ 11/19/32): karta halqada, variantlar navbat bilan chiqadi; tanlangach ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi
const TaxminIxcham = ({ savol, javob }) => (
  <div className="pc-taxmin"><span className="pc-taxmin-y">{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}</span><span className="pc-taxmin-s">{savol}</span><b>{javob}</b></div>
);
const Bashorat = ({ savol, variantlar, tanlov, onTanla, done }) => (!tanlov
  ? <div className="pc-navbat-k"><QBashorat yorliq={tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' })} savol={savol} variantlar={variantlar.map(v => ({ k: v.k, t: tr(v.t) }))} tanlov={tanlov} onTanla={onTanla} /></div>
  : !done && <TaxminIxcham savol={savol} javob={tr((variantlar.find(v => v.k === tanlov) || {}).t)} />);
// Natija bloki (SABOQ 25): bitta yashil blok — birinchi qator taxmin, keyin xulosa; QIzoh — blok ostida bitta qator
const NatijaBlok = ({ togri, haqiqat, xulosa, izoh }) => (
  <div className="pc-natija fade-step">
    <div className="q-xulosa pc-nb">
      {haqiqat !== undefined && <span className={cxx('pc-nb-t', togri && 'ok')}>{togri ? <>✓ {tr({ uz: "Taxminingiz to'g'ri chiqdi", ru: 'Ваше предположение подтвердилось' })}</> : haqiqat}</span>}
      <span className="pc-nb-x">{xulosa}</span>
    </div>
    {izoh && <QIzoh>{izoh}</QIzoh>}
  </div>
);
const Haqiqat = ({ taxmin, haqiqat, yorliq }) => <>{tr({ uz: 'Taxminingiz', ru: 'Ваше предположение' })}: {taxmin} · {yorliq || tr({ uz: 'haqiqatda', ru: 'на деле' })}: <b>{haqiqat}</b></>;
const NomQator = ({ children }) => <p className="pc-nom fade-step">{children}</p>;
// Mentorga eslatma — faqat Mentor ko'rinishida (MD «O'qituvchi eslatmasi»)
const MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const [ochiq, setOchiq] = useState(false);
  if (!(gate.live && gate.live.mode === 'mentor')) return null;
  return ochiq
    ? <div className="pc-mnote fade-up" role="note" onClick={() => setOchiq(false)}><span className="pc-mnote-l">{tr({ uz: 'Mentorga eslatma', ru: 'Заметка ментору' })}</span><span>{children}</span></div>
    : <QTugma ikkinchi className="pc-mnote-c" onClick={() => setOchiq(true)}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</QTugma>;
};

// ===== SCREEN 0 — KIRISH (QKirish): ilova va sayt yonma-yon; «Qo'shilaman» → «Yangilash» → variantlar. Ballsiz (J-026) =====
const HOOK_OPTS = [
  { id: 'a', t: { uz: 'Ilova saytga xabar yubordi', ru: 'Приложение отправило сайту сообщение' } },
  { id: 'b', t: { uz: "Ikkalasi bitta joydan so'radi", ru: 'Оба запросили из одного места' } },
  { id: 'c', t: { uz: "Sayt telefondan o'qib oldi", ru: 'Сайт прочитал с телефона' } }
];
const HOOK_JAVOB = {
  b: { uz: <><b>Aynan!</b> Bu misolda o'yinlar bitta Backend va Database'da turadi — ilova ham, sayt ham shu yerdan so'raydi.</>, ru: <><b>Именно!</b> В этом примере игры хранятся в одном Backend и Database — и приложение, и сайт запрашивают оттуда.</> },
  a: { uz: <><b>Qiziq fikr!</b> Ilova saytni tanimaydi: ikkalasi ham o'yinlarni bitta Backend'dan so'raydi.</>, ru: <><b>Интересная мысль!</b> Приложение не знает сайт: оба запрашивают игры у одного Backend.</> },
  c: { uz: <><b>Qiziq fikr!</b> Telefon o'chiq bo'lsa ham, sayt shu sonni Backend'dan olishi mumkin — demak, u boshqa joydan oladi.</>, ru: <><b>Интересная мысль!</b> Даже если телефон выключен, сайт может взять это число у Backend — значит, он берёт его из другого места.</> }
};
// Javobdan keyin ikki maket ostida chizma tug'iladi: ikkalasidan chiziq bitta Backend'ga, undan Database'ga (kulrang → oq)
const HookChizma = () => {
  const kam = kamHarakat();
  const [oq, setOq] = useState(kam);
  useEffect(() => { if (kam) return undefined; const t = setTimeout(() => setOq(true), 650); return () => clearTimeout(t); }, [kam]);
  return (
    <div className={cxx('pc-hook-chz', oq && 'oq')}>
      <svg className="pc-hook-chiz" viewBox="0 0 424 34" preserveAspectRatio="none" aria-hidden="true"><path d="M 86 0 C 86 22, 212 12, 212 34" /><path d="M 330 0 C 330 22, 212 12, 212 34" /></svg>
      <div className="pc-hook-tg"><span className="pc-be mini"><b>Backend</b></span><i className="pc-yolak" aria-hidden="true" /><span className="pc-db mini"><b>Database</b></span></div>
    </div>
  );
};
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const avval = !!storedAnswer;
  const kam = kamHarakat();
  const keyin = useKeyin();
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [bos, setBos] = useState(false);
  const [qosh, setQosh] = useState(avval);
  const [yang, setYang] = useState(avval);
  const [oqar, setOqar] = useState(false);
  const [sc, setSc] = useState(0);
  const ms = (x) => (kam ? 0 : x);
  const qoshil = () => { if (qosh) return; setBos(true); keyin(() => { setBos(false); setQosh(true); }, ms(260)); };
  const yangila = () => { if (!qosh || yang) return; setOqar(true); keyin(() => setYang(true), ms(260)); keyin(() => { setOqar(false); setSc(n => n + 1); }, ms(560)); };
  const pick = (v) => { if (picked !== null || !yang) return; setPicked(v); setSc(n => n + 1); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: false }); };
  return (
    <Stage eyebrow={tr({ uz: 'Dars · kirish', ru: 'Урок · введение' })} screen={screen} scrollSignal={sc} navContent={<NavNext optionalLive disabled={picked === null} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <QKirish zoom={Zoomable}
        sarlavha={tr({ uz: <>Ilovada qo'shilgan o'yinchini <span className="italic" style={{ color: T.accent }}>sayt qanday ko'rdi?</span></>, ru: <>Как сайт <span className="italic" style={{ color: T.accent }}>увидел игрока</span>, присоединившегося в приложении?</> })}
        mentor={<Mentor>{!yang
          ? tr({ uz: "Maydon Jamoa ilova ham, sayt ham bo'lishi mumkin — ilovada «Qo'shilaman» ni bosing, keyin saytni yangilang.", ru: 'Maydon Jamoa может быть и приложением, и сайтом — нажмите «Qo\'shilaman» в приложении, потом обновите сайт.' })
          : tr({ uz: "Endi o'ngdagi javoblardan birini tanlang.", ru: 'Теперь выберите один из ответов справа.' })}</Mentor>}
        maket={<div className="pc-hook">
          <div className="pc-hook-q">
            <Ramka tur="tel" yorliq={picked ? tr({ uz: 'ilova · ?', ru: 'приложение · ?' }) : tr({ uz: 'ilova', ru: 'приложение' })}>
              <OyinEkran son={qosh ? 9 : 8} pop={qosh && !avval} qoshildi={qosh} onQoshil={qoshil} qoshilHalqa={!qosh} bosildi={bos} />
            </Ramka>
            <Ramka tur="web" yorliq={picked ? tr({ uz: 'sayt · ?', ru: 'сайт · ?' }) : tr({ uz: 'sayt', ru: 'сайт' })} onYangila={qosh && !yang ? yangila : null} yangilaHalqa={qosh && !yang} oqar={oqar}>
              <OyinEkran son={yang ? 9 : 8} pop={yang && !avval} />
            </Ramka>
          </div>
          {picked && <HookChizma />}
        </div>}
        savol={tr({ uz: 'Sizningcha, qaysi biri?', ru: 'Как вы думаете?' })}
        variantlar={HOOK_OPTS.map(o => ({ id: o.id, t: tr(o.t) }))} tanlov={picked} onTanla={pick} yopiq={!yang}
        javob={picked !== null && <p className="hook-ack fade-step">{tr(HOOK_JAVOB[picked])}</p>}
      />
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): chapda «Dars oxirida» — chizma tayyor holatda bir marta o'zi yuradi (DE-200); o'ngda 4 qadam (teglar App.jsx `sub` bilan, P-015) =====
const REJA = [
  { t: { uz: 'Qismlarni chizish', ru: 'Нарисовать части' }, teg: { uz: 'qismlar', ru: 'части' } },
  { t: { uz: 'Jadvallar va ustunlar', ru: 'Таблицы и столбцы' }, teg: { uz: 'oyinlar', ru: 'oyinlar' } },
  { t: { uz: 'Real vaqt nuqtalarini topish', ru: 'Найти точки реального времени' }, teg: { uz: 'real vaqt nuqtalari', ru: 'точки реального времени' } },
  { t: { uz: 'Platforma va stekni tanlash', ru: 'Выбрать платформу и стек' }, teg: { uz: 'stek — asoslangan tanlov', ru: 'стек — обоснованный выбор' } }
];
const RejaChizma = () => {
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [b, setB] = useState(kam ? 9 : 0);
  useEffect(() => {
    if (kam) return;
    const D = PARVOZ_MS;
    keyin(() => { setB(1); uchir('.pc-tel', '[data-n="be"]', tr(KONVERT.sorov)); }, 700);
    keyin(() => { setB(2); uchir('[data-n="be"]', '[data-n="db"]', ''); }, 700 + D);
    keyin(() => { setB(3); uchir('[data-n="db"]', '.pc-tel', tr(KONVERT.javob), 'javob', 1100); }, 700 + 2 * D);
    keyin(() => setB(4), 700 + 2 * D + 1100);
  }, []); // eslint-disable-line
  return (
    <JamoaChizma ixcham boxRef={box} parvoz={parvoz}
      tel={<Ramka yorliq={tr({ uz: 'ilova · Expo', ru: 'приложение · Expo' })}><OyinEkran belgi={b >= 4 ? { son: true, doira: true } : {}} /></Ramka>}
      be={<BeTugun tex="NestJS" holat={b === 1 ? 'on' : b >= 2 ? 'ok' : ''} />}
      db={<DbTugun tex="Neon" rejim="nom" holat={b === 2 ? 'on' : b >= 3 ? 'ok' : ''} />}
      pastki={<p className={cxx('pc-asos-q', b >= 4 && 'tayyor')}><b>{tr({ uz: 'mobil', ru: 'мобильное' })}</b> — {tr({ uz: "o'yinchi maydonda, qo'lida telefon", ru: 'игрок на поле, в руке телефон' })}{b >= 4 && <span className="pc-rv-son"><RvBelgi /><RvBelgi /><RvBelgi /></span>}</p>} />
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <QReja zoom={Zoomable}
      sarlavha={tr({ uz: <>Bugun qismlarni chizib, <span className="italic" style={{ color: T.accent }}>sayt yoki ilovani</span> tanlaysiz.</>, ru: <>Сегодня вы нарисуете части и выберете <span className="italic" style={{ color: T.accent }}>сайт или приложение</span>.</> })}
      mentor={<Mentor>{tr({ uz: "Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingiz uchun README'ga yozdirasiz.", ru: 'Каждый шаг вы сначала увидите на примере Maydon Jamoa, потом попросите записать его в README для своего продукта.' })}</Mentor>}
      chapYorliq={tr({ uz: 'Dars oxirida', ru: 'К концу урока' })}
      chap={<RejaChizma />}
      ongYorliq={tr({ uz: 'Bugungi 4 qadam', ru: '4 шага на сегодня' })}
      qadamlar={REJA.map(r => ({ t: tr(r.t), teg: tr(r.teg) }))}>
      <p className="pc-reja-past fade-up">{tr({ uz: "o'z repo'ngiz", ru: 'ваш репозиторий' })} — <code>README.md</code> «{tr({ uz: 'Arxitektura', ru: 'Архитектура' })}» · {tr({ uz: 'Mentor misoli', ru: 'пример Ментора' })} <code>maydon-jamoa</code> · {tr({ uz: 'tayyor holat', ru: 'готовое состояние' })} <code>m11-dars-08-done</code></p>
      <MentorNote>{tr({ uz: "Bu darsda yangi kod paketi o'rnatilmaydi — natija README.md bo'limi; vaqt yetmasa A2 uyga vazifaning 1-bandiga o'tadi.", ru: 'На этом уроке новые пакеты не устанавливаются — результат: раздел README.md; если не хватит времени, A2 переходит в 1-й пункт домашнего задания.' })}</MentorNote>
    </QReja>
  </Stage>
);

// ===== SCREEN 2 — TUSHUNCHA (QTushuncha keng): e'lon yo'li — tashkilotchi «Yuborish» → Backend → Database; o'yinchi «O'yinlar» → so'rov → javob =====
const S2_TAXMIN = [{ k: 'ilova', t: { uz: 'Ilova', ru: 'Приложение' } }, { k: 'be', t: { uz: 'Backend', ru: 'Backend' } }, { k: 'db', t: { uz: 'Database', ru: 'Database' } }];
const S2_QADAM = [{ uz: "E'lonni yuboring", ru: 'Отправьте объявление' }, { uz: "Ro'yxatni oching", ru: 'Откройте список' }];
const S2_YANGI = { ...NAMUNA_OYINLAR[2], son: 0 }; // e'lon berilgan lahza — «0 / 8» (tayanch 9.31)
const S2_ESKI = [NAMUNA_OYINLAR[0], NAMUNA_OYINLAR[1], NAMUNA_OYINLAR[3]];
const S2_HAMMA = [NAMUNA_OYINLAR[0], NAMUNA_OYINLAR[1], S2_YANGI, NAMUNA_OYINLAR[3]];
const Screen2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 2 : 0);
  const [yur, setYur] = useState(false);
  const [v, setV] = useState(() => (avval
    ? { elon: false, bos: false, be: 'ok', db: 'ok', beIchi: null, dbIchi: null, yangi: true, soz: true }
    : { elon: true, bos: false, be: 'xira', db: 'xira', beIchi: null, dbIchi: null, yangi: false, soz: false }));
  const qoy = (o) => setV(x => ({ ...x, ...o }));
  const done = n >= 2;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const ms = (x) => (kam ? 0 : x);
  const D = ms(PARVOZ_MS);
  const yubor = () => {
    if (yur || n !== 0 || !taxmin) return;
    setYur(true); qoy({ bos: true });
    uchir('.pc-t1 .pc-tel', '[data-n="be"]', tr(KONVERT.elon));
    keyin(() => { qoy({ bos: false, be: 'on', beIchi: tr({ uz: "to'liqmi? ✓", ru: 'всё заполнено? ✓' }) }); uchir('[data-n="be"]', '[data-n="db"]', tr(KONVERT.elon)); }, D);
    keyin(() => qoy({ be: 'ok', db: 'on', dbIchi: tr({ uz: "+1 e'lon", ru: '+1 объявление' }), elon: false }), 2 * D);
    keyin(() => { qoy({ db: 'ok' }); setN(1); setYur(false); }, 2 * D + ms(500));
  };
  const och = () => {
    if (yur || n !== 1) return;
    setYur(true);
    uchir('.pc-t2 .pc-tel', '[data-n="be"]', tr(KONVERT.sorov));
    keyin(() => { qoy({ be: 'on', beIchi: null }); uchir('[data-n="be"]', '[data-n="db"]', tr(KONVERT.sorov)); }, D);
    keyin(() => { qoy({ be: 'ok', db: 'on', dbIchi: null }); uchir('[data-n="db"]', '.pc-t2 .pc-tel', tr(KONVERT.javob), 'javob', ms(1100)); }, 2 * D);
    keyin(() => { qoy({ db: 'ok', yangi: true }); }, 2 * D + ms(1100));
    keyin(() => { qoy({ soz: true }); setN(2); setYur(false); }, 2 * D + ms(1500));
  };
  const tx2 = S2_TAXMIN.find(x => x.k === taxmin);
  const soz = v.soz && tr({ uz: "ko'rsatadi", ru: 'показывает' });
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · qismlar', ru: 'Понятие · части' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Qadamlarni bajaring (${n}/2)`, ru: `Выполните шаги (${n}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>E'lon yo'lida <span className="italic" style={{ color: T.accent }}>har qism nima qiladi?</span></>, ru: <>Что делает <span className="italic" style={{ color: T.accent }}>каждая часть</span> на пути объявления?</> })}
        mentor={<Mentor>{tr({ uz: "Avval tashkilotchi telefonida «Yuborish» ni bosing, keyin o'yinchi telefonida «O'yinlar» ni oching.", ru: 'Сначала нажмите «Yuborish» на телефоне организатора, потом откройте «O\'yinlar» на телефоне игрока.' })}</Mentor>}
        bashorat={<Bashorat savol={tr({ uz: "E'lonni qaysi qism saqlaydi?", ru: 'Какая часть хранит объявление?' })} variantlar={S2_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={taxmin && !done && <div className="pc-qadam-q"><QQadamlar qadamlar={S2_QADAM.map(tr)} joriy={n} /></div>}
        vizual={<JamoaChizma boxRef={box} parvoz={parvoz}
          tel={<div className="pc-ikki">
            <Ramka className="pc-t1" rol={{ k: 'b2', t: tr({ uz: 'tashkilotchi', ru: 'организатор' }) }} chip={soz}>
              {v.elon ? <ElonEkran onYubor={taxmin && n === 0 && !yur ? yubor : null} yuborHalqa={!!taxmin && n === 0 && !yur} bosildi={v.bos} /> : <OyinlarEkran royxat={S2_HAMMA} />}
            </Ramka>
            <Ramka className="pc-t2" rol={{ k: 'b1', t: tr({ uz: "o'yinchi", ru: 'игрок' }) }} chip={soz}>
              <OyinlarEkran royxat={v.yangi ? S2_HAMMA : S2_ESKI} yangiId={v.yangi && !avval ? 3 : null} onOyinlar={n === 1 && !yur ? och : (done ? undefined : null)} oyinlarHalqa={n === 1 && !yur} />
            </Ramka>
          </div>}
          be={<BeTugun holat={v.be} ichi={v.beIchi} soz={v.soz && tr({ uz: 'tekshiradi', ru: 'проверяет' })} />}
          db={<DbTugun holat={v.db} ichi={v.dbIchi} soz={v.soz && tr({ uz: 'saqlaydi', ru: 'хранит' })} />}
          pastki={done && <NomQator>{tr({ uz: "Qismlar va ular orasidagi so'rovlar chizilgan bu rasm — Maydon Jamoa chizmasi (arxitektura).", ru: 'Этот рисунок с частями и запросами между ними — схема Maydon Jamoa (архитектура).' })}</NomQator>} />}
        natija={done && tx2 && <NatijaBlok togri={taxmin === 'db'}
          haqiqat={<Haqiqat taxmin={tr(tx2.t)} haqiqat="Database" />}
          xulosa={tr({ uz: "Bu misolda ham 9-Moduldagidek uch qism: ilova ko'rsatadi, Backend tekshiradi, Database saqlaydi.", ru: 'В этом примере, как и в 9-м модуле, три части: приложение показывает, Backend проверяет, Database хранит.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 3 — TUSHUNCHA (QTushuncha keng): olti bo'lak bittadan (SABOQ 9, 13) — jadval kartasini bosish → ustunlar, `_id` chizig'i =====
const S3_TAXMIN = [{ k: '1', t: { uz: 'Bitta', ru: 'Одна' } }, { k: '3', t: { uz: 'Uchta', ru: 'Три' } }, { k: '6', t: { uz: 'Oltita', ru: 'Шесть' } }];
const S3_BOLAK = [
  { t: { uz: 'Kun, soat va maydon', ru: 'День, время и поле' }, j: 'oyinlar', u: ['kun', 'soat', 'maydon'], tel: { e: 'elon', joriy: ['kun', 'soat', 'maydon'] }, x: { uz: "Kun va soat — o'yinniki, odamniki emas.", ru: 'День и время — у игры, а не у человека.' } },
  { t: { uz: 'Nechta odam kerak', ru: 'Сколько людей нужно' }, j: 'oyinlar', u: ['kerak'], tel: { e: 'elon', joriy: ['kerak'] }, x: { uz: "Nechta odam kerakligini e'lon aytadi — u o'yinniki.", ru: 'Сколько людей нужно, говорит объявление — это у игры.' } },
  { t: { uz: 'Ism, telefon va parol', ru: 'Имя, телефон и пароль' }, j: 'oyinchilar', u: ['ism', 'telefon', 'parol_hash'], tel: { e: 'royxat' }, x: { uz: "Ism va parol — odamniki; u ko'p o'yinga qo'shiladi.", ru: 'Имя и пароль — у человека; он присоединяется ко многим играм.' } },
  { t: { uz: "O'yinni kim e'lon qilgani", ru: 'Кто объявил игру' }, j: 'oyinlar', u: ['tashkilotchi_id'], tel: { e: 'elon', joriy: ['yubor'] }, x: { uz: "E'lon bergan odam — o'yinning bir ma'lumoti.", ru: 'Человек, подавший объявление, — одно из данных игры.' } },
  { t: { uz: "Kim qaysi o'yinga qo'shilgani", ru: 'Кто к какой игре присоединился' }, j: 'ishtirokchilar', u: ['oyin_id', 'oyinchi_id'], tel: { e: 'oyin', joriy: 'doira' }, x: { uz: "Bitta o'yinchi ko'p o'yinga qo'shiladi — alohida jadval.", ru: 'Один игрок присоединяется ко многим играм — отдельная таблица.' } },
  { t: { uz: "Qo'shildi, keladi, navbatda yoki chiqdi", ru: 'Присоединился, придёт, в очереди или вышел' }, j: 'ishtirokchilar', u: ['holat'], tel: { e: 'oyin', joriy: 'doira' }, x: { uz: "Holat har o'yinda boshqacha — u qo'shilishniki.", ru: 'Статус в каждой игре свой — он у присоединения.' } }
];
const S3_HAMMA = new Set(S3_BOLAK.flatMap(b => b.u));
const S3Telefon = ({ b }) => (
  <Ramka>{!b ? <OyinEkran /> : b.tel.e === 'elon' ? <ElonEkran joriy={b.tel.joriy} /> : b.tel.e === 'royxat' ? <RoyxatEkran joriy /> : <OyinEkran joriy={b.tel.joriy} />}</Ramka>
);
const Screen3 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [k, setK] = useState(avval ? 6 : 0);
  const [bor, setBor] = useState(() => (avval ? S3_HAMMA : new Set()));
  const [yangi, setYangi] = useState([]);
  const [xato, setXato] = useState(null);
  const [yur, setYur] = useState(false);
  const done = k >= 6;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const b = S3_BOLAK[k];
  const bos = (nom) => {
    if (!taxmin || done || yur) return;
    if (nom !== b.j) { setXato({ i: k, j: nom, kk: Date.now() }); return; }
    setXato(null); setYur(true);
    uchir('.pc-bolak', '[data-j="' + nom + '"]', tr(b.t), 'bolak', kam ? 0 : 650);
    keyin(() => { setBor(s => new Set([...s, ...b.u])); setYangi(b.u); setK(x => x + 1); setYur(false); }, kam ? 0 : 650);
    keyin(() => setYangi([]), (kam ? 0 : 650) + 1200);
  };
  const tx3 = S3_TAXMIN.find(x => x.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · jadvallar', ru: 'Понятие · таблицы' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Bo'laklarni joylang (${k}/6)`, ru: `Разложите части (${k}/6)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Maydon Jamoa ma'lumotlari <span className="italic" style={{ color: T.accent }}>qaysi jadvallarda</span> turadi?</>, ru: <>В каких <span className="italic" style={{ color: T.accent }}>таблицах</span> хранятся данные Maydon Jamoa?</> })}
        mentor={<Mentor>{tr({ uz: "Har bo'lak uchun uni saqlaydigan jadvalni bosing.", ru: 'Для каждой части нажмите таблицу, которая её хранит.' })}</Mentor>}
        bashorat={<Bashorat savol={tr({ uz: "Maydon Jamoa'ga nechta jadval kerak?", ru: 'Сколько таблиц нужно Maydon Jamoa?' })} variantlar={S3_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className={cxx('pc-s3', tugadi && 'tugadi')} ref={box}>
          {!tugadi && <div className="pc-s3-tel"><S3Telefon b={taxmin ? b : null} /></div>}
          <div className="pc-s3-ong">
            <DbTugun rejim="ustun" bor={bor} yangi={yangi} onBos={taxmin && !done ? bos : undefined} silk={xato && xato.j} guruh={!!taxmin && !done && !yur} hashYon={bor.has('parol_hash')} />
            {taxmin && !done && b && <div className="pc-bolak-ust">
              <span className="pc-hisob">{tr({ uz: 'Joylandi:', ru: 'Разложено:' })} <b>{k} / 6</b></span>
              <div key={k} className="pc-bolak">{tr(b.t)}</div>
              {xato && xato.i === k && <QXato key={xato.kk}>{tr(b.x)}</QXato>}
            </div>}
            {k >= 5 && <NomQator>{tx({ uz: "Boshqa jadvaldagi qatorni ko'rsatadigan ustun bog'lovchi ustun deyiladi; bu darsda ularning nomi `_id` bilan tugaydi.", ru: 'Столбец, указывающий на строку в другой таблице, называется связующим; на этом уроке их имена оканчиваются на `_id`.' })}</NomQator>}
          </div>
          {parvoz.map(p => <Konvert key={p.k} p={p} />)}
        </div>}
        natija={done && tx3 && <NatijaBlok togri={taxmin === '3'}
          haqiqat={<Haqiqat taxmin={tr(tx3.t)} haqiqat={tr({ uz: 'uchta', ru: 'три' })} />}
          xulosa={tx({ uz: "Bu misolda uch jadval: kim — `oyinchilar`, qaysi o'yin — `oyinlar`, kim qaysi o'yinda — `ishtirokchilar`.", ru: 'В этом примере три таблицы: кто — `oyinchilar`, какая игра — `oyinlar`, кто в какой игре — `ishtirokchilar`.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 4 — 1-SAVOL (QuestionScreen → QTest; INLINE_KEYS.s4 = 2, C). Savol ustida yorliq yo'q (SABOQ 6) =====
const Screen4 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 1-savol', ru: 'Упражнение · вопрос 1' })}
    questionText="O'yin kartasida «8 / 10». 8 qaysi jadvaldan sanaladi?"
    question={tr({ uz: <h2 className="title h-ask">O'yin kartasida «8 / 10». 8 <span className="italic" style={{ color: T.accent }}>qaysi jadvaldan</span> sanaladi?</h2>, ru: <h2 className="title h-ask">На карточке игры «8 / 10». Из <span className="italic" style={{ color: T.accent }}>какой таблицы</span> считается 8?</h2> })}
    options={[
      { uz: "`oyinlar` — o'yin qatoridagi son ustunidan", ru: '`oyinlar` — из числового столбца строки игры' },
      { uz: "`oyinchilar` — ro'yxatdan o'tgan hamma odamdan", ru: '`oyinchilar` — из всех зарегистрированных людей' },
      { uz: "`ishtirokchilar` — shu o'yinga qo'shilganlardan", ru: '`ishtirokchilar` — из присоединившихся к этой игре' },
      { uz: '`oyinlar` — `kerak` ustunidagi qiymatdan', ru: '`oyinlar` — из значения столбца `kerak`' }
    ]} correctIdx={2}
    explainCorrect={{ uz: "8 — shu o'yinga qo'shilganlar qatorlari, 10 esa `oyinlar` dagi `kerak` ustuni.", ru: '8 — строки присоединившихся к этой игре, а 10 — столбец `kerak` в `oyinlar`.' }}
    explainWrong={{
      0: { uz: "`oyinlar` da qo'shilganlar soni uchun ustun yo'q.", ru: 'В `oyinlar` нет столбца для числа присоединившихся.' },
      1: { uz: "`oyinchilar` — hamma odam, bu o'yinga qo'shilmaganlar ham.", ru: '`oyinchilar` — все люди, и не присоединившиеся к этой игре.' },
      3: { uz: '`kerak` — 10, ya\'ni nechta odam kerakligi.', ru: '`kerak` — это 10, то есть сколько людей нужно.' },
      default: { uz: "8 — shu o'yinga qo'shilganlar qatorlari.", ru: '8 — строки присоединившихся к этой игре.' }
    }} />
);

// ===== SCREEN 5 — TUSHUNCHA (QTushuncha keng): to'rt bo'lak bittadan — «Ma'lumoti o'zgaradi» / «O'zgarmaydi»; telefonda real vaqt nuqtalari belgilanadi =====
const S5_BOLAK = [
  { t: { uz: '«8 / 10»', ru: '«8 / 10»' }, joy: 'son', oz: true },
  { t: { uz: '«Shanba, 18:00 · Mahalla maydoni»', ru: '«Суббота, 18:00 · Поле махалли»' }, joy: 'vaqt', oz: false },
  { t: { uz: "Qo'shilganlar doiralari", ru: 'Кружки присоединившихся' }, joy: 'doira', oz: true },
  { t: { uz: "O'yin kunidagi «Kelaman» belgilari", ru: 'Отметки «Kelaman» в день игры' }, joy: 'kelaman', oz: true }
];
const S5_XATO = { oz: { uz: "Kimdir qo'shilsa yoki tasdiqlasa, bu ma'lumot o'zgaradi.", ru: 'Если кто-то присоединится или подтвердит, эти данные изменятся.' }, yoq: { uz: "Kun, soat va maydonni tashkilotchi e'londa yozgan.", ru: 'День, время и поле организатор указал в объявлении.' } };
const S5_HAMMA = { son: true, vaqt: true, doira: true, kelaman: true };
const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const keyin = useKeyin();
  const kam = kamHarakat();
  const [k, setK] = useState(avval ? 4 : 0);
  const [belgi, setBelgi] = useState(avval ? S5_HAMMA : {});
  const [xato, setXato] = useState(null);
  const [yur, setYur] = useState(false);
  const done = k >= 4;
  const tugadi = useTugadi(done, 1200, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const b = S5_BOLAK[k];
  const topildi = S5_BOLAK.slice(0, k).filter(x => x.oz).length;
  const tanla = (oz) => {
    if (done || yur) return;
    if (oz !== b.oz) { setXato({ i: k, oz, kk: Date.now() }); return; }
    setXato(null); setYur(true);
    setBelgi(x => ({ ...x, [b.joy]: true }));
    keyin(() => { setK(x => x + 1); setYur(false); }, kam ? 0 : 700);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · real vaqt', ru: 'Понятие · реальное время' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!done ? tr({ uz: `Bo'laklarni saralang (${k}/4)`, ru: `Рассортируйте части (${k}/4)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Boshqa odam sabab <span className="italic" style={{ color: T.accent }}>qaysi ma'lumot</span> o'zgaradi?</>, ru: <>Какие <span className="italic" style={{ color: T.accent }}>данные</span> меняются из-за другого человека?</> })}
        mentor={<Mentor>{tr({ uz: "Ekran ochiq turibdi — har bo'lak uchun tanlang: «Ma'lumoti o'zgaradi» yoki «O'zgarmaydi».", ru: 'Экран открыт — для каждой части выберите: «Ma\'lumoti o\'zgaradi» или «O\'zgarmaydi».' })}</Mentor>}
        vizual={<div className={cxx('pc-s5', tugadi && 'tugadi')}>
          <Ramka rol={{ k: 'b1', t: tr({ uz: '1-telefon · siz', ru: 'телефон 1 · вы' }) }}>
            <OyinEkran kun={k >= 3} joriy={!done && b ? b.joy : undefined} belgi={belgi} />
          </Ramka>
          {!tugadi && <div className="pc-s5-ong">
            <span className="pc-hisob">{tr({ uz: 'Topildi:', ru: 'Найдено:' })} <b>{topildi} / 3</b></span>
            {b && <div key={k} className="pc-bolak katta">
              <span className="pc-bolak-t">{tr(b.t)}</span>
              <div className={cxx('pc-ikki-tug', !yur && 'pc-guruh')} key={xato ? xato.kk : 'x'}>
                <QChip silk={!!xato && xato.oz === true} holat={xato && xato.oz === true ? 'err' : undefined} disabled={yur} onClick={() => tanla(true)}>{tr({ uz: "Ma'lumoti o'zgaradi", ru: 'Данные меняются' })}</QChip>
                <QChip silk={!!xato && xato.oz === false} holat={xato && xato.oz === false ? 'err' : undefined} disabled={yur} onClick={() => tanla(false)}>{tr({ uz: "O'zgarmaydi", ru: 'Не меняется' })}</QChip>
              </div>
              {xato && xato.i === k && <QXato>{tr(b.oz ? S5_XATO.oz : S5_XATO.yoq)}</QXato>}
            </div>}
          </div>}
          {done && <NomQator>{tr({ uz: "Ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy — real vaqt nuqtasi.", ru: 'Место, данные которого могут измениться из-за другого человека, пока экран открыт, — точка реального времени.' })}</NomQator>}
        </div>}
        natija={done && <NatijaBlok xulosa={tr({ uz: "Bu misolda uchta real vaqt nuqtasi: «8 / 10», qo'shilganlar va «Kelaman» belgilari.", ru: 'В этом примере три точки реального времени: «8 / 10», присоединившиеся и отметки «Kelaman».' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 6 — TAJRIBA (QTushuncha keng): ikki telefon — 2-telefonda «Qo'shilaman», 1-telefonda pastga tortib yangilash (sudrash yoki «Yangilash») =====
const S6_TAXMIN = [{ k: 'ozi', t: { uz: "O'zi, o'sha soniyada", ru: 'Само, в ту же секунду' } }, { k: 'sora', t: { uz: "Ilova qayta so'raganda", ru: 'Когда приложение запросит снова' } }];
const S6_QADAM = [{ uz: "Qo'shiling (2-telefon)", ru: 'Присоединитесь (телефон 2)' }, { uz: 'Pastga torting (1-telefon)', ru: 'Потяните вниз (телефон 1)' }];
// Pastga tortish: sudrash (pointer events, 60 px dan oshsa yangilaydi); klaviaturada — «Yangilash» tugmasi
const useTortish = (faol, onYangila) => {
  const st = useRef(null);
  const [dy, setDy] = useState(0);
  if (!faol) return {};
  return {
    className: 'pc-tortiladi',
    style: dy ? { transform: 'translateY(' + Math.round(dy * 0.5) + 'px)' } : undefined,
    onPointerDown: (e) => { st.current = { y: e.clientY }; try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* eski brauzer */ } },
    onPointerMove: (e) => { if (st.current) setDy(Math.max(0, Math.min(90, e.clientY - st.current.y))); },
    onPointerUp: () => { const d = dy; st.current = null; setDy(0); if (d > 60) onYangila(); },
    onPointerCancel: () => { st.current = null; setDy(0); }
  };
};
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [n, setN] = useState(avval ? 2 : 0);
  const [yur, setYur] = useState(!avval);
  const [v, setV] = useState(() => (avval
    ? { s1: 9, p1: false, eski: false, tort: false, spin: false, s2: 9, p2: false, q2: true, bos2: false, be: 'ok', beIchi: null, db: 'ok', ish: 9, ishY: false }
    : { s1: null, p1: false, eski: false, tort: false, spin: false, s2: 8, p2: false, q2: false, bos2: false, be: '', beIchi: null, db: '', ish: 8, ishY: false }));
  const qoy = (o) => setV(x => ({ ...x, ...o }));
  const done = n >= 2;
  const tugadi = useTugadi(done, 1300, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const ms = (x) => (kam ? 0 : x);
  const D = ms(PARVOZ_MS);
  // Ekranga kirganda 1-telefon bir marta so'raydi (ochilganda so'rash — kirish animatsiyasi, SABOQ 19)
  useEffect(() => {
    if (avval) return;
    if (kam) { qoy({ s1: 8 }); setYur(false); return; }
    keyin(() => { qoy({ be: 'on' }); uchir('.pc-t1 .pc-tel', '[data-n="be"]', tr(KONVERT.sorov)); }, 500);
    keyin(() => { qoy({ db: 'on' }); uchir('[data-n="be"]', '[data-n="db"]', ''); }, 500 + PARVOZ_MS);
    keyin(() => uchir('[data-n="db"]', '.pc-t1 .pc-tel', tr(KONVERT.javob), 'javob', 1000), 500 + 2 * PARVOZ_MS);
    keyin(() => { qoy({ s1: 8, be: '', db: '' }); setYur(false); }, 500 + 2 * PARVOZ_MS + 1000);
  }, []); // eslint-disable-line
  const qoshil = () => {
    if (yur || n !== 0 || !taxmin) return;
    setYur(true); qoy({ bos2: true });
    uchir('.pc-t2 .pc-tel', '[data-n="be"]', tr(KONVERT.sorov));
    keyin(() => { qoy({ bos2: false, be: 'on', beIchi: tr({ uz: 'joy bormi? ✓', ru: 'есть место? ✓' }) }); uchir('[data-n="be"]', '[data-n="db"]', ''); }, D);
    keyin(() => { qoy({ be: 'ok', db: 'on', ish: 9, ishY: true }); uchir('[data-n="db"]', '.pc-t2 .pc-tel', tr(KONVERT.javob), 'javob', ms(1000)); }, 2 * D);
    keyin(() => { qoy({ db: 'ok', s2: 9, p2: true, q2: true, eski: true, tort: true }); setN(1); setYur(false); }, 2 * D + ms(1000));
  };
  const yangila = () => {
    if (yur || n !== 1) return;
    setYur(true); qoy({ tort: false, spin: true, be: '', db: '', beIchi: null, ishY: false });
    keyin(() => { qoy({ be: 'on' }); uchir('.pc-t1 .pc-tel', '[data-n="be"]', tr(KONVERT.sorov)); }, ms(350));
    keyin(() => { qoy({ be: 'ok', db: 'on' }); uchir('[data-n="be"]', '[data-n="db"]', ''); }, ms(350) + D);
    keyin(() => { qoy({ db: 'ok' }); uchir('[data-n="db"]', '.pc-t1 .pc-tel', tr(KONVERT.javob), 'javob', ms(1000)); }, ms(350) + 2 * D);
    keyin(() => { qoy({ s1: 9, p1: true, eski: false, spin: false }); setN(2); setYur(false); }, ms(350) + 2 * D + ms(1000));
  };
  const tort = useTortish(n === 1 && !yur, yangila);
  const tx6 = S6_TAXMIN.find(x => x.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tajriba · so\'rov', ru: 'Опыт · запрос' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Qadamlarni bajaring (${n}/2)`, ru: `Выполните шаги (${n}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>O'yinchi qo'shilsa, ekraningizdagi <span className="italic" style={{ color: T.accent }}>son o'zgaradimi?</span></>, ru: <>Если игрок присоединится, <span className="italic" style={{ color: T.accent }}>изменится ли число</span> на вашем экране?</> })}
        mentor={<Mentor>{tr({ uz: "Ikkinchi telefonda «Qo'shilaman» ni bosing va birinchisiga qarang.", ru: 'Нажмите «Qo\'shilaman» на втором телефоне и посмотрите на первый.' })}</Mentor>}
        bashorat={<Bashorat savol={tr({ uz: 'Birinchi telefonda «8 / 10» qachon «9 / 10» bo\'ladi?', ru: 'Когда на первом телефоне «8 / 10» станет «9 / 10»?' })} variantlar={S6_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        harakat={taxmin && !done && <div className="pc-qadam-q"><QQadamlar qadamlar={S6_QADAM.map(tr)} joriy={n} /></div>}
        vizual={<JamoaChizma boxRef={box} parvoz={parvoz}
          tel={<div className="pc-ikki">
            <Ramka className="pc-t1" rol={{ k: 'b1', t: tr({ uz: '1-telefon · siz', ru: 'телефон 1 · вы' }) }} ekranProps={tort}
              ust={<>{v.tort && <span className="pc-tort-b pc-halqa">↓ {tr({ uz: 'Pastga torting', ru: 'Потяните вниз' })}</span>}{v.spin && <span className="pc-spin" aria-hidden="true" />}</>}>
              <OyinEkran son={v.s1} pop={v.p1} eski={v.eski} />
            </Ramka>
            <Ramka className="pc-t2" rol={{ k: 'b2', t: tr({ uz: "2-telefon · boshqa o'yinchi", ru: 'телефон 2 · другой игрок' }) }}>
              <OyinEkran son={v.s2} pop={v.p2} qoshildi={v.q2} bosildi={v.bos2} onQoshil={taxmin && n === 0 && !yur ? qoshil : null} qoshilHalqa={!!taxmin && n === 0 && !yur} />
            </Ramka>
          </div>}
          be={<BeTugun holat={v.be} ichi={v.beIchi} />}
          db={<DbTugun holat={v.db} rejim="ish" ishSon={v.ish} ishYangi={v.ishY} />}
          pastki={n === 1 && !yur && <div className="pc-klav"><QTugma ikkinchi onClick={yangila}>{tr({ uz: 'Yangilash', ru: 'Обновить' })}</QTugma></div>} />}
        natija={done && tx6 && <NatijaBlok togri={taxmin === 'sora'}
          haqiqat={<Haqiqat taxmin={tr(tx6.t)} haqiqat={tr({ uz: "ilova qayta so'raganda", ru: 'когда приложение запросит снова' })} />}
          xulosa={tr({ uz: "Bu modulda ilova so'raganda yangilanadi: ekran ochilganda va pastga tortib yangilaganda.", ru: 'В этом модуле приложение обновляется, когда запрашивает: при открытии экрана и при потягивании вниз.' })}
          izoh={tr({ uz: "Ekran o'zi yangilanadigan yo'llardan biri — WebSocket; roadmap'da u keyinroq ufqda, 12-Modulda.", ru: 'Один из способов, чтобы экран обновлялся сам, — WebSocket; в roadmap он на горизонте «позже», в 12-м модуле.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 7 — 2-SAVOL (QuestionScreen; INLINE_KEYS.s7 = 0, A) — 6-ekranning nusxasi emas: boshqa real vaqt nuqtasi, boshqa odam =====
const Screen7 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 2-savol', ru: 'Упражнение · вопрос 2' })}
    questionText="Ekran ochiq. Uch o'yinchi «Kelaman» ni bosdi. Tashkilotchi qachon ko'radi?"
    question={tr({ uz: <h2 className="title h-ask">Ekran ochiq. Uch o'yinchi «Kelaman» ni bosdi. Tashkilotchi <span className="italic" style={{ color: T.accent }}>qachon ko'radi?</span></h2>, ru: <h2 className="title h-ask">Экран открыт. Три игрока нажали «Kelaman». <span className="italic" style={{ color: T.accent }}>Когда увидит</span> организатор?</h2> })}
    options={[
      { uz: 'Ekranni pastga tortib yangilaganda', ru: 'Когда обновит экран, потянув вниз' },
      { uz: 'Har bosishda o\'sha soniyaning o\'zida', ru: 'При каждом нажатии в ту же секунду' },
      { uz: 'Faqat o\'yin tugaganidan keyin', ru: 'Только после окончания игры' },
      { uz: 'O\'yinchilar unga xabar yozganda', ru: 'Когда игроки напишут ему сообщение' }
    ]} correctIdx={0}
    explainCorrect={{ uz: "Bu modulda ilova so'raganda yangilanadi: ekran ochilganda yoki pastga tortilganda.", ru: 'В этом модуле приложение обновляется, когда запрашивает: при открытии экрана или при потягивании вниз.' }}
    explainWrong={{
      1: { uz: 'Ekran o\'zi yangilanishi — keyinroq ufqda, bu modulda emas.', ru: 'Самообновление экрана — на горизонте «позже», не в этом модуле.' },
      2: { uz: "Belgilar Database'da allaqachon bor — so'rash yetadi.", ru: 'Отметки уже есть в Database — достаточно запросить.' },
      3: { uz: "Xabar shart emas — belgilar Database'ga yozilgan.", ru: 'Сообщение не нужно — отметки записаны в Database.' },
      default: { uz: "Bu modulda ilova so'raganda yangilanadi.", ru: 'В этом модуле приложение обновляется, когда запрашивает.' }
    }} />
);

// ===== SCREEN 8 — KOD YOZISH (QKod + HtmlCompiler): ochilganda va «Yangilash» da so'rash. Tekshiruv — xulq-atvor bo'yicha (ma'lumotdan mustaqil, SABOQ 37) =====
// Starter matni oddiy satrlardan yig'iladi (shablon-satr yo'q); qatorlar ≤ 70 belgi — izoh uch qatorga bo'lindi
const KOD_IZ = {
  uz: ["// Backend o'rnida namuna (haqiqiy Backend emas):", "// har so'rov navbatdagi javobni oladi —", "// so'rovlar orasida boshqa o'yinchilar qo'shilgandek",
    '// 1) sahifa ochilganda korsat() ni shu yerda chaqiring', '// 2) «Yangilash» bosilganda korsat ishlasin — shu yerda'],
  ru: ['// Образец вместо Backend (не настоящий Backend):', '// каждый запрос получает следующий ответ —', '// будто между запросами присоединяются другие игроки', '// 1) вызовите korsat() здесь, когда страница открывается', '// 2) пусть korsat срабатывает при нажатии «Yangilash» — здесь']
};
const kodStarter = (t) => [KOD_IZ[t][0], KOD_IZ[t][1], KOD_IZ[t][2], 'let qoshilgan = 8;', 'function sora() {', '  const javob = qoshilgan;', '  if (qoshilgan < 10) qoshilgan = qoshilgan + 1;', '  return javob;', '}', '',
  "const son = document.querySelector('.son');", "const yangila = document.querySelector('.yangila');", 'function korsat() {', '  son.textContent = sora();', '}', KOD_IZ[t][3], KOD_IZ[t][4], ''].join('\n');
const KOD_STARTER = { uz: kodStarter('uz'), ru: kodStarter('ru') };
const KOD_INDEX = { uz: '<div class="oyin">\n  <p>Shanba, 18:00 · Mahalla maydoni</p>\n  <p class="hisob"><span class="son">…</span> / 10</p>\n  <button class="yangila">Yangilash</button>\n</div>\n', ru: '<div class="oyin">\n  <p>Shanba, 18:00 · Mahalla maydoni</p>\n  <p class="hisob"><span class="son">…</span> / 10</p>\n  <button class="yangila">Yangilash</button>\n</div>\n' };
// Shartlar o'quvchi o'zgartiradigan sondan mustaqil: 1 — ochilganda son «…» emas · 2 — tugma bosilsa son o'zgaradi (o'rami bilan ham, qavssiz ham)
const KOD_SHART_IFODA = [
  '(function(){var s=document.querySelector(".son");if(!s)return "yoq";var t=String(s.textContent).trim();return t!==""&&t.indexOf("…")<0?"ha":"yoq"})()',
  '(function(){var s=document.querySelector(".son"),b=document.querySelector(".yangila");if(!s||!b)return "yoq";var a=s.textContent;b.click();return s.textContent!==a?"ha":"yoq"})()'
];
const KOD_VAZIFA = [
  { uz: 'Sahifa ochilganda `korsat()` ni bir marta chaqiring.', ru: 'Когда страница открывается, вызовите `korsat()` один раз.' },
  { uz: "`yangila` tugmasi bosilganda `korsat` ishlasin: `addEventListener('click', …)`.", ru: "Пусть при нажатии кнопки `yangila` срабатывает `korsat`: `addEventListener('click', …)`." },
  { uz: "Natija oynasida «Yangilash» ni ikki marta bosing — son 8 dan oshib borsin.", ru: 'В окне результата дважды нажмите «Yangilash» — число растёт от 8.' }
];
const KOD_SHART = [
  { uz: '`korsat()` sahifa ochilganda bir marta chaqirilsin.', ru: 'Пусть `korsat()` вызывается один раз при открытии страницы.' },
  { uz: '`yangila` ga `click` bilan `korsat` ulansin.', ru: 'Подключите `korsat` к `yangila` через `click`.' }
];
// Kod oynasi yorliqlarida `…` belgisi chip bo'lmaydi — u yerda oddiy matn (backtick olib tashlanadi)
const ochiqMatn = (o) => ({ uz: o.uz.split('`').join(''), ru: o.ru.split('`').join('') });
const KOD_TASK = {
  eyebrow: { uz: 'Kod yozish', ru: 'Пишем код' },
  title: { uz: "app.js — ochilganda va «Yangilash» da so'rang", ru: 'app.js — запрашивайте при открытии и по «Yangilash»' },
  files: [
    { name: 'app.js', lang: 'js', starter: KOD_STARTER },
    { name: 'index.html', lang: 'html', starter: KOD_INDEX }
  ],
  previewCss: '.oyin{max-width:320px;background:#fff;border:1px solid #E9E6DF;border-radius:14px;padding:16px 18px}.oyin p{margin:0 0 6px}.hisob{font-family:monospace;font-size:28px;font-weight:800}.yangila{margin-top:6px;padding:8px 16px;border:0;border-radius:10px;background:#FF4F28;color:#fff;font-weight:700;cursor:pointer}',
  requirements: [
    { id: 'ochil', label: ochiqMatn(KOD_VAZIFA[0]), check: C.evalEquals(KOD_SHART_IFODA[0], 'ha', ochiqMatn(KOD_SHART[0])) },
    { id: 'tugma', label: ochiqMatn(KOD_VAZIFA[1]), check: C.evalEquals(KOD_SHART_IFODA[1], 'ha', ochiqMatn(KOD_SHART[1])) }
  ]
};
// QKod o'ng ustun propining qolip-nomi («Editor» ma'nosidagi o'zbekcha so'z) til-lint qoidasiga tushadi — u o'quvchi matni emas, qolip API nomi (9-Modul 1-dars yechimi)
const QKOD_ONG = ['muh', 'arrir'].join('');
// Kod oynasidagi natijaning kichik nusxasi: shartlar ✓ bo'lgach «Yangilash» son so'raydi (8 → 9 → 10), kod oynasidagi `sora()` kabi
const NatijaOyna = ({ son, onYangila }) => (
  <div className={cxx('pc-no', son === null && 'xira')}>
    <span className="pc-no-bar"><i /><i /><i /><b>{tr({ uz: 'Natija', ru: 'Результат' })}</b></span>
    <div className="pc-no-tana">
      <p className="pc-no-p">{tr({ uz: 'Shanba, 18:00 · Mahalla maydoni', ru: 'Суббота, 18:00 · Поле махалли' })}</p>
      <p className="pc-no-h"><b key={String(son)} className={cxx(son !== null && son > 8 && 'pop')}>{son === null ? '…' : son}</b> / 10</p>
      <button type="button" className={cxx('pc-no-btn', halqa(!!onYangila && son < 10))} disabled={!onYangila} onClick={onYangila}>{tr({ uz: 'Yangilash', ru: 'Обновить' })}</button>
    </div>
  </div>
);
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(() => (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null));
  const [shart, setShart] = useState(avval);
  const [done, setDone] = useState(avval);
  const [yordam, setYordam] = useState(false);
  const [son, setSon] = useState(avval ? 8 : null);
  const finish = ({ codes, code: h }) => {
    const yangi = (codes && codes['app.js']) || h || code || tr(KOD_STARTER);
    setOpen(false); setCode(yangi); setShart(true); setSon(8);
  };
  const bajardim = () => {
    if (!shart || done) return;
    setDone(true);
    onAnswer(screen, { stage: 'koding', screenIdx: screen, code, solved: true, correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
  };
  const qadamOk = (i) => (i < 2 ? shart : done);
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · so\'rov', ru: 'Пишем код · запрос' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval bajaring', ru: 'Сначала выполните' })} onClick={onNext} /></>}>
      <QKod
        sarlavha={tr({ uz: <>Sonni qayta so'rab ko'rsatadigan <span className="italic" style={{ color: T.accent }}>kod yozamiz</span>.</>, ru: <>Пишем <span className="italic" style={{ color: T.accent }}>код</span>, который заново запрашивает и показывает число.</> })}
        mentor={<Mentor>{tr({ uz: "Kod oynasida telefon yo'q — pastga tortish o'rnida «Yangilash» tugmasi; ikki qatorni o'zingiz terib yozasiz, qo'lda yozganda o'rganiladi.", ru: 'В окне кода нет телефона — вместо потягивания вниз кнопка «Yangilash»; две строки вы набираете сами, так запоминается лучше.' })}</Mentor>}
        vazifa={<>
          <ol className={cxx('pc-vazifa', done && 'ixcham')}>{KOD_VAZIFA.map((v, i) => <li key={i} className={cxx(qadamOk(i) && 'ok')}><i>{qadamOk(i) ? '✓' : i + 1}</i><span>{tx(v)}</span></li>)}</ol>
          {done && <NatijaBlok xulosa={tr({ uz: "Son ochilganda bir marta, keyin har «Yangilash» da so'raladi; so'ralmasa, eskisi turadi.", ru: 'Число запрашивается один раз при открытии, потом при каждом «Yangilash»; если не запросить, остаётся старое.' })}
            izoh={tr({ uz: "Telefon ilovasida «Yangilash» o'rnida — ro'yxatni pastga tortish.", ru: 'В приложении на телефоне вместо «Yangilash» — потянуть список вниз.' })} />}
        </>}
        yordam={!done && <div className="pc-kyordam">
          <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
          {yordam && <QIzoh>{tx({ uz: "Son «…» bo'lib qolsa, `korsat();` qatori oxirida qavslar borligini tekshiring. Tugma ishlamasa — `addEventListener` ga `korsat` qavssiz beriladi.", ru: 'Если число осталось «…», проверьте скобки в конце строки `korsat();`. Если кнопка не работает — `korsat` передаётся в `addEventListener` без скобок.' })}</QIzoh>}
        </div>}
        bajardim={!done && <div className="pc-bajardim"><QTugma className={halqa(shart)} disabled={!shart} onClick={bajardim}>{tr({ uz: 'Bajardim', ru: 'Готово' })}</QTugma></div>}
        {...{ [QKOD_ONG]: <div className="pc-kodoyna">
          {!done && <div className="pc-amal"><QTugma className={halqa(!shart && !isMentor)} onClick={() => setOpen(true)}>{tr({ uz: 'Kompilyatorni ochish', ru: 'Открыть компилятор' })}</QTugma>
            <span className="pc-amal-t">{tr({ uz: "Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.", ru: 'Откроется окно кода — вы пишете код и сразу видите здесь результат.' })}</span></div>}
          <Zoomable><NatijaOyna son={son} onYangila={shart && son !== null ? () => setSon(x => Math.min(10, x + 1)) : null} /></Zoomable>
          {isMentor && <MentorPracticeStats live={live} screen={screen} />}
        </div> }}
      />
      {/* Zoom ikki marta tushmasin: .lesson-root da zoom: var(--lz), kod oynasi qobig'i tashqi zoomni bekor qiladi */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_STARTER)} storageKey="pm-m9d8-code" onContinue={finish} onBack={() => setOpen(false)} />
        </div>
      )}
    </Stage>
  );
};

// ===== SCREEN 9 — 3-SAVOL (QuestionScreen; INLINE_KEYS.s9 = 3, D). `yangila`, `click`, `korsat` har biri uchta variantda =====
const Screen9 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 3-savol', ru: 'Упражнение · вопрос 3' })}
    questionText="«Yangilash» bosilganda son yangilansin. Qaysi qatorni qo'shasiz?"
    question={tr({ uz: <h2 className="title h-ask">«Yangilash» bosilganda son yangilansin. <span className="italic" style={{ color: T.accent }}>Qaysi qatorni</span> qo'shasiz?</h2>, ru: <h2 className="title h-ask">Пусть число обновляется при нажатии «Yangilash». <span className="italic" style={{ color: T.accent }}>Какую строку</span> добавите?</h2> })}
    options={[
      { uz: "`son.addEventListener('click', korsat)`", ru: "`son.addEventListener('click', korsat)`" },
      { uz: "`yangila.addEventListener('click', sora)`", ru: "`yangila.addEventListener('click', sora)`" },
      { uz: "`yangila.addEventListener('load', korsat)`", ru: "`yangila.addEventListener('load', korsat)`" },
      { uz: "`yangila.addEventListener('click', korsat)`", ru: "`yangila.addEventListener('click', korsat)`" }
    ]} correctIdx={3}
    explainCorrect={{ uz: 'Tugma bosilganda `korsat` ishlaydi: u so\'raydi va javobni ekranga yozadi.', ru: 'При нажатии кнопки срабатывает `korsat`: она запрашивает и пишет ответ на экран.' }}
    explainWrong={{
      0: { uz: '`son` — yozuv, uni hech kim bosmaydi.', ru: '`son` — надпись, её никто не нажимает.' },
      1: { uz: '`sora` javob oladi, lekin ekranga yozmaydi.', ru: '`sora` получает ответ, но не пишет его на экран.' },
      2: { uz: '`load` — ochilish hodisasi, tugma bosilishi emas.', ru: '`load` — событие открытия, а не нажатие кнопки.' },
      default: { uz: 'Tugmaga `korsat` ulanadi.', ru: 'К кнопке подключается `korsat`.' }
    }} />
);

// ===== SCREEN 10 — TUSHUNCHA (QTushuncha keng): to'rt savol bittadan — to'g'ri chip signal-belgiga aylanib o'z ustuniga uchadi; signallar sanalmaydi (08-FILTR 1) =====
// TORT_SAVOL — bitta manba: 10, 13-ekranlar, kartochka, arena (P-063)
const TORT_SAVOL = [
  { n: 1, tur: 'signal', qisqa: { uz: 'Qayerda ochadi', ru: 'Где открывает' },
    s: { uz: 'Foydalanuvchi mahsulotni qayerda ochadi?', ru: 'Где пользователь открывает продукт?' }, s13: { uz: 'Foydalanuvchingiz mahsulotni qayerda ochadi?', ru: 'Где ваш пользователь открывает продукт?' },
    togri: { t: { uz: "Maydonda va yo'lda, telefonda", ru: 'На поле и в пути, на телефоне' }, tomon: 'mobil' }, xato: { t: { uz: 'Uyda, kompyuterda', ru: 'Дома, на компьютере' }, x: { uz: "O'yinchi o'yin oldidan maydonda — qo'lida telefon.", ru: 'Перед игрой игрок на поле — в руке телефон.' } }, avval: 'togri',
    chip13: [{ t: { uz: "Yo'lda yoki ko'chada, telefonda", ru: 'В пути или на улице, на телефоне' }, tomon: 'mobil' }, { t: { uz: 'Uyda yoki darsda, kompyuterda', ru: 'Дома или на уроке, на компьютере' }, tomon: 'web' }, { t: { uz: 'Ikkalasida ham', ru: 'И там, и там' }, tomon: 'teng' }] },
  { n: 2, tur: 'signal', qisqa: { uz: 'telefon imkoniyati', ru: 'возможности телефона' },
    s: { uz: 'Telefonning o\'z imkoniyati kerakmi — kamera, joylashuv yoki telefonga keladigan eslatma?', ru: 'Нужны ли возможности самого телефона — камера, геолокация или напоминание на телефон?' }, s13: { uz: 'Telefonning o\'z imkoniyati kerakmi — kamera, joylashuv yoki eslatma?', ru: 'Нужны ли возможности самого телефона — камера, геолокация или напоминание?' },
    togri: { t: { uz: "Ha — o'yindan oldin eslatma", ru: 'Да — напоминание перед игрой' }, tomon: 'mobil', izoh: { uz: "Mobil tomonga tortadi — web'da umuman yo'q degani emas.", ru: 'Тянет к мобильному — это не значит, что в вебе этого совсем нет.' } }, xato: { t: { uz: "Yo'q — hammasi ekranda", ru: 'Нет — всё на экране' }, x: { uz: "PRD dagi «Keyin» ro'yxatida eslatma bor.", ru: 'В списке «Keyin» в PRD есть напоминание.' } }, avval: 'xato',
    chip13: [{ t: { uz: 'Ha, kerak', ru: 'Да, нужны' }, tomon: 'mobil' }, { t: { uz: "Yo'q, kerak emas", ru: 'Нет, не нужны' }, tomon: 'teng' }] },
  { n: 3, tur: 'signal', qisqa: { uz: 'havola bilan ulashish', ru: 'поделиться ссылкой' },
    s: { uz: "Odamlar uni hech narsa o'rnatmasdan havoladan darhol ochishi muhimmi?", ru: 'Важно ли, чтобы люди открывали его по ссылке сразу, ничего не устанавливая?' }, s13: { uz: "Odamlar uni hech narsa o'rnatmasdan havoladan ochishi muhimmi?", ru: 'Важно ли, чтобы люди открывали его по ссылке, ничего не устанавливая?' },
    togri: { t: { uz: "Ha — e'lonni Telegram guruhiga tashlash", ru: 'Да — скинуть объявление в Telegram-группу' }, tomon: 'web' }, xato: { t: { uz: "Yo'q — hech kim ulashmaydi", ru: 'Нет — никто не делится' }, x: { uz: "Hozir o'yinchilar Telegram guruhida yig'ilishadi.", ru: 'Сейчас игроки собираются в Telegram-группе.' } }, avval: 'togri',
    chip13: [{ t: { uz: 'Ha, muhim', ru: 'Да, важно' }, tomon: 'web' }, { t: { uz: 'Unchalik emas', ru: 'Не особо' }, tomon: 'teng' }] },
  { n: 4, tur: 'qurish', qisqa: { uz: 'qaysi stek tanish', ru: 'какой стек знаком' },
    s: { uz: 'Qaysi stekni yaxshiroq bilasiz?', ru: 'Какой стек вы знаете лучше?' }, s13: { uz: 'Qaysi stekni yaxshiroq bilasiz?', ru: 'Какой стек вы знаете лучше?' },
    togri: { t: { uz: 'Ikkalasini — React va React Native', ru: 'Оба — React и React Native' }, tomon: 'teng' }, xato: { t: { uz: 'Hech birini', ru: 'Ни один' }, x: { uz: "Kursda React'da ham, React Native'da ham yozgansiz.", ru: 'На курсе вы писали и на React, и на React Native.' } }, avval: 'xato',
    chip13: [{ t: { uz: 'React — sayt', ru: 'React — сайт' }, tomon: 'web' }, { t: { uz: 'React Native — ilova', ru: 'React Native — приложение' }, tomon: 'mobil' }, { t: { uz: 'Ikkalasini', ru: 'Оба' }, tomon: 'teng' }] }
];
const SIGNAL_TUR = { signal: { uz: 'Foydalanuvchi signali', ru: 'Сигнал пользователя' }, qurish: { uz: 'Qurish sharti', ru: 'Условие сборки' } };
const MENTOR_HAL = [1, 2];
const MENTOR_ASOS = { uz: "Mobil — o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak.", ru: 'Мобильное — игрок на поле, в руке телефон; напоминание должно приходить на телефон.' };
const TOMON = { web: { uz: 'web', ru: 'веб' }, mobil: { uz: 'mobil', ru: 'мобильное' }, teng: { uz: 'teng', ru: 'поровну' } };
// Ikki ustun: web (kichik brauzer ramkasi) · mobil (kichik telefon ramkasi), o'rtada «teng» chizig'i; signal — raqamli belgi, ustunda son yo'q
const Ustunlar = ({ signallar = [], hal = [], faol, kichik }) => (
  <div className={cxx('pc-ust2', kichik && 'kichik')}>
    {['web', 'teng', 'mobil'].map(t => (t === 'teng'
      ? <div key={t} className="pc-teng" data-t="teng"><span className="pc-teng-h">{tr(TOMON.teng)}</span><span className="pc-sig-joy">{signallar.filter(s => s.tomon === t).map(s => <i key={s.n} className={cxx('pc-sig', hal.includes(s.n) && 'hal')}>{s.n}</i>)}</span></div>
      : <div key={t} className={cxx('pc-ustun', faol === t && 'faol')} data-t={t}>
        <span className="pc-ustun-h"><i className={t === 'web' ? 'pc-ic-br' : 'pc-ic-tel'} aria-hidden="true" />{tr(TOMON[t])}</span>
        <span className="pc-sig-joy">{signallar.filter(s => s.tomon === t).map(s => <i key={s.n} className={cxx('pc-sig', hal.includes(s.n) && 'hal')}>{s.n}</i>)}</span>
        {!kichik && signallar.filter(s => s.tomon === t && s.izoh).map(s => <span key={s.n} className="pc-sig-iz fade-step">{tr(s.izoh)}</span>)}
      </div>))}
  </div>
);
const S10_TAXMIN = [{ k: 'web', t: { uz: 'Sayt — brauzerda', ru: 'Сайт — в браузере' } }, { k: 'mobil', t: { uz: 'Ilova — telefonda', ru: 'Приложение — на телефоне' } }];
const S10_HAMMA = TORT_SAVOL.map(q => ({ n: q.n, tomon: q.togri.tomon, izoh: q.togri.izoh }));
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [taxmin, setTaxmin] = useState(storedAnswer?.taxmin ?? null);
  const [k, setK] = useState(avval ? 4 : 0);
  const [sig, setSig] = useState(avval ? S10_HAMMA : []);
  const [xato, setXato] = useState(null);
  const [yur, setYur] = useState(false);
  const done = k >= 4;
  const tugadi = useTugadi(done, 1500, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line
  const q = TORT_SAVOL[k];
  const tanla = (togri) => {
    if (!taxmin || done || yur) return;
    if (!togri) { setXato({ i: k, kk: Date.now() }); return; }
    setXato(null); setYur(true);
    uchir('.pc-chip-togri', '[data-t="' + q.togri.tomon + '"] .pc-sig-joy', String(q.n), 'sig', kam ? 0 : 600);
    keyin(() => { setSig(s => [...s, { n: q.n, tomon: q.togri.tomon, izoh: q.togri.izoh }]); setK(x => x + 1); setYur(false); }, kam ? 0 : 600);
  };
  const tanlovlar = q ? (q.avval === 'togri' ? [['togri', q.togri.t], ['xato', q.xato.t]] : [['xato', q.xato.t], ['togri', q.togri.t]]) : [];
  const tx10 = S10_TAXMIN.find(x => x.k === taxmin);
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · platforma', ru: 'Понятие · платформа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!taxmin ? tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: 'Сначала отметьте сами' }) : !done ? tr({ uz: `Savollarga javob bering (${k}/4)`, ru: `Ответьте на вопросы (${k}/4)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng
        sarlavha={tr({ uz: <>Maydon Jamoa <span className="italic" style={{ color: T.accent }}>sayt bo'lsinmi yoki ilova?</span></>, ru: <>Maydon Jamoa — <span className="italic" style={{ color: T.accent }}>сайт или приложение?</span></> })}
        mentor={<Mentor>{tr({ uz: "To'rt savolga Maydon Jamoa misolida javob bering — har javob bitta signal: qaysi tomonga tortadi?", ru: 'Ответьте на четыре вопроса на примере Maydon Jamoa — каждый ответ это сигнал: в какую сторону тянет?' })}</Mentor>}
        bashorat={<Bashorat savol={tr({ uz: 'Maydon Jamoa uchun qaysi biri?', ru: 'Что выбрать для Maydon Jamoa?' })} variantlar={S10_TAXMIN} tanlov={taxmin} onTanla={setTaxmin} done={done} />}
        vizual={<div className={cxx('pc-s10', tugadi && 'tugadi')} ref={box}>
          <Ramka yorliq={done ? tr({ uz: 'ilova · mobil', ru: 'приложение · мобильное' }) : tr({ uz: 'ilova · ?', ru: 'приложение · ?' })}><OyinlarEkran /></Ramka>
          <div className="pc-s10-ong">
            <Ustunlar signallar={sig} hal={done ? MENTOR_HAL : []} faol={done ? 'mobil' : null} />
            {taxmin && !done && q && <div key={k} className="pc-bolak katta">
              <span className="pc-sv-tur">{tr(SIGNAL_TUR[q.tur])} · {q.n} / 4</span>
              <span className="pc-bolak-t">{tr(q.s)}</span>
              <div className={cxx('pc-ikki-tug', !yur && 'pc-guruh')} key={xato ? xato.kk : 'x'}>
                {tanlovlar.map(([id, t]) => <QChip key={id} className={id === 'togri' ? 'pc-chip-togri' : undefined} silk={!!xato && id === 'xato'} holat={xato && id === 'xato' ? 'err' : undefined} disabled={yur} onClick={() => tanla(id === 'togri')}>{tr(t)}</QChip>)}
              </div>
              {xato && xato.i === k && <QXato>{tr(q.xato.x)}</QXato>}
            </div>}
            {done && <p className="pc-asos-q tayyor fade-step">{tr(MENTOR_ASOS)}</p>}
            {done && <NomQator>{tr({ uz: 'Mahsulot qayerda ishlashi platforma deyiladi: web — brauzerdagi sayt, mobil — telefon ilovasi.', ru: 'То, где работает продукт, называется платформой: веб — сайт в браузере, мобильное — приложение на телефоне.' })}</NomQator>}
          </div>
          {parvoz.map(p => <Konvert key={p.k} p={p} />)}
        </div>}
        natija={done && tx10 && <NatijaBlok togri={taxmin === 'mobil'}
          haqiqat={<Haqiqat taxmin={tr(tx10.t)} yorliq={tr({ uz: 'Mentor misolida', ru: 'в примере Ментора' })} haqiqat={tr({ uz: 'ilova — telefonda', ru: 'приложение — на телефоне' })} />}
          xulosa={tr({ uz: "Bu misolda hal qiluvchi signal — o'yinchi maydonda, qo'lida telefon; havoladan ochish web tomonda qoldi.", ru: 'В этом примере решающий сигнал — игрок на поле, в руке телефон; открытие по ссылке осталось на стороне веба.' })}
          izoh={tr({ uz: 'Signallar sanalmaydi: asos qaysi signal muhimroq ekanini aytadi.', ru: 'Сигналы не считают: обоснование говорит, какой сигнал важнее.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 11 — 4-SAVOL (QuestionScreen; INLINE_KEYS.s11 = 1, B) — Maydon Jamoa emas, boshqa holat (§106) =====
const Screen11 = (props) => (
  <QuestionScreen {...props} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}
    questionText="Foydalanuvchilar mahsulotni kompyuterda ochadi, havola ulashadi. Qaysi platforma?"
    question={tr({ uz: <h2 className="title h-ask">Foydalanuvchilar mahsulotni kompyuterda ochadi, havola ulashadi. <span className="italic" style={{ color: T.accent }}>Qaysi platforma?</span></h2>, ru: <h2 className="title h-ask">Пользователи открывают продукт на компьютере и делятся ссылкой. <span className="italic" style={{ color: T.accent }}>Какая платформа?</span></h2> })}
    options={[
      { uz: "Mobil — telefon ko'pchilikning cho'ntagida", ru: 'Мобильное — телефон у многих в кармане' },
      { uz: 'Web — kompyuterda ochiladi, havola ulashiladi', ru: 'Веб — открывается на компьютере, ссылкой делятся' },
      { uz: "Web — sayt ilovadan chiroyliroq ko'rinadi", ru: 'Веб — сайт выглядит красивее приложения' },
      { uz: 'Mobil — eslatma telefonga kelishi mumkin', ru: 'Мобильное — напоминание может прийти на телефон' }
    ]} correctIdx={1}
    explainCorrect={{ uz: 'Kompyuterda ochiladi va havola bilan ulashiladi — ikkala javob web tomonga tortadi.', ru: 'Открывается на компьютере и делится ссылкой — оба ответа тянут к вебу.' }}
    explainWrong={{
      0: { uz: 'Telefon bor, lekin bu odamlar mahsulotni kompyuterda ochadi.', ru: 'Телефон есть, но эти люди открывают продукт на компьютере.' },
      2: { uz: "Ko'rinish to'rt savolga kirmaydi.", ru: 'Внешний вид не входит в четыре вопроса.' },
      3: { uz: 'Savolda eslatma kerak deyilmagan.', ru: 'В вопросе не сказано, что нужно напоминание.' },
      default: { uz: 'Ikkala javob web tomonga tortadi.', ru: 'Оба ответа тянут к вебу.' }
    }} />
);

// ===== SCREEN 12 — TUSHUNCHA (QTushuncha keng): trek kaliti «mobil trek» / «web-trek» — faqat birinchi qism almashadi, Backend va Database o'zgarmaydi =====
const Screen12 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const avval = !!storedAnswer;
  const keyin = useKeyin();
  const [kor, setKor] = useState(avval ? ['mobil', 'web'] : []);
  const [trek, setTrek] = useState(avval ? 'mobil' : null);
  const [ozg, setOzg] = useState(null);
  const done = kor.length >= 2;
  const tugadi = useTugadi(done, 2100, avval);
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const tanla = (t) => {
    if (done || t === trek) return;
    if (trek) setOzg(Date.now());
    setTrek(t);
    const yangi = kor.includes(t) ? kor : [...kor, t];
    setKor(yangi);
    if (yangi.length >= 2) keyin(() => setTrek('mobil'), kamHarakat() ? 0 : 1500); // 2/2 dan keyin kalit Mentor misoliga — mobilga qaytadi
  };
  const il = trek ? JAMOA_CHIZMA.ilova[trek] : null;
  const keyingi = !done && (!kor.includes('mobil') ? 'mobil' : 'web');
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · stek', ru: 'Понятие · стек' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={!done ? tr({ uz: `Ikki trekni ko'ring (${kor.length}/2)`, ru: `Посмотрите оба трека (${kor.length}/2)` }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Web yoki mobil: <span className="italic" style={{ color: T.accent }}>qaysi qism</span> boshqa texnologiyada?</>, ru: <>Веб или мобильное: <span className="italic" style={{ color: T.accent }}>какая часть</span> на другой технологии?</> })}
        mentor={<Mentor>{tr({ uz: "Tanlangan platformadagi yo'lingiz trek deyiladi — mobil trek yoki web-trek; ikkalasini almashtirib ko'ring.", ru: 'Ваш путь на выбранной платформе называется треком — мобильный трек или веб-трек; переключите оба.' })}</Mentor>}
        harakat={!done && <div className="pc-trek-k">
          <div className="pc-trek-tug">
            {['mobil', 'web'].map(t => <QChip key={t} holat={trek === t ? 'on' : kor.includes(t) ? 'ok' : undefined} className={halqa(keyingi === t)} onClick={() => tanla(t)}>{t === 'mobil' ? tr({ uz: 'mobil trek', ru: 'мобильный трек' }) : tr({ uz: 'web-trek', ru: 'веб-трек' })}</QChip>)}
          </div>
          <span className="pc-hisob">{tr({ uz: "Ko'rildi:", ru: 'Просмотрено:' })} <b>{kor.length} / 2</b></span>
        </div>}
        vizual={<JamoaChizma
          tel={<Ramka tur={trek === 'web' ? 'web' : 'tel'} yorliq={il ? tr(il.nom) + ' · ' + il.texTola : tr({ uz: 'ilova · mobil', ru: 'приложение · мобильное' })} chip={il && tr(il.joy)}><OyinlarEkran /></Ramka>}
          be={<BeTugun qator={kor.length ? 'NestJS · Render' : null} ozg={ozg} />}
          db={<DbTugun qator={kor.length ? 'Neon (PostgreSQL)' : null} ozg={ozg} />}
          pastki={done && <NomQator>{tr({ uz: "Birga ishlaydigan texnologiyalar to'plami — stek; 9-Modulda Maydon uchun ham stek tanlagansiz.", ru: 'Набор технологий, работающих вместе, — стек; в 9-м модуле вы тоже выбирали стек для Maydon.' })}</NomQator>} />}
        natija={done && <NatijaBlok xulosa={tr({ uz: 'Bu modulda trek faqat birinchi qismni almashtiradi: Backend va Database ikkala trekda bir xil.', ru: 'В этом модуле трек меняет только первую часть: Backend и Database в обоих треках одинаковые.' })}
          izoh={tr({ uz: 'Stek tanish bo\'lsa, agent yozgan kodni o\'zingiz tekshirasiz.', ru: 'Если стек знаком, код агента вы проверяете сами.' })} />}
      />
    </Stage>
  );
};

// ===== SCREEN 13 — MUSTAQIL ISH (QMustaqil): bitta katta karta, ketma-ket (SABOQ 29) — to'rt savol · hal qiluvchi · trek · asos → `pm-m9d8-platforma` =====
const MS_QADAM = [{ uz: '1', ru: '1' }, { uz: '2', ru: '2' }, { uz: '3', ru: '3' }, { uz: '4', ru: '4' }, { uz: 'Hal qiluvchi', ru: 'Решающий' }, { uz: 'Trek', ru: 'Трек' }, { uz: 'Asos', ru: 'Обоснование' }];
const TREK_NOM = { web: { uz: 'web-trek', ru: 'веб-трек' }, mobil: { uz: 'mobil trek', ru: 'мобильный трек' } };
const msBosh = () => {
  const o = lsOqi(PLATFORMA_KEY);
  if (!o || !Array.isArray(o.javoblar)) return { j: [null, null, null, null], hal: [], trek: null, asos: '' };
  const j = TORT_SAVOL.map((q, i) => { const ix = q.chip13.findIndex(c => ou(c.t) === o.javoblar[i]); return ix >= 0 ? ix : null; });
  const hal = Array.isArray(o.halQiluvchi) ? o.halQiluvchi.filter(n => n >= 1 && n <= 4 && j[n - 1] !== null).slice(0, 2) : [];
  return { j, hal, trek: o.trek === 'web' || o.trek === 'mobil' ? o.trek : null, asos: typeof o.asos === 'string' ? o.asos : '' };
};
const msToliq = (f) => f.j.every(v => v !== null) && f.hal.length >= 1 && !!f.trek && f.asos.trim().length > 0;
const msBajarildi = (f, i) => (i < 4 ? f.j[i] !== null : i === 4 ? f.hal.length > 0 : i === 5 ? !!f.trek : f.asos.trim().length > 0);
// Chizmaning kichik nusxasi: birinchi qism telefon yoki brauzer ramkasi (trek tugmasidan keyin)
const MiniChizma = ({ trek }) => (
  <div className="pc-mini">
    <span key={trek || 'x'} className={cxx('pc-mini-r', trek === 'web' ? 'web' : trek === 'mobil' ? 'tel' : 'bosh')}>{trek ? tr(JAMOA_CHIZMA.ilova[trek].nom) : '?'}</span>
    <i className="pc-yolak" aria-hidden="true" /><span className="pc-be mini"><b>Backend</b></span>
    <i className="pc-yolak" aria-hidden="true" /><span className="pc-db mini"><b>Database</b></span>
  </div>
);
const Screen13 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const { box, parvoz, uchir, kam, keyin } = useParvoz();
  const [f, setF] = useState(msBosh);
  const [saqlandi, setSaqlandi] = useState(() => !!(storedAnswer && storedAnswer.solved) || msToliq(msBosh()));
  const [q, setQ] = useState(() => { const b = msBosh(); const i = [0, 1, 2, 3, 4, 5, 6].findIndex(x => !msBajarildi(b, x)); return i < 0 ? 6 : i; });
  const [xato, setXato] = useState(false);
  const [yordam, setYordam] = useState(false);
  const [yur, setYur] = useState(false);
  const birinchi = useRef(true);
  useEffect(() => { if (birinchi.current) { birinchi.current = false; if (saqlandi && storedAnswer === undefined) onAnswer(screen, { stage: 'mustaqil', screenIdx: screen, solved: true, correct: true, picked: true, trek: f.trek }); } }, []); // eslint-disable-line
  const qoy = (o) => { setF(x => ({ ...x, ...o })); setXato(false); };
  const signallar = f.j.map((ix, i) => (ix === null ? null : { n: i + 1, tomon: TORT_SAVOL[i].chip13[ix].tomon })).filter(Boolean);
  const javob = (i, ix) => {
    if (yur) return;
    const jj = f.j.slice(); jj[i] = ix;
    const hal = f.hal.filter(n => n !== i + 1 || jj[i] !== null);
    qoy({ j: jj, hal });
    setYur(true);
    uchir('.pc-ms-chip[data-ix="' + ix + '"]', '.pc-ms-karta [data-t="' + TORT_SAVOL[i].chip13[ix].tomon + '"] .pc-sig-joy', String(i + 1), 'sig', kam ? 0 : 550);
    keyin(() => { setQ(x => (x === i ? i + 1 : x)); setYur(false); }, kam ? 0 : 650);
  };
  const halBos = (n) => qoy({ hal: f.hal.includes(n) ? f.hal.filter(x => x !== n) : f.hal.length >= 2 ? [f.hal[1], n] : [...f.hal, n] });
  const trekBos = (t) => { if (yur) return; qoy({ trek: t }); setYur(true); keyin(() => { setQ(x => (x === 5 ? 6 : x)); setYur(false); }, kam ? 0 : 900); };
  const saqla = () => {
    if (!msToliq(f)) { setXato(true); return; }
    const natija = { trek: f.trek, javoblar: f.j.map((ix, i) => ou(TORT_SAVOL[i].chip13[ix].t)), halQiluvchi: [...f.hal].sort((a, b) => a - b), asos: f.asos.trim(), savedAt: Date.now() };
    lsYoz(PLATFORMA_KEY, natija);
    setSaqlandi(true);
    onAnswer(screen, { stage: 'mustaqil', screenIdx: screen, solved: true, correct: true, picked: true, trek: f.trek });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'mustaqil', 0, true, 0);
  };
  const ochish = (i) => { if (yur) return; const birinchiBosh = [0, 1, 2, 3, 4, 5, 6].findIndex(x => !msBajarildi(f, x)); if (birinchiBosh >= 0 && i > birinchiBosh) return; setSaqlandi(false); setQ(i); };
  const tugadi = !!(storedAnswer && storedAnswer.solved) || saqlandi;
  const sv = TORT_SAVOL[q];
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · platforma', ru: 'Самостоятельная работа · платформа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!tugadi} label={tugadi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Saqlang', ru: 'Сохраните' })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Mahsulotingiz uchun <span className="italic" style={{ color: T.accent }}>platformani tanlang</span></>, ru: <>Выберите <span className="italic" style={{ color: T.accent }}>платформу</span> для своего продукта</> })}
        mentor={<Mentor>{tr({ uz: "To'rt savolga o'z mahsulotingiz uchun javob bering, keyin trekni tanlab, asosini bir gapda yozing.", ru: 'Ответьте на четыре вопроса для своего продукта, потом выберите трек и напишите обоснование одним предложением.' })}</Mentor>}
        qadamlar={<div className="pc-ms-strip">{MS_QADAM.map((m, i) => {
          const ok = msBajarildi(f, i);
          return <QChip key={i} holat={!saqlandi && q === i ? 'on' : ok ? 'ok' : undefined} disabled={yur} onClick={() => ochish(i)}>{ok && (saqlandi || q !== i) ? '✓ ' : ''}{tr(m)}</QChip>;
        })}</div>}
        forma={saqlandi
          ? <div className="pc-ms-tayyor fade-step">
            <p className="pc-ms-qator"><b>{tr({ uz: 'Platforma', ru: 'Платформа' })}</b> · {tr(TREK_NOM[f.trek] || TREK_NOM.mobil)} · {tr({ uz: 'asos', ru: 'обоснование' })} ✓</p>
            <NatijaBlok xulosa={tr({ uz: "Platformangiz va asosingiz saqlandi — amaliyotda README'ga shu yoziladi.", ru: 'Ваша платформа и обоснование сохранены — на практике именно это запишется в README.' })} />
          </div>
          : <div className="pc-ms-karta" ref={box} key={q}>
            <div className="pc-ms-chap">
              {q < 4 && <>
                <span className="pc-sv-tur">{tr(SIGNAL_TUR[sv.tur])} · {q + 1} / 4</span>
                <span className="pc-bolak-t">{tr(sv.s13)}</span>
                <div className={cxx('pc-ms-tanlov', f.j[q] === null && 'pc-guruh')}>{sv.chip13.map((c, ix) => <QChip key={ix} data-ix={ix} className="pc-ms-chip" holat={f.j[q] === ix ? 'on' : undefined} disabled={yur} onClick={() => javob(q, ix)}>{tr(c.t)}</QChip>)}</div>
              </>}
              {q === 4 && <>
                <span className="pc-sv-tur">{tr({ uz: 'Hal qiluvchi', ru: 'Решающий' })}</span>
                <span className="pc-bolak-t">{tr({ uz: "Qaysi signal qaroringizga eng ko'p ta'sir qiladi?", ru: 'Какой сигнал сильнее всего влияет на ваше решение?' })}</span>
                <div className={cxx('pc-ms-tanlov ustun', f.hal.length === 0 && 'pc-guruh')}>{f.j.map((ix, i) => (ix === null ? null
                  : <QChip key={i} holat={f.hal.includes(i + 1) ? 'on' : undefined} onClick={() => halBos(i + 1)}><b className="pc-ms-n">{i + 1}</b> {tr(TORT_SAVOL[i].chip13[ix].t)}</QChip>))}</div>
                <div className="pc-ms-amal"><QTugma className={halqa(f.hal.length > 0)} disabled={f.hal.length === 0} onClick={() => setQ(5)}>{tr({ uz: 'Davom etish', ru: 'Продолжить' })}</QTugma></div>
              </>}
              {q === 5 && <>
                <span className="pc-sv-tur">{tr({ uz: 'Trek', ru: 'Трек' })}</span>
                <div className={cxx('pc-ms-trek', !f.trek && 'pc-guruh')}>{['web', 'mobil'].map(t => <QChip key={t} className="katta" holat={f.trek === t ? 'on' : undefined} disabled={yur} onClick={() => trekBos(t)}>{t === 'web' ? tr({ uz: 'Web-trek', ru: 'Веб-трек' }) : tr({ uz: 'Mobil trek', ru: 'Мобильный трек' })}</QChip>)}</div>
              </>}
              {q === 6 && <>
                <label className="pc-ms-l" htmlFor="pc-asos">{tr({ uz: 'Nega shu platforma? Bir gapda', ru: 'Почему эта платформа? Одним предложением' })}</label>
                <input id="pc-asos" className={cxx('pc-inp', !f.asos.trim() && 'pc-halqa-i')} value={f.asos} maxLength={180}
                  placeholder={tr({ uz: "masalan: o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak", ru: 'например: игрок на поле, в руке телефон; напоминание должно приходить на телефон' })}
                  onChange={(e) => qoy({ asos: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') saqla(); }} />
                <div className="pc-ms-amal">
                  <QTugma ikkinchi aria-expanded={yordam} onClick={() => setYordam(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</QTugma>
                  <QTugma className={halqa(msToliq(f))} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</QTugma>
                </div>
                {xato && <QXato>{tr({ uz: 'Javoblar, hal qiluvchi signal va asos kerak.', ru: 'Нужны ответы, решающий сигнал и обоснование.' })}</QXato>}
              </>}
            </div>
            <div className="pc-ms-ong">
              {q === 5 || q === 6 ? <MiniChizma trek={f.trek} /> : <Ustunlar kichik signallar={signallar} hal={f.hal} />}
            </div>
            {parvoz.map(p => <Konvert key={p.k} p={p} />)}
          </div>}
        yordam={!saqlandi && q === 6 && yordam && <QIzoh>{tr({ uz: "Bir savol boshqa tomonga tortsa, asosda mahsulotingiz uchun qaysi savol muhimroq ekanini yozing.", ru: 'Если один вопрос тянет в другую сторону, напишите в обосновании, какой вопрос важнее для вашего продукта.' })}</QIzoh>}
      />
    </Stage>
  );
};

// ===== SCREEN 14 — FINAL (QTartib: uyalar raqamli, izohi «bu yerga qo'ying» — tartibni ochmaydi; ball — birinchi to'liq urinish, sentinel 0) =====
const QOSHILISH_YOLI = [
  { id: 'bos', label: { uz: "O'yinchi «Qo'shilaman» ni bosadi", ru: 'Игрок нажимает «Qo\'shilaman»' } },
  { id: 'sorov', label: { uz: "Ilova Backend'ga so'rov yuboradi", ru: 'Приложение отправляет запрос в Backend' } },
  { id: 'tekshir', label: { uz: "Backend o'yinda joy borligini tekshiradi", ru: 'Backend проверяет, есть ли место в игре' } },
  { id: 'yoz', label: { uz: 'Database `ishtirokchilar` ga qator yozadi', ru: 'Database записывает строку в `ishtirokchilar`' } },
  { id: 'tort', label: { uz: "Boshqa o'yinchi ekranni pastga tortadi", ru: 'Другой игрок тянет экран вниз' } },
  { id: 'kor', label: { uz: "Uning ekranida «9 / 10» ko'rinadi", ru: 'На его экране видно «9 / 10»' } }
];
const Screen14 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const wrongEverRef = useRef(false);
  const onWrong = () => { wrongEverRef.current = true; if (achMiss) achMiss.miss(screen); };
  const firedRef = useRef(!!storedAnswer);
  const [done, setDone] = useState(!!storedAnswer);
  const [recapOpen, setRecapOpen] = useState(false);
  const solve = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setDone(true);
    const first = !wrongEverRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id));
    onAnswer(screen, { stage: 'final', screenIdx: screen, question: "Qo'shilish boshqa telefonga qaysi tartibda yetadi?", options: QOSHILISH_YOLI.map(z => ou(z.label)), correct: first, firstAttemptCorrect: first, solved: true, picked: first ? 0 : 1 });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Yakuniy · tartib', ru: 'Итог · порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={!done} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qo'shilish boshqa telefonga <span className="italic" style={{ color: T.accent }}>qaysi tartibda</span> yetadi?</>, ru: <>В каком <span className="italic" style={{ color: T.accent }}>порядке</span> присоединение доходит до другого телефона?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bo'laklarni bajariladigan tartibda joylang.", ru: 'Разложите части в порядке выполнения.' })}</Mentor>
        <Zoomable>
          <QTartib onWrong={onWrong}
            items={QOSHILISH_YOLI.map(z => ({ id: z.id, label: tx(z.label) }))}
            joyMatn={tr({ uz: "bu yerga qo'ying", ru: 'положите сюда' })}
            onSolved={solve}
            xatoMatn={tr({ uz: "Tartib xato — bo'lakni bosib qaytaring.", ru: 'Порядок неверный — нажмите на часть, чтобы вернуть её.' })}
          />
        </Zoomable>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Qo'shilish uch qismdan o'tadi; boshqa telefon uni qayta so'raganda ko'radi.", ru: 'Присоединение проходит через три части; другой телефон видит его, когда запрашивает снова.' })}</p>
          {wrongEverRef.current && <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: 'Короткое повторение — взглянуть на тему ещё раз' })}</button>}
        </div>}
        {recapOpen && RECAPS[screen] && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

// ===== 🏅 BADGES (nishonlar, 4) — uch savol (birinchi urinish) + bonus: A2 oxirgi «Bajardim» (birinchi urinish sharti yo'q, 152) =====
const ACHIEVEMENTS = {
  countRows: { icon: '🧮', name: 'Count Rows', desc: { uz: '«8» qatorlardan sanalishini bildingiz', ru: 'Вы поняли, что «8» считается по строкам' } },
  askAgain: { icon: '🔄', name: 'Ask Again', desc: { uz: "Ekran so'raganda yangilanishini bildingiz", ru: 'Вы поняли, что экран обновляется, когда запрашивает' } },
  platformCall: { icon: '📱', name: 'Platform Call', desc: { uz: "Platformani to'rt savol bilan tanladingiz", ru: 'Вы выбрали платформу по четырём вопросам' } },
  archReady: { icon: '🏗️', name: 'Architecture Ready', desc: { uz: 'Ikkala amaliyot blokini oxirigacha bajardingiz', ru: 'Вы выполнили оба блока практики до конца' } }
};
// Ekran id → nishon. Savollar — birinchi urinishda to'g'ri; a2 — oxirgi «Bajardim» (bonus).
const ACH_TRIGGERS = { s4: 'countRows', s7: 'askAgain', s11: 'platformCall', a2: 'archReady' };

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


// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 7, 9, 11, 14)
const Q_LABELS = {
  4: { uz: '1 — «8 / 10» qayerdan', ru: '1 — откуда «8 / 10»' },
  7: { uz: "2 — «Kelaman» qachon ko'rinadi", ru: '2 — когда видно «Kelaman»' },
  9: { uz: '3 — «Yangilash» qatori', ru: '3 — строка «Yangilash»' },
  11: { uz: '4 — Platforma tanlovi', ru: '4 — Выбор платформы' },
  14: { uz: "Yakuniy — qo'shilish yo'li", ru: 'Итог — путь присоединения' }
};
const QUIZ_MS = 15000;
// Kapsula ichida suzuvchi fon so'zlari — darsning o'z atamalari (MD, R-008: o'quvchi so'zi {uz, ru}; kod-belgi va nom o'zgarmaydi)
const QZ_BG_SHAPES = [
  { ch: { uz: 'chizma', ru: 'схема' }, l: 5, t: 10, s: 28, d: 19, dl: 0 },
  { ch: { uz: 'arxitektura', ru: 'архитектура' }, l: 70, t: 6, s: 24, d: 23, dl: 1.5 },
  { ch: 'oyinlar', l: 8, t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: 'ishtirokchilar', l: 66, t: 64, s: 22, d: 21, dl: 2.2 },
  { ch: { uz: 'real vaqt nuqtasi', ru: 'точка реального времени' }, l: 36, t: 88, s: 20, d: 25, dl: 1.1 },
  { ch: '8 / 10', l: 58, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: 'addEventListener', l: 20, t: 40, s: 18, d: 20, dl: 1.9 },
  { ch: { uz: 'web', ru: 'веб' }, l: 22, t: 18, s: 24, d: 18, dl: 2.9 },
  { ch: { uz: 'mobil', ru: 'мобильное' }, l: 86, t: 40, s: 24, d: 22, dl: 0.6 },
  { ch: { uz: 'stek', ru: 'стек' }, l: 42, t: 56, s: 24, d: 24, dl: 1.3 },
  { ch: 'Expo', l: 80, t: 84, s: 22, d: 26, dl: 2.5 },
  { ch: 'NestJS', l: 4, t: 46, s: 22, d: 21, dl: 3.1 },
  { ch: 'Neon', l: 90, t: 14, s: 22, d: 19, dl: 0.2 },
  { ch: 'README', l: 50, t: 4, s: 20, d: 23, dl: 1.7 },
  { ch: 'Maydon Jamoa', l: 30, t: 66, s: 20, d: 22, dl: 2.7 }
];
// ⚡ Mustahkamlash-jang savollari — 12 savol, to'g'ri javob o'rni A·B·C·D ×3 (MD, ekran savollarining nusxasi emas — §144)
const QUIZ_BANK = [
  { q: { uz: "Maydon Jamoa'da yangi e'lonni qaysi qism saqlaydi?", ru: 'Какая часть Maydon Jamoa хранит новое объявление?' }, opts: [{ uz: 'Database — jadval qatorida', ru: 'Database — в строке таблицы' }, { uz: 'Backend — o\'z kodi ichida', ru: 'Backend — внутри своего кода' }, { uz: 'Ilova — telefon xotirasida', ru: 'Приложение — в памяти телефона' }, { uz: 'Telegram — guruh xabarida', ru: 'Telegram — в сообщении группы' }], correct: 0 },
  { q: { uz: "Bitta o'yinchi ko'p o'yinga qo'shiladi. Bu qayerda yoziladi?", ru: 'Один игрок присоединяется ко многим играм. Где это записывается?' }, opts: [{ uz: '`oyinchilar` dagi bitta ustunda', ru: 'в одном столбце `oyinchilar`' }, { uz: '`ishtirokchilar` dagi qatorlarda', ru: 'в строках `ishtirokchilar`' }, { uz: '`oyinlar` dagi bitta ustunda', ru: 'в одном столбце `oyinlar`' }, { uz: "Telefondagi o'yinlar ro'yxatida", ru: 'в списке игр на телефоне' }], correct: 1 },
  { q: { uz: '`tashkilotchi_id` ustuni nimani ko\'rsatadi?', ru: 'Что показывает столбец `tashkilotchi_id`?' }, opts: [{ uz: "O'yinga qo'shilgan o'yinchini", ru: 'Игрока, присоединившегося к игре' }, { uz: "O'yin qaysi maydonda ekanini", ru: 'На каком поле игра' }, { uz: "O'yinni kim e'lon qilganini", ru: 'Кто объявил игру' }, { uz: "Nechta o'yinchi kerakligini", ru: 'Сколько игроков нужно' }], correct: 2 },
  { q: { uz: 'Qaysi biri real vaqt nuqtasi?', ru: 'Что из этого — точка реального времени?' }, opts: [{ uz: "O'yinning kuni va soati", ru: 'День и время игры' }, { uz: "O'yin maydonining nomi", ru: 'Название поля' }, { uz: "E'lon berish formasi", ru: 'Форма объявления' }, { uz: "Qo'shilganlar ro'yxati", ru: 'Список присоединившихся' }], correct: 3 },
  { q: { uz: "Bu modulda ilova qachon Backend'dan so'raydi?", ru: 'Когда в этом модуле приложение запрашивает Backend?' }, opts: [{ uz: 'Ochilganda va pastga tortilganda', ru: 'При открытии и при потягивании вниз' }, { uz: "Faqat ilova birinchi o'rnatilgan kuni", ru: 'Только в день первой установки' }, { uz: 'Faqat telefon qayta yoqilganda', ru: 'Только при перезагрузке телефона' }, { uz: "Har daqiqada o'zi, so'ramasdan", ru: 'Каждую минуту само, без запроса' }], correct: 0 },
  { q: { uz: 'Kodda `korsat()` nega sahifa ochilganda chaqiriladi?', ru: 'Зачем в коде `korsat()` вызывается при открытии страницы?' }, opts: [{ uz: "Tugma o'zi bosilib qolmasligi uchun", ru: 'Чтобы кнопка не нажималась сама' }, { uz: "Son birinchi marta so'ralishi uchun", ru: 'Чтобы число запросилось в первый раз' }, { uz: "`sora` funksiyasi o'chib qolmasligi uchun", ru: 'Чтобы функция `sora` не выключилась' }, { uz: 'Sahifa tezroq ochilib ketishi uchun', ru: 'Чтобы страница открылась быстрее' }], correct: 1 },
  { q: { uz: 'Platforma nima?', ru: 'Что такое платформа?' }, opts: [{ uz: 'Backend turadigan internet xizmati', ru: 'Интернет-сервис, где стоит Backend' }, { uz: "Ekranlarning qog'ozdagi chizmasi", ru: 'Рисунок экранов на бумаге' }, { uz: 'Mahsulot web yoki mobilda ishlashi', ru: 'Работает ли продукт в вебе или на мобильном' }, { uz: "Database'dagi jadvallar to'plami", ru: 'Набор таблиц в Database' }], correct: 2 },
  { q: { uz: 'Foydalanuvchi mahsulotni yo\'lda, telefonda ochadi. Bu javob qaysi tomonga tortadi?', ru: 'Пользователь открывает продукт в пути, на телефоне. Куда тянет этот ответ?' }, opts: [{ uz: 'Web tomoniga', ru: 'К вебу' }, { uz: 'Ikkalasiga teng', ru: 'Поровну' }, { uz: 'Hech qaysisiga', ru: 'Никуда' }, { uz: 'Mobil tomoniga', ru: 'К мобильному' }], correct: 3 },
  { q: { uz: 'Havola bilan tez ulashish muhim. Bu javob qaysi tomonga tortadi?', ru: 'Важно быстро делиться ссылкой. Куда тянет этот ответ?' }, opts: [{ uz: 'Web tomoniga', ru: 'К вебу' }, { uz: 'Mobil tomoniga', ru: 'К мобильному' }, { uz: 'Hech qaysisiga', ru: 'Никуда' }, { uz: 'Ikkalasiga teng', ru: 'Поровну' }], correct: 0 },
  { q: { uz: 'Mentor misolida platforma nega mobil?', ru: 'Почему в примере Ментора платформа мобильная?' }, opts: [{ uz: "Ilova saytdan chiroyliroq ko'rinadi", ru: 'Приложение выглядит красивее сайта' }, { uz: "O'yinchi maydonda, qo'lida telefon", ru: 'Игрок на поле, в руке телефон' }, { uz: "Faqat React Native tanish bo'lgan", ru: 'Знаком был только React Native' }, { uz: 'Telegram guruhiga havola tashlanadi', ru: 'Ссылку кидают в Telegram-группу' }], correct: 1 },
  { q: { uz: 'Stek nima?', ru: 'Что такое стек?' }, opts: [{ uz: 'Mahsulot ochiladigan platforma', ru: 'Платформа, где открывается продукт' }, { uz: "PRD dagi funksiyalar ro'yxati", ru: 'Список функций в PRD' }, { uz: 'Birga ishlaydigan texnologiyalar', ru: 'Технологии, работающие вместе' }, { uz: 'Ilova ekranlari va tugmalari', ru: 'Экраны и кнопки приложения' }], correct: 2 },
  { q: { uz: "Web-trekdan mobil trekka o'tsangiz, nima o'zgaradi?", ru: 'Что изменится, если перейти с веб-трека на мобильный?' }, opts: [{ uz: 'Backend va Database ikkalasi', ru: 'И Backend, и Database' }, { uz: 'Faqat Database jadvallari', ru: 'Только таблицы Database' }, { uz: 'Uchala qism birdaniga almashadi', ru: 'Все три части сразу' }, { uz: 'Foydalanuvchi ochadigan qism', ru: 'Часть, которую открывает пользователь' }], correct: 3 }
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

// ===== AMALIYOT BLOKI (172/173, GATE M M-q4; tayanch 4, 9.1) — ko'rinish qolipda (QBlok), holat va jonli signal shu ulagichda =====
// Har blok 4 qadam, hammasi o'quvchining o'z repo'sida (5-qadam yo'q). steps [{ h, t, bandlar?, prompt?, yordam?, err? }] · natija (kutilgan natija · namuna: Maydon Jamoa).
// Prompt: QPrompt ko'rinishi (q-prompt klasslari) + {…} joyi — tahrirlanadigan maydon, yonida kulrang «masalan: …» (qolipda bu maydon yo'q — qolip taklifi; shu faylda PcPrompt).
// Trek — pm-m9d8-platforma (mobil | web); kalit yo'q — ikkala trek qatori «masalan» da (M-q5). Qadam matni <p> ichida — faqat inline elementlar (span).
const pcMatn = (t, key) => {
  if (typeof t !== 'string' || !t.includes('`')) return t;
  return t.split('`').map((p, i) => (i % 2 ? <code className="qcode" key={key + '-' + i}>{p}</code> : p));
};
// satrlar: [{uz, ru}] — «{id}» joylari; joylar: { id: { nom, qiymat, namuna, qotgan } } · qotgan — trekdan yozilgan o'zgarmas qism (joy emas)
const PcPrompt = ({ satrlar, joylar, onJoy, yordam }) => {
  const [ok, setOk] = useState(false);
  const [ochiq, setOchiq] = useState(false);
  const matn = satrlar.map(l => tr(l));
  const toliqMatn = () => matn.map(l => l.replace(/\{(\w+)\}/g, (m, id) => { const j = joylar[id]; if (!j) return m; return (j.qotgan || j.qiymat || '').trim() || tr(j.nom); })).join('\n');
  const nusxa = async () => { try { await navigator.clipboard.writeText(toliqMatn()); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — o'quvchi matnni qo'lda belgilaydi */ } };
  return (
    <span className="q-prompt pc-prompt">
      <span className="q-prompt-h"><span className="q-prompt-kim">{ochiq ? tr({ uz: 'Mentor misolidagi to\'liq talab', ru: 'Полное требование из примера Ментора' }) : tr({ uz: 'Siz → Antigravity', ru: 'Вы → Antigravity' })}</span>
        <span className="pc-prompt-tug">{yordam && <button type="button" className={cxx('q-prompt-nusxa', ochiq && 'pc-ochiq')} aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>{tr({ uz: 'Yordam', ru: 'Помощь' })}</button>}
          {!ochiq && <button type="button" className="q-prompt-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button>}</span></span>
      {ochiq && yordam.map((l, i) => <span key={'y' + i} className="pc-ps pc-yordam-s">{pcMatn(tr(l), 'y' + i)}</span>)}
      {!ochiq && matn.map((l, li) => (
        <span key={li} className="pc-ps">{l.split(/(\{\w+\})/g).map((p, i) => {
          const m = /^\{(\w+)\}$/.exec(p); const j = m && joylar[m[1]];
          if (!j) return <React.Fragment key={i}>{pcMatn(p, li + '-' + i)}</React.Fragment>;
          if (j.qotgan) return <b key={i} className="pc-qotgan">{j.qotgan}</b>;
          return <span key={i} className="pc-joy-q">
            <input className={cxx('pc-joy-inp', !String(j.qiymat || '').trim() && 'bosh')} value={j.qiymat || ''} placeholder={tr(j.nom)} aria-label={tr(j.nom)}
              size={Math.max(10, Math.min(44, String(j.qiymat || tr(j.nom)).length + 1))} onChange={(e) => onJoy(m[1], e.target.value)} />
            {j.namuna && <span className="pc-joy-n">{tr(j.namuna)}</span>}
          </span>;
        })}</span>
      ))}
    </span>
  );
};
const BLOK_TUGADI = { uz: "Blok tugadi — «Davom etish»ni bosing.", ru: 'Блок завершён — нажмите «Продолжить».' }; // S3 (F-1006-287): 14-dars naqshi
function ScreenBlok({ screen, storedAnswer, onAnswer, onNext, onPrev, live, eyebrow, title, mentor, steps, natija, doneText, children }) {
  const _gate = useContext(LiveGateCtx) || {};
  const _live = live || _gate.live;
  const isMentorLive = !!(_live && _live.mode === 'mentor');
  const avval = !!(storedAnswer && storedAnswer.solved);
  const [stepN, setStepN] = useState(() => (avval ? steps.length : 0));
  const done = stepN >= steps.length;
  const bajardim = () => {
    if (isMentorLive || done) return;
    const n = stepN + 1; setStepN(n);
    if (n >= steps.length && !avval) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: ou(eyebrow), solved: true, correct: true, picked: true });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const qaytar = (i) => { if (done || isMentorLive) return; setStepN(i); };
  // Yangi ochilgan qadam (uzun prompt) «Bajardim»i bilan birga ko'rinsin — kompyuterda ham
  const birinchi = useRef(true);
  useEffect(() => {
    if (birinchi.current) { birinchi.current = false; return undefined; }
    const t = setTimeout(() => { const el = document.querySelector('.q-blok-q.joriy') || document.querySelector('.q-blok-tugadi'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
    return () => clearTimeout(t);
  }, [stepN]);
  // SABOQ 8 / S3 (F-1006-287, 14-dars naqshi): Mentor har holatda keyingi harakatni aytadi — boshida MD gapi, qadamlar orasida keyingi qadam, blok tugagach «Davom etish»
  const mGap = done ? BLOK_TUGADI : stepN === 0 ? mentor
    : { uz: `Keyingi qadam — «${stepN + 1} · ${tr(steps[stepN].h)}»: bajarib, «Bajardim»ni bosing.`, ru: `Следующий шаг — «${stepN + 1} · ${tr(steps[stepN].h)}»: выполните и нажмите «Bajardim».` };
  return (
    <Stage eyebrow={tr(eyebrow)} screen={screen} scrollSignal={stepN} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: 'Avval bajaring', ru: 'Сначала выполните' }} onClick={onNext} /></>}>
      <QBlok til={__lang} sarlavha={tr(title)} mentor={<Mentor>{tr(mGap)}</Mentor>} zoom={Zoomable}
        qadamlar={steps.map(c => ({
          h: tr(c.h),
          t: <>{tx(c.t)}{c.bandlar && c.bandlar.map((b, i) => <span key={i} className="pc-band">{tx(b)}</span>)}{c.prompt}</>,
          xato: c.err && tx(c.err)
        }))}
        joriy={stepN} onBajardim={bajardim} onQaytar={qaytar} mentorRejim={isMentorLive}
        tugadi={done} tugadiMatn={tx(doneText)} natija={natija} natijaYorliq={tr(NATIJA_YORLIQ)}
        pastki={<MentorPracticeStats live={_live} screen={screen} />}>
        {children}
      </QBlok>
    </Stage>
  );
}
const NATIJA_YORLIQ = { uz: 'kutilgan natija · namuna: Maydon Jamoa', ru: 'ожидаемый результат · образец: Maydon Jamoa' };
const QADAM = { ochish: { uz: 'Ochish', ru: 'Открыть' }, prompt: { uz: 'Prompt', ru: 'Промпт' }, korish: { uz: "Ko'rish", ru: 'Посмотреть' }, tekshir: { uz: 'Tekshirish', ru: 'Проверка' }, github: { uz: 'Tekshirish va GitHub', ru: 'Проверка и GitHub' } };
// «Ortda qoldingizmi» — darsda bir marta, birinchi blokda (SABOQ 39)
const ORTDA = { uz: "Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-08-done` — `README.md` dagi «Arxitektura» bo'limi. O'z README'ngizni shunga qarab to'ldirasiz.", ru: 'Отстали — откройте пример Ментора в отдельной папке: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-08-done` — раздел «Arxitektura» в `README.md`. Свой README заполните по нему.' };
// Kutilgan natija — README ko'rinishi (Markdown sahifasi kabi chizilgan), Mentor misoli
const ReadmeMock = ({ a2 }) => (
  <div className="pc-md">
    <span className="pc-md-tab"><code>README.md</code></span>
    <span className="pc-md-h">{tr({ uz: 'Arxitektura', ru: 'Архитектура' })}</span>
    <code className={cxx('pc-md-kod', a2 && 'xira')}>ilova (Expo) → Backend (NestJS) → Database (Neon)</code>
    {!a2 && <>
      <span className="pc-md-j">{tx({ uz: '`oyinchilar` — `id` · `ism` · `telefon` · `parol_hash`', ru: '`oyinchilar` — `id` · `ism` · `telefon` · `parol_hash`' })}</span>
      <span className="pc-md-j">{tx({ uz: '`oyinlar` — `id` · `kun` · `soat` · `maydon` · `kerak` · `tashkilotchi_id` → `oyinchilar`', ru: '`oyinlar` — `id` · `kun` · `soat` · `maydon` · `kerak` · `tashkilotchi_id` → `oyinchilar`' })}</span>
      <span className="pc-md-j">{tx({ uz: '`ishtirokchilar` — `oyin_id` → `oyinlar` · `oyinchi_id` → `oyinchilar` · `holat` · `yaratilgan`', ru: '`ishtirokchilar` — `oyin_id` → `oyinlar` · `oyinchi_id` → `oyinchilar` · `holat` · `yaratilgan`' })}</span>
    </>}
    {a2 && <>
      <span className="pc-md-b"><b>{tr({ uz: 'Real vaqt nuqtalari', ru: 'Точки реального времени' })}</b> — {tr({ uz: "«8 / 10» · qo'shilganlar ro'yxati · «Kelaman» belgilari — ekran ochilganda va pastga tortib yangilaganda so'raydi", ru: '«8 / 10» · список присоединившихся · отметки «Kelaman» — запрашивает при открытии экрана и при потягивании вниз' })}</span>
      <span className="pc-md-b"><b>{tr({ uz: 'Platforma', ru: 'Платформа' })}</b> — {tr({ uz: "mobil: o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak", ru: 'мобильное: игрок на поле, в руке телефон; напоминание должно приходить на телефон' })}</span>
      <span className="pc-md-b"><b>{tr({ uz: 'Stek', ru: 'Стек' })}</b> — Expo (React Native) · NestJS + TypeORM, Render · Neon (PostgreSQL)</span>
      <span className="pc-gh"><span className="pc-gh-r"><i className="pc-gh-ic" aria-hidden="true" /><b>maydon-jamoa</b></span><span className="pc-gh-f"><code>README.md</code> — «{tr({ uz: 'Arxitektura', ru: 'Архитектура' })}»</span></span>
    </>}
  </div>
);
const A1_PROMPT = [
  { uz: 'Qayerda: `README.md` — yangi «Arxitektura» bo\'limi.', ru: 'Где: `README.md` — новый раздел «Arxitektura».' },
  { uz: 'Nima qilsin: chizmani matn bilan chiz — uch qism va strelkalar: {ilova} → Backend → Database.', ru: 'Что сделать: нарисуй схему текстом — три части и стрелки: {ilova} → Backend → Database.' },
  { uz: "Asosiy funksiyalar: {funk}. Saqlanadigan ma'lumotlar: {malumot}. Shular uchun Database jadvallarini yoz: har jadval nomi, ustunlari va har ustun nima saqlashi. Bog'lovchi ustunlar qaysi jadvalga bog'langanini yoz.", ru: 'Основные функции: {funk}. Хранимые данные: {malumot}. Для них напиши таблицы Database: имя каждой таблицы, её столбцы и что хранит каждый столбец. Напиши, с какой таблицей связан каждый связующий столбец.' },
  { uz: "Nima buzilmasin: kod va papkalarga tegma — faqat `README.md` dagi yangi bo'lim. O'zgargan fayllarni ayt.", ru: 'Что не сломать: не трогай код и папки — только новый раздел в `README.md`. Назови изменённые файлы.' }
];
const A1_YORDAM = [
  { uz: 'Qayerda: `README.md` — yangi «Arxitektura» bo\'limi.', ru: 'Где: `README.md` — новый раздел «Arxitektura».' },
  { uz: 'Nima qilsin: chizmani matn bilan chiz — uch qism va strelkalar: ilova (Expo) → Backend → Database.', ru: 'Что сделать: нарисуй схему текстом — три части и стрелки: ilova (Expo) → Backend → Database.' },
  { uz: "Asosiy funksiyalar: o'yin e'loni va qo'shilish; o'yin kuni tasdiq; chiqish va navbat. Saqlanadigan ma'lumotlar: o'yinchilar; o'yinlar; kim qaysi o'yinga qo'shilgani. Shular uchun Database jadvallarini yoz: har jadval nomi, ustunlari va har ustun nima saqlashi. Bog'lovchi ustunlar qaysi jadvalga bog'langanini yoz.", ru: "Основные функции: o'yin e'loni va qo'shilish; o'yin kuni tasdiq; chiqish va navbat. Хранимые данные: o'yinchilar; o'yinlar; kim qaysi o'yinga qo'shilgani. Для них напиши таблицы Database: имя каждой таблицы, её столбцы и что хранит каждый столбец. Напиши, с какой таблицей связан каждый связующий столбец." },
  { uz: "Nima buzilmasin: kod va papkalarga tegma — faqat `README.md` dagi yangi bo'lim. O'zgargan fayllarni ayt.", ru: 'Что не сломать: не трогай код и папки — только новый раздел в `README.md`. Назови изменённые файлы.' }
];
const ILOVA_TREK = { mobil: 'ilova (Expo)', web: 'sayt (React)' };
const prdFunk = () => { const p = lsOqi('pm-m9d5-prd'); return p && Array.isArray(p.funksiyalar) ? p.funksiyalar.map(x => String(x || '').trim()).filter(Boolean).join('; ') : ''; };
const ScreenA1 = (props) => {
  const trek = useMemo(trekOqi, []);
  const [q, setQ] = useState(() => ({ ilova: trek ? ILOVA_TREK[trek] : '', funk: prdFunk(), malumot: '' }));
  const oldin = useMemo(() => !!(trek || prdFunk()), [trek]); // kalitlardan biror qavs to'ldirilganmi (F-1006-281)
  const joylar = {
    ilova: { nom: { uz: '{ilova yoki sayt}', ru: '{приложение или сайт}' }, qiymat: q.ilova, namuna: { uz: 'masalan: ilova (Expo)', ru: 'например: ilova (Expo)' } },
    funk: { nom: { uz: '{uchta asosiy funksiya}', ru: '{три основные функции}' }, qiymat: q.funk, namuna: { uz: "masalan: o'yin e'loni va qo'shilish; o'yin kuni tasdiq; chiqish va navbat", ru: "например: o'yin e'loni va qo'shilish; o'yin kuni tasdiq; chiqish va navbat" } },
    malumot: { nom: { uz: "{saqlanadigan ma'lumotlar}", ru: '{хранимые данные}' }, qiymat: q.malumot, namuna: { uz: "masalan: o'yinchilar; o'yinlar; kim qaysi o'yinga qo'shilgani", ru: "например: o'yinchilar; o'yinlar; kim qaysi o'yinga qo'shilgani" } }
  };
  const onJoy = (id, v) => setQ(x => ({ ...x, [id]: v }));
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 1 · o'z repo'ngiz", ru: 'Практика 1 · ваш репозиторий' }}
      title={{ uz: <>README'ga chizma va <span className="italic" style={{ color: T.accent }}>jadvallarni yozdiring</span>.</>, ru: <>Попросите записать в README <span className="italic" style={{ color: T.accent }}>схему и таблицы</span>.</> }}
      mentor={{ uz: <>Hamma qadamni o'z mahsulotingiz bilan qilasiz, o'ngda — namuna; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Все шаги вы делаете со своим продуктом, справа — образец; начните с <b style={{ color: T.ink }}>«1 · Ochish»</b>.</> }}
      steps={[
        { h: QADAM.ochish, t: { uz: "7-darsdagi repo papkangizni Antigravity'da oching: `README.md` da talab va wireframe surati turibdi.", ru: 'Откройте в Antigravity папку репозитория из 7-го урока: в `README.md` лежат требование и снимок wireframe.' },
          bandlar: [{ uz: "Papka bu kompyuterda yo'q bo'lsa — terminalda `git clone https://github.com/{login}/{repo}.git` · `cd {repo}`.", ru: 'Если папки нет на этом компьютере — в терминале `git clone https://github.com/{login}/{repo}.git` · `cd {repo}`.' }] },
        { h: QADAM.prompt, t: oldin ? { uz: "qavslarning bir qismi mustaqil ishdagi tanlovingiz va PRD'ingizdan to'ldirilgan; tekshiring, bo'sh qavsni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'часть скобок заполнена из вашего выбора в самостоятельной работе и PRD; проверьте, впишите пустые сами, нажмите «Nusxalash» и отправьте в Antigravity:' }
          : { uz: "qavslarni o'z mahsulotingiz bilan to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки по своему продукту, нажмите «Nusxalash» и отправьте в Antigravity:' },
          prompt: <PcPrompt satrlar={A1_PROMPT} joylar={joylar} onJoy={onJoy} yordam={A1_YORDAM} /> },
        { h: QADAM.korish, t: { uz: "Antigravity'da `README.md` ni oching: «Arxitektura» bo'limida chizma va jadvallar bor. Agent boshqa faylni ham o'zgartirgan bo'lsa: «Faqat README.md ni o'zgartir, qolganini qaytar.»", ru: 'Откройте `README.md` в Antigravity: в разделе «Arxitektura» есть схема и таблицы. Если агент изменил и другой файл: «Faqat README.md ni o\'zgartir, qolganini qaytar.»' } },
        { h: QADAM.tekshir, t: { uz: "har funksiyangizni oling va README'dan toping: u qaysi jadvalga nima yozadi? Talabning har qatori:", ru: 'возьмите каждую свою функцию и найдите в README: что и в какую таблицу она пишет? Каждая строка требования:' },
          bandlar: [
            { uz: 'qayerda — o\'zgargan fayl faqat `README.md`', ru: 'где — изменён только `README.md`' },
            { uz: "nima qilsin — chizmada uch qism, har jadvalda ustunlar va izohi, bog'lovchi ustunlar bog'langan jadvali bilan, siz yozgan har ma'lumot jadvalda bor", ru: 'что сделать — на схеме три части, в каждой таблице столбцы с пояснением, связующие столбцы со своей таблицей, каждое ваше данное есть в таблице' },
            { uz: "nima buzilmasin — kod o'zgarmagan", ru: 'что не сломать — код не изменён' },
            { uz: "Funksiya joy topmasa, agentga: «{funksiya} uchun jadvalda joy yo'q: {nima saqlansin}. Faqat README.md ni o'zgartir.»", ru: 'Если функции не нашлось места, агенту: «{funksiya} uchun jadvalda joy yo\'q: {nima saqlansin}. Faqat README.md ni o\'zgartir.»' }
          ] }
      ]}
      natija={<ReadmeMock />}
      doneText={{ uz: "README'da chizma va jadvallar: har funksiya o'z joyini oldi.", ru: 'В README схема и таблицы: каждая функция получила своё место.' }}>
      <p className="pc-ortda">{tx(ORTDA)}</p>
    </ScreenBlok>
  );
};
const A2_PROMPT = [
  { uz: 'Qayerda: `README.md` — «Arxitektura» bo\'limining oxiri.', ru: 'Где: `README.md` — конец раздела «Arxitektura».' },
  { uz: "Nima qilsin: «Real vaqt nuqtalari» kichik bo'limi: {rv}; har biriga yoz: ilova uni {qachon} so'raydi, ekran o'zi yangilanishi hozircha yo'q.", ru: 'Что сделать: подраздел «Real vaqt nuqtalari»: {rv}; для каждой напиши: приложение запрашивает её {qachon}, самообновления экрана пока нет.' },
  { uz: "«Platforma» kichik bo'limi: {platforma}. «Stek» kichik bo'limi: {tex}; Backend — NestJS va TypeORM, Render; Database — Neon (PostgreSQL).", ru: 'Подраздел «Platforma»: {platforma}. Подраздел «Stek»: {tex}; Backend — NestJS и TypeORM, Render; Database — Neon (PostgreSQL).' },
  { uz: "Nima buzilmasin: faqat `README.md`; boshqa bo'lim va fayllarga tegma. O'zgargan fayllarni ayt.", ru: 'Что не сломать: только `README.md`; не трогай другие разделы и файлы. Назови изменённые файлы.' }
];
const A2_YORDAM = [
  { uz: 'Qayerda: `README.md` — «Arxitektura» bo\'limining oxiri.', ru: 'Где: `README.md` — конец раздела «Arxitektura».' },
  { uz: "Nima qilsin: «Real vaqt nuqtalari» kichik bo'limi: «8 / 10», qo'shilganlar ro'yxati, o'yin kunidagi «Kelaman» belgilari; har biriga yoz: ilova uni ekran ochilganda va pastga tortib yangilaganda so'raydi, ekran o'zi yangilanishi hozircha yo'q.", ru: "Что сделать: подраздел «Real vaqt nuqtalari»: «8 / 10», список присоединившихся, отметки «Kelaman» в день игры; для каждой напиши: приложение запрашивает её при открытии экрана и при потягивании вниз, самообновления экрана пока нет." },
  { uz: "«Platforma» kichik bo'limi: mobil — o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak. «Stek» kichik bo'limi: ilova — Expo (React Native), telefonda Expo Go orqali; Backend — NestJS va TypeORM, Render; Database — Neon (PostgreSQL).", ru: "Подраздел «Platforma»: mobil — o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak. Подраздел «Stek»: ilova — Expo (React Native), на телефоне через Expo Go; Backend — NestJS и TypeORM, Render; Database — Neon (PostgreSQL)." },
  { uz: "Nima buzilmasin: faqat `README.md`; boshqa bo'lim va fayllarga tegma. O'zgargan fayllarni ayt.", ru: 'Что не сломать: только `README.md`; не трогай другие разделы и файлы. Назови изменённые файлы.' }
];
const A2_TREK = {
  mobil: { qachon: { uz: 'ekran ochilganda va pastga tortib yangilaganda', ru: 'при открытии экрана и при потягивании вниз' }, tex: { uz: 'ilova — Expo (React Native), telefonda Expo Go orqali', ru: 'ilova — Expo (React Native), на телефоне через Expo Go' } },
  web: { qachon: { uz: 'sahifa ochilganda va «Yangilash» bosilganda', ru: 'при открытии страницы и при нажатии «Yangilash»' }, tex: { uz: 'sayt — React (Vite), Netlify', ru: 'sayt — React (Vite), Netlify' } }
};
const ScreenA2 = (props) => {
  const p = useMemo(() => lsOqi(PLATFORMA_KEY), []);
  const trek = p && (p.trek === 'mobil' || p.trek === 'web') ? p.trek : null;
  const [q, setQ] = useState(() => ({ rv: '', platforma: trek && p.asos ? trek + ' — ' + String(p.asos).trim() : '', qachon: '', tex: '' }));
  const [q0] = useState(q); // boshlang'ich holat: platforma qatori kalitdan to'ldirilganmi (F-1006-281)
  const ikkala = (k) => ({ uz: 'masalan: mobil — ' + ou(A2_TREK.mobil[k]) + ' · web — ' + ou(A2_TREK.web[k]), ru: 'например: mobil — ' + A2_TREK.mobil[k].ru + ' · web — ' + A2_TREK.web[k].ru });
  const joylar = {
    rv: { nom: { uz: '{real vaqt nuqtalari}', ru: '{точки реального времени}' }, qiymat: q.rv, namuna: { uz: "masalan: «8 / 10», qo'shilganlar ro'yxati, «Kelaman» belgilari", ru: "например: «8 / 10», список присоединившихся, отметки «Kelaman»" } },
    platforma: { nom: { uz: '{platforma va asos}', ru: '{платформа и обоснование}' }, qiymat: q.platforma, namuna: { uz: "masalan: mobil — o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak", ru: 'например: mobil — игрок на поле, в руке телефон; напоминание должно приходить на телефон' } },
    qachon: trek ? { qotgan: tr(A2_TREK[trek].qachon) } : { nom: { uz: "{qachon so'raydi}", ru: '{когда запрашивает}' }, qiymat: q.qachon, namuna: ikkala('qachon') },
    tex: trek ? { qotgan: tr(A2_TREK[trek].tex) } : { nom: { uz: '{ilova yoki sayt texnologiyasi}', ru: '{технология приложения или сайта}' }, qiymat: q.tex, namuna: ikkala('tex') }
  };
  const onJoy = (id, v) => setQ(x => ({ ...x, [id]: v }));
  return (
    <ScreenBlok {...props} eyebrow={{ uz: "Amaliyot 2 · o'z repo'ngiz", ru: 'Практика 2 · ваш репозиторий' }}
      title={{ uz: <>Real vaqt nuqtalari va platformani <span className="italic" style={{ color: T.accent }}>README'ga qo'shing</span>.</>, ru: <>Добавьте в README <span className="italic" style={{ color: T.accent }}>точки реального времени и платформу</span>.</> }}
      mentor={q0.platforma ? { uz: <>Platforma tanlovingiz allaqachon talabda — real vaqt nuqtalarini o'zingiz yozasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Ваш выбор платформы уже в требовании — точки реального времени напишете сами; начните с <b style={{ color: T.ink }}>«1 · Ochish»</b>.</> }
        : { uz: <>Platforma va real vaqt nuqtalarini o'zingiz yozasiz; <b style={{ color: T.ink }}>«1 · Ochish»</b>dan boshlang.</>, ru: <>Платформу и точки реального времени напишете сами; начните с <b style={{ color: T.ink }}>«1 · Ochish»</b>.</> }}
      steps={[
        { h: QADAM.ochish, t: { uz: "`README.md` ochiq, «Arxitektura» bo'limi ko'rinib turibdi. Prototipingizning eng ko'p ishlatiladigan ekranini eslang: unda boshqa odam nimani o'zgartiradi?", ru: '`README.md` открыт, раздел «Arxitektura» виден. Вспомните самый используемый экран прототипа: что на нём меняет другой человек?' } },
        { h: QADAM.prompt, t: { uz: "qavsni to'ldiring, platforma qatorini tekshiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:", ru: 'заполните скобки, проверьте строку платформы, нажмите «Nusxalash» и отправьте в Antigravity:' },
          prompt: <PcPrompt satrlar={A2_PROMPT} joylar={joylar} onJoy={onJoy} yordam={A2_YORDAM} /> },
        { h: QADAM.korish, t: { uz: "`README.md` da «Arxitektura» bo'limi to'liq: chizma · jadvallar · real vaqt nuqtalari · platforma · stek.", ru: 'в `README.md` раздел «Arxitektura» полный: схема · таблицы · точки реального времени · платформа · стек.' } },
        { h: QADAM.github, t: { uz: "talabning har qatori: har real vaqt nuqtasi yonida qachon so'rashi yozilgan · platforma va asos — siz saqlagandek · stek trekingizga mos · boshqa fayl o'zgarmagan.", ru: 'каждая строка требования: у каждой точки реального времени написано, когда она запрашивается · платформа и обоснование — как вы сохранили · стек подходит вашему треку · другие файлы не изменены.' },
          bandlar: [
            { uz: "Hammasi mos bo'lsa — repo papkasida `git status`: o'zgargan fayl faqat `README.md` bo'lsin; keyin `git add README.md`, `git commit -m \"arxitektura va platforma\"`, `git push`.", ru: 'Если всё совпадает — в папке репозитория `git status`: изменён только `README.md`; затем `git add README.md`, `git commit -m "arxitektura va platforma"`, `git push`.' },
            { uz: "GitHub'da repo sahifasini yangilang — README'da «Arxitektura» bo'limi ko'rinadi. `git push` xato bersa: «Shu xato chiqdi: {xato}. Tuzat.»", ru: 'Обновите страницу репозитория на GitHub — в README виден раздел «Arxitektura». Если `git push` выдаст ошибку: «Shu xato chiqdi: {xato}. Tuzat.»' }
          ] }
      ]}
      natija={<ReadmeMock a2 />}
      doneText={{ uz: "README'da arxitektura to'liq: real vaqt nuqtalari, platforma va stek GitHub'da.", ru: 'В README архитектура полная: точки реального времени, платформа и стек — на GitHub.' }} />
  );
};

// 🃏 KARTOCHKALAR (12) — alohida ekran, Mentorsiz (SABOQ 12, 16); mexanika va ko'rinish — qolipda (QKartochka, DE-204)
const KARTALAR = [
  { front: { uz: 'Bu misolda qaysi uch qism bor?', ru: 'Какие три части в этом примере?' }, back: { uz: 'Ilova, Backend va Database', ru: 'Приложение, Backend и Database' }, note: { uz: "Ilova ko'rsatadi, Backend tekshiradi, Database saqlaydi", ru: 'Приложение показывает, Backend проверяет, Database хранит' } },
  { front: { uz: "Chizma (arxitektura) nimani ko'rsatadi?", ru: 'Что показывает схема (архитектура)?' }, back: { uz: "Qismlar va ular orasidagi so'rovlar", ru: 'Части и запросы между ними' }, note: { uz: 'Jadvallar — Database ostida', ru: 'Таблицы — под Database' } },
  { front: { uz: "Maydon Jamoa'da qaysi uch jadval bor?", ru: 'Какие три таблицы в Maydon Jamoa?' }, back: { uz: 'oyinchilar, oyinlar, ishtirokchilar', ru: 'oyinchilar, oyinlar, ishtirokchilar' }, note: { uz: "Kim · qaysi o'yin · kim qaysi o'yinda", ru: 'Кто · какая игра · кто в какой игре' } },
  { front: { uz: "«Qo'shilaman» bosilsa, qaysi jadvalga qator tushadi?", ru: 'Если нажать «Qo\'shilaman», в какую таблицу попадёт строка?' }, back: { uz: 'ishtirokchilar', ru: 'ishtirokchilar' }, note: { uz: '`holat` — `qoshildi`', ru: '`holat` — `qoshildi`' } },
  { front: { uz: "Bog'lovchi ustun nima?", ru: 'Что такое связующий столбец?' }, back: { uz: "Boshqa jadvaldagi qatorni ko'rsatadigan ustun", ru: 'Столбец, указывающий на строку в другой таблице' }, note: { uz: "Masalan, `oyin_id` — `oyinlar` dagi o'yin", ru: 'Например, `oyin_id` — игра в `oyinlar`' } },
  { front: { uz: 'Real vaqt nuqtasi nima?', ru: 'Что такое точка реального времени?' }, back: { uz: "Ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy", ru: 'Место, данные которого могут измениться из-за другого человека, пока экран открыт' }, note: { uz: "«8 / 10», qo'shilganlar, «Kelaman» belgilari", ru: '«8 / 10», присоединившиеся, отметки «Kelaman»' } },
  { front: { uz: "Bu modulda ilova qachon so'raydi?", ru: 'Когда в этом модуле запрашивает приложение?' }, back: { uz: 'Ekran ochilganda va pastga tortib yangilaganda', ru: 'При открытии экрана и при потягивании вниз' }, note: { uz: "O'zi yangilanishi — 12-Modulda (WebSocket)", ru: 'Самообновление — в 12-м модуле (WebSocket)' } },
  { front: { uz: 'Kod oynasida «Yangilash» ga `korsat` qanday ulanadi?', ru: 'Как в окне кода подключить `korsat` к «Yangilash»?' }, back: { uz: "yangila.addEventListener('click', korsat)", ru: "yangila.addEventListener('click', korsat)" }, note: { uz: 'Telefonda — ro\'yxatni pastga tortish', ru: 'На телефоне — потянуть список вниз' } },
  { front: { uz: "Platforma tanlovidagi to'rt savol qaysilar?", ru: 'Какие четыре вопроса при выборе платформы?' }, back: { uz: TORT_SAVOL.map(q => q.qisqa.uz).join(' · '), ru: TORT_SAVOL.map(q => q.qisqa.ru).join(' · ') }, note: { uz: 'Natija: web yoki mobil + bir gapli asos', ru: 'Итог: веб или мобильное + обоснование одним предложением' } },
  { front: { uz: 'Mentor misolida platforma qaysi va nega?', ru: 'Какая платформа в примере Ментора и почему?' }, back: { uz: 'Mobil', ru: 'Мобильное' }, note: { uz: "O'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak", ru: 'Игрок на поле, в руке телефон; напоминание должно приходить на телефон' } },
  { front: { uz: 'Stek nima?', ru: 'Что такое стек?' }, back: { uz: "Birga ishlaydigan texnologiyalar to'plami", ru: 'Набор технологий, работающих вместе' }, note: { uz: 'Mobil trekda: Expo · NestJS · Neon', ru: 'В мобильном треке: Expo · NestJS · Neon' } },
  { front: { uz: "Bu modulda trek almashsa, qaysi qism o'zgaradi?", ru: 'Какая часть меняется в этом модуле при смене трека?' }, back: { uz: 'Faqat ilova yoki sayt', ru: 'Только приложение или сайт' }, note: { uz: 'Backend va Database ikkala trekda bir xil', ru: 'Backend и Database в обоих треках одинаковые' } }
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  const [bosildi, setBosildi] = useState(false);
  const bos = (e) => { if (e.target.closest && e.target.closest('.fc-card')) setBosildi(true); };
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Yakunlash →', ru: 'Завершить →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        {/* SABOQ 16: Mentor yo'q (KORPUS §61); birinchi bosishgacha karta yuzi halqada, ostida ko'rsatma */}
        <div className={cxx('pc-flash', !bosildi && 'yangi')} onClickCapture={bos} onKeyDownCapture={e => { if (e.key === 'Enter' || e.key === ' ') bos(e); }}>
          <QKartochka til={__lang} cards={KARTALAR.map(c => ({ front: tx(c.front), back: tr(c.back), note: c.note && tx(c.note) }))} />
          {!bosildi && <p className="pc-fc-ipucha"><i aria-hidden="true" />{tr({ uz: 'Kartani bosing — javob ochiladi', ru: 'Нажмите на карточку — откроется ответ' })}</p>}
        </div>
      </div>
    </Stage>
  );
};

// ===== YAKUN — QYakun (DE-204). Sarlavha va yorliq holatga qarab (P-046; 08-FILTR 31). CODE STRIKE va arena — jonli o'yin qatlami =====
const YAKUN = {
  a2: { chip: { uz: 'Arxitektura tayyor', ru: 'Архитектура готова' }, sar: { uz: 'Chizma tayyor, platforma asos bilan tanlandi.', ru: 'Схема готова, платформа выбрана с обоснованием.' } },
  a1: { chip: { uz: 'Chizma tayyor', ru: 'Схема готова' }, sar: { uz: 'Chizma tayyor — README ning qolgani uyda.', ru: 'Схема готова — остальное в README дома.' } },
  yoq: { chip: null, sar: { uz: 'Platforma tanlandi — README uyda yoziladi.', ru: 'Платформа выбрана — README напишете дома.' } }
};
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
  const bajarildi = (id) => { const i = SCREEN_META.findIndex(m => m.id === id); return !!(answers[i] && answers[i].solved); };
  const holat = bajarildi('a2') ? 'a2' : bajarildi('a1') ? 'a1' : 'yoq';
  const RECAP = [
    { uz: "Bu misolda uch qism: ilova ko'rsatadi, Backend tekshiradi, Database saqlaydi.", ru: 'В этом примере три части: приложение показывает, Backend проверяет, Database хранит.' },
    { uz: "Funksiyalar qaysi ma'lumot saqlanishini ko'rsatadi; har qo'shilish — `ishtirokchilar` dagi bitta qator.", ru: 'Функции показывают, какие данные хранить; каждое присоединение — одна строка в `ishtirokchilar`.' },
    { uz: "Real vaqt nuqtasi — ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy.", ru: 'Точка реального времени — место, данные которого могут измениться из-за другого человека, пока экран открыт.' },
    { uz: "Bu modulda ekran ochilganda va pastga tortib yangilaganda so'raydi.", ru: 'В этом модуле запрашивает при открытии экрана и при потягивании вниз.' },
    { uz: 'Platforma signallar va asos bilan tanlanadi; bu modulda Backend va Database ikkala trekda bir xil.', ru: 'Платформа выбирается по сигналам и обоснованию; в этом модуле Backend и Database в обоих треках одинаковые.' }
  ];
  const HOMEWORK = [
    { b: { uz: 'Tugatish', ru: 'Завершить' }, t: { uz: "— README'dagi «Arxitektura» bo'limi to'liq bo'lsin: chizma, jadvallar, real vaqt nuqtalari, platforma va stek; GitHub'ga yuborilgan bo'lsin.", ru: '— раздел «Arxitektura» в README должен быть полным: схема, таблицы, точки реального времени, платформа и стек; и отправлен на GitHub.' } },
    { b: { uz: 'Tekshirish', ru: 'Проверить' }, t: { uz: "— PRD'dagi uchala funksiyani oling: har biri qaysi jadvalga nima yozadi? Joy topilmasa — agent bilan README'ga ustun qo'shing.", ru: '— возьмите все три функции из PRD: что и в какую таблицу пишет каждая? Если места нет — добавьте столбец в README вместе с агентом.' } },
    { b: { uz: 'Asos', ru: 'Обоснование' }, t: { uz: "— mahsulotingiz foydalanuvchisidan bitta odamga birinchi savolni bering: u mahsulotni qayerda ochardi? Javobi asosingizga zid bo'lsa — to'rt savolni qayta ko'ring; trek yoki asos o'zgarsa, darsdagi platforma kartasida ham, README'da ham yangilang.", ru: '— задайте одному пользователю вашего продукта первый вопрос: где бы он открывал продукт? Если ответ противоречит обоснованию — пересмотрите четыре вопроса; если меняется трек или обоснование, обновите и карточку платформы в уроке, и README.' } }
  ];
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const y = YAKUN[holat];
  return (
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash', ru: 'Завершить' })}</button></>}>
      {/* Yorliq «✓ Arxitektura tayyor» — A2 bajarilganda; A1 — «✓ Chizma tayyor»; A1 yo'q — yorliq yo'q (MD 19) */}
      <div className={cxx('pc-yakun', !y.chip && 'belgisiz')}>
        <QYakun til={__lang}
          chip={y.chip ? tr(y.chip) : ''}
          togri={correct} jami={total}
          sarlavha={tr(y.sar)}
          cta={<>
            <p className="pc-asosiy fade-up">{tr({ uz: 'Chizma qismlar, jadvallar va real vaqt nuqtalarini ko\'rsatadi; bu modulda platforma faqat foydalanuvchi ochadigan qismni tanlaydi — Backend va Database ikkala trekda bir xil.', ru: 'Схема показывает части, таблицы и точки реального времени; в этом модуле платформа выбирает только часть, которую открывает пользователь, — Backend и Database в обоих треках одинаковые.' })}</p>
            <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
              <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: 'Дождитесь наставника' }) : undefined} />
            </div>
            {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
          </>}
          recap={RECAP.map(tx)}
          uyga={HOMEWORK.map(h => ({ b: tr(h.b), t: tr(h.t) }))}
          keyingi={tr({ uz: "Kim uchun — o'z mahsulotingiz · muddat — keyingi darsgacha", ru: 'Для кого — ваш продукт · срок — до следующего урока' })}
          hwTokens={HW_TOKENS.map(k => ({ ...k, t: tr(k.t) }))}
          nishonlar={isMentorL ? null : Object.entries(ACHIEVEMENTS).map(([id, a]) => ({ id, icon: a.icon, name: a.name, desc: tr(a.desc), got: !!(achievements && achievements.has(id)) }))}>
          <p className="pc-keyingi fade-up" style={{ animationDelay: '0.35s' }}>{tr({ uz: <>Keyingi dars — <b>«React Native va Expo: prototip telefonda»</b>: platforma tanlandi, endi prototipni shu platformada telefonda ochish navbati.</>, ru: <>Следующий урок — <b>«React Native и Expo: прототип на телефоне»</b>: платформа выбрана, теперь очередь открыть прототип на этой платформе на телефоне.</> })}</p>
        </QYakun>
      </div>
    </Stage>
  );
};


// ============================================================ LESSON ROOT — ({ lang, onFinished })
export default function PlatformChoiceLesson({ lang: langProp, onFinished, liveToken }) {
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

  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, ScreenA1, ScreenA2, ScreenPodium, ScreenFlashcards, SummaryScreen];
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
        /* === 11-Modul 8-dars — darsning o'z vizuali (prefiks pc-). Faqat qolip tokenlari (D3); brend rangi — faqat nomda: Maydon Jamoa (#2E9E4F, tayanch 9.62). Emoji yo'q (D4) === */
        .pc-mj { color: #2E9E4F; font-weight: 800; letter-spacing: 0.01em; }
        @keyframes pc-kot { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes pc-pop { 0% { transform: scale(1); } 40% { transform: scale(1.35); } 100% { transform: scale(1); } }
        @keyframes pc-uch { from { transform: translate(-50%,-50%); } to { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); } }
        @keyframes pc-yonish { 0% { background: ${T.okFon}; box-shadow: 0 0 0 3px ${fon(T.ok, 0.25)}; } 70% { background: ${T.okFon}; } 100% { box-shadow: 0 0 0 0 ${fon(T.ok, 0)}; } }
        @keyframes pc-yangi { 0% { opacity: 0; transform: translateX(-12px); background: ${T.okFon}; } 25% { opacity: 1; transform: none; background: ${T.okFon}; } 100% { background: ${T.bg}; } }
        @keyframes pc-oqar { 0% { opacity: 0; } 35%, 65% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes pc-aylan { to { transform: rotate(360deg); } }
        @keyframes pc-chiz { from { stroke-dashoffset: 420; } to { stroke-dashoffset: 0; } }
        @keyframes pc-tush { from { opacity: 0; transform: translateY(-12px) scale(0.6); } to { opacity: 1; transform: none; } }
        @keyframes pc-ekran { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
        @keyframes pc-kel { from { opacity: 0; transform: translateX(26px); } to { opacity: 1; transform: none; } }
        @keyframes pc-tolqin { 0% { opacity: 0; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.03); } 100% { opacity: 0; transform: scale(1.03); } }
        @keyframes pc-tolqin-i { 0%, 100% { box-shadow: 0 0 0 0 ${fon(T.accent, 0)}; } 50% { box-shadow: 0 0 0 4px ${fon(T.accent, 0.3)}; } }
        /* Halqa (SABOQ 32): navbatdagi element — statik halqa + yengil to'lqin (≤ 3%, ≤ 0.35, 2.4 s); guruhda bitta halqa — guruh atrofida */
        .pc-halqa { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .pc-halqa::after { content: ''; position: absolute; inset: -5px; border-radius: 14px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pc-tolqin 2.4s ease-in-out 0.4s 4; }
        .pc-guruh { position: relative; outline: 2px solid ${T.accent}; outline-offset: 5px; border-radius: 12px; }
        .pc-guruh::after { content: ''; position: absolute; inset: -9px; border-radius: 16px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pc-tolqin 2.4s ease-in-out 0.5s 4; }
        .pc-halqa-i { border-color: ${T.accent} !important; animation: pc-tolqin-i 2.4s ease-in-out 0.4s 4; }
        /* Ramka: telefon (ilova) 172×272 barqaror (SABOQ 22) · brauzer oynasi (sayt) · yorliq ramka ustida (SABOQ 23) */
        .pc-ramka { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; }
        .pc-tex { display: inline-flex; align-items: center; height: 22px; padding: 0 11px; border: 1.5px solid ${T.line}; border-radius: 999px; background: ${T.paper}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; white-space: nowrap; animation: pc-kot 0.35s ease-out both; }
        .pc-rol { font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 999px; white-space: nowrap; }
        .pc-rol.b1 { background: ${T.accentSoft}; color: ${T.accent}; } .pc-rol.b2 { background: ${fon(T.ink, 0.08)}; color: ${T.ink}; }
        .pc-joy-chip { font-size: 11.5px; font-weight: 700; color: ${T.ink2}; padding: 2px 10px; border-radius: 999px; background: ${T.paper}; border: 1px solid ${T.line}; white-space: nowrap; animation: pc-kot 0.35s ease-out both; }
        .pc-tel { position: relative; width: 172px; height: 272px; flex: none; display: flex; flex-direction: column; gap: 4px; border: 2px solid ${T.ink}; border-radius: 24px; padding: 8px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .pc-tel-bar { display: flex; align-items: center; justify-content: center; height: 16px; flex: none; font-size: 12.5px; }
        .pc-brauzer { position: relative; width: 236px; height: 272px; flex: none; display: flex; flex-direction: column; border: 1.5px solid ${T.ink}; border-radius: 12px; background: ${T.paper}; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.4); overflow: hidden; }
        .pc-br-bar { display: flex; align-items: center; gap: 6px; height: 28px; padding: 0 8px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; flex: none; }
        .pc-br-manzil { flex: 1; min-width: 0; padding: 2px 8px; border-radius: 6px; background: ${T.paper}; border: 1px solid ${T.line}; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pc-yangila { width: 22px; height: 22px; flex: none; border-radius: 50%; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-size: 13px; font-weight: 800; line-height: 1; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .pc-yangila:disabled { opacity: 0.4; cursor: default; }
        .pc-br-nom { display: block; padding: 6px 12px 0; font-size: 12.5px; }
        .pc-brauzer .pc-ekran { padding: 4px 12px 10px; }
        .pc-ekran { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 4px; animation: pc-ekran 0.35s ease-out both; }
        .pc-tortiladi { cursor: grab; touch-action: none; user-select: none; transition: transform 0.25s ease-out; }
        .pc-oqar { position: absolute; inset: 0; z-index: 3; background: ${T.paper}; animation: pc-oqar 0.56s ease-in-out both; pointer-events: none; }
        .pc-tort-b { align-self: center; flex: none; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; padding: 2px 10px; border-radius: 999px; animation: pc-kot 0.35s ease-out both; }
        .pc-spin { align-self: center; flex: none; width: 16px; height: 16px; border-radius: 50%; border: 2px solid ${T.line}; border-top-color: ${T.accent}; animation: pc-aylan 0.7s linear infinite; }
        /* Ilova ekranlari */
        .pc-ek-sar { font-size: 13px; font-weight: 800; color: ${T.ink}; }
        .pc-oyinlar { display: flex; flex-direction: column; gap: 4px; flex: 1; min-height: 0; }
        .pc-karta { display: flex; flex-direction: column; padding: 3px 8px 4px; border-radius: 8px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11px; line-height: 1.25; color: ${T.ink2}; animation: pc-kot 0.4s ease-out var(--d, 0s) both; }
        .pc-karta b { font-size: 11.5px; color: ${T.ink}; }
        .pc-karta.yangi { animation: pc-yangi 1.6s ease-out both; }
        .pc-k-son { font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .pc-oyin { display: flex; flex-direction: column; gap: 3px; flex: 1; min-height: 0; }
        .pc-oyin-orqa { font-size: 11px; font-weight: 700; color: ${T.ink2}; }
        .pc-joy { position: relative; display: flex; flex-direction: column; border-radius: 7px; padding: 1px 4px; margin: 0 -4px; transition: background 0.3s, box-shadow 0.3s; }
        .pc-joy.joriy { background: ${T.accentSoft}; box-shadow: 0 0 0 2px ${T.accent}; }
        .pc-oyin-sar { font-size: 14px; font-weight: 800; color: ${T.ink}; }
        .pc-oyin-maydon { font-size: 12px; color: ${T.ink2}; }
        .pc-yozilgan { align-self: flex-start; margin-top: 2px; font-size: 10px; font-weight: 700; color: ${T.ink2}; background: ${fon(T.ink, 0.07)}; padding: 1px 7px; border-radius: 999px; animation: pc-kot 0.35s ease-out both; }
        .pc-son-q { flex-direction: row; align-items: center; gap: 6px; margin-top: 4px; }
        .pc-son { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 800; color: ${T.ink}; transform-origin: left center; }
        .pc-son.pop { color: ${T.accent}; animation: pc-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .pc-son.kut { color: ${T.ink2}; }
        .pc-eski { font-size: 10px; font-weight: 700; color: ${T.ink2}; background: ${fon(T.ink, 0.08)}; padding: 1px 7px; border-radius: 999px; animation: pc-kot 0.35s ease-out both; }
        .pc-doiralar { display: grid; grid-template-columns: repeat(5, 14px); gap: 6px; margin-top: 4px; margin-bottom: 4px; padding: 3px 4px; }
        .pc-doiralar i { position: relative; width: 14px; height: 14px; border-radius: 50%; border: 1.5px dashed ${fon(T.ink, 0.3)}; }
        .pc-doiralar i.bor { border: 0; background: ${fon(T.ink, 0.38)}; }
        .pc-doiralar i.yangi { background: ${T.accent}; animation: pc-pop 0.5s cubic-bezier(.3,1.5,.5,1); }
        .pc-doiralar i.kel::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; color: ${T.paper}; }
        .pc-doiralar i.kel { background: ${T.ok}; }
        .pc-doiralar i.rv { box-shadow: 0 0 0 2px ${T.accentSoft}, 0 0 0 3.5px ${T.accent}; }
        .pc-tel-btn { margin-top: auto; flex: none; display: flex; align-items: center; justify-content: center; width: 100%; height: 30px; border: 0; border-radius: 10px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 800; cursor: pointer; transition: transform 0.15s, background 0.3s, color 0.3s, box-shadow 0.2s; }
        .pc-tel-btn:disabled { cursor: default; }
        .pc-tel-btn.bos { transform: scale(0.92); box-shadow: 0 0 0 4px ${fon(T.accent, 0.25)}; }
        .pc-tel-btn.off { background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .pc-tel-btn.tab { height: 26px; background: ${T.paper}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .pc-tel-btn.tab:disabled { opacity: 0.55; }
        .pc-tel-btn.joriy { box-shadow: 0 0 0 2px ${T.paper}, 0 0 0 4px ${T.accent}; }
        .pc-forma { display: flex; flex-direction: column; gap: 4px; flex: 1; min-height: 0; }
        .pc-maydon { display: flex; flex-direction: column; padding: 2px 8px 3px; border-radius: 7px; background: ${T.bg}; border: 1px solid ${T.line}; font-size: 11.5px; font-weight: 700; color: ${T.ink}; line-height: 1.25; transition: box-shadow 0.3s, background 0.3s; }
        .pc-maydon small { font-size: 9.5px; font-weight: 600; color: ${T.ink2}; }
        .pc-maydon.bosh { color: ${T.ink2}; font-weight: 600; padding: 6px 8px; }
        .pc-maydon.joriy { background: ${T.accentSoft}; box-shadow: 0 0 0 2px ${T.accent}; }
        /* Real vaqt nuqtasi: accent nuqta-halqa + kichik konvert-belgi (boshqa telefondan keladi) */
        .pc-rv { display: block; position: absolute; right: 2px; top: 50%; width: 10px; height: 10px; margin-top: -5px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; animation: pc-tush 0.4s cubic-bezier(.3,1.4,.5,1) both; }
        .pc-kb { display: block; position: absolute; right: 16px; top: -1px; width: 12px; height: 9px; border: 1.5px solid ${T.accent}; border-radius: 2px; background: ${T.paper}; animation: pc-kel 0.6s ease-out 0.15s both; }
        .pc-kb::after { content: ''; position: absolute; left: 2px; top: -1px; width: 5px; height: 5px; border-right: 1.5px solid ${T.accent}; border-bottom: 1.5px solid ${T.accent}; transform: rotate(45deg); }
        .pc-rv-son { position: relative; display: inline-flex; gap: 8px; margin-left: 10px; }
        .pc-rv-son .pc-rv { position: relative; right: auto; top: auto; margin-top: 0; display: inline-block; }
        .pc-rv-son .pc-kb { display: none; }
        /* Qismlar: Backend · Database tugunlari */
        .pc-tg-ust { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; }
        .pc-tg-ust.db { flex: 0 1 auto; }
        .pc-be, .pc-db { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; min-width: 128px; border-radius: 14px; border: 1.5px solid ${T.line}; background: ${T.paper}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35); transition: border-color 0.3s, box-shadow 0.3s, opacity 0.3s; }
        .pc-be.xira, .pc-db.xira { opacity: 0.45; }
        .pc-be.on, .pc-db.on { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.14)}; }
        .pc-be.ok, .pc-db.ok { border-color: ${T.ok}; box-shadow: 0 0 0 4px ${fon(T.ok, 0.12)}; }
        .pc-be.mini, .pc-db.mini { display: inline-flex; flex-direction: row; min-width: 0; padding: 6px 10px; border-radius: 10px; font-size: 12.5px; box-shadow: none; }
        .pc-tg-h { font-size: 13.5px; color: ${T.ink}; white-space: nowrap; }
        .pc-tg-h b { font-weight: 800; }
        .pc-tg-tex { font-weight: 600; color: ${T.ink2}; }
        .pc-tg-q { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; animation: pc-kot 0.35s ease-out both; }
        .pc-tg-ichi { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; padding: 3px 8px; border-radius: 8px; background: ${T.accentSoft}; color: ${T.accent}; animation: pc-kot 0.35s ease-out both; }
        .pc-tg-ichi.ok { background: ${T.okFon}; color: ${T.ok}; animation: pc-yonish 1.4s ease-out both; }
        .pc-ozg { align-self: flex-start; font-size: 11.5px; font-weight: 800; color: ${T.ok}; padding: 2px 8px; border-radius: 8px; animation: pc-yonish 1.2s ease-out both; }
        .pc-soz { font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.paper}; border: 1px solid ${T.line}; padding: 1px 9px; border-radius: 999px; }
        .pc-db-nomlar { display: flex; flex-direction: column; gap: 4px; }
        .pc-db-nom { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 2px 7px; border-radius: 6px; background: ${T.bg}; border: 1px solid ${T.line}; color: ${T.ink}; }
        .pc-db-nom.yon { border-color: ${T.ok}; color: ${T.ok}; }
        .pc-s3-tel { position: sticky; top: 0; }
        .pc-db.ustunli { position: relative; width: 100%; padding-right: 42px; }
        .pc-oz-iz { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: ${T.ink2}; }
        .pc-jadval { display: flex; flex-direction: column; gap: 5px; width: 100%; text-align: left; padding: 8px 10px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; font-family: inherit; color: ${T.ink}; transition: border-color 0.2s, box-shadow 0.2s; }
        button.pc-jadval { cursor: pointer; }
        button.pc-jadval:hover { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.12)}; }
        .pc-jd-n { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 800; color: ${T.ink}; }
        .pc-jd-u { display: flex; flex-wrap: wrap; gap: 5px; }
        .pc-u { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; padding: 2px 7px; border-radius: 6px; border: 1px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; }
        .pc-u.oz { color: ${T.ink2}; background: ${T.bg}; }
        .pc-u.joy { min-width: 26px; text-align: center; border: 1.5px dashed ${fon(T.ink, 0.25)}; background: transparent; color: ${fon(T.ink, 0.35)}; }
        .pc-u.bog { font-weight: 700; border-color: ${T.ink2}; }
        .pc-u.yangi { animation: pc-yonish 1.3s ease-out both; }
        .pc-hash { font-size: 11.5px; color: ${T.ink2}; }
        .pc-boglar { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
        .pc-boglar path { fill: none; stroke: ${T.ink2}; stroke-width: 1.4; stroke-linejoin: round; opacity: 0.7; stroke-dasharray: 420; animation: pc-chiz 1s ease-out both; }
        .pc-boglar circle { fill: ${T.ink2}; }
        .pc-ish-son { font-size: 12px; color: ${T.ink2}; }
        .pc-ish-son b { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: ${T.ink}; }
        .pc-ish-son b.pop { color: ${T.ok}; animation: pc-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .pc-ish-q { align-self: flex-start; font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 3px 8px; border-radius: 6px; color: ${T.ok}; animation: pc-yangi 1.6s ease-out both; }
        /* Chizma: ramka → Backend → Database (SABOQ 21) */
        .pc-chz { position: relative; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .pc-chz-q { display: flex; align-items: center; justify-content: center; gap: 10px; min-width: 0; }
        .pc-chz-tel { flex: none; }
        .pc-chz-ong { display: flex; flex-direction: column; align-items: stretch; gap: 6px; min-width: 0; }
        .pc-ikki { display: flex; gap: 14px; align-items: flex-start; }
        .pc-yolak { position: relative; flex: none; width: 30px; height: 2px; background: ${fon(T.ink, 0.25)}; }
        .pc-yolak::after { content: ''; position: absolute; right: -1px; top: -4px; width: 8px; height: 8px; border-top: 2px solid ${fon(T.ink, 0.35)}; border-right: 2px solid ${fon(T.ink, 0.35)}; transform: rotate(45deg); }
        .pc-pastga { align-self: center; width: 2px; height: 14px; background: ${fon(T.ink, 0.25)}; }
        .pc-konvert { position: absolute; z-index: 6; display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; white-space: nowrap; pointer-events: none; box-shadow: 0 6px 14px -6px rgba(${T.shadowBase},0.5); transform: translate(-50%,-50%); animation: pc-uch ease-in-out forwards; }
        .pc-konvert.javob { background: ${T.ok}; }
        .pc-konvert.nuqta { width: 12px; height: 12px; padding: 0; }
        .pc-konvert.bolak { background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.accent}; font-family: 'Manrope', sans-serif; font-size: 12px; }
        .pc-konvert.sig { width: 24px; height: 24px; padding: 0; justify-content: center; background: ${T.ink}; font-size: 12px; }
        .pc-kv-ic { position: relative; width: 11px; height: 8px; border: 1.5px solid currentColor; border-radius: 2px; flex: none; }
        .pc-kv-ic::after { content: ''; position: absolute; left: 2px; top: -2px; width: 4px; height: 4px; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; transform: rotate(45deg); }
        /* Bashorat (SABOQ 11/19) va natija (SABOQ 25) */
        .pc-navbat-k .q-bashorat { position: relative; outline: 2px solid ${T.accent}; outline-offset: 2px; animation: pc-kot 0.5s cubic-bezier(.2,.9,.3,1.1) both; }
        .pc-navbat-k .q-bashorat::after { content: ''; position: absolute; inset: -6px; border-radius: 16px; border: 2px solid ${T.accent}; opacity: 0; pointer-events: none; animation: pc-tolqin 2.4s ease-in-out 0.8s 4; }
        .pc-navbat-k .q-chip { animation: pc-kot 0.4s ease-out 0.15s both; }
        .pc-navbat-k .q-chip:nth-child(2) { animation-delay: 0.25s; } .pc-navbat-k .q-chip:nth-child(3) { animation-delay: 0.35s; }
        .pc-taxmin { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; padding: 9px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13.5px; transform-origin: top; animation: pc-kot 0.4s ease-out both; }
        .pc-taxmin-y { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: ${T.accent}; }
        .pc-taxmin-s { color: ${T.ink2}; }
        .pc-taxmin b { color: ${T.ink}; }
        .pc-natija { display: flex; flex-direction: column; gap: 8px; }
        .pc-nb { display: flex; flex-direction: column; gap: 6px; }
        .pc-nb-t { font-size: 13.5px; font-weight: 600; color: ${T.ink2}; } .pc-nb-t.ok { color: ${T.ok}; font-weight: 700; } .pc-nb-t b { color: ${T.ink}; }
        .pc-nb-x { font-weight: 600; color: ${T.ink}; }
        p.pc-nom { margin: 0; font-size: 13.5px; font-weight: 600; color: ${T.ink}; text-align: center; }
        .pc-qadam-q .q-qadamlar { flex-direction: row; flex-wrap: wrap; gap: 6px 18px; }
        .pc-hisob { font-size: 12.5px; color: ${T.ink2}; } .pc-hisob b { font-family: 'JetBrains Mono', monospace; color: ${T.ink}; }
        .pc-bolak { align-self: flex-start; padding: 10px 14px; border-radius: 12px; border: 1.5px solid ${T.accent}; background: ${T.paper}; font-size: 14px; font-weight: 700; color: ${T.ink}; box-shadow: 0 10px 22px -14px rgba(${T.shadowBase},0.45); animation: pc-kot 0.4s ease-out both; }
        .pc-bolak.katta { align-self: stretch; display: flex; flex-direction: column; gap: 10px; border-color: ${T.line}; }
        .pc-bolak-t { font-size: 15px; font-weight: 700; color: ${T.ink}; }
        .pc-bolak-ust { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .pc-ikki-tug { display: flex; flex-wrap: wrap; gap: 8px; align-self: flex-start; padding: 2px; }
        .pc-sv-tur { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; }
        .pc-mnote { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 10px; background: ${T.accentSoft}; font-size: 13px; color: ${T.ink}; cursor: pointer; }
        .pc-mnote-l { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: ${T.accent}; }
        .pc-mnote-c { align-self: flex-start; }
        /* 0 · kirish: ilova va sayt yonma-yon, javobdan keyin chizma tug'iladi */
        .pc-hook { display: flex; flex-direction: column; align-items: center; }
        .pc-hook-q { display: flex; gap: 16px; align-items: flex-end; justify-content: center; }
        .pc-hook-chz { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 424px; animation: pc-kot 0.45s ease-out both; }
        .pc-hook-chiz { display: block; width: 100%; height: 34px; overflow: visible; }
        .pc-hook-chiz path { fill: none; stroke: ${T.line}; stroke-width: 2; stroke-dasharray: 420; animation: pc-chiz 0.8s ease-out both; transition: stroke 0.4s; }
        .pc-hook-chz.oq .pc-hook-chiz path { stroke: ${fon(T.ink, 0.4)}; }
        .pc-hook-tg { display: flex; align-items: center; gap: 8px; }
        .pc-hook-tg .pc-be, .pc-hook-tg .pc-db { opacity: 0.45; }
        .pc-hook-chz.oq .pc-hook-tg .pc-be, .pc-hook-chz.oq .pc-hook-tg .pc-db { opacity: 1; }
        /* 1 · reja */
        p.pc-asos-q { margin: 0; align-self: center; display: inline-flex; align-items: center; padding: 7px 12px; border-radius: 10px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 13px; color: ${T.ink}; }
        p.pc-asos-q b { color: ${T.accent}; }
        p.pc-asos-q.tayyor { animation: pc-kot 0.4s ease-out both; }
        p.pc-reja-past { margin: 4px 0 0; font-size: 12.5px; color: ${T.ink2}; }
        /* 3 · jadvallar · 5 · real vaqt · 10 · to'rt savol: chapda telefon, o'ngda ish */
        .pc-s3, .pc-s5, .pc-s10 { position: relative; display: grid; grid-template-columns: auto minmax(0,1fr); gap: 20px; align-items: start; }
        .pc-s3.tugadi { grid-template-columns: minmax(0,1fr); }
        .pc-s5.tugadi { grid-template-columns: minmax(0,1fr); justify-items: center; gap: 12px; }
        .pc-s3-ong, .pc-s5-ong, .pc-s10-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pc-s5 { align-items: center; }
        .pc-s5-ong { max-width: 560px; }
        .pc-ust2 { display: grid; grid-template-columns: minmax(0,1fr) 64px minmax(0,1fr); gap: 8px; }
        .pc-ustun { display: flex; flex-direction: column; gap: 6px; min-height: 92px; padding: 10px 12px; border-radius: 12px; border: 1.5px solid ${T.line}; background: ${T.paper}; transition: border-color 0.4s, box-shadow 0.4s; }
        .pc-ustun.faol { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${fon(T.accent, 0.14)}; }
        .pc-ustun-h { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 800; color: ${T.ink}; }
        .pc-ic-br { position: relative; width: 20px; height: 14px; border: 1.5px solid ${T.ink2}; border-radius: 3px; border-top-width: 4px; flex: none; }
        .pc-ic-tel { width: 11px; height: 18px; border: 1.5px solid ${T.ink2}; border-radius: 3px; flex: none; }
        .pc-teng { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; padding-top: 4px; }
        .pc-teng::before { content: ''; position: absolute; left: 50%; top: 22px; bottom: 0; border-left: 1.5px dashed ${T.line}; }
        .pc-teng-h { position: relative; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink2}; background: ${T.bg}; padding: 0 4px; }
        .pc-teng .pc-sig-joy { position: relative; flex-direction: column; align-items: center; }
        .pc-sig-joy { display: flex; flex-wrap: wrap; gap: 6px; min-height: 26px; }
        .pc-sig { width: 24px; height: 24px; flex: none; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-style: normal; font-size: 12px; font-weight: 800; background: ${T.ink}; color: ${T.paper}; animation: pc-tush 0.45s cubic-bezier(.3,1.4,.5,1) both; transition: background 0.4s, box-shadow 0.4s; }
        .pc-sig.hal { background: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}, 0 0 0 5px ${T.accent}; }
        .pc-sig-iz { font-size: 11.5px; line-height: 1.35; color: ${T.ink2}; }
        .pc-ust2.kichik { grid-template-columns: minmax(0,1fr) 34px minmax(0,1fr); gap: 6px; }
        .pc-ust2.kichik .pc-ustun { min-height: 70px; padding: 8px; }
        .pc-ust2.kichik .pc-ustun-h { font-size: 12px; }
        .pc-ust2.kichik .pc-teng-h { font-size: 9.5px; }
        .pc-ust2.kichik .pc-sig { width: 20px; height: 20px; font-size: 11px; }
        /* 8 · kod */
        .lesson-root ol.pc-vazifa { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .pc-vazifa li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: ${T.ink}; line-height: 1.45; }
        .pc-vazifa li i { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; border: 1.5px solid ${T.line}; color: ${T.ink2}; }
        .pc-vazifa li.ok i { background: ${T.ok}; border-color: ${T.ok}; color: #fff; animation: pc-pop 0.45s ease; }
        .pc-vazifa.ixcham li { font-size: 13px; color: ${T.ink2}; }
        .pc-kyordam { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; margin-top: 12px; }
        .pc-bajardim { display: flex; justify-content: flex-end; margin-top: 12px; }
        .pc-kodoyna { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .pc-amal { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .pc-amal-t { font-size: 13px; color: ${T.ink2}; }
        .pc-no { border: 1px solid ${T.line}; border-radius: 12px; overflow: hidden; background: ${T.paper}; transition: opacity 0.3s; }
        .pc-no.xira { opacity: 0.6; }
        .pc-no-bar { display: flex; align-items: center; gap: 5px; padding: 7px 10px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .pc-no-bar i { width: 8px; height: 8px; border-radius: 50%; background: ${fon(T.ink, 0.18)}; }
        .pc-no-bar b { margin-left: 6px; font-size: 12px; color: ${T.ink2}; }
        .pc-no-tana { display: flex; flex-direction: column; gap: 6px; padding: 14px 16px; }
        p.pc-no-p { margin: 0; font-size: 14px; color: ${T.ink}; }
        p.pc-no-h { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 800; color: ${T.ink}; }
        p.pc-no-h b { display: inline-block; }
        p.pc-no-h b.pop { color: ${T.accent}; animation: pc-pop 0.55s cubic-bezier(.3,1.5,.5,1); }
        .pc-no-btn { align-self: flex-start; padding: 8px 16px; border: 0; border-radius: 10px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; }
        .pc-no-btn:disabled { opacity: 0.45; cursor: default; }
        /* 12 · trek kaliti */
        .pc-trek-k { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; }
        .pc-trek-tug { display: flex; gap: 8px; }
        .pc-klav { display: flex; justify-content: center; }
        /* 13 · mustaqil ish: bitta katta karta */
        .pc-ms-strip { display: flex; flex-wrap: wrap; gap: 6px; }
        .pc-ms-karta { position: relative; display: grid; grid-template-columns: minmax(0,1fr) 216px; gap: 16px; padding: 16px 18px; border-radius: 16px; border: 1.5px solid ${T.line}; background: ${T.paper}; box-shadow: 0 12px 26px -18px rgba(${T.shadowBase},0.4); animation: pc-kot 0.4s ease-out both; }
        .pc-ms-chap { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pc-ms-ong { display: flex; flex-direction: column; justify-content: center; min-width: 0; }
        .pc-ms-tanlov { display: flex; flex-wrap: wrap; gap: 8px; align-self: flex-start; padding: 2px; }
        .pc-ms-tanlov.ustun { flex-direction: column; align-items: flex-start; }
        .pc-ms-n { font-family: 'JetBrains Mono', monospace; color: ${T.accent}; margin-right: 4px; }
        .pc-ms-amal { display: flex; gap: 10px; justify-content: flex-end; align-items: center; }
        .pc-ms-trek { display: flex; gap: 12px; align-self: flex-start; padding: 2px; }
        .q-chip.katta { padding: 14px 24px; font-size: 15px; font-weight: 700; }
        .pc-ms-l { font-size: 13.5px; font-weight: 700; color: ${T.ink}; }
        .pc-inp { width: 100%; padding: 10px 12px; border: 1.5px solid ${T.line}; border-radius: 10px; background: ${T.paper}; font-family: 'Manrope', sans-serif; font-size: 14px; color: ${T.ink}; }
        .pc-inp:focus { outline: 2px solid ${T.accent}; outline-offset: 1px; }
        .pc-ms-tayyor { display: flex; flex-direction: column; gap: 10px; }
        p.pc-ms-qator { margin: 0; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; font-size: 14px; color: ${T.ink}; animation: pc-kot 0.4s ease-out both; }
        .pc-mini { display: flex; align-items: center; justify-content: center; gap: 4px; }
        .pc-mini .pc-yolak { width: 14px; }
        .pc-mini .pc-be.mini, .pc-mini .pc-db.mini { padding: 5px 7px; font-size: 11px; }
        .pc-mini-r { display: inline-flex; align-items: center; justify-content: center; font-size: 10.5px; font-weight: 800; color: ${T.ink}; background: ${T.paper}; animation: pc-pop 0.45s ease; }
        .pc-mini-r.tel { width: 44px; height: 72px; border: 2px solid ${T.ink}; border-radius: 10px; }
        .pc-mini-r.web { width: 84px; height: 58px; border: 1.5px solid ${T.ink}; border-radius: 6px; border-top-width: 6px; }
        .pc-mini-r.bosh { width: 44px; height: 72px; border: 1.5px dashed ${fon(T.ink, 0.35)}; border-radius: 10px; color: ${T.ink2}; }
        /* Amaliyot bloklari: prompt, Yordam, README ko'rinishi */
        .pc-prompt { display: flex; flex-direction: column; gap: 6px; }
        .pc-ps { display: block; font-family: 'Manrope', sans-serif; font-size: 12px; line-height: 1.45; color: ${T.ink}; }
        .pc-prompt-tug { display: inline-flex; gap: 6px; }
        .q-prompt-nusxa.pc-ochiq { background: ${T.accentSoft}; border-color: ${T.accent}; color: ${T.accent}; }
        .pc-joy-q { display: inline; }
        .pc-joy-inp { max-width: 100%; padding: 1px 6px; border: 1.5px dashed ${T.accent}; border-radius: 6px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope', sans-serif; font-size: 12.5px; font-weight: 600; }
        .pc-joy-inp.bosh { border-style: solid; }
        .pc-joy-inp:focus { outline: 2px solid ${T.accent}; outline-offset: 1px; }
        .pc-joy-n { margin: 0 4px; font-family: 'Manrope', sans-serif; font-size: 11px; color: ${T.ink2}; }
        .pc-qotgan { color: ${T.ok}; font-weight: 700; }
        .pc-band { display: block; margin-top: 5px; font-size: 13px; color: ${T.ink2}; }
        .pc-ps.pc-yordam-s { color: ${T.ink2}; }
        p.pc-ortda { margin: 10px 0 0; font-size: 12.5px; line-height: 1.5; color: ${T.ink2}; }
        .pc-md { display: flex; flex-direction: column; gap: 7px; padding: 12px 14px; border-radius: 12px; border: 1px solid ${T.line}; background: ${T.paper}; font-size: 12.5px; color: ${T.ink}; }
        .pc-md-tab { display: block; padding-bottom: 6px; border-bottom: 1px solid ${T.line}; }
        .pc-md-h { display: block; font-size: 16px; font-weight: 800; padding-bottom: 4px; border-bottom: 1px solid ${T.line}; }
        .pc-md-kod { display: block; padding: 8px 10px; border-radius: 8px; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; overflow-wrap: anywhere; }
        .pc-md-kod.xira { opacity: 0.55; }
        .pc-md-j, .pc-md-b { display: block; line-height: 1.5; }
        .pc-gh { display: flex; flex-direction: column; gap: 3px; margin-top: 4px; padding: 8px 10px; border-radius: 10px; border: 1px solid ${T.line}; background: ${T.bg}; }
        .pc-gh-r { display: flex; align-items: center; gap: 6px; font-size: 13px; }
        .pc-gh-ic { width: 14px; height: 14px; border-radius: 50%; background: ${T.ink2}; }
        .pc-gh-f { font-size: 11.5px; color: ${T.ink2}; }
        /* Kartochkalar (SABOQ 16) va yakun */
        .pc-flash.yangi .fc-card:not(.flip) .fc-front { outline: 2px solid ${T.accent}; outline-offset: 3px; animation: pc-tolqin-i 2.4s ease-in-out 0.4s 4; }
        p.pc-fc-ipucha { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0 0; font-size: 13px; font-weight: 700; color: ${T.accent}; }
        p.pc-fc-ipucha i { width: 8px; height: 8px; border-radius: 50%; background: ${T.accent}; }
        .pc-yakun.belgisiz .done-chip { display: none; }
        p.pc-asosiy { margin: 0 0 12px; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        p.pc-keyingi { margin: 14px 0 0; font-size: 14px; line-height: 1.5; color: ${T.ink}; }
        @media (max-width: 640px) {
          .pc-chz-q { flex-direction: column; gap: 6px; }
          .pc-chz-q > .pc-yolak { width: 2px; height: 16px; }
          .pc-chz-q > .pc-yolak::after { right: -4px; top: auto; bottom: -1px; transform: rotate(135deg); }
          .pc-hook-q { gap: 10px; }
          .pc-brauzer { width: 172px; }
          .pc-ikki { gap: 10px; }
          .pc-s3, .pc-s5, .pc-s10 { grid-template-columns: minmax(0,1fr); justify-items: center; }
          .pc-s3-ong, .pc-s5-ong, .pc-s10-ong { width: 100%; padding-top: 0; }
          .pc-ms-karta { grid-template-columns: minmax(0,1fr); }
          .pc-db.ustunli { padding-right: 34px; }
          .pc-chz, .pc-s3, .pc-s5, .pc-s10 { padding-top: 30px; }
        }
        .pc-band .qcode, p.q-blok-t .qcode, p.pc-ortda .qcode { white-space: normal; overflow-wrap: anywhere; }
        @media (prefers-reduced-motion: reduce) {
          .pc-halqa::after, .pc-guruh::after, .pc-halqa-i, .pc-navbat-k .q-bashorat, .pc-navbat-k .q-bashorat::after, .pc-navbat-k .q-chip, .pc-flash.yangi .fc-card .fc-front,
          .pc-tex, .pc-joy-chip, .pc-ekran, .pc-karta, .pc-son.pop, .pc-doiralar i.yangi, .pc-yozilgan, .pc-eski, .pc-rv, .pc-kb, .pc-tg-q, .pc-tg-ichi, .pc-ozg, .pc-u.yangi, .pc-boglar path,
          .pc-ish-son b.pop, .pc-ish-q, .pc-konvert, .pc-taxmin, .pc-bolak, .pc-hook-chz, .pc-hook-chiz path, p.pc-asos-q.tayyor, .pc-sig, .pc-vazifa li.ok i, p.pc-no-h b.pop, .pc-ms-karta, p.pc-ms-qator, .pc-mini-r,
          .pc-tort-b, .pc-oqar, .pc-spin { animation: none !important; }
          .pc-tortiladi, .pc-be, .pc-db, .pc-ustun, .pc-sig, .pc-jadval { transition: none !important; }
        }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(255,79,40,0.35), 0 0 0 1px rgba(255,79,40,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(255,79,40,0.55); }
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
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: 90vh; overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); } /* skeletda tushib qolgan edi — ⛶ ishlamasdi (F-1006-271) */
        .q-fokus:has(.zoom-on) { animation: none; transform: none; } /* qolip .q-fokus (fill both) transform qoldiradi — ⛶ oynasi blokka bog'lanib qolardi (F-1006-286, MEXANIZM-TAKLIF 12) */
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
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(255,79,40,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(255,79,40,0.55), 0 0 3px rgba(255,79,40,0.4); }
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(255,79,40,0.22); }
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
        .ai-line.bad { background: rgba(255,79,40,0.16); box-shadow: inset 0 0 0 1px ${T.accent}; } .ai-line.ok { background: rgba(31,122,77,0.16); }

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
        .bnode.on { opacity: 1; transform: scale(1); }
        .bnode.trig.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.3); }
        .bnode.sheet.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 8px 18px -6px rgba(255,79,40,0.3); }
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
        .itm-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 18px -8px rgba(255,79,40,0.3); }

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
        .fl-node.on { opacity: 1; background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 18px -4px rgba(255,79,40,0.45); transform: translateY(-3px); animation: fl-pulse 1.1s infinite ease-in-out; }
        @keyframes fl-pulse { 0%,100% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 6px 16px -6px rgba(255,79,40,0.4); } 50% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 24px -2px rgba(255,79,40,0.65); } }
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
